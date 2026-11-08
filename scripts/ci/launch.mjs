import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
export function launch(mode) {
  const compile = spawnSync(
    process.execPath,
    [path.resolve('node_modules/typescript/bin/tsc'), '-p', 'tsconfig.media.json'],
    { stdio: 'inherit' },
  );
  if (compile.status !== 0) process.exit(compile.status ?? 1);
  mkdirSync('.generated/media-tools', { recursive: true });
  writeFileSync('.generated/media-tools/package.json', '{"type":"commonjs"}\n');
  const child = spawnSync(
    process.execPath,
    ['.generated/media-tools/ci/cli.js', mode, ...process.argv.slice(2)],
    { stdio: 'inherit' },
  );
  process.exitCode = child.status ?? 1;
}
