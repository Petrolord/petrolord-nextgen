// @vitest-environment jsdom
//
// Batch 5A (docs/scope/DesignSystem-Rollout.md): the fifteen teaching panels
// of the facilities I courses (separation, line sizing, rotating equipment,
// gas processing, relief). Their hosts are the learning pages (5A), the
// lesson reader and the handbook (1C), all inside a scope now, so the
// panels moved straight to theme roles.
//
// Inside a scope, in light and dark, every view of every panel (and every
// sub-view a view offers) renders roles only outside its plots, every plot
// sits in ChartFrame (the white chart plate with the Petrolord chart mark),
// and every series and guide line is a chart kit colour: seriesColor(n),
// the ink label, the slate note or the grey reference. Retired console lime
// and the old dark-plate hues are gone. A source scan covers the branches a
// default render does not reach.
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

import SeparatorExplorer from '@/components/course/panels/separation/SeparatorExplorer';
import SlugExplorer from '@/components/course/panels/separation/SlugExplorer';
import LayoutExplorer from '@/components/course/panels/separation/LayoutExplorer';
import LiquidExplorer from '@/components/course/panels/linesizing/LiquidExplorer';
import GasLineExplorer from '@/components/course/panels/linesizing/GasLineExplorer';
import WallPigExplorer from '@/components/course/panels/linesizing/WallPigExplorer';
import PumpExplorer from '@/components/course/panels/rotating/PumpExplorer';
import SuctionExplorer from '@/components/course/panels/rotating/SuctionExplorer';
import CompressorExplorer from '@/components/course/panels/rotating/CompressorExplorer';
import WaterExplorer from '@/components/course/panels/gasprocessing/WaterExplorer';
import AbsorberExplorer from '@/components/course/panels/gasprocessing/AbsorberExplorer';
import ColdEndExplorer from '@/components/course/panels/gasprocessing/ColdEndExplorer';
import SizingExplorer from '@/components/course/panels/relief/SizingExplorer';
import FireDrumExplorer from '@/components/course/panels/relief/FireDrumExplorer';
import BlowdownExplorer from '@/components/course/panels/relief/BlowdownExplorer';

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

const FAC_PANELS = {
  'fc-separator-explorer': SeparatorExplorer,
  'fc-slug-explorer': SlugExplorer,
  'fc-layout-explorer': LayoutExplorer,
  'fc-liquid-explorer': LiquidExplorer,
  'fc-gasline-explorer': GasLineExplorer,
  'fc-wall-pig-explorer': WallPigExplorer,
  'fc-pump-explorer': PumpExplorer,
  'fc-suction-explorer': SuctionExplorer,
  'fc-compressor-explorer': CompressorExplorer,
  'fc-water-explorer': WaterExplorer,
  'fc-absorber-explorer': AbsorberExplorer,
  'fc-coldend-explorer': ColdEndExplorer,
  'fc-sizing-explorer': SizingExplorer,
  'fc-fire-drum-explorer': FireDrumExplorer,
  'fc-blowdown-explorer': BlowdownExplorer,
};

const DIRS = ['separation', 'linesizing', 'rotating', 'gasprocessing', 'relief'];
const PANEL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFiles = () => DIRS.flatMap((d) => fs.readdirSync(path.join(PANEL_DIR, d))
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => path.join(PANEL_DIR, d, f)));

// What a line, bar or reference line may be drawn in on the white plate.
const KIT_STROKES = new Set([...CHART_SERIES, SVG_CHART.label, SVG_CHART.note, SVG_CHART.reference].map((c) => c.toLowerCase()));
// The old dark-plate colours: lime, sky, amber, pink, red, rose, violet,
// green, the slate ticks and the dark tooltip. (#334155, the old grid, is the
// kit's tick ink on white, and #e2e8f0, the old near-white trace, is the kit
// grid; the grid check below proves the grid moved.)
const RETIRED = /#(bfff00|38bdf8|fbbf24|f472b6|f87171|fb7185|a78bfa|34d399|94a3b8|0f172a)\b/i;

const viewSelects = (container) => [...container.querySelectorAll('select')]
  .filter((s) => s.parentElement.textContent.startsWith('View'));
const viewSelect = (container) => viewSelects(container)[0];

const seriesStrokes = () => [
  ...document.querySelectorAll('.recharts-line-curve, .recharts-reference-line-line, .recharts-rectangle'),
].map((el) => (el.getAttribute('stroke') || el.getAttribute('fill') || '').toLowerCase()).filter((c) => c && c !== 'none');

describe('the facilities I teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the five facilities I courses', () => {
    const registry = fs.readFileSync(path.resolve(PANEL_DIR, '../../../content/courses/panelRegistry.js'), 'utf8');
    const ids = [...registry.matchAll(/'([a-z0-9-]+)':\s*React\.lazy\(\(\) => import\('@\/components\/course\/panels\/([a-z]+)\//g)]
      .filter((m) => DIRS.includes(m[2])).map((m) => m[1]);
    expect(Object.keys(FAC_PANELS).sort()).toEqual(ids.sort());
    for (const id of ids) expect(PANELS[id]).toBeTruthy();
  });

  it('the source carries no legacy colour class and no retired chart colour in any branch', () => {
    const scan = (src) => src.replace(/[`'"{}()$]/g, ' ').split(/\s+/).filter((t) => t && hasLegacyChrome(t));
    // negative control: a pre-5A conditional class and a lime stroke are caught
    expect(scan("<p className={`text-xs ${tone === 'red' ? 'text-red-300' : 'text-sky-300'}`}>"))
      .toEqual(['text-red-300', 'text-sky-300']);
    expect(RETIRED.test('<Line dataKey="tr" stroke="#BFFF00" />')).toBe(true);
    const files = sourceFiles();
    expect(files.length).toBe(15); // the fifteen panels
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
    for (const [id, Panel] of Object.entries(FAC_PANELS)) {
      it(`${id} (${theme}): every view on roles, every plot on the white plate in kit colours`, () => {
        window.localStorage.setItem(themeStorageKey('u-5a'), theme);
        const { container } = render(<ThemedApp userId="u-5a"><Panel /></ThemedApp>);
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
