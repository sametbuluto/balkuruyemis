import { cp, mkdir, readdir, rm, symlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { prepareGitCandidate } from '../publishing/candidate.server';
import { gitRead } from '../publishing/git-source.server';
import { exportTree } from './git';
import {
  object,
  number,
  sha,
  sourceBranch,
  repository,
  type Observation,
} from './github';
import { validateContent } from './content';
import { probeSandbox } from './probe';
export function observation(value: unknown): Observation {
  const v = object(value);
  if (
    Object.keys(v).sort().join(',') !==
      [
        'number',
        'mainSha',
        'sourceSha',
        'prHeadSha',
        'sourceRef',
        'repositoryId',
        'bypassListVisible',
        'authoritative',
      ]
        .sort()
        .join(',') ||
    v.repositoryId !== repository.id ||
    v.authoritative !== false ||
    typeof v.bypassListVisible !== 'boolean'
  )
    throw new Error('Observation sözleşmesi reddedildi.');
  const result = {
    number: number(v.number),
    mainSha: sha(v.mainSha),
    sourceSha: sha(v.sourceSha),
    prHeadSha: sha(v.prHeadSha),
    sourceRef: sourceBranch(v.sourceRef),
    repositoryId: repository.id,
    bypassListVisible: v.bypassListVisible,
    authoritative: false as const,
  };
  if (result.sourceSha !== result.prHeadSha) throw new Error('C/H kimliği farklı.');
  return result;
}
export function assertDiagnosticDependencies(repo: string, o: Observation) {
  for (const file of ['package.json', 'package-lock.json'])
    if (
      !gitRead(repo, ['show', `${o.mainSha}:${file}`]).equals(
        gitRead(repo, ['show', `${o.prHeadSha}:${file}`]),
      )
    )
      throw new Error(
        'Teknik dependency/script değişimi ayrı quarantine gerektirir; v1 otomatik çalıştırmaz.',
      );
}
export async function runInside(o: Observation, mode: 'content' | 'technical') {
  const probe = await probeSandbox();
  await mkdir('/tmp/bal-home', { recursive: true });
  await cp('/git', '/work/source.git', { recursive: true });
  const repo = '/work/source.git',
    site = '/work/site';
  await mkdir(site);
  let candidate: Awaited<ReturnType<typeof prepareGitCandidate>> | undefined;
  if (mode === 'content') {
    candidate = await validateContent(repo, o, '/work/candidate');
    for (const name of await readdir('/opt/trusted'))
      if (!['node_modules', '.generated', '.git', '.next', 'out'].includes(name))
        await cp(path.join('/opt/trusted', name), path.join(site, name), {
          recursive: true,
        });
    for (const area of ['content', 'public/images']) {
      await rm(path.join(site, area), { recursive: true, force: true });
      await cp(path.join('/work/candidate', area), path.join(site, area), {
        recursive: true,
      });
    }
  } else {
    assertDiagnosticDependencies(repo, o);
    await exportTree(repo, o.prHeadSha, site);
  }
  // Vite/Next write tool caches beside dependencies. Copy approved M dependencies
  // into disposable tmpfs; the image and host mounts remain read-only.
  // Keep relative .bin links: resolving them back to /opt duplicates Vitest/Chai state.
  await cp('/opt/trusted/node_modules', '/work/node_modules', {
    recursive: true,
    verbatimSymlinks: true,
  });
  await symlink('/work/node_modules', path.join(site, 'node_modules'), 'dir');
  // Sabit reçete driver'dan gelir; technical kod sadece bu credential'sız box'ta çalışır.
  const commands: [string, string[]][] = [
    ['npm', ['run', 'check']],
    // Docker CPU quota is not the host CPU count used by Playwright defaults.
    ['npm', ['run', 'test:e2e', '--', '--workers=1', '--retries=0']],
    ['node', ['scripts/test-cms-roundtrip.mjs']],
    ['node', ['scripts/test-publishing-export.mjs']],
    ['node', ['scripts/test-media-export.mjs']],
  ];
  for (const [command, args] of commands)
    execFileSync(command, args, {
      cwd: site,
      stdio: 'inherit',
      timeout: 20 * 60_000,
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_URL: '',
        NEXT_PUBLIC_ALLOW_INDEXING: 'false',
        NEXT_TELEMETRY_DISABLED: '1',
        PLAYWRIGHT_CHANNEL: 'chrome',
      },
    });
  return {
    mode,
    ...o,
    baseSha:
      candidate?.baseSha ??
      gitRead(repo, ['merge-base', o.mainSha, o.sourceSha]).toString().trim(),
    candidateDataFingerprint: candidate?.candidateDataFingerprint ?? null,
    candidateCommitSha: null,
    probe,
    authoritative: false,
    checkWritten: false,
    realGitHubAcceptance: false,
  };
}
