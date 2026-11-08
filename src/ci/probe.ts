import { readFile, access, writeFile } from 'node:fs/promises';
import { createConnection } from 'node:net';
export async function probeSandbox() {
  if (process.getuid?.() === 0 || process.env.BAL_CI_SANDBOX !== '1')
    throw new Error('Non-root sandbox gerekli.');
  for (const name of [
    'GITHUB_TOKEN',
    'GH_TOKEN',
    'ACTIONS_RUNTIME_TOKEN',
    'CLOUDFLARE_API_TOKEN',
    'SSH_AUTH_SOCK',
  ])
    if (process.env[name]) throw new Error('Sandbox credential/env sızıntısı.');
  for (const socket of ['/var/run/docker.sock', '/run/docker.sock']) {
    let found = false;
    try {
      await access(socket);
      found = true;
    } catch {
      /* Yok. */
    }
    if (found) throw new Error('Docker socket sandbox içinde.');
  }
  const status = await readFile('/proc/self/status', 'utf8');
  if (!/^CapEff:\s+0+$/m.test(status) || !/^Seccomp:\s+2$/m.test(status))
    throw new Error('Capability/seccomp sınırı doğrulanmadı.');
  const workMount = (await readFile('/proc/mounts', 'utf8'))
    .split('\n')
    .find((line) => line.split(' ')[1] === '/work')
    ?.split(' ')[3]
    ?.split(',');
  if (
    !workMount?.includes('rw') ||
    !workMount.includes('nosuid') ||
    !workMount.includes('nodev') ||
    workMount.includes('noexec')
  )
    throw new Error('Geçici work alanı native test modüllerini çalıştıramıyor.');
  for (const target of ['/opt/trusted/.ci-write-probe', '/git/.ci-write-probe']) {
    let writable = false;
    try {
      await writeFile(target, 'probe');
      writable = true;
    } catch {
      /* Readonly olmalı. */
    }
    if (writable) throw new Error('Readonly mount/root yazılabilir.');
  }
  await new Promise<void>((resolve, reject) => {
    const socket = createConnection({ host: '1.1.1.1', port: 443 });
    socket.setTimeout(1500);
    socket.once('connect', () => {
      socket.destroy();
      reject(new Error('Sandbox dış ağı açık.'));
    });
    socket.once('error', () => {
      socket.destroy();
      resolve();
    });
    socket.once('timeout', () => {
      socket.destroy();
      reject(new Error('Network izolasyonu belirsiz.'));
    });
  });
  return {
    nonRoot: true,
    credentialsAbsent: true,
    readOnly: true,
    capabilitiesDropped: true,
    seccomp: true,
    networkDenied: true,
    temporaryWorkExecutable: true,
  };
}
