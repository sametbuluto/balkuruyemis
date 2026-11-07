import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { mkdir, readdir, writeFile, realpath, lstat } from 'node:fs/promises';
import path from 'node:path';
import { parseCategoryDocuments } from '../content/category-schema';
import { parseProductDocuments } from '../content/product-schema';
import { parseBranchDocuments } from '../content/branch-schema';
import { approvedBranchIdentities } from '../content/branch-identity';
import { parseGalleryDocuments } from '../content/gallery-schema';
import { parseAnnouncementDocuments } from '../content/announcement-schema';
import {
  pageSchemas,
  siteSchema,
  socialSchema,
  type PageId,
} from '../content/editorial-schema';
import { createMediaAdapter, cmsFail } from './media-adapter.server';

const areas = [
  'categories',
  'products',
  'branches',
  'gallery',
  'pages',
  'settings',
  'announcements',
] as const;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
type RecordData = Record<string, unknown>;
export function recordObject(value: unknown, label: string): RecordData {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    cmsFail(label, 'nesne gerekli.');
  return { ...(value as RecordData) };
}
function load(root: string) {
  const result = new Map<string, RecordData>();
  const content = path.join(root, 'content');
  if (!lstatSync(content).isDirectory()) cmsFail('content', 'normal dizin gerekli.');
  for (const entry of readdirSync(content))
    if (
      !areas.some((area) => area === entry) &&
      !['.gitkeep', '.DS_Store'].includes(entry)
    )
      cmsFail('content', 'bilinmeyen kaynak dizini.');
  for (const area of areas) {
    const dir = path.join(content, area);
    if (!lstatSync(dir).isDirectory())
      cmsFail(area, 'normal dizin gerekli; symlink reddedilir.');
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (['.gitkeep', '.DS_Store'].includes(entry.name)) continue;
      const label = `${area}/${entry.name}`;
      if (!entry.isFile() || !/^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(entry.name))
        cmsFail(label, 'normal JSON dosyası gerekli.');
      const file = path.join(dir, entry.name);
      if (lstatSync(file).size > 256 * 1024) cmsFail(label, '256 KiB sınırı.');
      const bytes = readFileSync(file);
      if (bytes.length > 256 * 1024) cmsFail(label, '256 KiB sınırı.');
      let value: unknown;
      try {
        value = JSON.parse(
          new TextDecoder('utf-8', { fatal: true }).decode(bytes),
        ) as unknown;
      } catch {
        cmsFail(label, 'bozuk JSON veya UTF-8.');
      }
      result.set(label, recordObject(value, label));
    }
  }
  return result;
}
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
function immutable(raw: RecordData, base: RecordData, keys: string[], label: string) {
  for (const key of keys) {
    if (base[key] === null && raw[key] === undefined) raw[key] = null;
    if (!same(raw[key], base[key]))
      cmsFail(label, `korunan ${key} alanı değiştirilemez.`);
  }
}
const blankNull = (value: unknown) =>
  value === '' || value === undefined ? null : value;
function instant(value: unknown): unknown {
  if (value === '' || value === undefined || value === null) return null;
  if (typeof value !== 'string') cmsFail('duyuru tarihi', 'tarih metni gerekli.');
  // Native datetime-local save format'ı açık UTC offset taşır; hayalî günler reddedilir.
  const m =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{3})?(Z|[+-]\d{2}:\d{2})$/.exec(
      value,
    );
  if (!m || !Number.isFinite(Date.parse(value)))
    cmsFail('duyuru tarihi', 'açık saat dilimli ISO tarih gerekli.');
  const [year, month, day, hour, minute, second] = m.slice(1, 7).map(Number);
  const maxDay = new Date(Date.UTC(year!, month!, 0)).getUTCDate();
  if (
    month! < 1 ||
    month! > 12 ||
    day! < 1 ||
    day! > maxDay ||
    hour! > 23 ||
    minute! > 59 ||
    second! > 59
  )
    cmsFail('duyuru tarihi', 'geçersiz takvim tarihi.');
  return new Date(value).toISOString();
}

/** Kaynak script'i çalıştırmaz; yalnız veri okur. Git merge/CI yetkisi sağlamaz. */
export async function prepareCmsData(sourceRoot: string, baselineRoot: string) {
  const raw = load(sourceRoot),
    base = load(baselineRoot);
  for (const key of base.keys())
    if (!raw.has(key)) cmsFail(key, 'silme/rename kapalı; draft kullanın.');
  const media = await createMediaAdapter(sourceRoot);
  const baselineFiles = await import('../content/media-files.server').then((m) =>
    m.validateMediaFiles([], baselineRoot),
  );
  for (const url of baselineFiles.keys())
    if (!media.files.has(url))
      cmsFail(url, 'medya silme/rename kapalı; teknik temizleme gerekir.');
  const adaptAsset = (
    input: unknown,
    owner: string,
    slot: string,
    previous?: unknown,
  ) => {
    if (input === undefined || input === null) return null;
    const value = recordObject(input, `${owner}.${slot}`);
    const old =
      previous && typeof previous === 'object' && !Array.isArray(previous)
        ? (previous as RecordData)
        : undefined;
    if ((value.url === null || value.url === '') && old?.url && !value.alt) return null;
    if (old?.url === value.url) {
      value.id ??= old?.id;
      const sameBytes =
        typeof value.url === 'string' &&
        media.files.get(value.url)?.digest === baselineFiles.get(value.url)?.digest;
      if (!sameBytes) delete value.variants;
      else if (value.variants === undefined && old?.variants !== undefined)
        value.variants = old.variants;
    } else if (old) {
      // Fotoğraf değiştiğinde eski fotoğrafın varyantlarını göstermeyin.
      delete value.variants;
    }
    return media.media(value, owner, slot);
  };
  const canonical = new Map<string, RecordData>();
  for (const [key, original] of raw) {
    const value = { ...original };
    const before = base.get(key);
    const [area, filename] = key.split('/') as [string, string];
    const stem = filename.slice(0, -5);
    if (!before) {
      const prefix =
        area === 'products'
          ? 'product-'
          : area === 'gallery'
            ? 'gallery-'
            : area === 'announcements'
              ? 'announcement-'
              : null;
      if (
        !prefix ||
        !stem.startsWith(prefix) ||
        !uuid.test(stem.slice(prefix.length)) ||
        value.editorKey !== stem.slice(prefix.length)
      )
        cmsFail(key, 'yeni kayıt CMS UUID ve dosya şablonuyla eşleşmeli.');
    }
    if (
      value.editorKey !== undefined &&
      (!['products', 'gallery', 'announcements'].includes(area) ||
        typeof value.editorKey !== 'string' ||
        !uuid.test(value.editorKey))
    )
      cmsFail(key, 'geçersiz CMS UUID.');
    delete value.editorKey;
    if (['products', 'gallery', 'announcements'].includes(area)) {
      if (value.id !== undefined && value.id !== stem)
        cmsFail(key, 'ID ve dosya adı eşleşmeli.');
      value.id = stem;
      if (area !== 'gallery') {
        if (before) {
          if (!Object.hasOwn(value, 'slug')) value.slug = before.slug;
          immutable(value, before, ['slug'], key);
        } else value.slug ??= stem;
      }
    }
    if (area === 'categories') {
      immutable(value, before!, ['id', 'slug'], key);
      value.image = adaptAsset(value.image, stem, 'image', before?.image);
    }
    if (area === 'branches') {
      immutable(
        value,
        before!,
        ['id', 'slug', 'contentKind', 'coordinates', 'googleMapsUrl'],
        key,
      );
      for (const field of ['address', 'phone', 'openingHours', 'whatsappUrl'])
        value[field] = blankNull(value[field]);
    }
    if (area === 'products' || area === 'branches') {
      if (value.images === null || value.images === undefined) value.images = [];
      if (!Array.isArray(value.images)) cmsFail(key, 'fotoğraflar liste olmalı.');
      value.images = value.images.map((entry: unknown, index: number) => {
        const oldImages = Array.isArray(before?.images) ? before.images : [];
        const previous = oldImages.find(
          (old) =>
            old &&
            typeof old === 'object' &&
            'url' in old &&
            entry &&
            typeof entry === 'object' &&
            'url' in entry &&
            old.url === entry.url,
        );
        const asset = adaptAsset(entry, stem, `images.${index}`, previous);
        if (!asset) cmsFail(key, 'fotoğraf listesinde boş öğe olamaz.');
        return asset;
      });
    }
    if (area === 'gallery') {
      const { usages, ...asset } = value;
      const normalized = adaptAsset(asset, stem, 'gallery', before);
      if (!normalized) cmsFail(key, 'galeri fotoğrafı gerekli.');
      Object.assign(value, normalized, { usages });
    }
    if (area === 'announcements') {
      value.image = adaptAsset(value.image, stem, 'image', before?.image);
      value.startsAt = instant(value.startsAt);
      value.endsAt = instant(value.endsAt);
    }
    if (key === 'settings/site.json') {
      immutable(value, before!, ['phoneVerified', 'emailVerified'], key);
      for (const field of ['phone', 'email']) {
        value[field] = blankNull(value[field]);
        if (!same(value[field], before![field])) value[`${field}Verified`] = false;
      }
    }
    if (key === 'settings/social.json') {
      for (const channel of ['instagram', 'whatsapp']) {
        const entry = recordObject(value[channel], key),
          old = recordObject(before![channel], key);
        immutable(entry, old, ['verified'], key);
        entry.url = blankNull(entry.url);
        if (!same(entry.url, old.url)) entry.verified = false;
        value[channel] = entry;
      }
    }
    canonical.set(key, value);
  }
  const documents = (area: string) =>
    [...canonical]
      .filter(([key]) => key.startsWith(`${area}/`))
      .map(([key, value]) => ({
        filename: key.split('/')[1]!,
        source: JSON.stringify(value),
      }));
  const categories = parseCategoryDocuments(documents('categories'));
  const products = parseProductDocuments(documents('products'), categories);
  const branches = parseBranchDocuments(documents('branches'), approvedBranchIdentities);
  const gallery = parseGalleryDocuments(documents('gallery'));
  const announcements = parseAnnouncementDocuments(documents('announcements'));
  for (const [key, value] of canonical) {
    if (key.startsWith('pages/')) {
      const id = key.slice(6, -5);
      if (!Object.hasOwn(pageSchemas, id)) cmsFail(key, 'bilinmeyen sayfa.');
      pageSchemas[id as PageId](value, key);
    }
    if (key.startsWith('settings/')) {
      if (key === 'settings/site.json') siteSchema(value, key);
      else if (key === 'settings/social.json') socialSchema(value, key);
      else cmsFail(key, 'bilinmeyen ayar.');
    }
  }
  const assets = [
    ...categories.flatMap((v) => (v.image ? [v.image] : [])),
    ...products.flatMap((v) => v.images),
    ...branches.flatMap((v) => v.images),
    ...gallery,
    ...announcements.flatMap((v) => (v.image ? [v.image] : [])),
  ];
  await import('../content/media-files.server').then((m) =>
    m.validateMediaFiles(assets, sourceRoot),
  );
  const fingerprint = createHash('sha256');
  for (const [key, value] of [...raw].sort(([a], [b]) => a.localeCompare(b)))
    fingerprint.update(key).update(JSON.stringify(value));
  for (const [url, file] of media.files) fingerprint.update(url).update(file.digest);
  return { canonical, images: media.sanitized, fingerprint: fingerprint.digest('hex') };
}

export async function writeCmsCandidate(
  sourceRoot: string,
  baselineRoot: string,
  output: string,
) {
  const source = await realpath(sourceRoot),
    baseline = await realpath(baselineRoot);
  const target = path.join(
    await realpath(path.dirname(path.resolve(output))),
    path.basename(output),
  );
  for (const input of [source, baseline])
    if (target === input || !path.relative(input, target).startsWith('..'))
      cmsFail('çıktı', 'candidate kaynaklardan ayrı dizin olmalı.');
  try {
    const stat = await lstat(target);
    if (!stat.isDirectory() || (await readdir(target)).length)
      cmsFail('çıktı', 'boş normal dizin gerekli.');
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT'))
      throw error;
  }
  const result = await prepareCmsData(source, baseline);
  await mkdir(target, { recursive: true });
  for (const area of areas) {
    await mkdir(path.join(target, 'content', area), { recursive: true });
    if (![...result.canonical.keys()].some((key) => key.startsWith(`${area}/`)))
      await writeFile(path.join(target, 'content', area, '.gitkeep'), '');
  }
  for (const [key, value] of result.canonical)
    await writeFile(
      path.join(target, 'content', key),
      JSON.stringify(value, null, 2) + '\n',
    );
  for (const area of ['brand', 'products', 'categories', 'branches', 'gallery']) {
    await mkdir(path.join(target, 'public/images', area), { recursive: true });
    await writeFile(path.join(target, 'public/images', area, '.gitkeep'), '');
  }
  for (const [url, bytes] of result.images)
    await writeFile(await ensureParent(path.join(target, 'public', url)), bytes);
  await writeFile(
    path.join(target, 'candidate-report.json'),
    JSON.stringify(
      {
        fingerprint: result.fingerprint,
        records: result.canonical.size,
        images: result.images.size,
        sourceExifRemoved: false,
        candidateExifRemoved: true,
        gitMergePerformed: false,
      },
      null,
      2,
    ),
  );
  return result;
}
async function ensureParent(file: string) {
  await mkdir(path.dirname(file), { recursive: true });
  return file;
}
