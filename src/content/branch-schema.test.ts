// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  branchIdentityFingerprint,
  type BranchIdentityApproval,
} from './branch-identity';
import {
  parseBranchDocuments,
  parseBranchJson,
  selectPublishedBranches,
  selectVisibleBranches,
} from './branch-schema';
import { assessContentChanges } from '../lib/content-change-policy';

const fixture = {
  id: 'location-test',
  slug: null,
  name: 'Yalnızca test',
  description: 'Gerçek şube değildir.',
  coordinates: { latitude: 38, longitude: 27 },
  googleMapsUrl: 'https://maps.google.com/?q=38,27',
  address: null,
  phone: null,
  openingHours: null,
  whatsappUrl: null,
  images: [],
  sortOrder: 1,
  status: 'published',
  contentKind: 'location',
};
const identity = {
  id: fixture.id,
  name: 'Yalnızca doğrulama fixture',
  address: 'Yalnızca test adresi',
  slug: 'test-sube',
  coordinates: fixture.coordinates,
};
const verified = { ...fixture, ...identity, contentKind: 'verified' };
const approve = (entry: typeof identity): BranchIdentityApproval => ({
  id: entry.id,
  fingerprint: branchIdentityFingerprint(entry),
});
const doc = (value: unknown = fixture, filename = 'location-test.json') => ({
  filename,
  source: JSON.stringify(value),
});
const parse = (overrides: Record<string, unknown> = {}) =>
  parseBranchJson(JSON.stringify({ ...fixture, ...overrides }), 'location-test.json');

describe('Şube JSON strict sözleşmesi', () => {
  it('gerçek konum/kimlik ayrımını ve nullable alanları korur', () => {
    expect(parse()).toEqual(fixture);
    expect(parse({ coordinates: null, googleMapsUrl: null }).coordinates).toBeNull();
    expect(Object.isFrozen(parse())).toBe(true);
    expect(parse().phone).toBeNull();
    expect(parse().openingHours).toBeNull();
  });

  it.each(['{', 'null', '[]', 'true', '{"id":}'])(
    'bozuk JSON/kök tipini reddeder: %s',
    (source) => {
      expect(() => parseBranchJson(source, 'location-test.json')).toThrow(
        'Şube JSON doğrulaması',
      );
    },
  );

  it.each([
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
  ])('eksik alanı reddeder: %s', (key) => {
    const value: Record<string, unknown> = { ...fixture };
    delete value[key];
    expect(() => parseBranchJson(JSON.stringify(value), 'location-test.json')).toThrow(
      'zorunlu alan',
    );
  });

  it.each([
    { extra: true },
    { id: 'other-id' },
    { id: 'Yanlış kimlik' },
    { name: '' },
    { description: false },
    { contentKind: 'example' },
    { contentKind: 'unknown' },
    { slug: 'location-slug' },
    { status: 'review' },
    { sortOrder: -1 },
    { sortOrder: '1' },
    { address: '' },
    { phone: 'javascript:alert(1)' },
    { phone: '()-----' },
    { openingHours: {} },
    { images: null },
    { images: [null] },
    { images: ['/images/branches/a.webp'] },
    { coordinates: { latitude: 91, longitude: 27 } },
    { coordinates: { latitude: 38, longitude: -181 } },
    { coordinates: { latitude: '38', longitude: 27 } },
    { coordinates: { latitude: 38 } },
    { coordinates: { latitude: 38, longitude: 27, altitude: 1 } },
  ])('geçersiz alan/koordinat/tipi reddeder: %j', (value) => {
    expect(() => parse(value)).toThrow('Şube JSON doğrulaması');
  });

  it.each([
    'https://maps.google.com/?q=39,27',
    'https://maps.google.com/?q=38,27&q=38,27',
    'http://maps.google.com/?q=38,27',
    'https://example.com/?q=38,27',
    'https://maps.google.com.evil.test/?q=38,27',
    'https://user@maps.google.com/?q=38,27',
    'https://maps.google.com/not-maps?q=38,27',
    'https://maps.app.goo.gl/test',
    'https://www.google.com/maps/search/?api=1&query=39,27',
    'https://maps.google.com/?q=38,27#test',
    'not-a-url',
  ])('yanlış/doğrulanamayan Maps URL reddi: %s', (googleMapsUrl) => {
    expect(() => parse({ googleMapsUrl })).toThrow();
  });

  it('API search formatını koordinatla doğrular; koordinatsız linki reddeder', () => {
    expect(
      parse({ googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=38%2C27' })
        .coordinates,
    ).toEqual(fixture.coordinates);
    expect(() => parse({ coordinates: null })).toThrow('koordinat gerekli');
  });

  it('telefon, WhatsApp, saat ve görsel sözleşmesini destekler; yükleme yapmaz', () => {
    const image = {
      id: 'test-photo',
      url: '/images/branches/test.webp',
      alt: 'Yalnız test',
      width: 1200,
      height: 800,
    };
    expect(
      parse({
        phone: '+90 555 000 00 00',
        openingHours: 'Yalnız test saat metni',
        whatsappUrl: 'https://wa.me/905550000000',
        images: [image],
      }).images,
    ).toEqual([image]);
    expect(() => parse({ whatsappUrl: 'https://example.com/test' })).toThrow('WhatsApp');
    expect(() => parse({ images: [{ ...image, alt: '' }] })).toThrow();
  });

  it('kimlik alanı tek başına yetki değildir; doğru korunan onayı zorunlu tutar', () => {
    expect(() =>
      parseBranchJson(doc({ ...verified, status: 'draft' }).source, 'location-test.json'),
    ).toThrow('onay');
    expect(() => parseBranchJson(doc(verified).source, 'location-test.json')).toThrow(
      'korunan teknik onay',
    );
    expect(
      parseBranchJson(doc(verified).source, 'location-test.json', [approve(identity)]),
    ).toEqual(verified);
    for (const change of [
      { name: 'Başka ad' },
      { address: 'Başka adres' },
      { slug: 'baska-slug' },
      { coordinates: null, googleMapsUrl: null },
    ])
      expect(() =>
        parseBranchJson(doc({ ...verified, ...change }).source, 'location-test.json', [
          approve(identity),
        ]),
      ).toThrow('onay');
    expect(() =>
      parseBranchJson(doc({ ...verified, address: null }).source, 'location-test.json', [
        approve(identity),
      ]),
    ).toThrow('açık adres');
    expect(() =>
      parseBranchJson(
        doc({ ...verified, slug: 'Yanlış Slug' }).source,
        'location-test.json',
        [approve(identity)],
      ),
    ).toThrow('slug');
  });

  it('kimlik onay kaynağını editör izin listesinin dışında tutar', () => {
    expect(
      assessContentChanges([
        {
          path: 'src/content/branch-identity.ts',
          status: 'M',
          mode: '100644',
          bytes: 10,
        },
      ]).ok,
    ).toBe(false);
    expect(
      assessContentChanges([
        {
          path: 'content/branches/location-test.json',
          status: 'M',
          mode: '100644',
          bytes: 10,
        },
      ]).ok,
    ).toBe(true);
  });

  it('boş koleksiyon/yanlış filename/mükerrer ID, slug ve fiziksel şubeyi reddeder', () => {
    expect(() => parseBranchDocuments([])).toThrow('fiziksel şube');
    expect(() => parseBranchJson(doc().source, '../location-test.json')).toThrow(
      'dosya adı',
    );
    expect(() => parseBranchDocuments([doc(), doc()])).toThrow('mükerrer şube ID');
    const other = { ...fixture, id: 'location-other' };
    expect(() =>
      parseBranchDocuments([doc(), doc(other, 'location-other.json')]),
    ).toThrow('mükerrer fiziksel şube');
    const second = {
      ...verified,
      id: 'location-second',
      coordinates: { latitude: 40, longitude: 29 },
      googleMapsUrl: 'https://maps.google.com/?q=40,29',
    };
    const approvals = [approve(identity), approve(second)];
    expect(() =>
      parseBranchDocuments(
        [doc(verified), doc(second, 'location-second.json')],
        approvals,
      ),
    ).toThrow('mükerrer şube slug');
    const uniqueSlug = { ...second, slug: 'second-test' };
    expect(() =>
      parseBranchDocuments(
        [doc(verified), doc(uniqueSlug, 'location-second.json')],
        [approve(identity), approve(uniqueSlug)],
      ),
    ).toThrow('aynı adreste');
  });

  it('published/draft ile location/verified kararlarını bağımsız uygular', () => {
    const location = parse();
    const approved = parseBranchJson(doc(verified).source, 'location-test.json', [
      approve(identity),
    ]);
    if (approved.contentKind !== 'verified')
      throw new Error('Verified fixture bekleniyor.');
    const draft = { ...approved, status: 'draft' as const };
    expect(selectVisibleBranches([location])).toEqual([location]);
    expect(selectPublishedBranches([location])).toEqual([]);
    expect(selectPublishedBranches([approved, draft])).toEqual([approved]);
    expect(selectVisibleBranches([draft, { ...location, status: 'draft' }])).toEqual([]);
    expect(selectPublishedBranches([{ ...approved, contentKind: 'example' }])).toEqual(
      [],
    );
  });
});
