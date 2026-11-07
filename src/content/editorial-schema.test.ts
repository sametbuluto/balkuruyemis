// @vitest-environment node
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import {
  pageSchemas,
  parseEditorialJson,
  siteSchema,
  socialSchema,
  resolveCopy,
} from './editorial-schema';
import { readEditorial, getRawPage } from './editorial.server';
import { assessContentChanges } from '../lib/content-change-policy';
const site = JSON.parse(readFileSync('content/settings/site.json', 'utf8')) as Record<
  string,
  unknown
>;
const social = JSON.parse(readFileSync('content/settings/social.json', 'utf8')) as {
  instagram: {
    url: string | null;
    verified: boolean;
    description: string;
    actionLabel: string;
  };
  whatsapp: {
    url: string | null;
    verified: boolean;
    description: string;
    actionLabel: string;
  };
};

describe('Kurumsal metin strict JSON sözleşmesi', () => {
  it('beş mevcut sayfa ile marka/sloganı değiştirmeden okur', () => {
    for (const id of ['home', 'about', 'contact', 'catalog', 'branches'] as const)
      expect(getRawPage(id)).toEqual(
        JSON.parse(readFileSync(`content/pages/${id}.json`, 'utf8')),
      );
    expect(siteSchema(site, 'site').slogan).toBe('Lezzetin Doğal Adresi');
    expect(siteSchema(site, 'site').phone).toBeNull();
    expect(siteSchema(site, 'site').email).toBeNull();
  });
  it.each(['{', 'null', '[]', 'false'])('bozuk JSON/kök tipi reddi: %s', (source) =>
    expect(() => parseEditorialJson(source, siteSchema, 'site')).toThrow('Metin JSON'),
  );
  it.each(['canonical', 'allowIndexing', 'domain', 'css', 'html', 'status', '__proto__'])(
    'teknik/şema dışı ayarı reddeder: %s',
    (key) =>
      expect(() => siteSchema({ ...site, [key]: true }, 'site')).toThrow(
        'bilinmeyen alan',
      ),
  );
  it.each([
    'name',
    'slogan',
    'location',
    'shareLocation',
    'description',
    'phone',
    'phoneVerified',
    'email',
    'emailVerified',
    'footer',
  ])('eksik ayarı reddeder: %s', (key) => {
    const value = { ...site };
    delete value[key];
    expect(() => siteSchema(value, 'site')).toThrow('zorunlu alan');
  });
  it.each([
    { name: '' },
    { name: 'x'.repeat(81) },
    { phone: 'javascript:alert(1)' },
    { phoneVerified: true },
    { email: 'a\r\nBcc:test@example.invalid' },
    { email: 'missing-at' },
    { emailVerified: true },
    { description: '{siteDescription}' },
    { description: '{unknown}' },
    { slogan: '{name}' },
    { description: '{broken' },
  ])('boş/uzun/yanlış metin/iletişim/şablonu reddeder: %j', (change) =>
    expect(() => siteSchema({ ...site, ...change }, 'site')).toThrow(),
  );
  it.each([
    'javascript:alert(1)',
    'http://instagram.com/test',
    'https://instagram.com.evil.test/test',
    'https://user@instagram.com/test',
    'https://instagram.com/accounts/login/',
    'https://instagram.com/test?next=evil',
    'not a url',
  ])('geçersiz sosyal URL: %s', (url) =>
    expect(() =>
      socialSchema({ ...social, instagram: { ...social.instagram, url } }, 'social'),
    ).toThrow(),
  );
  it('doğru host URL de doğrulanmadan aktif kabul edilmez; boolean ve nulllar stricttir', () => {
    const valid = socialSchema(
      {
        ...social,
        instagram: {
          ...social.instagram,
          url: 'https://www.instagram.com/test_only_profile',
          verified: false,
        },
        whatsapp: {
          ...social.whatsapp,
          url: 'https://wa.me/905550000000',
          verified: true,
        },
      },
      'social',
    );
    expect(valid.instagram.verified).toBe(false);
    expect(valid.whatsapp.verified).toBe(true);
    expect(() =>
      socialSchema(
        { ...social, instagram: { ...social.instagram, verified: true } },
        'social',
      ),
    ).toThrow();
    expect(() =>
      socialSchema(
        {
          ...social,
          whatsapp: { ...social.whatsapp, url: 'https://evil.test/905550000000' },
        },
        'social',
      ),
    ).toThrow();
  });
  it('nested şema dışı alanı, boş ve çok uzun başlığı reddeder', () => {
    const home = getRawPage('home');
    for (const change of [
      { titleLead: '' },
      { titleLead: 'x'.repeat(61) },
      { className: 'bg-red' },
    ])
      expect(() =>
        pageSchemas.home({ ...home, hero: { ...home.hero, ...change } }, 'home'),
      ).toThrow();
    expect(
      resolveCopy(
        { title: '{name} ile {branchCountText}' },
        { name: 'Bal', branchCountText: 'dört' },
      ),
    ).toEqual({ title: 'Bal ile dört' });
  });
  it('değişken çözümünden sonra da başlık uzunluğunu sınırlar', () => {
    const home = getRawPage('home');
    const raw = pageSchemas.home(
      { ...home, hero: { ...home.hero, titleLead: '{name}' } },
      'home',
    );
    expect(() =>
      pageSchemas.home(
        resolveCopy(raw, {
          name: 'x'.repeat(61),
          slogan: 'Slogan',
          location: 'Konum',
          siteDescription: 'Açıklama',
          branchCountText: 'dört',
          branchCountCapitalized: 'Dört',
          knownLocationCountText: 'dört',
        }),
        'home(çözülmüş)',
      ),
    ).toThrow('60 karakter');
  });
  it('loader bozuk/oversize/UTF-8/symlink için fallback kullanmaz', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'bal-copy-'));
    mkdirSync(path.join(root, 'content/settings'), { recursive: true });
    const file = path.join(root, 'content/settings/site.json');
    try {
      writeFileSync(file, '{');
      expect(() => readEditorial('settings/site.json', siteSchema, root)).toThrow('JSON');
      writeFileSync(file, Buffer.from([0xff]));
      expect(() => readEditorial('settings/site.json', siteSchema, root)).toThrow(
        'UTF-8',
      );
      writeFileSync(file, ' '.repeat(256 * 1024 + 1));
      expect(() => readEditorial('settings/site.json', siteSchema, root)).toThrow(
        '256 KiB',
      );
      rmSync(file);
      symlinkSync(path.join(process.cwd(), 'content/settings/site.json'), file);
      expect(() => readEditorial('settings/site.json', siteSchema, root)).toThrow(
        'symlink',
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  it('yeni içerik yollarını kabul eder, keyfi sayfa/config yolunu açmaz', () => {
    for (const name of [
      'pages/home',
      'pages/about',
      'pages/contact',
      'pages/catalog',
      'pages/branches',
      'settings/site',
      'settings/social',
    ])
      expect(
        assessContentChanges([
          { path: `content/${name}.json`, status: 'M', mode: '100644', bytes: 100 },
        ]).ok,
      ).toBe(true);
    for (const path of [
      'content/pages/admin.json',
      'content/settings/seo.json',
      'content/pages/../home.json',
    ])
      expect(
        assessContentChanges([{ path, status: 'M', mode: '100644', bytes: 100 }]).ok,
      ).toBe(false);
  });
});
