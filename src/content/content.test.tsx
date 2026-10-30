import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { branches, getPublishedBranches, getVisibleBranches } from './branches';
import { productCategories } from './categories';
import { products } from './products';
import { brandGallery } from './gallery';
import { brandAssets, site } from './site';
import { contactChannels } from './social';
import { validateContent } from './validation';
import { getMapsLinks } from './maps';
import { resolveSeo } from './seo';
import { resolveCategorySelection } from '@/features/catalog/catalog-selection';
import { BranchGrid } from '@/features/branches/branch-grid';
import { StaticImage } from '@/components/ui/static-image';

const content = {
  categories: productCategories,
  products,
  branches,
  gallery: brandGallery,
  brandAssets,
  channels: contactChannels,
};

describe('Statik içerik ve gerçek konumlar', () => {
  it('tek içerik kaynağı geçerlidir ve şube sayısı görünür kayıtlardan türetilir', () => {
    expect(validateContent(content)).toEqual([]);
    expect(site.branchCount).toBe(getVisibleBranches().length);
    expect(site.knownLocationCount).toBe(
      branches.filter((branch) => branch.coordinates).length,
    );
    expect(getPublishedBranches()).toEqual([]);
    expect(branches.every((branch) => branch.slug === null)).toBe(true);
  });

  it('dört harita ve API=1 yol tarifi doğru koordinatı kullanır; eksik kayda link üretilmez', () => {
    render(<BranchGrid />);
    const points = [
      '38.362633,27.148943',
      '38.374462,27.183882',
      '38.367344,27.148973',
      '38.378593,27.163704',
    ];
    for (const [index, point] of points.entries()) {
      const card = within(screen.getByRole('article', { name: `Konum ${index + 1}` }));
      expect(card.getByRole('link', { name: /Google Haritalar’da Aç/ })).toHaveAttribute(
        'href',
        `https://maps.google.com/?q=${point}`,
      );
      const link = card.getByRole('link', { name: /Yol Tarifi Al/ });
      const url = new URL(link.getAttribute('href') ?? '');
      expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
      expect(url.searchParams.get('api')).toBe('1');
      expect(url.searchParams.get('destination')).toBe(point);
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(card.queryByText('Örnek içerik')).not.toBeInTheDocument();
      expect(
        card.queryByRole('link', { name: 'Şubeyi keşfedin' }),
      ).not.toBeInTheDocument();
    }
    expect(
      getMapsLinks({ ...branches[3]!, coordinates: null, googleMapsUrl: null }),
    ).toBeNull();
  });

  it('yanlış koordinat eşleşmesini, yinelenen kimliği ve hatalı kategori referansını reddeder', () => {
    const first = branches[0]!;
    expect(
      validateContent({
        ...content,
        branches: [{ ...first, googleMapsUrl: 'https://maps.google.com/?q=0,0' }],
      }).join(' '),
    ).toContain('eşleşmiyor');
    expect(validateContent({ ...content, branches: [first, first] }).join(' ')).toContain(
      'yinelenen id',
    );
    expect(
      validateContent({
        ...content,
        products: [
          {
            id: 'fixture',
            slug: 'fixture',
            name: 'Yalnızca test',
            description: '',
            categoryId: 'missing',
            images: [],
            sortOrder: 1,
            status: 'draft',
          },
        ],
      }).join(' '),
    ).toContain('kategori bulunamadı');
  });

  it('query seçimini ve yinelenen/bilinmeyen kategori durumunu çözer', () => {
    expect(
      resolveCategorySelection('kategori=kahve', productCategories).selected?.slug,
    ).toBe('kahve');
    expect(
      resolveCategorySelection('kategori=kahve&kategori=lokum', productCategories)
        .invalid,
    ).toBe(true);
    expect(
      resolveCategorySelection('kategori=bilinmeyen', productCategories).invalid,
    ).toBe(true);
    expect(resolveCategorySelection('', productCategories).invalid).toBe(false);
  });

  it('hazır AVIF/WebP varyantlarını lazy fallback ve hero önceliğiyle sunar', () => {
    const asset = {
      id: 'fixture',
      url: '/images/fixture.webp',
      alt: 'Yalnızca test görseli',
      width: 1200,
      height: 800,
      variants: [
        { url: '/images/fixture-640.avif', width: 640, format: 'image/avif' as const },
        { url: '/images/fixture-640.webp', width: 640, format: 'image/webp' as const },
      ],
    };
    const { container, rerender } = render(<StaticImage asset={asset} sizes="100vw" />);
    expect(container.querySelector('source[type="image/avif"]')).toHaveAttribute(
      'srcset',
      '/images/fixture-640.avif 640w',
    );
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
    expect(screen.getByRole('img').getAttribute('src')).not.toContain('/_next/image');
    rerender(<StaticImage asset={asset} sizes="100vw" preload />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
    expect(screen.getByRole('img')).toHaveAttribute('fetchpriority', 'high');
  });
});

describe('İndeksleme koruması', () => {
  it('domain tek başına indekslemeyi açmaz, açık onay ve production dalı gerekir', () => {
    expect(resolveSeo({ siteUrl: 'https://example.com' }).indexable).toBe(false);
    expect(
      resolveSeo({ siteUrl: 'https://example.com', allowIndexing: 'true' }).indexable,
    ).toBe(true);
    expect(
      resolveSeo({
        siteUrl: 'https://example.com',
        allowIndexing: 'true',
        pagesBranch: 'preview',
      }).indexable,
    ).toBe(false);
  });
  it('geçici hosting adreslerini ve hatalı origin ayarını korumalı tutar', () => {
    for (const host of [
      'project.pages.dev',
      'branch.project.pages.dev',
      'site.vercel.app',
      '127.0.0.1',
    ]) {
      const result = resolveSeo({ siteUrl: `https://${host}`, allowIndexing: 'true' });
      expect(result.indexable).toBe(false);
      expect(result.siteUrl).toBeUndefined();
    }
    expect(() => resolveSeo({ siteUrl: 'https://example.com/path' })).toThrow();
    expect(() => resolveSeo({ siteUrl: 'http://example.com' })).toThrow();
  });
});
