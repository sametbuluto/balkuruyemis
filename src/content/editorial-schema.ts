import { strictObject } from './content-schema';

export type Parser<T> = (input: unknown, context: string) => T;
export function editorialFail(context: string, reason: string): never {
  throw new Error(`Metin JSON doğrulaması: ${context}: ${reason}`);
}
const tokens = new Set([
  'name',
  'slogan',
  'location',
  'siteDescription',
  'branchCountText',
  'branchCountCapitalized',
  'knownLocationCountText',
]);
export function text(max: number, templates = true): Parser<string> {
  return (input, context) => {
    if (
      typeof input !== 'string' ||
      !input.trim() ||
      input.length > max ||
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(input)
    )
      editorialFail(context, `boş olmayan, en fazla ${max} karakter metin gerekli.`);
    const remainder = input.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (_, key: string) => {
      if (!templates || !tokens.has(key))
        editorialFail(context, 'tanınmayan/izin verilmeyen metin değişkeni.');
      return '';
    });
    if (/[{}]/.test(remainder)) editorialFail(context, 'geçersiz metin değişkeni.');
    return input;
  };
}
export function object<S extends Record<string, Parser<unknown>>>(
  shape: S,
): Parser<{ [K in keyof S]: ReturnType<S[K]> }> {
  return (input, context) => {
    const record = strictObject(input, Object.keys(shape), [], context, editorialFail);
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(shape))
      result[key] = shape[key]!(record[key], `${context}.${key}`);
    return Object.freeze(result) as { [K in keyof S]: ReturnType<S[K]> };
  };
}
export const nullable =
  <T>(parse: Parser<T>): Parser<T | null> =>
  (input, context) =>
    input === null ? null : parse(input, context);
const bool: Parser<boolean> = (input, context) =>
  typeof input === 'boolean' ? input : editorialFail(context, 'boolean gerekli.');
const label = text(64),
  title = text(120),
  paragraph = text(1200);
const seo = object({ title: text(120), description: text(320) });
const intro = object({ eyebrow: label, title, description: paragraph });
const section = object({ eyebrow: label, title, description: paragraph });
export const pageSchemas = {
  home: object({
    seo,
    hero: object({
      eyebrow: label,
      titleLead: text(60),
      titleAccent: text(60),
      descriptionLead: paragraph,
      descriptionBody: paragraph,
      catalogAction: label,
      branchesAction: label,
      countDescription: paragraph,
    }),
    heroVisual: object({
      eyebrow: label,
      photoDescription: paragraph,
      pendingDescription: paragraph,
      countLabel: label,
    }),
    categories: object({ eyebrow: label, title, description: paragraph, action: label }),
    story: object({
      eyebrow: label,
      titleLead: title,
      titleTail: title,
      description: paragraph,
      signature: title,
      action: label,
    }),
    branches: object({
      eyebrow: label,
      title,
      description: paragraph,
      action: label,
      notice: paragraph,
    }),
    gallery: section,
    social: section,
    announcements: object({ eyebrow: label, title }),
  }),
  about: object({
    seo,
    intro,
    story: object({
      eyebrow: label,
      signature: title,
      titleLead: title,
      titleTail: title,
      description: paragraph,
      continuation: paragraph,
      action: label,
    }),
    categories: object({ eyebrow: label, title, action: label }),
  }),
  contact: object({
    seo,
    intro,
    visit: object({
      eyebrow: label,
      title,
      description: paragraph,
      placeTitle: title,
      placeDescription: paragraph,
      action: label,
    }),
    digital: section,
  }),
  catalog: object({
    seo,
    intro,
    content: object({
      heading: title,
      description: paragraph,
      emptyTitle: title,
      emptyDescription: paragraph,
      visitDescription: paragraph,
    }),
  }),
  branches: object({
    seo,
    intro,
    list: object({ eyebrow: label, title, noticeTitle: title, notice: paragraph }),
    gallery: section,
  }),
};
export type PageId = keyof typeof pageSchemas;
export type PageCopy<K extends PageId> = ReturnType<(typeof pageSchemas)[K]>;
export type CatalogCopy = PageCopy<'catalog'>['content'];

const phone: Parser<string> = (input, context) => {
  const value = text(30, false)(input, context);
  if (!/^\+?[0-9 ()-]+$/.test(value) || !/^\d{7,15}$/.test(value.replace(/\D/g, '')))
    editorialFail(context, 'geçersiz telefon.');
  return value;
};
const email: Parser<string> = (input, context) => {
  const value = text(254, false)(input, context);
  if (
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(
      value,
    ) ||
    value.startsWith('.') ||
    value.includes('..')
  )
    editorialFail(context, 'geçersiz e-posta.');
  return value;
};
const siteShape = object({
  name: text(80, false),
  slogan: text(100, false),
  location: text(80, false),
  shareLocation: text(80, false),
  shareDescription: text(120),
  description: text(320),
  phone: nullable(phone),
  phoneVerified: bool,
  email: nullable(email),
  emailVerified: bool,
  footer: object({
    description: paragraph,
    visitTitle: title,
    visitAction: label,
    socialDescription: paragraph,
    signature: title,
  }),
});
export const siteSchema: typeof siteShape = (input, context) => {
  const value = siteShape(input, context);
  if (value.description.includes('{siteDescription}'))
    editorialFail(context, 'kurumsal açıklama kendine referans veremez.');
  if ((value.phoneVerified && !value.phone) || (value.emailVerified && !value.email))
    editorialFail(context, 'doğrulanan iletişim değeri boş olamaz.');
  return value;
};
function socialUrl(channel: 'instagram' | 'whatsapp'): Parser<string> {
  return (input, context) => {
    const value = text(500, false)(input, context);
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      editorialFail(context, 'geçersiz sosyal URL.');
    }
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.port ||
      url.hash ||
      value !== value.trim()
    )
      editorialFail(context, 'güvenli HTTPS sosyal URL gerekli.');
    if (channel === 'instagram') {
      const profile = url.pathname.replace(/^\/|\/$/g, '');
      if (
        !['instagram.com', 'www.instagram.com'].includes(url.hostname) ||
        !/^[A-Za-z0-9_.]{1,30}$/.test(profile) ||
        [
          'accounts',
          'explore',
          'p',
          'reel',
          'reels',
          'direct',
          'stories',
          'about',
          'legal',
        ].includes(profile.toLowerCase()) ||
        url.search
      )
        editorialFail(context, 'Instagram profil URL gerekli.');
    } else {
      if (
        !(
          url.hostname === 'wa.me' &&
          /^\/[1-9]\d{6,14}$/.test(url.pathname) &&
          !url.search
        ) &&
        !(
          url.hostname === 'api.whatsapp.com' &&
          url.pathname === '/send' &&
          url.searchParams.getAll('phone').length === 1 &&
          /^[1-9]\d{6,14}$/.test(url.searchParams.get('phone') ?? '') &&
          [...url.searchParams.keys()].every((key) => ['phone', 'text'].includes(key))
        )
      )
        editorialFail(context, 'WhatsApp telefon URL gerekli.');
    }
    return value;
  };
}
const channelShape = (channel: 'instagram' | 'whatsapp') =>
  object({
    url: nullable(socialUrl(channel)),
    verified: bool,
    description: paragraph,
    actionLabel: label,
  });
const socialShape = object({
  instagram: channelShape('instagram'),
  whatsapp: channelShape('whatsapp'),
});
export const socialSchema: typeof socialShape = (input, context) => {
  const result = socialShape(input, context);
  for (const channel of Object.values(result))
    if (channel.verified && !channel.url)
      editorialFail(context, 'doğrulanmış sosyal bağlantı boş olamaz.');
  return result;
};
export function parseEditorialJson<T>(
  source: string,
  parse: Parser<T>,
  context: string,
): T {
  let value: unknown;
  try {
    value = JSON.parse(source) as unknown;
  } catch {
    editorialFail(context, 'geçerli JSON değil.');
  }
  return parse(value, context);
}
export function formatCopy(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  return template.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (_, key: string) => {
    if (!Object.hasOwn(values, key))
      editorialFail('şablon', 'değişken karşılığı bulunamadı.');
    return values[key]!;
  });
}
export function resolveCopy<T>(value: T, values: Readonly<Record<string, string>>): T {
  if (typeof value === 'string') return formatCopy(value, values) as T;
  if (value && typeof value === 'object' && !Array.isArray(value))
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, resolveCopy(entry, values)]),
    ) as T;
  return value;
}
