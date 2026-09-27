// THE SC3 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S VALIDATION FILES ARE NOT TEACHING TRUTH. The oracle, the golden
// file's expected figures, the fixture README, the negative control, the
// engine's own source comments and FINDINGS-inventory.md are PROVENANCE. Where
// they state a figure this file recomputes it through the engine on the
// vendored golden INPUTS, on the fixture, or on stated inputs, and prints it.
//
// Usage:  sh /root/cat-wip-materials/build_digest.sh > digest.tmp && mv digest.tmp digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE
// (engines/supplychain/inventory.js and the canonical functions it imports:
// mulberry32, triInvCDF, basicStats and mean from lib/stats/stats.js; the
// exceedance sentence from lib/conventions/percentile.js; the regularised
// incomplete gamma from engines/hse/safetyStats.js), except where a line says
// "stated" (an input typed in this file and printed beside the call it went
// into), "golden input" (an input read from the vendored
// test-data/supplychain/goldens/inventory_cases.json, whose inputs are the
// Ekene synthetic register, stated probes and the published checks), "fixture"
// (read from the vendored ekene-materials register), "text" (a figure printed
// by a source, cited with its page, lecture and slide or section; each is
// checked against the text by quote_check.py, and the MIT OpenCourseWare
// lectures' slide text is never reproduced) or "derived" (arithmetic on engine
// values printed in the same block, with the arithmetic stated). Nothing here
// reads a clock, a random number, a locale or a network; TZ and LC_ALL are
// pinned by build_digest.sh. The one Monte Carlo the engine runs (leadTimeRisk)
// is seeded by a stated seed, so its figures reproduce, and every one of them
// is printed with its seed and its draw count.
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
// THE DIGEST IS NOT THE CAPSTONE. This file never reads materials_capstone.mjs,
// fields.json or the capstone cases, and the capstone never reads this.
//
// NO LECTURE PROSE. The MIT OpenCourseWare lectures are licensed CC BY-NC-SA
// 4.0 and this course is sold. This file cites their figures by lecture and
// slide and writes every explanation in its own words; gate_no_ocw_prose.py
// refuses any eight-word run of their text in the digest.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const HERE = process.env.SC3_WAVE_DIR || '/root/cat-wip-materials';
const { I: E, PCT, STATS, ROOT, ENGINE_REL } = await import(`${HERE}/materials_engine.mjs`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/supplychain/goldens/inventory_cases.json`, 'utf8'));
const FX = JSON.parse(fs.readFileSync(`${ROOT}/test-data/supplychain/ekene-materials/register.json`, 'utf8'));
const FXREADME = fs.readFileSync(`${ROOT}/test-data/supplychain/ekene-materials/README.md`, 'utf8');
const NEGCONTROL = fs.readFileSync(`${ROOT}/tools/validation/supplychain/negcontrol_inventory.sh`, 'utf8');
const FINDINGS = fs.readFileSync(`${ROOT}/tools/validation/supplychain/FINDINGS-inventory.md`, 'utf8');
const FINDINGS_PRMS = fs.readFileSync(`${ROOT}/tools/validation/economics/FINDINGS-prms.md`, 'utf8');
const CONCEPTS = JSON.parse(fs.readFileSync(process.env.SC3_CONCEPTS || `${HERE}/concepts.json`, 'utf8'));
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
  return r || {};
};
// A figure of sixteen or more significant digits at six decimals reads as a
// serialised float, so it prints with its thousands grouped by commas; the
// digits are the same.
const group = (s) => { const [i, d] = s.split('.'); return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${d === undefined ? '' : `.${d}`}`; };
const f6 = (x) => {
  if (x === null || x === undefined) return 'none';
  const s = Number(x).toFixed(6);
  const t = Number(s) === 0 ? (0).toFixed(6) : s;
  return t.replace(/^-/, '').replace('.', '').replace(/^0+/, '').length > 15 ? group(t) : t;
};
const S = (x) => String(x);
const list = (a) => (a.length ? a.join(', ') : 'none');
const clone = (o) => JSON.parse(JSON.stringify(o));
const cell = (s) => String(s).replace(/\|/g, '\\|');
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
const ORDER = ['computes', 'sources', 'provisions', 'published', 'slips', 'dataset', 'planner', 'refusals', 'graded',
  'criticality', 'abc', 'eoq', 'rounding', 'slowmoving',
  'discounts', 'protection', 'cycleservice', 'fillrate', 'periodic', 'poisson',
  'insurance', 'anchor', 'montecarlo', 'stockouts', 'readings', 'boundaries', 'notcomputed', 'sizecaps', 'choices',
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
// A reason quoted with the golden input it came from named on the line before.
const qg = (id, s) => { w(`${id}, the engine's reason, verbatim:`); quote(s); };
const CON = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
const C = (id) => { const c = CON[id]; must(`concepts.json carries a found quotation ${id}`, c && c.found === true && c.quote && c.cite, id); return c || { cite: id, quote: '', paraphrase: '' }; };
const cq = (id) => { const c = C(id); w(`${c.cite}: ${c.paraphrase}`); quote(`"${c.quote}" (${c.cite})`); };

/* ---------------------------------------------------------- the engine runs */

const GC = Object.fromEntries(GOLD.cases.map((c) => [c.id, c]));
const isRefusalCase = (c) => c.expected && c.expected.error === true;
const runG = (id) => {
  const c = GC[id];
  must(`the golden file carries the case ${id}`, !!c, id);
  return success(`${c && c.fn} on the golden input ${id}`, c ? E[c.fn](clone(c.args)) : { error: 'missing' });
};
const argsOf = (id) => clone(GC[id].args);
const D = E.DEFAULTS;
const { EXCEEDANCE_DEFINITION } = PCT;
// The fixture's stated cases, with the fixture's own labels (item, note) taken off before a call.
const caseArgs = (k) => { const { item, note, ...args } = clone(FX.cases[k]); return args; };
const byId = Object.fromEntries(FX.items.map((it) => [it.id, it]));
const POL = FX.policy;
const critArgs = () => ({ ...clone(POL.criticality), items: FX.items.map((it) => ({ id: it.id, name: it.name, scores: clone(it.scores) })) });
const abcArgs = (rule) => ({ items: FX.items.map((it) => ({ id: it.id, name: it.name, annualUsage: it.annualUsage, unitCost: it.unitCost })), cutoffs: clone(POL.abc.cutoffs), boundaryRule: rule });
const smArgs = () => ({ items: FX.items.map((it) => ({ id: it.id, name: it.name, onHand: it.onHand, unitCost: it.unitCost, monthsSinceLastIssue: it.monthsSinceLastIssue, monthlyUsage: it.monthlyUsage })), bands: clone(POL.slowMoving.bands), excessCoverMonths: POL.slowMoving.excessCoverMonths });

// THE FIGURES THE TEXTS PRINT, typed ONCE here with their citation, exactly as
// each text prints them. Each is checked against its text by quote_check.py
// (which reads the texts), and each is printed as the text prints it. None is
// computed from.
const TEXT = {
  harris: { lot1: '2,190', lot2: '6,850', lot3: '48.5', say: '49' },
  l8s9: { q: '400', order: '2,500', hold: '2,500', total: '5,000' },
  l8s15: { f1: '2,500', f2: '7,500', eoq0: '400', eoq1: '1,033', eoq2: '1,789', price: '44.19', purchase: '88,384', order: '559', hold: '9,882', total: '98,825', base: '105,000' },
  l11s24: { csl: ['601', '423', '330', '217'], ifr: ['513', '348', '252', '148'], demand: '13,000', rmse: '1,316', eoq: '228' },
  l12s6: { sigma: '577', g: '0.1733', k: '0.58', s: '2835' },
  l13s12: { p: ['44.9%', '35.9%', '14.4%'], f: ['44.9%', '80.9%', '95.3%', '99.1%', '99.9%'], l: ['0.80', '0.25', '0.06', '0.01', '0.009'], eus: '0.08', level: '2' },
  mil: { r: '0.986' },
};
const EXPORTS = [
  ['criticality', 'the criticality class of each item', 'criteria (id, label, weight), scoreMax, items (id, name, scores), classes (label, minScore), topClassOnMaxScore', 'each item\'s weighted score, the contribution of each criterion, its class, the criteria that forced the top class and the reason; the count in each class'],
  ['abcClassification', 'the ABC class of each item by annual usage value', 'items (id, name, annualUsage, unitCost), cutoffs (aPct, bPct), boundaryRule', 'each item\'s rank, annual usage value, share, cumulative share, class and reason; the total annual usage value; the count and value share of each class'],
  ['eoq', 'the economic order quantity and the quantity ordered', 'annualDemand, orderCost, holdingCostPerUnitYear or unitCost with holdingRate, rounding', 'the EOQ, the quantity ordered, the holding cost of a unit for a year, orders a year, the cycle in years, ordering, holding and relevant cost at the quantity ordered, the relevant cost at the EOQ, the rounding penalty in percent and the purchase cost'],
  ['quantityDiscount', 'the order quantity under a price schedule', 'annualDemand, orderCost, holdingRate, breaks (minQuantity, unitPrice), discountType, rounding', 'each band\'s EOQ, candidate and total cost with its reason, the quantity ordered, the band it is costed in, its total cost and the saving against the no-discount baseline'],
  ['safetyStock', 'safety stock and the reorder point or order-up-to level for normal demand', 'demandMean, demandSd, leadTime, leadTimeSd, reviewPeriod, serviceMeasure, serviceLevel, orderQuantity (for a fill rate), safetyFactorRounding, minimumSafetyFactor, rounding', 'the policy, the protection period, the demand over it and its sigma, the safety factor exact and as used, the safety stock, the level exact and as held, the achieved cycle service, the expected units short a cycle and the achieved fill rate'],
  ['poissonStock', 'the stock level for Poisson demand', 'demandRate, leadTime, reviewPeriod, serviceMeasure, serviceLevel, orderQuantity (for a fill rate)', 'the Poisson mean, the level, the safety stock, the table of probability, cumulative and loss by level, the achieved cycle service, the expected units short a cycle and the achieved fill rate'],
  ['insuranceSpares', 'the number of insurance spares that costs least', 'failuresPerYear, leadTimeDays, daysPerYear, unitCost, holdingRate, downtimeCostPerDay, maxSpares', 'the mean number of orders outstanding, the cheapest number of spares and its total cost, whether the search stopped at its limit, and for every number of spares the probability of no shortage, the fill rate, the expected units down, the holding, downtime and total cost'],
  ['leadTimeRisk', 'lead-time risk by the canonical seeded Monte Carlo', 'demandPerDay and leadTimeDays (each a number or a triangular min, mode, max), reorderPoint, serviceLevel (optional), iterations, seed', 'the mean, P90, P50, P10, minimum and maximum of the sampled lead time and lead-time demand, the stockout probability, the cycle service level, the expected units short a cycle, the reorder point for a service level and the exceedance sentence'],
  ['slowMoving', 'slow-moving and obsolete stock, write-down and excess', 'items (id, name, onHand, unitCost, monthsSinceLastIssue, monthlyUsage), bands (label, minMonths, writeDownPct), excessCoverMonths', 'each item\'s band, stock value, write-down, cover in months, whether it is excess, the excess quantity and the reason; the count, stock value and write-down of each band; the totals and the count of excess items'],
];

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# SC3 TEACHING DIGEST: Materials, Spares & Inventory Management');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The oracle, the golden file\'s expected figures, the fixture README, the negative control, FINDINGS-inventory.md and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every quantity, cost, amount of money, score, share, percentage, probability, safety factor, sigma, mean and ratio prints to SIX decimals; years, months and days stated as inputs, counts, ranks, levels, spares, draws, seeds and whole inputs print as whole numbers or as given; a figure of sixteen or more significant digits at six decimals prints with its thousands grouped by commas; an engine message, reason and basis is printed verbatim, figures and all. Inside a message the engine prints money rounded to the cent and a computed quantity, factor or probability to six decimal places (both half away from zero, trailing zeros dropped), and a stated input as it was given.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines 110f0a0 (engines PRs #281 and #283, its validation record FINDINGS-inventory.md with the lead's decisions), ${engineLines} lines, at its canonical path in the NextGen repository. It imports mulberry32, triInvCDF, basicStats and mean from lib/stats/stats.js, EXCEEDANCE_DEFINITION from lib/conventions/percentile.js and regularizedGammaQ from engines/hse/safetyStats.js, and nothing else. It makes no network call.`);
w();
w('# AN APP COURSE. The Suite app for this course is the Materials & Spares Planner, in the Suite\'s Midstream & Downstream module, which vendors this same engine. Every practical also runs in the course\'s own calculator panels, which call this same vendored engine on the learner\'s own inputs, so a learner without a Suite seat does every exercise.');
w();
w('# THE DATA. Every Ekene item, score, usage, cost, stock, demand, lead time, failure rate and downtime cost is SYNTHETIC, written for this platform by a stated script. No real company, supplier, price or stock record appears.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone case and no graded answer. The capstones run their own registers and the digest never names them.');
w();
w(`# NO LECTURE PROSE. The MIT OpenCourseWare lectures of ESD.260J are licensed CC BY-NC-SA 4.0 and this course is sold, so the course cites their figures by lecture and slide, teaches their ideas in its own words and never reproduces a slide or its text. Only public-domain texts are quoted (${ref('provisions')}).`);
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming the rules it applied and where they come from, and a `reason` (or a reason on each item, band or candidate), so the working can be printed.');
w();
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof E[name] === 'function', typeof E[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(E).filter((k) => typeof E[k] === 'function').length === EXPORTS.length, Object.keys(E).filter((k) => typeof E[k] === 'function').join(','));
w();
w('The stated constants, read from the exported `DEFAULTS`:');
w();
const DSRC = {
  TIE_DIGITS: ['the significant digits at which two figures are compared: two figures that agree to 12 significant digits tie', 'engine convention'],
  WEIGHT_SUM: ['the sum the criticality weights must reach', 'engine convention (weights read as percentages)'],
  WEIGHT_SUM_TOLERANCE: ['how far the weights may miss 100 before the criteria are refused', 'engine convention'],
  MAX_ITEMS: ['the most items one criticality, ABC or slow-moving call accepts', 'cap'],
  MAX_CRITERIA: ['the most criteria one criticality call accepts', 'cap'],
  MAX_CLASSES: ['the most criticality classes one call accepts', 'cap'],
  MAX_BREAKS: ['the most price bands one quantity discount call accepts', 'cap'],
  MAX_BANDS: ['the most slow-moving bands one call accepts', 'cap'],
  MAX_DECIMALS: ['the most decimals a safety factor may be read to from a table', 'cap'],
  MAX_ITERATIONS: ['the most Monte Carlo draws one lead-time risk call accepts', 'cap'],
  MAX_POISSON_MEAN: ['the largest Poisson mean one call accepts; above it the normal safety stock serves', 'cap'],
  MAX_SPARES: ['the largest maxSpares one insurance spares call accepts', 'cap'],
};
table(['constant', 'value', 'what it sets', 'where it comes from'], Object.entries(D).map(([k, v]) => [`\`DEFAULTS.${k}\``, k === 'WEIGHT_SUM_TOLERANCE' ? v.toExponential() : S(v), DSRC[k][0], DSRC[k][1]]));
must('DEFAULTS carries twelve values, each described here', Object.keys(D).length === 12 && Object.keys(D).every((k) => DSRC[k]), Object.keys(D));
must('the weight-sum tolerance prints in exponent form as the engine states it', D.WEIGHT_SUM_TOLERANCE.toExponential() === '1e-9', D.WEIGHT_SUM_TOLERANCE);
must('DEFAULTS is frozen', Object.isFrozen(D), 'frozen');
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports and its source:');
const IMPORTS = [...ENGINE_SRC.matchAll(/^import [\s\S]*? from '([^']+)';$/gm)].map((m) => m[1]);
must('the engine imports exactly lib/stats, lib/conventions/percentile.js and engines/hse/safetyStats.js', IMPORTS.join() === '../../lib/stats/stats.js,../../lib/conventions/percentile.js,../hse/safetyStats.js', IMPORTS.join());
must('the engine source makes no network call, reads no clock and draws no random number of its own', !/\bfetch\x28|XMLHttpRequest|\bimport\x28|require\x28|Math\.random|Date\.now|new Date\x28\x29/.test(ENGINE_SRC), 'none');
must('the engine source carries no NPV and no discount rate', !/\bnpv\b|discountRate/i.test(ENGINE_SRC.replace(/NPV\s+none: nothing here is discounted\./, '')), 'npv');
w('- Its three imports are lib/stats/stats.js (the canonical seeded Monte Carlo: mulberry32, the triangular inverse triInvCDF, basicStats for the percentiles and mean), lib/conventions/percentile.js (the exceedance sentence the Monte Carlo returns) and engines/hse/safetyStats.js (the regularised incomplete gamma through which the engine computes the standard normal cumulative probability). It carries no sampler, no percentile code and no discounting of its own. The one function that samples is leadTimeRisk, on the stated seed. Nothing is discounted and no NPV is computed.');
w(`- It decides nothing an input does not state. Every criterion, weight, score scale, class minimum and override, ABC cut-off and boundary rule, demand, cost, holding rate or holding cost, rounding rule and multiple, price band and discount type, service measure and level, order quantity, safety-factor rounding and floor, lead time and its spread, review period, failure rate, days a year, downtime cost, search limit, distribution, reorder point, seed, draw count, band and write-down percentage and cover limit is an input with no default, and a call without one is refused by name (${ref('refusals')}). The only figures it holds are the ${Object.keys(D).length} in \`DEFAULTS\`: its tie convention, the weight sum and its caps.`);
must('ACCEPTED_KEYS carries one shape for every exported function', Object.keys(E.ACCEPTED_KEYS).sort().join() === EXPORTS.map((x) => x[0]).sort().join() && Object.isFrozen(E.ACCEPTED_KEYS), Object.keys(E.ACCEPTED_KEYS).join());
w(`- It reads no key it does not know. \`ACCEPTED_KEYS\` is exported with one shape for each of the ${EXPORTS.length} functions, and every call refuses an input key the function does not read, at every level, naming the key, its path and the accepted keys. A misspelt key is refused; it is never dropped silently.`);
w(`- It estimates no failure rate from field data, fits no demand distribution, forecasts no demand, runs no tender, discounts no cost and writes no stock policy. ${refCap('notcomputed')} lists each with the course that owns it.`);
w(`- Its exported names are, in full: ${Object.keys(E).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('sources', 'The sources, their editions and licences, and the date each was read', ['Associate m01 l02', 'Expert m05 l04']);
w('THE RULE THIS COURSE FOLLOWS FOR EVERY TEXT IT USES. Each one is named with its edition or date, its licence and the date it was read. Only public-domain texts are quoted, with their citation. A licensed text is taught by concept with its lecture and slide numbers, and its printed figures are cited as figures; none of its prose is quoted and no slide is reproduced. Every figure the engine applies is a stated input with no default. Every text below was read on 2026-09-27.');
w();
const SOURCES = [
  ['F. W. Harris, "How Many Parts to Make at Once", Factory, The Magazine of Management 10(2), pp. 135-136 and 152', 'February 1913; read in the reprint in Operations Research 38(6), November-December 1990, pp. 947-950', 'the 1913 text is public domain in the US; the 1990 reprint\'s typesetting is copyright ORSA and is not reproduced', 'the square-root lot size and his three worked lots', 'quoted, with citation (the 1913 words only)'],
  ['C. Caplice, MIT ESD.260J Logistics Systems, lecture 7 (level demand, EOQ and sensitivity) and lecture 8 (extensions to EOQ)', 'Fall 2006 (the PDFs made 23 July 2007)', 'MIT OpenCourseWare, CC BY-NC-SA 4.0', 'the EOQ and its cost at the optimum (lecture 8 slides 3 and 9); all-units and incremental discounts (lecture 8 slides 11 to 15)', 'FIGURES CITED BY LECTURE AND SLIDE ONLY: the licence is non-commercial and this course is sold, so no slide or slide text is reproduced'],
  ['C. Caplice, MIT ESD.260J, lecture 11 (probabilistic demand)', 'Fall 2006', 'MIT OpenCourseWare, CC BY-NC-SA 4.0', 'ABC classes as a stated policy (slide 4); safety stock, the cycle service level and the item fill rate (slides 12 to 23); the worked table of safety stocks (slide 24)', 'FIGURES CITED BY LECTURE AND SLIDE ONLY'],
  ['C. Caplice, MIT ESD.260J, lecture 12 (more probabilistic demand)', 'Fall 2006', 'MIT OpenCourseWare, CC BY-NC-SA 4.0', 'periodic review, the order-up-to level and its worked example (slides 3, 5 and 6)', 'FIGURES CITED BY LECTURE AND SLIDE ONLY'],
  ['C. Caplice, MIT ESD.260J, lecture 13 (special cases, probabilistic demand)', 'Fall 2006', 'MIT OpenCourseWare, CC BY-NC-SA 4.0', 'Poisson demand for slow movers and the discrete loss table (slides 10 to 12); days of supply to find dead stock (slide 13)', 'FIGURES CITED BY LECTURE AND SLIDE ONLY'],
  ['MIL-HDBK-338B, Electronic Reliability Design Handbook, section 5.3.8, eq. 5.58 and example 5.3.8.1, p. 5-27', '1 October 1998', 'US Department of Defense handbook, public domain (distribution A)', 'the probability of a stated number of failures or fewer in a stated time, and the lamp example', 'quoted, with citation'],
  ['SPE-PRMS 2018, Petroleum Resources Management System', 'June 2018', 'CC BY-NC-ND 4.0', 'nothing for this course: it is named only because the P-label sentence the engine returns ends by naming it', 'NAMED ONLY: no sentence of it is quoted, and the prms course of this academy teaches it'],
];
table(['text', 'edition or date', 'licence', 'what the course reads from it', 'how the course uses it', 'date read'], SOURCES.map((r) => [...r, '2026-09-27']));
w();
must('FINDINGS records every source as read on 2026-09-27', FINDINGS.includes('## Sources (all read 2026-09-27)'), 'read date');
[['e35603eced0ed4d1', 'Harris 1913'], ['c94b17784aa94fde', 'lecture 8'], ['993304c0da666374', 'lecture 7'], ['33ddb6947f1ec82e', 'lecture 11'], ['ffe9d2584425a995', 'lecture 12'], ['cfe0f8613b794689', 'lecture 13'], ['cbdf8cf7c06008ae', 'the lecture-notes index page'], ['9de2ee2e13bea72c', 'MIL-HDBK-338B p. 5-27']]
  .forEach(([h, what]) => must(`FINDINGS records the sha256 prefix of ${what}`, FINDINGS.includes(h), h));
must('FINDINGS-prms.md records SPE-PRMS 2018 read on 2026-09-27 under CC BY-NC-ND 4.0', FINDINGS_PRMS.includes('2026-09-27') && FINDINGS_PRMS.includes('CC BY-NC-ND 4.0'), 'prms');
w('The validation record, FINDINGS-inventory.md (engines PRs #281 and #283), lists the same texts with the sha256 of each file read, its URL and its licence, and this digest was checked against it when built. SPE-PRMS 2018 was read on 2026-09-27 for the prms course (its record, FINDINGS-prms.md, is vendored beside it) and is used here for nothing but its name. The record says what was not used, verbatim:');
const NOTUSED = FINDINGS.match(/Not used: Silver, Pyke and Thomas \(4th ed\., CRC 2017\) and Nahmias are not publicly readable, so not read or cited\./);
must('FINDINGS records the textbooks not used', !!NOTUSED, 'not used');
quote(NOTUSED ? NOTUSED[0] : '');
w();
w('NOT USED, and said plainly. The two textbooks the record names were not read, so the course cites neither. No licensed maintenance or reliability standard was read, so the course names none: criticality criteria and weights are the user\'s stated policy, and the course names VED (vital, essential, desirable) only as one such scheme, in its own words.');
w();
w('THE LECTURES ARE CITED, NEVER REPRODUCED. The lead\'s decision is recorded in FINDINGS-inventory.md, and this digest follows it: a lesson cites a lecture figure with its lecture and slide number, works it through the course\'s own panel and never copies a slide, a slide title or a sentence of slide text. The record\'s own words, verbatim:');
const OCWRULE = FINDINGS.match(/MIT OpenCourseWare is CC BY-NC-SA 4\.0 and NextGen is a paid product: the course cites the Caplice figures with lecture and slide numbers and never reproduces slides or slide text\./);
must('FINDINGS records the lead decision on the lectures', !!OCWRULE, 'ocw');
quote(OCWRULE ? OCWRULE[0] : '');
w();
w('The engine carries its citations in its own words. The `basis` of one call of each function, verbatim:');
w();
const bC = success('criticality on the fixture', E.criticality(critArgs())).basis;
const bA = success('abcClassification on the fixture', E.abcClassification(abcArgs('at-or-below'))).basis;
const bE = runG('eoq-ekene-baryte').basis;
const bQa = runG('qd-ekene-casing').basis;
const bQi = runG('qd-ekene-casing-incremental').basis;
const bS = runG('ss-ekene-choke-beans').basis;
const bP = runG('ps-ekene-psv-kits').basis;
const bI = runG('ins-ekene-esp-motor').basis;
const bL = runG('ltr-ekene-mech-seal').basis;
const bM = success('slowMoving on the fixture', E.slowMoving(smArgs())).basis;
const BASES = [
  ['criticality (fixture)', 'source', bC.source], ['abcClassification (fixture)', 'source', bA.source],
  ['eoq (eoq-ekene-baryte)', 'source', bE.source], ['quantityDiscount (qd-ekene-casing)', 'source', bQa.source], ['quantityDiscount (qd-ekene-casing-incremental)', 'source', bQi.source],
  ['safetyStock (ss-ekene-choke-beans)', 'source', bS.source], ['safetyStock (ss-ekene-choke-beans)', 'numerics', bS.numerics],
  ['poissonStock (ps-ekene-psv-kits)', 'source', bP.source], ['insuranceSpares (ins-ekene-esp-motor)', 'source', bI.source],
  ['leadTimeRisk (ltr-ekene-mech-seal)', 'sampling', bL.sampling], ['slowMoving (fixture)', 'source', bM.source],
];
table(['call', 'basis key', 'the engine\'s basis, verbatim'], BASES);
must('every basis the table prints is a non-empty string', BASES.every((r) => typeof r[2] === 'string' && r[2].length > 10), 'basis');

/* ============================================================ SECTION 3 */

section('provisions', 'The public-domain sentences this course quotes, verbatim, with their citations', ['Associate m04 l02', 'Expert m02 l01']);
w(`Each sentence below is quoted exactly from a public-domain text named in ${ref('sources')}, with whitespace collapsed. Each is preceded by the course's plain paraphrase. A figure or a spelling the text prints is quoted as printed.`);
const GROUPS = [['HARRIS', 'HARRIS (1913), THE 1913 WORDS'], ['MIL', 'MIL-HDBK-338B (1 OCTOBER 1998)']];
GROUPS.forEach(([t, title]) => {
  w();
  w(`${title}:`);
  CONCEPTS.filter((c) => c.text === t).forEach((c) => { w(); cq(c.id); });
});
must('every concept belongs to one printed group', CONCEPTS.every((c) => GROUPS.some(([t]) => t === c.text)), 'groups');
w();
w(`${CONCEPTS.length} sentences quoted: ${list(GROUPS.map(([t]) => `${t === 'HARRIS' ? 'Harris' : 'MIL-HDBK-338B'} ${CONCEPTS.filter((c) => c.text === t).length}`))}. The MIT OpenCourseWare lectures are not in this list: none of them is quoted.`);

/* ============================================================ SECTION 4 */

section('published', 'The published checks the engine reproduces', ['Associate m04 l05', 'Professional m01 l03', 'Professional m03 l04', 'Professional m05 l02', 'Professional m06 l02', 'Expert m02 l01']);
w(`Each printed figure below is cited as its text prints it (text); every other number is the engine's on the golden input named. quote_check.py checks that each text prints each figure cited here. Two printed figures are slips, and ${ref('slips')} gives each with the rule's own figure.`);
w();
// HARRIS
const h1 = runG('harris-1913-example');
const h2 = runG('harris-1913-connector');
const h3 = runG('harris-1913-stud');
const h4 = runG('harris-1913-stud-say-49');
w('CHECK ONE: HARRIS (1913), THREE LOTS. Harris writes the lot as the square root of 240 M S / C, with M the monthly movement, S the set-up cost and C the unit cost, and ten per cent a year for interest and depreciation. The golden inputs read his figures as annual demand 12 M, order cost S, unit cost C and a holding rate of 0.1:');
w();
table(['golden input', 'annual demand', 'order cost', 'unit cost', 'holding rate', 'EOQ (engine)', 'Harris prints (text)'], [
  ['harris-1913-example', S(argsOf('harris-1913-example').annualDemand), S(argsOf('harris-1913-example').orderCost), S(argsOf('harris-1913-example').unitCost), S(argsOf('harris-1913-example').holdingRate), f6(h1.eoq), TEXT.harris.lot1],
  ['harris-1913-connector (his Figure II)', S(argsOf('harris-1913-connector').annualDemand), S(argsOf('harris-1913-connector').orderCost), S(argsOf('harris-1913-connector').unitCost), S(argsOf('harris-1913-connector').holdingRate), f6(h2.eoq), TEXT.harris.lot2],
  ['harris-1913-stud (his Figure III)', S(argsOf('harris-1913-stud').annualDemand), S(argsOf('harris-1913-stud').orderCost), S(argsOf('harris-1913-stud').unitCost), S(argsOf('harris-1913-stud').holdingRate), f6(h3.eoq), TEXT.harris.lot3],
]);
must('Harris: the engine lots truncate to his printed figures (2190, 6856 printed 6,850, 48.5)', Math.floor(h1.eoq) === 2190 && Math.floor(h2.eoq / 10) * 10 === 6850 && Math.floor(h3.eoq * 10) / 10 === 48.5, `${h1.eoq} ${h2.eoq} ${h3.eoq}`);
w();
w(`Harris prints each lot short of the formula's figure: the engine's ${f6(h1.eoq)} is printed ${TEXT.harris.lot1}, ${f6(h2.eoq)} is printed ${TEXT.harris.lot2} and ${f6(h3.eoq)} is printed ${TEXT.harris.lot3}. He then says "or, say, ${TEXT.harris.say}" for the stud: the same call with the stated rule nearest multiple of 1 (golden input harris-1913-stud-say-49) orders ${f6(h4.quantity)} (engine). The engine's reason, verbatim:`);
must('Harris stud: nearest 1 gives 49', h4.quantity === 49, h4.quantity);
quote(h4.reason);
w();
// CAPLICE L8 SLIDE 9
const e9 = runG('caplice-l8-eoq');
const a9 = argsOf('caplice-l8-eoq');
w(`CHECK TWO: CAPLICE LECTURE 8 SLIDE 9, THE EOQ AT ONE LOCATION. The slide states an order cost of ${S(a9.orderCost)}, a demand of ${S(a9.annualDemand)} a year, a holding rate of ${S(a9.holdingRate)} and a unit cost of ${S(a9.unitCost)} (golden input caplice-l8-eoq), and prints an order size of ${TEXT.l8s9.q}, an order cost of ${TEXT.l8s9.order}, a holding cost of ${TEXT.l8s9.hold} and a total of ${TEXT.l8s9.total} (text). The engine returns an EOQ of ${f6(e9.eoq)}, ordering cost ${f6(e9.orderingCost)}, holding cost ${f6(e9.holdingCost)} and relevant cost ${f6(e9.relevantCost)}.`);
must('Caplice L8 slide 9: 400, 2500, 2500, 5000 exactly', e9.eoq === 400 && e9.orderingCost === 2500 && e9.holdingCost === 2500 && e9.relevantCost === 5000, `${e9.eoq} ${e9.relevantCost}`);
w();
// CAPLICE L8 SLIDE 15 INCREMENTAL
const i15 = runG('caplice-l8-incremental');
const a15 = argsOf('caplice-l8-incremental');
w(`CHECK THREE: CAPLICE LECTURE 8 SLIDES 13 TO 15, AN INCREMENTAL DISCOUNT. The same demand, order cost and holding rate with a price of ${S(a15.breaks[0].unitPrice)} below ${S(a15.breaks[1].minQuantity)}, ${S(a15.breaks[1].unitPrice)} from ${S(a15.breaks[1].minQuantity)} and ${S(a15.breaks[2].unitPrice)} from ${S(a15.breaks[2].minQuantity)}, each unit priced by its own band, rounded to the nearest whole unit (golden input caplice-l8-incremental):`);
w();
table(['band', 'price', 'fixed cost Fi (engine)', 'Fi printed (text)', 'EOQ (engine)', 'EOQ printed (text)', 'candidate', 'total cost (engine)'], i15.candidates.map((c, i) => [S(c.band), S(c.unitPrice), f6(c.fixedCost), i === 0 ? '0' : i === 1 ? TEXT.l8s15.f1 : TEXT.l8s15.f2, f6(c.eoq), i === 0 ? TEXT.l8s15.eoq0 : i === 1 ? TEXT.l8s15.eoq1 : TEXT.l8s15.eoq2, c.feasible ? f6(c.quantity) : 'none', c.feasible ? f6(c.totalCost) : 'none']));
must('Caplice L8 slide 15: F 2500 and 7500; band 1 gives no candidate; 1789 wins', i15.candidates[1].fixedCost === 2500 && i15.candidates[2].fixedCost === 7500 && !i15.candidates[1].feasible && i15.quantity === 1789, `${i15.quantity}`);
const w15 = i15.candidates[2];
w();
w(`At ${f6(i15.quantity)} the engine gives an effective unit price of ${f6(w15.effectiveUnitPrice)}, a purchase cost of ${f6(w15.purchaseCost)}, ordering ${f6(w15.orderingCost)}, holding ${f6(w15.holdingCost)} and a total of ${f6(w15.totalCost)} a year, against ${f6(i15.candidates[0].totalCost)} for band 0. The slide prints ${TEXT.l8s15.price}, ${TEXT.l8s15.purchase}, ${TEXT.l8s15.order}, ${TEXT.l8s15.hold}, ${TEXT.l8s15.total} and ${TEXT.l8s15.base} (text): it rounds each line, and its total is the sum of rounded lines.`);
must('the slide total 98,825 lies below the engine total by between 1 and 2', w15.totalCost - 98825 > 1 && w15.totalCost - 98825 < 2, w15.totalCost);
must('band 0 costs 105000 exactly', i15.candidates[0].totalCost === 105000, i15.candidates[0].totalCost);
w();
const au = runG('caplice-l8-all-units-2pct');
w(`CHECK FOUR: CAPLICE LECTURE 8 SLIDE 12, AN ALL-UNITS DISCOUNT STATED WITHOUT AN ANSWER. The slide states two per cent off the whole lot from ${S(argsOf('caplice-l8-all-units-2pct').breaks[1].minQuantity)} units on the same data and prints no answer. The engine (golden input caplice-l8-all-units-2pct) orders ${f6(au.quantity)} at a total cost of ${f6(au.totalCost)} a year, against ${f6(au.candidates[0].totalCost)} at the band 0 EOQ of ${f6(au.candidates[0].quantity)}. The engine's reason, verbatim:`);
must('Caplice L8 slide 12: 500 at 103062.5 against 400 at 105000', au.quantity === 500 && au.totalCost === 103062.5 && au.candidates[0].totalCost === 105000, au.totalCost);
quote(au.reason);
w();
// CAPLICE L11 SLIDE 24
const cslIds = ['99', '95', '90', '80'];
const csl = cslIds.map((p) => [runG(`caplice-l11-csl-${p}`), runG(`caplice-l11-csl-${p}-exact`)]);
const a11 = argsOf('caplice-l11-csl-95');
w(`CHECK FIVE: CAPLICE LECTURE 11 SLIDES 18 TO 24, SAFETY STOCK AT A CYCLE SERVICE LEVEL. The slides state a demand of ${TEXT.l11s24.demand} units a year, normally distributed, a lead time of two weeks, a forecast error (RMSE) of ${TEXT.l11s24.rmse} units a year and an EOQ of ${TEXT.l11s24.eoq} (text). The golden inputs read them in weeks: a demand of ${f6(a11.demandMean)} a week with a standard deviation of ${f6(a11.demandSd)} a week (the RMSE over the square root of 52), a lead time of ${S(a11.leadTime)} weeks with no spread, and an order quantity of ${S(a11.orderQuantity)}. Slide 24 prints the safety stock for four cycle service levels (text); the golden inputs read the safety factor from a table to 2 decimals and hold the level to the nearest unit, as the slide does, and the exact rule reads neither:`);
w();
table(['cycle service level', 'safety factor read to 2 decimals', 'safety stock, table reading (derived: the held level less the demand over the lead time)', 'held level (engine)', 'printed (text)', 'safety stock, exact k (engine)'], cslIds.map((p, i) => [`0.${p}`, S(csl[i][0].safetyFactor), f6(csl[i][0].levelRounded - csl[i][0].demandOverProtection), f6(csl[i][0].levelRounded), TEXT.l11s24.csl[i], f6(csl[i][1].safetyStock)]));
must('Caplice L11 slide 24 CSL column: held level minus 500 equals 601, 423, 330, 217', csl.map(([r]) => r.levelRounded - r.demandOverProtection).join() === '601,423,330,217', csl.map(([r]) => r.levelRounded).join());
must('the demand over the protection period is 500 and sigma rounds to 258', csl[0][0].demandOverProtection === 500 && Math.round(csl[0][0].sigma) === 258, csl[0][0].sigma);
w();
w(`Over the two weeks the demand is ${f6(csl[0][0].demandOverProtection)} with a sigma of ${f6(csl[0][0].sigma)} (engine). The table reading reproduces all four printed figures; the exact safety factor does not, which is why the course states the rule a figure was read with.`);
w();
const ifrIds = ['99', '95', '90', '80'];
const ifr = ifrIds.map((p) => runG(`caplice-l11-ifr-${p}`));
w('THE FILL-RATE COLUMN OF THE SAME SLIDE, on the same inputs with the item fill rate as the service measure (golden inputs caplice-l11-ifr-99, -95, -90 and -80):');
w();
table(['item fill rate', 'safety factor (engine)', 'safety stock (engine)', 'printed (text)', 'printed less the engine (derived)'], ifrIds.map((p, i) => [`0.${p}`, f6(ifr[i].safetyFactorExact), f6(ifr[i].safetyStock), TEXT.l11s24.ifr[i], f6(Number(TEXT.l11s24.ifr[i]) - ifr[i].safetyStock)]));
must('three of the four fill-rate figures lie within 2 units of the print, and the 0.95 row does not', [0, 2, 3].every((i) => Math.abs(Number(TEXT.l11s24.ifr[i]) - ifr[i].safetyStock) < 2) && Math.abs(348 - ifr[1].safetyStock) > 8, ifr.map((r) => r.safetyStock).join());
w();
w(`Three rows agree with the slide to within 2 units. The 0.95 row is a slip: ${ref('slips')}.`);
w();
// CAPLICE L12 SLIDE 6
const r12 = runG('caplice-l12-periodic-rs');
const a12 = argsOf('caplice-l12-periodic-rs');
w(`CHECK SIX: CAPLICE LECTURE 12 SLIDES 5 AND 6, PERIODIC REVIEW. The same weekly demand with a review period of ${S(a12.reviewPeriod)} weeks, an item fill rate of ${S(a12.serviceLevel)} and an order quantity of ${S(a12.orderQuantity)} (the demand over one review period), the safety factor read to 2 decimals and the level held to the nearest unit (golden input caplice-l12-periodic-rs). The slide prints a sigma of ${TEXT.l12s6.sigma}, a loss target of ${TEXT.l12s6.g}, a safety factor of ${TEXT.l12s6.k} and an order-up-to level of ${TEXT.l12s6.s} (text). The engine:`);
w();
table(['figure', 'engine', 'printed (text)'], [
  ['protection period, weeks', S(r12.protectionPeriod), 'none'], ['demand over it', f6(r12.demandOverProtection), 'none'], ['sigma', f6(r12.sigma), TEXT.l12s6.sigma],
  ['safety factor, exact', f6(r12.safetyFactorExact), 'none'], ['safety factor as read', S(r12.safetyFactor), TEXT.l12s6.k], ['order-up-to level', f6(r12.level), 'none'], ['held as', f6(r12.levelRounded), TEXT.l12s6.s],
]);
must('Caplice L12: k read 0.58 and S held 2835', r12.safetyFactor === 0.58 && r12.levelRounded === 2835 && Math.round(r12.sigma) === 577, `${r12.safetyFactor} ${r12.levelRounded}`);
w();
w('The engine\'s reason, verbatim (it prints the loss target the slide rounds):');
quote(r12.reason);
w();
// CAPLICE L13 POISSON
const p13 = runG('caplice-l13-poisson-fill');
const t13 = runG('caplice-l13-poisson-table');
const a13 = argsOf('caplice-l13-poisson-fill');
w(`CHECK SEVEN: CAPLICE LECTURE 13 SLIDES 11 AND 12, POISSON DEMAND FOR A SLOW MOVER. A demand of ${S(a13.demandRate)} a week, Poisson, reviewed every week with no lead time, an item fill rate of ${S(a13.serviceLevel)} and an order quantity of ${S(a13.orderQuantity)} (the mean demand a review), so the units short a cycle may be at most ${TEXT.l13s12.eus} (golden input caplice-l13-poisson-fill). The slide prints a level of ${TEXT.l13s12.level} (text); the engine gives ${S(p13.level)}. The table, with the slide's figures beside the engine's (golden input caplice-l13-poisson-table carries the rows to 4):`);
w();
table(['level', 'probability (engine)', 'printed (text)', 'cumulative (engine)', 'printed (text)', 'expected units short beyond the level (engine)', 'printed (text)'], [0, 1, 2, 3, 4].map((x) => [S(x), f6(t13.rows[x].probability), x < 3 ? TEXT.l13s12.p[x] : 'not cited', f6(t13.rows[x].cumulative), TEXT.l13s12.f[x], f6(t13.rows[x].expectedShort), TEXT.l13s12.l[x]]));
must('Caplice L13: level 2 met at L(2) 0.058121 against 0.08', p13.level === 2 && Math.abs(p13.expectedShortPerCycle - 0.058121) < 1e-6, p13.expectedShortPerCycle);
must('the table rows run to level 4 at least', t13.rows.length >= 5, t13.rows.length);
w();
w(`Levels 0 to 3 agree with the slide at the precision it prints. The loss at level 4 is a slip: ${ref('slips')}. The engine's reason for level 2, verbatim:`);
quote(p13.reason);
w();
// MIL-HDBK-338B
const mil = runG('mil-hdbk-338b-lamps');
const aMil = argsOf('mil-hdbk-338b-lamps');
w(`CHECK EIGHT: MIL-HDBK-338B EXAMPLE 5.3.8.1, TWO SPARE LAMPS. A failure rate of ${S(aMil.demandRate)} an hour over ${S(aMil.leadTime)} hours (golden input mil-hdbk-338b-lamps) is a Poisson mean of ${f6(mil.mean)}, and the chance of two failures or fewer is ${f6(mil.rows[2].cumulative)} (engine); the handbook prints ${TEXT.mil.r} (text). The same mean as orders outstanding in insurance spares is in ${ref('anchor')}.`);
must('MIL-HDBK-338B: P(X <= 2) at mean 0.5 rounds to 0.986', mil.mean === 0.5 && Math.round(mil.rows[2].cumulative * 1000) === 986, mil.rows[2].cumulative);

/* ============================================================ SECTION 5 */

section('slips', 'Two printed figures that are slips, each with the rule\'s own figure', ['Professional m04 l04', 'Professional m06 l04', 'Expert m05 l04']);
w('PRINTED ALIKE IS NOT EQUAL, AND PRINTED IS NOT ALWAYS RIGHT. A printed table is a reading of a rule at some precision, and it can carry a slip. The course keeps each printed figure beside the rule\'s own figure and teaches the difference; it never changes the rule to match a print.');
w();
const slip1 = GC['caplice-l11-ifr-95'].published.discrepancies[0];
must('the golden pins the lecture 11 slip as a discrepancy', slip1 && slip1.printed === 348, JSON.stringify(slip1));
w(`SLIP ONE: CAPLICE LECTURE 11 SLIDE 24, THE ITEM FILL RATE OF 0.95. The slide prints a safety stock of ${TEXT.l11s24.ifr[1]} (text). The fill-rate rule on the same inputs (golden input caplice-l11-ifr-95) needs a loss of at most the order quantity times one less the fill rate over sigma, which gives a safety factor of ${f6(ifr[1].safetyFactorExact)} and a safety stock of ${f6(ifr[1].safetyStock)} (engine), ${f6(348 - ifr[1].safetyStock)} below the print (derived). The other three rows of the column agree to within 2 units (${ref('published')}). The engine's reason, verbatim:`);
quote(ifr[1].reason);
w();
w(`At the engine's safety stock the achieved fill rate is ${f6(ifr[1].achievedFillRate)} and the expected units short a cycle are ${f6(ifr[1].expectedShortPerCycle)} (engine): the rule meets its target exactly.`);
must('the rule meets the 0.95 fill rate at 339.18', Math.abs(ifr[1].achievedFillRate - 0.95) < 1e-12 && Math.abs(ifr[1].safetyStock - 339.18) < 0.01, ifr[1].achievedFillRate);
w();
const slip2 = GC['caplice-l13-poisson-table'];
w(`SLIP TWO: CAPLICE LECTURE 13 SLIDE 12, THE LOSS AT LEVEL 4. The slide prints the expected units short beyond level 4 as ${TEXT.l13s12.l[4]} (text). The recursion the same slide states, the loss at one level less one less the cumulative probability at the level below, gives ${f6(t13.rows[4].expectedShort)} (engine, golden input caplice-l13-poisson-table). The loss at level 3 is ${f6(t13.rows[3].expectedShort)} and the cumulative probability at 3 is ${f6(t13.rows[3].cumulative)}, so ${f6(t13.rows[3].expectedShort)} less (1 less ${f6(t13.rows[3].cumulative)}) is ${f6(t13.rows[3].expectedShort - (1 - t13.rows[3].cumulative))} (derived), the engine's figure at six decimals. The printed ${TEXT.l13s12.l[4]} is not the recursion's figure at any precision the slide uses.`);
must('the level-4 loss is 0.001619 at six decimals and the recursion reproduces it', f6(t13.rows[4].expectedShort) === '0.001619' && f6(t13.rows[3].expectedShort - (1 - t13.rows[3].cumulative)) === f6(t13.rows[4].expectedShort), t13.rows[4].expectedShort);
must('the recursion figure at level 4 rounds to 0.002 at three decimals, so the print 0.009 is not it', Math.round(t13.rows[4].expectedShort * 1000) === 2, t13.rows[4].expectedShort);
must('the golden file pins the level-4 loss as a slip', JSON.stringify(slip2.published || {}).includes('0.009'), 'pinned');

/* ============================================================ SECTION 6 */

section('dataset', 'The Ekene materials register and its stated policy', ['Associate m01 l03', 'Associate m01 l04', 'Professional m02 l04', 'Expert m01 l05', 'Expert m04 l03']);
must('the fixture is labelled synthetic', /^SYNTHETIC/.test(FX.synthetic) && /synthetic/.test(FXREADME), FX.synthetic);
w(`The fixture: ${FX.title}, written by ${FX.generatedBy}, money in ${FX.currency}. Its own label, verbatim:`);
quote(FX.synthetic);
w();
w(`${FX.items.length} stock items (fixture). Scores run from 1 to ${S(POL.criticality.scoreMax)} on each of the four criteria; usage is a year; months since the last issue and monthly usage are stated.`);
w();
table(['id', 'name', 'annual usage', 'unit cost', 'safety', 'production', 'lead time', 'redundancy', 'on hand', 'months since last issue', 'monthly usage'],
  FX.items.map((it) => [it.id, it.name, S(it.annualUsage), S(it.unitCost), S(it.scores.safety), S(it.scores.production), S(it.scores.leadTime), S(it.scores.redundancy), S(it.onHand), S(it.monthsSinceLastIssue), S(it.monthlyUsage)]));
must('eighteen items', FX.items.length === 18, FX.items.length);
w();
w('THE STATED POLICY (fixture):');
w(`- Criticality: ${list(POL.criticality.criteria.map((c) => `${c.id} weight ${S(c.weight)} (${c.label})`))}; scores out of ${S(POL.criticality.scoreMax)}; classes ${list(POL.criticality.classes.map((c) => `${c.label} from ${S(c.minScore)}`))}; a maximum score on ${list(POL.criticality.topClassOnMaxScore)} places an item in class ${POL.criticality.classes[0].label}.`);
w(`- ABC: A to ${S(POL.abc.cutoffs.aPct)} percent of annual usage value, B to ${S(POL.abc.cutoffs.bPct)} percent, the rule ${POL.abc.boundaryRule}.`);
w(`- Slow-moving: ${list(POL.slowMoving.bands.map((b) => `${b.label} from ${S(b.minMonths)} months, written down ${S(b.writeDownPct)} percent`))}; excess above ${S(POL.slowMoving.excessCoverMonths)} months of cover.`);
w();
w('THE STATED CASES (fixture), one for each costing function, each named by the item it belongs to:');
w();
table(['function', 'item', 'stated inputs', 'the fixture\'s note'], Object.entries(FX.cases).map(([k, v]) => [k, v.item, JSON.stringify(caseArgs(k)).replace(/"/g, ''), v.note || 'none']));
must('six stated cases', Object.keys(FX.cases).length === 6, Object.keys(FX.cases).join());
w();
w('WHAT THE REGISTER PLANTS, each one computed in the section named:');
const critFx = success('criticality on the fixture', E.criticality(critArgs()));
const cf = Object.fromEntries(critFx.items.map((x) => [x.id, x]));
const abcFx = success('abcClassification at-or-below on the fixture', E.abcClassification(abcArgs('at-or-below')));
const abcX = success('abcClassification include-crossing on the fixture', E.abcClassification(abcArgs('include-crossing')));
const af = Object.fromEntries(abcFx.items.map((x) => [x.id, x]));
const ax = Object.fromEntries(abcX.items.map((x) => [x.id, x]));
const smFx = success('slowMoving on the fixture', E.slowMoving(smArgs()));
const sf = Object.fromEntries(smFx.items.map((x) => [x.id, x]));
w(`- PSV-KIT scores the maximum on safety: class ${cf['PSV-KIT'].class} with a weighted score of ${f6(cf['PSV-KIT'].weightedScore)}, which alone gives class E (${ref('criticality')}).`);
w(`- MECH-SEAL scores ${f6(cf['MECH-SEAL'].weightedScore)}, exactly the V minimum, and is class ${cf['MECH-SEAL'].class}; GASKET-RJ scores ${f6(cf['GASKET-RJ'].weightedScore)}, exactly the E minimum, and is class ${cf['GASKET-RJ'].class} (${ref('criticality')}).`);
w(`- CEM-G is the item whose cumulative share crosses ${S(POL.abc.cutoffs.aPct)} percent (${f6(af['CEM-G'].cumulativePct)} with it): class ${af['CEM-G'].class} under at-or-below and ${ax['CEM-G'].class} under include-crossing (${ref('abc')}).`);
w(`- CEM-G has gone ${S(byId['CEM-G'].monthsSinceLastIssue)} months without an issue and is band ${sf['CEM-G'].band}; GASKET-RJ ${S(byId['GASKET-RJ'].monthsSinceLastIssue)} months, band ${sf['GASKET-RJ'].band}; HEAT-TRC ${S(byId['HEAT-TRC'].monthsSinceLastIssue)} months with no usage, band ${sf['HEAT-TRC'].band}, all of it excess; ORING-KIT holds ${f6(sf['ORING-KIT'].coverMonths)} months of cover (${ref('slowmoving')}).`);
w(`- The ESP motor is the insurance spare (${ref('insurance')}); the choke bean set carries the normal safety stock (${ref('protection')}); the PSV kit the Poisson stock (${ref('poisson')}); the mechanical seal the lead-time risk (${ref('montecarlo')}); the casing the quantity discount (${ref('discounts')}); the baryte the EOQ (${ref('eoq')}).`);
must('the planted situations hold', cf['PSV-KIT'].class === 'V' && cf['PSV-KIT'].forcedBy.join() === 'safety' && cf['PSV-KIT'].weightedScore === 68 && cf['MECH-SEAL'].weightedScore === 70 && cf['MECH-SEAL'].class === 'V'
  && cf['GASKET-RJ'].weightedScore === 44 && cf['GASKET-RJ'].class === 'E' && af['CEM-G'].class === 'B' && ax['CEM-G'].class === 'A'
  && sf['CEM-G'].band === 'slow' && sf['GASKET-RJ'].band === 'very slow' && sf['HEAT-TRC'].band === 'obsolete' && sf['HEAT-TRC'].excess && sf['ORING-KIT'].coverMonths === 80, 'planted');

/* ============================================================ SECTION 7 */

section('planner', 'The calculator panels and the Materials & Spares Planner', ['Associate m01 l05', 'Professional m01 l01', 'Expert m01 l01']);
w('WHERE THE PRACTICALS RUN. This is an app course. The Suite app is the Materials & Spares Planner, in the Suite\'s Midstream & Downstream module (route /dashboard/apps/midstream-downstream/materials-spares-planner), which vendors this same engine. The course also carries three calculator panels that call this same vendored engine inside the course, so every exercise can be done without a Suite seat:');
w();
table(['panel', 'tier', 'functions it calls'], [
  ['the register calculator (materials-register-calculator)', 'Associate', 'criticality, abcClassification, eoq, slowMoving'],
  ['the stock calculator (materials-stock-calculator)', 'Professional', 'quantityDiscount, safetyStock, poissonStock'],
  ['the spares calculator (materials-spares-calculator)', 'Expert', 'insuranceSpares, poissonStock, leadTimeRisk'],
]);
w();
w('Each panel shows a visible control for every input its call needs, starts from a stated case the learner chooses (the Ekene register\'s own cases, or a blank case with every input set to not stated), prints what the engine returns with the reason beside each figure, and prints every refusal in the engine\'s own words. The spares calculator labels its Monte Carlo figures as never graded and shows their seed and draw count.');
w();
w('THE SAME ENGINE IN BOTH PLACES. A figure worked in a panel and the same inputs typed into the Materials & Spares Planner come from the same engine file. Where a lesson says "open the Planner", a learner without a Suite seat uses the panel the lesson names.');

/* ============================================================ SECTION 8 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m04', 'Professional m01', 'Professional m02', 'Professional m06', 'Expert m01', 'Expert m03', 'Expert m06']);
w('A refusal is an object with `error` and `field`. The message starts with the name of the field it refuses and states the exact condition that failed: "<field> must <condition>; got <value>", the value as the engine prints it (an absent value prints as undefined), or, for an unknown key, "<field> is not an accepted key; the accepted keys ... are ...". Each row below is a stated bad input from the golden file handed to the engine; the message is the engine\'s, verbatim. A result returned with a reason (an item below a class minimum, a stock of spares at the search limit, a stockout in some draws) is a result. It is no refusal.');
w();
const REF = GOLD.cases.filter(isRefusalCase);
const REFUSED = REF.map((c) => {
  const r = refusal(`${c.fn} on the golden input ${c.id}`, E[c.fn](clone(c.args)), c.expected.field);
  must(`the engine's message is the golden message: ${c.id}`, r && r.error === c.expected.message, r && r.error);
  return [`\`${c.fn}\``, c.id, `\`${c.expected.field}\``, r.error];
});
// A message that carries a pipe character is printed below the table as a
// quotation, so it reads exactly as the engine writes it.
const PIPED = REFUSED.filter((r) => r[3].includes('|'));
table(['function', 'golden case', 'field', 'the engine\'s message, verbatim'], REFUSED.map((r) => (r[3].includes('|') ? [...r.slice(0, 3), 'printed below this table as a quotation, because it carries the character |'] : r)));
if (PIPED.length) {
  w();
  w('The messages that carry the character |, verbatim:');
  PIPED.forEach((r) => quote(`${r[1]}: ${r[3]}`));
}
const byFn = {};
REF.forEach((c) => { byFn[c.fn] = (byFn[c.fn] || 0) + 1; });
w();
w(`${REF.length} refusals across ${Object.keys(byFn).length} functions: ${list(Object.entries(byFn).map(([k, v]) => `${k} ${v}`))}.`);
must('every exported function has at least one refusal tabled', EXPORTS.every(([n]) => byFn[n] > 0), JSON.stringify(byFn));
must('no refusal message carries an em or en dash', REFUSED.every((r) => !/[–—]/.test(r[3])), 'dash');
must('eighty-nine refusal cases in the golden file', REF.length === 89, REF.length);
must('the only refusal messages with a pipe are the rounding-rule ones, printed as quotations', PIPED.length >= 1 && PIPED.every((r) => /rounding must be a stated rounding rule/.test(r[3])), PIPED.map((r) => r[1]).join());
w();
w('MORE REFUSALS, EACH A STATED PROBE. The calls below are not golden cases; each is a golden input with one input removed or changed (stated), handed to the engine here, and the message is the engine\'s, verbatim. Together with the table above they reach every refusal a call can produce (the count below says how many places in the source that is):');
w();
const dropAt = (o, path) => { const ks = path.split('.'); let t = o; ks.slice(0, -1).forEach((k) => { t = t[k]; }); delete t[ks[ks.length - 1]]; return o; };
const setAt = (path, v) => (o) => { const ks = path.split('.'); let t = o; ks.slice(0, -1).forEach((k) => { t = t[k]; }); t[ks[ks.length - 1]] = v; return o; };
const PROBES = [
  // [base golden id or 'fixture:crit' etc, what, fn(args) -> args, field]
  ['crit-ekene', 'criteria set to an empty list', setAt('criteria', []), 'criteria'],
  ['crit-ekene', 'twenty-one criteria', (a) => { a.criteria = Array.from({ length: 21 }, (_, i) => ({ id: `c${i}`, weight: 100 / 21 })); return a; }, 'criteria'],
  ['crit-ekene', 'criteria[0] set to a string', setAt('criteria.0', 'safety'), 'criteria[0]'],
  ['crit-ekene', 'criteria[0].id set to an empty string', setAt('criteria.0.id', ''), 'criteria[0].id'],
  ['crit-ekene', 'classes with eleven entries', (a) => { a.classes = Array.from({ length: 11 }, (_, i) => ({ label: `K${i}`, minScore: 100 - i * 10 })); return a; }, 'classes'],
  ['crit-ekene', 'classes[0].label removed', (a) => dropAt(a, 'classes.0.label'), 'classes[0].label'],
  ['crit-ekene', 'classes[0].minScore set to 101', setAt('classes.0.minScore', 101), 'classes[0].minScore'],
  ['crit-ekene', 'items[0].scores removed', (a) => dropAt(a, 'items.0.scores'), 'items[0].scores'],
  ['abc-ekene-at-or-below', 'items set to an empty list', setAt('items', []), 'items'],
  ['abc-ekene-at-or-below', 'items[0].unitCost set to -1', setAt('items.0.unitCost', -1), 'items[0].unitCost'],
  ['eoq-ekene-baryte', 'holdingRate removed and holdingCostPerUnitYear set to 0', (a) => { delete a.holdingRate; delete a.unitCost; a.holdingCostPerUnitYear = 0; return a; }, 'holdingCostPerUnitYear'],
  ['eoq-ekene-baryte', 'holdingRate set to 0', setAt('holdingRate', 0), 'holdingRate'],
  ['eoq-ekene-baryte', 'unitCost set to 0', setAt('unitCost', 0), 'unitCost'],
  ['eoq-holding-direct-with-price', 'unitCost set to -1 beside a stated holding cost', setAt('unitCost', -1), 'unitCost'],
  ['qd-ekene-casing', 'twenty-one price bands', (a) => { a.breaks = Array.from({ length: 21 }, (_, i) => ({ minQuantity: i * 10, unitPrice: 100 - i })); return a; }, 'breaks'],
  ['qd-ekene-casing', 'breaks[1] set to a number', setAt('breaks.1', 5), 'breaks[1]'],
  ['qd-ekene-casing', 'breaks[1].unitPrice set to 0', setAt('breaks.1.unitPrice', 0), 'breaks[1].unitPrice'],
  ['qd-ekene-casing', 'replaced by a two-band schedule (prices 1 and 0.5, the break at 100) with a demand, order cost and holding rate of 1 each, rounded down to a multiple of 100', (a) => ({ ...a, annualDemand: 1, orderCost: 1, holdingRate: 1, breaks: [{ minQuantity: 0, unitPrice: 1 }, { minQuantity: 100, unitPrice: 0.5 }], rounding: { rule: 'down', multiple: 100 } }), 'rounding'],
  ['ss-ekene-choke-beans', 'safetyFactorRounding set to nearest with no decimals', setAt('safetyFactorRounding', { rule: 'nearest' }), 'safetyFactorRounding.decimals'],
  ['ss-ekene-choke-beans', 'rounding removed (the rounding control set to not stated)', (a) => dropAt(a, 'rounding'), 'rounding'],
  ['ps-ekene-psv-kits', 'orderQuantity set to 0', setAt('orderQuantity', 0), 'orderQuantity'],
  ['ins-ekene-esp-motor', 'unitCost set to -1', setAt('unitCost', -1), 'unitCost'],
  ['ltr-ekene-mech-seal', 'leadTimeDays set to the string 90', setAt('leadTimeDays', '90'), 'leadTimeDays'],
  ['ltr-ekene-mech-seal', 'leadTimeDays set to -5', setAt('leadTimeDays', -5), 'leadTimeDays'],
  ['sm-ekene', 'eleven bands', (a) => { a.bands = Array.from({ length: 11 }, (_, i) => ({ label: `b${i}`, minMonths: i * 3, writeDownPct: i * 9 })); return a; }, 'bands'],
  ['sm-ekene', 'bands[0].label removed', (a) => dropAt(a, 'bands.0.label'), 'bands[0].label'],
  ['sm-ekene', 'bands[1].minMonths set to -1', setAt('bands.1.minMonths', -1), 'bands[1].minMonths'],
  ['sm-ekene', 'items set to an empty list', setAt('items', []), 'items'],
  ['sm-ekene', 'items[0] set to a number', setAt('items.0', 7), 'items[0]'],
  ['sm-ekene', 'items[0].unitCost set to -1', setAt('items.0.unitCost', -1), 'items[0].unitCost'],
  ['sm-ekene', 'items[0].monthlyUsage set to -1', setAt('items.0.monthlyUsage', -1), 'items[0].monthlyUsage'],
  ['eoq-ekene-baryte', 'the whole call handed a number in place of an object', () => 5, 'options'],
];
const probeArgs = (id) => (id === 'sm-ekene' ? smArgs() : argsOf(id));
const probeFn = (id) => (id === 'sm-ekene' ? 'slowMoving' : GC[id].fn);
const PROBED = PROBES.map(([id, what, f, field]) => {
  const r = refusal(`${probeFn(id)} on ${id} with ${what}`, E[probeFn(id)](f(probeArgs(id))), field);
  return [id, what, `\`${field}\``, r.error];
});
table(['golden input', 'the change (stated probe)', 'field', 'the engine\'s message, verbatim'], PROBED.map((r) => (r[3].includes('|') ? [...r.slice(0, 3), 'printed below this table as a quotation, because it carries the character |'] : r)));
PROBED.filter((r) => r[3].includes('|')).forEach((r) => { w(); w(`The message of the probe "${r[1]}" on ${r[0]}, verbatim:`); quote(r[3]); });
w();
// EVERY REFUSAL SITE IS REACHED. An instrumented copy of the engine source (the
// same text with each refuse( call tagged by its position) replays every call
// above and counts the call sites reached. The printed messages all come from
// the true engine; the copy only counts.
const SITE = /\brefuse\(/g;
const siteCount = (ENGINE_SRC.match(SITE) || []).length;
let k = 0;
const abs = (rel) => pathToFileURL(`${ROOT}/${rel}`).href;
const instr = ENGINE_SRC
  .replace(/\brefuse\(/g, () => { k += 1; return `__R(${k}, `; })
  .replace("const refuse = (field, message) => ({ error: `${field} ${message}`, field });", "const refuse = (field, message) => ({ error: `${field} ${message}`, field });\nconst __R = (n, f, m) => { globalThis.__SC3_HITS.add(n); return refuse(f, m); };")
  .replace("'../../lib/stats/stats.js'", `'${abs('lib/stats/stats.js')}'`)
  .replace("'../../lib/conventions/percentile.js'", `'${abs('lib/conventions/percentile.js')}'`)
  .replace("'../hse/safetyStats.js'", `'${abs('engines/hse/safetyStats.js')}'`);
must('the instrumented copy tags every refuse call site and keeps the helper', k === siteCount && instr.includes('const __R = '), `${k} ${siteCount}`);
globalThis.__SC3_HITS = new Set();
const IE = await import(`data:text/javascript;base64,${Buffer.from(instr).toString('base64')}`);
REF.forEach((c) => { const r = IE[c.fn](clone(c.args)); must(`the instrumented copy gives the same message: ${c.id}`, r.error === c.expected.message, r.error); });
PROBES.forEach(([id, what, f]) => { const r = IE[probeFn(id)](f(probeArgs(id))); must(`the instrumented copy refuses the probe: ${id} ${what}`, !!r.error, r.error); });
const HIT = globalThis.__SC3_HITS.size;
const UNREACHED = [...Array(siteCount).keys()].map((i) => i + 1).filter((i) => !globalThis.__SC3_HITS.has(i));
const siteLine = (n) => { let j = 0; return ENGINE_SRC.split('\n').find((l) => { const c = (l.match(SITE) || []).length; j += c; return c && j >= n; }) || ''; };
must('the one unreached site is the no-candidate guard of quantityDiscount', UNREACHED.length === 1 && /give no band whose EOQ lies inside it/.test(siteLine(UNREACHED[0])), UNREACHED.join());
must('every other refusal call site in the engine is reached by a golden case or a stated probe', HIT === siteCount - 1, `${HIT} of ${siteCount}; missing ${[...Array(siteCount).keys()].map((i) => i + 1).filter((i) => !globalThis.__SC3_HITS.has(i)).join(",")}`);
w(`${PROBED.length} stated probes. Between them the golden refusals and the probes reach ${HIT} of the ${siteCount} places in the engine source that can refuse a call (counted on an instrumented copy of the source when this digest was built; the messages printed are the true engine's). The one place no call reaches is quantityDiscount's refusal of a schedule that offers no candidate at all: an all-units schedule offers each break quantity, and under an incremental one each band's EOQ is larger than the band's before it, so some band always holds its own EOQ. The guard stays in the engine as a safeguard, and the course prints no message for it.`);
w();
const orderProbe = argsOf('eoq-ekene-baryte'); delete orderProbe.rounding; orderProbe.roundTo = 10;
const orderR = refusal('eoq on eoq-ekene-baryte with rounding removed and an unknown key roundTo added (stated probe)', E.eoq(orderProbe), 'roundTo');
w('THE ORDER OF REFUSALS. A box that carries an unknown key AND lacks a required input is refused on the unknown key first: every function checks its accepted keys before it reads an input. On eoq-ekene-baryte with rounding removed and a key roundTo added (stated probe), the engine\'s message, verbatim:');
quote(orderR.error);
w();
w('Four rules the tables show:');
w('- An input with no default is refused when it is missing, and the message names it: a weight, a score scale, the classes and the override list, the cut-offs and the boundary rule, a demand, an order cost, a holding rate or holding cost, a rounding rule, a discount type, a service measure and level, an order quantity for a fill rate, a safety-factor rounding and floor, a lead time, a review period, a failure rate, days a year, a downtime cost, a search limit, a seed, a draw count, the bands and the cover limit.');
w('- An input key a function does not read is refused at whatever level it sits (a top-level option, a criterion, an item, a price band, a band, a triangular distribution), with the path to the key and the full list of accepted keys.');
w('- A stated figure inside a message is printed as it was given; a computed one prints to six decimals. A largest accepted value the engine prints is rounded toward the accepted side, so typing it back is accepted (the two Poisson and insurance caps in the first table say so in their own words).');
w('- A policy that cannot work is refused before any figure is computed: weights that do not add to 100, class minimums that do not fall to 0, price breaks that do not rise, a rounding rule that gives an order of nothing, a fill rate with no uncertainty to protect against.');

/* ============================================================ SECTION 9 */

section('graded', 'What is graded, where the practicals run, and what is never graded', ['Associate m06 l04', 'Professional m06 l05', 'Expert m06 l05']);
w(`EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED INPUTS. A capstone field, a question key and a panel figure are each computed by a function in the table of ${ref('computes')} on inputs written down in advance. No graded figure comes from the Monte Carlo of leadTimeRisk, so the same inputs give the same number on any machine, and there is exactly one right answer.`);
w();
w(`THE PRACTICALS RUN IN THE COURSE'S CALCULATOR PANELS AND IN THE PLANNER. Each tier has a calculator panel that calls this same vendored engine (${ref('planner')}): the register calculator (Associate), the stock calculator (Professional) and the spares calculator (Expert). A learner types their own inputs into every visible control; the panel prints what the engine returns, every refusal in the engine's own words, and the reason beside each figure. The Materials & Spares Planner in the Suite gives the same figures on the same inputs.`);
w();
w('WHAT A CAPSTONE STATES. Each capstone runs its own synthetic register, which this digest does not print, and states every input a figure depends on: each criterion, weight, score and class minimum and the override; each item\'s usage and unit cost, the cut-offs and the boundary rule; the demand, order cost, holding rate and rounding rule; the price schedule and the discount type; each demand, spread, lead time, review period, service measure and level, order quantity, safety-factor rounding and floor; each failure rate, lead time in days, days a year, unit cost, holding rate, downtime cost and search limit; each band and write-down and the cover limit. Each graded figure is quoted to six decimals as the panel prints it.');
w();
w(`WHAT IS NEVER GRADED. No graded figure depends on a reading the engine states (${ref('readings')}): every capstone field is the same number under each reading the engine takes and under the alternative it names. No graded figure is a Monte Carlo draw: the sampled P90, P50, P10, mean, stockout probability and reorder point for a service level of ${ref('montecarlo')} are taught with their seed and draw count and are never graded. A capstone may carry a Monte Carlo block, worked with its seed and draw count; no graded field reads it.`);
w();
w('WHAT A COMPUTED FIGURE DOES NOT SAY. A criticality class is what the stated criteria, weights and minimums give; an ABC class is a stated cut-off applied to stated usage; an EOQ is the cheapest lot for the stated costs; a safety stock is what the stated demand, lead time and service target need; a number of spares is the cheapest for the stated failure rate and costs. None is a forecast of what will fail or be used, an audit of the register or a supplier\'s promise. Each figure is quoted with its inputs for that reason.');

/* ============================================================ SECTION 10 */

section('criticality', 'Criticality: criteria, weights, the weighted score, classes and the override', ['Associate m02']);
w(`THE RULE (the engine's basis, verbatim): ${bC.rule}. The override: ${bC.override}.`);
w();
w(`Each weight is a percentage and the weights add to ${S(D.WEIGHT_SUM)}; a criterion contributes its weight times its score over the score scale, so the weighted score runs from 0 to 100. On the Ekene register (fixture, the stated policy of ${ref('dataset')}):`);
w();
table(['id', 'safety', 'production', 'lead time', 'redundancy', 'weighted score', 'class', 'the engine\'s reason, verbatim'], critFx.items.map((x) => [x.id, f6(x.contributions.safety), f6(x.contributions.production), f6(x.contributions.leadTime), f6(x.contributions.redundancy), f6(x.weightedScore), x.class, x.reason]));
w();
w(`Counts: ${list(Object.entries(critFx.counts).map(([c, n]) => `${c} ${n}`))}.`);
must('the counts add to eighteen', Object.values(critFx.counts).reduce((a, b) => a + b, 0) === 18, JSON.stringify(critFx.counts));
must('every contribution is weight x score / scoreMax', critFx.items.every((x) => POL.criticality.criteria.every((c) => x.contributions[c.id] === (c.weight * byId[x.id].scores[c.id]) / POL.criticality.scoreMax)), 'contributions');
w();
w('THE MINIMUM IS MET AT OR ABOVE. MECH-SEAL scores exactly the V minimum and is V; GASKET-RJ scores exactly the E minimum and is E. On stated inputs (golden inputs, two criteria of weight 50 each out of 10, classes V from 70 and E from 40):');
const cIn = runG('crit-at-cutoff-is-in');
const cBelow = runG('crit-just-below-cutoff');
qg('crit-at-cutoff-is-in', cIn.items[0].reason);
qg('crit-just-below-cutoff', cBelow.items[0].reason);
must('70 is V and 69.95 is E', cIn.items[0].class === 'V' && cBelow.items[0].class === 'E', `${cIn.items[0].weightedScore} ${cBelow.items[0].weightedScore}`);
w();
const c12 = runG('crit-12-digit-key');
w(`TWELVE SIGNIFICANT DIGITS. Three weights of 33.3, 33.3 and 33.4 with a score of 7 out of 10 on each (golden input crit-12-digit-key) sum to a weighted score the computer holds as ${S(c12.items[0].weightedScore)}; compared at 12 significant digits it meets the minimum of 70, and the item is class ${c12.items[0].class}. The engine's reason, verbatim:`);
quote(c12.items[0].reason);
must('the 12-digit key places 69.99999999999999 in V', c12.items[0].weightedScore < 70 && c12.items[0].class === 'V', c12.items[0].weightedScore);
w();
w('THE OVERRIDE. A maximum score on a named criterion places the item in the first class whatever its weighted score; one below the maximum does not. PSV-KIT on the register (fixture), and two stated cases (golden inputs):');
const oF = runG('crit-override-forces-top');
const oB = runG('crit-override-one-below-max');
const o2 = runG('crit-override-two-criteria');
qg('PSV-KIT on the register (fixture)', cf['PSV-KIT'].reason);
qg('crit-override-forces-top', oF.items[0].reason);
qg('crit-override-one-below-max', oB.items[0].reason);
o2.items.forEach((x) => qg(`crit-override-two-criteria, item ${x.id}`, x.reason));
must('the override forces V at the maximum and not one below', oF.items[0].class === 'V' && oB.items[0].class === 'E' && o2.items.every((x) => x.class === 'V'), 'override');
w();
w('VED. The course names VED (vital, essential, desirable) as one scheme of this kind; the Ekene policy labels its classes V, E and D. A criticality class is a statement of the stated policy, and the ABC class of the next section is a separate thing.');

/* ============================================================ SECTION 11 */

section('abc', 'ABC by annual usage value: ranking, the cumulative share and the item that crosses a cut-off', ['Associate m03']);
w(`THE RULE (the engine's basis, verbatim): ${bA.rule}.`);
w();
w(`Annual usage value is the annual usage times the unit cost. On the Ekene register with the cut-offs ${S(POL.abc.cutoffs.aPct)} and ${S(POL.abc.cutoffs.bPct)} (fixture), under both boundary rules:`);
w();
table(['rank', 'id', 'annual usage value', 'share', 'cumulative share', 'class, at-or-below', 'class, include-crossing'], abcFx.items.map((x) => [S(x.rank), x.id, f6(x.annualValue), f6(x.sharePct), f6(x.cumulativePct), x.class, ax[x.id].class]));
w();
w(`Total annual usage value: ${f6(abcFx.totalAnnualValue)}. By class under at-or-below: ${list(['A', 'B', 'C'].map((c) => `${c} ${abcFx.summary[c].count} items (${f6(abcFx.summary[c].itemSharePct)} percent of items) holding ${f6(abcFx.summary[c].valueSharePct)} percent of the value`))}.`);
must('the value shares of the three classes add to 100 within 1e-9', Math.abs(['A', 'B', 'C'].reduce((s, c) => s + abcFx.summary[c].valueSharePct, 0) - 100) < 1e-9, 'shares');
const differ = abcFx.items.filter((x) => x.class !== ax[x.id].class).map((x) => x.id);
w();
w(`THE TWO RULES DISAGREE ON ${differ.length === 2 ? 'TWO' : S(differ.length)} ITEMS, ${list(differ)}: each is the item that crosses a cut-off, and include-crossing places it in the higher class. The engine's reasons for CEM-G under each rule, verbatim:`);
must('the two rules differ on exactly CEM-G and LUBE-OIL', differ.join() === 'CEM-G,LUBE-OIL', differ.join());
qg('CEM-G under at-or-below (fixture)', af['CEM-G'].reason);
qg('CEM-G under include-crossing (fixture)', ax['CEM-G'].reason);
w();
const ex1 = runG('abc-cutoff-exact-at-or-below');
const ex2 = runG('abc-cutoff-exact-include-crossing');
w('A SHARE EXACTLY ON A CUT-OFF (golden inputs abc-cutoff-exact-at-or-below and abc-cutoff-exact-include-crossing: three items of value 80, 15 and 5):');
w();
table(['id', 'cumulative share', 'at-or-below', 'include-crossing'], ex1.items.map((x, i) => [x.id, f6(x.cumulativePct), x.class, ex2.items[i].class]));
must('exact cut-offs: at-or-below A,B,C; include-crossing A,B,C', ex1.items.map((x) => x.class).join() === 'A,B,C' && ex2.items.map((x) => x.class).join() === 'A,B,C', 'exact');
w();
const tie = runG('abc-ties-by-id');
w(`TIES. Two items of equal annual usage value are ranked by id (golden input abc-ties-by-id): ${list(tie.items.map((x) => `${x.id} rank ${x.rank} value ${f6(x.annualValue)}`))}.`);
must('ties by id: a before b', tie.items[0].id === 'a' && tie.items[1].id === 'b' && tie.items[0].annualValue === tie.items[1].annualValue, 'ties');
w();
w(`THE CUT-OFFS ARE A STATED POLICY. The engine's basis cites lecture 11 slide 4 for that (${ref('sources')}): the classes are arbitrary, so the course never states a default cut-off. CRITICALITY AND ABC SIDE BY SIDE: PSV-KIT is criticality ${cf['PSV-KIT'].class} and ABC ${af['PSV-KIT'].class}; BARYTE is criticality ${cf.BARYTE.class} and ABC ${af.BARYTE.class}. Criticality weighs the consequence of a stockout; ABC weighs the money that flows through an item.`);
must('PSV-KIT is V and C; BARYTE is A', cf['PSV-KIT'].class === 'V' && af['PSV-KIT'].class === 'C' && af.BARYTE.class === 'A', `${cf.BARYTE.class}`);

/* ============================================================ SECTION 12 */

const eB = runG('eoq-ekene-baryte');
const aB = argsOf('eoq-ekene-baryte');
section('eoq', 'The economic order quantity: ordering cost, holding cost, the square root and the cost at the optimum', ['Associate m04']);
w(`THE RULE (the engine's basis, verbatim): ${bE.rule}.`);
w();
w(`With A the cost of an order, D the annual demand and h the cost of holding one unit for a year, ordering Q at a time costs A D / Q a year in orders and h Q / 2 in holding. The EOQ is the Q where the two are equal, and the relevant cost there is the square root of 2 A D h. The EOQ is the unrounded figure; the quantity ordered is the one the stated rounding rule gives (${ref('rounding')}).`);
w();
w(`BARYTE on the Ekene register (fixture case, golden input eoq-ekene-baryte): demand ${S(aB.annualDemand)} a year, order cost ${S(aB.orderCost)}, unit cost ${S(aB.unitCost)}, holding rate ${S(aB.holdingRate)}, rounded up to a multiple of ${S(aB.rounding.multiple)}. The fixture's note on the order cost, verbatim:`);
quote(FX.cases.eoq.note);
w();
table(['figure', 'engine'], [
  ['holding cost of a unit for a year', f6(eB.holdingCostPerUnitYear)], ['EOQ', f6(eB.eoq)], ['quantity ordered', f6(eB.quantity)], ['orders a year', f6(eB.ordersPerYear)], ['cycle, years', f6(eB.cycleYears)],
  ['ordering cost a year', f6(eB.orderingCost)], ['holding cost a year', f6(eB.holdingCost)], ['relevant cost a year', f6(eB.relevantCost)], ['relevant cost at the EOQ', f6(eB.relevantCostAtEoq)], ['rounding penalty, percent', f6(eB.roundingPenaltyPct)], ['purchase cost a year', f6(eB.purchaseCost)],
]);
w();
w('The engine\'s reason, verbatim:');
quote(eB.reason);
must('BARYTE: EOQ 137.408584 ordered as 140', f6(eB.eoq) === '137.408584' && eB.quantity === 140, eB.eoq);
must('at the EOQ the ordering and holding costs are equal (to 1e-9)', (() => { const r = E.eoq({ ...aB, rounding: { rule: 'none' } }); return Math.abs(r.orderingCost - r.holdingCost) < 1e-9 && Math.abs(r.relevantCost - r.relevantCostAtEoq) < 1e-9; })(), 'equal');
w();
const eN = success('eoq on eoq-ekene-baryte with no rounding (stated probe)', E.eoq({ ...aB, rounding: { rule: 'none' } }));
w(`At the EOQ itself (the same case with the rule none, stated probe) the ordering cost is ${f6(eN.orderingCost)} and the holding cost ${f6(eN.holdingCost)} (engine); their sum ${f6(eN.relevantCost)} is the relevant cost at the EOQ.`);
w();
w(`THE PURCHASE COST IS NOT IN THE RELEVANT COST. Demand times unit cost, ${f6(eB.purchaseCost)} a year here, is paid whatever the lot size, so it moves no EOQ. It matters once the price depends on the lot (${ref('discounts')}).`);
w();
w(`THE SQUARE ROOT. Harris wrote the lot as a square root (${ref('provisions')}), and the four-fold sentence he printed follows from it: on the same case with the demand four times over (stated probe, demand ${S(aB.annualDemand * 4)}) the EOQ is ${f6(E.eoq({ ...aB, annualDemand: aB.annualDemand * 4, rounding: { rule: 'none' } }).eoq)} (engine), twice ${f6(eN.eoq)}.`);
must('four times the demand doubles the EOQ (to 1e-9)', Math.abs(E.eoq({ ...aB, annualDemand: aB.annualDemand * 4, rounding: { rule: 'none' } }).eoq - 2 * eN.eoq) < 1e-9, 'four fold');
w();
w(`THE THREE HARRIS LOTS and the lecture 8 slide 9 check are in ${ref('published')}.`);

/* ============================================================ SECTION 13 */

section('rounding', 'Rounding and the flat bottom: the stated rule, its cost, halves upward, and the holding cost stated two ways', ['Associate m05']);
w('THE RULE, stated once in the engine: a rounding rule is { rule: none } or { rule: up, down or nearest, multiple }; the quotient of the quantity over the multiple is read at 12 significant digits, then taken up, down, or to the nearest whole number with halves upward, and multiplied back. Costs are reported at the rounded quantity and at the EOQ, with the penalty in percent.');
w();
w('BARYTE under each rule (stated probes on the fixture case; only the rounding changes):');
w();
const RULES = [{ rule: 'none' }, { rule: 'up', multiple: 10 }, { rule: 'down', multiple: 10 }, { rule: 'nearest', multiple: 10 }, { rule: 'up', multiple: 50 }, { rule: 'nearest', multiple: 1 }];
const rr = RULES.map((r) => success(`eoq baryte ${JSON.stringify(r)}`, E.eoq({ ...aB, rounding: r })));
table(['rule', 'quantity ordered', 'relevant cost a year', 'penalty, percent'], RULES.map((r, i) => [r.rule === 'none' ? 'none' : `${r.rule}, multiple ${r.multiple}`, f6(rr[i].quantity), f6(rr[i].relevantCost), f6(rr[i].roundingPenaltyPct)]));
must('the penalty is 0 at the EOQ and above 0 elsewhere', rr[0].roundingPenaltyPct === 0 && rr.slice(1).every((r) => r.roundingPenaltyPct > 0), 'penalty');
must('rounding up by 50 costs more than rounding up by 10', rr[4].roundingPenaltyPct > rr[1].roundingPenaltyPct, 'flat');
w();
w(`THE FLAT BOTTOM. An order ${f6(rr[4].quantity - eB.eoq)} units above the EOQ (derived: ${f6(rr[4].quantity)} less ${f6(eB.eoq)}) costs ${f6(rr[4].roundingPenaltyPct)} percent more a year; the relevant cost is flat near its minimum, which is why a stated rounding to a pallet, a drum or a truckload costs little. The engine's reason for the multiple of 50, verbatim:`);
quote(rr[4].reason);
w();
const half = runG('eoq-q-exactly-half-of-multiple');
const nUp = runG('eoq-nearest-rounds-up');
const keep = runG('eoq-exact-multiple-kept');
w(`HALVES UPWARD. An EOQ of exactly ${f6(half.eoq)} to the nearest multiple of ${S(argsOf('eoq-q-exactly-half-of-multiple').rounding.multiple)} (golden input eoq-q-exactly-half-of-multiple) sits exactly halfway, and the engine takes it upward to ${f6(half.quantity)}. An EOQ of ${f6(nUp.eoq)} to the nearest ${S(argsOf('eoq-nearest-rounds-up').rounding.multiple)} (golden input eoq-nearest-rounds-up) orders ${f6(nUp.quantity)}. An EOQ of exactly ${f6(keep.eoq)} rounded up to a multiple of ${S(argsOf('eoq-exact-multiple-kept').rounding.multiple)} (golden input eoq-exact-multiple-kept) stays at ${f6(keep.quantity)}.`);
must('half goes up to 100; 15.81 nearest 10 is 20; 20 up to 4 stays 20', half.eoq === 50 && half.quantity === 100 && nUp.quantity === 20 && keep.eoq === 20 && keep.quantity === 20, 'halves');
w();
const hd = runG('eoq-holding-direct');
const hdp = runG('eoq-holding-direct-with-price');
w(`THE HOLDING COST STATED TWO WAYS. A holding cost is stated either as a figure a unit a year, or as a holding rate with the unit cost (exactly one of the two; stating both, or neither, is refused in ${ref('refusals')}). Stated directly as ${S(argsOf('eoq-holding-direct').holdingCostPerUnitYear)} a unit a year (golden input eoq-holding-direct), the EOQ is ${f6(hd.eoq)}, rounded down to a multiple of ${S(argsOf('eoq-holding-direct').rounding.multiple)} as ${f6(hd.quantity)}; the purchase cost is ${f6(hd.purchaseCost)} without a unit cost and ${f6(hdp.purchaseCost)} with one of ${S(argsOf('eoq-holding-direct-with-price').unitCost)} (golden input eoq-holding-direct-with-price).`);
must('holding direct: purchase cost none without a price', hd.purchaseCost === null && hdp.purchaseCost === 36000, `${hd.purchaseCost} ${hdp.purchaseCost}`);

/* ============================================================ SECTION 14 */

section('slowmoving', 'Slow-moving and obsolete stock: months since the last issue, bands, write-downs, cover and excess', ['Associate m06']);
w(`THE RULE (the engine's basis, verbatim): ${bM.rule}.`);
w();
w('Each band has a minimum number of months since the last issue and a write-down percentage; an item takes the last band whose minimum it has reached. Cover is stock on hand over monthly usage, in months; stock above the cover limit is excess, and all of it is excess when there is no usage. On the Ekene register (fixture, the stated bands and limit of ' + ref('dataset') + '):');
w();
table(['id', 'band', 'stock value', 'write-down', 'cover, months', 'excess', 'excess quantity', 'the engine\'s reason, verbatim'], smFx.items.map((x) => [x.id, x.band, f6(x.stockValue), f6(x.writeDown), x.coverMonths === null ? 'no usage' : f6(x.coverMonths), x.excess ? 'yes' : 'no', f6(x.excessQuantity), x.reason]));
w();
table(['band', 'items', 'stock value', 'write-down'], Object.entries(smFx.byBand).map(([b, v]) => [b, S(v.count), f6(v.stockValue), f6(v.writeDown)]));
w();
w(`Total stock value ${f6(smFx.totalStockValue)}; total write-down ${f6(smFx.totalWriteDown)}; ${S(smFx.excessCount)} items carry excess stock.`);
must('the band write-downs add to the total', Math.abs(Object.values(smFx.byBand).reduce((s, v) => s + v.writeDown, 0) - smFx.totalWriteDown) < 1e-9, smFx.totalWriteDown);
must('three excess items: ORING-KIT, HEAT-TRC, GASKET-RJ', smFx.items.filter((x) => x.excess).map((x) => x.id).join() === 'ORING-KIT,HEAT-TRC,GASKET-RJ', smFx.items.filter((x) => x.excess).map((x) => x.id).join());
w();
const smb = runG('sm-boundaries');
w('THE BOUNDARIES (golden input sm-boundaries, the same bands and limit):');
w();
table(['id', 'months since last issue', 'band', 'cover, months', 'excess', 'excess quantity'], smb.items.map((x, i) => [x.id, S(argsOf('sm-boundaries').items[i].monthsSinceLastIssue), x.band, x.coverMonths === null ? 'no usage' : f6(x.coverMonths), x.excess ? 'yes' : 'no', f6(x.excessQuantity)]));
const sb = Object.fromEntries(smb.items.map((x) => [x.id, x]));
must('12 months is slow, 11.99 active; cover 24 inside, 25 excess by one unit', sb.AT12.band === 'slow' && sb.BELOW12.band === 'active' && !sb.COVER24.excess && sb.COVER25.excess && sb.COVER25.excessQuantity === 1, 'boundaries');
w();
w(`A band minimum is reached at or above it; the cover limit is exceeded only strictly above it. The engine's basis for the policy cites lecture 13 slide 13 (days of supply, to find dead stock); the bands, the write-downs and the limit are the user's stated policy, and the course states no default.`);

/* ============================================================ SECTION 15 */

const qA = runG('qd-ekene-casing');
const qI = runG('qd-ekene-casing-incremental');
const aQ = argsOf('qd-ekene-casing');
section('discounts', 'Quantity discounts: a price schedule, all-units and incremental, candidates and the lowest total cost', ['Professional m01']);
w(`THE RULES (the engine's basis, verbatim). All-units: ${bQa.rule}. Incremental: ${bQi.rule}.`);
w();
w(`CSG-958 on the Ekene register (fixture case, golden inputs qd-ekene-casing and qd-ekene-casing-incremental): demand ${S(aQ.annualDemand)} a year, order cost ${S(aQ.orderCost)}, holding rate ${S(aQ.holdingRate)}, prices ${list(aQ.breaks.map((b) => `${S(b.unitPrice)} from ${S(b.minQuantity)}`))}, rounded to the nearest whole unit. Every candidate, read both ways:`);
w();
table(['discount type', 'band', 'price', 'fixed cost Fi', 'EOQ', 'candidate', 'total cost a year', 'the engine\'s reason, verbatim'], [
  ...qA.candidates.map((c) => ['all-units', S(c.band), S(c.unitPrice), f6(c.fixedCost), f6(c.eoq), c.feasible ? f6(c.quantity) : 'none', c.feasible ? f6(c.totalCost) : 'none', c.reason]),
  ...qI.candidates.map((c) => ['incremental', S(c.band), S(c.unitPrice), f6(c.fixedCost), f6(c.eoq), c.feasible ? f6(c.quantity) : 'none', c.feasible ? f6(c.totalCost) : 'none', c.reason]),
]);
w();
w(`All-units orders ${f6(qA.quantity)} (band ${S(qA.band)}) at ${f6(qA.totalCost)} a year, a saving of ${f6(qA.savingsAgainstNoDiscount)} against the no-discount baseline; incremental orders ${f6(qI.quantity)} (band ${S(qI.band)}) at ${f6(qI.totalCost)}, a saving of ${f6(qI.savingsAgainstNoDiscount)}. The baseline, in the engine's words: ${qA.basis.baseline}.`);
must('CSG-958: all-units orders 120 at 349720', qA.quantity === 120 && qA.totalCost === 349720 && qA.band === 2, qA.totalCost);
must('the incremental reading costs more than the all-units one on the same schedule', qI.totalCost > qA.totalCost, `${qI.totalCost}`);
w();
w('ALL-UNITS: A BAND WHOSE EOQ FALLS BELOW ITS BREAK offers the break quantity as its candidate; a band whose EOQ falls at or above the next break offers none, because a cheaper band covers that quantity. INCREMENTAL: each unit is priced by its own band, so the lot cost in band i is Fi plus the band price times Q, and a band offers only its own EOQ with A + Fi when that EOQ lies inside it. The two worked lectures are in ' + ref('published') + ': slides 13 to 15 of lecture 8 (incremental) and slide 12 (all-units).');
w();
const top = runG('qd-eoq-in-top-band');
const one = runG('qd-single-band');
const t0 = runG('qd-tie-takes-smaller');
const tx = runG('qd-tie-exact');
w('FOUR MORE CALLS (golden inputs):');
qg('qd-eoq-in-top-band', top.reason);
qg('qd-single-band', one.reason);
qg('qd-tie-takes-smaller', t0.reason);
qg('qd-tie-exact', tx.reason);
must('the exact tie takes the smaller quantity 100', tx.quantity === 100 && t0.quantity === 200, `${tx.quantity} ${t0.quantity}`);
w();
w(`TIES. Two candidates whose total costs agree to 12 significant digits tie, and the smaller quantity is taken (golden input qd-tie-exact: ${f6(tx.candidates[0].totalCost)} and ${f6(tx.candidates[1].totalCost)}).`);
w();
w(`ROUNDING AGAINST THE BREAKS. Candidates are rounded by the stated rule and costed at the rounded quantity in the band it lands in; when a rule rounds, every break quantity must be a multiple of the rounding multiple, so that ordering at a break keeps its price (the refusal is in ${ref('refusals')}). On the Caplice schedule read as all-units (golden input caplice-l8-schedule-all-units) the engine orders ${f6(runG('caplice-l8-schedule-all-units').quantity)} at ${f6(runG('caplice-l8-schedule-all-units').totalCost)} a year.`);
w();
w('THE PRICE SCHEDULE IS A STATED INPUT. How a price schedule is tendered and evaluated belongs to the procurement course; this course takes the schedule as given.');

/* ============================================================ SECTION 16 */

const sC = runG('ss-ekene-choke-beans');
const aS = argsOf('ss-ekene-choke-beans');
section('protection', 'Demand over the lead time: continuous review, demand and lead-time variation, and sigma over the protection period', ['Professional m02']);
w(`THE RULE (the engine's basis, verbatim): ${bS.rule}.`);
w();
w('CONTINUOUS REVIEW. Under continuous review, stock is watched all the time and an order of Q is placed when it falls to the reorder point s. The protection period P is the lead time plus the review period (0 under continuous review); the stock at the reorder point must cover the demand over P. Demand over P has a mean of the demand a period times P and a standard deviation, sigma, from the demand spread and the lead-time spread together.');
w();
w(`CHK-BEAN on the Ekene register (fixture case, golden input ss-ekene-choke-beans): ${S(aS.demandMean)} sets a month with a standard deviation of ${S(aS.demandSd)} a month, a lead time of ${S(aS.leadTime)} months with a standard deviation of ${S(aS.leadTimeSd)} months, continuous review, a cycle service level of ${S(aS.serviceLevel)}, an order quantity of ${S(aS.orderQuantity)}, rounded up to a whole set. The fixture's note, verbatim:`);
quote(FX.cases.safetyStock.note);
w();
const ltOff = success('safetyStock choke beans without lead-time spread (stated probe)', E.safetyStock({ ...aS, leadTimeSd: 0 }));
const dOff = success('safetyStock choke beans without demand spread (stated probe)', E.safetyStock({ ...aS, demandSd: 0 }));
table(['case', 'demand over P', 'sigma', 'safety stock', 'reorder point'], [
  ['as stated', f6(sC.demandOverProtection), f6(sC.sigma), f6(sC.safetyStock), f6(sC.level)],
  ['lead-time spread set to 0 (stated probe)', f6(ltOff.demandOverProtection), f6(ltOff.sigma), f6(ltOff.safetyStock), f6(ltOff.level)],
  ['demand spread set to 0 (stated probe)', f6(dOff.demandOverProtection), f6(dOff.sigma), f6(dOff.safetyStock), f6(dOff.level)],
]);
must('sigma squared is the sum of the two parts squared', Math.abs(sC.sigma ** 2 - ltOff.sigma ** 2 - dOff.sigma ** 2) < 1e-9, 'parts');
w();
w(`The two parts add as squares: ${f6(ltOff.sigma)} squared plus ${f6(dOff.sigma)} squared is ${f6(sC.sigma)} squared (derived; the check holds to 1e-9). The engine's reason for the stated case, verbatim:`);
quote(sC.reason);
w();
const lto = runG('ss-lead-time-variance-only');
w(`LEAD-TIME SPREAD ALONE. With a steady demand of ${S(argsOf('ss-lead-time-variance-only').demandMean)} a period and a lead time of ${S(argsOf('ss-lead-time-variance-only').leadTime)} periods with a standard deviation of ${S(argsOf('ss-lead-time-variance-only').leadTimeSd)} (golden input ss-lead-time-variance-only), sigma is ${f6(lto.sigma)}: the demand times the lead-time spread. The engine's reason, verbatim:`);
quote(lto.reason);
must('lead-time spread alone: sigma 30', lto.sigma === 30, lto.sigma);
w();
w('ONE PERIOD FOR EVERYTHING. The demand, its spread, the lead time, its spread and the review period are all in the one period the user chooses (months for CHK-BEAN, weeks for the lecture checks); the engine does not convert. The lead-time spread enters on the lead time only; the review period is fixed.');

/* ============================================================ SECTION 17 */

section('cycleservice', 'The cycle service level: the probability of no stockout and the safety factor from the inverse normal', ['Professional m03']);
w('THE CYCLE SERVICE LEVEL is the probability of no stockout in a replenishment cycle. The safety factor k is the inverse standard normal of the level; the safety stock is k times sigma, and the reorder point is the demand over the protection period plus the safety stock. The engine\'s numerics, verbatim: ' + bS.numerics + '.');
w();
const LEVELS = [0.8, 0.9, 0.95, 0.975, 0.99];
const lv = LEVELS.map((p) => success(`safetyStock choke beans at ${p}`, E.safetyStock({ ...aS, serviceLevel: p })));
w('CHK-BEAN at five cycle service levels (stated probes; only the level changes; the level held rounded up to a whole set):');
w();
table(['cycle service level', 'safety factor k', 'safety stock', 'reorder point', 'held as', 'achieved cycle service at the held level'], LEVELS.map((p, i) => [S(p), f6(lv[i].safetyFactorExact), f6(lv[i].safetyStock), f6(lv[i].level), f6(lv[i].levelRounded), f6(lv[i].achievedCycleService)]));
must('k rises with the level and the achieved service is at or above the target', lv.every((r, i) => i === 0 || r.safetyFactorExact > lv[i - 1].safetyFactorExact) && lv.every((r, i) => r.achievedCycleService >= LEVELS[i]), 'monotone');
w();
w(`ROUNDING UP RAISES THE SERVICE. At ${S(aS.serviceLevel)} the reorder point ${f6(sC.level)} is held as ${f6(sC.levelRounded)}, and the service at the held level is ${f6(sC.achievedCycleService)} (engine). The engine reports the service a held level achieves beside the target.`);
w();
w(`A SAFETY FACTOR READ FROM A TABLE. A printed table gives k to two decimals; the stated rule { rule: nearest, decimals: 2 } reads it that way, and the published check of ${ref('published')} (lecture 11 slide 24) is reproduced only with that reading. The exact rule and the table reading differ by a few units on that check; the course states which one a figure uses.`);

/* ============================================================ SECTION 18 */

const sF = runG('ss-ekene-choke-beans-fill');
const aF = argsOf('ss-ekene-choke-beans-fill');
section('fillrate', 'The fill rate: units short per cycle, the unit normal loss, and solving for the safety factor', ['Professional m04']);
w('THE ITEM FILL RATE is the fraction of demand met from stock. Each cycle, the expected units short are sigma times the unit normal loss G(k), where G(k) is the normal density at k less k times the chance of exceeding k; a fill rate of p needs sigma G(k) at most Q times one less p. G falls as k rises, so the engine takes the smallest k that meets the target, by bisection to the last binary digit.');
w();
w(`CHK-BEAN at a fill rate of ${S(aF.serviceLevel)} with an order quantity of ${S(aF.orderQuantity)} (golden input ss-ekene-choke-beans-fill). The engine's reason, verbatim:`);
quote(sF.reason);
w();
table(['figure', 'engine'], [['sigma', f6(sF.sigma)], ['safety factor k', f6(sF.safetyFactorExact)], ['safety stock', f6(sF.safetyStock)], ['reorder point', f6(sF.level)], ['held as', f6(sF.levelRounded)], ['expected units short a cycle at the held level', f6(sF.expectedShortPerCycle)], ['achieved fill rate', f6(sF.achievedFillRate)], ['achieved cycle service', f6(sF.achievedCycleService)]]);
must('the fill rate is met at the held level', sF.achievedFillRate >= aF.serviceLevel, sF.achievedFillRate);
w();
w(`THE TWO MEASURES ARE DIFFERENT TARGETS. On the same item, a cycle service level of ${S(aS.serviceLevel)} gives k ${f6(sC.safetyFactorExact)} and a fill rate of ${S(aF.serviceLevel)} gives k ${f6(sF.safetyFactorExact)} (engine): a fill rate counts the units short against the order quantity each cycle brings, and a cycle service level counts the cycles with any shortage at all. A service level in this course always names its measure.`);
must('on CHK-BEAN the fill-rate k is below the cycle-service k', sF.safetyFactorExact < sC.safetyFactorExact, `${sF.safetyFactorExact} ${sC.safetyFactorExact}`);
w();
w(`The lecture 11 fill-rate column is in ${ref('published')}; its 0.95 row is a slip (${ref('slips')}).`);

/* ============================================================ SECTION 19 */

section('periodic', 'Periodic review: the review period, the order-up-to level, a floor on the safety factor and certain demand', ['Professional m05']);
w('PERIODIC REVIEW. Stock is counted every R periods and topped up to the order-up-to level S. The protection period becomes the review period plus the lead time, and the rest of the rule is unchanged: S is the demand over R + L plus k times sigma over R + L.');
w();
const sR = success('safetyStock choke beans reviewed monthly (stated probe)', E.safetyStock({ ...aS, reviewPeriod: 1 }));
w(`CHK-BEAN reviewed every month (stated probe: the fixture case with a review period of 1): policy ${sR.policy}, protection period ${f6(sR.protectionPeriod)} months, demand over it ${f6(sR.demandOverProtection)}, sigma ${f6(sR.sigma)}, safety stock ${f6(sR.safetyStock)}, order-up-to level ${f6(sR.level)}, held as ${f6(sR.levelRounded)} (engine). The engine's reason, verbatim:`);
quote(sR.reason);
must('periodic review raises the protection period to 3.5 and the level', sR.protectionPeriod === 3.5 && sR.level > sC.level && sR.policy === 'periodic (R, S)', sR.protectionPeriod);
w();
w(`The lecture 12 check (the order-up-to level ${f6(r12.levelRounded)}) is in ${ref('published')}.`);
w();
const fl = runG('ss-floor-at-zero');
const nf = runG('ss-negative-k-without-floor');
w(`A FLOOR ON THE SAFETY FACTOR. A cycle service level below 0.5 gives a negative k. The floor is a stated input: a number, or null for none. At a level of ${S(argsOf('ss-floor-at-zero').serviceLevel)} (golden inputs ss-floor-at-zero and ss-negative-k-without-floor) the exact k is ${f6(fl.safetyFactorExact)}; with the floor 0 the engine holds k at ${f6(fl.safetyFactor)} and the safety stock at ${f6(fl.safetyStock)}; with no floor the safety stock is ${f6(nf.safetyStock)}. The two reasons, verbatim:`);
qg('ss-floor-at-zero', fl.reason);
qg('ss-negative-k-without-floor', nf.reason);
must('the floor holds k at 0; without it the safety stock is negative', fl.safetyFactor === 0 && fl.safetyStock === 0 && nf.safetyStock < 0, nf.safetyStock);
w();
const cd = runG('ss-certain-demand');
w(`CERTAIN DEMAND. With no demand spread and no lead-time spread (golden input ss-certain-demand) sigma is ${f6(cd.sigma)}, the safety stock is ${f6(cd.safetyStock)}, and the reorder point is the demand over the lead time, ${f6(cd.level)}. A cycle service target is accepted; a fill rate is refused, because there is nothing to protect against (${ref('refusals')}). The engine's reason, verbatim:`);
quote(cd.reason);
must('certain demand: sigma 0, level 30', cd.sigma === 0 && cd.level === 30, cd.level);

/* ============================================================ SECTION 20 */

const pP = runG('ps-ekene-psv-kits');
const aP = argsOf('ps-ekene-psv-kits');
section('poisson', 'Poisson demand for slow movers: the table, cycle service, the fill rate and the loss recursion', ['Professional m06']);
w(`THE RULE (the engine's basis, verbatim): ${bP.rule}.`);
w();
w('WHEN THE NORMAL DOES NOT FIT. A slow mover is used a unit or two at a time, a few times a year; demand over the lead time is a small whole number, and a normal curve puts weight below zero. The engine reads such demand as Poisson with the mean over the protection period and chooses the smallest whole level that meets the stated target.');
w();
w(`PSV-KIT on the Ekene register (fixture case, golden input ps-ekene-psv-kits): ${S(aP.demandRate)} kits a month, a lead time of ${S(aP.leadTime)} months, continuous review, a cycle service level of ${S(aP.serviceLevel)}. The fixture's note, verbatim:`);
quote(FX.cases.poissonStock.note);
w();
table(['level', 'probability', 'cumulative', 'expected units short beyond the level'], pP.rows.map((r) => [S(r.s), f6(r.probability), f6(r.cumulative), f6(r.expectedShort)]));
w();
w(`Poisson mean ${f6(pP.mean)}; level ${S(pP.level)}; safety stock ${f6(pP.safetyStock)} (the level less the mean); achieved cycle service ${f6(pP.achievedCycleService)} (engine). The engine's reason, verbatim:`);
quote(pP.reason);
must('PSV-KIT: level 5 at mean 2', pP.level === 5 && pP.mean === 2, pP.level);
w();
const pF = success('poissonStock PSV-KIT at a fill rate of 0.95 with an order of 6 (stated probe)', E.poissonStock({ ...aP, serviceMeasure: 'fill-rate', orderQuantity: 6 }));
w(`THE FILL RATE ON THE SAME ITEM (stated probe: a fill rate of 0.95 with an order quantity of 6 kits): level ${S(pF.level)}, expected units short a cycle ${f6(pF.expectedShortPerCycle)}, achieved fill rate ${f6(pF.achievedFillRate)} (engine). The engine's reason, verbatim:`);
quote(pF.reason);
w();
w('THE LOSS RECURSION. The expected units short beyond level 0 is the mean; each level after that subtracts one less the cumulative probability at the level before. The engine uses the recursion; its oracle computes each loss directly, and the two agree on every golden case.');
w();
const pm = runG('ps-level-exactly-met');
const pa = runG('ps-level-just-above');
const pz = runG('ps-level-zero');
const pr = runG('ps-fill-with-review');
w('FOUR MORE CALLS (golden inputs):');
qg('ps-level-exactly-met', pm.reason);
qg('ps-level-just-above', pa.reason);
qg('ps-level-zero', pz.reason);
qg('ps-fill-with-review', pr.reason);
must('the level exactly met is 1; just above is 2; a tiny mean gives 0', pm.level === 1 && pa.level === 2 && pz.level === 0, `${pm.level} ${pa.level} ${pz.level}`);
w();
w(`The lecture 13 and MIL-HDBK-338B checks are in ${ref('published')}; the lecture 13 slip at level 4 is in ${ref('slips')}. Above a Poisson mean of ${S(D.MAX_POISSON_MEAN)} the engine refuses and the normal safety stock serves (${ref('sizecaps')}).`);

/* ============================================================ SECTION 21 */

const iE = runG('ins-ekene-esp-motor');
const aI = argsOf('ins-ekene-esp-motor');
section('insurance', 'Insurance spares: orders outstanding one for one, holding against downtime, and the marginal spare', ['Expert m01']);
w(`THE ENGINE'S MODEL, STATED PLAINLY. Each failure takes a spare and places a replacement order that arrives after the lead time, one for one, so the orders outstanding at a random moment are Poisson with a mean of the failures a year times the lead time in days over the days a year. With n spares, the failed units waiting for a spare are the orders outstanding beyond n; each waiting unit is one unit down, costed at the downtime cost a day. The rule, in the engine's words, verbatim: ${bI.rule}. Its reading, verbatim: ${bI.reading}.`);
w();
w('THE ANCHOR. No public text read for this course prints a worked insurance-spares cost example, so the course states the one-for-one model as the engine\'s model and anchors its Poisson figure to MIL-HDBK-338B (' + ref('anchor') + '). The lead\'s decision is recorded in FINDINGS-inventory.md, verbatim:');
const ANCHOR = FINDINGS.match(/The one-for-one insurance-spares model is stated plainly in the course as the engine's model, with its anchor\./);
must('FINDINGS records the lead decision on the insurance model', !!ANCHOR, 'anchor');
quote(ANCHOR ? ANCHOR[0] : '');
w();
w(`THE ESP MOTOR on the Ekene register (fixture case, golden input ins-ekene-esp-motor): ${S(aI.failuresPerYear)} failures a year across the pumped wells, a lead time of ${S(aI.leadTimeDays)} days, ${S(aI.daysPerYear)} days a year, a unit cost of ${S(aI.unitCost)}, a holding rate of ${S(aI.holdingRate)}, a downtime cost of ${S(aI.downtimeCostPerDay)} a day, searched from 0 to ${S(aI.maxSpares)} spares. The fixture's note, verbatim:`);
quote(FX.cases.insuranceSpares.note);
w();
table(['spares', 'probability of no shortage', 'fill rate', 'expected units down', 'holding cost a year', 'downtime cost a year', 'total cost a year'], iE.options.map((o) => [S(o.spares), f6(o.probabilityNoShortage), f6(o.fillRate), f6(o.expectedUnitsDown), f6(o.holdingCost), f6(o.downtimeCost), f6(o.totalCost)]));
w();
w(`Mean orders outstanding ${f6(iE.meanOutstanding)}; the cheapest stock is ${S(iE.spares)} spares at ${f6(iE.totalCost)} a year (engine). The engine's reason, verbatim:`);
quote(iE.reason);
must('ESP motor: 4 spares at 160003.73 a year', iE.spares === 4 && Math.abs(iE.totalCost - 160003.732063607) < 1e-6 && !iE.atSearchLimit, iE.totalCost);
w();
const mOne = iE.options[iE.spares + 1];
w(`THE MARGINAL SPARE. One more spare adds its holding cost, ${f6(aI.unitCost * aI.holdingRate)} a year (derived: ${S(aI.unitCost)} times ${S(aI.holdingRate)}), and saves the downtime it prevents, ${f6(iE.options[iE.spares].downtimeCost - mOne.downtimeCost)} a year (derived from the table). The fifth spare saves less than it costs, so four is the cheapest; the reason above says the same in the engine's words.`);
must('the fifth spare saves less than its holding cost; the fourth saves more', iE.options[4].downtimeCost - iE.options[5].downtimeCost < 37000 && iE.options[3].downtimeCost - iE.options[4].downtimeCost > 37000, 'marginal');
w();
w('WHAT THE MODEL LEAVES OUT. It holds no repair loop, no condemnation, no multi-echelon stock and no partial production loss; each is a different model and a different course. A failure rate from field data belongs to the rotating course and the reliability parts of the academy; this course takes it as a stated input.');

/* ============================================================ SECTION 22 */

section('anchor', 'The Poisson anchor: the handbook lamps, no shortage and the fill rate, units down and the search limit', ['Expert m02']);
const imh = runG('ins-mil-hdbk-mean');
const aImh = argsOf('ins-mil-hdbk-mean');
w(`THE HANDBOOK LAMPS AS ORDERS OUTSTANDING. ${S(aImh.failuresPerYear)} failures a year and a lead time of ${S(aImh.leadTimeDays)} days over ${S(aImh.daysPerYear)} days a year (golden input ins-mil-hdbk-mean) give a mean of ${f6(imh.meanOutstanding)} orders outstanding, the mean of the lamp example (${ref('published')}); the probability of no shortage with two spares is ${f6(imh.options[2].probabilityNoShortage)} (engine), which the handbook prints as ${TEXT.mil.r} (text).`);
must('ins-mil-hdbk-mean: mean 0.5 and P(X <= 2) as the lamps', imh.meanOutstanding === 0.5 && imh.options[2].probabilityNoShortage === mil.rows[2].cumulative, imh.options[2].probabilityNoShortage);
w();
w(`NO SHORTAGE AND THE FILL RATE ARE TWO PROBABILITIES. With n spares, the probability of no shortage is the chance that n or fewer orders are outstanding; the fill rate is the chance that a failure finds a spare, which is the chance that n less one or fewer are outstanding. On the ESP motor with ${S(iE.spares)} spares: no shortage ${f6(iE.options[iE.spares].probabilityNoShortage)}, fill rate ${f6(iE.options[iE.spares].fillRate)} (engine); the fill rate with n spares is the no-shortage probability with n less one.`);
must('fill rate at n is no shortage at n - 1 on every row', iE.options.every((o, i) => (i === 0 ? o.fillRate === 0 : o.fillRate === iE.options[i - 1].probabilityNoShortage)), 'fill');
w();
w(`EXPECTED UNITS DOWN are the orders outstanding beyond n, on average: the Poisson loss at n. With no spares it is the mean, ${f6(iE.options[0].expectedUnitsDown)} on the ESP motor; each spare lowers it (the table in ${ref('insurance')}).`);
must('units down at 0 spares is the mean', iE.options[0].expectedUnitsDown === iE.meanOutstanding, iE.options[0].expectedUnitsDown);
w();
const sl = runG('ins-search-limit');
const fh = runG('ins-free-holding');
const ch = runG('ins-cheap-downtime-holds-none');
const mz = runG('ins-max-zero');
const tf = runG('ins-tie-takes-fewer');
w('THE SEARCH LIMIT AND FOUR OTHER EDGES (golden inputs):');
qg('ins-search-limit', sl.reason);
qg('ins-free-holding', fh.reason);
qg('ins-cheap-downtime-holds-none', ch.reason);
qg('ins-max-zero', mz.reason);
qg('ins-tie-takes-fewer', tf.reason);
must('search limit flagged at 1; free holding at the limit; cheap downtime holds none; tie takes fewer', sl.atSearchLimit && sl.spares === 1 && fh.atSearchLimit && ch.spares === 0 && mz.spares === 0 && tf.spares === 0, 'edges');
w();
w(`When the cheapest stock lies on the search limit the engine says so, and a larger stock may cost less: search again with a larger limit. A tie at 12 significant digits takes fewer spares (golden input ins-tie-takes-fewer: ${f6(tf.options[0].totalCost)} and ${f6(tf.options[1].totalCost)}).`);

/* ============================================================ SECTION 23 */

const L = runG('ltr-ekene-mech-seal');
const aL = argsOf('ltr-ekene-mech-seal');
section('montecarlo', 'Lead-time risk by the canonical Monte Carlo: the sampler, the lead time drawn first, the low and high figures, and what is never graded', ['Expert m03']);
w(`THE SAMPLER. leadTimeRisk samples through lib/stats, the platform's one seeded Monte Carlo: mulberry32 for the uniforms and the triangular inverse triInvCDF for each value. Per draw it takes a lead time in days, then a demand rate a day held for that whole lead time; the lead-time demand is the rate times the days. The basis, verbatim:`);
quote(L.basis.sampling);
w();
w(`THE MECHANICAL SEAL on the Ekene register (fixture case, golden input ltr-ekene-mech-seal): demand a day triangular from ${S(aL.demandPerDay.min)} through ${S(aL.demandPerDay.mode)} to ${S(aL.demandPerDay.max)}, lead time triangular from ${S(aL.leadTimeDays.min)} through ${S(aL.leadTimeDays.mode)} to ${S(aL.leadTimeDays.max)} days, reorder point ${S(aL.reorderPoint)}, service level ${S(aL.serviceLevel)}, ${S(aL.iterations)} draws, seed ${S(aL.seed)}. THESE FIGURES ARE SAMPLED AND NEVER GRADED; each is quoted with its seed and draw count.`);
w();
table(['figure', 'lead time, days', 'lead-time demand, seals'], [
  ['mean', f6(L.leadTime.mean), f6(L.leadTimeDemand.mean)], ['P90 (the low figure)', f6(L.leadTime.p90), f6(L.leadTimeDemand.p90)], ['P50', f6(L.leadTime.p50), f6(L.leadTimeDemand.p50)], ['P10 (the high figure)', f6(L.leadTime.p10), f6(L.leadTimeDemand.p10)], ['minimum', f6(L.leadTime.min), f6(L.leadTimeDemand.min)], ['maximum', f6(L.leadTime.max), f6(L.leadTimeDemand.max)],
]);
w();
w(`Stockout probability a cycle ${f6(L.probabilityOfStockout)}, cycle service level ${f6(L.cycleServiceLevel)}, expected units short a cycle ${f6(L.expectedShortPerCycle)}, reorder point for the service level ${f6(L.reorderPointForService)} (seed ${S(aL.seed)}, ${S(aL.iterations)} draws). The engine's reason, verbatim:`);
quote(L.reason);
must('P90 below P50 below P10 for both figures', L.leadTime.p90 < L.leadTime.p50 && L.leadTime.p50 < L.leadTime.p10 && L.leadTimeDemand.p90 < L.leadTimeDemand.p10, 'order');
w();
w('THE P-LABELS. The percentile basis, verbatim:');
quote(L.basis.percentiles);
w();
w('The sentence the engine returns with every call, from lib/conventions/percentile.js, verbatim:');
quote(L.percentileDefinition);
must('the returned sentence is the exceedance definition of lib/conventions/percentile.js', L.percentileDefinition === EXCEEDANCE_DEFINITION, L.percentileDefinition);
w();
w(`READING THE SENTENCE. It is the platform's one convention for P-labels, written for hydrocarbon outcomes, and it names SPE PRMS as the source of that convention (${ref('sources')}; the prms course teaches that framework). For a lead time or a lead-time demand the same words hold: P90 is the figure that the sampled value meets or exceeds in 90 percent of draws, the low figure. More lead time or more demand is worse for stock, so the stockout risk sits at the P10 end, as the basis above says in its own words.`);
w();
// THE DRAWS REPLAYED BY HAND THROUGH lib/stats.
const rng = STATS.mulberry32(aL.seed);
const dd = [];
for (let i = 0; i < aL.iterations; i += 1) {
  const t = STATS.triInvCDF(rng(), aL.leadTimeDays.min, aL.leadTimeDays.mode, aL.leadTimeDays.max);
  const r = STATS.triInvCDF(rng(), aL.demandPerDay.min, aL.demandPerDay.mode, aL.demandPerDay.max);
  dd.push(r * t);
}
const replayOuts = dd.filter((x) => x > aL.reorderPoint).length;
must('the draws replayed by hand through lib/stats give the engine stockout count', replayOuts / aL.iterations === L.probabilityOfStockout, `${replayOuts}`);
w(`THE DRAWS ARE THE CANONICAL ONES. Replayed by hand when this digest was built (mulberry32 on seed ${S(aL.seed)}, a lead-time uniform then a demand uniform per draw, each through triInvCDF), the ${S(aL.iterations)} draws give ${S(replayOuts)} lead-time demands above the reorder point, the engine's count.`);
w();
const Lo = runG('ltr-other-seed');
const Ln = runG('ltr-no-service-level');
w(`ANOTHER SEED, ANOTHER ESTIMATE. The same seal on seed ${S(argsOf('ltr-other-seed').seed)} with ${S(argsOf('ltr-other-seed').iterations)} draws (golden input ltr-other-seed) gives a stockout probability of ${f6(Lo.probabilityOfStockout)} and a reorder point for the service level of ${f6(Lo.reorderPointForService)}. A sampled figure is an estimate that moves with the seed and the draw count, which is why none is graded. With no service level stated (golden input ltr-no-service-level) the reorder point for a service level is ${f6(Ln.reorderPointForService)}, and the basis says: ${Ln.basis.service}.`);
must('the other seed gives a different estimate; no service level gives none', Lo.probabilityOfStockout !== L.probabilityOfStockout && Ln.reorderPointForService === null, 'seed');

/* ============================================================ SECTION 24 */

section('stockouts', 'Stockouts and the reorder point: demand equal to the stock, a reorder point for a service level, and constant inputs', ['Expert m04']);
const eq = runG('ltr-constant-demand-equal-to-stock');
const ab = runG('ltr-constant-demand-above-stock');
w(`DEMAND EQUAL TO THE STOCK IS MET. A stockout is a lead-time demand above the reorder point. With a constant demand of ${S(argsOf('ltr-constant-demand-equal-to-stock').demandPerDay)} a day over a constant ${S(argsOf('ltr-constant-demand-equal-to-stock').leadTimeDays)} days and a reorder point of ${S(argsOf('ltr-constant-demand-equal-to-stock').reorderPoint)} (golden input ltr-constant-demand-equal-to-stock), no draw is a stockout; with a reorder point of ${S(argsOf('ltr-constant-demand-above-stock').reorderPoint)} (golden input ltr-constant-demand-above-stock), every draw is, ${f6(ab.expectedShortPerCycle)} short. The two reasons, verbatim:`);
qg('ltr-constant-demand-equal-to-stock', eq.reason);
qg('ltr-constant-demand-above-stock', ab.reason);
must('equal is met, half a unit short is always a stockout', eq.probabilityOfStockout === 0 && ab.probabilityOfStockout === 1 && ab.expectedShortPerCycle === 0.5, 'equality');
w();
w(`A REORDER POINT FOR A SERVICE LEVEL. With a service level stated, the engine returns the smallest sampled lead-time demand that at least that share of draws does not exceed: the sorted draws at index ceil(level times draws) less 1. For the mechanical seal at ${S(aL.serviceLevel)} it is ${f6(L.reorderPointForService)} seals (seed ${S(aL.seed)}, ${S(aL.iterations)} draws; sampled, never graded), against the stated reorder point ${S(aL.reorderPoint)}, whose sampled cycle service is ${f6(L.cycleServiceLevel)}.`);
w();
const lo = runG('ltr-lead-time-only');
const o1 = runG('ltr-one-iteration');
w(`CONSTANT INPUTS DRAW NOTHING. A number in place of a triangle is a constant, and the engine takes no uniform for it: the basis names it. With a constant demand of ${S(argsOf('ltr-lead-time-only').demandPerDay)} a day and a sampled lead time (golden input ltr-lead-time-only), the basis, verbatim:`);
quote(lo.basis.sampling);
w(`and one draw alone (golden input ltr-one-iteration) returns that draw as every percentile: P90 ${f6(o1.leadTimeDemand.p90)}, P10 ${f6(o1.leadTimeDemand.p10)}.`);
must('one iteration: every percentile the same draw', o1.leadTimeDemand.p90 === o1.leadTimeDemand.p10 && o1.leadTimeDemand.p50 === o1.leadTimeDemand.mean, 'one');
w();
w(`ONE RATE FOR THE WHOLE LEAD TIME. The engine holds one demand rate for a whole lead time, so a high rate is never offset by a low day within the same lead time. It is a stated choice (${ref('choices')}), and a fresh demand draw every day is the alternative that section names.`);

/* ============================================================ SECTION 25 */

section('readings', 'The readings the engine states, where each acts, and the alternative', ['Expert m05 l01', 'Expert m05 l02', 'Expert m05 l04']);
w('A READING is a choice the engine makes where the texts leave room, stated in its own basis, reasons or header. Each is printed here where it acts, with the alternative; no graded figure moves under any alternative (the capstone generator and the discriminate sweep prove it field by field).');
w();
table(['reading', 'where it acts', 'the engine\'s words, verbatim', 'the alternative'], [
  ['READING ONE: two figures that agree to 12 significant digits tie', 'every comparison of a score, share, cost, level or service', bC.rule, 'exact comparison of the doubles'],
  ['READING TWO: the nearest multiple takes halves upward', 'eoq, quantityDiscount, safetyStock rounding', runG('eoq-q-exactly-half-of-multiple').reason, 'halves downward'],
  ['READING THREE: a class minimum is met at or above it', 'criticality', cIn.items[0].reason, 'a minimum met only strictly above it'],
  ['READING FOUR: a discount tie takes the smaller quantity', 'quantityDiscount', tx.reason, 'the larger quantity'],
  ['READING FIVE: a Poisson cycle-service target is met at or above it', 'poissonStock', pm.reason, 'met only strictly above it'],
  ['READING SIX: a Poisson fill-rate target is met at or below the units short it allows', 'poissonStock', pP.basis.rule, 'met only strictly below it'],
  ['READING SEVEN: an ABC tie in value is ranked by id ascending', 'abcClassification', bA.rule, 'by id descending'],
  ['READING EIGHT: a spares tie takes fewer spares', 'insuranceSpares', tf.reason, 'more spares'],
  ['READING NINE: a slow-moving band minimum is reached at or above it', 'slowMoving', bM.rule, 'reached only strictly above it'],
  ['READING TEN: excess is stock strictly above the cover limit', 'slowMoving', bM.rule, 'at or above the limit'],
  ['READING ELEVEN: a lead-time demand equal to the reorder point is met', 'leadTimeRisk', eq.reason, 'equality counted as a stockout'],
  ['READING TWELVE: the reorder point for a service level is the sorted draw at ceil(level times draws) less 1', 'leadTimeRisk', L.basis.service, 'one sorted draw higher'],
  ['READING THIRTEEN: the P90 of a sampled lead time or demand is the low figure', 'leadTimeRisk', L.basis.percentiles, 'P90 read as the high figure'],
]);
w();
w('THE ONE-FOR-ONE INSURANCE MODEL and ONE RATE FOR A WHOLE LEAD TIME are models of the whole calculation; ' + ref('choices') + ' states them with the other conventions that are choices.');

/* ============================================================ SECTION 26 */

section('boundaries', 'Boundaries, rule by rule', ['Expert m05 l03']);
w('Each rule has its own boundary. None is global: some are inclusive, some strict. Every row is the engine\'s answer on a golden input.');
w();
const bnd = [
  ['criticality class minimum', 'score = minimum: in the class', '69.95 below 70: the next class', 'crit-at-cutoff-is-in, crit-just-below-cutoff', cIn.items[0].class === 'V' && cBelow.items[0].class === 'E'],
  ['the 12-digit key', '69.99999999999999 reads as 70: V', '', 'crit-12-digit-key', c12.items[0].class === 'V'],
  ['the override', 'the maximum forces the top class', 'one below does not', 'crit-override-forces-top, crit-override-one-below-max', oF.items[0].class === 'V' && oB.items[0].class === 'E'],
  ['ABC at-or-below', 'cumulative exactly 80: A; exactly 95: B', 'above: the next class', 'abc-cutoff-exact-at-or-below', ex1.items.map((x) => x.class).join() === 'A,B,C'],
  ['ABC include-crossing', 'share before exactly 80: B; exactly 95: C', 'below: the higher class', 'abc-cutoff-exact-include-crossing', ex2.items[1].class === 'B' && ex2.items[2].class === 'C'],
  ['rounding to the nearest', 'the quotient exactly half: up', '', 'eoq-q-exactly-half-of-multiple', half.quantity === 100],
  ['rounding to nothing', 'refused', '', 'eoq-refuse-rounds-to-zero', !!E.eoq(argsOf('eoq-refuse-rounds-to-zero')).error],
  ['a discount tie', 'equal totals: the smaller quantity', '', 'qd-tie-exact', tx.quantity === 100],
  ['the safety factor floor', 'k below the floor: held at the floor', 'no floor: k negative', 'ss-floor-at-zero, ss-negative-k-without-floor', fl.safetyFactor === 0 && nf.safetyFactor < 0],
  ['Poisson cycle service', 'F(s) = target: met', '0.7358 just above F(1): the next level', 'ps-level-exactly-met, ps-level-just-above', pm.level === 1 && pa.level === 2],
  ['the Poisson mean cap', '500 accepted', '502.5 refused; the printed 166.666666 accepted', 'ps-mean-at-cap, ps-refuse-mean-above-cap, ps-printed-bound-accepted', !runG('ps-mean-at-cap').error && !!E.poissonStock(argsOf('ps-refuse-mean-above-cap')).error && !runG('ps-printed-bound-accepted').error],
  ['an insurance tie', 'equal totals: fewer spares', '', 'ins-tie-takes-fewer', tf.spares === 0],
  ['the insurance search', 'the optimum at maxSpares: flagged', '', 'ins-search-limit, ins-free-holding', sl.atSearchLimit && fh.atSearchLimit],
  ['a stockout', 'demand = stock: met', '0.5 short: every draw', 'ltr-constant-demand-equal-to-stock, ltr-constant-demand-above-stock', eq.probabilityOfStockout === 0 && ab.probabilityOfStockout === 1],
  ['a slow-moving band', '12 months: slow', '11.99: active', 'sm-boundaries', sb.AT12.band === 'slow' && sb.BELOW12.band === 'active'],
  ['excess cover', '24 months: inside', '25: one unit excess', 'sm-boundaries', !sb.COVER24.excess && sb.COVER25.excessQuantity === 1],
];
must('the golden file carries the Poisson cap refusal case', !!GC['ps-refuse-mean-above-cap'] && !!GC['eoq-refuse-rounds-to-zero'], 'cases');
table(['rule', 'at the boundary', 'one past it', 'golden inputs'], bnd.map((r) => r.slice(0, 4)));
bnd.forEach((r) => must(`boundary: ${r[0]}`, r[4], r[0]));

/* ============================================================ SECTION 27 */

section('notcomputed', 'What the engine does not compute, and which course owns it', ['Expert m06 l01']);
w('The engine takes these as stated inputs, or leaves them out; each belongs to another course of the academy, which the lessons name in one sentence and do not re-teach:');
w();
table(['not computed here', 'what the engine takes instead', 'the course that owns it'], [
  ['tendering, bid evaluation and contract types', 'a stated price schedule and discount type', 'procurement (Procurement, Tendering & Contracting)'],
  ['terminal and depot stock, product supply and tankage', 'nothing: the engine holds materials and spares', 'supply (Terminals, Depots & Fuel Supply)'],
  ['failure rates from field data and reliability modelling', 'a stated failure rate a year', 'rotating, and the reliability parts of the academy'],
  ['distributions, correlation and Monte Carlo as a subject', 'the canonical seeded sampler of lib/stats, applied to lead-time risk', 'uncertainty'],
  ['discounting and NPV', 'nothing: no figure here is discounted', 'cashflow (Petroleum Economics and Cash Flow)'],
  ['a demand forecast', 'a stated demand and its standard deviation', 'none in this course: the demand is a stated input'],
  ['a repair loop, multi-echelon stock or partial production loss', 'the one-for-one model with one unit down a waiting failure', 'none: a different model, named and left out'],
]);
w();
w('THE ENGINE WRITES NO STOCK POLICY. It computes the figures a policy states; the policy (which items to stock, at which service level, with which criticality scheme, cut-offs and bands) is the user\'s, written down and reviewed.');

/* ============================================================ SECTION 28 */

section('sizecaps', 'Size caps and refusals at scale', ['Expert m06 l02']);
w('Each cap is a stated figure in `DEFAULTS` (' + ref('computes') + '), refused by name with the cap in the message. Calls at and beyond the caps (golden inputs, and stated probes where named):');
w();
const capI = refusal('leadTimeRisk above the draw cap', E.leadTimeRisk(argsOf('ltr-refuse-iterations-cap')), 'iterations');
const capP = refusal('poissonStock above the mean cap', E.poissonStock(argsOf('ps-refuse-mean-above-cap')), 'leadTime');
const capS = refusal('insuranceSpares above the spares cap', E.insuranceSpares(argsOf('ins-refuse-max-cap')), 'maxSpares');
const bigItems = Array.from({ length: D.MAX_ITEMS + 1 }, (_, i) => ({ id: `I${i}`, annualUsage: 1, unitCost: 1 }));
const capA = refusal('abcClassification with 5001 items (stated probe)', E.abcClassification({ items: bigItems, cutoffs: { aPct: 80, bPct: 95 }, boundaryRule: 'at-or-below' }), 'items');
const atA = success('abcClassification with 5000 items (stated probe)', E.abcClassification({ items: bigItems.slice(0, D.MAX_ITEMS), cutoffs: { aPct: 80, bPct: 95 }, boundaryRule: 'at-or-below' }));
table(['call', 'result'], [
  ['leadTimeRisk with 200001 draws (golden input ltr-refuse-iterations-cap)', capI.error],
  ['poissonStock with a Poisson mean above 500 (golden input ps-refuse-mean-above-cap)', capP.error],
  ['poissonStock at a mean of exactly 500 (golden input ps-mean-at-cap)', `accepted: level ${S(runG('ps-mean-at-cap').level)}`],
  ['insuranceSpares with maxSpares 1001 (golden input ins-refuse-max-cap)', capS.error],
  [`abcClassification with ${S(D.MAX_ITEMS + 1)} items (stated probe)`, capA.error],
  [`abcClassification with ${S(D.MAX_ITEMS)} items (stated probe)`, `accepted: ${S(atA.items.length)} items ranked`],
]);
must('the golden file carries the three cap refusal cases', ['ltr-refuse-iterations-cap', 'ps-refuse-mean-above-cap', 'ins-refuse-max-cap'].every((id) => GC[id]), 'caps');
w();
w('A PRINTED MAXIMUM IS ACCEPTED WHEN TYPED BACK. Where the largest accepted value has more than six decimals, the engine prints it rounded toward the accepted side and says so, and the printed figure is accepted (golden input ps-printed-bound-accepted, a lead time of ' + S(argsOf('ps-printed-bound-accepted').leadTime) + ' at a demand of ' + S(argsOf('ps-printed-bound-accepted').demandRate) + ' a period: level ' + S(runG('ps-printed-bound-accepted').level) + ').');

/* ============================================================ SECTION 29 */

section('choices', 'Conventions that are choices, and writing the stock policy', ['Expert m06 l03', 'Expert m06 l04']);
w('Each convention below is a stated choice of the engine, recorded in FINDINGS-inventory.md and accepted by the lead. A lesson teaches each as a choice, with its alternative, and a figure quoted under it says so.');
w();
table(['convention', 'the choice', 'the alternative'], [
  ['ties', 'two figures that agree to 12 significant digits tie', 'exact comparison'],
  ['rounding', 'a stated rule; the nearest takes halves upward', 'halves downward, or to even'],
  ['holding cost', 'stated directly, or as a rate on the unit cost (exactly one), charged on the units held', 'a holding charge that also carries interest on the set-up cost, as Harris 1913 writes it'],
  ['the lead-time spread', 'enters on the lead time only; the review period is fixed', 'a spread on the review period too'],
  ['lead-time risk', 'one demand rate held for the whole lead time', 'a fresh demand draw every day'],
  ['insurance spares', 'the one-for-one pipeline, one unit down a waiting failure, holding on every spare bought', 'a repair loop, partial loss, or holding on spares in stock only'],
  ['the print rule', 'money to the cent and computed figures to six decimals inside a message; stated inputs as given', 'fixed decimals everywhere'],
]);
w();
w('WRITING THE STOCK POLICY names: the register (synthetic in this course) with each item\'s usage, cost, scores and stock; the criticality criteria, weights, scale, class minimums and override; the ABC cut-offs and boundary rule; for each ordered item the demand, order cost, holding cost and rounding rule, and any price schedule with its discount type; for each stocked item the demand and its spread, the lead time and its spread, the review period, the service measure and level, the order quantity, the safety-factor rounding and floor; for each insurance spare the failure rate, lead time, days a year, unit cost, holding rate, downtime cost and search limit; the slow-moving bands, write-downs and cover limit; each sampled figure with its seed and draws; each source applied with its edition, licence and the date read; and each reading the figures rest on.');

/* ============================================================ SECTION 30 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Seven terms in this course carry a narrower meaning than they have in conversation. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['term', 'what it can mean elsewhere', 'the rule here'], [
  ['service level', 'any measure of how well stock serves', 'always names its measure: the cycle service level (the probability of no stockout in a cycle) or the fill rate (the fraction of demand met from stock)'],
  ['safety stock', 'any stock held back', 'k times sigma over the protection period; the reorder point and the order-up-to level are named as such'],
  ['EOQ', 'the quantity ordered', 'the unrounded square-root figure; the quantity ordered is the one the stated rounding rule gives'],
  ['criticality class', 'how important an item is', 'the class the stated criteria, weights and minimums give (V, E and D in the Ekene policy), a different thing from the ABC class'],
  ['P90', 'the 90th percentile of anything', 'of a sampled lead time or demand, the low figure: met or exceeded in 90 percent of draws'],
  ['obsolete, slow and excess', 'old or unwanted stock', 'always of a stated band or a stated cover limit'],
  ['insurance spare', 'any spare kept just in case', 'a spare sized by the stated one-for-one model at a stated failure rate, lead time and downtime cost'],
]);
w();
w('A FIGURE THAT DEPENDS ON AN INPUT is quoted with it: a class with its criteria, weights and minimums; an ABC class with its cut-offs and boundary rule; an EOQ with its costs, and a quantity ordered with its rounding rule; a safety stock with its demand, spreads, lead time, review period, service measure and level; a number of spares with its failure rate, lead time and costs; a write-down with its band; a sampled figure with its seed and draws.');

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', process.env.SC3_DUMP_PARTIAL || unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', process.env.SC3_DUMP_PARTIAL || SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
// "undefined" reaches the digest only inside the engine's own refusal messages, where it is the value the engine got.
must('no NaN or Infinity reaches the digest, and undefined only inside a verbatim refusal', !OUT.some((l) => /\bNaN\b|Infinity/.test(l)) && OUT.filter((l) => /\bundefined\b/.test(l)).every((l) => /got undefined/.test(l) || /prints as undefined/.test(l)), OUT.find((l) => /\bNaN\b|Infinity/.test(l)));
must('no em or en dash reaches the digest', !OUT.some((l) => /[–—]/.test(l)), OUT.find((l) => /[–—]/.test(l)));
must('the negative control list names plants the discriminate sweep reuses', /P90 and P10 swapped/.test(NEGCONTROL) && /draw order swapped/.test(NEGCONTROL), 'negcontrol');

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`materials_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.SC3_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`materials_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
