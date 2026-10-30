import type { Branch } from '@/types/content';

// Dört şubenin doğrulanmış adları ve bilgileri henüz paylaşılmadı.
export const branches: readonly Branch[] = [];

// Sadece tasarım önizlemesi. Gerçek kayıtlarla ve yayımlama sorgularıyla karıştırılmaz.
export const exampleBranches: readonly Branch[] = Array.from(
  { length: 4 },
  (_, index) => ({
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
  }),
);

export function getPublishedBranches(): Branch[] {
  return branches
    .filter(
      (branch) => branch.status === 'published' && branch.contentKind === 'verified',
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublishedBranch(slug: string): Branch | undefined {
  return getPublishedBranches().find((branch) => branch.slug === slug);
}
