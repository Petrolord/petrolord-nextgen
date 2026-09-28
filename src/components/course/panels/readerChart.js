// White chart standard for the hand-drawn SVG plots of the course panels
// that only the lesson reader shows (batch 1C, docs/scope/DesignSystem-Rollout.md
// section 6). The values are the Suite's chart theme (src/utils/chartTheme.js
// CHART_COLORS) and the family series (CHART_SERIES in src/design/tokens.js),
// so a plot reads the same as every other Petrolord chart: a white plate in
// both themes, slate grid and axes, and the five series colours validated on
// white.
//
// Batch 1B is porting the chart kit (chartTheme, ChartLogo, ChartFrame and a
// helper for hand-made SVG plots) in parallel. When it lands, these constants
// should come from that helper and the plots gain the Petrolord chart mark;
// until then this file is the one place the reader panels take chart colours
// from.
import { CHART_SERIES, CHART_SURFACE } from '@/design/tokens';

const [BLUE, GREEN, AMBER, RED, VIOLET] = CHART_SERIES;

export const SVG_CHART = Object.freeze({
  plate: CHART_SURFACE, // the plot background
  grid: '#E2E8F0', // grid lines and zero lines
  axis: '#94A3B8', // axis lines, reference and guide lines
  text: '#334155', // tick labels and axis titles
  ink: '#0F172A', // a single trace or outline with no series meaning
  halo: '#FFFFFF', // outline around a marker so it reads over a line
  blue: BLUE,
  green: GREEN,
  amber: AMBER,
  red: RED,
  violet: VIOLET,
  // Named hues the lessons read by name ("the pink dashed line", "each
  // orange dot", "a hollow lime circle"), kept so the teaching copy stays
  // true on the white plate. Pink is the Suite chart theme's gas forecast
  // colour; orange and lime are drawn with an ink casing (see casing below)
  // where they would otherwise be faint on white.
  pink: '#DB2777',
  orange: '#EA580C',
  lime: '#BFFF00',
  // Casing: a wider ink stroke drawn under a light line or marker ("the
  // white path", "the white dot") so it reads on the white plate while
  // staying the colour the lesson names.
  casing: '#0F172A',
});

// The frame around a plot: a white card in both themes, skipped by the
// theme test's legacy check because it is a chart canvas.
export const CHART_PLATE_CLASS = 'overflow-x-auto rounded-pl-canvas border border-pl-border bg-pl-chart-surface';
