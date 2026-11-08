// @vitest-environment node
import { beforeEach, expect, it } from 'vitest';
import { mkdtemp, cp, writeFile, readFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { classifyGit, exportTree } from './git';
import { validateContent } from './content';
import { assertDiagnosticDependencies } from './inside';
import type { Observation } from './github';
let root: string, repo: string, base: string;
function git(...args: string[]) {
  return execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
    cwd: repo,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
function commit() {
  git('add', '-A');
  git('commit', '-m', 'isolated CI fixture');
  return git('rev-parse', 'HEAD');
}
async function changeHome(value: string) {
  const p = path.join(repo, 'content/pages/home.json');
  const v = JSON.parse(await readFile(p, 'utf8')) as {
    hero: { titleLead: string; eyebrow: string };
  };
  v.hero.titleLead = value;
  await writeFile(p, JSON.stringify(v));
}
function observed(): Observation {
  return {
    number: 7,
    mainSha: git('rev-parse', 'main'),
    sourceSha: git('rev-parse', 'content-edit'),
    prHeadSha: git('rev-parse', 'content-edit'),
    sourceRef: 'content-edit',
    repositoryId: 1439737232,
    bypassListVisible: true,
    authoritative: false,
  };
}
beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'bal-ci-unit-'));
  repo = path.join(root, 'repo');
  await mkdir(repo);
  for (const name of ['content', 'public', 'package.json', 'package-lock.json'])
    await cp(name, path.join(repo, name), { recursive: true });
  git('init', '-b', 'main');
  git('config', 'user.name', 'Isolated CI fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  base = commit();
  git('switch', '-c', 'content-edit');
});
it('gerçek Git nesneleriyle içerik sınıflandırılır; adapter ve base B korunur', async () => {
  await changeHome('İzole CI metni');
  commit();
  const o = observed();
  expect(classifyGit(repo, o)).toBe('content');
  const before = git('show-ref');
  const report = await validateContent(repo, o, path.join(root, 'candidate'));
  expect(report.baseSha).toBe(base);
  expect(report.sourceCodeExecuted).toBe(false);
  expect(report.candidateCommitSha).toBeNull();
  expect(git('show-ref')).toBe(before);
});
it.each(['src/evil.ts', '.github/workflows/fake.yml', 'scripts/evil.mjs', '.env.local'])(
  'kod/workflow/env içerik akışına alınmaz: %s',
  async (file) => {
    await mkdir(path.dirname(path.join(repo, file)), { recursive: true });
    await writeFile(path.join(repo, file), 'fixture');
    commit();
    const o = observed();
    expect(classifyGit(repo, o)).toBe('technical');
    await expect(validateContent(repo, o, path.join(root, 'denied'))).rejects.toThrow();
  },
);
it('bozuk JSON CI adapter kapısını geçemez', async () => {
  await writeFile(path.join(repo, 'content/pages/home.json'), '{bad');
  commit();
  await expect(
    validateContent(repo, observed(), path.join(root, 'bad')),
  ).rejects.toThrow();
});
it('geçersiz kategori referanslı gerçek olmayan ürün izole ortamda reddedilir', async () => {
  const p = {
    id: 'product-fixture',
    slug: 'fixture',
    name: 'İzole test',
    description: 'Gerçek ürün değil.',
    categoryId: 'category-missing',
    images: [],
    sortOrder: 1,
    status: 'draft',
  };
  await writeFile(
    path.join(repo, 'content/products/product-fixture.json'),
    JSON.stringify(p),
  );
  commit();
  await expect(
    validateContent(repo, observed(), path.join(root, 'bad')),
  ).rejects.toThrow();
});
it('bozuk raster MIME/gerçek decode kapısından geçemez', async () => {
  const file = path.join(repo, 'content/categories/category-kahve.json');
  const v = JSON.parse(await readFile(file, 'utf8')) as Record<string, unknown>;
  v.image = {
    id: 'image-fixture',
    url: '/images/categories/bad.png',
    alt: 'İzole geometrik test',
    width: 1,
    height: 1,
  };
  await writeFile(file, JSON.stringify(v));
  await writeFile(path.join(repo, 'public/images/categories/bad.png'), 'not PNG');
  commit();
  await expect(
    validateContent(repo, observed(), path.join(root, 'bad')),
  ).rejects.toThrow();
});
it('aynı alan main/source merge conflict CI sonucunu durdurur', async () => {
  await changeHome('Source');
  commit();
  git('switch', 'main');
  await changeHome('Main');
  commit();
  await expect(validateContent(repo, observed(), path.join(root, 'bad'))).rejects.toThrow(
    'çatışması',
  );
});
it('git ref ilerlemesi eski observation SHA ile candidate oluşturamaz', async () => {
  await changeHome('One');
  commit();
  const o = observed();
  await changeHome('Two');
  commit();
  await expect(validateContent(repo, o, path.join(root, 'bad'))).rejects.toThrow('SHA');
});
it('teknik dependency/script değişimi ayrı quarantine olmadan çalıştırılmaz', async () => {
  const file = path.join(repo, 'package.json');
  await writeFile(
    file,
    (await readFile(file, 'utf8')).replace('"private": true', '"private": false'),
  );
  commit();
  expect(() => assertDiagnosticDependencies(repo, observed())).toThrow('quarantine');
});
it('snapshot gerçek blob okur; çalışma ağacındaki sonradan değiştirilmiş dosyayı almaz', async () => {
  await changeHome('Committed');
  const h = commit();
  await changeHome('Dirty');
  const out = path.join(root, 'tree');
  await exportTree(repo, h, out);
  expect(await readFile(path.join(out, 'content/pages/home.json'), 'utf8')).toContain(
    'Committed',
  );
});
it('nested secret veya traversal benzeri snapshot yolu reddedilir', async () => {
  await mkdir(path.join(repo, 'nested'));
  await writeFile(path.join(repo, 'nested/.env.local'), 'fixture');
  const h = commit();
  await expect(exportTree(repo, h, path.join(root, 'tree'))).rejects.toThrow();
});
