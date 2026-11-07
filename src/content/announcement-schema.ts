import type { MediaAsset, PublicationStatus } from '../types/content';
import { parseMediaAsset, safeInteger, strictObject } from './content-schema';
import { editorialFail, text } from './editorial-schema';
export interface Announcement {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: PublicationStatus;
  sortOrder: number;
  image: MediaAsset | null;
  startsAt: string | null;
  endsAt: string | null;
}
function date(value: unknown, context: string): string | null {
  if (value === undefined || value === null) return null;
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
  )
    editorialFail(context, 'ISO UTC tarih gerekli.');
  const normalized = value.includes('.') ? value : value.replace('Z', '.000Z');
  if (!Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== normalized)
    editorialFail(context, 'geçersiz takvim tarihi.');
  return value;
}
export function parseAnnouncementDocuments(
  documents: readonly { filename: string; source: string }[],
): readonly Announcement[] {
  const ids = new Set<string>(),
    slugs = new Set<string>();
  return Object.freeze(
    documents
      .map(({ filename, source }): Announcement => {
        const context = JSON.stringify(filename);
        let input: unknown;
        try {
          input = JSON.parse(source) as unknown;
        } catch {
          editorialFail(context, 'duyuru geçerli JSON değil.');
        }
        const record = strictObject(
          input,
          ['id', 'slug', 'title', 'description', 'status', 'sortOrder'],
          ['image', 'startsAt', 'endsAt'],
          context,
          editorialFail,
        );
        const id = text(100, false)(record.id, context),
          slug = text(100, false)(record.slug, context);
        if (
          !/^announcement-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ||
          `${id}.json` !== filename ||
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
        )
          editorialFail(context, 'duyuru ID/slug/dosya adı geçersiz.');
        if (ids.has(id) || slugs.has(slug))
          editorialFail(context, 'mükerrer duyuru ID/slug.');
        ids.add(id);
        slugs.add(slug);
        const status = record.status;
        if (status !== 'draft' && status !== 'published')
          editorialFail(context, 'geçersiz duyuru yayın durumu.');
        const startsAt = date(record.startsAt, context),
          endsAt = date(record.endsAt, context);
        if (startsAt && endsAt && Date.parse(startsAt) >= Date.parse(endsAt))
          editorialFail(context, 'bitiş başlangıçtan sonra olmalı.');
        return Object.freeze({
          id,
          slug,
          title: text(120, false)(record.title, context),
          description: text(1200, false)(record.description, context),
          status,
          sortOrder: safeInteger(record.sortOrder, 0, context, editorialFail),
          image: parseMediaAsset(record.image ?? null, context, editorialFail),
          startsAt,
          endsAt,
        });
      })
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id, 'en')),
  );
}
export function selectPublishedAnnouncements(
  items: readonly Announcement[],
  at: Date,
): Announcement[] {
  if (!Number.isFinite(at.getTime()))
    editorialFail('duyuru', 'geçerli build anı gerekli.');
  return items
    .filter(
      (item) =>
        item.status === 'published' &&
        (!item.startsAt || Date.parse(item.startsAt) <= at.getTime()) &&
        (!item.endsAt || at.getTime() < Date.parse(item.endsAt)),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      ...item,
      image: item.image?.status === 'draft' ? null : item.image,
    }));
}
