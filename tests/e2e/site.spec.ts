import { expect, test } from '@playwright/test';

import { site } from '../../src/content/site';
import { getPublishedCategories, getPublishedProducts } from '../../src/content/queries';
import { expectCatalogProducts } from './catalog-assertions';
import { getPageCopy } from '../../src/content/page-copy';

const categories = getPublishedCategories();
const homeCopy = getPageCopy('home');
const routes = ['/', '/hakkimizda', '/urunlerimiz', '/subelerimiz', '/iletisim'];

test('ana sayfa Türkçe açılır, bölümlerini sunar ve klavyeyle içeriğe geçilir', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(`${homeCopy.seo.title} | ${site.name}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.locator('html')).toHaveAttribute('data-scroll-behavior', 'smooth');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    `${homeCopy.hero.titleLead} ${homeCopy.hero.titleAccent}`,
  );
  await expect(
    page.getByRole('region', { name: homeCopy.categories.title }).getByRole('article'),
  ).toHaveCount(categories.length);
  await expect(
    page.getByRole('region', { name: homeCopy.branches.title }).getByRole('article'),
  ).toHaveCount(site.branchCount);
  await expect(page.getByRole('heading', { name: homeCopy.gallery.title })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'İçeriğe geç' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  expect(errors).toEqual([]);
});

test('altı kategori URL ile seçilir, geri dönüş ve bilinmeyen kategori güvenle çalışır', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: homeCopy.hero.catalogAction, exact: true })
    .click();
  await expect(page).toHaveURL('/urunlerimiz');
  const filters = page.getByRole('navigation', {
    name: 'Ürün kategorileri',
    exact: true,
  });
  for (const category of categories) {
    await filters.getByRole('link', { name: category.name, exact: true }).click();
    await expect(page).toHaveURL(`/urunlerimiz?kategori=${category.slug}`);
    await expect(
      filters.getByRole('link', { name: category.name, exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(
      page.getByRole('heading', { level: 2, name: category.name, exact: true }),
    ).toBeVisible();
    await expectCatalogProducts(
      page,
      getPublishedProducts(category.id),
      `${category.name} ürünleri hazırlanıyor.`,
    );
    await expect(page).toHaveTitle('Ürünlerimiz | Bal Kuruyemiş');
  }
  await page.goBack();
  await expect(page).toHaveURL('/urunlerimiz?kategori=aktar');
  await filters.getByRole('link', { name: 'Tüm kategoriler' }).click();
  await expect(page).toHaveURL('/urunlerimiz');
  await expectCatalogProducts(page, getPublishedProducts(), 'Ürünlerle yakında tanışın.');
  await page.goto('/urunlerimiz?kategori=olmayan');
  await expect(page.getByRole('status')).toHaveText(
    'Kategori bulunamadı. Tüm kategorileri görüntülüyorsunuz.',
  );
  await expect(filters.getByRole('link', { name: 'Tüm kategoriler' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('temel rotalar açılır; örnekler gerçek şube detayına dönüşmez', async ({
  page,
  request,
}) => {
  for (const path of routes) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Bal Kuruyemiş — ana sayfa' }).first(),
    ).toBeVisible();
  }
  await page.goto('/subelerimiz');
  const cards = page.getByRole('article');
  await expect(cards).toHaveCount(site.branchCount);
  for (const card of await cards.all()) {
    await expect(card.getByText('Örnek içerik')).toHaveCount(0);
    await expect(card.getByText('Adres bilgisi hazırlanıyor.')).toBeVisible();
    await expect(card.getByRole('link')).toHaveCount(2);
  }
  for (const slug of ['olmayan-sube', 'ornek-sube-1']) {
    expect((await request.get(`/subelerimiz/${slug}`)).status()).toBe(404);
  }
  await page.goto('/subelerimiz/olmayan-sube');
  await expect(
    page.getByRole('heading', { name: 'Burada bir sayfa bulamadık.' }),
  ).toBeVisible();
});

test('doğrulanmamış sosyal ve telefon yönlendirmesi yayımlanmaz', async ({ page }) => {
  for (const path of routes) {
    await page.goto(path);
    await expect(
      page.locator(
        'a[href="#"], a[href=""], a[href^="tel:"], a[href*="wa.me"], a[href*="instagram.com"]',
      ),
    ).toHaveCount(0);
  }
  await expect(page.getByRole('heading', { name: 'Dijital kanallarımız' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Instagram', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'WhatsApp', exact: true }),
  ).toBeVisible();
});

test('ikon PNG adresleri ve paylaşım metadata altyapısı çalışır', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    '/apple-touch-icon.png',
  );
  for (const [path, width, height] of [
    ['/apple-touch-icon.png', 180, 180],
    ['/opengraph-image', 1200, 630],
  ] as const) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const bytes = await response.body();
    expect(bytes.subarray(1, 4).toString()).toBe('PNG');
    expect(bytes.readUInt32BE(16)).toBe(width);
    expect(bytes.readUInt32BE(20)).toBe(height);
  }
  const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(favicon).toBeTruthy();
  expect((await request.get(favicon ?? '/icon')).status()).toBe(200);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    'content',
    'tr_TR',
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    'content',
    /Bal Kuruyemiş/,
  );
});

test('sticky menü, responsive düzen ve içerik görünürlüğü korunur', async ({
  page,
}, testInfo) => {
  const scrollWarnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning' && message.text().includes('scroll-behavior'))
      scrollWarnings.push(message.text());
  });
  await page.goto('/');
  const compact = (page.viewportSize()?.width ?? 1280) < 1024;
  const button = page.getByRole('button', { name: 'Menüyü aç' });
  if (compact) {
    await button.click();
    const menu = page.getByRole('navigation', { name: 'Mobil navigasyon' });
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Şubelerimiz', exact: true }).click();
    await expect(page).toHaveURL('/subelerimiz');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Menüyü aç' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  } else {
    await expect(button).toBeHidden();
    await page
      .getByRole('navigation', { name: 'Ana navigasyon' })
      .getByRole('link', { name: 'Şubelerimiz' })
      .click();
    await expect(page).toHaveURL('/subelerimiz');
  }
  const viewports =
    testInfo.project.name === 'mobile-chromium'
      ? [
          { width: 320, height: 840 },
          { width: 393, height: 851 },
        ]
      : testInfo.project.name === 'tablet-chromium'
        ? [{ width: 768, height: 1024 }]
        : [{ width: 1280, height: 900 }];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const path of [...routes, '/urunlerimiz?kategori=kahve']) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        ),
        `${path} — ${viewport.width}px yatay taşma`,
      ).toBe(false);
      const clippedText = await page.locator('main').evaluate((main) =>
        Array.from(main.querySelectorAll('h1, h2, h3, p, a, dt, dd'))
          .filter((element) => {
            const box = element.getBoundingClientRect();
            return box.width > 0 && (box.left < -1 || box.right > window.innerWidth + 1);
          })
          .map((element) => element.textContent),
      );
      expect(clippedText, `${path} — ${viewport.width}px kırpılmış metin`).toEqual([]);
    }
    await page.goto('/');
    const caption = page.getByText(`${site.branchCountCapitalized} şubede`, {
      exact: true,
    });
    await caption.scrollIntoViewIfNeeded();
    await expect(caption).toBeInViewport({ ratio: 1 });
    const headerBox = await page.getByRole('banner').boundingBox();
    expect(headerBox?.y).toBe(0);
    await page.goto('/');
    await page.screenshot({
      path: testInfo.outputPath(`ana-sayfa-${viewport.width}.png`),
      fullPage: true,
      scale: 'css',
    });
    await page.screenshot({
      path: testInfo.outputPath(`ana-sayfa-${viewport.width}-ust.png`),
      scale: 'css',
    });
    if (viewport.width === 320 || viewport.width === 768) {
      for (const path of ['/urunlerimiz?kategori=kahve', '/subelerimiz', '/iletisim']) {
        await page.goto(path);
        await page.screenshot({
          path: testInfo.outputPath(
            `${path.replace(/\?.*$/, '').slice(1)}-${viewport.width}.png`,
          ),
          fullPage: true,
          scale: 'css',
        });
      }
    }
  }
  expect(scrollWarnings).toEqual([]);
});
