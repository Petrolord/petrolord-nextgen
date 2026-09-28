// NextGen additions to the family chart theme (src/utils/chartTheme.js),
// batch 1B of docs/scope/DesignSystem-Rollout.md:
//
// - CHART_SERIES and seriesColor(i): the five family series colours (the
//   Suite's design tokens, validated on the white chart surface), for Recharts
//   <Line stroke> / <Bar fill> and hand-made SVG alike. They replace NextGen's
//   old dark-plate colours (lime #BFFF00, sky #38bdf8 ...), which fail on white.
// - SVG_CHART and the *_PROPS bundles: the white plate, grid, axis and text
//   colours for the course panels that draw their own <svg>, taken from the
//   same CHART_COLORS and CHART_TYPOGRAPHY the Recharts charts use.
//
// Put a hand-made SVG in SvgChartFrame (src/components/charts/SvgChartFrame.jsx)
// and a Recharts chart in ChartFrame; both carry data-canvas="chart".
import { CHART_SERIES as TOKEN_SERIES } from '@/design/tokens';
import { CHART_COLORS, CHART_TYPOGRAPHY } from '@/utils/chartTheme';

/** Blue, green, amber, red, violet: the order to assign series in. */
export const CHART_SERIES = Object.freeze([...TOKEN_SERIES]);

/** The i-th series colour, wrapping after five (negative i counts from the end). */
export const seriesColor = (i) => {
  const n = CHART_SERIES.length;
  const k = Number.isFinite(i) ? Math.trunc(i) : 0;
  return CHART_SERIES[((k % n) + n) % n];
};

/** Colours and type for a hand-made SVG chart on the white plate. */
export const SVG_CHART = Object.freeze({
  plate: CHART_COLORS.plotArea,          // #ffffff
  grid: CHART_COLORS.grid,               // hairline grid
  axis: CHART_COLORS.axisLine,           // axis lines and ticks
  tick: CHART_COLORS.axisText,           // tick labels
  label: CHART_COLORS.axisLabel,         // axis titles
  note: '#475569',                       // slate-600: annotations, 7.6:1 on white
  reference: '#64748b',                  // slate-500: reference and guide lines, 4.8:1
  marker: '#ffffff',                     // outline around a point marker
  fontFamily: CHART_TYPOGRAPHY.fontFamily,
  tickSize: CHART_TYPOGRAPHY.axisFontSize,
  labelSize: CHART_TYPOGRAPHY.labelFontSize,
  noteSize: CHART_TYPOGRAPHY.annotationFontSize,
});

/** Spread onto a grid <line>: `<line {...GRID_LINE_PROPS} x1=... />`. */
export const GRID_LINE_PROPS = Object.freeze({
  stroke: SVG_CHART.grid, strokeWidth: 1, strokeDasharray: '3 3',
});

/** Spread onto an axis <line> or <path>. */
export const AXIS_LINE_PROPS = Object.freeze({
  stroke: SVG_CHART.axis, strokeWidth: 1,
});

/** Spread onto a reference or guide line (a limit, a cut-off, a cursor). */
export const REFERENCE_LINE_PROPS = Object.freeze({
  stroke: SVG_CHART.reference, strokeWidth: 1, strokeDasharray: '4 3',
});

const TEXT = {
  tick: { fill: SVG_CHART.tick, fontSize: SVG_CHART.tickSize },
  label: { fill: SVG_CHART.label, fontSize: SVG_CHART.labelSize, fontWeight: 600 },
  note: { fill: SVG_CHART.note, fontSize: SVG_CHART.noteSize },
};

/**
 * Props for an SVG <text>: svgTextProps('tick' | 'label' | 'note').
 * Colour a series label with its line instead: { ...svgTextProps('note'), fill: seriesColor(0) }.
 */
export const svgTextProps = (kind = 'tick') => ({ ...(TEXT[kind] || TEXT.tick), fontFamily: SVG_CHART.fontFamily });

/** Recharts axis tick style from the same theme: <XAxis tick={AXIS_TICK} />. */
export const AXIS_TICK = Object.freeze({ fill: CHART_COLORS.axisText, fontSize: CHART_TYPOGRAPHY.axisFontSize });
