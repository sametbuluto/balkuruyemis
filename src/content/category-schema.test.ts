import { describe, expect, it } from 'vitest';
import {
  parseCategoryDocuments,
  parseCategoryJson,
  selectPublishedCategories,
} from './category-schema';

const fixture = {
  id: 'category-test',
  slug: 'test',
  name: 'Test: Çığ, Ş, İ, ı',
  description: 'Yalnızca test verisi; gerçek kategori değildir.',
  image: null,
  sortOrder: 1,
  status: 'published',
};
const document = (overrides: Record<string, unknown> = {}) => ({
  filename: 'category-test.json',
  source: JSON.stringify({ ...fixture, ...overrides }),
});
const parse = (overrides: Record<string, unknown> = {}) => {
  const { source, filename } = document(overrides);
  return parseCategoryJson(source, filename);
};

describe('Kategori JSON sözleşmesi', () => {
  it('Türkçe metni, null görseli ve bütün alanları değiştirmeden korur', () => {
    expect(parse()).toEqual(fixture);
    expect(Object.isFrozen(parse())).toBe(true);
  });

  it.each(['className', 'script', '__proto__'])(
    'bilinmeyen alanı reddeder: %s',
    (field) => {
      expect(() => parse({ [field]: 'test' })).toThrow('bilinmeyen alan');
    },
  );

  it.each([
    { id: 'product-test' },
    { id: 'category-diger' },
    { slug: 'Yanlış Slug' },
    { name: '' },
    { name: false },
    { description: null },
    { image: false },
    { sortOrder: '1' },
    { sortOrder: -1 },
    { sortOrder: 1.5 },
    { status: 'review' },
    { status: true },
    { slug: null },
  ])('yanlış alan tipi/değerini reddeder: %j', (value) => {
    expect(() => parse(value)).toThrow('Kategori JSON doğrulaması');
  });

  it.each(['id', 'slug', 'name', 'description', 'image', 'sortOrder', 'status'])(
    'eksik zorunlu alanı reddeder: %s',
    (field) => {
      const value: Record<string, unknown> = { ...fixture };
      delete value[field];
      expect(() =>
        parseCategoryJson(JSON.stringify(value), 'category-test.json'),
      ).toThrow('zorunlu alan');
    },
  );

  it.each(['{', 'null', '[]', '1', '"test"', '{"name":}'])(
    'bozuk JSON veya yanlış kök tipini reddeder: %s',
    (source) => {
      expect(() => parseCategoryJson(source, 'category-test.json')).toThrow(
        'Kategori JSON doğrulaması',
      );
    },
  );

  it('dosya adını, boş koleksiyonu, mükerrer ID ve slug kayıtlarını reddeder', () => {
    expect(() => parseCategoryJson(document().source, '../category-test.json')).toThrow();
    expect(() => parseCategoryDocuments([])).toThrow('en az bir');
    expect(() => parseCategoryDocuments([document(), document()])).toThrow(
      'mükerrer kategori ID',
    );
    const second = {
      filename: 'category-other.json',
      source: JSON.stringify({ ...fixture, id: 'category-other' }),
    };
    expect(() => parseCategoryDocuments([document(), second])).toThrow('mükerrer slug');
  });

  it('yayındaki kategorileri sıralar; draft görünmez ve kaynak liste değişmez', () => {
    const documents = [
      {
        filename: 'category-b.json',
        source: JSON.stringify({ ...fixture, id: 'category-b', slug: 'b', sortOrder: 2 }),
      },
      {
        filename: 'category-draft.json',
        source: JSON.stringify({
          ...fixture,
          id: 'category-draft',
          slug: 'draft',
          status: 'draft',
        }),
      },
      {
        filename: 'category-a.json',
        source: JSON.stringify({ ...fixture, id: 'category-a', slug: 'a', sortOrder: 0 }),
      },
    ];
    const all = parseCategoryDocuments(documents);
    expect(selectPublishedCategories(all).map((category) => category.slug)).toEqual([
      'a',
      'b',
    ]);
    expect(all).toHaveLength(3);
    expect(Object.isFrozen(all)).toBe(true);
  });

  it('görsel nesnesini ve AVIF/WebP varyantlarını strict doğrular', () => {
    const image = {
      id: 'test-media',
      url: '/images/categories/test.webp',
      alt: 'Yalnızca test resmi',
      width: 1200,
      height: 800,
      variants: [
        { url: '/images/categories/test-640.avif', width: 640, format: 'image/avif' },
      ],
    };
    expect(parse({ image }).image).toEqual(image);
    for (const bad of [
      { ...image, alt: '' },
      { ...image, width: '1200' },
      { ...image, height: 0 },
      { ...image, onerror: 'test' },
      { ...image, url: 'https://example.com/image.webp' },
      { ...image, url: '/images/../private.webp' },
      { ...image, variants: null },
      { ...image, variants: [{ ...image.variants[0], width: 0 }] },
      { ...image, variants: [{ ...image.variants[0], unknown: true }] },
      { ...image, variants: [{ ...image.variants[0], format: 'image/png' }] },
      { ...image, variants: [image.variants[0], image.variants[0]] },
    ])
      expect(() => parse({ image: bad })).toThrow();
  });
});
