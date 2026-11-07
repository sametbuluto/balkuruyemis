// @vitest-environment node
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml') as { load(source: string): unknown };
interface Field {
  name: string;
  label?: string;
  type: string;
  hidden?: boolean;
  fields?: Field[];
  options?: Record<string, unknown>;
}
interface Entry {
  name: string;
  path: string;
  fields: Field[];
  items?: Entry[];
  filename?: { template: string; field: boolean };
  operations?: { create: boolean; rename: boolean; delete: boolean };
}
const config = yaml.load(readFileSync('.pages.yml', 'utf8')) as {
  content: Entry[];
  settings: { content: { merge: boolean } };
};
const entries = config.content.flatMap((e) => e.items ?? [e]);
describe('Pages CMS alan sözleşmesi', () => {
  it('yedi gerçek sayfa/ayar dosyası ve beş koleksiyon; kod veya env editörü yok', () => {
    expect(entries).toHaveLength(12);
    for (const entry of entries)
      expect(entry.path).toMatch(
        /^content\/(categories|products|branches|gallery|pages|settings|announcements)(\/[^/]+\.json)?$/,
      );
    expect(config.settings.content.merge).toBe(true);
    for (const entry of entries)
      expect(entry.operations).toMatchObject({ rename: false, delete: false });
  });
  it('kategori gerçek kayda referanstır, kullanıcıdan ID/ölçü/dosya adı istemez', () => {
    const products = entries.find((e) => e.name === 'products')!;
    expect(products.fields.find((f) => f.name === 'categoryId')).toMatchObject({
      type: 'reference',
      options: { collection: 'categories', value: '{fields.id}', label: '{fields.name}' },
    });
    for (const name of ['products', 'gallery', 'announcements']) {
      const entry = entries.find((e) => e.name === name)!;
      expect(entry.filename).toMatchObject({ field: false });
      expect(entry.fields.find((f) => f.name === 'editorKey')).toMatchObject({
        type: 'uuid',
        hidden: true,
      });
      expect(entry.operations).toEqual({ create: true, rename: false, delete: false });
    }
  });
  it('Türkçe alanlar düz veri kullanır; korunan kimlik/verified/teknik ayarlar açılmaz', () => {
    const walk = (fields: Field[]) => {
      for (const field of fields) {
        expect(field.label).toBeTruthy();
        expect([
          'id',
          'slug',
          'width',
          'height',
          'variants',
          'verified',
          'phoneVerified',
          'emailVerified',
          'coordinates',
          'contentKind',
          'googleMapsUrl',
          'allowIndexing',
          'domain',
          'css',
        ]).not.toContain(field.name);
        expect(['code', 'rich-text', 'file']).not.toContain(field.type);
        if (field.fields) walk(field.fields);
      }
    };
    for (const e of entries) walk(e.fields);
  });
});
