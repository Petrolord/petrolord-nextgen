// THE DISCRIMINATE SWEEP over every H1 capstone route.
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
// The TRUTH of every route is an engine call. The wrong methods may use any
// arithmetic, because they are the mistakes a learner makes: the mean of rates,
// the wrong base, the chi-square degrees of freedom off by one, alpha not
// halved, the rule of three, the minlike p-value of R and scipy, two-sigma
// limits, limits from the average exposure, the centre as the mean of the
// monthly u values.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e9 and must report EIGHTEEN WEAK
// ROUTES, proving the sweep reads the tolerances rather than printing a
// constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.H1_WAVE_DIR || '/root/hse-wip-safetystats';
const ROOT = process.env.H1_ENGINES || '/root/wt-h1-nextgen/packages/engines';
const S = await import(`${ROOT}/engines/hse/safetyStats.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e9 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The scenarios come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/h1_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
const O = inp.OKRIKA; const B = inp.BONNY; const F = inp.FORCADOS;
const B2 = 200000; const B6 = 1000000; const B8 = 100000000;
const sum = (a) => a.reduce((x, y) => x + y, 0);
const Z = 1.959963984540054;

/* ---- helpers for the WRONG methods only ---- */
const logChoose = (n, k) => S.logGamma(n + 1) - S.logGamma(k + 1) - S.logGamma(n - k + 1);
const pmf = (n, k, p) => Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log1p(-p));
/** The minlike two-sided binomial p-value: R binom.test and scipy binomtest. */
const minlike = (k, n, p) => {
  const d = pmf(n, k, p);
  let s = 0;
  for (let j = 0; j <= n; j += 1) { const q = pmf(n, j, p); if (q <= d * (1 + 1e-7)) s += q; }
  return Math.min(1, s);
};
const phi = (x) => 0.5 * (1 + Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x / Math.PI))); // coarse, wrong-method only
const zTest = (c1, h1, c2, h2) => {
  const r1 = c1 / h1; const r2 = c2 / h2;
  const z = (r1 - r2) / Math.sqrt(c1 / h1 ** 2 + c2 / h2 ** 2);
  return 2 * (1 - phi(Math.abs(z)));
};
const waldRR = (c1, h1, c2, h2, sign) => ((c1 / h1) / (c2 / h2)) * Math.exp(sign * Z * Math.sqrt(1 / c1 + 1 / c2));
const cmp = (c1, h1, c2, h2, confidence = 0.95) => S.compareRates({
  count1: c1, exposureHours1: h1, count2: c2, exposureHours2: h2, confidence,
});
const ci = (count, hours, base, confidence) => S.rateConfidenceInterval({ count, exposureHours: hours, base, confidence });

/* ---- shared scenario arithmetic ---- */
const okHours = O.employeeHours + O.contractorHours;
const okRec = O.employeeRecordables + O.contractorRecordables;
const roll = (w) => S.rollingRate({ counts: O.monthlyRecordables, exposureHours: O.monthlyHours, base: B2, windowPeriods: w });
const chart = S.uChart({ counts: F.monthlyRecordables, exposureHours: F.monthlyHours, base: B2 });
const units = F.monthlyHours.map((h) => h / B2);
const ubar = chart.centre;
const meanU = sum(chart.points.map((p) => p.u)) / 12;
const nbar = sum(units) / 12;
const kept = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11];
const half = (idx) => [sum(idx.map((i) => F.monthlyRecordables[i])), sum(idx.map((i) => F.monthlyHours[i]))];
const [bc, bh] = half([0, 1, 2, 3, 4, 5]);
const [ac, ah] = half([6, 7, 8, 9, 10, 11]);
const [oc, oh] = half([0, 1, 2, 3, 4]);
const scaleA = B2 / B.alphaHours;
const scaleZ = B2 / B.crewHours;
const nA = B.alphaRecordables;

const ROUTES = {
  okrika_combined_trir_per_200k: {
    truth: () => S.pooledRate({ counts: [O.employeeRecordables, O.contractorRecordables], exposureHours: [O.employeeHours, O.contractorHours], base: B2 }).rate,
    wrong: {
      mean_of_the_two_workforce_rates: () => S.pooledRate({ counts: [O.employeeRecordables, O.contractorRecordables], exposureHours: [O.employeeHours, O.contractorHours], base: B2 }).meanOfPeriodRates,
      iogp_million_hour_base: () => S.incidenceRate({ count: okRec, exposureHours: okHours, base: B6 }).rate,
      contractors_only: () => S.incidenceRate({ count: O.contractorRecordables, exposureHours: O.contractorHours, base: B2 }).rate,
      employees_only: () => S.incidenceRate({ count: O.employeeRecordables, exposureHours: O.employeeHours, base: B2 }).rate,
      fatality_counted_twice: () => S.incidenceRate({ count: okRec + O.fatalities, exposureHours: okHours, base: B2 }).rate,
    },
  },
  okrika_combined_ltir_per_1m: {
    truth: () => S.incidenceRate({ count: O.lostTimeInjuries, exposureHours: okHours, base: B6 }).rate,
    wrong: {
      osha_200k_base: () => S.incidenceRate({ count: O.lostTimeInjuries, exposureHours: okHours, base: B2 }).rate,
      recordables_counted: () => S.incidenceRate({ count: okRec, exposureHours: okHours, base: B6 }).rate,
      fatality_added_again: () => S.incidenceRate({ count: O.lostTimeInjuries + O.fatalities, exposureHours: okHours, base: B6 }).rate,
      employee_hours_only: () => S.incidenceRate({ count: O.lostTimeInjuries, exposureHours: O.employeeHours, base: B6 }).rate,
    },
  },
  okrika_far_per_100m: {
    truth: () => S.fatalAccidentRate({ fatalities: O.fatalities, exposureHours: okHours }).rate,
    wrong: {
      million_hour_base: () => S.incidenceRate({ count: O.fatalities, exposureHours: okHours, base: B6 }).rate,
      osha_200k_base: () => S.incidenceRate({ count: O.fatalities, exposureHours: okHours, base: B2 }).rate,
      contractor_hours_only: () => S.fatalAccidentRate({ fatalities: O.fatalities, exposureHours: O.contractorHours }).rate,
      lost_time_count_used: () => S.fatalAccidentRate({ fatalities: O.lostTimeInjuries, exposureHours: okHours }).rate,
    },
  },
  okrika_severity_rate_per_200k: {
    truth: () => S.severityRate({ daysLost: O.daysLost, exposureHours: okHours, base: B2 }).rate,
    wrong: {
      days_per_lost_time_case: () => O.daysLost / O.lostTimeInjuries,
      million_hour_base: () => S.severityRate({ daysLost: O.daysLost, exposureHours: okHours, base: B6 }).rate,
      days_per_recordable: () => O.daysLost / okRec,
      employee_hours_only: () => S.severityRate({ daysLost: O.daysLost, exposureHours: O.employeeHours, base: B2 }).rate,
    },
  },
  okrika_tier1_pse_rate_per_200k: {
    truth: () => S.pseRate({ tier: 1, pseCount: O.tier1Pse, exposureHours: okHours, base: B2 }).rate,
    wrong: {
      million_hour_base: () => S.pseRate({ tier: 1, pseCount: O.tier1Pse, exposureHours: okHours, base: B6 }).rate,
      tier1_plus_tier2: () => S.pseRate({ tier: 1, pseCount: O.tier1Pse + O.tier2Pse, exposureHours: okHours, base: B2 }).rate,
      tier2_count_used: () => S.pseRate({ tier: 2, pseCount: O.tier2Pse, exposureHours: okHours, base: B2 }).rate,
      employee_hours_only: () => S.pseRate({ tier: 1, pseCount: O.tier1Pse, exposureHours: O.employeeHours, base: B2 }).rate,
    },
  },
  okrika_rolling12_trir_month14_per_200k: {
    truth: () => roll(12).windows[2].rate,
    wrong: {
      mean_of_the_monthly_rates: () => roll(12).windows[2].meanOfPeriodRates,
      the_calendar_year_window: () => roll(12).windows[0].rate,
      window_ending_at_month_thirteen: () => roll(12).windows[1].rate,
      eleven_month_window: () => roll(11).windows.at(-1).rate,
      thirteen_month_window: () => roll(13).windows.at(-1).rate,
    },
  },
  bonny_alpha_trir_lower95_per_200k: {
    truth: () => ci(nA, B.alphaHours, B2, 0.95).lower,
    wrong: {
      degrees_of_freedom_2n_plus_2: () => (S.chiSquareQuantile(0.025, 2 * nA + 2) / 2) * scaleA,
      alpha_not_halved: () => (S.chiSquareQuantile(0.05, 2 * nA) / 2) * scaleA,
      normal_approximation: () => (nA - Z * Math.sqrt(nA)) * scaleA,
      ninety_percent_confidence: () => ci(nA, B.alphaHours, B2, 0.90).lower,
      million_hour_base: () => ci(nA, B.alphaHours, B6, 0.95).lower,
    },
  },
  bonny_alpha_trir_upper95_per_200k: {
    truth: () => ci(nA, B.alphaHours, B2, 0.95).upper,
    wrong: {
      degrees_of_freedom_2n: () => (S.chiSquareQuantileUpper(0.025, 2 * nA) / 2) * scaleA,
      alpha_not_halved: () => (S.chiSquareQuantileUpper(0.05, 2 * nA + 2) / 2) * scaleA,
      normal_approximation: () => (nA + Z * Math.sqrt(nA)) * scaleA,
      ninety_nine_percent_confidence: () => ci(nA, B.alphaHours, B2, 0.99).upper,
      million_hour_base: () => ci(nA, B.alphaHours, B6, 0.95).upper,
    },
  },
  bonny_crew_zero_event_upper95_per_200k: {
    truth: () => ci(0, B.crewHours, B2, 0.95).upper,
    wrong: {
      rule_of_three: () => 3 * scaleZ,
      ninety_percent_central: () => ci(0, B.crewHours, B2, 0.90).upper,
      one_event_assumed: () => ci(1, B.crewHours, B2, 0.95).upper,
      million_hour_base: () => ci(0, B.crewHours, B6, 0.95).upper,
      point_estimate_quoted: () => 0,
    },
  },
  bonny_rate_ratio_lower95: {
    truth: () => cmp(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours).rateRatioLower,
    wrong: {
      alpha_not_halved: () => cmp(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours, 0.90).rateRatioLower,
      wald_log_interval: () => waldRR(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours, -1),
      groups_swapped: () => cmp(B.betaRecordables, B.betaHours, B.alphaRecordables, B.alphaHours).rateRatioLower,
      hours_ratio_ignored: () => cmp(B.alphaRecordables, 1, B.betaRecordables, 1).rateRatioLower,
    },
  },
  bonny_rate_ratio_upper95: {
    truth: () => cmp(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours).rateRatioUpper,
    wrong: {
      alpha_not_halved: () => cmp(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours, 0.90).rateRatioUpper,
      wald_log_interval: () => waldRR(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours, 1),
      groups_swapped: () => cmp(B.betaRecordables, B.betaHours, B.alphaRecordables, B.alphaHours).rateRatioUpper,
      hours_ratio_ignored: () => cmp(B.alphaRecordables, 1, B.betaRecordables, 1).rateRatioUpper,
    },
  },
  bonny_compare_p_value: {
    truth: () => cmp(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours).pValue,
    wrong: {
      minlike_convention: () => minlike(B.alphaRecordables, B.alphaRecordables + B.betaRecordables, B.alphaHours / (B.alphaHours + B.betaHours)),
      one_tail_not_doubled: () => {
        const r = cmp(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours);
        return Math.min(r.lowerTail, r.upperTail);
      },
      equal_hours_assumed: () => cmp(B.alphaRecordables, 1, B.betaRecordables, 1).pValue,
      normal_z_test: () => zTest(B.alphaRecordables, B.alphaHours, B.betaRecordables, B.betaHours),
    },
  },
  forcados_centre_per_200k: {
    truth: () => chart.centre,
    wrong: {
      mean_of_the_monthly_u: () => meanU,
      million_hour_base: () => S.uChart({ counts: F.monthlyRecordables, exposureHours: F.monthlyHours, base: B6 }).centre,
      median_of_the_monthly_u: () => { const s = chart.points.map((p) => p.u).sort((a, b) => a - b); return (s[5] + s[6]) / 2; },
      recordables_per_month: () => sum(F.monthlyRecordables) / 12,
    },
  },
  forcados_ucl_month09_per_200k: {
    truth: () => chart.points[8].ucl,
    wrong: {
      two_sigma_limits: () => ubar + 2 * Math.sqrt(ubar / units[8]),
      limits_from_the_average_exposure: () => ubar + 3 * Math.sqrt(ubar / nbar),
      centre_as_the_mean_of_u: () => meanU + 3 * Math.sqrt(meanU / units[8]),
      hours_not_converted_to_units: () => ubar + 3 * Math.sqrt(ubar / F.monthlyHours[8]),
    },
  },
  forcados_lcl_month07_per_200k: {
    truth: () => chart.points[6].lcl,
    wrong: {
      two_sigma_limits: () => ubar - 2 * Math.sqrt(ubar / units[6]),
      limits_from_the_average_exposure: () => ubar - 3 * Math.sqrt(ubar / nbar),
      centre_as_the_mean_of_u: () => meanU - 3 * Math.sqrt(meanU / units[6]),
      floored_by_habit: () => 0,
    },
  },
  forcados_revised_centre_per_200k: {
    truth: () => S.uChart({ counts: kept.map((i) => F.monthlyRecordables[i]), exposureHours: kept.map((i) => F.monthlyHours[i]), base: B2 }).centre,
    wrong: {
      not_revised: () => chart.centre,
      mean_of_the_kept_u: () => sum(kept.map((i) => chart.points[i].u)) / kept.length,
      events_dropped_hours_kept: () => (sum(kept.map((i) => F.monthlyRecordables[i])) / sum(units)),
      the_short_month_dropped_instead: () => {
        const k = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11];
        return S.uChart({ counts: k.map((i) => F.monthlyRecordables[i]), exposureHours: k.map((i) => F.monthlyHours[i]), base: B2 }).centre;
      },
    },
  },
  forcados_before_after_p_value: {
    truth: () => cmp(ac, ah, bc, bh).pValue,
    wrong: {
      minlike_convention: () => minlike(ac, ac + bc, ah / (ah + bh)),
      one_tail_not_doubled: () => { const r = cmp(ac, ah, bc, bh); return Math.min(r.lowerTail, r.upperTail); },
      equal_hours_assumed: () => cmp(ac, 1, bc, 1).pValue,
      month_six_removed: () => cmp(ac, ah, oc, oh).pValue,
      normal_z_test: () => zTest(ac, ah, bc, bh),
    },
  },
  forcados_before_after_p_value_without_month06: {
    truth: () => cmp(ac, ah, oc, oh).pValue,
    wrong: {
      month_six_left_in: () => cmp(ac, ah, bc, bh).pValue,
      month_six_events_dropped_hours_kept: () => cmp(ac, ah, oc, bh).pValue,
      minlike_convention: () => minlike(ac, ac + oc, ah / (ah + oh)),
      one_tail_not_doubled: () => { const r = cmp(ac, ah, oc, oh); return Math.min(r.lowerTail, r.upperTail); },
      equal_hours_assumed: () => cmp(ac, 1, oc, 1).pValue,
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
process.exit(weak ? 1 : 0);
