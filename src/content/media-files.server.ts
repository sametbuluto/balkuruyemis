import { createHash } from 'node:crypto';
import {
  lstat,
  readdir,
  readFile,
  realpath,
  mkdir,
  writeFile,
  rm,
} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { mediaLocalPath as localPath } from './content-schema';
import type { MediaAsset } from '../types/content';

export const mediaLimits = {
  fileBytes: 5 * 1024 * 1024,
  totalBytes: 20 * 1024 * 1024,
  files: 128,
  pixels: 24_000_000,
  dimension: 8000,
} as const;
type RasterFormat = 'jpeg' | 'png' | 'webp' | 'avif';
interface CheckedFile {
  url: string;
  file: string;
  bytes: Buffer;
  width: number;
  height: number;
  format: RasterFormat;
  digest: string;
}
function fail(label: string, reason: string): never {
  throw new Error(`Medya doğrulaması: ${JSON.stringify(label)}: ${reason}`);
}
const digest = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

export async function inspectImage(file: string, url: string): Promise<CheckedFile> {
  if (!localPath.test(url))
    fail(url, 'izinli yerel raster yolu gerekli; SVG bu aşamada kapalı.');
  const stat = await lstat(file);
  if (!stat.isFile() || stat.size === 0 || stat.size > mediaLimits.fileBytes)
    fail(url, 'normal dosya ve 5 MiB sınırı gerekli.');
  const bytes = await readFile(file);
  if (bytes.length > mediaLimits.fileBytes)
    fail(url, 'dosya okuma sırasında boyut sınırı aşıldı.');
  const ext = path.extname(url).slice(1);
  const format: RasterFormat =
    ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : (ext as RasterFormat);
  const signature =
    format === 'jpeg'
      ? bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
      : format === 'png'
        ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : format === 'webp'
          ? bytes.toString('ascii', 0, 4) === 'RIFF' &&
            bytes.toString('ascii', 8, 12) === 'WEBP'
          : bytes.toString('ascii', 4, 8) === 'ftyp' &&
            /avif/.test(bytes.toString('ascii', 8, Math.min(bytes.readUInt32BE(0), 64)));
  if (!signature) fail(url, 'dosya imzası/uzantı (MIME) uyuşmuyor.');
  try {
    const decoder = sharp(bytes, {
      failOn: 'warning',
      limitInputPixels: mediaLimits.pixels,
    });
    const metadata = await decoder.metadata();
    const width = metadata.autoOrient.width;
    const height = metadata.autoOrient.height;
    if (
      metadata.mediaType !== `image/${format}` ||
      (metadata.pages ?? 1) !== 1 ||
      !width ||
      !height ||
      width > mediaLimits.dimension ||
      height > mediaLimits.dimension ||
      width * height > mediaLimits.pixels
    )
      fail(url, 'MIME, tek kare veya çözünürlük sınırı geçersiz.');
    // metadata() yalnız header okur. stats() sıkıştırılmış piksel verisini gerçekten çözer.
    await decoder.stats();
    return { url, file, bytes, width, height, format, digest: digest(bytes) };
  } catch (error) {
    fail(
      url,
      `bozuk/geçersiz görsel veya çözünürlük: ${error instanceof Error ? error.message : 'decode hatası'}`,
    );
  }
}

export async function validateMediaFiles(
  assets: readonly MediaAsset[],
  root = process.cwd(),
) {
  const publicRoot = path.join(await realpath(root), 'public');
  const files = new Map<string, CheckedFile>();
  let totalBytes = 0;
  async function walk(directory: string) {
    const stat = await lstat(directory);
    if (!stat.isDirectory())
      fail(directory, 'normal dizin gerekli; symlink kabul edilmez.');
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) =>
      a.name.localeCompare(b.name, 'en'),
    )) {
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) fail(file, 'symlink kabul edilmez.');
      if (entry.name === '.gitkeep' || entry.name === '.DS_Store') continue;
      if (entry.isDirectory()) {
        await walk(file);
        continue;
      }
      const url = `/${path.relative(publicRoot, file).split(path.sep).join('/')}`;
      if (!localPath.test(url))
        fail(url, 'izinli dosya yolu/formatı gerekli; SVG kapalı.');
      totalBytes += (await lstat(file)).size;
      if (totalBytes > mediaLimits.totalBytes || files.size >= mediaLimits.files)
        fail(url, 'toplam byte/dosya sınırı aşıldı.');
      files.set(url, await inspectImage(file, url));
    }
  }
  if (!(await lstat(publicRoot)).isDirectory())
    fail(publicRoot, 'public normal bir dizin olmalı.');
  await walk(path.join(publicRoot, 'images'));
  const ids = new Set<string>();
  for (const asset of assets) {
    if (ids.has(asset.id)) fail(asset.id, 'mükerrer medya ID.');
    ids.add(asset.id);
    if (!asset.alt.trim()) fail(asset.id, 'alt metin gerekli.');
    for (const [url, width, height, format] of [
      [asset.url, asset.width, asset.height, null],
      ...(asset.variants ?? []).map((v) => [v.url, v.width, null, v.format] as const),
    ] as const) {
      if (!localPath.test(url))
        fail(url, 'güvensiz yerel yol veya desteklenmeyen format.');
      const file = files.get(url);
      if (!file) fail(url, 'fiziksel görsel dosyası bulunamadı.');
      if (
        width !== file.width ||
        (height !== null && height !== file.height) ||
        (format && format !== `image/${file.format}`)
      )
        fail(url, 'gerçek dosya boyutları/MIME ile metadata eşleşmiyor.');
      if (
        height === null &&
        Math.abs(file.height - (file.width * asset.height) / asset.width) > 1
      )
        fail(url, 'responsive varyant en-boy oranı eşleşmiyor.');
    }
  }
  return files;
}

/** Yalnız üretilmiş out/images değiştirilir. Kaynak dosyalar ve Git geçmişi korunur. */
export async function writeSanitizedImages(
  assets: readonly MediaAsset[],
  files: ReadonlyMap<string, CheckedFile>,
  root = process.cwd(),
) {
  const output = path.join(await realpath(root), 'out');
  if (!(await lstat(output)).isDirectory()) fail(output, 'statik çıktı dizini gerekli.');
  const outputImages = path.join(output, 'images');
  try {
    if ((await lstat(outputImages)).isSymbolicLink())
      fail(outputImages, 'çıktıda symlink reddedildi.');
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT'))
      throw error;
  }
  // Next public/ içeriğini ham kopyalar. Draft/orphan dosyaların public çıktıda kalmasını önle.
  await rm(outputImages, { recursive: true, force: true });
  const urls = new Set(
    assets.flatMap((asset) => [asset.url, ...(asset.variants ?? []).map((v) => v.url)]),
  );
  let outputBytes = 0;
  for (const url of urls) {
    const file = files.get(url);
    if (!file) fail(url, 'doğrulanmış görsel bulunamadı.');
    const bytes = await sharp(file.bytes, {
      failOn: 'warning',
      limitInputPixels: mediaLimits.pixels,
    })
      .rotate()
      .toColourspace('srgb')
      .toFormat(file.format)
      .toBuffer();
    if (bytes.length > mediaLimits.fileBytes)
      fail(url, 'temizlenmiş çıktı boyutu sınırı aşıldı.');
    outputBytes += bytes.length;
    if (outputBytes > mediaLimits.totalBytes)
      fail(url, 'temizlenmiş toplam çıktı sınırı aşıldı.');
    const target = path.join(output, url.slice(1));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
  return urls.size;
}
