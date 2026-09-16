// PD7 PRODUCTION NETWORKS: THE TEACHING DIGEST.
//
// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES OF network_cases.json, the
// published fixtures of __tests__/production.network.test.js, the published
// tables inside pipeSchedule.js, and ONE clearly labelled TEACHING NETWORK
// this wave designed for itself. THE PD7 CAPSTONE RUNS DIFFERENT CONDITIONS
// ENTIRELY: nothing here imports, reads or reproduces pd7_fields.mjs,
// fields.json, dump.txt, or any capstone node id, label, sink pressure, well
// qmax, reservoir pressure, allocation, line capacity, branch conductance,
// linear conductance, pipe size, schedule, grade, design factor, friction
// factor, fitting count, stream split or tolerance. The teaching digest and
// the capstone are two files with opposite audiences and they never share a
// number.
//
// Usage:  node /root/pd-wip-network/pd7_dump.mjs > /root/pd-wip-network/digest.txt
//
// Engines:  packages/engines/engines/production/networkSolve.js
//           packages/engines/engines/production/pipeSchedule.js
// Goldens:  packages/engines/test-data/production/goldens/network_cases.json
// Oracle:   tools/validation/production/oracle_network.py
// Gate:     packages/engines/__tests__/production.network.test.js

import fs from 'fs';

const ROOT = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const ENG = `${ROOT}/engines/production/`;
const N = await import(`${ENG}networkSolve.js`);
const P = await import(`${ENG}pipeSchedule.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/production/goldens/network_cases.json`, 'utf8'));

const out = [];
const w = (s) => out.push(s);
const f = (x, n = 6) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toFixed(n);
const e = (x, n = 4) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toExponential(n);
const yn = (b) => (b ? 'true' : 'false');
const lst = (a) => (a && a.length ? a.join(', ') : 'none');

// ---------------------------------------------------------------------------
// THE THREE RELATION SHAPES.
//
// Written here rather than imported, exactly as the goldens' oracle and the
// shipped gate both write their own. The module ships only linearBranch and
// linearWell, as the reference relations with a closed form; everything
// petroleum is a callback the consumer supplies, and that is stated in the
// module header as the whole reason the module is in the engine package.
// ---------------------------------------------------------------------------

/** q = k sign(dp) sqrt(|dp|). Pressure drop as the square of rate. */
const turbulent = (k) => (b, pIn, pOut) => {
  const dp = pIn - pOut;
  return Math.sign(dp) * k * Math.sqrt(Math.abs(dp));
};
/** The same line, but it cannot pass more than `cap` in either direction. */
const cappedTurbulent = (k, cap) => (b, pIn, pOut) =>
  Math.max(-cap, Math.min(cap, turbulent(k)(b, pIn, pOut)));
/** Vogel: q = qmax (1 - 0.2 x - 0.8 x^2), x = p/pr. Monotone decreasing. */
const vogel = (qmax, pr) => (p) => {
  const x = Math.min(Math.max(p / pr, 0), 1);
  return Math.max(0, qmax * (1 - 0.2 * x - 0.8 * x * x));
};
/** A well held to a facility allocation: it never delivers more than alloc. */
const allocated = (alloc, qmax, pr) => (p) => Math.min(alloc, vogel(qmax, pr)(p));

// ---------------------------------------------------------------------------
// PUBLISHED FIXTURES: the three golden networks, rebuilt node for node from
// oracle_network.py and the shipped gate.
// ---------------------------------------------------------------------------

const G_STAR = {
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
};
const G_TREE = {
  nodes: [
    { id: 'w1', kind: 'well', label: 'W-1' }, { id: 'w2', kind: 'well', label: 'W-2' },
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
  k: GOLD.turbulent_tree.spec.branches,
  vogel: GOLD.turbulent_tree.spec.wells,
};
const G_LOOP = {
  nodes: [
    { id: 'w1', kind: 'well', label: 'W-1' }, { id: 'w2', kind: 'well', label: 'W-2' },
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
  k: GOLD.looped.spec.branches,
  vogel: GOLD.looped.spec.wells,
};

const buildGolden = (G) => N.buildNetwork({ nodes: G.nodes, branches: G.branches });
const solveGoldenTurbulent = (G, opts = {}) => {
  const net = buildGolden(G);
  const wells = Object.fromEntries(Object.entries(G.vogel)
    .map(([id, [qmax, pr]]) => [id, vogel(qmax, pr)]));
  const res = N.solveNetwork({
    network: net,
    branchFlow: (b, pIn, pOut) => turbulent(G.k[b.id])(b, pIn, pOut),
    wellInflow: (nd, p) => wells[nd.id](p),
    tolerance: 1e-10, ...opts,
  });
  return { net, res };
};

const starNet = buildGolden(G_STAR);
const starNewton = N.solveNetwork({
  network: starNet,
  branchFlow: (b, pIn, pOut) => G_STAR.k[b.id] * (pIn - pOut),
  wellInflow: (nd, p) => N.linearWell(G_STAR.wells[nd.id])(nd, p),
  tolerance: 1e-12,
});
const starExact = N.solveLinearNetwork({
  network: starNet, conductance: (b) => G_STAR.k[b.id], wellSlope: (nd) => G_STAR.wells[nd.id],
});
const tree = solveGoldenTurbulent(G_TREE);
const loop = solveGoldenTurbulent(G_LOOP);

// PUBLISHED. The wells_fight ladder, rebuilt exactly as the gate builds it.
const FIGHT_SPECS = [[4200, 2600, 140], [2900, 2200, 95], [5100, 3000, 160]];
const fightSolve = (count) => {
  const nodes = [
    { id: 'h', kind: 'junction', label: 'Header' },
    { id: 's', kind: 'sink', label: 'Separator', pressurePsia: 180 },
  ];
  const branches = [{ id: 'trunk', from: 'h', to: 's', label: 'Trunk' }];
  const K = { trunk: 410 };
  const wells = {};
  for (let i = 0; i < count; i += 1) {
    const [qmax, pr, k] = FIGHT_SPECS[i];
    nodes.push({ id: `w${i}`, kind: 'well', label: `W-${i}` });
    branches.push({ id: `f${i}`, from: `w${i}`, to: 'h', label: `W-${i} flowline` });
    K[`f${i}`] = k;
    wells[`w${i}`] = vogel(qmax, pr);
  }
  const net = N.buildNetwork({ nodes, branches });
  const res = N.solveNetwork({
    network: net,
    branchFlow: (b, pIn, pOut) => turbulent(K[b.id])(b, pIn, pOut),
    wellInflow: (nd, p) => wells[nd.id](p),
    tolerance: 1e-10,
  });
  return { net, res };
};
const fight = [1, 2, 3].map(fightSolve);

// ---------------------------------------------------------------------------
// THE ONE TEACHING NETWORK: AGBADA WEST.
//
// Invented by this wave so that every Expert result has a case a lesson may
// quote. It is NOT a published case, NOT a real gathering system, and NOT the
// capstone. Four wells, three junctions, one loop, one separator, eight
// branches, seven unknown pressures. Every condition below differs from every
// condition in network_cases.json and from every condition in the capstone.
// ---------------------------------------------------------------------------

const T_SEP_PSIA = 265;
const T_WELLS_SPEC = {
  t1: { label: 'AGBADA-2', qmax: 8100, prPsia: 2750 },
  t2: { label: 'AGBADA-6', qmax: 3300, prPsia: 1650 },
  t3: { label: 'AGBADA-9', qmax: 5750, prPsia: 2350 },
  t4: { label: 'AGBADA-12', qmax: 2100, prPsia: 1450 },
};
const T_ALLOC_LBD = 985;      // AGBADA-12 is held to a facility allocation
const T_LINECAP_LBD = 640;    // and its flowline cannot pass more than this
const T_NODES = [
  { id: 't1', kind: 'well', label: 'AGBADA-2' },
  { id: 't2', kind: 'well', label: 'AGBADA-6' },
  { id: 't3', kind: 'well', label: 'AGBADA-9' },
  { id: 't4', kind: 'well', label: 'AGBADA-12' },
  { id: 'ha', kind: 'junction', label: 'North manifold' },
  { id: 'hb', kind: 'junction', label: 'Loop tee' },
  { id: 'hc', kind: 'junction', label: 'Trunk tee' },
  { id: 'sep', kind: 'sink', label: 'Separator', pressurePsia: T_SEP_PSIA },
];
const T_BRANCHES = [
  { id: 'e1', from: 't1', to: 'ha', label: 'AGBADA-2 flowline' },
  { id: 'e2', from: 't2', to: 'ha', label: 'AGBADA-6 flowline' },
  { id: 'e3', from: 't3', to: 'hb', label: 'AGBADA-9 flowline' },
  { id: 'e4', from: 't4', to: 'ha', label: 'AGBADA-12 flowline' },
  { id: 'c1', from: 'ha', to: 'hc', label: 'North bypass' },
  { id: 'c2', from: 'ha', to: 'hb', label: 'Crosslink' },
  { id: 'c3', from: 'hb', to: 'hc', label: 'Loop leg' },
  { id: 'tk', from: 'hc', to: 'sep', label: 'Trunk' },
];
const T_K = { e1: 275, e2: 365, e3: 198, e4: 126, c1: 690, c2: 540, c3: 245, tk: 720 };
const T_WELLS = {
  t1: vogel(T_WELLS_SPEC.t1.qmax, T_WELLS_SPEC.t1.prPsia),
  t2: vogel(T_WELLS_SPEC.t2.qmax, T_WELLS_SPEC.t2.prPsia),
  t3: vogel(T_WELLS_SPEC.t3.qmax, T_WELLS_SPEC.t3.prPsia),
  t4: allocated(T_ALLOC_LBD, T_WELLS_SPEC.t4.qmax, T_WELLS_SPEC.t4.prPsia),
};
// The per-well surface split each teaching well is tested at. These ride
// along with the mass; they are never solved for.
const T_STREAMS = {
  t1: { qoStbd: 1690, qwStbd: 214, qgMscfd: 1305 },
  t2: { qoStbd: 605, qwStbd: 738, qgMscfd: 542 },
  t3: { qoStbd: 1042, qwStbd: 369, qgMscfd: 1613 },
  t4: { qoStbd: 118, qwStbd: 401, qgMscfd: 76 },
};
const tBranchFlow = (kmap = T_K, cap = T_LINECAP_LBD) => (b, pIn, pOut) => (
  b.id === 'e4' ? cappedTurbulent(kmap.e4, cap)(b, pIn, pOut)
    : turbulent(kmap[b.id])(b, pIn, pOut));
const tWellInflow = (nd, p) => T_WELLS[nd.id](p);

const tSolve = ({ nodes = T_NODES, kmap = T_K, cap = T_LINECAP_LBD,
  tolerance = 1e-12, maxIter, initialPressures } = {}) => {
  const net = N.buildNetwork({ nodes, branches: T_BRANCHES });
  const res = N.solveNetwork({
    network: net, branchFlow: tBranchFlow(kmap, cap), wellInflow: tWellInflow,
    tolerance, maxIter, initialPressures,
  });
  const cons = N.checkConservation({ network: net, flows: res.flows, wellRates: res.wellRates });
  return { net, res, cons };
};
const T = tSolve();
const tDiag = N.diagnose({ network: T.net, pressures: T.res.pressures, flows: T.res.flows });
const tStreams = N.propagateStreams({
  network: T.net,
  flows: T.res.flows,
  wellStreams: Object.fromEntries(Object.entries(T_STREAMS)
    .map(([id, s]) => [id, { ...s, massLbD: T.res.wellRates[id] }])),
});

// Each teaching well solved ON ITS OWN: its flowline, straight to the
// separator, with nothing else on the system. The baseline the network then
// destroys.
const tSolo = Object.fromEntries(['t1', 't2', 't3', 't4'].map((id) => {
  const nodes = [
    { id, kind: 'well', label: T_WELLS_SPEC[id].label },
    { id: 'sep', kind: 'sink', label: 'Separator', pressurePsia: T_SEP_PSIA },
  ];
  const branches = [{ id: 'solo', from: id, to: 'sep', label: `${T_WELLS_SPEC[id].label} flowline` }];
  const kSolo = { e1: 'solo', e2: 'solo', e3: 'solo', e4: 'solo' };
  const kOf = { t1: T_K.e1, t2: T_K.e2, t3: T_K.e3, t4: T_K.e4 }[id];
  const net = N.buildNetwork({ nodes, branches });
  const res = N.solveNetwork({
    network: net,
    branchFlow: (b, pIn, pOut) => (id === 't4'
      ? cappedTurbulent(kOf, T_LINECAP_LBD)(b, pIn, pOut)
      : turbulent(kOf)(b, pIn, pOut)),
    wellInflow: (nd, p) => T_WELLS[nd.id](p),
    tolerance: 1e-12,
  });
  const cons = N.checkConservation({ network: net, flows: res.flows, wellRates: res.wellRates });
  return [id, { net, res, cons, kSolo }];
}));

// ---------------------------------------------------------------------------
// PUBLISHED LINE FIXTURE. The gate's own Barlow and equivalent-length case.
// ---------------------------------------------------------------------------
const PUB_OD = 6.625;
const PUB_WALL = 0.28;
const PUB_GRADE = 'x52';
const PUB_DF = 0.72;
const PUB_ID = 6.065;
const PUB_F1 = 0.018;
const PUB_F2 = 0.012;
const PUB_FITTINGS = [{ id: 'elbow90LR', count: 4 }, { id: 'gateValve', count: 2 }];

// TEACHING LINE. A different bore, a different schedule, a different grade, a
// different design factor, a different friction factor and a different fitting
// count from both the gate's case and the capstone's.
const T_NPS = 8;
const T_SCH = '80';
const T_GRADE = 'x65';
const T_DF = 0.72;
const T_FRICTION = 0.017;
const T_FITTINGS = [
  { id: 'elbow90Std', count: 3 },
  { id: 'teeBranch', count: 2 },
  { id: 'ballValve', count: 4 },
  { id: 'globeValve', count: 1 },
];
const tRow = P.scheduleRow(T_NPS, T_SCH);

// ===========================================================================
w('PD7 PRODUCTION NETWORKS: THE TEACHING DIGEST');
w('');
w('THE ONLY NUMBERS A LESSON MAY QUOTE. Every line names its source: a PUBLISHED');
w('golden value out of packages/engines/test-data/production/goldens/network_cases.json,');
w('a PUBLISHED fixture or table out of the shipped module or its gate, a DERIVED');
w('re-run or sweep on published inputs, or the one TEACHING NETWORK this wave');
w('designed for itself. NOTHING in this file comes from the graded capstone. The');
w('capstone conditions and its eighteen graded answers live in separate files that');
w('the generator of this digest never opens.');
w('');
w('A leak guard, pd7_leakcheck.mjs, reads the capstone graded field list and every');
w('number on every line of this file and rejects the digest if any number lands');
w('within TEN TIMES a graded field tolerance of that field value, in five unit');
w('shiftings: the three the wave standard requires (as printed, times 1000, times');
w('0.001) and two this domain needs (times 100 and times 0.01, because a fraction');
w('against a percentage is the live confusion in a conservation gap).');
w('academy_submit_capstone grades with abs(got - expected) <= tol, so tol is');
w('ABSOLUTE in the field own units and is not a fraction of anything. The guard');
w('lives in its own file and this generator never imports the capstone.');
w('');
w('Generator: /root/pd-wip-network/pd7_dump.mjs');
w('Engines:   packages/engines/engines/production/networkSolve.js');
w('           packages/engines/engines/production/pipeSchedule.js');
w('Goldens:   packages/engines/test-data/production/goldens/network_cases.json');
w('Oracle:    tools/validation/production/oracle_network.py');
w('Gate:      packages/engines/__tests__/production.network.test.js');
w('');
w('UNITS. Mass rate lb/d everywhere, because the module header says so:');
w('"MASS IS THE CURRENCY. Every flow in here is a mass rate, lb/d. Surface');
w('volumes do not add across pressures and mixing two of them is a mistake that');
w('hides for a long time." Absolute pressure psia, never psig. A pressure');
w('DIFFERENCE and a wall rating in psi. Length ft, bore and wall and outside');
w('diameter in, yield psi, oil and water stb/d, gas Mscf/d, conductance for a');
w('turbulent branch in lb/d per root psi, conductance for a linear branch in');
w('lb/d per psi. Those last two are NOT the same quantity and never compare.');
w('');
w('WHAT PROVENANCE LABEL MEANS WHAT');
w('  golden ...    a value committed in network_cases.json by the independent');
w('                stdlib oracle: Gauss-Seidel sweeps with a bracketed bisection');
w('                at each node, no Jacobian and no linear algebra anywhere. The');
w('                engine solves the same networks by Newton with a numerically');
w('                differenced Jacobian and a backtracking line search. The two');
w('                share no numerical machinery at all.');
w('  published ... a fixture or a table shipped inside the engine package: a row');
w('                of PIPE_SCHEDULE, a fitting K, a grade yield, or one of the');
w('                fixtures the gate asserts on.');
w('  derived ...   the shipped engine re-run on PUBLISHED inputs, or a sweep this');
w('                generator ran around them. A sweep point is not a published');
w('                case. Say so if you print one.');
w('  teaching ...  the network AGBADA WEST, its line, its streams, and every');
w('                sweep on it. Invented by this wave to carry the Expert');
w('                results. Not a published case, not a real gathering system,');
w('                and never to be shown as either.');
w('');
w('THE PUBLISHED CASES AT A GLANCE');
w('  linear_star      two linear wells on one header, one linear trunk, separator');
w('                   at 150 psia. The ONLY case with a closed form.');
w('  turbulent_tree   three Vogel wells, two headers in series, turbulent');
w('                   branches, separator at 180 psia. No closed form.');
w('  looped           two Vogel wells, two parallel paths to the separator at');
w('                   200 psia. A loop is what makes a network a network.');
w('  wells_fight      the same header solved with one well, then two, then three,');
w('                   separator at 180 psia.');
w('  the line         the gate Barlow and equivalent-length case: 6.625 in od,');
w('                   0.28 in wall, API 5L X52, design factor 0.72, bore');
w('                   6.065 in, friction factor 0.018 and 0.012, four long');
w('                   radius elbows and two gate valves.');
w('');
w('THE ONE TEACHING NETWORK');
w('  AGBADA WEST   four wells, three junctions, one loop, eight branches, seven');
w('                unknown pressures, a separator at 265 psia. One well is held');
w('                to a facility allocation on a flowline that cannot pass the');
w('                whole of it, which is what makes the pinning, the residual');
w('                blindness, the initial-guess dependence and the stream mass');
w('                gap all reachable on one case a lesson may quote.');
w('');

// ============================================================ SECTION 0
w('# SECTION 0: TWO MODULES, SIX FUNCTIONS, ONE ANSWER');
w('# Associate m01 l04. Everything in this course belongs to exactly one of these,');
w('# and naming which one owns a number is most of what the Associate tier is for.');
w('#   pipeSchedule.js   the LINE. Published tables and two closed forms. Nothing');
w('#                     in it iterates and nothing in it knows there is a network.');
w('#   buildNetwork      the TOPOLOGY. Validates and indexes, and every failure is');
w('#                     a refusal with a reason rather than a repair.');
w('#   solveNetwork      the SOLVE. Newton on the nodal mass balance, with a');
w('#                     numerically differenced Jacobian and a line search.');
w('#   propagateStreams  the SPLIT. Component rates added along the solved flow');
w('#                     directions. Exact, and it never mixes a ratio.');
w('#   checkConservation the AUDIT. What the wells put in against what the');
w('#                     delivery points took out.');
w('#   diagnose          the READING. Bottleneck, biggest drop, backflows, dead');
w('#                     legs.');
w('# ONLY solveNetwork ITERATES. Every defect this course teaches is either in the');
w('# iteration or in something that was never compared against it.');
w(`derived module, node kinds the module accepts = ${N.NODE_KINDS.join(', ')}`);
w(`derived module, MIN_PRESSURE_PSIA = ${N.MIN_PRESSURE_PSIA} psia, the floor no node is allowed below`);
w(`derived module, DEFAULT_TOLERANCE_LB_D = ${N.DEFAULT_TOLERANCE_LB_D}, and its own comment says "Newton stops when the worst nodal imbalance is below this, lb/d"`);
w(`derived module, DEFAULT_MAX_ITER = ${N.DEFAULT_MAX_ITER}`);
w('# SECTION 23 SHOWS THAT THE TOLERANCE CONSTANT IS NOT IN LB/D. Read it before');
w('# quoting the default as a mass.');
w('');

// ============================================================ SECTION 1
w('# SECTION 1: THE PIPE TABLE, AND THE REDUNDANCY THAT IS ITS ONLY SELF CHECK');
w('# Associate m02 l01 and l02. PUBLISHED. Every row carries the outside diameter,');
w('# the wall AND the published bore, even though the third is arithmetically the');
w('# first two, because that redundancy is the check. The module header says a');
w('# transcription error in any one of the three makes od minus two walls equal to');
w('# the bore fail. Run that as written, in double precision, and one row already');
w('# fails. The shipped gate does not use equality: it uses toBeCloseTo at three');
w('# decimals, which passes anything within five ten-thousandths of an inch.');
w(`published pipe table, rows = ${P.PIPE_SCHEDULE.length}`);
for (const r of P.PIPE_SCHEDULE) {
  const derived = r.od - 2 * r.wall;
  w(`published pipe row, NPS ${r.nps} schedule ${r.schedule}: od = ${r.od} in, wall = ${r.wall} in, published bore = ${r.id} in, `
    + `od minus two walls = ${derived} in, residual = ${e(derived - r.id, 4)} in, strict equality holds = ${yn(derived === r.id)}, `
    + `inside the gate band of 5e-4 in = ${yn(Math.abs(derived - r.id) < 5e-4)}`);
}
const worstRow = P.PIPE_SCHEDULE.reduce((best, r) => (
  Math.abs(r.od - 2 * r.wall - r.id) > Math.abs(best.od - 2 * best.wall - best.id) ? r : best));
w(`derived pipe table, rows failing strict equality = ${P.PIPE_SCHEDULE.filter((r) => r.od - 2 * r.wall !== r.id).length} of ${P.PIPE_SCHEDULE.length}`);
w(`derived pipe table, the largest residual is NPS ${worstRow.nps} schedule ${worstRow.schedule} at ${e(worstRow.od - 2 * worstRow.wall - worstRow.id, 4)} in`);
w(`derived pipe table, the gate band is ${e(5e-4, 4)} in and the largest residual is ${e(Math.abs(worstRow.od - 2 * worstRow.wall - worstRow.id), 4)} in, so the band is ${e(5e-4 / Math.abs(worstRow.od - 2 * worstRow.wall - worstRow.id), 4)} times wider than anything the table actually needs`);
w('# THE SIZE OF THE HOLE. A band of five ten-thousandths of an inch admits a real');
w('# transcription error larger than the redundancy exists to catch. A strict check');
w('# at 1e-12 in would be true of every row and nearly nine orders of magnitude');
w('# stricter than what runs today (5e-4 over 1e-12 is 5e+8). Expert m05 owns');
w('# this. There is no Python oracle for pipeSchedule.js');
w('# anywhere, so this gate is the only thing standing behind the table.');
w(`derived pipe table, a bore typed 4 ten-thousandths of an inch wrong on NPS 6 schedule 40: 6.065 in against 6.0654 in, and the gate at three decimals still passes = ${yn(Math.abs(6.065 - 6.0654) < 5e-4)}`);
w(`published pipe table, a size not in the table returns null rather than a nearby one: scheduleRow(5, '40') = ${P.scheduleRow(5, '40')}, scheduleRow(6, '160') = ${P.scheduleRow(6, '160')}`);
w('# A HEAVIER SCHEDULE IS A THICKER WALL AND A SMALLER BORE ON THE SAME OUTSIDE');
w('# DIAMETER, which is the whole idea of a schedule.');
for (const nps of [2, 4, 6, 8]) {
  const a = P.scheduleRow(nps, '40'); const b = P.scheduleRow(nps, '80');
  w(`published schedule pair, NPS ${nps}: od = ${a.od} in on both, wall ${a.wall} against ${b.wall} in, bore ${a.id} against ${b.id} in, `
    + `bore lost = ${f(a.id - b.id, 6)} in, flow area lost = ${f(100 * (1 - (b.id * b.id) / (a.id * a.id)), 6)} percent`);
}
w('');

// ============================================================ SECTION 2
w('# SECTION 2: WHAT A WALL CAN HOLD. BARLOW.');
w('# Associate m02 l03 and l04. PUBLISHED gate case first, then sweeps around it.');
w('# P = 2 S t f / D with D the OUTSIDE diameter. The design factor is an INPUT and');
w('# is never defaulted: the module header says burying one in here would be');
w('# pretending a jurisdiction. Leave it out and you get the bare hoop stress, which');
w('# is not a rating anyone may operate to.');
const pubBase = P.barlowPressurePsi({ odIn: PUB_OD, wallIn: PUB_WALL, yieldPsi: P.gradeYield(PUB_GRADE), designFactor: PUB_DF });
const pubBare = P.barlowPressurePsi({ odIn: PUB_OD, wallIn: PUB_WALL, yieldPsi: P.gradeYield(PUB_GRADE) });
w(`published grades, ${P.LINE_PIPE_GRADES.map((g) => `${g.id} = ${g.yieldPsi} psi`).join(', ')}`);
w(`published grades, an unknown grade id resolves to NaN and never to a default: gradeYield('x55') = ${P.gradeYield('x55')}`);
w(`published barlow, the gate case: od ${PUB_OD} in, wall ${PUB_WALL} in, ${PUB_GRADE} at ${P.gradeYield(PUB_GRADE)} psi, design factor ${PUB_DF}: rating = ${f(pubBase, 6)} psi`);
w(`derived barlow, the same wall with NO design factor: bare hoop = ${f(pubBare, 6)} psi, which is ${f(pubBare / pubBase, 6)} times the rated pressure`);
w(`derived barlow, doubling the wall to ${2 * PUB_WALL} in doubles it: ${f(P.barlowPressurePsi({ odIn: PUB_OD, wallIn: 2 * PUB_WALL, yieldPsi: P.gradeYield(PUB_GRADE), designFactor: PUB_DF }), 6)} psi`);
w(`derived barlow, doubling the outside diameter to ${2 * PUB_OD} in halves it: ${f(P.barlowPressurePsi({ odIn: 2 * PUB_OD, wallIn: PUB_WALL, yieldPsi: P.gradeYield(PUB_GRADE), designFactor: PUB_DF }), 6)} psi`);
w('# DERIVED SWEEP: the same published pipe through every grade the module ships,');
w('# at the gate design factor. Grade is the cheapest lever on a rating and the one');
w('# most often quoted without its design factor.');
for (const g of P.LINE_PIPE_GRADES) {
  w(`derived barlow grade, od ${PUB_OD} in, wall ${PUB_WALL} in, ${g.id} at ${g.yieldPsi} psi, design factor ${PUB_DF}: rating = ${f(P.barlowPressurePsi({ odIn: PUB_OD, wallIn: PUB_WALL, yieldPsi: g.yieldPsi, designFactor: PUB_DF }), 6)} psi`);
}
w('# TEACHING LINE. A heavier schedule in a bigger size and a higher grade, so a');
w('# lesson has a second rating to compare that is not the gate case.');
w(`teaching line, NPS ${T_NPS} schedule ${T_SCH}: od = ${tRow.od} in, wall = ${tRow.wall} in, bore = ${tRow.id} in, grade ${T_GRADE} at ${P.gradeYield(T_GRADE)} psi, design factor ${T_DF}`);
w(`teaching line, rating = ${f(P.barlowPressurePsi({ odIn: tRow.od, wallIn: tRow.wall, yieldPsi: P.gradeYield(T_GRADE), designFactor: T_DF }), 6)} psi`);
w(`teaching line, bare hoop with no design factor = ${f(P.barlowPressurePsi({ odIn: tRow.od, wallIn: tRow.wall, yieldPsi: P.gradeYield(T_GRADE) }), 6)} psi`);
w('# DERIVED SWEEP: the design factor alone, on the teaching line, holding the pipe');
w('# and the grade fixed. This is the whole regulatory content of the number and it');
w('# is the one a reader is most likely to inherit from somebody else.');
for (const df of [0.4, 0.5, 0.72, 0.8, 1.0]) {
  w(`derived barlow design factor, teaching line at design factor ${df}: rating = ${f(P.barlowPressurePsi({ odIn: tRow.od, wallIn: tRow.wall, yieldPsi: P.gradeYield(T_GRADE), designFactor: df }), 6)} psi`);
}
w(`derived barlow refusal, a missing yield returns NaN rather than a number: ${P.barlowPressurePsi({ odIn: 6, wallIn: 0.25 })}`);
w(`derived barlow refusal, a zero wall returns NaN: ${P.barlowPressurePsi({ odIn: 6, wallIn: 0, yieldPsi: 52000, designFactor: 0.72 })}`);
w('');

// ============================================================ SECTION 3
w('# SECTION 3: FITTINGS AS A LENGTH OF PIPE');
w('# Associate m03. PUBLISHED table, then the gate case, then sweeps. The');
w('# equivalence is L_eq = sum(K) * D / f, and the friction factor belongs in it');
w('# because the equivalence is between a K loss and a length of PIPE, and a length');
w('# of pipe only knows what it costs once it knows its own friction factor.');
w('# A FIXED DIAMETERS COUNT IS A FRICTION FACTOR IN DISGUISE. The count is');
w('# sum(K) / f, and sum(K) on this published set is 1.5, so a rule that puts the');
w('# WHOLE set at thirty diameters is assuming f = 0.05. It is NOT assuming 0.02:');
w('# that would put the same set at 75.000000 diameters, and that row is in the');
w("# sweep below, beside the engine's 83.333333 at f 0.018.");
w("# READ THE RULE'S SCOPE BEFORE READING ITS SIGN. Stated the conventional way,");
w('# thirty diameters PER FITTING, six fittings come to 180 diameters and the rule');
w('# OVERSTATES against the engine. Applied once to the whole list, which is what');
w('# the line below does, it gives thirty diameters and UNDERSTATES by nearly three');
w('# times. The bias changes sign with the reading, so anything written on this');
w('# line must say which reading it is using.');
for (const ft of P.FITTINGS) w(`published fitting, ${ft.id}: K = ${ft.k}, ${ft.label}`);
w(`published fitting, an unknown id resolves to NaN and never to a default: fittingK('elbow90') = ${P.fittingK('elbow90')}`);
for (const rg of P.ROUGHNESS_IN) w(`published roughness, ${rg.id}: ${rg.roughnessIn} in, ${rg.label}`);
w(`published roughness, an unknown id resolves to NaN: roughnessOf('nonsense') = ${P.roughnessOf('nonsense')}`);
const pubEq1 = P.equivalentLengthFt({ fittings: PUB_FITTINGS, idIn: PUB_ID, frictionFactor: PUB_F1 });
const pubEq2 = P.equivalentLengthFt({ fittings: PUB_FITTINGS, idIn: PUB_ID, frictionFactor: PUB_F2 });
w(`published equivalent length, the gate case: four elbow90LR and two gateValve on a ${PUB_ID} in bore at friction factor ${PUB_F1}: sum K = ${f(pubEq1.sumK, 6)}, length = ${f(pubEq1.lengthFt, 6)} ft`);
w(`published equivalent length, the SAME fittings on a smoother line at friction factor ${PUB_F2}: length = ${f(pubEq2.lengthFt, 6)} ft, which is ${f(pubEq2.lengthFt / pubEq1.lengthFt, 6)} times as long`);
w('# THE SMOOTHER LINE IS WORTH MORE FEET. A friction factor in the denominator');
w('# means the same fitting count is a LONGER equivalent length on a better pipe,');
w('# which reads backwards until you remember what the equivalence is between.');
w('# DERIVED SWEEP: friction factor alone, on the published fitting count and bore.');
for (const fr of [0.010, 0.014, 0.018, 0.020, 0.025, 0.030]) {
  const r = P.equivalentLengthFt({ fittings: PUB_FITTINGS, idIn: PUB_ID, frictionFactor: fr });
  w(`derived equivalent length, friction factor ${f(fr, 3)}: length = ${f(r.lengthFt, 6)} ft, diameters of pipe = ${f(r.lengthFt / (PUB_ID / 12), 6)}`);
}
w(`derived equivalent length, the thirty-diameters rule on the same bore would give ${f(30 * (PUB_ID / 12) * pubEq1.sumK / 1.5, 6)} ft for this K, against the engine ${f(pubEq1.lengthFt, 6)} ft at friction factor ${PUB_F1}`);
w('# DERIVED SWEEP: bore alone, on the published fitting count and friction factor.');
for (const r of P.PIPE_SCHEDULE.filter((x) => x.schedule === '40')) {
  const q = P.equivalentLengthFt({ fittings: PUB_FITTINGS, idIn: r.id, frictionFactor: PUB_F1 });
  w(`derived equivalent length by bore, NPS ${r.nps} schedule 40 bore ${r.id} in at friction factor ${PUB_F1}: length = ${f(q.lengthFt, 6)} ft`);
}
const tEq = P.equivalentLengthFt({ fittings: T_FITTINGS, idIn: tRow.id, frictionFactor: T_FRICTION });
w(`teaching line fittings, three elbow90Std, two teeBranch, four ballValve and one globeValve on a ${tRow.id} in bore at friction factor ${T_FRICTION}: sum K = ${f(tEq.sumK, 6)}, length = ${f(tEq.lengthFt, 6)} ft`);
for (const ft of T_FITTINGS) {
  w(`teaching line fittings, ${ft.id} x ${ft.count} contributes K = ${f(P.fittingK(ft.id) * ft.count, 6)}, which is ${f((100 * P.fittingK(ft.id) * ft.count) / tEq.sumK, 6)} percent of the total, and ${f(((P.fittingK(ft.id) * ft.count) * (tRow.id / 12)) / T_FRICTION, 6)} ft`);
}
w('# ONE GLOBE VALVE IS WORTH MORE THAN EVERYTHING ELSE ON THAT LIST PUT TOGETHER,');
w('# which is the reason a fitting count is never a detail.');
w(`derived equivalent length refusal, an unknown fitting: ok = ${P.equivalentLengthFt({ fittings: [{ id: 'reducer' }], idIn: 6, frictionFactor: 0.02 }).ok}, message: ${P.equivalentLengthFt({ fittings: [{ id: 'reducer' }], idIn: 6, frictionFactor: 0.02 }).error}`);
w(`derived equivalent length refusal, no bore and no friction factor: message: ${P.equivalentLengthFt({ fittings: PUB_FITTINGS }).error}`);
w('');

// ============================================================ SECTION 4
w('# SECTION 4: WHAT buildNetwork REFUSES, AND WHY EACH REFUSAL IS A REFUSAL');
w('# Associate m01 l03 and m04. PUBLISHED fixtures out of the gate. Every failure');
w('# here is a REFUSAL with a reason, never a repair: the module header says a');
w('# network with a well that cannot reach a delivery point is not a network with a');
w('# small problem, it is a drawing mistake, and solving it anyway would produce a');
w('# confident answer about a system that does not exist.');
const sinkFix = { id: 's', kind: 'sink', label: 'Separator', pressurePsia: 100 };
const wellFix = { id: 'w', kind: 'well', label: 'W-1' };
const refusals = [
  ['a node with no route to a delivery point', N.buildNetwork({ nodes: [wellFix, sinkFix, { id: 'orphan', kind: 'junction', label: 'Manifold B' }], branches: [{ id: 'a', from: 'w', to: 's' }] })],
  ['no delivery point at all', N.buildNetwork({ nodes: [wellFix], branches: [] })],
  ['a delivery point with no pressure', N.buildNetwork({ nodes: [wellFix, { id: 's', kind: 'sink', label: 'Sep' }], branches: [{ id: 'a', from: 'w', to: 's' }] })],
  ['no wells at all', N.buildNetwork({ nodes: [sinkFix, { id: 'j', kind: 'junction' }], branches: [] })],
  ['two nodes sharing an id', N.buildNetwork({ nodes: [wellFix, wellFix, sinkFix], branches: [] })],
  ['a branch that starts and ends at the same node', N.buildNetwork({ nodes: [wellFix, sinkFix], branches: [{ id: 'a', from: 'w', to: 'w' }] })],
  ['a branch to a node that is not there', N.buildNetwork({ nodes: [wellFix, sinkFix], branches: [{ id: 'a', from: 'w', to: 'ghost' }] })],
  ['a node kind the module does not have', N.buildNetwork({ nodes: [wellFix, sinkFix, { id: 'x', kind: 'compressor', label: 'K-1' }], branches: [{ id: 'a', from: 'w', to: 's' }] })],
  ['a node with no id', N.buildNetwork({ nodes: [{ kind: 'well' }, sinkFix], branches: [] })],
  ['a branch with no id', N.buildNetwork({ nodes: [wellFix, sinkFix], branches: [{ from: 'w', to: 's' }] })],
  ['no nodes at all', N.buildNetwork({ nodes: [], branches: [] })],
];
refusals.forEach(([what, r], i) => {
  w(`published refusal ${i + 1}, ${what}: ok = ${yn(r.ok)}, message: ${r.error}`);
});
w('# AND WHAT IT ACCEPTS. A valid network is indexed rather than copied, and the');
w('# index is what every later function reads.');
w(`teaching topology, AGBADA WEST: ok = ${yn(T.net.ok)}, nodes = ${T.net.nodes.length}, branches = ${T.net.branches.length}, unknown pressures = ${T.net.unknownIds.length}, delivery points = ${T.net.sinkIds.length}`);
w(`teaching topology, the unknowns in the order the solver will index them: ${T.net.unknownIds.join(', ')}`);
for (const nd of T_NODES) {
  const deg = T.net.adjacency.get(nd.id).length;
  w(`teaching topology, node ${nd.id} (${nd.label}) is a ${nd.kind} with ${deg} branch${deg === 1 ? '' : 'es'} on it`);
}
w('');

// ============================================================ SECTION 5
w('# SECTION 5: THE ONE CASE WITH A CLOSED FORM');
w('# Professional m01 l01, and Expert m03 l01. PUBLISHED golden linear_star. Give');
w('# the solver LINEAR branch resistances and the whole network collapses to a');
w('# weighted graph Laplacian, whose solution is a matrix inverse. Newton iteration');
w('# and Gaussian elimination share no code and no reasoning, so their agreeing to');
w('# machine precision says the assembly, the signs and the boundary handling are');
w('# all right. This is the ONLY branch relation against which the solver can be');
w('# checked with no tolerance at all.');
w(`golden linear_star, conditions: linear conductances b1 = ${G_STAR.k.b1}, b2 = ${G_STAR.k.b2}, b3 = ${G_STAR.k.b3} lb/d per psi, linear wells w1 = ${G_STAR.wells.w1.qmax} lb/d at ${G_STAR.wells.w1.prPsia} psia and w2 = ${G_STAR.wells.w2.qmax} lb/d at ${G_STAR.wells.w2.prPsia} psia, separator at 150 psia`);
for (const id of Object.keys(GOLD.linear_star.pressures)) {
  w(`golden linear_star, pressure ${id} = ${f(GOLD.linear_star.pressures[id], 9)} psia`);
}
for (const id of Object.keys(GOLD.linear_star.flows)) {
  w(`golden linear_star, flow ${id} = ${f(GOLD.linear_star.flows[id], 9)} lb/d`);
}
w(`golden linear_star, produced = ${f(GOLD.linear_star.producedLbD, 9)} lb/d, delivered = ${f(GOLD.linear_star.deliveredLbD, 9)} lb/d, oracle conservation gap = ${e(GOLD.linear_star.conservationGap, 6)} lb/d, oracle sweeps = ${GOLD.linear_star.sweeps}`);
for (const id of Object.keys(starExact.pressures)) {
  w(`derived linear_star, closed form solveLinearNetwork pressure ${id} = ${f(starExact.pressures[id], 9)} psia`);
  w(`derived linear_star, Newton solveNetwork pressure ${id} = ${f(starNewton.pressures[id] ?? starExact.pressures[id], 9)} psia, difference from the closed form = ${e((starNewton.pressures[id] ?? starExact.pressures[id]) - starExact.pressures[id], 4)} psia, relative = ${e(Math.abs(((starNewton.pressures[id] ?? starExact.pressures[id]) - starExact.pressures[id]) / starExact.pressures[id]), 4)}`);
  w(`derived linear_star, Newton against the bisection ORACLE at ${id}: difference = ${e((starNewton.pressures[id] ?? 0) - GOLD.linear_star.pressures[id], 4)} psia`);
}
w(`derived linear_star, Newton converged = ${yn(starNewton.converged)} in ${starNewton.iterations} iteration${starNewton.iterations === 1 ? '' : 's'}, reported residual = ${e(starNewton.residualLbD, 4)} lb/d, pinned = ${lst(starNewton.pinned)}, warnings = ${lst(starNewton.warnings)}`);
w('# NEWTON IS EXACT ON A LINEAR SYSTEM, so needing many steps here would mean the');
w('# Jacobian is wrong rather than that the problem is hard. The gate asserts three');
w('# iterations or fewer for exactly that reason.');
const starCons = N.checkConservation({ network: starNet, flows: starNewton.flows, wellRates: starNewton.wellRates });
w(`derived linear_star, checkConservation: produced = ${f(starCons.producedLbD, 9)} lb/d, delivered = ${f(starCons.deliveredLbD, 9)} lb/d, gap = ${e(starCons.gapLbD, 6)} lb/d, relative = ${e(starCons.relative, 6)}`);
for (const id of starNet.unknownIds) w(`derived linear_star, nodal imbalance at ${id} = ${e(starNewton.imbalance[id], 6)} lb/d`);
w('# THE TOPOLOGY REDUCES THE WAY A NETWORK MUST. PUBLISHED gate fixtures: two');
w('# linear resistances in series behave as one by the reciprocal rule, and two in');
w('# parallel behave as their sum. These are the two facts a reader already has');
w('# from a circuit, and they hold here because a linear branch is a resistor.');
const runLin = (nodes, branches, K) => N.solveNetwork({
  network: N.buildNetwork({ nodes, branches }),
  branchFlow: (b, pIn, pOut) => K[b.id] * (pIn - pOut),
  wellInflow: () => 10000, tolerance: 1e-12,
});
const seriesTwo = runLin(
  [{ id: 'w', kind: 'well' }, { id: 'm', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
  [{ id: 'a', from: 'w', to: 'm' }, { id: 'b', from: 'm', to: 's' }], { a: 200, b: 300 });
const kSeries = 1 / (1 / 200 + 1 / 300);
const seriesOne = runLin(
  [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
  [{ id: 'a', from: 'w', to: 's' }], { a: kSeries });
w(`published series, two linear branches of 200 and 300 lb/d per psi in series: wellhead = ${f(seriesTwo.pressures.w, 9)} psia`);
w(`published series, the single equivalent branch by the reciprocal rule = ${f(kSeries, 9)} lb/d per psi: wellhead = ${f(seriesOne.pressures.w, 9)} psia, difference = ${e(seriesTwo.pressures.w - seriesOne.pressures.w, 4)} psia`);
const parTwo = runLin(
  [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
  [{ id: 'a', from: 'w', to: 's' }, { id: 'b', from: 'w', to: 's' }], { a: 200, b: 300 });
const parOne = runLin(
  [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
  [{ id: 'a', from: 'w', to: 's' }], { a: 500 });
w(`published parallel, two linear branches of 200 and 300 lb/d per psi in parallel: wellhead = ${f(parTwo.pressures.w, 9)} psia`);
w(`published parallel, the single equivalent branch of 500 lb/d per psi: wellhead = ${f(parOne.pressures.w, 9)} psia, difference = ${e(parTwo.pressures.w - parOne.pressures.w, 4)} psia`);
w('# NEITHER RULE SURVIVES A TURBULENT BRANCH. Section 6 is where the closed form');
w('# runs out and everything after it is an iterate.');
w('');

// ============================================================ SECTION 6
w('# SECTION 6: A TREE OF TURBULENT BRANCHES AND VOGEL INFLOWS');
w('# Professional m01 l02 and m02. PUBLISHED golden turbulent_tree. Nothing here');
w('# has a closed form. The engine solves it by Newton; the oracle solved it by');
w('# sweeping node by node and bisecting each node own mass balance, with no');
w('# Jacobian and no linear algebra at all. Two methods with nothing in common');
w('# landing on the same pressures is evidence about the PHYSICS rather than about');
w('# the code.');
w(`golden turbulent_tree, conditions: turbulent conductances ${Object.entries(G_TREE.k).map(([k, v]) => `${k} = ${v}`).join(', ')} lb/d per root psi, Vogel wells ${Object.entries(G_TREE.vogel).map(([k, v]) => `${k} = ${v[0]} lb/d at ${v[1]} psia`).join(', ')}, separator at 180 psia`);
for (const id of Object.keys(GOLD.turbulent_tree.pressures)) {
  const engine = tree.res.pressures[id];
  w(`golden turbulent_tree, pressure ${id} = ${f(GOLD.turbulent_tree.pressures[id], 9)} psia`);
  w(`derived turbulent_tree, engine pressure ${id} = ${f(engine, 9)} psia, difference from the oracle = ${e(engine - GOLD.turbulent_tree.pressures[id], 4)} psia`);
}
for (const id of Object.keys(GOLD.turbulent_tree.flows)) {
  w(`golden turbulent_tree, flow ${id} = ${f(GOLD.turbulent_tree.flows[id], 9)} lb/d`);
  w(`derived turbulent_tree, engine flow ${id} = ${f(tree.res.flows[id], 9)} lb/d, difference from the oracle = ${e(tree.res.flows[id] - GOLD.turbulent_tree.flows[id], 4)} lb/d`);
}
for (const id of Object.keys(GOLD.turbulent_tree.wellRates)) {
  w(`golden turbulent_tree, well rate ${id} = ${f(GOLD.turbulent_tree.wellRates[id], 9)} lb/d`);
  w(`derived turbulent_tree, engine well rate ${id} = ${f(tree.res.wellRates[id], 9)} lb/d, difference from the oracle = ${e(tree.res.wellRates[id] - GOLD.turbulent_tree.wellRates[id], 4)} lb/d`);
}
const treeCons = N.checkConservation({ network: tree.net, flows: tree.res.flows, wellRates: tree.res.wellRates });
w(`derived turbulent_tree, engine converged = ${yn(tree.res.converged)} in ${tree.res.iterations} iterations, reported residual = ${e(tree.res.residualLbD, 4)} lb/d, pinned = ${lst(tree.res.pinned)}`);
w(`derived turbulent_tree, checkConservation: produced = ${f(treeCons.producedLbD, 9)} lb/d, delivered = ${f(treeCons.deliveredLbD, 9)} lb/d, gap = ${e(treeCons.gapLbD, 6)} lb/d, relative = ${e(treeCons.relative, 6)}`);
w(`golden turbulent_tree, oracle sweeps = ${GOLD.turbulent_tree.sweeps}, engine Newton iterations = ${tree.res.iterations}`);
w('# THE ORACLE TOOK DOZENS OF SWEEPS AND THE ENGINE TOOK A HANDFUL OF STEPS. That');
w('# is the whole argument for a Jacobian, and Section 25 is what it costs.');
w('');

// ============================================================ SECTION 7
w('# SECTION 7: A LOOP IS WHAT MAKES A NETWORK A NETWORK');
w('# Professional m02 l03. PUBLISHED golden looped. Two parallel paths from the');
w('# header to the separator. A solver that quietly assumed a tree falls over here,');
w('# because in a tree every branch flow is fixed by the flows downstream of it and');
w('# in a loop it is not: the split between the two paths is decided by the');
w('# pressures, and the pressures are decided by the split.');
w(`golden looped, conditions: turbulent conductances ${Object.entries(G_LOOP.k).map(([k, v]) => `${k} = ${v}`).join(', ')} lb/d per root psi, Vogel wells ${Object.entries(G_LOOP.vogel).map(([k, v]) => `${k} = ${v[0]} lb/d at ${v[1]} psia`).join(', ')}, separator at 200 psia`);
for (const id of Object.keys(GOLD.looped.pressures)) {
  w(`golden looped, pressure ${id} = ${f(GOLD.looped.pressures[id], 9)} psia`);
  w(`derived looped, engine pressure ${id} = ${f(loop.res.pressures[id], 9)} psia, difference from the oracle = ${e(loop.res.pressures[id] - GOLD.looped.pressures[id], 4)} psia`);
}
for (const id of Object.keys(GOLD.looped.flows)) {
  w(`golden looped, flow ${id} = ${f(GOLD.looped.flows[id], 9)} lb/d`);
  w(`derived looped, engine flow ${id} = ${f(loop.res.flows[id], 9)} lb/d, difference from the oracle = ${e(loop.res.flows[id] - GOLD.looped.flows[id], 4)} lb/d`);
}
const loopTotal = loop.res.flows.b4 + loop.res.flows.b5;
w(`derived looped, the direct leg b4 carries ${f(100 * loop.res.flows.b4 / loopTotal, 6)} percent of what reaches the separator and the midpoint leg b5 carries ${f(100 * loop.res.flows.b5 / loopTotal, 6)} percent`);
w(`derived looped, both parallel paths carry something and neither is dead: b4 = ${f(loop.res.flows.b4, 6)} lb/d, b5 = ${f(loop.res.flows.b5, 6)} lb/d`);
w(`derived looped, engine converged = ${yn(loop.res.converged)} in ${loop.res.iterations} iterations, reported residual = ${e(loop.res.residualLbD, 4)} lb/d, oracle sweeps = ${GOLD.looped.sweeps}`);
w('# DERIVED SWEEP: walk the midpoint leg conductance and watch the split move. The');
w('# two legs are not two independent pipes, they are one decision the solve makes.');
for (const kb5 of [60, 100, 220, 340, 500, 800]) {
  const r = N.solveNetwork({
    network: loop.net,
    branchFlow: (b, pIn, pOut) => turbulent(b.id === 'b5' ? kb5 : G_LOOP.k[b.id])(b, pIn, pOut),
    wellInflow: (nd, p) => vogel(...G_LOOP.vogel[nd.id])(p),
    tolerance: 1e-10,
  });
  const tot = r.flows.b4 + r.flows.b5;
  w(`derived loop split, midpoint leg conductance ${kb5} lb/d per root psi: header = ${f(r.pressures.h, 6)} psia, midpoint = ${f(r.pressures.m, 6)} psia, direct leg = ${f(r.flows.b4, 6)} lb/d, midpoint leg = ${f(r.flows.b5, 6)} lb/d, midpoint share = ${f(100 * r.flows.b5 / tot, 6)} percent, total delivered = ${f(tot, 6)} lb/d`);
}
w('');

// ============================================================ SECTION 8
w('# SECTION 8: THE RESULT THE WHOLE STUDIO EXISTS FOR. WELLS FIGHT.');
w('# Professional m03. PUBLISHED golden wells_fight, and the engine re-run on the');
w('# same ladder. Solve one header with one well, then two, then three. The header');
w('# climbs as more is pushed through the same trunk, and every well already on it');
w('# makes strictly less. Nothing about this is subtle once it is written down, and');
w('# that is the point: it is invisible to any amount of single-well analysis,');
w('# because every single-well study is run against a wellhead pressure somebody');
w('# typed in.');
GOLD.wells_fight.forEach((row, i) => {
  const r = fight[i].res;
  w(`golden wells_fight, ${row.count} well${row.count === 1 ? '' : 's'} on the header: header = ${f(row.headerPsia, 9)} psia`);
  w(`derived wells_fight, ${row.count} well${row.count === 1 ? '' : 's'}: engine header = ${f(r.pressures.h, 9)} psia, difference from the oracle = ${e(r.pressures.h - row.headerPsia, 4)} psia, iterations = ${r.iterations}, converged = ${yn(r.converged)}`);
  for (const [id, q] of Object.entries(row.wellRates)) {
    w(`golden wells_fight, ${row.count} well case, ${id} rate = ${f(q, 9)} lb/d`);
    w(`derived wells_fight, ${row.count} well case, engine ${id} rate = ${f(r.wellRates[id], 9)} lb/d, difference from the oracle = ${e(r.wellRates[id] - q, 4)} lb/d, wellhead = ${f(r.pressures[id], 9)} psia`);
  }
});
const f1 = GOLD.wells_fight[0]; const f3 = GOLD.wells_fight[2];
w(`golden wells_fight, W-0 makes ${f(f1.wellRates.w0, 9)} lb/d on its own header and ${f(f3.wellRates.w0, 9)} lb/d sharing it with two others`);
w(`derived wells_fight, W-0 loses ${f(f1.wellRates.w0 - f3.wellRates.w0, 6)} lb/d to the other two wells, which is ${f(100 * (1 - f3.wellRates.w0 / f1.wellRates.w0), 6)} percent of itself`);
w(`derived wells_fight, W-1 makes ${f(GOLD.wells_fight[1].wellRates.w1, 9)} lb/d with one companion and ${f(f3.wellRates.w1, 9)} lb/d with two, a loss of ${f(100 * (1 - f3.wellRates.w1 / GOLD.wells_fight[1].wellRates.w1), 6)} percent`);
w(`derived wells_fight, the header rose from ${f(f1.headerPsia, 6)} psia to ${f(f3.headerPsia, 6)} psia across the ladder, which is ${f(f3.headerPsia - f1.headerPsia, 6)} psi`);
const f3Total = Object.values(f3.wellRates).reduce((a, b) => a + b, 0);
const w1OneCompanion = GOLD.wells_fight[1].wellRates.w1;
const notASoloSum = w1OneCompanion + f3.wellRates.w2;
w(`derived wells_fight, total delivered rose from ${f(f1.wellRates.w0, 6)} lb/d to ${f(f3Total, 6)} lb/d, so adding two wells bought ${f(f3Total - f1.wellRates.w0, 6)} lb/d`);
w('# THE FIGURE BELOW IS NOT A SOLO SUM AND AN EARLIER VERSION OF THIS LINE CALLED');
w('# IT ONE. W-1 and W-2 are never solved ALONE anywhere in this wave, so no solo');
w(`# sum exists for this ladder. ${f(notASoloSum, 6)} is W-1's rate WITH ONE COMPANION`);
w(`# (${f(w1OneCompanion, 9)}) plus W-2's rate IN THE FULL THREE WELL CASE (${f(f3.wellRates.w2, 9)}),`);
w(`# and the second of those is already inside the ${f(f3Total, 6)} lb/d total it is`);
w('# being set against. Quote it as what it is or not at all: the distinction');
w('# between a solo rate and a rate on the system is the thing this section exists');
w('# to teach.');
w(`derived wells_fight, W-1 with one companion plus W-2 in the three well case = ${f(notASoloSum, 6)} lb/d, which is NOT a solo sum`);
w('# DERIVED SWEEP: the same three wells against a separator pressure walked down.');
w('# Backing the boundary off is the one lever that helps every well at once, and');
w('# it is the lever a single-well study cannot price because the boundary is the');
w('# thing it was told.');
for (const ps of [120, 150, 180, 220, 300, 400]) {
  const nodes = [{ id: 'h', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: ps }];
  const branches = [{ id: 'trunk', from: 'h', to: 's' }];
  const K = { trunk: 410 }; const wells = {};
  for (let i = 0; i < 3; i += 1) {
    const [qmax, pr, k] = FIGHT_SPECS[i];
    nodes.push({ id: `w${i}`, kind: 'well' });
    branches.push({ id: `f${i}`, from: `w${i}`, to: 'h' });
    K[`f${i}`] = k; wells[`w${i}`] = vogel(qmax, pr);
  }
  const net = N.buildNetwork({ nodes, branches });
  const r = N.solveNetwork({
    network: net, branchFlow: (b, pIn, pOut) => turbulent(K[b.id])(b, pIn, pOut),
    wellInflow: (nd, p) => wells[nd.id](p), tolerance: 1e-10,
  });
  const tot = Object.values(r.wellRates).reduce((a, b) => a + b, 0);
  w(`derived separator sweep, separator at ${ps} psia: header = ${f(r.pressures.h, 6)} psia, total = ${f(tot, 6)} lb/d, w0 = ${f(r.wellRates.w0, 6)}, w1 = ${f(r.wellRates.w1, 6)}, w2 = ${f(r.wellRates.w2, 6)} lb/d`);
}
w('');

// ============================================================ SECTION 9
w('# SECTION 9: ONE WELL ON ITS OWN, ON THE TEACHING NETWORK');
w('# Associate m05 and m06 l02. TEACHING. Each AGBADA well solved on its own');
w('# flowline against the separator, with nothing else on the system. This is the');
w('# layer a single-well studio already gives you: one well, one line, one boundary,');
w('# and a wellhead pressure that falls straight out of the two. Every number here');
w('# is a baseline the next section destroys.');
w(`teaching solo, the boundary is the separator at ${T_SEP_PSIA} psia and each well keeps its own flowline conductance`);
for (const id of ['t1', 't2', 't3', 't4']) {
  const s = tSolo[id];
  const kOf = { t1: T_K.e1, t2: T_K.e2, t3: T_K.e3, t4: T_K.e4 }[id];
  w(`teaching solo ${id} (${T_WELLS_SPEC[id].label}), conditions: Vogel qmax = ${T_WELLS_SPEC[id].qmax} lb/d at reservoir pressure ${T_WELLS_SPEC[id].prPsia} psia, flowline conductance ${kOf} lb/d per root psi${id === 't4' ? `, held to an allocation of ${T_ALLOC_LBD} lb/d on a line capped at ${T_LINECAP_LBD} lb/d` : ''}`);
  w(`teaching solo ${id}, wellhead = ${f(s.res.pressures[id], 9)} psia, rate = ${f(s.res.wellRates[id], 9)} lb/d, line drop = ${f(s.res.pressures[id] - T_SEP_PSIA, 9)} psi`);
  w(`teaching solo ${id}, converged = ${yn(s.res.converged)} in ${s.res.iterations} iterations, reported residual = ${e(s.res.residualLbD, 4)} lb/d, pinned = ${lst(s.res.pinned)}, warnings = ${lst(s.res.warnings)}`);
  w(`teaching solo ${id}, checkConservation gap = ${e(s.cons.gapLbD, 6)} lb/d, relative = ${e(s.cons.relative, 6)}`);
  w(`teaching solo ${id}, drawdown from reservoir pressure to wellhead = ${f(T_WELLS_SPEC[id].prPsia - s.res.pressures[id], 6)} psi, and the Vogel curve at that wellhead would give ${f(vogel(T_WELLS_SPEC[id].qmax, T_WELLS_SPEC[id].prPsia)(s.res.pressures[id]), 9)} lb/d`);
}
w('# NOTE THE FOURTH WELL. ITS SOLO ANSWER IS ALREADY WRONG AND THE ENGINE SAYS IT');
w('# CONVERGED. Its allocation is larger than its flowline can pass, so the line');
w('# saturates, the node goes flat, it is pinned, and the difference stops being');
w('# counted. Section 18 takes it apart. On its own line it is already the case');
w('# the whole Expert tier is about.');
w('');

// ============================================================ SECTION 10
w('# SECTION 10: THE TEACHING NETWORK, SOLVED');
w('# Professional m01 through m04, and the case every Expert section returns to.');
w('# TEACHING. Four wells, three junctions, one loop, eight branches, seven unknown');
w('# pressures. Every condition is printed so a lesson can restate the case without');
w('# reaching for anything else.');
w(`teaching network, separator at ${T_SEP_PSIA} psia`);
for (const id of ['t1', 't2', 't3', 't4']) {
  w(`teaching network condition, ${id} (${T_WELLS_SPEC[id].label}): Vogel qmax = ${T_WELLS_SPEC[id].qmax} lb/d at reservoir pressure ${T_WELLS_SPEC[id].prPsia} psia${id === 't4' ? `, allocation ${T_ALLOC_LBD} lb/d, flowline capacity ${T_LINECAP_LBD} lb/d in either direction` : ''}`);
}
for (const b of T_BRANCHES) {
  w(`teaching network condition, branch ${b.id} (${b.label}) runs ${b.from} to ${b.to} with conductance ${T_K[b.id]} lb/d per root psi`);
}
w(`teaching network, tolerance asked = 1e-12, iteration cap left at the module default ${N.DEFAULT_MAX_ITER}`);
w(`teaching network, converged = ${yn(T.res.converged)}, ok = ${yn(T.res.ok)}, iterations = ${T.res.iterations}, reported residualLbD = ${e(T.res.residualLbD, 6)}, pinned = ${lst(T.res.pinned)}`);
for (const nd of T_NODES) {
  w(`teaching network, pressure ${nd.id} (${nd.label}) = ${f(T.res.pressures[nd.id], 9)} psia`);
}
for (const b of T_BRANCHES) {
  w(`teaching network, flow ${b.id} (${b.label}) = ${f(T.res.flows[b.id], 9)} lb/d, signed from ${b.from} to ${b.to}`);
}
for (const id of ['t1', 't2', 't3', 't4']) {
  w(`teaching network, well rate ${id} = ${f(T.res.wellRates[id], 9)} lb/d`);
}
for (const id of T.net.unknownIds) {
  w(`teaching network, nodal imbalance at ${id} = ${e(T.res.imbalance[id], 6)} lb/d`);
}
w(`teaching network, warnings from the engine: ${lst(T.res.warnings)}`);
w('# EVERY UNKNOWN NODE IS AT ZERO IMBALANCE EXCEPT ONE, AND THE ONE THAT IS NOT');
w('# IS THE ONE THE REPORTED RESIDUAL CANNOT SEE. Section 19.');
w('');

// ============================================================ SECTION 11
w('# SECTION 11: WHAT THE NETWORK COSTS EACH WELL');
w('# Professional m03 l03, and Expert m01 l01. TEACHING. The same four wells, first');
w('# alone on their own flowlines and then on the system together. The comparison');
w('# is the entire reason this module exists, and neither column can be got at from');
w('# the other by any single-well method.');
for (const id of ['t1', 't2', 't3', 't4']) {
  const solo = tSolo[id].res.wellRates[id];
  const netw = T.res.wellRates[id];
  w(`teaching fight, ${id} (${T_WELLS_SPEC[id].label}): alone = ${f(solo, 9)} lb/d at ${f(tSolo[id].res.pressures[id], 6)} psia, on the system = ${f(netw, 9)} lb/d at ${f(T.res.pressures[id], 6)} psia, `
    + `lost = ${f(solo - netw, 9)} lb/d, which is ${f(100 * (1 - netw / solo), 9)} percent of itself, and its wellhead rose by ${f(T.res.pressures[id] - tSolo[id].res.pressures[id], 6)} psi`);
}
const soloSum = ['t1', 't2', 't3', 't4'].reduce((a, id) => a + tSolo[id].res.wellRates[id], 0);
const netSum = ['t1', 't2', 't3', 't4'].reduce((a, id) => a + T.res.wellRates[id], 0);
w(`teaching fight, the four solo rates add to ${f(soloSum, 9)} lb/d and the system produces ${f(netSum, 9)} lb/d, so the network costs ${f(soloSum - netSum, 9)} lb/d, which is ${f(100 * (1 - netSum / soloSum), 9)} percent`);
w('# THE WEAK WELL LOSES MOST. A well with a low reservoir pressure has the least');
w('# margin over the header, so a header that rises takes a larger share of what it');
w('# had. Ranking wells by what they lose is not the same as ranking them by what');
w('# they make, and the second ranking is the one every allocation meeting uses.');
const ranked = ['t1', 't2', 't3', 't4'].map((id) => ({
  id, lostPct: 100 * (1 - T.res.wellRates[id] / tSolo[id].res.wellRates[id]), rate: T.res.wellRates[id],
}));
w(`teaching fight, ranked by percentage lost: ${[...ranked].sort((a, b) => b.lostPct - a.lostPct).map((r) => `${r.id} at ${f(r.lostPct, 4)}`).join(', ')} percent`);
w(`teaching fight, ranked by rate on the system: ${[...ranked].sort((a, b) => b.rate - a.rate).map((r) => `${r.id} at ${f(r.rate, 4)}`).join(', ')} lb/d`);
w('# DERIVED SWEEP on the teaching network: take one well off the system at a time');
w('# and watch what the survivors gain. The gain is not the rate the shut well was');
w('# making, and reading it as though it were is the standard way a deferment');
w('# number is overstated.');
let t4SurvivorGain = 0;
for (const off of ['t1', 't2', 't3', 't4']) {
  const nodes = T_NODES.filter((n) => n.id !== off);
  const branches = T_BRANCHES.filter((b) => b.from !== off);
  const net2 = N.buildNetwork({ nodes, branches });
  const r = N.solveNetwork({
    network: net2, branchFlow: tBranchFlow(), wellInflow: tWellInflow, tolerance: 1e-12,
  });
  const tot = Object.values(r.wellRates).reduce((a, b) => a + b, 0);
  const survivorGain = ['t1', 't2', 't3', 't4'].filter((x) => x !== off)
    .reduce((a, x) => a + (r.wellRates[x] - T.res.wellRates[x]), 0);
  w(`teaching shut-in, with ${off} taken off the system: total from the rest = ${f(tot, 9)} lb/d, the survivors gained ${f(survivorGain, 9)} lb/d between them, `
    + `against the ${f(T.res.wellRates[off], 9)} lb/d ${off} was reported to be making, so the true deferment is ${f(T.res.wellRates[off] - survivorGain, 9)} lb/d`);
  if (off === 't4') t4SurvivorGain = survivorGain;
}
w('# READ THE t4 ROW TWICE. Its "true deferment" is measured from t4\'s REPORTED');
w(`# rate of ${f(T.res.wellRates.t4, 9)} lb/d, and t4 is the PINNED node: its flowline passes`);
w(`# only ${f(T.res.flows.e4, 9)} lb/d, and the ${f(T.res.wellRates.t4 - T.res.flows.e4, 9)} lb/d between those two numbers`);
w('# is the conservation gap the Expert tier is built on. So this row overstates a');
w('# deferment by exactly that gap, in the section whose whole subject is that');
w('# deferment numbers are overstated. Measured from the rate the network actually');
w('# DELIVERED, the deferment is the derived line below. The other three rows are');
w('# not affected this way, because t4 stays on the system in all of them.');
w(`derived, the t4 deferment measured from the ${f(T.res.flows.e4, 9)} lb/d its flowline actually delivers rather than the ${f(T.res.wellRates.t4, 9)} lb/d it reports = ${f(T.res.flows.e4 - t4SurvivorGain, 9)} lb/d, which is ${f(T.res.wellRates.t4 - T.res.flows.e4, 9)} lb/d below the row above`);
w("# This line is arithmetic on two generated lines and nothing else: the survivors'");
w('# gain and the delivered flow are both engine returns printed above.');
w('');

// ============================================================ SECTION 12
w('# SECTION 12: A DRAWN ARROW IS NOT A FLOW DIRECTION');
w('# Professional m02 l04, and Expert m02 l01. TEACHING. The crosslink on AGBADA');
w('# WEST is drawn from the north manifold to the loop tee and the solve returns it');
w('# NEGATIVE, so it carries mass the other way. A learner who takes the drawing');
w('# arrow at face value gets the sign, the stream split and the whole downstream');
w('# reading wrong. diagnose names it, and the name is the only thing in the return');
w('# that does.');
w(`teaching direction, crosslink c2 is drawn ${T_BRANCHES.find((b) => b.id === 'c2').from} to ${T_BRANCHES.find((b) => b.id === 'c2').to} and the solve returns ${f(T.res.flows.c2, 9)} lb/d`);
w(`teaching direction, so it actually carries ${f(Math.abs(T.res.flows.c2), 9)} lb/d from ${T_BRANCHES.find((b) => b.id === 'c2').to} into ${T_BRANCHES.find((b) => b.id === 'c2').from}`);
w(`teaching direction, the pressure across it is ${f(T.res.pressures.ha - T.res.pressures.hb, 9)} psi in the drawn sense, so the drawn downstream end is the HIGHER of the two`);
w(`teaching direction, diagnose backflows = ${lst(tDiag.backflows.map((r) => `${r.id} (${r.label}) at ${f(r.massLbD, 6)} lb/d`))}`);
w(`teaching direction, diagnose dead legs = ${lst(tDiag.dead.map((r) => r.id))}`);
w('# WHY IT REVERSES. The loop tee is fed by one well through a stiff flowline and');
w('# the north manifold is fed by three through slacker ones, so at the solution the');
w('# loop tee sits ABOVE the manifold and the crosslink drains toward the manifold.');
w('# The drawing was a guess made before anybody solved anything.');
w('# DERIVED SWEEP: walk the crosslink conductance and watch the direction hold and');
w('# then the magnitude grow. The sign is a property of the SOLUTION and not of the');
w('# branch.');
for (const kc2 of [60, 150, 300, 540, 900, 1400]) {
  const r = tSolve({ kmap: { ...T_K, c2: kc2 } }).res;
  w(`teaching crosslink sweep, conductance ${kc2} lb/d per root psi: manifold = ${f(r.pressures.ha, 6)} psia, loop tee = ${f(r.pressures.hb, 6)} psia, crosslink = ${f(r.flows.c2, 6)} lb/d, dp in the drawn sense = ${f(r.pressures.ha - r.pressures.hb, 6)} psi, trunk = ${f(r.flows.tk, 6)} lb/d`);
}
w('');

// ============================================================ SECTION 13
w('# SECTION 13: THE BOTTLENECK IS NOT THE BIGGEST DROP');
w('# Professional m05. PUBLISHED gate fixture first, then TEACHING. The bottleneck');
w('# is the branch eating the most pressure per unit of what it carries, not simply');
w('# the one with the biggest drop: a trunk line carrying everything is SUPPOSED to');
w('# have the biggest drop, and pointing at it every time would be useless. The');
w('# units of the intensity are arbitrary; only the ranking is used.');
const dgNet = N.buildNetwork({
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
const dg1 = N.diagnose({ network: dgNet, pressures: { w1: 400, w2: 900, h: 300, s: 100 }, flows: { big: 40000, choked: 2000, trunk: 42000 } });
const dg2 = N.diagnose({ network: dgNet, pressures: { w1: 400, w2: 500, h: 350, s: 100 }, flows: { big: 40000, choked: 300, trunk: 40300 } });
for (const [nm, d] of [['case 1', dg1], ['case 2', dg2]]) {
  for (const r of d.rows) {
    w(`published diagnose ${nm}, branch ${r.id} (${r.label}): dp = ${f(r.dpPsi, 6)} psi, mass = ${f(r.massLbD, 6)} lb/d, intensity = ${e(r.intensity, 6)} psi per lb/d`);
  }
  w(`published diagnose ${nm}, biggest drop = ${d.biggestDrop.id}, bottleneck = ${d.bottleneck.id}`);
}
w('# IN THE SECOND CASE THE TRUNK HAS THE BIGGEST DROP AND THE RANKING STILL PICKS');
w('# THE INTENSE LEG. That is the whole design of the function.');
for (const r of tDiag.rows) {
  w(`teaching diagnose, branch ${r.id} (${r.label}): dp = ${f(r.dpPsi, 9)} psi, mass = ${f(r.massLbD, 9)} lb/d, intensity = ${e(r.intensity, 6)} psi per lb/d, backflow = ${yn(r.backflow)}`);
}
w(`teaching diagnose, biggest drop = ${tDiag.biggestDrop.id} (${tDiag.biggestDrop.label}) at ${f(tDiag.biggestDrop.dpPsi, 6)} psi`);
w(`teaching diagnose, bottleneck = ${tDiag.bottleneck.id} (${tDiag.bottleneck.label}) at intensity ${e(tDiag.bottleneck.intensity, 6)}`);
w('# A RANKING THAT FAILS OPEN, AND IT COSTS NOTHING HERE. The intensity is');
w('# |dp| / |mass| with only a guard at a billionth of a pound a day. A leg carrying');
w('# a millionth of a pound a day with one psi across it scores a million and wins');
w('# the ranking every time, and it is the one leg nothing can be done about.');
const openNet = N.buildNetwork({
  nodes: [{ id: 'w', kind: 'well' }, { id: 'j', kind: 'junction' }, { id: 'd', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
  branches: [
    { id: 'main', from: 'w', to: 'j', label: 'Main flowline' },
    { id: 'whisper', from: 'j', to: 'd', label: 'A leg carrying almost nothing' },
    { id: 'out', from: 'j', to: 's', label: 'Trunk' },
  ],
});
for (const tiny of [1e-8, 1e-6, 1e-3, 1, 100]) {
  const d = N.diagnose({ network: openNet, pressures: { w: 800, j: 400, d: 399, s: 100 }, flows: { main: 50000, whisper: tiny, out: 50000 } });
  w(`derived ranking guard, the whisper leg carrying ${e(tiny, 2)} lb/d with 1 psi across it: intensity = ${e(d.rows.find((r) => r.id === 'whisper').intensity, 6)}, bottleneck = ${d.bottleneck.id}, biggest drop = ${d.biggestDrop.id}`);
}
w('# A RELATIVE FLOOR, SUCH AS ONE PART IN TEN THOUSAND OF THE LARGEST BRANCH MASS,');
w('# would close it. Expert m05 owns this one as a note rather than a defect,');
w('# because on a real case the ranking behaves exactly as its header says.');
w('');

// ============================================================ SECTION 14
w('# SECTION 14: STREAMS ADD BY RATE AND NEVER BY RATIO');
w('# Professional m04. PUBLISHED gate fixture, then TEACHING. Component rates ADD.');
w('# That is the entire algorithm and it is exact: a header carrying a dry well and');
w('# a wet one carries the sum of both, and its water cut is a consequence rather');
w('# than an input. Mixing RATIOS, averaging two water cuts or two gas-oil ratios,');
w('# is the classic way to get this wrong, and it is wrong by a factor that depends');
w('# on how unequal the rates are.');
const pubStreamNet = N.buildNetwork({
  nodes: [{ id: 'w1', kind: 'well' }, { id: 'w2', kind: 'well' }, { id: 'h', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 150 }],
  branches: [{ id: 'b1', from: 'w1', to: 'h' }, { id: 'b2', from: 'w2', to: 'h' }, { id: 'b3', from: 'h', to: 's' }],
});
const pubWellStreams = {
  w1: { qoStbd: 2700, qwStbd: 300, qgMscfd: 1600, massLbD: 30000 },
  w2: { qoStbd: 200, qwStbd: 800, qgMscfd: 90, massLbD: 10000 },
};
const pubStreams = N.propagateStreams({ network: pubStreamNet, flows: { b1: 30000, b2: 10000, b3: 40000 }, wellStreams: pubWellStreams });
w('published streams, a big dry well at 2700 stb/d oil, 300 stb/d water, 1600 Mscf/d gas and 30000 lb/d mass, and a small wet one at 200 stb/d oil, 800 stb/d water, 90 Mscf/d gas and 10000 lb/d mass');
const pt = pubStreams.branchStreams.b3;
w(`published streams, the trunk carries oil = ${f(pt.qoStbd, 6)} stb/d, water = ${f(pt.qwStbd, 6)} stb/d, gas = ${f(pt.qgMscfd, 6)} Mscf/d, mass = ${f(pt.massLbD, 6)} lb/d`);
const pubWct = (100 * pt.qwStbd) / (pt.qoStbd + pt.qwStbd);
const pubNaive = ((100 * 300) / 3000 + (100 * 800) / 1000) / 2;
w(`published streams, the trunk water cut = ${f(pubWct, 6)} percent`);
w(`published streams, the two well water cuts are ${f((100 * 300) / 3000, 6)} and ${f((100 * 800) / 1000, 6)} percent, and their plain average is ${f(pubNaive, 6)} percent`);
w(`published streams, so averaging the ratios is wrong by ${f(pubNaive - pubWct, 6)} percentage points, a factor of ${f(pubNaive / pubWct, 6)} on the number a facility would be sized against`);
w('# A NODE WITH MORE THAN ONE WAY OUT SPLITS ITS STREAM BY MASS, which is the only');
w('# split that conserves anything. PUBLISHED gate fixture.');
const splitNet = N.buildNetwork({
  nodes: [{ id: 'w', kind: 'well' }, { id: 'j', kind: 'junction' }, { id: 's1', kind: 'sink', pressurePsia: 100 }, { id: 's2', kind: 'sink', pressurePsia: 100 }],
  branches: [{ id: 'a', from: 'w', to: 'j' }, { id: 'x', from: 'j', to: 's1' }, { id: 'y', from: 'j', to: 's2' }],
});
const splitS = N.propagateStreams({ network: splitNet, flows: { a: 1000, x: 750, y: 250 }, wellStreams: { w: { qoStbd: 400, qwStbd: 100, qgMscfd: 200, massLbD: 1000 } } });
w(`published stream split, a well of 400 stb/d oil on 1000 lb/d splitting 750 and 250 lb/d: leg x oil = ${f(splitS.branchStreams.x.qoStbd, 9)} stb/d, leg y oil = ${f(splitS.branchStreams.y.qoStbd, 9)} stb/d, sum = ${f(splitS.branchStreams.x.qoStbd + splitS.branchStreams.y.qoStbd, 9)} stb/d`);
w('# A RECIRCULATING LOOP IS REPORTED, NOT ITERATED ON. PUBLISHED gate fixture.');
const recirc = N.propagateStreams({
  network: N.buildNetwork({
    nodes: [{ id: 'w', kind: 'well' }, { id: 'a', kind: 'junction' }, { id: 'b', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
    branches: [{ id: 'i', from: 'w', to: 'a' }, { id: 'ab', from: 'a', to: 'b' }, { id: 'ba', from: 'b', to: 'a' }, { id: 'o', from: 'b', to: 's' }],
  }),
  flows: { i: 100, ab: 50, ba: 50, o: 100 },
  wellStreams: { w: { qoStbd: 10, qwStbd: 0, qgMscfd: 0, massLbD: 100 } },
});
w(`published stream refusal, a recirculating loop: ok = ${yn(recirc.ok)}, message: ${recirc.error}`);
w('# TEACHING. The same propagation on AGBADA WEST, along the directions the solve');
w('# actually found, which includes the crosslink running backwards.');
for (const id of ['t1', 't2', 't3', 't4']) {
  const s = T_STREAMS[id];
  w(`teaching stream input, ${id} (${T_WELLS_SPEC[id].label}) is tested at oil = ${s.qoStbd} stb/d, water = ${s.qwStbd} stb/d, gas = ${s.qgMscfd} Mscf/d, and is handed in with the mass the solve gave it`);
}
for (const b of T_BRANCHES) {
  const s = tStreams.branchStreams[b.id];
  if (!s) { w(`teaching stream, branch ${b.id} (${b.label}) carries no stream`); continue; }
  w(`teaching stream, branch ${b.id} (${b.label}): oil = ${f(s.qoStbd, 9)} stb/d, water = ${f(s.qwStbd, 9)} stb/d, gas = ${f(s.qgMscfd, 9)} Mscf/d, mass = ${f(s.massLbD, 9)} lb/d`);
}
const tTrunkS = tStreams.branchStreams.tk;
const tWct = (100 * tTrunkS.qwStbd) / (tTrunkS.qoStbd + tTrunkS.qwStbd);
const tNaive = Object.values(T_STREAMS).reduce((a, s) => a + (100 * s.qwStbd) / (s.qoStbd + s.qwStbd), 0) / 4;
w(`teaching stream, the trunk water cut = ${f(tWct, 9)} percent`);
w(`teaching stream, the plain average of the four well water cuts = ${f(tNaive, 9)} percent, wrong by ${f(tNaive - tWct, 9)} percentage points`);
for (const id of ['t1', 't2', 't3', 't4']) {
  const s = T_STREAMS[id];
  w(`teaching stream, ${id} water cut on its own = ${f((100 * s.qwStbd) / (s.qoStbd + s.qwStbd), 9)} percent`);
}
const tSep = tStreams.nodeStreams.sep;
w(`teaching stream, what arrives at the separator: oil = ${f(tSep.qoStbd, 9)} stb/d, water = ${f(tSep.qwStbd, 9)} stb/d, gas = ${f(tSep.qgMscfd, 9)} Mscf/d, mass = ${f(tSep.massLbD, 9)} lb/d`);
w(`teaching stream, the four wells were tested at ${f(Object.values(T_STREAMS).reduce((a, s) => a + s.qoStbd, 0), 6)} stb/d oil, ${f(Object.values(T_STREAMS).reduce((a, s) => a + s.qwStbd, 0), 6)} stb/d water and ${f(Object.values(T_STREAMS).reduce((a, s) => a + s.qgMscfd, 0), 6)} Mscf/d gas between them`);
w('# THE SEPARATOR IS TOLD IT RECEIVES ALL OF IT. Section 17 is why that is a lie');
w('# on this network, and why nothing in the return says so.');
w('');

// ============================================================ SECTION 15
w('# SECTION 15: TWO SIGN CONVENTIONS UNDER ONE WORD');
w('# Expert m02 l02. TEACHING. flows[b] is signed from the branch drawn `from` to');
w('# its drawn `to`. branchStreams[b].massLbD is the stream along the SOLVED');
w('# direction, so it is always positive. On a branch that runs backwards the two');
w('# disagree in sign, and a consumer differencing them to check itself gets twice');
w('# the flow and reads it as a conservation failure. Both conventions are');
w('# defensible; carrying both under the same word in the same result is not.');
for (const b of T_BRANCHES) {
  const s = tStreams.branchStreams[b.id];
  if (!s) continue;
  w(`teaching sign, branch ${b.id} (${b.label}): flows = ${f(T.res.flows[b.id], 9)} lb/d, branchStreams mass = ${f(s.massLbD, 9)} lb/d, difference = ${f(s.massLbD - T.res.flows[b.id], 9)} lb/d`);
}
w(`teaching sign, on the one branch that runs backwards the difference is ${f(tStreams.branchStreams.c2.massLbD - T.res.flows.c2, 9)} lb/d, which is exactly twice the ${f(Math.abs(T.res.flows.c2), 9)} lb/d it carries`);
w('# TWO DIFFERENT CAUSES ARE SHOWING UP IN ONE COLUMN, AND ONLY ONE OF THEM IS');
w("# THIS SECTION'S FINDING. SEPARATE THEM BEFORE WRITING ANYTHING ON THIS TABLE.");
w('#   THE SIGN CONVENTION, which is this section: c2 alone. It is the one branch');
w(`#   that runs BACKWARDS, and its difference of ${f(tStreams.branchStreams.c2.massLbD - T.res.flows.c2, 9)} lb/d is exactly`);
w(`#   twice the ${f(Math.abs(T.res.flows.c2), 9)} lb/d it carries. That factor of two is the`);
w('#   signature, and no other branch here has it.');
w("#   THE PINNED-WELL MASS HOLE, which is Section 19's finding and not this one:");
w(`#   e4, c1 and tk each show ${f(T.res.wellRates.t4 - T.res.flows.e4, 9)} lb/d, and every one of those three ran`);
w('#   the way it was drawn. That number is the conservation gap propagating along');
w('#   the path out of the pinned node, not a convention disagreement.');
w('# So it is NOT true that differencing the two finds zero everywhere the network');
w('# ran as drawn. It finds zero on four branches, the doubled flow on the one that');
w("# reversed, and the conservation gap on the three that carry the pinned well's");
w('# reported mass. A consumer differencing them sees one column and two diseases.');
w('');
w('# THE RANKING BASIS diagnose USES, stated here because no published case');
w('# distinguishes it and two readers have had to guess. BOTH rankings are on');
w('# MAGNITUDE: biggestDrop reduces on Math.abs(dpPsi) and intensity is');
w('# Math.abs(dp) / Math.abs(q), so a backflow branch is ranked on the size of its');
w('# drop and its mass, not their sign. The two rankings differ in their');
w('# POPULATION, and that difference is real: bottleneck ranks only over branches');
w('# CARRYING mass above 1e-9, while biggestDrop ranks over EVERY branch including');
w('# a dead one. A dead leg with a large pressure difference across it can');
w('# therefore be the reported biggest drop and can never be the bottleneck.');
w('');

// ============================================================ SECTION 16
w('# SECTION 16: A NODE THAT NOTHING DEPENDS ON IS PINNED');
w('# Expert m01 l01 and l02. PUBLISHED gate fixture first. A node whose Jacobian');
w('# ROW is entirely zero is a node whose pressure changes nothing that flows. The');
w('# module pins it at its current pressure and takes it out of the system rather');
w('# than dragging a perfectly good network down with it, and it reports which');
w('# nodes were pinned, because a pinned node is a fact about the answer and not an');
w('# implementation detail.');
const pinNet = N.buildNetwork({
  nodes: [{ id: 'w', kind: 'well', label: 'W-1' }, { id: 's', kind: 'sink', label: 'Separator', pressurePsia: 100 }],
  branches: [{ id: 'a', from: 'w', to: 's', label: 'Flowline' }],
});
const pinRes = N.solveNetwork({ network: pinNet, branchFlow: () => 1000, wellInflow: () => 2000 });
w('published pinning, the gate own fixture: a well whose inflow is a constant 2000 lb/d on a branch whose flow is a constant 1000 lb/d, so neither depends on any pressure');
w(`published pinning, ok = ${yn(pinRes.ok)}, converged = ${yn(pinRes.converged)}, pinned = ${lst(pinRes.pinned)}, reported residualLbD = ${e(pinRes.residualLbD, 6)}, iterations = ${pinRes.iterations}`);
w(`published pinning, warning: ${pinRes.warnings.join(' ')}`);
w(`published pinning, the node own imbalance = ${f(pinRes.imbalance.w, 6)} lb/d, and the well makes ${f(pinRes.wellRates.w, 6)} lb/d while the line passes ${f(pinRes.flows.a, 6)} lb/d`);
const pinCons = N.checkConservation({ network: pinNet, flows: pinRes.flows, wellRates: pinRes.wellRates });
w(`published pinning, checkConservation: produced = ${f(pinCons.producedLbD, 6)} lb/d, delivered = ${f(pinCons.deliveredLbD, 6)} lb/d, gap = ${f(pinCons.gapLbD, 6)} lb/d, relative = ${f(pinCons.relative, 9)}`);
w('# THE GATE ASSERTS ok, pinned AND THE WARNING TEXT ON THIS EXACT CASE, AND NEVER');
w('# LOOKS AT THE HOLE IT JUST CREATED. The published fixture is a thousand pounds');
w('# a day of production that goes into the network and never comes out, under a');
w('# reported residual of zero.');
w('# A LIVE NETWORK REPORTS NOTHING PINNED, which is what makes the flag readable.');
const livePin = N.solveNetwork({
  network: pinNet,
  branchFlow: (b, pIn, pOut) => 300 * (pIn - pOut),
  wellInflow: (nd, p) => N.linearWell({ qmax: 20000, prPsia: 800 })(nd, p),
});
w(`published pinning, the same topology with a real branch and a real inflow: pinned = ${lst(livePin.pinned)}, warnings = ${lst(livePin.warnings)}, wellhead = ${f(livePin.pressures.w, 9)} psia, rate = ${f(livePin.wellRates.w, 9)} lb/d`);
w('# THE CONTRACT GAP BEHIND IT. The module header requires wellInflow to be');
w('# monotone DECREASING in p. A well held to a facility allocation, a choke limit');
w('# or a compressor slot is monotone NON-increasing, with a flat top, and the flat');
w('# top is precisely what makes its node pinnable. TEACHING: AGBADA-12 is exactly');
w('# such a well and its flowline is capacity limited below its allocation.');
w(`teaching pinning, AGBADA-12 is allocated ${T_ALLOC_LBD} lb/d and its flowline cannot pass more than ${T_LINECAP_LBD} lb/d, a shortfall of ${T_ALLOC_LBD - T_LINECAP_LBD} lb/d by construction`);
w(`teaching pinning, on the solved network: pinned = ${lst(T.res.pinned)}, its node pressure = ${f(T.res.pressures.t4, 9)} psia, its reported rate = ${f(T.res.wellRates.t4, 9)} lb/d, its flowline passes ${f(T.res.flows.e4, 9)} lb/d`);
w(`teaching pinning, its own nodal imbalance = ${f(T.res.imbalance.t4, 9)} lb/d, and the engine carries that number in the returned imbalance object where nothing consults it`);
w(`teaching pinning, the reported residualLbD = ${e(T.res.residualLbD, 6)} lb/d, which is the worst imbalance over the UNPINNED nodes only`);
w('# THE FLAT TOP IS WHAT DOES IT. Below the pressure where the allocation binds the');
w('# well is a Vogel curve and its node is perfectly live. Above it the inflow stops');
w('# depending on pressure, and once the line saturates as well, the node loses both');
w('# its row and its column.');
w('# DERIVED SWEEP: walk the allocation on the teaching network from below the line');
w('# capacity to well above it, and watch the node go from live to pinned.');
for (const alloc of [300, 500, 620, 640, 660, 800, 985, 1300]) {
  const wells2 = { ...T_WELLS, t4: allocated(alloc, T_WELLS_SPEC.t4.qmax, T_WELLS_SPEC.t4.prPsia) };
  const net2 = N.buildNetwork({ nodes: T_NODES, branches: T_BRANCHES });
  const r = N.solveNetwork({
    network: net2, branchFlow: tBranchFlow(), wellInflow: (nd, p) => wells2[nd.id](p), tolerance: 1e-12,
  });
  const c = N.checkConservation({ network: net2, flows: r.flows, wellRates: r.wellRates });
  w(`teaching allocation sweep, allocation ${alloc} lb/d: converged = ${yn(r.converged)}, pinned = ${lst(r.pinned)}, reported residual = ${e(r.residualLbD, 4)} lb/d, AGBADA-12 rate = ${f(r.wellRates.t4, 6)} lb/d, its flowline = ${f(r.flows.e4, 6)} lb/d, conservation gap = ${f(c.gapLbD, 6)} lb/d, relative = ${f(c.relative, 9)}`);
}
w('# THE SWEEP CROSSES THE LINE CAPACITY AND NOTHING IN THE RETURN CHANGES EXCEPT');
w('# THE WORD pinned AND A GAP NOBODY IS SHOWN.');
w('');

// ============================================================ SECTION 17
w('# SECTION 17: THE REPORTED RESIDUAL CANNOT SEE ITS OWN ERROR');
w('# Expert m01 l03, l04 and l05. THE HEADLINE OF THIS COURSE. TEACHING, and the');
w('# mechanism is one line of the module. normOf is built as the maximum over the');
w('# unknowns FILTERED to exclude the pinned ones, and `converged` is tested');
w('# against that norm, so a pinned node is removed from the measurement by');
w('# construction. Everything below is the size of what that hides.');
w(`teaching residual, the engine reports converged = ${yn(T.res.converged)} with residualLbD = ${e(T.res.residualLbD, 6)} lb/d after ${T.res.iterations} iterations`);
w(`teaching residual, checkConservation on the same answer: produced = ${f(T.cons.producedLbD, 9)} lb/d, delivered = ${f(T.cons.deliveredLbD, 9)} lb/d, gap = ${f(T.cons.gapLbD, 9)} lb/d, relative = ${f(T.cons.relative, 12)}`);
w(`teaching residual, the conservation gap as a percentage of what the engine says was produced = ${f(100 * T.cons.relative, 9)} percent`);
w(`teaching residual, the gap divided by the reported residual = ${e(T.cons.gapLbD / T.res.residualLbD, 6)}`);
w(`teaching residual, the worst imbalance over ALL unknown nodes including the pinned one = ${f(Math.max(...T.net.unknownIds.map((id) => Math.abs(T.res.imbalance[id]))), 9)} lb/d`);
w(`teaching residual, the worst imbalance over the UNPINNED nodes only, which is what the engine reports = ${e(Math.max(...T.net.unknownIds.filter((id) => !T.res.pinned.includes(id)).map((id) => Math.abs(T.res.imbalance[id]))), 6)} lb/d`);
w('# checkConservation IS IN THE SAME FILE. Its own header says it is "the only');
w('# check that catches a sign error in the assembly" and that a solver which');
w('# converged on a wrong residual function converges just as smugly as one that did');
w('# not. solveNetwork never calls it. Nothing in the return of solveNetwork is a');
w('# check on the answer that was not computed by the same iteration that produced');
w('# the answer.');
w('# TWO CANDIDATE FIXES, BOTH CHEAP. Report a pinned imbalance alongside the');
w('# residual, or refuse to set converged while any pinned node net is non-zero.');
w('# The second is the honest one, because a pinned node with a non-zero net is not');
w('# a solved network.');
w('# WHAT THE FIRST FIX WOULD PRINT ON THIS CASE, computed here rather than by the');
w('# engine, purely to size it:');
for (const id of T.res.pinned) {
  w(`teaching residual, if the engine reported a pinned imbalance it would report ${f(Math.abs(T.res.imbalance[id]), 9)} lb/d at node ${id}`);
}
w('# AND THE MESSAGE ASSERTS A DIAGNOSIS IT HAS NOT CHECKED. Expert m01 l05.');
w(`teaching residual, the engine warning on this network: ${T.res.warnings.join(' ')}`);
w(`teaching residual, but AGBADA-12 is producing ${f(T.res.wellRates.t4, 9)} lb/d and its flowline is passing ${f(T.res.flows.e4, 9)} lb/d, so it is neither shut in nor on a dead line`);
w('# THE SENTENCE IS THE MODULE TELLING THE USER THE ONE STORY IN WHICH THE PINNING');
w('# IS HARMLESS, ON A CASE WHERE IT IS NOT. Naming the node net imbalance in the');
w('# message would make the difference visible at no cost.');
w('');

// ============================================================ SECTION 18
w('# SECTION 18: THE SAME NETWORK, DIFFERENT ANSWERS, DEPENDING ON THE GUESS');
w('# Expert m03 l01 through l04. TEACHING. A pinned node pressure is wherever the');
w('# last accepted step happened to leave it, and it is returned in `pressures`');
w('# alongside every node that was actually solved, with nothing to tell them');
w('# apart. Change nothing but initialPressures and watch the answer move. Every');
w('# run below reports converged.');
const guessRuns = [
  ['engine default, every unknown at the separator pressure', undefined],
  ['the pinned node started at 400 psia', { t4: 400 }],
  ['the pinned node started at 600 psia', { t4: 600 }],
  ['the pinned node started at 831 psia', { t4: 831 }],
  ['the pinned node started at 1200 psia', { t4: 1200 }],
  ['the pinned node started at 2000 psia', { t4: 2000 }],
  ['every unknown started at 1500 psia', { t1: 1500, t2: 1500, t3: 1500, t4: 1500, ha: 1500, hb: 1500, hc: 1500 }],
];
const guessResults = guessRuns.map(([label, ip]) => [label, tSolve({ initialPressures: ip })]);
for (const [label, r] of guessResults) {
  w(`teaching initial guess, ${label}: converged = ${yn(r.res.converged)}, iterations = ${r.res.iterations}, reported residual = ${e(r.res.residualLbD, 4)} lb/d, `
    + `pinned node pressure = ${f(r.res.pressures.t4, 6)} psia, its flowline = ${f(r.res.flows.e4, 6)} lb/d, its reported rate = ${f(r.res.wellRates.t4, 6)} lb/d, `
    + `manifold = ${f(r.res.pressures.ha, 6)} psia, trunk = ${f(r.res.flows.tk, 6)} lb/d, conservation gap = ${f(r.cons.gapLbD, 6)} lb/d`);
}
w('# READ THE FLOWLINE COLUMN. At a high enough starting pressure the pinned node is');
w('# left ABOVE the manifold and its capacity limited line runs the wrong way at its');
w('# limit, so the pinned node undetermined pressure propagates into every other');
w('# node answer. At a high enough starting pressure the reported well rate goes to');
w('# a number the allocation never permitted. Every one of these says converged.');
w('# AGREEMENT BETWEEN TWO RUNS IS NOT EVIDENCE EITHER. Two of the rows above agree');
w('# on the manifold to the last bit while disagreeing about what the network');
w('# produced.');
// The three readings of this table that are sharper than its heading, and the
// two Vogel crossings they rest on. The crossings are GENERATED here, by
// bisection on the wave's own declared teaching well, rather than asserted.
const t4Curve = vogel(T_WELLS_SPEC.t4.qmax, T_WELLS_SPEC.t4.prPsia);
const t4Crossing = (target) => {
  let lo = 0; let hi = T_WELLS_SPEC.t4.prPsia;
  for (let i = 0; i < 300; i += 1) {
    const m = (lo + hi) / 2;
    if (t4Curve(m) > target) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
};
const t4AllocEnds = t4Crossing(T_ALLOC_LBD);
const t4CapCloses = t4Crossing(T_LINECAP_LBD);
const gDefault = guessResults[0][1];
const g400 = guessResults[1][1];
const g600 = guessResults[2][1];
const g1200 = guessResults[4][1];
w('# THREE MORE THINGS THIS TABLE SAYS, AND THEY ARE SHARPER THAN THE HEADING.');
w('#   THE REPORTED RESIDUAL MOVES AGAINST THE TRUTH ACROSS THIS SWEEP. The two');
w('#   worst runs on the table, the 400 psia and 600 psia starts at a conservation');
w(`#   gap of ${f(g400.cons.gapLbD, 6)} lb/d, carry the SMALLEST reported residual on it,`);
w(`#   ${e(g400.res.residualLbD, 4)} lb/d. The default run, at a gap of ${f(gDefault.cons.gapLbD, 6)} lb/d, reports`);
w(`#   ${e(gDefault.res.residualLbD, 4)}. It is not merely that the residual cannot see the pinned node.`);
w('#   On this sweep the residual gets BETTER as the answer gets WORSE, so a reader');
w('#   ranking these runs by their reported residual would pick the two worst.');
w(`derived t4 curve, ${T_WELLS_SPEC.t4.label} Vogel qmax = ${f(T_WELLS_SPEC.t4.qmax, 1)} lb/d at reservoir pressure ${f(T_WELLS_SPEC.t4.prPsia, 1)} psia, allocation = ${f(T_ALLOC_LBD, 1)} lb/d, line capacity = ${f(T_LINECAP_LBD, 1)} lb/d`);
w(`derived t4 curve, the pressure at which the Vogel inflow falls to the allocation, so the flat top ENDS = ${f(t4AllocEnds, 6)} psia`);
w(`derived t4 curve, the pressure at which the Vogel inflow falls to the LINE CAPACITY, where the mass balance closes = ${f(t4CapCloses, 6)} psia`);
w(`derived t4 curve, the width of the flat top in pressure, from zero up to where the allocation stops binding = ${f(t4AllocEnds, 6)} psia`);
w('#   SEE ALSO SECTION 18B, WHICH PRINTS THE COLUMN THIS TABLE OMITS. The rows');
w('#   below are labelled "pinned node pressure" for all seven runs, and on the');
w('#   1200 psia run NOTHING IS PINNED. That is not a detail, it is the mechanism:');
w('#   the node solves precisely when it is not pinned, and every pinned run is');
w('#   mass-imbalanced.');
w('#   THE ONE ROW WHERE CONSERVATION CLOSES IS THE ONLY ROW THAT IS A SOLUTION,');
w('#   AND THE DEFAULT GUESS DOES NOT FIND IT. Read this one carefully, because the');
w(`#   obvious reading is backwards. ${T_WELLS_SPEC.t4.label} is a Vogel well, qmax ${T_WELLS_SPEC.t4.qmax} lb/d at`);
w(`#   a reservoir pressure of ${T_WELLS_SPEC.t4.prPsia} psia, held to an allocation of ${T_ALLOC_LBD} lb/d, on a`);
w(`#   line that passes at most ${f(T_LINECAP_LBD, 6)} lb/d. Its allocation stops binding at`);
w(`#   ${f(t4AllocEnds, 6)} psia, and its Vogel inflow equals the line capacity at`);
w(`#   ${f(t4CapCloses, 6)} psia, WHICH IS THE PRESSURE THE 1200 PSIA START RETURNS, to the`);
w(`#   last digit printed. At that pressure the well delivers ${f(g1200.res.wellRates.t4, 6)} lb/d, the`);
w(`#   line carries ${f(g1200.res.flows.e4, 6)} lb/d, and the mass balance closes. THAT IS THE`);
w('#   SOLUTION. It is not an accident and the well was not throttled: a well');
w(`#   cannot push ${T_ALLOC_LBD} lb/d through a line that passes ${T_LINECAP_LBD}, and the pressure at its`);
w('#   node rises until its inflow matches what leaves. Every other row on this');
w('#   table is mass-imbalanced and none of them is a solution: the 400, 600 and');
w(`#   831 psia starts sit where the allocation still binds, report ${f(g400.res.wellRates.t4, 6)} lb/d`);
w(`#   into a ${f(T_LINECAP_LBD, 6)} lb/d line and lose ${f(gDefault.cons.gapLbD, 6)} lb/d, and the 2000 psia`);
w(`#   start reports a well making nothing while its line carries ${f(T_LINECAP_LBD, 6)} lb/d.`);
w('#   SO THE FINDING IS STRONGER THAN "THE PINNED PRESSURE IS UNDETERMINED". A');
w('#   correct answer EXISTS, the solver CAN reach it, and the engine default, every');
w('#   unknown at the separator pressure, reliably converges to a non-solution and');
w('#   reports converged. The flat top of the allocation is a trap the default guess');
w('#   starts inside.');
w(`#   THE 400 AND 600 PSIA STARTS ARE IDENTICAL IN EVERY FIELD BUT ONE. Same ${g400.res.iterations}`);
w(`#   iterations, same ${e(g400.res.residualLbD, 4)} residual, same ${f(g400.res.flows.e4, 6)} lb/d flowline, same`);
w(`#   ${f(g400.res.wellRates.t4, 6)} lb/d reported rate, same ${f(g400.res.pressures.ha, 6)} psia manifold, same`);
w(`#   ${f(g400.res.flows.tk, 6)} lb/d trunk, same ${f(g400.cons.gapLbD, 6)} lb/d gap, and a pinned pressure`);
w(`#   ${f(g600.res.pressures.t4 - g400.res.pressures.t4, 0)} psia apart. That is the cleanest proof available that the pinned entry`);
w('#   is DECOUPLED from every other number in the same object.');
w('# FOR SCALE: a pure REORDERING of the nodes array, which changes no physics at');
w('# all, moves the unpinned nodes by nothing anyone can see. The solver iteration');
w('# order does depend on the array order, because unknownIds is built from it, the');
w('# Jacobian column order is that same order, and the dense solve pivots on it.');
const permuted = [...T_NODES].reverse();
const permRes = tSolve({ nodes: permuted });
for (const nd of T_NODES) {
  if (nd.kind === 'sink') continue;
  w(`teaching node order, node ${nd.id}: original = ${f(T.res.pressures[nd.id], 12)} psia, reversed node array = ${f(permRes.res.pressures[nd.id], 12)} psia, movement = ${e(permRes.res.pressures[nd.id] - T.res.pressures[nd.id], 4)} psia`);
}
w(`teaching node order, the largest movement among the UNPINNED nodes = ${e(Math.max(...T.net.unknownIds.filter((id) => !T.res.pinned.includes(id)).map((id) => Math.abs(permRes.res.pressures[id] - T.res.pressures[id]))), 4)} psia`);
w(`teaching node order, the movement at the PINNED node = ${e(Math.abs(permRes.res.pressures.t4 - T.res.pressures.t4), 4)} psia`);
w('# SO THE SOLVED NODES ARE REPRODUCIBLE TO THE LAST BITS UNDER A REORDERING AND');
w('# THE PINNED ONE IS NOT REPRODUCIBLE AT ALL UNDER A CHANGE OF GUESS. Those are');
w('# two different kinds of number wearing the same label in the same object.');
w('');

// ============================================================ SECTION 18B
w('# SECTION 18B: THE PINNING COLUMN SECTION 18 DOES NOT PRINT, AND IT IS');
w('# THE MECHANISM. engine, on the teaching network, same seven runs as');
w('# Section 18. THE NODE SOLVES PRECISELY WHEN IT IS NOT PINNED, and the two');
w('# line up perfectly across the sweep: every run that pins the node is');
w('# mass-imbalanced, and the one run that pins NOTHING is the one whose');
w('# balance closes.');
w('# WHY, and this is better than saying a right answer exists and the default');
w('# misses it. A node is pinned when nothing that flows depends on its');
w('# pressure. On the FLAT TOP of the allocation the well delivers its');
w('# allocation whatever the pressure, so the row is flat, the node is pinned,');
w('# it is dropped from normOf, and the mass the line cannot pass VANISHES');
w(`# FROM THE RESIDUAL. Above ${f(t4AllocEnds, 6)} psia the allocation no longer binds,`);
w('# the inflow depends on pressure again, the node keeps its Jacobian row, it');
w('# is solved rather than left, and the balance closes. THE PINNING IS THE');
w('# NON-SOLUTION. Expert m01 and m03.');
for (const [label, r] of guessResults) {
  w(`engine initial guess, ${label}: node pinned = ${yn(r.res.pinned.includes('t4'))}, conservation gap = ${f(r.cons.gapLbD, 9)} lb/d, balance closes = ${yn(Math.abs(r.cons.gapLbD) < 1e-9)}`);
}
w('# READ THE TWO COLUMNS TOGETHER. pinned true appears on six rows and every');
w('# one of them is out of balance. pinned false appears once and that row is');
w('# the answer. A caller handed `pinned` already has the signal that the');
w('# residual is hiding, and nothing in the module says so.');
w('');

// ============================================================ SECTION 19
w('# SECTION 19: THE STREAM MASS NOBODY COMPARES');
w('# Expert m02 l03 and l04. TEACHING. propagateStreams carries a SECOND mass for');
w('# every branch and nothing forces it to agree with the solve. wellStreams[id]');
w('# .massLbD is supplied by the caller and is never compared with wellRates[id],');
w('# so whatever hole the solve left propagates straight into the surface split.');
for (const b of T_BRANCHES) {
  const s = tStreams.branchStreams[b.id];
  if (!s) continue;
  w(`teaching stream mass, branch ${b.id} (${b.label}): the solve says ${f(Math.abs(T.res.flows[b.id]), 9)} lb/d, the stream says ${f(s.massLbD, 9)} lb/d, gap = ${f(s.massLbD - Math.abs(T.res.flows[b.id]), 9)} lb/d`);
}
w('# THE SAME SHORTFALL APPEARS ON EVERY BRANCH DOWNSTREAM OF THE PINNED WELL AND');
w('# NOTHING IN THE RESULT MENTIONS IT. The separator is told it receives the whole');
w('# of a well test on a line the solve says only passes part of it.');
w('# THE GENERAL FORM IS WORSE THAN THE SPECIFIC ONE. Hand the same network well');
w('# streams whose masses are simply wrong and the module propagates them without a');
w('# word. DERIVED sweep on the teaching network.');
for (const factor of [0.8, 0.9, 1.0, 1.1, 1.25, 2.0]) {
  const ws = Object.fromEntries(Object.entries(T_STREAMS).map(([id, s]) => [id, { ...s, massLbD: T.res.wellRates[id] * factor }]));
  const s2 = N.propagateStreams({ network: T.net, flows: T.res.flows, wellStreams: ws });
  w(`teaching stream lie, every well stream mass multiplied by ${f(factor, 2)}: ok = ${yn(s2.ok)}, trunk stream mass = ${f(s2.branchStreams.tk.massLbD, 6)} lb/d against a solved trunk of ${f(T.res.flows.tk, 6)} lb/d, warnings from the engine = none, the module does not compare them`);
}
w('# ONE COMPARISON AGAINST wellRates AT THE TOP OF THE FUNCTION WOULD CATCH BOTH');
w('# THE CALLER MISTAKE AND THE SOLVE OWN HOLE.');
w('# AND THE COMPONENT RATES ARE UNTOUCHED BY ANY OF IT. The oil, water and gas the');
w('# separator is told to expect do not move when the mass is wrong, because the');
w('# split is by mass SHARE at a junction and the shares are unchanged.');
const wsBig = Object.fromEntries(Object.entries(T_STREAMS).map(([id, s]) => [id, { ...s, massLbD: T.res.wellRates[id] * 2 }]));
const sBig = N.propagateStreams({ network: T.net, flows: T.res.flows, wellStreams: wsBig });
w(`teaching stream lie, at a doubled mass the separator oil = ${f(sBig.nodeStreams.sep.qoStbd, 9)} stb/d against ${f(tStreams.nodeStreams.sep.qoStbd, 9)} stb/d at the honest mass, a difference of ${e(sBig.nodeStreams.sep.qoStbd - tStreams.nodeStreams.sep.qoStbd, 4)} stb/d`);
w('');

// ============================================================ SECTION 20
w('# SECTION 20: THE TOLERANCE IS NOT IN LB/D');
w('# Expert m04 l01 and l02. The constant is named DEFAULT_TOLERANCE_LB_D and its');
w('# comment says "Newton stops when the worst nodal imbalance is below this,');
w('# lb/d". What the solver actually stops at is a SCALED target: it takes the');
w('# largest single well inflow evaluated at the sink pressure, calls it the scale,');
w('# and stops at the tolerance times that scale. Nothing in the return says which');
w('# criterion was in force, and the residual it reports is absolute.');
const scaleOf = (nodes, wellFn, sinkP) => Math.max(1, ...nodes.filter((x) => x.kind === 'well').map((x) => Math.abs(wellFn(x, sinkP))));
const tScale = scaleOf(T_NODES, tWellInflow, T_SEP_PSIA);
w(`teaching tolerance, the scale on AGBADA WEST = ${f(tScale, 9)} lb/d, which is the largest SINGLE well inflow evaluated at the separator pressure of ${T_SEP_PSIA} psia`);
for (const id of ['t1', 't2', 't3', 't4']) {
  w(`teaching tolerance, well ${id} evaluated at the separator pressure would make ${f(T_WELLS[id](T_SEP_PSIA), 9)} lb/d`);
}
w(`teaching tolerance, the four of them together would make ${f(['t1', 't2', 't3', 't4'].reduce((a, id) => a + T_WELLS[id](T_SEP_PSIA), 0), 9)} lb/d, and the scale uses only the largest of them`);
w(`teaching tolerance, at the module documented default of ${N.DEFAULT_TOLERANCE_LB_D} the target is actually ${e(N.DEFAULT_TOLERANCE_LB_D * tScale, 6)} lb/d, which is looser than the name promises by a factor of ${f(tScale, 6)}`);
w(`teaching tolerance, at the tolerance this digest asks for, 1e-12, the target is ${e(1e-12 * tScale, 6)} lb/d`);
w('# THAT IS DEFENSIBLE AS A DESIGN. A relative criterion is the right thing on a');
w('# system that might move a million pounds a day. The name, the comment and the');
w('# returned residual are all absolute, and nothing tells the caller which one is');
w('# in force.');
w('# AND THE SCALE IS THE LARGEST SINGLE WELL, NOT THE TOTAL, so the effective');
w('# criterion TIGHTENS as wells are added, which is the opposite of what a relative');
w('# scale is for. DERIVED on the published wells_fight ladder.');
[1, 2, 3].forEach((count, i) => {
  const wells = {}; const nodes = [{ id: 'h', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 180 }];
  for (let j = 0; j < count; j += 1) {
    const [qmax, pr] = FIGHT_SPECS[j];
    nodes.push({ id: `w${j}`, kind: 'well' }); wells[`w${j}`] = vogel(qmax, pr);
  }
  const sc = scaleOf(nodes, (nd, p) => wells[nd.id](p), 180);
  const tot = Object.keys(wells).reduce((a, id) => a + wells[id](180), 0);
  w(`derived tolerance scale, wells_fight with ${count} well${count === 1 ? '' : 's'}: scale = ${f(sc, 9)} lb/d, total inflow at the sink pressure = ${f(tot, 9)} lb/d, ratio = ${f(tot / sc, 9)}, engine iterations = ${fight[i].res.iterations}`);
});
w('# ON A FORTY WELL GATHERING SYSTEM THE TWO DIFFER BY MORE THAN AN ORDER OF');
w('# MAGNITUDE, so the criterion a caller gets depends on how many wells are on the');
w('# system and on which one of them is biggest.');
w('# DERIVED SWEEP: what a loosened tolerance actually costs, on the TEACHING');
w('# network. Read the converged column and the answer column together.');
const tRef = T.res;
for (const tol of [1e-12, 1e-10, 1e-8, 1e-6, 1e-4, 1e-3, 1e-2, 1e-1]) {
  const r = tSolve({ tolerance: tol });
  const worst = Math.max(
    Math.abs(r.res.pressures.ha - tRef.pressures.ha),
    Math.abs(r.res.pressures.hb - tRef.pressures.hb),
    Math.abs(r.res.pressures.hc - tRef.pressures.hc),
  );
  w(`teaching tolerance sweep, tolerance ${e(tol, 1)}: target = ${e(Math.max(tol, tol * tScale), 4)} lb/d, converged = ${yn(r.res.converged)}, iterations = ${r.res.iterations}, reported residual = ${e(r.res.residualLbD, 4)} lb/d, `
    + `worst junction pressure moved = ${e(worst, 4)} psi, trunk moved = ${e(r.res.flows.tk - tRef.flows.tk, 4)} lb/d, crosslink moved = ${e(r.res.flows.c2 - tRef.flows.c2, 4)} lb/d`);
}
w('# A USER WHO READS THE DEFAULT AS "A MILLIONTH OF A POUND A DAY" IS OFF BY THE');
w('# SCALE, AND A USER WHO LOOSENS IT TO "A THOUSANDTH OF A POUND A DAY" IS OFF BY');
w('# THE SCALE AGAIN AND STILL GETS converged = true.');
w('# ONE SMALLER THING RIDES ALONG. The FIRST convergence test, before the loop, is');
w('# against the raw tolerance; every test inside the loop is against the scaled');
w('# target. Since the target is never smaller than the tolerance the mismatch can');
w('# only cost a wasted Newton step and never a false convergence, but the same');
w('# criterion is spelled two different ways in one function and only one of the two');
w('# is the one that decides.');
w('');

// ============================================================ SECTION 21
w('# SECTION 21: EVERY FAILURE COMES BACK ok, AND THE MESSAGE PRINTS ZERO');
w('# Expert m04 l03 and l04. buildNetwork trains the caller to key on ok: it');
w('# refuses a stranded node, a missing sink, a duplicate id and an unknown kind,');
w('# each with ok false and a reason. solveNetwork never returns ok false except on');
w('# a singular Jacobian. It returns ok true when the iteration cap is hit, when the');
w('# line search stalls, and when the solve sits on a cusp it cannot resolve.');
w('# DERIVED SWEEP: the iteration cap on the TEACHING network. Read the ok column.');
for (const cap of [1, 2, 3, 4, 6, 8, 10, 11, 12, 30]) {
  const r = tSolve({ maxIter: cap });
  w(`teaching iteration cap, maxIter ${cap}: ok = ${yn(r.res.ok)}, converged = ${yn(r.res.converged)}, iterations run = ${r.res.iterations}, reported residual = ${e(r.res.residualLbD, 6)} lb/d, `
    + `manifold = ${f(r.res.pressures.ha, 6)} psia, trunk = ${f(r.res.flows.tk, 6)} lb/d, conservation gap = ${f(r.cons.gapLbD, 6)} lb/d`);
  w(`teaching iteration cap, maxIter ${cap}, the message the engine printed: ${lst(r.res.warnings)}`);
}
w('# AT A LOW CAP THE RETURN CARRIES A FULL SET OF PRESSURES, FLOWS AND WELL RATES');
w('# THAT LOOK EXACTLY LIKE AN ANSWER, under ok = true.');
w('# AND THE FAILURE MESSAGE PRINTS THE NUMBER IT JUST FAILED ON WITH toFixed(3).');
w('# On the one line whose whole job is to tell the user how far off the answer is,');
w('# a residual smaller than a thousandth of a pound a day reads as zero. A reader');
w('# who takes it at face value concludes the solve met its tolerance and the flag');
w('# is wrong, which is the exact opposite of the truth.');
for (const cap of [9, 10, 11]) {
  const r = tSolve({ maxIter: cap });
  if (r.res.converged) { w(`teaching toFixed, maxIter ${cap}: converged, no failure message`); continue; }
  w(`teaching toFixed, maxIter ${cap}: the true reported residual = ${e(r.res.residualLbD, 12)} lb/d`);
  w(`teaching toFixed, maxIter ${cap}: the engine printed it as "${r.res.residualLbD.toFixed(3)}" lb/d in the sentence: ${r.res.warnings.join(' ')}`);
  w(`teaching toFixed, maxIter ${cap}: toPrecision(3) would have printed ${r.res.residualLbD.toPrecision(3)} and an exponential format would have printed ${e(r.res.residualLbD, 4)}, either of which changes no arithmetic`);
}
w('# THE ONE THING THAT DOES COME BACK ok FALSE IS A SINGULAR JACOBIAN, and its');
w('# message is a real diagnosis rather than a repair.');
const singNet = N.buildNetwork({
  nodes: [{ id: 'w', kind: 'well' }, { id: 'j1', kind: 'junction' }, { id: 'j2', kind: 'junction' }, { id: 's', kind: 'sink', pressurePsia: 100 }],
  branches: [{ id: 'a', from: 'w', to: 'j1' }, { id: 'b', from: 'j1', to: 'j2' }, { id: 'c', from: 'j1', to: 's' }, { id: 'd', from: 'j2', to: 'j1' }],
});
w(`derived singular, solveLinear on a singular two by two returns ${N.solveLinear([[1, 2], [2, 4]], [1, 2])} rather than an array of infinities`);
w(`derived singular, solveLinear on a well posed two by two returns ${N.solveLinear([[2, 1], [1, 3]], [5, 10]).map((x) => f(x, 9)).join(', ')}`);
w(`derived singular, and it pivots, so a zero on the diagonal is not a failure: ${N.solveLinear([[0, 1], [1, 0]], [2, 3]).map((x) => f(x, 9)).join(', ')}`);
w('');

// ============================================================ SECTION 22
w('# SECTION 22: THE CUSP. A CONTINUOUS RELATION IS NOT ENOUGH FOR A JACOBIAN.');
w('# Expert m04 l05, and Expert m05 l01. The module contract on a branch relation is');
w('# that it must be "continuous and monotone decreasing in pTo", and it says a pipe');
w('# relation built from a characteristic curve satisfies that by construction. The');
w('# turbulent law q = k sign(dp) sqrt(|dp|) is continuous and monotone. It is NOT');
w('# differentiable at zero pressure difference, and a numerically differenced');
w('# Jacobian needs more than continuity.');
w(`teaching cusp, the Jacobian step is max(1e-3, |p| * 1e-5), which at the teaching network junction pressures is about ${f(Math.max(1e-3, Math.abs(T.res.pressures.ha) * 1e-5), 6)} psi`);
for (const b of T_BRANCHES) {
  const dp = T.res.pressures[b.from] - T.res.pressures[b.to];
  w(`teaching cusp, branch ${b.id} (${b.label}) sits at dp = ${f(dp, 9)} psi, which is ${f(Math.abs(dp) / Math.max(1e-3, Math.abs(T.res.pressures[b.from]) * 1e-5), 6)} Jacobian steps from zero`);
}
w('# WALK THE LOOP LEG UPWARD AND THE CROSSLINK IS DRIVEN TOWARDS ZERO PRESSURE');
w('# DIFFERENCE. Nothing else about the network changes. When the difference is');
w('# smaller than the step, the two central-difference evaluations straddle zero and');
w('# the entry the solver uses is a chord across a square root rather than a');
w('# derivative: it comes out as roughly the conductance over the square root of the');
w('# step, which is a function of the node own pressure rather than of the flow.');
const cuspWalk = [245, 300, 340, 360, 372, 376, 378, 380, 385, 400, 460, 600];
for (const kc3 of cuspWalk) {
  const r = tSolve({ kmap: { ...T_K, c3: kc3 } });
  w(`teaching cusp walk, loop leg conductance ${kc3} lb/d per root psi: crosslink dp = ${e(r.res.pressures.ha - r.res.pressures.hb, 6)} psi, crosslink flow = ${f(r.res.flows.c2, 6)} lb/d, `
    + `iterations = ${r.res.iterations}, converged = ${yn(r.res.converged)}, ok = ${yn(r.res.ok)}, reported residual = ${e(r.res.residualLbD, 4)} lb/d`);
}
w('# THE ITERATION COUNT CLIMBS AS THE BRANCH APPROACHES ITS OWN CUSP AND FALLS');
w('# AGAIN ONCE IT PASSES THROUGH. A branch parked near zero pressure difference is');
w('# the most expensive branch on a network to solve, and nothing in the return');
w('# points at it.');
w('# NOT A BUG IN THE MODULE SO MUCH AS AN UNSTATED PRECONDITION. The header should');
w('# say that a branch relation also has to be DIFFERENTIABLE at zero pressure');
w('# difference, or the Jacobian should widen its step when it detects a sign change');
w('# across it. Either fix is small; the contract as written invites the case.');
w('# AND THE LINE SEARCH IS WHAT SAVES IT MOST OF THE TIME. A full Newton step on a');
w('# network with a nearly dead leg will happily jump a node below atmospheric;');
w('# halving until the residual actually improves turns a divergence into a solve,');
w('# and the module tries thirty halvings before it gives up.');
const floorNet = N.buildNetwork({
  nodes: [{ id: 'w', kind: 'well' }, { id: 's', kind: 'sink', pressurePsia: 20 }],
  branches: [{ id: 'a', from: 'w', to: 's' }],
});
const floorRes = N.solveNetwork({
  network: floorNet,
  branchFlow: (b, pIn, pOut) => 5000 * (pIn - pOut),
  wellInflow: (nd, p) => N.linearWell({ qmax: 100, prPsia: 25 })(nd, p),
});
w(`published pressure floor, a weak well against a 20 psia separator through a very slack line: wellhead = ${f(floorRes.pressures.w, 9)} psia, and the module floor is ${N.MIN_PRESSURE_PSIA} psia`);
w(`published pressure floor, converged = ${yn(floorRes.converged)}, rate = ${f(floorRes.wellRates.w, 9)} lb/d, pinned = ${lst(floorRes.pinned)}`);
w('');

// ============================================================ SECTION 23
w('# SECTION 23: WHAT THE ORACLE COVERS AND WHAT IT DOES NOT');
w('# Expert m06 l01, and the honest frame for the whole tier. oracle_network.py is a');
w('# genuinely independent referee for the PHYSICS: Gauss-Seidel with a bracketed');
w('# bisection at each node, no Jacobian, no linear algebra, not even the same');
w('# iteration structure. It records NO defects at all and it publishes four clean');
w('# cases. Everything this course teaches at Expert is about the parts of the');
w('# module that no oracle touches.');
w(`golden coverage, the oracle publishes ${Object.keys(GOLD).length} cases: ${Object.keys(GOLD).join(', ')}`);
w(`golden coverage, its own conservation gaps: linear_star ${e(GOLD.linear_star.conservationGap, 4)} lb/d, turbulent_tree ${e(GOLD.turbulent_tree.conservationGap, 4)} lb/d, looped ${e(GOLD.looped.conservationGap, 4)} lb/d`);
w(`golden coverage, its sweep counts: linear_star ${GOLD.linear_star.sweeps}, turbulent_tree ${GOLD.turbulent_tree.sweeps}, looped ${GOLD.looped.sweeps}, against a cap of 4000 it never reaches`);
w('# WHAT IT NEVER TOUCHES:');
w('#   the PINNING PATH. The oracle has no concept of a pinned node; bisection on a');
w('#   flat residual simply returns a bracket endpoint. Every one of its four cases');
w('#   is a plain Vogel-plus-turbulent system in which no node can go flat.');
w('#   the CONVERGENCE TEST ITSELF. The oracle converges on how far the pressures');
w('#   MOVED between sweeps; the engine converges on a mass residual scaled by a');
w('#   factor the caller never sees. The two criteria are not comparable and the');
w('#   goldens publish neither one.');
w('#   checkConservation, diagnose and propagateStreams. The oracle computes its own');
w('#   conservation gap from its own solve and never calls the engine. It never ranks');
w('#   a bottleneck and it never propagates a stream at all.');
w('#   solveLinearNetwork. The oracle has no linear case of its own; linear_star is');
w('#   solved by the same Gauss-Seidel as everything else. The engine closed form is');
w('#   exercised only by the JS gate, on a three node star with no loop.');
w('#   pipeSchedule.js IN ITS ENTIRETY. The oracle does not import it and there is no');
w('#   Python referee for it anywhere.');
w('# WHAT THE ENGINE GATE HOLDS THE TWO ROUTES TO, so anything smaller is invisible');
w('# to the published comparison by construction:');
w('derived gate bands, turbulent_tree pressures to 5 decimals and flows to 4 decimals');
w('derived gate bands, looped pressures to 5 decimals');
w('derived gate bands, wells_fight header and rates to 4 decimals');
w('derived gate bands, linear_star Newton against the closed form at a relative 1e-12, and against the oracle to 6 decimals');
w('derived gate bands, the pipe table self consistency at 3 decimals, which is the loosest assertion in the file');
w('');

// ============================================================ SECTION 24
w('# SECTION 24: WHAT THIS MODULE REFUSES AND WHAT IT DOES NOT MODEL AT ALL');
w('# Associate m01 l03, and the closing lesson of every tier. Every capability comes');
w('# with a limit, and these are the limits stated as refusals rather than caveats.');
refusals.slice(0, 4).forEach(([what, r], i) => {
  w(`published refusal, ${what}: ${r.error}`);
});
w(`published refusal, a recirculating solved flow direction: ${recirc.error}`);
w(`published refusal, a singular Jacobian returns ok false with the message the module writes for it: "The system is singular: two or more nodes move together, so their pressures are not separately determined. That is usually a branch connected differently from the way the drawing suggests."`);
w(`published refusal, an unknown fitting id: ${P.equivalentLengthFt({ fittings: [{ id: 'reducer' }], idIn: 6, frictionFactor: 0.02 }).error}`);
w(`published refusal, an equivalent length with no bore: ${P.equivalentLengthFt({ fittings: PUB_FITTINGS }).error}`);
w('# AND WHAT IT WARNS ABOUT RATHER THAN REFUSING:');
w('derived warning, a pinned node, which is reported as a fact about the answer');
w('derived warning, a solve that stopped making progress before it met its tolerance');
w('derived warning, a solve that ran its iteration cap without meeting its tolerance');
w('# WHAT THE MODULE DOES NOT MODEL AT ALL, so no number in this file speaks to it:');
w('# the pipe hydraulics themselves, which are a callback the consumer supplies;');
w('# the well inflow, which is another callback; temperature anywhere, so no');
w('# thermal coupling and no cooldown; slugging, holdup and any transient at all,');
w('# because every equation here is steady state; compressibility along a branch,');
w('# since mass in equals mass out on every branch by construction; any equipment');
w('# between nodes, so no pump, no compressor and no choke as a node kind; a');
w('# separator that does anything but accept whatever arrives at a fixed pressure;');
w('# and the pipe wall, the burial and the insulation, which live in other modules');
w('# entirely.');
w('# THE THREE NODE KINDS ARE THE WHOLE VOCABULARY. A well injects and its pressure');
w('# is unknown. A junction injects nothing and everything that arrives leaves. A');
w('# sink has a FIXED pressure and takes whatever arrives. Anything a real gathering');
w('# system has that is not one of those three has to be written as a branch');
w('# relation or left out.');
w('');
w('# END OF DIGEST');
console.log(out.join('\n'));
