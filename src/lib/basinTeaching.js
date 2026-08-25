// Basin & Charge teaching workflow — the golden reference basin
// through the central basin engines (extracted from the Suite's
// BasinFlow Genesis in petrolord-engines PR #1; Sclater-Christie
// decompaction, backward-Euler heat transport, Sweeney-Burnham
// Easy%Ro + kerogen kinetics, saturation-bucket expulsion). The
// teaching dataset IS the committed golden fixture
// (test-data/basin/goldens.json, independent stdlib-Python oracle
// with self-asserted anchors): decompaction cases, the two-layer
// steady heat column, the Easy%Ro ramps, isothermal kerogen TR, and
// the four-layer reference basin with a 600 m erosion event and a
// cooling 80 to 60 mW/m2 heat-flow history. Beginner builds burial
// and heat; Intermediate runs the maturity kinetics; Advanced runs
// the FULL forward model and reads charge plus the erosion signature
// (rerunning without the event). The capstone oracle was reproduced
// by running exactly these pipelines in Node before the migration
// was seeded.
import goldens from '@petrolord/engines/test-data/basin/goldens.json';
import { SimulationEngine } from '@petrolord/engines/engines/basin/SimulationEngine.js';
import { BurialCompactionEngine } from '@petrolord/engines/engines/basin/BurialCompactionEngine.js';
import { ExpulsionEngine } from '@petrolord/engines/engines/basin/ExpulsionEngine.js';
import { HeatTransportEngine } from '@petrolord/engines/engines/basin/HeatTransportEngine.js';
import { MaturityEngine } from '@petrolord/engines/engines/basin/MaturityEngine.js';
import { getCompactionParams } from '@petrolord/engines/engines/basin/CompactionModelLibrary.js';
import { EasyRoWeights, EasyRoFrequencyFactor, KerogenKinetics } from '@petrolord/engines/engines/basin/KerogenLibrary.js';
import { Spec } from '@petrolord/engines/engines/basin/PhysicsUtils.js';

export const PROJECT = goldens.reference_basin.project;
export const GOLDEN_SERIES = goldens.reference_basin.series;
export const HEAT_FIXTURE = goldens.heat_two_layer_steady;
export const TYPE2_POTENTIALS = goldens.kerogen_isothermal_tr[0].potentials;
export const RAMP_RATES = [1.0, 3.0, 10.0];
export const CAPSTONE_RAMP = 3.0;

/** Beginner: compaction geometry + the steady two-layer heat column. */
export function computeBurialHeat() {
  const shale = getCompactionParams('shale');
  // Solid (grain) thickness of 100 m of freshly deposited shale.
  const solid100 = BurialCompactionEngine.solidThickness(0, 100, shale.phi0, shale.c);
  // A 100 m shale buried to 1000 m, restored to the surface: derive its
  // solid thickness in place, then re-decompact at top depth 0.
  const buried = { lithology: 'shale' };
  const solidBuried = BurialCompactionEngine.solidThickness(1000, 100, shale.phi0, shale.c);
  const restored = BurialCompactionEngine.calculateLayerProperties(
    { ...buried, solidThickness: solidBuried }, 0,
  );
  const phi2000 = BurialCompactionEngine.porosity(2000, shale.phi0, shale.c);
  // The golden steady heat column: two 1000 m layers (k 1.8 over 3.5),
  // ten 100 m cells each, 10 C surface, 60 mW/m2 basal heat flow.
  const nodes = [{ z: 0, k: HEAT_FIXTURE.layers[0].k, rhoCp: 1, aVol: 0 }]; // Dirichlet surface node
  let zBase = 0;
  for (const layer of HEAT_FIXTURE.layers) {
    const h = layer.h_m / layer.cells;
    for (let i = 0; i < layer.cells; i++) {
      nodes.push({ z: zBase + (i + 0.5) * h, k: layer.k, rhoCp: 2.0e6, aVol: 0 });
    }
    zBase += layer.h_m;
  }
  const temps = HeatTransportEngine.solve(nodes, null, HEAT_FIXTURE.surface_t_c, HEAT_FIXTURE.basal_q_w_m2, null);
  return {
    shale,
    solid100,
    solidBuried,
    restoredThickness: restored.thickness,
    phi2000,
    heatNodes: nodes,
    heatTemps: temps,
    tFirstNode: temps[1],                 // z = 50 m (temps[0] is the surface node)
    tLayer1Bottom: temps[HEAT_FIXTURE.layers[0].cells], // z = 950 m, last low-k cell
    tDeepest: temps[temps.length - 1],    // z = 1950 m
  };
}

// The oracle's ramp convention (pinned by the goldens): midpoint
// temperature per 0.01 Ma sub-step, reported at every whole degree.
export function easyRoRamp(rateCPerMa, t0 = 20.0, tEnd = 200.0) {
  const sub = 0.01;
  let fractions = [...EasyRoWeights];
  const out = [];
  const steps = Math.round((tEnd - t0) / rateCPerMa / sub);
  let nextReport = t0;
  for (let i = 0; i <= steps; i++) {
    const tNow = t0 + rateCPerMa * i * sub;
    while (nextReport <= tNow + 1e-9) {
      const f = EasyRoWeights.reduce((acc, w, j) => acc + (w - fractions[j]), 0);
      out.push({ t_c: nextReport, ro: MaturityEngine.roFromF(f) });
      nextReport += 1;
    }
    if (i < steps) {
      const tMid = tNow + 0.5 * rateCPerMa * sub;
      fractions = MaturityEngine.kineticStep(fractions, EasyRoFrequencyFactor, tMid + 273.15, sub);
    }
  }
  return out;
}

/** Isothermal kerogen transformation ratio (the goldens' convention:
 *  whole DT_MA steps at constant temperature). */
export function isothermalTr(tempC, durationMa, potentials = TYPE2_POTENTIALS, aFactor = 1e13) {
  let fractions = [...potentials];
  const steps = Math.round(durationMa / Spec.DT_MA);
  for (let i = 0; i < steps; i++) {
    fractions = MaturityEngine.kineticStep(fractions, aFactor, tempC + 273.15, Spec.DT_MA);
  }
  const total = potentials.reduce((a, b) => a + b, 0);
  return 1 - fractions.reduce((a, b) => a + b, 0) / total;
}

/** Intermediate: the kinetics panel. */
export function computeKinetics() {
  const roF0 = MaturityEngine.roFromF(0);
  const roFull = MaturityEngine.roFromF(EasyRoWeights.reduce((s, w) => s + w, 0));
  const ramps = {};
  for (const r of RAMP_RATES) ramps[r] = easyRoRamp(r);
  const roAt = (rate, tC) => ramps[rate].find((e) => e.t_c === tC)?.ro;
  return {
    roF0,
    roFull,
    ramps,
    roAt,
    tr10: isothermalTr(100, 10),
    tr50: isothermalTr(100, 50),
  };
}

/** Advanced: the full reference-basin forward model, with and without
 *  the 600 m erosion event (the erosion signature). Async — the run
 *  marches 150 Ma of basin history. */
export async function computeReferenceBasin() {
  const withErosion = await SimulationEngine.run(PROJECT);
  const noErosion = await SimulationEngine.run({ ...PROJECT, erosionEvents: [] });
  const srcIdx = withErosion.meta.layers.findIndex((l) => l.id === 'source_shale');
  const pick = (results, field) => {
    const arr = results.data[field][srcIdx];
    return arr[arr.length - 1].value;
  };
  return {
    withErosion,
    noErosion,
    srcIdx,
    finalRo: pick(withErosion, 'maturity'),
    finalTempC: pick(withErosion, 'temperature'),
    finalTr: pick(withErosion, 'transformation'),
    generated: pick(withErosion, 'generation'),
    expelled: pick(withErosion, 'expulsion'),
    finalRoNoErosion: pick(noErosion, 'maturity'),
  };
}

// ---------------------------------------------------------------------------
// DC30/DC31 panel drivers. Everything below is additive; the capstone
// drivers above are pinned by the live NG11 keys and stay untouched.

export const KEROGEN_TYPES = ['type1', 'type2', 'type3'];

/** First whole degree at or above an Ro threshold on a ramp table. */
export function roCrossing(ramp, threshold) {
  const e = ramp.find((x) => x.ro >= threshold);
  return e ? e.t_c : null;
}

/** Professional panel: the three ramps plus an isothermal TR series.
 *  Heavy (tens of thousands of kinetic sub-steps) so callers memoize. */
export function computeKineticsExplorer(isoTempC, kerogenType = 'type2') {
  const potentials = KerogenKinetics[kerogenType].potentials;
  const ramps = {};
  for (const r of RAMP_RATES) ramps[r] = easyRoRamp(r);
  const iso = [];
  let fractions = [...potentials];
  const total = potentials.reduce((a, b) => a + b, 0);
  iso.push({ ma: 0, tr: 0 });
  for (let ma = 1; ma <= 100; ma++) {
    fractions = MaturityEngine.kineticStep(fractions, 1e13, isoTempC + 273.15, Spec.DT_MA);
    iso.push({ ma, tr: 1 - fractions.reduce((a, b) => a + b, 0) / total });
  }
  return {
    ramps,
    roAt: (rate, tC) => ramps[rate].find((e) => e.t_c === tC)?.ro,
    crossings: (threshold) => RAMP_RATES.map((r) => ({ rate: r, t_c: roCrossing(ramps[r], threshold) })),
    iso,
    trAt: (ma) => iso.find((e) => e.ma === ma)?.tr,
    roF0: MaturityEngine.roFromF(0),
    roFull: MaturityEngine.roFromF(EasyRoWeights.reduce((s, w) => s + w, 0)),
  };
}

/** The saturation-bucket retention cap for a burial entry, exactly as
 *  SimulationEngine computes it (mean of top/bottom Athy porosities). */
export function retentionCapOf(entry, phi0 = 0.63, c = 0.00051) {
  const phiTop = BurialCompactionEngine.porosity(entry.top, phi0, c);
  const phiBottom = BurialCompactionEngine.porosity(entry.bottom, phi0, c);
  return ExpulsionEngine.retentionCap(entry.thickness, (phiTop + phiBottom) / 2);
}

/** Closed-form generation potential of the reference basin's source. */
export function sourcePotentialMass() {
  const presentOrder = [...PROJECT.stratigraphy].sort((a, b) => (a.ageStart || 0) - (b.ageStart || 0));
  const init = BurialCompactionEngine.initializeSolidThickness(presentOrder);
  const src = init.find((l) => l.id === 'source_shale');
  const sr = src.sourceRock;
  return 2720 * src.solidThickness * (sr.toc / 100) * (sr.hi / 1000);
}

/** Expert panel: the reference basin at a chosen erosion amount, against
 *  the no-erosion baseline. Async; two full forward runs per call. */
export async function computeErosionScenario(amountM) {
  const project = amountM > 0
    ? { ...PROJECT, erosionEvents: [{ age: 10, amount: amountM }] }
    : { ...PROJECT, erosionEvents: [] };
  const run = await SimulationEngine.run(project);
  const base = await SimulationEngine.run({ ...PROJECT, erosionEvents: [] });
  const srcIdx = run.meta.layers.findIndex((l) => l.id === 'source_shale');
  const series = (res, f) => res.data[f][srcIdx];
  const last = (a) => a[a.length - 1].value;
  const burial = series(run, 'burial');
  const capSeries = burial.map((b) => ({ age: b.age, cap: retentionCapOf(b) }));
  return {
    burial,
    temperature: series(run, 'temperature'),
    maturity: series(run, 'maturity'),
    generation: series(run, 'generation'),
    expulsion: series(run, 'expulsion'),
    capSeries,
    finalRo: last(series(run, 'maturity')),
    finalTempC: last(series(run, 'temperature')),
    finalTr: last(series(run, 'transformation')),
    generated: last(series(run, 'generation')),
    expelled: last(series(run, 'expulsion')),
    baselineRo: last(series(base, 'maturity')),
    baselineExpelled: last(series(base, 'expulsion')),
    roDelta: last(series(run, 'maturity')) - last(series(base, 'maturity')),
    potentialMass: sourcePotentialMass(),
  };
}
