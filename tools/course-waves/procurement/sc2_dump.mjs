// THE SC2 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-tender.md, the
// oracle, the fixture README and the engine's own source comments are
// PROVENANCE. Where FINDINGS quotes a figure (a published worked example, a
// fixture situation, a boundary) this file recomputes it through the engine on
// the vendored fixtures or on stated inputs and prints it, and a writer quotes
// the digest line.
//
// Usage:  sh /root/cat-wip-procurement/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/cat-wip-procurement/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF AN ENGINE (tender.js, or the
// lib/stats, lib/conventions/percentile.js, wellCost.js, afe.js and cashflow.ts
// npv it calls), except where a line says "stated" (an input typed in this
// file and printed beside the call it went into), "fixture" (read from the
// vendored ekene-tender files), "source" (a figure printed by a cited
// publication, typed here with its citation and set beside the engine's) or
// "derived" (arithmetic on engine values or stated inputs printed in the same
// block, with the arithmetic stated). Nothing here reads a clock, a random
// number, a locale or a network; the only random draws are the engine's own
// seeded mulberry32 stream, and TZ and LC_ALL are pinned by build_digest.sh.
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
// THE DIGEST IS NOT THE CAPSTONE. This file never reads sc2_capstone.mjs,
// fields.json or the capstone datasets, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.SC2_WAVE_DIR || '/root/cat-wip-procurement';
const { T, ROOT, ENGINE_REL, STATS, PCT, WELLCOST } = await import(`${HERE}/tender_engine.mjs`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const FINDINGS = fs.readFileSync(`${ROOT}/tools/validation/supplychain/FINDINGS-tender.md`, 'utf8');
const FIX = (f) => JSON.parse(fs.readFileSync(`${ROOT}/test-data/supplychain/ekene-tender/${f}`, 'utf8'));
const MODULES = JSON.parse(execFileSync('python3', [`${HERE}/structure.py`, '--modules'], { encoding: 'utf8' }));

/* ---------------------------------------------------------- the machinery */

const OUT = [];
const w = (s = '') => OUT.push(s);
const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.map(([k, v]) => `${k}=${v}`).join(', ') || 'all finite');
  }
  return r;
};
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned ${JSON.stringify(r).slice(0, 80)}`);
  must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, r && r.field);
  const nums = r ? Object.values(r).filter((v) => typeof v === 'number') : [];
  must(`A REFUSAL CARRIES NO NUMBER: ${label}`, nums.length === 0, nums.join(','));
  must(`THE MESSAGE STARTS WITH THE FIELD'S NAME: ${label}`, r && typeof r.error === 'string' && r.error.startsWith(`${field} `), r && r.error);
  return r;
};
const f6 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(6));
const eX = (x) => (x === 0 ? '0' : Number(x).toExponential(2));
const list = (a) => a.join(', ');
const S = (x) => String(x);
const sum = (a) => a.reduce((s, v) => s + v, 0);
const nearly = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const key12 = (x) => Number(x.toPrecision(12));
const clone = (o) => JSON.parse(JSON.stringify(o));
const mut = (o, f) => { const c = clone(o); f(c); return c; };
const cell = (s) => String(s).replace(/\|/g, '/');

/** Owner clause, rendered from structure.py so a section cannot name a module
 *  that does not teach it. Each owner is "Tier mNN" or "Tier mNN lNN". */
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
const ORDER = ['computes', 'sources', 'dataset', 'refusals', 'graded', 'technical', 'arithmetic', 'evaluated', 'combined', 'award',
  'lifecycle', 'band', 'alb', 'content', 's14', 's16',
  'contracts', 'percentiles', 'shouldcost', 'whole', 'honest', 'boundaries', 'caps', 'choices',
  'vocabulary'];
const refCap = (k) => { const r = ref(k); return r[0].toUpperCase() + r.slice(1); };
const ref = (k) => {
  const i = ORDER.indexOf(k);
  must(`a sentence refers to a declared section ${k}`, i >= 0, k);
  return `section ${i + 1}`;
};
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

/* ---------------------------------------------------------- the fixtures */

const WS = FIX('well-services.json');
const MS = FIX('materials.json');
const D = T.DEFAULTS;

// A fixture bid as the engine takes it: the display name, the per-item content
// record and the content weights stay in the fixture.
const bidOf = (b) => { const { name, nc, ncWeights, ...rest } = clone(b); return rest; };
// The technical envelope reads a bid's id, mandatory requirements and scores;
// the commercial envelope reads its receipt, bill and commercial terms. The
// engine refuses a key a function does not read, so each call gets its own view.
const techOf = (b) => ({ id: b.id, mandatory: b.mandatory, scores: b.scores });
const comOf = (b) => { const { scores, mandatory, indigenous, capacity, ncPct, ...rest } = b; return rest; };
const WS_BIDS = WS.bids.map(bidOf);
const MS_BIDS = MS.bids.map(bidOf);
const critOf = (f) => f.criteria.map(({ id, weight, maxScore }) => ({ id, weight, maxScore }));
const WS_CRIT = critOf(WS);
const MS_CRIT = critOf(MS);

// The Nigerian content of each materials bid, computed by the engine with each
// bid's spend weights, feeds the s.14 and s.16 calls as ncPct.
const MS_NC_ARGS = { items: MS.nc.items, bids: MS.bids.map((b) => ({ id: b.id, items: b.nc, weights: b.ncWeights })) };
const WS_NC_ARGS = { items: WS.nc.items, bids: WS.bids.map((b) => ({ id: b.id, items: b.nc })) };

// STATED TEACHING INPUTS, each passed to the engine AND printed from here.
// the stated receipt time of every published example's bids
const TIE_ALT = '2027-01-01T00:00:00Z';
// The published worked examples, typed from the cited sources (figures in the
// source's own table; the text column names the figure).
const PUB = {
  figIX: { passMark: 0, criteria: [{ id: 'effectiveness', weight: 50, maxScore: 4 }, { id: 'methodology', weight: 25, maxScore: 4 }, { id: 'team', weight: 15, maxScore: 4 }, { id: 'sustainability', weight: 10, maxScore: 4 }], bids: [{ id: 'A', scores: { effectiveness: 2, methodology: 2, team: 2, sustainability: 1 } }] },
  figIXPrinted: 190,
  figX: {
    technicalWeight: 0.8, priceMethod: 'lowest-ratio', technicalMethod: 'relative',
    bids: [
      { id: 'A', technicalPercent: 47.5, evaluatedCost: 5200000, receivedAt: TIE_ALT },
      { id: 'B', technicalPercent: 50, evaluatedCost: 4999999, receivedAt: TIE_ALT },
      { id: 'C', technicalPercent: 51.25, evaluatedCost: 4400000, receivedAt: TIE_ALT },
      { id: 'D', technicalPercent: 60, evaluatedCost: 4800000, receivedAt: TIE_ALT },
      { id: 'E', technicalPercent: 36.25, evaluatedCost: 1100000, receivedAt: TIE_ALT, rejected: 'abnormally low bid, rejected after examination' },
    ],
  },
  // The Guidance's printed figures for Figures X to XII (source), beside which
  // the engine's exact ones are set.
  figXPrinted: { technicalWeighted: { A: 63.33, B: 66.66, C: 68.33, D: 80 }, commercial: { A: 84.6, B: 88, C: 100, D: 91.7 }, combined: { A: 80.25, B: 84.26, C: 88.34, D: 98.34 }, cFigXII: 68.34 },
  annex2: { passMark: 80, criteria: [{ id: 'works', weight: 15, maxScore: 15 }, { id: 'value', weight: 15, maxScore: 15 }, { id: 'approach', weight: 70, maxScore: 70 }], bids: [{ id: 'A', scores: { works: 7, value: 4, approach: 48 } }, { id: 'B', scores: { works: 12, value: 11, approach: 54 } }, { id: 'C', scores: { works: 13, value: 11, approach: 67 } }] },
  annex2PrintedB: 82,
  annex3Tech: { passMark: 0, criteria: [{ id: 'effectiveness', weight: 50, maxScore: 4 }, { id: 'methodology', weight: 25, maxScore: 4 }, { id: 'team', weight: 15, maxScore: 4 }, { id: 'sustainability', weight: 10, maxScore: 4 }], bids: [{ id: 'A', scores: { effectiveness: 3, methodology: 2, team: 2, sustainability: 1 } }, { id: 'B', scores: { effectiveness: 2, methodology: 2, team: 2, sustainability: 1 } }] },
  annex3: { technicalWeight: 0.4, priceMethod: 'lowest-ratio', technicalMethod: 'relative', bids: [{ id: 'A', technicalPercent: 60, evaluatedCost: 8000000, receivedAt: TIE_ALT }, { id: 'B', technicalPercent: 47.5, evaluatedCost: 7250000, receivedAt: TIE_ALT }] },
  annex3Printed: { A: 94.37, B: 91.66 },
  kk: (priceMethod) => ({ technicalWeight: 0, priceMethod, technicalMethod: 'absolute', bids: [{ id: 'A', technicalPercent: 50, evaluatedCost: 50, receivedAt: TIE_ALT }, { id: 'B', technicalPercent: 50, evaluatedCost: 75, receivedAt: TIE_ALT }, { id: 'C', technicalPercent: 50, evaluatedCost: 100, receivedAt: TIE_ALT }] }),
  kkPrinted: { A: 100, B: 67, C: 50 },
  kkLinearPrinted: 75,
  chen: (aInvalid) => ({ technicalWeight: 0.5, priceMethod: 'lowest-ratio', technicalMethod: 'absolute', bids: [{ id: 'A', technicalPercent: 0, evaluatedCost: 40, receivedAt: TIE_ALT, ...(aInvalid ? { rejected: 'declared invalid after opening' } : {}) }, { id: 'B', technicalPercent: 0, evaluatedCost: 50, receivedAt: TIE_ALT }, { id: 'C', technicalPercent: 0, evaluatedCost: 80, receivedAt: TIE_ALT }] }),
  albEx1: { estimate: 2938140000, bids: [1145142, 1330191, 1342106, 1378232, 1462176, 1476269, 1486226, 1579100, 1613371, 1657703, 1856166, 1900885, 1912355, 2099006, 2149893, 2242001].map((c, i) => ({ id: `Bid ${i + 1}`, evaluatedCost: c })) },
  albEx1Printed: { mean: 1664426, sd: 315975, limit: 1348452 },
  albEx2: { estimate: 150003863, bids: [85862863, 115494160, 158012899, 165385533].map((c, i) => ({ id: `Bid ${i + 1}`, evaluatedCost: c })) },
};

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# SC2 TEACHING DIGEST: Procurement, Tendering & Contracting');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle, the fixture README and the engine source comments are PROVENANCE and not teaching truth.');
w();
w(`# PRECISION. Every price, amount, total, correction, discount, deviation, omission, adjustment, evaluated cost, life-cycle cost, estimate, share amount, payment, margin, overrun, cost, day count, score, points total, percentage, content, lead, ratio, weight, mean, standard deviation, limit, percentile and probability prints to SIX decimals; counts, ranks, weeks, years, seeds and iterations are whole numbers; the ${D.TIE_DIGITS}-digit tie key prints at twelve significant digits where the tie rule is shown; an engine message is printed verbatim, figures and all, and a figure inside a message is the shortest round-trip decimal of the double the engine holds.`);
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines 006ed85 (engines PRs #261, #264 and #266), ${engineLines} lines. It imports lib/stats (mulberry32, triInvCDF, basicStats, mean, standardDeviation), lib/conventions/percentile.js (EXCEEDANCE_DEFINITION), engines/economics/cashflow.ts (npv), engines/drilling/wellCost.js (evaluateProgram, afeCosts) and engines/economics/afe.js (calculatePartnerCosts). It makes no network call.`);
w();
w('# AN ENGINE COURSE. There is no Suite app for this course. Every practical runs in the course\'s own calculator panels, which call this same vendored engine on the learner\'s own bids and settings.');
w();
w('# THE DATA. Every Ekene tender, bidder, price, score and content figure is SYNTHETIC, written for this platform by a stated script. Bidders are codes. No real company, person, tender or price list appears.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone dataset and no graded answer. The capstones run their own tenders and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming the rule it applied and where the rule comes from, so the working can be printed.');
w();
const EXPORTS = [
  ['weightingBand', 'the Rated Criteria band', 'risk, estimatedCostUsd, technicalWeight', 'the para 5.50 cell, its weighting range and whether a stated technical weight is inside it'],
  ['correctArithmetic', 'arithmetic correction', 'lines, quotedTotal, tolerance', 'each line corrected by the stated rule with its reason, the corrected total and the correction'],
  ['technicalEvaluation', 'the technical envelope', 'criteria, bids, passMark', 'each bid\'s status, technical percentage and weighted points, the passing bids and the exclusions with their reasons'],
  ['evaluatedCosts', 'the commercial envelope', 'bids, omissionRule, bestEstimates, schedule, lifeCycle, tolerance', 'each bid\'s evaluated cost built term by term with every reason, the ranking and the lowest evaluated cost'],
  ['rankTender', 'the combined score', 'bids, technicalWeight, priceMethod, technicalMethod', 'each bid\'s technical, commercial and combined score, the ranking and the most advantageous bid'],
  ['nigerianContent', 'Nigerian content', 'items, bids', 'each bid\'s content per item against the minimum, its overall content and the targets with their sources'],
  ['contentPreference', 'sections 14 and 16', 'bids, ncLeadBasis', 'the s.14 group, leader, runner-up, lead and outcome with its readings, the s.16 rows and the bid selected'],
  ['contractTypes', 'contract types', 'duration, dailyCost, fixedCost, lumpSum, dayRate, reimbursable, plan, iterations, seed', 'per contract type the company cost with its percentiles, the contractor margin and who carries the overrun'],
  ['shouldCost', 'should-cost', 'program, nptFrac, items, contingencyFrac, partners, bids, band', 'the estimate from wellCost, the partner split from afe.js and each bid\'s ratio to the estimate with its flag'],
  ['abnormallyLow', 'abnormally low bids', 'bids, estimate', 'the approach (absolute or relative), the mean, standard deviation and limit where they apply, and the bids to clarify'],
  ['evaluateTender', 'the whole tender', 'criteria, passMark, bids, omissionRule, bestEstimates, schedule, lifeCycle, award, technicalWeight, priceMethod, technicalMethod, nigerianContent', 'the technical envelope, the commercial envelope of the passing bids, the ranking or the content preference, the award and every exclusion'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof T[name] === 'function', typeof T[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(T).filter((k) => typeof T[k] === 'function').length === EXPORTS.length,
  Object.keys(T).filter((k) => typeof T[k] === 'function').join(','));
w();
w('The stated constants, read from the exported `DEFAULTS`:');
w();
const DSRC = {
  TIE_DIGITS: ['the significant digits at which two figures tie', 'engine convention'],
  ARITHMETIC_TOLERANCE: ['the gap above which a bill line is in discrepancy when tolerance is left out (half a cent)', 'engine convention'],
  WEIGHT_SUM: ['what the criterion weights must sum to', 'engine convention (weights as percentages)'],
  WEIGHT_SUM_TOLERANCE: ['how far the weight sum may sit from 100', 'engine convention'],
  MAX_BIDS: ['the most bids one call accepts', 'cap'],
  MAX_CRITERIA: ['the most technical criteria accepted', 'cap'],
  MAX_LINES: ['the most bill lines a bid accepts', 'cap'],
  MAX_ITEMS: ['the most content items accepted', 'cap'],
  MAX_YEARS: ['the most life-cycle years accepted', 'cap'],
  MAX_ITERATIONS: ['the most Monte Carlo iterations accepted', 'cap'],
  HIGH_VALUE_USD: ['the estimated cost at or above which a contract is high value (US$)', 'WB Reg para 5.50'],
  NC_PRICE_MARGIN_PCT: ['the s.14 price group: within this percent of the lowest evaluated cost', 'NOGICD Act 2010 s.14'],
  NC_LEAD_PCT: ['the s.14 content lead: at least this much higher (points or relative, stated by the caller)', 'NOGICD Act 2010 s.14'],
  INDIGENOUS_MARGIN_PCT: ['the s.16 margin above the lowest', 'NOGICD Act 2010 s.16'],
  ALB_ABSOLUTE_PCT: ['the absolute ALB test: this percent or more below the cost estimate', 'WB ALB Guidance (2016) Stage 1'],
  ALB_RELATIVE_MIN_BIDS: ['the fewest substantially responsive bids for the relative ALB test', 'WB ALB Guidance (2016) Stage 1'],
};
table(['constant', 'value', 'what it sets', 'where it comes from'], Object.entries(D).map(([k, v]) => [`\`${k}\``, S(v), DSRC[k][0], DSRC[k][1]]));
must('DEFAULTS carries sixteen values, each described here', Object.keys(D).length === 16 && Object.keys(D).every((k) => DSRC[k]), Object.keys(D));
must('DEFAULTS is frozen', Object.isFrozen(D), 'frozen');
w();
const NCS = T.NC_SCHEDULE;
const NC_SECTIONS = [...new Set(Object.values(NCS).map((s) => s.section))];
w(`\`NC_SCHEDULE\` is also exported: ${Object.keys(NCS).length} lines of the Schedule to the Nigerian Oil and Gas Industry Content Development Act 2010, in ${NC_SECTIONS.length} of its sections (${list(NC_SECTIONS.map((s) => `${s}, ${Object.values(NCS).filter((x) => x.section === s).length} lines`))}), each with its minimum Nigerian content and its measured unit. \`NC_MEASURES\` lists the measured units the engine accepts: ${list(T.NC_MEASURES)}.`);
must('the Schedule carries 45 lines in three sections', Object.keys(NCS).length === 45 && NC_SECTIONS.length === 3, Object.keys(NCS).length);
must('NC_SCHEDULE is frozen', Object.isFrozen(NCS), 'frozen');
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports and its source:');
const IMPORTS = [...ENGINE_SRC.matchAll(/^import .* from \x27([^\x27]+)\x27;$/gm)].map((m) => m[1]);
must('the engine imports exactly lib/stats, the percentile convention, cashflow.ts, wellCost.js and afe.js', IMPORTS.join() === '../../lib/stats/stats.js,../../lib/conventions/percentile.js,../economics/cashflow.ts,../drilling/wellCost.js,../economics/afe.js', IMPORTS.join());
must('the engine source makes no network call, reads no clock and draws no unseeded random number', !/\bfetch\x28|XMLHttpRequest|\bimport\x28|require\x28|Math\.random|Date\.now|new Date\x28/.test(ENGINE_SRC), 'none');
w(`- Its imports are, in full: ${list(IMPORTS.map((p) => p.replace(/^(\.\.\/)+/, '')))}. It discounts through the canonical npv of engines/economics/cashflow.ts and samples through lib/stats; it carries no Monte Carlo or NPV code of its own.`);
w('- It applies no domestic preference margin, compares no amount in words against figures, computes no negotiation or best and final offer, splits no tender into lots and deducts nothing for the Nigerian Content Development Fund. ' + refCap('choices') + ' lists each with where it would come from.');
w('- It decides nothing a rule does not state. The pass mark, the weights, the technical weight, the price and technical scoring methods, the s.14 reading, the should-cost band and the Monte Carlo seed are inputs with no default, and a call without one is refused by name.');
must('ACCEPTED_KEYS carries one shape for every exported function', Object.keys(T.ACCEPTED_KEYS).sort().join() === EXPORTS.map((x) => x[0]).sort().join() && Object.isFrozen(T.ACCEPTED_KEYS), Object.keys(T.ACCEPTED_KEYS).join());
w(`- It reads no key it does not know. \`ACCEPTED_KEYS\` is exported with one shape for each of the ${EXPORTS.length} functions, and every call refuses an input key the function does not read, at every level, naming the key, its path and the accepted keys (${ref('refusals')} tables them). A misspelt optional key is refused; it never silently drops a term.`);
w(`- Its exported names are, in full: ${Object.keys(T).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('sources', 'The sources, their editions and the date each was read', ['Associate m01 l04', 'Professional m04', 'Expert m05 l01']);
w('THE RULE THIS COURSE FOLLOWS FOR EVERY LAW, REGULATION AND GUIDANCE IT TEACHES. Each one is named with its edition or gazette date and the date it was read. Only publicly available texts are quoted, with their citation. Every threshold, rate, margin and Schedule percentage the engine applies was read from the cited text and is cited to its section; a figure that could not be sourced is a stated input with no default. Every text below was read on 2026-09-26.');
w();
const SOURCES = [
  ['World Bank, Procurement Regulations for IPF Borrowers', 'Seventh Edition, September 2025', 'para 5.50 (Rated Criteria weighting matrix and the US$10 million high-value line), 5.69 and 5.70 (Most Advantageous Bid), 6.29 (two envelopes), Annex X paras 3.3 to 3.9', 'Seventh Edition, September 2025'],
  ['World Bank, Procurement Guidance: Evaluating Bids and Proposals (including use of Rated Criteria)', 'February 2025', 'the worked examples: Figures IX to XII, Annex 2 (minimum quality threshold), Annex 3 (comparative scoring)', 'February 2025 (file dated 4 Feb 2025)'],
  ['World Bank, Standard Procurement Document, Request for Bids, Works, two-envelope', 'September 2025', 'ITB 34.1 (an omitted item priced at the average), ITB 35.1 (arithmetic correction), Section III (time for completion adjustment; the combined evaluation formula)', 'SPD Request for Bids, Works, two-envelope (without SEA/SH disqualification)'],
  ['World Bank, Standard Procurement Document, Request for Bids, Goods, two-envelope', 'February 2025', 'ITB 34.1 and ITB 35.1 for goods', 'SPD Request for Bids, Goods, two-envelope'],
  ['World Bank, Procurement Guidance: Abnormally Low Bids and Proposals', 'Second Edition, July 2016', 'Stage 1 (the absolute and the relative approach) and Annex I Examples 1 and 2', 'Second Edition, July 2016'],
  ['Nigeria, Public Procurement Act 2007 (Act No. 14)', 'Official Gazette No. 65, Vol. 94, 19 June 2007', 's.24(3) (lowest evaluated responsive bid), s.31 (arithmetic errors, major and minor deviations), s.32(3) (omissions quantified), s.48 (separate envelopes), s.51(2) (prices compared only at or above the threshold)', 'Official Gazette No. 65, Vol. 94, Lagos, 19 June 2007'],
  ['Nigeria, Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2)', 'commenced 22 April 2010, as enacted', 's.11 and the Schedule (minimum Nigerian content and measured unit by item), s.14 (bids within 1% at the commercial stage), s.16 (an indigenous company within 10 percent)', 'commenced 22 April 2010'],
  ['Kiiver, P. and Kodym, J., Price-quality ratios in value-for-money awards, Journal of Public Procurement 15(3)', 'Fall 2015', 'the price-scoring families and their Table 1', 'Fall 2015'],
  ['Chen, T. H., An economic approach to public procurement, Journal of Public Procurement 8(3)', '2008', 'Score = 50 x L / P and its ranking paradox (p. 409)', 'Journal of Public Procurement 8(3)'],
];
table(['text', 'edition or date', 'what the engine reads from it', 'date read'], SOURCES.map(([t, e, u]) => [t, e, u, '2026-09-26']));
SOURCES.forEach(([t, , , frag]) => must(`FINDINGS records the edition of "${t}"`, FINDINGS.includes(frag), frag));
must('FINDINGS records every source as read on 2026-09-26', FINDINGS.includes('## Sources (all read 2026-09-26)'), 'read date');
w();
w('The engine carries its citations in its own words. Every `basis.source` a call below returns is one of these strings, quoted from the engine:');
w();
const band0 = success('weightingBand high risk for its source', T.weightingBand({ risk: 'high', estimatedCostUsd: 900000 }));
const tech0 = success('technicalEvaluation on the well services tender for its source', T.technicalEvaluation({ criteria: WS_CRIT, bids: WS_BIDS.map(techOf), passMark: WS.passMark }));
const ec0 = success('evaluatedCosts on the well services tender for its source', T.evaluatedCosts({ bids: WS_BIDS.filter((b) => tech0.passed.includes(b.id)).map(comOf), schedule: WS.schedule }));
const nc0 = success('nigerianContent on the well services tender for its source', T.nigerianContent(WS_NC_ARGS));
const alb0 = success('abnormallyLow on Annex I Example 2 for its source', T.abnormallyLow(PUB.albEx2));
const CITES = [
  ['the weighting band', band0.basis.source],
  ['the technical envelope', tech0.basis.source],
  ['the evaluated cost', ec0.basis.source],
  ['Nigerian content', nc0.basis.source],
  ['abnormally low bids', alb0.basis.source],
];
table(['call', 'the engine\'s basis.source, verbatim'], CITES);
must('every engine citation names an edition or a date', CITES.every(([, s]) => /20(07|10|16|25)/.test(s)), CITES.map((c) => c[1]).join(' // '));
w();
w('LICENSED TEXTS. No licensed text is quoted anywhere in this course. The materials tender\'s criteria name API 5CT, API 6D, API 10A and API 13A data sheets; these are paid standards, named by number as the bidders\' specification and never quoted. Model contracts sold under licence (for example the AIPN model contracts) are taught by concept only.');
w();
w('ONE LATER SOURCE IS NOT IN THE ENGINE. The Nigerian Content Development and Monitoring Board may set a level for an item the 2010 Schedule does not list (s.11(2)); no later Board target was read, so the engine carries the 2010 Schedule only and a later target enters as a user-stated target with its source (' + ref('content') + ').');

/* ============================================================ SECTION 3 */

section('dataset', 'The Ekene tenders, their bids and what is planted in them', ['Associate m01', 'Professional m01', 'Expert m04']);
w('Every bid in this course comes from two fixture files under test-data/supplychain/ekene-tender, written by a stated script that reproduces them byte for byte. Both are labelled SYNTHETIC in the file; the bidders are codes; the wells and depths follow the platform\'s Ekene field data.');
must('both fixture files carry their SYNTHETIC statement', [WS, MS].every((f) => typeof f.synthetic === 'string' && f.synthetic.startsWith('SYNTHETIC')), 'synthetic');
must('every bidder is named as synthetic', [...WS.bids, ...MS.bids].every((b) => /\(synthetic\)$/.test(b.name)), 'names');
w();
const tenderBlock = (F, crit) => {
  w(`TENDER ${F.tender} (fixture): ${F.title}.`);
  w();
  w(`Scope (fixture): ${F.scope}`);
  w();
  table(['criterion (fixture)', 'weight', 'maxScore', 'what it scores'], F.criteria.map((c) => [c.id, S(c.weight), S(c.maxScore), c.label]));
  must(`${F.tender} criterion weights sum to 100`, sum(crit.map((c) => c.weight)) === 100, sum(crit.map((c) => c.weight)));
  w();
  table(['bill item (fixture)', 'unit', 'what it prices'], F.items.map((i) => [i.id, i.unit, i.label]));
  w();
};
tenderBlock(WS, WS_CRIT);
w(`Stated in the fixture: pass mark ${WS.passMark}; completion schedule minWeeks ${WS.schedule.minWeeks}, maxWeeks ${WS.schedule.maxWeeks}, ratePerWeek ${WS.schedule.ratePerWeek}; omission rule ${WS.omissionRule}; award ${WS.award.basis} at technicalWeight ${WS.award.technicalWeight} with priceMethod ${WS.award.priceMethod} and technicalMethod ${WS.award.technicalMethod}; procurement risk ${WS.award.risk} and an estimated cost of US$${WS.award.estimatedCostUsd}; Nigerian content items ${list(WS.nc.items.map((i) => `${i.id} (Schedule line ${i.scheduleLine})`))}.`);
w();
const arith = (b) => success(`correctArithmetic on ${b.id}`, T.correctArithmetic({ lines: b.lines }));
table(['bid', 'received (UTC)', 'mandatory (fixture)', 'scores (fixture)', 'quoted total', 'weeks', 'discount', 'deviations', 'omitted', 'indigenous', 'capacity'],
  WS.bids.map((b) => [b.id, b.receivedAt, b.mandatory.map((m) => `${m.id} ${m.met ? 'met' : 'NOT met'}`).join('; '), Object.entries(b.scores).map(([k, v]) => `${k} ${v}`).join(', '),
    f6(arith(b).quotedTotal), S(b.completionWeeks), f6(b.discount || 0), (b.deviations || []).map((d) => `${d.id} ${f6(d.amount)}`).join('; ') || 'none', (b.omitted || []).join(', ') || 'none', S(b.indigenous), S(b.capacity)]));
w();
w('Each bid\'s quoted total is the sum of its quoted line amounts, returned by `correctArithmetic` as quotedTotal.');
w();
tenderBlock(MS, MS_CRIT);
w(`Stated in the fixture: pass mark ${MS.passMark}; delivery schedule minWeeks ${MS.schedule.minWeeks}, maxWeeks ${MS.schedule.maxWeeks}, ratePerWeek ${MS.schedule.ratePerWeek}; life cycle ${MS.lifeCycle.years} years at a discountRate of ${MS.lifeCycle.discountRate}; omission rule ${MS.omissionRule}; award ${MS.award.basis}; Nigerian content items ${list(MS.nc.items.map((i) => `${i.id} (Schedule line ${i.scheduleLine})`))}; content weights (fixture): ${MS.nc.weights}.`);
w();
table(['bid', 'received (UTC)', 'scores (fixture)', 'quoted total', 'weeks', `annual valve maintenance (years 1 to ${MS.lifeCycle.years})`, 'omitted', 'indigenous', 'capacity'],
  MS.bids.map((b) => [b.id, b.receivedAt, Object.entries(b.scores).map(([k, v]) => `${k} ${v}`).join(', '), f6(arith(b).quotedTotal), S(b.completionWeeks), b.annualCosts.map(f6).join(', '), (b.omitted || []).join(', ') || 'none', S(b.indigenous), S(b.capacity)]));
must('every materials bid meets both mandatory requirements', MS.bids.every((b) => b.mandatory.every((m) => m.met)), 'mandatory');
w();
w('Every materials bid meets both of its mandatory requirements (fixture).');
w();
// THE PLANTED SITUATIONS, each found by the engine behaviour named beside it.
const wsTech = tech0;
const wsCombined = success('evaluateTender on the well services tender, combined award', T.evaluateTender({ criteria: WS_CRIT, passMark: WS.passMark, bids: WS_BIDS, omissionRule: 'average', schedule: WS.schedule, award: 'combined', technicalWeight: WS.award.technicalWeight, priceMethod: WS.award.priceMethod, technicalMethod: WS.award.technicalMethod }));
const msNc = success('nigerianContent on the materials tender', T.nigerianContent(MS_NC_ARGS));
const ncPctOf = Object.fromEntries(msNc.bids.map((b) => [b.id, b.ncPct]));
const MS_BIDS_NC = MS_BIDS.map((b) => ({ ...b, ncPct: ncPctOf[b.id] }));
const msTender = (omissionRule, basis) => T.evaluateTender({ criteria: MS_CRIT, passMark: MS.passMark, bids: MS_BIDS_NC, omissionRule, schedule: MS.schedule, lifeCycle: MS.lifeCycle, award: 'lowest-cost', ...(basis ? { nigerianContent: { ncLeadBasis: basis } } : {}) });
const msAvg = success('evaluateTender on the materials tender, average rule, no content', msTender('average'));
const msHigh = success('evaluateTender on the materials tender, highest rule, no content', msTender('highest'));
const msPts = success('evaluateTender on the materials tender, content read as points', msTender('average', 'points'));
const msRel = success('evaluateTender on the materials tender, content read as relative', msTender('average', 'relative'));
const wsArith = Object.fromEntries(WS.bids.map((b) => [b.id, arith(b)]));
const PLANTED = [
  ['WS6 fails a mandatory requirement (signed-bid-form) and is excluded before scoring', 'technicalEvaluation status fail-mandatory', wsTech.bids.find((b) => b.id === 'WS6').status === 'fail-mandatory'],
  ['WS4 has the lowest quoted total of the six and fails the pass mark, so its price envelope is never opened', 'technicalEvaluation status fail-pass-mark; evaluateTender opens no commercial row for it', wsTech.bids.find((b) => b.id === 'WS4').status === 'fail-pass-mark' && !wsCombined.commercial.bids.some((b) => b.id === 'WS4') && WS.bids.every((b) => b.id === 'WS4' || wsArith[b.id].quotedTotal > wsArith.WS4.quotedTotal)],
  ['WS5 scores exactly the pass mark and passes', 'technicalEvaluation passes at the pass mark', wsTech.bids.find((b) => b.id === 'WS5').technicalPercent === WS.passMark && wsTech.passed.includes('WS5')],
  ['WS2 prices a line whose quantity times unit rate differs from the quoted amount; the unit rate prevails', 'correctArithmetic rule unit-rate-prevails', wsArith.WS2.lines.some((l) => l.rule === 'unit-rate-prevails')],
  ['WS2 carries a priced deviation (payment terms)', 'evaluatedCosts adds the deviation', wsCombined.commercial.bids.find((b) => b.id === 'WS2').deviationTotal > 0],
  ['WS5 typed its acid unit rate with the decimal point misplaced; the quoted amount governs', 'correctArithmetic rule total-governs', wsArith.WS5.lines.some((l) => l.rule === 'total-governs')],
  ['WS3 omits the nitrogen line; it is priced at the average of the other responsive bids', 'evaluatedCosts omission rule average', wsCombined.commercial.bids.find((b) => b.id === 'WS3').omissions.some((o) => o.item === 'nitrogen' && o.rule === 'average')],
  ['WS1 offers an unconditional discount', 'evaluatedCosts deducts it', wsCombined.commercial.bids.find((b) => b.id === 'WS1').discount > 0],
  ['the lowest evaluated cost (WS5) is not the bid with the highest combined score (WS3)', 'evaluateTender award against commercial.lowestEvaluatedCost', wsCombined.commercial.lowestEvaluatedCost === 'WS5' && wsCombined.award === 'WS3'],
  ['MS5 fails the materials pass mark', 'technicalEvaluation status fail-pass-mark', msAvg.technical.bids.find((b) => b.id === 'MS5').status === 'fail-pass-mark'],
  ['MS4 omits the inspection line and the omission rule decides the lowest evaluated cost (average: MS4; highest: MS2)', 'evaluatedCosts under the two rules', msAvg.award === 'MS4' && msHigh.award === 'MS2'],
  ['MS2 and MS4 sit within 1 percent of each other, so s.14 is engaged, and its reading decides the award (points: MS4 stands; relative: MS2 is selected)', 'contentPreference under the two readings', msPts.contentPreference.section14.engaged && msPts.award === 'MS4' && msRel.award === 'MS2'],
  ['MS3, an indigenous company with capacity, sits within 10 percent of the lowest evaluated cost', 'contentPreference section16', msRel.contentPreference.section16.some((x) => x.id === 'MS3' && x.withinMargin)],
];
table(['planted situation (fixture README)', 'found by'], PLANTED.map(([s, by]) => [s, by]));
PLANTED.forEach(([s, , ok]) => must(`planted: ${s}`, ok, s));
w();
w(`All ${PLANTED.length} planted situations are found by the engine behaviour named beside each (checked when this digest is built).`);
w();
w(`THE CONTRACTING AND SHOULD-COST INPUTS of the well services fixture (the same two-well programme) are tabled where they are used: the contract types in ${ref('contracts')}, the should-cost in ${ref('shouldcost')}.`);

/* ============================================================ SECTION 4 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m03', 'Associate m04', 'Associate m05', 'Professional m01', 'Professional m02', 'Professional m03', 'Professional m04', 'Professional m05', 'Professional m06', 'Expert m01', 'Expert m03', 'Expert m04', 'Expert m05']);
w('A refusal is an object with `error` and `field`. The message starts with the name of the field it refuses and states the exact condition that failed. Each row below is a stated bad input handed to the engine; the message is the engine\'s, verbatim. A result returned with a reason (a bid excluded, s.14 not engaged, a null lead) is a result. It is no refusal.');
w();
const wsPassed = WS_BIDS.filter((b) => wsTech.passed.includes(b.id)).map(comOf);
const EC_WS = { bids: wsPassed, schedule: WS.schedule };
const EC_MS = { bids: MS_BIDS.filter((b) => b.id !== 'MS5').map(comOf), schedule: MS.schedule, lifeCycle: MS.lifeCycle };
const RANK_WS = { technicalWeight: 0.7, priceMethod: 'lowest-ratio', technicalMethod: 'relative', bids: wsCombined.ranking.bids.map((b) => ({ id: b.id, technicalPercent: b.technicalPercent, evaluatedCost: b.evaluatedCost, receivedAt: b.receivedAt })) };
const PREF_MS = { ncLeadBasis: 'points', bids: msAvg.commercial.bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost, receivedAt: b.receivedAt, ncPct: ncPctOf[b.id], indigenous: MS.bids.find((x) => x.id === b.id).indigenous, capacity: true })) };
const CT_WS = (() => { const { note, ...rest } = clone(WS.contracting); return rest; })();
const SC_WS = (() => { const { note, ...rest } = clone(WS.shouldCost); return { ...rest, program: clone(WS.contracting.duration.program), bids: wsCombined.commercial.bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost })) }; })();
const TENDER_WS = { criteria: WS_CRIT, passMark: WS.passMark, bids: WS_BIDS, schedule: WS.schedule, award: 'combined', technicalWeight: 0.7, priceMethod: 'lowest-ratio', technicalMethod: 'relative' };
const TECH_WS = { criteria: WS_CRIT, bids: WS_BIDS.map(techOf), passMark: WS.passMark };
const ARITH = { lines: clone(WS.bids[1].lines) };
const PROBES = [
  ['weightingBand', 'risk stated as medium', { risk: 'medium', estimatedCostUsd: 900000 }, 'risk'],
  ['weightingBand', 'a negative estimated cost', { risk: 'high', estimatedCostUsd: -1 }, 'estimatedCostUsd'],
  ['weightingBand', 'a technical weight of 1.2', { risk: 'high', estimatedCostUsd: 900000, technicalWeight: 1.2 }, 'technicalWeight'],
  ['correctArithmetic', 'a negative tolerance', { ...ARITH, tolerance: -1 }, 'tolerance'],
  ['correctArithmetic', 'no lines', { lines: [] }, 'lines'],
  ['correctArithmetic', 'a line that is not an object', { lines: [5] }, 'lines[0]'],
  ['correctArithmetic', 'a line with no id', mut(ARITH, (a) => { a.lines[0].id = ''; }), 'lines[0].id'],
  ['correctArithmetic', 'a repeated line id', mut(ARITH, (a) => { a.lines[1].id = a.lines[0].id; }), 'lines[1].id'],
  ['correctArithmetic', 'a negative unit rate', mut(ARITH, (a) => { a.lines[0].unitRate = -1; }), 'lines[0].unitRate'],
  ['correctArithmetic', 'decimalMisplaced given as text', mut(ARITH, (a) => { a.lines[0].decimalMisplaced = 'yes'; }), 'lines[0].decimalMisplaced'],
  ['correctArithmetic', 'decimalMisplaced on a line of quantity 0', mut(ARITH, (a) => { a.lines[0].decimalMisplaced = true; a.lines[0].quantity = 0; }), 'lines[0].quantity'],
  ['correctArithmetic', 'a negative quoted total', { ...ARITH, quotedTotal: -5 }, 'quotedTotal'],
  ['technicalEvaluation', 'weights summing to 99', mut(TECH_WS, (a) => { a.criteria[0].weight = 29; }), 'criteria'],
  ['technicalEvaluation', 'a criterion weight of 0', mut(TECH_WS, (a) => { a.criteria[0].weight = 0; }), 'criteria[0].weight'],
  ['technicalEvaluation', 'a criterion maxScore of 0', mut(TECH_WS, (a) => { a.criteria[0].maxScore = 0; }), 'criteria[0].maxScore'],
  ['technicalEvaluation', 'no pass mark', mut(TECH_WS, (a) => { delete a.passMark; }), 'passMark'],
  ['technicalEvaluation', 'a pass mark of 101', { ...TECH_WS, passMark: 101 }, 'passMark'],
  ['technicalEvaluation', 'no bids', { ...TECH_WS, bids: [] }, 'bids'],
  ['technicalEvaluation', 'mandatory given as text', mut(TECH_WS, (a) => { a.bids[0].mandatory = 'all met'; }), 'bids[0].mandatory'],
  ['technicalEvaluation', 'a mandatory entry with no met flag', mut(TECH_WS, (a) => { a.bids[0].mandatory = [{ id: 'bid-security' }]; }), 'bids[0].mandatory[0]'],
  ['technicalEvaluation', 'no scores', mut(TECH_WS, (a) => { delete a.bids[0].scores; }), 'bids[0].scores'],
  ['technicalEvaluation', 'a score above the maxScore', mut(TECH_WS, (a) => { a.bids[0].scores.methodology = 5; }), 'bids[0].scores.methodology'],
  ['technicalEvaluation', 'a missing score', mut(TECH_WS, (a) => { delete a.bids[0].scores.hse; }), 'bids[0].scores.hse'],
  ['evaluatedCosts', 'omission rule lowest', { ...EC_WS, omissionRule: 'lowest' }, 'omissionRule'],
  ['evaluatedCosts', 'a negative tolerance', { ...EC_WS, tolerance: -1 }, 'tolerance'],
  ['evaluatedCosts', 'bestEstimates given as a list', { ...EC_WS, bestEstimates: [] }, 'bestEstimates'],
  ['evaluatedCosts', 'a negative best estimate', { ...EC_WS, bestEstimates: { nitrogen: -1 } }, 'bestEstimates.nitrogen'],
  ['evaluatedCosts', 'a schedule given as a number', { ...EC_WS, schedule: 6 }, 'schedule'],
  ['evaluatedCosts', 'a negative minWeeks', { ...EC_WS, schedule: { ...WS.schedule, minWeeks: -1 } }, 'schedule.minWeeks'],
  ['evaluatedCosts', 'maxWeeks below minWeeks', { ...EC_WS, schedule: { ...WS.schedule, maxWeeks: 5 } }, 'schedule.maxWeeks'],
  ['evaluatedCosts', 'a ratePerWeek of 2', { ...EC_WS, schedule: { ...WS.schedule, ratePerWeek: 2 } }, 'schedule.ratePerWeek'],
  ['evaluatedCosts', 'a life cycle given as a number', { ...EC_MS, lifeCycle: 5 }, 'lifeCycle'],
  ['evaluatedCosts', 'a life cycle of 0 years', { ...EC_MS, lifeCycle: { ...MS.lifeCycle, years: 0 } }, 'lifeCycle.years'],
  ['evaluatedCosts', 'a discount rate of -1', { ...EC_MS, lifeCycle: { ...MS.lifeCycle, discountRate: -1 } }, 'lifeCycle.discountRate'],
  ['evaluatedCosts', 'a receipt time without its zone', mut(EC_WS, (a) => { a.bids[0].receivedAt = '2027-02-10 09:12'; }), 'bids[0].receivedAt'],
  ['evaluatedCosts', 'a negative discount', mut(EC_WS, (a) => { a.bids[0].discount = -15000; }), 'bids[0].discount'],
  ['evaluatedCosts', 'deviations given as text', mut(EC_WS, (a) => { a.bids[1].deviations = 'payment terms'; }), 'bids[1].deviations'],
  ['evaluatedCosts', 'a deviation with no amount', mut(EC_WS, (a) => { delete a.bids[1].deviations[0].amount; }), 'bids[1].deviations[0]'],
  ['evaluatedCosts', 'omitted given as text', mut(EC_WS, (a) => { a.bids[2].omitted = 'nitrogen'; }), 'bids[2].omitted'],
  ['evaluatedCosts', 'an item both omitted and priced', mut(EC_WS, (a) => { a.bids[0].omitted = ['mob']; }), 'bids[0].omitted'],
  ['evaluatedCosts', 'an omitted item listed twice', mut(EC_WS, (a) => { a.bids[2].omitted = ['nitrogen', 'nitrogen']; }), 'bids[2].omitted'],
  ['evaluatedCosts', 'an empty rejection reason', mut(EC_WS, (a) => { a.bids[0].rejected = ''; }), 'bids[0].rejected'],
  ['evaluatedCosts', 'no completion weeks with a schedule', mut(EC_WS, (a) => { delete a.bids[0].completionWeeks; }), 'bids[0].completionWeeks'],
  ['evaluatedCosts', 'four annual costs in a five-year life cycle', mut(EC_MS, (a) => { a.bids[0].annualCosts = a.bids[0].annualCosts.slice(1); }), 'bids[0].annualCosts'],
  ['evaluatedCosts', 'a residual value given as text', mut(EC_MS, (a) => { a.bids[0].residualValue = 'scrap'; }), 'bids[0].residualValue'],
  ['evaluatedCosts', 'an omitted item no other responsive bid prices', mut(EC_WS, (a) => { a.bids[2].omitted = ['nitrogen']; a.bids.forEach((b, i) => { if (i !== 2) b.rejected = 'stated rejection for the probe'; }); }), 'bestEstimates.nitrogen'],
  ['rankTender', 'no technical weight', mut(RANK_WS, (a) => { delete a.technicalWeight; }), 'technicalWeight'],
  ['rankTender', 'price method mean-deviation', { ...RANK_WS, priceMethod: 'mean-deviation' }, 'priceMethod'],
  ['rankTender', 'no technical method', mut(RANK_WS, (a) => { delete a.technicalMethod; }), 'technicalMethod'],
  ['rankTender', 'a technical percent of 120', mut(RANK_WS, (a) => { a.bids[0].technicalPercent = 120; }), 'bids[0].technicalPercent'],
  ['rankTender', 'an evaluated cost of 0', mut(RANK_WS, (a) => { a.bids[0].evaluatedCost = 0; }), 'bids[0].evaluatedCost'],
  ['rankTender', 'every bid rejected', mut(RANK_WS, (a) => { a.bids.forEach((b) => { b.rejected = 'stated rejection for the probe'; }); }), 'bids'],
  ['rankTender', 'every technical percent 0 with the relative method', mut(RANK_WS, (a) => { a.bids.forEach((b) => { b.technicalPercent = 0; }); }), 'bids'],
  ['nigerianContent', 'no items', { ...MS_NC_ARGS, items: [] }, 'items'],
  ['nigerianContent', 'a Schedule line the engine does not hold', mut(MS_NC_ARGS, (a) => { a.items[0].scheduleLine = 'casing-and-tubing'; }), 'items[0].scheduleLine'],
  ['nigerianContent', 'a stated target with no percentage', mut(MS_NC_ARGS, (a) => { a.items[0] = { id: 'casing', measure: 'tonnage', source: 'stated for the probe' }; }), 'items[0].targetPct'],
  ['nigerianContent', 'a stated target in an unknown unit', mut(MS_NC_ARGS, (a) => { a.items[0] = { id: 'casing', targetPct: 60, measure: 'kilograms', source: 'stated for the probe' }; }), 'items[0].measure'],
  ['nigerianContent', 'a stated target with no source', mut(MS_NC_ARGS, (a) => { a.items[0] = { id: 'casing', targetPct: 60, measure: 'tonnage' }; }), 'items[0].source'],
  ['nigerianContent', 'a bid with no items', mut(MS_NC_ARGS, (a) => { delete a.bids[0].items; }), 'bids[0].items'],
  ['nigerianContent', 'a bid missing one item', mut(MS_NC_ARGS, (a) => { delete a.bids[0].items.casing; }), 'bids[0].items.casing'],
  ['nigerianContent', 'valves reported by tonnage', mut(MS_NC_ARGS, (a) => { a.bids[0].items.valves.measure = 'tonnage'; }), 'bids[0].items.valves.measure'],
  ['nigerianContent', 'a total of 0', mut(MS_NC_ARGS, (a) => { a.bids[0].items.casing.total = 0; }), 'bids[0].items.casing.total'],
  ['nigerianContent', 'more Nigerian tonnes than the total', mut(MS_NC_ARGS, (a) => { a.bids[0].items.casing.nigerian = 181; }), 'bids[0].items.casing.nigerian'],
  ['nigerianContent', 'mixed units and no weights', mut(MS_NC_ARGS, (a) => { delete a.bids[0].weights; }), 'bids[0].weights'],
  ['nigerianContent', 'a negative weight', mut(MS_NC_ARGS, (a) => { a.bids[0].weights.casing = -1; }), 'bids[0].weights.casing'],
  ['nigerianContent', 'every weight 0', mut(MS_NC_ARGS, (a) => { Object.keys(a.bids[0].weights).forEach((k) => { a.bids[0].weights[k] = 0; }); }), 'bids[0].weights'],
  ['contentPreference', 'no s.14 reading', mut(PREF_MS, (a) => { delete a.ncLeadBasis; }), 'ncLeadBasis'],
  ['contentPreference', 'an evaluated cost of 0', mut(PREF_MS, (a) => { a.bids[0].evaluatedCost = 0; }), 'bids[0].evaluatedCost'],
  ['contentPreference', 'a content of 101', mut(PREF_MS, (a) => { a.bids[0].ncPct = 101; }), 'bids[0].ncPct'],
  ['contentPreference', 'a receipt time without its zone', mut(PREF_MS, (a) => { a.bids[0].receivedAt = '2027-03-03'; }), 'bids[0].receivedAt'],
  ['contentPreference', 'indigenous given as text', mut(PREF_MS, (a) => { a.bids[0].indigenous = 'yes'; }), 'bids[0].indigenous'],
  ['contractTypes', 'no iterations', mut(CT_WS, (a) => { delete a.iterations; }), 'iterations'],
  ['contractTypes', 'no seed', mut(CT_WS, (a) => { delete a.seed; }), 'seed'],
  ['contractTypes', 'a negative NPT fraction', mut(CT_WS, (a) => { a.duration.nptFrac = -0.1; }), 'duration.nptFrac'],
  ['contractTypes', 'an activity the wellCost engine refuses', mut(CT_WS, (a) => { a.duration.program[0].durationHr = -48; }), 'duration.program'],
  ['contractTypes', 'a duration with min above mode', { ...CT_WS, duration: { min: 16, mode: 14, max: 20 } }, 'duration'],
  ['contractTypes', 'a negative duration minimum', { ...CT_WS, duration: { min: -1, mode: 14, max: 20 } }, 'duration.min'],
  ['contractTypes', 'a daily cost given as text', { ...CT_WS, dailyCost: 'forty thousand' }, 'dailyCost'],
  ['contractTypes', 'a negative fixed cost', { ...CT_WS, fixedCost: -1 }, 'fixedCost'],
  ['contractTypes', 'no lump sum', mut(CT_WS, (a) => { delete a.lumpSum; }), 'lumpSum'],
  ['contractTypes', 'a day rate with no mobilisation fee', { ...CT_WS, dayRate: { rate: 50000 } }, 'dayRate'],
  ['contractTypes', 'both a fee fraction and a fixed fee', { ...CT_WS, reimbursable: { feeFraction: 0.12, fixedFee: 90000 } }, 'reimbursable'],
  ['contractTypes', 'a fee fraction of 2', { ...CT_WS, reimbursable: { feeFraction: 2 } }, 'reimbursable.feeFraction'],
  ['contractTypes', 'a negative fixed fee', { ...CT_WS, reimbursable: { fixedFee: -1 } }, 'reimbursable.fixedFee'],
  ['contractTypes', 'a plan with no daily cost', { ...CT_WS, plan: { days: 14 } }, 'plan'],
  ['shouldCost', 'no band', mut(SC_WS, (a) => { delete a.band; }), 'band'],
  ['shouldCost', 'a band whose low is above its high', { ...SC_WS, band: { low: 1.25, high: 0.8 } }, 'band'],
  ['shouldCost', 'an empty programme', { ...SC_WS, program: [] }, 'program'],
  ['shouldCost', 'cost items that give an estimate of 0', { ...SC_WS, items: [{ id: 'nothing', label: 'stated for the probe', basis: 'lump', value: 0, category: 'tangible' }], contingencyFrac: 0 }, 'items'],
  ['shouldCost', 'partners given as text', { ...SC_WS, partners: 'EK-B and EK-C' }, 'partners'],
  ['shouldCost', 'a negative evaluated cost', mut(SC_WS, (a) => { a.bids[0].evaluatedCost = -1; }), 'bids[0].evaluatedCost'],
  ['abnormallyLow', 'four bids and no cost estimate', mut(PUB.albEx2, (a) => { delete a.estimate; }), 'estimate'],
  ['abnormallyLow', 'sixteen bids and a negative estimate', { ...PUB.albEx1, estimate: -1 }, 'estimate'],
  ['abnormallyLow', 'an evaluated cost of 0', mut(PUB.albEx2, (a) => { a.bids[0].evaluatedCost = 0; }), 'bids[0].evaluatedCost'],
  ['evaluateTender', 'no award basis', mut(TENDER_WS, (a) => { delete a.award; }), 'award'],
  ['evaluateTender', 'Nigerian content with a combined award', { ...TENDER_WS, nigerianContent: { ncLeadBasis: 'points' } }, 'nigerianContent'],
  ['evaluateTender', 'Nigerian content given as text with a lowest-cost award', { ...TENDER_WS, award: 'lowest-cost', nigerianContent: 'points' }, 'nigerianContent'],
  ['evaluateTender', 'the well services tender under a lowest-cost award with Nigerian content, where bids[4] (WS5) has no ncPct', { ...TENDER_WS, award: 'lowest-cost', nigerianContent: { ncLeadBasis: 'points' } }, 'bids[4].ncPct'],
  ['evaluateTender', 'criteria weights summing to 99', mut(TENDER_WS, (a) => { a.criteria[0].weight = 29; }), 'criteria'],
  ['evaluatedCosts', 'lifecycle spelt with a small c', { ...EC_MS, lifecycle: MS.lifeCycle, lifeCycle: undefined }, 'lifecycle'],
  ['evaluatedCosts', 'a bid carrying its technical scores', mut(EC_WS, (a) => { a.bids[0].scores = { methodology: 4 }; }), 'bids[0].scores'],
  ['evaluatedCosts', 'a bill line with a key the engine does not read', mut(EC_WS, (a) => { a.bids[0].lines[0].unitPrice = 1; }), 'bids[0].lines[0].unitPrice'],
  ['evaluatedCosts', 'a best estimate for an item no bid omits', { ...EC_WS, bestEstimates: { mob: 100000 } }, 'bestEstimates.mob'],
  ['evaluatedCosts', 'a schedule key spelt maxWeek', { ...EC_WS, schedule: { minWeeks: 6, maxWeek: 10, ratePerWeek: 0.005 } }, 'schedule.maxWeek'],
  ['technicalEvaluation', 'a score for a criterion the tender does not have', mut(TECH_WS, (a) => { a.bids[0].scores.price = 3; }), 'bids[0].scores.price'],
  ['technicalEvaluation', 'a bid carrying its bill', mut(TECH_WS, (a) => { a.bids[0].lines = []; }), 'bids[0].lines'],
  ['nigerianContent', 'a content item the tender does not list', mut(MS_NC_ARGS, (a) => { a.bids[0].items.pipe = { measure: 'tonnage', nigerian: 1, total: 2 }; }), 'bids[0].items.pipe'],
  ['contentPreference', 'the reading passed as ncBasis', mut(PREF_MS, (a) => { a.ncBasis = 'points'; }), 'ncBasis'],
  ['contractTypes', 'an NPT triangle with min above mode', mut(CT_WS, (a) => { a.duration.nptFrac = { min: 0.2, mode: 0.15, max: 0.6 }; }), 'duration.nptFrac'],
  ['contractTypes', 'a daily cost triangle with min above mode', { ...CT_WS, dailyCost: { min: 45000, mode: 42000, max: 55000 } }, 'dailyCost'],
  ['contractTypes', 'an activity key spelt durationHrs', mut(CT_WS, (a) => { a.duration.program[0].durationHrs = 48; delete a.duration.program[0].durationHr; }), 'duration.program[0].durationHrs'],
  ['shouldCost', 'a band key spelt lo', { ...SC_WS, band: { lo: 0.8, high: 1.25 } }, 'band.lo'],
  ['evaluateTender', 'a key the engine does not read, domesticPreference', { ...TENDER_WS, domesticPreference: { marginPct: 15 } }, 'domesticPreference'],
];
const REFUSED = PROBES.map(([fn, what, args, field]) => {
  const r = refusal(`${fn}: ${what}`, T[fn](clone(args)), field);
  return [`\`${fn}\``, what, `\`${field}\``, r && r.error];
});
table(['function', 'stated bad input', 'field', 'the engine\'s message, verbatim'], REFUSED);
const byFn = {};
PROBES.forEach(([fn]) => { byFn[fn] = (byFn[fn] || 0) + 1; });
w();
w(`${PROBES.length} refusals across ${Object.keys(byFn).length} functions: ${list(Object.entries(byFn).map(([k, v]) => `${k} ${v}`))}.`);
must('every exported function has at least one refusal tabled', EXPORTS.every(([n]) => byFn[n] > 0), JSON.stringify(byFn));
must('no refusal message carries an em or en dash', REFUSED.every((r) => !/[–—]/.test(r[3])), 'dash');
w();
w('Three rules the table shows:');
w('- A field with no default is refused when it is missing, and the message says there is no default: the pass mark, the technical weight, the price and technical methods, the s.14 reading, the award basis, the Monte Carlo seed and the should-cost band.');
w('- `mean-deviation` is refused by name. The engine scores price by `lowest-ratio` or `linear` only (' + ref('honest') + ' says why).');
w('- An input key a function does not read is refused at whatever level it sits (a top-level option, a bid, a bill line, a schedule, an activity, a band), with the path to the key and the full list of accepted keys; a key that is an id (a score, a content item, a best estimate) is checked against the ids the call carries. A key present with no value counts as absent.');
w('- Every triangle (the days, the NPT fraction, the daily cost) is refused in one wording, with the figures it was given.');
w('- An error in an imported engine is passed through with the name of that engine: an activity wellCost refuses reaches the learner as `duration.program` with the wellCost message after the colon.');
const ctProg = T.contractTypes(mut(CT_WS, (a) => { a.duration.program[0].durationHr = -48; }));
must('the wellCost pass-through names wellCost', /is refused by engines\/drilling\/wellCost\.js: /.test(ctProg.error), ctProg.error);

/* ============================================================ SECTION 5 */

section('graded', 'What is graded, where the practicals run, and what is never graded', ['Associate m01 l05', 'Expert m06']);
w('EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED INPUTS. A capstone field, a question key and a panel figure are each computed by a function in the table of ' + ref('computes') + ' on bids, criteria and settings that are written down in advance. The same inputs give the same number on any machine, so there is exactly one right answer.');
w();
w('THE PRACTICALS RUN IN THE COURSE\'S OWN CALCULATOR PANELS. This is an engine course with no Suite app. Each tier has a calculator panel that calls this same vendored engine: the envelope calculator (Associate), the award calculator (Professional) and the contract calculator (Expert). A learner types or pastes their own bids, criteria and settings; the panel prints what the engine returns, every refusal in the engine\'s own words, and the reasons beside each figure.');
w();
w('THE ONE RANDOM DRAW IS SEEDED. The contract-type comparison samples the duration and the daily cost through lib/stats mulberry32 on a stated seed and a stated iteration count, so a seed and an iteration count name its result exactly:');
// the stated iteration count of the determinism demonstration
const IT_SHORT = 200;
const ctA = T.contractTypes(clone({ ...CT_WS, iterations: IT_SHORT }));
const ctB = T.contractTypes(clone({ ...CT_WS, iterations: IT_SHORT }));
const ctC = T.contractTypes(clone({ ...CT_WS, iterations: IT_SHORT, seed: CT_WS.seed + 1 }));
must('the same seed gives the same result, bit for bit', JSON.stringify(ctA) === JSON.stringify(ctB), 'same');
must('the next seed gives a different mean day-rate cost', ctA.types.dayRate.companyCost.mean !== ctC.types.dayRate.companyCost.mean, `${ctA.types.dayRate.companyCost.mean} ${ctC.types.dayRate.companyCost.mean}`);
w();
table(['run (stated)', 'seed', 'iterations', 'day rate: mean company cost'], [
  ['first', S(CT_WS.seed), S(IT_SHORT), f6(ctA.types.dayRate.companyCost.mean)],
  ['second, same inputs', S(CT_WS.seed), S(IT_SHORT), f6(ctB.types.dayRate.companyCost.mean)],
  ['the next seed', S(CT_WS.seed + 1), S(IT_SHORT), f6(ctC.types.dayRate.companyCost.mean)],
]);
w();
w('The first two runs return the same object in every field (checked); the third differs.');
w();
w('WHAT A CAPSTONE STATES. Each capstone runs its own synthetic tender, which this digest does not print, and states every setting a figure depends on: the pass mark, the weights, the omission rule, the schedule, the life cycle, the award basis, the technical weight, the price and technical methods, the s.14 reading, the seed and the iteration count, the band. Each graded figure is quoted to six decimals as the panel prints it.');
w();
w('WHAT A COMPUTED FIGURE DOES NOT SAY. An evaluated cost ranks bids under stated rules; it is not a forecast of what the job will cost. A combined score depends on the technical weight and the scoring methods chosen. A Nigerian content percentage is measured in the unit the Schedule names for that item. An s.14 outcome depends on the reading of "at least 5% higher", which the Act does not settle (' + ref('s14') + '). Each figure is quoted with its settings for that reason.');

/* ============================================================ SECTION 6 */

section('technical', 'The technical envelope: mandatory requirements, weights, the technical percentage and the pass mark', ['Associate m02', 'Associate m01 l02']);
w(`THE RULE, in the engine's basis: ${wsTech.basis.score}. ${wsTech.basis.passMark[0].toUpperCase()}${wsTech.basis.passMark.slice(1)}. A bid that fails a mandatory requirement is excluded before it is scored. Source (engine): ${wsTech.basis.source}.`);
must('the technical basis names the percentage rule', /technicalPercent = sum of weight x score \/ maxScore/.test(wsTech.basis.score), wsTech.basis.score);
w();
w(`THE WELL SERVICES TENDER, pass mark ${WS.passMark} (fixture). Each term is weight x score / maxScore (derived from the fixture scores; the engine returns only the sum, and the sum of the terms is checked against it):`);
w();
const termRow = (b, crit, r) => {
  const terms = crit.map((c) => (c.weight * b.scores[c.id]) / c.maxScore);
  if (r.technicalPercent !== null) must(`${b.id}: the terms sum to the engine's technicalPercent`, nearly(sum(terms), r.technicalPercent), `${sum(terms)} ${r.technicalPercent}`);
  return terms;
};
table(['bid', ...WS_CRIT.map((c) => `${c.id} (w ${c.weight})`), 'technicalPercent', 'weightedPoints', 'status'],
  WS.bids.map((b) => {
    const r = wsTech.bids.find((x) => x.id === b.id);
    const terms = termRow(b, WS_CRIT, r);
    return [b.id, ...terms.map((t) => (r.status === 'fail-mandatory' ? 'not scored' : f6(t))), f6(r.technicalPercent), f6(r.weightedPoints), r.status];
  }));
w();
w('The engine\'s reason for each bid it does not pass, verbatim:');
wsTech.bids.filter((b) => b.reason).forEach((b) => quote(`${b.id}: ${b.reason}`));
must('WS6 is not scored', wsTech.bids.find((b) => b.id === 'WS6').technicalPercent === null, 'null');
must('WS5 sits exactly on the pass mark and passes', wsTech.bids.find((b) => b.id === 'WS5').technicalPercent === 70 && wsTech.bids.find((b) => b.id === 'WS5').status === 'pass', 'WS5');
w();
w(`Passed (engine, in input order): ${list(wsTech.passed)}. WS5 scores ${f6(wsTech.bids.find((b) => b.id === 'WS5').technicalPercent)}, exactly the pass mark, and passes: a bid passes AT the pass mark. WS6 is not scored at all, so its row carries no technical percentage.`);
w();
w(`WEIGHTED POINTS are the sum of weight x score, the total the World Bank Guidance prints in its Figure IX (on the well services scale, scores ${0} to ${WS_CRIT[0].maxScore}, the maximum is ${WS_CRIT.reduce((t, c) => t + c.weight * c.maxScore, 0)}, derived). The technical percentage divides each term by its maxScore, so the two carry the same order.`);
w();
const msTech = success('technicalEvaluation on the materials tender', T.technicalEvaluation({ criteria: MS_CRIT, bids: MS_BIDS.map(techOf), passMark: MS.passMark }));
w(`THE MATERIALS TENDER, pass mark ${MS.passMark} (fixture):`);
w();
table(['bid', ...MS_CRIT.map((c) => `${c.id} (w ${c.weight})`), 'technicalPercent', 'weightedPoints', 'status'],
  MS.bids.map((b) => {
    const r = msTech.bids.find((x) => x.id === b.id);
    const terms = termRow(b, MS_CRIT, r);
    return [b.id, ...terms.map(f6), f6(r.technicalPercent), f6(r.weightedPoints), r.status];
  }));
w();
msTech.bids.filter((b) => b.reason).forEach((b) => quote(`${b.id}: ${b.reason}`));
w();
const fig9 = success('technicalEvaluation on Guidance Figure IX', T.technicalEvaluation(clone(PUB.figIX)));
w(`THE WORLD BANK GUIDANCE, FIGURE IX (stated from the source: four criteria weighted ${list(PUB.figIX.criteria.map((c) => c.weight))}, scored 0 to ${PUB.figIX.criteria[0].maxScore}; Company A scores ${list(Object.values(PUB.figIX.bids[0].scores))}; the Guidance prints a weighted score of ${PUB.figIXPrinted}):`);
w();
table(['company', 'weightedPoints (engine)', 'technicalPercent (engine)', 'the Guidance prints'], [['A', f6(fig9.bids[0].weightedPoints), f6(fig9.bids[0].technicalPercent), S(PUB.figIXPrinted)]]);
must('Figure IX: the engine returns the printed weighted points', fig9.bids[0].weightedPoints === PUB.figIXPrinted, fig9.bids[0].weightedPoints);
w();
const an2 = success('technicalEvaluation on Guidance Annex 2', T.technicalEvaluation(clone(PUB.annex2)));
w(`THE WORLD BANK GUIDANCE, ANNEX 2, a minimum quality threshold (stated from the source: three criteria scored in points out of ${list(PUB.annex2.criteria.map((c) => c.maxScore))}, threshold ${PUB.annex2.passMark}). With weights equal to the maximum points, the technical percentage equals the points total:`);
w();
table(['company', 'scores (source)', 'technicalPercent (engine)', 'status (engine)'], PUB.annex2.bids.map((b) => {
  const r = an2.bids.find((x) => x.id === b.id);
  return [b.id, Object.values(b.scores).join(' + '), f6(r.technicalPercent), r.status];
}));
must('Annex 2: A 59, B 77, C 91 on the printed scores', ['A', 'B', 'C'].map((id) => an2.bids.find((x) => x.id === id).technicalPercent).join() === '59,77,91', an2.bids.map((b) => b.technicalPercent).join());
w();
w(`On its printed criterion scores Company B totals ${f6(an2.bids.find((x) => x.id === 'B').technicalPercent)} and falls below the threshold with Company A. The Guidance itself prints B's total differently; ${ref('honest')} reads that erratum.`);
w();
w('MANDATORY REQUIREMENTS come first. A bid with any requirement not met is excluded with every failed requirement named, and is not scored. Two failed requirements (stated: bid-security and signed-bid-form both not met on WS1):');
const twoFail = success('technicalEvaluation with two failed requirements', T.technicalEvaluation(mut(TECH_WS, (a) => { a.bids[0].mandatory = [{ id: 'bid-security', met: false }, { id: 'signed-bid-form', met: false }]; })));
quote(`WS1: ${twoFail.bids[0].reason}`);
must('two failed requirements are both named', /requirements bid-security, signed-bid-form/.test(twoFail.bids[0].reason), twoFail.bids[0].reason);

/* ============================================================ SECTION 7 */

section('arithmetic', 'Arithmetic correction: quantity times unit rate, the unit rate prevailing and a misplaced decimal point', ['Associate m03']);
w(`THE RULE, in the engine's basis (default tolerance): ${arith(WS.bids[0]).basis.rule}. Source (engine): ${arith(WS.bids[0]).basis.source}. The Public Procurement Act 2007 s.31(4) permits the correction; the tolerance ${D.ARITHMETIC_TOLERANCE} (half a cent) is an engine convention, stated.`);
w();
table(['bid', 'quoted total', 'lines corrected', 'corrected total', 'correction'], WS.bids.map((b) => { const r = wsArith[b.id]; return [b.id, f6(r.quotedTotal), S(r.linesCorrected), f6(r.correctedTotal), f6(r.correction)]; }));
must('only WS2 and WS5 carry a discrepancy', WS.bids.filter((b) => wsArith[b.id].linesCorrected > 0).map((b) => b.id).join() === 'WS2,WS5', 'WS2,WS5');
w();
const lineRow = (bid, lid) => { const l = wsArith[bid].lines.find((x) => x.id === lid); return [bid, lid, f6(l.quantity), f6(l.unitRate), f6(l.quotedAmount), f6(l.correctedUnitRate), f6(l.correctedAmount), l.rule]; };
table(['bid', 'line', 'quantity', 'unit rate', 'quoted amount', 'corrected unit rate', 'corrected amount', 'rule'], [lineRow('WS2', 'ct-spread'), lineRow('WS5', 'acid')]);
w();
w('The engine\'s reasons, verbatim:');
quote(`WS2: ${wsArith.WS2.reasons[0]}`);
quote(`WS5: ${wsArith.WS5.reasons[0]}`);
must('WS2 corrects its amount upward and the corrected total rises', wsArith.WS2.correction > 0, wsArith.WS2.correction);
must('WS5 keeps its total: the quoted amount governs', wsArith.WS5.correction === 0 && wsArith.WS5.linesCorrected === 1, wsArith.WS5.correction);
w();
w(`WS2 quoted ${f6(wsArith.WS2.lines.find((l) => l.id === 'ct-spread').quotedAmount)} for the coiled tubing spread where ${wsArith.WS2.lines.find((l) => l.id === 'ct-spread').quantity} x ${wsArith.WS2.lines.find((l) => l.id === 'ct-spread').unitRate} is ${f6(wsArith.WS2.lines.find((l) => l.id === 'ct-spread').correctedAmount)}: the unit rate prevails and its total rises by ${f6(wsArith.WS2.correction)}. WS5 typed its acid rate as ${wsArith.WS5.lines.find((l) => l.id === 'acid').unitRate} where its amount, ${f6(82800)}, implies ${f6(wsArith.WS5.lines.find((l) => l.id === 'acid').correctedUnitRate)}; the line carries decimalMisplaced true, so the quoted amount governs, the unit rate is corrected and the total does not move.`);
w();
w('WHO SETS THE FLAG. ITB 35.1(a) makes the exception turn on the opinion of the Employer: the decimal point is obviously misplaced when the Employer judges it so. The engine does not judge it. It reads decimalMisplaced as an input on the bill line, which the evaluator records once that judgement is made; the Ekene fixture records it on WS5\'s acid line. A line with no gap is not corrected whatever the flag says (below).');
must('the WS5 fixture flags its acid line decimalMisplaced', WS.bids[4].lines.find((l) => l.id === 'acid').decimalMisplaced === true, 'flag');
w();
// stated: one line of quantity 1 at each rate, quoted 100
const TOL_PROBE = { tolerance: 0.5, quoted: 100, rates: [100.5, 100.75] };
w(`THE TOLERANCE, at its boundary (stated lines, stated tolerance ${TOL_PROBE.tolerance}):`);
const tolLine = (rate) => ({ lines: [{ id: 'x', quantity: 1, unitRate: rate, quotedAmount: TOL_PROBE.quoted }], tolerance: TOL_PROBE.tolerance });
const tolEq = success('correctArithmetic gap equal to the tolerance', T.correctArithmetic(tolLine(TOL_PROBE.rates[0])));
const tolAbove = success('correctArithmetic gap above the tolerance', T.correctArithmetic(tolLine(TOL_PROBE.rates[1])));
table(['quantity x unit rate (stated)', 'quoted (stated)', 'gap (derived)', 'tolerance', 'corrected amount (engine)', 'rule (engine)'], [tolEq, tolAbove].map((r, i) => [`1 x ${TOL_PROBE.rates[i]}`, S(TOL_PROBE.quoted), S(TOL_PROBE.rates[i] - TOL_PROBE.quoted), S(TOL_PROBE.tolerance), f6(r.lines[0].correctedAmount), S(r.lines[0].rule)]));
must('a gap equal to the tolerance is not corrected', tolEq.lines[0].rule === null && tolAbove.lines[0].rule === 'unit-rate-prevails', `${tolEq.lines[0].rule} ${tolAbove.lines[0].rule}`);
w();
w('A gap EQUAL to the tolerance is not a discrepancy; only a gap above it is corrected.');
w();
// the stated total handed in with WS1's lines
const QT_PROBE = 940000;
const qtMis = success('correctArithmetic with a quoted total that differs from its lines', T.correctArithmetic({ lines: clone(WS.bids[0].lines), quotedTotal: QT_PROBE }));
w(`THE QUOTED TOTAL. A bid whose stated total (stated: ${QT_PROBE} on WS1's lines) differs from the sum of its own lines is corrected to the sum of the corrected lines: the subtotals prevail. The engine's reason, verbatim:`);
quote(qtMis.reasons[0]);
w(`Its corrected total is ${f6(qtMis.correctedTotal)} and its correction ${f6(qtMis.correction)}.`);
must('the subtotals prevail over a stated total', qtMis.correctedTotal === 943200 && /the subtotals prevail/.test(qtMis.reasons[0]), qtMis.correctedTotal);
w();
// stated
const DEC_PROBE = { id: 'x', quantity: 60, unitRate: 1380, quotedAmount: 82800, decimalMisplaced: true };
const decNo = success('correctArithmetic decimalMisplaced with no discrepancy', T.correctArithmetic({ lines: [clone(DEC_PROBE)] }));
must('a decimalMisplaced flag on a line with no discrepancy changes nothing', decNo.linesCorrected === 0 && decNo.lines[0].rule === null, decNo.linesCorrected);
w(`A decimalMisplaced flag on a line with no discrepancy changes nothing (stated: ${DEC_PROBE.quantity} x ${DEC_PROBE.unitRate} quoted as ${DEC_PROBE.quotedAmount} with the flag set; the engine corrects ${decNo.linesCorrected} lines).`);
w();
w('WORDS AGAINST FIGURES (ITB 35.1(c), where an amount in words differs from the amount in figures) is not computed by the engine; the course teaches it as a concept.');

/* ============================================================ SECTION 8 */

section('evaluated', 'The evaluated cost: corrected price, discount, priced deviations, omissions at the average and completion time', ['Associate m04']);
const wsEc = wsCombined.commercial;
w(`THE RULE, in the engine's basis: evaluatedCost = ${wsEc.basis.evaluatedCost}. Source (engine): ${wsEc.basis.source}.`);
must('the evaluated cost basis is the stated sum', wsEc.basis.evaluatedCost === 'corrected price - discount + priced deviations + omissions + schedule adjustment + life-cycle cost', wsEc.basis.evaluatedCost);
w();
w(`THE WELL SERVICES TENDER, the ${wsEc.bids.length} bids that passed the technical envelope, omission rule average, schedule minWeeks ${WS.schedule.minWeeks}, maxWeeks ${WS.schedule.maxWeeks}, ratePerWeek ${WS.schedule.ratePerWeek} (fixture). Evaluated cost ascending:`);
w();
table(['rank', 'bid', 'quoted total', 'corrected price', 'discount', 'deviations', 'omissions', 'schedule adjustment', 'evaluated cost'],
  wsEc.bids.map((b) => [S(b.rank), b.id, f6(b.quotedTotal), f6(b.correctedPrice), f6(b.discount), f6(b.deviationTotal), f6(b.omissionTotal), f6(b.scheduleAdjustment), f6(b.evaluatedCost)]));
wsEc.bids.forEach((b) => must(`${b.id}: the evaluated cost is the stated sum of its terms`, nearly(b.evaluatedCost, b.correctedPrice - b.discount + b.deviationTotal + b.omissionTotal + b.scheduleAdjustment + b.lifeCycleCost), b.evaluatedCost));
must('WS5 has the lowest evaluated cost', wsEc.lowestEvaluatedCost === 'WS5', wsEc.lowestEvaluatedCost);
w();
w(`Lowest evaluated cost (engine): ${wsEc.lowestEvaluatedCost}. Each row is the sum of its terms (checked).`);
w();
w('Every reason the engine returns for these bids, verbatim, in the order it returns them:');
wsEc.bids.forEach((b) => b.reasons.forEach((r) => quote(`${b.id}: ${r}`)));
w();
const ws3 = wsEc.bids.find((b) => b.id === 'WS3');
const nitroOthers = wsEc.bids.filter((b) => b.id !== 'WS3').map((b) => [b.id, wsArith[b.id].lines.find((l) => l.id === 'nitrogen').correctedAmount]);
w(`AN OMITTED ITEM AT THE AVERAGE. WS3 prices no nitrogen line. The other responsive bids price it at (corrected amounts, engine): ${list(nitroOthers.map(([id, v]) => `${id} ${f6(v)}`))}. Their average, which the engine adds to WS3, is ${f6(ws3.omissions[0].amount)}.`);
must('the omission is the average of the other responsive bids\' corrected amounts', nearly(ws3.omissions[0].amount, sum(nitroOthers.map((x) => x[1])) / nitroOthers.length), ws3.omissions[0].amount);
must('WS4, which failed the technical envelope, does not price the omission', !nitroOthers.some(([id]) => id === 'WS4'), 'WS4');
w();
w(`Only responsive bids price an omission: WS4 quotes a nitrogen line too, but its price envelope is never opened, so its figure is not in the average. A bid never prices its own omission. The engine's omission basis: ${wsEc.basis.omission}.`);
w();
w(`COMPLETION TIME. The engine's schedule basis: ${wsEc.basis.schedule}. The adjustment is ratePerWeek x the weeks beyond minWeeks x (corrected price - discount). No credit is given for completion before minWeeks.`);
must('the schedule basis names no credit rule through its reasons', wsEc.bids.find((b) => b.id === 'WS1').scheduleReason.includes('no credit for earlier completion'), wsEc.bids.find((b) => b.id === 'WS1').scheduleReason);
w();
w(`THE RANKING. The engine's ranking basis: ${wsEc.basis.ranking}. No two evaluated costs here tie (tieBrokenBy is null on every row).`);
must('no tie decides the well services order', wsEc.bids.every((b) => b.tieBrokenBy === null), 'no ties');
w();
w(`A PRICED DEVIATION is a minor deviation quantified in money (Public Procurement Act 2007 s.31(14)); a major deviation rejects the bid (s.31(7)) and is passed to the engine as a stated rejection reason. The omission rule 'highest' is also accepted by the engine; ${ref('honest')} reads it.`);
w();
// stated: WS2 carries a rejection reason, and WS1 offers 11 weeks against maxWeeks 10
const REJ_REASON = 'major deviation: the stated rejection reason for this example';
const LATE_WEEKS = 11;
const ecX = success('evaluatedCosts with WS2 rejected and WS1 late', T.evaluatedCosts({ ...clone(EC_WS), bids: clone(EC_WS.bids).map((b) => (b.id === 'WS2' ? { ...b, rejected: REJ_REASON } : b.id === 'WS1' ? { ...b, completionWeeks: LATE_WEEKS } : b)) }));
w(`TWO COMMERCIAL-STAGE EXCLUSIONS (stated: WS2 given the rejection reason "${REJ_REASON}", and WS1 offering ${LATE_WEEKS} weeks against the fixture's maxWeeks ${WS.schedule.maxWeeks}; everything else as the fixture). The exclusions, verbatim from the engine:`);
w();
table(['excluded bid', 'stage', 'reason (engine), verbatim'], ecX.excluded.map((x) => [x.id, x.stage, x.reason]));
must('a stated rejection reason becomes a commercial exclusion carrying the stated words, and a late bid is excluded at the commercial stage', ecX.excluded.length === 2 && ecX.excluded.every((x) => x.stage === 'commercial') && ecX.excluded.find((x) => x.id === 'WS2').reason === REJ_REASON && /beyond the maximum 10 weeks; the bid is nonresponsive/.test(ecX.excluded.find((x) => x.id === 'WS1').reason), JSON.stringify(ecX.excluded));
const ws3X = ecX.bids.find((b) => b.id === 'WS3');
w();
w(`A stated rejection reason is carried into the exclusion as the reason, word for word. The omission is priced again over the bids still responsive after these exclusions: WS5 alone now quotes nitrogen, so WS3's omission is priced at ${f6(ws3X.omissions[0].amount)} and its evaluated cost becomes ${f6(ws3X.evaluatedCost)} (engine). The engine's omission reason, verbatim:`);
quote(`WS3: ${ws3X.omissions[0].reason}`);
must('the omission is re-priced from WS5 alone', ws3X.omissions[0].amount === 33600 && /the 1 price quoted/.test(ws3X.omissions[0].reason), ws3X.omissions[0].reason);

/* ============================================================ SECTION 9 */

section('combined', 'The combined score: the commercial score, the relative technical score and their weights', ['Associate m05', 'Professional m02']);
const wsRank = wsCombined.ranking;
w(`THE RULE, in the engine's basis: ${wsRank.basis.combined}, where ${wsRank.basis.technical} and ${wsRank.basis.commercial}. Source (engine): ${wsRank.basis.source}.`);
const TW = WS.award.technicalWeight;
// the decimal a reader expects for 1 less the technical weight
const CW_DECIMAL = 0.3;
must('the combined basis prints the commercial weight as the double 1 - 0.7', wsRank.basis.combined === `B = ${TW} x St + ${1 - TW} x Sc` && 1 - TW !== CW_DECIMAL, wsRank.basis.combined);
w();
w(`The engine prints the commercial weight as ${1 - TW}: it computes 1 - ${TW} in binary floating point and prints the shortest decimal of the double it holds. That double is not the double ${CW_DECIMAL} (checked).`);
w();
w(`THE WELL SERVICES TENDER, technical weight ${WS.award.technicalWeight}, priceMethod lowest-ratio, technicalMethod relative (fixture). Thigh ${f6(wsRank.tHigh)}, Cmin ${f6(wsRank.cMin)}, Cmax ${f6(wsRank.cMax)} (engine):`);
w();
table(['rank', 'bid', 'technicalPercent T', 'evaluated cost C', 'St = 100 x T / Thigh', 'Sc = 100 x Cmin / C', 'B combined'],
  wsRank.bids.map((b) => [S(b.rank), b.id, f6(b.technicalPercent), f6(b.evaluatedCost), f6(b.technicalScore), f6(b.commercialScore), f6(b.combinedScore)]));
wsRank.bids.forEach((b) => must(`${b.id}: B is the weighted sum`, nearly(b.combinedScore, TW * b.technicalScore + (1 - TW) * b.commercialScore), b.combinedScore));
must('WS3 is the most advantageous', wsRank.mostAdvantageous === 'WS3', wsRank.mostAdvantageous);
w();
w(`Most advantageous (engine): ${wsRank.mostAdvantageous}. The bid with the highest technical percentage scores St 100; the bid with the lowest evaluated cost scores Sc 100.`);
must('the top technical bid scores St 100 and the lowest cost Sc 100', wsRank.bids.find((b) => b.technicalPercent === wsRank.tHigh).technicalScore === 100 && wsRank.bids.find((b) => b.evaluatedCost === wsRank.cMin).commercialScore === 100, 'St Sc');
w();
const fx = success('rankTender on Guidance Figures X to XII', T.rankTender(clone(PUB.figX)));
w(`THE WORLD BANK GUIDANCE, FIGURES X TO XII (stated from the source: technical weight ${PUB.figX.technicalWeight}, the cost taking the rest; five companies, E rejected as an abnormally low bid; technical points on the Guidance's scoring scale entered as percentages, of which only T / Thigh matters). The Guidance prints its figures to two decimals; the engine's are exact:`);
w();
table(['rank', 'company', `${PUB.figX.technicalWeight} x St (engine)`, 'the Guidance prints', 'Sc (engine)', 'the Guidance prints', 'B (engine)', 'the Guidance prints'],
  fx.bids.map((b) => [S(b.rank), b.id, f6(PUB.figX.technicalWeight * b.technicalScore), S(PUB.figXPrinted.technicalWeighted[b.id]), f6(b.commercialScore), S(PUB.figXPrinted.commercial[b.id]), f6(b.combinedScore), S(PUB.figXPrinted.combined[b.id])]));
must('Figures X to XII: the engine ranks D, C, B, A as the Guidance does', fx.bids.map((b) => b.id).join() === 'D,C,B,A', fx.bids.map((b) => b.id).join());
// the Guidance prints to two decimals
const PRINT_STEP = 0.01;
must('every printed Guidance figure is within 0.01 of the engine figure', fx.bids.every((b) => Math.abs(b.combinedScore - PUB.figXPrinted.combined[b.id]) <= PRINT_STEP + 1e-12), 'within');
w();
w(`The ranking agrees: ${list(fx.bids.map((b) => b.id))}. E is excluded with the reason stated for it (engine): ${fx.excluded[0].reason}. Every printed combined figure is within ${PRINT_STEP} of the engine's, and ${ref('honest')} reads where each printed figure is truncated or rounded.`);
w();
const a3t = success('technicalEvaluation on Guidance Annex 3', T.technicalEvaluation(clone(PUB.annex3Tech)));
const a3 = success('rankTender on Guidance Annex 3', T.rankTender(clone(PUB.annex3)));
w(`THE WORLD BANK GUIDANCE, ANNEX 3 (stated from the source: technical weight ${PUB.annex3.technicalWeight}, the financial score taking the rest). Weighted points (engine): A ${f6(a3t.bids[0].weightedPoints)}, B ${f6(a3t.bids[1].weightedPoints)}. Combined (engine) against the Guidance's printed figures:`);
w();
table(['company', 'St (engine)', 'Sc (engine)', 'B (engine)', 'the Guidance prints'], a3.bids.map((b) => [b.id, f6(b.technicalScore), f6(b.commercialScore), f6(b.combinedScore), S(PUB.annex3Printed[b.id])]));
must('Annex 3: A wins, 94.375 exactly', a3.mostAdvantageous === 'A' && a3.bids[0].combinedScore === 94.375 && Math.floor(a3.bids[0].combinedScore * 100) / 100 === PUB.annex3Printed.A, a3.bids[0].combinedScore);
w();
w(`A wins on both. The engine's A is ${f6(a3.bids[0].combinedScore)}; the Guidance prints ${PUB.annex3Printed.A}, two decimals of that figure with the third dropped (checked).`);

/* ============================================================ SECTION 10 */

section('award', 'Reading an award: the most advantageous bid, the tie-break and every exclusion', ['Associate m06', 'Expert m04 l01']);
w(`THE WHOLE WELL SERVICES TENDER IN ONE CALL (evaluateTender, award combined, the fixture settings). The engine's stages basis: ${wsCombined.basis.stages}.`);
w();
w(`Award (engine): ${wsCombined.award}. Reason (engine): ${wsCombined.reason}. Award source (engine): ${wsCombined.basis.award}.`);
w();
table(['excluded bid', 'stage', 'the engine\'s reason, verbatim'], wsCombined.excluded.map((x) => [x.id, x.stage, x.reason]));
must('two bids are excluded, both at the technical stage', wsCombined.excluded.length === 2 && wsCombined.excluded.every((x) => x.stage === 'technical'), JSON.stringify(wsCombined.excluded));
w();
const wsLow = success('evaluateTender on the well services tender, lowest-cost award', T.evaluateTender({ ...clone(TENDER_WS), award: 'lowest-cost' }));
w(`THE SAME TENDER UNDER A LOWEST-COST AWARD: award (engine) ${wsLow.award}; reason (engine): ${wsLow.reason}. The two awards differ because the combined score weighs the technical percentage at ${WS.award.technicalWeight}: WS3 carries the highest technical percentage and the fourth-lowest evaluated cost.`);
must('the two award bases pick different bids', wsLow.award === 'WS5' && wsCombined.award === 'WS3', `${wsLow.award} ${wsCombined.award}`);
must('WS3 is fourth by evaluated cost', wsEc.bids.find((b) => b.id === 'WS3').rank === 4, wsEc.bids.find((b) => b.id === 'WS3').rank);
w();
const tieBids = [
  { id: 'T3', technicalPercent: 80, evaluatedCost: 500000, receivedAt: '2027-05-01T10:00:00Z' },
  { id: 'T1', technicalPercent: 80, evaluatedCost: 500000, receivedAt: '2027-05-01T09:00:00Z' },
  { id: 'T2', technicalPercent: 80, evaluatedCost: 500000, receivedAt: '2027-05-01T09:00:00Z' },
];
w(`THE TIE-BREAK, stated once for every ranking: the lower evaluated cost, then the earlier receipt time, then the bidder id. Three stated bids with the same technical percentage (${tieBids[0].technicalPercent}) and the same evaluated cost (${tieBids[0].evaluatedCost}), so the same combined score:`);
const tie = success('rankTender on three tied bids', T.rankTender({ bids: clone(tieBids), technicalWeight: 0.7, priceMethod: 'lowest-ratio', technicalMethod: 'relative' }));
w();
table(['rank (engine)', 'bid', 'received (stated)', 'combined score', 'tieBrokenBy (engine)'], tie.bids.map((b) => [S(b.rank), b.id, b.receivedAt, f6(b.combinedScore), S(b.tieBrokenBy)]));
must('the tie goes to the earlier receipt, then the id', tie.bids.map((b) => b.id).join() === 'T1,T2,T3' && tie.bids[1].tieBrokenBy === 'bidder id' && tie.bids[2].tieBrokenBy === 'earlier receipt', tie.bids.map((b) => `${b.id}:${b.tieBrokenBy}`).join());
w();
w('T1 and T2 were received at the same second, so the bidder id decides them; T3 was received later. tieBrokenBy names the rule that ordered each row against the row above it (null on the first row). ' + refCap('boundaries') + ' shows two figures that differ only past the twelfth significant digit, which tie.');
// stated
const TIE_COST = { bids: [{ id: 'U2', technicalPercent: 100, evaluatedCost: 1000, receivedAt: '2027-05-01T09:00:00Z' }, { id: 'U1', technicalPercent: 50, evaluatedCost: 500, receivedAt: '2027-05-01T10:00:00Z' }], technicalWeight: 0.5, priceMethod: 'lowest-ratio', technicalMethod: 'relative' };
const tieCost = success('rankTender on two bids tied on the combined score with different costs', T.rankTender(clone(TIE_COST)));
w();
w(`When the combined scores tie and the evaluated costs differ, the lower evaluated cost ranks first (stated: ${TIE_COST.bids.map((b) => `${b.id} with T ${b.technicalPercent} and C ${b.evaluatedCost}`).join(', ')}, technical weight ${TIE_COST.technicalWeight}, both score ${f6(tieCost.bids[0].combinedScore)}): the engine ranks ${list(tieCost.bids.map((b) => b.id))}, tieBrokenBy "${tieCost.bids[1].tieBrokenBy}".`);
const T3_AT = '2027-05-01T08:00:00Z';
const T8 = success('rankTender with T3 received at 08:00', T.rankTender({ bids: clone(tieBids).map((b) => (b.id === 'T3' ? { ...b, receivedAt: T3_AT } : b)), technicalWeight: 0.7, priceMethod: 'lowest-ratio', technicalMethod: 'relative' }));
w();
w(`Received at ${T3_AT.slice(11, 16)} instead (stated: T3's receipt moved to ${T3_AT}), T3 ranks first: the engine ranks ${list(T8.bids.map((b) => b.id))}, with tieBrokenBy ${list(T8.bids.slice(1).map((b) => `"${b.tieBrokenBy}"`))}.`);
must('T3 at 08:00 ranks first, then T1 and T2 by id', T8.bids.map((b) => b.id).join() === 'T3,T1,T2' && T8.bids[1].tieBrokenBy === 'earlier receipt' && T8.bids[2].tieBrokenBy === 'bidder id', T8.bids.map((b) => `${b.id}:${b.tieBrokenBy}`).join());
w();
const ENDS = [0, 1].map((tw) => [tw, success(`rankTender at technical weight ${tw}`, T.rankTender({ ...clone(RANK_WS), technicalWeight: tw }))]);
w('THE TWO ENDS OF THE TECHNICAL WEIGHT (stated: 0 and 1, the fixture\'s lowest-ratio and relative methods), engine:');
w();
table(['technical weight', 'most advantageous', 'its combined score'], ENDS.map(([tw, r]) => [S(tw), r.mostAdvantageous, f6(r.bids[0].combinedScore)]));
must('weight 0 gives the lowest evaluated cost, weight 1 the top technical bid', ENDS[0][1].mostAdvantageous === 'WS5' && ENDS[1][1].mostAdvantageous === 'WS3', ENDS.map(([, r]) => r.mostAdvantageous).join());
w();
const wsX = success('evaluateTender with WS2 rejected and WS1 late', T.evaluateTender({ ...clone(TENDER_WS), bids: clone(TENDER_WS.bids).map((b) => (b.id === 'WS2' ? { ...b, rejected: REJ_REASON } : b.id === 'WS1' ? { ...b, completionWeeks: LATE_WEEKS } : b)) }));
w(`THE AWARD AFTER THE TWO COMMERCIAL EXCLUSIONS of ${ref('evaluated')} (WS2 rejected, WS1 late): award (engine) ${wsX.award}. WS3's evaluated cost is ${f6(wsX.commercial.bids.find((b) => b.id === 'WS3').evaluatedCost)} with its omission re-priced, and its combined score ${f6(wsX.ranking.bids.find((b) => b.id === 'WS3').combinedScore)} against WS5's ${f6(wsX.ranking.bids.find((b) => b.id === 'WS5').combinedScore)}: the award stays WS3, and WS3's own figures move.`);
must('the award stays WS3 with its figures moved', wsX.award === 'WS3' && wsX.ranking.bids.length === 2 && wsX.ranking.bids.find((b) => b.id === 'WS3').combinedScore !== wsRank.bids.find((b) => b.id === 'WS3').combinedScore, wsX.award);
must('equal combined scores go to the lower evaluated cost', tieCost.bids[0].id === 'U1' && tieCost.bids[1].tieBrokenBy === 'lower evaluated cost' && tieCost.bids[0].combinedScore === tieCost.bids[1].combinedScore, tieCost.bids.map((b) => b.id).join());

/* ============================================================ SECTION 11 */

section('lifecycle', 'The lowest evaluated cost over the life of the asset: life-cycle cost through the canonical NPV', ['Professional m01']);
const msEc = msAvg.commercial;
w(`AN AWARD WITHOUT RATED CRITERIA goes to the lowest evaluated cost (engine award source: ${msAvg.basis.award}). The materials tender is scored technically against its pass mark, and the bids that pass are ranked on evaluated cost alone.`);
w();
w(`THE LIFE-CYCLE COST, in the engine's basis: ${msEc.basis.lifeCycle}.`);
must('the life-cycle basis names the canonical npv', /through engines\/economics\/cashflow\.ts npv/.test(msEc.basis.lifeCycle), msEc.basis.lifeCycle);
w();
w(`THE MATERIALS TENDER, the ${msEc.bids.length} bids that passed, omission rule average, delivery schedule minWeeks ${MS.schedule.minWeeks}, maxWeeks ${MS.schedule.maxWeeks}, ratePerWeek ${MS.schedule.ratePerWeek}, life cycle ${MS.lifeCycle.years} years at ${MS.lifeCycle.discountRate} (fixture). Evaluated cost ascending:`);
w();
table(['rank', 'bid', 'corrected price', 'omissions', 'schedule adjustment', 'life-cycle cost', 'evaluated cost'],
  msEc.bids.map((b) => [S(b.rank), b.id, f6(b.correctedPrice), f6(b.omissionTotal), f6(b.scheduleAdjustment), f6(b.lifeCycleCost), f6(b.evaluatedCost)]));
must('MS4 has the lowest evaluated cost under the average rule', msEc.lowestEvaluatedCost === 'MS4', msEc.lowestEvaluatedCost);
w();
w(`Lowest evaluated cost (engine): ${msEc.lowestEvaluatedCost}. The engine's delivery-time reasons, verbatim:`);
msEc.bids.forEach((b) => quote(`${b.id}: ${b.scheduleReason}`));
w(`The schedule basis, verbatim: ${msEc.basis.schedule}.`);
const MS_LATE = 15;
const msL = success('evaluatedCosts on the materials tender with MS4 at 15 weeks', T.evaluatedCosts({ ...clone(EC_MS), bids: clone(EC_MS.bids).map((b) => (b.id === 'MS4' ? { ...b, completionWeeks: MS_LATE } : b)) }));
w(`A bid beyond maxWeeks is excluded before any adjustment (stated: MS4 offering ${MS_LATE} weeks against maxWeeks ${MS.schedule.maxWeeks}); the exclusion, verbatim:`);
quote(`MS4: ${msL.excluded[0].reason}`);
must('MS4 at 15 weeks is excluded at the commercial stage', msL.excluded.length === 1 && msL.excluded[0].id === 'MS4' && msL.excluded[0].stage === 'commercial', JSON.stringify(msL.excluded));
w();
const DF = [1, 2, 3, 4, 5].map((t) => 1 / (1 + MS.lifeCycle.discountRate) ** t);
w(`THE DISCOUNTING, year by year. Each year's cost is discounted to the award date at the end of its year: factor 1 / (1 + ${MS.lifeCycle.discountRate}) raised to the year (derived, stated arithmetic):`);
w();
table(['year', 'factor (derived)', 'MS4 valve maintenance (fixture)', 'discounted (derived)'], DF.map((d, i) => [S(i + 1), f6(d), f6(7000), f6(7000 * d)]));
const ms4 = msEc.bids.find((b) => b.id === 'MS4');
must('the derived discounted sum is the engine\'s MS4 life-cycle cost', nearly(sum(DF.map((d) => 7000 * d)), ms4.lifeCycleCost), `${sum(DF.map((d) => 7000 * d))} ${ms4.lifeCycleCost}`);
w();
w(`The five discounted figures sum to the engine's MS4 life-cycle cost, ${f6(ms4.lifeCycleCost)} (checked). The engine does not discount the award price: the price is paid at the start, and only the annual costs of years 1 to ${MS.lifeCycle.years} are discounted.`);
w();
const msNoLc = success('evaluatedCosts on the materials tender without a life cycle', T.evaluatedCosts({ bids: clone(EC_MS.bids), schedule: MS.schedule }));
w('THE SAME BIDS WITHOUT A LIFE CYCLE (the same call with lifeCycle left out):');
w();
table(['rank', 'bid', 'evaluated cost without the life cycle', 'with it'], msNoLc.bids.map((b) => [S(b.rank), b.id, f6(b.evaluatedCost), f6(msEc.bids.find((x) => x.id === b.id).evaluatedCost)]));
must('the order is the same with and without the life cycle on this tender', msNoLc.bids.map((b) => b.id).join() === msEc.bids.map((b) => b.id).join(), msNoLc.bids.map((b) => b.id).join());
w();
w(`On this tender the order is the same both ways (checked); the life cycle adds between ${f6(Math.min(...msEc.bids.map((b) => b.lifeCycleCost)))} and ${f6(Math.max(...msEc.bids.map((b) => b.lifeCycleCost)))} to a bid, and the gap between MS4 and MS2 narrows from ${f6(msNoLc.bids[1].evaluatedCost - msNoLc.bids[0].evaluatedCost)} to ${f6(msEc.bids[1].evaluatedCost - msEc.bids[0].evaluatedCost)} (derived, second row less first).`);
must('the gap narrows with the life cycle', msEc.bids[1].evaluatedCost - msEc.bids[0].evaluatedCost < msNoLc.bids[1].evaluatedCost - msNoLc.bids[0].evaluatedCost && msNoLc.bids[0].id === 'MS4' && msNoLc.bids[1].id === 'MS2', 'gap');
w();
const RV_PROBE = { lifeCycle: { years: 3, discountRate: 0.08 }, bids: [
  { id: 'R1', receivedAt: '2027-06-01T09:00:00Z', lines: [{ id: 'unit', quantity: 1, unitRate: 20000, quotedAmount: 20000 }], annualCosts: [1500, 1500, 1500], residualValue: 4000 },
  { id: 'R2', receivedAt: '2027-06-01T10:00:00Z', lines: [{ id: 'unit', quantity: 1, unitRate: 20000, quotedAmount: 20000 }], annualCosts: [1500, 1500, 1500] },
] };
const rv = success('evaluatedCosts with a residual value', T.evaluatedCosts(clone(RV_PROBE)));
const RVY = RV_PROBE.lifeCycle.years; const RVR = RV_PROBE.lifeCycle.discountRate; const RVV = RV_PROBE.bids[0].residualValue;
const r1 = rv.bids.find((b) => b.id === 'R1'); const r2 = rv.bids.find((b) => b.id === 'R2');
w(`RESIDUAL VALUE is credited in the last year. Two stated bids, identical but for a residual value of ${RVV} on R1 (life cycle ${RVY} years at ${RVR}; annual costs ${RV_PROBE.bids[0].annualCosts[0]} a year):`);
w();
table(['bid', 'life-cycle cost (engine)', 'evaluated cost (engine)'], [[r1.id, f6(r1.lifeCycleCost), f6(r1.evaluatedCost)], [r2.id, f6(r2.lifeCycleCost), f6(r2.evaluatedCost)]]);
must('the residual value lowers the life-cycle cost by its value discounted three years', nearly(r2.lifeCycleCost - r1.lifeCycleCost, RVV / (1 + RVR) ** RVY), r2.lifeCycleCost - r1.lifeCycleCost);
w();
w(`The difference, ${f6(r2.lifeCycleCost - r1.lifeCycleCost)} (derived), is ${RVV} / ${1 + RVR}^${RVY}: the residual value is taken off year ${RVY}'s cost before discounting (checked).`);
w();
w(`THE OMISSION ON THIS TENDER. MS4 omits the inspection line. The other responsive bids price it (fixture): ${list(msEc.bids.filter((b) => b.id !== 'MS4').map((b) => `${b.id} ${f6(MS.bids.find((x) => x.id === b.id).lines.find((l) => l.id === 'inspection').quotedAmount)}`))}; MS5 failed the pass mark and does not price it. The average the engine adds: ${f6(ms4.omissions[0].amount)}. The omission rule decides this award; ${ref('whole')} runs the same tender under the other rule the engine accepts.`);
must('the MS4 omission is the average of MS1, MS2 and MS3', nearly(ms4.omissions[0].amount, sum(msEc.bids.filter((b) => b.id !== 'MS4').map((b) => MS.bids.find((x) => x.id === b.id).lines.find((l) => l.id === 'inspection').quotedAmount)) / 3) && ms4.omissions[0].rule === 'average', ms4.omissions[0].amount);

/* ============================================================ SECTION 12 */

section('band', 'The Rated Criteria weighting band, linear price scoring and the ranking paradox', ['Professional m02']);
const bandRow = (risk, cost, tw) => success(`weightingBand ${risk} ${cost} ${tw}`, T.weightingBand({ risk, estimatedCostUsd: cost, ...(tw === undefined ? {} : { technicalWeight: tw }) }));
const BIG = 12000000;
const SMALL = WS.award.estimatedCostUsd;
const cells = [['high', BIG], ['high', SMALL], ['low', BIG], ['low', SMALL]].map(([r, c]) => [r, c, bandRow(r, c)]);
w(`THE MATRIX of the World Bank Procurement Regulations para 5.50: the weight of the Rated Criteria depends on the procurement risk and on whether the contract is high value (stated estimated costs: US$${BIG} and US$${SMALL}):`);
w();
table(['risk (stated)', 'estimated cost (stated)', 'cell (engine)', 'high value (engine)', 'weighting range (engine)', 'the engine\'s rule, verbatim'], cells.map(([r, c, b]) => [r, S(c), b.cell, S(b.highValue), `${f6(b.min)} to ${f6(b.max)}`, b.basis.rule]));
must('the four cells are a, b, c, d', cells.map((x) => x[2].cell).join() === 'a,b,c,d', cells.map((x) => x[2].cell).join());
w();
const at10 = bandRow('low', D.HIGH_VALUE_USD); const below10 = bandRow('low', D.HIGH_VALUE_USD - 1);
w(`THE HIGH-VALUE LINE. At exactly US$${D.HIGH_VALUE_USD} a contract is high value (cell ${at10.cell}); at US$${D.HIGH_VALUE_USD - 1} it is not (cell ${below10.cell}).`);
must('the high-value line is inclusive', at10.highValue === true && below10.highValue === false, `${at10.highValue} ${below10.highValue}`);
w();
const inB = bandRow('high', WS.award.estimatedCostUsd, WS.award.technicalWeight);
const EDGE_TW = 0.5;
const OUT_TW = 0.35;
const edge = bandRow('high', BIG, EDGE_TW);
const outB = bandRow('low', SMALL, OUT_TW);
w('A STATED TECHNICAL WEIGHT against its range (both ends inside). The engine\'s reasons, verbatim:');
table(['risk', 'estimated cost', 'technical weight (stated)', 'within band (engine)', 'reason (engine)'], [
  ['high', S(WS.award.estimatedCostUsd), S(WS.award.technicalWeight), S(inB.withinBand), inB.reason],
  ['high', S(BIG), S(EDGE_TW), S(edge.withinBand), edge.reason],
  ['low', S(SMALL), S(OUT_TW), S(outB.withinBand), outB.reason],
]);
must('the well services weight 0.7 is inside cell b, 0.5 sits on the edge of a, 0.35 is outside d', inB.withinBand && inB.cell === 'b' && edge.withinBand && !outB.withinBand, `${inB.withinBand} ${edge.withinBand} ${outB.withinBand}`);
w();
w(`The well services tender (high risk, US$${SMALL}, technical weight ${TW}) sits inside its cell.`);
w();
const lin = success('rankTender on the well services tender, linear price scoring', T.rankTender({ ...clone(RANK_WS), priceMethod: 'linear' }));
w(`LINEAR PRICE SCORING. The engine's second price method, 'linear', scores ${lin.basis.commercial.replace(/^Sc = /, 'Sc = ')}; source (engine): ${lin.basis.source}. On the well services bids (everything else as the fixture):`);
w();
table(['rank', 'bid', 'Sc lowest-ratio', 'Sc linear', 'B lowest-ratio', 'B linear'], lin.bids.map((b) => { const o = wsRank.bids.find((x) => x.id === b.id); return [S(b.rank), b.id, f6(o.commercialScore), f6(b.commercialScore), f6(o.combinedScore), f6(b.combinedScore)]; }));
must('linear gives the dearest bid 0 and the cheapest 100', lin.bids.find((b) => b.evaluatedCost === lin.cMax).commercialScore === 0 && lin.bids.find((b) => b.evaluatedCost === lin.cMin).commercialScore === 100, 'ends');
must('the price method changes the award on this tender: WS3 under lowest-ratio, WS5 under linear', wsRank.mostAdvantageous === 'WS3' && lin.mostAdvantageous === 'WS5', `${wsRank.mostAdvantageous} ${lin.mostAdvantageous}`);
w();
w(`Under 'linear' the dearest responsive bid scores ${f6(lin.bids.find((b) => b.evaluatedCost === lin.cMax).commercialScore)} and the cheapest ${f6(lin.bids.find((b) => b.evaluatedCost === lin.cMin).commercialScore)}, so the same price spread moves the commercial score further. On this tender the price method changes the award: the most advantageous bid (engine) is ${wsRank.mostAdvantageous} under 'lowest-ratio' and ${lin.mostAdvantageous} under 'linear', with the technical weight, the technical method and the bids unchanged.`);
w();
const TW_STEPS = [0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
w(`THE TECHNICAL WEIGHT STEPPED UNDER LINEAR PRICING (stated steps: ${list(TW_STEPS)}; the well services bids, relative technical score). The most advantageous bid and any row a tie-break ordered, engine:`);
w();
const steps = TW_STEPS.map((tw) => [tw, success(`rankTender linear at ${tw}`, T.rankTender({ ...clone(RANK_WS), priceMethod: 'linear', technicalWeight: tw }))]);
table(['technical weight', 'most advantageous', 'combined scores, rank order', 'tie broken'], steps.map(([tw, r]) => [S(tw), r.mostAdvantageous, r.bids.map((b) => `${b.id} ${f6(b.combinedScore)}`).join(', '), r.bids.filter((b) => b.tieBrokenBy).map((b) => `${b.id} by ${b.tieBrokenBy}`).join('; ') || 'none']));
const at85 = steps.find(([tw]) => tw === 0.85)[1];
must('the tie step is the one the sentence names', steps.find(([tw]) => tw === 0.85)[1] === at85, 'step');
must('at 0.85 WS5 and WS3 tie and the lower evaluated cost puts WS5 above WS3; WS1 is most advantageous', at85.mostAdvantageous === 'WS1' && at85.bids.find((b) => b.id === 'WS3').tieBrokenBy === 'lower evaluated cost' && key12(at85.bids.find((b) => b.id === 'WS3').combinedScore) === key12(at85.bids.find((b) => b.id === 'WS5').combinedScore), 'tie');
must('the award runs WS5, WS1, WS3 as the weight rises', steps.map(([, r]) => r.mostAdvantageous).join() === 'WS5,WS5,WS5,WS1,WS1,WS3,WS3', steps.map(([, r]) => r.mostAdvantageous).join());
w();
const TIE_TW = 0.85;
w(`At a technical weight of ${TIE_TW}, WS5 and WS3 score the same combined score to twelve significant digits, and the lower evaluated cost ranks WS5 above WS3; the most advantageous bid at that step is WS1. As the weight rises the award moves from WS5 to WS1 and then to WS3.`);
w();
const kk = success('rankTender Kiiver and Kodym lowest-ratio', T.rankTender(clone(PUB.kk('lowest-ratio'))));
const kkl = success('rankTender Kiiver and Kodym linear', T.rankTender(clone(PUB.kk('linear'))));
w(`KIIVER AND KODYM (2015), TABLE 1 (stated from the source: three prices ${list(PUB.kk('linear').bids.map((b) => b.evaluatedCost))}; price only). The source prints the lowest-bid ratio scores to whole points:`);
w();
table(['bid', 'price (source)', 'lowest-ratio Sc (engine)', 'the source prints', 'linear Sc (engine)'], ['A', 'B', 'C'].map((id) => [id, S(PUB.kk('linear').bids.find((b) => b.id === id).evaluatedCost), f6(kk.bids.find((b) => b.id === id).commercialScore), S(PUB.kkPrinted[id]), f6(kkl.bids.find((b) => b.id === id).commercialScore)]));
must('Kiiver and Kodym: 100, 66.666667, 50', kk.bids.map((b) => f6(b.commercialScore)).join() === '100.000000,66.666667,50.000000', kk.bids.map((b) => b.commercialScore).join());
w();
const ch = success('rankTender Chen 2008', T.rankTender(clone(PUB.chen(false))));
const chx = success('rankTender Chen 2008, A invalid', T.rankTender(clone(PUB.chen(true))));
const gap = (r) => r.bids.find((b) => b.id === 'B').combinedScore - r.bids.find((b) => b.id === 'C').combinedScore;
w(`THE RANKING PARADOX, CHEN (2008) p. 409 (stated from the source: price score "50 x L / P" on prices ${list(PUB.chen(false).bids.map((b) => b.evaluatedCost))}; entered as technical weight ${PUB.chen(false).technicalWeight} with every technical score ${PUB.chen(false).bids[0].technicalPercent}, so B = ${PUB.chen(false).technicalWeight} x 100 x Cmin / C, which is Chen's "50 x L / P"):`);
w();
table(['bid', 'price (source)', 'B with A in the field (engine)', 'B with A declared invalid (engine)'], ['A', 'B', 'C'].map((id) => [id, S(PUB.chen(false).bids.find((b) => b.id === id).evaluatedCost), f6(ch.bids.find((b) => b.id === id).combinedScore), chx.bids.find((b) => b.id === id) ? f6(chx.bids.find((b) => b.id === id).combinedScore) : `excluded: ${chx.excluded[0].reason}`]));
must('Chen: the B to C gap widens from 15 to 18.75', gap(ch) === 15 && gap(chx) === 18.75, `${gap(ch)} ${gap(chx)}`);
w();
w(`Removing A, which is neither B nor C, widens the gap between B and C from ${f6(gap(ch))} to ${f6(gap(chx))} points (derived, B less C): a relative price score depends on which other bids are in the field. Chen prints the same figures.`);

/* ============================================================ SECTION 13 */

section('alb', 'Abnormally low bids: the absolute test below five bids, the relative test from five, and clarification', ['Professional m03', 'Expert m03 l04']);
const e1 = success('abnormallyLow Annex I Example 1', T.abnormallyLow(clone(PUB.albEx1)));
w(`THE RULE, in the engine's basis for five or more bids: ${e1.basis.rule}. Source (engine): ${e1.basis.source}.`);
w();
w(`ANNEX I EXAMPLE 1 of the World Bank ALB Guidance (stated from the source: ${PUB.albEx1.bids.length} bids). The engine takes the ${e1.approach} approach:`);
w();
table(['figure', 'engine', 'the Guidance prints'], [['mean', f6(e1.mean), S(PUB.albEx1Printed.mean)], ['standard deviation (population)', f6(e1.standardDeviation), S(PUB.albEx1Printed.sd)], ['limit, mean less one standard deviation', f6(e1.limit), S(PUB.albEx1Printed.limit)]]);
must('Example 1: relative, bids 1 to 3 flagged', e1.approach === 'relative' && e1.flagged.join() === 'Bid 1,Bid 2,Bid 3', e1.flagged.join());
must('the Guidance figures are the engine figures rounded to the unit', Math.round(e1.mean) === PUB.albEx1Printed.mean && Math.round(e1.standardDeviation) === PUB.albEx1Printed.sd && Math.round(e1.limit) === PUB.albEx1Printed.limit, 'rounded');
w();
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/supplychain/goldens/tender_cases.json`, 'utf8'));
const gEx1 = GOLD.cases.find((c) => c.id === 'wb-alb-annex-i-example-1-relative');
must('the engine golden carries Annex I Example 1 with the same sixteen bids', gEx1 && JSON.stringify(gEx1.args.bids) === JSON.stringify(PUB.albEx1.bids), 'golden');
w(`THE SIXTEEN BIDS of Example 1 (source: the Guidance's Annex I, the figures the engine's golden also carries), each against the limit (engine):`);
w();
table(['bid', 'evaluated cost (source)', 'below the limit (engine flag)'], e1.bids.map((b) => [b.id, S(b.evaluatedCost), S(b.flag)]));
w();
w(`Flagged (engine): ${list(e1.flagged)}. The Guidance prints each figure rounded to the unit. The engine's reason for the first, verbatim:`);
quote(e1.bids[0].reason);
w();
const costs1 = PUB.albEx1.bids.map((b) => b.evaluatedCost);
const sampleSd = STATS.ss.sampleStandardDeviation(costs1);
const sampleLimit = e1.mean - sampleSd;
const sampleFlag = PUB.albEx1.bids.filter((b) => b.evaluatedCost < sampleLimit).map((b) => b.id);
w(`THE POPULATION STANDARD DEVIATION. The Guidance divides by the number of bids. The sample standard deviation (lib/stats sampleStandardDeviation, which divides by one fewer) is ${f6(sampleSd)}, which would put the limit at ${f6(sampleLimit)} (derived: the mean less it); on these bids it flags ${list(sampleFlag)} (derived).`);
must('the sample standard deviation is larger and moves the limit down', sampleSd > e1.standardDeviation && sampleLimit < e1.limit, `${sampleSd} ${e1.standardDeviation}`);
w();
const e2 = success('abnormallyLow Annex I Example 2', T.abnormallyLow(clone(PUB.albEx2)));
w(`ANNEX I EXAMPLE 2 (stated from the source: ${PUB.albEx2.bids.length} bids and a Borrower's cost estimate of ${PUB.albEx2.estimate}). With fewer than five bids the engine takes the ${e2.approach} approach: ${e2.basis.rule}.`);
w();
table(['bid', 'evaluated cost (source)', 'percent below the estimate (engine)', 'flag (engine)'], e2.bids.map((b) => [b.id, S(b.evaluatedCost), f6(b.belowEstimatePct), S(b.flag)]));
must('Example 2: absolute, bids 1 and 2 flagged', e2.approach === 'absolute' && e2.flagged.join() === 'Bid 1,Bid 2', e2.flagged.join());
w();
const e2r = success('abnormallyLow Example 2 after Bid 1 is rejected', T.abnormallyLow({ estimate: PUB.albEx2.estimate, bids: clone(PUB.albEx2.bids).slice(1) }));
const five = success('abnormallyLow five bids with an estimate', T.abnormallyLow({ estimate: PUB.albEx2.estimate, bids: clone(PUB.albEx1.bids).slice(0, 5) }));
w(`Example 2 again after Bid 1 is rejected (stated: the Example 2 bids without Bid 1, and the same estimate): approach (engine) ${e2r.approach}, flagged ${list(e2r.flagged)}. Five or more bids take the relative approach even when a valid estimate is given (stated: the Example 1 bids with Example 2's estimate): approach (engine) ${five.approach}, count ${five.count}.`);
must('Example 2 without Bid 1 is absolute and flags Bid 2; five bids with an estimate stay relative', e2r.approach === 'absolute' && e2r.flagged.join() === 'Bid 2' && five.approach === 'relative' && five.count === 5, `${e2r.flagged} ${five.approach}`);
w();
w(`Flagged (engine): ${list(e2.flagged)}. The Guidance discusses ${e2.bids[0].id}, the lowest; ${e2.bids[1].id} sits ${f6(e2.bids[1].belowEstimatePct)} percent below the estimate, which is ${D.ALB_ABSOLUTE_PCT} percent or more by the same rule, and the engine flags every bid the rule reaches. The engine's reasons, verbatim:`);
e2.bids.filter((b) => b.flag).forEach((b) => quote(b.reason));
w();
const wsAlb = success('abnormallyLow on the well services responsive bids against the should-cost estimate', T.abnormallyLow({ bids: wsEc.bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost })), estimate: T.shouldCost(clone(SC_WS)).estimate }));
w(`THE WELL SERVICES TENDER has ${wsAlb.count} responsive bids, so the absolute approach applies and needs a cost estimate; with the should-cost estimate of ${ref('shouldcost')} (${f6(T.shouldCost(clone(SC_WS)).estimate)}), the engine flags ${wsAlb.flagged.length === 0 ? 'no bid' : list(wsAlb.flagged)}:`);
w();
table(['bid', 'evaluated cost', 'percent below the estimate (engine)', 'flag'], wsAlb.bids.map((b) => [b.id, f6(b.evaluatedCost), f6(b.belowEstimatePct), S(b.flag)]));
must('no well services bid is flagged', wsAlb.flagged.length === 0 && wsAlb.approach === 'absolute', wsAlb.flagged.join());
w();
w('A negative percentage is a bid above the estimate.');
w();
w('CLARIFY BEFORE ANY REJECTION. Every flag reason ends with the same clause, from the engine: "' + e1.bids[0].reason.split(': ').slice(-2).join(': ') + '". Stage 1 identifies a bid to examine; the Guidance requires the price to be clarified with the bidder before any decision.');
must('every ALB reason carries the clarification clause', [...e1.bids, ...e2.bids].filter((b) => b.flag).every((b) => b.reason.endsWith('a potential abnormally low bid: clarify the price with the bidder before any decision; it is never rejected automatically')), 'clause');

/* ============================================================ SECTION 14 */

section('content', 'Nigerian content: the Schedule, measured units, an item against its minimum and overall content', ['Professional m04']);
w(`THE ACT AND ITS SCHEDULE. ${nc0.basis.source}. Each Schedule line sets a minimum Nigerian content for an item and the unit it is measured in. The lines the two Ekene tenders use, as the engine holds them:`);
w();
const usedLines = [...WS.nc.items, ...MS.nc.items].map((i) => i.scheduleLine);
table(['Schedule line (engine key)', 'Schedule section', 'item as printed in the Schedule', 'minimum Nigerian content', 'measured in'], usedLines.map((k) => [k, NCS[k].section, NCS[k].description, `${NCS[k].ncPct}%`, NCS[k].measures.join(' or ')]));
w();
w(`THE RULE, in the engine's basis: ${nc0.basis.item}. The overall content of a bid: ${nc0.basis.overall} when every item shares one unit; ${msNc.basis.overall} when they do not.`);
w();
w('THE WELL SERVICES TENDER (every item in man-hours, so one pooled figure). Content by item and overall, engine:');
w();
const ncRows = (r, ids) => r.bids.map((b) => [b.id, ...ids.map((id) => { const it = b.items.find((x) => x.id === id); return `${f6(it.ncPct)} (${it.meets ? 'meets' : 'below'} ${it.targetPct})`; }), f6(b.ncPct), `${b.itemsMet} of ${b.items.length}`]);
table(['bid', ...WS.nc.items.map((i) => i.id), 'overall', 'items met'], ncRows(nc0, WS.nc.items.map((i) => i.id)));
must('the well services aggregate is one-measure', nc0.aggregate === 'one-measure', nc0.aggregate);
const ws1p = nc0.bids.find((b) => b.id === 'WS1').items.find((x) => x.id === 'pumping');
must('WS1 pumping sits exactly on its 95 percent minimum and meets it', ws1p.ncPct === 95 && ws1p.meets, ws1p.ncPct);
w();
w(`WS1's pumping content is exactly ${f6(ws1p.ncPct)}, the minimum, and meets it: an item meets its minimum AT the minimum. The engine's reason for each item below its minimum, verbatim:`);
nc0.bids.forEach((b) => b.reasons.forEach((r) => quote(`${b.id}: ${r}`)));
w();
w(`THE MATERIALS TENDER (tonnage for casing, cement and baryte; number for valves), aggregate ${msNc.aggregate}: each bid's overall content is the mean of its item contents weighted by its own quoted amount for each item (fixture weights).`);
w();
table(['bid', ...MS.nc.items.map((i) => i.id), 'overall (weighted)', 'items met'], ncRows(msNc, MS.nc.items.map((i) => i.id)));
must('the materials aggregate is weighted', msNc.aggregate === 'weighted', msNc.aggregate);
const ms2 = msNc.bids.find((b) => b.id === 'MS2');
const ms2w = MS.bids.find((b) => b.id === 'MS2').ncWeights;
must('MS2 overall is the spend-weighted mean of its item contents', nearly(ms2.ncPct, sum(ms2.items.map((it) => ms2w[it.id] * it.ncPct)) / sum(Object.values(ms2w))), ms2.ncPct);
w();
w(`MS2's overall content, ${f6(ms2.ncPct)}, is the mean of its four item contents weighted by its quoted amounts (fixture: ${list(Object.entries(ms2w).map(([k, v]) => `${k} ${v}`))}); checked. The Act gives no rule for adding man-hours to tonnes, so the weights are a stated input: a bid with items in different units and no weights is refused (${ref('refusals')}).`);
w();
w('MEASURED UNITS are enforced. Valves are counted by number in the Schedule; a bid that reports them by tonnage is refused, verbatim:');
quote(T.nigerianContent(mut(MS_NC_ARGS, (a) => { a.bids[0].items.valves.measure = 'tonnage'; })).error);
w();
const USER_T = { items: [{ id: 'rig', scheduleLine: 'drilling-rigs-land' }, { id: 'catering', targetPct: 90, measure: 'man-hours', source: 'a level stated for this example by the course; no Board target was read' }], bids: [{ id: 'B1', items: { rig: { measure: 'man-hours', nigerian: 7000, total: 10000 }, catering: { measure: 'man-hours', nigerian: 1800, total: 2000 } } }, { id: 'B2', items: { rig: { measure: 'man-hours', nigerian: 6990, total: 10000 }, catering: { measure: 'man-hours', nigerian: 1790, total: 2000 } } }] };
const userT = success('nigerianContent with a user-stated target', T.nigerianContent(clone(USER_T)));
w(`A TARGET THE SCHEDULE DOES NOT LIST enters with its source stated (s.11(2) lets the Board set one). Two stated bids, one Schedule line (land rigs, engine key ${USER_T.items[0].scheduleLine}, ${NCS['drilling-rigs-land'].ncPct}% by ${NCS['drilling-rigs-land'].measures[0]}) and one stated target (catering, ${USER_T.items[1].targetPct}% by ${USER_T.items[1].measure}):`);
w();
table(['bid', 'rig', 'catering', 'overall', 'items met'], ncRows(userT, ['rig', 'catering']));
w();
table(['item', 'target (engine)', 'its source, as the engine returns it'], userT.targets.map((t) => [t.id, `${t.targetPct}%`, t.source]));
must('B1 meets both at exactly the minimum; B2 meets neither', userT.bids[0].allMet && userT.bids[0].items.every((x) => x.ncPct === x.targetPct) && userT.bids[1].itemsMet === 0, 'P1 P2');
w();
w('B1 sits exactly on both minimums and meets both; B2 sits below both. A stated target with no source is refused (' + ref('refusals') + ').');

/* ============================================================ SECTION 15 */

must('the s.14 title words match the engine constants', D.NC_PRICE_MARGIN_PCT === 1 && D.NC_LEAD_PCT === 5, `${D.NC_PRICE_MARGIN_PCT} ${D.NC_LEAD_PCT}`);
section('s14', 'Section 14: bids within one percent, the closest competitor, and two readings of at least five percent higher', ['Professional m05']);
w(`THE ACT, s.14, as the engine states it: a bid whose evaluated cost is within ${D.NC_PRICE_MARGIN_PCT}% of the lowest at the commercial stage joins a group; with two or more in the group, the bid with the highest Nigerian content is selected provided its content is at least ${D.NC_LEAD_PCT}% higher than its closest competitor's.`);
w();
w('THE ACT DOES NOT SAY whether "at least 5% higher" means five percentage points or five percent of the competitor\'s content. The engine has no default: `ncLeadBasis` must be stated, and every s.14 reason prints the three readings it applied. This course presents both readings side by side, as an open question of the Act, and states the reading beside every figure that depends on it.');
w();
const prefPts = success('contentPreference on the materials bids, points', T.contentPreference({ ...clone(PREF_MS), ncLeadBasis: 'points' }));
const prefRel = success('contentPreference on the materials bids, relative', T.contentPreference({ ...clone(PREF_MS), ncLeadBasis: 'relative' }));
w('THE READINGS, verbatim from the engine (points, then relative):');
prefPts.section14.readings.forEach((r) => quote(r));
quote(prefRel.section14.readings[2]);
must('the first two readings are the same under both bases', prefPts.section14.readings.slice(0, 2).join() === prefRel.section14.readings.slice(0, 2).join(), 'readings');
w();
w('THE MATERIALS TENDER, the responsive bids with their evaluated costs (' + ref('lifecycle') + ') and overall content (' + ref('content') + '):');
w();
table(['bid', 'evaluated cost', 'above the lowest (percent, derived)', 'overall content', 'in the s.14 group (engine)'], msEc.bids.map((b) => [b.id, f6(b.evaluatedCost), f6((100 * (b.evaluatedCost - msEc.bids[0].evaluatedCost)) / msEc.bids[0].evaluatedCost), f6(ncPctOf[b.id]), S(prefPts.section14.group.includes(b.id))]));
must('the group is MS4 and MS2', prefPts.section14.group.join() === 'MS4,MS2', prefPts.section14.group.join());
w();
table(['', 'read as points', 'read as relative'], [
  ['leader (engine)', S(prefPts.section14.leader), S(prefRel.section14.leader)],
  ['runner-up (engine)', S(prefPts.section14.runnerUp), S(prefRel.section14.runnerUp)],
  ['lead (engine)', `${f6(prefPts.section14.lead)} percentage points`, `${f6(prefRel.section14.lead)} percent of the runner-up`],
  ['s.14 applied (engine)', S(prefPts.section14.applied), S(prefRel.section14.applied)],
  ['selected (engine)', prefPts.selected, prefRel.selected],
]);
must('points: MS4 stands; relative: MS2 is selected', prefPts.selected === 'MS4' && !prefPts.section14.applied && prefRel.selected === 'MS2' && prefRel.section14.applied, `${prefPts.selected} ${prefRel.selected}`);
w();
w('The same two bids, the same contents, and the reading decides the award. The engine\'s reasons, verbatim:');
quote(`points: ${prefPts.section14.reason}`);
quote(`relative: ${prefRel.section14.reason}`);
w();
w(`THE ENGINE'S BASIS, verbatim: ${prefPts.basis.section14} (points); ${prefRel.basis.section14} (relative).`);
w();
w('THE RULE AT ITS EDGES, on stated bids (each call names its reading):');
const s14 = (label, basis, bids) => success(`contentPreference ${label}`, T.contentPreference({ ncLeadBasis: basis, bids: bids.map(([id, c, nc]) => ({ id, evaluatedCost: c, ncPct: nc, receivedAt: '2027-06-01T09:00:00Z' })) }));
const EDGE = [
  ['exactly the margin above the lowest', 'points', [['LO', 2000000, 50], ['E1', 2020000, 56]]],
  ['one unit more than the margin above', 'points', [['LO', 2000000, 50], ['E2', 2020001, 90]]],
  ['a lead of exactly the stated points', 'points', [['LO', 2000000, 70], ['K5', 2010000, 75]]],
  ['a lead one point short, read as points', 'points', [['LO', 2000000, 80], ['K4', 2010000, 84]]],
  ['the same lead, read as relative (exactly the stated percent of the runner-up)', 'relative', [['LO', 2000000, 80], ['K4', 2010000, 84]]],
  ['a shared highest content', 'points', [['LO', 2000000, 40], ['S1', 2005000, 65], ['S2', 2010000, 65]]],
  ['a runner-up at no content, read as relative', 'relative', [['LO', 2000000, 0], ['Z1', 2004000, 30]]],
  ['the lowest also leads', 'points', [['LO', 2000000, 88], ['L2', 2006000, 70], ['L3', 2012000, 75]]],
];
const edgeRows = EDGE.map(([label, basis, bids]) => { const r = s14(label, basis, bids); return [label, basis, bids.map(([id, c, nc]) => `${id} ${c} at ${nc}%`).join('; '), r.section14.group.join(', '), S(r.section14.lead === null ? 'null' : f6(r.section14.lead)), S(r.section14.applied), r.selected, r]; });
table(['case (stated)', 'reading', 'bids: evaluated cost at content', 'group', 'lead', 'applied', 'selected'], edgeRows.map((x) => x.slice(0, 7)));
const er = Object.fromEntries(edgeRows.map((x) => [x[0], x[7]]));
must('exactly 1 percent is in the group', er['exactly the margin above the lowest'].section14.group.length === 2, 'in');
must('one unit more is out', er['one unit more than the margin above'].section14.group.length === 1 && !er['one unit more than the margin above'].section14.engaged, 'out');
must('exactly 5 points applies', er['a lead of exactly the stated points'].section14.applied && er['a lead of exactly the stated points'].selected === 'K5', 'K5');
must('4 points does not apply as points and applies as relative', !er['a lead one point short, read as points'].section14.applied && er['the same lead, read as relative (exactly the stated percent of the runner-up)'].section14.applied, '4 points');
must('a shared top is not a single leader', er['a shared highest content'].section14.leader === null && er['a shared highest content'].selected === 'LO', 'shared');
must('a zero runner-up gives a null lead and applies', er['a runner-up at no content, read as relative'].section14.lead === null && er['a runner-up at no content, read as relative'].section14.applied, 'zero');
must('the lowest also leading is confirmed', er['the lowest also leads'].selected === 'LO' && er['the lowest also leads'].section14.applied, 'confirm');
w();
w('The engine\'s reasons for four of these, verbatim (each reason also carries the three readings, shortened here after its opening words "(readings of s.14:"):');
['one unit more than the margin above', 'a shared highest content', 'a runner-up at no content, read as relative', 'the lowest also leads'].forEach((k) => quote(`${k}: ${er[k].section14.reason.split(' (readings of s.14:')[0]} (readings of s.14: ...)`));
must('every s.14 reason carries its readings', edgeRows.every((x) => x[7].section14.reason.includes('\x28readings of s.14: "within 1 % of each other at commercial stage" is read as within 1% of the lowest evaluated cost;')), 'readings');
w();
w(`A shared highest content means no single bid "contains the highest level", so s.14 is engaged and selects nothing: the lowest evaluated cost stands. A runner-up with no Nigerian content makes the relative lead a division by zero, and the engine returns the lead as null while any positive content is more than ${D.NC_LEAD_PCT}% higher by any reading.`);

/* ============================================================ SECTION 16 */

must('the s.16 title word matches the engine constant', D.INDIGENOUS_MARGIN_PCT === 10, D.INDIGENOUS_MARGIN_PCT);
section('s16', 'Section 16: an indigenous company within ten percent, content in a combined award, and the materials award end to end', ['Professional m06']);
w(`THE ACT, s.16, as the engine states it: ${prefPts.basis.section16}. It protects a Nigerian indigenous company with capacity from exclusion solely on price; it never selects a bid. "Indigenous" and "capacity" are stated by the caller for each bid.`);
w();
const s16 = prefRel.section16;
table(['bid', 'above the lowest, percent (engine)', 'within the margin (engine)', 'reason (engine), verbatim'], s16.map((x) => [x.id, f6(x.abovePct), S(x.withinMargin), x.reason]));
must('MS3 is the only indigenous company with capacity and sits within 10 percent', s16.length === 1 && s16[0].id === 'MS3' && s16[0].withinMargin, JSON.stringify(s16));
w();
const S16_PROBE = { ncLeadBasis: 'points', bids: [
  { id: 'LO', evaluatedCost: 3000000, ncPct: 40, receivedAt: '2027-06-01T09:00:00Z' },
  { id: 'I10', evaluatedCost: 3300000, ncPct: 95, receivedAt: '2027-06-01T09:00:00Z', indigenous: true, capacity: true },
  { id: 'I11', evaluatedCost: 3300001, ncPct: 95, receivedAt: '2027-06-01T09:00:00Z', indigenous: true, capacity: true },
  { id: 'NC', evaluatedCost: 3100000, ncPct: 95, receivedAt: '2027-06-01T09:00:00Z', indigenous: true, capacity: false },
] };
const s16e = success('contentPreference s.16 edges', T.contentPreference(clone(S16_PROBE)));
const s16c = (id) => S16_PROBE.bids.find((b) => b.id === id).evaluatedCost;
w(`AT THE MARGIN (stated bids: the lowest at ${s16c('LO')}; I10 at ${s16c('I10')}, exactly ${D.INDIGENOUS_MARGIN_PCT} percent above; I11 one unit more; NC within the margin but without capacity):`);
w();
table(['bid', 'above the lowest, percent (engine)', 'within the margin (engine)'], s16e.section16.map((x) => [x.id, f6(x.abovePct), S(x.withinMargin)]));
must('exactly 10 percent is protected, one unit more is not, and no capacity means no row', s16e.section16.map((x) => `${x.id}:${x.withinMargin}`).join() === 'I10:true,I11:false', s16e.section16.map((x) => `${x.id}:${x.withinMargin}`).join());
w();
w('NC is not listed: s.16 applies only to a company stated as both indigenous and with capacity. The selected bid (engine) is ' + s16e.selected + ': s.16 protects, and selects nothing.');
must('s.16 selects nothing', s16e.selected === 'LO', s16e.selected);
w();
w('CONTENT IN A COMBINED AWARD. s.14 applies at the commercial stage of a lowest-evaluated-cost award. With a combined award the engine refuses the content rule and says what to do instead, verbatim:');
quote(T.evaluateTender({ ...clone(TENDER_WS), nigerianContent: { ncLeadBasis: 'points' } }).error);
w();
w('THE MATERIALS AWARD END TO END (evaluateTender, award lowest-cost, each bid\'s overall content from ' + ref('content') + ', the fixture settings):');
w();
table(['s.14 reading', 'lowest evaluated cost (engine)', 'award (engine)', 'the engine\'s award reason'], [
  ['none stated (content not applied)', msAvg.commercial.lowestEvaluatedCost, msAvg.award, msAvg.reason],
  ['points', msPts.commercial.lowestEvaluatedCost, msPts.award, msPts.reason],
  ['relative', msRel.commercial.lowestEvaluatedCost, msRel.award, msRel.reason.split(' (readings of s.14:')[0] + ' (readings of s.14: ...)'],
]);
must('the award reason under the relative reading is the s.14 reason', msRel.reason === msRel.contentPreference.section14.reason, 'reason');
w();
w('Under the relative reading the award reason is the s.14 reason itself, readings included (shortened here after the parenthesis opens; ' + ref('s14') + ' prints it whole).');

/* ============================================================ SECTION 17 */

section('contracts', 'Contract types on one job: lump sum, day rate and reimbursable under a seeded duration and daily cost', ['Expert m01']);
const C = WS.contracting;
w(`THE SAME SCOPE UNDER THREE CONTRACT TYPES (fixture): ${C.note} The company pays, per iteration: the lump sum ${f6(C.lumpSum.price)} whatever happens; under the day rate ${f6(C.dayRate.mobilisationFee)} plus ${f6(C.dayRate.rate)} a day; under the reimbursable contract the contractor's cost times (1 + ${C.reimbursable.feeFraction}).`);
w();
w('THE ACTIVITY PROGRAMME (fixture), whose days come from engines/drilling/wellCost.js evaluateProgram:');
w();
table(['activity (fixture)', 'kind', 'what it is', 'hours or depth and speed'], C.duration.program.map((a) => [a.id, a.kind, a.label, a.kind === 'trip' ? `${a.mdM} m at ${a.tripSpeedMPerHr} m/hr, in and out` : `${a.durationHr} hr`]));
const prog0 = WELLCOST.evaluateProgram({ activities: clone(C.duration.program), nptFrac: 0 });
w();
w(`Productive days (wellCost evaluateProgram at an NPT fraction of 0): ${f6(prog0.totals.totalDays)}. The NPT fraction is triangular (fixture: min ${C.duration.nptFrac.min}, mode ${C.duration.nptFrac.mode}, max ${C.duration.nptFrac.max}), and the days of an iteration are the productive days x (1 + the NPT fraction drawn), which is wellCost's own stretch rule. The contractor's daily cost is triangular (fixture: min ${C.dailyCost.min}, mode ${C.dailyCost.mode}, max ${C.dailyCost.max}); the fixed cost is ${f6(C.fixedCost)} (fixture). Iterations ${C.iterations}, seed ${C.seed} (fixture).`);
w();
const ct = success('contractTypes on the well services fixture', T.contractTypes(clone(CT_WS)));
must('the plan days are the productive days x (1 + the NPT mode)', nearly(ct.plan.days, prog0.totals.totalDays * (1 + C.duration.nptFrac.mode)), ct.plan.days);
w(`THE ENGINE'S SAMPLING BASIS, verbatim: ${ct.basis.sampling}.`);
w();
w(`THE PLAN is the modes: ${f6(ct.plan.days)} days at ${f6(ct.plan.dailyCost)} a day, a planned contractor cost of ${f6(ct.plan.contractorCost)} (engine). The engine's payments basis: ${ct.basis.payments}.`);
w();
table(['figure (engine)', 'mean', 'P90 (low)', 'P50', 'P10 (high)', 'min', 'max'], [
  ['days', ...['mean', 'p90', 'p50', 'p10', 'min', 'max'].map((k) => f6(ct.duration[k]))],
  ['contractor cost', ...['mean', 'p90', 'p50', 'p10', 'min', 'max'].map((k) => f6(ct.contractorCost[k]))],
]);
w();
w(`An iteration OVERRUNS when its contractor cost is above the planned cost: probability ${f6(ct.overrun.probability)}, expected overrun ${f6(ct.overrun.expectedOverrun)} (engine; the mean over all iterations, 0 where there is none).`);
w();
const TY = ['lumpSum', 'dayRate', 'reimbursable'];
const TYN = { lumpSum: 'lump sum', dayRate: 'day rate', reimbursable: 'reimbursable, cost plus 12 percent' };
table(['contract type', 'planned payment', 'company cost: mean', 'P90 (low)', 'P50', 'P10 (high)', 'contractor margin: planned', 'mean', 'probability of a loss'],
  TY.map((t) => { const x = ct.types[t]; return [TYN[t], f6(x.plannedPayment), f6(x.companyCost.mean), f6(x.companyCost.p90), f6(x.companyCost.p50), f6(x.companyCost.p10), f6(x.contractorMargin.planned), f6(x.contractorMargin.mean), f6(x.contractorMargin.probabilityOfLoss)]; }));
w();
w('WHO CARRIES THE OVERRUN. Over the iterations that overrun, the engine splits each overrun into what the company pays above its planned payment and what the contractor absorbs out of its planned margin:');
w();
table(['contract type', 'company pays (engine)', 'contractor absorbs (engine)', 'company share (engine)', 'the two added (derived)'], TY.map((t) => { const o = ct.types[t].overrun; return [TYN[t], f6(o.companyPays), f6(o.contractorAbsorbs), f6(o.companyShare), f6(o.companyPays + o.contractorAbsorbs)]; }));
TY.forEach((t) => must(`${t}: company pays + contractor absorbs = the expected overrun`, nearly(ct.types[t].overrun.companyPays + ct.types[t].overrun.contractorAbsorbs, ct.overrun.expectedOverrun, 1e-9), t));
must('lump sum: the company carries none; reimbursable: the company carries 1.12 of it and the contractor gains', ct.types.lumpSum.overrun.companyShare === 0 && nearly(ct.types.reimbursable.overrun.companyShare, 1.12, 1e-9) && ct.types.reimbursable.overrun.contractorAbsorbs < 0, 'shares');
must('day rate sits between', ct.types.dayRate.overrun.companyShare > 0 && ct.types.dayRate.overrun.companyShare < 1, ct.types.dayRate.overrun.companyShare);
w();
w(`The engine's overrun basis, verbatim: ${ct.basis.overrun}. Each row adds to the expected overrun, ${f6(ct.overrun.expectedOverrun)} (checked).`);
w();
w('- Under the lump sum the company pays nothing above its planned payment; the contractor absorbs the whole overrun, and its margin goes negative in ' + f6(ct.types.lumpSum.contractorMargin.probabilityOfLoss) + ' of the iterations.');
w('- Under the day rate the company pays for the extra days at the day rate and the contractor absorbs the rest: a daily cost above plan, and the gap between its daily cost and the day rate on the extra days.');
w(`- Under cost plus ${100 * C.reimbursable.feeFraction} percent the company pays the whole overrun and ${100 * C.reimbursable.feeFraction} percent on top of it, so its share is ` + f6(ct.types.reimbursable.overrun.companyShare) + ' and the contractor\'s part is negative: the contractor earns more when the job overruns. Its probability of a loss is ' + f6(ct.types.reimbursable.contractorMargin.probabilityOfLoss) + '.');
must('reimbursable: no loss', ct.types.reimbursable.contractorMargin.probabilityOfLoss === 0, ct.types.reimbursable.contractorMargin.probabilityOfLoss);
w();
const FIXED_FEE = ct.types.reimbursable.contractorMargin.planned;
const ctFix = success('contractTypes, reimbursable at a fixed fee equal to the percentage fee\'s planned margin', T.contractTypes({ ...clone(CT_WS), reimbursable: { fixedFee: FIXED_FEE } }));
const fx2 = ctFix.types.reimbursable;
w(`COST PLUS A FIXED FEE. The same job with the reimbursable contract paying cost plus a fixed fee of ${f6(FIXED_FEE)} (stated: the planned margin of the percentage fee above), the same seed and iterations. The reimbursable row, engine:`);
w();
table(['figure', 'engine'], [['planned payment', f6(fx2.plannedPayment)], ['company pays of the overrun', f6(fx2.overrun.companyPays)], ['contractor absorbs', eX(fx2.overrun.contractorAbsorbs)], ['company share', f6(fx2.overrun.companyShare)], ['contractor margin, mean', f6(fx2.contractorMargin.mean)], ['probability of a loss', f6(fx2.contractorMargin.probabilityOfLoss)]]);
must('under a fixed fee the company pays the whole expected overrun and the contractor absorbs none of it', nearly(fx2.overrun.companyPays, ctFix.overrun.expectedOverrun, 1e-9) && Math.abs(fx2.overrun.contractorAbsorbs) < 1e-6 && nearly(fx2.contractorMargin.mean, FIXED_FEE, 1e-9), `${fx2.overrun.companyPays} ${fx2.overrun.contractorAbsorbs}`);
w();
w(`Under a fixed fee the company pays the whole expected overrun, ${f6(ctFix.overrun.expectedOverrun)}, and the contractor's margin is the fee in every iteration. The contractor's part prints as ${eX(fx2.overrun.contractorAbsorbs)}, the rounding left by summing ${C.iterations} floating-point differences, so it prints in exponent form and carries no share of the overrun. It is no longer negative because a fixed fee does not grow with the cost.`);
const TYPED_FEE = 86682.05;
const ctTyped = success('contractTypes, reimbursable at the fee typed to six decimals', T.contractTypes({ ...clone(CT_WS), reimbursable: { fixedFee: TYPED_FEE } }));
const ft = ctTyped.types.reimbursable;
w(`Typed as ${TYPED_FEE}, as a learner types it, the fee is a different double (${S(FIXED_FEE)} above is the engine's exact figure). The same run then gives: company pays ${f6(ft.overrun.companyPays)}, company share ${f6(ft.overrun.companyShare)}, contractor absorbs ${eX(ft.overrun.contractorAbsorbs)} (engine). The contractor's figure is a floating-point trace in both runs; its size depends on the exact double of the fee, and it carries no share of the overrun.`);
must('the typed fee gives the same company figures and a different trace', nearly(ft.overrun.companyPays, fx2.overrun.companyPays, 1e-12) && ft.overrun.companyShare.toFixed(6) === '1.000000' && Math.abs(ft.overrun.contractorAbsorbs) < 1e-6 && ft.overrun.contractorAbsorbs !== fx2.overrun.contractorAbsorbs && FIXED_FEE !== TYPED_FEE, `${ft.overrun.contractorAbsorbs}`);
w();
const CT_FLAT = { duration: 10, dailyCost: 40000, fixedCost: 100000, lumpSum: { price: 500000 }, dayRate: { rate: 50000, mobilisationFee: 0 }, reimbursable: { fixedFee: 0 }, iterations: 10, seed: 1 };
const ctFlat = success('contractTypes with every input constant', T.contractTypes(clone(CT_FLAT)));
w(`WITH NOTHING UNCERTAIN (stated: ${CT_FLAT.duration} days, ${CT_FLAT.dailyCost} a day, fixed cost ${CT_FLAT.fixedCost}; lump sum ${CT_FLAT.lumpSum.price}; day rate ${CT_FLAT.dayRate.rate} with a mobilisation fee of ${CT_FLAT.dayRate.mobilisationFee}; reimbursable at cost plus a fixed fee of ${CT_FLAT.reimbursable.fixedFee}; ${CT_FLAT.iterations} iterations, seed ${CT_FLAT.seed}) nothing is drawn, no iteration overruns (probability ${f6(ctFlat.overrun.probability)}), and the reimbursable margin is exactly ${f6(ctFlat.types.reimbursable.contractorMargin.mean)} with a probability of a loss of ${f6(ctFlat.types.reimbursable.contractorMargin.probabilityOfLoss)}: a margin of exactly ${f6(ctFlat.types.reimbursable.contractorMargin.mean)} is not a loss. The engine's sampling basis, verbatim: ${ctFlat.basis.sampling}.`);
must('constant inputs: no overrun, zero margin is not a loss, and no draw', ctFlat.overrun.probability === 0 && ctFlat.types.reimbursable.contractorMargin.mean === 0 && ctFlat.types.reimbursable.contractorMargin.probabilityOfLoss === 0 && /constant: no draw/.test(ctFlat.basis.sampling), ctFlat.basis.sampling);

/* ============================================================ SECTION 18 */

const PCT_P90 = Number(PCT.EXCEEDANCE_DEFINITION.match(/a (\d+)% probability/)[1]);
section('percentiles', 'Cost percentiles and their labels: the exceedance definition and the low-cost P90', ['Expert m02']);
w(`THE DEFINITION, from lib/conventions/percentile.js, verbatim: ${ct.percentileDefinition}`);
must('the definition is the exported one', ct.percentileDefinition === PCT.EXCEEDANCE_DEFINITION, ct.percentileDefinition);
w();
w(`THE ENGINE'S PERCENTILE BASIS, verbatim: ${ct.basis.percentiles}.`);
must('the basis states the reversal for a cost', /for a cost P90 is the LOW cost \(10th percentile\) and P10 the HIGH cost \(90th percentile\)/.test(ct.basis.percentiles), ct.basis.percentiles);
w();
w(`For a COST, a ${PCT_P90}% probability of meeting or exceeding a value makes that value a LOW cost: nine iterations in ten cost at least that much. So the P90 cost is the smaller figure and the P10 cost the larger. A reader who takes P90 to name the high cost reads every cost percentile here backwards. The engine follows the platform convention and prints the definition beside every cost percentile. On the well services contract types (engine):`);
w();
table(['contract type', 'P90 (low)', 'P50', 'P10 (high)', 'P90 at or below P50 at or below P10'], TY.map((t) => { const c = ct.types[t].companyCost; return [TYN[t], f6(c.p90), f6(c.p50), f6(c.p10), S(c.p90 <= c.p50 && c.p50 <= c.p10)]; }));
TY.forEach((t) => { const c = ct.types[t].companyCost; must(`${t}: exceedance order`, c.p90 <= c.p50 && c.p50 <= c.p10, `${c.p90} ${c.p50} ${c.p10}`); });
must('the lump sum percentiles are one figure', ct.types.lumpSum.companyCost.p90 === ct.types.lumpSum.companyCost.p10, 'lump');
w();
w(`The lump sum is the same at every percentile: the company pays ${f6(ct.types.lumpSum.companyCost.p50)} whatever happens. The day rate and the reimbursable contract spread from their P90 to their P10.`);
w();
const IDX = Object.fromEntries(['P90', 'P50', 'P10'].map((k) => [k.toLowerCase(), Number(ct.basis.percentiles.match(new RegExp(`${k} = (?:index )?floor\\x28([\\d.]+) n\\x29`))[1])]));
w(`THE INDEX RULE. lib/stats basicStats sorts the ${C.iterations} values and reads P90 at index floor(${IDX.p90} x ${C.iterations}) = ${Math.floor(IDX.p90 * C.iterations)}, P50 at ${Math.floor(IDX.p50 * C.iterations)} and P10 at ${Math.floor(IDX.p10 * C.iterations)} (the first sorted value is index ${0}), the fractions read from the engine's basis: no interpolation. At ${IT_SHORT} iterations the same rule reads P90 at index ${Math.floor(IDX.p90 * IT_SHORT)}, P50 at ${Math.floor(IDX.p50 * IT_SHORT)} and P10 at ${Math.floor(IDX.p10 * IT_SHORT)} (derived).`);
w();
w(`THE PLAN, THE MEAN AND THE PERCENTILES are three different figures. On the day rate the planned payment is ${f6(ct.types.dayRate.plannedPayment)}, the mean company cost ${f6(ct.types.dayRate.companyCost.mean)} and the P50 ${f6(ct.types.dayRate.companyCost.p50)} (engine). The plan is built from the modes; the triangular NPT fraction has a long upper tail (mode ${C.duration.nptFrac.mode}, max ${C.duration.nptFrac.max}), so ${f6(ct.overrun.probability)} of the iterations overrun the plan.`);
must('the day-rate mean and P50 both sit above the planned payment', ct.types.dayRate.companyCost.mean > ct.types.dayRate.plannedPayment && ct.types.dayRate.companyCost.p50 > ct.types.dayRate.plannedPayment, 'plan');

/* ============================================================ SECTION 19 */

section('shouldcost', 'Should-cost: an independent estimate from the programme, contingency, the partner split and the screening band', ['Expert m03']);
const SCF = WS.shouldCost;
w(`THE COMPANY'S OWN ESTIMATE (fixture: ${SCF.note}) for the same programme as ${ref('contracts')}, at an NPT fraction of ${SCF.nptFrac}, with contingency ${SCF.contingencyFrac} of the base:`);
w();
table(['cost item (fixture)', 'basis', 'rate or value', 'category'], SCF.items.map((i) => [i.label, i.basis, f6(i.basis === 'lump' ? i.value : i.rate), i.category]));
const sc = success('shouldCost on the well services fixture', T.shouldCost(clone(SC_WS)));
w();
w(`THE ENGINE'S ESTIMATE BASIS, verbatim: ${sc.basis.estimate}.`);
w();
table(['figure (engine)', 'value'], [['total days (at the stated NPT)', f6(sc.totalDays)], ['drilled metres', f6(sc.drilledM)], ['base', f6(sc.baseUsd)], ['contingency', f6(sc.contingencyUsd)], ['estimate', f6(sc.estimate)]]);
must('the estimate is base plus contingency', nearly(sc.estimate, sc.baseUsd + sc.contingencyUsd), sc.estimate);
must('the should-cost days are the plan days of the contract types', nearly(sc.totalDays, ct.plan.days), `${sc.totalDays} ${ct.plan.days}`);
w();
w(`The total days equal the planned days of ${ref('contracts')} (checked): the same programme at the same NPT fraction. No metres are drilled in a coiled tubing job, so no per-metre item applies.`);
w();
w(`THE PARTNER SPLIT, in the engine's basis: ${sc.basis.split}.`);
w();
table(['party', 'working interest', 'share of the estimate (engine)'], [...sc.split.partners.map((p) => [p.name, `${p.working_interest}%`, f6(p.shareAmount)]), ['operator (engine)', `${sc.split.operatorShare}%`, f6(sc.split.operatorAmount)]]);
must('the operator carries 100 less the partners', sc.split.operatorShare === 45 && sc.split.valid === true && sc.split.note === null, sc.split.operatorShare);
w();
w(`THE SCREENING BAND, stated (fixture: low ${SCF.band.low}, high ${SCF.band.high}); the engine's band basis: ${sc.basis.band}. No published threshold exists for a band like this, so it is always a stated input. Each evaluated cost against the estimate:`);
w();
table(['bid', 'evaluated cost', 'ratio to the estimate (engine)', 'flag (engine)'], sc.bids.map((b) => [b.id, f6(b.evaluatedCost), f6(b.ratio), S(b.flag)]));
must('no well services bid is flagged by the band', sc.bids.every((b) => b.flag === null), 'none');
w();
const SC_EDGE = { program: [{ id: 'job', kind: 'flat', durationHr: 120 }], items: [{ id: 'spread', basis: 'per-day', rate: 20000, category: 'intangible' }], band: { low: 0.8, high: 1.25 }, bids: [{ id: 'AT-LOW', evaluatedCost: 80000 }, { id: 'BELOW', evaluatedCost: 79999 }, { id: 'AT-HIGH', evaluatedCost: 125000 }, { id: 'ABOVE', evaluatedCost: 125001 }] };
const bandEdge = success('shouldCost band edges', T.shouldCost(clone(SC_EDGE)));
w(`AT THE BAND'S EDGES (stated: one flat activity of ${SC_EDGE.program[0].durationHr} hours, a spread at ${SC_EDGE.items[0].rate} a day, estimate ${f6(bandEdge.estimate)}):`);
w();
table(['bid (stated)', 'evaluated cost', 'ratio (engine)', 'flag (engine)', 'reason (engine)'], bandEdge.bids.map((b) => [b.id, f6(b.evaluatedCost), f6(b.ratio), S(b.flag), S(b.reason)]));
must('both band limits are inside', bandEdge.bids.map((b) => S(b.flag)).join() === 'null,below,null,above', bandEdge.bids.map((b) => b.flag).join());
w();
const NPT_MORE = 0.25;
const scMore = success('shouldCost at a higher NPT', T.shouldCost({ ...clone(SC_WS), nptFrac: NPT_MORE }));
const perDay = SCF.items.filter((i) => i.basis === 'per-day').reduce((s, i) => s + i.rate, 0);
w(`MORE NPT raises the estimate through the per-day items only. At a stated NPT fraction of ${NPT_MORE} the engine returns ${f6(scMore.totalDays)} days and an estimate of ${f6(scMore.estimate)}; the rise, ${f6(scMore.estimate - sc.estimate)}, is (1 + contingency) x the per-day rates (${f6(perDay)} a day) x the extra days, ${f6(scMore.totalDays - sc.totalDays)} (derived, checked).`);
must('the NPT rise is the per-day items only', nearly(scMore.estimate - sc.estimate, (1 + SCF.contingencyFrac) * perDay * (scMore.totalDays - sc.totalDays), 1e-9), scMore.estimate - sc.estimate);
w();
w(`SHOULD-COST BESIDE THE ABNORMALLY LOW TEST. The band is the company's own screen. The World Bank's test for a low price is ${ref('alb')}'s, and with fewer than five responsive bids it needs a cost estimate: this one. The engine's band reason for a bid below the band says to examine it as a possibly abnormally low bid (verbatim above), and neither test rejects a bid on its own.`);

/* ============================================================ SECTION 20 */

section('whole', 'The whole tender in one call: stages chained, the award basis, and when nobody passes', ['Expert m04']);
w('`evaluateTender` chains the stages: `technicalEvaluation` on every bid, `evaluatedCosts` on the bids that passed only, then either `rankTender` (award combined) or the lowest evaluated cost with `contentPreference` where content is stated. Every exclusion carries its stage and reason.');
w();
table(['stage (engine object)', 'well services, combined award'], [
  ['technical.passed', list(wsCombined.technical.passed)],
  ['commercial.bids, evaluated cost ascending', list(wsCombined.commercial.bids.map((b) => b.id))],
  ['commercial.lowestEvaluatedCost', wsCombined.commercial.lowestEvaluatedCost],
  ['ranking.bids, combined score descending', list(wsCombined.ranking.bids.map((b) => b.id))],
  ['award', wsCombined.award],
  ['excluded', list(wsCombined.excluded.map((x) => `${x.id} (${x.stage})`))],
]);
must('the chained objects agree with the separate calls', wsCombined.technical.passed.join() === wsTech.passed.join() && JSON.stringify(wsCombined.commercial.bids) === JSON.stringify(T.evaluatedCosts(clone(EC_WS)).bids), 'chain');
w();
w('The chained technical and commercial objects are the same objects the separate calls return (checked).');
w();
table(['award basis (stated)', 'price method', 'award (engine)'], [
  [`combined, technical weight ${TW}`, 'lowest-ratio', wsCombined.award],
  [`combined, technical weight ${TW}`, 'linear', success('evaluateTender linear', T.evaluateTender({ ...clone(TENDER_WS), priceMethod: 'linear' })).award],
  ['lowest-cost', 'not used', wsLow.award],
]);
w();
w('THE OMISSION RULE THE ENGINE ALSO ACCEPTS. On the materials tender (lowest-cost award, no content rule):');
w();
table(['omission rule', 'MS4 omission added (engine)', 'MS4 evaluated cost', 'MS2 evaluated cost', 'award (engine)'], [
  ['average (cited, the default)', f6(msAvg.commercial.bids.find((b) => b.id === 'MS4').omissionTotal), f6(msAvg.commercial.bids.find((b) => b.id === 'MS4').evaluatedCost), f6(msAvg.commercial.bids.find((b) => b.id === 'MS2').evaluatedCost), msAvg.award],
  ['highest', f6(msHigh.commercial.bids.find((b) => b.id === 'MS4').omissionTotal), f6(msHigh.commercial.bids.find((b) => b.id === 'MS4').evaluatedCost), f6(msHigh.commercial.bids.find((b) => b.id === 'MS2').evaluatedCost), msHigh.award],
]);
w();
w(`The rule decides the award. ${refCap('honest')} reads why the course grades only the cited rule.`);
w();
const PASS_HIGH = 90;
const nobody = success('evaluateTender with nobody passing', T.evaluateTender({ ...clone(TENDER_WS), passMark: PASS_HIGH }));
w(`WHEN NOBODY PASSES (stated: the well services tender at a pass mark of ${PASS_HIGH}): award ${S(nobody.award)}, commercial ${S(nobody.commercial)}; reason (engine), verbatim: ${nobody.reason}.`);
must('nobody passing opens no envelope', nobody.award === null && nobody.commercial === null && nobody.technical.passed.length === 0, nobody.reason);
w();
const LATE = { minWeeks: 2, maxWeeks: 5, ratePerWeek: 0.005 };
const allLate = success('evaluateTender with every opened bid late', T.evaluateTender({ ...clone(TENDER_WS), schedule: clone(LATE) }));
const lateRefused = T.evaluateTender({ ...clone(TENDER_WS), schedule: { ...WS.schedule, maxWeeks: LATE.maxWeeks } });
refusal('evaluateTender maxWeeks below the fixture minWeeks', lateRefused, 'schedule.maxWeeks');
w(`WHEN EVERY OPENED BID IS REJECTED AT THE COMMERCIAL STAGE (stated: the same tender with minWeeks ${LATE.minWeeks}, maxWeeks ${LATE.maxWeeks} and ratePerWeek ${LATE.ratePerWeek}, so every passing bid is late; with the fixture's minWeeks ${WS.schedule.minWeeks} left in place the engine refuses instead: "${lateRefused.error}"): award ${S(allLate.award)}; reason (engine), verbatim: ${allLate.reason}. Each late bid's exclusion, verbatim:`);
allLate.excluded.filter((x) => x.stage === 'commercial').forEach((x) => quote(`${x.id}: ${x.reason}`));
must('every opened bid rejected leaves no award', allLate.award === null && allLate.commercial.bids.length === 0, allLate.reason);

/* ============================================================ SECTION 21 */

section('honest', 'Reading the engine honestly: cited readings, the uncited option, an erratum and printed figures', ['Expert m05']);
w('THE CITED READINGS. Every rule the engine applies is tied to a cited text (' + ref('sources') + '). Where a text leaves a choice open, the engine either states the reading it takes, in its basis or reason, or makes the choice a required input:');
w();
table(['question the text leaves open', 'what the engine does'], [
  ['which bids price an omitted item', 'the other bids still responsive at that point; a bid never prices its own omission (' + ref('evaluated') + ')'],
  ['what the completion-time rate is applied to', 'the corrected price less the unconditional discount, stated in every schedule reason'],
  ['"within 1 % of each other", "closest competitor", "at least 5% higher" (s.14)', 'the first two read as stated in every reason; the third is the required input ncLeadBasis, points or relative (' + ref('s14') + ')'],
  ['how to add man-hours to tonnes', 'a weighted mean with the bid\'s stated weights (' + ref('content') + ')'],
  ['which standard deviation the relative ALB test uses', 'the population standard deviation, as the Guidance\'s own Annex I Example 1 computes it (' + ref('alb') + ')'],
  ['the pass mark, the weights, the technical weight, the band', 'required inputs with no default (' + ref('refusals') + ')'],
]);
w();
const wsHigh = success('evaluatedCosts on the well services tender, highest rule', T.evaluatedCosts({ ...clone(EC_WS), omissionRule: 'highest' }));
w('THE UNCITED OPTION. The omission rule of the World Bank SPDs (ITB 34.1) is the AVERAGE price quoted by the substantially responsive bidders, and it is the engine\'s default. The engine also accepts `highest`, which no text read uses, and says so in its own words. Its basis and its reason on the well services tender, verbatim:');
quote(wsHigh.basis.omission);
quote(`WS3: ${wsHigh.bids.find((b) => b.id === 'WS3').omissions[0].reason}`);
must('the highest option says the cited texts do not use it', /which the cited texts do not use/.test(wsHigh.basis.omission) && /which the cited texts do not use/.test(wsHigh.bids.find((b) => b.id === 'WS3').omissions[0].reason), 'uncited');
w();
w(`Under 'highest' WS3's nitrogen is priced at ${f6(wsHigh.bids.find((b) => b.id === 'WS3').omissionTotal)} where the average gives ${f6(ws3.omissionTotal)}; on the materials tender the rule moves the award (${ref('whole')}). This course teaches and grades the cited rule only; 'highest' is shown so a reader of the engine knows it is there and what it says about itself. A rule the engine is asked for by a name it does not hold is refused, verbatim:`);
quote(T.evaluatedCosts({ ...clone(EC_WS), omissionRule: 'lowest' }).error);
w();
w('A PRICE-SCORING METHOD WITH NO PUBLISHED FORMULA IS NOT OFFERED. Average-price scoring methods (a score that falls as a price moves away from the mean of the prices) are described and warned against by Kiiver and Kodym (2015) and by Chen (2008); neither prints a formula, and no text read does. The engine offers `lowest-ratio` (the World Bank\'s) and `linear` (the family Kiiver and Kodym describe) and refuses any other name, verbatim:');
quote(T.rankTender({ ...clone(RANK_WS), priceMethod: 'mean-deviation' }).error);
w();
const anB = an2.bids.find((x) => x.id === 'B');
w(`AN ERRATUM IN THE GUIDANCE. The World Bank Guidance, Annex 2, prints Company B's criterion scores as ${list(Object.values(PUB.annex2.bids[1].scores))} and its total as ${PUB.annex2PrintedB} (source). The printed scores sum to ${anB.technicalPercent} (the engine's total on them, ${ref('technical')}), below the threshold of ${PUB.annex2.passMark}, so on its own printed scores B fails the threshold with A. The Guidance names only A as rejected. The outcome it states, C first, is the same either way:`);
w();
table(['company', 'printed scores (source)', 'total the Guidance prints (source)', 'total on the printed scores (engine)', `status at ${PUB.annex2.passMark} (engine)`], PUB.annex2.bids.map((b) => { const r = an2.bids.find((x) => x.id === b.id); return [b.id, Object.values(b.scores).join(', '), b.id === 'B' ? S(PUB.annex2PrintedB) : S(r.technicalPercent), f6(r.technicalPercent), r.status]; }));
must('the erratum: printed 82, engine 77', an2.bids.find((x) => x.id === 'B').technicalPercent === 77 && PUB.annex2PrintedB === 82, 'erratum');
w();
w('A reader who finds a source that disagrees with itself records both figures and which one the engine uses; the course does the same.');
w();
w(`PRINTED FIGURES AND EXACT FIGURES. The Guidance prints Figures X to XII to two decimals. None of its printed combined scores is the exact figure: some are truncated (the third decimal dropped) and some rounded up. Company C's technical figure is printed ${PUB.figXPrinted.technicalWeighted.C} in Figure X and ${PUB.figXPrinted.cFigXII} in Figure XII for the same quantity (source):`);
w();
const kind2 = (printed, exact) => (printed === Math.floor(exact * 100) / 100 ? 'truncated' : printed === Math.ceil(exact * 100) / 100 ? 'rounded up' : printed === exact ? 'exact' : 'other');
const pxRows = fx.bids.map((b) => [b.id, f6(b.combinedScore), S(PUB.figXPrinted.combined[b.id]), f6(PUB.figXPrinted.combined[b.id] - b.combinedScore), kind2(PUB.figXPrinted.combined[b.id], b.combinedScore)]);
table(['company', 'B exact (engine)', 'B printed (source)', 'printed less exact (derived)', 'how it was printed (derived)'], pxRows);
must('no printed combined figure is the exact one', fx.bids.every((b) => PUB.figXPrinted.combined[b.id] !== b.combinedScore), 'none exact');
must('D and C are rounded up, B and A truncated', pxRows.map((r) => r[4]).join() === 'rounded up,rounded up,truncated,truncated', pxRows.map((r) => r[4]).join());
w();
w('Two figures that print alike at two decimals are not the same figure. A capstone field is quoted to six decimals as the panel prints it, and a printed source figure is quoted as the source prints it, labelled as the source\'s.');
w();
w(`KIIVER AND KODYM'S OWN LINE. Their text says that "under linear conditions" bid B would receive ${PUB.kkLinearPrinted} points (source), which is the straight line drawn between A's ${PUB.kkPrinted.A} and C's ${PUB.kkPrinted.C}. The engine's linear method gives the dearest bid ${f6(kkl.bids.find((b) => b.id === 'C').commercialScore)}, the family their text describes, so B scores ${f6(kkl.bids.find((b) => b.id === 'B').commercialScore)} on it (${ref('band')}). The engine has no method that reproduces their ${PUB.kkLinearPrinted}, and the course does not claim one.`);
w();
w('THE EDITIONS. The World Bank Regulations were read in their Seventh Edition (September 2025); the Sixth (February 2025) is superseded and none of the evaluation rules used here changed between them. The content Schedule is the 2010 Act\'s as enacted; any later Board target must be read and cited before it enters (' + ref('content') + ').');
must('FINDINGS records the superseded sixth edition', /the 6th, February 2025, was also fetched and is superseded/.test(FINDINGS), 'sixth');

/* ============================================================ SECTION 22 */

section('boundaries', 'Boundaries, rule by rule, and the twelve-digit tie key', ['Expert m05']);
w('Every rule the engine applies has its own boundary; no single rule covers them all. Each row below was probed by a call when this digest was built:');
w();
const W_PROBE = [10.0000000001, 10.000000002];
const wOk = T.technicalEvaluation(mut(TECH_WS, (a) => { a.criteria[4].weight = W_PROBE[0]; }));
const wNo = T.technicalEvaluation(mut(TECH_WS, (a) => { a.criteria[4].weight = W_PROBE[1]; }));
const wSum = (x) => WS_CRIT.slice(0, 4).reduce((t, c) => t + c.weight, 0) + x;
must('weights within 1e-9 of 100 are accepted and beyond are refused', !wOk.error && wNo.field === 'criteria', `${wOk.error} ${wNo.error}`);
const SCHED_PROBE = { schedule: { minWeeks: 4, maxWeeks: 8, ratePerWeek: 0.01 }, bids: [
  { id: 'AT-MAX', receivedAt: TIE_ALT, lines: [{ id: 'a', quantity: 1, unitRate: 1000, quotedAmount: 1000 }], completionWeeks: 8 },
  { id: 'BEYOND', receivedAt: TIE_ALT, lines: [{ id: 'a', quantity: 1, unitRate: 900, quotedAmount: 900 }], completionWeeks: 8.5 },
  { id: 'EARLY', receivedAt: TIE_ALT, lines: [{ id: 'a', quantity: 1, unitRate: 1050, quotedAmount: 1050 }], completionWeeks: 3 },
  { id: 'AT-MIN', receivedAt: TIE_ALT, lines: [{ id: 'a', quantity: 1, unitRate: 1060, quotedAmount: 1060 }], completionWeeks: 4 },
] };
const sched = success('evaluatedCosts at the schedule boundaries', T.evaluatedCosts(clone(SCHED_PROBE)));
const wk = (id) => SCHED_PROBE.bids.find((b) => b.id === id).completionWeeks;
const sRow = (id) => sched.bids.find((b) => b.id === id);
must('at maxWeeks responsive, beyond rejected, at or before minWeeks nothing added', sRow('AT-MAX') && sRow('AT-MAX').scheduleAdjustment === 40 && sched.excluded.some((x) => x.id === 'BEYOND') && sRow('EARLY').scheduleAdjustment === 0 && sRow('AT-MIN').scheduleAdjustment === 0, 'schedule');
const TIE12 = [1000000.0000001, 1000000];
const NOTIE = [1000000.00001, 1000000.0001];
const oneLine = (id, c) => ({ id, receivedAt: TIE_ALT, lines: [{ id: 'a', quantity: 1, unitRate: c, quotedAmount: c }] });
const tie12 = success('evaluatedCosts at the twelve-digit tie', T.evaluatedCosts({ bids: [oneLine('B', TIE12[0]), oneLine('A', TIE12[1])] }));
must('two costs equal to 12 digits tie and the id decides', tie12.bids[0].id === 'A' && tie12.bids[1].tieBrokenBy === 'bidder id' && tie12.bids[0].evaluatedCost !== tie12.bids[1].evaluatedCost, tie12.bids.map((b) => b.id).join());
const tie13 = success('evaluatedCosts one place wider than the tie', T.evaluatedCosts({ bids: [oneLine('B', NOTIE[0]), oneLine('A', NOTIE[1])] }));
must('costs apart at the twelfth digit do not tie', tie13.bids[0].id === 'B' && tie13.bids[1].tieBrokenBy === null, tie13.bids.map((b) => b.id).join());
const ALB_EDGE = { estimate: 2000000, bids: [{ id: 'AT', evaluatedCost: 1600000 }, { id: 'ABOVE', evaluatedCost: 1600001 }] };
const albAbs = success('abnormallyLow exactly 20 percent', T.abnormallyLow(clone(ALB_EDGE)));
must('exactly 20 percent below is flagged, one unit less is not', albAbs.flagged.join() === 'AT', albAbs.flagged.join());
const ALB_REL = { low: 99, high: 101, each: 5 };
const albRel = success('abnormallyLow relative at the limit', T.abnormallyLow({ bids: ['L', 'H'].flatMap((h) => Array.from({ length: ALB_REL.each }, (_, i) => ({ id: `${h}${i + 1}`, evaluatedCost: h === 'L' ? ALB_REL.low : ALB_REL.high }))) }));
must('a price equal to mean less one SD is not flagged', albRel.limit === 99 && albRel.flagged.length === 0 && albRel.approach === 'relative', `${albRel.limit} ${albRel.flagged}`);
const nBids = (n) => Array.from({ length: n }, (_, i) => ({ id: `N${i + 1}`, evaluatedCost: 90 + i }));
const albFour = success('abnormallyLow four bids', T.abnormallyLow({ estimate: 100, bids: nBids(D.ALB_RELATIVE_MIN_BIDS - 1) }));
const albFive = success('abnormallyLow five bids', T.abnormallyLow({ bids: nBids(D.ALB_RELATIVE_MIN_BIDS) }));
must('four bids absolute, five relative', albFour.approach === 'absolute' && albFive.approach === 'relative', `${albFour.approach} ${albFive.approach}`);
const lumpLoss = ct.types.lumpSum.contractorMargin;
const e14 = (k) => EDGE.find((x) => x[0] === k)[2];
const ws1pump = nc0.bids.find((b) => b.id === 'WS1').items.find((x) => x.id === 'pumping');
table(['rule', 'at the boundary (probed)', 'engine result'], [
  ['arithmetic discrepancy', `a gap EQUAL to the tolerance (1 x ${TOL_PROBE.rates[0]} quoted ${TOL_PROBE.quoted}, tolerance ${TOL_PROBE.tolerance})`, `not corrected (rule ${S(tolEq.lines[0].rule)})`],
  ['technical pass mark', `a score EQUAL to the pass mark (WS5 at ${f6(wsTech.bids.find((b) => b.id === 'WS5').technicalPercent)})`, 'passes'],
  ['criterion weights', `weights summing to ${wSum(W_PROBE[0])}, then ${wSum(W_PROBE[1])} (tolerance ${D.WEIGHT_SUM_TOLERANCE})`, `the first accepted; the second refused: ${wNo.error}`],
  ['completion time', `EQUAL to maxWeeks ${SCHED_PROBE.schedule.maxWeeks}; ${wk('BEYOND')} weeks; ${wk('EARLY')} weeks; EQUAL to minWeeks ${SCHED_PROBE.schedule.minWeeks} (stated, rate ${SCHED_PROBE.schedule.ratePerWeek})`, `${wk('AT-MAX')} weeks responsive with ${f6(sRow('AT-MAX').scheduleAdjustment)} added; ${wk('BEYOND')} weeks excluded; ${wk('EARLY')} and ${wk('AT-MIN')} weeks nothing added and no credit`],
  ['high value', `an estimated cost EQUAL to US$${D.HIGH_VALUE_USD}`, 'high value'],
  ['weighting range', `a technical weight EQUAL to the lower end ${EDGE_TW} of cell ${edge.cell}`, 'inside'],
  ['ties', `costs ${TIE12[0]} and ${TIE12[1]} (equal to ${D.TIE_DIGITS} significant digits)`, `tie; the bidder id decides (${list(tie12.bids.map((b) => b.id))})`],
  ['no tie', `costs ${NOTIE[0]} and ${NOTIE[1]} (apart at the twelfth digit)`, `no tie; the lower cost first (${list(tie13.bids.map((b) => b.id))})`],
  ['content minimum', `content EQUAL to the minimum (WS1 pumping at ${f6(ws1pump.ncPct)})`, 'meets it'],
  ['s.14 group', `EXACTLY ${D.NC_PRICE_MARGIN_PCT} percent above the lowest (${e14('exactly the margin above the lowest')[1][1]} against ${e14('exactly the margin above the lowest')[0][1]}); one unit more`, 'in; out'],
  ['s.14 lead, points', `EXACTLY ${D.NC_LEAD_PCT} percentage points (${e14('a lead of exactly the stated points')[1][2]} against ${e14('a lead of exactly the stated points')[0][2]})`, 'applies'],
  ['s.14 lead, relative', `EXACTLY ${D.NC_LEAD_PCT} percent of the runner-up (${e14('the same lead, read as relative (exactly the stated percent of the runner-up)')[1][2]} against ${e14('the same lead, read as relative (exactly the stated percent of the runner-up)')[0][2]})`, 'applies'],
  ['s.14 shared top', 'two bids share the highest content', 'no single leader; the lowest stands'],
  ['s.16 margin', `EXACTLY ${D.INDIGENOUS_MARGIN_PCT} percent above the lowest (${s16c('I10')} against ${s16c('LO')}); one unit more`, 'protected; not protected'],
  ['should-cost band', `a ratio EQUAL to either limit (${SC_EDGE.band.low}, ${SC_EDGE.band.high})`, 'inside, no flag'],
  ['ALB absolute', `EXACTLY ${D.ALB_ABSOLUTE_PCT} percent below the estimate (${ALB_EDGE.bids[0].evaluatedCost} against ${ALB_EDGE.estimate}); one unit more`, `flagged; not flagged (${list(albAbs.flagged)})`],
  ['ALB relative', `a price EQUAL to the mean less one SD (${ALB_REL.each} bids at ${ALB_REL.low}, ${ALB_REL.each} at ${ALB_REL.high}: limit ${f6(albRel.limit)})`, 'not flagged'],
  ['ALB approach', `${D.ALB_RELATIVE_MIN_BIDS - 1} responsive bids; ${D.ALB_RELATIVE_MIN_BIDS}`, `${albFour.approach}; ${albFive.approach}`],
  ['contract margin', `a margin of exactly ${f6(ctFlat.types.reimbursable.contractorMargin.mean)}`, 'not a loss'],
  ['overrun', 'a cost EQUAL to the planned cost', 'not an overrun'],
]);
w();
w(`THE TIE KEY. Two figures tie when Number(x.toPrecision(${D.TIE_DIGITS})) agrees. The stated costs ${S(TIE12[0])} and ${S(TIE12[1])} are different doubles (the engine returns both as typed); they tie because both keys are ${key12(TIE12[0]).toPrecision(D.TIE_DIGITS)}. The stated costs ${S(NOTIE[0])} and ${S(NOTIE[1])} have the keys ${key12(NOTIE[0]).toPrecision(D.TIE_DIGITS)} and ${key12(NOTIE[1]).toPrecision(D.TIE_DIGITS)}, so they do not tie. The ranking then uses the stated tie-break, and tieBrokenBy names it. A tie is a stated rule. The engine makes no guess.`);
must('the no-tie pair has different keys', key12(NOTIE[0]) !== key12(NOTIE[1]), 'keys');
must('the engine returns the tied costs as typed', tie12.bids.find((b) => b.id === 'B').evaluatedCost === TIE12[0] && tie12.bids.find((b) => b.id === 'A').evaluatedCost === TIE12[1], 'typed');
must('the tie key agrees', key12(TIE12[0]) === key12(TIE12[1]), 'key');
w();
w('ONE MORE BOUNDARY IS A PROPERTY OF DOUBLES. A limit a person types (a tolerance, a band) is compared in binary floating point; the course\'s validation record states that the engine and its independent oracle agree except within one unit in the last place of such a limit. Every boundary above was probed with figures exactly representable or far from that unit.');
must('FINDINGS states the one-unit caveat', /within one unit in the\s+last place of the limit/.test(FINDINGS), 'ulp');

/* ============================================================ SECTION 23 */

section('caps', 'Size caps, each refused with the cap in the message', ['Expert m05']);
const capBids = Array.from({ length: D.MAX_BIDS + 1 }, (_, i) => ({ id: `B${i}`, technicalPercent: 50, evaluatedCost: 1000 + i, receivedAt: TIE_ALT }));
const CAPS = [
  ['MAX_BIDS', 'rankTender with 101 bids', T.rankTender({ bids: capBids, technicalWeight: 0.5, priceMethod: 'linear', technicalMethod: 'relative' }), 'bids'],
  ['MAX_CRITERIA', 'technicalEvaluation with 51 criteria', T.technicalEvaluation({ passMark: 0, criteria: Array.from({ length: D.MAX_CRITERIA + 1 }, (_, i) => ({ id: `c${i}`, weight: 100 / 51, maxScore: 1 })), bids: [{ id: 'A', scores: {} }] }), 'criteria'],
  ['MAX_LINES', 'correctArithmetic with 5001 lines', T.correctArithmetic({ lines: Array.from({ length: D.MAX_LINES + 1 }, (_, i) => ({ id: `l${i}`, quantity: 1, unitRate: 1, quotedAmount: 1 })) }), 'lines'],
  ['MAX_ITEMS', 'nigerianContent with 201 items', T.nigerianContent({ items: Array.from({ length: D.MAX_ITEMS + 1 }, (_, i) => ({ id: `i${i}`, scheduleLine: 'valves' })), bids: [] }), 'items'],
  ['MAX_YEARS', 'evaluatedCosts with a 101-year life cycle', T.evaluatedCosts({ ...clone(EC_MS), lifeCycle: { years: D.MAX_YEARS + 1, discountRate: 0.1 } }), 'lifeCycle.years'],
  ['MAX_ITERATIONS', 'contractTypes with 200001 iterations', T.contractTypes({ ...clone(CT_WS), iterations: D.MAX_ITERATIONS + 1 }), 'iterations'],
];
table(['cap', 'value', 'stated call over the cap', 'the engine\'s message, verbatim'], CAPS.map(([k, what, r, field]) => { refusal(`cap ${k}`, r, field); return [`\`${k}\``, S(D[k]), what, r.error]; }));
w();
w('A panel stays well inside these caps; the Monte Carlo cap is the one a learner can reach by typing, and the engine names it in the refusal.');

/* ============================================================ SECTION 24 */

section('choices', 'Conventions that are choices, what the engine does not build, and the evaluation report', ['Expert m06']);
w('CONVENTIONS THAT ARE CHOICES. Each of these is the engine\'s stated choice where no text fixes one; a different choice would move a figure, so each is named in any report that quotes the figure:');
w();
table(['convention', 'the engine\'s choice', 'where it comes from'], [
  ['arithmetic tolerance', `${D.ARITHMETIC_TOLERANCE}, a gap above it is corrected`, 'engine convention (half a cent)'],
  ['ties', `${D.TIE_DIGITS} significant digits; then the lower evaluated cost, the earlier receipt, the bidder id`, 'engine convention; no text read states a tie-break'],
  ['completion-time base', 'corrected price less the discount', 'engine convention; the SPD gives the rate without its base'],
  ['who prices an omission', 'the other bids still responsive', 'engine reading of ITB 34.1'],
  ['overall content across units', 'weighted mean with stated weights', 'engine convention; the Act has no rule'],
  ['the s.14 group', `within ${D.NC_PRICE_MARGIN_PCT} percent of the lowest`, 'engine reading of s.14, stated in every reason'],
  ['the plan of a contract', 'the modes, unless a plan is stated', 'engine convention'],
  ['an overrun', 'a contractor cost above the planned cost', 'engine convention'],
  ['cost percentiles', 'exceedance labels; floor-index percentiles', 'lib/conventions/percentile.js and lib/stats basicStats'],
  ['the should-cost band', 'stated by the user, both limits inside', 'no published threshold'],
  ['the ALB standard deviation', 'population', 'World Bank ALB Guidance Annex I Example 1'],
]);
w();
w('WHAT THE ENGINE DOES NOT BUILD, each taught as a concept only, with where it would come from (source, read and not computed):');
w('- Domestic preference: the World Bank Regulations para 5.52 margin of preference for domestic goods and works in Bank-financed international competition; the Public Procurement Act 2007 s.34 leaves Nigerian margins to regulations of the Bureau of Public Procurement, which were not read.');
w('- Words against figures: the SPD ITB 35.1(c) rule for an amount in words that differs from the amount in figures.');
w('- The Board\'s approval steps under the content Act (s.17 to s.24), and the Nigerian Content Development Fund deduction (s.104).');
w('- Negotiation, a best and final offer, and awards split into lots.');
w('- Any Nigerian content target set after the 2010 Act; such a target enters as a stated target with its source.');
must('FINDINGS lists the same not-implemented items', /Not implemented, taught as concept only/.test(FINDINGS) && /s\.104/.test(FINDINGS) && /s\.17/.test(FINDINGS) && /5\.52/.test(FINDINGS), 'not built');
w();
w('WRITING THE EVALUATION REPORT names: the tender, its scope and its award basis; every source applied with its edition and the date read; the criteria, weights, maximum scores and the pass mark; each bid\'s technical percentage and every exclusion with its stage and reason in the engine\'s words; the arithmetic corrections with the rule applied; each term of the evaluated cost, with the omission rule, the schedule rate and its base, and the life-cycle years and rate; the technical weight inside its para 5.50 range and the price and technical methods; any bid to clarify as abnormally low and the approach used; the Nigerian content by item and overall, in its measured units, with the s.14 reading stated and the s.16 rows; for a contract comparison the seed, the iterations, the plan and the percentile definition beside every cost percentile; and the should-cost with its band.');

/* ============================================================ SECTION 25 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Six words in this course carry a narrower meaning than they have in conversation or elsewhere in the academy. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it can mean elsewhere', 'the rule here'], [
  ['responsive', 'any bid that answered the invitation', 'a bid still in the evaluation at that stage: it passed the technical envelope and was not rejected at the commercial stage'],
  ['lowest evaluated cost', 'the cheapest price', 'the lowest evaluated cost as the engine builds it (corrected price, discount, deviations, omissions, schedule, life cycle); never the quoted price'],
  ['most advantageous', 'the best bid in any sense', 'the highest combined score under a stated technical weight and stated methods'],
  ['content', 'any local participation', 'Nigerian content, a percentage in the measured unit the Schedule names for the item, stated as by item or overall'],
  ['P90', 'the high case', `for a cost, the LOW figure: a ${PCT_P90} percent probability of meeting or exceeding it; every cost percentile is printed beside that definition`],
  ['should-cost', 'a budget, or any estimate', 'the company\'s independent estimate built from the programme through wellCost and the AFE rollup; never a bid'],
]);
w();
w('A FIGURE THAT DEPENDS ON A SETTING is quoted with it: an evaluated cost with its omission rule, schedule and life cycle; a combined score with its technical weight and methods; an s.14 outcome with its reading; a contract cost with its seed and iterations.');


/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', process.env.SC2_DUMP_PARTIAL || unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', process.env.SC2_DUMP_PARTIAL || SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
// The engine's own refusal says "the 'relative' technical score is undefined"; it is quoted verbatim and exempt.
const bare = (l) => l.replace(/the \x27relative\x27 technical score is undefined|the bid-to-estimate ratio is undefined/g, '');
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(bare(l))), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(bare(l))));
must('no em or en dash reaches the digest', !OUT.some((l) => /[–—]/.test(l)), OUT.find((l) => /[–—]/.test(l)));

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`sc2_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.SC2_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`sc2_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
