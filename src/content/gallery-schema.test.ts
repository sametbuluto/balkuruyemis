// @vitest-environment node
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { parseGalleryDocuments } from './gallery-schema';
import { loadGallery } from './gallery.server';
import { selectPublishedMedia } from './media-selection';
import { selectPublishedProducts } from './product-schema';
import { selectVisibleBranches } from './branch-schema';
import { selectPublishedCategories } from './category-schema';
import { loadCategories } from './categories.server';
import { loadBranches } from './branches.server';

const fixture = {
  id: 'media-test',
  url: '/images/gallery/test.webp',
  alt: 'Yalnızca test: Türkçe İ ı ş',
  width: 1200,
  height: 800,
  status: 'published',
  sortOrder: 1,
  usages: ['brand-gallery', 'home-hero'],
};
const doc = (value: unknown = fixture, filename = 'media-test.json') => ({
  filename,
  source: JSON.stringify(value),
});

describe('Galeri JSON ve görsel yayın sözleşmesi', () => {
  it('boş koleksiyonu, UTF-8 metadata ve bir kaydın çoklu kullanımını kabul eder', () => {
    expect(parseGalleryDocuments([])).toEqual([]);
    expect(parseGalleryDocuments([doc()])).toEqual([fixture]);
  });
  it.each(['{', 'null', '[]', 'false'])('bozuk JSON/kök tipi reddi: %s', (source) =>
    expect(() =>
      parseGalleryDocuments([{ filename: 'media-test.json', source }]),
    ).toThrow('Galeri JSON'),
  );
  it.each(['id', 'url', 'alt', 'width', 'height', 'status', 'sortOrder', 'usages'])(
    'zorunlu alan reddi: %s',
    (key) => {
      const value: Record<string, unknown> = { ...fixture };
      delete value[key];
      expect(() => parseGalleryDocuments([doc(value)])).toThrow();
    },
  );
  it.each([
    { alt: '' },
    { alt: null },
    { width: 0 },
    { height: '800' },
    { status: 'review' },
    { sortOrder: -1 },
    { usages: [] },
    { usages: ['unknown'] },
    { usages: ['home-hero', 'home-hero'] },
    { extra: true },
    { id: 'other-id' },
    { url: 'https://example.com/test.webp' },
    { url: '/images/../secret.webp' },
    { url: '/images/gallery/test.webp?key=1' },
    { url: '/images/gallery/%2e%2e/test.webp' },
    { variants: [{ url: '/images/gallery/test.webp', width: 0, format: 'image/webp' }] },
  ])('geçersiz metadata/kullanım/yol reddi: %j', (change) =>
    expect(() => parseGalleryDocuments([doc({ ...fixture, ...change })])).toThrow(),
  );
  it('mükerrer medya ID ve yanlış dosya adını reddeder', () => {
    expect(() => parseGalleryDocuments([doc(), doc()])).toThrow('mükerrer medya ID');
    expect(() => parseGalleryDocuments([doc(fixture, '../media-test.json')])).toThrow(
      'dosya adı',
    );
  });
  it('yayın durumu ve sıralama görüntü seçimine uygulanır', () => {
    const entries = parseGalleryDocuments([
      doc(),
      doc({ ...fixture, id: 'media-first', sortOrder: 0 }, 'media-first.json'),
      doc({ ...fixture, id: 'media-draft', status: 'draft' }, 'media-draft.json'),
    ]);
    expect(selectPublishedMedia(entries).map((image) => image.id)).toEqual([
      'media-first',
      'media-test',
    ]);
  });
  it('loader güncel dosyayı okur, boş dizin geçerli ve bozuk dosya fallback üretmez', () => {
    const directory = mkdtempSync(path.join(tmpdir(), 'bal-gallery-'));
    try {
      expect(loadGallery(directory)).toEqual([]);
      writeFileSync(path.join(directory, 'media-test.json'), doc().source);
      expect(loadGallery(directory)).toEqual([fixture]);
      writeFileSync(path.join(directory, 'media-test.json'), '{');
      expect(() => loadGallery(directory)).toThrow('Galeri JSON');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
  it('gömülü kategori/ürün/şube görsellerinin draft verisini ziyaretçiye taşımaz', () => {
    const image = {
      id: 'embedded-test',
      url: fixture.url,
      alt: fixture.alt,
      width: 1200,
      height: 800,
      status: 'draft' as const,
      sortOrder: 1,
    };
    const categories = loadCategories();
    const first = categories[0]!;
    expect(selectPublishedCategories([{ ...first, image }])[0]?.image).toBeNull();
    const product = {
      id: 'product-test',
      slug: 'test',
      name: 'Test',
      description: 'Yalnız test',
      categoryId: first.id,
      status: 'published' as const,
      sortOrder: 1,
      images: [image],
    };
    expect(selectPublishedProducts([product], categories)[0]?.images).toEqual([]);
    expect(
      selectVisibleBranches([{ ...loadBranches()[0]!, images: [image] }])[0]?.images,
    ).toEqual([]);
    expect(
      selectPublishedMedia([
        { ...image, status: 'published' },
        { ...image, id: 'early', status: 'published', sortOrder: 0 },
      ]).map((i) => i.id),
    ).toEqual(['early', 'embedded-test']);
  });
  it('hero seçimi ayrı kullanım alanından gelir; yoksa galeri fallback korunur', async () => {
    const server = await import('./gallery.server');
    const source = await import('./gallery');
    const entries = parseGalleryDocuments([
      doc(),
      doc(
        { ...fixture, id: 'media-hero', usages: ['home-hero'], sortOrder: 0 },
        'media-hero.json',
      ),
    ]);
    const mock = vi.spyOn(server, 'loadGallery').mockReturnValue(entries);
    try {
      expect(source.getHeroImage()?.id).toBe('media-hero');
    } finally {
      mock.mockRestore();
    }
  });
});
