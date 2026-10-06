import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Standalone test config: the app's vite.config.js carries visual-editor
// dev plugins that have no place in a test run.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@petrolord/engines': path.resolve(__dirname, './packages/engines'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
    // Dashboard sub-routes are lazy chunks (2026-10-05 load fix), so a
    // route test now loads its page module inside the test rather than at
    // collection; the first render of a heavy course page needs more than
    // the 5 s default on a busy runner.
    testTimeout: 20000,
  },
});
