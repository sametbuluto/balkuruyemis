import { productCategories } from './categories';
import { products } from './products';

export function getPublishedCategories() {
  return productCategories
    .filter((category) => category.status === 'published')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryBySlug(slug: string) {
  return getPublishedCategories().find((category) => category.slug === slug);
}

export function getPublishedProducts(categoryId?: string) {
  const publishedCategoryIds = new Set(
    getPublishedCategories().map((category) => category.id),
  );
  return products
    .filter(
      (product) =>
        product.status === 'published' &&
        publishedCategoryIds.has(product.categoryId) &&
        (!categoryId || product.categoryId === categoryId),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
