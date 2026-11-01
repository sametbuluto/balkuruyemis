import type { MediaAsset } from '../types/content';

export type SchemaFailure = (context: string, reason: string) => never;

export function strictObject(
  value: unknown,
  required: readonly string[],
  optional: readonly string[],
  context: string,
  fail: SchemaFailure,
): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    fail(context, 'nesne gerekli.');
  const record = value as Record<string, unknown>;
  if (required.some((key) => !Object.hasOwn(record, key)))
    fail(context, 'zorunlu alan eksik.');
  const unknown = Object.keys(record).find(
    (key) => !required.includes(key) && !optional.includes(key),
  );
  if (unknown !== undefined) fail(context, `bilinmeyen alan ${JSON.stringify(unknown)}.`);
  return record;
}

export function requiredText(
  value: unknown,
  context: string,
  fail: SchemaFailure,
): string {
  if (typeof value !== 'string' || !value.trim())
    fail(context, 'boş olmayan metin gerekli.');
  return value;
}

export function safeInteger(
  value: unknown,
  minimum: number,
  context: string,
  fail: SchemaFailure,
): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum)
    fail(context, `en az ${minimum} olan tam sayı gerekli.`);
  return value;
}

export const mediaLocalPath =
  /^\/images\/(brand|products|categories|branches|gallery)\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.(jpg|jpeg|png|webp|avif)$/;

function mediaPath(value: unknown, context: string, fail: SchemaFailure): string {
  const url = requiredText(value, context, fail);
  if (!mediaLocalPath.test(url))
    fail(context, 'public/images altında izinli yerel raster yolu gerekli.');
  return url;
}

export function parseMediaAsset(
  value: unknown,
  context: string,
  fail: SchemaFailure,
): MediaAsset | null {
  if (value === null) return null;
  const record = strictObject(
    value,
    ['id', 'url', 'alt', 'width', 'height'],
    ['variants', 'status', 'sortOrder'],
    context,
    fail,
  );
  const result: MediaAsset = {
    id: requiredText(record.id, `${context}.id`, fail),
    url: mediaPath(record.url, `${context}.url`, fail),
    alt: requiredText(record.alt, `${context}.alt`, fail),
    width: safeInteger(record.width, 1, `${context}.width`, fail),
    height: safeInteger(record.height, 1, `${context}.height`, fail),
  };
  if (Object.hasOwn(record, 'status')) {
    if (record.status !== 'draft' && record.status !== 'published')
      fail(context, 'geçersiz görsel yayın durumu.');
    result.status = record.status;
  }
  if (Object.hasOwn(record, 'sortOrder'))
    result.sortOrder = safeInteger(record.sortOrder, 0, `${context}.sortOrder`, fail);
  if (Object.hasOwn(record, 'variants')) {
    if (!Array.isArray(record.variants)) fail(context, 'variants dizi olmalı.');
    const seen = new Set<string>();
    result.variants = record.variants.map((value: unknown, index: number) => {
      const label = `${context}.variants[${index}]`;
      const variant = strictObject(value, ['url', 'width', 'format'], [], label, fail);
      const format = variant.format;
      if (format !== 'image/avif' && format !== 'image/webp')
        fail(label, 'geçersiz varyant formatı.');
      const url = mediaPath(variant.url, `${label}.url`, fail);
      const width = safeInteger(variant.width, 1, `${label}.width`, fail);
      const key = `${format}/${width}`;
      if (seen.has(key) || !url.endsWith(format === 'image/avif' ? '.avif' : '.webp'))
        fail(label, 'yinelenen veya uzantısı uyuşmayan varyant.');
      seen.add(key);
      return Object.freeze({ url, width, format });
    });
    Object.freeze(result.variants);
  }
  return Object.freeze(result);
}
