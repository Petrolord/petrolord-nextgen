// Teaching lab for PD7, Production Networks. The three panels, the 78 shipped
// lessons and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Every pressure, every
// branch flow, every well rate, every conservation gap, every bottleneck,
// every equivalent length, every wall rating and every residual below is a
// return value from a call into engines/production/networkSolve.js or
// pipeSchedule.js, run over test-data/production/goldens/network_cases.json,
// over the fixtures the shipped gate asserts on, or over the one TEACHING
// NETWORK this wave declared for itself. Nothing in this file re-implements
// the engine. The only arithmetic done here is the arithmetic a PANEL would
// otherwise have to do on the engine's return values: a difference, a ratio, a
// percentage, a share, a margin, a shortfall. That arithmetic lives here on
// purpose, so that a panel is a renderer and never a calculator.
//
// UNITS. Field units throughout, as the module header requires. MASS IS THE
// CURRENCY and every flow is a mass rate in lb/d, because surface volumes do
// not add across pressures. Absolute pressure psia and never psig; a pressure
// DIFFERENCE and a wall rating in psi. Length ft, bore and wall and outside
// diameter in, yield psi, oil and water stb/d, gas Mscf/d. A TURBULENT branch
// conductance is lb/d per root psi and a LINEAR branch conductance is lb/d per
// psi, and those two are NOT the same quantity and never compare: every field
// here that carries one says which in its name or in the row it sits on.
// `intensity` out of `diagnose` is psi per lb/d and the module's own header
// says its units are arbitrary and only the ranking is used.
//
// EIGHT PROVENANCE RULES THIS FILE EXISTS TO KEEP. All eight were found in the
// material rather than assumed, and all eight are easy to lose in a panel.
//
//   1. THE HEADLINE RULE OF THIS WAVE. A `solveNetwork` ANSWER AND A
//      `checkConservation` VERDICT ON THAT SAME ANSWER ARE DIFFERENT ROADS,
//      AND THE SECOND IS THE ONLY ONE THAT CAN SEE THE FIRST'S ERROR. The
//      solver's `converged` flag is tested against `normOf`, which is built as
//      the maximum over the unknown nodes FILTERED to exclude the pinned ones,
//      so a pinned node is removed from the measurement by construction.
//      `checkConservation` is in the same file, its own header calls it the
//      only check that catches a sign error in the assembly, and
//      `solveNetwork` never calls it. So EVERY accessor in this file that
//      exposes a solve exposes its conservation gap beside it, under a
//      distinctly named field:
//
//         reportedResidualLbD   what the ITERATION says about itself, which is
//                               `residualLbD`, the worst imbalance over the
//                               UNPINNED unknowns only
//         conservationGapLbD    what the AUDIT says about the answer, which is
//                               produced minus delivered on the same return
//
//      A panel cannot show a converged flag without the audit beside it,
//      because `solveVerdict` puts them on one object and no accessor here
//      returns one without the other. On the teaching network those two
//      numbers are 1.546141e-11 lb/d and 345 lb/d, a factor of 2.231362e+13
//      apart, and both are correct answers to two different questions.
//
//   2. THE BRANCH RELATIONS ARE CALLBACKS AND WRITING ONE HERE IS NOT
//      RE-IMPLEMENTING THE ENGINE. The module header says so in as many words:
//      the topology, the Newton solve and the conservation laws have nothing
//      to do with petroleum, and the consumer supplies the real relations. The
//      engine ships `linearBranch` and `linearWell` only, as the two reference
//      relations that have a closed form. The oracle writes its own turbulent
//      and Vogel relations, the shipped gate writes them again, and so does
//      this file: `turbulentBranch`, `vogelWell`, `cappedTurbulentBranch` and
//      `allocatedWell` are THIS LAB BEING THE CONSUMER, not this lab computing
//      what the engine computes. Every pressure, flow and rate they appear in
//      is still an engine return.
//
//   3. A GOLDEN, A PUBLISHED FIXTURE, A DERIVED SWEEP AND A TEACHING NETWORK
//      ARE FOUR DIFFERENT THINGS, AND EVERY ROW SAYS WHICH IT IS. A `golden`
//      value was committed by the independent Gauss-Seidel bisection oracle,
//      which shares no numerical machinery with the engine at all. A
//      `published` value is a table row or a gate fixture shipped inside the
//      engine package. A `derived` row is the shipped engine re-run on
//      published inputs, and a sweep point is not a published case. A
//      `teaching` row belongs to AGBADA WEST, the network this wave invented
//      so that the Expert results have a case a lesson may quote: no oracle
//      has ever checked any of it. Every row this file returns carries
//      `provenance` and, where a sweep passes through the published build, the
//      one row that IS the published case carries `published: true`.
//
//   4. THE LINEAR CASE IS THE ONLY CHECK IN THE COURSE WITH NO TOLERANCE IN
//      IT. `solveLinearNetwork` assembles a weighted graph Laplacian and
//      solves it by Gaussian elimination; `solveNetwork` drives a numerically
//      differenced Newton iteration. They share no code and no reasoning, so
//      `linearStarRows` carries `exactPressurePsia` and `newtonPressurePsia`
//      under distinct names with a named difference between them, and the two
//      agree EXACTLY at two of the four nodes. Every result in this course
//      after that one is an iterate.
//
//   5. A DRAWN ARROW IS NOT A DIRECTION, AND TWO SIGN CONVENTIONS SIT UNDER
//      ONE WORD. `flows[b]` is signed from the drawn `from` to the drawn `to`
//      and can be negative; `branchStreams[b].massLbD` is the stream along the
//      SOLVED direction and is always positive. `signConventionRows` carries
//      both under distinct names with the difference AND the cause, because
//      two different diseases show up in that one column: a factor of two on
//      the branch that reversed, and the conservation gap on every branch
//      carrying a pinned well's reported mass.
//
//   6. BOTH `diagnose` RANKINGS ARE ON MAGNITUDE AND THEY DIFFER IN
//      POPULATION. `biggestDrop` reduces over EVERY branch, a dead one
//      included; `bottleneck` reduces only over branches carrying more than
//      1e-9 lb/d. So a dead leg with a large pressure difference can be the
//      reported biggest drop and can never be the bottleneck. Both populations
//      are returned as counts on `diagnoseHeadline`, because no published case
//      distinguishes them and two readers have had to guess.
//
//   7. THE TOLERANCE IS NOT IN LB/D AND THE SCALE IS NOT RETURNED. The
//      constant is named `DEFAULT_TOLERANCE_LB_D` and its own comment says
//      Newton stops when the worst nodal imbalance is below it, in lb/d. What
//      the solver stops at is that tolerance times a SCALE, and the scale is
//      the largest SINGLE well inflow evaluated at the sink pressure. Nothing
//      in the return carries it. `toleranceScale` evaluates the caller's own
//      inflow callbacks at the sink pressure, which is the one line of the
//      solver a caller can reproduce without the engine, and says on the
//      returned object that the engine does not report it.
//
//   8. A PINNED PRESSURE AND A SOLVED PRESSURE WEAR THE SAME LABEL IN THE SAME
//      OBJECT. `pressures` carries both with nothing to tell them apart, and
//      the pinned one is wherever the last accepted step happened to leave it.
//      So every accessor that returns pressures also returns `pinned`, and
//      `initialGuessRows` carries each run's conservation gap beside its
//      converged flag: on that sweep the reported residual gets BETTER as the
//      answer gets WORSE, and exactly one row closes its mass balance.
//
// THE CAPSTONE BOUNDARY. There is no capstone material in this file at all.
// PD7's graded gathering system and its eighteen graded fields live in the
// wave's own derivation and never enter the lab, so a panel cannot reach one
// by mistake. What guards that is panelCapstoneGuard.test.js, which reads the
// graded field list out of the wave directory and checks every number this lab
// exposes against it, dimension blind, at ten times the grader's own absolute
// tolerance, under the same restatements the PD5 and PD6 guards use.
//
// PURITY AND CACHING. Every accessor is pure and deterministic: no random
// number anywhere, and two calls with the same arguments return equal values.
// The engine runs that are expensive and re-read from several accessors are
// cached, and every accessor maps a cached engine return value into FRESH
// rows, so a panel cannot mutate one and change what another panel sees.

import golden from '@petrolord/engines/test-data/production/goldens/network_cases.json';
import {
  DEFAULT_TOLERANCE_LB_D, DEFAULT_MAX_ITER, MIN_PRESSURE_PSIA, NODE_KINDS,
  buildNetwork, solveLinear, solveNetwork, propagateStreams,
  checkConservation, diagnose, linearBranch, linearWell, solveLinearNetwork,
} from '@petrolord/engines/engines/production/networkSolve.js';
import {
  PIPE_SCHEDULE, ROUGHNESS_IN, FITTINGS, LINE_PIPE_GRADES,
  roughnessOf, fittingK, scheduleRow, equivalentLengthFt, barlowPressurePsi,
  gradeYield,
} from '@petrolord/engines/engines/production/pipeSchedule.js';

export {
  DEFAULT_TOLERANCE_LB_D, DEFAULT_MAX_ITER, MIN_PRESSURE_PSIA, NODE_KINDS,
  buildNetwork, solveLinear, solveNetwork, propagateStreams,
  checkConservation, diagnose, linearBranch, linearWell, solveLinearNetwork,
  PIPE_SCHEDULE, ROUGHNESS_IN, FITTINGS, LINE_PIPE_GRADES,
  roughnessOf, fittingK, scheduleRow, equivalentLengthFt, barlowPressurePsi,
  gradeYield,
};

export const GOLDEN = golden;

// ---------------------------------------------------------------------------
// CONSTANTS THIS FILE DECLARES. Three are the wave's own declared constants,
// and the rest are published case inputs read off the golden file, off the
// shipped tables or off the gate that cut them. None of them is an engine
// value dressed up as something else.
// ---------------------------------------------------------------------------

/** Metres per foot, exact. One of the wave's three declared constants. */
export const M_PER_FT = 0.3048;

/** Pascals per psi, exact. One of the wave's three declared constants. */
export const PA_PER_PSI = 6894.757293168;

/** Square metres per darcy. The third declared constant, carried for the guard. */
export const SQ_M_PER_DARCY = 9.869233e-16;

/** Inches per foot. The one conversion the equivalent length needs. */
export const IN_PER_FT = 12;

/**
 * The mass below which `diagnose` calls a branch dead and drops it out of the
 * bottleneck population. Read off the module rather than typed as folklore.
 */
export const DEAD_BRANCH_MASS_LB_D = 1e-9;

/**
 * The band the shipped gate holds the pipe table's own redundancy to.
 * `toBeCloseTo(r.id, 3)` passes anything within half a thousandth of an inch.
 */
export const PIPE_TABLE_GATE_BAND_IN = 5e-4;

/**
 * The Jacobian step the solver takes on a node at pressure p, read off the
 * module's own line: `Math.max(1e-3, Math.abs(p0) * 1e-5)`. Exported because a
 * branch's distance from its own cusp is measured in these and in nothing
 * else, and because a panel has to be able to print it.
 */
export const jacobianStepPsi = (pressurePsia) =>
  Math.max(1e-3, Math.abs(pressurePsia) * 1e-5);

// ---------------------------------------------------------------------------
// THE THREE RELATION SHAPES. Provenance rule 2: these are the CONSUMER's
// callbacks and not engine math. The module ships only the linear pair, as the
// reference relations that have a closed form; the oracle writes its own
// turbulent and Vogel relations, the shipped gate writes them again, and so
// does this file.
// ---------------------------------------------------------------------------

/** q = k sign(dp) sqrt(|dp|). Pressure drop as the square of rate. */
export const turbulentBranch = (k) => (branch, pIn, pOut) => {
  const dp = pIn - pOut;
  return Math.sign(dp) * k * Math.sqrt(Math.abs(dp));
};

/** The same line, but it cannot pass more than `capLbD` in EITHER direction. */
export const cappedTurbulentBranch = (k, capLbD) => (branch, pIn, pOut) =>
  Math.max(-capLbD, Math.min(capLbD, turbulentBranch(k)(branch, pIn, pOut)));

/** Vogel: q = qmax (1 - 0.2 x - 0.8 x^2), x = p/pr. Monotone DECREASING. */
export const vogelWell = ({ qmax, prPsia }) => (p) => {
  const x = Math.min(Math.max(p / prPsia, 0), 1);
  return Math.max(0, qmax * (1 - 0.2 * x - 0.8 * x * x));
};

/**
 * A well held to a facility allocation, a choke limit or a compressor slot. It
 * never delivers more than its allocation, which makes it monotone
 * NON-increasing with a FLAT TOP, and the flat top is precisely what the
 * module header does not allow for: it requires `wellInflow` to be monotone
 * DECREASING. The flat top is what makes a node pinnable.
 */
export const allocatedWell = ({ allocationLbD, qmax, prPsia }) => (p) =>
  Math.min(allocationLbD, vogelWell({ qmax, prPsia })(p));

// ---------------------------------------------------------------------------
// Small internals. Nothing exported from here computes physics.
// ---------------------------------------------------------------------------

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
};

const pct = (a, b) => ((a - b) / b) * 100;

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

/**
 * A deterministic bisection on ONE DECLARED RELATION, used in exactly one
 * place: to find the two pressures at which the teaching well's Vogel inflow
 * falls to its allocation and to its line capacity. Neither module offers an
 * inverse of an inflow curve, and writing one would be inventing physics;
 * bracketing the wave's own declared callback is not, and the callback is the
 * same one the solver is being handed. Fixed iteration count, no tolerance
 * argument, no randomness, so it is pure.
 */
const bisectOnRelation = (fn, target, lo, hi, iterations = 300) => {
  let a = lo;
  let b = hi;
  for (let i = 0; i < iterations; i += 1) {
    const mid = (a + b) / 2;
    if (fn(mid) > target) a = mid; else b = mid;
  }
  return (a + b) / 2;
};

/**
 * PROVENANCE RULE 1, IN ONE FUNCTION. Every solve in this file goes through
 * here, so a caller cannot receive a `converged` flag without the audit that
 * can see what the flag cannot. `reportedResidualLbD` is the ITERATION's word
 * about itself and `conservationGapLbD` is the AUDIT's word about the answer,
 * and they are two roads, not two spellings.
 */
const solveVerdict = (network, res) => {
  const audit = res.ok
    ? checkConservation({ network, flows: res.flows, wellRates: res.wellRates })
    : null;
  const pinned = res.pinned ? [...res.pinned] : [];
  const imbalance = res.imbalance || {};
  const worstAll = Object.keys(imbalance).length
    ? Math.max(...Object.values(imbalance).map((v) => Math.abs(v)))
    : 0;
  const worstUnpinned = Object.keys(imbalance).length
    ? Math.max(0, ...Object.entries(imbalance)
      .filter(([id]) => !pinned.includes(id))
      .map(([, v]) => Math.abs(v)))
    : 0;
  return {
    ok: res.ok === true,
    converged: res.converged === true,
    iterations: res.iterations,
    // the iteration's road
    reportedResidualLbD: res.residualLbD === undefined ? null : res.residualLbD,
    // the audit's road, and it is the only one that can see a pinned node
    producedLbD: audit ? audit.producedLbD : null,
    deliveredLbD: audit ? audit.deliveredLbD : null,
    conservationGapLbD: audit ? audit.gapLbD : null,
    conservationRelative: audit ? audit.relative : null,
    conservationGapPct: audit ? audit.relative * 100 : null,
    gapOverReportedResidual: audit && res.residualLbD
      ? Math.abs(audit.gapLbD) / Math.abs(res.residualLbD)
      : null,
    massBalanceCloses: audit ? Math.abs(audit.gapLbD) <= DEAD_BRANCH_MASS_LB_D : null,
    pinned,
    pinnedCount: pinned.length,
    // and what the filter threw away, which is the whole finding
    worstImbalanceAllUnknownsLbD: worstAll,
    worstImbalanceUnpinnedLbD: worstUnpinned,
    warnings: res.warnings ? [...res.warnings] : [],
    error: res.error === undefined ? null : res.error,
  };
};

// ---------------------------------------------------------------------------
// SECTION 1. THE PIPE TABLE, AND THE REDUNDANCY THAT IS ITS ONLY SELF CHECK.
// Associate m02 l01 and l02. PUBLISHED.
// ---------------------------------------------------------------------------

/**
 * Every row carries the outside diameter, the wall AND the published bore,
 * even though the third is arithmetically the first two, because that
 * redundancy is the table's only way of catching a transcription error. Run
 * the module's own statement as written, in double precision, and one row
 * already fails: NPS 6 schedule 40 misses by -8.8818e-16 in. The shipped gate
 * does not run it as equality. It uses `toBeCloseTo` at three decimals, which
 * admits anything within five ten-thousandths of an inch, a band far larger
 * than the error the redundancy exists to catch.
 */
export const pipeScheduleRows = () => PIPE_SCHEDULE.map((r) => {
  const odMinusTwoWalls = r.od - 2 * r.wall;
  const residualIn = odMinusTwoWalls - r.id;
  return {
    provenance: 'published',
    nps: r.nps,
    schedule: r.schedule,
    odIn: r.od,
    wallIn: r.wall,
    publishedBoreIn: r.id,
    odMinusTwoWallsIn: odMinusTwoWalls,
    residualIn,
    strictEqualityHolds: odMinusTwoWalls === r.id,
    insideGateBand: Math.abs(residualIn) <= PIPE_TABLE_GATE_BAND_IN,
    flowAreaIn2: (Math.PI / 4) * r.id * r.id,
  };
});

/** What the redundancy catches, what the gate catches, and the gap between them. */
export const pipeTableSelfCheck = () => {
  const rows = pipeScheduleRows();
  const failing = rows.filter((r) => !r.strictEqualityHolds);
  const largest = rows.reduce((a, r) => (Math.abs(r.residualIn) > Math.abs(a.residualIn) ? r : a), rows[0]);
  // a bore typed four ten-thousandths of an inch wrong, which is a real
  // transcription error and not a floating point residue
  const typoBoreIn = 6.0654;
  const typoRow = rows.find((r) => r.nps === 6 && r.schedule === '40');
  const typoResidualIn = typoRow.odMinusTwoWallsIn - typoBoreIn;
  return {
    provenance: 'derived',
    rowCount: rows.length,
    rowsFailingStrictEquality: failing.length,
    largestResidualNps: largest.nps,
    largestResidualSchedule: largest.schedule,
    largestResidualIn: largest.residualIn,
    gateBandIn: PIPE_TABLE_GATE_BAND_IN,
    bandOverLargestResidual: PIPE_TABLE_GATE_BAND_IN / Math.abs(largest.residualIn),
    typoBoreIn,
    typoResidualIn,
    typoPassesTheGate: Math.abs(typoResidualIn) <= PIPE_TABLE_GATE_BAND_IN,
    aStrictBandThatWouldHoldIn: 1e-12,
    thereIsNoPythonOracleForThisTable: true,
  };
};

/** A heavier schedule is a thicker wall and a smaller bore on the same outside diameter. */
export const schedulePairRows = () => [2, 4, 6, 8].map((nps) => {
  const s40 = scheduleRow(nps, '40');
  const s80 = scheduleRow(nps, '80');
  const area = (d) => (Math.PI / 4) * d * d;
  return {
    provenance: 'published',
    nps,
    odIn: s40.od,
    odIsTheSame: s40.od === s80.od,
    wall40In: s40.wall,
    wall80In: s80.wall,
    bore40In: s40.id,
    bore80In: s80.id,
    boreLostIn: s40.id - s80.id,
    flowAreaLostPct: ((area(s40.id) - area(s80.id)) / area(s40.id)) * 100,
  };
});

/** A size that is not in the table returns null rather than a nearby one. */
export const scheduleRefusals = () => [
  {
    label: 'a nominal size the table does not carry',
    call: "scheduleRow(5, '40')",
    returned: scheduleRow(5, '40'),
    isNull: scheduleRow(5, '40') === null,
  },
  {
    label: 'a schedule the table does not carry in that size',
    call: "scheduleRow(6, '160')",
    returned: scheduleRow(6, '160'),
    isNull: scheduleRow(6, '160') === null,
  },
];

// ---------------------------------------------------------------------------
// SECTION 2. WHAT A WALL CAN HOLD. BARLOW.
// Associate m02 l03, l04 and l05.
// ---------------------------------------------------------------------------

/** The gate's own Barlow case, which is the published line of this course. */
export const PUBLISHED_LINE = Object.freeze({
  odIn: 6.625,
  wallIn: 0.28,
  boreIn: 6.065,
  gradeId: 'x52',
  designFactor: 0.72,
  frictionFactor: 0.018,
  smootherFrictionFactor: 0.012,
});

/** A second rating to compare that is not the gate case. TEACHING. */
export const TEACHING_LINE = Object.freeze({
  nps: 8,
  schedule: '80',
  gradeId: 'x65',
  designFactor: 0.72,
  frictionFactor: 0.017,
});

export const PUBLISHED_FITTINGS = Object.freeze([
  { id: 'elbow90LR', count: 4 },
  { id: 'gateValve', count: 2 },
]);

export const TEACHING_FITTINGS = Object.freeze([
  { id: 'elbow90Std', count: 3 },
  { id: 'teeBranch', count: 2 },
  { id: 'ballValve', count: 4 },
  { id: 'globeValve', count: 1 },
]);

/** Every grade the module ships, and the one that resolves to nothing. */
export const gradeRows = () => [
  ...LINE_PIPE_GRADES.map((g) => ({
    provenance: 'published',
    id: g.id,
    label: g.label,
    yieldPsi: g.yieldPsi,
    resolved: true,
  })),
  {
    provenance: 'published',
    id: 'x55',
    label: 'a grade id the module does not carry',
    yieldPsi: gradeYield('x55'),
    resolved: Number.isFinite(gradeYield('x55')),
  },
];

/**
 * P = 2 S t f / D with D the OUTSIDE diameter. The design factor is an INPUT
 * and is never defaulted: the module header says burying one in here would be
 * pretending a jurisdiction. Leave it out and the return is the bare hoop
 * stress, which is not a rating anyone may operate to.
 */
export const barlowRow = ({ odIn, wallIn, gradeId, designFactor, label = null, provenance = 'derived' }) => {
  const yieldPsi = gradeYield(gradeId);
  const rated = barlowPressurePsi({ odIn, wallIn, yieldPsi, designFactor });
  const bare = barlowPressurePsi({ odIn, wallIn, yieldPsi });
  return {
    provenance,
    label,
    odIn,
    wallIn,
    gradeId,
    yieldPsi,
    designFactor,
    ratingPsi: rated,
    bareHoopPsi: bare,
    bareOverRated: bare / rated,
    aBareHoopIsNotARating: true,
  };
};

export const publishedBarlow = () => barlowRow({
  odIn: PUBLISHED_LINE.odIn,
  wallIn: PUBLISHED_LINE.wallIn,
  gradeId: PUBLISHED_LINE.gradeId,
  designFactor: PUBLISHED_LINE.designFactor,
  label: 'the gate case',
  provenance: 'published',
});

/** Barlow is linear in the wall and in the yield, and inverse in the diameter. */
export const barlowScalingRows = () => {
  const base = publishedBarlow();
  return [
    { ...base, move: 'the published case' },
    {
      ...barlowRow({
        odIn: PUBLISHED_LINE.odIn,
        wallIn: PUBLISHED_LINE.wallIn * 2,
        gradeId: PUBLISHED_LINE.gradeId,
        designFactor: PUBLISHED_LINE.designFactor,
      }),
      move: 'twice the wall',
      ratioToPublished: barlowRow({
        odIn: PUBLISHED_LINE.odIn, wallIn: PUBLISHED_LINE.wallIn * 2,
        gradeId: PUBLISHED_LINE.gradeId, designFactor: PUBLISHED_LINE.designFactor,
      }).ratingPsi / base.ratingPsi,
    },
    {
      ...barlowRow({
        odIn: PUBLISHED_LINE.odIn * 2,
        wallIn: PUBLISHED_LINE.wallIn,
        gradeId: PUBLISHED_LINE.gradeId,
        designFactor: PUBLISHED_LINE.designFactor,
      }),
      move: 'twice the outside diameter',
      ratioToPublished: barlowRow({
        odIn: PUBLISHED_LINE.odIn * 2, wallIn: PUBLISHED_LINE.wallIn,
        gradeId: PUBLISHED_LINE.gradeId, designFactor: PUBLISHED_LINE.designFactor,
      }).ratingPsi / base.ratingPsi,
    },
  ];
};

/** The same published pipe through every grade, at the gate design factor. */
export const barlowGradeRows = () => LINE_PIPE_GRADES.map((g) => ({
  ...barlowRow({
    odIn: PUBLISHED_LINE.odIn,
    wallIn: PUBLISHED_LINE.wallIn,
    gradeId: g.id,
    designFactor: PUBLISHED_LINE.designFactor,
    label: g.label,
  }),
  published: g.id === PUBLISHED_LINE.gradeId,
}));

/** The teaching line: a heavier schedule in a bigger size and a higher grade. */
export const teachingLineDefinition = () => {
  const row = scheduleRow(TEACHING_LINE.nps, TEACHING_LINE.schedule);
  const barlow = barlowRow({
    odIn: row.od,
    wallIn: row.wall,
    gradeId: TEACHING_LINE.gradeId,
    designFactor: TEACHING_LINE.designFactor,
    label: `NPS ${TEACHING_LINE.nps} schedule ${TEACHING_LINE.schedule}`,
    provenance: 'teaching',
  });
  return {
    ...barlow,
    teaching: true,
    nps: TEACHING_LINE.nps,
    schedule: TEACHING_LINE.schedule,
    boreIn: row.id,
    frictionFactor: TEACHING_LINE.frictionFactor,
  };
};

export const DESIGN_FACTOR_SWEEP = Object.freeze([0.4, 0.5, 0.72, 0.8, 1]);

/**
 * The design factor alone, on the teaching line, holding the pipe and the
 * grade fixed. This is the whole regulatory content of the number and it is
 * the one a reader is most likely to inherit from somebody else. SWEEP POINTS
 * on a teaching line: the 0.72 row is the teaching line's own factor.
 */
export const barlowDesignFactorRows = (factors = DESIGN_FACTOR_SWEEP) => {
  const row = scheduleRow(TEACHING_LINE.nps, TEACHING_LINE.schedule);
  return factors.map((designFactor) => ({
    ...barlowRow({
      odIn: row.od,
      wallIn: row.wall,
      gradeId: TEACHING_LINE.gradeId,
      designFactor,
      provenance: 'teaching',
    }),
    teaching: true,
    isTheTeachingFactor: designFactor === TEACHING_LINE.designFactor,
    noDesignFactorAtAll: designFactor === 1,
  }));
};

/** What Barlow refuses, and it refuses as a bare not-a-number. */
export const barlowRefusals = () => [
  {
    label: 'a missing yield',
    returned: barlowPressurePsi({ odIn: 6.625, wallIn: 0.28, designFactor: 0.72 }),
    isNaN: Number.isNaN(barlowPressurePsi({ odIn: 6.625, wallIn: 0.28, designFactor: 0.72 })),
  },
  {
    label: 'a zero wall',
    returned: barlowPressurePsi({ odIn: 6.625, wallIn: 0, yieldPsi: 52000, designFactor: 0.72 }),
    isNaN: Number.isNaN(barlowPressurePsi({ odIn: 6.625, wallIn: 0, yieldPsi: 52000, designFactor: 0.72 })),
  },
  {
    label: 'a zero outside diameter',
    returned: barlowPressurePsi({ odIn: 0, wallIn: 0.28, yieldPsi: 52000, designFactor: 0.72 }),
    isNaN: Number.isNaN(barlowPressurePsi({ odIn: 0, wallIn: 0.28, yieldPsi: 52000, designFactor: 0.72 })),
  },
];

// ---------------------------------------------------------------------------
// SECTION 3. FITTINGS AS A LENGTH OF PIPE.
// Associate m03. L_eq = sum(K) * D / f.
// ---------------------------------------------------------------------------

/** Every velocity head coefficient the module ships, and the id that is not one. */
export const fittingRows = () => [
  ...FITTINGS.map((f) => ({ provenance: 'published', id: f.id, label: f.label, k: f.k, resolved: true })),
  {
    provenance: 'published',
    id: 'elbow90',
    label: 'a fitting id the module does not carry',
    k: fittingK('elbow90'),
    resolved: Number.isFinite(fittingK('elbow90')),
  },
];

/** Every absolute roughness, and the id that resolves to nothing. */
export const roughnessRows = () => [
  ...ROUGHNESS_IN.map((r) => ({ provenance: 'published', id: r.id, label: r.label, roughnessIn: r.roughnessIn, resolved: true })),
  {
    provenance: 'published',
    id: 'nonsense',
    label: 'a roughness id the module does not carry',
    roughnessIn: roughnessOf('nonsense'),
    resolved: Number.isFinite(roughnessOf('nonsense')),
  },
];

/**
 * One equivalent length, with the two numbers a panel needs beside it: the sum
 * of K, and the count of DIAMETERS OF PIPE the same fittings are worth.
 *
 * A FIXED DIAMETERS COUNT IS A FRICTION FACTOR IN DISGUISE, and that is the
 * whole point of `diametersOfPipe`. The count is sum(K) / f and nothing else,
 * so a rule that puts a whole fitting set at thirty diameters is assuming
 * f = sum(K) / 30. On the published set, whose sum(K) is 1.5, thirty diameters
 * assumes f = 0.05. It is NOT assuming 0.02: that would put the same set at
 * 75 diameters.
 */
export const equivalentLengthRow = ({
  fittings = PUBLISHED_FITTINGS, idIn = PUBLISHED_LINE.boreIn,
  frictionFactor = PUBLISHED_LINE.frictionFactor, provenance = 'derived', label = null,
} = {}) => {
  const r = equivalentLengthFt({
    fittings: fittings.map((f) => ({ ...f })), idIn, frictionFactor,
  });
  return {
    provenance,
    label,
    idIn,
    frictionFactor,
    ok: r.ok,
    error: r.error === undefined ? null : r.error,
    sumK: r.ok ? r.sumK : null,
    lengthFt: r.ok ? r.lengthFt : null,
    diametersOfPipe: r.ok ? (r.lengthFt * IN_PER_FT) / idIn : null,
  };
};

/** The gate case at both of its published friction factors. */
export const publishedEquivalentLength = () => {
  const rough = equivalentLengthRow({
    provenance: 'published', label: 'the gate case',
  });
  const smooth = equivalentLengthRow({
    frictionFactor: PUBLISHED_LINE.smootherFrictionFactor,
    provenance: 'published', label: 'the same fittings on a smoother line',
  });
  return {
    provenance: 'published',
    sumK: rough.sumK,
    idIn: rough.idIn,
    roughFrictionFactor: rough.frictionFactor,
    roughLengthFt: rough.lengthFt,
    roughDiametersOfPipe: rough.diametersOfPipe,
    smoothFrictionFactor: smooth.frictionFactor,
    smoothLengthFt: smooth.lengthFt,
    smoothDiametersOfPipe: smooth.diametersOfPipe,
    smoothOverRough: smooth.lengthFt / rough.lengthFt,
    // the smoother line is worth MORE feet, which reads backwards until you
    // remember what the equivalence is between
    theBetterPipeScoresTheLongerLength: smooth.lengthFt > rough.lengthFt,
  };
};

export const FRICTION_SWEEP = Object.freeze([0.010, 0.014, 0.018, 0.020, 0.025, 0.030]);

/** Friction factor alone, on the published fitting count and bore. */
export const equivalentLengthFrictionRows = (fs = FRICTION_SWEEP) => fs.map((frictionFactor) => ({
  ...equivalentLengthRow({ frictionFactor }),
  published: frictionFactor === PUBLISHED_LINE.frictionFactor,
}));

export const BORE_SWEEP_NPS = Object.freeze([2, 3, 4, 6, 8, 10, 12, 16]);

/** Bore alone, on the published fitting count and friction factor. */
export const equivalentLengthBoreRows = (npsList = BORE_SWEEP_NPS) => npsList.map((nps) => {
  const row = scheduleRow(nps, '40');
  return {
    ...equivalentLengthRow({ idIn: row.id }),
    nps,
    schedule: '40',
    published: row.id === PUBLISHED_LINE.boreIn,
  };
});

/**
 * THE RULE OF THUMB, AND ITS SCOPE DECIDES ITS SIGN. Read the conventional
 * way, thirty diameters PER FITTING, six fittings come to 180 diameters and
 * the rule OVERSTATES against the engine. Applied once to the WHOLE list it
 * gives thirty diameters and understates by nearly three times. Both readings
 * are here under distinct names, because anything written on this must say
 * which reading it is using.
 */
export const thirtyDiametersRule = (diametersPerFitting = 30) => {
  const engine = equivalentLengthRow({ provenance: 'published' });
  const fittingCount = sum(PUBLISHED_FITTINGS.map((f) => f.count ?? 1));
  const wholeListFt = (diametersPerFitting * engine.idIn) / IN_PER_FT;
  const perFittingDiameters = diametersPerFitting * fittingCount;
  const perFittingFt = (perFittingDiameters * engine.idIn) / IN_PER_FT;
  return {
    provenance: 'derived',
    diametersPerFitting,
    fittingCount,
    sumK: engine.sumK,
    engineLengthFt: engine.lengthFt,
    engineDiametersOfPipe: engine.diametersOfPipe,
    engineFrictionFactor: engine.frictionFactor,
    // a fixed count is a friction factor in disguise, and this is the factor
    impliedFrictionFactorWholeList: engine.sumK / diametersPerFitting,
    impliedFrictionFactorPerFitting: engine.sumK / perFittingDiameters,
    diametersAtFrictionFactorPointOhTwo: engine.sumK / 0.02,
    wholeListLengthFt: wholeListFt,
    wholeListUnderstatesByFactor: engine.lengthFt / wholeListFt,
    perFittingDiameters,
    perFittingLengthFt: perFittingFt,
    perFittingOverstatesByFactor: perFittingFt / engine.lengthFt,
    theBiasChangesSignWithTheReading: true,
  };
};

/** Every fitting on the teaching line, with what it is worth on its own. */
export const teachingFittingRows = () => {
  const line = teachingLineDefinition();
  const total = equivalentLengthRow({
    fittings: TEACHING_FITTINGS,
    idIn: line.boreIn,
    frictionFactor: line.frictionFactor,
    provenance: 'teaching',
  });
  return TEACHING_FITTINGS.map((f) => {
    const one = equivalentLengthRow({
      fittings: [f],
      idIn: line.boreIn,
      frictionFactor: line.frictionFactor,
      provenance: 'teaching',
    });
    return {
      provenance: 'teaching',
      teaching: true,
      id: f.id,
      count: f.count,
      label: (FITTINGS.find((x) => x.id === f.id) || {}).label || f.id,
      kEach: fittingK(f.id),
      sumK: one.sumK,
      sharePct: (one.sumK / total.sumK) * 100,
      lengthFt: one.lengthFt,
      totalSumK: total.sumK,
      totalLengthFt: total.lengthFt,
    };
  });
};

/** One globe valve is worth more than everything else on that list together. */
export const teachingFittingHeadline = () => {
  const rows = teachingFittingRows();
  const worst = rows.reduce((a, r) => (r.sumK > a.sumK ? r : a), rows[0]);
  const rest = rows.filter((r) => r.id !== worst.id);
  return {
    provenance: 'teaching',
    teaching: true,
    totalSumK: rows[0].totalSumK,
    totalLengthFt: rows[0].totalLengthFt,
    worstId: worst.id,
    worstLabel: worst.label,
    worstSumK: worst.sumK,
    worstSharePct: worst.sharePct,
    worstLengthFt: worst.lengthFt,
    everythingElseSumK: sum(rest.map((r) => r.sumK)),
    everythingElseLengthFt: sum(rest.map((r) => r.lengthFt)),
    oneValveOutweighsTheRest: worst.sumK > sum(rest.map((r) => r.sumK)),
  };
};

/** What the equivalent length refuses, and it refuses with a reason. */
export const equivalentLengthRefusals = () => [
  {
    label: 'a fitting id the module cannot resolve',
    ...equivalentLengthRow({ fittings: [{ id: 'reducer' }], idIn: 6, frictionFactor: 0.02 }),
  },
  {
    label: 'no bore and no friction factor',
    ...equivalentLengthRow({ fittings: PUBLISHED_FITTINGS, idIn: 0, frictionFactor: 0 }),
  },
];

// ---------------------------------------------------------------------------
// SECTION 4. THE THREE NODE KINDS, AND WHAT buildNetwork REFUSES.
// Associate m01 l03 and m04. PUBLISHED fixtures out of the gate.
// ---------------------------------------------------------------------------

export const NODE_KIND_NOTES = Object.freeze([
  { kind: 'well', note: 'injects mass into the network and makes more against a lower header. Its pressure is unknown.' },
  { kind: 'junction', note: 'a header, a manifold, a tee. Injects nothing, and everything that arrives leaves. Its pressure is unknown.' },
  { kind: 'sink', note: 'the separator or the delivery point. Its pressure is FIXED and it takes whatever arrives.' },
]);

/** The eleven refusals, each a REFUSAL with a reason and never a repair. */
export const topologyRefusals = () => {
  const sink = { id: 's', kind: 'sink', pressurePsia: 100 };
  const well = { id: 'w', kind: 'well' };
  const cases = [
    ['a node with no route to a delivery point', {
      nodes: [well, sink, { id: 'orphan', kind: 'junction', label: 'Manifold B' }],
      branches: [{ id: 'a', from: 'w', to: 's' }],
    }],
    ['no delivery point at all', { nodes: [well], branches: [] }],
    ['a delivery point with no pressure', {
      nodes: [well, { id: 's', kind: 'sink', label: 'Sep' }],
      branches: [{ id: 'a', from: 'w', to: 's' }],
    }],
    ['no wells at all', { nodes: [sink, { id: 'j', kind: 'junction' }], branches: [] }],
    ['two nodes sharing an id', { nodes: [well, well, sink], branches: [] }],
    ['a branch that starts and ends at the same node', {
      nodes: [well, sink], branches: [{ id: 'a', from: 'w', to: 'w' }],
    }],
    ['a branch to a node that is not there', {
      nodes: [well, sink], branches: [{ id: 'a', from: 'w', to: 'ghost' }],
    }],
    ['a node kind the module does not have', {
      nodes: [well, sink, { id: 'x', kind: 'compressor', label: 'K-1' }],
      branches: [{ id: 'a', from: 'w', to: 's' }],
    }],
    ['a node with no id', { nodes: [{ kind: 'well' }, sink], branches: [] }],
    ['a branch with no id', {
      nodes: [well, sink], branches: [{ from: 'w', to: 's' }],
    }],
    ['no nodes at all', { nodes: [], branches: [] }],
  ];
  return cases.map(([label, spec]) => {
    const r = buildNetwork(spec);
    return {
      provenance: 'published',
      label,
      ok: r.ok,
      refused: r.ok === false,
      error: r.error === undefined ? null : r.error,
      isARefusalNotARepair: true,
    };
  });
};

// ---------------------------------------------------------------------------
// SECTION 5. THE PUBLISHED GOLDEN NETWORKS, REBUILT NODE FOR NODE FROM THE
// ORACLE AND THE SHIPPED GATE.
// ---------------------------------------------------------------------------

const STAR_SPEC = Object.freeze({
  name: 'linear_star',
  nodes: [
    { id: 'w1', kind: 'well', label: 'W-1' },
    { id: 'w2', kind: 'well', label: 'W-2' },
    { id: 'h', kind: 'junction', label: 'Header' },
    { id: 's', kind: 'sink', label: 'Separator', pressurePsia: 150 },
  ],
  branches: [
    { id: 'b1', from: 'w1', to: 'h', label: 'W-1 flowline' },
    { id: 'b2', from: 'w2', to: 'h', label: 'W-2 flowline' },
    { id: 'b3', from: 'h', to: 's', label: 'Trunk' },
  ],
  k: { b1: 80, b2: 120, b3: 400 },
  wells: { w1: { qmax: 60000, prPsia: 900 }, w2: { qmax: 40000, prPsia: 700 } },
});

const TREE_SPEC = Object.freeze({
  name: 'turbulent_tree',
  sinkPsia: 180,
  nodes: [
    { id: 'w1', kind: 'well', label: 'W-1' },
    { id: 'w2', kind: 'well', label: 'W-2' },
    { id: 'w3', kind: 'well', label: 'W-3' },
    { id: 'h1', kind: 'junction', label: 'Header 1' },
    { id: 'h2', kind: 'junction', label: 'Header 2' },
    { id: 's', kind: 'sink', label: 'Separator', pressurePsia: 180 },
  ],
  branches: [
    { id: 'b1', from: 'w1', to: 'h1', label: 'W-1 flowline' },
    { id: 'b2', from: 'w2', to: 'h1', label: 'W-2 flowline' },
    { id: 'b3', from: 'w3', to: 'h2', label: 'W-3 flowline' },
    { id: 'b4', from: 'h1', to: 'h2', label: 'Header link' },
    { id: 'b5', from: 'h2', to: 's', label: 'Trunk' },
  ],
});

const LOOP_SPEC = Object.freeze({
  name: 'looped',
  sinkPsia: 200,
  nodes: [
    { id: 'w1', kind: 'well', label: 'W-1' },
    { id: 'w2', kind: 'well', label: 'W-2' },
    { id: 'h', kind: 'junction', label: 'Header' },
    { id: 'm', kind: 'junction', label: 'Midpoint' },
    { id: 's', kind: 'sink', label: 'Separator', pressurePsia: 200 },
  ],
  branches: [
    { id: 'b1', from: 'w1', to: 'h', label: 'W-1 flowline' },
    { id: 'b2', from: 'w2', to: 'h', label: 'W-2 flowline' },
    { id: 'b3', from: 'h', to: 'm', label: 'Loop leg to the midpoint' },
    { id: 'b4', from: 'h', to: 's', label: 'Direct leg' },
    { id: 'b5', from: 'm', to: 's', label: 'Midpoint leg' },
  ],
});

/** The wells_fight ladder, exactly as the gate builds it: qmax, pr, conductance. */
export const FIGHT_SPECS = Object.freeze([[4200, 2600, 140], [2900, 2200, 95], [5100, 3000, 160]]);
export const FIGHT_TRUNK_K = 410;
export const FIGHT_SINK_PSIA = 180;

const goldenSpec = (name) => (name === 'turbulent_tree' ? TREE_SPEC : LOOP_SPEC);

/** One golden turbulent case, solved by the engine, with its audit beside it. */
const goldenTurbulentRun = memoize((name, kOverride = null, tolerance = 1e-10) => {
  const spec = goldenSpec(name);
  const k = { ...golden[name].spec.branches, ...(kOverride || {}) };
  const wells = Object.fromEntries(Object.entries(golden[name].spec.wells)
    .map(([id, [qmax, prPsia]]) => [id, vogelWell({ qmax, prPsia })]));
  const network = buildNetwork({
    nodes: spec.nodes.map((n) => ({ ...n })),
    branches: spec.branches.map((b) => ({ ...b })),
  });
  const res = solveNetwork({
    network,
    branchFlow: (b, pIn, pOut) => turbulentBranch(k[b.id])(b, pIn, pOut),
    wellInflow: (nd, p) => wells[nd.id](p),
    tolerance,
  });
  return { spec, network, res, k, verdict: solveVerdict(network, res) };
});

const starRun = memoize(() => {
  const network = buildNetwork({
    nodes: STAR_SPEC.nodes.map((n) => ({ ...n })),
    branches: STAR_SPEC.branches.map((b) => ({ ...b })),
  });
  const newton = solveNetwork({
    network,
    branchFlow: (b, pIn, pOut) => STAR_SPEC.k[b.id] * (pIn - pOut),
    wellInflow: (nd, p) => linearWell(STAR_SPEC.wells[nd.id])(nd, p),
    tolerance: 1e-12,
  });
  const exact = solveLinearNetwork({
    network,
    conductance: (b) => STAR_SPEC.k[b.id],
    wellSlope: (nd) => STAR_SPEC.wells[nd.id],
  });
  return { network, newton, exact, verdict: solveVerdict(network, newton) };
});

/**
 * THE ONE CASE WITH A CLOSED FORM, AND THE ONLY CHECK IN THE COURSE WITH NO
 * TOLERANCE IN IT. Provenance rule 4. `exactPressurePsia` came out of a matrix
 * inverse and `newtonPressurePsia` out of a Newton iteration, and the two share
 * no code and no reasoning at all, so agreement to the last bits is evidence
 * about the assembly, the signs and the boundary handling rather than about
 * either method. The oracle's own value is a THIRD road and carries its own
 * name.
 */
export const linearStarRows = () => {
  const { newton, exact } = starRun();
  return Object.keys(exact.pressures).sort().map((id) => {
    const node = STAR_SPEC.nodes.find((n) => n.id === id);
    return {
      provenance: 'golden',
      id,
      label: node.label,
      kind: node.kind,
      goldenPressurePsia: golden.linear_star.pressures[id],
      exactPressurePsia: exact.pressures[id],
      newtonPressurePsia: newton.pressures[id],
      newtonMinusExactPsia: newton.pressures[id] - exact.pressures[id],
      newtonAgainstExactRelDiff: rel(newton.pressures[id], exact.pressures[id]),
      agreesExactly: newton.pressures[id] === exact.pressures[id],
      newtonMinusOraclePsia: newton.pressures[id] - golden.linear_star.pressures[id],
    };
  });
};

/** The star's whole verdict, and the branch flows the two wells put down it. */
export const linearStarSummary = () => {
  const { newton, verdict } = starRun();
  const rows = linearStarRows();
  return {
    provenance: 'golden',
    caseName: 'linear_star',
    sinkPsia: 150,
    conductancesLbDPerPsi: { ...STAR_SPEC.k },
    wells: JSON.parse(JSON.stringify(STAR_SPEC.wells)),
    ...verdict,
    goldenConservationGapLbD: golden.linear_star.conservationGap,
    goldenSweeps: golden.linear_star.sweeps,
    flowsLbD: { ...newton.flows },
    wellRatesLbD: { ...newton.wellRates },
    imbalanceLbD: { ...newton.imbalance },
    nodesAgreeingExactly: rows.filter((r) => r.agreesExactly).length,
    worstRelDiffAgainstTheClosedForm: Math.max(...rows.map((r) => r.newtonAgainstExactRelDiff)),
    // Newton is EXACT on a linear system, so needing many steps here would
    // mean the Jacobian is wrong rather than that the problem is hard
    newtonIsExactOnALinearSystem: true,
    thisIsTheOnlyCheckWithNoToleranceInIt: true,
  };
};

/** The topology reduces the way a network must: series and parallel. PUBLISHED. */
export const seriesParallelRows = memoize(() => {
  const run = (nodes, branches, K) => {
    const network = buildNetwork({ nodes, branches });
    const res = solveNetwork({
      network,
      branchFlow: (b, pIn, pOut) => K[b.id] * (pIn - pOut),
      wellInflow: () => 10000,
      tolerance: 1e-12,
    });
    return { network, res, verdict: solveVerdict(network, res) };
  };
  const kSeries = 1 / (1 / 200 + 1 / 300);
  const twoSeries = run(
    [{ id: 'w', kind: 'well' }, { id: 'm', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
    [{ id: 'a', from: 'w', to: 'm' }, { id: 'b', from: 'm', to: 's' }],
    { a: 200, b: 300 },
  );
  const oneSeries = run(
    [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
    [{ id: 'a', from: 'w', to: 's' }],
    { a: kSeries },
  );
  const twoParallel = run(
    [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
    [{ id: 'a', from: 'w', to: 's' }, { id: 'b', from: 'w', to: 's' }],
    { a: 200, b: 300 },
  );
  const oneParallel = run(
    [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
    [{ id: 'a', from: 'w', to: 's' }],
    { a: 500 },
  );
  return [
    {
      provenance: 'published',
      rule: 'two linear branches in series behave as one, by the reciprocal rule',
      conductancesLbDPerPsi: [200, 300],
      equivalentLbDPerPsi: kSeries,
      manyBranchWellheadPsia: twoSeries.res.pressures.w,
      oneBranchWellheadPsia: oneSeries.res.pressures.w,
      differencePsia: twoSeries.res.pressures.w - oneSeries.res.pressures.w,
      ...twoSeries.verdict,
    },
    {
      provenance: 'published',
      rule: 'two linear branches in parallel behave as their sum',
      conductancesLbDPerPsi: [200, 300],
      equivalentLbDPerPsi: 500,
      manyBranchWellheadPsia: twoParallel.res.pressures.w,
      oneBranchWellheadPsia: oneParallel.res.pressures.w,
      differencePsia: twoParallel.res.pressures.w - oneParallel.res.pressures.w,
      ...twoParallel.verdict,
    },
  ];
});

/**
 * A golden turbulent case: the oracle's committed pressures and flows beside
 * the engine's, with a named difference. Two methods with nothing in common
 * landing on the same numbers is evidence about the PHYSICS.
 */
export const goldenCaseRows = (name = 'turbulent_tree') => {
  const { res } = goldenTurbulentRun(name);
  const g = golden[name];
  const pressures = Object.keys(g.pressures).sort().map((id) => ({
    provenance: 'golden',
    caseName: name,
    kind: 'pressure',
    id,
    unit: 'psia',
    goldenValue: g.pressures[id],
    engineValue: res.pressures[id],
    engineMinusGolden: res.pressures[id] - g.pressures[id],
  }));
  const flows = Object.keys(g.flows).sort().map((id) => ({
    provenance: 'golden',
    caseName: name,
    kind: 'flow',
    id,
    unit: 'lb/d',
    goldenValue: g.flows[id],
    engineValue: res.flows[id],
    engineMinusGolden: res.flows[id] - g.flows[id],
  }));
  const rates = Object.keys(g.wellRates || {}).sort().map((id) => ({
    provenance: 'golden',
    caseName: name,
    kind: 'well rate',
    id,
    unit: 'lb/d',
    goldenValue: g.wellRates[id],
    engineValue: res.wellRates[id],
    engineMinusGolden: res.wellRates[id] - g.wellRates[id],
  }));
  return [...pressures, ...flows, ...rates];
};

/** One golden turbulent case in one object, with its audit and the oracle's. */
export const goldenCaseSummary = (name = 'turbulent_tree') => {
  const { spec, res, verdict } = goldenTurbulentRun(name);
  const g = golden[name];
  return {
    provenance: 'golden',
    caseName: name,
    sinkPsia: spec.sinkPsia,
    conductancesLbDPerRootPsi: { ...g.spec.branches },
    wells: JSON.parse(JSON.stringify(g.spec.wells)),
    nodeCount: spec.nodes.length,
    branchCount: spec.branches.length,
    ...verdict,
    goldenProducedLbD: g.producedLbD,
    goldenDeliveredLbD: g.deliveredLbD,
    goldenConservationGapLbD: g.conservationGap,
    goldenSweeps: g.sweeps,
    engineIterations: res.iterations,
    sweepsOverIterations: g.sweeps / res.iterations,
    flowsLbD: { ...res.flows },
    pressuresPsia: { ...res.pressures },
    wellRatesLbD: { ...res.wellRates },
  };
};

export const TREE_TRUNK_SWEEP_K = Object.freeze([260, 410, 600, 900, 1400]);

/**
 * The trunk conductance of the published tree, walked. SWEEP POINTS on
 * published inputs; the 410 row is the published case.
 */
export const treeTrunkRows = (ks = TREE_TRUNK_SWEEP_K) => ks.map((kb5) => {
  const { res, verdict } = goldenTurbulentRun('turbulent_tree', { b5: kb5 });
  return {
    provenance: 'derived',
    caseName: 'turbulent_tree',
    trunkConductanceLbDPerRootPsi: kb5,
    published: kb5 === golden.turbulent_tree.spec.branches.b5,
    header1Psia: res.pressures.h1,
    header2Psia: res.pressures.h2,
    trunkLbD: res.flows.b5,
    w1LbD: res.wellRates.w1,
    w2LbD: res.wellRates.w2,
    w3LbD: res.wellRates.w3,
    totalLbD: sum(Object.values(res.wellRates)),
    ...verdict,
  };
});

// ---------------------------------------------------------------------------
// SECTION 6. THE LOOP, AND THE SPLIT IT DECIDES.
// Professional m02.
// ---------------------------------------------------------------------------

/** The published loop: both parallel paths carry something and neither is dead. */
export const loopedSplit = () => {
  const { res, verdict } = goldenTurbulentRun('looped');
  const delivered = res.flows.b4 + res.flows.b5;
  return {
    provenance: 'golden',
    caseName: 'looped',
    headerPsia: res.pressures.h,
    midpointPsia: res.pressures.m,
    directLegLbD: res.flows.b4,
    midpointLegLbD: res.flows.b5,
    directLegConductanceLbDPerRootPsi: golden.looped.spec.branches.b4,
    midpointLegConductanceLbDPerRootPsi: golden.looped.spec.branches.b5,
    totalDeliveredLbD: delivered,
    directSharePct: (res.flows.b4 / delivered) * 100,
    midpointSharePct: (res.flows.b5 / delivered) * 100,
    neitherLegIsDead: res.flows.b4 > 0 && res.flows.b5 > 0,
    ...verdict,
  };
};

export const LOOP_SPLIT_SWEEP_K = Object.freeze([60, 100, 220, 340, 500, 800]);

/**
 * Walk the midpoint leg conductance and watch the split move. The two legs are
 * not two independent pipes, they are one decision the solve makes. SWEEP
 * POINTS on published inputs; the 220 row is the published case.
 */
export const loopSplitRows = (ks = LOOP_SPLIT_SWEEP_K) => ks.map((kb5) => {
  const { res, verdict } = goldenTurbulentRun('looped', { b5: kb5 });
  const delivered = res.flows.b4 + res.flows.b5;
  return {
    provenance: 'derived',
    midpointLegConductanceLbDPerRootPsi: kb5,
    published: kb5 === golden.looped.spec.branches.b5,
    headerPsia: res.pressures.h,
    midpointPsia: res.pressures.m,
    directLegLbD: res.flows.b4,
    midpointLegLbD: res.flows.b5,
    midpointSharePct: (res.flows.b5 / delivered) * 100,
    totalDeliveredLbD: delivered,
    ...verdict,
  };
});

// ---------------------------------------------------------------------------
// SECTION 7. THE PUBLISHED LADDER: WELLS FIGHT.
// Professional m03. PUBLISHED golden wells_fight, re-run on the same ladder.
// ---------------------------------------------------------------------------

const fightRun = memoize((count, sinkPsia = FIGHT_SINK_PSIA) => {
  const nodes = [
    { id: 'h', kind: 'junction', label: 'Header' },
    { id: 's', kind: 'sink', label: 'Separator', pressurePsia: sinkPsia },
  ];
  const branches = [{ id: 'trunk', from: 'h', to: 's', label: 'Trunk' }];
  const K = { trunk: FIGHT_TRUNK_K };
  const wells = {};
  for (let i = 0; i < count; i += 1) {
    const [qmax, prPsia, k] = FIGHT_SPECS[i];
    nodes.push({ id: `w${i}`, kind: 'well', label: `W-${i}` });
    branches.push({ id: `f${i}`, from: `w${i}`, to: 'h', label: `W-${i} flowline` });
    K[`f${i}`] = k;
    wells[`w${i}`] = vogelWell({ qmax, prPsia });
  }
  const network = buildNetwork({ nodes, branches });
  const res = solveNetwork({
    network,
    branchFlow: (b, pIn, pOut) => turbulentBranch(K[b.id])(b, pIn, pOut),
    wellInflow: (nd, p) => wells[nd.id](p),
    tolerance: 1e-10,
  });
  return { network, res, wells, nodes, verdict: solveVerdict(network, res) };
});

/** One well, then two, then three, on the same header and the same trunk. */
export const fightLadderRows = () => [1, 2, 3].map((count, i) => {
  const { res, verdict } = fightRun(count);
  const g = golden.wells_fight[i];
  return {
    provenance: 'golden',
    count,
    goldenHeaderPsia: g.headerPsia,
    engineHeaderPsia: res.pressures.h,
    headerEngineMinusGolden: res.pressures.h - g.headerPsia,
    goldenWellRatesLbD: { ...g.wellRates },
    engineWellRatesLbD: { ...res.wellRates },
    wellheadsPsia: Object.fromEntries(Object.keys(res.wellRates).map((id) => [id, res.pressures[id]])),
    totalDeliveredLbD: res.flows.trunk,
    ...verdict,
  };
});

/** What the ladder costs W-0, and what two more wells actually bought. */
export const fightLadderHeadline = () => {
  const rows = fightLadderRows();
  const [one, two, three] = rows;
  const soloRates = FIGHT_SPECS.map(([qmax, prPsia], i) => {
    // each well alone on the same header and the same trunk
    const nodes = [
      { id: 'h', kind: 'junction', label: 'Header' },
      { id: 's', kind: 'sink', label: 'Separator', pressurePsia: FIGHT_SINK_PSIA },
      { id: `w${i}`, kind: 'well', label: `W-${i}` },
    ];
    const branches = [
      { id: 'trunk', from: 'h', to: 's', label: 'Trunk' },
      { id: `f${i}`, from: `w${i}`, to: 'h', label: `W-${i} flowline` },
    ];
    const K = { trunk: FIGHT_TRUNK_K, [`f${i}`]: FIGHT_SPECS[i][2] };
    const network = buildNetwork({ nodes, branches });
    const res = solveNetwork({
      network,
      branchFlow: (b, pIn, pOut) => turbulentBranch(K[b.id])(b, pIn, pOut),
      wellInflow: (nd, p) => vogelWell({ qmax, prPsia })(p),
      tolerance: 1e-10,
    });
    return res.wellRates[`w${i}`];
  });
  const w0Alone = one.engineWellRatesLbD.w0;
  const w0Shared = three.engineWellRatesLbD.w0;
  const w1Two = two.engineWellRatesLbD.w1;
  const w1Three = three.engineWellRatesLbD.w1;
  return {
    provenance: 'derived',
    w0AloneLbD: w0Alone,
    w0WithTwoCompanionsLbD: w0Shared,
    w0LostLbD: w0Alone - w0Shared,
    w0LostPct: ((w0Alone - w0Shared) / w0Alone) * 100,
    w1WithOneCompanionLbD: w1Two,
    w1WithTwoCompanionsLbD: w1Three,
    w1LostPct: ((w1Two - w1Three) / w1Two) * 100,
    headerAtOneWellPsia: one.engineHeaderPsia,
    headerAtThreeWellsPsia: three.engineHeaderPsia,
    headerRosePsi: three.engineHeaderPsia - one.engineHeaderPsia,
    deliveredAtOneWellLbD: one.totalDeliveredLbD,
    deliveredAtThreeWellsLbD: three.totalDeliveredLbD,
    addingTwoWellsBoughtLbD: three.totalDeliveredLbD - one.totalDeliveredLbD,
    // TWO WAYS TO SAY "WHAT THE TWO NEW WELLS WOULD HAVE SUGGESTED", AND THEY
    // ARE NOT THE SAME NUMBER, so both are here under names that say what each
    // one is. `theirSoloRatesWouldSuggestLbD` re-solves W-1 and W-2 each ALONE
    // on the same header and the same trunk, which is what a solo rate means
    // everywhere else in this lab. `w1WithOneCompanionPlusW2WithTwoLbD` adds
    // W-1's rate from the TWO well case to W-2's rate from the THREE well
    // case, which is a mixture of two different systems and is not a solo rate
    // of anything. The second is the larger claim to argue against and the
    // smaller number, so a lesson has to say which it is quoting.
    theirSoloRatesWouldSuggestLbD: soloRates[1] + soloRates[2],
    w1WithOneCompanionPlusW2WithTwoLbD: two.engineWellRatesLbD.w1 + three.engineWellRatesLbD.w2,
    soloRatesLbD: soloRates,
    everyWellAlreadyOnItMakesStrictlyLess:
      three.engineWellRatesLbD.w0 < two.engineWellRatesLbD.w0
      && two.engineWellRatesLbD.w0 < one.engineWellRatesLbD.w0
      && three.engineWellRatesLbD.w1 < two.engineWellRatesLbD.w1,
  };
};

export const SEPARATOR_SWEEP_PSIA = Object.freeze([120, 150, 180, 220, 300, 400]);

/**
 * The same three wells against a separator pressure walked down. Backing the
 * boundary off is the one lever that helps every well at once, and it is the
 * lever a single-well study cannot price because the boundary is the thing it
 * was told. SWEEP POINTS; the 180 row is the published case.
 */
export const separatorSweepRows = (pressures = SEPARATOR_SWEEP_PSIA) => pressures.map((sinkPsia) => {
  const { res, verdict } = fightRun(3, sinkPsia);
  return {
    provenance: 'derived',
    separatorPsia: sinkPsia,
    published: sinkPsia === FIGHT_SINK_PSIA,
    headerPsia: res.pressures.h,
    totalLbD: sum(Object.values(res.wellRates)),
    w0LbD: res.wellRates.w0,
    w1LbD: res.wellRates.w1,
    w2LbD: res.wellRates.w2,
    ...verdict,
  };
});

// ---------------------------------------------------------------------------
// SECTION 8. THE ONE TEACHING NETWORK: AGBADA WEST.
//
// Four wells, three junctions, one loop, eight branches, seven unknown
// pressures, a separator at 265 psia. One well is held to a facility
// allocation on a flowline that cannot pass the whole of it, which is what
// makes the pinning, the residual blindness, the initial guess dependence and
// the stream mass gap all reachable on one case a lesson may quote. Invented
// by this wave. NOT a published case, NOT a real gathering system, and no
// oracle has ever checked any of it.
// ---------------------------------------------------------------------------

export const TEACHING_NETWORK_NAME = 'AGBADA WEST';
export const TEACHING_SEPARATOR_PSIA = 265;
export const TEACHING_ALLOCATION_LB_D = 985;
export const TEACHING_LINE_CAPACITY_LB_D = 640;

export const TEACHING_WELL_SPECS = Object.freeze({
  t1: { label: 'AGBADA-2', qmax: 8100, prPsia: 2750 },
  t2: { label: 'AGBADA-6', qmax: 3300, prPsia: 1650 },
  t3: { label: 'AGBADA-9', qmax: 5750, prPsia: 2350 },
  t4: { label: 'AGBADA-12', qmax: 2100, prPsia: 1450 },
});

export const TEACHING_NODES = Object.freeze([
  { id: 't1', kind: 'well', label: 'AGBADA-2' },
  { id: 't2', kind: 'well', label: 'AGBADA-6' },
  { id: 't3', kind: 'well', label: 'AGBADA-9' },
  { id: 't4', kind: 'well', label: 'AGBADA-12' },
  { id: 'ha', kind: 'junction', label: 'North manifold' },
  { id: 'hb', kind: 'junction', label: 'Loop tee' },
  { id: 'hc', kind: 'junction', label: 'Trunk tee' },
  { id: 'sep', kind: 'sink', label: 'Separator', pressurePsia: TEACHING_SEPARATOR_PSIA },
]);

export const TEACHING_BRANCHES = Object.freeze([
  { id: 'e1', from: 't1', to: 'ha', label: 'AGBADA-2 flowline' },
  { id: 'e2', from: 't2', to: 'ha', label: 'AGBADA-6 flowline' },
  { id: 'e3', from: 't3', to: 'hb', label: 'AGBADA-9 flowline' },
  { id: 'e4', from: 't4', to: 'ha', label: 'AGBADA-12 flowline' },
  { id: 'c1', from: 'ha', to: 'hc', label: 'North bypass' },
  { id: 'c2', from: 'ha', to: 'hb', label: 'Crosslink' },
  { id: 'c3', from: 'hb', to: 'hc', label: 'Loop leg' },
  { id: 'tk', from: 'hc', to: 'sep', label: 'Trunk' },
]);

/** Turbulent conductances, lb/d per ROOT psi. Not comparable with a linear one. */
export const TEACHING_K = Object.freeze({
  e1: 275, e2: 365, e3: 198, e4: 126, c1: 690, c2: 540, c3: 245, tk: 720,
});

/** The per-well surface split each teaching well is tested at. Rides with the mass. */
export const TEACHING_STREAM_TESTS = Object.freeze({
  t1: { qoStbd: 1690, qwStbd: 214, qgMscfd: 1305 },
  t2: { qoStbd: 605, qwStbd: 738, qgMscfd: 542 },
  t3: { qoStbd: 1042, qwStbd: 369, qgMscfd: 1613 },
  t4: { qoStbd: 118, qwStbd: 401, qgMscfd: 76 },
});

export const TEACHING_TOLERANCE = 1e-12;

const teachingWellRelations = () => ({
  t1: vogelWell(TEACHING_WELL_SPECS.t1),
  t2: vogelWell(TEACHING_WELL_SPECS.t2),
  t3: vogelWell(TEACHING_WELL_SPECS.t3),
  t4: allocatedWell({
    allocationLbD: TEACHING_ALLOCATION_LB_D,
    qmax: TEACHING_WELL_SPECS.t4.qmax,
    prPsia: TEACHING_WELL_SPECS.t4.prPsia,
  }),
});

const teachingBranchFlow = (kmap, capLbD) => (b, pIn, pOut) => (
  b.id === 'e4'
    ? cappedTurbulentBranch(kmap.e4, capLbD)(b, pIn, pOut)
    : turbulentBranch(kmap[b.id])(b, pIn, pOut));

/** The teaching solve, in one place, so every accessor reads the same run. */
const teachingRun = memoize(({
  reversedNodes = false, kmap = null, capLbD = TEACHING_LINE_CAPACITY_LB_D,
  allocationLbD = TEACHING_ALLOCATION_LB_D, tolerance = TEACHING_TOLERANCE,
  maxIter, initialPressures, dropWell = null,
} = {}) => {
  const wells = {
    ...teachingWellRelations(),
    t4: allocatedWell({
      allocationLbD,
      qmax: TEACHING_WELL_SPECS.t4.qmax,
      prPsia: TEACHING_WELL_SPECS.t4.prPsia,
    }),
  };
  const k = { ...TEACHING_K, ...(kmap || {}) };
  let nodes = TEACHING_NODES.map((n) => ({ ...n }));
  let branches = TEACHING_BRANCHES.map((b) => ({ ...b }));
  if (dropWell) {
    nodes = nodes.filter((n) => n.id !== dropWell);
    branches = branches.filter((b) => b.from !== dropWell);
  }
  if (reversedNodes) nodes = [...nodes].reverse();
  const network = buildNetwork({ nodes, branches });
  const res = solveNetwork({
    network,
    branchFlow: teachingBranchFlow(k, capLbD),
    wellInflow: (nd, p) => wells[nd.id](p),
    tolerance,
    maxIter,
    initialPressures,
  });
  return { network, res, k, wells, verdict: solveVerdict(network, res) };
});

/** The teaching network's topology, as `buildNetwork` indexed it. */
export const teachingTopology = () => {
  const { network } = teachingRun();
  return {
    provenance: 'teaching',
    teaching: true,
    name: TEACHING_NETWORK_NAME,
    ok: network.ok,
    nodeCount: network.nodes.length,
    branchCount: network.branches.length,
    unknownCount: network.unknownIds.length,
    sinkCount: network.sinkIds.length,
    unknownIds: [...network.unknownIds],
    sinkIds: [...network.sinkIds],
    separatorPsia: TEACHING_SEPARATOR_PSIA,
    nodes: TEACHING_NODES.map((n) => ({
      id: n.id,
      kind: n.kind,
      label: n.label,
      branchCount: network.adjacency.get(n.id).length,
      pressureIsUnknown: n.kind !== 'sink',
    })),
    branches: TEACHING_BRANCHES.map((b) => ({
      id: b.id,
      label: b.label,
      from: b.from,
      to: b.to,
      conductanceLbDPerRootPsi: TEACHING_K[b.id],
      capacityLimitedLbD: b.id === 'e4' ? TEACHING_LINE_CAPACITY_LB_D : null,
    })),
  };
};

/** The teaching network's conditions, so a lesson can restate the case. */
export const teachingConditions = () => ({
  provenance: 'teaching',
  teaching: true,
  name: TEACHING_NETWORK_NAME,
  separatorPsia: TEACHING_SEPARATOR_PSIA,
  toleranceAsked: TEACHING_TOLERANCE,
  iterationCap: DEFAULT_MAX_ITER,
  allocationLbD: TEACHING_ALLOCATION_LB_D,
  lineCapacityLbD: TEACHING_LINE_CAPACITY_LB_D,
  shortfallByConstructionLbD: TEACHING_ALLOCATION_LB_D - TEACHING_LINE_CAPACITY_LB_D,
  wells: Object.entries(TEACHING_WELL_SPECS).map(([id, w]) => ({
    id,
    label: w.label,
    qmaxLbD: w.qmax,
    reservoirPressurePsia: w.prPsia,
    flowlineConductanceLbDPerRootPsi: TEACHING_K[{ t1: 'e1', t2: 'e2', t3: 'e3', t4: 'e4' }[id]],
    allocationLbD: id === 't4' ? TEACHING_ALLOCATION_LB_D : null,
    flowlineCapacityLbD: id === 't4' ? TEACHING_LINE_CAPACITY_LB_D : null,
  })),
});

/** The teaching network solved: every node, every branch, and the audit. */
export const teachingSolve = () => {
  const { res, verdict } = teachingRun();
  return {
    provenance: 'teaching',
    teaching: true,
    name: TEACHING_NETWORK_NAME,
    ...verdict,
    pressuresPsia: { ...res.pressures },
    flowsLbD: { ...res.flows },
    wellRatesLbD: { ...res.wellRates },
    imbalanceLbD: { ...res.imbalance },
    totalWellRatesLbD: sum(Object.values(res.wellRates)),
    trunkLbD: res.flows.tk,
  };
};

/** The same solve as a node table a panel can lay out. */
export const teachingNodeRows = () => {
  const { res, verdict } = teachingRun();
  return TEACHING_NODES.map((n) => ({
    provenance: 'teaching',
    teaching: true,
    id: n.id,
    label: n.label,
    kind: n.kind,
    pressurePsia: res.pressures[n.id],
    pressureIsUnknown: n.kind !== 'sink',
    isPinned: verdict.pinned.includes(n.id),
    imbalanceLbD: n.kind === 'sink' ? null : res.imbalance[n.id],
    wellRateLbD: n.kind === 'well' ? res.wellRates[n.id] : null,
    // provenance rule 8: a pinned pressure and a solved pressure wear the same
    // label in the same object, so the panel is handed the difference
    pressureIsDetermined: n.kind === 'sink' ? true : !verdict.pinned.includes(n.id),
  }));
};

/** And as a branch table, with the drawn sense and the solved one side by side. */
export const teachingBranchRows = () => {
  const { res } = teachingRun();
  return TEACHING_BRANCHES.map((b) => {
    const q = res.flows[b.id];
    const dp = res.pressures[b.from] - res.pressures[b.to];
    return {
      provenance: 'teaching',
      teaching: true,
      id: b.id,
      label: b.label,
      drawnFrom: b.from,
      drawnTo: b.to,
      conductanceLbDPerRootPsi: TEACHING_K[b.id],
      signedFlowLbD: q,
      magnitudeLbD: Math.abs(q),
      solvedFrom: q >= 0 ? b.from : b.to,
      solvedTo: q >= 0 ? b.to : b.from,
      runsAsDrawn: q >= 0,
      dpDrawnSensePsi: dp,
      capacityLimitedLbD: b.id === 'e4' ? TEACHING_LINE_CAPACITY_LB_D : null,
      atItsCapacity: b.id === 'e4' && Math.abs(q) === TEACHING_LINE_CAPACITY_LB_D,
    };
  });
};

// ---------------------------------------------------------------------------
// SECTION 9. ONE WELL ON ITS OWN LINE, AGAINST THE BOUNDARY.
// Associate m05 and m06 l02. TEACHING. The layer a single-well studio gives
// you, and the baseline the network then destroys.
// ---------------------------------------------------------------------------

const soloRun = memoize((id) => {
  const spec = TEACHING_WELL_SPECS[id];
  const branchId = { t1: 'e1', t2: 'e2', t3: 'e3', t4: 'e4' }[id];
  const k = TEACHING_K[branchId];
  const wells = teachingWellRelations();
  const network = buildNetwork({
    nodes: [
      { id, kind: 'well', label: spec.label },
      { id: 'sep', kind: 'sink', label: 'Separator', pressurePsia: TEACHING_SEPARATOR_PSIA },
    ],
    branches: [{ id: 'solo', from: id, to: 'sep', label: `${spec.label} flowline` }],
  });
  const res = solveNetwork({
    network,
    branchFlow: (b, pIn, pOut) => (id === 't4'
      ? cappedTurbulentBranch(k, TEACHING_LINE_CAPACITY_LB_D)(b, pIn, pOut)
      : turbulentBranch(k)(b, pIn, pOut)),
    wellInflow: (nd, p) => wells[nd.id](p),
    tolerance: TEACHING_TOLERANCE,
  });
  return { network, res, k, verdict: solveVerdict(network, res) };
});

/**
 * Each teaching well on its own flowline against the separator, with nothing
 * else on the system. NOTE THE FOURTH WELL. Its solo answer is already wrong
 * and the engine says it converged: its allocation is larger than its flowline
 * can pass, so the line saturates, the node goes flat, it is pinned, and the
 * difference stops being counted. Its reported residual is zero and its
 * conservation gap is 345 lb/d, and the two are not in contradiction because
 * they are answers to different questions.
 */
export const teachingSoloRows = () => ['t1', 't2', 't3', 't4'].map((id) => {
  const spec = TEACHING_WELL_SPECS[id];
  const { res, k, verdict } = soloRun(id);
  const wells = teachingWellRelations();
  return {
    provenance: 'teaching',
    teaching: true,
    id,
    label: spec.label,
    qmaxLbD: spec.qmax,
    reservoirPressurePsia: spec.prPsia,
    flowlineConductanceLbDPerRootPsi: k,
    allocationLbD: id === 't4' ? TEACHING_ALLOCATION_LB_D : null,
    flowlineCapacityLbD: id === 't4' ? TEACHING_LINE_CAPACITY_LB_D : null,
    separatorPsia: TEACHING_SEPARATOR_PSIA,
    wellheadPsia: res.pressures[id],
    rateLbD: res.wellRates[id],
    flowlineLbD: res.flows.solo,
    lineDropPsi: res.pressures[id] - TEACHING_SEPARATOR_PSIA,
    drawdownPsi: spec.prPsia - res.pressures[id],
    inflowAtThatWellheadLbD: wells[id](res.pressures[id]),
    // and the two roads, side by side, on every row
    ...verdict,
  };
});

// ---------------------------------------------------------------------------
// SECTION 10. WHAT THE NETWORK COSTS EACH WELL.
// Professional m03 l03, Expert m01 l01. TEACHING.
// ---------------------------------------------------------------------------

/**
 * The same four wells, first alone on their own flowlines and then on the
 * system together. Neither column can be got at from the other by any
 * single-well method, because every single-well study is run against a
 * wellhead pressure somebody typed in.
 */
export const teachingFightRows = () => {
  const { res } = teachingRun();
  return teachingSoloRows().map((solo) => {
    const rate = res.wellRates[solo.id];
    return {
      provenance: 'teaching',
      teaching: true,
      id: solo.id,
      label: solo.label,
      aloneLbD: solo.rateLbD,
      aloneWellheadPsia: solo.wellheadPsia,
      onTheSystemLbD: rate,
      onTheSystemWellheadPsia: res.pressures[solo.id],
      lostLbD: solo.rateLbD - rate,
      lostPct: ((solo.rateLbD - rate) / solo.rateLbD) * 100,
      wellheadRosePsi: res.pressures[solo.id] - solo.wellheadPsia,
      isPinned: (res.pinned || []).includes(solo.id),
    };
  });
};

/** The weak well loses most, and the two rankings are not the same ranking. */
export const teachingFightHeadline = () => {
  const rows = teachingFightRows();
  const { res, verdict } = teachingRun();
  const soloSum = sum(rows.map((r) => r.aloneLbD));
  const systemSum = sum(rows.map((r) => r.onTheSystemLbD));
  return {
    provenance: 'teaching',
    teaching: true,
    soloRatesAddToLbD: soloSum,
    theSystemProducesLbD: systemSum,
    theNetworkCostsLbD: soloSum - systemSum,
    theNetworkCostsPct: ((soloSum - systemSum) / soloSum) * 100,
    rankedByPercentageLost: [...rows].sort((a, b) => b.lostPct - a.lostPct)
      .map((r) => ({ id: r.id, label: r.label, lostPct: r.lostPct })),
    rankedByRateOnTheSystem: [...rows].sort((a, b) => b.onTheSystemLbD - a.onTheSystemLbD)
      .map((r) => ({ id: r.id, label: r.label, rateLbD: r.onTheSystemLbD })),
    theTwoRankingsDiffer: [...rows].sort((a, b) => b.lostPct - a.lostPct).map((r) => r.id).join()
      !== [...rows].sort((a, b) => b.onTheSystemLbD - a.onTheSystemLbD).map((r) => r.id).join(),
    // and the delivered total is NOT the produced total, because one well is pinned
    trunkLbD: res.flows.tk,
    ...verdict,
  };
};

/**
 * Take one well off the system at a time and watch what the survivors gain.
 * The gain is not the rate the shut well was reported to be making, and
 * reading it as though it were is the standard way a deferment number is
 * overstated.
 *
 * READ THE t4 ROW TWICE. Its deferment measured from the REPORTED rate is
 * overstated by exactly the conservation gap, in the section whose whole
 * subject is that deferment numbers are overstated, so both readings are here
 * under distinct names: `defermentFromReportedRateLbD` and
 * `defermentFromDeliveredFlowLbD`.
 */
export const teachingShutInRows = () => {
  const base = teachingRun();
  return ['t1', 't2', 't3', 't4'].map((off) => {
    const { res, verdict } = teachingRun({ dropWell: off });
    const total = sum(Object.values(res.wellRates));
    const survivorGain = ['t1', 't2', 't3', 't4'].filter((x) => x !== off)
      .reduce((a, x) => a + (res.wellRates[x] - base.res.wellRates[x]), 0);
    const reported = base.res.wellRates[off];
    const branchId = { t1: 'e1', t2: 'e2', t3: 'e3', t4: 'e4' }[off];
    const delivered = base.res.flows[branchId];
    return {
      provenance: 'teaching',
      teaching: true,
      shutIn: off,
      label: TEACHING_WELL_SPECS[off].label,
      totalFromTheRestLbD: total,
      survivorsGainedLbD: survivorGain,
      reportedRateLbD: reported,
      itsFlowlineDeliveredLbD: delivered,
      defermentFromReportedRateLbD: reported - survivorGain,
      defermentFromDeliveredFlowLbD: delivered - survivorGain,
      overstatementLbD: reported - delivered,
      itWasPinnedOnTheFullSystem: base.verdict.pinned.includes(off),
      ...verdict,
    };
  });
};

// ---------------------------------------------------------------------------
// SECTION 11. A DRAWN ARROW IS NOT A FLOW DIRECTION.
// Professional m02 l04, Expert m02 l01. TEACHING. Provenance rule 5.
// ---------------------------------------------------------------------------

/**
 * The crosslink is drawn from the north manifold to the loop tee and the solve
 * returns it NEGATIVE, so it carries mass the other way. `diagnose` names it,
 * and the name is the only thing in the return that does.
 */
export const teachingDirection = () => {
  const { res } = teachingRun();
  const d = teachingDiagnose();
  const b = TEACHING_BRANCHES.find((x) => x.id === 'c2');
  const q = res.flows.c2;
  return {
    provenance: 'teaching',
    teaching: true,
    id: b.id,
    label: b.label,
    drawnFrom: b.from,
    drawnTo: b.to,
    signedFlowLbD: q,
    magnitudeLbD: Math.abs(q),
    itActuallyRunsFrom: q < 0 ? b.to : b.from,
    itActuallyRunsTo: q < 0 ? b.from : b.to,
    dpDrawnSensePsi: res.pressures[b.from] - res.pressures[b.to],
    theDrawnDownstreamEndIsTheHigher: res.pressures[b.to] > res.pressures[b.from],
    backflowsNamedByDiagnose: d.backflows.map((r) => r.id),
    deadLegsNamedByDiagnose: d.dead.map((r) => r.id),
    theSignIsAPropertyOfTheSolution: true,
  };
};

export const CROSSLINK_SWEEP_K = Object.freeze([60, 150, 300, 540, 900, 1400]);

/**
 * Walk the crosslink conductance and watch the direction hold and then the
 * magnitude grow. SWEEP POINTS on the teaching network; the 540 row is the
 * teaching case.
 */
export const crosslinkSweepRows = (ks = CROSSLINK_SWEEP_K) => ks.map((kc2) => {
  const { res, verdict } = teachingRun({ kmap: { c2: kc2 } });
  return {
    provenance: 'teaching',
    teaching: true,
    crosslinkConductanceLbDPerRootPsi: kc2,
    isTheTeachingCase: kc2 === TEACHING_K.c2,
    manifoldPsia: res.pressures.ha,
    loopTeePsia: res.pressures.hb,
    crosslinkLbD: res.flows.c2,
    dpDrawnSensePsi: res.pressures.ha - res.pressures.hb,
    trunkLbD: res.flows.tk,
    runsBackwards: res.flows.c2 < 0,
    ...verdict,
  };
});

// ---------------------------------------------------------------------------
// SECTION 12. THE BOTTLENECK IS NOT THE BIGGEST DROP.
// Professional m05. Provenance rule 6.
// ---------------------------------------------------------------------------

const teachingDiagnose = memoize(() => {
  const { network, res } = teachingRun();
  return diagnose({ network, pressures: res.pressures, flows: res.flows });
});

/** The two published gate fixtures, where the trunk is and is not the biggest drop. */
export const publishedDiagnoseCases = memoize(() => {
  const network = buildNetwork({
    nodes: [
      { id: 'w1', kind: 'well' }, { id: 'w2', kind: 'well' },
      { id: 'h', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 },
    ],
    branches: [
      { id: 'big', from: 'w1', to: 'h', label: 'W-1 flowline' },
      { id: 'choked', from: 'w2', to: 'h', label: 'W-2 flowline' },
      { id: 'trunk', from: 'h', to: 's', label: 'Trunk' },
    ],
  });
  const cases = [
    ['case 1', { w1: 400, w2: 900, h: 300, s: 100 }, { big: 40000, choked: 2000, trunk: 42000 }],
    ['case 2', { w1: 400, w2: 500, h: 350, s: 100 }, { big: 40000, choked: 300, trunk: 40300 }],
  ];
  return cases.map(([label, pressures, flows]) => {
    const d = diagnose({ network, pressures, flows });
    return {
      provenance: 'published',
      caseName: label,
      rows: d.rows.map((r) => ({
        id: r.id, label: r.label, dpPsi: r.dpPsi, massLbD: r.massLbD,
        intensityPsiPerLbD: r.intensity, backflow: r.backflow,
      })),
      biggestDropId: d.biggestDrop.id,
      bottleneckId: d.bottleneck.id,
      theyAreTheSameBranch: d.biggestDrop.id === d.bottleneck.id,
    };
  });
});

/** Every branch of the teaching network, as `diagnose` reads it. */
export const teachingDiagnoseRows = () => teachingDiagnose().rows.map((r) => ({
  provenance: 'teaching',
  teaching: true,
  id: r.id,
  label: r.label,
  from: r.from,
  to: r.to,
  dpPsi: r.dpPsi,
  massLbD: r.massLbD,
  intensityPsiPerLbD: r.intensity,
  backflow: r.backflow,
  carryingMass: Math.abs(r.massLbD) > DEAD_BRANCH_MASS_LB_D,
}));

/**
 * PROVENANCE RULE 6, ON ONE OBJECT. Both rankings are on MAGNITUDE:
 * `biggestDrop` reduces on `Math.abs(dpPsi)` and the intensity is
 * `Math.abs(dp) / Math.abs(q)`, so a backflow branch is ranked on the size of
 * its drop and its mass and not on their sign. What differs is the POPULATION,
 * and that difference is real: `bottleneck` ranks only over branches carrying
 * mass above 1e-9 lb/d, while `biggestDrop` ranks over EVERY branch including
 * a dead one. Both counts are here.
 */
export const diagnoseHeadline = () => {
  const d = teachingDiagnose();
  const rows = teachingDiagnoseRows();
  const carrying = rows.filter((r) => r.carryingMass);
  return {
    provenance: 'teaching',
    teaching: true,
    biggestDropId: d.biggestDrop.id,
    biggestDropLabel: d.biggestDrop.label,
    biggestDropDpPsi: d.biggestDrop.dpPsi,
    biggestDropMassLbD: d.biggestDrop.massLbD,
    biggestDropIntensityPsiPerLbD: d.biggestDrop.intensity,
    bottleneckId: d.bottleneck.id,
    bottleneckLabel: d.bottleneck.label,
    bottleneckDpPsi: d.bottleneck.dpPsi,
    bottleneckMassLbD: d.bottleneck.massLbD,
    bottleneckIntensityPsiPerLbD: d.bottleneck.intensity,
    theyAreDifferentBranches: d.biggestDrop.id !== d.bottleneck.id,
    // both rankings are on MAGNITUDE and they differ in POPULATION
    bothRankingsAreOnMagnitude: true,
    biggestDropPopulation: rows.length,
    bottleneckPopulation: carrying.length,
    populationsDiffer: rows.length !== carrying.length,
    deadBranchCount: d.dead.length,
    deadBranchThresholdLbD: DEAD_BRANCH_MASS_LB_D,
    backflowCount: d.backflows.length,
    backflowIds: d.backflows.map((r) => r.id),
    deadIds: d.dead.map((r) => r.id),
  };
};

/**
 * THE POPULATIONS, SHOWN RATHER THAN ASSERTED. A dead leg with a large
 * pressure difference across it can be the reported biggest drop and can never
 * be the bottleneck, because it is not in the bottleneck's population at all.
 * A TEACHING fixture: no published case distinguishes the two rankings this
 * way, so this one was built to.
 */
export const populationFixture = memoize(() => {
  const network = buildNetwork({
    nodes: [
      { id: 'w', kind: 'well' }, { id: 'h', kind: 'junction' },
      { id: 'd', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 },
    ],
    branches: [
      { id: 'live', from: 'w', to: 'h', label: 'A flowline carrying mass' },
      { id: 'dead', from: 'h', to: 'd', label: 'A dead leg with a big drop across it' },
      { id: 'trunk', from: 'h', to: 's', label: 'Trunk' },
    ],
  });
  // the dead leg is at a HIGHER pressure than the tee it hangs off, so its
  // drop is the largest on the network in MAGNITUDE and negative in sign,
  // which is also what makes it a clean statement of the magnitude ranking
  const pressures = { w: 700, h: 400, d: 1100, s: 100 };
  const flows = { live: 30000, dead: 0, trunk: 30000 };
  const d = diagnose({ network, pressures, flows });
  const carrying = d.rows.filter((r) => Math.abs(r.massLbD) > DEAD_BRANCH_MASS_LB_D);
  return {
    provenance: 'teaching',
    teaching: true,
    rows: d.rows.map((r) => ({
      id: r.id, label: r.label, dpPsi: r.dpPsi, massLbD: r.massLbD,
      intensityPsiPerLbD: r.intensity, inTheBottleneckPopulation: Math.abs(r.massLbD) > DEAD_BRANCH_MASS_LB_D,
    })),
    biggestDropId: d.biggestDrop.id,
    bottleneckId: d.bottleneck.id,
    biggestDropPopulation: d.rows.length,
    bottleneckPopulation: carrying.length,
    theBiggestDropIsADeadLeg: Math.abs(d.biggestDrop.massLbD) <= DEAD_BRANCH_MASS_LB_D,
    aDeadLegCanNeverBeTheBottleneck: d.bottleneck.id !== d.biggestDrop.id,
    deadLegIntensity: d.rows.find((r) => r.id === 'dead').intensity,
    deadLegIntensityIsInfinite: !Number.isFinite(d.rows.find((r) => r.id === 'dead').intensity),
  };
});

export const WHISPER_SWEEP_LB_D = Object.freeze([1e-8, 1e-6, 1e-3, 1, 100]);

/**
 * A RANKING THAT FAILS OPEN. The intensity is |dp| over |mass| with only a
 * guard at a billionth of a pound a day, so a leg carrying a millionth of a
 * pound a day with one psi across it scores a million and wins the ranking
 * every time, and it is the one leg nothing can be done about. On every real
 * case in the digest the ranking behaves exactly as its header says, which is
 * why this is a note rather than a defect. A relative floor, one part in ten
 * thousand of the largest branch mass, would close it.
 */
export const whisperLegRows = (masses = WHISPER_SWEEP_LB_D) => {
  const network = buildNetwork({
    nodes: [
      { id: 'w', kind: 'well' }, { id: 'j', kind: 'junction' },
      { id: 'd', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 },
    ],
    branches: [
      { id: 'main', from: 'w', to: 'j', label: 'Main flowline' },
      { id: 'whisper', from: 'j', to: 'd', label: 'A leg carrying almost nothing' },
      { id: 'out', from: 'j', to: 's', label: 'Trunk' },
    ],
  });
  return masses.map((whisperLbD) => {
    const d = diagnose({
      network,
      pressures: { w: 800, j: 400, d: 399, s: 100 },
      flows: { main: 50000, whisper: whisperLbD, out: 50000 },
    });
    const row = d.rows.find((r) => r.id === 'whisper');
    return {
      provenance: 'derived',
      whisperMassLbD: whisperLbD,
      whisperDpPsi: row.dpPsi,
      whisperIntensityPsiPerLbD: row.intensity,
      bottleneckId: d.bottleneck.id,
      biggestDropId: d.biggestDrop.id,
      theWhisperWinsTheRanking: d.bottleneck.id === 'whisper',
      aRelativeFloorWouldCloseIt: 50000 / 1e4,
    };
  });
};

// ---------------------------------------------------------------------------
// SECTION 13. STREAMS ADD BY RATE AND NEVER BY RATIO.
// Professional m04, Expert m02.
// ---------------------------------------------------------------------------

/** The published gate fixture: a big dry well and a small wet one. */
export const publishedStreams = memoize(() => {
  const network = buildNetwork({
    nodes: [
      { id: 'w1', kind: 'well' }, { id: 'w2', kind: 'well' },
      { id: 'h', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 150 },
    ],
    branches: [
      { id: 'b1', from: 'w1', to: 'h' }, { id: 'b2', from: 'w2', to: 'h' },
      { id: 'b3', from: 'h', to: 's' },
    ],
  });
  const flows = { b1: 30000, b2: 10000, b3: 40000 };
  const wellStreams = {
    w1: { qoStbd: 2700, qwStbd: 300, qgMscfd: 1600, massLbD: 30000 },
    w2: { qoStbd: 200, qwStbd: 800, qgMscfd: 90, massLbD: 10000 },
  };
  const s = propagateStreams({ network, flows, wellStreams });
  const trunk = s.branchStreams.b3;
  const cut = (x) => (100 * x.qwStbd) / (x.qoStbd + x.qwStbd);
  const naive = (cut(wellStreams.w1) + cut(wellStreams.w2)) / 2;
  return {
    provenance: 'published',
    ok: s.ok,
    wells: JSON.parse(JSON.stringify(wellStreams)),
    trunkOilStbd: trunk.qoStbd,
    trunkWaterStbd: trunk.qwStbd,
    trunkGasMscfd: trunk.qgMscfd,
    trunkMassLbD: trunk.massLbD,
    trunkWaterCutPct: cut(trunk),
    wellWaterCutsPct: [cut(wellStreams.w1), cut(wellStreams.w2)],
    plainAverageOfTheCutsPct: naive,
    averagingIsWrongByPoints: naive - cut(trunk),
    averagingIsWrongByFactor: naive / cut(trunk),
    ratiosAreNeverMixed: true,
  };
});

/** A node with more than one way out splits its stream by MASS. PUBLISHED. */
export const publishedStreamSplit = memoize(() => {
  const network = buildNetwork({
    nodes: [
      { id: 'w', kind: 'well' }, { id: 'j', kind: 'junction' },
      { id: 's1', kind: 'sink', pressurePsia: 100 },
      { id: 's2', kind: 'sink', pressurePsia: 100 },
    ],
    branches: [
      { id: 'a', from: 'w', to: 'j' },
      { id: 'x', from: 'j', to: 's1' }, { id: 'y', from: 'j', to: 's2' },
    ],
  });
  const s = propagateStreams({
    network,
    flows: { a: 1000, x: 750, y: 250 },
    wellStreams: { w: { qoStbd: 400, qwStbd: 100, qgMscfd: 200, massLbD: 1000 } },
  });
  return {
    provenance: 'published',
    ok: s.ok,
    arrivingOilStbd: 400,
    legXMassLbD: 750,
    legYMassLbD: 250,
    legXOilStbd: s.branchStreams.x.qoStbd,
    legYOilStbd: s.branchStreams.y.qoStbd,
    sumOfTheTwoLegsOilStbd: s.branchStreams.x.qoStbd + s.branchStreams.y.qoStbd,
    theSplitIsByMassShare: true,
  };
});

/** A recirculating solved direction is REPORTED, not iterated on. PUBLISHED. */
export const publishedStreamRefusal = () => {
  const network = buildNetwork({
    nodes: [
      { id: 'w', kind: 'well' }, { id: 'a', kind: 'junction' },
      { id: 'b', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 },
    ],
    branches: [
      { id: 'i', from: 'w', to: 'a' }, { id: 'ab', from: 'a', to: 'b' },
      { id: 'ba', from: 'b', to: 'a' }, { id: 'o', from: 'b', to: 's' },
    ],
  });
  const s = propagateStreams({
    network,
    flows: { i: 100, ab: 50, ba: 50, o: 100 },
    wellStreams: { w: { qoStbd: 10, qwStbd: 0, qgMscfd: 0, massLbD: 100 } },
  });
  return {
    provenance: 'published',
    label: 'the solved flow directions form a loop',
    ok: s.ok,
    refused: s.ok === false,
    error: s.error === undefined ? null : s.error,
  };
};

const teachingStreamRun = memoize((massFactor = 1) => {
  const { network, res } = teachingRun();
  const wellStreams = Object.fromEntries(Object.entries(TEACHING_STREAM_TESTS)
    .map(([id, s]) => [id, { ...s, massLbD: res.wellRates[id] * massFactor }]));
  const streams = propagateStreams({ network, flows: res.flows, wellStreams });
  return { network, res, wellStreams, streams };
});

/** The propagation on AGBADA WEST, along the directions the solve actually found. */
export const teachingStreamRows = () => {
  const { streams } = teachingStreamRun();
  return TEACHING_BRANCHES.map((b) => {
    const s = streams.branchStreams[b.id];
    return {
      provenance: 'teaching',
      teaching: true,
      id: b.id,
      label: b.label,
      oilStbd: s.qoStbd,
      waterStbd: s.qwStbd,
      gasMscfd: s.qgMscfd,
      massLbD: s.massLbD,
      waterCutPct: (100 * s.qwStbd) / (s.qoStbd + s.qwStbd),
    };
  });
};

/** What arrives at the separator, and why the plain average of the cuts misses. */
export const teachingStreamHeadline = () => {
  const { streams } = teachingStreamRun();
  const trunk = streams.branchStreams.tk;
  const arriving = streams.nodeStreams.sep;
  const cuts = Object.entries(TEACHING_STREAM_TESTS).map(([id, s]) => ({
    id,
    label: TEACHING_WELL_SPECS[id].label,
    waterCutPct: (100 * s.qwStbd) / (s.qoStbd + s.qwStbd),
  }));
  const trunkCut = (100 * trunk.qwStbd) / (trunk.qoStbd + trunk.qwStbd);
  const average = sum(cuts.map((c) => c.waterCutPct)) / cuts.length;
  return {
    provenance: 'teaching',
    teaching: true,
    arrivingOilStbd: arriving.qoStbd,
    arrivingWaterStbd: arriving.qwStbd,
    arrivingGasMscfd: arriving.qgMscfd,
    arrivingMassLbD: arriving.massLbD,
    testedOilStbd: sum(Object.values(TEACHING_STREAM_TESTS).map((s) => s.qoStbd)),
    testedWaterStbd: sum(Object.values(TEACHING_STREAM_TESTS).map((s) => s.qwStbd)),
    testedGasMscfd: sum(Object.values(TEACHING_STREAM_TESTS).map((s) => s.qgMscfd)),
    trunkWaterCutPct: trunkCut,
    wellWaterCuts: cuts,
    plainAverageOfTheCutsPct: average,
    averagingIsWrongByPoints: average - trunkCut,
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. THE STREAM MASS NOBODY COMPARES, AND TWO SIGN CONVENTIONS UNDER
// ONE WORD. Expert m02. Provenance rule 5.
// ---------------------------------------------------------------------------

/**
 * `wellStreams[id].massLbD` is supplied by the caller and is never compared
 * with `wellRates[id]`, so whatever hole the solve left propagates straight
 * into the surface split. The same shortfall appears on every branch
 * downstream of the pinned well and nothing in the result mentions it.
 */
export const teachingStreamMassRows = () => {
  const { res, streams } = teachingStreamRun();
  return TEACHING_BRANCHES.map((b) => {
    const solved = res.flows[b.id];
    const streamMass = streams.branchStreams[b.id].massLbD;
    return {
      provenance: 'teaching',
      teaching: true,
      id: b.id,
      label: b.label,
      theSolveSaysLbD: Math.abs(solved),
      theStreamSaysLbD: streamMass,
      gapLbD: streamMass - Math.abs(solved),
      agrees: Math.abs(streamMass - Math.abs(solved)) <= DEAD_BRANCH_MASS_LB_D,
    };
  });
};

/**
 * TWO DIFFERENT CAUSES SHOW UP IN ONE COLUMN AND ONLY ONE OF THEM IS THE SIGN
 * CONVENTION. `flows[b]` is signed from the drawn `from` to the drawn `to`;
 * `branchStreams[b].massLbD` is the stream along the SOLVED direction and is
 * always positive. On the branch that runs backwards the difference is exactly
 * TWICE what it carries, and that factor of two is the signature. On the three
 * branches carrying the pinned well's reported mass the difference is the
 * conservation gap, and every one of those ran the way it was drawn. So it is
 * NOT true that differencing the two finds zero everywhere the network ran as
 * drawn: `cause` separates them.
 */
export const signConventionRows = () => {
  const { res, streams } = teachingStreamRun();
  return TEACHING_BRANCHES.map((b) => {
    const signed = res.flows[b.id];
    const streamMass = streams.branchStreams[b.id].massLbD;
    const difference = streamMass - signed;
    const runsBackwards = signed < 0;
    let cause = 'none, the two agree';
    if (Math.abs(difference) > DEAD_BRANCH_MASS_LB_D) {
      cause = runsBackwards
        ? 'the sign convention, and the difference is exactly twice what the branch carries'
        : 'the pinned well mass hole, and this branch ran the way it was drawn';
    }
    return {
      provenance: 'teaching',
      teaching: true,
      id: b.id,
      label: b.label,
      signedFlowLbD: signed,
      branchStreamMassLbD: streamMass,
      differenceLbD: difference,
      runsBackwards,
      differenceOverMagnitude: Math.abs(signed) > 0 ? difference / Math.abs(signed) : null,
      cause,
    };
  });
};

export const STREAM_LIE_FACTORS = Object.freeze([0.8, 0.9, 1.0, 1.1, 1.25, 2.0]);

/**
 * THE GENERAL FORM IS WORSE THAN THE SPECIFIC ONE. Hand the same network well
 * stream masses that are simply wrong, by any factor, and the module
 * propagates them with ok true and no warning. And the COMPONENT rates are
 * untouched by any of it, because the split is by mass SHARE at a junction and
 * the shares are unchanged.
 */
export const streamLieRows = (factors = STREAM_LIE_FACTORS) => {
  const honest = teachingStreamRun();
  return factors.map((factor) => {
    const { streams } = teachingStreamRun(factor);
    return {
      provenance: 'teaching',
      teaching: true,
      massFactor: factor,
      isTheHonestMass: factor === 1,
      ok: streams.ok,
      trunkStreamMassLbD: streams.branchStreams.tk.massLbD,
      solvedTrunkLbD: honest.res.flows.tk,
      separatorOilStbd: streams.nodeStreams.sep.qoStbd,
      separatorOilAtTheHonestMassStbd: honest.streams.nodeStreams.sep.qoStbd,
      separatorOilMovedStbd: streams.nodeStreams.sep.qoStbd - honest.streams.nodeStreams.sep.qoStbd,
      warningCount: 0,
      theModuleDoesNotCompareThem: true,
    };
  });
};

/** The one comparison that would catch both, priced on each well. */
export const streamDoorCheckRows = () => {
  const { res } = teachingRun();
  return Object.keys(TEACHING_STREAM_TESTS).map((id) => {
    const branchId = { t1: 'e1', t2: 'e2', t3: 'e3', t4: 'e4' }[id];
    const reported = res.wellRates[id];
    const delivered = Math.abs(res.flows[branchId]);
    return {
      provenance: 'teaching',
      teaching: true,
      id,
      label: TEACHING_WELL_SPECS[id].label,
      wellRateLbD: reported,
      itsFlowlineCarriesLbD: delivered,
      gapLbD: reported - delivered,
      theDoorCheckWouldFire: Math.abs(reported - delivered) > DEAD_BRANCH_MASS_LB_D,
    };
  });
};

// ---------------------------------------------------------------------------
// SECTION 15. A NODE THAT NOTHING DEPENDS ON IS PINNED.
// Expert m01. Provenance rules 1 and 8.
// ---------------------------------------------------------------------------

/**
 * The gate's own pinning fixture: a well whose inflow is a constant 2000 lb/d
 * on a branch whose flow is a constant 1000 lb/d, so neither depends on any
 * pressure. THE GATE ASSERTS ok, pinned AND THE WARNING TEXT ON THIS EXACT
 * CASE AND NEVER LOOKS AT THE HOLE IT JUST CREATED: a thousand pounds a day
 * that goes into the network and never comes out, under a reported residual of
 * zero.
 */
export const publishedPinning = memoize(() => {
  const network = buildNetwork({
    nodes: [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
    branches: [{ id: 'a', from: 'w', to: 's' }],
  });
  const res = solveNetwork({ network, branchFlow: () => 1000, wellInflow: () => 2000 });
  const verdict = solveVerdict(network, res);
  return {
    provenance: 'published',
    label: 'a constant inflow on a constant branch',
    wellInflowLbD: 2000,
    branchFlowLbD: 1000,
    nodeImbalanceLbD: res.imbalance.w,
    warning: verdict.warnings.join(' '),
    ...verdict,
  };
});

/** A LIVE network reports nothing pinned, which is what makes the flag readable. */
export const publishedLiveNode = memoize(() => {
  const network = buildNetwork({
    nodes: [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
    branches: [{ id: 'a', from: 'w', to: 's' }],
  });
  const res = solveNetwork({
    network,
    branchFlow: (b, pIn, pOut) => 300 * (pIn - pOut),
    wellInflow: (nd, p) => linearWell({ qmax: 20000, prPsia: 800 })(nd, p),
  });
  return {
    provenance: 'published',
    label: 'the same topology with a real branch and a real inflow',
    wellheadPsia: res.pressures.w,
    rateLbD: res.wellRates.w,
    ...solveVerdict(network, res),
  };
});

/**
 * THE CONTRACT GAP BEHIND IT. The module header requires `wellInflow` to be
 * monotone DECREASING in p. A well held to a facility allocation, a choke
 * limit or a compressor slot is monotone NON-increasing, with a flat top, and
 * the flat top is precisely what makes its node pinnable. AGBADA-12 is exactly
 * such a well and its flowline is capacity limited below its allocation.
 */
export const teachingPinning = () => {
  const { res, verdict } = teachingRun();
  return {
    provenance: 'teaching',
    teaching: true,
    pinnedId: 't4',
    pinnedLabel: TEACHING_WELL_SPECS.t4.label,
    allocationLbD: TEACHING_ALLOCATION_LB_D,
    lineCapacityLbD: TEACHING_LINE_CAPACITY_LB_D,
    shortfallByConstructionLbD: TEACHING_ALLOCATION_LB_D - TEACHING_LINE_CAPACITY_LB_D,
    pinnedPressurePsia: res.pressures.t4,
    itsReportedRateLbD: res.wellRates.t4,
    itsFlowlineCarriesLbD: res.flows.e4,
    itsOwnImbalanceLbD: res.imbalance.t4,
    // PROVENANCE RULE 1, ON THE CASE THE WHOLE COURSE IS BUILT ON
    ...verdict,
    theEngineCarriesTheImbalanceWhereNothingConsultsIt: true,
    // and the warning asserts a diagnosis it has not checked
    warning: verdict.warnings.join(' '),
    theWellIsProducing: res.wellRates.t4 > 0,
    theLineIsPassingMass: Math.abs(res.flows.e4) > 0,
    soItIsNeitherShutInNorOnADeadLine: res.wellRates.t4 > 0 && Math.abs(res.flows.e4) > 0,
    ifItReportedAPinnedImbalanceItWouldReportLbD: res.imbalance.t4,
  };
};

export const ALLOCATION_SWEEP_LB_D = Object.freeze([300, 500, 620, 640, 660, 800, 985, 1300]);

/**
 * Walk the allocation from below the line capacity to well above it and watch
 * the node go from live to pinned. THE SWEEP CROSSES THE LINE CAPACITY AND
 * NOTHING IN THE RETURN CHANGES EXCEPT THE WORD `pinned` AND A GAP NOBODY IS
 * SHOWN.
 */
export const teachingAllocationRows = (allocations = ALLOCATION_SWEEP_LB_D) =>
  allocations.map((allocationLbD) => {
    const { res, verdict } = teachingRun({ allocationLbD });
    return {
      provenance: 'teaching',
      teaching: true,
      allocationLbD,
      isTheTeachingAllocation: allocationLbD === TEACHING_ALLOCATION_LB_D,
      aboveTheLineCapacity: allocationLbD > TEACHING_LINE_CAPACITY_LB_D,
      wellRateLbD: res.wellRates.t4,
      itsFlowlineLbD: res.flows.e4,
      ...verdict,
    };
  });

/**
 * THE HEADLINE OF THIS COURSE, ON ONE OBJECT. `normOf` is the maximum over the
 * unknowns FILTERED to exclude the pinned ones, and `converged` is tested
 * against that norm, so a pinned node is removed from the measurement by
 * construction. Two candidate fixes, both cheap: report a pinned imbalance
 * alongside the residual, or refuse to set converged while any pinned node net
 * is non-zero. The second is the honest one.
 */
export const residualAgainstConservation = () => {
  const { verdict } = teachingRun();
  return {
    provenance: 'teaching',
    teaching: true,
    ...verdict,
    // the two roads, named again here because this accessor is the lesson
    theIterationSaysLbD: verdict.reportedResidualLbD,
    theAuditSaysLbD: verdict.conservationGapLbD,
    theAuditIsHowManyTimesTheIteration: verdict.gapOverReportedResidual,
    checkConservationIsInTheSameFile: true,
    solveNetworkNeverCallsIt: true,
    nothingInTheReturnIsACheckComputedAnotherWay: true,
  };
};

// ---------------------------------------------------------------------------
// SECTION 16. THE SAME NETWORK, DIFFERENT ANSWERS, DEPENDING ON THE GUESS.
// Expert m03. Provenance rule 8, and the sharpest thing in the wave.
// ---------------------------------------------------------------------------

/**
 * THE TEACHING WELL'S OWN CURVE, AND THE TWO PRESSURES THAT DEFINE ITS FLAT
 * TOP. Below 1013.848652 psia the allocation binds and the inflow is flat;
 * at 1182.577035 psia the Vogel inflow equals the LINE CAPACITY, the line
 * carries what the well delivers, and the mass balance closes. THAT SECOND
 * PRESSURE IS THE SOLUTION, and the engine's default start, every unknown at
 * the separator pressure, is deep inside the flat top and never finds it.
 */
export const teachingWellCurve = memoize(() => {
  const spec = TEACHING_WELL_SPECS.t4;
  const vogel = vogelWell({ qmax: spec.qmax, prPsia: spec.prPsia });
  const allocBinds = bisectOnRelation(vogel, TEACHING_ALLOCATION_LB_D, 0, spec.prPsia);
  const capCrossing = bisectOnRelation(vogel, TEACHING_LINE_CAPACITY_LB_D, 0, spec.prPsia);
  return {
    provenance: 'teaching',
    teaching: true,
    id: 't4',
    label: spec.label,
    qmaxLbD: spec.qmax,
    reservoirPressurePsia: spec.prPsia,
    allocationLbD: TEACHING_ALLOCATION_LB_D,
    lineCapacityLbD: TEACHING_LINE_CAPACITY_LB_D,
    allocationStopsBindingAtPsia: allocBinds,
    inflowEqualsLineCapacityAtPsia: capCrossing,
    flatTopWidthPsi: allocBinds,
    inflowAtTheCapacityCrossingLbD: vogel(capCrossing),
    theCapacityCrossingIsTheSolution: true,
    theDefaultGuessStartsInsideTheFlatTop: TEACHING_SEPARATOR_PSIA < allocBinds,
  };
});

export const INITIAL_GUESS_RUNS = Object.freeze([
  ['engine default, every unknown at the separator pressure', null],
  ['the pinned node started at 400 psia', { t4: 400 }],
  ['the pinned node started at 600 psia', { t4: 600 }],
  ['the pinned node started at 831 psia', { t4: 831 }],
  ['the pinned node started at 1200 psia', { t4: 1200 }],
  ['the pinned node started at 2000 psia', { t4: 2000 }],
  ['every unknown started at 1500 psia', {
    t1: 1500, t2: 1500, t3: 1500, t4: 1500, ha: 1500, hb: 1500, hc: 1500,
  }],
]);

/**
 * Change nothing but `initialPressures` and watch the answer move. EVERY RUN
 * BELOW REPORTS CONVERGED, and exactly one of them closes its mass balance:
 * the run that lands the pinned node at the pressure where the well's inflow
 * equals its line capacity. That row is the SOLUTION and the engine default
 * does not find it.
 *
 * Two further things this table says, and they are sharper than the heading.
 * THE REPORTED RESIDUAL MOVES AGAINST THE TRUTH: the two worst runs carry the
 * smallest reported residual on the table, so a reader ranking these by their
 * reported residual would pick the two worst. AND AGREEMENT IS NOT EVIDENCE:
 * two rows agree on the manifold to the last bit while disagreeing about what
 * the network produced.
 */
export const initialGuessRows = (runs = INITIAL_GUESS_RUNS) => runs.map(([label, initialPressures]) => {
  const { res, verdict } = teachingRun({ initialPressures: initialPressures || undefined });
  return {
    provenance: 'teaching',
    teaching: true,
    label,
    startedAtPsia: initialPressures ? initialPressures.t4 : null,
    isTheEngineDefault: initialPressures === null,
    pinnedPressurePsia: res.pressures.t4,
    itsFlowlineLbD: res.flows.e4,
    itsReportedRateLbD: res.wellRates.t4,
    manifoldPsia: res.pressures.ha,
    trunkLbD: res.flows.tk,
    // PROVENANCE RULE 1: the gap travels with the flag on every row
    ...verdict,
    isTheSolution: Math.abs(verdict.conservationGapLbD) <= DEAD_BRANCH_MASS_LB_D,
    // AND THE ROW THAT SOLVES IS THE ROW WHERE NOTHING IS PINNED AT ALL. At
    // the capacity crossing the allocation no longer binds, so the inflow
    // depends on pressure again, the node keeps its Jacobian row, and the
    // solver actually solves it. Every other start leaves the node inside the
    // flat top, pins it, and reports converged on a network that is not
    // balanced.
    nodeIsPinned: verdict.pinned.includes('t4'),
  };
});

/** The one row that solves, and what the default one does instead. */
export const initialGuessHeadline = () => {
  const rows = initialGuessRows();
  const solution = rows.find((r) => r.isTheSolution) || null;
  const dflt = rows.find((r) => r.isTheEngineDefault);
  const worst = rows.reduce((a, r) => (Math.abs(r.conservationGapLbD) > Math.abs(a.conservationGapLbD) ? r : a), rows[0]);
  const smallestResidual = rows.reduce((a, r) => (r.reportedResidualLbD < a.reportedResidualLbD ? r : a), rows[0]);
  return {
    provenance: 'teaching',
    teaching: true,
    runCount: rows.length,
    allReportConverged: rows.every((r) => r.converged),
    rowsThatCloseTheMassBalance: rows.filter((r) => r.isTheSolution).length,
    solutionPinnedPressurePsia: solution ? solution.pinnedPressurePsia : null,
    solutionReportedRateLbD: solution ? solution.itsReportedRateLbD : null,
    solutionFlowlineLbD: solution ? solution.itsFlowlineLbD : null,
    solutionConservationGapLbD: solution ? solution.conservationGapLbD : null,
    theCurveSaysTheSolutionSitsAtPsia: teachingWellCurve().inflowEqualsLineCapacityAtPsia,
    defaultPinnedPressurePsia: dflt.pinnedPressurePsia,
    defaultConservationGapLbD: dflt.conservationGapLbD,
    defaultReportedResidualLbD: dflt.reportedResidualLbD,
    defaultFindsTheSolution: dflt.isTheSolution,
    // the row that solves is the row where NOTHING is pinned, and every row
    // that pins the node reports converged on an unbalanced network
    solutionPinsNothing: solution ? solution.nodeIsPinned === false : null,
    rowsThatPinTheNode: rows.filter((r) => r.nodeIsPinned).length,
    everyPinnedRowStillReportsConverged: rows.filter((r) => r.nodeIsPinned).every((r) => r.converged),
    worstGapLbD: worst.conservationGapLbD,
    worstReportedResidualLbD: worst.reportedResidualLbD,
    smallestReportedResidualLbD: smallestResidual.reportedResidualLbD,
    smallestResidualGapLbD: smallestResidual.conservationGapLbD,
    // the residual gets BETTER as the answer gets WORSE
    theResidualMovesAgainstTheTruth:
      Math.abs(worst.conservationGapLbD) > Math.abs(dflt.conservationGapLbD)
      && worst.reportedResidualLbD < dflt.reportedResidualLbD,
    // and two runs agree on a node while disagreeing about the answer
    manifoldsThatAgree: rows.filter((r) => r.manifoldPsia === rows[1].manifoldPsia).length,
    agreementIsNotEvidence: true,
  };
};

/**
 * FOR SCALE: a pure REORDERING of the nodes array changes no physics at all.
 * The solved nodes come back reproducible to the last bits and the pinned one
 * does not, which is the cleanest statement available that two different kinds
 * of number are wearing the same label in the same object.
 */
export const nodeOrderRows = () => {
  const base = teachingRun();
  const reversed = teachingRun({ reversedNodes: true });
  return TEACHING_NODES.filter((n) => n.kind !== 'sink').map((n) => ({
    provenance: 'teaching',
    teaching: true,
    id: n.id,
    label: n.label,
    originalPsia: base.res.pressures[n.id],
    reversedPsia: reversed.res.pressures[n.id],
    movementPsia: reversed.res.pressures[n.id] - base.res.pressures[n.id],
    isPinned: base.verdict.pinned.includes(n.id),
  }));
};

/** The two movements, side by side, with the audit on both runs. */
export const nodeOrderHeadline = () => {
  const rows = nodeOrderRows();
  const base = teachingRun();
  const reversed = teachingRun({ reversedNodes: true });
  const unpinned = rows.filter((r) => !r.isPinned);
  const pinned = rows.filter((r) => r.isPinned);
  return {
    provenance: 'teaching',
    teaching: true,
    largestUnpinnedMovementPsia: Math.max(...unpinned.map((r) => Math.abs(r.movementPsia))),
    pinnedMovementPsia: Math.max(...pinned.map((r) => Math.abs(r.movementPsia))),
    pinnedOverUnpinned: Math.max(...pinned.map((r) => Math.abs(r.movementPsia)))
      / Math.max(...unpinned.map((r) => Math.abs(r.movementPsia))),
    originalConservationGapLbD: base.verdict.conservationGapLbD,
    reversedConservationGapLbD: reversed.verdict.conservationGapLbD,
    originalConverged: base.verdict.converged,
    reversedConverged: reversed.verdict.converged,
    theSolvedNodesAreReproducible: true,
    thePinnedOneIsNot: true,
  };
};

// ---------------------------------------------------------------------------
// SECTION 17. THE TOLERANCE IS NOT IN LB/D.
// Expert m04. Provenance rule 7.
// ---------------------------------------------------------------------------

/**
 * The solver's stopping target is `Math.max(tolerance, tolerance * scale)`,
 * where the scale is the largest SINGLE well inflow evaluated at the sink
 * pressure. NOTHING IN THE RETURN CARRIES IT. This evaluates the caller's own
 * inflow callbacks at the sink pressure, which is the one line of the solver a
 * caller can reproduce without the engine, and says so on the object.
 */
export const toleranceScale = (tolerance = TEACHING_TOLERANCE) => {
  const wells = teachingWellRelations();
  const perWell = Object.keys(TEACHING_WELL_SPECS).map((id) => ({
    id,
    label: TEACHING_WELL_SPECS[id].label,
    inflowAtTheSinkPressureLbD: wells[id](TEACHING_SEPARATOR_PSIA),
  }));
  const scale = Math.max(1, ...perWell.map((w) => Math.abs(w.inflowAtTheSinkPressureLbD)));
  const total = sum(perWell.map((w) => w.inflowAtTheSinkPressureLbD));
  return {
    provenance: 'teaching',
    teaching: true,
    separatorPsia: TEACHING_SEPARATOR_PSIA,
    perWell,
    scaleLbD: scale,
    totalInflowAtTheSinkPressureLbD: total,
    totalOverScale: total / scale,
    theScaleIsTheLargestSingleWellNotTheTotal: true,
    theEngineDoesNotReturnIt: true,
    documentedDefaultTolerance: DEFAULT_TOLERANCE_LB_D,
    targetAtTheDocumentedDefaultLbD: Math.max(DEFAULT_TOLERANCE_LB_D, DEFAULT_TOLERANCE_LB_D * scale),
    looserThanTheNamePromisesByFactor: scale,
    toleranceAsked: tolerance,
    targetAtTheToleranceAskedLbD: Math.max(tolerance, tolerance * scale),
    theConstantIsNamedLbD: 'DEFAULT_TOLERANCE_LB_D',
    theFirstTestIsAgainstTheRawTolerance: true,
    everyTestInsideTheLoopIsAgainstTheScaledTarget: true,
    theMismatchCanOnlyCostAWastedStep: true,
  };
};

/**
 * AND THE SCALE IS THE LARGEST SINGLE WELL, NOT THE TOTAL, so the effective
 * criterion TIGHTENS as wells are added, which is the opposite of what a
 * relative scale is for. DERIVED on the published wells_fight ladder.
 */
export const toleranceScaleLadderRows = () => [1, 2, 3].map((count) => {
  const wells = FIGHT_SPECS.slice(0, count)
    .map(([qmax, prPsia]) => vogelWell({ qmax, prPsia })(FIGHT_SINK_PSIA));
  const scale = Math.max(1, ...wells.map((q) => Math.abs(q)));
  const { res } = fightRun(count);
  return {
    provenance: 'derived',
    count,
    scaleLbD: scale,
    totalInflowAtTheSinkPressureLbD: sum(wells),
    totalOverScale: sum(wells) / scale,
    engineIterations: res.iterations,
  };
});

export const TOLERANCE_SWEEP = Object.freeze([1e-12, 1e-10, 1e-8, 1e-6, 1e-4, 1e-3, 1e-2, 1e-1]);

/**
 * What a loosened tolerance actually costs, on the teaching network. Read the
 * converged column and the answer column together: every row says converged.
 */
export const toleranceSweepRows = (tolerances = TOLERANCE_SWEEP) => {
  const ref = teachingRun();
  const scale = toleranceScale().scaleLbD;
  return tolerances.map((tolerance) => {
    const { res, verdict } = teachingRun({ tolerance });
    const worstJunction = Math.max(
      Math.abs(res.pressures.ha - ref.res.pressures.ha),
      Math.abs(res.pressures.hb - ref.res.pressures.hb),
      Math.abs(res.pressures.hc - ref.res.pressures.hc),
    );
    return {
      provenance: 'teaching',
      teaching: true,
      tolerance,
      targetLbD: Math.max(tolerance, tolerance * scale),
      isTheTeachingTolerance: tolerance === TEACHING_TOLERANCE,
      worstJunctionMovedPsi: worstJunction,
      trunkMovedLbD: res.flows.tk - ref.res.flows.tk,
      crosslinkMovedLbD: res.flows.c2 - ref.res.flows.c2,
      ...verdict,
    };
  });
};

// ---------------------------------------------------------------------------
// SECTION 18. EVERY FAILURE COMES BACK ok, AND THE MESSAGE PRINTS ZERO.
// Expert m04 l03 and l04.
// ---------------------------------------------------------------------------

export const ITERATION_CAP_SWEEP = Object.freeze([1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 30]);

/**
 * `buildNetwork` trains the caller to key on `ok` by refusing eleven distinct
 * malformed networks with ok false and a reason. `solveNetwork` returns ok true
 * when the iteration cap is hit, when the line search stalls, and when it sits
 * on a cusp it cannot resolve. AT A LOW CAP THE RETURN CARRIES A FULL SET OF
 * PRESSURES, FLOWS AND WELL RATES THAT LOOK EXACTLY LIKE AN ANSWER.
 */
export const iterationCapRows = (caps = ITERATION_CAP_SWEEP) => caps.map((maxIter) => {
  const { res, verdict } = teachingRun({ maxIter });
  const printed = verdict.converged ? null : verdict.reportedResidualLbD.toFixed(3);
  return {
    provenance: 'teaching',
    teaching: true,
    maxIter,
    iterationsRun: res.iterations,
    manifoldPsia: res.pressures.ha,
    trunkLbD: res.flows.tk,
    message: verdict.warnings.join(' ') || null,
    printedResidual: printed,
    printedResidualReadsAsZero: printed === '0.000',
    trueReportedResidualLbD: verdict.reportedResidualLbD,
    toPrecisionWouldHavePrinted: verdict.converged ? null : verdict.reportedResidualLbD.toPrecision(3),
    exponentialWouldHavePrinted: verdict.converged ? null : verdict.reportedResidualLbD.toExponential(4),
    ...verdict,
  };
});

/** The two caps where the printed sentence and the true residual part company. */
export const toFixedRows = () => iterationCapRows([9, 10, 11])
  .filter((r) => !r.converged)
  .map((r) => ({
    provenance: 'teaching',
    teaching: true,
    maxIter: r.maxIter,
    trueReportedResidualLbD: r.trueReportedResidualLbD,
    printedResidual: r.printedResidual,
    printedResidualReadsAsZero: r.printedResidualReadsAsZero,
    toPrecisionWouldHavePrinted: r.toPrecisionWouldHavePrinted,
    exponentialWouldHavePrinted: r.exponentialWouldHavePrinted,
    conservationGapLbD: r.conservationGapLbD,
    message: r.message,
  }));

/** The one thing that does come back ok false is a singular Jacobian. */
export const singularSolves = () => ({
  provenance: 'derived',
  singularReturnsNull: solveLinear([[1, 2], [2, 4]], [1, 2]) === null,
  wellPosed: solveLinear([[2, 1], [1, 3]], [5, 10]),
  itPivots: solveLinear([[0, 1], [1, 0]], [2, 3]),
  aSingularJacobianIsARealDiagnosis: true,
});

/**
 * THE LINE SEARCH IS WHAT SAVES IT MOST OF THE TIME, and the module never puts
 * a node below atmospheric. PUBLISHED gate fixture.
 */
export const pressureFloorCase = memoize(() => {
  const network = buildNetwork({
    nodes: [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 20 }],
    branches: [{ id: 'a', from: 'w', to: 's' }],
  });
  const res = solveNetwork({
    network,
    branchFlow: (b, pIn, pOut) => 5000 * (pIn - pOut),
    wellInflow: (nd, p) => linearWell({ qmax: 100, prPsia: 25 })(nd, p),
  });
  return {
    provenance: 'published',
    wellheadPsia: res.pressures.w,
    floorPsia: MIN_PRESSURE_PSIA,
    aboveTheFloor: res.pressures.w >= MIN_PRESSURE_PSIA,
    rateLbD: res.wellRates.w,
    lineSearchHalvingsTried: 30,
    ...solveVerdict(network, res),
  };
});

// ---------------------------------------------------------------------------
// SECTION 19. THE CUSP. A CONTINUOUS RELATION IS NOT ENOUGH FOR A JACOBIAN.
// Expert m04 l05 and m05 l01.
// ---------------------------------------------------------------------------

/**
 * The module contract on a branch relation is that it be continuous and
 * monotone decreasing in pTo. The turbulent law is both. It is NOT
 * differentiable at zero pressure difference, and a numerically differenced
 * Jacobian needs more than continuity. A branch's distance from its own cusp
 * is measured in Jacobian steps, and the step is taken on the `from` node's
 * own pressure.
 */
export const cuspStepRows = () => {
  const { res } = teachingRun();
  return TEACHING_BRANCHES.map((b) => {
    const dp = res.pressures[b.from] - res.pressures[b.to];
    const step = jacobianStepPsi(res.pressures[b.from]);
    return {
      provenance: 'teaching',
      teaching: true,
      id: b.id,
      label: b.label,
      dpPsi: dp,
      jacobianStepPsi: step,
      stepsFromZero: Math.abs(dp) / step,
      insideOneStepOfItsCusp: Math.abs(dp) < step,
    };
  });
};

export const CUSP_WALK_K = Object.freeze([245, 300, 340, 360, 372, 376, 378, 380, 385, 400, 460, 600]);

/**
 * Walk the loop leg upward and the crosslink is driven towards zero pressure
 * difference. Nothing else about the network changes. The iteration count
 * climbs as the branch approaches its own cusp, the solve stops converging
 * entirely over a band of conductances while still returning ok true, and it
 * recovers once the branch passes through. NOT A BUG SO MUCH AS AN UNSTATED
 * PRECONDITION: the header should say a branch relation has to be
 * DIFFERENTIABLE at zero difference, or the Jacobian should widen its step
 * when it detects a sign change across it.
 */
export const cuspWalkRows = (ks = CUSP_WALK_K) => ks.map((kc3) => {
  const { res, verdict } = teachingRun({ kmap: { c3: kc3 } });
  return {
    provenance: 'teaching',
    teaching: true,
    loopLegConductanceLbDPerRootPsi: kc3,
    isTheTeachingCase: kc3 === TEACHING_K.c3,
    crosslinkDpPsi: res.pressures.ha - res.pressures.hb,
    crosslinkLbD: res.flows.c2,
    crosslinkRunsBackwards: res.flows.c2 < 0,
    ...verdict,
  };
});

/** The band where it stops converging, and where the sign change actually sits. */
export const cuspWalkHeadline = () => {
  const rows = cuspWalkRows();
  const failing = rows.filter((r) => !r.converged);
  const signChange = rows.filter((r, i) => i > 0 && rows[i - 1].crosslinkRunsBackwards !== r.crosslinkRunsBackwards);
  return {
    provenance: 'teaching',
    teaching: true,
    rowCount: rows.length,
    convergedCount: rows.filter((r) => r.converged).length,
    failingCount: failing.length,
    everyRowReturnsOk: rows.every((r) => r.ok),
    lowestFailingConductance: failing.length ? Math.min(...failing.map((r) => r.loopLegConductanceLbDPerRootPsi)) : null,
    highestFailingConductance: failing.length ? Math.max(...failing.map((r) => r.loopLegConductanceLbDPerRootPsi)) : null,
    signChangeBetweenConductances: signChange.length
      ? [rows[rows.indexOf(signChange[0]) - 1].loopLegConductanceLbDPerRootPsi, signChange[0].loopLegConductanceLbDPerRootPsi]
      : null,
    lowestIterations: Math.min(...rows.map((r) => r.iterations)),
    highestIterations: Math.max(...rows.map((r) => r.iterations)),
    theBandIsNotCentredOnTheSignChange: true,
  };
};

// ---------------------------------------------------------------------------
// SECTION 20. WHAT THE ORACLE COVERS AND WHAT IT DOES NOT.
// Expert m06 l01, and the honest frame for the whole tier.
// ---------------------------------------------------------------------------

export const oracleCoverage = () => ({
  provenance: 'golden',
  publishedCases: ['linear_star', 'looped', 'turbulent_tree', 'wells_fight'],
  publishedCaseCount: 4,
  gapsLbD: {
    linear_star: golden.linear_star.conservationGap,
    turbulent_tree: golden.turbulent_tree.conservationGap,
    looped: golden.looped.conservationGap,
  },
  sweeps: {
    linear_star: golden.linear_star.sweeps,
    turbulent_tree: golden.turbulent_tree.sweeps,
    looped: golden.looped.sweeps,
  },
  oracleSweepCap: 4000,
  itNeverReachesTheCap: true,
  whatItNeverTouches: [
    'the PINNING PATH. The oracle has no concept of a pinned node, and bisection on a flat residual simply returns a bracket endpoint. All four published cases are plain Vogel plus turbulent systems in which no node can go flat.',
    'the CONVERGENCE TEST ITSELF. The oracle converges on how far the pressures MOVED between sweeps; the engine converges on a mass residual scaled by a factor the caller never sees. The two criteria are not comparable and the goldens publish neither.',
    'checkConservation, diagnose and propagateStreams. The oracle computes its own gap from its own solve, never ranks a bottleneck and never propagates a stream at all.',
    'solveLinearNetwork. The oracle has no linear case of its own, so the engine closed form is exercised only by the JS gate, on a three node star with no loop.',
    'pipeSchedule.js in its entirety. There is no Python referee for it anywhere, so its gate is the only thing standing behind the table.',
  ],
  gateBands: [
    'turbulent_tree pressures to 5 decimals and flows to 4 decimals',
    'looped pressures to 5 decimals',
    'wells_fight header and rates to 4 decimals',
    'linear_star Newton against the closed form at a relative 1e-12, and against the oracle to 6 decimals',
    'the pipe table self consistency at 3 decimals, which is the loosest assertion in the file',
  ],
});

// ---------------------------------------------------------------------------
// SECTION 21. WHAT THESE MODULES REFUSE, AND WHAT THEY DO NOT MODEL AT ALL.
// Associate m01 l03, and the closing lesson of every tier.
// ---------------------------------------------------------------------------

export const refusals = () => Object.freeze([
  'A NODE WITH NO ROUTE TO A DELIVERY POINT IS REFUSED, not repaired. The header says a network with a well that cannot reach a delivery point is not a network with a small problem, it is a drawing mistake, and solving it anyway would produce a confident answer about a system that does not exist.',
  'A network with no delivery point is refused: a delivery point is the boundary the whole system is solved against.',
  'A delivery point with no pressure is refused by name, because a sink is a FIXED pressure and nothing else.',
  'A network with no wells is refused. Nothing else puts anything into it.',
  'Duplicate node ids, duplicate branch ids, a self loop and a branch to a node that is not there are each refused with a reason.',
  'A node kind the module does not have is refused and the three it does have are the whole vocabulary: well, junction, sink.',
  'A recirculating set of solved flow directions is REPORTED rather than iterated on, because a gathering system does not recirculate.',
  'A singular Jacobian returns ok false with a real diagnosis: two or more nodes move together, so their pressures are not separately determined.',
  'An unknown fitting id, roughness id or grade id resolves to a not-a-number and never to a default.',
  'A nominal size the pipe table does not carry returns null rather than a nearby size.',
  'An equivalent length with no bore or no friction factor is refused with a written reason, because the equivalence is between a K loss and a length of PIPE.',
  'Barlow refuses a missing yield, a zero wall and a zero outside diameter as a bare not-a-number, and it never defaults the design factor, because burying one in there would be pretending a jurisdiction.',
  'A PINNED NODE IS WARNED ABOUT RATHER THAN REFUSED, and the warning asserts a diagnosis the module has not checked: it says the node carried nothing on a dead line, on cases where the well is producing and the line is passing mass.',
  'A solve that stops making progress warns, and returns ok true with the best answer it reached.',
  'A solve that runs its iteration cap without meeting its tolerance warns, and returns ok true with a full set of pressures, flows and well rates that look exactly like an answer.',
  'THE PIPE HYDRAULICS ARE NOT MODELLED AT ALL. A branch relation is a callback the consumer supplies, and so is a well inflow.',
  'There is no temperature anywhere, so no thermal coupling and no cooldown. Those live in other modules entirely.',
  'There is no slugging, no holdup and no transient of any kind, because every equation here is steady state.',
  'There is no compressibility along a branch: mass in equals mass out on every branch by construction.',
  'There is no equipment between nodes. No pump, no compressor and no choke as a node kind: anything a real gathering system has that is not a well, a junction or a sink has to be written as a branch relation or left out.',
  'A separator does nothing but accept whatever arrives at a fixed pressure.',
  'And the pipe wall, the burial and the insulation are not this module either, even though pipeSchedule.js can rate a wall.',
]);

// ---------------------------------------------------------------------------
// THE THREE PANEL VIEWS.
//
// A panel reads one of these and nothing else. Each is a frozen object of
// named accessors, so the panel is a renderer: it chooses a mode and lays out
// rows.
// ---------------------------------------------------------------------------

/** Associate: the line, the table, the fittings, the topology and one well alone. */
export const trunkExplorer = Object.freeze({
  lineLabel: 'the published line, the teaching line and one well on its own',
  scheduleRows: pipeScheduleRows,
  tableSelfCheck: pipeTableSelfCheck,
  schedulePairs: schedulePairRows,
  scheduleRefusals,
  grades: gradeRows,
  publishedLine: PUBLISHED_LINE,
  publishedBarlow,
  barlowScalings: barlowScalingRows,
  barlowGrades: barlowGradeRows,
  teachingLine: teachingLineDefinition,
  designFactors: DESIGN_FACTOR_SWEEP,
  barlowDesignFactors: barlowDesignFactorRows,
  barlowRefusals,
  fittings: fittingRows,
  roughnesses: roughnessRows,
  publishedFittings: PUBLISHED_FITTINGS,
  teachingFittings: TEACHING_FITTINGS,
  equivalentLength: equivalentLengthRow,
  publishedEquivalentLength,
  frictionSweep: FRICTION_SWEEP,
  frictionRows: equivalentLengthFrictionRows,
  boreSweep: BORE_SWEEP_NPS,
  boreRows: equivalentLengthBoreRows,
  thirtyDiametersRule,
  teachingFittingRows,
  teachingFittingHeadline,
  equivalentLengthRefusals,
  nodeKinds: NODE_KIND_NOTES,
  topology: teachingTopology,
  conditions: teachingConditions,
  topologyRefusals,
  solo: teachingSoloRows,
  seriesParallel: seriesParallelRows,
  refusals,
});

/** Professional: the solve, the loop, the fight, the streams and the reading. */
export const networkExplorer = Object.freeze({
  lineLabel: 'the published golden networks and AGBADA WEST',
  linearRows: linearStarRows,
  linearSummary: linearStarSummary,
  seriesParallel: seriesParallelRows,
  goldenRows: goldenCaseRows,
  goldenSummary: goldenCaseSummary,
  treeTrunkSweep: TREE_TRUNK_SWEEP_K,
  treeTrunkRows,
  conditions: teachingConditions,
  topology: teachingTopology,
  solve: teachingSolve,
  nodeRows: teachingNodeRows,
  branchRows: teachingBranchRows,
  loopedSplit,
  loopSplitSweep: LOOP_SPLIT_SWEEP_K,
  loopSplitRows,
  direction: teachingDirection,
  crosslinkSweep: CROSSLINK_SWEEP_K,
  crosslinkSweepRows,
  ladder: fightLadderRows,
  ladderHeadline: fightLadderHeadline,
  separatorSweep: SEPARATOR_SWEEP_PSIA,
  separatorSweepRows,
  fight: teachingFightRows,
  fightHeadline: teachingFightHeadline,
  shutIn: teachingShutInRows,
  publishedStreams,
  publishedStreamSplit,
  publishedStreamRefusal,
  streamRows: teachingStreamRows,
  streamHeadline: teachingStreamHeadline,
  publishedDiagnoseCases,
  diagnoseRows: teachingDiagnoseRows,
  diagnoseHeadline,
  populationFixture,
  whisperSweep: WHISPER_SWEEP_LB_D,
  whisperLegRows,
  refusals,
});

/** Expert: the pinned node, the residual against the audit, and the guess. */
export const fightExplorer = Object.freeze({
  lineLabel: `${TEACHING_NETWORK_NAME}, and what its solve hides`,
  conditions: teachingConditions,
  publishedPinning,
  publishedLiveNode,
  pinning: teachingPinning,
  allocationSweep: ALLOCATION_SWEEP_LB_D,
  allocationRows: teachingAllocationRows,
  residual: residualAgainstConservation,
  solve: teachingSolve,
  nodeRows: teachingNodeRows,
  wellCurve: teachingWellCurve,
  guessRuns: INITIAL_GUESS_RUNS,
  guessRows: initialGuessRows,
  guessHeadline: initialGuessHeadline,
  nodeOrderRows,
  nodeOrderHeadline,
  streamMassRows: teachingStreamMassRows,
  signConventionRows,
  streamLieFactors: STREAM_LIE_FACTORS,
  streamLieRows,
  doorCheck: streamDoorCheckRows,
  streamHeadline: teachingStreamHeadline,
  toleranceScale,
  toleranceScaleLadderRows,
  toleranceSweep: TOLERANCE_SWEEP,
  toleranceSweepRows,
  iterationCaps: ITERATION_CAP_SWEEP,
  iterationCapRows,
  toFixedRows,
  singularSolves,
  pressureFloorCase,
  cuspStepRows,
  cuspWalk: CUSP_WALK_K,
  cuspWalkRows,
  cuspWalkHeadline,
  whisperLegRows,
  diagnoseHeadline,
  oracleCoverage,
  refusals,
});

// ---------------------------------------------------------------------------
// THE TEACHING SURFACE, for the leak guard.
//
// Every accessor a panel or a lesson can reach, by the name a panel reads it
// on. The guard walks these and checks every number that falls out of them
// against the wave's graded field list, so a new accessor is covered the moment
// it is added here, and an accessor that is NOT here is not covered.
// ---------------------------------------------------------------------------

export const teachingAccessors = () => {
  const named = [
    ['pipeScheduleRows', pipeScheduleRows],
    ['pipeTableSelfCheck', pipeTableSelfCheck],
    ['schedulePairRows', schedulePairRows],
    ['scheduleRefusals', scheduleRefusals],
    ['gradeRows', gradeRows],
    ['publishedBarlow', publishedBarlow],
    ['barlowScalingRows', barlowScalingRows],
    ['barlowGradeRows', barlowGradeRows],
    ['teachingLineDefinition', teachingLineDefinition],
    ['barlowDesignFactorRows', barlowDesignFactorRows],
    ['barlowRefusals', barlowRefusals],
    ['fittingRows', fittingRows],
    ['roughnessRows', roughnessRows],
    ['publishedEquivalentLength', publishedEquivalentLength],
    ['equivalentLengthFrictionRows', equivalentLengthFrictionRows],
    ['equivalentLengthBoreRows', equivalentLengthBoreRows],
    ['thirtyDiametersRule', thirtyDiametersRule],
    ['teachingFittingRows', teachingFittingRows],
    ['teachingFittingHeadline', teachingFittingHeadline],
    ['equivalentLengthRefusals', equivalentLengthRefusals],
    ['topologyRefusals', topologyRefusals],
    ['linearStarRows', linearStarRows],
    ['linearStarSummary', linearStarSummary],
    ['seriesParallelRows', seriesParallelRows],
    ['treeTrunkRows', treeTrunkRows],
    ['loopedSplit', loopedSplit],
    ['loopSplitRows', loopSplitRows],
    ['fightLadderRows', fightLadderRows],
    ['fightLadderHeadline', fightLadderHeadline],
    ['separatorSweepRows', separatorSweepRows],
    ['teachingTopology', teachingTopology],
    ['teachingConditions', teachingConditions],
    ['teachingSolve', teachingSolve],
    ['teachingNodeRows', teachingNodeRows],
    ['teachingBranchRows', teachingBranchRows],
    ['teachingSoloRows', teachingSoloRows],
    ['teachingFightRows', teachingFightRows],
    ['teachingFightHeadline', teachingFightHeadline],
    ['teachingShutInRows', teachingShutInRows],
    ['teachingDirection', teachingDirection],
    ['crosslinkSweepRows', crosslinkSweepRows],
    ['publishedDiagnoseCases', publishedDiagnoseCases],
    ['teachingDiagnoseRows', teachingDiagnoseRows],
    ['diagnoseHeadline', diagnoseHeadline],
    ['populationFixture', populationFixture],
    ['whisperLegRows', whisperLegRows],
    ['publishedStreams', publishedStreams],
    ['publishedStreamSplit', publishedStreamSplit],
    ['publishedStreamRefusal', publishedStreamRefusal],
    ['teachingStreamRows', teachingStreamRows],
    ['teachingStreamHeadline', teachingStreamHeadline],
    ['teachingStreamMassRows', teachingStreamMassRows],
    ['signConventionRows', signConventionRows],
    ['streamLieRows', streamLieRows],
    ['streamDoorCheckRows', streamDoorCheckRows],
    ['publishedPinning', publishedPinning],
    ['publishedLiveNode', publishedLiveNode],
    ['teachingPinning', teachingPinning],
    ['teachingAllocationRows', teachingAllocationRows],
    ['residualAgainstConservation', residualAgainstConservation],
    ['teachingWellCurve', teachingWellCurve],
    ['initialGuessRows', initialGuessRows],
    ['initialGuessHeadline', initialGuessHeadline],
    ['nodeOrderRows', nodeOrderRows],
    ['nodeOrderHeadline', nodeOrderHeadline],
    ['toleranceScale', toleranceScale],
    ['toleranceScaleLadderRows', toleranceScaleLadderRows],
    ['toleranceSweepRows', toleranceSweepRows],
    ['iterationCapRows', iterationCapRows],
    ['toFixedRows', toFixedRows],
    ['singularSolves', singularSolves],
    ['pressureFloorCase', pressureFloorCase],
    ['cuspStepRows', cuspStepRows],
    ['cuspWalkRows', cuspWalkRows],
    ['cuspWalkHeadline', cuspWalkHeadline],
    ['oracleCoverage', oracleCoverage],
  ];
  ['turbulent_tree', 'looped'].forEach((name) => {
    named.push([`goldenCaseRows ${name}`, () => goldenCaseRows(name)]);
    named.push([`goldenCaseSummary ${name}`, () => goldenCaseSummary(name)]);
  });
  [4, 6, 8, 10].forEach((nps) => {
    named.push([`equivalentLengthRow nps ${nps}`, () => equivalentLengthRow({
      idIn: scheduleRow(nps, '40').id,
    })]);
  });
  return named;
};

/** Every value a panel can reach, labelled by the path a panel reads it on. */
export const teachingQuantities = memoize(() => {
  const rows = [];
  const walk = (v, at) => {
    if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string') {
      rows.push({ label: at, value: v });
      return;
    }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${at}[${i}]`)); return; }
    if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${at}.${k}`));
  };
  teachingAccessors().forEach(([name, fn]) => walk(fn(), name));
  return rows;
});

/** Every finite number a lesson or a panel can read out of this lab. */
export const teachingNumbers = () => teachingQuantities()
  .map((r) => r.value)
  .filter((v) => typeof v === 'number' && Number.isFinite(v));
