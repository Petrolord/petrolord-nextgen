// THE EC7 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. AUDIT-PIA-2021.md,
// FINDINGS-pia2021.md, the oracle and the engine's own source comments are
// PROVENANCE. Where they state a figure this file recomputes it through the
// engine on the vendored golden inputs or on stated inputs and prints it.
//
// Usage:  sh /root/cat-wip-pia/build_digest.sh > digest.tmp && mv digest.tmp digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE
// (engines/economics/cashflow.ts, the default path of ENGINE_VERSION 3.12.0),
// except where a line says "stated" (an input typed in this file and printed
// beside the call it went into), "golden input" (read from the vendored
// test-data/economics/goldens/pia2021_cases.json, whose inputs are the Ekene
// synthetic cases), "text" (a figure printed by a gazetted text, quoted in
// concepts.json with its citation and verified against the text by
// quote_check.py) or "derived" (arithmetic on engine values printed in the
// same block, with the arithmetic stated). Nothing here reads a clock, a
// random number, a locale or a network; TZ and LC_ALL are pinned by
// build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page, and asserted.
// Two figures that print alike at six decimals are never called equal unless
// the engine says so.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts the call threw and records the message verbatim; `ok()` asserts it
// did not; every claim a sentence makes about a table goes through `must()`.
// If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads pia_capstone.mjs,
// fields.json or the capstone cases, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour. The engine's pia_legacy_pre_audit input is a
// platform reproduction switch; no digest run sets it.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.EC7_WAVE_DIR || '/root/cat-wip-pia';
const { E, CONV, ROOT, ENGINE_REL } = await import(`${HERE}/pia_engine.mjs`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const FINDINGS = fs.readFileSync(`${ROOT}/tools/validation/economics/FINDINGS-pia2021.md`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/pia2021_cases.json`, 'utf8'));
const CONCEPTS = JSON.parse(fs.readFileSync(process.env.EC7_CONCEPTS || `${HERE}/concepts.json`, 'utf8'));
const MODULES = JSON.parse(execFileSync('python3', [`${HERE}/structure.py`, '--modules'], { encoding: 'utf8' }));

/* ---------------------------------------------------------- the machinery */

const OUT = [];
const w = (s = '') => OUT.push(s);
const ASSERTS = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const f6 = (x) => (x === null || x === undefined ? 'none' : Number(x).toFixed(6));
const vol = (x) => (Number.isInteger(x) ? String(x) : Number(x).toFixed(6));
const S = (x) => String(x);
const list = (a) => a.join(', ');
const clone = (o) => JSON.parse(JSON.stringify(o));
const cell = (s) => String(s).replace(/\|/g, '/');
const ok = (label, fn) => {
  try { const r = fn(); must(`LABELLED A RESULT: ${label}`, true, 'returned'); return r; } catch (e) { must(`LABELLED A RESULT: ${label}`, false, e.message); return null; }
};
const refusal = (label, fn) => {
  try { fn(); must(`LABELLED A REFUSAL: ${label}`, false, 'returned a result'); return null; } catch (e) {
    must(`LABELLED A REFUSAL: ${label}`, true, 'refused');
    must(`A REFUSAL IS AN Error WITH A MESSAGE: ${label}`, e instanceof Error && typeof e.message === 'string' && e.message.length > 20, e.message);
    return e.message;
  }
};
const ownerClause = (owners) => owners.map((o) => {
  const m = o.match(/^(Associate|Professional|Expert) (m\d{2})(?: (l\d{2}))?$/);
  if (!must(`owner "${o}" is well formed`, !!m, o)) return o;
  const mod = MODULES[m[1]] && MODULES[m[1]][m[2]];
  must(`owner "${o}" names a module structure.py has`, !!mod, o);
  if (m[3]) must(`owner "${o}" names a lesson structure.py has`, mod && mod.lessons.includes(m[3]), o);
  return o;
}).join(' and ');
const ORDER = ['computes', 'sources', 'provisions', 'institutions', 'licences', 'dataset', 'refusals', 'graded',
  'tranches', 'gas', 'price', 'stack', 'hctscope', 'hctbase', 'allowances', 'cit', 'framework', 'edges', 'levies',
  'take', 'moved', 'notes', 'boundaries', 'concepts', 'vocabulary'];
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
// A provision from concepts.json, found and verified (quote_check.py re-verifies every quote against the text).
const CON = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
const C = (id) => { const c = CON[id]; must(`concepts.json carries a found provision ${id}`, c && c.found === true && c.quote && c.cite, id); return c || { cite: id, quote: '', paraphrase: '' }; };
const cq = (id) => { const c = C(id); w(`${c.cite}: ${c.paraphrase}`); quote(`${c.quote} (${c.cite})`); };

/* ---------------------------------------------------------- the engine runs */

const GC = Object.fromEntries(GOLD.cases.map((c) => [c.name, c]));
const runCfg = (cfg, c) => E.computeCashFlow({ cfg: clone(cfg), prodRows: clone(c.prodRows), capexRows: clone(c.capexRows), opexRows: clone(c.opexRows) });
const runG = (name, patch = {}) => {
  const c = GC[name];
  must(`the golden file carries the case ${name}`, !!c, name);
  must(`${name} does not set the legacy switch`, c && c.cfg.pia_legacy_pre_audit === undefined, 'legacy');
  return ok(`computeCashFlow on ${name}${Object.keys(patch).length ? ` with ${JSON.stringify(patch)}` : ''}`, () => runCfg({ ...c.cfg, ...patch }, c));
};
const row = (r, y) => r.cashFlowData.find((d) => d.year === y);
const TXT = E.PIA_TEXTS;
const NOTES = E.PIA_NOTES;

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# EC7 TEACHING DIGEST: Petroleum Industry Act 2021 & Nigerian Fiscal Terms');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The audit, the engine FINDINGS record, the oracle and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every amount of money, rate, fraction, share, percentage, benchmark, price, allowance, levy, tax, take and daily rate prints to SIX decimals; years, counts and whole barrels, Mscf and bopd inputs print as whole numbers; an engine message and an engine note are printed verbatim, figures and all.');
w();
w(`# ENGINE. ${ENGINE_REL}, ENGINE_VERSION ${E.ENGINE_VERSION}, vendored sha-identical with petrolord-engines 3778451 (engines PR #262), ${engineLines} lines, the default path. It makes no network call. engines/economics/fiscalConventions.js supplies the take wording (${ref('take')}).`);
must('the engine is 3.12.0', E.ENGINE_VERSION === '3.12.0', E.ENGINE_VERSION);
w();
w('# AN ENGINE COURSE. There is no Suite app for this course. Every practical runs in the course\'s own calculator panels, which call this same vendored engine on the learner\'s own terms and rows.');
w();
w('# THE DATA. Every Ekene case, field, volume, price and cost is SYNTHETIC, written for this platform. No real company, licence, field or price list appears.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone case and no graded answer. The capstones run their own leases and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes for the Act, and what it declines to compute', ['Associate m01', 'Expert m05']);
w('The engine is one ledger function and the rate functions it calls. `computeCashFlow` takes the terms (`cfg`) and three row sets (production, capex, opex) and returns one row a year and a set of KPIs. Under `fiscal_regime` PIA every year is run at 100 percent field level, then every money line is scaled to the working interest share. A refusal is a thrown error whose message states the exact condition that failed (' + ref('refusals') + ').');
w();
const FNS = [
  ['computeCashFlow', 'the whole ledger', 'cfg, prodRows, capexRows, opexRows', 'cashFlowData (one row a year, at the share) and kpis (totals, NPV, take, the framework, pia_notes)'],
  ['deriveOilRoyaltyRate', 'royalty by terrain and volume', 'terrain, liquidsBopd', 'the weighted production royalty rate for crude oil and condensate'],
  ['deriveGasRoyaltyRate', 'gas royalty', 'terrain, inCountrySharePct', 'the gas and NGL royalty rate'],
  ['priceRoyaltyBenchmarks', 'the royalty by price benchmarks', 'year, base', 'the low, middle and high benchmark in USD/bbl'],
  ['derivePriceRoyaltyRate', 'royalty by price', 'fiscalPrice, year, terrain, base', 'the royalty by price rate'],
  ['deriveHctRate', 'the hydrocarbon tax rate', 'terrain, licenseType, marginalPre2021, override, framework, deepOffshoreInterpretation, deepOffshoreCustomRatePct, leaseStatus, newPmlHctRatePct', 'the rate as a fraction'],
  ['computeProductionAllowance', 'the Sixth Schedule production allowance', 'cfg, liquidsBbl, fiscalPrice, priorCumulativeLiquids, framework', 'the allowance and the barrels below and after the new-lease cap'],
  ['capitalAllowanceFraction', 'the capital allowance schedule', 'yearOfLife, framework', 'the fraction of a spend claimed in that year of its life'],
  ['statutoryTetRatePct', 'the tertiary education tax rate', 'year', 'the rate in percent for a year under the Act alone'],
  ['fiscalFrameworkForYear', 'the framework of one year', 'cfg, year', '"pia_only" or "nta_2025"'],
  ['calendarDays', 'the days in a year', 'year', '365 or 366'],
];
FNS.forEach(([n]) => must(`${n} is exported`, typeof E[n] === 'function', typeof E[n]));
table(['function', 'role', 'what it needs', 'what it returns'], FNS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
w();
w(`The terrains the engine accepts, read from the exported \`PIA_TERRAINS\`: ${list(E.PIA_TERRAINS.map((t) => `"${t}"`))}. The first year of assessment under the Nigeria Tax Act 2025, read from \`NTA_FIRST_YEAR\`: ${E.NTA_FIRST_YEAR}.`);
must('four terrains', E.PIA_TERRAINS.length === 4 && Object.isFrozen(E.PIA_TERRAINS), E.PIA_TERRAINS);
must('the first NTA year is 2026', E.NTA_FIRST_YEAR === 2026, E.NTA_FIRST_YEAR);
w();
w('The texts the engine names, read from the exported `PIA_TEXTS` (verbatim):');
w();
table(['key', 'the engine\'s text'], Object.entries(TXT).map(([k, v]) => [`\`${k}\``, v]));
must('PIA_TEXTS names four texts and the read date', Object.keys(TXT).join() === 'pia,nta,regs,fa2023,read_on' && TXT.read_on === '2026-09-26', Object.keys(TXT));
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its source:');
must('the engine source makes no network call, reads no clock and draws no random number', !/\bfetch\x28|XMLHttpRequest|Math\.random|Date\.now|new Date\x28\x29/.test(ENGINE_SRC), 'none');
must('the engine never reads pia_water_depth_m', !/cfg\.pia_water_depth_m|\[.pia_water_depth_m.\]/.test(ENGINE_SRC), 'depth');
w('- It does not read the water depth. `pia_water_depth_m` is carried in the terms and never read; the terrain string decides the royalty and the tax (' + ref('licences') + ').');
w('- It does not model a field lying partly in two terrains, the fiscal oil price the Commission sets, the additional tax at the fiscal price, the split between associated and non-associated gas, exploration and appraisal expensing, the acquisition cost allowance, consolidation across fields, production sharing contracts under the Act, the terms of a lease that has not converted, the non-associated gas credit, or the company-level minimum effective tax test. Each is taught as a concept with its citation (' + ref('concepts') + ') and none is ever graded.');
w('- It decides no open question of the texts. Where the texts leave a rate open the engine takes a stated input with no default and refuses a run without it; where it keeps a default it says so in `kpis.pia_notes` (' + ref('notes') + ').');

/* ============================================================ SECTION 2 */

section('sources', 'The texts, their editions and the date each was read', ['Associate m01 l05', 'Expert m02 l05']);
w('THE RULE THIS COURSE FOLLOWS FOR EVERY ACT, REGULATION AND STATEMENT IT TEACHES. Each one is named with its edition or gazette date and the date it was read. Only publicly available texts are quoted, with their citation. Every rate, threshold, cap and schedule value the engine applies was read from the cited text; a value that could not be sourced is a stated input with no default. Every text below was read on 2026-09-26.');
w();
const SOURCES = [
  ['Petroleum Industry Act 2021 (Act No. 6)', 'Official Gazette No. 142, Vol. 108, Lagos, 27 August 2021; commencement 16 August 2021', 'primary, quoted', 'Official Gazette No. 142, Vol. 108, 27 Aug 2021'],
  ['Petroleum Royalty Regulations 2022 (S.I. No. 73 of 2022, made under PIA s.304(2))', 'Official Gazette No. 205, Vol. 109, Lagos, 22 November 2022', 'primary, quoted', 'Official Gazette No. 205, Vol. 109, 22 Nov 2022'],
  ['Nigeria Tax Act 2025 (Act No. 7)', 'Official Gazette No. 117, Vol. 112, Lagos, 26 June 2025; effective 1 January 2026 (State House statement); re-gazetting ordered in December 2025 and no Certified True Copy read', 'primary, quoted', 'Official Gazette No. 117, Vol. 112, 26 Jun 2025'],
  ['Finance Act 2023', '"Final Signed by PMB", published by the Budget Office of the Federation on 7 June 2023, a scanned copy read page by page; s.26 (tertiary education tax 3 percent), s.9(b) (the two thirds capital allowance restriction), s.30 (effective 1 May 2023)', 'primary, paraphrased (a scan)', '"Final Signed by PMB", published by the Budget Office on 7 Jun 2023'],
  ['Finance Act 2021 (tertiary education tax 2.5 percent)', 'not read; EY and Forvis Mazars Finance Act alerts', 'secondary', 'Finance Act 2021 TET rate of 2.5%: EY and Forvis Mazars'],
  ['Niger-Delta Development Commission (Establishment, etc.) Act 2000 s.14(2)(b), as amended 2017 (3 percent of the total annual budget)', 'not read; Mondaq and Lexology commentary on NDDC v NLNG', 'secondary', 'NDDC Act 2000 s.14(2)(b), "3% of total annual budget": Mondaq and Lexology'],
  ['The Nigeria Tax Act effective date and the re-gazetting order', 'statehouse.gov.ng statement and Arise TV, 27 December 2025', 'secondary', 'NTA effective date and re-gazetting: statehouse.gov.ng and Arise TV'],
];
table(['text', 'edition or date', 'how the course uses it', 'date read'], SOURCES.map(([t, e, u]) => [t, e, u, '2026-09-26']));
SOURCES.forEach(([t, , , frag]) => must(`FINDINGS-pia2021.md records "${t}"`, FINDINGS.includes(frag), frag));
must('FINDINGS records every text as read on 2026-09-26', FINDINGS.includes('## 1. Texts read (all on 2026-09-26)'), 'read date');
w();
w('A SECONDARY SOURCE IS NEVER A HIDDEN DEFAULT. The two values that rest on a secondary source are stated where they are used: the tertiary education tax of 2.5 percent before 2023, and the NDDC levy base of the total annual budget, which the engine takes as the year\'s opex plus capex (' + ref('levies') + ').');
w();
w('LICENSED TEXTS. No licensed text is quoted anywhere in this course. Model contracts sold under licence (for example the AIPN model contracts) are taught by concept only, and no paid commentary is quoted.');
w();
w(`THE ENGINE CARRIES THE SAME EDITIONS IN ITS OWN WORDS (\`PIA_TEXTS\`, ${ref('computes')}), and states the Nigeria Tax Act version in \`kpis.pia_notes\` wherever a year under that Act appears (${ref('notes')}).`);

/* ============================================================ SECTION 3 */

// THE PROVISION MAP. Every provision the course teaches, with whether the
// engine computes it (and where) or the course teaches it as a concept only.
// A "computed" row is asserted by an engine call in the section it names.
const PROVISIONS = [
  // [provision, citation, computed?, engine function or field, section key]
  ['Royalty by terrain and daily rate (the small-field tranches)', 'PIA Seventh Schedule para 10(2) to (4); REGS r.12, r.13', true, 'deriveOilRoyaltyRate; row royalty_rate_liquids', 'tranches'],
  ['Condensate treated as crude oil for royalty', 'PIA Seventh Schedule para 6', true, 'applyPIA liquids revenue', 'tranches'],
  ['Gas and NGL royalty, 5 percent and 2.5 percent in-country', 'PIA Seventh Schedule para 10(6); REGS r.16', true, 'deriveGasRoyaltyRate; row gas_royalty', 'gas'],
  ['Royalty by price and its escalated benchmarks', 'PIA Seventh Schedule para 11(1); REGS r.15 and Schedule', true, 'priceRoyaltyBenchmarks, derivePriceRoyaltyRate; row price_royalty', 'price'],
  ['No royalty by price for frontier acreage', 'PIA Seventh Schedule para 11(2)', true, 'derivePriceRoyaltyRate', 'price'],
  ['What the hydrocarbon tax charges (crude, condensate; gas outside)', 'PIA s.260(1); NTA s.65(2)', true, 'applyPIA liquids-only base', 'hctscope'],
  ['No hydrocarbon tax for deep offshore (under the Act) and frontier', 'PIA s.260(3); NTA s.65(4)', true, 'deriveHctRate', 'hctscope'],
  ['Hydrocarbon tax rates of 30 and 15 percent', 'PIA s.267; NTA s.72', true, 'deriveHctRate; row hct_rate', 'hctscope'],
  ['Deductions in the hydrocarbon tax base (royalties, HCDT, NDDC, levies)', 'PIA s.263(1)(b), (f), (h); NTA s.68(1)', true, 'applyPIA hct_assessable_profit', 'hctbase'],
  ['The cost price ratio limit, carryforward and forfeiture', 'PIA Sixth Schedule para 2; s.266(2)', true, 'applyPIA cpr_cap, cpr_costs_claimed, cpr_deferred_to_next; kpis cpr_forfeited_at_cessation', 'hctbase'],
  ['Loss relief by class of tax', 'PIA s.265(1) to (3); NTA s.70', true, 'applyPIA loss pools', 'cit'],
  ['Production allowance, converted and new leases, the cap and after it', 'PIA Sixth Schedule para 1; NTA Sixth Schedule para 1', true, 'computeProductionAllowance; row production_allowance', 'allowances'],
  ['Capital allowances by the law of each year', 'PIA Fifth Schedule paras 5(2), 17(1); NTA First Schedule Part II paras 4(2), 14(1)', true, 'capitalAllowanceFraction; row depreciation', 'allowances'],
  ['Companies income tax on oil and gas, hydrocarbon tax not deductible', 'PIA s.302(5), (11); NTA s.56(b), s.78(3)(a), s.82(1)', true, 'applyPIA cit_assessable_profit, cit_tax', 'cit'],
  ['The two thirds capital allowance restriction in years before 2026', 'CITA Second Schedule para 24(7) as substituted by Finance Act 2023 s.9(b)', true, 'applyPIA cit_allowance_claimed, cit_allowance_carryforward', 'cit'],
  ['Tertiary education tax by year', 'Finance Act 2023 s.26, s.30; Finance Act 2021 (secondary)', true, 'statutoryTetRatePct; row tet_tax', 'framework'],
  ['The development levy of 4 percent', 'NTA s.59(1), (4)', true, 'row dev_levy_tax', 'framework'],
  ['The framework of each year of assessment', 'NTA commencement (1 January 2026) and s.197', true, 'fiscalFrameworkForYear; row fiscal_framework', 'framework'],
  ['Deep offshore hydrocarbon tax under the NTA (three stated readings)', 'NTA s.65(1), s.72', true, 'deriveHctRate with pia_deep_offshore_hct_interpretation', 'edges'],
  ['No deep offshore or frontier production allowance in NTA years', 'NTA Sixth Schedule para 1(2)', true, 'computeProductionAllowance', 'edges'],
  ['Decommissioning fund deduction and the NTA escrow condition', 'PIA s.263(1)(e), s.302(11)(b)(i); NTA s.86', true, 'row decom_fund_deduction', 'edges'],
  ['The minimum effective tax rate top-up (a labelled project approximation)', 'NTA s.57', true, 'row min_etr_topup (only when switched on)', 'edges'],
  ['Host communities development trust contribution, 3 percent of the preceding year\'s opex', 'PIA s.240(2), s.257', true, 'row hcdt', 'levies'],
  ['The NDDC levy on the total annual budget', 'NDDC Act 2000 s.14(2)(b) (secondary source)', true, 'row nddc', 'levies'],
  ['Working interest: fiscal arithmetic at field level, money at the share', 'PIA s.273(4); NTA s.77(4)', true, 'computeCashFlow working interest scaling', 'take'],
  ['Government take and government cash flow', 'fiscalConventions.js (course wording)', true, 'kpis government_take_pct', 'take'],
  ['A field lying partly in two terrains', 'PIA Seventh Schedule para 10(7); REGS r.14(5), (6)', false, 'not computed', 'concepts'],
  ['The fiscal oil price and the additional tax at the fiscal price', 'PIA Seventh Schedule para 8, s.268; NTA s.73', false, 'not computed (the realised price stands in)', 'concepts'],
  ['Associated and non-associated gas: scope, cost allocation, royalty deduction', 'PIA s.260(1)(b)(ii), s.260(2), s.263(1)(b)', false, 'not computed (stated approximation)', 'concepts'],
  ['Exploration and appraisal expensing, acquisition cost allowance', 'PIA s.263(1)(d), s.266(1)(c); Fifth Schedule para 17(2)', false, 'not computed', 'concepts'],
  ['The election to defer a loss deduction', 'PIA s.265(4)', false, 'not computed', 'concepts'],
  ['Consolidation across fields and terrains', 'PIA s.272; NTA s.76', false, 'not computed', 'concepts'],
  ['Production sharing contracts under the Act (cost limit and profit oil scale)', 'PIA Seventh Schedule para 14', false, 'not computed', 'concepts'],
  ['Voluntary conversion, relinquishment and the conversion deadline', 'PIA ss.92, 93', false, 'not computed (the lease status is a stated input)', 'licences'],
  ['Producing marginal fields converted to a lease', 'PIA s.94', true, 'pia_marginal_field_pre_2021 gives the 15 percent rate', 'licences'],
  ['Leases that do not convert (petroleum profits tax, the old royalty table)', 'PIA s.303(1); NTA s.87(1), Part II', false, 'not computed', 'licences'],
  ['The non-associated gas greenfield credit', 'NTA s.85', false, 'not computed', 'concepts'],
  ['Gas pipeline and utilisation incentives', 'PIA s.302(6); NTA s.80', false, 'not computed', 'concepts'],
  ['Fiscal stabilisation', 'PIA s.305; NTA s.88', false, 'not computed', 'concepts'],
  ['The company-level minimum effective tax test and its denominator', 'NTA s.57(1), (2), (4)', false, 'not computed (the engine\'s top-up is a labelled approximation)', 'concepts'],
  ['Who assesses and collects, and where the money lands', 'PIA s.258(2), s.259; NTA s.59(3)', false, 'not computed', 'institutions'],
];
section('provisions', 'Every provision this course teaches, computed or concept-only', ['Associate m01', 'Expert m05 l04']);
w('THE RULE. A provision the engine computes may be graded, and only on a figure the engine returns. A provision the engine does not compute is taught from its text as a concept, with its citation, and is never in a capstone or a keyed question that needs a number.');
w();
table(['provision', 'citation', 'computed by the engine?', 'where in the engine', 'taught in'], PROVISIONS.map(([p, c, comp, where, k]) => [p, c, comp ? 'computed' : 'concept-only', where, ref(k)]));
w();
const nComp = PROVISIONS.filter((p) => p[2]).length;
w(`${PROVISIONS.length} provisions: ${nComp} computed, ${PROVISIONS.length - nComp} concept-only.`);

/* ============================================================ SECTION 4 */

// A provision table rendered from concepts.json: citation, the course's
// paraphrase and the text verbatim. quote_check.py verifies every quote.
const USED = new Set();
// THE COPY RULE OVER A QUOTATION. The gazettes print em and en dashes; the
// course prints each as a colon and changes nothing else (quote_check.py
// applies the same rule when it compares).
export const dashfix = (q) => q.replace(/\s*[\u2013\u2014]\s*/g, ': ');
const cTable = (ids, status) => {
  table(['citation', 'what it says (the course\'s paraphrase)', 'the text, verbatim', 'in the engine'], ids.map((id) => {
    const c = C(id); USED.add(id);
    return [c.cite, c.paraphrase, `"${dashfix(c.quote)}"`, typeof status === 'function' ? status(id) : status];
  }));
};
section('institutions', 'Who decides, who assesses and collects, and where the money lands', ['Associate m01']);
w('THE INSTITUTIONS. The Act names the Nigerian Upstream Petroleum Regulatory Commission (the Commission), the Nigerian Midstream and Downstream Petroleum Regulatory Authority (the Authority) and the Federal Inland Revenue Service (the Service). None of this is computed by the engine; it is taught from the text and never graded on a number.');
w();
cTable(['pia_federation_account', 'pia_administration_service_hct', 'pia_administration_service_cit', 'pia_administration_commission_royalty', 'pia_price_royalty_nsia',
  'nta_development_levy_rate', 'nta_development_levy_exclusions', 'nta_development_levy_distribution_a_d', 'nta_development_levy_distribution_e_g', 'nta_development_levy_not_hct', 'nta_royalty_collection_service', 'nta_royalty_administration_service_sch7'], 'concept-only');
w();
w('READ TOGETHER: the Service assesses and collects the hydrocarbon tax and companies income tax, the Commission determines and collects royalties under the Act, and money due to Government goes to the Federation Account; under the Nigeria Tax Act 2025 the Service administers royalty (NTA s.89(2) and Seventh Schedule para 1(1)); the royalty by price is credited to the Nigerian Sovereign Investment Authority; the development levy of the Nigeria Tax Act 2025 is shared out by fixed percentages and is not charged on hydrocarbon tax profits.');

/* ============================================================ SECTION 5 */

section('licences', 'Licences, leases, terrains and conversion', ['Associate m02', 'Expert m01']);
w('THE LICENCES. The Act creates three instruments: the petroleum exploration licence, the petroleum prospecting licence and the petroleum mining lease. The engine accepts `pia_license_type` "PML" or "PPL" only (' + ref('refusals') + '); a licence type before the Act (OML, OPL) is refused.');
w();
cTable(['pia_licence_types_pel_ppl', 'pia_licence_type_pml', 'pia_pel_duration', 'pia_ppl_duration', 'pia_pml_duration'], 'concept-only');
w();
w('TERRAINS. The engine takes the terrain as one of four stated strings and never reads the water depth. The Act draws the shallow water line at 200 metres (' + ref('concepts') + ' quotes the terrain rates). A marginal field is not a terrain: it is onshore or in shallow water, and the engine refuses "marginal_field" as a terrain (' + ref('refusals') + ').');
w();
const mf = runG('ekene_marginal_shallow_flag');
w(`A PRODUCING MARGINAL FIELD converted under s.94(1) is a stated flag (\`pia_marginal_field_pre_2021\`) on an onshore or shallow water lease: its hydrocarbon tax rate is ${f6(row(mf, 2026).hct_rate)} and its royalty follows the terrain's tranches (ekene_marginal_shallow_flag, shallow water, 2026: daily rate ${f6(row(mf, 2026).royalty_liquids_bopd)} bopd, liquids royalty rate ${f6(row(mf, 2026).royalty_rate_liquids)}).`);
must('marginal flag: 15 percent and the shallow water tranche rate', row(mf, 2026).hct_rate === 0.15 && row(mf, 2026).royalty_rate_liquids === E.deriveOilRoyaltyRate('shallow_water', row(mf, 2026).royalty_liquids_bopd), 'mf');
w();
w('CONVERSION, RELINQUISHMENT, MARGINAL FIELDS AND LEASES THAT DO NOT CONVERT (concept-only; the engine takes the lease status as a stated input and models converted and new-acreage terms only):');
w();
cTable(['pia_voluntary_conversion', 'pia_conversion_deadline', 'pia_unconverted_terms_continue', 'pia_conversion_40pct_selection', 'pia_relinquishment_unselected',
  'pia_oml_conversion_ppl_terms', 'pia_oml_conversion_pml_terms', 'pia_opl_conversion_ppl_terms', 'pia_opl_conversion_pml_terms',
  'pia_marginal_field_conversion', 'pia_no_new_marginal_fields', 'pia_unconverted_act_not_applicable', 'nta_unconverted_part_not_applicable', 'nta_unconverted_gas_royalty'],
(id) => (id === 'pia_marginal_field_conversion' ? 'the 15 percent rate is computed (the stated flag); the rest is concept-only' : 'concept-only'));
w();
w('READ TOGETHER: a holder of an oil mining lease may convert it; the areas it keeps in development or production become petroleum mining leases on the 30 percent terms, the areas it keeps for appraisal or discovery become petroleum prospecting licences on the 15 percent terms, and unselected areas are relinquished. A lease that does not convert stays on its old terms, outside the Act\'s fiscal Part and outside the engine.');


/* ============================================================ SECTION 6 */

// THE EKENE TEACHING CASES: inputs read from the vendored golden file (the
// golden's expected figures are oracle output and are never printed here; every
// figure below is the engine's). The descriptions are this digest's own and are
// asserted against the inputs.
const DATASET = [
  ['worked_example_inputs_default', 'The single-year worked example: shallow water, converted lease, 2025, 50,000 bopd, a fixed NDDC sum', (c) => c.cfg.pia_terrain === 'shallow_water' && c.prodRows.length === 1 && c.prodRows[0].year === 2025 && c.cfg.pia_nddc_levy_fixed_usd === 15000000],
  ['ekene_alpha_shallow_converted_nta', 'Ekene Alpha: shallow water, converted lease, crude with condensate and associated gas, 2026 to 2032', (c) => c.cfg.pia_terrain === 'shallow_water' && c.prodRows.length === 7 && c.prodRows[0].year === 2026],
  ['ekene_alpha_wi_50', 'Ekene Alpha at a 50 percent working interest', (c) => c.cfg.pia_working_interest_pct === 50],
  ['ekene_onshore_across_2026', 'Onshore converted lease, 2024 to 2028, crossing 1 January 2026', (c) => c.cfg.pia_terrain === 'onshore' && c.prodRows[0].year === 2024 && c.prodRows.length === 5],
  ['ekene_deep_new_60k_conservative', 'Deep offshore lease from new acreage at 60,000 bopd, 2025 to 2027, deep offshore reading conservative_zero', (c) => c.cfg.pia_terrain === 'deep_offshore' && c.cfg.pia_deep_offshore_hct_interpretation === 'conservative_zero'],
  ['ekene_deep_new_60k_aggressive', 'The same deep offshore field, deep offshore reading aggressive_pml_30', (c) => c.cfg.pia_deep_offshore_hct_interpretation === 'aggressive_pml_30'],
  ['ekene_nag_gas_in_country_half', 'A gas field in shallow water, half the gas used in-country, no crude', (c) => c.prodRows.every((r) => r.oil_bbl === 0) && c.cfg.pia_gas_in_country_share_pct === 50],
  ['ekene_onshore_new_cap_crossing', 'A new onshore lease with 49 MMbbl produced before 2026, crossing the 50 MMbbl allowance cap; new-lease rate stated at 15', (c) => c.cfg.pia_prior_cumulative_oil_bbl === 49000000 && c.cfg.pia_new_pml_hct_rate_pct === 15],
  ['ekene_condensate_price_royalty_regs', 'Crude at 95 and condensate at 88 USD/bbl in 2025 on the Regulations base', (c) => c.cfg.oil_price_usd_bbl === 95 && c.cfg.condensate_price_usd_bbl === 88 && c.cfg.pia_price_royalty_base === undefined],
  ['ekene_condensate_price_royalty_act', 'The same year on the Act base', (c) => c.cfg.pia_price_royalty_base === 'act_2020'],
  ['ekene_cpr_binding_forfeiture', 'Shallow water, heavy cost on thin revenue, 2024 to 2026: the cost price ratio binds, carries and is forfeited', (c) => c.cfg.base_year === 2024 && c.prodRows.length === 3],
  ['ekene_sinking_fund_nta_escrow_met', 'A decommissioning fund in NTA years, escrow condition met', (c) => c.cfg.pia_decom_escrow_condition_met === true],
  ['ekene_sinking_fund_nta_escrow_not_met', 'The same fund, escrow condition not met', (c) => c.cfg.pia_decom_escrow_condition_met === false],
  ['ekene_sinking_fund_pia_years', 'A decommissioning fund in years under the Act alone (2024 and 2025)', (c) => c.cfg.base_year === 2024 && c.cfg.abandonment_funding_mode === 'sinking_fund'],
  ['ekene_min_etr_nta_only', 'The minimum effective tax rate switched on, 2025 and 2026, at a stated 85 percent so the top-up shows', (c) => c.cfg.pia_apply_minimum_etr === true && c.cfg.pia_minimum_etr_pct === 85],
  ['ekene_marginal_shallow_flag', 'A producing marginal field converted under s.94(1), shallow water, 2026, about 20,000 bopd', (c) => c.cfg.pia_marginal_field_pre_2021 === true],
  ['ekene_frontier', 'Frontier acreage at 120 USD/bbl, 2026', (c) => c.cfg.pia_terrain === 'frontier' && c.cfg.oil_price_usd_bbl === 120],
  ['ekene_nddc_opex_base', 'The NDDC levy on the stated opex base', (c) => c.cfg.pia_nddc_levy_base === 'opex'],
  ['ekene_force_pia_2027', 'A 2027 ledger forced to the terms of the Act alone', (c) => c.cfg.pia_under_nta_2025_override === 'force_pia'],
];
section('dataset', 'The Ekene teaching cases', ['Associate m02 l05', 'Professional m06', 'Expert m06']);
w('Every case in this course is an Ekene synthetic case (ours), read from the vendored golden file test-data/economics/goldens/pia2021_cases.json. The golden file also carries expected figures from the stdlib oracle; those are provenance and are never printed here. Every figure a section prints is the engine\'s own return on the case inputs.');
w();
DATASET.forEach(([n, , check]) => must(`dataset: ${n} is what this digest says it is`, GC[n] && check(GC[n]), n));
must('every golden case is described', GOLD.cases.every((c) => DATASET.some(([n]) => n === c.name)), GOLD.cases.map((c) => c.name).join(','));
const terms = (c) => {
  const k = c.cfg;
  const bits = [`terrain ${k.pia_terrain}`, `licence ${k.pia_license_type}`, `lease ${k.pia_lease_status}`];
  if (k.pia_marginal_field_pre_2021 === true) bits.push('marginal field converted under s.94(1)');
  if (k.pia_new_pml_hct_rate_pct !== undefined) bits.push(`new-lease rate stated ${k.pia_new_pml_hct_rate_pct}`);
  if (k.pia_deep_offshore_hct_interpretation) bits.push(`deep offshore reading ${k.pia_deep_offshore_hct_interpretation}`);
  if (k.pia_working_interest_pct !== undefined) bits.push(`working interest ${k.pia_working_interest_pct}`);
  if (k.pia_gas_in_country_share_pct !== undefined) bits.push(`gas in-country ${k.pia_gas_in_country_share_pct} percent`);
  if (k.pia_prior_cumulative_oil_bbl) bits.push(`prior production ${k.pia_prior_cumulative_oil_bbl} bbl`);
  if (k.pia_price_royalty_base) bits.push(`price royalty base ${k.pia_price_royalty_base}`);
  if (k.pia_nddc_levy_base) bits.push(`NDDC base ${k.pia_nddc_levy_base}`);
  if (k.pia_nddc_levy_fixed_usd !== undefined && k.pia_nddc_levy_fixed_usd !== null) bits.push(`NDDC fixed ${k.pia_nddc_levy_fixed_usd} USD`);
  if (k.pia_under_nta_2025_override && k.pia_under_nta_2025_override !== 'auto') bits.push(`framework ${k.pia_under_nta_2025_override}`);
  if (k.abandonment_funding_mode) bits.push(`decommissioning fund ${k.abandonment_cost_usd} USD`);
  if (k.pia_decom_escrow_condition_met !== undefined) bits.push(`escrow condition ${k.pia_decom_escrow_condition_met ? 'met' : 'not met'}`);
  if (k.pia_apply_minimum_etr) bits.push(`minimum ETR on at ${k.pia_minimum_etr_pct} percent`);
  return bits.join('; ');
};
table(['case (golden input)', 'what it is', 'years', 'oil / condensate / gas price', 'terms'], DATASET.map(([n, what]) => {
  const c = GC[n];
  const ys = c.prodRows.map((r) => r.year);
  return [n, what, `${Math.min(...ys)} to ${Math.max(...ys)}`, `${c.cfg.oil_price_usd_bbl} / ${c.cfg.condensate_price_usd_bbl ?? 'none'} / ${c.cfg.gas_price_usd_mscf ?? 'none'}`, terms(c)];
}));
w();
w('Every case keeps its prices, opex and capex flat in money of the day (every escalator 0), discounts at 10 percent nominal, and states no hydrocarbon tax override, no tertiary education tax rate and no capital allowance life, so the engine applies the statutory values. Each section prints the production, capex and opex rows of the case it uses.');
DATASET.forEach(([n]) => { const k = GC[n].cfg; must(`${n}: flat, 10 percent nominal, no statutory override`, ['oil_price_escalator_pct', 'opex_escalator_pct', 'capex_escalator_pct'].every((e) => (k[e] ?? 0) === 0) && k.discount_rate_pct === 10 && (k.pia_hct_rate_override_pct ?? null) === null && k.pia_tet_rate_pct === undefined, n); });
const rowsTable = (n) => {
  const c = GC[n];
  table(['year', 'oil bbl (golden input)', 'condensate bbl', 'gas Mscf', 'capex USD', 'opex USD'], c.prodRows.map((r) => [S(r.year), vol(r.oil_bbl), vol(r.condensate_bbl ?? 0), vol(r.gas_mscf ?? 0),
    vol((c.capexRows.find((x) => x.year === r.year) || { amount_usd: 0 }).amount_usd), vol((c.opexRows.find((x) => x.year === r.year) || { total_opex_usd: 0 }).total_opex_usd)]));
};

/* ============================================================ SECTION 7 */

section('refusals', 'Every refusal, with the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Professional m02', 'Expert m03']);
w('A refusal is a thrown error. The message states the exact condition that failed and, where the texts leave a value open, why there is no default. Each row below is a stated bad input handed to the engine; the message is the engine\'s, verbatim. A result returned with a note in `kpis.pia_notes` is a result, never a refusal.');
w();
const ALPHA = GC.ekene_alpha_shallow_converted_nta;
const alphaWith = (patch) => () => runCfg({ ...ALPHA.cfg, ...patch }, ALPHA);
const DEEP = GC.ekene_deep_new_60k_conservative;
const deepWith = (patch) => () => runCfg({ ...DEEP.cfg, ...patch }, DEEP);
const SINK = GC.ekene_sinking_fund_nta_escrow_met;
const noInterp = (() => { const k = clone(DEEP.cfg); delete k.pia_deep_offshore_hct_interpretation; return k; })();
const noNewRate = (() => { const k = clone(GC.ekene_onshore_new_cap_crossing.cfg); delete k.pia_new_pml_hct_rate_pct; return k; })();
const noEscrow = (() => { const k = clone(SINK.cfg); delete k.pia_decom_escrow_condition_met; return k; })();
const PROBES = [
  ['computeCashFlow', 'pia_terrain "marginal_field"', alphaWith({ pia_terrain: 'marginal_field' })],
  ['computeCashFlow', 'pia_terrain "offshore"', alphaWith({ pia_terrain: 'offshore' })],
  ['computeCashFlow', 'pia_license_type "OML"', alphaWith({ pia_license_type: 'OML' })],
  ['computeCashFlow', 'pia_lease_status "renewed"', alphaWith({ pia_lease_status: 'renewed' })],
  ['computeCashFlow', 'a new-acreage onshore lease with no pia_new_pml_hct_rate_pct', () => runCfg(noNewRate, GC.ekene_onshore_new_cap_crossing)],
  ['computeCashFlow', 'pia_new_pml_hct_rate_pct 20', () => runCfg({ ...noNewRate, pia_new_pml_hct_rate_pct: 20 }, GC.ekene_onshore_new_cap_crossing)],
  ['computeCashFlow', 'a deep offshore NTA year with no pia_deep_offshore_hct_interpretation', () => runCfg(noInterp, DEEP)],
  ['computeCashFlow', 'pia_deep_offshore_hct_interpretation "custom" with no custom rate', deepWith({ pia_deep_offshore_hct_interpretation: 'custom' })],
  ['computeCashFlow', 'pia_hct_rate_override_pct 150', alphaWith({ pia_hct_rate_override_pct: 150 })],
  ['computeCashFlow', 'pia_capex_recovery_years 4', alphaWith({ pia_capex_recovery_years: 4 })],
  ['computeCashFlow', 'pia_nddc_levy_base "budget"', alphaWith({ pia_nddc_levy_base: 'budget' })],
  ['computeCashFlow', 'an NTA-year fund contribution with no pia_decom_escrow_condition_met', () => runCfg(noEscrow, SINK)],
  ['computeCashFlow', 'pia_gas_in_country_share_pct 120', alphaWith({ pia_gas_in_country_share_pct: 120 })],
  ['computeCashFlow', 'pia_price_royalty_base "act_2021"', alphaWith({ pia_price_royalty_base: 'act_2021' })],
  ['computeCashFlow', 'pia_under_nta_2025_override "nta"', alphaWith({ pia_under_nta_2025_override: 'nta' })],
  ['computeCashFlow', 'pia_legacy_pre_audit "yes"', alphaWith({ pia_legacy_pre_audit: 'yes' })],
  ['computeCashFlow', 'no production rows', () => E.computeCashFlow({ cfg: clone(ALPHA.cfg), prodRows: [], capexRows: [], opexRows: [] })],
  ['deriveOilRoyaltyRate', 'a daily rate of -1', () => E.deriveOilRoyaltyRate('onshore', -1)],
  ['deriveGasRoyaltyRate', 'an in-country share of 100.5', () => E.deriveGasRoyaltyRate('onshore', 100.5)],
  ['priceRoyaltyBenchmarks', 'base "act"', () => E.priceRoyaltyBenchmarks(2025, 'act')],
];
const REFUSED = PROBES.map(([fn, what, f]) => [`\`${fn}\``, what, refusal(`${fn}: ${what}`, f)]);
table(['function', 'stated bad input', 'the engine\'s message, verbatim'], REFUSED);
must('no refusal message carries an em or en dash', REFUSED.every((r) => r[2] && !/[–—]/.test(r[2])), 'dash');
w();
w(`${PROBES.length} refusals. Four rules the table shows:`);
w('- A value the texts leave open is a stated input with no default, and a run without it is refused with the reason: the hydrocarbon tax rate of a lease granted out of new acreage onshore or in shallow water (15 or 30), the deep offshore reading in a year under the Nigeria Tax Act 2025, and the escrow condition for a decommissioning fund in such a year.');
w('- A marginal field is not a terrain. The refusal names the two terrains a marginal field can be in and the flag that gives a converted producing marginal field its rate.');
w('- The capital allowance life is fixed by the texts at five years, so any other life is refused.');
w('- A refusal message is course content: quote it in a blockquote as the engine\'s own words. Two messages end with a sentence about `pia_legacy_pre_audit`, a platform switch that reproduces runs made before the engine followed the texts; the course does not teach that switch, and a lesson quoting one of those two messages quotes its first sentences only.');
must('the two refusals that name the platform switch are the marginal field and the recovery life', REFUSED.filter((r) => /pia_legacy_pre_audit to true/.test(r[2])).map((r) => r[1]).join('|') === 'pia_terrain "marginal_field"|pia_capex_recovery_years 4', REFUSED.filter((r) => /pia_legacy_pre_audit/.test(r[2])).map((r) => r[1]).join('|'));

/* ============================================================ SECTION 8 */

section('graded', 'What is graded, where the practicals run, and what is never graded', ['Associate m06', 'Professional m06', 'Expert m06']);
w('EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED TERMS AND ROWS. A capstone field, a question key and a panel figure are each read from `computeCashFlow` or one of the rate functions of ' + ref('computes') + ', on terms and rows written down in advance. The same inputs give the same number on any machine, so there is exactly one right answer.');
w();
w('THE PRACTICALS RUN IN THE COURSE\'S OWN CALCULATOR PANELS. This is an engine course with no Suite app. Each tier has a calculator panel that calls this same vendored engine: the royalty calculator (Associate), the hydrocarbon tax calculator (Professional) and the ledger calculator (Expert). A learner types or pastes their own terms and rows; the panel prints what the engine returns, every refusal in the engine\'s own words and every note in `kpis.pia_notes`.');
w();
w('THE OPEN READINGS ARE NEVER GRADED. The texts leave three questions open, and the course teaches each as an open question: the royalty by price base year (the Act starts the benchmarks in 2020, the Regulations in 2021; ' + ref('price') + '), the hydrocarbon tax rate of a lease granted out of new acreage onshore or in shallow water (15 or 30; ' + ref('hctscope') + '), and the deep offshore hydrocarbon tax under the Nigeria Tax Act 2025 (three readings; ' + ref('edges') + '). A graded figure is the same under every reading of all three, and any figure that depends on the royalty by price names the Regulations base, which is the engine default.');
w();
w('CONCEPT-ONLY PROVISIONS ARE NEVER GRADED ON A NUMBER. The concept-only rows of ' + ref('provisions') + ' are taught from their text and kept out of every capstone.');
w();
w('EVERY MONEY FIGURE IS AT THE WORKING INTEREST SHARE. The engine runs the royalty tranches, the allowance cap and every rate at field level and then scales every money line to the share (' + ref('take') + '). A graded money figure is the share.');

/* ---------------------------------------------------------- ledger tables */
const ROY_COLS = [
  ['year', (d) => S(d.year)], ['framework', (d) => d.fiscal_framework], ['liquids bopd', (d) => f6(d.royalty_liquids_bopd)],
  ['liquids royalty rate', (d) => f6(d.royalty_rate_liquids)], ['liquids royalty', (d) => f6(d.liquids_production_royalty)],
  ['gas royalty rate', (d) => f6(d.royalty_rate_gas)], ['gas royalty', (d) => f6(d.gas_royalty)],
  ['price royalty rate (oil)', (d) => f6(d.price_royalty_rate_oil)], ['price royalty', (d) => f6(d.price_royalty)], ['total royalty', (d) => f6(d.royalty)],
];
const HCT_COLS = [
  ['year', (d) => S(d.year)], ['gross revenue', (d) => f6(d.gross_revenue)], ['HCDT', (d) => f6(d.hcdt)], ['NDDC', (d) => f6(d.nddc)],
  ['CPR cap', (d) => f6(d.cpr_cap)], ['CPR claimed', (d) => f6(d.cpr_costs_claimed)], ['CPR carried out', (d) => f6(d.cpr_deferred_to_next)],
  ['HCT assessable profit', (d) => f6(d.hct_assessable_profit)], ['production allowance', (d) => f6(d.production_allowance)],
  ['HCT chargeable profit', (d) => f6(d.hct_chargeable_profit)], ['HCT rate', (d) => f6(d.hct_rate)], ['HCT', (d) => f6(d.hct_tax)],
];
const CIT_COLS = [
  ['year', (d) => S(d.year)], ['framework', (d) => d.fiscal_framework], ['capital allowance', (d) => f6(d.depreciation)],
  ['CIT assessable profit', (d) => f6(d.cit_assessable_profit)], ['CIT allowance claimed', (d) => f6(d.cit_allowance_claimed)],
  ['CIT allowance carried', (d) => f6(d.cit_allowance_carryforward)], ['CIT', (d) => f6(d.cit_tax)], ['TET rate percent', (d) => f6(d.tet_rate_pct)],
  ['TET', (d) => f6(d.tet_tax)], ['development levy', (d) => f6(d.dev_levy_tax)], ['total tax', (d) => f6(d.tax)], ['net cash flow', (d) => f6(d.net_cash_flow)],
];
const ledger = (r, cols) => table(cols.map((c) => c[0]), r.cashFlowData.map((d) => cols.map((c) => c[1](d))));
const TERRAINS = E.PIA_TERRAINS;

/* ============================================================ SECTION 9 */

section('tranches', 'Royalty by terrain and daily rate: the small-field tranches', ['Associate m03', 'Professional m01']);
w('THE RULE THE ENGINE APPLIES (`deriveOilRoyaltyRate`). Onshore and shallow water: the first 5,000 bopd at 5 percent, the next 5,000 bopd at 7.5 percent, everything above 10,000 bopd at the terrain rate (15 percent onshore, 12.5 percent in shallow water), as one weighted average rate on the whole volume. Deep offshore: 5 percent up to and including 50,000 bopd and 7.5 percent on the share above, as one weighted average. Frontier: 7.5 percent at every rate. The rate applies to the value of crude oil plus condensate (condensate counts as crude oil for royalty).');
w();
const EDGES = [1, 4999, 5000, 5001, 7500, 9999, 10000, 10001, 20000, 49999, 50000, 50001, 60000, 120000];
w('THE TRANCHE BOUNDARY TABLE. The rate at each daily rate, per terrain (engine calls; the daily rate is stated):');
w();
table(['liquids bopd (stated)', ...TERRAINS], EDGES.map((b) => [S(b), ...TERRAINS.map((t) => f6(E.deriveOilRoyaltyRate(t, b)))]));
must('onshore and shallow water at 5,000 bopd are exactly 5 percent', E.deriveOilRoyaltyRate('onshore', 5000) === 0.05 && E.deriveOilRoyaltyRate('shallow_water', 5000) === 0.05, 'r5000');
must('onshore and shallow water at 10,000 bopd are exactly 6.25 percent', E.deriveOilRoyaltyRate('onshore', 10000) === 0.0625 && E.deriveOilRoyaltyRate('shallow_water', 10000) === 0.0625, 'r10000');
must('deep offshore at 50,000 bopd is exactly 5 percent', E.deriveOilRoyaltyRate('deep_offshore', 50000) === 0.05, 'r50000');
must('frontier is 7.5 percent at every rate', EDGES.every((b) => E.deriveOilRoyaltyRate('frontier', b) === 0.075), 'frontier');
must('onshore and shallow water agree up to 10,000 bopd and part above it', EDGES.every((b) => (b <= 10000) === (E.deriveOilRoyaltyRate('onshore', b) === E.deriveOilRoyaltyRate('shallow_water', b))), 'agree');
w();
const r10b = (5000 * 0.05 + (10000 - 5000) * 0.075) / 10000;
const r10c = (5000 * 0.05 + 5000 * 0.075 + (10000 - 10000) * 0.15) / 10000;
must('at exactly 10,000 bopd the r.13(2)(b) and (c) formulas agree with the engine', r10b === E.deriveOilRoyaltyRate('onshore', 10000) && r10c === r10b, `${r10b} ${r10c}`);
w(`THE REGULATIONS LEAVE EXACTLY 10,000 BOPD BETWEEN TWO FORMULAS. r.13(2)(b) covers "less than 10,000bopd" and r.13(2)(c) and (d) cover "greater than 10,000bopd" (${ref('concepts')} quotes both). At exactly 10,000 bopd both formulas give ${f6(r10b)} (derived from the stated tranches), which is what the engine returns, so the gap moves no figure.`);
w();
w(`Read at the three edges: at 5,000 bopd onshore and shallow water pay exactly ${f6(100 * E.deriveOilRoyaltyRate('onshore', 5000))} percent (the first tranche includes its edge); at 10,000 bopd both pay exactly ${f6(100 * E.deriveOilRoyaltyRate('onshore', 10000))} percent, the average of the two small-field tranches; deep offshore pays exactly ${f6(100 * E.deriveOilRoyaltyRate('deep_offshore', 50000))} percent at 50,000 bopd and above it only the barrels past 50,000 pay 7.5 percent. Onshore and shallow water pay the same rate at or below 10,000 bopd and part above it, where the terrain rate enters.`);
w();
w('THE DAILY RATE THE TRANCHES READ. The engine divides the year\'s crude oil plus condensate by the calendar days of the year (`calendarDays`), and prints it on every row as `royalty_liquids_bopd`.');
w();
table(['year (stated)', 'calendar days'], [2024, 2025, 2026, 2027, 2028].map((y) => [S(y), S(E.calendarDays(y))]));
must('2024 and 2028 are 366 days, the others 365', E.calendarDays(2024) === 366 && E.calendarDays(2028) === 366 && E.calendarDays(2025) === 365, 'days');
w();
const alpha = runG('ekene_alpha_shallow_converted_nta');
w('On Ekene Alpha (shallow water, converted lease), rows (golden input):');
w();
rowsTable('ekene_alpha_shallow_converted_nta');
w();
w('The royalty lines the engine returns:');
w();
ledger(alpha, ROY_COLS);
alpha.cashFlowData.forEach((d) => {
  const src = ALPHA.prodRows.find((x) => x.year === d.year);
  must(`Alpha ${d.year}: the daily rate is crude plus condensate over the calendar days`, d.royalty_liquids_bopd === (src.oil_bbl + src.condensate_bbl) / E.calendarDays(d.year), d.royalty_liquids_bopd);
  must(`Alpha ${d.year}: the liquids royalty rate is the tranche rate at that daily rate`, d.royalty_rate_liquids === E.deriveOilRoyaltyRate('shallow_water', d.royalty_liquids_bopd), d.royalty_rate_liquids);
});
must('Alpha: 2026 to 2029 sit between 5,000 and 10,000 bopd and 2030 to 2032 at or below 5,000', alpha.cashFlowData.every((d) => (d.year <= 2029 ? d.royalty_liquids_bopd > 5000 && d.royalty_liquids_bopd < 10000 : d.royalty_liquids_bopd <= 5000 && d.royalty_rate_liquids === 0.05)), 'band');
w();
w('Alpha sits between 5,000 and 10,000 bopd from 2026 to 2029, so each of those years pays a weighted rate between the table\'s 5,000 and 10,000 bopd rates that falls as the field declines; from 2030 it is at or below 5,000 bopd and pays exactly 5 percent. The regulations work month by month over the days oil was produced; the engine\'s annual reading is stated in `kpis.pia_notes` (' + ref('notes') + ').');

/* ============================================================ SECTION 10 */

section('gas', 'Gas and NGL royalty, and gas used in-country', ['Associate m03', 'Expert m04']);
w('THE RULE THE ENGINE APPLIES (`deriveGasRoyaltyRate`). Gas and natural gas liquids pay 5 percent of their value, and gas produced and used in-country pays 2.5 percent. The in-country share is a stated input (`pia_gas_in_country_share_pct`, 0 to 100, default 0), and the rate is the share-weighted blend. Every terrain pays the same gas rate.');
w();
const SHARES = [0, 25, 40, 50, 60, 100];
table(['in-country share percent (stated)', ...TERRAINS], SHARES.map((s) => [S(s), ...TERRAINS.map((t) => f6(E.deriveGasRoyaltyRate(t, s)))]));
must('the gas rate is 5 percent at share 0 and 2.5 percent at share 100 in every terrain', TERRAINS.every((t) => E.deriveGasRoyaltyRate(t, 0) === 0.05 && E.deriveGasRoyaltyRate(t, 100) === 0.025), 'ends');
must('every terrain pays the same gas rate', SHARES.every((s) => new Set(TERRAINS.map((t) => E.deriveGasRoyaltyRate(t, s))).size === 1), 'same');
w();
const nag = runG('ekene_nag_gas_in_country_half');
w('A gas field with no crude oil (ekene_nag_gas_in_country_half, half the gas used in-country), rows (golden input):');
w();
rowsTable('ekene_nag_gas_in_country_half');
w();
ledger(nag, ROY_COLS);
w();
table(['year', 'CPR cap', 'HCT chargeable profit', 'HCT', 'CIT assessable profit', 'CIT'], nag.cashFlowData.map((d) => [S(d.year), f6(d.cpr_cap), f6(d.hct_chargeable_profit), f6(d.hct_tax), f6(d.cit_assessable_profit), f6(d.cit_tax)]));
must('the gas field pays a gas royalty rate that prints as 3.750000 percent', nag.cashFlowData.every((d) => Math.abs(d.royalty_rate_gas - 0.0375) < 1e-15), nag.cashFlowData[0].royalty_rate_gas);
must('the gas field pays no hydrocarbon tax and has a CPR cap of 0', nag.cashFlowData.every((d) => d.hct_tax === 0 && d.cpr_cap === 0), 'hct');
must('the gas field pays companies income tax', nag.cashFlowData.some((d) => d.cit_tax > 0), 'cit');
w();
w(`With half the gas used in-country the rate prints as ${f6(row(nag, 2026).royalty_rate_gas)}, half of it at 5 percent and half at 2.5 percent.` + ' The field has no crude oil or condensate, so the cost price ratio cap is 0 and there is no hydrocarbon tax; companies income tax is charged on the gas profit.');

/* ============================================================ SECTION 11 */

section('price', 'Royalty by price and its escalated benchmarks', ['Associate m04']);
w('THE RULE THE ENGINE APPLIES (`priceRoyaltyBenchmarks`, `derivePriceRoyaltyRate`). A royalty by price is charged on the value of crude oil and of condensate, each at its own price: 0 at or below the low benchmark, 5 percent at the middle benchmark, 10 percent at or above the high benchmark, linear between. Frontier acreage pays none. The benchmarks start at 50, 100 and 150 USD/bbl and each rises by 2 percent of the previous year\'s benchmark every 1 January, rounded to whole cents year by year.');
w();
w('THE BASE YEAR IS AN OPEN QUESTION. The Regulations\' Schedule applies 50, 100 and 150 to 2021 and escalates from 1 January 2022 (`regulations_2021`, the engine default). The Act\'s own words apply the same levels to 2020 and escalate from 1 January 2021 (`act_2020`). The engine follows the Regulations unless told otherwise and states the conflict in `kpis.pia_notes`. The course teaches both and grades neither against the other.');
w();
const BYEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];
table(['year', 'low (Regulations base)', 'middle', 'high', 'low (Act base)', 'middle', 'high'], BYEARS.map((y) => {
  const r = E.priceRoyaltyBenchmarks(y, 'regulations_2021'); const a = E.priceRoyaltyBenchmarks(y, 'act_2020');
  return [S(y), f6(r.low), f6(r.mid), f6(r.high), f6(a.low), f6(a.mid), f6(a.high)];
}));
must('the Regulations base holds 50/100/150 through 2021 and the Act base through 2020', ['low', 'mid', 'high'].every((k, i) => E.priceRoyaltyBenchmarks(2021)[k] === [50, 100, 150][i] && E.priceRoyaltyBenchmarks(2020, 'act_2020')[k] === [50, 100, 150][i]), 'base');
must('the Act base in any year equals the Regulations base one year later', BYEARS.slice(1).every((y) => JSON.stringify(E.priceRoyaltyBenchmarks(y, 'act_2020')) === JSON.stringify(E.priceRoyaltyBenchmarks(y + 1))), 'shift');
must('2023 middle benchmark is 104.04 on the Regulations base', E.priceRoyaltyBenchmarks(2023).mid === 104.04, E.priceRoyaltyBenchmarks(2023).mid);
w();
w('Read down the table: the Act base in any year equals the Regulations base one year later (checked for every year printed). Before its base year each base keeps 50, 100 and 150.');
w();
w('THE REGULATIONS\' OWN TABLE. The Schedule prints the middle column as 102.00, 104.00, 106.00, 108.00 and 110.00 for 2022 to 2026, which does not follow its own 2 percent rule; the engine applies the rule (' + ref('notes') + ' quotes the engine\'s note).');
w();
const PRICES = [50, 54.12, 75, 80, 95, 108.24, 120, 162.36, 170];
w('The rate at stated prices in 2025, on each base (onshore; every terrain but frontier pays the same):');
w();
table(['price USD/bbl (stated)', 'rate, Regulations base', 'rate, Act base'], PRICES.map((p) => [f6(p), f6(E.derivePriceRoyaltyRate(p, 2025, 'onshore')), f6(E.derivePriceRoyaltyRate(p, 2025, 'onshore', 'act_2020'))]));
must('every terrain but frontier pays the same royalty by price', PRICES.every((p) => ['shallow_water', 'deep_offshore'].every((t) => E.derivePriceRoyaltyRate(p, 2025, t) === E.derivePriceRoyaltyRate(p, 2025, 'onshore')) && E.derivePriceRoyaltyRate(p, 2025, 'frontier') === 0), 'terrain');
must('at 54.12 in 2025 (the Regulations low) the rate is 0, at 108.24 exactly 5 percent, at 162.36 exactly 10 percent', E.derivePriceRoyaltyRate(54.12, 2025, 'onshore') === 0 && E.derivePriceRoyaltyRate(108.24, 2025, 'onshore') === 0.05 && E.derivePriceRoyaltyRate(162.36, 2025, 'onshore') === 0.1, 'edges');
must('at 170 both bases give 10 percent; at 50 both give 0', E.derivePriceRoyaltyRate(170, 2025, 'onshore', 'act_2020') === 0.1 && E.derivePriceRoyaltyRate(170, 2025, 'onshore') === 0.1 && E.derivePriceRoyaltyRate(50, 2025, 'onshore', 'act_2020') === 0, 'both');
w();
w('At or above the high benchmark of both bases, and at or below the low benchmark of both, the two readings give the same rate; between them they differ.');
w();
const ACT_EX = { price: 75, year: 2020 }; // the Act's own example (text, Seventh Schedule para 11(1)), quoted in the concepts section
const actEx = E.derivePriceRoyaltyRate(ACT_EX.price, ACT_EX.year, 'onshore', 'act_2020');
const actExRegs = E.derivePriceRoyaltyRate(ACT_EX.price, ACT_EX.year, 'onshore');
w(`THE ACT\'S OWN EXAMPLE. The Act says that if in ${ACT_EX.year} the price is ${ACT_EX.price} USD/bbl, the royalty by price is 2.5 percent (${ref('concepts')} quotes it). The engine on the Act base returns ${f6(actEx)} at ${ACT_EX.price} USD/bbl in ${ACT_EX.year}, and on the Regulations base, which keeps the 2021 levels for 2020, also ${f6(actExRegs)}.`);
must('the Act example: 2.5 percent at 75 in 2020 on both bases', actEx === 0.025 && actExRegs === 0.025, `${actEx} ${actExRegs}`);
w();
const regs = runG('ekene_condensate_price_royalty_regs');
const act = runG('ekene_condensate_price_royalty_act');
w(`Each stream at its own price: crude at ${GC.ekene_condensate_price_royalty_regs.cfg.oil_price_usd_bbl} and condensate at ${GC.ekene_condensate_price_royalty_regs.cfg.condensate_price_usd_bbl} USD/bbl in 2025, rows (golden input):`);
w();
rowsTable('ekene_condensate_price_royalty_regs');
w();
table(['base', 'oil rate', 'condensate rate', 'royalty by price', 'total royalty'], [['Regulations (2021)', regs], ['Act (2020)', act]].map(([b, r]) => { const d = row(r, 2025); return [b, f6(d.price_royalty_rate_oil), f6(d.price_royalty_rate_condensate), f6(d.price_royalty), f6(d.royalty)]; }));
must('the two streams pay different rates', row(regs, 2025).price_royalty_rate_oil !== row(regs, 2025).price_royalty_rate_condensate, 'streams');
must('the two bases give different royalty by price here', row(regs, 2025).price_royalty !== row(act, 2025).price_royalty, 'bases');
w();
const fr = runG('ekene_frontier');
w(`Frontier acreage at ${GC.ekene_frontier.cfg.oil_price_usd_bbl} USD/bbl in 2026 (ekene_frontier) pays a royalty by price of ${f6(row(fr, 2026).price_royalty)} and a liquids royalty rate of ${f6(row(fr, 2026).royalty_rate_liquids)}.`);
must('frontier pays no royalty by price', row(fr, 2026).price_royalty === 0 && row(fr, 2026).royalty_rate_liquids === 0.075, 'frontier');

/* ============================================================ SECTION 12 */

section('stack', 'The instruments stacked on one year, and which base each reads', ['Associate m05', 'Associate m06']);
w('THE ORDER THE ENGINE APPLIES THEM IN ONE YEAR. Royalty (production royalty on liquids and gas, and the royalty by price) comes off revenue first. HCDT and the NDDC levy are computed on their own bases. The hydrocarbon tax is charged on the crude oil and condensate profit after royalties, the costs the cost price ratio lets through, HCDT, NDDC, the capital allowance and the production allowance. Companies income tax is charged separately on the whole oil and gas profit and does not deduct the hydrocarbon tax. The tertiary education tax (a year under the Act alone) or the development levy (a year under the Nigeria Tax Act 2025) is charged on the companies income tax assessable profit.');
w();
table(['instrument', 'base it reads', 'citation', 'engine field'], [
  ['production royalty, liquids', 'value of crude oil plus condensate, at the tranche rate', 'PIA Seventh Schedule para 10', 'liquids_production_royalty'],
  ['production royalty, gas', 'value of gas and NGL, at 5 or 2.5 percent', 'PIA Seventh Schedule para 10(6)', 'gas_royalty'],
  ['royalty by price', 'value of crude oil and of condensate, each at its own price', 'PIA Seventh Schedule para 11', 'price_royalty'],
  ['HCDT contribution', '3 percent of the preceding year\'s opex', 'PIA s.240(2)', 'hcdt'],
  ['NDDC levy', '3 percent of the total annual budget (opex plus capex)', 'NDDC Act 2000 s.14(2)(b) (secondary source)', 'nddc'],
  ['hydrocarbon tax', 'crude and condensate profit after royalties, capped costs, HCDT, NDDC and allowances', 'PIA ss.260, 263, 267; NTA ss.65, 68, 72', 'hct_tax'],
  ['companies income tax', 'oil and gas profit after royalties, opex, HCDT, NDDC and its own capital allowance', 'PIA s.302; NTA s.56(b), s.78, s.82', 'cit_tax'],
  ['tertiary education tax', 'companies income tax assessable profit, in years under the Act alone', 'Finance Act 2023 s.26', 'tet_tax'],
  ['development levy', 'companies income tax assessable profit, in years under the Nigeria Tax Act 2025', 'NTA s.59(1)', 'dev_levy_tax'],
]);
w();
const we = runG('worked_example_inputs_default');
const wr = row(we, 2025);
w('ONE YEAR END TO END: the worked example inputs (golden input), shallow water, converted lease, 2025, a year under the Act alone. Rows:');
w();
rowsTable('worked_example_inputs_default');
w();
w(`Stated in the golden input: oil at ${GC.worked_example_inputs_default.cfg.oil_price_usd_bbl} USD/bbl, NDDC as a fixed sum of ${GC.worked_example_inputs_default.cfg.pia_nddc_levy_fixed_usd} USD, prior-year opex of ${GC.worked_example_inputs_default.cfg.pia_prior_year_opex_usd} USD (for HCDT), 100 percent working interest. The line items the engine returns for 2025:`);
w();
const WE_LINES = [
  ['gross revenue', wr.gross_revenue], ['liquids daily rate, bopd', wr.royalty_liquids_bopd], ['liquids royalty rate', wr.royalty_rate_liquids],
  ['liquids production royalty', wr.liquids_production_royalty], ['royalty by price rate (oil)', wr.price_royalty_rate_oil], ['royalty by price', wr.price_royalty],
  ['total royalty', wr.royalty], ['HCDT', wr.hcdt], ['NDDC', wr.nddc], ['capital allowance', wr.depreciation], ['CPR cap', wr.cpr_cap], ['CPR claimed', wr.cpr_costs_claimed],
  ['HCT assessable profit', wr.hct_assessable_profit], ['production allowance', wr.production_allowance], ['HCT chargeable profit', wr.hct_chargeable_profit],
  ['HCT rate', wr.hct_rate], ['HCT', wr.hct_tax], ['CIT assessable profit', wr.cit_assessable_profit], ['CIT allowance claimed', wr.cit_allowance_claimed],
  ['CIT', wr.cit_tax], ['TET rate percent', wr.tet_rate_pct], ['TET', wr.tet_tax], ['total tax', wr.tax], ['net cash flow', wr.net_cash_flow],
];
table(['line (engine)', '2025'], WE_LINES.map(([l, v]) => [l, f6(v)]));
must('the worked example is a PIA year at 50,000 bopd, weighted rate 11.25 percent', wr.fiscal_framework === 'pia_only' && wr.royalty_liquids_bopd === 50000 && wr.royalty_rate_liquids === 0.1125, wr.royalty_rate_liquids);
must('the worked example pays TET at 3 percent', wr.tet_rate_pct === 3, wr.tet_rate_pct);
must('the worked example: HCDT is 3 percent of the stated prior-year opex', Math.abs(wr.hcdt - 0.03 * GC.worked_example_inputs_default.cfg.pia_prior_year_opex_usd) <= 1e-6, wr.hcdt);
must('the worked example states a working interest of 100 or none', (GC.worked_example_inputs_default.cfg.pia_working_interest_pct ?? 100) === 100, 'wi');
must('the worked example: total tax is HCT + CIT + TET', Math.abs(wr.tax - (wr.hct_tax + wr.cit_tax + wr.tet_tax)) <= 1e-6, wr.tax);
must('the worked example: the CPR does not bind', wr.cpr_deferred_to_next === 0, wr.cpr_deferred_to_next);
w();
w(`Read the lines in order: at 50,000 bopd in shallow water the weighted rate is ${f6(100 * wr.royalty_rate_liquids)} percent; royalty by price at ${GC.worked_example_inputs_default.cfg.oil_price_usd_bbl} USD/bbl in 2025 is charged on the Regulations base; the hydrocarbon tax base deducts royalties, the claimed costs, the NDDC sum and the allowances; companies income tax reads its own base; and in 2025, a year under the Act alone, the tertiary education tax is 3 percent of the companies income tax assessable profit. Total tax is the hydrocarbon tax plus companies income tax plus the tertiary education tax (checked).`);

/* ============================================================ SECTION 13 */

section('hctscope', 'What the hydrocarbon tax charges, and its rates', ['Professional m02', 'Expert m03 l01']);
w('WHAT IT CHARGES. The engine charges hydrocarbon tax on crude oil and condensate only; gas revenue is outside the tax and costs shared with gas enter at the crude-plus-condensate share of gross revenue (' + ref('hctbase') + '). Deep offshore pays no hydrocarbon tax in a year under the Act alone, frontier acreage pays none under either framework.');
w();
w('THE RATE (`deriveHctRate`), for every combination the engine accepts (stated inputs; the framework is the year\'s):');
w();
const H = (t, lic, marg, fw, interp, custom, lease, nr) => { try { return f6(E.deriveHctRate(t, lic, marg, null, fw, interp, custom, lease, nr)); } catch (e) { return 'REFUSED (' + ref('refusals') + ')'; } };
const HCT_ROWS = [
  ['onshore', 'PML', 'converted', 'no', 'either', H('onshore', 'PML', false, 'pia_only', null, null, 'converted', null), 'PIA s.267(a); NTA s.72(a)'],
  ['shallow_water', 'PML', 'converted', 'no', 'either', H('shallow_water', 'PML', false, 'nta_2025', null, null, 'converted', null), 'PIA s.267(a); NTA s.72(a)'],
  ['onshore', 'PPL', 'either', 'no', 'either', H('onshore', 'PPL', false, 'pia_only', null, null, 'converted', null), 'PIA s.267(b); NTA s.72(b)'],
  ['shallow_water', 'PML', 'converted', 'yes', 'either', H('shallow_water', 'PML', true, 'pia_only', null, null, 'converted', null), 'PIA s.94(1) with s.267(b)'],
  ['onshore', 'PML', 'new', 'no', 'either', H('onshore', 'PML', false, 'pia_only', null, null, 'new', null), 'open: PIA s.267 does not say (stated 15 or 30)'],
  ['onshore', 'PML', 'new, stated 15', 'no', 'either', H('onshore', 'PML', false, 'pia_only', null, null, 'new', 15), 'stated reading'],
  ['onshore', 'PML', 'new, stated 30', 'no', 'either', H('onshore', 'PML', false, 'pia_only', null, null, 'new', 30), 'stated reading'],
  ['deep_offshore', 'PML', 'either', 'no', 'pia_only', H('deep_offshore', 'PML', false, 'pia_only', null, null, 'new', null), 'PIA s.260(3)'],
  ['deep_offshore', 'PML', 'either', 'no', 'nta_2025, conservative_zero', H('deep_offshore', 'PML', false, 'nta_2025', 'conservative_zero', null, 'new', null), 'open: NTA s.65(1) against s.72 (stated reading)'],
  ['deep_offshore', 'PML', 'either', 'no', 'nta_2025, aggressive_pml_30', H('deep_offshore', 'PML', false, 'nta_2025', 'aggressive_pml_30', null, 'new', null), 'open: stated reading'],
  ['deep_offshore', 'PML', 'either', 'no', 'nta_2025, custom 20', H('deep_offshore', 'PML', false, 'nta_2025', 'custom', 20, 'new', null), 'open: stated reading'],
  ['frontier', 'PML', 'either', 'no', 'either', H('frontier', 'PML', false, 'nta_2025', null, null, 'converted', null), 'PIA s.260(3); NTA s.65(4)'],
];
table(['terrain', 'licence', 'lease status', 'converted marginal field', 'framework and reading', 'rate', 'where it comes from'], HCT_ROWS);
must('converted leases pay 30, a PPL and a converted marginal field 15', E.deriveHctRate('onshore', 'PML', false, null, 'pia_only', null, null, 'converted', null) === 0.3 && E.deriveHctRate('onshore', 'PPL', false, null) === 0.15 && E.deriveHctRate('shallow_water', 'PML', true, null) === 0.15, 'rates');
must('a new lease onshore without a stated rate is refused', HCT_ROWS[4][5].startsWith('REFUSED'), HCT_ROWS[4][5]);
must('deep offshore under the Act alone pays 0 and frontier 0', E.deriveHctRate('deep_offshore', 'PML', false, null, 'pia_only') === 0 && E.deriveHctRate('frontier', 'PML', false, null, 'nta_2025') === 0, 'zero');
w();
w('AN OPEN QUESTION FOR NEW LEASES. PIA s.267 (NTA s.72) gives 30 percent to leases selected under s.93(6)(b) and (7)(b), and 15 percent to onshore and shallow water and to petroleum prospecting licences, and does not say which applies to a petroleum mining lease granted after the Act out of new acreage. The engine refuses such a lease until the rate is stated (15 or 30), and the course never grades the hydrocarbon tax of such a lease: a figure on such a lease that the course grades is one the rate does not move (the chargeable profit, the allowances, the cost price ratio, companies income tax).');
must('the refusal text of the new-lease rate names s.267 and s.93', /PIA s\.267/.test(REFUSED.find((r) => /no pia_new_pml_hct_rate_pct/.test(r[1]))[2]), 'cite');
w();
const cap = runG('ekene_onshore_new_cap_crossing');
const cap30 = runG('ekene_onshore_new_cap_crossing', { pia_new_pml_hct_rate_pct: 30 });
w('THE SAME NEW ONSHORE LEASE UNDER BOTH STATED READINGS (ekene_onshore_new_cap_crossing, stated 15 in the golden input, and the same inputs stated 30):');
w();
table(['year', 'HCT chargeable profit (15)', 'HCT (15)', 'HCT chargeable profit (30)', 'HCT (30)', 'CIT (15)', 'CIT (30)'], cap.cashFlowData.map((d, i) => { const e = cap30.cashFlowData[i]; return [S(d.year), f6(d.hct_chargeable_profit), f6(d.hct_tax), f6(e.hct_chargeable_profit), f6(e.hct_tax), f6(d.cit_tax), f6(e.cit_tax)]; }));
must('the stated rate moves the hydrocarbon tax and nothing before it or beside it', cap.cashFlowData.every((d, i) => d.hct_chargeable_profit === cap30.cashFlowData[i].hct_chargeable_profit && d.cit_tax === cap30.cashFlowData[i].cit_tax && d.hct_tax !== cap30.cashFlowData[i].hct_tax), 'moves');
w();
w('The stated rate moves the hydrocarbon tax line and leaves the chargeable profit and companies income tax where they are (checked on every year): companies income tax does not deduct the hydrocarbon tax.');

/* ============================================================ SECTION 14 */

section('hctbase', 'Deductions in the hydrocarbon tax base and the cost price ratio', ['Professional m03', 'Associate m05 l02']);
w('THE BASE. Hydrocarbon tax assessable profit is crude oil and condensate revenue less the liquids production royalty, less the royalty by price, less the costs the cost price ratio lets through this year, less the crude-plus-condensate share of HCDT and of the NDDC levy. Chargeable profit then deducts the capital allowance the cap let through and the production allowance. Gas royalty is not deducted (gas is outside the tax).');
w();
w('THE COST PRICE RATIO (CPR). Opex, the capital allowance and any decommissioning contribution that is deductible, each at the crude-plus-condensate share, plus the cost carried in from last year, may be claimed up to 65 percent of crude oil and condensate revenue. The carried pool and this year\'s operating costs are claimed first, then this year\'s capital allowance. What does not fit is carried to the next year and claimed there within that year\'s cap. Cost still carried when the ledger ends is forfeited and reported as `cpr_forfeited_at_cessation`. Royalties, HCDT and the NDDC levy sit outside the cap. The cap limits the hydrocarbon tax only; companies income tax deducts opex in full.');
w();
const cpr = runG('ekene_cpr_binding_forfeiture');
w('A CASE WHERE THE CAP BINDS (ekene_cpr_binding_forfeiture), rows (golden input):');
w();
rowsTable('ekene_cpr_binding_forfeiture');
w();
ledger(cpr, HCT_COLS);
w();
cpr.cashFlowData.forEach((d) => {
  must(`CPR ${d.year}: the cap is 65 percent of crude plus condensate revenue`, Math.abs(d.cpr_cap - 0.65 * d.gross_revenue) <= 1e-6, d.cpr_cap);
  must(`CPR ${d.year}: claimed is at most the cap`, d.cpr_costs_claimed <= d.cpr_cap + 1e-9, d.cpr_costs_claimed);
});
must('CPR: the cap binds and carries in every year', cpr.cashFlowData.every((d) => d.cpr_deferred_to_next > 0), 'carry');
must('CPR: cost is forfeited at cessation, equal to the last carry', cpr.kpis.cpr_forfeited_at_cessation === cpr.cashFlowData[cpr.cashFlowData.length - 1].cpr_deferred_to_next, cpr.kpis.cpr_forfeited_at_cessation);
w(`The cap binds in every year and the carry grows; the cost still carried at the end, ${f6(cpr.kpis.cpr_forfeited_at_cessation)}, is reported as cpr_forfeited_at_cessation (equal to the last year\'s carry, checked).`);
w();
table(['year', 'CIT assessable profit', 'opex (in full)', 'CIT allowance claimed', 'CIT'], cpr.cashFlowData.map((d) => [S(d.year), f6(d.cit_assessable_profit), f6(d.opex), f6(d.cit_allowance_claimed), f6(d.cit_tax)]));
w();
w('Companies income tax in the same years deducts the full opex; the cap does not reach it.');
w();
const al = alpha;
const shareOf = (d) => (d.gross_revenue - GC.ekene_alpha_shallow_converted_nta.prodRows.find((x) => x.year === d.year).gas_mscf * GC.ekene_alpha_shallow_converted_nta.cfg.gas_price_usd_mscf) / d.gross_revenue;
w('THE CRUDE-PLUS-CONDENSATE SHARE on Ekene Alpha, which sells associated gas (derived: liquids revenue over gross revenue, from the rows and prices of the golden input):');
w();
table(['year', 'gross revenue', 'liquids share (derived)', 'HCDT', 'NDDC', 'CPR cap', 'CPR claimed', 'HCT assessable profit'], al.cashFlowData.map((d) => [S(d.year), f6(d.gross_revenue), f6(shareOf(d)), f6(d.hcdt), f6(d.nddc), f6(d.cpr_cap), f6(d.cpr_costs_claimed), f6(d.hct_assessable_profit)]));
must('Alpha: the CPR cap is 65 percent of liquids revenue', al.cashFlowData.every((d) => Math.abs(d.cpr_cap - 0.65 * shareOf(d) * d.gross_revenue) <= 1e-6), 'cap');
w();
w('The NDDC levy is deducted in the hydrocarbon tax base at the liquids share, as HCDT is. The engine\'s cost split by revenue share is a stated approximation (' + ref('notes') + ').');

/* ============================================================ SECTION 15 */

section('allowances', 'The production allowance and the capital allowance', ['Professional m04', 'Expert m02 l04']);
w('THE PRODUCTION ALLOWANCE (`computeProductionAllowance`), on crude oil and condensate barrels, deducted in the hydrocarbon tax base:');
w('- a converted lease: the lower of 2.50 USD/bbl and 20 percent of the oil price, on every barrel;');
w('- a lease granted out of new acreage: the lower of 8.00 USD/bbl and 20 percent of the oil price up to a cumulative cap per field counted from the start of production (onshore 50, shallow water 100, deep offshore and frontier 500 million barrels), then the lower of 4.00 USD/bbl and 20 percent on every later barrel; a year that crosses the cap is split at the cap;');
w('- a new lease in deep offshore or frontier in a year under the Nigeria Tax Act 2025: none.');
w();
const PA = (lease, terrain, bbl, price, prior, fw) => E.computeProductionAllowance({ pia_lease_status: lease, pia_terrain: terrain }, bbl, price, prior, fw);
const PA_ROWS = [
  ['converted', 'shallow_water', 1000000, 75, 0, 'nta_2025'], ['converted', 'shallow_water', 1000000, 10, 0, 'nta_2025'],
  ['new', 'onshore', 1000000, 75, 0, 'nta_2025'], ['new', 'onshore', 1000000, 30, 0, 'nta_2025'],
  ['new', 'onshore', 1000000, 75, 49500000, 'nta_2025'], ['new', 'onshore', 1000000, 75, 60000000, 'nta_2025'], ['new', 'onshore', 1000000, 15, 60000000, 'nta_2025'],
  ['new', 'shallow_water', 1000000, 75, 99500000, 'pia_only'], ['new', 'deep_offshore', 1000000, 75, 0, 'pia_only'], ['new', 'deep_offshore', 1000000, 75, 0, 'nta_2025'],
  ['new', 'frontier', 1000000, 75, 0, 'nta_2025'],
];
table(['lease (stated)', 'terrain', 'barrels', 'oil price', 'prior cumulative bbl', 'framework', 'allowance', 'below the cap bbl', 'after the cap bbl'], PA_ROWS.map((a) => { const r = PA(...a); return [a[0], a[1], S(a[2]), f6(a[3]), S(a[4]), a[5], f6(r.allowance), vol(r.below_cap_bbl), vol(r.after_cap_bbl)]; }));
must('converted at 75: 2.5 a barrel; at 10: 20 percent of price (2 a barrel)', PA(...PA_ROWS[0]).allowance === 2500000 && PA(...PA_ROWS[1]).allowance === 2000000, 'conv');
must('new below the cap at 75: 8 a barrel; at 30: 6 a barrel', PA(...PA_ROWS[2]).allowance === 8000000 && PA(...PA_ROWS[3]).allowance === 6000000, 'new');
must('a year crossing the onshore cap is split at 50,000,000', PA(...PA_ROWS[4]).below_cap_bbl === 500000 && PA(...PA_ROWS[4]).after_cap_bbl === 500000, 'split');
must('after the cap at 75: 4 a barrel; at 15: 3 a barrel', PA(...PA_ROWS[5]).allowance === 4000000 && PA(...PA_ROWS[6]).allowance === 3000000, 'after');
must('deep offshore new: 8 a barrel under the Act alone and none under the NTA; frontier none under the NTA', PA(...PA_ROWS[8]).allowance === 8000000 && PA(...PA_ROWS[9]).allowance === 0 && PA(...PA_ROWS[10]).allowance === 0, 'deep');
w();
const cc = cap;
w(`A NEW ONSHORE LEASE CROSSING THE CAP (ekene_onshore_new_cap_crossing: ${GC.ekene_onshore_new_cap_crossing.cfg.pia_prior_cumulative_oil_bbl} bbl produced before 2026), rows (golden input):`);
w();
rowsTable('ekene_onshore_new_cap_crossing');
w();
table(['year', 'barrels below the cap', 'barrels after the cap', 'production allowance'], cc.cashFlowData.map((d) => [S(d.year), vol(d.prod_alw_below_cap_bbl), vol(d.prod_alw_after_cap_bbl), f6(d.production_allowance)]));
must('the case crosses the cap in 2026 with 1,000,000 barrels below', row(cc, 2026).prod_alw_below_cap_bbl === 1000000 && row(cc, 2026).prod_alw_after_cap_bbl === 2000000, 'cross');
w();
w('THE CAPITAL ALLOWANCE (`capitalAllowanceFraction`), the fraction of a spend claimed in each year of its life, read by the law of the year of assessment:');
w();
table(['year of life (0 is the year of spend)', 'a year under the Act alone', 'a year under the Nigeria Tax Act 2025'], [0, 1, 2, 3, 4, 5].map((i) => [S(i), f6(E.capitalAllowanceFraction(i, 'pia_only')), f6(E.capitalAllowanceFraction(i, 'nta_2025'))]));
must('PIA years 20/20/20/20/19, NTA years 20 x 5, nothing in year six', [0.2, 0.2, 0.2, 0.2, 0.19, 0].every((v, i) => E.capitalAllowanceFraction(i, 'pia_only') === v) && [0.2, 0.2, 0.2, 0.2, 0.2, 0].every((v, i) => E.capitalAllowanceFraction(i, 'nta_2025') === v), 'ca');
w();
w('In a year under the Act alone the fifth year claims 19 percent and 1 percent of the cost is retained until disposal (never claimed in the ledger); under the Nigeria Tax Act 2025 the fifth year claims 20 percent. A spend part way through its life on 1 January 2026 takes the rate of each later year as that year\'s law gives it.');

/* ============================================================ SECTION 16 */

section('cit', 'Companies income tax beside the hydrocarbon tax, the two thirds restriction and losses', ['Professional m05']);
w('THE BASE. Companies income tax (30 percent unless stated) is charged on oil and gas together: gross revenue less every royalty, opex in full, HCDT, the NDDC levy and any deductible decommissioning contribution, less its own capital allowance. The hydrocarbon tax is not deducted, and the cost price ratio does not apply.');
w();
w('THE TWO THIRDS RESTRICTION. In a year under the Act alone the capital allowance claimed against companies income tax is limited to two thirds of the assessable profit, and the excess is carried forward; a company in upstream or midstream gas operations is exempt (stated input `pia_cit_company_gas_operations`). In a year under the Nigeria Tax Act 2025 there is no restriction and a carried amount is claimed in full. The engine applies the same restriction to years before 1 May 2023 and says so in `kpis.pia_notes`.');
w();
const across = runG('ekene_onshore_across_2026');
w('AN ONSHORE LEASE ACROSS 1 JANUARY 2026 (ekene_onshore_across_2026), rows (golden input):');
w();
rowsTable('ekene_onshore_across_2026');
w();
ledger(across, CIT_COLS);
w();
must('across: 2024 and 2025 restricted, 2026 onward not', across.cashFlowData.every((d) => d.cit_allowance_restricted === (d.year < 2026)), 'restricted');
w('The restriction column the engine returns (`cit_allowance_restricted`): true in 2024 and 2025, false from 2026 (checked). On this lease the restriction does not bind: two thirds of each assessable profit is larger than the allowance, so the whole allowance is claimed.');
must('across: the restriction does not bind', across.cashFlowData.every((d) => d.cit_allowance_claimed === d.depreciation && d.cit_allowance_carryforward === 0), 'nobind');
w();
const cprBind = cpr.cashFlowData.filter((d) => d.fiscal_framework === 'pia_only');
must('CPR case: the restriction binds in its two PIA years, claiming exactly two thirds', cprBind.length === 2 && cprBind.every((d) => Math.abs(d.cit_allowance_claimed - d.cit_assessable_profit * 2 / 3) <= 1e-6 && d.cit_allowance_carryforward > 0), 'bind');
w(`Where it binds: on the CPR case of ${ref('hctbase')} (2024 and 2025 are years under the Act alone) the claim is two thirds of the assessable profit, ${f6(cprBind[0].cit_allowance_claimed)} in 2024 and ${f6(cprBind[1].cit_allowance_claimed)} in 2025, and the rest is carried; 2026 is an NTA year and claims the carried amount in full (the CIT table of ${ref('hctbase')}).`);
w();
w('LOSSES BY CLASS. A loss (or a chargeable profit below zero) is carried to the next year and used there, separately for the hydrocarbon tax and for companies income tax. On the CPR case:');
w();
table(['year', 'HCT chargeable profit', 'HCT loss used', 'HCT loss carried', 'CIT chargeable profit', 'CIT loss used', 'CIT loss carried'], cpr.cashFlowData.map((d) => [S(d.year), f6(d.hct_chargeable_profit), f6(d.hct_loss_offset_used), f6(d.hct_loss_carryforward), f6(d.cit_chargeable_profit), f6(d.cit_loss_offset_used), f6(d.cit_loss_carryforward)]));
w();
w('The two pools are kept apart (the cash flow course owns the pool arithmetic; this course names the provision behind it).');

/* ============================================================ SECTION 17 */

section('framework', 'The framework read year by year: the education tax, the levy and the switch', ['Expert m02']);
w('THE RULE (`fiscalFrameworkForYear`). Under `pia_under_nta_2025_override` "auto" (the default) a year before 2026 is a year under the Act alone ("pia_only") and 2026 and every later year is a year under the Nigeria Tax Act 2025 ("nta_2025"), read row by row, so one ledger can cross the switch. "force_pia" and "force_nta" put every year on one framework. A ledger that crosses reports `kpis.fiscal_framework` "pia_only_then_nta_2025" and `kpis.nta_first_year`.');
w();
table(['year (stated)', 'auto', 'force_pia', 'force_nta'], [2023, 2024, 2025, 2026, 2027, 2030].map((y) => [S(y), ...['auto', 'force_pia', 'force_nta'].map((o) => E.fiscalFrameworkForYear({ pia_under_nta_2025_override: o }, y))]));
must('auto switches at 2026', E.fiscalFrameworkForYear({}, 2025) === 'pia_only' && E.fiscalFrameworkForYear({}, 2026) === 'nta_2025', 'auto');
w();
w('WHAT CHANGES WITH THE FRAMEWORK OF A YEAR, as the engine applies it:');
table(['line', 'a year under the Act alone', 'a year under the Nigeria Tax Act 2025'], [
  ['tertiary education tax', 'charged: 3 percent from 2023, 2.5 percent before, on the CIT assessable profit', 'none (NTA s.197(5))'],
  ['development levy', 'none', '4 percent of the CIT assessable profit (NTA s.59(1))'],
  ['capital allowance, fifth year', '19 percent, 1 percent retained', '20 percent'],
  ['two thirds restriction on the CIT capital allowance', 'applies', 'does not apply'],
  ['deep offshore hydrocarbon tax', 'none (PIA s.260(3))', 'a stated reading (' + ref('edges') + ')'],
  ['deep offshore and frontier new-lease production allowance', 'allowed', 'none'],
  ['decommissioning fund contribution', 'deductible', 'deductible only if the escrow condition is met'],
  ['minimum effective tax top-up (when switched on)', 'none', 'applied'],
]);
w();
w('THE TERTIARY EDUCATION TAX RATE BY YEAR (`statutoryTetRatePct`), used in a year under the Act alone unless a rate is stated:');
w();
table(['year (stated)', 'rate percent'], [2021, 2022, 2023, 2024, 2025].map((y) => [S(y), f6(E.statutoryTetRatePct(y))]));
must('TET 2.5 before 2023 and 3 from 2023', E.statutoryTetRatePct(2022) === 2.5 && E.statutoryTetRatePct(2023) === 3, 'tet');
w();
w('The Finance Act 2023 raised the rate to 3 percent with effect from 1 May 2023; the annual model applies 3 percent to the whole of 2023. The 2.5 percent before rests on a secondary source (' + ref('sources') + ').');
w();
w(`ONE LEDGER ACROSS THE SWITCH (ekene_onshore_across_2026, the rows and CIT lines of ${ref('cit')}): kpis.fiscal_framework is "${across.kpis.fiscal_framework}" and kpis.nta_first_year is ${across.kpis.nta_first_year}.`);
w();
table(['year', 'framework', 'capital allowance', 'TET rate percent', 'TET', 'development levy'], across.cashFlowData.map((d) => [S(d.year), d.fiscal_framework, f6(d.depreciation), f6(d.tet_rate_pct), f6(d.tet_tax), f6(d.dev_levy_tax)]));
must('across: TET in 2024 and 2025 at 3 percent, levy from 2026', across.cashFlowData.every((d) => (d.year < 2026 ? d.tet_rate_pct === 3 && d.dev_levy_tax === 0 : d.tet_tax === 0 && d.dev_levy_tax > 0)), 'switch');
must('across: kpis report the crossing', across.kpis.fiscal_framework === 'pia_only_then_nta_2025' && across.kpis.nta_first_year === 2026, across.kpis.fiscal_framework);
must('across: the 2024 spend claims 20 percent in 2028, its fifth year, under the NTA', Math.abs(row(across, 2028).depreciation - 0.2 * GC.ekene_onshore_across_2026.capexRows[0].amount_usd) <= 1e-6, row(across, 2028).depreciation);
w();
w('The 2024 spend claims 20 percent in each of its five years: 2024 to 2027 at 20 percent by either law, and 2028, its fifth year and an NTA year, at 20 percent (checked).');
w();
const fp = runG('ekene_force_pia_2027');
w(`A LEDGER FORCED TO THE ACT ALONE (ekene_force_pia_2027, 2027 to 2032): every year reports "${fp.cashFlowData[0].fiscal_framework}", the tertiary education tax rate is ${f6(row(fp, 2027).tet_rate_pct)} percent, the development levy is ${f6(row(fp, 2027).dev_levy_tax)} and the fifth-year capital allowance of the 2027 spend, in 2031, is ${f6(row(fp, 2031).depreciation)}.`);
must('force_pia: every year pia_only, TET 3, fifth-year allowance 19 percent', fp.cashFlowData.every((d) => d.fiscal_framework === 'pia_only' && d.tet_rate_pct === 3) && Math.abs(row(fp, 2031).depreciation - 0.19 * GC.ekene_force_pia_2027.capexRows[0].amount_usd) <= 1e-6, 'fp');

/* ============================================================ SECTION 18 */

section('edges', 'What the Nigeria Tax Act 2025 changed at the edges, and what it did not', ['Expert m03']);
const dc = runG('ekene_deep_new_60k_conservative');
const da = runG('ekene_deep_new_60k_aggressive');
const DEEP_CUSTOM = 20;
const dcu = runG('ekene_deep_new_60k_conservative', { pia_deep_offshore_hct_interpretation: 'custom', pia_deep_offshore_hct_custom_rate_pct: DEEP_CUSTOM });
w('DEEP OFFSHORE UNDER THE NIGERIA TAX ACT 2025: THREE READINGS. NTA s.65(1) brings deep offshore into the hydrocarbon tax and s.72 prints rates only for onshore and shallow water. The engine takes the reading as a stated input with no default: "conservative_zero", "aggressive_pml_30" or "custom" with a stated rate. The course shows all three and grades none. The deep offshore lease of the dataset, rows (golden input):');
w();
rowsTable('ekene_deep_new_60k_conservative');
w();
table(['year', 'framework', 'liquids royalty rate', 'production allowance', 'HCT chargeable profit', 'HCT, conservative_zero', 'HCT, aggressive_pml_30', `HCT, custom ${DEEP_CUSTOM} (stated)`, 'CIT (every reading)'], dc.cashFlowData.map((d, i) => [S(d.year), d.fiscal_framework, f6(d.royalty_rate_liquids), f6(d.production_allowance), f6(d.hct_chargeable_profit), f6(d.hct_tax), f6(da.cashFlowData[i].hct_tax), f6(dcu.cashFlowData[i].hct_tax), f6(d.cit_tax)]));
must('deep: the readings move only the hydrocarbon tax', dc.cashFlowData.every((d, i) => d.cit_tax === da.cashFlowData[i].cit_tax && d.cit_tax === dcu.cashFlowData[i].cit_tax && d.hct_chargeable_profit === da.cashFlowData[i].hct_chargeable_profit), 'readings');
must('deep: 2025 pays no HCT under every reading', row(dc, 2025).hct_tax === 0 && row(da, 2025).hct_tax === 0 && row(dcu, 2025).hct_tax === 0, '2025');
must('deep: 60,000 bopd weighted to 5.416667 percent', Math.abs(row(dc, 2025).royalty_rate_liquids - (50000 * 0.05 + 10000 * 0.075) / 60000) <= 1e-15, row(dc, 2025).royalty_rate_liquids);
w();
w('The reading moves the hydrocarbon tax line and nothing else (checked); 2025, a year under the Act alone, pays none under every reading.');
w();
w(`THE DELETED DEEP OFFSHORE ALLOWANCE. The same lease earns a production allowance of ${f6(row(dc, 2025).production_allowance)} in 2025 and ${f6(row(dc, 2026).production_allowance)} in 2026: the Nigeria Tax Act 2025 re-enacts the new-lease allowance for onshore and shallow water only.`);
must('deep: the allowance stops in 2026', row(dc, 2025).production_allowance > 0 && row(dc, 2026).production_allowance === 0, 'alw');
w();
const em = runG('ekene_sinking_fund_nta_escrow_met');
const en = runG('ekene_sinking_fund_nta_escrow_not_met');
const ep = runG('ekene_sinking_fund_pia_years');
w('THE DECOMMISSIONING ESCROW CONDITION. A decommissioning fund contribution is deductible for the hydrocarbon tax and companies income tax in a year under the Act alone. In a year under the Nigeria Tax Act 2025 it is deductible only if at least 30 percent of the fund sits in an escrow account with a Nigerian bank accredited under the Central Bank\'s criteria (NTA s.86), which the engine takes as a stated true or false. The cash goes out either way. Rows of the two NTA cases (golden input):');
w();
rowsTable('ekene_sinking_fund_nta_escrow_met');
w();
table(['year', 'contribution', 'deduction (met)', 'CIT (met)', 'HCT (met)', 'deduction (not met)', 'CIT (not met)', 'HCT (not met)'], em.cashFlowData.map((d, i) => { const e = en.cashFlowData[i]; return [S(d.year), f6(d.decom_fund_contribution), f6(d.decom_fund_deduction), f6(d.cit_tax), f6(d.hct_tax), f6(e.decom_fund_deduction), f6(e.cit_tax), f6(e.hct_tax)]; }));
must('escrow: deducted when met, not when not met', em.cashFlowData.every((d, i) => d.decom_fund_deduction === d.decom_fund_contribution && en.cashFlowData[i].decom_fund_deduction === 0), 'escrow');
w();
table(['year (a fund in years under the Act alone)', 'contribution', 'deduction'], ep.cashFlowData.map((d) => [S(d.year), f6(d.decom_fund_contribution), f6(d.decom_fund_deduction)]));
must('escrow: a PIA-year contribution is deducted without the condition', ep.cashFlowData.every((d) => d.decom_fund_deduction === d.decom_fund_contribution && d.fiscal_framework === 'pia_only'), 'pia');
w();
const me = runG('ekene_min_etr_nta_only');
const ETR_ACT = 15;
const me15 = runG('ekene_min_etr_nta_only', { pia_minimum_etr_pct: ETR_ACT });
w(`THE MINIMUM EFFECTIVE TAX RATE. The Nigeria Tax Act 2025 s.57 sets a 15 percent minimum effective tax rate for a company in a multinational group or with a turnover of 20 billion naira or more, on audited profit. The engine offers a labelled project-level approximation, off by default (\`pia_apply_minimum_etr\`): in a year under the Nigeria Tax Act 2025 only, a top-up to the stated rate of the CIT assessable profit. The approximation is stated in \`kpis.pia_notes\` and is never graded. On the case ekene_min_etr_nta_only (rows golden input), at the golden input's stated ${GC.ekene_min_etr_nta_only.cfg.pia_minimum_etr_pct} percent (set high so the top-up shows) and at ${ETR_ACT} percent:`);
w();
table(['year', 'framework', 'CIT assessable profit', 'HCT + CIT + TET + levy', `top-up at ${GC.ekene_min_etr_nta_only.cfg.pia_minimum_etr_pct} (stated)`, `top-up at ${ETR_ACT}`], me.cashFlowData.map((d, i) => [S(d.year), d.fiscal_framework, f6(d.cit_assessable_profit), f6(d.hct_tax + d.cit_tax + d.tet_tax + d.dev_levy_tax), f6(d.min_etr_topup ?? 0), f6(me15.cashFlowData[i].min_etr_topup ?? 0)]));
must('min ETR: no top-up in the PIA year', (row(me, 2025).min_etr_topup ?? 0) === 0 && (row(me, 2026).min_etr_topup ?? 0) > 0, 'etr');
must('min ETR at 15: no top-up (the taxes already exceed 15 percent of the base)', me15.cashFlowData.every((d) => (d.min_etr_topup ?? 0) === 0), 'etr15');
w();
w('WHAT DID NOT CHANGE. The royalty rates, the tranches, the royalty by price, the hydrocarbon tax rates of 30 and 15 percent onshore and in shallow water, the cost price ratio of 65 percent and the converted-lease production allowance are the same under both frameworks: the engine\'s royalty and royalty by price functions take no framework input, and its cost price ratio reads none.');
must('the royalty functions take no framework input', E.deriveOilRoyaltyRate.length === 2 && E.derivePriceRoyaltyRate.length <= 4, `${E.deriveOilRoyaltyRate.length}`);
must('the converted allowance is the same under both frameworks', PA('converted', 'onshore', 1000000, 75, 0, 'pia_only').allowance === PA('converted', 'onshore', 1000000, 75, 0, 'nta_2025').allowance, 'conv');

/* ============================================================ SECTION 19 */

section('levies', 'Host communities, the NDDC levy and the decommissioning fund', ['Associate m05', 'Professional m03 l02']);
w('HCDT (host communities development trust). 3 percent of the preceding year\'s opex. The first ledger year reads the stated `pia_prior_year_opex_usd` (0 if not stated). Deductible for the hydrocarbon tax (at the liquids share) and for companies income tax.');
w();
w('THE NDDC LEVY. 3 percent of the company\'s total annual budget, which the engine takes as the year\'s opex plus capex (NDDC Act 2000 s.14(2)(b) as amended, from a secondary source). `pia_nddc_levy_base` "opex" is a stated alternative and a fixed sum (`pia_nddc_levy_fixed_usd`) replaces the percentage when given. Deductible for the hydrocarbon tax (at the liquids share) and for companies income tax.');
w();
table(['year (Ekene Alpha)', 'opex', 'capex', 'HCDT', 'NDDC'], al.cashFlowData.map((d) => [S(d.year), f6(d.opex), f6(d.capex), f6(d.hcdt), f6(d.nddc)]));
must('Alpha: HCDT is 0 in the first year (no prior opex stated) and 3 percent of the previous year\'s opex after', row(al, 2026).hcdt === 0 && al.cashFlowData.slice(1).every((d, i) => Math.abs(d.hcdt - 0.03 * al.cashFlowData[i].opex) <= 1e-9), 'hcdt');
must('Alpha: NDDC is 3 percent of opex plus capex', al.cashFlowData.every((d) => Math.abs(d.nddc - 0.03 * (d.opex + d.capex)) <= 1e-9), 'nddc');
w();
const nob = runG('ekene_nddc_opex_base');
const nod = runG('ekene_nddc_opex_base', { pia_nddc_levy_base: 'total_budget' });
w('The two NDDC bases on the same rows (ekene_nddc_opex_base, stated "opex", and the same inputs on the default total budget):');
w();
table(['year', 'NDDC, opex base', 'NDDC, total budget', 'HCT, opex base', 'HCT, total budget'], nob.cashFlowData.map((d, i) => [S(d.year), f6(d.nddc), f6(nod.cashFlowData[i].nddc), f6(d.hct_tax), f6(nod.cashFlowData[i].hct_tax)]));
w();
w('THE DECOMMISSIONING FUND. With `abandonment_funding_mode` "sinking_fund" the stated cost at the share is collected in equal contributions from the first year to the abandonment year; each contribution is a cash outflow and, where deductible (' + ref('edges') + '), sits inside the cost price ratio for the hydrocarbon tax and is deducted in full for companies income tax.');

/* ============================================================ SECTION 20 */

section('take', 'Government cash flow, government take and the working interest', ['Associate m05', 'Expert m05']);
const GT = CONV.FISCAL_METRICS.governmentTake;
w(`THE WORDING, from engines/economics/fiscalConventions.js (verbatim, shared with the fiscal course): "${GT.title}" is "${GT.definition}" Its formula: ${GT.formula}. The second metric, "${CONV.FISCAL_METRICS.governmentShareOfNetRevenue.title}", is "${CONV.FISCAL_METRICS.governmentShareOfNetRevenue.definition}" Government cash flow is "${CONV.GOVERNMENT_CASH_FLOW.definition}"`);
must('the conventions carry the two metrics', GT && CONV.FISCAL_METRICS.governmentShareOfNetRevenue && CONV.GOVERNMENT_CASH_FLOW, 'conv');
w();
w('THE ENGINE\'S TAKE (`kpis.government_take_pct`) for a PIA ledger is (revenue less capex less opex, less the ledger\'s net cash flow) over (revenue less capex less opex), undiscounted and nominal. Every royalty, HCDT, the NDDC levy and every tax is on the government side of that difference.');
w();
const totalsOf = (r) => ({ royalty: r.kpis.total_royalties, hct: r.kpis.total_hct, cit: r.kpis.total_cit, tet: r.kpis.total_tet, levy: r.kpis.total_dev_levy, hcdt: r.kpis.total_hcdt, nddc: r.kpis.total_nddc });
const decomp = (r) => { const t = totalsOf(r); const pre = r.kpis.total_revenue - r.kpis.total_capex - r.kpis.total_opex; return { ...t, gcf: t.royalty + t.hct + t.cit + t.tet + t.levy + t.hcdt + t.nddc, pre, take: r.kpis.government_take_pct }; };
const aw = runG('ekene_alpha_wi_50');
const A = decomp(al); const AW = decomp(aw);
w('DECOMPOSED BY PROVISION on Ekene Alpha at 100 and at 50 percent working interest (engine totals; government cash flow and the pre-take value derived as stated):');
w();
table(['line', 'Alpha, 100 percent', 'Alpha, 50 percent'], [
  ['total royalties', A.royalty, AW.royalty], ['hydrocarbon tax', A.hct, AW.hct], ['companies income tax', A.cit, AW.cit], ['tertiary education tax', A.tet, AW.tet],
  ['development levy', A.levy, AW.levy], ['HCDT', A.hcdt, AW.hcdt], ['NDDC', A.nddc, AW.nddc],
  ['government cash flow (derived: the sum of the seven lines)', A.gcf, AW.gcf], ['pre-take value (derived: revenue less capex less opex)', A.pre, AW.pre], ['government take percent (engine)', A.take, AW.take],
].map(([l, a, b]) => [l, f6(a), f6(b)]));
must('Alpha: the take equals government cash flow over the pre-take value', Math.abs(A.take - 100 * A.gcf / A.pre) <= 1e-9 && Math.abs(AW.take - 100 * AW.gcf / AW.pre) <= 1e-9, `${A.take} ${100 * A.gcf / A.pre}`);
must('Alpha: every money line halves at 50 percent', ['royalty', 'hct', 'cit', 'levy', 'hcdt', 'nddc'].every((k) => Math.abs(AW[k] - A[k] / 2) <= 1e-6 * Math.max(1, A[k])), 'half');
must('Alpha: the take is the same at 50 percent, exactly', A.take === AW.take, `${A.take} ${AW.take}`);
w();
w('Government cash flow over the pre-take value reproduces the engine\'s take on both lines (checked). At 50 percent every money line is half (checked) and the take does not move (checked): the tranches and caps are read at field level before the share is taken.');

/* ============================================================ SECTION 21 */

section('moved', 'Which provision moved: one change at a time', ['Expert m05']);
w('Ekene Alpha as the base case, then ONE stated change at a time, each run through the engine. The differences are derived (the changed run less the base, line by line).');
w();
const CHANGES = [
  ['terrain onshore', { pia_terrain: 'onshore' }],
  ['a prospecting licence', { pia_license_type: 'PPL' }],
  ['a new lease, stated 30', { pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 30 }],
  ['a new lease, stated 15', { pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 15 }],
  ['oil at 95 USD/bbl', { oil_price_usd_bbl: 95 }],
  ['oil at 95 USD/bbl, Act base', { oil_price_usd_bbl: 95, pia_price_royalty_base: 'act_2020' }],
  ['every year forced to the Act alone', { pia_under_nta_2025_override: 'force_pia' }],
  ['all gas used in-country', { pia_gas_in_country_share_pct: 100 }],
];
const baseT = decomp(al);
table(['stated change', 'royalties', 'hydrocarbon tax', 'companies income tax', 'TET', 'levy', 'take percent'], CHANGES.map(([n, p]) => {
  const t = decomp(runG('ekene_alpha_shallow_converted_nta', p));
  return [n, f6(t.royalty - baseT.royalty), f6(t.hct - baseT.hct), f6(t.cit - baseT.cit), f6(t.tet - baseT.tet), f6(t.levy - baseT.levy), f6(t.take - baseT.take)];
}));
w();
const dT = (p) => decomp(runG('ekene_alpha_shallow_converted_nta', p));
must('onshore moves royalties only through the tranche above 10,000 bopd: Alpha is below it, so royalties do not move', dT({ pia_terrain: 'onshore' }).royalty === baseT.royalty, 'onshore');
must('a prospecting licence moves the hydrocarbon tax and not royalties', dT({ pia_license_type: 'PPL' }).royalty === baseT.royalty && dT({ pia_license_type: 'PPL' }).hct !== baseT.hct, 'ppl');
must('a new lease with a stated 30 still lowers the hydrocarbon tax (the allowance)', dT({ pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 30 }).hct < baseT.hct, 'new30');
must('forcing the Act alone swaps the levy for TET', dT({ pia_under_nta_2025_override: 'force_pia' }).levy === 0 && dT({ pia_under_nta_2025_override: 'force_pia' }).tet > 0, 'force');
w('Read the rows: moving Alpha onshore changes no royalty, because every Alpha year is below 10,000 bopd where onshore and shallow water pay the same rate; a prospecting licence moves only the hydrocarbon tax rate; a new lease moves the hydrocarbon tax twice, through the larger new-lease production allowance and through the rate it states (the two stated rates are both shown and neither is graded); the price moves the royalty by price and everything after it, and the base year moves it again; forcing the Act alone swaps the development levy for the tertiary education tax and changes the capital allowance and the restriction.');

/* ============================================================ SECTION 22 */

section('notes', 'The engine\'s notes, verbatim, and when each appears', ['Expert m05 l04', 'Professional m01 l03']);
w('Every note the engine can print in `kpis.pia_notes`, read from the exported `PIA_NOTES`, with the condition that puts it there. A note is a statement the engine makes about a stated default, a conflict between texts or an approximation; it is course content and is quoted verbatim.');
w();
const NOTE_WHEN = {
  priceRoyaltyBaseRegulations: 'every PIA ledger on the default base',
  priceRoyaltyBaseAct: 'every PIA ledger with pia_price_royalty_base "act_2020"',
  priceRoyaltyMidColumn: 'a ledger with a year of 2023 or later',
  dailyRate: 'every PIA ledger',
  sharedCosts: 'a ledger with gas production in some year',
  citRestrictionPre2026: 'a year under the Act alone, unless the company is in gas operations',
  ntaVersion: 'a year under the Nigeria Tax Act 2025',
  minEtrApproximation: 'the minimum effective tax rate switched on',
  fiscalPrice: 'every PIA ledger',
};
must('every note has its condition', Object.keys(NOTES).every((k) => NOTE_WHEN[k]) && Object.keys(NOTES).length === Object.keys(NOTE_WHEN).length, Object.keys(NOTES));
table(['note', 'appears when', 'the engine\'s words'], Object.entries(NOTES).map(([k, v]) => [`\`${k}\``, NOTE_WHEN[k], v]));
const acrossNotes = across.kpis.pia_notes;
must('the across-2026 ledger prints the Regulations base, the mid column, the daily rate, the CITA restriction, the NTA version and the fiscal price notes', [NOTES.priceRoyaltyBaseRegulations, NOTES.priceRoyaltyMidColumn, NOTES.dailyRate, NOTES.citRestrictionPre2026, NOTES.ntaVersion, NOTES.fiscalPrice].every((n) => acrossNotes.includes(n)) && !acrossNotes.includes(NOTES.sharedCosts), acrossNotes.length);
must('Alpha prints the shared costs note (it sells gas)', al.kpis.pia_notes.includes(NOTES.sharedCosts), 'shared');
must('the Act-base case prints the Act note', act.kpis.pia_notes.includes(NOTES.priceRoyaltyBaseAct), 'act');
must('the min ETR case prints the approximation note', me.kpis.pia_notes.includes(NOTES.minEtrApproximation), 'etr');
const tetOv = ok('the worked example with pia_tet_rate_pct 2.5', () => runCfg({ ...GC.worked_example_inputs_default.cfg, pia_tet_rate_pct: 2.5 }, GC.worked_example_inputs_default));
const tetNote = tetOv.kpis.pia_notes.find((n) => n.startsWith('pia_tet_rate_pct'));
w();
w('ONE MORE NOTE IS BUILT FROM THE RUN. A stated tertiary education tax rate that differs from the statute in a year under the Act alone is used and named. The worked example inputs with a stated 2.5 percent in 2025 print:');
quote(tetNote);
must('the TET override note appears and names 2025', tetNote && /2025/.test(tetNote), tetNote);
must('the stated 2.5 is what the run used', row(tetOv, 2025).tet_rate_pct === 2.5, row(tetOv, 2025).tet_rate_pct);

/* ============================================================ SECTION 23 */

section('boundaries', 'Every boundary rule, one by one', ['Professional m01', 'Expert m05']);
w('A boundary rule is stated per rule, never globally. Each row is an engine call at the boundary and just past it.');
w();
const BB = 1000000; const BP = 75; const BADSHARE = 100.5;
const B = [
  ['onshore first tranche', 'at or below 5,000 bopd is exactly 5 percent (the edge belongs to the first tranche)', f6(E.deriveOilRoyaltyRate('onshore', 5000)), f6(E.deriveOilRoyaltyRate('onshore', 5001)), E.deriveOilRoyaltyRate('onshore', 5000) === 0.05 && E.deriveOilRoyaltyRate('onshore', 5001) > 0.05],
  ['onshore second tranche', `at 10,000 bopd is exactly ${f6(100 * E.deriveOilRoyaltyRate('onshore', 10000))} percent; above it the terrain rate enters`, f6(E.deriveOilRoyaltyRate('onshore', 10000)), f6(E.deriveOilRoyaltyRate('onshore', 10001)), E.deriveOilRoyaltyRate('onshore', 10000) === 0.0625 && E.deriveOilRoyaltyRate('onshore', 10001) > 0.0625],
  ['deep offshore tier', 'at or below 50,000 bopd is exactly 5 percent', f6(E.deriveOilRoyaltyRate('deep_offshore', 50000)), f6(E.deriveOilRoyaltyRate('deep_offshore', 50001)), E.deriveOilRoyaltyRate('deep_offshore', 50000) === 0.05 && E.deriveOilRoyaltyRate('deep_offshore', 50001) > 0.05],
  ['royalty by price, low benchmark (2025, Regulations)', 'at or below the low benchmark is 0', f6(E.derivePriceRoyaltyRate(54.12, 2025, 'onshore')), f6(E.derivePriceRoyaltyRate(54.13, 2025, 'onshore')), E.derivePriceRoyaltyRate(54.12, 2025, 'onshore') === 0 && E.derivePriceRoyaltyRate(54.13, 2025, 'onshore') > 0],
  ['royalty by price, high benchmark (2025, Regulations)', 'at or above the high benchmark is 10 percent', f6(E.derivePriceRoyaltyRate(162.36, 2025, 'onshore')), f6(E.derivePriceRoyaltyRate(162.35, 2025, 'onshore')), E.derivePriceRoyaltyRate(162.36, 2025, 'onshore') === 0.1 && E.derivePriceRoyaltyRate(162.35, 2025, 'onshore') < 0.1],
  [`new-lease allowance cap (onshore, ${BB} barrels at ${BP})`, 'a year that ends exactly on the cap has no barrel after it', f6(PA('new', 'onshore', BB, BP, 50000000 - BB, 'nta_2025').allowance), f6(PA('new', 'onshore', BB, BP, 50000000 - BB + 1, 'nta_2025').allowance), PA('new', 'onshore', BB, BP, 50000000 - BB, 'nta_2025').after_cap_bbl === 0 && PA('new', 'onshore', BB, BP, 50000000 - BB + 1, 'nta_2025').after_cap_bbl === 1],
  [`production allowance price leg (converted, ${BB} barrels)`, 'at 12.50 USD/bbl 20 percent of price equals 2.50 a barrel', f6(PA('converted', 'onshore', BB, 12.5, 0, 'nta_2025').allowance), f6(PA('converted', 'onshore', BB, 12.49, 0, 'nta_2025').allowance), PA('converted', 'onshore', BB, 12.5, 0, 'nta_2025').allowance === 2.5 * BB],
  ['framework', '2025 is a year under the Act alone and 2026 the first NTA year', E.fiscalFrameworkForYear({}, 2025), E.fiscalFrameworkForYear({}, 2026), E.fiscalFrameworkForYear({}, 2025) === 'pia_only' && E.fiscalFrameworkForYear({}, 2026) === 'nta_2025'],
  ['tertiary education tax rate', '2022 is 2.5 percent and 2023 is 3 percent', f6(E.statutoryTetRatePct(2022)), f6(E.statutoryTetRatePct(2023)), E.statutoryTetRatePct(2022) === 2.5 && E.statutoryTetRatePct(2023) === 3],
  ['gas in-country share', '0 and 100 are accepted; above 100 is refused', f6(E.deriveGasRoyaltyRate('onshore', 100)), `refused at ${BADSHARE}`, (() => { try { E.deriveGasRoyaltyRate('onshore', BADSHARE); return false; } catch { return true; } })()],
];
table(['rule', 'the boundary', 'at the boundary', 'just past it'], B.map(([r, b, at, past]) => [r, b, at, past]));
B.forEach(([r, , , , okk]) => must(`boundary: ${r}`, okk, r));
w();
w('The cost price ratio claims the lesser of the recoverable pool and the cap, so a pool equal to the cap is claimed in full and carries nothing. HCDT is 0 in a year whose preceding opex is 0 or not stated.');

/* ============================================================ SECTION 24 */

section('concepts', 'The texts quoted: every provision the course cites, computed or concept-only', ['Expert m01', 'Expert m03', 'Expert m04', 'Professional m01 l05']);
w('Each provision below is quoted from its gazetted text with its citation. The paraphrase is the course\'s; the quotation is the text\'s, verbatim with whitespace collapsed and each dash the gazette prints shown as a colon, verified against the text by quote_check.py. The last column says whether the engine computes the provision. A concept-only provision is never in a capstone or a keyed question that needs a number.');
w();
const CONCEPT_GROUPS = [
  ['ROYALTY: the text behind the royalty lines (computed in ' + ref('tranches') + ', ' + ref('gas') + ' and ' + ref('price') + ')', ['pia_royalty_condensate_ngl', 'pia_royalty_terrain_rates', 'pia_royalty_deep_offshore_tranche', 'pia_royalty_small_field_scope', 'pia_royalty_small_field_tranches', 'pia_royalty_small_field_above_10000', 'pia_royalty_gas', 'pia_price_royalty_levels', 'pia_price_royalty_example', 'pia_price_royalty_escalation', 'pia_price_royalty_frontier',
    'regs_sliding_scale_crude_plus_condensate', 'regs_daily_rate_basis', 'regs_deep_offshore_weighted', 'regs_onshore_shallow_up_to_5000', 'regs_onshore_shallow_5000_10000', 'regs_onshore_above_10000', 'regs_shallow_above_10000', 'regs_frontier_flat', 'regs_price_royalty_per_stream', 'regs_gas_in_country', 'regs_ngl_5pct', 'regs_gas_export_5pct', 'regs_benchmark_escalation', 'regs_benchmark_table', 'regs_r13_2_b_less_than', 'regs_r13_2_c_greater_than', 'pia_price_royalty_high_wording'], 'computed'],
  ['ROYALTY: what the engine does not compute', ['pia_fiscal_oil_price', 'pia_fiscal_oil_price_export_parity', 'pia_royalty_straddling', 'regs_straddling_onshore_shallow', 'regs_straddling_shallow_deep'], 'concept-only'],
  ['HYDROCARBON TAX: the text behind the lines (computed in ' + ref('hctscope') + ', ' + ref('hctbase') + ' and ' + ref('allowances') + ')', ['pia_hct_scope_liquids', 'pia_hct_not_deep_frontier', 'pia_hct_deduct_royalties', 'pia_hct_deduct_decom_fund', 'pia_hct_deduct_levies', 'pia_hct_deduct_hcdt_nddc', 'pia_hct_nondeduct_income_taxes', 'pia_hct_nondeduct_cpr_forfeit', 'pia_loss_relief', 'pia_loss_relief_by_class', 'pia_loss_relief_order', 'pia_cpr_reference', 'pia_cpr_limit_65', 'pia_cpr_carryforward', 'pia_cpr_carryforward_within_limit', 'pia_cpr_forfeiture', 'pia_hct_rate_30', 'pia_hct_rate_15', 'pia_hcdt_contribution', 'pia_hcdt_deductible', 'pia_capital_allowance_rates', 'pia_capital_allowance_retention', 'pia_production_allowance_converted', 'pia_production_allowance_new_per_field', 'pia_production_allowance_onshore', 'pia_production_allowance_shallow', 'pia_production_allowance_deep_frontier', 'pia_production_allowance_condensate', 'pia_hct_not_deductible_cit', 'pia_cit_deduct_royalties', 'pia_cit_deduct_funds'], 'computed'],
  ['HYDROCARBON TAX: what the engine does not compute', ['pia_hct_nag_condensate_excluded', 'pia_hct_ag_cost_allocation', 'pia_hct_nondeduct_bonuses', 'pia_loss_relief_deferral_election', 'pia_additional_tax_trigger', 'pia_additional_tax_fiscal_price', 'nta_additional_tax_trigger', 'nta_additional_tax_fiscal_price', 'pia_exploration_appraisal_expensing', 'pia_consolidation_cit', 'pia_consolidation_hct', 'pia_gas_incentives', 'pia_fiscal_stabilisation'], 'concept-only'],
  ['PRODUCTION SHARING CONTRACTS UNDER THE ACT (concept-only; the fiscal course owns production sharing as design)', ['pia_psc_cost_limit_new', 'pia_psc_cost_limit_converted', 'pia_psc_min_profit_oil_a_c', 'pia_psc_min_profit_oil_d_f'], 'concept-only'],
  ['THE NIGERIA TAX ACT 2025: what it moved and changed (computed where ' + ref('framework') + ' and ' + ref('edges') + ' show it)', ['nta_commencement_note', 'nta_pia_deletions', 'nta_tetfund_deletions', 'nta_repeals_opening', 'nta_repeal_cita', 'nta_repeal_ppta', 'nta_cit_rate', 'nta_hct_scope_terrains', 'nta_hct_scope_liquids', 'nta_hct_not_frontier', 'nta_hct_rate_30', 'nta_hct_rate_15', 'nta_decom_not_deductible', 'nta_decom_escrow_30', 'nta_decom_bank_accredited', 'nta_production_allowance_two_terrains', 'nta_capital_allowance_rates', 'nta_capital_allowance_notional_1pct'], 'computed'],
  ['THE NIGERIA TAX ACT 2025 RESTATES: the royalty, the cost price ratio, the deductions, loss relief and the converted-lease allowance carried into it (computed; the engine applies them under both frameworks)', ['nta_royalty_rates_restated', 'nta_royalty_deep_offshore_tranche_restated', 'nta_royalty_small_field_scope_restated', 'nta_royalty_small_field_tranches_restated', 'nta_royalty_small_field_above_10000_restated', 'nta_price_royalty_restated', 'nta_price_royalty_example_restated', 'nta_price_royalty_escalation_restated', 'nta_price_royalty_high_wording', 'nta_gas_royalty_restated', 'nta_cpr_65', 'nta_production_allowance_converted', 'nta_hct_deduct_royalties', 'nta_hct_deduct_levies', 'nta_hct_deduct_hcdt_nddc', 'nta_loss_relief', 'nta_loss_relief_by_class', 'nta_loss_relief_order', 'nta_hct_not_deductible_cit', 'nta_cit_deduct_royalties', 'nta_cit_deduct_funds', 'nta_pia_deletion_para_14_6'], 'computed'],
  ['THE NIGERIA TAX ACT 2025: what the engine does not compute', ['nta_consolidation_cit', 'nta_consolidation_hct', 'nta_gas_pipeline_incentive', 'nta_gas_transfer_taxed', 'nta_min_etr', 'nta_min_etr_scope', 'nta_min_etr_definition', 'nta_min_etr_profits', 'nta_nag_window', 'nta_nag_credit_low_liquids', 'nta_nag_credit_mid_liquids', 'nta_nag_credit_10_years', 'nta_nag_after_2029', 'nta_nag_credit_carryforward', 'nta_fiscal_stabilisation', 'nta_fiscal_stabilisation_list'], 'concept-only'],
];
CONCEPT_GROUPS.forEach(([title, ids, status]) => {
  w(`${title}:`);
  w();
  cTable(ids, status === 'computed' ? 'computed' : 'concept-only');
  w();
});
const EXTRA = CONCEPTS.filter((c) => !USED.has(c.id));
if (EXTRA.length) {
  w('FURTHER TEXT THE COURSE MAY CITE:');
  w();
  cTable(EXTRA.map((c) => c.id), 'see ' + ref('provisions'));
  w();
}
must('every concepts.json entry is printed', CONCEPTS.every((c) => USED.has(c.id)), CONCEPTS.filter((c) => !USED.has(c.id)).map((c) => c.id).join(','));
must('every concepts.json entry is found and carries a quote', CONCEPTS.every((c) => c.found === true && c.quote && c.cite && c.paraphrase), 'found');
w('A MISPRINT IN THE TEXT IS QUOTED AS PRINTED. Seventh Schedule para 14(4)(d) prints "over 250 million barrels" where the scale\'s own steps need 350; the Regulations\' Schedule prints the middle benchmark column as 102.00 to 110.00, which does not follow its own 2 percent rule (' + ref('price') + '). The course quotes each as printed and says so.');


/* ============================================================ SECTION 25 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('These words carry a narrower meaning in this course than they have in conversation or elsewhere in the academy. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it can mean elsewhere', 'the rule here'], [
  ['royalty', 'any payment to the state', 'the production royalty on liquids and gas plus the royalty by price, as the engine\'s total royalty; name which part when only one is meant'],
  ['royalty by price', 'a sliding royalty in general', 'the Seventh Schedule para 11 royalty on crude oil and condensate, 0 to 10 percent between the escalated benchmarks, always with its base year stated'],
  ['terrain', 'the ground or the water depth', 'one of onshore, shallow_water, deep_offshore, frontier, as a stated input; the engine does not read the water depth'],
  ['converted lease', 'any lease under the Act', 'a petroleum mining lease converted from an oil mining lease under the Act\'s conversion (engine `pia_lease_status` "converted")'],
  ['new lease', 'a recently signed lease', 'a petroleum mining lease granted out of new acreage (engine `pia_lease_status` "new")'],
  ['a year under the Act alone', 'any year after 2021', 'a year of assessment the engine reads as "pia_only" (before 2026 under "auto")'],
  ['a year under the Nigeria Tax Act 2025', 'any year after June 2025', 'a year of assessment the engine reads as "nta_2025" (2026 onward under "auto")'],
  ['open reading', 'an opinion', 'one of the three questions the texts leave open (the royalty by price base year, the new-lease rate onshore or in shallow water, the deep offshore rate under the Nigeria Tax Act 2025); taught, never graded'],
  ['stated reading', 'the correct reading', 'the answer to an open reading that a run states as an input; never presented as the law'],
  ['government take', 'any government share', 'the engine\'s undiscounted take: government cash flow over revenue less capex less opex (' + ref('take') + ')'],
  ['at the share', 'at 100 percent', 'at the stated working interest; every money figure in a ledger is at the share'],
  ['concept-only', 'unimportant', 'taught from the text with its citation and never graded on a number'],
]);
w();
w('A FIGURE THAT DEPENDS ON A SETTING is quoted with it: a royalty by price with its base year, a hydrocarbon tax on a new lease onshore or in shallow water with its stated rate, a deep offshore hydrocarbon tax under the Nigeria Tax Act 2025 with its stated reading, a money figure with its working interest.');

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', process.env.EC7_DUMP_PARTIAL || unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', process.env.EC7_DUMP_PARTIAL || SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)));
must('no em or en dash reaches the digest', !OUT.some((l) => /[–—]/.test(l)), OUT.find((l) => /[–—]/.test(l)));

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`pia_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.EC7_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`pia_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
