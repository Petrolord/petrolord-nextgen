// Dashboard load budget (2026-10-05, owner report: /dashboard spun for
// minutes). DashboardPage used to import every route it serves (85 course
// pages, the admin consoles, the deep-course reader) and the deep-course
// content index, so the one chunk behind /dashboard was 16.2 MB (3.7 MB
// gzipped) in production and about 1,250 module requests on the staging
// dev server, all before the learner home could paint. The home needs none
// of it. These guards keep the routes lazy and the home off the content.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');

// Static `import X from '...'` lines (not `import('...')` calls).
const staticImports = (code) => [...code.matchAll(/^\s*import\s+[^'"(]*?from\s+['"]([^'"]+)['"]/gm)].map((m) => m[1]);

describe('the /dashboard route loads only what the home needs', () => {
  const code = read('pages/DashboardPage.jsx');
  const imports = staticImports(code);

  it('imports no page statically: every sub-route is a lazy chunk', () => {
    const pages = imports.filter((p) => p.startsWith('@/pages/'));
    expect(pages).toEqual([]);
  });

  it('keeps the deep-course content (237 manifests, 2.1 MB) out of the home', () => {
    expect(imports).not.toContain('@/lib/courseContent');
    expect(imports).not.toContain('@/lib/courseContent.js');
  });

  it('negative control: the detector does see a static page import', () => {
    expect(staticImports("import EnrollPage from '@/pages/EnrollPage';\nconst X = lazy(() => import('@/pages/Y'));"))
      .toEqual(['@/pages/EnrollPage']);
  });

  it('App starts fetching the dashboard chunk while the session restores', () => {
    const app = read('App.jsx');
    expect(app).toMatch(/preloadDashboard/);
  });
});
