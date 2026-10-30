import type { ProductCategory } from '@/types/content';

export function resolveCategorySelection(
  search: string,
  categories: readonly ProductCategory[],
) {
  const values = new URLSearchParams(search).getAll('kategori');
  const selected =
    values.length === 1
      ? categories.find((category) => category.slug === values[0])
      : undefined;
  return { selected, invalid: values.length > 0 && !selected };
}
