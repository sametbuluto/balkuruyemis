import { loadProducts } from './products.server';

// Tek düzenlenebilir kaynak content/products/*.json; boş koleksiyon geçerlidir.
export const products = loadProducts();
export const getProducts = loadProducts;
