// Wave 7 end state (docs/scope/DesignSystem-Rollout.md section 11): the
// guards that keep the rollout finished.
//
//   1. Every route App.jsx serves renders inside a scope: the signed-in
//      scope (Layout), the always-light public frame (PublicPage), or the
//      regal homepage's own look, which uses no kit component. The pieces
//      mounted at the app root carry a scope of their own.
//   2. The gate, the registry and the scope-aware helper are gone.
//   3. No code reachable from src/main.jsx paints lime or a legacy console
//      colour, outside the homepage, the white chart kit, the document
//      canvases and print styles.
//
// Each scan has a negative control, so a detector that finds nothing is not
// mistaken for a clean tree.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { LEGACY_CHROME_TOKEN } from '../testing/themeAssertions.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const SRC = path.join(ROOT, 'src');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

// ---- the import graph from src/main.jsx ----

const EXTS = ['', '.js', '.jsx', '/index.js', '/index.jsx'];
function resolveImport(fromAbs, spec) {
  let base;
  if (spec.startsWith('@/')) base = path.join(SRC, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromAbs), spec);
  else return null; // a package, or the vendored engines
  base = base.replace(/\?.*$/, '');
  for (const e of EXTS) {
    const p = base + e;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}
const IMPORT = /(?:import|export)\s+(?:[^'"]*?from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
function reachableFrom(entryRel) {
  const seen = new Set();
  const stack = [path.join(ROOT, entryRel)];
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    if (!/\.jsx?$/.test(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(IMPORT)) {
      const r = resolveImport(f, m[1] || m[2]);
      if (r && !seen.has(r)) stack.push(r);
    }
  }
  return [...seen].map((f) => path.relative(ROOT, f).split(path.sep).join('/')).sort();
}

const REACHABLE = reachableFrom('src/main.jsx');
// Teaching content (lesson markdown, banks) is not chrome.
const CODE = REACHABLE.filter((f) => /\.(jsx?|css)$/.test(f) && !f.startsWith('src/content/'));

// ---- detectors ----

const stripComments = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|\s)\/\/[^\n]*/g, '$1');

/** Lime in any spelling the console used: the hex, its hover, or a Tailwind lime class. */
const LIME = /#?BFFF00|#?A8E600|\blime-\d{2,3}\b/i;
const limeLines = (src) => stripComments(src).split('\n').filter((l) => LIME.test(l));

/** Legacy console colour classes, as the screen theme tests detect them. */
const legacyTokens = (src) => stripComments(src).split(/[\s"'`{}()<>,;=]+/)
  .filter((t) => t && !t.startsWith('dark:') && !t.startsWith('print:') && LEGACY_CHROME_TOKEN.test(t));

/** The two console plates as raw hex (inline styles, SVG). */
const CONSOLE_HEX = /#0F172A|#1E293B/i;

// The homepage keeps its own regal look (plan section 2).
const HOMEPAGE = ['src/pages/LandingPage.jsx', 'src/pages/LandingPage.css'];
// White chart canvases (data-canvas="chart"): the chart kit's fixed light
// classes and its ink-on-white colours, the same in both themes.
const CHART_KIT = ['src/components/charts/ChartFrame.jsx', 'src/components/charts/SvgChartFrame.jsx', 'src/utils/chartTheme.js'];
// Document canvases (data-canvas="document"): the certificate sheet and the
// printable handbook keep their designed artwork.
const DOCUMENTS = ['src/components/academy/CertificateView.jsx', 'src/pages/AdminCourseHandbookPage.jsx'];

describe('the import graph', () => {
  it('reaches the app from src/main.jsx', () => {
    expect(REACHABLE).toEqual(expect.arrayContaining([
      'src/App.jsx', 'src/components/Layout.jsx', 'src/pages/DashboardPage.jsx',
      'src/pages/apps/QraLearningPage.jsx', 'src/components/course/panels/qra/panelBits.jsx',
      'src/components/ui/button.jsx', 'src/index.css', 'src/design/theme.css',
    ]));
    expect(CODE.length).toBeGreaterThan(500);
    // lazy pages and lazy panels are followed
    expect(REACHABLE).toContain('src/components/course/panels/reservoircalc/PropertyExplorer.jsx');
  });
});

describe('every route renders inside a scope', () => {
  const app = read('src/App.jsx');
  const routes = [...app.matchAll(/<Route path="([^"]+)" element=\{(.+?)\} \/>/g)].map((m) => ({ path: m[1], element: m[2] }));
  const importOf = (name) => (app.match(new RegExp(`${name} = lazy\\(\\(\\) => import\\('@/([^']+)'\\)\\)|import ${name} from '@/([^']+)'`)) || []).slice(1).find(Boolean);
  const scopeOf = ({ path: p, element }) => {
    if (/<Layout>/.test(element)) return 'SignedInScope';
    const name = (element.match(/^<(\w+) \/>$/) || [])[1];
    if (!name) return 'unknown';
    if (name === 'LandingPage') return 'homepage';
    const file = `src/${importOf(name)}.jsx`;
    const src = read(file);
    if (/components\/public\/PublicPage|components\/legal\/LegalPageLayout/.test(src)) return 'PublicPage';
    return `unscoped (${p})`;
  };

  it('maps every App.jsx route to SignedInScope, PublicPage or the homepage', () => {
    expect(routes.length).toBe(17);
    const map = Object.fromEntries(routes.map((r) => [r.path, scopeOf(r)]));
    expect(map).toEqual({
      '/': 'homepage',
      '/login': 'PublicPage',
      '/register': 'PublicPage',
      '/verify': 'PublicPage',
      '/verify/:code': 'PublicPage',
      '/forgot-password': 'PublicPage',
      '/reset-password': 'PublicPage',
      '/privacy-policy': 'PublicPage',
      '/terms-of-service': 'PublicPage',
      '/academic-integrity': 'PublicPage',
      '/search': 'SignedInScope',
      '/dashboard/analytics': 'SignedInScope',
      '/dashboard/compliance': 'SignedInScope',
      '/dashboard/reports': 'SignedInScope',
      '/dashboard/certificates': 'SignedInScope',
      '/dashboard/*': 'SignedInScope',
      '*': 'PublicPage',
    });
    // every <Route> in the file was read
    expect((app.match(/<Route /g) || []).length).toBe(routes.length);
  });

  it('negative control: a bare page with no frame is reported as unscoped', () => {
    expect(scopeOf({ path: '/probe', element: '<DashboardPage />' })).toBe('unscoped (/probe)');
    expect(scopeOf({ path: '/probe', element: '<Foo><Bar /></Foo>' })).toBe('unknown');
  });

  it('Layout opens the signed-in scope on every route it serves, with no gate', () => {
    const layout = read('src/components/Layout.jsx');
    expect(layout).not.toMatch(/isThemedPath|useLocation|bg-\[#0F172A\]/);
    // both returns (the fullscreen one and the framed one) are scoped
    expect((layout.match(/<SignedInScope/g) || []).length).toBe(2);
    expect((layout.match(/return /g) || []).length).toBe(2);
    expect(legacyTokens(layout)).toEqual([]);
  });

  it('the legal frame is a PublicPage', () => {
    expect(read('src/components/legal/LegalPageLayout.jsx')).toMatch(/<PublicPage /);
  });

  it('the homepage uses no kit component and keeps its own stylesheet', () => {
    const home = read('src/pages/LandingPage.jsx');
    expect(home).not.toMatch(/@\/components\/ui\//);
    expect(home).toContain("import './LandingPage.css'");
    expect(home).toMatch(/className="ng-home/);
  });

  it('the pieces mounted at the app root carry a scope of their own', () => {
    // search modal and device guard: a fixed scope in the theme on screen, light where none
    for (const f of ['src/components/search/GlobalSearchModal.jsx', 'src/components/academy/DeviceGuard.jsx']) {
      expect({ f, fixed: /<FixedTheme theme=\{active \|\| 'light'\}>/.test(read(f)) }).toEqual({ f, fixed: true });
    }
    // toaster viewport
    expect(read('src/components/ui/toast.jsx')).toMatch(/data-pl-theme=\{active \|\| "light"\}/);
    // the loader and the error panel are scopes of their own
    expect(app).toMatch(/<ThemedLoadingScreen theme=\{coldLoadTheme\(/);
    expect(app).not.toMatch(/LegacyAppLoading|bg-\[#0F172A\]/);
    expect(read('src/components/ErrorBoundary.jsx')).toMatch(/data-pl-root/);
    // the rail and its phone drawer are fixed dark ink
    const rail = stripComments(read('src/components/Sidebar.jsx'));
    expect((rail.match(/data-pl-theme="dark"/g) || []).length).toBe(2);
    expect(rail).toMatch(/<FixedTheme theme="dark">/);
    // the certificate viewer chrome is a fixed dark scope; the sheet is a document
    const cert = read('src/components/academy/CertificateView.jsx');
    expect(cert).toMatch(/<FixedTheme theme="dark">/);
    expect(cert).toMatch(/id="certificate-sheet"\s+data-canvas="document"/);
  });
});

describe('the rollout plumbing is gone', () => {
  it('no registry, no scope-aware helper, no legacy fixture', () => {
    for (const gone of [
      'src/design/rollout', 'src/design/themeClass.js',
      'src/design/__tests__/legacyUi.test.jsx', 'src/design/__tests__/fixtures/legacyUiMarkup.json',
      'src/components/course/__tests__/courseKitLegacy.test.jsx',
      'src/components/course/panels/__tests__/rc3cPanelsLegacy.test.jsx',
      'src/components/__tests__/fixtures/frame1aLegacyMarkup.json',
    ]) {
      expect({ gone, exists: exists(gone) }).toEqual({ gone, exists: false });
    }
  });

  it('nothing reachable imports or calls the retired helpers', () => {
    const RETIRED = /useThemeClass|themeClassPicker|design\/themeClass|design\/rollout|THEMED_ROUTES|themedButtonVariants|themedBadgeVariants|themedAlertVariants|themedToastVariants/;
    const bad = CODE.filter((f) => RETIRED.test(stripComments(read(f))));
    expect(bad).toEqual([]);
    expect(RETIRED.test("import { useThemeClass } from '@/design/themeClass';")).toBe(true);
  });

  it('the ui kit has one branch: no piece asks whether it is inside a scope', () => {
    const kit = CODE.filter((f) => f.startsWith('src/components/ui/'));
    expect(kit.length).toBeGreaterThan(20);
    // the toggle is the one piece that reads the theme (to render and switch it)
    const asks = kit.filter((f) => /useDsTheme/.test(read(f)));
    expect(asks).toEqual(['src/components/ui/theme-toggle.jsx']);
  });
});

describe('no lime and no legacy console colour in reachable code', () => {
  it('lime is gone outside the homepage', () => {
    const hits = CODE.filter((f) => !HOMEPAGE.includes(f))
      .flatMap((f) => limeLines(read(f)).map((l) => `${f}: ${l.trim().slice(0, 120)}`));
    expect(hits).toEqual([]);
  });

  it('negative control: the lime detector sees the hex, the hover, a class and an SVG stroke, and skips comments', () => {
    expect(limeLines('<p className="text-[#BFFF00]">x</p>').length).toBe(1);
    expect(limeLines('const c = "hover:bg-[#A8E600]";').length).toBe(1);
    expect(limeLines('<i className="bg-lime-400" />').length).toBe(1);
    expect(limeLines("  lime: '#bfff00',").length).toBe(1);
    expect(limeLines('<circle stroke="#BFFF00" />').length).toBe(1);
    expect(limeLines('// the old lime #BFFF00 is retired\nconst a = 1; /* #BFFF00 */').length).toBe(0);
    expect(limeLines('const LITHS = ["limestone"]; // millimetres').length).toBe(0);
    // the homepage still has its own lime, so the allowance is doing work
    expect(limeLines(read('src/pages/LandingPage.css')).length).toBeGreaterThan(0);
  });

  it('legacy console colour classes are gone outside the homepage, chart canvases and documents', () => {
    const allowed = new Set([...HOMEPAGE, ...CHART_KIT, ...DOCUMENTS]);
    const hits = CODE.filter((f) => /\.jsx?$/.test(f) && !allowed.has(f))
      .flatMap((f) => legacyTokens(read(f)).map((t) => `${f}: ${t}`));
    expect(hits).toEqual([]);
  });

  it('the allowed files hold exactly the canvas colours named here', () => {
    // chart kit: fixed light classes on the white chart plate and its tooltip
    const chart = [...new Set(CHART_KIT.flatMap((f) => legacyTokens(read(f))))].sort();
    expect(chart).toEqual([
      'bg-white/90', 'bg-white/95', 'border-slate-200', 'border-slate-300',
      'hover:text-slate-800', 'text-slate-500', 'text-slate-600', 'text-slate-700',
    ]);
    // certificate: one spinner colour inside the sheet; the handbook has none
    expect(legacyTokens(read('src/components/academy/CertificateView.jsx'))).toEqual(['text-[#0F172A]/40']);
    expect(legacyTokens(read('src/pages/AdminCourseHandbookPage.jsx'))).toEqual([]);
  });

  it('negative control: the class detector sees console classes and skips roles, print styles and comments', () => {
    expect(legacyTokens('<div className="bg-[#1E293B] text-white border-slate-700 hover:bg-slate-800">'))
      .toEqual(['bg-[#1E293B]', 'text-white', 'border-slate-700', 'hover:bg-slate-800']);
    expect(legacyTokens('<div className="bg-pl-surface text-pl-text print:text-gray-800 dark:bg-slate-900">')).toEqual([]);
    expect(legacyTokens('// was bg-slate-900 text-white\n')).toEqual([]);
  });

  it('the console plates are gone as raw hex too, outside the chart kit and the documents', () => {
    const allowed = new Set([...HOMEPAGE, ...CHART_KIT, ...DOCUMENTS]);
    const hits = CODE.filter((f) => !allowed.has(f) && CONSOLE_HEX.test(stripComments(read(f))));
    expect(hits).toEqual([]);
    expect(CONSOLE_HEX.test('style={{ background: "#0f172a" }}')).toBe(true);
  });

  it('index.css and the page shell carry no dark default', () => {
    expect(read('src/index.css')).not.toMatch(/#0F172A|#1E293B|BFFF00/i);
    expect(read('index.html')).not.toMatch(/#0F172A|#1E293B|BFFF00/i);
  });
});
