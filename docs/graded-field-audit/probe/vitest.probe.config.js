import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// The B5 panel probe runs on its own config so it never joins the product
// suite (vitest.config.js includes src/** only). It renders every course
// panel, which takes minutes per course.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

export default defineConfig({
  root: ROOT,
  resolve: {
    alias: {
      '@': path.resolve(ROOT, './src'),
      '@petrolord/engines': path.resolve(ROOT, './packages/engines'),
    },
  },
  test: {
    environment: 'node',
    include: ['docs/graded-field-audit/probe/probe.audit.jsx'],
    testTimeout: 3_600_000,
  },
});
