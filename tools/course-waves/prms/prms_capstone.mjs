// THE THREE EC11 CAPSTONES AND THEIR EIGHTEEN GRADED FIELDS.
//
// Every graded value is a RETURN VALUE of the vendored engine
// (engines/economics/prms.js, with the computeCashFlow and applyJV it imports
// from engines/economics/cashflow.ts, the closed-form distribution readers and
// the canonical sampler it imports from lib/stats/stats.js and the labels it
// imports from lib/conventions/percentile.js) on the inputs typed below.
// Nothing here computes a chance, a category, a cash flow, a volume, a sum or
// a reconciliation by its own arithmetic: every number is read off an engine
// result object, and discriminate.mjs is where the wrong methods live.
//
//   ABAGANA  Associate     classes, categories and the low estimate: the
//                          chance of commerciality of a prospect and of a
//                          lead, the Probable and Possible increments of a
//                          Reserves category set stated cumulatively, and the
//                          2C and 3C of a Contingent Resources set stated
//                          incrementally
//   AWKUZU   Professional  maturity, commerciality and the economic limit:
//                          the best case's undiscounted net cash flow and NPV
//                          at the working interest, the 2P net entitlement
//                          oil, the P2 and P3 increments in BOE with the low
//                          case failing the economic test (1P = 0), and the
//                          high case's oil beyond the licence
//   ISUOFIA  Expert        aggregation, reconciliation and the limits: the
//                          arithmetic 1P and 3P of three Reserves projects,
//                          the risked mean of three Contingent Resources
//                          projects, and a reconciliation's computed closing
//                          1P and 3P and its 2P difference
//
// THE CASES ARE EKENE SYNTHETIC FIELDS OF THEIR OWN, typed here with their own
// projects, chances, estimates, forecasts, prices, costs, terms, distributions
// and movements, none of them the digest's. Their names, terms and values must
// never enter a lesson, a bank, a panel default or a brief
// (gate_capstone_leak.mjs).
//
// EVERY FIELD IS FREE OF EVERY STATED READING AND OF EVERY DRAW. The engine
// states its readings (the five-year benchmark met at five years; an
// undiscounted net cash flow of exactly 0 not economic; the economic test
// after the abandonment cost; the canonical trailing
// trim as the economic limit, refused where the PRMS cumulative peak
// disagrees; the replacement ratio over every movement other than production;
// the life index on the best estimate; a reconciliation difference equal to
// the tolerance closing; the Monte Carlo low at the 0.1 quantile). This file
// runs every capstone again through the engine with the OTHER side of each
// (ts_loader.mjs reading_* variants) and ASSERTS that every graded value comes
// out bit-identical. The aggregate calls do run the seeded Monte Carlo, and no
// graded field reads a Monte Carlo figure: this file also runs them on a
// second seed and asserts every graded value bit-identical.
//
// THE CARE RULES, all asserted below:
//   * ONE ANSWER. Every graded value is finite, non-zero and not a whole number.
//   * EVERY TERM IS STATED. Every input a value depends on is in the case,
//     printed by --inputs for the capstone brief and the case files.
//   * NO COLLISION. No two graded values sit within one tolerance of each other.
//
// Usage:
//   node prms_capstone.mjs            the human table
//   node prms_capstone.mjs --json     the rows make_fields.mjs writes
//   node prms_capstone.mjs --inputs   the three cases, for gen_course.py,
//                                     discriminate.mjs, oracle_check.py and
//                                     gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST, and the digest generator reads nothing here.
import process from 'node:process';

const HERE = process.env.EC11_WAVE_DIR || '/root/cat-wip-prms';
const { P, variant } = await import(`${HERE}/prms_engine.mjs`);
const TOLPATH = process.env.EC11_TOLERANCE
  || '/root/wt-ec11-nextgen/src/components/course/panels/prms/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const clone = (o) => JSON.parse(JSON.stringify(o));
const ok = (label, r) => {
  if (!r || r.error) throw new Error(`${label} was refused: ${r && r.error}`);
  return r;
};

/* ====================================================== ABAGANA, Associate

   The Abagana licence (synthetic). An undiscovered prospect and a lead, each
   with a stated chance of geologic discovery and chance of development; a
   producing field's Reserves stated cumulatively (1P, 2P, 3P); a discovery's
   Contingent Resources stated incrementally (C1, C2, C3). */

const ABAGANA = {
  name: 'ABAGANA',
  label: 'ABAGANA, the resources of the Abagana licence (synthetic)',
  'classify:prospect': {
    name: 'Abagana Deep prospect (synthetic)',
    discovery: 'undiscovered',
    recoveryProject: 'established-technology',
    subClass: 'prospect',
    chances: { geologicDiscoveryPct: 23.5, developmentPct: 61.3 },
  },
  'classify:lead': {
    name: 'Abagana Shallow lead (synthetic)',
    discovery: 'undiscovered',
    recoveryProject: 'established-technology',
    subClass: 'lead',
    chances: { geologicDiscoveryPct: 12.25, developmentPct: 47.5 },
  },
  'categorize:reserves': {
    resourceClass: 'reserves',
    method: 'cumulative',
    estimates: { low: 11.35, best: 18.62, high: 27.415 },
    unit: 'MMbbl',
  },
  'categorize:contingent': {
    resourceClass: 'contingent',
    method: 'incremental',
    estimates: { first: 4.215, second: 3.37, third: 5.605 },
    unit: 'MMboe',
  },
};

/* ================================================== AWKUZU, Professional

   The Awkuzu field (synthetic), 57.5 percent working interest. Three
   technical forecasts from 2029 to 2044 (oil in barrels, gas in Mscf), flat
   prices, flat opex, two capital years and an abandonment cost; a 12.5
   percent royalty interest and a 32.5 percent tax with five-year allowances
   and loss carry forward; the licence expires in 2041 with no renewal
   expected. Reported on the net-entitlement basis at 6 Mscf per BOE. */

const AWK_YEARS = Array.from({ length: 16 }, (_, t) => 2029 + t);
const AWKUZU = {
  name: 'AWKUZU',
  label: 'AWKUZU, the economic limit of the Awkuzu field (synthetic)',
  economicLimit: {
    effectiveYear: 2029,
    forecasts: {
      low: [
        { year: 2029, oil: 1180000, gas: 767000 }, { year: 2030, oil: 920400, gas: 598260 },
        { year: 2031, oil: 717912, gas: 466642.75 }, { year: 2032, oil: 559971.25, gas: 363981.25 },
        { year: 2033, oil: 436777.75, gas: 283905.5 }, { year: 2034, oil: 340686.5, gas: 221446.25 },
        { year: 2035, oil: 265735.5, gas: 172728 }, { year: 2036, oil: 207273.75, gas: 134728 },
        { year: 2037, oil: 161673.5, gas: 105087.75 }, { year: 2038, oil: 126105.25, gas: 81968.5 },
        { year: 2039, oil: 98362.25, gas: 63935.5 }, { year: 2040, oil: 76722.5, gas: 49869.75 },
        { year: 2041, oil: 59843.5, gas: 38898.25 }, { year: 2042, oil: 46678, gas: 30340.75 },
        { year: 2043, oil: 36408.75, gas: 23665.75 }, { year: 2044, oil: 28398.75, gas: 18459.25 },
      ],
      best: [
        { year: 2029, oil: 1725000, gas: 1121250 }, { year: 2030, oil: 1483500, gas: 964275 },
        { year: 2031, oil: 1275810, gas: 829276.5 }, { year: 2032, oil: 1097196.5, gas: 713177.75 },
        { year: 2033, oil: 943589, gas: 613332.75 }, { year: 2034, oil: 811486.5, gas: 527466.25 },
        { year: 2035, oil: 697878.5, gas: 453621 }, { year: 2036, oil: 600175.5, gas: 390114 },
        { year: 2037, oil: 516151, gas: 335498.25 }, { year: 2038, oil: 443889.75, gas: 288528.25 },
        { year: 2039, oil: 381745.25, gas: 248134.5 }, { year: 2040, oil: 328301, gas: 213395.75 },
        { year: 2041, oil: 282338.75, gas: 183520.25 }, { year: 2042, oil: 242811.25, gas: 157827.25 },
        { year: 2043, oil: 208817.75, gas: 135731.5 }, { year: 2044, oil: 179583.25, gas: 116729 },
      ],
      high: [
        { year: 2029, oil: 2140000, gas: 1391000 }, { year: 2030, oil: 1926000, gas: 1251900 },
        { year: 2031, oil: 1733400, gas: 1126710 }, { year: 2032, oil: 1560060, gas: 1014039 },
        { year: 2033, oil: 1404054, gas: 912635 }, { year: 2034, oil: 1263648.5, gas: 821371.5 },
        { year: 2035, oil: 1137283.75, gas: 739234.5 }, { year: 2036, oil: 1023555.25, gas: 665311 },
        { year: 2037, oil: 921199.75, gas: 598779.75 }, { year: 2038, oil: 829079.75, gas: 538901.75 },
        { year: 2039, oil: 746171.75, gas: 485011.75 }, { year: 2040, oil: 671554.75, gas: 436510.5 },
        { year: 2041, oil: 604399.25, gas: 392859.5 }, { year: 2042, oil: 543959.25, gas: 353573.5 },
        { year: 2043, oil: 489563.25, gas: 318216 }, { year: 2044, oil: 440607, gas: 286394.5 },
      ],
    },
    prices: AWK_YEARS.map((year) => ({ year, oil: 62.5, gas: 2.85 })),
    costs: {
      opex: AWK_YEARS.map((year) => ({ year, amount: 21500000 })),
      capex: [{ year: 2029, amount: 96400000 }, { year: 2030, amount: 38250000 }],
      abandonment: 27500000,
    },
    royalty: { ratePct: 12.5, form: 'royalty-interest' },
    tax: { ratePct: 32.5, depreciationYears: 5, lossCarryforward: true },
    workingInterestPct: 57.5,
    licence: { expiryYear: 2041, renewalExpected: false },
    reportingBasis: 'net-entitlement',
    discountRatePct: 10,
    mscfPerBoe: 6,
  },
};

/* ======================================================= ISUOFIA, Expert

   The Isuofia field (synthetic). Three Reserves projects with stated
   distributions (a lognormal, a normal and a triangular) aggregated at the
   field level; three Contingent Resources projects with stated distributions
   and chances of commerciality; and a year's reconciliation of the field's
   Reserves in millions of barrels. */

const ISUOFIA = {
  name: 'ISUOFIA',
  label: 'ISUOFIA, the aggregation and reconciliation of the Isuofia field (synthetic)',
  'aggregate:reserves': {
    resourceClass: 'reserves',
    level: 'field',
    unit: 'MMbbl',
    projects: [
      { id: 'ISF-1', name: 'Isuofia Main (synthetic)', distribution: { type: 'lognormal', mean: 7.35, stdDev: 2.15 } },
      { id: 'ISF-2', name: 'Isuofia North (synthetic)', distribution: { type: 'normal', mean: 5.42, stdDev: 0.87 } },
      { id: 'ISF-3', name: 'Isuofia East (synthetic)', distribution: { type: 'triangular', min: 2.1, mode: 3.65, max: 6.4 } },
    ],
    correlation: { type: 'uniform', rho: 0.35 },
    seed: 20291204,
    iterations: 5000,
  },
  'aggregate:contingent': {
    resourceClass: 'contingent',
    level: 'field',
    unit: 'MMboe',
    projects: [
      { id: 'ISF-4', name: 'Isuofia West gas (synthetic)', distribution: { type: 'triangular', min: 1.8, mode: 3.2, max: 7.9 }, chanceOfCommercialityPct: 55.5 },
      { id: 'ISF-5', name: 'Isuofia Deep appraisal (synthetic)', distribution: { type: 'lognormal', mean: 4.65, stdDev: 1.9 }, chanceOfCommercialityPct: 38.25 },
      { id: 'ISF-6', name: 'Isuofia South infill (synthetic)', distribution: { type: 'normal', mean: 2.95, stdDev: 0.6 }, chanceOfCommercialityPct: 71.4 },
    ],
    correlation: { type: 'uniform', rho: 0.2 },
    seed: 20291205,
    iterations: 5000,
  },
  reconcile: {
    resourceClass: 'reserves',
    unit: 'MMbbl',
    periodYears: 1,
    opening: { low: 24.6, best: 33.85, high: 45.2 },
    movements: [
      { type: 'production', quantity: 2.35 },
      { type: 'revisions', low: 0.42, best: -0.31, high: -1.05 },
      { type: 'extensions-and-discoveries', low: 1.15, best: 2.4, high: 3.95 },
      { type: 'divestments', low: 0.8, best: 1.1, high: 1.45 },
      { type: 'transfers', low: 2.2, best: 3.35, high: 4.6, note: 'Isuofia West oil moved from Contingent Resources (synthetic)' },
    ],
    closing: { low: 25.3, best: 36.1, high: 49.35 },
    tolerance: 0.001,
  },
};

export const CASES = { ABAGANA, AWKUZU, ISUOFIA };

/* ------------------------------------------------------ the engine routes

   READ[key] = [case, (E) => value]: the value the key names, read off the
   engine module E. The true engine is P; discriminate.mjs passes a variant. */

const abP = (E) => ok('classify', E.classify(clone(ABAGANA['classify:prospect'])));
const abL = (E) => ok('classify', E.classify(clone(ABAGANA['classify:lead'])));
const abR = (E) => ok('categorize', E.categorize(clone(ABAGANA['categorize:reserves'])));
const abC = (E) => ok('categorize', E.categorize(clone(ABAGANA['categorize:contingent'])));
const awE = (E) => ok('economicLimit', E.economicLimit(clone(AWKUZU.economicLimit)));
const isR = (E) => ok('aggregate', E.aggregate(clone(ISUOFIA['aggregate:reserves'])));
const isC = (E) => ok('aggregate', E.aggregate(clone(ISUOFIA['aggregate:contingent'])));
const isQ = (E) => ok('reconcile', E.reconcile(clone(ISUOFIA.reconcile)));
const inc = (r, label) => r.incremental.find((x) => x.label === label).value;
const cum = (r, label) => r.cumulative.find((x) => x.label === label).value;

export const READ = {
  abagana_prospect_pc_pct: ['ABAGANA', (E) => abP(E).chanceOfCommercialityPct],
  abagana_lead_pc_pct: ['ABAGANA', (E) => abL(E).chanceOfCommercialityPct],
  abagana_reserves_p2: ['ABAGANA', (E) => inc(abR(E), 'Probable (P2)')],
  abagana_reserves_p3: ['ABAGANA', (E) => inc(abR(E), 'Possible (P3)')],
  abagana_contingent_2c: ['ABAGANA', (E) => cum(abC(E), '2C')],
  abagana_contingent_3c: ['ABAGANA', (E) => cum(abC(E), '3C')],
  awkuzu_best_ncf_share: ['AWKUZU', (E) => awE(E).cases.best.undiscountedNetCashFlowShare],
  awkuzu_best_npv_share: ['AWKUZU', (E) => awE(E).cases.best.npvShare],
  awkuzu_2p_net_oil: ['AWKUZU', (E) => awE(E).reserves.cumulative['2P'].oil],
  awkuzu_p2_boe: ['AWKUZU', (E) => awE(E).reserves.incremental.P2.boe],
  awkuzu_p3_boe: ['AWKUZU', (E) => awE(E).reserves.incremental.P3.boe],
  awkuzu_high_beyond_licence_oil: ['AWKUZU', (E) => awE(E).cases.high.beyondLicence.oil],
  isuofia_reserves_arith_1p: ['ISUOFIA', (E) => isR(E).arithmetic.low],
  isuofia_reserves_arith_3p: ['ISUOFIA', (E) => isR(E).arithmetic.high],
  isuofia_contingent_risked_mean: ['ISUOFIA', (E) => isC(E).riskedMean],
  isuofia_closing_1p: ['ISUOFIA', (E) => isQ(E).computedClosing.low],
  isuofia_closing_3p: ['ISUOFIA', (E) => isQ(E).computedClosing.high],
  isuofia_difference_2p: ['ISUOFIA', (E) => isQ(E).difference.best],
};

/** The other side of each reading the engine states in prms.js. No graded value may move under any of them. */
export const OPEN_READINGS = ['reading_time_frame_exclusive', 'reading_economic_at_zero', 'reading_economic_test_before_adr', 'reading_limit_at_prms_peak',
  'reading_replacement_additions_only', 'reading_life_index_on_low', 'reading_tolerance_exclusive', 'reading_mc_low_at_high_quantile'];

/* ------------------------------------------------------------ the checks */

const KEYS = GRADED_FIELDS.map(([, k]) => k);
must('READ carries exactly the eighteen graded keys, in order', JSON.stringify(Object.keys(READ)) === JSON.stringify(KEYS), Object.keys(READ).join(','));
const rows = GRADED_FIELDS.map(([tier, key, cls]) => {
  const value = READ[key][1](P);
  return { tier, key, cls, value, tol: gradedTolerance(key), case: READ[key][0] };
});
rows.forEach((r) => {
  must(`ONE ANSWER: ${r.key} is finite`, Number.isFinite(r.value), r.value);
  must(`ONE ANSWER: ${r.key} is not zero`, r.value !== 0, r.value);
  must(`ONE ANSWER: ${r.key} is not a whole number`, !Number.isInteger(r.value), r.value);
  must(`PRINTABLE: ${r.key} prints at six decimals in fewer than sixteen significant digits`, r.value.toFixed(6).replace(/^-/, '').replace('.', '').replace(/^0+/, '').length <= 15, r.value.toFixed(6));
});
for (let i = 0; i < rows.length; i += 1) {
  for (let j = i + 1; j < rows.length; j += 1) {
    must(`NO COLLISION: ${rows[i].key} and ${rows[j].key}`, Math.abs(rows[i].value - rows[j].value) > Math.max(rows[i].tol, rows[j].tol), `${rows[i].value} ${rows[j].value}`);
  }
}
// Every stated reading leaves every graded value bit-identical.
for (const name of OPEN_READINGS) {
  const V = await variant(name);
  rows.forEach((r) => {
    const v = READ[r.key][1](V);
    must(`READING-FREE: ${r.key} under ${name}`, Object.is(v, r.value), `${v} against ${r.value}`);
  });
}
// No graded value is a draw: the two aggregate calls on another seed and another draw count.
{
  const saved = [ISUOFIA['aggregate:reserves'].seed, ISUOFIA['aggregate:contingent'].seed, ISUOFIA['aggregate:reserves'].iterations, ISUOFIA['aggregate:contingent'].iterations];
  ISUOFIA['aggregate:reserves'].seed = 7; ISUOFIA['aggregate:contingent'].seed = 8;
  ISUOFIA['aggregate:reserves'].iterations = 1000; ISUOFIA['aggregate:contingent'].iterations = 1000;
  try {
    rows.filter((r) => r.case === 'ISUOFIA').forEach((r) => {
      const v = READ[r.key][1](P);
      must(`DRAW-FREE: ${r.key} on another seed and draw count`, Object.is(v, r.value), `${v} against ${r.value}`);
    });
  } finally {
    [ISUOFIA['aggregate:reserves'].seed, ISUOFIA['aggregate:contingent'].seed, ISUOFIA['aggregate:reserves'].iterations, ISUOFIA['aggregate:contingent'].iterations] = saved;
  }
}

// SCENARIO CLAIMS the capstone briefs make, each asserted.
const abp = abP(P);
const abl = abL(P);
must('ABAGANA: the prospect and the lead are Prospective Resources with their stated sub-classes', abp.class === 'Prospective Resources' && abp.subClass === 'prospect' && abl.class === 'Prospective Resources' && abl.subClass === 'lead', `${abp.class} ${abl.class}`);
must('ABAGANA: the Reserves are stated cumulatively and the Contingent Resources incrementally', abR(P).method === 'cumulative' && abC(P).method === 'incremental', 'methods');
const awe = awE(P);
must('AWKUZU: the best case is economic, so the project is Reserves', awe.reserves !== null && awe.cases.best.economic, awe.status);
must('AWKUZU: the low case fails the economic test, so 1P = 0 and the P2 increment is the whole 2P', awe.reserves.provedZero === true && awe.reserves.cumulative['1P'].boe === 0 && !awe.cases.low.economic, JSON.stringify(awe.reserves.cumulative['1P']));
must('AWKUZU: the low case fails well away from 0 (the reading at exactly 0 cannot act)', awe.cases.low.undiscountedNetCashFlow < -1e6, awe.cases.low.undiscountedNetCashFlow);
must('AWKUZU: the best case is cut by the canonical economic limit before the licence expiry', awe.cases.best.yearsTrimmed > 0 && awe.cases.best.economicLimitYear < 2041, `${awe.cases.best.economicLimitYear} ${awe.cases.best.yearsTrimmed}`);
must('AWKUZU: the high case runs to the licence expiry and has oil beyond it', awe.cases.high.economicLimitYear === 2041 && awe.cases.high.beyondLicence.oil > 0 && awe.cases.high.licenceCutYear === 2041, JSON.stringify(awe.cases.high.beyondLicence));
must('AWKUZU: the forecasts carry gas, so BOE differs from oil', awe.reserves.incremental.P2.boe > awe.reserves.incremental.P2.oil, 'gas');
const isr = isR(P);
must('ISUOFIA: the Reserves aggregate at the field level, where statistical aggregation may be reported', isr.reportable === 'arithmetic-or-statistical' && isr.level === 'field', isr.reportable);
must('ISUOFIA: the Reserves projects state a lognormal, a normal and a triangular', JSON.stringify(isr.projects.map((p) => p.distribution.type)) === '["lognormal","normal","triangular"]', 'types');
const isc = isC(P);
must('ISUOFIA: the Contingent Resources carry a risked mean below their sum of means', isc.riskedMean !== null && isc.riskedMean < isc.sumOfMeans, `${isc.riskedMean} ${isc.sumOfMeans}`);
const isq = isQ(P);
must('ISUOFIA: the reconciliation does not close at 2P and its computed closing stays in order', !isq.closes && !isq.orderViolation, `${isq.closes} ${isq.orderViolation}`);
must('ISUOFIA: the reconciliation carries all five movement types it states', Object.keys(isq.byType).length === 5, Object.keys(isq.byType).join(','));

/* ------------------------------------------------------------ the output */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`prms_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED\n`);
  if (process.argv.includes('--show')) rows.forEach((r) => console.log(`${r.tier.padEnd(13)} ${r.key.padEnd(36)} ${String(r.value)}`));
  process.exit(1);
}
const MAIN = import.meta.url === `file://${process.argv[1]}`;
if (MAIN && process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(rows.map(({ tier, key, cls, value }) => ({ tier, key, cls, value })))}\n`);
} else if (MAIN && process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify(CASES)}\n`);
} else if (MAIN) {
  rows.forEach((r) => console.log(`${r.tier.padEnd(13)} ${r.key.padEnd(36)} ${String(r.value).padEnd(24)} tol ${r.tol}`));
  console.log(`prms_capstone: ${ASSERTS.length} assertions, 0 failed; ${OPEN_READINGS.length} stated readings and a second seed, every field bit-identical under each`);
}
