// THE DISCRIMINATE SWEEP over every D1 capstone route.
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
// wrong methods may use any arithmetic, because they are the mistakes a
// learner makes: the sentinel counted as missing, a step equal to maxStep read
// as a hole, the mean step, the water cut on an oil basis, the tolerance taken
// on the sum, the population standard deviation, the reciprocal of 1.4826, R6
// quartiles, a wider Hampel window, alpha/N, the population covariance, the
// sample SD in place of MRbar / d2, EWMA started at the first observation,
// unnormalised weights.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e12 (the cumulative drop is
// thousands of barrels, so 1e9 leaves one wrong method outside a slack band) and must report EIGHTEEN WEAK
// ROUTES, proving the sweep reads the tolerances rather than printing a
// constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.D1_WAVE_DIR || '/root/dai-wip-dataqc';
const ROOT = process.env.D1_ENGINES || '/root/wt-dai-d1-nextgen/packages/engines';
const Q = await import(`${ROOT}/engines/dataai/quality.js`);
const ST = await import(`${ROOT}/lib/stats/stats.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e12 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The datasets come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/d1_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8 }));
const O = inp.ODUDU; const K = inp.IKORO; const A = inp.AMASIRI;

/* ---- helpers for the WRONG methods only ---- */
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => sum(a) / a.length;
const present = (a) => a.filter((v) => v !== null && v !== undefined && !Number.isNaN(v));
const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const sdS = (a) => { const m = mean(a); return Math.sqrt(sum(a.map((v) => (v - m) ** 2)) / (a.length - 1)); };
const sdP = (a) => { const m = mean(a); return Math.sqrt(sum(a.map((v) => (v - m) ** 2)) / a.length); };

/* ---- shared scenario arithmetic ---- */
const rhob = O.log.rhob;
const steps = O.scada.minutes.slice(1).map((v, i) => v - O.scada.minutes[i]);
const wc = (i) => O.production.water[i] / (O.production.oil[i] + O.production.water[i]);
const cum = O.production.cumOil;
const core = K.core;
const coreMed = median(core);
const coreMad = median(core.map((v) => Math.abs(v - coreMed)));
const rh = present(K.rhob);
const window57 = (hw, missingAsZero = false) => {
  const w = [];
  for (let j = Math.max(0, 57 - hw); j < Math.min(K.rhob.length, 57 + hw + 1); j += 1) {
    const v = K.rhob[j];
    if (v === null) { if (missingAsZero) w.push(0); } else w.push(v);
  }
  return w;
};
const madOf = (w) => { const m = median(w); return median(w.map((v) => Math.abs(v - m))); };
const phase1 = Q.individualsChart({ values: A.phase1 });
const ewmaArgs = { values: A.phase2, lambda: A.lambda, target: phase1.centre, sigma: phase1.sigma, L: A.L };
const cusumArgs = { values: A.phase2, target: phase1.centre, k: A.k, h: A.h, units: 'sigma', sigma: phase1.sigma };
const ewmaFrom = (start, lam, wNew = lam) => { let e = start; const out = []; A.phase2.forEach((x) => { e = wNew * x + (1 - wNew) * e; out.push(e); }); return out; };
const maha = Q.mahalanobis({ rows: K.cloud });
const iMax = maha.d2.indexOf(Math.max(...maha.d2));

const ROUTES = {
  odudu_rhob_completeness: {
    truth: () => Q.completeness({ values: rhob }).completeness,
    wrong: {
      sentinels_counted_missing: () => Q.completeness({ values: rhob.map((v) => (v === -999.25 ? null : v)) }).completeness,
      only_the_long_run_counted: () => (rhob.length - 9) / rhob.length,
      missing_over_present: () => 1 - Q.completeness({ values: rhob }).missing / Q.completeness({ values: rhob }).present,
      null_fraction_quoted: () => Q.completeness({ values: rhob }).nullFraction,
    },
  },
  odudu_nphi_coverage: {
    truth: () => Q.coverage({ index: O.log.depth, values: O.log.nphi, start: O.log.coverageStart, end: O.log.coverageEnd, maxStep: O.log.maxStep }).coverage,
    wrong: {
      missing_values_ignored: () => Q.coverage({ index: O.log.depth, values: O.log.depth, start: O.log.coverageStart, end: O.log.coverageEnd, maxStep: O.log.maxStep }).coverage,
      max_step_one_foot: () => Q.coverage({ index: O.log.depth, values: O.log.nphi, start: O.log.coverageStart, end: O.log.coverageEnd, maxStep: 1 }).coverage,
      whole_log_interval: () => Q.coverage({ index: O.log.depth, values: O.log.nphi, start: O.log.depth[0], end: O.log.depth.at(-1), maxStep: O.log.maxStep }).coverage,
      fraction_of_samples_present: () => {
        const idx = O.log.depth.map((d, i) => i).filter((i) => O.log.depth[i] >= O.log.coverageStart && O.log.depth[i] <= O.log.coverageEnd);
        return idx.filter((i) => O.log.nphi[i] !== null).length / idx.length;
      },
    },
  },
  odudu_scada_expected_step_min: {
    truth: () => Q.indexCheck({ index: O.scada.minutes }).expectedStep,
    wrong: {
      mean_of_every_step: () => mean(steps),
      median_of_every_step: () => median(steps),
      median_of_absolute_steps: () => median(steps.map(Math.abs)),
      span_over_entries: () => (O.scada.minutes.at(-1) - O.scada.minutes[0]) / (O.scada.minutes.length - 1),
    },
  },
  odudu_water_cut_day23: {
    truth: () => Q.waterCutCheck({ waterCut: O.production.waterCut, oil: O.production.oil, water: O.production.water, tolerance: 1e-4 }).computed[22],
    wrong: {
      reported_value_quoted: () => O.production.waterCut[22],
      water_over_oil: () => O.production.water[22] / O.production.oil[22],
      oil_cut: () => 1 - wc(22),
      day_22_computed: () => wc(21),
      in_percent: () => 100 * wc(22),
    },
  },
  odudu_cumulative_drop_bbl: {
    truth: () => Q.cumulativeCheck({ cumulative: cum }).flags[0].drop,
    wrong: {
      against_day_36: () => cum[35] - cum[38],
      rise_to_day_40: () => cum[39] - cum[38],
      as_a_percent_of_day_37: () => (100 * (cum[36] - cum[38])) / cum[36],
      against_the_largest_before: () => Math.max(...present(cum.slice(0, 38))) - cum[38] + (cum[39] - cum[38]),
    },
  },
  odudu_phase_sum_allowed_day44_bbl_d: {
    truth: () => Q.phaseSumCheck({ parts: { oil: O.production.oil, water: O.production.water }, total: O.production.gross }).flags[0].allowed,
    wrong: {
      tolerance_on_the_sum: () => 0.005 * (O.production.oil[43] + O.production.water[43]),
      five_percent: () => 0.05 * O.production.gross[43],
      half_a_barrel: () => 0.5,
      tolerance_on_the_oil: () => 0.005 * O.production.oil[43],
    },
  },
  ikoro_core_max_abs_z: {
    truth: () => Q.zScores({ values: core }).maxAbsZ,
    wrong: {
      population_sd: () => Q.zScores({ values: core, sd: 'population' }).maxAbsZ,
      centred_on_the_median: () => Math.max(...core.map((v) => Math.abs(v - coreMed))) / sdS(core),
      the_ceiling_quoted: () => Q.zScores({ values: core }).maxPossibleAbsZ,
      leave_one_out: () => { const o = core.filter((_, i) => i !== 11); return Math.abs(core[11] - mean(o)) / sdS(o); },
    },
  },
  ikoro_core_max_abs_modified_z: {
    truth: () => Math.max(...Q.modifiedZScores({ values: core }).scores.map(Math.abs)),
    wrong: {
      reciprocal_of_1_4826: () => Math.max(...core.map((v) => (Math.abs(v - coreMed) / 1.4826) / coreMad)),
      mad_scaled_by_1_4826: () => Math.max(...core.map((v) => (0.6745 * Math.abs(v - coreMed)) / (1.4826 * coreMad))),
      mean_in_place_of_median: () => Math.max(...core.map((v) => (0.6745 * Math.abs(v - mean(core))) / coreMad)),
      sd_in_place_of_mad: () => Math.max(...core.map((v) => (0.6745 * Math.abs(v - coreMed)) / sdS(core))),
    },
  },
  ikoro_rhob_upper_fence_g_cm3: {
    truth: () => Q.iqrFences({ values: K.rhob }).upper,
    wrong: {
      r6_quartiles: () => Q.iqrFences({ values: K.rhob, method: 'R6' }).upper,
      r8_quartiles: () => Q.iqrFences({ values: K.rhob, method: 'R8' }).upper,
      outer_fence_k3: () => Q.iqrFences({ values: K.rhob, k: 3 }).upper,
      from_the_median: () => { const f = Q.iqrFences({ values: K.rhob }); return median(rh) + 1.5 * f.iqr; },
    },
  },
  ikoro_rhob_hampel_threshold_entry57_g_cm3: {
    truth: () => Q.hampel({ values: K.rhob, halfWindow: K.halfWindow, nSigma: K.nSigma }).points[57].threshold,
    wrong: {
      window_one_wider: () => 3 * 1.4826 * madOf(window57(4)),
      no_1_4826_scale: () => 3 * madOf(window57(3)),
      missing_read_as_zero: () => 3 * 1.4826 * madOf(window57(3, true)),
      whole_series_mad: () => 3 * 1.4826 * madOf(rh),
      two_sigma: () => 2 * 1.4826 * madOf(window57(3)),
    },
  },
  ikoro_core_grubbs_critical: {
    truth: () => Q.grubbsTest({ values: core, alpha: K.alpha }).critical,
    wrong: {
      one_sided_alpha_over_n: () => Q.grubbsTest({ values: core, alpha: K.alpha, side: 'max' }).critical,
      t_on_n_minus_1_df: () => {
        const n = core.length; const t = Q.studentTUpperQuantile(K.alpha / (2 * n), n - 1);
        return ((n - 1) / Math.sqrt(n)) * Math.sqrt((t * t) / (n - 1 + t * t));
      },
      alpha_not_divided_by_n: () => {
        const n = core.length; const t = Q.studentTUpperQuantile(K.alpha / 2, n - 2);
        return ((n - 1) / Math.sqrt(n)) * Math.sqrt((t * t) / (n - 2 + t * t));
      },
      the_ceiling_quoted: () => Q.grubbsTest({ values: core, alpha: K.alpha }).maxPossible,
    },
  },
  ikoro_max_mahalanobis_d2: {
    truth: () => Math.max(...Q.mahalanobis({ rows: K.cloud }).d2),
    wrong: {
      population_covariance: () => maha.d2[iMax] * ((K.cloud.length - 1) / K.cloud.length),
      distance_not_squared: () => Math.sqrt(maha.d2[iMax]),
      sum_of_squared_z: () => {
        const c0 = K.cloud.map((r) => r[0]); const c1 = K.cloud.map((r) => r[1]);
        return ((K.cloud[iMax][0] - mean(c0)) / sdS(c0)) ** 2 + ((K.cloud[iMax][1] - mean(c1)) / sdS(c1)) ** 2;
      },
      the_cutoff_quoted: () => maha.cutoff,
    },
  },
  amasiri_phase1_individuals_ucl_psig: {
    truth: () => Q.individualsChart({ values: A.phase1 }).ucl,
    wrong: {
      sample_sd_for_sigma: () => mean(A.phase1) + 3 * sdS(A.phase1),
      two_sigma: () => phase1.centre + 2 * phase1.sigma,
      d2_rounded_to_1_13: () => phase1.centre + 3 * (phase1.mrBar / 1.13),
      mrbar_over_n: () => phase1.centre + 3 * ((sum(phase1.movingRanges.slice(1)) / A.phase1.length) / 1.128),
    },
  },
  amasiri_phase1_mr_ucl_psig: {
    truth: () => Q.individualsChart({ values: A.phase1 }).mrUcl,
    wrong: {
      d4_as_three: () => 3 * phase1.mrBar,
      d4_times_sigma: () => 3.267 * phase1.sigma,
      three_sigma_above_mrbar: () => phase1.mrBar + 3 * phase1.sigma,
      d4_times_sample_sd: () => 3.267 * sdS(A.phase1),
    },
  },
  amasiri_ewma_day14_psig: {
    truth: () => Q.ewmaChart(ewmaArgs).ewma[13],
    wrong: {
      started_at_the_first_value: () => ewmaFrom(A.phase2[0], A.lambda)[13],
      weights_swapped: () => ewmaFrom(phase1.centre, A.lambda, 1 - A.lambda)[13],
      target_from_phase_two: () => ewmaFrom(mean(A.phase2), A.lambda)[13],
      lambda_0_3: () => ewmaFrom(phase1.centre, 0.3)[13],
    },
  },
  amasiri_ewma_exact_ucl_day2_psig: {
    truth: () => Q.ewmaChart({ ...ewmaArgs, limits: 'exact' }).points[1].ucl,
    wrong: {
      asymptotic_limit: () => Q.ewmaChart(ewmaArgs).points[1].ucl,
      exponent_t_for_2t: () => phase1.centre + A.L * phase1.sigma * Math.sqrt(A.lambda / (2 - A.lambda)) * Math.sqrt(1 - (1 - A.lambda) ** 2),
      day_counted_from_zero: () => Q.ewmaChart({ ...ewmaArgs, limits: 'exact' }).points[0].ucl,
      variance_lambda_over_2: () => phase1.centre + A.L * phase1.sigma * Math.sqrt(A.lambda / 2) * Math.sqrt(1 - (1 - A.lambda) ** 4),
    },
  },
  amasiri_cusum_upper_day18_psi: {
    truth: () => Q.cusumChart(cusumArgs).points[17].sHigh,
    wrong: {
      no_floor_at_zero: () => { let s = 0; for (let i = 0; i <= 17; i += 1) s += A.phase2[i] - phase1.centre - A.k * phase1.sigma; return s; },
      k_read_in_psi: () => Q.cusumChart({ ...cusumArgs, units: 'data', k: A.k, h: A.h * phase1.sigma }).points[17].sHigh,
      plain_cumulative_sum: () => Q.cusumChart(cusumArgs).points[17].cusum,
      target_from_phase_two: () => Q.cusumChart({ ...cusumArgs, target: mean(A.phase2) }).points[17].sHigh,
    },
  },
  amasiri_scorecard_total: {
    truth: () => Q.scorecard(A.scorecard).total,
    wrong: {
      equal_weights: () => Q.scorecard({ dimensions: A.scorecard.dimensions }).total,
      weights_not_normalised: () => sum(A.scorecard.dimensions.map((d) => A.scorecard.weights[d.name] * (1 - d.failed / d.checked))),
      pooled_failures: () => 1 - sum(A.scorecard.dimensions.map((d) => d.failed)) / sum(A.scorecard.dimensions.map((d) => d.checked)),
      weakest_score_quoted: () => { const s = Q.scorecard(A.scorecard); return s.dimensions.find((d) => d.name === s.weakest).score; },
    },
  },
};

let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
const report = [];
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
    const d = Math.abs(got - t);
    if (!Number.isFinite(got) || d > tol) {
      moved.push(name);
      const ratio = Number.isFinite(got) ? d / tol : Infinity;
      if (ratio < nearest) { nearest = ratio; nearestName = name; }
      report.push({ key, name, value: got });
    } else { blind.push(`${name} (off by ${d.toExponential(3)})`); }
  });
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
if (Object.keys(ROUTES).length !== 18 || totalWrong < 54) {
  console.log('REFUSED: a sweep with fewer than three wrong methods a field is not a sweep');
  process.exit(2);
}
if (SLACK !== 1) {
  console.log(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
// ST is imported so a wrong method may reach lib/stats; keep the binding live.
if (typeof ST.mean !== 'function') process.exit(2);
process.exit(weak ? 1 : 0);
