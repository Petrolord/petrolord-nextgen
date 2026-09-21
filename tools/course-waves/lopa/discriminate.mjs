// THE DISCRIMINATE SWEEP over every H3 capstone route.
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
// wrong methods may use any arithmetic, because they are the mistakes a learner
// makes: the /2 dropped in 1oo1, no (1 - beta) on the independent rate, 6 read
// as 3 in 2oo3, T/2 used for the group down time, MRT or proof test coverage
// ignored, beta applied to 2oo2, an exact decade put in the higher SIL, a
// non-independent IPL credited, an enabling condition forgotten.
//
// THE WRONG-METHOD CALCULATOR. The formula mutations need an Annex B written
// here, independently of the engine, with a switch per mistake. Before it is
// allowed to produce a single wrong answer it must reproduce the ENGINE, with
// every switch off, on every capstone subsystem at 1e-12 relative, and its own
// bisection must reproduce the engine's longest interval at 1e-9 relative. A
// calculator that cannot produce the right answer produces no wrong ones.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//   node discriminate.mjs --values             also print every wrong value
//
// The control multiplies every tolerance by 1e15 and must report EIGHTEEN WEAK
// ROUTES, proving the sweep reads the tolerances rather than printing a
// constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.H3_WAVE_DIR || '/root/hse-wip-lopa';
const ROOT = process.env.H3_ENGINES || '/root/wt-h3-nextgen/packages/engines';
const L = await import(`${ROOT}/engines/hse/lopa.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e15 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The scenarios come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/h3_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
const A = inp.AKPO; const U = inp.USAN; const Y = inp.YOHO;

/* ============================================ the wrong-method calculator */

/**
 * Annex B low-demand PFDavg, written here from the equations, with a switch
 * for every mistake the sweep aims. All switches off is the correct form.
 */
const annexB = (p, o = {}) => {
  const arch = p.architecture;
  const lDU = p.lambdaDuPerHour;
  const lDD = o.ddIgnored ? 0 : (p.lambdaDdPerHour || 0);
  const T1 = p.proofTestIntervalHours;
  const mrt = o.mrtIgnored ? 0 : (p.mrtHours || 0);
  const mttr = p.mttrHours || 0;
  const ptc = o.coverageIgnored ? 1 : (p.proofTestCoverage ?? 1);
  const T2 = p.lifetimeHours ?? T1;
  const redundant = ['1oo2', '2oo3', '1oo3'].includes(arch);
  const b = redundant || o.betaOn2oo2 ? (p.beta || 0) : 0;
  const bD = redundant || o.betaOn2oo2 ? (o.betaDasBeta ? (p.beta || 0) : (p.betaD || 0)) : 0;
  const lD = lDU + lDD;
  const div = (j) => (o.noHalf1oo1 && j === 1 ? 1 : j + 1);
  const du = (j) => {
    const cov = T1 / div(j) + mrt;
    if (ptc === 1) return cov;
    const unc = (o.uncoveredAtFullLifetime ? T2 : T2 / div(j)) + mrt;
    return ptc * cov + (o.coveredOnly ? 0 : (1 - ptc) * unc);
  };
  const teq = (j) => (lDU / lD) * du(j) + (lDD / lD) * mttr;
  const tCE = o.ddAsDu ? T1 / 2 + mrt : teq(1);
  const tGE = teq(o.tgeAsHalf ? 1 : 2);
  const oneMinus = o.noOneMinusBeta ? 1 : null;
  const lInd = oneMinus ? lDD + lDU : (1 - bD) * lDD + (1 - b) * lDU;
  const ccfDU = b * lDU * (o.ccfAtFullInterval ? T1 + mrt : du(1));
  const ccf = ccfDU + bD * lDD * mttr;
  const m2oo3 = o.multiplicity3 ? 3 : 6;
  let ind;
  if (o.tr84) {
    const l = (1 - b) * lDU;
    if (arch === '1oo2') return l ** 2 * T1 ** 2 / 3 + b * lDU * T1 / 2;
    if (arch === '2oo3') return l ** 2 * T1 ** 2 + b * lDU * T1 / 2;
    return NaN;
  }
  switch (o.as || arch) {
    case '1oo1': ind = lD * tCE; break;
    case '2oo2': ind = (o.noFactor2 ? 1 : 2) * (o.oneMinusBetaOn2oo2 ? (1 - p.beta) * lDU + (1 - p.betaD) * lDD : lD) * tCE; break;
    case '1oo2': ind = 2 * lInd ** 2 * tCE * tGE; break;
    case '2oo3': ind = m2oo3 * lInd ** 2 * tCE * tGE; break;
    default: return NaN;
  }
  const withCcf = redundant || o.betaOn2oo2 || o.as === '1oo2';
  return ind + (withCcf ? ccf : 0);
};

/** Longest T1 with PFDavg <= target, by bisection on the calculator. */
const maxT = (p, target, o = {}) => {
  const at = (t) => annexB({ ...p, proofTestIntervalHours: t }, o);
  if (at(1e-9) >= target) return NaN;
  let lo = 0; let hi = 1;
  while (at(hi) <= target) { hi *= 2; if (hi > 1e12) return NaN; }
  for (let k = 0; k < 400 && hi - lo > 1e-13 * hi; k += 1) {
    const mid = (lo + hi) / 2;
    if (at(mid) <= target) lo = mid; else hi = mid;
  }
  return lo;
};
/** The T1-independent floor, t1 -> 0. */
const floorOf = (p, o = {}) => annexB({ ...p, proofTestIntervalHours: 0 }, o);

/* The calculator proves itself on every capstone subsystem before use. */
const SUBSYSTEMS = [U.transmitters, U.logicSolver, U.valves, U.proposed2oo2, Y.valves, Y.singleValve, Y.transmitter,
  Y.transmitters2oo3, Y.logicSolver];
SUBSYSTEMS.forEach((p) => {
  const e = L.pfdAvgSubsystem(p).pfdAvg;
  const c = annexB(p);
  if (!(Math.abs(c / e - 1) < 1e-12)) {
    console.log(`REFUSED: the wrong-method calculator does not reproduce the engine on ${p.architecture} (${c} against ${e})`);
    process.exit(2);
  }
});
[[Y.valves, Y.valveBudgetPfdAvg], [Y.singleValve, Y.singleValveTargetPfdAvg], [Y.transmitters2oo3, Y.transmitterBudgetPfdAvg]].forEach(([p, t]) => {
  const e = L.maxProofTestInterval(p, t).proofTestIntervalHours;
  const c = maxT(p, t);
  if (!(Math.abs(c / e - 1) < 1e-9)) {
    console.log(`REFUSED: the calculator's bisection does not reproduce the engine's longest interval (${c} against ${e})`);
    process.exit(2);
  }
});
{
  const e = L.maxProofTestInterval(Y.transmitter, Y.transmitterTargetPfdAvg).floorPfdAvg;
  if (!(Math.abs(floorOf(Y.transmitter) / e - 1) < 1e-12)) {
    console.log('REFUSED: the calculator does not reproduce the engine floor'); process.exit(2);
  }
}

/* ============================================ the LOPA wrong-method helpers */

const lopa = (s, extra = {}) => L.lopaScenario({
  initiatingEventFrequencyPerYr: s.initiatingEventFrequencyPerYr,
  enablingConditions: s.enablingConditions,
  conditionalModifiers: s.conditionalModifiers,
  ipls: s.ipls,
  tmelPerYr: s.tmelPerYr,
  ...extra,
});
const allIndependent = (ipls) => ipls.map((i) => ({ ...i, independent: true }));
const prod = (xs) => xs.reduce((a, x) => a * x.probability, 1);
const sumP = (xs) => xs.reduce((a, x) => a + x.probability, 0);

const S1 = A.separator; const S2 = A.tank; const S3 = A.compressor; const S4 = A.export;
const sifParts = (list) => list.map((p) => L.pfdAvgSubsystem(p).pfdAvg);
const usParts = sifParts([U.transmitters, U.logicSolver, U.valves]);
const usSum = usParts.reduce((a, x) => a + x, 0);
const usProd = usParts.reduce((a, x) => a * x, 1);
const usRow = U.lopaRow;
const usWithout = lopa(usRow).mitigatedFrequencyWithoutSifPerYr;
const stretch = (p) => ({ ...p, proofTestIntervalHours: Y.stretchedIntervalHours });
const yoParts1 = sifParts([Y.transmitters2oo3, Y.logicSolver, Y.valves]);
const yoParts3 = sifParts([stretch(Y.transmitters2oo3), stretch(Y.logicSolver), stretch(Y.valves)]);
const sum = (a) => a.reduce((x, y) => x + y, 0);

const ROUTES = {
  akpo_separator_unmitigated_frequency_per_yr: {
    truth: () => lopa(S1).unmitigatedFrequencyPerYr,
    wrong: {
      enabling_condition_forgotten: () => lopa({ ...S1, enablingConditions: [] }).unmitigatedFrequencyPerYr,
      modifiers_forgotten: () => lopa({ ...S1, conditionalModifiers: [] }).unmitigatedFrequencyPerYr,
      initiating_frequency_alone: () => S1.initiatingEventFrequencyPerYr,
      credited_ipl_applied: () => lopa(S1).mitigatedFrequencyWithoutSifPerYr,
      probabilities_summed: () => S1.initiatingEventFrequencyPerYr * (sumP(S1.enablingConditions) + sumP(S1.conditionalModifiers)),
    },
  },
  akpo_separator_required_rrf: {
    truth: () => lopa(S1).requiredRrf,
    wrong: {
      non_independent_ipl_credited: () => lopa({ ...S1, ipls: allIndependent(S1.ipls) }).requiredRrf,
      enabling_condition_forgotten: () => lopa({ ...S1, enablingConditions: [] }).requiredRrf,
      modifiers_forgotten: () => lopa({ ...S1, conditionalModifiers: [] }).requiredRrf,
      ratio_inverted: () => 1 / lopa(S1).requiredRrf,
      no_ipl_credited: () => lopa({ ...S1, ipls: [] }).requiredRrf,
    },
  },
  akpo_tank_mitigated_frequency_without_sif_per_yr: {
    truth: () => lopa(S2).mitigatedFrequencyWithoutSifPerYr,
    wrong: {
      non_independent_ipl_credited: () => lopa({ ...S2, ipls: allIndependent(S2.ipls) }).mitigatedFrequencyWithoutSifPerYr,
      enabling_conditions_forgotten: () => lopa({ ...S2, enablingConditions: [] }).mitigatedFrequencyWithoutSifPerYr,
      second_enabling_condition_forgotten: () => lopa({ ...S2, enablingConditions: S2.enablingConditions.slice(0, 1) }).mitigatedFrequencyWithoutSifPerYr,
      modifier_forgotten: () => lopa({ ...S2, conditionalModifiers: [] }).mitigatedFrequencyWithoutSifPerYr,
      ipls_not_applied: () => lopa(S2).unmitigatedFrequencyPerYr,
    },
  },
  akpo_tank_required_sif_pfdavg: {
    truth: () => lopa(S2).requiredSifPfdAvg,
    wrong: {
      required_rrf_reported: () => lopa(S2).requiredRrf,
      non_independent_ipl_credited: () => lopa({ ...S2, ipls: allIndependent(S2.ipls) }).requiredSifPfdAvg,
      band_ceiling_of_the_required_sil: () => L.SIL_BANDS_LOW_DEMAND.find((b) => b.sil === lopa(S2).requiredSil).pfdMax,
      band_floor_of_the_required_sil: () => L.SIL_BANDS_LOW_DEMAND.find((b) => b.sil === lopa(S2).requiredSil).pfdMin,
      enabling_conditions_forgotten: () => lopa({ ...S2, enablingConditions: [] }).requiredSifPfdAvg,
    },
  },
  akpo_compressor_mitigated_frequency_with_sif_per_yr: {
    truth: () => lopa(S3, { sifPfdAvg: S3.sifPfdAvg }).mitigatedFrequencyPerYr,
    wrong: {
      sif_not_applied: () => lopa(S3).mitigatedFrequencyWithoutSifPerYr,
      sif_at_the_sil_band_ceiling: () => lopa(S3, { sifPfdAvg: 0.01 }).mitigatedFrequencyPerYr,
      required_pfdavg_used_for_the_sif: () => lopa(S3, { sifPfdAvg: lopa(S3).requiredSifPfdAvg }).mitigatedFrequencyPerYr,
      fatal_injury_modifier_forgotten: () => lopa({ ...S3, conditionalModifiers: S3.conditionalModifiers.slice(0, 2) }, { sifPfdAvg: S3.sifPfdAvg }).mitigatedFrequencyPerYr,
      gas_detection_not_credited: () => lopa({ ...S3, ipls: [] }, { sifPfdAvg: S3.sifPfdAvg }).mitigatedFrequencyPerYr,
    },
  },
  akpo_export_catalogue_sif_mitigated_frequency_per_yr: {
    truth: () => lopa(S4, { sifPfdAvg: S4.catalogue.sil1 }).mitigatedFrequencyPerYr,
    wrong: {
      exact_decade_put_in_the_higher_sil: () => lopa(S4, { sifPfdAvg: S4.catalogue.sil2 }).mitigatedFrequencyPerYr,
      unsnapped_float_comparison: () => {
        const r = lopa(S4).requiredRrf;
        const sil = r > 1000 ? 3 : (r > 100 ? 2 : 1);
        return lopa(S4, { sifPfdAvg: S4.catalogue[`sil${sil}`] }).mitigatedFrequencyPerYr;
      },
      sif_not_applied: () => lopa(S4).mitigatedFrequencyWithoutSifPerYr,
      non_independent_ipl_credited: () => lopa({ ...S4, ipls: allIndependent(S4.ipls) }, { sifPfdAvg: S4.catalogue.sil1 }).mitigatedFrequencyPerYr,
      required_pfdavg_used_for_the_sif: () => lopa(S4, { sifPfdAvg: lopa(S4).requiredSifPfdAvg }).mitigatedFrequencyPerYr,
    },
  },
  usan_transmitters_2oo3_pfdavg: {
    truth: () => L.pfdAvgSubsystem(U.transmitters).pfdAvg,
    wrong: {
      multiplicity_three_for_six: () => annexB(U.transmitters, { multiplicity3: true }),
      no_one_minus_beta: () => annexB(U.transmitters, { noOneMinusBeta: true }),
      group_down_time_at_t_over_two: () => annexB(U.transmitters, { tgeAsHalf: true }),
      mrt_ignored: () => annexB(U.transmitters, { mrtIgnored: true }),
      detected_failures_ignored: () => annexB(U.transmitters, { ddIgnored: true }),
      tr84_simplified_form: () => annexB(U.transmitters, { tr84: true }),
      beta_used_for_betad: () => annexB(U.transmitters, { betaDasBeta: true }),
    },
  },
  usan_logic_solver_1oo1_pfdavg: {
    truth: () => L.pfdAvgSubsystem(U.logicSolver).pfdAvg,
    wrong: {
      half_dropped_in_1oo1: () => annexB(U.logicSolver, { noHalf1oo1: true }),
      mrt_ignored: () => annexB(U.logicSolver, { mrtIgnored: true }),
      detected_failures_ignored: () => annexB(U.logicSolver, { ddIgnored: true }),
      detected_failures_treated_as_undetected: () => annexB(U.logicSolver, { ddAsDu: true }),
    },
  },
  usan_valves_1oo2_pfdavg: {
    truth: () => L.pfdAvgSubsystem(U.valves).pfdAvg,
    wrong: {
      no_one_minus_beta: () => annexB(U.valves, { noOneMinusBeta: true }),
      group_down_time_at_t_over_two: () => annexB(U.valves, { tgeAsHalf: true }),
      mrt_ignored: () => annexB(U.valves, { mrtIgnored: true }),
      detected_failures_ignored: () => annexB(U.valves, { ddIgnored: true }),
      tr84_simplified_form: () => annexB(U.valves, { tr84: true }),
      common_cause_over_the_full_interval: () => annexB(U.valves, { ccfAtFullInterval: true }),
    },
  },
  usan_sif_rrf: {
    truth: () => L.pfdAvgSif([U.transmitters, U.logicSolver, U.valves]).rrf,
    wrong: {
      product_of_subsystem_pfdavg: () => 1 / usProd,
      weakest_subsystem_only: () => 1 / Math.max(...usParts),
      logic_solver_left_out: () => 1 / (usParts[0] + usParts[2]),
      sum_of_subsystem_rrfs: () => sum(usParts.map((x) => 1 / x)),
      valves_as_1oo1: () => 1 / (usParts[0] + usParts[1] + annexB({ ...U.valves, architecture: '1oo1' })),
    },
  },
  usan_proposed_2oo2_transmitters_pfdavg: {
    truth: () => L.pfdAvgSubsystem(U.proposed2oo2).pfdAvg,
    wrong: {
      beta_applied_to_2oo2: () => annexB(U.proposed2oo2, { betaOn2oo2: true }),
      one_minus_beta_applied_to_2oo2: () => annexB(U.proposed2oo2, { oneMinusBetaOn2oo2: true }),
      the_1oo2_formula: () => annexB({ ...U.proposed2oo2, architecture: '1oo2' }),
      the_1oo1_formula: () => annexB({ ...U.proposed2oo2, architecture: '1oo1' }),
      the_2oo3_result_reused: () => L.pfdAvgSubsystem(U.transmitters).pfdAvg,
    },
  },
  usan_mitigated_frequency_with_sif_per_yr: {
    truth: () => lopa(usRow, { sifPfdAvg: usSum }).mitigatedFrequencyPerYr,
    wrong: {
      sif_not_applied: () => usWithout,
      product_of_subsystem_pfdavg: () => usWithout * usProd,
      required_pfdavg_used_for_the_sif: () => usWithout * lopa(usRow).requiredSifPfdAvg,
      sil_band_ceiling_used: () => usWithout * 0.01,
      relief_not_credited: () => lopa({ ...usRow, ipls: [] }, { sifPfdAvg: usSum }).mitigatedFrequencyPerYr,
      valves_only: () => usWithout * usParts[2],
    },
  },
  yoho_valves_1oo2_max_interval_hours: {
    truth: () => L.maxProofTestInterval(Y.valves, Y.valveBudgetPfdAvg).proofTestIntervalHours,
    wrong: {
      group_down_time_at_t_over_two: () => maxT(Y.valves, Y.valveBudgetPfdAvg, { tgeAsHalf: true }),
      no_one_minus_beta: () => maxT(Y.valves, Y.valveBudgetPfdAvg, { noOneMinusBeta: true }),
      mrt_ignored: () => maxT(Y.valves, Y.valveBudgetPfdAvg, { mrtIgnored: true }),
      common_cause_over_the_full_interval: () => maxT(Y.valves, Y.valveBudgetPfdAvg, { ccfAtFullInterval: true }),
      budget_read_as_the_sil_band_ceiling: () => maxT(Y.valves, 0.01),
      linear_scaling_from_one_year: () => 8760 * Y.valveBudgetPfdAvg / annexB(Y.valves),
    },
  },
  yoho_valve_1oo1_ptc_pfdavg: {
    truth: () => L.pfdAvgSubsystem(Y.singleValve).pfdAvg,
    wrong: {
      coverage_ignored: () => annexB(Y.singleValve, { coverageIgnored: true }),
      uncovered_part_over_the_full_lifetime: () => annexB(Y.singleValve, { uncoveredAtFullLifetime: true }),
      mrt_ignored: () => annexB(Y.singleValve, { mrtIgnored: true }),
      covered_part_only: () => annexB(Y.singleValve, { coveredOnly: true }),
      half_dropped_in_1oo1: () => annexB(Y.singleValve, { noHalf1oo1: true }),
    },
  },
  yoho_valve_1oo1_ptc_max_interval_hours: {
    truth: () => L.maxProofTestInterval(Y.singleValve, Y.singleValveTargetPfdAvg).proofTestIntervalHours,
    wrong: {
      coverage_ignored: () => maxT(Y.singleValve, Y.singleValveTargetPfdAvg, { coverageIgnored: true }),
      uncovered_part_over_the_full_lifetime: () => maxT(Y.singleValve, Y.singleValveTargetPfdAvg, { uncoveredAtFullLifetime: true }),
      mrt_ignored: () => maxT(Y.singleValve, Y.singleValveTargetPfdAvg, { mrtIgnored: true }),
      covered_part_only: () => maxT(Y.singleValve, Y.singleValveTargetPfdAvg, { coveredOnly: true }),
      half_dropped_in_1oo1: () => maxT(Y.singleValve, Y.singleValveTargetPfdAvg, { noHalf1oo1: true }),
    },
  },
  yoho_transmitter_ptc_floor_pfdavg: {
    truth: () => L.maxProofTestInterval(Y.transmitter, Y.transmitterTargetPfdAvg).floorPfdAvg,
    wrong: {
      coverage_ignored: () => floorOf(Y.transmitter, { coverageIgnored: true }),
      uncovered_part_over_the_full_lifetime: () => floorOf(Y.transmitter, { uncoveredAtFullLifetime: true }),
      mrt_ignored: () => floorOf(Y.transmitter, { mrtIgnored: true }),
      detected_failures_left_out: () => floorOf(Y.transmitter, { ddIgnored: true }),
      the_one_year_pfdavg_reported: () => L.pfdAvgSubsystem(Y.transmitter).pfdAvg,
    },
  },
  yoho_sif_rrf_at_three_year_interval: {
    truth: () => L.pfdAvgSif([stretch(Y.transmitters2oo3), stretch(Y.logicSolver), stretch(Y.valves)]).rrf,
    wrong: {
      one_year_rrf_divided_by_three: () => 1 / (3 * sum(yoParts1)),
      only_the_valves_stretched: () => 1 / (yoParts1[0] + yoParts1[1] + yoParts3[2]),
      one_year_rrf_kept: () => 1 / sum(yoParts1),
      product_of_subsystem_pfdavg: () => 1 / yoParts3.reduce((a, x) => a * x, 1),
      logic_solver_left_out: () => 1 / (yoParts3[0] + yoParts3[2]),
    },
  },
  yoho_transmitters_2oo3_max_interval_hours: {
    truth: () => L.maxProofTestInterval(Y.transmitters2oo3, Y.transmitterBudgetPfdAvg).proofTestIntervalHours,
    wrong: {
      multiplicity_three_for_six: () => maxT(Y.transmitters2oo3, Y.transmitterBudgetPfdAvg, { multiplicity3: true }),
      no_one_minus_beta: () => maxT(Y.transmitters2oo3, Y.transmitterBudgetPfdAvg, { noOneMinusBeta: true }),
      group_down_time_at_t_over_two: () => maxT(Y.transmitters2oo3, Y.transmitterBudgetPfdAvg, { tgeAsHalf: true }),
      mrt_ignored: () => maxT(Y.transmitters2oo3, Y.transmitterBudgetPfdAvg, { mrtIgnored: true }),
      detected_failures_ignored: () => maxT(Y.transmitters2oo3, Y.transmitterBudgetPfdAvg, { ddIgnored: true }),
    },
  },
};

let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
const report = [];
console.log('discriminate: the wrong-method calculator reproduced the engine on 9 subsystems (1e-12), 3 longest intervals (1e-9) and 1 floor (1e-12)');
console.log('field                                                  tol        errors  moved  blind  closest miss (tolerances)');
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
  console.log(`${key.padEnd(54)} ${String(tol).padEnd(10)} ${String(moved.length + blind.length).padStart(6)} ${String(moved.length).padStart(6)} ${String(blind.length).padStart(6)}  ${nearest === Infinity ? 'all infinite' : nearest.toExponential(3)} (${nearestName})${isWeak ? '   WEAK' : ''}`);
  if (blind.length) console.log(`${' '.repeat(55)}BLIND TO: ${blind.join(', ')}`);
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
