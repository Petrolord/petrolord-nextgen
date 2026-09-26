// THE DISCRIMINATE SWEEP over every EC9 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test. And the EC9 rule beside it: the
// OTHER SIDE of every reading the engine states (the PSC income tax on the
// contractor's revenue less all the year's costs, interest only from the end
// of a stated grace, the default cover by participating interest) must NOT
// move any graded field at all, because the course never grades a reading.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). A route is
// READING-DEPENDENT if any stated reading moves it by any amount. The closest
// miss is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is the engine call joa_capstone.mjs makes, checked
// against fields.json. The wrong methods are the mistakes a learner makes:
//   * the ENGINE WITH ONE WRONG RULE (ts_loader.mjs VARIANTS): paying and
//     beneficial interest swapped, a carry spread over every party, the
//     under- or over-call never carried to a later call, arrears never billed,
//     the budget tolerance the higher of two, overhead before the exclusions
//     or at each band's rate on the whole base, the uplift on the year's new
//     cost, the recovery share ignored, the carried cost on the paying
//     interest, exploration in the s.85(4) refund, the refund on the target
//     interest, the default covered in equal shares or with the defaulter in
//     the base, monthly compounding at the annual rate, the remaining days
//     dropped, the value date counted, the premium on the whole cost or on the
//     consenting parties' cost, reversion a period late, deductions not taken
//     off, the buy-in apportioned over 100, the NPV a year early, a gross
//     limit applied to revenue after royalty, a year's own contractor share
//     ignored, the forfeited interest apportioned over every party;
//   * the ENGINE CALLED WITH A WRONG TERM (the carry in full, the lag one
//     month off, the threshold dropped, the reference text's five percent,
//     no uplift, simple interest, the refund on a negative call, the opening
//     pool left out, the limit base swapped);
//   * a few HAND READINGS (equal carry shares, the tolerance on the actual
//     total, the refund in equal parts, a slab or first-band overhead rate, the above-band part dropped,
//     bonuses in the refund, the whole share covered, the premium above cost
//     alone, the buy-in in equal parts, the forfeited interest in equal parts
//     or to the operator alone), which live here among the wrong methods and
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

const HERE = process.env.EC9_WAVE_DIR || '/root/cat-wip-joa';
const { J: G, variant } = await import(`${HERE}/joa_engine.mjs`);
const { CASES, READ, OPEN_READINGS } = await import(`${HERE}/joa_capstone.mjs`);
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
const I = CASES.IDUMU;
const OKW = CASES.OKWELLE;
const AB = CASES.ABIAMA;
const pp = (ps, id) => ps.find((p) => p.id === id).participatingPct;
const idBase = (k) => I.overhead.costs[k] - (I.overhead.excluded[k] || 0);
const WRONG = {
  idumu_zed_paying_pct: [V('paying_is_beneficial'), V('carry_pro_rata_over_every_party'),
    H('carry_in_equal_shares', () => pp(I.interests.parties, 'ZED') + (pp(I.interests.parties, 'SNP') * 0.8) / 3),
    C('carried_in_full', set('interests.carries.0.carriedPct', 100))],
  idumu_zed_june_call: [V('paying_is_beneficial'), V('adjustment_not_carried'), V('carry_pro_rata_over_every_party'),
    C('lag_two_months', set('cashCalls.reconciliationLagMonths', 2))],
  idumu_zed_august_paid: [V('arrears_not_billed'), V('adjustment_not_carried'), V('paying_is_beneficial'),
    C('threshold_dropped', set('cashCalls.noCallBelow', undefined))],
  idumu_budget_allowed_overrun: [V('budget_tolerance_higher'),
    H('percentage_of_the_actual_total', () => (I.budget.items.reduce((s, x) => s + x.actual, 0) * I.budget.budgetTolerance.pct) / 100),
    C('the_reference_texts_five_percent', set('budget.budgetTolerance.pct', 5))],
  idumu_operating_overhead: [V('overhead_exclusions_ignored'), V('overhead_whole_base_at_each_band_rate'),
    H('whole_base_at_the_rate_of_its_band', () => (idBase('operating') * I.overhead.scale.operating.bands[1].pct) / 100),
    H('whole_base_at_the_first_band_rate', () => (idBase('operating') * I.overhead.scale.operating.bands[0].pct) / 100)],
  idumu_development_overhead: [V('overhead_whole_base_at_each_band_rate'),
    H('whole_base_at_the_rate_above_the_bands', () => (idBase('development') * I.overhead.scale.development.abovePct) / 100),
    H('whole_base_at_the_first_band_rate', () => (idBase('development') * I.overhead.scale.development.bands[0].pct) / 100),
    H('the_part_above_the_last_band_dropped', () => I.overhead.scale.development.bands.reduce((s, b, i, a) => s + ((b.upTo - (i ? a[i - 1].upTo : 0)) * b.pct) / 100, 0))],
  okwelle_2031_carry_balance: [C('carry_recovered_without_uplift', set('carry.uplift', { type: 'none' })), V('uplift_on_new_cost'), V('recovery_share_ignored'), V('carried_cost_on_paying')],
  okwelle_backin_refund_to_pra: [V('pia_refund_includes_exploration'), V('refund_on_target_interest'),
    H('bonus_interest_and_markup_refunded', () => {
      const b = OKW.backIn; const cur = pp(b.parties, b.backInParty);
      const all = b.costs.filter((x) => x.kind !== 'exploration').reduce((s, x) => s + x.amount, 0);
      return ((b.targetPct - cur) / 100) * all * (pp(b.parties, 'PRA') / (100 - cur));
    }),
    H('refund_received_in_equal_parts', () => G.backIn(clone(OKW.backIn)).refund / 3)],
  okwelle_default_interest: [C('simple_interest', set('default.interest.interestMethod', 'simple')), V('monthly_rate_as_annual'), V('remaining_days_dropped'), V('value_date_counted')],
  okwelle_default_cover_oko: [V('cover_in_equal_shares'), V('defaulter_left_in_cover_base'),
    H('the_whole_share_of_the_call_covered', () => {
      const d = OKW.default; const share = (d.callTotal * pp(d.parties, 'PRA')) / 100;
      return (share * pp(d.parties, 'OKO')) / (100 - pp(d.parties, 'PRA'));
    })],
  okwelle_prb_june_call: [V('adjustment_not_carried'), V('paying_is_beneficial'),
    C('lag_one_month', set('cashCalls.reconciliationLagMonths', 1)), C('negative_call_refunded', set('cashCalls.negativeCall', 'refund'))],
  okwelle_2032_cost_recovered: [V('psc_gross_limit_on_after_royalty'), C('opening_pool_left_out', set('psc.openingCostPool', 0)),
    H('the_years_costs_recovered_whole', () => { const y = OKW.psc.years.find((x) => x.year === 2032); return y.capex + y.opex; })],
  abiama_spb_premium: [V('premium_on_whole_cost'), V('premium_on_consenting_cost'),
    H('the_premium_above_the_cost_alone', () => (AB.soleRisk.operation.cost * pp(AB.soleRisk.parties, 'SPB') * (AB.soleRisk.premiumMultiplePct - 100)) / 10000)],
  abiama_spb_2036_receipt: [V('reversion_one_period_late'), V('deductions_not_taken_off'), V('premium_on_whole_cost'), V('premium_on_consenting_cost')],
  abiama_buy_in_to_spa: [V('buy_in_apportioned_over_100'), V('premium_on_whole_cost'),
    H('the_buy_in_in_equal_parts', () => (AB.buyIn.operation.cost * pp(AB.buyIn.parties, 'SNC') * AB.buyIn.premiumMultiplePct) / 10000 / 3)],
  abiama_spa_carry_npv: [V('npv_one_year_early'), C('carry_recovered_without_uplift', set('carry.uplift', { type: 'none' })), V('entitlement_on_paying'), V('paying_is_beneficial')],
  abiama_2035_government_profit_oil: [V('psc_year_share_ignored'), V('psc_gross_limit_on_after_royalty'),
    C('opening_pool_left_out', set('psc.openingCostPool', 0)), C('limit_base_swapped', set('psc.costOilLimitBase', 'after-royalty'))],
  abiama_abo_after_forfeiture_pct: [V('forfeiture_over_every_party'),
    H('the_forfeited_interest_in_equal_parts', () => pp(AB.default.parties, 'ABO') + pp(AB.default.parties, 'SPB') / 3),
    H('the_forfeited_interest_to_the_operator_alone', () => pp(AB.default.parties, 'ABO') + pp(AB.default.parties, 'SPB'))],
};

// THE LEAD'S NAMED WRONG METHODS must each be aimed at, and move, at least one field.
const REQUIRED = ['paying_is_beneficial', 'carry_recovered_without_uplift', 'adjustment_not_carried', 'overhead_exclusions_ignored',
  'overhead_whole_base_at_each_band_rate', 'cover_in_equal_shares', 'defaulter_left_in_cover_base', 'premium_on_whole_cost',
  'premium_on_consenting_cost', 'reversion_one_period_late', 'simple_interest'];

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
