// @vitest-environment jsdom
//
// Batch 1C (docs/scope/DesignSystem-Rollout.md): the teaching panels that
// only the lesson reader shows (the 25 geoscience panels no learning page
// imports; the rollout plan counts them in the lesson reader's own files).
// Inside a scope, in both themes, each renders theme roles only outside its
// plots, and every plot sits on a white chart plate (data-canvas="chart")
// with the retired console lime gone everywhere (wave 7 moved the last one,
// the reservoircalc P-1 marker, to the kit violet).
//
// panelKit is batch 1B's kit and renders for real.
import React from 'react';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { ThemedApp, themeStorageKey } from '@/design/ThemeProvider';
import { installDomShims } from '@/design/testing/domShims';
import { legacyChromeClasses } from '@/design/testing/themeAssertions';
import { CHART_SERIES } from '@/utils/chartSvg';

import MapExplorer from '@/components/course/panels/mapping/MapExplorer';
import IsochoreExplorer from '@/components/course/panels/mapping/IsochoreExplorer';
import ValidationExplorer from '@/components/course/panels/mapping/ValidationExplorer';
import BurialHeatExplorer from '@/components/course/panels/basin/BurialHeatExplorer';
import KineticsExplorer from '@/components/course/panels/basin/KineticsExplorer';
import ChargeExplorer from '@/components/course/panels/basin/ChargeExplorer';
import FrameworkExplorer from '@/components/course/panels/earthmodel/FrameworkExplorer';
import TieExplorer from '@/components/course/panels/earthmodel/TieExplorer';
import PopulationExplorer from '@/components/course/panels/earthmodel/PopulationExplorer';
import FrameExplorer from '@/components/course/panels/porepressure/FrameExplorer';
import EatonExplorer from '@/components/course/panels/porepressure/EatonExplorer';
import WindowExplorer from '@/components/course/panels/porepressure/WindowExplorer';
import FluidExplorer from '@/components/course/panels/rockphysics/FluidExplorer';
import SubstitutionExplorer from '@/components/course/panels/rockphysics/SubstitutionExplorer';
import AvoExplorer from '@/components/course/panels/rockphysics/AvoExplorer';
import VolumeExplorer from '@/components/course/panels/reservoircalc/VolumeExplorer';
import BlockExplorer from '@/components/course/panels/reservoircalc/BlockExplorer';
import PropertyExplorer from '@/components/course/panels/reservoircalc/PropertyExplorer';
import SyntheticExplorer from '@/components/course/panels/seismolord/SyntheticExplorer';
import ShiftExplorer from '@/components/course/panels/seismolord/ShiftExplorer';
import WedgeExplorer from '@/components/course/panels/seismolord/WedgeExplorer';
import FlattenExplorer from '@/components/course/panels/wellcorrelation/FlattenExplorer';
import PredictionExplorer from '@/components/course/panels/wellcorrelation/PredictionExplorer';
import { useSectionWells } from '@/components/course/panels/wellcorrelation/caseInputs';
import { useMappingCase } from '@/components/course/panels/mapping/caseInputs';
import { PANELS } from '@/content/courses/panelRegistry';


const READER_PANELS = {
  'mp-map-explorer': MapExplorer,
  'mp-isochore-explorer': IsochoreExplorer,
  'mp-validation-explorer': ValidationExplorer,
  'bs-burial-heat-explorer': BurialHeatExplorer,
  'bs-kinetics-explorer': KineticsExplorer,
  'bs-charge-explorer': ChargeExplorer,
  'em-framework-explorer': FrameworkExplorer,
  'em-tie-explorer': TieExplorer,
  'em-population-explorer': PopulationExplorer,
  'pp-frame-explorer': FrameExplorer,
  'pp-eaton-explorer': EatonExplorer,
  'pp-window-explorer': WindowExplorer,
  'rp-fluid-explorer': FluidExplorer,
  'rp-substitution-explorer': SubstitutionExplorer,
  'rp-avo-explorer': AvoExplorer,
  'rc-volume-explorer': VolumeExplorer,
  'rc-block-explorer': BlockExplorer,
  'rc-property-explorer': PropertyExplorer,
  'sl-synthetic-explorer': SyntheticExplorer,
  'sl-shift-explorer': ShiftExplorer,
  'sl-wedge-explorer': WedgeExplorer,
  'wc-flatten-explorer': FlattenExplorer,
  'wc-prediction-explorer': PredictionExplorer,
};

const LIME = /#BFFF00/i;

const plots = () => [
  ...document.querySelectorAll('svg[role="img"]'),
  ...document.querySelectorAll('.recharts-responsive-container'),
];

describe('the reader-only teaching panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('covers every registered panel of the eight reader-only courses', () => {
    const prefixes = ['mp-', 'bs-', 'em-', 'pp-', 'rp-', 'rc-', 'sl-'];
    // rc-change, rc-review and rc-risk are the Risk and Change course (5B)
    const riskChange = ['rc-change-explorer', 'rc-review-explorer', 'rc-risk-explorer'];
    const ids = Object.keys(PANELS)
      .filter((id) => prefixes.some((p) => id.startsWith(p)) && !riskChange.includes(id))
      .concat(['wc-flatten-explorer', 'wc-prediction-explorer']);
    expect(Object.keys(READER_PANELS).sort()).toEqual(ids.sort());
  });

  for (const theme of ['light', 'dark']) {
    for (const [id, Panel] of Object.entries(READER_PANELS)) {
      it(`${id} (${theme}): roles outside the plots, every plot on a white chart plate`, async () => {
        window.localStorage.setItem(themeStorageKey('u-panels'), theme);
        render(<ThemedApp userId="u-panels"><Panel /></ThemedApp>);
        expect(document.querySelector('[data-pl-root]').getAttribute('data-pl-theme')).toBe(theme);
        // some panels run their model after the first paint
        await waitFor(() => expect(plots().length).toBeGreaterThan(0), { timeout: 10000 });
        expect(legacyChromeClasses()).toEqual([]);
        const found = plots();
        for (const plot of found) {
          // SvgChartFrame or ChartFrame (1B chart kit): a white chart canvas
          // with the Petrolord chart mark
          const plate = plot.closest('[data-canvas="chart"]');
          expect(plate).toBeTruthy();
          expect(plate.className).toContain('bg-white');
          expect(plate.querySelector('img[alt]')).toBeTruthy();
        }
        const svgMarkup = [...document.querySelectorAll('svg[role="img"]')].map((s) => s.outerHTML).join('');
        // no lime on any plot (wave 7: the P-1 marker was the last one)
        expect(svgMarkup).not.toMatch(LIME);
        if (id === 'rc-property-explorer') {
          // the lessons' "hollow violet circle": a kit series colour, no fill
          const p1 = document.querySelector('svg circle[data-marker="p1"]');
          expect(p1.getAttribute('fill')).toBe('none');
          expect(p1.getAttribute('stroke')).toBe(CHART_SERIES[4]);
          expect(CHART_SERIES[4].toLowerCase()).toBe('#7c3aed');
        }
        // no dark console plate is left behind a plot
        expect(svgMarkup).not.toMatch(/fill="#0F172A" (?:\/>|><\/rect>)/i);
      });
    }
  }
});

function SectionHarness() {
  const c = useSectionWells();
  return c.ui;
}

function MappingHarness() {
  const c = useMappingCase({ appraisal: true });
  return c.ui;
}


describe('the case inputs', () => {
  beforeAll(installDomShims);
  afterEach(cleanup);

  const typeASection = () => {
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'typed' } });
  };

  it('Well Correlation renders roles inside a scope', () => {
    render(<ThemedApp userId="u-panels"><SectionHarness /></ThemedApp>);
    typeASection();
    expect(document.getElementById('wc-section-table').getAttribute('class')).toContain('bg-pl-surface');
    expect(legacyChromeClasses()).toEqual([]);
  });

  it('Mapping (reader only) renders roles in its typed state', () => {
    render(<ThemedApp userId="u-panels"><MappingHarness /></ThemedApp>);
    typeASection();
    expect(document.getElementById('map-well-table')).toBeTruthy();
    expect(legacyChromeClasses()).toEqual([]);
  });
});
