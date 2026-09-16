// Teaching lab for FC2, Line Sizing & Hydraulics. The three panels, the course
// page and the vitest files all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every velocity, Reynolds
// number, friction factor, pressure drop, gradient, transmission rate,
// elevation factor, outlet pressure, station, wall, rating, line volume, swept
// volume, run time and interval below is a return value of
// engines/facilities/lineHydraulics.js (the Pipeline & Line Sizing Studio),
// engines/production/chokePerformance.js (the API RP 14E erosional limit) or
// engines/production/pipeSchedule.js (the bores, the roughness catalogue and
// the fitting resistances), as repaired in FC2-0.
//
// NOTHING IN THIS FILE COMPUTES A LINE-SIZING QUANTITY. Where a reader carries
// a value the teaching digest calls "derived", it is the digest's own
// arithmetic on numbers the engine returned, with the arithmetic stated, and
// the key name says Derived: a driving group from two pressures, a share of a
// total from two losses, a ratio of two rates, a diameter exponent from two
// rates, a bracket ceiling from an inlet and an engine's own elevation factor,
// and the constants the module keeps to itself (seven of its units, and the
// three of the two friction laws), each MEASURED by asking the engine a
// question about itself rather than typed. The lab and
// /root/fc-wip-linesizing/digest.txt agree because both call the engines on the
// same inputs, not because either copied the other.
//
// UNITS. Field units throughout: bpd for liquid, scfd for gas, inches of bore,
// FEET of length for liquid work and MILES for gas work (the unit the published
// transmission forms are stated in), psia, degR, lb per ft3, cp. Ratios and
// fractions are plain numbers.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// belongs anywhere in it.
//
// THE CLOCK. Nothing in this domain reads a clock or a random number. There is
// no date input, no seed and no default that falls back to today, so every
// reader is a pure function of its engine inputs. A clock gate in
// linesizingLab.test.js proves it under two faked system dates anyway, and a
// timezone gate rebuilds the whole digest a second time west of Greenwich.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

import golden from '@petrolord/engines/test-data/facilities/goldens/linehydraulics_cases.json';
// Namespaces, not named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which predate the
// FC2-0 repairs and carry a different facilities surface. Vite and vitest alias
// @petrolord/engines to this worktree's packages/engines, which is the repaired
// one. import/namespace still checks members against the shared copy, so it is
// off for this file only; linesizingLab.test.js proves every member resolves by
// rebuilding the whole digest out of them.
/* eslint-disable import/namespace */
import * as H from '@petrolord/engines/engines/facilities/lineHydraulics.js';
import * as C from '@petrolord/engines/engines/production/chokePerformance.js';
import * as P from '@petrolord/engines/engines/production/pipeSchedule.js';

export const G = golden;

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a line-sizing quantity.
// ---------------------------------------------------------------------------

/**
 * A state the method has no answer for. This engine throws nothing: every
 * refusal is a returned object carrying an `error` string, so a caller checks a
 * property rather than catching. The MESSAGE is never written in this file; it
 * comes back from the engine, and a gate in the test file asserts that no
 * refusal message appears as a literal anywhere in this source.
 */
const softOf = (r) => (r && r.error ? r.error : null);

/** The whole return, so a panel can show the SHAPE and not only the number. */
const shapeOf = (r) => JSON.parse(JSON.stringify(r === undefined ? null : r));

export const goldenCounts = () => Object.fromEntries(
  Object.entries(golden).map(([k, v]) => [k, v.length]),
);

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from /root/fc-wip-linesizing/fc2_fields.mjs.
// The OGBIA crude export line, the SOKU gas trunk and the OGBIA pigging duty.
// None of them is a golden case and none of them is graded anywhere.
// ---------------------------------------------------------------------------

/** The duty, at the bore the line was actually built in (NPS 8 sch 40). */
export const OGBIA = {
  qBpd: 12000,
  idIn: 7.981,
  lengthFt: 26400,
  elevChangeFt: 0,
  rhoLbFt3: 54.5,
  muCp: 2.5,
  roughnessIn: 0.0018,
  sumK: 0,
};

/** The same line with the fittings the isometric actually carries: four
 *  long radius elbows, two gate valves, one swing check and the exit into
 *  the tank. The sum is built from the pipe schedule's own K table, never
 *  typed, so the digest can print both the count and the sum. */
export const OGBIA_FITTINGS = [
  { id: 'elbow90LR', count: 4 },
  { id: 'gateValve', count: 2 },
  { id: 'swingCheck', count: 1 },
  { id: 'suddenExit', count: 1 },
];

/** The bores a sizing sweep runs over: every row of the vendored schedule. */
export const OGBIA_SWEEP_MAX_V_FT_S = 6;

/** Two roughnesses, so a lesson can separate the pipe from the fluid. */
export const OGBIA_ROUGHNESS_IDS = ['commercialSteel', 'steelUsed', 'internallyCoated', 'hdpe'];

/** The ridge the line crosses, as three segments of a profile. */
export const OGBIA_PROFILE = [
  { lengthFt: 8800, elevChangeFt: 420 },
  { lengthFt: 8800, elevChangeFt: 0 },
  { lengthFt: 8800, elevChangeFt: -420 },
];
export const OGBIA_PROFILE_FLAT = [
  { lengthFt: 8800, elevChangeFt: 0 },
  { lengthFt: 8800, elevChangeFt: 0 },
  { lengthFt: 8800, elevChangeFt: 0 },
];
export const OGBIA_P1_PSIA = 900;

/** A viscosity sweep that walks the line from turbulent, through the band
 *  the engine has no correlation for, into laminar, on one bore. */
export const OGBIA_VISCOSITY_SWEEP_CP = [1, 2.5, 5, 10, 20, 30, 40, 60, 120];

/** The rates that put the SAME line either side of Re 2100 and Re 4000. */
export const OGBIA_REGIME_PROBE_RE = [1500, 2099, 2100, 2500, 3000, 3999, 4000, 5000];

export const SOKU = {
  p1Psia: 850,
  p2Psia: 620,
  idIn: 11.938,
  lengthMi: 32,
  sg: 0.67,
  tAvgR: 535,
  zAvg: 0.885,
  efficiency: 1,
  elevChangeFt: 0,
};

/** The same trunk climbing to a ridge station and descending to a terminal. */
export const SOKU_UP_FT = 1500;
export const SOKU_DOWN_FT = -1500;
/** A descent steep enough that the outlet pressure is ABOVE the inlet. */
export const SOKU_STEEP_DOWN_FT = -3000;
/** How far ABOVE the inlet that descent puts the outlet, in psi. */
export const SOKU_STEEP_DOWN_ABOVE_INLET_PSI = 30;
/** The CONTROL for the same descent: an outlet genuinely BELOW the inlet, so
 *  the inverse solve has its answer inside the bracket and a round trip that
 *  succeeds can be told apart from one that merely stopped at the bracket. */
export const SOKU_STEEP_DOWN_P2_PSIA = 700;

/** The same trunk CLIMBING steeply. A climb is the other half of the outlet
 *  bracket: the static column costs head the rate never gets back, so the
 *  outlet cannot reach the inlet at ANY rate. */
export const SOKU_STEEP_UP_FT = 3000;
/** A modest rate for that climb, well inside what the trunk can carry, so the
 *  outlet lands just under the ceiling rather than against it. */
export const SOKU_STEEP_UP_SCFD = 20e6;
/** A near-atmospheric inlet on the same climb, where the column alone spends
 *  more than the line has and there is no outlet at any rate at all. */
export const SOKU_STARVED_P1_PSIA = 15.5;

/** EITHER SIDE OF A GUARD. Each pair is handed to the engine and the engine
 *  says which it took, so a boundary is read rather than asserted. */
export const SUM_K_AT_LIMIT = 0;
export const SUM_K_JUST_UNDER = -0.000001;
export const ROUGHNESS_AT_LIMIT = 0;
export const ROUGHNESS_JUST_UNDER = -0.000001;
export const EFFICIENCY_AT_LIMIT = 1;
export const EFFICIENCY_JUST_OVER = 1.000001;
export const HOLDUP_AT_LIMIT = 1;
export const HOLDUP_JUST_OVER = 1.000001;
export const ALLOWANCE_AT_LIMIT = 0;
export const ALLOWANCE_JUST_UNDER = -0.000001;
export const SWEPT_AT_LIMIT = 0;
export const SWEPT_JUST_UNDER = -0.000001;
/** A line exactly as tall as it is long is vertical and legal; taller is not
 *  a line. */
export const VERTICAL_RUN_FT = 100;
export const TALLER_THAN_LONG_FT = 100.000001;
/** One mile, for recovering the feet in a mile out of the elevation guard. */
export const MILE_PROBE_LENGTH_MI = 1;

/** An efficiency sweep. E is an unsourced multiplier and is HELD. */
export const SOKU_EFFICIENCY_SWEEP = [0.85, 0.9, 0.95, 1];

/** The bores a trunk sweep runs over, and the rate it has to carry. */
export const SOKU_TARGET_SCFD = 60e6;

/** A line that is almost dead, and one that is dead. */
export const SOKU_NEARLY_DEAD_P2_PSIA = 845;
export const SOKU_DEAD_P2_PSIA = 900;

export const SOKU_WALL = {
  designPsig: 1200,
  odIn: 12.75,
  smysPsi: 52000,
  jointFactor: 1,
  tempDerate: 1,
  corrosionAllowanceIn: 0.125,
};
export const SOKU_WALL_CLASSES = [1, 2, 3, 4];
/** The joint factor and the temperature derate, one at a time. */
export const SOKU_JOINT_FACTORS = [0.6, 0.8, 1];
export const SOKU_TEMP_DERATES = [0.867, 0.9, 0.967, 1];
/** The wall the mill actually rolled, for the MAOP reading. */
export const SOKU_WALL_AS_BUILT_IN = 0.375;

export const OGBIA_PIG = {
  idIn: 7.981,
  lengthFt: 26400,
  pigSpeedFtS: 3,
};
export const OGBIA_HOLDUP_SWEEP = [0, 0.02, 0.04, 0.06, 0.1, 0.2, 0.5, 1];
export const OGBIA_HOLDUP_NOMINAL = 0.06;
export const OGBIA_CATCHER_BBL = 250;
export const OGBIA_DROPOUT_BPD = 40;
/** A catcher the sweep alone already overfills. */
export const OGBIA_SMALL_CATCHER_BBL = 60;

export const EROSIONAL_C_IDS = ['continuous', 'intermittent', 'cleanInhibited'];
/** An id the table does not carry, for the fallback reading. */
export const EROSIONAL_UNKNOWN_ID = 'sandLaden';
/** Four fluids from wet gas to water, so the density term is visible. */
export const EROSIONAL_DENSITY_SWEEP = [5, 20, 45, 62.4];

/** A manifold run: the same duty and the same fittings over a short pipe. */
export const OGBIA_MANIFOLD_LENGTH_FT = 300;
/** Flat, up and down by the same amount. */
export const OGBIA_ELEVATION_SWEEP_FT = [0, 420, -420];
/** The line that dies: a duty far too large for its bore. */
export const OGBIA_DEAD_LINE = {
  p1Psia: 100, qBpd: 20000, idIn: 2.067, lengthFt: 20000, rhoLbFt3: 56, muCp: 8,
};
/** Either side of the branch the engine draws, one unit apart. */
export const RE_JUST_BELOW_BRANCH = 2099.9999999;
export const RE_AT_BRANCH = 2100;
/** The inputs that isolate each of the three friction-law constants. */
export const LAMINAR_PROBE_RE = 1000;
export const SMOOTH_PROBE_RE = 1e5;
export const FULLY_ROUGH_PROBE_RR = 0.01;
export const FULLY_ROUGH_PROBE_RE = 1e14;
/** The vertical axis of the Moody chart, read at two Reynolds numbers. */
export const RELATIVE_ROUGHNESS_SWEEP = [0, 1e-5, 1e-4, 3e-4, 1e-3, 3e-3, 1e-2, 5e-2];
export const RE_LOW_FOR_ROUGHNESS_TABLE = 1e5;
export const RE_HIGH_FOR_ROUGHNESS_TABLE = 1e8;
/** Colebrook was published to about 0.05; the last two are past it. */
export const COLEBROOK_DOMAIN_SWEEP = [0.01, 0.05, 0.1, 0.2, 0.5];
export const RE_FOR_DOMAIN_SWEEP = 1e6;
/** The nominal sizes the vendored schedule carries in two weights. */
export const SCHEDULE_PAIR_NPS = [2, 4, 6, 8];
/** Bores for the Weymouth friction reading. */
export const SOKU_BORE_SWEEP = [6.065, 7.981, 11.938, 15];
/** The speed the published pigging golden states its run hours at. */
export const GOLDEN_PIG_SPEED_FT_S = 5;

/**
 * The friction factor the equivalent-length measurement is taken at. It is an
 * INPUT to that call and it does not touch the resistance sum, which is the
 * only thing this course reads out of it.
 */
export const EQUIVALENT_LENGTH_PROBE_F = 0.018;

// ---------------------------------------------------------------------------
// The chain the Pipeline & Line Sizing Studio runs on a liquid line: bore to
// area to velocity, velocity to Reynolds, Reynolds and relative roughness to a
// friction factor, and then the three losses. Copied from the digest generator.
// ---------------------------------------------------------------------------

const liquidAt = (p, over = {}) => H.liquidLineDrop({ ...p, ...over });

const gasFormList = () => [
  ['weymouth', H.weymouthQ], ['panhandleA', H.panhandleAQ],
  ['panhandleB', H.panhandleBQ], ['general', H.generalFlowQ],
];

/** The form names, in the order every table in this course prints them. */
export const GAS_FORMS = ['weymouth', 'panhandleA', 'panhandleB', 'general'];

const ogbiaK = () => P.equivalentLengthFt({
  fittings: OGBIA_FITTINGS, idIn: OGBIA.idIn, frictionFactor: EQUIVALENT_LENGTH_PROBE_F,
});

const sokuRates = () => Object.fromEntries(gasFormList().map(([k, fn]) => [k, fn(SOKU)]));

/** The bore sweep section 5 and section 18 both read. */
const scheduleSweep = () => {
  const cFactor = C.erosionalC('continuous').c;
  return P.PIPE_SCHEDULE.map((row) => ({
    row: { ...row },
    r: liquidAt(OGBIA, { idIn: row.id }),
    chk: C.erosionalCheck({
      inSituBpd: OGBIA.qBpd, idIn: row.id, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor,
    }),
  }));
};

/**
 * Every state section 1 shows the method has no answer for. Each entry is the
 * label the digest uses and the engine call that earns the refusal.
 */
export const SOFT_STATE_PROBES = [
  { label: 'a liquid line with no rate', call: () => H.liquidLineDrop({ qBpd: 0, idIn: 6, lengthFt: 100, rhoLbFt3: 55, muCp: 1 }) },
  { label: 'a liquid line with a negative rate', call: () => H.liquidLineDrop({ qBpd: -5, idIn: 6, lengthFt: 100, rhoLbFt3: 55, muCp: 1 }) },
  { label: 'a liquid line with no bore', call: () => H.liquidLineDrop({ qBpd: 5000, idIn: 0, lengthFt: 100, rhoLbFt3: 55, muCp: 1 }) },
  { label: 'a liquid line with no length', call: () => H.liquidLineDrop({ qBpd: 5000, idIn: 6, lengthFt: 0, rhoLbFt3: 55, muCp: 1 }) },
  { label: 'a liquid line with no viscosity', call: () => H.liquidLineDrop({ qBpd: 5000, idIn: 6, lengthFt: 100, rhoLbFt3: 55, muCp: 0 }) },
  { label: 'a traverse with no profile', call: () => H.liquidLineTraverse({ p1Psia: 100, profile: [] }) },
  { label: 'a gas line whose outlet meets its inlet', call: () => H.weymouthQ({ p1Psia: 500, p2Psia: 600, idIn: 8, lengthMi: 10, sg: 0.65, tAvgR: 540, zAvg: 0.9 }) },
  { label: 'an outlet-pressure solve on an unknown equation', call: () => H.gasOutletPressure({ equation: 'cylindrical', qScfd: 1 }) },
  { label: 'an outlet-pressure solve with no rate', call: () => H.gasOutletPressure({ equation: 'weymouth', qScfd: 0, p1Psia: 1000, idIn: 8, lengthMi: 25, sg: 0.65, tAvgR: 540, zAvg: 0.87 }) },
  { label: 'an outlet-pressure solve the line cannot deliver', call: () => H.gasOutletPressure({ equation: 'weymouth', qScfd: 1e12, p1Psia: 1000, idIn: 8, lengthMi: 25, sg: 0.65, tAvgR: 540, zAvg: 0.87 }) },
  { label: 'a wall with no design pressure', call: () => H.requiredWallIn({ odIn: 8.625, smysPsi: 42000 }) },
  { label: 'a wall to a code that does not exist', call: () => H.requiredWallIn({ designPsig: 1000, odIn: 8.625, smysPsi: 42000, code: 'B99' }) },
  { label: 'a wall to a B31.8 location class that does not exist', call: () => H.requiredWallIn({ designPsig: 1000, odIn: 8.625, smysPsi: 42000, code: 'B31.8', locationClass: 9 }) },
  { label: 'a rating with no wall left after the allowance', call: () => H.maopPsig({ wallIn: 0.04, odIn: 8.625, smysPsi: 42000, corrosionAllowanceIn: 0.0625 }) },
  { label: 'a sweep with a holdup above one', call: () => H.sweptLiquidBbl({ idIn: 6, lengthFt: 100, holdupFrac: 1.4 }) },
  { label: 'a pig that does not move', call: () => H.pigRun({ lengthFt: 100, pigSpeedFtS: 0 }) },
  { label: 'an interval with no dropout', call: () => H.piggingInterval({ maxSlugBbl: 100, dropoutBpd: 0, sweptBbl: 10 }) },
  { label: 'an interval whose sweep already overfills the catcher', call: () => H.piggingInterval({ maxSlugBbl: 10, dropoutBpd: 25, sweptBbl: 50 }) },
];

/**
 * Every input section 16 shows has no physical meaning at all. These are the
 * inputs the FC2-0 repair wave gave a named refusal to; before it, each one
 * came back as a number, a NaN or an Infinity with no error key at all.
 */
export const REFUSAL_PROBES = [
  { label: 'a negative resistance sum', call: () => liquidAt(OGBIA, { sumK: SUM_K_JUST_UNDER }) },
  { label: 'a negative roughness', call: () => liquidAt(OGBIA, { roughnessIn: ROUGHNESS_JUST_UNDER }) },
  { label: 'a liquid line that rises further than its own length', call: () => H.liquidLineDrop({ ...OGBIA, lengthFt: VERTICAL_RUN_FT, elevChangeFt: TALLER_THAN_LONG_FT }) },
  { label: 'a traverse with no inlet pressure', call: () => H.liquidLineTraverse({ qBpd: OGBIA.qBpd, idIn: OGBIA.idIn, rhoLbFt3: OGBIA.rhoLbFt3, muCp: OGBIA.muCp, roughnessIn: OGBIA.roughnessIn, profile: OGBIA_PROFILE_FLAT }) },
  { label: 'a gas line at an efficiency above one', call: () => H.weymouthQ({ ...SOKU, efficiency: EFFICIENCY_JUST_OVER }) },
  { label: 'a gas line at a negative efficiency', call: () => H.weymouthQ({ ...SOKU, efficiency: -EFFICIENCY_AT_LIMIT }) },
  { label: 'a gas line of no length', call: () => H.weymouthQ({ ...SOKU, lengthMi: 0 }) },
  { label: 'a gas line of negative length', call: () => H.weymouthQ({ ...SOKU, lengthMi: -SOKU.lengthMi }) },
  { label: 'a gas line of negative bore', call: () => H.weymouthQ({ ...SOKU, idIn: -SOKU.idIn }) },
  { label: 'a gas at a compressibility of zero', call: () => H.weymouthQ({ ...SOKU, zAvg: 0 }) },
  { label: 'a gas at an absolute temperature of zero', call: () => H.weymouthQ({ ...SOKU, tAvgR: 0 }) },
  { label: 'a gas of no gravity', call: () => H.panhandleAQ({ ...SOKU, sg: 0 }) },
  { label: 'a gas line that rises further than its own length', call: () => H.weymouthQ({ ...SOKU, lengthMi: MILE_PROBE_LENGTH_MI, elevChangeFt: SOKU_STEEP_UP_FT * 10 }) },
  { label: 'General Flow with no gas viscosity', call: () => H.generalFlowQ({ ...SOKU, muCp: 0 }) },
  { label: 'General Flow at a negative roughness', call: () => H.generalFlowQ({ ...SOKU, roughnessIn: ROUGHNESS_JUST_UNDER }) },
  { label: 'an elevation group at a compressibility of zero', call: () => H.elevationAdjustment({ sg: SOKU.sg, elevChangeFt: SOKU_UP_FT, tAvgR: SOKU.tAvgR, zAvg: 0 }) },
  { label: 'a wall at a joint factor of zero', call: () => H.requiredWallIn({ ...SOKU_WALL, jointFactor: 0 }) },
  { label: 'a wall at a temperature derate of zero', call: () => H.requiredWallIn({ ...SOKU_WALL, tempDerate: 0 }) },
  { label: 'a wall with a negative corrosion allowance', call: () => H.requiredWallIn({ ...SOKU_WALL, corrosionAllowanceIn: ALLOWANCE_JUST_UNDER }) },
  { label: 'a rating with a negative corrosion allowance', call: () => H.maopPsig({ ...SOKU_WALL, wallIn: SOKU_WALL_AS_BUILT_IN, corrosionAllowanceIn: ALLOWANCE_JUST_UNDER }) },
  { label: 'a sweep with no bore', call: () => H.sweptLiquidBbl({ idIn: 0, lengthFt: OGBIA_PIG.lengthFt, holdupFrac: OGBIA_HOLDUP_NOMINAL }) },
  { label: 'a sweep of negative length', call: () => H.sweptLiquidBbl({ idIn: OGBIA_PIG.idIn, lengthFt: -OGBIA_PIG.lengthFt, holdupFrac: OGBIA_HOLDUP_NOMINAL }) },
  { label: 'an interval on a negative sweep', call: () => H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: SWEPT_JUST_UNDER }) },
  { label: 'an outlet solve on a climb the inlet cannot pay for', call: () => H.gasOutletPressure({ equation: 'weymouth', qScfd: SOKU_STEEP_UP_SCFD, ...SOKU, p1Psia: SOKU_STARVED_P1_PSIA, elevChangeFt: SOKU_STEEP_UP_FT }) },
];

/** Every guard section 16 reads from both sides. */
export const BOUNDARY_PROBES = [
  { label: 'the resistance sum', value: SUM_K_AT_LIMIT, call: () => liquidAt(OGBIA, { sumK: SUM_K_AT_LIMIT }) },
  { label: 'the resistance sum', value: SUM_K_JUST_UNDER, call: () => liquidAt(OGBIA, { sumK: SUM_K_JUST_UNDER }) },
  { label: 'the absolute roughness', value: ROUGHNESS_AT_LIMIT, call: () => liquidAt(OGBIA, { roughnessIn: ROUGHNESS_AT_LIMIT }) },
  { label: 'the absolute roughness', value: ROUGHNESS_JUST_UNDER, call: () => liquidAt(OGBIA, { roughnessIn: ROUGHNESS_JUST_UNDER }) },
  { label: 'the rise of a liquid line against its length', value: VERTICAL_RUN_FT, call: () => H.liquidLineDrop({ ...OGBIA, lengthFt: VERTICAL_RUN_FT, elevChangeFt: VERTICAL_RUN_FT }) },
  { label: 'the rise of a liquid line against its length', value: TALLER_THAN_LONG_FT, call: () => H.liquidLineDrop({ ...OGBIA, lengthFt: VERTICAL_RUN_FT, elevChangeFt: TALLER_THAN_LONG_FT }) },
  { label: 'the transmission efficiency', value: EFFICIENCY_AT_LIMIT, call: () => H.weymouthQ({ ...SOKU, efficiency: EFFICIENCY_AT_LIMIT }) },
  { label: 'the transmission efficiency', value: EFFICIENCY_JUST_OVER, call: () => H.weymouthQ({ ...SOKU, efficiency: EFFICIENCY_JUST_OVER }) },
  { label: 'the liquid holdup', value: HOLDUP_AT_LIMIT, call: () => H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: HOLDUP_AT_LIMIT }) },
  { label: 'the liquid holdup', value: HOLDUP_JUST_OVER, call: () => H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: HOLDUP_JUST_OVER }) },
  { label: 'the corrosion allowance', value: ALLOWANCE_AT_LIMIT, call: () => H.requiredWallIn({ ...SOKU_WALL, corrosionAllowanceIn: ALLOWANCE_AT_LIMIT }) },
  { label: 'the corrosion allowance', value: ALLOWANCE_JUST_UNDER, call: () => H.requiredWallIn({ ...SOKU_WALL, corrosionAllowanceIn: ALLOWANCE_JUST_UNDER }) },
  { label: 'the swept volume', value: SWEPT_AT_LIMIT, call: () => H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: SWEPT_AT_LIMIT }) },
  { label: 'the swept volume', value: SWEPT_JUST_UNDER, call: () => H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: SWEPT_JUST_UNDER }) },
];

/**
 * THE FIVE HELD QUANTITIES. Each is taught as a limit of the method and is
 * never an answer: no graded capstone field reads one, and every panel that
 * shows one shows this wording beside it. A gate in linesizingLab.test.js greps
 * the three panel sources for the marker and checks the capstone against each
 * held quantity.
 */
export const HELD_MARKER = 'HELD FOR LITERATURE';
export const HELD_ITEMS = [
  {
    id: 'rp14e-c-factors',
    title: 'The API RP 14E c factors',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: the three c factor rows. The recommended practice itself says its own figures are conservative, and the third row is labelled as operator practice with no publication behind it. Every graded erosional value in this course states its own c factor.',
  },
  {
    id: 'transmission-efficiency',
    title: 'The efficiency multiplier on all four gas forms',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: the efficiency factor. Three of the four forms carry it as a plain multiplier and General Flow carries it by the amounts the efficiency table derives, and no publication in this package stands behind any particular value of it. Every graded gas value in this course states its own efficiency.',
  },
  {
    id: 'transition-band',
    title: 'The band from Reynolds 2100 to 4000',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: the band where the engine computes on the turbulent branch and labels the answer transitional. No honest correlation exists there, and the step across the boundary is a discontinuity rather than a physical event.',
  },
  {
    id: 'weymouth-friction',
    title: 'The fully rough friction law Weymouth assumes',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: the friction law hidden inside the Weymouth constant. Section 15 measures it out of the engine by asking General Flow what friction factor would make it agree, and nothing sources it to a publication.',
  },
  {
    id: 'synthetic-goldens',
    title: 'The published cases are synthetic',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: the published cases in this golden come from an independent oracle written in Python from the same physics, in SI units where the engine works in field units, which catches an arithmetic or a unit error and cannot catch a method that is wrong in both files. No measured pipeline is in this course.',
  },
];

// ---------------------------------------------------------------------------
// SECTION 1. What the engine sizes, and what it refuses.
// ---------------------------------------------------------------------------

export const engineScope = () => {
  const og = liquidAt(OGBIA);
  const gcProbe = liquidAt(OGBIA, { sumK: 1 });
  const volume = H.lineVolumeBbl({ idIn: OGBIA.idIn, lengthFt: OGBIA.lengthFt });
  const areaDerivedFt2 = (Math.PI * OGBIA.idIn * OGBIA.idIn) / (4 * 144);
  const cuftPerBblDerived = (areaDerivedFt2 * OGBIA.lengthFt) / volume;
  const pig = H.pigRun(OGBIA_PIG);

  // The feet in a mile, recovered by halving between a rise the engine accepts
  // on a one mile line and a rise it refuses. The constant is not typed: the
  // engine is asked where its own elevation guard begins.
  const guardMessage = H.weymouthQ({
    ...SOKU, lengthMi: MILE_PROBE_LENGTH_MI, elevChangeFt: 1e9,
  }).error;
  const accepts = (dz) => H.weymouthQ({
    ...SOKU, lengthMi: MILE_PROBE_LENGTH_MI, elevChangeFt: dz,
  }).error !== guardMessage;
  let lo = 0;
  let hi = 1e6;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (mid === lo || mid === hi) break;
    if (accepts(mid)) lo = mid; else hi = mid;
  }

  // Atmospheric, the FLOOR of the outlet-pressure bracket. The module does not
  // export it, so it is measured the way the mile is: push the requested rate
  // up until the solve refuses, and the outlet it converges on at the largest
  // rate it still accepts is the floor itself.
  const bracketAt = (q) => H.gasOutletPressure({ equation: 'weymouth', qScfd: q, ...SOKU });
  let bLo = 1e6;
  let bHi = 1e12;
  for (let i = 0; i < 200; i += 1) {
    const mid = (bLo + bHi) / 2;
    if (bracketAt(mid).error) bHi = mid; else bLo = mid;
  }
  const floorPsia = bracketAt(bLo).p2Psia;

  return {
    softStates: SOFT_STATE_PROBES.map(({ label, call }) => ({ label, error: softOf(call()) })),
    gcDerived: (OGBIA.rhoLbFt3 * gcProbe.vFtS * gcProbe.vFtS) / (2 * 144 * gcProbe.dpFittingsPsi),
    gcProbeVFtS: gcProbe.vFtS,
    gcProbeFittingsPsi: gcProbe.dpFittingsPsi,
    cpDerived: (OGBIA.rhoLbFt3 * og.vFtS * (OGBIA.idIn / 12)) / (OGBIA.muCp * og.re),
    cpProbeVFtS: og.vFtS,
    cpProbeRe: og.re,
    cuftPerBblDerived,
    lineVolumeBbl: volume,
    secondsPerDayDerived: (OGBIA.qBpd * cuftPerBblDerived) / (areaDerivedFt2 * og.vFtS),
    secondsPerHourDerived: OGBIA_PIG.lengthFt / (OGBIA_PIG.pigSpeedFtS * pig.runHours),
    pigRunHours: pig.runHours,
    mileProbeLengthMi: MILE_PROBE_LENGTH_MI,
    mileFtAccepted: lo,
    mileGapFt: hi - lo,
    atmosphericLargestRateScfd: bLo,
    atmosphericFloorPsia: floorPsia,
    tbR: H.BASE_CONDITIONS.tbR,
    pbPsia: H.BASE_CONDITIONS.pbPsia,
    baseAgainstAtmosphericDerived: floorPsia - H.BASE_CONDITIONS.pbPsia,
  };
};

// ---------------------------------------------------------------------------
// SECTION 2. Velocity, Reynolds and the friction factor.
// ---------------------------------------------------------------------------

export const frictionAndRegime = () => {
  const relRough = OGBIA.roughnessIn / OGBIA.idIn;
  const jLo = H.frictionFactor({ re: RE_JUST_BELOW_BRANCH, relRough });
  const jHi = H.frictionFactor({ re: RE_AT_BRANCH, relRough });
  // The three constants of the two friction laws. The module exports none of
  // them, so each is measured by choosing inputs that isolate it: the laminar
  // numerator falls straight out below the branch, the Colebrook Reynolds
  // numerator is read on a SMOOTH pipe where the roughness term is exactly
  // zero, and the roughness divisor is read in the FULLY ROUGH limit where the
  // Reynolds term falls away.
  const lamF = H.frictionFactor({ re: LAMINAR_PROBE_RE, relRough: 0 }).f;
  const smoothF = H.frictionFactor({ re: SMOOTH_PROBE_RE, relRough: 0 }).f;
  const xSmooth = 1 / Math.sqrt(smoothF);
  const roughF = H.frictionFactor({ re: FULLY_ROUGH_PROBE_RE, relRough: FULLY_ROUGH_PROBE_RR }).f;
  const xRough = 1 / Math.sqrt(roughF);
  return {
    lawConstants: {
      laminarRe: LAMINAR_PROBE_RE,
      laminarF: lamF,
      laminarNumeratorDerived: lamF * LAMINAR_PROBE_RE,
      smoothRe: SMOOTH_PROBE_RE,
      smoothF,
      colebrookReynoldsNumeratorDerived: (SMOOTH_PROBE_RE * 10 ** (-xSmooth / 2)) / xSmooth,
      roughRe: FULLY_ROUGH_PROBE_RE,
      roughRelRough: FULLY_ROUGH_PROBE_RR,
      roughF,
      colebrookRoughnessDivisorDerived: FULLY_ROUGH_PROBE_RR * 10 ** (xRough / 2),
    },
    published: G.friction.map((c) => {
      const r = H.frictionFactor({ re: c.re, relRough: c.relRough });
      return {
        re: c.re, relRough: c.relRough, f: r.f, goldenF: c.f, regime: r.regime,
      };
    }),
    branch: OGBIA_REGIME_PROBE_RE.map((re) => {
      const r = H.frictionFactor({ re, relRough: 0 });
      return { re, f: r.f, regime: r.regime };
    }),
    ogbiaRelRoughDerived: relRough,
    jumpFromF: jLo.f,
    jumpToF: jHi.f,
    jumpPercentDerived: (jHi.f / jLo.f - 1) * 100,
    jumpFromRegime: jLo.regime,
    jumpToRegime: jHi.regime,
    reLow: RE_LOW_FOR_ROUGHNESS_TABLE,
    reHigh: RE_HIGH_FOR_ROUGHNESS_TABLE,
    roughnessRows: RELATIVE_ROUGHNESS_SWEEP.map((rr) => ({
      relRough: rr,
      fLow: H.frictionFactor({ re: RE_LOW_FOR_ROUGHNESS_TABLE, relRough: rr }).f,
      fHigh: H.frictionFactor({ re: RE_HIGH_FOR_ROUGHNESS_TABLE, relRough: rr }).f,
    })),
    viscosityRows: OGBIA_VISCOSITY_SWEEP_CP.map((muCp) => {
      const r = liquidAt(OGBIA, { muCp });
      return {
        muCp, vFtS: r.vFtS, re: r.re, f: r.f, regime: r.regime, dpFrictionPsi: r.dpFrictionPsi,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. Three losses kept apart.
// ---------------------------------------------------------------------------

export const threeLosses = () => {
  const og = liquidAt(OGBIA);
  const k = ogbiaK();
  const withK = liquidAt(OGBIA, { sumK: k.sumK });
  const short = liquidAt(OGBIA, { sumK: k.sumK, lengthFt: OGBIA_MANIFOLD_LENGTH_FT });
  return {
    qBpd: OGBIA.qBpd,
    rhoLbFt3: OGBIA.rhoLbFt3,
    muCp: OGBIA.muCp,
    idIn: OGBIA.idIn,
    lengthFt: OGBIA.lengthFt,
    roughnessIn: OGBIA.roughnessIn,
    vFtS: og.vFtS,
    re: og.re,
    regime: og.regime,
    f: og.f,
    dpFrictionPsi: og.dpFrictionPsi,
    dpFittingsPsi: og.dpFittingsPsi,
    dpElevationPsi: og.dpElevationPsi,
    dpTotalPsi: og.dpTotalPsi,
    gradientPsiPerFt: og.gradientPsiPerFt,
    fittings: OGBIA_FITTINGS.map((f) => ({
      id: f.id, count: f.count, kEach: P.fittingK(f.id), kTotal: P.fittingK(f.id) * f.count,
    })),
    sumK: k.sumK,
    withKFittingsPsi: withK.dpFittingsPsi,
    withKFrictionPsi: withK.dpFrictionPsi,
    withKShareDerived: withK.dpFittingsPsi / withK.dpTotalPsi,
    manifoldLengthFt: OGBIA_MANIFOLD_LENGTH_FT,
    shortFrictionPsi: short.dpFrictionPsi,
    shortFittingsPsi: short.dpFittingsPsi,
    shortShareDerived: short.dpFittingsPsi / short.dpTotalPsi,
    elevationRows: OGBIA_ELEVATION_SWEEP_FT.map((dz) => {
      const r = liquidAt(OGBIA, { elevChangeFt: dz });
      return {
        elevChangeFt: dz,
        dpFrictionPsi: r.dpFrictionPsi,
        dpElevationPsi: r.dpElevationPsi,
        dpTotalPsi: r.dpTotalPsi,
        gradientPsiPerFt: r.gradientPsiPerFt,
      };
    }),
    roughnessRows: OGBIA_ROUGHNESS_IDS.map((id) => {
      const rough = P.roughnessOf(id);
      const r = liquidAt(OGBIA, { roughnessIn: rough });
      return {
        id,
        roughnessIn: rough,
        relRoughDerived: rough / OGBIA.idIn,
        f: r.f,
        dpFrictionPsi: r.dpFrictionPsi,
      };
    }),
    published: G.liquid.map((c) => {
      const r = H.liquidLineDrop(c);
      return {
        input: { ...c },
        vFtS: r.vFtS,
        re: r.re,
        f: r.f,
        regime: r.regime,
        dpFrictionPsi: r.dpFrictionPsi,
        dpFittingsPsi: r.dpFittingsPsi,
        dpElevationPsi: r.dpElevationPsi,
        dpTotalPsi: r.dpTotalPsi,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 4. The erosional limit.
// ---------------------------------------------------------------------------

export const erosionalLimit = () => ({
  rows: C.EROSIONAL_C.map((row) => ({ ...row })),
  unknownId: EROSIONAL_UNKNOWN_ID,
  unknownShape: shapeOf(C.erosionalC(EROSIONAL_UNKNOWN_ID)),
  byCFactor: EROSIONAL_C_IDS.map((id) => {
    const cFactor = C.erosionalC(id).c;
    const chk = C.erosionalCheck({
      inSituBpd: OGBIA.qBpd, idIn: OGBIA.idIn, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor,
    });
    return {
      id,
      cFactor,
      erosionalFtS: chk.erosionalFtS,
      velocityFtS: chk.velocityFtS,
      ratio: chk.ratio,
      exceeded: chk.exceeded,
      marginPct: chk.marginPct,
      largestRateBpd: C.erosionalRateBpd({
        idIn: OGBIA.idIn, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor,
      }),
    };
  }),
  areaFt2: C.pipeAreaFt2(OGBIA.idIn),
  checkVelocityFtS: C.mixtureVelocityFtS({ inSituBpd: OGBIA.qBpd, idIn: OGBIA.idIn }),
  densityRows: EROSIONAL_DENSITY_SWEEP.map((rho) => ({
    rhoLbFt3: rho,
    at100: C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 100 }),
    at125: C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 125 }),
    at175: C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 175 }),
  })),
  lightRhoLbFt3: EROSIONAL_DENSITY_SWEEP[0],
  heavyRhoLbFt3: EROSIONAL_DENSITY_SWEEP[3],
  veLightFtS: C.erosionalVelocityFtS({
    mixtureDensityLbFt3: EROSIONAL_DENSITY_SWEEP[0], cFactor: C.erosionalC('continuous').c,
  }),
  veHeavyFtS: C.erosionalVelocityFtS({
    mixtureDensityLbFt3: EROSIONAL_DENSITY_SWEEP[3], cFactor: C.erosionalC('continuous').c,
  }),
  densityRatioDerived: C.erosionalVelocityFtS({
    mixtureDensityLbFt3: EROSIONAL_DENSITY_SWEEP[0], cFactor: C.erosionalC('continuous').c,
  }) / C.erosionalVelocityFtS({
    mixtureDensityLbFt3: EROSIONAL_DENSITY_SWEEP[3], cFactor: C.erosionalC('continuous').c,
  }),
  held: { ...HELD_ITEMS[0] },
});

// ---------------------------------------------------------------------------
// SECTION 5. Choosing a bore.
// ---------------------------------------------------------------------------

export const boreChoice = () => {
  const sweep = scheduleSweep();
  const passing = sweep.filter(({ r, chk }) => !chk.exceeded && r.vFtS <= OGBIA_SWEEP_MAX_V_FT_S);
  const first = passing[0];
  const smallest = passing.reduce((a, b) => (a.row.id < b.row.id ? a : b), passing[0]);
  return {
    rows: sweep.map(({ row, r, chk }) => ({
      nps: row.nps,
      schedule: row.schedule,
      odIn: row.od,
      wallIn: row.wall,
      idIn: row.id,
      vFtS: r.vFtS,
      re: r.re,
      dpFrictionPsi: r.dpFrictionPsi,
      dpTotalPsi: r.dpTotalPsi,
      erosionalFtS: chk.erosionalFtS,
      ratio: chk.ratio,
      insideTheLimit: !chk.exceeded,
    })),
    erosionalFtS: sweep[0].chk.erosionalFtS,
    boresInTableOrder: P.PIPE_SCHEDULE.map((r) => r.id),
    schedulePairs: SCHEDULE_PAIR_NPS.map((nps) => {
      const a = P.scheduleRow(nps, '40');
      const b = P.scheduleRow(nps, '80');
      const ra = liquidAt(OGBIA, { idIn: a.id });
      const rb = liquidAt(OGBIA, { idIn: b.id });
      return {
        nps,
        odIn: a.od,
        wallLightIn: a.wall,
        wallHeavyIn: b.wall,
        boreLightIn: a.id,
        boreHeavyIn: b.id,
        vLightFtS: ra.vFtS,
        vHeavyFtS: rb.vFtS,
        totalLightPsi: ra.dpTotalPsi,
        totalHeavyPsi: rb.dpTotalPsi,
      };
    }),
    maxVFtS: OGBIA_SWEEP_MAX_V_FT_S,
    passingCount: passing.length,
    boreCount: P.PIPE_SCHEDULE.length,
    firstInTableOrder: {
      nps: first.row.nps, schedule: first.row.schedule, idIn: first.row.id,
    },
    smallestBore: {
      nps: smallest.row.nps, schedule: smallest.row.schedule, idIn: smallest.row.id,
    },
    sameRow: first.row.id === smallest.row.id,
  };
};

// ---------------------------------------------------------------------------
// SECTION 6. The Associate reading, one line end to end.
// ---------------------------------------------------------------------------

export const associateReading = () => {
  const og = liquidAt(OGBIA);
  const k = ogbiaK();
  const withK = liquidAt(OGBIA, { sumK: k.sumK });
  const erosionalFtS = scheduleSweep()[0].chk.erosionalFtS;
  return {
    qBpd: OGBIA.qBpd,
    rhoLbFt3: OGBIA.rhoLbFt3,
    muCp: OGBIA.muCp,
    idIn: OGBIA.idIn,
    lengthFt: OGBIA.lengthFt,
    vFtS: og.vFtS,
    re: og.re,
    regime: og.regime,
    relRoughDerived: OGBIA.roughnessIn / OGBIA.idIn,
    f: og.f,
    dpFrictionPsi: og.dpFrictionPsi,
    sumK: k.sumK,
    dpFittingsPsi: withK.dpFittingsPsi,
    erosionalFtS,
    usedFractionDerived: og.vFtS / erosionalFtS,
  };
};

// ---------------------------------------------------------------------------
// SECTION 7. A gas line is not a liquid line.
// ---------------------------------------------------------------------------

export const gasLineBasics = () => ({
  p1Psia: SOKU.p1Psia,
  p2Psia: SOKU.p2Psia,
  idIn: SOKU.idIn,
  lengthMi: SOKU.lengthMi,
  sg: SOKU.sg,
  tAvgR: SOKU.tAvgR,
  zAvg: SOKU.zAvg,
  efficiency: SOKU.efficiency,
  drivingGroupDerived: SOKU.p1Psia * SOKU.p1Psia - SOKU.p2Psia * SOKU.p2Psia,
  tbR: H.BASE_CONDITIONS.tbR,
  pbPsia: H.BASE_CONDITIONS.pbPsia,
  deadP2Psia: SOKU_DEAD_P2_PSIA,
  deadError: softOf(H.weymouthQ({ ...SOKU, p2Psia: SOKU_DEAD_P2_PSIA })),
  nearlyDeadP2Psia: SOKU_NEARLY_DEAD_P2_PSIA,
  nearlyDeadScfd: H.weymouthQ({ ...SOKU, p2Psia: SOKU_NEARLY_DEAD_P2_PSIA }).qScfd,
});

// ---------------------------------------------------------------------------
// SECTION 8. The four transmission forms.
// ---------------------------------------------------------------------------

/** Each form's rate at each swept efficiency, over that SAME form's rate at an
 *  efficiency of one, and that ratio less the efficiency the row was computed
 *  at. A deviation of a last-bit size is a plain multiplier; anything larger is
 *  a form that does something else with the number. */
const efficiencyRows = () => {
  const base = sokuRates();
  return SOKU_EFFICIENCY_SWEEP.map((efficiency) => {
    const rates = gasFormList().map(([, fn]) => fn({ ...SOKU, efficiency }).qScfd);
    const ratios = gasFormList().map(([k, fn]) => fn({ ...SOKU, efficiency }).qScfd / base[k].qScfd);
    return {
      efficiency,
      rates,
      ratiosDerived: ratios,
      deviationsDerived: ratios.map((v) => v - efficiency),
    };
  });
};

export const transmissionForms = () => {
  const q = sokuRates();
  const rates = GAS_FORMS.map((k) => q[k].qScfd);
  return {
    forms: GAS_FORMS.map((k) => ({
      form: k, qScfd: q[k].qScfd, againstWeymouthDerived: q[k].qScfd / q.weymouth.qScfd,
    })),
    spreadDerived: Math.max(...rates) / Math.min(...rates),
    generalFDarcy: q.general.fDarcy,
    exponents: gasFormList().map(([k, fn]) => {
      const a = fn({ ...SOKU, idIn: 10 }).qScfd;
      const b = fn({ ...SOKU, idIn: 20 }).qScfd;
      return {
        form: k, at10: a, at20: b, exponentDerived: Math.log2(b / a),
      };
    }),
    efficiencyRows: efficiencyRows(),
    // WHAT THE MULTIPLIER ACTUALLY DOES. Weymouth, Panhandle A and Panhandle B
    // carry the efficiency as a plain multiplier, so a form's rate over its own
    // rate at an efficiency of one IS the efficiency. General Flow solves a
    // friction factor against the rate it settles on, so its ratio sits under
    // the efficiency by a real amount. The deviations are exported rather than
    // characterised, so no prose can drift from them.
    efficiencyLinearWorstDerived: Math.max(...efficiencyRows()
      .flatMap((r) => r.deviationsDerived.slice(0, 3).map((v) => Math.abs(v)))),
    efficiencyGeneralWorstDerived: Math.max(...efficiencyRows()
      .map((r) => Math.abs(r.deviationsDerived[3]))),
    efficiencyWorstRatioDerived: Math.max(...efficiencyRows()
      .map((r) => Math.abs(r.deviationsDerived[3])))
      / Math.max(...efficiencyRows()
        .flatMap((r) => r.deviationsDerived.slice(0, 3).map((v) => Math.abs(v)))),
    efficiencyLowest: SOKU_EFFICIENCY_SWEEP[0],
    held: { ...HELD_ITEMS[1] },
    published: G.gas.map((c) => {
      const fn = Object.fromEntries(gasFormList())[c.equation];
      return {
        input: { ...c }, qScfd: fn(c).qScfd, goldenScfd: c.qScfd,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 9. The elevation adjustment.
// ---------------------------------------------------------------------------

export const elevationGroup = () => {
  const coeff = H.elevationAdjustment({ sg: 1, elevChangeFt: 1000, tAvgR: 1, zAvg: 1 });
  return {
    rows: [0, SOKU_UP_FT, SOKU_DOWN_FT, SOKU_STEEP_DOWN_FT].map((dz) => {
      const ea = H.elevationAdjustment({
        sg: SOKU.sg, elevChangeFt: dz, tAvgR: SOKU.tAvgR, zAvg: SOKU.zAvg,
      });
      return {
        elevChangeFt: dz, s: ea.s, es: ea.es, leFactor: ea.leFactor,
      };
    }),
    coefficientDerived: coeff.s / 1000,
    coefficientProbeS: coeff.s,
    // At zero elevation the adjusted form IS the flat form, and the difference
    // is exported so that claim is read rather than asserted.
    flatAgainScfd: H.weymouthQ({ ...SOKU, elevChangeFt: 0 }).qScfd,
    sectionEightWeymouthScfd: H.weymouthQ(SOKU).qScfd,
    flatAgainDifferenceDerived: H.weymouthQ({ ...SOKU, elevChangeFt: 0 }).qScfd
      - H.weymouthQ(SOKU).qScfd,
    upFt: SOKU_UP_FT,
    downFt: SOKU_DOWN_FT,
    byForm: gasFormList().map(([k, fn]) => {
      const flat = fn(SOKU).qScfd;
      const up = fn({ ...SOKU, elevChangeFt: SOKU_UP_FT }).qScfd;
      const dn = fn({ ...SOKU, elevChangeFt: SOKU_DOWN_FT }).qScfd;
      return {
        form: k,
        flat,
        up,
        down: dn,
        upFractionDerived: up / flat,
        downFractionDerived: dn / flat,
      };
    }),
    // The two fractions on the Weymouth row, averaged. Close to one, and not
    // one, because an exponential is not symmetric about zero.
    weymouthAverageDerived: (H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_UP_FT }).qScfd
      / H.weymouthQ(SOKU).qScfd
      + H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_DOWN_FT }).qScfd
      / H.weymouthQ(SOKU).qScfd) / 2,
  };
};

// ---------------------------------------------------------------------------
// SECTION 10. The outlet pressure, and the bracket that is a piece of physics.
// ---------------------------------------------------------------------------

export const outletPressure = () => {
  const q = sokuRates();
  const target = H.gasOutletPressure({ equation: 'weymouth', qScfd: SOKU_TARGET_SCFD, ...SOKU });
  const steepOutletPsia = SOKU.p1Psia + SOKU_STEEP_DOWN_ABOVE_INLET_PSI;
  const steepQ = H.weymouthQ({
    ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT, p2Psia: steepOutletPsia,
  });
  const steepInv = H.gasOutletPressure({
    equation: 'weymouth', qScfd: steepQ.qScfd, ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT,
  });
  const controlQ = H.weymouthQ({
    ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT, p2Psia: SOKU_STEEP_DOWN_P2_PSIA,
  });
  const controlInv = H.gasOutletPressure({
    equation: 'weymouth', qScfd: controlQ.qScfd, ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT,
  });
  const upInv = H.gasOutletPressure({
    equation: 'weymouth', qScfd: SOKU_STEEP_UP_SCFD, ...SOKU, elevChangeFt: SOKU_STEEP_UP_FT,
  });
  const upEa = H.elevationAdjustment({
    sg: SOKU.sg, elevChangeFt: SOKU_STEEP_UP_FT, tAvgR: SOKU.tAvgR, zAvg: SOKU.zAvg,
  });
  return {
    roundTrips: GAS_FORMS.map((k) => {
      const inv = H.gasOutletPressure({ equation: k, qScfd: q[k].qScfd, ...SOKU });
      return {
        form: k,
        qScfd: q[k].qScfd,
        error: inv.error || null,
        p2Psia: inv.p2Psia,
        againstStatedDerived: inv.error ? null : inv.p2Psia - SOKU.p2Psia,
      };
    }),
    targetScfd: SOKU_TARGET_SCFD,
    targetP2Psia: target.p2Psia,
    targetDpPsi: target.dpPsi,
    unreachableError: softOf(H.gasOutletPressure({ equation: 'weymouth', qScfd: 1e12, ...SOKU })),
    // THE CEILING. Every published form is driven by p1 squared less es times
    // p2 squared, so the outlet a rate approaches as it falls to nothing is the
    // inlet over the square root of the engine's own elevation factor, and NOT
    // the inlet. On a descent it sits ABOVE the inlet; on a climb, below.
    ceilings: [0, SOKU_UP_FT, SOKU_DOWN_FT, SOKU_STEEP_UP_FT, SOKU_STEEP_DOWN_FT].map((dz) => {
      const ea = H.elevationAdjustment({
        sg: SOKU.sg, elevChangeFt: dz, tAvgR: SOKU.tAvgR, zAvg: SOKU.zAvg,
      });
      const ceiling = SOKU.p1Psia / Math.sqrt(ea.es);
      return {
        elevChangeFt: dz,
        es: ea.es,
        ceilingPsiaDerived: ceiling,
        againstInletDerived: ceiling - SOKU.p1Psia,
      };
    }),
    p1Psia: SOKU.p1Psia,
    steepDownFt: SOKU_STEEP_DOWN_FT,
    steepOutletPsia,
    steepAboveInletPsi: SOKU_STEEP_DOWN_ABOVE_INLET_PSI,
    steepScfd: steepQ.qScfd,
    steepInverseShape: shapeOf(steepInv),
    steepInverseErrorDerived: steepOutletPsia - steepInv.p2Psia,
    controlP2Psia: SOKU_STEEP_DOWN_P2_PSIA,
    controlScfd: controlQ.qScfd,
    controlRecoveredPsia: controlInv.p2Psia,
    controlErrorDerived: controlInv.p2Psia - SOKU_STEEP_DOWN_P2_PSIA,
    steepUpFt: SOKU_STEEP_UP_FT,
    steepUpScfd: SOKU_STEEP_UP_SCFD,
    upP2Psia: upInv.p2Psia,
    upDpPsi: upInv.dpPsi,
    upCeilingPsiaDerived: SOKU.p1Psia / Math.sqrt(upEa.es),
    upCeilingAboveDeliveredDerived: SOKU.p1Psia / Math.sqrt(upEa.es) - upInv.p2Psia,
    starvedP1Psia: SOKU_STARVED_P1_PSIA,
    starvedError: softOf(H.gasOutletPressure({
      equation: 'weymouth',
      qScfd: SOKU_STEEP_UP_SCFD,
      ...SOKU,
      p1Psia: SOKU_STARVED_P1_PSIA,
      elevChangeFt: SOKU_STEEP_UP_FT,
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. Marching a profile, and the refusal that keeps its evidence.
// ---------------------------------------------------------------------------

const traverseOf = (profile) => H.liquidLineTraverse({
  p1Psia: OGBIA_P1_PSIA,
  qBpd: OGBIA.qBpd,
  idIn: OGBIA.idIn,
  rhoLbFt3: OGBIA.rhoLbFt3,
  muCp: OGBIA.muCp,
  roughnessIn: OGBIA.roughnessIn,
  profile,
});

export const profileMarch = () => {
  const flat = traverseOf(OGBIA_PROFILE_FLAT);
  const ridge = traverseOf(OGBIA_PROFILE);
  const totalFt = OGBIA_PROFILE_FLAT.reduce((a, s) => a + s.lengthFt, 0);
  const oneShot = liquidAt(OGBIA, { lengthFt: totalFt });
  const k = ogbiaK();
  const withK = liquidAt(OGBIA, { sumK: k.sumK, lengthFt: totalFt });
  const dead = H.liquidLineTraverse({
    p1Psia: OGBIA_DEAD_LINE.p1Psia,
    qBpd: OGBIA_DEAD_LINE.qBpd,
    idIn: OGBIA_DEAD_LINE.idIn,
    rhoLbFt3: OGBIA_DEAD_LINE.rhoLbFt3,
    muCp: OGBIA_DEAD_LINE.muCp,
    profile: [{ lengthFt: OGBIA_DEAD_LINE.lengthFt }],
  });
  const deadDrop = H.liquidLineDrop({
    qBpd: OGBIA_DEAD_LINE.qBpd,
    idIn: OGBIA_DEAD_LINE.idIn,
    lengthFt: OGBIA_DEAD_LINE.lengthFt,
    rhoLbFt3: OGBIA_DEAD_LINE.rhoLbFt3,
    muCp: OGBIA_DEAD_LINE.muCp,
  });
  return {
    stations: flat.stations.map((s, i) => ({
      index: i,
      distanceFt: s.distanceFt,
      flatElevFt: s.elevFt,
      flatPPsia: s.pPsia,
      ridgeElevFt: ridge.stations[i].elevFt,
      ridgePPsia: ridge.stations[i].pPsia,
    })),
    arrivalPsia: flat.p2Psia,
    spentPsi: flat.dpTotalPsi,
    riseFt: OGBIA_PROFILE[0].elevChangeFt,
    crestRidgePsia: ridge.stations[1].pPsia,
    crestFlatPsia: flat.stations[1].pPsia,
    crestDifferenceDerived: flat.stations[1].pPsia - ridge.stations[1].pPsia,
    totalFt,
    oneShotPsi: oneShot.dpTotalPsi,
    marchAgainstOneShotDerived: flat.dpTotalPsi - oneShot.dpTotalPsi,
    sumK: k.sumK,
    withKPsi: withK.dpTotalPsi,
    fittingsGapDerived: withK.dpTotalPsi - flat.dpTotalPsi,
    // The gap between the two calls, AND the engine's own fittings term on the
    // one-shot call, so "the gap is the fittings" is a difference on the page
    // rather than a claim about two figures that never meet.
    withKFittingsPsi: withK.dpFittingsPsi,
    fittingsGapAgainstTermDerived: (withK.dpTotalPsi - flat.dpTotalPsi) - withK.dpFittingsPsi,
    // THE REFUSAL THAT KEEPS ITS EVIDENCE. The traverse hands back the stations
    // it can stand behind, the distance it died at and the pressure the
    // arithmetic produced, so a die-out is diagnosable rather than a bare
    // failure. A panel shows all four rather than swallowing them.
    dead: {
      input: { ...OGBIA_DEAD_LINE },
      error: softOf(dead),
      stationCount: dead.stations.length,
      lastDistanceFt: dead.stations[dead.stations.length - 1].distanceFt,
      lastPPsia: dead.stations[dead.stations.length - 1].pPsia,
      diedAtFt: dead.diedAtFt,
      diedAtPsia: dead.diedAtPsia,
      stations: dead.stations.map((s) => ({ ...s })),
      singleCallPsi: deadDrop.dpTotalPsi,
      inletLessDropDerived: OGBIA_DEAD_LINE.p1Psia - deadDrop.dpTotalPsi,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 12. The Professional reading, a trunk end to end.
// ---------------------------------------------------------------------------

export const professionalReading = () => {
  const q = sokuRates();
  const target = H.gasOutletPressure({ equation: 'weymouth', qScfd: SOKU_TARGET_SCFD, ...SOKU });
  return {
    idIn: SOKU.idIn,
    lengthMi: SOKU.lengthMi,
    p1Psia: SOKU.p1Psia,
    p2Psia: SOKU.p2Psia,
    drivingGroupDerived: SOKU.p1Psia * SOKU.p1Psia - SOKU.p2Psia * SOKU.p2Psia,
    weymouthScfd: q.weymouth.qScfd,
    panhandleAScfd: q.panhandleA.qScfd,
    panhandleBScfd: q.panhandleB.qScfd,
    generalScfd: q.general.qScfd,
    generalFDarcy: q.general.fDarcy,
    upFt: SOKU_UP_FT,
    upScfd: H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_UP_FT }).qScfd,
    downScfd: H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_DOWN_FT }).qScfd,
    targetScfd: SOKU_TARGET_SCFD,
    targetP2Psia: target.p2Psia,
    // THE FORM AGAINST THE BORE. Both are decisions a designer defends, and
    // which one moves the answer further is a division rather than an opinion.
    formSpreadDerived: Math.max(...GAS_FORMS.map((k) => q[k].qScfd))
      / Math.min(...GAS_FORMS.map((k) => q[k].qScfd)),
    boreLoIn: SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 2],
    boreHiIn: SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 1],
    boreLoScfd: H.weymouthQ({ ...SOKU, idIn: SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 2] }).qScfd,
    boreHiScfd: H.weymouthQ({ ...SOKU, idIn: SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 1] }).qScfd,
    boreSpreadDerived: H.weymouthQ({ ...SOKU, idIn: SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 1] }).qScfd
      / H.weymouthQ({ ...SOKU, idIn: SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 2] }).qScfd,
    boreOverFormDerived: (H.weymouthQ({ ...SOKU, idIn: SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 1] }).qScfd
      / H.weymouthQ({ ...SOKU, idIn: SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 2] }).qScfd)
      / (Math.max(...GAS_FORMS.map((k) => q[k].qScfd)) / Math.min(...GAS_FORMS.map((k) => q[k].qScfd))),
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. The wall a code demands.
// ---------------------------------------------------------------------------

export const wallCode = () => {
  const b314 = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.4' });
  const c1 = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 1 });
  const c4 = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 4 });
  const class3 = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 3 });
  const maopWith = H.maopPsig({
    ...SOKU_WALL, code: 'B31.8', locationClass: 3, wallIn: SOKU_WALL_AS_BUILT_IN,
  });
  const maopWithout = H.maopPsig({
    odIn: SOKU_WALL.odIn,
    smysPsi: SOKU_WALL.smysPsi,
    code: 'B31.8',
    locationClass: 3,
    jointFactor: SOKU_WALL.jointFactor,
    tempDerate: SOKU_WALL.tempDerate,
    wallIn: SOKU_WALL_AS_BUILT_IN,
  });
  return {
    designFactors: H.B318_DESIGN_FACTORS.map((r) => ({ ...r })),
    b314Factor: b314.designFactor,
    wall: { ...SOKU_WALL },
    classRows: SOKU_WALL_CLASSES.map((locationClass) => {
      const r = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass });
      const m = H.maopPsig({
        ...SOKU_WALL, code: 'B31.8', locationClass, wallIn: r.tRequiredIn,
      });
      return {
        locationClass,
        designFactor: r.designFactor,
        tPressureIn: r.tPressureIn,
        tRequiredIn: r.tRequiredIn,
        maopPsig: m.maopPsig,
      };
    }),
    b314Row: {
      designFactor: b314.designFactor,
      tPressureIn: b314.tPressureIn,
      tRequiredIn: b314.tRequiredIn,
      maopPsig: H.maopPsig({ ...SOKU_WALL, code: 'B31.4', wallIn: b314.tRequiredIn }).maopPsig,
    },
    class4OverClass1Derived: c4.tPressureIn / c1.tPressureIn,
    factorRows: SOKU_JOINT_FACTORS.map((jointFactor, i) => {
      const tempDerate = SOKU_TEMP_DERATES[i];
      return {
        jointFactor,
        jointWallIn: H.requiredWallIn({
          ...SOKU_WALL, code: 'B31.8', locationClass: 1, jointFactor,
        }).tPressureIn,
        tempDerate,
        derateWallIn: H.requiredWallIn({
          ...SOKU_WALL, code: 'B31.8', locationClass: 1, tempDerate,
        }).tPressureIn,
      };
    }),
    class3PressureIn: class3.tPressureIn,
    class3RequiredIn: class3.tRequiredIn,
    class1RequiredIn: c1.tRequiredIn,
    corrosionAllowanceIn: SOKU_WALL.corrosionAllowanceIn,
    asBuiltIn: SOKU_WALL_AS_BUILT_IN,
    maopWithPsig: maopWith.maopPsig,
    maopWithoutPsig: maopWithout.maopPsig,
    maopRatioDerived: maopWithout.maopPsig / maopWith.maopPsig,
    published: G.barlow.map((c) => {
      const r = H.requiredWallIn(c);
      const m = H.maopPsig({ ...c, wallIn: r.tRequiredIn });
      return {
        input: { ...c },
        designFactor: r.designFactor,
        tRequiredIn: r.tRequiredIn,
        maopPsig: m.maopPsig,
        goldenWallIn: c.tRequiredIn,
        goldenMaopPsig: c.maopOfRequiredPsig,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. The pig and what it pushes.
// ---------------------------------------------------------------------------

export const pigging = () => {
  const volume = H.lineVolumeBbl(OGBIA_PIG);
  const run = H.pigRun(OGBIA_PIG);
  const nominal = H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: OGBIA_HOLDUP_NOMINAL });
  const nominalInterval = H.piggingInterval({
    maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: nominal.sweptBbl,
  });
  return {
    pig: { ...OGBIA_PIG },
    lineVolumeBbl: volume,
    runHours: run.runHours,
    pigSpeedFtS: run.pigSpeedFtS,
    holdupRows: OGBIA_HOLDUP_SWEEP.map((holdupFrac) => {
      const s = H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac });
      const iv = H.piggingInterval({
        maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: s.sweptBbl,
      });
      return {
        holdupFrac,
        sweptBbl: s.sweptBbl,
        fractionOfVolumeDerived: s.sweptBbl / volume,
        intervalDays: iv.error ? null : iv.intervalDays,
        error: softOf(iv),
      };
    }),
    zeroHoldupSweptBbl: H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: 0 }).sweptBbl,
    fullHoldupSweptBbl: H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: HOLDUP_AT_LIMIT }).sweptBbl,
    fullHoldupAgainstVolumeDerived:
      H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: HOLDUP_AT_LIMIT }).sweptBbl - volume,
    nominalHoldup: OGBIA_HOLDUP_NOMINAL,
    nominalSweptBbl: nominal.sweptBbl,
    catcherBbl: OGBIA_CATCHER_BBL,
    roomDerivedBbl: OGBIA_CATCHER_BBL - nominal.sweptBbl,
    dropoutBpd: OGBIA_DROPOUT_BPD,
    nominalIntervalDays: nominalInterval.intervalDays,
    smallCatcherBbl: OGBIA_SMALL_CATCHER_BBL,
    smallCatcherError: softOf(H.piggingInterval({
      maxSlugBbl: OGBIA_SMALL_CATCHER_BBL,
      dropoutBpd: OGBIA_DROPOUT_BPD,
      sweptBbl: nominal.sweptBbl,
    })),
    goldenPigSpeedFtS: GOLDEN_PIG_SPEED_FT_S,
    published: G.pigging.map((c) => ({
      input: { ...c },
      lineVolumeBbl: H.lineVolumeBbl(c),
      sweptBbl: H.sweptLiquidBbl(c).sweptBbl,
      runHours: H.pigRun({ lengthFt: c.lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours,
      goldenVolumeBbl: c.lineVolumeBbl,
      goldenSweptBbl: c.sweptBbl,
      goldenRunHours: c.runHoursAt5FtS,
    })),
    // THE SECONDS IN AN HOUR, MEASURED IN THIS SECTION. The engine is handed
    // feet and feet per second and answers in hours, so the conversion it keeps
    // to itself is the slope of the run time against the length. Two published
    // cases give that slope without any figure being typed, and the single-case
    // reading is carried beside it so the agreement is a subtraction.
    secondsPerHourCaseA: {
      lengthFt: G.pigging[0].lengthFt,
      runHours: H.pigRun({ lengthFt: G.pigging[0].lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours,
    },
    secondsPerHourCaseB: {
      lengthFt: G.pigging[1].lengthFt,
      runHours: H.pigRun({ lengthFt: G.pigging[1].lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours,
    },
    secondsPerHourSlopeDerived: (G.pigging[1].lengthFt - G.pigging[0].lengthFt)
      / (GOLDEN_PIG_SPEED_FT_S
        * (H.pigRun({ lengthFt: G.pigging[1].lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours
          - H.pigRun({ lengthFt: G.pigging[0].lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours)),
    secondsPerHourSingleDerived: OGBIA_PIG.lengthFt / (OGBIA_PIG.pigSpeedFtS * run.runHours),
    secondsPerHourAgreementDerived: (G.pigging[1].lengthFt - G.pigging[0].lengthFt)
      / (GOLDEN_PIG_SPEED_FT_S
        * (H.pigRun({ lengthFt: G.pigging[1].lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours
          - H.pigRun({ lengthFt: G.pigging[0].lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours))
      - OGBIA_PIG.lengthFt / (OGBIA_PIG.pigSpeedFtS * run.runHours),
  };
};

// ---------------------------------------------------------------------------
// SECTION 15. Where the correlations stop.
// ---------------------------------------------------------------------------

export const correlationLimits = () => {
  const relRough = OGBIA.roughnessIn / OGBIA.idIn;
  const jLo = H.frictionFactor({ re: RE_JUST_BELOW_BRANCH, relRough });
  const jHi = H.frictionFactor({ re: RE_AT_BRANCH, relRough });
  const q = sokuRates();
  const deadW = H.weymouthQ({ ...SOKU, p2Psia: SOKU_NEARLY_DEAD_P2_PSIA });
  const deadG = H.generalFlowQ({ ...SOKU, p2Psia: SOKU_NEARLY_DEAD_P2_PSIA });
  return {
    reJustBelow: RE_JUST_BELOW_BRANCH,
    reAtBranch: RE_AT_BRANCH,
    fJustBelow: jLo.f,
    fAtBranch: jHi.f,
    jumpRatioDerived: jHi.f / jLo.f,
    reForDomainSweep: RE_FOR_DOMAIN_SWEEP,
    domainRows: COLEBROOK_DOMAIN_SWEEP.map((rr) => ({
      relRough: rr, f: H.frictionFactor({ re: RE_FOR_DOMAIN_SWEEP, relRough: rr }).f,
    })),
    weymouthFriction: SOKU_BORE_SWEEP.map((idIn) => {
      const wq = H.weymouthQ({ ...SOKU, idIn }).qScfd;
      const gq = H.generalFlowQ({ ...SOKU, idIn });
      return {
        idIn,
        weymouthScfd: wq,
        generalScfd: gq.qScfd,
        generalFDarcy: gq.fDarcy,
        matchingFDerived: gq.fDarcy * (gq.qScfd / wq) * (gq.qScfd / wq),
      };
    }),
    deadWeymouthScfd: deadW.qScfd,
    deadGeneralScfd: deadG.qScfd,
    deadGeneralFDarcy: deadG.fDarcy,
    deadRatioDerived: deadW.qScfd / deadG.qScfd,
    fullDutyRatioDerived: q.weymouth.qScfd / q.general.qScfd,
    deadDistanceDerived: Math.abs(1 - deadW.qScfd / deadG.qScfd),
    fullDutyDistanceDerived: Math.abs(1 - q.weymouth.qScfd / q.general.qScfd),
    heldBand: { ...HELD_ITEMS[2] },
    heldWeymouth: { ...HELD_ITEMS[3] },
  };
};

// ---------------------------------------------------------------------------
// SECTION 16. What it refuses, and what a refusal looks like.
// ---------------------------------------------------------------------------

/** Bisect the gas elevation guard on a line of a given length: the largest
 *  rise the engine accepts, and the next representable value above it, which it
 *  refuses. Nothing here is typed; the engine is asked on both sides. */
const mileGuardProbe = (lengthMi) => {
  // The guard's own message, ASKED OF THE ENGINE with a rise no line could
  // have, so no refusal string is ever typed into this file.
  const guardMessage = H.weymouthQ({ ...SOKU, lengthMi, elevChangeFt: 1e9 }).error;
  const accepts = (dz) => H.weymouthQ({ ...SOKU, lengthMi, elevChangeFt: dz }).error !== guardMessage;
  let lo = 0; let hi = 1e7;
  for (let i = 0; i < 400; i += 1) {
    const mid = (lo + hi) / 2;
    if (mid === lo || mid === hi) break;
    if (accepts(mid)) lo = mid; else hi = mid;
  }
  return { lo, gap: hi - lo };
};

export const refusalCatalogue = () => {
  const og = liquidAt(OGBIA);
  return {
    // The three returns that sit outside the object contract on purpose. A NaN
    // has no JSON spelling, so a panel that serialises one prints null: these
    // are carried as strings exactly as the digest prints them.
    reynoldsNoViscosity: String(H.reynoldsNumber({
      rhoLbFt3: OGBIA.rhoLbFt3, vFtS: og.vFtS, idIn: OGBIA.idIn, muCp: 0,
    })),
    volumeNoBore: String(H.lineVolumeBbl({ idIn: 0, lengthFt: OGBIA.lengthFt })),
    frictionNegativeRoughnessShape: shapeOf(H.frictionFactor({
      re: og.re, relRough: ROUGHNESS_JUST_UNDER / OGBIA.idIn,
    })),
    refusals: REFUSAL_PROBES.map(({ label, call }) => ({ label, error: softOf(call()) })),
    boundaries: BOUNDARY_PROBES.map(({ label, value, call }) => ({
      label, value, refuses: Boolean(call().error),
    })),
    // THE GUARD THAT MEASURES A CONSTANT. The gas elevation guard compares a
    // rise in FEET against a length in MILES, so bisecting it on two lengths
    // and dividing recovers the feet in a mile the module keeps to itself,
    // asked of the engine rather than typed.
    mileGuardRows: [MILE_PROBE_LENGTH_MI, SOKU.lengthMi].map((lengthMi) => {
      const probe = mileGuardProbe(lengthMi);
      return {
        lengthMi,
        largestAcceptedFt: probe.lo,
        nextValueGapFt: probe.gap,
        perMileDerived: probe.lo / lengthMi,
      };
    }),
    mileGuardPerMileDifferenceDerived:
      mileGuardProbe(SOKU.lengthMi).lo / SOKU.lengthMi
      - mileGuardProbe(MILE_PROBE_LENGTH_MI).lo / MILE_PROBE_LENGTH_MI,
    catalogueAnswers: {
      fittingK: String(P.fittingK('reducer')),
      roughnessOf: String(P.roughnessOf('glass')),
      gradeYield: String(P.gradeYield('x55')),
      scheduleRow: shapeOf(P.scheduleRow(5, '40')),
      erosionalC: shapeOf(C.erosionalC(EROSIONAL_UNKNOWN_ID)),
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 17. What the method does not know.
// ---------------------------------------------------------------------------

export const heldItems = () => {
  const relRough = OGBIA.roughnessIn / OGBIA.idIn;
  const jLo = H.frictionFactor({ re: RE_JUST_BELOW_BRANCH, relRough });
  const jHi = H.frictionFactor({ re: RE_AT_BRANCH, relRough });
  const volume = H.lineVolumeBbl({ idIn: OGBIA.idIn, lengthFt: OGBIA.lengthFt });
  const areaDerivedFt2 = (Math.PI * OGBIA.idIn * OGBIA.idIn) / (4 * 144);
  const cFactor = C.erosionalC('continuous').c;
  const ve = C.erosionalVelocityFtS({
    mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor,
  });
  const rate = C.erosionalRateBpd({
    idIn: OGBIA.idIn, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor,
  });
  const bblLine = (areaDerivedFt2 * OGBIA.lengthFt) / volume;
  const bblChoke = (ve * C.pipeAreaFt2(OGBIA.idIn) * 86400) / rate;
  return {
    items: HELD_ITEMS.map((h) => ({ ...h })),
    marker: HELD_MARKER,
    cContinuous: C.erosionalC('continuous').c,
    cIntermittent: C.erosionalC('intermittent').c,
    cCleanInhibited: C.erosionalC('cleanInhibited').c,
    jumpRatioDerived: jHi.f / jLo.f,
    bblFromLineHydraulicsDerived: bblLine,
    bblFromChokePerformanceDerived: bblChoke,
    bblRatioDerived: bblLine / bblChoke,
  };
};

// ---------------------------------------------------------------------------
// SECTION 18. The Expert reading, a line from bore to wall to pig.
// ---------------------------------------------------------------------------

export const expertReading = () => {
  const og = liquidAt(OGBIA);
  const erosionalFtS = scheduleSweep()[0].chk.erosionalFtS;
  const c1 = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 1 });
  const class3 = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 3 });
  const maopWith = H.maopPsig({
    ...SOKU_WALL, code: 'B31.8', locationClass: 3, wallIn: SOKU_WALL_AS_BUILT_IN,
  });
  const nominal = H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: OGBIA_HOLDUP_NOMINAL });
  return {
    idIn: OGBIA.idIn,
    qBpd: OGBIA.qBpd,
    vFtS: og.vFtS,
    re: og.re,
    dpTotalPsi: og.dpTotalPsi,
    lengthFt: OGBIA.lengthFt,
    erosionalFtS,
    usedFractionDerived: og.vFtS / erosionalFtS,
    odIn: SOKU_WALL.odIn,
    smysPsi: SOKU_WALL.smysPsi,
    class3RequiredIn: class3.tRequiredIn,
    class1RequiredIn: c1.tRequiredIn,
    asBuiltIn: SOKU_WALL_AS_BUILT_IN,
    maopPsig: maopWith.maopPsig,
    // THE WALL READING IS A DIFFERENT PIPE. Its bore is the outside diameter
    // less twice the wall, and the gap against the OGBIA bore is exported so
    // the three readings cannot be described as one pipe.
    wallBoreDerivedIn: SOKU_WALL.odIn - 2 * SOKU_WALL_AS_BUILT_IN,
    wallBoreAgainstOgbiaDerived: SOKU_WALL.odIn - 2 * SOKU_WALL_AS_BUILT_IN - OGBIA.idIn,
    lineVolumeBbl: H.lineVolumeBbl(OGBIA_PIG),
    runHours: H.pigRun(OGBIA_PIG).runHours,
    nominalHoldup: OGBIA_HOLDUP_NOMINAL,
    nominalSweptBbl: nominal.sweptBbl,
    nominalIntervalDays: H.piggingInterval({
      maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: nominal.sweptBbl,
    }).intervalDays,
  };
};

// ===========================================================================
// THE CAPSTONE. IMO-1, BRASS AND QUA IBOE ONLY. NOT FOR LESSONS, NOT FOR
// PANELS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL, copied VERBATIM from
// /root/fc-wip-linesizing/fc2_fields_capstone.mjs so the grader, the lab's own
// tests and the migration headers all read one derivation.
//
// NO GRADED FIELD DEPENDS ON A HELD QUANTITY. IMO-1 states its own site
// erosional c factor, so the three published RP 14E rows are nowhere below;
// BRASS states its efficiency, so the unsourced multiplier is an input rather
// than a lookup; every capstone Reynolds number is above 20000, so the held
// transition band cannot touch a graded friction factor; and every bore,
// roughness, resistance sum and location class is stated, so no graded value
// reads the pipe schedule, the roughness table, the fitting K table or the
// B31.8 class table as a lookup.
//
// Every name carries IMO, BRASS or QUA_IBOE, and panelCapstoneGuard.test.js
// greps the three panel sources and the learning page for every one of them.
// The leak gate in linesizingLab.test.js checks every TEACHING export's return
// values against the eighteen graded answers.
// ===========================================================================

export const IMO_1 = {
  qBpd: 6800,
  idIn: 6.065,
  lengthFt: 19800,
  elevChangeFt: 180,
  rhoLbFt3: 52.3,
  muCp: 4.2,
  /** The line has been in service for years, so the roughness is stated
   *  rather than taken as new steel. */
  roughnessIn: 0.006,
  /** The isometric's resistance sum, given directly so no K table is read. */
  sumK: 3.85,
};

/** The site's own erosional c factor, agreed with the operator. It is not
 *  one of the three published RP 14E rows. */
export const IMO_1_C_FACTOR = 120;

export const BRASS = {
  p1Psia: 1150,
  p2Psia: 840,
  idIn: 15,
  lengthMi: 58,
  sg: 0.62,
  tAvgR: 552,
  zAvg: 0.845,
  efficiency: 0.92,
  elevChangeFt: -950,
};

/** The General Flow run needs a gas viscosity and a pipe roughness, both
 *  stated. */
export const BRASS_MU_CP = 0.0125;
export const BRASS_ROUGHNESS_IN = 0.0006;

/** The rate the terminal has contracted for, which the outlet pressure
 *  solve is run against. Stated in scfd. */
export const BRASS_CONTRACT_SCFD = 92e6;

export const QUA_IBOE_WALL = {
  designPsig: 1450,
  odIn: 16,
  smysPsi: 60000,
  code: 'B31.8',
  /** Class 3: the line crosses a town's outskirts. Stated, because
   *  assuming Class 1 is the mistake the classes exist to prevent. */
  locationClass: 3,
  jointFactor: 1,
  tempDerate: 0.967,
  corrosionAllowanceIn: 0.0625,
};

/** The wall the mill actually rolled, which is what the rating is read
 *  from. */
export const QUA_IBOE_AS_BUILT_WALL_IN = 0.5;

export const QUA_IBOE_PIG = {
  idIn: 15,
  lengthFt: 306240,
  pigSpeedFtS: 4,
};

/** The holdup is an INPUT to the engine and is therefore an input to the
 *  capstone: the measured loading from the last three runs. */
export const QUA_IBOE_HOLDUP_FRAC = 0.035;
export const QUA_IBOE_CATCHER_BBL = 3200;
export const QUA_IBOE_DROPOUT_BPD = 95;

/** The capstone runs, exactly as the derivation makes them. */
export const imoRuns = () => {
  const imo = H.liquidLineDrop(IMO_1);
  const imoErosionalFtS = C.erosionalVelocityFtS({
    mixtureDensityLbFt3: IMO_1.rhoLbFt3, cFactor: IMO_1_C_FACTOR,
  });
  const brassElev = H.elevationAdjustment({
    sg: BRASS.sg, elevChangeFt: BRASS.elevChangeFt, tAvgR: BRASS.tAvgR, zAvg: BRASS.zAvg,
  });
  const brassWey = H.weymouthQ(BRASS);
  const brassPhB = H.panhandleBQ(BRASS);
  const brassGen = H.generalFlowQ({
    ...BRASS, muCp: BRASS_MU_CP, roughnessIn: BRASS_ROUGHNESS_IN,
  });
  const brassOutlet = H.gasOutletPressure({
    equation: 'weymouth',
    qScfd: BRASS_CONTRACT_SCFD,
    p1Psia: BRASS.p1Psia,
    idIn: BRASS.idIn,
    lengthMi: BRASS.lengthMi,
    sg: BRASS.sg,
    tAvgR: BRASS.tAvgR,
    zAvg: BRASS.zAvg,
    efficiency: BRASS.efficiency,
    elevChangeFt: BRASS.elevChangeFt,
  });
  const quaWall = H.requiredWallIn(QUA_IBOE_WALL);
  const quaMaop = H.maopPsig({ ...QUA_IBOE_WALL, wallIn: QUA_IBOE_AS_BUILT_WALL_IN });
  const quaVol = H.lineVolumeBbl(QUA_IBOE_PIG);
  const quaSwept = H.sweptLiquidBbl({ ...QUA_IBOE_PIG, holdupFrac: QUA_IBOE_HOLDUP_FRAC });
  const quaRun = H.pigRun(QUA_IBOE_PIG);
  const quaInterval = H.piggingInterval({
    maxSlugBbl: QUA_IBOE_CATCHER_BBL,
    dropoutBpd: QUA_IBOE_DROPOUT_BPD,
    sweptBbl: quaSwept.sweptBbl,
  });
  return {
    imo,
    imoErosionalFtS,
    brassElev,
    brassWey,
    brassPhB,
    brassGen,
    brassOutlet,
    quaWall,
    quaMaop,
    quaVol,
    quaSwept,
    quaRun,
    quaInterval,
  };
};

/**
 * The eighteen graded fields as [tier, key, value, tolerance], in the order and
 * with the tolerances the capstone publishes. THE TOLERANCE IS ABSOLUTE, in the
 * field's own units: academy_submit_capstone grades abs(v_got - v_exp) <= v_tol.
 */
export const imoCapstoneFields = () => {
  const {
    imo, imoErosionalFtS, brassElev, brassWey, brassPhB, brassGen, brassOutlet,
    quaWall, quaMaop, quaVol, quaSwept, quaRun, quaInterval,
  } = imoRuns();
  return [
    ['beginner', 'imo1_velocity_fts', imo.vFtS, 1e-6],
    ['beginner', 'imo1_reynolds', imo.re, 1e-2],
    ['beginner', 'imo1_friction_factor', imo.f, 1e-9],
    ['beginner', 'imo1_friction_drop_psi', imo.dpFrictionPsi, 1e-5],
    ['beginner', 'imo1_total_drop_psi', imo.dpTotalPsi, 1e-5],
    ['beginner', 'imo1_erosional_velocity_fts', imoErosionalFtS, 1e-6],
    ['intermediate', 'brass_elevation_factor', brassElev.es, 1e-9],
    ['intermediate', 'brass_weymouth_scfd', brassWey.qScfd, 1e3],
    ['intermediate', 'brass_panhandleb_scfd', brassPhB.qScfd, 1e3],
    ['intermediate', 'brass_general_scfd', brassGen.qScfd, 1e3],
    ['intermediate', 'brass_general_friction_factor', brassGen.fDarcy, 1e-9],
    ['intermediate', 'brass_outlet_pressure_psia', brassOutlet.p2Psia, 1e-5],
    ['advanced', 'quaiboe_required_wall_in', quaWall.tRequiredIn, 1e-8],
    ['advanced', 'quaiboe_maop_as_built_psig', quaMaop.maopPsig, 1e-5],
    ['advanced', 'quaiboe_line_volume_bbl', quaVol, 1e-4],
    ['advanced', 'quaiboe_swept_volume_bbl', quaSwept.sweptBbl, 1e-5],
    ['advanced', 'quaiboe_pig_run_hours', quaRun.runHours, 1e-7],
    ['advanced', 'quaiboe_pigging_interval_days', quaInterval.intervalDays, 1e-7],
  ];
};

/** The graded answers keyed by field. A field list already in hand can be passed in. */
export const imoCapstoneValues = (fieldList) =>
  Object.fromEntries((fieldList ?? imoCapstoneFields()).map(([, key, v]) => [key, v]));

/** The grading tolerance of each field, absolute, in the field's own units. */
export const imoCapstoneTolerances = (fieldList) =>
  Object.fromEntries((fieldList ?? imoCapstoneFields()).map(([, key, , tol]) => [key, tol]));

/**
 * Every export of this module that is built on the capstone. The panel guard
 * greps the panel sources for each name; the leak gate skips each one when it
 * walks the teaching surface.
 */
export const CAPSTONE_ONLY_EXPORTS = [
  'IMO_1', 'IMO_1_C_FACTOR',
  'BRASS', 'BRASS_MU_CP', 'BRASS_ROUGHNESS_IN', 'BRASS_CONTRACT_SCFD',
  'QUA_IBOE_WALL', 'QUA_IBOE_AS_BUILT_WALL_IN', 'QUA_IBOE_PIG',
  'QUA_IBOE_HOLDUP_FRAC', 'QUA_IBOE_CATCHER_BBL', 'QUA_IBOE_DROPOUT_BPD',
  'imoRuns', 'imoCapstoneFields', 'imoCapstoneValues', 'imoCapstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

// ---------------------------------------------------------------------------
// The leak guard machinery, the EC3 course's by way of FC1, unchanged.
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
