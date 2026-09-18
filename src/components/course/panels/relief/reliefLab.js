// Teaching lab for FC5, Relief & Flare Systems. The three panels, the course
// page and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINE'S OWN OUTPUT. Every required area,
// critical ratio, F2, Kv, KN, orifice letter, margin, wetted area, pool fire
// duty, relief load, settling velocity, drag coefficient, drum length, vapour
// velocity, segment fraction, depressuring time, final temperature, radiant
// intensity and setback distance below is a return value of
// engines/facilities/relief.js, as repaired in FC5-0 and vendored sha-identical
// with engines 3bac13cd over a closure of seven paths. The customary allowable
// intensity table of engines/facilities/spacing.js is read for one purpose
// only: to show that two engines in this package export the same four rows.
//
// NOTHING IN THIS FILE COMPUTES A RELIEF QUANTITY. Where a reader carries a
// value the teaching digest calls "derived", it is the digest's own arithmetic
// on numbers the engine returned, with the arithmetic stated and the key named
// Derived: a relieving pressure from a stated set pressure and the MEASURED
// atmospheric constant, a ratio of two engine answers, a spread across a sweep,
// a duty per square foot, a time in minutes, a temperature in degF. The lab and
// tools/course-waves/relief/digest.txt agree because both call the engine on the
// same inputs rather than because either copied the other.
//
// CONSTANTS ARE MEASURED, NEVER TYPED. Where the engine keeps a number to
// itself, the lab asks the engine a question whose answer is that number and
// nothing else, and the reader says which question: the atmospheric constant out
// of the branch flag, out of a subcritical area and out of the march's own
// choked floor; the four leading constants out of one answer each rearranged
// against its own stated inputs; the two pool fire constants out of a duty at a
// unit area; the three Kv fit coefficients out of a three-equation solve on the
// unclamped export; the Napier fit out of three pressures; the universal gas
// constant out of the mass the march reports for its own start state. Every
// threshold is BISECTED out of the engine's behaviour. A constant written as a
// literal here would be a claim about the engine rather than a reading of it.
//
// THE TOLERANCES ARE NOT HERE. gradedTolerance.js is the single derivation and
// this lab imports it. Two sibling waves shipped a hand-kept THIRD copy of the
// eighteen tolerances inside their lab while their tests read fields.json, and
// only the lab test caught it. `gradedToleranceTable()` below is a read of that
// derivation and holds no number of its own.
//
// UNITS. API 520 USC as this engine speaks them. Flow lb/hr for gas and steam
// and gpm for liquid, pressure psia except where a key says Psig, temperature
// degR except where a key says F, area in2, wetted area ft2, duty Btu/hr,
// velocity ft/s, drum length ft, droplet micron, heat release kW, distance m,
// radiant flux kW/m2, blowdown time s, mass lb. Ratios, factors and fractions
// are plain numbers.
//
// FOUR NAMING COLLISIONS, legislated for this course. Bare "relief" means a
// relief WELL in the drilling courses, so this file writes pressure relief or
// relief valve. Bare "safety valve" means the downhole SCSSV, so this file
// writes pressure safety valve. Bare "back pressure" means the MPD choke, so
// this file always qualifies it as the pressure at the relief valve outlet.
// Bare "critical flow" collides with a critical flowing pressure, so this file
// writes critical flow through the valve, or choked.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// belongs anywhere in it.
//
// THE CLOCK. Nothing in this domain reads a clock or a random number. There is
// no date input, no seed and no default that falls back to a current date, so
// every reader is a pure function of its engine inputs. A clock gate in
// reliefLab.test.js proves it under two faked system dates with a control that
// the fake clock moved, and a timezone gate re-runs the whole lab surface and
// the agreement with the digest in a child process west of Greenwich.
//
// REPAIR HISTORY. Digest section 29 is the one framed history section and
// `repairHistory()` is the reader for it. Everything else this lab returns is
// what the engine does NOW. The counting rule for the engine's own history
// comment lines lives here as HISTORY_COMMENT_RE; the walk over the vendored
// source is the test's, because a browser module cannot read a directory.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

import reliefGolden from '@petrolord/engines/test-data/facilities/goldens/relief_cases.json';
// Namespaces rather than named imports: eslint's node resolver follows the node_modules
// symlink to the SHARED checkout's engines, which predate FC1-0 and carry no
// engines/facilities at all. Vite and vitest alias @petrolord/engines to this
// worktree's packages/engines, which does. import/namespace still checks members
// against the shared copy, so it is off for this file only; reliefLab.test.js
// proves every member resolves.
/* eslint-disable import/namespace */
import * as R from '@petrolord/engines/engines/facilities/relief.js';
import * as SPACING from '@petrolord/engines/engines/facilities/spacing.js';
import { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } from './gradedTolerance.js';

export const GOLD = reliefGolden;

/** The published case counts, so a golden that loses a block is caught. */
export const goldenCounts = () => ({
  blowdown: GOLD.blowdown.length,
  dropout: GOLD.dropout.length,
  drum: GOLD.drum.length,
  fire: GOLD.fire.length,
  gas: GOLD.gas.length,
  liquid: GOLD.liquid.length,
  load: GOLD.load.length,
  radiation: GOLD.radiation.length,
  setback: GOLD.setback.length,
  steam: GOLD.steam.length,
  wetted: GOLD.wetted.length,
  blocks: Object.keys(GOLD).length,
  rows: Object.values(GOLD).reduce((a, b) => a + b.length, 0),
});

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from
// tools/course-waves/relief/fc5_fields.mjs, which fc5_dump.mjs imports. The lab
// test compares each declaration with the wave file's own text and fails on any
// drift, so these cannot be edited here alone. Not one number below is an
// answer: every answer is an engine return value.
//
// THE CAPSTONE IS NOT HERE AND NEVER WILL BE. It runs different vessels
// entirely, its conditions live in the wave directory, and panelCapstoneGuard
// asserts that no source in this directory names one of them.
// ---------------------------------------------------------------------------

export const ORUBIRI = {
  wLbHr: 68000, setPsig: 420, overpressurePct: 10, backPsig: 35,
  tF: 185, mw: 20.5, z: 0.87, k: 1.27, kd: 0.975, kb: 1.0, kc: 1.0,
};

export const AKASO = {
  qGpm: 860, setPsig: 310, overpressurePct: 10, backPsig: 40,
  sg: 0.84, muCp: 85, kd: 0.65, kw: 1.0, kc: 1.0,
};

export const TEBIDABA = {
  wLbHr: 94000, setPsig: 1740, overpressurePct: 10,
  kd: 0.975, kb: 1.0, kc: 1.0, ksh: 1.0,
};

export const BENISEDE = {
  orientation: 'horizontal', diameterFt: 12, lengthFt: 45, liquidLevelFt: 4.2,
  adequateDrainage: true, envFactor: 1.0, latentBtuLb: 128,
  setPsig: 275, overpressurePct: 21, tF: 180, mw: 21, z: 0.9, k: 1.22,
};

export const ODIDI = {
  qVaporMMscfd: 44, pPsia: 42, tF: 160, gasSg: 0.68,
  dropletMicron: 400, rhoLLbFt3: 36.5, muVCp: 0.0135,
  diameterFt: 9, liquidFraction: 0.30,
};

export const AFIESERE = {
  volumeFt3: 720, p0Psia: 1240, t0R: 545, pEndPsia: 145,
  mw: 20, k: 1.28, z: 0.88, orificeDIn: 1.25, cd: 0.82,
};

export const ORUBIRI_BACK_RATIOS = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90];
// THE TWO PROBE ROWS EITHER SIDE OF THE CROSSING ARE DERIVED rather than
// listed. HISTORY, and the frame is this heading: the pair that used to be
// typed here, 0.5497 and 0.5498, both sat BELOW the critical ratio 0.551208 and
// both came back critical, so the section that exists to show the crossing
// never showed it.
export const CRITICAL_PROBE_OFFSET = 1e-6;
export const K_SWEEP = [1.05, 1.10, 1.20, 1.30, 1.40, 1.50, 1.60, 1.80];
export const AKASO_MU_SWEEP = [0, 1, 5, 20, 85, 300, 1200, 5000];
export const KV_RE_SWEEP = [10, 30, 92, 300, 900, 3000, 10000, 100000, 196000, 300000, 1e8];
export const KN_P_SWEEP = [1000, 1400, 1500, 1520, 1550, 1580, 1600, 1800, 2000, 2500, 3000, 3200];

export const BISECT = {
  napierThreshold: [1000, 2000],
  napierTop: [3000, 4000],
  napierUnityCrossing: [1500, 2000],
  dragClamp: [1e-4, 10],
  latentWarning: [1, 200],
  kvWarning: [1e-6, 1],
  ldHigh: [0.1, 200],
  ldLow: [0.1, 200],
  backPressureWarning: [0.01, 0.99],
  blowdownLimit: [1, 20000],
};

export const BENISEDE_LEVEL_SWEEP = [0.6, 1.2, 2.4, 4.2, 6.0, 7.8, 9.6, 10.8, 12.0];
export const ENV_SWEEP = [1.0, 0.85, 0.5, 0.3, 0.15];
export const FIRE_EXPONENT_PROBE = { a1: 100, a2: 1000 };
export const ODIDI_DROPLET_SWEEP = [5, 20, 60, 150, 400, 900, 2000, 6000];
export const ODIDI_HOLDUP_SWEEP = [0, 0.10, 0.25, 0.30, 0.50, 0.75, 0.90, 0.99];
export const ODIDI_DIAMETER_SWEEP = [5, 6, 7, 8, 9, 10, 12, 14];
export const AFIESERE_ORIFICE_SWEEP = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0];
export const AFIESERE_STEP_SWEEP = [0.8, 0.4, 0.2, 0.1, 0.05, 0.025, 0.0125];

export const AFIESERE_FLARE = {
  reliefWLbHr: 210000, lhvBtuLb: 19400,
  fractionRadiated: 0.32, transmissivity: 0.92,
  distanceM: 140,
};
export const RADIATION_DISTANCE_SWEEP = [40, 60, 80, 100, 140, 200, 300, 450];

export const PROBES = {
  cAtK: 1.4,
  subcritical: { wLbHr: 10000, p1Psia: 500, p2Psia: 400, tR: 600, mw: 20, z: 1, k: 1.3, kd: 1, kc: 1 },
  liquidBare: { qGpm: 100, p1Psig: 100, p2Psig: 0, sg: 1, kd: 1, kw: 1, kc: 1 },
  steamBare: { wLbHr: 10000, p1Psia: 1000, kd: 1, kb: 1, kc: 1, ksh: 1 },
  fireBare: { wettedFt2: 1, envFactor: 1 },
  settleA: { dropletMicron: 100, rhoLLbFt3: 50, rhoVLbFt3: 0.5, muVCp: 0.01 },
  settleB: { dropletMicron: 200, rhoLLbFt3: 50, rhoVLbFt3: 0.5, muVCp: 0.01 },
  settleC: { dropletMicron: 100, rhoLLbFt3: 50, rhoVLbFt3: 0.5, muVCp: 0.02 },
  liquidRe: { qGpm: 200, p1Psig: 150, p2Psig: 0, sg: 1, muCp: 50, kd: 1, kw: 1, kc: 1 },
  blowdownProbe: {
    volumeFt3: 1000, p0Psia: 900, t0R: 540, pEndPsia: 100,
    mw: 20, k: 1.3, z: 0.9, orificeDIn: 1.0, cd: 1.0, dtS: 0.001,
  },
  atmProbeGiven: { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3 },
  atmProbeOmitted: { wLbHr: 10000, p1Psia: 500, tR: 600, mw: 20, z: 1, k: 1.3 },
  pointSource: { qKw: 1000, distanceM: 10, fractionRadiated: 1, transmissivity: 1 },
};

export const REFUSALS = [
  ['selectOrifice', 'a required area of zero', 0],
  ['selectOrifice', 'a required area past the largest standard orifice', 30],
  ['selectOrifice', 'a required area that is not a number', Infinity],
  ['gasVaporArea', 'a relief load of zero', { wLbHr: 0, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3 }],
  ['gasVaporArea', 'an isentropic exponent of one', { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.0 }],
  ['gasVaporArea', 'a back pressure at the relieving pressure', { wLbHr: 10000, p1Psia: 500, p2Psia: 500, tR: 600, mw: 20, z: 1, k: 1.3 }],
  ['gasVaporArea', 'a negative back pressure', { wLbHr: 10000, p1Psia: 500, p2Psia: -5, tR: 600, mw: 20, z: 1, k: 1.3 }],
  ['gasVaporArea', 'a certified discharge coefficient of zero', { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3, kd: 0 }],
  ['gasVaporArea', 'a certified discharge coefficient above one', { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3, kd: 2 }],
  ['gasVaporArea', 'a back-pressure correction above one', { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3, kb: 1.4 }],
  ['liquidArea', 'a rate of zero', { qGpm: 0, p1Psig: 200, p2Psig: 0, sg: 0.9 }],
  ['liquidArea', 'a negative viscosity', { qGpm: 500, p1Psig: 200, p2Psig: 0, sg: 0.9, muCp: -400 }],
  ['liquidArea', 'a back pressure at the set pressure', { qGpm: 500, p1Psig: 200, p2Psig: 200, sg: 0.9 }],
  ['liquidArea', 'a liquid back-pressure correction above one', { qGpm: 500, p1Psig: 200, p2Psig: 0, sg: 0.9, kw: 1.2 }],
  ['steamArea', 'a flow of zero', { wLbHr: 0, p1Psia: 500 }],
  ['steamArea', 'a superheat factor of zero', { wLbHr: 60000, p1Psia: 500, ksh: 0 }],
  ['steamArea', 'a pressure past the published Napier range', { wLbHr: 60000, p1Psia: 3400 }],
  ['wettedAreaFt2', 'a diameter of zero', { orientation: 'horizontal', diameterFt: 0, lengthFt: 40, liquidLevelFt: 5 }],
  ['wettedAreaFt2', 'a missing liquid level', { orientation: 'horizontal', diameterFt: 10, lengthFt: 40 }],
  ['wettedAreaFt2', 'a negative liquid level', { orientation: 'vertical', diameterFt: 10, lengthFt: 40, liquidLevelFt: -3 }],
  ['wettedAreaFt2', 'an orientation the engine does not recognise', { orientation: 'slanted', diameterFt: 10, lengthFt: 40, liquidLevelFt: 5 }],
  ['fireHeatInput', 'a wetted area of zero', { wettedFt2: 0 }],
  ['fireHeatInput', 'a drainage answer given as a string', { wettedFt2: 600, adequateDrainage: 'false' }],
  ['fireHeatInput', 'an environment factor of zero', { wettedFt2: 600, envFactor: 0 }],
  ['fireReliefLoad', 'a latent heat of zero', { qBtuHr: 4e6, latentBtuLb: 0 }],
  ['dropoutVelocityFtS', 'a vapour denser than the liquid', { dropletMicron: 300, rhoLLbFt3: 0.5, rhoVLbFt3: 31.2, muVCp: 0.012 }],
  ['dropoutVelocityFtS', 'a vapour viscosity of zero', { dropletMicron: 300, rhoLLbFt3: 31.2, rhoVLbFt3: 0.5, muVCp: 0 }],
  ['koDrumHorizontal', 'a diameter of zero', { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 0 }],
  ['koDrumHorizontal', 'a liquid level fraction at one', { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 8, liquidFraction: 1 }],
  ['koDrumHorizontal', 'a negative liquid level fraction', { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 8, liquidFraction: -0.5 }],
  ['koDrumHorizontal', 'a liquid level fraction given as null', { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 8, liquidFraction: null }],
  ['radiationIntensity', 'a distance of zero', { qKw: 50000, distanceM: 0 }],
  ['radiationIntensity', 'a radiated fraction above one', { qKw: 50000, distanceM: 100, fractionRadiated: 1.5 }],
  ['radiationIntensity', 'a transmissivity above one', { qKw: 50000, distanceM: 100, transmissivity: 2 }],
  ['distanceForIntensity', 'an allowable intensity of zero', { qKw: 50000, allowableKwM2: 0 }],
  ['distanceForIntensity', 'a radiated fraction of zero', { qKw: 50000, allowableKwM2: 4.73, fractionRadiated: 0 }],
  ['distanceForIntensity', 'a negative transmissivity', { qKw: 50000, allowableKwM2: 4.73, transmissivity: -1 }],
  ['blowdown', 'an end pressure above the start pressure', { volumeFt3: 500, p0Psia: 200, t0R: 560, pEndPsia: 900, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1 }],
  ['blowdown', 'a negative discharge coefficient', { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1, cd: -0.85 }],
  ['blowdown', 'a time step of zero', { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1, dtS: 0 }],
  ['blowdown', 'a negative time step', { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1, dtS: -1 }],
  ['blowdown', 'an orifice too small to finish inside the time limit', { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 0.02 }],
];

export const ZERO_TIME_CASES = [
  { volumeFt3: 5, p0Psia: 1014.7, t0R: 560, pEndPsia: 114.7, mw: 19, k: 1.3, z: 0.9, orificeDIn: 4 },
  { volumeFt3: 100, p0Psia: 1014.7, t0R: 560, pEndPsia: 114.7, mw: 19, k: 1.3, z: 0.9, orificeDIn: 17 },
  { volumeFt3: 500, p0Psia: 1014.7, t0R: 560, pEndPsia: 114.7, mw: 19, k: 1.3, z: 0.9, orificeDIn: 38 },
];

export const CONVENTION_PROBE = { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 8 };
export const CONVENTION_LEVELS = [0.1, 0.25, 0.5, 0.75, 0.9];

export const BARE_NUMBER_EXPORTS = [
  'gasConstantC', 'criticalPressureRatio', 'subcriticalF2',
  'liquidKvUnclamped', 'liquidKv', 'steamKn', 'segmentAreaFraction',
];
export const DATA_EXPORTS = ['API_ORIFICES', 'RADIATION_LEVELS'];
export const CONSTANT_EXPORTS = ['NAPIER_UNITY_PSIA'];

/** The end pressures the cold end is walked to, digest section 22. */
export const AFIESERE_END_PRESSURES = [600, 400, 250, 145, 80, 40, 25];

/** The latent heats the near-critical warning is walked through, section 14. */
export const LATENT_SWEEP = [300, 200, 150, 128, 100, 60, 49, 30];

/** The wetted areas the pool fire exponent is read off, section 14. */
export const FIRE_AREA_SWEEP = [50, 100, 250, 500, 1000, 2500, 5000];

/** The segment depth fractions, section 18. */
export const SEGMENT_FRACTIONS = [0, 0.10, 0.25, 0.50, 0.75, 0.90, 0.99];

/** The required areas the API 526 selection is walked across and ON, section 10. */
/** The factor the letter-change bracket is grown by until the letter changes. */
export const LETTER_FLIP_STEP = 1.05;

export const ORIFICE_SELECTION_PROBES = [
  [0.05, ''], [0.11, 'exactly a listed area'], [0.110001, ''],
  // 0.503001 rather than a second 0.503: the digest prints six decimals, so a
  // probe a ten-millionth above the boundary printed as 0.503000 and the table
  // carried two rows reading the same stated area and returning G and H.
  [0.5, ''], [0.503, 'exactly a listed area'], [0.503001, ''],
  [1.287, 'exactly a listed area'], [2.0, ''],
  [6.38, 'exactly a listed area'], [11.05, 'exactly a listed area'],
  [16.0, 'exactly a listed area'], [25.999999, ''], [26.0, 'exactly a listed area'],
];

/** The required areas past the largest standard orifice, section 10. */
export const ORIFICE_PAST_LARGEST = [26.000001, 26.0001, 40, 79, 105];

/** The overpressure allowances walked on ORUBIRI, section 3. */
export const OVERPRESSURE_SWEEP = [10, 16, 21, 25];

/** The Kb values walked on both branches, section 4. */
export const KB_SWEEP = [1.0, 0.72];

/** The radiated fraction and transmissivity pairs, section 25. */
export const RADIATION_FACTOR_PAIRS = [
  [0.15, 1.0], [0.20, 0.92], [0.30, 0.92], [0.32, 0.92], [0.32, 1.0], [0.45, 0.80],
];

/** The superheat factor TEBIDABA is read a second time at, section 8. */
export const TEBIDABA_SUPERHEAT_KSH = 0.83;

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a relief quantity.
// ---------------------------------------------------------------------------

/** A state the method has no answer for, returned rather than thrown. */
const softOf = (r) => (r && r.error ? r.error : null);

/** One bisection routine, used everywhere a threshold is MEASURED. */
export const bisect = (lo, hi, pred) => {
  let a = lo;
  let b = hi;
  if (pred(a) === pred(b)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pred(a)) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-14) break;
  }
  return (a + b) / 2;
};

/**
 * Solve a 3 by 3 linear system by Gaussian elimination with partial pivoting.
 * It recovers a published FIT from the engine's own answers at three inputs. An
 * asymptotic reading is not good enough for either fit here: at a
 * Reynolds number of 1e18 the inverse-root term of the Kv fit is still 2.9e-9,
 * and subtracting an intercept carrying that residue puts the next coefficient
 * out by more than one percent. Three exact equations recover all three at once.
 */
export const solve3 = (rows) => {
  const m = rows.map((r) => [...r]);
  for (let c = 0; c < 3; c += 1) {
    let pv = c;
    for (let r = c + 1; r < 3; r += 1) if (Math.abs(m[r][c]) > Math.abs(m[pv][c])) pv = r;
    [m[c], m[pv]] = [m[pv], m[c]];
    for (let r = 0; r < 3; r += 1) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      for (let cc = c; cc < 4; cc += 1) m[r][cc] -= f * m[c][cc];
    }
  }
  return [m[0][3] / m[0][0], m[1][3] / m[1][1], m[2][3] / m[2][2]];
};

/** The relative difference the digest prints beside a published case. */
const relDiff = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);

// ---------------------------------------------------------------------------
// THE MEASURED CONSTANTS. Every figure here is recovered by asking the engine a
// question whose answer is that constant and nothing else.
// ---------------------------------------------------------------------------

/**
 * The atmospheric outlet pressure the gas route defaults to, measured THREE
 * ways. In critical flow through the valve the area does not depend on the
 * pressure at the valve outlet at all, so the default cannot be recovered from
 * an area there. It comes out of the BRANCH FLAG instead: with the outlet
 * pressure omitted the engine goes choked exactly when the default falls to or
 * below the critical ratio times the relieving pressure, so the relieving
 * pressure at which the flag turns over, times the engine's own critical ratio,
 * IS the default.
 */
const atmFromBranchFlag = () => {
  const base = { wLbHr: 10000, tR: 600, mw: 20, z: 1, k: 1.3 };
  const flip = bisect(5, 200, (p1) => R.gasVaporArea({ ...base, p1Psia: p1 }).critical === true);
  return flip * R.criticalPressureRatio(base.k);
};

/** The same number in the SUBCRITICAL branch, where the area does move with it. */
const atmFromSubcriticalArea = () => {
  const base = { wLbHr: 10000, p1Psia: 25, tR: 600, mw: 20, z: 1, k: 1.3 };
  const omitted = R.gasVaporArea(base);
  return bisect(13.7, 24.9, (p2) => R.gasVaporArea({ ...base, p2Psia: p2 }).areaIn2 <= omitted.areaIn2);
};

/** And a third, from a different function: the march's own choked floor. */
const atmFromMarchFloor = () => {
  const b = { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1 };
  return R.blowdown(b).chokedToPsia * R.criticalPressureRatio(b.k);
};

const ATM = () => atmFromBranchFlag();

/**
 * The relieving pressure: the stated set pressure raised by the stated
 * overpressure allowance and converted to absolute with the MEASURED
 * atmospheric constant. Derived arithmetic on a stated input and a measured
 * engine constant, which is why the key that carries it says Derived.
 */
export const relievingPsia = (setPsig, pct) => setPsig * (1 + pct / 100) + ATM();

/** The universal gas constant the march stands on, out of its own start mass. */
const rGasUniversal = () => {
  const b = PROBES.blowdownProbe;
  const run = R.blowdown(b);
  return (b.p0Psia * 144 * b.volumeFt3 * b.mw) / (b.z * b.t0R * run.initialMassLb);
};

/**
 * The closed-form integral of the SAME mass balance the march evaluates. With z
 * held constant and the flow choked throughout, dm/dt is proportional to m
 * raised to (k+1)/2, which is separable, so the time between two masses is
 * exact. Built from the engine's own C, the MEASURED gas constant and the
 * stated geometry: a coefficient applied twice anywhere inside the march shows
 * here as a ratio away from one.
 */
export const closedFormTimeS = (b, run) => {
  const c = R.gasConstantC(b.k);
  const rSpec = rGasUniversal() / b.mw;
  const a144 = (b.cd ?? 0.85) * (Math.PI / 4) * (b.orificeDIn / 12) ** 2 * 144;
  const m0 = run.initialMassLb;
  const K = (c * a144 * Math.sqrt(b.mw / b.z) * b.z * rSpec * Math.sqrt(b.t0R))
    / (3600 * 144 * b.volumeFt3 * m0 ** ((b.k - 1) / 2));
  const ex = (b.k - 1) / 2;
  return (2 / ((b.k - 1) * K)) * (run.massRemainingLb ** -ex - m0 ** -ex);
};

/** The ODIDI vapour density, derived from the stated gravity. */
const odidiRhoV = () => (28.9625 * ODIDI.gasSg * ODIDI.pPsia) / (10.7316 * (ODIDI.tF + 459.67));

/** The ODIDI actual vapour rate, derived from the stated MMscfd. */
const odidiAcfs = () => (ODIDI.qVaporMMscfd * 1e6 / 86400)
  * (14.696 / ODIDI.pPsia) * ((ODIDI.tF + 459.67) / 519.67);

/** The heat release the flare radiates, derived from the two stated figures. */
const flareKw = () => AFIESERE_FLARE.reliefWLbHr * AFIESERE_FLARE.lhvBtuLb * 0.29307107e-3;

// ---------------------------------------------------------------------------
// SECTION 1. What this engine sizes, and what it refuses.
// ---------------------------------------------------------------------------

/** The typeof of one export, MEASURED rather than declared. */
const typeOfExport = (name) => {
  const v = R[name];
  if (Array.isArray(v)) return 'array';
  return typeof v;
};

/** Digest section 1. The export contract, measured with typeof. */
export const engineScope = () => {
  const names = Object.keys(R).sort();
  const rows = [
    ...BARE_NUMBER_EXPORTS.map((name) => ({
      name, typeOf: typeOfExport(name), returns: 'a bare number, and NaN where it refuses',
    })),
    ...CONSTANT_EXPORTS.map((name) => ({
      name, typeOf: typeOfExport(name), returns: 'a derived constant',
    })),
    ...DATA_EXPORTS.map((name) => ({
      name, typeOf: typeOfExport(name), returns: 'a published table',
    })),
    ...names
      .filter((n) => !BARE_NUMBER_EXPORTS.includes(n) && !CONSTANT_EXPORTS.includes(n) && !DATA_EXPORTS.includes(n))
      .map((name) => ({
        name, typeOf: typeOfExport(name), returns: 'an object, carrying either a result or an `error`',
      })),
  ];
  return {
    exportNames: names,
    exportCount: names.length,
    rows,
    bareNumberCount: BARE_NUMBER_EXPORTS.length,
    objectCount: rows.filter((r) => r.returns.startsWith('an object')).length,
    tableCount: DATA_EXPORTS.length,
    constantCount: CONSTANT_EXPORTS.length,
    napierUnityPsia: R.NAPIER_UNITY_PSIA,
    orificeRowCount: R.API_ORIFICES.length,
    radiationRowCount: R.RADIATION_LEVELS.length,
  };
};

// ---------------------------------------------------------------------------
// SECTION 2. Every constant MEASURED, and every threshold BISECTED.
// ---------------------------------------------------------------------------

/** Digest section 2. The numbers this module stands on. */
export const moduleConstants = () => {
  const kp = PROBES.cAtK;
  const cBracket = Math.sqrt(kp * (2 / (kp + 1)) ** ((kp + 1) / (kp - 1)));

  const sub = PROBES.subcritical;
  const subRun = R.gasVaporArea(sub);
  const subF2 = R.subcriticalF2({ k: sub.k, r: sub.p2Psia / sub.p1Psia });
  const c735 = (sub.wLbHr / (subRun.areaIn2 * subF2))
    * Math.sqrt((sub.tR * sub.z) / (sub.mw * sub.p1Psia * (sub.p1Psia - sub.p2Psia)));

  const lb = PROBES.liquidBare;
  const lbRun = R.liquidArea(lb);
  const c38 = (lb.qGpm * Math.sqrt(lb.sg)) / (lbRun.areaIn2 * Math.sqrt(lb.p1Psig - lb.p2Psig));

  const sb = PROBES.steamBare;
  const sbRun = R.steamArea(sb);
  const c515 = sb.wLbHr / (sbRun.areaIn2 * sb.p1Psia);

  const drained = R.fireHeatInput({ ...PROBES.fireBare, adequateDrainage: true });
  const undrained = R.fireHeatInput({ ...PROBES.fireBare, adequateDrainage: false });
  const { a1, a2 } = FIRE_EXPONENT_PROBE;
  const fireExponent = Math.log(R.fireHeatInput({ wettedFt2: a2 }).qBtuHr
    / R.fireHeatInput({ wettedFt2: a1 }).qBtuHr) / Math.log(a2 / a1);

  // 1/Kv is a + b Re^-0.5 + c Re^-1.5, so three readings of the UNCLAMPED
  // export solve for all three coefficients exactly. All three Reynolds numbers
  // sit below the clamp, so the raw fit is what is being read.
  const [kvA, kvB, kvC] = solve3([4, 100, 1e4]
    .map((re) => [1, re ** -0.5, re ** -1.5, 1 / R.liquidKvUnclamped(re)]));
  const kvAsymptote = R.liquidKvUnclamped(1e18);
  const kvClampRe = bisect(1e3, 1e7, (re) => R.liquidKvUnclamped(re) < 1);

  // KN is a ratio of two lines in the pressure, and a ratio of lines is
  // unchanged when all four of its coefficients are scaled together. So only
  // THREE of the four are measurable: the denominator slope is normalised to
  // one and the three that remain are what can honestly be recovered.
  const [napierA, napierB, napierD] = solve3([1700, 2100, 2600].map((p) => {
    const kn = R.steamKn(p);
    return [p, 1, -kn, kn * p];
  }));

  const c2800 = (() => {
    const o = PROBES.liquidRe;
    const r = R.liquidArea(o);
    return (r.reynolds * o.muCp * Math.sqrt(r.areaIn2)) / (o.qGpm * o.sg);
  })();

  const fourPi = (() => {
    const p = PROBES.pointSource;
    return (p.transmissivity * p.fractionRadiated * p.qKw)
      / (R.radiationIntensity(p).kWm2 * p.distanceM ** 2);
  })();

  const settleGroup = (o) => {
    const r = R.dropoutVelocityFtS(o);
    return (r.udFtS ** 2 * r.dragC * o.rhoVLbFt3) / ((o.rhoLLbFt3 - o.rhoVLbFt3) * o.dropletMicron);
  };
  const groupA = settleGroup(PROBES.settleA);
  const groupB = settleGroup(PROBES.settleB);
  const groupC = settleGroup(PROBES.settleC);

  const knThreshold = bisect(...BISECT.napierThreshold, (p) => R.steamKn(p) === 1);
  const knTop = bisect(...BISECT.napierTop, (p) => !Number.isNaN(R.steamKn(p)));
  // The crossing back through unity. The bracket may NOT start ON the
  // threshold: KN is exactly 1.0 there, so the predicate is false at both ends
  // and there is nothing to bracket. It starts just inside the band.
  const knUnityCrossing = bisect(knThreshold + 1e-6, BISECT.napierUnityCrossing[1], (p) => R.steamKn(p) < 1);

  const latentWarn = bisect(...BISECT.latentWarning,
    (lat) => R.fireReliefLoad({ qBtuHr: 1e7, latentBtuLb: lat }).warning === null);

  const kvWarn = (() => {
    const base = { qGpm: 500, p1Psig: 250, p2Psig: 50, sg: 0.9 };
    const mu = bisect(1, 1e9, (m2) => R.liquidArea({ ...base, muCp: m2 }).warning === null);
    return R.liquidArea({ ...base, muCp: mu }).kv;
  })();

  const backPressureWarnRatio = (() => {
    const base = { wLbHr: 10000, p1Psia: 500, tR: 600, mw: 20, z: 0.9, k: 1.3 };
    const p2 = bisect(1, R.criticalPressureRatio(1.3) * 500 - 1e-9,
      (x) => R.gasVaporArea({ ...base, p2Psia: x }).warning === null);
    return p2 / 500;
  })();

  // The low-Reynolds drag cap: the vapour viscosity at which the returned drag
  // coefficient stops moving, and the Reynolds number the engine reports there.
  // The cap itself is read well INSIDE the capped region, so the figure is the
  // cap rather than the cap plus whatever the fit still contributes at the edge.
  const drag = (() => {
    const f = (mu) => R.dropoutVelocityFtS({ dropletMicron: 50, rhoLLbFt3: 50, rhoVLbFt3: 0.5, muVCp: mu });
    const muAt = bisect(0.001, 1e7, (mu) => f(mu).dragC < 239.999999999);
    return { cap: f(muAt * 100).dragC, reynolds: f(muAt * 0.9999999).reynolds };
  })();

  // Both edges of the drum's note band. BOTH ends of any diameter range carry a
  // note, one saying go wider and the other saying go smaller, so bisecting for
  // the ABSENCE of a note brackets nothing. Each edge is bisected on the note
  // that is actually changing there.
  const ldNote = (() => {
    const base = { qVaporAcfs: 120, udFtS: 1.73, liquidFraction: 0.25 };
    const at = (d) => R.koDrumHorizontal({ ...base, diameterFt: d });
    // THE TWO NOTES ARE READ OUT OF THE ENGINE, never typed. A one foot drum on
    // this duty is far past the upper edge and a forty foot one is far below the
    // lower, so each end hands back the note that is changing there, and the
    // bisection compares against the engine's own string.
    const goWiderNote = at(1).note;
    const smallerNote = at(40).note;
    const hi = bisect(1, 40, (d) => at(d).note === goWiderNote);
    const lo = bisect(1, 40, (d) => at(d).note === smallerNote);
    return { hiLd: at(hi).ld, loLd: at(lo).ld, goWiderNote, smallerNote };
  })();

  // The default time limit, measured from BELOW rather than by walking maxS: a
  // march with a tiny orifice and the default step runs into the step budget
  // instead. With a coarse step the step count stays small, so the orifice at
  // which the march just refuses can be bisected cheaply, and the time the last
  // SUCCEEDING march returns approaches the limit from below.
  const blowdownLimitS = (() => {
    const b = {
      volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, dtS: 2,
    };
    const d = bisect(0.02, 1, (x) => !R.blowdown({ ...b, orificeDIn: x }).error);
    const lo = R.blowdown({ ...b, orificeDIn: d * (1 + 1e-9) });
    return lo.error ? NaN : lo.timeS;
  })();

  return {
    atmFromBranchFlagPsia: atmFromBranchFlag(),
    atmFromSubcriticalAreaPsia: atmFromSubcriticalArea(),
    atmFromMarchFloorPsia: atmFromMarchFloor(),
    gasLeadingConstant: R.gasConstantC(kp) / cBracket,
    subcriticalLeadingConstant: c735,
    liquidLeadingConstant: c38,
    steamLeadingConstant: c515,
    fireConstantDrainedBtuHr: drained.qBtuHr,
    fireConstantUndrainedBtuHr: undrained.qBtuHr,
    drainageFactorDerived: undrained.qBtuHr / drained.qBtuHr,
    fireExponent,
    kvFitIntercept: kvA,
    kvFitInverseRootTerm: kvB,
    kvFitInverseThreeHalvesTerm: kvC,
    kvAsymptote,
    kvClampReynolds: kvClampRe,
    napierNumeratorSlopeRatio: napierA,
    napierNumeratorInterceptRatio: napierB,
    napierDenominatorInterceptRatio: napierD,
    liquidReynoldsConstant: c2800,
    universalGasConstant: rGasUniversal(),
    solidAngle: fourPi,
    settleGroupAt100Micron: groupA,
    settleGroupAt200Micron: groupB,
    settleGroupAtDoubleViscosity: groupC,
    settleCoefficientSquaredTimesFootPerMicron: groupA / (32.174 * 3.2808398950131233e-6),
    edges: {
      napierThresholdPsia: knThreshold,
      napierUnityCrossingPsia: knUnityCrossing,
      napierUnityExportedPsia: R.NAPIER_UNITY_PSIA,
      napierTopPsia: knTop,
      backPressureWarnRatio,
      kvWarnValue: kvWarn,
      latentWarnBtuLb: latentWarn,
      dragCap: drag.cap,
      dragCapReynolds: drag.reynolds,
      ldGoWider: ldNote.hiLd,
      ldSmallerDrum: ldNote.loLd,
      goWiderNote: ldNote.goWiderNote,
      smallerDrumNote: ldNote.smallerDrumNote === undefined ? ldNote.smallerNote : ldNote.smallerDrumNote,
      blowdownTimeLimitS: blowdownLimitS,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. Set, overpressure, relieving, and three things called back
// pressure.
// ---------------------------------------------------------------------------

/** Digest section 3. The pressures a pressure relief calculation stands on. */
export const pressureLadder = () => {
  const p1 = relievingPsia(ORUBIRI.setPsig, ORUBIRI.overpressurePct);
  const p2 = ORUBIRI.backPsig + ATM();
  const base = {
    wLbHr: ORUBIRI.wLbHr, tR: ORUBIRI.tF + 459.67, mw: ORUBIRI.mw,
    z: ORUBIRI.z, k: ORUBIRI.k, kd: ORUBIRI.kd, kb: ORUBIRI.kb, kc: ORUBIRI.kc,
  };
  return {
    setPsig: ORUBIRI.setPsig,
    overpressurePct: ORUBIRI.overpressurePct,
    atmMeasuredPsia: ATM(),
    relievingPsiaDerived: p1,
    outletBackPsig: ORUBIRI.backPsig,
    outletBackPsia: p2,
    backRatioDerived: p2 / p1,
    overpressureRows: OVERPRESSURE_SWEEP.map((pct) => {
      const at = relievingPsia(ORUBIRI.setPsig, pct);
      const r = R.gasVaporArea({ ...base, p1Psia: at, p2Psia: p2 });
      return {
        overpressurePct: pct, relievingPsia: at, areaIn2: r.areaIn2, critical: r.critical,
      };
    }),
    // THE LIQUID ROUTE WORKS ON A DIFFERENCE OF GAUGE PRESSURES, so the measured
    // atmospheric constant never enters it. The figure the digest reads is the
    // RELIEVING pressure in psig, which is the stated set pressure raised by the
    // stated allowance and nothing else.
    liquidRelievingPsig: AKASO.setPsig * (1 + AKASO.overpressurePct / 100),
    liquidBackPsig: AKASO.backPsig,
    liquidDifferentialPsi: AKASO.setPsig * (1 + AKASO.overpressurePct / 100) - AKASO.backPsig,
  };
};

// ---------------------------------------------------------------------------
// SECTION 4. Gas and vapour, and the branch the pressure at the valve outlet
// decides.
// ---------------------------------------------------------------------------

/** Digest section 4. */
export const gasBranch = () => {
  const p1 = relievingPsia(ORUBIRI.setPsig, ORUBIRI.overpressurePct);
  const call = {
    wLbHr: ORUBIRI.wLbHr, p1Psia: p1, p2Psia: ORUBIRI.backPsig + ATM(), tR: ORUBIRI.tF + 459.67,
    mw: ORUBIRI.mw, z: ORUBIRI.z, k: ORUBIRI.k, kd: ORUBIRI.kd, kb: ORUBIRI.kb, kc: ORUBIRI.kc,
  };
  const run = R.gasVaporArea(call);
  const orifice = R.selectOrifice(run.areaIn2);
  return {
    kRows: K_SWEEP.map((k) => ({
      k,
      c: R.gasConstantC(k),
      criticalRatio: R.criticalPressureRatio(k),
      f2AtPointEight: R.subcriticalF2({ k, r: 0.8 }),
    })),
    criticalRatio: R.criticalPressureRatio(ORUBIRI.k),
    branchRows: [
      ...ORUBIRI_BACK_RATIOS,
      R.criticalPressureRatio(ORUBIRI.k) - CRITICAL_PROBE_OFFSET,
      R.criticalPressureRatio(ORUBIRI.k) + CRITICAL_PROBE_OFFSET,
    ].sort((a, b) => a - b).map((ratio) => {
      const r = R.gasVaporArea({ ...call, p2Psia: ratio * p1 });
      return {
        backRatio: ratio,
        critical: r.critical,
        areaIn2: r.areaIn2,
        f2: r.critical ? null : R.subcriticalF2({ k: ORUBIRI.k, r: ratio }),
        warned: r.warning !== null,
        warning: r.warning,
      };
    }),
    kbRows: [0.20, 0.80].flatMap((ratio) => KB_SWEEP.map((kb) => {
      const r = R.gasVaporArea({ ...call, p2Psia: ratio * p1, kb });
      return {
        critical: r.critical, backRatio: ratio, kb, areaIn2: r.areaIn2, warning: r.warning,
      };
    })),
    stream: {
      wLbHr: ORUBIRI.wLbHr,
      setPsig: ORUBIRI.setPsig,
      overpressurePct: ORUBIRI.overpressurePct,
      relievingPsiaDerived: p1,
      outletBackPsia: call.p2Psia,
      backRatioDerived: call.p2Psia / p1,
      critical: run.critical,
      criticalRatio: run.criticalRatio,
      areaIn2: run.areaIn2,
      orifice: orifice.orifice,
      orificeAreaIn2: orifice.areaIn2,
      margin: orifice.margin,
      warning: run.warning,
    },
  };
};

/**
 * The engine's OWN default certified coefficients, measured rather than typed.
 * The gas area is inversely proportional to the product Kd Kb Kc, so the area
 * at unit coefficients divided by the area with one of the three omitted is
 * exactly that one's default.
 */
const GAS_DEFAULTS = () => {
  const unit = {
    wLbHr: ORUBIRI.wLbHr,
    p1Psia: relievingPsia(ORUBIRI.setPsig, ORUBIRI.overpressurePct),
    p2Psia: ORUBIRI.backPsig + ATM(),
    tR: ORUBIRI.tF + 459.67,
    mw: ORUBIRI.mw,
    z: ORUBIRI.z,
    k: ORUBIRI.k,
    kd: 1,
    kb: 1,
    kc: 1,
  };
  const a1 = R.gasVaporArea(unit).areaIn2;
  const without = (drop) => {
    const c = { ...unit };
    delete c[drop];
    return R.gasVaporArea(c).areaIn2;
  };
  return { kd: a1 / without('kd'), kb: a1 / without('kb'), kc: a1 / without('kc') };
};

/** The published gas rows carrying a coefficient away from those defaults. */
const awayFromGasDefaults = () => {
  const d = GAS_DEFAULTS();
  return GOLD.gas.filter((g) => g.kd !== d.kd || g.kb !== d.kb || g.kc !== d.kc);
};

/** Digest section 5. The published gas cases, re-run. */
export const gasPublished = () => ({
  rows: GOLD.gas.map((g) => {
    const r = R.gasVaporArea({
      wLbHr: g.wLbHr, p1Psia: g.p1Psia, p2Psia: g.p2Psia, tR: g.tR,
      mw: g.mw, z: g.z, k: g.k, kd: g.kd, kb: g.kb, kc: g.kc,
    });
    return {
      ...g, engineAreaIn2: r.areaIn2, engineCritical: r.critical, relDiff: relDiff(r.areaIn2, g.areaIn2),
    };
  }),
  count: GOLD.gas.length,
  // THE DEFAULTS ARE MEASURED, so a row counted as away from them is counted
  // against a number a reader can check. The area is inversely proportional to
  // the product Kd Kb Kc, so the area at unit coefficients divided by the area
  // with ONE of them left out is exactly that one's default. Nothing here types
  // 0.975. The digest derives the same three the same way.
  measuredDefaults: GAS_DEFAULTS(),
  awayFromDefaults: awayFromGasDefaults().length,
  awayFromDefaultsRows: awayFromGasDefaults()
    .map((g) => ({ wLbHr: g.wLbHr, kd: g.kd, kb: g.kb, kc: g.kc })),
});

// ---------------------------------------------------------------------------
// SECTION 6. Liquid, the Kv loop, and the band each of its terms is worth
// anything in.
// ---------------------------------------------------------------------------

/** Digest section 6. */
export const liquidLoop = () => {
  const p1 = AKASO.setPsig * (1 + AKASO.overpressurePct / 100);
  const base = {
    qGpm: AKASO.qGpm, p1Psig: p1, p2Psig: AKASO.backPsig, sg: AKASO.sg,
    kd: AKASO.kd, kw: AKASO.kw, kc: AKASO.kc,
  };
  const viscous = R.liquidArea({ ...base, muCp: AKASO.muCp });
  const inviscid = R.liquidArea(base);
  const c = moduleConstants();
  // What ONE pass would have given, built from the MEASURED leading constants
  // and the engine's own Kv function.
  const onePass = (() => {
    const area = (kv) => (AKASO.qGpm * Math.sqrt(AKASO.sg))
      / (c.liquidLeadingConstant * AKASO.kd * AKASO.kw * AKASO.kc * kv * Math.sqrt(p1 - AKASO.backPsig));
    const a0 = area(1);
    const re = (AKASO.qGpm * c.liquidReynoldsConstant * AKASO.sg) / (AKASO.muCp * Math.sqrt(a0));
    return { areaIn2: area(R.liquidKv(re)), kv: R.liquidKv(re), reynolds: re };
  })();
  const kvA = c.kvFitIntercept;
  const kvB = c.kvFitInverseRootTerm;
  const kvC = c.kvFitInverseThreeHalvesTerm;
  return {
    stated: {
      qGpm: AKASO.qGpm, setPsig: AKASO.setPsig, overpressurePct: AKASO.overpressurePct,
      backPsig: AKASO.backPsig, sg: AKASO.sg, muCp: AKASO.muCp,
      kd: AKASO.kd, kw: AKASO.kw, kc: AKASO.kc,
    },
    inviscid: {
      areaIn2: inviscid.areaIn2, kv: inviscid.kv, reynolds: inviscid.reynolds, iterations: inviscid.kvIterations,
    },
    viscous: {
      areaIn2: viscous.areaIn2,
      kv: viscous.kv,
      reynolds: viscous.reynolds,
      iterations: viscous.kvIterations,
      converged: viscous.kvConverged,
      residual: viscous.kvResidual,
    },
    areaRatioDerived: viscous.areaIn2 / inviscid.areaIn2,
    onePass,
    convergedOverOnePassDerived: viscous.areaIn2 / onePass.areaIn2,
    viscositySweep: AKASO_MU_SWEEP.map((muCp) => {
      const r = R.liquidArea({ ...base, muCp });
      return {
        muCp,
        areaIn2: r.areaIn2,
        kv: r.kv,
        reynolds: r.reynolds,
        iterations: r.kvIterations,
        converged: r.kvConverged,
        warned: r.warning !== null,
      };
    }),
    kvTerms: KV_RE_SWEEP.map((reynolds) => {
      const intercept = kvA;
      const invRoot = kvB / Math.sqrt(reynolds);
      const invThreeHalves = kvC / reynolds ** 1.5;
      const sum = intercept + invRoot + invThreeHalves;
      return {
        reynolds,
        kvClamped: R.liquidKv(reynolds),
        kvUnclamped: R.liquidKvUnclamped(reynolds),
        interceptTerm: intercept,
        inverseRootTerm: invRoot,
        inverseThreeHalvesTerm: invThreeHalves,
        lastTermShareDerived: invThreeHalves / sum,
      };
    }),
    kvAsymptote: c.kvAsymptote,
    kvClampReynolds: c.kvClampReynolds,
    kvWarnValue: c.edges.kvWarnValue,
  };
};

/** Digest section 7. The published liquid cases, re-run. */
export const liquidPublished = () => ({
  rows: GOLD.liquid.map((g) => {
    const r = R.liquidArea({
      qGpm: g.qGpm, p1Psig: g.p1Psig, p2Psig: g.p2Psig, sg: g.sg, muCp: g.muCp,
      kd: g.kd, kw: g.kw, kc: g.kc,
    });
    return { ...g, engineAreaIn2: r.areaIn2, relDiff: relDiff(r.areaIn2, g.areaIn2) };
  }),
  count: GOLD.liquid.length,
  belowReynoldsTwoHundred: GOLD.liquid.filter((g) => g.reynolds !== null && g.reynolds < 200).length,
  lowestReynolds: GOLD.liquid
    .filter((g) => g.reynolds !== null)
    .reduce((lo, g) => Math.min(lo, g.reynolds), Infinity),
});

// ---------------------------------------------------------------------------
// SECTION 8. Steam, Napier, and both crossings of unity.
// ---------------------------------------------------------------------------

/** Digest section 8. */
export const steamNapier = () => {
  const c = moduleConstants();
  const p1 = relievingPsia(TEBIDABA.setPsig, TEBIDABA.overpressurePct);
  const call = {
    wLbHr: TEBIDABA.wLbHr, p1Psia: p1, kd: TEBIDABA.kd, kb: TEBIDABA.kb,
    kc: TEBIDABA.kc, ksh: TEBIDABA.ksh,
  };
  const run = R.steamArea(call);
  const orifice = R.selectOrifice(run.areaIn2);
  const threshold = c.edges.napierThresholdPsia;
  const justBelow = R.steamKn(threshold - 1e-6);
  const justAbove = R.steamKn(threshold + 1e-6);
  return {
    thresholdPsia: threshold,
    unityCrossingPsia: c.edges.napierUnityCrossingPsia,
    unityExportedPsia: R.NAPIER_UNITY_PSIA,
    topOfRangePsia: c.edges.napierTopPsia,
    knJustBelowThreshold: justBelow,
    knJustAboveThreshold: justAbove,
    stepDerived: justAbove - justBelow,
    rows: KN_P_SWEEP.map((p) => {
      const r = R.steamArea({ ...call, p1Psia: p });
      return {
        relievingPsia: p, kn: r.kn, areaIn2: r.areaIn2, warned: r.warning !== null, warning: r.warning,
      };
    }),
    stream: {
      wLbHr: TEBIDABA.wLbHr,
      setPsig: TEBIDABA.setPsig,
      overpressurePct: TEBIDABA.overpressurePct,
      relievingPsiaDerived: p1,
      kn: run.kn,
      areaIn2: run.areaIn2,
      orifice: orifice.orifice,
      orificeAreaIn2: orifice.areaIn2,
      margin: orifice.margin,
      kd: TEBIDABA.kd,
      ksh: TEBIDABA.ksh,
    },
    superheated: {
      ksh: TEBIDABA_SUPERHEAT_KSH,
      areaIn2: R.steamArea({ ...call, ksh: TEBIDABA_SUPERHEAT_KSH }).areaIn2,
    },
    superheatRatioDerived: R.steamArea({ ...call, ksh: TEBIDABA_SUPERHEAT_KSH }).areaIn2 / run.areaIn2,
  };
};

/** Digest section 9. The published steam cases, re-run. */
export const steamPublished = () => ({
  rows: GOLD.steam.map((g) => {
    const r = R.steamArea({
      wLbHr: g.wLbHr, p1Psia: g.p1Psia, kd: g.kd, kb: g.kb, kc: g.kc, ksh: g.ksh,
    });
    return {
      ...g, engineAreaIn2: r.areaIn2, engineKn: r.kn, relDiff: relDiff(r.areaIn2, g.areaIn2),
    };
  }),
  count: GOLD.steam.length,
  napierActive: GOLD.steam.filter((g) => g.p1Psia > 1500).length,
  insideTheEnlargingBand: GOLD.steam.filter((g) => g.p1Psia > 1500 && g.p1Psia < R.NAPIER_UNITY_PSIA).length,
});

// ---------------------------------------------------------------------------
// SECTION 10. From a required area to a standard orifice.
// ---------------------------------------------------------------------------

/** Digest section 10. */
export const orificeLadder = () => {
  const table = R.API_ORIFICES;
  const gas = gasBranch().stream;
  const liquid = liquidLoop();
  const steam = steamNapier().stream;
  const liquidOrifice = R.selectOrifice(liquid.viscous.areaIn2);
  const gasAreaAt = (wLbHr) => R.gasVaporArea({
    wLbHr,
    p1Psia: relievingPsia(ORUBIRI.setPsig, ORUBIRI.overpressurePct),
    p2Psia: ORUBIRI.backPsig + ATM(),
    tR: ORUBIRI.tF + 459.67,
    mw: ORUBIRI.mw,
    z: ORUBIRI.z,
    k: ORUBIRI.k,
    kd: ORUBIRI.kd,
    kb: ORUBIRI.kb,
    kc: ORUBIRI.kc,
  }).areaIn2;
  // THE BRACKET IS GROWN UNTIL IT HOLDS THE ROOT. It used to run from half the
  // stated load to two and a half times it, where the selection is J and P, so
  // the predicate was false at BOTH ends and the bisection had nothing to find.
  // The lab reported that non-answer honestly and the digest printed it as a
  // measurement, "the load at which it changes is NaN lb/hr". Growing the
  // bracket from the stated load is the repair: the predicate is true at the
  // stated load by construction, and the walk stops the first time it is false.
  const letterAt = (x) => R.selectOrifice(gasAreaAt(x)).orifice;
  const letterFlipBracket = (() => {
    let hi = ORUBIRI.wLbHr;
    for (let i = 0; i < 200 && letterAt(hi) === gas.orifice; i += 1) hi *= LETTER_FLIP_STEP;
    return {
      loLbHr: ORUBIRI.wLbHr,
      hiLbHr: hi,
      stepFactor: LETTER_FLIP_STEP,
      steps: Math.round(Math.log(hi / ORUBIRI.wLbHr) / Math.log(LETTER_FLIP_STEP)),
      letterAtLo: letterAt(ORUBIRI.wLbHr),
      letterAtHi: letterAt(hi),
    };
  })();
  const letterFlipLoadLbHr = bisect(
    letterFlipBracket.loLbHr, letterFlipBracket.hiLbHr,
    (x) => letterAt(x) === gas.orifice,
  );
  return {
    ladder: table.map((row, i) => ({
      orifice: row.orifice,
      areaIn2: row.areaIn2,
      ratioToTheOneBelow: i === 0 ? null : row.areaIn2 / table[i - 1].areaIn2,
    })),
    rowCount: table.length,
    selectionRows: ORIFICE_SELECTION_PROBES.map(([requiredAreaIn2, note]) => {
      // THE PROBE IS THE NUMBER IN THE TABLE. This used to nudge the sixth probe
      // by a part in a million million and print the un-nudged value, so the row
      // the reader saw was not the row the engine was asked about, and two rows
      // read identically while returning different letters. The pair either side
      // of G is now two distinct stated areas, 0.503 and 0.503001.
      const r = R.selectOrifice(requiredAreaIn2);
      return {
        requiredAreaIn2, orifice: r.orifice, orificeAreaIn2: r.areaIn2, margin: r.margin, note,
      };
    }),
    pastLargest: ORIFICE_PAST_LARGEST.map((requiredAreaIn2) => {
      const r = R.selectOrifice(requiredAreaIn2);
      return { requiredAreaIn2, error: softOf(r), multipleOfT: r.multipleOfT };
    }),
    streams: [
      {
        stream: 'ORUBIRI', fluid: 'gas', areaIn2: gas.areaIn2, orifice: gas.orifice, orificeAreaIn2: gas.orificeAreaIn2, margin: gas.margin,
      },
      {
        stream: 'AKASO', fluid: 'liquid', areaIn2: liquid.viscous.areaIn2, orifice: liquidOrifice.orifice, orificeAreaIn2: liquidOrifice.areaIn2, margin: liquidOrifice.margin,
      },
      {
        stream: 'TEBIDABA', fluid: 'steam', areaIn2: steam.areaIn2, orifice: steam.orifice, orificeAreaIn2: steam.orificeAreaIn2, margin: steam.margin,
      },
    ],
    letterFlipBracket,
    letterFlipLoadLbHr,
    letterFlipBracketed: Number.isFinite(letterFlipLoadLbHr),
    letterFlipAreaIn2: gasAreaAt(letterFlipLoadLbHr),
    letterFlipRatioDerived: letterFlipLoadLbHr / ORUBIRI.wLbHr,
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. One Associate scenario, end to end.
// ---------------------------------------------------------------------------

/** Digest section 11. Three pressure relief cases on one train. */
export const associateReading = () => {
  const gas = gasBranch().stream;
  const liquid = liquidLoop();
  const steam = steamNapier().stream;
  const liquidOrifice = R.selectOrifice(liquid.viscous.areaIn2);
  return {
    routes: [
      {
        route: 'gas and vapour',
        stream: 'ORUBIRI',
        loadStated: `${ORUBIRI.wLbHr} lb/hr`,
        setPsig: ORUBIRI.setPsig,
        relieving: `${gas.relievingPsiaDerived} psia`,
        computedFactorName: 'critical pressure ratio',
        computedFactor: gas.criticalRatio,
        typedFactorName: 'Kb',
        typedFactor: ORUBIRI.kb,
        certifiedKd: ORUBIRI.kd,
        areaIn2: gas.areaIn2,
        orifice: gas.orifice,
        margin: gas.margin,
      },
      {
        route: 'liquid',
        stream: 'AKASO',
        loadStated: `${AKASO.qGpm} gpm`,
        setPsig: AKASO.setPsig,
        relieving: `${AKASO.setPsig * (1 + AKASO.overpressurePct / 100)} psig`,
        computedFactorName: 'Kv',
        computedFactor: liquid.viscous.kv,
        typedFactorName: 'Kw',
        typedFactor: AKASO.kw,
        certifiedKd: AKASO.kd,
        areaIn2: liquid.viscous.areaIn2,
        orifice: liquidOrifice.orifice,
        margin: liquidOrifice.margin,
      },
      {
        route: 'steam',
        stream: 'TEBIDABA',
        loadStated: `${TEBIDABA.wLbHr} lb/hr`,
        setPsig: TEBIDABA.setPsig,
        relieving: `${steam.relievingPsiaDerived} psia`,
        computedFactorName: 'KN',
        computedFactor: steam.kn,
        typedFactorName: 'KSH',
        typedFactor: TEBIDABA.ksh,
        certifiedKd: TEBIDABA.kd,
        areaIn2: steam.areaIn2,
        orifice: steam.orifice,
        margin: steam.margin,
      },
    ],
    oneComputedOneTypedEach: true,
  };
};

// ---------------------------------------------------------------------------
// SECTION 12. The wetted area in both orientations, exactly.
// ---------------------------------------------------------------------------

/** Digest section 12. */
/**
 * The wetted area gained across TEN EQUAL BANDS of a tenth of the diameter,
 * each band an engine return at each of its two ends. The digest prints this
 * table and the lesson that reads a steepness off it reads it here.
 */
const bandGainRows = (geom, diameterFt) => {
  const bandFt = diameterFt / 10;
  const rows = [];
  for (let i = 0; i < 10; i += 1) {
    const loFt = i * bandFt;
    const hiFt = (i + 1) * bandFt;
    const a = R.wettedAreaFt2({ ...geom, orientation: 'horizontal', liquidLevelFt: loFt });
    const b = R.wettedAreaFt2({ ...geom, orientation: 'horizontal', liquidLevelFt: hiFt });
    rows.push({
      loFt, hiFt, bandFt, gainedFt2: b.areaFt2 - a.areaFt2, gainedPerFtDerived: (b.areaFt2 - a.areaFt2) / bandFt,
    });
  }
  const gains = rows.map((r) => r.gainedFt2);
  const maxGain = Math.max(...gains);
  const minGain = Math.min(...gains);
  return {
    bandFt,
    rows,
    count: rows.length,
    maxGainedFt2: maxGain,
    minGainedFt2: minGain,
    // The column read from the top is the column read from the bottom.
    mirrored: gains.every((g, i) => Math.abs(g - gains[9 - i]) < 1e-9),
    topOverBottomDerived: gains[9] / gains[0],
    steepestOverFlattestDerived: maxGain / minGain,
    steepestAreTheEnds: Math.abs(gains[0] / maxGain - 1) < 1e-12 && Math.abs(gains[9] / maxGain - 1) < 1e-12,
    flattestAreTheMiddleTwo: Math.abs(gains[4] / minGain - 1) < 1e-12 && Math.abs(gains[5] / minGain - 1) < 1e-12,
  };
};

export const wettedGeometry = () => {
  const geom = {
    diameterFt: BENISEDE.diameterFt, lengthFt: BENISEDE.lengthFt,
  };
  const lying = R.wettedAreaFt2({ ...geom, orientation: 'horizontal', liquidLevelFt: BENISEDE.liquidLevelFt });
  const standing = R.wettedAreaFt2({ ...geom, orientation: 'vertical', liquidLevelFt: BENISEDE.liquidLevelFt });
  const halfFullFt = BENISEDE.diameterFt / 2;
  const atHalf = R.wettedAreaFt2({ ...geom, orientation: 'horizontal', liquidLevelFt: halfFullFt });
  const full = R.wettedAreaFt2({ ...geom, orientation: 'horizontal', liquidLevelFt: BENISEDE.diameterFt });
  // Half the LATERAL SURFACE of the cylinder, which is what half full has an
  // analytic answer for: the engine's own full-level answer halved.
  const halfLateral = full.areaFt2 / 2;
  return {
    stated: { ...geom, liquidLevelFt: BENISEDE.liquidLevelFt, orientation: BENISEDE.orientation },
    lyingFt2: lying.areaFt2,
    standingFt2: standing.areaFt2,
    lyingOverStandingDerived: lying.areaFt2 / standing.areaFt2,
    rows: BENISEDE_LEVEL_SWEEP.map((liquidLevelFt) => {
      const h = R.wettedAreaFt2({ ...geom, orientation: 'horizontal', liquidLevelFt });
      const v = R.wettedAreaFt2({ ...geom, orientation: 'vertical', liquidLevelFt });
      return {
        liquidLevelFt,
        levelFractionDerived: liquidLevelFt / BENISEDE.diameterFt,
        horizontalFt2: h.areaFt2,
        verticalFt2: v.areaFt2,
        horizontalOverVerticalDerived: h.areaFt2 / v.areaFt2,
      };
    }),
    halfFull: {
      levelFt: halfFullFt,
      wettedFt2: atHalf.areaFt2,
      halfTheLateralSurfaceFt2: halfLateral,
      ratioDerived: atHalf.areaFt2 / halfLateral,
    },
    fullFt2: full.areaFt2,
    heightLimitNote: R.fireHeatInput({ wettedFt2: lying.areaFt2 }).note,
    // WHAT A FOOT OF LEVEL BUYS. The sweep above is printed at uneven spacings,
    // so its steepness cannot be read off it by eye, and a lesson that divided
    // two of its rows concluded the sweep buys LESS near the top. It buys the
    // same as the bottom. The digest prints this table for exactly that reason,
    // and until now nothing in this repository pinned it (FC5 repair).
    bandGains: bandGainRows(geom, BENISEDE.diameterFt),
  };
};

/** Digest section 13. The published wetted-area cases, re-run. */
export const wettedPublished = () => ({
  rows: GOLD.wetted.map((g) => {
    const r = R.wettedAreaFt2({
      orientation: g.orientation, diameterFt: g.diameterFt, lengthFt: g.lengthFt, liquidLevelFt: g.liquidLevelFt,
    });
    return {
      ...g,
      engineAreaFt2: r.areaFt2,
      relDiff: g.areaFt2 === 0 ? null : relDiff(r.areaFt2, g.areaFt2),
    };
  }),
  count: GOLD.wetted.length,
  vertical: GOLD.wetted.filter((g) => g.orientation === 'vertical').length,
});

// ---------------------------------------------------------------------------
// SECTION 14. The pool fire duty, its two constants, its exponent, its credit.
// ---------------------------------------------------------------------------

/** Digest section 14. */
export const fireDuty = () => {
  const c = moduleConstants();
  const wetted = wettedGeometry().lyingFt2;
  return {
    wettedFt2: wetted,
    constantDrainedBtuHr: c.fireConstantDrainedBtuHr,
    constantUndrainedBtuHr: c.fireConstantUndrainedBtuHr,
    drainageFactorDerived: c.drainageFactorDerived,
    exponent: c.fireExponent,
    envRows: ENV_SWEEP.map((envFactor) => {
      const drained = R.fireHeatInput({ wettedFt2: wetted, adequateDrainage: true, envFactor });
      const undrained = R.fireHeatInput({ wettedFt2: wetted, adequateDrainage: false, envFactor });
      const load = R.fireReliefLoad({ qBtuHr: drained.qBtuHr, latentBtuLb: BENISEDE.latentBtuLb });
      return {
        envFactor,
        dutyDrainedBtuHr: drained.qBtuHr,
        dutyUndrainedBtuHr: undrained.qBtuHr,
        loadDrainedLbHr: load.wLbHr,
      };
    }),
    areaRows: FIRE_AREA_SWEEP.map((wettedFt2) => {
      const d = R.fireHeatInput({ wettedFt2 });
      return { wettedFt2, dutyBtuHr: d.qBtuHr, dutyPerFt2Derived: d.qBtuHr / wettedFt2 };
    }),
    latentWarnBtuLb: c.edges.latentWarnBtuLb,
    latentRows: LATENT_SWEEP.map((latentBtuLb) => {
      const duty = R.fireHeatInput({
        wettedFt2: wetted, adequateDrainage: BENISEDE.adequateDrainage, envFactor: BENISEDE.envFactor,
      });
      const load = R.fireReliefLoad({ qBtuHr: duty.qBtuHr, latentBtuLb });
      return {
        latentBtuLb, loadLbHr: load.wLbHr, warned: load.warning !== null, warning: load.warning,
      };
    }),
    note: R.fireHeatInput({ wettedFt2: wetted }).note,
  };
};

/** Digest section 15. The published fire and relief-load cases, re-run. */
export const firePublished = () => ({
  fireRows: GOLD.fire.map((g) => {
    const r = R.fireHeatInput({
      wettedFt2: g.wettedFt2, adequateDrainage: g.adequateDrainage, envFactor: g.envFactor,
    });
    return { ...g, engineQBtuHr: r.qBtuHr, relDiff: relDiff(r.qBtuHr, g.qBtuHr) };
  }),
  loadRows: GOLD.load.map((g) => {
    const r = R.fireReliefLoad({ qBtuHr: g.qBtuHr, latentBtuLb: g.latentBtuLb });
    return { ...g, engineWLbHr: r.wLbHr, relDiff: relDiff(r.wLbHr, g.wLbHr) };
  }),
  fireCount: GOLD.fire.length,
  loadCount: GOLD.load.length,
});

// ---------------------------------------------------------------------------
// SECTION 16. The fire case end to end, geometry to letter.
// ---------------------------------------------------------------------------

/** One fire chain, from a vessel and a level to an orifice letter. */
const fireChain = (over) => {
  const s = { ...BENISEDE, ...over };
  const wetted = R.wettedAreaFt2({
    orientation: s.orientation, diameterFt: s.diameterFt, lengthFt: s.lengthFt, liquidLevelFt: s.liquidLevelFt,
  });
  const duty = R.fireHeatInput({
    wettedFt2: wetted.areaFt2, adequateDrainage: s.adequateDrainage, envFactor: s.envFactor,
  });
  const load = R.fireReliefLoad({ qBtuHr: duty.qBtuHr, latentBtuLb: s.latentBtuLb });
  const p1 = relievingPsia(s.setPsig, s.overpressurePct);
  const area = R.gasVaporArea({
    wLbHr: load.wLbHr, p1Psia: p1, p2Psia: ATM(), tR: s.tF + 459.67, mw: s.mw, z: s.z, k: s.k,
  });
  const orifice = R.selectOrifice(area.areaIn2);
  return {
    wettedFt2: wetted.areaFt2,
    dutyBtuHr: duty.qBtuHr,
    loadLbHr: load.wLbHr,
    relievingPsiaDerived: p1,
    areaIn2: area.areaIn2,
    orifice: orifice.orifice,
    orificeAreaIn2: orifice.areaIn2,
    margin: orifice.margin,
    note: duty.note,
  };
};

/** Digest section 16. */
/** The stated fire case and one changed input at a time, the digest's own list. */
const FIRE_VARIANTS = [
  { changed: 'none, the stated case', ...fireChain({}) },
  { changed: 'drainage answered false', ...fireChain({ adequateDrainage: false }) },
  { changed: 'environment factor 0.3', ...fireChain({ envFactor: 0.3 }) },
  { changed: 'level trimmed to 2.0 ft', ...fireChain({ liquidLevelFt: 2.0 }) },
  { changed: 'level raised to 8.0 ft', ...fireChain({ liquidLevelFt: 8.0 }) },
  { changed: 'latent heat 90 Btu/lb', ...fireChain({ latentBtuLb: 90 }) },
  { changed: 'read standing up', ...fireChain({ orientation: 'vertical' }) },
];

/**
 * THE SAME TABLE, RANKED BY THE DUTY IT MOVES. The duty factor is the variant
 * duty over the stated one, or the stated one over the variant where the
 * variant is lower, so every row is a figure at or above one. The rung count is
 * the signed distance the orifice letter moved on the published ladder.
 *
 * A DUTY RANKING AND A LETTER RANKING ARE DIFFERENT RANKINGS, which is the
 * whole reason both columns are here.
 */
const fireRanking = () => {
  const ladder = R.API_ORIFICES.map((x) => x.orifice);
  const stated = FIRE_VARIANTS[0];
  const rows = FIRE_VARIANTS.slice(1).map((r) => ({
    changed: r.changed,
    dutyBtuHr: r.dutyBtuHr,
    orifice: r.orifice,
    dutyFactorDerived: r.dutyBtuHr >= stated.dutyBtuHr ? r.dutyBtuHr / stated.dutyBtuHr : stated.dutyBtuHr / r.dutyBtuHr,
    dutyDirection: r.dutyBtuHr >= stated.dutyBtuHr ? 'up' : 'down',
    rungs: ladder.indexOf(r.orifice) - ladder.indexOf(stated.orifice),
  })).sort((a, b) => b.dutyFactorDerived - a.dutyFactorDerived);
  const maxRungs = Math.max(...rows.map((r) => Math.abs(r.rungs)));
  const furthest = rows.filter((r) => Math.abs(r.rungs) === maxRungs);
  const drainage = rows.find((r) => r.changed === 'drainage answered false');
  return {
    ladder,
    statedOrifice: stated.orifice,
    statedDutyBtuHr: stated.dutyBtuHr,
    rows,
    count: rows.length,
    everyVariantOrificeIsOnTheLadder: rows.every((r) => ladder.indexOf(r.orifice) >= 0),
    largestDutyLever: rows[0].changed,
    largestDutyFactorDerived: rows[0].dutyFactorDerived,
    drainageRankByDuty: rows.findIndex((r) => r.changed === 'drainage answered false') + 1,
    drainageDutyFactorDerived: drainage.dutyFactorDerived,
    drainageRungs: Math.abs(drainage.rungs),
    // The two findings the generator asserts, carried as readers so the lesson
    // that states either of them is pinned rather than trusted.
    drainageIsNotTheLargestDutyLever: rows[0].changed !== 'drainage answered false',
    drainageIsNotAmongTheFurthest: !furthest.some((r) => r.changed === 'drainage answered false'),
    maxRungs,
    furthestCount: furthest.length,
    furthestLabels: furthest.map((r) => r.changed),
    sharingTheDrainageRungCount: rows.filter(
      (r) => Math.abs(r.rungs) === Math.abs(drainage.rungs) && r.changed !== drainage.changed,
    ).length,
  };
};

export const fireCase = () => ({
  stated: { ...BENISEDE },
  chain: fireChain({}),
  atProcessOverpressure: {
    overpressurePct: 10,
    ...fireChain({ overpressurePct: 10 }),
  },
  whatMovesTheLetter: FIRE_VARIANTS,
  // THE SAME TABLE, RANKED. A ranking is an ANSWER, so it is computed rather
  // than left beside the figures to be read off by eye. Three committed lessons
  // ranked these rows by eye and all three got it wrong. The digest prints this
  // table for exactly that reason, and until now nothing in this repository
  // pinned it (FC5 repair).
  ranked: fireRanking(),
});

// ---------------------------------------------------------------------------
// SECTION 17. Droplet settling, drag against weight, iterated.
// ---------------------------------------------------------------------------

/** Digest section 17. */
export const dropletSettling = () => {
  const c = moduleConstants();
  const rhoV = odidiRhoV();
  const at = (dropletMicron) => R.dropoutVelocityFtS({
    dropletMicron, rhoLLbFt3: ODIDI.rhoLLbFt3, rhoVLbFt3: rhoV, muVCp: ODIDI.muVCp,
  });
  const stated = at(ODIDI.dropletMicron);
  return {
    stated: { ...ODIDI },
    vapourDensityLbFt3Derived: rhoV,
    actualVapourRateAcfsDerived: odidiAcfs(),
    settleGroupAt100Micron: c.settleGroupAt100Micron,
    settleGroupAt200Micron: c.settleGroupAt200Micron,
    settleGroupAtDoubleViscosity: c.settleGroupAtDoubleViscosity,
    coefficientSquaredTimesFootPerMicron: c.settleCoefficientSquaredTimesFootPerMicron,
    rows: ODIDI_DROPLET_SWEEP.map((dropletMicron) => {
      const r = at(dropletMicron);
      return {
        dropletMicron,
        udFtS: r.udFtS,
        dragC: r.dragC,
        reynolds: r.reynolds,
        iterations: r.iterations,
        converged: r.converged,
      };
    }),
    dragCap: c.edges.dragCap,
    dragCapReynolds: c.edges.dragCapReynolds,
    statedPair: {
      udFtS: stated.udFtS,
      dragC: stated.dragC,
      converged: stated.converged,
      iterations: stated.iterations,
      residual: stated.residual,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 18. The knockout drum, a level, a segment and a length.
// ---------------------------------------------------------------------------

/** Digest section 18. */
export const knockoutDrum = () => {
  const c = moduleConstants();
  const rhoV = odidiRhoV();
  const ud = R.dropoutVelocityFtS({
    dropletMicron: ODIDI.dropletMicron, rhoLLbFt3: ODIDI.rhoLLbFt3, rhoVLbFt3: rhoV, muVCp: ODIDI.muVCp,
  }).udFtS;
  const acfs = odidiAcfs();
  const at = (over) => R.koDrumHorizontal({
    qVaporAcfs: acfs, udFtS: ud, diameterFt: ODIDI.diameterFt, liquidFraction: ODIDI.liquidFraction, ...over,
  });
  const holdupRows = ODIDI_HOLDUP_SWEEP.map((liquidFraction) => {
    const r = at({ liquidFraction });
    return {
      liquidFraction,
      liquidDepthFt: r.liquidDepthFt,
      liquidAreaFraction: r.liquidAreaFraction,
      areaVaporFt2: r.areaVaporFt2,
      vVaporFtS: r.vVaporFtS,
      fallFt: r.fallFt,
      requiredLengthFt: r.requiredLengthFt,
      ld: r.ld,
      note: r.note,
    };
  });
  const lengths = holdupRows.map((r) => r.requiredLengthFt);
  const speeds = holdupRows.map((r) => r.vVaporFtS);
  const stated = at({});
  return {
    stated: {
      diameterFt: ODIDI.diameterFt, liquidFraction: ODIDI.liquidFraction,
      qVaporAcfsDerived: acfs, udFtS: ud,
    },
    segmentRows: SEGMENT_FRACTIONS.map((depthFraction) => ({
      depthFraction,
      liquidAreaFraction: R.segmentAreaFraction(depthFraction),
      vapourAreaFractionDerived: 1 - R.segmentAreaFraction(depthFraction),
    })),
    halfDepthAreaFraction: R.segmentAreaFraction(0.5),
    holdupRows,
    lengthSpread: {
      minFt: Math.min(...lengths),
      maxFt: Math.max(...lengths),
      spreadFtDerived: Math.max(...lengths) - Math.min(...lengths),
      minVapourFtS: Math.min(...speeds),
      maxVapourFtS: Math.max(...speeds),
    },
    conventionRows: CONVENTION_LEVELS.map((fraction) => {
      const asLevel = R.koDrumHorizontal({ ...CONVENTION_PROBE, liquidFraction: fraction });
      // The SAME drum read as if the stated fraction were an AREA fraction
      // instead of a level: the level whose segment area fraction is that
      // number, found by bisection on the engine's own segment export.
      const asDepth = bisect(0, 0.999999999, (f) => R.segmentAreaFraction(f) < fraction);
      const asArea = R.koDrumHorizontal({ ...CONVENTION_PROBE, liquidFraction: asDepth });
      return {
        fraction,
        lengthAsLevelFt: asLevel.requiredLengthFt,
        lengthAsAreaFractionFt: asArea.requiredLengthFt,
        ratioDerived: asArea.requiredLengthFt / asLevel.requiredLengthFt,
      };
    }),
    diameterRows: ODIDI_DIAMETER_SWEEP.map((diameterFt) => {
      const r = at({ diameterFt });
      return {
        diameterFt, vVaporFtS: r.vVaporFtS, requiredLengthFt: r.requiredLengthFt, ld: r.ld, note: r.note,
      };
    }),
    noteBand: { goWiderLd: c.edges.ldGoWider, smallerDrumLd: c.edges.ldSmallerDrum },
    statedDrum: {
      vVaporFtS: stated.vVaporFtS,
      requiredLengthFt: stated.requiredLengthFt,
      ld: stated.ld,
      note: stated.note,
    },
  };
};

/** Digest section 19. The published dropout and drum cases, re-run. */
export const dropoutDrumPublished = () => ({
  dropoutRows: GOLD.dropout.map((g) => {
    const r = R.dropoutVelocityFtS({
      dropletMicron: g.dropletMicron, rhoLLbFt3: g.rhoLLbFt3, rhoVLbFt3: g.rhoVLbFt3, muVCp: g.muVCp,
    });
    return {
      ...g, engineUdFtS: r.udFtS, engineDragC: r.dragC, relDiff: relDiff(r.udFtS, g.udFtS),
    };
  }),
  drumRows: GOLD.drum.map((g) => {
    const r = R.koDrumHorizontal({
      qVaporAcfs: g.qVaporAcfs, udFtS: g.udFtS, diameterFt: g.diameterFt, liquidFraction: g.liquidFraction,
    });
    return {
      ...g, engineLengthFt: r.requiredLengthFt, relDiff: relDiff(r.requiredLengthFt, g.requiredLengthFt),
    };
  }),
  dropoutCount: GOLD.dropout.length,
  drumCount: GOLD.drum.length,
  distinctHoldups: new Set(GOLD.drum.map((g) => g.liquidFraction)).size,
});

// ---------------------------------------------------------------------------
// SECTION 20. One Professional scenario, end to end.
// ---------------------------------------------------------------------------

/** Digest section 20. The vessel in a fire, and the drum behind the valve. */
export const professionalReading = () => {
  const fire = fireCase().chain;
  const drum = knockoutDrum();
  const settle = dropletSettling();
  return {
    fire: {
      wettedFt2: fire.wettedFt2,
      dutyBtuHr: fire.dutyBtuHr,
      loadLbHr: fire.loadLbHr,
      areaIn2: fire.areaIn2,
      orifice: fire.orifice,
    },
    drum: {
      vapourDensityLbFt3Derived: settle.vapourDensityLbFt3Derived,
      actualVapourRateAcfsDerived: settle.actualVapourRateAcfsDerived,
      dropoutVelocityFtS: drum.stated.udFtS,
      vVaporFtS: drum.statedDrum.vVaporFtS,
      requiredLengthFt: drum.statedDrum.requiredLengthFt,
      ld: drum.statedDrum.ld,
    },
    leftToTheCaller: [
      'the wetted height truncation at 25 ft',
      'the choice of which scenario is the governing case',
      'the conversion from a standard rate to an actual one',
      'the liquid density and vapour viscosity at drum conditions',
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 21. The blowdown march, and its closed form.
// ---------------------------------------------------------------------------

/** Digest section 21. */
export const blowdownMarch = () => {
  const run = R.blowdown(AFIESERE);
  const closed = closedFormTimeS(AFIESERE, run);
  const closedCases = [
    ['AFIESERE as stated', AFIESERE],
    ['AFIESERE at a 2.0 in orifice', { ...AFIESERE, orificeDIn: 2.0 }],
    ['AFIESERE at a discharge coefficient of 0.60', { ...AFIESERE, cd: 0.60 }],
    ['AFIESERE from 1800 psia', { ...AFIESERE, p0Psia: 1800 }],
  ].map(([label, b]) => {
    const r = R.blowdown(b);
    const cf = closedFormTimeS(b, r);
    return {
      label, marchedS: r.timeS, closedFormS: cf, ratioDerived: cf / r.timeS,
    };
  });
  const cdCases = [0.60, 0.82, 1.00].map((cd) => ({ cd, timeS: R.blowdown({ ...AFIESERE, cd }).timeS }));
  return {
    stated: { ...AFIESERE },
    timeS: run.timeS,
    timeMinDerived: run.timeS / 60,
    initialMassLb: run.initialMassLb,
    massRemainingLb: run.massRemainingLb,
    fractionRemovedDerived: 1 - run.massRemainingLb / run.initialMassLb,
    finalTR: run.finalTR,
    finalTFDerived: run.finalTR - 459.67,
    finalPPsia: run.finalPPsia,
    steps: run.steps,
    substeps: run.substeps,
    stationCount: run.stations.length,
    dtS: run.dtS,
    chokedToPsia: run.chokedToPsia,
    warning: run.warning,
    universalGasConstant: rGasUniversal(),
    closedFormS: closed,
    closedFormRatioDerived: closed / run.timeS,
    closedCases,
    cdCases,
    cdTimeRatioDerived: cdCases[0].timeS / cdCases[2].timeS,
    cdFactorRatioDerived: 1.0 / 0.60,
    // Every tenth station, which is what the panel draws.
    trajectory: run.stations.filter((_, i) => i % 10 === 0 || i === run.stations.length - 1)
      .map((s, i) => ({
        station: i, timeS: s.tS, pressurePsia: s.pPsia, temperatureR: s.tR,
      })),
    // STRICTLY falling, because the sentence this pins says the pressure FALLS
    // at every station. A `<=` here is satisfied by a plateau, which would
    // refute the sentence while leaving the pin green (FC5 repair).
    pressureFallsEverywhere: run.stations.every((s, i) => i === 0 || s.pPsia < run.stations[i - 1].pPsia),
    nonFallingPressurePairs: run.stations.filter((s, i) => i > 0 && !(s.pPsia < run.stations[i - 1].pPsia)).length,
    // The other half of the same sentence: the vessel gets colder all the way down.
    temperatureFallsEverywhere: run.stations.every((s, i) => i === 0 || s.tR < run.stations[i - 1].tR),
    nonFallingTemperaturePairs: run.stations.filter((s, i) => i > 0 && !(s.tR < run.stations[i - 1].tR)).length,
    stationPairs: run.stations.length - 1,
  };
};

// ---------------------------------------------------------------------------
// SECTION 22. Reading a depressuring time off a curve.
// ---------------------------------------------------------------------------

/** Digest section 22. */
export const depressuringTime = () => {
  const orificeRows = AFIESERE_ORIFICE_SWEEP.map((orificeDIn) => {
    const r = R.blowdown({ ...AFIESERE, orificeDIn });
    return {
      orificeDIn,
      timeS: r.timeS,
      timeMinDerived: r.timeS / 60,
      finalTR: r.finalTR,
      steps: r.steps,
      substeps: r.substeps,
    };
  });
  const fifteenMinuteOrificeIn = bisect(0.5, 4, (d) => {
    const r = R.blowdown({ ...AFIESERE, orificeDIn: d });
    return r.error ? true : r.timeS > 900;
  });
  const atFifteen = R.blowdown({ ...AFIESERE, orificeDIn: fifteenMinuteOrificeIn });
  const atOne = R.blowdown({ ...AFIESERE, orificeDIn: 1.0 });
  const atTwo = R.blowdown({ ...AFIESERE, orificeDIn: 2.0 });
  return {
    orificeRows,
    fifteenMinuteOrificeIn,
    fifteenMinuteTimeS: atFifteen.timeS,
    doublingRatioDerived: atTwo.timeS / atOne.timeS,
    distinctFinalTemperatures: new Set(orificeRows.map((r) => r.finalTR.toFixed(6))).size,
    endPressureRows: AFIESERE_END_PRESSURES.map((pEndPsia) => {
      const r = R.blowdown({ ...AFIESERE, pEndPsia });
      return {
        pEndPsia,
        timeS: r.timeS,
        finalTR: r.finalTR,
        finalTFDerived: r.finalTR - 459.67,
        fractionRemovedDerived: 1 - r.massRemainingLb / r.initialMassLb,
        warning: r.warning,
      };
    }),
    chokedFloorPsia: R.blowdown(AFIESERE).chokedToPsia,
    belowTheFloorWarning: R.blowdown({ ...AFIESERE, pEndPsia: 25 }).warning,
  };
};

// ---------------------------------------------------------------------------
// SECTION 23. A step size is an answer.
// ---------------------------------------------------------------------------

/** Digest section 23. */
export const stepStudy = () => {
  const rows = AFIESERE_STEP_SWEEP.map((dtS) => {
    const r = R.blowdown({ ...AFIESERE, dtS });
    return {
      dtS, timeS: r.timeS, finalTR: r.finalTR, steps: r.steps, substeps: r.substeps,
    };
  });
  const finest = rows[rows.length - 1].timeS;
  const stated = R.blowdown(AFIESERE);
  return {
    rows: rows.map((r) => ({ ...r, ratioToFinestDerived: r.timeS / finest })),
    totalMovementSDerived: Math.abs(rows[0].timeS - finest),
    halvings: rows.length - 1,
    refinementFactorDerived: rows[0].dtS / rows[rows.length - 1].dtS,
    landsOnTheEndPressure: {
      finalPPsia: stated.finalPPsia,
      targetPsia: AFIESERE.pEndPsia,
      differencePsiaDerived: stated.finalPPsia - AFIESERE.pEndPsia,
    },
    statedSubsteps: stated.substeps,
    statedSteps: stated.steps,
    hardGeometryRows: ZERO_TIME_CASES.map((b) => {
      const r = R.blowdown(b);
      return {
        label: `${b.volumeFt3} ft3, ${b.orificeDIn} in orifice`,
        volumeFt3: b.volumeFt3,
        orificeDIn: b.orificeDIn,
        timeS: r.timeS,
        finalPPsia: r.finalPPsia,
        finalTR: r.finalTR,
        steps: r.steps,
        substeps: r.substeps,
      };
    }),
  };
};

/** Digest section 24. The published blowdown cases, re-run. */
export const blowdownPublished = () => ({
  rows: GOLD.blowdown.map((g) => {
    const r = R.blowdown({
      volumeFt3: g.volumeFt3, p0Psia: g.p0Psia, pEndPsia: g.pEndPsia, t0R: g.t0R,
      mw: g.mw, k: g.k, z: g.z, orificeDIn: g.orificeDIn, cd: g.cd,
    });
    return { ...g, engineTimeS: r.timeS, relDiff: relDiff(r.timeS, g.timeS) };
  }),
  count: GOLD.blowdown.length,
  largeOrifice: GOLD.blowdown.filter((g) => g.orificeDIn >= 4).length,
  smallVessel: GOLD.blowdown.filter((g) => g.volumeFt3 <= 10).length,
});

// ---------------------------------------------------------------------------
// SECTION 25. The point source, asked both ways, and two tables with the same
// numbers.
// ---------------------------------------------------------------------------

/** Digest section 25. */
export const pointSource = () => {
  const c = moduleConstants();
  const p = PROBES.pointSource;
  const forward = R.radiationIntensity(p);
  const inverse = R.distanceForIntensity({
    qKw: p.qKw, allowableKwM2: forward.kWm2, fractionRadiated: p.fractionRadiated, transmissivity: p.transmissivity,
  });
  const qKw = flareKw();
  const relief = SPACING.RADIATION_LEVELS || [];
  return {
    solidAngle: c.solidAngle,
    roundTrip: {
      statedDistanceM: p.distanceM,
      intensityKWm2: forward.kWm2,
      distanceBackM: inverse.distanceM,
      ratioDerived: inverse.distanceM / p.distanceM,
    },
    flare: {
      reliefWLbHr: AFIESERE_FLARE.reliefWLbHr,
      lhvBtuLb: AFIESERE_FLARE.lhvBtuLb,
      fractionRadiated: AFIESERE_FLARE.fractionRadiated,
      transmissivity: AFIESERE_FLARE.transmissivity,
      heatReleaseKwDerived: qKw,
      statedDistanceM: AFIESERE_FLARE.distanceM,
      intensityAtStatedKWm2: R.radiationIntensity({
        qKw, distanceM: AFIESERE_FLARE.distanceM,
        fractionRadiated: AFIESERE_FLARE.fractionRadiated, transmissivity: AFIESERE_FLARE.transmissivity,
      }).kWm2,
    },
    distanceRows: RADIATION_DISTANCE_SWEEP.map((distanceM) => ({
      distanceM,
      intensityKWm2: R.radiationIntensity({
        qKw, distanceM,
        fractionRadiated: AFIESERE_FLARE.fractionRadiated, transmissivity: AFIESERE_FLARE.transmissivity,
      }).kWm2,
    })),
    factorRows: RADIATION_FACTOR_PAIRS.map(([fractionRadiated, transmissivity]) => ({
      fractionRadiated,
      transmissivity,
      intensityKWm2: R.radiationIntensity({
        qKw, distanceM: AFIESERE_FLARE.distanceM, fractionRadiated, transmissivity,
      }).kWm2,
    })),
    // THE SETBACK IS NOT TAUGHT HERE and this course does not grade one. The
    // published inverse rows below are the point source verified against the
    // golden file, which is a different thing from a setback study.
    setbackOwnedBy: 'the Separation & Slug Catching course, which is live and grades a setback of its own',
    publishedInverseRows: GOLD.setback.map((g) => {
      const r = R.distanceForIntensity({
        qKw: g.qKw, allowableKwM2: g.allowableKwM2,
        fractionRadiated: g.fractionRadiated, transmissivity: g.transmissivity,
      });
      return { ...g, engineDistanceM: r.distanceM, relDiff: relDiff(r.distanceM, g.distanceM) };
    }),
    publishedForwardRows: GOLD.radiation.map((g) => {
      const r = R.radiationIntensity({
        qKw: g.qKw, distanceM: g.distanceM,
        fractionRadiated: g.fractionRadiated, transmissivity: g.transmissivity,
      });
      return { ...g, engineKWm2: r.kWm2, relDiff: relDiff(r.kWm2, g.kWm2) };
    }),
    twoTables: R.RADIATION_LEVELS.map((row, i) => ({
      kWm2: row.kWm2,
      reliefLabel: row.label,
      spacingLabel: relief[i] ? relief[i].label : null,
      equal: !!relief[i] && relief[i].label === row.label && relief[i].kWm2 === row.kWm2,
    })),
    tablesEqual: R.RADIATION_LEVELS.length === relief.length
      && R.RADIATION_LEVELS.every((row, i) => relief[i] && relief[i].label === row.label && relief[i].kWm2 === row.kWm2),
  };
};

// ---------------------------------------------------------------------------
// SECTION 26. Every refusal, and the contract behind them.
// ---------------------------------------------------------------------------

/** Call one route by name with one argument, whatever shape it takes. */
const callRoute = (route, arg) => R[route](arg);

/**
 * Every refusal this module can produce, each reached by ONE bad input with
 * everything else sound. The message is the ENGINE's: nothing in this lab or in
 * any panel writes one as a literal, and the refusal gate proves it by grepping
 * both for every message this reader returns.
 */
export const REFUSAL_PROBES = REFUSALS.map(([route, label, arg]) => ({
  route, label, run: () => callRoute(route, arg),
}));

/** Digest section 26. */
export const refusalContract = () => {
  const rows = REFUSAL_PROBES.map(({ route, label, run }) => {
    const r = run();
    return { route, label, error: softOf(r) };
  });
  const distinctRoutes = new Set(rows.map((r) => r.route));
  const oruP1 = relievingPsia(ORUBIRI.setPsig, ORUBIRI.overpressurePct);
  const oruCall = {
    wLbHr: ORUBIRI.wLbHr, p1Psia: oruP1, tR: ORUBIRI.tF + 459.67,
    mw: ORUBIRI.mw, z: ORUBIRI.z, k: ORUBIRI.k, kd: ORUBIRI.kd, kc: ORUBIRI.kc,
  };
  const wetted = wettedGeometry().lyingFt2;
  const acfs = odidiAcfs();
  const ud = R.dropoutVelocityFtS({
    dropletMicron: ODIDI.dropletMicron, rhoLLbFt3: ODIDI.rhoLLbFt3, rhoVLbFt3: odidiRhoV(), muVCp: ODIDI.muVCp,
  }).udFtS;
  return {
    rows,
    refusalCount: rows.length,
    routeCount: distinctRoutes.size,
    everyRowRefused: rows.every((r) => r.error !== null),
    // The soft states: calls that SUCCEED and attach a warning, which is read
    // differently from a refusal.
    warnings: [
      {
        route: 'gasVaporArea',
        condition: 'a pressure at the valve outlet above the ratio the chart warning fires at',
        warning: R.gasVaporArea({ ...oruCall, p2Psia: 0.4 * oruP1, kb: 1.0 }).warning,
      },
      {
        route: 'gasVaporArea',
        condition: 'a typed Kb in the subcritical branch',
        warning: R.gasVaporArea({ ...oruCall, p2Psia: 0.8 * oruP1, kb: 0.72 }).warning,
      },
      {
        route: 'liquidArea',
        condition: 'a viscosity far off the certified envelope',
        warning: R.liquidArea({
          qGpm: 500, p1Psig: 250, p2Psig: 50, sg: 0.9, muCp: 1e5,
        }).warning,
      },
      {
        route: 'steamArea',
        condition: 'a relieving pressure inside the band where the correction enlarges the valve',
        warning: R.steamArea({ wLbHr: TEBIDABA.wLbHr, p1Psia: 1550 }).warning,
      },
      {
        route: 'fireReliefLoad',
        condition: 'a latent heat below the near-critical edge',
        warning: R.fireReliefLoad({ qBtuHr: 4.4e6, latentBtuLb: 49 }).warning,
      },
      {
        route: 'blowdown',
        condition: 'an end pressure below the choked floor',
        warning: R.blowdown({ ...AFIESERE, pEndPsia: 25 }).warning,
      },
    ],
    // The notes: text the engine returns on a SUCCESSFUL call to name a
    // decision it has left to the caller.
    notes: [
      { route: 'fireHeatInput', note: R.fireHeatInput({ wettedFt2: wetted }).note },
      {
        route: 'koDrumHorizontal, at the ODIDI drum',
        note: R.koDrumHorizontal({
          qVaporAcfs: acfs, udFtS: ud, diameterFt: ODIDI.diameterFt, liquidFraction: ODIDI.liquidFraction,
        }).note,
      },
      {
        route: 'koDrumHorizontal, at a 5 ft drum on the same duty',
        note: R.koDrumHorizontal({
          qVaporAcfs: acfs, udFtS: ud, diameterFt: 5, liquidFraction: ODIDI.liquidFraction,
        }).note,
      },
      {
        route: 'koDrumHorizontal, at a 14 ft drum on the same duty',
        note: R.koDrumHorizontal({
          qVaporAcfs: acfs, udFtS: ud, diameterFt: 14, liquidFraction: ODIDI.liquidFraction,
        }).note,
      },
    ],
  };
};

/**
 * THE CONTRACT, MEASURED RATHER THAN LISTED. One accepted call and one refused
 * call for every route this module answers a duty with, so a route that quietly
 * starts handing back a bare number is caught by the measurement rather than by
 * somebody remembering to add it to a list.
 */
export const CONTRACT_PROBES = [
  ['selectOrifice', () => R.selectOrifice(2.0), () => R.selectOrifice(0)],
  ['gasVaporArea', () => R.gasVaporArea(PROBES.atmProbeGiven), () => R.gasVaporArea({ ...PROBES.atmProbeGiven, wLbHr: 0 })],
  ['liquidArea', () => R.liquidArea(PROBES.liquidBare), () => R.liquidArea({ ...PROBES.liquidBare, qGpm: 0 })],
  ['steamArea', () => R.steamArea(PROBES.steamBare), () => R.steamArea({ ...PROBES.steamBare, p1Psia: 3400 })],
  ['wettedAreaFt2', () => R.wettedAreaFt2({ orientation: 'horizontal', diameterFt: 10, lengthFt: 40, liquidLevelFt: 5 }), () => R.wettedAreaFt2({ orientation: 'slanted', diameterFt: 10, lengthFt: 40, liquidLevelFt: 5 })],
  ['fireHeatInput', () => R.fireHeatInput(PROBES.fireBare), () => R.fireHeatInput({ wettedFt2: 0 })],
  ['fireReliefLoad', () => R.fireReliefLoad({ qBtuHr: 4e6, latentBtuLb: 128 }), () => R.fireReliefLoad({ qBtuHr: 4e6, latentBtuLb: 0 })],
  ['dropoutVelocityFtS', () => R.dropoutVelocityFtS(PROBES.settleA), () => R.dropoutVelocityFtS({ ...PROBES.settleA, muVCp: 0 })],
  ['koDrumHorizontal', () => R.koDrumHorizontal(CONVENTION_PROBE), () => R.koDrumHorizontal({ ...CONVENTION_PROBE, diameterFt: 0 })],
  ['radiationIntensity', () => R.radiationIntensity(PROBES.pointSource), () => R.radiationIntensity({ ...PROBES.pointSource, distanceM: 0 })],
  ['distanceForIntensity', () => R.distanceForIntensity({ qKw: 50000, allowableKwM2: 4.73 }), () => R.distanceForIntensity({ qKw: 50000, allowableKwM2: 0 })],
  ['blowdown', () => R.blowdown(AFIESERE), () => R.blowdown({ ...AFIESERE, dtS: 0 })],
];

/** What each bare-number export returns, and what it returns when it refuses. */
export const BARE_NUMBER_PROBES = [
  ['gasConstantC', () => R.gasConstantC(1.4), () => R.gasConstantC(1.0)],
  ['criticalPressureRatio', () => R.criticalPressureRatio(1.4), () => R.criticalPressureRatio(1.0)],
  ['subcriticalF2', () => R.subcriticalF2({ k: 1.3, r: 0.8 }), () => R.subcriticalF2({ k: 1.3, r: 1.0 })],
  ['liquidKvUnclamped', () => R.liquidKvUnclamped(1000), () => R.liquidKvUnclamped(0)],
  ['liquidKv', () => R.liquidKv(1000), () => R.liquidKv(0)],
  ['steamKn', () => R.steamKn(2000), () => R.steamKn(3400)],
  ['segmentAreaFraction', () => R.segmentAreaFraction(0.5), () => R.segmentAreaFraction(1.5)],
];

/** The return shape of one value, measured rather than declared. */
export const returnShape = (v) => {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'object') return v.error ? 'object with an error' : 'object';
  if (typeof v === 'number') return Number.isNaN(v) ? 'NaN' : (Number.isFinite(v) ? 'a finite number' : 'a non-finite number');
  return typeof v;
};

/** The census: every route's accepted and refused shape, measured. */
export const contractCensus = () => ({
  objectRoutes: CONTRACT_PROBES.map(([name, ok, bad]) => ({
    name, accepted: returnShape(ok()), refused: returnShape(bad()),
  })),
  bareNumberRoutes: BARE_NUMBER_PROBES.map(([name, ok, bad]) => ({
    name, accepted: returnShape(ok()), refused: returnShape(bad()),
  })),
});

// ---------------------------------------------------------------------------
// SECTION 27. What is computed, what is typed, and what is never checked.
// ---------------------------------------------------------------------------

export const HELD_MARKER = 'HELD FOR LITERATURE';
/** A published chart or table the caller types in, with its reference named. */
export const TYPED_MARKER = 'TYPED, a published input';
/** A limit the caller applies, which the engine states and never enforces. */
export const LIMIT_MARKER = 'a stated LIMIT the caller applies';

/**
 * WHAT THIS COURSE DOES NOT DERIVE, AND WHICH KIND OF NOT-DERIVED EACH ONE IS.
 *
 * NINE items are on this list: SIX held for literature, TWO typed and ONE
 * stated limit. Digest section 27 splits every figure in the module into
 * COMPUTED, TYPED and HELD FOR LITERATURE, with the 25 ft limit on a row of its
 * own, and the Expert tier teaches that split as the point of its audit module.
 * Every count below is the count of one kind, and the course page, the lessons
 * of all three tiers and the digest's audit table all use the same split, so a
 * learner meets one set of words for it (FC5 repair).
 *
 * The three kinds, in the digest's own words:
 *   HELD FOR LITERATURE   nothing in this package checks it by any independent
 *                         route, so nothing here would notice if it drifted.
 *   TYPED                 a published chart or table taken as an input by
 *                         design, arriving with its reference named. Nothing
 *                         derives it and nothing should.
 *   a stated LIMIT        a limit the caller applies. The engine states it and
 *                         cannot enforce it, because what it depends on is
 *                         never passed in.
 *
 * TWO OF THE HELD SIX ARE SHARED WITH THE VALIDATION ORACLE ON PURPOSE, and
 * that is the sharpest thing in the audit. The Kv fit's inverse-three-halves
 * coefficient and the sphere-drag correlation are written into both the engine
 * and its oracle, so moving either in both files leaves every published case
 * green. The FC5-0 battery reports GREEN on both and CALLS THAT THE FINDING
 * rather than a pass, and `sharedWithTheOracle` is true on exactly those two. A
 * panel that presented either as validated would be teaching the opposite of
 * the lesson.
 *
 * Every one of the nine, whatever its kind, is taught as a limit and never as
 * an answer, and no graded field in this course reads any of them.
 */
export const NOT_DERIVED_KINDS = ['held', 'typed', 'limit'];

export const HELD_ITEMS = [
  {
    id: 'kv-fit-coefficients',
    kind: 'held',
    section: 27,
    sharedWithTheOracle: true,
    title: 'The three coefficients of the Kv viscosity fit',
    note: `${HELD_MARKER}: an empirical fit no route in this package can derive, and the validation oracle SHARES it on purpose and says so in its own header. Moving a coefficient in both files leaves every published case green, so a green run is evidence about the sharing rather than about the fit. Section 6 prints what each of its three terms is worth as a fraction of the sum across a Reynolds sweep, which is how the band is computed rather than asserted. Taught as a limit and never as an answer, and nothing graded in this course rests on it.`,
  },
  {
    id: 'sphere-drag-correlation',
    kind: 'held',
    section: 27,
    sharedWithTheOracle: true,
    title: 'The sphere-drag correlation and its low-Reynolds cap',
    note: `${HELD_MARKER}: the same class and the same reason. Its terms and its cap are an empirical fit, the oracle shares it deliberately, and the FC5-0 battery reports that sharing as its own finding rather than as a pass. Taught as a limit and never as an answer, and nothing graded in this course reads it.`,
  },
  {
    id: 'napier-boundaries',
    kind: 'held',
    section: 27,
    sharedWithTheOracle: false,
    title: 'The Napier threshold and the top of the published range',
    note: `${HELD_MARKER}: published BOUNDARIES. This package can derive neither, and the suite pins both as behaviour. The FIT between them is checked against the standard's own SI statement. Taught as a limit and never as an answer.`,
  },
  {
    id: 'pool-fire-constants-and-exponent',
    kind: 'held',
    section: 27,
    sharedWithTheOracle: false,
    title: 'The two pool fire constants and the published exponent',
    note: `${HELD_MARKER}: the oracle checks the USC pair against the published SI pair with the exponent carried through the unit conversion, which checks the UNIT PACKAGING rather than the pool-fire physics. Taught as a limit and never as an answer, and nothing graded in this course reads a fire duty or a fire relief load.`,
  },
  {
    id: 'customary-allowable-intensities',
    kind: 'held',
    section: 27,
    sharedWithTheOracle: false,
    title: 'The four customary allowable radiant intensities and their labels',
    note: `${HELD_MARKER}: the values are customary and the wording is this package's own. No publication in this repository checks either. Two engines export the identical table and a test asserts they stay equal, so one learner cannot meet two sets of words for one published table. Taught as a limit and never as an answer, and the setback that reads them belongs to a merged sibling course.`,
  },
  {
    id: 'settling-coefficient-packaging',
    kind: 'held',
    section: 27,
    sharedWithTheOracle: false,
    title: 'Whether the standard prints 1.15 or the exact four thirds',
    note: `${HELD_MARKER}: no copy of the standard is in this repository, so nothing here can check which form it prints. The engine evaluates the BALANCE, which is the derivation both forms come from, and section 17 MEASURES the coefficient out of the returned pair rather than typing either form. Taught as a limit and never as an answer.`,
  },
  {
    id: 'typed-charts-kb-kw-ksh',
    kind: 'typed',
    section: 27,
    sharedWithTheOracle: false,
    title: 'Kb for gas, Kw for liquid and KSH for steam',
    note: `${TYPED_MARKER}: published CHARTS and TABLES, so they arrive as inputs by design with their references named. Nothing derives them and nothing should, which is what separates a typed figure from a held one: a typed figure is a reading somebody took, and the question to ask of it is what condition it was read at. Taught as a limit and never as an answer.`,
  },
  {
    id: 'api-526-orifice-table',
    kind: 'typed',
    section: 27,
    sharedWithTheOracle: false,
    title: 'The API 526 orifice table, fourteen rows',
    note: `${TYPED_MARKER}: a published TABLE of fourteen areas. This package cannot derive a single one of them, so what the suite checks is the SELECTION BEHAVIOUR: the ladder, both selection boundaries and the refusal past the largest. Taught as a limit and never as an answer, and nothing graded in this course is an orifice letter or a margin.`,
  },
  {
    id: 'wetted-height-limit',
    kind: 'limit',
    section: 27,
    sharedWithTheOracle: false,
    title: 'The 25 ft wetted-height limit',
    note: `${LIMIT_MARKER}: where that height falls depends on a plot elevation the engine is never told, so the truncation is the caller's job and the engine can only state it. It arrives as a note on every fire duty. Taught as a limit and never as an answer.`,
  },
];

/** The two model decisions section 27 states rather than holds. */
export const STATED_MODEL_DECISIONS = [
  {
    id: 'kv-clamp',
    title: 'The Kv correction is clamped at one',
    note: 'A stated CONVENTION of this engine rather than a derivation. The unclamped fit is exported so the asymptote stays inspectable, and the suite pins the clamp.',
  },
  {
    id: 'constant-z-and-choked-throughout',
    title: 'A constant compressibility along the blowdown path, and choked flow throughout',
    note: 'Two stated model decisions. The oracle makes the same two deliberately, so what the published set checks is the march and not the thermodynamics, and the engine names the pressure below which the choked half stops holding.',
  },
  {
    id: 'heads-ignored',
    title: 'The heads are ignored in the wetted area',
    note: 'A stated model decision, conservative for the shell term and standard screening practice. Nothing checks it and nothing needs to.',
  },
];

/** Section 27, for a panel that wants the marked list. */
export const heldItems = () => ({
  marker: HELD_MARKER,
  typedMarker: TYPED_MARKER,
  limitMarker: LIMIT_MARKER,
  items: HELD_ITEMS.map((h) => ({ ...h })),
  decisions: STATED_MODEL_DECISIONS.map((d) => ({ ...d })),
  // THE COUNTS SAY PLAINLY WHAT EACH ONE COUNTS. `notDerivedHereCount` is the
  // whole list. `heldCount` is the strict sense the digest's audit table uses
  // and the Expert tier teaches: nothing in this package checks it.
  notDerivedHereCount: HELD_ITEMS.length,
  heldCount: HELD_ITEMS.filter((h) => h.kind === 'held').length,
  typedCount: HELD_ITEMS.filter((h) => h.kind === 'typed').length,
  statedLimitCount: HELD_ITEMS.filter((h) => h.kind === 'limit').length,
  heldIds: HELD_ITEMS.filter((h) => h.kind === 'held').map((h) => h.id),
  typedIds: HELD_ITEMS.filter((h) => h.kind === 'typed').map((h) => h.id),
  statedLimitIds: HELD_ITEMS.filter((h) => h.kind === 'limit').map((h) => h.id),
  sharedWithTheOracleCount: HELD_ITEMS.filter((h) => h.sharedWithTheOracle).length,
  decisionCount: STATED_MODEL_DECISIONS.length,
});

/** Digest section 27. The audit, with the measured figures beside it. */
export const theAudit = () => {
  const c = moduleConstants();
  const steam = steamNapier();
  const p1 = relievingPsia(ORUBIRI.setPsig, ORUBIRI.overpressurePct);
  const oruCall = {
    wLbHr: ORUBIRI.wLbHr, p1Psia: p1, tR: ORUBIRI.tF + 459.67,
    mw: ORUBIRI.mw, z: ORUBIRI.z, k: ORUBIRI.k, kd: ORUBIRI.kd, kc: ORUBIRI.kc,
  };
  const subcriticalKbs = [1.0, 0.72, 0.5].map((kb) => R.gasVaporArea({ ...oruCall, p2Psia: 0.8 * p1, kb }).areaIn2);
  return {
    computed: [
      { quantity: 'the gas coefficient C', measured: c.gasLeadingConstant, checkedBy: 'the oracle derives the isentropic nozzle mass flux in absolute SI' },
      { quantity: 'the critical pressure ratio', measured: R.criticalPressureRatio(ORUBIRI.k), checkedBy: 'the oracle finds it as the argmax of that flux by golden-section search' },
      { quantity: 'the subcritical leading constant', measured: c.subcriticalLeadingConstant, checkedBy: 'the oracle integrates the subcritical nozzle flux from the isentropic expansion' },
      { quantity: 'the liquid leading constant', measured: c.liquidLeadingConstant, checkedBy: 'the oracle checks it against the published SI form' },
      { quantity: 'the liquid Reynolds constant', measured: c.liquidReynoldsConstant, checkedBy: 'the oracle derives it from rho u D over mu in SI' },
      { quantity: 'the steam leading constant', measured: c.steamLeadingConstant, checkedBy: 'the oracle checks it against the published SI form' },
      { quantity: 'the crossing back through unity', measured: R.NAPIER_UNITY_PSIA, checkedBy: 'it falls out of the fit the oracle checks, and the engine exports it' },
      { quantity: 'the solid angle in the point source', measured: c.solidAngle, checkedBy: 'the oracle finds the sphere area by quadrature and the inverse by bisection on it' },
      { quantity: 'the universal gas constant', measured: c.universalGasConstant, checkedBy: 'the oracle uses the SI gas constant in its closed form' },
    ],
    held: HELD_ITEMS.map((h) => ({ ...h })),
    decisions: STATED_MODEL_DECISIONS.map((d) => ({ ...d })),
    // TWO INPUTS THAT CHANGE NOTHING, and why each is different.
    inputThatChangesNothing: {
      subcriticalKbAreas: subcriticalKbs,
      allEqual: subcriticalKbs.every((a) => a.toFixed(12) === subcriticalKbs[0].toFixed(12)),
      why: 'the standard uses F2 there and Kb has no place in it, and the engine says so in a warning',
    },
    inputThatAlwaysDivides: {
      kshOne: steam.stream.areaIn2,
      kshSuperheated: steam.superheated.areaIn2,
      areaRatioDerived: steam.superheatRatioDerived,
      factorRatioDerived: 1 / TEBIDABA_SUPERHEAT_KSH,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 28. What the published cases can and cannot discriminate.
// ---------------------------------------------------------------------------

/** Digest section 28. */
export const publishedCaseReach = () => {
  const counts = goldenCounts();
  return {
    oracleRoutes: [
      { route: 'gas, critical', oracle: 'the isentropic nozzle mass flux from R, M, T and P in absolute SI', independent: true },
      { route: 'gas, subcritical', oracle: 'the subcritical nozzle flux integrated from the isentropic expansion', independent: true },
      { route: 'the critical ratio', oracle: 'the argmax of that flux over the throat ratio, by golden-section search', independent: true },
      { route: 'liquid area', oracle: 'the published SI form of the same equation', independent: true },
      { route: 'the liquid Reynolds relation', oracle: 'rho u D over mu in SI with D as the square root of four A over pi', independent: true },
      { route: 'the Kv fit', oracle: 'nothing: SHARED with the engine on purpose', independent: false },
      { route: 'steam area', oracle: 'the published SI form and the SI statement of Napier', independent: true },
      { route: 'the fire duty', oracle: 'the published SI pair with the exponent carried through the unit conversion', independent: 'the unit packaging only' },
      { route: 'the relief load', oracle: 'every unit packaging, through kW and kg a second', independent: true },
      { route: 'wetted area, both orientations', oracle: 'polyline summation round the real circle with Richardson extrapolation', independent: true },
      { route: 'droplet settling', oracle: 'bisection on the force residual in SI', independent: 'the balance only' },
      { route: 'the drag correlation', oracle: 'nothing: SHARED with the engine on purpose', independent: false },
      { route: 'the knockout drum', oracle: 'Simpson quadrature of the segment integral, and a transit time against a fall time, in SI', independent: true },
      { route: 'point-source radiation, both directions', oracle: 'the sphere area by quadrature, and the inverse by bisection on that quadrature', independent: true },
      { route: 'the blowdown march', oracle: 'the same march solved in CLOSED FORM in SI', independent: true },
    ],
    cannotDiscriminate: HELD_ITEMS.filter((h) => h.sharedWithTheOracle).map((h) => h.id),
    counts,
    blocks: counts.blocks,
    rows: counts.rows,
  };
};

// ---------------------------------------------------------------------------
// SECTION 29. THE ONE FRAMED HISTORY SECTION. Everything above this line is
// what the engine does NOW.
// ---------------------------------------------------------------------------

/**
 * The counting rule for the engine's own history comment lines. A line that
 * begins with a comment marker and carries one of these phrases is a sentence
 * about former behaviour, and a sentence lifted out of one arrives with NO
 * FRAME around it. The walk over the vendored source is the test's, because a
 * browser module cannot read a directory.
 */
export const HISTORY_COMMENT_RE = /^\s*(\*|\/\/).*(used to|previous version|before|no longer|turned|silently)/;

/** The repair marker the engine's own comments carry. */
export const HISTORY_MARKER = 'FC5-0';

export const countHistoryComments = (text) => text.split('\n').filter((l) => HISTORY_COMMENT_RE.test(l)).length;
export const countHistoryMarkers = (text) => text.split('\n').filter((l) => /^\s*(\*|\/\/)/.test(l) && l.includes(HISTORY_MARKER)).length;

/**
 * Digest section 29, the one framed history reader. Every item is a GENERAL
 * LESSON that happens to have an example in this engine, and every "before"
 * below is labelled as one. The evidence column is what the engine returns
 * TODAY, so a reader can see the repair rather than take it on trust.
 */
export const repairHistory = () => {
  const step = stepStudy();
  const drum = knockoutDrum();
  const march = blowdownMarch();
  return {
    framedBy: 'digest section 29, whose own title and first line say it is repair history, and nothing follows it',
    items: [
      {
        id: 'output-that-read-as-reassurance',
        lesson: 'the worst failure of a calculation is not a wrong number, it is a wrong number shaped like the answer somebody wanted',
        formerBehaviour: 'a first march step that would have removed more mass than the vessel held broke the loop with the clock still at zero, so the function returned a time of zero seconds with the vessel still at its start pressure and no error key',
        evidenceToday: step.hardGeometryRows.map((r) => ({
          label: r.label, timeS: r.timeS, finalPPsia: r.finalPPsia, substeps: r.substeps,
        })),
      },
      {
        id: 'input-that-could-not-move-its-answer',
        lesson: 'two factors that cancel algebraically leave a box a user will turn while nothing happens, and the test for it is one sweep across the whole range with the spread printed',
        formerBehaviour: 'the drum used the same factor for the vapour cross-section and for the fall distance and the two cancelled exactly, so the holdup moved the required length by less than a millionth of a millionth of a foot',
        evidenceToday: {
          lengthSpreadFt: drum.lengthSpread.spreadFtDerived,
          minLengthFt: drum.lengthSpread.minFt,
          maxLengthFt: drum.lengthSpread.maxFt,
        },
      },
      {
        id: 'constant-applied-twice',
        lesson: 'a number applied twice is invisible on the answer and visible only in a ratio, so the way to find one is to rebuild the quantity from first principles and divide',
        formerBehaviour: 'the blowdown mass flow multiplied the caller\'s discharge coefficient by a second hard-coded coefficient of its own',
        evidenceToday: {
          marchedS: march.timeS,
          closedFormS: march.closedFormS,
          ratioDerived: march.closedFormRatioDerived,
        },
      },
      {
        id: 'gate-that-could-not-fail',
        lesson: 'a validation case is only worth what it can tell apart, and it can be worth nothing two separate ways: missing, or present and sitting where the constant it checks is worth less than the tolerance',
        formerBehaviour: 'twenty planted defects left the published suite green in seven cases, three routes had no case and no oracle route at all, and five oracle routes were transcriptions of the engine rather than independent derivations',
        evidenceToday: {
          blocks: goldenCounts().blocks,
          rows: goldenCounts().rows,
          namedAsSharedWithTheOracle: HELD_ITEMS.filter((h) => h.sharedWithTheOracle).length,
        },
      },
    ],
  };
};

// ---------------------------------------------------------------------------
// THE GRADED TOLERANCES ARE A READ OF ONE DERIVATION, NEVER A COPY.
// ---------------------------------------------------------------------------

/**
 * The eighteen graded tolerances, DERIVED by gradedTolerance.js and not held
 * here. This function contains no tolerance and no field value: it maps the
 * derivation's own field list through the derivation's own rule, so a lab and a
 * grader cannot disagree. FC2 and FC3 each shipped a stale hand-kept third copy
 * of these eighteen numbers inside their lab, and only the lab test caught it.
 * There is nothing here to go stale.
 */
export const gradedToleranceTable = () => GRADED_FIELDS.map(([tier, key, cls]) => ({
  tier, key, cls, printedDecimals: PRINTED_DECIMALS[cls], tolerance: gradedTolerance(key),
}));

/** The count, so a field list that loses a row is caught by arithmetic. */
export const gradedFieldCount = () => GRADED_FIELDS.length;

// ---------------------------------------------------------------------------
// THE TEACHING SURFACE, DECLARED. The leak gate walks every reader named here
// and the test asserts the list is the whole teaching surface, so a reader
// added without being declared fails rather than escaping the sweep.
// ---------------------------------------------------------------------------

export const TEACHING_READERS = [
  'engineScope', 'moduleConstants', 'pressureLadder', 'gasBranch', 'gasPublished',
  'liquidLoop', 'liquidPublished', 'steamNapier', 'steamPublished', 'orificeLadder',
  'associateReading', 'wettedGeometry', 'wettedPublished', 'fireDuty', 'firePublished',
  'fireCase', 'dropletSettling', 'knockoutDrum', 'dropoutDrumPublished', 'professionalReading',
  'blowdownMarch', 'depressuringTime', 'stepStudy', 'blowdownPublished', 'pointSource',
  'refusalContract', 'contractCensus', 'theAudit', 'publishedCaseReach', 'repairHistory',
  'heldItems', 'goldenCounts', 'gradedToleranceTable',
];

/**
 * Every number a reader can reach, walked. The leak gate uses this to compare
 * the whole teaching surface against the graded answers numerically, which is
 * what catches a rendering no string matcher was told to look for.
 */
export const collectNumbers = (v, keyPath = '', out = [], depth = 0) => {
  if (depth > 12) return out;
  if (typeof v === 'number') {
    if (Number.isFinite(v)) out.push({ keyPath, value: v });
    return out;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => collectNumbers(x, `${keyPath}[${i}]`, out, depth + 1));
    return out;
  }
  if (v && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => collectNumbers(x, keyPath ? `${keyPath}.${k}` : k, out, depth + 1));
  }
  return out;
};
