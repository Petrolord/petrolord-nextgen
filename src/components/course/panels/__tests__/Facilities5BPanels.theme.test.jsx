// @vitest-environment jsdom
//
// Batch 5B (docs/scope/DesignSystem-Rollout.md): the nineteen teaching
// panels of the facilities II and assurance courses (heat transfer,
// metering, produced water, corrosion, risk and change, compliance) and
// their panelBits. Their hosts are the learning pages (5B), the
// lesson reader and the handbook (1C), all inside a scope now, so the
// panels moved straight to theme roles.
//
// Inside a scope, in light and dark, every view of every panel (and every
// sub-view a view offers) renders roles only outside its plots, every plot
// sits in ChartFrame (the white chart plate with the Petrolord chart mark),
// and every series and guide line is a chart kit colour: seriesColor(n)
// (the risk bands' darkest red for Critical is the oil stream's p90), the
// ink note or the grey reference. Retired console lime and the old dark-plate hues are
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
import { CHART_COLORS, getStreamPalette } from '@/utils/chartTheme';
import { PANELS } from '@/content/courses/panelRegistry';

import ExchangerExplorer from '@/components/course/panels/heattransfer/ExchangerExplorer';
import CoefficientExplorer from '@/components/course/panels/heattransfer/CoefficientExplorer';
import RatingExplorer from '@/components/course/panels/heattransfer/RatingExplorer';
import MeterRunExplorer from '@/components/course/panels/metering/MeterRunExplorer';
import ChokingExplorer from '@/components/course/panels/metering/ChokingExplorer';
import VentingExplorer from '@/components/course/panels/metering/VentingExplorer';
import WithheldExplorer from '@/components/course/panels/metering/WithheldExplorer';
import WaterExplorer from '@/components/course/panels/producedwater/WaterExplorer';
import DeviceExplorer from '@/components/course/panels/producedwater/DeviceExplorer';
import TrainExplorer from '@/components/course/panels/producedwater/TrainExplorer';
import ChemistryExplorer from '@/components/course/panels/corrosion/ChemistryExplorer';
import RateExplorer from '@/components/course/panels/corrosion/RateExplorer';
import InhibitorIntegrityExplorer from '@/components/course/panels/corrosion/InhibitorIntegrityExplorer';
import RiskExplorer from '@/components/course/panels/riskchange/RiskExplorer';
import ChangeExplorer from '@/components/course/panels/riskchange/ChangeExplorer';
import ReviewExplorer from '@/components/course/panels/riskchange/ReviewExplorer';
import RegisterExplorer from '@/components/course/panels/compliance/RegisterExplorer';
import PlanExplorer from '@/components/course/panels/compliance/PlanExplorer';
import ReadinessExplorer from '@/components/course/panels/compliance/ReadinessExplorer';

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
  'fc-exchanger-explorer': ExchangerExplorer,
  'fc-coefficient-explorer': CoefficientExplorer,
  'fc-rating-explorer': RatingExplorer,
  'fc-meterrun-explorer': MeterRunExplorer,
  'fc-choking-explorer': ChokingExplorer,
  'fc-venting-explorer': VentingExplorer,
  'fc-withheld-explorer': WithheldExplorer,
  'pw-water-explorer': WaterExplorer,
  'pw-device-explorer': DeviceExplorer,
  'pw-train-explorer': TrainExplorer,
  'fc-chemistry-explorer': ChemistryExplorer,
  'fc-rate-explorer': RateExplorer,
  'fc-inhibitor-integrity-explorer': InhibitorIntegrityExplorer,
  'rc-risk-explorer': RiskExplorer,
  'rc-change-explorer': ChangeExplorer,
  'rc-review-explorer': ReviewExplorer,
  'compliance-register-explorer': RegisterExplorer,
  'compliance-plan-explorer': PlanExplorer,
  'compliance-readiness-explorer': ReadinessExplorer,
};

const DIRS = ['heattransfer', 'metering', 'producedwater', 'corrosion', 'riskchange', 'compliance'];
const PANEL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFiles = () => DIRS.flatMap((d) => fs.readdirSync(path.join(PANEL_DIR, d))
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => path.join(PANEL_DIR, d, f)));

// What a line, bar or reference line may be drawn in on the white plate.
const KIT_STROKES = new Set([...CHART_SERIES, SVG_CHART.note, SVG_CHART.reference, getStreamPalette('oil').p90].map((c) => c.toLowerCase()));
// The old dark-plate colours: lime, sky, pink, amber, violet, the light and
// dark reds, the slate ticks and labels, the dark tooltip and the old risk
// band fills. (#334155, the old grid, is the kit's tick ink on white; the
// grid check below proves the grid moved.)
const RETIRED = /#(bfff00|38bdf8|f472b6|fbbf24|a78bfa|f87171|fca5a5|7f1d1d|94a3b8|0f172a|b91c1c|ea580c)\b/i;

const viewSelects = (container) => [...container.querySelectorAll('select')]
  .filter((s) => s.parentElement.textContent.startsWith('View'));
const viewSelect = (container) => viewSelects(container)[0];

const seriesStrokes = () => [
  ...document.querySelectorAll('.recharts-line-curve, .recharts-reference-line-line, .recharts-rectangle'),
].map((el) => (el.getAttribute('stroke') || el.getAttribute('fill') || '').toLowerCase()).filter((c) => c && c !== 'none' && c !== 'transparent'); // an invisible line that only sets a domain draws nothing

describe('the facilities II and assurance teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the six facilities II and assurance courses', () => {
    const registry = fs.readFileSync(path.resolve(PANEL_DIR, '../../../content/courses/panelRegistry.js'), 'utf8');
    const ids = [...registry.matchAll(/'([a-z0-9-]+)':\s*React\.lazy\(\(\) => import\('@\/components\/course\/panels\/([a-z]+)\//g)]
      .filter((m) => DIRS.includes(m[2])).map((m) => m[1]);
    expect(Object.keys(PROD_PANELS).sort()).toEqual(ids.sort());
    for (const id of ids) expect(PANELS[id]).toBeTruthy();
  });

  it('the source carries no legacy colour class and no retired chart colour in any branch', () => {
    const scan = (src) => src.replace(/[`'"{}()$]/g, ' ').split(/\s+/).filter((t) => t && hasLegacyChrome(t));
    // negative control: a pre-5B conditional class and a lime stroke are caught
    expect(scan("className={`${active ? 'border-[#BFFF00] text-[#BFFF00]' : 'border-slate-600'}`}"))
      .toEqual(['border-[#BFFF00]', 'text-[#BFFF00]', 'border-slate-600']);
    expect(RETIRED.test('<Line dataKey="used" stroke="#BFFF00" />')).toBe(true);
    const files = sourceFiles();
    expect(files.length).toBe(22); // 19 panels and three panelBits
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
        window.localStorage.setItem(themeStorageKey('u-5b'), theme);
        const { container } = render(<ThemedApp userId="u-5b"><Panel /></ThemedApp>);
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
