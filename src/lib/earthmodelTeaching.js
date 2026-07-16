// Earth Modeling teaching workflow — the golden three-surface model
// through the central earthmodeling engines. The teaching dataset IS
// the committed golden fixture (test-data/earthmodel/goldens.json):
// three source surfaces on THREE DIFFERENT grids resampled onto a
// 25x20 model frame (zone B pinches out - the clamp fixes 180 nodes
// on the base surface and reports every one), four wells (one truly
// deviated) tied to the framework, a fault polygon splitting the
// model into two blocks, and per-block property population
// (trend/kriging). Beginner builds the structural framework;
// Intermediate ties the wells through minimum-curvature trajectories;
// Advanced runs faults + population and reads per-block BULK rock
// volume. Division of labour (binding, from the G8 plan): fluids,
// contacts and STOIIP booking stay in the ReservoirCalc course - this
// course owns the container, not the barrels. The capstone oracle was
// reproduced by running exactly these pipelines in Node before the
// migration was seeded.
import goldens from '@petrolord/engines/test-data/earthmodel/goldens.json';
import { buildFramework, isNull } from '@petrolord/engines/engines/earthmodeling/framework.js';
import { wellTies, zoneControlPoints } from '@petrolord/engines/engines/earthmodeling/wellties.js';
import { labelBlocks, blockCensus, pointInPolygon } from '@petrolord/engines/engines/earthmodeling/blocks.js';
import { planeFit, simpleKrige, weightedMean } from '@petrolord/engines/engines/earthmodeling/properties.js';
import { zoneVolumes } from '@petrolord/engines/engines/earthmodeling/volumes.js';

export const MODEL_SPEC = goldens.model_spec;      // 25x20, 50 m cells
export const SURF_NAMES = ['TopA', 'TopB', 'BaseB'];
export const SURF_INDEX = { TopA: 0, TopB: 1, BaseB: 2 };
export const FAULT_POLYGON = goldens.fault_polygon;
export const POP = goldens.population;             // points + kriging params
export const CONTROL_POINTS_A = goldens.control_points_a;

// The three source surfaces, shallow to deep, each on its own grid.
const SURFACES = ['s1', 's2', 's3'].map((k) => ({
  z: goldens.source_grids[k],
  spec: goldens.source_specs[k],
}));

// Golden well fixtures mapped into the engine's input shape (head/
// tops/zones objects -> the registry-style arrays wellTies expects).
export const WELLS = Object.entries(goldens.wells).map(([name, w]) => ({
  name,
  x: w.head.x,
  y: w.head.y,
  kb_m: w.head.kb,
  deviation: w.deviation,
  tops: Object.entries(w.tops).map(([top, md]) => ({ name: top, md_m: md })),
  zones: Object.entries(w.zones).map(([zone, z]) => ({
    name: zone, top_md_m: z.top_md, base_md_m: z.base_md,
  })),
}));

const liveStats = (grid) => {
  let sum = 0; let max = -Infinity; let min = Infinity; let count = 0;
  for (let j = 0; j < grid.length; j++) {
    const v = grid[j];
    if (isNull(v)) continue;
    sum += v; count += 1;
    if (v > max) max = v;
    if (v < min) min = v;
  }
  return { mean: sum / count, max, min, count };
};

/** Beginner: resample + clamp the stack, zone thickness, bulk volume. */
export function computeFramework() {
  const fw = buildFramework(SURFACES, MODEL_SPEC);
  const bulkA = zoneVolumes(MODEL_SPEC, fw.thickness[0], null).total.bulk_m3;
  const bulkB = zoneVolumes(MODEL_SPEC, fw.thickness[1], null).total.bulk_m3;
  return {
    fw,
    s2Stats: liveStats(fw.clamped[1]),
    clampCounts: fw.counts,
    tkA: liveStats(fw.thickness[0]),
    tkB: liveStats(fw.thickness[1]),
    bulkA,
    bulkB,
  };
}

/** Intermediate: minimum-curvature ties against the framework. */
export function computeTies(fw) {
  const rows = wellTies(WELLS, fw.clamped, MODEL_SPEC, SURF_INDEX);
  const at = (well, top) => rows.find((r) => r.well === well && r.top === top);
  let worst = null;
  for (const r of rows) {
    if (r.residualM == null) continue;
    if (!worst || Math.abs(r.residualM) > Math.abs(worst.residualM)) worst = r;
  }
  const cpA = zoneControlPoints(WELLS, 'A');
  return { rows, at, worst, cpA };
}

/** Advanced: fault blocks, per-block population, per-block volumes. */
export function computeBlocksAndProperties(fw) {
  const labels = labelBlocks(MODEL_SPEC, [FAULT_POLYGON]);
  const census = blockCensus(labels);
  // Trend surface through the phi control points (exact plane recovery
  // on this fixture) probed at model nodes.
  const [a, b, c] = planeFit(POP.points);
  const trendAt = (x, y) => a + b * x + c * y;
  // Simple kriging with the golden spherical variogram; the far-field
  // prediction relaxes to the data mean, and at a well it IS the well.
  const params = POP.krige_spherical.params;
  const krigeAt = (x, y) => simpleKrige(POP.points, null, params, [[x, y]])[0];
  // Per-block phi from the zone-A control points (weight = interval).
  const inBlock1 = (p) => pointInPolygon(p.x, p.y, FAULT_POLYGON);
  const byBlock = { 0: CONTROL_POINTS_A.filter((p) => !inBlock1(p)), 1: CONTROL_POINTS_A.filter(inBlock1) };
  const phiBlock = (blk) => weightedMean(byBlock[blk].map((p) => p.phi), byBlock[blk].map((p) => p.w));
  const volsA = zoneVolumes(MODEL_SPEC, fw.thickness[0], labels);
  return {
    labels,
    census,
    trendAt,
    krigeAt,
    phiBlock0: phiBlock(0),
    phiBlock1: phiBlock(1),
    byBlock,
    volsA,
  };
}
