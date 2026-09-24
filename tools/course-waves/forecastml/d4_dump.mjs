// THE D4 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-forecast.md, the
// oracle, the library pins and the engine's own source comments are
// PROVENANCE. Where a figure in FINDINGS is teachable (the NIST/SEMATECH
// e-Handbook's published smoothing examples) this file recomputes it through
// the engine on the vendored golden inputs and prints it, and a writer quotes
// the digest line.
//
// Usage:  sh /root/dai-wip-forecastml/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/dai-wip-forecastml/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF AN ENGINE (forecast.js, or the
// lib/stats quantile it calls where the quantile rule is shown on stated
// values), except where a line says "golden" (read from the vendored case
// file), "stated" (an input named on the same row or in the dataset generator)
// or "derived" (arithmetic on engine values or stated inputs printed in the
// same block, with the arithmetic stated). Nothing here reads a clock, a
// random number, a locale or a network; the dataset comes from d4_fields.mjs
// through the canonical seeded mulberry32, and TZ and LC_ALL are pinned by
// build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page, and asserted.
// Two figures that print alike at six decimals are never called equal unless
// the engine says so: the digest prints their difference in exponent form.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names; `success()` asserts no error
// key and every top-level number finite; every claim a sentence makes about a
// table goes through `must()`. If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads d4_capstone.mjs,
// fields.json or the capstone datasets, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import * as T from './d4_fields.mjs';

const HERE = process.env.D4_WAVE_DIR || '/root/dai-wip-forecastml';
const ROOT = process.env.D4_ENGINES || '/root/wt-dai-d4-nextgen/packages/engines';
const ENGINE_REL = 'engines/dataai/forecast.js';
const FC = await import(`${ROOT}/${ENGINE_REL}`);
const ST = await import(`${ROOT}/lib/stats/stats.js`);
const PCT = await import(`${ROOT}/lib/conventions/percentile.js`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/dataai/goldens/forecast_cases.json`, 'utf8'));
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
const FITS = [];
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.map(([k, v]) => `${k}=${v}`).join(', ') || 'all finite');
    if (r.optimiser) FITS.push([label, r.optimiser.converged]);
    if (r.warnings) must(`A RESULT HERE CARRIES NO WARNING: ${label}`, false, r.warnings.join(' | '));
  }
  return r;
};
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned ${JSON.stringify(r).slice(0, 80)}`);
  must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, r && r.field);
  const nums = r ? Object.values(r).filter((v) => typeof v === 'number') : [];
  must(`A REFUSAL CARRIES NO NUMBER: ${label}`, nums.length === 0, nums.join(','));
  must(`THE MESSAGE STARTS WITH THE FIELD'S NAME: ${label}`, r && typeof r.error === 'string' && r.error.startsWith(String(field).replace(/[.[].*$/, '')), r && r.error);
  return r;
};
const golden = (id) => {
  const c = CASES.find((x) => x.id === id);
  if (!must(`the golden case ${id} exists`, !!c, id)) return { args: {}, expected: {}, published: [] };
  return c;
};
const clone = (o) => JSON.parse(JSON.stringify(o));
const f6 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(6));
const eX = (x) => (x === 0 ? '0' : Number(x).toExponential(2));
const list = (a) => a.join(', ');
const S = (x) => String(x);
const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const absMean = (a) => mean(a.map(Math.abs));
const nearly = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

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
const ORDER = ['computes', 'dataset', 'refusals', 'series', 'ses', 'holt', 'damped', 'fit', 'workflow', 'nist',
  'errors', 'percentage', 'mase', 'backtest', 'leakage', 'pooling', 'comparing',
  'bootstrap', 'percentiles', 'arps', 'ranking', 'boundaries', 'bands', 'choices',
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
const PLANT_FOUND = new Map();
const planted = (i, cond, detail) => {
  const p = T.PLANTED[i];
  must(`PLANTED STRUCTURE FOUND: ${p[0]} (${p[1]}) by ${p[3]}`, cond, detail);
  PLANT_FOUND.set(i, !!cond);
};

/* ---------------------------------------------------------- the dataset */

const WELLS = T.EKENE.wells;
const Y = Object.fromEntries(WELLS.map((x) => [x.well, x.rate]));
const Y1 = Y['EKENE-P1']; const Y2 = Y['EKENE-P2']; const Y3 = Y['EKENE-P3'];
const Y4 = Y['EKENE-P4']; const Y5 = Y['EKENE-P5']; const Y6 = Y['EKENE-P6'];
const WSPEC = Object.fromEntries(T.WELLS.map((x) => [x.id, x]));
// Stated teaching inputs, each passed to the engine AND printed from here, so
// the prose cannot drift from the call.
const A_SES = 0.3; // the teaching fixed alpha for ses
const A_HOLT = 0.5; const B_HOLT = 0.2; // the teaching fixed holt parameters
const PHI_T = 0.9; // the teaching fixed phi
const H = 12; // the teaching horizon, months
const TRAIN = 36; // the teaching hold-out: train on months 0 to 35, score months 36 to 47
const BT = { firstOrigin: 24, horizon: 6, step: 6 }; // the teaching backtest
const SEED_PI = 11; // the teaching bootstrap seed
const CHECK_TOL = 1e-9; // the tolerance of the derived checks the digest names
let STEP = 0;
const step = () => { STEP += 1; return STEP; };

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
const refusalsInGolden = CASES.filter((c) => c.expected && c.expected.error === true).length;
const publishedInGolden = CASES.filter((c) => c.source === 'published').length;
w('# D4 TEACHING DIGEST: Data-Driven Production Forecasting');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle, the library pins and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every rate, level, trend, forecast, fitted value, residual, error, smoothing parameter, sum of squares, mean squared error, percentage error, scaled error, scale, percentile, Arps qi, Di and b, R2 and RMSE prints to SIX decimals; counts, month indices, origins, steps, horizons, evaluations, seeds and path counts are whole numbers; very small magnitudes and tie bands print in exponent form; an engine message is printed verbatim, figures and all.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines ec89b6b, ${engineLines} lines. It imports lib/stats (mulberry32 and quantile), lib/conventions/percentile.js (the P90, P50 and P10 labels and the exceedance definition) and, from engines/dca/arps.js, fitArpsModel and calculateArpsHyperbolic. The vendored golden test-data/dataai/goldens/forecast_cases.json carries ${CASES.length} cases, ${refusalsInGolden} of them refusals and ${publishedInGolden} of them a published anchor, written by the standard library oracle.`);
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone well, no capstone dataset and no graded answer. The capstones run their own datasets and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming its convention, so the working can be printed.');
w();
const EXPORTS = [
  ['fitSmoothing', 'fitting', 'y, method, alpha, beta, phi, initialLevel, initialTrend, h', 'the parameters (fitted or given), SSE and MSE, one-step fitted values, residuals, level and trend states, h-step forecasts and the optimiser record'],
  ['accuracy', 'scoring', 'actual, forecast, insample, m', 'ME, MAE, RMSE, MAPE, sMAPE and MASE of one forecast, with the MASE scale and the reason for any metric it cannot give'],
  ['forecastIntervals', 'uncertainty', 'y, method, alpha, beta, phi, initialLevel, initialTrend, h, nSims, seed, nonNegative', 'the point forecast and the residual-bootstrap P90, P50 and P10 at each step, the pool size and the count of percentiles reported as 0'],
  ['backtest', 'testing', 'y, method, firstOrigin, horizon, step, refit, alpha, beta, phi, m', 'a rolling-origin backtest: every origin\'s parameters, forecasts, actuals and errors, the pooled metrics and the metrics by step ahead'],
  ['arpsForecast', 'baseline', 'y, h, modelType', 'the Arps decline fitted by engines/dca/arps.js: model, qi, Di, b, R2, RMSE, fitted values and forecasts'],
  ['compareWithArps', 'comparison', 'y, methods, firstOrigin, horizon, step, refit, arpsModel, rankBy, m', 'the smoothing methods and the Arps baseline backtested on the same origins, their metrics, and a ranking'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof FC[name] === 'function', typeof FC[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(FC).filter((k) => typeof FC[k] === 'function').length === EXPORTS.length,
  Object.keys(FC).filter((k) => typeof FC[k] === 'function').join(','));
w();
w('The stated defaults, read from the exported `DEFAULTS`:');
w();
const DSRC = {
  PHI_MIN: 'the lowest phi the fit searches',
  PHI_MAX: 'the highest phi the fit searches',
  GRID_ALPHA: 'the coarse grid of alpha and of beta',
  GRID_PHI: 'the coarse grid of phi',
  GRID_TIE_REL: 'how much lower, relative, a later grid point\'s SSE must be to replace the best',
  PS_STEP: 'the first compass step, as a fraction of each parameter\'s range',
  PS_MIN_STEP: 'the step, as a fraction of the range, at which a sweep with no improvement stops the search',
  PS_MAX_EVALS: 'the most SSE evaluations one fit takes',
  MAX_H: 'the largest h (and horizon) accepted',
  MAX_POINTS: 'the most values a series may carry',
  N_SIMS: 'the bootstrap paths when nSims is left out',
  MAX_SIMS: 'the most bootstrap paths accepted',
  MAX_ORIGINS: 'the most origins one backtest or comparison accepts',
  RANK_TIE_REL: 'how close, relative, two metrics must be to keep the listed order in a ranking',
};
const dval = (v) => (Array.isArray(v) ? list(v.map(S)) : Number.isInteger(v) ? S(v) : (Math.abs(v) < 1e-3 ? eX(v) : S(v)));
table(['default', 'value', 'what it sets'], Object.entries(FC.DEFAULTS).map(([k, v]) => [`\`${k}\``, dval(v), DSRC[k]]));
must('DEFAULTS carries fourteen values, each described here', Object.keys(FC.DEFAULTS).length === 14 && Object.keys(FC.DEFAULTS).every((k) => DSRC[k]), Object.keys(FC.DEFAULTS));
must('DEFAULTS is frozen', Object.isFrozen(FC.DEFAULTS), 'frozen');
must('PS_MIN_STEP is 2^-30', FC.DEFAULTS.PS_MIN_STEP === 2 ** -30, FC.DEFAULTS.PS_MIN_STEP);
w();
w(`\`PS_MIN_STEP\` is 2^-30 of each parameter's range (${eX(FC.DEFAULTS.PS_MIN_STEP)}).`);
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports:');
must('no export fills or imputes a missing value', !Object.keys(FC).some((k) => /impute|fill|interpolat/i.test(k)), Object.keys(FC).join(','));
must('no export builds a seasonal, ARIMA, regression or network model', !Object.keys(FC).some((k) => /season|winters|arima|regress|neural|network|lstm|prophet|boost|forest/i.test(k)), 'none');
must('no export computes an EUR or a cumulative', !Object.keys(FC).some((k) => /eur|cumul|reserve/i.test(k)), 'none');
w('- It does not fill a missing month. A null or non-finite value in a series is refused by name, and filling or dropping it is the caller\'s decision (the data quality course conditions rates).');
w('- It builds no seasonal smoothing (Holt-Winters), no multiplicative error form, no ARIMA, no regression on other variables and no neural network. The methods are simple exponential smoothing, Holt\'s linear trend and the damped trend, all additive.');
w('- It fits no decline curve of its own. The Arps baseline is engines/dca/arps.js, imported; the decline curve analysis course teaches Arps itself.');
w('- It computes no reserves, no EUR and no cumulative production. It forecasts a rate at each future step.');
w('- It gives no analytic prediction interval. Intervals come from the residual bootstrap alone.');
w(`- Its exported names are, in full: ${Object.keys(FC).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('dataset', 'The Ekene production wells, their seed and their planted structure', ['Associate m01', 'Associate m06', 'Professional m06', 'Expert m03']);
w(`Every series in this course comes from one generator, d4_fields.mjs, which draws through the canonical mulberry32 and randomNormal of lib/stats on one stated seed, ${S(T.SEED)}, shapes each decline with engines/dca/arps.js calculateArpsHyperbolic, and rounds every rate to 0.1 bbl/d. The same inputs give the same series anywhere. The Ekene field is synthetic.`);
w();
w(`${WELLS.length} producing wells carry a monthly average oil rate in bbl/d, oldest month first. Month index 0 is the first month on production, and every index in this course counts from 0.`);
w();
table(['well', 'months', 'Arps qi (bbl/d), stated', 'Arps Di (per month), stated', 'Arps b, stated', 'noise SD, stated', 'what is planted'], T.WELLS.map((x) => [x.id, S(Y[x.id].length), S(x.qi), S(x.Di), S(x.b), S(x.noise), x.note]));
must('every well is in the dataset with its stated months', T.WELLS.every((x) => Y[x.id].length === (x.months || T.N_MONTHS)), 'lengths');
w();
w(`Each rate is qi (1 + b Di t)^(-1/b) at month t, times (1 + noise SD x a normal draw), rounded to 0.1. EKENE-P2's shut-in months are exactly 0 and its rates from month ${WSPEC['EKENE-P2'].shutIn[1] + 1} on are lifted by ${S(WSPEC['EKENE-P2'].uplift)} of the decline; EKENE-P3 holds exactly ${f6(WSPEC['EKENE-P3'].plateauRate)} for months 0 to ${WSPEC['EKENE-P3'].plateau - 1} and declines from that rate after (stated).`);
w();
w('THE FIRST TWELVE MONTHS of every well long enough, and the last six (bbl/d):');
w();
table(['well', ...Array.from({ length: 12 }, (_, i) => `m${i}`)], WELLS.filter((x) => x.rate.length >= 12).map((x) => [x.well, ...x.rate.slice(0, 12).map(f6)]));
w();
table(['well', ...Array.from({ length: 6 }, (_, i) => `m${T.N_MONTHS - 6 + i}`)], WELLS.filter((x) => x.rate.length === T.N_MONTHS).map((x) => [x.well, ...x.rate.slice(-6).map(f6)]));
w();
w(`EKENE-P6, a new well, carries ${Y6.length} months: ${list(Y6.map(f6))}.`);
w();
w(`EKENE-P2 months ${WSPEC['EKENE-P2'].shutIn[0] - 2} to ${WSPEC['EKENE-P2'].shutIn[1] + 3}, around the shut-in: ${list(Y2.slice(WSPEC['EKENE-P2'].shutIn[0] - 2, WSPEC['EKENE-P2'].shutIn[1] + 4).map(f6))}.`);
must('EKENE-P2 is exactly 0 on its shut-in months and positive elsewhere', Y2.every((v, t) => (t >= WSPEC['EKENE-P2'].shutIn[0] && t <= WSPEC['EKENE-P2'].shutIn[1]) === (v === 0)), 'zeros');
must('EKENE-P3 is exactly its plateau rate on the plateau months', Y3.slice(0, WSPEC['EKENE-P3'].plateau).every((v) => v === WSPEC['EKENE-P3'].plateauRate) && Y3[WSPEC['EKENE-P3'].plateau] !== WSPEC['EKENE-P3'].plateauRate, 'plateau');
must('every other rate is positive', WELLS.filter((x) => x.well !== 'EKENE-P2').every((x) => x.rate.every((v) => v > 0)), 'positive');
w();
w('THE PLANTED STRUCTURE, every item stated by the generator. Each is found by the named engine behaviour, and the section that finds it asserts so; the build fails if any item is not found.');
w();
table(['what', 'where', 'how it was planted', 'the engine behaviour that finds it'], T.PLANTED.map((p) => [...p]));
w();
w(`${T.PLANTED.length} items are planted.`);

/* ============================================================ SECTION 3 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m03', 'Associate m04', 'Associate m05', 'Professional m01', 'Professional m02', 'Professional m03', 'Professional m04', 'Professional m05', 'Expert m01', 'Expert m02', 'Expert m03', 'Expert m04', 'Expert m05']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number of its own: any figure in it is part of the message.');
w();
const NULL_AT = 5; // the month whose rate is set null, stated
const withNull = Y1.map((v, i) => (i === NULL_AT ? null : v));
const TILE = (n) => Array.from({ length: n }, (_, i) => Y1[i % Y1.length]);
const RISING = [100, 120, 150, 190, 240]; // a stated rising series, a new well cleaning up
const TWO_POS = [0, 0, 0, 410.5, 398.2]; // stated: three shut-in months then two producing months
const nOrig = FC.DEFAULTS.MAX_ORIGINS + 3; // origins in the origin-cap refusal
const REFUSALS = [
  ['fitSmoothing', { y: Y1, method: 'holt-winters' }, 'method', 'a method it does not offer'],
  ['fitSmoothing', { y: 'EKENE-P1', method: 'ses' }, 'y', 'a well name where the series belongs'],
  ['fitSmoothing', { y: withNull, method: 'ses' }, `y[${NULL_AT}]`, `EKENE-P1 with month ${NULL_AT} null`],
  ['fitSmoothing', { y: Y6.slice(0, 1), method: 'ses' }, 'y', 'one month, ses'],
  ['fitSmoothing', { y: Y6.slice(0, 2), method: 'holt' }, 'y', 'two months, holt'],
  ['fitSmoothing', { y: Y6.slice(0, 1), method: 'damped', initialTrend: -100 }, 'y', 'one month, damped with an initialTrend'],
  ['fitSmoothing', { y: Y1, method: 'ses', alpha: 1.2 }, 'alpha', 'alpha of 1.2'],
  ['fitSmoothing', { y: Y1, method: 'ses', alpha: -0.1 }, 'alpha', 'alpha of -0.1'],
  ['fitSmoothing', { y: Y1, method: 'holt', beta: '0.2' }, 'beta', 'beta as text'],
  ['fitSmoothing', { y: Y1, method: 'ses', beta: 0.2 }, 'beta', 'a beta on ses'],
  ['fitSmoothing', { y: Y1, method: 'ses', initialTrend: -20 }, 'initialTrend', 'an initialTrend on ses'],
  ['fitSmoothing', { y: Y1, method: 'ses', phi: 0.9 }, 'phi', 'a phi on ses'],
  ['fitSmoothing', { y: Y1, method: 'holt', phi: 0.9 }, 'phi', 'a phi on holt'],
  ['fitSmoothing', { y: Y1, method: 'damped', phi: 0 }, 'phi', 'phi of 0'],
  ['fitSmoothing', { y: Y1, method: 'damped', phi: 1.05 }, 'phi', 'phi of 1.05'],
  ['fitSmoothing', { y: Y1, method: 'ses', initialLevel: Number.NaN }, 'initialLevel', 'an initialLevel that is not a number'],
  ['fitSmoothing', { y: Y1, method: 'holt', initialTrend: 'down' }, 'initialTrend', 'an initialTrend given as a word'],
  ['fitSmoothing', { y: Y1, method: 'ses', h: -1 }, 'h', 'h of -1'],
  ['fitSmoothing', { y: Y1, method: 'ses', h: 1.5 }, 'h', 'h of 1.5'],
  ['fitSmoothing', { y: Y1, method: 'ses', h: FC.DEFAULTS.MAX_H + 1 }, 'h', `h of ${FC.DEFAULTS.MAX_H + 1}`],
  ['fitSmoothing', { y: TILE(FC.DEFAULTS.MAX_POINTS + 1), method: 'ses', alpha: 0.5 }, 'y', `${FC.DEFAULTS.MAX_POINTS + 1} values (EKENE-P1 repeated)`],
  ['accuracy', { actual: [], forecast: [] }, 'actual', 'no actuals'],
  ['accuracy', { actual: Y1.slice(36, 39), forecast: Y1.slice(33, 35) }, 'forecast', 'three actuals and two forecasts'],
  ['accuracy', { actual: Y1.slice(36, 39), forecast: [230, null, 220] }, 'forecast[1]', 'a null forecast'],
  ['accuracy', { actual: Y1.slice(36, 39), forecast: Y1.slice(33, 36), m: 0 }, 'm', 'a lag of 0'],
  ['accuracy', { actual: Y1.slice(36, 39), forecast: Y1.slice(33, 36), insample: [] }, 'insample', 'an empty training series'],
  ['forecastIntervals', { y: Y1, method: 'holt', h: 0, seed: SEED_PI }, 'h', 'h of 0'],
  ['forecastIntervals', { y: Y1, method: 'holt', h: H }, 'seed', 'no seed'],
  ['forecastIntervals', { y: Y1, method: 'holt', h: H, seed: -1 }, 'seed', 'a negative seed'],
  ['forecastIntervals', { y: Y1, method: 'holt', h: H, seed: 2.5 }, 'seed', 'a seed of 2.5'],
  ['forecastIntervals', { y: Y1, method: 'holt', h: H, seed: SEED_PI, nSims: 0 }, 'nSims', 'no paths'],
  ['forecastIntervals', { y: Y1, method: 'holt', h: H, seed: SEED_PI, nSims: FC.DEFAULTS.MAX_SIMS + 1 }, 'nSims', `${FC.DEFAULTS.MAX_SIMS + 1} paths`],
  ['forecastIntervals', { y: Y1, method: 'holt', h: H, seed: SEED_PI, nonNegative: 'yes' }, 'nonNegative', 'a word where true or false belongs'],
  ['forecastIntervals', { y: Y6, method: 'holt', h: H, seed: SEED_PI }, 'y', `EKENE-P6, ${Y6.length} months, holt`],
  ['forecastIntervals', { y: Y6.slice(0, 2), method: 'ses', h: H, seed: SEED_PI }, 'y', 'two months, ses'],
  ['backtest', { y: Y1, method: 'holt', firstOrigin: 24, horizon: 0 }, 'horizon', 'a horizon of 0'],
  ['backtest', { y: Y1, method: 'holt', firstOrigin: 24, horizon: 6, step: 0 }, 'step', 'a step of 0'],
  ['backtest', { y: Y6, method: 'holt', firstOrigin: 3, horizon: 1 }, 'y', `EKENE-P6, ${Y6.length} months, holt, horizon 1`],
  ['backtest', { y: Y1, method: 'holt', firstOrigin: 2, horizon: 6 }, 'firstOrigin', 'holt from origin 2'],
  ['backtest', { y: Y1, method: 'ses', firstOrigin: 45, horizon: 6 }, 'firstOrigin', 'origin 45 with a horizon of 6 on 48 months'],
  ['backtest', { y: Y1, method: 'ses', firstOrigin: 24, horizon: 6, refit: 'no' }, 'refit', 'a word where true or false belongs'],
  ['backtest', { y: Y1, method: 'ses', firstOrigin: 24, horizon: 6, m: 1.5 }, 'm', 'a lag of 1.5'],
  ['backtest', { y: TILE(nOrig + 2), method: 'ses', alpha: 0.5, firstOrigin: 2, horizon: 1 }, 'step', `${nOrig + 2} values (EKENE-P1 repeated), step 1`],
  ['backtest', { y: Y1, method: 'ses', firstOrigin: 24, horizon: 6, beta: 0.2 }, 'beta', 'a beta on ses'],
  ['arpsForecast', { y: Y6.slice(0, 2) }, 'y', 'two months'],
  ['arpsForecast', { y: Y1, modelType: 'Duong' }, 'modelType', 'a model it does not offer'],
  ['arpsForecast', { y: Y1, h: -1 }, 'h', 'h of -1'],
  ['arpsForecast', { y: TWO_POS }, 'y', `${TWO_POS.length} months, two of them producing`],
  ['arpsForecast', { y: RISING }, 'y', `a rising series (${list(RISING.map(S))})`],
  ['arpsForecast', { y: RISING, modelType: 'Exponential' }, 'y', 'the same rising series, exponential only'],
  ['compareWithArps', { y: Y1, methods: [], firstOrigin: 24, horizon: 6 }, 'methods', 'no methods'],
  ['compareWithArps', { y: Y1, methods: ['ses', 'arima'], firstOrigin: 24, horizon: 6 }, 'methods[1]', 'a method it does not offer'],
  ['compareWithArps', { y: Y1, methods: ['ses', 'holt', 'ses'], firstOrigin: 24, horizon: 6 }, 'methods[2]', 'a method listed twice'],
  ['compareWithArps', { y: Y1, firstOrigin: 24, horizon: 6, rankBy: 'r2' }, 'rankBy', 'a metric it does not rank by'],
  ['compareWithArps', { y: Y1, firstOrigin: 24, horizon: 6, arpsModel: 'Duong' }, 'arpsModel', 'an Arps model it does not offer'],
  ['compareWithArps', { y: Y1, firstOrigin: 24, horizon: 6, refit: 1 }, 'refit', 'a number where true or false belongs'],
  ['compareWithArps', { y: Y1, firstOrigin: 24, horizon: 6, m: 0 }, 'm', 'a lag of 0'],
  ['compareWithArps', { y: Y1, firstOrigin: 2, horizon: 6 }, 'firstOrigin', 'origin 2'],
  ['compareWithArps', { y: withNull, firstOrigin: 24, horizon: 6 }, `y[${NULL_AT}]`, `EKENE-P1 with month ${NULL_AT} null`],
];
const REF_OUT = REFUSALS.map(([fn, args, field, what]) => {
  const r = refusal(`${fn} with ${what}`, FC[fn](args), field);
  return [fn, what, r.field, r.error];
});
table(['function', 'what was passed', 'field named', 'the engine\'s message'], REF_OUT.map(([fn, what, field, msg]) => [`\`${fn}\``, what, `\`${field}\``, msg]));
const refFns = new Set(REF_OUT.map((r) => r[0]));
w();
w(`${REF_OUT.length} refusals are tabled above, across ${refFns.size} functions.`);
must('every exported function is refused at least once above', EXPORTS.every(([n]) => refFns.has(n)), [...refFns].join(','));
const P6H = REF_OUT.find((r) => r[0] === 'forecastIntervals' && r[1].startsWith('EKENE-P6'));
const P6B = REF_OUT.find((r) => r[0] === 'backtest' && r[1].startsWith('EKENE-P6'));
const P6F = success('fitSmoothing holt on EKENE-P6', FC.fitSmoothing({ y: Y6, method: 'holt' }));
planted(6, P6H && P6B && P6F.nScored === 1, `${P6H && P6H[3]} ${P6B && P6B[3]} ${P6F.nScored}`);
w();
w(`EKENE-P6, the new well: \`fitSmoothing\` fits holt on its ${Y6.length} months (${P6F.nScored} scored error), while \`forecastIntervals\` and \`backtest\` refuse it, each by its own length rule, in the rows above.`);
w();
w('A MISSING MONTH IS REFUSED BY NAME at the first index it meets, counting from 0. Nothing is filled.');
w();
w(`UNDEFINED METRICS ARE NOT REFUSALS. A MAPE or a MASE the arithmetic cannot give is returned as \`null\`, and its reason goes in \`notes\`; the other metrics are still returned. Every such reason this course meets, each from a real call, verbatim:`);
w();
const accZero = success('accuracy with a zero actual', FC.accuracy({ actual: Y2.slice(20, 26), forecast: Y2.slice(14, 20), insample: Y2.slice(0, 20) }));
const accNoIns = success('accuracy with no insample', FC.accuracy({ actual: Y1.slice(36, 39), forecast: Y1.slice(33, 36) }));
const accShort = success('accuracy with a one-month insample', FC.accuracy({ actual: Y1.slice(36, 39), forecast: Y1.slice(33, 36), insample: Y1.slice(0, 1) }));
const accFlat = success('accuracy with a flat insample', FC.accuracy({ actual: Y3.slice(9, 12), forecast: [1500, 1500, 1500], insample: Y3.slice(0, 9) }));
const accLag = success('accuracy with a lag of 12 on 12 months', FC.accuracy({ actual: Y1.slice(12, 15), forecast: Y1.slice(9, 12), insample: Y1.slice(0, 12), m: 12 }));
const btFlat = success('backtest with an origin inside the plateau', FC.backtest({ y: Y3, method: 'ses', alpha: A_SES, firstOrigin: 6, horizon: 3, step: 6 }));
const btLag = success('backtest with a lag of 12 at origin 12', FC.backtest({ y: Y1, method: 'ses', alpha: A_SES, firstOrigin: 12, horizon: 3, step: 12, m: 12 }));
const btShut = success('backtest whose actuals include the shut-in', FC.backtest({ y: Y2, method: 'ses', alpha: A_SES, firstOrigin: 20, horizon: 3, step: 6 }));
const NOTES = [
  ['`accuracy`', 'EKENE-P2 months 20 to 25 as actuals (the shut-in inside)', 'mape', accZero],
  ['`accuracy`', 'no insample', 'mase', accNoIns],
  ['`accuracy`', 'an insample of one month', 'mase', accShort],
  ['`accuracy`', 'EKENE-P3 months 0 to 8 (the plateau) as insample', 'mase', accFlat],
  ['`accuracy`', 'a lag m of 12 on an insample of 12 months', 'mase', accLag],
  ['`backtest`', 'EKENE-P3, ses, first origin 6 (inside the plateau)', 'mase', btFlat.overall],
  ['`backtest`', 'EKENE-P1, ses, lag m 12, first origin 12', 'mase', btLag.overall],
  ['`backtest`', 'EKENE-P2, ses, first origin 20 (the shut-in in the actuals)', 'mape', btShut.overall],
];
NOTES.forEach(([fn, what, k, r]) => must(`${fn} ${what}: ${k} is null with a note`, r[k] === null && r.notes && typeof r.notes[k] === 'string', r.notes && r.notes[k]));
table(['function', 'what was passed', 'metric returned as null', 'the reason in notes, verbatim'], NOTES.map(([fn, what, k, r]) => [fn, what, k, r.notes[k]]));
w();
w('A backtest reason names the origin it comes from; an `accuracy` reason names the input. Every other metric of those calls is a number.');
must('the other metrics of the null-MAPE accuracy call are numbers', ['me', 'mae', 'rmse', 'smape', 'mase'].every((k) => typeof accZero[k] === 'number'), 'numbers');
w();
w(`WARNINGS. \`fitSmoothing\`, \`forecastIntervals\` and \`backtest\` add \`warnings\` when the compass search stops at ${FC.DEFAULTS.PS_MAX_EVALS} SSE evaluations before its step falls to 2^-30 of the range (\`converged\` false). No fit in this course reaches that cap: every optimiser record this digest reads reports \`converged\` true (asserted at the end of the build).`);

/* ============================================================ SECTION 4 */

section('series', 'A rate series, one-step forecasts and h-step forecasts', ['Associate m01 l01', 'Associate m01 l02', 'Associate m01 l04']);
w(`A series y is one number per time step, oldest first; here a step is a month and y_t the monthly average rate. A forecasting method reads only the series itself: no pressure, no choke setting, no reservoir model. Two kinds of forecast come out of every fit:`);
w();
w('- the ONE-STEP forecast f_t, made at month t - 1 for month t using the months up to t - 1. It exists inside the series, and the gap y_t - f_t is the residual the fit is scored on. The engine returns them as `fitted`.');
w('- the h-STEP forecasts from the last month: f at n + 1, ..., n + h, made once, from the final state. The engine returns them as `forecast`, index 0 being one step past the last month.');
w();
const SES03 = success(`fitSmoothing ses alpha ${A_SES} on EKENE-P1, h ${H}`, FC.fitSmoothing({ y: Y1, method: 'ses', alpha: A_SES, h: H }));
w(`EKENE-P1, simple exponential smoothing with alpha ${S(A_SES)} (stated, held fixed), the first six months:`);
w();
table(['month t', 'rate y_t', 'one-step forecast f_t', 'residual y_t - f_t', 'level l_t'], [0, 1, 2, 3, 4, 5].map((t) => [S(t), f6(Y1[t]), f6(SES03.fitted[t]), f6(SES03.residuals[t]), f6(SES03.level[t])]));
must('fitted and residuals are null at month 0', SES03.fitted[0] === null && SES03.residuals[0] === null, 'null');
must('each residual is the rate less the fitted value', SES03.residuals.every((e, t) => t === 0 || e === Y1[t] - SES03.fitted[t]), 'residuals');
w();
w(`Month 0 has no one-step forecast (\`fitted\` and \`residuals\` are null there): nothing came before it. From month 1 on each residual is the rate less the one-step forecast, exactly as returned.`);
w();
w(`The ${H} h-step forecasts from month ${Y1.length - 1}: ${list(SES03.forecast.map(f6))}. The last month's rate is ${f6(Y1[Y1.length - 1])}; simple smoothing's h-step forecast is the final level at every step (${ref('ses')}).`);
must('the ses h-step forecast is the final level at every step', SES03.forecast.every((v) => v === SES03.level[Y1.length - 1]), 'flat');
w();
w(`\`h\` sets how many h-step forecasts come back; it is 0 when left out, so a fit alone returns an empty \`forecast\`. The largest h is ${FC.DEFAULTS.MAX_H}.`);
must('h 0 by default returns an empty forecast', FC.fitSmoothing({ y: Y1, method: 'ses', alpha: A_SES }).forecast.length === 0, 'empty');

/* ============================================================ SECTION 5 */

section('ses', 'Simple exponential smoothing: the level, alpha and a flat forecast', ['Associate m02']);
w(`The basis reads: "${SES03.basis.method}". alpha is the weight the newest month gets; 1 - alpha goes to the old forecast. With alpha ${S(A_SES)} each level is ${S(A_SES)} of the new rate plus ${S(1 - A_SES)} of the forecast it replaces.`);
must('1 - alpha prints as stated', S(1 - A_SES) === '0.7', 1 - A_SES);
w();
w(`STARTING AT THE FIRST MONTH. The engine anchors the level at the first observation, l_1 = y_1, so the first one-step forecast is y_1 itself (month 1's fitted value ${f6(SES03.fitted[1])} is month 0's rate ${f6(Y1[0])}). The basis reads: "${SES03.basis.initial}". \`scoredFrom\` is ${SES03.scoredFrom}: the SSE sums the residuals from index ${SES03.scoredFrom} on, ${SES03.nScored} of them on EKENE-P1's ${SES03.n} months.`);
must('ses scores from index 1 with n - 1 errors', SES03.scoredFrom === 1 && SES03.nScored === Y1.length - 1 && SES03.fitted[1] === Y1[0], SES03.scoredFrom);
w();
const SESL = success('fitSmoothing ses alpha 0.3 with an initialLevel of 1150', FC.fitSmoothing({ y: Y1, method: 'ses', alpha: A_SES, initialLevel: 1150 }));
w(`An \`initialLevel\` replaces y_1 as the start: with ${f6(1150)} (stated) the first fitted value is ${f6(SESL.fitted[1])}, the rule reads "${SESL.initial.rule}", and the SSE moves from ${f6(SES03.sse)} to ${f6(SESL.sse)}. The start matters most for the first months.`);
must('the initialLevel is the first fitted value', SESL.fitted[1] === 1150, SESL.fitted[1]);
w();
w(`A FLAT FORECAST. Simple smoothing has no trend, so every h-step forecast is the final level l_n: EKENE-P1 at alpha ${S(A_SES)} forecasts ${f6(SES03.forecast[0])} at every one of the ${H} steps, while the last month's rate is ${f6(Y1[Y1.length - 1])}. On a declining well a flat forecast sits above the decline to come.`);
w();
const ALPHAS = [0, 0.1, 0.3, 0.5, 0.9, 1];
const sesA = ALPHAS.map((a) => success(`fitSmoothing ses alpha ${a} on EKENE-P1`, FC.fitSmoothing({ y: Y1, method: 'ses', alpha: a, h: 1 })));
w(`ALPHA FROM 0 TO 1 on EKENE-P1 (each alpha stated, held fixed):`);
w();
table(['alpha', 'SSE', 'MSE', 'forecast at every step'], ALPHAS.map((a, i) => [S(a), f6(sesA[i].sse), f6(sesA[i].mse), f6(sesA[i].forecast[0])]));
must('alpha 0 forecasts the first month for ever', sesA[0].forecast[0] === Y1[0], sesA[0].forecast[0]);
must('alpha 1 forecasts the last month', sesA[ALPHAS.length - 1].forecast[0] === Y1[Y1.length - 1], sesA[ALPHAS.length - 1].forecast[0]);
w();
w(`At alpha 0 the level never moves from y_1: the forecast is month 0's ${f6(Y1[0])} for ever. At alpha 1 the level is always the newest rate, so each one-step forecast is the month before and the h-step forecast is the last month's ${f6(Y1[Y1.length - 1])}: that is the NAIVE forecast.`);
w();
const SESF = Object.fromEntries(WELLS.filter((x) => x.rate.length === T.N_MONTHS).map((x) => [x.well, success(`fitSmoothing ses fitted on ${x.well}`, FC.fitSmoothing({ y: x.rate, method: 'ses', h: 1 }))]));
w(`ALPHA FITTED, every 48-month well (the fit of ${ref('fit')}):`);
w();
table(['well', 'fitted alpha', 'atBounds', 'SSE', 'MSE'], Object.entries(SESF).map(([id, r]) => [id, f6(r.params.alpha), r.optimiser.atBounds.length ? list(r.optimiser.atBounds) : 'none', f6(r.sse), f6(r.mse)]));
const onOne = Object.entries(SESF).filter(([, r]) => r.params.alpha === 1).map(([id]) => id);
must('ses fits alpha 1 on every well but the noisy one', onOne.length === 4 && !onOne.includes('EKENE-P4'), onOne.join(','));
planted(4, SESF['EKENE-P4'].params.alpha < SESF['EKENE-P1'].params.alpha, `${SESF['EKENE-P4'].params.alpha} ${SESF['EKENE-P1'].params.alpha}`);
w();
w(`On ${list(onOne)} the fitted alpha stops on its upper bound 1, so the fit becomes the naive forecast. The noisy allocation, EKENE-P4, fits alpha ${f6(SESF['EKENE-P4'].params.alpha)}, inside the box.`);

/* ============================================================ SECTION 6 */

section('holt', 'Holt\'s linear trend: a level, a trend and the month spent on the start', ['Associate m03']);
const HOLT = success(`fitSmoothing holt alpha ${A_HOLT} beta ${B_HOLT} on EKENE-P1, h ${H}`, FC.fitSmoothing({ y: Y1, method: 'holt', alpha: A_HOLT, beta: B_HOLT, h: H }));
w(`The basis reads: "${HOLT.basis.method}". A TREND state b follows the level's month-to-month change; beta weights the newest change against the old trend. EKENE-P1, alpha ${S(A_HOLT)} and beta ${S(B_HOLT)} (stated, held fixed):`);
w();
table(['month t', 'rate y_t', 'one-step forecast f_t', 'residual', 'level l_t', 'trend b_t'], [0, 1, 2, 3, 4, 5].map((t) => [S(t), f6(Y1[t]), f6(HOLT.fitted[t]), f6(HOLT.residuals[t]), f6(HOLT.level[t]), f6(HOLT.trend[t])]));
must('holt starts at l_1 = y_1 and b_1 = y_2 - y_1', HOLT.level[0] === Y1[0] && HOLT.trend[0] === Y1[1] - Y1[0], `${HOLT.level[0]} ${HOLT.trend[0]}`);
must('the second month is forecast exactly', HOLT.fitted[1] === Y1[1], HOLT.fitted[1]);
w();
w(`THE SECOND MONTH IS SPENT ON THE START. The engine starts at l_1 = y_1 and b_1 = y_2 - y_1: here \`initial.level\` ${f6(HOLT.initial.level)} and \`initial.trend\` ${f6(HOLT.initial.trend)} (${f6(Y1[1])} - ${f6(Y1[0])}). The first one-step forecast, f_2 = l_1 + b_1, is then y_2 itself (${f6(HOLT.fitted[1])}), a residual of 0 by construction that says nothing about the method. The engine does not score it: \`residuals\` is null at index 1 and \`scoredFrom\` is ${HOLT.scoredFrom}. The basis reads: "${HOLT.basis.initial}".`);
must('holt scores from index 2', HOLT.scoredFrom === 2 && HOLT.residuals[1] === null && HOLT.nScored === Y1.length - 2, HOLT.scoredFrom);
w();
const HOLTT = success('fitSmoothing holt with an initialTrend of -25', FC.fitSmoothing({ y: Y1, method: 'holt', alpha: A_HOLT, beta: B_HOLT, initialTrend: -25 }));
w(`WITH AN initialTrend GIVEN, y_2 is not spent: an \`initialTrend\` of ${f6(-25)} (stated) gives the rule "${HOLTT.initial.rule}", \`scoredFrom\` ${HOLTT.scoredFrom} and ${HOLTT.nScored} scored errors, and month 1 is forecast at ${f6(HOLTT.fitted[1])} with a residual of ${f6(HOLTT.residuals[1])}.`);
must('holt with an initialTrend scores from index 1', HOLTT.scoredFrom === 1 && HOLTT.nScored === Y1.length - 1, HOLTT.scoredFrom);
w();
w(`THE MEAN SQUARED ERROR divides the SSE by the scored errors only; the basis reads: "${HOLT.basis.mse}". Here SSE ${f6(HOLT.sse)} over ${HOLT.nScored} errors is MSE ${f6(HOLT.mse)} (derived check: ${f6(HOLT.sse / HOLT.nScored)}).`);
must('mse is sse over nScored', HOLT.mse === HOLT.sse / HOLT.nScored, HOLT.mse);
w();
const lastL = HOLT.level[Y1.length - 1]; const lastB = HOLT.trend[Y1.length - 1];
w(`THE h-STEP FORECAST is l_n + h b_n, a straight line from the final state: l_n ${f6(lastL)}, b_n ${f6(lastB)}. Steps 1, 2, 3 and ${H}: ${[0, 1, 2, H - 1].map((j) => f6(HOLT.forecast[j])).join(', ')}.`);
must('the holt forecast is l_n + h b_n', HOLT.forecast.every((v, j) => nearly(v, lastL + (j + 1) * lastB, 1e-12)), 'line');
w();
const HOLT5 = success('fitSmoothing holt fitted on EKENE-P5, h 24', FC.fitSmoothing({ y: Y5, method: 'holt', h: 24 }));
const firstNeg = HOLT5.forecast.findIndex((v) => v < 0);
const DAMP5 = success('fitSmoothing damped fitted on EKENE-P5, h 24', FC.fitSmoothing({ y: Y5, method: 'damped', h: 24 }));
must('the damped EKENE-P5 forecast stays above zero for 24 steps', DAMP5.forecast.every((v) => v > 0), Math.min(...DAMP5.forecast));
w(`A TREND THAT RUNS BELOW ZERO. EKENE-P5 declines steeply to a low tail (its last month ${f6(Y5[Y5.length - 1])} bbl/d). Holt fitted on it (alpha ${f6(HOLT5.params.alpha)}, beta ${f6(HOLT5.params.beta)}) ends on a trend of ${f6(HOLT5.trend[Y5.length - 1])} bbl/d per month, and its straight-line forecast crosses zero: step ${firstNeg} is ${f6(HOLT5.forecast[firstNeg - 1])} and step ${firstNeg + 1} is ${f6(HOLT5.forecast[firstNeg])}. A rate cannot be negative; the method does not know that, and the engine returns the line as computed. The damped trend fitted on the same well (${ref('damped')}) is ${f6(DAMP5.forecast[23])} at step 24.`);
must('the holt EKENE-P5 forecast turns negative inside 24 steps', firstNeg > 0 && HOLT5.forecast[firstNeg - 1] >= 0 && HOLT5.forecast[firstNeg] < 0, firstNeg);

/* ============================================================ SECTION 7 */

section('damped', 'The damped trend: phi, the flattening and its limit', ['Associate m04']);
const DAMP = success(`fitSmoothing damped alpha ${A_HOLT} beta ${B_HOLT} phi ${PHI_T} on EKENE-P1, h ${H}`, FC.fitSmoothing({ y: Y1, method: 'damped', alpha: A_HOLT, beta: B_HOLT, phi: PHI_T, h: H }));
w(`The basis reads: "${DAMP.basis.method}". phi multiplies the trend at every step, so each step's change is phi times the one before, and the forecast flattens instead of running on as a line. EKENE-P1, alpha ${S(A_HOLT)}, beta ${S(B_HOLT)} and phi ${S(PHI_T)} (stated):`);
w();
const dl = DAMP.level[Y1.length - 1]; const db = DAMP.trend[Y1.length - 1];
const dsteps = DAMP.forecast.map((v, j) => (j === 0 ? v - dl : v - DAMP.forecast[j - 1]));
table(['step h', 'damped forecast', 'change from the step before', 'change / change before (derived)'], DAMP.forecast.slice(0, 6).map((v, j) => [S(j + 1), f6(v), f6(dsteps[j]), j === 0 ? 'none' : f6(dsteps[j] / dsteps[j - 1])]));
must('each step change is phi times the one before', dsteps.slice(1, 6).every((d, j) => nearly(d / dsteps[j], PHI_T, 1e-9)), 'phi');
w();
w(`The first change is phi b_n = ${f6(dsteps[0])} from the final level l_n ${f6(dl)} (final trend b_n ${f6(db)}), and every later change is ${S(PHI_T)} times the one before (checked to ${eX(CHECK_TOL)} on the steps shown).`);
w();
const LIMIT = dl + db * PHI_T / (1 - PHI_T);
const DFAR = success('fitSmoothing damped, the same parameters, h 400', FC.fitSmoothing({ y: Y1, method: 'damped', alpha: A_HOLT, beta: B_HOLT, phi: PHI_T, h: 400 }));
must('the forecast at step 400 is the limit to 1e-9', nearly(DFAR.forecast[399], LIMIT, 1e-9), `${DFAR.forecast[399]} ${LIMIT}`);
w(`THE LIMIT. The damped forecast l_n + (phi + phi^2 + ... + phi^h) b_n approaches l_n + b_n phi / (1 - phi) as h grows: ${f6(LIMIT)} here (derived from the final state). The engine's own forecast is ${f6(DAMP.forecast[H - 1])} at step ${H} and ${f6(DFAR.forecast[399])} at step 400 (h 400, stated), the limit to ${eX(CHECK_TOL)}. The damped forecast levels off at a rate; a Holt forecast on the same parameters falls by b_n every step without end.`);
w();
const PHI1 = success('fitSmoothing damped phi 1', FC.fitSmoothing({ y: Y1, method: 'damped', alpha: A_HOLT, beta: B_HOLT, phi: 1, h: H }));
must('damped with phi 1 is holt exactly', PHI1.sse === HOLT.sse && PHI1.forecast.every((v, j) => v === HOLT.forecast[j]), `${PHI1.sse} ${HOLT.sse}`);
w(`DAMPED WITH PHI 1 IS HOLT. With phi 1 given, the damped fit returns the same SSE (${f6(PHI1.sse)}) and the same ${H} forecasts as Holt at the same alpha and beta, bit for bit: Holt is the damped method with phi = 1.`);
w();
const DFIT = Object.fromEntries(WELLS.filter((x) => x.rate.length === T.N_MONTHS).map((x) => [x.well, success(`fitSmoothing damped fitted on ${x.well}`, FC.fitSmoothing({ y: x.rate, method: 'damped', h: H }))]));
w(`PHI FITTED AND PHI GIVEN. A FITTED phi is searched from ${S(FC.DEFAULTS.PHI_MIN)} to ${S(FC.DEFAULTS.PHI_MAX)} inclusive; a GIVEN phi may be any number above 0 and at most 1. Every 48-month well, damped fitted:`);
w();
table(['well', 'alpha', 'beta', 'phi', 'atBounds', 'SSE', `forecast at step ${H}`], Object.entries(DFIT).map(([id, r]) => [id, f6(r.params.alpha), f6(r.params.beta), f6(r.params.phi), r.optimiser.atBounds.length ? list(r.optimiser.atBounds) : 'none', f6(r.sse), f6(r.forecast[H - 1])]));
must('every fitted phi is inside the search range', Object.values(DFIT).every((r) => r.params.phi >= FC.DEFAULTS.PHI_MIN && r.params.phi <= FC.DEFAULTS.PHI_MAX), 'range');
const phiLow = Object.entries(DFIT).filter(([, r]) => r.params.phi === FC.DEFAULTS.PHI_MIN).map(([id]) => id);
must('EKENE-P4 fits phi on its lower bound', phiLow.includes('EKENE-P4'), phiLow.join(','));
w();
const PHI05 = success('fitSmoothing damped phi 0.5 given', FC.fitSmoothing({ y: Y1, method: 'damped', phi: 0.5, h: H }));
w(`${list(phiLow)} ${phiLow.length === 1 ? 'fits' : 'fit'} phi on the lower bound ${S(FC.DEFAULTS.PHI_MIN)}, listed in \`atBounds\`. A phi below the range can only be given: phi 0.5 (stated) is accepted, held fixed (\`fixed\` lists ${list(PHI05.fixed)}), and alpha and beta are fitted around it: alpha ${f6(PHI05.params.alpha)}, beta ${f6(PHI05.params.beta)}, SSE ${f6(PHI05.sse)}.`);
must('phi 0.5 given is fixed and alpha, beta free', PHI05.fixed.join() === 'phi' && PHI05.free.join() === 'alpha,beta', PHI05.fixed);

/* ============================================================ SECTION 8 */

section('fit', 'Fitting the parameters: SSE, the grid, the compass search and the bounds', ['Associate m05']);
const HF = success('fitSmoothing holt fitted on EKENE-P1', FC.fitSmoothing({ y: Y1, method: 'holt', h: H }));
const DF = DFIT['EKENE-P1'];
w(`A parameter left out is fitted; a parameter given is held fixed. The fit minimises the SSE of the scored one-step errors. The basis reads: "${HF.basis.fit}".`);
w();
w(`TWO STAGES. First every point of the coarse grid is scored (alpha outermost, then beta, then phi) and the lowest SSE wins; a later point replaces the best only when its SSE is below best x (1 - ${eX(FC.DEFAULTS.GRID_TIE_REL)}), so a tie keeps the earlier point. Then a compass search starts from that point: it tries +step then -step on each free parameter in turn, moves to the best trial that lowers the SSE, and halves the step after a sweep that improves nothing. EKENE-P1, the three methods fitted:`);
w();
const FITS3 = [['ses', SESF['EKENE-P1']], ['holt', HF], ['damped', DF]];
table(['method', 'grid start', 'grid SSE', 'final parameters', 'final SSE', 'moves', 'halvings', 'SSE evaluations', 'converged'], FITS3.map(([m, r]) => [m, Object.entries(r.optimiser.gridStart).map(([k, v]) => `${k} ${S(v)}`).join(', '), f6(r.optimiser.gridSse), Object.entries(r.params).map(([k, v]) => `${k} ${f6(v)}`).join(', '), f6(r.sse), S(r.optimiser.moves), S(r.optimiser.halvings), S(r.optimiser.evaluations), S(r.optimiser.converged)]));
FITS3.forEach(([m, r]) => must(`${m}: the final SSE is at most the grid SSE`, r.sse <= r.optimiser.gridSse, `${r.sse} ${r.optimiser.gridSse}`));
w();
w(`The final SSE is at most the grid SSE on every method (the search only moves downhill). The grid alone has ${FC.DEFAULTS.GRID_ALPHA.length} points for ses, ${FC.DEFAULTS.GRID_ALPHA.length ** 2} for holt and ${FC.DEFAULTS.GRID_ALPHA.length ** 2 * FC.DEFAULTS.GRID_PHI.length} for damped (derived, ${FC.DEFAULTS.GRID_ALPHA.length} alpha values, ${FC.DEFAULTS.GRID_ALPHA.length} beta values, ${FC.DEFAULTS.GRID_PHI.length} phi values); the remaining evaluations are the compass search.`);
FITS3.forEach(([m, r]) => must(`${m}: evaluations exceed the grid`, r.optimiser.evaluations > FC.DEFAULTS.GRID_ALPHA.length ** r.free.filter((f) => f !== 'phi').length * (r.free.includes('phi') ? FC.DEFAULTS.GRID_PHI.length : 1), r.optimiser.evaluations));
w();
w(`THE STOP RULE. The search stops, \`converged\` true, when a sweep at a step of at most 2^-30 of each range improves nothing; \`finalStep\` is that fraction. Holt on EKENE-P1 ends at ${eX(HF.optimiser.finalStep)} after ${HF.optimiser.halvings} halvings from ${S(FC.DEFAULTS.PS_STEP)}. A search that reaches ${FC.DEFAULTS.PS_MAX_EVALS} evaluations first stops with \`converged\` false and a warning (${ref('refusals')}).`);
must('holt final step is at most 2^-30', HF.optimiser.finalStep <= 2 ** -30, HF.optimiser.finalStep);
w();
const HELD = success('fitSmoothing holt with the fitted parameters given', FC.fitSmoothing({ y: Y1, method: 'holt', ...HF.params, h: H }));
must('holding the fitted parameters reproduces the fit exactly', HELD.sse === HF.sse && HELD.forecast.every((v, j) => v === HF.forecast[j]) && HELD.optimiser === null, `${HELD.sse} ${HF.sse}`);
w(`HOLDING THE FIT. Giving the fitted alpha and beta back as fixed parameters returns the same SSE and forecasts bit for bit, with \`optimiser\` null and the basis "${HELD.basis.fit}".`);
w();
w('PARAMETERS ON THEIR BOUNDS. `optimiser.atBounds` lists every fitted parameter that ended exactly on a bound of its box (alpha and beta 0 or 1, phi 0.8 or 0.98). Across the fits of this digest:');
w();
const BOUNDROWS = [
  ...Object.entries(SESF).map(([id, r]) => [id, 'ses', r]),
  ...Object.entries(DFIT).map(([id, r]) => [id, 'damped', r]),
  ['EKENE-P1', 'holt', HF],
].filter(([, , r]) => r.optimiser.atBounds.length);
table(['well', 'method', 'atBounds'], BOUNDROWS.map(([id, m, r]) => [id, m, list(r.optimiser.atBounds)]));
w();
w('A parameter on its bound is a fitted value like any other; it says the SSE was still falling at the edge of the box. For alpha at 1 that is the naive forecast; for phi at 0.8 it is the strongest damping the fit may choose.');
w();
const gHL = golden('holt-linear-exact');
const HL = success('golden holt-linear-exact', FC.fitSmoothing(clone(gHL.args)));
must('the exact line fits with SSE 0 at the first grid point', HL.sse === 0 && HL.params.alpha === 0 && HL.params.beta === 0 && HL.optimiser.moves === 0, JSON.stringify(HL.params));
w(`A FLAT SSE SURFACE. Golden \`holt-linear-exact\`: the exact line ${list(gHL.args.y.map(S))}. Every alpha and beta give SSE ${S(HL.sse)}, so the grid tie keeps its first point, alpha ${S(HL.params.alpha)} and beta ${S(HL.params.beta)}, and the search makes ${HL.optimiser.moves} moves. The parameters are not identified: any pair would fit as well. The forecasts ${list(HL.forecast.map(f6))} continue the line.`);

/* ============================================================ SECTION 9 */

section('workflow', 'One well forecast, end to end', ['Associate m06 l01', 'Associate m06 l03']);
w(`The Associate workflow on EKENE-P4, the noisy allocation, in order:`);
w();
const WF = ['ses', 'holt', 'damped'].map((m) => [m, success(`fitSmoothing ${m} fitted on EKENE-P4, h ${H}`, FC.fitSmoothing({ y: Y4, method: m, h: H }))]);
w(`${step()}. Read the series: ${Y4.length} months, first ${f6(Y4[0])}, last ${f6(Y4[Y4.length - 1])} bbl/d, no missing month (a missing month is refused by name).`);
w(`${step()}. Fit each method with every parameter left free, and record the parameters, \`atBounds\` and \`converged\`:`);
w();
table(['method', 'parameters', 'atBounds', 'scoredFrom', 'SSE', 'MSE', `forecast step 1`, `forecast step ${H}`], WF.map(([m, r]) => [m, Object.entries(r.params).map(([k, v]) => `${k} ${f6(v)}`).join(', '), r.optimiser.atBounds.length ? list(r.optimiser.atBounds) : 'none', S(r.scoredFrom), f6(r.sse), f6(r.mse), f6(r.forecast[0]), f6(r.forecast[H - 1])]));
WF.forEach(([m, r]) => must(`EKENE-P4 ${m} converged`, r.optimiser.converged, m));
w();
w(`${step()}. Compare MSE, and never SSE, across methods: ses scores ${WF[0][1].nScored} errors and holt and damped ${WF[1][1].nScored}, because holt and damped spend month 1 on the start.`);
const bestIn = WF.reduce((b, x) => (x[1].mse < b[1].mse ? x : b));
w(`${step()}. The lowest in-sample MSE here is ${bestIn[0]}'s ${f6(bestIn[1].mse)}. An in-sample MSE says how well a method followed months it had already seen; whether it forecasts months it has not seen is the Professional tier's question, answered with a backtest (${ref('backtest')}).`);
w(`${step()}. Report the forecast with its method, parameters, the months it was fitted on and h, for example: damped, alpha ${f6(WF[2][1].params.alpha)}, beta ${f6(WF[2][1].params.beta)}, phi ${f6(WF[2][1].params.phi)} (on its lower bound), fitted on months 0 to ${Y4.length - 1} of EKENE-P4, ${H} steps: ${f6(WF[2][1].forecast[0])} at step 1 and ${f6(WF[2][1].forecast[H - 1])} at step ${H}.`);
w();
w('WRITING UP A FORECAST names: the well and the months fitted; the method; each parameter and whether it was fitted or given, with any bound it sits on; scoredFrom and the MSE; h; and that the numbers are in-sample until a backtest is run.');

/* ============================================================ SECTION 10 */

section('nist', 'The NIST/SEMATECH e-Handbook: a published check on the engine', ['Associate m06 l02']);
w(`The NIST/SEMATECH e-Handbook of Statistical Methods, section 6.4.3 (${GOLD.sources.nist}), works exponential smoothing by hand on two small series. It is a public domain U.S. government publication, and its printed figures are a check from outside this programme. The vendored golden carries its inputs; every figure below is the engine's, run on those inputs, beside the handbook's printed figure.`);
w();
const NIST = CASES.filter((c) => c.source === 'published');
const pubRows = [];
NIST.forEach((c) => {
  const r = success(`golden ${c.id}`, FC[c.fn](clone(c.args)));
  c.published.forEach((p) => {
    const v = p.field.split('.').reduce((o, k) => (o == null ? undefined : o[k]), r);
    const rounded = Math.round(v * 10 ** p.digits) / 10 ** p.digits;
    must(`${c.id} ${p.field} rounds to the published figure`, rounded === p.value, `${v} ${p.value}`);
    pubRows.push([c.id, p.field, p.value.toFixed(p.digits), f6(v), S(p.digits)]);
  });
});
const pick = (id, fields) => pubRows.filter((r) => r[0] === id && fields.includes(r[1]));
w(`${NIST.length} golden cases carry ${pubRows.length} published figures, and the engine rounds to every one of them at the handbook's printed decimals. A selection:`);
w();
table(['golden case', 'engine field', 'NIST printed', 'engine, six decimals', 'decimals printed by NIST'], [
  ...pick('nist-6431-ses-alpha-0.1', ['fitted.1', 'fitted.11', 'mse', 'forecast.0']),
  ...pick('nist-6434-holt-fit', ['params.alpha', 'params.beta']),
  ...pick('nist-6434-ses-fit', ['params.alpha', 'forecast.0']),
  ...pick('nist-6434-ses-alpha-1', ['mse']),
]);
const g61 = golden('nist-6431-ses-alpha-0.1');
w();
w(`The first case is the handbook's 12-point series ${list(g61.args.y.map(S))} at alpha ${S(g61.args.alpha)}: the same start (l_1 = y_1) and the same MSE divisor (the scored errors) as this engine, which is why the figures agree.`);
const gHF = golden('nist-6434-holt-fit');
const HFN = success('golden nist-6434-holt-fit', FC.fitSmoothing(clone(gHF.args)));
w();
w(`NIST's double smoothing example fits alpha ${f6(HFN.params.alpha)} and a trend weight of ${f6(HFN.params.beta)}, on its upper bound (\`atBounds\` ${list(HFN.optimiser.atBounds)}), with the handbook's own start b_1 = ${S(gHF.args.initialTrend)} given as \`initialTrend\`.`);
must('the NIST holt fit has beta on its bound', HFN.optimiser.atBounds.includes('beta = 1'), HFN.optimiser.atBounds);

/* ============================================================ SECTION 11 */

section('errors', 'Forecast errors: actual minus forecast, bias, MAE and RMSE', ['Professional m01']);
const HO = Object.fromEntries(['ses', 'holt', 'damped'].map((m) => [m, success(`fitSmoothing ${m} fitted on EKENE-P1 months 0 to ${TRAIN - 1}, h ${H}`, FC.fitSmoothing({ y: Y1.slice(0, TRAIN), method: m, h: H }))]));
const ACT = Y1.slice(TRAIN, TRAIN + H);
const ACC = Object.fromEntries(Object.entries(HO).map(([m, r]) => [m, success(`accuracy of ${m} on EKENE-P1 months ${TRAIN} to ${TRAIN + H - 1}`, FC.accuracy({ actual: ACT, forecast: r.forecast, insample: Y1.slice(0, TRAIN) }))]));
w(`An ERROR is actual minus forecast; the basis reads: "${ACC.holt.basis.errors}". A positive error means the forecast was low. The teaching hold-out: each method fitted on EKENE-P1 months 0 to ${TRAIN - 1} (stated), forecast ${H} steps, and scored against months ${TRAIN} to ${TRAIN + H - 1}, which the fit never saw.`);
w();
table(['month', 'actual', 'ses forecast', 'holt forecast', 'damped forecast', 'holt error'], ACT.map((a, j) => [S(TRAIN + j), f6(a), f6(HO.ses.forecast[j]), f6(HO.holt.forecast[j]), f6(HO.damped.forecast[j]), f6(a - HO.holt.forecast[j])]));
w();
table(['method', 'ME', 'MAE', 'RMSE'], Object.entries(ACC).map(([m, a]) => [m, f6(a.me), f6(a.mae), f6(a.rmse)]));
Object.entries(ACC).forEach(([m, a]) => must(`${m}: ME, MAE and RMSE are the engine's means`, nearly(a.mae, absMean(ACT.map((v, j) => v - HO[m].forecast[j])), 1e-12) && a.rmse >= a.mae, m));
must('every method forecasts EKENE-P1 high on the hold-out (ME below 0)', Object.values(ACC).every((a) => a.me < 0), Object.values(ACC).map((a) => a.me));
w();
w(`THE MEAN ERROR is the bias; the basis reads: "${ACC.holt.basis.me}". All three methods have ME below 0 on this hold-out: each forecast EKENE-P1 high. ses has ME equal to minus its MAE (${f6(ACC.ses.me)} and ${f6(ACC.ses.mae)}): every one of its ${H} errors is negative, the flat forecast above every month of the decline.`);
must('ses: every error is negative', ACT.every((v) => v - HO.ses.forecast[0] < 0), 'negative');
w();
w(`MAE is "${ACC.holt.basis.mae}" and RMSE "${ACC.holt.basis.rmse}", both in bbl/d. RMSE is at least MAE on every row above: squaring weights the large errors. The divisor of RMSE is n, the number of errors scored.`);
w();
const INS = Object.fromEntries(Object.entries(HO).map(([m, r]) => [m, absMean(r.residuals.slice(r.scoredFrom))]));
w(`IN-SAMPLE AND OUT-OF-SAMPLE. The in-sample MAE is the mean absolute one-step residual over the fitted months (derived from \`residuals\` from \`scoredFrom\` on); the out-of-sample MAE is the hold-out's, above:`);
w();
table(['method', 'in-sample one-step MAE, months 0 to 35 (derived)', `out-of-sample MAE, ${H} steps ahead`], Object.keys(HO).map((m) => [m, f6(INS[m]), f6(ACC[m].mae)]));
w();
w(`The two answer different questions: the in-sample figure scores forecasts one month ahead on months the fit was chosen on; the hold-out scores forecasts up to ${H} months ahead on months it never saw. A method is judged on the second.`);

/* ============================================================ SECTION 12 */

section('percentage', 'Percentage errors: MAPE, its zero actual, and sMAPE', ['Professional m02']);
w(`MAPE is "${ACC.holt.basis.mape}"; sMAPE is "${ACC.holt.basis.smape}". On the teaching hold-out:`);
w();
table(['method', 'MAPE (percent)', 'sMAPE (percent)'], Object.entries(ACC).map(([m, a]) => [m, f6(a.mape), f6(a.smape)]));
w();
const P2F = success('fitSmoothing holt fitted on EKENE-P2 months 0 to 19, h 6', FC.fitSmoothing({ y: Y2.slice(0, 20), method: 'holt', h: 6 }));
const P2A = success('accuracy of that forecast on months 20 to 25', FC.accuracy({ actual: Y2.slice(20, 26), forecast: P2F.forecast, insample: Y2.slice(0, 20) }));
planted(1, P2A.mape === null && /is 0 and MAPE divides by each actual/.test(P2A.notes.mape), P2A.notes && P2A.notes.mape);
w(`A SHUT-IN MONTH IN THE ACTUALS. EKENE-P2, holt fitted on months 0 to 19, forecast 6 steps, scored on months 20 to 25, which include the shut-in months 22 to 24 at rate 0 (stated):`);
w();
table(['month', 'actual', 'holt forecast', 'error', 'term of sMAPE, 200 |e| / (|y| + |f|) (derived)'], Y2.slice(20, 26).map((a, j) => [S(20 + j), f6(a), f6(P2F.forecast[j]), f6(a - P2F.forecast[j]), f6((200 * Math.abs(a - P2F.forecast[j])) / (Math.abs(a) + Math.abs(P2F.forecast[j])))]));
w();
w(`MAPE is null, and the reason reads: "${P2A.notes.mape}". MAPE divides by each actual, and a shut-in month has none to divide by; the engine reports no number rather than drop the month. sMAPE is ${f6(P2A.smape)}: every shut-in term scores 200, the top of its scale, whatever non-zero forecast is made. The other metrics are numbers: MAE ${f6(P2A.mae)}, RMSE ${f6(P2A.rmse)}, MASE ${f6(P2A.mase)}.`);
must('each shut-in term of sMAPE is 200', [22, 23, 24].every((t) => (200 * Math.abs(Y2[t] - P2F.forecast[t - 20])) / (Math.abs(Y2[t]) + Math.abs(P2F.forecast[t - 20])) === 200 || nearly((200 * Math.abs(Y2[t] - P2F.forecast[t - 20])) / (Math.abs(Y2[t]) + Math.abs(P2F.forecast[t - 20])), 200, 1e-12)), '200');
w();
const Z0 = success('accuracy with a matched zero', FC.accuracy({ actual: [0, 100], forecast: [0, 90] }));
const Z1 = success('accuracy with an unmatched zero', FC.accuracy({ actual: [0, 100], forecast: [5, 90] }));
w(`THE 0/0 TERM. A month with actual 0 and forecast 0 scores 0 in sMAPE. Stated actuals 0 and 100: forecasts 0 and 90 give sMAPE ${f6(Z0.smape)}; forecasts 5 and 90 give ${f6(Z1.smape)}. MAPE is null in both (the first actual is 0).`);
must('the matched zero term scores 0 and the unmatched 200', nearly(Z0.smape, (0 + 200 * 10 / 190) / 2, 1e-12) && nearly(Z1.smape, (200 + 200 * 10 / 190) / 2, 1e-12) && Z0.mape === null && Z1.mape === null, `${Z0.smape} ${Z1.smape}`);
w();
const LOWT = Y5.slice(36);
const L5 = success('fitSmoothing damped fitted on EKENE-P5 months 0 to 35, h 12', FC.fitSmoothing({ y: Y5.slice(0, 36), method: 'damped', h: 12 }));
const L5A = success('accuracy on EKENE-P5 months 36 to 47', FC.accuracy({ actual: LOWT, forecast: L5.forecast, insample: Y5.slice(0, 36) }));
const L5H = success('fitSmoothing holt fitted on EKENE-P5 months 0 to 35, h 12', FC.fitSmoothing({ y: Y5.slice(0, 36), method: 'holt', h: 12 }));
const L5HA = success('accuracy of holt on EKENE-P5 months 36 to 47', FC.accuracy({ actual: LOWT, forecast: L5H.forecast, insample: Y5.slice(0, 36) }));
w(`A LOW RATE TAIL. EKENE-P5, fitted on months 0 to 35 and scored on months 36 to 47, where the rate runs from ${f6(LOWT[0])} to ${f6(LOWT[LOWT.length - 1])} bbl/d:`);
w();
table(['method', 'MAE (bbl/d)', 'MAPE (percent)', 'sMAPE (percent)', 'MASE'], [['damped', L5A], ['holt', L5HA]].map(([m, a]) => [m, f6(a.mae), f6(a.mape), f6(a.smape), f6(a.mase)]));
w();
w(`A small error on a small rate is a large percentage: holt's MAE of ${f6(L5HA.mae)} bbl/d here is a MAPE of ${f6(L5HA.mape)} percent, while on EKENE-P1's hold-out holt's larger MAE of ${f6(ACC.holt.mae)} bbl/d is ${f6(ACC.holt.mape)} percent (${ref('errors')}). A percentage error puts wells of different size on one scale, and on a low tail it is large for errors small in bbl/d.`);
must('the low tail holt MAE is below the P1 holt MAE and its MAPE above', L5HA.mae < ACC.holt.mae && L5HA.mape > ACC.holt.mape, `${L5HA.mae} ${ACC.holt.mae}`);
w();
const ASYM_A = 100; // stated actual
const OVER = success('accuracy, a forecast 50 over', FC.accuracy({ actual: [ASYM_A], forecast: [ASYM_A + 50] }));
const UNDER = success('accuracy, a forecast 50 under', FC.accuracy({ actual: [ASYM_A], forecast: [ASYM_A - 50] }));
w(`sMAPE IS NOT SYMMETRIC IN THE ERROR. Stated actual ${ASYM_A}: a forecast of ${ASYM_A + 50} (50 high) scores sMAPE ${f6(OVER.smape)}, and a forecast of ${ASYM_A - 50} (50 low) scores ${f6(UNDER.smape)}; MAPE is ${f6(OVER.mape)} for both. The same size of error costs more when the forecast is low, because the forecast is in the denominator.`);
must('the low forecast costs more sMAPE and the same MAPE', UNDER.smape > OVER.smape && OVER.mape === UNDER.mape, `${OVER.smape} ${UNDER.smape}`);

/* ============================================================ SECTION 13 */

section('mase', 'The scaled error: MASE, its in-sample naive scale and its lag', ['Professional m03']);
w(`MASE is "${ACC.holt.basis.mase}". Q is the MAE the lag-m NAIVE forecast (each month forecast by the month m before) makes on the TRAINING series, in-sample; the forecast's errors are divided by it. MASE below 1 means the forecast's mean absolute error is smaller than that in-sample naive error; MASE has no unit, so wells of any size compare.`);
w();
const Qhand = absMean(Y1.slice(1, TRAIN).map((v, t) => v - Y1[t]));
must('the engine scale is the lag-1 naive MAE of the training months', nearly(ACC.holt.maseScale, Qhand, 1e-12), `${ACC.holt.maseScale} ${Qhand}`);
w(`On the teaching hold-out the scale is Q = ${f6(ACC.holt.maseScale)} bbl/d (\`maseScale\`): the mean of |y_t - y_(t-1)| over months 1 to ${TRAIN - 1} of the training series, ${TRAIN - 1} differences (checked to ${eX(CHECK_TOL)}). The three methods:`);
w();
table(['method', 'MAE (bbl/d)', 'MASE = MAE / Q'], Object.entries(ACC).map(([m, a]) => [m, f6(a.mae), f6(a.mase)]));
Object.entries(ACC).forEach(([m, a]) => must(`${m}: MASE is MAE over Q`, nearly(a.mase, a.mae / a.maseScale, 1e-12), m));
w();
w(`THE SCALE COMES FROM THE TRAINING SERIES, never from the actuals being scored. Scaled instead by the naive error of the hold-out months themselves (derived, a wrong method), holt would read ${f6(ACC.holt.mae / absMean(ACT.slice(1).map((v, j) => v - ACT[j])))}: the scale then depends on the months being forecast, and the figure is not MASE.`);
w();
const M12 = success('accuracy of holt with lag 12', FC.accuracy({ actual: ACT, forecast: HO.holt.forecast, insample: Y1.slice(0, TRAIN), m: 12 }));
w(`THE LAG. \`m\` is 1 by default, the month before. With m 12 (stated), the naive forecast is the same month a year before: Q = ${f6(M12.maseScale)} over ${TRAIN - 12} differences, and holt's MASE becomes ${f6(M12.mase)} against ${f6(ACC.holt.mase)} at m 1. A declining well has no season, and on a decline the year-old month is far from this month, so the lag-12 scale is larger and MASE smaller. The lag is part of the figure: quote MASE with its m.`);
must('the lag 12 scale is larger than the lag 1 scale', M12.maseScale > ACC.holt.maseScale, `${M12.maseScale} ${ACC.holt.maseScale}`);
w();
w(`A FLAT TRAINING WINDOW. EKENE-P3's first ${WSPEC['EKENE-P3'].plateau} months are the plateau, exactly ${f6(WSPEC['EKENE-P3'].plateauRate)} each. As a training series every difference is 0, so Q = 0 and MASE would divide by zero; the engine returns null and says so: "${accFlat.notes.mase}". A training series of m values or fewer has no naive difference at all: "${accShort.notes.mase}".`);

/* ============================================================ SECTION 14 */

section('backtest', 'Rolling-origin backtests: origins, horizon, step, refit and held parameters', ['Professional m04']);
const B1 = success(`backtest holt EKENE-P1 firstOrigin ${BT.firstOrigin} horizon ${BT.horizon} step ${BT.step}`, FC.backtest({ y: Y1, method: 'holt', ...BT }));
w(`A single hold-out scores one forecast from one month. A ROLLING-ORIGIN backtest repeats it from several ORIGINS: at origin o the method is fitted on months 0 to o - 1 only (an EXPANDING window) and forecasts months o to o + horizon - 1, which it then is scored on. The basis reads: "${B1.basis.origins}".`);
w();
w(`EKENE-P1, holt, first origin ${BT.firstOrigin}, horizon ${BT.horizon}, step ${BT.step} (stated): origins ${list(B1.origins)}. The last origin is the largest o with o + ${BT.horizon} <= ${Y1.length}, so every origin has all ${BT.horizon} actuals.`);
must('origins run from firstOrigin by step while o + horizon <= n', B1.origins.join() === [24, 30, 36, 42].join() && B1.origins.every((o) => o + BT.horizon <= Y1.length), B1.origins);
w();
table(['origin', 'training months', 'alpha', 'beta', ...Array.from({ length: BT.horizon }, (_, j) => `error step ${j + 1}`), 'scale Q of the training months'], B1.perOrigin.map((r) => [S(r.origin), `0 to ${r.origin - 1}`, f6(r.params.alpha), f6(r.params.beta), ...r.errors.map(f6), f6(r.maseScale)]));
w();
w(`REFITTING AT EVERY ORIGIN. With \`refit\` true (the default) the free parameters are re-estimated on each window; the basis reads: "${B1.basis.refit}". alpha and beta move from origin to origin above, because each window is a different series.`);
must('refit moves the parameters between origins', new Set(B1.perOrigin.map((r) => r.params.alpha)).size === B1.origins.length, 'moved');
w();
const B1H = success('backtest holt EKENE-P1 refit false', FC.backtest({ y: Y1, method: 'holt', ...BT, refit: false }));
must('refit false holds the first window parameters', B1H.perOrigin.every((r) => r.params.alpha === B1.perOrigin[0].params.alpha && r.params.beta === B1.perOrigin[0].params.beta), 'held');
must('the first origin of refit false is the first origin of refit true', B1H.perOrigin[0].errors.every((e, j) => e === B1.perOrigin[0].errors[j]), 'same');
w(`PARAMETERS HELD FROM THE FIRST WINDOW. With \`refit\` false the parameters are estimated once, on the first window, and held; the basis reads: "${B1H.basis.refit}". Every origin then carries alpha ${f6(B1H.perOrigin[0].params.alpha)} and beta ${f6(B1H.perOrigin[0].params.beta)}; the first origin's errors are the same as with refit, and later origins differ.`);
w();
table(['refit', 'ME', 'MAE', 'RMSE', 'MASE'], [['true', B1], ['false', B1H]].map(([k, b]) => [k, f6(b.overall.me), f6(b.overall.mae), f6(b.overall.rmse), f6(b.overall.mase)]));
w();
w('Held parameters are cheaper and test one parameter set on later data; refitting tests the whole procedure as it would be run each month. Either is honest, because at every origin only months before the origin were used. Say which was run.');
w();
const bExact = success('backtest ses, the last origin exact', FC.backtest({ y: Y1, method: 'ses', alpha: A_SES, firstOrigin: 42, horizon: 6 }));
must('an origin with o + H = n is the last one', bExact.origins.join() === '42', bExact.origins);
w(`THE LAST ORIGIN. Origin ${bExact.origins[0]} with horizon 6 on ${Y1.length} months is accepted (${bExact.origins[0]} + 6 = ${Y1.length}); origin 43 is refused (${ref('refusals')}).`);

/* ============================================================ SECTION 15 */

section('leakage', 'Leakage: scoring months the fit has already seen', ['Professional m04 l05', 'Professional m01 l05']);
w(`LEAKAGE is any route by which the months being scored reach the fit. A backtest has none by construction: at every origin only months 0 to o - 1 are fitted. Two leaky routes a learner can take, each run through the engine on EKENE-P1, against the honest one-step backtest from origin ${TRAIN} (horizon 1, step 1, holt refitted):`);
w();
const LB = success(`backtest holt EKENE-P1 firstOrigin ${TRAIN} horizon 1 step 1`, FC.backtest({ y: Y1, method: 'holt', firstOrigin: TRAIN, horizon: 1, step: 1 }));
const FULL = success('fitSmoothing holt fitted on all 48 months', FC.fitSmoothing({ y: Y1, method: 'holt' }));
const leakInSample = absMean(FULL.residuals.slice(TRAIN));
const LBP = success(`backtest holt EKENE-P1 with the full-series parameters held`, FC.backtest({ y: Y1, method: 'holt', firstOrigin: TRAIN, horizon: 1, step: 1, alpha: FULL.params.alpha, beta: FULL.params.beta }));
const FULLH = success('fitSmoothing holt on all 48 months, the hold-out months included, h 12', FC.fitSmoothing({ y: Y1, method: 'holt', h: H }));
const leakGap = LB.overall.mae - leakInSample;
must('parameters fitted on the full series and held give exactly the full fit residuals', LBP.perOrigin.every((r) => r.errors[0] === FULL.residuals[r.origin]), 'identical');
const LEAK = [
  ['honest: backtest, one step ahead, refitted at each origin', f6(LB.overall.mae), 'none'],
  ['fitted on all 48 months, scored on its own one-step residuals for months 36 to 47 (derived from residuals)', f6(leakInSample), 'the months scored chose the parameters and fed the state'],
  ['parameters fitted on all 48 months, then held in a backtest from origin 36', f6(LBP.overall.mae), 'the months scored chose the parameters'],
];
table(['route', `MAE on months ${TRAIN} to ${Y1.length - 1}, one step ahead`, 'what leaked'], LEAK);
w();
w(`The two leaky routes are the same numbers: holding parameters fitted on the whole series and stepping forward one month at a time replays the full fit's own one-step forecasts, error for error (checked exactly). Here the leaky MAE differs from the honest one by ${f6(leakGap)} bbl/d (derived). On one well the size and sign of that difference are no test; the rule is procedural: the months scored must never reach the fit, whatever the number looks like.`);
w();
w(`RANDOM MONTHS. Choosing test months at random and fitting on the rest leaks the future into the past: the months around a test month, before and after it, are in the fit. The engine offers no random split; a smoothing method needs an unbroken series, and its only honest test is an origin with everything after it held back. The machine learning course's well-by-well split is the answer for rows that are not a time series.`);
w();
w(`FITTING ON THE TEST WINDOW. A 12-step forecast is only a forecast of months 36 to 47 if it was made from month 35. Fitting on all ${Y1.length} months and then forecasting 12 steps forecasts months ${Y1.length} to ${Y1.length + H - 1}: holt from the full series gives ${f6(FULLH.forecast[0])} at step 1, a forecast for month ${Y1.length}, and cannot be scored against any month of the series.`);

/* ============================================================ SECTION 16 */

section('pooling', 'Pooling backtest errors: overall, by horizon, and each origin its own scale', ['Professional m05']);
w(`The overall metrics of a backtest average over every origin and every step; the basis reads: "${B1.basis.pooling}". The teaching backtest, ${B1.origins.length} origins x ${BT.horizon} steps = ${B1.origins.length * BT.horizon} errors (derived):`);
w();
table(['metric', 'overall'], [['ME', f6(B1.overall.me)], ['MAE', f6(B1.overall.mae)], ['RMSE', f6(B1.overall.rmse)], ['MAPE', f6(B1.overall.mape)], ['sMAPE', f6(B1.overall.smape)], ['MASE', f6(B1.overall.mase)]]);
must('overall n is origins x horizon', B1.overall.n === B1.origins.length * BT.horizon, B1.overall.n);
const allErr = B1.perOrigin.flatMap((r) => r.errors);
must('overall MAE is the mean absolute error over every origin and step', nearly(B1.overall.mae, absMean(allErr), 1e-12), B1.overall.mae);
w();
w(`ERRORS BY HORIZON. \`byHorizon\` scores step 1 of every origin together, step 2 together, and so on:`);
w();
table(['step ahead', 'errors', 'ME', 'MAE', 'RMSE', 'MASE'], B1.byHorizon.map((h) => [S(h.step), S(h.n), f6(h.me), f6(h.mae), f6(h.rmse), f6(h.mase)]));
const firstLast = [B1.byHorizon[0].mae, B1.byHorizon[BT.horizon - 1].mae];
must('the step 6 MAE is above the step 1 MAE', firstLast[1] > firstLast[0], firstLast);
w();
w(`Each step here has ${B1.byHorizon[0].n} errors, one per origin, so each figure rests on few numbers. The step ${BT.horizon} MAE is above the step 1 MAE on this well, and the steps between do not rise in order; with ${B1.origins.length} origins a by-horizon figure is a small sample.`);
w();
const QS = B1.perOrigin.map((r) => r.maseScale);
w(`EACH ORIGIN ITS OWN SCALE. MASE divides each error by the Q of its own origin's training window: ${B1.perOrigin.map((r) => `origin ${r.origin} Q ${f6(r.maseScale)}`).join(', ')}. The scales fall from origin to origin.`);
w();
must('the scales fall from origin to origin', QS.every((q, i) => i === 0 || q < QS[i - 1]), QS.join(','));
const pooledHand = mean(B1.perOrigin.flatMap((r) => r.errors.map((e) => Math.abs(e) / r.maseScale)));
must('overall MASE is the mean of each error over its own origin scale', nearly(B1.overall.mase, pooledHand, 1e-12), `${B1.overall.mase} ${pooledHand}`);
const oneQ = absMean(allErr) / QS[QS.length - 1];
w(`Dividing every error by the last origin's scale instead (derived, a wrong method) gives ${f6(oneQ)} against the engine's ${f6(B1.overall.mase)}.`);
w();
const B3 = success('backtest damped EKENE-P3 firstOrigin 6 horizon 6 step 6', FC.backtest({ y: Y3, method: 'damped', firstOrigin: 6, horizon: 6, step: 6 }));
planted(3, B3.overall.mase === null && B3.perOrigin[0].maseScale === null && B3.perOrigin.slice(1).every((r) => r.maseScale > 0), B3.overall.notes && B3.overall.notes.mase);
w(`ONE ORIGIN CAN LEAVE A METRIC UNDEFINED. EKENE-P3, damped, first origin 6, horizon 6, step 6 (stated): origins ${list(B3.origins)}. Origin 6 trains on months 0 to 5, all inside the plateau, so its Q is 0 (\`maseScale\` null); the other origins have scales ${list(B3.perOrigin.slice(1).map((r) => f6(r.maseScale)))}. One null scale leaves the overall MASE and every by-horizon MASE null, with the reason: "${B3.overall.notes.mase}". The other metrics are numbers: MAE ${f6(B3.overall.mae)}, sMAPE ${f6(B3.overall.smape)}.`);
w();
must('every by-horizon MASE is null too', B3.byHorizon.every((h) => h.mase === null), 'null');
const B3b = success('backtest damped EKENE-P3 firstOrigin 12', FC.backtest({ y: Y3, method: 'damped', firstOrigin: 12, horizon: 6, step: 6 }));
w(`Starting at origin 12 instead, past the plateau (stated), every origin has a scale and the overall MASE is ${f6(B3b.overall.mase)}. Choosing the origins is part of the test; state them.`);

/* ============================================================ SECTION 17 */

section('comparing', 'Methods compared on one well, and a workover that changes the winner', ['Professional m06', 'Expert m04 l01']);
const PRE = { firstOrigin: 10, horizon: 3, step: 3 };
const POST = { firstOrigin: 28, horizon: 6, step: 3 };
const CPRE = success('compareWithArps on EKENE-P2 months 0 to 21', FC.compareWithArps({ y: Y2.slice(0, 22), ...PRE }));
const CPOST = success('compareWithArps on EKENE-P2 from origin 28', FC.compareWithArps({ y: Y2, ...POST }));
w(`\`compareWithArps\` backtests ses, holt and damped and the Arps baseline on the same origins with the same metrics, and ranks them by MASE unless told otherwise (the Expert tier takes the ranking rules apart). The Professional question is the testing workflow: the same origins, the same horizon, the same metric, for every method. EKENE-P2 before and after its shut-in and workover:`);
w();
const cmpRows = (c, lab) => c.rows.map((r) => [lab, r.method, f6(r.mae), f6(r.rmse), f6(r.mape), f6(r.smape), f6(r.mase)]);
table(['window', 'method', 'MAE', 'RMSE', 'MAPE', 'sMAPE', 'MASE'], [...cmpRows(CPRE, `months 0 to 21, origins ${list(CPRE.origins)}, horizon ${PRE.horizon}`), ...cmpRows(CPOST, `all 48 months, origins ${list(CPOST.origins)}, horizon ${POST.horizon}`)]);
w();
must('before the shut-in arps ranks first', CPRE.best === 'arps', CPRE.ranking);
must('after the workover a smoothing method ranks first and arps is not first', CPOST.best !== 'arps' && CPOST.ranking.indexOf('arps') > 0, CPOST.ranking);
w(`Before the shut-in the ranking by MASE is ${CPRE.ranking.join(', ')}: arps first. After the workover it is ${CPOST.ranking.join(', ')}, with arps ${['first', 'second', 'third', 'fourth'][CPOST.ranking.indexOf('arps')]}. The Arps fit is a regression on every positive month of each training window, the months before the uplift included, and its mean error after the workover is ${f6(CPOST.rows.find((r) => r.method === 'arps').me)} bbl/d against holt's ${f6(CPOST.rows.find((r) => r.method === 'holt').me)}.`);
const POSTS = [26, 28, 30, 32].map((fo) => [fo, success(`compareWithArps EKENE-P2 from origin ${fo}`, FC.compareWithArps({ y: Y2, firstOrigin: fo, horizon: POST.horizon, step: POST.step }))]);
planted(2, POSTS.every(([, c]) => c.best !== 'arps'), POSTS.map(([fo, c]) => `${fo}:${c.best}`).join(' '));
w();
w(`THE WINNER DEPENDS ON THE ORIGINS. The same comparison from four first origins after the restart (stated, horizon ${POST.horizon}, step ${POST.step}):`);
w();
table(['first origin', 'origins', 'ranking by MASE', 'best MASE', 'arps MASE'], POSTS.map(([fo, c]) => [S(fo), list(c.origins), c.ranking.join(', '), f6(c.rows.find((r) => r.method === c.best).mase), f6(c.rows.find((r) => r.method === 'arps').mase)]));
w();
w('A smoothing method ranks first from every one of the four, and which smoothing method it is changes with the origins. Report a ranking with its origins, horizon, step and metric.');
w();
const C1 = success('compareWithArps EKENE-P1', FC.compareWithArps({ y: Y1, firstOrigin: 30, horizon: 6, step: 3 }));
planted(0, C1.best === 'arps', C1.ranking);
w(`ON A CLEAN DECLINE, EKENE-P1, first origin 30, horizon 6, step 3 (stated), the ranking is ${C1.ranking.join(', ')}, arps MASE ${f6(C1.rows.find((r) => r.method === 'arps').mase)}. EKENE-P1 was drawn from an Arps curve (stated), and on it the Arps baseline ranks first.`);
w();
w('WRITING UP A BACKTEST names: the well and months; the methods; first origin, horizon, step and so the origins; refit or held; each metric with its reason when null; MASE with its lag m; the ranking and the metric it is by.');

/* ============================================================ SECTION 18 */

section('bootstrap', 'The residual bootstrap: paths, one seeded stream, the state update and the pool', ['Expert m01']);
const PID = success(`forecastIntervals damped EKENE-P1 h ${H} seed ${SEED_PI}`, FC.forecastIntervals({ y: Y1, method: 'damped', h: H, seed: SEED_PI }));
w(`\`forecastIntervals\` fits the method as \`fitSmoothing\` does, then simulates ${S(PID.nSims)} future paths (\`nSims\`, default ${FC.DEFAULTS.N_SIMS}). The basis reads: "${PID.basis.bootstrap}".`);
w();
w(`EKENE-P1, damped, fitted (alpha ${f6(PID.params.alpha)}, beta ${f6(PID.params.beta)}, phi ${f6(PID.params.phi)}), h ${H}, seed ${SEED_PI} (stated):`);
w();
table(['step', 'point forecast', 'P90 (low)', 'P50', 'P10 (high)'], PID.forecast.map((f, j) => [S(j + 1), f6(f), f6(PID.P90[j]), f6(PID.P50[j]), f6(PID.P10[j])]));
must('the point forecast is the fitSmoothing forecast', PID.forecast.every((v, j) => v === DFIT['EKENE-P1'].forecast[j]), 'same');
must('P90 <= P50 <= P10 at every step', PID.P90.every((v, j) => v <= PID.P50[j] && PID.P50[j] <= PID.P10[j]), 'ordered');
w();
w(`The point forecast is exactly \`fitSmoothing\`'s. Each path starts from the fitted final level and trend; at each step it takes the one-step forecast, adds one residual drawn at random from the fitted residuals, and that simulated rate UPDATES THE STATE (level and trend) before the next step, so an early draw carries into every later step of its path.`);
w();
w(`THE POOL is the scored in-sample residuals: \`poolSize\` ${PID.poolSize}, the ${Y1.length} months less the ${Y1.length - PID.poolSize} before \`scoredFrom\`. At least 2 are needed; EKENE-P6 with holt leaves 1 and is refused (${ref('refusals')}).`);
must('the pool is n - scoredFrom', PID.poolSize === Y1.length - DFIT['EKENE-P1'].scoredFrom, PID.poolSize);
w();
const PIDs = success('forecastIntervals, the same call again', FC.forecastIntervals({ y: Y1, method: 'damped', h: H, seed: SEED_PI }));
const PIDn = success(`forecastIntervals, seed ${SEED_PI + 1}`, FC.forecastIntervals({ y: Y1, method: 'damped', h: H, seed: SEED_PI + 1 }));
must('the same seed gives the same percentiles', JSON.stringify(PIDs.P50) === JSON.stringify(PID.P50) && JSON.stringify(PIDs.P90) === JSON.stringify(PID.P90), 'same');
must('the next seed moves the percentiles', PIDn.P50[H - 1] !== PID.P50[H - 1], 'moved');
w(`ONE SEEDED STREAM. Every draw comes from one mulberry32(seed) stream, path by path and step by step. The same call returns the same percentiles bit for bit; seed ${SEED_PI + 1} (stated) gives P50 ${f6(PIDn.P50[H - 1])} at step ${H} against ${f6(PID.P50[H - 1])}. A bootstrap figure is quoted with its seed and nSims.`);
w();
const NS = [100, 1000, 10000].map((n) => [n, success(`forecastIntervals nSims ${n}`, FC.forecastIntervals({ y: Y1, method: 'damped', h: H, seed: SEED_PI, nSims: n }))]);
w(`MORE PATHS, the same seed (nSims stated):`);
w();
table(['nSims', `P90 step ${H}`, `P50 step ${H}`, `P10 step ${H}`], NS.map(([n, r]) => [S(n), f6(r.P90[H - 1]), f6(r.P50[H - 1]), f6(r.P10[H - 1])]));
w();
w('More paths steady the percentiles; they do not make the method right.');
w();
const resMean = mean(DFIT['EKENE-P1'].residuals.slice(DFIT['EKENE-P1'].scoredFrom));
const PIS = success(`forecastIntervals ses EKENE-P1 h ${H} seed ${SEED_PI}`, FC.forecastIntervals({ y: Y1, method: 'ses', h: H, seed: SEED_PI }));
const sesRes = SESF['EKENE-P1'].residuals.slice(1);
const PISu = success(`forecastIntervals ses EKENE-P1 unclipped`, FC.forecastIntervals({ y: Y1, method: 'ses', h: H, seed: SEED_PI, nonNegative: false }));
must('ses on EKENE-P1: the point forecast is above the P10 at step 12', PIS.forecast[H - 1] > PIS.P10[H - 1], `${PIS.forecast[H - 1]} ${PIS.P10[H - 1]}`);
must('the ses residual mean is negative', mean(sesRes) < 0, mean(sesRes));
w(`A MEDIAN AWAY FROM THE POINT FORECAST. The residuals are drawn as they are, never centred on 0 (their mean over the damped pool here is ${f6(resMean)} bbl/d, derived). When the residuals lean one way, every path leans with them and the state carries the lean forward. ses on EKENE-P1 shows it plainly: alpha fits to 1, so each residual is a month-to-month change of the decline, mean ${f6(mean(sesRes))} bbl/d (derived). The P50 of the paths falls while the point forecast stays flat:`);
w();
table(['step', 'ses point forecast', 'P90 (low), unclipped', 'P50, unclipped', 'P10 (high), unclipped'], [0, 5, H - 1].map((j) => [S(j + 1), f6(PIS.forecast[j]), f6(PISu.P90[j]), f6(PISu.P50[j]), f6(PISu.P10[j])]));
w();
w(`The unclipped P50 falls by ${f6((PIS.forecast[H - 1] - PISu.P50[H - 1]) / H)} bbl/d a step on average over the ${H} steps (derived, (point forecast less P50 at step ${H}) / ${H}). At step ${H} the flat point forecast ${f6(PIS.forecast[H - 1])} lies above even the P10 (high) of the paths, ${f6(PISu.P10[H - 1])}. Neither number is wrong: the point forecast is the method's, and the paths are the method's residuals replayed. A point forecast outside its own interval says the residuals lean one way.`);

/* ============================================================ SECTION 19 */

section('percentiles', 'Percentiles and their labels: the quantile rule, the low case and zeros', ['Expert m02']);
w(`The basis reads: "${PID.basis.percentiles}".`);
w();
w(`THE QUANTILE RULE, shown with lib/stats quantile (the function the engine calls) on stated sorted values 1, 2, ..., n:`);
w();
const QN = [10, 9, 1000, 999];
const qrow = (n) => { const v = Array.from({ length: n }, (_, i) => i + 1); return ST.quantile(v, [0.1, 0.5, 0.9]); };
table(['n (stated)', 'idx = n x 0.1', '10th percentile', '50th percentile', '90th percentile'], QN.map((n) => [S(n), f6(n * 0.1), ...qrow(n).map(f6)]));
must('n 10: 10th percentile is the mean of the 1st and 2nd', qrow(10)[0] === 1.5, qrow(10)[0]);
must('n 9: idx 0.9 not whole takes the 1st smallest', qrow(9)[0] === 1, qrow(9)[0]);
must('n 1000: the mean of the 100th and 101st', qrow(1000)[0] === 100.5, qrow(1000)[0]);
must('n 999: idx 99.9 takes the 100th', qrow(999)[0] === 100, qrow(999)[0]);
w();
w(`With n 10 the 10th percentile is the mean of the 1st and 2nd smallest (idx 1 whole, n even); with n 9, idx 0.9 is not whole, so it is the 1st smallest; with n 1000 it is the mean of the 100th and 101st; with n 999 the 100th. The default nSims is ${FC.DEFAULTS.N_SIMS}, an even count, so every default percentile is the mean of two simulated values.`);
w();
w(`THE LABELS. Production is an outcome where more is better, and the platform labels outcomes by exceedance: "${PID.definition}" So P90 is the LOW case, the 10th percentile of the simulated paths, and P10 the HIGH case, the 90th percentile. Keys \`${PCT.OUTCOME_LABELS.p90}\`, \`${PCT.OUTCOME_LABELS.p50}\` and \`${PCT.OUTCOME_LABELS.p10}\` carry those values, and P90 <= P50 <= P10 at every step (checked in ${ref('bootstrap')}).`);
must('the definition is the platform sentence', PID.definition === PCT.EXCEEDANCE_DEFINITION, PID.definition);
w();
const PIH5 = success(`forecastIntervals holt EKENE-P5 h ${H} seed ${SEED_PI}`, FC.forecastIntervals({ y: Y5, method: 'holt', h: H, seed: SEED_PI }));
const PIH5u = success(`forecastIntervals holt EKENE-P5 unclipped`, FC.forecastIntervals({ y: Y5, method: 'holt', h: H, seed: SEED_PI, nonNegative: false }));
planted(5, PIH5.clippedToZero > 0 && firstNeg > 0, PIH5.clippedToZero);
w(`NEGATIVE RATES REPORTED AS ZERO. With \`nonNegative\` true (the default) a percentile below 0 is reported as 0 and counted in \`clippedToZero\`; the basis reads: "${PIH5.basis.nonNegative}". EKENE-P5, holt, h ${H}, seed ${SEED_PI}: ${PIH5.clippedToZero} of the ${3 * H} percentiles (derived, 3 per step x ${H} steps) are reported as 0. The last three steps, both ways:`);
w();
table(['step', 'P90, nonNegative true', 'P90, nonNegative false', 'P50, nonNegative true', 'P50, nonNegative false'], [H - 3, H - 2, H - 1].map((j) => [S(j + 1), f6(PIH5.P90[j]), f6(PIH5u.P90[j]), f6(PIH5.P50[j]), f6(PIH5u.P50[j])]));
must('clipping touches only the negative percentiles', ['P90', 'P50', 'P10'].every((k) => PIH5[k].every((v, j) => v === Math.max(0, PIH5u[k][j]))), 'clip');
w();
w(`Only the negative percentiles change; the point forecast is never clipped. A P90 reported as 0 says that at least a tenth of the paths fell below zero at that step: the method's paths ran out of rate there.`);
w();
const WID = PID.P10.map((v, j) => v - PID.P90[j]);
w(`INTERVALS WIDEN WITH EVERY STEP. The P10 less the P90 of the damped EKENE-P1 intervals (derived): step 1 ${f6(WID[0])}, step 6 ${f6(WID[5])}, step ${H} ${f6(WID[H - 1])} bbl/d; each path carries all its earlier draws.`);
must('the width at step 12 is above the width at step 1', WID[H - 1] > WID[0], WID.join(','));

/* ============================================================ SECTION 20 */

section('arps', 'The Arps baseline from the decline curve engine: a month passed as a day, zeros dropped', ['Expert m03']);
const AR1 = success('arpsForecast EKENE-P1 h 12', FC.arpsForecast({ y: Y1, h: H }));
w(`\`arpsForecast\` calls engines/dca/arps.js fitArpsModel and calculateArpsHyperbolic; nothing about Arps is re-implemented here, and the decline curve analysis course teaches the equations. The basis reads: "${AR1.basis.engine}".`);
w();
const AR = Object.fromEntries(WELLS.filter((x) => x.rate.length === T.N_MONTHS).map((x) => [x.well, success(`arpsForecast ${x.well}`, FC.arpsForecast({ y: x.rate, h: H }))]));
table(['well', 'model chosen', 'qi (bbl/d)', 'Di (per month)', 'b', 'R2', 'RMSE (bbl/d)', 'months used', 'months dropped', `forecast step ${H}`], Object.entries(AR).map(([id, a]) => [id, a.modelType, f6(a.qi), f6(a.Di), f6(a.b), f6(a.R2), f6(a.RMSE), S(a.nUsed), S(a.dropped), f6(a.forecast[H - 1])]));
w();
w(`A MONTH PASSED AS A DAY. fitArpsModel reads dated rates and measures time in days. The engine passes month k as day k, so qi is per month-step and Di is per month; the basis reads: "${AR1.basis.time}". EKENE-P1's Di ${f6(AR1.Di)} is per month (the generator stated ${S(WSPEC['EKENE-P1'].Di)} per month and b ${S(WSPEC['EKENE-P1'].b)}). Quoted per day, per year or as an effective decline it is a different number; this course quotes it per month.`);
must('the EKENE-P1 Arps fit is hyperbolic', AR1.modelType === 'Hyperbolic', AR1.modelType);
w();
w(`PRINTED ALIKE. EKENE-P1's b prints ${f6(AR1.b)} and is ${S(AR1.b)} as returned: fitArpsModel's b grid accumulates steps of 0.05 in floating point, so a grid value is not the decimal it prints as. It differs from ${f6(AR1.b)} by ${eX(Math.abs(AR1.b - Number(f6(AR1.b))))}.`);
must('the P1 b differs from its printed value', AR1.b !== Number(f6(AR1.b)), AR1.b);
w();
const AR2 = AR['EKENE-P2'];
planted(1, P2A.mape === null && AR2.dropped === 3 && AR2.nUsed === Y2.length - 3, AR2.dropped);
w(`SHUT-IN MONTHS DROPPED. fitArpsModel drops zero and negative rates before fitting; the basis reads: "${AR2.basis.dropped}". EKENE-P2 uses ${AR2.nUsed} of its ${Y2.length} months: the ${AR2.dropped} shut-in months are dropped, and the months after them keep their own time index, so the gap stays in the time axis.`);
w();
const LEAD = [0, 0, ...Y1.slice(0, 20)]; // stated: two months of zeros before first production
const ARL = success('arpsForecast with two leading zeros', FC.arpsForecast({ y: LEAD, h: 3 }));
w(`t = 0 IS THE FIRST POSITIVE MONTH. The same well with two months of 0 put in front (stated): \`t0Index\` ${ARL.t0Index}, ${ARL.dropped} months dropped, \`fitted\` null before index ${ARL.t0Index}, and the basis reads: "${ARL.basis.time}".`);
must('leading zeros move t0', ARL.t0Index === 2 && ARL.fitted[0] === null && ARL.fitted[1] === null, ARL.t0Index);
w();
const REQ = ['Exponential', 'Harmonic', 'Hyperbolic'].map((mt) => [mt, success(`arpsForecast EKENE-P1 ${mt}`, FC.arpsForecast({ y: Y1, h: H, modelType: mt }))]);
w(`A MODEL ASKED FOR BY NAME. \`modelType\` 'Auto-Select' (the default) takes the lowest RMSE; naming a model fits that one alone. EKENE-P1:`);
w();
table(['requested', 'model returned', 'qi', 'Di (per month)', 'b', 'RMSE'], [['Auto-Select', AR1], ...REQ].map(([mt, a]) => [mt, a.modelType, f6(a.qi), f6(a.Di), f6(a.b), f6(a.RMSE)]));
must('auto-select has the lowest RMSE of the three', REQ.every(([, a]) => AR1.RMSE <= a.RMSE), 'lowest');
w();
const RIS = REF_OUT.find((r) => r[0] === 'arpsForecast' && r[1].startsWith('a rising'));
w(`WHEN ARPS FINDS NO FIT. A rising series has no decline. fitArpsModel then finds no fit with finite qi > 0 and Di > 0, and the engine refuses, verbatim:`);
w();
w(`> ${RIS[3]}`);
w();
w(`In a comparison the same condition leaves the arps row without numbers (${ref('ranking')}); the smoothing methods are still scored.`);

/* ============================================================ SECTION 21 */

section('ranking', 'Ranking methods against Arps: the same origins, the metric, ties and unranked rows', ['Expert m04']);
w(`The basis of every comparison reads, for its origins: "${CPOST.basis.origins}"; for Arps: "${CPOST.basis.arps}"; and for the ranking: "${CPOST.basis.ranking}".`);
w();
must('every row of a comparison has the same origins', CPOST.rows.every((r) => r.origins.join() === CPOST.origins.join()), 'same');
const BTH = success('backtest holt with the comparison\'s origins', FC.backtest({ y: Y2, method: 'holt', ...POST }));
must('the comparison holt row is the backtest holt overall', CPOST.rows.find((r) => r.method === 'holt').mase === BTH.overall.mase, 'same');
w(`THE SAME ORIGINS FOR EVERY METHOD. In the EKENE-P2 comparison from origin ${POST.firstOrigin} every row carries origins ${list(CPOST.origins)}, and the holt row's MASE ${f6(BTH.overall.mase)} is exactly \`backtest\`'s on the same origins. Arps is refitted on every window whatever \`refit\` says.`);
w();
const byMetric = ['mae', 'rmse', 'smape', 'mase'].map((k) => [k, success(`compareWithArps EKENE-P2 rankBy ${k}`, FC.compareWithArps({ y: Y2, ...POST, rankBy: k }))]);
w(`RANKING BY THE CHOSEN METRIC, the same comparison (lowest first):`);
w();
table(['rankBy', 'ranking', 'best'], byMetric.map(([k, c]) => [k, c.ranking.join(', '), c.best]));
w();
const CM = success('compareWithArps EKENE-P2 from origin 12, rankBy mape', FC.compareWithArps({ y: Y2, firstOrigin: 12, horizon: 6, step: 3, rankBy: 'mape' }));
must('with the shut-in in the actuals every mape is null and nothing is ranked', CM.ranking.length === 0 && CM.best === null && CM.unranked.length === 4, CM.unranked);
w(`UNRANKED METHODS. A method whose metric is null is left out of the ranking and listed in \`unranked\`. EKENE-P2 from origin 12, horizon 6, step 3, ranked by MAPE (stated): the shut-in months are in the actuals of some origins, so every method's MAPE is null; \`ranking\` is empty, \`best\` is ${S(CM.best)}, and \`unranked\` is ${list(CM.unranked)}. Ranked by MASE instead, the same call ranks all four. Ranking by MAPE ranks nothing once a shut-in month is in the actuals of every method's origins.`);
must('the same call by mase ranks all four', FC.compareWithArps({ y: Y2, firstOrigin: 12, horizon: 6, step: 3 }).ranking.length === 4, 'four');
w();
const NOARPS = [900, 880, 0, 0, 0, 0, 0, 0, 870, 860, 850, 845]; // stated: a well shut in from month 2 to 7
const CNA = success('compareWithArps with too few positive training months at the first origin', FC.compareWithArps({ y: NOARPS, firstOrigin: 6, horizon: 2, step: 2 }));
const naRow = CNA.rows.find((r) => r.method === 'arps');
must('the arps row carries an error and null metrics and is unranked', typeof naRow.error === 'string' && naRow.mase === null && CNA.unranked.includes('arps'), naRow.error);
w(`AN ARPS ROW WITH NO FIT. A stated series, ${list(NOARPS.map(S))}, first origin 6, horizon 2, step 2: the training window at origin 6 has two positive months, and the arps row carries no metrics, the error "${naRow.error}", and is unranked. The smoothing methods are ranked: ${CNA.ranking.join(', ')}.`);
w();
const gT = golden('cmp-constant-ties');
const CT = success('golden cmp-constant-ties', FC.compareWithArps(clone(gT.args)));
must('the constant series ties every smoothing method at MAE 0 and keeps the listed order', CT.ranking.join() === gT.args.methods.join() && CT.rows.filter((r) => r.method !== 'arps').every((r) => r.mae === 0), CT.ranking);
w(`TIES AND THE LISTED ORDER. Values within ${eX(FC.DEFAULTS.RANK_TIE_REL)} of each other, relative, keep the order the methods were listed in, arps last. Golden \`cmp-constant-ties\`: a constant ${S(gT.args.y[0])} for ${gT.args.y.length} months, methods listed ${list(gT.args.methods)}, ranked by ${gT.args.rankBy}. Every smoothing method forecasts the constant exactly (MAE ${S(CT.rows[0].mae)}), so the ranking is the listed order, ${CT.ranking.join(', ')}; Arps cannot fit a flat series and is unranked (${list(CT.unranked)}).`);
w();
const CR = success('compareWithArps EKENE-P1 listed in reverse', FC.compareWithArps({ y: Y1, firstOrigin: 30, horizon: 6, step: 3, methods: ['damped', 'holt', 'ses'] }));
must('listing order does not change a ranking without ties', CR.ranking.join() === C1.ranking.join(), `${CR.ranking} ${C1.ranking}`);
w(`Without a tie the order listed changes nothing: EKENE-P1 with the methods listed damped, holt, ses ranks ${CR.ranking.join(', ')}, as in ${ref('comparing')}.`);
w();
w(`A BASELINE THAT WINS. On EKENE-P1 arps ranks first (${ref('comparing')}). A smoothing method that cannot beat the Arps baseline on a well has not earned its place on that well; say so in the forecast note.`);

/* ============================================================ SECTION 22 */

section('boundaries', 'Boundaries, rule by rule, and the caps', ['Expert m05 l01', 'Expert m05 l03', 'Expert m05 l04']);
w('A boundary is where a rule changes its answer. Every rule has its own, and each row below is a pair of real calls, one either side (or on the boundary and past it). "Accepted" means a result came back; "refused" means an error naming the field.');
w();
const ok = (label, r) => !!(r && !r.error);
const no = (r) => !!(r && r.error);
const B = [];
const brow = (fn, rule, acc, rej, cond, label) => { must(`BOUNDARY ${label}`, cond, label); B.push([`\`${fn}\``, rule, acc, rej]); };
const y4 = Y1.slice(0, 4);
brow('fitSmoothing', 'ses length', '2 values fitted', '1 refused', ok('', FC.fitSmoothing({ y: Y1.slice(0, 2), method: 'ses' })) && no(FC.fitSmoothing({ y: Y1.slice(0, 1), method: 'ses' })), 'ses length');
brow('fitSmoothing', 'holt and damped length', '3 values fitted', '2 refused', ok('', FC.fitSmoothing({ y: Y1.slice(0, 3), method: 'holt' })) && ok('', FC.fitSmoothing({ y: Y1.slice(0, 3), method: 'damped' })) && no(FC.fitSmoothing({ y: Y1.slice(0, 2), method: 'damped' })), 'holt length');
brow('fitSmoothing', 'holt and damped with an initialTrend', '2 values fitted', '1 refused', ok('', FC.fitSmoothing({ y: Y1.slice(0, 2), method: 'holt', initialTrend: -20 })) && no(FC.fitSmoothing({ y: Y1.slice(0, 1), method: 'holt', initialTrend: -20 })), 'trend length');
brow('fitSmoothing', 'alpha and beta given', '0 and 1 accepted (inclusive)', '-0.1 and 1.2 refused', ok('', FC.fitSmoothing({ y: y4, method: 'holt', alpha: 0, beta: 1 })) && ok('', FC.fitSmoothing({ y: y4, method: 'holt', alpha: 1, beta: 0 })) && no(FC.fitSmoothing({ y: y4, method: 'ses', alpha: -0.1 })) && no(FC.fitSmoothing({ y: y4, method: 'ses', alpha: 1.2 })), 'alpha');
brow('fitSmoothing', 'phi given', 'any value above 0 and at most 1 (0.01 and 1 accepted)', '0 and 1.05 refused', ok('', FC.fitSmoothing({ y: y4, method: 'damped', phi: 0.01 })) && ok('', FC.fitSmoothing({ y: y4, method: 'damped', phi: 1 })) && no(FC.fitSmoothing({ y: y4, method: 'damped', phi: 0 })) && no(FC.fitSmoothing({ y: y4, method: 'damped', phi: 1.05 })), 'phi given');
const gUB = golden('damped-phi-at-upper-bound');
const UB = success('golden damped-phi-at-upper-bound', FC.fitSmoothing(clone(gUB.args)));
brow('fitSmoothing', 'phi fitted', `${S(FC.DEFAULTS.PHI_MIN)} and ${S(FC.DEFAULTS.PHI_MAX)} reached (inclusive: EKENE-P4 on ${S(FC.DEFAULTS.PHI_MIN)}, golden \`damped-phi-at-upper-bound\` on ${S(FC.DEFAULTS.PHI_MAX)})`, 'never searched outside', DFIT['EKENE-P4'].params.phi === FC.DEFAULTS.PHI_MIN && UB.params.phi === FC.DEFAULTS.PHI_MAX, 'phi fitted');
brow('fitSmoothing, arpsForecast', 'h', `0 and ${FC.DEFAULTS.MAX_H} accepted`, `-1, 1.5 and ${FC.DEFAULTS.MAX_H + 1} refused`, ok('', FC.fitSmoothing({ y: y4, method: 'ses', alpha: 0.5, h: 0 })) && ok('', FC.fitSmoothing({ y: y4, method: 'ses', alpha: 0.5, h: FC.DEFAULTS.MAX_H })) && no(FC.fitSmoothing({ y: y4, method: 'ses', h: FC.DEFAULTS.MAX_H + 1 })) && ok('', FC.arpsForecast({ y: Y1, h: 0 })) && no(FC.arpsForecast({ y: Y1, h: -1 })), 'h');
brow('forecastIntervals', 'h', '1 accepted', '0 refused', ok('', FC.forecastIntervals({ y: Y1, method: 'ses', h: 1, seed: 1 })) && no(FC.forecastIntervals({ y: Y1, method: 'ses', h: 0, seed: 1 })), 'pi h');
brow('forecastIntervals', 'nSims', `1 and ${FC.DEFAULTS.MAX_SIMS} accepted`, `0 and ${FC.DEFAULTS.MAX_SIMS + 1} refused`, ok('', FC.forecastIntervals({ y: Y1, method: 'ses', h: 1, seed: 1, nSims: 1 })) && ok('', FC.forecastIntervals({ y: y4, method: 'ses', alpha: 0.5, h: 1, seed: 1, nSims: FC.DEFAULTS.MAX_SIMS })) && no(FC.forecastIntervals({ y: Y1, method: 'ses', h: 1, seed: 1, nSims: 0 })), 'nsims');
brow('forecastIntervals', 'seed', '0 and 4294967295 accepted', '-1 and 2.5 refused', ok('', FC.forecastIntervals({ y: y4, method: 'ses', h: 1, seed: 0 })) && ok('', FC.forecastIntervals({ y: y4, method: 'ses', h: 1, seed: 4294967295 })) && no(FC.forecastIntervals({ y: y4, method: 'ses', h: 1, seed: -1 })), 'seed');
brow('forecastIntervals', 'the residual pool', '2 scored residuals accepted (holt on 4 values, ses on 3)', '1 refused (holt on 3, ses on 2)', ok('', FC.forecastIntervals({ y: y4, method: 'holt', h: 1, seed: 1 })) && ok('', FC.forecastIntervals({ y: y4.slice(0, 3), method: 'ses', h: 1, seed: 1 })) && no(FC.forecastIntervals({ y: y4.slice(0, 3), method: 'holt', h: 1, seed: 1 })) && no(FC.forecastIntervals({ y: y4.slice(0, 2), method: 'ses', h: 1, seed: 1 })), 'pool');
const BIG = TILE(FC.DEFAULTS.MAX_POINTS + 1);
brow('every function', 'series length', `${FC.DEFAULTS.MAX_POINTS} values fitted by fitSmoothing`, `${FC.DEFAULTS.MAX_POINTS + 1} refused by all six`, ok('', FC.fitSmoothing({ y: TILE(FC.DEFAULTS.MAX_POINTS), method: 'ses', alpha: 0.5 })) && no(FC.fitSmoothing({ y: BIG, method: 'ses', alpha: 0.5 })) && no(FC.accuracy({ actual: BIG, forecast: BIG })) && no(FC.forecastIntervals({ y: BIG, method: 'ses', h: 1, seed: 1 })) && no(FC.backtest({ y: BIG, method: 'ses', firstOrigin: 2, horizon: 1 })) && no(FC.arpsForecast({ y: BIG })) && no(FC.compareWithArps({ y: BIG, firstOrigin: 3, horizon: 1 })), 'cap');
brow('backtest, compareWithArps', 'the last origin', 'o + horizon = n accepted', 'o + horizon > n refused', ok('', FC.backtest({ y: Y1, method: 'ses', alpha: 0.5, firstOrigin: 42, horizon: 6 })) && no(FC.backtest({ y: Y1, method: 'ses', alpha: 0.5, firstOrigin: 43, horizon: 6 })), 'last origin');
brow('backtest', 'the first origin', 'the method\'s minimum length accepted (ses 2, holt and damped 3)', 'one less refused', ok('', FC.backtest({ y: Y1, method: 'ses', alpha: 0.5, firstOrigin: 2, horizon: 1 })) && ok('', FC.backtest({ y: Y1, method: 'holt', alpha: 0.5, beta: 0.2, firstOrigin: 3, horizon: 1 })) && no(FC.backtest({ y: Y1, method: 'holt', firstOrigin: 2, horizon: 1 })), 'first origin');
brow('compareWithArps', 'the first origin', '3 accepted for every method list', '2 refused, even for ses alone', ok('', FC.compareWithArps({ y: Y1, methods: ['ses'], firstOrigin: 3, horizon: 1, step: 20 })) && no(FC.compareWithArps({ y: Y1, methods: ['ses'], firstOrigin: 2, horizon: 1 })), 'cmp first');
const nMax = FC.DEFAULTS.MAX_ORIGINS;
brow('backtest', 'origins', `${nMax} origins accepted`, `${nMax + 1} refused`, ok('', FC.backtest({ y: TILE(nMax + 2), method: 'ses', alpha: 0.5, firstOrigin: 2, horizon: 1 })) && no(FC.backtest({ y: TILE(nMax + 3), method: 'ses', alpha: 0.5, firstOrigin: 2, horizon: 1 })), 'origins');
brow('accuracy', 'MAPE', 'every actual non-zero: a number', 'any actual 0: null with the reason', typeof ACC.holt.mape === 'number' && P2A.mape === null, 'mape');
brow('accuracy, backtest', 'MASE scale', 'Q > 0 and more than m training values: a number', 'Q = 0, or m values or fewer: null with the reason', typeof ACC.holt.mase === 'number' && accFlat.mase === null && accShort.mase === null, 'mase');
brow('arpsForecast', 'positive values', '3 fitted', '2 refused', ok('', FC.arpsForecast({ y: [0, 0, 410.5, 398.2, 390.1] })) && no(FC.arpsForecast({ y: TWO_POS })), 'arps positive');
brow('forecastIntervals', 'nonNegative', 'a percentile at or above 0 reported as simulated', 'below 0 reported as 0 and counted in clippedToZero', PIH5.clippedToZero === PIH5u.P90.concat(PIH5u.P50, PIH5u.P10).filter((v) => v < 0).length, 'clip count');
table(['function', 'rule', 'at the boundary', 'across it'], B);
w();
w(`THE CAPS trade time for size: a series stops at ${FC.DEFAULTS.MAX_POINTS} values, h at ${FC.DEFAULTS.MAX_H}, the bootstrap at ${FC.DEFAULTS.MAX_SIMS} paths, a backtest or comparison at ${nMax} origins and a fit at ${FC.DEFAULTS.PS_MAX_EVALS} SSE evaluations. A longer study is split into calls, or its step raised.`);
w();
w(`LENGTH RULES, per function (the minimum a call needs):`);
w();
table(['function', 'method', 'fewest values accepted'], [
  ['`fitSmoothing`', 'ses', '2'], ['`fitSmoothing`', 'holt, damped', '3 (2 with an initialTrend)'],
  ['`forecastIntervals`', 'ses', '3 (2 scored residuals)'], ['`forecastIntervals`', 'holt, damped', '4 (3 with an initialTrend)'],
  ['`backtest`', 'ses', '2 training values plus the horizon'], ['`backtest`', 'holt, damped', '3 training values plus the horizon'],
  ['`compareWithArps`', 'any list', '3 training values plus the horizon'], ['`arpsForecast`', 'none', '3 positive values'],
  ['`accuracy`', 'none', '1 actual and 1 forecast'],
]);
must('forecastIntervals damped with an initialTrend on 3 values is accepted and on 2 refused', ok('', FC.forecastIntervals({ y: Y1.slice(0, 3), method: 'damped', initialTrend: -20, h: 1, seed: 1 })) && no(FC.forecastIntervals({ y: Y1.slice(0, 2), method: 'damped', initialTrend: -20, h: 1, seed: 1 })), 'pi trend');
must('arps fits 3 positive values', ok('', FC.arpsForecast({ y: Y1.slice(0, 3) })), 'arps 3');

/* ============================================================ SECTION 23 */

section('bands', 'The tie bands, the parameter box and the stop rule', ['Expert m05 l02']);
w(`DECIMAL RATES ARE NOT EXACT IN BINARY. Two SSEs or two metrics that are equal on paper can differ in the last bits, so the engine compares inside a band where a tie would otherwise be decided by rounding:`);
w();
table(['where', 'the band', 'what a tie keeps'], [
  ['the coarse grid of the fit', `a later point must be below best x (1 - ${eX(FC.DEFAULTS.GRID_TIE_REL)})`, 'the earlier grid point (alpha outermost, then beta, then phi)'],
  ['the ranking of a comparison', `within ${eX(FC.DEFAULTS.RANK_TIE_REL)} relative`, 'the listed order, methods as given and arps last'],
  ['the compass search', 'a trial must be strictly below the current SSE', 'the earlier trial (+step before -step, alpha before beta before phi)'],
]);
w();
w(`THE PARAMETER BOX. A fitted alpha and beta stay in [0, 1] and a fitted phi in [${S(FC.DEFAULTS.PHI_MIN)}, ${S(FC.DEFAULTS.PHI_MAX)}]; a compass trial past an edge is clipped to it, and a trial the clip leaves where it was is skipped. The grid: alpha and beta at ${list(FC.DEFAULTS.GRID_ALPHA.map(S))}; phi at ${list(FC.DEFAULTS.GRID_PHI.map(S))}.`);
w();
w(`The holt-linear-exact golden of ${ref('fit')} is the grid tie at work: every point scores SSE 0 and the first, alpha 0 and beta 0, is kept. The cmp-constant-ties golden of ${ref('ranking')} is the ranking tie.`);
w();
w(`THE STOP RULE. The compass step starts at ${S(FC.DEFAULTS.PS_STEP)} of each range (half the grid spacing) and halves after a sweep with no improvement; the search stops when a sweep at a step of at most 2^-30 of the range improves nothing. The stop is a rule on the step: two fits that stop at SSEs printing alike are the same minimum only as far as the search could tell. SEED AND nSims name a bootstrap exactly; there is no band on a percentile, and the quantile rule of ${ref('percentiles')} is exact on the sorted simulated values.`);

/* ============================================================ SECTION 24 */

section('choices', 'Conventions that are choices, and what is not built', ['Expert m06']);
w('Every convention below is a choice the engine states in its basis. Each has a real alternative in common use; name the choice when a number from this engine is compared with one from another tool.');
w();
table(['convention', 'this engine', 'a common alternative', 'why the engine chose it'], [
  ['form of the recursions', 'component form (FPP3), beta the trend weight on the level change', 'error-correction form, or beta multiplied by alpha (some texts)', 'beta is statsmodels\' smoothing_trend, so a parameter compares directly'],
  ['the start', 'l_1 = y_1, b_1 = y_2 - y_1, y_2 not scored', 'estimated initial states (statsmodels), or a mean of early differences (NIST double smoothing)', 'a learner can start the recursion by hand'],
  ['the fit', 'least one-step SSE; grid then compass search in a stated box', 'maximum likelihood with a gradient optimiser', 'deterministic: the same series gives the same parameters'],
  ['phi range when fitted', `${S(FC.DEFAULTS.PHI_MIN)} to ${S(FC.DEFAULTS.PHI_MAX)}`, 'any value in (0, 1]', 'FPP3 8.2 restricts an estimated phi to this range'],
  ['MAPE with a zero actual', 'null with the reason', 'drop the month, or divide by a tiny number', 'a shut-in month is real and dropping it changes the metric'],
  ['sMAPE', 'absolute values in the denominator, 0 to 200, a 0/0 term scores 0', 'without absolute values, or on 0 to 100', 'Hyndman and Koehler 2006'],
  ['MASE scale', 'in-sample lag-m naive MAE of the training series, m = 1', 'the out-of-sample naive error, or a seasonal m', 'the scale is fixed before the forecast is scored'],
  ['backtest window', 'expanding, from month 0', 'a sliding window of fixed length', 'every month before the origin is information a forecaster would have'],
  ['intervals', 'residual bootstrap, residuals as fitted, parameters held', 'analytic intervals, or a bootstrap that also resamples parameters', 'no distribution is assumed; the method\'s own errors are replayed'],
  ['quantile', 'lib/stats quantile (the simple-statistics rule)', 'linear interpolation (numpy default)', 'the platform\'s one quantile'],
  ['percentile labels', 'P90 the low case (exceedance)', 'P90 the 90th percentile', 'the platform convention for outcomes'],
  ['Arps time base', 'month k passed as day k, Di per month', 'calendar days', 'fitArpsModel reads days and a step is a month'],
  ['ranking', `lowest metric first, ties within ${eX(FC.DEFAULTS.RANK_TIE_REL)} keep the listed order, MASE by default`, 'ranking by RMSE or by MAPE', 'MASE compares wells of any size and stays defined through a shut-in'],
]);
w();
w('WHAT IS NOT BUILT. No seasonal smoothing (Holt-Winters); no multiplicative error or trend forms; no ARIMA; no regression of rate on other variables such as choke, pressure or water cut (the machine learning course regresses); no neural network; no analytic prediction interval; no parameter uncertainty in the bootstrap; no filling of a missing month (refused); no EUR or cumulative (the decline curve analysis course); no Arps of its own (engines/dca/arps.js, imported).');
must('the not-built list matches the exports', !Object.keys(FC).some((k) => /season|winters|arima|regress|neural|eur/i.test(k)), Object.keys(FC).join(','));
w();
w('WRITING THE FORECAST NOTE names: the well and months; the method and parameters, fitted or given, with any bound; the backtest that tested it (origins, horizon, step, refit) and its MASE with m against the Arps baseline on the same origins; the intervals with method, nSims, seed and nonNegative, and the P90 read as the low case; every null metric with its reason.');

/* ============================================================ SECTION 25 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Six words in this course carry a narrower meaning than they have in conversation or elsewhere in the academy. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it can mean elsewhere', 'the rule here'], [
  ['forecast', 'any estimate of the future', 'the point forecast of one fitted method, named with its method; a one-step forecast is a fitted value; a percentile is named as a percentile'],
  ['error', 'any difference', 'actual minus forecast, so a positive error means the forecast was low; a residual is an in-sample one-step error'],
  ['P90', 'the 90th percentile', 'the low case, the 10th percentile of the simulated paths, by exceedance; P10 is the high case'],
  ['accuracy', 'any agreement', 'a named metric on named months: in-sample, a hold-out, or a backtest with its origins; MAPE and sMAPE in percent, MASE with its lag m'],
  ['trend', 'any direction', 'the smoothed trend state b of holt or damped, in bbl/d per month'],
  ['machine learning', 'any automated judgement', 'a method named by what it is: exponential smoothing, a residual bootstrap, a least-squares Arps fit; no lesson calls a method artificial intelligence'],
]);
w();
w('A SEEDED NUMBER is quoted with its seed and nSims; a MASE with its m; a ranking with its metric and origins.');

/* ============================================================ CLOSING CHECKS */

T.PLANTED.forEach((p, i) => must(`planted structure ${i} (${p[0]}) is checked by some section`, PLANT_FOUND.get(i) === true, PLANT_FOUND.get(i)));
const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('every optimiser record read in this digest converged', FITS.every(([, c]) => c === true), FITS.filter(([, c]) => c !== true).map(([l]) => l).join(', ') || `${FITS.length} fits`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
// The engine's own reasons say "MAPE is undefined" and "MASE is undefined"; those are quoted verbatim and exempt.
const bare = (l) => l.replace(/MA[PS]E is undefined/g, '');
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(bare(l))), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(bare(l))));

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d4_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.D4_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`d4_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
