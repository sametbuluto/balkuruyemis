import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { assessContentChanges, contentChangeLimits } from '../lib/content-change-policy';

const sha = /^[a-f0-9]{40}$/;
const legacy = /^content\/(home|settings|social)\.json$/;
export function gitRead(repository: string, args: string[]): Buffer {
  if (
    !['cat-file', 'rev-parse', 'merge-base', 'diff-tree', 'ls-tree', 'show'].includes(
      args[0] ?? '',
    )
  )
    throw new Error('Yalnız salt okunur Git alt komutları kullanılabilir.');
  return execFileSync(
    'git',
    [
      '-c',
      'core.hooksPath=/dev/null',
      '-c',
      'core.fsmonitor=false',
      '-c',
      'diff.external=',
      ...args,
    ],
    {
      cwd: repository,
      encoding: 'buffer',
      maxBuffer: 32 * 1024 * 1024,
      env: {
        PATH: process.env.PATH,
        NODE_ENV: process.env.NODE_ENV,
        LANG: 'C',
        LC_ALL: 'C',
        GIT_NO_REPLACE_OBJECTS: '1',
        GIT_OPTIONAL_LOCKS: '0',
        GIT_CONFIG_NOSYSTEM: '1',
        GIT_CONFIG_GLOBAL: '/dev/null',
        GIT_TERMINAL_PROMPT: '0',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
}
const text = (b: Buffer) => new TextDecoder('utf-8', { fatal: true }).decode(b);
function commit(repository: string, id: string) {
  if (
    !sha.test(id) ||
    text(gitRead(repository, ['cat-file', '-t', id])).trim() !== 'commit'
  )
    throw new Error('Tam, geçerli commit SHA gerekli.');
}
export interface SourcePins {
  mainSha: string;
  sourceSha: string;
}
export function assertPins(repository: string, pins: SourcePins) {
  commit(repository, pins.mainSha);
  commit(repository, pins.sourceSha);
  for (const [branch, expected] of [
    ['main', pins.mainSha],
    ['content-edit', pins.sourceSha],
  ])
    if (
      text(
        gitRead(repository, ['rev-parse', '--verify', `refs/heads/${branch}^{commit}`]),
      ).trim() !== expected
    )
      throw new Error('Dal SHA değişti; eski candidate/kanıt geçersiz.');
}
/** Git nesnelerinden gerçek mode/byte envanteri. Checkout/filter/source script çalıştırmaz. */
export function inspectSource(repository: string, pins: SourcePins) {
  assertPins(repository, pins);
  const bases = text(
    gitRead(repository, ['merge-base', '--all', pins.mainSha, pins.sourceSha]),
  )
    .trim()
    .split('\n');
  if (bases.length !== 1 || !sha.test(bases[0]!))
    throw new Error('Tek ortak ata gerekli; history otomatik birleştirilemez.');
  const baseSha = bases[0]!;
  const raw = text(
    gitRead(repository, [
      'diff-tree',
      '-r',
      '--no-commit-id',
      '--raw',
      '-z',
      '--no-renames',
      '--no-ext-diff',
      '--abbrev=40',
      baseSha,
      pins.sourceSha,
    ]),
  ).split('\0');
  const changes = [];
  for (let i = 0; i < raw.length - 1; i += 2) {
    const header = raw[i]!,
      file = raw[i + 1]!;
    const m = /^:([0-9]{6}) ([0-9]{6}) ([a-f0-9]{40}) ([a-f0-9]{40}) ([A-Z])$/.exec(
      header,
    );
    if (!m) throw new Error('Beklenmeyen Git diff kaydı.');
    const [, , mode, , blob, status] = m;
    const bytes =
      status === 'D'
        ? 0
        : Number(text(gitRead(repository, ['cat-file', '-s', blob!])).trim());
    if (legacy.test(file))
      throw new Error('Eski singleton yolu aktif içerik kaynağı değildir.');
    changes.push({ path: file, status: status!, mode: mode!, bytes });
  }
  const decision = assessContentChanges(changes);
  if (!decision.ok)
    throw new Error(`Git içerik kapısı reddetti: ${decision.errors.join(' ')}`);
  return { ...pins, baseSha, changes };
}
const areas = [
  'categories',
  'products',
  'branches',
  'gallery',
  'pages',
  'settings',
  'announcements',
];
const imageAreas = ['brand', 'products', 'categories', 'branches', 'gallery'];
export async function exportDataSnapshot(repository: string, id: string, target: string) {
  commit(repository, id);
  for (const area of areas)
    await mkdir(path.join(target, 'content', area), { recursive: true });
  for (const area of imageAreas)
    await mkdir(path.join(target, 'public/images', area), { recursive: true });
  const tree = text(
    gitRead(repository, [
      'ls-tree',
      '-r',
      '-z',
      '--full-tree',
      id,
      '--',
      'content',
      'public/images',
    ]),
  ).split('\0');
  let bytesTotal = 0;
  for (const entry of tree) {
    if (!entry) continue;
    const m = /^([0-9]{6}) (blob|tree|commit) ([a-f0-9]{40})\t([\s\S]+)$/.exec(entry);
    if (!m) throw new Error('Beklenmeyen Git tree kaydı.');
    const [, mode, type, blob, file] = m;
    if (mode !== '100644' || type !== 'blob')
      throw new Error('Veri snapshot normal dosya olmalı.');
    const keep =
      /^(content\/(categories|products|branches|gallery|pages|settings|announcements)|public\/images(?:\/(brand|products|categories|branches|gallery))?)\/\.gitkeep$/.test(
        file!,
      );
    const bytes = Number(text(gitRead(repository, ['cat-file', '-s', blob!])).trim());
    if (keep) {
      if (
        bytes > 16 ||
        !/^\s*$/.test(text(gitRead(repository, ['cat-file', 'blob', blob!])))
      )
        throw new Error('gitkeep yalnız boşluk/satır sonu içerebilir.');
      continue;
    }
    const decision = assessContentChanges([{ path: file, status: 'A', mode, bytes }]);
    if (!decision.ok || legacy.test(file!))
      throw new Error('Snapshot izinli veri yolları dışında veya sınır üstünde.');
    bytesTotal += bytes;
    if (bytesTotal > contentChangeLimits.batchBytes + 10 * contentChangeLimits.jsonBytes)
      throw new Error('Snapshot toplam byte sınırı.');
    const output = path.join(target, file!);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, gitRead(repository, ['cat-file', 'blob', blob!]));
  }
}
