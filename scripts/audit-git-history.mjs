import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
const git = (repo, args) =>
  execFileSync(
    'git',
    ['-c', 'core.hooksPath=/dev/null', '-c', 'core.fsmonitor=false', ...args],
    {
      cwd: repo,
      maxBuffer: 64 * 1024 * 1024,
      env: {
        PATH: process.env.PATH,
        GIT_CONFIG_GLOBAL: '/dev/null',
        GIT_CONFIG_NOSYSTEM: '1',
        GIT_NO_REPLACE_OBJECTS: '1',
        GIT_TERMINAL_PROMPT: '0',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
export async function auditHistory(repo = process.cwd()) {
  const commits = git(repo, ['rev-list', '--all'])
    .toString('utf8')
    .trim()
    .split('\n')
    .filter(Boolean);
  const blobs = new Map(),
    forbidden = new Set();
  for (const commit of commits) {
    for (const entry of git(repo, ['ls-tree', '-rz', commit])
      .toString('utf8')
      .split('\0')) {
      if (!entry) continue;
      const m = /^([0-9]{6}) (\w+) ([a-f0-9]{40})\t([\s\S]+)$/.exec(entry);
      if (!m) throw new Error('Git tree biçimi desteklenmiyor.');
      const [, mode, type, sha, file] = m;
      if (
        /(^|\/)(node_modules|out|\.next|\.generated|coverage|playwright-report|test-results)(\/|$)/.test(
          file,
        ) ||
        (/(^|\/)\.env(?:\.|$)/.test(file) && file !== '.env.example')
      )
        forbidden.add(file);
      if (type === 'blob') {
        if (!blobs.has(sha)) blobs.set(sha, { sha, paths: [], mode });
        if (!blobs.get(sha).paths.includes(file)) blobs.get(sha).paths.push(file);
      }
    }
  }
  const secretPatternFindings = [],
    rasterFindings = [],
    oversize = [];
  let rasterBlobs = 0,
    largestBytes = 0;
  const patterns = [
    /gh[pousr]_[A-Za-z0-9]{30,}/,
    /AKIA[0-9A-Z]{16}/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{40,}/,
    /github_pat_[A-Za-z0-9_]{40,}/,
    /AIza[0-9A-Za-z_-]{35}/,
    /xox[baprs]-[0-9A-Za-z-]{20,}/,
    /npm_[A-Za-z0-9]{36,}/,
  ];
  for (const [sha, item] of blobs) {
    const size = Number(git(repo, ['cat-file', '-s', sha]).toString('utf8').trim());
    largestBytes = Math.max(size, largestBytes);
    if (size > 10 * 1024 * 1024) {
      oversize.push({ sha, paths: item.paths, bytes: size });
      continue;
    }
    const bytes = git(repo, ['cat-file', 'blob', sha]);
    if (patterns.some((pattern) => pattern.test(bytes.toString('utf8'))))
      secretPatternFindings.push({ sha, paths: item.paths });
    if (item.paths.some((file) => /\.(png|jpe?g|avif|webp)$/i.test(file))) {
      rasterBlobs++;
      try {
        const meta = await sharp(bytes, {
          failOn: 'warning',
          limitInputPixels: 24_000_000,
        }).metadata();
        await sharp(bytes, { failOn: 'warning', limitInputPixels: 24_000_000 }).stats();
        if (meta.exif || meta.xmp || meta.iptc)
          rasterFindings.push({ sha, paths: item.paths, reason: 'source metadata' });
      } catch {
        rasterFindings.push({ sha, paths: item.paths, reason: 'invalid raster' });
      }
    }
  }
  return {
    commits: commits.length,
    uniqueBlobs: blobs.size,
    largestBytes,
    forbiddenPaths: [...forbidden],
    secretPatternFindings,
    rasterBlobs,
    rasterFindings,
    oversize,
    scope:
      'reachable commits/refs only; pattern scan is not an exhaustive secret detector',
  };
}
if (
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
) {
  const result = await auditHistory(process.argv[2] ?? process.cwd());
  console.log(JSON.stringify(result, null, 2));
  if (
    result.forbiddenPaths.length ||
    result.secretPatternFindings.length ||
    result.rasterFindings.length ||
    result.oversize.length
  )
    process.exitCode = 1;
}
