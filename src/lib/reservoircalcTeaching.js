// ReservoirCalc teaching workflow — contact-based volumetrics over the
// Ekene teaching field. Both structural surfaces (TOP_SAND, BASE_SAND —
// the same tops the correlation course picks and the mapping course
// grids) are gridded with the central engines, the oil column is
// clipped against the OWC, and the central zoneVolumes engine sums
// GRV → net → pore → HCPV; STOIIP follows with the given Bo. The
// oracle was reproduced by running exactly this pipeline in Node
// before the migration was seeded.
import { topsToPoints, specForPoints } from '@petrolord/engines/engines/mapping/surface.js';
import { gridSurface } from '@petrolord/engines/lib/gridding/gridding.js';
import { isNull, sampleAtXY } from '@petrolord/engines/lib/gridding/gridmath.js';
import { zoneVolumes } from '@petrolord/engines/engines/earthmodeling/volumes.js';

// The Ekene wells with both SAND surfaces. W1–W4 base picks match the
// correlation course fixture exactly (thickness 32/36/29/25 m).
export const TEACHING_WELLS = [
  { name: 'Ekene-1', surface_x: 1000, surface_y: 1000, tops: [{ name: 'TOP_SAND', md_m: 1548 }, { name: 'BASE_SAND', md_m: 1580 }] },
  { name: 'Ekene-2', surface_x: 2200, surface_y: 1150, tops: [{ name: 'TOP_SAND', md_m: 1565 }, { name: 'BASE_SAND', md_m: 1601 }] },
  { name: 'Ekene-3', surface_x: 1400, surface_y: 2300, tops: [{ name: 'TOP_SAND', md_m: 1541 }, { name: 'BASE_SAND', md_m: 1570 }] },
  { name: 'Ekene-4', surface_x: 2600, surface_y: 2500, tops: [{ name: 'TOP_SAND', md_m: 1590 }, { name: 'BASE_SAND', md_m: 1615 }] },
  { name: 'Ekene-5', surface_x: 600,  surface_y: 1900, tops: [{ name: 'TOP_SAND', md_m: 1552 }, { name: 'BASE_SAND', md_m: 1583 }] },
  { name: 'Ekene-6', surface_x: 1900, surface_y: 1800, tops: [{ name: 'TOP_SAND', md_m: 1546 }, { name: 'BASE_SAND', md_m: 1580 }] },
];

export const CELL_M = 100;
export const MAX_EXTRAP_M = 800;
export const CAPSTONE_OWC_M = 1560;      // the capstone's contact
export const OWC_OPTIONS = [1550, 1560, 1570];
// Given reservoir properties (Beginner tier: constants, as a lab would
// hand them out; per-node property grids arrive at higher tiers).
export const PROPS = { ntg: 0.8, phi: 0.20, sw: 0.35, bo: 1.2 };
export const M3_TO_STB = 6.2898;

// Grid both surfaces once — they do not depend on the OWC.
function buildSurfaces() {
  const topPts = topsToPoints(TEACHING_WELLS, 'TOP_SAND');
  const spec = specForPoints(topPts, CELL_M, 2);
  const top = gridSurface(topPts, spec, { maxExtrapolation: MAX_EXTRAP_M }).z;
  const base = gridSurface(
    topsToPoints(TEACHING_WELLS, 'BASE_SAND'), spec, { maxExtrapolation: MAX_EXTRAP_M },
  ).z;
  return { spec, top, base, topPts };
}
const SURFACES = buildSurfaces();

// Volumetrics above a given contact.
export function computeVolumes(owcM) {
  const { spec, top, base, topPts } = SURFACES;
  const owc = Number(owcM);
  const n = top.length;
  const thick = new Float32Array(n).fill(1e30);
  let maxCol = 0;
  let oilNodes = [];
  for (let j = 0; j < n; j++) {
    if (isNull(top[j]) || isNull(base[j])) continue;
    const t = Math.min(base[j], owc) - top[j];
    if (t <= 0) continue;
    thick[j] = t;
    if (t > maxCol) maxCol = t;
    oilNodes.push({ j, t });
  }
  const mk = (v) => new Float32Array(n).fill(v);
  const vols = zoneVolumes(spec, thick, null, {
    ntg: mk(PROPS.ntg), phi: mk(PROPS.phi), sw: mk(PROPS.sw),
  });
  const tot = vols.total || { bulk_m3: 0, net_m3: 0, pore_m3: 0, hcpv_m3: 0, cells: 0 };
  const stoiipStb = (tot.hcpv_m3 / PROPS.bo) * M3_TO_STB;
  return {
    spec,
    topPts,
    oilNodes,
    maxCol,
    summary: {
      oilCells: tot.cells,
      maxOilColumn: maxCol,
      grvMm3: tot.bulk_m3 / 1e6,
      netMm3: tot.net_m3 / 1e6,
      poreMm3: tot.pore_m3 / 1e6,
      hcpvMm3: tot.hcpv_m3 / 1e6,
      stoiipMmstb: stoiipStb / 1e6,
    },
  };
}

// ---- Advanced tier (NG7): per-node property modeling, as the
// Beginner-tier comment promised. A porosity trend surface is fitted
// to the six well values with the central population engine and the
// volumetrics rerun at the capstone contact; the delta against the
// constant-porosity booking is the lesson. Oracle-reproduced in Node
// before the NG7 migration was seeded.
import { populate, planeFit } from '@petrolord/engines/engines/earthmodeling/properties.js';

export const WELL_PHI = {
  'Ekene-1': 0.22, 'Ekene-2': 0.19, 'Ekene-3': 0.23,
  'Ekene-4': 0.17, 'Ekene-5': 0.21, 'Ekene-6': 0.22,
};
export const P1 = { x: 1600, y: 1600 };

export function computeAdvanced(owcM = CAPSTONE_OWC_M) {
  const { spec, top, base, topPts } = SURFACES;
  const owc = Number(owcM);
  const phiPts = TEACHING_WELLS.map((w) => ({
    x: w.surface_x, y: w.surface_y, v: WELL_PHI[w.name],
  }));
  const phiGrid = populate(spec, 'trend', phiPts);
  const n = top.length;
  const thick = new Float32Array(n).fill(1e30);
  let phiSum = 0;
  let phiN = 0;
  for (let j = 0; j < n; j++) {
    if (isNull(top[j]) || isNull(base[j])) continue;
    const t = Math.min(base[j], owc) - top[j];
    if (t <= 0) continue;
    thick[j] = t;
    phiSum += phiGrid[j];
    phiN += 1;
  }
  const mk = (v) => new Float32Array(n).fill(v);
  const vols = zoneVolumes(spec, thick, null, {
    ntg: mk(PROPS.ntg), phi: phiGrid, sw: mk(PROPS.sw),
  });
  const volsConst = zoneVolumes(spec, thick, null, {
    ntg: mk(PROPS.ntg), phi: mk(PROPS.phi), sw: mk(PROPS.sw),
  });
  const empty = { bulk_m3: 0, net_m3: 0, pore_m3: 0, hcpv_m3: 0, cells: 0 };
  const stoiip = (b) => ((b.hcpv_m3 / PROPS.bo) * M3_TO_STB) / 1e6;
  const tot = vols.total || empty;
  const stoiipTrend = stoiip(tot);
  const stoiipConst = stoiip(volsConst.total || empty);
  return {
    spec,
    topPts,
    phiPts,
    phiAtP1: sampleAtXY(phiGrid, spec, P1.x, P1.y),
    phiMeanOil: phiSum / phiN,
    poreTrendMm3: tot.pore_m3 / 1e6,
    hcpvTrendMm3: tot.hcpv_m3 / 1e6,
    stoiipTrendMmstb: stoiipTrend,
    stoiipConstMmstb: stoiipConst,
    stoiipDeltaMmstb: stoiipTrend - stoiipConst,
    oilCells: tot.cells,
  };
}

// ---- Intermediate tier: fault-block volumes.
// A sealing fault at x = FAULT_X_M splits the accumulation; zoneVolumes
// sums each block separately via its labels argument. The blocks must
// sum to the Beginner-tier field total. Oracle-reproduced in Node
// before the NG6 migration was seeded.
export const FAULT_X_M = 1800;

export function computeIntermediate(owcM) {
  const { spec, top, base, topPts } = SURFACES;
  const owc = Number(owcM);
  const n = top.length;
  const thick = new Float32Array(n).fill(1e30);
  const labels = new Int32Array(n);
  const blockNodes = [];
  for (let j = 0; j < n; j++) {
    const c = j % spec.nx;
    const west = spec.x0 + c * spec.dx < FAULT_X_M;
    labels[j] = west ? 0 : 1;
    if (isNull(top[j]) || isNull(base[j])) continue;
    const t = Math.min(base[j], owc) - top[j];
    if (t <= 0) continue;
    thick[j] = t;
    blockNodes.push({ j, t, west });
  }
  const mk = (v) => new Float32Array(n).fill(v);
  const vols = zoneVolumes(spec, thick, labels, {
    ntg: mk(PROPS.ntg), phi: mk(PROPS.phi), sw: mk(PROPS.sw),
  });
  const empty = { bulk_m3: 0, net_m3: 0, pore_m3: 0, hcpv_m3: 0, cells: 0 };
  const stoiip = (b) => ((b.hcpv_m3 / PROPS.bo) * M3_TO_STB) / 1e6;
  const west = vols['0'] || empty;
  const east = vols['1'] || empty;
  return {
    spec,
    topPts,
    blockNodes,
    west: { cells: west.cells, grvMm3: west.bulk_m3 / 1e6, stoiipMmstb: stoiip(west) },
    east: { cells: east.cells, grvMm3: east.bulk_m3 / 1e6, stoiipMmstb: stoiip(east) },
    totalStoiipMmstb: stoiip(vols.total || empty),
  };
}

// ---- DC22 (Professional): the compartment model.
// The same accumulation partitioned by a sealing fault at an easting the
// learner chooses, with an independent contact per block. zoneVolumes does
// the partition through its labels argument; nothing about the map, the
// properties or the chain changes. Oracle-reproduced in Node against the
// live NG6 answer key before the seed migration was written.
export const FAULT_SWEEP_M = [
  800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600,
  1700, 1800, 1900, 2000, 2100, 2200, 2300,
];
export const BLOCK_OWC_OPTIONS = [1550, 1560, 1570];

function packBlock(b, cols) {
  const empty = { bulk_m3: 0, net_m3: 0, pore_m3: 0, hcpv_m3: 0, cells: 0 };
  const s = b || empty;
  const n = cols.length;
  return {
    cells: s.cells,
    grvMm3: s.bulk_m3 / 1e6,
    netMm3: s.net_m3 / 1e6,
    poreMm3: s.pore_m3 / 1e6,
    hcpvMm3: s.hcpv_m3 / 1e6,
    stoiipMmstb: ((s.hcpv_m3 / PROPS.bo) * M3_TO_STB) / 1e6,
    meanCol: n ? cols.reduce((a, t) => a + t, 0) / n : 0,
    maxCol: n ? cols.reduce((a, t) => Math.max(a, t), 0) : 0,
  };
}

/**
 * Fault-block volumes. A node belongs to the west block when its easting
 * is strictly less than faultX, so a fault that lands on a node column
 * puts that whole column in the east: the tie break is a convention, and
 * the panel makes it visible.
 */
export function computeBlockModel(faultX = FAULT_X_M, owcWest = CAPSTONE_OWC_M, owcEast = owcWest) {
  const { spec, top, base, topPts } = SURFACES;
  const fx = Number(faultX);
  const n = top.length;
  const thick = new Float32Array(n).fill(1e30);
  const labels = new Int32Array(n);
  const blockNodes = [];
  const cols = { west: [], east: [] };
  let onFaultColumn = 0;
  for (let j = 0; j < n; j++) {
    const c = j % spec.nx;
    const x = spec.x0 + c * spec.dx;
    const west = x < fx;
    labels[j] = west ? 0 : 1;
    if (isNull(top[j]) || isNull(base[j])) continue;
    const t = Math.min(base[j], west ? Number(owcWest) : Number(owcEast)) - top[j];
    if (t <= 0) continue;
    thick[j] = t;
    blockNodes.push({ j, t, west });
    cols[west ? 'west' : 'east'].push(t);
    if (x === fx) onFaultColumn += 1;
  }
  const mk = (v) => new Float32Array(n).fill(v);
  const vols = zoneVolumes(spec, thick, labels, {
    ntg: mk(PROPS.ntg), phi: mk(PROPS.phi), sw: mk(PROPS.sw),
  });
  const west = packBlock(vols['0'], cols.west);
  const east = packBlock(vols['1'], cols.east);
  const total = packBlock(vols.total, [...cols.west, ...cols.east]);
  return {
    spec,
    topPts,
    blockNodes,
    faultX: fx,
    faultOnNode: (fx - spec.x0) % spec.dx === 0 && fx >= spec.x0
      && fx <= spec.x0 + (spec.nx - 1) * spec.dx,
    onFaultColumnCells: onFaultColumn,
    west,
    east,
    total,
    // Booked separately, the blocks do not have to add to the field total
    // bit for bit: zoneVolumes keeps a separate accumulator for "total".
    sumStoiipMmstb: west.stoiipMmstb + east.stoiipMmstb,
    stoiipSumResidual: (west.stoiipMmstb + east.stoiipMmstb) - total.stoiipMmstb,
    wells: TEACHING_WELLS.map((w) => ({
      name: w.name,
      x: w.surface_x,
      y: w.surface_y,
      west: w.surface_x < fx,
      top: w.tops.find((t) => t.name === 'TOP_SAND').md_m,
      base: w.tops.find((t) => t.name === 'BASE_SAND').md_m,
    })),
  };
}

// ---- DC23 (Expert): the property model.
// The constant porosity is replaced by a grid populated from the six well
// values. 'trend' is a least-squares PLANE, so it honours no well exactly;
// 'krige' honours the data; 'constant' is the arithmetic well mean. The
// three means the model admits are computed side by side because choosing
// between them is the tier's whole subject. Oracle-reproduced in Node
// against the live NG7 answer key.

export const PROPERTY_METHODS = ['constant', 'trend', 'krige'];
// Illustration variogram for the krige comparison. These are teaching
// parameters, not part of any graded answer.
export const KRIGE_PARAMS = { model: 'spherical', range: 1500, sill: 1, nugget: 0 };

export function computePropertyModel(method = 'trend', owcM = CAPSTONE_OWC_M) {
  const { spec, top, base, topPts } = SURFACES;
  const owc = Number(owcM);
  const phiPts = TEACHING_WELLS.map((w) => ({
    x: w.surface_x, y: w.surface_y, v: WELL_PHI[w.name],
  }));
  const grid = populate(spec, method, phiPts, KRIGE_PARAMS);
  const [a, b, c] = planeFit(phiPts);

  const n = top.length;
  const thick = new Float32Array(n).fill(1e30);
  const oilNodes = [];
  let phiSum = 0;
  let tSum = 0;
  let tPhiSum = 0;
  for (let j = 0; j < n; j++) {
    if (isNull(top[j]) || isNull(base[j])) continue;
    const t = Math.min(base[j], owc) - top[j];
    if (t <= 0) continue;
    thick[j] = t;
    oilNodes.push({ j, t, phi: grid[j] });
    phiSum += grid[j];
    tSum += t;
    tPhiSum += t * grid[j];
  }
  const mk = (v) => new Float32Array(n).fill(v);
  const vGrid = zoneVolumes(spec, thick, null, {
    ntg: mk(PROPS.ntg), phi: grid, sw: mk(PROPS.sw),
  });
  const vConst = zoneVolumes(spec, thick, null, {
    ntg: mk(PROPS.ntg), phi: mk(PROPS.phi), sw: mk(PROPS.sw),
  });
  const wellMean = phiPts.reduce((s, p) => s + p.v, 0) / phiPts.length;
  const vWellMean = zoneVolumes(spec, thick, null, {
    ntg: mk(PROPS.ntg), phi: mk(wellMean), sw: mk(PROPS.sw),
  });
  const pack = packBlock;
  const model = pack(vGrid.total, []);
  const constant = pack(vConst.total, []);
  const atWellMean = pack(vWellMean.total, []);

  // Correlation between the modelled porosity and the oil column it is
  // multiplying: the sign of the whole uplift lives here.
  const mT = tSum / oilNodes.length;
  const mP = phiSum / oilNodes.length;
  let sxy = 0; let sxx = 0; let syy = 0;
  for (const o of oilNodes) {
    sxy += (o.t - mT) * (o.phi - mP);
    sxx += (o.t - mT) ** 2;
    syy += (o.phi - mP) ** 2;
  }

  return {
    spec,
    topPts,
    method,
    grid,
    oilNodes,
    plane: { a, b, c },
    residuals: phiPts.map((p, i) => ({
      name: TEACHING_WELLS[i].name,
      x: p.x,
      y: p.y,
      measured: p.v,
      modelled: sampleAtXY(grid, spec, p.x, p.y),
    })),
    phiAtP1: sampleAtXY(grid, spec, P1.x, P1.y),
    means: {
      arithmeticWells: wellMean,
      nodeMeanOverOil: phiSum / oilNodes.length,
      volumeWeighted: model.poreMm3 / model.netMm3,
      byHand: tPhiSum / tSum,
    },
    corrPhiColumn: sxy / Math.sqrt(sxx * syy),
    meanColumn: mT,
    model,
    constant,
    atWellMean,
    deltaMmstb: model.stoiipMmstb - constant.stoiipMmstb,
    ratio: model.stoiipMmstb / constant.stoiipMmstb,
    // The headline uplift splits into a part that is only a better
    // constant and a part that is genuinely spatial.
    fromBetterConstant: atWellMean.stoiipMmstb - constant.stoiipMmstb,
    fromSpatialVariation: model.stoiipMmstb - atWellMean.stoiipMmstb,
  };
}
