import { selectPublishedMedia } from './media-selection';
import type { ProductCategory } from '../types/content';
import {
  parseMediaAsset,
  requiredText,
  safeInteger,
  strictObject,
} from './content-schema';

export interface CategoryDocument {
  filename: string;
  source: string;
}

function fail(context: string, reason: string): never {
  throw new Error(`Kategori JSON doğrulaması: ${context}: ${reason}`);
}

export function parseCategoryJson(source: string, filename: string): ProductCategory {
  const context = JSON.stringify(filename);
  if (!/^category-[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(filename))
    fail(context, 'dosya adı category-<kalıcı-kimlik>.json biçiminde olmalı.');
  let input: unknown;
  try {
    input = JSON.parse(source) as unknown;
  } catch {
    fail(context, 'geçerli JSON değil.');
  }
  const record = strictObject(
    input,
    ['id', 'slug', 'name', 'description', 'image', 'sortOrder', 'status'],
    [],
    context,
    fail,
  );
  const id = requiredText(record.id, `${context}.id`, fail);
  if (!/^category-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || `${id}.json` !== filename)
    fail(context, 'kategori ID ve dosya adı eşleşmeli.');
  const slug = requiredText(record.slug, `${context}.slug`, fail);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(context, 'geçersiz slug.');
  const status = record.status;
  if (status !== 'published' && status !== 'draft')
    fail(context, 'geçersiz yayın durumu.');
  return Object.freeze({
    id,
    slug,
    name: requiredText(record.name, `${context}.name`, fail),
    description: requiredText(record.description, `${context}.description`, fail),
    image: parseMediaAsset(record.image, `${context}.image`, fail),
    sortOrder: safeInteger(record.sortOrder, 0, `${context}.sortOrder`, fail),
    status,
  });
}

export function parseCategoryDocuments(
  documents: readonly CategoryDocument[],
): readonly ProductCategory[] {
  if (!documents.length) fail('koleksiyon', 'en az bir kategori gerekli.');
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const categories = documents.map(({ filename, source }) => {
    const category = parseCategoryJson(source, filename);
    if (ids.has(category.id)) fail(JSON.stringify(filename), 'mükerrer kategori ID.');
    if (slugs.has(category.slug)) fail(JSON.stringify(filename), 'mükerrer slug.');
    ids.add(category.id);
    slugs.add(category.slug);
    return category;
  });
  return Object.freeze(
    categories.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id, 'en'),
    ),
  );
}

export function selectPublishedCategories(
  categories: readonly ProductCategory[],
): ProductCategory[] {
  return categories
    .filter((category) => category.status === 'published')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      ...category,
      image: (category.image && selectPublishedMedia([category.image])[0]) || null,
    }));
}
