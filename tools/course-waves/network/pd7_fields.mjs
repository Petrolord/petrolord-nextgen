// The PD7 capstone (Production Networks), and the eighteen graded fields
// derived from it by running the engine. Nothing here is typed from a lesson,
// a chart or a table: every graded number below is a return value of
// engines/production/networkSolve.js or engines/production/pipeSchedule.js.
//
// Every condition below differs from the ones network_cases.json publishes,
// which is the DR2 rule: design the capstone's conditions BEFORE writing the
// lessons, so the tier can teach on the published case and grade on this one.
// The golden's competing value is named in a trailing comment on every line
// of CAP.
//
// UNITS. Field units throughout: psia for absolute pressure (never psig), psi
// for a pressure DIFFERENCE or a wall rating, ft, in, stb/d for liquid and
// Mscf/d for gas in the stream split. The one unit that is not a familiar
// field unit is the network's own currency, lb/d, and it is not a choice made
// here: the module's header is explicit that "MASS IS THE CURRENCY. Every
// flow in here is a mass rate, lb/d. Surface volumes do not add across
// pressures and mixing two of them is a mistake that hides for a long time."
// Every branch flow and well rate the solver returns is therefore lb/d, and
// grading them in anything else would mean converting the engine's answer by
// hand, which this file does not do anywhere.
//
// ---------------------------------------------------------------------------
// WHY THIS WAVE IS DIFFERENT, AND WHAT THAT MEANT FOR THE TIER SPLIT
//
// Every earlier Production wave graded a closed form or a single march. A
// network is an ITERATIVE SOLVE. Newton with a numerically differenced
// Jacobian, a backtracking line search, an iteration cap, and a convergence
// test. That opens a class of question the other courses cannot ask: what the
// solve converged TO, how you know, what it does when it cannot, and whether
// the answer it hands back on a hard case is the answer or the last iterate.
//
// So the tiers are cut by how much of the machinery the learner has to see:
//
//   ASSOCIATE  the LINE and the WELL ON ITS OWN. A pipe's pressure rating and
//              the equivalent length of its fittings, then one well solved on
//              its own flowline against the separator, with nothing else on
//              the system. This is the layer a single-well studio already
//              gives you, and it is the baseline the other two tiers destroy.
//
//   PROFESSIONAL  THE SOLVE. The whole nine-branch system converged: where
//              every manifold pressure lands, what the trunk carries, and
//              which way each leg of the loop actually runs. Nothing here can
//              be got at one well at a time.
//
//   EXPERT     WHAT THE SOLVE HIDES OR BREAKS. What the competition costs the
//              wells, how a stream splits at a junction that is running
//              backwards, the one answer in the whole capstone that needs no
//              tolerance at all, and the 300 lb/d of production that this
//              network loses while the solver reports converged with a
//              residual of 4e-12.
//
// ---------------------------------------------------------------------------
// THE CONVERGENCE MACHINERY, AND THE TOLERANCE THE FIELDS ARE SET AGAINST
//
// This is the part that has to be stated rather than assumed, because a
// converged value is only reproducible to the solver's own criterion.
//
// The capstone passes tolerance = 1e-12. That is NOT what the solver stops
// at. solveNetwork computes
//
//     scale  = max(1, |wellInflow(w, pSink)| over the wells)
//     target = max(tolerance, tolerance * scale)
//
// and the loop's test is `norm <= target`, where norm is the worst nodal mass
// imbalance in lb/d over the UNPINNED unknown nodes. On this capstone
// scale = 7163.896899... lb/d (OBIAFU-3's Vogel rate evaluated at the
// separator pressure), so the solve actually stops at
//
//     target = 7.1638969e-9 lb/d
//
// and it reaches 3.87e-12 lb/d in nine iterations.
//
// What that leaves in the PRESSURES is smaller again. The branch slope
// dq/dp = k / (2 sqrt(|dp|)) runs from 13.1 lb/d per psi on the satellite
// loop leg to 112.2 on the crosslink at this solution (`branchSlopes` in the
// aux block, arithmetic done in this file from the engine's own printed dp),
// so a nodal diagonal is order 30 to 160 lb/d per psi and 7.2e-9 lb/d of
// residual is about 1e-10 psi.
//
// That reasoning is checked rather than trusted. The measured sweeps are in
// the aux block (`convergenceSensitivity`, `iterationCap`, `perFieldDrift`)
// and they are applied to EVERY solve in the capstone, the two solo wells and
// the linearised twin included. What they show:
//
//   tolerance 1e-12 .. 1e-14   all eighteen identical to the last bit
//   tolerance 1e-11, 1e-9      worst 6.698e-9 in net_crosslink_mass_lbd,
//                              1.4e-5 of that field's own tolerance
//   tolerance 1e-6 (default)   worst 2.227e-5 psi in solo_w1_wellhead_psia,
//                              7.7e-2 of that field's own tolerance
//   maxIter 200 .. 9           all eighteen identical
//   maxIter 8                  converged: false, worst still 1.4e-5 of a tolerance
//
// so every field is gradeable, with two orders of magnitude of headroom even
// at the module's documented default tolerance.
//
// THE ONE PLACE IT BREAKS, AND IT MUST BE SAID. At tolerance 1e-3 the engine
// STILL RETURNS converged: true, after six iterations, with a nodal imbalance
// of 4.83 lb/d, and FIFTEEN of the eighteen fields fall outside their
// tolerance: net_crosslink_mass_lbd is out by 2.5458 lb/d, 5304 times its
// tolerance. At maxIter 6 the same eleven fields go out, though there the
// engine at least reports converged: false. The fields are therefore gradeable
// at any tolerance of 1e-6 or tighter and any iteration cap of 8 or more, and
// a grader must not loosen past that. The capstone states 1e-12 and leaves the
// cap at the module's default 200, so there is a factor of a million and a
// factor of twenty-five of margin respectively.
//
// TOLERANCES ARE THEREFORE SET BY ROUNDING, NOT BY CONVERGENCE, and that is a
// conclusion the sweeps earned rather than an assumption. Each field's
// tolerance is |value| * 5e-7, which admits an honest seven-significant-figure
// rounding of the printed number. The tightest of them is 8.4e-9 on the
// dimensionless gap fraction, and that field moves 7.7e-16 at the module's
// documented default tolerance, eleven million times inside. Had convergence
// been the binding constraint instead, net_crosslink_mass_lbd would have
// needed about 1e-7 rather than 4.8e-4; it was not. The two fields that are
// NOT solve outputs (the pipe rating and the equivalent length) never move at
// all and are held to the same rounding rule for consistency.
//
// WHAT IS NOT GRADEABLE, AND IS NOT GRADED. OBIAFU-19's node is PINNED, and a
// pinned node's pressure is not determined by anything: the solver leaves it
// wherever the last accepted step put it. It moves 2.8e-9 psi under a pure
// reordering of the nodes array and it moves 321 psi under a change of
// initial guess that changes no physics at all (`initialGuessDependence`).
// Neither that pressure nor OBIAFU-19's reported rate is a graded field.
//
// The one quantity that would NOT be gradeable is the pinned node's pressure,
// and it is not graded. See the defect note below.
//
// DETERMINISM. No Math.random anywhere. Two runs produce a byte-identical
// fields.json. The solver's iteration order DOES depend on order: unknownIds
// is built from the `nodes` ARRAY in the order it is written, the Jacobian's
// column order is that same order, and solveLinear pivots on it, so a
// permutation of the nodes array changes the arithmetic in the last bits. The
// aux block prints the measured effect (`nodeOrderPermutation`) and it is
// ~1e-12 psi, far inside every tolerance. Nothing here iterates a plain
// object's keys to drive the solve.
//
// ---------------------------------------------------------------------------
// THE NETWORK: OBIAFU SOUTH, AND WHAT WAS TUNED INTO IT
//
// Five wells, four Vogel inflows and one allocated well, a west manifold, a
// satellite tee cross-linked to it, a trunk tee and a separator at 235 psia.
// Nine branches, eight unknown pressures. Four things were tuned in, and all
// four are verified from the PRINTED values in the aux block rather than
// asserted:
//
//   1. THE WELLS FIGHT, AND THE WEAK ONE LOSES MOST. OBIAFU-3 makes 6873 lb/d
//      on its own flowline and 6161 on the system, down 10.4 per cent.
//      OBIAFU-14, the low-pressure well, makes 1668.8 alone and 729.4 on the
//      system: it loses 56.3 per cent of itself to the other four wells'
//      backpressure. No single-well study can see either number, because every
//      single-well study is run against a wellhead pressure somebody typed in.
//
//   2. THE CROSSLINK RUNS BACKWARDS. L2 is drawn h1 -> m and the solve returns
//      -942.79 lb/d, so it carries 943 lb/d from the satellite tee INTO the
//      west manifold. A learner who takes the drawing's arrow at face value
//      gets the sign and the whole downstream stream split wrong. diagnose()
//      names it as a backflow and the aux block prints the list.
//
//   3. ONE BRANCH SITS NEAR THE CUSP OF ITS OWN RELATION. The turbulent branch
//      law q = k sign(dp) sqrt(|dp|) has an INFINITE slope at dp = 0, and the
//      crosslink is solved at dp = -4.2006 psi, more than twice as close to
//      zero as any other branch on the system (the next closest is
//      OBIAFU-14's flowline at 9.8837 psi, and the trunk is at 469.68). The Jacobian is a central
//      difference with step h = max(1e-3, |p| * 1e-5), about 0.0088 psi here,
//      so the entry the solver uses on that branch is a chord across a square
//      root rather than a derivative. It still converges, in nine iterations
//      where each well on its own takes seven. The aux block walks the
//      satellite loop leg from k = 350 up to k = 457.87368968682915, which is
//      where the crosslink lands on dp = -5.0e-9 psi, and the SAME solver on
//      the SAME network then burns all 200 iterations, returns
//      converged: false with a residual of 0.0538 lb/d, and still returns
//      ok: true. The capstone is deliberately parked one step short of that.
//
//   4. THE SYSTEM LOSES A WELL AND SAYS IT CONVERGED. OBIAFU-19 is allocated
//      1450 lb/d and its flowline is capacity limited at 1150. The solver
//      drives the line to its limit, the node's Jacobian row and column both
//      go flat, the node is PINNED and dropped out of the residual norm, and
//      the solve returns converged: true with residualLbD 3.87e-12 on a
//      network that is 300 lb/d out of balance. This is the centre of the
//      Expert tier. See the defect note.
//
// ---------------------------------------------------------------------------
// WHAT THE ORACLE RECORDS, WHAT IT DOES NOT, AND WHERE THIS CAPSTONE STANDS
//
// tools/validation/production/oracle_network.py is a genuinely independent
// referee: Gauss-Seidel with a bracketed bisection at each node, no Jacobian,
// no linear algebra. It records NO defects. It publishes four cases and
// checks pressures, flows, well rates and its own conservation gap on each.
//
// What it never touches, and therefore what this capstone had to establish for
// itself:
//
//   (a) THE PINNING PATH. The oracle has no concept of a pinned node; bisection
//       on a flat residual simply returns a bracket endpoint. Every one of the
//       oracle's four cases is a plain Vogel-plus-turbulent system in which no
//       node can go flat. EXPOSED HERE AS THE CENTRE OF THE CAPSTONE.
//
//   (b) THE CONVERGENCE TEST ITSELF. The oracle converges on how far the
//       pressures MOVED between sweeps; the engine converges on a mass
//       residual scaled by a factor the caller never sees. The two criteria
//       are not comparable and the goldens do not publish either one. Nor does
//       the oracle have an iteration cap that can be hit: its 4000 sweeps are
//       never reached. EXPOSED HERE IN AUX (`convergenceSensitivity`,
//       `iterationCap`, `cusp`).
//
//   (c) checkConservation, diagnose and propagateStreams. The oracle computes
//       its own conservation gap from its own solve and never calls the
//       engine's. It never ranks a bottleneck and it never propagates a
//       stream at all. All three are graded or printed here.
//
//   (d) solveLinearNetwork. The oracle has no linear case; network_cases.json's
//       linear_star is solved by the same Gauss-Seidel as everything else.
//       The engine's closed form is exercised only by the JS gate, on a
//       three-node star with no loop. EXPOSED HERE as a graded Expert field on
//       the capstone's own seven-unknown looped topology.
//
//   (e) pipeSchedule.js in its entirety. The oracle does not import it and
//       there is no Python referee for it anywhere. GRADED HERE at Associate.
//
// ---------------------------------------------------------------------------
// WHY THE BRANCH AND WELL RELATIONS ARE INJECTED FUNCTIONS
//
// The module's header is explicit that the callbacks are the whole point:
// "THE BRANCH RELATIONS ARE CALLBACKS ... the topology, the Newton solve and
// the conservation laws have nothing to do with petroleum, and can therefore
// be checked EXACTLY." Only linearBranch and linearWell ship inside the
// module, as the reference relations with a closed form. The goldens' oracle
// follows the same discipline: its turbulent branch and its Vogel inflow are
// written in the oracle, not imported. This capstone uses the same two
// labelled relation shapes with its own constants, plus one capacity limit,
// so every graded number below is still a return value of buildNetwork,
// solveNetwork, checkConservation, diagnose, propagateStreams,
// solveLinearNetwork, barlowPressurePsi or equivalentLengthFt.
const R = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const N = await import(`${R}/engines/production/networkSolve.js`);
const P = await import(`${R}/engines/production/pipeSchedule.js`);
import * as fs from 'fs';

export const CAP = {
  // ---- the delivery boundary ---------------------------------------------
  sepPsia: 235,             // golden sinks: 150 (linear_star), 200 (looped), 180 (turbulent_tree, wells_fight)

  // ---- the four Vogel wells ----------------------------------------------
  // qmax is a MASS rate, lb/d, as the module's currency requires.
  w1QmaxLbD: 7300, w1PrPsia: 3250, // golden wells: 4200@2600, 2900@2200, 5100@3000, 6000@2800, 4500@2400, 60000@900, 40000@700
  w2QmaxLbD: 5400, w2PrPsia: 2050, // same list; no golden well is 5400 or sits at 2050
  w3QmaxLbD: 6900, w3PrPsia: 2950, // same list
  w4QmaxLbD: 1850, w4PrPsia: 1180, // same list; the weakest well on the golden's books is 2900@2200

  // ---- the allocated well, OBIAFU-19 -------------------------------------
  // Its inflow is min(allocation, Vogel), which is what a well held to a
  // facility allocation actually delivers, and its flowline cannot pass more
  // than its capacity limit in either direction. No golden case has either.
  w5AllocLbD: 1450,          // golden has no rate-limited well at all
  w5QmaxLbD: 2640, w5PrPsia: 1900, // golden wells as above. 2640 rather than a
                             // rounder 2600 because 2600 appears in the golden
                             // as turbulent_tree w1's RESERVOIR PRESSURE, and
                             // no number in CAP is allowed to match a golden
                             // condition even across quantities.
  w5LineCapLbD: 1150,        // golden has no capacity-limited branch at all

  // ---- the branch conductances, q = k sign(dp) sqrt(|dp|) -----------------
  kF1: 430,  // golden turbulent branches: 140, 95, 160, 260, 410, 150, 130, 300, 180, 220
  kF2: 505,  // same list
  kF3: 390,  // same list
  kF4: 232,  // same list
  kF5: 210,  // same list
  kL1: 980,  // same list  (the direct west bypass)
  kL2: 460,  // same list  (the crosslink, drawn h1 -> m, solved backwards)
  kL3: 350,  // same list  (the satellite loop leg)
  kTr: 815,  // same list  (the trunk; the golden's trunk is 410 and 400)

  // ---- the solve ----------------------------------------------------------
  tolerance: 1e-12,          // the goldens publish no tolerance; the oracle's own is a
                             // pressure-movement tol of 1e-10 on a different criterion
  // NOT a capstone condition, carried in only so the aux block can show what
  // the module's documented default does on this network. No graded field
  // uses it.
  defaultToleranceLbD: N.DEFAULT_TOLERANCE_LB_D, // 1e-6, and it is NOT lb/d: see the defect note
  defaultMaxIter: N.DEFAULT_MAX_ITER,            // 200

  // ---- the trunk line, ANSI B36.10 + API 5L -------------------------------
  trunkNps: 10, trunkSchedule: '40',  // the JS gate's Barlow case is 6.625 od / 0.28 wall
  trunkGrade: 'x60',                  // the JS gate's case is x52
  trunkDesignFactor: 0.6,             // the JS gate's case is 0.72
  trunkFrictionFactor: 0.0143,        // the JS gate's equivalent-length cases are 0.018 and 0.012
  trunkFittings: [                    // the JS gate's count is 4 elbow90LR + 2 gateValve
    { id: 'elbow90LR', count: 5 },
    { id: 'elbow45', count: 3 },
    { id: 'gateValve', count: 2 },
    { id: 'swingCheck', count: 1 },
    { id: 'suddenExit', count: 1 },
  ],

  // ---- the surface split each well is tested at ---------------------------
  // stb/d and Mscf/d. These ride along with the mass; they are not solved for.
  streams: {
    w1: { qoStbd: 1420, qwStbd: 176, qgMscfd: 1135 },
    w2: { qoStbd: 862, qwStbd: 645, qgMscfd: 708 },
    w3: { qoStbd: 1238, qwStbd: 412, qgMscfd: 1476 },
    w4: { qoStbd: 174, qwStbd: 523, qgMscfd: 97 },
    w5: { qoStbd: 306, qwStbd: 58, qgMscfd: 241 },
  },

  // ---- the linearised twin, for the one answer that needs no tolerance ----
  // Same topology, same wells' qmax and pr, but every branch given a LINEAR
  // conductance in lb/d per psi so the whole system collapses to a weighted
  // graph Laplacian with a closed form. lb/d per psi is not the same quantity
  // as the turbulent k above and none of these numbers appears in the golden's
  // linear case either.
  cF1: 31, cF2: 44, cF3: 27, cF4: 19, cF5: 23, // golden linear_star: 80, 120, 400
  cL1: 88, cL2: 36, cL3: 41, cTr: 63,          // same
};

// ---------------------------------------------------------------------------
// HAND CHECK OF CAP AGAINST THE GOLDEN'S CONDITIONS, LINE BY LINE
//
// network_cases.json publishes exactly these as CONDITIONS: the linear
// conductances 80, 120, 400; the linear wells [60000, 900] and [40000, 700];
// the turbulent conductances 150, 130, 300, 180, 220, 140, 95, 160, 260, 410;
// the Vogel wells [6000, 2800], [4500, 2400], [4200, 2600], [2900, 2200],
// [5100, 3000]; the sink pressures 150, 200 and 180; and the well counts 1, 2
// and 3 in wells_fight. Its sweep counts 19, 42 and 48 are outputs, not
// conditions. pipeSchedule.js appears nowhere in it, so its Barlow and
// equivalent-length conditions were checked instead against the only place
// they are exercised, __tests__/production.network.test.js, which uses
// od 6.625, wall 0.28, x52, design factor 0.72, friction factor 0.018 and
// 0.012, and 4 long-radius elbows with 2 gate valves.
//
// Every numeric literal in CAP was compared against that set. Nothing matches
// except the integers 1, 2 and 3, which in CAP are counts of FITTINGS on the
// trunk (one swing check, one exit, two gate valves, three 45 degree elbows)
// and in the golden are counts of WELLS in a case. They are not the same
// quantity and no graded field reads either of them.
//
// ---------------------------------------------------------------------------
// The three relation shapes, written here rather than imported, exactly as the
// goldens' oracle writes its own.
// ---------------------------------------------------------------------------

/** q = k sign(dp) sqrt(|dp|). Pressure drop as the square of rate. */
const turbulent = (k) => (branch, pIn, pOut) => {
  const dp = pIn - pOut;
  return Math.sign(dp) * k * Math.sqrt(Math.abs(dp));
};

/** The same line, but it cannot pass more than `cap` in either direction. */
const turbulentCapped = (k, cap) => (branch, pIn, pOut) => {
  const q = turbulent(k)(branch, pIn, pOut);
  return Math.max(-cap, Math.min(cap, q));
};

/** Vogel: q = qmax (1 - 0.2 x - 0.8 x^2), x = p/pr. Monotone decreasing. */
const vogel = (qmax, pr) => (p) => {
  const x = Math.min(Math.max(p / pr, 0), 1);
  return Math.max(0, qmax * (1 - 0.2 * x - 0.8 * x * x));
};

/** A well held to a facility allocation: it never delivers more than alloc. */
const allocated = (alloc, qmax, pr) => (p) => Math.min(alloc, vogel(qmax, pr)(p));

// ---------------------------------------------------------------------------
// The network
// ---------------------------------------------------------------------------

const NODES = [
  { id: 'w1', kind: 'well', label: 'OBIAFU-3' },
  { id: 'w2', kind: 'well', label: 'OBIAFU-7' },
  { id: 'w3', kind: 'well', label: 'OBIAFU-11' },
  { id: 'w4', kind: 'well', label: 'OBIAFU-14' },
  { id: 'w5', kind: 'well', label: 'OBIAFU-19' },
  { id: 'h1', kind: 'junction', label: 'West manifold' },
  { id: 'm', kind: 'junction', label: 'Satellite tee' },
  { id: 'h2', kind: 'junction', label: 'Trunk tee' },
  { id: 's', kind: 'sink', label: 'Separator', pressurePsia: CAP.sepPsia },
];
const BRANCHES = [
  { id: 'f1', from: 'w1', to: 'h1', label: 'OBIAFU-3 flowline' },
  { id: 'f2', from: 'w2', to: 'h1', label: 'OBIAFU-7 flowline' },
  { id: 'f3', from: 'w3', to: 'm', label: 'OBIAFU-11 flowline' },
  { id: 'f4', from: 'w4', to: 'h1', label: 'OBIAFU-14 flowline' },
  { id: 'f5', from: 'w5', to: 'h1', label: 'OBIAFU-19 flowline' },
  { id: 'L1', from: 'h1', to: 'h2', label: 'West bypass' },
  { id: 'L2', from: 'h1', to: 'm', label: 'Crosslink' },
  { id: 'L3', from: 'm', to: 'h2', label: 'Satellite loop leg' },
  { id: 'tr', from: 'h2', to: 's', label: 'Trunk' },
];
const K = {
  f1: CAP.kF1, f2: CAP.kF2, f3: CAP.kF3, f4: CAP.kF4, f5: CAP.kF5,
  L1: CAP.kL1, L2: CAP.kL2, L3: CAP.kL3, tr: CAP.kTr,
};
const CLIN = {
  f1: CAP.cF1, f2: CAP.cF2, f3: CAP.cF3, f4: CAP.cF4, f5: CAP.cF5,
  L1: CAP.cL1, L2: CAP.cL2, L3: CAP.cL3, tr: CAP.cTr,
};
const WELLS = {
  w1: vogel(CAP.w1QmaxLbD, CAP.w1PrPsia),
  w2: vogel(CAP.w2QmaxLbD, CAP.w2PrPsia),
  w3: vogel(CAP.w3QmaxLbD, CAP.w3PrPsia),
  w4: vogel(CAP.w4QmaxLbD, CAP.w4PrPsia),
  w5: allocated(CAP.w5AllocLbD, CAP.w5QmaxLbD, CAP.w5PrPsia),
};
const SLOPE = {
  w1: { qmax: CAP.w1QmaxLbD, prPsia: CAP.w1PrPsia },
  w2: { qmax: CAP.w2QmaxLbD, prPsia: CAP.w2PrPsia },
  w3: { qmax: CAP.w3QmaxLbD, prPsia: CAP.w3PrPsia },
  w4: { qmax: CAP.w4QmaxLbD, prPsia: CAP.w4PrPsia },
  w5: { qmax: CAP.w5QmaxLbD, prPsia: CAP.w5PrPsia },
};

const branchFlow = (b, pIn, pOut) => (b.id === 'f5'
  ? turbulentCapped(CAP.kF5, CAP.w5LineCapLbD)(b, pIn, pOut)
  : turbulent(K[b.id])(b, pIn, pOut));
const wellInflow = (node, p) => WELLS[node.id](p);

const solveSystem = ({ tolerance = CAP.tolerance, maxIter, initialPressures, nodes = NODES } = {}) => {
  const network = N.buildNetwork({ nodes, branches: BRANCHES });
  const res = N.solveNetwork({
    network, branchFlow, wellInflow, tolerance, initialPressures,
    ...(maxIter === undefined ? {} : { maxIter }),
  });
  return { network, res };
};

/** One well, its own flowline, the trunk, the separator. Nothing else on. */
const soloWell = (id, flowlineId) => {
  const network = N.buildNetwork({
    nodes: [
      { id, kind: 'well', label: id },
      { id: 'h1', kind: 'junction', label: 'West manifold' },
      { id: 's', kind: 'sink', label: 'Separator', pressurePsia: CAP.sepPsia },
    ],
    branches: [
      { id: 'fl', from: id, to: 'h1', label: 'flowline' },
      { id: 'tr', from: 'h1', to: 's', label: 'Trunk' },
    ],
  });
  const kk = { fl: K[flowlineId], tr: CAP.kTr };
  const res = N.solveNetwork({
    network,
    branchFlow: (b, pIn, pOut) => turbulent(kk[b.id])(b, pIn, pOut),
    wellInflow: (node, p) => WELLS[id](p),
    tolerance: CAP.tolerance,
  });
  return { network, res };
};

export function capstoneValues() {
  // --- the line ------------------------------------------------------------
  const row = P.scheduleRow(CAP.trunkNps, CAP.trunkSchedule);
  const maop = P.barlowPressurePsi({
    odIn: row.od, wallIn: row.wall,
    yieldPsi: P.gradeYield(CAP.trunkGrade), designFactor: CAP.trunkDesignFactor,
  });
  const eq = P.equivalentLengthFt({
    fittings: CAP.trunkFittings, idIn: row.id, frictionFactor: CAP.trunkFrictionFactor,
  });

  // --- each well on its own ------------------------------------------------
  const solo = {
    w1: soloWell('w1', 'f1'), w2: soloWell('w2', 'f2'), w3: soloWell('w3', 'f3'),
    w4: soloWell('w4', 'f4'), w5: soloWell('w5', 'f5'),
  };

  // --- the system ----------------------------------------------------------
  const { network, res } = solveSystem();
  const cons = N.checkConservation({
    network, flows: res.flows, wellRates: res.wellRates,
  });
  const diag = N.diagnose({ network, pressures: res.pressures, flows: res.flows });

  // --- the streams ---------------------------------------------------------
  // Mass comes from the solve; the surface split rides along.
  const wellStreams = Object.fromEntries(Object.entries(CAP.streams).map(
    ([id, s]) => [id, { ...s, massLbD: res.wellRates[id] }],
  ));
  const streams = N.propagateStreams({ network, flows: res.flows, wellStreams });

  // --- the linearised twin, solved by matrix inverse, no iteration ---------
  const linNet = N.buildNetwork({ nodes: NODES, branches: BRANCHES });
  const exact = N.solveLinearNetwork({
    network: linNet,
    conductance: (b) => CLIN[b.id],
    wellSlope: (node) => SLOPE[node.id],
  });
  // and the same linear system driven through Newton, aux only, as the
  // module's own strongest claim.
  const linNewton = N.solveNetwork({
    network: linNet,
    branchFlow: (b, pIn, pOut) => N.linearBranch(CLIN[b.id])(b, pIn, pOut),
    wellInflow: (node, p) => N.linearWell(SLOPE[node.id])(node, p),
    tolerance: CAP.tolerance,
  });

  // --- aux: what the convergence machinery does ---------------------------
  // Recompute ALL EIGHTEEN graded fields at a different tolerance or a
  // different iteration cap, applying it to every solve in the capstone (the
  // two solo wells, the system, and the linearised twin), so the sensitivity
  // report covers the whole field set and not just the network half.
  const eighteenAt = ({ tolerance = CAP.tolerance, maxIter } = {}) => {
    const network2 = N.buildNetwork({ nodes: NODES, branches: BRANCHES });
    const r = N.solveNetwork({
      network: network2, branchFlow, wellInflow, tolerance,
      ...(maxIter === undefined ? {} : { maxIter }),
    });
    const c = N.checkConservation({ network: network2, flows: r.flows, wellRates: r.wellRates });
    const ws = Object.fromEntries(Object.entries(CAP.streams).map(
      ([id, sp]) => [id, { ...sp, massLbD: r.wellRates[id] }],
    ));
    const st = N.propagateStreams({ network: network2, flows: r.flows, wellStreams: ws });
    const soloAt = (id, flId) => {
      const nw = N.buildNetwork({
        nodes: [
          { id, kind: 'well', label: id },
          { id: 'h1', kind: 'junction', label: 'West manifold' },
          { id: 's', kind: 'sink', label: 'Separator', pressurePsia: CAP.sepPsia },
        ],
        branches: [
          { id: 'fl', from: id, to: 'h1', label: 'flowline' },
          { id: 'tr', from: 'h1', to: 's', label: 'Trunk' },
        ],
      });
      const kk = { fl: K[flId], tr: CAP.kTr };
      return N.solveNetwork({
        network: nw,
        branchFlow: (b, pIn, pOut) => turbulent(kk[b.id])(b, pIn, pOut),
        wellInflow: (node, pp) => WELLS[id](pp),
        tolerance,
        ...(maxIter === undefined ? {} : { maxIter }),
      });
    };
    const s1 = soloAt('w1', 'f1');
    const s4 = soloAt('w4', 'f4');
    const ex = N.solveLinearNetwork({
      network: network2, conductance: (b) => CLIN[b.id], wellSlope: (node) => SLOPE[node.id],
    });
    return {
      values: {
        trunk_maop_psi: maop,
        trunk_fitting_eq_length_ft: eq.lengthFt,
        solo_w1_wellhead_psia: s1.pressures.w1,
        solo_w1_rate_lbd: s1.wellRates.w1,
        solo_w4_wellhead_psia: s4.pressures.w4,
        solo_w4_rate_lbd: s4.wellRates.w4,
        net_header_h1_psia: r.pressures.h1,
        net_satellite_m_psia: r.pressures.m,
        net_tee_h2_psia: r.pressures.h2,
        net_trunk_mass_lbd: r.flows.tr,
        net_bypass_mass_lbd: r.flows.L1,
        net_crosslink_mass_lbd: r.flows.L2,
        fight_w1_rate_lbd: r.wellRates.w1,
        fight_w4_rate_lbd: r.wellRates.w4,
        stream_bypass_water_stbd: st.ok ? st.branchStreams.L1.qwStbd : NaN,
        exact_linear_h1_psia: ex.pressures.h1,
        hidden_produced_lbd: c.producedLbD,
        hidden_gap_fraction: c.relative,
      },
      res: r,
      soloConverged: { w1: s1.converged, w4: s4.converged },
    };
  };
  const BASE18 = eighteenAt().values;
  const driftAll = (opts) => {
    const g = eighteenAt(opts).values;
    const per = {};
    let worst = { key: null, movedBy: 0, timesItsTolerance: 0 };
    for (const k of Object.keys(BASE18)) {
      const d = Math.abs(g[k] - BASE18[k]);
      per[k] = { movedBy: d, timesItsTolerance: d / TOL[k] };
      if (d / TOL[k] > worst.timesItsTolerance) {
        worst = { key: k, movedBy: d, timesItsTolerance: d / TOL[k] };
      }
    }
    return { worst, per, allInsideTolerance: worst.timesItsTolerance < 1 };
  };

  // scale and target, computed the way solveNetwork computes them.
  const scaleLbD = Math.max(1, ...NODES.filter((x) => x.kind === 'well')
    .map((x) => Math.abs(wellInflow(x, CAP.sepPsia))));

  const tolSweep = [1e-3, 1e-6, 1e-9, 1e-11, 1e-12, 1e-14].map((t) => {
    const d = driftAll({ tolerance: t });
    const r = solveSystem({ tolerance: t }).res;
    return {
      tolerance: t, targetLbD: Math.max(t, t * scaleLbD),
      converged: r.converged, iterations: r.iterations, residualLbD: r.residualLbD,
      warnings: r.warnings.length,
      worstOfTheEighteen: d.worst, allEighteenInsideTolerance: d.allInsideTolerance,
    };
  });
  const iterSweep = [200, 40, 12, 9, 8, 6, 4, 3, 2, 1].map((mi) => {
    const d = driftAll({ maxIter: mi });
    const r = solveSystem({ maxIter: mi }).res;
    return {
      maxIter: mi, ok: r.ok, converged: r.converged, iterations: r.iterations,
      residualLbD: r.residualLbD, warnings: r.warnings,
      worstOfTheEighteen: d.worst, allEighteenInsideTolerance: d.allInsideTolerance,
    };
  });

  // node-order permutation: the same network with the array written backwards
  const permuted = solveSystem({ nodes: [...NODES].reverse() }).res;
  const permDrift = (() => {
    let worst = { id: null, abs: 0 };
    let worstLive = { id: null, abs: 0 };
    for (const id of Object.keys(res.pressures)) {
      const d = Math.abs(permuted.pressures[id] - res.pressures[id]);
      if (d > worst.abs) worst = { id, abs: d };
      if (id !== 'w5' && d > worstLive.abs) worstLive = { id, abs: d };
    }
    return { worstAnyNode: worst, worstUnpinnedNode: worstLive };
  })();

  // initial-guess dependence of the pinned node, and of everything else
  const guessRuns = [undefined, { w5: 600 }, { w5: 2000 }, { w5: 921 }].map((ip) => {
    const r = solveSystem({ initialPressures: ip }).res;
    const c = N.checkConservation({ network, flows: r.flows, wellRates: r.wellRates });
    return {
      initialPressures: ip ?? 'engine default (every unknown at the sink pressure)',
      converged: r.converged, residualLbD: r.residualLbD, pinned: r.pinned,
      pinnedNodePsia: r.pressures.w5, f5MassLbD: r.flows.f5, w5RateLbD: r.wellRates.w5,
      headerPsia: r.pressures.h1, trunkMassLbD: r.flows.tr,
      conservationGapLbD: c.gapLbD, conservationRelative: c.relative,
    };
  });

  // Walk the satellite loop leg's conductance up from the capstone's 350 until
  // the CROSSLINK lands on dp = 0, which is where its own relation has an
  // infinite slope. Nothing else about the network changes. The value
  // 457.87368968682915 was located by bisecting this same walk on the sign of
  // the crosslink's dp; it is written here as a literal so the run is
  // reproducible.
  const cuspWalk = [350, 405, 420, 440, 455, 457.87368968682915, 458, 459.5, 460, 465, 480, 520]
    .map((kL3) => {
      const kk = { ...K, L3: kL3 };
      const net2 = N.buildNetwork({ nodes: NODES, branches: BRANCHES });
      const r = N.solveNetwork({
        network: net2,
        branchFlow: (b, pIn, pOut) => (b.id === 'f5'
          ? turbulentCapped(CAP.kF5, CAP.w5LineCapLbD)(b, pIn, pOut)
          : turbulent(kk[b.id])(b, pIn, pOut)),
        wellInflow, tolerance: CAP.tolerance,
      });
      return {
        kL3, ok: r.ok, converged: r.converged, iterations: r.iterations,
        residualLbD: r.residualLbD,
        crosslinkDpPsi: r.pressures.h1 - r.pressures.m,
        crosslinkMassLbD: r.flows.L2,
        warnings: r.warnings,
      };
    });
  const cuspRes = {
    note: 'the satellite loop leg walked up from the capstone k = 350 until the crosslink sits on dp = 0, where q = k sign(dp) sqrt(|dp|) has an infinite slope',
    capstoneCrosslinkDpPsi: res.pressures.h1 - res.pressures.m,
    walk: cuspWalk,
    atTheCusp: cuspWalk.find((x) => x.kL3 === 457.87368968682915),
  };

  // The slope of every branch relation at the solved point, dq/dp =
  // k / (2 sqrt(|dp|)). ARITHMETIC DONE IN THIS FILE, from the engine's own
  // printed dp and the capstone's own k, purely to size how much pressure a
  // given mass residual is worth. Nothing graded uses it.
  const branchSlopes = Object.fromEntries(BRANCHES.map((b) => {
    const dp = Math.abs(res.pressures[b.from] - res.pressures[b.to]);
    const k = b.id === 'f5' ? CAP.kF5 : K[b.id];
    return [b.id, { dpPsi: dp, slopeLbDPerPsi: dp > 0 ? k / (2 * Math.sqrt(dp)) : Infinity }];
  }));

  // the streams module carries a SECOND mass for every branch, and nothing
  // forces it to agree with the solve's.
  const streamMassCheck = Object.fromEntries(BRANCHES.map((b) => [b.id, {
    solveMassLbD: res.flows[b.id],
    streamMassLbD: streams.branchStreams[b.id]?.massLbD ?? null,
    gapLbD: (streams.branchStreams[b.id]?.massLbD ?? NaN) - res.flows[b.id],
  }]));
  const streamMassLie = (() => {
    const ws = Object.fromEntries(Object.entries(CAP.streams).map(
      ([id, s]) => [id, { ...s, massLbD: res.wellRates[id] * 1.1 }],
    ));
    const s2 = N.propagateStreams({ network, flows: res.flows, wellStreams: ws });
    return {
      note: 'every well stream handed in with a mass 10 per cent too high',
      ok: s2.ok, trunkStreamMassLbD: s2.branchStreams.tr.massLbD,
      trunkSolveMassLbD: res.flows.tr, warningsFromEngine: 'none, the module does not compare them',
    };
  })();

  return {
    // Associate: the line, and the well on its own.
    trunk_maop_psi: maop,
    trunk_fitting_eq_length_ft: eq.lengthFt,
    solo_w1_wellhead_psia: solo.w1.res.pressures.w1,
    solo_w1_rate_lbd: solo.w1.res.wellRates.w1,
    solo_w4_wellhead_psia: solo.w4.res.pressures.w4,
    solo_w4_rate_lbd: solo.w4.res.wellRates.w4,
    // Professional: the solve. Where the system sits and which way it runs.
    net_header_h1_psia: res.pressures.h1,
    net_satellite_m_psia: res.pressures.m,
    net_tee_h2_psia: res.pressures.h2,
    net_trunk_mass_lbd: res.flows.tr,
    net_bypass_mass_lbd: res.flows.L1,
    net_crosslink_mass_lbd: res.flows.L2,
    // Expert: what the solve hides or breaks.
    fight_w1_rate_lbd: res.wellRates.w1,
    fight_w4_rate_lbd: res.wellRates.w4,
    stream_bypass_water_stbd: streams.branchStreams.L1.qwStbd,
    exact_linear_h1_psia: exact.pressures.h1,
    hidden_produced_lbd: cons.producedLbD,
    hidden_gap_fraction: cons.relative,
    _aux: {
      line: {
        scheduleRow: row, gradeYieldPsi: P.gradeYield(CAP.trunkGrade),
        odMinusTwoWallIn: row.od - 2 * row.wall, publishedIdIn: row.id,
        sumK: eq.sumK, lengthFt: eq.lengthFt,
        maopPsi: maop, bareHoopPsi: P.barlowPressurePsi({
          odIn: row.od, wallIn: row.wall, yieldPsi: P.gradeYield(CAP.trunkGrade),
        }),
      },
      solo: Object.fromEntries(Object.entries(solo).map(([id, s]) => [id, {
        converged: s.res.converged, iterations: s.res.iterations,
        residualLbD: s.res.residualLbD, wellheadPsia: s.res.pressures[id],
        manifoldPsia: s.res.pressures.h1, rateLbD: s.res.wellRates[id],
        pinned: s.res.pinned,
      }])),
      fight: Object.fromEntries(['w1', 'w2', 'w3', 'w4', 'w5'].map((id) => [id, {
        soloLbD: solo[id].res.wellRates[id],
        networkLbD: res.wellRates[id],
        lostLbD: solo[id].res.wellRates[id] - res.wellRates[id],
        lostPct: 100 * (1 - res.wellRates[id] / solo[id].res.wellRates[id]),
        soloWellheadPsia: solo[id].res.pressures[id],
        networkWellheadPsia: res.pressures[id],
      }])),
      solve: {
        toleranceAsked: CAP.tolerance,
        scaleLbD,
        targetLbD: Math.max(CAP.tolerance, CAP.tolerance * scaleLbD),
        documentedDefaultToleranceLbD: CAP.defaultToleranceLbD,
        documentedDefaultActualTargetLbD: CAP.defaultToleranceLbD * scaleLbD,
        documentedDefaultLoosenedByFactor: scaleLbD,
        maxIterDefault: CAP.defaultMaxIter,
        branchSlopes,
        converged: res.converged, iterations: res.iterations,
        residualLbD: res.residualLbD, pinned: res.pinned, warnings: res.warnings,
        pressures: res.pressures, flows: res.flows, wellRates: res.wellRates,
        imbalance: res.imbalance,
      },
      conservation: cons,
      conservationGapLbD: cons.gapLbD,
      reportedResidualLbD: res.residualLbD,
      residualBlindnessRatio: cons.gapLbD / res.residualLbD,
      diagnose: {
        bottleneck: diag.bottleneck, biggestDrop: diag.biggestDrop,
        backflows: diag.backflows.map((r) => ({ id: r.id, label: r.label, massLbD: r.massLbD, dpPsi: r.dpPsi })),
        dead: diag.dead.map((r) => r.id),
        rows: diag.rows,
      },
      streams: {
        ok: streams.ok,
        satelliteSplit: {
          crosslinkShare: Math.abs(res.flows.L2) / (Math.abs(res.flows.L2) + Math.abs(res.flows.L3)),
          loopLegShare: Math.abs(res.flows.L3) / (Math.abs(res.flows.L2) + Math.abs(res.flows.L3)),
        },
        bypass: streams.branchStreams.L1,
        trunk: streams.branchStreams.tr,
        atSeparator: streams.nodeStreams.s,
        trunkWaterCutPct: 100 * streams.branchStreams.tr.qwStbd
          / (streams.branchStreams.tr.qoStbd + streams.branchStreams.tr.qwStbd),
        naiveAverageWaterCutPct: Object.values(CAP.streams)
          .reduce((a, s) => a + (100 * s.qwStbd) / (s.qoStbd + s.qwStbd), 0) / 5,
        massConsistency: streamMassCheck,
        massLie: streamMassLie,
      },
      exactLinear: {
        pressures: exact.pressures,
        newtonPressures: linNewton.pressures,
        newtonIterations: linNewton.iterations,
        worstRelativeDifference: Math.max(...Object.keys(exact.pressures)
          .filter((id) => id !== 's')
          .map((id) => Math.abs(linNewton.pressures[id] - exact.pressures[id])
            / Math.abs(exact.pressures[id]))),
      },
      convergenceSensitivity: tolSweep,
      perFieldDrift: {
        note: 'all eighteen graded fields, moved from the capstone (tolerance 1e-12, no cap) to the module documented default tolerance 1e-6 (a target a million times looser), to a tolerance of 1e-3, and to iteration caps of 8 and 6. The tolerance is applied to every solve in the capstone, the two solo wells included.',
        atDocumentedDefaultTolerance: driftAll({ tolerance: CAP.defaultToleranceLbD }).per,
        atTolerance1e3: driftAll({ tolerance: 1e-3 }).per,
        atMaxIter8: driftAll({ maxIter: 8 }).per,
        atMaxIter6: driftAll({ maxIter: 6 }).per,
      },
      iterationCap: iterSweep,
      nodeOrderPermutation: {
        note: 'the same nodes array written in reverse; unknownIds, the Jacobian column order and solveLinear pivoting all follow it',
        worst: permDrift,
        iterations: permuted.iterations, residualLbD: permuted.residualLbD,
      },
      initialGuessDependence: guessRuns,
      cusp: cuspRes,
    },
  };
}

// ---------------------------------------------------------------------------
// Tolerances. Seven significant figures on the printed value, |v| * 5e-7.
// Justified against the SOLVE tolerance rather than assumed: see the header
// and the aux `convergenceSensitivity` block, where the worst movement of any
// of these eighteen values between tolerance 1e-12 and the module's documented
// default 1e-6 is five orders of magnitude smaller than the smallest tolerance
// set here.
// ---------------------------------------------------------------------------
const TOL = {
  trunk_maop_psi: 1.3e-3,
  trunk_fitting_eq_length_ft: 1.8e-4,
  solo_w1_wellhead_psia: 2.9e-4,
  solo_w1_rate_lbd: 3.5e-3,
  solo_w4_wellhead_psia: 1.5e-4,
  solo_w4_rate_lbd: 8.4e-4,
  net_header_h1_psia: 4.4e-4,
  net_satellite_m_psia: 4.5e-4,
  net_tee_h2_psia: 3.6e-4,
  net_trunk_mass_lbd: 8.9e-3,
  net_bypass_mass_lbd: 6.5e-3,
  net_crosslink_mass_lbd: 4.8e-4,
  fight_w1_rate_lbd: 3.1e-3,
  fight_w4_rate_lbd: 3.7e-4,
  stream_bypass_water_stbd: 7.4e-4,
  exact_linear_h1_psia: 3.2e-4,
  hidden_produced_lbd: 9.0e-3,
  hidden_gap_fraction: 8.4e-9,
};
const TIER = {
  trunk_maop_psi: 'beginner',
  trunk_fitting_eq_length_ft: 'beginner',
  solo_w1_wellhead_psia: 'beginner',
  solo_w1_rate_lbd: 'beginner',
  solo_w4_wellhead_psia: 'beginner',
  solo_w4_rate_lbd: 'beginner',
  net_header_h1_psia: 'intermediate',
  net_satellite_m_psia: 'intermediate',
  net_tee_h2_psia: 'intermediate',
  net_trunk_mass_lbd: 'intermediate',
  net_bypass_mass_lbd: 'intermediate',
  net_crosslink_mass_lbd: 'intermediate',
  fight_w1_rate_lbd: 'advanced',
  fight_w4_rate_lbd: 'advanced',
  stream_bypass_water_stbd: 'advanced',
  exact_linear_h1_psia: 'advanced',
  hidden_produced_lbd: 'advanced',
  hidden_gap_fraction: 'advanced',
};
const UNIT = {
  trunk_maop_psi: 'psi',
  trunk_fitting_eq_length_ft: 'ft',
  solo_w1_wellhead_psia: 'psia',
  solo_w1_rate_lbd: 'lb/d',
  solo_w4_wellhead_psia: 'psia',
  solo_w4_rate_lbd: 'lb/d',
  net_header_h1_psia: 'psia',
  net_satellite_m_psia: 'psia',
  net_tee_h2_psia: 'psia',
  net_trunk_mass_lbd: 'lb/d',
  net_bypass_mass_lbd: 'lb/d',
  net_crosslink_mass_lbd: 'lb/d (negative: the crosslink runs backwards)',
  fight_w1_rate_lbd: 'lb/d',
  fight_w4_rate_lbd: 'lb/d',
  stream_bypass_water_stbd: 'stb/d',
  exact_linear_h1_psia: 'psia',
  hidden_produced_lbd: 'lb/d',
  hidden_gap_fraction: 'fraction, dimensionless',
};
export { TOL, TIER, UNIT };

const V = capstoneValues();
const fields = Object.keys(TIER).map((k) => [TIER[k], k, V[k], TOL[k]]);
fs.writeFileSync('/root/pd-wip-network/fields.json', JSON.stringify(fields, null, 1));
for (const [t, k, v, tol] of fields) {
  console.log(`${t.padEnd(13)} ${k.padEnd(28)} ${String(v).padEnd(24)} ${UNIT[k].padEnd(12)} (tol ${tol})`);
}
console.log('\naux:', JSON.stringify(V._aux, null, 1));
