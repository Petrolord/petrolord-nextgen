// THE EC10 TEACHING LAB: Farm-ins, Farm-outs & Asset Valuation.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/economics/farmout.js, sha-identical
// with petrolord-engines b7d305b, with the applyJV and npv it imports from
// cashflow.ts, the rollback, evpi and evii from decisionTree.js, the
// portfolioRiskMetrics from portfolio.js, the calculatePartnerCosts from afe.js
// and the carryRecovery and backIn from jointVenture.js, the whole closure on the
// canonical engine paths) on the vendored Ekene Deep fixture
// (test-data/economics/ekene-farmout), on the INPUTS of the vendored golden file
// (test-data/economics/goldens/farmout_cases.json), or on the terms a learner
// types into a calculator panel. The golden file's expected figures are oracle
// output and this lab never reads them: GOLDEN_ARGS carries the inputs only.
// farmoutLab.test.js asserts that every number a teaching reader returns is
// printed in the teaching digest.
//
// THIS IS AN ENGINE COURSE. There is no Suite app: the course's practicals run
// in the three calculator panels this lab feeds.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone case, and panelCapstoneGuard.test.js greps this file, the three
// panels and the learning page for every rendering of all eighteen answers and
// every capstone name, label and distinctive input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. The engine refuses by returning
// { error, field }; every route passes that object through untouched, so the
// lesson that quotes a refusal and the panel print the same words.
//
// NO HIDDEN DEFAULT. A control on a panel writes a stated input INTO the box
// (setStated); choosing "not stated" removes the key, and the engine refuses.
//
// Nothing here reads a clock, a random number or a locale. The one Monte Carlo
// (riskSharing) is seeded by the seed the box states.
import FX from '@petrolord/engines/test-data/economics/ekene-farmout/ekene-farmout.json';
import GOLD from '@petrolord/engines/test-data/economics/goldens/farmout_cases.json';
import {
  earningObligation, dealValue, informationValue, interestValue, riskSharing, consentFee,
  developmentCarry, backInRight, DEFAULTS, NIGERIA_ASSIGNMENT,
} from '@petrolord/engines/engines/economics/farmout.js';

export { DEFAULTS, NIGERIA_ASSIGNMENT };

const clone = (o) => JSON.parse(JSON.stringify(o));

/** The golden file's INPUTS, by case id; its expected figures are left out. */
export const GOLDEN_ARGS = Object.freeze(Object.fromEntries(GOLD.cases.map((c) => [c.id, Object.freeze({ fn: c.fn, args: c.args })])));

/** The Ekene Deep farm-out as the fixture states it. */
export const FIXTURE = FX;

/* ------------------------------------------------ what a learner can type */

/** JSON a learner pastes. Returns { value } or { error }. */
export const parseJson = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the box is empty' };
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: `the box does not hold valid JSON (${e.message})` };
  }
};

/** Pretty JSON for a text box a learner edits. */
export const pretty = (v) => JSON.stringify(v, null, 1);

const isObj = (o) => o !== null && typeof o === 'object' && !Array.isArray(o);

/**
 * A case file holds several calls under named keys (earning, deal, fee,
 * information, risk, price, devCarry, backIn). A box that holds a whole case
 * file is read at the key a view needs; a box that holds one call's inputs is
 * read as it stands.
 */
//
// THREE VIEW KEYS ARE ALSO INPUT KEYS OF THEIR OWN CALLS: dealValue takes a
// `deal`, informationValue an `information` and backInRight a `backIn`. So a
// block is picked only when it carries the key its call cannot run without
// (VIEW_SIGNATURE); a box that holds one call's inputs is never read at its
// own inner key. A capstone case file names its `dataset`, and a case file is
// always read at the view's key, so a term removed from its block ("not
// stated") is refused by the engine by its own name.
export const VIEW_SIGNATURE = Object.freeze({
  earning: 'events', deal: 'project', fee: 'licence', information: 'side', risk: 'positions', price: 'interestPct', devCarry: 'carriedPct', backIn: 'earnedPct',
});
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
export const pick = (c, key) => (isObj(c) && own(c, key) && isObj(c[key]) && (own(c, 'dataset') || !VIEW_SIGNATURE[key] || own(c[key], VIEW_SIGNATURE[key])) ? c[key] : c);

const INDEX = /^\d+$/;
const step = (a, k) => (isObj(a) ? a[k] : (Array.isArray(a) && INDEX.test(k) ? a[Number(k)] : undefined));

/** The value at a dotted path of an object, or undefined. A numeric step reads an array entry (events.0.cap.on). */
export const getAt = (o, path) => path.split('.').reduce(step, o);

/**
 * Write ONE stated input into the view's block of the text in a box (a whole
 * case file or one call's inputs), at a dotted path. value undefined REMOVES
 * the key, so the engine refuses by name: the panel supplies no default.
 * Returns { text } or { error } (the box does not hold a JSON object).
 */
export const setStated = (text, viewKey, path, value) => {
  const p = parseJson(text);
  if (p.error) return p;
  if (!isObj(p.value)) return { error: 'the box does not hold a JSON object' };
  const next = clone(p.value);
  const block = pick(next, viewKey);
  if (!isObj(block)) return { error: `the box does not hold an object at ${viewKey}` };
  const keys = path.split('.');
  const container = (x) => isObj(x) || Array.isArray(x);
  let o = block;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = Array.isArray(o) ? Number(keys[i]) : keys[i];
    if (Array.isArray(o) && !INDEX.test(keys[i])) return { error: `${keys.slice(0, i + 1).join('.')} is a list and needs a number` };
    if (!container(o[k])) {
      if (value === undefined) return { text: pretty(next) };
      o[k] = INDEX.test(keys[i + 1]) ? [] : {};
    }
    o = o[k];
  }
  const lastKey = keys[keys.length - 1];
  if (Array.isArray(o)) {
    if (!INDEX.test(lastKey)) return { error: `${path} is a list entry and needs a number` };
    if (value === undefined) o.splice(Number(lastKey), 1); else o[Number(lastKey)] = value;
  } else if (value === undefined) delete o[lastKey]; else o[lastKey] = value;
  // AN OPTIONAL GROUP LEFT EMPTY IS REMOVED WHOLE. Clearing the last stated
  // term of an optional group (the payment dates of a consent fee) leaves no
  // empty object behind for the engine to refuse: the box then states no
  // payment at all, and the engine returns the no-payment result.
  if (value === undefined && keys.length === 2 && OPTIONAL_GROUPS.includes(keys[0]) && isObj(block[keys[0]]) && !Object.keys(block[keys[0]]).length) delete block[keys[0]];
  return { text: pretty(next) };
};

/** Groups of optional terms that are removed whole once their last term is cleared. */
export const OPTIONAL_GROUPS = Object.freeze(['payment']);

/**
 * THE UPLIFT OF A CARRY, REWRITTEN WHOLE FOR A NEW TYPE, so no term of the old
 * type is left behind for the engine to refuse. A rate and a day basis
 * (simple), a rate (compound) or a multiple (multiple) is kept only when the old
 * uplift was already of that type; otherwise it is left out and the panel asks
 * for it ("not stated"). type undefined returns undefined: the uplift is not
 * stated at all.
 */
export const upliftFor = (type, old) => {
  if (type === undefined) return undefined;
  const was = isObj(old) ? old : {};
  if (type === 'simple') {
    if (was.type !== 'simple') return { type };
    const out = { type };
    if (was.ratePctPerYear !== undefined) out.ratePctPerYear = was.ratePctPerYear;
    if (was.dayBasis !== undefined) out.dayBasis = was.dayBasis;
    return out;
  }
  if (type === 'compound') return was.type === 'compound' && was.ratePctPerYear !== undefined ? { type, ratePctPerYear: was.ratePctPerYear } : { type };
  if (type === 'multiple') return was.type === 'multiple' && was.multiplePct !== undefined ? { type, multiplePct: was.multiplePct } : { type };
  return { type };
};

/**
 * The cap of an earning event, rewritten whole for a new cap type: an amount
 * and an overrun rule (gross-cost), an amount (carry-amount), nothing (none).
 * A term is kept only when the old cap was of the same type.
 */
export const capFor = (on, old) => {
  if (on === undefined) return undefined;
  const was = isObj(old) ? old : {};
  if (on === 'none') return { on };
  const out = { on };
  if (was.on === on && was.amount !== undefined) out.amount = was.amount;
  if (on === 'gross-cost' && was.on === on && was.overrunRule !== undefined) out.overrunRule = was.overrunRule;
  return out;
};

/* ------------------------------------------------ the engine routes, unchanged */

export const earningOf = (a) => earningObligation(clone(a));
export const dealOf = (a) => dealValue(clone(a));
export const informationOf = (a) => informationValue(clone(a));
export const priceOf = (a) => interestValue(clone(a));
export const riskOf = (a) => riskSharing(clone(a));
export const feeOf = (a) => consentFee(clone(a));
export const devCarryOf = (a) => developmentCarry(clone(a));
export const backInOf = (a) => backInRight(clone(a));

/* ------------------------------------------------ the view routes: what a pasted box goes through */

export const VIEW_KEYS = Object.freeze({
  earning: 'earning', deal: 'deal', fee: 'fee', information: 'information', risk: 'risk', price: 'price', devCarry: 'devCarry', backIn: 'backIn',
});
export const viewEarning = (v) => earningOf(pick(v, VIEW_KEYS.earning));
export const viewDeal = (v) => dealOf(pick(v, VIEW_KEYS.deal));
export const viewFee = (v) => feeOf(pick(v, VIEW_KEYS.fee));
export const viewInformation = (v) => informationOf(pick(v, VIEW_KEYS.information));
export const viewRisk = (v) => riskOf(pick(v, VIEW_KEYS.risk));
export const viewPrice = (v) => priceOf(pick(v, VIEW_KEYS.price));
export const viewDevCarry = (v) => devCarryOf(pick(v, VIEW_KEYS.devCarry));
export const viewBackIn = (v) => backInOf(pick(v, VIEW_KEYS.backIn));

/* ------------------------------------------------ the teaching cases, as a panel starts */

const G = (id) => GOLDEN_ARGS[id].args;

/** The starting inputs of every panel view: the fixture and golden inputs only. */
export const STARTS = Object.freeze({
  earning: G('earn-ekene-single'),
  earnHeadsUp: G('earn-heads-up'),
  earnFullCarry: G('earn-full-carry'),
  earnThird: G('earn-third-for-a-quarter'),
  earnBonus: G('earn-bonus-and-reimbursement'),
  earnNoneCompleted: G('earn-none-completed'),
  earnAllOfFarmor: G('earn-all-of-farmor'),
  earnConsent: G('fee-ekene'),
  capGrossBelow: G('earn-cap-gross-below'),
  capGrossExactly: G('earn-cap-gross-exactly'),
  capGrossPost: G('earn-cap-gross-exceeded-post'),
  capGrossFarmor: G('earn-cap-gross-exceeded-farmor-side'),
  capCarryBelow: G('earn-cap-carry-below'),
  capCarryExactly: G('earn-cap-carry-exactly'),
  capCarryExceeded: G('earn-cap-carry-exceeded'),
  capCarryZero: G('earn-cap-carry-zero'),
  dte: G('earn-ekene-drill-to-earn'),
  dteDone: G('earn-ekene-drill-to-earn-done'),
  dtePerEvent: G('earn-ekene-drill-to-earn-per-event'),
  dteNoneDone: G('earn-ekene-drill-to-earn-none-done'),
  deal: G('deal-ekene'),
  dealNpv: G('deal-ekene-npv-stated'),
  dealNoCap: G('deal-ekene-no-cap'),
  dealCarryCap: G('deal-ekene-carry-cap'),
  dealFarmorSide: G('deal-ekene-farmor-side'),
  dealBonusZero: G('deal-ekene-bonus-zero'),
  dealDry: G('deal-ekene-dry-hole'),
  dealCertain: G('deal-ekene-certain'),
  dealPsu: G('deal-psu-eme801'),
  dealKinks: G('deal-carry-cap-kinks'),
  dealBreakEven: G('deal-promote-exactly-break-even'),
  fee: G('fee-ekene'),
  feeIntra: G('fee-intra-group'),
  feePel: G('fee-pel-stated'),
  feeDay90: G('fee-day-90'),
  feeDay91: G('fee-day-91'),
  feeDay121: G('fee-day-121'),
  feeDay210: G('fee-day-210'),
  feeDay211: G('fee-day-211'),
  information: G('info-ekene-farminee'),
  infoFarmor: G('info-ekene-farmor'),
  infoTooDear: G('info-ekene-too-dear'),
  infoUninformative: G('info-uninformative'),
  risk: G('risk-ekene'),
  riskPsu: G('risk-psu'),
  riskSpread: G('risk-spread-four'),
  riskCorrelated: G('risk-correlated'),
  price: G('interest-ekene-risked'),
  priceSuccess: G('interest-ekene-success-case'),
  pricePsu: G('interest-psu-10pct'),
  priceProduction: G('interest-production-metric'),
  priceNegative: G('interest-negative-emv'),
  devCarry: G('devcarry-ekene'),
  devCarrySimple: G('devcarry-ekene-simple-ot18360'),
  devCarryCapped: G('devcarry-ekene-none-capped'),
  backIn: G('backin-ekene'),
  backInPia: G('backin-ekene-pia'),
});

/** The golden inputs each stated reading acts on, for the readings view. */
export const READING_CASES = Object.freeze({
  timing: G('deal-ekene'),
  day90: G('fee-day-90'),
  day91: G('fee-day-91'),
  day210: G('fee-day-210'),
  day211: G('fee-day-211'),
  simple: G('devcarry-ekene-simple-ot18360'),
  value: G('fee-ekene'),
});

/* ------------------------------------------------ the teaching readers (pinned by farmoutLab.test.js) */

/** The Ekene Deep earning obligation: the event and the totals. */
export const earningReader = () => {
  const r = earningOf(STARTS.earning);
  const ev = r.events[0];
  return {
    grossCost: ev.grossCost, farmineePays: ev.farmineePays, farmorPays: ev.farmorPays, carry: ev.carry,
    promotePoints: ev.promotePoints, promoteRatio: ev.promoteRatio, effectivePayingPct: ev.effectivePayingPct,
    consideration: r.totals.consideration, farmineeOutlay: r.totals.farmineeOutlay,
    equivalentWorkingInterestPct: r.totals.equivalentWorkingInterestPct, promoteAdjustedRatio: r.totals.promoteAdjustedRatio,
  };
};

/** The Ekene Deep deal: each position's EMV, the break-evens. */
export const dealReader = () => {
  const r = dealOf(STARTS.deal);
  return {
    aloneEmv: r.farmor.alone.emv, farmOutEmv: r.farmor.farmOut.emv, farmineeEmv: r.farmineeSide.farmIn.emv,
    breakEvenSharePct: r.breakEvenPromote.farmineePaysPct,
    farmineeBreakEvenChancePct: r.breakEvenChance.farminee.chanceOfSuccessPct,
  };
};

/** The Ekene development carry with its compound uplift, year by year to the year after payback. */
export const carryReader = () => {
  const r = devCarryOf(STARTS.devCarry);
  return r.ledger.filter((l) => l.year <= r.recoveredInYear + 1)
    .map((l) => ({ year: l.year, opening: l.opening, uplift: l.uplift, due: l.due, recovered: l.recovered, closing: l.closing }));
};

/** The Ekene consent fee. */
export const feeReader = () => {
  const r = feeOf(STARTS.fee);
  return { processingFee: r.processingFee, premium: r.premium, fee: r.fee, days: r.payment.days };
};

/** The seismic survey to the farminee. */
export const informationReader = () => {
  const r = informationOf(STARTS.information);
  return { evpi: r.evpi, evii: r.evii, netEvii: r.netEvii, signals: r.perSignal.map((s) => ({ probability: s.probability, posteriorSuccessPct: s.posteriorSuccessPct })) };
};

/** The Ekene Deep price per percent. */
export const priceReader = () => {
  const r = priceOf(STARTS.price);
  return { risked: r.perPct.risked, successCase: r.perPct.successCase, interestValue: r.interestValue, priceToValue: r.transaction.priceToValue };
};
