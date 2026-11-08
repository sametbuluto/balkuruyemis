import { launch } from './launch.mjs';
const [mode, ...args] = process.argv.slice(2);
if (!['content', 'diagnostics', 'sandbox-probe'].includes(mode))
  throw new Error('CI validation mode gerekli.');
process.argv = [process.argv[0], process.argv[1], ...args];
launch(mode);
