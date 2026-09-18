// Teaching lab for FC8, Metering, Control Valves & Storage. The four panels,
// the course page and the vitest files all read this one module, so a number
// shown to a learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every beta, discharge
// coefficient, expansibility factor, Reynolds number, mass flow, uncertainty
// term, turndown, straight-run diameter, valve coefficient, allowable drop,
// cavitation index, regime word, expansion factor, tank capacity, shell
// thickness, venting rate, wetted area and fire duty below is a return value of
// engines/facilities/metering.js, engines/facilities/controlValve.js or
// engines/facilities/storageTank.js as vendored into this repository.
//
// NOTHING HERE COMPUTES A METERING, VALVE OR TANK QUANTITY. Where a reader
// carries a value this course calls derived, it is arithmetic over numbers the
// engine returned, the arithmetic is stated, and the key name says Derived: a
// difference of two figures, a quotient of two figures, a share of a total.
//
// EVERY RELATIONSHIP GOES THROUGH A RELATION. The digest this course was
// written from states a relationship between two figures only on a line that
// prints both values, their difference and their ratio, and this lab obeys the
// same rule: `relation()` below is the only way two numbers are compared here,
// and a panel prints the triple rather than a sentence about it. If a
// comparison is not computed and printed, it is not asserted.
//
// CONSTANTS ARE MEASURED, NEVER TYPED. Where an engine keeps a conversion, a
// band edge or a threshold to itself, the lab asks the engine a question about
// itself and reads the answer: the inch of water is obtained by dividing a
// returned psi by a given inH2O at two runs that share no other input; every
// band edge is found by bisecting a flag or a WORD the engine returns. A
// constant written as a literal here would be a claim about the engine rather
// than a reading of it. `measuredEdge()` returns the value either side of the
// edge along with it, so an edge always ships with the engine's own two
// differing answers beside it: an edge that does not discriminate is not an
// edge.
//
// NOTHING IS COMPUTED AT IMPORT. Every reader is a function and the module body
// does no engine work at all. See THE IMPORT-TIME DECISION below.
//
// THE GRADING TOLERANCES ARE NOT HELD HERE, at all, in any shape. They are
// derived once in gradedTolerance.js, which the wave's capstone generator
// imports too, and this lab holds no capstone surface whatsoever: no plant, no
// condition, no graded answer, no tolerance. A sibling wave kept a mirror of
// the tolerances inside its lab and shipped it stale twice. There is no slot
// here for one to go stale in, and meteringLab.test.js asserts that this module
// exports nothing whose name matches /tolerance|tol$/i.
//
// UNITS. Field units throughout: inches for bores and plate, inches of water
// and psi for differentials, psia for pressures, lb/ft3 for density, cP for
// viscosity, lb/hr for mass flow, bbl and bbl/hr for tank volumes and rates,
// scfh for venting, ft and ft2 for tank geometry, Btu/hr for fire duty, gpm for
// liquid rate and percent for percentages. Ratios and factors are plain
// numbers.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// belongs anywhere in it.
//
// THE CLOCK. No engine this course calls takes a date or a seed. Every reader
// is a pure function of its arguments, nothing is memoised, and a clock gate in
// meteringLab.test.js proves it under two faked system dates.
//
// THE IMPORT-TIME DECISION, stated because a sibling lab decided the other way.
// FC3's lab runs its measured block AT IMPORT, and that code ships in the
// browser bundle and executes for every learner who opens the course. This wave
// measures more than that one does: twelve band edges, each found by bisecting
// an engine call, and the orifice edges bisect `orificeFlow`, which itself
// iterates the discharge coefficient against the Reynolds number up to sixty
// times per call. One orifice edge is therefore up to twelve thousand engine
// evaluations. So THIS LAB MEASURES LAZILY, INSIDE THE READERS, and freezes
// nothing:
//
//   1. The course page imports this module eagerly, so import-time work would
//      run for every learner who opens the course page, whether or not they
//      ever open a panel. A reader runs only when a panel asks for it.
//   2. A frozen table could not answer the learner's own bore, outlet pressure,
//      draw rate or liquid level, and those live inputs are the whole point of
//      these panels. An import-time table would be dead weight beside a live
//      path that has to exist anyway.
//   3. A frozen table is a second copy of an engine result, which is the exact
//      shape of defect this wave's tolerance rule exists to prevent.
//
// The cost of that choice is measured rather than assumed: meteringLab.test.js
// times every measured reader and prints the figure, and pins that the whole
// measured surface stays inside a budget a panel render can afford.

/* eslint-disable import/namespace */
import * as M from '@petrolord/engines/engines/facilities/metering.js';
import * as V from '@petrolord/engines/engines/facilities/controlValve.js';
import * as T from '@petrolord/engines/engines/facilities/storageTank.js';

// ---------------------------------------------------------------------------
// THE TEACHING STREAMS, copied VERBATIM from the wave's fc8_fields.mjs. These
// are NOT the capstone facilities: the capstones run three other plants at
// other conditions, named only in the wave's capstone generator, and nothing in
// this file is a graded answer or an input to one.
// ---------------------------------------------------------------------------

/** ABOH: a gas export meter run inside the published beta range. */
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

/** BELEMA: a control valve on a light hydrocarbon. It sits below its choking
 *  boundary at its design point, so a march down the outlet pressure crosses
 *  the boundary rather than starting past it. */
export const BELEMA = Object.freeze({
  qGpm: 318.4,
  p1Psia: 246.9,
  p2Psia: 171.3,
  sg: 0.6482,
  pvPsia: 28.74,
  pcPsia: 489.6,
  styleId: 'globeCage',
});

/** BELEMA on gas: the same station's fuel gas let-down. */
export const BELEMA_GAS = Object.freeze({
  qScfh: 1482000,
  p1Psia: 246.9,
  p2Psia: 171.3,
  gasSg: 0.703,
  tF: 94.6,
  z: 0.92,
  k: 1.27,
  styleId: 'globeCage',
});

/** OGBOGENE: a fixed-roof tank, on the engine's own defaults wherever it has
 *  one, because the defaults are what a reader of the shipped app meets. */
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
  throughputBbl: 484000,
});

/** A second orifice run for the inch of water probe, sharing NO input with
 *  ABOH. Two runs that share nothing but the engine are what make the factor a
 *  constant rather than a coincidence. */
export const INCH_PROBE_B = Object.freeze({
  pipeIdIn: 10.02,
  orificeIdIn: 3.114,
  dpInH2O: 17.9,
  p1Psia: 1290.4,
  densityLbFt3: 5.118,
  viscosityCp: 0.0173,
  k: 1.19,
});

export const BETA_SWEEP = Object.freeze([0.05, 0.1, 0.2, 0.35, 0.5, 0.6, 0.67, 0.75, 0.8]);
export const REYNOLDS_SWEEP = Object.freeze([5e3, 5e4, 5e5, 5e6, 5e7]);
export const BORE_SWEEP = Object.freeze([1.049, 2.067, 2.469, 2.8, 3.068, 4.026, 6.065, 10.02]);
export const SPAN_SWEEP = Object.freeze([200, 150, 100, 63.8, 40, 25, 18, 16, 14, 12, 5, 2]);
export const FITTINGS = Object.freeze(['singleElbow', 'twoElbowsSamePlane', 'reducer', 'fullBoreValve', 'twoElbowsDifferentPlanes']);
export const STRAIGHT_RUN_BETAS = Object.freeze([0.2, 0.4, 0.5, 0.6, 0.67, 0.75]);
export const P2_MARCH = Object.freeze([200, 171.3, 140, 110, 80, 60, 40, 28.74, 20]);
export const GAS_P2_MARCH = Object.freeze([230, 200, 171.3, 140, 110, 90, 70, 50, 30]);
export const SG_SWEEP = Object.freeze([0.55, 0.65, 0.75, 0.85, 0.9124, 1, 1.15]);
export const DRAW_SWEEP = Object.freeze([0, 200, 400, 640, 900, 1200, 1600, 2400]);
export const WETTED_SWEEP = Object.freeze([120, 199, 200, 640, 999, 1000, 1800, 2799, 2800, 4200]);

// ---------------------------------------------------------------------------
// Helpers. Pure, and not one of them computes a metering, valve or tank
// quantity.
// ---------------------------------------------------------------------------

/** A state an engine has no answer for, RETURNED rather than thrown. */
const softOf = (r) => (r && r.error ? r.error : null);

/**
 * THE ONLY WAY TWO NUMBERS ARE COMPARED IN THIS COURSE. Both values, their
 * difference and their ratio, computed and carried together, so a panel prints
 * the triple rather than writing a sentence nobody checked.
 */
export const relation = (label, firstLabel, first, secondLabel, second) => ({
  label,
  firstLabel,
  first,
  secondLabel,
  second,
  differenceDerived: first - second,
  ratioDerived: first / second,
});

/**
 * A BAND EDGE, MEASURED. `read` is anything the engine returns that changes
 * across the edge: a boolean flag, a word, a number that steps. The search
 * starts from a point where the reading is the one `lo` gives and halves until
 * it is not.
 *
 * IT RETURNS THE READINGS AS WELL AS THE EDGE, because an edge with no
 * disagreement across it is not an edge. A bisection whose predicate never
 * flips returns the top of its own bracket and looks exactly like an answer,
 * which is how a measured constant turns back into a typed one without anybody
 * noticing. `discriminates` is the check, and it is computed here and asserted
 * in meteringLab.test.js rather than trusted.
 *
 * DISCRIMINATION IS MEASURED ACROSS THE FINAL BRACKET rather than across the
 * starting one. Several of this course's predicates are not monotone over the
 * whole sweep: whether the lead in the uncertainty budget is clear reads true
 * at both ends of the span and false in a band between them, so a check that
 * compared the bracket ends would call a real crossing no crossing at all.
 * What makes an edge an edge is that the engine answers differently on the two
 * sides of it, and those two sides are `readingAt` and `readingJustPast`.
 */
export const measuredEdge = (lo, hi, read, halvings = 200) => {
  const below = read(lo);
  const above = read(hi);
  let l = lo;
  let h = hi;
  for (let i = 0; i < halvings; i += 1) {
    const mid = (l + h) / 2;
    if (read(mid) === below) l = mid; else h = mid;
  }
  const at = (l + h) / 2;
  // The reading ON the edge, and the reading at the first value past it. The
  // second is the one that names what the edge gives way TO, because the
  // bracket bottom may be several rungs further down a ladder.
  const readingAt = read(l);
  const readingJustPast = read(h);
  return {
    at,
    from: lo,
    to: hi,
    readingFrom: below,
    readingTo: above,
    readingAt,
    readingJustPast,
    halvings,
    discriminates: readingAt !== readingJustPast,
  };
};

// ---------------------------------------------------------------------------
// SECTION 1: what the three engines export, and what they refuse.
// ---------------------------------------------------------------------------

const names = (mod) => Object.keys(mod).sort();
const fns = (mod) => names(mod).filter((k) => typeof mod[k] === 'function');
const data = (mod) => names(mod).filter((k) => typeof mod[k] !== 'function');

/** States the three modules have no answer for. Every message comes back from
 *  the engine and not one of them is written as a literal in this file. */
export const METERING_SOFT_PROBES = Object.freeze([
  ['a beta at or above one', () => M.dischargeCoefficient({ beta: 1, reynolds: 1e6, pipeIdIn: 6.065 })],
  ['a coefficient with no Reynolds number', () => M.dischargeCoefficient({ beta: 0.5, pipeIdIn: 6.065 })],
  ['a coefficient with no pipe bore', () => M.dischargeCoefficient({ beta: 0.5, reynolds: 1e6 })],
  ['an orifice bore larger than the pipe', () => M.orificeFlow({ ...ABOH, orificeIdIn: 7.5 })],
  ['a flow with no differential', () => M.orificeFlow({ ...ABOH, dpInH2O: 0 })],
  ['a compressible flow with no static pressure', () => M.orificeFlow({ ...ABOH, p1Psia: 0 })],
  ['a differential at or above the static pressure', () => M.orificeFlow({ ...ABOH, dpInH2O: 26000 })],
  ['a plate sized for no flow at all', () => M.sizeOrifice({ ...ABOH, targetMassLbHr: 0 })],
  ['a plate the top of the bracket cannot pass', () => M.sizeOrifice({ ...ABOH, targetMassLbHr: 900000 })],
  ['a plate the bottom of the bracket already passes', () => M.sizeOrifice({ ...ABOH, targetMassLbHr: 10 })],
  ['a permanent loss with no coefficient to use', () => M.permanentLoss({ dpInH2O: 63.8, beta: 0.4825 })],
  ['a transmitter reading above its own span', () => M.transmitterUncertaintyPct({ dpInH2O: 260, spanInH2O: 200 })],
  ['a transmitter with no span', () => M.transmitterUncertaintyPct({ dpInH2O: 63.8 })],
  ['a budget with no beta', () => M.orificeUncertainty({})],
  ['a budget in which every stated uncertainty is zero', () => M.orificeUncertainty({
    beta: 0.4825,
    cdUncertaintyPct: 0,
    expansibilityUncertaintyPct: 0,
    boreUncertaintyPct: 0,
    pipeUncertaintyPct: 0,
    dpUncertaintyPct: 0,
    densityUncertaintyPct: 0,
  })],
  ['a turbine volume with no K factor', () => M.turbineVolume({ pulses: 2640000 })],
  ['a turbine volume at a meter factor of zero', () => M.turbineVolume({ pulses: 2640000, kFactorPulsesPerBbl: 848.2, meterFactor: 0 })],
  ['a straight run for two elbows in different planes', () => M.straightRunDiameters({ beta: 0.5, upstreamFitting: 'twoElbowsDifferentPlanes' })],
  ['a straight run above the last row of the table', () => M.straightRunDiameters({ beta: 0.95 })],
  ['a straight run for a fitting the table has no column for', () => M.straightRunDiameters({ beta: 0.5, upstreamFitting: 'aFlowConditioner' })],
]);

export const VALVE_SOFT_PROBES = Object.freeze([
  ['a liquid sizing with no vapour pressure', () => V.liquidValve({ ...BELEMA, pvPsia: 0 })],
  ['a liquid sizing with the outlet above the inlet', () => V.liquidValve({ ...BELEMA, p2Psia: 300 })],
  ['a liquid sizing at no rate', () => V.liquidValve({ ...BELEMA, qGpm: 0 })],
  ['a critical pressure below the vapour pressure', () => V.liquidValve({ ...BELEMA, pcPsia: 10 })],
  ['a piping geometry factor outside its own band', () => V.liquidValve({ ...BELEMA, fp: 3 })],
  ['a pressure recovery factor above one', () => V.liquidValve({ ...BELEMA, flOverride: 1.4 })],
  ['a valve style the table has no row for', () => V.liquidValve({ ...BELEMA, styleId: 'aGuessedTrim' })],
  ['a gas sizing with the outlet above the inlet', () => V.gasValve({ ...BELEMA_GAS, p2Psia: 300 })],
  ['a gas sizing with no flowing temperature', () => V.gasValve({ ...BELEMA_GAS, tF: null })],
  ['a gas sizing at a compressibility of zero', () => V.gasValve({ ...BELEMA_GAS, z: 0 })],
  ['a terminal pressure drop ratio above one', () => V.gasValve({ ...BELEMA_GAS, xtOverride: 1.4 })],
  ['an authority with no system drop to take a share of', () => V.valveAuthority({ dpValvePsi: 40 })],
  ['a valve drop larger than the whole system drop', () => V.valveAuthority({ dpValvePsi: 140, dpSystemTotalPsi: 100 })],
  ['a characteristic chosen from no authority', () => V.characteristicFor({})],
  ['a noise indication with no outlet pressure', () => V.noiseIndication({ p1Psia: 600, p2Psia: 0, qScfh: 2400000, gasSg: 0.65, tF: 80 })],
  ['a noise indication with no gas gravity', () => V.noiseIndication({ p1Psia: 600, p2Psia: 100, qScfh: 2400000, tF: 80 })],
  ['a travel check with no rated coefficient', () => V.travelCheck({ cvRequiredNormal: 26.8 })],
  ['a travel check on a characteristic this module does not know', () => V.travelCheck({ cvRated: 72, characteristic: 'quickOpening' })],
  ['a travel check at a rangeability of one', () => V.travelCheck({ cvRated: 72, rangeability: 1 })],
]);

export const TANK_SOFT_PROBES = Object.freeze([
  ['a tank with no height', () => T.tankCapacity({ diameterFt: 62.4 })],
  ['a fill height below nothing', () => T.tankCapacity({ diameterFt: 62.4, heightFt: 36, fillHeightFt: -4 })],
  ['a course with no specific gravity', () => T.shellCourse({ diameterFt: 62.4, courseBottomHeightFt: 0, liquidLevelFt: 34.6 })],
  ['a course at an allowable stress of zero', () => T.shellCourse({ diameterFt: 62.4, courseBottomHeightFt: 0, liquidLevelFt: 34.6, sg: 0.9124, designStressPsi: 0 })],
  ['a course under a negative minimum plate', () => T.shellCourse({ diameterFt: 62.4, courseBottomHeightFt: 0, liquidLevelFt: 34.6, sg: 0.9124, minimumThicknessIn: -1 })],
  ['thermal venting with no capacity', () => T.thermalVenting({ nominalBbl: 0 })],
  ['a latitude factor beyond anything the package will apply', () => T.thermalVenting({ nominalBbl: 19608, latitudeFactor: 3 })],
  ['a movement rate given as a negative number', () => T.movementVenting({ fillBblPerHr: -100 })],
  ['a wetted area with no liquid level', () => T.wettedAreaFt2({ diameterFt: 62.4 })],
  ['fire venting with no wetted area', () => T.fireVenting({ wettedFt2: 0 })],
  ['an environment factor used as a penalty', () => T.fireVenting({ wettedFt2: 5881, environmentFactor: 1.4 })],
  ['a product that boils at ambient', () => T.evaporativeLosses({ diameterFt: 62.4, vapourSpaceHeightFt: 4.2, vapourPressurePsia: 15.2 })],
  ['losses with no vapour pressure at all', () => T.evaporativeLosses({ diameterFt: 62.4, vapourSpaceHeightFt: 4.2 })],
  ['a control efficiency left out rather than stated as zero', () => T.lossControl({ uncontrolledLbYr: 40000 })],
  ['a control efficiency above a hundred percent', () => T.lossControl({ uncontrolledLbYr: 40000, controlEfficiencyPct: 140 })],
]);

/** SECTION 1: the three engines, what each exports, and what each refuses. */
export const engineScope = () => ({
  modules: [
    { name: 'metering.js', exports: names(M).length, functions: fns(M), data: data(M) },
    { name: 'controlValve.js', exports: names(V).length, functions: fns(V), data: data(V) },
    { name: 'storageTank.js', exports: names(T).length, functions: fns(T), data: data(T) },
  ],
  meteringSoftStates: METERING_SOFT_PROBES.map(([label, fn]) => ({ label, error: softOf(fn()) })),
  valveSoftStates: VALVE_SOFT_PROBES.map(([label, fn]) => ({ label, error: softOf(fn()) })),
  tankSoftStates: TANK_SOFT_PROBES.map(([label, fn]) => ({ label, error: softOf(fn()) })),
});

// ---------------------------------------------------------------------------
// THE METER RUN. Sections 2, 3, 4, 5, 6, 11, 12, 13 and 14.
// ---------------------------------------------------------------------------

/**
 * SECTION 2 and SECTION 13, LIVE. One orifice run and the uncertainty budget
 * that belongs to it, at whatever bores, differential, static pressure, fluid
 * and transmitter span the learner is holding.
 *
 * The budget's differential term comes FROM THE TRANSMITTER whenever a reading
 * and a span are both given, which is what stops a screen showing a transmitter
 * figure beside a budget that disagrees with it. The result says which of the
 * two routes the engine took, in the engine's own words.
 */
export const meterRun = (input = ABOH) => {
  const flow = M.orificeFlow({
    pipeIdIn: input.pipeIdIn,
    orificeIdIn: input.orificeIdIn,
    dpInH2O: input.dpInH2O,
    p1Psia: input.p1Psia,
    densityLbFt3: input.densityLbFt3,
    viscosityCp: input.viscosityCp,
    k: input.k,
  });
  if (flow.error) {
    return { input, refused: true, error: flow.error };
  }
  const budget = M.orificeUncertainty({
    beta: flow.beta, dpInH2O: input.dpInH2O, spanInH2O: input.spanInH2O,
  });
  const typedBudget = M.orificeUncertainty({ beta: flow.beta });
  const transmitter = M.transmitterUncertaintyPct({
    dpInH2O: input.dpInH2O, spanInH2O: input.spanInH2O,
  });
  const loss = M.permanentLoss({ dpInH2O: input.dpInH2O, beta: flow.beta, cd: flow.cd });
  const coefficient = M.dischargeCoefficient({
    beta: flow.beta, reynolds: flow.reynolds, pipeIdIn: input.pipeIdIn,
  });
  return {
    input,
    refused: false,
    beta: flow.beta,
    cd: flow.cd,
    expansibility: flow.expansibility,
    reynolds: flow.reynolds,
    massLbHr: flow.massLbHr,
    volumetricFt3HrAtFlowing: flow.volumetricFt3HrAtFlowing,
    dpPsi: flow.dpPsi,
    betaInPublishedRange: flow.betaInPublishedRange,
    warning: flow.warning,
    reynoldsBasis: flow.reynoldsBasis,
    smallBoreCorrectionApplied: coefficient.error ? null : coefficient.smallBoreCorrectionApplied,
    budget: budget.error ? null : {
      totalUncertaintyPct: budget.totalUncertaintyPct,
      contributions: budget.contributions.map((c) => ({
        name: c.name,
        sensitivity: c.sensitivity,
        uncertaintyPct: c.uncertaintyPct,
        contributionPct: c.contributionPct,
        shareOfVariancePct: c.shareOfVariancePct,
      })),
      dominant: budget.dominant,
      dominantShareOfVariancePct: budget.dominantShareOfVariancePct,
      runnerUp: budget.runnerUp,
      runnerUpShareOfVariancePct: budget.runnerUpShareOfVariancePct,
      dominanceIsClear: budget.dominanceIsClear,
      differentialUncertaintyPct: budget.differentialUncertaintyPct,
      differentialUncertaintySource: budget.differentialUncertaintySource,
      note: budget.note,
      leadRelation: relation(
        'the two largest shares of the variance on this run at this reading',
        `${budget.dominant}, share of variance in percent`, budget.dominantShareOfVariancePct,
        `${budget.runnerUp}, share of variance in percent`, budget.runnerUpShareOfVariancePct,
      ),
    },
    budgetError: budget.error || null,
    typedRouteSource: typedBudget.error ? null : typedBudget.differentialUncertaintySource,
    routeRelation: (budget.error || typedBudget.error) ? null : relation(
      'the total uncertainty on this beta, transmitter derived against the typed default',
      'with the differential term from the transmitter, percent', budget.totalUncertaintyPct,
      "with the engine's typed default differential term, percent", typedBudget.totalUncertaintyPct,
    ),
    transmitter: transmitter.error ? null : {
      uncertaintyPctOfReading: transmitter.uncertaintyPctOfReading,
      differentialTurndown: transmitter.differentialTurndown,
      flowTurndown: transmitter.flowTurndown,
      flowTurndownLimit: transmitter.flowTurndownLimit,
      differentialTurndownLimit: transmitter.differentialTurndownLimit,
      turndownNote: transmitter.turndownNote,
      warning: transmitter.warning,
    },
    transmitterError: transmitter.error || null,
    permanentLoss: loss.error ? null : {
      lossInH2O: loss.lossInH2O, lossFraction: loss.lossFraction, cd: loss.cd,
    },
    permanentLossError: loss.error || null,
  };
};

/**
 * SECTION 3. The inch of water, MEASURED. The factor is module-private in
 * metering.js and this lab never types it. It is obtained by dividing a
 * returned differential in psi by the differential in inches of water that was
 * given, at two runs that share no other input, and the two are required to
 * agree to the last bit a double carries.
 */
export const inchOfWater = () => {
  const a = M.orificeFlow(ABOH);
  const b = M.orificeFlow(INCH_PROBE_B);
  const factorA = a.dpPsi / ABOH.dpInH2O;
  const factorB = b.dpPsi / INCH_PROBE_B.dpInH2O;
  return {
    runs: [
      { label: 'run one', dpInH2O: ABOH.dpInH2O, dpPsi: a.dpPsi, factorDerived: factorA },
      { label: 'run two', dpInH2O: INCH_PROBE_B.dpInH2O, dpPsi: b.dpPsi, factorDerived: factorB },
    ],
    factorDerived: factorA,
    agreeToTheLastBit: factorA === factorB,
    sharedInputs: Object.keys(ABOH).filter((k) => ABOH[k] === INCH_PROBE_B[k]),
  };
};

/** SECTION 4. The discharge coefficient across beta and across Reynolds
 *  number, with the span of the cells inside the published range. */
export const coefficientSurface = (pipeIdIn = ABOH.pipeIdIn) => {
  const cells = [];
  const rows = BETA_SWEEP.map((beta) => ({
    beta,
    cells: REYNOLDS_SWEEP.map((reynolds) => {
      const r = M.dischargeCoefficient({ beta, reynolds, pipeIdIn });
      const cell = {
        beta, reynolds, cd: r.cd, inPublishedRange: r.betaInPublishedRange,
      };
      cells.push(cell);
      return cell;
    }),
  }));
  const inRange = cells.filter((c) => c.inPublishedRange);
  const largest = inRange.reduce((a, c) => (c.cd > a.cd ? c : a));
  const smallest = inRange.reduce((a, c) => (c.cd < a.cd ? c : a));
  return {
    pipeIdIn,
    reynolds: [...REYNOLDS_SWEEP],
    rows,
    inPublishedRangeCount: inRange.length,
    countTree: 'the cross product of the betas and the Reynolds numbers this course sweeps',
    countRule: 'a cell counts when the engine returns betaInPublishedRange true for it',
    largest,
    smallest,
    spanRelation: relation(
      'the span of the coefficient over the cells inside the published range',
      `largest, at beta ${largest.beta} and Reynolds ${largest.reynolds}`, largest.cd,
      `smallest, at beta ${smallest.beta} and Reynolds ${smallest.reynolds}`, smallest.cd,
    ),
    assumedCoefficientRefusal: softOf(M.permanentLoss({ dpInH2O: ABOH.dpInH2O, beta: 0.4825 })),
  };
};

/**
 * SECTION 5. The small bore correction, and the bore it turns on at, found by
 * bisecting the engine's own flag rather than by reading a number out of the
 * source.
 */
export const smallBoreBoundary = (beta = 0.5, reynolds = 1e6) => {
  const applied = (pipeIdIn) => M.dischargeCoefficient({ beta, reynolds, pipeIdIn }).smallBoreCorrectionApplied;
  const edge = measuredEdge(BORE_SWEEP[BORE_SWEEP.length - 1], BORE_SWEEP[0], applied);
  const rows = BORE_SWEEP.map((pipeIdIn) => {
    const r = M.dischargeCoefficient({ beta, reynolds, pipeIdIn });
    return { pipeIdIn, cd: r.cd, correctionApplied: r.smallBoreCorrectionApplied };
  });
  const below = rows.find((r) => r.correctionApplied && !rows.some((x) => x.correctionApplied && x.pipeIdIn > r.pipeIdIn));
  const above = rows.find((r) => !r.correctionApplied);
  return {
    beta,
    reynolds,
    edge,
    rows,
    eitherSide: relation(
      'the coefficient either side of the small bore boundary',
      `at a bore of ${below.pipeIdIn} in, where the correction is applied`, below.cd,
      `at a bore of ${above.pipeIdIn} in, where it is not`, above.cd,
    ),
  };
};

/**
 * SECTION 6. The two edges of the published beta range and the beta the trade
 * warning starts above, all three found by bisecting what the engine returns:
 * the flag for the range, the warning going from null to a sentence for the
 * trade.
 */
export const publishedBetaRange = (pipeIdIn = ABOH.pipeIdIn, reynolds = 1e6) => {
  const inRange = (beta) => M.dischargeCoefficient({ beta, reynolds, pipeIdIn }).betaInPublishedRange;
  const lower = measuredEdge(0.01, 0.5, inRange);
  const upper = measuredEdge(0.99, 0.5, inRange);
  const quiet = (beta) => M.orificeFlow({ ...ABOH, orificeIdIn: beta * ABOH.pipeIdIn }).warning === null;
  const trade = measuredEdge(0.5, 0.74, quiet);
  return {
    lower,
    upper,
    trade,
    aboveTheRange: M.orificeFlow({ ...ABOH, orificeIdIn: 0.841 * ABOH.pipeIdIn }).warning,
    tradeWarning: M.orificeFlow({ ...ABOH, orificeIdIn: 0.65 * ABOH.pipeIdIn }).warning,
  };
};

/**
 * SECTIONS 11, 12 and 14. The transmitter down its span, the budget re-run at
 * every reading, and the three readings the engine's own answers turn over at,
 * each found by bisecting what it returns.
 */
export const downTheSpan = (input = ABOH) => {
  const flow = M.orificeFlow(input);
  const beta = flow.beta;
  const span = input.spanInH2O;
  const rows = SPAN_SWEEP.filter((d) => d <= span).map((dpInH2O) => {
    const t = M.transmitterUncertaintyPct({ dpInH2O, spanInH2O: span });
    const u = M.orificeUncertainty({ beta, dpInH2O, spanInH2O: span });
    return {
      dpInH2O,
      uncertaintyPctOfReading: t.uncertaintyPctOfReading,
      differentialTurndown: t.differentialTurndown,
      flowTurndown: t.flowTurndown,
      warningFires: t.warning !== null,
      totalUncertaintyPct: u.totalUncertaintyPct,
      dominant: u.dominant,
      dominantShareOfVariancePct: u.dominantShareOfVariancePct,
      dominanceIsClear: u.dominanceIsClear,
    };
  });
  const top = rows[0];
  const bottom = rows[rows.length - 1];
  const quiet = (d) => M.transmitterUncertaintyPct({ dpInH2O: d, spanInH2O: span }).warning === null;
  const warningEdge = measuredEdge(span, 1, quiet);
  const dominantAt = (d) => M.orificeUncertainty({ beta, dpInH2O: d, spanInH2O: span }).dominant;
  const dominanceEdge = measuredEdge(span, 1, dominantAt);
  const clearAt = (d) => M.orificeUncertainty({ beta, dpInH2O: d, spanInH2O: span }).dominanceIsClear;
  const clearEdge = measuredEdge(span, 1, clearAt);
  const atChange = M.orificeUncertainty({ beta, dpInH2O: dominanceEdge.at, spanInH2O: span });
  const atChangeT = M.transmitterUncertaintyPct({ dpInH2O: dominanceEdge.at, spanInH2O: span });
  const limits = M.transmitterUncertaintyPct({ dpInH2O: span, spanInH2O: span });
  return {
    beta,
    spanInH2O: span,
    accuracyPctOfSpan: rows.length ? rows[0].uncertaintyPctOfReading : null,
    rows,
    spanRelation: relation(
      'the transmitter contribution at the top and the bottom of this span',
      `at a reading of ${top.dpInH2O} in H2O, percent of reading`, top.uncertaintyPctOfReading,
      `at a reading of ${bottom.dpInH2O} in H2O, percent of reading`, bottom.uncertaintyPctOfReading,
    ),
    warningEdge,
    flowTurndownAtWarning: M.transmitterUncertaintyPct({ dpInH2O: warningEdge.at, spanInH2O: span }).flowTurndown,
    differentialTurndownAtWarning: M.transmitterUncertaintyPct({ dpInH2O: warningEdge.at, spanInH2O: span }).differentialTurndown,
    flowTurndownLimit: limits.flowTurndownLimit,
    differentialTurndownLimit: limits.differentialTurndownLimit,
    limitRelation: relation(
      'the two limits the engine holds, which are the same rule written in two quantities',
      'the differential turndown limit', limits.differentialTurndownLimit,
      'the flow turndown limit', limits.flowTurndownLimit,
    ),
    turndownNote: M.transmitterUncertaintyPct({ dpInH2O: input.dpInH2O, spanInH2O: span }).turndownNote,
    dominanceEdge,
    dominantAbove: dominanceEdge.readingFrom,
    dominantBelow: dominanceEdge.readingTo,
    totalAtChangePct: atChange.totalUncertaintyPct,
    flowTurndownAtChange: atChangeT.flowTurndown,
    clearEdge,
    clearNote: M.orificeUncertainty({ beta, dpInH2O: span, spanInH2O: span }).note,
    closeNote: M.orificeUncertainty({ beta, dpInH2O: 16, spanInH2O: span }).note,
    aboveTheSpanRefusal: softOf(M.transmitterUncertaintyPct({ dpInH2O: span * 1.3, spanInH2O: span })),
  };
};

// ---------------------------------------------------------------------------
// THE TWO WITHHELD ANSWERS. Sections 16 and 28, and the register of Section 31.
// ---------------------------------------------------------------------------

/**
 * SECTION 16. The straight-run table, the column the engine refuses by name,
 * and the ceiling above the last row.
 *
 * THE WITHHELD COLUMN IS SHOWN AS WITHHELD. The engine returns withheld true, a
 * null requirement and its own reason, and this reader carries all three. A
 * blank, a zero, a dash or a placeholder would read as a number the tool failed
 * to compute rather than as an answer that is being refused.
 */
export const straightRun = (betas = STRAIGHT_RUN_BETAS) => {
  const rows = FITTINGS.map((fitting) => ({
    fitting,
    cells: betas.map((beta) => {
      const r = M.straightRunDiameters({ beta, upstreamFitting: fitting });
      return {
        beta,
        withheld: r.withheld === true,
        upstreamDiameters: r.withheld ? null : (r.error ? null : r.upstreamDiameters),
        downstreamDiameters: r.withheld ? null : (r.error ? null : r.downstreamDiameters),
        reason: r.error || null,
      };
    }),
  }));
  const refusedFittings = rows
    .filter((r) => r.cells.length > 0 && r.cells.every((c) => c.withheld))
    .map((r) => r.fitting);
  const stepped = (beta) => M.straightRunDiameters({ beta }).downstreamDiameters;
  const downstreamEdge = measuredEdge(betas[0], betas[betas.length - 1], stepped);
  return {
    betas: [...betas],
    rows,
    refusedFittings,
    countTree: 'the fitting names this course asks for, each asked at every beta in the table',
    countRule: 'a fitting counts as refused when the engine returns withheld true at every beta asked',
    withheldReason: M.STRAIGHT_RUN_WITHHELD_FITTINGS.twoElbowsDifferentPlanes,
    withheldReasonIsTheEngineConstant:
      M.straightRunDiameters({ beta: 0.5, upstreamFitting: 'twoElbowsDifferentPlanes' }).error
      === M.STRAIGHT_RUN_WITHHELD_FITTINGS.twoElbowsDifferentPlanes,
    ceilingRefusal: softOf(M.straightRunDiameters({ beta: 0.95 })),
    answeredRowNote: M.straightRunDiameters({ beta: 0.5 }).note,
    downstreamEdge,
    tableMaxBeta: M.straightRunDiameters({ beta: 0.5 }).tableMaxBeta,
  };
};

/**
 * SECTION 28, LIVE. The fire case: the duty computed and the vent refused.
 *
 * THE VENT IS NULL AT EVERY WETTED AREA and the engine says why, by name, in a
 * sentence it also exports as a constant. Nothing in this course grades it,
 * nothing downstream of it is graded, and no panel may present it as an answer.
 * A learner can drive the liquid level and the diameter anywhere they like here
 * and watch the refusal come back every time, which is the point.
 */
export const fireCase = ({
  diameterFt = OGBOGENE.diameterFt,
  liquidLevelFt = OGBOGENE.liquidLevelFt,
  environmentFactor = 1.0,
} = {}) => {
  const wetted = T.wettedAreaFt2({ diameterFt, liquidLevelFt });
  if (wetted.error) return { refused: true, error: wetted.error };
  const duty = T.fireVenting({ wettedFt2: wetted.areaFt2, environmentFactor });
  if (duty.error) return { refused: true, error: duty.error, wetted };
  const full = T.fireVenting({ wettedFt2: wetted.areaFt2 });
  return {
    refused: false,
    diameterFt,
    liquidLevelFt,
    areaFt2: wetted.areaFt2,
    effectiveHeightFt: wetted.effectiveHeightFt,
    heightCapNote: wetted.note,
    band: duty.band,
    qBtuHr: duty.qBtuHr,
    environmentFactor: duty.environmentFactor,
    ventScfhAir: duty.ventScfhAir,
    ventWithheld: duty.ventWithheld,
    ventWithheldReason: duty.ventWithheldReason,
    reasonIsTheExportedConstant: duty.ventWithheldReason === T.FIRE_VENT_WITHHELD,
    comparisonNote: duty.note,
    warning: duty.warning,
    creditRelation: environmentFactor === 1 ? null : relation(
      'the fire duty on this tank, with and without the stated drainage credit',
      'with no credit, Btu/hr', full.qBtuHr,
      `with a stated environment factor of ${environmentFactor}, Btu/hr`, duty.qBtuHr,
    ),
    penaltyRefusal: softOf(T.fireVenting({ wettedFt2: wetted.areaFt2, environmentFactor: 1.4 })),
  };
};

/** SECTION 28. The heat input bands, walked, with every edge found by bisecting
 *  the band NAME the engine returns. */
export const fireBands = () => {
  const rows = WETTED_SWEEP.map((wettedFt2) => {
    const r = T.fireVenting({ wettedFt2 });
    return {
      wettedFt2, band: r.band, qBtuHr: r.qBtuHr, ventScfhAir: r.ventScfhAir, ventWithheld: r.ventWithheld,
    };
  });
  const bandAt = (a) => T.fireVenting({ wettedFt2: a }).band;
  const distinct = [...new Set(rows.map((r) => r.band))];
  const edges = [];
  for (let i = 0; i < distinct.length - 1; i += 1) {
    const from = rows.find((r) => r.band === distinct[i]).wettedFt2;
    const to = rows.find((r) => r.band === distinct[i + 1]).wettedFt2;
    const e = measuredEdge(from, to, bandAt);
    edges.push({
      from: distinct[i],
      to: distinct[i + 1],
      edge: e,
      qAtEdgeBtuHr: T.fireVenting({ wettedFt2: e.at }).qBtuHr,
    });
  }
  return {
    rows,
    bands: distinct,
    countTree: 'the band names the engine returns across the wetted areas this course sweeps',
    countRule: 'a band counts once for each distinct band string the engine returned over that sweep',
    edges,
    everyVentIsNull: rows.every((r) => r.ventScfhAir === null && r.ventWithheld === true),
    withheldReason: T.FIRE_VENT_WITHHELD,
  };
};

/**
 * SECTION 31. The register, built out of the ENGINES' OWN SENTENCES rather than
 * typed here. Each row carries the id, which engine it belongs to, a label for
 * the item, and the engine's own words about it, fetched by calling the engine
 * or by reading a constant it exports. Nothing in this register is a figure and
 * no lesson, panel or question is graded on any of it.
 */
export const heldRegister = () => {
  const flow = M.orificeFlow(ABOH);
  const straight = M.straightRunDiameters({ beta: 0.5 });
  const turbine = M.turbineVolume({ pulses: 2640000, kFactorPulsesPerBbl: 848.2 });
  const liquid = V.liquidValve(BELEMA);
  const authority = V.valveAuthority({ dpValvePsi: 40, dpSystemTotalPsi: 100 });
  const noise = V.noiseIndication({
    p1Psia: 600, p2Psia: 100, qScfh: 2400000, gasSg: 0.65, tF: 80,
  });
  const course = T.shellCourse({
    diameterFt: OGBOGENE.diameterFt, courseBottomHeightFt: 0,
    liquidLevelFt: OGBOGENE.liquidLevelFt, sg: OGBOGENE.sg,
  });
  const thermal = T.thermalVenting({ nominalBbl: 19608.4845 });
  const losses = T.evaporativeLosses({
    diameterFt: OGBOGENE.diameterFt,
    vapourSpaceHeightFt: OGBOGENE.vapourSpaceHeightFt,
    vapourPressurePsia: OGBOGENE.vapourPressurePsia,
    throughputBbl: OGBOGENE.throughputBbl,
  });
  const fire = T.fireVenting({ wettedFt2: 5881.0614 });
  const rows = [
    ['H1', 'metering', 'the published lower Reynolds number limit of the correlation', flow.reynoldsBasis, false],
    ['H2', 'metering', 'the straight run for two elbows in different planes', M.STRAIGHT_RUN_WITHHELD_FITTINGS.twoElbowsDifferentPlanes, true],
    ['H3', 'metering', 'the remaining straight-run columns', straight.note, false],
    ['H4', 'metering', 'the temperature and pressure correction tables behind a net volume', turbine.grossNote, false],
    ['H5', 'valve', 'the valve style pressure recovery factor and terminal ratio table', V.VALVE_STYLE_PROVENANCE, false],
    ['H6', 'valve', 'the cavitation index thresholds', liquid.sigmaBasis, false],
    ['H7', 'valve', 'the noise pressure ratio bands and the stream power bands', noise.note, false],
    ['H8', 'valve', 'the valve authority screen boundaries', authority.thresholdBasis, false],
    ['H9', 'valve', 'the Reynolds number factor a viscous liquid sizing would need', liquid.limitNote, false],
    ['H10', 'valve', 'a real aerodynamic noise prediction', noise.note, false],
    ['H11', 'tank', 'the minimum shell plate thickness band table', course.minimumThicknessBasis, false],
    ['H12', 'tank', 'the diameter above which the one-foot method is replaced', course.methodNote, false],
    ['H13', 'tank', 'the thermal venting factors, the latitude factor and the insulation credit', thermal.basis, false],
    ['H14', 'tank', 'the turnover factor a working loss would need', losses.turnoverFactorNote, false],
    ['W1', 'tank', 'the relation that turns a fire duty into a required vent capacity', fire.ventWithheldReason, true],
  ];
  return {
    rows: rows.map(([id, engine, item, words, refusal]) => ({
      id, engine, item, words, refusal,
    })),
    count: rows.length,
    countTree: 'the register written out in this reader, one row per item',
    countRule: "an item counts when the engine states in its own returned text, or in a constant it exports, that the package does not carry it, does not cite it, or refuses to answer it",
    refusalCount: rows.filter((r) => r[4]).length,
    refusalCountRule: 'an item counts as a refusal when the engine returns a withheld flag or a refusal in place of a number',
    bothRefusalsProved: [
      {
        claim: 'straightRunDiameters returns withheld true for two elbows in different planes',
        holds: M.straightRunDiameters({ beta: 0.5, upstreamFitting: 'twoElbowsDifferentPlanes' }).withheld === true,
      },
      {
        claim: 'fireVenting returns ventWithheld true and a null vent capacity at every wetted area',
        holds: WETTED_SWEEP.every((a) => {
          const r = T.fireVenting({ wettedFt2: a });
          return r.ventWithheld === true && r.ventScfhAir === null;
        }),
      },
    ],
  };
};

// ---------------------------------------------------------------------------
// THE VALVE. Sections 17, 18, 19, 20, 21, 22 and 24.
// ---------------------------------------------------------------------------

/**
 * SECTIONS 17, 18 and 19, LIVE. A liquid valve at whatever outlet pressure the
 * learner is holding, with the stated drop, the allowable drop, the drop the
 * valve actually uses, the coefficient, the cavitation index and the regime
 * WORD THE ENGINE RETURNS. The panel never decides the word.
 */
export const liquidAt = (p2Psia, input = BELEMA) => {
  const r = V.liquidValve({ ...input, p2Psia });
  if (r.error) return { p2Psia, refused: true, error: r.error };
  const onStatedDrop = (input.qGpm / r.fp) * Math.sqrt(input.sg / r.dpStatedPsi);
  return {
    p2Psia,
    refused: false,
    cv: r.cv,
    fl: r.fl,
    ff: r.ff,
    fp: r.fp,
    dpStatedPsi: r.dpStatedPsi,
    dpAllowablePsi: r.dpAllowablePsi,
    dpUsedPsi: r.dpUsedPsi,
    choked: r.choked,
    flashing: r.flashing,
    sigma: r.sigma,
    sigmaBasis: r.sigmaBasis,
    regime: r.regime,
    reynoldsFactorApplied: r.reynoldsFactorApplied,
    limitNote: r.limitNote,
    warning: r.warning,
    // The same equation the engine uses, evaluated on the FULL STATED DROP,
    // which is the hand calculation this section exists to price. It is
    // arithmetic on figures the engine returned and it is named as derived.
    cvOnStatedDropDerived: onStatedDrop,
    sizingRelation: relation(
      `the coefficient at an outlet of ${p2Psia} psia, the engine against a sizing on the full stated drop`,
      'the engine, sizing on the drop the valve can use', r.cv,
      'a sizing on the full stated drop', onStatedDrop,
    ),
  };
};

/** SECTIONS 17 and 18. The march down the outlet pressure, the boundary found
 *  by bisecting the engine's own choked flag, and the regime ladder found by
 *  bisecting the WORD the engine returns. */
export const chokingMarch = (input = BELEMA) => {
  const rows = P2_MARCH.map((p2) => liquidAt(p2, input));
  const chokedAt = (p2) => V.liquidValve({ ...input, p2Psia: p2 }).choked;
  const chokeEdge = measuredEdge(P2_MARCH[0], P2_MARCH[P2_MARCH.length - 1], chokedAt);
  const atChoke = liquidAt(chokeEdge.at, input);
  const regimeAt = (p2) => V.liquidValve({ ...input, p2Psia: p2 }).regime;
  // The ladder, rung by rung: each edge starts from just below the previous
  // one, so every rung is found by bisecting the engine's own word rather than
  // by knowing in advance how many rungs there are.
  const ladder = [];
  let from = P2_MARCH[0];
  const floor = P2_MARCH[P2_MARCH.length - 1];
  for (let i = 0; i < 6 && from > floor; i += 1) {
    const e = measuredEdge(from, floor, regimeAt);
    if (!e.discriminates) break;
    const at = liquidAt(e.at, input);
    ladder.push({
      from: e.readingFrom, to: e.readingJustPast, outletPsia: e.at, sigmaThere: at.sigma, edge: e,
    });
    from = e.at - 1e-9;
  }
  return {
    input,
    rows,
    chokedRowCount: rows.filter((r) => !r.refused && r.choked).length,
    countTree: 'the outlet pressures this course marches, each run through the liquid valve',
    countRule: 'a row counts when the engine returns choked true',
    chokeEdge,
    atChoke,
    ladder,
    cavitatingThreshold: V.SIGMA_THRESHOLDS.cavitating,
    incipientThreshold: V.SIGMA_THRESHOLDS.incipient,
    noVapourPressureRefusal: softOf(V.liquidValve({ ...input, pvPsia: 0 })),
    flashing: (() => {
      const flashAt = liquidAt(input.pvPsia - 2, input);
      return {
        outletPsia: input.pvPsia - 2,
        vapourPressurePsia: input.pvPsia,
        flashing: flashAt.flashing,
        regime: flashAt.regime,
        cv: flashAt.cv,
        warning: flashAt.warning,
        onsetRelation: relation(
          'the outlet pressure at which flashing starts, against the stated vapour pressure',
          'the outlet pressure where the engine turns the flashing flag on, psia',
          measuredEdge(P2_MARCH[0], floor, (p2) => V.liquidValve({ ...input, p2Psia: p2 }).flashing).at,
          'the stated vapour pressure, psia', input.pvPsia,
        ),
      };
    })(),
    criticalRatio: {
      atThisService: V.liquidCriticalRatioFF({ pvPsia: input.pvPsia, pcPsia: input.pcPsia }),
      approachingZero: V.liquidCriticalRatioFF({ pvPsia: 0, pcPsia: input.pcPsia }),
      atTheCriticalPoint: V.liquidCriticalRatioFF({ pvPsia: input.pcPsia, pcPsia: input.pcPsia }),
    },
  };
};

/** SECTION 20. The gas march across the terminal pressure drop ratio, with the
 *  two thirds floor and the onset found by bisecting the choked flag. */
export const gasMarch = (input = BELEMA_GAS) => {
  const at = (p2) => {
    const r = V.gasValve({ ...input, p2Psia: p2 });
    return r.error ? { p2Psia: p2, refused: true, error: r.error } : {
      p2Psia: p2,
      refused: false,
      x: r.x,
      xChoked: r.xChoked,
      xUsed: r.xUsed,
      y: r.y,
      cv: r.cv,
      xt: r.xt,
      fk: r.fk,
      choked: r.choked,
      warning: r.warning,
    };
  };
  const rows = GAS_P2_MARCH.map(at);
  const chokedAt = (p2) => V.gasValve({ ...input, p2Psia: p2 }).choked;
  const edge = measuredEdge(GAS_P2_MARCH[0], GAS_P2_MARCH[GAS_P2_MARCH.length - 1], chokedAt);
  const chokedRows = rows.filter((r) => !r.refused && r.choked);
  const floorValues = [...new Set(chokedRows.map((r) => r.y))];
  return {
    input,
    rows,
    chokedRowCount: chokedRows.length,
    countTree: 'the outlet pressures this course marches on gas, each run through the gas valve',
    countRule: 'a row counts when the engine returns choked true',
    edge,
    atEdge: at(edge.at),
    expansionFloor: floorValues.length === 1 ? floorValues[0] : null,
    // THE FLOOR IS THE SAME ON EVERY CHOKED ROW, and that is asserted. How far
    // it sits from two thirds is MEASURED and printed rather than claimed: the
    // engine forms it as one less a quotient, and one less a third is one unit
    // in the last place above two thirds in a double. A sentence saying the two
    // agree to the last bit would be a claim this arithmetic does not support,
    // so the difference is on the page instead.
    floorIsTheSameOnEveryChokedRow: floorValues.length === 1,
    floorLessTwoThirdsDerived: floorValues.length === 1 ? floorValues[0] - 2 / 3 : null,
    floorIsTwoThirdsExactly: floorValues.length === 1 && floorValues[0] === 2 / 3,
    floorIsOneUlpFromTwoThirds: floorValues.length === 1
      && floorValues[0] !== 2 / 3
      && Math.abs(floorValues[0] - 2 / 3) <= Number.EPSILON / 2,
    specificHeatFactors: [1.1, 1.2, 1.3, 1.4, 1.66].map((k) => ({ k, fk: V.specificHeatFactor(k) })),
    styleProvenance: V.VALVE_STYLE_PROVENANCE,
    styles: V.VALVE_STYLES.map((s) => ({ id: s.id, label: s.label, fl: s.fl, xt: s.xt })),
  };
};

// ---------------------------------------------------------------------------
// THE TANK. Sections 25, 26 and 27.
// ---------------------------------------------------------------------------

/** SECTION 25, LIVE. The tank and the exact barrel. */
export const tank = ({
  diameterFt = OGBOGENE.diameterFt,
  heightFt = OGBOGENE.heightFt,
  fillHeightFt = OGBOGENE.liquidLevelFt,
} = {}) => {
  const c = T.tankCapacity({ diameterFt, heightFt, fillHeightFt });
  if (c.error) return { refused: true, error: c.error };
  return {
    refused: false,
    diameterFt,
    heightFt,
    fillHeightFt,
    crossSectionFt2: c.crossSectionFt2,
    nominalBbl: c.nominalBbl,
    nominalFt3: c.nominalFt3,
    workingBbl: c.workingBbl,
    bblPerFt: c.bblPerFt,
    ft3PerBbl: c.ft3PerBbl,
    capacityRelation: relation(
      'the nominal and the working capacity of this tank',
      'nominal, to the top of the shell, bbl', c.nominalBbl,
      'working, to the stated level, bbl', c.workingBbl,
    ),
    negativeFillRefusal: softOf(T.tankCapacity({ diameterFt, heightFt, fillHeightFt: -1 })),
  };
};

/** SECTION 26. The courses, and the gravity at which the water test stops
 *  taking the bottom course, found by bisecting the engine's governing word. */
export const shell = ({
  diameterFt = OGBOGENE.diameterFt,
  heightFt = OGBOGENE.heightFt,
  courseHeightFt = OGBOGENE.courseHeightFt,
  liquidLevelFt = OGBOGENE.liquidLevelFt,
  sg = OGBOGENE.sg,
} = {}) => {
  const r = T.shellCourses({
    diameterFt, heightFt, courseHeightFt, liquidLevelFt, sg,
  });
  if (r.error) return { refused: true, error: r.error };
  const governingAt = (g) => T.shellCourse({
    diameterFt, courseBottomHeightFt: 0, liquidLevelFt, sg: g,
  }).governing;
  const edge = measuredEdge(SG_SWEEP[0], SG_SWEEP[SG_SWEEP.length - 1], governingAt);
  return {
    refused: false,
    courses: r.courses.map((c) => ({
      course: c.course,
      bottomFt: c.bottomFt,
      topFt: c.topFt,
      headFt: c.headFt,
      tDesignIn: c.tDesignIn,
      tTestIn: c.tTestIn,
      requiredIn: c.requiredIn,
      governing: c.governing,
      note: c.note,
    })),
    count: r.count,
    thickestCourse: r.thickestCourse,
    thickestRequiredIn: r.thickestRequiredIn,
    governingReason: r.governingReason,
    governingCourseIsAlwaysTheBottom: r.governingCourseIsAlwaysTheBottom,
    testGovernedCount: r.testGovernedCount,
    minimumGovernedCount: r.minimumGovernedCount,
    firstMinimumGovernedCourse: r.firstMinimumGovernedCourse,
    lastTestGovernedCourse: r.lastTestGovernedCourse,
    minimumThicknessIn: r.minimumThicknessIn,
    summary: r.summary,
    gravityRows: SG_SWEEP.map((g) => {
      const c = T.shellCourse({
        diameterFt, courseBottomHeightFt: 0, liquidLevelFt, sg: g,
      });
      return {
        sg: g, tDesignIn: c.tDesignIn, tTestIn: c.tTestIn, requiredIn: c.requiredIn, governing: c.governing,
      };
    }),
    waterTestEdge: edge,
    minimumThicknessBasis: r.courses[0].minimumThicknessBasis,
    methodNote: r.courses[0].methodNote,
  };
};

/**
 * SECTION 27, LIVE. Normal venting in each direction at whatever rates the
 * learner is holding, with the governing direction as THE WORD THE ENGINE
 * RETURNS. The engine forms one predicate and computes it once, because two
 * expressions disagreed at the tie.
 */
export const venting = ({
  nominalBbl,
  diameterFt = OGBOGENE.diameterFt,
  heightFt = OGBOGENE.heightFt,
  fillBblPerHr = OGBOGENE.fillBblPerHr,
  drawBblPerHr = OGBOGENE.drawBblPerHr,
  highVolatility = false,
  insulated = false,
  latitudeFactor = 1.0,
} = {}) => {
  const capacity = Number.isFinite(nominalBbl)
    ? nominalBbl
    : T.tankCapacity({ diameterFt, heightFt }).nominalBbl;
  const r = T.normalVenting({
    nominalBbl: capacity, fillBblPerHr, drawBblPerHr, highVolatility, insulated, latitudeFactor,
  });
  if (r.error) return { refused: true, error: r.error, nominalBbl: capacity };
  const uninsulated = T.thermalVenting({ nominalBbl: capacity, latitudeFactor });
  const insulatedRun = T.thermalVenting({ nominalBbl: capacity, latitudeFactor, insulated: true });
  const lowMove = T.movementVenting({ fillBblPerHr, drawBblPerHr });
  const highMove = T.movementVenting({ fillBblPerHr, drawBblPerHr, highVolatility: true });
  return {
    refused: false,
    nominalBbl: capacity,
    fillBblPerHr,
    drawBblPerHr,
    highVolatility,
    insulated,
    thermalInbreathingScfh: r.thermal.inbreathingScfh,
    thermalOutbreathingLowScfh: r.thermal.outbreathingScfhLowVolatility,
    thermalOutbreathingHighScfh: r.thermal.outbreathingScfhHighVolatility,
    movementOutbreathingScfh: r.movement.outbreathingScfh,
    movementInbreathingScfh: r.movement.inbreathingScfh,
    outbreathingScfh: r.outbreathingScfh,
    inbreathingScfh: r.inbreathingScfh,
    governing: r.governing,
    warning: r.warning,
    thermalWarning: r.thermalWarning,
    aboveProportionalLimit: r.thermal.aboveProportionalLimit,
    scfhPerBbl: r.thermal.scfhPerBbl,
    latitudeFactor: r.thermal.latitudeFactor,
    basis: r.thermal.basis,
    insulationNote: insulatedRun.note,
    directionRelation: relation(
      'the two directions on this tank at its stated rates',
      'total outbreathing, scfh', r.outbreathingScfh,
      'total inbreathing, scfh', r.inbreathingScfh,
    ),
    insulationRelation: relation(
      'the thermal inbreathing of this tank, insulated against uninsulated',
      'uninsulated, scfh', uninsulated.inbreathingScfh,
      "insulated at the engine's stated credit, scfh", insulatedRun.inbreathingScfh,
    ),
    volatilityRelation: relation(
      'the movement outbreathing at the same fill rate, high volatility against low',
      'high volatility, scfh', highMove.outbreathingScfh,
      'low volatility, scfh', lowMove.outbreathingScfh,
    ),
  };
};

/** SECTION 27. The draw rate at which vacuum takes the case, found by
 *  bisecting the engine's own governing word, and the sweep around it. */
export const vacuumOnset = ({
  nominalBbl,
  diameterFt = OGBOGENE.diameterFt,
  heightFt = OGBOGENE.heightFt,
  fillBblPerHr = OGBOGENE.fillBblPerHr,
  highVolatility = false,
} = {}) => {
  const capacity = Number.isFinite(nominalBbl)
    ? nominalBbl
    : T.tankCapacity({ diameterFt, heightFt }).nominalBbl;
  const governingAt = (draw) => T.normalVenting({
    nominalBbl: capacity, fillBblPerHr, drawBblPerHr: draw, highVolatility,
  }).governing;
  const edge = measuredEdge(DRAW_SWEEP[0], DRAW_SWEEP[DRAW_SWEEP.length - 1], governingAt);
  return {
    nominalBbl: capacity,
    fillBblPerHr,
    rows: DRAW_SWEEP.map((drawBblPerHr) => {
      const r = T.normalVenting({
        nominalBbl: capacity, fillBblPerHr, drawBblPerHr, highVolatility,
      });
      return {
        drawBblPerHr,
        inbreathingScfh: r.inbreathingScfh,
        outbreathingScfh: r.outbreathingScfh,
        governing: r.governing,
      };
    }),
    edge,
    vacuumWarning: T.normalVenting({
      nominalBbl: capacity, fillBblPerHr, drawBblPerHr: DRAW_SWEEP[DRAW_SWEEP.length - 1], highVolatility,
    }).warning,
    proportionalWarning: T.thermalVenting({ nominalBbl: 250000 }).warning,
  };
};

// ---------------------------------------------------------------------------
// The readers a panel asks for by name, so a rename fails a test rather than
// emptying a panel.
// ---------------------------------------------------------------------------

export const READERS = Object.freeze([
  'engineScope', 'meterRun', 'inchOfWater', 'coefficientSurface', 'smallBoreBoundary',
  'publishedBetaRange', 'downTheSpan', 'straightRun', 'fireCase', 'fireBands',
  'heldRegister', 'liquidAt', 'chokingMarch', 'gasMarch', 'tank', 'shell',
  'venting', 'vacuumOnset',
]);

/** The readers that MEASURE a constant by bisecting something the engine
 *  returns. Named so the measured gate in meteringLab.test.js cannot go stale,
 *  and so the import-time decision above can be priced rather than argued. */
export const MEASURING_READERS = Object.freeze([
  'inchOfWater', 'smallBoreBoundary', 'publishedBetaRange', 'downTheSpan',
  'straightRun', 'fireBands', 'chokingMarch', 'gasMarch', 'shell', 'vacuumOnset',
]);
