import { expect, test } from '@playwright/test';

const routes = ['/', '/hakkimizda', '/urunlerimiz', '/subelerimiz', '/iletisim'];

test('teslim: metadata, sayfa adları ve bütün iç bağlantılar gerçek yanıtlarla tutarlıdır', async ({
  page,
  request,
}) => {
  const urls = new Set<string>();
  const titles = new Set<string>();
  for (const path of routes) {
    await page.goto(path);
    await expect(
      page.getByRole('banner').getByText('Buca, İzmir', { exact: true }),
    ).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    const title = await page.title();
    expect(title).toContain('Bal Kuruyemiş');
    titles.add(title);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    expect(
      await page.locator('meta[name="description"]').getAttribute('content'),
    ).toBeTruthy();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      title,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      title,
    );

    const invalidNames = await page
      .locator('a, button')
      .evaluateAll((elements) =>
        elements
          .filter(
            (element) =>
              !element.getAttribute('aria-label')?.trim() &&
              !element.textContent?.trim() &&
              !element.querySelector('img[alt]'),
          )
          .map((element) => element.outerHTML),
      );
    expect(invalidNames).toEqual([]);
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href') ?? ''),
      )) {
      expect(href.trim()).not.toBe('');
      expect(href).not.toBe('#');
      expect(href).not.toMatch(/^javascript:/i);
      const url = new URL(href, page.url());
      if (url.origin !== new URL(page.url()).origin) continue;
      if (url.hash && url.pathname === new URL(page.url()).pathname) {
        expect(
          await page
            .locator('[id]')
            .evaluateAll(
              (elements, id) => elements.some((element) => element.id === id),
              decodeURIComponent(url.hash.slice(1)),
            ),
        ).toBe(true);
      }
      urls.add(`${url.pathname}${url.search}`);
    }
    const namelessImages = await page
      .locator('img')
      .evaluateAll((images) =>
        images
          .filter((image) => !image.hasAttribute('alt'))
          .map((image) => image.outerHTML),
      );
    expect(namelessImages).toEqual([]);
  }
  expect(titles.size).toBe(routes.length);
  for (const url of urls) expect((await request.get(url)).status(), url).toBe(200);
});

test('teslim: robots, sitemap ve bütün örnek şube 404 yanıtları SEO durumuyla tutarlıdır', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const robotsResponse = await request.get('/robots.txt');
  const sitemapResponse = await request.get('/sitemap.xml');
  expect(robotsResponse.status()).toBe(200);
  expect(sitemapResponse.status()).toBe(200);
  expect(sitemapResponse.headers()['content-type']).toContain('xml');
  const robotsText = await robotsResponse.text();
  const sitemapText = await sitemapResponse.text();
  expect(sitemapText).not.toContain('ornek-sube');
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute('href', { timeout: 1000 })
    .catch(() => null);
  if (!canonical) {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );
    expect(robotsText).toMatch(/^Disallow: \/$/m);
    expect(sitemapText).not.toMatch(/<loc>/);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
  } else {
    expect(robotsText).toMatch(/^Allow: \/$/m);
    expect(sitemapText).toContain('<loc>');
    expect(new URL(canonical).protocol).toMatch(/^https?:$/);
  }
  for (const path of [
    '/olmayan-sayfa',
    '/subelerimiz/olmayan-sube',
    ...[1, 2, 3, 4].map((index) => `/subelerimiz/ornek-sube-${index}`),
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Burada bir sayfa bulamadık.' }),
    ).toBeVisible();
    const directives = await page
      .locator('meta[name="robots"]')
      .evaluateAll((tags) => tags.map((tag) => tag.getAttribute('content')).join(' '));
    expect(directives).toContain('noindex');
    await expect(
      page.getByRole('link', { name: 'Ana sayfaya dön', exact: true }),
    ).toHaveAttribute('href', '/');
  }
});

test('teslim: header ve footer dahil ekran sınırları, klavye menüsü ve azaltılmış hareket korunur', async ({
  page,
}, testInfo) => {
  const widths =
    testInfo.project.name === 'mobile-chromium'
      ? [320, 393]
      : testInfo.project.name === 'tablet-chromium'
        ? [768]
        : [1280];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of routes) {
      await page.goto(path);
      const clipped = await page.locator('body').evaluate((body) =>
        Array.from(body.querySelectorAll('h1, h2, h3, p, a, button, dt, dd'))
          .filter((element) => {
            const box = element.getBoundingClientRect();
            return box.width > 1 && (box.left < -1 || box.right > innerWidth + 1);
          })
          .map((element) => element.textContent),
      );
      expect(clipped, `${path}: ${width}px`).toEqual([]);
    }
    if (width < 1024) {
      await page.goto('/');
      const button = page.getByRole('button', { name: 'Menüyü aç' });
      await button.click();
      await page.keyboard.press('Tab');
      await expect(
        page
          .getByRole('navigation', { name: 'Mobil navigasyon' })
          .getByRole('link', { name: 'Ana Sayfa', exact: true }),
      ).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(button).toBeFocused();
      await expect(button).toHaveAttribute('aria-expanded', 'false');
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page.locator('html').evaluate((html) => getComputedStyle(html).scrollBehavior),
  ).toBe('auto');
});
