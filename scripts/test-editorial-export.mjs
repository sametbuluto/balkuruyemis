import assert from 'node:assert/strict';
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { createStaticServer } from './serve-static.mjs';
const root = process.cwd();
const directory = await mkdtemp(path.join(tmpdir(), 'bal-editorial-export-'));
for (const name of [
  'src',
  'content',
  'tests',
  'scripts',
  'public',
  'tsconfig.media.json',
  'next.config.ts',
  'next-env.d.ts',
  'tsconfig.json',
  'package.json',
  'package-lock.json',
  'postcss.config.mjs',
])
  await cp(path.join(root, name), path.join(directory, name), { recursive: true });
await symlink(
  path.join(root, 'node_modules'),
  path.join(directory, 'node_modules'),
  'dir',
);
const homeFile = path.join(directory, 'content/pages/home.json'),
  socialFile = path.join(directory, 'content/settings/social.json'),
  siteFile = path.join(directory, 'content/settings/site.json');
const home = JSON.parse(await readFile(homeFile, 'utf8')),
  social = JSON.parse(await readFile(socialFile, 'utf8')),
  site = JSON.parse(await readFile(siteFile, 'utf8'));
async function build(name) {
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...process.env,
      SITE_BUILD_AT: '2026-11-01T12:00:00.000Z',
      NEXT_PUBLIC_SITE_URL: '',
      NEXT_PUBLIC_ALLOW_INDEXING: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });
  const log = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  await writeFile(path.join(directory, `${name}.log`), log);
  return { status: result.status, log };
}
for (const [name, file, source, original] of [
  ['malformed-home', homeFile, '{', home],
  [
    'invalid-social',
    socialFile,
    JSON.stringify({
      ...social,
      whatsapp: { ...social.whatsapp, url: 'https://evil.test/redirect' },
    }),
    social,
  ],
  ['technical-setting', siteFile, JSON.stringify({ ...site, allowIndexing: true }), site],
]) {
  await writeFile(file, source);
  const result = await build(name);
  assert.equal(result.status, 1, `${directory}\n${result.log}`);
  assert.match(result.log, /Metin JSON doğrulaması/);
  await writeFile(file, JSON.stringify(original));
}
const payload = '<img src=x onerror=window.COPY_XSS=1>';
await writeFile(
  homeFile,
  JSON.stringify({
    ...home,
    hero: { ...home.hero, titleLead: 'JSON başlık testi', titleAccent: payload },
  }),
);
const aboutFile = path.join(directory, 'content/pages/about.json');
const about = JSON.parse(await readFile(aboutFile, 'utf8'));
const aboutText = 'Hakkımızda JSON kaynağından test metni.';
await writeFile(
  aboutFile,
  JSON.stringify({ ...about, story: { ...about.story, description: aboutText } }),
);
await writeFile(
  socialFile,
  JSON.stringify({
    ...social,
    instagram: {
      ...social.instagram,
      url: 'https://www.instagram.com/unverified_c4_test',
      verified: false,
    },
  }),
);
await writeFile(
  siteFile,
  JSON.stringify({
    ...site,
    phone: '+90 555 000 00 00',
    email: 'fixture@example.invalid',
    phoneVerified: false,
    emailVerified: false,
  }),
);
const fixture = {
  id: 'announcement-active',
  slug: 'active',
  title: 'C4_ACTIVE_ANNOUNCEMENT',
  description: 'İzole duyuru testi; gerçek içerik değildir.',
  status: 'published',
  sortOrder: 1,
  image: null,
  startsAt: '2026-11-01T12:00:00Z',
  endsAt: '2026-11-01T12:30:00Z',
};
const records = [
  fixture,
  {
    ...fixture,
    id: 'announcement-draft',
    slug: 'draft',
    title: 'C4_DRAFT_SENTINEL',
    status: 'draft',
  },
  {
    ...fixture,
    id: 'announcement-future',
    slug: 'future',
    title: 'C4_FUTURE_SENTINEL',
    startsAt: '2026-11-02T00:00:00Z',
    endsAt: null,
  },
  {
    ...fixture,
    id: 'announcement-expired',
    slug: 'expired',
    title: 'C4_EXPIRED_SENTINEL',
    startsAt: null,
    endsAt: '2026-11-01T11:00:00Z',
  },
];
const image = {
  id: 'announcement-private-photo',
  url: '/images/gallery/announcement-test.png',
  alt: 'C4_PRIVATE_MEDIA_SENTINEL',
  width: 16,
  height: 8,
};
records[1].image = image;
await writeFile(
  path.join(directory, 'public', image.url),
  await sharp({ create: { width: 16, height: 8, channels: 3, background: 'white' } })
    .png()
    .toBuffer(),
);
for (const item of records)
  await writeFile(
    path.join(directory, `content/announcements/${item.id}.json`),
    JSON.stringify(item),
  );
const result = await build('valid-editorial');
assert.equal(result.status, 0, `${directory}\n${result.log}`);
const output = path.join(directory, 'out');
const html = await readFile(path.join(output, 'index.html'), 'utf8');
assert(html.includes('JSON başlık testi'));
assert(html.includes('&lt;img'));
assert(html.includes(fixture.title));
assert(
  (await readFile(path.join(output, 'hakkimizda.html'), 'utf8')).includes(aboutText),
);
for (const entry of await readdir(output, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.(html|txt|js|xml|json)$/.test(entry.name)) continue;
  const text = await readFile(path.join(entry.parentPath, entry.name), 'utf8');
  for (const marker of [
    records[1].title,
    records[2].title,
    records[3].title,
    image.alt,
    'unverified_c4_test',
    'fixture@example.invalid',
  ])
    assert(!text.includes(marker), `Gizli içerik sızdı: ${entry.name}`);
}
const server = createStaticServer(await realpath(output));
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  assert.equal((await fetch(origin + image.url)).status, 404);
  assert.equal((await fetch(origin + '/content/pages/home.json')).status, 404);
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    headless: true,
  });
  const page = await browser.newPage();
  for (const width of [320, 393, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin);
    assert(
      (await page.getByRole('heading', { level: 1 }).innerText()).includes(
        'JSON başlık testi',
      ),
    );
    assert.equal(
      await page
        .getByRole('heading', { level: 1 })
        .locator('span')
        .evaluate((el) => getComputedStyle(el).color),
      'rgb(206, 20, 43)',
    );
    assert.equal(await page.locator('img[src="x"]').count(), 0);
    assert.equal(await page.evaluate(() => window.COPY_XSS ?? null), null);
    assert.equal(await page.locator('a[href^="tel:"],a[href^="mailto:"]').count(), 0);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    assert(
      (await page.locator('meta[name="robots"]').getAttribute('content')).includes(
        'noindex',
      ),
    );
    await page.screenshot({
      path: path.join(directory, `editorial-${width}.png`),
      fullPage: true,
    });
  }
  // İstemci saati ilerlese de statik HTML kendiliğinden yeniden yayımlanmaz.
  await page.addInitScript(() => {
    Date.now = () => Date.parse('2030-01-01T00:00:00Z');
  });
  await page.reload();
  await page.getByRole('heading', { name: fixture.title, exact: true }).waitFor();
  await page.goto(origin + '/hakkimizda');
  assert((await page.locator('main').innerText()).includes(aboutText));
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
}
process.stdout.write(
  `Metin export 4/4 geçti: üç negatif build; JSON değişimi/XSS/duyuru/tarih/iletişim ve dört genişlik. İzole kanıt: ${directory}\n`,
);
