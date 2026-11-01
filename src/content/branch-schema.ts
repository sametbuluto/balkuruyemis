import type {
  Branch,
  BranchCardEntry,
  BranchLocation,
  Coordinates,
} from '../types/content';
import {
  branchIdentityFingerprint,
  type BranchIdentityApproval,
} from './branch-identity';
import {
  parseMediaAsset,
  requiredText,
  safeInteger,
  strictObject,
} from './content-schema';

export interface BranchDocument {
  filename: string;
  source: string;
}

function fail(context: string, reason: string): never {
  throw new Error(`Şube JSON doğrulaması: ${context}: ${reason}`);
}

function nullableText(value: unknown, context: string): string | null {
  return value === null ? null : requiredText(value, context, fail);
}

function coordinates(value: unknown, context: string): Coordinates | null {
  if (value === null) return null;
  const point = strictObject(value, ['latitude', 'longitude'], [], context, fail);
  const { latitude, longitude } = point;
  if (
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  )
    fail(context, 'koordinat aralığı veya tipi geçersiz.');
  return Object.freeze({ latitude, longitude });
}

function httpsUrl(value: string, context: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    fail(context, 'geçersiz URL.');
  }
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.port ||
    url.hash ||
    value !== value.trim()
  )
    fail(context, 'kimlik bilgisi/port/hash içermeyen HTTPS bağlantısı gerekli.');
  return url;
}

function validateMaps(value: string | null, point: Coordinates | null, context: string) {
  if (value === null) return;
  if (!point) fail(context, 'harita bağlantısı için koordinat gerekli.');
  const url = httpsUrl(value, context);
  let coordinateQuery: string | null = null;
  if (
    url.hostname === 'maps.google.com' &&
    url.pathname === '/' &&
    url.searchParams.getAll('q').length === 1
  )
    coordinateQuery = url.searchParams.get('q');
  else if (
    url.hostname === 'www.google.com' &&
    url.pathname === '/maps/search/' &&
    url.searchParams.getAll('api').length === 1 &&
    url.searchParams.get('api') === '1' &&
    url.searchParams.getAll('query').length === 1
  )
    coordinateQuery = url.searchParams.get('query');
  if (!coordinateQuery || !/^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/.test(coordinateQuery))
    fail(context, 'koordinatı doğrulanabilir Google Maps q veya API search URL gerekli.');
  const [latitude, longitude] = coordinateQuery.split(',').map(Number);
  if (latitude !== point.latitude || longitude !== point.longitude)
    fail(context, 'Google Maps koordinatı kayıtla eşleşmiyor.');
}

export function parseBranchJson(
  source: string,
  filename: string,
  approvals: readonly BranchIdentityApproval[] = [],
): Branch | BranchLocation {
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
    [
      'id',
      'slug',
      'name',
      'description',
      'coordinates',
      'googleMapsUrl',
      'address',
      'phone',
      'openingHours',
      'whatsappUrl',
      'images',
      'sortOrder',
      'status',
      'contentKind',
    ],
    [],
    context,
    fail,
  );
  const id = requiredText(record.id, `${context}.id`, fail);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || `${id}.json` !== filename)
    fail(context, 'şube ID ve dosya adı eşleşmeli.');
  const contentKind = record.contentKind;
  if (contentKind !== 'location' && contentKind !== 'verified')
    fail(
      context,
      'gerçek kaynak yalnız location/verified olabilir; örnek kayıt kabul edilmez.',
    );
  const status = record.status;
  if (status !== 'draft' && status !== 'published')
    fail(context, 'geçersiz yayın durumu.');
  const point = coordinates(record.coordinates, `${context}.coordinates`);
  const googleMapsUrl = nullableText(record.googleMapsUrl, `${context}.googleMapsUrl`);
  validateMaps(googleMapsUrl, point, `${context}.googleMapsUrl`);
  const phone = nullableText(record.phone, `${context}.phone`);
  if (
    phone !== null &&
    (!/^\+?[0-9 ()-]{7,25}$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, '')))
  )
    fail(context, 'geçersiz telefon.');
  const whatsappUrl = nullableText(record.whatsappUrl, `${context}.whatsappUrl`);
  if (whatsappUrl !== null) {
    const url = httpsUrl(whatsappUrl, `${context}.whatsappUrl`);
    if (
      !(url.hostname === 'wa.me' && /^\/[1-9]\d{6,14}$/.test(url.pathname)) &&
      !(
        url.hostname === 'api.whatsapp.com' &&
        url.pathname === '/send' &&
        /^[1-9]\d{6,14}$/.test(url.searchParams.get('phone') ?? '')
      )
    )
      fail(context, 'geçerli WhatsApp telefon bağlantısı gerekli.');
  }
  if (!Array.isArray(record.images)) fail(context, 'images dizi olmalı.');
  const images = record.images.map((value: unknown, index: number) => {
    const image = parseMediaAsset(value, `${context}.images[${index}]`, fail);
    if (!image) fail(context, 'images içinde null yerine görsel nesnesi gerekli.');
    return image;
  });
  const common: Omit<BranchLocation, 'slug' | 'contentKind'> = {
    id,
    name: requiredText(record.name, `${context}.name`, fail),
    description: requiredText(record.description, `${context}.description`, fail),
    coordinates: point,
    googleMapsUrl,
    address: nullableText(record.address, `${context}.address`),
    phone,
    openingHours: nullableText(record.openingHours, `${context}.openingHours`),
    whatsappUrl,
    images: Object.freeze(images),
    sortOrder: safeInteger(record.sortOrder, 0, `${context}.sortOrder`, fail),
    status,
  };
  if (contentKind === 'location') {
    if (record.slug !== null)
      fail(context, 'location kaydının detay slug değeri null olmalı.');
    return Object.freeze({ ...common, slug: null, contentKind });
  }
  const slug = requiredText(record.slug, `${context}.slug`, fail);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || common.address === null)
    fail(context, 'verified şube için gerçek slug ve açık adres gerekli.');
  const approved = approvals.find((entry) => entry.id === id);
  if (
    !approved ||
    approved.fingerprint !==
      branchIdentityFingerprint({
        id,
        slug,
        name: common.name,
        address: common.address,
        coordinates: point,
      })
  )
    fail(context, 'verified şube kimliği korunan teknik onayla eşleşmiyor.');
  return Object.freeze({ ...common, slug, contentKind });
}

export function parseBranchDocuments(
  documents: readonly BranchDocument[],
  approvals: readonly BranchIdentityApproval[] = [],
): readonly BranchCardEntry[] {
  if (!documents.length) fail('koleksiyon', 'en az bir fiziksel şube kaydı gerekli.');
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const points = new Set<string>();
  const addresses = new Set<string>();
  const branches = documents.map(({ filename, source }) => {
    const branch = parseBranchJson(source, filename, approvals);
    if (ids.has(branch.id)) fail(filename, 'mükerrer şube ID.');
    ids.add(branch.id);
    if (branch.slug !== null) {
      if (slugs.has(branch.slug)) fail(filename, 'mükerrer şube slug.');
      slugs.add(branch.slug);
    }
    if (branch.coordinates) {
      const point = `${branch.coordinates.latitude},${branch.coordinates.longitude}`;
      if (points.has(point)) fail(filename, 'aynı koordinatta mükerrer fiziksel şube.');
      points.add(point);
    }
    if (branch.address) {
      const address = branch.address
        .trim()
        .normalize('NFC')
        .toLocaleLowerCase('tr')
        .replace(/\s+/g, ' ');
      if (addresses.has(address)) fail(filename, 'aynı adreste mükerrer fiziksel şube.');
      addresses.add(address);
    }
    return branch;
  });
  return Object.freeze(
    branches.sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id, 'en')),
  );
}

export function selectVisibleBranches(
  branches: readonly BranchCardEntry[],
): BranchCardEntry[] {
  return branches
    .filter((branch) => branch.status === 'published' && branch.contentKind !== 'example')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function selectPublishedBranches(branches: readonly BranchCardEntry[]): Branch[] {
  return branches
    .filter(
      (branch): branch is Branch =>
        branch.contentKind === 'verified' && branch.status === 'published',
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
