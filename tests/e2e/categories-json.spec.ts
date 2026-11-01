import { expect, test } from '@playwright/test';

test('kategori JSON kaynağı statik hosta açılmaz; URL filtresi API gerektirmez', async ({
  page,
  request,
}) => {
  const paths: string[] = [];
  page.on('request', (request) => paths.push(new URL(request.url()).pathname));
  await page.goto('/urunlerimiz?kategori=kahve');
  await expect(
    page.getByRole('heading', { level: 2, name: 'Kahve', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Ürün kategorileri', exact: true })
    .getByRole('link', { name: 'Aktar', exact: true })
    .click();
  await expect(page).toHaveURL('/urunlerimiz?kategori=aktar');
  await expect(
    page.getByRole('heading', { level: 2, name: 'Aktar', exact: true }),
  ).toBeVisible();
  expect(
    paths.filter((path) => path.startsWith('/content/') || path.startsWith('/api/')),
  ).toEqual([]);
  expect((await request.get('/content/categories/category-kahve.json')).status()).toBe(
    404,
  );
  expect((await request.get('/src/content/categories.server.ts')).status()).toBe(404);
});
