import { getPublishedAnnouncements } from './announcements';
import { getBuildInstant } from './build-clock';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { allMedia } from './validation';
import { getContentBundle, validateContentBundle } from './content.server';
import { getPublishedCategories, getPublishedProducts } from './queries';
import { getVisibleBranches } from './branches';
import { getGalleryEntries } from './gallery';
import { selectPublishedMedia } from './media-selection';
import { validateMediaFiles, writeSanitizedImages } from './media-files.server';

async function main() {
  const content = getContentBundle();
  validateContentBundle(content);
  const files = await validateMediaFiles(allMedia(content));
  const inputHash = createHash('sha256');
  for (const area of [
    'categories',
    'products',
    'branches',
    'gallery',
    'pages',
    'settings',
    'announcements',
  ]) {
    for (const file of (await readdir(path.join('content', area)))
      .filter((file) => file.endsWith('.json'))
      .sort()) {
      inputHash
        .update(`${area}/${file}\0`)
        .update(await readFile(path.join('content', area, file)));
    }
  }
  for (const [url, file] of files) inputHash.update(url).update(file.digest);
  const fingerprint = inputHash.digest('hex');
  const reportPath = path.join('.generated', 'media-check.json');
  if (process.argv[2] === 'export') {
    const before: unknown = JSON.parse(await readFile(reportPath, 'utf8'));
    if (
      typeof before !== 'object' ||
      before === null ||
      !('fingerprint' in before) ||
      before.fingerprint !== fingerprint
    )
      throw new Error(
        'Medya/içerik build sırasında değişti; çıktı güvenilir değil. Yeniden build gerekli.',
      );
    const buildAt =
      'buildAt' in before && typeof before.buildAt === 'string'
        ? new Date(before.buildAt)
        : getBuildInstant();
    const publicMedia = [
      ...getPublishedAnnouncements(buildAt).flatMap((entry) =>
        entry.image ? [entry.image] : [],
      ),
      ...selectPublishedMedia(
        [content.brandAssets.logo, content.brandAssets.inverseLogo].filter(
          (value) => value !== null,
        ),
      ),
      ...getPublishedCategories().flatMap((entry) => (entry.image ? [entry.image] : [])),
      ...getPublishedProducts().flatMap((entry) => entry.images),
      ...getVisibleBranches().flatMap((entry) => entry.images),
      ...selectPublishedMedia(getGalleryEntries()),
    ];
    const publishedFiles = await writeSanitizedImages(publicMedia, files);
    await writeFile(
      path.join('.generated', 'media-export.json'),
      JSON.stringify(
        {
          fingerprint,
          publishedFiles,
          metadata: 're-encoded without source EXIF/XMP/IPTC',
          resized: false,
        },
        null,
        2,
      ),
    );
    process.stdout.write(
      `Medya export: ${publishedFiles} temizlenmiş dosya; taslak/kullanılmayan dosyalar dışlandı.\n`,
    );
  } else {
    await mkdir('.generated', { recursive: true });
    await writeFile(
      reportPath,
      JSON.stringify(
        { fingerprint, files: files.size, buildAt: getBuildInstant().toISOString() },
        null,
        2,
      ),
    );
    process.stdout.write(`Medya ön kontrol: ${files.size} dosya doğrulandı.\n`);
  }
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Medya kontrolü başarısız.');
  process.exitCode = 1;
});
