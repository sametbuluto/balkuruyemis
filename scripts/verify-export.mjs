import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('out');
const required = [
  'index.html',
  'hakkimizda.html',
  'urunlerimiz.html',
  'subelerimiz.html',
  'iletisim.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
];
for (const file of required)
  assert((await readFile(path.join(output, file))).length > 0, `${file} eksik/boş`);
const html = await readFile(path.join(output, 'index.html'), 'utf8');
const noindex = /name="robots" content="[^"]*noindex/.test(html);
assert(html.includes('lang="tr"'), 'Türkçe dil işareti eksik');
for (const [file, width, height] of [
  ['icon', 32, 32],
  ['apple-touch-icon.png', 180, 180],
  ['opengraph-image', 1200, 630],
]) {
  const bytes = await readFile(path.join(output, file));
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG', file);
  assert.equal(bytes.readUInt32BE(16), width, file);
  assert.equal(bytes.readUInt32BE(20), height, file);
}
const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
assert(!/ornek-sube|konum-[1234]/.test(sitemap), 'Eksik/örnek şube sitemap’e girmiş');
if (noindex) {
  assert(!sitemap.includes('<loc>'), 'İndeksleme kapalıyken sitemap boş olmalı');
  assert(
    (await readFile(path.join(output, 'robots.txt'), 'utf8')).includes('Disallow: /'),
  );
}
// Cloudflare Pages kuralları; geçici Pages alan adlarında her zaman noindex.
await writeFile(
  path.join(output, '_headers'),
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${noindex ? '  X-Robots-Tag: noindex, nofollow\n' : ''}\n/icon\n  Content-Type: image/png\n/opengraph-image\n  Content-Type: image/png\n\nhttps://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\nhttps://:branch.:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n`,
);
const files = await readdir(output, { recursive: true, withFileTypes: true });
const publicFiles = files.filter((file) => file.isFile());
assert(
  !publicFiles.some((file) => file.name === 'server.js' || file.name === '_worker.js'),
  'Sunucu runtime çıktısı beklenmiyor',
);
await writeFile(
  '.next/static-export-report.json',
  JSON.stringify(
    {
      required,
      noindex,
      fileCount: publicFiles.length,
      images: 'PNG imzaları ve boyutları doğrulandı',
      hosting: 'out/ — yalnızca statik dosyalar',
    },
    null,
    2,
  ) + '\n',
);
process.stdout.write(
  `Static export doğrulandı: ${publicFiles.length} dosya; noindex=${noindex}; ikonlar, 404, robots ve sitemap hazır.\n`,
);
