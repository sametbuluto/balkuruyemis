// @vitest-environment node
import { expect, it } from 'vitest';
import { containerArgs, verifyContainer } from './sandbox';
import { cleanEnvironment } from './git';
import { observation } from './inside';
const image = 'bal-ci-' + 'a'.repeat(40) + '-abcdef',
  repo = '/private/tmp/fixture.git';
const valid = () => ({
  HostConfig: {
    NetworkMode: 'none',
    ReadonlyRootfs: true,
    Privileged: false,
    CapDrop: ['ALL'],
    SecurityOpt: ['no-new-privileges'],
    PidsLimit: 512,
    Memory: 6 * 1024 ** 3,
    IpcMode: 'private',
  },
  Config: { User: '1000:1000', Env: ['CI=true'] },
  Mounts: [{ Type: 'bind', Source: repo, Destination: '/git', RW: false }],
});
it('sandbox CLI minimum yetkiler/readonly/network/pid/memory ile kurulur', () => {
  const args = containerArgs(image, repo, 'technical');
  for (const item of [
    '--network=none',
    '--read-only',
    '--cap-drop=ALL',
    '--user=1000:1000',
    '--security-opt=no-new-privileges:true',
    '--pids-limit=512',
    '--memory=6g',
    '--tmpfs=/work:rw,exec,nosuid,nodev,uid=1000,gid=1000,size=4g',
  ])
    expect(args).toContain(item);
  expect(args.join(' ')).not.toMatch(
    /GITHUB_TOKEN|docker.sock|privileged|ipc=host|network=host/,
  );
  expect(() => verifyContainer(valid(), repo)).not.toThrow();
});
it.each([
  'NetworkMode',
  'ReadonlyRootfs',
  'Privileged',
  'CapDrop',
  'SecurityOpt',
  'PidsLimit',
  'Memory',
  'IpcMode',
])('Docker inspection %s sapmasını reddeder', (key) => {
  const value = valid();
  (value.HostConfig as Record<string, unknown>)[key] = key === 'IpcMode' ? 'host' : null;
  expect(() => verifyContainer(value, repo)).toThrow();
});
it('credential, root user ve ek host mount reddi', () => {
  const a = valid();
  a.Config.Env = ['GITHUB_TOKEN=fixture'];
  expect(() => verifyContainer(a, repo)).toThrow();
  const b = valid();
  b.Config.User = '0:0';
  expect(() => verifyContainer(b, repo)).toThrow();
  const c = valid();
  c.Mounts.push({
    Type: 'bind',
    Source: '/var/run/docker.sock',
    Destination: '/var/run/docker.sock',
    RW: true,
  });
  expect(() => verifyContainer(c, repo)).toThrow();
});
it.each(['bad', 'a;echo', '/tmp/image'])('geçersiz image argümanı reddedilir: %s', (v) =>
  expect(() => containerArgs(v, repo, 'content')).toThrow(),
);
it('host Git/derleme child ortamına read token ve credential aktarılmaz', () => {
  process.env.BAL_UNIT_CREDENTIAL = 'fixture';
  try {
    expect(cleanEnvironment()).not.toHaveProperty('BAL_UNIT_CREDENTIAL');
    expect(cleanEnvironment()).not.toHaveProperty('GITHUB_TOKEN');
  } finally {
    delete process.env.BAL_UNIT_CREDENTIAL;
  }
});
it('observation user SHA veya authoritative=true ile genişletilemez', () => {
  const v = {
    number: 7,
    mainSha: 'a'.repeat(40),
    sourceSha: 'b'.repeat(40),
    prHeadSha: 'b'.repeat(40),
    sourceRef: 'content-edit',
    repositoryId: 1439737232,
    bypassListVisible: true,
    authoritative: false,
  };
  expect(observation(v)).toEqual(v);
  for (const bad of [
    { ...v, authoritative: true },
    { ...v, sourceSha: 'fake' },
    { ...v, prHeadSha: 'c'.repeat(40) },
    { ...v, extra: true },
    { ...v, repositoryId: 1 },
  ])
    expect(() => observation(bad)).toThrow();
});
