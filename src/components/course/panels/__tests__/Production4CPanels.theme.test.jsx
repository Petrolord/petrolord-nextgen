// @vitest-environment jsdom
//
// Batch 4C (docs/scope/DesignSystem-Rollout.md): the nine teaching panels
// of the production III courses (network, intervention, surveillance) and
// the typed network fields. Their hosts are the learning pages (4C), the
// lesson reader and the handbook (1C), all inside a scope now, so the
// panels moved straight to theme roles.
//
// Inside a scope, in light and dark, every view of every panel (and every
// sub-view a view offers) renders roles only outside its plots, every plot
// sits in ChartFrame (the white chart plate with the Petrolord chart mark),
// and every series and guide line is a chart kit colour: seriesColor(n)
// (the oil, water and gas stream colours are among them), the ink note or
// the grey reference. Retired console lime and the old dark-plate hues are
// gone. A source scan covers the branches a default render does not reach.
//
// Recharts' ResponsiveContainer measures nothing in jsdom, so it is replaced
// here by a fixed 640 px size; everything else in recharts is real.
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { ThemedApp, themeStorageKey } from '@/design/ThemeProvider';
import { installDomShims } from '@/design/testing/domShims';
import { legacyChromeClasses, hasLegacyChrome } from '@/design/testing/themeAssertions';
import { CHART_SERIES, SVG_CHART } from '@/utils/chartSvg';
import { CHART_COLORS } from '@/utils/chartTheme';
import { PANELS } from '@/content/courses/panelRegistry';

import TrunkExplorer from '@/components/course/panels/network/TrunkExplorer';
import NetworkExplorer from '@/components/course/panels/network/NetworkExplorer';
import FightExplorer from '@/components/course/panels/network/FightExplorer';
import DiagnosticExplorer from '@/components/course/panels/intervention/DiagnosticExplorer';
import ChannelExplorer from '@/components/course/panels/intervention/ChannelExplorer';
import CandidateExplorer from '@/components/course/panels/intervention/CandidateExplorer';
import LedgerExplorer from '@/components/course/panels/surveillance/LedgerExplorer';
import ExceptionExplorer from '@/components/course/panels/surveillance/ExceptionExplorer';
import ReadingExplorer from '@/components/course/panels/surveillance/ReadingExplorer';

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  const R = await import('react');
  return {
    ...actual,
    ResponsiveContainer: ({ children, height }) => R.cloneElement(children, {
      width: 640, height: typeof height === 'number' ? height : 240,
    }),
  };
});

const PROD_PANELS = {
  'pd-trunk-explorer': TrunkExplorer,
  'pd-network-explorer': NetworkExplorer,
  'pd-fight-explorer': FightExplorer,
  'pd-diagnostic-explorer': DiagnosticExplorer,
  'pd-channel-explorer': ChannelExplorer,
  'pd-candidate-explorer': CandidateExplorer,
  'pd-ledger-explorer': LedgerExplorer,
  'pd-exception-explorer': ExceptionExplorer,
  'pd-reading-explorer': ReadingExplorer,
};

const DIRS = ['network', 'intervention', 'surveillance'];
const PANEL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFiles = () => DIRS.flatMap((d) => fs.readdirSync(path.join(PANEL_DIR, d))
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => path.join(PANEL_DIR, d, f)));

// What a line, bar or reference line may be drawn in on the white plate.
const KIT_STROKES = new Set([...CHART_SERIES, SVG_CHART.note, SVG_CHART.reference].map((c) => c.toLowerCase()));
// The old dark-plate colours: lime, sky, orange, pink, the slate ticks and
// the dark tooltip. (#334155, the old grid, is the kit's tick ink on white;
// the grid check below proves the grid moved.)
const RETIRED = /#(bfff00|38bdf8|f97316|f472b6|94a3b8|0f172a)\b/i;

const viewSelects = (container) => [...container.querySelectorAll('select')]
  .filter((s) => s.parentElement.textContent.startsWith('View'));
const viewSelect = (container) => viewSelects(container)[0];

const seriesStrokes = () => [
  ...document.querySelectorAll('.recharts-line-curve, .recharts-reference-line-line, .recharts-rectangle'),
].map((el) => (el.getAttribute('stroke') || el.getAttribute('fill') || '').toLowerCase()).filter((c) => c && c !== 'none');

describe('the production III teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the three production III courses', () => {
    const registry = fs.readFileSync(path.resolve(PANEL_DIR, '../../../content/courses/panelRegistry.js'), 'utf8');
    const ids = [...registry.matchAll(/'([a-z0-9-]+)':\s*React\.lazy\(\(\) => import\('@\/components\/course\/panels\/([a-z]+)\//g)]
      .filter((m) => DIRS.includes(m[2])).map((m) => m[1]);
    expect(Object.keys(PROD_PANELS).sort()).toEqual(ids.sort());
    for (const id of ids) expect(PANELS[id]).toBeTruthy();
  });

  it('the source carries no legacy colour class and no retired chart colour in any branch', () => {
    const scan = (src) => src.replace(/[`'"{}()$]/g, ' ').split(/\s+/).filter((t) => t && hasLegacyChrome(t));
    // negative control: a pre-4C conditional class and a lime stroke are caught
    expect(scan("<td className={r.strictEqualityHolds ? '' : 'text-[#f97316]'}>"))
      .toEqual(['text-[#f97316]']);
    expect(RETIRED.test('<Line dataKey="tr" stroke="#BFFF00" />')).toBe(true);
    const files = sourceFiles();
    expect(files.length).toBe(10); // 9 panels and the typed network fields
    for (const file of files) {
      const src = fs.readFileSync(file, 'utf8');
      // every whitespace-separated token of the file, with quotes, braces and
      // template markers stripped, so conditional class branches are seen too
      const legacy = scan(src);
      expect({ file: path.basename(file), legacy }).toEqual({ file: path.basename(file), legacy: [] });
      expect({ file: path.basename(file), retired: RETIRED.test(src) }).toEqual({ file: path.basename(file), retired: false });
      expect(src).not.toMatch(/ResponsiveContainer/);
    }
  });

  for (const theme of ['light', 'dark']) {
    for (const [id, Panel] of Object.entries(PROD_PANELS)) {
      it(`${id} (${theme}): every view on roles, every plot on the white plate in kit colours`, () => {
        window.localStorage.setItem(themeStorageKey('u-4c'), theme);
        const { container } = render(<ThemedApp userId="u-4c"><Panel /></ThemedApp>);
        expect(document.querySelector('[data-pl-root]').getAttribute('data-pl-theme')).toBe(theme);
        // every panel has a View select; some views carry a second one
        const views = [...viewSelect(container).options].map((o) => o.value);
        let plots = 0;
        const check = (view) => {
          expect({ view, legacy: legacyChromeClasses() }).toEqual({ view, legacy: [] });
          for (const svg of document.querySelectorAll('svg.recharts-surface')) {
            plots += 1;
            const plate = svg.closest('[data-canvas="chart"]');
            expect(plate).toBeTruthy();
            expect(plate.className).toContain('bg-white');
            expect(plate.querySelector('img[alt]')).toBeTruthy();
            expect(svg.outerHTML).not.toMatch(RETIRED);
          }
          for (const c of seriesStrokes()) expect({ view, c, kit: KIT_STROKES.has(c) }).toEqual({ view, c, kit: true });
          // no dark tooltip or console grid left behind
          expect(document.body.innerHTML).not.toMatch(/background: rgb\(15, 23, 42\)/);
          expect([...document.querySelectorAll('.recharts-cartesian-grid line')]
            .every((l) => l.getAttribute('stroke') === CHART_COLORS.grid)).toBe(true);
        };
        for (const view of views) {
          fireEvent.change(viewSelect(container), { target: { value: view } });
          check(view);
          const sub = viewSelects(container)[1];
          if (sub) {
            for (const v of [...sub.options].map((o) => o.value)) {
              fireEvent.change(viewSelects(container)[1], { target: { value: v } });
              check(`${view}/${v}`);
            }
          }
        }
        expect(plots).toBeGreaterThan(0);
      });
    }
  }
});
