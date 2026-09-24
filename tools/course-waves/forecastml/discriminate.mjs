// THE DISCRIMINATE SWEEP over every D4 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). The closest miss
// is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is an engine call, checked against fields.json. The
// wrong methods are the mistakes a learner makes, and most are the ENGINE
// CALLED WRONGLY on the planted structure of the capstone data: the wrong well,
// the wrong method, a parameter fitted that should be given, the SSE quoted for
// the MSE, the step before or after, MAPE with the shut-in months dropped, the
// scale taken from the months being scored, the parameters refitted where they
// should be held, the months scored fitted first (leakage), the 90th percentile
// read as P90, the next seed, a decline quoted per year, the Arps baseline
// taken as the best. A few are hand arithmetic a learner might do instead of
// calling the engine (sMAPE on 0 to 100, SSE over every month); they live
// here, among the wrong methods, and nowhere else.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e12 and must report EIGHTEEN WEAK
// ROUTES, proving the sweep reads the tolerances rather than printing a
// constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.D4_WAVE_DIR || '/root/dai-wip-forecastml';
const ROOT = process.env.D4_ENGINES || '/root/wt-dai-d4-nextgen/packages/engines';
const FC = await import(`${ROOT}/engines/dataai/forecast.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e12 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The datasets come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/d4_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8, env: { ...process.env, D4_ENGINES: ROOT } }));

/* ---- helpers for the WRONG methods only ---- */
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => sum(a) / a.length;
const rateOf = (F, id) => F.wells.find((w) => w.well === id).rate;
const fit = (y, method, o = {}) => FC.fitSmoothing({ y, method, ...o });

/* ---- AGULU ---- */
const AG = inp.AGULU; const agS = AG.stated;
const ag1 = rateOf(AG.field, 'AGULU-1'); const ag2 = rateOf(AG.field, 'AGULU-2');
const agHfix = fit(ag1, 'holt', { alpha: agS.alpha, beta: agS.beta });
const agH = fit(ag1, 'holt', { h: agS.hHolt + 1 });
const agD = fit(ag1, 'damped', { h: agS.hDamped + 1 });

/* ---- NANKA ---- */
const NK = inp.NANKA; const nkS = NK.stated;
const nk1 = rateOf(NK.field, 'NANKA-1'); const nk2 = rateOf(NK.field, 'NANKA-2');
const nkTrain = nk1.slice(0, nkS.train); const nkAct = nk1.slice(nkS.train, nkS.train + nkS.h);
const nkAcc = (method, o = {}) => FC.accuracy({ actual: nkAct, forecast: fit(nkTrain, method, { h: nkS.h }).forecast, insample: nkTrain, ...o });
const nkDF = fit(nkTrain, 'damped', { h: nkS.h }).forecast;
const nkBT = (o = {}) => FC.backtest({ y: nk2, method: 'holt', firstOrigin: nkS.firstOrigin, horizon: nkS.horizon, step: nkS.step, ...o });
const nkB = nkBT(); const nkBH = nkBT({ refit: false });
const rmse = (e) => Math.sqrt(mean(e.map((v) => v * v)));
const nkFull = fit(nk2, 'holt');
const btIdx = nkB.perOrigin.flatMap((r) => r.actual.map((_, j) => r.origin + j));

/* ---- UMUNZE ---- */
const UM = inp.UMUNZE; const umS = UM.stated;
const um1 = rateOf(UM.field, 'UMUNZE-1'); const um2 = rateOf(UM.field, 'UMUNZE-2');
const umPI = (o = {}) => FC.forecastIntervals({ y: um1, method: 'damped', h: umS.h, nSims: umS.nSims, seed: umS.seed, ...o });
const PI = umPI();
const umCmp = (o = {}) => FC.compareWithArps({ y: um2, firstOrigin: umS.firstOrigin, horizon: umS.horizon, step: umS.step, ...o });
const CM = umCmp();
const row = (c, m) => c.rows.find((r) => r.method === m);

const ROUTES = {
  agulu2_ses_alpha: {
    truth: () => fit(ag2, 'ses').params.alpha,
    wrong: {
      the_other_well: () => fit(ag1.slice(), 'ses', { h: 0 }).params.alpha,
      holt_alpha_instead: () => fit(ag2, 'holt').params.alpha,
      damped_alpha_instead: () => fit(ag2, 'damped').params.alpha,
      grid_start_quoted: () => fit(ag2, 'ses').optimiser.gridStart.alpha,
      fitted_on_the_first_three_years: () => fit(ag2.slice(0, 36), 'ses').params.alpha,
    },
  },
  agulu1_holt_fixed_mse_bopd2: {
    truth: () => agHfix.mse,
    wrong: {
      sse_quoted: () => agHfix.sse,
      divided_by_every_month: () => agHfix.sse / ag1.length,
      divided_by_n_less_one: () => agHfix.sse / (ag1.length - 1),
      root_taken: () => Math.sqrt(agHfix.mse),
      parameters_fitted_instead: () => fit(ag1, 'holt').mse,
      ses_at_the_same_alpha: () => fit(ag1, 'ses', { alpha: agS.alpha }).mse,
    },
  },
  agulu1_holt_beta: {
    truth: () => fit(ag1, 'holt').params.beta,
    wrong: {
      alpha_quoted: () => fit(ag1, 'holt').params.alpha,
      damped_beta: () => fit(ag1, 'damped').params.beta,
      grid_start_quoted: () => fit(ag1, 'holt').optimiser.gridStart.beta,
      the_other_well: () => fit(ag2, 'holt').params.beta,
      stated_beta_quoted: () => agS.beta,
    },
  },
  agulu1_holt_forecast_h12_bopd: {
    truth: () => fit(ag1, 'holt', { h: agS.hHolt }).forecast[agS.hHolt - 1],
    wrong: {
      step_eleven: () => agH.forecast[agS.hHolt - 2],
      step_thirteen: () => agH.forecast[agS.hHolt],
      damped_instead: () => agD.forecast[agS.hHolt - 1],
      ses_flat_forecast: () => fit(ag1, 'ses', { h: agS.hHolt }).forecast[agS.hHolt - 1],
      stated_parameters_used: () => fit(ag1, 'holt', { alpha: agS.alpha, beta: agS.beta, h: agS.hHolt }).forecast[agS.hHolt - 1],
      last_month_less_one_step: () => ag1[ag1.length - 1] + agS.hHolt * (ag1[ag1.length - 1] - ag1[ag1.length - 2]),
    },
  },
  agulu1_damped_phi: {
    truth: () => fit(ag1, 'damped').params.phi,
    wrong: {
      the_other_well: () => fit(ag2, 'damped').params.phi,
      grid_start_quoted: () => fit(ag1, 'damped').optimiser.gridStart.phi,
      upper_bound_quoted: () => FC.DEFAULTS.PHI_MAX,
      alpha_quoted: () => fit(ag1, 'damped').params.alpha,
      with_the_stated_alpha: () => fit(ag1, 'damped', { alpha: agS.alpha }).params.phi,
    },
  },
  agulu1_damped_forecast_h24_bopd: {
    truth: () => fit(ag1, 'damped', { h: agS.hDamped }).forecast[agS.hDamped - 1],
    wrong: {
      step_twelve: () => agD.forecast[agS.hHolt - 1],
      step_twenty_five: () => agD.forecast[agS.hDamped],
      holt_instead: () => fit(ag1, 'holt', { h: agS.hDamped }).forecast[agS.hDamped - 1],
      the_limit_quoted: () => { const d = fit(ag1, 'damped'); const n = ag1.length - 1; return d.level[n] + d.trend[n] * d.params.phi / (1 - d.params.phi); },
      phi_given_as_one: () => fit(ag1, 'damped', { phi: 1, h: agS.hDamped }).forecast[agS.hDamped - 1],
    },
  },
  nanka1_holdout_damped_smape_pct: {
    truth: () => nkAcc('damped').smape,
    wrong: {
      mape_with_the_shut_in_dropped: () => { const k = nkAct.map((a, j) => [a, nkDF[j]]).filter(([a]) => a !== 0); return 100 * mean(k.map(([a, f]) => Math.abs((a - f) / a))); },
      smape_with_the_shut_in_dropped: () => { const k = nkAct.map((a, j) => [a, nkDF[j]]).filter(([a]) => a !== 0); return FC.accuracy({ actual: k.map((x) => x[0]), forecast: k.map((x) => x[1]) }).smape; },
      on_zero_to_one_hundred: () => nkAcc('damped').smape / 2,
      holt_instead: () => nkAcc('holt').smape,
      forecast_alone_in_the_denominator: () => 100 * mean(nkAct.map((a, j) => Math.abs(a - nkDF[j]) / Math.abs(nkDF[j]))),
    },
  },
  nanka1_holdout_damped_mase: {
    truth: () => nkAcc('damped').mase,
    wrong: {
      scaled_by_the_holdout_naive: () => nkAcc('damped').mae / mean(nkAct.slice(1).map((v, j) => Math.abs(v - nkAct[j]))),
      lag_twelve: () => nkAcc('damped', { m: 12 }).mase,
      scaled_by_the_whole_series: () => nkAcc('damped').mae / mean(nk1.slice(1).map((v, j) => Math.abs(v - nk1[j]))),
      holt_instead: () => nkAcc('holt').mase,
      rmse_over_the_scale: () => nkAcc('damped').rmse / nkAcc('damped').maseScale,
    },
  },
  nanka1_holdout_damped_me_bopd: {
    truth: () => nkAcc('damped').me,
    wrong: {
      forecast_minus_actual: () => -nkAcc('damped').me,
      mae_quoted: () => nkAcc('damped').mae,
      holt_instead: () => nkAcc('holt').me,
      shut_in_months_dropped: () => mean(nkAct.map((a, j) => a - nkDF[j]).filter((_, j) => nkAct[j] !== 0)),
      ses_instead: () => nkAcc('ses').me,
    },
  },
  nanka2_backtest_holt_rmse_bopd: {
    truth: () => nkB.overall.rmse,
    wrong: {
      mae_quoted: () => nkB.overall.mae,
      parameters_held: () => nkBH.overall.rmse,
      fitted_on_every_month_first: () => rmse(btIdx.map((t) => nkFull.residuals[t])),
      step_one: () => nkBT({ step: 1 }).overall.rmse,
      mean_of_the_origin_rmses: () => mean(nkB.perOrigin.map((r) => rmse(r.errors))),
      ses_instead: () => FC.backtest({ y: nk2, method: 'ses', firstOrigin: nkS.firstOrigin, horizon: nkS.horizon, step: nkS.step }).overall.rmse,
    },
  },
  nanka2_backtest_holt_held_mase: {
    truth: () => nkBH.overall.mase,
    wrong: {
      refitted: () => nkB.overall.mase,
      lag_twelve: () => nkBT({ refit: false, m: 12 }).overall.mase,
      one_scale_for_every_origin: () => mean(nkBH.perOrigin.flatMap((r) => r.errors.map(Math.abs))) / nkBH.perOrigin[nkBH.perOrigin.length - 1].maseScale,
      scaled_by_the_actuals_scored: () => mean(nkBH.perOrigin.flatMap((r) => r.errors.map(Math.abs))) / mean(nkBH.perOrigin.flatMap((r) => r.actual.slice(1).map((v, j) => Math.abs(v - r.actual[j])))),
      held_from_the_full_series: () => nkBT({ alpha: nkFull.params.alpha, beta: nkFull.params.beta }).overall.mase,
    },
  },
  nanka2_backtest_holt_step6_mae_bopd: {
    truth: () => nkB.byHorizon[nkS.horizon - 1].mae,
    wrong: {
      step_one: () => nkB.byHorizon[0].mae,
      overall_quoted: () => nkB.overall.mae,
      step_five: () => nkB.byHorizon[nkS.horizon - 2].mae,
      held_parameters: () => nkBH.byHorizon[nkS.horizon - 1].mae,
      rmse_at_step_six: () => nkB.byHorizon[nkS.horizon - 1].rmse,
    },
  },
  umunze1_damped_p90_h12_bopd: {
    truth: () => PI.P90[umS.h - 1],
    wrong: {
      the_ninetieth_percentile_read_as_p90: () => PI.P10[umS.h - 1],
      the_next_seed: () => umPI({ seed: umS.seed + 1 }).P90[umS.h - 1],
      the_point_forecast: () => PI.forecast[umS.h - 1],
      step_eleven: () => PI.P90[umS.h - 2],
      holt_instead: () => FC.forecastIntervals({ y: um1, method: 'holt', h: umS.h, nSims: umS.nSims, seed: umS.seed }).P90[umS.h - 1],
      nine_hundred_ninety_nine_paths: () => umPI({ nSims: umS.nSims - 1 }).P90[umS.h - 1],
    },
  },
  umunze1_damped_p10_h12_bopd: {
    truth: () => PI.P10[umS.h - 1],
    wrong: {
      the_tenth_percentile_read_as_p10: () => PI.P90[umS.h - 1],
      the_next_seed: () => umPI({ seed: umS.seed + 1 }).P10[umS.h - 1],
      p50_quoted: () => PI.P50[umS.h - 1],
      ses_instead: () => FC.forecastIntervals({ y: um1, method: 'ses', h: umS.h, nSims: umS.nSims, seed: umS.seed }).P10[umS.h - 1],
      ten_thousand_paths: () => umPI({ nSims: 10 * umS.nSims }).P10[umS.h - 1],
    },
  },
  umunze1_damped_p50_h6_bopd: {
    truth: () => PI.P50[5],
    wrong: {
      the_point_forecast: () => PI.forecast[5],
      the_next_seed: () => umPI({ seed: umS.seed + 1 }).P50[5],
      step_five: () => PI.P50[4],
      step_seven: () => PI.P50[6],
      step_twelve: () => PI.P50[umS.h - 1],
    },
  },
  umunze1_arps_di_per_month: {
    truth: () => FC.arpsForecast({ y: um1 }).Di,
    wrong: {
      quoted_per_year: () => 12 * FC.arpsForecast({ y: um1 }).Di,
      quoted_per_day: () => FC.arpsForecast({ y: um1 }).Di / 30.4375,
      exponential_forced: () => FC.arpsForecast({ y: um1, modelType: 'Exponential' }).Di,
      harmonic_forced: () => FC.arpsForecast({ y: um1, modelType: 'Harmonic' }).Di,
      fitted_on_three_years: () => FC.arpsForecast({ y: um1.slice(0, 36) }).Di,
      the_other_well: () => FC.arpsForecast({ y: um2 }).Di,
    },
  },
  umunze2_compare_arps_mase: {
    truth: () => row(CM, 'arps').mase,
    wrong: {
      the_best_quoted: () => row(CM, CM.best).mase,
      arps_mae_quoted: () => row(CM, 'arps').mae,
      lag_twelve: () => row(umCmp({ m: 12 }), 'arps').mase,
      exponential_arps: () => row(umCmp({ arpsModel: 'Exponential' }), 'arps').mase,
      step_one: () => row(umCmp({ step: 1 }), 'arps').mase,
      one_arps_fit_on_the_first_window: () => { const a = FC.arpsForecast({ y: um2.slice(0, umS.firstOrigin), h: um2.length }); const e = CM.origins.flatMap((o) => um2.slice(o, o + umS.horizon).map((v, j) => Math.abs(v - a.forecast[o - umS.firstOrigin + j]) / FC.accuracy({ actual: [1], forecast: [1], insample: um2.slice(0, o) }).maseScale)); return mean(e); },
    },
  },
  umunze2_compare_best_mase: {
    truth: () => row(CM, CM.best).mase,
    wrong: {
      arps_quoted: () => row(CM, 'arps').mase,
      second_ranked: () => row(CM, CM.ranking[1]).mase,
      best_by_mae_then_its_mase: () => { const c = umCmp({ rankBy: 'mae' }); return c.best === CM.best ? row(c, c.ranking[1]).mase : row(c, c.best).mase; },
      parameters_held: () => row(umCmp({ refit: false }), CM.best).mase,
      last_ranked: () => row(CM, CM.ranking[CM.ranking.length - 1]).mase,
    },
  },
};

let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
const report = [];
const summary = {};
console.log('field                                            tol        errors  moved  blind  closest miss (tolerances)');
Object.entries(ROUTES).forEach(([key, { truth, wrong }]) => {
  if (!fields[key]) { console.log(`REFUSED: ${key} is not a graded field`); process.exit(2); }
  const tol = fields[key][3];
  const t = truth();
  if (!Number.isFinite(t)) { console.log(`REFUSED: the true value of ${key} did not evaluate`); process.exit(2); }
  if (SLACK === 1 && Math.abs(t - fields[key][2]) > 1e-12 * Math.abs(t)) {
    console.log(`REFUSED: the truth route for ${key} gives ${t}, and fields.json carries ${fields[key][2]}`); process.exit(2);
  }
  const moved = []; const blind = [];
  let nearest = Infinity; let nearestName = null;
  Object.entries(wrong).forEach(([name, f]) => {
    totalWrong += 1;
    let got;
    try { got = f(); } catch (e) { got = NaN; }
    // A wrong method that does not evaluate proves nothing: it is a defect of the
    // sweep, never a method that "moved" the answer.
    if (!Number.isFinite(got)) { console.log(`REFUSED: the wrong method ${key}/${name} did not evaluate to a finite number (${got})`); process.exit(2); }
    const d = Math.abs(got - t);
    if (!Number.isFinite(got) || d > tol) {
      moved.push(name);
      const ratio = Number.isFinite(got) ? d / tol : Infinity;
      if (ratio < nearest) { nearest = ratio; nearestName = name; }
      report.push({ key, name, value: got });
    } else { blind.push(`${name} (off by ${d.toExponential(3)})`); }
  });
  summary[key] = Object.keys(wrong).map((n) => n.replace(/_/g, ' ')).join(', ');
  if (nearest < closest.ratio) closest = { key, name: nearestName, ratio: nearest };
  const isWeak = moved.length < 3 || blind.length > 0;
  if (isWeak) weak += 1;
  console.log(`${key.padEnd(48)} ${String(tol).padEnd(10)} ${String(moved.length + blind.length).padStart(6)} ${String(moved.length).padStart(6)} ${String(blind.length).padStart(6)}  ${nearest === Infinity ? 'all infinite' : nearest.toExponential(3)} (${nearestName})${isWeak ? '   WEAK' : ''}`);
  if (blind.length) console.log(`${' '.repeat(49)}BLIND TO: ${blind.join(', ')}`);
});
console.log();
console.log(`routes swept: ${Object.keys(ROUTES).length}  plausible wrong methods aimed at them: ${totalWrong}  WEAK routes: ${weak}`);
console.log(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.name}, ${closest.ratio.toExponential(3)} tolerances away`);
if (process.argv.includes('--values')) {
  report.forEach((r) => console.log(`  wrong ${r.key} ${r.name} = ${r.value}`));
}
if (process.argv.includes('--summary')) process.stdout.write(`${JSON.stringify(summary)}\n`);
if (Object.keys(ROUTES).length !== 18 || totalWrong < 54) {
  console.log('REFUSED: a sweep with fewer than three wrong methods a field is not a sweep');
  process.exit(2);
}
if (SLACK !== 1) {
  console.log(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
process.exit(weak ? 1 : 0);
