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
