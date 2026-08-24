// Mapping teaching workflow — drives the central @petrolord/engines
// surface + gridding engines over the Ekene teaching wells (the same
// field the Well Correlation course sections; here with map
// coordinates and two extra wells beyond the section line). The engine
// is consumed as-is; this module holds the fixture, the fixed capstone
// settings and the summary-panel numbers. The oracle was reproduced by
// running exactly this pipeline in Node before the migration was seeded.
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
export const CAPSTONE_CELL_M = 100;      // the capstone's grid cell
export const PAD_CELLS = 2;
export const MAX_EXTRAP_M = 800;         // wells are ~1 km apart
export const TARGET = { x: 1600, y: 1600, label: 'P-1' }; // prospect location

// Grid the teaching surface at a given cell size and compute everything
// the map view and the capstone reading need.
export function computeMap(cellM) {
  const points = topsToPoints(TEACHING_WELLS, TOP_NAME);
  const spec = specForPoints(points, Number(cellM), PAD_CELLS);
  const result = gridSurface(points, spec, { maxExtrapolation: MAX_EXTRAP_M });
  const stats = surfaceStats(result.z);
  const zAtTarget = sampleAtXY(result.z, spec, TARGET.x, TARGET.y);
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
export const E7 = { name: 'Ekene-7', x: 1500, y: 1500, actual: 1549 };

export function computeAdvanced() {
  const pts = topsToPoints(TEACHING_WELLS, TOP_NAME);
  const spec = specForPoints(pts, CAPSTONE_CELL_M, PAD_CELLS);
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
  const spec7 = specForPoints(pts7, CAPSTONE_CELL_M, PAD_CELLS); // interior: frame unchanged
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
  const spec = specForPoints(topPts, CAPSTONE_CELL_M, PAD_CELLS);
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
// engines the capstones do, so a tile a learner reads is the number the
// grader holds. Neither of these is used by the capstone itself.

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
export const ISO_CELLS = [50, CAPSTONE_CELL_M, 200];
export const SURFACE_KEYS = [TOP_NAME, BASE_NAME, 'ISOCHORE'];

// Grid both Ekene surfaces on one frame at the given cell, subtract them,
// and return whichever of the three the learner asked to see. The well
// posting is the measured value: a pick on the depth surfaces, and base
// minus top on the isochore, computed without any gridding.
export function computeIsochoreMap(cellM, surfaceKey) {
  const topPts = topsToPoints(TEACHING_WELLS, TOP_NAME);
  const spec = specForPoints(topPts, Number(cellM), PAD_CELLS);
  const opts = { maxExtrapolation: MAX_EXTRAP_M };
  const topZ = gridSurface(topPts, spec, opts).z;
  const baseZ = gridSurface(topsToPoints(TEACHING_WELLS, BASE_NAME), spec, opts).z;
  const isoZ = isochore(baseZ, topZ);

  const z = surfaceKey === TOP_NAME ? topZ : (surfaceKey === BASE_NAME ? baseZ : isoZ);
  const stats = surfaceStats(z);
  const sampled = sampleAtXY(z, spec, TARGET.x, TARGET.y);
  const { contours, step } = contoursFor(z, spec, stats.min, stats.max);

  const posted = TEACHING_WELLS.map((w) => {
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

export const CONTROL_SETS = [
  { key: ALL_SIX, label: 'All six wells' },
  ...TEACHING_WELLS.map((w) => ({ key: `drop:${w.name}`, label: `Without ${w.name}` })),
  { key: PLUS_SEVEN, label: `Six plus ${E7.name}` },
];

const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

// Every control set is gridded on the SAME frame as the six-well map, so
// a change in the live node count is a change in what the control
// supports rather than a change of frame.
export function computeValidationMap(setKey) {
  const sixPts = topsToPoints(TEACHING_WELLS, TOP_NAME);
  const spec = specForPoints(sixPts, CAPSTONE_CELL_M, PAD_CELLS);
  const opts = { maxExtrapolation: MAX_EXTRAP_M };
  const e7pt = { x: E7.x, y: E7.y, z: E7.actual, name: E7.name };
  const named = sixPts.map((p, i) => ({ ...p, name: TEACHING_WELLS[i].name }));

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
  const atTarget = sampleAtXY(grid.z, spec, TARGET.x, TARGET.y);
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
