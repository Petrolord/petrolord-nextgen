// THE EC9 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-jointVenture.md,
// the oracle, the golden file's expected figures, the fixture README and the
// engine's own source comments are PROVENANCE. Where they state a figure this
// file recomputes it through the engine on the vendored golden INPUTS, on the
// fixture, or on stated inputs, and prints it.
//
// Usage:  sh /root/cat-wip-joa/build_digest.sh > digest.tmp && mv digest.tmp digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE
// (engines/economics/jointVenture.js and the applyPSC and npv it imports from
// engines/economics/cashflow.ts), except where a line says "stated" (an input
// typed in this file and printed beside the call it went into), "golden input"
// (an input read from the vendored test-data/economics/goldens/
// jointventure_cases.json, whose inputs are the Ekene synthetic fixture and
// stated probes), "fixture" (read from the vendored ekene-jv file), "text" (a
// figure printed by a public text, quoted in concepts.json with its citation
// and verified against the text by quote_check.py, or typed here with its
// citation) or "derived" (arithmetic on engine values printed in the same
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
// THE DIGEST IS NOT THE CAPSTONE. This file never reads joa_capstone.mjs,
// fields.json or the capstone cases, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.EC9_WAVE_DIR || '/root/cat-wip-joa';
const { J, CF, ROOT, ENGINE_REL } = await import(`${HERE}/joa_engine.mjs`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const FINDINGS = fs.readFileSync(`${ROOT}/tools/validation/economics/FINDINGS-jointVenture.md`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/jointventure_cases.json`, 'utf8'));
const FX = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/ekene-jv/ekene-jv.json`, 'utf8'));
const CONCEPTS = JSON.parse(fs.readFileSync(process.env.EC9_CONCEPTS || `${HERE}/concepts.json`, 'utf8'));
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
  'interests', 'cashcalls', 'budget', 'overhead',
  'reconciliation', 'carry', 'backin', 'default', 'psc', 'published',
  'nonconsent', 'buyin', 'readings', 'quirks', 'boundaries', 'notcomputed', 'caps', 'choices',
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
  return success(`${c.fn} on the golden input ${id}`, J[c.fn](clone(c.args)));
};
const argsOf = (id) => clone(GC[id].args);
const yr = (rows, y) => rows.find((x) => x.year === y);
const byId = (rows, id) => rows.find((x) => x.id === id);
const D = J.DEFAULTS;
const PIA = J.PIA_JV;
const PIDS = FX.parties.map((p) => p.id);

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# EC9 TEACHING DIGEST: Joint Ventures, Operating Agreements & Cost Recovery');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle, the golden file\'s expected figures, the fixture README and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every amount of money, interest, share, percentage, rate, multiple, balance and present value prints to SIX decimals; years, months, day counts, hours, party counts and whole inputs print as whole numbers; a figure of sixteen or more significant digits at six decimals prints with its thousands grouped by commas; an engine message, reason and basis is printed verbatim, figures and all. Inside a message, money prints rounded to the cent with trailing zeros dropped, and a percentage or rate prints as the shortest round-trip decimal of the double the engine holds.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines 3ae56e7 (engines PR #270), ${engineLines} lines. It imports applyPSC and npv from engines/economics/cashflow.ts and calculatePartnerCosts from engines/economics/afe.js, and nothing else. It makes no network call.`);
w();
w('# AN ENGINE COURSE. There is no Suite app for this course. Every practical runs in the course\'s own calculator panels, which call this same vendored engine on the learner\'s own agreement terms.');
w();
w('# THE DATA. Every Ekene party, budget, cost, cash call and production figure is SYNTHETIC, written for this platform by a stated script. No real company, contract, budget, price or regulator decision appears.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone case and no graded answer. The capstones run their own joint ventures and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m05', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming the rule it applied and where the rule comes from, so the working can be printed.');
w();
const EXPORTS = [
  ['participatingInterests', 'interests', 'parties, carries', 'each party\'s beneficial interest (its share of production), paying interest (its share of cost) and carried part, and each carry\'s carriers with their points'],
  ['cashCalls', 'monthly cash calls', 'parties, carries, months, reconciliationLagMonths, negativeCall, noCallBelow', 'each month\'s forecast share, adjustment, call, arrears billing, actual share, difference, amount carried and balance per party, with reasons, and the closing balances'],
  ['budgetControl', 'budget control', 'items, itemTolerancePct, budgetTolerance, unbudgetedAllowance', 'each item\'s overrun, limit and whether it is inside its tolerance, the budget total against the allowed overrun, and the unbudgeted items against their allowance'],
  ['overhead', 'operator overhead', 'costs, excluded, scale', 'each category\'s base, the charge in each band and above the last band, and the total'],
  ['defaultCover', 'a default on a cash call', 'parties, carries, callTotal, dueDate, asOf, defaulters, interest, suspension, forfeiture, holidays', 'each defaulter\'s unpaid amount and default interest, the cover by each non-defaulting party, the stated consequences with their trigger dates, and the interests after a forfeiture'],
  ['carryRecovery', 'a carry and its recovery', 'parties, carries, carried, years, uplift, recoverFromPct, cap, basis, discountRate, baseYear', 'the recovery ledger (opening, uplift, carried cost, due, available, recovered, closing, written off), each party\'s cash flow by year and its NPV'],
  ['backIn', 'a back-in', 'parties, backInParty, targetPct, costs, basis, refundableKinds, refundForm, recoverFromPct, years', 'the interests after the back-in, the refundable and excluded costs, the refund, who receives it, and its recovery from future entitlement'],
  ['nonConsent', 'sole risk and non-consent', 'parties, consenting, operation, premiumMultiplePct, mode, years', 'the consenting parties\' cost shares, each non-consenting party\'s premium, and either its buy-in payment or the recovery ledger with the year its interest reverts'],
  ['pscCostRecovery', 'PSC cost recovery', 'years, royaltyPct, costOilLimitPct, costOilLimitBase, contractorProfitSharePct, taxRatePct, openingCostPool, parties, discountRate, baseYear', 'each year\'s royalty, cost oil limit, cost recovered, pool carried, profit oil and its split, tax and contractor entitlement through the canonical applyPSC, the split between partners and their NPVs'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof J[name] === 'function', typeof J[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(J).filter((k) => typeof J[k] === 'function').length === EXPORTS.length, Object.keys(J).filter((k) => typeof J[k] === 'function').join(','));
w();
w('The stated constants, read from the exported `DEFAULTS` and `PIA_JV`:');
w();
const DSRC = {
  MAX_PARTIES: 'the most parties (and carries, and defaulters) one call accepts',
  MAX_YEARS: 'the most years one call accepts',
  MAX_MONTHS: 'the most months in one cash call ledger',
  MAX_ITEMS: 'the most budget items, cost categories or cost lines in one call',
  MAX_BANDS: 'the most bands in one overhead scale',
  SUM_TOLERANCE: 'how far participating interests or carrier shares may sum from 100',
};
table(['constant', 'value', 'what it sets', 'where it comes from'], [
  ...Object.entries(D).map(([k, v]) => [`\`DEFAULTS.${k}\``, S(v), DSRC[k], k === 'SUM_TOLERANCE' ? 'engine convention' : 'cap']),
  ['`PIA_JV.maxGovernmentParticipationPct`', f6(PIA.maxGovernmentParticipationPct), 'the most the Government may participate to under basis "pia-s85-4"', 'PIA s.85(4)(a)'],
  ['`PIA_JV.refundableKinds`', PIA.refundableKinds.join(', '), 'the cost kinds refunded under basis "pia-s85-4"', 'PIA s.85(4)(c)'],
  ['`PIA_JV.renegotiatedPscCostOilLimitPct`', f6(PIA.renegotiatedPscCostOilLimitPct), 'the ceiling on the cost oil limit of a renegotiated PSC, reported in the basis only', 'PIA s.311(2)(a)(iii)'],
]);
must('DEFAULTS carries six values, each described here', Object.keys(D).length === 6 && Object.keys(D).every((k) => DSRC[k]), Object.keys(D));
must('DEFAULTS and PIA_JV are frozen', Object.isFrozen(D) && Object.isFrozen(PIA), 'frozen');
must('PIA_JV carries the three values', PIA.maxGovernmentParticipationPct === 60 && PIA.refundableKinds.join() === 'development,production' && PIA.renegotiatedPscCostOilLimitPct === 60, JSON.stringify(PIA));
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports and its source:');
const IMPORTS = [...ENGINE_SRC.matchAll(/^import .* from \x27([^\x27]+)\x27;$/gm)].map((m) => m[1]);
must('the engine imports exactly cashflow.ts and afe.js', IMPORTS.join() === './cashflow.ts,./afe.js', IMPORTS.join());
must('the engine source makes no network call, reads no clock and draws no random number', !/\bfetch\x28|XMLHttpRequest|\bimport\x28|require\x28|Math\.random|Date\.now|new Date\x28\x29/.test(ENGINE_SRC), 'none');
w('- Its two imports are engines/economics/cashflow.ts, for applyPSC and npv, and engines/economics/afe.js, for calculatePartnerCosts. It computes the PSC cost pool through the canonical applyPSC, discounts through the canonical npv and splits every joint account amount between parties through the canonical calculatePartnerCosts; it carries no cost pool, NPV or Monte Carlo code of its own, and nothing in it samples.');
w(`- It decides nothing a contract or a text does not state. Every carry share, uplift, recovery share, cap, reconciliation lag, negative call rule, tolerance, overhead band and rate, default interest rate, day basis, interest method, grace, premium multiple, royalty, cost oil limit and its base, profit share and tax rate is an input with no default, and a call without one is refused by name (${ref('refusals')}).`);
must('ACCEPTED_KEYS carries one shape for every exported function', Object.keys(J.ACCEPTED_KEYS).sort().join() === EXPORTS.map((x) => x[0]).sort().join() && Object.isFrozen(J.ACCEPTED_KEYS), Object.keys(J.ACCEPTED_KEYS).join());
w(`- It reads no key it does not know. \`ACCEPTED_KEYS\` is exported with one shape for each of the ${EXPORTS.length} functions, and every call refuses an input key the function does not read, at every level, naming the key, its path and the accepted keys. A misspelt optional key is refused; it never silently drops a term.`);
w(`- It computes no compensation on an assignment, no cover by taking a defaulter's petroleum, no interest on cash balances, no index adjustment of a scale, no expert determination and no sliding scale of profit shares. ${refCap('notcomputed')} lists each with where it would come from.`);
w(`- Its exported names are, in full: ${Object.keys(J).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('sources', 'The sources, their editions and the date each was read', ['Associate m01 l04', 'Professional m03', 'Professional m06', 'Expert m04']);
w('THE RULE THIS COURSE FOLLOWS FOR EVERY LAW, REGULATION, MODEL CONTRACT AND GUIDE IT TEACHES. Each one is named with its edition or gazette date and the date it was read. Only publicly available texts are quoted, with their citation. Licensed model contracts and accounting procedures (the AIPN model joint operating agreement, the COPAS accounting procedures and the AAPL forms) are taught by concept only and never quoted. Every legal figure the engine applies was read from the cited text and is cited to its section; every contractual rate, percentage, multiple, share, tolerance and scale is a required input with no default. Every text below was read on 2026-09-26.');
w();
const SOURCES = [
  ['Norway, Ministry of Petroleum and Energy, Agreement concerning petroleum activities: Attachment A Joint Operating Agreement and Attachment B Accounting Agreement', 'unofficial English translation; the PDF is dated 27 February 2007; cited from the Wayback Machine capture of 26 May 2024 (the live regjeringen.no copy answered a bot check with HTTP 403 on the date read)', 'JOA Art. 8.1, Art. 9.1 to 9.5, Art. 12.5, Art. 18.1 to 18.14, Art. 19.6; Accounting Agreement Art. 1.2.1, 1.2.2, 2.2.2 and 2.2.3', 'the PDF is dated 27 February 2007 (document properties); CITED FROM the Wayback Machine capture of 26 May 2024 (capture 20240526033840)'],
  ['Petroleum Industry Act 2021 (Act No. 6)', 'Official Gazette No. 142, Vol. 108, 27 August 2021', 's.85(2)(a) and (d); s.85(4)(a) to (g), the carried interest provision; s.311(2)(a)(iii), the renegotiated PSC cost oil limit (reported only); s.54(8) and s.65 as concepts', 'Official Gazette No. 142, Vol. 108, 27 August 2021'],
  ['World Bank, Petroleum Sector Briefing Note No. 8, Contracts for Petroleum Development, Part 2', 'November 2007; Public Disclosure Authorized', 'the two-barrel illustration and Figure 2: royalty first, the cost oil limit on gross, profit oil split, income tax', 'November 2007; Public Disclosure Authorized'],
  ['IMF, Luca and Mesa Puyo, Fiscal Analysis of Resource Industries (FARI) Methodology, TNM/16/01', 'February 2016; read from the Wayback capture of 12 October 2025 (the direct download answered 403)', 'Figure 5 (one USD100 barrel under a PSC), Table 11 (the PSC/DROP regime), Table 12 (cost petroleum by year) and Table 13 (DROP profit sharing)', 'February 2016; IMF publication, free access; the direct download returned 403, so the Wayback capture of 12 October 2025 was read'],
  ['IMF, Benninger, Devlin, Camero Godinez and Vernon-Lin, Cash Flow Analysis of Fiscal Regimes for Extractive Industries, WP/24/89', 'April 2024; read from the Wayback capture of 14 August 2025', 'concept only: production shared net of royalties; a carry as a financing arrangement repaid from the state\'s share of production', 'April 2024; IMF copyright; read from the Wayback capture of 14 August 2025'],
  ['Republic of Kenya, Model Production Sharing Contract, Participation Agreement', '2015 model (file name dated 21 January 2015)', 'Art. 6: the cash call on notice, an excess advance reducing the next advance or refunded, interest compounded monthly from the due date with the seventy-two hour clause, no vote after five days, forfeiture after ninety days', '2015 model (file name dated 21 January 2015)'],
  ['Tanzania, Model Production Sharing Agreement 2013 (TPDC)', '2013; read from the Wayback capture of 23 May 2024', 'concept only: a cost recovery limit on production net of royalty, a contractor loan of an unpaid amount recovered from cost oil, an overhead cap before the development licence', '2013; resourcecontracts.org copy read from the Wayback capture of 23 May 2024'],
  ['OpenOil, Oil Contracts: How to read and understand them', 'version 1, November 2012, Creative Commons', 'no schedule is used; its state participation example is taught as a printed arithmetic error', 'version 1, November 2012, Creative Commons'],
];
table(['text', 'edition or date', 'what the course reads from it', 'date read'], SOURCES.map(([t, e, u]) => [t, e, u, '2026-09-26']));
SOURCES.forEach(([t, , , frag]) => must(`FINDINGS records the edition of "${t}"`, frag.split(' | ').every((f) => FINDINGS.includes(f)), frag));
must('FINDINGS records every source as read on 2026-09-26', FINDINGS.includes('## Sources (all read 2026-09-26)'), 'read date');
w();
w('WHERE NO PUBLIC TEXT PRINTS A WORKED SCHEDULE. The validation record states, verbatim:');
const NOPUB = FINDINGS.match(/The research found NO public text that prints a worked schedule for a carry\s+recovered with interest, for a non-consent premium recovered from\s+production, for a cash call over\/under reconciliation, for a default cover\s+or for an overhead scale applied to figures\./);
must('FINDINGS records that no public worked schedule exists for the JV arithmetic', !!NOPUB, 'no public schedule');
quote(NOPUB ? NOPUB[0].replace(/\s+/g, ' ') : '');
w(`The carry, cash call, default, overhead and premium figures of this course are therefore the stated clause arithmetic of the Norwegian agreement and PIA s.85(4), each run by the engine; the PSC cost recovery has published worked examples, and ${ref('published')} runs all three.`);
w();
w('The engine carries its citations in its own words. The `basis.source` of one call of each kind, verbatim:');
w();
const CITES = [
  ['participatingInterests', runG('int-ekene').basis.source],
  ['cashCalls', runG('cc-ekene-2027').basis.source],
  ['budgetControl', runG('budget-ekene-2027').basis.source],
  ['overhead', runG('overhead-ekene-2031').basis.source],
  ['defaultCover', runG('default-ekene-march').basis.source],
  ['carryRecovery', runG('carry-ekene-compound').basis.source],
  ['backIn', runG('backin-ekene-pia').basis.source],
  ['nonConsent', runG('nc-ekene-sidetrack').basis.source],
  ['pscCostRecovery', runG('psc-ekene').basis.source],
];
table(['call', 'the engine\'s basis.source, verbatim'], CITES);
must('every engine citation names a text by its article or section', CITES.every(([, s]) => /Art\.|s\.\d|applyPSC/.test(s)), CITES.map((c) => c[1]).join(' // '));
w();
w('LICENSED TEXTS. No licensed text is quoted anywhere in this course. The AIPN model joint operating agreement and the COPAS accounting procedures are licensed; where a lesson needs their ideas (a non-consent premium recovered from production, an overhead scale, an operating committee), it teaches them as concepts, and every quoted clause comes from the public texts above.');

/* ============================================================ SECTION 3 */

section('provisions', 'The provisions this course quotes, verbatim, with their citations', ['Associate m01 l04', 'Professional m03', 'Expert m04 l01']);
w(`Each provision below is quoted exactly from the text named in ${ref('sources')}, with whitespace collapsed; a dash the text prints is shown as a colon. Each is preceded by the course's plain paraphrase. A figure or a spelling the text prints is quoted as printed.`);
const GROUPS = [['PIA', 'THE PETROLEUM INDUSTRY ACT 2021'], ['NOJOA', 'THE NORWEGIAN JOINT OPERATING AGREEMENT (ATTACHMENT A, UNOFFICIAL ENGLISH TRANSLATION)'], ['NOAA', 'THE NORWEGIAN ACCOUNTING AGREEMENT (ATTACHMENT B, UNOFFICIAL ENGLISH TRANSLATION)'], ['KENYA', 'THE KENYA MODEL PRODUCTION SHARING CONTRACT 2015, PARTICIPATION AGREEMENT'], ['WB', 'WORLD BANK PETROLEUM SECTOR BRIEFING NOTE NO. 8 (NOVEMBER 2007)'], ['FARI', 'IMF FARI TNM/16/01 (FEBRUARY 2016)'], ['IMFWP', 'IMF WP/24/89 (APRIL 2024)'], ['OPENOIL', 'OPENOIL, OIL CONTRACTS (VERSION 1, NOVEMBER 2012)']];
GROUPS.forEach(([t, title]) => {
  w();
  w(`${title}:`);
  CONCEPTS.filter((c) => c.text === t).forEach((c) => { w(); cq(c.id); });
});
must('every concept belongs to one printed group', CONCEPTS.every((c) => GROUPS.some(([t]) => t === c.text)), 'groups');
w();
w(`${CONCEPTS.length} provisions quoted: ${list(GROUPS.map(([t]) => `${t} ${CONCEPTS.filter((c) => c.text === t).length}`))}.`);
w();
w('THE ACT\'S CARRIED INTEREST PROVISION AND THE CONTRACT IT GOVERNS. Section 85(4) opens "A contract as provided for under section 85 (2) (d)", which is the concession agreement that may include a joint venture with NNPC Limited; a production sharing contract is s.85(2)(a). The engine applies the s.85(4) figures only under basis "pia-s85-4", which the caller states.');

/* ============================================================ SECTION 4 */

section('dataset', 'The Ekene joint venture and what is planted in it', ['Associate m01 l03', 'Professional m01', 'Professional m02', 'Expert m01']);
w('Every joint venture in this course\'s teaching comes from one fixture file under test-data/economics/ekene-jv, written by a stated script that reproduces it. It is labelled SYNTHETIC in the file:');
quote(FX.synthetic);
must('the fixture carries its SYNTHETIC statement and names its writer', FX.synthetic.startsWith('SYNTHETIC') && FX.generatedBy === 'tools/validation/economics/make_jv_fixtures.py', FX.generatedBy);
w();
w(`THE LICENCE (fixture): ${FX.title}. Money in ${FX.currency}, whole dollars. The Ekene shallow water licence, the terrain of the pia course's Ekene Alpha case.`);
w();
const intE = runG('int-ekene');
table(['party (fixture)', 'name (fixture)', 'participating interest', 'beneficial interest (engine)', 'paying interest (engine)', 'carried part (engine)'],
  FX.parties.map((p) => { const r = byId(intE.parties, p.id); return [p.id, p.name, f6(p.participatingPct), f6(r.beneficialPct), f6(r.payingPct), f6(r.carriedPct)]; }));
must('every fixture party name ends (synthetic)', FX.parties.every((p) => /\(synthetic\)$/.test(p.name)), 'names');
w();
w(`THE CARRY (fixture): ${FX.carries.map((c) => `${c.carried} carried ${S(c.carriedPct)} percent, carriers ${c.carriers}`).join('; ')}.`);
w();
w('THE FIXTURE\'S TERMS, each a term of the synthetic contract stated in the file:');
w(`- Cash calls ${S(FX.cashCalls.year)}: reconciliation lag ${S(FX.cashCalls.reconciliationLagMonths)} months, negative call "${FX.cashCalls.negativeCall}", no cash call below ${f6(FX.cashCalls.noCallBelow)}; twelve months of forecasts and actuals (${ref('reconciliation')}).`);
w(`- Budget ${S(FX.budget.year)}: item tolerance ${f6(FX.budget.itemTolerancePct)} percent, budget tolerance the lower of ${f6(FX.budget.budgetTolerance.pct)} percent and ${f6(FX.budget.budgetTolerance.amount)}, unbudgeted allowance ${f6(FX.budget.unbudgetedAllowance)} (${ref('budget')}).`);
w(`- Overhead ${S(FX.overhead.year)}: a marginal scale per category, ${f6(FX.overhead.excluded.operating)} of operating cost excluded, and a flat corporate charge of ${f6(FX.overhead.corporatePct)} percent (${ref('overhead')}).`);
w(`- Default: ${FX.default.defaulters[0].id} pays ${f6(FX.default.defaulters[0].paid)} of the ${f6(FX.default.callTotal)} call due ${FX.default.dueDate} and cures on ${FX.default.defaulters[0].curedOn}; interest ${f6(FX.default.interest.annualRatePct)} percent a year, ${FX.default.interest.interestMethod}, ${S(FX.default.interest.dayBasis)}-day basis, grace ${S(FX.default.interest.graceHours)} hours; suspension after ${S(FX.default.suspension.after)} ${FX.default.suspension.unit}, forfeiture after ${S(FX.default.forfeiture.after)} ${FX.default.forfeiture.unit} from ${FX.default.forfeiture.from} (${ref('default')}).`);
w(`- Carry recovery: ${FX.carry.carried}'s carried cost recovered from at most ${f6(FX.carry.recoverFromPct)} percent of its share of the entitlement with a ${FX.carry.uplift.type} uplift of ${f6(FX.carry.uplift.ratePctPerYear)} percent a year (${ref('carry')}).`);
w(`- Back-in: ${FX.backIn.backInParty} backs in to ${f6(FX.backIn.targetPct)} percent, the refund recovered from ${f6(FX.backIn.recoverFromPct)} percent of its new share (${ref('backin')}).`);
w(`- Non-consent: ${list(PIDS.filter((p) => !FX.nonConsent.consenting.includes(p)))} declines the ${FX.nonConsent.operation.name} (${f6(FX.nonConsent.operation.cost)}), premium ${f6(FX.nonConsent.premiumMultiplePct)} percent (${ref('nonconsent')}).`);
w(`- PSC variant: royalty ${f6(FX.psc.royaltyPct)} percent, cost oil limit ${f6(FX.psc.costOilLimitPct)} percent of ${FX.psc.costOilLimitBase}, contractor profit share ${f6(FX.psc.contractorProfitSharePct)} percent, tax ${f6(FX.psc.taxRatePct)} percent, opening pool ${f6(FX.psc.openingCostPool)} (${ref('psc')}).`);
w();
const ccE = runG('cc-ekene-2027');
const bE = runG('budget-ekene-2027');
const ohE = runG('overhead-ekene-2031');
const dE = runG('default-ekene-march');
const crE = runG('carry-ekene-compound');
const crP = runG('carry-ekene-pia');
const crC = runG('carry-ekene-capped');
const biE = runG('backin-ekene-pia');
const ncE = runG('nc-ekene-sidetrack');
const pscE = runG('psc-ekene');
const mRow = (r, m) => r.months.find((x) => x.month === m);
const pRow = (row, id) => row.parties.find((p) => p.id === id);
const PLANTED = [
  ['cash calls: the January over-call is credited in March, two months later', 'cashCalls adjustment', pRow(mRow(ccE, '2027-03'), 'EKO').adjustment > 0 && mRow(ccE, '2027-03').reasons.some((t) => /over-call of 400000 in 2027-01/.test(t))],
  ['cash calls: April (forecast 0) and May (below the threshold) make no call; May\'s actual is billed in June', 'cashCalls threshold and arrears', !mRow(ccE, '2027-04').called && !mRow(ccE, '2027-05').called && pRow(mRow(ccE, '2027-06'), 'EKO').arrearsBilling > 0],
  ['cash calls: the July over-call exceeds September\'s forecast shares, so September calls 0 and a credit carries to October', 'cashCalls negative call carried', mRow(ccE, '2027-09').totals.call === 0 && mRow(ccE, '2027-10').reasons.some((t) => /credit of 200000 held from 2027-09/.test(t))],
  ['budget: geology and geophysics overruns by exactly its 10 percent tolerance and is inside', 'budgetControl item boundary', bE.items.find((i) => i.item === 'geology and geophysics').withinItemTolerance === true && bE.items.find((i) => i.item === 'geology and geophysics').actual === bE.items.find((i) => i.item === 'geology and geophysics').limit],
  ['budget: exploration drilling is beyond its item tolerance, and the budget is beyond the lower of 5 percent and 3,000,000', 'budgetControl item and total', bE.itemsOutsideTolerance.join() === 'exploration drilling' && bE.total.withinBudgetTolerance === false && bE.total.heldBy === 'amount'],
  ['overhead: 2,000,000 of operating cost is excluded from its base', 'overhead exclusions', byId(ohE.categories.map((c) => ({ ...c, id: c.category })), 'operating').excluded === 2000000],
  ['default: PB cures on 2027-04-15, after the suspension trigger and before the forfeiture trigger', 'defaultCover consequences', dE.defaulters[0].suspension.applies === true && dE.defaulters[0].forfeiture.applies === false],
  ['carry: NOC\'s carry with 8 percent compound uplift is recovered in 2033', 'carryRecovery payout year', crE.recoveredInYear === 2033],
  ['carry: under PIA s.85(4), with no uplift and the whole share, it is recovered in 2031', 'carryRecovery basis pia-s85-4', crP.recoveredInYear === 2031],
  ['carry: a stated cap of 25,000,000 writes off the rest', 'carryRecovery cap', crC.totals.writtenOff > 0 && crC.totals.recovered === 25000000],
  ['back-in: exploration, the bonus, interest and the markup are excluded, and the refund is recovered in 2034', 'backIn exclusions and recovery', biE.excluded === 156000000 && biE.recovery.recoveredInYear === 2034],
  ['non-consent: PB\'s interest in the sidetrack reverts inside 2035', 'nonConsent reversion', byId(ncE.recovery, 'PB').revertsInYear === 2035],
  ['PSC: the pool is recovered in 2036', 'pscCostRecovery pool', yr(pscE.years, 2035).poolOut > 0 && yr(pscE.years, 2036).poolOut === 0],
];
table(['planted situation (fixture README)', 'found by'], PLANTED.map(([s, by]) => [s, by]));
PLANTED.forEach(([s, , ok]) => must(`planted: ${s}`, ok, s));
w();
w(`All ${PLANTED.length} planted situations are found by the engine behaviour named beside each (checked when this digest is built).`);

/* ============================================================ SECTION 5 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m03', 'Associate m04', 'Associate m05', 'Associate m06', 'Professional m01', 'Professional m02', 'Professional m03', 'Professional m04', 'Professional m05', 'Expert m01', 'Expert m02', 'Expert m06']);
w('A refusal is an object with `error` and `field`. The message starts with the name of the field it refuses and states the exact condition that failed: "<field> must <condition>; got <value>", the value as the engine prints it (a string in quotes, an absent value as nothing), or, for an unknown key, "<field> is not an accepted key; the accepted keys ... are ...". Each row below is a stated bad input from the golden file handed to the engine; the message is the engine\'s, verbatim. A result returned with a reason (a month with no cash call, a carry not recovered by the last year, a consequence not triggered) is a result. It is no refusal.');
w();
const REF = GOLD.cases.filter(isRefusalCase);
const REFUSED = REF.map((c) => {
  const r = refusal(`${c.fn} on the golden input ${c.id}`, J[c.fn](clone(c.args)), c.expected.field);
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
must('seventy-eight refusal cases in the golden file', REF.length === 78, REF.length);
w();
w('Four rules the table shows:');
w('- A contract term with no default is refused when it is missing, and the message says so: the carriers of a carry, the uplift, the reconciliation lag, the negative call rule, the budget tolerance, the overhead scale of every category, the default interest with its rate, method and grace, the premium multiple, the refundable kinds under basis "contract", the opening cost pool.');
w('- An input key a function does not read is refused at whatever level it sits (a top-level option, a party, a month, a year, a band, an uplift), with the path to the key and the full list of accepted keys.');
w(`- A term the Act fixes is refused when a call breaks it under basis "pia-s85-4": a target above ${S(PIA.maxGovernmentParticipationPct)} percent, an uplift, stated refundable kinds, an upfront refund.`);
w('- Every figure inside a message is the shortest round-trip decimal of the value it was given.');

/* ============================================================ SECTION 6 */

section('graded', 'What is graded, where the practicals run, and what is never graded', ['Associate m01 l05', 'Expert m06']);
w('EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED INPUTS. A capstone field, a question key and a panel figure are each computed by a function in the table of ' + ref('computes') + ' on agreement terms written down in advance. Nothing in the engine samples or searches, so the same terms give the same number on any machine, and there is exactly one right answer.');
w();
w('THE PRACTICALS RUN IN THE COURSE\'S OWN CALCULATOR PANELS. This is an engine course with no Suite app. Each tier has a calculator panel that calls this same vendored engine: the account calculator (Associate), the recovery calculator (Professional) and the agreement calculator (Expert). A learner types or pastes their own agreement terms; the panel prints what the engine returns, every refusal in the engine\'s own words, and the reasons beside each figure.');
w();
w('WHAT A CAPSTONE STATES. Each capstone runs its own synthetic joint venture, which this digest does not print, and states every term a figure depends on: the parties and their participating interests, each carry and its carriers, the months and the reconciliation terms, the budget and its tolerances, the overhead scale and exclusions, the default dates, interest terms and consequences, the carry\'s uplift, recovery share and basis, the back-in target and costs, the premium multiple and mode, the PSC terms, the discount rate and base year. Each graded figure is quoted to six decimals as the panel prints it.');
w();
w(`WHAT IS NEVER GRADED. No graded figure depends on a reading the engine states (${ref('readings')}): every capstone field is the same number under each reading the engine takes and under the alternative it names.`);
w();
w('WHAT A COMPUTED FIGURE DOES NOT SAY. A cash call is what the stated forecast and the stated clauses produce; a carry recovery is what the stated entitlement pays; a premium is a stated multiple of a stated cost. None is a forecast of what a partner will pay. An NPV depends on the discount rate and base year stated. Each figure is quoted with its terms for that reason.');

/* ============================================================ SECTION 7 */

section('interests', 'Participating, paying and beneficial interests, carries and the partner split', ['Associate m02', 'Associate m03']);
w('THE RULE, in the engine\'s basis, verbatim:');
quote(intE.basis.rule);
w();
w('THE CARRIERS, in the engine\'s basis, verbatim:');
quote(intE.basis.carriers);
w();
const INT = ['int-ekene', 'int-ekene-no-carry', 'int-half-carry-stated', 'int-two-carries'];
const intRows = [];
INT.forEach((id) => {
  const r = runG(id);
  r.parties.forEach((p) => intRows.push([id, p.id, f6(p.beneficialPct), f6(p.payingPct), f6(p.carriedPct), p.carryShares.length ? p.carryShares.map((c) => `${c.carried} ${f6(c.pct)}`).join('; ') : 'none']));
  must(`${id}: beneficial and paying interests each total 100 (engine totals)`, Math.abs(r.totals.beneficialPct - 100) < 1e-9 && Math.abs(r.totals.payingPct - 100) < 1e-9, JSON.stringify(r.totals));
});
table(['golden case', 'party', 'beneficial interest', 'paying interest', 'carried percent', 'carry points it pays'], intRows);
w();
INT.forEach((id) => { const r = runG(id); w(`${id}, the engine's reasons, verbatim:`); reasons(r.reasons); });
w();
const noc = byId(intE.parties, 'NOC');
w(`BENEFICIAL AND PAYING. On int-ekene, NOC's beneficial interest is ${f6(noc.beneficialPct)} (its share of production) and its paying interest ${f6(noc.payingPct)} (its share of cost while it is carried); EKO pays ${f6(byId(intE.parties, 'EKO').payingPct)} on a beneficial ${f6(byId(intE.parties, 'EKO').beneficialPct)}. A carry moves cost and never moves production.`);
must('a carry leaves every beneficial interest at the participating interest', intE.parties.every((p) => p.beneficialPct === FX.parties.find((x) => x.id === p.id).participatingPct), 'beneficial');
w();
const half = runG('int-half-carry-stated');
w(`STATED SHARES. On int-half-carry-stated NOC is carried for ${f6(argsOf('int-half-carry-stated').carries[0].carriedPct)} percent of its cost share by EKO and PA in stated shares of ${f6(argsOf('int-half-carry-stated').carries[0].carriers.EKO)} and ${f6(argsOf('int-half-carry-stated').carries[0].carriers.PA)}; PB pays none of it and its paying interest stays ${f6(byId(half.parties, 'PB').payingPct)}.`);
must('a party outside the stated carriers pays none of the carry', byId(half.parties, 'PB').payingPct === 15, byId(half.parties, 'PB').payingPct);
w();
const afeSplit = runG('cc-ekene-2027').months[0].parties;
w('THE PARTNER SPLIT. Every joint account amount the engine splits between parties goes through the canonical calculatePartnerCosts of engines/economics/afe.js, on the paying interests for cost and the beneficial interests for production. In the engine\'s basis (cc-ekene-2027), verbatim:');
quote(ccE.basis.split);
w(`January 2027's forecast of ${f6(ccE.months[0].forecast)} splits as ${afeSplit.map((p) => `${p.id} ${f6(p.forecastShare)}`).join(', ')} (engine).`);

/* ============================================================ SECTION 8 */

section('cashcalls', 'Cash calls: the forecast share, actuals, the difference, the threshold and a month with a zero forecast', ['Associate m04']);
w('THE RULE, in the engine\'s basis (cc-ekene-2027), verbatim:');
quote(ccE.basis.rule);
w();
w('THE THRESHOLD, verbatim:');
quote(ccE.basis.threshold);
w();
const jan = ccE.months[0];
w(`ONE MONTH (cc-ekene-2027, January 2027): forecast ${f6(jan.forecast)}, actual ${f6(jan.actual)}. Per party (engine):`);
w();
table(['party', 'paying interest', 'forecast share', 'adjustment', 'call', 'actual share', 'difference'], jan.parties.map((p) => [p.id, f6(p.payingPct), f6(p.forecastShare), f6(p.adjustment), f6(p.call), f6(p.actualShare), f6(p.difference)]));
w();
w(`The difference of a called month is the forecast share less the actual share: above zero an over-call, below zero an under-call. January's differences total ${f6(jan.totals.difference)} (engine), and the reconciliation lag decides which later call they adjust (${ref('reconciliation')}).`);
must('January 2027 is an over-call of 400000 in total', jan.totals.difference === 400000, jan.totals.difference);
w();
const SMALL = ['cc-zero-call-month', 'cc-zero-call-month-refund', 'cc-threshold-exactly', 'cc-last-month-uncalled', 'cc-year-boundary'];
w(`SMALL LEDGERS (golden inputs), each stated to show one rule. Parties ${argsOf('cc-zero-call-month').parties.map((p) => `${p.id} ${S(p.participatingPct)}`).join(', ')} percent, no carry:`);
w();
const smallRows = [];
SMALL.forEach((id) => {
  const a = argsOf(id); const r = runG(id);
  r.months.forEach((m) => smallRows.push([id, m.month, f6(m.forecast), f6(m.actual), S(m.called), f6(m.totals.call), f6(m.totals.arrearsBilling), f6(m.totals.difference), f6(sum(m.parties.map((p) => p.carried))), `lag ${S(a.reconciliationLagMonths)}, ${a.negativeCall}${a.noCallBelow === undefined ? '' : `, threshold ${S(a.noCallBelow)}`}`]));
});
table(['golden case', 'month', 'forecast', 'actual', 'called', 'calls', 'arrears billed', 'difference', 'carried', 'terms (golden input)'], smallRows);
w();
SMALL.forEach((id) => { const r = runG(id); w(`${id}, the engine's reasons, verbatim:`); reasons(r.months.flatMap((m) => m.reasons)); });
const zc = runG('cc-zero-call-month');
must('a zero-forecast month with no threshold is called, and its call is the adjustment alone', zc.months[1].called === true && zc.months[1].forecast === 0 && zc.months[1].reasons.some((t) => /cash call is the adjustment alone/.test(t)), JSON.stringify(zc.months[1].reasons));
const te = runG('cc-threshold-exactly');
must('a forecast equal to the threshold is called; one below is not', te.months[0].called === true && te.months[1].called === false, 'threshold');
w();
w(`A MONTH WITH A ZERO FORECAST. With no threshold stated, February on cc-zero-call-month is called with a forecast of ${f6(zc.months[1].forecast)}, and the call is the adjustment alone; under "carry" the credit waits, under "refund" it is paid back as a negative call (cc-zero-call-month-refund). A forecast equal to the threshold is called; one below it is not (cc-threshold-exactly).`);

/* ============================================================ SECTION 9 */

section('budget', 'Budget control: the item tolerance, the budget tolerance and the unbudgeted allowance', ['Associate m05']);
w('THE RULE, in the engine\'s basis (budget-ekene-2027), verbatim:');
quote(bE.basis.rule);
w();
w('THE BOUNDARY, verbatim:');
quote(bE.basis.boundary);
w();
w(`THE EKENE 2027 BUDGET (golden input budget-ekene-2027, the fixture's items): item tolerance ${f6(argsOf('budget-ekene-2027').itemTolerancePct)} percent, budget tolerance the lower of ${f6(argsOf('budget-ekene-2027').budgetTolerance.pct)} percent and ${f6(argsOf('budget-ekene-2027').budgetTolerance.amount)}, unbudgeted allowance ${f6(argsOf('budget-ekene-2027').unbudgetedAllowance)}.`);
w();
table(['item', 'approved', 'actual', 'overrun', 'overrun percent', 'limit', 'inside its tolerance'], bE.items.map((i) => [i.item, f6(i.approved), f6(i.actual), f6(i.overrun), f6(i.overrunPct), f6(i.limit), S(i.withinItemTolerance)]));
w();
table(['the budget (engine)', 'value'], [['approved', f6(bE.total.approved)], ['actual', f6(bE.total.actual)], ['overrun', f6(bE.total.overrun)], ['allowed overrun', f6(bE.total.allowedOverrun)], ['held by', bE.total.heldBy], ['inside the budget tolerance', S(bE.total.withinBudgetTolerance)], ['unbudgeted total', f6(bE.unbudgeted.total)], ['unbudgeted allowance', f6(bE.unbudgeted.allowance)], ['inside the allowance', S(bE.unbudgeted.withinAllowance)]]);
w();
w('The engine\'s reasons, verbatim:');
reasons(bE.reasons);
w();
const BUD = ['budget-ekene-no-allowance', 'budget-ekene-allowance-short', 'budget-item-at-tolerance', 'budget-item-one-over', 'budget-norway-lower-of', 'budget-norway-pct-holds', 'budget-underrun'];
table(['golden case', 'approved', 'actual', 'overrun', 'allowed overrun', 'held by', 'inside the budget tolerance', 'items outside their tolerance'], BUD.map((id) => { const r = runG(id); return [id, f6(r.total.approved), f6(r.total.actual), f6(r.total.overrun), f6(r.total.allowedOverrun), r.total.heldBy, S(r.total.withinBudgetTolerance), list(r.itemsOutsideTolerance)]; }));
w();
BUD.forEach((id) => { const r = runG(id); w(`${id}${GC[id].note ? ` (${GC[id].note})` : ''}, the engine's reasons, verbatim:`); reasons(r.reasons); });
must('an item overrun of exactly the tolerance is inside; 0.5 more is beyond', runG('budget-item-at-tolerance').items[0].withinItemTolerance === true && runG('budget-item-one-over').items[0].withinItemTolerance === false, 'item boundary');
must('the Norwegian figures: 75 held by the amount and beyond; 50 held by the percentage and inside', runG('budget-norway-lower-of').total.allowedOverrun === 75 && runG('budget-norway-lower-of').total.withinBudgetTolerance === false && runG('budget-norway-pct-holds').total.allowedOverrun === 50 && runG('budget-norway-pct-holds').total.withinBudgetTolerance === true, 'norway');
w();
w(`THE NORWEGIAN FIGURES AS STATED INPUTS. The Norwegian agreement prints ${S(argsOf('budget-norway-lower-of').itemTolerancePct)} percent for an item and the lower of ${S(argsOf('budget-norway-lower-of').budgetTolerance.pct)} percent and NOK ${S(argsOf('budget-norway-lower-of').budgetTolerance.amount)} million for a budget (text, ${ref('provisions')}, stated on the golden input); the two golden cases state them in NOK million and return an allowed overrun of ${f6(runG('budget-norway-lower-of').total.allowedOverrun)} on an approved ${f6(runG('budget-norway-lower-of').total.approved)} and ${f6(runG('budget-norway-pct-holds').total.allowedOverrun)} on an approved ${f6(runG('budget-norway-pct-holds').total.approved)}. The engine holds none of these figures: each call states its own.`);

/* ============================================================ SECTION 10 */

section('overhead', 'Operator overhead: the base, a marginal sliding scale, exclusions and the band edge', ['Associate m06']);
w('THE RULE, in the engine\'s basis (overhead-ekene-2031), verbatim:');
quote(ohE.basis.rule);
w();
w('THE BASE, verbatim:');
quote(ohE.basis.base);
w();
w(`THE EKENE 2031 OVERHEAD (golden input overhead-ekene-2031, the fixture's scale):`);
w();
const ohRows = [];
ohE.categories.forEach((c) => {
  c.bands.forEach((b, i) => ohRows.push([c.category, `band ${i + 1}`, f6(b.from), f6(b.upTo), f6(b.pct), f6(b.amount), f6(b.charge)]));
  ohRows.push([c.category, 'above the last band', f6(c.above.from), 'none', f6(c.above.pct), f6(c.above.amount), f6(c.above.charge)]);
});
table(['category', 'band', 'from', 'up to', 'per cent', 'part of the base in it', 'charge'], ohRows);
w();
table(['category (engine)', 'cost', 'excluded', 'base', 'charge'], ohE.categories.map((c) => [c.category, f6(c.cost), f6(c.excluded), f6(c.base), f6(c.charge)]));
w(`Total overhead ${f6(ohE.total)} (engine).`);
w();
w('The engine\'s reasons, verbatim:');
reasons(ohE.reasons);
w();
const OH = ['overhead-ekene-2031-corporate', 'overhead-norway-operating-1800', 'overhead-norway-development-3000', 'overhead-norway-development-4000', 'overhead-norway-exploration-250', 'overhead-norway-all-with-exclusion', 'overhead-norway-corporate-065', 'overhead-band-edge-exact', 'overhead-zero-cost'];
table(['golden case', 'categories and bases (engine)', 'total (engine)'], OH.map((id) => { const r = runG(id); return [id, r.categories.map((c) => `${c.category} ${f6(c.base)}`).join('; '), f6(r.total)]; }));
w();
OH.forEach((id) => { const r = runG(id); w(`${id}${GC[id].note ? ` (${GC[id].note})` : ''}, the engine's reasons, verbatim:`); reasons(r.reasons); });
must('the Norwegian printed scale gives 35, 40, 42.5 and 6.25', runG('overhead-norway-operating-1800').total === 35 && runG('overhead-norway-development-3000').total === 40 && runG('overhead-norway-development-4000').total === 42.5 && runG('overhead-norway-exploration-250').total === 6.25, 'norway scale');
const edge = runG('overhead-band-edge-exact').categories[0];
must('a base exactly at a band edge charges that band only', edge.bands[0].amount === 1000 && edge.bands[1].amount === 0 && edge.above.amount === 0, JSON.stringify(edge.bands));
w();
w(`THE BAND EDGE. A base exactly at a band's upper limit is charged in that band only (overhead-band-edge-exact: ${f6(edge.bands[0].amount)} in the first band, ${f6(edge.bands[1].amount)} in the second). A FLAT PERCENTAGE is a scale with no bands: the whole base is charged at abovePct (overhead-ekene-2031-corporate and overhead-norway-corporate-065).`);

/* ============================================================ SECTION 11 */

section('reconciliation', 'The cash call ledger: the reconciliation lag, a negative call refunded or carried, arrears and the balance with the operator', ['Professional m01']);
w('THE LAG, in the engine\'s basis (cc-ekene-2027), verbatim:');
quote(ccE.basis.lag);
w();
w('THE NEGATIVE CALL, verbatim:');
quote(ccE.basis.negativeCall);
w();
w('THE IDENTITY, verbatim:');
quote(ccE.basis.identity);
w();
w(`THE EKENE 2027 LEDGER (golden input cc-ekene-2027, the fixture's months): lag ${S(argsOf('cc-ekene-2027').reconciliationLagMonths)}, negative call "${argsOf('cc-ekene-2027').negativeCall}", threshold ${f6(argsOf('cc-ekene-2027').noCallBelow)}. Month totals (engine):`);
w();
table(['month', 'forecast', 'actual', 'called', 'calls', 'arrears billed', 'paid', 'difference'], ccE.months.map((m) => [m.month, f6(m.forecast), f6(m.actual), S(m.called), f6(m.totals.call), f6(m.totals.arrearsBilling), f6(m.totals.paid), f6(m.totals.difference)]));
w();
w('Per party, month by month (engine):');
w();
const ccRows = [];
ccE.months.forEach((m) => m.parties.forEach((p) => ccRows.push([m.month, p.id, f6(p.forecastShare), f6(p.adjustment), f6(p.call), f6(p.arrearsBilling), f6(p.actualShare), f6(p.difference), f6(p.carried), f6(p.balance)])));
table(['month', 'party', 'forecast share', 'adjustment', 'call', 'arrears billing', 'actual share', 'difference', 'carried', 'balance'], ccRows);
w();
w('The engine\'s reasons, verbatim:');
reasons(ccE.months.flatMap((m) => m.reasons));
w();
table(['closing (engine)', 'balance', 'differences not yet adjusted', 'carried', 'arrears due'], ccE.closing.map((c) => [c.id, f6(c.balance), f6(c.unadjustedDifferences), f6(c.carried), f6(c.arrearsDue)]));
const IDENTITY_TOL = 1e-6;
ccE.closing.forEach((c) => must(`the identity closes for ${c.id} (within 1e-6)`, Math.abs(c.balance - (c.unadjustedDifferences + c.carried - c.arrearsDue)) < IDENTITY_TOL, `${c.balance} ${c.unadjustedDifferences} ${c.carried} ${c.arrearsDue}`));
w();
w(`THE IDENTITY ON THE CLOSING ROWS (derived): for each party the balance less (the differences not yet adjusted + carried - arrears due) is within ${f6(IDENTITY_TOL)} of zero (checked for ${list(ccE.closing.map((c) => c.id))}).`);
w();
const LEDG = ['cc-ekene-2027-lag1', 'cc-ekene-2027-refund', 'cc-ekene-2027-every-month'];
table(['golden case', 'terms (golden input)', 'calls over the year (engine)', 'arrears billed (engine)', 'actual (engine)', 'EKO closing balance (engine)'], [['cc-ekene-2027', `lag ${S(argsOf('cc-ekene-2027').reconciliationLagMonths)}, ${argsOf('cc-ekene-2027').negativeCall}, threshold ${S(argsOf('cc-ekene-2027').noCallBelow)}`, f6(ccE.totals.called), f6(ccE.totals.arrearsBilled), f6(ccE.totals.actual), f6(byId(ccE.closing, 'EKO').balance)],
  ...LEDG.map((id) => { const a = argsOf(id); const r = runG(id); return [id, `lag ${S(a.reconciliationLagMonths)}, ${a.negativeCall}${a.noCallBelow === undefined ? ', no threshold' : `, threshold ${S(a.noCallBelow)}`}`, f6(r.totals.called), f6(r.totals.arrearsBilled), f6(r.totals.actual), f6(byId(r.closing, 'EKO').balance)]; })]);
w();
LEDG.forEach((id) => { const r = runG(id); w(`${id}, the engine's reasons, verbatim:`); reasons(r.months.flatMap((m) => m.reasons)); });
const sep = mRow(ccE, '2027-09');
w();
w(`A CREDIT LARGER THAN THE CALL. In September 2027 the July over-call reaches the call two months later and exceeds every paying party's forecast share: under "carry" each call is ${f6(sep.totals.call)} and ${f6(sum(sep.parties.map((p) => p.carried)))} is carried to October (engine); under "refund" (cc-ekene-2027-refund) the excess is paid back as a negative call of ${f6(mRow(runG('cc-ekene-2027-refund'), '2027-09').totals.call)} in total.`);
must('the refund ledger returns a negative September call', mRow(runG('cc-ekene-2027-refund'), '2027-09').totals.call < 0, 'refund');

/* ============================================================ SECTION 12 */

section('carry', 'Carries with uplift and caps: the recovery ledger', ['Professional m02']);
w('THE RULE, in the engine\'s basis (carry-ekene-compound), verbatim:');
quote(crE.basis.rule);
w();
w('THE UPLIFT and THE TIMING, verbatim:');
quote(crE.basis.uplift);
quote(crE.basis.timing);
w();
const CR = ['carry-ekene-compound', 'carry-ekene-pia', 'carry-ekene-multiple', 'carry-ekene-capped', 'carry-ekene-short-horizon'];
CR.forEach((id) => {
  const a = argsOf(id); const r = runG(id);
  w(`${id} (golden input: uplift ${a.uplift.type}${a.uplift.ratePctPerYear !== undefined ? ` ${S(a.uplift.ratePctPerYear)} percent a year` : ''}${a.uplift.multiplePct !== undefined ? ` ${S(a.uplift.multiplePct)} percent` : ''}, recover from ${S(a.recoverFromPct)} percent of the share, basis ${a.basis}${a.cap !== undefined ? `, cap ${S(a.cap)}` : ''}${a.discountRate !== undefined ? `, discount rate ${f6(a.discountRate)} to ${S(a.baseYear)}` : ''}):`);
  w();
  table(['year', 'opening', 'uplift', 'carried cost', 'due', 'share', 'available', 'recovered', 'closing', 'written off', 'carried party receives'], r.ledger.map((l) => [S(l.year), f6(l.opening), f6(l.uplift), f6(l.added), f6(l.due), f6(l.share), f6(l.available), f6(l.recovered), f6(l.closing), f6(l.writtenOff), f6(l.debtorReceives)]));
  w();
  w(`Totals (engine): carried cost ${f6(r.totals.carriedCost)}, uplift ${f6(r.totals.uplift)}, recovered ${f6(r.totals.recovered)}, written off ${f6(r.totals.writtenOff)}, outstanding ${f6(r.totals.outstanding)}; recovered in year ${r.recoveredInYear === null ? 'none' : S(r.recoveredInYear)}.`);
  if (r.npv) w(`NPV by party (engine, the canonical npv): ${r.npv.map((p) => `${p.id} ${f6(p.npv)}`).join(', ')}.`);
  w('The engine\'s reasons, verbatim:');
  reasons(r.reasons);
  w();
});
must('the compound ledger recovers in 2033 and the PIA ledger in 2031', crE.recoveredInYear === 2033 && crP.recoveredInYear === 2031, `${crE.recoveredInYear} ${crP.recoveredInYear}`);
must('the short horizon leaves a balance outstanding', runG('carry-ekene-short-horizon').totals.outstanding > 0, 'short');
w(`THE PARTY FLOWS (carry-ekene-compound, 2033, engine): ${yr(crE.parties, 2033).parties.map((p) => `${p.id} cost ${f6(p.costPaid)}, entitlement share ${f6(p.entitlementShare)}, recovery ${f6(p.recovery)}, net ${f6(p.net)}`).join('; ')}. The recovered amount goes to the carriers in their carry shares.`);
w();
w('THE PIA BASIS. Under basis "pia-s85-4" the uplift must be none, verbatim from the engine\'s basis (carry-ekene-pia):');
quote(crP.basis.basis);
w();
const SMALLC = ['carry-recovered-exactly', 'carry-one-short', 'carry-cap-exactly-cost', 'carry-partial-stated', 'carry-cost-while-recovering'];
w(`SMALL LEDGERS (golden inputs), parties ${argsOf('carry-recovered-exactly').parties.map((p) => `${p.id} ${S(p.participatingPct)}`).join(', ')} percent:`);
w();
const scRows = [];
SMALLC.forEach((id) => { const a = argsOf(id); const r = runG(id); r.ledger.forEach((l) => scRows.push([id, `${a.uplift.type}${a.uplift.ratePctPerYear !== undefined ? ` ${S(a.uplift.ratePctPerYear)}` : ''}, from ${S(a.recoverFromPct)}${a.cap !== undefined ? `, cap ${S(a.cap)}` : ''}`, S(l.year), f6(l.opening), f6(l.uplift), f6(l.added), f6(l.available), f6(l.recovered), f6(l.closing), f6(l.writtenOff)])); });
table(['golden case', 'terms (golden input)', 'year', 'opening', 'uplift', 'carried cost', 'available', 'recovered', 'closing', 'written off'], scRows);
w();
SMALLC.forEach((id) => { const r = runG(id); w(`${id}, the engine's reasons, verbatim:`); reasons(r.reasons); });
const cre = runG('carry-recovered-exactly');
must('a carry recovered exactly: the payout year is that year and the carried party receives 0 of its share', cre.recoveredInYear === 2028 && yr(cre.ledger, 2028).debtorReceives === 0, JSON.stringify(yr(cre.ledger, 2028)));
must('the cost-while-recovering ledger adds cost in a year that also recovers', yr(runG('carry-cost-while-recovering').ledger, 2028).added > 0 && yr(runG('carry-cost-while-recovering').ledger, 2028).recovered > 0, 'cwr');

/* ============================================================ SECTION 13 */

section('backin', 'Back-in under PIA 2021 s.85(4): the interests after, refundable costs and the refund from future entitlement', ['Professional m03']);
w('THE RULE, in the engine\'s basis (backin-ekene-pia), verbatim:');
quote(biE.basis.rule);
w();
w('WHAT IS REFUNDABLE, and IN WHAT FORM, verbatim:');
quote(biE.basis.refundable);
quote(biE.basis.form);
w();
w('WHAT IT DOES NOT COMPUTE, verbatim:');
quote(biE.basis.notComputed);
w();
const BI = ['backin-ekene-pia', 'backin-ekene-contract-upfront', 'backin-pia-at-60', 'backin-recovered-on-last-year'];
BI.forEach((id) => {
  const a = argsOf(id); const r = runG(id);
  w(`${id} (golden input: ${a.backInParty} to ${S(a.targetPct)} percent, basis ${a.basis}, refund ${a.refundForm}${a.recoverFromPct !== undefined ? ` from ${S(a.recoverFromPct)} percent of the new share` : ''}):`);
  w();
  table(['party', 'before', 'after', 'interest given up', 'refund received', 'refund paid'], r.parties.map((p) => [p.id, f6(p.before), f6(p.after), f6(p.ceded), f6(p.refundReceived), f6(p.refundPaid)]));
  w(`Refundable ${f6(r.refundable)}, excluded ${f6(r.excluded)}, refund ${f6(r.refund)} (engine).`);
  if (r.recovery) {
    w();
  table(['year', 'due', 'share', 'available', 'recovered', 'closing', 'back-in party receives'], r.recovery.ledger.map((l) => [S(l.year), f6(l.due), f6(l.share), f6(l.available), f6(l.recovered), f6(l.closing), f6(l.debtorReceives)]));
    w(`Recovered ${f6(r.recovery.recovered)}, outstanding ${f6(r.recovery.outstanding)}, recovered in year ${r.recovery.recoveredInYear === null ? 'none' : S(r.recovery.recoveredInYear)} (engine).`);
  }
  w('The engine\'s reasons, verbatim:');
  reasons(r.reasons);
  w();
});
table(['cost line (golden input backin-ekene-pia)', 'kind', 'amount', 'refundable under s.85(4) (engine)'], biE.costs.map((c) => [c.item, c.kind, f6(c.amount), S(c.refundable)]));
must('under s.85(4) only development and production lines are refundable', biE.costs.every((c) => c.refundable === ['development', 'production'].includes(c.kind)), 'kinds');
must('the Ekene PIA refund is 98000000', biE.refund === 98000000, biE.refund);
w();
w(`THE OTHERS KEEP THEIR SHARE IN PROPORTION. After NOC backs in from ${f6(biE.currentPct)} to ${f6(biE.targetPct)} percent, each other party keeps (100 - target) / (100 - current) of its interest: EKO ${f6(byId(biE.parties, 'EKO').after)}, PA ${f6(byId(biE.parties, 'PA').after)}, PB ${f6(byId(biE.parties, 'PB').after)} (engine), and each receives the refund in proportion to the interest it gives up.`);

/* ============================================================ SECTION 14 */

section('default', 'Default: pro rata cover, default interest simple or compounded monthly, the grace, suspension and forfeiture', ['Professional m04']);
w('THE COVER, in the engine\'s basis (default-ekene-march), verbatim:');
quote(dE.basis.cover);
w();
w('THE INTEREST and THE GRACE, verbatim:');
quote(dE.basis.interest);
quote(dE.basis.grace);
w();
w('THE CONSEQUENCES, verbatim:');
quote(dE.basis.consequences);
quote(dE.basis.notComputed);
w();
const DEF = ['default-ekene-march', 'default-ekene-uncured', 'default-ekene-monthly-compound-kenya', 'default-monthly-compound-uncured', 'default-monthly-compound-whole-months', 'default-monthly-compound-month-end', 'default-grace-last-hour', 'default-grace-exceeded', 'default-grace-compound-exceeded', 'default-grace-fractional-hours', 'default-cured-on-due-date', 'default-two-defaulters', 'default-no-carry-365'];
const defRows = [];
DEF.forEach((id) => {
  const a = argsOf(id); const r = runG(id);
  r.defaulters.forEach((d) => defRows.push([id, d.id, `${S(a.interest.annualRatePct)} percent, ${a.interest.interestMethod}, ${S(a.interest.dayBasis)} days, grace ${S(a.interest.graceHours)} hours`, a.dueDate, d.curedOn === null ? `open at ${a.asOf}` : d.curedOn, f6(d.share), f6(d.paid), f6(d.unpaid), S(d.days), d.wholeMonths === null ? 'none' : S(d.wholeMonths), d.remainingDays === null ? 'none' : S(d.remainingDays), S(d.withinGrace), f6(d.interest)]));
});
table(['golden case', 'defaulter', 'interest terms (golden input)', 'due', 'cured', 'share of the call', 'paid', 'unpaid', 'days', 'whole months', 'remaining days', 'within the grace', 'default interest'], defRows);
w();
table(['golden case', 'cover by the non-defaulting parties (engine)', 'interest received (engine)'], DEF.map((id) => { const r = runG(id); return [id, r.cover.map((c) => `${c.id} ${f6(c.cover)} (${f6(c.coverPct)} percent)`).join('; '), r.cover.map((c) => `${c.id} ${f6(c.interestReceived)}`).join('; ')]; }));
w();
DEF.forEach((id) => { const r = runG(id); w(`${id}${GC[id].note ? ` (${GC[id].note})` : ''}, the engine's reasons, verbatim:`); reasons(r.reasons); });
const TRIG = ['default-cured-on-trigger-day', 'default-cured-day-after-trigger', 'default-forfeiture-last-day', 'default-forfeiture-day-after', 'default-working-days-holiday', 'default-months-end-of-month', 'default-calendar-days'];
w();
w('THE TRIGGERS (golden inputs):');
w();
table(['golden case', 'consequence', 'stated (golden input)', 'trigger date (engine)', 'applies (engine)'], TRIG.flatMap((id) => { const a = argsOf(id); const r = runG(id); return r.defaulters.flatMap((d) => ['suspension', 'forfeiture'].filter((k) => d[k]).map((k) => [id, k, `${S(a[k].after)} ${a[k].unit} from ${a[k].from}`, d[k].triggerDate, S(d[k].applies)])); }));
w();
TRIG.forEach((id) => { const r = runG(id); w(`${id}, the engine's reasons, verbatim:`); reasons(r.reasons); });
must('the Ekene March default carries 20625 of simple interest', dE.interestTotal === 20625, dE.interestTotal);
must('a default cured on the due date carries 0 days and 0 interest', runG('default-cured-on-due-date').defaulters[0].days === 0 && runG('default-cured-on-due-date').interestTotal === 0, 'due date');
must('72 hours inside a 72-hour grace, 96 hours beyond', runG('default-grace-last-hour').defaulters[0].withinGrace === true && runG('default-grace-exceeded').defaulters[0].withinGrace === false && runG('default-grace-exceeded').defaulters[0].days === 4, 'grace');
must('five working days from 2027-12-22 with the stated holidays end 2028-01-03', runG('default-working-days-holiday').defaulters[0].suspension.triggerDate === '2028-01-03', 'wd');
must('three months from 31 January end 30 April', runG('default-months-end-of-month').defaulters[0].forfeiture.triggerDate === '2027-04-30', 'months');
w();
const kenya = runG('default-ekene-monthly-compound-kenya');
w(`SIMPLE AND COMPOUNDED MONTHLY ON THE SAME DEFAULT. PB's unpaid ${f6(dE.defaulters[0].unpaid)} from ${argsOf('default-ekene-march').dueDate} to ${dE.defaulters[0].curedOn}: simple at ${S(argsOf('default-ekene-march').interest.annualRatePct)} percent on a ${S(argsOf('default-ekene-march').interest.dayBasis)}-day basis, ${S(dE.defaulters[0].days)} days, gives ${f6(dE.interestTotal)}; compounded monthly with a ${S(argsOf('default-ekene-monthly-compound-kenya').interest.graceHours)}-hour grace (default-ekene-monthly-compound-kenya), ${S(kenya.defaulters[0].wholeMonths)} whole month and ${S(kenya.defaulters[0].remainingDays)} days, gives ${f6(kenya.interestTotal)} (engine).`);
w();
w(`THE COVER. The unpaid ${f6(dE.unpaidTotal)} is advanced by EKO ${f6(byId(dE.cover, 'EKO').cover)} and PA ${f6(byId(dE.cover, 'PA').cover)}, in proportion to their paying interests of ${f6(byId(dE.cover, 'EKO').payingPct)} and ${f6(byId(dE.cover, 'PA').payingPct)}; NOC, carried, pays no cost and covers none (engine).`);
must('NOC covers none of the Ekene default', !dE.cover.some((c) => c.id === 'NOC'), 'noc');
const unc = runG('default-ekene-uncured');
w(`FORFEITURE AVAILABLE. On default-ekene-uncured the default is still open after the forfeiture trigger, and the interests if PB's assignment is demanded are ${unc.interestsAfterForfeiture.map((p) => `${p.id} ${f6(p.participatingPct)}`).join(', ')} (engine), pro rata to the participating interests of the others.`);

/* ============================================================ SECTION 15 */

section('psc', 'PSC cost recovery through the canonical applyPSC: the order, the limit and its base, the pool, the partner split', ['Professional m05']);
w('THE ENGINE, THE ORDER and THE LIMIT BASE, in the engine\'s basis (psc-ekene), verbatim:');
quote(pscE.basis.engine);
quote(pscE.basis.order);
quote(pscE.basis.limitBase);
w();
w('THE SHARE, THE TAX and THE SPLIT, verbatim:');
quote(pscE.basis.share);
quote(pscE.basis.tax);
quote(pscE.basis.split);
w();
w('THE ACT, verbatim:');
quote(pscE.basis.pia);
w();
const pscTable = (r) => table(['year', 'gross revenue', 'royalty', 'revenue after royalty', 'pool in', 'capex', 'opex', 'cost oil limit', 'cost recovered', 'pool out', 'profit oil', 'contractor share', 'contractor profit oil', 'government profit oil', 'tax', 'contractor entitlement', 'government take'],
  r.years.map((y) => [S(y.year), f6(y.grossRevenue), f6(y.royalty), f6(y.revenueAfterRoyalty), f6(y.poolIn), f6(y.capex), f6(y.opex), f6(y.costOilLimit), f6(y.costRecovered), f6(y.poolOut), f6(y.profitOil), f6(y.contractorProfitSharePct), f6(y.contractorProfitOil), f6(y.governmentProfitOil), f6(y.tax), f6(y.contractorEntitlement), f6(y.governmentTake)]));
const pa = argsOf('psc-ekene');
w(`THE EKENE PSC VARIANT (golden input psc-ekene, the fixture's terms): royalty ${f6(pa.royaltyPct)} percent, limit ${f6(pa.costOilLimitPct)} percent of ${pa.costOilLimitBase}, contractor share ${f6(pa.contractorProfitSharePct)} percent, tax ${f6(pa.taxRatePct)} percent, opening pool ${f6(pa.openingCostPool)}${pa.discountRate !== undefined ? `, discount rate ${f6(pa.discountRate)} to ${S(pa.baseYear)}` : ''}:`);
w();
pscTable(pscE);
w();
w(`Totals (engine): cost recovered ${f6(pscE.totals.costRecovered)}, profit oil ${f6(pscE.totals.profitOil)}, government profit oil ${f6(pscE.totals.governmentProfitOil)}, tax ${f6(pscE.totals.tax)}, contractor entitlement ${f6(pscE.totals.contractorEntitlement)}, government take ${f6(pscE.totals.governmentTake)}; unrecovered at the end ${f6(pscE.unrecoveredAtEnd)}.`);
w('The engine\'s reasons, verbatim:');
reasons(pscE.reasons);
w();
if (pscE.parties) {
  w('THE PARTNER SPLIT (engine), by participating interest:');
  w();
  table(['year', ...PIDS.map((p) => `${p} net`)], pscE.parties.map((row) => [S(row.year), ...PIDS.map((p) => f6(byId(row.parties, p).net))]));
  if (pscE.npv) w(`NPV by party (engine, the canonical npv): ${pscE.npv.map((p) => `${p.id} ${f6(p.npv)}`).join(', ')}.`);
  w();
}
const pscAR = runG('psc-ekene-after-royalty');
w(`THE SAME FIELD WITH THE LIMIT STATED ON REVENUE AFTER ROYALTY (golden input psc-ekene-after-royalty, limit ${f6(argsOf('psc-ekene-after-royalty').costOilLimitPct)} percent of ${argsOf('psc-ekene-after-royalty').costOilLimitBase}):`);
w();
pscTable(pscAR);
w();
w('The engine\'s reasons, verbatim:');
reasons(pscAR.reasons);
w();
const y30 = yr(pscE.years, 2030);
const y30ar = yr(pscAR.years, 2030);
w(`THE BASE MOVES THE LIMIT. In 2030 the limit is ${f6(y30.costOilLimit)} on ${pa.costOilLimitBase} and ${f6(y30ar.costOilLimit)} on ${argsOf('psc-ekene-after-royalty').costOilLimitBase} with the same percentage (engine). The base is a required input: a contract states which it means.`);
must('the gross and after-royalty limits differ in 2030', y30.costOilLimit !== y30ar.costOilLimit, `${y30.costOilLimit} ${y30ar.costOilLimit}`);
const again = (() => {
  let pool = pa.openingCostPool; let okAll = true;
  pa.years.forEach((y, i) => {
    const frac = pa.costOilLimitBase === 'gross' ? pa.costOilLimitPct / (100 - pa.royaltyPct) : pa.costOilLimitPct / 100;
    const o = CF.applyPSC({ gross_revenue: y.grossRevenue, capex: y.capex, opex: y.opex, depreciation: 0, cumulative_unrecovered_cost: pool }, pa.royaltyPct / 100, frac, (y.contractorProfitSharePct ?? pa.contractorProfitSharePct) / 100, pa.taxRatePct / 100, 0);
    okAll = okAll && o.cumulative_unrecovered_cost_after === pscE.years[i].poolOut && o.tax === pscE.years[i].tax;
    pool = o.cumulative_unrecovered_cost_after;
  });
  return okAll;
})();
must('every Ekene PSC year is the canonical applyPSC with the pool threaded', again, 'applyPSC');
w('Every year above is the canonical applyPSC of cashflow.ts called once with the pool threaded (checked when this digest is built): the pool out and the tax of each year are the applyPSC return values exactly.');

/* ============================================================ SECTION 16 */

section('published', 'The published PSC checks: World Bank Briefing Note 8, IMF FARI Figure 5, IMF FARI Tables 12 and 13', ['Professional m06']);
w('Three published worked examples run through the same engine call. Each golden input states the example\'s own terms; each printed figure is typed here from the text with its citation (text), beside the engine\'s figure.');
w();
const wb = runG('psc-wb-bn8-2007').years[0];
const wbA = argsOf('psc-wb-bn8-2007');
w(`WORLD BANK BRIEFING NOTE 8 (November 2007), golden input psc-wb-bn8-2007: gross ${f6(wbA.years[0].grossRevenue)}, costs ${f6(wbA.years[0].capex)}, royalty ${f6(wbA.royaltyPct)} percent, limit ${f6(wbA.costOilLimitPct)} percent of ${wbA.costOilLimitBase}, contractor profit share ${f6(wbA.contractorProfitSharePct)} percent, tax ${f6(wbA.taxRatePct)} percent.`);
w();
const WBP = [['royalty', 10, wb.royalty], ['cost oil limit', 60, wb.costOilLimit], ['cost recovered', 25, wb.costRecovered], ['profit oil', 65, wb.profitOil], ['contractor profit oil', 26, wb.contractorProfitOil], ['government profit oil', 39, wb.governmentProfitOil], ['income tax', 7.8, wb.tax], ['contractor retains', 43, wb.contractorEntitlement], ['government takes', 57, wb.governmentTake]];
table(['line', 'printed (text)', 'engine'], WBP.map(([l, p, e]) => [l, S(p), f6(e)]));
must('the World Bank lines agree: the first six exactly, tax to 1e-12, the two totals to the whole dollar', WBP.slice(0, 6).every(([, p, e]) => p === e) && Math.abs(wb.tax - 7.8) < 1e-12 && Math.round(wb.contractorEntitlement) === 43 && Math.round(wb.governmentTake) === 57, 'wb');
w(`The note prints the totals in whole dollars ("${dashfix(C('wb_result').quote)}", ${C('wb_result').cite}); the engine returns ${f6(wb.contractorEntitlement)} and ${f6(wb.governmentTake)}, which round to ${S(WBP[7][1])} and ${S(WBP[8][1])}. Its taxable income of ${S(WBP[4][1])} is the contractor's profit oil here, because the costs are recovered in full.`);
w();
const fa = runG('psc-fari-figure-5').years[0];
const FAP = [['cost recovered', 50, fa.costRecovered], ['government profit oil', 30, fa.governmentProfitOil], ['contractor profit oil', 20, fa.contractorProfitOil], ['income tax', 6, fa.tax], ['government', 36, fa.governmentTake]];
w(`IMF FARI FIGURE 5 (February 2016), golden input psc-fari-figure-5: one barrel at ${f6(argsOf('psc-fari-figure-5').years[0].grossRevenue)}, limit ${f6(argsOf('psc-fari-figure-5').costOilLimitPct)} percent of ${argsOf('psc-fari-figure-5').costOilLimitBase}, contractor share ${f6(argsOf('psc-fari-figure-5').contractorProfitSharePct)} percent, tax ${f6(argsOf('psc-fari-figure-5').taxRatePct)} percent.`);
w();
table(['line', 'printed (text)', 'engine'], FAP.map(([l, p, e]) => [l, S(p), f6(e)]));
must('every FARI Figure 5 line agrees exactly', FAP.every(([, p, e]) => p === e), 'fari5');
w();
const ft = runG('psc-fari-table-12');
const FT = {
  ceiling: [0, 0, 170, 434, 1327, 1083, 884, 721, 589, 480, 392],
  costPetroleum: [0, 0, 170, 434, 1264, 840, 778, 552, 451, 368, 303],
  closing: [250, 250, 299, 264, 0, 0, 0, 0, 0, 0, 0],
  profit: [0, 0, 43, 108, 395, 514, 326, 349, 285, 232, 187],
  jvProfit: [0, 0, 26, 61, 166, 238, 160, 181, 156, 130, 108],
  govProfit: [0, 0, 17, 48, 229, 276, 166, 169, 129, 102, 79],
};
w(`IMF FARI TABLES 12 AND 13 (February 2016), golden input psc-fari-table-12: eleven years in USD million, royalty ${f6(argsOf('psc-fari-table-12').royaltyPct)} percent, ceiling ${f6(argsOf('psc-fari-table-12').costOilLimitPct)} percent of ${argsOf('psc-fari-table-12').costOilLimitBase}, the government share of profit petroleum per year as Table 13 prints it (a daily-rate scale the tables compute outside this engine). The printed figures (text, Tables 12 and 13) are whole numbers of an unrounded model:`);
w();
table(['year', 'ceiling printed', 'ceiling engine', 'cost petroleum printed', 'cost recovered engine', 'closing printed', 'pool out engine', 'profit printed', 'profit oil engine', 'contractor printed', 'contractor engine', 'government printed', 'government engine'],
  ft.years.map((y, i) => [S(y.year), S(FT.ceiling[i]), f6(y.costOilLimit), S(FT.costPetroleum[i]), f6(y.costRecovered), S(FT.closing[i]), f6(y.poolOut), S(FT.profit[i]), f6(y.profitOil), S(FT.jvProfit[i]), f6(y.contractorProfitOil), S(FT.govProfit[i]), f6(y.governmentProfitOil)]));
const PRINTED_BAND = 1.5;
const costLines = ft.years.every((y, i) => Math.abs(y.costOilLimit - FT.ceiling[i]) <= 1.5 && Math.abs(y.costRecovered - FT.costPetroleum[i]) <= 1.5 && Math.abs(y.poolOut - FT.closing[i]) <= 1.5 && Math.abs(y.profitOil - FT.profit[i]) <= 1.5);
const splitLines = ft.years.every((y, i) => Math.abs(y.contractorProfitOil - FT.jvProfit[i]) <= 1.5 + 0.005 * y.profitOil && Math.abs(y.governmentProfitOil - FT.govProfit[i]) <= 1.5 + 0.005 * y.profitOil);
must('every FARI Table 12 cost line is within 1.5 of the printed figure', costLines, 'cost lines');
must('every FARI Table 13 split is within 1.5 plus half a per cent of the profit petroleum', splitLines, 'split');
const worstCost = Math.max(...ft.years.flatMap((y, i) => [Math.abs(y.costOilLimit - FT.ceiling[i]), Math.abs(y.costRecovered - FT.costPetroleum[i]), Math.abs(y.poolOut - FT.closing[i]), Math.abs(y.profitOil - FT.profit[i])]));
const worstSplit = Math.max(...ft.years.flatMap((y, i) => [Math.abs(y.contractorProfitOil - FT.jvProfit[i]), Math.abs(y.governmentProfitOil - FT.govProfit[i])]));
w();
w(`AGREEMENT AT THE PRINTED PRECISION (derived): the largest difference on a cost line (ceiling, cost petroleum, closing balance, profit) is ${f6(worstCost)}, inside the ${S(PRINTED_BAND)} a line made of at most three printed whole numbers can carry; the largest on the profit split is ${f6(worstSplit)}, inside ${S(PRINTED_BAND)} plus half a per cent of the year's profit petroleum, because Table 13 prints the government share as a whole per cent. The carry of ${S(FT.closing[0])} through the first two years and the ceilings that bind in the third and fourth are reproduced.`);
w();
w('NO DEFECT, AND WHAT IT PROVES. The validation record states, verbatim:');
const NODEF = FINDINGS.match(/Result: NO DEFECT\. The cost pool arithmetic of `applyPSC` \(royalty on gross;\s+the limit on revenue after royalty; cost recovered = min\(pool \+ capex \+\s+opex, limit\); the rest carried; profit oil = revenue after royalty - cost\s+recovered\) reproduces the IMF schedule year by year/);
must('FINDINGS records the no-defect result of the published PSC check', !!NODEF, 'no defect');
quote(NODEF ? NODEF[0].replace(/\s+/g, ' ') : '');

/* ============================================================ SECTION 17 */

section('nonconsent', 'Sole risk and non-consent: the premium on the proportionate share, recovery from production and reversion', ['Expert m01']);
w('THE RULE and THE MULTIPLE, in the engine\'s basis (nc-ekene-sidetrack), verbatim:');
quote(ncE.basis.rule);
quote(ncE.basis.multiple);
w();
w('THE RECOVERY, verbatim:');
quote(ncE.basis.recovery);
w();
const NC = ['nc-ekene-sidetrack', 'nc-premium-last-barrel', 'nc-premium-reverts-mid-year', 'nc-two-nonconsenting-deductions-exceed'];
NC.forEach((id) => {
  const a = argsOf(id); const r = runG(id);
  w(`${id} (golden input: ${a.operation.name} costing ${f6(a.operation.cost)}, consenting ${list(a.consenting)}, premium ${f6(a.premiumMultiplePct)} percent):`);
  w();
  table(['consenting party', 'participating interest', 'share of the project', 'cost paid'], r.consenting.map((s) => [s.id, f6(s.participatingPct), f6(s.projectPct), f6(s.cost)]));
  w();
  r.recovery.forEach((rec) => {
    const nc = byId(r.nonConsenting, rec.id);
    w(`${rec.id}: participating interest ${f6(nc.participatingPct)}, proportionate share of the cost ${f6(nc.costShare)}, premium ${f6(nc.premium)}; reverts in ${rec.revertsInYear === null ? 'no year stated' : S(rec.revertsInYear)} (engine).`);
    w();
    table(['year', 'opening', 'due', 'share of net value', 'recovered', 'closing', 'non-consenting party receives'], rec.ledger.map((l) => [S(l.year), f6(l.opening), f6(l.due), f6(l.share), f6(l.recovered), f6(l.closing), f6(l.nonConsentingReceives)]));
    w();
  });
  w('The engine\'s reasons, verbatim:');
  reasons(r.reasons);
  w();
});
const pb = byId(ncE.nonConsenting, 'PB');
w(`THE PREMIUM BASE. PB's premium is its proportionate share of the cost, ${f6(pb.costShare)} (the cost ${f6(ncE.operation.cost)} x its participating interest ${f6(pb.participatingPct)} percent), times the stated ${f6(ncE.premiumMultiplePct)} percent: ${f6(pb.premium)} (engine). The consenting parties pay the whole cost between them, in proportion to their participating interests among themselves.`);
must('the premium is the proportionate share times the multiple', pb.premium === (FX.nonConsent.operation.cost * 15 * 400) / 10000, pb.premium);
const lb = runG('nc-premium-last-barrel');
const lbC = byId(lb.recovery, 'C');
w(`REVERSION INSIDE THE PERIOD. On nc-premium-last-barrel the premium is recovered by exactly the ${f6(yr(lbC.ledger, 2031).recovered)} available in 2031, so C receives ${f6(yr(lbC.ledger, 2031).nonConsentingReceives)} that year and its whole share from the next; on nc-premium-reverts-mid-year the share in the payout year is larger than the balance, and the rest of that year's share is C's (${f6(yr(byId(runG('nc-premium-reverts-mid-year').recovery, 'C').ledger, 2031).nonConsentingReceives)}).`);
must('the last-barrel case pays C 0 in 2031 and its whole share in 2032', yr(lbC.ledger, 2031).nonConsentingReceives === 0 && yr(lbC.ledger, 2032).nonConsentingReceives === yr(lbC.ledger, 2032).share, 'last barrel');

/* ============================================================ SECTION 18 */

section('buyin', 'Buy-in: entry at a stated multiple, apportioned to the consenting parties', ['Expert m02']);
const bn = runG('nc-ekene-buy-in-norway-1000');
w(`THE NORWEGIAN ENTRY (golden input nc-ekene-buy-in-norway-1000: ${bn.operation.name} costing ${f6(bn.operation.cost)}, consenting ${list(bn.consenting.map((s) => s.id))}, multiple ${f6(bn.premiumMultiplePct)} percent, mode ${bn.mode}). ${GC['nc-ekene-buy-in-norway-1000'].note}.`);
w();
bn.buyIn.forEach((b) => {
  w(`${b.id} pays ${f6(b.payment)} to enter (engine), apportioned:`);
  w();
  table(['consenting party', 'participating interest', 'amount received'], b.toParties.map((t) => [t.id, f6(byId(bn.consenting, t.id).participatingPct), f6(t.amount)]));
});
w();
w('The engine\'s reasons, verbatim:');
reasons(bn.reasons);
must('the Norwegian entry payment is ten times the proportionate share', bn.buyIn[0].payment === 10 * bn.nonConsenting[0].costShare, bn.buyIn[0].payment);
w();
const ncRec = byId(ncE.recovery, 'PB');
w(`BUY-IN AND RECOVERY FROM PRODUCTION COMPARED, on the same sidetrack. Under buy-in at ${f6(bn.premiumMultiplePct)} percent PB pays ${f6(bn.buyIn[0].payment)} at once; under recovery at ${f6(ncE.premiumMultiplePct)} percent the consenting parties take ${f6(ncRec.recovered)} out of PB's share of net value from ${S(ncRec.ledger[0].year)} to ${S(ncRec.revertsInYear)} (engine). Both rest on the same base, PB's proportionate share of ${f6(pb.costShare)}; the multiple and the timing are the contract's.`);
must('both modes rest on the same proportionate share', bn.nonConsenting[0].costShare === pb.costShare, 'same base');
w();
w(`THE CONSENTING PARTIES' SHARES. Under both modes the consenting parties hold the project in proportion to their participating interests among themselves: ${bn.consenting.map((s) => `${s.id} ${f6(s.projectPct)}`).join(', ')} (engine).`);

/* ============================================================ SECTION 19 */

section('readings', 'The three readings the engine states, and the limit base as a stated input', ['Expert m03']);
w('A READING is a place where a public text can be read two ways and the engine takes one, stating it in its basis. The course quotes each verbatim and grades none. Three readings:');
w();
const pscTax = pscE.basis.tax;
w('READING ONE: THE PSC INCOME TAX. The engine\'s basis, verbatim:');
quote(pscTax);
must('the tax reading is stated verbatim in the basis', pscTax === 'income tax is charged on the contractor\'s profit oil share, as FARI TNM/16/01 and World Bank Note 8 assume (applyPSC in engines/economics/cashflow.ts)', pscTax);
const y31 = yr(pscE.years, 2031);
w(`READING ONE ACTS in a year where the limit binds. On psc-ekene, 2031: cost recovered ${f6(y31.costRecovered)} against capex and opex of ${f6(y31.capex + y31.opex)}, contractor profit oil ${f6(y31.contractorProfitOil)}, tax ${f6(y31.tax)} (engine), which is ${f6(pa.taxRatePct)} percent of the contractor's profit oil. The World Bank note says income tax deductions carry no limit of the kind cost oil has ("${dashfix(C('wb_no_limits_tax').quote)}", ${C('wb_no_limits_tax').cite}); a regime that deducts every cost incurred would tax a different base in such a year. No public text prints such a year with its tax, so the engine states its reading and the course grades no tax figure.`);
must('the 2031 tax is 30 percent of the contractor profit oil (within 1e-6)', Math.abs(y31.tax - 0.3 * y31.contractorProfitOil) < 1e-6 && y31.poolOut > 0, `${y31.tax} ${y31.contractorProfitOil}`);
w();
w('READING TWO: THE GRACE. The engine\'s basis (default-grace-exceeded), verbatim:');
const gx = runG('default-grace-exceeded');
quote(gx.basis.grace);
w(`READING TWO ACTS when a default is cured after the grace. On default-grace-exceeded (grace ${S(argsOf('default-grace-exceeded').interest.graceHours)} hours, cured after ${S(gx.defaulters[0].days)} days) the interest ${f6(gx.interestTotal)} runs from the due date, as the Kenya clause prints ("${dashfix(C('kenya_6_7_grace').quote)}", ${C('kenya_6_7_grace').cite}); on default-grace-last-hour (${S(runG('default-grace-last-hour').defaulters[0].days)} days) there is none. A contract whose grace also delays the start of interest would give a smaller figure; the engine follows the printed clause and the course grades no figure that depends on which.`);
must('the grace-exceeded interest counts from the due date: 4 days', gx.defaulters[0].days === 4 && gx.interestTotal > 0, gx.defaulters[0].days);
w();
w('READING THREE: THE COVER. The engine\'s basis (default-ekene-march), verbatim:');
quote(dE.basis.cover);
w(`READING THREE ACTS while a carry is live. The Norwegian text advances a defaulter's unpaid amount "in accordance with their Participating interest" (${C('nojoa_9_1_advance').cite}); outside a carry the paying and participating interests are the same, and under the Ekene carry NOC pays no cost. On default-ekene-march the engine covers by the paying interests (EKO ${f6(byId(dE.cover, 'EKO').coverPct)} percent, PA ${f6(byId(dE.cover, 'PA').coverPct)} percent of the cover, engine); a reading by participating interest would bring the carried NOC into the cover.`);
must('the cover shares are the paying interests among the non-defaulters', Math.abs(byId(dE.cover, 'EKO').coverPct - (50 * 100) / 81.25) < 1e-9, byId(dE.cover, 'EKO').coverPct);
w();
w('THE LIMIT BASE IS A STATED INPUT. applyPSC takes the limit on revenue after royalty; the World Bank note states its limit on gross revenue; the Act\'s s.311(2)(a)(iii) ceiling is worded on "total oil production". The engine takes `costOilLimitBase` as a required input with no default and, for "gross", passes the same amount to applyPSC as a fraction of revenue after royalty. The limit base basis (psc-wb-bn8-2007), verbatim:');
quote(runG('psc-wb-bn8-2007').basis.limitBase);
w();
w('NO HIDDEN CONTRACTUAL DEFAULTS. Every contract term below is required, and a call without it is refused by name (' + ref('refusals') + '): the interest method and the grace hours (0 when the contract gives none), the day basis, the rate, the reconciliation lag, the negative call rule, the uplift type, the recovery share, the premium multiple, the refundable kinds under basis "contract", the overhead scale of every category, the budget tolerance, the cost oil limit and its base, the opening pool. A threshold, a cap and a set of consequences are optional and are applied only when stated.');
const noGrace = GOLD.cases.find((c) => c.id === 'default-refuse-no-grace');
w('The refusal when the grace is left out, verbatim:');
quote(J.defaultCover(clone(noGrace.args)).error);
must('leaving the grace out is refused', J.defaultCover(clone(noGrace.args)).field === 'interest.graceHours', 'grace refusal');

/* ============================================================ SECTION 20 */

section('quirks', 'Reference texts and their quirks: licensed forms, printed figures, a worked example that does not add up', ['Expert m04']);
const OPENOIL = { rate: 0.25, base: 49, printed: 11.75 };
w('MODEL AGREEMENTS AND LICENSED FORMS. The industry\'s common model joint operating agreement (AIPN) and the COPAS accounting procedures are sold under licence and are taught here by concept only. The public texts this course quotes are government publications: the Norwegian agreement (an unofficial English translation) and the Kenya and Tanzania model contracts. Where a public text leaves a figure blank, as the Kenya model leaves the margin over LIBOR, the engine takes the figure as a required input.');
w();
w('THE TRANSLATION PRINTS WHAT IT PRINTS. The Norwegian Article 9.2 reads "he looses his right to vote" (' + C('nojoa_9_2_vote').cite + '); the course quotes it as printed and paraphrases it as the loss of the vote.');
w();
w('THE NORWEGIAN SCALE IS A RESEARCH AND DEVELOPMENT CHARGE. Accounting Agreement Art. 2.2.2 charges the operator\'s general research and development cost by per cent rates in bands, and Art. 2.2.3 charges corporate management at a flat per cent of annual cost (' + C('noaa_2_2_3_corporate').cite + '); the engine\'s `overhead` computes any marginal scale of this shape, with every band and rate a stated input. The printed bands are in NOK million and move each year with the consumer price index from 15 July 2004 (' + C('noaa_2_2_2_cpi').cite + '); the engine does not index them.');
w();
w(`PRINTED FIGURES AND EXACT FIGURES. The World Bank note prints ${S(WBP[7][1])} and ${S(WBP[8][1])}; the engine returns ${f6(wb.contractorEntitlement)} and ${f6(wb.governmentTake)} (${ref('published')}). IMF FARI Tables 12 and 13 print whole numbers of an unrounded model; the engine agrees with them within the printed precision. A reason the engine prints rounds money to the cent: the Ekene carry recovery reads, verbatim,`);
const lastCarry = crE.reasons.find((t) => /^2033: the balance/.test(t));
quote(lastCarry);
must('the carry payout reason prints money to the cent', /7267760\.62/.test(lastCarry), lastCarry);
w(`and the course quotes that balance as the numeric field at six decimals: ${f6(yr(crE.ledger, 2033).recovered)}.`);
w();
w(`A WORKED EXAMPLE THAT DOES NOT ADD UP. OpenOil's book prints "${dashfix(C('openoil_product').quote)}" (${C('openoil_product').cite}). The product of ${S(OPENOIL.rate)} and ${S(OPENOIL.base)} is ${S(OPENOIL.rate * OPENOIL.base)} (derived); the printed ${S(OPENOIL.printed)} is an arithmetic error, and the validation record keeps the book out of every gate for that reason. A figure copied from a reference text is checked before it is taught.`);
must('the OpenOil figures are the ones its quotation prints', C('openoil_product').quote.includes(`${OPENOIL.rate} x ${OPENOIL.base} = ${OPENOIL.printed}`) && OPENOIL.rate * OPENOIL.base === 12.25, OPENOIL.rate * OPENOIL.base);
must('FINDINGS records the OpenOil error', /its state participation example prints 0\.25 x 49 = 11\.75 \(the product is 12\.25\), so it is not a gate/.test(FINDINGS), 'openoil');
w();
w('THE ACT GOVERNS A NAMED CONTRACT. PIA s.85(4) applies to the contract "provided for under section 85 (2) (d)", the concession agreement with a joint venture; its figures are applied only when a call states basis "pia-s85-4" (' + ref('provisions') + ').');

/* ============================================================ SECTION 21 */

section('boundaries', 'Boundaries, rule by rule', ['Expert m04 l04']);
w('Every rule the engine applies has its own boundary; no single rule covers them all. Each row below was probed by a call on a golden input when this digest was built:');
w();
const ctx = runG('cc-threshold-exactly');
const zcm = runG('cc-zero-call-month');
const bat = runG('budget-item-at-tolerance');
const bo1 = runG('budget-item-one-over');
const bph = runG('budget-norway-pct-holds');
const ohe = runG('overhead-band-edge-exact');
const dcd = runG('default-cured-on-due-date');
const glh = runG('default-grace-last-hour');
const gfh = runG('default-grace-fractional-hours');
const mcw = runG('default-monthly-compound-whole-months');
const mce = runG('default-monthly-compound-month-end');
const cot = runG('default-cured-on-trigger-day');
const cda = runG('default-cured-day-after-trigger');
const fld = runG('default-forfeiture-last-day');
const fda = runG('default-forfeiture-day-after');
const co1 = runG('carry-one-short');
const cce = runG('carry-cap-exactly-cost');
const nrm = runG('nc-premium-reverts-mid-year');
const nde = runG('nc-two-nonconsenting-deductions-exceed');
const b60 = runG('backin-pia-at-60');
table(['rule', 'at the boundary (probed)', 'engine result'], [
  ['no-call threshold', `a forecast EQUAL to the threshold (cc-threshold-exactly: ${f6(ctx.months[0].forecast)})`, `called (${S(ctx.months[0].called)}); one below it is not (${S(ctx.months[1].called)})`],
  ['zero-forecast month', 'a forecast of 0 with no threshold (cc-zero-call-month)', `called (${S(zcm.months[1].called)}); the call is the adjustment alone`],
  ['negative call', 'an adjustment above the forecast share', '"refund": a negative call; "carry": a call of 0 and the rest carried'],
  ['reconciliation', 'the difference of month t', 'adjusts the call of month t + lag'],
  ['budget item', `an overrun of EXACTLY the tolerance (budget-item-at-tolerance: ${f6(bat.items[0].overrun)} on ${f6(bat.items[0].approved)})`, `inside (${S(bat.items[0].withinItemTolerance)}); ${f6(bo1.items[0].overrun)} is beyond (${S(bo1.items[0].withinItemTolerance)})`],
  ['budget total', `an overrun EQUAL to the allowed overrun (budget-norway-pct-holds: ${f6(bph.total.overrun)})`, `inside (${S(bph.total.withinBudgetTolerance)})`],
  ['unbudgeted allowance', 'unbudgeted spend EQUAL to the allowance', 'inside; one unit above is outside (budget-ekene-allowance-short)'],
  ['overhead band', `a base EXACTLY at a band's upper limit (overhead-band-edge-exact: ${f6(ohe.categories[0].base)})`, `that band only; the next band gets ${f6(ohe.categories[0].bands[1].amount)}`],
  ['default interest', 'cured on the due date (default-cured-on-due-date)', `${S(dcd.defaulters[0].days)} days, ${f6(dcd.interestTotal)} interest`],
  ['grace', `cured EXACTLY graceHours after the due date (default-grace-last-hour: ${S(glh.defaulters[0].days * 24)} hours)`, `inside the grace (${S(glh.defaulters[0].withinGrace)}), no interest; a ${S(argsOf('default-grace-fractional-hours').interest.graceHours)}-hour grace with ${S(gfh.defaulters[0].days * 24)} hours elapsed is exceeded (${S(!gfh.defaulters[0].withinGrace)})`],
  ['monthly compounding', `cured on a month anniversary (default-monthly-compound-whole-months)`, `${S(mcw.defaulters[0].wholeMonths)} whole months, ${S(mcw.defaulters[0].remainingDays)} remaining days`],
  ['monthly compounding from a month end', `due ${argsOf('default-monthly-compound-month-end').dueDate} (default-monthly-compound-month-end)`, `${S(mce.defaulters[0].wholeMonths)} whole months, then ${S(mce.defaulters[0].remainingDays)} days`],
  ['a consequence', `cured ON the trigger date (default-cured-on-trigger-day)`, `not triggered (${S(cot.defaulters[0].suspension.applies)}); cured a day later it is (${S(cda.defaulters[0].suspension.applies)})`],
  ['forfeiture, uncured', `asOf EQUAL to the trigger date (default-forfeiture-last-day)`, `not triggered (${S(fld.defaulters[0].forfeiture.applies)}); a day later it is (${S(fda.defaulters[0].forfeiture.applies)})`],
  ['working days', 'a weekend and stated holidays inside the count (default-working-days-holiday)', `five working days from 2027-12-22 end ${runG('default-working-days-holiday').defaulters[0].suspension.triggerDate}`],
  ['months', 'three months from 31 January (default-months-end-of-month)', `end ${runG('default-months-end-of-month').defaulters[0].forfeiture.triggerDate}, the month end`],
  ['paid share', 'paid EQUAL to the share', 'refused: no default (default-refuse-paid-in-full)'],
  ['carry recovered exactly', `available EQUAL to the balance (carry-recovered-exactly)`, `recovered that year; one short (carry-one-short) leaves ${f6(yr(co1.ledger, 2028).closing)}`],
  ['carry cap', `cumulative recovery reaching the cap (carry-cap-exactly-cost: cap ${S(argsOf('carry-cap-exactly-cost').cap)})`, `the rest written off that year (${f6(cce.totals.writtenOff)})`],
  ['premium on the last barrel', 'a share EQUAL to the balance (nc-premium-last-barrel)', 'reversion from the next period; the non-consenting party receives 0 that year'],
  ['premium inside a period', `a share above the balance (nc-premium-reverts-mid-year)`, `the rest of that year's share is the non-consenting party's (${f6(yr(byId(nrm.recovery, 'C').ledger, 2031).nonConsentingReceives)})`],
  ['net value', `deductions above the gross value (nc-two-nonconsenting-deductions-exceed, 2030)`, `0, nothing recovered (${f6(yr(byId(nde.recovery, 'B').ledger, 2030).recovered)})`],
  ['PIA participation', `a target EQUAL to ${S(PIA.maxGovernmentParticipationPct)} (backin-pia-at-60)`, `accepted (${f6(b60.targetPct)}); ${S(argsOf('backin-refuse-pia-61').targetPct)} refused`],
  ['PSC limit on gross', 'a limit above 100 - royalty', 'refused (psc-refuse-gross-limit)'],
]);
must('the threshold boundary: called at, not below', ctx.months[0].called && !ctx.months[1].called, 'threshold');
must('the Ekene allowance boundary: the short case is outside the allowance', runG('budget-ekene-allowance-short').unbudgeted.withinAllowance === false, 'allowance');
must('the band edge charges the second band nothing', ohe.categories[0].bands[1].amount === 0, 'edge');
must('the fractional grace is exceeded', gfh.defaulters[0].withinGrace === false, 'fractional');
must('the whole-months case has 0 remaining days', mcw.defaulters[0].remainingDays === 0, 'whole months');
must('the month-end case has 2 whole months then 15 days', mce.defaulters[0].wholeMonths === 2 && mce.defaulters[0].remainingDays === 15, 'month end');
must('the carry cap case writes off above 0', cce.totals.writtenOff > 0, 'cap');
must('the deductions-exceed year recovers 0', yr(byId(nde.recovery, 'B').ledger, 2030).recovered === 0, 'net value');
must('the paid-in-full refusal names defaulters[0].paid', GOLD.cases.find((c) => c.id === 'default-refuse-paid-in-full').expected.field === 'defaulters[0].paid', 'paid');
must('the gross limit refusal names costOilLimitPct', GOLD.cases.find((c) => c.id === 'psc-refuse-gross-limit').expected.field === 'costOilLimitPct', 'gross');
must('the PIA 61 refusal names targetPct', GOLD.cases.find((c) => c.id === 'backin-refuse-pia-61').expected.field === 'targetPct', '61');

/* ============================================================ SECTION 22 */

section('notcomputed', 'What the engine does not compute', ['Expert m05']);
w('Each item below is taught as a concept only, with where it would come from. None is graded.');
w();
table(['not computed', 'where it comes from', 'what the engine does instead'], [
  ['the compensation on an assignment of a defaulter\'s interest', 'Norway JOA Art. 9.3 (at most the book value less unpaid contributions)', 'reports forfeiture as available with the pro rata interests'],
  ['cover by acquiring the defaulter\'s share of petroleum', 'Norway JOA Art. 9.1', 'cover in cash, pro rata'],
  ['interest on cash balances held by the operator', 'Norway Accounting Agreement Art. 1.2.3', 'nothing'],
  ['the consumer price index adjustment of the overhead bands', 'Norway Accounting Agreement Art. 2.2.2', 'the bands are stated inputs'],
  ['the expert determination of the unrecovered costs', 'PIA s.85(4)(e)', 'the costs are stated inputs'],
  ['the haircut on disputed amounts', 'PIA s.311(2)(a)(iii)', 'nothing'],
  ['sole risk development and the bar on later entry', 'Norway JOA Art. 19', 'sole risk operations only'],
  ['a daily-rate or R-factor scale of profit shares', 'IMF FARI Table 11 and Table 13 (a DROP scale)', 'takes a stated profit share per year'],
  ['income tax on a regime that deducts every cost incurred', 'World Bank Note 8', 'tax on the contractor\'s profit oil (' + ref('readings') + ')'],
  ['cash call debts of NNPC joint ventures and incorporated joint venture companies', 'PIA s.54(8) and s.65', 'nothing; concept only'],
]);
w();
w('WHAT THE ENGINE SAYS IT DOES NOT COMPUTE, in its own bases, verbatim:');
quote(dE.basis.notComputed);
quote(biE.basis.notComputed);
must('FINDINGS lists the not-computed items', /Not computed \(concept only\)/.test(FINDINGS) && /interest on cash balances/.test(FINDINGS) && /expert determination/.test(FINDINGS) && /DROP and R-factor/.test(FINDINGS), 'not computed');
w();
w(`A SLIDING SCALE COMPUTED OUTSIDE. When a year states its own contractor share, the engine uses it (psc-fari-table-12 carries the Table 13 shares, ${list(argsOf('psc-fari-table-12').years.filter((y) => y.contractorProfitSharePct !== undefined).map((y) => `${S(y.year)} ${S(y.contractorProfitSharePct)}`))}); the scale that sets each share is the contract's and is worked outside the engine.`);

/* ============================================================ SECTION 23 */

section('caps', 'Size caps and refusals at scale', ['Expert m06 l02']);
const P2 = (n) => Array.from({ length: n }, (_, i) => ({ id: `P${i}`, participatingPct: 100 / n }));
const MON = (n) => Array.from({ length: n }, (_, i) => ({ month: `${2000 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`, forecast: 1, actual: 1 }));
const YRS = (n) => Array.from({ length: n }, (_, i) => ({ year: 2000 + i, cost: 1, entitlement: 1 }));
const CAPS = [
  ['MAX_PARTIES', `participatingInterests with ${D.MAX_PARTIES + 1} parties`, J.participatingInterests({ parties: P2(D.MAX_PARTIES + 1) }), 'parties'],
  ['MAX_MONTHS', `cashCalls with ${D.MAX_MONTHS + 1} months`, J.cashCalls({ parties: [{ id: 'A', participatingPct: 100 }], months: MON(D.MAX_MONTHS + 1), reconciliationLagMonths: 1, negativeCall: 'carry' }), 'months'],
  ['MAX_YEARS', `carryRecovery with ${D.MAX_YEARS + 1} years`, J.carryRecovery({ parties: [{ id: 'A', participatingPct: 80 }, { id: 'N', participatingPct: 20 }], carries: [{ carried: 'N', carriedPct: 100, carriers: 'pro-rata' }], carried: 'N', years: YRS(D.MAX_YEARS + 1), uplift: { type: 'none' }, recoverFromPct: 100, basis: 'contract' }), 'years'],
  ['MAX_ITEMS', `budgetControl with ${D.MAX_ITEMS + 1} items`, J.budgetControl({ items: Array.from({ length: D.MAX_ITEMS + 1 }, (_, i) => ({ item: `i${i}`, approved: 1, actual: 1 })), itemTolerancePct: 10, budgetTolerance: { pct: 5 } }), 'items'],
  ['MAX_BANDS', `an overhead scale of ${D.MAX_BANDS + 1} bands`, J.overhead({ costs: { operating: 1 }, scale: { operating: { bands: Array.from({ length: D.MAX_BANDS + 1 }, (_, i) => ({ upTo: i + 1, pct: 1 })), abovePct: 0 } } }), 'scale.operating.bands'],
];
table(['cap', 'value', 'stated call over the cap', 'the engine\'s message, verbatim'], CAPS.map(([k, what, r, field]) => { refusal(`cap ${k}: ${what}`, r, field); return [`\`${k}\``, S(D[k]), what, r.error]; }));
w();
const TIMING = FINDINGS.match(/\| cashCalls, 20 parties \| 600 months \| ([\d.]+) \|/);
must('FINDINGS records the 600-month timing row', !!TIMING, 'timing');
w(`A panel stays well inside these caps. The validation record's timing table, run on 2026-09-26 on one machine, prints a ${S(D.MAX_MONTHS)}-month cash call ledger of ${S(D.MAX_PARTIES)} parties at ${TIMING ? TIMING[1] : ''} milliseconds (text).`);

/* ============================================================ SECTION 24 */

section('choices', 'Conventions that are choices, and the partner report', ['Expert m06']);
w('CONVENTIONS THAT ARE CHOICES. Each is the engine\'s stated choice where no text fixes one; a different choice would move a figure, so each is named in any report that quotes the figure:');
w();
table(['convention', 'the engine\'s choice', 'where it comes from'], [
  ['beneficial and paying interest', 'beneficial interest is the participating interest; paying interest moves only under a carry', 'engine convention on Norway JOA Art. 8.1'],
  ['carriers pro rata', 'in proportion to the participating interests of the parties no carry names as carried', 'engine convention'],
  ['the reconciliation', 'the difference of a called month adjusts the call reconciliationLagMonths later; an uncalled month has no difference and is billed in arrears', 'Norway Accounting Agreement Art. 1.2.1 ("the next request"), with the lag stated'],
  ['overhead', 'a marginal scale on the base after the stated exclusions; overhead never in its own base', 'Norway Accounting Agreement Art. 2.2.2'],
  ['the budget tolerance', 'the lower of the percentage and the amount; an overrun of exactly the tolerance is inside', 'Norway JOA Art. 12.5 ("by up to", "the lower of")'],
  ['default interest', 'from and including the due date to, but excluding, the cure date; simple or compounded monthly as stated', 'Norway Accounting Agreement Art. 1.2.2; Kenya Model PSC 2015 Art. 6.7'],
  ['the cover', 'by the paying interests of the non-defaulting parties', 'a stated reading (' + ref('readings') + ')'],
  ['the grace', 'cured within it: no interest; cured later: interest from the due date', 'a stated reading (' + ref('readings') + ')'],
  ['the carry uplift', 'on the opening balance; a year\'s new carried cost earns none in its own year; recovery at the year end from the same year\'s entitlement', 'engine convention'],
  ['a back-in', 'the others keep (100 - target) / (100 - current) of their interests and receive the refund in proportion to the interest given up', 'engine convention'],
  ['non-consent', 'the premium on the proportionate share of the cost; reversion inside the payout period', 'engine convention; Norway JOA Art. 18.12 for the entry base'],
  ['the PSC tax', 'on the contractor\'s profit oil', 'a stated reading (' + ref('readings') + ')'],
  ['the NPV', 'year-end flows discounted to the stated base year', 'the canonical npv of cashflow.ts'],
  ['money in a reason', 'rounded to the cent, half away from zero, trailing zeros dropped; every numeric field keeps full precision', 'engine convention'],
]);
w();
w('WRITING THE PARTNER REPORT names: the licence and its parties (synthetic in this course) with their participating interests; every source applied with its edition and the date read; each carry with its carriers and the paying interests it produces; the cash call terms (lag, negative call rule, threshold) and each month\'s calls with the engine\'s reasons; the budget and its tolerances; the overhead scale and exclusions; any default with its dates, interest terms, cover and consequences; each carry recovery with its uplift, recovery share, cap and basis; any back-in with its target, refundable costs and refund form; any sole risk operation with its premium multiple and mode; the PSC terms with the limit base stated; the discount rate and base year beside every NPV; and each reading the figures rest on.');

/* ============================================================ SECTION 25 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Six terms in this course carry a narrower meaning than they have in conversation. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['term', 'what it can mean elsewhere', 'the rule here'], [
  ['interest', 'any interest, including money charged on a loan', 'always qualified: participating interest, paying interest, beneficial interest or carried interest for a share of the venture; default interest for money charged on a late payment'],
  ['carry', 'anything carried', 'a carried party\'s cost share paid by its carriers; a pool, a credit or a balance moved to a later period is "carried forward" or "carried to" a named period'],
  ['recovery', 'any getting back', 'always of something named: carry recovery, premium recovery, or cost recovery under a PSC'],
  ['premium', 'any extra payment', 'the stated multiple of a non-consenting party\'s proportionate share of an operation\'s cost'],
  ['cash call', 'any request for money', 'the operator\'s monthly request for advances against a forecast; an adjustment is the difference of an earlier month applied to a later call'],
  ['overhead', 'any indirect cost', 'the operator\'s charge on a stated scale over a stated base; the Norwegian scale it follows is a research and development and corporate charge'],
]);
w();
w('A FIGURE THAT DEPENDS ON A TERM is quoted with it: a call with its lag and negative call rule; an overrun with its tolerance; an overhead charge with its scale and exclusions; default interest with its rate, method, day basis and grace; a recovery with its uplift and recovery share; a premium with its multiple; a PSC figure with its limit and base; an NPV with its rate and base year.');

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', process.env.EC9_DUMP_PARTIAL || unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', process.env.EC9_DUMP_PARTIAL || SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)));
must('no em or en dash reaches the digest', !OUT.some((l) => /[–—]/.test(l)), OUT.find((l) => /[–—]/.test(l)));

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`joa_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.EC9_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`joa_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
