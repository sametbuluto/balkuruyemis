import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Gerçek içerik/out değiştirilmez; bozuk kaynaklar yalnız bu geçici kopyadadır.
const root = process.cwd();
const directory = await mkdtemp(path.join(tmpdir(), 'bal-category-export-'));
for (const name of [
  'scripts',
  'tsconfig.media.json',
  'src',
  'content',
  'tests',
  'public',
  'next.config.ts',
  'next-env.d.ts',
  'tsconfig.json',
  'package.json',
  'package-lock.json',
  'postcss.config.mjs',
]) {
  await cp(path.join(root, name), path.join(directory, name), { recursive: true });
}
await symlink(
  path.join(root, 'node_modules'),
  path.join(directory, 'node_modules'),
  'dir',
);
const file = path.join(directory, 'content/categories/category-kuruyemis.json');
const original = JSON.parse(await readFile(file, 'utf8'));
for (const [name, source] of [
  ['malformed-json', '{'],
  ['unknown-field', JSON.stringify({ ...original, className: 'fixture-only' })],
]) {
  await writeFile(file, source);
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: '',
      NEXT_PUBLIC_ALLOW_INDEXING: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });
  const log = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  await writeFile(path.join(directory, `${name}.log`), log);
  assert.equal(
    result.status,
    1,
    `${name}: build kesin olarak başarısız olmalı. ${directory}`,
  );
  assert.match(log, /Kategori JSON doğrulaması/);
  assert.match(log, /category-kuruyemis\.json/);
}
await writeFile(file, JSON.stringify({ ...original, status: 'draft' }));
const draftBuild = spawnSync('npm', ['run', 'build'], {
  cwd: directory,
  encoding: 'utf8',
  env: {
    ...process.env,
    NEXT_PUBLIC_SITE_URL: '',
    NEXT_PUBLIC_ALLOW_INDEXING: 'false',
    NEXT_TELEMETRY_DISABLED: '1',
  },
});
await writeFile(
  path.join(directory, 'draft.log'),
  `${draftBuild.stdout ?? ''}\n${draftBuild.stderr ?? ''}`,
);
assert.equal(draftBuild.status, 0, `Draft kategorili build başarısız. ${directory}`);
for (const route of ['index.html', 'urunlerimiz.html', 'hakkimizda.html']) {
  const html = await readFile(path.join(directory, 'out', route), 'utf8');
  assert(!html.includes('category-kuruyemis'), `${route}: draft kayıt dışarı sızdı.`);
  assert(
    !html.includes('href="/urunlerimiz?kategori=kuruyemis"'),
    `${route}: draft kategori linki var.`,
  );
  assert(
    html.includes('href="/urunlerimiz?kategori=kahve"'),
    `${route}: yayımlanan kategori kayboldu.`,
  );
}
process.stdout.write(
  `Kategori export sözleşmesi 3/3 geçti: iki hatalı build reddi ve draft yayını engeli. İzole kanıt: ${directory}\n`,
);
