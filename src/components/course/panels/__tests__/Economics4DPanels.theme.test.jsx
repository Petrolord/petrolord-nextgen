// @vitest-environment jsdom
//
// Batch 4D (docs/scope/DesignSystem-Rollout.md): the eighteen teaching
// panels of the economics courses (cash flow, fiscal, uncertainty, decision,
// portfolio, FDP), with the fiscal definitions list and the decision kit.
// Their hosts are the learning pages (4D), the lesson reader and the
// handbook (1C), all inside a scope now, so the panels moved straight to
// theme roles.
//
// Inside a scope, in light and dark, every view of every panel (and every
// sub-view a view offers) renders roles only outside its plots, every plot
// sits in ChartFrame (the white chart plate with the Petrolord chart mark),
// and every series and guide line is a chart kit colour: seriesColor(n), the
// ink note or the grey reference. Retired console lime and the old
// dark-plate hues are gone. A source scan covers the branches a default
// render does not reach.
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

import LedgerExplorer from '@/components/course/panels/cashflow/LedgerExplorer';
import TimeExplorer from '@/components/course/panels/cashflow/TimeExplorer';
import FiscalExplorer from '@/components/course/panels/cashflow/FiscalExplorer';
import RegimeExplorer from '@/components/course/panels/fiscal/RegimeExplorer';
import InstrumentExplorer from '@/components/course/panels/fiscal/InstrumentExplorer';
import ComparisonExplorer from '@/components/course/panels/fiscal/ComparisonExplorer';
import ScreeningExplorer from '@/components/course/panels/uncertainty/ScreeningExplorer';
import BreakevenExplorer from '@/components/course/panels/uncertainty/BreakevenExplorer';
import RiskExplorer from '@/components/course/panels/uncertainty/RiskExplorer';
import TreeExplorer from '@/components/course/panels/decision/TreeExplorer';
import InformationExplorer from '@/components/course/panels/decision/InformationExplorer';
import JudgementExplorer from '@/components/course/panels/decision/JudgementExplorer';
import CapitalExplorer from '@/components/course/panels/portfolio/CapitalExplorer';
import CostExplorer from '@/components/course/panels/portfolio/CostExplorer';
import GovernanceExplorer from '@/components/course/panels/portfolio/GovernanceExplorer';
import PlanExplorer from '@/components/course/panels/fdp/PlanExplorer';
import ScheduleExplorer from '@/components/course/panels/fdp/ScheduleExplorer';
import ValueExplorer from '@/components/course/panels/fdp/ValueExplorer';
import FiscalDefinitions from '@/components/course/panels/fiscal/FiscalDefinitions';

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

const ECON_PANELS = {
  'ec-ledger-explorer': LedgerExplorer,
  'ec-time-explorer': TimeExplorer,
  'ec-fiscal-explorer': FiscalExplorer,
  'ec-regime-explorer': RegimeExplorer,
  'ec-instrument-explorer': InstrumentExplorer,
  'ec-comparison-explorer': ComparisonExplorer,
  'ec-screening-explorer': ScreeningExplorer,
  'ec-breakeven-explorer': BreakevenExplorer,
  'ec-risk-explorer': RiskExplorer,
  'ec-tree-explorer': TreeExplorer,
  'ec-information-explorer': InformationExplorer,
  'ec-judgement-explorer': JudgementExplorer,
  'ec-capital-explorer': CapitalExplorer,
  'ec-cost-explorer': CostExplorer,
  'ec-governance-explorer': GovernanceExplorer,
  'ec-plan-explorer': PlanExplorer,
  'ec-schedule-explorer': ScheduleExplorer,
  'ec-value-explorer': ValueExplorer,
};
// The two panels that teach from tables and words alone draw no plot.
const NO_PLOT = new Set(['ec-judgement-explorer', 'ec-governance-explorer']);

// panel directory: number of .jsx source files (panels plus helpers)
const DIRS = { cashflow: 3, fiscal: 4, uncertainty: 3, decision: 4, portfolio: 3, fdp: 3 };
const PANEL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFiles = () => Object.keys(DIRS).flatMap((d) => fs.readdirSync(path.join(PANEL_DIR, d))
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => path.join(PANEL_DIR, d, f)));

// What a line, bar, dot or reference line may be drawn in on the white plate.
const KIT_STROKES = new Set([...CHART_SERIES, SVG_CHART.note, SVG_CHART.reference].map((c) => c.toLowerCase()));
// The old dark-plate colours: lime, sky, orange, yellow, red, pink, violet,
// emerald, the slate ticks and the dark tooltip.
const RETIRED = /#(bfff00|38bdf8|f97316|fbbf24|f87171|f472b6|a78bfa|34d399|94a3b8|0f172a|1e293b)\b/i;

const viewSelects = (container) => [...container.querySelectorAll('select')]
  .filter((s) => s.parentElement.textContent.startsWith('View'));

const seriesStrokes = () => [
  ...document.querySelectorAll('.recharts-line-curve, .recharts-reference-line-line, .recharts-rectangle, .recharts-reference-dot-dot, .recharts-dot'),
].map((el) => (el.getAttribute('stroke') || el.getAttribute('fill') || '').toLowerCase())
  .filter((c) => c && c !== 'none' && c !== '#fff' && c !== '#ffffff');

describe('the economics teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the migrated economics courses', () => {
    const registry = fs.readFileSync(path.resolve(PANEL_DIR, '../../../content/courses/panelRegistry.js'), 'utf8');
    const ids = [...registry.matchAll(/'([a-z0-9-]+)':\s*React\.lazy\(\(\) => import\('@\/components\/course\/panels\/([a-z]+)\//g)]
      .filter((m) => Object.keys(DIRS).includes(m[2])).map((m) => m[1]);
    expect(Object.keys(ECON_PANELS).sort()).toEqual(ids.sort());
    for (const id of ids) expect(PANELS[id]).toBeTruthy();
  });

  it('the source carries no legacy colour class and no retired chart colour in any branch', () => {
    const scan = (src) => src.replace(/[`'"{}()$]/g, ' ').split(/\s+/).filter((t) => t && hasLegacyChrome(t));
    // negative control: a pre-4D conditional class and a lime cell are caught
    expect(scan("<span className={r.isVolume ? 'border-emerald-700 text-emerald-300' : ''}>"))
      .toEqual(['border-emerald-700', 'text-emerald-300']);
    expect(RETIRED.test("<Cell fill={b.take > 100 ? '#f87171' : '#BFFF00'} />")).toBe(true);
    const files = sourceFiles();
    expect(files.length).toBe(Object.values(DIRS).reduce((a, b) => a + b, 0));
    for (const file of files) {
      const src = fs.readFileSync(file, 'utf8');
      const legacy = scan(src);
      expect({ file: path.basename(file), legacy }).toEqual({ file: path.basename(file), legacy: [] });
      expect({ file: path.basename(file), retired: RETIRED.test(src) }).toEqual({ file: path.basename(file), retired: false });
      expect(src).not.toMatch(/ResponsiveContainer/);
    }
  });

  for (const theme of ['light', 'dark']) {
    for (const [id, Panel] of Object.entries(ECON_PANELS)) {
      it(`${id} (${theme}): every view on roles, every plot on the white plate in kit colours`, () => {
        window.localStorage.setItem(themeStorageKey('u-4d'), theme);
        const { container } = render(<ThemedApp userId="u-4d"><Panel /></ThemedApp>);
        expect(document.querySelector('[data-pl-root]').getAttribute('data-pl-theme')).toBe(theme);
        const first = viewSelects(container)[0];
        const views = first ? [...first.options].map((o) => o.value) : [null];
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
          expect(document.body.innerHTML).not.toMatch(/bfff00/i);
        };
        for (const view of views) {
          if (view !== null) fireEvent.change(viewSelects(container)[0], { target: { value: view } });
          check(view);
          const sub = viewSelects(container)[1];
          if (sub) {
            for (const v of [...sub.options].map((o) => o.value)) {
              fireEvent.change(viewSelects(container)[1], { target: { value: v } });
              check(`${view}/${v}`);
            }
          }
        }
        if (NO_PLOT.has(id)) expect(plots).toBe(0);
        else expect(plots).toBeGreaterThan(0);
      }, 300000);
    }

    it(`the fiscal definitions list (${theme}) is on roles`, () => {
      window.localStorage.setItem(themeStorageKey('u-4d'), theme);
      render(<ThemedApp userId="u-4d"><FiscalDefinitions /></ThemedApp>);
      expect(legacyChromeClasses()).toEqual([]);
      expect(document.querySelector('dt').className).toContain('text-pl-primary-text');
    });
  }
});
