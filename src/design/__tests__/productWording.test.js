// The product is "Petrolord NextGen". "NextGen Suite" was the old name on the
// rail, two page titles, the auth email templates and llms.txt. The Petrolord
// Suite is a different product ("Open in Suite", Suite planners), so the
// detector only matches the two words together.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const OLD_NAME = /next\s*gen[\s-]+suite/i;

const SKIP_DIR = new Set(['__tests__', 'node_modules']);
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIR.has(e.name)) walk(path.join(dir, e.name), out);
    } else if (/\.(jsx?|css|html|json|md|txt)$/.test(e.name) && !/\.test\.jsx?$/.test(e.name)) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

const hitsIn = (file) => fs.readFileSync(file, 'utf8').split('\n')
  .map((line, i) => (OLD_NAME.test(line) ? `${path.relative(ROOT, file).split(path.sep).join('/')}:${i + 1}: ${line.trim().slice(0, 120)}` : null))
  .filter(Boolean);

describe('product wording', () => {
  // Everything the app ships: all of src (a superset of what main.jsx
  // reaches), the page shell and the public folder.
  const files = [
    ...walk(path.join(ROOT, 'src')),
    path.join(ROOT, 'index.html'),
    ...walk(path.join(ROOT, 'public')),
  ];

  it('scans the shipped source', () => {
    const rel = files.map((f) => path.relative(ROOT, f).split(path.sep).join('/'));
    expect(rel).toEqual(expect.arrayContaining([
      'src/components/Sidebar.jsx', 'src/pages/SettingsPage.jsx', 'src/pages/SuperAdminToolPage.jsx',
      'src/pages/LoginPage.jsx', 'index.html', 'public/manifest.json', 'public/llms.txt',
    ]));
    expect(files.length).toBeGreaterThan(500);
  });

  it('no user-facing "NextGen Suite" anywhere', () => {
    expect(files.flatMap(hitsIn)).toEqual([]);
  });

  it('the rail brand line reads NEXTGEN under Petrolord', () => {
    const rail = fs.readFileSync(path.join(ROOT, 'src/components/Sidebar.jsx'), 'utf8');
    expect(rail).toMatch(/>Petrolord<\/h1>\s*<p [^>]*>NEXTGEN<\/p>/);
  });

  it('negative control: the detector sees the old name in every spelling and leaves the Suite product alone', () => {
    expect(OLD_NAME.test('<title>Settings - Petrolord NextGen Suite</title>')).toBe(true);
    expect(OLD_NAME.test('<p>NEXTGEN SUITE</p>')).toBe(true);
    expect(OLD_NAME.test('Petrolord Nextgen-Suite')).toBe(true);
    expect(OLD_NAME.test('Open in Suite')).toBe(false);
    expect(OLD_NAME.test('Petrolord NextGen Academy courses run inside the Petrolord Suite')).toBe(false);
    expect(OLD_NAME.test('NextGen. Suite planners are next.')).toBe(false);
  });
});
