// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  parseAnnouncementDocuments,
  selectPublishedAnnouncements,
} from './announcement-schema';
const fixture = {
  id: 'announcement-test',
  slug: 'test',
  title: 'Yalnız test duyurusu',
  description: 'Gerçek işletme duyurusu değildir.',
  status: 'published',
  sortOrder: 1,
  image: null,
  startsAt: null,
  endsAt: null,
};
const doc = (value: unknown = fixture, filename = 'announcement-test.json') => ({
  filename,
  source: JSON.stringify(value),
});
describe('Statik duyuru sözleşmesi', () => {
  it('boş koleksiyon geçerli, opsiyonel alanlar null normalize edilir', () => {
    expect(parseAnnouncementDocuments([])).toEqual([]);
    expect(
      parseAnnouncementDocuments([
        doc({
          id: fixture.id,
          slug: fixture.slug,
          title: fixture.title,
          description: fixture.description,
          status: fixture.status,
          sortOrder: 1,
        }),
      ]),
    ).toEqual([fixture]);
  });
  it.each([
    { title: '' },
    { title: 'x'.repeat(121) },
    { slug: 'Yanlış slug' },
    { id: 'other' },
    { status: 'review' },
    { sortOrder: -1 },
    { html: '<script/>' },
    { startsAt: '2026-02-30T00:00:00Z' },
    { startsAt: '2026-11-01' },
    { startsAt: '2026-11-02T00:00:00Z', endsAt: '2026-11-01T00:00:00Z' },
  ])('hatalı kayıt reddi: %j', (change) =>
    expect(() => parseAnnouncementDocuments([doc({ ...fixture, ...change })])).toThrow(),
  );
  it('bozuk JSON, mükerrer ID/slug reddedilir', () => {
    expect(() =>
      parseAnnouncementDocuments([{ filename: 'announcement-test.json', source: '{' }]),
    ).toThrow();
    expect(() => parseAnnouncementDocuments([doc(), doc()])).toThrow('mükerrer');
    expect(() =>
      parseAnnouncementDocuments([
        doc(),
        doc({ ...fixture, id: 'announcement-other' }, 'announcement-other.json'),
      ]),
    ).toThrow('mükerrer');
  });
  it('draft/future/expired dışlanır, başlangıç dahil bitiş hariçtir; sıralama korunur', () => {
    const at = new Date('2026-11-01T12:00:00.000Z');
    const entries = parseAnnouncementDocuments([
      doc(),
      doc(
        { ...fixture, id: 'announcement-draft', slug: 'draft', status: 'draft' },
        'announcement-draft.json',
      ),
      doc(
        {
          ...fixture,
          id: 'announcement-future',
          slug: 'future',
          startsAt: '2026-11-01T12:00:01Z',
        },
        'announcement-future.json',
      ),
      doc(
        {
          ...fixture,
          id: 'announcement-expired',
          slug: 'expired',
          endsAt: '2026-11-01T12:00:00Z',
        },
        'announcement-expired.json',
      ),
      doc(
        {
          ...fixture,
          id: 'announcement-first',
          slug: 'first',
          sortOrder: 0,
          startsAt: '2026-11-01T12:00:00Z',
        },
        'announcement-first.json',
      ),
    ]);
    expect(selectPublishedAnnouncements(entries, at).map((i) => i.slug)).toEqual([
      'first',
      'test',
    ]);
    expect(entries).toHaveLength(5);
  });
});
