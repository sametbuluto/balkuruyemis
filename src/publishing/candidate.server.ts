import { mkdtemp, mkdir, writeFile, readdir, lstat, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { prepareCmsData } from '../cms/adapter.server';
import {
  inspectSource,
  exportDataSnapshot,
  assertPins,
  type SourcePins,
} from './git-source.server';
import { mergeCanonicalData } from './three-way';
import { loadCategories } from '../content/categories.server';
import { loadProducts } from '../content/products.server';
import { loadBranches } from '../content/branches.server';
import { loadGallery } from '../content/gallery.server';
import { loadAnnouncements } from '../content/announcements.server';
import { readEditorial } from '../content/editorial.server';
import {
  pageSchemas,
  siteSchema,
  socialSchema,
  type PageId,
  type Parser,
  type PageCopy,
} from '../content/editorial-schema';
import { validateMediaFiles } from '../content/media-files.server';

function dataMap(value: Awaited<ReturnType<typeof prepareCmsData>>) {
  const files = new Map<string, Buffer>();
  for (const [name, record] of value.canonical)
    files.set(`content/${name}`, Buffer.from(JSON.stringify(record)));
  for (const [url, bytes] of value.images) files.set(`public${url}`, bytes);
  return files;
}
async function writeData(output: string, files: ReadonlyMap<string, Buffer>) {
  for (const area of [
    'categories',
    'products',
    'branches',
    'gallery',
    'pages',
    'settings',
    'announcements',
  ])
    await mkdir(path.join(output, 'content', area), { recursive: true });
  for (const area of ['brand', 'products', 'categories', 'branches', 'gallery'])
    await mkdir(path.join(output, 'public/images', area), { recursive: true });
  for (const [file, bytes] of files) {
    const target = path.join(output, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
}
function validateJson(root: string) {
  const categories = loadCategories(path.join(root, 'content/categories'));
  const products = loadProducts(path.join(root, 'content/products'), categories);
  const branches = loadBranches(path.join(root, 'content/branches'));
  const gallery = loadGallery(path.join(root, 'content/gallery'));
  const announcements = loadAnnouncements(path.join(root, 'content/announcements'));
  for (const id of Object.keys(pageSchemas) as PageId[])
    readEditorial(
      `pages/${id}.json`,
      pageSchemas[id] as Parser<PageCopy<typeof id>>,
      root,
    );
  readEditorial('settings/site.json', siteSchema, root);
  readEditorial('settings/social.json', socialSchema, root);
  return [
    ...categories.flatMap((v) => (v.image ? [v.image] : [])),
    ...products.flatMap((v) => v.images),
    ...branches.flatMap((v) => v.images),
    ...gallery,
    ...announcements.flatMap((v) => (v.image ? [v.image] : [])),
  ];
}
/** Yerel ve salt okunur Git hazırlığı. Tam build/required checks/merge veya uzak yetki değildir. */
export async function prepareGitCandidate(
  repository: string,
  pins: SourcePins,
  output: string,
) {
  const repo = await realpath(repository),
    target = path.resolve(output);
  const resolvedTarget = path.join(
    await realpath(path.dirname(target)),
    path.basename(target),
  );
  if (resolvedTarget === repo || !path.relative(repo, resolvedTarget).startsWith('..'))
    throw new Error('Candidate depo dışında ayrı boş dizin olmalı.');
  try {
    const stat = await lstat(resolvedTarget);
    if (!stat.isDirectory() || (await readdir(resolvedTarget)).length)
      throw new Error('Candidate çıktı dizini boş/normal olmalı.');
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT'))
      throw error;
  }
  const source = inspectSource(repo, pins);
  const work = await mkdtemp(path.join(tmpdir(), 'bal-publish-snapshots-'));
  const base = path.join(work, 'base'),
    main = path.join(work, 'main'),
    content = path.join(work, 'source');
  await exportDataSnapshot(repo, source.baseSha, base);
  await exportDataSnapshot(repo, pins.mainSha, main);
  await exportDataSnapshot(repo, pins.sourceSha, content);
  // Üç taraf da aynı trusted kod/encoder ile normalize edilir: JPEG/JSON biçim farkı sahte değişim olmaz.
  const b = dataMap(await prepareCmsData(base, base)),
    m = dataMap(await prepareCmsData(main, main)),
    s = dataMap(await prepareCmsData(content, base));
  const merged = mergeCanonicalData(b, m, s);
  // Üç yönlü alan merge'i yeni telefon/URL ile başka commit'in onayını eşleştiremez.
  const sitePath = 'content/settings/site.json',
    socialPath = 'content/settings/social.json';
  const mergedSite = siteSchema(
    JSON.parse(merged.get(sitePath)!.toString('utf8')) as unknown,
    'merged site',
  );
  const mainSite = siteSchema(
    JSON.parse(m.get(sitePath)!.toString('utf8')) as unknown,
    'main site',
  );
  merged.set(
    sitePath,
    Buffer.from(
      JSON.stringify(
        {
          ...mergedSite,
          phoneVerified:
            mergedSite.phoneVerified &&
            mainSite.phoneVerified &&
            mergedSite.phone === mainSite.phone,
          emailVerified:
            mergedSite.emailVerified &&
            mainSite.emailVerified &&
            mergedSite.email === mainSite.email,
        },
        null,
        2,
      ) + '\n',
    ),
  );
  const mergedSocial = socialSchema(
    JSON.parse(merged.get(socialPath)!.toString('utf8')) as unknown,
    'merged social',
  );
  const mainSocial = socialSchema(
    JSON.parse(m.get(socialPath)!.toString('utf8')) as unknown,
    'main social',
  );
  merged.set(
    socialPath,
    Buffer.from(
      JSON.stringify(
        Object.fromEntries(
          (['instagram', 'whatsapp'] as const).map((key) => [
            key,
            {
              ...mergedSocial[key],
              verified:
                mergedSocial[key].verified &&
                mainSocial[key].verified &&
                mergedSocial[key].url === mainSocial[key].url,
            },
          ]),
        ),
        null,
        2,
      ) + '\n',
    ),
  );
  const staging = path.join(work, 'merged');
  await writeData(staging, merged);
  await validateMediaFiles(validateJson(staging), staging);
  const hash = createHash('sha256');
  for (const [file, bytes] of merged) hash.update(file + '\0').update(bytes);
  assertPins(repo, pins); // Eşzamanlı main/content-edit değişimi bütün sonucu geçersiz kılar.
  await mkdir(resolvedTarget, { recursive: true });
  await writeData(resolvedTarget, merged);
  const report = {
    ...source,
    candidateDataFingerprint: hash.digest('hex'),
    candidateCommitSha: null,
    sourceCodeExecuted: false,
    gitRefWritten: false,
    fullChecksRun: false,
    remoteProtectionVerified: false,
    snapshots: work,
  };
  await writeFile(
    path.join(resolvedTarget, 'publication-report.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  return report;
}
