// THE EC8 TEACHING LAB: Gas Commercialisation & Gas Sales Agreements.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/economics/gasContract.js, sha-identical with
// petrolord-engines d745b88, with the npv and gas royalty rate it imports from
// engines/economics/cashflow.ts) on the vendored Ekene fixtures
// (packages/engines/test-data/economics/ekene-gsa), on the INPUTS of the
// vendored golden file (test-data/economics/goldens/gascontract_cases.json),
// or on the terms a learner types into a calculator panel. The golden file's
// expected figures are oracle output and this lab never reads them: GOLDEN_ARGS
// carries the inputs only. gsaLab.test.js asserts that every number a teaching
// reader returns is printed in the teaching digest.
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
// Nothing here reads a clock, a random number or a locale.
import POWER from '@petrolord/engines/test-data/economics/ekene-gsa/domestic-power.json';
import EXPORT from '@petrolord/engines/test-data/economics/ekene-gsa/export-feed.json';
import GOLD from '@petrolord/engines/test-data/economics/goldens/gascontract_cases.json';
import {
  toEnergy, contractQuantities, dailyBalance, takeOrPay, priceSeries, energyParitySlope,
  domesticPrice, domesticGasObligation, gsaCashFlows, DEFAULTS, UNITS, PIA_GAS,
} from '@petrolord/engines/engines/economics/gasContract.js';

export { DEFAULTS, UNITS, PIA_GAS };

const clone = (o) => JSON.parse(JSON.stringify(o));

/** The golden file's INPUTS, by case id; its expected figures are left out. */
export const GOLDEN_ARGS = Object.freeze(Object.fromEntries(GOLD.cases.map((c) => [c.id, Object.freeze({ fn: c.fn, args: c.args })])));

/** The two Ekene agreements as the fixtures state them. */
export const FIXTURES = Object.freeze({ power: POWER, export: EXPORT });

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

/**
 * A case file holds several calls under named keys (energy, quantities,
 * fortnight, year, price, pricing, contract, dgdo, royalty, discountRate,
 * baseYear). A box that holds a whole case file is read at the key a view
 * needs; a box that holds one call's inputs is read as it stands.
 */
export const pick = (c, key) => (c && typeof c === 'object' && !Array.isArray(c) && Object.prototype.hasOwnProperty.call(c, key) ? c[key] : c);

/* ------------------------------------------------ the engine routes, unchanged */

export const energyOf = (a) => toEnergy(clone(a));
export const quantitiesOf = (a) => contractQuantities(clone(a));
export const dailyOf = (a) => dailyBalance(clone(a));
export const takeOrPayOf = (a) => takeOrPay(clone(a));
export const priceOf = (a) => priceSeries(clone(a));
export const parityOf = (a) => energyParitySlope(clone(a));
export const domesticOf = (a) => domesticPrice(clone(a));
export const dgdoOf = (a) => domesticGasObligation(clone(a));
export const cashFlowsOf = (a) => gsaCashFlows(clone(a));

/**
 * THE PRICED LEDGER. A contract priced by a formula is priced month by month
 * with priceSeries, and each year's contractPrice and topPrice are COPIED from
 * that year's annual row by the basis the case states: 'annual-average' (the
 * model agreement's Article 15.2.6 Alternative 1) or 'last-month'
 * (Alternative 2). makeUpPrice is the stated figure. The copy is a lookup; the
 * engine computes every figure on both sides of it.
 *
 *   case: { price: <priceSeries inputs>, pricing: { contractPrice, topPrice, makeUpPrice }, contract: <takeOrPay inputs without the prices> }
 *
 * Returns { error } (the engine's own, or a missing priced year) or
 * { value: { price, contract } }, contract being the takeOrPay inputs with the
 * prices filled in.
 */
export const PRICE_BASES = { 'annual-average': 'averagePrice', 'last-month': 'lastMonthPrice' };
export const pricedContract = (c) => {
  if (!c || typeof c !== 'object' || !c.price || !c.pricing || !c.contract) return { error: 'a priced case needs price, pricing and contract' };
  const ps = priceOf(c.price);
  if (ps.error) return ps;
  const byYear = Object.fromEntries(ps.annual.map((a) => [a.year, a]));
  const bases = [c.pricing.contractPrice, c.pricing.topPrice];
  if (!bases.every((b) => Object.prototype.hasOwnProperty.call(PRICE_BASES, b))) return { error: `pricing.contractPrice and pricing.topPrice must each be one of ${Object.keys(PRICE_BASES).join(', ')}` };
  const years = [];
  for (const y of (c.contract.years || [])) {
    const a = byYear[y.year];
    if (!a) return { error: `the price series does not price the contract year ${y.year}` };
    years.push({ ...clone(y), contractPrice: a[PRICE_BASES[c.pricing.contractPrice]], topPrice: a[PRICE_BASES[c.pricing.topPrice]], makeUpPrice: c.pricing.makeUpPrice });
  }
  return { value: { price: ps, contract: { ...clone(c.contract), years } } };
};

/** takeOrPay on a plain contract, or on a priced case through pricedContract. */
export const ledgerOf = (c) => {
  if (c && c.price && c.pricing && c.contract) {
    const p = pricedContract(c);
    if (p.error) return p;
    const r = takeOrPayOf(p.value.contract);
    return r.error ? r : { ...r, priced: p.value };
  }
  return takeOrPayOf(pick(c, 'contract'));
};

/** gsaCashFlows on a whole case (contract, or price + pricing + contract; royalty, discountRate, baseYear). */
export const contractCashOf = (c) => {
  if (!c || typeof c !== 'object') return { error: 'a case needs contract, royalty, discountRate and baseYear' };
  let contract = c.contract;
  if (c.price && c.pricing) {
    const p = pricedContract(c);
    if (p.error) return p;
    contract = p.value.contract;
  }
  return cashFlowsOf({ contract, royalty: c.royalty, discountRate: c.discountRate, baseYear: c.baseYear });
};

/* ------------------------------------------------ the view routes: what a pasted box goes through

   Every view reads the box through `pick` at the key it needs, so a whole case
   file pasted into any view runs the block that view computes, and a box that
   holds one call's inputs runs as it stands. The ledger and the contract money
   views read a priced case (price, pricing, contract) by its named keys. */

export const VIEW_KEYS = Object.freeze({
  energy: 'energy', quantities: 'quantities', daily: 'fortnight', year: 'year',
  price: 'price', domestic: 'domestic', dgdo: 'dgdo', curve: 'price', parity: 'parity',
});
export const viewEnergy = (v) => energyOf(pick(v, VIEW_KEYS.energy));
export const viewQuantities = (v) => quantitiesOf(pick(v, VIEW_KEYS.quantities));
export const viewDaily = (v) => dailyOf(pick(v, VIEW_KEYS.daily));
export const viewYear = (v) => takeOrPayOf(pick(v, VIEW_KEYS.year));
export const viewLedger = (v) => ledgerOf(v);
export const viewPrice = (v) => priceOf(pick(v, VIEW_KEYS.price));
export const viewDomestic = (v) => domesticOf(pick(v, VIEW_KEYS.domestic));
export const viewDgdo = (v) => dgdoOf(pick(v, VIEW_KEYS.dgdo));
export const viewCurve = (v) => priceOf(pick(v, VIEW_KEYS.curve));
export const viewCash = (v) => contractCashOf(v);
export const viewParity = (v) => parityOf(pick(v, VIEW_KEYS.parity));

/* ------------------------------------------------ the teaching cases, as a panel starts */

const powerContract = () => ({ years: clone(POWER.years), topPct: POWER.topPct, makeUp: clone(POWER.makeUp) });
/** One Ekene power plant contract year alone, as a one-year take-or-pay case. */
const powerYear = (year) => ({ years: [clone(POWER.years.find((y) => y.year === year))], topPct: POWER.topPct, makeUp: clone(POWER.makeUp) });

/** The starting inputs of every panel view: the fixtures and golden inputs only. The one
 *  take-or-pay year view starts from a one-year golden case and offers two power plant
 *  years alone (the fixture's 2027 and 2032). */
export const STARTS = Object.freeze({
  energy: GOLDEN_ARGS['energy-power-dcq'].args,
  quantities: GOLDEN_ARGS['cq-power-2028-leap'].args,
  daily: { dcq: POWER.january2027.dcq, maxDcqPct: POWER.january2027.maxDcqPct, days: POWER.january2027.days },
  year: GOLDEN_ARGS['top-single-year'].args,
  ledger: powerContract(),
  exportLedger: GOLDEN_ARGS['top-export'].args,
  power2027: powerYear(2027),
  power2032: powerYear(2032),
  price: GOLDEN_ARGS['price-export'].args,
  domestic: GOLDEN_ARGS['dp-gbi-urea-inside'].args,
  dgdo: GOLDEN_ARGS['dgdo-power-2028'].args,
  sCurve: GOLDEN_ARGS['price-ecs-figure-51'].args,
  parity: GOLDEN_ARGS['parity-ecs-0172'].args,
  cash: GOLDEN_ARGS['cf-export'].args,
});

/* ------------------------------------------------ the teaching readers (pinned by gsaLab.test.js) */

/** The power plant's January 2027 day by day: the month's totals. */
export const januaryReader = () => {
  const r = dailyOf(STARTS.daily);
  return { annual: r.annual, sellerShortfallDays: r.days.filter((d) => d.sellerShortfall > 0).map((d) => d.date) };
};

/** The power plant ledger: deficiency payments and make-up by year, and the totals. */
/** The power plant's 2027 and 2032, each run alone as a one-year case. */
export const powerYearReader = () => [STARTS.power2027, STARTS.power2032].map((c) => {
  const y = takeOrPayOf(c).years[0];
  return { year: y.year, adjustedAcq: y.adjustedAcq, topQuantity: y.topQuantity, deficiency: y.deficiency, deficiencyPayment: y.deficiencyPayment, shortfallPayment: y.shortfallPayment, netToSeller: y.netToSeller };
});

export const powerLedgerReader = () => {
  const r = takeOrPayOf(STARTS.ledger);
  return {
    years: r.years.map((y) => ({ year: y.year, deficiencyPayment: y.deficiencyPayment, makeUpTaken: y.makeUpTaken, makeUpOutstanding: y.makeUpOutstanding })),
    totals: { deficiencyPayment: r.totals.deficiencyPayment, makeUpTaken: r.totals.makeUpTaken, netToSeller: r.totals.netToSeller },
  };
};

/** The export feed's annual prices on the fixture index. */
export const exportPriceReader = () => priceOf(STARTS.price).annual.map((a) => ({ year: a.year, averagePrice: a.averagePrice, lastMonthPrice: a.lastMonthPrice }));

/** The published S-curve (Energy Charter Secretariat Figure 51), month by month. */
export const sCurveReader = () => priceOf(STARTS.sCurve).months.map((m) => ({ month: m.month, price: m.price }));

/** The export contract in money. */
export const exportCashReader = () => {
  const r = cashFlowsOf(STARTS.cash);
  return { royaltyRate: r.royaltyRate, npvSellerRevenue: r.npvSellerRevenue, npvNetAfterRoyalty: r.npvNetAfterRoyalty };
};
