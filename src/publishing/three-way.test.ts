// @vitest-environment node
import { expect, it } from 'vitest';
import { mergeCanonicalData } from './three-way';
const map = (v: unknown) =>
  new Map([['content/pages/home.json', Buffer.from(JSON.stringify(v))]]);
const read = (v: Map<string, Buffer>) =>
  JSON.parse(v.get('content/pages/home.json')!.toString()) as unknown;
it('aynı dosyada bağımsız alanları birleştirir; main metnini eski snapshot ile ezmez', () => {
  const base = { hero: { title: 'Eski', description: 'Eski açıklama' } };
  expect(
    read(
      mergeCanonicalData(
        map(base),
        map({ hero: { title: 'Eski', description: 'Main' } }),
        map({ hero: { title: 'CMS', description: 'Eski açıklama' } }),
      ),
    ),
  ).toEqual({ hero: { title: 'CMS', description: 'Main' } });
});
it('JSON key sırası/formatı sahte çatışma oluşturmaz', () => {
  expect(
    read(
      mergeCanonicalData(map({ a: 1, b: 2 }), map({ b: 2, a: 1 }), map({ a: 3, b: 2 })),
    ),
  ).toEqual({ a: 3, b: 2 });
});
it.each([
  [{ a: 1 }, { a: 2 }, { a: 3 }],
  [{ a: [1, 2] }, { a: [1, 3] }, { a: [2, 2] }],
  [{ a: 1 }, {}, { a: 2 }],
])('aynı alan/liste veya silme çatışmasında durur: %j', (b, m, s) =>
  expect(() => mergeCanonicalData(map(b), map(m), map(s))).toThrow('çatışma'),
);
it('binary değişimler atomiktir; aynı dosyanın iki farklı fotoğrafı otomatik seçilmez', () => {
  const make = (s: string) =>
    new Map([['public/images/products/test.png', Buffer.from(s)]]);
  expect(() => mergeCanonicalData(make('old'), make('main'), make('source'))).toThrow(
    'çatışma',
  );
  expect(
    mergeCanonicalData(make('old'), make('main'), make('old'))
      .get('public/images/products/test.png')!
      .toString(),
  ).toBe('main');
});
it('iki tarafta farklı yeni dosyalar ve aynı değişiklik güvenli birleşir', () => {
  const b = map({ a: 1 }),
    m = map({ a: 2 }),
    s = map({ a: 2 });
  m.set('content/products/product-a.json', Buffer.from('{}'));
  s.set('content/products/product-b.json', Buffer.from('{}'));
  expect(mergeCanonicalData(b, m, s).size).toBe(3);
});
it('JSON __proto__ anahtarı prototype kirliliği oluşturmaz', () => {
  const a = JSON.parse('{"__proto__":{"test":1},"x":0}') as unknown;
  const result = read(
    mergeCanonicalData(map(a), map(a), map(JSON.parse('{"__proto__":{"test":1},"x":1}'))),
  );
  expect(Object.hasOwn(result as object, '__proto__')).toBe(true);
  expect(Object.hasOwn(Object.prototype, 'test')).toBe(false);
});

it('fotoğraf ve ona ait alt/ölçüler atomiktir; eski alt başka fotoğrafa taşınmaz', () => {
  const image = {
    id: 'test',
    url: '/images/products/old.png',
    alt: 'Eski fotoğraf',
    width: 10,
    height: 5,
  };
  expect(() =>
    mergeCanonicalData(
      map({ image }),
      map({ image: { ...image, alt: 'Main alt' } }),
      map({ image: { ...image, url: '/images/products/new.png' } }),
    ),
  ).toThrow('çatışma');
});
