import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  editorialFail,
  parseEditorialJson,
  pageSchemas,
  siteSchema,
  socialSchema,
  type PageCopy,
  type PageId,
  type Parser,
} from './editorial-schema';

export function readEditorial<T>(
  relative: string,
  parse: Parser<T>,
  root = process.cwd(),
): T {
  const parts = relative.split('/');
  let file = path.join(root, 'content');
  if (!lstatSync(file).isDirectory())
    editorialFail(relative, 'normal içerik dizini gerekli.');
  for (const [index, part] of parts.entries()) {
    if (!/^[a-z0-9-]+(?:\.json)?$/.test(part))
      editorialFail(relative, 'güvensiz kaynak yolu.');
    file = path.join(file, part);
    const stat = lstatSync(file);
    if (
      stat.isSymbolicLink() ||
      (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())
    )
      editorialFail(relative, 'normal dosya/dizin gerekli; symlink reddedilir.');
    if (index === parts.length - 1 && stat.size > 256 * 1024)
      editorialFail(relative, '256 KiB sınırı.');
  }
  const bytes = readFileSync(file);
  if (bytes.length > 256 * 1024) editorialFail(relative, '256 KiB sınırı.');
  let source: string;
  try {
    source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    editorialFail(relative, 'geçersiz UTF-8.');
  }
  return parseEditorialJson(source, parse, relative);
}
export function getRawPage<K extends PageId>(id: K): PageCopy<K> {
  return readEditorial(`pages/${id}.json`, pageSchemas[id] as Parser<PageCopy<K>>);
}
export const getSiteSettings = () => readEditorial('settings/site.json', siteSchema);
export const getSocialSettings = () =>
  readEditorial('settings/social.json', socialSchema);
export function assertEditorialContent() {
  for (const [area, expected] of [
    [
      'pages',
      ['home.json', 'about.json', 'contact.json', 'catalog.json', 'branches.json'],
    ],
    ['settings', ['site.json', 'social.json']],
  ] as const) {
    for (const entry of readdirSync(path.join(process.cwd(), 'content', area), {
      withFileTypes: true,
    })) {
      if (['.gitkeep', '.DS_Store'].includes(entry.name)) continue;
      if (!entry.isFile() || !(expected as readonly string[]).includes(entry.name))
        editorialFail(area, 'bilinmeyen dosya veya symlink kaynak kabul edilmez.');
    }
  }
  getSiteSettings();
  getSocialSettings();
  for (const id of Object.keys(pageSchemas) as PageId[]) getRawPage(id);
}
