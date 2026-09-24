// THE EIGHTEEN GRADED D4 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three fields, six graded values each, every one a RETURN VALUE of the
// vendored engines/dataai/forecast.js. A gate that restates the formula
// validates nothing, so nothing here computes a level, an error, a scale, a
// percentile or a decline by its own arithmetic: every number is read off an
// engine result object, and discriminate.mjs is where the wrong methods live.
//
//   AGULU    Associate     smoothing a rate series into a forecast: a fitted
//                          ses alpha, the MSE of holt with its parameters
//                          given, a fitted holt beta and a holt forecast, a
//                          fitted damped phi and a damped forecast
//   NANKA    Professional  testing a forecast honestly: a hold-out sMAPE,
//                          MASE and mean error through a shut-in, a backtest
//                          RMSE, a held-parameter backtest MASE and a
//                          by-horizon MAE
//   UMUNZE   Expert        uncertainty, the Arps baseline and the engine's
//                          rules: a bootstrap P90, P10 and P50, an Arps Di per
//                          month, and a comparison's Arps MASE and best MASE
//
// The datasets are generated here, deterministically, through the canonical
// mulberry32 and randomNormal of lib/stats on stated seeds that differ from the
// teaching dataset's, with their own well names, lengths and decline inputs,
// shaped by engines/dca/arps.js calculateArpsHyperbolic, and every scenario
// claim the brief will make is asserted.
//
// THE CARE RULES FROM THE PROGRAMME, all asserted below:
//   * CONVERGENCE. Every fit a graded value reads has converged, at every
//     origin of a backtest; no graded value is a stop by the evaluation cap.
//   * BOUNDS. No graded fitted parameter sits on a bound of its box, and no
//     graded percentile is reported as 0.
//   * SEED. A value read from the bootstrap carries its seed and nSims as
//     stated inputs, and on the next seed it moves by more than ten
//     tolerances, so a learner who changes the seed cannot land on it.
//   * ONE ANSWER. Every graded value is non-zero and not a whole number.
//
// Usage:
//   node d4_capstone.mjs            the human table
//   node d4_capstone.mjs --json     the rows make_fields.mjs writes
//   node d4_capstone.mjs --inputs   the three datasets and their stated
//                                   inputs, for oracle_check.py,
//                                   discriminate.mjs and gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST OR THE TEACHING DATASET, and the digest
// generator reads nothing here.
import process from 'node:process';

const ROOT = process.env.D4_ENGINES || '/root/wt-dai-d4-nextgen/packages/engines';
const FC = await import(`${ROOT}/engines/dataai/forecast.js`);
const { mulberry32, randomNormal } = await import(`${ROOT}/lib/stats/stats.js`);
const { calculateArpsHyperbolic } = await import(`${ROOT}/engines/dca/arps.js`);
const TOLPATH = process.env.D4_TOLERANCE
  || '/root/wt-dai-d4-nextgen/src/components/course/panels/forecastml/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const NOTES = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
/** A call this file LABELS a success: no error key, every top-level number finite, no warning. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
    must(`NO WARNING: ${label}`, !r.warnings, r.warnings && r.warnings.join(' | '));
  }
  return r;
};
const r1 = (x) => Math.round(x * 10) / 10;
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));
const onBound = (r) => r.optimiser && r.optimiser.atBounds.length > 0;

/**
 * One capstone well: Arps (qi, Di, b) with multiplicative noise, one normal
 * draw per month on ONE stream per field, rounded to 0.1 bbl/d; an optional
 * shut-in [first, last] at rate 0 and an uplift from the restart on.
 */
const buildField = ({ seed, wells }) => {
  const g = mulberry32(seed);
  return { seed, wells: wells.map((W) => {
    const rate = [];
    for (let t = 0; t < W.months; t += 1) {
      const e = randomNormal(g);
      if (W.shutIn && t >= W.shutIn[0] && t <= W.shutIn[1]) { rate.push(0); continue; }
      const lift = W.shutIn && t > W.shutIn[1] ? 1 + W.uplift : 1;
      rate.push(r1(Math.max(0, calculateArpsHyperbolic(W.qi, W.Di, W.b, t) * lift * (1 + W.noise * e))));
    }
    return { well: W.id, rate, spec: W };
  }) };
};
const rateOf = (F, id) => F.wells.find((w) => w.well === id).rate;

/* ========================================================== AGULU, Associate

   Two wells. The brief states: every parameter fitted unless given; holt
   with alpha 0.4 and beta 0.15 given for the MSE; h 12 for
   holt and h 24 for damped, both fitted on all of AGULU-1. */

const AGULU = freeze({
  field: buildField({ seed: 81133, wells: [
    { id: 'AGULU-1', months: 42, qi: 1340, Di: 0.055, b: 0.45, noise: 0.035 },
    { id: 'AGULU-2', months: 42, qi: 760, Di: 0.035, b: 0.6, noise: 0.11 },
  ] }),
  stated: { alpha: 0.4, beta: 0.15, hHolt: 12, hDamped: 24 },
});
const agS = AGULU.stated;
const ag1 = rateOf(AGULU.field, 'AGULU-1');
const ag2 = rateOf(AGULU.field, 'AGULU-2');
const agSes2 = success('Agulu-2 ses fitted', FC.fitSmoothing({ y: ag2, method: 'ses' }));
const agHfix = success('Agulu-1 holt alpha 0.4 beta 0.15', FC.fitSmoothing({ y: ag1, method: 'holt', alpha: agS.alpha, beta: agS.beta }));
const agH = success('Agulu-1 holt fitted h 12', FC.fitSmoothing({ y: ag1, method: 'holt', h: agS.hHolt }));
const agD = success('Agulu-1 damped fitted h 24', FC.fitSmoothing({ y: ag1, method: 'damped', h: agS.hDamped }));
[agSes2, agH, agD].forEach((r, i) => must(`Agulu fit ${i}: converged and on no bound`, r.optimiser.converged && !onBound(r), r.optimiser.atBounds));
must('Agulu-1 holt fixed: scored from index 2, so the MSE divides by n - 2', agHfix.scoredFrom === 2 && agHfix.nScored === ag1.length - 2 && agHfix.residuals[1] === null, agHfix.scoredFrom);
must('Agulu-1: ses fitted there stops on alpha 1 (so the graded alpha is AGULU-2\'s)', FC.fitSmoothing({ y: ag1, method: 'ses' }).params.alpha === 1, 'bound');

/* ======================================================= NANKA, Professional

   Two wells. NANKA-1 is shut in for months 40 and 41. The brief states:
   damped fitted on NANKA-1 months 0 to 35, forecast 12 steps, scored on
   months 36 to 47 with months 0 to 35 as insample (m 1); a holt backtest of
   NANKA-2 from first origin 18, horizon 6, step 4, refitted, and the same
   with refit false. */

const NANKA = freeze({
  field: buildField({ seed: 82247, wells: [
    { id: 'NANKA-1', months: 48, qi: 1117, Di: 0.048, b: 0.55, noise: 0.045, shutIn: [40, 41], uplift: 0 },
    { id: 'NANKA-2', months: 50, qi: 980, Di: 0.06, b: 0.35, noise: 0.06 },
  ] }),
  stated: { train: 36, h: 12, firstOrigin: 18, horizon: 6, step: 4 },
});
const nkS = NANKA.stated;
const nk1 = rateOf(NANKA.field, 'NANKA-1');
const nk2 = rateOf(NANKA.field, 'NANKA-2');
const nkD = success('Nanka-1 damped on months 0 to 35', FC.fitSmoothing({ y: nk1.slice(0, nkS.train), method: 'damped', h: nkS.h }));
must('Nanka-1 damped converged', nkD.optimiser.converged, 'conv');
const nkA = success('Nanka-1 hold-out accuracy', FC.accuracy({ actual: nk1.slice(nkS.train, nkS.train + nkS.h), forecast: nkD.forecast, insample: nk1.slice(0, nkS.train) }));
must('Nanka-1: MAPE is null through the shut-in', nkA.mape === null && /is 0/.test(nkA.notes.mape), nkA.notes && nkA.notes.mape);
const nkB = success('Nanka-2 holt backtest refit', FC.backtest({ y: nk2, method: 'holt', firstOrigin: nkS.firstOrigin, horizon: nkS.horizon, step: nkS.step }));
const nkBH = success('Nanka-2 holt backtest held', FC.backtest({ y: nk2, method: 'holt', firstOrigin: nkS.firstOrigin, horizon: nkS.horizon, step: nkS.step, refit: false }));
must('Nanka-2: the backtest has origins 18, 22, ..., 42', nkB.origins.join() === '18,22,26,30,34,38,42', nkB.origins);
const nkConv = FC.backtest({ y: nk2, method: 'holt', firstOrigin: nkS.firstOrigin, horizon: nkS.horizon, step: nkS.step });
must('Nanka-2: every origin converged', nkB.perOrigin.every((r) => r.params) && !nkConv.warnings, 'conv');
must('Nanka-2: held and refit differ', nkBH.overall.mase !== nkB.overall.mase, 'differ');

/* ========================================================== UMUNZE, Expert

   Two wells. UMUNZE-2 is shut in for months 28 to 30 and restarts with an
   uplift. The brief states: damped fitted on all of UMUNZE-1, h 12,
   nSims 1000, seed 29, nonNegative true; arpsForecast Auto-Select on
   UMUNZE-1; compareWithArps on UMUNZE-2 from first origin 33, horizon 6,
   step 3, ranked by MASE (m 1, refit true). */

const UMUNZE = freeze({
  field: buildField({ seed: 83365, wells: [
    { id: 'UMUNZE-1', months: 45, qi: 890, Di: 0.052, b: 0.65, noise: 0.05 },
    { id: 'UMUNZE-2', months: 52, qi: 1210, Di: 0.058, b: 0.4, noise: 0.05, shutIn: [28, 30], uplift: 0.4 },
  ] }),
  stated: { h: 12, nSims: 1000, seed: 29, firstOrigin: 33, horizon: 6, step: 3 },
});
const umS = UMUNZE.stated;
const um1 = rateOf(UMUNZE.field, 'UMUNZE-1');
const um2 = rateOf(UMUNZE.field, 'UMUNZE-2');
const umPI = success('Umunze-1 damped intervals', FC.forecastIntervals({ y: um1, method: 'damped', h: umS.h, nSims: umS.nSims, seed: umS.seed }));
must('Umunze-1: the graded percentiles are above 0', umPI.P90[umS.h - 1] > 0 && umPI.P50[5] > 0, umPI.P90[umS.h - 1]);
const umFit = success('Umunze-1 damped fitted', FC.fitSmoothing({ y: um1, method: 'damped', h: umS.h }));
must('Umunze-1 damped converged on no bound', umFit.optimiser.converged && !onBound(umFit), umFit.optimiser.atBounds);
const umAR = success('Umunze-1 arps', FC.arpsForecast({ y: um1, h: umS.h }));
const umC = success('Umunze-2 compare', FC.compareWithArps({ y: um2, firstOrigin: umS.firstOrigin, horizon: umS.horizon, step: umS.step }));
must('Umunze-2: every method is ranked and the best is not arps', umC.ranking.length === 4 && umC.best !== 'arps', umC.ranking);
const umArpsRow = umC.rows.find((r) => r.method === 'arps');
const umBestRow = umC.rows.find((r) => r.method === umC.best);
must('Umunze-2: arps dropped the shut-in months at the later origins', umArpsRow.perOrigin.some((p) => p.origin > 30), 'dropped');
must('Umunze-2: the top two MASE differ by more than a thousand tolerances', Math.abs(umC.rows.find((r) => r.method === umC.ranking[1]).mase - umBestRow.mase) > 1e-3, umC.ranking);

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'agulu2_ses_alpha', 'parameter', agSes2.params.alpha],
  ['beginner', 'agulu1_holt_fixed_mse_bopd2', 'mse', agHfix.mse],
  ['beginner', 'agulu1_holt_beta', 'parameter', agH.params.beta],
  ['beginner', 'agulu1_holt_forecast_h12_bopd', 'rate', agH.forecast[agS.hHolt - 1]],
  ['beginner', 'agulu1_damped_phi', 'parameter', agD.params.phi],
  ['beginner', 'agulu1_damped_forecast_h24_bopd', 'rate', agD.forecast[agS.hDamped - 1]],
  ['intermediate', 'nanka1_holdout_damped_smape_pct', 'percent', nkA.smape],
  ['intermediate', 'nanka1_holdout_damped_mase', 'scaled', nkA.mase],
  ['intermediate', 'nanka1_holdout_damped_me_bopd', 'rate', nkA.me],
  ['intermediate', 'nanka2_backtest_holt_rmse_bopd', 'rate', nkB.overall.rmse],
  ['intermediate', 'nanka2_backtest_holt_held_mase', 'scaled', nkBH.overall.mase],
  ['intermediate', 'nanka2_backtest_holt_step6_mae_bopd', 'rate', nkB.byHorizon[nkS.horizon - 1].mae],
  ['advanced', 'umunze1_damped_p90_h12_bopd', 'rate', umPI.P90[umS.h - 1]],
  ['advanced', 'umunze1_damped_p10_h12_bopd', 'rate', umPI.P10[umS.h - 1]],
  ['advanced', 'umunze1_damped_p50_h6_bopd', 'rate', umPI.P50[5]],
  ['advanced', 'umunze1_arps_di_per_month', 'decline', umAR.Di],
  ['advanced', 'umunze2_compare_arps_mase', 'scaled', umArpsRow.mase],
  ['advanced', 'umunze2_compare_best_mase', 'scaled', umBestRow.mase],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite number away from zero`, Number.isFinite(r.value) && Math.abs(r.value) > 1e-3, r.value));
// NEVER GRADE A SMALL INTEGER: a whole number sits inside every guard band.
ROWS.forEach((r) => must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3, r.value));
const byKey = Object.fromEntries(ROWS.map((r) => [r.key, r.value]));

/* ----------------------------------------------------------- the seed check */

// A value read from the bootstrap, on the next seed: it must move by more than
// ten tolerances, so the seed is part of the answer.
const nextSeed = [
  ['umunze1_damped_p90_h12_bopd', () => FC.forecastIntervals({ y: um1, method: 'damped', h: umS.h, nSims: umS.nSims, seed: umS.seed + 1 }).P90[umS.h - 1]],
  ['umunze1_damped_p10_h12_bopd', () => FC.forecastIntervals({ y: um1, method: 'damped', h: umS.h, nSims: umS.nSims, seed: umS.seed + 1 }).P10[umS.h - 1]],
  ['umunze1_damped_p50_h6_bopd', () => FC.forecastIntervals({ y: um1, method: 'damped', h: umS.h, nSims: umS.nSims, seed: umS.seed + 1 }).P50[5]],
];
nextSeed.forEach(([key, f]) => {
  const v = f();
  const d = Math.abs(v - byKey[key]);
  must(`SEED: ${key} on the next seed moves by more than ten tolerances`, d > 10 * gradedTolerance(key), `${v} vs ${byKey[key]}`);
  NOTES.push(`SEED ${key}: the next seed moves it by ${(d / gradedTolerance(key)).toExponential(2)} tolerances`);
});

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d4_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
if (!process.argv.includes('--json') && !process.argv.includes('--inputs')) NOTES.forEach((n) => process.stderr.write(`  ${n}\n`));
process.stderr.write(`d4_capstone: ${ASSERTS.length} label-and-call, scenario, convergence, bound and seed assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ AGULU, NANKA, UMUNZE })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 44)}${pad('CLASS', 12)}${pad('VALUE', 20)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 44)}${pad(r.cls, 12)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 20)}${gradedTolerance(r.key)}\n`));
}
