import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { gitRead, inspectSource } from '../publishing/git-source.server';
import { repository, type Observation, sha, sourceBranch } from './github';
export function cleanEnvironment(): NodeJS.ProcessEnv {
  return {
    PATH: process.env.PATH,
    NODE_ENV: process.env.NODE_ENV,
    LANG: 'C',
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_NO_REPLACE_OBJECTS: '1',
    GIT_TERMINAL_PROMPT: '0',
    GIT_ASKPASS: '/usr/bin/false',
  };
}
export async function fetchObservation(o: Observation) {
  sha(o.mainSha);
  sha(o.sourceSha);
  sha(o.prHeadSha);
  sourceBranch(o.sourceRef);
  if (o.repositoryId !== repository.id || o.sourceSha !== o.prHeadSha)
    throw new Error('Git observation kimliği reddedildi.');
  const root = await mkdtemp(path.join(tmpdir(), 'bal-ci-git-'));
  const run = (args: string[]) =>
    execFileSync(
      'git',
      [
        '-c',
        'core.hooksPath=/dev/null',
        '-c',
        'core.fsmonitor=false',
        '-c',
        'credential.helper=',
        ...args,
      ],
      {
        cwd: root,
        env: cleanEnvironment(),
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120_000,
        maxBuffer: 64 * 1024 * 1024,
      },
    );
  run(['init', '--bare', '--initial-branch=main']);
  run([
    'fetch',
    '--no-tags',
    '--no-recurse-submodules',
    repository.url,
    'refs/heads/main:refs/heads/main',
    `refs/heads/${o.sourceRef}:refs/heads/content-edit`,
  ]);
  if (
    gitRead(root, ['rev-parse', 'refs/heads/main']).toString().trim() !== o.mainSha ||
    gitRead(root, ['rev-parse', 'refs/heads/content-edit']).toString().trim() !==
      o.sourceSha
  )
    throw new Error('Fetch sırasında stale Git SHA.');
  return realpath(root);
}
/** Git nesnelerinden data-only sınıflandırma; API dosya listesinden karar verilmez. */
export function classifyGit(root: string, o: Observation): 'content' | 'technical' {
  const bases = gitRead(root, ['merge-base', '--all', o.mainSha, o.sourceSha])
    .toString()
    .trim()
    .split('\n');
  if (bases.length !== 1) throw new Error('Tek ortak ata gerekli.');
  sha(bases[0]);
  const changed = gitRead(root, [
    'diff-tree',
    '-r',
    '--name-only',
    '--no-commit-id',
    bases[0]!,
    o.sourceSha,
  ])
    .toString()
    .trim();
  if (!changed) throw new Error('Boş PR değişimi.');
  // Her reddi teknik sınıfa yönlendirmek eligibility vermez. Content işinde tekrar inspectSource zorunlu.
  try {
    inspectSource(root, { mainSha: o.mainSha, sourceSha: o.sourceSha });
    return 'content';
  } catch {
    return 'technical';
  }
}
export async function exportTree(root: string, id: string, target: string) {
  sha(id);
  await mkdir(target, { recursive: true });
  const raw = new TextDecoder('utf-8', { fatal: true }).decode(
    gitRead(root, ['ls-tree', '-r', '-z', id]),
  );
  let total = 0,
    count = 0;
  for (const entry of raw.split('\0')) {
    if (!entry) continue;
    const m = /^(100644) blob ([a-f0-9]{40})\t([\s\S]+)$/.exec(entry);
    if (!m) throw new Error('CI tree symlink/executable/submodule reddedildi.');
    const file = m[3]!;
    if (
      file.length > 240 ||
      file
        .split('/')
        .some(
          (p) =>
            !p ||
            p === '.' ||
            p === '..' ||
            p === '.git' ||
            (p.startsWith('.env') && p !== '.env.example'),
        ) ||
      /[\x00-\x1f\\:]/.test(file) ||
      /(^|\/)(node_modules|\.next|out|\.generated)\//.test(file) ||
      (file.startsWith('.env') && file !== '.env.example')
    )
      throw new Error('CI tree yolu reddedildi.');
    const size = Number(gitRead(root, ['cat-file', '-s', m[2]!]).toString().trim());
    total += size;
    count++;
    if (size > 5 * 1024 * 1024 || total > 40 * 1024 * 1024 || count > 2000)
      throw new Error('CI tree boyut sınırı.');
    const out = path.join(target, file);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, gitRead(root, ['cat-file', 'blob', m[2]!]));
  }
}
