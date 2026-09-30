// @vitest-environment jsdom
//
// Batch 5C (docs/scope/DesignSystem-Rollout.md): the twenty-one teaching
// panels of the five HSE courses (safety statistics, hygiene, LOPA, QRA,
// consequence), gas value and carbon, with their panel atoms. Their hosts
// are the learning pages (5C), the lesson reader and the handbook (1C), all
// inside a scope now, so the panels moved straight to theme roles.
//
// Inside a scope, in light and dark, every view of every panel (and every
// sub-view a view offers) renders roles only outside its plots, every plot
// sits in ChartFrame (the white chart plate with the Petrolord chart mark),
// and every series and guide line is a chart kit colour: seriesColor(n), the
// ink note or the grey reference. Retired console lime and the old
// dark-plate hues are gone. A source scan covers the branches a default
// render does not reach, and the status atoms are rendered on their own.
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

import RatesExplorer from '@/components/course/panels/safetystats/RatesExplorer';
import IntervalsExplorer from '@/components/course/panels/safetystats/IntervalsExplorer';
import UChartExplorer from '@/components/course/panels/safetystats/UChartExplorer';
import NoiseDosimeterExplorer from '@/components/course/panels/hygiene/NoiseDosimeterExplorer';
import ProtectionChemicalsExplorer from '@/components/course/panels/hygiene/ProtectionChemicalsExplorer';
import HeatStressExplorer from '@/components/course/panels/hygiene/HeatStressExplorer';
import WorksheetExplorer from '@/components/course/panels/lopa/WorksheetExplorer';
import SifExplorer from '@/components/course/panels/lopa/SifExplorer';
import ProofTestExplorer from '@/components/course/panels/lopa/ProofTestExplorer';
import EventTreeExplorer from '@/components/course/panels/qra/EventTreeExplorer';
import SocietalExplorer from '@/components/course/panels/qra/SocietalExplorer';
import AlarpExplorer from '@/components/course/panels/qra/AlarpExplorer';
import ReleaseExplorer from '@/components/course/panels/consequence/ReleaseExplorer';
import FireExplorer from '@/components/course/panels/consequence/FireExplorer';
import HarmExplorer from '@/components/course/panels/consequence/HarmExplorer';
import FlareExplorer from '@/components/course/panels/gasvalue/FlareExplorer';
import RouteExplorer from '@/components/course/panels/gasvalue/RouteExplorer';
import RolloutExplorer from '@/components/course/panels/gasvalue/RolloutExplorer';
import InventoryExplorer from '@/components/course/panels/carbon/InventoryExplorer';
import EfficiencyExplorer from '@/components/course/panels/carbon/EfficiencyExplorer';
import AbatementExplorer from '@/components/course/panels/carbon/AbatementExplorer';
import * as safetyBits from '@/components/course/panels/safetystats/panelBits';
import * as hygieneKit from '@/components/course/panels/hygiene/hygieneKit';
import * as lopaBits from '@/components/course/panels/lopa/panelBits';
import * as consequenceBits from '@/components/course/panels/consequence/panelBits';
import * as gasvalueBits from '@/components/course/panels/gasvalue/panelBits';
import * as carbonBits from '@/components/course/panels/carbon/panelBits';

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
  'ss-rates-explorer': RatesExplorer,
  'ss-intervals-explorer': IntervalsExplorer,
  'ss-uchart-explorer': UChartExplorer,
  'hy-noise-dosimeter': NoiseDosimeterExplorer,
  'hy-protection-chemicals': ProtectionChemicalsExplorer,
  'hy-heat-stress': HeatStressExplorer,
  'lp-worksheet': WorksheetExplorer,
  'lp-sif-builder': SifExplorer,
  'lp-proof-test': ProofTestExplorer,
  'qr-event-tree': EventTreeExplorer,
  'qr-societal': SocietalExplorer,
  'qr-alarp': AlarpExplorer,
  'cq-release': ReleaseExplorer,
  'cq-fire': FireExplorer,
  'cq-harm': HarmExplorer,
  'gasvalue-flare-explorer': FlareExplorer,
  'gasvalue-route-explorer': RouteExplorer,
  'gasvalue-rollout-explorer': RolloutExplorer,
  'carbon-inventory-explorer': InventoryExplorer,
  'carbon-efficiency-explorer': EfficiencyExplorer,
  'carbon-abatement-explorer': AbatementExplorer,
};
// The seven panels that draw a plot; the other fourteen teach from tiles,
// tables and words.
const PLOTS = new Set([
  'ss-uchart-explorer',
  'gasvalue-flare-explorer', 'gasvalue-route-explorer', 'gasvalue-rollout-explorer',
  'carbon-inventory-explorer', 'carbon-efficiency-explorer', 'carbon-abatement-explorer',
]);

// panel directory: number of .jsx source files (panels plus helpers)
const DIRS = { safetystats: 4, hygiene: 4, lopa: 4, qra: 4, consequence: 4, gasvalue: 4, carbon: 4 };
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
  ...document.querySelectorAll('.recharts-line-curve, .recharts-reference-line-line, .recharts-rectangle, .recharts-reference-dot-dot, .recharts-dot, .recharts-area-area, .recharts-area-curve, .recharts-scatter-symbol path'),
].flatMap((el) => [el.getAttribute('stroke'), el.getAttribute('fill')])
  .map((c) => (c || '').toLowerCase())
  .filter((c) => c && c !== 'none' && c !== 'transparent' && c !== '#fff' && c !== '#ffffff');

describe('the HSE, gas value and carbon teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the seven migrated courses', () => {
    const registry = fs.readFileSync(path.resolve(PANEL_DIR, '../../../content/courses/panelRegistry.js'), 'utf8');
    const ids = [...registry.matchAll(/'([a-z0-9-]+)':\s*React\.lazy\(\(\) => import\('@\/components\/course\/panels\/([a-z]+)\//g)]
      .filter((m) => Object.keys(DIRS).includes(m[2])).map((m) => m[1]);
    expect(Object.keys(BATCH_PANELS).sort()).toEqual(ids.sort());
    for (const id of ids) expect(PANELS[id]).toBeTruthy();
  });

  it('the source carries no legacy colour class and no retired chart colour in any branch', () => {
    const scan = (src) => src.replace(/[`'"{}()$]/g, ' ').split(/\s+/).filter((t) => t && hasLegacyChrome(t));
    // negative control: a pre-5C conditional class and a lime cell are caught
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
      // status amber, sky and red classes went to the status roles
      expect(src).not.toMatch(/(text|bg|border|accent)-(amber|sky|red|emerald)-\d|accent-\[#/);
    }
  });

  for (const theme of ['light', 'dark']) {
    for (const [id, Panel] of Object.entries(BATCH_PANELS)) {
      it(`${id} (${theme}): every view on roles, every plot on the white plate in kit colours`, () => {
        window.localStorage.setItem(themeStorageKey('u-5c'), theme);
        const { container } = render(<ThemedApp userId="u-5c"><Panel /></ThemedApp>);
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
        if (PLOTS.has(id)) expect(plots).toBeGreaterThan(0);
        else expect(plots).toBe(0);
      }, 300000);
    }

    it(`the panel atoms (${theme}) are on the status roles, each with its words`, () => {
      window.localStorage.setItem(themeStorageKey('u-5c'), theme);
      const r = { field: 'base', error: 'the engine sentence' };
      render(
        <ThemedApp userId="u-5c">
          <safetyBits.Refusal r={r} />
          <safetyBits.Declared title="DECLARED">a basis</safetyBits.Declared>
          <safetyBits.Derived>a derived figure</safetyBits.Derived>
          <safetyBits.SeriesField label="Counts" value="1, 2" onChange={() => {}} />
          <hygieneKit.Quote>a quote</hygieneKit.Quote>
          <hygieneKit.Evidence>evidence</hygieneKit.Evidence>
          <lopaBits.Warnings list={['a warning']} />
          <lopaBits.TextRows label="Rows" value="a" onChange={() => {}} />
          <consequenceBits.Warning text="a second warning" />
          <gasvalueBits.Refusal message="refused" label="a call" />
          <gasvalueBits.EngineNote>a note</gasvalueBits.EngineNote>
          <gasvalueBits.Labelled tag="SYNTHETIC">body</gasvalueBits.Labelled>
          <gasvalueBits.Missing label="a figure" why="no input" />
          <gasvalueBits.Basis>a basis</gasvalueBits.Basis>
          <gasvalueBits.NumBox label="A box" value="1" onChange={() => {}} tag="invented" />
          <gasvalueBits.Slider label="A slider" value="2" min={0} max={4} onChange={() => {}} />
          <gasvalueBits.Stepper label="A stepper" value="2" onChange={() => {}} />
          <gasvalueBits.Button active onClick={() => {}}>chosen</gasvalueBits.Button>
          <gasvalueBits.Button onClick={() => {}}>other</gasvalueBits.Button>
          <gasvalueBits.RequiredSelect label="A select" value="" onChange={() => {}} options={['a']} none="choose" />
          <carbonBits.Refused label="a call" reason="refused" />
          <carbonBits.Verdict value />
          <carbonBits.Verdict value={false} />
          <carbonBits.Verdict value={null} />
          <carbonBits.Tbl head={['a', 'b']} rows={[['1', '2'], ['3', '4']]} highlight={(i) => i === 1} />
        </ThemedApp>,
      );
      expect(legacyChromeClasses()).toEqual([]);
      expect(document.body.innerHTML).not.toMatch(/bfff00/i);
      const byText = (t) => [...document.querySelectorAll('p, span, button')].find((el) => el.textContent === t);
      expect(byText('THE ENGINE REFUSED, NAMING base').className).toContain('text-pl-danger-text');
      expect(byText('DECLARED').className).toContain('text-pl-info-text');
      expect(byText('TRANSCRIPTION ONLY, AND NEVER GRADED').className).toContain('text-pl-warning-text');
      expect(byText('THE ENGINE WARNED, AND STILL ANSWERED').className).toContain('text-pl-warning-text');
      expect(byText('meetsTarget true').className).toContain('text-pl-success-text');
      expect(byText('meetsTarget false').className).toContain('text-pl-danger-text');
      expect(byText('meetsTarget none (no verdict)').className).toContain('text-pl-warning-text');
      expect(byText('chosen').className).toContain('bg-pl-primary');
      expect(byText('other').className).not.toContain('bg-pl-primary ');
      expect(document.querySelectorAll('tbody tr')[1].className).toContain('text-pl-accent-text');
    });
  }
});
