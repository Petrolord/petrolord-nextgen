// THE EC8 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-gasContract.md,
// the oracle, the golden file's expected figures, the fixture README and the
// engine's own source comments are PROVENANCE. Where they state a figure this
// file recomputes it through the engine on the vendored golden INPUTS, on the
// fixtures, or on stated inputs, and prints it.
//
// Usage:  sh /root/cat-wip-gsa/build_digest.sh > digest.tmp && mv digest.tmp digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE
// (engines/economics/gasContract.js and the npv it imports from
// engines/economics/cashflow.ts), except where a line says "stated" (an input
// typed in this file and printed beside the call it went into), "golden input"
// (an input read from the vendored test-data/economics/goldens/
// gascontract_cases.json, whose inputs are the Ekene synthetic fixtures and
// stated probes), "fixture" (read from the vendored ekene-gsa files), "text"
// (a figure printed by a public text, quoted in concepts.json with its
// citation and verified against the text by quote_check.py, or typed here with
// its citation) or "derived" (arithmetic on engine values printed in the same
// block, with the arithmetic stated). Nothing here reads a clock, a random
// number, a locale or a network; TZ and LC_ALL are pinned by build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page, and asserted.
// Two figures that print alike at six decimals are never called equal unless
// the engine says so.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names; `success()` asserts no error
// key and every top-level number finite; every claim a sentence makes about a
// table goes through `must()`. If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads gsa_capstone.mjs,
// fields.json or the capstone cases, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.EC8_WAVE_DIR || '/root/cat-wip-gsa';
const { G, CF, ROOT, ENGINE_REL } = await import(`${HERE}/gsa_engine.mjs`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const FINDINGS = fs.readFileSync(`${ROOT}/tools/validation/economics/FINDINGS-gasContract.md`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/gascontract_cases.json`, 'utf8'));
const FIX = (f) => JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/ekene-gsa/${f}`, 'utf8'));
const CONCEPTS = JSON.parse(fs.readFileSync(process.env.EC8_CONCEPTS || `${HERE}/concepts.json`, 'utf8'));
const MODULES = JSON.parse(execFileSync('python3', [`${HERE}/structure.py`, '--modules'], { encoding: 'utf8' }));

/* ---------------------------------------------------------- the machinery */

const OUT = [];
const w = (s = '') => OUT.push(s);
const ASSERTS = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0, bad.map(([k, v]) => `${k}=${v}`).join(', ') || 'all finite');
  }
  return r;
};
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned ${JSON.stringify(r).slice(0, 80)}`);
  if (field !== undefined) must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, r && r.field);
  must(`THE MESSAGE STARTS WITH THE FIELD'S NAME: ${label}`, r && typeof r.error === 'string' && r.error.startsWith(`${r.field} `), r && r.error);
  return r;
};
// A figure of sixteen or more significant digits at six decimals reads as a
// serialised float, so it prints with its thousands grouped by commas; the
// digits are the same.
const group = (s) => { const [i, d] = s.split('.'); return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${d === undefined ? '' : `.${d}`}`; };
const f6 = (x) => {
  if (x === null || x === undefined) return 'none';
  const s = Number(x).toFixed(6);
  return s.replace(/^-/, '').replace('.', '').replace(/^0+/, '').length > 15 ? group(s) : s;
};
const S = (x) => String(x);
const nn = (x) => (x === null || x === undefined ? 'none' : String(x));
const list = (a) => (a.length ? a.join(', ') : 'none');
const clone = (o) => JSON.parse(JSON.stringify(o));
const cell = (s) => String(s).replace(/\|/g, '/');
const sum = (a) => a.reduce((s, v) => s + v, 0);
const ownerClause = (owners) => owners.map((o) => {
  const m = o.match(/^(Associate|Professional|Expert) (m\d{2})(?: (l\d{2}))?$/);
  if (!must(`owner "${o}" is well formed`, !!m, o)) return o;
  const mod = MODULES[m[1]] && MODULES[m[1]][m[2]];
  must(`owner "${o}" names a module structure.py has`, !!mod, o);
  if (m[3]) must(`owner "${o}" names a lesson structure.py has`, mod && mod.lessons.includes(m[3]), o);
  return o;
}).join(' and ');
// THE SECTION ORDER, declared once, so a sentence can name a later section by
// key and never by a typed number that goes stale when a section is inserted.
const ORDER = ['computes', 'sources', 'provisions', 'dataset', 'refusals', 'graded',
  'energy', 'quantities', 'daily', 'topyear',
  'ledger', 'carryforward', 'prices', 'domestic', 'dgdo',
  'parity', 'cashflows', 'readings', 'quirks', 'boundaries', 'notcomputed', 'caps', 'choices',
  'vocabulary'];
const ref = (k) => { const i = ORDER.indexOf(k); must(`a sentence refers to a declared section ${k}`, i >= 0, k); return `section ${i + 1}`; };
const refCap = (k) => { const r = ref(k); return r[0].toUpperCase() + r.slice(1); };
let SECTION = 0;
const OWNED = new Set();
const section = (k, title, owners) => {
  SECTION += 1;
  must(`section ${k} is declared at position ${SECTION}`, ORDER[SECTION - 1] === k, `${ORDER[SECTION - 1]} at ${SECTION}`);
  owners.forEach((o) => OWNED.add(o.split(' ').slice(0, 2).join(' ')));
  w();
  w(`# SECTION ${SECTION}: ${title} (owned by ${ownerClause(owners)})`);
  w();
};
const table = (head, rows) => {
  w(`| ${head.join(' | ')} |`);
  w(`| ${head.map(() => '---').join(' | ')} |`);
  rows.forEach((r) => w(`| ${r.map(cell).join(' | ')} |`));
};
const quote = (s) => w(`> ${s}`);
const reasons = (rs) => rs.forEach((r) => quote(r));
// A provision from concepts.json, found and verified (quote_check.py re-verifies every quote against the text).
const CON = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
const dashfix = (q) => q.replace(/\s*[–—]\s*/g, ': ');
const C = (id) => { const c = CON[id]; must(`concepts.json carries a found provision ${id}`, c && c.found === true && c.quote && c.cite, id); return c || { cite: id, quote: '', paraphrase: '' }; };
const cq = (id) => { const c = C(id); w(`${c.cite}: ${c.paraphrase}`); quote(`"${dashfix(c.quote)}" (${c.cite})`); };

/* ---------------------------------------------------------- the engine runs */

const GC = Object.fromEntries(GOLD.cases.map((c) => [c.id, c]));
const isRefusalCase = (c) => c.expected && c.expected.error === true;
const runG = (id) => {
  const c = GC[id];
  must(`the golden file carries the case ${id}`, !!c, id);
  return success(`${c.fn} on the golden input ${id}`, G[c.fn](clone(c.args)));
};
const argsOf = (id) => clone(GC[id].args);
const yr = (r, y) => r.years.find((x) => x.year === y);
const PW = FIX('domestic-power.json');
const EX = FIX('export-feed.json');
const D = G.DEFAULTS;
const U = G.UNITS;
const P = G.PIA_GAS;
// STATED PROBES, each handed to the engine and printed from here.
const PROBES = {
  cq: { dcq: 100, days: 365, maxDcqPct: 100, topPct: 80 },
  day: { dcq: 100, maxDcqPct: 120, days: [{ date: '2027-03-01', nominated: 120, available: 120, taken: 120 }] },
  cap: { years: [{ year: 2027, acq: 1000, taken: 1100, contractPrice: 3, topPrice: 3, makeUpPrice: 0 }, { year: 2028, acq: 1000, taken: 700, contractPrice: 3, topPrice: 3, makeUpPrice: 0 }], topPct: 80, makeUp: { periodYears: 0, order: 'after-adjusted-acq', endOfTerm: 'forfeit' }, carryForward: { periodYears: 1, base: 'top-quantity', capPct: 50 } },
  floor: { months: [{ month: '2027-01', values: { oil: 30 } }, { month: '2027-02', values: { oil: 29 } }], formula: { type: 'oil-indexed', index: 'oil', slope: 0.1, constant: 1, floor: 4, ceiling: 9 }, from: '2027-01', to: '2027-02' },
};

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# EC8 TEACHING DIGEST: Gas Commercialisation & Gas Sales Agreements');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle, the golden file\'s expected figures, the fixture README and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every quantity, price, amount of money, rate, ratio, fraction, share, percentage, slope, index average and present value prints to SIX decimals; years, day counts, month counts, contract years and whole inputs print as whole numbers; a figure of sixteen or more significant digits at six decimals prints with its thousands grouped by commas; an engine message, reason and basis is printed verbatim, figures and all, and a figure inside a message is the shortest round-trip decimal of the double the engine holds.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines d745b88 (engines PR #267), ${engineLines} lines. It imports npv, deriveGasRoyaltyRate and calendarDays from engines/economics/cashflow.ts and nothing else. It makes no network call.`);
w();
w('# AN ENGINE COURSE. There is no Suite app for this course. Every practical runs in the course\'s own calculator panels, which call this same vendored engine on the learner\'s own contract terms.');
w();
w('# THE DATA. Every Ekene agreement, buyer, quantity, index series and allocation is SYNTHETIC, written for this platform by a stated script. No real company, plant, contract, price series or regulator allocation appears.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone case and no graded answer. The capstones run their own agreements and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m05', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming the rule it applied and where the rule comes from, so the working can be printed.');
w();
const EXPORTS = [
  ['toEnergy', 'volume to energy', 'quantity, quantityUnit, heatingValue, heatingValueUnit, heatingValueBasis, referenceConditions', 'MMBtu and GJ with the route taken and the heating value basis'],
  ['contractQuantities', 'contract quantities', 'dcq, days or year or period, maxDcqPct, topPct', 'the day count, ACQ, MaxDCQ, swing factor, the take-or-pay quantity on the full ACQ and the effective swing'],
  ['dailyBalance', 'the daily balance', 'dcq, maxDcqPct, deliveryTolerance, days', 'each day\'s properly nominated quantity, seller shortfall, adjusted DCQ, buyer shortfall and over-take with its reasons, and the year\'s totals'],
  ['takeOrPay', 'the take-or-pay reconciliation', 'years, topPct, makeUp, carryForward', 'each year\'s Adjusted ACQ, take-or-pay quantity, make-up, deficiency, carry-forward, expiries, damages, refund and net to the seller with its reasons'],
  ['priceSeries', 'contract prices', 'months, formula, from, to, averagingMonths, lagMonths, resetMonths, rounding, reopeners', 'each month\'s window, index average, segment, clamp and price, the annual average and last-month price, and the reopeners reported'],
  ['energyParitySlope', 'energy parity', 'mmbtuPerBarrel', 'the gas price per MMBtu that matches one dollar per barrel on heat content'],
  ['domesticPrice', 'Nigerian domestic prices', 'sector, domesticBasePrice, negotiatedPrice, product, cmpp, transportTariff, schedule', 'the sector price under PIA s.167 or s.168 and the Fourth Schedule, with its reason'],
  ['domesticGasObligation', 'the Domestic Gas Delivery Obligation', 'obligation, delivered, voluntaryContracts, excused, agreementPenaltyRate, penaltyRate', 'deemed fulfilment, the undelivered quantity, the excuses applied, the penalised quantity, the rate and the penalty with its reasons'],
  ['gsaCashFlows', 'cash flows and NPV', 'contract, royalty, discountRate, baseYear', 'each year\'s seller revenue, delivered value, royalty and net after royalty, and the NPV of the seller revenue and of the net'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof G[name] === 'function', typeof G[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(G).filter((k) => typeof G[k] === 'function').length === EXPORTS.length, Object.keys(G).filter((k) => typeof G[k] === 'function').join(','));
w();
w('The stated constants, read from the exported `DEFAULTS`, `UNITS` and `PIA_GAS`:');
w();
const DSRC = {
  MAX_YEARS: ['the most contract years one call accepts', 'cap'],
  MAX_DAYS: ['the most days in one daily balance', 'cap'],
  MAX_MONTHS: ['the most index months, and the most priced months, in one price series', 'cap'],
  MAX_INDICES: ['the most indices in a basket formula', 'cap'],
  WEIGHT_SUM_TOLERANCE: ['how far basket weights may sum from 1', 'engine convention'],
  PRICE_DIGITS: ['the significant digits a price is normalised to before the four-decimal rule reads its fifth decimal', 'engine convention'],
};
table(['constant', 'value', 'what it sets', 'where it comes from'], [
  ...Object.entries(D).map(([k, v]) => [`\`DEFAULTS.${k}\``, S(v), DSRC[k][0], DSRC[k][1]]),
  ['`UNITS.BTU_IT_J`', S(U.BTU_IT_J), 'joules in one International Table Btu', 'NIST SP 811 (2008 edition), Appendix B, exact by definition'],
  ['`UNITS.M3_PER_FT3`', S(U.M3_PER_FT3), 'cubic metres in one cubic foot', '(0.3048 m) cubed, exact'],
  ['`PIA_GAS.dgdoPenaltyUsdPerMmbtu`', f6(P.dgdoPenaltyUsdPerMmbtu), 'US$ per MMBtu not delivered', 'PIA s.110(8); DGDO Regulations 2022 r.6(1)'],
  ['`PIA_GAS.commercialAdderUsdPerMmbtu`', f6(P.commercialAdderUsdPerMmbtu), 'US$ per MMBtu added to the domestic base price for the commercial sector', 'PIA s.167(6)'],
  ['`PIA_GAS.gbiFloorUsdPerMmbtu`', f6(P.gbiFloorUsdPerMmbtu), 'the gas based industries floor, US$ per MMBtu', 'PIA s.168(2)'],
]);
must('DEFAULTS carries six values, each described here', Object.keys(D).length === 6 && Object.keys(D).every((k) => DSRC[k]), Object.keys(D));
must('DEFAULTS, UNITS and PIA_GAS are frozen', Object.isFrozen(D) && Object.isFrozen(U) && Object.isFrozen(P), 'frozen');
w();
w('The Fourth Schedule products the engine holds in `PIA_GAS.gbiProducts` (NRP in US$ per MMBtu, PRP in US$ per tonne):');
w();
table(['product key', 'label', 'NRP', 'PRP'], Object.entries(P.gbiProducts).map(([k, v]) => [k, v.label, f6(v.nrp), f6(v.prp)]));
must('five products, NRP 1 each, PRP 250 or 325', Object.keys(P.gbiProducts).length === 5 && Object.values(P.gbiProducts).every((v) => v.nrp === 1 && (v.prp === 250 || v.prp === 325)), 'products');
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports and its source:');
const IMPORTS = [...ENGINE_SRC.matchAll(/^import .* from \x27([^\x27]+)\x27;$/gm)].map((m) => m[1]);
must('the engine imports exactly cashflow.ts', IMPORTS.join() === './cashflow.ts', IMPORTS.join());
must('the engine source makes no network call, reads no clock and draws no random number', !/\bfetch\x28|XMLHttpRequest|\bimport\x28|require\x28|Math\.random|Date\.now|new Date\x28\x29/.test(ENGINE_SRC), 'none');
w('- Its one import is engines/economics/cashflow.ts, for npv, deriveGasRoyaltyRate and calendarDays. It discounts through the canonical npv and takes the gas royalty rate from the canonical deriveGasRoyaltyRate; it carries no NPV, Monte Carlo or royalty code of its own, and nothing in it samples.');
w(`- It decides nothing a contract or a text does not state. The take-or-pay percentage, the make-up period, the recovery order, the end-of-term rule, every price, the seller shortfall rate and the domestic base price are inputs with no default, and a call without one is refused by name (${ref('refusals')}).`);
must('ACCEPTED_KEYS carries one shape for every exported function', Object.keys(G.ACCEPTED_KEYS).sort().join() === EXPORTS.map((x) => x[0]).sort().join() && Object.isFrozen(G.ACCEPTED_KEYS), Object.keys(G.ACCEPTED_KEYS).join());
w(`- It reads no key it does not know. \`ACCEPTED_KEYS\` is exported with one shape for each of the ${EXPORTS.length} functions, and every call refuses an input key the function does not read, at every level, naming the key, its path and the accepted keys. A misspelt optional key is refused; it never silently drops a term.`);
w(`- It models no outcome of a price review, no excess gas, no off-specification or pre-start gas and no flare penalty. ${refCap('notcomputed')} lists each with where it would come from.`);
w(`- Its exported names are, in full: ${Object.keys(G).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('sources', 'The sources, their editions and the date each was read', ['Associate m01 l04', 'Professional m05', 'Professional m06', 'Expert m04']);
w('THE RULE THIS COURSE FOLLOWS FOR EVERY LAW, REGULATION, MODEL CONTRACT AND GUIDE IT TEACHES. Each one is named with its edition or gazette date and the date it was read. Only publicly available texts are quoted, with their citation. Licensed model contracts (the AIPN model gas sales agreement among them) are taught by concept only and never quoted. Every legal rate, floor, adder and Schedule value the engine applies was read from the cited text and is cited to its section; a figure that could not be read from a public text is a required input with no default. Every text below was read on 2026-09-26.');
w();
const SOURCES = [
  ['Petroleum Industry Act 2021 (Act No. 6)', 'Official Gazette No. 142, Vol. 108, 27 August 2021', 's.104 and s.105 (flaring: a fine by regulation, no rate in the Act); s.110 (the Domestic Gas Delivery Obligation); s.167 (the domestic base price and the sector prices); s.168 and the Fourth Schedule (gas based industries); the Third Schedule (base price principles); the Seventh Schedule para 10(6) (gas royalty, through cashflow.ts)', 'Official Gazette No. 142, Vol. 108, 27 August 2021'],
  ['Domestic Gas Delivery Obligation Regulations 2022 (S.I. No. 74 of 2022)', 'Official Gazette No. 206, Vol. 109, Lagos, 23 November 2022; made and commenced 18 November 2022', 'r.6(1) (US$3.50 per MMBtu not delivered), r.6(2) (under a signed agreement not less than that amount), r.6(3) and (4) (the 90-day investigation, which the engine does not compute), r.4 and r.5 (supply curve and allocation, concept), r.9 (definitions)', 'Official Gazette No. 206, Vol. 109, Lagos 23 November 2022'],
  ['Commonwealth Secretariat, Gas Sales Agreement, Contract 2 in the Commonwealth Model Contract Series', '2025, licensed under Creative Commons Attribution 4.0', 'the definitions (ACQ, Adjusted ACQ, Take or Pay Quantity, BADQ, BASQ, Make-Up Aggregate, Carry Forward Aggregate, Shortfall Quantity, MaxDCQ) and Articles 12.5 to 12.8, 15.1, 15.2.6, 15.4 and 15.8', 'Contract 2 in the Commonwealth Model Contract Series'],
  ['ESMAP Report 152/93, Long-term Gas Contracts: Principles and Applications', 'January 1993, World Bank and UNDP', 'paras 6.52 (daily availability), 6.55 to 6.59 (minimum pay and make-up), 6.61 and 6.62 (carry-forward)', 'Long-term Gas Contracts: Principles and Applications | January 1993'],
  ['HMRC Oil Taxation Manual OT05435 and OT05402', 'both updated 19 December 2019, Open Government Licence', 'OT05435 (make-up in priority or after the period minimum; a time limit); OT05402 (effective swing = swing factor / take-or-pay level)', 'both updated 19 December 2019'],
  ['Energy Charter Secretariat, Putting a Price on Energy: International Pricing Mechanisms for Oil and Gas', '2007', 'section 4.5.3.3 (P = A x JCC + B, the heat-equivalence slope printed 0.172, Figure 51)', 'Putting a Price on Energy'],
  ['OIES Paper NG 175, International Gas Contracts (A. Ason)', '2022', 'the take-or-pay range, the hub-indexed CSP = 1.15 x HH + Xy, force majeure relieving the take-or-pay obligation', 'OIES Paper NG 175, International Gas Contracts (A. Ason) | 2022'],
  ['CLDP and US DOE, Understanding Natural Gas and LNG Options', 'edition current as of October 2017', 'glossary: take or pay, carry forward, downward quantity tolerance; the S-curve and the price reopener as concept', 'edition current as of October 2017'],
  ['NIST Special Publication 811', '2008 edition, Appendix B', 'the International Table Btu, 1.055 056 E+03 J (the engine holds the exact defining value)', '2008 edition, Appendix B'],
  ['EIA, Energy conversion calculators', 'web page read 2026-09-26', '1 barrel of crude oil = 5,689,000 Btu (2026 US production estimate)', '5,689,000 Btu'],
  ['NMDPRA domestic base price 2026 (and 2025), as reported', 'circular effective 1 April 2026, which could not be retrieved; reported by BusinessDay (31 March 2026) and by Advocaat Law Practice through Legal 500 (7 April 2026)', 'a required input of domesticPrice; the reported figures appear only as reported (' + 'the next paragraph' + ')', 'BusinessDay, 31 March 2026'],
  ['NUPRC, Gas Flaring, Venting and Methane Emissions (Prevention of Waste and Pollution) Regulations 2023', 'the copy on the NUPRC gazetted page is unnumbered and undated', 'not implemented; flaring is taught as concept only', 'UNNUMBERED AND UNDATED'],
];
table(['text', 'edition or date', 'what the engine reads from it', 'date read'], SOURCES.map(([t, e, u]) => [t, e, u, '2026-09-26']));
SOURCES.forEach(([t, , , frag]) => must(`FINDINGS records the edition of "${t}"`, frag.split(' | ').every((f) => FINDINGS.includes(f)), frag));
must('FINDINGS records every source as read on 2026-09-26', FINDINGS.includes('## Sources (all read 2026-09-26)'), 'read date');
w();
const dpBasis = runG('dp-power-2026').basis.domesticBasePrice;
w('THE DOMESTIC BASE PRICE IS A REQUIRED INPUT, QUOTED ONLY AS REPORTED. The Authority determines it each year (PIA s.167(1)); the regulator\'s own circular could not be retrieved, so the engine holds no default and every domesticPrice call states it. The engine\'s own basis, verbatim:');
quote(dpBasis);
must('the domesticPrice basis names the reports and says the circular was not read', /reported by BusinessDay \(31 March 2026\) and by Advocaat Law Practice through Legal 500 \(7 April 2026\); the regulator's circular was not read$/.test(dpBasis), dpBasis);
w('This course quotes the reported figures in that form only and grades none of them.');
w();
w('The engine carries its citations in its own words. The `basis.source` of one call of each kind, verbatim:');
w();
const CITES = [
  ['contractQuantities', runG('cq-power-2027').basis.source],
  ['dailyBalance', runG('daily-power-january-2027').basis.source],
  ['takeOrPay', runG('top-power').basis.source],
  ['priceSeries', runG('price-export').basis.source],
  ['energyParitySlope', runG('parity-ecs-0172').basis.source],
  ['domesticPrice', runG('dp-commercial-2026').basis.source],
  ['domesticGasObligation', runG('dgdo-power-2028').basis.source],
  ['gsaCashFlows', runG('cf-power').basis.source],
];
table(['call', 'the engine\'s basis.source, verbatim'], CITES);
must('every engine citation names an edition or a date', CITES.every(([, s]) => /(19|20)\d\d/.test(s)), CITES.map((c) => c[1]).join(' // '));
w();
w('LICENSED TEXTS. No licensed text is quoted anywhere in this course. The AIPN model gas sales agreement is a licensed text; where a lesson needs its ideas it teaches them as concepts, and every quoted clause comes from the Commonwealth model agreement, which its publisher licenses for reuse with attribution.');

/* ============================================================ SECTION 3 */

section('provisions', 'The provisions this course quotes, verbatim, with their citations', ['Professional m05', 'Professional m06', 'Expert m04 l01', 'Associate m01 l04']);
w(`Each provision below is quoted exactly from the text named in ${ref('sources')}, with whitespace collapsed; a dash the gazette prints is shown as a colon. Each is preceded by the course's plain paraphrase. A formula the model agreement prints with its own symbols is quoted as printed.`);
const GROUPS = [['PIA', 'THE PETROLEUM INDUSTRY ACT 2021'], ['DGDO', 'THE DOMESTIC GAS DELIVERY OBLIGATION REGULATIONS 2022'], ['CW', 'THE COMMONWEALTH MODEL GAS SALES AGREEMENT (2025, CC BY 4.0)'], ['ESMAP', 'ESMAP REPORT 152/93 (1993)'], ['HMRC', 'HMRC OIL TAXATION MANUAL (updated 19 December 2019)']];
GROUPS.forEach(([t, title]) => {
  w();
  w(`${title}:`);
  CONCEPTS.filter((c) => c.text === t).forEach((c) => { w(); cq(c.id); });
});
must('every concept belongs to one printed group', CONCEPTS.every((c) => GROUPS.some(([t]) => t === c.text)), 'groups');
w();
w(`${CONCEPTS.length} provisions quoted: ${list(GROUPS.map(([t]) => `${t} ${CONCEPTS.filter((c) => c.text === t).length}`))}.`);

/* ============================================================ SECTION 4 */

section('dataset', 'The Ekene agreements and what is planted in them', ['Associate m01 l03', 'Professional m02 l04', 'Professional m03 l05', 'Expert m02 l04']);
w('Every agreement in this course\'s teaching comes from two fixture files under test-data/economics/ekene-gsa, written by a stated script that reproduces them. Both are labelled SYNTHETIC in the file. The seller is the Ekene licence\'s gas, onshore; the Ekene oil field\'s own associated gas volumes are not used, so the quantities are contract quantities only.');
must('both fixture files carry their SYNTHETIC statement', [PW, EX].every((f) => typeof f.synthetic === 'string' && f.synthetic.startsWith('SYNTHETIC')), 'synthetic');
w();
w(`THE POWER PLANT AGREEMENT (fixture): ${PW.title}. Buyer: ${PW.buyer.name}, sector ${PW.buyer.sector}. DCQ ${S(PW.dcq)} MMBtu per day (${S(PW.energy.dcqMMscf)} MMscf per day at a stated ${S(PW.energy.heatingValue)} ${PW.energy.heatingValueUnit} ${PW.energy.heatingValueBasis}, reference conditions ${PW.energy.referenceConditions}); MaxDCQ ${S(PW.maxDcqPct)} percent; take-or-pay ${S(PW.topPct)} percent of the Adjusted ACQ; make-up for ${S(PW.makeUp.periodYears)} contract years, order ${PW.makeUp.order}, end of term ${PW.makeUp.endOfTerm}; no carry-forward.`);
w();
w(`Its price note (fixture), verbatim: ${PW.domesticBasePrice.note}. The fixture holds ${S(PW.domesticBasePrice.value)} US$ per MMBtu, the figure reported for 2026 (${ref('sources')}), flat in every year as a stated planning assumption.`);
w();
w(`Its seller shortfall note (fixture), verbatim: ${PW.shortfallPriceNote}.`);
w();
table(['year', 'ACQ', 'taken', 'force majeure', 'seller shortfall', 'contract price', 'take-or-pay price', 'make-up price', 'shortfall price'],
  PW.years.map((y) => [S(y.year), f6(y.acq), f6(y.taken), f6(y.forceMajeure || 0), f6(y.sellerShortfall || 0), f6(y.contractPrice), f6(y.topPrice), f6(y.makeUpPrice), y.shortfallPrice === undefined ? 'none' : f6(y.shortfallPrice)]));
w();
w(`Its Domestic Gas Delivery Obligation (fixture): year ${S(PW.dgdo.year)}, obligation ${f6(PW.dgdo.obligation)} MMBtu, delivered ${f6(PW.dgdo.delivered)}, excused because the purchaser could not accept ${f6(PW.dgdo.excused.purchaserCannotAccept)}; note, verbatim: ${PW.dgdo.note}. Royalty (fixture): terrain ${PW.royalty.terrain}, ${S(PW.royalty.inCountrySharePct)} percent of the gas utilised in-country; discount rate ${S(PW.discountRate)} to ${S(PW.baseYear)}.`);
w();
w(`THE EXPORT FEED AGREEMENT (fixture): ${EX.title}. Buyer: ${EX.buyer.name}, sector ${EX.buyer.sector}. DCQ ${S(EX.dcq)} MMBtu per day (${S(EX.energy.dcqMMscf)} MMscf per day at ${S(EX.energy.heatingValue)} ${EX.energy.heatingValueUnit}); MaxDCQ ${S(EX.maxDcqPct)} percent; take-or-pay ${S(EX.topPct)} percent; make-up for ${S(EX.makeUp.periodYears)} contract years, order ${EX.makeUp.order}, end of term ${EX.makeUp.endOfTerm}; carry-forward for ${S(EX.carryForward.periodYears)} contract years above the ${EX.carryForward.base}, at most ${S(EX.carryForward.capPct)} percent of a year's deficiency; make-up gas at ${S(EX.makeUpPricePct)} percent of the contract price.`);
w();
const EF = EX.price.formula;
w(`Its price (fixture): ${EF.type}, ${S(EF.constant)} + ${S(EF.slope)} x the ${EF.index} index averaged over ${S(EX.price.averagingMonths)} months ending ${S(EX.price.lagMonths)} month before the priced month, reset every ${S(EX.price.resetMonths)} months from ${EX.price.from}, with an S-curve at ${S(EF.sCurve.lowKink)} and ${S(EF.sCurve.highKink)} US$ per barrel and slopes ${S(EF.sCurve.lowSlope)} below and ${S(EF.sCurve.highSlope)} above, rounding ${EX.price.rounding}, reopeners reported in ${list(EX.price.reopeners)}, priced ${EX.price.from} to ${EX.price.to}. The take-or-pay price rule (fixture), verbatim: ${EX.price.topPriceRule}.`);
w();
w('Its oil index (fixture, synthetic, US$ per barrel), one row per year:');
w();
const idxByYear = {};
EX.index.forEach((m) => { const y = m.month.slice(0, 4); (idxByYear[y] = idxByYear[y] || []).push(m.values.oil); });
table(['year', 'January to December'], Object.entries(idxByYear).map(([y, vs]) => [y, vs.map(f6).join(', ')]));
must('the export index runs 144 consecutive months', EX.index.length === 144, EX.index.length);
w();
table(['year', 'ACQ', 'taken', 'force majeure'], EX.years.map((y) => [S(y.year), f6(y.acq), f6(y.taken), f6(y.forceMajeure || 0)]));
w();
w(`Royalty (fixture): terrain ${EX.royalty.terrain}, ${S(EX.royalty.inCountrySharePct)} percent utilised in-country (the gas is exported); discount rate ${S(EX.discountRate)} to ${S(EX.baseYear)}.`);
w();
const topPw = runG('top-power');
const topEx = runG('top-export');
const dayPw = runG('daily-power-january-2027');
const dgPw = runG('dgdo-power-2028');
const dayRow = (d) => dayPw.days.find((x) => x.date === d);
const PLANTED = [
  ['2027: force majeure 42,000 and a seller shortfall of 6,300 reduce the Adjusted ACQ', 'takeOrPay Adjusted ACQ', yr(topPw, 2027).adjustedAcq === 7665000 - 42000 - 6300],
  ['2028: a plant outage leaves a deficiency, paid and opened as make-up', 'takeOrPay deficiency and make-up entry', yr(topPw, 2028).deficiencyPaid > 0 && yr(topPw, 2029).makeUpAvailable === yr(topPw, 2028).deficiencyPaid],
  ['2030: taken exactly the Adjusted ACQ, so no make-up is taken', 'takeOrPay make-up threshold', yr(topPw, 2030).taken === yr(topPw, 2030).adjustedAcq && yr(topPw, 2030).makeUpTaken === 0],
  ['2031: make-up in the last year of its period, and the rest of the 2028 entry expires', 'takeOrPay expiry', yr(topPw, 2031).makeUpTaken > 0 && yr(topPw, 2031).makeUpExpired.some((x) => x.fromYear === 2028)],
  ['2032: the take-or-pay quantity exactly met', 'takeOrPay deficiency 0 at the boundary', yr(topPw, 2032).counted === yr(topPw, 2032).topQuantity && yr(topPw, 2032).deficiency === 0],
  ['2034: make-up taken, and the rest forfeited at the end of the term', 'takeOrPay end of term forfeit', yr(topPw, 2034).endOfTerm.rule === 'forfeit' && yr(topPw, 2034).endOfTerm.quantity > 0],
  ['January 2027: a zero nomination, whole-day force majeure, a seller shortfall, a nomination above MaxDCQ, maintenance and a buyer-caused gap', 'dailyBalance day by day', dayRow('2027-01-05').nominated === 0 && dayRow('2027-01-12').forceMajeure === 21000 && dayRow('2027-01-20').sellerShortfall === 6300 && dayRow('2027-01-25').properlyNominated < dayRow('2027-01-25').nominated && dayRow('2027-01-28').maintenance > 0 && dayRow('2027-01-30').sellerShortfall === 0],
  ['2028 obligation: part excused because the purchaser could not accept, the rest penalised', 'domesticGasObligation', dgPw.excusedApplied > 0 && dgPw.penalty > 0],
  ['export 2029: a train outage whose deficiency draws a carry-forward credit at the 50 percent cap from the 2027 and 2028 surpluses', 'takeOrPay carry-forward', yr(topEx, 2029).carryForwardApplied === yr(topEx, 2029).deficiency * 0.5 && yr(topEx, 2029).carryForwardDrawn.map((x) => x.fromYear).join() === '2027,2028'],
  ['export 2030: buyer force majeure of 1,260,000', 'takeOrPay force majeure', yr(topEx, 2030).forceMajeure === 1260000],
  ['export: carry-forward expiring unused in 2031, 2034 and 2036', 'takeOrPay carry-forward expiry', [2031, 2034, 2036].every((y) => yr(topEx, y).carryForwardExpired.length > 0)],
  ['export 2036: the end of term refunds 2035 make-up', 'takeOrPay end of term refund', yr(topEx, 2036).endOfTerm.rule === 'refund' && yr(topEx, 2036).refund > 0 && yr(topEx, 2036).endOfTerm.entries.every((e) => e.fromYear === 2035)],
];
table(['planted situation (fixture README)', 'found by'], PLANTED.map(([s, by]) => [s, by]));
PLANTED.forEach(([s, , ok]) => must(`planted: ${s}`, ok, s));
w();
w(`All ${PLANTED.length} planted situations are found by the engine behaviour named beside each (checked when this digest is built). The ledgers themselves are printed in ${ref('ledger')} and ${ref('carryforward')}.`);

/* ============================================================ SECTION 5 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m03', 'Associate m04', 'Associate m05', 'Associate m06', 'Professional m01', 'Professional m03', 'Professional m04', 'Professional m05', 'Professional m06', 'Expert m02', 'Expert m06']);
w('A refusal is an object with `error` and `field`. The message starts with the name of the field it refuses and states the exact condition that failed: "<field> must <condition>; got <value>", the value as the engine prints it (a string in quotes, an absent value as nothing), or, for an unknown key, "<field> is not an accepted key; the accepted keys ... are ...". Each row below is a stated bad input from the golden file handed to the engine; the message is the engine\'s, verbatim. A result returned with a reason (a deficiency with no make-up right, a price held at its floor, a penalty excused) is a result. It is no refusal.');
w();
const REF = GOLD.cases.filter(isRefusalCase);
const REFUSED = REF.map((c) => {
  const r = refusal(`${c.fn} on the golden input ${c.id}`, G[c.fn](clone(c.args)), c.expected.field);
  must(`the engine's message is the golden message: ${c.id}`, r && r.error === c.expected.message, r && r.error);
  return [`\`${c.fn}\``, c.id, `\`${c.expected.field}\``, r && r.error];
});
table(['function', 'golden case', 'field', 'the engine\'s message, verbatim'], REFUSED);
const byFn = {};
REF.forEach((c) => { byFn[c.fn] = (byFn[c.fn] || 0) + 1; });
w();
w(`${REF.length} refusals across ${Object.keys(byFn).length} functions: ${list(Object.entries(byFn).map(([k, v]) => `${k} ${v}`))}.`);
must('every exported function has at least one refusal tabled', EXPORTS.every(([n]) => byFn[n] > 0), JSON.stringify(byFn));
must('no refusal message carries an em or en dash', REFUSED.every((r) => !/[–—]/.test(r[3])), 'dash');
must('eighty-four refusal cases in the golden file', REF.length === 84, REF.length);
w();
w('Four rules the table shows:');
w('- A contract term with no default is refused when it is missing, and the message says so: the make-up terms, the recovery order, the royalty terrain, the take-or-pay price, a shortfall price when a seller shortfall is stated, and the domestic base price.');
w('- An input key a function does not read is refused at whatever level it sits (a top-level option, a year, a day, a formula, an S-curve, a schedule), with the path to the key and the full list of accepted keys; a key that is an index name is checked against the indices the series carries.');
w('- A quantity that cannot be true is refused before anything is computed: gas taken above the gas made available, force majeure and maintenance above the DCQ, reductions above the ACQ, contract years or months that are not consecutive.');
w('- Every figure inside a message is the shortest round-trip decimal of the value it was given.');

/* ============================================================ SECTION 6 */

section('graded', 'What is graded, where the practicals run, and what is never graded', ['Associate m01 l05', 'Expert m06']);
w('EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED INPUTS. A capstone field, a question key and a panel figure are each computed by a function in the table of ' + ref('computes') + ' on contract terms written down in advance. Nothing in the engine samples or searches, so the same terms give the same number on any machine, and there is exactly one right answer.');
w();
w('THE PRACTICALS RUN IN THE COURSE\'S OWN CALCULATOR PANELS. This is an engine course with no Suite app. Each tier has a calculator panel that calls this same vendored engine: the quantity calculator (Associate), the ledger calculator (Professional) and the contract calculator (Expert). A learner types or pastes their own contract terms; the panel prints what the engine returns, every refusal in the engine\'s own words, and the reasons beside each figure.');
w();
w(`A PRICED LEDGER IN A PANEL. Where a contract prices its gas by a formula, the panel prices every month with priceSeries and then copies each year's contract price and take-or-pay price from that year's annual row, by the basis the contract states: the annual average (the model agreement's Article 15.2.6 Alternative 1) or the last month's price (Alternative 2). The copy is a lookup; the engine computes every figure on both sides of it.`);
w();
w('WHAT A CAPSTONE STATES. Each capstone runs its own synthetic agreement, which this digest does not print, and states every term a figure depends on: the quantities, the day counts, the take-or-pay percentage, the make-up period, the recovery order, the end-of-term rule, the carry-forward terms, the price formula with its averaging, lag, reset and rounding, the price basis of the ledger, the royalty terrain and share, the discount rate and base year. Each graded figure is quoted to six decimals as the panel prints it.');
w();
w(`WHAT IS NEVER GRADED. No graded figure depends on a reading the engine states (${ref('readings')}): every capstone field is the same number under each reading the engine takes and under the alternative it names. No graded figure uses the domestic base price, which is quoted only as reported (${ref('sources')}).`);
w();
w('WHAT A COMPUTED FIGURE DOES NOT SAY. A deficiency payment is what the stated clauses produce on stated takes; it is not a forecast of what a buyer will pay. An oil-indexed price follows the stated formula on the stated index series, which in this course is synthetic. An NPV depends on the discount rate and base year stated. Each figure is quoted with its terms for that reason.');

/* ============================================================ SECTION 7 */

section('energy', 'Volume to energy: gross and net heating value, the imperial and metric routes, reference conditions', ['Associate m02']);
const E0 = runG('energy-power-dcq');
w(`THE UNITS, in the engine's basis: ${E0.basis.units}.`);
must('the units basis names the International Table Btu and the exact cubic foot', /1055\.05585262 MJ/.test(E0.basis.units) && /0\.028316846592 m3 exactly/.test(E0.basis.units), E0.basis.units);
w();
const ENERGY = ['energy-power-dcq', 'energy-export-dcq', 'energy-mscf', 'energy-metric', 'energy-metric-net', 'energy-mixed-sm3-btu', 'energy-mixed-scf-mj', 'energy-zero-quantity'];
table(['golden case', 'quantity', 'unit', 'heating value', 'unit', 'basis', 'MMBtu (engine)', 'GJ (engine)'], ENERGY.map((id) => {
  const a = argsOf(id); const r = runG(id);
  return [id, f6(a.quantity), a.quantityUnit, f6(a.heatingValue), a.heatingValueUnit, a.heatingValueBasis, f6(r.mmbtu), f6(r.gj)];
}));
w();
w('The route each pair takes, and the heating value wording, in the engine\'s basis (verbatim):');
w();
table(['golden case', 'reference conditions (golden input)', 'basis.rule', 'basis.heatingValue'], ENERGY.map((id) => { const r = runG(id); return [id, argsOf(id).referenceConditions, r.basis.rule, r.basis.heatingValue]; }));
const eNet = runG('energy-metric-net');
const eGross = runG('energy-metric');
const nA = argsOf('energy-metric-net');
const gA = argsOf('energy-metric');
const eProbe = success('toEnergy on the net case\'s numbers stated as gross', G.toEnergy({ ...nA, heatingValueBasis: 'gross' }));
must('the same numbers stated gross and net give the same MMBtu (the arithmetic is the same; the basis is carried)', eProbe.mmbtu === eNet.mmbtu && eProbe.basis.heatingValue !== eNet.basis.heatingValue, `${eProbe.mmbtu} ${eNet.mmbtu}`);
must('the net case states a lower heating value than the gross case on the same volume', nA.quantity === gA.quantity && nA.heatingValue < gA.heatingValue && eNet.mmbtu < eGross.mmbtu, `${nA.heatingValue} ${gA.heatingValue}`);
w();
w(`GROSS AND NET. The engine does the same arithmetic on a gross (higher) and a net (lower) heating value and carries the basis through. energy-metric states ${f6(gA.heatingValue)} MJ/Sm3 gross and energy-metric-net ${f6(nA.heatingValue)} MJ/Sm3 net for the same ${f6(gA.quantity)} MMSm3, and return ${f6(eGross.mmbtu)} and ${f6(eNet.mmbtu)} MMBtu. The net case's numbers stated as gross (stated probe) return ${f6(eProbe.mmbtu)} MMBtu, labelled gross: the label changes and the arithmetic does not. A contract names which heating value it prices, and the course quotes the basis beside every energy figure.`);
w();
w('A MIXED PAIR (a volume in standard cubic metres with a heating value in Btu per standard cubic foot, or the reverse) converts the volume by the exact geometric factor and assumes one set of reference conditions for both, which the caller states and the engine echoes back. A contract that states its volume and its heating value at different reference conditions needs a conversion the engine does not make.');

/* ============================================================ SECTION 8 */

section('quantities', 'Contract quantities: DCQ, ACQ, day counts, MaxDCQ, swing and effective swing', ['Associate m03']);
const CQ = ['cq-power-2027', 'cq-power-2028-leap', 'cq-year-2100-not-leap', 'cq-year-2000-leap', 'cq-period-full-year', 'cq-period-first-contract-year', 'cq-days-stated', 'cq-top-zero-without-swing', 'cq-hmrc-ot05402-effective-swing'];
const cq0 = runG('cq-power-2027');
w(`THE RULE, in the engine's basis: ${cq0.basis.rule}.`);
w();
table(['golden case', 'DCQ', 'day count (engine basis)', 'ACQ', 'MaxDCQ', 'swing factor', 'take-or-pay quantity', 'effective swing'], CQ.map((id) => {
  const r = runG(id);
  return [id, f6(r.dcq), r.basis.dayCount, f6(r.acq), f6(r.maxDcq), f6(r.swingFactor), f6(r.topQuantity), f6(r.effectiveSwing)];
}));
must('2028 counts 366 days, 2100 counts 365 and 2000 counts 366', runG('cq-power-2028-leap').days === 366 && runG('cq-year-2100-not-leap').days === 365 && runG('cq-year-2000-leap').days === 366, 'leap');
must('a period from 1 January to the next 1 January counts 365 days in 2027', runG('cq-period-full-year').days === 365, runG('cq-period-full-year').days);
w();
w(`A DAY COUNT IS A STATED TERM. The engine takes a stated number of days, a calendar year (${S(runG('cq-year-2100-not-leap').days)} days, or ${S(runG('cq-year-2000-leap').days)} in a leap year; 2100 is not a leap year and 2000 is), or a period whose end date is excluded, as a contract year that finishes on the following first of January. A call that states more than one day count, or none, is refused.`);
w();
const hm = runG('cq-hmrc-ot05402-effective-swing');
const hmA = argsOf('cq-hmrc-ot05402-effective-swing');
const HM_PRINTED = GC['cq-hmrc-ot05402-effective-swing'].published;
w(`EFFECTIVE SWING (golden input ${hmA.maxDcqPct} and ${hmA.topPct}): MaxDCQ percent / take-or-pay percent = ${f6(hm.effectiveSwing)} (engine). ${HM_PRINTED.source} prints the same division as ${S(HM_PRINTED.printed.effectiveSwing)}, and the golden file records its rule, verbatim: "${HM_PRINTED.rule}". The manual's figure is the engine's cut after two decimals (derived: ${f6(Math.floor(hm.effectiveSwing * 100) / 100)}). The course quotes the engine's figure and names the manual's printed one as the manual's.`);
must('the manual truncates: floor(100 x swing) / 100 is the printed figure', Math.floor(hm.effectiveSwing * 100) / 100 === HM_PRINTED.printed.effectiveSwing && hm.effectiveSwing !== HM_PRINTED.printed.effectiveSwing, hm.effectiveSwing);
w();
const cqz = runG('cq-top-zero-without-swing');
w(`A take-or-pay percentage of ${S(argsOf('cq-top-zero-without-swing').topPct)} is accepted when no MaxDCQ is stated (golden input cq-top-zero-without-swing: take-or-pay quantity ${f6(cqz.topQuantity)}, effective swing ${f6(cqz.effectiveSwing)}); with a MaxDCQ stated the effective swing would divide by it, so that call is refused (${ref('refusals')}).`);
w();
w(`NOMINATIONS. A buyer nominates a daily quantity against the DCQ; the part of a nomination above MaxDCQ is not properly nominated. How the engine treats each day is in ${ref('daily')}.`);

/* ============================================================ SECTION 9 */

section('daily', 'The daily balance: properly nominated quantity, seller shortfall, force majeure and maintenance, buyer shortfall', ['Associate m04', 'Expert m03 l01']);
w(`THE RULE, in the engine's basis: ${dayPw.basis.rule}.`);
w();
w(`THE IDENTITY, in the engine's basis: ${dayPw.basis.identity}.`);
w();
w(`THE POWER PLANT'S JANUARY 2027 (golden input daily-power-january-2027, the fixture's days): DCQ ${S(dayPw.dcq)}, MaxDCQ ${f6(dayPw.maxDcq)}, delivery tolerance ${f6(dayPw.deliveryTolerance)}.`);
w();
table(['day', 'nominated', 'properly nominated', 'available', 'taken', 'force majeure', 'maintenance', 'seller shortfall', 'adjusted DCQ', 'buyer shortfall', 'over-take'],
  dayPw.days.map((d) => [d.date, f6(d.nominated), f6(d.properlyNominated), f6(d.available), f6(d.taken), f6(d.forceMajeure), f6(d.maintenance), f6(d.sellerShortfall), f6(d.adjustedDcq), f6(d.buyerShortfall), f6(d.overTake)]));
w();
const an = dayPw.annual;
table(['January 2027 totals (engine)', 'value'], [['days', S(an.days)], ['ACQ for the days', f6(an.acq)], ['maintenance', f6(an.maintenance)], ['force majeure', f6(an.forceMajeure)], ['seller shortfall', f6(an.sellerShortfall)], ['Adjusted ACQ for the days', f6(an.adjustedAcq)], ['taken', f6(an.taken)], ['buyer shortfall', f6(an.buyerShortfall)], ['over-take', f6(an.overTake)]]);
const lhs = an.buyerShortfall - an.overTake;
const rhs = an.adjustedAcq - an.taken;
must('the identity closes exactly on January 2027', lhs === rhs, `${lhs} ${rhs}`);
w();
w(`The identity on these days (derived): buyer shortfall less over-take = ${f6(lhs)}; Adjusted ACQ less taken = ${f6(rhs)}; the two are equal (checked exactly).`);
w();
w('The engine\'s reasons for the month, verbatim:');
reasons(dayPw.days.flatMap((d) => d.reasons));
w();
const DAYS = ['daily-tolerance-covers-the-gap', 'daily-tolerance-one-short', 'daily-over-nomination-failed', 'daily-fm-part-day', 'daily-fm-whole-day-with-nomination', 'daily-available-not-taken', 'daily-no-maxdcq', 'daily-buyer-caused'];
w('SINGLE DAYS (golden inputs), each stated to show one rule:');
w();
table(['golden case', 'DCQ', 'MaxDCQ percent', 'tolerance', 'nominated', 'properly nominated', 'available', 'taken', 'force majeure', 'maintenance', 'buyer-caused', 'seller shortfall', 'adjusted DCQ', 'buyer shortfall'], DAYS.map((id) => {
  const a = argsOf(id); const r = runG(id); const d = r.days[0]; const ad = a.days[0];
  return [id, f6(a.dcq), a.maxDcqPct === undefined ? 'none' : S(a.maxDcqPct), f6(a.deliveryTolerance || 0), f6(ad.nominated), f6(d.properlyNominated), f6(ad.available), f6(ad.taken), f6(d.forceMajeure), f6(d.maintenance), S(ad.buyerCaused === true), f6(d.sellerShortfall), f6(d.adjustedDcq), f6(d.buyerShortfall)];
}));
w();
DAYS.forEach((id) => { const r = runG(id); w(`${id}, the engine's reasons, verbatim:`); if (r.days[0].reasons.length) reasons(r.days[0].reasons); else w('(no reason: nothing is owed either way)'); });
const ant = runG('daily-available-not-taken').days[0];
must('gas made available and not taken is no seller shortfall', ant.sellerShortfall === 0 && ant.buyerShortfall > 0, `${ant.sellerShortfall} ${ant.buyerShortfall}`);
w();
w(`THE READING THIS SECTION RESTS ON. The engine measures a seller shortfall against the quantity the seller made AVAILABLE, so on daily-available-not-taken (${f6(ant.available)} made available, ${f6(ant.taken)} taken) the seller shortfall is ${f6(ant.sellerShortfall)} and the buyer shortfall ${f6(ant.buyerShortfall)}. ${refCap('readings')} quotes the reading and the model formula it departs from.`);

/* ============================================================ SECTION 10 */

section('topyear', 'Take-or-pay in one contract year: the Adjusted ACQ, the take-or-pay quantity, the deficiency and its payment, damages', ['Associate m05', 'Associate m06']);
const t1 = runG('top-single-year');
w(`THE RULE, in the engine's basis: ${t1.basis.rule}.`);
w();
w('Money in a contract year, as the engine builds it: counted x contract price + make-up taken x make-up price + deficiency payment - seller shortfall x shortfall price - refund = net to the seller. Each term is a return value in the rows below.');
w();
const ONE = ['top-single-year', 'top-exactly-met', 'top-one-unit-short', 'top-zero-take-year', 'top-force-majeure-and-shortfall', 'top-fm-whole-year'];
const oneRows = [];
ONE.forEach((id) => {
  const r = runG(id);
  r.years.forEach((y, i) => oneRows.push([id, S(y.year), f6(y.acq), f6(y.maintenance + y.forceMajeure + y.sellerShortfall + y.permittedReduction), f6(y.adjustedAcq), f6(y.topQuantity), f6(y.taken), f6(y.counted), f6(y.deficiency), f6(argsOf(id).years[i].contractPrice), f6(argsOf(id).years[i].topPrice), f6(y.deficiencyPayment), f6(y.shortfallPayment), f6(y.netToSeller)]));
});
table(['golden case', 'year', 'ACQ', 'reductions', 'Adjusted ACQ', 'take-or-pay quantity', 'taken', 'counted', 'deficiency', 'contract price (golden input)', 'take-or-pay price (golden input)', 'deficiency payment', 'shortfall damages', 'net to seller'], oneRows);
w();
w('THE POWER PLANT\'S YEARS ALONE. The fixture\'s 2027 and 2032, each run as a one-year case with the fixture\'s take-or-pay percentage and make-up terms (each is then the last contract year of its own case, so a deficiency would open no make-up right):');
w();
const PW_ALONE = [2027, 2032].map((yy) => ({ yy, r: success(`takeOrPay on the power plant's ${yy} alone`, G.takeOrPay({ years: [clone(PW.years.find((x) => x.year === yy))], topPct: PW.topPct, makeUp: clone(PW.makeUp) })) }));
table(['power plant year alone (fixture)', 'ACQ', 'reductions', 'Adjusted ACQ', 'take-or-pay quantity', 'taken', 'deficiency', 'contract price (fixture)', 'take-or-pay price (fixture)', 'deficiency payment', 'shortfall damages', 'net to seller'], PW_ALONE.map(({ yy, r }) => { const y = r.years[0]; const inp = PW.years.find((x) => x.year === yy); return [S(yy), f6(y.acq), f6(y.maintenance + y.forceMajeure + y.sellerShortfall + y.permittedReduction), f6(y.adjustedAcq), f6(y.topQuantity), f6(y.taken), f6(y.deficiency), f6(inp.contractPrice), f6(inp.topPrice), f6(y.deficiencyPayment), f6(y.shortfallPayment), f6(y.netToSeller)]; }));
PW_ALONE.forEach(({ yy, r }) => { w(`${yy} alone, the engine's reasons, verbatim:`); if (r.years[0].reasons.length) reasons(r.years[0].reasons); else w('(no reason: nothing to reconcile)'); });
must('the power plant 2032 alone meets its take-or-pay quantity exactly', PW_ALONE[1].r.years[0].deficiency === 0 && PW_ALONE[1].r.years[0].counted === PW_ALONE[1].r.years[0].topQuantity, 'pw 2032');
must('each power plant year alone equals the same year of the eight-year ledger in quantities', PW_ALONE.every(({ yy, r }) => r.years[0].topQuantity === yr(topPw, yy).topQuantity && r.years[0].deficiency === yr(topPw, yy).deficiency), 'alone vs ledger');
w();
ONE.forEach((id) => { const r = runG(id); w(`${id}, the engine's reasons, verbatim:`); const rs = r.years.flatMap((y) => y.reasons); if (rs.length) reasons(rs); else w('(no reason: nothing to reconcile)'); });
const em = runG('top-exactly-met');
const ous = runG('top-one-unit-short');
must('exactly met: no deficiency; one unit short: a deficiency of 1', em.years[0].deficiency === 0 && ous.years[0].deficiency === 1, `${em.years[0].deficiency} ${ous.years[0].deficiency}`);
w();
w(`WHEN THE TAKE-OR-PAY QUANTITY IS EXACTLY MET (top-exactly-met, 2027: taken ${f6(em.years[0].taken)} against the take-or-pay quantity ${f6(em.years[0].topQuantity)}) there is no deficiency; one unit short (top-one-unit-short) leaves a deficiency of ${f6(ous.years[0].deficiency)}. The deficiency is the take-or-pay quantity less the quantity counted when that is above 0.`);
w();
const fs0 = runG('top-force-majeure-and-shortfall').years[0];
w(`SELLER SHORTFALL DAMAGES (top-force-majeure-and-shortfall): the seller shortfall ${f6(fs0.sellerShortfall)} reduces the Adjusted ACQ and is paid to the buyer at the stated shortfall price, ${f6(fs0.shortfallPayment)} in all, which the net to the seller subtracts. The rate is a stated contract term with no default (${ref('refusals')}).`);
w();
w(`The multi-year ledger with make-up, the recovery order and expiry is in ${ref('ledger')}.`);

/* ============================================================ SECTION 11 */

section('ledger', 'The take-or-pay ledger: make-up, the recovery order, first in first out, expiry and the end of the term', ['Professional m01', 'Professional m02', 'Expert m04 l02']);
w(`THE ORDER, in the engine's basis (top-power): ${topPw.basis.order}.`);
w();
w(`MAKE-UP, in the engine's basis (top-power): ${topPw.basis.makeUp}.`);
w();
const ledgerTable = (r) => table(['year', 'Adjusted ACQ', 'take-or-pay quantity', 'taken', 'make-up available', 'make-up taken', 'counted', 'deficiency', 'deficiency payment', 'make-up expired', 'make-up outstanding', 'net to seller'],
  r.years.map((y) => [S(y.year), f6(y.adjustedAcq), f6(y.topQuantity), f6(y.taken), f6(y.makeUpAvailable), f6(y.makeUpTaken), f6(y.counted), f6(y.deficiency), f6(y.deficiencyPayment), f6(sum(y.makeUpExpired.map((x) => x.quantity))), f6(y.makeUpOutstanding), f6(y.netToSeller)]));
w('THE POWER PLANT LEDGER, 2027 to 2034 (golden input top-power, the fixture\'s years):');
w();
ledgerTable(topPw);
w();
table(['totals (engine)', 'value'], Object.entries(topPw.totals).map(([k, v]) => [k, f6(v)]));
w();
w('The engine\'s reasons, verbatim:');
reasons(topPw.years.flatMap((y) => y.reasons));
w();
const ORD = ['top-order-after-adjusted-acq', 'top-order-after-top-quantity', 'top-order-first', 'top-order-first-creates-deficiency'];
w('THE RECOVERY ORDER IS A STATED TERM (golden inputs; the same years under each order):');
w();
table(['golden case', 'order', 'year', 'Adjusted ACQ', 'take-or-pay quantity', 'taken', 'make-up taken', 'counted', 'deficiency'], ORD.flatMap((id) => { const r = runG(id); return r.years.map((y) => [id, argsOf(id).makeUp.order, S(y.year), f6(y.adjustedAcq), f6(y.topQuantity), f6(y.taken), f6(y.makeUpTaken), f6(y.counted), f6(y.deficiency)]); }));
w();
ORD.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).years.flatMap((y) => y.reasons)); });
const ofd = runG('top-order-first-creates-deficiency');
must('make-up taken first can leave a new deficiency in the same year', ofd.years.some((y) => y.makeUpTaken > 0 && y.deficiency > 0), 'first');
w();
const EXP = ['top-fifo-two-deficiencies', 'top-makeup-on-last-day-of-period', 'top-makeup-one-year-late', 'top-makeup-period-one', 'top-makeup-period-zero', 'top-makeup-price', 'top-end-of-term-forfeit', 'top-end-of-term-refund'];
w('FIRST IN FIRST OUT, EXPIRY AND THE END OF THE TERM (golden inputs):');
w();
table(['golden case', 'period (years)', 'order', 'end of term', 'year', 'deficiency paid', 'make-up taken', 'drawn from', 'expired', 'outstanding', 'refund'], EXP.flatMap((id) => {
  const a = argsOf(id); const r = runG(id);
  return r.years.map((y) => [id, S(a.makeUp.periodYears), a.makeUp.order, a.makeUp.endOfTerm, S(y.year), f6(y.deficiencyPaid), f6(y.makeUpTaken), list(y.makeUpDrawn.map((x) => `${f6(x.quantity)} from ${x.fromYear}`)), list(y.makeUpExpired.map((x) => `${f6(x.quantity)} from ${x.fromYear}`)), f6(y.makeUpOutstanding), f6(y.refund)]);
}));
w();
EXP.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).years.flatMap((y) => y.reasons)); });
const lastDay = runG('top-makeup-on-last-day-of-period');
const late = runG('top-makeup-one-year-late');
must('make-up is usable in the last year of its period and not the year after', lastDay.years.some((y) => y.makeUpTaken > 0 && y.makeUpExpired.length > 0) && late.years.every((y) => y.year !== 2030 || y.makeUpAvailable === 0), 'expiry');
w();
w('A make-up period of N contract years after a deficiency year y runs to the end of year y + N inclusive: make-up is usable in that last year and the rest expires at its end, and none is available in year y + N + 1. A deficiency in the last contract year opens no make-up right, and the end-of-term rule (forfeit, or refund at the last year\'s take-or-pay price) applies to the earlier entries still open.');

/* ============================================================ SECTION 12 */

section('carryforward', 'Carry-forward, its cap, base and expiry, seller shortfall damages and the export feed ledger', ['Professional m03', 'Expert m04 l02']);
w(`CARRY-FORWARD, in the engine's basis (top-export): ${topEx.basis.carryForward}.`);
w();
w(`MAKE-UP, in the engine's basis (top-export): ${topEx.basis.makeUp}.`);
w();
const psEx = runG('price-export');
const exArgs = argsOf('top-export');
must('the golden export ledger prices each year at the engine\'s annual average price', exArgs.years.every((y) => { const a = psEx.annual.find((x) => x.year === y.year); return a && Math.abs(a.averagePrice - y.contractPrice) <= 1e-12 * a.averagePrice && y.topPrice === y.contractPrice; }), 'prices');
w(`THE EXPORT FEED LEDGER, 2027 to 2036 (golden input top-export). Its contract price and take-or-pay price in each year are the annual average of the monthly prices priceSeries returns on the fixture (${ref('prices')}); its make-up price is ${S(EX.makeUpPricePct)} percent of that price (fixture):`);
w();
table(['year', 'contract and take-or-pay price (golden input)', 'annual average price (engine)', 'make-up price (golden input)'], exArgs.years.map((y) => [S(y.year), f6(y.contractPrice), f6(psEx.annual.find((x) => x.year === y.year).averagePrice), f6(y.makeUpPrice)]));
w();
table(['year', 'take-or-pay quantity', 'taken', 'make-up taken', 'counted', 'deficiency', 'carry-forward available', 'carry-forward applied', 'deficiency paid', 'deficiency payment', 'surplus', 'carry-forward expired', 'carry-forward outstanding', 'refund', 'net to seller'],
  topEx.years.map((y) => [S(y.year), f6(y.topQuantity), f6(y.taken), f6(y.makeUpTaken), f6(y.counted), f6(y.deficiency), f6(y.carryForwardAvailable), f6(y.carryForwardApplied), f6(y.deficiencyPaid), f6(y.deficiencyPayment), f6(y.surplus), f6(sum(y.carryForwardExpired.map((x) => x.quantity))), f6(y.carryForwardOutstanding), f6(y.refund), f6(y.netToSeller)]));
w();
table(['totals (engine)', 'value'], Object.entries(topEx.totals).map(([k, v]) => [k, f6(v)]));
w();
w('The engine\'s reasons, verbatim:');
reasons(topEx.years.flatMap((y) => y.reasons));
w();
const CFC = ['top-carry-forward-adjusted-acq', 'top-carry-forward-top-quantity', 'top-carry-forward-capped', 'top-carry-forward-expires', 'top-carry-forward-off-by-default'];
w('CARRY-FORWARD TERMS (golden inputs):');
w();
table(['golden case', 'carry-forward (golden input)', 'year', 'counted', 'surplus', 'deficiency', 'credit applied', 'deficiency paid', 'expired', 'outstanding'], CFC.flatMap((id) => {
  const a = argsOf(id); const r = runG(id);
  const cfText = a.carryForward ? `${a.carryForward.periodYears} years above the ${a.carryForward.base}, cap ${a.carryForward.capPct} percent` : 'not stated';
  return r.years.map((y) => [id, cfText, S(y.year), f6(y.counted), f6(y.surplus), f6(y.deficiency), f6(y.carryForwardApplied), f6(y.deficiencyPaid), f6(sum(y.carryForwardExpired.map((x) => x.quantity))), f6(y.carryForwardOutstanding)]);
}));
w();
CFC.forEach((id) => { const rs = runG(id).years.flatMap((y) => y.reasons); w(`${id}, the engine's reasons, verbatim:`); if (rs.length) reasons(rs); else w('(no reason)'); });
w();
w(`${runG('top-carry-forward-off-by-default').basis.carryForward[0].toUpperCase()}${runG('top-carry-forward-off-by-default').basis.carryForward.slice(1)}: that is the engine's basis, verbatim, when a contract states no carry-forward right.`);
must('carry-forward is off unless stated', runG('top-carry-forward-off-by-default').basis.carryForward === 'off (no carry-forward right stated)', runG('top-carry-forward-off-by-default').basis.carryForward);

/* ============================================================ SECTION 13 */

section('prices', 'Price formulas: fixed, escalated, oil-indexed, hub-indexed and basket, with averaging, lag, reset, floor, ceiling and rounding', ['Professional m04', 'Expert m05 l02']);
w(`THE AVERAGING, in the engine's basis (price-export): ${psEx.basis.averaging}.`);
w();
w(`THE ANNUAL PRICES, in the engine's basis: ${psEx.basis.annual}.`);
w();
w(`THE ROUNDING, in the engine's basis (price-export): ${psEx.basis.rounding}.`);
w();
w('THE EXPORT FEED PRICE (golden input price-export, the fixture): the first eighteen priced months and every annual row.');
w();
table(['month', 'priced as the block of', 'window', 'oil average', 'segment', 'unrounded', 'price', 'reopener'], psEx.months.slice(0, 18).map((m) => [m.month, m.priceMonth, m.window.join(' to '), f6(m.indexAverages.oil), nn(m.segment), f6(m.unroundedPrice), f6(m.price), S(m.reopener)]));
w();
table(['year', 'months priced', 'annual average price', 'last month price'], psEx.annual.map((a) => [S(a.year), S(a.months), f6(a.averagePrice), f6(a.lastMonthPrice)]));
w();
w('The reopeners the engine reports, verbatim:');
reasons(psEx.reopeners.map((r) => r.note));
w();
const PR = ['price-fixed', 'price-escalated', 'price-ecs-plain-linear', 'price-oil-floor-ceiling', 'price-s-curve-kinks', 'price-oies-hub-csp', 'price-avg6-lag1-reset3', 'price-avg3-lag0-reset1', 'price-avg1-lag3', 'price-reset12-annual', 'price-cw-basket', 'price-cw-basket-index-floors', 'price-round-model-4dp', 'price-export-unrounded'];
const fdesc = (f) => {
  if (f.type === 'fixed') return `fixed ${S(f.price)}`;
  if (f.type === 'escalated') return `escalated from ${S(f.basePrice)} at ${f.baseMonth} by ${S(f.ratePctPerYear)} percent a year`;
  if (f.type === 'oil-indexed') return `oil-indexed ${S(f.constant)} + ${S(f.slope)} x ${f.index}${f.sCurve ? `, S-curve kinks ${S(f.sCurve.lowKink)} and ${S(f.sCurve.highKink)}, slopes ${S(f.sCurve.lowSlope)} and ${S(f.sCurve.highSlope)}` : ''}${f.floor !== undefined ? `, floor ${S(f.floor)}` : ''}${f.ceiling !== undefined ? `, ceiling ${S(f.ceiling)}` : ''}`;
  if (f.type === 'hub-indexed') return `hub-indexed ${S(f.multiplier)} x ${f.index} + ${S(f.adder)}${f.floor !== undefined ? `, floor ${S(f.floor)}` : ''}${f.ceiling !== undefined ? `, ceiling ${S(f.ceiling)}` : ''}`;
  return `basket ${S(f.basePrice)} x sum of weight x index / base: weights ${JSON.stringify(f.weights)}, base values ${JSON.stringify(f.baseValues)}${f.indexFloors ? `, index floors ${JSON.stringify(f.indexFloors)}` : ''}${f.indexCeilings ? `, index ceilings ${JSON.stringify(f.indexCeilings)}` : ''}`;
};
w('EVERY FORMULA TYPE AND EVERY TIMING TERM (golden inputs). Each row is one priced month; the formula and terms are the golden input\'s:');
w();
PR.forEach((id) => {
  const a = argsOf(id); const r = runG(id);
  w(`${id}: ${fdesc(a.formula)}; averaging ${S(a.averagingMonths ?? 1)} month(s), lag ${S(a.lagMonths ?? 0)}, reset every ${S(a.resetMonths ?? 1)}, rounding ${a.rounding ?? 'none'}; priced ${a.from} to ${a.to}. The index (golden input): ${a.months.map((m) => `${m.month} ${Object.entries(m.values).map(([k, v]) => `${k} ${S(v)}`).join(' ')}`).slice(0, 14).join('; ')}${a.months.length > 14 ? `; and ${a.months.length - 14} more months` : ''}.`);
  w();
  table(['month', 'window', 'index average(s)', 'held index(es)', 'segment', 'clamped', 'unrounded', 'price'], r.months.slice(0, 14).map((m) => [m.month, m.window ? m.window.join(' to ') : 'none', m.indexAverages ? Object.entries(m.indexAverages).map(([k, v]) => `${k} ${f6(v)}`).join(', ') : 'none', m.heldIndices ? Object.entries(m.heldIndices).map(([k, v]) => `${k} ${f6(v)}`).join(', ') : 'none', nn(m.segment), nn(m.clamped), f6(m.unroundedPrice), f6(m.price)]));
  if (r.months.length > 14) w(`(${r.months.length - 14} more months; the annual rows: ${r.annual.map((x) => `${x.year} average ${f6(x.averagePrice)}, last month ${f6(x.lastMonthPrice)}`).join('; ')})`);
  w();
});
const rd = runG('price-round-model-4dp');
must('the four-decimal rule on the golden rounding case', ['2026-03', '2026-04', '2026-05', '2026-07'].map((m) => rd.months.find((x) => x.month === m).price).join() === '11.2346,11.2345,100.0001,11.2343', rd.months.map((m) => m.price).join());
const rdIn = (m) => S(argsOf('price-round-model-4dp').months.find((x) => x.month === m).values.x);
const rdOut = (m) => f6(rd.months.find((x) => x.month === m).price);
w(`THE FOUR-DECIMAL RULE on price-round-model-4dp, in the model agreement's words "five (5) or more" rounds the fourth decimal up and "four (4) or less" leaves it (${ref('provisions')}): ${rdIn('2026-03')} prices ${rdOut('2026-03')} and ${rdIn('2026-05')} prices ${rdOut('2026-05')}; ${rdIn('2026-04')} prices ${rdOut('2026-04')}; and the price is computed in full before the rule reads its fifth decimal, so ${rdIn('2026-07')} prices ${rdOut('2026-07')}. Every price here is the engine's on the golden inputs.`);
w();
const ecsPlain = runG('price-ecs-plain-linear');
const floorCeil = runG('price-oil-floor-ceiling');
w(`FLOOR AND CEILING. On price-oil-floor-ceiling the engine labels a month clamped at the floor or the ceiling (${list([...new Set(floorCeil.months.map((m) => nn(m.clamped)))])}); a raw price equal to the floor or the ceiling is not labelled clamped (${ref('boundaries')}). On price-ecs-plain-linear there is no S-curve and no band, so every month is on the straight line.`);
must('the plain linear case has no segment and no clamp', ecsPlain.months.every((m) => m.segment === null && m.clamped === null), 'plain');

/* ============================================================ SECTION 14 */

section('domestic', 'Nigerian domestic gas prices: power, commercial, gas distributors and gas based industries', ['Professional m05', 'Expert m05 l04']);
const REPORTED = { 2026: GC['dp-power-2026'].published.printed.price, 2025: GC['dp-power-2025'].published.printed.price };
w(`Every domesticPrice call states the domestic base price; ${ref('sources')} says where the reported figures come from and why none is graded. The rows below state ${f6(REPORTED[2026])} and ${f6(REPORTED[2025])} as the figures reported for 2026 and 2025 (the golden file's published figures), and other figures as stated probes.`);
w();
const DP = ['dp-power-2026', 'dp-commercial-2026', 'dp-power-2025', 'dp-commercial-2025', 'dp-distributor-within', 'dp-distributor-at-ceiling', 'dp-distributor-above', 'dp-gbi-urea-inside', 'dp-gbi-urea-floor', 'dp-gbi-urea-ceiling', 'dp-gbi-urea-at-prp', 'dp-gbi-urea-zero-cmpp', 'dp-gbi-gtl-diesel', 'dp-gbi-exactly-dbp', 'dp-gbi-exactly-floor', 'dp-gbi-schedule-override', 'dp-power-transport'];
const dbpLabel = (v) => (v === REPORTED[2026] ? `${f6(v)} (reported 2026)` : v === REPORTED[2025] ? `${f6(v)} (reported 2025)` : `${f6(v)} (stated)`);
table(['golden case', 'sector', 'domestic base price', 'negotiated', 'product', 'CMPP', 'NRP', 'PRP', 'EPF', 'formula price', 'price', 'ceiling', 'held at', 'delivered price'], DP.map((id) => {
  const a = argsOf(id); const r = runG(id);
  return [id, r.sector, dbpLabel(a.domesticBasePrice), a.negotiatedPrice === undefined ? 'none' : f6(a.negotiatedPrice), r.product || 'none', r.cmpp === undefined ? 'none' : f6(r.cmpp), r.nrp === undefined ? 'none' : f6(r.nrp), r.prp === undefined ? 'none' : f6(r.prp), r.epf === undefined ? 'none' : f6(r.epf), r.formulaPrice === undefined ? 'none' : f6(r.formulaPrice), f6(r.price), r.ceiling === undefined ? 'none' : f6(r.ceiling), r.heldAt === undefined || r.heldAt === null ? 'none' : S(r.heldAt), r.deliveredPrice === undefined ? 'none' : f6(r.deliveredPrice)];
}));
w();
w('The engine\'s rule and reason for each, verbatim:');
w();
table(['golden case', 'basis.rule', 'reason', 'basis.point'], DP.map((id) => { const r = runG(id); return [id, r.basis.rule, r.reason || 'none', r.basis.point]; }));
must('power and commercial 2026 on the reported base price are the published figures', runG('dp-power-2026').price === GC['dp-power-2026'].published.printed.price && Math.abs(runG('dp-commercial-2026').price - GC['dp-commercial-2026'].published.printed.price) < 1e-12, 'dp');
w();
w(`THE FOURTH SCHEDULE ARITHMETIC (dp-gbi-urea-inside): EPF = (CMPP - PRP) / PRP and CP = NRP x (1 + EPF), then held at or below the domestic base price and at or above the floor of ${f6(P.gbiFloorUsdPerMmbtu)} US$ per MMBtu. The ceiling applies before the floor. ${refCap('provisions')} quotes the Schedule.`);

/* ============================================================ SECTION 15 */

section('dgdo', 'The Domestic Gas Delivery Obligation: deemed fulfilment, the excuses in order, the penalty and a signed agreement', ['Professional m06']);
w(`THE RULE, in the engine's basis: ${dgPw.basis.rule}.`);
w();
w(`WHAT IS NOT COMPUTED, in the engine's basis: ${dgPw.basis.notReported}.`);
w();
const DG = ['dgdo-power-2028', 'dgdo-deemed-by-contracts', 'dgdo-contracts-one-short', 'dgdo-met', 'dgdo-over-delivered', 'dgdo-all-excused', 'dgdo-excuses-in-order', 'dgdo-agreement-above', 'dgdo-agreement-below', 'dgdo-agreement-equal', 'dgdo-adjusted-rate'];
table(['golden case', 'obligation', 'delivered', 'voluntary contracts', 'excuses stated', 'deemed fulfilled', 'undelivered', 'excused applied', 'penalised', 'rate', 'penalty', 'export restriction'], DG.map((id) => {
  const a = argsOf(id); const r = runG(id);
  return [id, f6(r.obligation), f6(r.delivered), f6(r.voluntaryContracts), a.excused ? Object.entries(a.excused).map(([k, v]) => `${k} ${f6(v)}`).join('; ') : 'none', S(r.deemedFulfilled), f6(r.undelivered), f6(r.excusedApplied), f6(r.penalised), f6(r.rate), f6(r.penalty), S(r.exportRestriction)];
}));
w();
table(['golden case', 'the rate basis, verbatim'], DG.map((id) => [id, runG(id).basis.rate]));
w();
DG.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons); });
must('an agreement rate below 3.50 is lifted to 3.50', runG('dgdo-agreement-below').rate === 3.5, runG('dgdo-agreement-below').rate);
must('voluntary contracts equal to the obligation are deemed fulfilment; one short are not', runG('dgdo-deemed-by-contracts').deemedFulfilled && !runG('dgdo-contracts-one-short').deemedFulfilled, 'deemed');
w();
w('THE EXCUSES are applied in the order of s.110(10), (a) force majeure, (b) a purchaser that cannot accept, (c) gas that cannot be transported, (d) a purchaser that does not pay, and each only up to the undelivered quantity left. A penalised quantity above zero also bars new export supply (s.110(14)(a), s.110(15)); the engine reports that restriction and gives it no price.');

/* ============================================================ SECTION 16 */

section('parity', 'Energy parity and the S-curve: heat equivalence, slopes below parity, the kinks and the published curve', ['Expert m01']);
const PAR = ['parity-ecs-0172', 'parity-eia-2026', 'parity-6'];
table(['golden case', 'MMBtu per barrel (golden input)', 'slope (engine)', 'printed by the source'], PAR.map((id) => { const r = runG(id); const pub = GC[id].published; return [id, f6(r.mmbtuPerBarrel), f6(r.slope), pub ? `${pub.source}: ${JSON.stringify(pub.printed)}` : 'none']; }));
const p58 = runG('parity-ecs-0172');
w();
w(`THE RULE, in the engine's basis: ${p58.basis.rule}.`);
w();
const ECS_SLOPE = GC['parity-ecs-0172'].published.printed.slope;
const EIA_BTU = GC['parity-eia-2026'].published.printed.btuPerBarrel;
w(`THE PRINTED SLOPE AND THE EXACT ONE. The Energy Charter Secretariat prints the heat-equivalence slope as ${S(ECS_SLOPE)} (text). On ${S(p58.mmbtuPerBarrel)} MMBtu per barrel the engine returns ${f6(p58.slope)}; the reciprocal of the printed slope is ${f6(1 / ECS_SLOPE)} MMBtu per barrel (derived), so the printed slope is a rounded figure. On the EIA's ${S(EIA_BTU)} Btu per barrel (text) the slope is ${f6(runG('parity-eia-2026').slope)}. A contract slope below the parity slope prices gas below oil on heat content.`);
must('the printed slope is not the engine slope', p58.slope !== ECS_SLOPE, p58.slope);
w();
const ecs = runG('price-ecs-figure-51');
const ecsA = argsOf('price-ecs-figure-51');
w(`THE PUBLISHED S-CURVE (golden input price-ecs-figure-51, the Energy Charter Secretariat's Figure 51: A ${S(ecsA.formula.slope)}, B ${S(ecsA.formula.constant)}, floor at ${S(ecsA.formula.sCurve.lowKink)} and cap at ${S(ecsA.formula.sCurve.highKink)} US$ per barrel, flat outside, text):`);
w();
table(['month', 'JCC (golden input)', 'segment', 'price'], ecs.months.map((m) => [m.month, f6(ecsA.months.find((x) => x.month === m.month).values.jcc), nn(m.segment), f6(m.price)]));
must('flat 3.0275 below 15 and 5.255 above 30', ecs.months[0].price === 3.0275 && Math.abs(ecs.months[4].price - 5.255) < 1e-12, ecs.months.map((m) => m.price).join());
w();
const ECS_AXIS = GC['price-ecs-figure-51'].published.printed.axis;
w(`The plateau levels follow from the printed parameters: ${f6(ecs.months[0].price)} at and below the lower kink and ${f6(ecs.months[4].price)} above the upper kink, inside the figure's printed axis of ${f6(ECS_AXIS[0])} to ${f6(ECS_AXIS[1])} (text).`);
w();
const sk = runG('price-s-curve-kinks');
const skA = argsOf('price-s-curve-kinks');
w(`THE KINKS (golden input price-s-curve-kinks: ${fdesc(skA.formula)}). Below the low kink P = constant + slope x lowKink + lowSlope x (X - lowKink); above the high kink likewise with highSlope; between them, and AT either kink, P = constant + slope x X. The curve is continuous at both kinks:`);
w();
table(['month', 'index (golden input)', 'segment', 'price'], sk.months.map((m) => [m.month, f6(Object.values(skA.months.find((x) => x.month === m.month).values)[0]), nn(m.segment), f6(m.price)]));
must('an index exactly at a kink is on the mid segment', sk.months.some((m, i) => Object.values(skA.months.find((x) => x.month === m.month).values)[0] === skA.formula.sCurve.lowKink && m.segment === 'mid'), 'kink');

/* ============================================================ SECTION 17 */

section('cashflows', 'Whole-contract cash flows: the revenue lines, royalty on the value of gas delivered, and the NPV', ['Expert m02']);
const cfPw = runG('cf-power');
const cfEx = runG('cf-export');
w(`THE ROYALTY, in the engine's basis (cf-power): ${cfPw.basis.royalty}.`);
w();
w(`THE NPV, in the engine's basis (cf-power): ${cfPw.basis.npv}.`);
w();
const cfTable = (r) => table(['year', 'regular', 'make-up', 'deficiency payment', 'shortfall damages', 'refund', 'seller revenue', 'delivered value', 'royalty rate', 'royalty', 'net after royalty'],
  r.years.map((y) => [S(y.year), f6(y.lines.regular), f6(y.lines.makeUp), f6(y.lines.deficiencyPayment), f6(y.lines.shortfallPayment), f6(y.lines.refund), f6(y.sellerRevenue), f6(y.deliveredValue), f6(y.royaltyRate), f6(y.royalty), f6(y.netAfterRoyalty)]));
w(`THE POWER PLANT IN MONEY (golden input cf-power: the power ledger, onshore, ${S(argsOf('cf-power').royalty.inCountrySharePct)} percent utilised in-country, discount rate ${S(argsOf('cf-power').discountRate)} to ${S(argsOf('cf-power').baseYear)}):`);
w();
cfTable(cfPw);
w();
w(`NPV of the seller revenue ${f6(cfPw.npvSellerRevenue)}; NPV of the net after royalty ${f6(cfPw.npvNetAfterRoyalty)} (engine).`);
w();
w(`THE EXPORT FEED IN MONEY (golden input cf-export: ${S(argsOf('cf-export').royalty.inCountrySharePct)} percent utilised in-country, discount rate ${S(argsOf('cf-export').discountRate)} to ${S(argsOf('cf-export').baseYear)}):`);
w();
cfTable(cfEx);
w();
w(`NPV of the seller revenue ${f6(cfEx.npvSellerRevenue)}; NPV of the net after royalty ${f6(cfEx.npvNetAfterRoyalty)} (engine).`);
const npvCheck = (r, a) => CF.npv(r.years.map((y) => y.sellerRevenue), a.discountRate, a.baseYear, r.years[0].year);
must('the NPV is the canonical cashflow.ts npv of the seller revenue', cfPw.npvSellerRevenue === npvCheck(cfPw, argsOf('cf-power')) && cfEx.npvSellerRevenue === npvCheck(cfEx, argsOf('cf-export')), 'npv');
must('the royalty rates are 0.025 for all gas in-country and 0.05 for exported gas', cfPw.royaltyRate === 0.025 && cfEx.royaltyRate === 0.05, `${cfPw.royaltyRate} ${cfEx.royaltyRate}`);
must('the royalty rate is the canonical deriveGasRoyaltyRate', cfPw.royaltyRate === CF.deriveGasRoyaltyRate('onshore', 100) && cfEx.royaltyRate === CF.deriveGasRoyaltyRate('onshore', 0), 'rate');
w();
w(`Both NPVs above are the canonical npv of engines/economics/cashflow.ts on the seller revenue rows, year-end flows (checked when this digest is built). The royalty rate is the canonical deriveGasRoyaltyRate of the same file: ${f6(cfEx.royaltyRate)} on exported gas and ${f6(cfPw.royaltyRate)} on gas utilised in-country (PIA Seventh Schedule para 10(6)); the pia course teaches the fiscal system that rate sits in.`);
const cfz = runG('cf-small-zero-rate');
w();
w(`A ZERO DISCOUNT RATE (golden input cf-small-zero-rate, deep offshore, ${S(argsOf('cf-small-zero-rate').royalty.inCountrySharePct)} percent in-country): royalty rate ${f6(cfz.royaltyRate)}; NPV of the seller revenue ${f6(cfz.npvSellerRevenue)}, which at a rate of zero is the plain sum of the rows (${f6(sum(cfz.years.map((y) => y.sellerRevenue)))}, derived).`);
must('at a rate of 0 the npv is the sum', cfz.npvSellerRevenue === sum(cfz.years.map((y) => y.sellerRevenue)), 'zero rate');

/* ============================================================ SECTION 18 */

section('readings', 'The four readings the engine states, verbatim, and where each one acts', ['Expert m03']);
w('Where a text leaves a rule open or prints a formula that would give an odd result, the engine takes a reading and states it in its own basis. The course teaches each reading as the engine\'s stated choice and grades none of them. The four readings, verbatim from the engine:');
w();
const R1 = dayPw.basis.reading;
const R23 = topPw.basis.reading;
const R4 = cfPw.basis.royalty;
const READ1 = 'seller shortfall measured against the quantity the seller made available';
const READ2 = 'make-up right equals the deficiency actually paid after any carry-forward credit';
const READ3 = 'a last-contract-year deficiency creates no make-up right (forfeit/refund applies to earlier years\' make-up only)';
const READ4 = 'royalty is charged on delivered gas value and not on deficiency payments';
must('the dailyBalance basis states reading 1 verbatim', R1.includes(READ1), R1);
must('the takeOrPay basis states readings 2 and 3 verbatim', R23.includes(READ2) && R23.includes(READ3), R23);
must('the gsaCashFlows basis states reading 4 verbatim', R4.includes(READ4), R4);
table(['reading', 'the engine states it in', 'the whole basis string, verbatim'], [
  [`1. ${READ1}`, 'dailyBalance basis.reading', R1],
  [`2. ${READ2}`, 'takeOrPay basis.reading', R23],
  [`3. ${READ3}`, 'takeOrPay basis.reading', R23],
  [`4. ${READ4}`, 'gsaCashFlows basis.royalty', R4],
]);
w();
w(`READING ONE ACTS on a day the seller made gas available that the buyer did not take. The model agreement's definition opens with a day on which the seller "did not make available" the properly nominated quantity, and its printed formula subtracts the Daily Actual Quantity (${ref('provisions')}). On daily-available-not-taken the engine returns a seller shortfall of ${f6(ant.sellerShortfall)} and a buyer shortfall of ${f6(ant.buyerShortfall)} (${ref('daily')}).`);
w();
const cfCap = runG('top-carry-forward-capped');
const capY = cfCap.years.find((y) => y.carryForwardApplied > 0);
const capNext = capY && cfCap.years.find((y) => y.year === capY.year + 1);
must('the capped carry-forward case applies a credit and the next year has make-up available equal to the deficiency paid', !!capY && !!capNext && capNext.makeUpAvailable === capY.deficiencyPaid && capY.deficiencyPaid < capY.deficiency, JSON.stringify(capNext));
w(`READING TWO ACTS in a year that draws a carry-forward credit. On top-carry-forward-capped, ${S(capY.year)}: deficiency ${f6(capY.deficiency)}, carry-forward credit ${f6(capY.carryForwardApplied)}, deficiency paid ${f6(capY.deficiencyPaid)}; in ${S(capNext.year)} the make-up available is ${f6(capNext.makeUpAvailable)}, the deficiency paid (${ref('carryforward')}). The model agreement's Make-Up Aggregate sums the deficiency quantities before any credit.`);
w();
const eot = runG('top-end-of-term-refund');
const eotLast = eot.years[eot.years.length - 1];
w(`READING THREE ACTS in a last contract year with a deficiency. On top-end-of-term-refund, ${S(eotLast.year)}: the reasons read, verbatim:`);
reasons(eotLast.reasons);
must('the last-year deficiency opens no make-up entry and the refund covers earlier entries only', eotLast.endOfTerm.entries.every((e) => e.fromYear !== eotLast.year), JSON.stringify(eotLast.endOfTerm));
w(`The refund covers the earlier entries only (${list(eotLast.endOfTerm.entries.map((e) => `${f6(e.quantity)} from ${e.fromYear}`))}); the year's own deficiency payment stays with the seller.`);
w();
const cfp28 = cfPw.years.find((y) => y.year === 2028);
w(`READING FOUR ACTS in a year with a deficiency payment. On cf-power, 2028: deficiency payment ${f6(cfp28.lines.deficiencyPayment)}, delivered value ${f6(cfp28.deliveredValue)}, royalty ${f6(cfp28.royalty)}; the royalty is ${f6(cfp28.royaltyRate)} x the delivered value (the gas pays its royalty when it is made up).`);
must('royalty = rate x delivered value in 2028', cfp28.royalty === cfp28.royaltyRate * cfp28.deliveredValue, 'royalty');
w();
w('THE RECOVERY ORDER IS NOT A READING. It is a required input with no default, and the engine names the reference text\'s order (' + ref('ledger') + ').');

/* ============================================================ SECTION 19 */

section('quirks', 'Reference texts and their quirks: the model agreement\'s alternatives, recovery orders, printed figures, the Btu and the cubic foot', ['Expert m04']);
w('THE MODEL AGREEMENT PRINTS ALTERNATIVES AND LEAVES FIGURES FOR THE PARTIES. Where it prints [## INSERT] the engine takes the figure as a required input. Where it prints alternatives the engine implements some and names the rest:');
w();
table(['model agreement clause', 'alternatives printed (text)', 'what the engine computes'], [
  ['Adjusted ACQ', 'Alternative 1 without, Alternative 2 with the operational flexibility credit', 'Alternative 2, with the credit entering as permittedReduction'],
  ['Buyer\'s Annual Deficiency Quantity', 'Alternative 1 less excess gas, Alternative 2 without', 'Alternative 2 (excess gas is not modelled)'],
  ['Buyer\'s Deficiency Payment (Article 12.6)', 'Alternative 1 BADQ x TOPP, Alternative 2 (BADQ - CFCQ) x TOPP', 'Alternative 2 when carry-forward is stated, which is Alternative 1 when it is not'],
  ['make-up right (Article 12.7.1)', 'after the Adjusted ACQ excluding or including excess gas', 'after the Adjusted ACQ (excess gas not modelled), plus the orders of ESMAP and HMRC as stated options'],
  ['end of the Delivery Period (Article 12.7.5)', 'Alternative 1 forfeit, Alternative 2 refund at the last take-or-pay price, Alternative 3 extend the term', 'Alternatives 1 and 2; Alternative 3 is not modelled'],
  ['carry-forward (Article 12.8)', 'Alternative 1 reduce next year\'s ACQ, Alternative 2 reduce the deficiency; cap on either', 'Alternative 2 with the cap on the deficiency'],
  ['take-or-pay price (Article 15.2.6)', 'Alternative 1 annual average, Alternative 2 last month, Alternative 3 a percentage of the last month', 'the take-or-pay price is a stated input per year; priceSeries returns the annual average and the last month\'s price'],
  ['index floor and ceiling (Article 15.8)', 'Alternative 1 floor and ceiling per index, Alternative 2 a cap on the change', 'Alternative 1; Alternative 2 is not modelled'],
]);
w();
w('RECOVERY ORDERS IN THE TEXTS. The model agreement takes make-up only after the Adjusted ACQ of the year is taken (Article 12.7.1); ESMAP describes make-up counted after the minimum-pay quantity for the year (para 6.59); HMRC names two orders, make-up in priority or only after the period minimum (OT05435). The engine computes all three and takes the order as a required input (' + ref('ledger') + ').');
w();
w('THE CARRY-FORWARD CAP IN THE TEXTS. ESMAP describes a cap on the use of carry-forward as a percentage of the annual quantity (para 6.62); the model agreement\'s Alternative 2 caps the credit as a percentage of the year\'s deficiency. The engine\'s capPct is a percentage of the deficiency.');
w();
w('THE SHORTFALL DEFINITION AND ITS FORMULA. The model agreement\'s definition of the Shortfall Quantity opens with a day the seller did not make the properly nominated quantity available, and its printed formula subtracts the quantity taken. The engine measures against the quantity made available (' + ref('readings') + ').');
w();
w(`PRINTED FIGURES AND EXACT FIGURES. HMRC prints the effective swing as ${S(HM_PRINTED.printed.effectiveSwing)} (the engine: ${f6(hm.effectiveSwing)}, ${ref('quantities')}); the Energy Charter Secretariat prints the parity slope ${S(ECS_SLOPE)} (the engine on ${S(p58.mmbtuPerBarrel)} MMBtu per barrel: ${f6(p58.slope)}, ${ref('parity')}). A reason the engine prints carries the double it holds: the export refund reads, verbatim,`);
const exRefundReason = yr(topEx, 2036).reasons.find((r) => /refunds/.test(r));
quote(exRefundReason);
must('the export refund reason prints the long double', /3700831\.3350000004$/.test(exRefundReason), exRefundReason);
w(`and the course quotes that refund as the numeric field at six decimals: ${f6(yr(topEx, 2036).refund)}.`);
w();
const FIND_BTU = FINDINGS.match(/The Model GSA defines its Btu at\s+(59 F to 60 F) \((about 1054\.80 J, 0\.02% smaller)\)/);
must('FINDINGS records the model agreement Btu', !!FIND_BTU, 'btu');
w(`THE BTU AND THE CUBIC FOOT. The engine uses the International Table Btu, ${S(U.BTU_IT_J)} J, exact by definition (NIST SP 811 prints it as "1.055 056 E+03 J"). The validation record reads the model agreement's Btu as defined "at ${FIND_BTU[1]}", "${FIND_BTU[2]}"; a contract on that Btu should state its heating value in those units. The cubic foot is exactly ${S(U.M3_PER_FT3)} cubic metres, the cube of the international foot.`);
w();
w('THE FOURTH SCHEDULE\'S TABLE HEADER. The gazetted table heads its NRP column "US $/mmbtu" and, beneath it, "Net of transport Tariff US $/Kcf" (text); the formula above the table states NRP in US$ per MMBtu, and the engine holds NRP in US$ per MMBtu.');

/* ============================================================ SECTION 20 */

section('boundaries', 'Boundaries, rule by rule', ['Expert m04 l05']);
w('Every rule the engine applies has its own boundary; no single rule covers them all. Each row below was probed by a call on a golden input when this digest was built:');
w();
const onUnit = runG('top-one-unit-short');
const cfAdj = runG('top-carry-forward-adjusted-acq');
const tolCover = runG('daily-tolerance-covers-the-gap').days[0];
const tolShort = runG('daily-tolerance-one-short').days[0];
const pz = runG('top-makeup-period-zero');
const gbiDbp = runG('dp-gbi-exactly-dbp');
const gbiFl = runG('dp-gbi-exactly-floor');
const distCeil = runG('dp-distributor-at-ceiling');
const agrEq = runG('dgdo-agreement-equal');
const fmWhole = runG('daily-fm-whole-day-with-nomination').days[0];
const zeroNom = dayRow('2027-01-05');
const esc = runG('price-escalated');
const escSteps = esc.months.filter((m, i) => i > 0 && m.price !== esc.months[i - 1].price).map((m) => m.month);
must('the escalated price steps only on anniversaries of the base month', escSteps.length > 0 && escSteps.every((m) => m.slice(5) === argsOf('price-escalated').formula.baseMonth.slice(5)), escSteps.join());
const pw30 = yr(topPw, 2030);
const skKinkRow = sk.months.find((m) => Object.values(skA.months.find((x) => x.month === m.month).values)[0] === skA.formula.sCurve.highKink);
const bFl = runG('price-cw-basket-index-floors');
table(['rule', 'at the boundary (probed)', 'engine result'], [
  ['deficiency', `counted EQUAL to the take-or-pay quantity (top-exactly-met: ${f6(em.years[0].counted)})`, `no deficiency (${f6(em.years[0].deficiency)}); one unit short gives ${f6(onUnit.years[0].deficiency)}`],
  ['make-up, after-adjusted-acq', `taken EQUAL to the Adjusted ACQ (top-power 2030: ${f6(pw30.taken)})`, `no make-up (${f6(pw30.makeUpTaken)}); make-up only strictly above`],
  ['make-up expiry', 'the last year of the period, y + N (top-makeup-on-last-day-of-period)', 'usable in that year; the rest expires at its end; none in the year after (top-makeup-one-year-late)'],
  ['make-up period of zero years', 'a deficiency (top-makeup-period-zero)', `paid (${f6(pz.years[0].deficiencyPayment)}), no make-up right`],
  ['last contract year', 'a deficiency (top-end-of-term-refund)', 'paid, no make-up right'],
  ['carry-forward surplus', `counted EQUAL to the base (top-carry-forward-adjusted-acq)`, `surplus only strictly above: ${list(cfAdj.years.map((y) => `${y.year} ${f6(y.surplus)}`))}`],
  ['carry-forward cap', 'a credit EQUAL to the cap percent of the deficiency (stated probe below)', 'applied in full (inclusive)'],
  ['seller shortfall on a day', `(PNQ - tolerance) - available EQUAL to zero (daily-tolerance-covers-the-gap)`, `no shortfall (${f6(tolCover.sellerShortfall)}); one unit more (daily-tolerance-one-short) gives ${f6(tolShort.sellerShortfall)}`],
  ['MaxDCQ', 'a nomination EQUAL to MaxDCQ', 'properly nominated in full; above it the excess is not properly nominated'],
  ['force majeure and maintenance', `together EQUAL to the DCQ (daily-fm-whole-day-with-nomination)`, `allowed; adjusted DCQ ${f6(fmWhole.adjustedDcq)}, nothing owed either way; above the DCQ refused`],
  ['zero nomination', `a zero nomination with an adjusted DCQ above zero (${zeroNom.date})`, `the whole adjusted DCQ is a buyer shortfall (${f6(zeroNom.buyerShortfall)})`],
  ['S-curve', `an index EQUAL to a kink (price-s-curve-kinks at ${S(skA.formula.sCurve.highKink)})`, `on the mid segment (${S(skKinkRow && skKinkRow.segment)}); the curve is continuous there`],
  ['price floor or ceiling', 'a raw price EQUAL to the floor (stated probe below)', 'not labelled clamped (strict); one index point lower is held at the floor'],
  ['basket index floor or ceiling', `an index EQUAL to its floor or ceiling (price-cw-basket-index-floors)`, `unchanged (strict); held indices: ${list(bFl.months.map((m) => `${m.month} ${Object.entries(m.heldIndices).map(([k, v]) => `${k} ${f6(v)}`).join(' ')}`))}`],
  ['four-decimal rounding', 'a fifth decimal of five', `rounds up (${rdIn('2026-03')} to ${rdOut('2026-03')})`],
  ['escalation', `each anniversary of the base month (price-escalated, base ${argsOf('price-escalated').formula.baseMonth})`, `steps in whole years: ${list(escSteps)}`],
  ['gas distributor', `a negotiated price EQUAL to the commercial price (dp-distributor-at-ceiling)`, `within the ceiling (${S(distCeil.withinCeiling)}, inclusive)`],
  ['gas based industries', `a formula price EQUAL to the base price, or to the floor ${f6(P.gbiFloorUsdPerMmbtu)} (dp-gbi-exactly-dbp, dp-gbi-exactly-floor)`, `not held (held at: ${gbiDbp.heldAt ?? 'none'}, ${gbiFl.heldAt ?? 'none'}); the ceiling applies before the floor`],
  ['DGDO deemed fulfilment', 'voluntary contracts EQUAL to the obligation (dgdo-deemed-by-contracts)', 'deemed fulfilled (inclusive, s.110(2) "equal to or higher"); one short is not (dgdo-contracts-one-short)'],
  ['DGDO agreement rate', `an agreement rate EQUAL to ${f6(P.dgdoPenaltyUsdPerMmbtu)} (dgdo-agreement-equal)`, `the agreement's rate (${f6(agrEq.rate)})`],
  ['DGDO excuses', 'excuses stated above the undelivered quantity (dgdo-all-excused)', 'applied only up to it, in the order (a) to (d)'],
  ['period day count', 'the end date of a period', 'excluded (a contract year that finishes on the following first of January)'],
  ['maxDcqPct', `EQUAL to ${S(PROBES.cq.maxDcqPct)} (stated probe below)`, 'allowed'],
]);
must('the carry-forward surplus is 0 in a year whose counted quantity equals the base', cfAdj.years.some((y) => y.counted === y.adjustedAcq && y.surplus === 0), cfAdj.years.map((y) => `${y.counted}/${y.adjustedAcq}/${y.surplus}`).join(' '));
must('the S-curve row at the high kink is on the mid segment', skKinkRow && skKinkRow.segment === 'mid', skKinkRow && skKinkRow.segment);
must('a make-up period of 0 opens no make-up right', pz.years.every((y) => y.makeUpAvailable === 0 && y.makeUpOutstanding === 0), 'period 0');
const allEx = runG('dgdo-all-excused');
must('the excuses are applied only up to the undelivered quantity', allEx.excusedApplied === allEx.undelivered && allEx.excused.some((x) => x.stated > x.applied) && allEx.penalty === 0, JSON.stringify(allEx.excused));
const CAP_PROBE = PROBES.cap;
const capProbe = success('takeOrPay at the carry-forward cap (stated probe)', G.takeOrPay(clone(CAP_PROBE)));
must('a credit equal to the cap is applied in full', capProbe.years[1].carryForwardApplied === capProbe.years[1].deficiency * CAP_PROBE.carryForward.capPct / 100 && capProbe.years[1].carryForwardAvailable > capProbe.years[1].carryForwardApplied, JSON.stringify(capProbe.years[1]).slice(0, 200));
const FLOOR_PROBE = PROBES.floor;
const floorProbe = success('priceSeries with a raw price equal to the floor (stated probe)', G.priceSeries(clone(FLOOR_PROBE)));
must('a raw price equal to the floor is not labelled clamped; below it is', floorProbe.months[0].price === FLOOR_PROBE.formula.floor && floorProbe.months[0].clamped === null && floorProbe.months[1].clamped === 'floor', JSON.stringify(floorProbe.months.map((m) => [m.price, m.clamped])));
const bFlRow = bFl.months.find((m) => Object.entries(argsOf('price-cw-basket-index-floors').formula.indexCeilings).some(([k, v]) => m.indexAverages[k] === v));
must('a basket index average equal to its ceiling is left unchanged', !!bFlRow, JSON.stringify(bFl.months.map((m) => m.indexAverages)));
must('the tolerance boundary: 0 then 1', tolCover.sellerShortfall === 0 && tolShort.sellerShortfall === 1, `${tolCover.sellerShortfall} ${tolShort.sellerShortfall}`);
must('distributor at the ceiling is within it; GBI exactly at the base price or the floor is not held', distCeil.withinCeiling === true && gbiDbp.heldAt === null && gbiFl.heldAt === null, 'dp edges');
const cq100 = G.contractQuantities(clone(PROBES.cq));
must('maxDcqPct at its lowest accepted value is allowed (stated probe)', !cq100.error && cq100.maxDcq === PROBES.cq.dcq, JSON.stringify(cq100).slice(0, 80));
const nomMax = G.dailyBalance(clone(PROBES.day));
must('a nomination equal to MaxDCQ is properly nominated in full (stated probe)', !nomMax.error && nomMax.days[0].properlyNominated === nomMax.maxDcq && nomMax.days[0].reasons.every((r) => !/not properly nominated/.test(r)), JSON.stringify(nomMax.days[0]));
w();
const pc = PROBES.cap; const pf = PROBES.floor;
w(`Four probes above are stated in this file. contractQuantities with dcq ${S(PROBES.cq.dcq)}, ${S(PROBES.cq.days)} days, maxDcqPct ${S(PROBES.cq.maxDcqPct)} and topPct ${S(PROBES.cq.topPct)} returns MaxDCQ ${f6(cq100.maxDcq)}. dailyBalance with dcq ${S(PROBES.day.dcq)}, maxDcqPct ${S(PROBES.day.maxDcqPct)} and a nomination of ${S(PROBES.day.days[0].nominated)} made available and taken returns a properly nominated quantity of ${f6(nomMax.days[0].properlyNominated)}. takeOrPay on two years of ACQ ${S(pc.years[0].acq)} at ${S(pc.topPct)} percent, taken ${S(pc.years[0].taken)} then ${S(pc.years[1].taken)}, with carry-forward of ${S(pc.carryForward.periodYears)} year above the take-or-pay quantity capped at ${S(pc.carryForward.capPct)} percent and a make-up period of ${S(pc.makeUp.periodYears)} years, applies a credit of ${f6(capProbe.years[1].carryForwardApplied)} against a deficiency of ${f6(capProbe.years[1].deficiency)}. priceSeries on ${S(pf.formula.constant)} + ${S(pf.formula.slope)} x oil with a floor of ${S(pf.formula.floor)} and a ceiling of ${S(pf.formula.ceiling)} prices oil ${S(pf.months[0].values.oil)} at ${f6(floorProbe.months[0].price)}, clamped ${floorProbe.months[0].clamped ?? 'none'}, and oil ${S(pf.months[1].values.oil)} at ${f6(floorProbe.months[1].price)}, clamped ${floorProbe.months[1].clamped}.`);

/* ============================================================ SECTION 21 */

section('notcomputed', 'What the engine does not compute, and figures quoted only as reported', ['Expert m05']);
w('Each item below is taught as a concept only, with where it would come from. None is graded.');
w();
table(['not computed', 'where it comes from', 'what the engine does instead'], [
  ['excess gas (quantities above the DCQ the seller agrees to supply) and over-delivery', 'Commonwealth model GSA, Excess Gas and BADQ Alternative 1', 'nothing; BADQ is Alternative 2'],
  ['off-specification gas and pre-start gas', 'Commonwealth model GSA, Article 13 and the Start Date', 'nothing'],
  ['the outcome of a price review', 'the reopener clause of a contract; ECS Box 9', 'reports each reopener month with a note'],
  ['the index change cap', 'Commonwealth model GSA Article 15.8 Alternative 2', 'floors and ceilings per index (Alternative 1)'],
  ['the extend-the-term end of the Delivery Period', 'Commonwealth model GSA Article 12.7.5 Alternative 3', 'forfeit or refund'],
  ['carry-forward that reduces next year\'s ACQ', 'Commonwealth model GSA Article 12.8 Alternative 1', 'carry-forward against the deficiency (Alternative 2)'],
  ['the DGDO 90-day investigation', 'DGDO Regulations 2022 r.6(3) and (4)', 'excuses applied as stated'],
  ['compensation to customer-clients', 'PIA s.110(13)', 'nothing'],
  ['the Third Schedule tier allocation and the supply curve', 'PIA Third Schedule para 2; DGDO Regulations r.4 and r.5', 'the obligation is a stated input'],
  ['the flare penalty', 'PIA s.104 and s.105 leave the fine to regulations; the copy of the 2023 flaring Regulations on the regulator\'s gazetted page is unnumbered and undated', 'nothing; this course prints no flare rate. Flare to value, LPG and CNG belong to the gasvalue course'],
]);
w();
w('REOPENERS ARE REPORTED BY MONTH. priceSeries returns each reopener with this note, verbatim (price-export):');
quote(psEx.reopeners[0].note);
must('the reopener note says the outcome is not modelled', /reported only; the engine does not model the outcome of a price review/.test(psEx.reopeners[0].note), psEx.reopeners[0].note);
w();
w(`THE DGDO'S UNCOMPUTED RULES, in the engine's basis: ${dgPw.basis.notReported}.`);
w();
w(`FIGURES QUOTED ONLY AS REPORTED. The domestic base price for 2026 (${f6(REPORTED[2026])} US$ per MMBtu for power and ${f6(GC['dp-commercial-2026'].published.printed.price)} for the commercial sector, effective on the first of April) and for 2025 (${f6(REPORTED[2025])} and ${f6(GC['dp-commercial-2025'].published.printed.price)}) are reported figures; the regulator's circular was not read. The engine's own sentence is in ${ref('sources')}. A lesson quotes them with that attribution and never as a value the course grades.`);
must('FINDINGS lists the not-computed items', /Not computed/.test(FINDINGS) && /excess gas/.test(FINDINGS) && /90-day investigation/.test(FINDINGS) && /Third Schedule tier allocation/.test(FINDINGS), 'not computed');

/* ============================================================ SECTION 22 */

section('caps', 'Size caps and refusals at scale', ['Expert m06 l02']);
const Y = (n) => Array.from({ length: n }, (_, i) => ({ year: 2027 + i, acq: 1000, taken: 1000, contractPrice: 3, topPrice: 3, makeUpPrice: 0 }));
const monthsN = (n) => Array.from({ length: n }, (_, i) => ({ month: `${2000 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`, values: { x: 1 } }));
const daysN = (n) => Array.from({ length: n }, (_, i) => { const d = new Date(Date.UTC(2027, 0, 1 + i)); return { date: d.toISOString().slice(0, 10), nominated: 1, available: 1, taken: 1 }; });
const CAPS = [
  ['MAX_YEARS', `takeOrPay with ${D.MAX_YEARS + 1} contract years`, G.takeOrPay({ years: Y(D.MAX_YEARS + 1), topPct: 80, makeUp: { periodYears: 1, order: 'first', endOfTerm: 'forfeit' } }), 'years'],
  ['MAX_DAYS', `dailyBalance with ${D.MAX_DAYS + 1} days`, G.dailyBalance({ dcq: 1, days: daysN(D.MAX_DAYS + 1) }), 'days'],
  ['MAX_MONTHS', `priceSeries with ${D.MAX_MONTHS + 1} index months`, G.priceSeries({ months: monthsN(D.MAX_MONTHS + 1), formula: { type: 'fixed', price: 1 }, from: '2000-01', to: '2000-02' }), 'months'],
  ['MAX_MONTHS', `priceSeries asked to price ${D.MAX_MONTHS + 1} months`, G.priceSeries({ months: monthsN(12), formula: { type: 'fixed', price: 1 }, from: '2000-01', to: '2100-01' }), 'to'],
  ['MAX_INDICES', `a basket of ${D.MAX_INDICES + 1} indices`, G.priceSeries({ months: [{ month: '2026-01', values: Object.fromEntries(Array.from({ length: D.MAX_INDICES + 1 }, (_, i) => [`i${i}`, 1])) }], formula: { type: 'basket', basePrice: 1, weights: Object.fromEntries(Array.from({ length: D.MAX_INDICES + 1 }, (_, i) => [`i${i}`, 1 / (D.MAX_INDICES + 1)])), baseValues: Object.fromEntries(Array.from({ length: D.MAX_INDICES + 1 }, (_, i) => [`i${i}`, 1])) }, from: '2026-01', to: '2026-01' }), 'formula.weights'],
];
table(['cap', 'value', 'stated call over the cap', 'the engine\'s message, verbatim'], CAPS.map(([k, what, r, field]) => { refusal(`cap ${k}: ${what}`, r, field); return [`\`${k}\``, S(D[k]), what, r.error]; }));
w();
w(`A panel stays well inside these caps. The validation record states, verbatim: "${FINDINGS.match(/At every cap a call stays well under [^.]+/)[0]}".`);
must('FINDINGS records the timing statement', /At every cap a call stays well under 100 ms/.test(FINDINGS), 'timing');

/* ============================================================ SECTION 23 */

section('choices', 'Conventions that are choices, and the contract report', ['Expert m06']);
w('CONVENTIONS THAT ARE CHOICES. Each is the engine\'s stated choice where no text fixes one; a different choice would move a figure, so each is named in any report that quotes the figure:');
w();
table(['convention', 'the engine\'s choice', 'where it comes from'], [
  ['the Btu', `the International Table Btu, ${S(U.BTU_IT_J)} J`, `NIST SP 811 (2008) Appendix B; the validation record reads the model agreement's Btu as defined at ${FIND_BTU[1]}, ${FIND_BTU[2]}`],
  ['a mixed volume and heating value pair', 'one set of reference conditions, stated by the caller', 'engine convention'],
  ['the day count', 'stated days, a calendar year, or a period with the end date excluded', 'engine convention'],
  ['the seller shortfall', 'against the quantity made available', 'a stated reading (' + ref('readings') + ')'],
  ['the make-up right', 'the deficiency paid after any carry-forward credit; none from the last year', 'stated readings (' + ref('readings') + ')'],
  ['the make-up threshold', 'strictly above the Adjusted ACQ or the take-or-pay quantity', 'engine convention on the model agreement\'s "after Buyer has taken delivery of at least"'],
  ['drawing make-up and carry-forward', 'first in first out', 'Commonwealth model GSA Articles 12.7 and 12.8'],
  ['the index window', 'the mean of averagingMonths months ending lagMonths months before the delivery month; a lag of zero ends it at the delivery month', 'engine convention; the model agreement ends it one month before the review month'],
  ['the reset', 'every month of a block carries the price of the block\'s first month, counted from `from`', 'engine convention'],
  ['the four-decimal rule', `the double normalised to ${S(D.PRICE_DIGITS)} significant digits before the fifth decimal decides`, 'Commonwealth model GSA Article 15.4, with the normalisation stated'],
  ['royalty', 'on the value of gas delivered, none on a deficiency payment', 'a stated reading (' + ref('readings') + ')'],
  ['the NPV', 'year-end flows discounted to the stated base year', 'the canonical npv of cashflow.ts'],
]);
w();
w('WRITING THE CONTRACT REPORT names: the agreement, its parties (synthetic in this course), the delivery point and the term; every source applied with its edition and the date read; the DCQ, the heating value basis and reference conditions, the day count, MaxDCQ and the take-or-pay percentage; the recovery order, the make-up period, the end-of-term rule and any carry-forward terms; the price formula with its index, averaging, lag, reset, floor, ceiling, S-curve and rounding, and the basis of the take-or-pay price; each year\'s Adjusted ACQ, take-or-pay quantity, deficiency and payment, make-up taken and expired, credit applied and damages, with the engine\'s reasons; the royalty terrain and share; the discount rate and base year beside every NPV; each reading the figures rest on; and any figure quoted only as reported, with its attribution.');

/* ============================================================ SECTION 24 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Six terms in this course carry a narrower meaning than they have in conversation. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['term', 'what it can mean elsewhere', 'the rule here'], [
  ['shortfall', 'any gap between what was wanted and what came', 'always qualified: a seller shortfall is gas the seller did not make available against a properly nominated quantity; a buyer shortfall is the adjusted DCQ the buyer did not take'],
  ['deficiency', 'any shortage', 'the take-or-pay quantity less the quantity counted, when above zero; the money is the deficiency payment'],
  ['make-up', 'any catching up', 'gas paid for in a deficiency year and taken in a later year of its make-up period'],
  ['carry-forward', 'any balance brought forward', 'takes above the stated base credited against a later deficiency, capped, for a stated period'],
  ['Adjusted ACQ', 'the ACQ', 'the ACQ less maintenance, force majeure, seller shortfall and any permitted reduction; the take-or-pay quantity is its stated percentage'],
  ['domestic base price', 'the gas price', 'the price the Authority determines each year under PIA s.167(1); a required input, quoted only as reported'],
]);
w();
w('A FIGURE THAT DEPENDS ON A TERM is quoted with it: a deficiency payment with its take-or-pay percentage and price; a make-up quantity with its order and period; a price with its formula, averaging, lag and reset; an NPV with its rate and base year.');

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', process.env.EC8_DUMP_PARTIAL || unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', process.env.EC8_DUMP_PARTIAL || SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)));
must('no em or en dash reaches the digest', !OUT.some((l) => /[–—]/.test(l)), OUT.find((l) => /[–—]/.test(l)));

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`gsa_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.EC8_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`gsa_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
