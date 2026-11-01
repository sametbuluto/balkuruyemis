import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const compile = spawnSync(
  process.execPath,
  [path.join(root, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.media.json'],
  { stdio: 'inherit' },
);
if (compile.status !== 0) process.exit(compile.status ?? 1);
mkdirSync('.generated/media-tools', { recursive: true });
writeFileSync('.generated/media-tools/package.json', '{"type":"commonjs"}\n');
const result = spawnSync(
  process.execPath,
  ['.generated/media-tools/content/media-cli.js', process.argv[2] ?? 'check'],
  { stdio: 'inherit' },
);
process.exitCode = result.status ?? 1;
