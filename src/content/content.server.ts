import { existsSync } from 'node:fs';
import path from 'node:path';
import { getCategories } from './categories';
import { getProducts } from './products';
import { getBranches } from './branches';
import { brandGallery } from './gallery';
import { brandAssets } from './site';
import { contactChannels } from './social';
import { allMedia, validateContent } from './validation';

export function assertSiteContent() {
  const categories = getCategories();
  const content = {
    categories,
    products: getProducts(undefined, categories),
    branches: getBranches(),
    gallery: brandGallery,
    brandAssets,
    channels: contactChannels,
  };
  const errors = validateContent(content);
  for (const media of allMedia(content))
    for (const url of [
      media.url,
      ...(media.variants ?? []).map((variant) => variant.url),
    ]) {
      if (!existsSync(path.join(process.cwd(), 'public', url.slice(1))))
        errors.push(`${media.id}: public dosyası bulunamadı: ${url}`);
    }
  if (errors.length) throw new Error(`İçerik doğrulama başarısız:\n${errors.join('\n')}`);
}
