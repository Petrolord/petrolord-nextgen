/**
 * Design system tokens (NextGen port): the values match the Suite's, WCAG
 * AA contrast holds in both themes, theme.css is in step with tokens.js,
 * and every generated rule is scoped so screens that have not opted in are
 * untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import * as tokens from '@/design/tokens';
import { renderThemeCss } from '@/design/themeCss';

const {
  THEMES, CONTRAST_PAIRS, SHADCN_ALIASES, contrastRatio, hexToHslTriplet, hslTripletToHex,
} = tokens;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// sha256 of every value in the Suite's src/design/tokens.js at
// Petrolord/petrolord-suite main e7807a1da (2026-09-28). The family is one
// palette: change the Suite's tokens first, copy the file here, then update
// this digest to the one this test prints.
const SUITE_TOKENS_DIGEST = 'baee339265dad9206f7b83d6465dbdf5332480df40a4eed73dafe33d958c6c7f';

function tokensDigest(t) {
  const payload = JSON.stringify({
    THEMES: t.THEMES,
    SHADCN_ALIASES: t.SHADCN_ALIASES,
    CHART_SERIES: t.CHART_SERIES,
    CHART_SURFACE: t.CHART_SURFACE,
    FONTS: t.FONTS,
    SHADOWS: t.SHADOWS,
    RADII: t.RADII,
    CANVAS_RADIUS: t.CANVAS_RADIUS,
    BRAND: t.BRAND,
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

describe('one family with the Suite', () => {
  it('every token value matches the Suite (pinned digest)', () => {
    expect(tokensDigest(tokens)).toBe(SUITE_TOKENS_DIGEST);
  });

  it('the digest notices a one-character change (negative control)', () => {
    const changed = { ...tokens, THEMES: { ...THEMES, light: { ...THEMES.light, bg: '#E1E4E9' } } };
    expect(tokensDigest(changed)).not.toBe(SUITE_TOKENS_DIGEST);
  });

  it('uses the grey panel neutrals in light (owner decision, 2026-09-28)', () => {
    expect(THEMES.light).toMatchObject({
      bg: '#E1E4E8',
      surface: '#EDEFF2',
      raised: '#F8F9FA',
      sunken: '#D8DCE1',
      border: '#C3C9D0',
      'border-strong': '#6E7883',
      muted: '#4D5761',
    });
    expect(THEMES.light.primary).toBe('#2F6B48');
  });

  it('takes gold and ink from the brand pack the regal homepage uses', () => {
    const home = read('src/pages/LandingPage.css');
    expect(home).toMatch(/--gold:#C8A24E/);
    expect(home).toMatch(/--ink:#0C1F16/);
    expect(THEMES.light.accent).toBe('#C8A24E');
    expect(THEMES.dark.surface).toBe('#0C1F16');
  });
});

describe('colour roles', () => {
  it('both themes define exactly the same roles', () => {
    expect(Object.keys(THEMES.dark).sort()).toEqual(Object.keys(THEMES.light).sort());
  });

  for (const theme of ['light', 'dark']) {
    describe(`${theme} theme contrast (WCAG 2.1 AA)`, () => {
      it.each(CONTRAST_PAIRS)('%s on %s is at least %s:1', (fg, bg, min) => {
        const t = THEMES[theme];
        expect(t[fg]).toBeDefined();
        expect(t[bg]).toBeDefined();
        expect(contrastRatio(t[fg], t[bg])).toBeGreaterThanOrEqual(min);
      });
    });
  }

  it('keeps AA after rounding to the HSL triplets the shadcn variables use', () => {
    for (const theme of ['light', 'dark']) {
      const t = THEMES[theme];
      const viaHsl = Object.fromEntries(
        Object.entries(t).map(([k, hex]) => [k, hslTripletToHex(hexToHslTriplet(hex))]),
      );
      for (const [fg, bg, min] of CONTRAST_PAIRS) {
        expect(contrastRatio(viaHsl[fg], viaHsl[bg])).toBeGreaterThanOrEqual(min);
      }
    }
  });

  it('computes the reference ratios correctly', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
  });

  it('maps every shadcn alias to a real role', () => {
    for (const role of Object.values(SHADCN_ALIASES)) {
      expect(THEMES.light[role]).toBeDefined();
    }
  });

  it('re-points every shadcn variable NextGen index.css defines', () => {
    const index = read('src/index.css');
    const rootBlock = index.slice(index.indexOf(':root {'), index.indexOf('}', index.indexOf(':root {')));
    const defined = [...rootBlock.matchAll(/--([a-z-]+):/g)].map((m) => m[1])
      .filter((k) => !k.startsWith('video-') && k !== 'radius');
    for (const k of defined) expect(SHADCN_ALIASES[k], `--${k}`).toBeDefined();
  });
});

describe('theme.css', () => {
  const css = read('src/design/theme.css');

  it('is the generated output of tokens.js (run scripts/design/build-theme-css.mjs)', () => {
    expect(css).toBe(renderThemeCss());
  });

  it('scopes every rule under [data-pl-theme], so it is inert outside the scope', () => {
    const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const selectorGroups = [...noComments.matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim());
    expect(selectorGroups.length).toBeGreaterThan(0);
    for (const group of selectorGroups) {
      for (const sel of group.split(',').map((s) => s.trim()).filter(Boolean)) {
        expect(sel).toMatch(/^(:where\()?\[data-pl-(theme|root)/);
      }
    }
    expect(noComments).not.toMatch(/(^|[\s,}]):root\b/);
    expect(noComments).not.toMatch(/(^|[\s,}])\.dark\b/);
    expect(noComments).not.toMatch(/(^|[\s,}])(body|html)\b/);
  });

  it('keeps dark canvases dark and chart surfaces white inside the scope', () => {
    expect(css).toMatch(/\[data-pl-theme\] \[data-canvas="dark"\]/);
    expect(css).toMatch(/\[data-pl-theme\] \[data-canvas="chart"\]/);
    expect(css).toMatch(/\[data-canvas="chart"\]\) \{\n  background-color: rgb\(var\(--pl-chart-surface\)\)/);
  });

  it('is imported once, after index.css, from main.jsx', () => {
    const main = read('src/main.jsx');
    expect(main.indexOf("import './design/theme.css'")).toBeGreaterThan(main.indexOf("import './index.css'"));
  });
});

describe('tailwind wiring', () => {
  it('exposes every role as a pl-* colour and leaves the legacy colour keys alone', () => {
    const cfg = read('tailwind.config.js');
    const listed = [...cfg.match(/const PL_ROLES = \[([\s\S]*?)\];/)[1].matchAll(/'([a-z-]+)'/g)].map((m) => m[1]);
    expect(listed.sort()).toEqual([...Object.keys(THEMES.light), 'chart-surface'].sort());
    expect(cfg).toMatch(/background: 'hsl\(var\(--background\)\)'/);
    expect(cfg).toMatch(/'pl-canvas': 'var\(--pl-radius-canvas, 0\.5rem\)'/);
  });
});
