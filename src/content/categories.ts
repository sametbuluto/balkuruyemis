import { loadCategories } from './categories.server';

// Tek düzenlenebilir kaynak content/categories/*.json. Bu snapshot eski importları korur.
export const productCategories = loadCategories();
// Sunucu render/build okumaları her çağrıda strict doğrulanır; fallback/cache yoktur.
export const getCategories = loadCategories;
