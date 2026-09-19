// THE H1 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-safetystats.md,
// the oracle and the engine's own source comments are PROVENANCE. Where a
// figure in FINDINGS is teachable (the IOGP five-year FAR, the Garwood table),
// this file recomputes it through the engine and prints it, and a writer quotes
// the digest line.
//
// Usage:  sh /root/hse-wip-safetystats/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/hse-wip-safetystats/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from the vendored case file), "stated" (an input
// named on the same row) or "derived" (arithmetic on engine values printed in
// the same block, with the arithmetic stated). Nothing here reads a clock, a
// random number, a locale or a network, and TZ and LC_ALL are pinned by
// build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names; `success()` asserts no error key
// and every top-level number finite; every claim a sentence makes about a
// table goes through `must()`. If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads h1_capstone.mjs,
// fields.json or the capstone scenarios, and the capstone never reads this.
//
// THIS ENGINE HAS NO REPAIR HISTORY, so no section of this digest describes
// former behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import * as T from './h1_fields.mjs';

const HERE = process.env.H1_WAVE_DIR || '/root/hse-wip-safetystats';
const ROOT = process.env.H1_ENGINES || '/root/wt-h1-nextgen/packages/engines';
const ENGINE_REL = 'engines/hse/safetyStats.js';
const S = await import(`${ROOT}/${ENGINE_REL}`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/hse/goldens/safetyStats_cases.json`, 'utf8'));
const CASES = GOLD.cases;
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
      bad.map(([k, v]) => `${k}=${v}`).join(', ') || 'every number finite');
  }
  return r;
};
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned ${JSON.stringify(r).slice(0, 80)}`);
  must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, r && r.field);
  const nums = r ? Object.values(r).filter((v) => typeof v === 'number') : [];
  must(`A REFUSAL CARRIES NO NUMBER: ${label}`, nums.length === 0, nums.join(','));
  return r;
};
const golden = (id) => {
  const c = CASES.find((x) => x.id === id);
  if (!must(`the golden case ${id} exists`, !!c, id)) return { args: {}, expected: {} };
  return c;
};
const f6 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(6));
const f12 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(12));
const rel = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a - b) / Math.abs(b));
const relE = (a, b) => { const r = rel(a, b); return r === 0 ? '0' : r.toExponential(2); };
const sum = (a) => a.reduce((x, y) => x + y, 0);
const B2 = S.RATE_BASES.OSHA_200K;
const B6 = S.RATE_BASES.IOGP_1M;
const B8 = S.RATE_BASES.FAR_100M;

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
const ORDER = ['computes', 'base', 'hours', 'refusals', 'bls', 'classes', 'far', 'severity', 'pse',
  'pooling', 'rolling', 'basis', 'draw', 'garwood', 'coverage', 'fraction', 'zero', 'compare',
  'convention', 'published', 'uchart', 'signals', 'meaning', 'beforeafter', 'benchmark', 'traps',
  'classify', 'vocabulary'];
const ref = (key) => {
  const i = ORDER.indexOf(key);
  must(`a sentence refers to a declared section ${key}`, i >= 0, key);
  return `section ${i + 1}`;
};
let SECTION = 0;
const OWNED = new Set();
const section = (key, title, owners) => {
  SECTION += 1;
  must(`section ${key} is declared at position ${SECTION}`, ORDER[SECTION - 1] === key, `${ORDER[SECTION - 1]} at ${SECTION}`);
  owners.forEach((o) => OWNED.add(o.split(' ').slice(0, 2).join(' ')));
  w();
  w(`# SECTION ${SECTION}: ${title} (owned by ${ownerClause(owners)})`);
  w();
};
const table = (head, rows) => {
  w(`| ${head.join(' | ')} |`);
  w(`| ${head.map(() => '---').join(' | ')} |`);
  rows.forEach((r) => w(`| ${r.join(' | ')} |`));
};

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
const refusalsInGolden = CASES.filter((c) => c.expected && c.expected.error === true).length;
w('# H1 TEACHING DIGEST: Safety Performance Statistics & KPIs');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Rates on every base, interval limits, rate ratios, p-values, proportions, exposure units, centre lines and derived hours print to SIX decimals; chi-square and gamma quantities print to TWELVE; counts and stated hours are whole numbers; relative differences print in exponent form.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines f123a57, ${engineLines} lines, importing nothing. The vendored golden test-data/hse/goldens/safetyStats_cases.json carries ${CASES.length} cases, ${refusalsInGolden} of them refusals, written by the scipy and mpmath oracle.`);
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone workplace, no capstone count or hours and no graded answer. The capstones run their own workplaces and the digest never names them.');
w();
w('# THIS ENGINE HAS NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every rate in this engine is a count times a base over exposure hours. Every function returns either a result object carrying a `basis` block or an object with `error` and `field`, where `field` names the offending input.');
w();
const EXPORTS = [
  ['incidenceRate', 'count, exposureHours, base', 'a rate for any case class the caller counts: recordables, DART cases, lost time cases'],
  ['fatalAccidentRate', 'fatalities, exposureHours', 'fatalities per 100,000,000 hours; the one rate with a fixed base'],
  ['severityRate', 'daysLost, exposureHours, base', 'days lost times the base over the hours; no time charges added'],
  ['pseRate', 'tier, pseCount, exposureHours, base', 'an API RP 754 process safety event rate; the tier is an input'],
  ['pooledRate', 'counts, exposureHours, base', 'sum of counts times the base over the sum of hours, with the mean of the period rates beside it'],
  ['rollingRate', 'counts, exposureHours, base, windowPeriods', 'one sum-then-divide rate per complete trailing window'],
  ['rateConfidenceInterval', 'count, exposureHours, base, confidence', 'the Garwood exact interval for a Poisson count, scaled to the base'],
  ['compareRates', 'count1, exposureHours1, count2, exposureHours2, confidence', 'the conditional exact test: rate ratio, its interval and a central p-value'],
  ['uChart', 'counts, exposureHours, base', 'a Shewhart u-chart with varying exposure'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof S[name] === 'function', typeof S[name]));
table(['function', 'what it needs', 'what it returns'], EXPORTS.map(([n, a, r]) => [`\`${n}\``, a, r]));
w();
w('The special functions the interval needs are exported too: `logGamma`, `regularizedGammaP`, `regularizedGammaQ`, `chiSquareQuantile` and `chiSquareQuantileUpper`.');
w();
w('The named bases, read from the exported `RATE_BASES`:');
w();
table(['name', 'hours'], Object.entries(S.RATE_BASES).map(([k, v]) => [`\`${k}\``, String(v)]));
must('RATE_BASES carries exactly three bases', Object.keys(S.RATE_BASES).length === 3, Object.keys(S.RATE_BASES));
must('RATE_BASES is frozen', Object.isFrozen(S.RATE_BASES), 'frozen');
w();
w('WHAT THE ENGINE DOES NOT DO, read from its own header and checked here against its exports:');
must('the engine exports no classification function', !Object.keys(S).some((k) => /classif|tierOf|recordab/i.test(k)), Object.keys(S).join(','));
must('the engine carries no benchmark table', !/benchmark/i.test(Object.keys(S).join(',')), 'no export names a benchmark');
w('- It does not classify an event as recordable, DART or lost time. The count arrives classified.');
w('- It does not classify a process safety event into API RP 754 Tier 1 or Tier 2. The threshold quantity tables are licensed content and are not in the engine; the tier is an input.');
w(`- It carries no benchmark rates. The IOGP figures in ${ref('benchmark')} come from the vendored golden, where they are published inputs.`);
w(`- Its exported names are, in full: ${Object.keys(S).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('base', 'A rate is a count over exposure, and the caller names the base', ['Associate m01', 'Associate m02']);
const U = T.UGHELLI;
w(`The UGHELLI stream is one site for one year: ${U.hours} hours (stated), ${U.recordables} recordable cases, ${U.dartCases} DART cases, ${U.lostTimeCases} lost time cases, ${U.fatalities} fatalities, ${U.daysLost} days lost, ${U.tier1Pse} Tier 1 and ${U.tier2Pse} Tier 2 process safety events (all stated).`);
w();
const bases = [B2, B6, B8];
const uRates = bases.map((b) => success(`UGHELLI incidenceRate on ${b}`, S.incidenceRate({ count: U.recordables, exposureHours: U.hours, base: b })));
table(['base, hours', 'recordable rate', 'the engine baseLabel'], uRates.map((r) => [String(r.basis.base), f6(r.rate), r.basis.baseLabel]));
w();
const r61 = uRates[1].rate / uRates[0].rate;
const r81 = uRates[2].rate / uRates[0].rate;
must('the million-hour rate is five times the OSHA rate', Math.abs(r61 - 5) < 1e-12, r61);
must('the FAR-base rate is five hundred times the OSHA rate', Math.abs(r81 - 500) < 1e-9, r81);
w(`Derived: the million-hour figure over the OSHA figure is ${f6(r61)}, and the hundred-million-hour figure over the OSHA figure is ${f6(r81)}. The count and the hours did not change; only the base did. That is the whole reason the engine takes no default.`);
w();
w(`The formula the engine reports in \`basis.formula\`: ${uRates[0].basis.formula}.`);
const noBase = refusal('UGHELLI incidenceRate with no base', S.incidenceRate({ count: U.recordables, exposureHours: U.hours }), 'base');
w();
w('A call with no base is refused, and the refusal names the field. The engine\'s own words:');
w();
w(`> ${noBase.error}`);

/* ============================================================ SECTION 3 */

section('hours', 'Why hours and never headcount', ['Associate m01']);
const R0 = T.ROSTERS;
const day = success('ROSTERS day crew', S.incidenceRate({ count: R0.dayCrew.recordables, exposureHours: R0.dayCrew.hours, base: B2 }));
const rot = success('ROSTERS rotation crew', S.incidenceRate({ count: R0.rotationCrew.recordables, exposureHours: R0.rotationCrew.hours, base: B2 }));
w(`Two crews of ${R0.headcount} people each (stated), one recordable each (stated). The day crew worked ${R0.dayCrew.hours} hours and the rotation crew ${R0.rotationCrew.hours} hours (stated).`);
w();
table(['crew', 'hours', 'recordables', 'rate per 200,000 hours', 'recordables per 100 people, derived'], [
  ['day crew', String(R0.dayCrew.hours), String(R0.dayCrew.recordables), f6(day.rate), f6((R0.dayCrew.recordables / R0.headcount) * 100)],
  ['rotation crew', String(R0.rotationCrew.hours), String(R0.rotationCrew.recordables), f6(rot.rate), f6((R0.rotationCrew.recordables / R0.headcount) * 100)],
]);
must('the two crews have different rates on hours', Math.abs(day.rate - rot.rate) > 0.1, `${day.rate} ${rot.rate}`);
w();
w(`Derived: the day crew rate over the rotation crew rate is ${f6(day.rate / rot.rate)}, which is the rotation crew's hours over the day crew's hours, ${f6(R0.rotationCrew.hours / R0.dayCrew.hours)}. Per head the two crews read the same; per hour of exposure they do not. The engine takes hours and has no headcount input at all.`);
must('the rate ratio equals the inverse hours ratio', Math.abs(day.rate / rot.rate - R0.rotationCrew.hours / R0.dayCrew.hours) < 1e-12, 'ratio');
w();
w(`WHERE THE OSHA BASE COMES FROM. The engine labels 200,000 hours "${S.incidenceRate({ count: 1, exposureHours: 1, base: B2 }).basis.baseLabel}". Derived: 100 times 40 times 50 is ${100 * 40 * 50}, which is the exported \`OSHA_200K\`, ${S.RATE_BASES.OSHA_200K}.`);
must('100 x 40 x 50 is the exported OSHA base', 100 * 40 * 50 === S.RATE_BASES.OSHA_200K, S.RATE_BASES.OSHA_200K);

/* ============================================================ SECTION 4 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m03', 'Associate m04', 'Professional m02 l04', 'Professional m04 l05', 'Expert m01 l05']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number.');
w();
const REFUSALS = [
  ['incidenceRate', { count: 1.5, exposureHours: 1000, base: B2 }, 'count', 'a fractional count'],
  ['incidenceRate', { count: -1, exposureHours: 1000, base: B2 }, 'count', 'a negative count'],
  ['incidenceRate', { count: 1, exposureHours: 0, base: B2 }, 'exposureHours', 'zero hours'],
  ['incidenceRate', { count: 1, exposureHours: 1000 }, 'base', 'no base'],
  ['incidenceRate', { count: 1, exposureHours: 1000, base: -200000 }, 'base', 'a negative base'],
  ['fatalAccidentRate', { fatalities: 1, exposureHours: 0 }, 'exposureHours', 'zero hours'],
  ['severityRate', { daysLost: -3, exposureHours: 1000, base: B2 }, 'daysLost', 'negative days'],
  ['severityRate', { daysLost: 3, exposureHours: 1000 }, 'base', 'no base'],
  ['pseRate', { tier: 3, pseCount: 1, exposureHours: 1000, base: B2 }, 'tier', 'tier 3'],
  ['pseRate', { pseCount: 1, exposureHours: 1000, base: B2 }, 'tier', 'no tier'],
  ['pseRate', { tier: 1, pseCount: 1, exposureHours: 1000, base: B8 }, 'base', 'the FAR base'],
  ['pooledRate', { counts: [1, 2], exposureHours: [1000], base: B2 }, 'exposureHours', 'arrays of different length'],
  ['pooledRate', { counts: [1, 2], exposureHours: [1000, 0], base: B2 }, 'exposureHours[1]', 'events in a period with no hours'],
  ['pooledRate', { counts: [0, 0], exposureHours: [0, 0], base: B2 }, 'exposureHours', 'no hours anywhere'],
  ['rollingRate', { counts: [1, 2], exposureHours: [1000, 1000], base: B2 }, 'windowPeriods', 'no window'],
  ['rollingRate', { counts: [1, 2], exposureHours: [1000, 1000], base: B2, windowPeriods: 12 }, 'windowPeriods', 'a window longer than the series'],
  ['rateConfidenceInterval', { count: 1, exposureHours: 1000, base: B2, confidence: 95 }, 'confidence', 'confidence as a percentage'],
  ['rateConfidenceInterval', { count: 1, exposureHours: 1000, base: B2 }, 'confidence', 'no confidence'],
  ['compareRates', { count1: 0, exposureHours1: 1000, count2: 0, exposureHours2: 1000, confidence: 0.95 }, 'count1', 'both groups empty'],
  ['compareRates', { count1: 1, exposureHours1: 1000, count2: 2, exposureHours2: 0, confidence: 0.95 }, 'exposureHours2', 'a group with no hours'],
  ['uChart', { counts: [1, 0, 2], exposureHours: [1000, 0, 1000], base: B2 }, 'exposureHours[1]', 'a point with no hours'],
  ['uChart', { counts: [0, 0], exposureHours: [1000, 1000], base: B2 }, 'counts', 'no events in any period'],
];
table(['function', 'what was passed', 'field named', 'the engine\'s message'], REFUSALS.map(([fn, args, field, what]) => {
  const r = refusal(`${fn} with ${what}`, S[fn](args), field);
  return [`\`${fn}\``, what, `\`${r.field}\``, r.error];
}));
w();
w(`${REFUSALS.length} refusals are tabled above, across ${new Set(REFUSALS.map((r) => r[0])).size} functions.`);
must('every public rate function appears in the refusal table', EXPORTS.every(([n]) => REFUSALS.some((r) => r[0] === n)), 'all nine');

/* ============================================================ SECTION 5 */

section('bls', 'The BLS worked example, reproduced through the engine', ['Associate m02', 'Associate m06']);
const bls = golden('bls-trir-abc-company');
const blsD = golden('bls-dart-abc-company');
const blsR = success('BLS TRIR', S.incidenceRate(bls.args));
const blsDR = success('BLS DART', S.incidenceRate(blsD.args));
w(`The golden's source line: ${bls.published.ref}`);
w();
table(['case', 'count, golden', 'hours, golden', 'base', 'rate', 'golden rate', 'published', 'relative difference'], [
  ['ABC Company, recordables', String(bls.args.count), String(bls.args.exposureHours), String(bls.args.base), f6(blsR.rate), f6(bls.expected.rate), String(bls.published.value), relE(blsR.rate, bls.expected.rate)],
  ['ABC Company, DART', String(blsD.args.count), String(blsD.args.exposureHours), String(blsD.args.base), f6(blsDR.rate), f6(blsD.expected.rate), String(blsD.published ? blsD.published.value : blsD.expected.rate), relE(blsDR.rate, blsD.expected.rate)],
]);
must('the BLS TRIR reproduces the published 3.5', blsR.rate === 3.5, blsR.rate);
must('the BLS DART reproduces 1.5', blsDR.rate === 1.5, blsDR.rate);

/* ============================================================ SECTION 6 */

section('classes', 'TRIR, DART and lost time on both bases', ['Associate m02']);
const classes = [['recordable', U.recordables], ['DART', U.dartCases], ['lost time', U.lostTimeCases]];
table(['case class', 'count, stated', 'per 200,000 hours', 'per 1,000,000 hours', 'ratio, derived'], classes.map(([n, c]) => {
  const a = success(`UGHELLI ${n} OSHA`, S.incidenceRate({ count: c, exposureHours: U.hours, base: B2 }));
  const b = success(`UGHELLI ${n} IOGP`, S.incidenceRate({ count: c, exposureHours: U.hours, base: B6 }));
  return [n, String(c), f6(a.rate), f6(b.rate), f6(b.rate / a.rate)];
}));
w();
w('The engine has one function for all three. The case class is the caller\'s count, and the name a company prints beside the number (TRIR, DART rate, LTIF, LTIR) is not something the engine checks. IOGP\'s LTIR counts fatalities plus lost workday cases per million hours, and its TRIR counts fatalities, lost workday cases, restricted workday cases and medical treatment cases per million hours; the definitions sit in the engine FINDINGS record as provenance.');

/* ============================================================ SECTION 7 */

section('far', 'The fatal accident rate, and why it alone has a fixed base', ['Associate m03', 'Expert m04']);
const far24 = golden('iogp-far-2024');
const far23 = golden('iogp-far-2023');
const farInc = golden('iogp-far-2024-as-incidence-rate');
const fir = golden('iogp-fir-2024');
const e24 = success('IOGP FAR 2024', S.fatalAccidentRate(far24.args));
const e23 = success('IOGP FAR 2023', S.fatalAccidentRate(far23.args));
const eInc = success('IOGP FAR 2024 through incidenceRate', S.incidenceRate(farInc.args));
const eFir = success('IOGP FIR 2024', S.incidenceRate(fir.args));
table(['case', 'count, golden', 'hours, golden', 'rate', 'golden rate', 'published', 'relative difference'], [
  ['IOGP 2024 FAR', String(far24.args.fatalities), String(far24.args.exposureHours), f6(e24.rate), f6(far24.expected.rate), String(far24.published.value), relE(e24.rate, far24.expected.rate)],
  ['IOGP 2023 FAR', String(far23.args.fatalities), String(far23.args.exposureHours), f6(e23.rate), f6(far23.expected.rate), String(far23.published.value), relE(e23.rate, far23.expected.rate)],
  ['IOGP 2024 FAR through incidenceRate on 100,000,000', String(farInc.args.count), String(farInc.args.exposureHours), f6(eInc.rate), f6(farInc.expected.rate), String(farInc.published.value), relE(eInc.rate, farInc.expected.rate)],
  ['IOGP 2024 fatal incidents per 100,000,000 hours', String(fir.args.count), String(fir.args.exposureHours), f6(eFir.rate), f6(fir.expected.rate), 'none printed', relE(eFir.rate, fir.expected.rate)],
]);
must('FAR and incidenceRate on the FAR base agree exactly', e24.rate === eInc.rate, `${e24.rate} ${eInc.rate}`);
must('the 2024 FAR rounds to the published 0.77', e24.rate.toFixed(2) === '0.77', e24.rate);
must('the 2023 FAR rounds to the published 0.82', e23.rate.toFixed(2) === '0.82', e23.rate);
w();
w(`\`fatalAccidentRate\` takes no base argument; its \`basis.base\` is ${e24.basis.base} and its \`basis.standard\` reads "${e24.basis.standard}". The engine takes the IOGP definition of FAR and fixes its base. Other bodies use related framings, such as fatalities per worker-year or the same hours read as a number of working lifetimes, so a fatal rate quoted from elsewhere needs its definition checked before it is set beside this one. Every other rate in this course is quoted on more than one base, so the engine refuses to guess.`);
w();
w(`A fatality count and a fatal incident count are different counts: 2024 had ${far24.args.fatalities} fatalities in ${fir.args.count} fatal incidents (golden). The first gives the FAR and the second the fatal incident rate, on the same hours.`);
w();
const farU = success('UGHELLI FAR', S.fatalAccidentRate({ fatalities: U.fatalities, exposureHours: U.hours }));
w(`UGHELLI, with ${U.fatalities} fatalities in ${U.hours} hours, has an observed FAR of ${f6(farU.rate)}. A zero FAR on a few million hours says little; ${ref('zero')} is where the upper limit on a zero count lives.`);

/* ============================================================ SECTION 8 */

section('severity', 'The severity rate has no single standard', ['Associate m03']);
const sv2 = success('UGHELLI severity OSHA', S.severityRate({ daysLost: U.daysLost, exposureHours: U.hours, base: B2 }));
const sv6 = success('UGHELLI severity IOGP', S.severityRate({ daysLost: U.daysLost, exposureHours: U.hours, base: B6 }));
table(['base', 'days lost, stated', 'severity rate', 'the engine note'], [
  [String(B2), String(U.daysLost), f6(sv2.rate), sv2.basis.note],
  [String(B6), String(U.daysLost), f6(sv6.rate), sv6.basis.note],
]);
w();
w(`Derived, and a different quantity: days lost per lost time case is ${U.daysLost} over ${U.lostTimeCases}, which is ${f6(U.daysLost / U.lostTimeCases)} days a case. That is the shape of IOGP's LWDC severity, days per case, and it has no hours in it at all. The engine does not compute it.`);
w();
const svG = [golden('severity-osha-base'), golden('severity-million-base')];
table(['golden case', 'days, golden', 'hours, golden', 'base', 'rate', 'golden rate', 'relative difference'], svG.map((g) => {
  const r = success(`golden ${g.id}`, S.severityRate(g.args));
  return [g.id, String(g.args.daysLost), String(g.args.exposureHours), String(g.args.base), f6(r.rate), f6(g.expected.rate), relE(r.rate, g.expected.rate)];
}));
w();
w(`The engine accepts a fractional number of days (the second golden case passes ${svG[1].args.daysLost}) and refuses a negative one. The base is required here exactly as it is for an incidence rate, because the OSHA-style convention uses 200,000 and the ANSI Z16.1 convention used 1,000,000 with scheduled time charges for fatalities and permanent disabilities, which the engine does not add.`);

/* ============================================================ SECTION 9 */

section('pse', 'The API RP 754 process safety event rate, with the tier as an input', ['Associate m03 l05', 'Expert m06 l02']);
const pse = [[1, U.tier1Pse, B2], [1, U.tier1Pse, B6], [2, U.tier2Pse, B2], [2, U.tier2Pse, B6]].map(([tier, c, b]) => {
  const r = success(`UGHELLI PSE tier ${tier} base ${b}`, S.pseRate({ tier, pseCount: c, exposureHours: U.hours, base: b }));
  must(`the PSE result carries tier ${tier}`, r.tier === tier, r.tier);
  return [String(tier), String(c), String(b), f6(r.rate), r.basis.formula];
});
table(['tier, stated', 'events, stated', 'base', 'PSE rate', 'the engine formula'], pse);
w();
const pseStd = S.pseRate({ tier: 1, pseCount: 1, exposureHours: 1000, base: B2 }).basis.standard;
w(`The engine's standard line: "${pseStd}". Only the 200,000 and 1,000,000 bases are accepted, "consistent with the basis for calculating the Company's occupational injury rate". ${ref('refusals').replace('s', 'S')} tables the refusals for tier 3, a missing tier and the FAR base.`);
w();
w('The engine does not decide whether an event is Tier 1 or Tier 2. That needs the threshold quantity tables of API RP 754, which are licensed and are not in the engine, the golden or this course. A learner who is given a tier can rate it; a learner who is given a release has to classify it outside this engine.');
const pg = [golden('pse-tier1-200k'), golden('pse-tier2-1m')];
w();
table(['golden case', 'tier', 'events', 'hours', 'base', 'rate', 'golden rate', 'relative difference'], pg.map((g) => {
  const r = success(`golden ${g.id}`, S.pseRate(g.args));
  return [g.id, String(g.args.tier), String(g.args.pseCount), String(g.args.exposureHours), String(g.args.base), f6(r.rate), f6(g.expected.rate), relE(r.rate, g.expected.rate)];
}));

/* ============================================================ SECTION 10 */

section('pooling', 'Sum, then divide: pooling sites', ['Associate m04', 'Expert m05 l05']);
const K = T.KWALE;
const kp = success('KWALE pooledRate', S.pooledRate({ counts: K.counts, exposureHours: K.hours, base: B2 }));
must('KWALE runs three sites', K.sites.length === 3, K.sites.length);
w('KWALE runs three sites (stated):');
w();
table(['site', 'recordables, stated', 'hours, stated', 'site rate per 200,000'], K.sites.map((s, i) => [s, String(K.counts[i]), String(K.hours[i]), f6(kp.periodRates[i])]));
w();
table(['what', 'value'], [
  ['pooled rate, `rate`', f6(kp.rate)],
  ['pooled count, `count`', String(kp.count)],
  ['pooled hours, `exposureHours`', String(kp.exposureHours)],
  ['mean of the site rates, `meanOfPeriodRates`', f6(kp.meanOfPeriodRates)],
  ['mean over pooled, derived', f6(kp.meanOfPeriodRates / kp.rate)],
]);
must('the mean of the site rates is above the pooled rate on KWALE', kp.meanOfPeriodRates > kp.rate, `${kp.meanOfPeriodRates} ${kp.rate}`);
w();
const jettyShare = K.hours[2] / kp.exposureHours;
must('the jetty carries under five percent of the hours', jettyShare < 0.05, jettyShare);
w(`The engine note, verbatim: "${kp.basis.note}". In the mean of rates each site carries a weight of one third, derived ${f6(1 / 3)}. In the pooled rate each site carries its share of the hours, and the jetty's share, derived, is ${K.hours[2]} over ${kp.exposureHours}, which is ${f6(jettyShare)}. The pooled rate is the rate of the whole workforce; the mean of rates weights a jetty crew like a flow station.`);
w();
const km = success('KWALE with a mothballed site', S.pooledRate({ counts: K.mothballed.counts, exposureHours: K.mothballed.hours, base: B2 }));
w(`A MOTHBALLED SITE with 0 hours and 0 events contributes nothing. With it listed, the pooled rate is ${f6(km.rate)}, its own period rate is ${String(km.periodRates[3])}, because a site with no hours has no rate to report, \`periodsWithoutHours\` is ${km.periodsWithoutHours}, and the mean of rates over the sites with hours is ${f6(km.meanOfPeriodRates)}.`);
must('the mothballed site changes neither the pooled rate nor the mean', km.rate === kp.rate && km.meanOfPeriodRates === kp.meanOfPeriodRates, 'unchanged');
must('the mothballed site rate is null', km.periodRates[3] === null, km.periodRates[3]);
const ke = refusal('KWALE with events at a site with no hours', S.pooledRate({ counts: K.eventsWithoutHours.counts, exposureHours: K.eventsWithoutHours.hours, base: B2 }), 'exposureHours[3]');
w();
w('ONE EVENT at a site with no hours is refused as bad data, naming the period:');
w();
w(`> ${ke.error}`);
w();
const iogp5 = golden('iogp-far-five-year-2020-2024');
const i5 = success('IOGP five-year FAR pooled', S.pooledRate(iogp5.args));
w('THE SAME RULE AT INDUSTRY SCALE. IOGP computes its five-year rolling average as the sum of fatalities over the sum of hours (golden, 2020 to 2024):');
w();
table(['year', 'fatalities, golden', 'hours, golden', 'FAR that year'], iogp5.args.counts.map((c, i) => [String(2020 + i), String(c), String(iogp5.args.exposureHours[i]), f6(i5.periodRates[i])]));
w();
table(['what', 'value', 'golden value', 'relative difference'], [
  ['five-year FAR, sum then divide', f6(i5.rate), f6(iogp5.expected.rate), relE(i5.rate, iogp5.expected.rate)],
  ['mean of the five yearly FARs', f6(i5.meanOfPeriodRates), f6(iogp5.expected.meanOfPeriodRates), relE(i5.meanOfPeriodRates, iogp5.expected.meanOfPeriodRates)],
]);
must('IOGP five-year: the mean of rates differs from the pooled rate', Math.abs(i5.meanOfPeriodRates - i5.rate) > 1e-3, 'differs');

/* ============================================================ SECTION 11 */

section('rolling', 'The rolling rate: one sum-then-divide rate per complete window', ['Associate m05']);
const A = T.AKASO;
const aShut = A.hours.indexOf(0);
const aShort = A.hours.indexOf(Math.min(...A.hours.filter((h) => h > 0)));
must('AKASO: exactly one shutdown month and the short month is month eleven', A.hours.filter((h) => h === 0).length === 1 && aShort === 10, `${aShut} ${aShort}`);
w(`The AKASO stream is ${A.counts.length} months (stated). Month ${aShut + 1} is a shutdown with no hours and month ${aShort + 1} is a short month of ${A.hours[aShort]} hours with ${A.counts[aShort]} recordable.`);
w();
table(['month', 'recordables, stated', 'hours, stated', 'monthly rate per 200,000'], A.counts.map((c, i) => [String(i + 1), String(c), String(A.hours[i]), A.hours[i] > 0 ? f6((c * B2) / A.hours[i]) : 'none: no hours']));
w();
w('The monthly rate column is derived, count times 200,000 over hours, and is the figure the engine averages when it reports the mean of the monthly rates.');
w();
const ar = success('AKASO rollingRate 12', S.rollingRate({ counts: A.counts, exposureHours: A.hours, base: B2, windowPeriods: 12 }));
table(['window', 'months', 'count', 'hours', 'rolling rate', 'mean of monthly rates', 'months without hours'], ar.windows.map((x, i) => [String(i + 1), `${x.startIndex + 1} to ${x.endIndex + 1}`, String(x.count), String(x.exposureHours), f6(x.rate), f6(x.meanOfPeriodRates), String(x.periodsWithoutHours)]));
must('fifteen months give four complete twelve-month windows', ar.windows.length === 4, ar.windows.length);
must('every AKASO window contains the short month and its mean of rates exceeds its rate', ar.windows.every((x) => x.meanOfPeriodRates > x.rate), 'all');
w();
w(`${ar.windows.length} windows from ${A.counts.length} months: one entry per COMPLETE window, and none for the first eleven months, which have no complete window yet. Every window contains the short month, and in every window the mean of the monthly rates sits above the rolling rate, because the short month's own rate of ${f6((A.counts[aShort] * B2) / A.hours[aShort])} enters the mean with the weight of a full month.`);
w();
w(`The engine note, verbatim: "${ar.basis.note}".`);
w();
const NH = T.NO_HOURS_WINDOW;
const aw = success('a rolling window with no hours', S.rollingRate({ counts: NH.counts, exposureHours: NH.hours, base: B2, windowPeriods: NH.windowPeriods }));
w(`A WINDOW WITH NO HOURS has no rate. ${NH.hours.length} periods of ${NH.hours.join(', ')} hours with ${NH.counts.join(', ')} events (stated) and a window of ${NH.windowPeriods} give:`);
w();
table(['window', 'rate', 'mean of rates', 'the engine\'s returned reason'], aw.windows.map((x, i) => [String(i + 1), String(x.rate === null ? 'null' : f6(x.rate)), String(x.meanOfPeriodRates === null ? 'null' : f6(x.meanOfPeriodRates)), x.reason === null ? 'null' : x.reason]));
must('the first two-period window has a null rate and a reason', aw.windows[0].rate === null && typeof aw.windows[0].reason === 'string', aw.windows[0].reason);
w();
const i5r = success('IOGP five-year as a rolling window', S.rollingRate(golden('iogp-far-five-year-rolling-window').args));
w(`THE IOGP FIVE YEAR RULE is a rolling window of 5 years. Run as one: ${i5r.windows.length} window, rate ${f6(i5r.windows[0].rate)}, the same figure ${ref('pooling')} printed as the pooled rate.`);
must('the rolling five-year window equals the pooled five-year rate', i5r.windows[0].rate === i5.rate, 'equal');

/* ============================================================ SECTION 12 */

section('basis', 'What the basis block tells you', ['Associate m06 l03']);
w('Every result carries a `basis` object. It is the part of the answer that says what the number means. Read on the UGHELLI stream and the goldens above:');
w();
const basisRows = [
  ['incidenceRate', uRates[0].basis],
  ['fatalAccidentRate', e24.basis],
  ['severityRate', sv2.basis],
  ['pseRate', S.pseRate({ tier: 1, pseCount: U.tier1Pse, exposureHours: U.hours, base: B2 }).basis],
  ['pooledRate', kp.basis],
  ['rollingRate', ar.basis],
];
table(['function', 'basis keys', 'base', 'formula'], basisRows.map(([n, b]) => [`\`${n}\``, Object.keys(b).join(', '), String(b.base), b.formula]));

/* ============================================================ SECTION 13 */

section('draw', 'A count is a draw: the same observed rate at growing exposure', ['Professional m01']);
w('An event count is modelled by the Poisson count model: the true rate times the exposure gives a mean, and the count observed is one draw around it. The interval says how far the true rate could be from the observed one.');
w();
w(`The IMO ladder holds the observed rate at ${f6(B2 / T.IMO_HOURS_PER_EVENT)} per 200,000 hours and grows the exposure: each count is paired with ${T.IMO_HOURS_PER_EVENT} hours per event (stated).`);
w();
const ladder = T.IMO_LADDER.map((n) => {
  const r = success(`IMO ladder N=${n}`, S.rateConfidenceInterval({ count: n, exposureHours: n * T.IMO_HOURS_PER_EVENT, base: B2, confidence: 0.95 }));
  return { n, r };
});
table(['count', 'hours', 'rate', 'lower 95', 'upper 95', 'upper over lower, derived', 'width over rate, derived'], ladder.map(({ n, r }) => [String(n), String(n * T.IMO_HOURS_PER_EVENT), f6(r.rate), f6(r.lower), f6(r.upper), f6(r.upper / r.lower), f6((r.upper - r.lower) / r.rate)]));
must('every ladder rate is the same', ladder.every(({ r }) => Math.abs(r.rate - B2 / T.IMO_HOURS_PER_EVENT) < 1e-12), 'all equal');
must('the relative width shrinks at every step up the ladder', ladder.every(({ r }, i) => i === 0 || (r.upper - r.lower) / r.rate < (ladder[i - 1].r.upper - ladder[i - 1].r.lower) / ladder[i - 1].r.rate), 'monotone');
w();
w(`Every row reads the same rate. At 1 event the upper limit is ${f6(ladder[0].r.upper / ladder[0].r.lower)} times the lower; at ${ladder.at(-1).n} events it is ${f6(ladder.at(-1).r.upper / ladder.at(-1).r.lower)} times. A rate with no interval beside it hides which row it came from.`);

/* ============================================================ SECTION 14 */

section('garwood', 'The Garwood interval, from the chi-square distribution', ['Professional m02']);
const GN = T.GARWOOD_COUNT;
const gw = success('Garwood mechanics at 95', S.rateConfidenceInterval({ count: GN, exposureHours: 1, base: 1, confidence: 0.95 }));
const alpha = 1 - 0.95;
const qLo = S.chiSquareQuantile(alpha / 2, 2 * GN);
const qHi = S.chiSquareQuantileUpper(alpha / 2, 2 * GN + 2);
w(`For a count N the limits are chi2(alpha/2; 2N)/2 and chi2(1 - alpha/2; 2N + 2)/2, times base over hours. The engine's method line: "${gw.basis.method}".`);
w();
table([`quantity at N = ${GN}, 95 percent`, 'value'], [
  [`chi-square lower quantile, ${2 * GN} degrees of freedom`, f12(qLo)],
  ['half of it, the count lower limit', f12(qLo / 2)],
  ['engine countLower', f12(gw.countLower)],
  [`chi-square upper quantile, ${2 * GN + 2} degrees of freedom`, f12(qHi)],
  ['half of it, the count upper limit', f12(qHi / 2)],
  ['engine countUpper', f12(gw.countUpper)],
]);
must('countLower is half the lower quantile', gw.countLower === qLo / 2, 'equal');
must('countUpper is half the upper quantile', gw.countUpper === qHi / 2, 'equal');
w();
w('The lower limit uses 2N degrees of freedom and the upper uses 2N + 2. The lower limit is the Poisson mean at which N or more events has probability alpha/2, which is a quantile of the gamma distribution of shape N; the upper limit is the mean at which N or fewer events has probability alpha/2, which is a quantile of the gamma distribution of shape N + 1. Twice a gamma of shape k is a chi-square on 2k degrees of freedom, which is where the halves and the two degrees of freedom come from.');
w();
w('THE GARWOOD TABLE, count limits at 95 percent on a base of 1 over 1 hour, against the golden:');
w();
const gt = [0, 1, 2, 3, 5, 10, 32, 100, 1000].map((n) => {
  const g = golden(`garwood-95-count-${n}`);
  const r = success(`Garwood table N=${n}`, S.rateConfidenceInterval(g.args));
  return [String(n), f12(r.countLower), f12(r.countUpper), relE(r.countLower, g.expected.countLower), relE(r.countUpper, g.expected.countUpper)];
});
table(['count', 'count lower', 'count upper', 'lower against golden', 'upper against golden'], gt);
w();
w(`AT OTHER CONFIDENCE LEVELS, the same count of ${GN} on a base of 1 over 1 hour:`);
w();
table(['confidence', 'count lower', 'count upper'], T.CONFIDENCES.map((c) => {
  const r = success(`N=${GN} at ${c}`, S.rateConfidenceInterval({ count: GN, exposureHours: 1, base: 1, confidence: c }));
  return [f6(c), f12(r.countLower), f12(r.countUpper)];
}));

/* ============================================================ SECTION 15 */

section('coverage', 'Conservative by construction: the exact coverage of the 95 percent interval', ['Professional m02 l03']);
w('Derived from the engine: for a true mean mu, the probability of observing k events is Q(k + 1, mu) minus Q(k, mu), with the engine\'s `regularizedGammaQ` (and Q(0, mu) taken as 0). The interval for k covers mu when countLower(k) <= mu <= countUpper(k). The coverage is the sum of the probabilities of the k whose interval covers mu.');
w();
const intervals = [];
for (let k = 0; k <= 80; k += 1) intervals.push(S.rateConfidenceInterval({ count: k, exposureHours: 1, base: 1, confidence: 0.95 }));
const pmf = (k, mu) => S.regularizedGammaQ(k + 1, mu) - (k === 0 ? 0 : S.regularizedGammaQ(k, mu));
const cov = T.COVERAGE_MEANS.map((mu) => {
  let c = 0; let tot = 0;
  for (let k = 0; k <= 80; k += 1) {
    const p = pmf(k, mu);
    tot += p;
    if (intervals[k].countLower <= mu && mu <= intervals[k].countUpper) c += p;
  }
  must(`the probabilities to 80 events sum to one at mu ${mu}`, Math.abs(tot - 1) < 1e-9, tot);
  return [f6(mu), f6(c), f6(tot)];
});
table(['true mean', 'coverage', 'total probability summed'], cov);
must('the coverage is at least 0.95 at every probe', cov.every((r) => Number(r[1]) >= 0.95), cov.map((r) => r[1]).join(','));
w();
w('The coverage is at or above 0.95 at every mean probed. A count is a whole number, so no interval built from it can cover exactly 95 percent at every mean; the exact interval is built so that it never falls short, and the coverage above 0.95 in the table is what that costs in width.');

/* ============================================================ SECTION 16 */

section('fraction', 'Confidence is a required fraction, and the upper tail is solved directly', ['Professional m02 l04', 'Professional m02 l05']);
w(`\`confidence\` has no default, and it must be a fraction strictly between 0 and 1. ${ref('refusals').replace('s', 'S')} tables the refusals for 95 and for a missing value.`);
w();
const oneMinus = 1 - 0.025;
w(`WHAT FLOATING POINT DOES TO alpha. With confidence 0.95 the engine forms alpha as 1 minus 0.95, which in double precision is ${String(alpha)}; alpha over 2 is ${String(alpha / 2)}. And 1 minus 0.025 is ${String(oneMinus)}, which ${oneMinus === 0.975 ? 'IS' : 'is NOT'} the double 0.975.`);
must('1 - 0.025 is the double 0.975', oneMinus === 0.975, oneMinus);
w();
w('The engine solves the upper limit on the UPPER tail at alpha/2 directly, with `chiSquareQuantileUpper`, rather than on the lower tail at 1 minus alpha/2. At 0.025 the two routes agree closely; where the tail probability is small the lower-tail route runs out of digits, because 1 minus a tiny number rounds. Measured on 2 degrees of freedom:');
w();
const tails = [0.025, 1e-4, 1e-8, 1e-12, 1e-15, 1e-17].map((q) => {
  const up = S.chiSquareQuantileUpper(q, 2);
  const lo = S.chiSquareQuantile(1 - q, 2);
  const exact = -2 * Math.log(q);
  const loCell = Number.isFinite(lo) ? f12(lo) : 'none: 1 - q rounds to 1';
  const loErr = Number.isFinite(lo) ? relE(lo, exact) : 'none';
  return [q >= 0.001 ? f6(q) : q.toExponential(0), f12(up), loCell, f12(exact), relE(up, exact), loErr];
});
table(['upper tail q', 'upper-tail route', 'lower-tail route at 1 - q', 'exact, derived: minus 2 ln q', 'upper route error', 'lower route error'], tails);
must('at q = 1e-15 the upper route is within 1e-12 of exact', rel(S.chiSquareQuantileUpper(1e-15, 2), -2 * Math.log(1e-15)) < 1e-12, 'close');
must('at q = 1e-15 the lower route is off by more than 1e-6', rel(S.chiSquareQuantile(1 - 1e-15, 2), -2 * Math.log(1e-15)) > 1e-6, 'far');
must('at q = 1e-17, 1 - q is exactly 1 and the lower route returns no number', 1 - 1e-17 === 1 && Number.isNaN(S.chiSquareQuantile(1 - 1e-17, 2)), 'NaN');
must('at q = 1e-17 the upper route is still within 1e-12 of exact', rel(S.chiSquareQuantileUpper(1e-17, 2), -2 * Math.log(1e-17)) < 1e-12, 'close');
w();
w('On 2 degrees of freedom the chi-square upper quantile is exactly minus 2 ln q, which is why that column can be derived here. At 0.025 the two routes agree to the last digit printed; the lower-tail route loses digits as q shrinks, and at 1e-17 the number 1 minus q is exactly 1 and the lower-tail route cannot be asked the question at all. The upper-tail route stays close to exact throughout. The course states the design choice as the engine makes it: solve the smaller tail directly.');

/* ============================================================ SECTION 17 */

section('zero', 'Zero events', ['Professional m03']);
const Z0 = T.ABO;
const zc = T.CONFIDENCES.map((c) => {
  const r = success(`ABO zero at ${c}`, S.rateConfidenceInterval({ count: 0, exposureHours: Z0.hours, base: B2, confidence: c }));
  must(`the zero-event lower limit is exactly 0 at ${c}`, r.lower === 0 && r.countLower === 0, r.lower);
  return { c, r };
});
w(`The ABO crew worked ${Z0.hours} hours (stated) with 0 recordables. The observed rate is 0. The interval is not:`);
w();
table(['confidence', 'count upper', 'rate upper per 200,000', 'rate lower', 'minus ln of half the miss, derived'], zc.map(({ c, r }) => [f6(c), f12(r.countUpper), f6(r.upper), f6(r.lower), f12(-Math.log((1 - c) / 2))]));
zc.forEach(({ c, r }) => must(`at zero events the count upper limit is minus ln(alpha/2) at ${c}`, rel(r.countUpper, -Math.log((1 - c) / 2)) < 1e-12, r.countUpper));
w();
const z90 = zc.find((x) => x.c === 0.9).r;
const z95 = zc.find((x) => x.c === 0.95).r;
w(`THE RULE OF THREE says an upper 95 percent limit at zero events is about 3 events. The engine's CENTRAL 95 percent interval gives a count upper limit of ${f12(z95.countUpper)}, because it leaves 2.5 percent in the upper tail. The central 90 percent interval leaves 5 percent there and gives ${f12(z90.countUpper)}: that is the one-sided 95 percent limit the rule of three approximates. Derived: 3 over that figure is ${f6(3 / z90.countUpper)}.`);
w();
w(`So on the ABO hours the rule of three gives, derived, ${f6((3 * B2) / Z0.hours)} per 200,000 hours, the central 90 percent upper limit is ${f6(z90.upper)}, and the engine's central 95 percent upper limit is ${f6(z95.upper)}.`);
w();
w('HOW MUCH EXPOSURE IT TAKES. Derived: the hours at which zero events brings the central 95 percent upper limit down to a target rate is the count upper limit times 200,000 over the target. Each row is then checked by calling the engine at those hours:');
w();
table(['target per 200,000', 'hours needed, derived', 'engine upper limit at those hours'], T.ZERO_TARGETS.map((t) => {
  const h = (z95.countUpper * B2) / t;
  const r = success(`zero events at ${h} hours`, S.rateConfidenceInterval({ count: 0, exposureHours: h, base: B2, confidence: 0.95 }));
  must(`the engine reproduces the target ${t}`, rel(r.upper, t) < 1e-12, r.upper);
  return [f6(t), f6(h), f6(r.upper)];
}));
w();
w(`A crew with no recordables on the ABO hours cannot, at 95 percent, rule out a true rate as high as ${f6(z95.upper)} per 200,000 hours. Zero is still a measurement: it bounds the rate from above.`);

/* ============================================================ SECTION 18 */

section('compare', 'Comparing two rates by conditioning on the total', ['Professional m04']);
const E = T.ERHA;
const ec = success('ERHA compareRates', S.compareRates({ count1: E.east.count, exposureHours1: E.east.hours, count2: E.west.count, exposureHours2: E.west.hours, confidence: 0.95 }));
w(`ERHA east recorded ${E.east.count} events in ${E.east.hours} hours and west ${E.west.count} in ${E.west.hours} hours (stated). Given the total of ${E.east.count + E.west.count} events, and equal rates, east's share of the events is binomial with the east share of the hours as its probability.`);
w();
table(['what the engine returns', 'value'], [
  ['expectedProportion, east hours over all hours', f6(ec.expectedProportion)],
  ['east share of the events, derived', f6(E.east.count / (E.east.count + E.west.count))],
  ['lowerTail, P(east count <= observed)', f6(ec.lowerTail)],
  ['upperTail, P(east count >= observed)', f6(ec.upperTail)],
  ['pValue, central two-sided', f6(ec.pValue)],
  ['rateRatio, east over west', f6(ec.rateRatio)],
  ['rateRatioLower, 95 percent', f6(ec.rateRatioLower)],
  ['rateRatioUpper, 95 percent', f6(ec.rateRatioUpper)],
  ['upperUnbounded', String(ec.upperUnbounded)],
]);
must('ERHA: expectedProportion is the hours share', rel(ec.expectedProportion, E.east.hours / (E.east.hours + E.west.hours)) < 1e-15, ec.expectedProportion);
must('ERHA: the p-value is twice the smaller tail', rel(ec.pValue, Math.min(1, 2 * Math.min(ec.lowerTail, ec.upperTail))) < 1e-15, ec.pValue);
must('ERHA: twice the printed upper tail differs from the printed pValue in the last digit only', (2 * Number(f6(ec.upperTail))).toFixed(6) !== f6(ec.pValue) && Math.abs(2 * Number(f6(ec.upperTail)) - Number(f6(ec.pValue))) < 1.5e-6, `${f6(ec.upperTail)} ${f6(ec.pValue)}`);
w();
w('Each number in this table is rounded to six decimals on its own, so twice a printed tail can differ from the printed pValue in the last digit, as it does here. The engine computes the pValue from the unrounded tail.');
w();
w(`No base is taken: it cancels in a ratio. The engine's method line: "${ec.basis.method}".`);
w();
w('WHEN ONE GROUP HAS NO EVENTS (goldens):');
w();
const cz = [golden('compare-first-zero'), golden('compare-second-zero')].map((g) => {
  const r = success(`golden ${g.id}`, S.compareRates(g.args));
  return { g, r };
});
table(['golden case', 'count1, hours1', 'count2, hours2', 'rateRatio', 'lower', 'upper', 'upperUnbounded', 'pValue', 'reason'], cz.map(({ g, r }) => [g.id, `${g.args.count1}, ${g.args.exposureHours1}`, `${g.args.count2}, ${g.args.exposureHours2}`, r.rateRatio === null ? 'null' : f6(r.rateRatio), f6(r.rateRatioLower), r.rateRatioUpper === null ? 'null' : f6(r.rateRatioUpper), String(r.upperUnbounded), f6(r.pValue), r.reason === null ? 'null' : r.reason]));
must('first group empty: ratio 0 and lower 0', cz[0].r.rateRatio === 0 && cz[0].r.rateRatioLower === 0, 'zero');
must('second group empty: ratio and upper null, unbounded, with a reason', cz[1].r.rateRatio === null && cz[1].r.rateRatioUpper === null && cz[1].r.upperUnbounded === true && typeof cz[1].r.reason === 'string', 'null');
w();
w(`A ratio with no events underneath it is unbounded, and the engine says so with null and a reason in place of Infinity. Both groups empty is refused (${ref('refusals')}).`);

/* ============================================================ SECTION 19 */

section('convention', 'The central p-value, the minlike p-value, and why the engine chose central', ['Professional m05']);
const N0 = T.UTOROGU;
const uc = success('UTOROGU compareRates', S.compareRates({ count1: N0.north.count, exposureHours1: N0.north.hours, count2: N0.south.count, exposureHours2: N0.south.hours, confidence: 0.95 }));
// THE MINLIKE P-VALUE IS NOT AN ENGINE OUTPUT. It is derived here from binomial
// terms built on the engine's logGamma, labelled derived on every row it
// appears on, because the lesson has to show a convention the engine declines.
const lch = (n, k) => S.logGamma(n + 1) - S.logGamma(k + 1) - S.logGamma(n - k + 1);
const bpmf = (n, k, p) => Math.exp(lch(n, k) + k * Math.log(p) + (n - k) * Math.log1p(-p));
const minlike = (k, n, p) => {
  const d = bpmf(n, k, p); let s = 0;
  for (let j = 0; j <= n; j += 1) { const q = bpmf(n, j, p); if (q <= d * (1 + 1e-7)) s += q; }
  return Math.min(1, s);
};
const n0 = N0.north.count + N0.south.count;
const ml = minlike(N0.north.count, n0, uc.expectedProportion);
w(`UTOROGU north recorded ${N0.north.count} events in ${N0.north.hours} hours and south ${N0.south.count} in ${N0.south.hours} hours (stated).`);
w();
table(['what', 'value'], [
  ['engine pValue, central: twice the smaller tail, capped at 1', f6(uc.pValue)],
  ['minlike p-value, derived: the probability of every count no more likely than the one observed', f6(ml)],
  ['engine rate ratio, north over south', f6(uc.rateRatio)],
  ['engine 95 percent rate-ratio interval', `${f6(uc.rateRatioLower)} to ${f6(uc.rateRatioUpper)}`],
]);
must('UTOROGU: central above 0.05 and minlike below', uc.pValue > 0.05 && ml < 0.05, `${uc.pValue} ${ml}`);
must('UTOROGU: the interval includes 1', uc.rateRatioLower < 1 && uc.rateRatioUpper > 1, 'includes 1');
w();
w('The central p-value is above 0.05 and the rate-ratio interval includes 1: the two agree that the data do not rule out equal rates at 95 percent. The minlike p-value, the convention of R\'s poisson.test and of scipy\'s binomtest, is below 0.05 on the same counts and disagrees with that interval. The engine uses the central convention because it is the test the Clopper-Pearson interval inverts (Fay 2010). A reader who checks an engine p-value in R will see a different number on some inputs; that is this choice, and it is declared.');
w();
const agree = { n: 0, centralAgrees: 0, minlikeDisagrees: 0 };
for (let c1 = 0; c1 <= N0.sweep.maxCount1; c1 += 1) {
  for (let c2 = 0; c2 <= N0.sweep.maxCount2; c2 += 1) {
    if (c1 + c2 === 0) continue;
    const r = S.compareRates({ count1: c1, exposureHours1: N0.north.hours, count2: c2, exposureHours2: N0.south.hours, confidence: 0.95 });
    const excludes = r.rateRatioLower > 1 || (r.rateRatioUpper !== null && r.rateRatioUpper < 1);
    agree.n += 1;
    if ((r.pValue < 0.05) === excludes) agree.centralAgrees += 1;
    const m = minlike(c1, c1 + c2, r.expectedProportion);
    if ((m < 0.05) !== excludes) agree.minlikeDisagrees += 1;
  }
}
must('the central p-value agrees with the interval on every pair swept', agree.centralAgrees === agree.n, `${agree.centralAgrees} of ${agree.n}`);
w(`THE AGREEMENT, SWEPT. Every pair of counts from 0 to ${N0.sweep.maxCount1} north and 0 to ${N0.sweep.maxCount2} south on the UTOROGU hours, except both zero: ${agree.n} comparisons. The central p-value falls below 0.05 exactly when the engine's interval excludes 1 on ${agree.centralAgrees} of them. The minlike p-value, derived, disagrees with the interval on ${agree.minlikeDisagrees} of them.`);
w();
w(`NO DIFFERENCE FOUND IS A WEAK CLAIM. On UTOROGU the rate-ratio interval runs from ${f6(uc.rateRatioLower)} to ${f6(uc.rateRatioUpper)}: it includes 1, and it also includes a north rate ${f6(uc.rateRatioUpper)} times the south one. A p-value above 0.05 says the data cannot tell; it does not say the rates are equal.`);

/* ============================================================ SECTION 20 */

section('published', 'Published rates with their intervals', ['Professional m06']);
const gb = golden('garwood-bls-abc-company');
const gf = golden('garwood-iogp-far-2024');
const gbr = success('BLS with interval', S.rateConfidenceInterval(gb.args));
const gfr = success('IOGP FAR with interval', S.rateConfidenceInterval(gf.args));
table(['case', 'count', 'hours', 'base', 'rate', 'lower 95', 'upper 95', 'upper against golden'], [
  ['BLS ABC Company recordables', String(gb.args.count), String(gb.args.exposureHours), String(gb.args.base), f6(gbr.rate), f6(gbr.lower), f6(gbr.upper), relE(gbr.upper, gb.expected.upper)],
  ['IOGP 2024 FAR', String(gf.args.count), String(gf.args.exposureHours), String(gf.args.base), f6(gfr.rate), f6(gfr.lower), f6(gfr.upper), relE(gfr.upper, gf.expected.upper)],
]);
w();
w(`The BLS worked example's ${bls.published.value} is consistent, at 95 percent, with any true rate from ${f6(gbr.lower)} to ${f6(gbr.upper)} per 200,000 hours: ${gb.args.count} cases is a small count. The IOGP 2024 FAR of ${f6(gfr.rate)} rests on ${gf.args.count} fatalities and its interval runs from ${f6(gfr.lower)} to ${f6(gfr.upper)}.`);
w();
w(`WRITING A RATE WITH ITS UNCERTAINTY. The house form this course uses: the rate, the base, the count and hours it came from, and the interval with its confidence, for example "${f6(gbr.rate)} per 200,000 hours (${gb.args.count} cases in ${gb.args.exposureHours} hours; ${Math.round(gb.args.confidence * 100)} percent exact interval ${f6(gbr.lower)} to ${f6(gbr.upper)})". No P label is used for a confidence interval anywhere in this course.`);

/* ============================================================ SECTION 21 */

section('uchart', 'The u-chart: exposure units, a pooled centre line and limits that move', ['Expert m01']);
const G = T.EGBEMA;
const gc = success('EGBEMA uChart', S.uChart({ counts: G.counts, exposureHours: G.hours, base: B2 }));
w(`The EGBEMA stream is ${G.counts.length} months (stated). Each month's exposure units are its hours over the base, n = hours / 200,000; u is the count over n, which is the month's rate on that base.`);
w();
table(['month', 'count', 'hours', 'units n', 'u', 'LCL', 'UCL', 'lclFloored', 'signal'], gc.points.map((p) => [String(p.index + 1), String(p.count), String(p.exposureHours), f6(p.exposureUnits), f6(p.u), f6(p.lcl), f6(p.ucl), String(p.lclFloored), p.signal === null ? 'null' : p.signal]));
w();
const gMeanU = sum(gc.points.map((p) => p.u)) / gc.points.length;
table(['what', 'value'], [
  ['centre line, sum of counts over sum of units', f6(gc.centre)],
  ['mean of the monthly u, derived', f6(gMeanU)],
  ['sum of counts', String(sum(G.counts))],
  ['sum of units, derived', f6(sum(gc.points.map((p) => p.exposureUnits)))],
  ['outOfControl, zero-based month index', JSON.stringify(gc.outOfControl)],
]);
must('EGBEMA flags exactly month eight', JSON.stringify(gc.outOfControl) === '[7]', JSON.stringify(gc.outOfControl));
must('the centre is sum over sum', rel(gc.centre, sum(G.counts) / sum(gc.points.map((p) => p.exposureUnits))) < 1e-15, gc.centre);
must('every EGBEMA lower limit is floored', gc.points.every((p) => p.lclFloored && p.lcl === 0), 'all floored');
w();
w(`The engine's method line: "${gc.basis.method}". The limits are the centre plus and minus 3 times the square root of the centre over n, so a month with fewer hours gets wider limits: month ${G.shortMonth}, with ${G.hours[G.shortMonth - 1]} hours, has a UCL of ${f6(gc.points[G.shortMonth - 1].ucl)} against ${f6(gc.points[0].ucl)} for month 1. Every lower limit on this chart is floored at 0 and flagged, because the raw lower limit is negative at this exposure.`);
w();
w(`Two charts the engine refuses to draw, both in ${ref('refusals')}: a month with zero hours (drop it first) and a chart with no events at all (the limits would have zero width).`);

/* ============================================================ SECTION 22 */

section('signals', 'Signals: strictly outside, three sigma, and a low point', ['Expert m02']);
const onl = golden('uchart-points-on-the-limits');
const onr = success('points on the limits', S.uChart(onl.args));
w(`STRICTLY OUTSIDE. The golden case ${onl.id} puts two points exactly on their limits. Its note reads: "${onl.note}".`);
w();
table(['point', 'count', 'u', 'LCL', 'UCL', 'signal'], onr.points.map((p) => [String(p.index + 1), String(p.count), f6(p.u), f6(p.lcl), f6(p.ucl), p.signal === null ? 'null' : p.signal]));
must('points on the limits do not signal', onr.outOfControl.length === 0, JSON.stringify(onr.outOfControl));
w();
w('THREE SIGMA, AND WHAT A NARROWER BAND COSTS. On EGBEMA, derived limits at 2 sigma beside the engine\'s 3 sigma:');
w();
const two = gc.points.map((p) => {
  const ucl2 = gc.centre + 2 * Math.sqrt(gc.centre / p.exposureUnits);
  return { p, ucl2, flag2: p.u > ucl2 };
});
table(['month', 'u', 'UCL at 3 sigma, engine', 'UCL at 2 sigma, derived', 'above at 2 sigma'], two.map(({ p, ucl2, flag2 }) => [String(p.index + 1), f6(p.u), f6(p.ucl), f6(ucl2), String(flag2)]));
const n2 = two.filter((x) => x.flag2).length;
w();
w(`At 3 sigma the engine flags ${gc.outOfControl.length} month. At 2 sigma, derived, ${n2} months sit above the upper limit. A narrower band flags more months, and each flag is an investigation.`);
must('two sigma flags more months than three', n2 > gc.outOfControl.length, n2);
w();
const low = golden('uchart-positive-lcl-with-a-low-point');
const lowr = success('a low point', S.uChart(low.args));
w(`A LOW POINT THAT SIGNALS. The golden case ${low.id}; its note reads: "${low.note}".`);
w();
table(['point', 'count', 'hours', 'u', 'LCL', 'UCL', 'signal'], lowr.points.map((p) => [String(p.index + 1), String(p.count), String(p.exposureHours), f6(p.u), f6(p.lcl), f6(p.ucl), p.signal === null ? 'null' : p.signal]));
must('the low golden flags a below point', lowr.points.some((p) => p.signal === 'below'), JSON.stringify(lowr.outOfControl));
w();
const thin = golden('uchart-small-exposure-wide-limits');
const thinr = success('thin periods', S.uChart(thin.args));
w(`SMALL EXPOSURE, WIDE LIMITS. The golden case ${thin.id}; its note reads: "${thin.note}".`);
w();
table(['point', 'count', 'hours', 'u', 'UCL', 'signal'], thinr.points.map((p) => [String(p.index + 1), String(p.count), String(p.exposureHours), f6(p.u), f6(p.ucl), p.signal === null ? 'null' : p.signal]));
w();
const sortedU = [...gc.points].sort((a, b) => b.u - a.u);
must('the short month has the highest u on EGBEMA and does not signal', sortedU[0].index === G.shortMonth - 1 && sortedU[0].signal === null, sortedU[0].index);
w(`On EGBEMA the same thing is visible: month ${G.shortMonth} has the highest u on the chart, ${f6(gc.points[G.shortMonth - 1].u)}, and no signal, because its limit is wide.`);

/* ============================================================ SECTION 23 */

section('meaning', 'What a signal means, and revising the limits after a found cause', ['Expert m03']);
const keptIdx = G.counts.map((_, i) => i).filter((i) => !gc.outOfControl.includes(i));
const gr = success('EGBEMA revised', S.uChart({ counts: keptIdx.map((i) => G.counts[i]), exposureHours: keptIdx.map((i) => G.hours[i]), base: B2 }));
w(`A signal is a question: something in that month may differ from the rest. It is not a finding about a cause. If investigation finds an assignable cause, the month is set aside and the chart is redrawn on the rest. On EGBEMA, with month ${gc.outOfControl[0] + 1} set aside:`);
w();
table(['chart', 'months', 'centre', 'months flagged'], [
  ['as drawn', String(G.counts.length), f6(gc.centre), JSON.stringify(gc.outOfControl.map((i) => i + 1))],
  [`revised, month ${gc.outOfControl[0] + 1} set aside`, String(keptIdx.length), f6(gr.centre), JSON.stringify(gr.outOfControl.map((i) => keptIdx[i] + 1))],
]);
must('the revised chart flags nothing', gr.outOfControl.length === 0, JSON.stringify(gr.outOfControl));
must('the revised centre is lower', gr.centre < gc.centre, `${gr.centre} ${gc.centre}`);
w();
w('Setting a month aside needs a found cause. Setting it aside because it is high is removing the data that disagree.');
w();
w(`NO SIGNAL IS A WEAK REASSURANCE. Month ${G.shortMonth} on the drawn chart reads ${f6(gc.points[G.shortMonth - 1].u)} and does not signal, because with ${G.hours[G.shortMonth - 1]} hours its upper limit is ${f6(gc.points[G.shortMonth - 1].ucl)}. A quiet chart can be a chart with too little exposure per point to see anything.`);

/* ============================================================ SECTION 24 */

section('beforeafter', 'Before and after an intervention, with and without the flagged month', ['Expert m03 l04', 'Expert m05 l04', 'Expert m06']);
const idx = (a, b) => G.counts.map((_, i) => i).filter((i) => i >= a && i <= b);
const tot = (ix) => [sum(ix.map((i) => G.counts[i])), sum(ix.map((i) => G.hours[i]))];
const [c1a, h1a] = tot(idx(0, 5));
const [c2a, h2a] = tot(idx(6, 11));
const [c2b, h2b] = tot(idx(6, 11).filter((i) => !gc.outOfControl.includes(i)));
const ba1 = success('EGBEMA after vs before', S.compareRates({ count1: c2a, exposureHours1: h2a, count2: c1a, exposureHours2: h1a, confidence: 0.95 }));
const ba2 = success('EGBEMA after without the flagged month vs before', S.compareRates({ count1: c2b, exposureHours1: h2b, count2: c1a, exposureHours2: h1a, confidence: 0.95 }));
must('the flagged month falls after the intervention', gc.outOfControl[0] + 1 > G.interventionMonth, gc.outOfControl[0] + 1);
w(`The intervention went in at the start of month ${G.interventionMonth} (stated). The flagged month, ${gc.outOfControl[0] + 1}, falls AFTER it.`);
w();
table(['comparison', 'after: count, hours', 'before: count, hours', 'rate ratio after over before', 'lower 95', 'upper 95', 'central p-value'], [
  ['all months', `${c2a}, ${h2a}`, `${c1a}, ${h1a}`, f6(ba1.rateRatio), f6(ba1.rateRatioLower), f6(ba1.rateRatioUpper), f6(ba1.pValue)],
  [`month ${gc.outOfControl[0] + 1} set aside, valid only with a found cause`, `${c2b}, ${h2b}`, `${c1a}, ${h1a}`, f6(ba2.rateRatio), f6(ba2.rateRatioLower), f6(ba2.rateRatioUpper), f6(ba2.pValue)],
]);
must('with month 8 the after rate is not lower', ba1.rateRatio >= 1 || ba1.pValue > 0.05, ba1.rateRatio);
must('setting the flagged month aside lowers the after rate', c2b / h2b < c2a / h2a, `${c2b / h2b} ${c2a / h2a}`);
w();
w('The second row stands only if investigation finds a cause for the flagged month, the condition set in the section before this one. The flagged month falls after the intervention, so setting it aside can only lower the after rate, and without a found cause that flatters the programme.');
must('the two before-and-after comparisons give different p-values', Math.abs(ba1.pValue - ba2.pValue) > 0.01, `${ba1.pValue} ${ba2.pValue}`);
w();
must('with month 8 the ratio is above 1 and without it below 1', ba1.rateRatio > 1 && ba2.rateRatio < 1, `${ba1.rateRatio} ${ba2.rateRatio}`);
must('neither before-and-after comparison is significant at 0.05', ba1.pValue > 0.05 && ba2.pValue > 0.05, `${ba1.pValue} ${ba2.pValue}`);
must('the all-months p-value is the cap of 1', ba1.pValue === 1 && 2 * Math.min(ba1.lowerTail, ba1.upperTail) > 1, `${ba1.lowerTail} ${ba1.upperTail}`);
w(`With every month in, the after period reads a rate ratio of ${f6(ba1.rateRatio)} with a p-value of ${f6(ba1.pValue)}. With month ${gc.outOfControl[0] + 1} set aside it reads ${f6(ba2.rateRatio)} with a p-value of ${f6(ba2.pValue)}. One month turns the ratio from above 1 to below it, and neither comparison is significant at 0.05: the data cannot say the intervention changed the rate in either direction. A before-and-after claim has to say which months it used and why. The p-value of ${f6(ba1.pValue)} is the cap: twice the smaller tail, derived ${f6(2 * Math.min(ba1.lowerTail, ba1.upperTail))}, is above 1.`);
w();
w('RATE CHASING. A month picked because it was the worst is likely to be followed by a better one even if nothing changed. In general part of what makes a month the worst is chance; a month made worst by a one-off cause is followed by a better one because the cause does not recur. On EGBEMA:');
w();
const worst = gc.outOfControl[0];
const nextP = gc.points[worst + 1];
table(['month', 'count', 'u', 'expected count at the centre line, derived: centre times units'], [
  [String(worst + 1), String(gc.points[worst].count), f6(gc.points[worst].u), f6(gc.centre * gc.points[worst].exposureUnits)],
  [String(worst + 2), String(nextP.count), f6(nextP.u), f6(gc.centre * nextP.exposureUnits)],
]);
w();
must('the month after the worst reads lower', nextP.u < gc.points[worst].u, `${nextP.u} ${gc.points[worst].u}`);
must('the month after the worst sits within its limits', nextP.signal === null, nextP.signal);
must('the worst month signals above its three sigma limit', gc.points[worst].signal === 'above' && gc.points[worst].u > gc.points[worst].ucl, gc.points[worst].signal);
w(`The month after the worst reads ${f6(nextP.u)} against the worst month's ${f6(gc.points[worst].u)}, and it sits inside its limits like the other ordinary months. The worst month sits above its three sigma limit, so by the chart's own logic chance alone is an unlikely explanation for it. The stronger reason to withhold credit is that a one-off cause does not recur: once it has passed, the next month returns to the ordinary run whether or not a programme started. A programme launched at the worst month would take credit for that fall, and the chart gives no reason to think the programme caused it.`);

/* ============================================================ SECTION 25 */

section('benchmark', 'Benchmarking against the IOGP published figures', ['Expert m04']);
const tr = golden('iogp-trir-2024');
const trr = success('IOGP TRIR 2024', S.incidenceRate(tr.args));
table(['IOGP figure', 'count, golden', 'hours, golden', 'base', 'engine', 'published', 'relative difference against golden'], [
  ['TRIR 2024', String(tr.args.count), String(tr.args.exposureHours), String(tr.args.base), f6(trr.rate), String(tr.published.value), relE(trr.rate, tr.expected.rate)],
  ['FAR 2024', String(far24.args.fatalities), String(far24.args.exposureHours), String(B8), f6(e24.rate), String(far24.published.value), relE(e24.rate, far24.expected.rate)],
  ['FAR 2023', String(far23.args.fatalities), String(far23.args.exposureHours), String(B8), f6(e23.rate), String(far23.published.value), relE(e23.rate, far23.expected.rate)],
]);
must('the IOGP TRIR rounds to the published 0.81', trr.rate.toFixed(2) === '0.81', trr.rate);
w();
w(`HOW FINE THESE FIGURES ARE. The IOGP report gives the TRIR hours to the nearest million and the FAR hours to the nearest thousand. Half a million hours either way moves the TRIR in its fourth decimal, so the engine's ${f6(trr.rate)} is exact for the hours as printed, rounds to the printed ${tr.published.value}, and is good to about one unit in the fourth decimal for the hours as worked. Half a thousand hours moves either FAR by about one unit in the seventh decimal, which can tip the sixth decimal printed here and no coarser digit.`);
w();
const ugOsha = uRates[0];
const ugIogp = uRates[1];
w(`SAME BASE AND SAME DEFINITION FIRST. UGHELLI's recordable rate is ${f6(ugOsha.rate)} per 200,000 hours (${ref('base')}). Set beside the IOGP TRIR of ${f6(trr.rate)} per 1,000,000 it looks lower. On the IOGP base UGHELLI reads ${f6(ugIogp.rate)}, which is, derived, ${f6(ugIogp.rate / trr.rate)} times the IOGP figure. The definitions must match too: IOGP's TRIR counts fatalities, lost workday, restricted workday and medical treatment cases.`);
w();
const bm = success('UGHELLI against IOGP 2024', S.compareRates({ count1: U.recordables, exposureHours1: U.hours, count2: tr.args.count, exposureHours2: tr.args.exposureHours, confidence: 0.95 }));
w('A BENCHMARK IS A POPULATION FIGURE. Run through the engine as if the IOGP total were a second group:');
w();
table(['what', 'value'], [
  ['rate ratio, UGHELLI over IOGP 2024', f6(bm.rateRatio)],
  ['95 percent interval', `${f6(bm.rateRatioLower)} to ${f6(bm.rateRatioUpper)}`],
  ['central p-value', f6(bm.pValue)],
  ['expectedProportion, derived from UGHELLI hours over all hours', f6(bm.expectedProportion)],
]);
w();
w(`The interval is almost all UGHELLI's uncertainty: the IOGP total rests on ${tr.args.count} events and UGHELLI on ${U.recordables}. The IOGP figure pools many companies with different work, different reporting and different definitions of a recordable; it is a reference line. The test treats it as one workforce under one rate, and it is many workforces under many. The engine does not know which companies are in it, and a benchmark comparison inherits every one of those differences.`);
w();
w('The p-value answers a question nobody asked: whether one site runs at exactly the pooled rate of the whole industry, which no single site is expected to do. A small p-value here says only that one site is not the industry. The weight goes on the ratio and its interval: on this evidence UGHELLI runs at between about two and about nine times the IOGP rate. The rounding of the IOGP hours moves the ratio and its lower limit in the fourth decimal, the upper limit in the third, and the p-value not at all at six decimals.');
w();
w(`THE FIVE YEAR VIEW. IOGP's own five-year FAR (${ref('pooling')}) is ${f6(i5.rate)} by sum then divide and ${f6(i5.meanOfPeriodRates)} by the mean of the five yearly rates. Quote the first.`);

/* ============================================================ SECTION 26 */

section('traps', 'The traps: denominators, contractors and reclassification', ['Expert m05']);
const M = T.AMUKPE;
const all = M.companyHours + M.contractorHours;
const allRec = M.companyRecordables + M.contractorRecordables;
const trap = [
  ['company events over company hours', M.companyRecordables, M.companyHours],
  ['company events over company and contractor hours', M.companyRecordables, all],
  ['company and contractor events over company and contractor hours', allRec, all],
  ['the same, with ' + M.reclassified + ' recordables reclassified to first aid', allRec - M.reclassified, all],
].map(([what, c, h]) => {
  const r = success(`AMUKPE ${what}`, S.incidenceRate({ count: c, exposureHours: h, base: B2 }));
  return [what, String(c), String(h), f6(r.rate)];
});
w(`AMUKPE: company ${M.companyHours} hours with ${M.companyRecordables} recordables, contractors ${M.contractorHours} hours with ${M.contractorRecordables} (stated).`);
w();
table(['what is counted', 'count', 'hours', 'rate per 200,000'], trap);
must('adding contractor hours without their events lowers the rate', Number(trap[1][3]) < Number(trap[0][3]), 'lower');
must('reclassification lowers the rate', Number(trap[3][3]) < Number(trap[2][3]), 'lower');
w();
w('DENOMINATORS THAT MOVE. The second row adds the contractor hours and leaves out the contractor events: the rate falls with no change on site. Events and hours must come from the same workforce, both in or both out.');
w();
const sevBefore = success('AMUKPE severity before reclassification', S.severityRate({ daysLost: M.daysLost, exposureHours: all, base: B2 }));
w(`RECLASSIFICATION. Moving ${M.reclassified} recordables to first aid lowers the recordable rate from ${trap[2][3]} to ${trap[3][3]}. The ${M.daysLost} days lost do not move, so the severity rate on the same hours is ${f6(sevBefore.rate)} before the reclassification and after it. A rate that falls while the harm does not is a change in counting.`);
w();
w(`THE MEAN OF RATES, ONE LEVEL UP. A group that averages its sites' rates, or an industry body that averages its members' rates, makes the ${ref('pooling')} mistake at a larger scale. KWALE's mean of site rates was ` + `${f6(kp.meanOfPeriodRates)} against a pooled ${f6(kp.rate)}. IOGP pools, over its members' hours and over the years: averaging its five yearly FARs would give ${f6(i5.meanOfPeriodRates)}, and the figure it computes, the sum of fatalities over the sum of hours, is ${f6(i5.rate)}.`);

/* ============================================================ SECTION 27 */

section('classify', 'What the engine does not classify, and where the judgement stays', ['Expert m06']);
w(`Every figure in this course starts from a count someone classified. The engine checks that a count is a whole number and that hours are positive; it cannot check whether an injury was recordable, whether a restricted day was a lost day, or whether a release crossed a Tier 1 threshold. ${ref('refusals').replace('s', 'S')} shows what it refuses; nothing in it refuses a count that was classified wrongly.`);
w();
w('A MONITORING NOTE, in the shape this course grades at Expert: the chart and its centre, the months that signal and what was found, whether the limits were revised and on which months, any before-and-after claim with the months it used, and every rate with its base and its interval.');

/* ============================================================ SECTION 28 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Four words in this course already mean something else elsewhere in the academy. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it already means elsewhere', 'the rule here'], [
  ['Poisson', 'Poisson\'s ratio, an elastic property of rock and steel, in the geomechanics, rock physics, pore pressure, casing and tubing, stimulation and perforation courses', 'always "Poisson distribution" or "Poisson count model", never bare "Poisson"'],
  ['severity', 'a consequence category on a risk matrix in the risk and compliance courses, and an exception level in production surveillance', 'always "severity rate", days lost per base hours, never bare "severity"'],
  ['confidence interval', 'elsewhere a percentile range of outcomes may sit near this phrase', 'here it is an interval on an ESTIMATED RATE at a stated confidence; no P label is ever used'],
  ['FAR', 'the planned QRA course will teach FAR as a PREDICTED rate', 'here FAR is an OBSERVED rate; write "observed FAR" wherever the two could be confused'],
]);

/* ============================================================ CLOSING CHECKS */

// Every module the course has must be owned by at least one section.
const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h1_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h1_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
