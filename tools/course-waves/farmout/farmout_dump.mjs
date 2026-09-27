// THE EC10 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S VALIDATION FILES ARE NOT TEACHING TRUTH. The oracle, the golden
// file's expected figures, the fixture README, the negative control and the
// engine's own source comments are PROVENANCE. Where they state a figure this
// file recomputes it through the engine on the vendored golden INPUTS, on the
// fixture, or on stated inputs, and prints it. FINDINGS-farmout.md is
// PROVENANCE too; the digest checks its source table and quotes one line.
//
// Usage:  sh /root/cat-wip-farmout/build_digest.sh > digest.tmp && mv digest.tmp digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE
// (engines/economics/farmout.js and the canonical functions it imports:
// applyJV and npv from cashflow.ts, rollback, evpi and evii from
// decisionTree.js, portfolioRiskMetrics from portfolio.js,
// calculatePartnerCosts from afe.js, carryRecovery and backIn from
// jointVenture.js), except where a line says "stated" (an input typed in this
// file and printed beside the call it went into), "golden input" (an input read
// from the vendored test-data/economics/goldens/farmout_cases.json, whose
// inputs are the Ekene synthetic fixture and stated probes), "fixture" (read
// from the vendored ekene-farmout file), "text" (a figure printed by a public
// text, quoted in concepts.json with its citation and verified against the
// text by quote_check.py, or typed here with its citation) or "derived"
// (arithmetic on engine values printed in the same block, with the arithmetic
// stated). Nothing here reads a clock, a random number, a locale or a network;
// TZ and LC_ALL are pinned by build_digest.sh. The one Monte Carlo the engine
// runs (riskSharing) is seeded by a stated seed, so its figures reproduce.
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
// THE DIGEST IS NOT THE CAPSTONE. This file never reads farmout_capstone.mjs,
// fields.json or the capstone cases, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.EC10_WAVE_DIR || '/root/cat-wip-farmout';
const { F: E, ROOT, ENGINE_REL } = await import(`${HERE}/farmout_engine.mjs`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/farmout_cases.json`, 'utf8'));
const FX = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/ekene-farmout/ekene-farmout.json`, 'utf8'));
const FXREADME = fs.readFileSync(`${ROOT}/test-data/economics/ekene-farmout/README.md`, 'utf8');
const NEGCONTROL = fs.readFileSync(`${ROOT}/tools/validation/economics/negcontrol_farmout.sh`, 'utf8');
const FINDINGS = fs.readFileSync(`${ROOT}/tools/validation/economics/FINDINGS-farmout.md`, 'utf8');
const CONCEPTS = JSON.parse(fs.readFileSync(process.env.EC10_CONCEPTS || `${HERE}/concepts.json`, 'utf8'));
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
const list = (a) => (a.length ? a.join(', ') : 'none');
const clone = (o) => JSON.parse(JSON.stringify(o));
const cell = (s) => String(s).replace(/\|/g, '/');
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
  'earning', 'promote', 'consideration', 'consent', 'after',
  'caps', 'drilltoearn', 'dealvalue', 'breakeven', 'fee', 'feetiming',
  'information', 'risk', 'pricing', 'aftercarry', 'readings', 'quirks', 'boundaries', 'notcomputed', 'sizecaps', 'choices',
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
const byId = (rows, id) => rows.find((x) => x.id === id);
const yr = (rows, y) => rows.find((x) => x.year === y);
const D = E.DEFAULTS;
const NG = E.NIGERIA_ASSIGNMENT;
const EXPORTS = [
  ['earningObligation', 'the earning obligation', 'parties, farmor, farminee, events, vesting, eventsCompleted, cashBonus, pastCosts', 'each event\'s split of its gross cost (what the farminee and the farmor pay, the carry, the promote and its ratio, the cap state), the other parties\' shares, the vested interest, the interests after the deal and the totals: consideration, farminee outlay, equivalent working interest'],
  ['dealValue', 'the value of the deal to each side', 'parties, farmor, farminee, project, deal', 'each position\'s success and dry-hole payoffs and EMV, the best action of each side, the transfer between the sides, the break-even promote, the break-even chance of success of each position and the consideration'],
  ['informationValue', 'the value of information to one side', 'parties, farmor, farminee, project, deal, side, information', 'the EMV without information, with perfect information and with the stated signal, EVPI, EVII and EVII net of its cost, and each signal\'s chance, posterior chance of success and best action'],
  ['interestValue', 'a price for an interest', 'project, interestPct, valueBasis, transaction', 'the 100% position, the value per percent of working interest on the risked and success-case bases, the value of the interest, and transaction ratios of stated inputs'],
  ['riskSharing', 'the risk each side carries', 'positions, correlation, seed, iterations', 'each position\'s EMV and standard deviation, and from a seeded Monte Carlo its chance of a loss and its low and high cases'],
  ['consentFee', 'the Nigerian assignment consent fee', 'licence, transactionValue, valueSource, intraGroup, basis, ratesPct, payment', 'the processing fee, the premium, the fee, and the payment status, surcharge days, surcharge and total paid'],
  ['developmentCarry', 'a development carry after the farm-in', 'parties, farmor, farminee, earnedPct, carriedPct, years, uplift, recoverFromPct, cap, discountRate, baseYear', 'the interests after the farm-in and the carry recovery ledger of the joint venture engine, with each party\'s cash flow and NPV where a rate is stated'],
  ['backInRight', 'a back-in after the farm-in', 'parties, farmor, farminee, earnedPct, backIn', 'the interests after the farm-in and the back-in of the joint venture engine: the interests after it, the refundable and excluded costs, the refund and its recovery'],
];

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# EC10 TEACHING DIGEST: Farm-ins, Farm-outs & Asset Valuation');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The oracle, the golden file\'s expected figures, the fixture README, the negative control and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every amount of money, value, EMV, payment, cost, carry, fee, surcharge, price, NPV, balance, percentage, share, interest, promote, ratio, probability and chance prints to SIX decimals; years, day counts, event counts, draws, seeds and whole inputs print as whole numbers; a figure of sixteen or more significant digits at six decimals prints with its thousands grouped by commas; an engine message, reason and basis is printed verbatim, figures and all. Inside a message the engine prints money rounded to the cent (half away from zero, trailing zeros dropped), a computed percentage, probability or ratio to six decimals (trailing zeros dropped), and a stated input as it was given.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines b7d305b (engines PRs #272, #273 and #274), ${engineLines} lines, with its whole runtime closure under its own root in the NextGen repository. It imports applyJV and npv from engines/economics/cashflow.ts, rollback, evpi and evii from engines/economics/decisionTree.js, portfolioRiskMetrics from engines/economics/portfolio.js, calculatePartnerCosts from engines/economics/afe.js, and carryRecovery and backIn from engines/economics/jointVenture.js, and nothing else. It makes no network call.`);
w();
w('# AN ENGINE COURSE. There is no Suite app for this course. Every practical runs in the course\'s own calculator panels, which call this same vendored engine on the learner\'s own deal terms.');
w();
w('# THE DATA. Every Ekene party, prospect, cost, cash flow, deal term and price is SYNTHETIC, written for this platform by a stated script. No real company, deal, prospect, price or regulator decision appears.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone case and no graded answer. The capstones run their own deals and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming the rule it applied and where the rule comes from, so the working can be printed.');
w();
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof E[name] === 'function', typeof E[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(E).filter((k) => typeof E[k] === 'function').length === EXPORTS.length, Object.keys(E).filter((k) => typeof E[k] === 'function').join(','));
w();
w('The stated constants, read from the exported `DEFAULTS` and `NIGERIA_ASSIGNMENT`:');
w();
const DSRC = {
  MAX_PARTIES: 'the most licence parties one call accepts',
  MAX_EVENTS: 'the most earning events one call accepts',
  MAX_YEARS: 'the most years of success-case cash flows one call accepts',
  MAX_SIGNALS: 'the most signals one information call accepts',
  MAX_POSITIONS: 'the most positions one risk call accepts',
  MAX_HOLDINGS: 'the most holdings in one position',
  MAX_ITERATIONS: 'the most Monte Carlo draws one risk call accepts',
  MAX_DRAW_WORK: 'the most draws times holdings, over all positions, one risk call accepts',
  MAX_RESERVES: 'the most reserve categories one price call accepts',
  SUM_TOLERANCE: 'how far participating interests may sum from 100',
};
const NSRC = {
  processingFeePct: ['the processing fee, per cent of the value of the transaction', 'AOI 2024 reg. 19(2)'],
  premiumPct: ['the premium, per cent of the value of the transaction', 'AOI 2024 reg. 19(2)'],
  intraGroupProcessingFeePct: ['the processing fee on an intra group transfer, which pays no premium', 'AOI 2024 reg. 19(2), proviso'],
  payWithinDays: ['the days from the notification of the consent within which the fee is paid', 'AOI 2024 reg. 19(7)'],
  graceDays: ['the further days allowed after them', 'AOI 2024 reg. 19(8)'],
  surchargePctPerDay: ['the surcharge, per cent of the fee a day, straight line', 'AOI 2024 reg. 19(9)'],
  surchargeDays: ['the surcharge days, after which the consent is deemed withdrawn', 'AOI 2024 reg. 19(9)'],
  changeOfControlAbovePct: ['the voting power above which a change of control is an assignment', 'PIA s.95(14)'],
};
table(['constant', 'value', 'what it sets', 'where it comes from'], [
  ...Object.entries(D).map(([k, v]) => [`\`DEFAULTS.${k}\``, S(v), DSRC[k], k === 'SUM_TOLERANCE' ? 'engine convention' : 'cap']),
  ...Object.entries(NG).map(([k, v]) => [`\`NIGERIA_ASSIGNMENT.${k}\``, S(v), NSRC[k][0], NSRC[k][1]]),
]);
must('DEFAULTS carries ten values, each described here', Object.keys(D).length === 10 && Object.keys(D).every((k) => DSRC[k]), Object.keys(D));
must('NIGERIA_ASSIGNMENT carries eight values, each described and cited here', Object.keys(NG).length === 8 && Object.keys(NG).every((k) => NSRC[k]), Object.keys(NG));
must('DEFAULTS and NIGERIA_ASSIGNMENT are frozen', Object.isFrozen(D) && Object.isFrozen(NG), 'frozen');
must('NIGERIA_ASSIGNMENT carries the gazetted figures', NG.processingFeePct === 2 && NG.premiumPct === 5 && NG.intraGroupProcessingFeePct === 2 && NG.payWithinDays === 90 && NG.graceDays === 30 && NG.surchargePctPerDay === 0.01 && NG.surchargeDays === 90 && NG.changeOfControlAbovePct === 50, JSON.stringify(NG));
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports and its source:');
const IMPORTS = [...ENGINE_SRC.matchAll(/^import .* from \x27([^\x27]+)\x27;$/gm)].map((m) => m[1]);
must('the engine imports exactly cashflow.ts, decisionTree.js, portfolio.js, afe.js and jointVenture.js', IMPORTS.join() === './cashflow.ts,./decisionTree.js,./portfolio.js,./afe.js,./jointVenture.js', IMPORTS.join());
must('the engine source makes no network call, reads no clock and draws no random number of its own', !/\bfetch\x28|XMLHttpRequest|\bimport\x28|require\x28|Math\.random|Date\.now|new Date\x28\x29/.test(ENGINE_SRC), 'none');
w('- Its five imports are engines/economics/cashflow.ts (applyJV for the working-interest scaling, npv for the success-case value), engines/economics/decisionTree.js (rollback for every EMV, evpi and evii for the value of information), engines/economics/portfolio.js (portfolioRiskMetrics, the seeded Monte Carlo), engines/economics/afe.js (calculatePartnerCosts, the other parties\' cost shares) and engines/economics/jointVenture.js (carryRecovery and backIn after the farm-in). It carries no NPV, decision tree or Monte Carlo code of its own. The one function that samples is riskSharing, through the seeded portfolio Monte Carlo.');
w(`- It decides nothing a deal or a text does not state. Every share paid, interest earned, cap, overrun rule, vesting rule, cash bonus, reimbursement, chance of success, well cost, success-case value, signal likelihood, correlation, seed, draw count, value basis, uplift and value of the transaction is an input with no default, and a call without one is refused by name (${ref('refusals')}). The only figures it holds are the gazetted ones in \`NIGERIA_ASSIGNMENT\`, each cited above.`);
must('ACCEPTED_KEYS carries one shape for every exported function', Object.keys(E.ACCEPTED_KEYS).sort().join() === EXPORTS.map((x) => x[0]).sort().join() && Object.isFrozen(E.ACCEPTED_KEYS), Object.keys(E.ACCEPTED_KEYS).join());
w(`- It reads no key it does not know. \`ACCEPTED_KEYS\` is exported with one shape for each of the ${EXPORTS.length} functions, and every call refuses an input key the function does not read, at every level, naming the key, its path and the accepted keys. A misspelt optional key is refused; it never silently drops a term.`);
w(`- It decides no value of the transaction for the consent fee, prices no interest at a market value, discounts no well cost, and computes no decommissioning share and no tax on the deal. ${refCap('notcomputed')} lists each with where it would come from.`);
w(`- Its exported names are, in full: ${Object.keys(E).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

const PSU = { cite: 'Penn State EME 801, Lesson 6, Expected Monetary Value and Value at Risk (CC BY-NC-SA 4.0)', drill: 12500, farmOut: 17500, drillDry: -250000, drillProducer: 500000, farmOutDry: 0, farmOutProducer: 50000, producerPct: 35, dryPct: 65 };
section('sources', 'The sources, their editions and the date each was read', ['Associate m01 l04', 'Professional m05', 'Expert m05']);
w('THE RULE THIS COURSE FOLLOWS FOR EVERY LAW, REGULATION, GUIDE AND TEACHING TEXT IT USES. Each one is named with its edition or gazette date and the date it was read. Only publicly available texts are quoted, with their citation. Licensed model farm-out and operating agreements are taught by concept only and never quoted or named as a source. Every legal figure the engine applies was read from the cited text and is cited to its section or regulation; every deal term, rate, share, chance, cost and value is a required input with no default. Every text below was read on 2026-09-27.');
w();
const SOURCES = [
  ['Petroleum Industry Act 2021 (Act No. 6)', 'Official Gazette No. 142, Vol. 108, 27 August 2021', 's.94(4)(b), (5) and (8)(b), the farm-out; s.95(1) to (15), assignments and consent; s.233(10), decommissioning in a farm out agreement; s.264(f) and s.302(12)(c), fees for assigning rights not deductible', 'quoted, with citation'],
  ['Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024', 'S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 9 April 2024 (made 13 March 2024)', 'regs 3 and 4, the consent of the Minister and the application; regs 16 to 18, a PEL; reg. 19, the fee, the value of the transaction and the day rules; reg. 24, the definitions; the citation', 'quoted, with citation'],
  ['HM Revenue and Customs, Oil Taxation Manual', 'pages OT18320 and OT18360 (updated 23 January 2019), OT30020 (8 August 2019), OT30021 and OT30023 (2 February 2021), OT30022 (19 July 2023), OT30048 and OT30081 (1 May 2019), OT30131 (2 April 2019); Open Government Licence v3.0', 'farm in and earn-in, the work programme as consideration, cash reimbursement of sunk costs, a development carry recovered from production with an addition for interest, payback', 'quoted, with citation (OGL v3.0)'],
  ['Penn State EME 801: Energy Markets, Policy, and Regulation, Lesson 6, Expected Monetary Value and Value at Risk', 'the course page at courses.ems.psu.edu/eme801/node/578, prepared by Seth Blumsack and Mark Kleinginna; CC BY-NC-SA 4.0', 'the drill yourself or farm out problem: its printed payoffs, chances and EMVs, used as a cited numerical check', 'NUMBERS ONLY: the licence is non-commercial and this course is sold, so no sentence of it is quoted'],
];
table(['text', 'edition or date', 'what the course reads from it', 'how the course uses it', 'date read'], SOURCES.map((r) => [...r, '2026-09-27']));
const HMRC_DATES = { OT18320: '2019-01-23', OT18360: '2019-01-23', OT30020: '2019-08-08', OT30021: '2021-02-02', OT30022: '2023-07-19', OT30023: '2021-02-02', OT30048: '2019-05-01', OT30081: '2019-05-01', OT30131: '2019-04-02' };
// The HMRC page dates above are checked against the pinned pages by quote_check.py (the texts live only in the wave directory).
w();
must('FINDINGS records every source as read on 2026-09-27', FINDINGS.includes('## Sources (all read 2026-09-27)'), 'read date');
[['5d158ca8a16f00b2', 'the PIA 2021 PDF'], ['af705aca5707b7ad', 'the Regulations PDF'], ['5a6712149a249bf2', 'OT30021'], ['68a35945c48dd12f', 'OT18360'], ['191c65725eb41d52', 'the Penn State page']].forEach(([h, what]) => must(`FINDINGS records the sha256 prefix of ${what}`, FINDINGS.includes(h), h));
w('The validation record, FINDINGS-farmout.md, lists the same four texts with the sha256 of each file read, and this digest was checked against it when built.');
w();
w('WHERE NO PUBLIC TEXT PRINTS A WORKED SCHEDULE. The validation record states, verbatim:');
const NOPUB = FINDINGS.match(/No public text prints a farm-in schedule or a break-even promote: those goldens come from the stated deal arithmetic in the oracle\./);
must('FINDINGS records that no public farm-in schedule exists', !!NOPUB, 'no public schedule');
quote(NOPUB ? NOPUB[0] : '');
w('The earning obligation, cap, break-even, consent fee and carry figures of this course are therefore the stated deal arithmetic, run by the engine on stated terms. The one published worked figure is the Penn State problem, which ' + ref('dealvalue') + ' reproduces from its printed numbers.');
w();
w('The engine carries its citations in its own words. The `basis.source` of one call of each kind, verbatim:');
w();
const CITES = [
  ['earningObligation', runG('earn-ekene-single').basis.source],
  ['dealValue', runG('deal-ekene').basis.source],
  ['informationValue', runG('info-ekene-farminee').basis.source],
  ['interestValue', runG('interest-ekene-risked').basis.source],
  ['riskSharing', runG('risk-ekene').basis.source],
  ['consentFee', runG('fee-ekene').basis.source],
  ['developmentCarry', runG('devcarry-ekene').basis.source],
  ['backInRight', runG('backin-ekene').basis.source],
];
table(['call', 'the engine\'s basis.source, verbatim'], CITES);
w();
w('LICENSED TEXTS. No licensed model agreement is quoted anywhere in this course, and none is named as a source. Where a lesson needs an idea such agreements carry (a promote, a carry cap, drill-to-earn events), it teaches the idea from the public texts above and the engine\'s stated arithmetic. The informationValue source line names the textbooks the canonical decision tree follows; the course quotes neither and cites the engine line only as the engine prints it.');

/* ============================================================ SECTION 3 */

section('provisions', 'The provisions this course quotes, verbatim, with their citations', ['Associate m01 l04', 'Associate m05', 'Professional m05', 'Expert m05 l03']);
w(`Each provision below is quoted exactly from the text named in ${ref('sources')}, with whitespace collapsed; a dash the text prints is shown as a colon. Each is preceded by the course's plain paraphrase. A figure or a spelling the text prints is quoted as printed.`);
const GROUPS = [['PIA', 'THE PETROLEUM INDUSTRY ACT 2021'], ['AOI', 'THE NIGERIAN UPSTREAM PETROLEUM (ASSIGNMENT OF INTERESTS) REGULATIONS, 2024'], ['HMRC', 'HM REVENUE AND CUSTOMS, OIL TAXATION MANUAL (OPEN GOVERNMENT LICENCE V3.0)']];
GROUPS.forEach(([t, title]) => {
  w();
  w(`${title}:`);
  CONCEPTS.filter((c) => c.text === t).forEach((c) => { w(); cq(c.id); });
});
must('every concept belongs to one printed group', CONCEPTS.every((c) => GROUPS.some(([t]) => t === c.text)), 'groups');
w();
w(`${CONCEPTS.length} provisions quoted: ${list(GROUPS.map(([t]) => `${t} ${CONCEPTS.filter((c) => c.text === t).length}`))}.`);
w();
w('THE ACT\'S DEFINITION SITS IN ITS MARGINAL FIELD SECTION. Section 94(8) opens "For the purpose of this section", and s.94 is the marginal field section; the Act uses the word farm-out again in s.233(10) and in the tax sections without a second definition. The engine\'s arithmetic applies to any farm-out a caller states.');

/* ============================================================ SECTION 4 */

section('dataset', 'The Ekene Deep farm-out and what is planted in it', ['Associate m01 l03', 'Professional m03', 'Expert m01']);
w('Every deal in this course\'s teaching comes from one fixture file under test-data/economics/ekene-farmout, written by a stated script that reproduces it. It is labelled SYNTHETIC in the file:');
quote(FX.synthetic);
must('the fixture carries its SYNTHETIC statement and names its writer', FX.synthetic.startsWith('SYNTHETIC') && FX.generatedBy === 'tools/validation/economics/make_farmout_fixtures.py', FX.generatedBy);
w();
w(`THE PROSPECT (fixture): ${FX.prospect}. Money in ${FX.currency}, whole dollars.`);
w();
table(['party (fixture)', 'name (fixture)', 'participating interest before the farm-out'], [
  ...FX.parties.map((p) => [p.id, p.name, f6(p.participatingPct)]),
  [FX.farminee.id, FX.farminee.name, f6(0)],
]);
must('every fixture party name ends (synthetic)', [...FX.parties, FX.farminee].every((p) => /\(synthetic\)$/.test(p.name)), 'names');
w(`The farmor is ${FX.farmor}; the farminee is ${FX.farminee.id}.`);
w();
const dE = runG('deal-ekene');
w('THE PROSPECT\'S TERMS (fixture), each a term of the synthetic deal stated in the file:');
w(`- Chance of success ${f6(FX.project.chanceOfSuccessPct)} percent; exploration well ${f6(FX.project.wellCost.dry)} as a dry hole and ${f6(FX.project.wellCost.success)} when it finds oil and is tested and suspended.`);
w(`- Success case at 100 percent: net cash flows ${S(FX.project.successValue.cashFlows[0].year)} to ${S(FX.project.successValue.cashFlows[FX.project.successValue.cashFlows.length - 1].year)}, discounted at ${f6(FX.project.successValue.discountRate)} (a fraction) to ${S(FX.project.successValue.baseYear)} by the canonical npv: ${f6(dE.successValue100)} (engine).`);
w(`- The deal: ${FX.farminee.id} pays ${f6(FX.deal.farmineePaysPct)} percent of the exploration well to earn ${f6(FX.deal.earnedPct)} percent of the licence from ${FX.farmor}; cap on the ${FX.deal.cap.on} of ${f6(FX.deal.cap.amount)}, overrun rule "${FX.deal.cap.overrunRule}"; cash bonus ${f6(FX.deal.cashBonus)}; ${f6(FX.deal.pastCosts.reimbursedPct)} percent of ${f6(FX.deal.pastCosts.amount)} of past costs reimbursed; assignor fees ${f6(FX.deal.assignorFees)} (${ref('dealvalue')}).`);
w(`- Drill-to-earn: two events, ${FX.earning.drillToEarn.events.map((ev) => `"${ev.name}" (gross cost ${f6(ev.grossCost)}, ${f6(ev.farmineePaysPct)} percent paid to earn ${f6(ev.earnedPct)} percent, cap "${ev.cap.on}"${ev.cap.amount !== undefined ? ` of ${f6(ev.cap.amount)}` : ''})`).join(' and ')}, vesting "${FX.earning.drillToEarn.vesting}" (${ref('drilltoearn')}).`);
w(`- Consent: a ${FX.consent.licence}, value of the transaction ${f6(FX.consent.transactionValue)} ("${FX.consent.valueSource}"), intraGroup ${S(FX.consent.intraGroup)}, notified ${FX.consent.payment.notifiedOn} and paid ${FX.consent.payment.paidOn} (${ref('fee')}).`);
w(`- Information: a seismic survey costing ${f6(FX.information.cost)}, two signals, ${FX.information.signals.map((s) => `"${s.label}" with likelihoods ${f6(s.likelihoodsPct[0])} percent given success and ${f6(s.likelihoodsPct[1])} percent given a dry hole`).join(' and ')} (${ref('information')}).`);
w(`- Development carry: ${FX.farminee.id} carries ${f6(FX.developmentCarry.carriedPct)} percent of ${FX.farmor}'s cost share with a ${FX.developmentCarry.uplift.type} uplift of ${f6(FX.developmentCarry.uplift.ratePctPerYear)} percent a year, recovered from ${f6(FX.developmentCarry.recoverFromPct)} percent of ${FX.farmor}'s share of production (${ref('aftercarry')}).`);
w(`- Back-in: ${FX.backIn.backIn.party} backs in to ${f6(FX.backIn.backIn.targetPct)} percent, refund form "${FX.backIn.backIn.refundForm}" (${ref('aftercarry')}).`);
w(`- Risk: correlation ${f6(FX.risk.correlation)}, seed ${S(FX.risk.seed)}, ${S(FX.risk.iterations)} draws (${ref('risk')}).`);
w(`- Price: ${f6(FX.interestPrice.transaction.price)} stated for ${f6(FX.interestPrice.interestPct)} percent on the "${FX.interestPrice.valueBasis}" basis, with ${f6(FX.interestPrice.transaction.reserves[0].grossVolume)} ${FX.interestPrice.transaction.volumeUnit} of "${FX.interestPrice.transaction.reserves[0].category}" (${ref('pricing')}).`);
w();
const eS = runG('earn-ekene-single');
const dte = runG('earn-ekene-drill-to-earn');
const dteDone = runG('earn-ekene-drill-to-earn-done');
const dtePer = runG('earn-ekene-drill-to-earn-per-event');
const iF = runG('info-ekene-farminee');
const rE = runG('risk-ekene');
const devE = runG('devcarry-ekene');
const ipE = runG('interest-ekene-risked');
const PLANTED = [
  ['farming out beats drilling alone for EKO, and FIN\'s EMV at 40 for 30 is below 0, so FIN declines', 'dealValue best actions', dE.farmor.bestAction === 'farm out' && dE.farmor.farmOut.emv > dE.farmor.alone.emv && dE.farmineeSide.farmIn.emv < 0 && dE.farmineeSide.bestAction === 'decline'],
  ['FIN\'s break-even promote lies between its earned 30 percent and the 40 percent it is asked to pay', 'dealValue break-even promote', dE.breakEvenPromote.status === 'solved' && dE.breakEvenPromote.farmineePaysPct > 30 && dE.breakEvenPromote.farmineePaysPct < 40],
  ['the success well exceeds the gross-cost cap; the dry hole is below it', 'dealValue cap states', dE.wellCostSplit.success.capState === 'exceeded' && dE.wellCostSplit.dry.capState === 'below'],
  ['drill-to-earn: the appraisal well\'s carry reaches its carry-amount cap exactly', 'earningObligation cap state', dte.events[1].capState === 'exactly'],
  ['drill-to-earn: with "all-events" vesting and one event completed nothing vests; with both completed 35 percent vests; with "per-event" vesting and one completed 20 percent', 'earningObligation vesting', dte.vestedPct === 0 && dteDone.vestedPct === 35 && dtePer.vestedPct === 20],
  ['the seismic signal turns FIN\'s decision: farm in on the bright signal, decline on the dim one; the survey is worth buying at its stated cost', 'informationValue per signal', iF.perSignal[0].bestAction === 'farm in' && iF.perSignal[1].bestAction === 'decline' && iF.netEvii > 0],
  ['the farm-out lowers EKO\'s spread of outcomes and lifts its low case', 'riskSharing', rE.positions[1].stdDev < rE.positions[0].stdDev && rE.positions[1].p90 > rE.positions[0].p90],
  ['the development carry with its compound uplift is recovered in 2036', 'developmentCarry payout year', devE.recoveredInYear === 2036],
  ['the stated price is about two times the risked value per percent: a ratio of stated inputs, reported only', 'interestValue transaction ratio', ipE.transaction.priceToValue > 2 && ipE.transaction.priceToValue < 2.1],
];
table(['planted situation (fixture README)', 'found by'], PLANTED.map(([s, by]) => [s, by]));
PLANTED.forEach(([s, , ok]) => must(`planted: ${s}`, ok, s));
must('the fixture README records the planted situations', /## Planted situations/.test(FXREADME) && /recovered in 2036/.test(FXREADME), 'readme');
w();
w(`All ${PLANTED.length} planted situations are found by the engine behaviour named beside each (checked when this digest is built).`);

/* ============================================================ SECTION 5 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m04', 'Associate m06', 'Professional m01', 'Professional m02', 'Professional m03', 'Professional m05', 'Expert m01', 'Expert m02', 'Expert m03', 'Expert m04', 'Expert m06']);
w('A refusal is an object with `error` and `field`. The message starts with the name of the field it refuses and states the exact condition that failed: "<field> must <condition>; got <value>", the value as the engine prints it (a string in quotes, an absent value as nothing), or, for an unknown key, "<field> is not an accepted key; the accepted keys ... are ...". Each row below is a stated bad input from the golden file handed to the engine; the message is the engine\'s, verbatim. A result returned with a reason (an event not completed, a break-even that does not exist, a consent deemed withdrawn) is a result. It is no refusal.');
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
must('sixty-one refusal cases in the golden file', REF.length === 61, REF.length);
w();
w('REFUSALS A PANEL CONTROL CAN PRODUCE. Each calculator panel writes every required term into the box through a visible control, and setting a control to "not stated" removes the term. The calls below are not golden cases; each is a golden input with one term removed or changed (stated probes), handed to the engine here, and the message is the engine\'s, verbatim:');
w();
const dropAt = (o, path) => { const ks = path.split('.'); let t = o; ks.slice(0, -1).forEach((k) => { t = t[k]; }); delete t[ks[ks.length - 1]]; return o; };
const PANEL_REFUSALS = [
  ['earn-ekene-single', 'vesting removed (the vesting control set to not stated)', (a) => dropAt(a, 'vesting'), 'vesting'],
  ['earn-ekene-single', 'events[0].cap.overrunRule removed (the overrun rule control set to not stated)', (a) => dropAt(a, 'events.0.cap.overrunRule'), 'events[0].cap.overrunRule'],
  ['earn-ekene-single', 'events[0].cap set to { on: "carry-amount" } with the gross-cost overrun rule left in the box', (a) => { a.events[0].cap.on = 'carry-amount'; return a; }, 'events[0].cap.overrunRule'],
  ['deal-ekene', 'deal.cashBonus removed (the cash bonus control set to not stated)', (a) => dropAt(a, 'deal.cashBonus'), 'deal.cashBonus'],
  ['deal-ekene', 'project.chanceOfSuccessPct removed', (a) => dropAt(a, 'project.chanceOfSuccessPct'), 'project.chanceOfSuccessPct'],
  ['fee-ekene', 'basis removed (the fee basis control set to not stated)', (a) => dropAt(a, 'basis'), 'basis'],
  ['fee-ekene', 'transactionValue removed (the value of the transaction set to not stated)', (a) => dropAt(a, 'transactionValue'), 'transactionValue'],
  ['interest-ekene-risked', 'valueBasis removed', (a) => dropAt(a, 'valueBasis'), 'valueBasis'],
  ['risk-ekene', 'seed removed', (a) => dropAt(a, 'seed'), 'seed'],
  ['devcarry-ekene', 'recoverFromPct removed', (a) => dropAt(a, 'recoverFromPct'), 'recoverFromPct'],
];
table(['golden input', 'the change (stated probe)', 'field', 'the engine\'s message, verbatim'], PANEL_REFUSALS.map(([id, what, f, field]) => {
  const r = refusal(`${GC[id].fn} on ${id} with ${what}`, E[GC[id].fn](f(argsOf(id))), field);
  return [id, what, `\`${field}\``, r && r.error];
}));
w();
const orderProbe = argsOf('earn-ekene-single'); delete orderProbe.vesting; orderProbe.vest = 'per-event';
const orderR = refusal('earningObligation on earn-ekene-single with vesting removed and an unknown key vest added (stated probe)', E.earningObligation(orderProbe), 'vest');
w('THE ORDER OF REFUSALS. A box that carries an unknown key AND lacks a required term is refused on the unknown key first: every function checks its accepted keys before it reads a term. On earn-ekene-single with vesting removed and a key vest added (stated probe), the engine\'s message, verbatim:');
quote(orderR.error);
w();
w('Four rules the table shows:');
w('- A deal term with no default is refused when it is missing, and the message says so: the cap of every event, the overrun rule of a gross-cost cap, the vesting rule, the cash bonus and the past costs (stated as 0 when a deal has none), the assignor fees, the chance of success, both well costs, the success-case value, the side and the signals of an information call, the value basis, the correlation, the seed and the draws, the fee basis, whether a transfer is intra group, the uplift and the recovery share of a carry.');
w('- An input key a function does not read is refused at whatever level it sits (a top-level option, an event, a cap, a project, a signal, a holding), with the path to the key and the full list of accepted keys.');
w('- A term the gazetted fee sets is refused when a call states it under basis "nuprc-2024-r19": stated rates, or a PEL, whose consent is the Commission\'s and whose fee reg. 19(2) does not set.');
w('- A stated figure inside a message is printed as it was given; a computed one (an interest left to earn) prints to six decimals.');

/* ============================================================ SECTION 6 */

section('graded', 'What is graded, where the practicals run, and what is never graded', ['Associate m01 l05', 'Expert m06']);
w('EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED INPUTS. A capstone field, a question key and a panel figure are each computed by a function in the table of ' + ref('computes') + ' on deal terms written down in advance. No graded figure comes from the Monte Carlo of riskSharing, so the same terms give the same number on any machine, and there is exactly one right answer.');
w();
w('THE PRACTICALS RUN IN THE COURSE\'S OWN CALCULATOR PANELS. This is an engine course with no Suite app. Each tier has a calculator panel that calls this same vendored engine: the earning calculator (Associate), the deal calculator (Professional) and the valuation calculator (Expert). A learner types or pastes their own deal terms; the panel prints what the engine returns, every refusal in the engine\'s own words, and the reasons beside each figure.');
w();
w('WHAT A CAPSTONE STATES. Each capstone runs its own synthetic deal, which this digest does not print, and states every term a figure depends on: the parties and their participating interests, the farmor and the farminee, each event\'s gross cost, share paid, interest earned and cap, the vesting rule and the events completed, the cash bonus and past costs, the chance of success, the well costs and the success-case value, the signals and their cost, the interest priced and its basis and price, the carry\'s share, uplift and recovery share, the back-in target and costs, and the value of the transaction with its dates. Each graded figure is quoted to six decimals as the panel prints it.');
w();
w(`WHAT IS NEVER GRADED. No graded figure depends on a reading the engine states (${ref('readings')}): every capstone field is the same number under each reading the engine takes and under the alternative it names. No graded figure is a Monte Carlo draw: the chance of a loss and the low and high cases of ${ref('risk')} are taught and never graded.`);
w();
w('WHAT A COMPUTED FIGURE DOES NOT SAY. An EMV is what the stated chance and payoffs produce; a break-even is the point at which a stated EMV crosses 0; a value per percent is a stated value divided by 100; a transaction ratio is a stated price over a computed value. None is a forecast of what a partner will pay or a statement of market value. A value depends on the stated discount rate and base year. Each figure is quoted with its terms for that reason.');

/* ============================================================ SECTION 7 */

const EV_HEAD = ['golden case', 'event', 'gross cost', 'share paid', 'interest earned', 'held after', 'promote points', 'promote ratio', 'cap state', 'farminee pays', 'farmor pays', 'carry', 'share of the gross cost the farminee pays'];
const evRow = (id, ev) => [id, ev.name, f6(ev.grossCost), f6(ev.farmineePaysPct), f6(ev.earnedPct), f6(ev.heldAfterPct), f6(ev.promotePoints), f6(ev.promoteRatio), ev.capState, f6(ev.farmineePays), f6(ev.farmorPays), f6(ev.carry), f6(ev.effectivePayingPct)];
section('earning', 'The earning obligation of one event: the share paid, the interest earned and the other parties', ['Associate m02']);
w('THE RULE, in the engine\'s basis (earn-ekene-single), verbatim:');
quote(eS.basis.cap);
w();
w('THE OTHER PARTIES, verbatim:');
quote(eS.basis.split);
w();
const ev0 = eS.events[0];
w(`THE EKENE DEEP EARNING OBLIGATION (golden input earn-ekene-single, the fixture's single well): ${FX.farminee.id} pays ${f6(ev0.farmineePaysPct)} percent of the ${f6(ev0.grossCost)} well to earn ${f6(ev0.earnedPct)} percent from ${FX.farmor}'s ${f6(eS.farmorInterestBeforePct)} percent; the promote applies to the first ${f6(ev0.promotedCost)} (a gross-cost cap), and the excess of ${f6(ev0.excess)} is paid by the post-deal interests. Per event (engine):`);
w();
table(EV_HEAD, eS.events.map((ev) => evRow('earn-ekene-single', ev)));
w();
w(`The other party pays its own interest of the gross cost through the canonical partner split: ${ev0.others.map((o) => `${o.id} ${f6(o.pays)}`).join(', ')} (engine). The three payments total ${f6(ev0.farmineePays + ev0.farmorPays + ev0.others.reduce((s, o) => s + o.pays, 0))} (derived: ${f6(ev0.farmineePays)} + ${f6(ev0.farmorPays)} + ${f6(ev0.others[0].pays)}), the gross cost.`);
must('farminee, farmor and the other party pay the whole gross cost', Math.abs(ev0.farmineePays + ev0.farmorPays + ev0.others.reduce((s, o) => s + o.pays, 0) - ev0.grossCost) < 1e-6, ev0.farmineePays + ev0.farmorPays);
w();
w('The engine\'s reasons, verbatim:');
reasons(eS.reasons);
w();
const SIMPLE = ['earn-cap-gross-below', 'earn-third-for-a-quarter', 'earn-bonus-and-reimbursement', 'earn-none-completed'];
w(`SMALL CASES (golden inputs), each stated to show one rule. Parties ${argsOf('earn-cap-gross-below').parties.map((p) => `${p.id} ${S(p.participatingPct)}`).join(' and ')} percent unless the row says otherwise:`);
w();
table(EV_HEAD, SIMPLE.flatMap((id) => runG(id).events.map((ev) => evRow(id, ev))));
w();
SIMPLE.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons); });
const nc = runG('earn-none-completed');
must('an event not completed is reported as the obligation and pays nothing', nc.events[0].completed === false && nc.totals.farmineePays === 0 && nc.vestedPct === 0, JSON.stringify(nc.totals));
w();
w(`AN OBLIGATION AND A PAYMENT. Every event's split is reported as the obligation; the totals count completed events only. On earn-none-completed the event's split is computed (${f6(nc.events[0].farmineePays)} for ${FX.farminee.id}) and the totals are ${f6(nc.totals.farmineePays)} paid and ${f6(nc.vestedPct)} percent vested (engine).`);

/* ============================================================ SECTION 8 */

section('promote', 'The promote in points, the promote ratio and the carry inside a promote', ['Associate m03']);
w('THE PROMOTE, in the engine\'s basis (earn-ekene-single), verbatim:');
quote(eS.basis.promote);
w();
w('THE CARRY, verbatim:');
quote(eS.basis.carry);
w();
const PROM = ['earn-heads-up', 'earn-cap-gross-below', 'earn-third-for-a-quarter', 'earn-full-carry', 'earn-all-of-farmor'];
w('THE SAME WELL UNDER FIVE PROMOTES (golden inputs; a well of the stated gross cost, no cap unless the row states one):');
w();
table(EV_HEAD, PROM.flatMap((id) => runG(id).events.map((ev) => evRow(id, ev))));
w();
PROM.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons.slice(0, 1)); });
const hu = runG('earn-heads-up').events[0];
const fc = runG('earn-full-carry').events[0];
must('a heads-up deal has a promote of 0 points, a ratio of 1 and no carry', hu.promotePoints === 0 && hu.promoteRatio === 1 && hu.carry === 0, JSON.stringify(hu));
must('a full carry: the farmor pays 0', fc.farmorPays === 0 && fc.carry === (fc.farmineePaysPct - fc.earnedPct) * fc.grossCost / 100, JSON.stringify(fc));
w();
w(`HEADS UP. When the share paid equals the interest earned (earn-heads-up: ${f6(hu.farmineePaysPct)} for ${f6(hu.earnedPct)}), the promote is ${f6(hu.promotePoints)} points, the ratio ${f6(hu.promoteRatio)} and the carry ${f6(hu.carry)} (engine): the farminee pays its own share and nothing of the farmor's.`);
w(`A FULL CARRY. When the farminee pays the farmor's whole pre-deal interest (earn-full-carry: ${f6(fc.farmineePaysPct)} for ${f6(fc.earnedPct)}), the farmor pays ${f6(fc.farmorPays)} and the carry is ${f6(fc.carry)} (engine): the farmor's post-deal share of the well is paid in full by the farminee.`);
const tq = runG('earn-third-for-a-quarter').events[0];
w(`A THIRD FOR A QUARTER. On earn-third-for-a-quarter the farminee pays ${f6(tq.farmineePaysPct)} percent for ${f6(tq.earnedPct)} percent: a promote of ${f6(tq.promotePoints)} points and a ratio of ${f6(tq.promoteRatio)} (engine). The stated share is the double ${S(argsOf('earn-third-for-a-quarter').events[0].farmineePaysPct)}, which the engine's message prints as given.`);

/* ============================================================ SECTION 9 */

section('consideration', 'The cash bonus, the past-cost reimbursement, the consideration and the equivalent working interest', ['Associate m04']);
w('THE EQUIVALENT WORKING INTEREST, in the engine\'s basis (earn-ekene-single), verbatim:');
quote(eS.basis.equivalent);
w();
const CONS = ['earn-ekene-single', 'earn-bonus-and-reimbursement', 'earn-cap-gross-below', 'earn-heads-up'];
table(['golden case', 'cash bonus (golden input)', 'past costs (golden input)', 'reimbursed percent (golden input)', 'reimbursement', 'carry', 'consideration', 'farminee outlay', 'effective paying percent', 'equivalent working interest', 'promote-adjusted ratio'], CONS.map((id) => {
  const a = argsOf(id); const t = runG(id).totals;
  return [id, f6(a.cashBonus), f6(a.pastCosts.amount), f6(a.pastCosts.reimbursedPct), f6(t.pastCostReimbursement), f6(t.carry), f6(t.consideration), f6(t.farmineeOutlay), f6(t.effectivePayingPct), f6(t.equivalentWorkingInterestPct), f6(t.promoteAdjustedRatio)];
}));
CONS.forEach((id) => { const t = runG(id).totals; must(`consideration = carry + bonus + reimbursement on ${id}`, Math.abs(t.consideration - (t.carry + t.cashBonus + t.pastCostReimbursement)) < 1e-6, t.consideration); });
w();
const eT = eS.totals;
w(`THE EKENE DEEP CONSIDERATION (earn-ekene-single): ${FX.farmor} receives a carry of ${f6(eT.carry)}, a cash bonus of ${f6(eT.cashBonus)} and a reimbursement of ${f6(eT.pastCostReimbursement)} (${f6(argsOf('earn-ekene-single').pastCosts.reimbursedPct)} percent of ${f6(argsOf('earn-ekene-single').pastCosts.amount)}), a consideration of ${f6(eT.consideration)} (engine). ${FX.farminee.id}'s outlay is ${f6(eT.farmineeOutlay)}: the well payment ${f6(eT.farmineePays)} plus the bonus and the reimbursement. As a heads-up interest that outlay equals ${f6(eT.equivalentWorkingInterestPct)} percent of the ${f6(eT.grossCost)} well, and over the ${f6(eS.vestedPct)} percent vested it is a promote-adjusted ratio of ${f6(eT.promoteAdjustedRatio)} (engine).`);
w();
w('The consideration line of the engine\'s reasons, verbatim:');
quote(eS.reasons[eS.reasons.length - 1]);
w();
w(`HOW THE TEXTS DESCRIBE THE CASH. HMRC's manual describes a cash reimbursement of sunk costs for the interest acquired ("${dashfix(C('hmrc_ot30021_reimbursement').quote)}", ${C('hmrc_ot30021_reimbursement').cite}) and treats a reimbursement of earlier exploration or appraisal costs as cash consideration (${C('hmrc_ot30081_reimbursement').cite}). The bonus and the reimbursement are stated inputs; a deal with neither states both as 0, and the engine says so in a reason.`);
const bz = runG('earn-ekene-drill-to-earn');
must('a bonus stated as 0 is reported', bz.reasons.includes('cash bonus: none (stated as 0)'), 'bonus zero');
w('The reason for a bonus stated as 0 (earn-ekene-drill-to-earn), verbatim:');
quote('cash bonus: none (stated as 0)');

/* ============================================================ SECTION 10 */

section('consent', 'The consent process in words: an assignment, the Minister and the Commission, a change of control, the application', ['Associate m05']);
const feeE = runG('fee-ekene');
const TEXTFIG = { pelDays: 60, notifyDays: 15, deemedDays: 60 };
must('the text figures are the ones the quotations print', C('aoi_18_3_pel_decision').quote.includes(`within ${TEXTFIG.pelDays} working days`) && C('aoi_4_7_fifteen_days').quote.includes(`within ${TEXTFIG.notifyDays} working days`) && C('pia_95_7b_deemed').quote.includes(`within ${TEXTFIG.deemedDays} working days`), 'text figures');
w('THE CONSENT, in the engine\'s basis (fee-ekene), verbatim:');
quote(feeE.basis.consent);
w();
w('WHAT THE TEXTS SAY, each quoted in ' + ref('provisions') + ':');
w(`- Every assignment of an interest in a petroleum prospecting licence or petroleum mining lease needs the prior written consent of the Minister, granted on the Commission's recommendation (${C('pia_95_2_recommendation').cite}; ${C('aoi_4_2_application').cite}).`);
w(`- A change of control of the holder is an assignment (${C('pia_95_3_change_of_control').cite}); the Act puts the line at voting power that "exceeds ${S(NG.changeOfControlAbovePct)}%" (${C('pia_95_14_control').cite}), and the Regulations require the Minister's consent to a change in control of a holder not listed on a public exchange (${C('aoi_3_3_control').cite}).`);
w(`- A petroleum exploration licence (PEL) is assigned with the consent of the Commission (${C('pia_95_15_pel').cite}; ${C('aoi_16c_pel_control').cite}), which answers within ${TEXTFIG.pelDays} working days (${C('aoi_18_3_pel_decision').cite}).`);
w(`- The holder first notifies the Commission of its intention, stating the reason, the method and the expected benefits (${C('aoi_4_4b_reasons').cite}); the Commission answers within ${TEXTFIG.notifyDays} working days or the notification is deemed approved (${C('aoi_4_7_fifteen_days').cite}). The Minister's silence for ${TEXTFIG.deemedDays} working days after the Commission's recommendation is a deemed consent (${C('pia_95_7b_deemed').cite}).`);
w(`- The fee is a percentage of the value of the transaction and is not tax deductible (${C('pia_95_12_fee').cite}; ${C('aoi_19_5_not_deductible').cite}); for companies income tax and hydrocarbon tax, fees paid for assigning rights to another party are not deductible (${C('pia_264_f_not_deductible').cite}; ${C('pia_302_12c_not_deductible').cite}). ${refCap('fee')} computes the fee.`);
w(`- A farm-out agreement provides for a decommissioning and abandonment plan funded by the incoming parties in whole or in part (${C('pia_233_10_decommissioning').cite}); the engine computes no such share (${ref('notcomputed')}).`);
w();
w('WHAT THE ENGINE DOES WITH THE CONSENT. It computes no consent: it reports, in its basis, who gives which consent, and it refuses a PEL under the gazetted fee basis because reg. 19(2) sets the fee for the consent of the Minister. The refusal, verbatim (fee-refuse-pel-r19):');
quote(E.consentFee(argsOf('fee-refuse-pel-r19')).error);
must('the PEL refusal names licence', E.consentFee(argsOf('fee-refuse-pel-r19')).field === 'licence', 'pel');

/* ============================================================ SECTION 11 */

section('after', 'The interests after the deal and an event completed and vested', ['Associate m06']);
w('THE VESTING RULE, in the engine\'s basis (earn-ekene-single, "per-event"), verbatim:');
quote(eS.basis.vesting);
w();
table(['golden case', 'party', 'participating interest before (golden input)', 'participating interest after (engine)'], ['earn-ekene-single', 'earn-full-carry', 'earn-third-for-a-quarter'].flatMap((id) => {
  const a = argsOf(id); const r = runG(id);
  return r.interestsAfter.map((p) => [id, p.id, f6((a.parties.find((x) => x.id === p.id) || { participatingPct: 0 }).participatingPct), f6(p.participatingPct)]);
}));
['earn-ekene-single', 'earn-full-carry', 'earn-third-for-a-quarter'].forEach((id) => must(`the interests after the deal sum to 100 on ${id}`, Math.abs(runG(id).interestsAfter.reduce((s, p) => s + p.participatingPct, 0) - 100) < 1e-9, id));
w();
w(`THE EKENE DEEP INTERESTS AFTER THE FARM-IN (earn-ekene-single, one event completed, "per-event"): ${eS.interestsAfter.map((p) => `${p.id} ${f6(p.participatingPct)}`).join(', ')} (engine). The farminee's interest comes out of the farmor's alone; the other party keeps its ${f6(byId(eS.interestsAfter, 'PA').participatingPct)} percent.`);
must('the other party keeps its interest', byId(eS.interestsAfter, 'PA').participatingPct === 30, 'PA');
w();
w(`AN EVENT NOT YET COMPLETED. On earn-none-completed the event is not completed, so nothing is paid and ${f6(nc.vestedPct)} percent vests; the interests after are ${nc.interestsAfter.map((p) => `${p.id} ${f6(p.participatingPct)}`).join(', ')} (engine). The reason, verbatim:`);
quote(nc.reasons.find((t) => /^vesting/.test(t)));
w();
w('A CHECKLIST FOR READING A FARM-OUT names: the licence and its parties with their participating interests before the deal; the farmor and the farminee; each event\'s gross cost, share paid, interest earned and cap; the vesting rule and the events completed; the cash bonus and the past costs with the share reimbursed; the consideration and the equivalent working interest; the interests after the deal; the consent needed and the fee basis; every source applied with its edition and the date read.');

/* ============================================================ SECTION 12 */

section('caps', 'Caps and overrun rules: a cap on the gross cost, a cap on the carry amount, and a cap reached exactly', ['Professional m01']);
w('THE CAP RULE, in the engine\'s basis, verbatim:');
quote(eS.basis.cap);
w();
const CAPS = ['earn-cap-gross-below', 'earn-cap-gross-exactly', 'earn-cap-gross-exceeded-post', 'earn-cap-gross-exceeded-farmor-side', 'earn-cap-carry-below', 'earn-cap-carry-exactly', 'earn-cap-carry-exceeded', 'earn-cap-carry-zero'];
{ const a0 = argsOf('earn-cap-gross-below'); w(`ONE WELL UNDER EACH CAP (golden inputs: ${a0.parties.map((p) => `${p.id} ${S(p.participatingPct)}`).join(' and ')} percent; ${a0.farminee.id} pays ${S(a0.events[0].farmineePaysPct)} percent to earn ${S(a0.events[0].earnedPct)} percent; no bonus, no reimbursement):`); }
w();
table(['golden case', 'gross cost', 'cap (golden input)', 'overrun rule (golden input)', 'cap state', 'promoted cost', 'excess', 'carry before the cap', 'farminee pays', 'farmor pays', 'carry', 'PA pays'], CAPS.map((id) => {
  const a = argsOf(id).events[0]; const ev = runG(id).events[0];
  return [id, f6(ev.grossCost), `${a.cap.on} ${f6(a.cap.amount)}`, a.cap.overrunRule || 'none', ev.capState, f6(ev.promotedCost), f6(ev.excess), f6(ev.carryUncapped), f6(ev.farmineePays), f6(ev.farmorPays), f6(ev.carry), f6(ev.others[0].pays)];
}));
w();
CAPS.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons.slice(0, 1)); });
const cpo = runG('earn-cap-gross-exceeded-post').events[0];
const cfs = runG('earn-cap-gross-exceeded-farmor-side').events[0];
must('the two overrun rules split the same excess differently', cpo.excess === cfs.excess && cpo.farmineePays !== cfs.farmineePays, `${cpo.farmineePays} ${cfs.farmineePays}`);
w();
w(`THE TWO OVERRUN RULES ON THE SAME EXCESS. The well of ${f6(cpo.grossCost)} exceeds the cap of ${f6(argsOf('earn-cap-gross-exceeded-post').events[0].cap.amount)} by ${f6(cpo.excess)}. Under "post-deal-interests" FIN pays ${f6(cpo.farmineePays)} and EKO ${f6(cpo.farmorPays)}; under "farmor-side" FIN pays ${f6(cfs.farmineePays)} and EKO ${f6(cfs.farmorPays)} (engine). PA pays ${f6(cpo.others[0].pays)} under both: the overrun rule moves money between the farmor and the farminee only.`);
must('the other party pays the same under both overrun rules', cpo.others[0].pays === cfs.others[0].pays, 'PA');
const cce = runG('earn-cap-carry-exactly').events[0];
const cge = runG('earn-cap-gross-exactly').events[0];
w(`A CAP REACHED EXACTLY is its own state: on earn-cap-gross-exactly the gross cost equals the cap ("${cge.capState}", excess ${f6(cge.excess)}); on earn-cap-carry-exactly the carry equals the cap ("${cce.capState}", carry ${f6(cce.carry)}). Both split the cost as a cap not reached would (engine).`);
must('a cap reached exactly reports "exactly"', cge.capState === 'exactly' && cce.capState === 'exactly' && cge.excess === 0, 'exactly');

/* ============================================================ SECTION 13 */

section('drilltoearn', 'Drill-to-earn: earning events, vesting event by event and vesting when every event is complete', ['Professional m02']);
w('THE VESTING RULES, in the engine\'s bases, verbatim:');
quote(dtePer.basis.vesting);
quote(dte.basis.vesting);
w();
w(`THE EKENE DEEP DRILL-TO-EARN (golden inputs, the fixture's two events): each event states its own gross cost, share paid, interest earned (on top of what earlier events earned) and cap. Per event (engine, earn-ekene-drill-to-earn-done):`);
w();
table(EV_HEAD, dteDone.events.map((ev) => evRow('earn-ekene-drill-to-earn-done', ev)));
w();
const DTE = ['earn-ekene-drill-to-earn-none-done', 'earn-ekene-drill-to-earn', 'earn-ekene-drill-to-earn-per-event', 'earn-ekene-drill-to-earn-done'];
table(['golden case', 'vesting (golden input)', 'events completed (golden input)', 'vested', 'gross cost of completed events', 'farminee paid', 'farmor paid', 'carry', 'consideration', 'equivalent working interest', 'interests after'], DTE.map((id) => {
  const a = argsOf(id); const r = runG(id); const t = r.totals;
  return [id, a.vesting, S(a.eventsCompleted), f6(r.vestedPct), f6(t.grossCost), f6(t.farmineePays), f6(t.farmorPays), f6(t.carry), f6(t.consideration), f6(t.equivalentWorkingInterestPct), r.interestsAfter.map((p) => `${p.id} ${f6(p.participatingPct)}`).join('; ')];
}));
w();
DTE.forEach((id) => { w(`${id}, the engine's reasons after the events, verbatim:`); reasons(runG(id).reasons.slice(2)); });
w();
const ev2 = dteDone.events[1];
w(`THE SECOND EVENT'S PROMOTE counts against the interest held after it: the appraisal well earns ${f6(ev2.earnedPct)} percent on top of ${f6(ev2.heldBeforePct)}, so ${FX.farminee.id} holds ${f6(ev2.heldAfterPct)} after it, and paying ${f6(ev2.farmineePaysPct)} percent is a promote of ${f6(ev2.promotePoints)} points and a ratio of ${f6(ev2.promoteRatio)} (engine). Its carry of ${f6(ev2.carry)} reaches the carry cap exactly (${ev2.capState}).`);
must('the second event promote is measured against the cumulative interest', ev2.heldAfterPct === 35 && ev2.promotePoints === 10, JSON.stringify(ev2));
w(`WHAT IS PAID AND WHAT VESTS. With one event completed, "all-events" vests ${f6(dte.vestedPct)} percent while ${FX.farminee.id} has paid ${f6(dte.totals.farmineePays)}; "per-event" vests ${f6(dtePer.vestedPct)} percent for the same payment (engine). The obligation of an uncompleted event is reported and not counted in the totals.`);
must('one event completed pays the same under both vesting rules', dte.totals.farmineePays === dtePer.totals.farmineePays, 'paid');

/* ============================================================ SECTION 14 */

const POS_HEAD = ['golden case', 'chance of success', 'position', 'success', 'dry hole', 'EMV'];
const posRows = (id, r) => [
  [id, f6(r.chanceOfSuccessPct), `${r.farmor ? 'farmor' : ''} alone`, f6(r.farmor.alone.success), f6(r.farmor.alone.dry), f6(r.farmor.alone.emv)],
  [id, f6(r.chanceOfSuccessPct), 'farmor after the farm-out', f6(r.farmor.farmOut.success), f6(r.farmor.farmOut.dry), f6(r.farmor.farmOut.emv)],
  [id, f6(r.chanceOfSuccessPct), 'farminee farming in', f6(r.farmineeSide.farmIn.success), f6(r.farmineeSide.farmIn.dry), f6(r.farmineeSide.farmIn.emv)],
];
section('dealvalue', 'The value of the deal to each side by EMV: the farmor\'s three actions, the farminee\'s choice and the transfer', ['Professional m03']);
w('THE EMV, in the engine\'s basis (deal-ekene), verbatim:');
quote(dE.basis.emv);
w();
w('THE POSITIONS, verbatim:');
quote(dE.basis.positions);
w();
w('THE SCALING, verbatim:');
quote(dE.basis.scaling);
w();
w('THE TIMING, verbatim:');
quote(dE.basis.timing);
w();
w('THE TRANSFER, verbatim:');
quote(dE.basis.transfer);
w();
w(`THE EKENE DEEP DEAL (golden input deal-ekene, the fixture): chance of success ${f6(dE.chanceOfSuccessPct)} percent, success-case value ${f6(dE.successValue100)} at 100 percent. The well cost split (engine):`);
w();
table(['outcome', 'gross cost', 'farminee pays', 'farmor pays', 'carry', 'cap state'], ['success', 'dry'].map((k) => { const s = dE.wellCostSplit[k]; return [k === 'dry' ? 'dry hole' : 'success', f6(s.grossCost), f6(s.farmineePays), f6(s.farmorPays), f6(s.carry), s.capState]; }));
w();
table(['position', 'interest', 'success', 'dry hole', 'EMV'], [
  [`${FX.farmor} drills alone`, f6(dE.farmorInterestBeforePct), f6(dE.farmor.alone.success), f6(dE.farmor.alone.dry), f6(dE.farmor.alone.emv)],
  [`${FX.farmor} after the farm-out`, f6(dE.farmorInterestBeforePct - dE.terms.earnedPct), f6(dE.farmor.farmOut.success), f6(dE.farmor.farmOut.dry), f6(dE.farmor.farmOut.emv)],
  [`${FX.farmor} walks away`, f6(0), f6(0), f6(0), f6(dE.farmor.walkAway)],
  [`${FX.farminee.id} farms in`, f6(dE.terms.earnedPct), f6(dE.farmineeSide.farmIn.success), f6(dE.farmineeSide.farmIn.dry), f6(dE.farmineeSide.farmIn.emv)],
  [`${FX.farminee.id} declines`, f6(0), f6(0), f6(0), f6(dE.farmineeSide.decline)],
]);
w();
w(`${FX.farmor}'s best action is "${dE.farmor.bestAction}"; ${FX.farminee.id}'s is "${dE.farmineeSide.bestAction}" (engine). The engine's reasons, verbatim:`);
reasons(dE.reasons);
w();
const tr = dE.transfer;
const trSum = tr.farmorFarmOutEmv + tr.farmineeEmv + tr.assignorFees;
w(`THE TRANSFER. The farmor alone ${f6(tr.farmorAloneEmv)}; after the farm-out ${f6(tr.farmorFarmOutEmv)}, the farminee ${f6(tr.farmineeEmv)} and the assignor fees ${f6(tr.assignorFees)}, which add to ${f6(trSum)} (derived). The engine returns their difference from the farmor alone as float residue, under ${S(1e-6)} in size, so the identity holds to the precision this course prints. On these terms the farmor's EMV rises by ${f6(tr.farmorFarmOutEmv - tr.farmorAloneEmv)} (derived) while the farminee's is below 0: the deal moves value from the farminee to the farmor, and the fees leave both.`);
must('the farm-out raises the farmor EMV and the farminee EMV is negative', tr.farmorFarmOutEmv > tr.farmorAloneEmv && tr.farmineeEmv < 0, 'direction');
must('the transfer identity closes to 1e-6', Math.abs(tr.difference) < 1e-6 && Math.abs(trSum - tr.farmorAloneEmv) < 1e-6, tr.difference);
w();
w(`THE CONSIDERATION IN EXPECTATION (deal-ekene): the carry is ${f6(dE.consideration.carrySuccess)} on a success and ${f6(dE.consideration.carryDry)} on a dry hole, ${f6(dE.consideration.expectedCarry)} in expectation; with the bonus ${f6(dE.consideration.cashBonus)} and the reimbursement ${f6(dE.consideration.pastCostReimbursement)} the expected consideration is ${f6(dE.consideration.expectedTotal)}, or ${f6(dE.consideration.perPercentEarned)} per percent earned (engine).`);
w();
const DV = ['deal-ekene-npv-stated', 'deal-ekene-no-cap', 'deal-ekene-carry-cap', 'deal-ekene-farmor-side', 'deal-ekene-bonus-zero', 'deal-ekene-dry-hole', 'deal-ekene-certain'];
w('THE SAME PROSPECT UNDER OTHER TERMS (golden inputs; each changes one term of deal-ekene):');
w();
table(['golden case', 'the term changed (golden input)', 'farmor alone EMV', 'farmor after EMV', 'farminee EMV', 'farmor best action', 'farminee best action'], DV.map((id) => {
  const a = argsOf(id); const r = runG(id);
  const what = id === 'deal-ekene-npv-stated' ? `success-case value stated as ${f6(a.project.successValue.npv)}` : id === 'deal-ekene-no-cap' ? 'cap "none"' : id === 'deal-ekene-carry-cap' ? `cap "carry-amount" of ${f6(a.deal.cap.amount)}` : id === 'deal-ekene-farmor-side' ? 'overrun rule "farmor-side"' : id === 'deal-ekene-bonus-zero' ? 'cash bonus 0 and no reimbursement' : `chance of success ${f6(a.project.chanceOfSuccessPct)}`;
  return [id, what, f6(r.farmor.alone.emv), f6(r.farmor.farmOut.emv), f6(r.farmineeSide.farmIn.emv), r.farmor.bestAction, r.farmineeSide.bestAction];
}));
const bz0 = runG('deal-ekene-bonus-zero');
must('without the bonus and reimbursement the farminee farms in and the farmor would drill alone', bz0.farmineeSide.bestAction === 'farm in' && bz0.farmor.bestAction === 'drill alone', `${bz0.farmineeSide.bestAction} ${bz0.farmor.bestAction}`);
w();
w(`THE SUCCESS-CASE VALUE FROM CASH FLOWS. When the success case is stated as net cash flows, the engine discounts them with the canonical npv at the stated rate to the stated base year; each party\'s interest of it is the canonical applyJV scaling of each year\'s flow before the npv. deal-ekene-npv-stated states ${f6(argsOf('deal-ekene-npv-stated').project.successValue.npv)} directly, the fixture\'s npv of ${f6(dE.successValue100)} rounded to the nearest thousand (derived), and its EMVs differ from deal-ekene\'s by the rounding scaled by each interest and the chance; the course quotes each with its own inputs and never calls them equal.`);
{ const ns = runG('deal-ekene-npv-stated'); const dS = argsOf('deal-ekene-npv-stated').project.successValue.npv - dE.successValue100; must('each EMV differs by the rounding x interest x chance', Math.abs((ns.farmor.alone.emv - dE.farmor.alone.emv) - dS * 0.7 * 0.25) < 1e-6 && Math.abs((ns.farmor.farmOut.emv - dE.farmor.farmOut.emv) - dS * 0.4 * 0.25) < 1e-6 && Math.abs((ns.farmineeSide.farmIn.emv - dE.farmineeSide.farmIn.emv) - dS * 0.3 * 0.25) < 1e-6, 'scaled'); }
must('the stated npv is the flows npv rounded to the nearest thousand', Math.round(dE.successValue100 / 1000) * 1000 === argsOf('deal-ekene-npv-stated').project.successValue.npv, 'rounded');
w();
w(`THE PENN STATE CHECK (a cited figure). Penn State EME 801, Lesson 6 prints a drill yourself or farm out problem with a producer chance of ${f6(PSU.producerPct)} percent and a dry-hole chance of ${f6(PSU.dryPct)} percent; drilling yourself pays ${f6(PSU.drillDry)} on a dry hole and ${f6(PSU.drillProducer)} on a producer, farming out ${f6(PSU.farmOutDry)} and ${f6(PSU.farmOutProducer)}; it prints the EMVs ${f6(PSU.drill)} and ${f6(PSU.farmOut)} (text, numbers only, ${PSU.cite}). The golden input deal-psu-eme801 states those payoffs as a deal (a 100 percent owner, a success-case value of ${f6(argsOf('deal-psu-eme801').project.successValue.npv)}, a well of ${f6(argsOf('deal-psu-eme801').project.wellCost.dry)}, the incoming party paying the whole well to earn ${f6(argsOf('deal-psu-eme801').deal.earnedPct)} percent) and the engine returns:`);
const psu = runG('deal-psu-eme801');
w();
table(['position', 'dry hole (engine)', 'producer (engine)', 'EMV (engine)', 'EMV the text prints'], [
  ['drill yourself', f6(psu.farmor.alone.dry), f6(psu.farmor.alone.success), f6(psu.farmor.alone.emv), f6(PSU.drill)],
  ['farm out', f6(psu.farmor.farmOut.dry), f6(psu.farmor.farmOut.success), f6(psu.farmor.farmOut.emv), f6(PSU.farmOut)],
]);
must('the engine reproduces the Penn State EMVs to 1e-6', Math.abs(psu.farmor.alone.emv - PSU.drill) < 1e-6 && Math.abs(psu.farmor.farmOut.emv - PSU.farmOut) < 1e-6, `${psu.farmor.alone.emv} ${psu.farmor.farmOut.emv}`);
must('the engine reproduces the Penn State payoffs to 1e-6', Math.abs(psu.farmor.alone.dry - PSU.drillDry) < 1e-6 && Math.abs(psu.farmor.alone.success - PSU.drillProducer) < 1e-6 && Math.abs(psu.farmor.farmOut.dry - PSU.farmOutDry) < 1e-6 && Math.abs(psu.farmor.farmOut.success - PSU.farmOutProducer) < 1e-6, 'payoffs');
// quote_check.py checks the Penn State page prints these figures (the page lives only in the wave directory).
w();
w(`The engine's farm out EMV is ${S(psu.farmor.farmOut.emv)} as a double; it prints as ${f6(PSU.farmOut)} at six decimals, and the check passes within 0.000001. The page's farm out payoff of ${f6(PSU.farmOutProducer)} is ${f6((PSU.farmOutProducer / argsOf('deal-psu-eme801').project.successValue.npv) * 100)} percent of the ${f6(argsOf('deal-psu-eme801').project.successValue.npv)} success value (derived), which is why the golden input keeps ${f6(100 - argsOf('deal-psu-eme801').deal.earnedPct)} percent for the owner; the page itself states no interest. The engine's reading of the page, the incoming party's side, and the break-evens on it are printed in ${ref('breakeven')}.`);

/* ============================================================ SECTION 15 */

section('breakeven', 'The break-even promote and the break-even chance of success', ['Professional m04']);
w('THE BREAK-EVEN PROMOTE, in the engine\'s basis (deal-ekene), verbatim:');
quote(dE.basis.breakEvenPromote);
w();
w('THE BREAK-EVEN CHANCE, verbatim:');
quote(dE.basis.breakEvenChance);
w();
const bep = dE.breakEvenPromote;
w(`THE EKENE DEEP BREAK-EVEN PROMOTE (deal-ekene): ${FX.farminee.id}'s EMV is ${f6(bep.breakpoints[0].emv)} paying ${f6(bep.breakpoints[0].farmineePaysPct)} percent (its earned interest, no promote) and ${f6(bep.breakpoints[1].emv)} paying ${f6(bep.breakpoints[1].farmineePaysPct)} percent (the farmor's whole interest); it is 0 at ${f6(bep.farmineePaysPct)} percent, a promote of ${f6(bep.promotePoints)} points and a ratio of ${f6(bep.promoteRatio)} (engine). The deal asks ${f6(dE.terms.farmineePaysPct)} percent, above it, so ${FX.farminee.id} declines.`);
must('the Ekene break-even lies between the two breakpoints and below the stated share', bep.farmineePaysPct > 30 && bep.farmineePaysPct < dE.terms.farmineePaysPct, bep.farmineePaysPct);
w();
const BEP = ['deal-ekene', 'deal-ekene-carry-cap', 'deal-ekene-bonus-zero', 'deal-promote-exactly-break-even', 'deal-promote-just-above-break-even', 'deal-negative-without-promote', 'deal-positive-at-farmor-share', 'deal-break-even-at-farmor-share', 'deal-carry-cap-kinks', 'deal-carry-cap-flat-positive', 'deal-psu-eme801'];
table(['golden case', 'share asked', 'earned', 'status', 'break-even share paid', 'promote points', 'promote ratio', 'breakpoints (share paid: farminee EMV)'], BEP.map((id) => {
  const r = runG(id); const b = r.breakEvenPromote;
  return [id, f6(r.terms.farmineePaysPct), f6(r.terms.earnedPct), b.status, f6(b.farmineePaysPct), f6(b.promotePoints), f6(b.promoteRatio), b.breakpoints.map((p) => `${f6(p.farmineePaysPct)}: ${f6(p.emv)}`).join('; ')];
}));
w();
['deal-negative-without-promote', 'deal-positive-at-farmor-share', 'deal-carry-cap-kinks', 'deal-carry-cap-flat-positive'].forEach((id) => { w(`${id}, the break-even reason, verbatim:`); quote(runG(id).reasons.find((t) => /^break-even promote/.test(t))); });
const kinks = runG('deal-carry-cap-kinks').breakEvenPromote;
must('a carry-amount cap adds a breakpoint', kinks.breakpoints.length === 3, kinks.breakpoints.length);
w();
w(`BREAKPOINTS UNDER A CARRY CAP. EMV falls in a straight line as the share paid rises, until the carry reaches a carry-amount cap; from there the farminee pays no more carry and its EMV stops falling. On deal-carry-cap-kinks the engine rolls the EMV back at ${S(kinks.breakpoints.length)} breakpoints (${kinks.breakpoints.map((p) => f6(p.farmineePaysPct)).join(', ')}) and interpolates exactly on the segment that crosses 0. On deal-carry-cap-flat-positive the cap holds the EMV above 0 all the way to the farmor's whole share, so no break-even exists.`);
w();
const pe = runG('deal-promote-exactly-break-even');
w(`AT THE BREAK-EVEN EXACTLY. On deal-promote-exactly-break-even the share asked is the break-even share: the farminee's EMV is ${f6(pe.farmineeSide.farmIn.emv)} and the engine reports a tie between ${pe.farmineeSide.tiedActions.join(' and ')}; the farmor's two actions tie as well (${pe.farmor.tiedActions.join(' and ')}). Half a point more (deal-promote-just-above-break-even) and the farminee declines.`);
must('at the break-even the farminee ties', pe.farmineeSide.tiedActions.length === 2 && pe.farmineeSide.farmIn.emv === 0, JSON.stringify(pe.farmineeSide.tiedActions));
w();
const BC = ['deal-ekene', 'deal-ekene-bonus-zero', 'deal-promote-exactly-break-even', 'deal-psu-eme801', 'deal-break-even-at-farmor-share'];
table(['golden case', 'chance stated', 'farmor alone: status', 'break-even chance', 'farmor after: status', 'break-even chance', 'farminee: status', 'break-even chance'], BC.map((id) => {
  const r = runG(id); const b = r.breakEvenChance;
  return [id, f6(r.chanceOfSuccessPct), b.farmorAlone.status, f6(b.farmorAlone.chanceOfSuccessPct), b.farmorFarmOut.status, f6(b.farmorFarmOut.chanceOfSuccessPct), b.farminee.status, f6(b.farminee.chanceOfSuccessPct)];
}));
w();
const bcE = dE.breakEvenChance;
w(`THE EKENE DEEP BREAK-EVEN CHANCES (deal-ekene): ${FX.farmor} alone breaks even at ${f6(bcE.farmorAlone.chanceOfSuccessPct)} percent, ${FX.farmor} after the farm-out at ${f6(bcE.farmorFarmOut.chanceOfSuccessPct)} percent, ${FX.farminee.id} at ${f6(bcE.farminee.chanceOfSuccessPct)} percent (engine), against the stated ${f6(dE.chanceOfSuccessPct)} percent. The farm-out lowers the chance the farmor needs and the deal asks the farminee for a chance above the one stated.`);
must('the farm-out lowers the farmor break-even chance and the farminee needs more than 25', bcE.farmorFarmOut.chanceOfSuccessPct < bcE.farmorAlone.chanceOfSuccessPct && bcE.farminee.chanceOfSuccessPct > 25, 'bc');
w();
w(`WHEN NO BREAK-EVEN CHANCE EXISTS. A position whose dry hole is not a loss is never negative: on deal-psu-eme801 the farm out pays ${f6(psu.farmor.farmOut.dry)} on a dry hole and the engine reports "${psu.breakEvenChance.farmorFarmOut.status}". The reason, verbatim:`);
quote(psu.reasons.find((t) => /after the farm-out: EMV is at or above 0/.test(t)));
w(`On the Penn State figures the incoming party breaks even paying ${f6(psu.breakEvenPromote.farmineePaysPct)} percent of the well for ${f6(psu.terms.earnedPct)} percent, and at a chance of ${f6(psu.breakEvenChance.farminee.chanceOfSuccessPct)} percent (engine); the page prints neither figure.`);

/* ============================================================ SECTION 16 */

section('fee', 'The consent fee: seven per cent of the value of the transaction, the value defined, an intra group transfer and a PEL', ['Professional m05']);
w('THE RULE, in the engine\'s basis (fee-ekene), verbatim:');
quote(feeE.basis.rule);
w();
w('THE VALUE OF THE TRANSACTION, verbatim:');
quote(feeE.basis.value);
w();
w('THE TAX, verbatim:');
quote(feeE.basis.tax);
w();
const FEES = ['fee-ekene', 'fee-intra-group', 'fee-no-payment', 'fee-pel-stated'];
table(['golden case', 'licence', 'basis', 'value of the transaction (golden input)', 'value source (golden input)', 'processing percent', 'premium percent', 'processing fee', 'premium', 'fee'], FEES.map((id) => {
  const r = runG(id);
  return [id, r.licence, r.feeBasis, f6(r.transactionValue), r.valueSource, f6(r.processingPct), f6(r.premiumPct), f6(r.processingFee), f6(r.premium), f6(r.fee)];
}));
FEES.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons); });
must('the Ekene fee is seven per cent of the stated value', Math.abs(feeE.fee - 0.07 * feeE.transactionValue) < 1e-6, feeE.fee);
must('the intra group fee is the processing fee alone', runG('fee-intra-group').premium === 0 && runG('fee-intra-group').fee === runG('fee-intra-group').processingFee, 'intra');
w();
w(`WHAT THE VALUE OF THE TRANSACTION IS. Reg. 19(3) makes it either the amount payable to the assignor stated in the application or contract, or an amount the Commission prescribes from its metrics for good and valuable consideration (${C('aoi_19_3a_amount_payable').cite}; ${C('aoi_19_3b_prescribed').cite}); reg. 24 defines it again, as the amount the Commission determines to be the value receivable by the assignor (${C('aoi_24_value').cite}). The engine takes it as a stated input with a stated source and decides nothing about which part of a farm-out's consideration it covers. The Ekene fixture states ${f6(FX.consent.transactionValue)}, the cash bonus ${f6(FX.deal.cashBonus)} plus the reimbursement ${f6(eT.pastCostReimbursement)} (fixture); a deal whose carry is also counted would state a larger value, and the engine would charge seven per cent of it.`);
must('the fixture value of the transaction is the bonus plus the reimbursement', FX.consent.transactionValue === FX.deal.cashBonus + eT.pastCostReimbursement, FX.consent.transactionValue);
w();
w(`THE FEE IN THE FARMOR'S POSITION. The assignor pays the fee, and the fixture states it to dealValue as the assignor fees: ${f6(FX.deal.assignorFees)} (fixture), the fee fee-ekene returns, ${f6(feeE.fee)} (engine). In ${ref('dealvalue')} it lowers the farmor's payoff in both outcomes.`);
must('the fixture assignor fees equal the Ekene consent fee', FX.deal.assignorFees === feeE.fee, FX.deal.assignorFees);
w();
w(`A PEL AND A STATED BASIS. Reg. 19(2) sets the fee for the consent of the Minister; a PEL assignment needs the consent of the Commission (reg. 16), whose fee the regulation does not set, so a PEL is refused under basis "nuprc-2024-r19" (${ref('consent')}) and priced under basis "stated" with the rates the caller states: fee-pel-stated states ${f6(argsOf('fee-pel-stated').ratesPct.processingPct)} percent processing and ${f6(argsOf('fee-pel-stated').ratesPct.premiumPct)} percent premium (golden input), which are no gazetted figure.`);

/* ============================================================ SECTION 17 */

section('feetiming', 'Paying the fee on time: ninety days, thirty more, the surcharge a day and the consent deemed withdrawn', ['Professional m06']);
w('THE DAYS, in the engine\'s basis (fee-ekene), verbatim:');
quote(feeE.basis.timing);
w();
const DAYS = ['fee-ekene', 'fee-day-90', 'fee-day-91', 'fee-day-120', 'fee-day-121', 'fee-day-210', 'fee-day-211'];
table(['golden case', 'notified (golden input)', 'paid (golden input)', 'days', 'status', 'surcharge days', 'surcharge', 'total paid'], DAYS.map((id) => {
  const a = argsOf(id); const p = runG(id).payment;
  return [id, a.payment.notifiedOn, a.payment.paidOn, S(p.days), p.status, S(p.surchargeDays), f6(p.surcharge), f6(p.totalPaid)];
}));
DAYS.forEach((id) => { w(`${id}, the payment reason, verbatim:`); quote(runG(id).reasons[1]); });
const d210 = runG('fee-day-210').payment;
const d211 = runG('fee-day-211').payment;
must('day 90 is on time, 91 and 120 in grace, 121 the first surcharge day, 210 the last, 211 withdrawn', runG('fee-day-90').payment.status === 'on-time' && runG('fee-day-91').payment.status === 'within-grace' && runG('fee-day-120').payment.status === 'within-grace' && runG('fee-day-121').payment.surchargeDays === 1 && d210.surchargeDays === 90 && d211.status === 'consent-deemed-withdrawn' && d211.totalPaid === null, 'days');
w();
w(`THE SURCHARGE IS STRAIGHT LINE. It is ${S(NG.surchargePctPerDay)} percent of the fee a day, charged on the fee alone: one day costs ${f6(runG('fee-day-121').payment.surcharge)} and ninety days ${f6(d210.surcharge)} on the ${f6(feeE.fee)} fee (engine). After the ninetieth surcharge day the consent is deemed withdrawn and the engine returns no total paid (fee-day-211: ${f6(d211.totalPaid)}).`);
must('ninety surcharge days are ninety times one', Math.abs(d210.surcharge - 90 * runG('fee-day-121').payment.surcharge) < 1e-6, d210.surcharge);
w();
w(`HOW THE DAYS ARE COUNTED. Days run from the notification date to the payment date, the notification day not counted: fee-ekene is notified ${FX.consent.payment.notifiedOn} and paid ${FX.consent.payment.paidOn}, ${S(feeE.payment.days)} days (engine), on time. ${refCap('readings')} names this count as a reading.`);
w();
w(`WITHOUT A PAYMENT. A call with no payment dates computes the fee and says nothing about timing (fee-no-payment: payment ${runG('fee-no-payment').payment === null ? 'none' : 'returned'}).`);

/* ============================================================ SECTION 18 */

section('information', 'The value of information to each side: perfect information, a signal and its likelihoods, and its cost', ['Expert m01']);
w('THE ENGINE, in its basis (info-ekene-farminee), verbatim:');
quote(iF.basis.engine);
w();
const iFo = runG('info-ekene-farmor');
const INFO = ['info-ekene-farminee', 'info-ekene-farmor', 'info-ekene-too-dear', 'info-uninformative'];
table(['golden case', 'side', 'EMV without information', 'EMV with perfect information', 'EVPI', 'EMV with the signal', 'EVII', 'information cost (golden input)', 'EVII less the cost'], INFO.map((id) => {
  const r = runG(id);
  return [id, r.side, f6(r.emvPrior), f6(r.evWithPerfectInformation), f6(r.evpi), f6(r.evWithInformation), f6(r.evii), f6(r.informationCost), f6(r.netEvii)];
}));
w();
table(['golden case', 'signal', 'likelihoods given success and given a dry hole (golden input)', 'chance of the signal', 'chance of success after it', 'best action', 'EMV'], INFO.flatMap((id) => {
  const a = argsOf(id); const r = runG(id);
  return r.perSignal.map((s, i) => [id, s.label, `${f6(a.information.signals[i].likelihoodsPct[0])}; ${f6(a.information.signals[i].likelihoodsPct[1])}`, f6(s.probability), f6(s.posteriorSuccessPct), s.tiedActions.length > 1 ? `a tie: ${s.tiedActions.join(', ')}` : s.bestAction, f6(s.emv)]);
}));
w();
INFO.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons); });
w();
w(`THE SIGNAL THAT TURNS THE DECISION. Without the survey ${FX.farminee.id} declines (EMV ${f6(iF.emvPrior)}); after a bright signal the chance of success is ${f6(iF.perSignal[0].posteriorSuccessPct)} percent and it farms in, after a dim one ${f6(iF.perSignal[1].posteriorSuccessPct)} percent and it declines (engine). The survey is worth ${f6(iF.evii)} to ${FX.farminee.id} before its cost of ${f6(iF.informationCost)}.`);
must('the signal turns the farminee decision and is worth more than its cost', iF.perSignal[0].bestAction === 'farm in' && iF.perSignal[1].bestAction === 'decline' && iF.netEvii > 0, 'turn');
w(`THE SAME SURVEY TO EACH SIDE. To ${FX.farmor} the same survey is worth ${f6(iFo.evii)} (EVPI ${f6(iFo.evpi)}): after a bright signal ${FX.farmor} would drill alone, after a dim one it would farm out (engine). The two sides value the same information differently because their actions and payoffs differ.`);
must('the farmor turns from drilling alone to farming out across the signals', iFo.perSignal[0].bestAction === 'drill alone' && iFo.perSignal[1].bestAction === 'farm out', 'farmor turn');
const unin = runG('info-uninformative');
w(`AN UNINFORMATIVE SIGNAL. On info-uninformative both signals are equally likely under success and dry hole; the chance of success stays ${f6(unin.perSignal[0].posteriorSuccessPct)} percent after either and EVII is ${f6(unin.evii)} (engine), exactly its stated cost of ${f6(unin.informationCost)}.`);
must('an uninformative signal is worth 0', unin.evii === 0 && unin.netEvii === 0, unin.evii);
w('The decision course teaches decision trees and the value of information as methods; this course applies the canonical evpi and evii to the two sides of a deal.');

/* ============================================================ SECTION 19 */

section('risk', 'Risk sharing: positions as holdings, spread, the chance of a loss, and the low and high cases', ['Expert m02']);
w('THE ENGINE, in its basis (risk-ekene), verbatim:');
quote(rE.basis.engine);
w();
w('THE LABELS, verbatim:');
quote(rE.basis.labels);
w();
w('A HOLDING, verbatim:');
quote(rE.basis.holding);
w();
const RISK = ['risk-ekene', 'risk-psu', 'risk-spread-four', 'risk-correlated'];
table(['golden case', 'position', 'correlation, seed, draws (golden input)', 'EMV', 'standard deviation', 'chance of a loss (draws)', 'low case (P90)', 'high case (P10)'], RISK.flatMap((id) => {
  const r = runG(id);
  return r.positions.map((p) => [id, p.name, `${f6(r.correlation)}, ${S(r.seed)}, ${S(r.iterations)}`, f6(p.emv), f6(p.stdDev), f6(p.probLoss), f6(p.p90), f6(p.p10)]);
}));
w();
RISK.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons); });
w();
const rA = rE.positions[0];
const rB = rE.positions[1];
w(`THE EKENE DEEP POSITIONS (risk-ekene, golden input): ${FX.farmor} drilling alone holds its ${f6(FX.parties[0].participatingPct)} percent, and after the farm-out holds ${f6(FX.parties[0].participatingPct - FX.deal.earnedPct)} percent and the cash it receives as a certain holding. The EMVs are the dealValue EMVs of ${ref('dealvalue')} (${f6(rA.emv)} and ${f6(rB.emv)}, engine); the standard deviation falls from ${f6(rA.stdDev)} to ${f6(rB.stdDev)}, and the low case rises from ${f6(rA.p90)} to ${f6(rB.p90)}.`);
must('the risk EMVs are the deal EMVs to 1e-6', Math.abs(rA.emv - dE.farmor.alone.emv) < 1e-6 && Math.abs(rB.emv - dE.farmor.farmOut.emv) < 1e-6, `${rA.emv} ${rB.emv}`);
const band = 5 * Math.sqrt(0.75 * 0.25 / rE.iterations);
w(`A DRAW IS AN ESTIMATE. Both Ekene positions lose money on a dry hole and on nothing else, so each loses with the dry-hole chance, ${f6(0.75)} (derived: 100 less the stated ${f6(FX.project.chanceOfSuccessPct)} percent, over 100). The ${S(rE.iterations)} seeded draws estimate ${f6(rA.probLoss)} and ${f6(rB.probLoss)} (engine), each within ${f6(band)} of it (derived: five standard errors of a proportion at that chance). The seed and the draw count are stated inputs, so the same call returns the same estimates on any machine; a different seed returns different ones.`);
must('the Ekene draw estimates sit within five standard errors of the dry-hole chance', Math.abs(rA.probLoss - 0.75) < band && Math.abs(rB.probLoss - 0.75) < band, `${rA.probLoss} ${rB.probLoss} ${band}`);
const sp = runG('risk-spread-four');
const cr = runG('risk-correlated');
w(`SPREADING ONE BET OVER FOUR. On risk-spread-four the same EMV of ${f6(sp.positions[0].emv)} is held as one prospect at 100 percent or ${S(argsOf('risk-spread-four').positions[1].holdings.length)} independent prospects at ${S(100 / argsOf('risk-spread-four').positions[1].holdings.length)} percent; the standard deviation halves (${f6(sp.positions[0].stdDev)} and ${f6(sp.positions[1].stdDev)}, engine). With the four correlated (risk-correlated, correlation ${f6(cr.correlation)}) it is ${f6(cr.positions[0].stdDev)}.`);
must('four independent quarters halve the standard deviation', Math.abs(sp.positions[1].stdDev * 2 - sp.positions[0].stdDev) < 1e-6, 'half');
w('NOTHING HERE IS GRADED. The chance of a loss and the low and high cases come from draws; the course teaches them and grades none. The portfolio course teaches portfolio choice and its risk measures.');

/* ============================================================ SECTION 20 */

section('pricing', 'Pricing an interest: value per percent of working interest, the two bases and transaction ratios', ['Expert m03']);
w('THE RULE, in the engine\'s basis (interest-ekene-risked), verbatim:');
quote(ipE.basis.rule);
w();
w('THE METRICS, verbatim:');
quote(ipE.basis.metrics);
w();
w('THE SOURCE LINE, verbatim:');
quote(ipE.basis.source);
w();
const PRICE = ['interest-ekene-risked', 'interest-ekene-success-case', 'interest-psu-10pct', 'interest-production-metric', 'interest-negative-emv'];
table(['golden case', 'interest (golden input)', 'basis (golden input)', '100% success', '100% dry hole', '100% EMV', 'risked per percent', 'success case per percent', 'value of the interest'], PRICE.map((id) => {
  const r = runG(id);
  return [id, f6(r.interestPct), r.valueBasis, f6(r.position100.success), f6(r.position100.dry), f6(r.position100.emv), f6(r.perPct.risked), f6(r.perPct.successCase), f6(r.interestValue)];
}));
w();
table(['golden case', 'price (golden input)', 'price per percent', 'price for 100%', 'price over value per percent', 'volume or rate net to the interest', 'price per unit'], PRICE.filter((id) => runG(id).transaction).map((id) => {
  const t = runG(id).transaction;
  const net = t.reserves.length ? `${f6(t.reserves[0].netVolume)} ${t.volumeUnit}` : t.production ? `${f6(t.production.netRate)} ${t.production.rateUnit}` : 'none stated';
  const per = t.reserves.length ? f6(t.reserves[0].pricePerUnit) : t.production ? f6(t.production.pricePerFlowingUnit) : 'none';
  return [id, f6(t.price), f6(t.impliedPerPct), f6(t.implied100), f6(t.priceToValue), net, per];
}));
w();
PRICE.forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons); });
w();
w(`THE EKENE DEEP PRICE (interest-ekene-risked): the 100 percent position is worth ${f6(ipE.position100.emv)} risked at ${f6(ipE.chanceOfSuccessPct)} percent, ${f6(ipE.perPct.risked)} a percent; ${f6(ipE.interestPct)} percent on that basis is ${f6(ipE.interestValue)} (engine). The stated price of ${f6(ipE.transaction.price)} is ${f6(ipE.transaction.impliedPerPct)} a percent, ${f6(ipE.transaction.priceToValue)} times the risked value per percent (engine): a ratio of a stated price to a computed value, reported only.`);
must('the priced interest is the interest scaling of the risked EMV', Math.abs(ipE.interestValue - ipE.position100.emv * 0.3) < 1e-6, ipE.interestValue);
must('the risked value of 30 percent equals the farminee payoff EMV check: EMV of the 100 percent position over 100 per percent', Math.abs(ipE.perPct.risked * 100 - ipE.position100.emv) < 1e-6, 'per pct');
const neg = runG('interest-negative-emv');
w(`NO RATIO ON A VALUE AT OR BELOW 0. On interest-negative-emv the risked value per percent is ${f6(neg.perPct.risked)}, and the engine returns no price-to-value ratio (${f6(neg.transaction.priceToValue)}) and says why in a reason.`);
must('no price-to-value ratio on a negative value', neg.transaction.priceToValue === null, 'null');
w(`A RESERVE CATEGORY IS A STATED LABEL. The engine divides the stated price by the stated volume net to the interest; it classifies nothing. "${ipE.transaction.reserves[0].category}" is the fixture's label.`);

/* ============================================================ SECTION 21 */

section('aftercarry', 'Carries and back-ins after the farm-in, through the joint venture engine', ['Expert m04']);
w('THE DEVELOPMENT CARRY, in the engine\'s basis (devcarry-ekene), verbatim:');
quote(devE.basis.engine);
quote(devE.basis.carry);
quote(devE.basis.uplift);
w();
w(`THE EKENE DEEP DEVELOPMENT CARRY (golden input devcarry-ekene, the fixture): after the farm-in the interests are ${devE.interestsAfter.map((p) => `${p.id} ${f6(p.participatingPct)}`).join(', ')}; ${FX.farminee.id} carries ${f6(devE.carriedPct)} percent of ${FX.farmor}'s cost share, a carried interest of ${f6(devE.carriedInterestPct)} points (engine). The recovery ledger (engine):`);
w();
table(['year', 'opening', 'uplift', 'carried cost added', 'due', 'farmor\'s share of the entitlement', 'available for recovery', 'recovered', 'closing', 'written off', 'the farmor receives'], devE.ledger.filter((l) => l.year <= devE.recoveredInYear + 1).map((l) => [S(l.year), f6(l.opening), f6(l.uplift), f6(l.added), f6(l.due), f6(l.share), f6(l.available), f6(l.recovered), f6(l.closing), f6(l.writtenOff), f6(l.debtorReceives)]));
w();
w(`Recovered in ${S(devE.recoveredInYear)}: carried cost ${f6(devE.totals.carriedCost)}, uplift ${f6(devE.totals.uplift)}, recovered ${f6(devE.totals.recovered)}, written off ${f6(devE.totals.writtenOff)} (engine). The NPVs at ${f6(argsOf('devcarry-ekene').discountRate)} to ${S(argsOf('devcarry-ekene').baseYear)}: ${devE.npv.map((p) => `${p.id} ${f6(p.npv)}`).join(', ')} (engine).`);
must('the Ekene development carry is recovered in 2036 with nothing written off', devE.recoveredInYear === 2036 && devE.totals.writtenOff === 0, devE.recoveredInYear);
w();
w('The engine\'s reasons, verbatim; money prints to the cent inside a reason, and the course quotes the numeric fields at six decimals:');
reasons(devE.reasons);
const d33 = yr(devE.ledger, 2033);
const d33r = devE.reasons.find((t) => /^2033: .* adds /.test(t)).match(/adds ([\d.]+)$/)[1];
w(`For example the 2033 uplift reads ${d33r} in the reason and ${f6(d33.uplift)} as the field (engine).`);
must('the 2033 uplift reason prints to the cent', devE.reasons.some((t) => t.includes('adds 9629358.08')) && d33.uplift === 9629358.08, d33.uplift);
w();
const dnc = runG('devcarry-ekene-none-capped');
const dre = runG('devcarry-recovered-exactly');
w(`WITHOUT AN UPLIFT AND WITH A CAP (devcarry-ekene-none-capped): no uplift and a cap of ${f6(argsOf('devcarry-ekene-none-capped').cap)} on the recovery; ${f6(dnc.totals.recovered)} is recovered and ${f6(dnc.totals.writtenOff)} written off (engine). The reasons, verbatim:`);
reasons(dnc.reasons.slice(-1));
w(`RECOVERED EXACTLY (devcarry-recovered-exactly): the ${f6(dre.ledger[1].due)} due meets ${f6(dre.ledger[1].available)} available; the reason, verbatim:`);
reasons(dre.reasons.slice(-1));
w();
w('THE UPLIFT FORM, the engine\'s note (devcarry-ekene), verbatim:');
quote(devE.basis.note);
w(`HMRC's manual says the recovery usually includes "an addition representing simple interest" (${C('hmrc_ot18360_simple_interest').cite}), and OT30022 says the costs are recovered "probably with an interest element" (${C('hmrc_ot30022_recovered').cite}). The engine states the uplift as none, simple, compound or a multiple, a required input with no default, and the contract chooses.`);
w();
const devS = runG('devcarry-ekene-simple-ot18360');
w(`A SIMPLE-INTEREST UPLIFT (golden input devcarry-ekene-simple-ot18360: the fixture's carry with uplift type "${argsOf('devcarry-ekene-simple-ot18360').uplift.type}", ${f6(argsOf('devcarry-ekene-simple-ot18360').uplift.ratePctPerYear)} percent a year, day basis "${argsOf('devcarry-ekene-simple-ot18360').uplift.dayBasis}"). The rule, in the engine's basis, verbatim:`);
quote(devS.basis.uplift);
w();
table(['year', 'opening principal', 'uplift (simple interest)', 'carried cost added', 'due', 'available for recovery', 'recovered', 'of which interest', 'of which principal', 'principal after', 'accrued interest after', 'closing'], devS.ledger.filter((l) => l.year <= devS.recoveredInYear).map((l) => [S(l.year), f6(l.openingPrincipal), f6(l.uplift), f6(l.added), f6(l.due), f6(l.available), f6(l.recovered), f6(l.interestPaid), f6(l.principalPaid), f6(l.principalAfter), f6(l.accruedInterestAfter), f6(l.closing)]));
w();
w('The engine\'s reasons, verbatim:');
reasons(devS.reasons);
w();
w(`SIMPLE AND COMPOUND AT THE SAME RATE. At ${f6(argsOf('devcarry-ekene-simple-ot18360').uplift.ratePctPerYear)} percent a year both forms recover the Ekene carry in ${S(devS.recoveredInYear)}; the simple form adds ${f6(devS.totals.uplift)} in all and the compound form ${f6(devE.totals.uplift)} (engine). The 2031 uplift shows why: simple interest is charged on the principal of ${f6(yr(devS.ledger, 2031).openingPrincipal)} alone (${f6(yr(devS.ledger, 2031).uplift)}), compound interest on the whole opening balance of ${f6(yr(devE.ledger, 2031).opening)}, which carries the 2030 uplift (${f6(yr(devE.ledger, 2031).uplift)}).`);
must('both forms recover in 2036 and simple adds less', devS.recoveredInYear === 2036 && devE.recoveredInYear === 2036 && devS.totals.uplift < devE.totals.uplift, `${devS.totals.uplift} ${devE.totals.uplift}`);
must('the 2031 simple uplift is 8 percent of the opening principal', Math.abs(yr(devS.ledger, 2031).uplift - 0.08 * yr(devS.ledger, 2031).openingPrincipal) < 1e-6, yr(devS.ledger, 2031).uplift);
const DAYB = [365, 360];
const a365 = argsOf('devcarry-ekene-simple-ot18360'); a365.uplift.dayBasis = `actual/${DAYB[0]}`;
const s365 = success('developmentCarry on devcarry-ekene-simple-ot18360 with dayBasis "actual/365" (stated probe)', E.developmentCarry(a365));
const y32 = yr(s365.ledger, 2032);
w(`A DAY BASIS. "annual-period" counts each ledger year as one year; "actual/365" and "actual/360" count the days of the calendar year over ${DAYB.join(' or ')}. On the same carry with dayBasis "actual/365" (stated probe), 2032 has ${S(y32.yearDays)} days and its uplift is ${f6(y32.uplift)} against ${f6(yr(devS.ledger, 2032).uplift)} (engine); the 2032 reason, verbatim:`);
quote(s365.reasons.find((t) => /^2032: 8% a year simple interest/.test(t)));
must('2032 has 366 days under actual/365 and its uplift is 366/365 of the annual-period uplift', y32.yearDays === 366 && Math.abs(y32.uplift - yr(devS.ledger, 2032).uplift * 366 / 365) < 1e-6, y32.uplift);
w();
const biE = runG('backin-ekene');
const biP = runG('backin-ekene-pia');
w('THE BACK-IN, in the engine\'s basis (backin-ekene), verbatim:');
quote(biE.basis.engine);
quote(biE.basis.rule);
w();
table(['golden case', 'party', 'before (after the farm-in)', 'after the back-in', 'ceded', 'refund received', 'refund paid'], ['backin-ekene', 'backin-ekene-pia'].flatMap((id) => runG(id).parties.map((p) => [id, p.id, f6(p.before), f6(p.after), f6(p.ceded), f6(p.refundReceived), f6(p.refundPaid)])));
w();
table(['golden case', 'basis (golden input)', 'refundable', 'excluded', 'refund', 'refund form', 'recovered in'], [biE, biP].map((r, i) => [['backin-ekene', 'backin-ekene-pia'][i], argsOf(['backin-ekene', 'backin-ekene-pia'][i]).backIn.basis, f6(r.refundable), f6(r.excluded), f6(r.refund), r.refundForm, r.recovery ? S(r.recovery.recoveredInYear) : 'upfront']));
['backin-ekene', 'backin-ekene-pia'].forEach((id) => { w(`${id}, the engine's reasons, verbatim:`); reasons(runG(id).reasons); });
must('the Ekene back-in refund is 5 percent of the development wells', biE.refund === 24000000 && biE.excluded === 46000000, biE.refund);
w();
w(`THE JOINT VENTURE ENGINE UNDERNEATH. Both functions build the interests after the farm-in and hand them to carryRecovery and backIn of engines/economics/jointVenture.js, which compute every figure above; the joa course teaches carries, back-ins and the operating agreement, and PIA s.85(4) that backin-ekene-pia names. A back-in's trigger is a contract event the caller reports; the engine does not decide when it happens.`);

/* ============================================================ SECTION 22 */

section('readings', 'The readings the engine states, where each acts and what it would move', ['Expert m05 l01']);
w('Where a text leaves a choice open, the engine takes one and states it in its basis. The course quotes each reading verbatim and grades no figure that depends on it: every capstone field is bit-identical under each reading and under the alternative named beside it.');
w();
w('READING ONE: THE VALUATION TIMING. The engine\'s basis (deal-ekene), verbatim:');
quote(dE.basis.timing);
w(`It acts on every EMV of ${ref('dealvalue')}: a deal whose well costs, bonus, reimbursement and fees fell a year after the valuation date would discount them at the success-case rate and give different EMVs. The Penn State problem has no time dimension at all. The engine values at one date and says so.`);
w();
w('READING TWO: THE DAY COUNT OF REG. 19(7). The engine\'s basis (fee-ekene), verbatim:');
quote(feeE.basis.timing);
w(`The regulation says "within 90 days of notification" (${C('aoi_19_7_ninety_days').cite}). The engine counts from the notification date to the payment date without the notification day; counting that day as well would move a payment on day 90 into the grace days. It acts only at the day boundaries of ${ref('feetiming')}.`);
w();
w(`READING THREE: THE NINETIETH SURCHARGE DAY. The regulation imposes the surcharge "for 90 days failing which the consent is deemed withdrawn" (${C('aoi_19_9_surcharge').cite}). The engine charges the ninetieth surcharge day and deems the consent withdrawn from the ninety-first (fee-day-210 and fee-day-211); the other reading would withdraw it on the ninetieth.`);
w();
w('READING FOUR: HOW A SIMPLE-INTEREST UPLIFT IS PAID. The engine\'s basis (devcarry-ekene-simple-ot18360), verbatim:');
quote(devS.basis.uplift);
w(`HMRC's manual says only that the recovery usually includes "an addition representing simple interest" (${C('hmrc_ot18360_simple_interest').cite}); it does not say whether a recovery pays the interest or the principal first. The engine pays the accrued interest first, then the principal, and charges interest on the outstanding principal only; paying principal first would leave more principal outstanding to earn interest. It acts only when a carry states uplift type "simple".`);
w();
w('THE VALUE OF THE TRANSACTION IS A STATED INPUT. The engine\'s basis (fee-ekene), verbatim:');
quote(feeE.basis.value);
w('It is no reading: the engine takes the amount and its source from the caller and charges the gazetted rates on it (' + ref('fee') + ').');

/* ============================================================ SECTION 23 */

section('quirks', 'Reference texts and their quirks: one table with two numbers, a regulation numbered twice, one value defined twice', ['Expert m05']);
w(`A TABLE WITH TWO NUMBERS. The Penn State EME 801 page labels its payoff table as Table 6.1 where it first prints it and refers to it as Table 10.1 when it computes the EMVs and the value at risk from the same figures (text, ${PSU.cite}, numbers only). The course cites the page and its printed figures and calls the table by its first label.`);
// quote_check.py checks the Penn State page prints both table numbers.
w();
w(`THE REGULATIONS NUMBER THEIR LAST PROVISIONS TWICE. The arrangement at the front lists "${dashfix(C('aoi_arrangement_citation').quote)}" (${C('aoi_arrangement_citation').cite}), while the body prints regulation ${C('aoi_23_guidelines').quote.match(/^\d+/)[0]} as guidelines ("${dashfix(C('aoi_23_guidelines').quote)}", ${C('aoi_23_guidelines').cite}) and numbers the citation ${C('aoi_26_citation').quote.match(/^\d+/)[0]} ("${dashfix(C('aoi_26_citation').quote)}", ${C('aoi_26_citation').cite}). A citation of "reg. ${C('aoi_arrangement_citation').quote.match(/(\d+)\. Citation/)[1]}" follows the arrangement; the body prints no regulation of that number.`);
w(`THE TITLE ON THE COVER. The gazette cover lists the instrument as "${dashfix(C('aoi_cover_title').quote)}" (${C('aoi_cover_title').cite}); the citation names it the Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024, the name this course uses.`);
w();
w(`ONE VALUE DEFINED TWICE. Reg. 19(3) makes the value of the transaction the amount payable to the assignor stated in the application or contract, or an amount the Commission prescribes; reg. 24 defines it as "the amount determined by the Commission to be the value receivable by the Assignor" (${C('aoi_24_value').cite}). The engine takes the amount and its source as stated inputs (${ref('fee')}).`);
w();
w(`PAID BEFORE AND PAID AFTER. Reg. 19(6) says consent is not granted until the application and processing fees are paid in full (${C('aoi_19_6_paid_before').cite}); reg. 19(7) gives the assignor 90 days from the notification of the grant to pay the applicable fee (${C('aoi_19_7_ninety_days').cite}). The engine applies the timing of reg. 19(7) to (9) to the whole seven per cent and computes no application fee (reg. 19(1) leaves it to other regulations).`);
w();
w(`ONE PARTY, FIVE NAMES. The engine says farmor and farminee. The Act says "farmee" (${C('pia_94_5_farmee').cite}); HMRC's manual says Farmer Out and Farmer In (${C('hmrc_ot30020_farm_out').cite}) and, on another page, the increasing interest party, "farmer-in or farmee" (${C('hmrc_ot18320_farmee').cite}). HMRC also separates a farm in, assigned before the work, from an earn-in, assigned after it (${C('hmrc_ot30021_farm_in').cite}; ${C('hmrc_ot30021_earn_in').cite}); the engine's two vesting rules are those two orders.`);
w();
w('A UK MANUAL FOR CONCEPTS. The HMRC Oil Taxation Manual is United Kingdom tax guidance published under the Open Government Licence; the course quotes it for what a farm in, an earn-in, a reimbursement and a development carry are, and applies none of its tax rules.');

/* ============================================================ SECTION 24 */

section('boundaries', 'Boundaries, rule by rule', ['Expert m05 l04']);
w('Every rule the engine applies has its own boundary; no single rule covers them all. Each row below was probed by a call on a golden input when this digest was built:');
w();
const bz2 = runG('deal-ekene-dry-hole');
const bc2 = runG('deal-ekene-certain');
const bfs = runG('deal-break-even-at-farmor-share');
table(['rule', 'at the boundary (probed)', 'engine result'], [
  ['gross-cost cap', `a gross cost EQUAL to the cap (earn-cap-gross-exactly: ${f6(cge.grossCost)})`, `"${cge.capState}", excess ${f6(cge.excess)}; the promote on all of it`],
  ['carry-amount cap', `a carry EQUAL to the cap (earn-cap-carry-exactly: ${f6(cce.carry)})`, `"${cce.capState}"`],
  ['carry-amount cap of 0', 'a cap of 0 (earn-cap-carry-zero)', `carry ${f6(runG('earn-cap-carry-zero').events[0].carry)}; the farminee pays its own share alone`],
  ['promote', `a share paid EQUAL to the interest earned (earn-heads-up)`, `promote ${f6(hu.promotePoints)} points, ratio ${f6(hu.promoteRatio)}`],
  ['share paid', 'a share paid EQUAL to the farmor\'s interest (earn-full-carry)', `accepted; the farmor pays ${f6(fc.farmorPays)}; one point above is refused (earn-refuse-pays-above-farmor)`],
  ['interest earned', 'the farmor\'s whole interest earned (earn-all-of-farmor)', `accepted; the farmor holds ${f6(byId(runG('earn-all-of-farmor').interestsAfter, 'EKO').participatingPct)} after`],
  ['vesting "all-events"', 'one event short of all (earn-ekene-drill-to-earn)', `vested ${f6(dte.vestedPct)}`],
  ['break-even promote', `the share asked EQUAL to the break-even share (deal-promote-exactly-break-even)`, `farminee EMV ${f6(pe.farmineeSide.farmIn.emv)}, a tie between ${pe.farmineeSide.tiedActions.join(' and ')}`],
  ['break-even at the farmor\'s share', 'EMV 0 exactly at the farmor\'s whole share (deal-break-even-at-farmor-share)', `"${bfs.breakEvenPromote.status}" at ${f6(bfs.breakEvenPromote.farmineePaysPct)}`],
  ['chance of success', 'stated as 0 (deal-ekene-dry-hole)', `every EMV is its dry-hole payoff; the farmor's best action "${bz2.farmor.bestAction}"`],
  ['chance of success', 'stated as 100 (deal-ekene-certain)', `every EMV is its success payoff; the farmor's best action "${bc2.farmor.bestAction}"`],
  ['cash bonus', 'stated as 0 (deal-ekene-bonus-zero)', 'reported in a reason: "cash bonus: none (stated as 0)"'],
  [`fee, day ${S(runG('fee-day-90').payment.days)}`, `paid ${S(runG('fee-day-90').payment.days)} days after the notification (fee-day-90)`, `"${runG('fee-day-90').payment.status}"`],
  [`fee, day ${S(runG('fee-day-91').payment.days)} and day ${S(runG('fee-day-120').payment.days)}`, `the first and last of the further ${S(NG.graceDays)} days (fee-day-91, fee-day-120)`, `"${runG('fee-day-91').payment.status}", no surcharge`],
  [`fee, day ${S(runG('fee-day-121').payment.days)}`, 'the first surcharge day (fee-day-121)', `${S(runG('fee-day-121').payment.surchargeDays)} surcharge day, ${f6(runG('fee-day-121').payment.surcharge)}`],
  [`fee, day ${S(d210.days)}`, 'the ninetieth surcharge day (fee-day-210)', `${S(d210.surchargeDays)} surcharge days, ${f6(d210.surcharge)}; the consent stands`],
  [`fee, day ${S(d211.days)}`, 'one day more (fee-day-211)', `"${d211.status}"`],
  ['EVII against its cost', 'EVII EQUAL to the cost (info-uninformative)', 'reported: "the information is worth exactly its cost"'],
  ['price-to-value ratio', 'a value per percent at or below 0 (interest-negative-emv)', 'no ratio, and a reason says why'],
  ['carry recovered exactly', 'available EQUAL to the balance (devcarry-recovered-exactly)', `recovered that year; closing ${f6(dre.ledger[1].closing)}`],
  ['a development carry', 'the farminee earning the farmor\'s whole interest', 'refused: the farmor keeps a carried interest (devcarry-refuse-earn-all)'],
  ['draw work', `iterations x holdings above ${S(D.MAX_DRAW_WORK)}`, 'refused, with the most draws the holdings allow (risk-refuse-work)'],
]);
must('the fee boundaries hold', runG('fee-day-90').payment.status === 'on-time' && runG('fee-day-91').payment.status === 'within-grace' && runG('fee-day-120').payment.status === 'within-grace', 'fee');
must('a stated chance of 0 makes the farmor walk away and 100 drill alone', bz2.farmor.bestAction === 'walk away' && bc2.farmor.bestAction === 'drill alone', `${bz2.farmor.bestAction} ${bc2.farmor.bestAction}`);
must('the break-even at the farmor share is solved at 100', bfs.breakEvenPromote.status === 'solved' && bfs.breakEvenPromote.farmineePaysPct === 100, JSON.stringify(bfs.breakEvenPromote).slice(0, 80));
must('the uninformative reason says worth exactly its cost', unin.reasons.some((t) => /worth exactly its cost/.test(t)), 'exact');
must('the pays-above-farmor refusal names events[0].farmineePaysPct', GC['earn-refuse-pays-above-farmor'].expected.field === 'events[0].farmineePaysPct', 'refuse');

/* ============================================================ SECTION 25 */

section('notcomputed', 'What the engine does not compute', ['Expert m06']);
w('Each item below is taught as a concept only, with where it would come from. None is graded.');
w();
table(['not computed', 'where it comes from', 'what the engine does instead'], [
  ['which consideration of a farm-out counts in the value of the transaction', 'AOI 2024 reg. 19(3) and reg. 24', 'takes the amount and its source as stated inputs'],
  ['the Commission\'s metrics for good and valuable consideration', 'AOI 2024 reg. 19(3)(b)', 'takes a Commission-determined amount as a stated input'],
  ['the application fee', 'AOI 2024 reg. 19(1), set by other regulations of the Commission', 'nothing'],
  ['the fee for a PEL assignment', 'the Commission\'s regulations (reg. 16 gives the consent to the Commission)', 'refuses a PEL under the gazetted basis; charges stated rates under basis "stated"'],
  ['the administrative fines for an assignment without consent or a late beneficial ownership notice', 'AOI 2024 reg. 21', 'nothing'],
  ['a decommissioning and abandonment plan funded by the incoming parties', 'PIA s.233(10)', 'nothing; concept only'],
  ['the tax on the deal (capital gains, hydrocarbon tax, companies income tax)', 'HMRC Oil Taxation Manual (UK); PIA s.264(f) and s.302(12)(c) for the fee', 'reports the fee as not tax deductible'],
  ['royalty, net profit and other subordinated interests granted as consideration', 'HMRC OT18320 and OT30131', 'nothing; a subordinated interest is valued outside'],
  ['well costs discounted to their own dates', 'the valuation timing', 'costs at the valuation date (' + ref('readings') + ')'],
  ['a market value for an interest', 'a transaction market', 'value per percent of stated figures and ratios of stated prices'],
  ['when a back-in is triggered', 'the contract', 'the caller reports the event and states the target'],
]);
w();
w('WHAT THE ENGINE SAYS IT DOES NOT DECIDE, in its own bases, verbatim:');
quote(feeE.basis.value);
quote(ipE.basis.metrics);

/* ============================================================ SECTION 26 */

section('sizecaps', 'Size caps and refusals at scale', ['Expert m06 l02']);
const P = (n) => Array.from({ length: n }, (_, i) => ({ id: `P${i}`, participatingPct: 100 / n }));
const baseDeal = argsOf('deal-ekene');
const EVN = (n) => Array.from({ length: n }, (_, i) => ({ name: `e${i}`, grossCost: 1, farmineePaysPct: 1, earnedPct: 1, cap: { on: 'none' } }));
const CAPR = [
  ['MAX_PARTIES', `earningObligation with ${D.MAX_PARTIES + 1} parties`, E.earningObligation({ ...argsOf('earn-heads-up'), parties: P(D.MAX_PARTIES + 1), farmor: 'P0' }), 'parties'],
  ['MAX_EVENTS', `earningObligation with ${D.MAX_EVENTS + 1} events`, E.earningObligation({ ...argsOf('earn-heads-up'), events: EVN(D.MAX_EVENTS + 1) }), 'events'],
  ['MAX_YEARS', `dealValue with ${D.MAX_YEARS + 1} years of cash flows`, E.dealValue({ ...baseDeal, project: { ...baseDeal.project, successValue: { cashFlows: Array.from({ length: D.MAX_YEARS + 1 }, (_, i) => ({ year: 2000 + i, net: 1 })), discountRate: 0.1, baseYear: 2000 } } }), 'project.successValue.cashFlows'],
  ['MAX_SIGNALS', `informationValue with ${D.MAX_SIGNALS + 1} signals`, E.informationValue({ ...argsOf('info-ekene-farminee'), information: { cost: 0, signals: Array.from({ length: D.MAX_SIGNALS + 1 }, (_, i) => ({ label: `s${i}`, likelihoodsPct: [100 / (D.MAX_SIGNALS + 1), 100 / (D.MAX_SIGNALS + 1)] })) } }), 'information.signals'],
  ['MAX_POSITIONS', `riskSharing with ${D.MAX_POSITIONS + 1} positions`, E.riskSharing({ ...argsOf('risk-psu'), positions: Array.from({ length: D.MAX_POSITIONS + 1 }, (_, i) => ({ name: `p${i}`, holdings: [{ id: 'h', chanceOfSuccessPct: 50, successValue: 1, failCost: 1, successStdDev: 0 }] })) }), 'positions'],
  ['MAX_HOLDINGS', `riskSharing with ${D.MAX_HOLDINGS + 1} holdings in one position`, E.riskSharing({ ...argsOf('risk-psu'), positions: [{ name: 'p', holdings: Array.from({ length: D.MAX_HOLDINGS + 1 }, (_, i) => ({ id: `h${i}`, chanceOfSuccessPct: 50, successValue: 1, failCost: 1, successStdDev: 0 })) }] }), 'positions[0].holdings'],
  ['MAX_ITERATIONS', `riskSharing with ${D.MAX_ITERATIONS + 1} draws`, E.riskSharing({ ...argsOf('risk-psu'), iterations: D.MAX_ITERATIONS + 1 }), 'iterations'],
  ['MAX_RESERVES', `interestValue with ${D.MAX_RESERVES + 1} reserve categories`, E.interestValue({ ...argsOf('interest-ekene-risked'), transaction: { price: 1, volumeUnit: 'MMboe', reserves: Array.from({ length: D.MAX_RESERVES + 1 }, (_, i) => ({ category: `c${i}`, grossVolume: 1 })) } }), 'transaction.reserves'],
];
table(['cap', 'value', 'stated call over the cap', 'the engine\'s message, verbatim'], CAPR.map(([k, what, r, field]) => { refusal(`cap ${k}: ${what}`, r, field); return [`\`${k}\``, S(D[k]), what, r.error]; }));
w();
const work = E.riskSharing(argsOf('risk-refuse-work'));
w(`THE DRAW WORK CAP. iterations times holdings over all positions may not exceed ${S(D.MAX_DRAW_WORK)}; the refusal names the most draws the stated holdings allow (risk-refuse-work), verbatim:`);
quote(work.error);
w('A panel stays well inside these caps.');

/* ============================================================ SECTION 27 */

section('choices', 'Conventions that are choices, and the farm-out report', ['Expert m06']);
w('CONVENTIONS THAT ARE CHOICES. Each is the engine\'s stated choice where no text fixes one; a different choice would move a figure, so each is named in any report that quotes the figure:');
w();
table(['convention', 'the engine\'s choice', 'where it comes from'], [
  ['the promote', 'the share of the gross cost paid less the interest held after the event, in points; the ratio is share paid over interest held', 'engine convention'],
  ['the carry', 'what the farminee pays less its own held interest of the gross cost', 'engine convention'],
  ['a gross-cost cap', 'the promote on the cost up to the cap; the excess by the stated overrun rule', 'a stated deal term'],
  ['vesting', '"per-event" vests each completed event; "all-events" vests nothing until every event is completed', 'HMRC OT30021 (farm in and earn-in)'],
  ['the payments', 'counted for completed events only; every event\'s split reported as the obligation', 'engine convention'],
  ['the equivalent working interest', '(well payment + cash bonus + reimbursement) / gross cost of the completed events x 100', 'engine convention'],
  ['the positions', 'the farmor receives the bonus and reimbursement and pays the assignor fees in both outcomes', 'engine convention'],
  ['the valuation timing', 'every cost at the valuation date, undiscounted', 'a stated reading (' + ref('readings') + ')'],
  ['working-interest scaling', 'the canonical applyJV of cashflow.ts, with no royalty, tax or cost', 'engines/economics/cashflow.ts'],
  ['ties', 'reported, every tied action named', 'engines/economics/decisionTree.js'],
  ['the break-even promote', 'the largest share paid with the farminee\'s EMV at or above 0, exact between breakpoints', 'engine convention'],
  ['the fee day count', 'from the notification date to the payment date, the notification day not counted', 'a stated reading (' + ref('readings') + ')'],
  ['percentile labels', 'P90 the low case, P10 the high case', 'lib/conventions/percentile.js'],
  ['money in a reason', 'rounded to the cent, half away from zero, trailing zeros dropped; a computed percentage, probability or ratio to six decimals; every numeric field keeps full precision', 'engine convention'],
]);
w();
w('WRITING THE FARM-OUT REPORT names: the licence and its parties (synthetic in this course) with their participating interests before and after; the farmor and the farminee; every source applied with its edition and the date read; each event with its gross cost, share paid, interest earned, cap and overrun rule; the vesting rule and the events completed; the cash bonus, the reimbursement, the consideration and the equivalent working interest; the chance of success, the well costs and the success-case value with its rate and base year; each side\'s EMV and best action, the break-even promote and chances; the value of information to each side with its likelihoods and cost; the price per percent and any transaction ratio with its basis; the development carry or back-in with its terms; the consent needed, the value of the transaction with its source, the fee and the dates; and each reading the figures rest on.');

/* ============================================================ SECTION 28 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Seven terms in this course carry a narrower meaning than they have in conversation. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['term', 'what it can mean elsewhere', 'the rule here'], [
  ['interest', 'any interest, including money charged on a loan', 'always qualified: participating interest, working interest, carried interest or vested interest for a share of the licence; "simple interest" or an "uplift" for money added to a carry'],
  ['promote', 'any advancement', 'the share of the gross cost the farminee pays less the interest it holds after the event, in points; the promote ratio is the share paid over the interest held'],
  ['carry', 'anything carried', 'the part of the farmor\'s cost share the farminee pays; a development carry is the farminee paying the farmor\'s later development costs, recovered from the farmor\'s production'],
  ['consideration', 'any payment', 'what the farmor receives for the interest: the carry, the cash bonus and the reimbursement; the "value of the transaction" is the amount reg. 19(3) charges the fee on'],
  ['EMV', 'any average', 'the expected monetary value of a named position at a stated chance of success, rolled back by the canonical decision tree'],
  ['break-even', 'any point of balance', 'always of a named term: the break-even promote (a share paid) or the break-even chance of success, each at an EMV of 0 for a named position'],
  ['farmor and farminee', 'farmer out, farmer in, farmee, assignor, acquirer', 'the engine\'s names for the party giving up an interest and the party earning it; the texts\' own words are quoted as they print them'],
]);
w();
w('A FIGURE THAT DEPENDS ON A TERM is quoted with it: a payment with its share paid, interest earned and cap; a consideration with its bonus and reimbursement; an EMV with its chance, payoffs and value basis; a break-even with the position it belongs to; a fee with its value of the transaction and dates; a value per percent with its basis; a carry recovery with its uplift and recovery share; an NPV with its rate and base year.');

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', process.env.EC10_DUMP_PARTIAL || unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', process.env.EC10_DUMP_PARTIAL || SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)));
must('no em or en dash reaches the digest', !OUT.some((l) => /[–—]/.test(l)), OUT.find((l) => /[–—]/.test(l)));
must('the negative control list names the plants the discriminate sweep reuses', /promote computed on the wrong base/.test(NEGCONTROL) && /EMV without dry-hole cost/.test(NEGCONTROL), 'negcontrol');

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`farmout_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.EC10_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`farmout_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
