// THE THREE TEACHING STREAMS OF THE FC8 DIGEST, and the sweeps around them.
//
// THESE ARE NOT THE CAPSTONE PLANTS. The capstones run three other facilities,
// named only in fc8_capstone.mjs, and no bore, differential, span, pressure,
// density, viscosity,
// specific heat ratio, pulse count, K factor, meter factor, rate, gravity,
// vapour pressure, critical pressure, pressure recovery factor, rangeability,
// rated coefficient, diameter, height, level, allowable stress, plate
// thickness, venting factor, fill rate, draw rate, annual loss or control
// efficiency is shared between the two files. Nothing here imports
// fc8_capstone.mjs and nothing there imports this, and gate_capstone_leak.py
// proves both directions.
//
// Every stream exists to reach a BRANCH of an engine that a lesson has to
// teach, and each one says which branch in its comment.

/** ABOH: a gas export meter run inside the published beta range, at a Reynolds
 *  number in the millions. The base case for everything about the orifice. */
export const ABOH = Object.freeze({
  pipeIdIn: 6.065,
  orificeIdIn: 2.9265,
  dpInH2O: 63.8,
  spanInH2O: 200,
  p1Psia: 815.2,
  densityLbFt3: 2.6178,
  viscosityCp: 0.0121,
  k: 1.27,
});

/** BELEMA: a control valve on a light hydrocarbon, NOT choked at its design
 *  point, so the march down the outlet pressure crosses the boundary inside
 *  the digest rather than starting past it. */
export const BELEMA = Object.freeze({
  qGpm: 318.4,
  p1Psia: 246.9,
  p2Psia: 171.3,
  sg: 0.6482,
  pvPsia: 28.74,
  pcPsia: 489.6,
  styleId: 'globeCage',
});

/** BELEMA on gas: the same station's fuel gas let-down, below the terminal
 *  pressure drop ratio at its design point and choked further down the march. */
export const BELEMA_GAS = Object.freeze({
  qScfh: 1_482_000,
  p1Psia: 246.9,
  p2Psia: 171.3,
  gasSg: 0.703,
  tF: 94.6,
  z: 0.92,
  k: 1.27,
  styleId: 'globeCage',
});

/** OGBOGENE: a fixed-roof tank, on the engine's own defaults wherever the
 *  engine has one, because the defaults are what a reader of the shipped app
 *  meets first and the digest has to show what they are. */
export const OGBOGENE = Object.freeze({
  diameterFt: 62.4,
  heightFt: 36.0,
  courseHeightFt: 8,
  liquidLevelFt: 34.6,
  sg: 0.9124,
  fillBblPerHr: 2480,
  drawBblPerHr: 640,
  vapourSpaceHeightFt: 4.2,
  vapourPressurePsia: 2.37,
  throughputBbl: 484_000,
});

/** Beta values for the discharge coefficient table, spanning the published
 *  range and stepping outside it at both ends. */
export const BETA_SWEEP = Object.freeze([0.05, 0.1, 0.2, 0.35, 0.5, 0.6, 0.67, 0.75, 0.8]);
/** Pipe Reynolds numbers, four decades, for the same table. */
export const REYNOLDS_SWEEP = Object.freeze([5e3, 5e4, 5e5, 5e6, 5e7]);
/** Pipe bores, in inches, straddling the small-bore correction. */
export const BORE_SWEEP = Object.freeze([1.049, 2.067, 2.469, 2.8, 3.068, 4.026, 6.065, 10.02]);
/** Differential to static pressure ratios for the expansibility factor. */
export const DP_RATIO_SWEEP = Object.freeze([0.001, 0.005, 0.01, 0.02, 0.04, 0.08, 0.15, 0.25]);
/** Specific heat ratios for the same. */
export const K_SWEEP = Object.freeze([1.1, 1.2, 1.3, 1.4, 1.66]);
/** Differential readings down a fixed span, for the transmitter and the budget.
 *  The three readings between 18 and 14 are there because the two largest terms
 *  of the budget swap places between them, and a sweep that stepped over the
 *  swap would let the digest claim a crossing it never showed. */
export const SPAN_SWEEP = Object.freeze([200, 150, 100, 63.8, 40, 25, 18, 16, 14, 12, 5, 2]);
/** Meter factors either side of the one percent proving screen. */
export const METER_FACTOR_SWEEP = Object.freeze([0.985, 0.99, 0.995, 1, 1.005, 1.01, 1.015, 1.04]);
/** The four straight-run fittings the engine still answers for, plus the one
 *  it refuses by name. */
export const FITTINGS = Object.freeze(['singleElbow', 'twoElbowsSamePlane', 'reducer', 'fullBoreValve', 'twoElbowsDifferentPlanes']);
/** Outlet pressures, marching down across the liquid choking boundary. */
export const P2_MARCH = Object.freeze([200, 171.3, 140, 110, 80, 60, 40, 28.74, 20]);
/** Outlet pressures for the gas march, across the terminal pressure drop ratio. */
export const GAS_P2_MARCH = Object.freeze([230, 200, 171.3, 140, 110, 90, 70, 50, 30]);
/** Valve drops, in psi, against one total system drop, for the authority ladder. */
export const AUTHORITY_SWEEP = Object.freeze([10, 25, 40, 55, 70, 85, 100]);
/** The two noise probes the repaired engine's own header describes: a trickle
 *  at a high pressure ratio, and a large flow at a low one. */
export const NOISE_PROBES = Object.freeze([
  { label: 'a one scfh bleed at a pressure ratio near twelve', p1Psia: 600, p2Psia: 50, qScfh: 1, gasSg: 0.65, tF: 80 },
  { label: 'a hundred million scfh at a pressure ratio near two', p1Psia: 600, p2Psia: 316, qScfh: 100_000_000, gasSg: 0.65, tF: 80 },
  { label: 'a moderate station flow at a pressure ratio near six', p1Psia: 600, p2Psia: 100, qScfh: 2_400_000, gasSg: 0.65, tF: 80 },
]);
/** Travel cases, reaching every state the engine can report. */
export const TRAVEL_CASES = Object.freeze([
  { label: 'all three flows given and all three checks clean', cvRequiredMin: 9.4, cvRequiredNormal: 26.8, cvRequiredMax: 38.5, cvRated: 72 },
  { label: 'no minimum flow given', cvRequiredNormal: 26.8, cvRequiredMax: 38.5, cvRated: 72 },
  { label: 'no maximum flow given', cvRequiredMin: 9.4, cvRequiredNormal: 26.8, cvRated: 72 },
  { label: 'a maximum flow beyond the valve', cvRequiredMin: 9.4, cvRequiredNormal: 26.8, cvRequiredMax: 96.2, cvRated: 72 },
  { label: 'a minimum flow hard against the seat', cvRequiredMin: 0.42, cvRequiredNormal: 26.8, cvRequiredMax: 38.5, cvRated: 72 },
]);
/** Specific gravities for the shell, crossing the water test boundary. */
export const SG_SWEEP = Object.freeze([0.55, 0.65, 0.75, 0.85, 0.9124, 1, 1.15]);
/** Draw rates, in barrels an hour, crossing the venting boundary. */
export const DRAW_SWEEP = Object.freeze([0, 200, 400, 640, 900, 1200, 1600, 2400]);
/** Wetted areas, in square feet, landing in every fire heat-input band. */
export const WETTED_SWEEP = Object.freeze([120, 199, 200, 640, 999, 1000, 1800, 2799, 2800, 4200]);
/** Control efficiencies, in percent, for the loss control arithmetic. */
export const CONTROL_SWEEP = Object.freeze([0, 60, 75, 90, 95, 98, 100]);
