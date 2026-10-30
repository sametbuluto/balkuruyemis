import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('SEO ortam ayrımı', () => {
  it('alan adı yokken URL uydurmaz ve indekslemeyi kapatır', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.resetModules();
    const { createPageMetadata } = await import('@/lib/metadata');
    const { default: robots } = await import('@/app/robots');
    const { default: sitemap } = await import('@/app/sitemap');
    const metadata = createPageMetadata('İletişim', 'İletişim açıklaması', '/iletisim');

    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).not.toHaveProperty('url');
    expect(metadata.openGraph).not.toHaveProperty('images');
    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
    expect(sitemap()).toEqual([]);
  });

  it('alan adı yapılandırıldığında canonical ve gerçek sayfaları üretir, örnekleri dışarıda tutar', async () => {
    // Yalnızca test kapsamındaki ayrılmış örnek alan adı; işletme ayarı değiştirilmez.
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com');
    vi.resetModules();
    const { createPageMetadata } = await import('@/lib/metadata');
    const { default: robots } = await import('@/app/robots');
    const { default: sitemap } = await import('@/app/sitemap');
    const metadata = createPageMetadata(
      'Ürünlerimiz',
      'Katalog açıklaması',
      '/urunlerimiz',
    );

    expect(metadata.alternates).toEqual({ canonical: 'https://example.com/urunlerimiz' });
    expect(metadata.openGraph).toMatchObject({
      locale: 'tr_TR',
      url: 'https://example.com/urunlerimiz',
      images: [{ url: 'https://example.com/opengraph-image', width: 1200, height: 630 }],
    });
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://example.com/sitemap.xml',
    });
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual([
      'https://example.com/',
      'https://example.com/hakkimizda',
      'https://example.com/urunlerimiz',
      'https://example.com/subelerimiz',
      'https://example.com/iletisim',
    ]);
    expect(urls.some((url) => url.includes('ornek-sube'))).toBe(false);
  });
});
