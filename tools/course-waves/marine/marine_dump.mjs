// THE SC4 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S VALIDATION FILES ARE NOT TEACHING TRUTH. The oracle, the golden
// file's expected figures, the fixture README, the negative control, the
// engine's own source comments and FINDINGS-marine.md are PROVENANCE. Where
// they state a figure this file recomputes it through the engine on the
// vendored golden INPUTS, on the fixture, or on stated inputs, and prints it.
// The digest checks FINDINGS' sources table and its lead decisions.
//
// Usage:  sh /root/cat-wip-marine/build_digest.sh > digest.tmp && mv digest.tmp digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE
// (engines/supplychain/marineLogistics.js and the canonical functions it
// imports: mulberry32, triInvCDF and basicStats from lib/stats/stats.js; the
// exceedance sentence from lib/conventions/percentile.js), except where a
// line says "stated" (an input typed in this file and printed beside the call
// it went into), "golden input" (an input read from the vendored
// test-data/supplychain/goldens/marine_cases.json, whose inputs are the Ekene
// synthetic fixture, stated probes and the published checks), "fixture" (read
// from the vendored ekene-marine file), "text" (a figure printed by a source,
// cited with its table, equation or example; each is checked against the text
// by quote_check.py, and no source's prose is quoted) or "derived" (arithmetic
// on engine values printed in the same block, with the arithmetic stated).
// Nothing here reads a clock, a random number, a locale or a network; TZ and
// LC_ALL are pinned by build_digest.sh. The one Monte Carlo the engine runs
// (fleetVariability) is seeded by a stated seed, so its figures reproduce, and
// every one of them is printed with its seed and its draw count.
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
// THE DIGEST IS NOT THE CAPSTONE. This file never reads marine_capstone.mjs,
// fields.json or the capstone cases, and the capstone never reads this.
//
// NO SOURCE PROSE. Adan and Resing and Iversen print no licence, so their
// figures and formulas are cited and their prose is never quoted; Wikipedia is
// CC BY-SA 4.0, so it is cited and never pasted; Aas, Halskau and Wallace is
// taught by concept only; Skoko et al. and the arXiv paper are CC BY 4.0 and
// are cited by table and equation. gate_no_source_prose.py refuses any
// eight-word run of any of the six texts in the digest and in everything a
// learner reads.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.SC4_WAVE_DIR || '/root/cat-wip-marine';
const { M: E, PCT, ROOT, ENGINE_REL } = await import(`${HERE}/marine_engine.mjs`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/supplychain/goldens/marine_cases.json`, 'utf8'));
const FX = JSON.parse(fs.readFileSync(`${ROOT}/test-data/supplychain/ekene-marine/marine.json`, 'utf8'));
const FXREADME = fs.readFileSync(`${ROOT}/test-data/supplychain/ekene-marine/README.md`, 'utf8');
const NEGCONTROL = fs.readFileSync(`${ROOT}/tools/validation/supplychain/negcontrol_marine.sh`, 'utf8');
const FINDINGS = fs.readFileSync(`${ROOT}/tools/validation/supplychain/FINDINGS-marine.md`, 'utf8');
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
  if (x === null || x === undefined) return 'not given';
  const s = Number(x).toFixed(6);
  const t = Number(s) === 0 ? (0).toFixed(6) : s;
  return t.replace(/^-/, '').replace('.', '').replace(/^0+/, '').length > 15 ? group(t) : t;
};
const S = (x) => String(x);
// A count prints whole when it is whole (voyages rounded up, vessels) and to six decimals when it is not (the rule "none").
const cnt = (x) => (Number.isInteger(x) ? S(x) : f6(x));
const list = (a) => (a.length ? a.join(', ') : 'none');
const clone = (o) => JSON.parse(JSON.stringify(o));
// A pipe inside a table cell is escaped (\|), so a message prints exactly as the engine writes it.
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
const ORDER = ['computes', 'sources', 'published', 'dataset', 'refusals', 'graded',
  'units', 'routes', 'weather', 'fuel', 'capacity', 'binding', 'endtoend',
  'demand', 'vesseldays', 'vessels', 'deckcargo', 'ffd', 'packing',
  'queue', 'mmc', 'mdc', 'variability', 'readings', 'boundaries', 'quirks', 'notcomputed', 'sizecaps', 'choices',
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
const reasons = (rs) => { if (rs.length) rs.forEach((r) => quote(r)); else w('(the engine returns no reason)'); };

/* ---------------------------------------------------------- the engine runs */

const GC = Object.fromEntries(GOLD.cases.map((c) => [c.id, c]));
const isRefusalCase = (c) => c.expected && c.expected.error === true;
const runG = (id) => {
  const c = GC[id];
  must(`the golden file carries the case ${id}`, !!c, id);
  return success(`${c.fn} on the golden input ${id}`, E[c.fn](clone(c.args)));
};
const argsOf = (id) => clone(GC[id].args);
const D = E.DEFAULTS;
const { EXCEEDANCE_DEFINITION } = PCT;
// THE FIGURES THE TEXTS PRINT, typed ONCE here with their citation. Each is
// checked against its text by quote_check.py (which reads the texts), and
// each is printed as the text prints it. None is computed from.
const TEXT = {
  ar51: { cite: 'Adan and Resing (2015), Table 5.1', rows: [['1', '0.90', '9.00'], ['2', '0.85', '4.26'], ['5', '0.76', '1.53'], ['10', '0.67', '0.67'], ['20', '0.55', '0.28']] },
  ar52: { cite: 'Adan and Resing (2015), Table 5.2', rows: [['1', '0.90', '9.00', '9'], ['2', '0.95', '9.26', '19'], ['5', '0.98', '9.50', '51'], ['10', '0.99', '9.64', '105'], ['20', '0.995', '9.74', '214']] },
  iv: { cite: 'Iversen (2001), Example 12.3.1', s1: '100', a1: '20', n1: '32', w1: '0.075', s2: '10', a2: '2', n2: '5', w2: '0.199', total: '0.274' },
  sk1: { cite: 'Skoko et al. (2024), Tables 1 and 4', sail: '0.5', port: '0.03', price: '870', sailDay: '10,440.00', portDay: '626.4', psvNmDay: '240', ahtsNmDay: '264', usable: '85%' },
  sk5: { cite: 'Skoko et al. (2024), Tables 5 and 7', ahtsMarine: '7.00', ahtsNav: '0.60', ahtsPort: '2.40', ahtsFuel: '80,847.36', psvPort: '3.81', psvSail: '13.18', psvFacility: '2.40', psvStbyPort: '2.40', psvSupply: '4.14', psvFuel: '186,274.10' },
  ffd: { cite: 'Wikipedia, First-fit-decreasing bin packing (revision 1317275412)', b60: '{44,8,8}, {24,24,6,6}, {22,21,17}', b61: '{44,17}, {24,24,8}, {22,21,8,6}, {6}', hl: '{51,12,12}, {28,28,10}, {28,27,10,10}, {25,10,10,10,10,10}', dosaBins: '8', dosaOpt: '6' },
};
const EXPORTS = [
  ['voyagePlan', 'the voyages of one vessel on a stated route', 'vessel, products, installations (each with its cargo), route, portHours, weather, fuelPricePerT', 'per voyage the legs, the hours by activity with the weather factor, the days, the fuel by activity, the fuel cost, the load, the utilisation of every capacity constraint, the binding constraint, every overloaded constraint and the reasons; the totals over the voyages'],
  ['fleetSize', 'the fleet a period\'s demand needs', 'vessel, products, installations (each with its demand and minimum visits), route, portHours, weather, fuelPricePerT, periodDays, vesselAvailableDays, voyageRounding, vesselRounding', 'per voyage set the voyages before and after rounding and what drives them, the hours, the voyage days and the vessel-days; the vessel-days, the vessels before and after rounding, spare or short vessel-days, the fleet utilisation, the fuel and its cost for the period'],
  ['fleetVariability', 'the fleet under weather and demand variability', 'every fleetSize input with the weather factor a number or a triangular, demandFactor, plannedVessels, iterations, seed', 'the plan at the modes; the vessel-days and the vessels required as mean, P90, P50, P10, min and max; the distribution of whole vessels; the probability of being short and the expected short vessel-days for the planned vessels; the exceedance sentence'],
  ['deckPlan', 'the deck cargo of a stated number of voyages', 'deck, items, voyages, rule', 'the packing order, the usable area, each voyage\'s units, area, weight and their utilisations, the voyages used, every overflow unit with its reason, the totals and the lower bound'],
  ['shoreBase', 'the berth queue at the supply base', 'berths, arrivalsPerDay, workingHoursPerDay, service, model, targetMeanWaitHours (optional)', 'the service hours, the arrivals an hour, the offered load, the berth utilisation, the probability of waiting (M/M/c), the mean queue, the mean wait, the mean time at the base, the mean in the system; with a target, the fewest berths that meet it'],
];

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# SC4 TEACHING DIGEST: Offshore & Marine Logistics');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The oracle, the golden file\'s expected figures, the fixture README, the negative control and the engine source comments are PROVENANCE; none of them is teaching truth.');
w();
w('# PRECISION. Every distance, speed, time in hours or days, vessel-day, fuel tonnage, amount of money, area, weight, volume, fraction, utilisation, probability, factor, count that is not whole and queue figure prints to SIX decimals; whole counts (voyages rounded up, vessels, berths, units, draws, seeds) and whole inputs print as whole numbers; a figure of sixteen or more significant digits at six decimals prints with its thousands grouped by commas; an engine message, reason and basis is printed verbatim, figures and all. Inside a message the engine prints money rounded to the cent and a computed quantity to six decimals (both half away from zero, trailing zeros dropped), and a stated input as it was given.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines 110f0a0 (engines PRs #282 and #283, the second its validation record FINDINGS-marine.md with the lead's decisions), ${engineLines} lines, at its canonical path in the NextGen repository. It imports mulberry32, triInvCDF and basicStats from lib/stats/stats.js and EXCEEDANCE_DEFINITION from lib/conventions/percentile.js, and nothing else. It makes no network call.`);
w();
w('# AN APP COURSE. The Suite app for this course is the Marine Logistics Planner, in the Suite\'s Midstream & Downstream module, which runs this same engine file (the same blob). Every practical in this course also runs in the course\'s own four calculator panels, which call the vendored engine on the learner\'s own inputs, so a learner without a Suite seat can work every exercise.');
w();
w('# THE DATA. Every Ekene installation, vessel, product, leg, cargo, demand, deck item and supply base term is SYNTHETIC, written for this platform by a stated script. No real company, vessel, port, installation or contract appears.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone case and no graded answer. The capstones run their own clusters and the digest never names them.');
w();
w(`# NO SOURCE PROSE. The course cites its sources by table, equation and example and writes every explanation in its own words; none of their prose is quoted (${ref('sources')}).`);
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming the rules it applied and where they come from, so the working can be printed; voyagePlan and fleetSize also return `reasons`, and a shoreBase target returns its own reason.');
w();
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof E[name] === 'function', typeof E[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(E).filter((k) => typeof E[k] === 'function').length === EXPORTS.length, Object.keys(E).filter((k) => typeof E[k] === 'function').join(','));
w();
w('The stated constants, read from the exported `DEFAULTS` and `ACTIVITIES`:');
w();
const DSRC = {
  TIE_DIGITS: 'the significant digits two figures must agree to for a tie, a capacity check or a count rounded up',
  MAX_INSTALLATIONS: 'the most installations one call accepts',
  MAX_PRODUCTS: 'the most bulk products one call accepts',
  MAX_ITEM_LINES: 'the most item lines one deck plan accepts',
  MAX_UNITS: 'the most units (item lines times quantities) one deck plan accepts',
  MAX_QUANTITY: 'the largest quantity one item line accepts',
  MAX_DECK_VOYAGES: 'the most voyages one deck plan accepts',
  MAX_BERTHS: 'the most berths a shore base, or its target search, accepts',
  MAX_WEATHER_FACTOR: 'the largest weather factor accepted (the smallest is 1)',
  MAX_ITERATIONS: 'the most Monte Carlo draws one fleetVariability call accepts',
  MAX_DRAWS: 'the most iterations times voyage sets one fleetVariability call accepts',
};
table(['constant', 'value', 'what it sets', 'kind'], Object.entries(D).map(([k, v]) => [`\`DEFAULTS.${k}\``, S(v), DSRC[k], k === 'TIE_DIGITS' ? 'engine convention' : 'cap']));
must('DEFAULTS carries eleven values, each described here', Object.keys(D).length === 11 && Object.keys(D).every((k) => DSRC[k]), Object.keys(D));
must('DEFAULTS and ACTIVITIES are frozen', Object.isFrozen(D) && Object.isFrozen(E.ACTIVITIES), 'frozen');
must('ACTIVITIES are sailing, port and field, in that order', E.ACTIVITIES.join() === 'sailing,port,field', E.ACTIVITIES.join());
w();
w(`\`ACTIVITIES\` is ${E.ACTIVITIES.map((a) => `"${a}"`).join(', ')}: the three kinds of time a voyage spends, each with its own stated fuel burn, and the names a weather factor is applied to.`);
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports and its source:');
const IMPORTS = [...ENGINE_SRC.matchAll(/^import [\s\S]*? from '([^']+)';$/gm)].map((m) => m[1]);
must('the engine imports exactly lib/stats and lib/conventions/percentile.js', IMPORTS.join() === '../../lib/stats/stats.js,../../lib/conventions/percentile.js', IMPORTS.join());
must('the engine source makes no network call, reads no clock and draws no random number of its own', !/\bfetch\x28|XMLHttpRequest|\bimport\x28|require\x28|Math\.random|Date\.now|new Date\x28\x29/.test(ENGINE_SRC), 'none');
must('the engine source computes no NPV and discounts nothing', !/\bnpv\b|discount/i.test(ENGINE_SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'no npv');
w('- Its two imports are lib/stats/stats.js (the canonical seeded Monte Carlo: mulberry32, the triangular inverse CDF triInvCDF and the summary basicStats) and lib/conventions/percentile.js (the exceedance sentence). It carries no sampler and no percentile code of its own. The one function that samples is fleetVariability, on the stated seed. It discounts nothing and computes no NPV.');
w(`- It decides nothing an input does not state. Every speed, distance, leg, time, capacity, usable fraction, density, tank, fuel burn, fuel price, weather factor and the activities it applies to, demand, minimum visits, period, available days, rounding rule, footprint, weight, quantity, packing rule, berth count, arrival rate, working day, service term, queue model, distribution, planned fleet, draw count and seed is an input with no default, and a call without one is refused by name (${ref('refusals')}). The only figures it holds are its caps and the tie rule in \`DEFAULTS\`.`);
must('ACCEPTED_KEYS carries one shape for every exported function', Object.keys(E.ACCEPTED_KEYS).sort().join() === EXPORTS.map((x) => x[0]).sort().join() && Object.isFrozen(E.ACCEPTED_KEYS), Object.keys(E.ACCEPTED_KEYS).join());
w(`- It reads no key it does not know. \`ACCEPTED_KEYS\` is exported with one shape for each of the ${EXPORTS.length} functions, and every call refuses an input key the function does not read, at every level, naming the key, its path and the accepted keys; a bulk or tank key must be a stated product id. A misspelt optional key is refused; it is never dropped silently.`);
w(`- It plans no vessel schedule by the clock, sets no hire rate, fits no distribution to data, stacks no cargo, checks no deck shape and computes no port cost. ${refCap('notcomputed')} lists each with the course that owns it.`);
w(`- Its exported names are, in full: ${Object.keys(E).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('sources', 'The sources, their editions and licences, and the date each was read', ['Associate m01 l02', 'Expert m05 l04', 'Expert m06']);
w('THE RULE THIS COURSE FOLLOWS FOR EVERY SOURCE. Each one is named with its edition or date, its licence and the date it was read. The course quotes none of their prose: a text with no licence printed is cited for its figures and formulas; a CC BY-SA text is cited without pasting its wording; a publisher\'s text is taught by concept; a CC BY 4.0 text is cited by table and equation. Every figure the engine applies is a stated input with no default. Every text below was read on 2026-09-27.');
w();
const SOURCES = [
  ['I. Adan and J. Resing, Queueing Systems (lecture notes, Eindhoven University of Technology)', '26 March 2015', 'no licence printed', 'ch. 5 (eqs 5.1 to 5.3, the M/M/c delay probability, mean queue and mean wait; Tables 5.1 and 5.2); s. 3.4 Little\'s law; s. 7.6 eqs 7.14 to 7.16 (the Pollaczek-Khinchin mean value formula); s. 11.3 the Erlang B recursion (11.3) and remark 11.3.2', 'FIGURES AND FORMULAS ONLY: never quoted'],
  ['V. B. Iversen, Teletraffic Engineering Handbook (ITU-D Study Group 2 Question 16 and ITC)', 'draft, 20 June 2001', 'an ITU document; no licence printed', 's. 12.2 Erlang\'s C formula; Example 12.3.1 (two delay systems and their mean waits)', 'FIGURES AND FORMULAS ONLY: never quoted'],
  ['B. Liu, T. P. Pantelidis, S. Tam and J. Y. J. Chow, An EV charging station access equilibrium model with M/D/C queueing', 'arXiv 2102.05851v2 (11 February 2021)', 'CC BY 4.0', 'eq. (2): the Cosmetatos (1975) approximation for the M/D/c mean wait, and the statement that M/D/c has no closed form for its mean delay', 'cited by equation'],
  ['I. Skoko, Z. Lusic, Z. Sanchez-Varela and Z. Boko, Optimization Model for Selection of the Offshore Fleet Structure, J. Mar. Sci. Eng. 12(2), 263', '1 February 2024', 'CC BY 4.0', 'Table 1 (fuel burn by activity and the daily fuel cost at USD 870 a tonne), Table 4 (the daily distance at the economic speed; the usable share of capacity), Tables 5 and 7 (the optimal days by activity and the optimal fuel cost)', 'cited by table'],
  ['B. Aas, O. Halskau and S. W. Wallace, The role of supply vessels in offshore logistics, Maritime Economics & Logistics 11(3), 302-325', '2009 (accepted manuscript, Lancaster EPrints 45409)', 'publisher copyright', 'deck cargo measured in square metres with no stacking; bulk in segregated tanks; the economical speed; weather limits on sailing and on offshore loading', 'BY CONCEPT ONLY: never quoted'],
  ['Wikipedia, First-fit-decreasing bin packing', 'revision 1317275412 (17 October 2025)', 'CC BY-SA 4.0', 'the first-fit decreasing rule (Johnson 1973); the capacity 60 and 61 example (Coffman, Garey and Johnson 1978); Huang and Lu (2021) Example 5.1; the tight example of Dosa (2007)', 'CITED BY SECTION AND EXAMPLE: its wording is not pasted'],
];
table(['text', 'edition or date', 'licence', 'what the course reads from it', 'how the course uses it', 'date read'], SOURCES.map((r) => [...r, '2026-09-27']));
w();
must('FINDINGS records every source as read on 2026-09-27', FINDINGS.includes('## Sources (all read 2026-09-27)'), 'read date');
[['f1a6a2882c6cc19b', 'Adan and Resing'], ['f205c11399f67587', 'Iversen'], ['fa41bfc9b70e2f5b', 'the arXiv paper'], ['e94a40e568ae1e52', 'Skoko et al.'], ['1d72cae6328c2eee', 'Aas et al.'], ['262c1e6630071a13', 'the Wikipedia article']]
  .forEach(([h, what]) => must(`FINDINGS records the sha256 prefix of ${what}`, FINDINGS.includes(h), h));
must('FINDINGS carries the lead\'s decisions', FINDINGS.includes('## Lead decisions (2026-09-27)') && /taught as a printed slip/.test(FINDINGS) && /PSV total is left out/.test(FINDINGS), 'lead decisions');
w('NOT USED. No openly readable offshore paper was found that prints a deterministic fleet-sizing example with its inputs and a vessel count, so the course validates fleet sizing through its published parts (the Skoko et al. fuel and distance tables) and teaches the sizing rule as the engine states it. Fagerholt and Lindstad (2000), Halvorsen-Weare et al. (2012) and Maisiuk and Gribkovskaia (2014) were paywalled or blocked where they were sought, and IMCA and GOMO guidance was not used.');
w();
w('The engine carries its citations in its own words. The `basis` of one call of each function, verbatim:');
w();
const bV = runG('ekene-voyage-milk-run-psv').basis;
const bF = runG('ekene-fleet-psv-milk-run').basis;
const bM = runG('ekene-variability-psv-milk-run').basis;
const bD = runG('ekene-deck-one-voyage-ffd').basis;
const bB = runG('ekene-base-mmc').basis;
const bBd = runG('ekene-base-mdc').basis;
table(['call', 'basis key', 'the engine\'s basis, verbatim'], [
  ['voyagePlan (ekene-voyage-milk-run-psv)', 'rule', bV.rule], ['voyagePlan (ekene-voyage-milk-run-psv)', 'source', bV.source],
  ['fleetSize (ekene-fleet-psv-milk-run)', 'rule', bF.rule], ['fleetSize (ekene-fleet-psv-milk-run)', 'source', bF.source],
  ['fleetVariability (ekene-variability-psv-milk-run)', 'rule', bM.rule], ['fleetVariability (ekene-variability-psv-milk-run)', 'source', bM.source],
  ['deckPlan (ekene-deck-one-voyage-ffd)', 'rule', bD.rule], ['deckPlan (ekene-deck-one-voyage-ffd)', 'source', bD.source],
  ['shoreBase (ekene-base-mmc)', 'rule', bB.rule], ['shoreBase (ekene-base-mmc)', 'source', bB.source],
  ['shoreBase (ekene-base-mdc)', 'rule', bBd.rule], ['shoreBase (ekene-base-mdc)', 'source', bBd.source],
]);
must('every basis the table prints is a non-empty string', [bV, bF, bM, bD, bB, bBd].every((b) => typeof b.rule === 'string' && b.rule.length > 10 && typeof b.source === 'string' && b.source.length > 10), 'basis');
w();
w('THE ENGINE\'S OWN WORDS ARE NOT A QUOTATION. The basis lines cite each source by table, equation and section and state its formula in the engine\'s own words; a lesson that needs one of those ideas teaches it from the citation, the engine\'s stated arithmetic and the course\'s own words.');

/* ============================================================ SECTION 3 */

section('published', 'The published checks the engine reproduces', ['Associate m03 l04', 'Professional m06', 'Expert m02 l04', 'Expert m02 l05', 'Expert m05 l04']);
w('Nine printed figures or sets of figures from the sources are run through the engine. Each printed figure is cited as its source prints it (text); every other number is the engine\'s. quote_check.py checks that each text prints each figure cited here.');
w();
// Adan and Resing Table 5.1
const two = (x) => (Math.round(x * 100) / 100).toFixed(2);
const r51 = [1, 2, 5, 10, 20].map((c) => runG(`adan-resing-table-5-1-c${c}`));
const a51 = [1, 2, 5, 10, 20].map((c) => argsOf(`adan-resing-table-5-1-c${c}`));
w(`CHECK ONE: ADAN AND RESING, TABLE 5.1 (text: the M/M/c delay probability and mean wait for a mean service time of 1 and an occupation rate of 0.9, at 1, 2, 5, 10 and 20 servers). The golden inputs adan-resing-table-5-1-c1 to adan-resing-table-5-1-c20 state a service of ${S(a51[0].service.fixedHours)} fixed hour, a working day of ${S(a51[0].workingHoursPerDay)} hours and ${a51.map((a) => S(a.arrivalsPerDay)).join(', ')} arrivals a day, so the offered load is 0.9 per berth. The engine returns:`);
w();
table(['golden input', 'berths', 'arrivals a day (golden input)', 'berth utilisation (engine)', 'delay probability (engine)', 'printed (text)', 'mean wait (engine)', 'the engine\'s mean wait at two decimals (derived)', 'printed (text)'],
  r51.map((r, i) => [`adan-resing-table-5-1-c${TEXT.ar51.rows[i][0]}`, TEXT.ar51.rows[i][0], S(a51[i].arrivalsPerDay), f6(r.berthUtilisation), f6(r.probabilityWait), TEXT.ar51.rows[i][1], f6(r.meanWaitHours), two(r.meanWaitHours), TEXT.ar51.rows[i][2]]));
r51.forEach((r, i) => {
  must(`AR 5.1 c=${TEXT.ar51.rows[i][0]}: the delay probability rounds to the printed figure`, two(r.probabilityWait) === TEXT.ar51.rows[i][1], `${r.probabilityWait}`);
  if (i !== 2) must(`AR 5.1 c=${TEXT.ar51.rows[i][0]}: the mean wait rounds to the printed figure`, two(r.meanWaitHours) === TEXT.ar51.rows[i][2], `${r.meanWaitHours}`);
});
must('AR 5.1 c=5: the exact mean wait rounds to 1.52 and the table prints 1.53', two(r51[2].meanWaitHours) === '1.52' && TEXT.ar51.rows[2][2] === '1.53', r51[2].meanWaitHours);
const slip = Number(TEXT.ar51.rows[2][2]) - r51[2].meanWaitHours;
w();
w(`A PRINTED SLIP AT FIVE BERTHS. Every printed figure in the table is the engine's figure rounded to two decimals except one: at 5 berths the engine's mean wait is ${f6(r51[2].meanWaitHours)}, which rounds to ${two(r51[2].meanWaitHours)}, and the table prints ${TEXT.ar51.rows[2][2]} (text). The printed figure sits ${f6(slip)} above the engine's (derived: ${TEXT.ar51.rows[2][2]} less ${f6(r51[2].meanWaitHours)}), which is more than the half unit of 0.005 a two-decimal rounding allows. The course teaches it as a slip in the printed table; the engine's figure is the one the formula gives.`);
must('the slip is above 0.005', slip > 0.005 && slip < 0.0051, slip);
w();
// Table 5.2
const r52 = [1, 2, 5, 10, 20].map((c) => runG(`adan-resing-table-5-2-c${c}`));
const a52 = [1, 2, 5, 10, 20].map((c) => argsOf(`adan-resing-table-5-2-c${c}`));
w('CHECK TWO: ADAN AND RESING, TABLE 5.2 (text: a fixed surplus capacity of 0.1 server, so the occupation rate rises with the number of servers). The golden inputs adan-resing-table-5-2-c1 to adan-resing-table-5-2-c20 state the same service and working day with the arrivals below:');
w();
table(['golden input', 'berths', 'arrivals a day (golden input)', 'berth utilisation (engine)', 'printed rho (text)', 'mean wait (engine)', 'printed (text)', 'mean in the system (engine)', 'printed (text)'],
  r52.map((r, i) => [`adan-resing-table-5-2-c${TEXT.ar52.rows[i][0]}`, TEXT.ar52.rows[i][0], S(a52[i].arrivalsPerDay), f6(r.berthUtilisation), TEXT.ar52.rows[i][1], f6(r.meanWaitHours), TEXT.ar52.rows[i][2], f6(r.meanInSystem), TEXT.ar52.rows[i][3]]));
r52.forEach((r, i) => {
  must(`AR 5.2 c=${TEXT.ar52.rows[i][0]}: the mean wait rounds to the printed figure`, two(r.meanWaitHours) === TEXT.ar52.rows[i][2], r.meanWaitHours);
  must(`AR 5.2 c=${TEXT.ar52.rows[i][0]}: the mean in the system rounds to the printed whole number`, Math.round(r.meanInSystem) === Number(TEXT.ar52.rows[i][3]), r.meanInSystem);
});
w();
w('Every printed figure of Table 5.2 is the engine\'s figure rounded, to two decimals for the wait and to a whole number for the mean in the system (checked when this digest is built).');
w();
// Iversen
const iv1 = runG('iversen-2001-example-12-3-1-system-1');
const iv2 = runG('iversen-2001-example-12-3-1-system-2');
const ivA1 = argsOf('iversen-2001-example-12-3-1-system-1');
const ivA2 = argsOf('iversen-2001-example-12-3-1-system-2');
w(`CHECK THREE: IVERSEN, EXAMPLE 12.3.1 (text: two M/M/n delay systems, the first with a mean service time of ${TEXT.iv.s1} s, ${TEXT.iv.a1} erlang and ${TEXT.iv.n1} channels, the second with ${TEXT.iv.s2} s, ${TEXT.iv.a2} erlang and ${TEXT.iv.n2} channels; mean waits of ${TEXT.iv.w1} s and ${TEXT.iv.w2} s, ${TEXT.iv.total} s in total). The golden inputs read the second as the hour: a fixed service of ${S(ivA1.service.fixedHours)} and ${S(ivA2.service.fixedHours)}, ${S(ivA1.berths)} and ${S(ivA2.berths)} berths, ${S(ivA1.arrivalsPerDay)} and ${S(ivA2.arrivalsPerDay)} arrivals a day over a ${S(ivA1.workingHoursPerDay)}-hour day, so the offered loads are ${f6(iv1.offeredLoad)} and ${f6(iv2.offeredLoad)} (engine).`);
w();
table(['system', 'offered load (engine)', 'delay probability (engine)', 'mean wait (engine)', 'printed (text)'], [
  ['first (golden input iversen-2001-example-12-3-1-system-1)', f6(iv1.offeredLoad), f6(iv1.probabilityWait), f6(iv1.meanWaitHours), TEXT.iv.w1],
  ['second (golden input iversen-2001-example-12-3-1-system-2)', f6(iv2.offeredLoad), f6(iv2.probabilityWait), f6(iv2.meanWaitHours), TEXT.iv.w2],
]);
const ivSum = iv1.meanWaitHours + iv2.meanWaitHours;
w();
w(`The two mean waits add to ${f6(ivSum)} (derived), which rounds to the printed ${TEXT.iv.total} at three decimals; each engine figure rounds to its printed figure at three decimals.`);
must('Iversen: each wait rounds to the printed figure and the sum to 0.274', iv1.meanWaitHours.toFixed(3) === TEXT.iv.w1 && iv2.meanWaitHours.toFixed(3) === TEXT.iv.w2 && ivSum.toFixed(3) === TEXT.iv.total, `${iv1.meanWaitHours} ${iv2.meanWaitHours}`);
w();
// Skoko Tables 1 and 4
const sk1 = runG('skoko-2024-table1-psv-daily-fuel');
const sk1A = argsOf('skoko-2024-table1-psv-daily-fuel');
const sk1v = sk1.voyages[0];
const sk1Sail = sk1v.fuelT.sailing * sk1A.fuelPricePerT;
const sk1Port = sk1v.fuelT.port * sk1A.fuelPricePerT;
w(`CHECK FOUR: SKOKO ET AL., TABLES 1 AND 4 (text: a PSV burns ${TEXT.sk1.sail} t an hour sailing and ${TEXT.sk1.port} t an hour in port; at USD ${TEXT.sk1.price} a tonne a day of each costs USD ${TEXT.sk1.sailDay} and USD ${TEXT.sk1.portDay}; at the economic speed a PSV covers ${TEXT.sk1.psvNmDay} NM a day and an AHTS ${TEXT.sk1.ahtsNmDay} NM). The golden input skoko-2024-table1-psv-daily-fuel states one dedicated voyage of ${S(sk1A.installations[0].distanceFromBaseNm)} NM each way at ${S(sk1A.vessel.speedKnots)} knots, ${S(sk1A.portHours)} port hours, no field hours, burns of ${S(sk1A.vessel.fuelTPerHour.sailing)} and ${S(sk1A.vessel.fuelTPerHour.port)} t an hour and a price of ${S(sk1A.fuelPricePerT)} a tonne. The engine returns ${f6(sk1v.nm)} NM, ${f6(sk1v.hours.sailing)} sailing hours, ${f6(sk1v.fuelT.sailing)} t of sailing fuel, ${f6(sk1v.fuelT.port)} t of port fuel and a fuel cost of ${f6(sk1v.fuelCost)}. At the price, the sailing fuel is ${f6(sk1Sail)} and the port fuel ${f6(sk1Port)} (derived: tonnes times the stated price), the two daily figures the table prints.`);
must('Skoko 1: 24 sailing hours, and a day of each activity costs 10440 and 626.4', sk1v.hours.sailing === 24 && Math.abs(sk1Sail - 10440) < 1e-9 && Math.abs(sk1Port - 626.4) < 1e-9 && Math.abs(sk1v.fuelCost - 11066.4) < 1e-9, `${sk1Sail} ${sk1Port}`);
w();
// Skoko Tables 5 and 7
const sk7 = runG('skoko-2024-table7-ahts-optimal-fuel');
const sk7A = argsOf('skoko-2024-table7-ahts-optimal-fuel');
const sk7v = sk7.voyages[0];
w(`CHECK FIVE: SKOKO ET AL., TABLES 5 AND 7, THE AHTS (text: the optimal month of the AHTS has ${TEXT.sk5.ahtsMarine} days of maritime activities and ${TEXT.sk5.ahtsNav} days of navigation at ${TEXT.sk1.sail} t an hour and ${TEXT.sk5.ahtsPort} days of standby in port at ${TEXT.sk1.port} t an hour; the optimal fuel cost is USD ${TEXT.sk5.ahtsFuel}). The golden input skoko-2024-table7-ahts-optimal-fuel reads the maritime activities as field time (${S(sk7A.installations[0].fieldHours)} hours at ${S(sk7A.vessel.fuelTPerHour.field)} t an hour), the navigation as a dedicated voyage of ${S(sk7A.installations[0].distanceFromBaseNm)} NM each way at ${S(sk7A.vessel.speedKnots)} knots, and ${S(sk7A.portHours)} port hours. The engine returns ${f6(sk7v.hours.sailing)} sailing hours, ${f6(sk7v.fuelT.total)} t of fuel and a fuel cost of ${f6(sk7v.fuelCost)}, the printed figure.`);
must('Skoko 7: 14.4 sailing hours, 92.928 t and 80847.36', Math.abs(sk7v.hours.sailing - 14.4) < 1e-9 && Math.abs(sk7v.fuelT.total - 92.928) < 1e-9 && Math.abs(sk7v.fuelCost - 80847.36) < 1e-6, `${sk7v.hours.sailing} ${sk7v.fuelT.total} ${sk7v.fuelCost}`);
w();
// Skoko PSV total, not reproducible
const psvDays = { port: 3.81, sail: 13.18, facility: 2.4, stbyPort: 2.4, supply: 4.14 };
const psvArgs = {
  vessel: { name: 'A PSV read from Skoko et al. Table 5 (stated)', speedKnots: 10, deckAreaM2: 700, deckUsableFraction: 1, deckLoadT: 1360, deadweightT: 1360, tanks: { d: 1 }, fuelTPerHour: { sailing: 0.5, port: 0.03, field: 0.5 } },
  products: [{ id: 'd', kind: 'liquid', densityTPerM3: 1 }],
  installations: [{ id: 'field', distanceFromBaseNm: (psvDays.sail * 24 * 10) / 2, fieldHours: psvDays.supply * 24, cargo: { deckAreaM2: 0, deckWeightT: 0 } }],
  route: { mode: 'dedicated' },
  portHours: (psvDays.port + psvDays.facility + psvDays.stbyPort) * 24,
  weather: { factor: 1, appliesTo: ['sailing'] },
  fuelPricePerT: 870,
};
const psv = success('voyagePlan on the Skoko Table 5 PSV days (stated probe)', E.voyagePlan(clone(psvArgs)));
const psvGap = 186274.10 - psv.voyages[0].fuelCost;
w(`CHECK SIX, A PRINTED TOTAL THE ROUNDED DAYS DO NOT REPRODUCE: SKOKO ET AL., TABLES 5 AND 7, THE PSV (text: the optimal month of the PSV has ${TEXT.sk5.psvPort} days in port, ${TEXT.sk5.psvSail} days sailing, ${TEXT.sk5.psvFacility} days of standby at the facility, ${TEXT.sk5.psvStbyPort} days of standby in port and ${TEXT.sk5.psvSupply} days of offshore supply; Table 7 prints an optimal fuel cost of USD ${TEXT.sk5.psvFuel}). A stated probe puts the sailing days on a dedicated voyage of ${f6(psvArgs.installations[0].distanceFromBaseNm)} NM each way at ${S(psvArgs.vessel.speedKnots)} knots, the offshore supply days at the sailing burn as ${f6(psvArgs.installations[0].fieldHours)} field hours, and the port and both standby days at the port burn as ${f6(psvArgs.portHours)} port hours, at USD 870 a tonne. The engine returns ${f6(psv.voyages[0].fuelT.total)} t and a fuel cost of ${f6(psv.voyages[0].fuelCost)}, which is ${f6(psvGap)} short of the printed total (derived). The rounded days the table prints do not reproduce the printed figure, so the course uses the AHTS row and leaves the PSV total out.`);
must('the Skoko PSV probe gives 186214.104 and misses the printed total by 59.996', Math.abs(psv.voyages[0].fuelCost - 186214.104) < 1e-6 && Math.abs(psvGap - 59.996) < 1e-6, psv.voyages[0].fuelCost);
w();
// Wikipedia FFD
const bins = (r) => r.voyages.filter((v) => v.units.length).map((v) => `{${v.units.map((u) => { const it = r._items[u]; return it; }).join(',')}}`).join(', ');
const ffdRun = (id) => {
  const r = runG(id);
  const a = argsOf(id);
  const size = Object.fromEntries(a.items.map((x) => [x.id, x.lengthM * x.widthM]));
  r._items = size;
  return { r, a, printed: bins(r) };
};
const f60 = ffdRun('ffd-wikipedia-cgj-capacity-60');
const f61 = ffdRun('ffd-wikipedia-cgj-capacity-61');
const fhl = ffdRun('ffd-wikipedia-huang-lu-capacity-75');
const fds = ffdRun('ffd-wikipedia-dosa-tight-example');
w(`CHECK SEVEN: THE FIRST-FIT DECREASING EXAMPLE AT CAPACITY 60 AND 61 (text: ${TEXT.ffd.cite}, the example of Coffman, Garey and Johnson (1978): ten items packed into bins of capacity 60 give ${TEXT.ffd.b60}, and into bins of capacity 61 give ${TEXT.ffd.b61}). The golden inputs state each item as a footprint one metre wide with its size as its length, a usable fraction of 1 and no weight, and ${S(f60.a.voyages)} voyages. The engine packs, by the voyage each footprint lands on:`);
w();
table(['golden input', 'deck area', 'the engine\'s voyages, by footprint', 'voyages used (engine)', 'lower bound (engine)'], [
  ['ffd-wikipedia-cgj-capacity-60', S(f60.a.deck.areaM2), f60.printed, S(f60.r.voyagesUsed), S(f60.r.lowerBound)],
  ['ffd-wikipedia-cgj-capacity-61', S(f61.a.deck.areaM2), f61.printed, S(f61.r.voyagesUsed), S(f61.r.lowerBound)],
]);
must('FFD 60 and 61 pack exactly as printed', f60.printed === TEXT.ffd.b60 && f61.printed === TEXT.ffd.b61, `${f60.printed} / ${f61.printed}`);
w();
w(`A LARGER DECK, MORE VOYAGES. With capacity 61 the same ten footprints take ${S(f61.r.voyagesUsed)} voyages where capacity 60 takes ${S(f60.r.voyagesUsed)}, while the lower bound stays at ${S(f61.r.lowerBound)} (engine): first-fit decreasing is not monotone in the capacity.`);
must('FFD is not monotone here: 61 uses more voyages than 60', f61.r.voyagesUsed > f60.r.voyagesUsed && f61.r.lowerBound === f60.r.lowerBound, 'monotone');
w();
w(`CHECK EIGHT: HUANG AND LU (2021), EXAMPLE 5.1, AS THE ARTICLE PRINTS IT (text: capacity 75, four bins ${TEXT.ffd.hl}). The engine packs the golden input ffd-wikipedia-huang-lu-capacity-75 into ${fhl.printed}, ${S(fhl.r.voyagesUsed)} voyages (engine).`);
must('Huang and Lu packs as printed', fhl.printed === TEXT.ffd.hl, fhl.printed);
w();
w(`CHECK NINE: THE TIGHT WORST CASE OF DOSA (2007), SCALED TO CAPACITY ${S(fds.a.deck.areaM2)} (text: the optimum packs the items into ${TEXT.ffd.dosaOpt} bins and first-fit decreasing uses ${TEXT.ffd.dosaBins}, which is 11/9 of the optimum plus 6/9). The engine uses ${S(fds.r.voyagesUsed)} voyages on the golden input ffd-wikipedia-dosa-tight-example, packing ${fds.printed}, with a lower bound of ${S(fds.r.lowerBound)} (engine). The lower bound is the area bound; the optimum of ${TEXT.ffd.dosaOpt} is the text's, and the engine does not search for an optimum.`);
must('Dosa: 8 voyages used, lower bound 6', fds.r.voyagesUsed === 8 && fds.r.lowerBound === 6, `${fds.r.voyagesUsed} ${fds.r.lowerBound}`);

/* ============================================================ SECTION 4 */

section('dataset', 'The Ekene cluster, its vessels and its supply base', ['Associate m01 l03', 'Associate m06', 'Professional m01', 'Professional m04', 'Expert m01', 'Expert m04']);
w('Every teaching case in this course comes from one fixture file under test-data/supplychain/ekene-marine, written by a stated script that reproduces it. It is labelled SYNTHETIC in the file, whose statement reads, verbatim:');
quote(FX.synthetic);
must('the fixture carries its SYNTHETIC statement and names its writer', FX.synthetic.startsWith('SYNTHETIC') && FX.generatedBy === 'tools/validation/supplychain/make_marine_fixtures.py', FX.generatedBy);
w();
w(`THE CLUSTER (fixture): ${FX.title}.`);
w();
w('THE SIX BULK PRODUCTS (fixture):');
w();
table(['id', 'product', 'kind', 'density, t a m3'], FX.products.map((p) => [p.id, p.name, p.kind, f6(p.densityTPerM3)]));
w();
w('THE TWO VESSELS (fixture):');
w();
const VS = [['psv', FX.vessels.psv], ['ahts', FX.vessels.ahts]];
table(['key', 'vessel', 'speed, knots', 'deck area, m2', 'usable fraction', 'deck load, t', 'deadweight, t', 'tanks, m3', 'fuel t an hour (sailing, port, field)'],
  VS.map(([k, v]) => [k, v.name, f6(v.speedKnots), f6(v.deckAreaM2), f6(v.deckUsableFraction), f6(v.deckLoadT), f6(v.deadweightT), FX.products.map((p) => `${p.id} ${S(v.tanks[p.id])}`).join(', '), E.ACTIVITIES.map((a) => f6(v.fuelTPerHour[a])).join(', ')]));
VS.forEach(([, v]) => must(`every vessel name ends (synthetic): ${v.name}`, /\(synthetic\)$/.test(v.name), v.name));
w();
w('THE FOUR INSTALLATIONS (fixture): the distance from the base, the field hours a visit, the minimum visits a week, the week\'s demand and the cargo of one planned voyage:');
w();
const bulkOf = (b) => (b ? Object.entries(b).map(([k, v]) => `${k} ${S(v)}`).join(', ') : 'none');
table(['id', 'installation', 'distance from the base, NM', 'field hours', 'minimum visits', 'week: deck m2, deck t, bulk m3', 'one voyage: deck m2, deck t, bulk m3'],
  FX.installations.map((x) => [x.id, x.name, f6(x.distanceFromBaseNm), f6(x.fieldHours), S(x.minVisits), `${f6(x.demand.deckAreaM2)}, ${f6(x.demand.deckWeightT)}, ${bulkOf(x.demand.bulk)}`, `${f6(x.voyageCargo.deckAreaM2)}, ${f6(x.voyageCargo.deckWeightT)}, ${bulkOf(x.voyageCargo.bulk)}`]));
FX.installations.forEach((x) => must(`every installation name ends (synthetic): ${x.name}`, /\(synthetic\)$/.test(x.name), x.name));
w();
w(`THE MILK RUN (fixture): stops ${FX.milkRun.stops.join(', ')} in that order, legs ${FX.milkRun.legsNm.map(S).join(', ')} NM (base to the first stop, stop to stop, the last stop back to the base). Port hours ${S(FX.portHours)} a voyage. Weather factor ${S(FX.weather.factor)} on ${FX.weather.appliesTo.join(' and ')} time (${FX.weather.note}). Fuel at ${S(FX.fuelPricePerT)} a tonne. A period of ${S(FX.period.periodDays)} days with ${S(FX.period.vesselAvailableDays)} days available a vessel (${FX.period.note}).`);
w();
w(`VARIABILITY (fixture): a triangular weather factor of min ${S(FX.variability.weatherFactor.min)}, mode ${S(FX.variability.weatherFactor.mode)} and max ${S(FX.variability.weatherFactor.max)}; a triangular demand factor of min ${S(FX.variability.demandFactor.min)}, mode ${S(FX.variability.demandFactor.mode)} and max ${S(FX.variability.demandFactor.max)}; ${S(FX.variability.plannedVessels)} planned vessels; ${S(FX.variability.iterations)} draws on seed ${S(FX.variability.seed)}.`);
w();
w(`THE DECK AND ONE VOYAGE OF DECK CARGO (fixture): ${FX.deck.name}, ${S(FX.deck.areaM2)} m2 with a usable fraction of ${S(FX.deck.usableFraction)} and a deck load of ${S(FX.deck.loadT)} t, and the items in the order booked:`);
w();
table(['id', 'item', 'length, m', 'width, m', 'footprint, m2 (derived: length times width)', 'weight, t', 'quantity'], FX.deckItems.map((x) => [x.id, x.name, f6(x.lengthM), f6(x.widthM), f6(x.lengthM * x.widthM), f6(x.weightT), S(x.quantity)]));
w();
w(`THE SUPPLY BASE (fixture): ${FX.shoreBase.name}, ${S(FX.shoreBase.berths)} berths, ${S(FX.shoreBase.arrivalsPerDay)} arrivals a day over a ${S(FX.shoreBase.workingHoursPerDay)}-hour working day; a call needs ${S(FX.shoreBase.service.fixedHours)} fixed hours, ${S(FX.shoreBase.service.lifts)} lifts at ${S(FX.shoreBase.service.liftsPerHour)} an hour and ${S(FX.shoreBase.service.bulkM3)} m3 of bulk at ${S(FX.shoreBase.service.bulkM3PerHour)} m3 an hour, the lifts and the bulk at the same time (concurrent ${S(FX.shoreBase.service.concurrent)}).`);
w();
// The golden Ekene cases carry the fixture's facts
const gEk = argsOf('ekene-voyage-milk-run-psv');
must('ekene-voyage-milk-run-psv carries the fixture vessel, products, route and weather', JSON.stringify(gEk.vessel) === JSON.stringify(FX.vessels.psv) && JSON.stringify(gEk.products) === JSON.stringify(FX.products) && JSON.stringify(gEk.route) === JSON.stringify({ mode: FX.milkRun.mode, stops: FX.milkRun.stops, legsNm: FX.milkRun.legsNm }) && gEk.weather.factor === FX.weather.factor, 'ekene voyage');
must('ekene-voyage-milk-run-psv carries each installation\'s voyage cargo', gEk.installations.every((x) => JSON.stringify(x.cargo) === JSON.stringify(FX.installations.find((y) => y.id === x.id).voyageCargo)), 'cargo');
const gEf = argsOf('ekene-fleet-psv-milk-run');
must('ekene-fleet-psv-milk-run carries each installation\'s week of demand and minimum visits', gEf.installations.every((x) => { const y = FX.installations.find((z) => z.id === x.id); return JSON.stringify(x.demand) === JSON.stringify(y.demand) && x.minVisits === y.minVisits; }) && gEf.periodDays === FX.period.periodDays && gEf.vesselAvailableDays === FX.period.vesselAvailableDays, 'fleet');
const gEd = argsOf('ekene-deck-one-voyage-ffd');
must('ekene-deck-one-voyage-ffd carries the fixture deck and items', JSON.stringify(gEd.deck) === JSON.stringify(FX.deck) && JSON.stringify(gEd.items) === JSON.stringify(FX.deckItems), 'deck');
const gEb = argsOf('ekene-base-mmc');
must('ekene-base-mmc carries the fixture supply base', gEb.berths === FX.shoreBase.berths && gEb.arrivalsPerDay === FX.shoreBase.arrivalsPerDay && JSON.stringify(gEb.service) === JSON.stringify(FX.shoreBase.service), 'base');
w('The golden inputs whose ids start ekene- carry these same facts (checked when this digest is built): the voyage plans carry each installation\'s one-voyage cargo, the fleet cases the week\'s demand and the minimum visits, the deck plans the deck and the items, the base cases the supply base.');
w();
// The README's planted situations, each checked against the engine
const ekV = runG('ekene-voyage-milk-run-psv');
const ekO = runG('ekene-voyage-deck-overloaded');
const ekF = runG('ekene-fleet-psv-milk-run');
const ekFd = runG('ekene-fleet-psv-dedicated');
const ekD1 = runG('ekene-deck-one-voyage-ffd');
const ekD1f = runG('ekene-deck-one-voyage-first-fit');
const ekD2 = runG('ekene-deck-two-voyages-ffd');
const ekB = runG('ekene-base-mmc');
const ekBd = runG('ekene-base-mdc');
const ek1 = refusal('shoreBase on base-refuse-ekene-one-berth-overloaded', E.shoreBase(argsOf('base-refuse-ekene-one-berth-overloaded')), 'arrivalsPerDay');
must('README: the PSV milk run is feasible with deck area binding at 90 percent', ekV.voyages[0].feasible && ekV.voyages[0].binding.constraint === 'deck area' && Math.abs(ekV.voyages[0].binding.utilisation - 0.9) < 1e-12 && /at 90%/.test(FXREADME), ekV.voyages[0].binding.utilisation);
must('README: doubling the deck cargo overloads deck area only', ekO.voyages[0].overloaded.join() === 'deck area', ekO.voyages[0].overloaded.join());
must('README: deck area drives 3.1 voyages of demand, so 4, above 3 minimum visits, and two vessels', ekF.voyageSets[0].drivenBy === 'deck area' && Math.abs(ekF.voyageSets[0].voyagesExact - 3.1) < 1e-12 && ekF.voyageSets[0].voyages === 4 && ekF.vessels === 2 && /3\.1 voyages of demand/.test(FXREADME), ekF.voyageSets[0].voyagesExact);
must('README: on dedicated voyages every installation is driven by its minimum visits', ekFd.voyageSets.every((s) => s.drivenBy === 'minimum visits'), ekFd.voyageSets.map((s) => s.drivenBy).join());
must('README: FFD fills 599.2296 and leaves eleven units of 16.5 m2; first fit fills 580.6296 and leaves the casing bundle', Math.abs(ekD1.voyages[0].areaM2 - 599.2296) < 1e-9 && ekD1.overflow.length === 11 && ekD1f.overflow.length === 1 && ekD1f.overflow[0].itemId === 'pipe-bundle' && Math.abs(ekD1f.voyages[0].areaM2 - 580.6296) < 1e-9 && /599\.2296/.test(FXREADME) && /580\.6296/.test(FXREADME), `${ekD1.voyages[0].areaM2} ${ekD1f.voyages[0].areaM2}`);
must('README: two voyages carry it all', ekD2.overflow.length === 0 && ekD2.voyagesUsed === 2, ekD2.overflow.length);
must('README: two berths run at 0.533 and one berth is refused; M/D/c waits less than M/M/c', ekB.berthUtilisation.toFixed(3) === '0.533' && ekBd.meanWaitHours < ekB.meanWaitHours && !!ek1.error, ekB.berthUtilisation);
w('THE SITUATIONS THE FIXTURE README PLANTS, each confirmed against the engine when this digest is built (every figure is the engine\'s, on the golden inputs named):');
w();
table(['situation', 'golden input', 'the engine returns'], [
  ['one PSV milk run with the voyage cargo', 'ekene-voyage-milk-run-psv', `feasible ${S(ekV.voyages[0].feasible)}; binding ${ekV.voyages[0].binding.constraint} at a utilisation of ${f6(ekV.voyages[0].binding.utilisation)}`],
  ['the deck cargo doubled', 'ekene-voyage-deck-overloaded', `overloaded: ${list(ekO.voyages[0].overloaded)}; deck area utilisation ${f6(ekO.voyages[0].binding.utilisation)}`],
  ['a week on the PSV milk run', 'ekene-fleet-psv-milk-run', `${f6(ekF.voyageSets[0].voyagesExact)} voyages of demand driven by ${ekF.voyageSets[0].drivenBy}, rounded up to ${S(ekF.voyageSets[0].voyages)}; ${S(ekF.vessels)} vessels`],
  ['a week of dedicated PSV voyages', 'ekene-fleet-psv-dedicated', ekFd.voyageSets.map((s) => `${s.id} ${S(s.voyages)} (${s.drivenBy})`).join('; ')],
  ['one voyage of deck cargo, first-fit decreasing', 'ekene-deck-one-voyage-ffd', `${f6(ekD1.voyages[0].areaM2)} m2 carried of ${f6(ekD1.usableAreaM2)} usable; ${S(ekD1.overflow.length)} units overflow`],
  ['the same, first fit in the booked order', 'ekene-deck-one-voyage-first-fit', `${f6(ekD1f.voyages[0].areaM2)} m2 carried; ${S(ekD1f.overflow.length)} unit overflows: ${ekD1f.overflow.map((o) => o.unit).join(', ')}`],
  ['the same cargo on two voyages', 'ekene-deck-two-voyages-ffd', `${S(ekD2.voyagesUsed)} voyages used, ${S(ekD2.overflow.length)} overflow`],
  ['the supply base', 'ekene-base-mmc and ekene-base-mdc', `berth utilisation ${f6(ekB.berthUtilisation)}; mean wait ${f6(ekB.meanWaitHours)} hours (M/M/c) and ${f6(ekBd.meanWaitHours)} hours (M/D/c)`],
  ['the supply base with one berth', 'base-refuse-ekene-one-berth-overloaded', 'refused (the message is in ' + ref('refusals') + ')'],
]);

/* ============================================================ SECTION 5 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m04', 'Associate m05 l04', 'Professional m02', 'Professional m03', 'Professional m04', 'Expert m01', 'Expert m04', 'Expert m06']);
w('A refusal is an object with `error` and `field`. The message starts with the name of the field it refuses and states the exact condition that failed: "<field> must be <condition>; got <value>", the value as the engine prints it (a string in quotes, an absent value as nothing), or, for an unknown key, "<field> is not an accepted key; the accepted keys ... are ...". Each row below is a stated bad input from the golden file handed to the engine; the message is the engine\'s, verbatim. A result returned with a reason (an overloaded voyage, a voyage longer than the days available, a shortfall of vessel-days, overflow on the deck, a berth target no count meets) is a result. It is no refusal.');
w();
const REF = GOLD.cases.filter(isRefusalCase);
const REFUSED = REF.map((c) => {
  const r = refusal(`${c.fn} on the golden input ${c.id}`, E[c.fn](clone(c.args)), c.expected.field);
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
must('seventy-nine refusal cases in the golden file', REF.length === 79, REF.length);
must('no refusal message carries a pipe', REF.every((c) => !c.expected.message.includes('|')), 'pipe');
w();
w('REFUSALS A PANEL CONTROL CAN PRODUCE. Each calculator panel writes every required input into the box through a visible control, and setting a control to "not stated" removes the input. The calls below are not golden cases; each is a golden input with one input removed (stated probes), handed to the engine here, and the message is the engine\'s, verbatim:');
w();
const dropAt = (o, path) => { const ks = path.split('.'); let t = o; ks.slice(0, -1).forEach((k) => { t = Array.isArray(t) ? t[Number(k)] : t[k]; }); const last = ks[ks.length - 1]; if (Array.isArray(t)) t.splice(Number(last), 1); else delete t[last]; return o; };
const PANEL_REFUSALS = [
  ['ekene-voyage-milk-run-psv', 'vessel.speedKnots'], ['ekene-voyage-milk-run-psv', 'vessel.deckUsableFraction'], ['ekene-voyage-milk-run-psv', 'vessel.fuelTPerHour.port'],
  ['ekene-voyage-milk-run-psv', 'weather.factor'], ['ekene-voyage-milk-run-psv', 'weather.appliesTo'], ['ekene-voyage-milk-run-psv', 'portHours'],
  ['ekene-voyage-milk-run-psv', 'fuelPricePerT'], ['ekene-voyage-milk-run-psv', 'route.mode'], ['ekene-voyage-milk-run-psv', 'products.0.densityTPerM3'],
  ['ekene-fleet-psv-milk-run', 'voyageRounding'], ['ekene-fleet-psv-milk-run', 'vesselRounding'], ['ekene-fleet-psv-milk-run', 'periodDays'],
  ['ekene-fleet-psv-milk-run', 'vesselAvailableDays'], ['ekene-fleet-psv-milk-run', 'installations.0.minVisits'],
  ['ekene-variability-psv-milk-run', 'demandFactor'], ['ekene-variability-psv-milk-run', 'plannedVessels'], ['ekene-variability-psv-milk-run', 'iterations'], ['ekene-variability-psv-milk-run', 'seed'],
  ['ekene-deck-one-voyage-ffd', 'rule'], ['ekene-deck-one-voyage-ffd', 'voyages'], ['ekene-deck-one-voyage-ffd', 'deck.loadT'],
  ['ekene-base-mmc', 'model'], ['ekene-base-mmc', 'service.concurrent'], ['ekene-base-mmc', 'workingHoursPerDay'], ['ekene-base-mmc', 'berths'],
];
const fieldOfPath = (p) => p.replace(/\.(\d+)(?=\.|$)/g, '[$1]');
table(['golden input', 'the input removed (stated probe)', 'field', 'the engine\'s message, verbatim'], PANEL_REFUSALS.map(([id, path]) => {
  const want = fieldOfPath(path);
  const r = refusal(`${GC[id].fn} on ${id} with ${path} removed`, E[GC[id].fn](dropAt(argsOf(id), path)), want);
  return [id, want, `\`${want}\``, r && r.error];
}));
w();
const orderProbe = argsOf('ekene-base-mmc'); delete orderProbe.model; orderProbe.queue = 'M/M/c';
const orderR = refusal('shoreBase on ekene-base-mmc with model removed and an unknown key queue added (stated probe)', E.shoreBase(orderProbe), 'queue');
w('THE ORDER OF REFUSALS. A box that carries an unknown key AND lacks a required input is refused on the unknown key first: every function checks its accepted keys before it reads an input. On ekene-base-mmc with model removed and a key queue added (stated probe), the engine\'s message, verbatim:');
quote(orderR.error);
w();
w('Four rules the tables show:');
w('- An input with no default is refused when it is missing, and the message says so: a speed, a deck area and its usable fraction, a deck load, a deadweight, a tank for every product (0 when the vessel has none), every fuel burn, a density and a kind for every product, the route and its legs, port hours, the weather factor and the activities it slows, the fuel price, the period and the available days, both rounding rules, the minimum visits, the packing rule and the voyages of a deck plan, the berths, the arrivals, the working day, every service term, the concurrent choice, the queue model, the demand factor, the planned vessels, the draws and the seed.');
w('- An input key a function does not read is refused at whatever level it sits (a top-level option, a vessel term, a fuel activity, a cargo, a bulk product, a tank, an item, a deck term, a triangular, a service term), with the path to the key and the full list of accepted keys.');
w('- An input that contradicts the route or the vessel is refused by name: a distance from the base on a milk run, legs or stops on a dedicated voyage, a load of a product the vessel has no tank for, available days above the period, a weather factor below 1 or above the cap, a berth utilisation at or above 1.');
w('- A stated figure inside a message is printed as it was given; a computed one prints to six decimals, and a printed bound is moved to the accepted side at the sixth decimal (' + ref('boundaries') + ').');

/* ============================================================ SECTION 6 */

section('graded', 'What is graded, where the practicals run, the Suite app, and what is never graded', ['Associate m01 l05', 'Expert m04 l05', 'Expert m06']);
w('EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED INPUTS. A capstone field, a question key and a panel figure are each computed by a function in the table of ' + ref('computes') + ' on inputs written down in advance. No graded figure comes from the Monte Carlo of fleetVariability, so the same inputs give the same number on any machine, and there is exactly one right answer.');
w();
w('THE PRACTICALS RUN IN THE COURSE\'S OWN CALCULATOR PANELS. Four panels call this same vendored engine: the voyage and fleet calculator (voyagePlan and fleetSize; Associate and Professional), the deck calculator (deckPlan; Professional), the shore base calculator (shoreBase; Expert) and the variability calculator (fleetVariability; Expert, every figure on it labelled with its seed and draws and marked as not graded). A learner types or pastes their own inputs; the panel prints what the engine returns, every refusal in the engine\'s own words, and the reasons beside each figure.');
w();
w('THE SUITE APP. The Marine Logistics Planner, in the Suite\'s Midstream & Downstream module, runs this same engine file in six tabs (installations and demand, the voyage plan, fleet sizing, fleet variability, the deck plan and the shore base) on the same Ekene fixture. What a learner works in a panel here is what the planner computes there; the course is complete without it.');
w();
w('WHAT A CAPSTONE STATES. Each capstone runs its own synthetic cluster, which this digest does not print, and states every input a figure depends on: the vessel with every capacity, tank and fuel burn; the products and their densities; the installations with their distances, field hours, cargo or demand and minimum visits; the route and its legs; port hours; the weather factor and the activities it slows; the fuel price; the period, the available days and both rounding rules; the deck, the items and the packing rule; the berths, arrivals, working day, service terms, the concurrent choice, the queue model and any target. Each graded figure is quoted to six decimals as the panel prints it.');
w();
w(`WHAT IS NEVER GRADED. No graded figure depends on a reading the engine states (${ref('readings')}): every capstone field is the same number under each reading the engine takes and under the alternative it names. A choice a capstone states (the activities the weather slows, the rounding rules, the packing rule, the queue model) is part of the question, stated in the capstone. No graded figure is a Monte Carlo draw: the mean, P90, P50 and P10 of ${ref('variability')} are taught with their seed and draw count and are never graded.`);
w();
w('WHAT A COMPUTED FIGURE DOES NOT SAY. A voyage plan is the stated route, speed, times and burns added up; a fleet is the stated demand divided by the stated capacities and rounded by the stated rules; a deck plan is an area bound by a stated rule; a queue figure is a steady-state average of a stated model. None is a schedule, a forecast of the weather or a promise that a berth will be free. Each figure is quoted with its inputs for that reason.');

/* ============================================================ SECTION 7 */

section('units', 'Units and the conventions the engine states once', ['Associate m01 l04']);
w('UNITS. Distances are in nautical miles (NM), speeds in knots (nautical miles an hour), times in hours unless a name says days, areas in square metres (m2), weights and fuel in tonnes (t), bulk volumes in cubic metres (m3), densities in tonnes a cubic metre, and money in one currency, whatever unit the caller uses. Sailing hours are the voyage\'s distance over the speed; days are hours over 24.');
w();
const ekVv = ekV.voyages[0];
w(`ONE LEG AT A TIME (golden input ekene-voyage-milk-run-psv, the PSV at ${S(gEk.vessel.speedKnots)} knots). Each leg\'s calm hours are its distance over the speed (engine):`);
w();
table(['leg', 'from', 'to', 'NM (fixture)', 'calm hours (engine)'], ekVv.legs.map((l, i) => [S(i + 1), l.from, l.to, f6(l.nm), f6(l.calmHours)]));
must('each leg\'s calm hours are its NM over the speed', ekVv.legs.every((l) => l.calmHours === l.nm / gEk.vessel.speedKnots), 'legs');
w();
w(`The voyage sails ${f6(ekVv.nm)} NM (engine). At ${S(sk1A.vessel.speedKnots)} knots a day of sailing covers ${f6(sk1v.nm)} NM (engine, golden input skoko-2024-table1-psv-daily-fuel, ${f6(sk1v.hours.sailing)} hours), the figure Skoko et al. print for a PSV (${ref('published')}).`);
w();
w(`THE TIE RULE. Two figures TIE when they agree to ${S(D.TIE_DIGITS)} significant digits. A capacity check passes when the ${S(D.TIE_DIGITS)}-digit figure of the load is at or below that of the capacity; a count rounded up is the ceiling of the ${S(D.TIE_DIGITS)}-digit figure; a binding tie goes to the first constraint in the stated order. The rule exists because decimal inputs are held as binary doubles: on the golden input fleet-decimal-ratio-2-1-over-0-7-is-three the demand ratio comes back as ${S(runG('fleet-decimal-ratio-2-1-over-0-7-is-three').voyageSets[0].voyagesExact)} (engine, printed in full) and counts as ${S(runG('fleet-decimal-ratio-2-1-over-0-7-is-three').voyageSets[0].voyages)} voyages. ${refCap('readings')} and ${ref('boundaries')} show where it acts.`);
must('the 2.1 over 0.7 ratio is three voyages', runG('fleet-decimal-ratio-2-1-over-0-7-is-three').voyageSets[0].voyages === 3 && runG('fleet-decimal-ratio-2-1-over-0-7-is-three').voyageSets[0].voyagesExact !== 3, 'ratio');
w();
w('HOW THE ENGINE PRINTS INSIDE A MESSAGE. Money rounds to the cent and a computed quantity to six decimals, both half away from zero with trailing zeros dropped; a stated input prints as it was typed; a percentage is a computed figure with a % sign. The numeric fields keep full precision.');

/* ============================================================ SECTION 8 */

section('routes', 'Routes and voyage time: milk runs, dedicated voyages, legs, port and field hours', ['Associate m02']);
w('TWO ROUTE MODES. A milk run ("milk-run") is one voyage from the base through every installation once, in the stated order, and back: it states its stops and one leg distance more than there are stops (base to the first stop, stop to stop, the last stop back to the base). A dedicated route ("dedicated") is one voyage per installation, out and back, each at its own stated distance from the base. A milk run takes its distances from its legs and a dedicated route from the installations; a distance given to the mode that does not read it is refused by name (' + ref('refusals') + ').');
w();
const ekDd = runG('ekene-voyage-dedicated-psv');
w('THE HOURS OF A VOYAGE are sailing (the NM over the speed), port (the stated port hours, once a voyage) and field (the sum of the stated field hours of the installations the voyage serves), before any weather factor. On the Ekene PSV (golden inputs ekene-voyage-milk-run-psv and ekene-voyage-dedicated-psv, with the fixture weather factor):');
w();
table(['voyage', 'stops', 'NM (engine)', 'sailing hours (engine)', 'port hours (engine)', 'field hours (engine)', 'total hours (engine)', 'days (engine)'],
  [...ekV.voyages, ...ekDd.voyages].map((v) => [v.id, v.stops.join(', '), f6(v.nm), f6(v.hours.sailing), f6(v.hours.port), f6(v.hours.field), f6(v.hours.total), f6(v.days)]));
w();
w(`The milk run takes ${f6(ekV.totals.days)} days for one voyage; the four dedicated voyages take ${f6(ekDd.totals.days)} days in all (engine totals). Each voyage\'s days are its total hours over 24.`);
must('days are hours over 24', [...ekV.voyages, ...ekDd.voyages].every((v) => v.days === v.hours.total / 24), 'days');
must('the four dedicated voyages together take longer than the one milk run', ekDd.totals.days > ekV.totals.days, `${ekDd.totals.days} ${ekV.totals.days}`);
w();
const zl = runG('voyage-zero-distance-leg');
const zlA = argsOf('voyage-zero-distance-leg');
w(`A LEG OF ZERO. Two installations at one location are a leg of 0 NM, which is accepted (golden input voyage-zero-distance-leg: legs ${zlA.route.legsNm.map(S).join(', ')} NM at ${S(zlA.vessel.speedKnots)} knots). The engine returns ${f6(zl.voyages[0].hours.sailing)} sailing hours and ${f6(zl.voyages[0].hours.total)} hours in all.`);

/* ============================================================ SECTION 9 */

section('weather', 'Weather: one stated factor and the activities it slows', ['Associate m03 l01', 'Associate m03 l02', 'Associate m06 l02']);
w(`ONE STATED FACTOR. Weather enters as one stated factor from 1 to ${S(D.MAX_WEATHER_FACTOR)} that multiplies the time of the activities the call names in weather.appliesTo (any of sailing, port and field, at least one, none repeated). An activity the call does not name keeps its calm time. The list of activities is required, so the call says which activities the weather slows; fuel follows time. A factor of 1 is calm.`);
w();
const ekC = runG('ekene-voyage-calm');
const ekW = runG('ekene-voyage-weather-on-all-activities');
const cA = argsOf('ekene-voyage-calm');
const wA = argsOf('ekene-voyage-weather-on-all-activities');
w('THE SAME MILK RUN THREE WAYS (golden inputs, the Ekene PSV):');
w();
table(['golden input', 'weather factor', 'applies to', 'sailing hours', 'port hours', 'field hours', 'total hours', 'days'], [
  ['ekene-voyage-calm', S(cA.weather.factor), cA.weather.appliesTo.join(', '), f6(ekC.voyages[0].hours.sailing), f6(ekC.voyages[0].hours.port), f6(ekC.voyages[0].hours.field), f6(ekC.voyages[0].hours.total), f6(ekC.voyages[0].days)],
  ['ekene-voyage-milk-run-psv', S(gEk.weather.factor), gEk.weather.appliesTo.join(', '), f6(ekVv.hours.sailing), f6(ekVv.hours.port), f6(ekVv.hours.field), f6(ekVv.hours.total), f6(ekVv.days)],
  ['ekene-voyage-weather-on-all-activities', S(wA.weather.factor), wA.weather.appliesTo.join(', '), f6(ekW.voyages[0].hours.sailing), f6(ekW.voyages[0].hours.port), f6(ekW.voyages[0].hours.field), f6(ekW.voyages[0].hours.total), f6(ekW.voyages[0].days)],
]);
must('the factor multiplies only the named activities', ekVv.hours.sailing === ekC.voyages[0].hours.sailing * 1.2 && ekVv.hours.port === ekC.voyages[0].hours.port && ekW.voyages[0].hours.port === ekC.voyages[0].hours.port * 1.2, 'weather');
w();
w(`With the factor on sailing and field time, port time stays at ${f6(ekVv.hours.port)} hours; named on port time as well, it becomes ${f6(ekW.voyages[0].hours.port)} hours (engine). The three rows differ only in what the weather input states, so a plan names both the factor and the activities.`);
w();
w('WHERE THE IDEA COMES FROM. Aas, Halskau and Wallace (2009) describe weather limits both on sailing and on loading at the installation (taught by concept); the engine does not model a weather window, a wave height or a waiting-on-weather rule, only the stated factor on the stated time (' + ref('notcomputed') + ').');

/* ============================================================ SECTION 10 */

section('fuel', 'Fuel by activity and the fuel bill', ['Associate m03 l03', 'Associate m03 l04']);
w('FUEL = hours in each activity times the stated tonnes an hour for that activity; the fuel cost is the tonnes times the stated price a tonne. There is no speed-cube law: a burn rate is stated for each activity, and the weather factor raises fuel only through the hours it adds.');
w();
table(['golden input', 'sailing t (engine)', 'port t (engine)', 'field t (engine)', 'total t (engine)', 'fuel cost (engine)'], [
  ['ekene-voyage-calm', f6(ekC.voyages[0].fuelT.sailing), f6(ekC.voyages[0].fuelT.port), f6(ekC.voyages[0].fuelT.field), f6(ekC.voyages[0].fuelT.total), f6(ekC.voyages[0].fuelCost)],
  ['ekene-voyage-milk-run-psv', f6(ekVv.fuelT.sailing), f6(ekVv.fuelT.port), f6(ekVv.fuelT.field), f6(ekVv.fuelT.total), f6(ekVv.fuelCost)],
  ['ekene-voyage-weather-on-all-activities', f6(ekW.voyages[0].fuelT.sailing), f6(ekW.voyages[0].fuelT.port), f6(ekW.voyages[0].fuelT.field), f6(ekW.voyages[0].fuelT.total), f6(ekW.voyages[0].fuelCost)],
]);
must('fuel is hours times the burn by activity and the cost is tonnes times the price', E.ACTIVITIES.every((a) => ekVv.fuelT[a] === ekVv.hours[a] * gEk.vessel.fuelTPerHour[a]) && ekVv.fuelCost === ekVv.fuelT.total * gEk.fuelPricePerT, 'fuel');
w();
w(`At the fixture burns (${E.ACTIVITIES.map((a) => `${a} ${S(gEk.vessel.fuelTPerHour[a])} t an hour`).join(', ')}) and USD ${S(gEk.fuelPricePerT)} a tonne, the rainy-season allowance on sailing and field time adds ${f6(ekVv.fuelCost - ekC.voyages[0].fuelCost)} to the calm voyage\'s fuel bill (derived: the two engine fuel costs, less). Adding port time to the allowance adds ${f6(ekW.voyages[0].fuelCost - ekVv.fuelCost)} more (derived), because port burns ${S(gEk.vessel.fuelTPerHour.port)} t an hour.`);
w();
w(`THE PUBLISHED FUEL FIGURES. Skoko et al. (2024) print the daily fuel cost of a PSV at 0.5 and 0.03 t an hour and USD 870 a tonne, and the optimal fuel of an AHTS month; the engine reproduces both (${ref('published')}, checks four and five).`);

/* ============================================================ SECTION 11 */

section('capacity', 'Deck and bulk capacity: the usable deck, deck load, deadweight and the tanks', ['Associate m04']);
w('THE CAPACITY CONSTRAINTS, in the stated order: deck area (the deck area times the stated usable fraction), deck load (tonnes of deck cargo), deadweight (deck weight plus every bulk m3 times its stated density), then one tank per product in the order of the products. Deck cargo is measured in square metres, containers and baskets are not stacked, and bulk travels in segregated tanks, one product to a tank (Aas, Halskau and Wallace 2009, taught by concept); the engine stacks nothing. Cargo deadweight is the user\'s net figure: there is no stowage factor.');
w();
const ekVc = ekVv.constraints;
table(['constraint', 'unit', 'load (engine)', 'capacity (engine)', 'utilisation (engine)'], ekVc.map((c) => [c.constraint, c.unit, f6(c.load), f6(c.capacity), f6(c.utilisation)]));
w();
w(`(golden input ekene-voyage-milk-run-psv: the PSV\'s ${S(gEk.vessel.deckAreaM2)} m2 deck at a usable fraction of ${S(gEk.vessel.deckUsableFraction)} gives a deck area capacity of ${f6(ekVc[0].capacity)} m2 (engine).)`);
must('deck area capacity is the area times the usable fraction', ekVc[0].capacity === gEk.vessel.deckAreaM2 * gEk.vessel.deckUsableFraction, ekVc[0].capacity);
must('the deadweight load is deck weight plus bulk times density', Math.abs(ekVv.load.deadweightT - (ekVv.load.deckWeightT + FX.products.reduce((s, p) => s + ekVv.load.bulkM3[p.id] * p.densityTPerM3, 0))) < 1e-9, ekVv.load.deadweightT);
w();
w(`THE DEADWEIGHT LOAD of the Ekene milk run is ${f6(ekVv.load.deadweightT)} t (engine): ${f6(ekVv.load.deckWeightT)} t of deck cargo plus the bulk, product by product, at its density (${FX.products.filter((p) => ekVv.load.bulkM3[p.id] > 0).map((p) => `${p.id} ${f6(ekVv.load.bulkM3[p.id])} m3 at ${S(p.densityTPerM3)}`).join(', ')}).`);
w();
const dwd = runG('voyage-deadweight-from-density');
const dwdA = argsOf('voyage-deadweight-from-density');
w(`A LIQUID HEAVIER THAN WATER (golden input voyage-deadweight-from-density: ${S(dwdA.installations[0].cargo.deckWeightT)} t of deck cargo and ${S(Object.values(dwdA.installations[0].cargo.bulk)[0])} m3 of ${dwdA.products[0].id} at ${S(dwdA.products[0].densityTPerM3)} t a m3 against a deadweight of ${S(dwdA.vessel.deadweightT)} t). The engine returns a deadweight load of ${f6(dwd.voyages[0].load.deadweightT)} t and a deadweight utilisation of ${f6(dwd.voyages[0].constraints.find((c) => c.constraint === 'deadweight').utilisation)}: the voyage is overloaded on ${list(dwd.voyages[0].overloaded)}. The engine\'s reasons, verbatim:`);
reasons(dwd.voyages[0].reasons);
w();
const tz = runG('voyage-tank-zero-capacity-empty-ok');
w(`A TANK OF 0. Every product needs a stated tank, 0 when the vessel has none for it. A tank of 0 with nothing loaded in it is accepted (golden input voyage-tank-zero-capacity-empty-ok: feasible ${S(tz.voyages[0].feasible)}, its utilisation reported as ${f6(tz.voyages[0].constraints.find((c) => c.constraint.startsWith('tank')).utilisation)}); a load of that product is refused by name, and a missing tank is refused too (${ref('refusals')}: voyage-refuse-tank-zero-capacity, voyage-refuse-milk-run-tank-zero, voyage-refuse-tank-missing).`);

/* ============================================================ SECTION 12 */

section('binding', 'Utilisation, the binding constraint and its tie rule, and an overloaded voyage', ['Associate m05']);
w('UTILISATION of a constraint is its load over its capacity. The BINDING constraint is the one with the highest utilisation; a tie at twelve significant digits goes to the first in the order deck area, deck load, deadweight, then the tanks in the order of the products. A constraint is OVERLOADED when its load is above its capacity at twelve digits: a load exactly at capacity is feasible. The engine names the binding constraint and every overloaded one in its reasons.');
w();
const bnd1 = runG('voyage-at-capacity-feasible');
const bnd2 = runG('voyage-one-over-deck-load');
const bnd3 = runG('voyage-binding-tie-goes-to-deck-area');
const bnd4 = runG('voyage-binding-tank');
const bnd5 = runG('voyage-decimal-sum-at-capacity');
const rowB = (id, r) => { const v = r.voyages[0]; return [id, `${v.binding.constraint} at ${f6(v.binding.utilisation)}`, S(v.feasible), list(v.overloaded), v.reasons.join(' / ')]; };
table(['golden input', 'binding (engine)', 'feasible (engine)', 'overloaded (engine)', 'the engine\'s reasons, verbatim'], [
  rowB('voyage-at-capacity-feasible', bnd1), rowB('voyage-one-over-deck-load', bnd2), rowB('voyage-binding-tie-goes-to-deck-area', bnd3),
  rowB('voyage-binding-tank', bnd4), rowB('voyage-decimal-sum-at-capacity', bnd5), rowB('ekene-voyage-milk-run-psv', ekV), rowB('ekene-voyage-deck-overloaded', ekO),
]);
must('at capacity feasible; one over overloaded; tie to deck area; tank binds; decimal sum at capacity feasible', bnd1.voyages[0].feasible && !bnd2.voyages[0].feasible && bnd3.voyages[0].binding.constraint === 'deck area' && bnd4.voyages[0].binding.constraint.startsWith('tank') && bnd5.voyages[0].feasible, 'binding');
const tieRows = bnd3.voyages[0].constraints.filter((c) => c.utilisation === bnd3.voyages[0].binding.utilisation).map((c) => c.constraint);
must('the tie case has deck area and deck load at the same utilisation', tieRows.includes('deck area') && tieRows.includes('deck load'), tieRows.join());
w();
w(`THE TIE. On voyage-binding-tie-goes-to-deck-area, ${tieRows.join(' and ')} share a utilisation of ${f6(bnd3.voyages[0].binding.utilisation)} (engine), and the engine names deck area, the first in the order.`);
w();
w(`A DECIMAL SUM AT CAPACITY. On voyage-decimal-sum-at-capacity two deck cargoes of 0.1 and 0.2 m2 fill a 0.3 m2 deck; the double sum is ${S(bnd5.voyages[0].load.deckAreaM2)} and its utilisation ${S(bnd5.voyages[0].binding.utilisation)} (engine, printed in full), and the twelve-digit rule reads it as at capacity, so the voyage is feasible.`);
w();
const ekA = runG('ekene-voyage-milk-run-ahts');
w(`AN OVERLOADED VOYAGE. The same voyage cargo on the Ekene AHTS milk run (golden input ekene-voyage-milk-run-ahts) is overloaded on ${list(ekA.voyages[0].overloaded)}, with ${ekA.voyages[0].binding.constraint} binding at ${f6(ekA.voyages[0].binding.utilisation)} (engine). The engine\'s reasons, verbatim:`);
reasons(ekA.voyages[0].reasons);
w();
w('An overloaded voyage is a result with its reasons: the engine plans it and says what does not fit. A load of a product the vessel has no tank for is a refusal (' + ref('refusals') + '), because no voyage of that vessel can carry it.');
w();
w('READING A VOYAGE PLAN, in the order the engine returns it: the legs and their calm hours, the hours by activity after the weather factor, the days, the fuel by activity and its cost, the load (deck area, deck weight, bulk by product and the deadweight), each constraint with its load, capacity and utilisation, the binding constraint, the overloaded ones, and the reasons.');

/* ============================================================ SECTION 13 */

section('endtoend', 'Planning a voyage end to end: a PSV and an AHTS on one route, calm and rainy season', ['Associate m06']);
w('THE TWO VESSELS ON THE SAME MILK RUN AND THE SAME CARGO (golden inputs ekene-voyage-milk-run-psv and ekene-voyage-milk-run-ahts, weather factor 1.2 on sailing and field time):');
w();
table(['vessel', 'speed, knots (fixture)', 'total hours (engine)', 'fuel t (engine)', 'fuel cost (engine)', 'binding (engine)', 'feasible (engine)'], [
  [FX.vessels.psv.name, S(FX.vessels.psv.speedKnots), f6(ekVv.hours.total), f6(ekVv.fuelT.total), f6(ekVv.fuelCost), `${ekVv.binding.constraint} at ${f6(ekVv.binding.utilisation)}`, S(ekVv.feasible)],
  [FX.vessels.ahts.name, S(FX.vessels.ahts.speedKnots), f6(ekA.voyages[0].hours.total), f6(ekA.voyages[0].fuelT.total), f6(ekA.voyages[0].fuelCost), `${ekA.voyages[0].binding.constraint} at ${f6(ekA.voyages[0].binding.utilisation)}`, S(ekA.voyages[0].feasible)],
]);
must('the AHTS is faster and overloaded, the PSV slower and feasible', ekA.voyages[0].hours.total < ekVv.hours.total && !ekA.voyages[0].feasible && ekVv.feasible, 'psv ahts');
w();
w('The AHTS sails the route in fewer hours and cannot carry the cargo; the PSV carries it. A faster voyage that does not fit is not a plan.');
w();
w(`CALM AND RAINY SEASON. The calm milk run takes ${f6(ekC.voyages[0].days)} days and burns fuel costing ${f6(ekC.voyages[0].fuelCost)}; with the rainy-season factor of ${S(gEk.weather.factor)} on sailing and field time it takes ${f6(ekVv.days)} days and costs ${f6(ekVv.fuelCost)} (engine). The capacity figures are the same in both, because weather changes time and fuel and leaves the cargo where it is.`);
must('weather leaves the utilisation unchanged', JSON.stringify(ekC.voyages[0].constraints) === JSON.stringify(ekVv.constraints), 'weather cargo');
w();
w('CHECKING A PLAN BEFORE IT SAILS, in the engine\'s terms: every product has a stated tank and density; the route names every stop once with one more leg than stops, or a distance for every dedicated installation; the weather factor and the activities it slows are stated; the voyage is feasible, and if it is not, the reasons name each overloaded constraint; the binding constraint and its utilisation are read off; the days fit the time the vessel has; the fuel and its cost are read with the price they rest on.');

/* ============================================================ SECTION 14 */

section('demand', 'Demand over a period: demand over capacity per constraint, minimum visits and what drives the voyage count', ['Professional m01']);
w('A PERIOD\'S DEMAND. fleetSize reads each installation\'s demand over the stated period (deck m2, deck t and bulk m3 by product) and its stated minimum visits in the period. A voyage set is the milk run (the demand of every stop added up) or one dedicated installation. For each constraint the demand over the capacity is how many full voyages that constraint alone needs; the voyages of demand are the largest of those ratios, and the voyages needed are the larger of that and the minimum visits (the largest minimum visits of the stops on a milk run).');
w();
const ekFs = ekF.voyageSets[0];
w(`THE EKENE WEEK ON THE PSV MILK RUN (golden input ekene-fleet-psv-milk-run). Per constraint, the engine returns the week\'s demand and the capacity of one voyage; the ratio is their quotient (derived):`);
w();
table(['constraint', 'demand in the week (engine)', 'capacity a voyage (engine)', 'demand over capacity (derived)'], ekFs.constraints.map((c) => [c.constraint, f6(c.demand), f6(c.capacity), f6(c.capacity === 0 ? 0 : c.demand / c.capacity)]));
const maxRatio = Math.max(...ekFs.constraints.map((c) => (c.capacity === 0 ? 0 : c.demand / c.capacity)));
must('the largest ratio is the engine voyagesExact', Math.abs(maxRatio - ekFs.voyagesExact) < 1e-12, `${maxRatio} ${ekFs.voyagesExact}`);
w();
w(`The largest ratio is deck area\'s, ${f6(ekFs.voyagesExact)} (engine: voyagesExact), above the largest minimum visits of the four stops, ${S(Math.max(...gEf.installations.map((x) => x.minVisits)))} (fixture), so the engine names "${ekFs.drivenBy}" as the driver.`);
w();
const mv = runG('fleet-min-visits-drive');
const mvE = runG('fleet-min-visits-equal-demand-names-demand');
const nd = runG('fleet-no-demand-no-visits');
const td = runG('fleet-tank-drives');
const drv = (id, r) => { const a = argsOf(id); const s = r.voyageSets[0]; return [id, `${f6(a.installations[0].demand.deckAreaM2)} m2${a.installations[0].demand.bulk ? `, ${bulkOf(a.installations[0].demand.bulk)} m3` : ''}`, S(a.installations[0].minVisits), f6(s.voyagesExact), S(s.voyages), s.drivenBy]; };
w('WHAT DRIVES THE COUNT (golden inputs, one dedicated installation, a deck area capacity of 100 m2 and a tank of 100 m3):');
w();
table(['golden input', 'demand', 'minimum visits', 'voyages before rounding (engine)', 'voyages (engine)', 'driven by (engine)'], [
  drv('fleet-demand-exactly-three-voyages', runG('fleet-demand-exactly-three-voyages')), drv('fleet-min-visits-drive', mv), drv('fleet-min-visits-equal-demand-names-demand', mvE),
  drv('fleet-no-demand-no-visits', nd), drv('fleet-tank-drives', td)]);
must('minimum visits drive at 3 over 2.5; demand named at an equal 3; no demand; the tank drives', mv.voyageSets[0].drivenBy === 'minimum visits' && mvE.voyageSets[0].drivenBy === 'deck area' && nd.voyageSets[0].drivenBy === 'no demand' && td.voyageSets[0].drivenBy.startsWith('tank'), 'drivers');
w();
w('The engine names a constraint when its ratio is at or above the minimum visits (a tie names the demand), "minimum visits" when the visits are larger, and "no demand" when there is neither demand nor a visit.');

/* ============================================================ SECTION 15 */

section('vesseldays', 'Voyages and vessel-days: rounding voyages, voyage days, dedicated sets, and a voyage longer than the days available', ['Professional m02']);
w('ROUNDING VOYAGES is a stated rule: "up" to whole voyages (the ceiling of the twelve-digit figure), or "none", which keeps the fractional average. Vessel-days for a voyage set are its voyages times its voyage days (the voyage\'s hours after the weather factor, over 24); the fleet\'s vessel-days are the sum over the voyage sets.');
w();
const ekFf = runG('ekene-fleet-fractional');
table(['golden input', 'voyage rounding', 'voyages before rounding (engine)', 'voyages (engine)', 'voyage days (engine)', 'vessel-days (engine)'], [
  ['ekene-fleet-psv-milk-run', gEf.voyageRounding, f6(ekFs.voyagesExact), cnt(ekFs.voyages), f6(ekFs.voyageDays), f6(ekFs.vesselDays)],
  ['ekene-fleet-fractional', argsOf('ekene-fleet-fractional').voyageRounding, f6(ekFf.voyageSets[0].voyagesExact), cnt(ekFf.voyageSets[0].voyages), f6(ekFf.voyageSets[0].voyageDays), f6(ekFf.voyageSets[0].vesselDays)],
]);
must('vessel-days are voyages times voyage days', ekFs.vesselDays === ekFs.voyages * ekFs.voyageDays && ekFf.voyageSets[0].vesselDays === ekFf.voyageSets[0].voyages * ekFf.voyageSets[0].voyageDays, 'vd');
w();
w(`Rounding up asks for ${f6(ekFs.vesselDays)} vessel-days in the week; the fractional average asks for ${f6(ekFf.voyageSets[0].vesselDays)} (engine). "none" is the long-run average over many periods, which no single week can sail.`);
w();
const ex3 = runG('fleet-demand-exactly-three-voyages');
const ov3 = runG('fleet-demand-just-over-three-voyages');
const dx3 = runG('fleet-decimal-ratio-exactly-three');
w('ROUNDING UP AT ITS BOUNDARY (golden inputs, one dedicated installation driven by its deck area):');
w();
const cap0 = (id) => runG(id).voyageSets[0].constraints[0].capacity;
const r217 = runG('fleet-decimal-ratio-2-1-over-0-7-is-three');
table(['golden input', 'deck demand, m2 (golden input)', 'deck area capacity, m2 (engine)', 'voyages before rounding (engine, printed in full)', 'voyages (engine)'], [
  ['fleet-demand-exactly-three-voyages', S(argsOf('fleet-demand-exactly-three-voyages').installations[0].demand.deckAreaM2), S(cap0('fleet-demand-exactly-three-voyages')), S(ex3.voyageSets[0].voyagesExact), S(ex3.voyageSets[0].voyages)],
  ['fleet-decimal-ratio-exactly-three', S(argsOf('fleet-decimal-ratio-exactly-three').installations[0].demand.deckAreaM2), S(cap0('fleet-decimal-ratio-exactly-three')), S(dx3.voyageSets[0].voyagesExact), S(dx3.voyageSets[0].voyages)],
  ['fleet-decimal-ratio-2-1-over-0-7-is-three', S(argsOf('fleet-decimal-ratio-2-1-over-0-7-is-three').installations[0].demand.deckAreaM2), S(cap0('fleet-decimal-ratio-2-1-over-0-7-is-three')), S(r217.voyageSets[0].voyagesExact), S(r217.voyageSets[0].voyages)],
  ['fleet-demand-just-over-three-voyages', S(argsOf('fleet-demand-just-over-three-voyages').installations[0].demand.deckAreaM2), S(cap0('fleet-demand-just-over-three-voyages')), S(ov3.voyageSets[0].voyagesExact), S(ov3.voyageSets[0].voyages)],
]);
w();
w('The first three rows are three voyages of demand, whatever the double arithmetic leaves in the last digit; the fourth asks for a thousandth of a square metre more than three voyages carry, and rounds up to four.');
must('three is three, and 300.001 is four', ex3.voyageSets[0].voyages === 3 && dx3.voyageSets[0].voyages === 3 && ov3.voyageSets[0].voyages === 4, 'round up');
must('the decimal ratio 2.1 over 0.7 is a 0.7 m2 deck', argsOf('fleet-decimal-ratio-2-1-over-0-7-is-three').vessel.deckAreaM2 * argsOf('fleet-decimal-ratio-2-1-over-0-7-is-three').vessel.deckUsableFraction === 0.7 && argsOf('fleet-decimal-ratio-2-1-over-0-7-is-three').installations[0].demand.deckAreaM2 === 2.1, 'decimal');
w();
w('DEDICATED VOYAGES SIZED ONE BY ONE (golden input ekene-fleet-psv-dedicated): each installation is its own voyage set, with its own ratio, its own minimum visits and its own voyage days.');
w();
table(['voyage set', 'voyages before rounding (engine)', 'voyages (engine)', 'driven by (engine)', 'voyage days (engine)', 'vessel-days (engine)'], ekFd.voyageSets.map((s) => [s.id, f6(s.voyagesExact), S(s.voyages), s.drivenBy, f6(s.voyageDays), f6(s.vesselDays)]));
w();
w(`The dedicated week needs ${f6(ekFd.vesselDays)} vessel-days against the milk run\'s ${f6(ekF.vesselDays)} (engine).`);
w();
const lng = runG('fleet-voyage-longer-than-available');
const lngA = argsOf('fleet-voyage-longer-than-available');
w(`A VOYAGE LONGER THAN THE DAYS AVAILABLE (golden input fleet-voyage-longer-than-available: ${S(lngA.portHours)} port hours make one voyage longer than the ${S(lngA.vesselAvailableDays)} days a vessel is available). This is a result with a reason, verbatim:`);
reasons(lng.reasons);
w(`The engine still sizes it: ${f6(lng.vesselDays)} vessel-days and ${S(lng.vessels)} vessels (engine), which no single vessel can sail inside the period.`);

/* ============================================================ SECTION 16 */

section('vessels', 'Vessels required: available days, the rounding rule, spare and short vessel-days, utilisation and fuel for the period', ['Professional m03']);
w(`AVAILABLE DAYS are stated, at most the period: the crew change and maintenance allowance is the planner\'s. Vessels before rounding are the vessel-days over the available days a vessel; the stated rule rounds them "up", to the "nearest" whole vessel (halves up) or "none". The capacity in vessel-days is the vessels times the available days; spare vessel-days are the capacity less the need, and short vessel-days the need less the capacity when the need is larger at twelve digits. Fleet utilisation is the need over the capacity.`);
w();
const vu = runG('fleet-vessels-up');
const vn = runG('fleet-vessels-nearest-short');
const vo = runG('fleet-vessels-none');
const vh = runG('fleet-vessels-nearest-half-rounds-up');
const v2 = runG('fleet-vessel-days-exactly-two-vessels');
const vrow = (id, r) => [id, argsOf(id).vesselRounding, f6(r.vesselDays), f6(r.vesselsExact), cnt(r.vessels), f6(r.capacityDays), f6(r.spareVesselDays), f6(r.shortVesselDays), f6(r.fleetUtilisation)];
table(['golden input', 'vessel rounding', 'vessel-days (engine)', 'vessels before rounding (engine)', 'vessels (engine)', 'capacity, vessel-days (engine)', 'spare (engine)', 'short (engine)', 'fleet utilisation (engine)'], [
  vrow('fleet-vessels-up', vu), vrow('fleet-vessels-nearest-short', vn), vrow('fleet-vessels-none', vo), vrow('fleet-vessels-nearest-half-rounds-up', vh), vrow('fleet-vessel-days-exactly-two-vessels', v2),
]);
must('up gives 2, nearest 1 and short, none 1.416667; a half rounds up; exactly two is two', vu.vessels === 2 && vn.vessels === 1 && vn.shortVesselDays > 0 && vo.vessels === vo.vesselsExact && vh.vessels === 2 && vh.vesselsExact === 1.5 && v2.vessels === 2 && v2.fleetUtilisation === 1, 'vessels');
w();
w('THE SHORTFALL IS A RESULT WITH A REASON. On fleet-vessels-nearest-short the nearest whole vessel leaves the need uncovered, verbatim:');
reasons(vn.reasons);
w();
const avE = runG('fleet-available-equals-period');
w(`AVAILABLE DAYS AT THE PERIOD. Available days equal to the period are accepted (golden input fleet-available-equals-period: ${S(argsOf('fleet-available-equals-period').vesselAvailableDays)} of ${S(argsOf('fleet-available-equals-period').periodDays)}; ${f6(avE.vesselsExact)} vessels before rounding, engine); more than the period is refused by name (${ref('refusals')}: fleet-refuse-available-above-period).`);
w();
const ekFa = runG('ekene-fleet-ahts-milk-run');
const ekFad = runG('ekene-fleet-ahts-dedicated');
const ekFc = runG('ekene-fleet-calm');
w('THE EKENE WEEK ON BOTH VESSELS AND BOTH ROUTES, WITH THE NEAREST RULE AND IN CALM WEATHER (golden inputs; voyages rounded up; vessels rounded up, except ekene-fleet-nearest-vessels, which rounds them to the nearest; fuel at the fixture price):');
w();
const frow = (id, r) => [id, r.voyageSets.map((s) => `${s.id} ${S(s.voyages)} (${s.drivenBy})`).join('; '), f6(r.vesselDays), f6(r.vesselsExact), S(r.vessels), f6(r.spareVesselDays), f6(r.fleetUtilisation), f6(r.fuelT), f6(r.fuelCost)];
table(['golden input', 'voyages by set (engine)', 'vessel-days (engine)', 'vessels before rounding (engine)', 'vessels (engine)', 'spare vessel-days (engine)', 'fleet utilisation (engine)', 'fuel t (engine)', 'fuel cost (engine)'], [
  frow('ekene-fleet-psv-milk-run', ekF), frow('ekene-fleet-nearest-vessels', runG('ekene-fleet-nearest-vessels')), frow('ekene-fleet-ahts-milk-run', ekFa), frow('ekene-fleet-psv-dedicated', ekFd), frow('ekene-fleet-ahts-dedicated', ekFad), frow('ekene-fleet-calm', ekFc),
]);
must('every Ekene week needs two vessels', [ekF, ekFa, ekFd, ekFad, ekFc, runG('ekene-fleet-nearest-vessels')].every((r) => r.vessels === 2), 'two');
must('the nearest rule states nearest', argsOf('ekene-fleet-nearest-vessels').vesselRounding === 'nearest', 'nearest');
w();
w(`A PSV OR AN AHTS FOR THE SAME DEMAND. On the milk run the AHTS\'s smaller deck needs ${S(ekFa.voyageSets[0].voyages)} voyages where the PSV needs ${S(ekFs.voyages)}, and its utilisation of the two vessels is ${f6(ekFa.fleetUtilisation)} against ${f6(ekF.fleetUtilisation)} (engine). Both weeks round up to ${S(ekF.vessels)} vessels; the spare vessel-days and the fuel differ.`);
w();
w('FUEL FOR THE PERIOD is the voyages of each set times the fuel of one of its voyages, added over the sets; its cost is the tonnes times the stated price.');

/* ============================================================ SECTION 17 */

section('deckcargo', 'Deck cargo and footprints: items, units, the area bound with no stacking, and the lower bound', ['Professional m04']);
w('ITEMS AND UNITS. A deck plan states each item line with an id, a length and a width in metres, a weight in tonnes and a whole quantity. The footprint of one unit is its length times its width. A line of one unit is named by its id; a line of several is named id#1, id#2 and so on. The usable area is the deck area times the stated usable fraction, and the deck load is stated in tonnes.');
w();
w(`THE AREA BOUND. A unit fits a voyage when the footprints already on it plus its own stay at or below the usable area AND the weights stay at or below the deck load, both at twelve digits (inclusive). Cargo is never stacked and footprints are never checked against the deck\'s shape: the plan is an area bound, the same measure Aas, Halskau and Wallace (2009) describe for deck cargo (taught by concept). A deck plan is packed onto a stated number of voyages; a unit no voyage can take is OVERFLOW, named with its reason.`);
w();
const ekDp = ekD1;
w(`THE EKENE VOYAGE OF DECK CARGO (golden input ekene-deck-one-voyage-ffd): ${S(FX.deckItems.reduce((s, x) => s + x.quantity, 0))} units with footprints totalling ${f6(ekDp.totalAreaM2)} m2 and weights totalling ${f6(ekDp.totalWeightT)} t (engine), against a usable area of ${f6(ekDp.usableAreaM2)} m2 and a deck load of ${S(FX.deck.loadT)} t.`);
must('the fixture has 61 units', FX.deckItems.reduce((s, x) => s + x.quantity, 0) === 61, 'units');
w();
w(`THE LOWER BOUND on voyages is the larger of the total area over the usable area and the total weight over the deck load, each rounded up at twelve digits: here ${S(ekDp.lowerBound)} voyages (engine). No packing rule can carry the cargo on fewer; a rule may need more.`);
must('lower bound 2: the area ratio 1.026216 rounds up to 2', ekDp.lowerBound === 2 && Math.ceil(ekDp.totalAreaM2 / ekDp.usableAreaM2) === 2, ekDp.lowerBound);
w();
const lgt = runG('ekene-deck-light-load-limit');
const lgtA = argsOf('ekene-deck-light-load-limit');
const big = runG('deck-item-larger-than-deck');
const hvy = runG('deck-item-heavier-than-deck-load');
w(`WHEN THE DECK LOAD BINDS. The same cargo on a deck rated at ${S(lgtA.deck.loadT)} t (golden input ekene-deck-light-load-limit, ${S(lgtA.voyages)} voyages) packs as below (engine): the weights reach the deck load before the footprints fill the area.`);
w();
table(['voyage', 'units (engine)', 'area, m2 (engine)', 'weight, t (engine)', 'area utilisation (engine)', 'load utilisation (engine)'], lgt.voyages.map((v) => [S(v.voyage), S(v.units.length), f6(v.areaM2), f6(v.weightT), f6(v.areaUtilisation), f6(v.loadUtilisation)]));
must('the light deck packs the first voyage to its load', lgt.voyages[0].loadUtilisation === 1 && lgt.lowerBound === 2, lgt.voyages[0].loadUtilisation);
w();
w('WHAT THE AREA BOUND LEAVES OUT, and the two overflow reasons no voyage count can cure (golden inputs):');
w();
table(['golden input', 'the overflow reason, verbatim'], [
  ['deck-item-larger-than-deck', big.overflow.map((o) => o.reason).join(' / ')],
  ['deck-item-heavier-than-deck-load', hvy.overflow.map((o) => o.reason).join(' / ')],
]);
must('one unit too large and one too heavy', big.overflow.length === 1 && hvy.overflow.length === 1, 'overflow');
w();
w('The bound does not compare a basket\'s length with the deck\'s width, does not stack a skip on a container, does not keep a lane clear for the crane and does not balance the load; those are the deck foreman\'s, and a plan that passes the area bound can still fail on the deck (' + ref('notcomputed') + ').');

/* ============================================================ SECTION 18 */

section('ffd', 'First-fit decreasing: sorting by area, the first voyage that holds a unit, ties heavier first, first fit in the booked order, and overflow', ['Professional m05']);
w('TWO STATED RULES. "first-fit-decreasing-area" sorts the units by footprint area, largest first, then heavier first, then item id, then unit number, and puts each unit on the first voyage that still holds it (Johnson 1973; the rule as the Wikipedia article on first-fit decreasing describes it, cited). "first-fit" keeps the booked order and puts each unit on the first voyage that still holds it. The rule is required; there is no default.');
w();
const ekFF = ekD1f;
w(`THE EKENE CARGO ON ONE VOYAGE, BOTH RULES (golden inputs ekene-deck-one-voyage-ffd and ekene-deck-one-voyage-first-fit). The fixture books the items smallest first.`);
w();
table(['golden input', 'rule', 'first units in the packing order (engine)', 'area carried, m2 (engine)', 'weight carried, t (engine)', 'units carried (engine)', 'overflow units (engine)'], [
  ['ekene-deck-one-voyage-ffd', 'first-fit-decreasing-area', ekD1.packingOrder.slice(0, 4).join(', '), f6(ekD1.voyages[0].areaM2), f6(ekD1.voyages[0].weightT), S(ekD1.voyages[0].units.length), S(ekD1.overflow.length)],
  ['ekene-deck-one-voyage-first-fit', 'first-fit', ekFF.packingOrder.slice(0, 4).join(', '), f6(ekFF.voyages[0].areaM2), f6(ekFF.voyages[0].weightT), S(ekFF.voyages[0].units.length), S(ekFF.overflow.length)],
]);
w();
const ovA = ekD1.overflow.reduce((s, o) => s + o.areaM2, 0);
w(`First-fit decreasing puts the two casing bundles on first and leaves ${S(ekD1.overflow.length)} small units behind, ${f6(ovA)} m2 of footprint (derived: the overflow footprints added). First fit in the booked order fills the deck with the small units first and strands a casing bundle, ${f6(ekFF.overflow[0].areaM2)} m2 (engine). The overflow reasons, verbatim:`);
must('the FFD overflow is 16.5 m2 of small units and first fit strands one bundle', Math.abs(ovA - 16.5) < 1e-9 && ekFF.overflow.length === 1 && ekFF.overflow[0].itemId === 'pipe-bundle', ovA);
quote(ekD1.overflow[0].reason);
quote(ekFF.overflow[0].reason);
w();
w(`TWO VOYAGES (golden input ekene-deck-two-voyages-ffd): first-fit decreasing carries all ${S(ekD2.voyages.reduce((s, v) => s + v.units.length, 0))} units, ${f6(ekD2.voyages[0].areaM2)} m2 on the first voyage and ${f6(ekD2.voyages[1].areaM2)} m2 on the second (engine), no overflow, matching the lower bound of ${S(ekD2.lowerBound)}.`);
w();
const tie = runG('deck-ties-heavier-first-then-id');
const tieA = argsOf('deck-ties-heavier-first-then-id');
w(`TIES GO TO THE HEAVIER UNIT, THEN THE ITEM ID, THEN THE UNIT NUMBER (golden input deck-ties-heavier-first-then-id: ${tieA.items.map((x) => `${x.id} ${S(x.lengthM)} m by ${S(x.widthM)} m at ${S(x.weightT)} t, quantity ${S(x.quantity)}`).join('; ')}; every footprint is ${f6(tieA.items[0].lengthM * tieA.items[0].widthM)} m2). The engine sorts them ${tie.packingOrder.join(', ')} and packs ${tie.voyages.map((v) => `voyage ${S(v.voyage)}: ${v.units.join(', ')}`).join('; ')}.`);
must('the tie order is c, a, b#1, b#2', tie.packingOrder.join() === 'c,a,b#1,b#2', tie.packingOrder.join());
w();
const exf = runG('deck-exact-fit-inclusive');
const dff = runG('deck-decimal-footprints-fill-exactly');
w(`A FIT IS INCLUSIVE. Two units of 2.5 m2 and 1.5 t fill a usable area of ${f6(exf.usableAreaM2)} m2 and a deck load of ${S(argsOf('deck-exact-fit-inclusive').deck.loadT)} t exactly (golden input deck-exact-fit-inclusive): both go on, area utilisation ${f6(exf.voyages[0].areaUtilisation)}. Footprints of 0.1 and 0.2 m2 fill a 0.3 m2 deck (golden input deck-decimal-footprints-fill-exactly: ${S(dff.voyages[0].units.length)} units carried, the double sum ${S(dff.voyages[0].areaM2)}, engine).`);
must('exact fit carries both units and the decimal fill carries both', exf.voyages[0].units.length === 2 && exf.overflow.length === 0 && dff.voyages[0].units.length === 2, 'exact');
w();
w('THE THREE OVERFLOW REASONS the engine writes: a footprint larger than the usable deck area; a weight above the deck load; and no voyage with the unit\'s area and weight left. The first two need a bigger deck; the third needs another voyage.');

/* ============================================================ SECTION 19 */

section('packing', 'Published packing examples: two capacities, a larger deck that needs more voyages, and a tight worst case', ['Professional m06']);
w(`The four packings of ${ref('published')} (checks seven to nine) are the textbook side of the deck plan: each is a list of one-metre-wide footprints with no weight, packed by the engine exactly as the article prints it.`);
w();
const cgjFF = runG('ffd-wikipedia-cgj-first-fit-order');
const cgjFFA = argsOf('ffd-wikipedia-cgj-first-fit-order');
w(`FIRST FIT ON THE SAME LIST. The golden input ffd-wikipedia-cgj-first-fit-order states the capacity 60 items in the order ${cgjFFA.items.map((x) => S(x.lengthM)).join(', ')} with the rule "first-fit": they are already in decreasing order, so first fit packs ${bins(Object.assign(cgjFF, { _items: Object.fromEntries(cgjFFA.items.map((x) => [x.id, x.lengthM])) }))} (engine), the same as first-fit decreasing.`);
must('first fit on a sorted list equals FFD', JSON.stringify(cgjFF.voyages.map((v) => v.units)) === JSON.stringify(f60.r.voyages.map((v) => v.units)), 'ff sorted');
w();
const f60ff = success('deckPlan on the capacity 60 list in ascending order with first-fit (stated probe)', E.deckPlan({ ...argsOf('ffd-wikipedia-cgj-capacity-60'), items: argsOf('ffd-wikipedia-cgj-capacity-60').items.slice().reverse(), rule: 'first-fit' }));
f60ff._items = Object.fromEntries(argsOf('ffd-wikipedia-cgj-capacity-60').items.map((x) => [x.id, x.lengthM]));
w(`THE BOOKED ORDER MATTERS. The same capacity 60 list booked smallest first and packed by first fit (stated probe: the golden input ffd-wikipedia-cgj-capacity-60 with its items reversed and the rule "first-fit") gives ${bins(f60ff)}, ${S(f60ff.voyagesUsed)} voyages (engine), where first-fit decreasing gives ${S(f60.r.voyagesUsed)}.`);
must('first fit on the reversed capacity 60 list needs more voyages than FFD', f60ff.voyagesUsed > f60.r.voyagesUsed, f60ff.voyagesUsed);
w();
w(`WHAT THE EXAMPLES TEACH, each from the engine\'s own packings above: first-fit decreasing can need more voyages on a larger deck (${S(f60.r.voyagesUsed)} at capacity 60, ${S(f61.r.voyagesUsed)} at 61); it can use ${S(fds.r.voyagesUsed)} voyages where the text\'s optimum is ${TEXT.ffd.dosaOpt} and the engine\'s lower bound is ${S(fds.r.lowerBound)}; and it is a rule, stated and repeatable, with no search for the best packing.`);

/* ============================================================ SECTION 20 */

section('queue', 'The shore base as a queue: the working-hour clock, the service time, the offered load and the berth utilisation', ['Expert m01']);
w('THE WORKING-HOUR CLOCK. The base is modelled on its working hours: arrivals an hour are the stated arrivals a day over the stated working hours a day (at most 24), and every time the queue returns is in working hours. A call\'s SERVICE TIME is the stated fixed hours plus the lift hours (lifts over the stated lifts an hour) and the bulk hours (m3 over the stated m3 an hour), the two added when they run one after the other (concurrent false) or the larger of the two when they run at the same time (concurrent true); the choice is required. The OFFERED LOAD is the arrivals an hour times the service time, and the BERTH UTILISATION is the offered load over the berths.');
w();
const seqB = runG('ekene-base-sequential-service');
const twB = runG('ekene-base-twelve-hour-day');
const brow = (id, r) => { const a = argsOf(id); return [id, S(a.berths), S(a.arrivalsPerDay), S(a.workingHoursPerDay), S(a.service.concurrent), f6(r.liftHours), f6(r.bulkHours), f6(r.serviceHours), f6(r.arrivalsPerHour), f6(r.offeredLoad), f6(r.berthUtilisation)]; };
table(['golden input', 'berths', 'arrivals a day', 'working hours', 'concurrent', 'lift hours (engine)', 'bulk hours (engine)', 'service hours (engine)', 'arrivals an hour (engine)', 'offered load (engine)', 'berth utilisation (engine)'], [
  brow('ekene-base-mmc', ekB), brow('ekene-base-sequential-service', seqB), brow('ekene-base-twelve-hour-day', twB)]);
must('concurrent service is fixed plus the larger; sequential is fixed plus both', ekB.serviceHours === 2 + Math.max(5, 6) && seqB.serviceHours === 2 + 5 + 6, `${ekB.serviceHours} ${seqB.serviceHours}`);
must('a twelve-hour day doubles the arrivals an hour', twB.arrivalsPerHour === 2 * ekB.arrivalsPerHour, twB.arrivalsPerHour);
w();
w(`The Ekene base on a ${S(argsOf('ekene-base-twelve-hour-day').workingHoursPerDay)}-hour working day takes the same ${S(argsOf('ekene-base-twelve-hour-day').arrivalsPerDay)} arrivals a day in half the hours, so its arrivals an hour and its berth utilisation are higher (engine); with the lifts and the bulk one after the other the service time is ${f6(seqB.serviceHours)} hours where it was ${f6(ekB.serviceHours)} (engine).`);
w();
w('A STEADY STATE NEEDS A BERTH UTILISATION BELOW 1. At or above it the queue grows without limit, and the engine refuses, printing the largest arrivals a day that stay below saturation. The printed bound is the six-decimal figure nearest the exact bound on the accepted side, and the message says so when it is rounded down (golden inputs, verbatim):');
w();
const sat = ['base-refuse-saturated-exactly', 'base-refuse-saturated-thirds', 'base-refuse-ekene-one-berth-overloaded'].map((id) => { const r = refusal(`shoreBase on ${id}`, E.shoreBase(argsOf(id)), 'arrivalsPerDay'); return [id, r.error]; });
table(['golden input', 'the engine\'s message, verbatim'], sat);
const jb = runG('base-just-below-saturation');
w();
w(`JUST BELOW. On base-just-below-saturation the berth utilisation is ${f6(jb.berthUtilisation)} and the engine returns a mean wait of ${f6(jb.meanWaitHours)} hours and a mean queue of ${f6(jb.meanQueue)} (engine): the steady state exists, and it is long.`);
must('just below saturation is accepted with a very long wait', jb.berthUtilisation < 1 && jb.meanWaitHours > 900, jb.meanWaitHours);

/* ============================================================ SECTION 21 */

section('mmc', 'Erlang C and M/M/c: the probability of waiting, mean wait and mean queue, Little\'s law, the published tables and a printed slip', ['Expert m02']);
w('M/M/c. Poisson arrivals, exponential service times, c berths, first come first served. With offered load a and utilisation rho = a / c below 1: the delay probability PiW is Erlang\'s C formula (Adan and Resing 2015, eq. 5.1; Iversen 2001, s. 12.2), which the engine computes by the stable Erlang B recursion (Adan and Resing, s. 11.3, recursion 11.3 and remark 11.3.2); the mean queue is E(Lq) = PiW rho / (1 - rho) (eq. 5.2); the mean wait is E(W) = PiW S / (c (1 - rho)) with S the service time (eq. 5.3); the mean time at the base is the wait plus S; the mean in the system is E(Lq) plus a.');
w();
w('THE EKENE BASE WITH MORE BERTHS (stated probes: ekene-base-mmc with the berths stated as below):');
w();
const sweep = [1, 2, 3, 4, 5].map((c) => { const r = E.shoreBase({ ...argsOf('ekene-base-mmc'), berths: c }); return [c, r]; });
table(['berths (stated)', 'berth utilisation (engine)', 'delay probability (engine)', 'mean queue (engine)', 'mean wait, hours (engine)', 'mean time at the base, hours (engine)', 'mean in the system (engine)'],
  sweep.map(([c, r]) => (r.error ? [S(c), 'refused: see ' + ref('queue'), '', '', '', '', ''] : [S(c), f6(r.berthUtilisation), f6(r.probabilityWait), f6(r.meanQueue), f6(r.meanWaitHours), f6(r.meanTimeAtBaseHours), f6(r.meanInSystem)])));
must('one berth refused, two to five accepted with falling waits', !!sweep[0][1].error && sweep.slice(1).every(([, r], i, arr) => !r.error && (i === 0 || r.meanWaitHours < arr[i - 1][1].meanWaitHours)), 'sweep');
w();
w('LITTLE\'S LAW AT THE BASE (Adan and Resing, s. 3.4): the mean queue is the arrivals an hour times the mean wait, and the mean in the system is the mean queue plus the offered load. On the Ekene base with two berths (golden input ekene-base-mmc):');
const lqL = ekB.arrivalsPerHour * ekB.meanWaitHours;
w(`- arrivals an hour ${f6(ekB.arrivalsPerHour)} times the mean wait ${f6(ekB.meanWaitHours)} is ${f6(lqL)} (derived); the engine\'s mean queue is ${f6(ekB.meanQueue)};`);
w(`- the mean queue plus the offered load ${f6(ekB.offeredLoad)} is ${f6(ekB.meanQueue + ekB.offeredLoad)} (derived); the engine\'s mean in the system is ${f6(ekB.meanInSystem)}.`);
must('Little: Lq = lambda Wq and L = Lq + a', Math.abs(lqL - ekB.meanQueue) < 1e-12 && Math.abs(ekB.meanQueue + ekB.offeredLoad - ekB.meanInSystem) < 1e-12, 'little');
w();
w(`THE PUBLISHED TABLES. Adan and Resing\'s Tables 5.1 and 5.2 and Iversen\'s Example 12.3.1 run through the engine in ${ref('published')} (checks one to three). Every printed figure is the engine\'s figure rounded, except the mean wait at five servers in Table 5.1: the table prints ${TEXT.ar51.rows[2][2]} where the formula gives ${f6(r51[2].meanWaitHours)}, which rounds to ${two(r51[2].meanWaitHours)}. The course teaches the printed ${TEXT.ar51.rows[2][2]} as a slip in the table.`);
w();
w('WHAT M/M/c ASSUMES. Arrivals at random (Poisson), service times spread like an exponential (as many short calls as the mean suggests, and some long ones), one queue served first come first served, and a steady state. A base whose calls take much the same time every time is closer to M/D/c (' + ref('mdc') + ').');

/* ============================================================ SECTION 22 */

section('mdc', 'Constant service and M/D/c: the Cosmetatos approximation, one berth and the exact formula, and the berth target', ['Expert m03']);
w('M/D/c. Poisson arrivals and a constant service time. There is no closed form for the M/D/c mean wait (Liu, Pantelidis, Tam and Chow, arXiv 2102.05851v2, CC BY 4.0); the engine uses the Cosmetatos (1975) approximation as that paper prints it in eq. (2): the M/D/c wait is the M/M/c wait over 2, times 1 plus (1 - rho)(c - 1)(sqrt(4 + 5c) - 2) / (16 rho c). The engine labels it an approximation and returns no delay probability for M/D/c.');
w();
const md1 = runG('base-md1-pollaczek-khinchin');
const md1A = argsOf('base-md1-pollaczek-khinchin');
const pk = (md1.berthUtilisation * md1.serviceHours) / (2 * (1 - md1.berthUtilisation));
w(`ONE BERTH, EXACT. At c = 1 the correction term is 0 and the formula is the Pollaczek-Khinchin mean value formula for M/D/1 (Adan and Resing 2015, eqs 7.14 to 7.16): the wait is rho S / (2 (1 - rho)). On the golden input base-md1-pollaczek-khinchin (${S(md1A.berths)} berth, a service of ${S(md1A.service.fixedHours)} hour, rho ${f6(md1.berthUtilisation)}) the engine returns a mean wait of ${f6(md1.meanWaitHours)} hours; the formula gives ${f6(pk)} (derived), half of the M/M/1 wait at the same load, ${f6(runG('adan-resing-table-5-1-c1').meanWaitHours)} hours (engine, golden input adan-resing-table-5-1-c1).`);
must('M/D/1 is the P-K formula and half of M/M/1', Math.abs(md1.meanWaitHours - pk) < 1e-12 && Math.abs(md1.meanWaitHours * 2 - runG('adan-resing-table-5-1-c1').meanWaitHours) < 1e-12, md1.meanWaitHours);
w();
const md3 = runG('base-mdc-three-berths');
const mm3 = E.shoreBase({ ...argsOf('base-mdc-three-berths'), model: 'M/M/c' });
w(`SEVERAL BERTHS, APPROXIMATE. On base-mdc-three-berths (${S(argsOf('base-mdc-three-berths').berths)} berths, rho ${f6(md3.berthUtilisation)}) the engine returns an M/D/c mean wait of ${f6(md3.meanWaitHours)} hours; the same inputs as M/M/c (stated probe) give ${f6(mm3.meanWaitHours)} hours (engine). On the Ekene base with two berths, M/D/c gives ${f6(ekBd.meanWaitHours)} hours against M/M/c\'s ${f6(ekB.meanWaitHours)} (engine), a ratio of ${f6(ekBd.meanWaitHours / ekB.meanWaitHours)} (derived).`);
must('M/D/c waits less than M/M/c at three berths and on the Ekene base', md3.meanWaitHours < mm3.meanWaitHours && ekBd.meanWaitHours < ekB.meanWaitHours, 'mdc less');
w();
w('HOW MANY BERTHS MEET A TARGET. With a stated targetMeanWaitHours the engine searches from the fewest berths that keep the utilisation below 1 (the whole part of the offered load, plus one) up to ' + S(D.MAX_BERTHS) + ', and returns the fewest whose mean wait is at or below the target (inclusive), with its reason. The search uses the stated model.');
w();
const tg = ['ekene-base-mmc-target-one-hour', 'ekene-base-mdc-target-one-hour', 'base-target-met-exactly-by-current', 'base-target-zero-unreachable'].map((id) => [id, runG(id)]);
table(['golden input', 'model', 'target, hours (golden input)', 'berths (engine)', 'mean wait there, hours (engine)', 'the engine\'s reason, verbatim'], tg.map(([id, r]) => [id, r.model, S(r.target.targetMeanWaitHours), r.target.berths === null ? 'none' : S(r.target.berths), r.target.meanWaitHours === null ? 'none' : f6(r.target.meanWaitHours), r.target.reason]));
must('the target is inclusive and zero is unreachable', tg[2][1].target.berths === 1 && tg[3][1].target.berths === null, 'target');
w();
w('A target met exactly is met: on base-target-met-exactly-by-current the wait at one berth is the target itself. A target of 0 hours is never met, and the engine reports it with no berth count.');

/* ============================================================ SECTION 23 */

section('variability', 'Weather and demand variability: the canonical Monte Carlo, two factors drawn in order, vessels as a distribution, the chance of being short', ['Expert m04']);
w('THE CANONICAL MONTE CARLO. fleetVariability samples through lib/stats: one mulberry32 stream on the stated seed; per iteration the weather factor is drawn first, then the demand factor, each only when it varies (a triangular { min, mode, max } with max above min; a plain number is fixed), each value the triangular inverse CDF of its uniform draw (triInvCDF). The demand factor multiplies every installation\'s demand. Each iteration sizes the fleet exactly as fleetSize does. The summaries are lib/stats basicStats; the labels are those of lib/conventions/percentile.js.');
w();
w('THE EXCEEDANCE SENTENCE the engine returns, verbatim:');
quote(EXCEEDANCE_DEFINITION);
const vk = runG('ekene-variability-psv-milk-run');
must('the engine returns the canonical exceedance sentence', vk.percentileDefinition === EXCEEDANCE_DEFINITION, vk.percentileDefinition);
w();
w('FOR A REQUIREMENT OR A COST, P90 IS THE LOW FIGURE: the 10th percentile of the sorted values (index floor(0.1 n)), met or exceeded in 90 percent of the draws; P10 is the HIGH figure, the 90th percentile. The engine\'s basis says so (' + ref('sources') + ').');
w();
const vkA = argsOf('ekene-variability-psv-milk-run');
w(`THE EKENE WEEK UNDER VARIABILITY (golden input ekene-variability-psv-milk-run: the PSV milk run, the weather factor triangular ${S(vkA.weather.factor.min)}, ${S(vkA.weather.factor.mode)}, ${S(vkA.weather.factor.max)} on ${vkA.weather.appliesTo.join(' and ')} time, the demand factor triangular ${S(vkA.demandFactor.min)}, ${S(vkA.demandFactor.mode)}, ${S(vkA.demandFactor.max)}, ${S(vkA.plannedVessels)} planned vessels; seed ${S(vkA.seed)}, ${S(vkA.iterations)} draws). Every figure below is a seeded Monte Carlo estimate on seed ${S(vkA.seed)} and ${S(vkA.iterations)} draws; none is graded.`);
w();
w(`THE PLAN AT THE MODES (not a draw): weather factor ${S(vk.plan.weatherFactor)}, demand factor ${S(vk.plan.demandFactor)}, ${f6(vk.plan.vesselDays)} vessel-days and ${S(vk.plan.vessels)} vessels (engine), the figures fleetSize returns for the same week (${ref('vessels')}).`);
must('the plan at the modes is fleetSize', vk.plan.vesselDays === ekF.vesselDays && vk.plan.vessels === ekF.vessels, 'plan');
w();
table(['statistic (seed ' + S(vkA.seed) + ', ' + S(vkA.iterations) + ' draws)', 'vessel-days (engine)', 'vessels required (engine)'], ['mean', 'p90', 'p50', 'p10', 'min', 'max'].map((k) => [k === 'p90' ? 'P90 (low)' : k === 'p10' ? 'P10 (high)' : k === 'p50' ? 'P50' : k, f6(vk.vesselDays[k]), f6(vk.vesselsRequired[k])]));
must('the percentile set is in exceedance order', vk.vesselDays.p90 <= vk.vesselDays.p50 && vk.vesselDays.p50 <= vk.vesselDays.p10, 'order');
w();
table(['whole vessels (engine)', 'share of the draws (engine)'], vk.vesselsDistribution.map((d) => [S(d.vessels), f6(d.probability)]));
w();
w(`THE CHANCE OF BEING SHORT with ${S(vk.plannedVessels)} planned vessels (capacity ${f6(vk.capacityDays)} vessel-days, engine): ${f6(vk.probabilityShort)} of the draws need more vessel-days than that (strictly above, at twelve digits), and the expected shortfall over all the draws is ${f6(vk.expectedShortVesselDays)} vessel-days (engine; seed ${S(vkA.seed)}, ${S(vkA.iterations)} draws).`);
w();
const vs7 = success('fleetVariability on ekene-variability-psv-milk-run with seed 7 (stated probe)', E.fleetVariability({ ...argsOf('ekene-variability-psv-milk-run'), seed: 7 }));
w(`ANOTHER SEED, ANOTHER ESTIMATE (stated probe: the same inputs on seed 7 and ${S(vkA.iterations)} draws): mean vessel-days ${f6(vs7.vesselDays.mean)}, P90 ${f6(vs7.vesselDays.p90)}, P10 ${f6(vs7.vesselDays.p10)}, probability short ${f6(vs7.probabilityShort)} (engine). The figures move with the seed, which is why a Monte Carlo figure is always quoted with its seed and its draws and no Monte Carlo figure is graded; the plan at the modes does not move (${f6(vs7.plan.vesselDays)} vessel-days).`);
must('another seed moves the estimates and leaves the plan', vs7.vesselDays.mean !== vk.vesselDays.mean && vs7.plan.vesselDays === vk.plan.vesselDays, 'seed');
w();
const vrow2 = (id) => { const r = runG(id); const a = argsOf(id); return [id, typeof a.weather.factor === 'number' ? S(a.weather.factor) : `${S(a.weather.factor.min)}, ${S(a.weather.factor.mode)}, ${S(a.weather.factor.max)}`, typeof a.demandFactor === 'number' ? S(a.demandFactor) : `${S(a.demandFactor.min)}, ${S(a.demandFactor.mode)}, ${S(a.demandFactor.max)}`, S(a.plannedVessels), `${S(a.seed)} / ${S(a.iterations)}`, f6(r.vesselDays.mean), f6(r.vesselDays.p90), f6(r.vesselDays.p10), f6(r.probabilityShort), f6(r.expectedShortVesselDays)]; };
w('MORE RUNS (golden inputs; every figure a seeded estimate on the seed and draws shown, none graded):');
w();
table(['golden input', 'weather factor', 'demand factor', 'planned vessels', 'seed / draws', 'mean vessel-days', 'P90 (low)', 'P10 (high)', 'probability short', 'expected short vessel-days'],
  ['variability-fixed-factors-equal-fleet-size', 'variability-one-iteration', 'variability-weather-only', 'variability-demand-only-fractional', 'variability-planned-zero', 'variability-at-capacity-is-not-short', 'variability-one-vessel-short-always', 'ekene-variability-ahts-dedicated'].map(vrow2));
const fx = runG('variability-fixed-factors-equal-fleet-size');
must('fixed factors give fleetSize every draw', fx.vesselDays.min === ekF.vesselDays && fx.vesselDays.max === ekF.vesselDays, 'fixed');
must('at capacity is not short; one vessel fewer is always short', runG('variability-at-capacity-is-not-short').probabilityShort === 0 && runG('variability-one-vessel-short-always').probabilityShort === 1, 'short');
w();
w('With both factors fixed every draw is the fleetSize week. A need exactly at the planned capacity is not short (strictly above counts); with one vessel fewer every draw is short.');

/* ============================================================ SECTION 24 */

section('readings', 'The readings the engine states, where each acts, and the alternative', ['Expert m05', 'Expert m06 l03']);
w('Where no source fixes a convention, the engine states one. Each reading below is the engine\'s, with a golden input on which it acts, the engine\'s answer there, and the alternative the course names. No capstone field is moved by any alternative (' + ref('graded') + ').');
w();
const vk90 = vk.vesselDays.p90;
const rd = [
  ['READING ONE: a load exactly at a capacity is feasible', 'voyage-at-capacity-feasible', `feasible ${S(bnd1.voyages[0].feasible)} at a deck area utilisation of ${f6(bnd1.voyages[0].binding.utilisation)}`, 'the load at capacity read as overloaded'],
  ['READING TWO: a binding tie goes to the first constraint in the order', 'voyage-binding-tie-goes-to-deck-area', `binding ${bnd3.voyages[0].binding.constraint}`, 'the tie given to the last of the tied constraints (deck load here, ' + ref('binding') + ')'],
  ['READING THREE: a count rounds up on its twelve-digit figure', 'fleet-decimal-ratio-2-1-over-0-7-is-three', `${S(r217.voyageSets[0].voyages)} voyages from ${S(r217.voyageSets[0].voyagesExact)}`, 'the ceiling of the raw double (derived: the ceiling of 3.0000000000000004 is 4)'],
  ['READING FOUR: the nearest whole vessel rounds a half up', 'fleet-vessels-nearest-half-rounds-up', `${S(vh.vessels)} vessels from ${f6(vh.vesselsExact)}`, 'halves rounded down (derived: 1.5 would give 1 vessel, and the week would be short)'],
  ['READING FIVE: demand equal to the minimum visits names the demand', 'fleet-min-visits-equal-demand-names-demand', `driven by ${mvE.voyageSets[0].drivenBy}`, 'the tie named as minimum visits'],
  ['READING SIX: first-fit decreasing puts the heavier of two equal footprints first', 'deck-ties-heavier-first-then-id', `order ${tie.packingOrder.join(', ')}`, 'the lighter first'],
  ['READING SEVEN: a unit that fills the deck exactly fits', 'deck-exact-fit-inclusive', `${S(exf.voyages[0].units.length)} units carried, ${S(exf.overflow.length)} overflow`, 'an exact fill read as overflow'],
  ['READING EIGHT: a berth target is met at or below it', 'base-target-met-exactly-by-current', `${S(tg[2][1].target.berths)} berth meets a target of ${S(tg[2][1].target.targetMeanWaitHours)} hours`, 'the target met only strictly below it'],
  ['READING NINE: short means strictly above the planned capacity', 'variability-at-capacity-is-not-short', `probability short ${f6(runG('variability-at-capacity-is-not-short').probabilityShort)}`, 'short at equality (derived: every draw equals the capacity here, so every draw would count)'],
  ['READING TEN: the P90 of a requirement is the low figure', 'ekene-variability-psv-milk-run', `P90 ${f6(vk90)} vessel-days, below the P10 ${f6(vk.vesselDays.p10)} (seed ${S(vkA.seed)}, ${S(vkA.iterations)} draws)`, 'P90 read at the high side'],
];
table(['reading', 'golden input', 'the engine returns', 'the alternative'], rd);
must('ten readings, each acting on its golden input', rd.length === 10 && bnd1.voyages[0].feasible && bnd3.voyages[0].binding.constraint === 'deck area' && r217.voyageSets[0].voyages === 3 && vh.vessels === 2 && mvE.voyageSets[0].drivenBy === 'deck area' && tie.packingOrder[0] === 'c' && exf.overflow.length === 0 && tg[2][1].target.berths === 1 && runG('variability-at-capacity-is-not-short').probabilityShort === 0 && vk90 < vk.vesselDays.p10, 'readings');
w();
w('THE CHOICES A CALL STATES are not readings: the activities the weather slows, the voyage and vessel rounding rules, the packing rule, the queue model and the concurrent choice are inputs, each required, and a capstone states each one it uses.');

/* ============================================================ SECTION 25 */

section('boundaries', 'Boundaries, rule by rule', ['Expert m05 l01', 'Expert m05 l02', 'Expert m05 l03']);
w('Each rule has its own boundary. None is global: some are inclusive, some strict, and some are read at twelve significant digits. Every row is the engine\'s answer on a golden input.');
w();
const wAbove = refusal('voyagePlan on voyage-refuse-weather-above-cap', E.voyagePlan(argsOf('voyage-refuse-weather-above-cap')), 'weather.factor');
const wBelow = refusal('voyagePlan on voyage-refuse-weather-below-one', E.voyagePlan(argsOf('voyage-refuse-weather-below-one')), 'weather.factor');
const uf0 = refusal('voyagePlan on voyage-refuse-usable-fraction-zero', E.voyagePlan(argsOf('voyage-refuse-usable-fraction-zero')), 'vessel.deckUsableFraction');
const avAbove = refusal('fleetSize on fleet-refuse-available-above-period', E.fleetSize(argsOf('fleet-refuse-available-above-period')), 'vesselAvailableDays');
const satX = refusal('shoreBase on base-refuse-saturated-exactly', E.shoreBase(argsOf('base-refuse-saturated-exactly')), 'arrivalsPerDay');
const drw = refusal('fleetVariability on variability-refuse-draws-cap', E.fleetVariability(argsOf('variability-refuse-draws-cap')), 'iterations');
const bndT = [
  ['capacity', 'load = capacity: feasible', 'one tonne over: overloaded', 'voyage-at-capacity-feasible, voyage-one-over-deck-load', bnd1.voyages[0].feasible && !bnd2.voyages[0].feasible],
  ['decimal sums', '0.1 + 0.2 fills 0.3: feasible', '', 'voyage-decimal-sum-at-capacity, deck-decimal-footprints-fill-exactly', bnd5.voyages[0].feasible && dff.overflow.length === 0],
  ['the binding tie', 'equal utilisations: deck area named', '', 'voyage-binding-tie-goes-to-deck-area', bnd3.voyages[0].binding.constraint === 'deck area'],
  ['voyages rounded up', 'exactly 3 is 3 (2.1 over 0.7 is 3)', '300.001 over 100 is 4', 'fleet-demand-exactly-three-voyages, fleet-decimal-ratio-2-1-over-0-7-is-three, fleet-demand-just-over-three-voyages', ex3.voyageSets[0].voyages === 3 && r217.voyageSets[0].voyages === 3 && ov3.voyageSets[0].voyages === 4],
  ['demand and minimum visits', 'equal: demand named', 'more visits: minimum visits named', 'fleet-min-visits-equal-demand-names-demand, fleet-min-visits-drive', mvE.voyageSets[0].drivenBy === 'deck area' && mv.voyageSets[0].drivenBy === 'minimum visits'],
  ['vessels to the nearest', '1.5 rounds to 2', '1.416667 rounds to 1, shortfall reported', 'fleet-vessels-nearest-half-rounds-up, fleet-vessels-nearest-short', vh.vessels === 2 && vn.vessels === 1 && vn.shortVesselDays > 0],
  ['vessels up', 'vessel-days of exactly two vessels: 2 vessels, utilisation 1', '', 'fleet-vessel-days-exactly-two-vessels', v2.vessels === 2 && v2.fleetUtilisation === 1],
  ['available days', 'equal to the period: accepted', 'above the period: refused', 'fleet-available-equals-period, fleet-refuse-available-above-period', !avE.error && !!avAbove.error],
  ['short in the Monte Carlo', 'need = planned capacity: not short', 'one vessel fewer: always short', 'variability-at-capacity-is-not-short, variability-one-vessel-short-always', runG('variability-at-capacity-is-not-short').probabilityShort === 0 && runG('variability-one-vessel-short-always').probabilityShort === 1],
  ['iterations times voyage sets', '181818 with 11 sets: accepted', '181819: refused', 'variability-refuse-draws-cap', !!drw.error],
  ['a deck fit', 'an exact fill: fits', 'heavier than the deck load: overflow', 'deck-exact-fit-inclusive, deck-item-heavier-than-deck-load', exf.overflow.length === 0 && hvy.overflow.length === 1],
  ['the steady state', 'utilisation 0.9995: accepted', 'utilisation 1: refused, printing 19.999999', 'base-just-below-saturation, base-refuse-saturated-exactly', jb.berthUtilisation < 1 && /19\.999999/.test(satX.error)],
  ['a printed bound', '26.666666 is printed (accepted)', '26.666667 would be refused', 'base-refuse-saturated-thirds', /26\.666666 \(rounded down/.test(sat[1][1])],
  ['the berth target', 'wait = target: met', 'target 0: unreachable, reported', 'base-target-met-exactly-by-current, base-target-zero-unreachable', tg[2][1].target.berths === 1 && tg[3][1].target.berths === null],
  ['the weather factor', '1: accepted', '0.9 and 10.5: refused', 'ekene-voyage-calm, voyage-refuse-weather-below-one, voyage-refuse-weather-above-cap', !ekC.error && !!wAbove.error && !!wBelow.error],
  ['the usable fraction', '1: accepted', '0 and 1.1: refused', 'skoko-2024-table1-psv-daily-fuel, voyage-refuse-usable-fraction-zero, voyage-refuse-usable-fraction-above-one', sk1A.vessel.deckUsableFraction === 1 && !!uf0.error],
];
table(['rule', 'at the boundary', 'one past it', 'golden inputs'], bndT.map((r) => r.slice(0, 4)));
bndT.forEach((r) => must(`boundary: ${r[0]}`, r[4], r[0]));
must('the draws cap row states the printed limit', /at most 181818 with 11 voyage sets/.test(drw.error), drw.error);
w();
w('A PRINTED BOUND ON THE ACCEPTED SIDE. When a refusal names the most a figure may be, the engine prints the six-decimal figure nearest the exact bound that its own rule accepts, and adds "(rounded down at the sixth decimal so that it is accepted)" when that figure differs from the exact bound: typing the printed figure back in passes. On base-refuse-saturated-thirds the exact bound is 26.666667 at six decimals and would be refused, so the engine prints 26.666666.');

/* ============================================================ SECTION 26 */

section('quirks', 'Reference texts and their quirks', ['Expert m02 l05', 'Expert m05 l04', 'Expert m06 l03']);
w(`A PRINTED FIGURE THAT MISSES ITS ROUNDING. Adan and Resing\'s Table 5.1 prints a mean wait of ${TEXT.ar51.rows[2][2]} at five servers (text); the formula the table is built from gives ${f6(r51[2].meanWaitHours)}, which rounds to ${two(r51[2].meanWaitHours)} (${ref('published')}, check one). Every other figure in Tables 5.1 and 5.2 is the engine\'s rounded. The course names the printed figure as a slip and quotes the engine\'s.`);
w();
w(`A TOTAL THE ROUNDED DAYS DO NOT REPRODUCE. Skoko et al. print the PSV\'s optimal fuel cost as USD ${TEXT.sk5.psvFuel}; the rounded days of their Table 5 give ${f6(psv.voyages[0].fuelCost)} through the engine (${ref('published')}, check six). The course uses the AHTS row, which reproduces exactly, and leaves the PSV total out.`);
w();
w('A HANDBOOK IN DRAFT. Iversen\'s Teletraffic Engineering Handbook was read in its ITU-D draft of 20 June 2001; its Example 12.3.1 is in seconds, and the golden inputs read the second as the working hour, which changes no figure because every time in the call is read in the same unit.');
w();
w('A LIVING PAGE. The Wikipedia article on first-fit decreasing changes over time, so the course cites revision 1317275412 of 17 October 2025 and the examples as that revision prints them. Johnson\'s 1973 thesis and Dosa\'s 2007 paper were not read directly; the rule and the examples are taken as the article states them, with its citations.');
w();
w('AN APPROXIMATION READ AT SECOND HAND. Cosmetatos (1975) was not read directly; the formula is taken as Liu, Pantelidis, Tam and Chow print it (arXiv 2102.05851v2, eq. 2, CC BY 4.0), and the engine labels it an approximation.');
w();
w(`A USABLE SHARE STATED TWO WAYS. Skoko et al. use ${TEXT.sk1.usable} of a vessel\'s carrying capacity as usable (text, beside Table 4); the Ekene fixture states a usable deck fraction of ${S(FX.vessels.psv.deckUsableFraction)}. Neither is a default: the usable fraction is a required input on every call.`);
w();
w('AN ACCEPTED MANUSCRIPT. Aas, Halskau and Wallace (2009) was read as the accepted manuscript on Lancaster EPrints, cited with the journal\'s volume and pages; the course teaches its ideas by concept and quotes none of its prose.');

/* ============================================================ SECTION 27 */

section('notcomputed', 'What the engine does not compute, and which course owns it', ['Expert m06 l01']);
w('The engine takes these as stated inputs, or leaves them out; where another course of the academy owns the subject the lessons name it in one sentence and do not re-teach it:');
w();
table(['not computed here', 'what the engine takes instead', 'where it belongs'], [
  ['a schedule by the clock: departure times, night holding, a sailing plan by day', 'counts of voyages and vessel-days over a stated period', 'none: a planner\'s schedule'],
  ['weather windows, wave heights and waiting on weather', 'one stated factor on the stated activities', 'none: always a stated input'],
  ['a speed and fuel curve', 'a stated burn rate for each activity at the stated speed', 'none: always a stated input'],
  ['vessel hire, port fees and a contract for the vessel', 'a stated fuel price only', 'procurement (Procurement, Tendering & Contracting)'],
  ['stacking, deck shape, lanes and stability', 'an area bound with a stated usable fraction and deck load', 'none: the deck foreman\'s plan'],
  ['a stowage factor for bulk', 'the user\'s net deadweight and stated densities', 'none: always a stated input'],
  ['berth-specific cranes, shifts and priorities', 'one queue on the working-hour clock', 'none'],
  ['the optimum deck packing', 'a stated rule (first-fit decreasing or first fit) and the area lower bound', 'none'],
  ['stock levels, spares and reorder points', 'stated cargo and demand', 'materials (Materials, Spares & Inventory Management)'],
  ['supplier performance and contract management', 'none', 'contracts (Contract & Supplier Management)'],
  ['distributions, correlation and Monte Carlo as a subject', 'the canonical seeded sampler of lib/stats, applied to the fleet', 'uncertainty'],
  ['discounting, NPV and a cash flow', 'none: the engine discounts nothing', 'cashflow (Petroleum Economics and Cash Flow)'],
]);

/* ============================================================ SECTION 28 */

section('sizecaps', 'Size caps and refusals at scale', ['Expert m06 l02']);
const insts = (n) => Array.from({ length: n }, (_, i) => ({ id: `I${i}`, fieldHours: 1, cargo: { deckAreaM2: 0, deckWeightT: 0 } }));
const capBase = argsOf('voyage-at-capacity-feasible');
const prods = (n) => Array.from({ length: n }, (_, i) => ({ id: `p${i}`, kind: 'liquid', densityTPerM3: 1 }));
const deckBase = argsOf('deck-exact-fit-inclusive');
const CAPR = [
  ['MAX_INSTALLATIONS', `voyagePlan with ${D.MAX_INSTALLATIONS + 1} dedicated installations (stated probe)`, E.voyagePlan({ ...capBase, installations: insts(D.MAX_INSTALLATIONS + 1).map((x) => ({ ...x, distanceFromBaseNm: 10 })) }), 'installations'],
  ['MAX_PRODUCTS', `voyagePlan with ${D.MAX_PRODUCTS + 1} products (stated probe)`, E.voyagePlan({ ...capBase, products: prods(D.MAX_PRODUCTS + 1), vessel: { ...capBase.vessel, tanks: Object.fromEntries(prods(D.MAX_PRODUCTS + 1).map((p) => [p.id, 1])) } }), 'products'],
  ['MAX_ITEM_LINES', `deckPlan with ${D.MAX_ITEM_LINES + 1} item lines (stated probe)`, E.deckPlan({ ...deckBase, items: Array.from({ length: D.MAX_ITEM_LINES + 1 }, (_, i) => ({ id: `i${i}`, lengthM: 1, widthM: 1, weightT: 0, quantity: 1 })) }), 'items'],
  ['MAX_UNITS', 'deckPlan with 2001 units (golden input deck-refuse-units-cap)', E.deckPlan(argsOf('deck-refuse-units-cap')), 'items'],
  ['MAX_QUANTITY', `deckPlan with a quantity of ${D.MAX_QUANTITY + 1} (stated probe)`, E.deckPlan({ ...deckBase, items: [{ id: 'q', lengthM: 1, widthM: 1, weightT: 0, quantity: D.MAX_QUANTITY + 1 }] }), 'items[0].quantity'],
  ['MAX_DECK_VOYAGES', `deckPlan with ${D.MAX_DECK_VOYAGES + 1} voyages (stated probe)`, E.deckPlan({ ...deckBase, voyages: D.MAX_DECK_VOYAGES + 1 }), 'voyages'],
  ['MAX_BERTHS', 'shoreBase with 101 berths (golden input base-refuse-berths-cap)', E.shoreBase(argsOf('base-refuse-berths-cap')), 'berths'],
  ['MAX_WEATHER_FACTOR', 'voyagePlan with a weather factor of 10.5 (golden input voyage-refuse-weather-above-cap)', wAbove, 'weather.factor'],
  ['MAX_ITERATIONS', 'fleetVariability with 200001 draws (golden input variability-refuse-iterations-cap)', E.fleetVariability(argsOf('variability-refuse-iterations-cap')), 'iterations'],
  ['MAX_DRAWS', 'fleetVariability with 181819 draws and 11 voyage sets (golden input variability-refuse-draws-cap)', drw, 'iterations'],
];
table(['cap', 'value', 'call over the cap', 'the engine\'s message, verbatim'], CAPR.map(([k, what, r, field]) => { refusal(`cap ${k}: ${what}`, r, field); return [`\`${k}\``, S(D[k]), what, r.error]; }));
w();
w(`THE DRAWS CAP. Iterations times voyage sets may not exceed ${S(D.MAX_DRAWS)}, because every draw sizes every voyage set; the refusal names the most draws the stated sets allow. A panel stays well inside these caps.`);

/* ============================================================ SECTION 29 */

section('choices', 'Conventions that are choices, and the logistics plan', ['Expert m06 l03']);
w('CONVENTIONS THAT ARE CHOICES. Each is the engine\'s stated choice, or a choice the call must state; a different choice would move a figure, so each is named in any plan that quotes the figure:');
w();
table(['convention', 'the choice', 'where it comes from'], [
  ['sailing time', 'the NM over the stated speed; no speed-fuel curve', 'Skoko et al. (2024), Table 4'],
  ['weather', 'one stated factor on the stated activities; fuel follows time', 'a stated input'],
  ['fuel', 'hours by activity times the stated burn; tonnes times the stated price', 'Skoko et al. (2024), Tables 1 and 7'],
  ['capacity', 'deck area times the usable fraction, deck load, deadweight with the stated densities, one tank per product', 'Aas, Halskau and Wallace (2009), by concept'],
  ['ties and checks', 'twelve significant digits; capacity inclusive; a binding tie to the first constraint', 'engine convention (' + ref('readings') + ')'],
  ['voyages', 'the largest demand ratio and the minimum visits, rounded as stated', 'a stated rule'],
  ['vessels', 'vessel-days over the available days, rounded as stated (nearest halves up)', 'a stated rule'],
  ['the deck plan', 'first-fit decreasing by area (heavier first on a tie) or first fit; an area bound with no stacking', 'Johnson (1973), as the Wikipedia article states it'],
  ['the queue clock', 'the working hour', 'engine convention'],
  ['the queue model', 'M/M/c by Erlang C, or M/D/c by the Cosmetatos approximation', 'Adan and Resing (2015); Liu et al. (2021), eq. (2)'],
  ['the berth target', 'the fewest berths with a mean wait at or below the target', 'engine convention'],
  ['the Monte Carlo', 'weather then demand, each drawn only when it varies; P90 the low figure; short strictly above', 'lib/stats and lib/conventions/percentile.js'],
  ['money and figures in a reason', 'money to the cent and a computed quantity to six decimals, half away from zero, trailing zeros dropped; every numeric field keeps full precision', 'engine convention'],
]);
w();
w('WRITING THE LOGISTICS PLAN names: the cluster and each installation (synthetic in this course) with its distance or legs, field hours, cargo or demand and minimum visits; every source applied with its edition, licence and the date read; the vessel with every capacity, tank and burn; the products and densities; the route; the port hours; the weather factor and the activities it slows; the fuel price; each voyage\'s hours, days, fuel, binding constraint and any overload; the period, the available days, both rounding rules, the voyages and what drives them, the vessel-days, the vessels and the spare or short vessel-days; the deck plan with its rule, the voyages, the lower bound and every overflow unit; the base with its berths, arrivals, working day, service terms, model and any target; each Monte Carlo figure with its seed and draws; and each reading the figures rest on.');

/* ============================================================ SECTION 30 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Seven terms in this course carry a narrower meaning than they have in conversation. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['term', 'what it can mean elsewhere', 'the rule here'], [
  ['voyage', 'any trip', 'one sailing from the base and back: a milk run is one voyage through every stop; a dedicated voyage serves one installation'],
  ['capacity', 'size in general', 'always of a named constraint: deck area times the usable fraction, deck load, deadweight, or a named tank'],
  ['binding', 'legally required', 'the constraint with the highest utilisation, by the stated tie rule'],
  ['vessel-days', 'vessels times days', 'the voyages times the voyage days a set needs, added over the sets; the capacity in vessel-days is the vessels times the available days'],
  ['utilisation', 'use in general', 'always of a named thing: a constraint, a deck, the fleet or a berth'],
  ['wait', 'any delay', 'the mean wait in the queue on the working-hour clock; the time at the base adds the service time'],
  ['P90', 'the 90th percentile of anything', 'for a requirement or a cost, the LOW figure: met or exceeded in 90 percent of the draws; always quoted with its seed and draws'],
]);
w();
w('A FIGURE THAT DEPENDS ON AN INPUT is quoted with it: a voyage\'s hours with its route, speed and weather; a fuel cost with its burns and price; a utilisation with its capacity; a voyage count with its rounding rule; a vessel count with its available days and rounding rule; a deck plan with its rule and voyages; a queue figure with its model, berths, arrivals, working day and service; a Monte Carlo figure with its seed and draws.');

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', process.env.SC4_DUMP_PARTIAL || unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', process.env.SC4_DUMP_PARTIAL || SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)));
must('no em or en dash reaches the digest', !OUT.some((l) => /[–—]/.test(l)), OUT.find((l) => /[–—]/.test(l)));
must('no contrastive the copy rule bans reaches the digest outside an engine quotation', !OUT.some((l) => !l.startsWith('> ') && !l.startsWith('| ') && /,\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band not\b|\band never\b/i.test(l)), OUT.find((l) => !l.startsWith('> ') && !l.startsWith('| ') && /,\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band not\b|\band never\b/i.test(l)));
must('the negative control list names the plants the discriminate sweep reuses', /weather factor on every activity/.test(NEGCONTROL) && /Erlang B recursion one step too far/.test(NEGCONTROL), 'negcontrol');

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`marine_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.SC4_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`marine_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
