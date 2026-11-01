import type { MediaAsset } from '../types/content';

/** Eski gömülü kayıtlar aynı sırayla published kalır; yeni metadata isteğe bağlıdır. */
export function selectPublishedMedia<T extends MediaAsset>(images: readonly T[]): T[] {
  return images
    .map((image, index) => ({ image, index }))
    .filter(({ image }) => image.status !== 'draft')
    .sort((a, b) => (a.image.sortOrder ?? a.index) - (b.image.sortOrder ?? b.index))
    .map(({ image }) => image);
}
