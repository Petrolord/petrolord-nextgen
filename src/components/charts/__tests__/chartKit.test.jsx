// @vitest-environment jsdom
//
// Batch 1B: the chart kit ported from the Suite (docs/scope/DesignSystem.md
// section 5). The API matches the Suite's (same export names and defaults),
// every piece sits on a white data-canvas="chart" surface with the Petrolord
// mark, the series colours read on white, and ChartPanel is white in both
// themes and outside a scope.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { LineChart, Line } from 'recharts';
import { installDomShims } from '@/design/testing/domShims';
import { expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import { ThemedApp } from '@/design/ThemeProvider';
import { contrastRatio, CHART_SERIES as TOKEN_SERIES } from '@/design/tokens';
import * as chartTheme from '@/utils/chartTheme';
import {
  CHART_SERIES, seriesColor, SVG_CHART, GRID_LINE_PROPS, AXIS_LINE_PROPS, REFERENCE_LINE_PROPS, svgTextProps, AXIS_TICK,
} from '@/utils/chartSvg';
import ChartLogo from '@/components/charts/ChartLogo';
import ChartFrame from '@/components/charts/ChartFrame';
import SvgChartFrame from '@/components/charts/SvgChartFrame';
import { ChartPanel } from '@/components/ui/chart-panel';

const exportSpy = vi.fn();
vi.mock('@/utils/chartExport', () => ({ exportChartAsImage: (...a) => exportSpy(...a) }));

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

describe('chartTheme is the Suite chart theme', () => {
  it('exports the Suite names', () => {
    expect(Object.keys(chartTheme).sort()).toEqual([
      'ANNOTATION_BOX_CLASSNAME', 'CHART_COLORS', 'CHART_LOGO_PATH', 'CHART_LOGO_STYLE', 'CHART_MARGINS',
      'CHART_TYPOGRAPHY', 'GRID_STYLE', 'LEGEND_PROPS', 'PINNED_TOOLTIP_PROPS', 'STREAM_PALETTES',
      'TOOLTIP_STYLE', 'XAXIS_LABEL_HEIGHT', 'getStreamPalette', 'niceTicks',
    ]);
    expect(chartTheme.CHART_COLORS.background).toBe('#ffffff');
    expect(chartTheme.CHART_LOGO_STYLE.height).toBe('40px');
    expect(chartTheme.getStreamPalette('nope')).toBe(chartTheme.STREAM_PALETTES.oil);
    expect(chartTheme.niceTicks(80, 1500)).toEqual({ domain: [0, 1500], ticks: [0, 250, 500, 750, 1000, 1250, 1500] });
  });

  it('ships the watermark the logo points at', () => {
    const file = path.join(ROOT, 'public', chartTheme.CHART_LOGO_PATH);
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.readFileSync(file).subarray(1, 4).toString()).toBe('PNG');
  });
});

describe('the series colours and the SVG plate', () => {
  it('are the family tokens and read on white', () => {
    expect(CHART_SERIES).toEqual(TOKEN_SERIES);
    for (const c of CHART_SERIES) expect(contrastRatio(c, '#FFFFFF')).toBeGreaterThanOrEqual(3);
    for (const c of [SVG_CHART.tick, SVG_CHART.label, SVG_CHART.note, SVG_CHART.reference]) {
      expect(contrastRatio(c, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    }
    expect(CHART_SERIES.map((c) => c.toUpperCase())).not.toContain('#BFFF00');
  });

  it('seriesColor wraps and tolerates junk', () => {
    expect(seriesColor(0)).toBe(CHART_SERIES[0]);
    expect(seriesColor(5)).toBe(CHART_SERIES[0]);
    expect(seriesColor(-1)).toBe(CHART_SERIES[4]);
    expect(seriesColor(NaN)).toBe(CHART_SERIES[0]);
  });

  it('builds the plate from the chart theme', () => {
    expect(SVG_CHART.plate).toBe('#ffffff');
    expect(GRID_LINE_PROPS.stroke).toBe(chartTheme.CHART_COLORS.grid);
    expect(AXIS_LINE_PROPS.stroke).toBe(chartTheme.CHART_COLORS.axisLine);
    expect(REFERENCE_LINE_PROPS.strokeDasharray).toBe('4 3');
    expect(svgTextProps('label')).toMatchObject({ fill: chartTheme.CHART_COLORS.axisLabel, fontWeight: 600 });
    expect(svgTextProps('unknown')).toMatchObject({ fill: chartTheme.CHART_COLORS.axisText });
    expect(AXIS_TICK).toEqual({ fill: chartTheme.CHART_COLORS.axisText, fontSize: 11 });
  });
});

describe('the frames', () => {
  beforeAll(installDomShims);
  beforeEach(() => { window.localStorage.clear(); exportSpy.mockClear(); });
  afterEach(cleanup);

  it('ChartLogo is the watermark image', () => {
    const { container } = render(<div style={{ position: 'relative' }}><ChartLogo style={{ opacity: 1 }} /></div>);
    const img = container.querySelector('img');
    expect(img.getAttribute('src')).toBe('/petrolord-chart-watermark.png');
    expect(img.getAttribute('alt')).toBe('Petrolord');
    expect(img.style.opacity).toBe('1');
    expect(img.style.height).toBe('40px');
  });

  it('ChartFrame: white chart canvas, reserved logo band, header, export', () => {
    const { container } = render(
      <ChartFrame height={200} header="Rate in stb/d" exportFilename="rate">
        <LineChart data={[{ x: 1, y: 2 }]}><Line dataKey="y" /></LineChart>
      </ChartFrame>,
    );
    const frame = container.querySelector('[data-canvas="chart"]');
    expect(frame.className).toMatch(/\bbg-white\b/);
    expect(frame.style.paddingBottom).toBe('60px');
    expect(frame.querySelector('img[alt="Petrolord"]')).not.toBeNull();
    expect(screen.getByText('Rate in stb/d')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Download chart as PNG' }));
    expect(exportSpy).toHaveBeenCalledWith(frame.id, 'rate');
  });

  it('ChartFrame without export has no button and no id', () => {
    const { container } = render(<ChartFrame logoHeight={24}><LineChart data={[]} /></ChartFrame>);
    const frame = container.querySelector('[data-canvas="chart"]');
    expect(frame.id).toBe('');
    expect(frame.style.paddingBottom).toBe('44px');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('SvgChartFrame: the same frame around a white-plated svg', () => {
    const { container } = render(
      <SvgChartFrame width={400} height={200} label="Porosity with depth" minWidth={460} exportFilename="phi">
        <line {...GRID_LINE_PROPS} x1="0" x2="400" y1="100" y2="100" />
      </SvgChartFrame>,
    );
    const frame = container.querySelector('[data-canvas="chart"]');
    const svg = screen.getByRole('img', { name: 'Porosity with depth' });
    expect(svg.getAttribute('viewBox')).toBe('0 0 400 200');
    expect(svg.style.minWidth).toBe('460px');
    expect(svg.parentElement.className).toBe('overflow-x-auto');
    expect(svg.style.maxWidth).toBe('');
    expect(svg.querySelector('rect').getAttribute('fill')).toBe('#ffffff');
    expect(frame.querySelector('img[alt="Petrolord"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Download chart as PNG' }));
    expect(exportSpy).toHaveBeenCalledWith(frame.id, 'phi');
  });

  it('SvgChartFrame maxWidth caps and centres the plot', () => {
    render(<SvgChartFrame width={300} height={150} label="Small" maxWidth={640}><g /></SvgChartFrame>);
    const svg = screen.getByRole('img', { name: 'Small' });
    expect(svg.style.maxWidth).toBe('640px');
    expect(svg.style.margin).toBe('0px auto');
    expect(svg.parentElement.getAttribute('data-canvas')).toBe('chart');
  });

  it('ChartPanel is a titled white chart canvas in both themes, with no legacy chrome', () => {
    for (const theme of ['light', 'dark']) {
      const { container, unmount } = render(
        <ThemedApp userId="t" defaultTheme={theme}>
          <ChartPanel title="Rate" subtitle="stb/d" actions={<span>PNG</span>}>
            <ChartFrame height={120}><LineChart data={[]} /></ChartFrame>
          </ChartPanel>
        </ThemedApp>,
      );
      const panel = container.querySelector('section[data-canvas="chart"]');
      expect(panel.className).toMatch(/\bbg-pl-chart-surface\b/);
      expect(screen.getByRole('heading', { name: 'Rate' }).className).toMatch(/\btext-pl-text\b/);
      expectNoLegacyChrome();
      unmount();
    }
  });

  it('ChartPanel outside a scope draws the same white card with fixed light classes', () => {
    const { container } = render(<ChartPanel title="Rate"><div>plot</div></ChartPanel>);
    const panel = container.querySelector('[data-canvas="chart"]');
    expect(panel.className).toMatch(/\bbg-white\b/);
    expect(panel.className).not.toMatch(/pl-/);
    expect(screen.getByRole('heading', { name: 'Rate' }).className).toMatch(/\btext-slate-900\b/);
  });
});
