import { expect, test } from '@playwright/test';

test('statik HTML gerçek konumları içerir; doğru harita/yol tarifi ve şube kimliği ayrımı korunur', async ({
  page,
  request,
}) => {
  const points = [
    '38.362633,27.148943',
    '38.374462,27.183882',
    '38.367344,27.148973',
    '38.378593,27.163704',
  ];
  const html = await (await request.get('/subelerimiz')).text();
  expect(html).not.toContain('LocalBusiness');
  expect(html).not.toContain('application/ld+json');
  for (const point of points)
    expect(html).toContain(`https://maps.google.com/?q=${point}`);
  for (const route of ['/', '/subelerimiz']) {
    await page.goto(route);
    for (const [index, point] of points.entries()) {
      const card = page.getByRole('article', { name: `Konum ${index + 1}`, exact: true });
      await expect(card.getByText('Gerçek konum', { exact: true })).toBeVisible();
      await expect(
        card.getByRole('link', { name: /Google Haritalar’da Aç/ }),
      ).toHaveAttribute('href', `https://maps.google.com/?q=${point}`);
      const directions = card.getByRole('link', { name: /Yol Tarifi Al/ });
      const url = new URL((await directions.getAttribute('href')) ?? '');
      expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
      expect(url.searchParams.get('api')).toBe('1');
      expect(url.searchParams.get('destination')).toBe(point);
      await expect(directions).toHaveAttribute('target', '_blank');
      await expect(card.getByRole('link')).toHaveCount(2);
    }
  }
  for (const slug of ['konum-1', 'konum-2', 'konum-3', 'location-1', 'konum-4'])
    expect((await request.get(`/subelerimiz/${slug}`)).status()).toBe(404);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toMatch(/konum-|location-|ornek-sube/);
});

test('doğrudan query, yenileme, geri/ileri ve statik SEO fallback çalışır', async ({
  page,
  request,
}) => {
  const response = await request.get('/urunlerimiz?kategori=kahve');
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain('<title>Ürünlerimiz | Bal Kuruyemiş</title>');
  await page.goto('/urunlerimiz?kategori=kahve');
  await expect(page).toHaveTitle('Ürünlerimiz | Bal Kuruyemiş');
  await page.reload();
  await expect(
    page.getByRole('heading', { level: 2, name: 'Kahve', exact: true }),
  ).toBeVisible();
  const filters = page.getByRole('navigation', {
    name: 'Ürün kategorileri',
    exact: true,
  });
  await filters.getByRole('link', { name: 'Lokum', exact: true }).click();
  await expect(page).toHaveURL('/urunlerimiz?kategori=lokum');
  await page.goBack();
  await expect(
    page.getByRole('heading', { level: 2, name: 'Kahve', exact: true }),
  ).toBeVisible();
  await expect(page).toHaveTitle('Ürünlerimiz | Bal Kuruyemiş');
  await page.goForward();
  await expect(
    page.getByRole('heading', { level: 2, name: 'Lokum', exact: true }),
  ).toBeVisible();
  await expect(page).toHaveTitle('Ürünlerimiz | Bal Kuruyemiş');
  await page.goto('/urunlerimiz?kategori=kahve&kategori=lokum');
  await expect(page.getByRole('status')).toContainText('Kategori bulunamadı');
});

test('katalogdan sayfa geçişinde tek title ve paylaşım metadata korunur', async ({
  page,
}) => {
  await page.goto('/urunlerimiz?kategori=kahve');
  await expect(page).toHaveTitle('Ürünlerimiz | Bal Kuruyemiş');
  await page
    .getByRole('contentinfo')
    .getByRole('link', { name: 'Hakkımızda', exact: true })
    .click();
  await expect(page).toHaveTitle('Hakkımızda | Bal Kuruyemiş');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Hakkımızda | Bal Kuruyemiş',
  );
});
