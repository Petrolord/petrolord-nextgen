// Mapping teaching workflow — drives the central @petrolord/engines
// surface + gridding engines over the Ekene teaching wells (the same
// field the Well Correlation course sections; here with map
// coordinates and two extra wells beyond the section line). The engine
// is consumed as-is; this module holds the fixture, the teaching
// settings and the summary-panel numbers.
//
// The Ekene wells are the TEACHING case: the panels open on them and the
// lessons work them. Since W5a (2026-09) each tier's capstone is a well
// set of its own, stated in the brief and typed into the panels (every
// function below takes an optional case: wells, prospect and appraisal
// well). Nothing in this file carries it, and panelCapstoneGuard.test.jsx
// checks that no number these functions give at their defaults lands on a
// graded answer.
import { topsToPoints, specForPoints } from '@petrolord/engines/engines/mapping/surface.js';
import { gridSurface } from '@petrolord/engines/lib/gridding/gridding.js';
import { surfaceStats, sampleAtXY, isNull, isochore } from '@petrolord/engines/lib/gridding/gridmath.js';
import { contourLevels, contourPolylines } from '@petrolord/engines/lib/gridding/mapContours.js';

export const TEACHING_WELLS = [
  { name: 'Ekene-1', surface_x: 1000, surface_y: 1000, tops: [{ name: 'TOP_SAND', md_m: 1548 }, { name: 'BASE_SAND', md_m: 1580 }] },
  { name: 'Ekene-2', surface_x: 2200, surface_y: 1150, tops: [{ name: 'TOP_SAND', md_m: 1565 }, { name: 'BASE_SAND', md_m: 1601 }] },
  { name: 'Ekene-3', surface_x: 1400, surface_y: 2300, tops: [{ name: 'TOP_SAND', md_m: 1541 }, { name: 'BASE_SAND', md_m: 1570 }] },
  { name: 'Ekene-4', surface_x: 2600, surface_y: 2500, tops: [{ name: 'TOP_SAND', md_m: 1590 }, { name: 'BASE_SAND', md_m: 1615 }] },
  { name: 'Ekene-5', surface_x: 600,  surface_y: 1900, tops: [{ name: 'TOP_SAND', md_m: 1552 }, { name: 'BASE_SAND', md_m: 1583 }] },
  { name: 'Ekene-6', surface_x: 1900, surface_y: 1800, tops: [{ name: 'TOP_SAND', md_m: 1546 }, { name: 'BASE_SAND', md_m: 1580 }] },
];

export const TOP_NAME = 'TOP_SAND';
export const TEACHING_CELL_M = 100;      // the teaching grid cell
export const PAD_CELLS = 2;
export const MAX_EXTRAP_M = 800;         // wells are ~1 km apart
export const TARGET = { x: 1600, y: 1600, label: 'P-1' }; // prospect location

// A case: the wells, the prospect and the appraisal well. The Ekene
// teaching case unless the learner types one.
export const E7 = { name: 'Ekene-7', x: 1500, y: 1500, actual: 1549 };
export const TEACHING_CASE = { wells: TEACHING_WELLS, target: TARGET, e7: E7 };
const caseOf = (c) => ({ ...TEACHING_CASE, ...(c || {}) });

/** One well per line: name, x, y, TOP_SAND MD, BASE_SAND MD. Null unless every line parses and there are at least three wells. */
export function parseWellTable(text) {
  const rows = String(text).split('\n').map((l) => l.trim()).filter(Boolean);
  const wells = [];
  for (const row of rows) {
    const cells = row.split(',').map((c) => c.trim());
    if (cells.length !== 5) return null;
    const [name, ...nums] = cells;
    const [x, y, top, base] = nums.map(Number);
    if (!name || ![x, y, top, base].every(Number.isFinite) || !(base > top)) return null;
    wells.push({ name, surface_x: x, surface_y: y, tops: [{ name: TOP_NAME, md_m: top }, { name: 'BASE_SAND', md_m: base }] });
  }
  if (wells.length < 3 || new Set(wells.map((w) => w.name)).size !== wells.length) return null;
  return wells;
}

export const wellTableText = (wells) => wells.map((w) => [
  w.name, w.surface_x, w.surface_y,
  w.tops.find((t) => t.name === TOP_NAME).md_m, w.tops.find((t) => t.name === 'BASE_SAND').md_m,
].join(', ')).join('\n');

// Grid the surface at a given cell size and compute everything the map
// view reads.
export function computeMap(cellM, kase = null) {
  const { wells, target } = caseOf(kase);
  const TARGET_ = target;
  const points = topsToPoints(wells, TOP_NAME);
  const spec = specForPoints(points, Number(cellM), PAD_CELLS);
  const result = gridSurface(points, spec, { maxExtrapolation: MAX_EXTRAP_M });
  const stats = surfaceStats(result.z);
  const zAtTarget = sampleAtXY(result.z, spec, TARGET_.x, TARGET_.y);
  const { levels, step } = contourLevels(stats.min, stats.max, 10);
  const contours = levels.map((level) => ({
    level,
    // contourPolylines works in fractional (col,row) index space with
    // grid[i*nXl+j]; our z is z[r*nx+c], so nIl=ny, nXl=nx, and a point
    // (px,py) maps to world (x0+px*dx, y0+py*dy).
    lines: contourPolylines(result.z, spec.ny, spec.nx, level).map((flat) => {
      const pts = [];
      for (let k = 0; k < flat.length; k += 2) {
        pts.push([spec.x0 + flat[k] * spec.dx, spec.y0 + flat[k + 1] * spec.dy]);
      }
      return pts;
    }),
  }));
  return {
    points,
    spec,
    z: result.z,
    contours,
    summary: {
      nPoints: points.length,
      nx: spec.nx,
      ny: spec.ny,
      liveNodes: result.live,
      zMin: stats.min,
      zMax: stats.max,
      zMean: stats.mean,
      depthAtTarget: isNull(zAtTarget) ? null : zAtTarget,
      contourStep: step,
    },
  };
}

// ---- Advanced tier (NG7): grid validation. Leave-one-out only works
// for wells INSIDE the control hull (the gridder masks to the hull, so
// a removed edge well never sees a prediction at its own location);
// Ekene-6 is the only interior well. Then a blind test at the new
// appraisal well Ekene-7. Oracle-reproduced in Node before the NG7
// migration was seeded.
export function computeAdvanced() {
  const pts = topsToPoints(TEACHING_WELLS, TOP_NAME);
  const spec = specForPoints(pts, TEACHING_CELL_M, PAD_CELLS);
  const loo = pts.map((p, i) => {
    const rest = pts.filter((_, k) => k !== i);
    const z = gridSurface(rest, spec, { maxExtrapolation: MAX_EXTRAP_M }).z;
    const pred = sampleAtXY(z, spec, p.x, p.y);
    return {
      well: TEACHING_WELLS[i].name,
      actual: p.z,
      pred: isNull(pred) ? null : pred,
      resid: isNull(pred) ? null : pred - p.z,
    };
  });
  const validatable = loo.filter((r) => r.resid !== null);

  const base6 = gridSurface(pts, spec, { maxExtrapolation: MAX_EXTRAP_M }).z;
  const predE7 = sampleAtXY(base6, spec, E7.x, E7.y);
  const pts7 = [...pts, { x: E7.x, y: E7.y, z: E7.actual }];
  const spec7 = specForPoints(pts7, TEACHING_CELL_M, PAD_CELLS); // interior: frame unchanged
  const with7 = gridSurface(pts7, spec7, { maxExtrapolation: MAX_EXTRAP_M });
  let zmin7 = Infinity;
  for (const v of with7.z) if (!isNull(v) && v < zmin7) zmin7 = v;
  return {
    loo,
    crossValidatableWells: validatable.length,
    looResidE6: loo.find((r) => r.well === 'Ekene-6')?.resid ?? null,
    predAtE7: isNull(predE7) ? null : predE7,
    blindResidualE7: isNull(predE7) ? null : predE7 - E7.actual,
    zminWithE7: zmin7,
    liveWithE7: with7.live,
  };
}

// ---- Intermediate tier: two-surface math (isochore).
// Oracle-reproduced in Node before the NG6 migration was seeded.
export function computeIntermediate() {
  const topPts = topsToPoints(TEACHING_WELLS, TOP_NAME);
  const spec = specForPoints(topPts, TEACHING_CELL_M, PAD_CELLS);
  const topZ = gridSurface(topPts, spec, { maxExtrapolation: MAX_EXTRAP_M }).z;
  const baseZ = gridSurface(
    topsToPoints(TEACHING_WELLS, 'BASE_SAND'), spec, { maxExtrapolation: MAX_EXTRAP_M },
  ).z;
  const iso = isochore(baseZ, topZ);
  const stats = surfaceStats(iso);
  const atP1 = sampleAtXY(iso, spec, TARGET.x, TARGET.y);
  const wellThk = TEACHING_WELLS.map((w) => {
    const top = w.tops.find((t) => t.name === TOP_NAME).md_m;
    const base = w.tops.find((t) => t.name === 'BASE_SAND').md_m;
    return { name: w.name, thickness: base - top };
  });
  return {
    isoMin: stats.min,
    isoMax: stats.max,
    isoMean: stats.mean,
    isoLive: stats.count,
    isoAtP1: isNull(atP1) ? null : atP1,
    wellThk,
    meanWellThickness: wellThk.reduce((a, w) => a + w.thickness, 0) / wellThk.length,
  };
}

// ---- Panel drivers -------------------------------------------------------
// The two deep tiers each get one explorer panel. Both drive the same
// engines on whichever case the learner types, so a tile read on the
// capstone's case is the number the grader holds.

const BASE_NAME = 'BASE_SAND';

// Contours in world coordinates, for a grid that is already computed.
function contoursFor(z, spec, zMin, zMax) {
  if (!Number.isFinite(zMin) || !Number.isFinite(zMax) || zMin === zMax) {
    return { contours: [], step: null };
  }
  const { levels, step } = contourLevels(zMin, zMax, 10);
  const contours = levels.map((level) => ({
    level,
    // contourPolylines works in fractional (col,row) index space with
    // grid[i*nXl+j]; our z is z[r*nx+c], so nIl=ny, nXl=nx.
    lines: contourPolylines(z, spec.ny, spec.nx, level).map((flat) => {
      const pts = [];
      for (let k = 0; k < flat.length; k += 2) {
        pts.push([spec.x0 + flat[k] * spec.dx, spec.y0 + flat[k + 1] * spec.dy]);
      }
      return pts;
    }),
  }));
  return { contours, step };
}

const wellPick = (w, name) => w.tops.find((t) => t.name === name).md_m;

// ---- Intermediate panel: one frame, two surfaces, and their difference.
export const ISO_CELLS = [50, TEACHING_CELL_M, 200];
export const SURFACE_KEYS = [TOP_NAME, BASE_NAME, 'ISOCHORE'];

// Grid both Ekene surfaces on one frame at the given cell, subtract them,
// and return whichever of the three the learner asked to see. The well
// posting is the measured value: a pick on the depth surfaces, and base
// minus top on the isochore, computed without any gridding.
export function computeIsochoreMap(cellM, surfaceKey, kase = null) {
  const { wells, target: TARGET_ } = caseOf(kase);
  const topPts = topsToPoints(wells, TOP_NAME);
  const spec = specForPoints(topPts, Number(cellM), PAD_CELLS);
  const opts = { maxExtrapolation: MAX_EXTRAP_M };
  const topZ = gridSurface(topPts, spec, opts).z;
  const baseZ = gridSurface(topsToPoints(wells, BASE_NAME), spec, opts).z;
  const isoZ = isochore(baseZ, topZ);

  const z = surfaceKey === TOP_NAME ? topZ : (surfaceKey === BASE_NAME ? baseZ : isoZ);
  const stats = surfaceStats(z);
  const sampled = sampleAtXY(z, spec, TARGET_.x, TARGET_.y);
  const { contours, step } = contoursFor(z, spec, stats.min, stats.max);

  const posted = wells.map((w) => {
    const top = wellPick(w, TOP_NAME);
    const base = wellPick(w, BASE_NAME);
    const value = surfaceKey === TOP_NAME ? top : (surfaceKey === BASE_NAME ? base : base - top);
    const atWell = sampleAtXY(z, spec, w.surface_x, w.surface_y);
    return {
      name: w.name, x: w.surface_x, y: w.surface_y, value,
      mapped: isNull(atWell) ? null : atWell,
    };
  });
  const wellMean = posted.reduce((a, p) => a + p.value, 0) / posted.length;
  let above = 0;
  for (const v of z) if (!isNull(v) && v > wellMean) above += 1;

  return {
    spec,
    z,
    contours,
    posted,
    summary: {
      surface: surfaceKey,
      cellM: Number(cellM),
      nx: spec.nx,
      ny: spec.ny,
      nNodes: spec.nx * spec.ny,
      liveNodes: stats.count,
      min: stats.min,
      max: stats.max,
      mapMean: stats.mean,
      atTarget: isNull(sampled) ? null : sampled,
      contourStep: step,
      wellMean,
      mapMinusWell: stats.mean === null ? null : stats.mean - wellMean,
      nodesAboveWellMean: above,
    },
  };
}

// ---- Advanced panel: the same surface under eight control sets.
export const ALL_SIX = 'all6';
export const PLUS_SEVEN = 'plus7';

/** The control sets for a case: all its wells, each one withheld, and all plus the appraisal well. */
export function controlSetsFor(kase = null) {
  const { wells, e7 } = caseOf(kase);
  return [
    { key: ALL_SIX, label: `All ${wells.length} wells` },
    ...wells.map((w) => ({ key: `drop:${w.name}`, label: `Without ${w.name}` })),
    { key: PLUS_SEVEN, label: `All plus ${e7.name}` },
  ];
}

export const CONTROL_SETS = controlSetsFor();

const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

// Every control set is gridded on the SAME frame as the six-well map, so
// a change in the live node count is a change in what the control
// supports rather than a change of frame.
export function computeValidationMap(setKey, kase = null, cellM = TEACHING_CELL_M) {
  const { wells, target: TARGET_, e7: E7_ } = caseOf(kase);
  const sixPts = topsToPoints(wells, TOP_NAME);
  const spec = specForPoints(sixPts, Number(cellM), PAD_CELLS);
  const opts = { maxExtrapolation: MAX_EXTRAP_M };
  const e7pt = { x: E7_.x, y: E7_.y, z: E7_.actual, name: E7_.name };
  const named = sixPts.map((p, i) => ({ ...p, name: wells[i].name }));

  let control = named;
  let withheld = null;
  if (setKey === PLUS_SEVEN) {
    control = [...named, e7pt];
  } else if (setKey.startsWith('drop:')) {
    const name = setKey.slice(5);
    control = named.filter((p) => p.name !== name);
    const out = named.find((p) => p.name === name);
    withheld = out ? { ...out } : null;
  }

  const grid = gridSurface(control, spec, opts);
  const stats = surfaceStats(grid.z);
  const atTarget = sampleAtXY(grid.z, spec, TARGET_.x, TARGET_.y);
  const { contours, step } = contoursFor(grid.z, spec, stats.min, stats.max);

  // How many of the current control wells could be dropped and still be
  // predicted at their own location? On this geometry that is the count
  // of wells inside the hull of the others.
  let crossValidatable = 0;
  for (const p of control) {
    const rest = control.filter((q) => q !== p);
    const z = gridSurface(rest, spec, opts).z;
    if (!isNull(sampleAtXY(z, spec, p.x, p.y))) crossValidatable += 1;
  }

  // The tested well is the withheld one, or Ekene-7 when it has just
  // been added: in both cases a pick the six-well map did not use.
  const tested = withheld || (setKey === PLUS_SEVEN ? e7pt : null);
  let pred = null;
  let nearest = null;
  if (tested) {
    if (setKey === PLUS_SEVEN) {
      // The blind prediction is the one the SIX-well map made, before
      // this well joined the control set.
      const six = gridSurface(named, spec, opts).z;
      const v = sampleAtXY(six, spec, tested.x, tested.y);
      pred = isNull(v) ? null : v;
      nearest = Math.min(...named.map((p) => dist(p.x, p.y, tested.x, tested.y)));
    } else {
      const v = sampleAtXY(grid.z, spec, tested.x, tested.y);
      pred = isNull(v) ? null : v;
      nearest = Math.min(...control.map((p) => dist(p.x, p.y, tested.x, tested.y)));
    }
  }

  return {
    spec,
    z: grid.z,
    contours,
    control,
    withheld,
    tested,
    summary: {
      setKey,
      nControl: control.length,
      liveNodes: grid.live,
      crossValidatable,
      crest: stats.min,
      deepest: stats.max,
      mapMean: stats.mean,
      atTarget: isNull(atTarget) ? null : atTarget,
      contourStep: step,
      testedName: tested ? tested.name : null,
      actual: tested ? tested.z : null,
      pred,
      resid: pred === null || !tested ? null : pred - tested.z,
      nearestControlM: nearest,
    },
  };
}
