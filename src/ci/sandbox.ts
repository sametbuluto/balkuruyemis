import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, chmod, readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import { cleanEnvironment, exportTree, classifyGit } from './git';
import type { Observation } from './github';
export function containerArgs(
  image: string,
  repo: string,
  mode: 'content' | 'technical' | 'probe',
) {
  if (
    !/^bal-ci-[a-f0-9]{40}-[a-f0-9]+$/.test(image) ||
    !path.isAbsolute(repo) ||
    /[,\r\n]/.test(repo)
  )
    throw new Error('Sandbox argümanı reddedildi.');
  return [
    'create',
    '--platform=linux/amd64',
    '--network=none',
    '--read-only',
    '--user=1000:1000',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges:true',
    '--pids-limit=512',
    '--memory=6g',
    '--cpus=2',
    '--shm-size=256m',
    '--tmpfs=/work:rw,exec,nosuid,nodev,uid=1000,gid=1000,size=4g',
    '--tmpfs=/tmp:rw,nosuid,nodev,size=2g',
    '--mount',
    `type=bind,src=${repo},dst=/git,readonly`,
    '--env=BAL_CI_SANDBOX=1',
    '--env=HOME=/tmp/bal-home',
    '--env=CI=true',
    '--env=PLAYWRIGHT_CHANNEL=chrome',
    '--env=NEXT_PUBLIC_SITE_URL=',
    '--env=NEXT_PUBLIC_ALLOW_INDEXING=false',
    image,
    'node',
    '/opt/trusted/.generated/media-tools/ci/cli.js',
    mode === 'probe' ? 'probe' : 'inside',
    ...(mode === 'probe' ? [] : [mode]),
  ];
}
export function verifyContainer(value: unknown, repo: string) {
  const c = value as {
    HostConfig?: {
      NetworkMode?: string;
      ReadonlyRootfs?: boolean;
      Privileged?: boolean;
      CapDrop?: string[];
      SecurityOpt?: string[];
      PidsLimit?: number;
      Memory?: number;
      IpcMode?: string;
    };
    Config?: { User?: string; Env?: string[] };
    Mounts?: { Type: string; Source: string; Destination: string; RW: boolean }[];
  };
  const h = c.HostConfig;
  if (
    !h ||
    h.NetworkMode !== 'none' ||
    h.ReadonlyRootfs !== true ||
    h.Privileged !== false ||
    !h.CapDrop?.includes('ALL') ||
    !h.SecurityOpt?.some((v) => v.startsWith('no-new-privileges')) ||
    h.PidsLimit !== 512 ||
    h.Memory !== 6 * 1024 ** 3 ||
    h.IpcMode === 'host' ||
    c.Config?.User !== '1000:1000'
  )
    throw new Error('Docker izolasyon konfigürasyonu farklı.');
  const mounts = c.Mounts?.filter((m) => m.Type === 'bind');
  if (
    mounts?.length !== 1 ||
    mounts[0]?.Source !== repo ||
    mounts[0]?.Destination !== '/git' ||
    mounts[0]?.RW !== false ||
    c.Mounts?.some(
      (m) =>
        m.Destination.includes('docker.sock') ||
        (m.Type !== 'bind' &&
          !(m.Type === 'tmpfs' && ['/work', '/tmp'].includes(m.Destination))),
    )
  )
    throw new Error('Docker host mount reddedildi.');
  if (
    c.Config.Env?.some((e) =>
      /^(GITHUB_TOKEN|GH_TOKEN|ACTIONS_RUNTIME_TOKEN|CLOUDFLARE_API_TOKEN|SSH_AUTH_SOCK)=/.test(
        e,
      ),
    )
  )
    throw new Error('Docker credential env reddedildi.');
}
export async function executeSandbox(
  repo: string,
  o: Observation,
  mode: 'content' | 'technical' | 'probe',
) {
  if (mode === 'content' && classifyGit(repo, o) !== 'content')
    throw new Error('Teknik kod/workflow değişikliği içerik otomasyonuna alınamaz.');
  const root = await mkdtemp(path.join(tmpdir(), 'bal-ci-image-'));
  const context = path.join(root, 'trusted');
  await mkdir(context);
  await exportTree(repo, o.mainSha, context);
  await chmod(repo, 0o755);
  const dockerfile = path.join(context, 'scripts/ci/Dockerfile');
  await readFile(dockerfile); // M'de driver yoksa bootstrap fail-closed; H'den fallback yok.
  const env = cleanEnvironment();
  if (process.env.DOCKER_HOST && !process.env.DOCKER_HOST.startsWith('unix://'))
    throw new Error('Remote Docker endpoint reddedildi.');
  const configEnv = {
    ...env,
    HOME: process.env.HOME,
    ...(process.env.DOCKER_CONFIG ? { DOCKER_CONFIG: process.env.DOCKER_CONFIG } : {}),
    ...(process.env.DOCKER_CONTEXT ? { DOCKER_CONTEXT: process.env.DOCKER_CONTEXT } : {}),
  };
  const endpoint = JSON.parse(
    execFileSync(
      'docker',
      ['context', 'inspect', '--format', '{{json .Endpoints.docker.Host}}'],
      {
        env: configEnv,
        encoding: 'utf8',
        timeout: 30_000,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    ),
  ) as unknown;
  if (typeof endpoint !== 'string' || !endpoint.startsWith('unix://'))
    throw new Error('Yalnız yerel Docker daemon desteklenir.');
  const docker = (args: string[]) =>
    execFileSync('docker', ['--host', endpoint, ...args], {
      encoding: 'utf8',
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 20 * 60_000,
      maxBuffer: 32 * 1024 * 1024,
    });
  docker(['info', '--format', '{{.OSType}}']);
  const image = `bal-ci-${o.mainSha}-${randomBytes(8).toString('hex')}`;
  const stop = randomBytes(16).toString('hex');
  console.log(`::stop-commands::${stop}`);
  const build = spawnSync(
    'docker',
    [
      '--host',
      endpoint,
      'build',
      '--platform=linux/amd64',
      '--no-cache',
      '--file',
      dockerfile,
      '--tag',
      image,
      context,
    ],
    { env, stdio: 'inherit', timeout: 20 * 60_000 },
  );
  if (build.status !== 0) {
    console.log(`::${stop}::`);
    throw new Error('Trusted M Docker image build başarısız.');
  }
  let id: string | undefined;
  try {
    id = docker([...containerArgs(image, repo, mode), JSON.stringify(o)]).trim();
    if (!/^[a-f0-9]{64}$/.test(id)) throw new Error('Docker container kimliği farklı.');
    const inspected = JSON.parse(docker(['inspect', id])) as unknown[];
    if (inspected.length !== 1) throw new Error('Tek container inspect gerekli.');
    verifyContainer(inspected[0], repo);
    const started = spawnSync('docker', ['--host', endpoint, 'start', '--attach', id], {
      env,
      stdio: ['ignore', 'inherit', 'inherit'],
      timeout: 45 * 60_000,
    });
    const state = JSON.parse(docker(['inspect', '--format', '{{json .State}}', id])) as {
      ExitCode?: number;
      Running?: boolean;
    };
    if (started.status !== 0 || state.Running !== false || state.ExitCode !== 0)
      throw new Error('Sandbox doğrulaması başarısız/timeout; yetkili check yok.');
    return {
      sandboxRuntimeProbePassed: true,
      mode,
      authoritative: false,
      checkWritten: false,
    };
  } finally {
    // Yalnız bu aracın oluşturduğu ID/tag; mevcut kullanıcı container/image'larına dokunulmaz.
    if (id && /^[a-f0-9]{64}$/.test(id)) docker(['rm', '--force', id]);
    docker(['image', 'rm', image]);
    console.log(`::${stop}::`);
  }
}
