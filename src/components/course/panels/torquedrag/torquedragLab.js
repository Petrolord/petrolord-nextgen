// Torque and drag teaching lab for the DR2 course (app 'torquedrag'). Pure
// functions over the vendored engines/drilling and its goldens; every exported
// value is pinned by torquedragLab.test.js against DR2-TRUTH.md, which was
// derived by running the same engine outside this app.
//
// Five wells share one string, one mud and one set of operating parameters, so
// a number learned on the vertical well still means the same thing on the
// horizontal one. The only thing that changes between them is the shape of the
// hole, which is the whole subject.

import tdCases from '@petrolord/engines/test-data/drilling/goldens/torquedrag_cases.json';
import wearCase from '@petrolord/engines/test-data/drilling/goldens/casingwear_cases.json';

import {
  computeTorqueDrag, buoyancyFactor, stringProperties, bucklingLimits, OPERATIONS,
} from '@petrolord/engines/engines/drilling/torqueDrag.js';
import {
  computeCasingWear, slidingDistanceM, grooveArea, grooveDepthForArea,
} from '@petrolord/engines/engines/drilling/casingWear.js';

const G = 9.80665;

// ---------------------------------------------------------------------------
// The five wells, and the one string they all carry.
// ---------------------------------------------------------------------------

export const WELLS = [
  { id: 'vertical', label: 'Vertical', note: 'no drag at all' },
  { id: 'slant', label: 'Slant to 40 degrees', note: 'a constant tangent' },
  { id: 'buildhold', label: 'Build and hold to 65 degrees', note: 'a build section' },
  { id: 'horizontal', label: 'Horizontal', note: 'the string will not go in' },
  { id: 'swell3d', label: 'Three-dimensional turn', note: 'inclination and azimuth together' },
];

export { OPERATIONS };

export const caseOf = (id = 'vertical') => {
  const c = tdCases.cases.find((x) => x.name === id);
  if (!c) throw new Error(`Unknown torque and drag case '${id}'.`);
  return c;
};

export const wellSummary = (id = 'vertical') => {
  const c = caseOf(id);
  const last = c.stations[c.stations.length - 1];
  return {
    id,
    stations: c.stations.length,
    totalDepthM: last.md,
    maxIncDeg: Math.max(...c.stations.map((s) => s.inc)),
    finalAziDeg: last.azi,
    mudDensityKgM3: c.mudDensityKgM3,
    sections: c.geometry.map((g) => ({ ...g })),
    string: c.string.map((s) => ({ ...s })),
  };
};

// Air weight and buoyed weight of the whole string, in newtons. On a vertical
// well the buoyed weight IS the hookload, which is the one case in this course
// with a closed-form answer.
export const stringWeights = (id = 'vertical', { mudDensityKgM3 } = {}) => {
  const c = caseOf(id);
  const rho = mudDensityKgM3 ?? c.mudDensityKgM3;
  const bf = buoyancyFactor(rho);
  const massKg = c.string.reduce((a, s) => a + s.weightKgM * s.lengthM, 0);
  return {
    buoyancyFactor: bf,
    airWeightN: massKg * G,
    buoyedWeightN: massKg * G * bf,
    lengthM: c.string.reduce((a, s) => a + s.lengthM, 0),
  };
};

export { buoyancyFactor };

// ---------------------------------------------------------------------------
// The soft-string run itself.
// ---------------------------------------------------------------------------

// Override any of the case's inputs without mutating the golden.
//   frictionOpen / frictionCased  replace the section friction factors
//   mudDensityKgM3                replace the mud weight
//   params                        merged over the case's own params
export const runCase = (id = 'vertical', operation = 'trip_out', over = {}) => {
  const c = caseOf(id);
  const geometry = c.geometry.map((g) => {
    const mu = g.cased ? over.frictionCased : over.frictionOpen;
    return mu == null ? { ...g } : { ...g, frictionFactor: mu };
  });
  return computeTorqueDrag({
    stations: c.stations,
    string: c.string,
    geometry,
    mud: { densityKgM3: over.mudDensityKgM3 ?? c.mudDensityKgM3 },
    operation,
    params: { ...c.params, ...(over.params ?? {}) },
  });
};

export const summaryOf = (id, operation, over) => runCase(id, operation, over).summary;

// The three hookloads a driller reads on one well: pick up, slack off, and
// rotate off bottom. Their differences are the drag.
export const broomstick = (id = 'vertical', over = {}) => {
  const pickup = summaryOf(id, 'trip_out', over).hookloadN;
  const slackoff = summaryOf(id, 'trip_in', over).hookloadN;
  const rotating = summaryOf(id, 'rotate_off_bottom', over).hookloadN;
  return {
    pickupN: pickup,
    slackoffN: slackoff,
    rotatingN: rotating,
    pickupDragN: pickup - rotating,
    slackoffDragN: rotating - slackoff,
    dragSwingN: pickup - slackoff,
  };
};

// Every operation on one well, which is the table the course reads from.
export const operationTable = (id = 'vertical', over = {}) => OPERATIONS.map((op) => {
  const s = summaryOf(id, op, over);
  return {
    operation: op,
    hookloadN: s.hookloadN,
    surfaceTorqueNm: s.surfaceTorqueNm,
    maxTensionN: s.maxTensionN,
    minTensionN: s.minTensionN,
    maxSideForceNPerM: s.maxSideForceNPerM,
    bucklingFirstMd: s.bucklingFirstMd,
    warnings: s.warnings.slice(),
  };
});

// ---------------------------------------------------------------------------
// The oracle check, and where the two implementations part company.
// ---------------------------------------------------------------------------

// The goldens were generated by an independent RK4 integration of the same
// ODE. This walks every published summary and checkpoint and reports the worst
// relative and absolute disagreement, so the claim is measured rather than
// asserted.
export const oracleCheck = () => {
  let worstRel = 0;
  let worstAbs = 0;
  let relAt = null;
  let absAt = null;
  let checked = 0;
  for (const c of tdCases.cases) {
    for (const [op, exp] of Object.entries(c.expected)) {
      const r = runCase(c.name, op);
      const pairs = [
        ['hookloadN', r.summary.hookloadN, exp.hookloadN],
        ['surfaceTorqueNm', r.summary.surfaceTorqueNm, exp.surfaceTorqueNm],
        ['maxTensionN', r.summary.maxTensionN, exp.maxTensionN],
        ['minTensionN', r.summary.minTensionN, exp.minTensionN],
      ];
      for (const cp of exp.checkpoints ?? []) {
        const row = r.profile.reduce((b, x) => (Math.abs(x.md - cp.md) < Math.abs(b.md - cp.md) ? x : b));
        pairs.push([`tension@${cp.md}`, row.tensionN, cp.tensionN]);
      }
      for (const [key, got, want] of pairs) {
        if (want == null) continue;
        checked += 1;
        const abs = Math.abs(got - want);
        const rel = Math.abs(want) > 1e-9 ? abs / Math.abs(want) : 0;
        if (rel > worstRel) { worstRel = rel; relAt = { well: c.name, operation: op, key, got, want, abs }; }
        if (abs > worstAbs) { worstAbs = abs; absAt = { well: c.name, operation: op, key, got, want, rel }; }
      }
    }
  }
  return { checked, worstRel, worstAbs, relAt, absAt };
};

// On the vertical well the answer is a closed form: the buoyed weight of the
// string. This is the only place in the course where a third party settles a
// disagreement between the engine and its oracle.
export const verticalClosedForm = () => {
  const w = stringWeights('vertical');
  const engine = summaryOf('vertical', 'trip_out').hookloadN;
  const oracle = caseOf('vertical').expected.trip_out.hookloadN;
  return {
    closedFormN: w.buoyedWeightN,
    engineN: engine,
    oracleN: oracle,
    engineErrorN: engine - w.buoyedWeightN,
    oracleErrorN: oracle - w.buoyedWeightN,
  };
};

// Refine the integration step and watch the hookload move. On the horizontal
// well the engine and the oracle converge on each other; elsewhere they do not,
// because the remaining gap is not discretisation.
export const stepStudy = (id = 'horizontal', operation = 'trip_in',
  steps = [10, 5, 2, 1, 0.5, 0.25]) => {
  const oracle = caseOf(id).expected[operation]?.hookloadN ?? null;
  return steps.map((stepM) => {
    const h = summaryOf(id, operation, { params: { stepM } }).hookloadN;
    return { stepM, hookloadN: h, vsOracleN: oracle == null ? null : h - oracle };
  });
};

// ---------------------------------------------------------------------------
// Friction factors: the one thing in the model that is calibrated rather than
// measured.
// ---------------------------------------------------------------------------

export const frictionSweep = (id = 'buildhold', operation = 'trip_out',
  mus = [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50]) => mus.map((frictionOpen) => {
  const s = summaryOf(id, operation, { frictionOpen });
  return {
    frictionOpen,
    hookloadN: s.hookloadN,
    surfaceTorqueNm: s.surfaceTorqueNm,
    maxSideForceNPerM: s.maxSideForceNPerM,
  };
});

// Back out the open-hole friction factor that reproduces an observed hookload,
// which is what calibration against a real trip actually is. Bisection over a
// monotone response, 200 halvings, deterministic.
export const frictionFromHookload = ({
  well = 'buildhold', operation = 'trip_out', targetN,
  lo = 0.05, hi = 1.0, mudDensityKgM3,
} = {}) => {
  if (!(targetN > -Infinity)) throw new Error('Need a target hookload.');
  const at = (mu) => summaryOf(well, operation, { frictionOpen: mu, mudDensityKgM3 }).hookloadN;
  const rising = at(hi) > at(lo);
  let a = lo;
  let b = hi;
  for (let i = 0; i < 200; i += 1) {
    const m = (a + b) / 2;
    const above = rising ? at(m) < targetN : at(m) > targetN;
    if (above) a = m; else b = m;
  }
  return (a + b) / 2;
};

// ---------------------------------------------------------------------------
// Buckling, and the capacity the pipe has left.
// ---------------------------------------------------------------------------

// The drill pipe's own properties, and its buckling limits at a stated
// inclination in a stated hole.
export const pipeLimits = ({
  well = 'horizontal', componentIndex = 2, incDeg = 90, holeIdM = 0.2159,
  mudDensityKgM3 = 1440,
} = {}) => {
  const comp = caseOf(well).string[componentIndex];
  const props = stringProperties(comp);
  const wc = comp.weightKgM * G * buoyancyFactor(mudDensityKgM3);
  const radialClearanceM = (holeIdM - comp.odM) / 2;
  const limits = bucklingLimits({
    eiNm2: props.eiNm2, wcNPerM: wc, incDeg, radialClearanceM,
  });
  return {
    odM: comp.odM,
    idM: comp.idM,
    eiNm2: props.eiNm2,
    tensileCapacityN: props.tensileCapacityN,
    torsionalCapacityNm: props.torsionalCapacityNm,
    buoyedWeightNPerM: wc,
    radialClearanceM,
    sinusoidalN: limits.sinusoidalN,
    helicalN: limits.helicalN,
  };
};

export const bucklingLadder = (well = 'horizontal',
  incs = [0, 15, 30, 45, 60, 75, 90]) => incs.map((incDeg) => {
  const l = pipeLimits({ well, incDeg });
  return { incDeg, sinusoidalN: l.sinusoidalN, helicalN: l.helicalN };
});

export const utilization = (well = 'horizontal', operation = 'rotate_on_bottom', over = {}) => {
  const rows = runCase(well, operation, over).profile;
  let tension = 0;
  let torsion = 0;
  for (const r of rows) {
    tension = Math.max(tension, r.utilization?.tension ?? 0);
    torsion = Math.max(torsion, r.utilization?.torsion ?? 0);
  }
  return { maxTensionUtilization: tension, maxTorsionUtilization: torsion };
};

// ---------------------------------------------------------------------------
// Casing wear, which is the side force this course computes, spent over hours.
// ---------------------------------------------------------------------------

// The capstone deliberately runs at a DIFFERENT mud weight and a different
// rotating schedule from the lessons, so that no graded value is a number a
// lesson printed. The lessons teach on 1440 kg/m3 and 50 h at 120 rpm; the
// capstone reruns the same wells in 1500 kg/m3 mud with a two-entry schedule.
export const CAPSTONE_MUD_KGM3 = 1500;
export const CAPSTONE_SCHEDULE = [{ rpm: 150, hours: 30 }, { rpm: 90, hours: 20 }];

export const WEAR_CASE = {
  casingIdM: wearCase.casing.irM * 2,
  casingWallM: wearCase.casing.wallM,
  shoeMd: wearCase.casing.shoeMd,
  tjRadiusM: wearCase.tjRadiusM,
  schedule: wearCase.schedule.map((s) => ({ ...s })),
  wearFactorMm3PerKNm: wearCase.wearFactorMm3PerKNm,
  intervalM: wearCase.intervalM,
};

export const slidingDistance = ({ rpm = 120, hours = 50, tjRadiusM = WEAR_CASE.tjRadiusM } = {}) =>
  slidingDistanceM({ tjRadiusM, rpm, hours });

export { grooveArea, grooveDepthForArea };

export const wearRun = ({
  well = 'horizontal', operation = 'rotate_on_bottom',
  schedule = WEAR_CASE.schedule, wearFactorMm3PerKNm = WEAR_CASE.wearFactorMm3PerKNm,
  over = {},
} = {}) => {
  const tdProfile = runCase(well, operation, over).profile;
  const w = computeCasingWear({
    tdProfile,
    casing: {
      idM: WEAR_CASE.casingIdM, wallM: WEAR_CASE.casingWallM,
      fromMd: 0, toMd: WEAR_CASE.shoeMd,
    },
    tjRadiusM: WEAR_CASE.tjRadiusM,
    schedule,
    wearFactorMm3PerKNm,
    intervalM: WEAR_CASE.intervalM,
  });
  return {
    rows: w.rows,
    maxWearDepthM: w.summary.maxWearDepthM,
    minRemainingWallM: w.summary.minRemainingWallM,
    worstWallLossPct: w.rows.reduce((m, r) => Math.max(m, r.wallLossPct), 0),
    totalSlidingM: schedule.reduce(
      (a, s) => a + slidingDistanceM({ tjRadiusM: WEAR_CASE.tjRadiusM, rpm: s.rpm, hours: s.hours }), 0,
    ),
  };
};

// The oracle for the wear case was built on the oracle's OWN side forces, so
// the gap here is the T&D gap carried one step downstream.
export const wearOracleCheck = () => {
  const w = wearRun();
  return {
    engineMaxDepthM: w.maxWearDepthM,
    oracleMaxDepthM: wearCase.summary.maxWearDepthM,
    relDepth: Math.abs(w.maxWearDepthM - wearCase.summary.maxWearDepthM)
      / wearCase.summary.maxWearDepthM,
    engineSlidingM: w.totalSlidingM,
    oracleSlidingM: wearCase.totalSlidingDistanceM,
    relSliding: Math.abs(w.totalSlidingM - wearCase.totalSlidingDistanceM)
      / wearCase.totalSlidingDistanceM,
  };
};

// ---------------------------------------------------------------------------
// The eighteen graded capstone values, in one place.
// ---------------------------------------------------------------------------

export const capstoneValues = () => {
  const over = { mudDensityKgM3: CAPSTONE_MUD_KGM3 };
  const slant = broomstick('slant', over);
  const bh = summaryOf('buildhold', 'rotate_on_bottom', over);
  const hz = summaryOf('horizontal', 'rotate_on_bottom', over);
  const lim = pipeLimits({ well: 'horizontal', incDeg: 90, mudDensityKgM3: CAPSTONE_MUD_KGM3 });
  const u = utilization('horizontal', 'rotate_on_bottom', over);
  const wear = wearRun({ schedule: CAPSTONE_SCHEDULE, over });
  return {
    beginner: {
      buoyancy_factor_1500: buoyancyFactor(CAPSTONE_MUD_KGM3),
      vertical_hookload_N: summaryOf('vertical', 'trip_out', over).hookloadN,
      slant_pickup_hookload_N: slant.pickupN,
      slant_slackoff_hookload_N: slant.slackoffN,
      slant_drag_swing_N: slant.dragSwingN,
      horizontal_slackoff_hookload_N: summaryOf('horizontal', 'trip_in', over).hookloadN,
    },
    intermediate: {
      buildhold_rot_torque_Nm: bh.surfaceTorqueNm,
      horizontal_rot_torque_Nm: hz.surfaceTorqueNm,
      buildhold_max_side_force_Npm: bh.maxSideForceNPerM,
      swell3d_backream_torque_Nm: summaryOf('swell3d', 'backream', over).surfaceTorqueNm,
      horizontal_slide_min_tension_N: summaryOf('horizontal', 'slide_drill', over).minTensionN,
      buildhold_mu_for_1100kN_pickup: frictionFromHookload({
        well: 'buildhold', operation: 'trip_out', targetN: 1100000,
        mudDensityKgM3: CAPSTONE_MUD_KGM3,
      }),
    },
    advanced: {
      dp_sinusoidal_limit_90deg_N: lim.sinusoidalN,
      dp_helical_limit_90deg_N: lim.helicalN,
      hz_max_torsion_utilization: u.maxTorsionUtilization,
      casing_sliding_distance_m: wear.totalSlidingM,
      casing_max_wear_depth_mm: wear.maxWearDepthM * 1000,
      casing_worst_wall_loss_pct: wear.worstWallLossPct,
    },
  };
};
