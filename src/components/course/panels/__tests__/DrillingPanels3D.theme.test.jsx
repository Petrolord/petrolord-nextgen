// @vitest-environment jsdom
//
// Batch 3D (docs/scope/DesignSystem-Rollout.md): the eighteen teaching
// panels of the drilling I courses. Their hosts are the learning pages (3D),
// the lesson reader and the handbook (1C), all inside a scope now, so the
// panels moved straight to theme roles.
//
// Inside a scope, in light and dark, every view of every panel renders
// roles only outside its plots, every plot sits in ChartFrame (the white
// chart plate with the Petrolord chart mark), and every series and guide
// line is a chart kit colour: seriesColor(n), the ink label or the grey
// reference. Retired console lime and the old dark-plate hues are gone. A
// source scan covers the branches a default render does not reach (the
// negative-value warnings, the status words).
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

import SurveyExplorer from '@/components/course/panels/welldesign/SurveyExplorer';
import UncertaintyExplorer from '@/components/course/panels/welldesign/UncertaintyExplorer';
import ClearanceExplorer from '@/components/course/panels/welldesign/ClearanceExplorer';
import StringExplorer from '@/components/course/panels/torquedrag/StringExplorer';
import FrictionExplorer from '@/components/course/panels/torquedrag/FrictionExplorer';
import BucklingExplorer from '@/components/course/panels/torquedrag/BucklingExplorer';
import RheologyExplorer from '@/components/course/panels/hydraulics/RheologyExplorer';
import CleaningExplorer from '@/components/course/panels/hydraulics/CleaningExplorer';
import SurgeExplorer from '@/components/course/panels/hydraulics/SurgeExplorer';
import VolumeExplorer from '@/components/course/panels/wellcontrol/VolumeExplorer';
import KillSheetExplorer from '@/components/course/panels/wellcontrol/KillSheetExplorer';
import ToleranceExplorer from '@/components/course/panels/wellcontrol/ToleranceExplorer';
import StressExplorer from '@/components/course/panels/geomech/StressExplorer';
import StabilityExplorer from '@/components/course/panels/geomech/StabilityExplorer';
import WindowExplorer from '@/components/course/panels/geomech/WindowExplorer';
import RatingExplorer from '@/components/course/panels/casingtubing/RatingExplorer';
import LoadCaseExplorer from '@/components/course/panels/casingtubing/LoadCaseExplorer';
import TubingExplorer from '@/components/course/panels/casingtubing/TubingExplorer';

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
  'wd-survey-explorer': SurveyExplorer,
  'wd-uncertainty-explorer': UncertaintyExplorer,
  'wd-clearance-explorer': ClearanceExplorer,
  'td-string-explorer': StringExplorer,
  'td-friction-explorer': FrictionExplorer,
  'td-buckling-explorer': BucklingExplorer,
  'hy-rheology-explorer': RheologyExplorer,
  'hy-cleaning-explorer': CleaningExplorer,
  'hy-surge-explorer': SurgeExplorer,
  'wc-volume-explorer': VolumeExplorer,
  'wc-killsheet-explorer': KillSheetExplorer,
  'wc-tolerance-explorer': ToleranceExplorer,
  'gm-stress-explorer': StressExplorer,
  'gm-stability-explorer': StabilityExplorer,
  'gm-window-explorer': WindowExplorer,
  'ct-rating-explorer': RatingExplorer,
  'ct-loadcase-explorer': LoadCaseExplorer,
  'ct-tubing-explorer': TubingExplorer,
};

const DIRS = ['welldesign', 'torquedrag', 'hydraulics', 'wellcontrol', 'geomech', 'casingtubing'];
const PANEL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFiles = () => DIRS.flatMap((d) => fs.readdirSync(path.join(PANEL_DIR, d))
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => path.join(PANEL_DIR, d, f)));

// What a line, bar or reference line may be drawn in on the white plate.
const KIT_STROKES = new Set([...CHART_SERIES, SVG_CHART.label, SVG_CHART.reference].map((c) => c.toLowerCase()));
// The old dark-plate colours: lime, sky, amber, red, rose, the white trace.
const RETIRED = /#(bfff00|38bdf8|f59e0b|ef4444|fb7185|f8fafc)\b/i;

const viewSelect = (container) => [...container.querySelectorAll('select')]
  .find((s) => s.parentElement.textContent.startsWith('View'));

const seriesStrokes = () => [
  ...document.querySelectorAll('.recharts-line-curve, .recharts-reference-line-line, .recharts-rectangle'),
].map((el) => (el.getAttribute('stroke') || el.getAttribute('fill') || '').toLowerCase()).filter((c) => c && c !== 'none');

describe('the drilling I teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the six drilling I courses', () => {
    const registry = fs.readFileSync(path.resolve(PANEL_DIR, '../../../content/courses/panelRegistry.js'), 'utf8');
    const ids = [...registry.matchAll(/'([a-z0-9-]+)':\s*React\.lazy\(\(\) => import\('@\/components\/course\/panels\/([a-z]+)\//g)]
      .filter((m) => DIRS.includes(m[2])).map((m) => m[1]);
    expect(Object.keys(DRILLING_PANELS).sort()).toEqual(ids.sort());
    for (const id of ids) expect(PANELS[id]).toBeTruthy();
  });

  it('the source carries no legacy colour class and no retired chart colour in any branch', () => {
    const scan = (src) => src.replace(/[`'"{}()$]/g, ' ').split(/\s+/).filter((t) => t && hasLegacyChrome(t));
    // negative control: a pre-3D conditional class and a lime stroke are caught
    expect(scan("className={`p-2 text-right ${r.transportRatio < 0.5 ? 'text-red-400' : 'text-gray-200'}`}"))
      .toEqual(['text-red-400', 'text-gray-200']);
    expect(RETIRED.test('<Line dataKey="tr" stroke="#BFFF00" />')).toBe(true);
    const files = sourceFiles();
    expect(files.length).toBe(19); // 18 panels and the hydraulics MudBoxes
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
    for (const [id, Panel] of Object.entries(DRILLING_PANELS)) {
      it(`${id} (${theme}): every view on roles, every plot on the white plate in kit colours`, () => {
        window.localStorage.setItem(themeStorageKey('u-3d'), theme);
        const { container } = render(<ThemedApp userId="u-3d"><Panel /></ThemedApp>);
        expect(document.querySelector('[data-pl-root]').getAttribute('data-pl-theme')).toBe(theme);
        // the uncertainty explorer has one view; every other panel has a View select
        const select = viewSelect(container);
        expect(Boolean(select)).toBe(id !== 'wd-uncertainty-explorer');
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
        // the volume explorer is tables only; every other panel draws at least one plot
        if (id !== 'wc-volume-explorer') expect(plots).toBeGreaterThan(0);
      });
    }
  }
});
