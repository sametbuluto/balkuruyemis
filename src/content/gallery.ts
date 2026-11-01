import type { GalleryUsage } from '../types/content';
import { loadGallery } from './gallery.server';
import { selectPublishedMedia } from './media-selection';

// Tek düzenlenebilir kaynak content/gallery/*.json; boş koleksiyon geçerli.
export function getGalleryEntries() {
  return loadGallery();
}
export function getGalleryImages(usage: GalleryUsage) {
  return selectPublishedMedia(
    getGalleryEntries().filter((entry) => entry.usages.includes(usage)),
  );
}
export function getHeroImage() {
  return getGalleryImages('home-hero')[0] ?? getGalleryImages('brand-gallery')[0];
}
export const brandGallery = getGalleryImages('brand-gallery');
