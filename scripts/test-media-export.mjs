import assert from 'node:assert/strict';
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
import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { createStaticServer } from './serve-static.mjs';
const root = process.cwd();
const directory = await mkdtemp(path.join(tmpdir(), 'bal-media-export-'));
for (const name of [
  'src',
  'content',
  'tests',
  'scripts',
  'public',
  'tsconfig.media.json',
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
const imagePath = path.join(directory, 'public/images/gallery/test.jpg');
const original = await sharp({
  create: { width: 480, height: 240, channels: 3, background: '#ce142b' },
})
  .withMetadata()
  .jpeg()
  .toBuffer();
const image = {
  id: 'media-test',
  url: '/images/gallery/test.jpg',
  alt: 'Yalnız test renk alanı',
  width: 480,
  height: 240,
  sortOrder: 1,
  status: 'published',
  usages: ['home-hero', 'brand-gallery', 'branches-gallery'],
};
const jsonFile = path.join(directory, 'content/gallery/media-test.json');
async function build(name) {
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: '',
      NEXT_PUBLIC_ALLOW_INDEXING: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });
  const log = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  await writeFile(path.join(directory, `${name}.log`), log);
  return { status: result.status, log };
}
await writeFile(imagePath, original);
for (const [name, json, bytes] of [
  ['malformed', '{', original],
  ['missing-alt', JSON.stringify({ ...image, alt: '' }), original],
  ['bad-image', JSON.stringify(image), Buffer.from('not an image')],
]) {
  await writeFile(jsonFile, json);
  await writeFile(imagePath, bytes);
  const result = await build(name);
  assert.equal(result.status, 1, `${name} build reddi: ${directory}`);
  assert.match(result.log, /Galeri JSON doğrulaması|Medya doğrulaması/);
}
await writeFile(jsonFile, JSON.stringify(image));
await writeFile(imagePath, original);
const small = '/images/gallery/small.webp';
await writeFile(
  path.join(directory, 'public', small),
  await sharp(original).resize(240, 120).webp().toBuffer(),
);
await writeFile(
  jsonFile,
  JSON.stringify({
    ...image,
    variants: [{ url: small, width: 240, format: 'image/webp' }],
  }),
);
const draft = {
  ...image,
  id: 'media-draft',
  url: '/images/gallery/draft.jpg',
  alt: 'MEDIA_DRAFT_ONLY_SENTINEL',
  status: 'draft',
};
await writeFile(
  path.join(directory, 'content/gallery/media-draft.json'),
  JSON.stringify(draft),
);
await writeFile(path.join(directory, 'public/images/gallery/draft.jpg'), original);
await writeFile(path.join(directory, 'public/images/gallery/orphan.jpg'), original);
// Ürün ve şube JSON'undaki gömülü medyanın da aynı kapıdan geçtiğini sınar.
const categories = await readdir(path.join(directory, 'content/categories'));
const category = JSON.parse(
  await readFile(
    path.join(
      directory,
      'content/categories',
      categories.find((f) => f.endsWith('.json')),
    ),
    'utf8',
  ),
);
await writeFile(
  path.join(directory, 'content/products/product-media-test.json'),
  JSON.stringify({
    id: 'product-media-test',
    slug: 'media-test',
    categoryId: category.id,
    name: 'Yalnız test ürünü',
    description: 'İzole medya fixture',
    images: [
      {
        id: 'product-photo',
        url: image.url,
        alt: 'Yalnız ürün test görseli',
        width: 480,
        height: 240,
      },
    ],
    status: 'published',
    sortOrder: 1,
  }),
);
const branchFile = path.join(directory, 'content/branches/location-1.json');
const branch = JSON.parse(await readFile(branchFile, 'utf8'));
await writeFile(
  branchFile,
  JSON.stringify({
    ...branch,
    images: [
      {
        id: 'branch-photo',
        url: image.url,
        alt: 'Yalnız şube test görseli',
        width: 480,
        height: 240,
      },
    ],
  }),
);
const result = await build('valid-export');
assert.equal(result.status, 0, `${directory}\n${result.log}`);
const output = path.join(directory, 'out');
const sanitized = await sharp(await readFile(path.join(output, image.url))).metadata();
assert.equal(sanitized.exif, undefined);
assert.equal(sanitized.xmp, undefined);
assert.equal(sanitized.icc, undefined);
assert.deepEqual(await readFile(imagePath), original, 'Kaynak fotoğraf değişmemeli.');
for (const entry of await readdir(output, { recursive: true, withFileTypes: true })) {
  if (entry.isFile() && /\.(html|txt|xml|json|js)$/.test(entry.name))
    assert(
      !(await readFile(path.join(entry.parentPath, entry.name), 'utf8')).includes(
        draft.alt,
      ),
      'Taslak metadata sızdı.',
    );
}
const server = createStaticServer(await realpath(output));
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  for (const url of [
    draft.url,
    '/images/gallery/orphan.jpg',
    '/content/gallery/media-test.json',
  ])
    assert.equal((await fetch(origin + url)).status, 404);
  assert.equal(
    (await fetch(origin + image.url)).headers.get('content-type'),
    'image/jpeg',
  );
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    headless: true,
  });
  const page = await browser.newPage();
  for (const width of [320, 393, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin);
    const hero = page.getByRole('img', { name: image.alt, exact: true }).first();
    assert.equal(await hero.getAttribute('loading'), 'eager');
    assert.equal(await hero.getAttribute('fetchpriority'), 'high');
    const gallery = page.getByRole('group', { name: 'Mağazalarımızdan fotoğraflar' });
    assert.equal(await gallery.getByRole('img').getAttribute('loading'), 'lazy');
    assert((await gallery.locator('source').getAttribute('srcset')).includes('240w'));
    for (const img of await page.getByRole('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((el) => el.decode());
      assert(await img.evaluate((el) => el.complete && el.naturalWidth > 0));
    }
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({
      path: path.join(directory, `media-${width}.png`),
      fullPage: true,
    });
  }
  await page.goto(`${origin}/urunlerimiz`);
  await page.getByRole('img', { name: 'Yalnız ürün test görseli' }).waitFor();
  await page.goto(`${origin}/subelerimiz`);
  await page.getByRole('img', { name: 'Yalnız şube test görseli' }).waitFor();
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
// Preflight ile export arasında dosya değişirse, yayın artefaktını kabul etme.
await writeFile(imagePath, await sharp(original).negate().jpeg().toBuffer());
const drift = spawnSync('node', ['scripts/run-media.mjs', 'export'], {
  cwd: directory,
  encoding: 'utf8',
});
await writeFile(path.join(directory, 'drift.log'), `${drift.stdout}\n${drift.stderr}`);
assert.equal(drift.status, 1);
assert.match(drift.stderr, /build sırasında değişti/);
process.stdout.write(
  `Medya export 5/5 geçti: üç negatif build, temiz yayın/responsive ve drift reddi. İzole kanıt: ${directory}\n`,
);
