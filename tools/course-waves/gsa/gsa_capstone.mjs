// THE THREE EC8 CAPSTONES AND THEIR EIGHTEEN GRADED FIELDS.
//
// Every graded value is a RETURN VALUE of the vendored engine
// (engines/economics/gasContract.js, with the npv and the gas royalty rate it
// imports from engines/economics/cashflow.ts) on the contract terms typed
// below. Nothing here computes a quantity, a price, a payment, a royalty or a
// present value by its own arithmetic: every number is read off an engine
// result object, and discriminate.mjs is where the wrong methods live.
//
//   OZUBU  Associate     quantities and one contract year: a metered month in
//                        MMBtu, the ACQ of a leap contract year, the effective
//                        swing, a fortnight's buyer and seller shortfall, and
//                        one year's deficiency payment
//   IFEYI  Professional  the ledger, the price and the Nigerian rules: an
//                        annual average price, a deficiency payment, make-up
//                        taken and expired in one year, the net to the seller
//                        over the term, and the lessee's Domestic Gas Delivery
//                        Obligation penalty
//   NWAKA  Expert        parity, the whole contract and reading the engine: an
//                        S-curve month, an annual average price above the high
//                        kink, a carry-forward credit, the end-of-term refund,
//                        the NPV of the seller's revenue and one year's royalty
//
// THE CASES ARE EKENE SYNTHETIC AGREEMENTS OF THEIR OWN, typed here with their
// own buyers, quantities, index series and terms, none of them the digest's.
// Their names, terms, index series and values must never enter a lesson, a
// bank, a panel default or a brief (gate_capstone_leak.mjs).
//
// THE PRICED LEDGER. A contract whose price is a formula is priced month by
// month by priceSeries, and the ledger's contractPrice and topPrice for a year
// are then COPIED from that year's priceSeries annual row, by the basis the
// case states ('annual-average', Article 15.2.6 Alternative 1, or
// 'last-month', Alternative 2); makeUpPrice is a stated figure. The copy is a
// lookup and no arithmetic, and the calculator panels do the same lookup
// (gsaLab.js pricedContract), which panelCapstoneReadable.test.js proves by
// reading every field off a rendered panel.
//
// EVERY FIELD IS FREE OF EVERY STATED READING AND OF THE DOMESTIC BASE PRICE.
// The engine states four readings (the seller shortfall measured against the
// quantity made available; the make-up right as the deficiency paid after any
// carry-forward credit; no make-up right from a last-year deficiency; royalty
// on the value of gas delivered and none on a deficiency payment). This file
// runs every capstone again through the engine with the OTHER side of each
// reading (ts_loader.mjs reading_* variants) and ASSERTS that every graded
// value comes out bit-identical. No capstone call passes a domestic base price
// (asserted), so no field depends on the reported figure.
//
// THE CARE RULES, all asserted below:
//   * ONE ANSWER. Every graded value is finite, non-zero and not a whole number.
//   * EVERY TERM IS STATED. Every input a value depends on is in the case,
//     printed by --inputs for the capstone brief and the case files.
//   * NO COLLISION. No two graded values sit within one tolerance of each other.
//
// Usage:
//   node gsa_capstone.mjs            the human table
//   node gsa_capstone.mjs --json     the rows make_fields.mjs writes
//   node gsa_capstone.mjs --inputs   the three cases, for gen_course.py,
//                                    discriminate.mjs, oracle_check.py and
//                                    gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST, and the digest generator reads nothing here.
import process from 'node:process';

const HERE = process.env.EC8_WAVE_DIR || '/root/cat-wip-gsa';
const { G, variant } = await import(`${HERE}/gsa_engine.mjs`);
const TOLPATH = process.env.EC8_TOLERANCE
  || '/root/wt-ec8-nextgen/src/components/course/panels/gsa/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const clone = (o) => JSON.parse(JSON.stringify(o));
const ok = (label, r) => {
  if (!r || r.error) throw new Error(`${label} was refused: ${r && r.error}`);
  return r;
};

/** A monthly index series from a list of values, starting at a month. */
const series = (start, values, name = 'oil') => {
  const [y0, m0] = start.split('-').map(Number);
  return values.map((v, i) => {
    const k = (y0 * 12 + m0 - 1) + i;
    return { month: `${Math.floor(k / 12)}-${String((k % 12) + 1).padStart(2, '0')}`, values: { [name]: v } };
  });
};

/**
 * The priced ledger: priceSeries on the case's formula, then takeOrPay (or
 * gsaCashFlows) on the case's years with contractPrice and topPrice COPIED from
 * that year's annual priceSeries row by the stated basis. Returns both results.
 */
const BASIS = { 'annual-average': 'averagePrice', 'last-month': 'lastMonthPrice' };
export const pricedContract = (E, c) => {
  const ps = ok('priceSeries', E.priceSeries(clone(c.price)));
  const byYear = Object.fromEntries(ps.annual.map((a) => [a.year, a]));
  const years = c.contract.years.map((y) => {
    const a = byYear[y.year];
    if (!a) throw new Error(`the price series does not price ${y.year}`);
    return { ...clone(y), contractPrice: a[BASIS[c.pricing.contractPrice]], topPrice: a[BASIS[c.pricing.topPrice]], makeUpPrice: c.pricing.makeUpPrice };
  });
  return { ps, contract: { ...clone(c.contract), years } };
};

/* ======================================================= OZUBU, Associate

   Ekene gas to the Ozubu Tile Works (synthetic), an industrial buyer, from
   2028. A metered month converted to MMBtu on the metric route; the contract
   quantities of the leap contract year 2028; a fortnight of daily nominations,
   availability and takes in February 2029 with a nomination above MaxDCQ, a
   delivery tolerance, a maintenance day, a force majeure day, a buyer-caused
   gap and seller shortfalls on days when the gas made available was all taken;
   and the take-or-pay year 2029 at a fixed contract price, with its take-or-pay
   price stated separately. */

const OZ_DCQ = 22437.25;
const OZUBU = {
  name: 'OZUBU',
  label: 'OZUBU, Ekene gas to the Ozubu Tile Works (synthetic), an industrial buyer',
  energy: { quantity: 16.85, quantityUnit: 'MMSm3', heatingValue: 38.62, heatingValueUnit: 'MJ/Sm3', heatingValueBasis: 'gross', referenceConditions: '15 C and 101.325 kPa, dry (the Ozubu metering statement, synthetic)' },
  quantities: { dcq: OZ_DCQ, period: { start: '2028-01-01', end: '2029-01-01' }, maxDcqPct: 115, topPct: 85 },
  fortnight: {
    dcq: OZ_DCQ, maxDcqPct: 115, deliveryTolerance: 150.5,
    days: [
      { date: '2029-02-01', nominated: 22180.5, available: 22180.5, taken: 22103.75 },
      { date: '2029-02-02', nominated: 24310.5, available: 24310.5, taken: 24310.5 },
      { date: '2029-02-03', nominated: 26980.75, available: 24115.25, taken: 24115.25 },
      { date: '2029-02-04', nominated: 20560.25, available: 20560.25, taken: 20488.25 },
      { date: '2029-02-05', nominated: 0, available: 0, taken: 0 },
      { date: '2029-02-06', nominated: 22437.25, available: 19862.5, taken: 19862.5, maintenance: 1500.25 },
      { date: '2029-02-07', nominated: 22900.75, available: 21340.25, taken: 21340.25 },
      { date: '2029-02-08', nominated: 22050.75, available: 22050.75, taken: 21980.5 },
      { date: '2029-02-09', nominated: 22437.25, available: 12410.75, taken: 12410.75, forceMajeure: 8200.5 },
      { date: '2029-02-10', nominated: 23150.25, available: 18460.5, taken: 18460.5, buyerCaused: true },
      { date: '2029-02-11', nominated: 22437.25, available: 22437.25, taken: 22437.25 },
      { date: '2029-02-12', nominated: 22437.25, available: 22320.25, taken: 22320.25 },
      { date: '2029-02-13', nominated: 24990.25, available: 24990.25, taken: 24876.75 },
      { date: '2029-02-14', nominated: 22300.5, available: 22300.5, taken: 22211.375 },
    ],
  },
  year: {
    topPct: 85,
    makeUp: { periodYears: 3, order: 'after-adjusted-acq', endOfTerm: 'forfeit' },
    years: [{ year: 2029, acq: 8189596.25, maintenance: 44873.5, forceMajeure: 67311.75, sellerShortfall: 12650.25, permittedReduction: 22437.25, taken: 6180450.5, contractPrice: 3.8625, topPrice: 3.4763, makeUpPrice: 0, shortfallPrice: 1.35 }],
  },
};

/* ================================================== IFEYI, Professional

   Ekene gas to the Ifeyi Glass Cluster (synthetic), 2028 to 2033, DCQ 31,250
   MMBtu per day, take-or-pay 82.5% of the Adjusted ACQ, make-up for 3
   contract years taken only after the year's Adjusted ACQ (the model GSA's
   order, stated), unrecovered make-up forfeited at the end. The price is
   0.62 + 0.0915 x the oil index averaged over 3 months ending 1 month before
   the priced month, reset every 3 months from January 2028, held between 4.25
   and 11.5, rounded to four decimals by the model GSA rule; the contract price
   and the take-or-pay price of a year are both the annual average of its
   monthly prices; make-up gas is invoiced at a stated 0.35 US$ per MMBtu.
   Seller shortfalls carry stated damages. The lessee's Domestic Gas Delivery
   Obligation for 2031 has voluntary contracts below the obligation, two
   excuses and a signed agreement rate of 3.2 US$ per MMBtu. */

const IF_OIL = [
  71.4, 73.15, 69.8, 66.25, // 2027-09 to 2027-12
  64.9, 62.35, 65.7, 68.45, 70.1, 72.6, 74.95, 77.3, 75.8, 73.25, 71.9, 70.4, // 2028
  68.15, 66.7, 63.95, 61.2, 60.45, 62.8, 65.35, 67.9, 69.25, 71.6, 73.05, 74.4, // 2029
  76.85, 78.2, 80.65, 82.1, 79.55, 77.9, 75.35, 73.8, 72.15, 70.6, 68.95, 67.3, // 2030
  65.75, 64.2, 66.55, 68.9, 71.25, 73.7, 75.05, 76.4, 78.85, 80.3, 81.65, 83.1, // 2031
  84.45, 82.9, 80.35, 78.7, 76.15, 74.6, 73.05, 71.5, 69.95, 68.4, 66.85, 65.3, // 2032
  63.75, 62.2, 60.65, 62.1, 64.55, 66.9, 69.35, 71.8, 74.25, 76.7, 78.15, 79.6, // 2033
];
const IFEYI = {
  name: 'IFEYI',
  label: 'IFEYI, Ekene gas to the Ifeyi Glass Cluster (synthetic), 2028 to 2033',
  price: {
    months: series('2027-09', IF_OIL),
    formula: { type: 'oil-indexed', index: 'oil', slope: 0.0915, constant: 0.62, floor: 4.25, ceiling: 11.5 },
    from: '2028-01', to: '2033-12', averagingMonths: 3, lagMonths: 1, resetMonths: 3, rounding: 'model-gsa-4dp',
  },
  pricing: { contractPrice: 'annual-average', topPrice: 'annual-average', makeUpPrice: 0.35 },
  contract: {
    topPct: 82.5,
    makeUp: { periodYears: 3, order: 'after-adjusted-acq', endOfTerm: 'forfeit' },
    years: [
      { year: 2028, acq: 11437500, forceMajeure: 468750, maintenance: 93750, taken: 7812500.5 },
      { year: 2029, acq: 11406250, maintenance: 93750, taken: 11562500.25 },
      { year: 2030, acq: 11406250, maintenance: 62500, sellerShortfall: 125000.5, shortfallPrice: 1.15, taken: 8750000.75 },
      { year: 2031, acq: 11406250, maintenance: 93750, taken: 11968750.5 },
      { year: 2032, acq: 11437500, maintenance: 93750, sellerShortfall: 218750.25, shortfallPrice: 1.15, taken: 11187500 },
      { year: 2033, acq: 11406250, maintenance: 93750, taken: 11250000.75 },
    ],
  },
  dgdo: {
    obligation: 8760400.4, delivered: 7915260.2, voluntaryContracts: 6250000,
    excused: { forceMajeure: 120500.3, transportUnavailable: 95000.25 },
    agreementPenaltyRate: 3.2,
  },
};

/* ======================================================= NWAKA, Expert

   Ekene gas to the Nwaka Methanol Plant (synthetic), a coastal plant that
   exports its methanol and utilises the gas in-country, 2029 to 2035, DCQ
   24,600 MMBtu per day, take-or-pay 88% of the Adjusted ACQ, make-up for 3
   contract years taken only after the year's take-or-pay quantity (the ESMAP
   order, stated), refunded at the last year's take-or-pay price at the end of
   the term; carry-forward of takes above the take-or-pay quantity for 2
   contract years, at most 40% of a year's deficiency. The price is 0.45 +
   0.118 x the oil index averaged over 6 months ending 2 months before the
   priced month, with an S-curve at 58 and 88 US$/bbl and slopes 0.059 below
   and 0.0472 above, reset every 3 months from January 2029, rounded to four
   decimals; the contract price of a year is its annual average and the
   take-or-pay price its last month's price; make-up gas at a stated 0.4.
   Royalty onshore with all gas utilised in-country; NPV at 10% to 2028. */

const NW_OIL = [
  56.2, 54.85, 53.4, 52.95, 51.5, 50.05, 49.6, 50.15, 51.7, 52.25, 53.8, 54.35, // 2028
  55.9, 56.45, 57.0, 55.55, 54.1, 52.65, 53.2, 54.75, 56.3, 57.85, 59.4, 60.95, // 2029
  62.5, 64.05, 65.6, 67.15, 68.7, 70.25, 71.8, 73.35, 74.9, 76.45, 78.0, 79.55, // 2030
  78.1, 76.65, 75.2, 73.75, 72.3, 70.85, 71.4, 72.95, 74.5, 76.05, 77.6, 79.15, // 2031
  80.7, 82.25, 83.8, 85.35, 86.9, 88.45, 87.0, 85.55, 84.1, 82.65, 83.2, 84.75, // 2032
  86.3, 87.85, 89.4, 90.95, 92.5, 94.05, 95.6, 97.15, 98.7, 97.25, 95.8, 94.35, // 2033
  92.9, 91.45, 92.0, 93.55, 95.1, 96.65, 98.2, 99.75, 98.3, 96.85, 95.4, 93.95, // 2034
  92.5, 91.05, 89.6, 88.15, 86.7, 85.25, 83.8, 82.35, 80.9, 79.45, 78.0, 76.55, // 2035
];
const NWAKA = {
  name: 'NWAKA',
  label: 'NWAKA, Ekene gas to the Nwaka Methanol Plant (synthetic), 2029 to 2035',
  price: {
    months: series('2028-01', NW_OIL),
    formula: { type: 'oil-indexed', index: 'oil', slope: 0.118, constant: 0.45, sCurve: { lowKink: 58, highKink: 88, lowSlope: 0.059, highSlope: 0.0472 } },
    from: '2029-01', to: '2035-12', averagingMonths: 6, lagMonths: 2, resetMonths: 3, rounding: 'model-gsa-4dp', reopeners: ['2032-01'],
  },
  pricing: { contractPrice: 'annual-average', topPrice: 'last-month', makeUpPrice: 0.4 },
  contract: {
    topPct: 88,
    makeUp: { periodYears: 3, order: 'after-top-quantity', endOfTerm: 'refund' },
    carryForward: { periodYears: 2, base: 'top-quantity', capPct: 40 },
    years: [
      { year: 2029, acq: 8979000, maintenance: 49200, taken: 8710250.5 },
      { year: 2030, acq: 8979000, maintenance: 73800, forceMajeure: 98400, taken: 6550400.25 },
      { year: 2031, acq: 8979000, maintenance: 49200, taken: 8008910.75 },
      { year: 2032, acq: 9003600, maintenance: 49200, taken: 8091320.5 },
      { year: 2033, acq: 8979000, maintenance: 49200, taken: 7956780.25 },
      { year: 2034, acq: 8979000, maintenance: 49200, sellerShortfall: 61500.5, shortfallPrice: 1.4, taken: 7238650.75 },
      { year: 2035, acq: 8979000, maintenance: 49200, taken: 8102450.5 },
    ],
  },
  royalty: { terrain: 'onshore', inCountrySharePct: 100 },
  discountRate: 0.1,
  baseYear: 2028,
};

export const CASES = { OZUBU, IFEYI, NWAKA };

/* ------------------------------------------------------ the engine routes

   READ[key] = [case, (E) => value]: the value the key names, read off the
   engine module E. The true engine is G; discriminate.mjs passes a variant. */

const ozQ = (E) => ok('contractQuantities', E.contractQuantities(clone(OZUBU.quantities)));
const ozD = (E) => ok('dailyBalance', E.dailyBalance(clone(OZUBU.fortnight)));
const ozT = (E) => ok('takeOrPay', E.takeOrPay(clone(OZUBU.year)));
const ifP = (E) => pricedContract(E, IFEYI);
const ifT = (E) => ok('takeOrPay', E.takeOrPay(ifP(E).contract));
const nwP = (E) => pricedContract(E, NWAKA);
const nwC = (E) => ok('gsaCashFlows', E.gsaCashFlows({ contract: nwP(E).contract, royalty: clone(NWAKA.royalty), discountRate: NWAKA.discountRate, baseYear: NWAKA.baseYear }));
const yr = (r, y) => r.years.find((x) => x.year === y);
const month = (ps, m) => ps.months.find((x) => x.month === m);
const annual = (ps, y) => ps.annual.find((x) => x.year === y);
const sumQ = (xs) => xs.reduce((s, x) => s + x.quantity, 0);

export const READ = {
  ozubu_march_2028_mmbtu: ['OZUBU', (E) => ok('toEnergy', E.toEnergy(clone(OZUBU.energy))).mmbtu],
  ozubu_2028_acq: ['OZUBU', (E) => ozQ(E).acq],
  ozubu_effective_swing: ['OZUBU', (E) => ozQ(E).effectiveSwing],
  ozubu_fortnight_buyer_shortfall: ['OZUBU', (E) => ozD(E).annual.buyerShortfall],
  ozubu_fortnight_seller_shortfall: ['OZUBU', (E) => ozD(E).annual.sellerShortfall],
  ozubu_2029_deficiency_payment: ['OZUBU', (E) => yr(ozT(E), 2029).deficiencyPayment],
  ifeyi_2030_average_price: ['IFEYI', (E) => annual(ifP(E).ps, 2030).averagePrice],
  ifeyi_2028_deficiency_payment: ['IFEYI', (E) => yr(ifT(E), 2028).deficiencyPayment],
  ifeyi_2031_make_up_taken: ['IFEYI', (E) => yr(ifT(E), 2031).makeUpTaken],
  ifeyi_2031_make_up_expired: ['IFEYI', (E) => sumQ(yr(ifT(E), 2031).makeUpExpired)],
  ifeyi_total_net_to_seller: ['IFEYI', (E) => ifT(E).totals.netToSeller],
  ifeyi_2031_dgdo_penalty: ['IFEYI', (E) => ok('domesticGasObligation', E.domesticGasObligation(clone(IFEYI.dgdo))).penalty],
  nwaka_july_2029_price: ['NWAKA', (E) => month(nwP(E).ps, '2029-07').price],
  nwaka_2034_average_price: ['NWAKA', (E) => annual(nwP(E).ps, 2034).averagePrice],
  nwaka_2030_carry_forward_credit: ['NWAKA', (E) => yr(nwC(E).takeOrPay, 2030).carryForwardApplied],
  nwaka_2035_refund: ['NWAKA', (E) => yr(nwC(E).takeOrPay, 2035).refund],
  nwaka_npv_seller_revenue: ['NWAKA', (E) => nwC(E).npvSellerRevenue],
  nwaka_2032_royalty: ['NWAKA', (E) => yr(nwC(E), 2032).royalty],
};

/** The other side of each reading the engine states. No graded value may move under any of them. */
export const OPEN_READINGS = ['reading_sfq_against_taken', 'reading_makeup_is_whole_deficiency', 'reading_last_year_opens_makeup', 'reading_royalty_on_deficiency'];

/* ------------------------------------------------------------ the checks */

const KEYS = GRADED_FIELDS.map(([, k]) => k);
must('READ carries exactly the eighteen graded keys, in order', JSON.stringify(Object.keys(READ)) === JSON.stringify(KEYS), Object.keys(READ).join(','));
const rows = GRADED_FIELDS.map(([tier, key, cls]) => {
  const value = READ[key][1](G);
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
// No capstone call passes a domestic base price, so no graded value can depend on the reported figure.
must('NO DOMESTIC BASE PRICE in any capstone case', !JSON.stringify(CASES).includes('domesticBasePrice'), 'domesticBasePrice');
// Every stated reading leaves every graded value bit-identical.
for (const name of OPEN_READINGS) {
  const V = await variant(name);
  rows.forEach((r) => {
    const v = READ[r.key][1](V);
    must(`READING-FREE: ${r.key} under ${name}`, Object.is(v, r.value), `${v} against ${r.value}`);
  });
}
// The readings are not vacuous: each one moves at least one figure of the digest's fixtures or of these cases.
// (discriminate.mjs prints what each moves; here it is enough that the variant loads and matches once.)

// SCENARIO CLAIMS the capstone brief will make, each asserted.
const oz = { q: ozQ(G), d: ozD(G), t: ozT(G) };
must('OZUBU: 3 February is nominated above MaxDCQ', oz.d.days.find((d) => d.date === '2029-02-03').properlyNominated < 26980.75, 'maxdcq');
must('OZUBU: on every day either the gas made available was all taken or the take is within the tolerance of the properly nominated quantity', oz.d.days.every((d) => d.taken === d.available || d.properlyNominated - OZUBU.fortnight.deliveryTolerance <= d.taken), 'reading-free days');
must('OZUBU: the fortnight carries a seller shortfall on at least three days', oz.d.days.filter((d) => d.sellerShortfall > 0).length >= 3, oz.d.days.filter((d) => d.sellerShortfall > 0).length);
must('OZUBU: 2029 has a deficiency', yr(oz.t, 2029).deficiency > 0, yr(oz.t, 2029).deficiency);
const ift = ifT(G);
must('IFEYI: 2028 and 2030 have deficiencies and 2033 has none', yr(ift, 2028).deficiency > 0 && yr(ift, 2030).deficiency > 0 && yr(ift, 2033).deficiency === 0, [2028, 2030, 2033].map((y) => yr(ift, y).deficiency).join(','));
must('IFEYI: make-up is taken in 2031 and some of it expires there', yr(ift, 2031).makeUpTaken > 0 && sumQ(yr(ift, 2031).makeUpExpired) > 0, 'mu');
must('IFEYI: the price is clamped in no month and every month is priced', ifP(G).ps.months.every((m) => m.clamped === null) && ifP(G).ps.months.length === 72, 'clamped');
const nwc = nwC(G);
const nwt = nwc.takeOrPay;
must('NWAKA: 2030 draws a carry-forward credit held at the cap', yr(nwt, 2030).carryForwardApplied > 0 && yr(nwt, 2030).carryForwardApplied < yr(nwt, 2030).carryForwardAvailable, `${yr(nwt, 2030).carryForwardApplied} of ${yr(nwt, 2030).carryForwardAvailable}`);
must('NWAKA: the last year has no deficiency', yr(nwt, 2035).deficiency === 0, yr(nwt, 2035).deficiency);
must('NWAKA: 2032 carries make-up taken and no deficiency payment', yr(nwt, 2032).makeUpTaken > 0 && yr(nwt, 2032).deficiencyPayment === 0, 'royalty year');
must('NWAKA: July 2029 is priced on the low segment and 2034 has high-segment months', month(nwP(G).ps, '2029-07').segment === 'low' && nwP(G).ps.months.some((m) => m.month.startsWith('2034') && m.segment === 'high'), 'segments');
must('NWAKA: only one deficiency year draws a carry-forward credit', nwt.years.filter((y) => y.carryForwardApplied > 0).length === 1, 'cf years');

/* ------------------------------------------------------------ the output */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`gsa_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED\n`);
  process.exit(1);
}
if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(rows.map(({ tier, key, cls, value }) => ({ tier, key, cls, value })))}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify(CASES)}\n`);
} else if (import.meta.url === `file://${process.argv[1]}`) {
  rows.forEach((r) => console.log(`${r.tier.padEnd(13)} ${r.key.padEnd(34)} ${String(r.value).padEnd(24)} tol ${r.tol}`));
  console.log(`gsa_capstone: ${ASSERTS.length} assertions, 0 failed; ${OPEN_READINGS.length} stated readings, every field bit-identical under each`);
}
