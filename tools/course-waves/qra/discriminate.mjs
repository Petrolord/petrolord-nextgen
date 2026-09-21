// THE DISCRIMINATE SWEEP over every H5 capstone route.
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
// wrong methods are the mistakes a learner makes: the flash fire and explosion
// split swapped, delayed ignition taken as unconditional, one leaf read for a
// pooled outcome, a probability of death summed without its frequency, hours
// over 8766, occupancy ignored, f over N, one person's hours for the crew's,
// "more than N" for "N or more", a non-cumulative curve, the crossing at the
// previous corner, discounting from year 0, the growth rate ignored, the
// fatalities prevented discounted, the ICAF net of injuries. Wherever a wrong
// method can be expressed as a wrong INPUT, it is run THROUGH THE ENGINE with
// that input, so the wrong answer carries every other part of the method right.
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
import { Q } from './qra_engine.mjs';

const HERE = process.env.H5_WAVE_DIR || '/root/hse-wip-qra';
const SLACK = process.argv.includes('--slack-tolerances') ? 1e15 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The facilities come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/h5_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
const U = inp.UKPOKITI; const G = inp.OGINI; const E = inp.EBUGHU;
const sum = (a) => a.reduce((x, y) => x + y, 0);
const HOURS = 8760;

/* ============================================================ UKPOKITI */

const C = U.compressor;
const tree = (o = {}) => Q.flammableReleaseEventTree({ ...C, ...o }).outcomeTotalsPerYr;
const O = tree();
const sour = (t = U.sourGas.tree) => Q.eventTree({ initiatingFrequencyPerYr: U.sourGas.initiatingFrequencyPerYr, tree: t }).outcomeTotalsPerYr['camp exposure'];
const camp = sour();
const B = U.sourGas.tree.branches;
const f0s = U.sourGas.initiatingFrequencyPerYr;
const lsirOf = (place, freqs) => Q.locationIndividualRisk({
  scenarios: Object.entries(U.deathProbability[place]).map(([name, pd]) => ({ name, frequencyPerYr: freqs[name], fatalityProbability: pd })),
}).lsirPerYr;
const F_ALL = { ...O, 'camp exposure': camp };
const CR = lsirOf('controlRoom', F_ALL);
const DECK = lsirOf('compressorDeck', F_ALL);
const CAMP = lsirOf('camp', F_ALL);
const pdSum = (place) => sum(Object.values(U.deathProbability[place]));
const maxContribution = (place) => Math.max(...Object.entries(U.deathProbability[place]).map(([n, pd]) => F_ALL[n] * pd));
const withSwappedSplit = (place) => lsirOf(place, { ...tree({ vapourCloudSplit: { flashFire: 0.4, explosion: 0.6 } }), 'camp exposure': camp });
const flashAtOne = (place) => lsirOf(place, F_ALL) + F_ALL['flash fire'] * (1 - U.deathProbability[place]['flash fire']);
const releaseForEvery = (place) => C.initiatingFrequencyPerYr * pdSum(place);
const irpa = (locs) => Q.individualRiskPerAnnum({ locations: locs }).irpaPerYr;
const op = U.operator;
const opLocs = (h = HOURS) => [
  { name: 'deck', lsirPerYr: DECK, occupancyFraction: op.compressorDeckHoursPerYr / h },
  { name: 'cr', lsirPerYr: CR, occupancyFraction: op.controlRoomHoursPerYr / h },
  { name: 'camp', lsirPerYr: CAMP, occupancyFraction: op.campHoursPerYr / h },
];
const te = U.technician;

/* =============================================================== OGINI */

const pll = Q.potentialLossOfLife({ scenarios: G.crew }).pllPerYr;
const hours = G.crewPersons * G.crewHoursPerPersonPerYr;
const farOf = (p, h) => Q.fatalAccidentRateFromPll({ pllPerYr: p, exposedHoursPerYr: h }).far;
const V = G.village;
const Fge = (n) => sum(V.filter((s) => s.fatalities >= n).map((s) => s.frequencyPerYr));
const Fgt = (n) => sum(V.filter((s) => s.fatalities > n).map((s) => s.frequencyPerYr));
const Feq = (n) => sum(V.filter((s) => s.fatalities === n).map((s) => s.frequencyPerYr));
const vrom = Q.FN_CRITERIA['vrom-establishments'];
const line = (n, c = vrom.constantC, a = vrom.exponentAlpha) => c / n ** a;
const corners = [...new Set(V.filter((s) => s.fatalities >= vrom.minFatalities).map((s) => s.fatalities))].sort((a, b) => a - b);
const STEP = G.exceedanceStepEndsAtFatalities;
const prevCorner = [...new Set(V.filter((s) => s.fatalities > 0).map((s) => s.fatalities))].sort((a, b) => a - b).filter((n) => n < STEP).pop();
const POINT = Q.FN_CRITERIA['r2p2-para-136'].points[0];

/* ============================================================== EBUGHU */

const cb = (m, o = {}) => Q.costBenefit({ ...m, otherHarms: (m.otherHarms || []).map((h) => ({ ...h })), ...o });
const D = E.deluge; const W = E.blastWall; const GD = E.gasDetection;
const d = cb(D); const wl = cb(W); const gd = cb(GD);
const pvBenefitFromYear0 = (m, rate, growth = 0) => {
  const bpy = cb(m).benefitPerYr;
  return sum(Array.from({ length: m.lifetimeYears }, (_, t) => bpy * (1 + growth) ** (t + 1) / (1 + rate) ** t));
};
const harmsPerYr = (m) => sum((m.otherHarms || []).map((h) => h.expectedCasesPerYr * h.valuePerCase));

const ROUTES = {
  ukpokiti_compressor_explosion_frequency_per_yr: {
    truth: () => O.explosion,
    wrong: {
      split_swapped: () => tree({ vapourCloudSplit: { flashFire: 0.4, explosion: 0.6 } }).explosion,
      delayed_ignition_unconditional: () => C.initiatingFrequencyPerYr * C.delayedIgnitionProbability * 0.4,
      every_delayed_ignition_an_explosion: () => C.initiatingFrequencyPerYr * (1 - C.immediateIgnitionProbability) * C.delayedIgnitionProbability,
      immediate_probability_used_for_delayed: () => C.initiatingFrequencyPerYr * C.immediateIgnitionProbability * 0.4,
      flash_fire_reported: () => O['flash fire'],
      no_ignition_branch_used: () => C.initiatingFrequencyPerYr * (1 - C.immediateIgnitionProbability) * (1 - C.delayedIgnitionProbability) * 0.4,
    },
  },
  ukpokiti_camp_exposure_frequency_per_yr: {
    truth: () => camp,
    wrong: {
      late_isolation_leaf_only: () => f0s * B[1].probability * B[1].next.branches[0].probability,
      failed_isolation_leaf_only: () => f0s * B[2].probability * B[2].next.branches[0].probability,
      one_wind_probability_for_both: () => f0s * (B[1].probability + B[2].probability) * B[1].next.branches[0].probability,
      root_branch_forgotten: () => f0s * (B[1].next.branches[0].probability + B[2].next.branches[0].probability),
      complement_reported: () => Q.eventTree(U.sourGas).outcomeTotalsPerYr['no camp exposure'],
    },
  },
  ukpokiti_control_room_lsir_per_yr: {
    truth: () => CR,
    wrong: {
      pd_summed_without_frequency: () => pdSum('controlRoom'),
      largest_contribution_only: () => maxContribution('controlRoom'),
      flash_fire_at_pd_one: () => flashAtOne('controlRoom'),
      release_frequency_for_every_outcome: () => releaseForEvery('controlRoom'),
      split_swapped_upstream: () => withSwappedSplit('controlRoom'),
    },
  },
  ukpokiti_compressor_deck_lsir_per_yr: {
    truth: () => DECK,
    wrong: {
      pd_summed_without_frequency: () => pdSum('compressorDeck'),
      largest_contribution_only: () => maxContribution('compressorDeck'),
      release_frequency_for_every_outcome: () => releaseForEvery('compressorDeck'),
      split_swapped_upstream: () => withSwappedSplit('compressorDeck'),
      no_ignition_counted_at_deck_pd: () => DECK + O['no ignition'] * U.deathProbability.compressorDeck['jet or pool fire'],
    },
  },
  ukpokiti_operator_irpa_per_yr: {
    truth: () => irpa(opLocs()),
    wrong: {
      hours_over_8766: () => irpa(opLocs(8766)),
      occupancy_ignored: () => DECK + CR + CAMP,
      deck_only: () => DECK * op.compressorDeckHoursPerYr / HOURS,
      camp_forgotten: () => irpa(opLocs().slice(0, 2)),
      hours_over_a_2000_hour_working_year: () => (DECK * op.compressorDeckHoursPerYr + CR * op.controlRoomHoursPerYr + CAMP * op.campHoursPerYr) / 2000,
    },
  },
  ukpokiti_technician_irpa_per_yr: {
    truth: () => irpa([
      { name: 'deck', lsirPerYr: DECK, occupancyFraction: te.compressorDeckFraction },
      { name: 'cr', lsirPerYr: CR, hoursPerYr: te.controlRoomHoursPerYr },
      { name: 'camp', lsirPerYr: CAMP, hoursPerYr: te.campHoursPerYr },
    ]),
    wrong: {
      deck_fraction_read_as_hours: () => DECK * te.compressorDeckFraction / HOURS + (CR * te.controlRoomHoursPerYr + CAMP * te.campHoursPerYr) / HOURS,
      hours_over_8766: () => DECK * te.compressorDeckFraction + (CR * te.controlRoomHoursPerYr + CAMP * te.campHoursPerYr) / 8766,
      occupancy_ignored: () => DECK + CR + CAMP,
      deck_only: () => DECK * te.compressorDeckFraction,
      operator_hours_used: () => irpa(opLocs()),
    },
  },
  ogini_crew_pll_per_yr: {
    truth: () => pll,
    wrong: {
      f_over_n: () => sum(G.crew.filter((s) => s.fatalities > 0).map((s) => s.frequencyPerYr / s.fatalities)),
      n_ignored: () => sum(G.crew.map((s) => s.frequencyPerYr)),
      largest_contribution_only: () => Math.max(...G.crew.map((s) => s.frequencyPerYr * s.fatalities)),
      zero_scenario_counted_as_one: () => pll + G.crew.filter((s) => s.fatalities === 0).reduce((a, s) => a + s.frequencyPerYr, 0),
      n_rounded_to_whole: () => sum(G.crew.map((s) => s.frequencyPerYr * Math.round(s.fatalities))),
    },
  },
  ogini_crew_far: {
    truth: () => farOf(pll, hours),
    wrong: {
      one_persons_hours: () => farOf(pll, G.crewHoursPerPersonPerYr),
      base_one_million: () => farOf(pll, hours) / 100,
      calendar_hours_per_person: () => farOf(pll, G.crewPersons * HOURS),
      pll_over_hours_without_base: () => pll / hours,
      village_pll_used: () => farOf(Q.fnCurve({ scenarios: V }).expectedFatalitiesPerYr, hours),
    },
  },
  ogini_village_frequency_ten_or_more_per_yr: {
    truth: () => Fge(10),
    wrong: {
      more_than_ten: () => Fgt(10),
      exactly_ten_only: () => Feq(10),
      every_scenario_with_deaths: () => Fge(1e-9),
      expected_fatalities_reported: () => Q.fnCurve({ scenarios: V }).expectedFatalitiesPerYr,
      ten_or_fewer: () => sum(V.filter((s) => s.fatalities > 0 && s.fatalities <= 10).map((s) => s.frequencyPerYr)),
    },
  },
  ogini_village_vrom_max_ratio: {
    truth: () => Q.fnCriterionComparison({ scenarios: V, criterion: 'vrom-establishments' }).maxRatio,
    wrong: {
      ratio_at_ten_only: () => Fge(10) / line(10),
      non_cumulative_curve: () => Math.max(...corners.map((n) => Feq(n) / line(n))),
      more_than_n: () => Math.max(...corners.map((n) => Fgt(n) / line(n))),
      slope_one_line: () => Math.max(...corners.map((n) => Fge(n) / line(n, vrom.constantC, 1))),
      ratio_inverted: () => Math.min(...corners.map((n) => line(n) / Fge(n))),
    },
  },
  ogini_village_exceedance_from_fatalities: {
    truth: () => Q.fnCriterionComparison({ scenarios: V, criterion: 'vrom-establishments' }).exceedances.find((e) => e.fatalities === STEP).exceedsOverFatalities.from,
    wrong: {
      previous_corner: () => prevCorner,
      line_minimum: () => vrom.minFatalities,
      slope_one_crossing: () => vrom.constantC / Fge(STEP),
      non_cumulative_crossing: () => Math.sqrt(vrom.constantC / Feq(STEP)),
      crossing_of_the_previous_step: () => Math.sqrt(vrom.constantC / Fge(prevCorner)),
    },
  },
  ogini_village_r2p2_point_ratio: {
    truth: () => Q.fnCriterionComparison({ scenarios: V, criterion: 'r2p2-para-136' }).maxRatio,
    wrong: {
      non_cumulative_nearest_corner: () => Feq(STEP) / POINT.frequencyPerYr,
      largest_n_only: () => Feq(Math.max(...V.map((s) => s.fatalities))) / POINT.frequencyPerYr,
      frequency_of_ten_or_more: () => Fge(10) / POINT.frequencyPerYr,
      ratio_inverted: () => POINT.frequencyPerYr / Fge(POINT.fatalities),
      point_read_as_one_in_fifty_thousand: () => Fge(POINT.fatalities) / 2e-5,
    },
  },
  ebughu_deluge_cost_to_benefit_ratio: {
    truth: () => d.costToBenefitRatio,
    wrong: {
      undiscounted: () => cb(D, { benefitDiscountRate: 0, costDiscountRate: 0 }).costToBenefitRatio,
      benefits_at_the_cost_rate: () => cb(D, { benefitDiscountRate: D.costDiscountRate }).costToBenefitRatio,
      rates_swapped: () => cb(D, { benefitDiscountRate: D.costDiscountRate, costDiscountRate: D.benefitDiscountRate }).costToBenefitRatio,
      injuries_dropped: () => cb(D, { otherHarms: [] }).costToBenefitRatio,
      benefits_discounted_from_year_zero: () => d.presentValueCost / pvBenefitFromYear0(D, D.benefitDiscountRate),
    },
  },
  ebughu_deluge_icaf_gbp: {
    truth: () => d.costPerFatalityPrevented,
    wrong: {
      fatalities_discounted: () => d.presentValueCost / (d.presentValueBenefit * (d.fatalityBenefitPerYr / d.benefitPerYr) / D.vpf),
      cost_undiscounted: () => cb(D, { costDiscountRate: 0 }).costPerFatalityPrevented,
      net_of_injuries: () => (d.presentValueCost - harmsPerYr(D) * D.lifetimeYears) / d.fatalitiesPrevented,
      per_year_denominator: () => d.presentValueCost / D.deltaPllPerYr,
      capital_only: () => D.capitalCost / d.fatalitiesPrevented,
    },
  },
  ebughu_deluge_maximum_reasonably_practicable_cost_gbp: {
    truth: () => d.maximumReasonablyPracticableCost,
    wrong: {
      injuries_dropped: () => cb(D, { otherHarms: [] }).maximumReasonablyPracticableCost,
      benefit_undiscounted: () => cb(D, { benefitDiscountRate: 0 }).maximumReasonablyPracticableCost,
      benefit_at_the_cost_rate: () => cb(D, { benefitDiscountRate: D.costDiscountRate }).maximumReasonablyPracticableCost,
      df_applied_twice: () => D.disproportionFactor * d.maximumReasonablyPracticableCost,
      present_value_of_the_benefit_reported: () => d.presentValueBenefit,
    },
  },
  ebughu_blast_wall_cost_to_benefit_ratio: {
    truth: () => wl.costToBenefitRatio,
    wrong: {
      growth_ignored: () => cb(W, { benefitGrowthRate: 0 }).costToBenefitRatio,
      undiscounted: () => cb(W, { benefitDiscountRate: 0, costDiscountRate: 0, benefitGrowthRate: 0 }).costToBenefitRatio,
      growth_netted_off_the_rate: () => cb(W, { benefitDiscountRate: W.benefitDiscountRate - W.benefitGrowthRate, benefitGrowthRate: 0 }).costToBenefitRatio,
      benefits_discounted_from_year_zero: () => wl.presentValueCost / pvBenefitFromYear0(W, W.benefitDiscountRate, W.benefitGrowthRate),
      benefits_undiscounted_growth_kept: () => cb(W, { benefitDiscountRate: 0 }).costToBenefitRatio,
    },
  },
  ebughu_blast_wall_icaf_gbp: {
    truth: () => wl.costPerFatalityPrevented,
    wrong: {
      fatalities_discounted: () => wl.presentValueCost / (wl.presentValueBenefit / W.vpf),
      per_year_denominator: () => wl.presentValueCost / W.deltaPllPerYr,
      lifetime_minus_one: () => cb(W, { lifetimeYears: W.lifetimeYears - 1 }).costPerFatalityPrevented,
      fatalities_uprated_by_growth: () => wl.presentValueCost / sum(Array.from({ length: W.lifetimeYears }, (_, t) => W.deltaPllPerYr * (1 + W.benefitGrowthRate) ** (t + 1))),
      vpf_times_df_reported: () => W.vpf * W.disproportionFactor,
    },
  },
  ebughu_gas_detection_cost_to_benefit_ratio: {
    truth: () => gd.costToBenefitRatio,
    wrong: {
      annual_cost_ignored: () => cb(GD, { annualCost: 0 }).costToBenefitRatio,
      annual_cost_from_year_zero: () => (GD.capitalCost + GD.annualCost * (GD.lifetimeYears + 1)) / gd.presentValueBenefit,
      the_2001_vpf: () => cb(GD, { vpf: 1000000 }).costToBenefitRatio,
      checklist_rates_applied: () => cb(GD, { benefitDiscountRate: 0.015, costDiscountRate: 0.035 }).costToBenefitRatio,
      ratio_inverted: () => 1 / gd.costToBenefitRatio,
    },
  },
};

if (process.argv.includes('--names')) {
  process.stdout.write(`${JSON.stringify(Object.fromEntries(Object.entries(ROUTES).map(([k, r]) => [k, Object.keys(r.wrong)])))}\n`);
  process.exit(0);
}
let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
const report = [];
console.log('discriminate: every truth is an engine call; every wrong method that is a wrong input runs through the engine');
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
    const dd = Math.abs(got - t);
    if (!Number.isFinite(got) || dd > tol) {
      moved.push(name);
      const ratio = Number.isFinite(got) ? dd / tol : Infinity;
      if (ratio < nearest) { nearest = ratio; nearestName = name; }
      report.push({ key, name, value: got });
    } else { blind.push(`${name} (off by ${dd.toExponential(3)})`); }
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
if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(report)}\n`);
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
