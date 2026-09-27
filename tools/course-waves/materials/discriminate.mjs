// THE DISCRIMINATE SWEEP over every SC3 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test. And the rule beside it: the
// OTHER SIDE of every reading the engine states in inventory.js (exact
// comparison where the engine compares at twelve significant digits, halves
// rounded downward, a class, band or Poisson target read exclusive, excess at
// the cover limit, a discount or spares tie taken the other way, an ABC tie by
// id descending, a stockout at equality, the service reorder point one draw
// high, the P90 read as the high figure) must NOT move any graded field at
// all, because the course never grades a reading.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). A route is
// READING-DEPENDENT if any stated reading moves it by any amount. The closest
// miss is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is the engine call materials_capstone.mjs makes,
// checked against fields.json. The wrong methods are the mistakes a learner
// makes:
//   * the ENGINE WITH ONE WRONG RULE (materials_loader.mjs VARIANTS), led by
//     the engine's own negative control list (negcontrol_inventory.sh): the
//     weights ignored, the ABC ranked lowest first, the EOQ without its factor
//     2, the holding rate taken as the holding cost, the incremental fixed cost
//     not carried, the lead-time variance left out of sigma, z at one less the
//     level, the fill target without one less the level, the Poisson loss off
//     by one, downtime without the days a year, holding on one spare fewer, the
//     write-down not over 100; and a few more;
//   * a few HAND READINGS (an item's own share for its cumulative share, the
//     plain EOQ at the list price, the break quantity), which live here among
//     the wrong methods and nowhere else.
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

const HERE = process.env.SC3_WAVE_DIR || '/root/cat-wip-materials';
const { I: G, variant } = await import(`${HERE}/materials_engine.mjs`);
const { CASES, READ, OPEN_READINGS } = await import(`${HERE}/materials_capstone.mjs`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e15 : 1;
const JSONOUT = process.argv.includes('--json');
const say = JSONOUT ? () => {} : console.log;
const VALUES = {};
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

const clone = (o) => JSON.parse(JSON.stringify(o));
const V = (name) => ({ kind: 'variant', name });
const H = (name, fn) => ({ kind: 'hand', name, fn });

const IG = CASES.IGBARIAM;
const OG = CASES.OGIDI;
const UM = CASES.UMUCHU;
const trim = IG.criticality.items.find((x) => x.id === 'IGB-V204');
const abc = () => G.abcClassification(clone(IG.abcClassification)).items.find((x) => x.id === 'IGB-C515');
const eo = IG.eoq;
const h = eo.holdingRate * eo.unitCost;
const q0 = OG.quantityDiscount;
const WRONG = {
  igbariam_trim_weighted_score: [V('criticality_weights_ignored'), V('criticality_not_over_score_max'), V('criticality_scores_summed'),
    H('weights_times_scores_over_one_hundred', () => IG.criticality.criteria.reduce((s, c) => s + (c.weight * trim.scores[c.id]) / 100, 0))],
  igbariam_inhibitor_cumulative_pct: [V('abc_ranked_lowest_first'), V('abc_value_without_unit_cost'),
    H('its_own_share', () => abc().sharePct),
    H('the_share_before_it', () => abc().cumulativePct - abc().sharePct)],
  igbariam_inhibitor_eoq: [V('eoq_without_factor_two'), V('eoq_holding_rate_as_holding_cost'),
    H('monthly_demand_in_the_formula', () => Math.sqrt((2 * eo.orderCost * (eo.annualDemand / 12)) / h)),
    H('the_rounded_quantity', () => Math.ceil(Math.sqrt((2 * eo.orderCost * eo.annualDemand) / h) / eo.rounding.multiple) * eo.rounding.multiple)],
  igbariam_inhibitor_relevant_cost: [V('eoq_costs_at_the_unrounded_quantity'), V('eoq_holding_on_whole_lot'), V('eoq_without_factor_two'), V('rounding_up_taken_as_nearest')],
  igbariam_inhibitor_rounding_penalty_pct: [V('eoq_holding_on_whole_lot'), V('rounding_up_taken_as_nearest'), V('eoq_without_factor_two'),
    H('the_quantity_difference_in_percent', () => { const r = G.eoq(clone(eo)); return (100 * (r.quantity - r.eoq)) / r.eoq; })],
  igbariam_total_write_down: [V('write_down_not_over_one_hundred'), V('write_down_on_quantity'), V('band_one_below'),
    H('the_whole_stock_value', () => G.slowMoving(clone(IG.slowMoving)).totalStockValue)],
  ogidi_tubing_discount_quantity: [V('discount_fixed_cost_not_carried'), V('discount_eoq_without_fixed_cost'),
    H('the_plain_eoq_at_the_list_price', () => Math.sqrt((2 * q0.orderCost * q0.annualDemand) / (q0.holdingRate * q0.breaks[0].unitPrice))),
    H('the_top_break_quantity', () => q0.breaks[q0.breaks.length - 1].minQuantity)],
  ogidi_tubing_discount_total_cost: [V('discount_fixed_cost_not_carried'), V('discount_incremental_priced_all_units'), V('discount_eoq_without_fixed_cost'),
    H('the_purchase_cost_alone', () => G.quantityDiscount(clone(q0)).candidates[2].purchaseCost)],
  ogidi_filter_csl_safety_stock: [V('sigma_without_lead_time_variance'), V('z_at_one_less_the_level'), V('safety_stock_not_scaled_by_sigma'), V('sigma_sd_times_period')],
  ogidi_filter_fill_rate_k: [V('fill_target_without_one_less_the_level'), V('fill_rate_read_as_cycle_service'), V('sigma_without_lead_time_variance'), V('sigma_sd_times_period')],
  ogidi_filter_periodic_level: [V('review_period_left_out'), V('z_at_one_less_the_level'), V('sigma_sd_times_period'), V('safety_stock_not_scaled_by_sigma')],
  ogidi_kit_poisson_short: [V('poisson_loss_off_by_one'), V('poisson_mean_without_review'), V('poisson_fill_limit_at_the_level')],
  umuchu_motor_total_cost: [V('insurance_downtime_without_days'), V('insurance_holding_on_n_less_one'), V('insurance_holding_without_rate'),
    V('insurance_mean_without_lead_time'), V('insurance_mean_over_a_year_of_lead_time')],
  umuchu_motor_downtime_cost: [V('insurance_downtime_without_days'), V('insurance_holding_without_rate'), V('insurance_mean_without_lead_time'),
    V('insurance_mean_over_a_year_of_lead_time')],
  umuchu_motor_no_shortage: [V('insurance_downtime_without_days'), V('insurance_holding_without_rate'), V('insurance_mean_without_lead_time'),
    V('insurance_mean_over_a_year_of_lead_time')],
  umuchu_motor_fill_rate: [V('insurance_fill_rate_as_no_shortage'), V('insurance_downtime_without_days'), V('insurance_holding_without_rate'),
    V('insurance_mean_without_lead_time')],
  umuchu_seal_poisson_short: [V('poisson_loss_off_by_one'), V('poisson_mean_without_review'), V('poisson_fill_limit_at_the_level')],
  umuchu_seal_poisson_fill_rate: [V('poisson_loss_off_by_one'), V('poisson_mean_without_review'), V('poisson_fill_limit_at_the_level')],
};

// THE LEAD'S NAMED WRONG METHODS (the engine's negative control list) must each be aimed at, and move, at least one field.
const REQUIRED = ['criticality_weights_ignored', 'abc_ranked_lowest_first', 'eoq_without_factor_two', 'eoq_holding_rate_as_holding_cost',
  'discount_fixed_cost_not_carried', 'sigma_without_lead_time_variance', 'z_at_one_less_the_level', 'fill_target_without_one_less_the_level',
  'poisson_loss_off_by_one', 'insurance_downtime_without_days', 'insurance_holding_on_n_less_one', 'write_down_not_over_one_hundred'];

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
