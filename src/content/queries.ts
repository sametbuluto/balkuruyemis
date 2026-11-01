import { getCategories } from './categories';
import { selectPublishedCategories } from './category-schema';
import { getProducts } from './products';
import { selectPublishedProducts } from './product-schema';

export function getPublishedCategories() {
  return selectPublishedCategories(getCategories());
}

export function getCategoryBySlug(slug: string) {
  return getPublishedCategories().find((category) => category.slug === slug);
}

export function getPublishedProducts(categoryId?: string) {
  const categories = getCategories();
  return selectPublishedProducts(
    getProducts(undefined, categories),
    categories,
    categoryId,
  );
}
