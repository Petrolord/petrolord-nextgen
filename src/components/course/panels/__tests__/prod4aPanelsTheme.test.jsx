// @vitest-environment jsdom
//
// Batch 4A: the nine panels the production I learning pages render (nodal,
// gas lift, ESP), inside a design-system scope. Their only screens are their
// learning pages (4A) and the course reader and handbook (1C), all themed, so
// they are on roles with no legacy branch. Every view of every panel renders
// with no legacy console colour outside its charts in light and in dark,
// every chart sits in a white chart frame with the Petrolord mark, and the
// sources carry none of the old dark-plate colours. The detector is proven
// live with a negative control.
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, it, expect, afterEach, beforeAll, beforeEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import {
  expectNoLegacyChrome, expectNegativeControl, expectLightByDefault, expectToggleRoundTrip, getScopeRoot,
} from '@/design/testing/themeAssertions';
import { ThemedApp } from '@/design/ThemeProvider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import IprExplorer from '@/components/course/panels/nodal/IprExplorer';
import VlpExplorer from '@/components/course/panels/nodal/VlpExplorer';
import NodeExplorer from '@/components/course/panels/nodal/NodeExplorer';
import ColumnExplorer from '@/components/course/panels/gaslift/ColumnExplorer';
import ValveExplorer from '@/components/course/panels/gaslift/ValveExplorer';
import UnloadingExplorer from '@/components/course/panels/gaslift/UnloadingExplorer';
import StageExplorer from '@/components/course/panels/esp/StageExplorer';
import LiftExplorer from '@/components/course/panels/esp/LiftExplorer';
import PowerExplorer from '@/components/course/panels/esp/PowerExplorer';

const USER = 'prod4a-user';
const SCOPE = 'prod4a-scope';
const scoped = (el) => (
  <ThemedApp userId={USER} data-testid={SCOPE}>
    <ThemeToggle data-testid="theme-toggle" />
    {el}
  </ThemedApp>
);

const PANELS = [
  ['IprExplorer', IprExplorer], ['VlpExplorer', VlpExplorer], ['NodeExplorer', NodeExplorer],
  ['ColumnExplorer', ColumnExplorer], ['ValveExplorer', ValveExplorer], ['UnloadingExplorer', UnloadingExplorer],
  ['StageExplorer', StageExplorer], ['LiftExplorer', LiftExplorer], ['PowerExplorer', PowerExplorer],
];

const OLD_HEX = /BFFF00|A8E600|38bdf8|f97316|f472b6|ef4444|f43f5e|fb7185|34d399|e2e8f0|#0f172a|#1e293b/i;

const viewSelect = () => screen.getByText('View', { selector: 'label' }).nextElementSibling;

const expectChartsWhite = (scope) => {
  const frames = scope.querySelectorAll('[data-canvas="chart"]');
  for (const frame of frames) {
    expect(frame.className).toMatch(/\bbg-white\b/);
    expect(frame.querySelector('img')).not.toBeNull();
  }
  expect(scope.innerHTML).not.toMatch(OLD_HEX);
  return frames.length;
};

describe('production I panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('opens light, toggles to dark and back, and the detector is live', () => {
    render(scoped(<IprExplorer />));
    const scope = getScopeRoot(SCOPE);
    expectLightByDefault(scope);
    expectToggleRoundTrip(scope, { userId: USER });
    expectNegativeControl(scope);
  });

  for (const [name, Panel] of PANELS) {
    it(`${name}: every view is clean in light and in dark, charts white with the mark`, () => {
      render(scoped(<Panel />));
      const scope = getScopeRoot(SCOPE);
      const views = [...viewSelect().options].map((o) => o.value);
      expect(views.length).toBeGreaterThan(1);
      let frames = 0;
      for (const theme of ['light', 'dark']) {
        if (scope.getAttribute('data-pl-theme') !== theme) fireEvent.click(screen.getByTestId('theme-toggle'));
        expect(scope.getAttribute('data-pl-theme')).toBe(theme);
        for (const v of views) {
          fireEvent.change(viewSelect(), { target: { value: v } });
          expectNoLegacyChrome();
          frames += expectChartsWhite(scope);
        }
      }
      expect(frames).toBeGreaterThan(0);
    }, 60000);
  }

  it('status words keep their status roles (a dead scan row reads danger, beside its word)', () => {
    render(scoped(<NodeExplorer />));
    fireEvent.change(viewSelect(), { target: { value: 'resolution' } });
    const dead = screen.getAllByText(/^DEAD/, { selector: 'td' });
    expect(dead.length).toBeGreaterThan(0);
    for (const td of dead) expect(td.closest('tr').className).toMatch(/\btext-pl-danger-text\b/);
  });
});

describe('production I sources', () => {
  const root = path.resolve(__dirname, '../../../../..');
  const files = [
    ...['nodal', 'gaslift', 'esp'].flatMap((d) => fs.readdirSync(path.join(root, 'src/components/course/panels', d))
      .filter((f) => f.endsWith('.jsx')).map((f) => `src/components/course/panels/${d}/${f}`)),
    'src/pages/apps/NodalLearningPage.jsx', 'src/pages/apps/GasLiftLearningPage.jsx', 'src/pages/apps/EspLearningPage.jsx',
  ];

  it('carry no old dark-plate colour, no lime and no bare ResponsiveContainer', () => {
    expect(files.length).toBe(13);
    for (const f of files) {
      const src = fs.readFileSync(path.join(root, f), 'utf8');
      expect({ f, hex: OLD_HEX.test(src) }).toEqual({ f, hex: false });
      expect({ f, rc: /<ResponsiveContainer/.test(src) }).toEqual({ f, rc: false });
    }
  });

  it('no panel copy names a retired chart colour', () => {
    for (const f of files) {
      const src = fs.readFileSync(path.join(root, f), 'utf8');
      expect({ f, words: src.match(/\b(lime|orange|pink|sky)\b (line|curve|term|bound|column|columns|dot|bar|bars)\b/gi) })
        .toEqual({ f, words: null });
    }
  });
});
