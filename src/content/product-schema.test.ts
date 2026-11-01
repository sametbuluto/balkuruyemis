// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getCategories } from './categories';
import {
  parseProductDocuments,
  parseProductJson,
  selectPublishedProducts,
} from './product-schema';

const categories = getCategories();
const categoryId = categories[0]!.id;
const fixture = {
  id: 'product-test',
  slug: 'test',
  name: 'Yalnızca test: Çığ, İ, ı',
  categoryId,
  description: 'Gerçek ürün değildir.',
  images: [],
  sortOrder: 1,
  status: 'published',
};
const document = (
  overrides: Record<string, unknown> = {},
  filename = 'product-test.json',
) => ({ filename, source: JSON.stringify({ ...fixture, ...overrides }) });
const parse = (overrides: Record<string, unknown> = {}) => {
  const doc = document(overrides);
  return parseProductJson(doc.source, doc.filename, categories);
};

describe('Ürün JSON sözleşmesi', () => {
  it('boş koleksiyonu ve gerçek kategori ID referansını kabul eder', () => {
    expect(parseProductDocuments([], categories)).toEqual([]);
    expect(parse()).toEqual(fixture);
    expect(Object.isFrozen(parse())).toBe(true);
    expect(Object.isFrozen(parse().images)).toBe(true);
  });

  it.each(['price', 'className', '__proto__'])('bilinmeyen alanı reddeder: %s', (key) => {
    expect(() => parse({ [key]: 'test' })).toThrow('bilinmeyen alan');
  });

  it.each([
    'id',
    'slug',
    'name',
    'categoryId',
    'description',
    'images',
    'sortOrder',
    'status',
  ])('eksik zorunlu alanı reddeder: %s', (key) => {
    const value: Record<string, unknown> = { ...fixture };
    delete value[key];
    expect(() =>
      parseProductJson(JSON.stringify(value), 'product-test.json', categories),
    ).toThrow('zorunlu alan');
  });

  it.each([
    { id: 'wrong-test' },
    { id: 'product-other' },
    { slug: 'Yanlış Slug' },
    { name: '' },
    { name: false },
    { description: null },
    { categoryId: 'category-missing' },
    { categoryId: categoryId.replace('category-', '') },
    { categoryId: 1 },
    { images: null },
    { images: {} },
    { images: [null] },
    { images: ['/images/test.webp'] },
    { sortOrder: -1 },
    { sortOrder: '1' },
    { sortOrder: 1.5 },
    { status: 'review' },
  ])('geçersiz alan/değer/referansı reddeder: %j', (overrides) => {
    expect(() => parse(overrides)).toThrow('Ürün JSON doğrulaması');
  });

  it.each(['{', 'null', '[]', 'true', '{"name":}'])(
    'bozuk JSON veya kök tipini reddeder: %s',
    (source) => {
      expect(() => parseProductJson(source, 'product-test.json', categories)).toThrow(
        'Ürün JSON doğrulaması',
      );
    },
  );

  it('filename, mükerrer ID ve slug değerlerini reddeder', () => {
    expect(() =>
      parseProductJson(document().source, '../product-test.json', categories),
    ).toThrow();
    expect(() => parseProductDocuments([document(), document()], categories)).toThrow(
      'mükerrer ürün ID',
    );
    expect(() =>
      parseProductDocuments(
        [document(), document({ id: 'product-other' }, 'product-other.json')],
        categories,
      ),
    ).toThrow('mükerrer slug');
    expect(() => parse({ categoryId: 'category-missing', status: 'draft' })).toThrow(
      'referans',
    );
  });

  it('yalnız published ürünleri published kategoriyle birlikte sıralar/filtreler', () => {
    const docs = [
      document(),
      document(
        { id: 'product-draft', slug: 'draft', status: 'draft' },
        'product-draft.json',
      ),
      document(
        { id: 'product-first', slug: 'first', sortOrder: 0 },
        'product-first.json',
      ),
    ];
    const all = parseProductDocuments(docs, categories);
    expect(selectPublishedProducts(all, categories).map((item) => item.slug)).toEqual([
      'first',
      'test',
    ]);
    expect(selectPublishedProducts(all, categories, 'category-missing')).toEqual([]);
    expect(
      selectPublishedProducts(
        all,
        categories.map((item) => ({ ...item, status: 'draft' })),
      ),
    ).toEqual([]);
    expect(all).toHaveLength(3);
  });

  it('görsel veri sözleşmesini doğrular, yükleme veya decode yapmaz', () => {
    const image = {
      id: 'test-photo',
      url: '/images/products/test.webp',
      alt: 'Yalnız test resmi',
      width: 1200,
      height: 800,
      variants: [
        { url: '/images/products/test-640.avif', width: 640, format: 'image/avif' },
      ],
    };
    expect(parse({ images: [image] }).images).toEqual([image]);
    for (const bad of [
      { ...image, alt: '' },
      { ...image, width: 0 },
      { ...image, url: 'https://example.com/test.webp' },
      { ...image, onerror: 'test' },
      { ...image, variants: [{ ...image.variants[0], extra: true }] },
    ]) {
      expect(() => parse({ images: [bad] })).toThrow();
    }
  });
});
