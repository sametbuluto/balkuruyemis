import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { tmpdir } from 'node:os';
const root = process.cwd(),
  work = await mkdtemp(path.join(tmpdir(), 'bal-ci-runtime-')),
  repo = path.join(work, 'repo');
await mkdir(repo);
const files = new Set([
  ...execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0'),
  ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], {
    encoding: 'utf8',
  }).split('\0'),
]);
for (const file of files)
  if (file) {
    await mkdir(path.dirname(path.join(repo, file)), { recursive: true });
    await cp(file, path.join(repo, file));
  }
const git = (...args) =>
  execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
    cwd: repo,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
git('init', '-b', 'main');
git('config', 'user.name', 'Isolated CI runtime');
git('config', 'user.email', 'fixture@example.invalid');
const commit = () => {
  git('add', '-A');
  git('commit', '-m', 'isolated CI runtime fixture');
  return git('rev-parse', 'HEAD');
};
commit();
git('switch', '-c', 'content-edit');
const home = path.join(repo, 'content/pages/home.json'),
  source = JSON.parse(await readFile(home, 'utf8'));
source.hero.titleLead = 'Yalnız izole sandbox testi';
await writeFile(home, JSON.stringify(source));
const h = commit();
git('switch', 'main');
const current = JSON.parse(await readFile(home, 'utf8'));
current.hero.eyebrow = 'İzole trusted main';
await writeFile(home, JSON.stringify(current));
const m = commit();
execFileSync(
  process.execPath,
  ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.media.json'],
  { cwd: root, stdio: 'inherit' },
);
await writeFile('.generated/media-tools/package.json', '{"type":"commonjs"}\n');
const { executeSandbox } = createRequire(import.meta.url)(
  path.join(root, '.generated/media-tools/ci/sandbox.js'),
);
const mode = process.argv.includes('--probe') ? 'probe' : 'content';
console.log('Yerel gerçek Docker CI fixture: ' + work);
const refs = git('show-ref');
const result = await executeSandbox(
  repo,
  {
    number: 7,
    mainSha: m,
    sourceSha: h,
    prHeadSha: h,
    sourceRef: 'content-edit',
    repositoryId: 1439737232,
    bypassListVisible: true,
    authoritative: false,
  },
  mode,
);
assert.equal(git('show-ref'), refs);
assert.equal(result.authoritative, false);
await writeFile(
  path.join(work, 'result.json'),
  JSON.stringify(
    {
      ...result,
      realGitHubWorkflow: false,
      hostArchitecture: process.arch,
      containerPlatform: 'linux/amd64',
      fixture: true,
    },
    null,
    2,
  ) + '\n',
);
console.log('Gerçek yerel Docker sonucu: ' + JSON.stringify(result) + '; kanıt ' + work);
