import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Sentetik şube yalnızca geçici kopyaya eklenir; gerçek kaynak/out değiştirilmez.
const root = process.cwd();
const directory = await mkdtemp(path.join(tmpdir(), 'bal-branch-export-'));
for (const name of [
  'src',
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
const source = path.join(directory, 'src/content/branches.ts');
const marker = 'export const branches: readonly BranchCardEntry[] = [';
const content = await readFile(source, 'utf8');
assert(content.includes(marker));
const fixture = {
  id: 'test-verified-branch',
  slug: 'test-sube',
  name: 'Yalnızca test şubesi',
  description: 'İzole build fixture; gerçek işletme değildir.',
  address: 'Yalnızca test adresi',
  phone: null,
  openingHours: null,
  googleMapsUrl: null,
  whatsappUrl: null,
  images: [],
  sortOrder: 99,
  status: 'published',
  contentKind: 'verified',
};
await writeFile(
  source,
  content.replace(marker, `${marker}\n${JSON.stringify(fixture)},`),
);
const result = spawnSync(
  process.execPath,
  [path.join(root, 'node_modules/next/dist/bin/next'), 'build', '--webpack'],
  {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: '',
      NEXT_PUBLIC_ALLOW_INDEXING: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
);
await writeFile(
  path.join(directory, 'build.log'),
  `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
);
assert.equal(
  result.status,
  0,
  `İzole build başarısız: ${directory}/build.log\n${result.stderr}`,
);
const html = await readFile(
  path.join(directory, 'out/subelerimiz/test-sube.html'),
  'utf8',
);
assert(html.includes('Yalnızca test şubesi'));
assert(html.includes('Yalnızca test adresi'));
const home = await readFile(path.join(directory, 'out/index.html'), 'utf8');
assert(home.includes('beş buluşma noktası'), 'Şube sayısı yeni kayıttan türetilmedi');
process.stdout.write(
  `Doğrulanmış şube otomatik export testi geçti. İzole kanıt: ${directory}\n`,
);
