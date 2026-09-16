// THE FC2 TEACHING FIELDS. The OGBIA crude export line, the SOKU gas trunk
// and the OGBIA pigging duty.
//
// These are the lines the LESSONS are written from. The capstone runs
// different lines entirely: see fc2_fields_capstone.mjs, which nothing here
// imports and no lesson writer opens.
//
// Field units throughout: bpd for liquid, scfd for gas, inches of bore,
// feet of length for liquid work and MILES for gas work (the unit the
// published transmission forms are stated in), psia, degR, lb/ft3, cp.

/* ------------------------------------------------------------------ *
 * OGBIA. A crude export line off a flow station: dead liquid downstream
 * of separation, which is the assumption the studio states out loud.
 * ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ *
 * SOKU. A gas trunk line, the four published transmission forms, and the
 * hill it runs over.
 * ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ *
 * The SOKU wall. NPS 12 line pipe in API 5L X52, run through all four
 * B31.8 location classes and against B31.4.
 * ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ *
 * The OGBIA pigging duty. The holdup is an INPUT: the engine says so and
 * the course teaches the seam rather than hiding it.
 * ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ *
 * The erosional limit, as a LINE criterion. The c factor is an input
 * everywhere it is used: the RP 14E rows are HELD FOR LITERATURE.
 * ------------------------------------------------------------------ */

export const EROSIONAL_C_IDS = ['continuous', 'intermittent', 'cleanInhibited'];
/** An id the table does not carry, for the fallback reading. */
export const EROSIONAL_UNKNOWN_ID = 'sandLaden';
/** Four fluids from wet gas to water, so the density term is visible. */
export const EROSIONAL_DENSITY_SWEEP = [5, 20, 45, 62.4];

/* ------------------------------------------------------------------ *
 * Sweep inputs. Everything a digest line prints is either an engine
 * return or an INPUT, and every input this wave chose lives here rather
 * than inline in the generator, so no figure is typed into a template.
 * ------------------------------------------------------------------ */

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
/** The two bores the diameter exponent is measured across, one being twice the
 *  other. They used to be typed inline in the generator and printed as bare
 *  integers in a column header, so a bank quoting 20.000000 in resolved
 *  against an unrelated viscosity row in another tier. */
export const EXPONENT_PROBE_BORES_IN = [10, 20];
/** The speed the published pigging golden states its run hours at. */
export const GOLDEN_PIG_SPEED_FT_S = 5;
