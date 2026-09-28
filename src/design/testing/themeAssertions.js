// TEST-ONLY. Shared assertions for a screen's design-system theme test
// (docs/scope/DesignSystem-Rollout.md section 6). NextGen port of the
// Suite's src/design/testing/themeAssertions.js, on vitest. Every migrated
// screen checks the same four things:
//
//   1. it opens light inside the signed-in scope ([data-pl-root]);
//   2. the header toggle switches to dark and back, and the choice is stored
//      under the user's key (petrolord.theme.v1:<user id>);
//   3. no legacy console colour class is left under the scope outside
//      data-canvas regions, with a planted negative control so a detector
//      that finds nothing is not mistaken for a clean page;
//   4. the route is registered, so Layout opens the scope and the cold-load
//      loader paints the user's theme there.
//
// Never import this file from application code.
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { fireEvent, cleanup } from '@testing-library/react';
import { isThemedPath } from '../scopePaths.jsx';
import { themeStorageKey } from '../ThemeProvider.jsx';
import { SIGNED_IN_SCOPE_TEST_ID } from '../SignedInScope.jsx';
import { installDomShims } from './domShims.js';

// One class token (variants such as hover: or md: included) that paints a
// legacy console colour: any Tailwind palette colour on a colour utility,
// white text, a solid black or translucent white fill, gradients and hex
// colours (NextGen's #0F172A, #1E293B and #BFFF00 among them). A translucent
// black scrim (bg-black/50 behind dialogs) is theme neutral and is allowed.
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const UTILITY = 'bg|text|border(?:-[trblxy])?|ring|ring-offset|from|via|to|shadow|divide|placeholder|outline|fill|stroke|decoration|accent|caret';
export const LEGACY_CHROME_TOKEN = new RegExp(
  `^(?:[^:\\s]+:)*(?:(?:${UTILITY})-(?:${PALETTE})-\\d|text-white(?:\\/\\d+)?$|bg-black$|bg-white\\/|bg-gradient-|(?:${UTILITY})-\\[#)`,
);

const tokenIsLegacy = (token, allow) => {
  // `dark:` variants need a .dark ancestor, which NextGen never sets.
  if (token.startsWith('dark:')) return false;
  if (!LEGACY_CHROME_TOKEN.test(token)) return false;
  return !allow.some((a) => (a instanceof RegExp ? a.test(token) : a === token));
};

/** True when a class string carries at least one legacy console colour. */
export function hasLegacyChrome(classString, { allow = [] } = {}) {
  return String(classString || '').split(/\s+/).some((t) => t && tokenIsLegacy(t, allow));
}

/** Every [data-pl-theme] scope on the page (the screen root plus scoped portals). */
export function themeScopes(root = document.body) {
  const own = root.matches && root.matches('[data-pl-theme]') ? [root] : [];
  return [...own, ...root.querySelectorAll('[data-pl-theme]')];
}

/**
 * The class strings under a theme scope that still paint a legacy console
 * colour, skipping anything inside a `data-canvas` region (white charts,
 * dark canvases, printable documents). `allow` lists tokens (strings or
 * regexes) a screen keeps on purpose; name the reason next to it.
 */
export function legacyChromeClasses({ root = document.body, allow = [] } = {}) {
  const seen = new Set();
  const out = [];
  for (const scope of themeScopes(root)) {
    for (const el of [scope, ...scope.querySelectorAll('[class]')]) {
      if (seen.has(el)) continue;
      seen.add(el);
      if (el.closest('[data-canvas]')) continue;
      const cls = el.getAttribute('class');
      if (cls && hasLegacyChrome(cls, { allow })) out.push(cls);
    }
  }
  return out;
}

/** The scope root: the signed-in scope by test id, else the first [data-pl-root]. */
export function getScopeRoot(scopeTestId = SIGNED_IN_SCOPE_TEST_ID) {
  let el = document.querySelector(`[data-testid="${scopeTestId}"]`) || document.querySelector('[data-pl-root]');
  if (el && !el.hasAttribute('data-pl-root')) el = el.closest('[data-pl-root]');
  if (!el) throw new Error('No design-system scope root found: is the screen mounted inside Layout (or SignedInScope) on a registered route?');
  return el;
}

/** 1. The screen opens light inside a [data-pl-root] scope. */
export function expectLightByDefault(scope = getScopeRoot()) {
  expect(scope.hasAttribute('data-pl-root')).toBe(true);
  expect(scope.getAttribute('data-pl-theme')).toBe('light');
}

const toggleIn = (scope) => {
  const all = scope.querySelectorAll('[data-testid="theme-toggle"]');
  if (!all.length) throw new Error('No ThemeToggle (data-testid="theme-toggle") inside the scope: the toggle must be visible in the header.');
  return all[0];
};

/**
 * 2. The toggle switches to dark and back, aria-pressed follows, and the
 * choice is stored under the user's key.
 */
export function expectToggleRoundTrip(scope = getScopeRoot(), { userId = null } = {}) {
  const key = themeStorageKey(userId);
  expect(scope.getAttribute('data-pl-theme')).toBe('light');
  expect(toggleIn(scope).getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(toggleIn(scope));
  expect(scope.getAttribute('data-pl-theme')).toBe('dark');
  expect(toggleIn(scope).getAttribute('aria-pressed')).toBe('true');
  expect(window.localStorage.getItem(key)).toBe('dark');
  fireEvent.click(toggleIn(scope));
  expect(scope.getAttribute('data-pl-theme')).toBe('light');
  expect(toggleIn(scope).getAttribute('aria-pressed')).toBe('false');
  expect(window.localStorage.getItem(key)).toBe('light');
}

/** 3. No legacy console colour under the scope outside data-canvas regions. */
export function expectNoLegacyChrome({ root = document.body, allow = [] } = {}) {
  expect(themeScopes(root).length).toBeGreaterThan(0);
  expect(legacyChromeClasses({ root, allow })).toEqual([]);
}

/**
 * 3b. Negative control: a legacy class planted under the scope root is
 * reported, and one planted inside a data-canvas region is not. The plants
 * are removed again.
 */
export function expectNegativeControl(scope = getScopeRoot(), { allow = [] } = {}) {
  const planted = 'bg-[#1E293B] text-white legacy-negative-control';
  const inCanvas = 'text-slate-300 legacy-negative-control-canvas';
  const bad = document.createElement('div');
  bad.className = planted;
  const canvas = document.createElement('div');
  canvas.setAttribute('data-canvas', 'dark');
  const inner = document.createElement('span');
  inner.className = inCanvas;
  canvas.appendChild(inner);
  scope.appendChild(bad);
  scope.appendChild(canvas);
  try {
    const found = legacyChromeClasses({ root: scope, allow });
    expect(found).toContain(planted);
    expect(found).not.toContain(inCanvas);
  } finally {
    bad.remove();
    canvas.remove();
  }
  expect(legacyChromeClasses({ root: scope, allow })).not.toContain(planted);
}

/** 4. The route is registered, so Layout opens the scope there. */
export function expectThemedPath(route) {
  expect({ route, themed: isThemedPath(route) }).toEqual({ route, themed: true });
}

/**
 * The standard checks as one describe block, in a screen's
 * `<Screen>.theme.test.jsx` (with `// @vitest-environment jsdom` first):
 *
 *   describeScreenTheme({
 *     name: 'Enroll',
 *     route: '/dashboard/enroll',
 *     renderScreen: () => renderSignedIn(<EnrollPage />, { route: '/dashboard/enroll' }),
 *     ready: () => screen.findByText('Enroll'),
 *     userId: 'u-1',
 *   });
 *
 * renderScreen mounts the screen as its route does: inside Layout, whose
 * header carries the toggle (see the pilot test for a harness). ready
 * (optional, may be async) waits for the first screen. userId is the user
 * the scope resolves, for the storage key; allow lists deliberate legacy
 * tokens. Further states (tabs, dialogs, results) go in the screen's own
 * tests with expectNoLegacyChrome().
 */
export function describeScreenTheme({
  name, route, renderScreen, ready, userId = null, allow = [],
}) {
  describe(`${name} on the design system`, () => {
    beforeAll(installDomShims);
    beforeEach(() => {
      try { window.localStorage.clear(); } catch { /* storage unavailable */ }
    });
    afterEach(cleanup);

    const mount = async () => {
      renderScreen();
      if (ready) await ready();
      return getScopeRoot();
    };

    it('opens light inside the signed-in scope', async () => {
      expectLightByDefault(await mount());
    });

    it('the header toggle switches to dark and back and stores the choice', async () => {
      expectToggleRoundTrip(await mount(), { userId });
    });

    it('leaves no legacy console colour outside canvases (with a negative control)', async () => {
      const scope = await mount();
      expectNoLegacyChrome({ allow });
      expectNegativeControl(scope, { allow });
    });

    it(`registers ${route} in the rollout`, () => {
      expectThemedPath(route);
    });
  });
}
