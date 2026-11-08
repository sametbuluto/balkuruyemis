import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    clearMocks: true,
    // Git subprocess/image integration fixtures need headroom on CI/emulated Linux.
    // Assertions remain unchanged; this is a bounded runtime budget, not a gate bypass.
    fileParallelism: false,
    testTimeout: 15_000,
  },
});
