// THE EC9 TEACHING LAB: Joint Ventures, Operating Agreements & Cost Recovery.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/economics/jointVenture.js, sha-identical with
// petrolord-engines 3ae56e7, with the applyPSC and npv it imports from
// engines/economics/cashflow.ts and the calculatePartnerCosts it imports from
// engines/economics/afe.js) on the vendored Ekene fixture
// (packages/engines/test-data/economics/ekene-jv), on the INPUTS of the
// vendored golden file (test-data/economics/goldens/jointventure_cases.json),
// or on the terms a learner types into a calculator panel. The golden file's
// expected figures are oracle output and this lab never reads them:
// GOLDEN_ARGS carries the inputs only. joaLab.test.js asserts that every number
// a teaching reader returns is printed in the teaching digest.
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
// Nothing here reads a clock, a random number or a locale.
import FX from '@petrolord/engines/test-data/economics/ekene-jv/ekene-jv.json';
import GOLD from '@petrolord/engines/test-data/economics/goldens/jointventure_cases.json';
import {
  participatingInterests, cashCalls, budgetControl, overhead, defaultCover, carryRecovery,
  backIn, nonConsent, pscCostRecovery, DEFAULTS, PIA_JV,
} from '@petrolord/engines/engines/economics/jointVenture.js';

export { DEFAULTS, PIA_JV };

const clone = (o) => JSON.parse(JSON.stringify(o));

/** The golden file's INPUTS, by case id; its expected figures are left out. */
export const GOLDEN_ARGS = Object.freeze(Object.fromEntries(GOLD.cases.map((c) => [c.id, Object.freeze({ fn: c.fn, args: c.args })])));

/** The Ekene joint venture as the fixture states it. */
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
 * A case file holds several calls under named keys (interests, cashCalls,
 * budget, overhead, carry, backIn, default, psc, soleRisk, buyIn). A box that
 * holds a whole case file is read at the key a view needs; a box that holds one
 * call's inputs is read as it stands.
 */
export const pick = (c, key) => (isObj(c) && Object.prototype.hasOwnProperty.call(c, key) ? c[key] : c);

const INDEX = /^\d+$/;
const step = (a, k) => (isObj(a) ? a[k] : (Array.isArray(a) && INDEX.test(k) ? a[Number(k)] : undefined));

/** The value at a dotted path of an object, or undefined. A numeric step reads an array entry (scale.operating.bands.0.upTo). */
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
  return { text: pretty(next) };
};

/**
 * THE UPLIFT OF A CARRY, REWRITTEN WHOLE FOR A NEW TYPE, so no term of the old
 * type is left behind for the engine to refuse. A rate (compound) or a multiple
 * (multiple) is kept only when the old uplift was already of that type;
 * otherwise it is left out and the panel asks for it ("not stated").
 * type undefined returns undefined: the uplift is not stated at all.
 */
export const upliftFor = (type, old) => {
  if (type === undefined) return undefined;
  const was = isObj(old) ? old : {};
  if (type === 'compound') return was.type === 'compound' && was.ratePctPerYear !== undefined ? { type, ratePctPerYear: was.ratePctPerYear } : { type };
  if (type === 'multiple') return was.type === 'multiple' && was.multiplePct !== undefined ? { type, multiplePct: was.multiplePct } : { type };
  return { type };
};

/**
 * Stated carrier shares for a carry: every party no carry names as carried,
 * in equal shares that sum to 100 (the last share takes the remainder). These
 * are PLACEHOLDERS the learner then states, each with its own control.
 */
export const equalCarrierShares = (parties, carries) => {
  const carried = new Set((Array.isArray(carries) ? carries : []).map((c) => c && c.carried));
  const ids = (Array.isArray(parties) ? parties : []).map((p) => p && p.id).filter((id) => typeof id === 'string' && !carried.has(id));
  if (!ids.length) return {};
  const each = Number((100 / ids.length).toFixed(6));
  const out = {};
  ids.forEach((id, i) => { out[id] = i === ids.length - 1 ? Number((100 - each * (ids.length - 1)).toFixed(6)) : each; });
  return out;
};

/* ------------------------------------------------ the engine routes, unchanged */

export const interestsOf = (a) => participatingInterests(clone(a));
export const cashCallsOf = (a) => cashCalls(clone(a));
export const budgetOf = (a) => budgetControl(clone(a));
export const overheadOf = (a) => overhead(clone(a));
export const defaultOf = (a) => defaultCover(clone(a));
export const carryOf = (a) => carryRecovery(clone(a));
export const backInOf = (a) => backIn(clone(a));
export const nonConsentOf = (a) => nonConsent(clone(a));
export const pscOf = (a) => pscCostRecovery(clone(a));

/* ------------------------------------------------ the view routes: what a pasted box goes through */

export const VIEW_KEYS = Object.freeze({
  interests: 'interests', cashCalls: 'cashCalls', budget: 'budget', overhead: 'overhead', carry: 'carry',
  backIn: 'backIn', default: 'default', psc: 'psc', soleRisk: 'soleRisk', buyIn: 'buyIn',
});
export const viewInterests = (v) => interestsOf(pick(v, VIEW_KEYS.interests));
export const viewCashCalls = (v) => cashCallsOf(pick(v, VIEW_KEYS.cashCalls));
export const viewBudget = (v) => budgetOf(pick(v, VIEW_KEYS.budget));
export const viewOverhead = (v) => overheadOf(pick(v, VIEW_KEYS.overhead));
export const viewCarry = (v) => carryOf(pick(v, VIEW_KEYS.carry));
export const viewBackIn = (v) => backInOf(pick(v, VIEW_KEYS.backIn));
export const viewDefault = (v) => defaultOf(pick(v, VIEW_KEYS.default));
export const viewPsc = (v) => pscOf(pick(v, VIEW_KEYS.psc));
export const viewSoleRisk = (v) => nonConsentOf(pick(v, VIEW_KEYS.soleRisk));
export const viewBuyIn = (v) => nonConsentOf(pick(v, VIEW_KEYS.buyIn));

/* ------------------------------------------------ the teaching cases, as a panel starts */

const G = (id) => GOLDEN_ARGS[id].args;

/** The starting inputs of every panel view: the fixture and golden inputs only. */
export const STARTS = Object.freeze({
  interests: G('int-ekene'),
  interestsStated: G('int-half-carry-stated'),
  interestsTwo: G('int-two-carries'),
  cashCalls: G('cc-ekene-2027'),
  cashCallsRefund: G('cc-ekene-2027-refund'),
  cashCallsLag1: G('cc-ekene-2027-lag1'),
  ccZeroCall: G('cc-zero-call-month'),
  ccZeroCallRefund: G('cc-zero-call-month-refund'),
  ccThreshold: G('cc-threshold-exactly'),
  ccLastUncalled: G('cc-last-month-uncalled'),
  ccYearBoundary: G('cc-year-boundary'),
  budget: G('budget-ekene-2027'),
  budgetNorway: G('budget-norway-lower-of'),
  overhead: G('overhead-ekene-2031'),
  overheadNorway: G('overhead-norway-development-4000'),
  carry: G('carry-ekene-compound'),
  carryPia: G('carry-ekene-pia'),
  carryMultiple: G('carry-ekene-multiple'),
  carryCapped: G('carry-ekene-capped'),
  backIn: G('backin-ekene-pia'),
  backInUpfront: G('backin-ekene-contract-upfront'),
  default: G('default-ekene-march'),
  defaultKenya: G('default-ekene-monthly-compound-kenya'),
  defaultUncured: G('default-ekene-uncured'),
  psc: G('psc-ekene'),
  pscWorldBank: G('psc-wb-bn8-2007'),
  pscFari: G('psc-fari-table-12'),
  pscFariFigure5: G('psc-fari-figure-5'),
  soleRisk: G('nc-ekene-sidetrack'),
  buyIn: G('nc-ekene-buy-in-norway-1000'),
});

/** The golden inputs each stated reading acts on, for the readings view. */
export const READING_CASES = Object.freeze({
  tax: G('psc-ekene'),
  grace: G('default-grace-exceeded'),
  graceInside: G('default-grace-last-hour'),
  cover: G('default-ekene-march'),
  limitBase: G('psc-wb-bn8-2007'),
});

/* ------------------------------------------------ the teaching readers (pinned by joaLab.test.js) */

/** The Ekene interests under the carry. */
export const interestsReader = () => interestsOf(STARTS.interests).parties.map((p) => ({ id: p.id, beneficialPct: p.beneficialPct, payingPct: p.payingPct }));

/** The Ekene 2027 cash call ledger: month totals and the closing balances. */
export const ledgerReader = () => {
  const r = cashCallsOf(STARTS.cashCalls);
  return {
    months: r.months.map((m) => ({ month: m.month, forecast: m.forecast, actual: m.actual, call: m.totals.call, arrearsBilling: m.totals.arrearsBilling, difference: m.totals.difference })),
    closing: r.closing.map((c) => ({ id: c.id, balance: c.balance })),
  };
};

/** The Ekene carry with its compound uplift, year by year. */
export const carryReader = () => carryOf(STARTS.carry).ledger.map((l) => ({ year: l.year, opening: l.opening, uplift: l.uplift, due: l.due, recovered: l.recovered, closing: l.closing }));

/** The Ekene PSC variant, year by year. */
export const pscReader = () => pscOf(STARTS.psc).years.map((y) => ({ year: y.year, costOilLimit: y.costOilLimit, costRecovered: y.costRecovered, poolOut: y.poolOut, profitOil: y.profitOil, tax: y.tax }));

/** PB's premium ledger on the Ekene-4 sidetrack. */
export const nonConsentReader = () => {
  const r = nonConsentOf(STARTS.soleRisk);
  const pb = r.recovery.find((x) => x.id === 'PB');
  return { premium: pb.premium, revertsInYear: pb.revertsInYear, ledger: pb.ledger.map((l) => ({ year: l.year, recovered: l.recovered, closing: l.closing })) };
};

/** PB's March 2027 default. */
export const defaultReader = () => {
  const r = defaultOf(STARTS.default);
  return { unpaidTotal: r.unpaidTotal, interestTotal: r.interestTotal, cover: r.cover.map((c) => ({ id: c.id, cover: c.cover })) };
};
