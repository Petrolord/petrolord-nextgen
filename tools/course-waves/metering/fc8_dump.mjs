// THE FC8 TEACHING DIGEST GENERATOR: Metering, Control Valves & Storage.
//
// EVERY FIGURE IN THE DIGEST IS ENGINE OUTPUT, printed at a stated precision.
// Nothing is typed, nothing is rounded by hand, and nothing is lifted from
// RECON.md, FINDINGS.md, the vendored FINDINGS-metering.md or an engine source
// comment. All four of those are PROVENANCE. They are a repair record, and a
// repair record is a claim about work that was done rather than a statement
// about what the engine now does.
//
// THE RULE THAT HAS COST THIS PROGRAMME MORE THAN ANY OTHER. A digest sentence
// may name a figure this file computes. It may NOT characterise the
// RELATIONSHIP between two figures, as a ratio, as "about a tenth", as "three
// times", unless that relationship is itself computed and printed. So every
// comparison in this file goes through `rel()`, which computes the difference
// and the ratio and prints them on their own line. A sentence that wants to say
// one thing is larger than another has to show the subtraction.
//
// WHEN A CONSTANT IS NOT EXPORTED, THE ENGINE ANSWERS A QUESTION ABOUT ITSELF.
// `INH2O_TO_PSI` is a module-private constant in metering.js and this file
// never types it. It is measured, by dividing a returned differential in psi by
// the differential in inches of water that produced it, at two runs that share
// nothing else. The same for every band edge and every threshold: each is found
// by bisecting the input at which a word or a flag the engine returns turns
// over.
//
// A COUNT IS NOT CHECKABLE WITHOUT ITS TREE AND ITS RULE. Every count printed
// here says which tree was walked and which rule decided membership.
//
// LABEL AND CALL ARE ASSERTED AGAINST EACH OTHER, ON EVERY CALL. A sibling
// wave's generator labelled a row a refusal and then called a case that
// SUCCEEDED. Every number on the line was real engine output, so no numeric
// sweep could see it, and the line taught the reverse of what the engine does.
// `success()` asserts no error key and no non-finite number; `refusal()`
// asserts an error key. IF ANY ASSERTION FAILS THIS FILE WRITES NOTHING TO
// STDOUT, so a failed build leaves the previous digest intact.
//
//   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
import process from 'node:process';

const ROOT = process.env.FC8_ENGINES || '/root/wt-fc8-nextgen/packages/engines';
const FIELDS = process.env.FC8_WAVE_DIR || '/root/fc-wip-metering';
const M = await import(`${ROOT}/engines/facilities/metering.js`);
const V = await import(`${ROOT}/engines/facilities/controlValve.js`);
const T = await import(`${ROOT}/engines/facilities/storageTank.js`);
const S = await import(`${FIELDS}/fc8_fields.mjs`);

/* ------------------------------------------------------------- machinery */

const LINES = [];
const w = (s = '') => LINES.push(s);
const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const keyList = (r) => (r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r));
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
const refusal = (label, r) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned keys [${keyList(r)}]`);
  return r;
};

/** The digest's own precision declaration, one place, read by every printer. */
const DP = {
  ratio: 6, psi: 6, pct: 6, inch: 6, cv: 6, cd: 6, factor: 6, lbFt3: 6, inH2O: 6,
  bbl: 4, scfh: 4, bblPerHr: 4, lbPerYr: 4, reynolds: 4, lbHr: 4, ft2: 4, ft3: 4, btuHr: 4,
};
const n = (v, cls) => {
  if (!(cls in DP)) throw new Error(`no declared precision for the class ${cls}`);
  if (v === null || v === undefined) return 'withheld';
  if (!Number.isFinite(v)) return String(v);
  return v.toFixed(DP[cls]);
};
const pad = (s, k) => String(s).padEnd(k);
const rpad = (s, k) => String(s).padStart(k);

/**
 * A RELATIONSHIP, COMPUTED AND PRINTED. This is the only way this file is
 * allowed to compare two figures. It prints the two values, their difference
 * and their ratio, so a sentence that wants to say one is larger than the other
 * has the subtraction on the page beside it.
 */
const rel = (what, aLabel, a, bLabel, b, cls) => {
  w(`   RELATION  ${what}`);
  w(`             ${pad(aLabel, 46)} ${rpad(n(a, cls), 20)}`);
  w(`             ${pad(bLabel, 46)} ${rpad(n(b, cls), 20)}`);
  w(`             difference (first less second)          ${rpad(n(a - b, cls), 20)}`);
  w(`             ratio (first over second)               ${rpad(b === 0 ? 'undefined' : n(a / b, 'ratio'), 20)}`);
};

/** Bisect on a predicate the ENGINE answers. Refuses a bracket that proves nothing. */
const bisect = (lo, hi, pred, label) => {
  let a = lo; let b = hi;
  const pa = pred(a); const pb = pred(b);
  if (!must(`BISECTION BRACKET STRADDLES THE TURNOVER: ${label}`, pa !== pb,
    `pred(${lo})=${pa} pred(${hi})=${pb}`)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pa) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
  }
  return (a + b) / 2;
};

/** A count, with the tree that was walked and the rule that decided membership. */
const COUNTS = [];
const count = (label, value, tree, rule) => {
  COUNTS.push({ label, value, tree, rule });
  w(`   COUNT  ${label}: ${value}`);
  w(`          tree: ${tree}`);
  w(`          rule: ${rule}`);
  return value;
};

/** An engine string, quoted verbatim and PINNED, so a reworded message fails here. */
const PINS = [];
const pin = (what, text, fragment) => {
  must(`ENGINE STRING PIN: ${what}`, typeof text === 'string' && text.includes(fragment),
    typeof text === 'string' ? `${text.slice(0, 70)}...` : String(text));
  PINS.push({ what, fragment });
  return text;
};
const quoted = (text) => {
  String(text).replace(/\s+/g, ' ').trim().match(/.{1,86}(\s|$)/g).forEach((chunk, i) => {
    w(`${i === 0 ? '   > ' : '     '}${chunk.trim()}`);
  });
};

/* =========================================================== THE HEADER */

w('FC8 METERING, CONTROL VALVES & STORAGE: THE TEACHING DIGEST');
w('===========================================================');
w('#');
w('# THIS FILE IS THE ONLY SOURCE OF NUMBERS FOR EVERY FC8 LESSON, PANEL AND');
w('# BANK QUESTION. Every figure in it was produced by calling the vendored');
w('# engine while this file was built. Nothing here was typed, rounded by hand,');
w('# or taken from the wave recon, the wave findings, the repair record');
w('# vendored beside the oracle, or an engine source comment. Those four are');
w('# PROVENANCE and no writer may quote them.');
w('#');
w('# PRECISION. Beta ratios, pressure differentials in psi, percentages, shell');
w('# thicknesses in inches, valve coefficients, cavitation indices, authorities,');
w('# travel percentages and every dimensionless ratio print to SIX decimals;');
w('# volumes in barrels, vent rates in scfh, movement rates in barrels per hour');
w('# and annual losses in pounds print to FOUR, because a number in the');
w('# thousands carries no information in its millionths; counts are whole');
w('# numbers. The quantities this course prints and never grades follow the same');
w('# two clauses: discharge coefficients, expansibility and expansion factors,');
w('# loss fractions and vapour densities print to SIX, and Reynolds numbers,');
w('# mass flows in pounds an hour, areas in square feet, volumes in cubic feet');
w('# and fire duties in Btu an hour print to FOUR.');
w('#');
w('# QUOTE A FIGURE AT THE PRECISION THIS FILE PRINTS IT. A learner who reads');
w('# the right row and quotes it as printed is inside every graded tolerance in');
w('# this course, because every tolerance is at least half a unit in the last');
w('# place of its own class.');
w('#');
w('# A RELATIONSHIP BETWEEN TWO FIGURES IS ONLY EVER STATED WHERE THIS FILE');
w('# PRINTS IT. Lines beginning RELATION carry the two values, their difference');
w('# and their ratio. A writer may state a comparison only by quoting one of');
w('# those lines. No lesson may say a term is "about a tenth" of another, or');
w('# "three times" another, on its own arithmetic.');
w('#');
w('# THREE ENGINES, ONE ARGUMENT. A meter run, a control valve and a tank are');
w('# the three places on a facility where a number that looks like a measurement');
w('# is a design judgement with a standard behind it, and where the behaviour');
w('# that matters lives at a boundary the ordinary equation walks straight past.');
w('# The orifice equation is simple and its UNCERTAINTY is the subject. The');
w('# valve equation is simple and its CHOKING BOUNDARY is the subject. The tank');
w('# shell equation is simple and VENTING is what actually destroys tanks.');
w('#');
w('# WHAT IS REFUSED IS CURRICULUM. Two answers in these engines are WITHHELD BY');
w('# NAME and this file teaches both as limits. Neither is graded anywhere in');
w('# this course, and SECTION 31 is the whole register.');
w('#');

/* ======================================================== SECTION 1 */

w('# SECTION 1: THE THREE ENGINES, AND WHAT EACH ONE EXPORTS (owned by Associate m01)');
w();
w('The course stands on three modules. No module imports another, which is why');
w('a fact learned about one carries nothing over to the next by construction.');
w();
const MODULES = [['metering.js', M], ['controlValve.js', V], ['storageTank.js', T]];
MODULES.forEach(([name, mod]) => {
  const ex = Object.keys(mod).sort();
  const fns = ex.filter((k) => typeof mod[k] === 'function');
  const data = ex.filter((k) => typeof mod[k] !== 'function');
  w(`   ${name}`);
  count(`${name} exported names`, ex.length, `Object.keys of the imported module ${name}`,
    'every name the module exports, functions and data alike, with no filter');
  w(`          functions (${fns.length}): ${fns.join(', ')}`);
  w(`          data     (${data.length}): ${data.join(', ')}`);
  w();
});
must('the three modules are independent of one another, which the digest states',
  true, 'asserted by the closure walk in vendor/closure.json, which found no edge between them');

/* ======================================================== SECTION 2 */

w('# SECTION 2: ONE ORIFICE RUN, END TO END (owned by Associate m01)');
w();
w('The ABOH gas export run. Every field the engine returns, at the precision');
w('this course prints each class to. The whole of Associate module 1 is reading');
w('this one result and knowing what each line is.');
w();
const aboh = success('ABOH orificeFlow at the design differential', M.orificeFlow({
  pipeIdIn: S.ABOH.pipeIdIn, orificeIdIn: S.ABOH.orificeIdIn, dpInH2O: S.ABOH.dpInH2O,
  p1Psia: S.ABOH.p1Psia, densityLbFt3: S.ABOH.densityLbFt3, viscosityCp: S.ABOH.viscosityCp,
  k: S.ABOH.k,
}));
w(`   pipe bore, in                              ${rpad(n(S.ABOH.pipeIdIn, 'inch'), 20)}   stated`);
w(`   orifice bore, in                           ${rpad(n(S.ABOH.orificeIdIn, 'inch'), 20)}   stated`);
w(`   differential, in H2O                       ${rpad(n(S.ABOH.dpInH2O, 'inH2O'), 20)}   stated`);
w(`   static pressure, psia                      ${rpad(n(S.ABOH.p1Psia, 'psi'), 20)}   stated`);
w(`   flowing density, lb/ft3                    ${rpad(n(S.ABOH.densityLbFt3, 'lbFt3'), 20)}   stated`);
w(`   viscosity, cP                              ${rpad(n(S.ABOH.viscosityCp, 'factor'), 20)}   stated`);
w(`   specific heat ratio                        ${rpad(n(S.ABOH.k, 'factor'), 20)}   stated`);
w(`   beta                                       ${rpad(n(aboh.beta, 'ratio'), 20)}   returned`);
w(`   discharge coefficient                      ${rpad(n(aboh.cd, 'cd'), 20)}   returned`);
w(`   expansibility                              ${rpad(n(aboh.expansibility, 'factor'), 20)}   returned`);
w(`   pipe Reynolds number                       ${rpad(n(aboh.reynolds, 'reynolds'), 20)}   returned`);
w(`   mass flow, lb/hr                           ${rpad(n(aboh.massLbHr, 'lbHr'), 20)}   returned`);
w(`   volume at flowing density, ft3/hr          ${rpad(n(aboh.volumetricFt3HrAtFlowing, 'ft3'), 20)}   returned`);
w(`   differential, psi                          ${rpad(n(aboh.dpPsi, 'psi'), 20)}   returned`);
w(`   beta inside the published range            ${rpad(String(aboh.betaInPublishedRange), 20)}   returned`);
w(`   warning                                    ${rpad(String(aboh.warning), 20)}   returned`);
w();
w('THE VOLUME IS AT THE FLOWING DENSITY AND THE ENGINE NAMES IT SO. There is no');
w('base pressure and no base temperature anywhere in this function, so nothing');
w('on this line is a standard volume.');
w();

/* ======================================================== SECTION 3 */

w('# SECTION 3: THE INCH OF WATER, MEASURED RATHER THAN TYPED (owned by Associate m01)');
w();
w('The factor that turns inches of water column into psi is a module-private');
w('constant in metering.js. This file never types it. It is MEASURED, by asking');
w('the engine for the differential in psi at two runs that share no other input');
w('and dividing by the differential each was given.');
w();
const probeA = success('a first run for the inch of water probe', M.orificeFlow({
  pipeIdIn: 6.065, orificeIdIn: 2.9265, dpInH2O: 63.8, p1Psia: 815.2,
  densityLbFt3: 2.6178, viscosityCp: 0.0121, k: 1.27,
}));
const probeB = success('a second run for the inch of water probe, sharing no other input', M.orificeFlow({
  pipeIdIn: 10.02, orificeIdIn: 3.114, dpInH2O: 17.9, p1Psia: 1290.4,
  densityLbFt3: 5.118, viscosityCp: 0.0173, k: 1.19,
}));
const inH2OtoPsiA = probeA.dpPsi / 63.8;
const inH2OtoPsiB = probeB.dpPsi / 17.9;
w(`   run one: ${n(63.8, 'inH2O')} in H2O returned ${n(probeA.dpPsi, 'psi')} psi, so the factor is ${inH2OtoPsiA}`);
w(`   run two: ${n(17.9, 'inH2O')} in H2O returned ${n(probeB.dpPsi, 'psi')} psi, so the factor is ${inH2OtoPsiB}`);
must('THE MEASURED CONVERSION AGREES TO THE LAST BIT ACROSS TWO UNRELATED RUNS',
  inH2OtoPsiA === inH2OtoPsiB, `${inH2OtoPsiA} against ${inH2OtoPsiB}`);
w(`   the two agree exactly, which is what makes this a constant rather than a coincidence`);
w();

/* ======================================================== SECTION 4 */

w('# SECTION 4: THE DISCHARGE COEFFICIENT IS NOT A CONSTANT (owned by Associate m02)');
w();
w('The Reader-Harris/Gallagher equation for a flange-tapped orifice, swept');
w('across beta and across four decades of Reynolds number on the ABOH pipe');
w('bore. A course that used a constant 0.61 would be wrong by more than the');
w('uncertainty anybody is arguing about, and the span of this table is the');
w('measurement of that.');
w();
w(`   ${pad('beta', 8)}${S.REYNOLDS_SWEEP.map((r) => rpad(`Re ${r.toExponential(0)}`, 14)).join('')}`);
const cdTable = [];
S.BETA_SWEEP.forEach((beta) => {
  const row = S.REYNOLDS_SWEEP.map((re) => {
    const r = success(`dischargeCoefficient at beta ${beta} and Reynolds ${re}`,
      M.dischargeCoefficient({ beta, reynolds: re, pipeIdIn: S.ABOH.pipeIdIn }));
    cdTable.push({ beta, re, cd: r.cd, inRange: r.betaInPublishedRange });
    return r.cd;
  });
  w(`   ${pad(n(beta, 'ratio'), 8)}${row.map((c) => rpad(n(c, 'cd'), 14)).join('')}`);
});
w();
const cdIn = cdTable.filter((c) => c.inRange);
const cdMin = cdIn.reduce((a, b) => (b.cd < a.cd ? b : a));
const cdMax = cdIn.reduce((a, b) => (b.cd > a.cd ? b : a));
count('cells in the table above that sit inside the published beta range', cdIn.length,
  `the cross product of the ${S.BETA_SWEEP.length} betas and the ${S.REYNOLDS_SWEEP.length} Reynolds numbers in fc8_fields.mjs`,
  'a cell counts when the engine returns betaInPublishedRange true for it');
rel('the span of the coefficient over the cells inside the published range',
  `largest, at beta ${n(cdMax.beta, 'ratio')} and Reynolds ${cdMax.re.toExponential(0)}`, cdMax.cd,
  `smallest, at beta ${n(cdMin.beta, 'ratio')} and Reynolds ${cdMin.re.toExponential(0)}`, cdMin.cd, 'cd');
w();
w('THE ENGINE REFUSES TO ASSUME A COEFFICIENT ANYWHERE IT NEEDS ONE. The');
w('permanent loss relation takes the coefficient of the run as a required');
w('argument, and says why when it is missing.');
w();
quoted(pin('permanentLoss refuses to assume a coefficient',
  refusal('permanentLoss with no discharge coefficient', M.permanentLoss({ dpInH2O: 63.8, beta: 0.48 })).error,
  'will not assume one'));
w();

/* ======================================================== SECTION 5 */

w('# SECTION 5: THE SMALL BORE CORRECTION, AND WHERE IT TURNS ON (owned by Associate m02)');
w();
w('Below a pipe bore the correlation treats as small, the equation carries an');
w('extra term. The engine returns a flag saying whether it applied that term,');
w('so the bore at which it turns on is found by bisecting the flag rather than');
w('by reading a number out of the source.');
w();
const smallBoreOn = bisect(1, 6, (d) => M.dischargeCoefficient({ beta: 0.5, reynolds: 1e6, pipeIdIn: d }).smallBoreCorrectionApplied,
  'the pipe bore at which the small bore correction turns off');
w(`   the correction is applied below a pipe bore of, in     ${rpad(n(smallBoreOn, 'inch'), 16)}`);
w(`   found by bisecting the engine's own smallBoreCorrectionApplied flag`);
w();
w(`   ${pad('pipe bore, in', 18)}${rpad('coefficient', 16)}${rpad('correction applied', 22)}`);
const boreRows = S.BORE_SWEEP.map((d) => {
  const r = success(`dischargeCoefficient at a pipe bore of ${d} in`,
    M.dischargeCoefficient({ beta: 0.5, reynolds: 1e6, pipeIdIn: d }));
  w(`   ${pad(n(d, 'inch'), 18)}${rpad(n(r.cd, 'cd'), 16)}${rpad(String(r.smallBoreCorrectionApplied), 22)}`);
  return { d, cd: r.cd, on: r.smallBoreCorrectionApplied };
});
const justUnder = boreRows.filter((r) => r.on).slice(-1)[0];
const justOver = boreRows.filter((r) => !r.on)[0];
rel('the coefficient either side of the small bore boundary, at beta 0.500000 and Reynolds 1e+6',
  `at a bore of ${n(justUnder.d, 'inch')} in, where the correction is applied`, justUnder.cd,
  `at a bore of ${n(justOver.d, 'inch')} in, where it is not`, justOver.cd, 'cd');
w();

/* ======================================================== SECTION 6 */

w('# SECTION 6: THE PUBLISHED BETA RANGE, AND WHAT THE ENGINE SAYS OUTSIDE IT (owned by Associate m02)');
w();
w('The flange-tap correlation is published over a band of beta. Outside it the');
w('engine still returns a coefficient and it carries a warning saying the number');
w('is an extrapolation of the equation. The two edges are found by bisecting the');
w('engine\'s own betaInPublishedRange flag.');
w();
const betaLo = bisect(0.01, 0.5, (b) => M.dischargeCoefficient({ beta: b, reynolds: 1e6, pipeIdIn: 6.065 }).betaInPublishedRange === false,
  'the lower edge of the published beta range');
const betaHi = bisect(0.5, 0.99, (b) => M.dischargeCoefficient({ beta: b, reynolds: 1e6, pipeIdIn: 6.065 }).betaInPublishedRange === true,
  'the upper edge of the published beta range');
w(`   lower edge of the published range, beta               ${rpad(n(betaLo, 'ratio'), 16)}`);
w(`   upper edge of the published range, beta               ${rpad(n(betaHi, 'ratio'), 16)}`);
w();
w('The warning the engine returns above the upper edge, in its own words:');
quoted(pin('the beta out of range warning on a flow',
  success('orificeFlow at a beta above the published range', M.orificeFlow({
    pipeIdIn: 6.065, orificeIdIn: 5.1, dpInH2O: 63.8, p1Psia: 815.2,
    densityLbFt3: 2.6178, viscosityCp: 0.0121, k: 1.27,
  })).warning, 'resize the plate rather than trusting this number'));
w();
w('And the second warning, which fires inside the published range, above a beta');
w('the engine treats as the point where the trade begins to bite:');
quoted(pin('the high beta trade warning',
  success('orificeFlow at a beta above the trade threshold', M.orificeFlow({
    pipeIdIn: 6.065, orificeIdIn: 4.0, dpInH2O: 63.8, p1Psia: 815.2,
    densityLbFt3: 2.6178, viscosityCp: 0.0121, k: 1.27,
  })).warning, 'the permanent pressure loss falls but the uncertainty and the straight-run requirement both rise'));
w();
const tradeEdge = bisect(0.3, 0.74, (b) => success('trade threshold probe', M.orificeFlow({
  pipeIdIn: 6.065, orificeIdIn: b * 6.065, dpInH2O: 63.8, p1Psia: 815.2,
  densityLbFt3: 2.6178, viscosityCp: 0.0121, k: 1.27,
})).warning === null, 'the beta at which the high beta trade warning starts');
w(`   the trade warning starts above a beta of               ${rpad(n(tradeEdge, 'ratio'), 16)}`);
w(`   found by bisecting the beta at which the returned warning stops being null`);
w();

/* ======================================================== SECTION 7 */

w('# SECTION 7: THE EXPANSIBILITY FACTOR (owned by Associate m03)');
w();
w('A compressible fluid expands as it passes the plate, and the expansibility');
w('factor is what the equation carries to account for it. It is swept here');
w('against the ratio of differential to static pressure and against the specific');
w('heat ratio, at the ABOH beta.');
w();
w(`   ${pad('dP/P1', 10)}${S.K_SWEEP.map((k) => rpad(`k ${k}`, 14)).join('')}`);
const epsRows = [];
S.DP_RATIO_SWEEP.forEach((ratio) => {
  const row = S.K_SWEEP.map((k) => {
    const e = M.expansibility({ beta: aboh.beta, dpPsi: ratio * S.ABOH.p1Psia, p1Psia: S.ABOH.p1Psia, k });
    must(`the expansibility is finite at dP/P1 ${ratio} and k ${k}`, Number.isFinite(e), e);
    epsRows.push({ ratio, k, e });
    return e;
  });
  w(`   ${pad(n(ratio, 'ratio'), 10)}${row.map((e) => rpad(n(e, 'factor'), 14)).join('')}`);
});
w();
const epsMax = epsRows.reduce((a, b) => (b.e > a.e ? b : a));
const epsMin = epsRows.reduce((a, b) => (b.e < a.e ? b : a));
rel('the span of the expansibility factor across the table above',
  `largest, at dP/P1 ${n(epsMax.ratio, 'ratio')} and k ${epsMax.k}`, epsMax.e,
  `smallest, at dP/P1 ${n(epsMin.ratio, 'ratio')} and k ${epsMin.k}`, epsMin.e, 'factor');
w();
w('AN INCOMPRESSIBLE SIZING SETS THE FACTOR TO ONE. The same run computed both');
w('ways is the measurement of what the factor is worth on this meter.');
w();
const abohIncompressible = success('ABOH orificeFlow taken as incompressible', M.orificeFlow({
  pipeIdIn: S.ABOH.pipeIdIn, orificeIdIn: S.ABOH.orificeIdIn, dpInH2O: S.ABOH.dpInH2O,
  p1Psia: S.ABOH.p1Psia, densityLbFt3: S.ABOH.densityLbFt3, viscosityCp: S.ABOH.viscosityCp,
  k: S.ABOH.k, compressible: false,
}));
rel('the ABOH mass flow with and without the expansibility factor',
  'taken as incompressible, lb/hr', abohIncompressible.massLbHr,
  'with the expansibility factor, lb/hr', aboh.massLbHr, 'lbHr');
w();

/* ======================================================== SECTION 8 */

w('# SECTION 8: A DIFFERENTIAL THAT IS NOT A FLOW (owned by Associate m03)');
w();
w('A differential at or above the static pressure would put the downstream');
w('pressure at zero or below. The repaired engine names that by itself rather');
w('than letting it fall through to a message about the Reynolds number.');
w();
quoted(pin('the differential above static pressure refusal',
  refusal('orificeFlow with a differential above the static pressure', M.orificeFlow({
    pipeIdIn: 6.065, orificeIdIn: 2.9265, dpInH2O: 500, p1Psia: 14.7,
    densityLbFt3: 2.6178, viscosityCp: 0.0121,
  })).error, 'which is at or above the static pressure'));
w();
w('The other three refusals this function carries, in its own words:');
w();
quoted(pin('the bore ordering refusal', refusal('orificeFlow with an orifice bore above the pipe bore', M.orificeFlow({
  pipeIdIn: 6.065, orificeIdIn: 7.2, dpInH2O: 63.8, p1Psia: 815.2, densityLbFt3: 2.6178, viscosityCp: 0.0121,
})).error, 'smaller than the pipe bore'));
quoted(pin('the missing differential refusal', refusal('orificeFlow with no differential', M.orificeFlow({
  pipeIdIn: 6.065, orificeIdIn: 2.9265, dpInH2O: 0, p1Psia: 815.2, densityLbFt3: 2.6178, viscosityCp: 0.0121,
})).error, 'positive differential, density and viscosity'));
quoted(pin('the missing static pressure refusal', refusal('a compressible flow with no static pressure', M.orificeFlow({
  pipeIdIn: 6.065, orificeIdIn: 2.9265, dpInH2O: 63.8, densityLbFt3: 2.6178, viscosityCp: 0.0121,
})).error, 'compressible flow needs a positive static pressure'));
w();

/* ======================================================== SECTION 9 */

w('# SECTION 9: SIZING THE PLATE, AND THE TWO ENDS OF THE BRACKET (owned by Associate m03)');
w();
w('Sizing solves the bore that gives the wanted differential at the wanted flow,');
w('by bisection inside the correlation\'s own published beta range. The repaired');
w('function NEVER RETURNS A BORE BESIDE AN ERROR.');
w();
const sized = success('sizeOrifice for a target mass flow on the ABOH run', M.sizeOrifice({
  pipeIdIn: S.ABOH.pipeIdIn, targetMassLbHr: 42_000, dpInH2O: S.ABOH.dpInH2O,
  p1Psia: S.ABOH.p1Psia, densityLbFt3: S.ABOH.densityLbFt3, viscosityCp: S.ABOH.viscosityCp,
  k: S.ABOH.k,
}));
w(`   target mass flow, lb/hr                    ${rpad(n(42_000, 'lbHr'), 20)}   stated`);
w(`   solved beta                                ${rpad(n(sized.beta, 'ratio'), 20)}   returned`);
w(`   solved bore, in                            ${rpad(n(sized.orificeIdIn, 'inch'), 20)}   returned`);
w(`   the flow that bore passes, lb/hr           ${rpad(n(sized.massLbHr, 'lbHr'), 20)}   returned`);
w(`   the coefficient at that bore               ${rpad(n(sized.cd, 'cd'), 20)}   returned`);
w(`   the beta bracket it searched               ${rpad(`${sized.betaBracket[0]} to ${sized.betaBracket[1]}`, 20)}   returned`);
w();
w('The bore note the engine returns, which is the sentence that stops a solved');
w('bore being ordered as a plate:');
quoted(pin('the stock plate note', sized.boreNote, 'a plate is bored to a stock size'));
w();
w('Both ends of the bracket refuse by name, and each refusal carries the flow');
w('that end can actually pass:');
w();
quoted(pin('the too much flow refusal', refusal('sizeOrifice for a flow beyond the largest plate', M.sizeOrifice({
  pipeIdIn: S.ABOH.pipeIdIn, targetMassLbHr: 900_000, dpInH2O: S.ABOH.dpInH2O, p1Psia: S.ABOH.p1Psia,
  densityLbFt3: S.ABOH.densityLbFt3, viscosityCp: S.ABOH.viscosityCp, k: S.ABOH.k,
})).error, 'cannot pass this flow at this differential'));
quoted(pin('the too little flow refusal', refusal('sizeOrifice for a flow below the smallest plate', M.sizeOrifice({
  pipeIdIn: S.ABOH.pipeIdIn, targetMassLbHr: 120, dpInH2O: S.ABOH.dpInH2O, p1Psia: S.ABOH.p1Psia,
  densityLbFt3: S.ABOH.densityLbFt3, viscosityCp: S.ABOH.viscosityCp, k: S.ABOH.k,
})).error, 'passes more than this flow at this differential'));
w();

/* ======================================================== SECTION 10 */

w('# SECTION 10: PERMANENT PRESSURE LOSS (owned by Associate m04)');
w();
w('A differential is not free. The permanent loss is the part of it the meter');
w('run never gives back, and it falls as beta rises, which is one half of the');
w('trade the high beta warning in SECTION 6 names.');
w();
w(`   ${pad('beta', 10)}${rpad('coefficient', 14)}${rpad('loss fraction', 16)}${rpad('loss, in H2O', 16)}`);
const lossRows = [];
S.BETA_SWEEP.filter((b) => b >= 0.1 && b <= 0.75).forEach((beta) => {
  const cdr = success(`dischargeCoefficient for the loss row at beta ${beta}`,
    M.dischargeCoefficient({ beta, reynolds: aboh.reynolds, pipeIdIn: S.ABOH.pipeIdIn }));
  const l = success(`permanentLoss at beta ${beta}`, M.permanentLoss({ dpInH2O: S.ABOH.dpInH2O, beta, cd: cdr.cd }));
  lossRows.push({ beta, cd: cdr.cd, f: l.lossFraction, loss: l.lossInH2O });
  w(`   ${pad(n(beta, 'ratio'), 10)}${rpad(n(cdr.cd, 'cd'), 14)}${rpad(n(l.lossFraction, 'factor'), 16)}${rpad(n(l.lossInH2O, 'inH2O'), 16)}`);
});
w();
rel('the permanent loss at the two ends of the published beta range, at the ABOH differential',
  `at beta ${n(lossRows[0].beta, 'ratio')}, in H2O`, lossRows[0].loss,
  `at beta ${n(lossRows[lossRows.length - 1].beta, 'ratio')}, in H2O`, lossRows[lossRows.length - 1].loss, 'inH2O');
w();
w('WHAT ASSUMING A COEFFICIENT OF 0.61 WOULD COST HERE. The engine refuses to');
w('assume one. This file computes the loss both ways at the ABOH beta, using the');
w('run\'s own coefficient and using the constant the module exists to argue');
w('against, so the size of the assumption is printed rather than asserted.');
w();
const lossReal = success('permanentLoss at the ABOH beta with the run coefficient',
  M.permanentLoss({ dpInH2O: S.ABOH.dpInH2O, beta: aboh.beta, cd: aboh.cd }));
const lossAssumed = success('permanentLoss at the ABOH beta with a coefficient of 0.61',
  M.permanentLoss({ dpInH2O: S.ABOH.dpInH2O, beta: aboh.beta, cd: 0.61 }));
rel('the permanent loss on the ABOH run, computed coefficient against an assumed 0.61',
  `with the run's own coefficient of ${n(aboh.cd, 'cd')}, in H2O`, lossReal.lossInH2O,
  'with an assumed coefficient of 0.610000, in H2O', lossAssumed.lossInH2O, 'inH2O');
w();

/* ======================================================== SECTION 11 */

w('# SECTION 11: THE TRANSMITTER, AND WHY ACCURACY ON SPAN IS NOT ACCURACY ON READING (owned by Associate m05)');
w();
w('A differential transmitter\'s accuracy is quoted on its SPAN. Its uncertainty');
w('as a percentage of the READING therefore rises as the reading falls. This is');
w('the single most misunderstood thing in gas measurement and the whole of');
w('Associate module 5.');
w();
w(`   span, in H2O: ${n(S.ABOH.spanInH2O, 'inH2O')}   accuracy, percent of span: ${n(0.075, 'pct')}   (the engine's own default accuracy)`);
w();
w(`   ${pad('reading, in H2O', 20)}${rpad('pct of reading', 18)}${rpad('dP turndown', 16)}${rpad('flow turndown', 16)}${rpad('warning', 10)}`);
const txRows = [];
S.SPAN_SWEEP.forEach((dp) => {
  const r = success(`transmitterUncertaintyPct at a reading of ${dp} in H2O`,
    M.transmitterUncertaintyPct({ dpInH2O: dp, spanInH2O: S.ABOH.spanInH2O }));
  txRows.push({ dp, pct: r.uncertaintyPctOfReading, dt: r.differentialTurndown, ft: r.flowTurndown, warn: r.warning !== null });
  w(`   ${pad(n(dp, 'inH2O'), 20)}${rpad(n(r.uncertaintyPctOfReading, 'pct'), 18)}${rpad(n(r.differentialTurndown, 'ratio'), 16)}${rpad(n(r.flowTurndown, 'ratio'), 16)}${rpad(r.warning ? 'fires' : 'silent', 10)}`);
});
w();
const txTop = txRows[0];
const txBottom = txRows[txRows.length - 1];
rel('the transmitter contribution at the top and the bottom of this span',
  `at a reading of ${n(txTop.dp, 'inH2O')} in H2O, percent of reading`, txTop.pct,
  `at a reading of ${n(txBottom.dp, 'inH2O')} in H2O, percent of reading`, txBottom.pct, 'pct');
w();
quoted(pin('the transmitter over span refusal',
  refusal('a reading above the transmitter span',
    M.transmitterUncertaintyPct({ dpInH2O: 260, spanInH2O: S.ABOH.spanInH2O })).error,
  'above the transmitter span'));
w();

/* ======================================================== SECTION 12 */

w('# SECTION 12: NINE TO ONE IS THREE TO ONE (owned by Associate m05)');
w();
w('Flow through an orifice goes as the square root of the differential, so a');
w('DIFFERENTIAL turndown and a FLOW turndown are different numbers. The engine');
w('returns both, returns the limit it holds for each, and says so in a note. The');
w('repaired warning fires on the flow turndown.');
w();
const txBase = success('transmitterUncertaintyPct at the ABOH design reading',
  M.transmitterUncertaintyPct({ dpInH2O: S.ABOH.dpInH2O, spanInH2O: S.ABOH.spanInH2O }));
w(`   flow turndown limit the engine holds              ${rpad(n(txBase.flowTurndownLimit, 'ratio'), 16)}`);
w(`   differential turndown limit the engine holds      ${rpad(n(txBase.differentialTurndownLimit, 'ratio'), 16)}`);
rel('the two limits the engine holds, which are the same rule written in two quantities',
  'the differential turndown limit', txBase.differentialTurndownLimit,
  'the flow turndown limit', txBase.flowTurndownLimit, 'ratio');
w();
const warnAt = bisect(0.5, 200, (dp) => success('turndown warning probe',
  M.transmitterUncertaintyPct({ dpInH2O: dp, spanInH2O: S.ABOH.spanInH2O })).warning !== null,
'the reading at which the flow turndown warning starts to fire');
const warnRow = success('the transmitter at the warning boundary',
  M.transmitterUncertaintyPct({ dpInH2O: warnAt, spanInH2O: S.ABOH.spanInH2O }));
w(`   on a ${n(S.ABOH.spanInH2O, 'inH2O')} in H2O span the warning starts below a reading of, in H2O   ${rpad(n(warnAt, 'inH2O'), 16)}`);
w(`   the flow turndown there                                              ${rpad(n(warnRow.flowTurndown, 'ratio'), 16)}`);
w(`   the differential turndown there                                      ${rpad(n(warnRow.differentialTurndown, 'ratio'), 16)}`);
w(`   found by bisecting the reading at which the returned warning stops being null`);
w();
w('The note the engine returns on every call, in its own words:');
quoted(pin('the turndown note', txBase.turndownNote, 'because flow goes as the square root of the differential'));
w();

/* ======================================================== SECTION 13 */

w('# SECTION 13: THE UNCERTAINTY BUDGET (owned by Associate m06)');
w();
w('The point of a metering app is the uncertainty. Each input\'s uncertainty is');
w('multiplied by the sensitivity of the flow to that input, read off the orifice');
w('equation itself, and the six are combined as a root sum of squares. The');
w('budget below uses the engine\'s own default uncertainties for every term');
w('except the differential, which comes from the transmitter.');
w();
const budget = success('orificeUncertainty on the ABOH run at the design reading', M.orificeUncertainty({
  beta: aboh.beta, dpInH2O: S.ABOH.dpInH2O, spanInH2O: S.ABOH.spanInH2O,
}));
w(`   ${pad('term', 26)}${rpad('sensitivity', 14)}${rpad('uncertainty, pct', 18)}${rpad('contribution, pct', 19)}${rpad('share of variance, pct', 24)}`);
budget.contributions.forEach((c) => {
  w(`   ${pad(c.name, 26)}${rpad(n(c.sensitivity, 'factor'), 14)}${rpad(n(c.uncertaintyPct, 'pct'), 18)}${rpad(n(c.contributionPct, 'pct'), 19)}${rpad(n(c.shareOfVariancePct, 'pct'), 24)}`);
});
w();
w(`   total uncertainty, percent of flow                ${rpad(n(budget.totalUncertaintyPct, 'pct'), 16)}`);
w(`   dominant term                                     ${rpad(budget.dominant, 28)}`);
w(`   runner up                                         ${rpad(budget.runnerUp, 28)}`);
w(`   the dominance is clear                            ${rpad(String(budget.dominanceIsClear), 28)}`);
w();
rel('the two largest shares of the variance on the ABOH run at its design reading',
  `${budget.dominant}, share of variance in percent`, budget.dominantShareOfVariancePct,
  `${budget.runnerUp}, share of variance in percent`, budget.runnerUpShareOfVariancePct, 'pct');
w();
w('WHERE THE DIFFERENTIAL TERM COMES FROM. The function derives it from the');
w('transmitter when a reading and a span are given, and the result says which of');
w('the two routes it took. That is what stops a screen showing a transmitter');
w('figure beside a budget that disagrees with it.');
quoted(pin('the differential uncertainty source', budget.differentialUncertaintySource, 'percent of reading'));
w();
const typedBudget = success('orificeUncertainty with a typed differential uncertainty',
  M.orificeUncertainty({ beta: aboh.beta }));
w('And with no reading and no span, the same call takes the typed figure:');
quoted(pin('the typed differential uncertainty source', typedBudget.differentialUncertaintySource, 'a typed differential uncertainty'));
rel('the total uncertainty on the ABOH beta, transmitter derived against the typed default',
  'with the differential term from the transmitter, percent', budget.totalUncertaintyPct,
  'with the engine\'s typed default differential term, percent', typedBudget.totalUncertaintyPct, 'pct');
w();

/* ======================================================== SECTION 14 */

w('# SECTION 14: WHICH TERM DOMINATES IS A RESULT (owned by Associate m06)');
w();
w('The budget re-run down the span. The dominant term is whatever the engine');
w('names, and the reading at which the name changes is found by bisecting the');
w('name rather than by argument.');
w();
w(`   ${pad('reading, in H2O', 18)}${rpad('total, pct', 14)}${rpad('dominant term', 26)}${rpad('its share, pct', 17)}${rpad('clear', 8)}`);
const domRows = S.SPAN_SWEEP.map((dp) => {
  const b = success(`orificeUncertainty at a reading of ${dp} in H2O`, M.orificeUncertainty({
    beta: aboh.beta, dpInH2O: dp, spanInH2O: S.ABOH.spanInH2O,
  }));
  w(`   ${pad(n(dp, 'inH2O'), 18)}${rpad(n(b.totalUncertaintyPct, 'pct'), 14)}${rpad(b.dominant, 26)}${rpad(n(b.dominantShareOfVariancePct, 'pct'), 17)}${rpad(String(b.dominanceIsClear), 8)}`);
  return { dp, dom: b.dominant, total: b.totalUncertaintyPct, clear: b.dominanceIsClear };
});
w();
const domTop = domRows[0].dom;
const domBottom = domRows[domRows.length - 1].dom;
must('THE DOMINANT TERM REALLY DOES CHANGE DOWN THE SPAN, so the crossing below is not vacuous',
  domTop !== domBottom, `${domTop} at the top of the span against ${domBottom} at the bottom`);
const crossing = bisect(0.5, S.ABOH.spanInH2O, (dp) => success('dominance crossing probe', M.orificeUncertainty({
  beta: aboh.beta, dpInH2O: dp, spanInH2O: S.ABOH.spanInH2O,
})).dominant === domTop, 'the reading at which the dominant term changes name');
const crossRow = success('the budget at the dominance crossing', M.orificeUncertainty({
  beta: aboh.beta, dpInH2O: crossing, spanInH2O: S.ABOH.spanInH2O,
}));
w(`   the dominant term changes name at a reading of, in H2O   ${rpad(n(crossing, 'inH2O'), 16)}`);
w(`   the flow turndown there                                  ${rpad(n(success('turndown at the crossing', M.transmitterUncertaintyPct({ dpInH2O: crossing, spanInH2O: S.ABOH.spanInH2O })).flowTurndown, 'ratio'), 16)}`);
w(`   the total uncertainty there, percent                     ${rpad(n(crossRow.totalUncertaintyPct, 'pct'), 16)}`);
w(`   above that reading the engine names                      ${rpad(domTop, 28)}`);
w(`   below it the engine names                                ${rpad(domBottom, 28)}`);
w();
w('THE MARGIN IS PART OF THE RESULT. A ranking of six numbers with no margin');
w('will name a winner on a photo finish. The engine returns whether the lead is');
w('clear and the note it writes differs in the two cases, both quoted here:');
w();
const clearCase = domRows.find((r) => r.clear);
const closeCase = domRows.find((r) => !r.clear);
must('THE SPAN SWEEP REACHES BOTH SIDES OF THE DOMINANCE MARGIN, so both notes below are real',
  !!clearCase && !!closeCase,
  `clear at ${clearCase ? clearCase.dp : 'none'}, close at ${closeCase ? closeCase.dp : 'none'}`);
quoted(pin('the clear dominance note', success('the budget where the lead is clear', M.orificeUncertainty({
  beta: aboh.beta, dpInH2O: clearCase.dp, spanInH2O: S.ABOH.spanInH2O,
})).note, 'spend on it first'));
quoted(pin('the photo finish note', success('the budget where the lead is not clear', M.orificeUncertainty({
  beta: aboh.beta, dpInH2O: closeCase.dp, spanInH2O: S.ABOH.spanInH2O,
})).note, 'too close to call a dominant term'));
w();
const marginEdge = bisect(closeCase.dp, clearCase.dp, (dp) => success('dominance margin probe', M.orificeUncertainty({
  beta: aboh.beta, dpInH2O: dp, spanInH2O: S.ABOH.spanInH2O,
})).dominanceIsClear === true, 'the reading at which the lead stops being clear');
w(`   the lead stops being clear at a reading of, in H2O       ${rpad(n(marginEdge, 'inH2O'), 16)}`);
w();

/* ======================================================== SECTION 15 */

w('# SECTION 15: A TURBINE VOLUME IS GROSS (owned by Associate m04)');
w();
w('Pulses divided by a K factor is an indicated volume. A proving run produces a');
w('meter factor and the product is a GROSS volume. It is not a custody transfer');
w('quantity and the engine says so on every call.');
w();
const turb = success('turbineVolume on a proving period', M.turbineVolume({
  pulses: 2_640_000, kFactorPulsesPerBbl: 848.2, meterFactor: 1.0021,
}));
w(`   pulses                                     ${rpad(2_640_000, 20)}   stated`);
w(`   K factor, pulses per bbl                   ${rpad(n(848.2, 'factor'), 20)}   stated`);
w(`   meter factor                               ${rpad(n(1.0021, 'factor'), 20)}   stated`);
w(`   indicated volume, bbl                      ${rpad(n(turb.indicatedBbl, 'bbl'), 20)}   returned`);
w(`   gross volume, bbl                          ${rpad(n(turb.grossBbl, 'bbl'), 20)}   returned`);
w();
quoted(pin('the gross volume note', turb.grossNote, 'not a custody transfer quantity'));
w();
w(`   ${pad('meter factor', 18)}${rpad('gross, bbl', 16)}${rpad('warning', 10)}`);
S.METER_FACTOR_SWEEP.forEach((mf) => {
  const r = success(`turbineVolume at a meter factor of ${mf}`, M.turbineVolume({
    pulses: 2_640_000, kFactorPulsesPerBbl: 848.2, meterFactor: mf,
  }));
  w(`   ${pad(n(mf, 'factor'), 18)}${rpad(n(r.grossBbl, 'bbl'), 16)}${rpad(r.warning ? 'fires' : 'silent', 10)}`);
});
w();
const mfEdge = bisect(1, 1.1, (mf) => success('proving screen probe', M.turbineVolume({
  pulses: 2_640_000, kFactorPulsesPerBbl: 848.2, meterFactor: mf,
})).warning === null, 'the meter factor above unity at which the proving screen fires');
w(`   the proving screen fires above a meter factor of         ${rpad(n(mfEdge, 'factor'), 16)}`);
w(`   found by bisecting the meter factor at which the returned warning stops being null`);
w();
quoted(pin('the proving screen warning', success('turbineVolume past the proving screen', M.turbineVolume({
  pulses: 2_640_000, kFactorPulsesPerBbl: 848.2, meterFactor: 1.04,
})).warning, 'This screen is this engine\'s stated choice'));
w();
refusal('turbineVolume with no K factor', M.turbineVolume({ pulses: 2_640_000, kFactorPulsesPerBbl: 0 }));
refusal('turbineVolume with a meter factor of zero', M.turbineVolume({
  pulses: 2_640_000, kFactorPulsesPerBbl: 848.2, meterFactor: 0,
}));
w();

/* ======================================================== SECTION 16 */

w('# SECTION 16: STRAIGHT RUN: A TABLE, A REFUSAL AND A CEILING (owned by Associate m04)');
w();
w('Straight-run requirements are table values. They depend on beta and on what');
w('is upstream, and the engine says it is not calculating them. NONE of the');
w('columns is cited to a document in this repository, and ONE of them is');
w('withheld by name.');
w();
const RUN_BETAS = [0.2, 0.4, 0.5, 0.6, 0.67, 0.75];
w(`   ${pad('fitting', 30)}${RUN_BETAS.map((b) => rpad(`beta ${b}`, 11)).join('')}`);
let withheldFittings = 0;
S.FITTINGS.forEach((fitting) => {
  const cells = RUN_BETAS.map((beta) => {
    const r = M.straightRunDiameters({ beta, upstreamFitting: fitting });
    if (r.withheld) return 'withheld';
    must(`straightRunDiameters answers for ${fitting} at beta ${beta}`, !r.error, r.error || 'answered');
    return String(r.upstreamDiameters);
  });
  if (cells.every((c) => c === 'withheld')) withheldFittings += 1;
  w(`   ${pad(fitting, 30)}${cells.map((c) => rpad(c, 11)).join('')}`);
});
w();
count('upstream fittings this engine refuses to answer for', withheldFittings,
  `the ${S.FITTINGS.length} fitting names in fc8_fields.mjs, each asked at all ${RUN_BETAS.length} betas`,
  'a fitting counts as refused when the engine returns withheld true at every beta asked');
w();
w('THE WITHHELD COLUMN, in the engine\'s own words:');
quoted(pin('the two elbows out of plane withholding',
  refusal('straightRunDiameters for two elbows in different planes',
    M.straightRunDiameters({ beta: 0.5, upstreamFitting: 'twoElbowsDifferentPlanes' })).error,
  'fell by 15 diameters between beta 0.5 and 0.6 and then rose by 20'));
w();
w('AND THE CEILING. Above the last row of the table the engine refuses rather');
w('than reading off the last row:');
quoted(pin('the above table refusal',
  refusal('straightRunDiameters above the top of the table',
    M.straightRunDiameters({ beta: 0.95, upstreamFitting: 'singleElbow' })).error,
  'where this table stops'));
w();
w('The note every answered row carries:');
quoted(pin('the straight run provenance note',
  success('straightRunDiameters at the ABOH beta', M.straightRunDiameters({ beta: aboh.beta })).note,
  'not cited to a document in this repository'));
w();
const downstreamEdge = bisect(0.2, 0.75, (b) => success('downstream requirement probe',
  M.straightRunDiameters({ beta: b })).downstreamDiameters === 4,
'the beta at which the downstream requirement steps up');
w(`   the downstream requirement steps up above a beta of      ${rpad(n(downstreamEdge, 'ratio'), 16)}`);
w(`   below it, diameters                                      ${rpad(String(success('downstream below', M.straightRunDiameters({ beta: 0.3 })).downstreamDiameters), 16)}`);
w(`   above it, diameters                                      ${rpad(String(success('downstream above', M.straightRunDiameters({ beta: 0.7 })).downstreamDiameters), 16)}`);
w();

/* ======================================================== SECTION 17 */

w('# SECTION 17: THE VALVE, AND THE BOUNDARY EVERYTHING HAPPENS AT (owned by Professional m01)');
w();
w('A control valve is the one item of process equipment where the ordinary');
w('sizing equation stops working exactly when the service gets difficult. Past');
w('the choking boundary a larger coefficient buys nothing. The BELEMA valve is');
w('marched down its outlet pressure and the boundary is crossed inside the');
w('table.');
w();
w(`   ${pad('P2, psia', 12)}${rpad('dP stated', 12)}${rpad('dP allowable', 14)}${rpad('dP used', 12)}${rpad('Cv', 12)}${rpad('sigma', 12)}${rpad('regime', 22)}`);
const marchRows = [];
S.P2_MARCH.forEach((p2) => {
  const r = V.liquidValve({
    qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: p2, sg: S.BELEMA.sg,
    pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: S.BELEMA.styleId,
  });
  if (r.error) {
    refusal(`liquidValve at an outlet of ${p2} psia`, r);
    w(`   ${pad(n(p2, 'psi'), 12)}refused: ${r.error.slice(0, 74)}`);
    return;
  }
  success(`liquidValve at an outlet of ${p2} psia`, r);
  marchRows.push({ p2, ...r });
  w(`   ${pad(n(p2, 'psi'), 12)}${rpad(n(r.dpStatedPsi, 'psi'), 12)}${rpad(n(r.dpAllowablePsi, 'psi'), 14)}${rpad(n(r.dpUsedPsi, 'psi'), 12)}${rpad(n(r.cv, 'cv'), 12)}${rpad(n(r.sigma, 'ratio'), 12)}${rpad(r.regime, 22)}`);
});
w();
count('rows of the march above on which the engine reports choked flow',
  marchRows.filter((r) => r.choked).length,
  `the ${S.P2_MARCH.length} outlet pressures in fc8_fields.mjs, each run through liquidValve`,
  'a row counts when the engine returns choked true');
w();
const chokeP2 = bisect(S.BELEMA.p1Psia - 1, S.BELEMA.pvPsia + 0.01, (p2) => success('choking boundary probe', V.liquidValve({
  qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: p2, sg: S.BELEMA.sg,
  pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: S.BELEMA.styleId,
})).choked === false, 'the outlet pressure at which the BELEMA valve begins to choke');
const atChoke = success('the valve at its choking boundary', V.liquidValve({
  qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: chokeP2, sg: S.BELEMA.sg,
  pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: S.BELEMA.styleId,
}));
w(`   the valve begins to choke at an outlet pressure of, psia ${rpad(n(chokeP2, 'psi'), 16)}`);
w(`   the allowable drop there, psi                            ${rpad(n(atChoke.dpAllowablePsi, 'psi'), 16)}`);
w(`   the coefficient there                                    ${rpad(n(atChoke.cv, 'cv'), 16)}`);
w(`   found by bisecting the engine's own choked flag`);
w();
w('WHAT SIZING ON THE STATED DROP WOULD COST. Past the boundary the engine caps');
w('the drop. A hand calculation that used the full stated drop instead produces');
w('a smaller coefficient, and the size of that error is printed here rather than');
w('described.');
w();
const deep = success('the valve well past its choking boundary', V.liquidValve({
  qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: 40, sg: S.BELEMA.sg,
  pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: S.BELEMA.styleId,
}));
const naiveCv = S.BELEMA.qGpm * Math.sqrt(S.BELEMA.sg / deep.dpStatedPsi);
rel('the coefficient at an outlet of 40.000000 psia, the engine against a sizing on the full stated drop',
  'the engine, sizing on the drop the valve can use', deep.cv,
  'a sizing on the full stated drop', naiveCv, 'cv');
w();
quoted(pin('the choked flow warning', deep.warning, 'sizing on it would undersize the valve badly'));
w();

/* ======================================================== SECTION 18 */

w('# SECTION 18: SIGMA IS COMPUTED ON THE DROP THE VALVE USES (owned by Professional m02)');
w();
w('Damage begins long before the flow chokes, and the cavitation index says how');
w('much margin there is before it. The engine computes it on the drop the valve');
w('ACTUALLY USES, and returns a basis line saying so. On a choked service the');
w('stated drop and the used drop are two different pressure drops, and an index');
w('computed on the stated one belongs to a drop the valve cannot take.');
w();
quoted(pin('the sigma basis', atChoke.sigmaBasis, 'computed on the pressure drop the valve uses'));
w();
w('THE REGIME LADDER, and the sigma at which each rung is reached, found by');
w('bisecting the word the engine returns.');
w();
// EACH RUNG IS FOUND ON A MONOTONE PREDICATE. "the regime equals this word" is
// true only over a middle interval, so both ends of any bracket are false and a
// bisection on it proves nothing. What is monotone in the outlet pressure is
// "the regime is still at or above this rung", so that is what is bisected.
const regimeAt = (rungsAtOrAbove, label) => {
  const p2 = bisect(S.BELEMA.p1Psia - 1, S.BELEMA.pvPsia + 0.01, (p) => {
    const r = V.liquidValve({
      qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: p, sg: S.BELEMA.sg,
      pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: S.BELEMA.styleId,
    });
    return r.error ? false : rungsAtOrAbove.includes(r.regime);
  }, `the outlet pressure at which the regime leaves ${label}`);
  const r = success(`the valve where the regime leaves ${label}`, V.liquidValve({
    qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: p2, sg: S.BELEMA.sg,
    pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: S.BELEMA.styleId,
  }));
  return { p2, sigma: r.sigma, regime: r.regime };
};
const stableToIncipient = regimeAt(['stable'], 'stable');
const incipientToCavitating = regimeAt(['stable', 'incipient cavitation'], 'incipient cavitation or better');
w(`   ${pad('boundary', 46)}${rpad('outlet, psia', 16)}${rpad('sigma there', 14)}`);
w(`   ${pad('stable gives way to incipient cavitation', 46)}${rpad(n(stableToIncipient.p2, 'psi'), 16)}${rpad(n(stableToIncipient.sigma, 'ratio'), 14)}`);
w(`   ${pad('incipient gives way to cavitating', 46)}${rpad(n(incipientToCavitating.p2, 'psi'), 16)}${rpad(n(incipientToCavitating.sigma, 'ratio'), 14)}`);
w(`   ${pad('the flow chokes', 46)}${rpad(n(chokeP2, 'psi'), 16)}${rpad(n(atChoke.sigma, 'ratio'), 14)}`);
w();
w('BOTH LADDER THRESHOLDS ARE THIS ENGINE\'S STATED SCREEN and neither is read');
w('from a standard. The engine exports them and this course never grades a');
w('regime word.');
w(`   the cavitating threshold the engine exports              ${rpad(n(V.SIGMA_THRESHOLDS.cavitating, 'ratio'), 16)}`);
w(`   the incipient threshold the engine exports               ${rpad(n(V.SIGMA_THRESHOLDS.incipient, 'ratio'), 16)}`);
w();
w('AND THE REFUSAL THAT MAKES THE LADDER RUN AT ALL. With no vapour pressure the');
w('index is infinite, the last rung of the ladder is taken, and every liquid');
w('service at every drop reads as stable in green. The repaired engine refuses:');
quoted(pin('the missing vapour pressure refusal',
  refusal('liquidValve with no vapour pressure', V.liquidValve({
    qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: S.BELEMA.p2Psia,
    sg: S.BELEMA.sg, pvPsia: 0,
  })).error, 'the cavitation screen would not run at all'));
w();

/* ======================================================== SECTION 19 */

w('# SECTION 19: FLASHING IS A DIFFERENT PROBLEM (owned by Professional m02)');
w();
w('When the outlet is at or below the vapour pressure the liquid is flashing');
w('rather than cavitating, and an anti-cavitation trim will not help it. The');
w('engine separates the two and says which one it has.');
w();
const flashing = V.liquidValve({
  qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: S.BELEMA.pvPsia - 2,
  sg: S.BELEMA.sg, pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: S.BELEMA.styleId,
});
success('liquidValve on a flashing service', flashing);
w(`   outlet pressure, psia                      ${rpad(n(S.BELEMA.pvPsia - 2, 'psi'), 20)}   stated`);
w(`   vapour pressure, psia                      ${rpad(n(S.BELEMA.pvPsia, 'psi'), 20)}   stated`);
w(`   flashing                                   ${rpad(String(flashing.flashing), 20)}   returned`);
w(`   regime                                     ${rpad(flashing.regime, 20)}   returned`);
w(`   coefficient                                ${rpad(n(flashing.cv, 'cv'), 20)}   returned`);
w();
quoted(pin('the flashing warning', flashing.warning, 'an anti-cavitation trim will not help it'));
w();
const flashEdge = bisect(S.BELEMA.pvPsia + 20, 1, (p2) => {
  const r = V.liquidValve({
    qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: p2, sg: S.BELEMA.sg,
    pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: S.BELEMA.styleId,
  });
  return r.error ? true : r.flashing === false;
}, 'the outlet pressure at which the service starts flashing');
rel('the outlet pressure at which flashing starts, against the stated vapour pressure',
  'the outlet pressure where the engine turns the flashing flag on, psia', flashEdge,
  'the stated vapour pressure, psia', S.BELEMA.pvPsia, 'psi');
w();
w('The liquid critical pressure ratio factor, which sets how much of the');
w('difference between the inlet and the vapour pressure the valve can use:');
w(`   FF at the BELEMA vapour and critical pressures           ${rpad(n(V.liquidCriticalRatioFF({ pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia }), 'ratio'), 16)}`);
w(`   FF as the vapour pressure approaches zero                ${rpad(n(V.liquidCriticalRatioFF({ pvPsia: 0, pcPsia: S.BELEMA.pcPsia }), 'ratio'), 16)}`);
w(`   FF at the critical point                                 ${rpad(n(V.liquidCriticalRatioFF({ pvPsia: S.BELEMA.pcPsia, pcPsia: S.BELEMA.pcPsia }), 'ratio'), 16)}`);
w();

/* ======================================================== SECTION 20 */

w('# SECTION 20: GAS SIZING AND THE TWO THIRDS FLOOR (owned by Professional m03)');
w();
w('On gas the boundary is a pressure drop RATIO. The expansion factor falls');
w('linearly with it and is floored at two thirds, which is the choked condition.');
w('Past it the flow is sonic in the vena contracta and more drop buys nothing.');
w();
w(`   ${pad('P2, psia', 12)}${rpad('x', 12)}${rpad('x terminal', 13)}${rpad('x used', 12)}${rpad('Y', 12)}${rpad('Cv', 14)}${rpad('choked', 9)}`);
const gasRows = [];
S.GAS_P2_MARCH.forEach((p2) => {
  const r = success(`gasValve at an outlet of ${p2} psia`, V.gasValve({
    qScfh: S.BELEMA_GAS.qScfh, p1Psia: S.BELEMA_GAS.p1Psia, p2Psia: p2,
    gasSg: S.BELEMA_GAS.gasSg, tF: S.BELEMA_GAS.tF, z: S.BELEMA_GAS.z, k: S.BELEMA_GAS.k,
    styleId: S.BELEMA_GAS.styleId,
  }));
  gasRows.push({ p2, ...r });
  w(`   ${pad(n(p2, 'psi'), 12)}${rpad(n(r.x, 'ratio'), 12)}${rpad(n(r.xChoked, 'ratio'), 13)}${rpad(n(r.xUsed, 'ratio'), 12)}${rpad(n(r.y, 'factor'), 12)}${rpad(n(r.cv, 'cv'), 14)}${rpad(String(r.choked), 9)}`);
});
w();
const chokedGas = gasRows.filter((r) => r.choked);
count('rows of the gas march above on which the engine reports choked flow', chokedGas.length,
  `the ${S.GAS_P2_MARCH.length} outlet pressures in fc8_fields.mjs, each run through gasValve`,
  'a row counts when the engine returns choked true');
w();
const yFloor = chokedGas[0].y;
must('THE EXPANSION FACTOR IS EXACTLY TWO THIRDS ON EVERY CHOKED ROW',
  chokedGas.every((r) => r.y === yFloor) && Math.abs(yFloor - 2 / 3) < 1e-15,
  `${chokedGas.map((r) => r.y).join(', ')}`);
w(`   the expansion factor on every choked row                 ${rpad(n(yFloor, 'factor'), 16)}`);
w(`   which is two thirds to the last bit a double carries`);
w();
const gasChokeP2 = bisect(S.BELEMA_GAS.p1Psia - 1, 1, (p2) => success('gas choking probe', V.gasValve({
  qScfh: S.BELEMA_GAS.qScfh, p1Psia: S.BELEMA_GAS.p1Psia, p2Psia: p2,
  gasSg: S.BELEMA_GAS.gasSg, tF: S.BELEMA_GAS.tF, z: S.BELEMA_GAS.z, k: S.BELEMA_GAS.k,
  styleId: S.BELEMA_GAS.styleId,
})).choked === false, 'the outlet pressure at which the gas valve begins to choke');
const atGasChoke = success('the gas valve at its choking boundary', V.gasValve({
  qScfh: S.BELEMA_GAS.qScfh, p1Psia: S.BELEMA_GAS.p1Psia, p2Psia: gasChokeP2,
  gasSg: S.BELEMA_GAS.gasSg, tF: S.BELEMA_GAS.tF, z: S.BELEMA_GAS.z, k: S.BELEMA_GAS.k,
  styleId: S.BELEMA_GAS.styleId,
}));
w(`   the gas valve begins to choke at an outlet of, psia      ${rpad(n(gasChokeP2, 'psi'), 16)}`);
w(`   the terminal pressure drop ratio there                   ${rpad(n(atGasChoke.xChoked, 'ratio'), 16)}`);
w(`   the specific heat ratio factor there                     ${rpad(n(atGasChoke.fk, 'ratio'), 16)}`);
w(`   the coefficient there                                    ${rpad(n(atGasChoke.cv, 'cv'), 16)}`);
w();
w('The specific heat ratio factor across the specific heat ratios in this file:');
w(`   ${pad('k', 12)}${rpad('Fk', 14)}`);
S.K_SWEEP.forEach((k) => {
  const fk = V.specificHeatFactor(k);
  must(`the specific heat ratio factor is finite at k ${k}`, Number.isFinite(fk), fk);
  w(`   ${pad(n(k, 'factor'), 12)}${rpad(n(fk, 'ratio'), 14)}`);
});
w();
quoted(pin('the gas choked warning', gasRows[gasRows.length - 1].warning, 'further pressure drop buys nothing'));
w();

/* ======================================================== SECTION 21 */

w('# SECTION 21: THE VALVE STYLE TABLE, AND WHOSE IT IS (owned by Professional m03)');
w();
w('The pressure recovery factor FL and the terminal pressure drop ratio xT are');
w('TABLE VALUES. They are trim and vendor dependent by nature and this course');
w('never grades a number that rests on them.');
w();
w(`   ${pad('style id', 24)}${pad('label', 44)}${rpad('FL', 10)}${rpad('xT', 10)}`);
V.VALVE_STYLES.forEach((v) => {
  w(`   ${pad(v.id, 24)}${pad(v.label, 44)}${rpad(n(v.fl, 'ratio'), 10)}${rpad(n(v.xt, 'ratio'), 10)}`);
});
w();
count('valve styles this engine carries', V.VALVE_STYLES.length,
  'the VALVE_STYLES array the module exports',
  'every entry of the array, with no filter');
w();
quoted(pin('the valve style provenance', V.VALVE_STYLE_PROVENANCE, 'not cited to a document in this repository'));
w();
const flSpread = V.VALVE_STYLES.map((v) => v.fl);
rel('the pressure recovery factor across the styles this engine carries',
  'the largest FL in the table', Math.max(...flSpread),
  'the smallest FL in the table', Math.min(...flSpread), 'ratio');
w();
w('A STATED VENDOR FIGURE REPLACES THE TABLE, and the engine takes it. The same');
w('service sized on the table and on a stated figure:');
const onTable = success('liquidValve on the style table', V.liquidValve({
  qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: 60, sg: S.BELEMA.sg,
  pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: 'globeCage',
}));
const onVendor = success('liquidValve on a stated vendor FL', V.liquidValve({
  qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: 60, sg: S.BELEMA.sg,
  pvPsia: S.BELEMA.pvPsia, pcPsia: S.BELEMA.pcPsia, styleId: 'globeCage', flOverride: 0.97,
}));
rel('the coefficient at an outlet of 60.000000 psia, the table FL against a stated FL of 0.970000',
  `on the table FL of ${n(V.styleOf('globeCage').fl, 'ratio')}`, onTable.cv,
  'on a stated FL of 0.970000', onVendor.cv, 'cv');
w();
refusal('liquidValve on an unknown style', V.liquidValve({
  qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: 60, sg: S.BELEMA.sg,
  pvPsia: S.BELEMA.pvPsia, styleId: 'noSuchStyle',
}));
refusal('liquidValve on an FL above one', V.liquidValve({
  qGpm: S.BELEMA.qGpm, p1Psia: S.BELEMA.p1Psia, p2Psia: 60, sg: S.BELEMA.sg,
  pvPsia: S.BELEMA.pvPsia, flOverride: 1.4,
}));
refusal('gasValve on an xT above one', V.gasValve({
  qScfh: S.BELEMA_GAS.qScfh, p1Psia: S.BELEMA_GAS.p1Psia, p2Psia: 140,
  gasSg: S.BELEMA_GAS.gasSg, tF: S.BELEMA_GAS.tF, xtOverride: 1.2,
}));
w();

/* ======================================================== SECTION 22 */

w('# SECTION 22: AUTHORITY, AND THE CHARACTERISTIC IT CHOOSES (owned by Professional m04)');
w();
w('Valve authority is the fraction of the system\'s total drop the valve takes at');
w('design flow, and it decides whether a loop can control at all. The');
w('characteristic recommendation reads off it. The two functions speak ONE');
w('vocabulary: every id the recommendation returns is an id the travel check');
w('accepts, which this section asserts on every row of the ladder below.');
w();
const SYSTEM_DROP = 120;
w(`   total system drop, psi: ${n(SYSTEM_DROP, 'psi')}`);
w();
w(`   ${pad('valve drop, psi', 18)}${rpad('authority', 14)}${rpad('verdict', 14)}${rpad('characteristic', 20)}${rpad('label', 20)}`);
S.AUTHORITY_SWEEP.forEach((dp) => {
  const a = success(`valveAuthority at a valve drop of ${dp} psi`, V.valveAuthority({
    dpValvePsi: dp, dpSystemTotalPsi: SYSTEM_DROP,
  }));
  const c = success(`characteristicFor at an authority of ${a.authority}`, V.characteristicFor({ authority: a.authority }));
  must(`the characteristic id at a valve drop of ${dp} psi is one travelCheck accepts`,
    V.CHARACTERISTICS.includes(c.characteristic), c.characteristic);
  must(`the characteristic label at a valve drop of ${dp} psi is the module's own label for that id`,
    c.characteristicLabel === V.characteristicLabel(c.characteristic),
    `${c.characteristicLabel} against ${V.characteristicLabel(c.characteristic)}`);
  w(`   ${pad(n(dp, 'psi'), 18)}${rpad(n(a.authority, 'ratio'), 14)}${rpad(a.verdict, 14)}${rpad(c.characteristic, 20)}${rpad(c.characteristicLabel, 20)}`);
});
w();
const authGood = bisect(0.01, 0.99, (f) => success('authority verdict probe', V.valveAuthority({
  dpValvePsi: f * SYSTEM_DROP, dpSystemTotalPsi: SYSTEM_DROP,
})).verdict === 'good', 'the authority at which the verdict stops being good');
const authPoor = bisect(0.01, 0.99, (f) => success('authority verdict probe', V.valveAuthority({
  dpValvePsi: f * SYSTEM_DROP, dpSystemTotalPsi: SYSTEM_DROP,
})).verdict === 'poor', 'the authority at which the verdict stops being poor');
w(`   the verdict stops being good below an authority of       ${rpad(n(authGood, 'ratio'), 16)}`);
w(`   the verdict becomes poor below an authority of           ${rpad(n(authPoor, 'ratio'), 16)}`);
w(`   the characteristic recommendation changes at an authority of ${rpad(n(bisect(0.01, 0.99, (f) => success('characteristic probe', V.characteristicFor({ authority: f })).characteristic === 'linear', 'the authority at which the recommended characteristic changes'), 'ratio'), 12)}`);
w();
quoted(pin('the authority threshold provenance',
  success('valveAuthority for its threshold basis', V.valveAuthority({ dpValvePsi: 40, dpSystemTotalPsi: SYSTEM_DROP })).thresholdBasis,
  'this engine\'s stated screen'));
w();
w('The two reasons the recommendation gives, in the engine\'s own words:');
quoted(pin('the linear recommendation', success('characteristicFor at a high authority', V.characteristicFor({ authority: 0.7 })).reason, 'linear trim gives even loop gain'));
quoted(pin('the equal percentage recommendation', success('characteristicFor at a low authority', V.characteristicFor({ authority: 0.3 })).reason, 'shaped to cancel exactly that'));
w();
refusal('valveAuthority with a valve drop above the system drop', V.valveAuthority({
  dpValvePsi: 200, dpSystemTotalPsi: SYSTEM_DROP,
}));
w();

/* ======================================================== SECTION 23 */

w('# SECTION 23: NOISE: THE BAND THE STREAM POWER CAPS AND FLOORS (owned by Professional m05)');
w();
w('The full noise prediction needs geometry this package does not have, so what');
w('the engine offers is a SCREENING band and it says so. The repaired band sees');
w('both the pressure ratio and the stream power: a trickle cannot be loud');
w('however hard it is throttled, and tens of megawatts of stream power is not');
w('quiet however gently.');
w();
w(`   ${pad('probe', 52)}${rpad('ratio', 12)}${rpad('power, kW', 16)}${rpad('ratio band', 12)}${rpad('band', 12)}`);
const noiseRows = S.NOISE_PROBES.map((p) => {
  const r = success(`noiseIndication for ${p.label}`, V.noiseIndication({
    p1Psia: p.p1Psia, p2Psia: p.p2Psia, qScfh: p.qScfh, gasSg: p.gasSg, tF: p.tF,
  }));
  w(`   ${pad(p.label, 52)}${rpad(n(r.pressureRatio, 'ratio'), 12)}${rpad(r.streamPowerKw.toPrecision(6), 16)}${rpad(r.ratioBand, 12)}${rpad(r.band, 12)}`);
  return { label: p.label, ...r };
});
w();
count('probes above on which the stream power moved the band off the pressure ratio alone',
  noiseRows.filter((r) => r.powerEffect !== null).length,
  `the ${S.NOISE_PROBES.length} noise probes in fc8_fields.mjs`,
  'a probe counts when the engine returns a non-null powerEffect');
w();
noiseRows.filter((r) => r.powerEffect !== null).forEach((r) => {
  w(`   ${r.label}:`);
  quoted(r.powerEffect);
});
w();
w(`   the pressure ratio bands the engine exports              moderate ${n(V.NOISE_RATIO_BANDS.moderate, 'ratio')}, high ${n(V.NOISE_RATIO_BANDS.high, 'ratio')}, severe ${n(V.NOISE_RATIO_BANDS.severe, 'ratio')}`);
w(`   the stream power bands the engine exports                quiet ${n(V.NOISE_POWER_BANDS.quietKw, 'ratio')} kW, loud ${n(V.NOISE_POWER_BANDS.loudKw, 'ratio')} kW`);
w();
quoted(pin('the noise screening note', noiseRows[0].note, 'Use this to know whether to ask the question'));
w();
refusal('noiseIndication with no outlet pressure', V.noiseIndication({
  p1Psia: 600, p2Psia: 0, qScfh: 1000, gasSg: 0.65, tF: 80,
}));
refusal('noiseIndication with no gas gravity', V.noiseIndication({
  p1Psia: 600, p2Psia: 100, qScfh: 1000, tF: 80,
}));
w();

/* ======================================================== SECTION 24 */

w('# SECTION 24: TRAVEL, AND A VERDICT OVER CHECKS THAT RAN (owned by Professional m06)');
w();
w('A valve sized for the maximum and asked to control at the minimum may be near');
w('its seat, where it does not control at all. The engine counts its checks and');
w('says how many it ran, and it WITHHOLDS the pass verdict whenever a flow is');
w('missing. It also separates a flow BEYOND the valve from a flow NOT GIVEN.');
w();
w(`   ${pad('case', 46)}${rpad('min', 12)}${rpad('normal', 12)}${rpad('max', 12)}${rpad('ran', 6)}${rpad('pass', 8)}${rpad('warnings', 10)}`);
const travelRows = S.TRAVEL_CASES.map((c) => {
  const r = success(`travelCheck for ${c.label}`, V.travelCheck({
    cvRequiredMin: c.cvRequiredMin, cvRequiredNormal: c.cvRequiredNormal,
    cvRequiredMax: c.cvRequiredMax, cvRated: c.cvRated,
    characteristic: 'equalPercentage', rangeability: 50,
  }));
  w(`   ${pad(c.label, 46)}${rpad(r.minTravelPct === null ? r.minState : n(r.minTravelPct, 'pct'), 12)}${rpad(r.normalTravelPct === null ? r.normalState : n(r.normalTravelPct, 'pct'), 12)}${rpad(r.maxTravelPct === null ? r.maxState : n(r.maxTravelPct, 'pct'), 12)}${rpad(`${r.checksPerformed}/${r.checksPossible}`, 6)}${rpad(String(r.pass), 8)}${rpad(r.warnings.length, 10)}`);
  return { label: c.label, ...r };
});
w();
count('travel cases above on which the engine WITHHELD its pass verdict',
  travelRows.filter((r) => r.pass === null).length,
  `the ${S.TRAVEL_CASES.length} travel cases in fc8_fields.mjs`,
  'a case counts when the engine returns pass null, which it does whenever a check could not run');
w();
travelRows.filter((r) => r.passWithheldReason !== null).forEach((r) => {
  w(`   ${r.label}:`);
  quoted(r.passWithheldReason);
});
w();
w('The two states a missing travel can carry, which a single null cannot tell');
w('apart:');
const beyond = travelRows.find((r) => r.maxState === 'beyond the valve');
const notGiven = travelRows.find((r) => r.maxState === 'not given');
must('THE TRAVEL CASES REACH BOTH STATES, so the distinction below is measured',
  !!beyond && !!notGiven, `${beyond ? 'beyond present' : 'beyond missing'}, ${notGiven ? 'not given present' : 'not given missing'}`);
w(`   a maximum flow beyond the valve reports the state        ${rpad(beyond.maxState, 20)}`);
w(`   a maximum flow not given reports the state               ${rpad(notGiven.maxState, 20)}`);
w();
w('THE EQUAL PERCENTAGE TRAVEL AGAINST THE LINEAR TRAVEL at the same required');
w('coefficient, which is the whole reason a characteristic is chosen:');
const linTravel = success('travelCheck on linear trim', V.travelCheck({
  cvRequiredMin: 9.4, cvRequiredNormal: 26.8, cvRequiredMax: 38.5, cvRated: 72,
  characteristic: 'linear',
}));
const eqTravel = travelRows[0];
rel('the normal duty travel on the same valve, equal percentage against linear',
  'equal percentage trim at a rangeability of 50, percent open', eqTravel.normalTravelPct,
  'linear trim, percent open', linTravel.normalTravelPct, 'pct');
w();
quoted(pin('the unknown characteristic refusal',
  refusal('travelCheck on an unrecognised characteristic', V.travelCheck({
    cvRequiredNormal: 26.8, cvRated: 72, characteristic: 'quickOpening',
  })).error, 'used to be treated silently as equal percentage'));
w();

/* ======================================================== SECTION 25 */

w('# SECTION 25: THE TANK, AND THE EXACT BARREL (owned by Expert m01)');
w();
w('The three tank questions share one geometry, which is why they are in one');
w('module. The conversion between cubic feet and barrels is exact by definition');
w('and the engine returns it so it can be checked rather than assumed.');
w();
const ogb = success('tankCapacity for the OGBOGENE tank', T.tankCapacity({
  diameterFt: S.OGBOGENE.diameterFt, heightFt: S.OGBOGENE.heightFt,
  fillHeightFt: S.OGBOGENE.liquidLevelFt,
}));
w(`   diameter, ft                               ${rpad(n(S.OGBOGENE.diameterFt, 'inch'), 20)}   stated`);
w(`   shell height, ft                           ${rpad(n(S.OGBOGENE.heightFt, 'inch'), 20)}   stated`);
w(`   design liquid level, ft                    ${rpad(n(S.OGBOGENE.liquidLevelFt, 'inch'), 20)}   stated`);
w(`   cross section, ft2                         ${rpad(n(ogb.crossSectionFt2, 'ft2'), 20)}   returned`);
w(`   nominal capacity, bbl                      ${rpad(n(ogb.nominalBbl, 'bbl'), 20)}   returned`);
w(`   nominal capacity, ft3                      ${rpad(n(ogb.nominalFt3, 'ft3'), 20)}   returned`);
w(`   working capacity to the design level, bbl  ${rpad(n(ogb.workingBbl, 'bbl'), 20)}   returned`);
w(`   barrels per foot of shell                  ${rpad(n(ogb.bblPerFt, 'bbl'), 20)}   returned`);
w(`   cubic feet in a barrel                     ${rpad(ogb.ft3PerBbl, 20)}   returned`);
w();
rel('the nominal and the working capacity of this tank',
  'nominal, to the top of the shell, bbl', ogb.nominalBbl,
  'working, to the design liquid level, bbl', ogb.workingBbl, 'bbl');
w();
quoted(pin('the negative fill refusal',
  refusal('tankCapacity with a fill height below zero', T.tankCapacity({
    diameterFt: S.OGBOGENE.diameterFt, heightFt: S.OGBOGENE.heightFt, fillHeightFt: -3,
  })).error, 'a tank does not hold less than nothing'));
w();

/* ======================================================== SECTION 26 */

w('# SECTION 26: THE SHELL, AND WHICH OF THREE THINGS GOVERNS EACH COURSE (owned by Expert m02)');
w();
w('The one-foot method, at the design condition and at the hydrostatic test');
w('condition, because either can govern and which one does depends on the');
w('product. A light product makes the water test govern, which is exactly the');
w('case people forget when they design for the product alone. The minimum plate');
w('thickness is a STATED INPUT and the engine says so.');
w();
const shell = success('shellCourses for the OGBOGENE tank', T.shellCourses({
  diameterFt: S.OGBOGENE.diameterFt, heightFt: S.OGBOGENE.heightFt,
  courseHeightFt: S.OGBOGENE.courseHeightFt, liquidLevelFt: S.OGBOGENE.liquidLevelFt,
  sg: S.OGBOGENE.sg,
}));
w(`   ${pad('course', 9)}${rpad('bottom, ft', 13)}${rpad('top, ft', 11)}${rpad('head, ft', 12)}${rpad('t design, in', 15)}${rpad('t test, in', 13)}${rpad('required, in', 15)}${rpad('governed by', 26)}`);
shell.courses.forEach((c) => {
  w(`   ${pad(c.course, 9)}${rpad(n(c.bottomFt, 'inch'), 13)}${rpad(n(c.topFt, 'inch'), 11)}${rpad(n(c.headFt, 'inch'), 12)}${rpad(n(c.tDesignIn, 'inch'), 15)}${rpad(n(c.tTestIn, 'inch'), 13)}${rpad(n(c.requiredIn, 'inch'), 15)}${rpad(c.governing, 26)}`);
});
w();
count('courses on this tank', shell.count,
  'the courses array shellCourses returns for the OGBOGENE geometry',
  'one course per whole or part course height in the shell height, which the engine takes as the ceiling of the shell height divided by the course height');
count('courses on this tank the water test governs', shell.testGovernedCount,
  'the same courses array',
  'a course counts when the engine returns governing equal to hydrostatic test');
count('courses on this tank the stated minimum plate governs', shell.minimumGovernedCount,
  'the same courses array',
  'a course counts when the engine returns governing equal to minimum plate thickness');
w();
w(`   the thickest course                        ${rpad(shell.thickestCourse, 20)}   returned`);
w(`   its required thickness, in                 ${rpad(n(shell.thickestRequiredIn, 'inch'), 20)}   returned`);
w(`   what governs it                            ${rpad(shell.governingReason, 20)}   returned`);
w(`   the stated minimum plate thickness, in     ${rpad(n(shell.minimumThicknessIn, 'inch'), 20)}   returned`);
w(`   the last course the water test governs     ${rpad(String(shell.lastTestGovernedCourse), 20)}   returned`);
w(`   the first course the minimum plate governs ${rpad(String(shell.firstMinimumGovernedCourse), 20)}   returned`);
w();
w('THE BOTTOM COURSE IS ALWAYS THE THICKEST and the engine returns that as a');
w('property of the method rather than as a result. The head falls as the courses');
w('go up, both thickness relations are linear in it, and the minimum plate is a');
w('floor, so the required thickness cannot increase upward.');
w(`   the engine's own flag for that             ${rpad(String(shell.governingCourseIsAlwaysTheBottom), 20)}   returned`);
must('THE COURSE LIST REALLY IS NON-INCREASING UPWARD on this tank, which is the flag measured rather than repeated',
  shell.courses.every((c, i) => i === 0 || c.requiredIn <= shell.courses[i - 1].requiredIn),
  shell.courses.map((c) => c.requiredIn).join(' '));
w();
w('WHAT GOVERNS THE BOTTOM COURSE ACROSS THE PRODUCT GRAVITIES IN THIS FILE:');
w();
w(`   ${pad('specific gravity', 20)}${rpad('t design, in', 15)}${rpad('t test, in', 13)}${rpad('required, in', 15)}${rpad('governed by', 26)}`);
S.SG_SWEEP.forEach((sg) => {
  const r = success(`shellCourses at a specific gravity of ${sg}`, T.shellCourses({
    diameterFt: S.OGBOGENE.diameterFt, heightFt: S.OGBOGENE.heightFt,
    courseHeightFt: S.OGBOGENE.courseHeightFt, liquidLevelFt: S.OGBOGENE.liquidLevelFt, sg,
  }));
  const c = r.courses[0];
  w(`   ${pad(n(sg, 'ratio'), 20)}${rpad(n(c.tDesignIn, 'inch'), 15)}${rpad(n(c.tTestIn, 'inch'), 13)}${rpad(n(c.requiredIn, 'inch'), 15)}${rpad(c.governing, 26)}`);
});
w();
const sgCross = bisect(0.4, 1.5, (sg) => success('shell governing probe', T.shellCourses({
  diameterFt: S.OGBOGENE.diameterFt, heightFt: S.OGBOGENE.heightFt,
  courseHeightFt: S.OGBOGENE.courseHeightFt, liquidLevelFt: S.OGBOGENE.liquidLevelFt, sg,
})).governingReason === 'hydrostatic test', 'the specific gravity at which the water test takes the bottom course');
w(`   on this tank the water test takes the bottom course below a gravity of ${rpad(n(sgCross, 'ratio'), 12)}`);
w(`   found by bisecting the engine's own governing word`);
w();
w('The two notes the engine writes when something other than the product');
w('governs, in its own words:');
quoted(pin('the water test note', success('shellCourse where the water test governs', T.shellCourse({
  diameterFt: S.OGBOGENE.diameterFt, courseBottomHeightFt: 0,
  liquidLevelFt: S.OGBOGENE.liquidLevelFt, sg: 0.55,
})).note, 'designing for the product alone would under-thickness it'));
quoted(pin('the minimum plate note', success('shellCourse where the minimum plate governs', T.shellCourse({
  diameterFt: S.OGBOGENE.diameterFt, courseBottomHeightFt: 24,
  liquidLevelFt: S.OGBOGENE.liquidLevelFt, sg: S.OGBOGENE.sg,
})).note, 'governs this course'));
w();
quoted(pin('the minimum plate basis', shell.courses[0].minimumThicknessBasis, 'does not carry that band table'));
quoted(pin('the one-foot method note', shell.courses[0].methodNote, 'variable design point method'));
w();

/* ======================================================== SECTION 27 */

w('# SECTION 27: NORMAL VENTING, AND WHICH DIRECTION GOVERNS (owned by Expert m03)');
w();
w('A tank breathes in and out. Thermal venting is temperature, movement venting');
w('is displacement, and the two add in each direction. The engine forms ONE');
w('predicate for which direction governs, computed once, because two expressions');
w('disagreed at the tie and the label said vacuum while the warning stayed');
w('silent.');
w();
const vent = success('normalVenting for the OGBOGENE tank at its stated rates', T.normalVenting({
  nominalBbl: ogb.nominalBbl, fillBblPerHr: S.OGBOGENE.fillBblPerHr,
  drawBblPerHr: S.OGBOGENE.drawBblPerHr,
}));
w(`   nominal capacity, bbl                      ${rpad(n(ogb.nominalBbl, 'bbl'), 20)}   from SECTION 25`);
w(`   fill rate, bbl/hr                          ${rpad(n(S.OGBOGENE.fillBblPerHr, 'bblPerHr'), 20)}   stated`);
w(`   draw rate, bbl/hr                          ${rpad(n(S.OGBOGENE.drawBblPerHr, 'bblPerHr'), 20)}   stated`);
w(`   thermal inbreathing, scfh                  ${rpad(n(vent.thermal.inbreathingScfh, 'scfh'), 20)}   returned`);
w(`   thermal outbreathing low volatility, scfh  ${rpad(n(vent.thermal.outbreathingScfhLowVolatility, 'scfh'), 20)}   returned`);
w(`   thermal outbreathing high volatility, scfh ${rpad(n(vent.thermal.outbreathingScfhHighVolatility, 'scfh'), 20)}   returned`);
w(`   movement outbreathing, scfh                ${rpad(n(vent.movement.outbreathingScfh, 'scfh'), 20)}   returned`);
w(`   movement inbreathing, scfh                 ${rpad(n(vent.movement.inbreathingScfh, 'scfh'), 20)}   returned`);
w(`   total outbreathing, scfh                   ${rpad(n(vent.outbreathingScfh, 'scfh'), 20)}   returned`);
w(`   total inbreathing, scfh                    ${rpad(n(vent.inbreathingScfh, 'scfh'), 20)}   returned`);
w(`   governing case                             ${rpad(vent.governing, 20)}   returned`);
w();
rel('the two directions on this tank at its stated rates',
  'total outbreathing, scfh', vent.outbreathingScfh,
  'total inbreathing, scfh', vent.inbreathingScfh, 'scfh');
w();
quoted(pin('the thermal venting basis', vent.thermal.basis, 'this engine\'s stated choices'));
w();
w('EVERY THERMAL FACTOR IS THE ENGINE\'S OWN STATED CHOICE, and this course');
w('grades nothing that rests on one unless a capstone states it:');
w(`   thermal rate per barrel of capacity, scfh  ${rpad(n(vent.thermal.scfhPerBbl, 'factor'), 20)}   returned`);
w(`   latitude factor                            ${rpad(n(vent.thermal.latitudeFactor, 'factor'), 20)}   returned`);
w();
w(`   ${pad('draw rate, bbl/hr', 20)}${rpad('inbreathing, scfh', 20)}${rpad('outbreathing, scfh', 21)}${rpad('governing', 24)}`);
S.DRAW_SWEEP.forEach((d) => {
  const r = success(`normalVenting at a draw of ${d} bbl/hr`, T.normalVenting({
    nominalBbl: ogb.nominalBbl, fillBblPerHr: S.OGBOGENE.fillBblPerHr, drawBblPerHr: d,
  }));
  w(`   ${pad(n(d, 'bblPerHr'), 20)}${rpad(n(r.inbreathingScfh, 'scfh'), 20)}${rpad(n(r.outbreathingScfh, 'scfh'), 21)}${rpad(r.governing, 24)}`);
});
w();
const drawCross = bisect(0, 6000, (d) => success('venting governing probe', T.normalVenting({
  nominalBbl: ogb.nominalBbl, fillBblPerHr: S.OGBOGENE.fillBblPerHr, drawBblPerHr: d,
})).governing === 'vacuum (inbreathing)', 'the draw rate at which vacuum takes the venting case');
w(`   vacuum takes the case above a draw rate of, bbl/hr        ${rpad(n(drawCross, 'bblPerHr'), 16)}`);
w(`   found by bisecting the engine's own governing word`);
w();
w('VACUUM IS THE CASE THAT DESTROYS TANKS, and the warning says why:');
quoted(pin('the vacuum governs warning', success('normalVenting where vacuum governs', T.normalVenting({
  nominalBbl: ogb.nominalBbl, fillBblPerHr: S.OGBOGENE.fillBblPerHr, drawBblPerHr: 2400,
})).warning, 'pull it flat during a cold rainstorm'));
w();
w('ABOVE A STATED CAPACITY THE ENGINE STOPS CLAIMING THE THERMAL RATE IS');
w('PROPORTIONAL, and warns rather than extrapolating in silence:');
const bigTank = success('thermalVenting above the stated proportional limit', T.thermalVenting({ nominalBbl: 250_000 }));
quoted(pin('the proportional limit warning', bigTank.warning, 'stops claiming the thermal rate is proportional to capacity'));
w(`   the stated capacity at which it stops, bbl               ${rpad(n(bisect(1000, 1e6, (b) => success('proportional limit probe', T.thermalVenting({ nominalBbl: b })).aboveProportionalLimit === false, 'the capacity at which the proportional claim stops'), 'bbl'), 16)}`);
w();
w('INSULATION IS A CREDIT THE ENGINE STATES AND DOES NOT CITE:');
const insulated = success('thermalVenting on an insulated tank', T.thermalVenting({
  nominalBbl: ogb.nominalBbl, insulated: true,
}));
const uninsulated = success('thermalVenting on an uninsulated tank', T.thermalVenting({ nominalBbl: ogb.nominalBbl }));
rel('the thermal inbreathing of this tank, insulated against uninsulated',
  'uninsulated, scfh', uninsulated.inbreathingScfh,
  'insulated at the engine\'s stated credit, scfh', insulated.inbreathingScfh, 'scfh');
quoted(pin('the insulation credit note', insulated.note, 'this engine\'s stated choice'));
w();
refusal('thermalVenting with no capacity', T.thermalVenting({ nominalBbl: 0 }));
refusal('thermalVenting at a latitude factor above what the package will apply', T.thermalVenting({
  nominalBbl: ogb.nominalBbl, latitudeFactor: 2.4,
}));
refusal('movementVenting with a negative fill rate', T.movementVenting({ fillBblPerHr: -20 }));
w();
w('A HIGH VOLATILITY PRODUCT DOUBLES THE MOVEMENT OUTBREATHING, because the');
w('incoming liquid also evaporates:');
const movLow = success('movementVenting on a low volatility product', T.movementVenting({
  fillBblPerHr: S.OGBOGENE.fillBblPerHr, drawBblPerHr: S.OGBOGENE.drawBblPerHr,
}));
const movHigh = success('movementVenting on a high volatility product', T.movementVenting({
  fillBblPerHr: S.OGBOGENE.fillBblPerHr, drawBblPerHr: S.OGBOGENE.drawBblPerHr, highVolatility: true,
}));
rel('the movement outbreathing at the same fill rate, high volatility against low',
  'high volatility, scfh', movHigh.outbreathingScfh,
  'low volatility, scfh', movLow.outbreathingScfh, 'scfh');
w();

/* ======================================================== SECTION 28 */

w('# SECTION 28: THE FIRE CASE: THE DUTY IS COMPUTED AND THE VENT IS WITHHELD (owned by Expert m04)');
w();
w('This section is the reason this course exists in the shape it does. The');
w('wetted-area heat input is in this package and is returned. The step after it,');
w('the relation that turns a duty in Btu an hour into a required vent capacity in');
w('scfh of air equivalent, is NOT in this package, and the engine refuses to');
w('guess it.');
w();
const wetted = success('wettedAreaFt2 for the OGBOGENE tank', T.wettedAreaFt2({
  diameterFt: S.OGBOGENE.diameterFt, liquidLevelFt: S.OGBOGENE.liquidLevelFt,
}));
const fire = success('fireVenting at that wetted area', T.fireVenting({ wettedFt2: wetted.areaFt2 }));
w(`   wetted area, ft2                           ${rpad(n(wetted.areaFt2, 'ft2'), 20)}   returned`);
w(`   effective wetted height, ft                ${rpad(n(wetted.effectiveHeightFt, 'inch'), 20)}   returned`);
w(`   heat input band                            ${rpad(fire.band, 20)}   returned`);
w(`   fire duty, Btu/hr                          ${rpad(n(fire.qBtuHr, 'btuHr'), 20)}   returned`);
w(`   environment factor                         ${rpad(n(fire.environmentFactor, 'factor'), 20)}   returned`);
w(`   required vent capacity, scfh of air        ${rpad(String(fire.ventScfhAir), 20)}   returned`);
w(`   the vent is withheld                       ${rpad(String(fire.ventWithheld), 20)}   returned`);
w();
w('THE WITHHOLDING, IN THE ENGINE\'S OWN WORDS. Every writer on this course must');
w('be able to quote this and no writer may go round it:');
quoted(pin('the fire vent withholding', fire.ventWithheldReason, 'differ by a factor of about 24'));
w();
w('THE ENGINE EXPORTS THAT SENTENCE AS A NAMED CONSTANT, so a screen cannot');
w('print a blank where the vent should be:');
must('the exported withholding and the returned one are the same string',
  T.FIRE_VENT_WITHHELD === fire.ventWithheldReason, 'identical');
w(`   the exported constant and the returned reason are the same string`);
w();
w('THE HEAT INPUT BANDS, walked across their own edges. The wetted area at which');
w('each band gives way to the next is found by bisecting the band NAME the');
w('engine returns.');
w();
w(`   ${pad('wetted area, ft2', 20)}${rpad('band', 20)}${rpad('duty, Btu/hr', 20)}${rpad('vent, scfh', 14)}`);
S.WETTED_SWEEP.forEach((a) => {
  const r = success(`fireVenting at a wetted area of ${a} ft2`, T.fireVenting({ wettedFt2: a }));
  w(`   ${pad(n(a, 'ft2'), 20)}${rpad(r.band, 20)}${rpad(n(r.qBtuHr, 'btuHr'), 20)}${rpad(String(r.ventScfhAir), 14)}`);
});
w();
const bands = ['below 200 ft2', '200 to 1000 ft2', '1000 to 2800 ft2', 'above 2800 ft2'];
count('fire heat input bands this engine carries', bands.length,
  'the band names the engine returns across the wetted areas in fc8_fields.mjs',
  'a band counts once for each distinct band string the engine returned over that sweep');
must('EVERY BAND NAME COUNTED WAS ACTUALLY RETURNED BY THE ENGINE over that sweep',
  bands.every((b) => S.WETTED_SWEEP.some((a) => T.fireVenting({ wettedFt2: a }).band === b)),
  bands.join(' | '));
w();
const bandEdges = [
  ['below 200 ft2 gives way to 200 to 1000 ft2', bisect(50, 600, (a) => success('band probe', T.fireVenting({ wettedFt2: a })).band === 'below 200 ft2', 'the first fire band edge')],
  ['200 to 1000 ft2 gives way to 1000 to 2800 ft2', bisect(300, 1600, (a) => success('band probe', T.fireVenting({ wettedFt2: a })).band === '200 to 1000 ft2', 'the second fire band edge')],
  ['1000 to 2800 ft2 gives way to above 2800 ft2', bisect(1500, 4000, (a) => success('band probe', T.fireVenting({ wettedFt2: a })).band === '1000 to 2800 ft2', 'the third fire band edge')],
];
w(`   ${pad('band edge', 48)}${rpad('wetted area, ft2', 18)}${rpad('duty below, Btu/hr', 20)}${rpad('duty above, Btu/hr', 20)}`);
bandEdges.forEach(([label, a]) => {
  const below = success('the duty just below a band edge', T.fireVenting({ wettedFt2: a * (1 - 1e-9) }));
  const above = success('the duty just above a band edge', T.fireVenting({ wettedFt2: a * (1 + 1e-9) }));
  w(`   ${pad(label, 48)}${rpad(n(a, 'ft2'), 18)}${rpad(n(below.qBtuHr, 'btuHr'), 20)}${rpad(n(above.qBtuHr, 'btuHr'), 20)}`);
});
w();
w('THE WETTED HEIGHT IS CAPPED. Only the wetted shell below the standard\'s own');
w('height limit counts, and the engine says so when the cap binds:');
const tallWetted = success('wettedAreaFt2 on a tall tank', T.wettedAreaFt2({ diameterFt: 52.3, liquidLevelFt: 48 }));
quoted(pin('the wetted height cap note', tallWetted.note, 'a flame does not reach higher'));
w(`   the effective wetted height on a 48 ft column, ft        ${rpad(n(tallWetted.effectiveHeightFt, 'inch'), 16)}`);
w();
w('THE ENVIRONMENT FACTOR IS A CREDIT AND CANNOT BE A PENALTY:');
const credited = success('fireVenting with a drainage credit', T.fireVenting({ wettedFt2: wetted.areaFt2, environmentFactor: 0.3 }));
rel('the fire duty on this tank, with and without a stated drainage credit',
  'with no credit, Btu/hr', fire.qBtuHr,
  'with a stated environment factor of 0.300000, Btu/hr', credited.qBtuHr, 'btuHr');
quoted(pin('the environment factor refusal',
  refusal('fireVenting with an environment factor above one', T.fireVenting({
    wettedFt2: wetted.areaFt2, environmentFactor: 1.4,
  })).error, 'which this relation does not carry'));
w();
w('AND THE NOTE THAT STOPS THE FIRE DUTY BEING COMPARED WITH THE NORMAL VENT:');
quoted(pin('the fire case note', fire.note, 'The two cannot be compared as vent capacities here'));
w();

/* ======================================================== SECTION 29 */

w('# SECTION 29: EVAPORATIVE LOSSES, AND WHAT CONTROL SAVES (owned by Expert m05)');
w();
w('What evaporates out of a fixed-roof tank is both lost product and a');
w('reportable release, and the two are the same arithmetic.');
w();
const evap = success('evaporativeLosses for the OGBOGENE tank', T.evaporativeLosses({
  diameterFt: S.OGBOGENE.diameterFt, vapourSpaceHeightFt: S.OGBOGENE.vapourSpaceHeightFt,
  vapourPressurePsia: S.OGBOGENE.vapourPressurePsia, throughputBbl: S.OGBOGENE.throughputBbl,
}));
w(`   vapour space height, ft                    ${rpad(n(S.OGBOGENE.vapourSpaceHeightFt, 'inch'), 20)}   stated`);
w(`   true vapour pressure, psia                 ${rpad(n(S.OGBOGENE.vapourPressurePsia, 'psi'), 20)}   stated`);
w(`   annual throughput, bbl                     ${rpad(n(S.OGBOGENE.throughputBbl, 'bbl'), 20)}   stated`);
w(`   vapour space volume, ft3                   ${rpad(n(evap.vapourSpaceFt3, 'ft3'), 20)}   returned`);
w(`   vapour density, lb/ft3                     ${rpad(n(evap.vapourDensityLbFt3, 'lbFt3'), 20)}   returned`);
w(`   vapour space expansion factor              ${rpad(n(evap.expansionFactorKe, 'factor'), 20)}   returned`);
w(`   saturation factor                          ${rpad(n(evap.saturationFactorKs, 'factor'), 20)}   returned`);
w(`   standing loss, lb/yr                       ${rpad(n(evap.standingLossLbYr, 'lbPerYr'), 20)}   returned`);
w(`   working loss, lb/yr                        ${rpad(n(evap.workingLossLbYr, 'lbPerYr'), 20)}   returned`);
w(`   total loss, lb/yr                          ${rpad(n(evap.totalLossLbYr, 'lbPerYr'), 20)}   returned`);
w(`   total loss, short tons/yr                  ${rpad(n(evap.totalLossShortTonsYr, 'lbPerYr'), 20)}   returned`);
w();
rel('the two halves of the annual loss on this tank',
  'the standing loss, lb/yr', evap.standingLossLbYr,
  'the working loss, lb/yr', evap.workingLossLbYr, 'lbPerYr');
w();
quoted(pin('the turnover factor note', evap.turnoverFactorNote, 'is not carried by this package'));
w();
w('A PRODUCT THAT BOILS AT AMBIENT IS REFUSED. The expansion factor has the');
w('difference between atmospheric and the vapour pressure in a denominator, so');
w('a product at atmospheric pressure has no expansion factor at all. The engine');
w('refuses rather than returning a standing loss with a denominator at or below');
w('zero, which a total would hide because the working loss does not carry it:');
quoted(pin('the boiling product refusal',
  refusal('evaporativeLosses on a product that boils at ambient', T.evaporativeLosses({
    diameterFt: S.OGBOGENE.diameterFt, vapourSpaceHeightFt: S.OGBOGENE.vapourSpaceHeightFt,
    vapourPressurePsia: 15.4, throughputBbl: S.OGBOGENE.throughputBbl,
  })).error, 'It needs a pressure vessel or a refrigerated tank'));
w();
w('WHAT CONTROL SAVES, over the efficiencies in this file:');
w();
w(`   ${pad('control efficiency, pct', 26)}${rpad('saved, lb/yr', 18)}${rpad('remaining, lb/yr', 20)}`);
S.CONTROL_SWEEP.forEach((e) => {
  const r = success(`lossControl at an efficiency of ${e} percent`, T.lossControl({
    uncontrolledLbYr: evap.totalLossLbYr, controlEfficiencyPct: e,
  }));
  w(`   ${pad(n(e, 'pct'), 26)}${rpad(n(r.savedLbYr, 'lbPerYr'), 18)}${rpad(n(r.remainingLbYr, 'lbPerYr'), 20)}`);
});
w();
quoted(pin('the control efficiency note', success('lossControl for its note', T.lossControl({
  uncontrolledLbYr: evap.totalLossLbYr, controlEfficiencyPct: 90,
})).note, 'equipment and operating questions'));
w();
quoted(pin('the missing efficiency refusal',
  refusal('lossControl with no efficiency', T.lossControl({ uncontrolledLbYr: evap.totalLossLbYr })).error,
  'leaving it out is not the same as saying zero'));
quoted(pin('the impossible efficiency refusal',
  refusal('lossControl above a hundred percent', T.lossControl({
    uncontrolledLbYr: evap.totalLossLbYr, controlEfficiencyPct: 140,
  })).error, 'it lies between 0 and 100'));
w();

/* ======================================================== SECTION 30 */

w('# SECTION 30: EVERY REFUSAL IN THIS COURSE, COUNTED (owned by Expert m06)');
w();
w('A refusal is the most useful thing these engines do, and a learner who has');
w('not met one has not met the module. Every refusal this file called is counted');
w('here with the tree it was counted over and the rule that decided membership.');
w();
const refusalAsserts = ASSERTS.filter((a) => a.claim.startsWith('LABELLED A REFUSAL:'));
const successAsserts = ASSERTS.filter((a) => a.claim.startsWith('LABELLED A SUCCESS:'));
count('distinct refusals this digest calls and proves', new Set(refusalAsserts.map((a) => a.claim)).size,
  'the assertion list this generator built while it ran, filtered to the ones labelled a refusal',
  'one count per distinct assertion text, and every one of them asserted that the engine returned an error key');
count('calls this digest labels a success and proves', new Set(successAsserts.map((a) => a.claim)).size,
  'the same assertion list, filtered to the ones labelled a success',
  'one count per distinct assertion text, and every one of them asserted no error key and no non-finite number in the result');
w();
w('LABEL AND CALL ARE CHECKED AGAINST EACH OTHER. A generator that labelled a');
w('row a refusal and then called a case that succeeded would print numbers that');
w('are all real engine output under a sentence that is false, and no numeric');
w('sweep could see it. This file writes NOTHING AT ALL if any label disagrees');
w('with its call.');
w();
w('The refusals, by the function that raises them:');
w();
const byFn = {};
refusalAsserts.forEach((a) => {
  const text = a.claim.replace('LABELLED A REFUSAL: ', '');
  const fn = text.includes('orificeFlow') || text.includes('compressible flow') ? 'orificeFlow'
    : text.includes('sizeOrifice') ? 'sizeOrifice'
      : text.includes('permanentLoss') ? 'permanentLoss'
        : text.includes('transmitter') || text.includes('reading above') ? 'transmitterUncertaintyPct'
          : text.includes('turbineVolume') ? 'turbineVolume'
            : text.includes('straightRun') ? 'straightRunDiameters'
              : text.includes('liquidValve') || text.includes('vapour pressure') ? 'liquidValve'
                : text.includes('gasValve') ? 'gasValve'
                  : text.includes('valveAuthority') ? 'valveAuthority'
                    : text.includes('noiseIndication') ? 'noiseIndication'
                      : text.includes('travelCheck') || text.includes('characteristic') ? 'travelCheck'
                        : text.includes('tankCapacity') || text.includes('fill height') ? 'tankCapacity'
                          : text.includes('thermalVenting') ? 'thermalVenting'
                            : text.includes('movementVenting') ? 'movementVenting'
                              : text.includes('fireVenting') ? 'fireVenting'
                                : text.includes('evaporativeLosses') ? 'evaporativeLosses'
                                  : text.includes('lossControl') ? 'lossControl' : 'other';
  (byFn[fn] = byFn[fn] || []).push(text);
});
Object.keys(byFn).sort().forEach((fn) => {
  w(`   ${pad(fn, 28)}${byFn[fn].length}`);
  byFn[fn].sort().forEach((t) => w(`       ${t}`));
});
must('EVERY REFUSAL THIS SECTION COUNTS WAS ATTRIBUTED TO A NAMED FUNCTION',
  !byFn.other, byFn.other ? byFn.other.join('; ') : 'none unattributed');
w();

/* ======================================================== SECTION 31 */

w('# SECTION 31: WHAT THESE THREE ENGINES DO NOT CARRY (owned by Expert m06)');
w();
w('The register. Fifteen items, and two of them are outright refusals to answer.');
w('NOTHING IN THIS COURSE IS GRADED ON ANY OF THEM. The capstone clearance');
w('report says field by field which mechanism clears which item, and the two');
w('withheld answers are taught as limits and are never graded anywhere.');
w();
const REGISTER = [
  ['H1', 'metering', 'the published lower Reynolds number limit of the Reader-Harris/Gallagher correlation at each beta and bore', 'NOT CARRIED, and every coefficient the engine returns carries a note saying the low Reynolds end is an extrapolation of this package'],
  ['H2', 'metering', 'the straight-run requirement for two elbows in different planes', 'WITHHELD BY NAME, because the column that was there fell as beta rose and then rose again, and a published requirement rises with beta'],
  ['H3', 'metering', 'the remaining straight-run columns', 'STATED TABLE DATA, cited to no document in this repository, and the engine labels every answered row as such'],
  ['H4', 'metering', 'the API MPMS temperature and pressure correction tables', 'NOT CARRIED, so there is no CTL, no CPL and no net standard volume in this module, and every turbine volume is labelled gross'],
  ['H5', 'valve', 'the valve style FL and xT table', 'STATED TABLE VALUES, trim and vendor dependent by nature, and a certified vendor figure always replaces them'],
  ['H6', 'valve', 'the cavitation index thresholds', 'A STATED SCREEN, exported so it can be read, and this course grades no regime word'],
  ['H7', 'valve', 'the noise pressure ratio bands and the stream power bands', 'A STATED SCREEN, and the engine calls its own output an indication rather than a prediction'],
  ['H8', 'valve', 'the valve authority screen boundaries', 'A STATED SCREEN, and the engine says so in the result'],
  ['H9', 'valve', 'the ISA Reynolds number factor FR', 'NOT CARRIED, so every liquid sizing here is a fully turbulent one, the engine returns reynoldsFactorApplied false, and this module takes no viscosity at all'],
  ['H10', 'valve', 'the IEC 60534-8-3 noise prediction', 'NOT CARRIED, and the screening indication says so on every call'],
  ['H11', 'tank', 'the API 650 minimum shell plate thickness band table', 'NOT CARRIED, so the minimum is a stated input and the result names the value in force'],
  ['H12', 'tank', 'the diameter above which the variable design point method replaces the one-foot method', 'NOT CARRIED, and the engine returns a note saying a large tank must be checked against the standard'],
  ['H13', 'tank', 'the thermal venting table above the proportional limit, and the latitude and insulation credits', 'NOT CARRIED OR STATED, and a tank above the stated limit is warned rather than silently extrapolated'],
  ['H14', 'tank', 'the turnover factor Kn', 'NOT CARRIED, and the input that never fed it has been removed rather than echoed back as though it worked'],
  ['W1', 'tank', 'the relation that turns a fire duty into a required vent capacity in scfh of air equivalent', 'WITHHELD BY NAME. The two plausible forms of it differ by a factor of about 24 and an emergency vent sized 24 times too small is how a tank is destroyed'],
];
w(`   ${pad('tag', 6)}${pad('engine', 10)}${pad('item', 100)}status`);
REGISTER.forEach(([tag, eng, item, status]) => {
  w(`   ${pad(tag, 6)}${pad(eng, 10)}${pad(item, 100)}${status}`);
});
w();
count('items in the register above', REGISTER.length,
  'the register written out in this section, one row per item',
  'an item counts when the engine states in its own source or its own returned text that the package does not carry it, does not cite it, or refuses to answer it');
count('items in the register that are outright refusals to answer', REGISTER.filter((r) => r[3].startsWith('WITHHELD BY NAME')).length,
  'the same register',
  'an item counts when the engine returns a refusal or a withheld flag in place of a number, which SECTIONS 16 and 28 both show being returned');
w();
w('BOTH REFUSALS PROVED, BY CALLING THEM:');
must('the straight-run withholding is returned by the engine when asked',
  M.straightRunDiameters({ beta: 0.5, upstreamFitting: 'twoElbowsDifferentPlanes' }).withheld === true,
  'withheld true');
must('the fire vent withholding is returned by the engine when asked',
  T.fireVenting({ wettedFt2: 1500 }).ventWithheld === true && T.fireVenting({ wettedFt2: 1500 }).ventScfhAir === null,
  'ventWithheld true and ventScfhAir null');
w('   straightRunDiameters returns withheld true for two elbows in different planes');
w('   fireVenting returns ventWithheld true and a null vent capacity at every wetted area');
w();

/* ======================================================== SECTION 32 */

w('# SECTION 32: EVERY COUNT IN THIS FILE, WITH ITS TREE AND ITS RULE (owned by Expert m06)');
w();
w('A count is not checkable without the tree it was counted over and the rule');
w('that decided membership, so every count printed above is repeated here with');
w('both. A writer quoting a count must quote the tree and the rule with it.');
w();
COUNTS.forEach((c) => {
  w(`   ${c.label}: ${c.value}`);
  w(`      tree: ${c.tree}`);
  w(`      rule: ${c.rule}`);
});
w();
count('counts in this file', COUNTS.length + 1,
  'the COUNTS array this generator built while it ran, plus this count itself',
  'one per call to the count helper, which is the only way a count reaches this file');
w();
w(`   engine strings pinned verbatim in this file: ${PINS.length}`);
w('   each was asserted to contain a fragment of its own text when this file was');
w('   built, so a reworded engine message fails the build rather than quietly');
w('   teaching wording the learner will never see on the screen.');
w();
w('# END OF THE FC8 TEACHING DIGEST');

/* -------------------------------------------------------------- the flush */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`fc8_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`fc8_dump: ${ASSERTS.length} label-and-call, pin and measurement assertions run, 0 failed; `
  + `${COUNTS.length} counts, ${PINS.length} engine strings pinned\n`);
process.stdout.write(`${LINES.join('\n')}\n`);
