// Chart colours for the hand-drawn SVG plots of the course panels that only
// the lesson reader shows (batch 1C, docs/scope/DesignSystem-Rollout.md
// section 6). Every value comes from the family chart kit (batch 1B,
// src/utils/chartSvg.js): the white plate, grid, axis and text colours and
// the five series colours validated on white. The plots sit in
// SvgChartFrame (data-canvas="chart", with the Petrolord chart mark).
//
// On top of the kit, the reader panels keep a few named hues because the
// lessons read them by name ("the pink dashed line", "each orange dot", "a
// hollow lime circle", "the white path"). Changing them would make the
// teaching copy wrong, and the rollout leaves teaching content untouched.
// A light mark (the white path and dots, the lime circle) is drawn over an
// ink casing so it still reads on the white plate.
import { SVG_CHART as KIT, CHART_SERIES } from '@/utils/chartSvg';
import { STREAM_PALETTES } from '@/utils/chartTheme';

const [BLUE, GREEN, AMBER, RED, VIOLET] = CHART_SERIES;

export const SVG_CHART = Object.freeze({
  plate: KIT.plate, // the plot background (SvgChartFrame draws it)
  grid: KIT.grid, // grid lines and zero lines
  axis: KIT.axis, // axis lines, frames and guide lines
  text: KIT.tick, // tick labels and axis titles
  ink: KIT.label, // a single trace, an outline or a label with no series meaning
  halo: KIT.marker, // white: outline around a marker, or a mark the lesson calls white
  blue: BLUE,
  green: GREEN,
  amber: AMBER,
  red: RED,
  violet: VIOLET,
  // Named hues the lessons read by name. Pink is the chart theme's gas
  // forecast colour; orange (orange-600) and lime are the only colours here
  // from outside the kit.
  pink: STREAM_PALETTES.gas.forecast,
  orange: '#EA580C',
  lime: '#BFFF00',
  casing: KIT.label, // the ink stroke drawn under a light line or marker
});
