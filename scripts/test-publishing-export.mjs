import assert from 'node:assert/strict';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
  symlink,
  realpath,
  readdir,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import yaml from 'js-yaml';
import { cmsWrite } from './cms-wire.mjs';
import { createStaticServer } from './serve-static.mjs';
const root = process.cwd(),
  work = await mkdtemp(path.join(tmpdir(), 'bal-publishing-export-'));
console.log(`İzole Git yayın fixture: ${work}`);
const repo = path.join(work, 'repo'),
  output = path.join(work, 'candidate'),
  site = path.join(work, 'site');
await mkdir(repo);
await mkdir(site);
for (const name of ['content', 'public'])
  await cp(name, path.join(repo, name), { recursive: true });
const git = (...args) =>
  execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
    cwd: repo,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
const commit = () => {
  git('add', '-A');
  git('commit', '-m', 'isolated publishing fixture');
  return git('rev-parse', 'HEAD');
};
git('init', '-b', 'main');
git('config', 'user.name', 'Isolated publishing fixture');
git('config', 'user.email', 'fixture@example.invalid');
const base = commit();
git('checkout', '-b', 'content-edit');
const config = yaml.load(await readFile('.pages.yml', 'utf8'));
const entries = config.content.flatMap((e) => e.items ?? [e]);
const homeFile = path.join(repo, 'content/pages/home.json');
const original = JSON.parse(await readFile(homeFile, 'utf8'));
const changed = structuredClone(original);
changed.hero.titleLead = 'CMS Git kaynak başlığı';
await writeFile(
  homeFile,
  JSON.stringify(
    await cmsWrite(
      entries.find((e) => e.name === 'page-home'),
      changed,
      config,
      original,
    ),
  ),
);
const bytes = await sharp({
  create: { width: 32, height: 16, channels: 3, background: '#ce142b' },
})
  .png()
  .toBuffer();
assert(!(await sharp(bytes).metadata()).exif);
await writeFile(path.join(repo, 'public/images/products/picked.png'), bytes);
const product = await cmsWrite(
  entries.find((e) => e.name === 'products'),
  {
    name: 'Yalnız izole Git ürün testi',
    description: 'Gerçek ürün değildir.',
    categoryId: 'category-kahve',
    images: [
      { url: 'public/images/products/picked.png', alt: 'İzole geometrik fixture' },
    ],
    status: 'published',
  },
  config,
);
await writeFile(
  path.join(repo, `content/products/product-${product.editorKey}.json`),
  JSON.stringify(product),
);
const draft = await cmsWrite(
  entries.find((e) => e.name === 'products'),
  {
    ...product,
    editorKey: undefined,
    name: 'PUBLISH_DRAFT_PRIVATE_SENTINEL',
    images: [],
    status: 'draft',
  },
  config,
);
await writeFile(
  path.join(repo, `content/products/product-${draft.editorKey}.json`),
  JSON.stringify(draft),
);
const source = commit();
git('checkout', 'main');
const mainHome = JSON.parse(await readFile(homeFile, 'utf8'));
mainHome.hero.eyebrow = 'Main dalında korunan üst başlık';
await writeFile(homeFile, JSON.stringify(mainHome));
const main = commit();
const refs = git('show-ref');
async function run(command, args, cwd, log) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: '',
      NEXT_PUBLIC_ALLOW_INDEXING: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });
  await writeFile(path.join(work, log), `${result.stdout}\n${result.stderr}`);
  assert.equal(result.status, 0, `Başarısız kontrol: ${work}/${log}`);
  return result;
}
await run(
  'node',
  ['scripts/run-publishing.mjs', repo, main, source, output],
  root,
  'candidate.log',
);
assert.equal(git('show-ref'), refs);
assert.equal(git('rev-parse', 'HEAD'), main);
const candidateHome = JSON.parse(
  await readFile(path.join(output, 'content/pages/home.json'), 'utf8'),
);
assert.equal(candidateHome.hero.titleLead, changed.hero.titleLead);
assert.equal(candidateHome.hero.eyebrow, mainHome.hero.eyebrow);
const report = JSON.parse(
  await readFile(path.join(output, 'publication-report.json'), 'utf8'),
);
assert.equal(report.baseSha, base);
assert.equal(report.remoteProtectionVerified, false);
assert.equal(report.candidateCommitSha, null);
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
  '.pages.yml',
])
  await cp(name, path.join(site, name), { recursive: true });
await symlink(path.join(root, 'node_modules'), path.join(site, 'node_modules'), 'dir');
for (const name of ['content', 'public/images'])
  await cp(path.join(output, name), path.join(site, name), { recursive: true });
await run('npm', ['run', 'build'], site, 'static-build.log');
const out = path.join(site, 'out');
for (const entry of await readdir(out, { recursive: true, withFileTypes: true }))
  if (entry.isFile() && /\.(html|js|txt|xml|json)$/.test(entry.name))
    assert(
      !(await readFile(path.join(entry.parentPath, entry.name), 'utf8')).includes(
        draft.name,
      ),
    );
const server = createStaticServer(await realpath(out));
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
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
        changed.hero.titleLead,
      ),
    );
    assert((await page.locator('main').textContent()).includes(mainHome.hero.eyebrow));
    assert(
      (await page.locator('meta[name="robots"]').getAttribute('content')).includes(
        'noindex',
      ),
    );
    await page.goto(origin + '/urunlerimiz?kategori=kahve');
    await page.getByRole('heading', { name: product.name, exact: true }).waitFor();
    const image = page.locator(`img[alt="${product.images[0].alt}"]`);
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((img) => img.decode());
    assert.equal(await image.evaluate((img) => img.naturalWidth), 32);
    assert.equal(await image.getAttribute('loading'), 'lazy');
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({
      path: path.join(work, `candidate-${width}.png`),
      fullPage: true,
    });
  }
  assert.equal((await fetch(origin + '/content/pages/home.json')).status, 404);
  assert.equal((await fetch(origin + '/subelerimiz/location-1')).status, 404);
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
}
// Aynı alan değiştiğinde ikinci bir candidate üretilmez, mevcut main yerinde kalır.
git('checkout', 'content-edit');
const sourceConflict = JSON.parse(await readFile(homeFile, 'utf8'));
sourceConflict.hero.titleLead = 'CMS ikinci düzenleme';
await writeFile(homeFile, JSON.stringify(sourceConflict));
const c2 = commit();
git('checkout', 'main');
const mainConflict = JSON.parse(await readFile(homeFile, 'utf8'));
mainConflict.hero.titleLead = 'Main ikinci düzenleme';
await writeFile(homeFile, JSON.stringify(mainConflict));
const m2 = commit();
const denied = spawnSync(
  'node',
  ['scripts/run-publishing.mjs', repo, m2, c2, path.join(work, 'conflicted')],
  { cwd: root, encoding: 'utf8' },
);
await writeFile(path.join(work, 'conflict.log'), `${denied.stdout}\n${denied.stderr}`);
assert.equal(denied.status, 1);
assert.match(denied.stderr, /merge çatışması/);
assert.equal(git('rev-parse', 'main'), m2);
await writeFile(
  path.join(work, 'result.json'),
  JSON.stringify(
    {
      ...report,
      localBuildPassed: true,
      widths: [320, 393, 768, 1280],
      conflictRejected: true,
      realGitHubTest: false,
      cloudflareDeployment: false,
    },
    null,
    2,
  ),
);
console.log(
  `Git candidate export 2/2 geçti: native CMS → gerçek Git nesneleri → normalizasyon/üç yönlü merge → statik build/HTTP/Chrome; conflict reddi. GitHub/Cloudflare testi değildir. Kanıt: ${work}`,
);
