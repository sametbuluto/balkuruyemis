import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { parseMediaAsset, strictObject } from '../content/content-schema';
import { mediaLimits, validateMediaFiles } from '../content/media-files.server';
import type { MediaAsset } from '../types/content';

export function cmsFail(context: string, message: string): never {
  throw new Error(`CMS aday doğrulaması: ${JSON.stringify(context)}: ${message}`);
}

/** Raw upload'ı değiştirmez. Yalnız izole candidate için temiz byte/ölçü üretir. */
export async function createMediaAdapter(sourceRoot: string) {
  const files = await validateMediaFiles([], sourceRoot);
  const sanitized = new Map<string, Buffer>();
  let total = 0;
  for (const [url, file] of files) {
    const bytes = await sharp(file.bytes, {
      failOn: 'warning',
      limitInputPixels: mediaLimits.pixels,
    })
      .rotate()
      .toColourspace('srgb')
      .toFormat(file.format)
      .toBuffer();
    total += bytes.length;
    if (bytes.length > mediaLimits.fileBytes || total > mediaLimits.totalBytes)
      cmsFail(url, 'temizlenmiş dosya/toplam byte sınırı aşıldı.');
    const meta = await sharp(bytes).metadata();
    if (meta.exif || meta.xmp || meta.iptc || meta.icc)
      cmsFail(url, 'temiz çıktı metadata taşıyor.');
    sanitized.set(url, bytes);
  }
  const media = (input: unknown, owner: string, slot: string): MediaAsset | null => {
    if (input === undefined || input === null) return null;
    const label = `${owner}.${slot}`;
    const record = strictObject(
      input,
      [],
      ['id', 'url', 'alt', 'width', 'height', 'variants', 'status', 'sortOrder'],
      label,
      cmsFail,
    );
    // CMS optional object'i boş alt alanlarla da kaydedebilir.
    if (
      !record.url &&
      !record.alt &&
      Object.keys(record).every((key) => ['url', 'alt'].includes(key))
    )
      return null;
    if (typeof record.url !== 'string') cmsFail(label, 'fotoğraf seçimi gerekli.');
    const file = files.get(record.url);
    if (!file) cmsFail(label, 'seçilen yerel dosya bulunamadı veya yolu geçersiz.');
    for (const key of ['width', 'height'])
      if (
        record[key] !== undefined &&
        (typeof record[key] !== 'number' ||
          !Number.isSafeInteger(record[key]) ||
          record[key] <= 0)
      )
        cmsFail(label, 'mevcut ölçü alanı geçersiz tipte.');
    const id =
      record.id ??
      `media-${createHash('sha256').update(`${owner}\0${slot}\0${record.url}`).digest('hex').slice(0, 32)}`;
    // Bu özel adaptör ölçüleri dosyadan üretir; uygulamanın strict loader'ı gevşemez.
    return parseMediaAsset(
      { ...record, id, width: file.width, height: file.height },
      label,
      cmsFail,
    );
  };
  return { files, sanitized, media };
}
