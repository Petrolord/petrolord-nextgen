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
// course owns the container, not the barrels.
//
// The golden model is the TEACHING case: the panels open on it and the
// lessons work it. Since W5a (2026-09) each tier's capstone is a case of
// its own (a model frame, a well, a fault and variogram), stated in the
// brief and typed into the panels. Nothing in this file carries it, and
// panelCapstoneGuard.test.jsx checks that no number these functions give
// at their defaults lands on a graded answer.
import goldens from '@petrolord/engines/test-data/earthmodel/goldens.json';
import { buildFramework, isNull } from '@petrolord/engines/engines/earthmodeling/framework.js';
import { minCurvature, positionAtMd, wellTies, zoneControlPoints } from '@petrolord/engines/engines/earthmodeling/wellties.js';
import { labelBlocks, blockCensus, pointInPolygon } from '@petrolord/engines/engines/earthmodeling/blocks.js';
import { planeFit, simpleKrige, weightedMean, populateZoneProperty } from '@petrolord/engines/engines/earthmodeling/properties.js';
import { zoneVolumes } from '@petrolord/engines/engines/earthmodeling/volumes.js';
import { sampleAtXY } from '@petrolord/engines/lib/gridding/gridmath.js';

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

/** The model frame the three source surfaces all cover, so a typed frame
 *  inside it resamples without extrapolation. */
export const SOURCE_COVER = (() => {
  const specs = Object.values(goldens.source_specs);
  return {
    xMin: Math.max(...specs.map((q) => q.x0)),
    yMin: Math.max(...specs.map((q) => q.y0)),
    xMax: Math.min(...specs.map((q) => q.x0 + (q.nx - 1) * q.dx)),
    yMax: Math.min(...specs.map((q) => q.y0 + (q.ny - 1) * q.dy)),
  };
})();

/** Beginner: resample + clamp the stack, zone thickness, bulk volume, on
 *  the golden frame or on any frame the learner types. */
export function computeFramework(spec = MODEL_SPEC) {
  const fw = buildFramework(SURFACES, spec);
  const bulkA = zoneVolumes(spec, fw.thickness[0], null).total.bulk_m3;
  const bulkB = zoneVolumes(spec, fw.thickness[1], null).total.bulk_m3;
  return {
    spec,
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

// ---------------------------------------------------------------------------
// Deep-course panel drivers (DC28 Professional, DC29 Expert). Pure functions
// beside the tier drivers above, which stay untouched.

export const TIE_WELL_NAMES = Object.keys(goldens.wells);
export const KRIGE_PARAMS = goldens.population.krige_spherical.params;
export const NUGGET_OPTIONS = [0, 0.00025, 0.001, 0.002];
export const RANGE_OPTIONS = [300, 600, 900, 1800];
export const POPULATION_METHODS = ['krige', 'trend', 'constant'];
// The Population explorer's probe readout opens here, away from every graded
// probe location and the capstone case, so no default panel state prints a capstone answer.
export const PROBE_DEFAULT = { x: 2000, y: 2300 };

/** Professional panel: one well tied in detail. The panel's exposed
 *  assumption is the survey itself: vertical=true replaces the well's
 *  deviation with a straight vertical hole, which is what every tie
 *  silently assumes until a trajectory is built. */
/** A well typed by the learner, in the same shape as WELLS: a head, a
 *  three-station survey (vertical to the kick-off, built to an inclination
 *  and azimuth, held to TD) and the three top picks in MD. */
export function typedWell({ x, y, kb, kopMd, eobMd, tdMd, inc, azi, topA, topB, baseB, name = 'Typed well' }) {
  return {
    name,
    x,
    y,
    kb_m: kb,
    deviation: [{ md: kopMd, inc: 0, azi: 0 }, { md: eobMd, inc, azi }, { md: tdMd, inc, azi }],
    tops: [{ name: 'TopA', md_m: topA }, { name: 'TopB', md_m: topB }, { name: 'BaseB', md_m: baseB }],
    zones: [{ name: 'A', top_md_m: topA, base_md_m: topB }, { name: 'B', top_md_m: topB, base_md_m: baseB }],
  };
}

export function computeTieDetail(wellOrName, vertical = false) {
  const fw = buildFramework(SURFACES, MODEL_SPEC);
  const w = typeof wellOrName === 'string' ? WELLS.find((x) => x.name === wellOrName) : wellOrName;
  const wellName = w.name;
  const dev = vertical ? [{ md: 5000, inc: 0, azi: 0 }] : w.deviation;
  const traj = minCurvature(dev, w.kb_m, w.x, w.y);
  const trueTraj = minCurvature(w.deviation, w.kb_m, w.x, w.y);
  const lastMd = Math.max(...w.tops.map((t) => t.md_m));
  const path = [];
  for (let md = 1400; md <= lastMd + 20; md += 10) {
    path.push({ md, ...positionAtMd(traj, md) });
  }
  const rows = w.tops
    .slice()
    .sort((a, b) => a.md_m - b.md_m)
    .map((t) => {
      const pos = positionAtMd(traj, t.md_m);
      const tru = positionAtMd(trueTraj, t.md_m);
      const zs = sampleAtXY(fw.clamped[SURF_INDEX[t.name]], MODEL_SPEC, pos.x, pos.y);
      const live = !isNull(zs);
      return {
        top: t.name,
        md: t.md_m,
        x: pos.x,
        y: pos.y,
        tvdss: pos.tvdss,
        surfaceZ: live ? zs : null,
        residualM: live ? pos.tvdss - zs : null,
        lateralM: Math.hypot(tru.x - w.x, tru.y - w.y),
      };
    });
  // Surfaces along an east-west window at the well's y, for the section.
  const xs = path.map((p) => p.x);
  const x0 = Math.min(...xs) - 120;
  const x1 = Math.max(...xs) + 220;
  const section = [];
  for (let i = 0; i <= 40; i++) {
    const x = x0 + ((x1 - x0) * i) / 40;
    const at = (idx) => {
      const v = sampleAtXY(fw.clamped[idx], MODEL_SPEC, x, w.y);
      return isNull(v) ? null : v;
    };
    section.push({ x, topA: at(0), topB: at(1), baseB: at(2) });
  }
  // The worst residual across the whole (true-survey) well set.
  const all = wellTies(WELLS, fw.clamped, MODEL_SPEC, SURF_INDEX);
  let worstAll = null;
  for (const r of all) {
    if (r.residualM == null) continue;
    if (!worstAll || Math.abs(r.residualM) > Math.abs(worstAll.residualM)) worstAll = r;
  }
  const cp = zoneControlPoints([{ ...w, deviation: dev }], 'A').find((c) => c.well === wellName);
  // The worst residual among this well's own picks.
  let worstOwn = null;
  for (const r of rows) {
    if (r.residualM == null) continue;
    if (!worstOwn || Math.abs(r.residualM) > Math.abs(worstOwn.residualM)) worstOwn = r;
  }
  return { well: w, vertical, path, rows, section, worstAll, worstOwn, cp };
}

/** Expert panel: label the model with the fault polygon and populate
 *  zone-A porosity per block, with the method and the variogram's two
 *  assumed numbers exposed as controls. */
export const PROFILE_Y_DEFAULT = 2200;

/** Parse "x,y; x,y; ..." into a vertex list; null unless every vertex is two finite numbers and there are at least three. */
export function parsePolygon(text) {
  const verts = String(text).split(';').map((pair) => pair.trim()).filter(Boolean)
    .map((pair) => pair.split(',').map((v) => Number(v.trim())));
  if (verts.length < 3 || !verts.every((v) => v.length === 2 && v.every(Number.isFinite))) return null;
  return verts;
}

export const polygonText = (verts) => verts.map(([x, y]) => `${x},${y}`).join('; ');

export function computePopulation(method = 'krige', nugget = KRIGE_PARAMS.nugget, range = KRIGE_PARAMS.range,
  polygon = FAULT_POLYGON, rowY = PROFILE_Y_DEFAULT) {
  const fw = buildFramework(SURFACES, MODEL_SPEC);
  const labels = labelBlocks(MODEL_SPEC, [polygon]);
  const census = blockCensus(labels);
  const inBlock1 = (p) => pointInPolygon(p.x, p.y, polygon);
  const pts = CONTROL_POINTS_A.map((p) => ({ x: p.x, y: p.y, v: p.phi, w: p.w, well: p.well }));
  const byBlock = { 0: pts.filter((p) => !inBlock1(p)), 1: pts.filter(inBlock1) };
  const params = { ...KRIGE_PARAMS, nugget, range };
  const { z, provenance } = populateZoneProperty(MODEL_SPEC, labels, byBlock, pts, method, params);
  const profileRow = Math.max(0, Math.min(MODEL_SPEC.ny - 1, Math.round((rowY - MODEL_SPEC.y0) / MODEL_SPEC.dy)));
  const profile = [];
  for (let c = 0; c < MODEL_SPEC.nx; c++) {
    const j = profileRow * MODEL_SPEC.nx + c;
    profile.push({ x: MODEL_SPEC.x0 + c * MODEL_SPEC.dx, phi: z[j], block: labels[j] });
  }
  const phiBlock = (b) => (byBlock[b].length
    ? weightedMean(byBlock[b].map((p) => p.v), byBlock[b].map((p) => p.w)) : NaN);
  const volsA = zoneVolumes(MODEL_SPEC, fw.thickness[0], labels);
  // The jump across the fault on this row: at the first place the block
  // label changes along the row, the block 0 node minus the block 1 node.
  let jump = null;
  for (let c = 0; c + 1 < profile.length; c++) {
    const a = profile[c];
    const b = profile[c + 1];
    if (a.block !== b.block && Number.isFinite(a.phi) && Number.isFinite(b.phi)) {
      const b0 = a.block === 0 ? a : b;
      const b1 = a.block === 0 ? b : a;
      jump = { value: b0.phi - b1.phi, xBlock0: b0.x, xBlock1: b1.x };
      break;
    }
  }
  const [ta, tb, tc] = planeFit(pts);
  const krigeAt = (x, y) => simpleKrige(pts, null, params, [[x, y]])[0];
  return {
    labels,
    census,
    byBlock,
    // simple kriging at any (x, y) with this call's variogram: the panel's
    // probe readout, whose default location is not a graded probe point
    krigeAt,
    provenance,
    profile,
    profileY: MODEL_SPEC.y0 + profileRow * MODEL_SPEC.dy,
    jump,
    polygon,
    phiBlock0: phiBlock(0),
    phiBlock1: phiBlock(1),
    volsA,
    trend: { a: ta, b: tb, c: tc, at: (x, y) => ta + tb * x + tc * y },
    probes: {
      trendProbe: ta + tb * 1250 + tc * 2250,
      krigeProbe: krigeAt(1500, 2500),
      krigeAtW1: krigeAt(1100, 2100),
      far: krigeAt(9999, 9999),
    },
    arithmeticMean: weightedMean(pts.map((p) => p.v)),
    weightedConstant: weightedMean(pts.map((p) => p.v), pts.map((p) => p.w)),
  };
}
