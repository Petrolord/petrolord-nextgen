// THE DISCRIMINATE SWEEP over every SC2 capstone route.
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
// CALLED WRONGLY on the capstone data: the quoted total where the unit rate
// prevails, the highest omission rule, the failed bid pricing an omission, the
// discount left in, a credit for early completion, the linear price method,
// the absolute technical score, the weights swapped, the failed bid kept in
// Cmin, no life cycle, a sample standard deviation, the failed bid kept in the
// ALB test, the content pooled across units, the two s.14 readings swapped,
// the lead over the whole field, the P10 quoted for the P90, the mean for a
// percentile, the next seed, the contractor's part for the company's, the
// contingency dropped, the NPT at 0, the partners' total for the operator's,
// the lowest-cost award for the combined one. A few are hand arithmetic a
// learner might do instead of calling the engine (an unweighted mean of the
// scores, discounting from year 0, a relative lead over the leader, the share
// of the estimate taken as a percentage); they live here, among the wrong
// methods, and nowhere else.
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

const HERE = process.env.SC2_WAVE_DIR || '/root/cat-wip-procurement';
const { T, STATS } = await import(`${HERE}/tender_engine.mjs`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e12 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The datasets come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/sc2_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8, env: process.env }));
const clone = (o) => JSON.parse(JSON.stringify(o));

/* ---- helpers for the WRONG methods only ---- */
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => sum(a) / a.length;

/* ---- ONITSHA ---- */
const { tender: onTenderNo, scope: onScope, ...ON } = inp.ONITSHA;
const onRun = (o = {}) => T.evaluateTender({ ...clone(ON), ...o });
const onTrue = onRun();
const onBid = (id) => ON.bids.find((b) => b.id === id);
const onPassIds = onTrue.technical.passed;
const onEc = (o = {}, ids = onPassIds) => T.evaluatedCosts({ bids: clone(ON.bids.filter((b) => ids.includes(b.id)).map(({ scores, mandatory, ...r }) => r)), omissionRule: ON.omissionRule, schedule: clone(ON.schedule), ...o });
const onRow = (r, id) => r.bids.find((b) => b.id === id);
const onRank = (o = {}, rows = onTrue.commercial.bids) => T.rankTender({ technicalWeight: ON.technicalWeight, priceMethod: ON.priceMethod, technicalMethod: ON.technicalMethod,
  bids: rows.map((b) => ({ id: b.id, technicalPercent: onTrue.technical.bids.find((x) => x.id === b.id).technicalPercent, evaluatedCost: b.evaluatedCost, receivedAt: b.receivedAt })), ...o });
const on3 = onBid('ON3');
const onNitro = (ids) => ids.map((id) => T.correctArithmetic({ lines: clone(onBid(id).lines) }).lines.find((l) => l.id === 'nitrogen').correctedAmount);

/* ---- UMUAHIA ---- */
const UM = inp.UMUAHIA;
const umW = (b) => Object.fromEntries(b.lines.filter((l) => l.id !== 'inspection').map((l) => [l.id, l.quotedAmount]));
const umNc = (o = {}) => T.nigerianContent({ items: clone(UM.ncItems), bids: UM.bids.map((b) => ({ id: b.id, items: clone(b.nc), weights: umW(b) })), ...o });
const umPct = Object.fromEntries(umNc().bids.map((b) => [b.id, b.ncPct]));
const umBids = (pct = umPct) => UM.bids.map((b) => { const { nc, ...r } = clone(b); return { ...r, ncPct: pct[b.id] }; });
const umRun = (o = {}) => T.evaluateTender({ criteria: clone(UM.criteria), passMark: UM.passMark, omissionRule: UM.omissionRule, schedule: clone(UM.schedule), lifeCycle: clone(UM.lifeCycle), award: 'lowest-cost', bids: umBids(), nigerianContent: { ncLeadBasis: 'points' }, ...o });
const umTrue = umRun();
const umRow = (r, id) => r.commercial.bids.find((b) => b.id === id);
const umCosts = umTrue.commercial.bids.map((b) => b.evaluatedCost);
const umPref = (basis, bids) => T.contentPreference({ ncLeadBasis: basis, bids });
const umPrefBids = umTrue.commercial.bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost, receivedAt: b.receivedAt, ncPct: umPct[b.id] }));
const um2 = UM.bids.find((b) => b.id === 'UM2');
const umRate = UM.lifeCycle.discountRate;

/* ---- OKIGWE ---- */
const OK = inp.OKIGWE;
const okCt = (o = {}) => T.contractTypes({ ...clone(OK.contracting), ...o });
const okTrueCt = okCt();
const okT = (o = {}) => T.evaluateTender({ ...clone(OK.tender), ...o });
const okTrueT = okT();
const okSc = (o = {}, bids = okTrueT.commercial.bids) => T.shouldCost({ ...clone(OK.shouldCost), bids: bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost })), ...o });
const okTrueSc = okSc();

const ROUTES = {
  onitsha_on3_technical_percent: {
    truth: () => onTrue.technical.bids.find((b) => b.id === 'ON3').technicalPercent,
    wrong: {
      weighted_points_quoted: () => onTrue.technical.bids.find((b) => b.id === 'ON3').weightedPoints,
      unweighted_mean_of_the_scores: () => 100 * mean(Object.values(on3.scores)) / 5,
      weights_reversed: () => T.technicalEvaluation({ passMark: 0, criteria: ON.criteria.map((c, i, a) => ({ ...c, weight: a[a.length - 1 - i].weight })), bids: [{ id: on3.id, scores: clone(on3.scores) }] }).bids[0].technicalPercent,
      scores_read_out_of_four: () => T.technicalEvaluation({ passMark: 0, criteria: ON.criteria.map((c) => ({ ...c, maxScore: 4 })), bids: [{ id: on3.id, scores: Object.fromEntries(Object.entries(on3.scores).map(([k, v]) => [k, Math.min(4, v)])) }] }).bids[0].technicalPercent,
      the_top_bid_s_relative_score: () => onRank().bids.find((b) => b.id === 'ON3').technicalScore,
    },
  },
  onitsha_on2_corrected_price: {
    truth: () => onRow(onTrue.commercial, 'ON2').correctedPrice,
    wrong: {
      quoted_total_governs: () => onRow(onTrue.commercial, 'ON2').quotedTotal,
      the_deviation_added: () => onRow(onTrue.commercial, 'ON2').correctedPrice + onRow(onTrue.commercial, 'ON2').deviationTotal,
      the_evaluated_cost_quoted: () => onRow(onTrue.commercial, 'ON2').evaluatedCost,
      the_quoted_amount_governs_every_line: () => T.correctArithmetic({ lines: clone(onBid('ON2').lines).map((l) => ({ ...l, decimalMisplaced: true })) }).correctedTotal,
    },
  },
  onitsha_on3_omission_amount: {
    truth: () => onRow(onTrue.commercial, 'ON3').omissions[0].amount,
    wrong: {
      highest_rule: () => onRow(onEc({ omissionRule: 'highest' }), 'ON3').omissions[0].amount,
      the_failed_bid_prices_it: () => onRow(onEc({}, [...onPassIds, 'ON4']), 'ON3').omissions[0].amount,
      the_excluded_bids_price_it: () => mean(onNitro(['ON1', 'ON2', 'ON4', 'ON5', 'ON6'])),
      the_lowest_price: () => Math.min(...onNitro(['ON1', 'ON2', 'ON5'])),
      the_median_price: () => [...onNitro(['ON1', 'ON2', 'ON5'])].sort((a, b) => a - b)[1],
    },
  },
  onitsha_on1_evaluated_cost: {
    truth: () => onRow(onTrue.commercial, 'ON1').evaluatedCost,
    wrong: {
      discount_not_deducted: () => onRow(onTrue.commercial, 'ON1').correctedPrice,
      credit_for_early_completion: () => { const r = onRow(onTrue.commercial, 'ON1'); const net = r.correctedPrice - r.discount; return net + ON.schedule.ratePerWeek * (onBid('ON1').completionWeeks - ON.schedule.minWeeks) * net; },
      the_discount_deducted_twice: () => onRow(onTrue.commercial, 'ON1').evaluatedCost - onBid('ON1').discount,
      the_rate_on_every_week: () => { const r = onRow(onTrue.commercial, 'ON1'); const net = r.correctedPrice - r.discount; return net + ON.schedule.ratePerWeek * onBid('ON1').completionWeeks * net; },
    },
  },
  onitsha_on2_commercial_score: {
    truth: () => onTrue.ranking.bids.find((b) => b.id === 'ON2').commercialScore,
    wrong: {
      linear_price_method: () => onRank({ priceMethod: 'linear' }).bids.find((b) => b.id === 'ON2').commercialScore,
      the_failed_bid_in_cmin: () => { const c4 = T.correctArithmetic({ lines: clone(onBid('ON4').lines) }).correctedTotal; return 100 * Math.min(c4, ...onTrue.commercial.bids.map((b) => b.evaluatedCost)) / onRow(onTrue.commercial, 'ON2').evaluatedCost; },
      the_quoted_totals_scored: () => { const q = onTrue.commercial.bids.map((b) => b.quotedTotal); return 100 * Math.min(...q) / onRow(onTrue.commercial, 'ON2').quotedTotal; },
      the_ratio_inverted: () => 100 * onRow(onTrue.commercial, 'ON2').evaluatedCost / onTrue.ranking.cMin,
      the_combined_score_quoted: () => onTrue.ranking.bids.find((b) => b.id === 'ON2').combinedScore,
    },
  },
  onitsha_top_combined_score: {
    truth: () => onTrue.ranking.bids[0].combinedScore,
    wrong: {
      weights_swapped: () => onRank({ technicalWeight: 1 - ON.technicalWeight }).bids.find((b) => b.id === onTrue.award).combinedScore,
      absolute_technical_method: () => onRank({ technicalMethod: 'absolute' }).bids.find((b) => b.id === onTrue.award).combinedScore,
      linear_price_method: () => onRank({ priceMethod: 'linear' }).bids.find((b) => b.id === onTrue.award).combinedScore,
      highest_omission_rule: () => onRun({ omissionRule: 'highest' }).ranking.bids.find((b) => b.id === onTrue.award).combinedScore,
      the_lowest_cost_bid_s_score: () => onTrue.ranking.bids.find((b) => b.id === onTrue.commercial.lowestEvaluatedCost).combinedScore,
    },
  },
  umuahia_um2_life_cycle_cost: {
    truth: () => umRow(umTrue, 'UM2').lifeCycleCost,
    wrong: {
      residual_not_credited: () => sum(um2.annualCosts.map((c, i) => c / (1 + umRate) ** (i + 1))),
      discounted_from_year_0: () => sum(um2.annualCosts.map((c, i) => (c - (i === um2.annualCosts.length - 1 ? um2.residualValue : 0)) / (1 + umRate) ** i)),
      undiscounted_sum: () => sum(um2.annualCosts) - um2.residualValue,
      residual_taken_off_undiscounted: () => sum(um2.annualCosts.map((c, i) => c / (1 + umRate) ** (i + 1))) - um2.residualValue,
      ten_percent_rate: () => umRow(umRun({ lifeCycle: { ...UM.lifeCycle, discountRate: 0.1 } }), 'UM2').lifeCycleCost,
    },
  },
  umuahia_um4_evaluated_cost: {
    truth: () => umRow(umTrue, 'UM4').evaluatedCost,
    wrong: {
      highest_omission_rule: () => umRow(umRun({ omissionRule: 'highest' }), 'UM4').evaluatedCost,
      no_life_cycle: () => { const r = umRow(umTrue, 'UM4'); return r.evaluatedCost - r.lifeCycleCost; },
      no_delivery_adjustment: () => { const r = umRow(umTrue, 'UM4'); return r.evaluatedCost - r.scheduleAdjustment; },
      the_omission_left_out: () => { const r = umRow(umTrue, 'UM4'); return r.evaluatedCost - r.omissionTotal; },
      the_failed_bid_prices_the_omission: () => { const b = T.evaluatedCosts({ bids: umBids().map(({ scores, mandatory, ncPct, indigenous, capacity, ...r }) => r), omissionRule: 'average', schedule: clone(UM.schedule), lifeCycle: clone(UM.lifeCycle) }); return b.bids.find((x) => x.id === 'UM4').evaluatedCost; },
    },
  },
  umuahia_alb_limit: {
    truth: () => T.abnormallyLow({ bids: umTrue.commercial.bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost })) }).limit,
    wrong: {
      sample_standard_deviation: () => mean(umCosts) - STATS.ss.sampleStandardDeviation(umCosts),
      the_failed_bid_kept: () => { const all = T.evaluatedCosts({ bids: umBids().map(({ scores, mandatory, ncPct, indigenous, capacity, ...r }) => r), omissionRule: 'average', schedule: clone(UM.schedule), lifeCycle: clone(UM.lifeCycle) }); return T.abnormallyLow({ bids: all.bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost })) }).limit; },
      two_standard_deviations: () => mean(umCosts) - 2 * STATS.standardDeviation(umCosts),
      the_mean_quoted: () => mean(umCosts),
      the_quoted_totals_used: () => { const q = umTrue.commercial.bids.map((b) => b.quotedTotal); return mean(q) - STATS.standardDeviation(q); },
    },
  },
  umuahia_um3_overall_content: {
    truth: () => umPct.UM3,
    wrong: {
      pooled_across_units: () => { const b = UM.bids.find((x) => x.id === 'UM3'); return 100 * sum(Object.values(b.nc).map((x) => x.nigerian)) / sum(Object.values(b.nc).map((x) => x.total)); },
      unweighted_mean_of_the_items: () => mean(umNc().bids.find((b) => b.id === 'UM3').items.map((x) => x.ncPct)),
      weighted_by_quantity: () => { const b = UM.bids.find((x) => x.id === 'UM3'); const its = umNc().bids.find((x) => x.id === 'UM3').items; return sum(its.map((x) => x.ncPct * b.nc[x.id].total)) / sum(its.map((x) => b.nc[x.id].total)); },
      the_casing_content_alone: () => umNc().bids.find((b) => b.id === 'UM3').items.find((x) => x.id === 'casing').ncPct,
      weighted_by_the_whole_bid_price: () => { const b = UM.bids.find((x) => x.id === 'UM3'); const its = umNc().bids.find((x) => x.id === 'UM3').items; const tot = b.lines.reduce((t, l) => t + l.quotedAmount, 0); return sum(its.map((x) => x.ncPct * umW(b)[x.id])) / tot; },
    },
  },
  umuahia_s14_lead_points: {
    truth: () => umTrue.contentPreference.section14.lead,
    wrong: {
      read_as_relative: () => umPref('relative', umPrefBids).section14.lead,
      lead_over_the_whole_field: () => { const s = [...umPrefBids].sort((a, b) => b.ncPct - a.ncPct); return s[0].ncPct - s[1].ncPct; },
      pooled_contents: () => { const p = Object.fromEntries(UM.bids.map((b) => [b.id, 100 * sum(Object.values(b.nc).map((x) => x.nigerian)) / sum(Object.values(b.nc).map((x) => x.total))])); return umPref('points', umPrefBids.map((b) => ({ ...b, ncPct: p[b.id] }))).section14.lead; },
      unweighted_contents: () => { const u = Object.fromEntries(umNc().bids.map((b) => [b.id, mean(b.items.map((x) => x.ncPct))])); return umPref('points', umPrefBids.map((b) => ({ ...b, ncPct: u[b.id] }))).section14.lead; },
    },
  },
  umuahia_s14_lead_relative: {
    truth: () => umPref('relative', umPrefBids).section14.lead,
    wrong: {
      read_as_points: () => umTrue.contentPreference.section14.lead,
      relative_to_the_leader: () => { const s = umTrue.contentPreference.section14; const top = umPct[s.leader]; const ru = umPct[s.runnerUp]; return 100 * (top - ru) / top; },
      lead_over_the_whole_field: () => { const s = [...umPrefBids].sort((a, b) => b.ncPct - a.ncPct); return 100 * (s[0].ncPct - s[1].ncPct) / s[1].ncPct; },
      ratio_not_less_one: () => { const s = umTrue.contentPreference.section14; return 100 * umPct[s.leader] / umPct[s.runnerUp]; },
    },
  },
  okigwe_dayrate_mean_cost: {
    truth: () => okTrueCt.types.dayRate.companyCost.mean,
    wrong: {
      next_seed: () => okCt({ seed: OK.contracting.seed + 1 }).types.dayRate.companyCost.mean,
      the_planned_payment: () => okTrueCt.types.dayRate.plannedPayment,
      the_p50: () => okTrueCt.types.dayRate.companyCost.p50,
      no_mobilisation_fee: () => okTrueCt.types.dayRate.companyCost.mean - OK.contracting.dayRate.mobilisationFee,
      the_contractor_cost_mean: () => okTrueCt.contractorCost.mean,
    },
  },
  okigwe_reimbursable_p90_cost: {
    truth: () => okTrueCt.types.reimbursable.companyCost.p90,
    wrong: {
      the_90th_percentile_quoted: () => okTrueCt.types.reimbursable.companyCost.p10,
      the_p50: () => okTrueCt.types.reimbursable.companyCost.p50,
      next_seed: () => okCt({ seed: OK.contracting.seed + 1 }).types.reimbursable.companyCost.p90,
      the_fee_left_out: () => okTrueCt.contractorCost.p90,
      the_mean: () => okTrueCt.types.reimbursable.companyCost.mean,
    },
  },
  okigwe_dayrate_company_pays: {
    truth: () => okTrueCt.types.dayRate.overrun.companyPays,
    wrong: {
      the_contractor_part: () => okTrueCt.types.dayRate.overrun.contractorAbsorbs,
      the_whole_expected_overrun: () => okTrueCt.overrun.expectedOverrun,
      next_seed: () => okCt({ seed: OK.contracting.seed + 1 }).types.dayRate.overrun.companyPays,
      the_share_quoted: () => okTrueCt.types.dayRate.overrun.companyShare,
      the_reimbursable_company_part: () => okTrueCt.types.reimbursable.overrun.companyPays,
    },
  },
  okigwe_should_cost_estimate: {
    truth: () => okTrueSc.estimate,
    wrong: {
      contingency_dropped: () => okTrueSc.baseUsd,
      npt_at_zero: () => okSc({ nptFrac: 0 }).estimate,
      npt_at_the_maximum: () => okSc({ nptFrac: OK.contracting.duration.nptFrac.max }).estimate,
      contingency_on_the_per_day_items_only: () => { const perDay = OK.shouldCost.items.filter((i) => i.basis === 'per-day').reduce((s, i) => s + i.rate, 0); return okTrueSc.baseUsd + OK.shouldCost.contingencyFrac * perDay * okTrueSc.totalDays; },
      the_lump_sum_price: () => OK.contracting.lumpSum.price,
    },
  },
  okigwe_operator_amount: {
    truth: () => okTrueSc.split.operatorAmount,
    wrong: {
      the_partners_total: () => sum(okTrueSc.split.partners.map((p) => p.shareAmount)),
      the_larger_partner_s_share: () => Math.max(...okTrueSc.split.partners.map((p) => p.shareAmount)),
      contingency_dropped: () => okTrueSc.baseUsd * okTrueSc.split.operatorShare / 100,
      the_whole_estimate: () => okTrueSc.estimate,
    },
  },
  okigwe_award_ratio: {
    truth: () => okTrueSc.bids.find((b) => b.id === okTrueT.award).ratio,
    wrong: {
      lowest_cost_award: () => okTrueSc.bids.find((b) => b.id === okTrueT.commercial.lowestEvaluatedCost).ratio,
      inverted: () => 1 / okTrueSc.bids.find((b) => b.id === okTrueT.award).ratio,
      against_the_base_without_contingency: () => okTrueT.commercial.bids.find((b) => b.id === okTrueT.award).evaluatedCost / okTrueSc.baseUsd,
      the_quoted_total: () => okTrueT.commercial.bids.find((b) => b.id === okTrueT.award).quotedTotal / okTrueSc.estimate,
      against_the_lump_sum: () => okTrueT.commercial.bids.find((b) => b.id === okTrueT.award).evaluatedCost / OK.contracting.lumpSum.price,
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
    if (d > tol) {
      moved.push(name);
      const ratio = d / tol;
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
