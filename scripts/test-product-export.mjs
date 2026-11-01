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
import { chromium } from '@playwright/test';
import { createStaticServer } from './serve-static.mjs';

// Ürünler yalnız izole kopyada oluşturulur. Gerçek content/products ve out değiştirilmez.
const root = process.cwd();
const directory = await mkdtemp(path.join(tmpdir(), 'bal-product-export-'));
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
]) {
  await cp(path.join(root, name), path.join(directory, name), { recursive: true });
}
await symlink(
  path.join(root, 'node_modules'),
  path.join(directory, 'node_modules'),
  'dir',
);
const categoryFiles = (await readdir(path.join(directory, 'content/categories')))
  .filter((name) => name.endsWith('.json'))
  .sort();
assert(categoryFiles.length >= 2, 'Fixture için iki kategori gerekli.');
const visibleFile = path.join(directory, 'content/categories', categoryFiles[0]);
const hiddenFile = path.join(directory, 'content/categories', categoryFiles[1]);
const visibleCategory = JSON.parse(await readFile(visibleFile, 'utf8'));
const hiddenCategory = JSON.parse(await readFile(hiddenFile, 'utf8'));
const fixture = {
  id: 'product-c1-visible',
  slug: 'c1-visible',
  name: 'C1 test ürünü',
  categoryId: visibleCategory.id,
  description: 'Yalnızca izole test fixture verisidir.',
  images: [],
  sortOrder: 1,
  status: 'published',
};
const productFile = path.join(directory, 'content/products/product-c1-visible.json');
const build = async (name) => {
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
};
for (const [name, source] of [
  ['malformed', '{'],
  ['unknown-field', JSON.stringify({ ...fixture, price: 10 })],
  [
    'invalid-reference',
    JSON.stringify({ ...fixture, categoryId: 'category-does-not-exist-c1' }),
  ],
]) {
  await writeFile(productFile, source);
  const result = await build(name);
  assert.equal(result.status, 1, `${name}: başarısız build bekleniyor. ${directory}`);
  assert.match(result.log, /Ürün JSON doğrulaması/);
  assert.match(result.log, /product-c1-visible\.json/);
}
await writeFile(visibleFile, JSON.stringify({ ...visibleCategory, status: 'published' }));
await writeFile(hiddenFile, JSON.stringify({ ...hiddenCategory, status: 'draft' }));
const draft = {
  ...fixture,
  id: 'product-c1-draft-only',
  slug: 'c1-draft-only',
  name: 'C1_DRAFT_ONLY_SENTINEL',
  status: 'draft',
};
const hiddenParent = {
  ...fixture,
  id: 'product-c1-hidden-parent',
  slug: 'c1-hidden-parent',
  name: 'C1_HIDDEN_CATEGORY_SENTINEL',
  categoryId: hiddenCategory.id,
};
for (const product of [fixture, draft, hiddenParent])
  await writeFile(
    path.join(directory, 'content/products', `${product.id}.json`),
    JSON.stringify(product),
  );
const result = await build('visibility');
assert.equal(result.status, 0, `Geçerli fixture build başarısız. ${directory}`);
const output = path.join(directory, 'out');
const catalog = await readFile(path.join(output, 'urunlerimiz.html'), 'utf8');
assert(catalog.includes(fixture.name), 'Published ürün eksik.');
for (const entry of await readdir(output, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.(html|txt|xml|json|js)$/.test(entry.name)) continue;
  const text = await readFile(path.join(entry.parentPath, entry.name), 'utf8');
  for (const marker of [draft.id, draft.name, hiddenParent.id, hiddenParent.name])
    assert(!text.includes(marker), `Draft/kapalı kategori kaydı sızdı: ${entry.name}`);
}
// macOS tmpdir /var takma yolunu güvenli sunucunun realpath köküyle eşleştir.
const server = createStaticServer(await realpath(output));
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    headless: true,
  });
  const page = await browser.newPage();
  for (const width of [320, 393, 768, 1280]) {
    process.stdout.write(
      `Ürün fixture tarayıcı kontrolü: ${width}px, ${visibleCategory.slug}\n`,
    );
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${origin}/urunlerimiz?kategori=${visibleCategory.slug}`);
    await page
      .getByRole('heading', { level: 3, name: fixture.name, exact: true })
      .waitFor({ timeout: 10_000 });
    assert.equal(
      await page.getByRole('heading', { name: draft.name, exact: true }).count(),
      0,
    );
    assert.equal(
      await page.getByRole('heading', { name: hiddenParent.name, exact: true }).count(),
      0,
    );
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({
      path: path.join(directory, `products-${width}.png`),
      fullPage: true,
    });
  }
  await page.goto(`${origin}/urunlerimiz?kategori=${hiddenCategory.slug}`);
  await page.getByRole('status').waitFor();
  const response = await fetch(`${origin}/content/products/${draft.id}.json`);
  assert.equal(response.status, 404);
} catch (error) {
  if (browser) {
    const page = browser.contexts()[0]?.pages()[0];
    if (page) {
      await writeFile(path.join(directory, 'browser-failure.html'), await page.content());
      await page.screenshot({
        path: path.join(directory, 'browser-failure.png'),
        fullPage: true,
      });
    }
  }
  throw error;
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
process.stdout.write(
  `Ürün export sözleşmesi 4/4 geçti: üç build reddi, published/draft/SEO ve dört genişlik. İzole kanıt: ${directory}\n`,
);
