// @vitest-environment node
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
  mkdirSync,
  symlinkSync,
} from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { prepareCmsData, writeCmsCandidate } from './adapter.server';

const key = '11111111-1111-4111-8111-111111111111';
let root: string, source: string, baseline: string;
const product = (changes: Record<string, unknown> = {}) => ({
  editorKey: key,
  name: 'Yalnız test ürünü',
  description: 'Gerçek işletme verisi değildir.',
  categoryId: 'category-kahve',
  images: [],
  sortOrder: 0,
  status: 'draft',
  ...changes,
});
function read(file: string, from = source): Record<string, unknown> {
  return JSON.parse(readFileSync(path.join(from, 'content', file), 'utf8')) as Record<
    string,
    unknown
  >;
}
function write(file: string, value: unknown, to = source) {
  writeFileSync(path.join(to, 'content', file), JSON.stringify(value));
}
async function photo(
  name = 'test.png',
  format: 'png' | 'jpeg' | 'webp' | 'avif' = 'png',
  exif = false,
) {
  const image = sharp({
    create: { width: 12, height: 6, channels: 3, background: 'white' },
  });
  const bytes = await (exif ? image.withMetadata({ orientation: 6 }) : image)
    .toFormat(format)
    .toBuffer();
  writeFileSync(path.join(source, 'public/images/products', name), bytes);
  return bytes;
}
beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'bal-cms-unit-'));
  baseline = path.join(root, 'base');
  source = path.join(root, 'source');
  mkdirSync(baseline);
  cpSync('content', path.join(baseline, 'content'), { recursive: true });
  cpSync('public', path.join(baseline, 'public'), { recursive: true });
  cpSync(baseline, source, { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('Güvenilir CMS veri adaptörü', () => {
  it('mevcut altı kategori/dört konumu ve bütün metinleri kayıpsız korur', async () => {
    const result = await prepareCmsData(source, baseline);
    expect(result.images.size).toBe(0);
    for (const [name, value] of result.canonical)
      expect(value).toEqual(read(name, baseline));
    expect(
      [...result.canonical.keys()].filter((v) => v.startsWith('categories/')),
    ).toHaveLength(6);
    expect(
      [...result.canonical.keys()].filter((v) => v.startsWith('branches/')),
    ).toHaveLength(4);
  });
  it('yeni ürüne dosya adına bağlı ID ve slug üretir; ikinci kaynak bırakmaz', async () => {
    write(`products/product-${key}.json`, product());
    const value = (await prepareCmsData(source, baseline)).canonical.get(
      `products/product-${key}.json`,
    )!;
    expect(value.id).toBe(`product-${key}`);
    expect(value.slug).toBe(`product-${key}`);
    expect(value).not.toHaveProperty('editorKey');
  });
  it.each(['png', 'jpeg', 'webp', 'avif'] as const)(
    '%s fotoğrafına ID ve gerçek ölçüyü üretir',
    async (format) => {
      const name = `test.${format}`;
      await photo(name, format);
      write(
        `products/product-${key}.json`,
        product({
          images: [
            { url: `/images/products/${name}`, alt: 'İzole geometrik test görüntüsü' },
          ],
        }),
      );
      const result = await prepareCmsData(source, baseline);
      const images = result.canonical.get(`products/product-${key}.json`)!.images as {
        id: string;
        width: number;
        height: number;
      }[];
      expect(images[0]).toMatchObject({ width: 12, height: 6 });
      expect(images[0]!.id).toMatch(/^media-[a-f0-9]{32}$/);
    },
  );
  it('EXIF kaynağını değiştirmez, candidate EXIF temiz ve otomatik yönlendirilmiş olur', async () => {
    const original = await photo('oriented.jpg', 'jpeg', true);
    expect((await sharp(original).metadata()).exif).toBeTruthy();
    write(
      `products/product-${key}.json`,
      product({ images: [{ url: '/images/products/oriented.jpg', alt: 'Yalnız test' }] }),
    );
    const result = await prepareCmsData(source, baseline);
    const output = await sharp(
      result.images.get('/images/products/oriented.jpg')!,
    ).metadata();
    expect(output.width).toBe(6);
    expect(output.height).toBe(12);
    expect(output.exif).toBeUndefined();
    expect(output.icc).toBeUndefined();
    expect(
      readFileSync(path.join(source, 'public/images/products/oriented.jpg')),
    ).toEqual(original);
    expect(
      (
        result.canonical.get(`products/product-${key}.json`)!.images as {
          width: number;
        }[]
      )[0]!.width,
    ).toBe(6);
  });
  it('aynı dosya yolundaki yeni fotoğrafı yeniden ölçer ve eski varyantı taşımaz', async () => {
    const original = await photo();
    const variant = await sharp({
      create: { width: 8, height: 4, channels: 3, background: 'white' },
    })
      .webp()
      .toBuffer();
    for (const dir of [source, baseline]) {
      writeFileSync(path.join(dir, 'public/images/products/test.png'), original);
      writeFileSync(path.join(dir, 'public/images/products/variant.webp'), variant);
      const category = read('categories/category-kahve.json', dir);
      category.image = {
        id: 'old-cover',
        url: '/images/products/test.png',
        alt: 'Yalnız test',
        width: 12,
        height: 6,
        variants: [
          { url: '/images/products/variant.webp', width: 8, format: 'image/webp' },
        ],
      };
      write('categories/category-kahve.json', category, dir);
    }
    writeFileSync(
      path.join(source, 'public/images/products/test.png'),
      await sharp({ create: { width: 24, height: 12, channels: 3, background: 'black' } })
        .png()
        .toBuffer(),
    );
    const value = (await prepareCmsData(source, baseline)).canonical.get(
      'categories/category-kahve.json',
    )!.image;
    expect(value).toMatchObject({ width: 24, height: 12, id: 'old-cover' });
    expect(value).not.toHaveProperty('variants');
  });
  it('CMS sanitize işleminin kaldırdığı null/boş alanları doğru normalize eder', async () => {
    const branch = read('branches/location-1.json');
    for (const [field, value] of Object.entries(branch))
      if (value === null || (Array.isArray(value) && !value.length)) delete branch[field];
    write('branches/location-1.json', branch);
    const category = read('categories/category-kahve.json');
    delete category.image;
    write('categories/category-kahve.json', category);
    const site = read('settings/site.json');
    delete site.phone;
    delete site.email;
    write('settings/site.json', site);
    const result = await prepareCmsData(source, baseline);
    expect(result.canonical.get('branches/location-1.json')).toEqual(
      read('branches/location-1.json', baseline),
    );
    expect(result.canonical.get('categories/category-kahve.json')!.image).toBeNull();
    expect(result.canonical.get('settings/site.json')!.phone).toBeNull();
  });
  it.each([
    { categoryId: 'category-missing' },
    { editorKey: 'not-uuid' },
    { id: 'product-other' },
    { css: 'body{display:none}' },
    { status: 'review' },
    { images: [{ url: '/images/products/../secret.png', alt: 'Test' }] },
    { images: [{ url: '/images/products/missing.png', alt: 'Test' }] },
  ])('hatalı kayıt/ref/kimlik/yol reddi: %j', async (change) => {
    write(`products/product-${key}.json`, product(change));
    await expect(prepareCmsData(source, baseline)).rejects.toThrow();
  });
  it.each([
    ['fake.png', 'bad'],
    ['wrong.jpg', 'png'],
    ['bad.svg', 'svg'],
  ] as const)('bozuk/MIME/SVG upload reddi: %s', async (file, kind) => {
    if (kind === 'png') await photo(file);
    else
      writeFileSync(
        path.join(source, 'public/images/products', file),
        kind === 'svg' ? '<svg/>' : 'broken',
      );
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('Medya doğrulaması');
  });
  it('eksik alt ve mükerrer medya ID reddedilir', async () => {
    await photo();
    write(
      `products/product-${key}.json`,
      product({ images: [{ url: '/images/products/test.png', alt: '' }] }),
    );
    await expect(prepareCmsData(source, baseline)).rejects.toThrow();
    const image = {
      id: 'same-photo',
      url: '/images/products/test.png',
      alt: 'Yalnız test',
    };
    write(`products/product-${key}.json`, product({ images: [image, image] }));
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('mükerrer medya');
  });
  it('mükerrer slug reddedilir', async () => {
    const other = '22222222-2222-4222-8222-222222222222';
    write(`products/product-${key}.json`, product({ slug: 'same' }));
    write(`products/product-${other}.json`, product({ editorKey: other, slug: 'same' }));
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('mükerrer slug');
  });
  it.each(['coordinates', 'contentKind', 'googleMapsUrl', 'id', 'slug'])(
    'korunan şube alanı değiştirilemez: %s',
    async (field) => {
      const branch = read('branches/location-1.json');
      branch[field] = field === 'coordinates' ? { latitude: 1, longitude: 2 } : 'changed';
      write('branches/location-1.json', branch);
      await expect(prepareCmsData(source, baseline)).rejects.toThrow('korunan');
    },
  );
  it('şube metni düzenlenir, location kimliği yükselmez', async () => {
    const branch = read('branches/location-1.json');
    branch.name = 'Yalnız test konumu';
    write('branches/location-1.json', branch);
    const value = (await prepareCmsData(source, baseline)).canonical.get(
      'branches/location-1.json',
    )!;
    expect(value.name).toBe('Yalnız test konumu');
    expect(value.contentKind).toBe('location');
    expect(value.slug).toBeNull();
  });
  it('editorial verified yükseltmesini reddeder ve yeni sosyal URL onaysız kalır', async () => {
    const site = read('settings/site.json');
    site.phoneVerified = true;
    site.phone = '+90 555 000 00 00';
    write('settings/site.json', site);
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('korunan');
    write('settings/site.json', read('settings/site.json', baseline));
    const social = read('settings/social.json');
    social.instagram = {
      ...(social.instagram as object),
      url: 'https://www.instagram.com/test_only',
    };
    write('settings/social.json', social);
    const value = (await prepareCmsData(source, baseline)).canonical.get(
      'settings/social.json',
    )!;
    expect(value.instagram).toMatchObject({ verified: false });
    social.instagram = { ...(social.instagram as object), url: 'javascript:alert(1)' };
    write('settings/social.json', social);
    await expect(prepareCmsData(source, baseline)).rejects.toThrow();
  });
  it('mevcut onaylı iletişim değeri değiştirilince onayı sıfırlar', async () => {
    const site = read('settings/site.json');
    const approved = { ...site, phone: '+90 555 000 00 00', phoneVerified: true };
    write('settings/site.json', approved, baseline);
    write('settings/site.json', { ...approved, phone: '+90 555 111 11 11' });
    const value = (await prepareCmsData(source, baseline)).canonical.get(
      'settings/site.json',
    )!;
    expect(value.phoneVerified).toBe(false);
  });
  it('kullanılmayan eski medya bile silinirse tüm paketi reddeder', async () => {
    const bytes = await photo();
    writeFileSync(path.join(baseline, 'public/images/products/test.png'), bytes);
    rmSync(path.join(source, 'public/images/products/test.png'));
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('medya silme/rename');
  });
  it('silme/bozuk JSON/symlink ve yerinde overwrite reddedilir', async () => {
    await expect(writeCmsCandidate(source, baseline, source)).rejects.toThrow(
      'ayrı dizin',
    );
    const file = path.join(source, 'content/products/product-' + key + '.json');
    writeFileSync(file, '{');
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('bozuk JSON');
    rmSync(file);
    symlinkSync(path.join(baseline, 'content/settings/site.json'), file);
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('normal JSON');
    rmSync(file);
    rmSync(path.join(source, 'content/categories/category-kahve.json'));
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('silme/rename');
  });
  it('native açık offset tarihi UTC yapar, gerçek olmayan günü reddeder', async () => {
    const data = {
      editorKey: key,
      title: 'İzole duyuru',
      description: 'Gerçek duyuru değildir.',
      status: 'draft',
      sortOrder: 0,
      startsAt: '2026-11-07T15:00:00+03:00',
      endsAt: '',
    };
    write(`announcements/announcement-${key}.json`, data);
    expect(
      (await prepareCmsData(source, baseline)).canonical.get(
        `announcements/announcement-${key}.json`,
      )!.startsAt,
    ).toBe('2026-11-07T12:00:00.000Z');
    write(`announcements/announcement-${key}.json`, {
      ...data,
      startsAt: '2026-02-30T15:00:00+03:00',
    });
    await expect(prepareCmsData(source, baseline)).rejects.toThrow('takvim');
  });
});
