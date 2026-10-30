import type { ProductCategory } from '../types/content';

// Ürün sahibinin Faz 2 için belirlediği başlangıç kategorileri.
export const productCategories: readonly ProductCategory[] = [
  {
    id: 'category-kuruyemis',
    slug: 'kuruyemis',
    name: 'Kuruyemiş',
    description: 'Sohbetlere ve paylaşılan sofralara eşlik eden lezzetler.',
    image: null,
    sortOrder: 1,
    status: 'published',
  },
  {
    id: 'category-kahve',
    slug: 'kahve',
    name: 'Kahve',
    description: 'Günün keyifli molaları için kahve dünyası.',
    image: null,
    sortOrder: 2,
    status: 'published',
  },
  {
    id: 'category-lokum',
    slug: 'lokum',
    name: 'Lokum',
    description: 'İkramlara ve tatlı buluşmalara ayrılan bir köşe.',
    image: null,
    sortOrder: 3,
    status: 'published',
  },
  {
    id: 'category-baharat',
    slug: 'baharat',
    name: 'Baharat',
    description: 'Mutfakta farklı tatlara açılan bir kapı.',
    image: null,
    sortOrder: 4,
    status: 'published',
  },
  {
    id: 'category-aktar',
    slug: 'aktar',
    name: 'Aktar',
    description: 'Aktar ürünlerini bir araya getiren kategori.',
    image: null,
    sortOrder: 5,
    status: 'published',
  },
  {
    id: 'category-kozmetik',
    slug: 'kozmetik',
    name: 'Kozmetik',
    description: 'Kişisel bakım dünyasına ayrılan ürün kategorimiz.',
    image: null,
    sortOrder: 6,
    status: 'published',
  },
];
