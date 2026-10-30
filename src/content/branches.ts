import type { Branch, BranchCardEntry } from '../types/content';

// Yalnızca işletme sahibinin sağladığı bilgiler. Semt/işletme adı eşleştirmesi yapılmadı.
export const branches: readonly BranchCardEntry[] = [
  {
    id: 'location-1',
    slug: null,
    name: 'Konum 1',
    description:
      'İşletme sahibinin paylaştığı gerçek konum. Şube adı ve açık adres eşleşmesi bekleniyor.',
    coordinates: { latitude: 38.362633, longitude: 27.148943 },
    googleMapsUrl: 'https://maps.google.com/?q=38.362633,27.148943',
    address: null,
    phone: null,
    openingHours: null,
    whatsappUrl: null,
    images: [],
    sortOrder: 1,
    status: 'published',
    contentKind: 'location',
  },
  {
    id: 'location-2',
    slug: null,
    name: 'Konum 2',
    description:
      'İşletme sahibinin paylaştığı gerçek konum. Şube adı ve açık adres eşleşmesi bekleniyor.',
    coordinates: { latitude: 38.374462, longitude: 27.183882 },
    googleMapsUrl: 'https://maps.google.com/?q=38.374462,27.183882',
    address: null,
    phone: null,
    openingHours: null,
    whatsappUrl: null,
    images: [],
    sortOrder: 2,
    status: 'published',
    contentKind: 'location',
  },
  {
    id: 'location-3',
    slug: null,
    name: 'Konum 3',
    description:
      'İşletme sahibinin paylaştığı gerçek konum. Şube adı ve açık adres eşleşmesi bekleniyor.',
    coordinates: { latitude: 38.367344, longitude: 27.148973 },
    googleMapsUrl: 'https://maps.google.com/?q=38.367344,27.148973',
    address: null,
    phone: null,
    openingHours: null,
    whatsappUrl: null,
    images: [],
    sortOrder: 3,
    status: 'published',
    contentKind: 'location',
  },
  {
    id: 'location-4',
    slug: null,
    name: 'Konum 4',
    description:
      'İşletme sahibinin paylaştığı gerçek konum. Şube adı ve açık adres eşleşmesi bekleniyor.',
    coordinates: { latitude: 38.378593, longitude: 27.163704 },
    googleMapsUrl: 'https://maps.google.com/?q=38.378593,27.163704',
    address: null,
    phone: null,
    openingHours: null,
    whatsappUrl: null,
    images: [],
    sortOrder: 4,
    status: 'published',
    contentKind: 'location',
  },
];

export function getVisibleBranches(): BranchCardEntry[] {
  return branches
    .filter((branch) => branch.status === 'published' && branch.contentKind !== 'example')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Yalnızca kimliği doğrulanmış tam şube kayıtları detay/sitemap için uygundur. */
export function getPublishedBranches(): Branch[] {
  return branches
    .filter(
      (branch): branch is Branch =>
        branch.contentKind === 'verified' && branch.status === 'published',
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublishedBranch(slug: string): Branch | undefined {
  return getPublishedBranches().find((branch) => branch.slug === slug);
}

// Yalnızca örnek içerik testleri ve ayrı tasarım önizlemeleri için; gerçek konumlarla birleşmez.
export const exampleBranches: readonly Branch[] = branches.map((_, index) => ({
  id: `example-branch-${index + 1}`,
  slug: `ornek-sube-${index + 1}`,
  name: `Şube ${String(index + 1).padStart(2, '0')}`,
  description: 'Bu kart, şube bilgilerinin yerleşimini göstermek için hazırlanmıştır.',
  address: null,
  phone: null,
  openingHours: null,
  googleMapsUrl: null,
  whatsappUrl: null,
  images: [],
  sortOrder: index + 1,
  status: 'draft',
  contentKind: 'example',
}));
