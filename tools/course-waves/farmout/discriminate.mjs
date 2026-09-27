// THE DISCRIMINATE SWEEP over every EC10 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test. And the EC10 rule beside it: the
// OTHER SIDE of every reading the engine states in farmout.js (the costs of a
// valuation discounted a year, the day of the notification counted, the
// consent withdrawn on the ninetieth surcharge day) must NOT move any graded
// field at all, because the course never grades a reading.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). A route is
// READING-DEPENDENT if any stated reading moves it by any amount. The closest
// miss is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is the engine call farmout_capstone.mjs makes,
// checked against fields.json. The wrong methods are the mistakes a learner
// makes:
//   * the ENGINE WITH ONE WRONG RULE (ts_loader.mjs VARIANTS), led by the
//     engine's own negative control list (negcontrol_farmout.sh): the promote
//     ratio over the farmor's retained interest, the carry cap and the
//     gross-cost cap ignored, the overrun rules swapped, the cash bonus
//     counted twice, the whole past costs reimbursed, the dry-hole cost left
//     out, the break-even solved on the farmor's EMV or read off the wrong
//     side, the value per percent unrisked, the working-interest scaling
//     applied twice, the signal likelihoods swapped, the premium alone taken
//     as the fee;
//   * the ENGINE CALLED WITH A WRONG TERM (the carry with no uplift, recovered
//     from the whole share, carried in full; exploration refunded);
//   * a few HAND READINGS (the earned share paid, the promote points as the
//     ratio, the whole payment as the carry, the likelihood as the posterior,
//     the refund in equal parts), which live here among the wrong methods and
//     nowhere else.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e15 and must report EIGHTEEN
// WEAK ROUTES, proving the sweep reads the tolerances rather than printing a
// constant.
//
// Exit 0 clean, 1 if any route is WEAK or READING-DEPENDENT, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';

const HERE = process.env.EC10_WAVE_DIR || '/root/cat-wip-farmout';
const { F: G, variant } = await import(`${HERE}/farmout_engine.mjs`);
const { CASES, READ, OPEN_READINGS } = await import(`${HERE}/farmout_capstone.mjs`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e15 : 1;
const JSONOUT = process.argv.includes('--json');
const say = JSONOUT ? () => {} : console.log;
const VALUES = {};
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

const clone = (o) => JSON.parse(JSON.stringify(o));
const V = (name) => ({ kind: 'variant', name });
// A wrong TERM: the case with one stated input changed, run through the true engine.
const C = (name, patch) => ({ kind: 'term', name, patch });
const H = (name, fn) => ({ kind: 'hand', name, fn });

// Run a route on a patched copy of its case: CASES is shared with READ, so the
// patch is applied in place and undone.
const withCase = (cn, patch, fn) => {
  const saved = clone(CASES[cn]);
  patch(CASES[cn]);
  try { return fn(); } finally { Object.keys(CASES[cn]).forEach((k) => delete CASES[cn][k]); Object.assign(CASES[cn], saved); }
};
const set = (path, v) => (c) => { const ks = path.split('.'); let o = c; ks.slice(0, -1).forEach((k) => { o = o[k]; }); if (v === undefined) delete o[ks[ks.length - 1]]; else o[ks[ks.length - 1]] = v; };
const O = CASES.OGBAKU.earning;
const U = CASES.UMUNZE;
const A = CASES.AKPUGO;
const oev = O.events[0];
const pp = (ps, id) => ps.find((p) => p.id === id).participatingPct;
const oF = pp(O.parties, O.farmor);
const oC = oev.grossCost;
const oReimb = (O.pastCosts.amount * O.pastCosts.reimbursedPct) / 100;
const u1 = U.earning.events[0];
const u2 = () => U.earning.events[1];
const uF = pp(U.earning.parties, U.earning.farmor);
const aP = A.price.project;
const aS100 = aP.successValue.npv - aP.wellCost.success;
const aRisked100 = (aP.chanceOfSuccessPct / 100) * aS100 - (1 - aP.chanceOfSuccessPct / 100) * aP.wellCost.dry;
const WRONG = {
  ogbaku_ihe_well_payment: [
    H('pays_its_earned_share_only', () => (oev.earnedPct * oC) / 100),
    H('pays_the_promote_points_only', () => ((oev.farmineePaysPct - oev.earnedPct) * oC) / 100),
    H('its_share_of_the_farmors_interest', () => (oev.farmineePaysPct / 100) * (oF / 100) * oC),
    H('the_bonus_counted_in_the_payment', () => (oev.farmineePaysPct * oC) / 100 + O.cashBonus)],
  ogbaku_ogb_well_payment: [
    H('the_farmor_pays_its_post_deal_share', () => ((oF - oev.earnedPct) * oC) / 100),
    H('the_farmor_pays_its_whole_interest', () => (oF * oC) / 100),
    H('the_farmor_pays_the_promote', () => ((oev.farmineePaysPct - oev.earnedPct) * oC) / 100),
    H('the_bonus_taken_off_the_farmors_payment', () => ((oF - oev.farmineePaysPct) * oC) / 100 - O.cashBonus)],
  ogbaku_promote_ratio: [V('promote_ratio_over_retained'),
    H('the_points_as_the_ratio', () => oev.farmineePaysPct - oev.earnedPct),
    H('the_ratio_inverted', () => oev.earnedPct / oev.farmineePaysPct),
    H('the_ratio_over_the_farmors_interest', () => oev.farmineePaysPct / oF)],
  ogbaku_carry: [
    H('the_whole_payment_as_the_carry', () => (oev.farmineePaysPct * oC) / 100),
    H('the_carry_on_the_farmors_share', () => ((oev.farmineePaysPct - oev.earnedPct) / 100) * (oF / 100) * oC),
    H('the_farmors_payment_as_the_carry', () => ((oF - oev.farmineePaysPct) * oC) / 100)],
  ogbaku_consideration: [V('consideration_bonus_twice'), V('reimbursement_whole_past_costs'),
    H('the_carry_left_out', () => O.cashBonus + oReimb),
    H('the_whole_payment_counted', () => (oev.farmineePaysPct * oC) / 100 + O.cashBonus + oReimb)],
  ogbaku_equivalent_wi_pct: [V('equivalent_without_cash'), V('reimbursement_whole_past_costs'),
    H('the_share_paid_as_the_equivalent', () => oev.farmineePaysPct),
    H('the_outlay_over_the_farmors_share', () => (((oev.farmineePaysPct * oC) / 100 + O.cashBonus + oReimb) * 100) / ((oF * oC) / 100))],
  umunze_well1_amg_payment: [V('gross_cap_ignored'), V('overrun_rules_swapped'),
    H('the_excess_at_the_share_paid', () => (u1.farmineePaysPct * u1.grossCost) / 100 + 1),
    H('the_excess_at_the_farmors_interest', () => (u1.farmineePaysPct * u1.cap.amount) / 100 + (uF * (u1.grossCost - u1.cap.amount)) / 100)],
  umunze_well2_umz_payment: [V('carry_cap_ignored'),
    C('the_carry_cap_left_out', set('earning.events.1.cap', { on: 'none' })),
    H('the_farmor_pays_its_pre_deal_share_less_the_share_paid', () => ((uF - u2().farmineePaysPct) * u2().grossCost) / 100),
    H('the_events_own_interest', () => ((uF - u2().earnedPct) * u2().grossCost) / 100 - u2().cap.amount)],
  umunze_amg_emv: [V('farminee_no_dry_hole_cost'), V('bonus_double_counted'), V('deal_reimbursement_whole'), V('wi_scaled_twice_npv'), V('gross_cap_ignored')],
  umunze_breakeven_share_pct: [V('breakeven_on_farmor_emv'), V('farminee_no_dry_hole_cost'), V('bonus_double_counted'), V('deal_reimbursement_whole')],
  umunze_amg_breakeven_chance_pct: [V('breakeven_chance_wrong_side'), V('farminee_no_dry_hole_cost'), V('bonus_double_counted'), V('gross_cap_ignored')],
  umunze_consent_fee: [V('fee_premium_alone'),
    H('the_processing_fee_alone', () => (U.fee.transactionValue * 2) / 100),
    H('seven_per_cent_of_the_cash_bonus', () => (U.deal.deal.cashBonus * 7) / 100),
    H('seven_per_cent_of_the_bonus_and_the_reimbursement', () => ((U.deal.deal.cashBonus + (U.deal.deal.pastCosts.amount * U.deal.deal.pastCosts.reimbursedPct) / 100) * 7) / 100)],
  akpugo_ezi_evii: [V('voi_likelihoods_swapped'), V('farminee_no_dry_hole_cost'), V('bonus_double_counted'),
    H('the_evpi_as_the_evii', () => G.informationValue(clone(A.information)).evpi)],
  akpugo_strong_posterior_pct: [V('voi_likelihoods_swapped'),
    H('the_likelihood_as_the_posterior', () => A.information.information.signals[0].likelihoodsPct[0]),
    H('the_prior_unchanged', () => A.information.project.chanceOfSuccessPct),
    H('the_signal_chance_as_the_posterior', () => G.informationValue(clone(A.information)).perSignal[0].probability * 100)],
  akpugo_risked_value_per_pct: [V('risked_per_pct_unrisked'), V('position100_no_dry_hole'),
    H('the_success_value_per_percent_before_the_well', () => aP.successValue.npv / 100),
    H('the_risked_success_value_alone', () => ((aP.chanceOfSuccessPct / 100) * aP.successValue.npv) / 100)],
  akpugo_price_to_value: [V('price_on_unrisked_value'), V('position100_no_dry_hole'),
    H('the_price_over_the_100_percent_value', () => A.price.transaction.price / aRisked100),
    H('the_interest_left_out', () => A.price.transaction.price / (aRisked100 / 100))],
  akpugo_2035_carry_balance: [
    C('carry_recovered_without_uplift', set('devCarry.uplift', { type: 'none' })),
    C('recovered_from_the_whole_share', set('devCarry.recoverFromPct', 100)),
    C('carried_in_full', set('devCarry.carriedPct', 100))],
  akpugo_backin_refund_to_obr: [
    C('exploration_refunded', set('backIn.backIn.refundableKinds', ['development', 'production', 'exploration'])),
    H('the_refund_on_the_target_interest', () => { const r = G.backInRight(clone(A.backIn)); return (A.backIn.backIn.targetPct / 100) * r.refundable * (27.5 / 57); }),
    H('the_refund_in_equal_parts', () => G.backInRight(clone(A.backIn)).refund / 2),
    H('the_refund_on_the_licence_interest', () => (G.backInRight(clone(A.backIn)).refund * pp(A.backIn.parties, 'OBR')) / 100)],
};

// THE LEAD'S NAMED WRONG METHODS (the engine's negative control list) must each be aimed at, and move, at least one field.
const REQUIRED = ['promote_ratio_over_retained', 'carry_cap_ignored', 'gross_cap_ignored', 'bonus_double_counted', 'consideration_bonus_twice',
  'farminee_no_dry_hole_cost', 'position100_no_dry_hole', 'breakeven_on_farmor_emv', 'risked_per_pct_unrisked', 'price_on_unrisked_value',
  'wi_scaled_twice_npv', 'overrun_rules_swapped', 'breakeven_chance_wrong_side', 'voi_likelihoods_swapped'];

let weak = 0;
let dependent = 0;
let closest = { d: Infinity };
const moved = new Set();
for (const [key, [, , value, tol]] of Object.entries(fields)) {
  const [cn, get] = READ[key];
  const truth = get(G);
  if (truth !== value) { say(`REFUSED: ${key} truth ${truth} is not fields.json ${value}`); process.exit(2); }
  const out = [];
  VALUES[key] = { truth, wrong: {} };
  let moves = 0;
  let blind = 0;
  for (const w of WRONG[key] || []) {
    let v;
    try {
      if (w.kind === 'variant') v = get(await variant(w.name));
      else if (w.kind === 'term') v = withCase(cn, w.patch, () => get(G));
      else v = await w.fn(G);
    } catch (e) { out.push(`${w.name} REFUSED BY THE ENGINE (${String(e.message).slice(0, 60)})`); blind += 1; continue; }
    VALUES[key].wrong[w.name] = v;
    const d = Math.abs(v - truth) / tol;
    if (d > 1) { moves += 1; moved.add(w.name); } else blind += 1;
    if (d < closest.d) closest = { d, key, w: w.name };
    out.push(`${w.name} ${d.toExponential(2)}${d > 1 ? '' : ' BLIND'}`);
  }
  const readings = [];
  for (const rn of OPEN_READINGS) {
    const v = get(await variant(rn));
    readings.push(`${rn} ${Object.is(v, truth) ? 'identical' : `MOVES BY ${Math.abs(v - truth)}`}`);
    if (!Object.is(v, truth)) dependent += 1;
  }
  const isWeak = moves < 3 || blind > 0;
  if (isWeak) weak += 1;
  say(`${isWeak ? 'WEAK ' : 'ok   '} ${key}  (${moves} of ${(WRONG[key] || []).length} wrong methods move it)`);
  say(`        wrong, in tolerances: ${out.join('; ')}`);
  say(`        stated readings: ${readings.join('; ')}`);
}
const missing = REQUIRED.filter((n) => !moved.has(n));
say(`LEAD'S NAMED WRONG METHODS: ${REQUIRED.length - missing.length} of ${REQUIRED.length} aimed at a field and moving it${missing.length ? `; MISSING ${missing.join(', ')}` : ''}`);
say(`STATED READINGS: ${dependent} field-reading pair(s) move a graded value`);
say(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.w}, ${closest.d.toExponential(3)} tolerances away`);
if (SLACK !== 1) {
  say(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
say(`WEAK ROUTES: ${weak}; READING-DEPENDENT: ${dependent}`);
if (JSONOUT) process.stdout.write(`${JSON.stringify(VALUES)}\n`);
process.exit(weak || dependent || missing.length ? 1 : 0);
