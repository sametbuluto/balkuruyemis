// @vitest-environment node
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCategories } from './categories';
import { loadProducts } from './products.server';

const categories = getCategories();
const fixture = {
  id: 'product-test',
  slug: 'test',
  name: 'Yalnızca test',
  categoryId: categories[0]!.id,
  description: 'Gerçek ürün değildir.',
  images: [],
  sortOrder: 1,
  status: 'published',
};
let directory: string;
beforeEach(() => {
  directory = mkdtempSync(path.join(tmpdir(), 'bal-product-unit-'));
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(directory, { recursive: true, force: true });
});
const write = (value: unknown = fixture) =>
  writeFileSync(path.join(directory, 'product-test.json'), JSON.stringify(value));

describe('Sunucu/build ürün yükleme', () => {
  it('boş koleksiyonu ve yalnız gitkeep içeren dizini geçerli sayar', () => {
    expect(loadProducts(directory)).toEqual([]);
    writeFileSync(path.join(directory, '.gitkeep'), '');
    expect(loadProducts(directory)).toEqual([]);
  });

  it('kaydetme/değiştirme/yayından kaldırmayı yeni okumalarda doğrular', async () => {
    const source = await import('./products');
    const { getPublishedProducts } = await import('./queries');
    vi.spyOn(source, 'getProducts').mockImplementation(() =>
      loadProducts(directory, categories),
    );
    write();
    expect(getPublishedProducts(fixture.categoryId)).toEqual([fixture]);
    write({ ...fixture, name: 'Yalnız test güncellemesi' });
    expect(getPublishedProducts()[0]?.name).toBe('Yalnız test güncellemesi');
    write({ ...fixture, status: 'draft' });
    expect(getPublishedProducts()).toEqual([]);
    expect(loadProducts(directory)[0]?.status).toBe('draft');
  });

  it('gerçek kategori ID referansını okur; silinen/yanlış kategoride hata verir', () => {
    write();
    expect(loadProducts(directory)[0]?.categoryId).toBe(categories[0]!.id);
    expect(() =>
      loadProducts(
        directory,
        categories.filter((item) => item.id !== fixture.categoryId),
      ),
    ).toThrow('referans');
    write({ ...fixture, categoryId: 'category-missing' });
    expect(() => loadProducts(directory)).toThrow('referans');
  });

  it('bozuk JSON, şema dışı alan ve duplicate slug için fallback kullanmaz', () => {
    for (const source of ['{', JSON.stringify({ ...fixture, price: 1 })]) {
      writeFileSync(path.join(directory, 'product-test.json'), source);
      expect(() => loadProducts(directory)).toThrow();
    }
    write();
    writeFileSync(
      path.join(directory, 'product-other.json'),
      JSON.stringify({ ...fixture, id: 'product-other' }),
    );
    expect(() => loadProducts(directory)).toThrow('mükerrer slug');
  });

  it('kayıp dizin, symlink veya JSON dışı dosyayı reddeder', () => {
    expect(() => loadProducts(path.join(directory, 'missing'))).toThrow();
    const target = path.join(directory, 'source.txt');
    writeFileSync(target, JSON.stringify(fixture));
    symlinkSync(target, path.join(directory, 'product-test.json'));
    expect(() => loadProducts(directory)).toThrow('normal JSON');
  });

  it('256 KiB üstü ve geçersiz UTF-8 dosyasını reddeder', () => {
    writeFileSync(
      path.join(directory, 'product-test.json'),
      Buffer.alloc(256 * 1024 + 1, 32),
    );
    expect(() => loadProducts(directory)).toThrow('256 KiB');
    writeFileSync(path.join(directory, 'product-test.json'), Buffer.from([0xff]));
    expect(() => loadProducts(directory)).toThrow('UTF-8');
  });
});
