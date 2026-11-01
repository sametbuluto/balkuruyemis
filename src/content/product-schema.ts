import { selectPublishedMedia } from './media-selection';
import type { Product, ProductCategory } from '../types/content';
import {
  parseMediaAsset,
  requiredText,
  safeInteger,
  strictObject,
} from './content-schema';

export interface ProductDocument {
  filename: string;
  source: string;
}

function fail(context: string, reason: string): never {
  throw new Error(`Ürün JSON doğrulaması: ${context}: ${reason}`);
}

export function parseProductJson(
  source: string,
  filename: string,
  categories: readonly ProductCategory[],
): Product {
  const context = JSON.stringify(filename);
  if (!/^product-[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(filename))
    fail(context, 'dosya adı product-<kalıcı-kimlik>.json biçiminde olmalı.');
  let input: unknown;
  try {
    input = JSON.parse(source) as unknown;
  } catch {
    fail(context, 'geçerli JSON değil.');
  }
  const record = strictObject(
    input,
    ['id', 'slug', 'categoryId', 'name', 'description', 'images', 'sortOrder', 'status'],
    [],
    context,
    fail,
  );
  const id = requiredText(record.id, `${context}.id`, fail);
  if (!/^product-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || `${id}.json` !== filename)
    fail(context, 'ürün ID ve dosya adı eşleşmeli.');
  const slug = requiredText(record.slug, `${context}.slug`, fail);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(context, 'geçersiz slug.');
  const categoryId = requiredText(record.categoryId, `${context}.categoryId`, fail);
  if (!categories.some((category) => category.id === categoryId))
    fail(context, 'categoryId mevcut kategori kaydına referans vermeli.');
  const status = record.status;
  if (status !== 'draft' && status !== 'published')
    fail(context, 'geçersiz yayın durumu.');
  if (!Array.isArray(record.images)) fail(context, 'images dizi olmalı.');
  const images = record.images.map((value: unknown, index: number) => {
    const label = `${context}.images[${index}]`;
    const image = parseMediaAsset(value, label, fail);
    if (image === null)
      fail(label, 'görsel nesnesi gerekli; görsel yoksa boş dizi kullanın.');
    return image;
  });
  return Object.freeze({
    id,
    slug,
    categoryId,
    name: requiredText(record.name, `${context}.name`, fail),
    description: requiredText(record.description, `${context}.description`, fail),
    images: Object.freeze(images),
    sortOrder: safeInteger(record.sortOrder, 0, `${context}.sortOrder`, fail),
    status,
  });
}

export function parseProductDocuments(
  documents: readonly ProductDocument[],
  categories: readonly ProductCategory[],
): readonly Product[] {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const products = documents.map(({ filename, source }) => {
    const product = parseProductJson(source, filename, categories);
    if (ids.has(product.id)) fail(JSON.stringify(filename), 'mükerrer ürün ID.');
    if (slugs.has(product.slug)) fail(JSON.stringify(filename), 'mükerrer slug.');
    ids.add(product.id);
    slugs.add(product.slug);
    return product;
  });
  return Object.freeze(
    products.sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id, 'en')),
  );
}

export function selectPublishedProducts(
  products: readonly Product[],
  categories: readonly ProductCategory[],
  categoryId?: string,
): Product[] {
  const publishedIds = new Set(
    categories
      .filter((category) => category.status === 'published')
      .map((category) => category.id),
  );
  return products
    .filter(
      (product) =>
        product.status === 'published' &&
        publishedIds.has(product.categoryId) &&
        (!categoryId || product.categoryId === categoryId),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((product) => ({ ...product, images: selectPublishedMedia(product.images) }));
}
