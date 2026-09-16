// Teaching lab for FC3, Rotating Equipment. The three panels, the course page
// and the vitest files all read this one module, so a number shown to a learner
// and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every fitted
// coefficient, condition number, duty flow, residual, power, NPSH, margin,
// affinity factor, corrected flow, exponent ratio, discharge temperature,
// polytropic head, stage count, cooling duty, inlet volume and fuel rate below
// is a return value of engines/facilities/pumps.js (the Pump Station
// Designer), engines/facilities/compression.js (the Compressor Station
// Designer) or engines/production/gasProperties.js (the Sutton
// pseudo-criticals, the DAK z factor, the Rankine offset, the molecular weight
// of air and the universal gas constant), as repaired in FC3-0 and vendored at
// engines main 4fa37e6.
//
// NOTHING IN THIS FILE COMPUTES A ROTATING-EQUIPMENT QUANTITY. Where a reader
// carries a value the teaching digest calls "derived", it is the digest's own
// arithmetic on numbers the engine returned, with the arithmetic stated, and
// the key name says Derived: a difference of two heads, a quotient of two
// powers, an implied water density from a measured packaging, a share of a
// throughput. The lab and /root/fc-wip-rotating/digest.txt agree because both
// call the engines on the same inputs, not because either copied the other.
//
// CONSTANTS ARE MEASURED, NEVER TYPED. Where the engine keeps a packaging to
// itself, the lab asks the engine a question about itself and reads the answer:
// one over the hydraulic power at unit flow, head, gravity and efficiency; the
// required margin at a required NPSH only one half of the rule can reach; the
// heat rate the first law refuses below, found by halving. A constant written
// as a literal here would be a claim about the engine rather than a reading of
// it.
//
// UNITS. Field units throughout: gpm and feet of head for pumps, psi for the
// pressure a head makes, horsepower and kilowatts for power, MMscfd and psia
// and degF for gas, ft lbf per lbm for compressor head, Btu per hr and MMBtu
// per hr for cooling duty, acfm for inlet volume. Ratios, factors and
// percentages are plain numbers.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// belongs anywhere in it.
//
// THE CLOCK. Nothing in this domain reads a clock or a random number. There is
// no date input, no seed and no default that falls back to today, so every
// reader is a pure function of its engine inputs. A clock gate in
// rotatingLab.test.js proves it under two faked system dates, and a timezone
// gate rebuilds the whole digest a second time west of Greenwich.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

import pumpsGolden from '@petrolord/engines/test-data/facilities/goldens/pumps_cases.json';
import compressionGolden from '@petrolord/engines/test-data/facilities/goldens/compression_cases.json';
// Namespaces, not named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which predate FC1-0
// and carry no engines/facilities at all. Vite and vitest alias
// @petrolord/engines to this worktree's packages/engines, which does.
// import/namespace still checks members against the shared copy, so it is off
// for this file only; rotatingLab.test.js proves every member resolves.
/* eslint-disable import/namespace */
import * as P from '@petrolord/engines/engines/facilities/pumps.js';
import * as C from '@petrolord/engines/engines/facilities/compression.js';
import * as G from '@petrolord/engines/engines/production/gasProperties.js';
// THE GRADING TOLERANCES ARE NOT HELD HERE. They are derived, once, in
// gradedTolerance.js, which fc3_capstone.mjs imports too, so the lab, the
// generator and the shipped fields.json cannot hold three different opinions
// about what a correct answer is. This module imports nothing itself.
import { GRADED_FIELDS, gradedClassOf, gradedTolerance } from './gradedTolerance.js';

export const GP = pumpsGolden;
export const GC = compressionGolden;

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a rotating-equipment quantity.
// ---------------------------------------------------------------------------

/** A state the method has no answer for, returned rather than thrown. */
const softOf = (r) => (r && r.error ? r.error : null);

/**
 * The WHOLE return, decomposed so the SHAPE is carried and not only the
 * number. The rendering lives in the test and in the panels; what the lab
 * hands over is one triple per key: the key, what kind of thing sits there,
 * and the primitive itself. A function is carried as its kind alone, which is
 * how a system curve that looks healthy until it is called shows up at all.
 *
 * JSON has no spelling for NaN or for Infinity and prints both as null, which
 * is exactly the trap this course teaches, so nothing here goes through
 * JSON.stringify.
 */
const shapeOf = (r) => {
  if (r === null || r === undefined || typeof r !== 'object') {
    return { scalar: true, kind: r === null || r === undefined ? String(r) : typeof r, value: r === null || r === undefined ? null : r };
  }
  return {
    scalar: false,
    entries: Object.entries(r).map(([k, v]) => {
      if (typeof v === 'function') return [k, 'function', null];
      if (Array.isArray(v)) return [k, 'array', v.map((x) => (typeof x === 'string' ? x : String(x)))];
      if (v === null) return [k, 'null', null];
      if (v === undefined) return [k, 'undefined', null];
      if (typeof v === 'object') return [k, 'object', null];
      return [k, typeof v, v];
    }),
  };
};

export const goldenCounts = () => ({
  pumps: Object.values(pumpsGolden).reduce((s, v) => s + v.length, 0),
  compression: Object.values(compressionGolden).reduce((s, v) => s + v.length, 0),
  pumpBlocks: Object.keys(pumpsGolden).length,
  compressionBlocks: Object.keys(compressionGolden).length,
});

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from /root/fc-wip-rotating/fc3_fields.mjs.
// The OKONO P-1201 produced-water injection pump and the SOKU K-2101 gas
// booster train. Neither is a golden case and neither is graded anywhere.
// ---------------------------------------------------------------------------

export const OKONO_POINTS = [
  { qGpm: 0, headFt: 540 },
  { qGpm: 600, headFt: 512 },
  { qGpm: 1200, headFt: 424 },
  { qGpm: 1900, headFt: 250 },
];

export const OKONO_SYSTEM = {
  staticHeadFt: 210,
  frictionHeadFt: 165,
  atFlowGpm: 1100,
};

export const OKONO_SG = 1.04;
export const OKONO_EFFICIENCY = 0.74;
export const OKONO_MOTOR_EFFICIENCY = 0.92;
export const OKONO_Q_MAX_GPM = 7500;
export const OKONO_BEP_GPM = 1150;

/** A second system on the same pump: friction dominated, which is where
 *  the parallel result the module exists to show actually bites. */
export const OKONO_FRICTION_SYSTEM = {
  staticHeadFt: 60,
  frictionHeadFt: 380,
  atFlowGpm: 1100,
};

/** And a system the pump cannot start at all. */
export const OKONO_TOO_HIGH_SYSTEM = {
  staticHeadFt: 700,
  frictionHeadFt: 80,
  atFlowGpm: 900,
};

/** Points that rise with flow, which is not a centrifugal head curve. */
export const NOT_A_PUMP_CURVE = [
  { qGpm: 0, headFt: 120 },
  { qGpm: 450, headFt: 176 },
  { qGpm: 950, headFt: 288 },
];

/** Three identical heads: a fit that explains nothing and says R squared 1. */
export const FLAT_CURVE = [
  { qGpm: 0, headFt: 140 },
  { qGpm: 500, headFt: 140 },
  { qGpm: 1000, headFt: 140 },
];

/* The suction side of the same pump. */
export const OKONO_SUCTION = {
  suctionPressurePsia: 24.5,
  vapourPressurePsia: 0.95,
  sg: OKONO_SG,
  staticSuctionLiftFt: 6.0,
  suctionFrictionFt: 5.5,
};

/** The vendor's required NPSH for this selection, stated. The MARGIN RULE
 *  the check applies to it is HELD FOR LITERATURE. */
export const OKONO_NPSHR_FT = 16.0;

/** A suction sweep that walks the three severities: the pressure over the
 *  liquid, in psia, everything else held. */
export const OKONO_SUCTION_SWEEP_PSIA = [14.7, 18.0, 21.0, 24.5, 30.0, 40.0, 60.0];

/** A suction already at its vapour pressure, which the engine flags. */
export const FLASHING_SUCTION = {
  suctionPressurePsia: 6.2,
  vapourPressurePsia: 6.2,
  sg: 0.71,
  staticSuctionLiftFt: 28.0,
  suctionFrictionFt: 3.0,
};

/** And one already BELOW it whose static column still makes the available
 *  head positive, which is the case the warning exists for. */
export const FLASHING_SUCTION_BELOW = {
  suctionPressurePsia: 4.4,
  vapourPressurePsia: 6.2,
  sg: 0.71,
  staticSuctionLiftFt: 28.0,
  suctionFrictionFt: 3.0,
};

/* Changes. */
export const OKONO_SPEED_SWEEP = [0.70, 0.80, 0.90, 1.00, 1.10];
export const OKONO_TRIM_SWEEP = [1.00, 0.98, 0.95, 0.92, 0.88, 0.84, 0.80, 0.76, 0.70];
/** The two boundaries the trim rule turns on, each with the value either
 *  side of it, because a guard that misses its own limit is a finding. */
export const TRIM_AT_SHORTFALL_START = 0.95;
export const TRIM_JUST_INSIDE_SHORTFALL = 0.9499;
export const TRIM_AT_WARNING = 0.80;
export const TRIM_JUST_PAST_WARNING = 0.7999;
/** Where the 0.12 shortfall cap is reached, and past it. */
export const TRIM_AT_CAP = 0.75;
export const TRIM_PAST_CAP = 0.55;

export const OKONO_PARALLEL_COUNTS = [1, 2, 3, 4];
export const OKONO_SERIES_COUNTS = [1, 2, 3];

/* Where the duty lands. The four bands and both sides of every boundary. */
export const REGION_FRACTIONS = [
  0.30, 0.499, 0.50, 0.60, 0.699, 0.70, 0.85, 1.00, 1.15,
  1.20, 1.201, 1.30, 1.40, 1.401, 1.60,
];

/* The Hydraulic Institute correction. HELD FOR LITERATURE. */
export const OKONO_VISC_SWEEP_CST = [1, 5, 20, 60, 100, 320, 850, 2400, 9000];
export const OKONO_BEP_HEAD_FT = 430;
export const OKONO_SPEED_RPM = 1780;
/** The two thresholds the correction's warnings turn on. */
export const VISC_B_WARNING = 40;
export const VISC_CETA_WARNING = 0.6;

export const SOKU = {
  qMMscfd: 26.0,
  pSuctionPsia: 92.0,
  tSuctionF: 104.0,
  pDischargePsia: 985.0,
  gasSg: 0.648,
  k: 1.285,
  polytropicEfficiency: 0.755,
  mechanicalEfficiency: 0.968,
  maxRatioPerStage: 4.0,
  maxDischargeF: 300.0,
  interstageCoolToF: 110.0,
  cpBtuLbF: 0.55,
};

export const SOKU_HEAT_RATE_BTU_HP_HR = 8100;
export const SOKU_LHV_BTU_SCF = 985;

/** Discharge pressures for the sweep the studio's third tab draws: power
 *  climbing smoothly while the stage count climbs in steps. */
export const SOKU_DISCHARGE_SWEEP_PSIA = [300, 450, 600, 800, 985, 1200, 1500, 1900, 2400];

/** The intercooler approach swept across the suction temperature, which is
 *  where the staging assumption stops holding. */
export const SOKU_COOL_TO_SWEEP_F = [90, 100, 104, 110, 130, 150, 180];

/** The case that breaks the stated limit outright, with its own limit so
 *  the overshoot is against a number the caller chose. */
export const SOKU_HOT = {
  qMMscfd: 26.0,
  pSuctionPsia: 92.0,
  tSuctionF: 104.0,
  pDischargePsia: 420.0,
  gasSg: 0.648,
  k: 1.285,
  polytropicEfficiency: 0.755,
  mechanicalEfficiency: 0.968,
  maxRatioPerStage: 4.0,
  maxDischargeF: 230.0,
  interstageCoolToF: 165.0,
  cpBtuLbF: 0.55,
};

/** A single stage, read on its own so the head, the temperature and the two
 *  idealisations can be laid out before the train chains them. */
export const SOKU_STAGE = {
  qMMscfd: 26.0,
  pSuctionPsia: 92.0,
  tSuctionF: 104.0,
  ratio: 3.2,
  gasSg: 0.648,
  k: 1.285,
  polytropicEfficiency: 0.755,
  mechanicalEfficiency: 0.968,
};

/** The polytropic efficiency swept, because the exponent carries it and the
 *  discharge temperature is where a learner first sees that. */
export const SOKU_ETA_SWEEP = [0.65, 0.70, 0.75, 0.78, 0.82, 0.86];
/** And k swept, because a richer gas takes more ratio per stage. */
export const SOKU_K_SWEEP = [1.20, 1.24, 1.28, 1.32, 1.40];
/** Ratios, for the head and the temperature against ratio. */
export const SOKU_RATIO_SWEEP = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5];

/** Duties for the machine screen, chosen to land in all four branches.
 *  The THRESHOLDS are HELD FOR LITERATURE; the branches are the engine's. */
export const SCREEN_DUTIES = [
  { label: 'a small high-pressure gathering duty', qMMscfd: 0.6, pSuctionPsia: 420, tSuctionF: 96, gasSg: 0.66, overallRatio: 3.0, totalBrakeHp: 180 },
  { label: 'a large low-pressure gathering duty', qMMscfd: 380, pSuctionPsia: 95, tSuctionF: 96, gasSg: 0.66, overallRatio: 2.6, totalBrakeHp: 14500 },
  { label: 'a deep booster at high ratio', qMMscfd: 14, pSuctionPsia: 75, tSuctionF: 96, gasSg: 0.66, overallRatio: 11.5, totalBrakeHp: 2100 },
  // The fourth branch is the one an earlier draft of this file MISSED: it
  // asked for 'either' with an overall ratio of 10.7 at 3090 acfm, which is
  // the reciprocating branch, and the digest then claimed four branches on a
  // set that reached two. A duty reaches 'either' only by failing all three
  // of the tests above it: 500 acfm or more, not a large volume at a modest
  // ratio, and not a high ratio at a small volume.
  { label: 'the duty where both machines are viable', qMMscfd: 67, pSuctionPsia: 92, tSuctionF: 104, gasSg: 0.648, overallRatio: 3.0, totalBrakeHp: 5000 },
];

/** A duty NO stage count can cool, for real: the discharge limit is above
 *  the suction temperature, so the early guards let it through, and twelve
 *  equal stages still cannot get under it. This is the case the twelve-stage
 *  cap was written for, and the only one that still reaches it. */
export const STAGE_CAP_DUTY = {
  pSuctionPsia: 100, pDischargePsia: 100000, tSuctionF: 100,
  k: 1.4, polytropicEfficiency: 0.5, maxDischargeF: 110,
};

/** Inlet-volume conditions, to show the volume falling with pressure. */
export const ACFM_PRESSURE_SWEEP_PSIA = [30, 60, 92, 150, 300, 600, 1200];

/** Driver heat rates, to show the fuel and the thermal efficiency move. */
export const DRIVER_HEAT_RATE_SWEEP = [6200, 7000, 7600, 8100, 9200, 11000];

/** Below the DAK temperature floor. separatorSizing.js refuses this state
 *  by name; compression.js answers. */
export const DAK_COLD_PROBE = {
  qMMscfd: 20, pSuctionPsia: 1000, tSuctionF: -150, ratio: 2,
  gasSg: 0.65, k: 1.28,
};
/** Above the DAK pressure limit. Same two behaviours. */
export const DAK_HIGH_P_PROBE = {
  qMMscfd: 20, pSuctionPsia: 24000, tSuctionF: 100, ratio: 1.5,
  gasSg: 0.65, k: 1.28,
};
/** Inside the window, as a control, so the two above are a contrast and
 *  not just two numbers. */
export const DAK_IN_WINDOW_PROBE = {
  qMMscfd: 20, pSuctionPsia: 600, tSuctionF: 100, ratio: 2,
  gasSg: 0.65, k: 1.28,
};

/** Inputs the engines accept and should not. Each is a FINDINGS entry and
 *  each is printed with the whole return, so the SHAPE is on the page and
 *  not only the number. */
export const UNGUARDED_PUMP_PROBES = [
  ['a motor efficiency above one', 'pumpPower', { qGpm: 1500, headFt: 300, sg: 0.85, efficiency: 0.78, motorEfficiency: 5 }],
  ['a negative motor efficiency', 'pumpPower', { qGpm: 1500, headFt: 300, sg: 0.85, efficiency: 0.78, motorEfficiency: -0.5 }],
  ['a motor efficiency of zero', 'pumpPower', { qGpm: 1500, headFt: 300, sg: 0.85, efficiency: 0.78, motorEfficiency: 0 }],
  ['a speed ratio of one hundred', 'speedChange', { qGpm: 1000, headFt: 300, brakeHp: 100, speedRatio: 100 }],
  ['a speed change with no duty to change', 'speedChange', { speedRatio: 0.8 }],
  ['a trim with no duty to trim', 'impellerTrim', { diameterRatio: 0.8 }],
  ['a viscosity correction at zero speed', 'viscosityCorrection', { qBepGpm: 1500, headBepFt: 300, viscosityCSt: 100, speedRpm: 0 }],
  ['a viscosity correction at a negative speed', 'viscosityCorrection', { qBepGpm: 1500, headBepFt: 300, viscosityCSt: 100, speedRpm: -3560 }],
  ['a head to pressure conversion at zero gravity', 'psiToHeadFt', { psi: 100, sg: 0 }],
  ['two and a half pumps in parallel', 'combineParallelCount', { n: 2.5 }],
];

export const UNGUARDED_NPSH_PROBES = [
  ['an available head that is not a number', { npshrFt: 12 }],
  ['an available head of infinity', { npshaFt: Infinity, npshrFt: 12 }],
  ['an available head below required', { npshaFt: 8, npshrFt: 12 }],
  ['an available head inside the customary margin', { npshaFt: 14, npshrFt: 12 }],
  ['an available head clear of it', { npshaFt: 25, npshrFt: 12 }],
];

export const UNGUARDED_COMPRESSION_PROBES = [
  ['a per-stage ratio limit of one', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxRatioPerStage: 1 }],
  ['a negative per-stage ratio limit', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxRatioPerStage: -4 }],
  ['a polytropic efficiency of zero', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 0 }],
  ['a polytropic efficiency above one', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 1.5 }],
  ['a suction below absolute zero', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: -600, k: 1.28 }],
  ['a discharge limit below the suction temperature', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxDischargeF: -100 }],
  ['a stage at zero polytropic efficiency', 'compressionStage', { qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 3.16, gasSg: 0.65, k: 1.28, polytropicEfficiency: 0 }],
  ['a stage at zero mechanical efficiency', 'compressionStage', { qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 3.16, gasSg: 0.65, k: 1.28, mechanicalEfficiency: 0 }],
  ['an inlet volume at zero rate', 'actualInletCfm', { qMMscfd: 0, pPsia: 200, tF: 100, gasSg: 0.65 }],
  ['an inlet volume below absolute zero', 'actualInletCfm', { qMMscfd: 20, pPsia: 200, tF: -600, gasSg: 0.65 }],
  ['a machine screened on that volume', 'machineScreen', { qMMscfd: 20, pSuctionPsia: 200, tSuctionF: -600, gasSg: 0.65, overallRatio: 3, totalBrakeHp: 500 }],
  ['a driver more efficient than thermodynamics allows', 'driverFuel', { brakeHp: 1000, heatRateBtuHpHr: 2000, gasLhvBtuScf: 950 }],
  ['a driver a thousand times more efficient than that', 'driverFuel', { brakeHp: 1000, heatRateBtuHpHr: 1, gasLhvBtuScf: 950 }],
];

/** The rational (k, polytropic efficiency) pairs the identity is shown on.
 *  e times eta is exactly (k - 1) / k, so the two power routes are one
 *  expression. Printed as a computed difference, never asserted in prose. */
export const IDENTITY_PAIRS = [
  { k: 1.28, polytropicEfficiency: 0.75 },
  { k: 1.26, polytropicEfficiency: 0.78 },
  { k: 1.30, polytropicEfficiency: 0.72 },
  { k: 1.40, polytropicEfficiency: 0.82 },
];

// ---------------------------------------------------------------------------
// The probe lists the digest's own refusal blocks walk. Every message comes
// back from the engine; not one of them is written as a literal in this file,
// and the refusal gate in rotatingLab.test.js proves it.
// ---------------------------------------------------------------------------

/** States the pump module has no answer for. */
export const PUMP_SOFT_PROBES = [
  ['a system curve with no flow to state its friction at', () => P.systemCurve({ staticHeadFt: 100, frictionHeadFt: 200, atFlowGpm: 0 })],
  ['a system curve with a negative friction head', () => P.systemCurve({ staticHeadFt: 100, frictionHeadFt: -50, atFlowGpm: 1500 })],
  ['a pump curve from two points', () => P.fitPumpCurve({ points: OKONO_POINTS.slice(0, 2) })],
  ['a pump curve from three readings at one flow', () => P.fitPumpCurve({ points: [{ qGpm: 100, headFt: 50 }, { qGpm: 100, headFt: 60 }, { qGpm: 100, headFt: 70 }] })],
  ['a pump curve with a negative head', () => P.fitPumpCurve({ points: [{ qGpm: 0, headFt: -5 }, { qGpm: 100, headFt: 50 }, { qGpm: 200, headFt: 40 }] })],
  ['a duty with no system to work into', () => P.dutyPoint({ pump: P.fitPumpCurve({ points: OKONO_POINTS }) })],
  ['a duty with no pump', () => P.dutyPoint({ system: P.systemCurve(OKONO_SYSTEM) })],
  ['power at no flow', () => P.pumpPower({ qGpm: 0, headFt: 300, sg: 1, efficiency: 0.7 })],
  ['power at no gravity', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 0, efficiency: 0.7 })],
  ['power at an efficiency of zero', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 1, efficiency: 0 })],
  ['power at an efficiency above one', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 1, efficiency: 1.0001 })],
  ['power through a motor efficiency of zero', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 1, efficiency: 0.7, motorEfficiency: 0 })],
  ['power through a motor efficiency above one', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 1, efficiency: 0.7, motorEfficiency: 5 })],
  ['a system curve with no static head at all', () => P.systemCurve({ frictionHeadFt: 200, atFlowGpm: 1500 })],
  ['a duty on a curve that rises with flow', () => P.dutyPoint({ pump: P.fitPumpCurve({ points: NOT_A_PUMP_CURVE }), system: P.systemCurve(OKONO_SYSTEM), qMaxGpm: OKONO_Q_MAX_GPM })],
  ['NPSH at no gravity', () => P.npshAvailable({ suctionPressurePsia: 14.7, vapourPressurePsia: 0.5, sg: 0 })],
  ['NPSH with no suction pressure', () => P.npshAvailable({ vapourPressurePsia: 0.5, sg: 0.85 })],
  ['NPSH with no vapour pressure', () => P.npshAvailable({ suctionPressurePsia: 14.7, sg: 0.85 })],
  ['a margin check with no required NPSH', () => P.npshCheck({ npshaFt: 20, npshrFt: 0 })],
  ['a margin check on an available head that is not a number', () => P.npshCheck({ npshaFt: NaN, npshrFt: 12 })],
  ['NPSH with a suction friction that cannot be read', () => P.npshAvailable({ suctionPressurePsia: 14.7, vapourPressurePsia: 0.5, sg: 0.85, staticSuctionLiftFt: 4, suctionFrictionFt: NaN })],
  ['a speed change at a ratio of zero', () => P.speedChange({ qGpm: 1000, headFt: 300, brakeHp: 100, speedRatio: 0 })],
  ['a speed change with no duty to change', () => P.speedChange({ speedRatio: 1.1 })],
  ['a trim with no duty to trim', () => P.impellerTrim({ diameterRatio: 0.9 })],
  ['an impeller trimmed LARGER', () => P.impellerTrim({ qGpm: 1000, headFt: 300, brakeHp: 100, diameterRatio: 1.2 })],
  ['a viscosity correction with no BEP flow', () => P.viscosityCorrection({ qBepGpm: 0, headBepFt: 300, viscosityCSt: 100 })],
  ['a viscosity correction with no viscosity', () => P.viscosityCorrection({ qBepGpm: 1500, headBepFt: 300, viscosityCSt: 0 })],
  ['a viscosity correction at a standstill', () => P.viscosityCorrection({ qBepGpm: 1500, headBepFt: 300, viscosityCSt: 100, speedRpm: 0 })],
  ['half a pump in parallel', () => P.combineParallel({ pump: P.fitPumpCurve({ points: OKONO_POINTS }), n: 0.5 })],
  ['pumps in series with no curve', () => P.combineSeries({ n: 2 })],
  ['an operating region with no best efficiency flow', () => P.operatingRegion({ qGpm: 1000, qBepGpm: 0 })],
  ['an operating region at a negative flow', () => P.operatingRegion({ qGpm: -5, qBepGpm: 1000 })],
];

/** States the compression module has no answer for. */
export const COMPRESSION_SOFT_PROBES = [
  ['a discharge below the suction', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 50, tSuctionF: 100, k: 1.28 })],
  ['a discharge equal to the suction', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 100, tSuctionF: 100, k: 1.28 })],
  ['a heat capacity ratio of one', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1 })],
  ['a duty no practical stage count can cool', () => C.stageCount(STAGE_CAP_DUTY)],
  ['a polytropic efficiency above one', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 1.5 })],
  ['a per-stage ratio limit of one', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxRatioPerStage: 1 })],
  ['a suction below absolute zero', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: -600, k: 1.28 })],
  ['a discharge limit at or below the suction temperature', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxDischargeF: -100 })],
  ['a stage at no rate', () => C.compressionStage({ qMMscfd: 0, pSuctionPsia: 100, tSuctionF: 100, ratio: 3, gasSg: 0.65, k: 1.28 })],
  ['a stage at a ratio of one', () => C.compressionStage({ qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 1, gasSg: 0.65, k: 1.28 })],
  ['a stage with no gas gravity', () => C.compressionStage({ qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 3, gasSg: 0, k: 1.28 })],
  ['a stage at a mechanical efficiency of zero', () => C.compressionStage({ qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 3, gasSg: 0.65, k: 1.28, mechanicalEfficiency: 0 })],
  ['a stage colder than the compressibility correlation reaches', () => C.compressionStage(DAK_COLD_PROBE)],
  ['a stage at a pressure above where that correlation stops', () => C.compressionStage(DAK_HIGH_P_PROBE)],
  ['a train whose interstage specific heat cannot be read', () => C.compressorTrain({ ...SOKU, cpBtuLbF: NaN })],
  ['a machine screen with no gas gravity to take pseudo-criticals from', () => C.machineScreen({ qMMscfd: 20, pSuctionPsia: 200, tSuctionF: 100, overallRatio: 3, totalBrakeHp: 500 })],
  ['a machine screen at no rate', () => C.machineScreen({ qMMscfd: 0, pSuctionPsia: 200, tSuctionF: 100, gasSg: 0.65, overallRatio: 3, totalBrakeHp: 500 })],
  ['a driver with no power', () => C.driverFuel({ brakeHp: 0 })],
  ['a driver with no heat rate', () => C.driverFuel({ brakeHp: 1000, heatRateBtuHpHr: 0 })],
  ['a driver burning gas with no heating value', () => C.driverFuel({ brakeHp: 1000, gasLhvBtuScf: 0 })],
  ['a driver more efficient than the first law allows', () => C.driverFuel({ brakeHp: 1000, heatRateBtuHpHr: 2000 })],
];

/** The five exports that hand back a bare number, each with the probe that
 *  proves it. Which ones they are is MEASURED rather than counted by eye: an
 *  earlier draft of the dump said "two" and there are five. */
export const BARE_NUMBER_PROBES = [
  ['pumps.headFtToPsi', () => P.headFtToPsi({ headFt: 100, sg: 1 })],
  ['pumps.psiToHeadFt', () => P.psiToHeadFt({ psi: 100, sg: 1 })],
  ['compression.polytropicExponentRatio', () => C.polytropicExponentRatio({ k: 1.28, polytropicEfficiency: 0.75 })],
  ['compression.dischargeTempR', () => C.dischargeTempR({ tSuctionR: 560, ratio: 3, k: 1.28, polytropicEfficiency: 0.75 })],
  ['compression.actualInletCfm', () => C.actualInletCfm({ qMMscfd: 20, pPsia: 200, tF: 100, gasSg: 0.65 })],
];

/** The NaN contract, one row per input each of the five must refuse, with two
 *  readable controls: a contract that says NaN is worth nothing unless the
 *  same function returns a real number when it can. */
export const NAN_CONTRACT_PROBES = [
  ['pumps.headFtToPsi', 'a gravity of zero', () => P.headFtToPsi({ headFt: 100, sg: 0 })],
  ['pumps.psiToHeadFt', 'a gravity of zero', () => P.psiToHeadFt({ psi: 100, sg: 0 })],
  ['pumps.psiToHeadFt', 'a readable case, as a control', () => P.psiToHeadFt({ psi: 100, sg: 0.85 })],
  ['compression.polytropicExponentRatio', 'an efficiency above one', () => C.polytropicExponentRatio({ k: 1.28, polytropicEfficiency: 1.5 })],
  ['compression.dischargeTempR', 'a suction temperature that is not a number', () => C.dischargeTempR({ tSuctionR: NaN, ratio: 3, k: 1.28, polytropicEfficiency: 0.75 })],
  ['compression.actualInletCfm', 'a suction below absolute zero', () => C.actualInletCfm({ qMMscfd: 20, pPsia: 200, tF: -600, gasSg: 0.65 })],
  ['compression.actualInletCfm', 'a state outside the compressibility window', () => C.actualInletCfm({ qMMscfd: 20, pPsia: DAK_HIGH_P_PROBE.pSuctionPsia, tF: DAK_HIGH_P_PROBE.tSuctionF, gasSg: DAK_HIGH_P_PROBE.gasSg })],
  ['compression.actualInletCfm', 'a readable state, as a control', () => C.actualInletCfm({ qMMscfd: 20, pPsia: 200, tF: 100, gasSg: 0.65 })],
];

/** Four faults that used to share one sentence and now have four, each one
 *  naming the input that is actually wrong. */
export const FOUR_FAULT_PROBES = [
  ['a polytropic efficiency of zero', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 0 }],
  ['a polytropic efficiency above one', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 1.5 }],
  ['a suction below absolute zero', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: -600, k: 1.28 }],
  ['a discharge limit below the suction temperature', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxDischargeF: -100 }],
];

export const HELD_MARKER = 'HELD FOR LITERATURE';

/**
 * The eight things this course teaches as limits and never as answers. Each
 * carries the section it is used in and what holding it costs. No graded
 * capstone field reads any of them, and the held gate proves that by
 * construction rather than by hope.
 */
export const HELD_ITEMS = [
  {
    id: 'viscosity-correction',
    section: 10,
    title: 'The Hydraulic Institute viscosity correction',
    note: `${HELD_MARKER}: empirical, unsourced in this repository, and the head factor is taken equal to the flow factor at best efficiency. Taught as a limit and never as an answer, so no graded value in this course is a corrected flow, head or efficiency.`,
  },
  {
    id: 'trim-shortfall',
    section: 8,
    title: 'The impeller trim shortfall model',
    note: `${HELD_MARKER}: the engine calls it "the published shortfall" and names no publication. Its power leg is left as the ideal cube for that same reason. Taught as a limit and never as an answer, so no graded value in this course is a trimmed flow, head or shortfall.`,
  },
  {
    id: 'operating-region-bands',
    section: 5,
    title: 'The operating-region bands',
    note: `${HELD_MARKER}: 50, 70, 120 and 140 percent of best efficiency flow are customary and this repository holds no publication for them. Taught as a limit and never as an answer, so no graded value in this course is a region, a percentage of best efficiency flow or a preferred flag.`,
  },
  {
    id: 'npsh-margin-rule',
    section: 7,
    title: 'The NPSH margin rule',
    note: `${HELD_MARKER}: the larger of a floor in feet and a fraction of required. Both halves are measurable out of the engine and Section 7 measures them; the rule itself is customary. Taught as a limit and never as an answer, so no graded value in this course is a required margin, a pass flag or a severity.`,
  },
  {
    id: 'machine-screen-thresholds',
    section: 14,
    title: 'The machine-screening thresholds',
    note: `${HELD_MARKER}: the inlet volumes, the overall ratios and the brake powers the screen branches on are customary and unsourced here. Taught as a limit and never as an answer, so no graded value in this course is a recommendation.`,
  },
  {
    id: 'default-discharge-limit',
    section: 11,
    title: 'The DEFAULT discharge-temperature limit',
    note: `${HELD_MARKER}: it is the figure the engine uses when the caller states none, and it is measured out of the engine by bisection rather than quoted. The warning is measured against whatever the caller does state. Taught as a limit and never as an answer.`,
  },
  {
    id: 'implied-water-density',
    section: 4,
    title: 'What the implied water density is away from real water',
    note: `${HELD_MARKER}: the two packagings are the engine's own definitions and are measurable, and Section 4 measures both and prints the difference between them. The handbook figure they approximate is not in this repository. Taught as a limit and never as an answer.`,
  },
  {
    id: 'published-goldens',
    section: 16,
    title: 'Every published golden case, and the affinity speed band',
    note: `${HELD_MARKER}: every published case in this course was written by an oracle, and there is no measured pump test, no vendor performance run and no field compressor datasheet anywhere in it. The affinity speed band is held on the same footing: it is a sanity bound, and no publication here says where the laws stop describing a real machine. Taught as a limit and never as an answer.`,
  },
];

/** Four things that are not in these engines at all, so the course names the
 *  seam rather than papering over it. */
export const SCOPE_SEAMS = [
  'there is no compressor surge line, no surge margin, no recycle valve and no anti-surge control anywhere in the package',
  'there is no seal and no bearing calculation. Section 5 quotes the engine saying that bearing and seal life shorten below 70 percent of best efficiency flow, and that sentence is the whole of what this package knows about it',
  'there is no machine curve, no wheel selection, no valve dynamics and no rod loading',
  'there is no required-NPSH-against-flow curve, which is why Section 5\'s own note says to read the vendor curve at the duty flow before the suction margin means anything',
];

// ---------------------------------------------------------------------------
// The chain the Pump Station Designer runs, and the chain the Compressor
// Station Designer runs. Rebuilt on every call: nothing is memoised.
// ---------------------------------------------------------------------------

const okCurve = () => P.fitPumpCurve({ points: OKONO_POINTS });
const okSystem = () => P.systemCurve(OKONO_SYSTEM);
const okDuty = () => P.dutyPoint({ pump: okCurve(), system: okSystem(), qMaxGpm: OKONO_Q_MAX_GPM });
const okPower = () => {
  const d = okDuty();
  return P.pumpPower({
    qGpm: d.qGpm, headFt: d.headFt, sg: OKONO_SG,
    efficiency: OKONO_EFFICIENCY, motorEfficiency: OKONO_MOTOR_EFFICIENCY,
  });
};
const okFricSystem = () => P.systemCurve(OKONO_FRICTION_SYSTEM);
const okFricDuty = () => P.dutyPoint({ pump: okCurve(), system: okFricSystem(), qMaxGpm: OKONO_Q_MAX_GPM });
const notFit = () => P.fitPumpCurve({ points: NOT_A_PUMP_CURVE });
const sokuTrain = () => C.compressorTrain(SOKU);
const sokuStage = () => C.compressionStage(SOKU_STAGE);

// ---------------------------------------------------------------------------
// THE SEVENTEEN READERS, one per digest section.
// ---------------------------------------------------------------------------

/** SECTION 1: what these engines size, and what they refuse. */
export const engineScope = () => ({
  pumpExports: Object.keys(P).length,
  compressionExports: Object.keys(C).length,
  bareNumberNames: BARE_NUMBER_PROBES.filter(([, f]) => typeof f() === 'number').map(([nm]) => nm),
  pumpSoftStates: PUMP_SOFT_PROBES.map(([label, fn]) => ({ label, error: softOf(fn()) })),
  compressionSoftStates: COMPRESSION_SOFT_PROBES.map(([label, fn]) => ({ label, error: softOf(fn()) })),
});

/** SECTION 2: two curves, and why neither has an operating point. */
export const twoCurves = () => {
  const curve = okCurve();
  const sys = okSystem();
  const rising = notFit();
  const flat = P.fitPumpCurve({ points: FLAT_CURVE });
  const conditionSets = [
    ['the OKONO catalogue', OKONO_POINTS],
    ['a rising set', NOT_A_PUMP_CURVE],
    ['three identical heads', FLAT_CURVE],
    ['the published curve goldens, first', GP.curves[0].points],
    ['the published curve goldens, last', GP.curves[GP.curves.length - 1].points],
  ].map(([label, points]) => {
    const f = P.fitPumpCurve({ points });
    return {
      label, conditionNumber: f.conditionNumber, rSquared: f.rSquared, droops: f.droops,
    };
  });
  const conds = [OKONO_POINTS, NOT_A_PUMP_CURVE, FLAT_CURVE, ...GP.curves.map((r) => r.points), ...GP.duty.map((r) => r.points)]
    .map((points) => P.fitPumpCurve({ points }).conditionNumber)
    .filter((x) => Number.isFinite(x));
  return {
    points: OKONO_POINTS.map((p) => ({ qGpm: p.qGpm, headFt: p.headFt })),
    coefficients: {
      c0: curve.coefficients.c0,
      c1: curve.coefficients.c1,
      c2: curve.coefficients.c2,
      scale: curve.coefficients.scale,
    },
    shutoffHeadFt: curve.shutoffHeadFt,
    rSquared: curve.rSquared,
    droops: curve.droops,
    warning: curve.warning,
    conditionNumber: curve.conditionNumber,
    conditioningNote: curve.conditioningNote,
    conditionSets,
    conditionCount: conds.length,
    conditionMin: Math.min(...conds),
    conditionMax: Math.max(...conds),
    catalogueShutoffFt: OKONO_POINTS[0].headFt,
    shutoffMissDerivedFt: curve.shutoffHeadFt - OKONO_POINTS[0].headFt,
    readback: OKONO_POINTS.map((p) => {
      const h = curve.headAt(p.qGpm);
      return {
        qGpm: p.qGpm, catalogueHeadFt: p.headFt, fittedHeadFt: h, residualDerivedFt: h - p.headFt,
      };
    }),
    system: {
      staticHeadFt: OKONO_SYSTEM.staticHeadFt,
      frictionHeadFt: OKONO_SYSTEM.frictionHeadFt,
      atFlowGpm: OKONO_SYSTEM.atFlowGpm,
      kFt: sys.kFt,
      staticReadBackFt: sys.staticHeadFt,
    },
    crossing: [0, 300, 600, 900, 1200, 1500, 1800].map((q) => {
      const a = curve.headAt(q);
      const b = sys.headAt(q);
      return {
        qGpm: q, pumpHeadFt: a, systemHeadFt: b, differenceDerivedFt: a - b,
      };
    }),
    rising: {
      points: NOT_A_PUMP_CURVE.map((p) => ({ qGpm: p.qGpm, headFt: p.headFt })),
      c2: rising.coefficients.c2,
      rSquared: rising.rSquared,
      droops: rising.droops,
      warning: rising.warning,
    },
    flat: {
      c2: flat.coefficients.c2, rSquared: flat.rSquared, droops: flat.droops, warning: flat.warning,
    },
  };
};

/** SECTION 3: the duty point, solved. */
export const dutyPointSolved = () => {
  const curve = okCurve();
  const sys = okSystem();
  const duty = okDuty();
  const fricSys = okFricSystem();
  const fricDuty = okFricDuty();
  // A curve that returns a non-finite head over part of the range. This is the
  // ONLY case in the course that makes `converged` come back false, and it is
  // run here as a negative control rather than described: a flag made only of
  // the bracket width could never be false at all.
  const poisoned = {
    droops: true,
    headAt: (q) => ((q > 900 && q < 1400) ? NaN : curve.headAt(q)),
  };
  const poisonedDuty = P.dutyPoint({ pump: poisoned, system: sys, qMaxGpm: OKONO_Q_MAX_GPM });
  // 200 halvings with no stopping test, which is what this solve used to do.
  // Computed so the digest's sentence about it is a measurement and not a
  // memory. This is arithmetic on the ENGINE'S OWN curves, not a second solver.
  const blindBisect = (pump, system, hi) => {
    let lo = 0;
    let high = hi;
    for (let i = 0; i < 200; i += 1) {
      const mid = (lo + high) / 2;
      if (pump.headAt(mid) - system.headAt(mid) > 0) lo = mid; else high = mid;
    }
    return (lo + high) / 2;
  };
  const blind = blindBisect(curve, sys, OKONO_Q_MAX_GPM);
  const tooHigh = P.dutyPoint({ pump: curve, system: P.systemCurve(OKONO_TOO_HIGH_SYSTEM), qMaxGpm: OKONO_Q_MAX_GPM });
  return {
    qGpm: duty.qGpm,
    headFt: duty.headFt,
    pumpHeadAtDutyFt: curve.headAt(duty.qGpm),
    systemHeadFt: duty.systemHeadFt,
    solvedDifferenceDerivedFt: curve.headAt(duty.qGpm) - duty.systemHeadFt,
    iterations: duty.iterations,
    bracketGpm: duty.bracketGpm,
    residualFt: duty.residualFt,
    converged: duty.converged,
    warning: duty.warning,
    poisoned: {
      qGpm: poisonedDuty.qGpm,
      awayFromTrueDerivedGpm: duty.qGpm - poisonedDuty.qGpm,
      bracketGpm: poisonedDuty.bracketGpm,
      iterations: poisonedDuty.iterations,
      residualFt: poisonedDuty.residualFt,
      converged: poisonedDuty.converged,
    },
    blindGpm: blind,
    blindDifferenceDerivedGpm: blind - duty.qGpm,
    friction: {
      staticHeadFt: OKONO_FRICTION_SYSTEM.staticHeadFt,
      frictionHeadFt: OKONO_FRICTION_SYSTEM.frictionHeadFt,
      atFlowGpm: OKONO_FRICTION_SYSTEM.atFlowGpm,
      kFt: fricSys.kFt,
      qGpm: fricDuty.qGpm,
      headFt: fricDuty.headFt,
      frictionShareDerivedFt: fricDuty.headFt - OKONO_FRICTION_SYSTEM.staticHeadFt,
    },
    staticSweep: [60, 120, 180, 210, 260, 320, 400].map((s) => {
      const d = P.dutyPoint({ pump: curve, system: P.systemCurve({ ...OKONO_SYSTEM, staticHeadFt: s }), qMaxGpm: OKONO_Q_MAX_GPM });
      return {
        staticHeadFt: s, refused: Boolean(d.error), qGpm: d.error ? null : d.qGpm, headFt: d.error ? null : d.headFt,
      };
    }),
    risingRefusal: softOf(P.dutyPoint({ pump: notFit(), system: sys, qMaxGpm: OKONO_Q_MAX_GPM })),
    tooHigh: {
      error: softOf(tooHigh),
      shutoffHeadFt: tooHigh.shutoffHeadFt,
      systemStaticHeadFt: tooHigh.systemStaticHeadFt,
      gapDerivedFt: tooHigh.systemStaticHeadFt - tooHigh.shutoffHeadFt,
    },
    searchLimitRefusal: softOf(P.dutyPoint({ pump: curve, system: sys, qMaxGpm: 200 })),
  };
};

/** SECTION 4: power, head and pressure, and the constants measured out of the engine. */
export const powerHeadPressure = () => {
  const duty = okDuty();
  const power = okPower();
  const m231 = P.psiToHeadFt({ psi: 1, sg: 1 });
  const unitPower = P.pumpPower({
    qGpm: 1, headFt: 1, sg: 1, efficiency: 1,
  });
  const m3960 = 1 / unitPower.hydraulicHp;
  const kwProbe = P.pumpPower({
    qGpm: 1000, headFt: 100, sg: 1, efficiency: 1, motorEfficiency: 1,
  });
  const defaultMotorProbe = P.pumpPower({
    qGpm: 1000, headFt: 100, sg: 1, efficiency: 1,
  });
  const dischargePsi = P.headFtToPsi({ headFt: duty.headFt, sg: OKONO_SG });
  const rhoA = 144 / m231;
  const rhoB = (33000 / m3960) * (1728 / 231);
  return {
    qGpm: duty.qGpm,
    headFt: duty.headFt,
    sg: OKONO_SG,
    efficiency: OKONO_EFFICIENCY,
    motorEfficiency: OKONO_MOTOR_EFFICIENCY,
    hydraulicHp: power.hydraulicHp,
    brakeHp: power.brakeHp,
    motorInputHp: power.motorInputHp,
    motorInputKw: power.motorInputKw,
    pumpLossDerivedHp: power.brakeHp - power.hydraulicHp,
    motorLossDerivedHp: power.motorInputHp - power.brakeHp,
    dischargePsi,
    roundTripFt: P.psiToHeadFt({ psi: dischargePsi, sg: OKONO_SG }),
    gravities: [0.62, 0.85, 1.00, OKONO_SG, 1.25].map((sg) => ({
      sg, headFt: duty.headFt, dischargePsi: P.headFtToPsi({ headFt: duty.headFt, sg }),
    })),
    measured: {
      ftPerPsi: m231,
      horsepowerPackaging: m3960,
      kwPerHp: kwProbe.motorInputKw / kwProbe.motorInputHp,
      defaultMotorEfficiency: defaultMotorProbe.brakeHp / defaultMotorProbe.motorInputHp,
    },
    densityFromPressurePackagingDerived: rhoA,
    densityFromPowerPackagingDerived: rhoB,
    densityDifferenceDerived: rhoA - rhoB,
    packagingQuotientDerived: m3960 / m231,
  };
};

/** SECTION 5: where the duty landed. */
export const whereTheDutyLanded = () => {
  const duty = okDuty();
  const region = P.operatingRegion({ qGpm: duty.qGpm, qBepGpm: OKONO_BEP_GPM });
  return {
    qGpm: duty.qGpm,
    qBepGpm: OKONO_BEP_GPM,
    percentOfBep: region.percentOfBep,
    region: region.region,
    preferred: region.preferred,
    note: region.note,
    bands: REGION_FRACTIONS.map((f) => {
      const q = OKONO_BEP_GPM * f;
      const r = P.operatingRegion({ qGpm: q, qBepGpm: OKONO_BEP_GPM });
      return {
        qGpm: q, percentOfBep: r.percentOfBep, region: r.region, preferred: r.preferred, notePresent: r.note !== null,
      };
    }),
    notes: [0.60, 1.30, 0.30, 1.60].map((f) => {
      const r = P.operatingRegion({ qGpm: OKONO_BEP_GPM * f, qBepGpm: OKONO_BEP_GPM });
      return { percentOfBep: r.percentOfBep, region: r.region, note: r.note };
    }),
  };
};

/** SECTION 6: NPSH available, from the real suction side. */
export const suctionSide = () => {
  const npsh = P.npshAvailable(OKONO_SUCTION);
  const atVapour = P.npshAvailable(FLASHING_SUCTION);
  const belowVapour = P.npshAvailable(FLASHING_SUCTION_BELOW);
  return {
    suction: { ...OKONO_SUCTION },
    pressureHeadFt: npsh.pressureHeadFt,
    npshaFt: npsh.npshaFt,
    warning: npsh.warning,
    threePartSumDerivedFt: npsh.pressureHeadFt + OKONO_SUCTION.staticSuctionLiftFt - OKONO_SUCTION.suctionFrictionFt,
    padding: OKONO_SUCTION_SWEEP_PSIA.map((p) => {
      const r = P.npshAvailable({ ...OKONO_SUCTION, suctionPressurePsia: p });
      return { suctionPressurePsia: p, pressureHeadFt: r.pressureHeadFt, npshaFt: r.npshaFt };
    }),
    atVapour: {
      suctionPressurePsia: FLASHING_SUCTION.suctionPressurePsia,
      vapourPressurePsia: FLASHING_SUCTION.vapourPressurePsia,
      pressureHeadFt: atVapour.pressureHeadFt,
      npshaFt: atVapour.npshaFt,
      warning: atVapour.warning,
    },
    belowVapour: {
      suctionPressurePsia: FLASHING_SUCTION_BELOW.suctionPressurePsia,
      vapourPressurePsia: FLASHING_SUCTION_BELOW.vapourPressurePsia,
      pressureHeadFt: belowVapour.pressureHeadFt,
      npshaFt: belowVapour.npshaFt,
      warning: belowVapour.warning,
    },
  };
};

/** SECTION 7: the margin, and the rule it is judged against. */
export const marginAndRule = () => {
  // Both halves of the rule and the required NPSH where they change places are
  // MEASURED out of the engine by asking it about its own return, never typed.
  const reqMargin = (r) => P.npshCheck({ npshaFt: r + 1e4, npshrFt: r }).requiredMarginFt;
  const floorFt = reqMargin(1e-6);
  const fraction = reqMargin(1e6) / 1e6;
  let mlo = 1e-6;
  let mhi = 1e6;
  for (let i = 0; i < 200; i += 1) {
    const mid = (mlo + mhi) / 2;
    if (mid === mlo || mid === mhi) break;
    if (reqMargin(mid) > floorFt) mhi = mid; else mlo = mid;
  }
  const boundaryRatio = (r) => P.npshCheck({ npshaFt: r + reqMargin(r), npshrFt: r }).ratio;
  return {
    npshrFt: OKONO_NPSHR_FT,
    sweep: OKONO_SUCTION_SWEEP_PSIA.map((p) => {
      const a = P.npshAvailable({ ...OKONO_SUCTION, suctionPressurePsia: p });
      const c = P.npshCheck({ npshaFt: a.npshaFt, npshrFt: OKONO_NPSHR_FT });
      return {
        suctionPressurePsia: p,
        npshaFt: a.npshaFt,
        marginFt: c.marginFt,
        requiredMarginFt: c.requiredMarginFt,
        ratio: c.ratio,
        pass: c.pass,
        severity: c.severity,
      };
    }),
    severities: UNGUARDED_NPSH_PROBES.slice(2).map(([label, inp]) => {
      const c = P.npshCheck(inp);
      return {
        label,
        marginFt: c.marginFt,
        requiredMarginFt: c.requiredMarginFt,
        severity: c.severity,
        pass: c.pass,
        note: c.note,
      };
    }),
    unreadable: UNGUARDED_NPSH_PROBES.slice(0, 2).map(([label, inp]) => ({
      label, shape: shapeOf(P.npshCheck(inp)),
    })),
    floorFt,
    fraction,
    crossoverFt: mhi,
    crossoverByQuotientDerivedFt: floorFt / fraction,
    rule: [4, OKONO_NPSHR_FT, 12, 30].map((r) => {
      const m = reqMargin(r);
      return {
        npshrFt: r,
        requiredMarginFt: m,
        boundHalf: m > floorFt ? 'the fraction' : 'the floor',
        exactlySatisfiedFt: r + m,
        ratioThere: P.npshCheck({ npshaFt: r + m, npshrFt: r }).ratio,
      };
    }),
    governedRatioAtVendorNpshr: boundaryRatio(OKONO_NPSHR_FT),
    governedRatioAtFour: boundaryRatio(4),
    governedRatioDifferenceDerived: boundaryRatio(4) - boundaryRatio(OKONO_NPSHR_FT),
  };
};

/** SECTION 8: a speed change and a trim are not the same thing. */
export const speedAndTrim = () => {
  const duty = okDuty();
  const power = okPower();
  const base = { qGpm: duty.qGpm, headFt: duty.headFt, brakeHp: power.brakeHp };
  // Both ends of the band the engine reports a ratio without comment over,
  // walked out of the engine by halving until the warning changes state.
  const speedWarns = (ratio) => P.speedChange({
    qGpm: 1, headFt: 1, brakeHp: 1, speedRatio: ratio,
  }).warning !== null;
  const speedEdge = (lo, hi) => {
    let a = lo;
    let b = hi;
    for (let i = 0; i < 200; i += 1) {
      const mid = (a + b) / 2;
      if (mid === a || mid === b) break;
      if (speedWarns(mid) === speedWarns(lo)) a = mid; else b = mid;
    }
    return b;
  };
  const farSpeed = P.speedChange({ ...base, speedRatio: 100 });
  const trimPctAt = (d) => P.impellerTrim({
    qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio: d,
  }).trimPercent;
  const shortAt = (d) => P.impellerTrim({
    qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio: d,
  }).shortfallPct;
  let slo = TRIM_AT_SHORTFALL_START;
  let shi = 0.9;
  for (let i = 0; i < 200; i += 1) {
    const mid = (slo + shi) / 2;
    if (mid === slo || mid === shi) break;
    if (shortAt(mid) === 0) slo = mid; else shi = mid;
  }
  const atWarning = P.impellerTrim({ ...base, diameterRatio: TRIM_AT_WARNING });
  const unitAtWarning = P.impellerTrim({
    qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio: TRIM_AT_WARNING,
  });
  const atCap = P.impellerTrim({ ...base, diameterRatio: TRIM_AT_CAP });
  const capFlowShareDerived = atCap.qGpm / atCap.idealQGpm;
  const capHeadShareDerived = atCap.headFt / atCap.idealHeadFt;
  return {
    baseQGpm: base.qGpm,
    baseHeadFt: base.headFt,
    baseBrakeHp: base.brakeHp,
    speed: OKONO_SPEED_SWEEP.map((s) => {
      const r = P.speedChange({ ...base, speedRatio: s });
      const hq = r.headFt / base.headFt;
      const pq = r.brakeHp / base.brakeHp;
      return {
        speedRatio: s,
        qGpm: r.qGpm,
        headFt: r.headFt,
        brakeHp: r.brakeHp,
        headQuotientDerived: hq,
        headLessSquareDerived: hq - s ** 2,
        powerQuotientDerived: pq,
        powerLessCubeDerived: pq - s ** 3,
        warned: r.warning !== null,
      };
    }),
    bandLowFrom: 0.01,
    bandLow: speedEdge(0.01, 1),
    bandHighFrom: 5,
    bandHigh: speedEdge(5, 1),
    farRatio: 100,
    far: {
      qGpm: farSpeed.qGpm, headFt: farSpeed.headFt, brakeHp: farSpeed.brakeHp, warning: farSpeed.warning,
    },
    trim: OKONO_TRIM_SWEEP.map((d) => {
      const r = P.impellerTrim({ ...base, diameterRatio: d });
      return {
        diameterRatio: d,
        trimPercent: r.trimPercent,
        idealQGpm: r.idealQGpm,
        qGpm: r.qGpm,
        idealHeadFt: r.idealHeadFt,
        headFt: r.headFt,
        shortfallPct: r.shortfallPct,
        brakeHp: r.brakeHp,
        impliedEfficiencyRatio: r.impliedEfficiencyRatio,
        warned: r.warning !== null,
      };
    }),
    warnings: [TRIM_JUST_PAST_WARNING, TRIM_PAST_CAP].map((d) => ({
      diameterRatio: d, warning: P.impellerTrim({ ...base, diameterRatio: d }).warning,
    })),
    atWarning: {
      diameterRatio: TRIM_AT_WARNING, trimPercent: atWarning.trimPercent, warned: atWarning.warning !== null,
    },
    boundaries: [
      [TRIM_AT_SHORTFALL_START, 'where the shortfall is meant to begin'],
      [TRIM_JUST_INSIDE_SHORTFALL, 'one ten-thousandth past it'],
      [TRIM_AT_CAP, 'where the shortfall reaches its cap'],
      [TRIM_PAST_CAP, 'far past the cap'],
    ].map(([d, label]) => {
      const r = P.impellerTrim({ ...base, diameterRatio: d });
      return { label, diameterRatio: d, trimPercent: r.trimPercent, shortfallPct: r.shortfallPct };
    }),
    slack: {
      atStartTrimPercent: trimPctAt(TRIM_AT_SHORTFALL_START),
      aboveFiveDerived: trimPctAt(TRIM_AT_SHORTFALL_START) - 5,
      atStartShortfallPct: shortAt(TRIM_AT_SHORTFALL_START),
      lastWithoutTrimPercent: trimPctAt(slo),
      firstWithTrimPercent: trimPctAt(shi),
      boundaryAboveFiveDerived: trimPctAt(shi) - 5,
      warningTrimPercent: unitAtWarning.trimPercent,
      warningWarned: unitAtWarning.warning !== null,
    },
    cap: {
      diameterRatio: TRIM_AT_CAP,
      flowShareDerived: capFlowShareDerived,
      headShareDerived: capHeadShareDerived,
      productDerived: capFlowShareDerived * capHeadShareDerived,
      powerShareOfIdealCubeDerived: atCap.brakeHp / (base.brakeHp * TRIM_AT_CAP ** 3),
      impliedEfficiencyRatio: atCap.impliedEfficiencyRatio,
      impliedLessDerivedDifference: atCap.impliedEfficiencyRatio - capFlowShareDerived * capHeadShareDerived,
    },
  };
};

/** SECTION 9: an affinity law applied to a duty point is not a new duty point. */
export const crossingAndMap = () => {
  const curve = okCurve();
  const sys = okSystem();
  const duty = okDuty();
  const power = okPower();
  const base = { qGpm: duty.qGpm, headFt: duty.headFt, brakeHp: power.brakeHp };
  // The studio's composition, replicated: ask the engine what a change does to
  // a duty of 1 gpm at 1 ft at 1 bhp, which IS the factor because both laws are
  // homogeneous of degree one in the duty; then scale the whole curve by it and
  // re-intersect. Every head on it comes from the engine's own fitted curve and
  // its own laws.
  const changeFactors = (speedRatio, diameterRatio) => {
    const t = P.impellerTrim({
      qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio,
    });
    const v = P.speedChange({
      qGpm: 1, headFt: 1, brakeHp: 1, speedRatio,
    });
    return { qScale: t.qGpm * v.qGpm, hScale: t.headFt * v.headFt };
  };
  const studioScaled = (speedRatio, diameterRatio) => {
    const { qScale, hScale } = changeFactors(speedRatio, diameterRatio);
    return { headAt: (q) => curve.headAt(q / qScale) * hScale, droops: curve.droops };
  };
  const re95 = P.dutyPoint({ pump: studioScaled(1, 0.95), system: sys, qMaxGpm: OKONO_Q_MAX_GPM });
  const one95 = P.impellerTrim({ ...base, diameterRatio: 0.95 });
  return {
    factors: [[1, 1], [1, 0.95], [1, 0.8], [1.1, 1], [0.8, 1], [1.1, 0.9]].map(([sr, dr]) => {
      const f = changeFactors(sr, dr);
      return {
        speedRatio: sr, diameterRatio: dr, qScale: f.qScale, hScale: f.hScale,
      };
    }),
    trims: [1.00, 0.95, 0.90, 0.85, 0.80, 0.75].map((d) => {
      const re = P.dutyPoint({ pump: studioScaled(1, d), system: sys, qMaxGpm: OKONO_Q_MAX_GPM });
      const one = P.impellerTrim({ ...base, diameterRatio: d });
      return {
        diameterRatio: d,
        reSolvedQGpm: re.qGpm,
        reSolvedHeadFt: re.headFt,
        onePointQGpm: one.qGpm,
        onePointHeadFt: one.headFt,
        flowQuotientDerived: one.qGpm / re.qGpm,
        headQuotientDerived: one.headFt / re.headFt,
      };
    }),
    speeds: OKONO_SPEED_SWEEP.map((s) => {
      const re = P.dutyPoint({ pump: studioScaled(s, 1), system: sys, qMaxGpm: OKONO_Q_MAX_GPM });
      const one = P.speedChange({ ...base, speedRatio: s });
      return {
        speedRatio: s,
        reSolvedQGpm: re.qGpm,
        reSolvedHeadFt: re.headFt,
        onePointQGpm: one.qGpm,
        onePointHeadFt: one.headFt,
        flowQuotientDerived: one.qGpm / re.qGpm,
        headQuotientDerived: one.headFt / re.headFt,
      };
    }),
    at95: {
      shortfallPct: one95.shortfallPct,
      reSolvedQGpm: re95.qGpm,
      onePointQGpm: one95.qGpm,
      quotientDerived: one95.qGpm / re95.qGpm,
      onePointHeadFt: one95.headFt,
      scaledCurveAtOnePointFt: studioScaled(1, 0.95).headAt(one95.qGpm),
      onCurveDifferenceDerivedFt: studioScaled(1, 0.95).headAt(one95.qGpm) - one95.headFt,
    },
  };
};

/** SECTION 10: two pumps, and a catalogue curve that is a water curve. */
export const twoPumpsAndWater = () => {
  const curve = okCurve();
  const sys = okSystem();
  const fricSys = okFricSystem();
  const fricDuty = okFricDuty();
  const oneMachine = fricDuty.qGpm;
  const series3 = P.combineSeries({ pump: curve, n: 3 });
  const water = P.viscosityCorrection({
    qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: 1, speedRpm: OKONO_SPEED_RPM,
  });
  const justOver = P.viscosityCorrection({
    qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: 1.000001, speedRpm: OKONO_SPEED_RPM,
  });
  const corrected = P.viscosityCorrection({
    qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: 100, speedRpm: OKONO_SPEED_RPM,
  });
  return {
    staticHeadFt: OKONO_FRICTION_SYSTEM.staticHeadFt,
    frictionHeadFt: OKONO_FRICTION_SYSTEM.frictionHeadFt,
    atFlowGpm: OKONO_FRICTION_SYSTEM.atFlowGpm,
    parallel: OKONO_PARALLEL_COUNTS.map((k) => {
      const pump = k === 1 ? curve : P.combineParallel({ pump: curve, n: k });
      const d = P.dutyPoint({ pump, system: fricSys, qMaxGpm: OKONO_Q_MAX_GPM });
      return {
        machines: k,
        qGpm: d.qGpm,
        headFt: d.headFt,
        overOneMachineDerived: d.qGpm / oneMachine,
        perMachineDerivedGpm: d.qGpm / k,
      };
    }),
    series: OKONO_SERIES_COUNTS.map((k) => {
      const pump = k === 1 ? curve : P.combineSeries({ pump: curve, n: k });
      const d = P.dutyPoint({ pump, system: fricSys, qMaxGpm: OKONO_Q_MAX_GPM });
      return {
        machines: k, qGpm: d.qGpm, headFt: d.headFt, overOneMachineDerived: d.headFt / fricDuty.headFt,
      };
    }),
    readBack: {
      qGpm: 1000,
      oneHeadFt: curve.headAt(1000),
      threeHeadFt: series3.headAt(1000),
      quotientDerived: series3.headAt(1000) / curve.headAt(1000),
    },
    halfInParallel: softOf(P.combineParallel({ pump: curve, n: 2.5 })),
    halfInSeries: softOf(P.combineSeries({ pump: curve, n: 2.5 })),
    stackDroopRefusal: softOf(P.dutyPoint({ pump: P.combineParallel({ pump: notFit(), n: 2 }), system: sys, qMaxGpm: OKONO_Q_MAX_GPM })),
    qBepGpm: OKONO_BEP_GPM,
    headBepFt: OKONO_BEP_HEAD_FT,
    speedRpm: OKONO_SPEED_RPM,
    viscosity: OKONO_VISC_SWEEP_CST.map((v) => {
      const r = P.viscosityCorrection({
        qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: v, speedRpm: OKONO_SPEED_RPM,
      });
      return {
        viscosityCSt: v,
        B: r.B,
        cQ: r.cQ,
        cH: r.cH,
        cEta: r.cEta,
        correctedPresent: r.correctedQGpm !== undefined,
        correctedHeadPresent: r.correctedHeadFt !== undefined,
        correctedQGpm: r.correctedQGpm === undefined ? null : r.correctedQGpm,
        correctedHeadFt: r.correctedHeadFt === undefined ? null : r.correctedHeadFt,
        warned: Boolean(r.warning),
        note: r.note === undefined ? null : r.note,
      };
    }),
    viscosityWarnings: [850, 9000].map((v) => ({
      viscosityCSt: v,
      warning: P.viscosityCorrection({
        qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: v, speedRpm: OKONO_SPEED_RPM,
      }).warning || null,
    })).filter((r) => r.warning !== null),
    waterB: water.B,
    justOverB: justOver.B,
    bDifferenceDerived: justOver.B - water.B,
    waterCorrectedPresent: water.correctedQGpm !== undefined,
    justOverCorrectedPresent: justOver.correctedQGpm !== undefined,
    correctedRowPresent: corrected.correctedQGpm !== undefined,
    waterCorrectedQGpm: water.correctedQGpm,
    waterCorrectedLessBepDerived: water.correctedQGpm - OKONO_BEP_GPM,
  };
};

/** SECTION 11: a stage is not a pump. */
export const stageIsNotAPump = () => {
  const st = sokuStage();
  const e = C.polytropicExponentRatio({ k: SOKU_STAGE.k, polytropicEfficiency: SOKU_STAGE.polytropicEfficiency });
  const eIdeal = C.polytropicExponentRatio({ k: SOKU_STAGE.k, polytropicEfficiency: 1 });
  const isentropicDischargeF = C.dischargeTempR({
    tSuctionR: G.toRankine(SOKU_STAGE.tSuctionF),
    ratio: SOKU_STAGE.ratio,
    k: SOKU_STAGE.k,
    polytropicEfficiency: 1,
  }) - G.R_OFFSET;
  // The DEFAULT discharge limit is not exported. It is MEASURED by walking the
  // ratio, with no limit stated, until the warning turns on, and reading the
  // discharge temperature the engine warned at.
  const warnsAt = (ratio) => C.compressionStage({ ...SOKU_STAGE, ratio, maxDischargeF: undefined }).warning !== null;
  let dlo = 1.5;
  let dhi = 4.5;
  for (let i = 0; i < 200; i += 1) {
    const mid = (dlo + dhi) / 2;
    if (mid === dlo || mid === dhi) break;
    if (warnsAt(mid)) dhi = mid; else dlo = mid;
  }
  return {
    stage: { ...SOKU_STAGE },
    exponentRatio: e,
    isentropicExponentRatio: eIdeal,
    exponentQuotientDerived: e / eIdeal,
    pDischargePsia: st.pDischargePsia,
    tDischargeF: st.tDischargeF,
    isentropicDischargeF,
    isentropicBelowDerivedF: st.tDischargeF - isentropicDischargeF,
    z1: st.z1,
    z2: st.z2,
    zAvg: st.zAvg,
    zSpreadDerived: st.z2 - st.z1,
    massLbHr: st.massLbHr,
    headPolyFtLbfLbm: st.headPolyFtLbfLbm,
    headIsenFtLbfLbm: st.headIsenFtLbfLbm,
    headQuotientDerived: st.headIsenFtLbfLbm / st.headPolyFtLbfLbm,
    polytropicEfficiency: st.polytropicEfficiency,
    isentropicEfficiency: st.isentropicEfficiency,
    efficiencyGapDerived: st.polytropicEfficiency - st.isentropicEfficiency,
    gasHp: st.gasHp,
    gasHpIsentropicRoute: st.gasHpIsentropicRoute,
    gasHpDifferenceDerived: st.gasHp - st.gasHpIsentropicRoute,
    brakeHp: st.brakeHp,
    mechanicalEfficiency: SOKU_STAGE.mechanicalEfficiency,
    zNote: st.zNote,
    warning: st.warning,
    statedLimits: [200, 250, 300, 400].map((lim) => {
      const r = C.compressionStage({ ...SOKU_STAGE, maxDischargeF: lim });
      return {
        statedLimitF: lim, tDischargeF: r.tDischargeF, warned: r.warning !== null, warning: r.warning,
      };
    }),
    defaultBracket: {
      lowRatio: dlo,
      highRatio: dhi,
      lowDischargeF: C.compressionStage({ ...SOKU_STAGE, ratio: dlo, maxDischargeF: undefined }).tDischargeF,
      highDischargeF: C.compressionStage({ ...SOKU_STAGE, ratio: dhi, maxDischargeF: undefined }).tDischargeF,
    },
    identity: IDENTITY_PAIRS.map(({ k, polytropicEfficiency }) => {
      const ex = C.polytropicExponentRatio({ k, polytropicEfficiency });
      const ke = C.polytropicExponentRatio({ k, polytropicEfficiency: 1 });
      return {
        k,
        polytropicEfficiency,
        exponentRatio: ex,
        timesEfficiencyDerived: ex * polytropicEfficiency,
        isentropicExponentRatio: ke,
        differenceDerived: ex * polytropicEfficiency - ke,
      };
    }),
    etaSweep: SOKU_ETA_SWEEP.map((eta) => {
      const r = C.compressionStage({ ...SOKU_STAGE, polytropicEfficiency: eta });
      return {
        polytropicEfficiency: eta,
        exponentRatio: C.polytropicExponentRatio({ k: SOKU_STAGE.k, polytropicEfficiency: eta }),
        tDischargeF: r.tDischargeF,
        headPolyFtLbfLbm: r.headPolyFtLbfLbm,
        gasHp: r.gasHp,
      };
    }),
    kSweep: SOKU_K_SWEEP.map((k) => {
      const r = C.compressionStage({ ...SOKU_STAGE, k });
      return {
        k,
        exponentRatio: C.polytropicExponentRatio({ k, polytropicEfficiency: SOKU_STAGE.polytropicEfficiency }),
        tDischargeF: r.tDischargeF,
        headPolyFtLbfLbm: r.headPolyFtLbfLbm,
        gasHp: r.gasHp,
      };
    }),
    ratioSweep: SOKU_RATIO_SWEEP.map((ratio) => {
      const r = C.compressionStage({ ...SOKU_STAGE, ratio });
      return {
        ratio,
        pDischargePsia: r.pDischargePsia,
        tDischargeF: r.tDischargeF,
        headPolyFtLbfLbm: r.headPolyFtLbfLbm,
        gasHp: r.gasHp,
        warned: r.warning !== null,
      };
    }),
  };
};

/** SECTION 12: the stage count, and the limit that governs. */
export const stageCountAndLimit = () => {
  const staging = C.stageCount(SOKU);
  const cap = C.stageCount(STAGE_CAP_DUTY);
  let sweepOverLimit = 0;
  const sweep = SOKU_DISCHARGE_SWEEP_PSIA.map((p) => {
    const s = C.stageCount({ ...SOKU, pDischargePsia: p });
    if (s.error) return { pDischargePsia: p, refused: true, error: s.error };
    const t = C.compressorTrain({ ...SOKU, pDischargePsia: p });
    const f = C.driverFuel({
      brakeHp: t.totalBrakeHp, heatRateBtuHpHr: SOKU_HEAT_RATE_BTU_HP_HR, gasLhvBtuScf: SOKU_LHV_BTU_SCF,
    });
    const hot = Math.max(...t.stages.map((x) => x.tDischargeF));
    if (hot > SOKU.maxDischargeF) sweepOverLimit += 1;
    return {
      pDischargePsia: p,
      refused: false,
      error: null,
      overallRatio: s.overallRatio,
      byRatio: s.byRatio,
      byTemp: s.byTemp,
      stages: s.stages,
      governedBy: s.governedBy,
      ratioPerStage: s.ratioPerStage,
      totalBrakeHp: t.totalBrakeHp,
      hottestF: hot,
      roomDerivedF: SOKU.maxDischargeF - hot,
      totalCoolingMMBtuHr: t.totalCoolingMMBtuHr,
      fuelMMscfd: f.fuelMMscfd,
    };
  });
  return {
    duty: { ...SOKU },
    overallRatio: staging.overallRatio,
    byRatio: staging.byRatio,
    byTemp: staging.byTemp,
    stages: staging.stages,
    governedBy: staging.governedBy,
    ratioPerStage: staging.ratioPerStage,
    sweep,
    sweepOverLimit,
    sweepRows: SOKU_DISCHARGE_SWEEP_PSIA.length,
    capDuty: { ...STAGE_CAP_DUTY },
    cap: {
      error: softOf(cap),
      triedStages: cap.triedStages,
      coolestReachedF: cap.coolestReachedF,
      maxDischargeF: cap.maxDischargeF,
      hottestInletF: cap.hottestInletF,
      // The SIXTH numeric field of the refusal. The digest named five and the
      // return carries six, so the inlet is printed beside the approach it was
      // taken from rather than alone.
      interstageCoolToF: cap.interstageCoolToF,
      overallRatio: cap.overallRatio,
      gapDerivedF: cap.coolestReachedF - cap.maxDischargeF,
    },
  };
};

/** SECTION 13: the train, its cooling, and the limit that buys the stages. */
export const trainAndCooling = () => {
  const train = sokuTrain();
  const temps = train.stages.map((s) => s.tDischargeF);
  const hot = C.compressorTrain(SOKU_HOT);
  const hotTemps = hot.stages.map((s) => s.tDischargeF);
  let coolSweepOver = 0;
  const coolSweep = SOKU_COOL_TO_SWEEP_F.map((c) => {
    const t = C.compressorTrain({ ...SOKU, interstageCoolToF: c });
    if (t.error) return { cooledToF: c, refused: true, error: t.error };
    const rowTemps = t.stages.map((s) => s.tDischargeF);
    const rowHot = Math.max(...rowTemps);
    const over = rowTemps.filter((x) => x > SOKU.maxDischargeF).length;
    coolSweepOver += over;
    return {
      cooledToF: c,
      refused: false,
      error: null,
      inletTestedAtF: t.stages.length <= 1 ? SOKU.tSuctionF : Math.max(SOKU.tSuctionF, c),
      stages: t.stages.length,
      governedBy: t.governedBy,
      dischargesF: rowTemps,
      hottestF: rowHot,
      roomDerivedF: SOKU.maxDischargeF - rowHot,
      stagesOverLimit: over,
      stagesWarned: t.stages.filter((s) => s.warning).length,
      totalCoolingMMBtuHr: t.totalCoolingMMBtuHr,
      totalGasHp: t.totalGasHp,
    };
  });
  const coolRows = coolSweep.filter((r) => !r.refused);
  const fixedCount = coolRows.filter((r) => r.stages === coolRows[0].stages);
  const tradeHolds = fixedCount.every((r, i) => i === 0
    || (r.totalCoolingMMBtuHr < fixedCount[i - 1].totalCoolingMMBtuHr && r.totalGasHp > fixedCount[i - 1].totalGasHp));
  const crossings = coolRows.filter((r, i) => i > 0 && r.stages !== coolRows[i - 1].stages);
  const firstCrossingIndex = crossings.length ? coolRows.findIndex((r) => r === crossings[0]) : -1;
  return {
    interstageCoolToF: SOKU.interstageCoolToF,
    tSuctionF: SOKU.tSuctionF,
    maxDischargeF: SOKU.maxDischargeF,
    stages: train.stages.map((s) => ({
      stage: s.stage,
      pSuctionPsia: s.pSuctionPsia,
      pDischargePsia: s.pDischargePsia,
      tSuctionF: s.tSuctionF,
      tDischargeF: s.tDischargeF,
      ratio: s.ratio,
      zAvg: s.zAvg,
      headPolyFtLbfLbm: s.headPolyFtLbfLbm,
      gasHp: s.gasHp,
      brakeHp: s.brakeHp,
      coolingBtuHr: s.coolingBtuHr,
      cooledToF: s.cooledToF,
      warned: s.warning !== null,
    })),
    totalGasHp: train.totalGasHp,
    totalBrakeHp: train.totalBrakeHp,
    totalCoolingBtuHr: train.totalCoolingBtuHr,
    totalCoolingMMBtuHr: train.totalCoolingMMBtuHr,
    finalDischargeF: train.finalDischargeF,
    hottestDerivedF: Math.max(...temps),
    roomDerivedF: SOKU.maxDischargeF - Math.max(...temps),
    coolSweep,
    coolSweepOver,
    hotCase: {
      duty: { ...SOKU_HOT },
      approachAboveSuctionDerivedF: SOKU_HOT.interstageCoolToF - SOKU_HOT.tSuctionF,
      stages: hot.stages.length,
      governedBy: hot.governedBy,
      dischargesF: hotTemps,
      hottestF: Math.max(...hotTemps),
      roomDerivedF: SOKU_HOT.maxDischargeF - Math.max(...hotTemps),
      stagesOverLimit: hotTemps.filter((x) => x > SOKU_HOT.maxDischargeF).length,
      stagesWarned: hot.stages.filter((s) => s.warning).length,
      firstDischargeF: hotTemps[0],
      lastDischargeF: hotTemps[hotTemps.length - 1],
      firstToLastDerivedF: hotTemps[hotTemps.length - 1] - hotTemps[0],
    },
    trade: {
      fixedCountRows: fixedCount.length,
      fixedCountStages: coolRows[0].stages,
      holds: tradeHolds,
      coolingFromMMBtuHr: fixedCount[0].totalCoolingMMBtuHr,
      coolingToMMBtuHr: fixedCount[fixedCount.length - 1].totalCoolingMMBtuHr,
      gasHpFrom: fixedCount[0].totalGasHp,
      gasHpTo: fixedCount[fixedCount.length - 1].totalGasHp,
      crossings: crossings.length,
      beforeCrossingCoolingMMBtuHr: firstCrossingIndex > 0 ? coolRows[firstCrossingIndex - 1].totalCoolingMMBtuHr : null,
      atCrossingCoolingMMBtuHr: crossings.length ? crossings[0].totalCoolingMMBtuHr : null,
      beforeCrossingGasHp: firstCrossingIndex > 0 ? coolRows[firstCrossingIndex - 1].totalGasHp : null,
      atCrossingGasHp: crossings.length ? crossings[0].totalGasHp : null,
    },
  };
};

/** SECTION 14: the machine, the driver and the fuel. */
export const machineDriverFuel = () => {
  const train = sokuTrain();
  const fuel = C.driverFuel({
    brakeHp: train.totalBrakeHp, heatRateBtuHpHr: SOKU_HEAT_RATE_BTU_HP_HR, gasLhvBtuScf: SOKU_LHV_BTU_SCF,
  });
  const branchesHit = new Set();
  const machinesHit = new Set();
  const screen = SCREEN_DUTIES.map((d) => {
    const s = C.machineScreen(d);
    // A BRANCH IS A REASON. Keying on `${recommendation}|${reasons[0]}` counted
    // PAIRS and was labelled a count of reasons; the two coincide on this
    // fixture set, so the name was wrong rather than the number. Two branches
    // end on the same recommendation, so the two counts differ and both are
    // reported.
    branchesHit.add(s.reasons[0]);
    machinesHit.add(s.recommendation);
    return {
      label: d.label,
      acfm: s.acfm,
      overallRatio: d.overallRatio,
      totalBrakeHp: d.totalBrakeHp,
      recommendation: s.recommendation,
      reasons: [...s.reasons],
    };
  });
  // THE COMPRESSION CONSTANTS, measured out of the engine rather than typed.
  const mwProbe = C.compressionStage({
    qMMscfd: 1, pSuctionPsia: 100, tSuctionF: 100, ratio: 2, gasSg: 1, k: 1.28,
  });
  const mLbmol = (1e6 / 24 / mwProbe.massLbHr) * G.AIR_MW;
  const mMw = (mwProbe.massLbHr * mLbmol * 24) / 1e6;
  const rProbe = C.compressionStage({
    qMMscfd: 1, pSuctionPsia: 100, tSuctionF: 0, ratio: 2, gasSg: 1, k: 1.28, polytropicEfficiency: 0.75,
  });
  const rE = C.polytropicExponentRatio({ k: 1.28, polytropicEfficiency: 0.75 });
  const mR = (rProbe.headPolyFtLbfLbm * mMw) / (rProbe.zAvg * G.toRankine(0) * (1 / rE) * (2 ** rE - 1));
  const m33000 = (rProbe.massLbHr * rProbe.headPolyFtLbfLbm) / (rProbe.gasHp * 60 * 0.75);
  // Btu per horsepower-hour, twice and independently: once out of the thermal
  // efficiency at a stated heat rate, and once by walking the heat rate down
  // until the engine refuses it, because the first-law refusal boundary IS that
  // constant.
  const fuelProbe = C.driverFuel({ brakeHp: 1, heatRateBtuHpHr: 1e4 });
  const m2544 = (fuelProbe.thermalEfficiencyPct / 100) * 1e4;
  let blo = 1;
  let bhi = 1e5;
  for (let i = 0; i < 200; i += 1) {
    const mid = (blo + bhi) / 2;
    if (mid === blo || mid === bhi) break;
    if (C.driverFuel({ brakeHp: 1, heatRateBtuHpHr: mid }).error) blo = mid; else bhi = mid;
  }
  const acfmProbeState = {
    qMMscfd: 1, pPsia: 300, tF: 140, gasSg: 0.7,
  };
  const acfmZ = C.compressionStage({
    ...acfmProbeState, qMMscfd: 1, pSuctionPsia: acfmProbeState.pPsia, tSuctionF: acfmProbeState.tF, ratio: 2, k: 1.28,
  }).z1;
  const mAcfm = C.actualInletCfm(acfmProbeState);
  const mBaseQuotient = (mAcfm * acfmProbeState.pPsia * 1440) / (1e6 * acfmZ * G.toRankine(acfmProbeState.tF));
  return {
    acfmSweep: ACFM_PRESSURE_SWEEP_PSIA.map((p) => ({
      pPsia: p,
      acfm: C.actualInletCfm({
        qMMscfd: SOKU.qMMscfd, pPsia: p, tF: SOKU.tSuctionF, gasSg: SOKU.gasSg,
      }),
    })),
    atSuctionPsia: SOKU.pSuctionPsia,
    atSuctionAcfm: C.actualInletCfm({
      qMMscfd: SOKU.qMMscfd, pPsia: SOKU.pSuctionPsia, tF: SOKU.tSuctionF, gasSg: SOKU.gasSg,
    }),
    screenCount: SCREEN_DUTIES.length,
    screen,
    distinctFirstReasonsDerived: branchesHit.size,
    distinctRecommendationsDerived: machinesHit.size,
    screenDomain: [
      ['a suction below absolute zero', {
        qMMscfd: 20, pSuctionPsia: 200, tSuctionF: -600, gasSg: 0.65, overallRatio: 3, totalBrakeHp: 500,
      }],
      ['a suction colder than the correlation reaches', {
        qMMscfd: 20, pSuctionPsia: DAK_COLD_PROBE.pSuctionPsia, tSuctionF: DAK_COLD_PROBE.tSuctionF, gasSg: DAK_COLD_PROBE.gasSg, overallRatio: 3, totalBrakeHp: 500,
      }],
      ['a suction above the pressure the correlation reaches', {
        qMMscfd: 20, pSuctionPsia: DAK_HIGH_P_PROBE.pSuctionPsia, tSuctionF: DAK_HIGH_P_PROBE.tSuctionF, gasSg: DAK_HIGH_P_PROBE.gasSg, overallRatio: 3, totalBrakeHp: 500,
      }],
    ].map(([label, d]) => ({ label, error: softOf(C.machineScreen(d)) })),
    heatRateBtuHpHr: SOKU_HEAT_RATE_BTU_HP_HR,
    lhvBtuScf: SOKU_LHV_BTU_SCF,
    fuelBtuHr: fuel.fuelBtuHr,
    fuelMMscfd: fuel.fuelMMscfd,
    thermalEfficiencyPct: fuel.thermalEfficiencyPct,
    throughputMMscfd: SOKU.qMMscfd,
    fuelSharePctDerived: (fuel.fuelMMscfd / SOKU.qMMscfd) * 100,
    heatRates: DRIVER_HEAT_RATE_SWEEP.map((hr) => {
      const f = C.driverFuel({
        brakeHp: train.totalBrakeHp, heatRateBtuHpHr: hr, gasLhvBtuScf: SOKU_LHV_BTU_SCF,
      });
      return {
        heatRateBtuHpHr: hr,
        fuelMMscfd: f.fuelMMscfd,
        thermalEfficiencyPct: f.thermalEfficiencyPct,
        sharePctDerived: (f.fuelMMscfd / SOKU.qMMscfd) * 100,
      };
    }),
    measured: {
      scfPerLbmol: mLbmol,
      airMw: mMw,
      gasConstantFtLbfLbmolR: mR,
      exportedGasConstantTimes144Derived: G.R_UNIVERSAL * 144,
      gasConstantQuotientDerived: mR / (G.R_UNIVERSAL * 144),
      gasConstantDifferenceDerived: mR - G.R_UNIVERSAL * 144,
      ftLbfPerMinutePerHp: m33000,
      heatRateProbe: 1e4,
      btuPerHpHr: m2544,
      btuPerHpHrFromRefusal: bhi,
      btuPerHpHrDifferenceDerived: m2544 - bhi,
      baseQuotientPsiaPerR: mBaseQuotient,
      baseQuotientFromMassRouteDerived: mR / 144 / mLbmol,
      baseQuotientDifferenceDerived: mBaseQuotient - mR / 144 / mLbmol,
      rankineOffset: G.R_OFFSET,
      airMwExported: G.AIR_MW,
    },
  };
};

/** SECTION 15: what a refusal is, and where each guard turns over. */
export const refusalContract = () => {
  const curve = okCurve();
  const ratioOne = C.stageCount({
    pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxRatioPerStage: 1,
  });
  const lowP = C.compressionStage({
    qMMscfd: 20, pSuctionPsia: 12, tSuctionF: 100, ratio: 2, gasSg: 0.65, k: 1.28,
  });
  return {
    pumpProbes: UNGUARDED_PUMP_PROBES.map(([label, fn, inp]) => ({
      label,
      shape: shapeOf(fn === 'combineParallelCount' ? P.combineParallel({ pump: curve, n: inp.n }) : P[fn](inp)),
    })),
    systemNoStatic: shapeOf(P.systemCurve({ frictionHeadFt: 200, atFlowGpm: 1500 })),
    compressionProbes: UNGUARDED_COMPRESSION_PROBES.map(([label, fn, inp]) => ({
      label, shape: shapeOf(C[fn](inp)),
    })),
    bareNumberNames: BARE_NUMBER_PROBES.filter(([, f]) => typeof f() === 'number').map(([nm]) => nm),
    nanContract: NAN_CONTRACT_PROBES.map(([fn, label, f]) => ({ fn, label, returns: f() })),
    fourFaults: FOUR_FAULT_PROBES.map(([label, inp]) => ({ label, error: softOf(C.stageCount(inp)) })),
    ratioOneShape: shapeOf(ratioOne),
    ratioOneThroughTrain: softOf(C.compressorTrain({
      qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, pDischargePsia: 1000, gasSg: 0.65, k: 1.28, maxRatioPerStage: 1,
    })),
    window: [
      ['inside the window, as a control', DAK_IN_WINDOW_PROBE],
      ['below the temperature floor', DAK_COLD_PROBE],
      ['above the pressure limit', DAK_HIGH_P_PROBE],
    ].map(([label, probe]) => {
      const pc = G.suttonPseudoCriticals(probe.gasSg);
      const r = C.compressionStage(probe);
      const ppr = probe.pSuctionPsia / pc.ppcPsia;
      const tpr = G.toRankine(probe.tSuctionF) / pc.tpcR;
      const z = G.dakZ({ ppr, tpr });
      return {
        label,
        pSuctionPsia: probe.pSuctionPsia,
        tSuctionF: probe.tSuctionF,
        ppr,
        tpr,
        refused: r.error !== undefined,
        z1: r.error === undefined ? r.z1 : null,
        solverConverged: z.converged,
        gasHp: r.error === undefined ? r.gasHp : null,
      };
    }),
    windowRefusals: [
      ['below the temperature floor', DAK_COLD_PROBE],
      ['above the pressure limit', DAK_HIGH_P_PROBE],
    ].map(([label, probe]) => {
      const r = C.compressionStage(probe);
      return {
        label, ppr: r.ppr, tpr: r.tpr, atPsia: r.atPsia, atF: r.atF, state: r.state,
      };
    }),
    lowPressureNote: lowP.zNote,
  };
};

/** SECTION 16: the published golden cases, and the engine beside them. */
export const publishedGoldens = () => {
  const powerQuotients = GP.power.map((row) => P.pumpPower(row).brakeHp / row.brakeHp);
  const npshQuotients = GP.npsh.map((row) => P.npshAvailable(row).npshaFt / row.npshaFt);
  const stageInputKeys = new Set(['qMMscfd', 'pSuctionPsia', 'tSuctionF', 'ratio', 'gasSg', 'k', 'polytropicEfficiency', 'mechanicalEfficiency', 'label', 'source']);
  const stageOutputKeys = Object.keys(GC.stages[0]).filter((key) => !stageInputKeys.has(key));
  let stageWorst = 0;
  let stageWorstKey = '';
  const fieldTable = stageOutputKeys.map((key) => {
    let worst = 0;
    let cases = 0;
    GC.stages.forEach((row) => {
      if (typeof row[key] !== 'number') return;
      cases += 1;
      const r = C.compressionStage(row);
      const gap = row[key] === 0 ? Math.abs(r[key]) : Math.abs(r[key] - row[key]) / Math.abs(row[key]);
      if (!(gap <= worst)) worst = gap;
    });
    if (!(worst <= stageWorst)) { stageWorst = worst; stageWorstKey = key; }
    return {
      key, cases, bitForBit: worst === 0, worst,
    };
  });
  const bitForBit = stageOutputKeys.filter((key) => GC.stages.every((row) => typeof row[key] !== 'number' || C.compressionStage(row)[key] === row[key]));
  return {
    pumpCases: GP.curves.length + GP.duty.length + GP.npsh.length + GP.power.length + GP.viscosity.length,
    compressionCases: GC.stages.length + GC.staging.length,
    totalCases: GP.curves.length + GP.duty.length + GP.npsh.length + GP.power.length + GP.viscosity.length + GC.stages.length + GC.staging.length,
    exportedFunctions: Object.keys(P).length + Object.keys(C).length,
    curves: GP.curves.map((row, i) => {
      const f = P.fitPumpCurve({ points: row.points });
      return {
        index: i,
        c0: f.coefficients.c0,
        goldenC0: row.c0,
        c1: f.coefficients.c1,
        goldenC1: row.c1,
        c2: f.coefficients.c2,
        goldenC2: row.c2,
        shutoffHeadFt: f.shutoffHeadFt,
        goldenShutoffHeadFt: row.shutoffHeadFt,
        goldenMaxOrthogonalityResidual: row.maxOrthogonalityResidual,
        conditionNumber: f.conditionNumber,
        rSquared: f.rSquared,
      };
    }),
    duty: GP.duty.map((row, i) => {
      const f = P.fitPumpCurve({ points: row.points });
      const s = P.systemCurve({ staticHeadFt: row.staticHeadFt, frictionHeadFt: row.frictionHeadFt, atFlowGpm: row.atFlowGpm });
      const d = P.dutyPoint({ pump: f, system: s, qMaxGpm: 3000 });
      return {
        index: i,
        staticHeadFt: row.staticHeadFt,
        frictionHeadFt: row.frictionHeadFt,
        atFlowGpm: row.atFlowGpm,
        qGpm: d.qGpm,
        goldenQGpm: row.qGpm,
        headFt: d.headFt,
        goldenHeadFt: row.headFt,
      };
    }),
    powerCount: powerQuotients.length,
    npshCount: npshQuotients.length,
    worstPowerQuotient: powerQuotients.reduce((a, b) => (Math.abs(b - 1) > Math.abs(a - 1) ? b : a)),
    worstNpshQuotient: npshQuotients.reduce((a, b) => (Math.abs(b - 1) > Math.abs(a - 1) ? b : a)),
    worstDisagreementDerived: Math.max(...powerQuotients.concat(npshQuotients).map((q) => Math.abs(q - 1))),
    power: GP.power.map((row, i) => {
      const p = P.pumpPower(row);
      return {
        index: i,
        qGpm: row.qGpm,
        headFt: row.headFt,
        sg: row.sg,
        efficiency: row.efficiency,
        brakeHp: p.brakeHp,
        goldenBrakeHp: row.brakeHp,
        quotientDerived: p.brakeHp / row.brakeHp,
      };
    }),
    npsh: GP.npsh.map((row, i) => {
      const r = P.npshAvailable(row);
      return {
        index: i,
        suctionPressurePsia: row.suctionPressurePsia,
        vapourPressurePsia: row.vapourPressurePsia,
        sg: row.sg,
        npshaFt: r.npshaFt,
        goldenNpshaFt: row.npshaFt,
        quotientDerived: r.npshaFt / row.npshaFt,
      };
    }),
    viscosity: GP.viscosity.map((row, i) => {
      const r = P.viscosityCorrection(row);
      return {
        index: i,
        viscosityCSt: row.viscosityCSt,
        speedRpm: row.speedRpm,
        B: r.B,
        goldenB: row.B,
        cQ: r.cQ,
        goldenCQ: row.cQ,
        cEta: r.cEta,
        goldenCEta: row.cEta,
      };
    }),
    staging: GC.staging.map((row, i) => {
      const s = C.stageCount(row);
      return {
        index: i,
        pSuctionPsia: row.pSuctionPsia,
        pDischargePsia: row.pDischargePsia,
        tSuctionF: row.tSuctionF,
        k: row.k,
        stages: s.stages,
        goldenStages: row.stages,
        governedBy: s.governedBy,
        ratioPerStage: s.ratioPerStage,
      };
    }),
    stages: GC.stages.map((row, i) => {
      const r = C.compressionStage(row);
      return {
        index: i,
        qMMscfd: row.qMMscfd,
        ratio: row.ratio,
        k: row.k,
        polytropicEfficiency: row.polytropicEfficiency,
        headPolyFtLbfLbm: r.headPolyFtLbfLbm,
        goldenHeadPolyFtLbfLbm: row.headPolyFtLbfLbm,
        tDischargeF: r.tDischargeF,
        goldenTDischargeF: row.tDischargeF,
        gasHp: r.gasHp,
        goldenGasHp: row.gasHp,
        zAvg: r.zAvg,
        goldenZAvg: row.zAvg,
      };
    }),
    fieldTable,
    stageFieldCount: stageOutputKeys.length,
    stageCaseCount: GC.stages.length,
    bitForBitCount: bitForBit.length,
    bitForBitKeys: bitForBit,
    notBitForBitCount: stageOutputKeys.length - bitForBit.length,
    stageWorst,
    stageWorstKey,
  };
};

/** SECTION 17: what this course teaches as limits and never as answers. */
export const heldItems = () => ({
  items: HELD_ITEMS.map((h) => ({ ...h })),
  seams: [...SCOPE_SEAMS],
});

// ---------------------------------------------------------------------------
// THE CAPSTONE. ESCRAVOS, BONGA AND BONNY ONLY.
//
// Nothing above this line reads anything below it. The teaching fields and the
// capstone conditions share no curve point, flow, head, pressure, temperature,
// gravity, viscosity, efficiency, ratio, speed or heat rate, the teaching
// digest never names any of these machines, and panelCapstoneGuard.test.js
// greps every panel and the course page to prove no panel reaches in here.
//
// Copied VERBATIM from /root/fc-wip-rotating/fc3_fields_capstone.mjs.
// ---------------------------------------------------------------------------

/** Four points read off the vendor's published curve. */
export const ESCRAVOS_POINTS = [
  { qGpm: 0, headFt: 486 },
  { qGpm: 700, headFt: 452 },
  { qGpm: 1400, headFt: 358 },
  { qGpm: 2000, headFt: 214 },
];

/** The station, stated as a friction head at a flow, which is the form a
 *  hydraulics calculation hands over. */
export const ESCRAVOS_SYSTEM = {
  staticHeadFt: 168,
  frictionHeadFt: 214,
  atFlowGpm: 1250,
};

export const ESCRAVOS_SG = 0.823;
/** The efficiency at duty, agreed with the vendor for this selection. */
export const ESCRAVOS_EFFICIENCY = 0.761;
/** The motor's nameplate efficiency, stated rather than defaulted. */
export const ESCRAVOS_MOTOR_EFFICIENCY = 0.938;

export const BONGA_POINTS = [
  { qGpm: 0, headFt: 212 },
  { qGpm: 450, headFt: 198 },
  { qGpm: 900, headFt: 160 },
  { qGpm: 1300, headFt: 96 },
];

export const BONGA_SYSTEM = {
  staticHeadFt: 44,
  frictionHeadFt: 88,
  atFlowGpm: 800,
};

export const BONGA_SG = 0.79;

/** The suction side as surveyed. The source vessel sits above the pump, so
 *  the static term is positive. */
export const BONGA_SUCTION = {
  suctionPressurePsia: 19.4,
  vapourPressurePsia: 3.7,
  sg: BONGA_SG,
  staticSuctionLiftFt: 11.5,
  suctionFrictionFt: 4.3,
};

/** The proposal on the table: pad the suction drum to this pressure. */
export const BONGA_RAISED_SUCTION_PSIA = 46.0;

/** The variable speed drive's proposed setting, as a fraction of rated. */
export const BONGA_SPEED_RATIO = 0.87;

/** How many identical machines the debottleneck would put in parallel. */
export const BONGA_N_PARALLEL = 2;

/** The search ceiling handed to the duty solve, stated so the answer does
 *  not depend on a default. */
export const BONGA_Q_MAX_GPM = 6000;
export const ESCRAVOS_Q_MAX_GPM = 8000;

export const BONNY = {
  qMMscfd: 34.0,
  pSuctionPsia: 138.0,
  tSuctionF: 96.0,
  pDischargePsia: 1240.0,
  gasSg: 0.673,
  k: 1.272,
  polytropicEfficiency: 0.767,
  mechanicalEfficiency: 0.972,
  maxRatioPerStage: 3.8,
  maxDischargeF: 285.0,
  interstageCoolToF: 96.0,
  cpBtuLbF: 0.552,
};

/** The driver, stated. */
export const BONNY_HEAT_RATE_BTU_HP_HR = 7650;
export const BONNY_LHV_BTU_SCF = 968;

/**
 * The capstone chain, engine call for engine call as fc3_capstone.mjs runs it,
 * with the solve's own report read back rather than trusted: a duty flow off an
 * unconverged bisection is not an answer to grade against.
 */
export const capstoneRuns = () => {
  const escCurve = P.fitPumpCurve({ points: ESCRAVOS_POINTS });
  const escSystem = P.systemCurve(ESCRAVOS_SYSTEM);
  const escDuty = P.dutyPoint({ pump: escCurve, system: escSystem, qMaxGpm: ESCRAVOS_Q_MAX_GPM });
  const escPower = P.pumpPower({
    qGpm: escDuty.qGpm,
    headFt: escDuty.headFt,
    sg: ESCRAVOS_SG,
    efficiency: ESCRAVOS_EFFICIENCY,
    motorEfficiency: ESCRAVOS_MOTOR_EFFICIENCY,
  });
  const escDischargePsi = P.headFtToPsi({ headFt: escDuty.headFt, sg: ESCRAVOS_SG });
  const bonCurve = P.fitPumpCurve({ points: BONGA_POINTS });
  const bonSystem = P.systemCurve(BONGA_SYSTEM);
  const bonDuty = P.dutyPoint({ pump: bonCurve, system: bonSystem, qMaxGpm: BONGA_Q_MAX_GPM });
  const bonNpsh = P.npshAvailable(BONGA_SUCTION);
  const bonNpshRaised = P.npshAvailable({ ...BONGA_SUCTION, suctionPressurePsia: BONGA_RAISED_SUCTION_PSIA });
  const bonSpeed = P.speedChange({
    qGpm: bonDuty.qGpm, headFt: bonDuty.headFt, brakeHp: 1, speedRatio: BONGA_SPEED_RATIO,
  });
  const bonParallel = P.combineParallel({ pump: bonCurve, n: BONGA_N_PARALLEL });
  const bonParallelDuty = P.dutyPoint({ pump: bonParallel, system: bonSystem, qMaxGpm: BONGA_Q_MAX_GPM });
  const bonnyE = C.polytropicExponentRatio({ k: BONNY.k, polytropicEfficiency: BONNY.polytropicEfficiency });
  const bonnyTrain = C.compressorTrain({ ...BONNY });
  const bonnyStage1 = C.compressionStage({
    qMMscfd: BONNY.qMMscfd,
    pSuctionPsia: BONNY.pSuctionPsia,
    tSuctionF: BONNY.tSuctionF,
    ratio: bonnyTrain.ratioPerStage,
    gasSg: BONNY.gasSg,
    k: BONNY.k,
    polytropicEfficiency: BONNY.polytropicEfficiency,
    mechanicalEfficiency: BONNY.mechanicalEfficiency,
  });
  const bonnyFuel = C.driverFuel({
    brakeHp: bonnyTrain.totalBrakeHp,
    heatRateBtuHpHr: BONNY_HEAT_RATE_BTU_HP_HR,
    gasLhvBtuScf: BONNY_LHV_BTU_SCF,
  });
  const { tpcR, ppcPsia } = G.suttonPseudoCriticals(BONNY.gasSg);
  const windowRows = [];
  bonnyTrain.stages.forEach((s) => {
    [[s.pSuctionPsia, s.tSuctionF], [s.pDischargePsia, s.tDischargeF]].forEach(([p, t]) => {
      windowRows.push({
        stage: s.stage, pPsia: p, tF: t, ppr: p / ppcPsia, tpr: G.toRankine(t) / tpcR,
      });
    });
  });
  return {
    escCurve: {
      droops: escCurve.droops, rSquared: escCurve.rSquared, warning: escCurve.warning, shutoffHeadFt: escCurve.shutoffHeadFt,
    },
    escDuty: {
      qGpm: escDuty.qGpm, headFt: escDuty.headFt, converged: escDuty.converged, bracketGpm: escDuty.bracketGpm, residualFt: escDuty.residualFt,
    },
    escPower: {
      hydraulicHp: escPower.hydraulicHp, brakeHp: escPower.brakeHp, motorInputKw: escPower.motorInputKw,
    },
    escDischargePsi,
    bonCurve: { droops: bonCurve.droops, warning: bonCurve.warning },
    bonDuty: { qGpm: bonDuty.qGpm, headFt: bonDuty.headFt, converged: bonDuty.converged },
    bonNpsh: { pressureHeadFt: bonNpsh.pressureHeadFt, npshaFt: bonNpsh.npshaFt, warning: bonNpsh.warning },
    bonNpshRaised: { npshaFt: bonNpshRaised.npshaFt, warning: bonNpshRaised.warning },
    bonSpeed: { qGpm: bonSpeed.qGpm, headFt: bonSpeed.headFt, warning: bonSpeed.warning },
    bonParallelDuty: { qGpm: bonParallelDuty.qGpm, headFt: bonParallelDuty.headFt, converged: bonParallelDuty.converged },
    bonnyE,
    bonnyTrain: {
      stages: bonnyTrain.stages.length,
      governedBy: bonnyTrain.governedBy,
      ratioPerStage: bonnyTrain.ratioPerStage,
      totalBrakeHp: bonnyTrain.totalBrakeHp,
      dischargesF: bonnyTrain.stages.map((s) => s.tDischargeF),
    },
    bonnyStage1: {
      tDischargeF: bonnyStage1.tDischargeF, headPolyFtLbfLbm: bonnyStage1.headPolyFtLbfLbm, gasHp: bonnyStage1.gasHp,
    },
    bonnyFuel: { fuelMMscfd: bonnyFuel.fuelMMscfd },
    windowRows,
  };
};

/** The eighteen graded fields, in the published order, with the tolerances. */
export const capstoneFields = () => {
  const r = capstoneRuns();
  // ONLY THE VALUES ARE HERE. The tier, the quantity class and the tolerance
  // of every field come from gradedTolerance.js, which derives each tolerance
  // as max(stated, half a unit in the last place the digest prints that
  // class). Seven of the eighteen were once tighter than that, so a learner
  // quoting the digest exactly FAILED: 221.7762 degF is 3.98e-5 from the
  // graded value and was graded at 1e-5. This list used to carry a fourth
  // column of hand-kept numbers mirroring the generator's, and a mirror is a
  // copy that goes stale quietly, so it no longer exists.
  const value = {
    escravos_duty_flow_gpm: r.escDuty.qGpm,
    escravos_duty_head_ft: r.escDuty.headFt,
    escravos_hydraulic_hp: r.escPower.hydraulicHp,
    escravos_brake_hp: r.escPower.brakeHp,
    escravos_motor_input_kw: r.escPower.motorInputKw,
    escravos_discharge_psi: r.escDischargePsi,
    bonga_pressure_head_ft: r.bonNpsh.pressureHeadFt,
    bonga_npsha_ft: r.bonNpsh.npshaFt,
    bonga_npsha_raised_ft: r.bonNpshRaised.npshaFt,
    bonga_speed_flow_gpm: r.bonSpeed.qGpm,
    bonga_speed_head_ft: r.bonSpeed.headFt,
    bonga_parallel_flow_gpm: r.bonParallelDuty.qGpm,
    bonny_exponent_ratio: r.bonnyE,
    bonny_ratio_per_stage: r.bonnyTrain.ratioPerStage,
    bonny_stage1_discharge_f: r.bonnyStage1.tDischargeF,
    bonny_stage1_poly_head: r.bonnyStage1.headPolyFtLbfLbm,
    bonny_stage1_gas_hp: r.bonnyStage1.gasHp,
    bonny_fuel_mmscfd: r.bonnyFuel.fuelMMscfd,
  };
  // A value for a field nobody grades, and a graded field with no value, are
  // both refusals rather than a quietly short list.
  Object.keys(value).forEach((k) => gradedClassOf(k));
  return GRADED_FIELDS.map(([tier, key]) => {
    const v = value[key];
    if (!Number.isFinite(v)) {
      throw new Error(`the lab produced no finite value for the graded field ${key}`);
    }
    return [tier, key, v, gradedTolerance(key)];
  });
};

export const capstoneValues = (fieldList) => Object.fromEntries((fieldList || capstoneFields()).map(([, k, v]) => [k, v]));

export const capstoneTolerances = (fieldList) => Object.fromEntries((fieldList || capstoneFields()).map(([, k, , t]) => [k, t]));

/** Every capstone-only export, by name. The panel guard greps for these. */
export const CAPSTONE_ONLY_EXPORTS = [
  'ESCRAVOS_POINTS', 'ESCRAVOS_SYSTEM', 'ESCRAVOS_SG', 'ESCRAVOS_EFFICIENCY',
  'ESCRAVOS_MOTOR_EFFICIENCY', 'ESCRAVOS_Q_MAX_GPM',
  'BONGA_POINTS', 'BONGA_SYSTEM', 'BONGA_SG', 'BONGA_SUCTION',
  'BONGA_RAISED_SUCTION_PSIA', 'BONGA_SPEED_RATIO', 'BONGA_N_PARALLEL', 'BONGA_Q_MAX_GPM',
  'BONNY', 'BONNY_HEAT_RATE_BTU_HP_HR', 'BONNY_LHV_BTU_SCF',
  'capstoneRuns', 'capstoneFields', 'capstoneValues', 'capstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

// ---------------------------------------------------------------------------
// The leak guard machinery, the EC3 course's, unchanged.
// ---------------------------------------------------------------------------

/** How much wider than the grader's own band a teaching number has to stand clear. */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = [
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
];

/**
 * Every forbidden neighbourhood: eighteen answers, three shiftings, ten times
 * the grading band, the band SCALED with the shifting because the grader's
 * tolerance is absolute in the field's own units.
 */
export const leakGuardTargets = (fieldList) => {
  const out = [];
  fieldList.forEach(([tier, key, v, tol]) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const gradingBand = tol * Math.abs(factor);
      out.push({
        tier, key, tag, value: v * factor, gradingBand, band: LEAK_GUARD_MARGIN * gradingBand,
      });
    });
  });
  return out;
};

/** The target a number collides with, or null. Dimension blind: a box takes any number. */
export const leakGuardHit = (v, targets) => {
  if (!Number.isFinite(v)) return null;
  for (const t of targets) {
    if (Math.abs(v - t.value) < t.band) return t;
  }
  return null;
};

/** Every finite number reachable inside a value, with the path it sits at. */
export const collectNumbers = (v, path = '', out = [], depth = 0) => {
  if (depth > 12) return out;
  if (typeof v === 'number') {
    if (Number.isFinite(v)) out.push({ path, value: v });
    return out;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => collectNumbers(x, `${path}[${i}]`, out, depth + 1));
    return out;
  }
  if (v && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => collectNumbers(x, path ? `${path}.${k}` : k, out, depth + 1));
  }
  return out;
};
