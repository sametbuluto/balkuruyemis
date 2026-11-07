import { assertEditorialContent } from './editorial.server';
import { getAnnouncements } from './announcements';
import { getCategories } from './categories';
import { getProducts } from './products';
import { getBranches } from './branches';
import { getGalleryEntries } from './gallery';
import { validateMediaFiles } from './media-files.server';
import { brandAssets } from './site';
import { contactChannels } from './social';
import { allMedia, validateContent } from './validation';

export function getContentBundle() {
  assertEditorialContent();
  const categories = getCategories();
  return {
    categories,
    products: getProducts(undefined, categories),
    branches: getBranches(),
    gallery: getGalleryEntries(),
    announcements: getAnnouncements(),
    brandAssets,
    channels: contactChannels,
  };
}

export function validateContentBundle(content: ReturnType<typeof getContentBundle>) {
  const errors = validateContent(content);
  if (errors.length) throw new Error(`İçerik doğrulama başarısız:\n${errors.join('\n')}`);
}

export async function assertSiteContent() {
  const content = getContentBundle();
  validateContentBundle(content);
  await validateMediaFiles(allMedia(content));
}
