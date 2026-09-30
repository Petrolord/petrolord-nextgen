// @vitest-environment jsdom
//
// Batch 5D (docs/scope/DesignSystem-Rollout.md): the twenty-four teaching
// panels of the data and AI courses (data quality, ML core, facies, forecast
// ML, applied AI) and of crude, refinery and supply, with each course's panel
// bits. Their hosts are the learning pages (5D), the lesson reader and the
// handbook (1C), all inside a scope, so the panels moved straight to theme
// roles.
//
// Inside a scope, in light and dark, every view of every panel renders roles
// only outside its plots, every plot sits in ChartFrame (the white chart
// plate with the Petrolord chart mark), and every series and guide line is a
// chart kit colour: seriesColor(n), the ink note or the grey reference.
// Retired console lime and the old dark-plate hues are gone. A source scan
// covers the branches a default render does not reach.
//
// Recharts' ResponsiveContainer measures nothing in jsdom, so it is replaced
// here by a fixed 640 px size; everything else in recharts is real.
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import { ThemedApp, themeStorageKey } from '@/design/ThemeProvider';
import { installDomShims } from '@/design/testing/domShims';
import { legacyChromeClasses, hasLegacyChrome } from '@/design/testing/themeAssertions';
import { CHART_SERIES, SVG_CHART } from '@/utils/chartSvg';
import { CHART_COLORS } from '@/utils/chartTheme';
import { PANELS } from '@/content/courses/panelRegistry';

import DataqcChecksExplorer from '@/components/course/panels/dataqc/ChecksExplorer';
import DataqcOutliersExplorer from '@/components/course/panels/dataqc/OutliersExplorer';
import DataqcMonitorExplorer from '@/components/course/panels/dataqc/MonitorExplorer';
import MlcoreFitExplorer from '@/components/course/panels/mlcore/FitExplorer';
import MlcoreValidateExplorer from '@/components/course/panels/mlcore/ValidateExplorer';
import MlcoreDiagnoseExplorer from '@/components/course/panels/mlcore/DiagnoseExplorer';
import FaciesClusterExplorer from '@/components/course/panels/facies/ClusterExplorer';
import FaciesJudgeExplorer from '@/components/course/panels/facies/JudgeExplorer';
import FaciesClassifyExplorer from '@/components/course/panels/facies/ClassifyExplorer';
import ForecastmlSmoothingExplorer from '@/components/course/panels/forecastml/SmoothingExplorer';
import ForecastmlBacktestExplorer from '@/components/course/panels/forecastml/BacktestExplorer';
import ForecastmlUncertaintyExplorer from '@/components/course/panels/forecastml/UncertaintyExplorer';
import AppliedaiRetrievalExplorer from '@/components/course/panels/appliedai/RetrievalExplorer';
import AppliedaiScoringExplorer from '@/components/course/panels/appliedai/ScoringExplorer';
import AppliedaiTrustExplorer from '@/components/course/panels/appliedai/TrustExplorer';
import CrudeAssayExplorer from '@/components/course/panels/crude/AssayExplorer';
import CrudeValuationExplorer from '@/components/course/panels/crude/ValuationExplorer';
import CrudeRecipeExplorer from '@/components/course/panels/crude/RecipeExplorer';
import RefineryScreenExplorer from '@/components/course/panels/refinery/ScreenExplorer';
import RefineryPlanExplorer from '@/components/course/panels/refinery/PlanExplorer';
import RefineryVarianceExplorer from '@/components/course/panels/refinery/VarianceExplorer';
import SupplyTankExplorer from '@/components/course/panels/supply/TankExplorer';
import SupplyDepotExplorer from '@/components/course/panels/supply/DepotExplorer';
import SupplyPriceExplorer from '@/components/course/panels/supply/PriceExplorer';

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

const BATCH_PANELS = {
  'dq-checks-explorer': DataqcChecksExplorer,
  'dq-outliers-explorer': DataqcOutliersExplorer,
  'dq-monitor-explorer': DataqcMonitorExplorer,
  'ml-fit-explorer': MlcoreFitExplorer,
  'ml-validate-explorer': MlcoreValidateExplorer,
  'ml-diagnose-explorer': MlcoreDiagnoseExplorer,
  'ef-cluster-explorer': FaciesClusterExplorer,
  'ef-judge-explorer': FaciesJudgeExplorer,
  'ef-classify-explorer': FaciesClassifyExplorer,
  'pf-smoothing-explorer': ForecastmlSmoothingExplorer,
  'pf-backtest-explorer': ForecastmlBacktestExplorer,
  'pf-uncertainty-explorer': ForecastmlUncertaintyExplorer,
  'ae-retrieval-explorer': AppliedaiRetrievalExplorer,
  'ae-scoring-explorer': AppliedaiScoringExplorer,
  'ae-trust-explorer': AppliedaiTrustExplorer,
  'crude-assay-explorer': CrudeAssayExplorer,
  'crude-valuation-explorer': CrudeValuationExplorer,
  'crude-recipe-explorer': CrudeRecipeExplorer,
  'refinery-screen-explorer': RefineryScreenExplorer,
  'refinery-plan-explorer': RefineryPlanExplorer,
  'refinery-variance-explorer': RefineryVarianceExplorer,
  'supply-tank-explorer': SupplyTankExplorer,
  'supply-depot-explorer': SupplyDepotExplorer,
  'supply-price-explorer': SupplyPriceExplorer,
};
// The panels that teach from tables and words alone draw no plot.
const NO_PLOT = new Set([
  'dq-checks-explorer',
  'ml-fit-explorer',
  'ml-diagnose-explorer',
  'ef-cluster-explorer',
  'ef-judge-explorer',
  'ef-classify-explorer',
  'pf-smoothing-explorer',
  'pf-backtest-explorer',
  'pf-uncertainty-explorer',
  'ae-retrieval-explorer',
  'ae-scoring-explorer',
  'ae-trust-explorer',
]);
// No panel here awaits the engine; the set stays for a panel that does later.
const ASYNC = new Set();
const settle = async () => {
  let last = -1;
  for (let i = 0; i < 240; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await act(() => new Promise((r) => { setTimeout(r, 250); }));
    const now = document.body.innerHTML.length;
    if (now === last) return;
    last = now;
  }
};

// panel directory: number of .jsx source files (panels plus helpers)
const DIRS = {
  dataqc: 4, mlcore: 4, facies: 4, forecastml: 4, appliedai: 4, crude: 4, refinery: 4, supply: 4,
};
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
  ...document.querySelectorAll('.recharts-line-curve, .recharts-reference-line-line, .recharts-rectangle, .recharts-reference-dot-dot, .recharts-dot, .recharts-symbols'),
].map((el) => (el.getAttribute('stroke') || el.getAttribute('fill') || '').toLowerCase())
  .filter((c) => c && c !== 'none' && c !== 'transparent' && c !== '#fff' && c !== '#ffffff');

describe('the 5D teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the migrated courses', () => {
    const registry = fs.readFileSync(path.resolve(PANEL_DIR, '../../../content/courses/panelRegistry.js'), 'utf8');
    const ids = [...registry.matchAll(/'([a-z0-9-]+)':\s*React\.lazy\(\(\) => import\('@\/components\/course\/panels\/([a-z]+)\//g)]
      .filter((m) => Object.keys(DIRS).includes(m[2])).map((m) => m[1]);
    expect(Object.keys(BATCH_PANELS).sort()).toEqual(ids.sort());
    for (const id of ids) expect(PANELS[id]).toBeTruthy();
  });

  it('the source carries no legacy colour class and no retired chart colour in any branch', () => {
    const scan = (src) => src.replace(/[`'"{}()$]/g, ' ').split(/\s+/).filter((t) => t && hasLegacyChrome(t));
    // negative control: a pre-5D conditional class and a lime cell are caught
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
    for (const [id, Panel] of Object.entries(BATCH_PANELS)) {
      it(`${id} (${theme}): every view on roles, every plot on the white plate in kit colours`, async () => {
        window.localStorage.setItem(themeStorageKey('u-5d'), theme);
        const { container } = render(<ThemedApp userId="u-5d"><Panel /></ThemedApp>);
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
          // eslint-disable-next-line no-await-in-loop
          if (ASYNC.has(id)) await settle();
          check(view);
          const sub = viewSelects(container)[1];
          if (sub) {
            for (const v of [...sub.options].map((o) => o.value)) {
              fireEvent.change(viewSelects(container)[1], { target: { value: v } });
              // eslint-disable-next-line no-await-in-loop
              if (ASYNC.has(id)) await settle();
              check(`${view}/${v}`);
            }
          }
        }
        if (NO_PLOT.has(id)) expect(plots).toBe(0);
        else expect(plots).toBeGreaterThan(0);
      }, 300000);
    }
  }
});
