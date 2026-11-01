import type { Branch } from '../types/content';
import { loadBranches } from './branches.server';
import { selectPublishedBranches, selectVisibleBranches } from './branch-schema';

// JSON tek düzenlenebilir kaynaktır; bu export yalnız uyumluluk snapshot'ıdır.
export const branches = loadBranches();
export const getBranches = loadBranches;

export function getVisibleBranches() {
  return selectVisibleBranches(getBranches());
}

/** Loader korunan kimlik onayını doğrular; yalnız verified/published detay üretir. */
export function getPublishedBranches(): Branch[] {
  return selectPublishedBranches(getBranches());
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
