// @vitest-environment node
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadCategories } from './categories.server';
import { selectPublishedCategories } from './category-schema';

let directory: string;
const fixture = {
  id: 'category-test',
  slug: 'test',
  name: 'Yalnızca test',
  description: 'Fixture kaydı.',
  image: null,
  sortOrder: 1,
  status: 'published',
};
beforeEach(() => {
  directory = mkdtempSync(path.join(tmpdir(), 'bal-category-unit-'));
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(directory, { recursive: true, force: true });
});
const write = (value: unknown = fixture) =>
  writeFileSync(path.join(directory, 'category-test.json'), JSON.stringify(value));

describe('Sunucu/build kategori yükleme', () => {
  it('JSON kaynaklarındaki alanları ve değerleri değiştirmeden yükler', () => {
    const root = path.join(process.cwd(), 'content/categories');
    const raw = readdirSync(root)
      .filter((name) => name.endsWith('.json'))
      .map((name) => JSON.parse(readFileSync(path.join(root, name), 'utf8')) as unknown);
    expect(loadCategories(root)).toEqual(
      raw.sort((a, b) => {
        const first = a as typeof fixture;
        const second = b as typeof fixture;
        return first.sortOrder - second.sortOrder;
      }),
    );
  });

  it('yeni dosya ve yayın değişikliğini önbellek/fallback olmadan okur', () => {
    write();
    expect(loadCategories(directory)).toEqual([fixture]);
    write({ ...fixture, status: 'draft' });
    expect(selectPublishedCategories(loadCategories(directory))).toEqual([]);
    const added = { ...fixture, id: 'category-new', slug: 'new' };
    writeFileSync(path.join(directory, 'category-new.json'), JSON.stringify(added));
    expect(selectPublishedCategories(loadCategories(directory))).toEqual([added]);
  });

  it('bozuk JSON, bilinmeyen alan, ID eşleşmezliği ve mükerrer slug için hata verir', () => {
    for (const value of [
      '{',
      JSON.stringify({ ...fixture, extra: true }),
      JSON.stringify({ ...fixture, id: 'category-wrong' }),
    ]) {
      writeFileSync(path.join(directory, 'category-test.json'), value);
      expect(() => loadCategories(directory)).toThrow();
    }
    write();
    writeFileSync(
      path.join(directory, 'category-other.json'),
      JSON.stringify({ ...fixture, id: 'category-other' }),
    );
    expect(() => loadCategories(directory)).toThrow('mükerrer slug');
  });

  it('boş/kayıp dizin, symlink ve JSON dışındaki dosyalar için fallback üretmez', () => {
    expect(() => loadCategories(directory)).toThrow();
    expect(() => loadCategories(path.join(directory, 'missing'))).toThrow();
    const target = path.join(directory, 'source.txt');
    writeFileSync(target, JSON.stringify(fixture));
    symlinkSync(target, path.join(directory, 'category-test.json'));
    expect(() => loadCategories(directory)).toThrow('normal JSON');
  });

  it('aşırı büyük veya bozuk UTF-8 dosyasını reddeder', () => {
    writeFileSync(
      path.join(directory, 'category-test.json'),
      Buffer.alloc(256 * 1024 + 1, 32),
    );
    expect(() => loadCategories(directory)).toThrow('256 KiB');
    writeFileSync(path.join(directory, 'category-test.json'), Buffer.from([0xff]));
    expect(() => loadCategories(directory)).toThrow('UTF-8');
  });

  it('gerçek query API draft kategoriyi URL ve ürün listesinden dışlar', async () => {
    const source = await import('./categories');
    const { getPublishedCategories, getCategoryBySlug, getPublishedProducts } =
      await import('./queries');
    vi.spyOn(source, 'getCategories').mockReturnValue([{ ...fixture, status: 'draft' }]);
    const productSource = await import('./products');
    vi.spyOn(productSource, 'getProducts').mockReturnValue([
      {
        id: 'product-category-test',
        slug: 'category-test',
        name: 'Yalnızca test',
        description: 'Gerçek ürün değildir.',
        categoryId: fixture.id,
        images: [],
        sortOrder: 1,
        status: 'published',
      },
    ]);
    expect(getPublishedCategories()).toEqual([]);
    expect(getCategoryBySlug('test')).toBeUndefined();
    expect(getPublishedProducts(fixture.id)).toEqual([]);
  });
});
