// THE EC11 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S VALIDATION FILES ARE NOT TEACHING TRUTH. The oracle, the golden
// file's expected figures, the fixture README, the negative control, the
// engine's own source comments and the draft validation record are
// PROVENANCE. Where they state a figure this file recomputes it through the
// engine on the vendored golden INPUTS, on the fixture, or on stated inputs,
// and prints it.
//
// Usage:  sh /root/cat-wip-prms/build_digest.sh > digest.tmp && mv digest.tmp digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE
// (engines/economics/prms.js and the canonical functions it imports:
// computeCashFlow and applyJV from cashflow.ts; mulberry32,
// createCorrelatedSampler, cholesky, fitTriangularToPercentiles, triInvCDF,
// normalCDF, quantile and mean from lib/stats/stats.js; the outcome labels and
// the exceedance sentence from lib/conventions/percentile.js), except where a
// line says "stated" (an input typed in this file and printed beside the call
// it went into), "golden input" (an input read from the vendored
// test-data/economics/goldens/prms_cases.json, whose inputs are the Ekene
// synthetic fixture, stated probes and the published checks), "fixture" (read
// from the vendored ekene-prms file), "text" (a figure printed by a public or
// licensed text, cited with its section; the licensed texts' figures are
// checked against the texts by quote_check.py and their prose is never
// quoted) or "derived" (arithmetic on engine values printed in the same block,
// with the arithmetic stated). Nothing here reads a clock, a random number, a
// locale or a network; TZ and LC_ALL are pinned by build_digest.sh. The one
// Monte Carlo the engine runs (aggregate) is seeded by a stated seed, so its
// figures reproduce, and every one of them is printed with its seed and its
// draw count.
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
// THE DIGEST IS NOT THE CAPSTONE. This file never reads prms_capstone.mjs,
// fields.json or the capstone cases, and the capstone never reads this.
//
// NO PRMS PROSE. SPE-PRMS 2018 is licensed CC BY-NC-ND 4.0 and this course is
// sold; the PRMS FAQs and the 2011 Application Guidelines are copyright. This
// file cites their sections and prints their figures, and writes every
// explanation in its own words; gate_no_prms_prose.py refuses any eight-word
// run of their text in the digest.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.EC11_WAVE_DIR || '/root/cat-wip-prms';
const { P: E, PCT, ROOT, ENGINE_REL } = await import(`${HERE}/prms_engine.mjs`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/prms_cases.json`, 'utf8'));
const FX = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/ekene-prms/ekene-prms.json`, 'utf8'));
const FXREADME = fs.readFileSync(`${ROOT}/test-data/economics/ekene-prms/README.md`, 'utf8');
const NEGCONTROL = fs.readFileSync(`${ROOT}/tools/validation/economics/negcontrol_prms.sh`, 'utf8');
const CONCEPTS = JSON.parse(fs.readFileSync(process.env.EC11_CONCEPTS || `${HERE}/concepts.json`, 'utf8'));
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
  const t = s === '-0.000000' ? '0.000000' : s;
  return t.replace(/^-/, '').replace('.', '').replace(/^0+/, '').length > 15 ? group(t) : t;
};
const S = (x) => String(x);
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
const ORDER = ['computes', 'sources', 'provisions', 'published', 'dataset', 'refusals', 'graded',
  'framework', 'prospective', 'commercial', 'categories', 'probability', 'nigeria',
  'subclasses', 'criteria', 'incremental', 'economiclimit', 'entitlement', 'licence',
  'arithmetic', 'probabilistic', 'risked', 'reconciliation', 'tworules', 'readings', 'quirks', 'boundaries', 'notcomputed', 'sizecaps', 'choices',
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
  return success(`${c.fn} on the golden input ${id}`, E[c.fn](clone(c.args)));
};
const argsOf = (id) => clone(GC[id].args);
const D = E.DEFAULTS;
const PF = E.PRMS_FIGURES;
const { OUTCOME_LABELS, EXCEEDANCE_DEFINITION } = PCT;
const EXPORTS = [
  ['classify', 'the class and sub-class of one project', 'name (optional), discovery, recoveryProject, subClass, commerciality, economicStatus, projectStatus, reservesStatus, chances, nigeria (optional)', 'the class, the sub-class, the economic and reserves status, the chances and the chance of commerciality, each commerciality criterion met or not, the blockers, the category labels, the Nigerian notes and each decision with the section it applies'],
  ['categorize', 'the categories of one set of estimates', 'resourceClass, method, estimates, unit', 'the cumulative categories with their outcome labels, the incremental categories, the exceedance sentence and whether one value describes the range'],
  ['economicLimit', 'the economic limit and the entitlement of three technical forecasts', 'effectiveYear, forecasts, prices, costs, royalty, tax, workingInterestPct, licence, reportingBasis, discountRatePct, mscfPerBoe', 'per case the forecast years, the licence cut, the economic limit year and the trailing years cut, the undiscounted net cash flow and NPV at 100 percent and at the working interest, the technical, beyond-licence, beyond-limit, economic and reported quantities; the Reserves categories and increments or none; the status'],
  ['aggregate', 'the total of several projects of one class', 'resourceClass, level, unit, projects, correlation, seed, iterations', 'each project\'s low, best, high and mean, the arithmetic sums by category, the seeded Monte Carlo low, best, high and mean, the sum of the means, the portfolio effect, the risked mean for a risked class and what may be reported at the stated level'],
  ['reconcile', 'the reconciliation of a category set from one date to the next', 'resourceClass, unit, periodYears, opening, movements, closing, tolerance', 'each movement and the sum by type, the computed closing, the difference from the stated closing, whether it closes, the order and sign checks, the incremental form, and with production the replacement ratio and the life index'],
];

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# EC11 TEACHING DIGEST: Reserves & Resources under SPE-PRMS 2018');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The oracle, the golden file\'s expected figures, the fixture README, the negative control and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every quantity, volume, barrel, BOE, Mscf, amount of money, cash flow, NPV, percentage, chance, probability, correlation, ratio and index prints to SIX decimals; years, year counts, project counts, draws, seeds and whole inputs print as whole numbers; a figure of sixteen or more significant digits at six decimals prints with its thousands grouped by commas; an engine message, reason and basis is printed verbatim, figures and all. Inside a message the engine prints money rounded to the cent (half away from zero, trailing zeros dropped), a computed quantity or percentage to six decimals (trailing zeros dropped), and a stated input as it was given.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines bb8ef5f (engines PR #278), ${engineLines} lines, at its canonical path in the NextGen repository. It imports computeCashFlow and applyJV from engines/economics/cashflow.ts, mulberry32, createCorrelatedSampler, cholesky, fitTriangularToPercentiles, triInvCDF, normalCDF, quantile and mean from lib/stats/stats.js, and OUTCOME_LABELS, EXCEEDANCE_DEFINITION and outcomeOrderViolation from lib/conventions/percentile.js, and nothing else. It makes no network call.`);
w();
w('# AN ENGINE COURSE. There is no Suite app for this course. Every practical runs in the course\'s own calculator panels, which call this same vendored engine on the learner\'s own inputs.');
w();
w('# THE DATA. Every Ekene project, forecast, price, cost, chance, distribution, estimate and movement is SYNTHETIC, written for this platform by a stated script. No real company, field, licence, reserves figure or regulator decision appears; the one national figure the course prints is the Commission\'s published total, cited with its date.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone case and no graded answer. The capstones run their own fields and the digest never names them.');
w();
w(`# NO PRMS PROSE. SPE-PRMS 2018 is licensed CC BY-NC-ND 4.0 and this course is sold, so the course cites its sections and teaches its ideas in its own words and never quotes it; the PRMS FAQs and the 2011 Application Guidelines are used the same way. Only public texts are quoted (${ref('provisions')}).`);
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries `reasons` (the working, in order) and a `basis` block naming the rules it applied and where they come from, so the working can be printed.');
w();
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof E[name] === 'function', typeof E[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(E).filter((k) => typeof E[k] === 'function').length === EXPORTS.length, Object.keys(E).filter((k) => typeof E[k] === 'function').join(','));
w();
w('The stated constants, read from the exported `DEFAULTS` and `PRMS_FIGURES`:');
w();
const DSRC = {
  MAX_YEARS: 'the most forecast years one economic-limit call accepts',
  MAX_PROJECTS: 'the most projects one aggregation accepts',
  MAX_ITERATIONS: 'the most Monte Carlo draws one aggregation accepts',
  MAX_DRAW_WORK: 'the most draws times projects one aggregation accepts',
  MAX_MOVEMENTS: 'the most movements one reconciliation accepts',
  PSD_TOLERANCE: 'how far the Cholesky factor may miss a stated correlation matrix before the matrix is refused',
};
const PSRC = {
  reasonableTimeFrameYears: ['the benchmark time-frame for development to start, in years', 'PRMS 2.1.2.3 and 2.1.3.6.4 (a recommended benchmark)'],
  significantDiscoveryRetentionMaxYears: ['the most years a significant discovery area may be retained from its declaration', 'PIA 2021 s.78(9)'],
  retentionMinOnshoreShallowYears: ['the fewest years a retention approval runs onshore and in shallow water', 'S.I. No. 37 of 2023 reg. 6(3)'],
  retentionMinDeepWaterYears: ['the fewest years a retention approval runs in deep water', 'S.I. No. 37 of 2023 reg. 6(3)'],
  fieldDevelopmentPlanYears: ['the years within which a field development plan follows a commercial discovery declaration', 'PIA 2021 s.79(1)'],
};
table(['constant', 'value', 'what it sets', 'where it comes from'], [
  ...Object.entries(D).map(([k, v]) => [`\`DEFAULTS.${k}\``, k === 'PSD_TOLERANCE' ? '1e-9' : S(v), DSRC[k], k === 'PSD_TOLERANCE' ? 'engine convention' : 'cap']),
  ...Object.entries(PF).map(([k, v]) => [`\`PRMS_FIGURES.${k}\``, S(v), PSRC[k][0], PSRC[k][1]]),
]);
must('DEFAULTS carries six values, each described here', Object.keys(D).length === 6 && Object.keys(D).every((k) => DSRC[k]), Object.keys(D));
must('the PSD tolerance prints as 1e-9 because it is 1e-9', D.PSD_TOLERANCE === 1e-9, D.PSD_TOLERANCE);
must('PRMS_FIGURES carries five values, each described and cited here', Object.keys(PF).length === 5 && Object.keys(PF).every((k) => PSRC[k]), Object.keys(PF));
must('DEFAULTS and PRMS_FIGURES are frozen', Object.isFrozen(D) && Object.isFrozen(PF), 'frozen');
must('PRMS_FIGURES carries the figures read from the texts', PF.reasonableTimeFrameYears === 5 && PF.significantDiscoveryRetentionMaxYears === 10 && PF.retentionMinOnshoreShallowYears === 5 && PF.retentionMinDeepWaterYears === 8 && PF.fieldDevelopmentPlanYears === 2, JSON.stringify(PF));
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports and its source:');
const IMPORTS = [...ENGINE_SRC.matchAll(/^import [\s\S]*? from '([^']+)';$/gm)].map((m) => m[1]);
must('the engine imports exactly cashflow.ts, lib/stats and lib/conventions/percentile.js', IMPORTS.join() === './cashflow.ts,../../lib/stats/stats.js,../../lib/conventions/percentile.js', IMPORTS.join());
must('the engine source makes no network call, reads no clock and draws no random number of its own', !/\bfetch\x28|XMLHttpRequest|\bimport\x28|require\x28|Math\.random|Date\.now|new Date\x28\x29/.test(ENGINE_SRC), 'none');
w('- Its three imports are engines/economics/cashflow.ts (computeCashFlow for the economic limit, the cash flow and the NPV; applyJV for the working-interest and royalty scaling), lib/stats/stats.js (the canonical seeded Monte Carlo: mulberry32, createCorrelatedSampler, cholesky, the triangular fit and inverse, normalCDF, quantile and mean) and lib/conventions/percentile.js (the P90, P50 and P10 labels and the exceedance sentence). It carries no cash flow, NPV, discounting, sampler or percentile code of its own. The one function that samples is aggregate, on the stated seed.');
w(`- It decides nothing an input or a text does not state. Every discovery status, recovery project, commerciality criterion, economic status, project status, sub-class, reserves status, chance, estimate, forecast, price, cost, royalty and its form, tax rate, allowance life, loss relief choice, working interest, licence expiry and renewal expectation, reporting basis, discount rate, BOE factor, distribution, correlation, seed, draw count, movement and tolerance is an input with no default, and a call without one is refused by name (${ref('refusals')}). The only figures it holds are the five in \`PRMS_FIGURES\`, each cited above, and its caps.`);
must('ACCEPTED_KEYS carries one shape for every exported function', Object.keys(E.ACCEPTED_KEYS).sort().join() === EXPORTS.map((x) => x[0]).sort().join() && Object.isFrozen(E.ACCEPTED_KEYS), Object.keys(E.ACCEPTED_KEYS).join());
w(`- It reads no key it does not know. \`ACCEPTED_KEYS\` is exported with one shape for each of the ${EXPORTS.length} functions, and every call refuses an input key the function does not read, at every level, naming the key, its path and the accepted keys. A misspelt optional key is refused; it is never dropped silently.`);
w(`- It builds no production forecast, no in-place volume and no distribution from data, sets no price deck, computes no fiscal regime beyond a stated royalty and tax, and writes no reserves report. ${refCap('notcomputed')} lists each with the course that owns it.`);
w(`- Its exported names are, in full: ${Object.keys(E).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('sources', 'The sources, their editions and licences, and the date each was read', ['Associate m01 l02', 'Associate m06', 'Expert m06 l02']);
w('THE RULE THIS COURSE FOLLOWS FOR EVERY STANDARD, LAW, REGULATION, GUIDE AND RELEASE IT USES. Each one is named with its edition or gazette date, its licence and the date it was read. Only publicly available texts are quoted, with their citation. A licensed or copyright text is taught by concept with its section numbers, and its printed figures are cited as figures; none of its prose is quoted. Every legal figure the engine applies was read from the cited text and is cited to its section or regulation; every other figure is a required input with no default. Every text below was read on 2026-09-27.');
w();
const SOURCES = [
  ['SPE-PRMS 2018, Petroleum Resources Management System (SPE, WPC, AAPG, SPEE, SEG, SPWLA, EAGE)', 'June 2018; the English text read from the SPE-hosted English-Chinese edition (Version 2023 V1.0, developed from PRMS 2018 V1.0, uploaded February 2024)', 'CC BY-NC-ND 4.0, as the SPE download page states', 'the classes, sub-classes, categories, the commerciality criteria, the economic limit, entitlement, aggregation and reconciliation, by section number', 'CITED BY SECTION, NEVER QUOTED: the licence is non-commercial and no-derivatives, and this course is sold'],
  ['PRMS errata 2019 to 2022 (versions 1.01 to 1.03), consolidated', 'May 2022', 'as SPE-PRMS 2018', 'checked: no change to the sections the engine applies', 'cited, never quoted'],
  ['SPE Oil and Gas Reserves Committee, PRMS Frequently Asked Questions', 'November 2022 (answers dated October 2022)', 'copyright SPE, all rights reserved', 'FAQ 3.3 and 3.4 (1P = 0 when the low case fails, with its example figures), 4.3 and 4.4 (the economic limit and the contract term), 6.9 (classes kept apart)', 'NUMBERS AND ANSWER NUMBERS ONLY: never quoted'],
  ['Guidelines for Application of the PRMS', 'November 2011 (superseded by the 2022 edition, which is sold and was not used)', 'no licence printed; treated as copyright', '6.3 and Table 6.2 (arithmetic and probabilistic addition of two gas blocks, with its printed figures), 6.4 (risked volumes)', 'NUMBERS AND SECTION NUMBERS ONLY: never quoted'],
  ['17 CFR 229.1202 and 229.1203 (Regulation S-K Items 1202 and 1203)', 'the eCFR version current at 2026-09-01', 'US federal text, public domain', '1202(a)(3), arithmetic sums above the field or property level; 1203(d), proved undeveloped reserves left undeveloped for five years or more', 'quoted, with citation'],
  ['17 CFR 210.4-10 (Regulation S-X Rule 4-10)', 'the eCFR version current at 2026-09-01', 'US federal text, public domain', '(a)(22) proved reserves and the expiry of the right to operate; (a)(24) the 90 percent probability', 'quoted, with citation'],
  ['Petroleum Industry Act 2021 (Act No. 6)', 'Official Gazette No. 142, Vol. 108, 27 August 2021', 'Nigerian federal law', 's.7(i), the Commission\'s evaluation of national reserves; s.78(8), (9), (13) and (15), the declarations after an appraisal and retention; s.79(1), the field development plan; s.318, the definitions', 'quoted, with citation'],
  ['Significant Crude Oil and Gas Discovery Regulations, 2023', 'S.I. No. 37 of 2023, Official Gazette No. 111, Vol. 110, 20 June 2023 (made 24 May 2023)', 'Nigerian subsidiary legislation', 'regs 3 and 4, the two kinds of significant discovery; reg. 5(1), the declaration; reg. 6(2) and (3), the approval and the minimum retention periods; reg. 7(1)(b), (2) and (3), a declaration that does not meet the criteria', 'quoted, with citation'],
  ['Nigerian Upstream Petroleum (Commercial) Regulations, 2025', 'S.I. No. 7 of 2025, Official Gazette No. 84, Vol. 112, 5 May 2025', 'Nigerian subsidiary legislation', 'reg. 6, a status report that includes a statement of the reserves situation', 'by concept only'],
  ['NUPRC media release on the national annual petroleum reserves position as at 1 January 2026', '1 April 2026', 'a government release; its page reads all rights reserved', 'the 2P associated and non-associated gas figures and their total, and the reserves life indices', 'FIGURES ONLY, cited with the date: never quoted'],
];
table(['text', 'edition or date', 'licence', 'what the course reads from it', 'how the course uses it', 'date read'], SOURCES.map((r) => [...r, '2026-09-27']));
w();
w('NOT FOUND, and said plainly. No gazetted NUPRC regulation or guideline on how reserves are booked or reported was found on the Commission\'s list of gazetted regulations read on 2026-09-27. The Nigerian content of this course is therefore the Act, S.I. No. 37 of 2023, the concept of the Commercial Regulations\' status report, and the Commission\'s published national figures; the course states no Nigerian booking rule, because none was read.');
w();
w('THE PAID 2022 GUIDELINES. The Guidelines for Application of the PRMS were revised in 2022; that edition is sold and was not read. The course cites the 2011 edition and names it so.');
w();
w('The engine carries its citations in its own words. The `basis` of one call of each function, verbatim:');
w();
const bC = runG('class-ekn-1').basis;
const bG = runG('cat-reserves-cumulative').basis;
const bL = runG('econ-ekene').basis;
const bA = runG('agg-ekene-reserves').basis;
const bR = runG('rec-ekene').basis;
table(['call', 'basis key', 'the engine\'s basis, verbatim'], [
  ['classify (class-ekn-1)', 'classification', bC.classification], ['classify (class-ekn-1)', 'categories', bC.categories], ['classify (class-ekn-1)', 'nigeria', bC.nigeria],
  ['categorize (cat-reserves-cumulative)', 'categories', bG.categories], ['categorize (cat-reserves-cumulative)', 'labels', bG.labels],
  ['economicLimit (econ-ekene)', 'economicLimit', bL.economicLimit], ['economicLimit (econ-ekene)', 'economicTest', bL.economicTest], ['economicLimit (econ-ekene)', 'entitlement', bL.entitlement], ['economicLimit (econ-ekene)', 'licence', bL.licence],
  ['aggregate (agg-ekene-reserves)', 'aggregation', bA.aggregation], ['aggregate (agg-ekene-reserves)', 'monteCarlo', bA.monteCarlo], ['aggregate (agg-ekene-reserves)', 'labels', bA.labels],
  ['reconcile (rec-ekene)', 'reconciliation', bR.reconciliation], ['reconcile (rec-ekene)', 'sections', bR.sections],
]);
must('every basis the table prints is a non-empty string', [bC.classification, bC.categories, bC.nigeria, bG.categories, bG.labels, bL.economicLimit, bL.economicTest, bL.entitlement, bL.licence, bA.aggregation, bA.monteCarlo, bA.labels, bR.reconciliation, bR.sections].every((s) => typeof s === 'string' && s.length > 10), 'basis');
w();
w('LICENSED TEXTS IN THE ENGINE\'S OWN WORDS. The basis lines cite SPE-PRMS 2018 by section with its licence, and the FAQ and the 2011 Guidelines by answer and section number; none of them quotes the texts\' prose. A lesson that needs one of their ideas teaches it from the section number, the engine\'s stated arithmetic and the course\'s own words.');

/* ============================================================ SECTION 3 */

section('provisions', 'The provisions this course quotes, verbatim, with their citations', ['Associate m06', 'Professional m06 l01', 'Expert m01 l03']);
w(`Each provision below is quoted exactly from a public text named in ${ref('sources')}, with whitespace collapsed; a dash the text prints is shown as a colon. Each is preceded by the course's plain paraphrase. A figure, a spelling or a space before a semicolon the text prints is quoted as printed. A gazette prints marginal notes beside its sections, and a quotation stops where a marginal note would break it.`);
const GROUPS = [['PIA', 'THE PETROLEUM INDUSTRY ACT 2021'], ['SI37', 'THE SIGNIFICANT CRUDE OIL AND GAS DISCOVERY REGULATIONS, 2023 (S.I. NO. 37 OF 2023)'], ['SEC', 'THE US CODE OF FEDERAL REGULATIONS, TITLE 17 (PUBLIC DOMAIN)']];
GROUPS.forEach(([t, title]) => {
  w();
  w(`${title}:`);
  CONCEPTS.filter((c) => c.text === t).forEach((c) => { w(); cq(c.id); });
});
must('every concept belongs to one printed group', CONCEPTS.every((c) => GROUPS.some(([t]) => t === c.text)), 'groups');
w();
w(`${CONCEPTS.length} provisions quoted: ${list(GROUPS.map(([t]) => `${t} ${CONCEPTS.filter((c) => c.text === t).length}`))}. SPE-PRMS 2018, the FAQs, the 2011 Guidelines and the NUPRC release are not in this list: none of them is quoted.`);

/* ============================================================ SECTION 4 */

section('published', 'The published checks the engine reproduces', ['Associate m06 l03', 'Professional m04 l05', 'Expert m01 l03', 'Expert m02 l02', 'Expert m03 l04']);
w('Four printed figures from the texts are run through the engine. The figures are cited as the texts print them (text); every other number is the engine\'s. quote_check.py checks that each text prints each figure cited here.');
w();
// THE FAQ 3.3 EXAMPLE
const fq = runG('econ-faq33-low-fails');
const fqc = runG('cat-faq33-incremental');
w('CHECK ONE: THE FAQ 3.3 EXAMPLE (text: a technical low outcome of 5 and a best estimate of 7, the best being 5 + 2). The FAQ answer (numbers only, never quoted) takes the low case failing the economic test while the best passes. The golden input econ-faq33-low-fails states a one-year project: low 5000000, best 7000000 and high 9000000 barrels, an oil price of 10, capital of 60000000, no royalty, tax or opex, and the licence in the same year (stated). The engine returns (golden input):');
w();
table(['case', 'undiscounted net cash flow at 100%', 'economic', 'reported oil'], ['low', 'best', 'high'].map((k) => [k, f6(fq.cases[k].undiscountedNetCashFlow), S(fq.cases[k].economic), f6(fq.cases[k].reported.oil)]));
w();
table(['category', 'oil'], [['1P', f6(fq.reserves.cumulative['1P'].oil)], ['2P', f6(fq.reserves.cumulative['2P'].oil)], ['3P', f6(fq.reserves.cumulative['3P'].oil)], ['P1', f6(fq.reserves.incremental.P1.oil)], ['P2', f6(fq.reserves.incremental.P2.oil)], ['P3', f6(fq.reserves.incremental.P3.oil)]]);
must('FAQ 3.3: the low case fails, 1P = 0, 2P = 7000000 and P2 = 7000000', !fq.cases.low.economic && fq.reserves.provedZero && fq.reserves.cumulative['1P'].oil === 0 && fq.reserves.cumulative['2P'].oil === 7e6 && fq.reserves.incremental.P2.oil === 7e6, JSON.stringify(fq.reserves.cumulative));
w();
w('The engine\'s reason on the low case, verbatim:');
quote(fq.reasons.find((r) => r.startsWith('the low case is not economic')));
w(`So 1P is ${f6(fq.reserves.cumulative['1P'].oil)} and 2P is ${f6(fq.reserves.cumulative['2P'].oil)}, the whole best estimate: the P2 increment is ${f6(fq.reserves.incremental.P2.oil)} (engine), and the low-case barrels are inside 2P. The same figures as a category set stated incrementally (golden input cat-faq33-incremental: first 5, second 2, third 3 MMbbl) give 1P ${f6(fqc.cumulative[0].value)}, 2P ${f6(fqc.cumulative[1].value)} and 3P ${f6(fqc.cumulative[2].value)} (engine) when the low case passes.`);
must('cat-faq33-incremental gives 5, 7 and 10', fqc.cumulative.map((x) => x.value).join() === '5,7,10', fqc.cumulative.map((x) => x.value).join());
w();
// AG 2011 TABLE 6.2
const agI = runG('agg-ag2011-table62-independent');
const agD = runG('agg-ag2011-table62-dependent');
const agA = argsOf('agg-ag2011-table62-independent');
const agDA = argsOf('agg-ag2011-table62-dependent');
const Z90 = 1.2815515655446004;
w('CHECK TWO: THE 2011 GUIDELINES, TABLE 6.2 (text: two gas blocks A and B with an expectation of GIIP of 53.4 and 35.6, a Proved GIIP of 43.3 and 28.5 and a total Proved of 71.8, all in thousand million cubic metres; Fig. 6.5 prints the arithmetic Proved as 72 and the probabilistic Proved of independent blocks as 77). The Guidelines add the blocks by error propagation for symmetric distributions (section 6.3.3), so the golden input reads each block as a NORMAL distribution with the printed expectation as its mean and the expectation less the Proved as its 90 percent half-width: the standard deviation is that half-width over the standard normal 90th percentile. That reading is the Guidelines\' own, stated as such; the engine takes whatever distribution a call states.');
w();
table(['block', 'distribution (golden input)', 'mean', 'standard deviation', 'low estimate (engine)', 'the Proved the Guidelines print (text)'], agI.projects.map((p, i) => [p.id, p.distribution.type, f6(agA.projects[i].distribution.mean), f6(agA.projects[i].distribution.stdDev), f6(p.low), i === 0 ? '43.3' : '28.5']));
must('AG 6.2: the engine reads each normal block\'s low estimate back to the printed Proved', Math.abs(agI.projects[0].low - 43.3) < 1e-9 && Math.abs(agI.projects[1].low - 28.5) < 1e-9, `${agI.projects[0].low} ${agI.projects[1].low}`);
w();
const agExact = 89 - Math.sqrt(10.1 * 10.1 + 7.1 * 7.1);
w(`ARITHMETIC. The arithmetic sum by category (engine): low ${f6(agI.arithmetic.low)}, best ${f6(agI.arithmetic.best)}, high ${f6(agI.arithmetic.high)}; the Guidelines print 71.8 in Table 6.2 and 72 on Fig. 6.5 (text).`);
must('AG 6.2: the arithmetic low is 71.8', Math.abs(agI.arithmetic.low - 71.8) < 1e-9, agI.arithmetic.low);
w(`INDEPENDENT BLOCKS (golden input agg-ag2011-table62-independent: correlation ${S(agA.correlation.rho)}, seed ${S(agA.seed)}, ${S(agA.iterations)} draws). The seeded Monte Carlo returns a P90 of ${f6(agI.statistical.low)}, a P50 of ${f6(agI.statistical.best)} and a P10 of ${f6(agI.statistical.high)}, with a sampled mean of ${f6(agI.statistical.mean)} against the exact sum of the means ${f6(agI.sumOfMeans)} (engine). The Guidelines print 77 (text). The exact low of a sum of two independent normals (derived: 89 less the square root of 10.1 squared plus 7.1 squared) is ${f6(agExact)}; the sampled P90 differs from it by ${f6(Math.abs(agI.statistical.low - agExact))} at these ${S(agA.iterations)} draws.`);
must('AG 6.2: the sampled P90 rounds to 77 and sits within 0.05 of the exact low', Math.round(agI.statistical.low) === 77 && Math.abs(agI.statistical.low - agExact) < 0.05, agI.statistical.low);
w(`NEAR TOTAL DEPENDENCE (golden input agg-ag2011-table62-dependent: correlation ${S(agDA.correlation.rho)}, seed ${S(agDA.seed)}, ${S(agDA.iterations)} draws). The sampled P90 returns to ${f6(agD.statistical.low)} (engine), against the arithmetic ${f6(agD.arithmetic.low)}.`);
must('AG 6.2 dependent: the sampled P90 is within 0.3 of 71.8', Math.abs(agD.statistical.low - 71.8) < 0.3, agD.statistical.low);
// the lognormal reading, through the engine
const lnSd = (m, q) => { const s = -Z90 + Math.sqrt(Z90 * Z90 - 2 * Math.log(q / m)); return m * Math.sqrt(Math.exp(s * s) - 1); };
const lnArgs = clone(agA);
lnArgs.projects = [{ id: 'A', name: 'Block A, read as a lognormal (stated)', distribution: { type: 'lognormal', mean: 53.4, stdDev: lnSd(53.4, 43.3) } }, { id: 'B', name: 'Block B, read as a lognormal (stated)', distribution: { type: 'lognormal', mean: 35.6, stdDev: lnSd(35.6, 28.5) } }];
const agLn = success('aggregate on AG 6.2 read as two lognormals (stated probe)', E.aggregate(lnArgs));
w(`THE SAME BLOCKS READ AS LOGNORMALS (stated probe). A lognormal through the same expectation and Proved (derived: its log standard deviation s solves s squared over 2 plus 1.2815515655446004 times s plus ln(Proved over expectation) = 0, and its standard deviation is the expectation times the square root of e to the s squared less 1) has a standard deviation of ${f6(lnArgs.projects[0].distribution.stdDev)} for A and ${f6(lnArgs.projects[1].distribution.stdDev)} for B; the engine reads their low estimates back as ${f6(agLn.projects[0].low)} and ${f6(agLn.projects[1].low)}. On the same seed ${S(lnArgs.seed)} and ${S(lnArgs.iterations)} draws the sampled P90 of the total is ${f6(agLn.statistical.low)} (engine). The reading moves the figure: the Guidelines\' own symmetric reading is the one the golden input takes, and the course names both.`);
must('the lognormal reading reads the lows back to the printed Proved', Math.abs(agLn.projects[0].low - 43.3) < 1e-9 && Math.abs(agLn.projects[1].low - 28.5) < 1e-9, `${agLn.projects[0].low} ${agLn.projects[1].low}`);
must('the lognormal reading gives a sampled P90 near 76.4', Math.abs(agLn.statistical.low - 76.4) < 0.1, agLn.statistical.low);
w();
// NUPRC 2026
const nu = runG('agg-nuprc-2026-gas-2p');
const nuA = argsOf('agg-nuprc-2026-gas-2p');
w('CHECK THREE: THE NATIONAL GAS FIGURE (text: the NUPRC release of 1 April 2026 prints the 2P associated gas at 100.21 and the 2P non-associated gas at 114.98 trillion cubic feet as at 1 January 2026, a total of 215.19). The golden input agg-nuprc-2026-gas-2p states each published 2P figure as one value (a constant: low, best and high the same) at the above-field level, so the engine\'s category labels read 1P, 2P and 3P for the one stated figure; only the 2P is what was published.');
w();
table(['project (golden input)', 'the stated 2P'], nuA.projects.map((p) => [`${p.id}, ${p.name}`, f6(p.estimates.best)]));
w();
w(`The engine sums them to ${f6(nu.arithmetic.best)} and reports "${nu.reportable}" as what may be reported at the ${nu.level} level (engine, seed ${S(nuA.seed)}, ${S(nuA.iterations)} draws of two constants).`);
must('NUPRC 2026: the sum is 215.19 and only the arithmetic sum is reportable', Math.abs(nu.arithmetic.best - 215.19) < 1e-9 && nu.reportable === 'arithmetic', `${nu.arithmetic.best} ${nu.reportable}`);
w();
w(`CHECK FOUR: THE SEC SUMMATION RULE (17 CFR 229.1202(a)(3), quoted in ${ref('provisions')}). The same projects aggregated at the "field" and at the "above-field" level (golden inputs agg-ekene-reserves and agg-ekene-reserves-above-field) return the same figures and differ in what may be reported:`);
const aF = runG('agg-ekene-reserves');
const aAF = runG('agg-ekene-reserves-above-field');
w();
table(['golden input', 'level', 'arithmetic 1P', 'statistical P90 (seed and draws as stated)', 'reportable'], [['agg-ekene-reserves', aF.level, f6(aF.arithmetic.low), `${f6(aF.statistical.low)} (seed ${S(aF.seed)}, ${S(aF.iterations)} draws)`, aF.reportable], ['agg-ekene-reserves-above-field', aAF.level, f6(aAF.arithmetic.low), `${f6(aAF.statistical.low)} (seed ${S(aAF.seed)}, ${S(aAF.iterations)} draws)`, aAF.reportable]]);
must('the two levels give the same figures and differ only in reportable', aF.arithmetic.low === aAF.arithmetic.low && aF.statistical.low === aAF.statistical.low && aF.reportable === 'arithmetic-or-statistical' && aAF.reportable === 'arithmetic', `${aF.reportable} ${aAF.reportable}`);
w();
w('The engine\'s reason at the above-field level, verbatim:');
quote(aAF.reasons.find((r) => r.startsWith('above the field level')));

/* ============================================================ SECTION 5 */

section('dataset', 'The Ekene field and its eight projects', ['Associate m01 l03', 'Associate m03 l04', 'Professional m04', 'Expert m01']);
w('Every teaching case in this course comes from one fixture file under test-data/economics/ekene-prms, written by a stated script that reproduces it. It is labelled SYNTHETIC in the file:');
quote(FX.synthetic);
must('the fixture carries its SYNTHETIC statement and names its writer', FX.synthetic.startsWith('SYNTHETIC') && FX.generatedBy === 'tools/validation/economics/make_prms_fixtures.py', FX.generatedBy);
w();
w(`THE FIELD (fixture): ${FX.field}. Operator ${FX.operator.id}, ${FX.operator.name}, with a working interest of ${f6(FX.operator.workingInterestPct)} percent. Money in ${FX.currency}.`);
must('the operator name ends (synthetic)', /\(synthetic\)$/.test(FX.operator.name), FX.operator.name);
w();
w('THE EIGHT PROJECTS, each classified by the engine on the fixture\'s stated facts (the golden inputs class-ekn-1 to class-ekn-8 carry the same facts):');
w();
const FXP = FX.projects.map((p) => {
  const r = success(`classify on the fixture project ${p.id}`, E.classify(clone(p.args)));
  const g = GC[`class-${p.id.toLowerCase()}`];
  must(`the golden input class-${p.id.toLowerCase()} carries the fixture's facts`, g && JSON.stringify(g.args) === JSON.stringify(p.args), p.id);
  return { id: p.id, a: p.args, r };
});
table(['id', 'project (fixture)', 'discovery', 'recovery project', 'class (engine)', 'sub-class (engine)', 'chance of commerciality, percent (engine)', 'what holds it back (engine)'],
  FXP.map(({ id, a, r }) => [id, a.name, a.discovery, a.recoveryProject, r.class, r.subClass || 'none', f6(r.chanceOfCommercialityPct), list(r.unmet)]));
FXP.forEach(({ a }) => must(`every fixture project name ends (synthetic): ${a.name}`, /\(synthetic\)$/.test(a.name), a.name));
const README_ROWS = [...FXREADME.matchAll(/^\| (EKN-\d) \| [^|]+ \| ([^|]+) \| ([^|]+) \|/gm)].map((m) => [m[1], m[2].trim(), m[3].trim()]);
must('the fixture README tables all eight projects', README_ROWS.length === 8, README_ROWS.length);
README_ROWS.forEach(([id, cls, sub]) => {
  const p = FXP.find((x) => x.id === id);
  must(`the README class of ${id} is the engine's`, p && p.r.class === cls && (p.r.subClass || 'none') === sub, `${id} ${cls} ${sub} against ${p && p.r.class} ${p && p.r.subClass}`);
});
w();
w(`All ${README_ROWS.length} classes and sub-classes the fixture README states are the ones the engine returns (checked when this digest is built). Ekene Deep (EKN-6) is the same prospect the farm-out course prices, with the same chance of geologic discovery.`);
w();
const EL = FX.economicLimit;
w(`THE ECONOMIC LIMIT OF EKN-1 (fixture): effective ${S(EL.effectiveYear)}; low, best and high technical forecasts from ${S(EL.forecasts.low[0].year)} to ${S(EL.forecasts.low[EL.forecasts.low.length - 1].year)} (whole barrels a year, with gas at ${f6(EL.forecasts.best[0].gas / EL.forecasts.best[0].oil)} Mscf a barrel); oil at ${f6(EL.prices[0].oil)} and gas at ${f6(EL.prices[0].gas)} a unit, flat; opex ${f6(EL.costs.opex[0].amount)} a year; capital of ${f6(EL.costs.capex[0].amount)} in ${S(EL.costs.capex[0].year)}; abandonment ${f6(EL.costs.abandonment)}; a ${f6(EL.royalty.ratePct)} percent royalty (form "${EL.royalty.form}"); tax at ${f6(EL.tax.ratePct)} percent with ${S(EL.tax.depreciationYears)}-year straight-line allowances and loss carry forward ${S(EL.tax.lossCarryforward)}; a working interest of ${f6(EL.workingInterestPct)} percent; a licence expiring in ${S(EL.licence.expiryYear)} with renewal expected ${S(EL.licence.renewalExpected)}; the "${EL.reportingBasis}" basis; a discount rate of ${f6(EL.discountRatePct)} percent; ${f6(EL.mscfPerBoe)} Mscf per BOE (${ref('economiclimit')}).`);
must('the fixture economic limit is the golden input econ-ekene', JSON.stringify(EL) === JSON.stringify(GC['econ-ekene'].args), 'econ-ekene');
must('the fixture royalty and tax are synthetic figures and say so', /not the PIA 2021 or NTA 2025 rates/.test(FX.synthetic), 'synthetic rates');
w('The royalty, the tax and the prices are synthetic figures chosen for teaching, and the fixture says so: they are not the rates of the Petroleum Industry Act 2021 or the Nigeria Tax Act 2025, which the pia course teaches.');
w();
const AGR = FX.aggregation;
w(`THE AGGREGATIONS (fixture): Reserves at the ${AGR.reserves.level} level in ${AGR.reserves.unit} (${AGR.reserves.projects.map((p) => `${p.id} ${p.distribution.type}`).join(', ')}; correlation stated by pair; seed ${S(AGR.reserves.seed)}, ${S(AGR.reserves.iterations)} draws), and Contingent Resources in ${AGR.contingent.unit} (${AGR.contingent.projects.map((p) => `${p.id} ${p.distribution.type} with a chance of commerciality of ${f6(p.chanceOfCommercialityPct)} percent`).join(', ')}; a uniform correlation of ${f6(AGR.contingent.correlation.rho)}; seed ${S(AGR.contingent.seed)}, ${S(AGR.contingent.iterations)} draws) (${ref('probabilistic')} and ${ref('risked')}).`);
must('the fixture aggregations are the golden inputs agg-ekene-reserves and agg-ekene-contingent', JSON.stringify(AGR.reserves) === JSON.stringify(GC['agg-ekene-reserves'].args) && JSON.stringify(AGR.contingent) === JSON.stringify(GC['agg-ekene-contingent'].args), 'agg');
const RC = FX.reconciliation;
w(`THE RECONCILIATION (fixture): the Ekene field Reserves in ${RC.unit} over ${S(RC.periodYears)} year, opening ${f6(RC.opening.low)}, ${f6(RC.opening.best)} and ${f6(RC.opening.high)}, with ${RC.movements.length} movements (${RC.movements.map((m) => m.type).join(', ')}) and a stated closing of ${f6(RC.closing.low)}, ${f6(RC.closing.best)} and ${f6(RC.closing.high)} at a tolerance of ${f6(RC.tolerance)} (${ref('reconciliation')}).`);
must('the fixture reconciliation is the golden input rec-ekene', JSON.stringify(RC) === JSON.stringify(GC['rec-ekene'].args), 'rec');

/* ============================================================ SECTION 6 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m04', 'Professional m01', 'Professional m02', 'Professional m04', 'Professional m06', 'Expert m02', 'Expert m03', 'Expert m04', 'Expert m06']);
w('A refusal is an object with `error` and `field`. The message starts with the name of the field it refuses and states the exact condition that failed: "<field> must <condition>; got <value>", the value as the engine prints it (a string in quotes, an absent value as nothing), or, for an unknown key, "<field> is not an accepted key; the accepted keys ... are ...". Each row below is a stated bad input from the golden file handed to the engine; the message is the engine\'s, verbatim. A result returned with a reason (a criterion not met, a low case that fails, a reconciliation that does not close) is a result. It is no refusal.');
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
must('eighty refusal cases in the golden file', REF.length === 80, REF.length);
must('no refusal message carries a pipe', REF.every((c) => !c.expected.message.includes('|')), 'pipe');
w();
w('REFUSALS A PANEL CONTROL CAN PRODUCE. Each calculator panel writes every required input into the box through a visible control, and setting a control to "not stated" removes the input. The calls below are not golden cases; each is a golden input with one input removed or changed (stated probes), handed to the engine here, and the message is the engine\'s, verbatim:');
w();
const dropAt = (o, path) => { const ks = path.split('.'); let t = o; ks.slice(0, -1).forEach((k) => { t = t[k]; }); delete t[ks[ks.length - 1]]; return o; };
const PANEL_REFUSALS = [
  ['class-ekn-1', 'discovery removed (the discovery control set to not stated)', (a) => dropAt(a, 'discovery'), 'discovery'],
  ['class-ekn-1', 'commerciality.market removed', (a) => dropAt(a, 'commerciality.market'), 'commerciality.market'],
  ['class-ekn-1', 'economicStatus removed', (a) => dropAt(a, 'economicStatus'), 'economicStatus'],
  ['class-ekn-6', 'chances.developmentPct removed', (a) => dropAt(a, 'chances.developmentPct'), 'chances.developmentPct'],
  ['cat-reserves-cumulative', 'method removed (the method control set to not stated)', (a) => dropAt(a, 'method'), 'method'],
  ['econ-ekene', 'royalty.form removed (the royalty form control set to not stated)', (a) => dropAt(a, 'royalty.form'), 'royalty.form'],
  ['econ-ekene', 'licence.renewalExpected removed', (a) => dropAt(a, 'licence.renewalExpected'), 'licence.renewalExpected'],
  ['econ-ekene', 'reportingBasis removed (the reporting basis control set to not stated)', (a) => dropAt(a, 'reportingBasis'), 'reportingBasis'],
  ['econ-ekene', 'mscfPerBoe removed', (a) => dropAt(a, 'mscfPerBoe'), 'mscfPerBoe'],
  ['agg-ekene-reserves', 'correlation removed (the correlation control set to not stated)', (a) => dropAt(a, 'correlation'), 'correlation'],
  ['agg-ekene-reserves', 'seed removed', (a) => dropAt(a, 'seed'), 'seed'],
  ['agg-ekene-contingent', 'level removed (the level control set to not stated)', (a) => dropAt(a, 'level'), 'level'],
  ['rec-ekene', 'tolerance removed', (a) => dropAt(a, 'tolerance'), 'tolerance'],
];
table(['golden input', 'the change (stated probe)', 'field', 'the engine\'s message, verbatim'], PANEL_REFUSALS.map(([id, what, f, field]) => {
  const r = refusal(`${GC[id].fn} on ${id} with ${what}`, E[GC[id].fn](f(argsOf(id))), field);
  return [id, what, `\`${field}\``, r && r.error];
}));
w();
const orderProbe = argsOf('econ-ekene'); delete orderProbe.reportingBasis; orderProbe.basis = 'gross';
const orderR = refusal('economicLimit on econ-ekene with reportingBasis removed and an unknown key basis added (stated probe)', E.economicLimit(orderProbe), 'basis');
w('THE ORDER OF REFUSALS. A box that carries an unknown key AND lacks a required input is refused on the unknown key first: every function checks its accepted keys before it reads an input. On econ-ekene with reportingBasis removed and a key basis added (stated probe), the engine\'s message, verbatim:');
quote(orderR.error);
w();
w('Four rules the table shows:');
w('- An input with no default is refused when it is missing, and the message says so: a discovery status, a recovery project, every commerciality criterion (each true or false, stated), an economic status, a project status for Reserves, a reserves status, the chances of a risked class, a category method, a royalty form, a loss relief choice, a renewal expectation, a reporting basis, a BOE factor, a distribution type, a correlation, a seed, a draw count and a reconciliation tolerance.');
w('- An input key a function does not read is refused at whatever level it sits (a top-level option, a criterion, a forecast row, a project, a distribution, a movement), with the path to the key and the full list of accepted keys.');
w('- An input that contradicts the class the facts give is refused and the message names the class: a sub-class the facts do not support, a chance stated for Reserves, a project status stated for Contingent Resources, a significant or no-interest declaration on a project that meets every commerciality criterion.');
w('- A stated figure inside a message is printed as it was given; a computed one prints to six decimals.');

/* ============================================================ SECTION 7 */

section('graded', 'What is graded, where the practicals run, and what is never graded', ['Associate m01 l05', 'Expert m02 l04', 'Expert m06']);
w('EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED INPUTS. A capstone field, a question key and a panel figure are each computed by a function in the table of ' + ref('computes') + ' on inputs written down in advance. No graded figure comes from the Monte Carlo of aggregate, so the same inputs give the same number on any machine, and there is exactly one right answer.');
w();
w('THE PRACTICALS RUN IN THE COURSE\'S OWN CALCULATOR PANELS. This is an engine course with no Suite app. Each tier has a calculator panel that calls this same vendored engine: the classification calculator (Associate), the reserves calculator (Professional) and the aggregation calculator (Expert). A learner types or pastes their own inputs; the panel prints what the engine returns, every refusal in the engine\'s own words, and the reasons beside each figure.');
w();
w('WHAT A CAPSTONE STATES. Each capstone runs its own synthetic field, which this digest does not print, and states every input a figure depends on: each project\'s discovery status, recovery project and chances; each category set with its class, method and unit; the three technical forecasts, prices, costs, royalty and its form, tax, working interest, licence, reporting basis, discount rate and BOE factor; each project\'s distribution and chance, the correlation, the seed and the draws; the opening, the movements, the stated closing and the tolerance. Each graded figure is quoted to six decimals as the panel prints it.');
w();
w(`WHAT IS NEVER GRADED. No graded figure depends on a reading the engine states (${ref('readings')}): every capstone field is the same number under each reading the engine takes and under the alternative it names. No graded figure is a Monte Carlo draw: the statistical P90, P50, P10 and mean of ${ref('probabilistic')} are taught with their seed and draw count and are never graded as exact figures.`);
w();
w('WHAT A COMPUTED FIGURE DOES NOT SAY. A class is what the stated facts give; a category is a stated estimate put in its place; an economic limit is where the stated forecast, prices and costs stop paying; a total is a sum or a sampled distribution of stated distributions; a reconciliation is stated movements added up. None is an audit of the facts, a forecast of what a field will produce or a regulator\'s decision. Each figure is quoted with its inputs for that reason.');

/* ============================================================ SECTION 8 */

section('framework', 'The resources framework: discovered or undiscovered, a recovery project, and the class', ['Associate m01', 'Associate m02 l01', 'Associate m02 l03']);
w('THE ENGINE\'S DECISION LIST, in its own order (the reasons of every classify call print each step with the PRMS section it applies):');
w('1. Discovery: a known accumulation is discovered; a potential one is undiscovered (PRMS 2.1.1.1).');
w('2. A recovery project: established technology, technology under development, or none. With none, the quantities are Discovered Unrecoverable or Undiscovered Unrecoverable, and nothing else is read (PRMS 2.1.0.1, 2.1.1.2).');
w('3. Undiscovered with a project: Prospective Resources, with a stated sub-class and stated chances (PRMS 2.1.0.1, Table 1).');
w('4. Discovered with a project: the commerciality test. Every criterion met with established technology gives Reserves; anything else gives Contingent Resources, with each blocker named (PRMS 2.1.2.1, Table 1).');
w();
const u8 = runG('class-ekn-8');
const uu = runG('class-undiscovered-unrecoverable');
w('UNRECOVERABLE. Ekene Main residual oil (fixture EKN-8) is discovered with no recovery project; the engine\'s reasons, verbatim:');
reasons(u8.reasons);
w();
w(`It returns class "${u8.class}", no sub-class and no category labels (labels ${S(u8.labels)}); its basis reads, verbatim:`);
quote(u8.basis.categories);
must('EKN-8 is Discovered Unrecoverable with no labels', u8.class === 'Discovered Unrecoverable' && u8.labels === null, u8.class);
w(`The same with an undiscovered accumulation (golden input class-undiscovered-unrecoverable) returns "${uu.class}".`);
must('undiscovered with no project is Undiscovered Unrecoverable', uu.class === 'Undiscovered Unrecoverable', uu.class);
w();
w('THE EIGHT EKENE DECISIONS, each class and sub-class decision the engine records, verbatim (golden inputs class-ekn-1 to class-ekn-8):');
w();
table(['id', 'decision', 'section', 'outcome'], FXP.flatMap(({ id, r }) => r.decisions.filter((d) => ['class', 'sub-class'].includes(d.rule)).map((d) => [id, d.rule, d.section, d.outcome])));
w();
w('THE PROJECT IS THE UNIT. Every classify call classifies one project: the engine takes one set of facts and returns one class. A field with several projects (Ekene has eight) carries a class for each; the same accumulation can hold Reserves in one project and Contingent Resources in another.');

/* ============================================================ SECTION 9 */

section('prospective', 'Prospective Resources: the sub-classes and the chance of commerciality', ['Associate m02 l02', 'Associate m02 l04', 'Professional m01 l04']);
const p6 = runG('class-ekn-6');
const p7 = runG('class-ekn-7');
const pPlay = runG('class-play');
const pZero = runG('class-pg-zero');
w('THE CHANCE OF COMMERCIALITY OF AN UNDISCOVERED PROJECT is the chance of geologic discovery times the chance of development: Pc = Pg x Pd (PRMS 2.1.3.3). The engine\'s decision line on Ekene Deep (golden input class-ekn-6), verbatim:');
quote(p6.decisions.find((d) => d.rule === 'chance of commerciality').outcome);
w();
const PROS = [['class-ekn-6', p6], ['class-ekn-7', p7], ['class-play', pPlay], ['class-pg-zero', pZero]];
table(['golden input', 'sub-class', 'Pg, percent (stated)', 'Pd, percent (stated)', 'Pc, percent (engine)'], PROS.map(([id, r]) => [id, r.subClass, f6(r.chances.geologicDiscoveryPct), f6(r.chances.developmentPct), f6(r.chanceOfCommercialityPct)]));
PROS.forEach(([id, r]) => must(`${id}: Pc is Pg x Pd / 100`, Math.abs(r.chanceOfCommercialityPct - (r.chances.geologicDiscoveryPct * r.chances.developmentPct) / 100) < 1e-12, r.chanceOfCommercialityPct));
w();
w(`A CHANCE OF GEOLOGIC DISCOVERY OF 0 (golden input class-pg-zero) gives a Pc of ${f6(pZero.chanceOfCommercialityPct)} (engine): the class is still "${pZero.class}", sub-class "${pZero.subClass}".`);
w();
w('THE THREE SUB-CLASSES of Prospective Resources are stated, and the engine checks each is one of them: "prospect" (a potential accumulation mature enough to drill), "lead" (one that needs more data to become a prospect) and "play" (a family of such accumulations in a basin), in the course\'s own words (PRMS 2.1.3.5.9, Table 1). A sub-class outside the three is refused, verbatim (golden input class-refuse-prospective-subclass):');
quote(E.classify(argsOf('class-refuse-prospective-subclass')).error);
w();
w('Prospective Resources carry no commerciality test and no project status: stating either is refused (golden inputs class-refuse-prospective-commerciality and class-refuse-prospective-pd, in the table of ' + ref('refusals') + ').');

/* ============================================================ SECTION 10 */

section('commercial', 'Reserves and Contingent Resources: what makes a project commercial, and the reserves status', ['Associate m03']);
w('COMMERCIAL, IN THE ENGINE\'S TERMS. A discovered project with a recovery project is Reserves when every one of the seven commerciality criteria and the firm intention to proceed is met with established technology; otherwise it is Contingent Resources, and the engine names each criterion that holds it back. The criteria, as the engine names them in its reasons (golden input class-ekn-1), verbatim:');
w();
const e1 = runG('class-ekn-1');
table(['criterion key', 'the engine\'s wording', 'section', 'EKN-1 (engine)'], e1.criteria.map((c) => [c.criterion, c.what, c.section, c.met ? 'met' : 'not met']));
must('eight criterion rows, all met on EKN-1', e1.criteria.length === 8 && e1.criteria.every((c) => c.met), e1.criteria.length);
w();
const e3 = runG('class-ekn-3');
const e4 = runG('class-ekn-4');
const e5 = runG('class-ekn-5');
w('THE THREE EKENE CONTINGENT PROJECTS, each with the criteria that hold it back (engine):');
w();
table(['id', 'project (fixture)', 'sub-class (stated, checked)', 'economic status (stated)', 'blockers (engine)', 'Pc = Pd, percent (engine)'], [['EKN-3', e3, 'class-ekn-3'], ['EKN-4', e4, 'class-ekn-4'], ['EKN-5', e5, 'class-ekn-5']].map(([id, r, g]) => [id, argsOf(g).name, r.subClass, r.economicStatus, list(r.unmet), f6(r.chanceOfCommercialityPct)]));
must('EKN-5 is held back by technology under development first', e5.unmet[0] === 'technology under development', e5.unmet.join());
w();
w('The class decision on EKN-5, verbatim:');
quote(e5.decisions.find((d) => d.rule === 'class').outcome);
w();
const tu = runG('class-tech-under-development-only');
w(`TECHNOLOGY UNDER DEVELOPMENT ALONE (golden input class-tech-under-development-only): every criterion met, and the recovery project states technology under development, so the class is "${tu.class}" and the blockers are "${list(tu.unmet)}" (engine).`);
must('technology under development alone keeps a project Contingent', tu.class === 'Contingent Resources' && tu.unmet.join() === 'technology under development', tu.unmet.join());
w();
w('THE CHANCE OF COMMERCIALITY OF A DISCOVERED PROJECT is the chance of development alone: Pc = Pd (PRMS 2.1.3.3). The engine\'s decision line on EKN-4, verbatim:');
quote(e4.decisions.find((d) => d.rule === 'chance of commerciality').outcome);
w('Reserves carry no chance figure; stating one is refused, verbatim (golden input class-refuse-reserves-chances):');
quote(E.classify(argsOf('class-refuse-reserves-chances')).error);
w();
const e2 = runG('class-ekn-2');
w('THE RESERVES STATUS is stated for Reserves and checked against the project status (PRMS 2.1.3.6, Table 2): "developed-producing", "developed-non-producing" or "undeveloped".');
w();
table(['id', 'project (fixture)', 'sub-class (engine)', 'reserves status (stated)'], [['EKN-1', argsOf('class-ekn-1').name, e1.subClass, e1.reservesStatus], ['EKN-2', argsOf('class-ekn-2').name, e2.subClass, e2.reservesStatus]]);
w();
w('Developed producing needs a project on production; stated on one that is not, it is refused, verbatim (golden input class-refuse-dp-not-producing):');
quote(E.classify(argsOf('class-refuse-dp-not-producing')).error);

/* ============================================================ SECTION 11 */

section('categories', 'Categories and the range of uncertainty: low, best and high in each class', ['Associate m04']);
w('THREE ESTIMATES, THREE LABELS PER CLASS. Every class with a project carries a low, a best and a high estimate, and the engine labels each by its class (PRMS 2.2.2.2 to 2.2.2.4):');
w();
const catR = runG('cat-reserves-cumulative');
const catCi = runG('cat-contingent-incremental');
const catCc = runG('cat-contingent-cumulative');
const catP = runG('cat-prospective');
table(['class', 'low', 'best', 'high', 'incremental labels (engine)'], [
  ['Reserves', ...catR.cumulative.map((x) => x.label), catR.incremental.map((x) => x.label).join(', ')],
  ['Contingent Resources', ...catCi.cumulative.map((x) => x.label), catCi.incremental.map((x) => x.label).join(', ')],
  ['Prospective Resources', ...catP.cumulative.map((x) => x.label), 'none (PRMS 2.2.2.4)'],
]);
w();
w(`THE EKENE MAIN RESERVES (golden input cat-reserves-cumulative: ${f6(argsOf('cat-reserves-cumulative').estimates.low)}, ${f6(argsOf('cat-reserves-cumulative').estimates.best)} and ${f6(argsOf('cat-reserves-cumulative').estimates.high)} ${argsOf('cat-reserves-cumulative').unit}, stated cumulatively):`);
w();
table(['label', 'case', 'probability label', 'value (engine)'], catR.cumulative.map((x) => [x.label, x.case, x.probability, f6(x.value)]));
w();
table(['increment', 'value (engine)'], catR.incremental.map((x) => [x.label, f6(x.value)]));
w();
w('The engine\'s reasons, verbatim:');
reasons(catR.reasons);
w();
w(`CONTINGENT RESOURCES BOTH WAYS. The same Ekene North estimates stated incrementally (golden input cat-contingent-incremental: C1 ${f6(argsOf('cat-contingent-incremental').estimates.first)}, C2 ${f6(argsOf('cat-contingent-incremental').estimates.second)}, C3 ${f6(argsOf('cat-contingent-incremental').estimates.third)}) and cumulatively (golden input cat-contingent-cumulative: 1C ${f6(argsOf('cat-contingent-cumulative').estimates.low)}, 2C ${f6(argsOf('cat-contingent-cumulative').estimates.best)}, 3C ${f6(argsOf('cat-contingent-cumulative').estimates.high)}) return the same categories (engine):`);
w();
table(['golden input', '1C', '2C', '3C', 'C1', 'C2', 'C3'], [['cat-contingent-incremental', catCi], ['cat-contingent-cumulative', catCc]].map(([id, r]) => [id, ...r.cumulative.map((x) => f6(x.value)), ...r.incremental.map((x) => f6(x.value))]));
must('the two contingent forms give the same categories', JSON.stringify(catCi.cumulative) === JSON.stringify(catCc.cumulative) && JSON.stringify(catCi.incremental) === JSON.stringify(catCc.incremental), 'contingent forms');
w();
w(`PROSPECTIVE RESOURCES (golden input cat-prospective): 1U ${f6(catP.cumulative[0].value)}, 2U ${f6(catP.cumulative[1].value)}, 3U ${f6(catP.cumulative[2].value)} ${argsOf('cat-prospective').unit} (engine), and no increments; the engine\'s reason, verbatim:`);
quote(catP.reasons[catP.reasons.length - 1]);
w('Stating the incremental method for Prospective Resources is refused, verbatim (golden input cat-refuse-prospective-incremental):');
quote(E.categorize(argsOf('cat-refuse-prospective-incremental')).error);
w();
const catS = runG('cat-single-value');
w(`ONE VALUE FOR THE RANGE (golden input cat-single-value: low, best and high all ${f6(argsOf('cat-single-value').estimates.low)}). The engine returns singleValue ${S(catS.singleValue)} and adds, verbatim:`);
quote(catS.reasons[catS.reasons.length - 1]);
must('equal estimates set singleValue', catS.singleValue === true, catS.singleValue);
w();
w('OUT OF ORDER. The low estimate may not exceed the best, nor the best the high; the engine refuses, verbatim (golden input cat-refuse-out-of-order):');
quote(E.categorize(argsOf('cat-refuse-out-of-order')).error);

/* ============================================================ SECTION 12 */

section('probability', 'The low estimate and probability: exceedance, P90 as the low, and the two methods', ['Associate m05']);
w('THE EXCEEDANCE SENTENCE, as the canonical percentile convention (lib/conventions/percentile.js) states it and the engine returns it on every categorize call, verbatim:');
quote(EXCEEDANCE_DEFINITION);
must('categorize returns the exceedance sentence of the convention', catR.exceedance === EXCEEDANCE_DEFINITION, catR.exceedance);
w();
table(['case', 'outcome label (lib/conventions/percentile.js)', 'what it means here'], [['low', OUTCOME_LABELS.p90, 'at least 90 percent probability of being met or exceeded, when the method is probabilistic'], ['best', OUTCOME_LABELS.p50, 'at least 50 percent probability'], ['high', OUTCOME_LABELS.p10, 'at least 10 percent probability']]);
must('the labels are P90, P50 and P10', OUTCOME_LABELS.p90 === 'P90' && OUTCOME_LABELS.p50 === 'P50' && OUTCOME_LABELS.p10 === 'P10', JSON.stringify(OUTCOME_LABELS));
w();
w('THE LOW ESTIMATE CARRIES THE HIGHEST PROBABILITY. The P90 is the low estimate: the quantity that is met or exceeded with at least 90 percent probability is the smallest of the three. The engine prints the probability beside each category (golden input cat-reserves-cumulative), verbatim:');
reasons(catR.reasons.slice(1, 4));
w();
w('DETERMINISTIC AND PROBABILISTIC. The engine takes three estimates however they were made: by a deterministic method (a low, a best and a high scenario each worked out on its own) or by a probabilistic one (read off a distribution). The probability wording holds when the method is probabilistic, and the engine says so in each line ("when probabilistic"). In a deterministic estimate the low scenario is chosen to carry a high degree of confidence; the course says so in its own words (PRMS 2.2.1.2 and 2.2.1.4).');
w();
w('INCREMENTAL AND CUMULATIVE, IN WORDS. Cumulative categories count up from zero: 1P, then 2P that includes it, then 3P that includes both. Incremental categories are the slices: Proved (P1) is the 1P, Probable (P2) is what the 2P adds to it, Possible (P3) is what the 3P adds to the 2P. The Associate tier reads the two forms; the Professional tier builds one from the other (' + ref('incremental') + ').');
w();
w('A CATEGORY TABLE, READ. A table of categories names the class, the unit, the method, the three labels, the probability label beside each and, where the class has them, the increments. The engine\'s cumulative rows carry exactly those fields: case, label, probability and value.');

/* ============================================================ SECTION 13 */

section('nigeria', 'Nigerian terms in words: the declarations after an appraisal, a significant discovery and its retention, the field development plan and the national figures', ['Associate m06']);
w(`WHAT THE ACT AND THE REGULATIONS PROVIDE, in the course's words (the provisions are quoted in ${ref('provisions')}): when the appraisal programme is complete, the licensee declares a commercial discovery, a significant gas or crude oil discovery, or a discovery of no interest (PIA 2021 s.78(8)). A commercial discovery is followed by a field development plan within ${S(PF.fieldDevelopmentPlanYears)} years (s.79(1)). A significant discovery is substantial and potentially commercial and cannot yet be declared commercial (s.318; S.I. No. 37 of 2023 regs 3 and 4); the area may be retained for a period the Commission sets, at most ${S(PF.significantDiscoveryRetentionMaxYears)} years from the declaration (s.78(9)), an approval running at least ${S(PF.retentionMinOnshoreShallowYears)} years onshore and in shallow water and ${S(PF.retentionMinDeepWaterYears)} in deep water (reg. 6(3)); if no commercial discovery is declared by the end, the area is relinquished (s.78(13)). A discovery of no interest may be relinquished over its structure (s.78(15)).`);
w();
w('THE ENGINE CARRIES THESE AS NOTES, optional and only for a discovered project (nigeria.declaration and nigeria.yearsSinceDeclaration, stated). The notes do not change the PRMS class: they are printed beside it.');
w();
const NG = [['class-ekn-3', 'significant gas discovery, 3 years'], ['class-nigeria-retention-10', 'significant, 10 years'], ['class-nigeria-retention-11', 'significant, 11 years'], ['class-nigeria-fdp-2', 'commercial, 2 years'], ['class-ekn-1', 'commercial, per the fixture'], ['class-nigeria-no-interest', 'no interest']];
table(['golden input', 'what it states', 'class (engine)', 'the engine\'s Nigerian note, verbatim'], NG.map(([id, what]) => { const r = runG(id); must(`${id} carries a Nigerian note`, r.nigeria && r.nigeria.notes.length === 1, id); return [id, what, r.class, r.nigeria.notes[0]]; }));
const n10 = runG('class-nigeria-retention-10').nigeria.notes[0];
const n11 = runG('class-nigeria-retention-11').nigeria.notes[0];
must('the retention note at 10 years does not say the period has ended; at 11 it does', !/retention period has ended/.test(n10) && /retention period has ended/.test(n11), 'retention');
w();
w('A SIGNIFICANT DISCOVERY IS NOT DECLARED COMMERCIAL. A project that meets every commerciality criterion stated with a significant or a no-interest declaration is refused, verbatim (golden input class-refuse-nigeria-significant-reserves):');
quote(E.classify(argsOf('class-refuse-nigeria-significant-reserves')).error);
w('And the notes follow a discovery only, verbatim (golden input class-refuse-nigeria-undiscovered):');
quote(E.classify(argsOf('class-refuse-nigeria-undiscovered')).error);
w();
w(`NATIONAL RESERVES AND THE COMMISSION. The Act gives the Commission the evaluation of national reserves (s.7(i), quoted in ${ref('provisions')}), and the Commission publishes the national position each year; its release of 1 April 2026 put the 2P gas at 215.19 trillion cubic feet as at 1 January 2026 (text; ${ref('published')}). The Commercial Regulations 2025 ask for a status report that includes a statement of the reserves situation (reg. 6, by concept). No gazetted rule on how reserves are booked was found (${ref('sources')}), so the course teaches the PRMS classes and states no Nigerian booking rule.`);

/* ============================================================ SECTION 14 */

section('subclasses', 'Project maturity sub-classes: the facts that set them and the ones the engine refuses', ['Professional m01']);
w('RESERVES SUB-CLASSES ARE DERIVED FROM THE PROJECT STATUS. For a project the engine finds commercial it reads two stated facts, whether the final investment decision is taken and whether the project is on production, and derives the sub-class (PRMS 2.1.3.5, Table 1); the stated sub-class must be the derived one.');
w();
const js = runG('class-justified');
const SUBR = [['class-ekn-1', e1], ['class-ekn-2', e2], ['class-justified', js]];
table(['golden input', 'final investment decision (stated)', 'on production (stated)', 'sub-class (engine)', 'the engine\'s sub-class decision, verbatim'], SUBR.map(([id, r]) => { const a = argsOf(id); return [id, S(a.projectStatus.finalInvestmentDecision), S(a.projectStatus.onProduction), r.subClass, r.decisions.find((d) => d.rule === 'sub-class').outcome]; }));
must('the three Reserves sub-classes are each derived once', SUBR.map(([, r]) => r.subClass).join() === 'on-production,approved-for-development,justified-for-development', SUBR.map(([, r]) => r.subClass).join());
w();
w('A SUB-CLASS THE FACTS CONTRADICT is refused, and the message names the one the facts give, verbatim:');
w();
table(['golden input', 'the engine\'s message, verbatim'], ['class-refuse-subclass-approved-stated-justified', 'class-refuse-subclass-reserves-stated-pending', 'class-refuse-subclass-contingent-stated-approved', 'class-refuse-producing-without-fid'].map((id) => [id, refusal(id, E.classify(argsOf(id))).error]));
w();
w('CONTINGENT SUB-CLASSES ARE STATED. The engine cannot see why development is pending or on hold, so it takes the stated Contingent sub-class and checks only that it is one of the four (PRMS 2.1.3.5.6, Table 1): "development-pending", "development-on-hold", "development-unclarified" and "development-not-viable". The Ekene examples (engine): EKN-4 development-pending, EKN-3 development-on-hold, EKN-5 development-unclarified; the economic status is stated beside each ("viable", "undetermined", "not-viable").');
w();
w(`PROSPECTIVE SUB-CLASSES are stated the same way (${ref('prospective')}).`);

/* ============================================================ SECTION 15 */

section('criteria', 'The seven commerciality criteria, the firm intention and the five-year benchmark', ['Professional m02']);
w(`THE CRITERIA are the seven of PRMS 2.1.2.1 and the commitment to proceed, as tabled in ${ref('commercial')}; each is a stated true or false, with no default, except two the engine reads from other inputs: the time-frame (from a stated start and a stated justification) and positive economics (from the stated economic status "viable").`);
w();
w(`THE FIVE-YEAR BENCHMARK. The engine reads the time-frame as met when development starts within ${S(PF.reasonableTimeFrameYears)} years, or later when a longer time-frame is stated as justified (PRMS 2.1.2.3, a recommended benchmark). ${S(PF.reasonableTimeFrameYears)} years exactly is met. The golden inputs, each otherwise commercial:`);
w();
const TF = ['class-time-frame-5-met', 'class-time-frame-6-contingent', 'class-time-frame-8-justified'];
table(['golden input', 'start within, years (stated)', 'longer justified (stated)', 'class (engine)', 'the engine\'s time-frame reason, verbatim'], TF.map((id) => { const r = runG(id); const a = argsOf(id); return [id, S(a.commerciality.timeFrame.startWithinYears), S(a.commerciality.timeFrame.longerJustified), r.class, r.reasons.find((x) => x.startsWith('time-frame'))]; }));
must('five years is met, six is not, eight justified is met', runG('class-time-frame-5-met').class === 'Reserves' && runG('class-time-frame-6-contingent').class === 'Contingent Resources' && runG('class-time-frame-8-justified').class === 'Reserves', 'time-frame');
w();
const eu = runG('class-economics-undetermined');
const nf = runG('class-no-firm-intention');
w(`ECONOMICS NOT YET SHOWN (golden input class-economics-undetermined): economic status "${argsOf('class-economics-undetermined').economicStatus}", every other criterion met: class "${eu.class}", blockers "${list(eu.unmet)}" (engine).`);
w(`NO FIRM INTENTION (golden input class-no-firm-intention): every criterion met and the commitment not: class "${nf.class}", blockers "${list(nf.unmet)}" (engine). The criterion line, verbatim:`);
quote(nf.reasons.find((x) => x.startsWith('commitment')));
must('undetermined economics and no firm intention each keep a project Contingent', eu.class === 'Contingent Resources' && nf.class === 'Contingent Resources' && eu.unmet.join() === 'economicStatus' && nf.unmet.join() === 'firmIntention', `${eu.unmet} ${nf.unmet}`);
w();
w('EVERY CRITERION IS STATED. A criterion left out, or stated as anything other than true or false, is refused, verbatim (golden inputs class-refuse-missing-criterion and class-refuse-criterion-not-boolean):');
quote(E.classify(argsOf('class-refuse-missing-criterion')).error);
quote(E.classify(argsOf('class-refuse-criterion-not-boolean')).error);

/* ============================================================ SECTION 16 */

section('incremental', 'Incremental and cumulative categories: building one from the other', ['Professional m03']);
w('THE TWO FORMS REBUILD EACH OTHER EXACTLY (PRMS 2.2.1.4 and 2.2.2.1): 1P = P1, 2P = P1 + P2, 3P = P1 + P2 + P3; and P2 = 2P less 1P, P3 = 3P less 2P. The engine takes either form (method "cumulative" with low, best and high, or "incremental" with first, second and third) and returns both.');
w();
const czi = runG('cat-zero-increment');
table(['golden input', 'method', 'stated', 'cumulative (engine)', 'incremental (engine)'], [['cat-faq33-incremental', fqc], ['cat-reserves-cumulative', catR], ['cat-zero-increment', czi]].map(([id, r]) => { const a = argsOf(id); return [id, a.method, Object.entries(a.estimates).map(([k, v]) => `${k} ${f6(v)}`).join(', '), r.cumulative.map((x) => `${x.label} ${f6(x.value)}`).join(', '), r.incremental.map((x) => `${x.label} ${f6(x.value)}`).join(', ')]; }));
w();
w(`A ZERO INCREMENT (golden input cat-zero-increment). A Proved of ${f6(czi.incremental[0].value)} and a Possible of ${f6(czi.incremental[2].value)} are accepted: 1P is ${f6(czi.cumulative[0].value)}, and 2P and 3P are both ${f6(czi.cumulative[1].value)} (engine). The engine's incremental line, verbatim:`);
quote(czi.reasons.find((x) => x.startsWith('incremental')));
must('a zero increment gives equal 2P and 3P', czi.cumulative[1].value === czi.cumulative[2].value && czi.cumulative[0].value === 0, JSON.stringify(czi.cumulative));
w();
w('THE FORMS DO NOT MIX. The refusals, verbatim:');
w();
table(['golden input', 'the engine\'s message, verbatim'], ['cat-refuse-negative-increment', 'cat-refuse-mixed-forms', 'cat-refuse-incremental-with-low'].map((id) => [id, refusal(id, E.categorize(argsOf(id))).error]));
w();
w(`INCREMENTS FROM THREE FORECASTS. The economic limit returns the categories of three forecasts in both forms (${ref('economiclimit')}): the increments there are the differences of the three truncated, entitled quantities.`);

/* ============================================================ SECTION 17 */

section('economiclimit', 'The economic limit of three technical forecasts: the canonical cash flow, the trailing trim, the economic test and the low case that fails', ['Professional m04']);
w('THE RULE, in the engine\'s basis (golden input econ-ekene), verbatim:');
quote(bL.economicLimit);
quote(bL.economicTest);
w();
w('WHAT THE ENGINE DOES WITH THE THREE FORECASTS. For each of the low, best and high technical forecasts it (1) cuts the years after the licence expiry when no renewal is expected; (2) runs the canonical computeCashFlow of cashflow.ts at 100 percent under the JV regime with the stated prices, royalty, tax, allowance life, loss relief, abandonment and discount rate and no escalation, with its economic limit switched on; (3) keeps the years up to the canonical economic-limit year; (4) calls the case economic when its undiscounted net cash flow after tax and abandonment is above 0; then (5) reports the Reserves categories from the three kept quantities on the stated basis, or none when the best case fails.');
w();
const eE = runG('econ-ekene');
const caseRow = (k, r) => [k, `${S(r.forecastYears[0])} to ${S(r.forecastYears[1])}`, r.licenceCutYear === null ? 'none' : S(r.licenceCutYear), S(r.economicLimitYear), S(r.yearsTrimmed), f6(r.undiscountedNetCashFlow), f6(r.npv), S(r.economic), f6(r.technical.oil), f6(r.beyondLicence.oil), f6(r.beyondEconomicLimit.oil), f6(r.economicGross.oil), f6(r.reported.oil), f6(r.reported.boe)];
const CASE_HEAD = ['case', 'forecast', 'licence cut', 'economic limit', 'trailing years cut', 'undiscounted net cash flow at 100%', 'NPV at 100%', 'economic', 'technical oil', 'oil beyond the licence', 'oil beyond the limit', 'economic oil, gross', 'reported oil', 'reported BOE'];
w('THE EKENE MAIN WATERFLOOD, EKN-1 (golden input econ-ekene, the fixture):');
w();
table(CASE_HEAD, ['low', 'best', 'high'].map((k) => caseRow(k, eE.cases[k])));
w();
w('The engine\'s reasons, verbatim:');
reasons(eE.reasons);
w();
table(['category', 'oil', 'gas', 'BOE'], [...Object.entries(eE.reserves.cumulative), ...Object.entries(eE.reserves.incremental)].map(([k, q]) => [k, f6(q.oil), f6(q.gas), f6(q.boe)]));
must('EKN-1: every case economic, 1P kept', ['low', 'best', 'high'].every((k) => eE.cases[k].economic) && eE.reserves.provedZero === false, 'ekn-1');
w();
// the canonical cash flow, shown directly
const cfIn = (a, k, limit) => ({
  cfg: { fiscal_regime: 'JV', base_year: a.effectiveYear, valuation_year: a.effectiveYear, discounting_convention: 'end_year', present_value_basis: 'nominal', discount_rate_pct: a.discountRatePct, inflation_rate_pct: 0, oil_price_escalator_pct: 0, gas_price_escalator_pct: 0, condensate_price_escalator_pct: 0, opex_escalator_pct: 0, capex_escalator_pct: 0, oil_price_usd_bbl: a.prices[0].oil, gas_price_usd_mscf: a.prices[0].gas, condensate_price_usd_bbl: 0, price_deck: a.prices.map((p) => ({ year: p.year, oil: p.oil, gas: p.gas })), jv_working_interest_pct: 100, jv_royalty_pct: a.royalty.ratePct, jv_tax_rate_pct: a.tax.ratePct, jv_psc_depr_years: a.tax.depreciationYears, apply_loss_carryforward: a.tax.lossCarryforward, apply_economic_limit: limit, abandonment_cost_usd: a.costs.abandonment },
  prodRows: a.forecasts[k].filter((r) => a.licence.renewalExpected || r.year <= a.licence.expiryYear).map((r) => ({ year: r.year, oil_bbl: r.oil, gas_mscf: r.gas })),
  capexRows: a.costs.capex.map((r) => ({ year: r.year, amount_usd: r.amount })),
  opexRows: a.costs.opex.filter((r) => a.licence.renewalExpected || r.year <= a.licence.expiryYear).map((r) => ({ year: r.year, total_opex_usd: r.amount })),
});
const { CF } = await import(`${HERE}/prms_engine.mjs`);
const cfB = CF.computeCashFlow(cfIn(argsOf('econ-ekene'), 'best', true));
w(`THE CANONICAL CASH FLOW UNDERNEATH (stated probe: the best case of econ-ekene handed to computeCashFlow of cashflow.ts directly, with the same regime and inputs). It returns an economic limit year of ${S(cfB.kpis.economic_limit_year)}, ${S(cfB.kpis.years_trimmed_by_economic_limit)} years trimmed, an undiscounted net cash flow of ${f6(cfB.kpis.total_net_cash_flow_nominal)} and an NPV of ${f6(cfB.kpis.npv)} (canonical engine): the figures the prms engine reports for the best case.`);
must('the canonical cash flow gives the prms figures', cfB.kpis.economic_limit_year === eE.cases.best.economicLimitYear && cfB.kpis.total_net_cash_flow_nominal === eE.cases.best.undiscountedNetCashFlow && cfB.kpis.npv === eE.cases.best.npv, `${cfB.kpis.economic_limit_year} ${cfB.kpis.total_net_cash_flow_nominal}`);
w();
const tz = runG('econ-tail-exactly-zero-kept');
const t1 = runG('econ-tail-one-below-cut');
w('THE TRAILING TRIM AT ITS BOUNDARY. The canonical limit cuts trailing years whose revenue less royalty less opex is below 0 and keeps a year where it is exactly 0. Two golden inputs differ by one barrel in the last year (20000 and 19999 barrels at 50 a barrel against opex of 1000000, stated):');
w();
table(['golden input', 'last-year oil (stated)', 'economic limit (engine)', 'trailing years cut (engine)', '2P oil (engine)'], [['econ-tail-exactly-zero-kept', tz, 20000], ['econ-tail-one-below-cut', t1, 19999]].map(([id, r, o]) => [id, S(o), S(r.cases.best.economicLimitYear), S(r.cases.best.yearsTrimmed), f6(r.reserves.cumulative['2P'].oil)]));
must('a zero year is kept and one barrel less is cut', tz.cases.best.yearsTrimmed === 0 && t1.cases.best.yearsTrimmed === 1, `${tz.cases.best.yearsTrimmed} ${t1.cases.best.yearsTrimmed}`);
w();
const z0 = runG('econ-exactly-zero-not-economic');
const bf = runG('econ-best-fails');
w('THE ECONOMIC TEST AT ITS BOUNDARY. A case is economic when its undiscounted net cash flow is above 0 (PRMS 3.1.2.1); exactly 0 is not economic:');
w();
table(['golden input', 'best case undiscounted net cash flow (engine)', 'best economic (engine)', 'status (engine)'], [['econ-exactly-zero-not-economic', z0], ['econ-best-fails', bf], ['econ-faq33-low-fails', fq]].map(([id, r]) => [id, f6(r.cases.best.undiscountedNetCashFlow), S(r.cases.best.economic), r.status]));
must('exactly zero is not economic', z0.cases.best.undiscountedNetCashFlow === 0 && z0.cases.best.economic === false && z0.reserves === null, z0.status);
w();
w(`THE LOW CASE THAT FAILS. When the best case passes and the low case fails, 1P is 0 and the 2P and 3P stand; the low-case barrels sit inside 2P and are not reported as 1C (PRMS 3.1.2.8; FAQ 3.3 and 3.4). ${refCap('published')} runs the FAQ's own figures; the engine's line is quoted there.`);
w();
w('THE HIGH CASE MAY NOT FAIL WHEN THE BEST PASSES. On the same costs and prices a smaller high case is refused, verbatim (golden input econ-refuse-high-uneconomic):');
quote(E.economicLimit(argsOf('econ-refuse-high-uneconomic')).error);

/* ============================================================ SECTION 18 */

section('entitlement', 'Entitlement and the reporting basis: gross, working interest and net entitlement, a royalty interest and a production tax, BOE and cash at the working interest', ['Professional m05']);
w('THE RULE, in the engine\'s basis (golden input econ-ekene), verbatim:');
quote(bL.entitlement);
w();
w('THE SAME EKN-1 FORECASTS REPORTED FOUR WAYS (golden inputs; only the basis or the royalty form changes):');
w();
const EB = [['econ-ekene-gross', runG('econ-ekene-gross')], ['econ-ekene-working-interest', runG('econ-ekene-working-interest')], ['econ-ekene', eE], ['econ-ekene-production-tax', runG('econ-ekene-production-tax')]];
table(['golden input', 'reporting basis (stated)', 'royalty form (stated)', '1P BOE', '2P BOE', '3P BOE', '2P oil'], EB.map(([id, r]) => { const a = argsOf(id); return [id, a.reportingBasis, a.royalty.form, f6(r.reserves.cumulative['1P'].boe), f6(r.reserves.cumulative['2P'].boe), f6(r.reserves.cumulative['3P'].boe), f6(r.reserves.cumulative['2P'].oil)]; }));
const eW = EB[1][1];
const eP = EB[3][1];
must('a production tax deducts no volume: net entitlement equals working interest', eP.reserves.cumulative['2P'].boe === eW.reserves.cumulative['2P'].boe, `${eP.reserves.cumulative['2P'].boe} ${eW.reserves.cumulative['2P'].boe}`);
must('a royalty interest deducts volume: net entitlement below working interest', eE.reserves.cumulative['2P'].boe < eW.reserves.cumulative['2P'].boe, 'royalty interest');
w();
w('The engine\'s net entitlement lines, verbatim (econ-ekene, then econ-ekene-production-tax):');
quote(eE.reasons.find((x) => x.startsWith('net entitlement')));
quote(eP.reasons.find((x) => x.startsWith('net entitlement')));
w();
w(`The working-interest quantities above are the gross ones scaled by the stated ${f6(EL.workingInterestPct)} percent through the canonical applyJV of cashflow.ts; the net entitlement further takes out the royalty interest. The same royalty stated as a production tax takes out no volume, and the net entitlement then prints the same figures as the working interest (engine).`);
w();
w(`BARRELS OF OIL EQUIVALENT. BOE adds the oil and the gas at the stated ${f6(EL.mscfPerBoe)} Mscf per BOE; the engine calls it supplementary (PRMS 3.2.9.3) and checks the category order in BOE. On econ-ekene the 2P is ${f6(eE.reserves.cumulative['2P'].oil)} barrels of oil and ${f6(eE.reserves.cumulative['2P'].gas)} Mscf of gas, ${f6(eE.reserves.cumulative['2P'].boe)} BOE (engine).`);
must('BOE is oil plus gas over the factor on econ-ekene 2P', Math.abs(eE.reserves.cumulative['2P'].boe - (eE.reserves.cumulative['2P'].oil + eE.reserves.cumulative['2P'].gas / EL.mscfPerBoe)) < 1e-6, 'boe');
w();
table(['case', 'undiscounted net cash flow at 100%', 'at the working interest', 'NPV at 100%', 'NPV at the working interest'], ['low', 'best', 'high'].map((k) => [k, f6(eE.cases[k].undiscountedNetCashFlow), f6(eE.cases[k].undiscountedNetCashFlowShare), f6(eE.cases[k].npv), f6(eE.cases[k].npvShare)]));
w();
w(`CASH AT THE WORKING INTEREST. The engine runs the cash flow at 100 percent and scales the undiscounted net cash flow and the NPV by the stated working interest through applyJV (no royalty applied a second time): on the best case ${f6(eE.cases.best.undiscountedNetCashFlow)} at 100 percent is ${f6(eE.cases.best.undiscountedNetCashFlowShare)} at ${f6(EL.workingInterestPct)} percent (engine).`);
must('the working-interest share is the stated share of the 100% cash', Math.abs(eE.cases.best.undiscountedNetCashFlowShare - eE.cases.best.undiscountedNetCashFlow * 0.7) < 1e-6, 'share');
w();
w('The loss relief choice is stated and acts on the tax only. On EKN-1 no case has a loss year to carry, so the choice moves no figure (golden input econ-ekene-no-loss-relief):');
const nl = runG('econ-ekene-no-loss-relief');
table(['golden input', 'loss carry forward (stated)', 'best undiscounted net cash flow (engine)'], [['econ-ekene', eE], ['econ-ekene-no-loss-relief', nl]].map(([id, r]) => [id, S(argsOf(id).tax.lossCarryforward), f6(r.cases.best.undiscountedNetCashFlow)]));
must('loss relief moves nothing on EKN-1', nl.cases.best.undiscountedNetCashFlow === eE.cases.best.undiscountedNetCashFlow && nl.cases.low.undiscountedNetCashFlow === eE.cases.low.undiscountedNetCashFlow && nl.cases.high.undiscountedNetCashFlow === eE.cases.high.undiscountedNetCashFlow, 'loss relief');

/* ============================================================ SECTION 19 */

section('licence', 'Licence expiry and time: production beyond the licence, renewal expected, and capital after the expiry', ['Professional m06']);
w('THE RULE, in the engine\'s basis, verbatim:');
quote(bL.licence);
w(`When no renewal is expected, the years after the stated expiry are cut before the cash flow is run, and the barrels in them are reported as beyond the licence. The SEC definition of proved reserves ends at the expiry of the right to operate unless renewal is reasonably certain (17 CFR 210.4-10(a)(22), quoted in ${ref('provisions')}); PRMS 3.3.3.2, which the FAQ's answer 4.4 cites, keeps quantities produced after the expiry of the current agreement out of Reserves unless an extension is reasonably expected, and places them in Contingent Resources (section and answer numbers only). The engine reports them as beyond the licence and classifies none of them.`);
w();
const eRn = runG('econ-ekene-renewal-expected');
table(['golden input', 'renewal expected (stated)', 'high case licence cut', 'high economic limit', 'high oil beyond the licence', '3P BOE'], [['econ-ekene', eE], ['econ-ekene-renewal-expected', eRn]].map(([id, r]) => [id, S(argsOf(id).licence.renewalExpected), r.cases.high.licenceCutYear === null ? 'none' : S(r.cases.high.licenceCutYear), S(r.cases.high.economicLimitYear), f6(r.cases.high.beyondLicence.oil), f6(r.reserves.cumulative['3P'].boe)]));
must('renewal expected moves the high case and not the best', eRn.reserves.cumulative['3P'].boe > eE.reserves.cumulative['3P'].boe && eRn.reserves.cumulative['2P'].boe === eE.reserves.cumulative['2P'].boe, '3P');
w();
w(`On EKN-1 the licence ends in ${S(EL.licence.expiryYear)}; the best case reaches its economic limit in ${S(eE.cases.best.economicLimitYear)}, before the expiry, so a renewal changes the 3P and leaves the 2P where it is (engine).`);
w();
w('CAPITAL AFTER THE EXPIRY. With no renewal expected, a capital year after the expiry is refused, verbatim (golden input econ-refuse-capex-after-licence):');
quote(E.economicLimit(argsOf('econ-refuse-capex-after-licence')).error);
w('An expiry before the effective year is refused, verbatim (golden input econ-refuse-licence-before):');
quote(E.economicLimit(argsOf('econ-refuse-licence-before')).error);

/* ============================================================ SECTION 20 */

const corrText = (a) => (a.correlation.type === 'uniform' ? `uniform ${S(a.correlation.rho)}` : a.correlation.pairs.map((p) => `${p.a} and ${p.b} ${S(p.rho)}`).join(', '));
section('arithmetic', 'Arithmetic aggregation: summing by category, above the field level, and a sum of low estimates', ['Expert m01']);
w('THE RULE, in the engine\'s basis (golden input agg-ekene-reserves), verbatim:');
quote(aF.basis.aggregation);
w();
w(`THE EKENE RESERVES, PROJECT BY PROJECT (golden input agg-ekene-reserves; each project's low, best and high are read off its stated distribution: a triangular fitted through stated estimates, a lognormal and a normal, each by the canonical closed-form readers of lib/stats):`);
w();
table(['project', 'distribution (stated)', 'low (engine)', 'best (engine)', 'high (engine)', 'mean (engine)'], aF.projects.map((p) => [p.id, p.distribution.type === 'triangular' ? `triangular min ${f6(p.distribution.min)}, mode ${f6(p.distribution.mode)}, max ${f6(p.distribution.max)} (fitted)` : `${p.distribution.type} mean ${f6(p.distribution.mean)}, standard deviation ${f6(p.distribution.stdDev)}`, f6(p.low), f6(p.best), f6(p.high), f6(p.mean)]));
w();
table(['category', 'arithmetic sum (engine)'], [[aF.labels.low, f6(aF.arithmetic.low)], [aF.labels.best, f6(aF.arithmetic.best)], [aF.labels.high, f6(aF.arithmetic.high)]]);
must('the arithmetic sums are the sums of the project figures', ['low', 'best', 'high'].every((k) => Math.abs(aF.arithmetic[k] - aF.projects.reduce((s, p) => s + p[k], 0)) < 1e-9), 'arith');
w();
w('The engine\'s reasons, verbatim:');
reasons(aF.reasons);
w();
w('A SUM OF LOW ESTIMATES IS THE LOW OF THE TOTAL ONLY WHEN EVERY PROJECT IS TOTALLY DEPENDENT: when one comes in low, all do. The engine says so in every aggregate call and prints how far the sampled low sits above the arithmetic one at the stated seed and draws (the fourth reason above).');
w();
w(`ABOVE THE FIELD LEVEL the engine reports "${aAF.reportable}" as what may be reported (${ref('published')}, check four): the arithmetic sums, with the caution that the aggregate 1P may be very conservative and the aggregate 3P very optimistic (PRMS 4.2.5.4), and the statistical figures kept for portfolio analysis (PRMS 4.2.5.5). The SEC rule is quoted in ${ref('provisions')}.`);

/* ============================================================ SECTION 21 */

section('probabilistic', 'Probabilistic aggregation: the seeded Monte Carlo, the two Application Guidelines blocks, correlation, and the mean of a total', ['Expert m02']);
w('THE MONTE CARLO UNDERNEATH, in the engine\'s basis, verbatim:');
quote(aF.basis.monteCarlo);
quote(aF.basis.labels);
w();
w('Every figure below is a seeded Monte Carlo estimate: it is printed with its seed and its draw count, it reproduces exactly on those two inputs, and it is never graded. The same Ekene Reserves projects under four stated correlations (golden inputs):');
w();
const CORR = [['agg-ekene-reserves-independent', runG('agg-ekene-reserves-independent')], ['agg-ekene-reserves', aF], ['agg-ekene-reserves-strong', runG('agg-ekene-reserves-strong')], ['agg-negative-correlation', runG('agg-negative-correlation')]];
table(['golden input', 'correlation (stated)', 'seed', 'draws', 'P90', 'P50', 'P10', 'sampled mean', 'arithmetic 1P', 'arithmetic 3P'], CORR.map(([id, r]) => { const a = argsOf(id); return [id, corrText(a), S(a.seed), S(a.iterations), f6(r.statistical.low), f6(r.statistical.best), f6(r.statistical.high), f6(r.statistical.mean), f6(r.arithmetic.low), f6(r.arithmetic.high)]; }));
CORR.forEach(([id, r]) => must(`${id}: the sampled P90 sits above the arithmetic 1P and the sampled P10 below the arithmetic 3P`, r.statistical.low > r.arithmetic.low && r.statistical.high < r.arithmetic.high, id));
const [cI, , cS] = CORR.map(([, r]) => r);
must('the stronger the stated correlation, the nearer the sampled P90 comes to the arithmetic 1P (independent, as stated, strong)', cI.statistical.low > aF.statistical.low && aF.statistical.low > cS.statistical.low, `${cI.statistical.low} ${aF.statistical.low} ${cS.statistical.low}`);
w();
w('Across these draws the sampled P90 moves toward the arithmetic 1P as the stated correlation rises (independent, then the stated pairs, then strong), and the arithmetic figures do not move at all: the arithmetic sum does not read the correlation.');
w();
w(`THE MEAN OF A TOTAL IS THE SUM OF THE MEANS, whatever the correlation. The exact sum of the means is ${f6(aF.sumOfMeans)} (engine) on every row above; the sampled means differ from it by the sampling error of each run.`);
must('the exact sum of means is the same on every row', CORR.every(([, r]) => r.sumOfMeans === aF.sumOfMeans), 'som');
w();
const rep1 = success('aggregate on agg-ekene-reserves again (same seed)', E.aggregate(argsOf('agg-ekene-reserves')));
const seedB = argsOf('agg-ekene-reserves'); seedB.seed = 20271113;
const rep2 = success('aggregate on agg-ekene-reserves with seed 20271113 (stated probe)', E.aggregate(seedB));
w(`SEED AND DRAWS. Run again on seed ${S(argsOf('agg-ekene-reserves').seed)} the P90 is ${f6(rep1.statistical.low)} again (engine, identical); on seed ${S(seedB.seed)} with the same ${S(seedB.iterations)} draws it is ${f6(rep2.statistical.low)} (stated probe, engine). A Monte Carlo figure is quoted with its seed and draws for that reason, and never graded as exact.`);
must('the same seed reproduces and another seed moves the P90', rep1.statistical.low === aF.statistical.low && rep2.statistical.low !== aF.statistical.low, `${rep1.statistical.low} ${rep2.statistical.low}`);
w();
w(`THE TWO BLOCKS FROM THE 2011 GUIDELINES are run in ${ref('published')} (check two), with the Guidelines' own symmetric reading and the lognormal reading beside it.`);
w();
w('CORRELATION IS STATED, NEVER ASSUMED. The refusals, verbatim:');
w();
table(['golden input', 'the engine\'s message, verbatim'], ['agg-refuse-no-correlation', 'agg-refuse-missing-pair', 'agg-refuse-duplicate-pair', 'agg-refuse-pair-constant', 'agg-refuse-rho-one', 'agg-refuse-psd', 'agg-refuse-no-seed', 'agg-refuse-iterations'].map((id) => [id, refusal(id, E.aggregate(argsOf(id))).error]));

/* ============================================================ SECTION 22 */

section('risked', 'Risked quantities and classes: one class a call, the risked mean, distributions stated or fitted, and a national total', ['Expert m03']);
const aC = runG('agg-ekene-contingent');
const aP = runG('agg-prospective');
w('ONE CLASS A CALL. The engine aggregates the projects of one class at a time: Reserves, Contingent Resources and Prospective Resources are never added into one figure, and each figure says whether it is risked (PRMS 4.2.6; FAQ 6.9; the 2011 Guidelines 6.4). A risked class carries a stated chance of commerciality on every project; Reserves carry none, and stating one is refused, verbatim (golden input agg-refuse-reserves-chance):');
quote(E.aggregate(argsOf('agg-refuse-reserves-chance')).error);
w();
w(`THE EKENE CONTINGENT RESOURCES (golden input agg-ekene-contingent; seed ${S(argsOf('agg-ekene-contingent').seed)}, ${S(argsOf('agg-ekene-contingent').iterations)} draws for the sampled figures):`);
w();
table(['project', 'distribution (stated)', 'chance of commerciality, percent (stated)', 'low', 'best', 'high', 'mean (engine)'], aC.projects.map((p) => [p.id, p.distribution.type, f6(p.chanceOfCommercialityPct), f6(p.low), f6(p.best), f6(p.high), f6(p.mean)]));
w();
w(`THE RISKED MEAN is the sum of each project's chance of commerciality times its mean: ${f6(aC.riskedMean)} ${aC.unit} (engine), against an unrisked sum of means of ${f6(aC.sumOfMeans)}. The engine's line, verbatim:`);
quote(aC.reasons.find((r) => r.startsWith('risked mean')));
must('the risked mean is the sum of chance times mean', Math.abs(aC.riskedMean - aC.projects.reduce((s, p) => s + (p.chanceOfCommercialityPct * p.mean) / 100, 0)) < 1e-9, aC.riskedMean);
w();
w(`PROSPECTIVE RESOURCES are risked the same way (golden input agg-prospective): a risked mean of ${f6(aP.riskedMean)} against a sum of means of ${f6(aP.sumOfMeans)} (engine).`);
w();
w('DISTRIBUTIONS STATED OR FITTED. A project states its distribution: "triangular" (min, mode and max), "lognormal" or "normal" (mean and standard deviation), or "triangular-fit" (a triangular fitted through stated low, best and high estimates by lib/stats). The engine refuses a fit it cannot make exactly or that goes below 0, and a normal whose low estimate would be below 0, verbatim:');
w();
table(['golden input', 'the engine\'s message, verbatim'], ['agg-refuse-tri-fit-inexact', 'agg-refuse-tri-fit-negative', 'agg-refuse-normal-negative-low', 'agg-refuse-stated-with-estimates', 'agg-refuse-triangular-order', 'agg-refuse-dist-type'].map((id) => [id, refusal(id, E.aggregate(argsOf(id))).error]));
const negFit = clone(argsOf('agg-ekene-reserves-independent'));
negFit.projects = [{ id: 'F', name: 'a symmetric fit near 0 (stated)', distribution: { type: 'triangular-fit' }, estimates: { low: 1, best: 5.5, high: 10 } }];
const negR = refusal('aggregate on a triangular fitted exactly through 1, 5.5 and 10 (stated probe)', E.aggregate(negFit), 'projects[0].estimates');
w();
w(`TWO FIT REFUSALS, TWO MESSAGES. The golden input agg-refuse-tri-fit-negative returns the exactness message because no triangular passes through its three estimates at all. A fit that does pass through exactly and still reaches below 0 is refused with its own message. On a stated low of 1, best of 5.5 and high of 10 (stated probe), verbatim:`);
quote(negR.error);
must('the negative-fit message is its own', /stays at or above 0/.test(negR.error) && negR.error !== E.aggregate(argsOf('agg-refuse-tri-fit-negative')).error, negR.error);
const wideN = { resourceClass: 'reserves', level: 'field', unit: 'MMbbl', projects: [{ id: 'W', name: 'a wide normal (stated)', distribution: { type: 'normal', mean: 4, stdDev: 3.1 } }], correlation: { type: 'uniform', rho: 0 }, seed: 1, iterations: 1000 };
const wideR = success('aggregate on one wide normal (stated probe)', E.aggregate(clone(wideN)));
const nBelow = wideR.reasons.find((r) => /draws below 0/.test(r));
w();
w(`A normal that stays at or above 0 at its low estimate can still draw below 0; the engine keeps those draws and says so. On a stated normal of mean ${f6(4)} and standard deviation ${f6(3.1)} (stated probe; its low estimate is ${f6(wideR.projects[0].low)}, engine), verbatim:`);
quote(nBelow || '');
must('a wide normal reports its chance below zero', !!nBelow && wideR.projects[0].chanceBelowZero > 0.05, nBelow);
const ekBelow = aF.projects.find((p) => p.id === 'EKN-U').chanceBelowZero;
w(`The Ekene Upper sand normal (mean 4, standard deviation 0.8) has a chance below 0 of ${ekBelow.toExponential(6)} (engine), which prints as 0 at six decimals, so the engine adds no such line for it.`);
must('the Ekene normal chance below zero rounds to 0 at six decimals', ekBelow > 0 && ekBelow < 5e-7, ekBelow);
w();
const cst = runG('agg-constant-project');
const cstA = argsOf('agg-constant-project');
const cstP = cstA.projects[cstA.projects.length - 1];
w(`A CONSTANT. Equal low, best and high make a project a constant (golden input agg-constant-project: ${cstP.id} at ${f6(cstP.estimates.low)}), which adds its value to every draw and to every arithmetic category: the arithmetic 1P rises from ${f6(aF.arithmetic.low)} to ${f6(cst.arithmetic.low)} (engine).`);
must('a constant adds its value to the arithmetic sums', Math.abs(cst.arithmetic.low - aF.arithmetic.low - cstP.estimates.low) < 1e-9, cst.arithmetic.low);
w();
w(`A NATIONAL TOTAL. The Commission\'s 2P gas figure is a sum of two published 2P figures (${ref('published')}, check three): the engine adds them arithmetically at the above-field level and reports only the arithmetic sum.`);

/* ============================================================ SECTION 23 */

section('reconciliation', 'Reconciliation: opening, movements and closing, production out of every category, and the closing check', ['Expert m04']);
w('THE RULE, in the engine\'s basis (golden input rec-ekene), verbatim:');
quote(bR.reconciliation);
quote(bR.sections);
w();
const rE = runG('rec-ekene');
w('THE EKENE FIELD RESERVES FROM ONE YEAR TO THE NEXT (golden input rec-ekene, the fixture):');
w();
table(['movement', 'note (fixture)', '1P', '2P', '3P'], [['opening', '', f6(rE.opening.low), f6(rE.opening.best), f6(rE.opening.high)], ...rE.movements.map((m, i) => [argsOf('rec-ekene').movements[i].type, argsOf('rec-ekene').movements[i].note || '', f6(m.low), f6(m.best), f6(m.high)]), ['computed closing', '', f6(rE.computedClosing.low), f6(rE.computedClosing.best), f6(rE.computedClosing.high)], ['stated closing', '', f6(rE.statedClosing.low), f6(rE.statedClosing.best), f6(rE.statedClosing.high)]]);
w();
w('The engine\'s reasons, verbatim:');
reasons(rE.reasons);
w();
w(`The difference at 2P prints as ${f6(rE.difference.best)} at six decimals and is not exactly 0 (a floating-point residue of the sums); the reconciliation closes because every difference is within the stated tolerance ${f6(argsOf('rec-ekene').tolerance)} (engine, closes ${S(rE.closes)}).`);
must('rec-ekene closes with a non-zero residue at 2P', rE.closes && rE.difference.best !== 0 && Math.abs(rE.difference.best) < 1e-12, rE.difference.best);
w();
w('PRODUCTION COMES OUT OF EVERY RESERVES CATEGORY ALIKE: one quantity, subtracted from 1P, 2P and 3P. Stating it by category is refused, and production is refused in Contingent Resources, verbatim:');
w();
table(['golden input', 'the engine\'s message, verbatim'], ['rec-refuse-production-by-category', 'rec-refuse-contingent-production', 'rec-refuse-negative-addition', 'rec-refuse-negative-divestment', 'rec-refuse-quantity-on-revision', 'rec-refuse-type'].map((id) => [id, refusal(id, E.reconcile(argsOf(id))).error]));
w();
w('THE SIGNS. Revisions and transfers are signed; improved recovery, extensions and discoveries and acquisitions are entered positive and added; divestments are entered positive and subtracted (the engine\'s headings, its stated convention).');
w();
const RECS = ['rec-ekene-not-closing', 'rec-difference-exactly-tolerance', 'rec-difference-above-tolerance', 'rec-contingent', 'rec-divest-acquire', 'rec-order-breaks', 'rec-no-production'];
table(['golden input', 'computed closing 1P, 2P, 3P (engine)', 'difference at 2P (engine)', 'tolerance (stated)', 'closes (engine)', 'order breaks (engine)'], RECS.map((id) => { const r = runG(id); return [id, `${f6(r.computedClosing.low)}, ${f6(r.computedClosing.best)}, ${f6(r.computedClosing.high)}`, f6(r.difference.best), f6(argsOf(id).tolerance), S(r.closes), S(r.orderViolation)]; }));
must('a difference equal to the tolerance closes and one above it does not', runG('rec-difference-exactly-tolerance').closes && !runG('rec-difference-above-tolerance').closes, 'tolerance');
w();
w('A RECONCILIATION THAT DOES NOT CLOSE is a result: the engine names each category that misses and by how much (golden input rec-ekene-not-closing), verbatim:');
quote(runG('rec-ekene-not-closing').reasons.find((r) => r.startsWith('the reconciliation does not close')));
w('A computed closing out of order is reported (golden input rec-order-breaks), verbatim:');
quote(runG('rec-order-breaks').reasons.find((r) => r.startsWith('the computed closing is out of order')));
w();
w(`THE REPLACEMENT RATIO AND THE LIFE INDEX, printed when the period carries production (golden input rec-ekene): a replacement ratio of ${f6(rE.replacementRatio)} and a life index of ${f6(rE.lifeIndexYears)} years (engine). The engine's line, verbatim:`);
quote(rE.reasons.find((r) => /replacement ratio/.test(r)));
const rDA = runG('rec-divest-acquire');
w(`With divestments larger than the additions the ratio is negative (golden input rec-divest-acquire: ${f6(rDA.replacementRatio)}, engine). Without production neither is printed (golden input rec-no-production: ${S(runG('rec-no-production').replacementRatio)}).`);
must('no production gives no ratio', runG('rec-no-production').replacementRatio === null && runG('rec-no-production').lifeIndexYears === null, 'null');

/* ============================================================ SECTION 24 */

section('tworules', 'Two economic-limit rules: the canonical trailing trim, the PRMS cumulative peak, and why the engine refuses where they disagree', ['Expert m05 l01', 'Expert m05 l02', 'Expert m05 l03']);
w('RULE ONE, THE CANONICAL TRAILING TRIM (cashflow.ts, the economic limit every economics course in the academy uses): working backward from the last year, cut every trailing year whose revenue less royalty less opex is below 0; a year with capital is kept, and a year at exactly 0 is kept.');
w('RULE TWO, THE PRMS CUMULATIVE PEAK (PRMS 3.1.3.1 to 3.1.3.4): the economic limit is where the cumulative net cash flow, before income tax, allowances and abandonment, reaches its maximum; interim negative years count only when later positive years more than offset them.');
w();
w('On a declining forecast with no late capital the two rules give the same year, and the engine uses the canonical one and checks it against the peak. On a profile with a late dip and a partial recovery they disagree, and the engine refuses and names both years. The golden input econ-refuse-limit-disagrees states such a profile: 100000, 10000, 25000 and 22000 barrels from 2027 to 2030 at 50 a barrel with opex of 1000000 a year (stated). The canonical cash flow of its low case, run directly (stated probe: the same inputs handed to computeCashFlow with the economic limit off), year by year:');
const disA = argsOf('econ-refuse-limit-disagrees');
const cfOff = CF.computeCashFlow(cfIn(disA, 'low', false));
let cumD = 0;
const disRows = cfOff.cashFlowData.map((r) => { const noi = r.gross_revenue - r.royalty - r.opex; cumD += noi - r.capex; return [S(r.year), f6(r.gross_revenue), f6(r.royalty), f6(r.opex), f6(r.capex), f6(noi), f6(cumD)]; });
w();
table(['year', 'revenue (canonical)', 'royalty (canonical)', 'opex (canonical)', 'capex (canonical)', 'revenue less royalty less opex (derived)', 'cumulative before tax and abandonment (derived)'], disRows);
w();
const disR = refusal('economicLimit on econ-refuse-limit-disagrees', E.economicLimit(disA), 'forecasts.low');
w('The last year pays (so the trailing trim keeps every year to 2030) and the cumulative peaks in 2027 (so the PRMS limit is 2027). The engine\'s message, verbatim:');
quote(disR.error);
must('the canonical rows show a positive last year and a cumulative peak in the first year', Number(disRows[disRows.length - 1][5]) > 0 && Number(disRows[0][6]) > Number(disRows[disRows.length - 1][6]), JSON.stringify(disRows));
w();
w('WHY THE ENGINE REFUSES. Answering with either rule would move a Reserves figure by a choice the caller did not make: the canonical rule would count the late barrels, the PRMS rule would drop them. Changing the canonical cash flow to the PRMS rule would move every figure the academy\'s other economics courses and the Suite\'s economics app teach from cashflow.ts, so that change is a separate decision for the platform, and the engine keeps both rules visible by refusing where they part. The course teaches both rules, and no graded figure rests on a profile where they disagree.');
w();
w('WHAT THE CALLER CAN DO. State a forecast on which the two agree (the technical forecast ends where the project stops paying), or split the project at the dip; the refusal names both years so the caller can see which barrels are in question.');

/* ============================================================ SECTION 25 */

section('readings', 'The readings the engine states, where each acts, and the alternative', ['Expert m05', 'Expert m06 l02']);
w('A READING is a choice the engine makes where the texts leave room, stated in its own reasons or basis. Each is printed here where it acts, with the alternative it names; no graded figure moves under any alternative (the capstone generator and the discriminate sweep prove it field by field).');
w();
const tf5 = runG('class-time-frame-5-met');
table(['reading', 'where it acts', 'the engine\'s words, verbatim', 'the alternative'], [
  ['READING ONE: the five-year benchmark is met at five years', 'classify', tf5.reasons.find((x) => x.startsWith('time-frame')), 'five years exactly not met'],
  ['READING TWO: an undiscounted net cash flow of exactly 0 is not economic', 'economicLimit', bL.economicTest, 'exactly 0 economic'],
  ['READING THREE: the economic test includes abandonment', 'economicLimit', bL.economicTest, 'the test before the abandonment cost, as the producibility determination of PRMS 3.1.2.1 is made'],
  ['READING FOUR: the canonical trailing trim is the economic limit, checked against the PRMS peak and refused where they disagree', 'economicLimit', bL.economicLimit, 'the limit placed at the PRMS cumulative peak'],
  ['READING FIVE: production comes out of every Reserves category alike', 'reconcile', bR.reconciliation, 'none offered by the engine: a production movement is refused by category'],
  ['READING SIX: the replacement ratio counts every movement other than production', 'reconcile', rE.reasons.find((r) => /replacement ratio/.test(r)), 'the additions alone (revisions and transfers left out)'],
  ['READING SEVEN: the life index is read at the best estimate', 'reconcile', rE.reasons.find((r) => /replacement ratio/.test(r)), 'the life index at the low estimate'],
  ['READING EIGHT: a difference equal to the tolerance closes', 'reconcile', runG('rec-difference-exactly-tolerance').reasons.find((r) => r.startsWith('the reconciliation closes')), 'a difference equal to the tolerance does not close'],
  ['READING NINE: the Monte Carlo low is the 0.1 quantile of the totals', 'aggregate', aF.basis.labels, 'the low read at the 0.9 quantile (P90 read as high)'],
]);
w();
w(`THE GUIDELINES\' TABLE 6.2 READ WITH NORMAL MARGINALS is a reading of the golden input, not of the engine: the engine takes the distribution a call states, and ${ref('published')} prints the normal reading and the lognormal one beside it.`);

/* ============================================================ SECTION 26 */

section('quirks', 'Reference texts and their quirks', ['Expert m06 l02']);
w('A TABLE AND A FIGURE WITH TWO NUMBERS. The 2011 Guidelines print the arithmetic Proved of blocks A and B as 71.8 in Table 6.2 and as 72 on Fig. 6.5 (text): the figure rounds the table. The engine returns ' + f6(agI.arithmetic.low) + ' (' + ref('published') + ').');
w();
w('A SUPERSEDED EDITION. The 2011 Guidelines were revised in 2022; the 2022 edition is sold and was not read. A lesson names the 2011 edition by its year.');
w();
w('A STANDARD READ FROM A BILINGUAL EDITION. The English text of SPE-PRMS 2018 was read from the SPE-hosted English-Chinese edition (Version 2023 V1.0, developed from PRMS 2018 V1.0), whose English is the 2018 text; section numbers are the 2018 numbers.');
w();
w('AN ERRATUM ON THE WORD ECONOMIC. The consolidated PRMS errata (May 2022, item 5) revise the glossary entry for "economic" so that it reads a zero percent discount rate, matching PRMS 3.1.2.1 (text, never quoted): the economic test is undiscounted, which is the test the engine applies.');
w();
w('A RELEASE THAT PRINTS ONE FIGURE SHORT. The NUPRC release of 1 April 2026, as its page renders, prints the 2P crude oil figure as 09 billion barrels beside a condensate figure of 5.92 and a total of 37.01 billion barrels (text); the crude oil figure is truncated on the page, so the course uses only the gas figures and the total, and computes nothing from the truncated one.');
w();
w('A FILE NAME THAT DIFFERS FROM THE TITLE. The Commission hosts S.I. No. 37 of 2023 under a file name that reads "Significant Crude Oil and Gas Recovery Regulations"; the gazette title is the Significant Crude Oil and Gas Discovery Regulations, 2023, and the course cites the gazette title.');
w();
w('TWO CAPITALS FOR ONE TERM. The Act\'s interpretation section prints "Significant crude oil discovery" with a capital S and "significant gas discovery" without one (quoted as printed in ' + ref('provisions') + ').');
w();
w('A REGULATION WITH NO GAZETTE NUMBER. The Commission\'s posted copy of the Acreage Management and Petroleum (Drilling and Production) Regulation, 2024 prints placeholders for its instrument and gazette numbers; the course does not rely on it.');

/* ============================================================ SECTION 27 */

section('boundaries', 'Boundaries, rule by rule', ['Expert m05 l04']);
w('Each rule has its own boundary. None is global: some are inclusive, some strict. Every row is the engine\'s answer on a golden input.');
w();
const bnd = [
  ['the five-year benchmark', '5 years: met (Reserves)', '6 years: not met (Contingent)', 'class-time-frame-5-met, class-time-frame-6-contingent', runG('class-time-frame-5-met').class === 'Reserves' && runG('class-time-frame-6-contingent').class === 'Contingent Resources'],
  ['the economic test', 'undiscounted net cash flow exactly 0: not economic', 'above 0: economic', 'econ-exactly-zero-not-economic, econ-faq33-low-fails', z0.cases.best.economic === false && fq.cases.best.economic === true],
  ['the trailing trim', 'last year exactly 0: kept', 'one barrel less: cut', 'econ-tail-exactly-zero-kept, econ-tail-one-below-cut', tz.cases.best.yearsTrimmed === 0 && t1.cases.best.yearsTrimmed === 1],
  ['the two limit rules', 'agree: a result', 'late dip not offset: refused', 'econ-ekene, econ-refuse-limit-disagrees', !!disR.error && !eE.error],
  ['the licence', 'the expiry year kept', 'later years beyond the licence', 'econ-ekene (high case)', eE.cases.high.licenceCutYear === EL.licence.expiryYear && eE.cases.high.beyondLicence.oil > 0],
  ['retention, PIA 2021 s.78(9)', '10 years: inside', '11 years: ended', 'class-nigeria-retention-10, class-nigeria-retention-11', !/has ended/.test(n10) && /has ended/.test(n11)],
  ['the field development plan, s.79(1)', '2 years: inside', 'later: passed', 'class-nigeria-fdp-2, class-ekn-1', !/has passed/.test(runG('class-nigeria-fdp-2').nigeria.notes[0]) && /has passed/.test(runG('class-ekn-1').nigeria.notes[0])],
  ['a chance of geologic discovery of 0', 'Pc 0, still Prospective', '', 'class-pg-zero', pZero.chanceOfCommercialityPct === 0 && pZero.class === 'Prospective Resources'],
  ['equal estimates', 'one value; a constant in aggregation', '', 'cat-single-value, agg-constant-project', catS.singleValue === true],
  ['correlation', '0.999 accepted', '1 refused; a matrix that is not positive semidefinite refused', 'agg-ag2011-table62-dependent, agg-refuse-rho-one, agg-refuse-psd', !agD.error && !!E.aggregate(argsOf('agg-refuse-rho-one')).error],
  ['the reconciliation tolerance', 'difference equal to the tolerance: closes', 'above it: does not close', 'rec-difference-exactly-tolerance, rec-difference-above-tolerance', runG('rec-difference-exactly-tolerance').closes && !runG('rec-difference-above-tolerance').closes],
];
table(['rule', 'at the boundary', 'one past it', 'golden inputs'], bnd.map((r) => r.slice(0, 4)));
bnd.forEach((r) => must(`boundary: ${r[0]}`, r[4], r[0]));

/* ============================================================ SECTION 28 */

section('notcomputed', 'What the engine does not compute, and which course owns it', ['Expert m06']);
w('The engine takes these as stated inputs, or leaves them out; each belongs to another course of the academy, which the lessons name in one sentence and do not re-teach:');
w();
table(['not computed here', 'what the engine takes instead', 'the course that owns it'], [
  ['a production forecast from rates (decline or type curves)', 'three stated technical forecasts, year by year', 'dca (Decline Curve Analysis)'],
  ['in-place volumes from pressure and production (material balance)', 'stated estimates or distributions', 'mbal (Material Balance)'],
  ['in-place and recoverable volumes from maps and rock properties (volumetrics)', 'stated estimates or distributions', 'reservoircalc (Reservoir Volumetrics)'],
  ['the cash flow ledger, discounting and NPV as a subject', 'the canonical computeCashFlow and applyJV, imported', 'cashflow (Petroleum Economics and Cash Flow)'],
  ['the Nigerian fiscal terms (royalty rates by terrain and price, hydrocarbon tax, companies income tax)', 'a stated royalty rate and form and a stated tax rate', 'pia (Petroleum Industry Act 2021 and Nigerian Fiscal Terms)'],
  ['distributions, correlation and Monte Carlo as a subject', 'the canonical seeded sampler of lib/stats, applied to aggregation', 'uncertainty'],
  ['a price deck or a price forecast', 'stated prices year by year', 'none: always a stated input'],
  ['an audit of the stated facts, or a regulator\'s decision', 'stated facts, each printed in the reasons', 'none: the reserves report names them'],
  ['a Nigerian booking or reporting rule', 'none: no gazetted rule was found', 'none'],
]);
w();
w('WHAT THE ENGINE SAYS IT DOES NOT DECIDE. The category labels of the economic limit and of aggregation are outcome labels only; the engine does not say a stated deterministic scenario has a 90 percent chance. The BOE is supplementary. The movement headings of a reconciliation are the engine\'s stated convention (' + ref('reconciliation') + ').');

/* ============================================================ SECTION 29 */

section('sizecaps', 'Size caps and refusals at scale', ['Expert m06 l01']);
const yrs = (n, y0 = 2000) => Array.from({ length: n }, (_, i) => ({ year: y0 + i, oil: 1, gas: 0 }));
const bigEcon = argsOf('econ-tail-exactly-zero-kept');
bigEcon.forecasts = { low: yrs(D.MAX_YEARS + 1, 2027), best: yrs(3, 2027), high: yrs(3, 2027) };
const proj = (i) => ({ id: `P${i}`, distribution: { type: 'normal', mean: 10, stdDev: 1 } });
const CAPR = [
  ['MAX_YEARS', `economicLimit with a ${D.MAX_YEARS + 1}-year low forecast`, E.economicLimit(bigEcon), 'forecasts.low'],
  ['MAX_PROJECTS', `aggregate with ${D.MAX_PROJECTS + 1} projects`, E.aggregate({ ...argsOf('agg-ekene-reserves-independent'), projects: Array.from({ length: D.MAX_PROJECTS + 1 }, (_, i) => proj(i)), correlation: { type: 'uniform', rho: 0 } }), 'projects'],
  ['MAX_ITERATIONS', `aggregate with ${D.MAX_ITERATIONS + 1} draws`, E.aggregate({ ...argsOf('agg-ekene-reserves-independent'), iterations: D.MAX_ITERATIONS + 1 }), 'iterations'],
  ['MAX_MOVEMENTS', `reconcile with ${D.MAX_MOVEMENTS + 1} movements`, E.reconcile({ ...argsOf('rec-no-production'), movements: Array.from({ length: D.MAX_MOVEMENTS + 1 }, () => ({ type: 'revisions', low: 0, best: 0, high: 0 })) }), 'movements'],
];
table(['cap', 'value', 'stated call over the cap', 'the engine\'s message, verbatim'], CAPR.map(([k, what, r, field]) => { refusal(`cap ${k}: ${what}`, r, field); return [`\`${k}\``, S(D[k]), what, r.error]; }));
w();
const work = refusal('agg-refuse-work', E.aggregate(argsOf('agg-refuse-work')), 'iterations');
w(`THE DRAW WORK CAP. Draws times projects may not exceed ${S(D.MAX_DRAW_WORK)}, because the correlated draw grows with the square of the project count; the refusal names the most draws the stated projects allow (golden input agg-refuse-work), verbatim:`);
quote(work.error);
w('A panel stays well inside these caps.');

/* ============================================================ SECTION 30 */

section('choices', 'Conventions that are choices, and the reserves report', ['Expert m06 l03']);
w('CONVENTIONS THAT ARE CHOICES. Each is the engine\'s stated choice where no text fixes one; a different choice would move a figure, so each is named in any report that quotes the figure:');
w();
table(['convention', 'the engine\'s choice', 'where it comes from'], [
  ['the class', 'Reserves only when every commerciality criterion and the firm intention are met with established technology', 'PRMS 2.1.2.1, Table 1'],
  ['the time-frame', 'met at five years or less, or later when stated as justified', 'a stated reading (' + ref('readings') + ')'],
  ['a Reserves sub-class', 'derived from the investment decision and production status, checked against the stated one', 'PRMS 2.1.3.5, Table 1'],
  ['the chance of commerciality', 'Pg x Pd for Prospective, Pd for Contingent, none for Reserves', 'PRMS 2.1.3.3'],
  ['percentile labels', 'P90 the low case, P10 the high case', 'lib/conventions/percentile.js'],
  ['the economic limit', 'the canonical trailing trim, checked against the PRMS peak, refused where they disagree', 'a stated reading (' + ref('readings') + ')'],
  ['the economic test', 'undiscounted net cash flow after tax and abandonment above 0', 'a stated reading (' + ref('readings') + ')'],
  ['1P when the low case fails', '0, with 2P and 3P kept', 'PRMS 3.1.2.8; FAQ 3.3'],
  ['entitlement', 'applyJV scaling; a royalty interest deducted from volumes, a production tax not', 'PRMS 3.3.1'],
  ['BOE', 'oil plus gas at a stated Mscf per BOE, supplementary', 'PRMS 3.2.9.3'],
  ['the Monte Carlo low', 'the 0.1 quantile of the sampled totals', 'a stated reading (' + ref('readings') + ')'],
  ['a risked mean', 'the sum of chance of commerciality times mean', 'the 2011 Guidelines 6.4'],
  ['reconciliation headings and signs', 'production out of every category; divestments subtracted; revisions and transfers signed', 'engine convention'],
  ['money in a reason', 'rounded to the cent, half away from zero, trailing zeros dropped; a computed quantity or percentage to six decimals; every numeric field keeps full precision', 'engine convention'],
]);
w();
w('WRITING THE RESERVES REPORT names: the field and each project (synthetic in this course) with its discovery status, recovery project, class, sub-class and the blockers of a Contingent project; every source applied with its edition, licence and the date read; the effective date; the three technical forecasts and where they came from; the prices, costs, royalty and its form, tax, working interest, licence expiry and renewal expectation, reporting basis, discount rate and BOE factor; each case\'s economic limit, the rule it rests on and the years cut; the categories in both forms on the stated basis; each aggregation with its level, distributions, correlation, seed and draws, the arithmetic sums and what may be reported; each risked figure with its chances; the reconciliation with its headings and whether it closes; and each reading the figures rest on.');

/* ============================================================ SECTION 31 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Seven terms in this course carry a narrower meaning than they have in conversation. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['term', 'what it can mean elsewhere', 'the rule here'], [
  ['reserves', 'any stock of oil or gas, a national total, a company figure', 'the PRMS class: discovered, commercial and remaining; a national or company figure is "reported reserves" with its date and whoever reported it'],
  ['resources', 'anything in the ground', 'all quantities; each class is named in full (Contingent Resources, Prospective Resources)'],
  ['P90', 'the 90th percentile of anything', 'always the low estimate: at least 90 percent probability of being met or exceeded when probabilistic'],
  ['proved', 'shown to be true', 'cumulative 1P, the low estimate of Reserves; the increment is "Proved (P1)"; the same pattern for probable (2P, P2) and possible (3P, P3)'],
  ['economic limit', 'the end of a field\'s life', 'always of a named rule (the canonical trailing trim, or the PRMS cumulative peak) and a named case'],
  ['risked', 'dangerous', 'multiplied by a named chance (the chance of commerciality, or of geologic discovery); a figure says whether it is risked'],
  ['entitlement', 'a right', 'the quantities on a named basis: gross, working interest or net entitlement'],
]);
w();
w('A FIGURE THAT DEPENDS ON AN INPUT is quoted with it: a class with its facts; a category with its class, unit and method; a chance with its parts; a reserves figure with its basis, forecast case, economic limit and licence; a Monte Carlo figure with its seed, draws and correlation; a risked mean with its chances; a reconciliation with its movements and tolerance; an NPV with its rate.');

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', process.env.EC11_DUMP_PARTIAL || unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', process.env.EC11_DUMP_PARTIAL || SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)));
must('no em or en dash reaches the digest', !OUT.some((l) => /[–—]/.test(l)), OUT.find((l) => /[–—]/.test(l)));
must('the negative control list names the plants the discriminate sweep reuses', /P90 read as high/.test(NEGCONTROL) && /1P kept when the low case fails/.test(NEGCONTROL), 'negcontrol');

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`prms_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.EC11_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`prms_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
