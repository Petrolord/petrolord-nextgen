// THE THREE EC10 CAPSTONES AND THEIR EIGHTEEN GRADED FIELDS.
//
// Every graded value is a RETURN VALUE of the vendored engine
// (engines/economics/farmout.js, with the applyJV and npv it imports from
// engines/economics/cashflow.ts, the rollback, evpi and evii it imports from
// engines/economics/decisionTree.js, the calculatePartnerCosts it imports from
// engines/economics/afe.js and the carryRecovery and backIn it imports from
// engines/economics/jointVenture.js) on the deal terms typed below. Nothing
// here computes a payment, a promote, an EMV, a break-even, a fee, a value of
// information, a price or a recovery by its own arithmetic: every number is
// read off an engine result object, and discriminate.mjs is where the wrong
// methods live.
//
//   OGBAKU   Associate     the deal and what it costs: what the farminee and
//                          the farmor pay for one exploration well, the
//                          promote ratio, the carry, the consideration and
//                          the equivalent working interest
//   UMUNZE   Professional  caps, vesting, value and the fee: the farminee's
//                          payment under a gross-cost cap exceeded, the
//                          farmor's payment under a carry cap exceeded on a
//                          drill-to-earn second event, the farminee's EMV on
//                          a risked prospect, the break-even share paid and
//                          chance of success, and the consent fee
//   AKPUGO   Expert        information, price and after the farm-in: the
//                          farminee's EVII, the chance of success after the
//                          strong signal, the risked value per percent, the
//                          price-to-value ratio, a development carry balance
//                          and a back-in refund
//
// THE CASES ARE EKENE SYNTHETIC DEALS OF THEIR OWN, typed here with their own
// parties, interests, wells, prospects, signals, prices, costs and terms, none
// of them the digest's. Their names, terms and values must never enter a
// lesson, a bank, a panel default or a brief (gate_capstone_leak.mjs).
//
// EVERY FIELD IS FREE OF EVERY STATED READING AND OF EVERY DRAW. The engine
// states four readings (the valuation timing: every cost at the valuation
// date; the day count of reg. 19(7) from the notification without that day;
// the ninetieth surcharge day charged; a simple-interest uplift paying the
// accrued interest first). This file runs every capstone again through the
// engine with the OTHER side of each of the first three (ts_loader.mjs
// reading_* variants) and ASSERTS that every graded value comes out
// bit-identical; the fourth acts only on uplift type "simple", which no case
// states, and that is asserted too. No case calls riskSharing, so no field is
// a Monte Carlo draw.
//
// THE CARE RULES, all asserted below:
//   * ONE ANSWER. Every graded value is finite, non-zero and not a whole number.
//   * EVERY TERM IS STATED. Every input a value depends on is in the case,
//     printed by --inputs for the capstone brief and the case files.
//   * NO COLLISION. No two graded values sit within one tolerance of each other.
//
// Usage:
//   node farmout_capstone.mjs            the human table
//   node farmout_capstone.mjs --json     the rows make_fields.mjs writes
//   node farmout_capstone.mjs --inputs   the three cases, for gen_course.py,
//                                        discriminate.mjs, oracle_check.py and
//                                        gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST, and the digest generator reads nothing here.
import process from 'node:process';

const HERE = process.env.EC10_WAVE_DIR || '/root/cat-wip-farmout';
const { F, variant } = await import(`${HERE}/farmout_engine.mjs`);
const TOLPATH = process.env.EC10_TOLERANCE
  || '/root/wt-ec10-nextgen/src/components/course/panels/farmout/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const clone = (o) => JSON.parse(JSON.stringify(o));
const ok = (label, r) => {
  if (!r || r.error) throw new Error(`${label} was refused: ${r && r.error}`);
  return r;
};

/* ======================================================= OGBAKU, Associate

   The Ogbaku licence (synthetic), held by two parties. The operator farms
   out part of its interest to an incoming party for one exploration well,
   with a cash bonus and a share of its past costs reimbursed. No cap. */

const OG_PARTIES = [
  { id: 'OGB', name: 'Ogbaku Petroleum (synthetic), operator', participatingPct: 60.25 },
  { id: 'NKW', name: 'Nkwerre Energy (synthetic)', participatingPct: 39.75 },
];
const OGBAKU = {
  name: 'OGBAKU',
  label: 'OGBAKU, a farm-out on the Ogbaku licence (synthetic)',
  earning: {
    parties: OG_PARTIES,
    farmor: 'OGB',
    farminee: { id: 'IHE', name: 'Ihembosi Resources (synthetic)' },
    events: [
      { name: 'Ogbaku-1 exploration well', grossCost: 37650000.5, farmineePaysPct: 44, earnedPct: 31.75, cap: { on: 'none' } },
    ],
    vesting: 'per-event',
    eventsCompleted: 1,
    cashBonus: 1250000.75,
    pastCosts: { amount: 8430000.4, reimbursedPct: 31.75 },
  },
};

/* ================================================== UMUNZE, Professional

   The Umunze licence (synthetic), held by two parties. A drill-to-earn
   farm-out: an exploration well under a gross-cost cap exceeded, with the
   excess paid by the post-deal interests, then an appraisal well under a
   carry-amount cap exceeded, both completed, vesting when every event is
   complete. The same deal on the Umunze prospect is valued by EMV with a
   stated success-case value and stated assignor fees, and the consent fee is
   paid on time. */

const UM_PARTIES = [
  { id: 'UMZ', name: 'Umunze Exploration (synthetic), operator', participatingPct: 65 },
  { id: 'ORJ', name: 'Orji Resources (synthetic)', participatingPct: 35 },
];
const UM_FARMINEE = { id: 'AMG', name: 'Amaigbo Energy (synthetic)' };
const UMUNZE = {
  name: 'UMUNZE',
  label: 'UMUNZE, a drill-to-earn farm-out on the Umunze licence (synthetic)',
  earning: {
    parties: UM_PARTIES,
    farmor: 'UMZ',
    farminee: UM_FARMINEE,
    events: [
      { name: 'Umunze-1 exploration well', grossCost: 52340000.25, farmineePaysPct: 42, earnedPct: 24, cap: { on: 'gross-cost', amount: 48000000, overrunRule: 'post-deal-interests' } },
      { name: 'Umunze-2 appraisal well', grossCost: 31275000.4, farmineePaysPct: 38.5, earnedPct: 12.5, cap: { on: 'carry-amount', amount: 550000.5 } },
    ],
    vesting: 'all-events',
    eventsCompleted: 2,
    cashBonus: 1875000.25,
    pastCosts: { amount: 14300000, reimbursedPct: 24 },
  },
  deal: {
    parties: UM_PARTIES,
    farmor: 'UMZ',
    farminee: UM_FARMINEE,
    project: { chanceOfSuccessPct: 22.5, wellCost: { success: 44650000.75, dry: 39120000.4 }, successValue: { npv: 318400000.5 } },
    deal: {
      farmineePaysPct: 42,
      earnedPct: 24,
      cap: { on: 'gross-cost', amount: 42000000, overrunRule: 'post-deal-interests' },
      cashBonus: 1875000.25,
      pastCosts: { amount: 14300000, reimbursedPct: 24 },
      assignorFees: 618400.25,
    },
  },
  fee: {
    licence: 'PPL',
    transactionValue: 6437500.6,
    valueSource: 'contract-amount',
    intraGroup: false,
    basis: 'nuprc-2024-r19',
    payment: { notifiedOn: '2029-03-02', paidOn: '2029-05-14' },
  },
};

/* ======================================================= AKPUGO, Expert

   The Akpugo licence (synthetic), held by two parties. The operator offers
   part of its interest on the Akpugo prospect; the incoming party weighs a
   seismic survey first. The interest is priced at a stated price; after the
   farm-in the incoming party carries part of the operator's development cost
   with a compound uplift, and the operator holds a back-in. */

const AK_PARTIES = [
  { id: 'AKP', name: 'Akpugo Oil (synthetic), operator', participatingPct: 72.5 },
  { id: 'OBR', name: 'Obioma Resources (synthetic)', participatingPct: 27.5 },
];
const AK_FARMINEE = { id: 'EZI', name: 'Ezinifite Energy (synthetic)' };
const AK_PROJECT = { chanceOfSuccessPct: 18.5, wellCost: { success: 51380000.5, dry: 45260000.75 }, successValue: { npv: 402750000.25 } };
const AKPUGO = {
  name: 'AKPUGO',
  label: 'AKPUGO, a farm-out on the Akpugo licence (synthetic)',
  information: {
    parties: AK_PARTIES,
    farmor: 'AKP',
    farminee: AK_FARMINEE,
    project: AK_PROJECT,
    deal: {
      farmineePaysPct: 46,
      earnedPct: 29.5,
      cap: { on: 'none' },
      cashBonus: 2150000.5,
      pastCosts: { amount: 9840000, reimbursedPct: 29.5 },
      assignorFees: 312500.25,
    },
    side: 'farminee',
    information: {
      cost: 1650000.5,
      signals: [
        { label: 'strong amplitude', likelihoodsPct: [72.5, 21.3] },
        { label: 'weak amplitude', likelihoodsPct: [27.5, 78.7] },
      ],
    },
  },
  price: {
    project: AK_PROJECT,
    interestPct: 29.5,
    valueBasis: 'risked',
    transaction: { price: 11240000.5 },
  },
  devCarry: {
    parties: AK_PARTIES,
    farmor: 'AKP',
    farminee: AK_FARMINEE,
    earnedPct: 29.5,
    carriedPct: 60,
    years: [
      { year: 2031, cost: 186400000.5, entitlement: 0 },
      { year: 2032, cost: 244750000.25, entitlement: 0 },
      { year: 2033, cost: 97300000, entitlement: 0 },
      { year: 2034, cost: 0, entitlement: 212600000.5 },
      { year: 2035, cost: 0, entitlement: 238450000.75 },
      { year: 2036, cost: 0, entitlement: 221300000 },
      { year: 2037, cost: 0, entitlement: 196800000.25 },
      { year: 2038, cost: 0, entitlement: 174250000 },
    ],
    uplift: { type: 'compound', ratePctPerYear: 7.5 },
    recoverFromPct: 55,
    discountRate: 0.1,
    baseYear: 2030,
  },
  backIn: {
    parties: AK_PARTIES,
    farmor: 'AKP',
    farminee: AK_FARMINEE,
    earnedPct: 29.5,
    backIn: {
      party: 'AKP',
      targetPct: 50,
      costs: [
        { item: 'Akpugo development wells', amount: 612400000.5, kind: 'development' },
        { item: 'Akpugo production facilities', amount: 48750000.25, kind: 'production' },
        { item: 'Akpugo-1 exploration well', amount: 51380000.5, kind: 'exploration' },
      ],
      basis: 'contract',
      refundableKinds: ['development', 'production'],
      refundForm: 'upfront',
    },
  },
};

export const CASES = { OGBAKU, UMUNZE, AKPUGO };

/* ------------------------------------------------------ the engine routes

   READ[key] = [case, (E) => value]: the value the key names, read off the
   engine module E. The true engine is F; discriminate.mjs passes a variant. */

const ogE = (E) => ok('earningObligation', E.earningObligation(clone(OGBAKU.earning)));
const umE = (E) => ok('earningObligation', E.earningObligation(clone(UMUNZE.earning)));
const umD = (E) => ok('dealValue', E.dealValue(clone(UMUNZE.deal)));
const umF = (E) => ok('consentFee', E.consentFee(clone(UMUNZE.fee)));
const akI = (E) => ok('informationValue', E.informationValue(clone(AKPUGO.information)));
const akP = (E) => ok('interestValue', E.interestValue(clone(AKPUGO.price)));
const akC = (E) => ok('developmentCarry', E.developmentCarry(clone(AKPUGO.devCarry)));
const akB = (E) => ok('backInRight', E.backInRight(clone(AKPUGO.backIn)));
const yr = (rows, y) => rows.find((x) => x.year === y);

export const READ = {
  ogbaku_ihe_well_payment: ['OGBAKU', (E) => ogE(E).events[0].farmineePays],
  ogbaku_ogb_well_payment: ['OGBAKU', (E) => ogE(E).events[0].farmorPays],
  ogbaku_promote_ratio: ['OGBAKU', (E) => ogE(E).events[0].promoteRatio],
  ogbaku_carry: ['OGBAKU', (E) => ogE(E).events[0].carry],
  ogbaku_consideration: ['OGBAKU', (E) => ogE(E).totals.consideration],
  ogbaku_equivalent_wi_pct: ['OGBAKU', (E) => ogE(E).totals.equivalentWorkingInterestPct],
  umunze_well1_amg_payment: ['UMUNZE', (E) => umE(E).events[0].farmineePays],
  umunze_well2_umz_payment: ['UMUNZE', (E) => umE(E).events[1].farmorPays],
  umunze_amg_emv: ['UMUNZE', (E) => umD(E).farmineeSide.farmIn.emv],
  umunze_breakeven_share_pct: ['UMUNZE', (E) => umD(E).breakEvenPromote.farmineePaysPct],
  umunze_amg_breakeven_chance_pct: ['UMUNZE', (E) => umD(E).breakEvenChance.farminee.chanceOfSuccessPct],
  umunze_consent_fee: ['UMUNZE', (E) => umF(E).fee],
  akpugo_ezi_evii: ['AKPUGO', (E) => akI(E).evii],
  akpugo_strong_posterior_pct: ['AKPUGO', (E) => akI(E).perSignal[0].posteriorSuccessPct],
  akpugo_risked_value_per_pct: ['AKPUGO', (E) => akP(E).perPct.risked],
  akpugo_price_to_value: ['AKPUGO', (E) => akP(E).transaction.priceToValue],
  akpugo_2035_carry_balance: ['AKPUGO', (E) => yr(akC(E).ledger, 2035).closing],
  akpugo_backin_refund_to_obr: ['AKPUGO', (E) => akB(E).parties.find((p) => p.id === 'OBR').refundReceived],
};

/** The other side of each reading the engine states in farmout.js. No graded value may move under any of them. */
export const OPEN_READINGS = ['reading_costs_discounted_one_year', 'reading_days_count_notification_day', 'reading_withdrawn_on_the_ninetieth_surcharge_day'];

/* ------------------------------------------------------------ the checks */

const KEYS = GRADED_FIELDS.map(([, k]) => k);
must('READ carries exactly the eighteen graded keys, in order', JSON.stringify(Object.keys(READ)) === JSON.stringify(KEYS), Object.keys(READ).join(','));
const rows = GRADED_FIELDS.map(([tier, key, cls]) => {
  const value = READ[key][1](F);
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
const json = JSON.stringify(CASES);
must('READING-FREE: no case states a simple-interest uplift (the fourth reading cannot act)', !/"type":"simple"/.test(json), 'simple');
must('NO DRAW: no case is a riskSharing call', !/"seed"|"iterations"|"positions"/.test(json), 'risk');

// SCENARIO CLAIMS the capstone briefs make, each asserted.
const oge = ogE(F);
must('OGBAKU: one event, completed and vested, no cap', oge.vestedPct === 31.75 && oge.events[0].capState === 'none' && oge.events[0].completed, JSON.stringify(oge.events[0]).slice(0, 120));
const ume = umE(F);
must('UMUNZE: the exploration well exceeds its gross-cost cap and the appraisal carry exceeds its carry cap', ume.events[0].capState === 'exceeded' && ume.events[1].capState === 'exceeded', `${ume.events[0].capState} ${ume.events[1].capState}`);
must('UMUNZE: both events completed; all-events vests the whole 36.5', ume.vestedPct === 36.5, ume.vestedPct);
const umd = umD(F);
must('UMUNZE: the farminee declines at the stated share, and its break-even is solved between its earned and asked shares', umd.farmineeSide.bestAction === 'decline' && umd.breakEvenPromote.status === 'solved' && umd.breakEvenPromote.farmineePaysPct > 24 && umd.breakEvenPromote.farmineePaysPct < 42, JSON.stringify(umd.breakEvenPromote).slice(0, 120));
must('UMUNZE: the success well exceeds the cap and the dry hole is below it', umd.wellCostSplit.success.capState === 'exceeded' && umd.wellCostSplit.dry.capState === 'below', 'caps');
must('UMUNZE: the deal states assignor fees of its own, apart from the graded consent fee', Math.abs(umd.terms.assignorFees - umF(F).fee) > 1, `${umd.terms.assignorFees} ${umF(F).fee}`);
must('UMUNZE: the fee is paid on time with room on both day-count readings', umF(F).payment.status === 'on-time' && umF(F).payment.days < 89, umF(F).payment.days);
const aki = akI(F);
must('AKPUGO: the farminee declines without the survey, farms in on the strong signal and declines on the weak one', aki.emvPrior === 0 && aki.perSignal[0].bestAction === 'farm in' && aki.perSignal[1].bestAction === 'decline', JSON.stringify(aki.perSignal.map((s) => s.bestAction)));
must('AKPUGO: the survey is worth more than its cost', aki.netEvii > 0, aki.netEvii);
const akc = akC(F);
must('AKPUGO: the carry is partly recovered in 2035 with a balance carried on', yr(akc.ledger, 2035).recovered > 0 && yr(akc.ledger, 2035).closing > 0, 'carry 2035');
const akb = akB(F);
must('AKPUGO: the exploration well is excluded from the back-in refund', akb.excluded === 51380000.5, akb.excluded);

/* ------------------------------------------------------------ the output */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`farmout_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED\n`);
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
  console.log(`farmout_capstone: ${ASSERTS.length} assertions, 0 failed; ${OPEN_READINGS.length} stated readings, every field bit-identical under each`);
}
