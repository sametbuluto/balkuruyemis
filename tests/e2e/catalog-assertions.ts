import { expect, type Page } from '@playwright/test';
import type { Product } from '../../src/types/content';

// Boş katalog testini korur; ileride gerçek ürün eklenmesi CI'ı kilitlemez.
export async function expectCatalogProducts(
  page: Page,
  products: readonly Product[],
  emptyTitle: string,
) {
  const emptyHeading = page.getByRole('heading', { name: emptyTitle, exact: true });
  if (!products.length) {
    await expect(emptyHeading).toBeVisible();
    return;
  }
  await expect(emptyHeading).toHaveCount(0);
  for (const product of products) {
    const card = page
      .getByRole('article')
      .filter({
        has: page.getByRole('heading', { level: 3, name: product.name, exact: true }),
      })
      .filter({ hasText: product.description });
    await expect(card.first()).toBeVisible();
  }
}
