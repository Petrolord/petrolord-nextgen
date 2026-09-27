// THE THREE EC9 CAPSTONES AND THEIR EIGHTEEN GRADED FIELDS.
//
// Every graded value is a RETURN VALUE of the vendored engine
// (engines/economics/jointVenture.js, with the applyPSC and npv it imports
// from engines/economics/cashflow.ts and the calculatePartnerCosts it imports
// from engines/economics/afe.js) on the agreement terms typed below. Nothing
// here computes an interest, a call, an overhead charge, a recovery, a premium
// or a present value by its own arithmetic: every number is read off an engine
// result object, and discriminate.mjs is where the wrong methods live.
//
//   IDUMU    Associate     interests and the joint account: a carrier's paying
//                          interest, two months of one partner's cash calls
//                          (a called month with an adjustment, and the month
//                          after a month below the no-call threshold), the
//                          allowed budget overrun, and the operating and
//                          development overhead on a marginal scale
//   OKWELLE  Professional  recovery, default and cost recovery: the carry
//                          balance after a year with a compound uplift, a back-in refund
//                          under PIA s.85(4) received by one partner, the
//                          default interest compounded monthly and one
//                          party's cover, a cash call in the reconciliation
//                          ledger, and a year's PSC cost recovered
//   ABIAMA   Expert        sole risk and reading the engine: a non-consent
//                          premium and the payout year's receipt (reversion), a buy-in
//                          apportioned to one consenting party, a carrier's
//                          NPV through the canonical npv, a year's government
//                          profit oil under a per-year contractor share, and
//                          an interest after forfeiture
//
// THE CASES ARE EKENE SYNTHETIC JOINT VENTURES OF THEIR OWN, typed here with
// their own parties, interests, months, budgets, costs and terms, none of them
// the digest's. Their names, terms and values must never enter a lesson, a
// bank, a panel default or a brief (gate_capstone_leak.mjs).
//
// EVERY FIELD IS FREE OF EVERY STATED READING. The engine states three
// readings (the PSC income tax on the contractor's profit oil; a default cured
// after a stated grace carries interest from the due date, as the Kenya Model
// PSC 2015 prints; the default cover in proportion to the paying interests of
// the non-defaulting parties). This file runs every capstone again through the
// engine with the OTHER side of each reading (ts_loader.mjs reading_*
// variants) and ASSERTS that every graded value comes out bit-identical.
//
// THE CARE RULES, all asserted below:
//   * ONE ANSWER. Every graded value is finite, non-zero and not a whole number.
//   * EVERY TERM IS STATED. Every input a value depends on is in the case,
//     printed by --inputs for the capstone brief and the case files.
//   * NO COLLISION. No two graded values sit within one tolerance of each other.
//
// Usage:
//   node joa_capstone.mjs            the human table
//   node joa_capstone.mjs --json     the rows make_fields.mjs writes
//   node joa_capstone.mjs --inputs   the three cases, for gen_course.py,
//                                    discriminate.mjs, oracle_check.py and
//                                    gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST, and the digest generator reads nothing here.
import process from 'node:process';

const HERE = process.env.EC9_WAVE_DIR || '/root/cat-wip-joa';
const { J, variant } = await import(`${HERE}/joa_engine.mjs`);
const TOLPATH = process.env.EC9_TOLERANCE
  || '/root/wt-ec9-nextgen/src/components/course/panels/joa/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const clone = (o) => JSON.parse(JSON.stringify(o));
const ok = (label, r) => {
  if (!r || r.error) throw new Error(`${label} was refused: ${r && r.error}`);
  return r;
};

/* ======================================================= IDUMU, Associate

   The Idumu satellite joint venture on the Ekene licence (synthetic): four
   parties, the state participant carried for 80 percent of its cost share,
   pro rata. Six months of 2029 cash calls with a one-month reconciliation
   lag, a stated no-call threshold and a negative call refunded; the 2029
   appraisal budget against a 10 percent item tolerance and the lower of 4
   percent and a stated amount; and the 2031 overhead on a marginal scale per
   category with a stated exclusion. */

const ID_PARTIES = [
  { id: 'IOP', name: 'Idumu Operating (synthetic), operator', participatingPct: 42.5 },
  { id: 'KAP', name: 'Kapa Energy (synthetic)', participatingPct: 23.75 },
  { id: 'ZED', name: 'Zedora Energy (synthetic)', participatingPct: 18.75 },
  { id: 'SNP', name: 'State participant (synthetic)', participatingPct: 15 },
];
const ID_CARRIES = [{ carried: 'SNP', carriedPct: 80, carriers: 'pro-rata' }];
const IDUMU = {
  name: 'IDUMU',
  label: 'IDUMU, the Idumu satellite joint venture on the Ekene licence (synthetic)',
  interests: { parties: ID_PARTIES, carries: ID_CARRIES },
  cashCalls: {
    parties: ID_PARTIES,
    carries: ID_CARRIES,
    reconciliationLagMonths: 1,
    negativeCall: 'refund',
    noCallBelow: 750000,
    months: [
      { month: '2029-03', forecast: 5250000, actual: 4812500.5 },
      { month: '2029-04', forecast: 7125000, actual: 7390250.25 },
      { month: '2029-05', forecast: 6480000, actual: 6915125.5 },
      { month: '2029-06', forecast: 8905500, actual: 8212750.75 },
      { month: '2029-07', forecast: 620000, actual: 704300.25 },
      { month: '2029-08', forecast: 9240000, actual: 9011000.5 },
    ],
  },
  budget: {
    itemTolerancePct: 10,
    budgetTolerance: { pct: 4, amount: 3500000 },
    unbudgetedAllowance: 400000,
    items: [
      { item: 'subsurface studies', approved: 7850000, actual: 8535500.5 },
      { item: 'appraisal well Idumu-2', approved: 41600000, actual: 46212750.25 },
      { item: 'facilities concept', approved: 9400000, actual: 8975250 },
      { item: 'logistics and marine', approved: 12300000, actual: 12960400.75 },
      { item: 'general and administration', approved: 3950012.5, actual: 4012300.5 },
      { item: 'community baseline study', approved: 0, actual: 180250 },
    ],
  },
  overhead: {
    costs: { exploration: 4275500.5, operating: 68412250.25, development: 136950000.75 },
    excluded: { operating: 2860000 },
    scale: {
      exploration: { bands: [{ upTo: 25000000, pct: 2.4 }], abovePct: 0 },
      operating: { bands: [{ upTo: 50000000, pct: 2.6 }, { upTo: 110000000, pct: 1.1 }], abovePct: 0.5 },
      development: { bands: [{ upTo: 60000000, pct: 2.4 }, { upTo: 120000000, pct: 1.2 }], abovePct: 0.6 },
    },
  },
};

/* ================================================== OKWELLE, Professional

   The Okwelle gas-condensate joint venture (synthetic): four parties, the
   state participant carried in full through appraisal and development, pro
   rata, the carry recovered with a stated 7.5 percent compound uplift from at
   most 60 percent of its share of the entitlement; nine months of 2030 cash
   calls with a two-month lag, a threshold and a credit carried; the state
   participant's back-in under PIA s.85(4); a partner's default on the June
   2030 cash call with interest compounded monthly at a stated rate and no
   grace; and a production sharing variant of the same field with its cost
   oil limit stated on gross revenue. */

const OK_PARTIES = [
  { id: 'OKO', name: 'Okwelle Operating (synthetic), operator', participatingPct: 35 },
  { id: 'PRA', name: 'Partner Ranu A (synthetic)', participatingPct: 27.5 },
  { id: 'PRB', name: 'Partner Ranu B (synthetic)', participatingPct: 22.5 },
  { id: 'NCP', name: 'State participant (synthetic)', participatingPct: 15 },
];
const OK_CARRIES = [{ carried: 'NCP', carriedPct: 100, carriers: 'pro-rata' }];
const OKWELLE = {
  name: 'OKWELLE',
  label: 'OKWELLE, the Okwelle gas-condensate joint venture (synthetic)',
  carry: {
    parties: OK_PARTIES,
    carries: OK_CARRIES,
    carried: 'NCP',
    basis: 'contract',
    uplift: { type: 'compound', ratePctPerYear: 7.5 },
    recoverFromPct: 60,
    years: [
      { year: 2028, cost: 96500000.4, entitlement: 0 },
      { year: 2029, cost: 71250000, entitlement: 0 },
      { year: 2030, cost: 18400000, entitlement: 88400000 },
      { year: 2031, cost: 0, entitlement: 102750000.4 },
      { year: 2032, cost: 0, entitlement: 97300000 },
      { year: 2033, cost: 0, entitlement: 90150000.25 },
      { year: 2034, cost: 0, entitlement: 83600000 },
      { year: 2035, cost: 0, entitlement: 77250000 },
    ],
  },
  cashCalls: {
    parties: OK_PARTIES,
    carries: OK_CARRIES,
    reconciliationLagMonths: 2,
    negativeCall: 'carry',
    noCallBelow: 1000000,
    months: [
      { month: '2030-01', forecast: 6200000, actual: 5710250.5 },
      { month: '2030-02', forecast: 8450000, actual: 8912400.25 },
      { month: '2030-03', forecast: 11300000, actual: 9150000 },
      { month: '2030-04', forecast: 850000, actual: 910500.75 },
      { month: '2030-05', forecast: 1250000, actual: 1250000 },
      { month: '2030-06', forecast: 14650000, actual: 14120750.5 },
      { month: '2030-07', forecast: 9800000, actual: 10235000.25 },
      { month: '2030-08', forecast: 5400000, actual: 5400000 },
      { month: '2030-09', forecast: 7300000, actual: 7015500.5 },
    ],
  },
  backIn: {
    parties: OK_PARTIES,
    backInParty: 'NCP',
    targetPct: 37.5,
    basis: 'pia-s85-4',
    refundForm: 'from-future-entitlement',
    recoverFromPct: 55,
    costs: [
      { item: 'exploration wells Okwelle-1 and Okwelle-2', amount: 118400000, kind: 'exploration' },
      { item: 'development wells and the gas plant to date', amount: 386750000.5, kind: 'development' },
      { item: 'early production costs', amount: 24300000, kind: 'production' },
      { item: 'signature bonus', amount: 12000000, kind: 'bonus' },
      { item: 'interest on the carry finance', amount: 6500000, kind: 'interest' },
      { item: 'operator markup on shared services', amount: 1850000, kind: 'markup' },
    ],
    years: [
      { year: 2032, entitlement: 97300000 },
      { year: 2033, entitlement: 90150000.25 },
      { year: 2034, entitlement: 83600000 },
      { year: 2035, entitlement: 77250000 },
      { year: 2036, entitlement: 71400000 },
      { year: 2037, entitlement: 65900000 },
    ],
  },
  default: {
    parties: OK_PARTIES,
    callTotal: 14650000,
    dueDate: '2030-06-01',
    asOf: '2030-09-30',
    defaulters: [{ id: 'PRA', paid: 1250000.5, curedOn: '2030-08-19' }],
    interest: { annualRatePct: 9.5, dayBasis: 365, interestMethod: 'monthly-compound', graceHours: 0 },
    suspension: { after: 5, unit: 'working-days', from: '2030-06-01' },
    forfeiture: { after: 90, unit: 'calendar-days', from: '2030-06-08' },
  },
  psc: {
    royaltyPct: 10,
    costOilLimitPct: 55,
    costOilLimitBase: 'gross',
    contractorProfitSharePct: 45,
    taxRatePct: 30,
    openingCostPool: 186000000,
    parties: OK_PARTIES,
    years: [
      { year: 2030, grossRevenue: 142500000, capex: 64000000, opex: 11200000 },
      { year: 2031, grossRevenue: 168300000.4, capex: 22500000, opex: 12400000 },
      { year: 2032, grossRevenue: 159750000.4, capex: 8000000, opex: 13100000.25 },
      { year: 2033, grossRevenue: 147200000, capex: 0, opex: 13600000 },
      { year: 2034, grossRevenue: 133850000.5, capex: 0, opex: 14050000 },
      { year: 2035, grossRevenue: 121400000, capex: 0, opex: 14500000 },
    ],
  },
};

/* ======================================================= ABIAMA, Expert

   The Abiama deepwater joint venture (synthetic): four parties. SPB declines
   the Abiama-3 appraisal sidetrack, whose consenting parties recover a stated
   300 percent of SPB's proportionate share of its cost from SPB's share of
   the sidetrack's net value; SNC declines the Abiama-4 exploration well and
   later buys in at a stated 750 percent; SNC is carried in full through
   appraisal with a stated 250 percent multiple uplift, recovered from its
   whole share, and every party's net cash flow is discounted by the canonical
   npv; a production sharing variant with a per-year contractor share; and
   SPB's uncured default on a later cash call. */

const AB_PARTIES = [
  { id: 'ABO', name: 'Abiama Operating (synthetic), operator', participatingPct: 45 },
  { id: 'SPA', name: 'Sepal Offshore A (synthetic)', participatingPct: 25 },
  { id: 'SPB', name: 'Sepal Offshore B (synthetic)', participatingPct: 17.5 },
  { id: 'SNC', name: 'State participant (synthetic)', participatingPct: 12.5 },
];
const ABIAMA = {
  name: 'ABIAMA',
  label: 'ABIAMA, the Abiama deepwater joint venture (synthetic)',
  soleRisk: {
    parties: AB_PARTIES,
    consenting: ['ABO', 'SPA', 'SNC'],
    operation: { name: 'Abiama-3 appraisal sidetrack', cost: 26750000.4 },
    premiumMultiplePct: 300,
    mode: 'recover-from-production',
    years: [
      { year: 2032, grossValue: 21400000, deductions: 23150000 },
      { year: 2033, grossValue: 38650000.5, deductions: 12400000 },
      { year: 2034, grossValue: 35200000, deductions: 11850000.25 },
      { year: 2035, grossValue: 31900000, deductions: 11300000 },
      { year: 2036, grossValue: 28750000, deductions: 10800000 },
      { year: 2037, grossValue: 25600000.5, deductions: 10250000 },
    ],
  },
  buyIn: {
    parties: AB_PARTIES,
    consenting: ['ABO', 'SPA', 'SPB'],
    operation: { name: 'Abiama-4 exploration well', cost: 31400000.25 },
    premiumMultiplePct: 750,
    mode: 'buy-in',
  },
  carry: {
    parties: AB_PARTIES,
    carries: [{ carried: 'SNC', carriedPct: 100, carriers: 'pro-rata' }],
    carried: 'SNC',
    basis: 'contract',
    uplift: { type: 'multiple', multiplePct: 250 },
    recoverFromPct: 100,
    discountRate: 0.1,
    baseYear: 2031,
    years: [
      { year: 2031, cost: 142600000, entitlement: 0 },
      { year: 2032, cost: 88350000.5, entitlement: 0 },
      { year: 2033, cost: 21000000, entitlement: 186400000 },
      { year: 2034, cost: 0, entitlement: 214750000.5 },
      { year: 2035, cost: 0, entitlement: 198300000 },
      { year: 2036, cost: 0, entitlement: 176900000.25 },
      { year: 2037, cost: 0, entitlement: 158200000 },
      { year: 2038, cost: 0, entitlement: 141650000 },
    ],
  },
  psc: {
    royaltyPct: 7.5,
    costOilLimitPct: 62.5,
    costOilLimitBase: 'gross',
    contractorProfitSharePct: 50,
    taxRatePct: 35,
    openingCostPool: 312000000,
    years: [
      { year: 2033, grossRevenue: 196400000, capex: 58000000, opex: 18200000, contractorProfitSharePct: 50 },
      { year: 2034, grossRevenue: 231750000.5, capex: 21000000, opex: 19400000, contractorProfitSharePct: 45 },
      { year: 2035, grossRevenue: 244100000.75, capex: 6500000, opex: 20150000.75, contractorProfitSharePct: 40 },
      { year: 2036, grossRevenue: 226300000, capex: 0, opex: 20800000, contractorProfitSharePct: 40 },
      { year: 2037, grossRevenue: 205650000.5, capex: 0, opex: 21300000, contractorProfitSharePct: 45 },
    ],
  },
  default: {
    parties: AB_PARTIES,
    callTotal: 22800000,
    dueDate: '2034-02-01',
    asOf: '2034-07-15',
    defaulters: [{ id: 'SPB', paid: 1500000.5 }],
    interest: { annualRatePct: 10.25, dayBasis: 360, interestMethod: 'simple', graceHours: 0 },
    suspension: { after: 5, unit: 'working-days', from: '2034-02-01' },
    forfeiture: { after: 3, unit: 'months', from: '2034-02-12' },
  },
};

export const CASES = { IDUMU, OKWELLE, ABIAMA };

/* ------------------------------------------------------ the engine routes

   READ[key] = [case, (E) => value]: the value the key names, read off the
   engine module E. The true engine is J; discriminate.mjs passes a variant. */

const monthRow = (r, m) => r.months.find((x) => x.month === m);
const partyRow = (row, id) => row.parties.find((p) => p.id === id);
const yr = (rows, y) => rows.find((x) => x.year === y);
const idCC = (E) => ok('cashCalls', E.cashCalls(clone(IDUMU.cashCalls)));
const idOH = (E) => ok('overhead', E.overhead(clone(IDUMU.overhead)));
const okCarry = (E) => ok('carryRecovery', E.carryRecovery(clone(OKWELLE.carry)));
const okBack = (E) => ok('backIn', E.backIn(clone(OKWELLE.backIn)));
const okDef = (E) => ok('defaultCover', E.defaultCover(clone(OKWELLE.default)));
const okCC = (E) => ok('cashCalls', E.cashCalls(clone(OKWELLE.cashCalls)));
const okPsc = (E) => ok('pscCostRecovery', E.pscCostRecovery(clone(OKWELLE.psc)));
const abNc = (E) => ok('nonConsent', E.nonConsent(clone(ABIAMA.soleRisk)));
const abBuy = (E) => ok('nonConsent', E.nonConsent(clone(ABIAMA.buyIn)));
const abCarry = (E) => ok('carryRecovery', E.carryRecovery(clone(ABIAMA.carry)));
const abPsc = (E) => ok('pscCostRecovery', E.pscCostRecovery(clone(ABIAMA.psc)));
const abDef = (E) => ok('defaultCover', E.defaultCover(clone(ABIAMA.default)));
const cat = (r, k) => r.categories.find((c) => c.category === k);

export const READ = {
  idumu_zed_paying_pct: ['IDUMU', (E) => ok('participatingInterests', E.participatingInterests(clone(IDUMU.interests))).parties.find((p) => p.id === 'ZED').payingPct],
  idumu_zed_june_call: ['IDUMU', (E) => partyRow(monthRow(idCC(E), '2029-06'), 'ZED').call],
  idumu_zed_august_paid: ['IDUMU', (E) => partyRow(monthRow(idCC(E), '2029-08'), 'ZED').paid],
  idumu_budget_allowed_overrun: ['IDUMU', (E) => ok('budgetControl', E.budgetControl(clone(IDUMU.budget))).total.allowedOverrun],
  idumu_operating_overhead: ['IDUMU', (E) => cat(idOH(E), 'operating').charge],
  idumu_development_overhead: ['IDUMU', (E) => cat(idOH(E), 'development').charge],
  okwelle_2031_carry_balance: ['OKWELLE', (E) => yr(okCarry(E).ledger, 2031).closing],
  okwelle_backin_refund_to_pra: ['OKWELLE', (E) => okBack(E).parties.find((p) => p.id === 'PRA').refundReceived],
  okwelle_default_interest: ['OKWELLE', (E) => okDef(E).interestTotal],
  okwelle_default_cover_oko: ['OKWELLE', (E) => okDef(E).cover.find((c) => c.id === 'OKO').cover],
  okwelle_prb_june_call: ['OKWELLE', (E) => partyRow(monthRow(okCC(E), '2030-06'), 'PRB').call],
  okwelle_2032_cost_recovered: ['OKWELLE', (E) => yr(okPsc(E).years, 2032).costRecovered],
  abiama_spb_premium: ['ABIAMA', (E) => abNc(E).nonConsenting.find((r) => r.id === 'SPB').premium],
  abiama_spb_2036_receipt: ['ABIAMA', (E) => yr(abNc(E).recovery.find((x) => x.id === 'SPB').ledger, 2036).nonConsentingReceives],
  abiama_buy_in_to_spa: ['ABIAMA', (E) => abBuy(E).buyIn[0].toParties.find((p) => p.id === 'SPA').amount],
  abiama_spa_carry_npv: ['ABIAMA', (E) => abCarry(E).npv.find((p) => p.id === 'SPA').npv],
  abiama_2035_government_profit_oil: ['ABIAMA', (E) => yr(abPsc(E).years, 2035).governmentProfitOil],
  abiama_abo_after_forfeiture_pct: ['ABIAMA', (E) => abDef(E).interestsAfterForfeiture.find((p) => p.id === 'ABO').participatingPct],
};

/** The other side of each reading the engine states. No graded value may move under any of them. */
export const OPEN_READINGS = ['reading_psc_tax_all_costs', 'reading_grace_delays_interest', 'reading_cover_by_participating'];

/* ------------------------------------------------------------ the checks */

const KEYS = GRADED_FIELDS.map(([, k]) => k);
must('READ carries exactly the eighteen graded keys, in order', JSON.stringify(Object.keys(READ)) === JSON.stringify(KEYS), Object.keys(READ).join(','));
const rows = GRADED_FIELDS.map(([tier, key, cls]) => {
  const value = READ[key][1](J);
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

// SCENARIO CLAIMS the capstone briefs make, each asserted.
const idc = idCC(J);
must('IDUMU: June 2029 is called and carries an adjustment from May', monthRow(idc, '2029-06').called && partyRow(monthRow(idc, '2029-06'), 'ZED').adjustment !== 0, 'june');
must('IDUMU: July 2029 is below the threshold, so August bills July in arrears', !monthRow(idc, '2029-07').called && partyRow(monthRow(idc, '2029-08'), 'ZED').arrearsBilling > 0, 'july');
const idb = ok('budgetControl', J.budgetControl(clone(IDUMU.budget)));
must('IDUMU: the budget allowance is held by the percentage and the appraisal well is outside its item tolerance', idb.total.heldBy === 'pct' && idb.itemsOutsideTolerance.includes('appraisal well Idumu-2'), JSON.stringify(idb.total));
const ido = idOH(J);
must('IDUMU: operating overhead reaches the second band and development the part above the last band', cat(ido, 'operating').bands[1].amount > 0 && cat(ido, 'operating').above.amount === 0 && cat(ido, 'development').above.amount > 0, 'bands');
const okc = okCarry(J);
must('OKWELLE: the carry is partly recovered in 2031 with a balance carried on', yr(okc.ledger, 2031).recovered > 0 && yr(okc.ledger, 2031).closing > 0, 'carry 2031');
const okd = okDef(J);
must('OKWELLE: the default is cured after a whole month, and suspension is triggered while forfeiture is not', okd.defaulters[0].wholeMonths >= 1 && okd.defaulters[0].remainingDays > 0 && okd.defaulters[0].suspension.applies && !okd.defaulters[0].forfeiture.applies, JSON.stringify(okd.defaulters[0]).slice(0, 200));
const okcc = okCC(J);
must('OKWELLE: some month carries a credit forward', okcc.months.some((m) => m.parties.some((p) => p.carried > 0)), 'carry credit');
const okp = okPsc(J);
must('OKWELLE: the cost oil limit binds in 2032 (a pool is carried out of it)', yr(okp.years, 2032).poolOut > 0, `${yr(okp.years, 2032).poolOut}`);
const abn = abNc(J);
const spb = abn.recovery.find((x) => x.id === 'SPB');
must('ABIAMA: the premium is recovered inside 2036, which is not the last year, and 2032 has no net value', spb.revertsInYear === 2036 && abn.reasons.some((t) => /2032: deductions/.test(t)), spb.revertsInYear);
must('ABIAMA: in the payout year SPB receives part of its share', yr(spb.ledger, spb.revertsInYear).nonConsentingReceives > 0 && yr(spb.ledger, spb.revertsInYear).nonConsentingReceives < yr(spb.ledger, spb.revertsInYear).share, 'payout');
const abd = abDef(J);
must('ABIAMA: the forfeiture is triggered by asOf', abd.defaulters[0].forfeiture.applies === true && abd.interestsAfterForfeiture !== null, 'forfeit');
const abp = abPsc(J);
must('ABIAMA: the cost oil limit binds in 2035', yr(abp.years, 2035).poolOut > 0, yr(abp.years, 2035).poolOut);

/* ------------------------------------------------------------ the output */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`joa_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED\n`);
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
  console.log(`joa_capstone: ${ASSERTS.length} assertions, 0 failed; ${OPEN_READINGS.length} stated readings, every field bit-identical under each`);
}
