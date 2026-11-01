import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import { createStaticServer } from './serve-static.mjs';

// Sentetik JSON ve kimlik onayı yalnız geçici kopyaya eklenir; gerçek kaynak/out değişmez.
const root = process.cwd();
const directory = await mkdtemp(path.join(tmpdir(), 'bal-branch-export-'));
for (const name of [
  'scripts',
  'tsconfig.media.json',
  'src',
  'content',
  'tests',
  'public',
  'next.config.ts',
  'next-env.d.ts',
  'tsconfig.json',
  'package.json',
  'package-lock.json',
  'postcss.config.mjs',
])
  await cp(path.join(root, name), path.join(directory, name), { recursive: true });
await symlink(
  path.join(root, 'node_modules'),
  path.join(directory, 'node_modules'),
  'dir',
);
const file = path.join(directory, 'content/branches/location-1.json');
const original = JSON.parse(await readFile(file, 'utf8'));
const build = async (name, indexable = false) => {
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: indexable ? 'https://example.com' : '',
      NEXT_PUBLIC_ALLOW_INDEXING: indexable ? 'true' : 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });
  const log = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  await writeFile(path.join(directory, `${name}.log`), log);
  return { status: result.status, log };
};
const upgraded = {
  ...original,
  slug: 'test-sube',
  name: 'Yalnızca test şubesi',
  address: 'Yalnızca test adresi',
  contentKind: 'verified',
};
for (const [name, source] of [
  ['malformed-json', '{'],
  ['unknown-field', JSON.stringify({ ...original, hidden: true })],
  [
    'wrong-maps',
    JSON.stringify({ ...original, googleMapsUrl: 'https://maps.google.com/?q=0,0' }),
  ],
  ['unapproved-identity', JSON.stringify(upgraded)],
]) {
  await writeFile(file, source);
  const result = await build(name);
  assert.equal(result.status, 1, `${name}: build reddi bekleniyor. ${directory}`);
  assert.match(result.log, /Şube JSON doğrulaması/);
}
// Yeni fiziksel kayıt + mevcut location-1 kimlik yükseltmesi aynı veri akışını sınar.
await writeFile(file, JSON.stringify(upgraded));
const added = {
  ...upgraded,
  id: 'branch-fixture-added',
  slug: 'test-yeni-sube',
  name: 'Yalnız test ek şube',
  address: 'Yalnız test ek adres',
  coordinates: null,
  googleMapsUrl: null,
  sortOrder: 99,
};
const draft = {
  ...added,
  id: 'branch-fixture-draft',
  slug: 'test-draft-sube',
  name: 'C2_DRAFT_BRANCH_SENTINEL',
  address: 'C2_DRAFT_ADDRESS_SENTINEL',
  status: 'draft',
};
for (const entry of [added, draft])
  await writeFile(
    path.join(directory, 'content/branches', `${entry.id}.json`),
    JSON.stringify(entry),
  );
const approvals = [upgraded, added, draft].map((entry) => ({
  id: entry.id,
  fingerprint: createHash('sha256')
    .update(
      JSON.stringify([
        entry.id,
        entry.slug,
        entry.name,
        entry.address,
        entry.coordinates?.latitude ?? null,
        entry.coordinates?.longitude ?? null,
      ]),
    )
    .digest('hex'),
}));
// Teknik onay kopyada ayrıca yazılır; JSON bayrağı tek başına onay olamaz.
const identityFile = path.join(directory, 'src/content/branch-identity.ts');
const identitySource = await readFile(identityFile, 'utf8');
const identityMarker =
  'export const approvedBranchIdentities: readonly BranchIdentityApproval[] = [];';
assert(identitySource.includes(identityMarker), 'Teknik onay tanımı bulunamadı.');
await writeFile(
  identityFile,
  identitySource.replace(
    identityMarker,
    `export const approvedBranchIdentities: readonly BranchIdentityApproval[] = ${JSON.stringify(approvals)};`,
  ),
);
const result = await build('verified-and-draft', true);
assert.equal(result.status, 0, `İzole build başarısız: ${directory}\n${result.log}`);
const output = path.join(directory, 'out');
for (const entry of [upgraded, added]) {
  const html = await readFile(
    path.join(output, 'subelerimiz', `${entry.slug}.html`),
    'utf8',
  );
  assert(html.includes(entry.name));
  assert(html.includes(entry.address));
}
const home = await readFile(path.join(output, 'index.html'), 'utf8');
assert(
  home.includes('beş buluşma noktası'),
  'Yeni kayıttan türeyen şube sayımı bozuldu.',
);
assert(!home.includes('altı buluşma noktası'), 'Draft kayıt sayıldı.');
for (const entry of await readdir(output, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.(html|txt|xml|json|js)$/.test(entry.name)) continue;
  const text = await readFile(path.join(entry.parentPath, entry.name), 'utf8');
  for (const marker of [draft.id, draft.slug, draft.name, draft.address])
    assert(!text.includes(marker), `Draft sızdı: ${entry.name}`);
  assert(
    !text.includes('"@type":"LocalBusiness"'),
    'Bu migration LocalBusiness üretmemeli.',
  );
}
const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
for (const entry of [upgraded, added])
  assert(sitemap.includes(`https://example.com/subelerimiz/${entry.slug}`));
for (const marker of [draft.slug, 'location-2', 'location-3', 'location-4', 'konum-2'])
  assert(!sitemap.includes(marker));
const server = createStaticServer(await realpath(output));
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  assert.equal((await fetch(`${origin}/subelerimiz/test-sube`)).status, 200);
  for (const slug of ['test-draft-sube', 'konum-2', 'bilinmeyen-sube'])
    assert.equal((await fetch(`${origin}/subelerimiz/${slug}`)).status, 404);
  assert.equal((await fetch(`${origin}/content/branches/location-1.json`)).status, 404);
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    headless: true,
  });
  const page = await browser.newPage();
  for (const width of [320, 393, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${origin}/subelerimiz`);
    assert.equal(await page.getByRole('article').count(), 5);
    const link = page
      .getByRole('article', { name: upgraded.name, exact: true })
      .getByRole('link', { name: /Şubeyi keşfedin/ });
    await link.click();
    await page
      .getByRole('heading', { level: 1, name: upgraded.name, exact: true })
      .waitFor();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({
      path: path.join(directory, `branch-detail-${width}.png`),
      fullPage: true,
    });
  }
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
process.stdout.write(
  `Şube export sözleşmesi 5/5 geçti: dört build reddi; onaylı detay/yeni şube/draft/HTTP ve dört genişlik. İzole kanıt: ${directory}\n`,
);
