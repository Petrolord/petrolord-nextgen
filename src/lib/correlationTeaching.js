// Well Correlation teaching workflow — drives the central
// @petrolord/engines section engine over a deterministic four-well
// teaching section. The engine is consumed as-is; this module holds the
// teaching fixture and orchestrates it for Learning Mode.
//
// The section engine's math is exact closed-form arithmetic (per-well
// additive shifts), so the capstone oracle is this fixture run through
// the engine in Node before the migration was seeded (the NG
// discipline) — an honest learner reading the section panel reaches
// exactly those numbers.
import {
  computeFlattening, correlationPolyline, zoneSpan, displayedRange,
  allTopNames, topMd, displayedDepth,
} from '@petrolord/engines/engines/wellcorrelation/section.js';

// Four wells left-to-right across a gentle structure. W4 loses TOP_B
// (drilled TD above it), which teaches missing-top handling: the
// correlation line simply does not reach that well.
export const TEACHING_WELLS = [
  { id: 'W1', name: 'Ekene-1', tops: [
    { name: 'TOP_A', md_m: 1500 }, { name: 'TOP_SAND', md_m: 1548 },
    { name: 'BASE_SAND', md_m: 1580 }, { name: 'TOP_B', md_m: 1640 },
  ] },
  { id: 'W2', name: 'Ekene-2', tops: [
    { name: 'TOP_A', md_m: 1512 }, { name: 'TOP_SAND', md_m: 1565 },
    { name: 'BASE_SAND', md_m: 1601 }, { name: 'TOP_B', md_m: 1662 },
  ] },
  { id: 'W3', name: 'Ekene-3', tops: [
    { name: 'TOP_A', md_m: 1495 }, { name: 'TOP_SAND', md_m: 1541 },
    { name: 'BASE_SAND', md_m: 1570 }, { name: 'TOP_B', md_m: 1628 },
  ] },
  { id: 'W4', name: 'Ekene-4', tops: [
    { name: 'TOP_A', md_m: 1530 }, { name: 'TOP_SAND', md_m: 1590 },
    { name: 'BASE_SAND', md_m: 1615 },
  ] },
];

export const ZONE = { top: 'TOP_SAND', base: 'BASE_SAND' };
export const DEFAULT_DATUM = { mode: 'structural' };
export const FLATTEN_DATUM_M = 1500;

// Everything the section view and the capstone reading need, for a
// given datum setting.
export function computeSection(datum) {
  const flattening = computeFlattening(TEACHING_WELLS, datum);
  const byId = new Map(flattening.map((f) => [f.id, f.shift]));
  const topNames = allTopNames(TEACHING_WELLS);
  const polylines = topNames.map((name) => ({
    name,
    points: correlationPolyline(TEACHING_WELLS, flattening, name),
  }));
  const rows = TEACHING_WELLS.map((w) => {
    const shift = byId.get(w.id);
    const span = zoneSpan(w, shift, ZONE.top, ZONE.base);
    return {
      id: w.id,
      name: w.name,
      shift,
      hasDatumTop: flattening.find((f) => f.id === w.id)?.hasDatumTop,
      span,
      thickness: span ? span.base - span.top : null,
      tops: w.tops.map((t) => ({ ...t, displayed: displayedDepth(t.md_m, shift) })),
    };
  });
  const range = displayedRange(TEACHING_WELLS, flattening);
  return { flattening, topNames, polylines, rows, range };
}

// Structural relief of a top across the section: max MD minus min MD
// over the wells that have it (read in structural mode).
export function structuralRelief(topName) {
  const mds = TEACHING_WELLS.map((w) => topMd(w, topName)).filter((v) => v !== null);
  return Math.max(...mds) - Math.min(...mds);
}

// Deterministic display-only GR character for the section columns: low
// GR inside the sand, high outside, with a fixed pseudo-random wiggle.
// Purely visual — grading never touches it.
export function displayGr(well, md) {
  const sandTop = topMd(well, ZONE.top);
  const sandBase = topMd(well, ZONE.base);
  const inSand = sandTop !== null && sandBase !== null && md >= sandTop && md <= sandBase;
  const base = inSand ? 35 : 85;
  const wiggle = 12 * Math.sin(md * 0.9) + 6 * Math.sin(md * 2.3 + well.id.charCodeAt(1));
  return base + wiggle;
}
