import { describe, expect, it } from 'vitest';
import { assessContentChanges, contentChangeLimits } from './content-change-policy';

const change = (path: string, overrides = {}) => ({
  path,
  status: 'M',
  mode: '100644',
  bytes: 512,
  ...overrides,
});

describe('Yerel CMS değişiklik sınırı — henüz aktif yayın hattı değildir', () => {
  it('güvenilmeyen dosya adını hata metninde yeni log satırı olarak açmaz', () => {
    const result = assessContentChanges([change('\n::error::yanıltıcı-log')]);
    expect(result.ok).toBe(false);
    expect(result.errors.every((error) => !error.includes('\n'))).toBe(true);
    expect(result.errors.every((error) => !error.startsWith('::'))).toBe(true);
  });
  it.each([
    'content/products/test-urun.json',
    'content/categories/test-kategori.json',
    'content/branches/location-1.json',
    'content/gallery/test-gorsel.json',
    'content/announcements/test-duyuru.json',
    'content/home.json',
    'content/settings.json',
    'content/social.json',
    'public/images/products/test-urun/cover-1200.avif',
    'public/images/branches/location-1.webp',
  ])('yalnızca planlanan içerik yolunu kabul eder: %s', (path) => {
    expect(assessContentChanges([change(path)])).toEqual({
      ok: true,
      paths: [path],
      errors: [],
    });
  });

  it.each([
    '.github/workflows/publish.yml',
    'package.json',
    'package-lock.json',
    '.pages.yml',
    'scripts/serve-static.mjs',
    'src/app/page.tsx',
    'src/styles/tokens.css',
    '.env.local',
    'content/../package.json',
    '/content/home.json',
    'content//home.json',
    'content/%2e%2e/package.json',
    'content\\home.json',
    'content/.gitkeep',
    'public/images/brand/script.svg',
    'public/images/gallery/file.html',
    'public/images/products/file.jpg.js',
    'public/images/gallery/.hidden.png',
  ])('kod, gizli veya uygunsuz medya yolunu reddeder: %s', (path) => {
    expect(assessContentChanges([change(path)]).ok).toBe(false);
  });

  it.each(['D', 'R100', 'C100', 'T'])(
    'silme/taşıma/tür değişimini reddeder: %s',
    (status) => {
      expect(
        assessContentChanges([change('content/products/test.json', { status })]).ok,
      ).toBe(false);
    },
  );

  it.each(['120000', '160000', '100755'])(
    'symlink, submodule ve executable modunu reddeder: %s',
    (mode) => {
      expect(assessContentChanges([change('content/home.json', { mode })]).ok).toBe(
        false,
      );
    },
  );

  it('ekleme kabul edilir; tek uygunsuz dosya bütün paketi durdurur', () => {
    expect(
      assessContentChanges([change('content/products/test.json', { status: 'A' })]).ok,
    ).toBe(true);
    const result = assessContentChanges([
      change('content/home.json'),
      change('next.config.ts'),
    ]);
    expect(result.ok).toBe(false);
    expect(result.paths).toEqual([]);
  });

  it('boyut sınırını ve bozuk manifesti reddeder', () => {
    for (const bytes of [0, -1, NaN, Infinity, 1.5, contentChangeLimits.jsonBytes + 1]) {
      expect(assessContentChanges([change('content/home.json', { bytes })]).ok).toBe(
        false,
      );
    }
    for (const input of [
      null,
      {},
      [],
      [null],
      [change('content/home.json', { command: 'test' })],
    ]) {
      expect(assessContentChanges(input).ok).toBe(false);
    }
    expect(
      assessContentChanges([
        change('public/images/gallery/test.webp', {
          bytes: contentChangeLimits.imageBytes + 1,
        }),
      ]).ok,
    ).toBe(false);
  });

  it('yinelenen yolları, dosya adedi ve toplam boyut aşımını reddeder', () => {
    const entry = change('content/home.json');
    expect(assessContentChanges([entry, entry]).ok).toBe(false);
    expect(
      assessContentChanges(
        Array.from({ length: contentChangeLimits.maxFiles + 1 }, () => entry),
      ).ok,
    ).toBe(false);
    expect(
      assessContentChanges(
        Array.from({ length: 5 }, (_, index) =>
          change(`public/images/gallery/test-${index}.webp`, {
            bytes: contentChangeLimits.imageBytes,
          }),
        ),
      ).ok,
    ).toBe(false);
  });
});
