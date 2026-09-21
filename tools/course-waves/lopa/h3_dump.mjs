// THE H3 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-lopa.md, the
// oracle and the engine's own source comments are PROVENANCE. Where a figure in
// FINDINGS is teachable (the published worked SIF, the route B departures, the
// inferred lifetime, the printing slip) this file recomputes it through the
// engine or reads it from the vendored golden and prints it, and a writer quotes
// the digest line.
//
// Usage:  sh /root/hse-wip-lopa/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/hse-wip-lopa/digest.txt
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
// relationship is itself computed and asserted on the same page.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names; `success()` asserts no error key
// and every top-level number finite; every claim a sentence makes about a
// table goes through `must()`. If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads h3_capstone.mjs,
// fields.json or the capstone scenarios, and the capstone never reads this.
//
// THIS ENGINE HAS NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour. The published example's inferred inputs are facts
// about a published source.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import * as T from './h3_fields.mjs';

const HERE = process.env.H3_WAVE_DIR || '/root/hse-wip-lopa';
const ROOT = process.env.H3_ENGINES || '/root/wt-h3-nextgen/packages/engines';
const ENGINE_REL = 'engines/hse/lopa.js';
const L = await import(`${ROOT}/${ENGINE_REL}`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/hse/goldens/lopa_cases.json`, 'utf8'));
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
const f6 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(6));
const f12 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(12));
/** A failure rate or other stated input in exponent form, as typed. */
const ex = (x) => (x === 0 ? '0' : Number(x).toExponential().replace('e-', 'e-').replace(/\.?0+e/, 'e'));
const rel = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a - b) / Math.abs(b));
const relE = (a, b) => { const r = rel(a, b); return r === 0 ? '0' : r.toExponential(2); };
const pct = (x) => `${(100 * x).toFixed(2)} percent`;
const sum = (a) => a.reduce((x, y) => x + y, 0);
const silText = (s) => (s === null || s === undefined ? 'none' : String(s));
const sig3 = (x) => Number(x).toExponential(2).toUpperCase().replace('E-0', 'E-').replace(/E-(\d)$/, 'E-0$1');

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
const ORDER = ['computes', 'units', 'refusals', 'scenario', 'forget', 'credit', 'tmel', 'loop', 'outcomes',
  'bands', 'snap', 'goldenlopa', 'seam',
  'simplified', 'annexb', 'identities', 'mrt', 'ptc', 'beta', 'twooftwo', 'architectures', 'sifsum', 'published',
  'warnings',
  'sensitivity', 'maxinterval', 'ptcfloor', 'routeb', 'inferred', 'notdone', 'judgement',
  'vocabulary'];
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
const lopa = (label, s, extra = {}) => success(label, L.lopaScenario({
  initiatingEventFrequencyPerYr: s.initiatingEventFrequencyPerYr,
  enablingConditions: s.enablingConditions,
  conditionalModifiers: s.conditionalModifiers,
  ipls: s.ipls,
  tmelPerYr: s.tmelPerYr,
  ...extra,
}));
const sub = (label, p) => success(label, L.pfdAvgSubsystem(p));
const inputs = (p) => [
  p.architecture, ex(p.lambdaDuPerHour), p.lambdaDdPerHour === undefined ? '0' : ex(p.lambdaDdPerHour),
  String(p.proofTestIntervalHours ?? ''), p.mttrHours === undefined ? 'none' : String(p.mttrHours),
  p.mrtHours === undefined ? '0' : String(p.mrtHours),
  p.beta === undefined ? 'none' : String(p.beta), p.betaD === undefined ? 'none' : String(p.betaD),
];
const INPUT_HEAD = ['architecture', 'lambdaDU per hour', 'lambdaDD per hour', 'T1 hours', 'MTTR hours', 'MRT hours', 'beta factor', 'betaD'];

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
const goldCount = GOLD.bands.length + GOLD.rrfOutcomes.length + GOLD.lopa.length + GOLD.pfdPublished.length
  + 1 + GOLD.pfdDerived.length + 1 + GOLD.maxInterval.length;
w('# H3 TEACHING DIGEST: Process Safety: LOPA & SIL Determination');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Frequencies per year, probabilities, IPL PFDs and PFDavg values print to TWELVE decimals; risk reduction factors, hours and years print to SIX decimals; failure rates per hour print in exponent form as stated; counts and SIL numbers are whole numbers; relative differences print in exponent form.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines 6703c00, ${engineLines} lines, importing nothing. The vendored golden test-data/hse/goldens/lopa_cases.json carries ${goldCount} records, written by the stdlib oracle in exact rational arithmetic.`);
w();
w('# FAILURE RATES ARE ILLUSTRATIVE. Every lambda below is a stated teaching input or a value read from the golden, never data this course recommends. No licensed IEC or ISA table is reproduced.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone facility, no capstone input and no graded answer. The capstones run their own facilities and the digest never names them.');
w();
w('# THIS ENGINE HAS NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Associate m06', 'Expert m05']);
w('The engine has two halves and one vocabulary. The DETERMINATION half is a layer of protection analysis: a scenario frequency, the risk reduction still missing against a tolerable frequency, and the SIL band that missing reduction falls in. The VERIFICATION half computes the PFDavg a safety instrumented function achieves, by the IEC 61508-6 Annex B low demand equations. Every function returns either a result object carrying a `basis` block or an object with `error` and `field`, where `field` names the offending input.');
w();
const EXPORTS = [
  ['lopaScenario', 'initiatingEventFrequencyPerYr, enablingConditions, conditionalModifiers, ipls, tmelPerYr, sifPfdAvg', 'the unmitigated and mitigated frequencies, the credited and uncredited IPLs, the required RRF, the outcome state and the required PFDavg'],
  ['outcomeFromRequiredRrf', 'rrf', 'the outcome state a required RRF demands'],
  ['silFromPfdAvg', 'pfdAvg', 'the low demand band an achieved PFDavg falls in'],
  ['pfdAvgSubsystem', 'architecture, lambdaDuPerHour, lambdaDdPerHour, proofTestIntervalHours, mttrHours, mrtHours, beta, betaD, proofTestCoverage, lifetimeHours', 'the PFDavg of one subsystem, its RRF and band, its terms and its equivalent down times'],
  ['pfdAvgSif', 'a list of subsystems', 'the PFDavg of a SIF as the sum of its subsystems'],
  ['proofTestSensitivity', 'subsystem, intervalsHours', 'the PFDavg at each proof test interval, all else held'],
  ['maxProofTestInterval', 'subsystem, targetPfdAvg', 'the longest proof test interval that meets a target, or the state that says why there is none'],
  ['decadeOf', 'x', 'the power of ten x sits on, within the decade snap, or null'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof L[name] === 'function', typeof L[name]));
table(['function', 'what it needs', 'what it returns'], EXPORTS.map(([n, a, r]) => [`\`${n}\``, a.split(', ').map((x) => (/^a list|^subsystem$/.test(x) ? x : `\`${x}\``)).join(', '), r]));
w();
w('The constants it exports:');
w();
table(['name', 'value'], [
  ['`DECADE_SNAP`', String(L.DECADE_SNAP)],
  ['`HOURS_PER_YEAR`', String(L.HOURS_PER_YEAR)],
  ['`ARCHITECTURES`', L.ARCHITECTURES.join(', ')],
  ['`LOPA_OUTCOME`', Object.values(L.LOPA_OUTCOME).join(', ')],
  ['`PFD_STATE`', Object.values(L.PFD_STATE).join(', ')],
]);
must('HOURS_PER_YEAR is 8760', L.HOURS_PER_YEAR === 8760, L.HOURS_PER_YEAR);
must('the five architectures', L.ARCHITECTURES.join() === '1oo1,1oo2,2oo2,2oo3,1oo3', L.ARCHITECTURES.join());
must('six outcome states', Object.keys(L.LOPA_OUTCOME).length === 6, Object.keys(L.LOPA_OUTCOME).length);
must('every exported constant is frozen', [L.ARCHITECTURES, L.LOPA_OUTCOME, L.PFD_STATE, L.SIL_BANDS_LOW_DEMAND].every(Object.isFrozen), 'frozen');
w();
w('WHAT THE ENGINE DOES NOT DO, read from its own header and checked here against its exports:');
const names = Object.keys(L).join(',');
must('no export names hardware fault tolerance or an architectural constraint', !/hft|fault.?tol|architectur.*constraint/i.test(names), names);
must('no export names a high demand or PFH mode', !/pfh|highdemand|continuous/i.test(names), names);
must('no export carries a failure-rate table', !/rate(s)?table|database|library/i.test(names), names);
w('- It invents no number. The initiating event frequency, every enabling condition and conditional modifier probability, every IPL PFD, every failure rate and the TMEL are inputs.');
w('- It carries no failure-rate data. The rates in this course are illustrative teaching inputs or values read from the golden.');
w('- It has no hardware fault tolerance (architectural constraint) check. That requirement is a normative table in a licensed standard, and the engine does not restate it.');
w('- It has no high demand or continuous mode (PFH). Every band here is LOW DEMAND.');
w(`- Its exported names are, in full: ${Object.keys(L).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('units', 'Frequencies per year, probabilities, and the units the engine takes', ['Associate m01']);
w('A LOPA row multiplies ONE frequency by probabilities. The initiating event frequency and the TMEL are frequencies PER YEAR and may exceed one; every enabling condition, conditional modifier and IPL PFD is a probability above zero and no more than one. The verification half takes failure rates PER HOUR and times IN HOURS, and returns PFDavg values, which are probabilities.');
w();
table(['quantity', 'unit', 'allowed range, from the engine'], [
  ['initiating event frequency, IEF', 'per year', 'above 0'],
  ['enabling condition, conditional modifier', 'probability', 'above 0 and no more than 1'],
  ['IPL PFD', 'probability', 'above 0 and no more than 1'],
  ['TMEL', 'per year', 'above 0'],
  ['proposed SIF PFDavg', 'probability', 'above 0 and no more than 1'],
  ['lambdaDU, lambdaDD', 'per hour', 'zero or more, and never both zero'],
  ['proof test interval T1, MTTR, MRT, lifetime T2', 'hours', 'T1 above 0; MTTR and MRT zero or more; T2 at least T1'],
  ['beta factor, betaD', 'fraction', '0 to 1'],
  ['proof test coverage', 'fraction', 'above 0 and no more than 1'],
]);
w();
const iefBig = lopa('a stated IEF above one per year', { initiatingEventFrequencyPerYr: 2.5, tmelPerYr: 1e-4 });
must('an IEF above one per year is accepted', !iefBig.error && iefBig.unmitigatedFrequencyPerYr === 2.5, iefBig.unmitigatedFrequencyPerYr);
w(`An IEF of 2.5 per year (stated) is accepted: a frequency is a count per year and can exceed one. The same number typed as an enabling condition probability is refused, in the engine's words, in ${ref('refusals')}.`);
w();
w(`HOURS_PER_YEAR is ${L.HOURS_PER_YEAR}, so a one year proof test interval is ${L.HOURS_PER_YEAR} hours and the longest interval the engine returns in hours is also given in years, derived as hours over ${L.HOURS_PER_YEAR}.`);

/* ============================================================ SECTION 3 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Professional m06 l03', 'Expert m01 l05']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number.');
w();
const OK = { initiatingEventFrequencyPerYr: 0.1, tmelPerYr: 1e-5 };
const SUB = { architecture: '1oo1', lambdaDuPerHour: 1e-6, proofTestIntervalHours: 8760 };
const R2 = { architecture: '1oo2', lambdaDuPerHour: 1e-6, proofTestIntervalHours: 8760, beta: 0.05 };
const REFUSALS = [
  ['lopaScenario', () => L.lopaScenario({ ...OK, initiatingEventFrequencyPerYr: 0 }), 'initiatingEventFrequencyPerYr', 'an IEF of zero'],
  ['lopaScenario', () => L.lopaScenario({ initiatingEventFrequencyPerYr: 0.1 }), 'tmelPerYr', 'no TMEL'],
  ['lopaScenario', () => L.lopaScenario({ ...OK, enablingConditions: [{ name: 'mode', probability: 0 }] }), 'enablingConditions[0].probability', 'an enabling condition of zero'],
  ['lopaScenario', () => L.lopaScenario({ ...OK, enablingConditions: [{ name: 'mode', probability: 2.5 }] }), 'enablingConditions[0].probability', 'an enabling condition above one'],
  ['lopaScenario', () => L.lopaScenario({ ...OK, conditionalModifiers: [{ probability: 0.5 }] }), 'conditionalModifiers[0].name', 'a modifier with no name'],
  ['lopaScenario', () => L.lopaScenario({ ...OK, ipls: { name: 'relief', pfd: 0.01 } }), 'ipls', 'IPLs not given as a list'],
  ['lopaScenario', () => L.lopaScenario({ ...OK, ipls: [{ pfd: 0.01, independent: true }] }), 'ipls[0].name', 'an IPL with no name'],
  ['lopaScenario', () => L.lopaScenario({ ...OK, ipls: [{ name: 'Relief valve', pfd: 0.01, independent: true }, { name: 'relief valve', pfd: 0.1, independent: true }] }), 'ipls[1].name', 'one IPL named twice, in different case'],
  ['lopaScenario', () => L.lopaScenario({ ...OK, ipls: [{ name: 'relief', pfd: 0, independent: true }] }), 'ipls[0].pfd', 'an IPL PFD of zero'],
  ['lopaScenario', () => L.lopaScenario({ ...OK, sifPfdAvg: 1.5 }), 'sifPfdAvg', 'a proposed SIF PFDavg above one'],
  ['outcomeFromRequiredRrf', () => L.outcomeFromRequiredRrf(-1), 'rrf', 'a negative RRF'],
  ['silFromPfdAvg', () => L.silFromPfdAvg(0), 'pfdAvg', 'a PFDavg of zero'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, architecture: '2oo4' }), 'architecture', 'an architecture the engine does not know'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, lambdaDuPerHour: -1e-6 }), 'lambdaDuPerHour', 'a negative lambdaDU'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, lambdaDuPerHour: 0 }), 'lambdaDuPerHour', 'lambdaDU and lambdaDD both zero'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, proofTestIntervalHours: 0 }), 'proofTestIntervalHours', 'a proof test interval of zero'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, lambdaDdPerHour: 1e-6 }), 'mttrHours', 'detected failures with no MTTR'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, mrtHours: -8 }), 'mrtHours', 'a negative MRT'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...R2, beta: undefined }), 'beta', 'a 1oo2 with no beta factor'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...R2, lambdaDdPerHour: 1e-6, mttrHours: 8 }), 'betaD', 'a 1oo2 with detected failures and no betaD'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, proofTestCoverage: 0 }), 'proofTestCoverage', 'a proof test coverage of zero'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, proofTestCoverage: 0.9 }), 'lifetimeHours', 'coverage below one and no lifetime'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, proofTestCoverage: 0.9, lifetimeHours: 4380 }), 'lifetimeHours', 'a lifetime shorter than the interval'],
  ['pfdAvgSubsystem', () => L.pfdAvgSubsystem({ ...SUB, lambdaDuPerHour: 1e-3 }), 'proofTestIntervalHours', 'a lambda T far outside the rare event range'],
  ['pfdAvgSif', () => L.pfdAvgSif([]), 'subsystems', 'an empty SIF'],
  ['pfdAvgSif', () => L.pfdAvgSif([SUB, { ...R2, beta: undefined }]), 'subsystems[1].beta', 'a SIF with one bad subsystem'],
  ['pfdAvgSif', () => L.pfdAvgSif([{ ...SUB, lambdaDuPerHour: 1.6e-4 }, { ...SUB, lambdaDuPerHour: 1.6e-4 }]), 'subsystems', 'subsystems that sum to more than one'],
  ['proofTestSensitivity', () => L.proofTestSensitivity(SUB, []), 'intervalsHours', 'no intervals'],
  ['maxProofTestInterval', () => L.maxProofTestInterval(SUB, 1), 'targetPfdAvg', 'a target of one'],
];
table(['function', 'what was passed', 'field named', 'the engine\'s message'], REFUSALS.map(([fn, call, field, what]) => {
  const r = refusal(`${fn} with ${what}`, call(), field);
  return [`\`${fn}\``, what, `\`${r.field}\``, r.error];
}));
w();
w(`${REFUSALS.length} refusals are tabled above, across ${new Set(REFUSALS.map((r) => r[0])).size} functions.`);
must('every public function appears in the refusal table', EXPORTS.filter(([n]) => n !== 'decadeOf').every(([n]) => REFUSALS.some((r) => r[0] === n)), 'all seven');
must('decadeOf refuses nothing: it returns null for anything off a decade', L.decadeOf(-1) === null && L.decadeOf(0) === null && L.decadeOf('100') === null, 'null');
w();
w('`decadeOf` refuses nothing: it returns null for zero, for a negative number, for a string and for anything off a decade.');

/* ============================================================ SECTION 4 */

section('scenario', 'One scenario: the initiating event, enabling conditions and conditional modifiers', ['Associate m01', 'Associate m02']);
const O = T.ORONI;
w(`The ORONI row is one separator overfill scenario. Initiating event: ${O.initiatingEvent}, at ${O.initiatingEventFrequencyPerYr} per year (stated). One enabling condition and two conditional modifiers (stated):`);
w();
table(['term', 'name', 'probability, stated'], [
  ...O.enablingConditions.map((e) => ['enabling condition', e.name, String(e.probability)]),
  ...O.conditionalModifiers.map((e) => ['conditional modifier', e.name, String(e.probability)]),
]);
w();
const oro = lopa('ORONI at its own TMEL', O);
table(['quantity', 'engine key', 'value'], [
  ['product of the enabling conditions', '`enablingProduct`', f12(oro.enablingProduct)],
  ['product of the conditional modifiers', '`modifierProduct`', f12(oro.modifierProduct)],
  ['unmitigated frequency, per year', '`unmitigatedFrequencyPerYr`', f12(oro.unmitigatedFrequencyPerYr)],
]);
must('the unmitigated frequency is the IEF times both products', rel(oro.unmitigatedFrequencyPerYr, O.initiatingEventFrequencyPerYr * oro.enablingProduct * oro.modifierProduct) < 1e-15, oro.unmitigatedFrequencyPerYr);
w();
w(`The engine's method string, verbatim: "${oro.basis.method}".`);
w();
w('An ENABLING CONDITION is a state that must hold for the initiating event to lead anywhere (the separator on the high pressure manifold). A CONDITIONAL MODIFIER is a probability that the consequence follows once it has (ignition, someone in the blast zone). The engine treats both the same way, as factors in one product; the difference is in how the analyst justifies them, and the engine keeps them in two lists so the worksheet shows which is which.');

/* ============================================================ SECTION 5 */

section('forget', 'Forgetting a factor: the unmitigated frequency with one term left out', ['Associate m02 l04']);
w('ORONI again, each time with ONE term left out, and what the frequency becomes:');
w();
const drops = [
  ['nothing left out', O],
  ['the enabling condition left out', { ...O, enablingConditions: [] }],
  ['ignition left out', { ...O, conditionalModifiers: O.conditionalModifiers.filter((m) => m.name !== 'ignition') }],
  ['the blast zone modifier left out', { ...O, conditionalModifiers: O.conditionalModifiers.filter((m) => m.name === 'ignition') }],
  ['every modifier left out', { ...O, conditionalModifiers: [] }],
];
const dropRows = drops.map(([what, s]) => {
  const r = lopa(`ORONI with ${what}`, s);
  return { what, r };
});
table(['what was left out', 'unmitigated frequency per year', 'over the full row, derived'], dropRows.map(({ what, r }) => [what, f12(r.unmitigatedFrequencyPerYr), f6(r.unmitigatedFrequencyPerYr / oro.unmitigatedFrequencyPerYr)]));
must('every dropped factor raises the frequency by one over that factor', dropRows.slice(1).every(({ r }) => r.unmitigatedFrequencyPerYr > oro.unmitigatedFrequencyPerYr), 'raised');
w();
w('A forgotten factor is never harmless in the direction of safety or of cost. Leaving out a real enabling condition overstates the frequency and so the risk reduction demanded; typing a factor the analyst cannot justify understates it. Every factor on the row has to be defended in writing, which is why the engine keeps each one with its name.');

/* ============================================================ SECTION 6 */

section('credit', 'IPL credit: independence, the auditable flag and one credit per IPL', ['Associate m03', 'Expert m05 l04']);
w('ORONI carries four IPLs (stated):');
w();
table(['IPL', 'IPL PFD, stated', 'independent, stated', 'auditable, stated'], O.ipls.map((i) => [i.name, String(i.pfd), String(i.independent), i.auditable === undefined ? 'not given' : String(i.auditable)]));
w();
table(['what the engine did', 'IPL', 'reason, verbatim'], [
  ...oro.credited.map((c) => ['credited', c.name, '']),
  ...oro.notCredited.map((c) => ['not credited', c.name, c.reason]),
]);
must('ORONI credits exactly two IPLs', oro.credited.length === 2, oro.credited.length);
must('ORONI declines two: the shared controller and the unaudited procedure', oro.notCredited.length === 2
  && oro.notCredited.some((c) => /not flagged independent/.test(c.reason)) && oro.notCredited.some((c) => /not auditable/.test(c.reason)), JSON.stringify(oro.notCredited));
w();
table(['quantity', 'engine key', 'value'], [
  ['product of the credited IPL PFDs', '`iplProduct`', f12(oro.iplProduct)],
  ['mitigated frequency without a SIF, per year', '`mitigatedFrequencyWithoutSifPerYr`', f12(oro.mitigatedFrequencyWithoutSifPerYr)],
]);
w();
w(`The engine's credit rule, verbatim: "${oro.basis.creditRule}".`);
w();
const truthy = lopa('ORONI with independent given as the string "yes"', { ...O, ipls: [{ name: 'high level alarm with operator response', pfd: 0.1, independent: 'yes' }] });
const oroAll = lopa('ORONI with every IPL credited', { ...O, ipls: O.ipls.map((i) => ({ name: i.name, pfd: i.pfd, independent: true })) });
must('independent must be exactly true: the string yes is not credited', truthy.credited.length === 0 && truthy.notCredited.length === 1, JSON.stringify(truthy.notCredited));
w(`EXACTLY TRUE. An IPL whose \`independent\` is the string "yes" is not credited: the engine lists it under \`notCredited\` with the reason "${truthy.notCredited[0].reason}". A missing flag is treated the same way. Credit is given only when the analyst has asserted independence in the one form the engine accepts.`);
w();
w(`WHAT CREDITING EVERYTHING WOULD HAVE DONE. With all four IPLs credited the mitigated frequency reads ${f12(oroAll.mitigatedFrequencyWithoutSifPerYr)} per year against ${f12(oro.mitigatedFrequencyWithoutSifPerYr)}: derived, ${f6(oro.mitigatedFrequencyWithoutSifPerYr / oroAll.mitigatedFrequencyWithoutSifPerYr)} times lower, and the required RRF drops from ${f6(oro.requiredRrf)} to ${f6(oroAll.requiredRrf)}, which moves the outcome from ${oro.outcome} to ${oroAll.outcome}.`);
must('crediting everything changes the outcome state', oroAll.outcome !== oro.outcome, `${oroAll.outcome} ${oro.outcome}`);
w();
w(`ONE CREDIT PER IPL. Two IPLs with the same name are refused, case ignored (${ref('refusals')}). A layer counted twice would halve the frequency twice for one piece of hardware.`);
w();
w('THESE RULES ARE SPECIFICATION. The engine\'s own validation record says no independent route validates the credit rules; its shared negative control removed the auditable exclusion from both the engine and the oracle and the suite stayed green. They are the engine\'s contract, pinned by behaviour tests, and the judgement of whether a layer really is independent and auditable stays with the analyst.');

/* ============================================================ SECTION 7 */

section('tmel', 'The TMEL, the required RRF and the required PFDavg', ['Associate m04']);
w(`ORONI's TMEL is ${ex(O.tmelPerYr)} per year (stated). The TMEL is the frequency the organisation will tolerate for this consequence; it is an input and the engine does not choose it.`);
w();
table(['quantity', 'engine key', 'value'], [
  ['mitigated frequency without a SIF, per year', '`mitigatedFrequencyWithoutSifPerYr`', f12(oro.mitigatedFrequencyWithoutSifPerYr)],
  ['TMEL, per year', '`tmelPerYr`', f12(oro.tmelPerYr)],
  ['required RRF, the first over the second', '`requiredRrf`', f6(oro.requiredRrf)],
  ['required SIF PFDavg, one over the RRF', '`requiredSifPfdAvg`', f12(oro.requiredSifPfdAvg)],
  ['outcome', '`outcome`', oro.outcome],
  ['required SIL', '`requiredSil`', silText(oro.requiredSil)],
]);
must('required PFDavg is TMEL over the frequency', rel(oro.requiredSifPfdAvg, oro.tmelPerYr / oro.mitigatedFrequencyWithoutSifPerYr) < 1e-15, oro.requiredSifPfdAvg);
w();
w(`THE BINDING TARGET. The engine's basis says, verbatim: "${oro.basis.bindingTarget}". A SIL is a band ten times wide; the required PFDavg is one number inside it, and a SIF anywhere in the band above that number misses the TMEL (${ref('loop')}).`);
w();
w('The same row against a ladder of TMELs:');
w();
const ladder = T.TMEL_LADDER.map((t) => lopa(`ORONI at TMEL ${t}`, { ...O, tmelPerYr: t }));
table(['TMEL per year, stated', 'required RRF', 'outcome', 'required SIL', 'required PFDavg'], ladder.map((r) => [ex(r.tmelPerYr), f6(r.requiredRrf), r.outcome, silText(r.requiredSil), r.requiredSifPfdAvg === null ? 'null' : f12(r.requiredSifPfdAvg)]));
must('the TMEL ladder reaches all six outcome states', new Set(ladder.map((r) => r.outcome)).size === 6, [...new Set(ladder.map((r) => r.outcome))].join(','));
w();
w('Each step of ten in the TMEL is a step of ten in the required RRF: the frequency does not move, only the tolerance does.');

/* ============================================================ SECTION 8 */

section('loop', 'Closing the loop with a proposed SIF', ['Associate m04 l04', 'Professional m05 l04']);
const loop0 = lopa('ORONI at the loop TMEL', { ...O, tmelPerYr: T.LOOP_TMEL });
w(`ORONI at a TMEL of ${ex(T.LOOP_TMEL)} per year (stated) requires ${loop0.outcome} with a required PFDavg of ${f12(loop0.requiredSifPfdAvg)}. Four proposed SIFs, each typed as a PFDavg (stated):`);
w();
const loops = T.PROPOSED_SIFS.map((s) => lopa(`ORONI with a proposed SIF of ${s}`, { ...O, tmelPerYr: T.LOOP_TMEL }, { sifPfdAvg: s }));
table(['proposed SIF PFDavg, stated', 'its own SIL band', 'mitigated frequency with the SIF, per year', 'meets the TMEL'], loops.map((r) => [String(r.sifPfdAvg), silText(r.sifBand.sil), f12(r.mitigatedFrequencyPerYr), String(r.meetsTmel)]));
must('the second SIF is in the required band and still misses', loops[1].sifBand.sil === loop0.requiredSil && loops[1].meetsTmel === false, `${loops[1].sifBand.sil} ${loops[1].meetsTmel}`);
must('the third SIF meets the TMEL', loops[2].meetsTmel === true, loops[2].meetsTmel);
must('the mitigated frequency is the frequency without a SIF times the SIF PFDavg', loops.every((r) => rel(r.mitigatedFrequencyPerYr, r.mitigatedFrequencyWithoutSifPerYr * r.sifPfdAvg) < 1e-15), 'product');
w();
w(`The second row is the point of this section: a SIF of ${loops[1].sifPfdAvg} sits in the ${loop0.outcome} band the row requires and still misses the TMEL, because ${loops[1].sifPfdAvg} is above the required ${f12(loop0.requiredSifPfdAvg)}. The band is a label. The required PFDavg is the target.`);
w();
w(`Without a proposed SIF the engine reports \`meetsTmel\` as ${String(oro.meetsTmel)} for ORONI at its own TMEL, because the outcome is not NO_SIF_REQUIRED; the loop is closed only by typing a SIF's PFDavg.`);

/* ============================================================ SECTION 9 */

section('outcomes', 'Six outcome states, from no SIF required to a redesign', ['Associate m05', 'Associate m06 l02']);
w('The outcome a required RRF demands, from `outcomeFromRequiredRrf`:');
w();
const outs = T.RRF_LADDER.map((x) => ({ x, r: L.outcomeFromRequiredRrf(x) }));
table(['required RRF, stated', 'outcome', 'required SIL', 'required PFDavg', 'in the SIL 4 band'], outs.map(({ x, r }) => [String(x), r.outcome, silText(r.requiredSil), r.requiredSifPfdAvg === null ? 'null' : f12(r.requiredSifPfdAvg), r.pfdInSil4Band === undefined ? '' : String(r.pfdInSil4Band)]));
must('RRF 1 needs no SIF', outs.find((o) => o.x === 1).r.outcome === 'NO_SIF_REQUIRED', 'NO_SIF');
must('RRF 10 is below SIL 1', outs.find((o) => o.x === 10).r.outcome === 'RISK_REDUCTION_BELOW_SIL1', 'below');
must('RRF 10000 is SIL 3', outs.find((o) => o.x === 10000).r.outcome === 'SIL3', 'SIL3');
must('RRF 50000 is beyond SIL 3 in the SIL 4 band', outs.find((o) => o.x === 50000).r.pfdInSil4Band === true, 'sil4 band');
must('RRF 500000 is beyond the SIL 4 band', outs.find((o) => o.x === 500000).r.pfdInSil4Band === false, 'beyond');
w();
const beyond = outs.filter(({ r }) => r.outcome === 'BEYOND_SIL3_REDESIGN');
beyond.forEach(({ x, r }) => w(`At an RRF of ${x} the engine's note reads: "${r.note}".`));
w();
w('BEYOND SIL 3 IS NEVER CLIPPED. The state carries the required PFDavg intact, so a worksheet shows how far beyond the table the row sits. The process sector treats a demand for SIL 4 as a reason to redesign the process or add layers outside the SIS rather than to build a SIL 4 function.');
w();
w('RISK_REDUCTION_BELOW_SIL1 means some reduction is needed and less than a SIL 1 SIF provides by definition. The engine returns the required PFDavg for it, and the gap can be closed by a SIF or by another IPL.');

/* ============================================================ SECTION 10 */

section('bands', 'The low demand bands, and where an exact decade falls', ['Associate m05']);
table(['SIL', 'PFDavg from, inclusive', 'PFDavg to, exclusive', 'RRF above', 'RRF up to, inclusive'], L.SIL_BANDS_LOW_DEMAND.map((b) => [String(b.sil), ex(b.pfdMin), ex(b.pfdMax), String(b.rrfMin), String(b.rrfMax)]));
w();
w('An achieved PFDavg and the band `silFromPfdAvg` puts it in:');
w();
const bands = T.PFD_LADDER.map((p) => ({ p, r: L.silFromPfdAvg(p) }));
table(['PFDavg, stated', 'SIL', 'state'], bands.map(({ p, r }) => [String(p), silText(r.sil), r.state]));
must('PFDavg 0.01 is SIL 1', bands.find((b) => b.p === 0.01).r.sil === 1, 'SIL1');
must('PFDavg 0.001 is SIL 2', bands.find((b) => b.p === 0.001).r.sil === 2, 'SIL2');
must('PFDavg 0.1 is not SIL rated', bands.find((b) => b.p === 0.1).r.state === 'NOT_SIL_RATED', 'not rated');
must('PFDavg 5e-6 is below the SIL 4 floor', bands.find((b) => b.p === 5e-6).r.state === 'BELOW_SIL4_TABLE_FLOOR', 'floor');
w();
w(`The engine's band convention, verbatim: "${L.silFromPfdAvg(0.01).basis}".`);
w();
w('AN EXACT DECADE BELONGS TO THE LOWER SIL. A PFDavg of exactly 0.01 is SIL 1 and exactly 0.001 is SIL 2, because each band includes its lower PFDavg bound and excludes its upper one. In RRF terms, an RRF of exactly 100 is SIL 1 and exactly 10 is below SIL 1. A value that has just crossed a decade does not reach the higher band until it is strictly past it.');
const floorNote = L.silFromPfdAvg(5e-6).note;
w();
w(`Below 1e-5 the table has no row. The engine reports SIL 4 with the state BELOW_SIL4_TABLE_FLOOR and the note: "${floorNote}".`);

/* ============================================================ SECTION 11 */

section('snap', 'The decade snap: why an exact decade needs one', ['Associate m05 l04']);
w(`\`DECADE_SNAP\` is ${L.DECADE_SNAP}. A value within that RELATIVE distance of a power of ten is treated as the power of ten, for the band and for the comparison of a mitigated frequency with the TMEL.`);
w();
w('Frequency products whose exact value is a decade, computed in IEEE double:');
w();
const snaps = T.SNAP_PRODUCTS.map((p) => {
  const x = p.factors.reduce((a, b) => a * b, 1) / p.tmelPerYr;
  return { p, x, d: L.decadeOf(x), out: L.outcomeFromRequiredRrf(x).outcome };
});
table(['factors, stated', 'TMEL, stated', 'the double, seventeen significant digits', 'decadeOf', 'outcome with the snap', 'outcome of a plain comparison with 100, derived'],
  snaps.map(({ p, x, d, out }) => [p.factors.join(' x '), ex(p.tmelPerYr), x.toPrecision(17), String(d), out, x > 100 ? 'SIL2' : 'SIL1']));
const above = snaps.filter((s) => s.x > 100);
must('at least two of the products land strictly above 100 in double', above.length >= 2, above.length);
must('every product snaps to the decade 2 and bands SIL 1', snaps.every((s) => s.d === 2 && s.out === 'SIL1'), 'all SIL1');
w();
w(`${above.length} of the ${snaps.length} products land strictly above 100 in double. Without the snap each of those would be banded SIL 2 on an RRF whose exact value is 100. The snap is what makes the engine honour its own band convention on real arithmetic.`);
w();
w('HOW WIDE THE SNAP IS. RRFs typed near 100:');
w();
const widths = T.SNAP_WIDTH.map((x) => ({ x, d: L.decadeOf(x), out: L.outcomeFromRequiredRrf(x).outcome }));
table(['RRF, stated', 'relative distance from 100, derived', 'decadeOf', 'outcome'], widths.map(({ x, d, out }) => [String(x), relE(x, 100), String(d), out]));
must('100.0000001 is read as 100', widths.find((v) => v.x === 100.0000001).out === 'SIL1', 'snapped');
must('100.000001 is not', widths.find((v) => v.x === 100.000001).out === 'SIL2', 'not snapped');
w();
w('An RRF deliberately entered one part in a billion above 100 is read as exactly 100. The snap is a chosen tolerance; the engine\'s validation record names it as one, and one part in a hundred million is already outside it.');

/* ============================================================ SECTION 12 */

section('goldenlopa', 'The golden LOPA scenarios, run through the engine', ['Associate m06']);
w('Every LOPA scenario in the vendored golden, called through the engine and set beside the golden\'s own expected values. Every golden LOPA scenario is ORACLE-DERIVED: it follows the CCPS method with illustrative numbers, and the golden says so in its source line.');
w();
const gl = GOLD.lopa.map((c) => {
  const r = success(`golden ${c.id}`, L.lopaScenario(c.args));
  must(`golden ${c.id}: outcome matches`, r.outcome === c.expected.outcome, `${r.outcome} ${c.expected.outcome}`);
  must(`golden ${c.id}: required RRF matches`, rel(r.requiredRrf, c.expected.requiredRrf) < 1e-12, `${r.requiredRrf} ${c.expected.requiredRrf}`);
  must(`golden ${c.id}: meetsTmel matches`, r.meetsTmel === c.expected.meetsTmel, r.meetsTmel);
  return { c, r };
});
table(['golden case', 'required RRF', 'golden RRF, exact rational', 'outcome', 'meets the TMEL', 'relative difference'], gl.map(({ c, r }) => [c.id, f6(r.requiredRrf), c.expected.requiredRrfExact, r.outcome, String(r.meetsTmel), relE(r.requiredRrf, c.expected.requiredRrf)]));
must('every golden LOPA source is ORACLE-DERIVED', GOLD.lopa.every((c) => /ORACLE-DERIVED/.test(c.source)), 'all oracle-derived');
w();
w(`All ${gl.length} agree with the golden on the outcome, the required RRF and \`meetsTmel\`. The oracle decides every boundary in exact rationals with no snap, so the golden cases that sit on a decade are a check on the snap.`);
w();
w('WHAT IS NOT HERE. The CCPS continuing example from the book is not reproduced. The engine\'s validation record says no copy of the book was available to check its worksheet numbers against, and no golden claims to be that example.');

/* ============================================================ SECTION 13 */

section('seam', 'What LOPA does not grade: the risk matrix seam', ['Associate m06 l03']);
w('A LOPA row is FREQUENCY BASED. It multiplies a frequency per year by probabilities and compares the result with a TMEL per year. Nothing in this engine takes a consequence category, a matrix score or a matrix band, and nothing in this course grades one.');
w();
w('The academy already teaches two risk matrices: the risk and change course grades the five by five matrix on its own bands, and the field development course teaches a second scale. Both rank a risk on scored bands. This course never re-grades either, and a LOPA consequence is described in words (a fatality, a release reaching the jetty) and carried into the row through its TMEL.');
w();
w('The engine\'s units line, verbatim: "' + oro.basis.units + '".');

/* ============================================================ SECTION 14 */

section('simplified', 'The simplified forms, and the half in one out of one', ['Professional m01']);
const E = T.EKULAMA_DU;
w(`The EKULAMA channel for the simplified forms: lambdaDU ${ex(E.lambdaDuPerHour)} per hour, T1 ${E.proofTestIntervalHours} hours, beta factor ${E.beta} where the architecture takes one, no detected failures, no MRT (all stated). In the forms below b is the beta factor and T is T1, as the engine writes them.`);
w();
const lT = E.lambdaDuPerHour * E.proofTestIntervalHours;
must('the EKULAMA lambda T is under 0.1', lT < 0.1, lT);
const simp = ['1oo1', '1oo2', '2oo2', '2oo3', '1oo3'].map((arch) => {
  const p = { architecture: arch, lambdaDuPerHour: E.lambdaDuPerHour, proofTestIntervalHours: E.proofTestIntervalHours, ...(['1oo2', '2oo3', '1oo3'].includes(arch) ? { beta: E.beta } : {}) };
  const r = sub(`EKULAMA ${arch} simplified`, p);
  const b = E.beta; const l = E.lambdaDuPerHour; const t = E.proofTestIntervalHours;
  const form = {
    '1oo1': [l * t / 2, 'lambdaDU T / 2'],
    '2oo2': [l * t, 'lambdaDU T'],
    '1oo2': [((1 - b) * l * t) ** 2 / 3 + b * l * t / 2, '((1 - b) lambdaDU T)^2 / 3 + b lambdaDU T / 2'],
    '2oo3': [((1 - b) * l * t) ** 2 + b * l * t / 2, '((1 - b) lambdaDU T)^2 + b lambdaDU T / 2'],
    '1oo3': [((1 - b) * l * t) ** 3 / 4 + b * l * t / 2, '((1 - b) lambdaDU T)^3 / 4 + b lambdaDU T / 2'],
  }[arch];
  must(`EKULAMA ${arch}: the engine equals the simplified form`, rel(r.pfdAvg, form[0]) < 1e-12, `${r.pfdAvg} ${form[0]}`);
  return { arch, r, form };
});
table(['architecture', 'simplified form', 'engine PFDavg', 'simplified form, derived', 'relative difference', 'RRF', 'SIL'], simp.map(({ arch, r, form }) => [arch, form[1], f12(r.pfdAvg), f12(form[0]), relE(r.pfdAvg, form[0]), f6(r.rrf), silText(r.sil)]));
w();
w(`lambdaDU T for this channel is, derived, ${f12(lT)}. The engine reproduces every simplified form to machine precision on it.`);
w();
w(`THE HALF IN ONE OUT OF ONE. A dangerous undetected failure arrives at a random moment in the interval and stays until the next proof test, so on average the channel is failed for half the interval: PFDavg is lambdaDU T / 2. Dropping the half doubles it: the 1oo1 PFDavg is ${f12(simp[0].r.pfdAvg)} and lambdaDU T is ${f12(lT)}, derived.`);

/* ============================================================ SECTION 15 */

section('annexb', 'The full Annex B form: detected failures, the MTTR and the equivalent down times', ['Professional m02']);
const F = T.EKULAMA_FULL;
w('The Annex B equations, as the engine states them in its `basis.formula` and in its header:');
w();
const formulas = ['1oo1', '1oo2', '2oo2', '2oo3', '1oo3'].map((arch) => {
  const p = { architecture: arch, ...F };
  return [arch, sub(`EKULAMA full ${arch}`, p).basis.formula];
});
table(['architecture', 'the engine basis.formula, verbatim'], formulas.map(([a, f]) => [a, f]));
w();
const f1 = sub('EKULAMA full 1oo1', { architecture: '1oo1', ...F });
w(`The channel equivalent down time, verbatim from \`basis.tCE\`: "${f1.basis.tCE}". The group equivalent down time uses T1/3 in place of T1/2 for 1oo2 and 2oo3; for 1oo3 the second failure uses T1/3 and the group T1/4.`);
w();
w(`EKULAMA with detected failures (stated): lambdaDU ${ex(F.lambdaDuPerHour)}, lambdaDD ${ex(F.lambdaDdPerHour)} per hour, T1 ${F.proofTestIntervalHours}, MTTR ${F.mttrHours}, MRT ${F.mrtHours} hours, beta factor ${F.beta}, betaD ${F.betaD}.`);
w();
const full = ['1oo1', '1oo2', '2oo2', '2oo3', '1oo3'].map((arch) => ({ arch, r: sub(`EKULAMA full ${arch}`, { architecture: arch, ...F }) }));
table(['architecture', 'tCE hours', 'tGE hours', 'tG2E hours', 'independent term', 'common cause DU', 'common cause DD', 'PFDavg', 'dominant'],
  full.map(({ arch, r }) => [arch, f6(r.tCE), r.tGE === null ? 'null' : f6(r.tGE), r.tG2E === null ? 'null' : f6(r.tG2E), f12(r.terms.independent), f12(r.terms.ccfDU), f12(r.terms.ccfDD), f12(r.pfdAvg), r.dominant]));
const lD = F.lambdaDuPerHour + F.lambdaDdPerHour;
const tce = (F.lambdaDuPerHour / lD) * (F.proofTestIntervalHours / 2 + F.mrtHours) + (F.lambdaDdPerHour / lD) * F.mttrHours;
must('tCE equals the stated formula', rel(full[0].r.tCE, tce) < 1e-12, `${full[0].r.tCE} ${tce}`);
must('1oo1 PFDavg is lambdaD times tCE', rel(full[0].r.pfdAvg, lD * full[0].r.tCE) < 1e-12, full[0].r.pfdAvg);
must('2oo2 PFDavg is exactly twice 1oo1', rel(full[2].r.pfdAvg, 2 * full[0].r.pfdAvg) < 1e-12, full[2].r.pfdAvg);
w();
must('the detected failures pull tCE below T1/2', full[0].r.tCE < F.proofTestIntervalHours / 2, full[0].r.tCE);
w(`Derived: lambdaD, the sum of lambdaDU and lambdaDD, is ${ex(lD)} per hour, and tCE from the stated formula is ${f6(tce)} hours, which is the engine's. T1/2 is ${f6(F.proofTestIntervalHours / 2)} hours. The detected failures pull tCE far below T1/2, because a detected failure is down for the MTTR and no longer; but they also raise lambdaD, and the 1oo1 PFDavg is their product: ${f12(full[0].r.pfdAvg)} here against ${f12(simp[0].r.pfdAvg)} for the same lambdaDU with no detected failures (section 14).`);
must('the full 1oo1 PFDavg is above the DU-only one', full[0].r.pfdAvg > simp[0].r.pfdAvg, 'above');

/* ============================================================ SECTION 16 */

section('identities', 'The simplified forms ARE the Annex B form with no detected failures and no MRT', ['Professional m01 l05', 'Professional m02']);
w('The engine implements only the full form. The simplified TR84 forms are its special case, and the engine\'s basis says so, verbatim:');
w();
w(`> ${simp[0].r.basis.method}`);
w();
w('Setting lambdaDD and MRT to zero in the EKULAMA full channel, and comparing with the simplified forms of section 14:');
w();
const idRows = simp.map(({ arch, r }) => {
  const z = sub(`EKULAMA ${arch} with lambdaDD and MRT typed as zero`, {
    architecture: arch, lambdaDuPerHour: E.lambdaDuPerHour, lambdaDdPerHour: 0, mrtHours: 0, mttrHours: 0,
    proofTestIntervalHours: E.proofTestIntervalHours, ...(['1oo2', '2oo3', '1oo3'].includes(arch) ? { beta: E.beta, betaD: 0 } : {}),
  });
  must(`${arch}: full form at zero DD and MRT equals the simplified form`, z.pfdAvg === r.pfdAvg, `${z.pfdAvg} ${r.pfdAvg}`);
  return [arch, f12(z.pfdAvg), f12(r.pfdAvg), z.pfdAvg === r.pfdAvg ? 'identical' : 'differs'];
});
table(['architecture', 'full form, lambdaDD and MRT zero', 'simplified form, section 14', 'comparison'], idRows);
w();
w('Where the simplified forms stop is where the plant stops being simple: detected failures, an MRT after a test, or partial proof test coverage. The engine then keeps the equivalent down time bookkeeping the simplified forms drop.');

/* ============================================================ SECTION 17 */

section('mrt', 'The MRT after a proof test, and an MRT different from the MTTR', ['Professional m02 l04']);
w(`MRT is the mean restoration time AFTER A PROOF TEST REVEALS a dangerous undetected failure; MTTR is the restoration time of a DETECTED failure. The engine adds MRT to every DU down time (T1/2 + MRT, T1/3 + MRT) and puts MTTR on the detected share. The EKULAMA full channel as 1oo2 at MTTR ${F.mttrHours} hours (stated), with MRT swept:`);
w();
const mrts = T.MRT_LADDER.map((m) => ({ m, r: sub(`EKULAMA 1oo2 at MRT ${m}`, { architecture: '1oo2', ...F, mrtHours: m }) }));
table(['MRT hours, stated', 'tCE hours', 'tGE hours', 'PFDavg', 'over the MRT 0 row, derived'], mrts.map(({ m, r }) => [String(m), f6(r.tCE), f6(r.tGE), f12(r.pfdAvg), f6(r.pfdAvg / mrts[0].r.pfdAvg)]));
must('PFDavg rises with MRT', mrts.every((x, i) => i === 0 || x.r.pfdAvg > mrts[i - 1].r.pfdAvg), 'rising');
w();
w(`MRT enters the common cause DU term too: b lambdaDU (T1/2 + MRT), with b the beta factor. An MRT of ${T.MRT_LADDER.at(-1)} hours, a week, adds, derived, ${pct(mrts.at(-1).r.pfdAvg / mrts[0].r.pfdAvg - 1)} to this PFDavg against MRT zero.`);
w();
const g1 = GOLD.pfdDerived.find((c) => c.id === '1oo2-mrt-ne-mttr');
const g1r = sub('golden 1oo2-mrt-ne-mttr', g1.params);
must('golden 1oo2-mrt-ne-mttr reproduces', rel(g1r.pfdAvg, g1.expected.pfdAvg) < 1e-12, g1r.pfdAvg);
w(`The golden keeps a case with MRT ${g1.params.mrtHours} hours and MTTR ${g1.params.mttrHours} hours (golden), because until MRT and MTTR differ a mix-up between them cannot be seen: the engine gives ${f12(g1r.pfdAvg)} against the golden's ${f12(g1.expected.pfdAvg)}.`);

/* ============================================================ SECTION 18 */

section('ptc', 'Imperfect proof test coverage in the PFDavg', ['Professional m02 l05']);
const V = T.OBAGI_VALVE;
w(`A proof test that reveals only a fraction PTC of the dangerous undetected failures leaves the rest until the item is restored as new at the lifetime T2. The engine splits every DU down time: PTC (T1/(j+1) + MRT) + (1 - PTC)(T2/(j+1) + MRT). OBAGI is one shutdown valve (stated): 1oo1, lambdaDU ${ex(V.lambdaDuPerHour)} per hour, T1 ${V.proofTestIntervalHours}, MRT ${V.mrtHours}, T2 ${V.lifetimeHours} hours.`);
w();
const ptcs = T.PTC_LADDER.map((c) => ({ c, r: sub(`OBAGI at coverage ${c}`, { ...V, proofTestCoverage: c }) }));
table(['proof test coverage, stated', 'tCE hours', 'PFDavg', 'RRF', 'SIL', 'the engine basis.proofTestCoverage'], ptcs.map(({ c, r }) => [String(c), f6(r.tCE), f12(r.pfdAvg), f6(r.rrf), silText(r.sil), r.basis.proofTestCoverage]));
must('PFDavg rises as coverage falls', ptcs.every((x, i) => i === 0 || x.r.pfdAvg > ptcs[i - 1].r.pfdAvg), 'rising');
must('no OBAGI row carries a warning', ptcs.every(({ r }) => r.warnings.length === 0), 'no warnings');
w();
w(`A coverage of ${ptcs.at(-1).c} leaves, derived, ${pct(1 - ptcs.at(-1).c)} of the undetected failures to wait for the ${V.lifetimeHours / L.HOURS_PER_YEAR} year overhaul, and the PFDavg is ${f6(ptcs.at(-1).r.pfdAvg / ptcs[0].r.pfdAvg)} times the perfect test's, derived. ${ref('ptcfloor')} is where coverage sets a floor no proof test interval can reach below.`);

/* ============================================================ SECTION 19 */

section('beta', 'Common cause: the beta factor and the detected beta factor', ['Professional m03']);
w('The beta factor is the fraction of dangerous undetected failures that strike every channel at once; betaD is the same fraction for detected failures. In the engine\'s notation b is the beta factor and bD is betaD. Common cause takes those failures out of the independent rate, (1 - bD) lambdaDD + (1 - b) lambdaDU, and adds them back as a single-channel term: b lambdaDU (T1/2 + MRT) + bD lambdaDD MTTR.');
w();
w('The EKULAMA full channel as 1oo2 and 2oo3, the beta factor swept, betaD half of it (stated):');
w();
const betas = T.BETA_LADDER.flatMap((b) => ['1oo2', '2oo3'].map((arch) => ({ b, arch, r: sub(`EKULAMA ${arch} at beta ${b}`, { architecture: arch, ...F, beta: b, betaD: b / 2 }) })));
table(['architecture', 'beta factor, stated', 'betaD, stated', 'independent term', 'common cause, DU plus DD', 'PFDavg', 'dominant'], betas.map(({ b, arch, r }) => [arch, String(b), String(b / 2), f12(r.terms.independent), f12(r.terms.ccfDU + r.terms.ccfDD), f12(r.pfdAvg), r.dominant]));
const flip = (arch) => betas.filter((x) => x.arch === arch).find((x) => x.r.dominant === 'common cause');
must('1oo2 turns common cause dominated within the ladder', !!flip('1oo2'), 'flip');
must('at beta 0 there is no common cause term', betas.filter((x) => x.b === 0).every((x) => x.r.terms.ccfDU === 0 && x.r.terms.ccfDD === 0), 'zero');
w();
w(`Common cause dominates the 1oo2 from a beta factor of ${flip('1oo2').b} and the 2oo3 from ${flip('2oo3').b} on this channel. Once it dominates, a second or third channel buys little: the common cause term is a single-channel failure that redundancy cannot vote out.`);
w();
w('THE BETA FACTOR MUST BE TYPED. For a redundant architecture a missing beta factor is refused, and the refusal says why in the engine\'s words (section 3): typing zero is a claim of no common cause at all.');

/* ============================================================ SECTION 20 */

section('twooftwo', 'Two out of two carries no beta factor term', ['Professional m03 l04', 'Expert m03 l04']);
const t22 = sub('EKULAMA 2oo2 without a beta factor', { architecture: '2oo2', ...F, beta: undefined, betaD: undefined });
const t22b = sub('EKULAMA 2oo2 with a beta factor typed', { architecture: '2oo2', ...F });
table(['call', 'PFDavg', 'common cause DU', 'warnings, verbatim'], [
  ['2oo2, no beta factor typed', f12(t22.pfdAvg), f12(t22.terms.ccfDU), t22.warnings.join('; ') || 'none'],
  [`2oo2, beta factor ${F.beta} typed`, f12(t22b.pfdAvg), f12(t22b.terms.ccfDU), t22b.warnings.join('; ') || 'none'],
]);
must('typing a beta factor on 2oo2 changes nothing', t22.pfdAvg === t22b.pfdAvg, `${t22.pfdAvg} ${t22b.pfdAvg}`);
must('the typed beta factor is warned about', t22b.warnings.length === 1 && /was ignored/.test(t22b.warnings[0]), t22b.warnings.join());
w();
w(`The engine's formula for 2oo2, verbatim: "${t22.basis.formula}". A 2oo2 trips only when BOTH channels work, so it fails on the FIRST dangerous failure of either: its PFDavg is twice one channel's. A common cause failure of both channels fails the 2oo2 no worse than one channel failing, so treating every failure as independent counts such a failure twice, which errs high. The warning tells the analyst the typed beta factor did nothing.`);
w();
const g22 = GOLD.pfdDerived.find((c) => c.id === 'tr84-2oo2');
w(`How conservative that is, from the golden's time dependent route (golden): at beta factor ${g22.routeB2oo2WithBeta.beta} the exact 2oo2 average is ${f12(g22.routeB2oo2WithBeta.pfdAvg)} against the Annex B ${f12(g22.expected.pfdAvg)}, derived ${pct(g22.expected.pfdAvg / g22.routeB2oo2WithBeta.pfdAvg - 1)} above it. Common cause makes a real 2oo2 slightly better than two independent channels, and Annex B does not take the credit.`);
must('Annex B 2oo2 sits above the golden route B with beta', g22.expected.pfdAvg > g22.routeB2oo2WithBeta.pfdAvg, 'conservative');

/* ============================================================ SECTION 21 */

section('architectures', 'One channel in every architecture', ['Professional m04']);
w('The EKULAMA full channel in all five architectures (section 15 inputs), ranked by PFDavg:');
w();
const ranked = [...full].sort((a, b) => a.r.pfdAvg - b.r.pfdAvg);
table(['architecture', 'PFDavg', 'RRF', 'SIL', 'over 1oo1, derived'], ranked.map(({ arch, r }) => [arch, f12(r.pfdAvg), f6(r.rrf), silText(r.sil), f6(r.pfdAvg / full[0].r.pfdAvg)]));
must('the ranking puts 1oo3 first and 2oo2 last', ranked[0].arch === '1oo3' && ranked.at(-1).arch === '2oo2', ranked.map((x) => x.arch).join());
w();
w('TWO OUT OF THREE AND ITS SIX. A 2oo3 fails when any two of its three channels fail: three pairs, and either failure of a pair can come first, so its independent term carries 6 where 1oo2 carries 2. Voting 2oo3 costs PFDavg against 1oo2 and buys tolerance of one channel tripping spuriously, which this engine does not compute. On this channel the 2oo3 over the 1oo2 is, derived, ' + f6(full[3].r.pfdAvg / full[1].r.pfdAvg) + '.');
must('2oo3 is above 1oo2', full[3].r.pfdAvg > full[1].r.pfdAvg, 'above');
w();
w('ONE OUT OF THREE. Three failures must accumulate; the engine uses the second failure\'s down time with T1/3 and the group\'s with T1/4. The engine\'s validation record checks 1oo3 against the time dependent route to first order only, with no published worked row.');

/* ============================================================ SECTION 22 */

section('sifsum', 'A SIF is the sum of its subsystems', ['Professional m05']);
const I = T.IDU;
w('The IDU teaching SIF, three subsystems (stated):');
w();
table(['subsystem', ...INPUT_HEAD], [['transmitters', ...inputs(I.transmitters)], ['logic solver', ...inputs(I.logicSolver)], ['valves', ...inputs(I.valves)]]);
w();
const idu = success('IDU SIF', L.pfdAvgSif([{ name: 'transmitters', ...I.transmitters }, { name: 'logic solver', ...I.logicSolver }, { name: 'valves', ...I.valves }]));
table(['part', 'architecture', 'PFDavg', 'share of the SIF, derived'], idu.parts.map((p) => [p.name, p.architecture, f12(p.pfdAvg), pct(p.pfdAvg / idu.pfdAvg)]));
must('the SIF PFDavg is the sum of the parts', rel(idu.pfdAvg, sum(idu.parts.map((p) => p.pfdAvg))) < 1e-15, idu.pfdAvg);
w();
table(['SIF', 'value'], [['PFDavg', f12(idu.pfdAvg)], ['RRF', f6(idu.rrf)], ['SIL', silText(idu.sil)], ['state', idu.state]]);
w();
w(`The engine's method, verbatim: "${idu.basis.method}". The valves carry the largest share, derived ${pct(idu.parts[2].pfdAvg / idu.pfdAvg)}, which is common in practice: a mechanical final element is the weakest link, and its proof test interval is the first lever.`);
must('the valves carry the largest share', idu.parts[2].pfdAvg === Math.max(...idu.parts.map((p) => p.pfdAvg)), 'valves');
w();
const iduLoop = lopa('ORONI closed with the IDU SIF', { ...O, tmelPerYr: T.LOOP_TMEL }, { sifPfdAvg: idu.pfdAvg });
w(`BACK TO THE TMEL. Closing the ORONI row at a TMEL of ${ex(T.LOOP_TMEL)} (${ref('loop')}) with the IDU SIF gives a mitigated frequency of ${f12(iduLoop.mitigatedFrequencyPerYr)} per year: \`meetsTmel\` is ${iduLoop.meetsTmel}. The SIF's achieved PFDavg of ${f12(idu.pfdAvg)} is below the required ${f12(iduLoop.requiredSifPfdAvg)}.`);
must('IDU meets the ORONI TMEL', iduLoop.meetsTmel === true, iduLoop.meetsTmel);
w();
w('The sum ignores a small overlap term, which the engine\'s validation record names; for PFDavg values this small the overlap is second order.');

/* ============================================================ SECTION 23 */

section('published', 'The published worked SIF, reproduced subsystem by subsystem', ['Professional m06', 'Expert m04']);
const sp = GOLD.sifPublished;
w(`Source (golden): ${sp.source}. The failure rates are the slide's own, which it cites to SINTEF PDS and vendor certificates; they are the slide's example values and this course offers them as nothing more. T1 is one year, ${L.HOURS_PER_YEAR} hours, throughout.`);
w();
const base = GOLD.pfdPublished.filter((c) => ['dolan-pt-2oo3', 'dolan-ai-2oo3', 'dolan-cpu-1oo2', 'dolan-do-1oo2', 'dolan-valve-1oo2'].includes(c.id));
table(['golden case', ...INPUT_HEAD], base.map((c) => [c.id, ...inputs(c.params)]));
w();
const pubRows = base.map((c) => {
  const r = sub(`published ${c.id}`, c.params);
  must(`${c.id}: the engine rounds to the printed value`, sig3(r.pfdAvg) === c.printed, `${sig3(r.pfdAvg)} ${c.printed}`);
  must(`${c.id}: the engine equals the golden`, rel(r.pfdAvg, c.expected.pfdAvg) < 1e-12, r.pfdAvg);
  return [c.id, f12(r.pfdAvg), sig3(r.pfdAvg), c.printed, relE(r.pfdAvg, c.expected.pfdAvg)];
});
table(['golden case', 'engine PFDavg', 'engine at three significant figures', 'printed', 'relative difference against the golden'], pubRows);
w();
const spr = success('published SIF total', L.pfdAvgSif(sp.subsystems));
must('the SIF total rounds to the printed value', sig3(spr.pfdAvg) === sp.printed.pfdAvg, `${sig3(spr.pfdAvg)} ${sp.printed.pfdAvg}`);
must('the RRF rounds to the printed 777', Math.round(spr.rrf) === Number(sp.printed.rrf), spr.rrf);
table(['SIF', 'engine', 'printed'], [['PFDavg', f12(spr.pfdAvg), sp.printed.pfdAvg], ['RRF', f6(spr.rrf), sp.printed.rrf], ['SIL', silText(spr.sil), '']]);
w();
w(`Every subsystem and the total round to the printed three significant figures, and the RRF rounds to the printed ${sp.printed.rrf}. The published table reproduces only with MRT equal to the MTTR on every row; ${ref('inferred')} shows what happens otherwise.`);
w();
w('Two more published rows (golden): the pressure transmitters with the beta factor raised by half, as the slide multiplies it for MooN:');
w();
const b15 = GOLD.pfdPublished.find((c) => c.id === 'dolan-pt-2oo3-beta15');
const b15r = sub('published dolan-pt-2oo3-beta15', b15.params);
must('the beta 15 row reproduces', sig3(b15r.pfdAvg) === b15.printed, sig3(b15r.pfdAvg));
table(['golden case', 'beta factor, golden', 'engine PFDavg', 'engine at three significant figures', 'printed'], [[b15.id, String(b15.params.beta), f12(b15r.pfdAvg), sig3(b15r.pfdAvg), b15.printed]]);

/* ============================================================ SECTION 24 */

section('warnings', 'Warnings, ignored inputs and the refusals of the verification half', ['Professional m06 l03', 'Expert m03 l03']);
w('A warning is returned WITH a result; a refusal replaces it. The warnings the verification half can return:');
w();
const warnLong = sub('a lambda T above 0.1', { architecture: '1oo1', lambdaDuPerHour: 2e-5, proofTestIntervalHours: 8760 });
const warnBeta = sub('a beta factor typed on a 1oo1', { architecture: '1oo1', lambdaDuPerHour: 1e-6, proofTestIntervalHours: 8760, beta: 0.1 });
table(['call', 'PFDavg', 'warning, verbatim'], [
  ['1oo1, lambdaDU 2e-5, T1 8760', f12(warnLong.pfdAvg), warnLong.warnings.join('; ')],
  ['1oo1 with a beta factor of 0.1 typed', f12(warnBeta.pfdAvg), warnBeta.warnings.join('; ')],
  ['2oo2 with a beta factor typed, section 20', f12(t22b.pfdAvg), t22b.warnings.join('; ')],
]);
must('the long interval warns', warnLong.warnings.length === 1 && /exceeds 0\.1/.test(warnLong.warnings[0]), warnLong.warnings.join());
must('a beta factor on 1oo1 is warned about', warnBeta.warnings.length === 1, warnBeta.warnings.join());
w();
const refuseLong = L.pfdAvgSubsystem({ architecture: '1oo1', lambdaDuPerHour: 1e-3, proofTestIntervalHours: 8760 });
w('Past the warning is the refusal: once the linearised value reaches one it is no longer a probability, and the engine refuses with, verbatim:');
w();
w(`> ${refuseLong.error}`);
w();
w(`The warning threshold is lambdaDU times T above 0.1; the refusal is a PFDavg of one or more. Between them the engine answers and says the answer overstates. ${ref('routeb')} measures by how much.`);

/* ============================================================ SECTION 25 */

section('sensitivity', 'PFDavg against the proof test interval', ['Expert m01']);
w(`\`proofTestSensitivity\` holds every input and moves T1. Intervals from a quarter year to eight years (stated): ${T.SENS_INTERVALS.join(', ')} hours.`);
w();
const sensSets = [
  ['EKULAMA 1oo1, DU only', { architecture: '1oo1', lambdaDuPerHour: E.lambdaDuPerHour, proofTestIntervalHours: 8760 }],
  ['EKULAMA full 1oo2', { architecture: '1oo2', ...F }],
  ['EKULAMA full 2oo3', { architecture: '2oo3', ...F }],
  ['IDU valves 1oo2', I.valves],
];
const sens = sensSets.map(([label, p]) => ({ label, s: success(`sensitivity ${label}`, L.proofTestSensitivity(p, T.SENS_INTERVALS)) }));
table(['T1 hours', 'T1 years, derived', ...sens.map((x) => x.label)], T.SENS_INTERVALS.map((t, i) => [String(t), f6(t / L.HOURS_PER_YEAR), ...sens.map((x) => f12(x.s.rows[i].pfdAvg))]));
w();
w('THE RATIO FOR EACH DOUBLING, derived as the PFDavg at an interval over the PFDavg at half of it:');
w();
table(['T1 hours', ...sens.map((x) => x.label)], T.SENS_INTERVALS.slice(1).map((t, i) => [String(t), ...sens.map((x) => f6(x.s.rows[i + 1].pfdAvg / x.s.rows[i].pfdAvg))]));
must('the 1oo1 ratio is exactly two for every doubling', sens[0].s.rows.slice(1).every((r, i) => Math.abs(r.pfdAvg / sens[0].s.rows[i].pfdAvg - 2) < 1e-12), 'two');
must('every PFDavg rises with the interval', sens.every((x) => x.s.rows.every((r, i) => i === 0 || r.pfdAvg > x.s.rows[i - 1].pfdAvg)), 'rising');
w();
const redCols = sens.slice(1);
must('every redundant column starts above two, rises with each doubling and stays below four',
  redCols.every((x) => x.s.rows.slice(1).every((r, i) => {
    const ratio = r.pfdAvg / x.s.rows[i].pfdAvg;
    const prev = i === 0 ? 2 : x.s.rows[i].pfdAvg / x.s.rows[i - 1].pfdAvg;
    return ratio > 2 && ratio < 4 && ratio > prev;
  })), 'rising between two and four');
must('the three redundant subsystems are common cause dominated at one year', [sub('dom 1oo2', { architecture: '1oo2', ...F }), sub('dom 2oo3', { architecture: '2oo3', ...F }), sub('dom valves', I.valves)].every((r) => r.dominant === 'common cause'), 'common cause');
w('A 1oo1 with no detected failures is LINEAR in T1: each doubling doubles it. The three redundant subsystems here are common cause dominated at one year, and the common cause term is linear in T1, so at short intervals their ratio sits just above two. As T1 grows the independent term, which grows with the SQUARE of T1, takes a larger share and the ratio climbs toward four without reaching it in this sweep.');
w();
w(`The SIL each row falls in, for the IDU valves: ${sens[3].s.rows.map((r) => `${r.proofTestIntervalHours} hours SIL ${silText(r.sil)}`).join('; ')}.`);

/* ============================================================ SECTION 26 */

section('maxinterval', 'The longest proof test interval, and its states', ['Expert m01', 'Expert m06']);
w(`\`maxProofTestInterval\` finds the longest T1 at which a subsystem still meets a target PFDavg, by bisection on T1 to one part in a trillion; PFDavg never falls as T1 grows, so the answer is unique. The IDU valves against five targets (stated):`);
w();
const mx = T.VALVE_TARGETS.map((t) => ({ t, r: success(`IDU valves longest interval at ${t}`, L.maxProofTestInterval(I.valves, t)) }));
table(['target PFDavg, stated', 'state', 'longest T1 hours', 'longest T1 years', 'PFDavg at that T1'], mx.map(({ t, r }) => [String(t), r.state, f6(r.proofTestIntervalHours), f6(r.proofTestIntervalYears), f12(r.pfdAvg)]));
must('every valve target is FOUND', mx.every(({ r }) => r.state === 'FOUND'), 'found');
must('each found PFDavg sits at the target', mx.every(({ t, r }) => r.pfdAvg <= t && t - r.pfdAvg < 1e-12 * t * 1e3), 'at target');
w();
w(`The engine's method, verbatim: "${mx[0].r.basis.method}".`);
w();
w('States with no finite answer, one subsystem each (stated):');
w();
const states = Object.entries(T.STATE_CASES).map(([k, c]) => ({ k, c, r: success(`state case ${k}`, L.maxProofTestInterval(c.params, c.target)) }));
table(['state', 'subsystem, stated', 'target', 'longest T1 hours', 'floor PFDavg', 'PFDavg reported'], states.map(({ k, c, r }) => [
  r.state, `${c.params.architecture}, lambdaDU ${ex(c.params.lambdaDuPerHour)}, lambdaDD ${ex(c.params.lambdaDdPerHour ?? 0)}${c.params.mttrHours ? `, MTTR ${c.params.mttrHours}` : ''}${c.params.proofTestCoverage ? `, coverage ${c.params.proofTestCoverage}, T2 ${c.params.lifetimeHours}` : ''}`,
  String(c.target), r.proofTestIntervalHours === null ? 'null' : f6(r.proofTestIntervalHours), r.floorPfdAvg === undefined ? '' : f12(r.floorPfdAvg), r.pfdAvg === undefined ? '' : f12(r.pfdAvg)]));
states.forEach(({ k, r }) => must(`state case ${k} returns ${k}`, r.state === k, r.state));
w();
w('UNACHIEVABLE: the part of the PFDavg that does not depend on T1 (detected failures over the MTTR, the MRT, and the uncovered part under partial coverage) already reaches the target, so no interval, however short, meets it. INTERVAL_INDEPENDENT: with no undetected failures T1 does not enter. CAPPED_AT_LIFETIME: the target is met even at the lifetime T2, and no interval longer than T2 is meaningful.');

/* ============================================================ SECTION 27 */

section('ptcfloor', 'Imperfect coverage: the floor and the lifetime cap', ['Expert m02']);
w(`OBAGI (${ref('ptc')}) against a target of ${T.OBAGI_TARGET_PFDAVG} (stated), coverage swept. The FLOOR is the PFDavg as T1 goes to zero: the uncovered failures stay down for T2/2 on average whatever the test interval.`);
w();
const floors = T.PTC_LADDER.map((c) => {
  const p = { ...V, proofTestCoverage: c };
  const m = success(`OBAGI longest interval at coverage ${c}`, L.maxProofTestInterval(p, T.OBAGI_TARGET_PFDAVG));
  const fl = success(`OBAGI floor at coverage ${c}`, L.maxProofTestInterval(p, 1e-9));
  return { c, m, fl };
});
table(['coverage, stated', 'floor PFDavg', 'longest T1 hours at the target', 'longest T1 years'], floors.map(({ c, m, fl }) => [String(c), f12(fl.floorPfdAvg), f6(m.proofTestIntervalHours), f6(m.proofTestIntervalYears)]));
must('the floor rises and the longest interval falls as coverage falls', floors.every((x, i) => i === 0 || (x.fl.floorPfdAvg > floors[i - 1].fl.floorPfdAvg && x.m.proofTestIntervalHours < floors[i - 1].m.proofTestIntervalHours)), 'monotone');
const flo = floors.at(-1).fl.floorPfdAvg;
const floF = V.lambdaDuPerHour * (1 - floors.at(-1).c) * (V.lifetimeHours / 2 + V.mrtHours) + V.lambdaDuPerHour * floors.at(-1).c * V.mrtHours;
must('the floor equals the uncovered part plus the MRT of the covered part', rel(flo, floF) < 1e-12, `${flo} ${floF}`);
w();
w(`Derived for coverage ${floors.at(-1).c}: lambdaDU (1 - PTC)(T2/2 + MRT) + lambdaDU PTC MRT is ${f12(floF)}, which is the engine's floor. A target below the floor is UNACHIEVABLE whatever the interval; only a better test or a shorter lifetime moves the floor.`);
w();
const capped = states.find((s) => s.k === 'CAPPED_AT_LIFETIME');
w(`THE CAP. The CAPPED_AT_LIFETIME case in ${ref('maxinterval')} with coverage ${capped.c.params.proofTestCoverage} and a lifetime of ${capped.c.params.lifetimeHours} hours meets its target at the lifetime itself, so the engine returns the lifetime and the state CAPPED_AT_LIFETIME.`);
w();
w('WHAT A PARTIAL TEST BUYS. A partial stroke test at a short interval plus a full test at overhaul is a coverage split: the covered part sees the short interval, the uncovered part sees the overhaul. The engine models exactly that split and nothing more elaborate.');

/* ============================================================ SECTION 28 */

section('routeb', 'How conservative the Annex B forms are', ['Expert m03']);
w('The oracle behind the golden has a second route, the TIME DEPENDENT unavailability averaged by numerical quadrature with nothing linearised. The golden records its value beside every PFDavg case (golden, route B). Annex B is never below it: the simplified equations are first order in lambda T and use equivalent down times, and both choices err high.');
w();
const rb = [...GOLD.pfdPublished, ...GOLD.pfdDerived].filter((c) => c.routeB).map((c) => {
  const r = sub(`route B case ${c.id}`, c.params);
  return { c, r, dep: r.pfdAvg / c.routeB.pfdAvg - 1 };
});
table(['golden case', 'engine PFDavg', 'route B, golden', 'engine over route B minus one, derived'], rb.map(({ c, r, dep }) => [c.id, f12(r.pfdAvg), f12(c.routeB.pfdAvg), dep.toExponential(3)]));
must('Annex B is never below route B', rb.every((x) => x.dep >= -1e-9), rb.map((x) => x.dep).join());
const worst = rb.reduce((a, b) => (b.dep > a.dep ? b : a));
w();
w(`Across ${rb.length} golden cases the engine sits at or above route B every time. The largest departure is ${worst.c.id}, at ${pct(worst.dep)}, derived; its lambda T is ${f6(worst.c.params.lambdaDuPerHour * worst.c.params.proofTestIntervalHours)}, derived, well past the 0.1 at which the engine warns (${ref('warnings')}).`);
must('the worst case is the long interval case', worst.c.id === '1oo1-long-interval', worst.c.id);
w();
w('WHERE THE FORMS DEPART, as the engine\'s validation record derives them: the linearised 1oo1 omits a term of order (lambda T) squared; the equivalent down time convention charges detected failures and MRT more than the exact average does; the coverage cross term is charged at (2/3) T1 T2 where the exact average charges T1 T2 / 2 + T1^2 / 6, which is lower whenever T2 is at least T1; and 2oo2 takes no credit for common cause (section 20). Every one of them makes Annex B higher, which is the conservative direction for a PFDavg.');

/* ============================================================ SECTION 29 */

section('inferred', 'The published example\'s inferred inputs, and a printing slip', ['Expert m04']);
must('the golden source lines record the inferred lifetime and the beta factor slip',
  GOLD.pfdPublished.filter((c) => /inferred because it reproduces every printed PTC row/.test(c.source)).length === 4
  && /only 15% \(the x1\.5 table\) reproduces/.test(GOLD.pfdPublished.find((c) => c.id === 'dolan-pt-2oo3-ptc90').source), 'recorded');
w('The published table does not print everything it used. Three inputs had to be INFERRED from reproduction. The golden\'s source lines record two of them, the lifetime and the beta factor slip; the third, MRT equal to the MTTR, is recorded in the engine\'s validation record and shown here.');
w();
const valve = GOLD.pfdPublished.find((c) => c.id === 'dolan-valve-1oo2');
const vMrt = sub('published valve row with MRT equal to MTTR', valve.params);
const vMrt0 = sub('published valve row with MRT zero', { ...valve.params, mrtHours: 0 });
w('ONE. MRT EQUAL TO THE MTTR. The valve row, both ways:');
w();
table(['MRT hours', 'engine PFDavg', 'at three significant figures', 'printed'], [
  [String(valve.params.mrtHours), f12(vMrt.pfdAvg), sig3(vMrt.pfdAvg), valve.printed],
  ['0', f12(vMrt0.pfdAvg), sig3(vMrt0.pfdAvg), valve.printed],
]);
must('only MRT equal to MTTR reproduces the valve row', sig3(vMrt.pfdAvg) === valve.printed && sig3(vMrt0.pfdAvg) !== valve.printed, `${sig3(vMrt.pfdAvg)} ${sig3(vMrt0.pfdAvg)}`);
w();
w('TWO. THE LIFETIME T2 in the coverage table is not printed. The four coverage rows, each with T2 swept (stated, in years):');
w();
const ptcRows = GOLD.pfdPublished.filter((c) => c.params.proofTestCoverage !== undefined);
const t2tab = ptcRows.map((c) => {
  const cells = T.T2_YEARS.map((y) => sig3(L.pfdAvgSubsystem({ ...c.params, lifetimeHours: y * L.HOURS_PER_YEAR }).pfdAvg));
  return { c, cells };
});
table(['golden case', 'printed', ...T.T2_YEARS.map((y) => `T2 ${y} years`)], t2tab.map(({ c, cells }) => [c.id, c.printed, ...cells]));
const ten = T.T2_YEARS.indexOf(10);
must('T2 of ten years reproduces all four coverage rows', t2tab.every(({ c, cells }) => cells[ten] === c.printed), 'ten years');
const onlyTen = T.T2_YEARS.filter((y, i) => t2tab.every(({ c, cells }) => cells[i] === c.printed));
must('ten years is the only lifetime in the sweep that reproduces all four', onlyTen.length === 1 && onlyTen[0] === 10, onlyTen.join());
w();
w(`Only T2 of ${onlyTen[0]} years reproduces all four printed rows in this sweep. That is strong evidence and not proof; the golden records it as INFERRED.`);
w();
const ptPtc = GOLD.pfdPublished.find((c) => c.id === 'dolan-pt-2oo3-ptc90');
const pt10 = sub('published transmitter coverage row at the printed beta factor', { ...ptPtc.params, beta: 0.1, betaD: 0.1 });
const pt15 = sub('published transmitter coverage row at beta factor 0.15', ptPtc.params);
w('THREE. A PRINTING SLIP IN THE BETA FACTOR. The transmitter coverage row prints a beta factor of 10 percent. Computed both ways:');
w();
table(['beta factor and betaD', 'engine PFDavg', 'at three significant figures', 'printed'], [
  ['0.1, as printed', f12(pt10.pfdAvg), sig3(pt10.pfdAvg), ptPtc.printed],
  ['0.15, the value raised by half', f12(pt15.pfdAvg), sig3(pt15.pfdAvg), ptPtc.printed],
]);
must('only the raised beta factor reproduces the row', sig3(pt15.pfdAvg) === ptPtc.printed && sig3(pt10.pfdAvg) !== ptPtc.printed, `${sig3(pt10.pfdAvg)} ${sig3(pt15.pfdAvg)}`);
w();
w('The table is headed as one that applies the MooN multiplication to the beta factor, which raises 10 percent by half to 15 percent, and only 15 percent reproduces the printed value. The printed 10 percent is a slip in the source. One more row, the analogue input card in the raised beta factor table, reproduces only with a betaD that looks like a rounded print, and the golden leaves it out as too ambiguous to use.');
w();
w('The lesson for a verification note: a reproduction that needs an inferred input says which input and why, and a published table is evidence about the equations only for the rows it reproduces.');

/* ============================================================ SECTION 30 */

section('notdone', 'What the engine does not do', ['Expert m05']);
w('Read from the engine header and checked against the exports in section 1:');
w();
table(['not in the engine', 'why, from the engine header', 'what the analyst does instead'], [
  ['a hardware fault tolerance (architectural constraint) check', 'the requirement is a normative table of IEC 61511-1 and IEC 61508-2, and the engine does not restate a licensed table it could not check against a public source', 'checks the architecture against the standard separately; a PFDavg that meets the target does not by itself satisfy the architectural constraint'],
  ['high demand or continuous mode, PFH', 'every band here is low demand', 'uses a PFH method when the demand rate is high; a low demand PFDavg is the wrong quantity there'],
  ['failure-rate data', 'users supply every lambda; the golden rates are labelled illustrative or cited', 'takes rates from a justified source and records it'],
  ['the choice of TMEL, IEF or IPL PFD', 'every one is an input', 'justifies each against the organisation\'s criteria'],
  ['a judgement of independence', 'the credit rules are flags applied as given', 'audits each IPL against the initiating cause and the other layers'],
]);
w();
must('the engine header names the missing HFT check', /No\s+\*?\s*architectural-constraint/.test(ENGINE_SRC), 'header');
must('the engine header names the missing PFH mode', /No high-demand/.test(ENGINE_SRC), 'header');
w('WHAT THE CREDIT RULES REST ON. The independence and auditable rules are specification (section 6). The engine applies them exactly as typed; it cannot see that an alarm shares a transmitter with the initiating loop unless the analyst says so.');

/* ============================================================ SECTION 31 */

section('judgement', 'Judgement: budgets, stretched intervals and the verification note', ['Expert m06']);
const req = iduLoop.requiredSifPfdAvg;
const tx1 = idu.parts[0].pfdAvg; const ls1 = idu.parts[1].pfdAvg;
const budget = req - tx1 - ls1;
must('the valve budget is positive', budget > 0, budget);
const vb = success('IDU valves against their budget', L.maxProofTestInterval(I.valves, budget));
w(`ALLOCATING A BUDGET. ORONI at a TMEL of ${ex(T.LOOP_TMEL)} requires a PFDavg of ${f12(req)}. With the IDU transmitters at ${f12(tx1)} and the logic solver at ${f12(ls1)}, both on a one year test, the valves may take, derived, ${f12(budget)}. The longest valve interval that keeps the SIF inside the requirement is ${f6(vb.proofTestIntervalHours)} hours, ${f6(vb.proofTestIntervalYears)} years (state ${vb.state}).`);
w();
w('STRETCHING EVERY INTERVAL. The IDU SIF re-verified with every proof test interval stretched together (stated, in years):');
w();
const stretched = T.STRETCH_YEARS.map((y) => {
  const f = (p) => ({ ...p, proofTestIntervalHours: y * L.HOURS_PER_YEAR });
  const s = success(`IDU at ${y} years`, L.pfdAvgSif([f(I.transmitters), f(I.logicSolver), f(I.valves)]));
  const lp = lopa(`ORONI with IDU at ${y} years`, { ...O, tmelPerYr: T.LOOP_TMEL }, { sifPfdAvg: s.pfdAvg });
  return { y, s, lp };
});
table(['interval, years', 'SIF PFDavg', 'RRF', 'SIL', 'meets the ORONI TMEL'], stretched.map(({ y, s, lp }) => [String(y), f12(s.pfdAvg), f6(s.rrf), silText(s.sil), String(lp.meetsTmel)]));
const firstMiss = stretched.find((x) => !x.lp.meetsTmel);
const firstDrop = stretched.find((x) => x.s.sil < stretched[0].s.sil);
must('the SIF stops meeting the TMEL before it drops a SIL band', firstMiss && firstDrop && firstMiss.y < firstDrop.y, `${firstMiss && firstMiss.y} ${firstDrop && firstDrop.y}`);
w();
w(`At ${firstMiss.y} years the SIF no longer meets the TMEL, while it is still SIL ${firstMiss.s.sil}; it drops to SIL ${firstDrop.s.sil} only at ${firstDrop.y} years. A SIL that holds is not evidence that the requirement holds (${ref('loop')}).`);
w();
w('WHEN TO REDESIGN. A required RRF beyond SIL 3, a target below a coverage floor, or a common cause term that dominates every architecture on offer are each a signal that more of the same hardware will not close the gap. The engine reports each as a state or a dominant term; the decision is the analyst\'s.');
w();
w('A VERIFICATION NOTE, in the shape this course grades at Expert: the LOPA row and its TMEL; the required PFDavg as well as the band; every subsystem with its architecture, rates, intervals, MTTR, MRT, beta factors and coverage, each rate with its source; the SIF sum and its RRF; the proof test intervals and the state behind each; any warning the engine returned; and what the engine did not check (the architectural constraint, a high demand mode).');

/* ============================================================ SECTION 32 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Five words in this course already mean something else elsewhere in the academy, or are easy to shorten wrongly. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it already means elsewhere', 'the rule here'], [
  ['beta', 'a vapour fraction in the fluid course, an orifice diameter ratio in the metering course, and other quantities in the fiscal, well design and earth model courses', 'always "beta factor" (and betaD for detected failures), never bare "beta"'],
  ['PFD', 'the probability of failure on demand of one IPL, a single figure the analyst credits', 'always "PFDavg" for a SIF or a subsystem, which is an average over the proof test interval; an IPL\'s credited figure is written "IPL PFD"'],
  ['severity', 'a consequence category on a risk matrix in the risk and compliance courses, and other ranking scales', 'never used: LOPA is frequency based, and a consequence is described in words and carried by its TMEL'],
  ['likelihood', 'a likelihood score on a risk matrix, and a Bayesian likelihood in the decision analysis course', 'used only inside "tolerable mitigated event likelihood", the TMEL, which is a frequency per year'],
  ['RRF', 'a ratio easily misnamed', 'always "risk reduction factor", one over PFDavg; a required RRF comes from LOPA and an achieved RRF from verification'],
]);

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h3_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h3_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
