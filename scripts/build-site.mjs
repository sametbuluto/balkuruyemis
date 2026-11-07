import { spawnSync } from 'node:child_process';
import path from 'node:path';
// Tek build anı hem Next render hem filtre hem medya export tarafından paylaşılır.
const env = {
  ...process.env,
  SITE_BUILD_AT: process.env.SITE_BUILD_AT ?? new Date().toISOString(),
};
for (const args of [
  ['scripts/run-media.mjs', 'check'],
  [path.join(process.cwd(), 'node_modules/next/dist/bin/next'), 'build', '--webpack'],
  ['scripts/run-media.mjs', 'export'],
  ['scripts/verify-export.mjs'],
]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
