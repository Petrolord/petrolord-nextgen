// Well Correlation teaching workflow — drives the central
// @petrolord/engines section engine over a deterministic four-well
// teaching section. The engine is consumed as-is; this module holds the
// teaching fixture and orchestrates it for Learning Mode.
//
// The section engine's math is exact closed-form arithmetic (per-well
// additive shifts), so an honest learner reading the section panel
// reaches exactly the engine's numbers.
//
// The Ekene section is the TEACHING case: the panels open on it and the
// lessons work it. Since W5a (2026-09) each tier's capstone is a section
// of its own, stated in the brief and typed into the panels (every
// function below takes an optional well list). Nothing in this file
// carries it, and panelCapstoneGuard.test.jsx checks that no number these
// functions give at their defaults lands on a graded answer.
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

export const TOP_ORDER = ['TOP_A', 'TOP_SAND', 'BASE_SAND', 'TOP_B'];

/** One well per line: name, TOP_A, TOP_SAND, BASE_SAND, TOP_B (MD in m; a dash for a top the well did not reach). */
export function parseSectionTable(text) {
  const rows = String(text).split('\n').map((l) => l.trim()).filter(Boolean);
  const wells = [];
  for (const [i, row] of rows.entries()) {
    const cells = row.split(',').map((c) => c.trim());
    if (cells.length !== 5 || !cells[0]) return null;
    const tops = [];
    for (let k = 0; k < 4; k++) {
      const c = cells[k + 1];
      if (c === '-' || c === '') continue;
      const v = Number(c);
      if (!Number.isFinite(v)) return null;
      tops.push({ name: TOP_ORDER[k], md_m: v });
    }
    if (tops.length < 2) return null;
    for (let k = 1; k < tops.length; k++) if (!(tops[k].md_m > tops[k - 1].md_m)) return null;
    wells.push({ id: `W${i + 1}`, name: cells[0], tops });
  }
  if (wells.length < 2 || new Set(wells.map((w) => w.name)).size !== wells.length) return null;
  return wells;
}

export const sectionTableText = (wells) => wells.map((w) => [
  w.name, ...TOP_ORDER.map((n) => { const t = w.tops.find((x) => x.name === n); return t ? t.md_m : '-'; }),
].join(', ')).join('\n');

// Everything the section view reads, for a given datum setting.
export function computeSection(datum, wells = TEACHING_WELLS) {
  const TEACHING_WELLS_ = wells;
  const flattening = computeFlattening(TEACHING_WELLS_, datum);
  const byId = new Map(flattening.map((f) => [f.id, f.shift]));
  const topNames = allTopNames(TEACHING_WELLS_);
  const polylines = topNames.map((name) => ({
    name,
    points: correlationPolyline(TEACHING_WELLS_, flattening, name),
  }));
  const rows = TEACHING_WELLS_.map((w) => {
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
  const range = displayedRange(TEACHING_WELLS_, flattening);
  return { flattening, topNames, polylines, rows, range };
}

// Structural relief of a top across the section: max MD minus min MD
// over the wells that have it (read in structural mode).
export function structuralRelief(topName, wells = TEACHING_WELLS) {
  const mds = wells.map((w) => topMd(w, topName)).filter((v) => v !== null);
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

// ---- Advanced tier (NG7): predict the missing TOP_B in Ekene-4 two
// ways (layer-cake from TOP_A, interval from TOP_SAND); the spread
// between the estimates is the growth uncertainty. Closed-form on the
// fixture through the engine's top reads; oracle-reproduced in Node
// before the NG7 migration was seeded.
export function computeAdvanced(wells = TEACHING_WELLS) {
  const withB = wells.filter((w) => topMd(w, 'TOP_B') !== null);
  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const rows = withB.map((w) => ({
    id: w.id,
    name: w.name,
    aToB: topMd(w, 'TOP_B') - topMd(w, 'TOP_A'),
    sandToB: topMd(w, 'TOP_B') - topMd(w, 'TOP_SAND'),
    topB: topMd(w, 'TOP_B'),
  }));
  const aToBMean = mean(rows.map((r) => r.aToB));
  const sandToBMean = mean(rows.map((r) => r.sandToB));
  // the well that reached TD above TOP_B
  const w4 = wells.find((w) => topMd(w, 'TOP_B') === null);
  const layercake = topMd(w4, 'TOP_A') + aToBMean;
  const fromSand = topMd(w4, 'TOP_SAND') + sandToBMean;
  const bMds = rows.map((r) => r.topB);
  return {
    target: w4,
    rows,
    aToBMean,
    sandToBMean,
    w4TopBLayercake: layercake,
    w4TopBFromSand: fromSand,
    predictionSpread: Math.abs(fromSand - layercake),
    topBRelief: Math.max(...bMds) - Math.min(...bMds),
  };
}

// ---- Intermediate tier: growth analysis on the TOP_A datum.
// Oracle-reproduced in Node before the NG6 migration was seeded.
export const INTERMEDIATE_DATUM = { topName: 'TOP_A', datumM: 1450 };

export function computeIntermediate(wells = TEACHING_WELLS, datumSpec = INTERMEDIATE_DATUM) {
  const datum = { mode: 'flatten', ...datumSpec };
  const flattening = computeFlattening(wells, datum);
  const byId = new Map(flattening.map((f) => [f.id, f.shift]));
  const rows = wells.map((w) => {
    const a = topMd(w, 'TOP_A');
    const sand = topMd(w, 'TOP_SAND');
    return {
      id: w.id,
      name: w.name,
      shift: byId.get(w.id),
      aToSand: sand - a,
      sandDisplayed: displayedDepth(sand, byId.get(w.id)),
      allFourTops: w.tops.length === 4,
    };
  });
  const growths = rows.map((r) => r.aToSand);
  const range = displayedRange(wells, flattening);
  return {
    rows,
    growthRange: Math.max(...growths) - Math.min(...growths),
    wellsWithAllTops: rows.filter((r) => r.allFourTops).length,
    displayedSpan: range[1] - range[0],
  };
}
