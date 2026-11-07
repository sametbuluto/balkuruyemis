import assert from 'node:assert/strict';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
  symlink,
  realpath,
  readdir,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import yaml from 'js-yaml';
import { chromium } from '@playwright/test';
import { cmsWrite } from './cms-wire.mjs';
import { createStaticServer } from './serve-static.mjs';
const root = process.cwd();
const directory = await mkdtemp(path.join(tmpdir(), 'bal-cms-roundtrip-'));
console.log(`İzole CMS fixture: ${directory}`);
const source = path.join(directory, 'source'),
  candidate = path.join(directory, 'candidate'),
  site = path.join(directory, 'site');
await mkdir(source);
await mkdir(site);
for (const name of ['content', 'public'])
  await cp(name, path.join(source, name), { recursive: true });
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
  '.pages.yml',
])
  await cp(name, path.join(site, name), { recursive: true });
await symlink(path.join(root, 'node_modules'), path.join(site, 'node_modules'), 'dir');
const config = yaml.load(await readFile('.pages.yml', 'utf8'));
const entries = config.content.flatMap((e) => e.items ?? [e]);
const get = (name) => entries.find((e) => e.name === name);
const read = async (file) =>
  JSON.parse(await readFile(path.join(source, 'content', file), 'utf8'));
const save = async (file, value) =>
  writeFile(path.join(source, 'content', file), JSON.stringify(value, null, 2));
const pixels = await sharp({
  create: { width: 40, height: 20, channels: 3, background: '#ce142b' },
})
  .withMetadata({ orientation: 6 })
  .jpeg()
  .toBuffer();
await writeFile(path.join(source, 'public/images/products/picked.jpg'), pixels);
await writeFile(path.join(source, 'public/images/gallery/hero.jpg'), pixels);
const product = await cmsWrite(
  get('products'),
  {
    name: 'CMS YALNIZ TEST ÜRÜNÜ',
    categoryId: 'category-kahve',
    description: 'İzole CMS wire testi. Gerçek ürün değildir.',
    images: [{ url: 'public/images/products/picked.jpg', alt: 'Geometrik test resmi' }],
    status: 'published',
  },
  config,
);
assert(!Object.hasOwn(product, 'id'));
assert(!Object.hasOwn(product.images[0], 'width'));
assert.match(product.editorKey, /^[a-f0-9-]{36}$/);
assert.equal(product.images[0].url, '/images/products/picked.jpg');
await save(`products/product-${product.editorKey}.json`, product);
const draft = await cmsWrite(
  get('products'),
  {
    ...product,
    editorKey: undefined,
    name: 'CMS_PRIVATE_DRAFT_SENTINEL',
    status: 'draft',
    images: [],
  },
  config,
);
await save(`products/product-${draft.editorKey}.json`, draft);
const home = await read('pages/home.json');
const changedHome = structuredClone(home);
changedHome.hero.titleLead = 'CMS alan eşleme testi';
changedHome.hero.titleAccent = 'Güvenli içerik.';
await save(
  'pages/home.json',
  await cmsWrite(get('page-home'), changedHome, config, home),
);
const about = await read('pages/about.json');
const changedAbout = structuredClone(about);
changedAbout.story.description = 'CMS Hakkımızda kaynak testi.';
await save(
  'pages/about.json',
  await cmsWrite(get('page-about'), changedAbout, config, about),
);
const branch = await read('branches/location-1.json');
await save(
  'branches/location-1.json',
  await cmsWrite(
    get('branches'),
    { ...branch, name: 'Konum 1 — yalnız izole test' },
    config,
    branch,
  ),
);
const category = await read('categories/category-kahve.json');
await save(
  'categories/category-kahve.json',
  await cmsWrite(
    get('categories'),
    { ...category, description: category.description + ' İzole eşleme kontrolü.' },
    config,
    category,
  ),
);
const gallery = await cmsWrite(
  get('gallery'),
  {
    url: 'public/images/gallery/hero.jpg',
    alt: 'İzole hero testi',
    status: 'published',
    usages: ['home-hero', 'brand-gallery'],
  },
  config,
);
await save(`gallery/gallery-${gallery.editorKey}.json`, gallery);
const announcement = await cmsWrite(
  get('announcements'),
  {
    title: 'CMS YALNIZ TEST DUYURUSU',
    description: 'İzole duyuru akışı.',
    status: 'published',
    startsAt: '2026-11-07T15:00:00+03:00',
  },
  config,
);
await save(`announcements/announcement-${announcement.editorKey}.json`, announcement);
// Aynı native sanitize boş/null sosyal ve site alanlarını kaldırır; candidate geri normalize eder.
for (const [id, name] of [
  ['site', 'settings-site'],
  ['social', 'settings-social'],
]) {
  const current = await read(`settings/${id}.json`);
  await save(`settings/${id}.json`, await cmsWrite(get(name), current, config, current));
}
async function run(command, args, cwd, log) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      SITE_BUILD_AT: '2026-11-07T12:00:00.000Z',
      NEXT_PUBLIC_SITE_URL: '',
      NEXT_PUBLIC_ALLOW_INDEXING: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });
  await writeFile(path.join(directory, log), `${result.stdout}\n${result.stderr}`);
  assert.equal(result.status, 0, `Kontrol başarısız: ${directory}/${log}`);
}
await run('node', ['scripts/run-cms.mjs', source, root, candidate], root, 'prepare.log');
const normalized = JSON.parse(
  await readFile(
    path.join(candidate, 'content/products', `product-${product.editorKey}.json`),
    'utf8',
  ),
);
assert.equal(normalized.id, `product-${product.editorKey}`);
assert.equal(normalized.images[0].width, 20);
assert.equal(normalized.images[0].height, 40);
assert(!Object.hasOwn(normalized, 'editorKey'));
const cleaned = await sharp(
  path.join(candidate, 'public/images/products/picked.jpg'),
).metadata();
assert(!cleaned.exif);
assert(!cleaned.icc);
assert((await sharp(pixels).metadata()).exif);
assert.deepEqual(
  await readFile(path.join(source, 'public/images/products/picked.jpg')),
  pixels,
);
// Normalleştirme sonrası, aynı kaynak tekrar okunup aynı canonical veri üretilir.
const second = path.join(directory, 'second');
await run(
  'node',
  ['scripts/run-cms.mjs', source, root, second],
  root,
  'prepare-again.log',
);
assert.deepEqual(
  await readFile(
    path.join(second, 'content/products', `product-${product.editorKey}.json`),
  ),
  await readFile(
    path.join(candidate, 'content/products', `product-${product.editorKey}.json`),
  ),
);
// İkinci edit: canonical kaydı CMS formundan yeniden kaydet; yeni fotoğrafta eski ölçüleri isteme.
const replacementPixels = await sharp({
  create: { width: 60, height: 30, channels: 3, background: 'black' },
})
  .jpeg()
  .toBuffer();
await writeFile(
  path.join(source, 'public/images/products/replaced.jpg'),
  replacementPixels,
);
const updated = await cmsWrite(
  get('products'),
  {
    ...normalized,
    editorKey: product.editorKey,
    name: 'CMS ADI DEĞİŞTİRİLEN TEST ÜRÜNÜ',
    images: [{ url: 'public/images/products/replaced.jpg', alt: product.images[0].alt }],
  },
  config,
  normalized,
);
await save(`products/product-${product.editorKey}.json`, updated);
const replacement = path.join(directory, 'replacement');
await run(
  'node',
  ['scripts/run-cms.mjs', source, candidate, replacement],
  root,
  'replacement.log',
);
const replaced = JSON.parse(
  await readFile(
    path.join(replacement, 'content/products', `product-${product.editorKey}.json`),
    'utf8',
  ),
);
assert.equal(replaced.slug, normalized.slug);
assert.equal(replaced.id, normalized.id);
assert.equal(replaced.images[0].width, 60);
assert.equal(replaced.images[0].height, 30);
product.name = updated.name;

// CMS save'i onay alanını yükseltemez. Hatalı dosya tüm paketi durdurur.
const tampered = await read('branches/location-1.json');
await save('branches/location-1.json', { ...tampered, contentKind: 'verified' });
const rejected = spawnSync(
  'node',
  ['scripts/run-cms.mjs', source, root, path.join(directory, 'rejected')],
  { cwd: root, encoding: 'utf8' },
);
assert.equal(rejected.status, 1);
assert.match(rejected.stderr, /korunan/);
await save('branches/location-1.json', tampered);
for (const name of ['content', 'public/images'])
  await cp(path.join(replacement, name), path.join(site, name), { recursive: true });
await run('npm', ['run', 'build'], site, 'static-build.log');
const out = path.join(site, 'out');
const html = await readFile(path.join(out, 'index.html'), 'utf8');
assert(html.includes('CMS alan eşleme testi'));
assert(html.includes(announcement.title));
for (const entry of await readdir(out, { recursive: true, withFileTypes: true }))
  if (entry.isFile() && /\.(html|txt|js|json|xml)$/.test(entry.name))
    assert(
      !(await readFile(path.join(entry.parentPath, entry.name), 'utf8')).includes(
        'CMS_PRIVATE_DRAFT_SENTINEL',
      ),
    );
const server = createStaticServer(await realpath(out));
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    headless: true,
  });
  const page = await browser.newPage();
  for (const width of [320, 393, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin);
    assert(
      (await page.getByRole('heading', { level: 1 }).innerText()).includes(
        'CMS alan eşleme testi',
      ),
    );
    const hero = page.locator('main img[alt="İzole hero testi"]').first();
    await hero.waitFor();
    assert.notEqual(await hero.getAttribute('loading'), 'lazy');
    assert.equal(
      await page
        .locator('link[rel="preload"][as="image"][href="/images/gallery/hero.jpg"]')
        .count(),
      1,
    );
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.goto(origin + '/urunlerimiz?kategori=kahve');
    await page.getByRole('heading', { name: product.name, exact: true }).waitFor();
    const photo = page.locator(`img[alt="${product.images[0].alt}"]`).first();
    await photo.scrollIntoViewIfNeeded();
    await photo.evaluate((img) => img.decode());
    assert.equal(await photo.getAttribute('loading'), 'lazy');
    assert.equal(await photo.evaluate((img) => img.naturalWidth), 60);
    await page.screenshot({
      path: path.join(directory, `catalog-${width}.png`),
      fullPage: true,
    });
  }
  await page.goto(origin + '/hakkimizda');
  assert(
    (await page.locator('main').innerText()).includes(changedAbout.story.description),
  );
  await page.goto(origin + '/subelerimiz');
  assert(
    (await page.locator('main').innerText()).includes('Konum 1 — yalnız izole test'),
  );
  assert.equal((await fetch(origin + '/subelerimiz/location-1')).status, 404);
  assert.equal(
    (await fetch(origin + '/content/products/product-' + product.editorKey + '.json'))
      .status,
    404,
  );
  assert(!html.includes('LocalBusiness'));
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
}
await writeFile(
  path.join(directory, 'result.json'),
  JSON.stringify(
    {
      nativeHelpers: true,
      hostedCmsTest: false,
      manualPixels: false,
      manualId: false,
      sourceExifStillPresent: true,
      candidateExifRemoved: true,
      staticBuild: true,
      widths: [320, 393, 768, 1280],
    },
    null,
    2,
  ),
);
console.log(
  `CMS kaynak tabanlı yerel round-trip geçti: otomatik kimlik/ölçü, ürün/kategori/şube/metin/duyuru/fotoğraf, draft/kimlik kapısı ve dört genişlik. Hosted CMS testi değildir. Kanıt: ${directory}`,
);
