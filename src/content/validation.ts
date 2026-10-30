import type {
  BranchCardEntry,
  BrandAssets,
  ContactChannel,
  MediaAsset,
  Product,
  ProductCategory,
} from '../types/content';
import { coordinateText } from './maps';

export interface ContentBundle {
  categories: readonly ProductCategory[];
  products: readonly Product[];
  branches: readonly BranchCardEntry[];
  gallery: readonly MediaAsset[];
  brandAssets: BrandAssets;
  channels: readonly ContactChannel[];
}

export function allMedia(content: ContentBundle): MediaAsset[] {
  return [
    content.brandAssets.logo,
    content.brandAssets.inverseLogo,
    ...content.gallery,
    ...content.categories.map((item) => item.image),
    ...content.products.flatMap((item) => item.images),
    ...content.branches.flatMap((item) => item.images),
  ].filter((item): item is MediaAsset => item !== null);
}

export function validateContent(content: ContentBundle): string[] {
  const errors: string[] = [];
  const checkUrl = (value: string | null, label: string, hosts?: string[]) => {
    if (value === null) return;
    try {
      const url = new URL(value);
      if (
        url.protocol !== 'https:' ||
        url.username ||
        url.password ||
        (hosts && !hosts.includes(url.hostname))
      )
        errors.push(`${label}: güvenilir HTTPS bağlantısı gerekli.`);
    } catch {
      errors.push(`${label}: geçersiz bağlantı.`);
    }
  };
  const checkCollection = (
    items: readonly {
      id: string;
      slug?: string | null;
      name: string;
      sortOrder: number;
    }[],
    label: string,
  ) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const item of items) {
      if (!item.id.trim() || ids.has(item.id))
        errors.push(`${label}: boş veya yinelenen id ${item.id}.`);
      ids.add(item.id);
      if (!item.name.trim() || !Number.isInteger(item.sortOrder) || item.sortOrder < 0)
        errors.push(`${label}/${item.id}: ad ve sıra gerekli.`);
      if (item.slug !== undefined && item.slug !== null) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug))
          errors.push(`${label}/${item.id}: geçersiz veya yinelenen slug.`);
        slugs.add(item.slug);
      }
    }
  };
  checkCollection(content.categories, 'Kategoriler');
  checkCollection(content.products, 'Ürünler');
  checkCollection(content.branches, 'Şubeler');
  for (const product of content.products)
    if (!content.categories.some((category) => category.id === product.categoryId))
      errors.push(`${product.id}: kategori bulunamadı.`);
  for (const branch of content.branches) {
    const branchId = branch.id;
    if (branch.contentKind === 'example' && branch.status === 'published')
      errors.push(`${branch.id}: örnek şube yayımlanamaz.`);
    if (branch.contentKind === 'location' && branch.slug !== null)
      errors.push(`${branchId}: eşleşmesi beklenen konumun detay slug'ı olamaz.`);
    if (branch.coordinates) {
      const { latitude, longitude } = branch.coordinates;
      if (
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
      )
        errors.push(`${branch.id}: geçersiz koordinat.`);
      if (branch.contentKind === 'location' && branch.googleMapsUrl) {
        try {
          if (
            new URL(branch.googleMapsUrl).searchParams.get('q') !==
            coordinateText(branch.coordinates)
          )
            errors.push(`${branch.id}: harita koordinatı kayıtla eşleşmiyor.`);
        } catch {
          /* URL hatası aşağıda raporlanır. */
        }
      }
    } else if (branch.contentKind === 'location' && branch.googleMapsUrl)
      errors.push(`${branch.id}: koordinatı olmayan konuma harita bağlantısı verilemez.`);
    checkUrl(branch.googleMapsUrl, `${branch.id}/Maps`, [
      'maps.google.com',
      'www.google.com',
      'maps.app.goo.gl',
    ]);
    checkUrl(branch.whatsappUrl, `${branch.id}/WhatsApp`, [
      'wa.me',
      'api.whatsapp.com',
      'www.whatsapp.com',
    ]);
  }
  for (const channel of content.channels)
    checkUrl(
      channel.url,
      channel.name,
      channel.id === 'instagram'
        ? ['instagram.com', 'www.instagram.com']
        : ['wa.me', 'api.whatsapp.com', 'www.whatsapp.com'],
    );
  const checkMediaPath = (url: string, id: string) => {
    if (
      !url.startsWith('/') ||
      url.startsWith('//') ||
      url.includes('..') ||
      /[?#]/.test(url) ||
      !/\.(avif|webp|png|jpe?g|svg)$/i.test(url)
    )
      errors.push(`${id}: yerel ve geçerli görsel yolu gerekli.`);
  };
  for (const media of allMedia(content)) {
    if (
      !media.id.trim() ||
      !media.alt.trim() ||
      !Number.isInteger(media.width) ||
      !Number.isInteger(media.height) ||
      media.width <= 0 ||
      media.height <= 0
    )
      errors.push(`${media.id}: alt metin ve pozitif görsel boyutları gerekli.`);
    checkMediaPath(media.url, media.id);
    const variants = new Set<string>();
    for (const item of media.variants ?? []) {
      checkMediaPath(item.url, media.id);
      if (
        !Number.isInteger(item.width) ||
        item.width <= 0 ||
        variants.has(`${item.format}/${item.width}`) ||
        !item.url.endsWith(item.format === 'image/avif' ? '.avif' : '.webp')
      )
        errors.push(`${media.id}: geçersiz görsel varyantı.`);
      variants.add(`${item.format}/${item.width}`);
    }
  }
  return errors;
}
