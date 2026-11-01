import { expect, test } from '@playwright/test';
import { getCategoryBySlug, getPublishedProducts } from '../../src/content/queries';
import { expectCatalogProducts } from './catalog-assertions';

test('boş ürün kataloğu korunur; JSON kaynağı ve server loader statik hosta açılmaz', async ({
  page,
  request,
}) => {
  const paths: string[] = [];
  page.on('request', (request) => paths.push(new URL(request.url()).pathname));
  await page.goto('/urunlerimiz');
  await expectCatalogProducts(page, getPublishedProducts(), 'Ürünlerle yakında tanışın.');
  await page
    .getByRole('navigation', { name: 'Ürün kategorileri', exact: true })
    .getByRole('link', { name: 'Kahve', exact: true })
    .click();
  await expect(page).toHaveURL('/urunlerimiz?kategori=kahve');
  await expectCatalogProducts(
    page,
    getPublishedProducts(getCategoryBySlug('kahve')?.id),
    'Kahve ürünleri hazırlanıyor.',
  );
  expect(
    paths.filter((path) => path.startsWith('/api/') || path.startsWith('/content/')),
  ).toEqual([]);
  expect((await request.get('/content/products/product-test.json')).status()).toBe(404);
  expect((await request.get('/src/content/products.server.ts')).status()).toBe(404);
});
