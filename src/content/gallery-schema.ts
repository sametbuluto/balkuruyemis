import type { GalleryEntry, GalleryUsage } from '../types/content';
import { parseMediaAsset, strictObject } from './content-schema';

export interface GalleryDocument {
  filename: string;
  source: string;
}
function fail(context: string, reason: string): never {
  throw new Error(`Galeri JSON doğrulaması: ${context}: ${reason}`);
}
const usages: readonly GalleryUsage[] = [
  'home-hero',
  'brand-gallery',
  'branches-gallery',
];

export function parseGalleryDocuments(
  documents: readonly GalleryDocument[],
): readonly GalleryEntry[] {
  const ids = new Set<string>();
  const entries = documents.map(({ filename, source }): GalleryEntry => {
    const context = JSON.stringify(filename);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(filename))
      fail(context, 'geçersiz dosya adı.');
    let input: unknown;
    try {
      input = JSON.parse(source) as unknown;
    } catch {
      fail(context, 'geçerli JSON değil.');
    }
    const record = strictObject(
      input,
      ['id', 'url', 'alt', 'width', 'height', 'sortOrder', 'status', 'usages'],
      ['variants'],
      context,
      fail,
    );
    const { usages: usageInput, ...assetInput } = record;
    const asset = parseMediaAsset(assetInput, context, fail);
    if (
      !asset ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(asset.id) ||
      `${asset.id}.json` !== filename
    )
      fail(context, 'ID ve dosya adı eşleşmeli.');
    if (ids.has(asset.id)) fail(context, 'mükerrer medya ID.');
    ids.add(asset.id);
    if (
      !Array.isArray(usageInput) ||
      !usageInput.length ||
      new Set(usageInput).size !== usageInput.length
    )
      fail(context, 'benzersiz kullanım alanları gerekli.');
    const selected = usageInput.map((value: unknown) => {
      if (!usages.some((usage) => usage === value))
        fail(context, 'geçersiz kullanım alanı.');
      return value as GalleryUsage;
    });
    // parseMediaAsset status/sıra tiplerini doğruladı; galeri için ikisi zorunlu.
    if (asset.status === undefined || asset.sortOrder === undefined)
      fail(context, 'yayın/sıra gerekli.');
    return Object.freeze({
      ...asset,
      status: asset.status,
      sortOrder: asset.sortOrder,
      usages: Object.freeze(selected),
    });
  });
  return Object.freeze(
    entries.sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id, 'en')),
  );
}
