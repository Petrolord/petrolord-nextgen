// @vitest-environment jsdom
//
// Batch 3E (docs/scope/DesignSystem-Rollout.md): the eighteen teaching
// panels of the drilling II courses. Their hosts are the learning pages (3E),
// the lesson reader and the handbook (1C), all inside a scope now, so the
// panels moved straight to theme roles.
//
// Inside a scope, in light and dark, every view of every panel renders
// roles only outside its plots, every plot sits in ChartFrame (the white
// chart plate with the Petrolord chart mark), and every series and guide
// line is a chart kit colour: seriesColor(n), the ink label or the grey
// reference. Retired console lime and the old dark-plate hues are gone. A
// source scan covers the branches a default render does not reach (the
// status words, the highlighted rows).
//
// Recharts' ResponsiveContainer measures nothing in jsdom, so it is replaced
// here by a fixed 640 px size; everything else in recharts is real.
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { ThemedApp, themeStorageKey } from '@/design/ThemeProvider';
import { installDomShims } from '@/design/testing/domShims';
import { legacyChromeClasses, hasLegacyChrome } from '@/design/testing/themeAssertions';
import { CHART_SERIES, SVG_CHART } from '@/utils/chartSvg';
import { CHART_COLORS } from '@/utils/chartTheme';
import { PANELS } from '@/content/courses/panelRegistry';

import VolumeExplorer from '@/components/course/panels/cementing/VolumeExplorer';
import PlacementExplorer from '@/components/course/panels/cementing/PlacementExplorer';
import StandoffExplorer from '@/components/course/panels/cementing/StandoffExplorer';
import StringExplorer from '@/components/course/panels/completion/StringExplorer';
import ClearanceExplorer from '@/components/course/panels/completion/ClearanceExplorer';
import SpaceoutExplorer from '@/components/course/panels/completion/SpaceoutExplorer';
import ShotExplorer from '@/components/course/panels/perfsand/ShotExplorer';
import SkinExplorer from '@/components/course/panels/perfsand/SkinExplorer';
import SandExplorer from '@/components/course/panels/perfsand/SandExplorer';
import AcidExplorer from '@/components/course/panels/stimulation/AcidExplorer';
import FracExplorer from '@/components/course/panels/stimulation/FracExplorer';
import PackExplorer from '@/components/course/panels/stimulation/PackExplorer';
import EnvelopeExplorer from '@/components/course/panels/integrity/EnvelopeExplorer';
import AnnulusExplorer from '@/components/course/panels/integrity/AnnulusExplorer';
import PaExplorer from '@/components/course/panels/integrity/PaExplorer';
import TimeExplorer from '@/components/course/panels/wellcost/TimeExplorer';
import AfeExplorer from '@/components/course/panels/wellcost/AfeExplorer';
import RiskExplorer from '@/components/course/panels/wellcost/RiskExplorer';

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

const DRILLING_PANELS = {
  'cm-volume-explorer': VolumeExplorer,
  'cm-placement-explorer': PlacementExplorer,
  'cm-standoff-explorer': StandoffExplorer,
  'cd-string-explorer': StringExplorer,
  'cd-clearance-explorer': ClearanceExplorer,
  'cd-spaceout-explorer': SpaceoutExplorer,
  'ps-shot-explorer': ShotExplorer,
  'ps-skin-explorer': SkinExplorer,
  'ps-sand-explorer': SandExplorer,
  'st-acid-explorer': AcidExplorer,
  'st-frac-explorer': FracExplorer,
  'st-pack-explorer': PackExplorer,
  'wi-envelope-explorer': EnvelopeExplorer,
  'wi-annulus-explorer': AnnulusExplorer,
  'wi-pa-explorer': PaExplorer,
  'wc-time-explorer': TimeExplorer,
  'wc-afe-explorer': AfeExplorer,
  'wc-risk-explorer': RiskExplorer,
};

const DIRS = ['cementing', 'completion', 'perfsand', 'stimulation', 'integrity', 'wellcost'];
const PANEL_DIR = path.resolve(__dirname, '..');
const sourceFiles = () => DIRS.flatMap((d) => fs.readdirSync(path.join(PANEL_DIR, d))
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => path.join(PANEL_DIR, d, f)));

// What a line, bar or reference line may be drawn in on the white plate.
const KIT_STROKES = new Set([...CHART_SERIES, SVG_CHART.label, SVG_CHART.reference].map((c) => c.toLowerCase()));
// The old dark-plate series colours: lime, sky, pink, violet, amber, rose.
const RETIRED = /#(bfff00|38bdf8|f472b6|a78bfa|f59e0b|fb7185)\b/i;
// In the source, also the dark plate's tooltip, grid and tick greys (the kit
// draws its own axis text in slate-700, so these are checked in the source only).
const RETIRED_SRC = /#(bfff00|38bdf8|f472b6|a78bfa|f59e0b|fb7185|0f172a|334155|94a3b8|64748b)\b/i;

const viewSelect = (container) => [...container.querySelectorAll('select')]
  .find((s) => s.parentElement.textContent.startsWith('View'));

const seriesStrokes = () => [
  ...document.querySelectorAll('.recharts-line-curve, .recharts-reference-line-line, .recharts-rectangle'),
].map((el) => (el.getAttribute('stroke') || el.getAttribute('fill') || '').toLowerCase()).filter((c) => c && c !== 'none');

describe('the drilling II teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the six drilling II courses', () => {
    const registry = fs.readFileSync(path.resolve(PANEL_DIR, '../../../content/courses/panelRegistry.js'), 'utf8');
    const ids = [...registry.matchAll(/'([a-z0-9-]+)':\s*React\.lazy\(\(\) => import\('@\/components\/course\/panels\/([a-z]+)\//g)]
      .filter((m) => DIRS.includes(m[2])).map((m) => m[1]);
    expect(Object.keys(DRILLING_PANELS).sort()).toEqual(ids.sort());
    for (const id of ids) expect(PANELS[id]).toBeTruthy();
  });

  it('the source carries no legacy colour class and no retired chart colour in any branch', () => {
    const scan = (src) => src.replace(/[`'"{}()$]/g, ' ').split(/\s+/).filter((t) => t && hasLegacyChrome(t));
    // negative control: a pre-3E conditional class and a lime stroke are caught
    expect(scan("className={`text-right pr-3 ${r.open ? 'text-emerald-400' : 'text-rose-400'}`}"))
      .toEqual(['text-emerald-400', 'text-rose-400']);
    expect(RETIRED.test('<Line dataKey="tr" stroke="#BFFF00" />')).toBe(true);
    expect(RETIRED_SRC.test("<CartesianGrid stroke=\"#334155\" strokeDasharray=\"3 3\" />")).toBe(true);
    const files = sourceFiles();
    expect(files.length).toBe(18);
    for (const file of files) {
      const src = fs.readFileSync(file, 'utf8');
      // every whitespace-separated token of the file, with quotes, braces and
      // template markers stripped, so conditional class branches are seen too
      const legacy = scan(src);
      expect({ file: path.basename(file), legacy }).toEqual({ file: path.basename(file), legacy: [] });
      expect({ file: path.basename(file), retired: RETIRED_SRC.test(src) }).toEqual({ file: path.basename(file), retired: false });
      expect(src).not.toMatch(/ResponsiveContainer/);
    }
  });

  for (const theme of ['light', 'dark']) {
    for (const [id, Panel] of Object.entries(DRILLING_PANELS)) {
      it(`${id} (${theme}): every view on roles, every plot on the white plate in kit colours`, () => {
        window.localStorage.setItem(themeStorageKey('u-3e'), theme);
        const { container } = render(<ThemedApp userId="u-3e"><Panel /></ThemedApp>);
        expect(document.querySelector('[data-pl-root]').getAttribute('data-pl-theme')).toBe(theme);
        // every panel has a View select
        const select = viewSelect(container);
        expect(Boolean(select)).toBe(true);
        const views = select ? [...select.options].map((o) => o.value) : ['only'];
        let plots = 0;
        for (const view of views) {
          if (select) fireEvent.change(viewSelect(container), { target: { value: view } });
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
        }
        // every panel draws at least one plot
        expect(plots).toBeGreaterThan(0);
      });
    }
  }
});
