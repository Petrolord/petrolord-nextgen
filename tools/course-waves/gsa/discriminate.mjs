// THE DISCRIMINATE SWEEP over every EC8 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test. And the EC8 rule beside it: the
// OTHER SIDE of every reading the engine states (the model formula's seller
// shortfall against the quantity taken, the make-up right as the whole
// deficiency, a last-year deficiency opening make-up, royalty on a deficiency
// payment) must NOT move any graded field at all, because the course never
// grades a reading; and no field may take the reported domestic base price.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). A route is
// READING-DEPENDENT if any stated reading moves it by any amount. The closest
// miss is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is the engine call gsa_capstone.mjs makes, checked
// against fields.json. The wrong methods are the mistakes a learner makes:
//   * the ENGINE WITH ONE WRONG RULE (ts_loader.mjs VARIANTS): take-or-pay on
//     the unadjusted ACQ, force majeure or the seller shortfall not netted,
//     make-up expiry a year late or early, make-up drawn newest first, the
//     deficiency or make-up gas at the contract price, the carry-forward cap
//     ignored, damages added to the seller, the refund at the contract price,
//     the nomination not capped, the tolerance ignored, force majeure not
//     excusing a gap, a buyer-caused gap counted, the lag dropped, the average
//     over one month too many, the reset ignored, an S-curve kink drawn wrong,
//     the Btu at 59 F, maintenance not netted, the end date counted, the effective
//     swing inverted, the DGDO rate at 3 or an agreement rate below 3.50
//     accepted, the in-country royalty share ignored, the NPV a year early;
//   * the ENGINE CALLED WITH A WRONG TERM (make-up taken before the year's
//     quantity, the other stated recovery order, the averaging window or the
//     lag one month off, the carry-forward base swapped);
//   * a few HAND READINGS (MJ per MMBtu rounded, a 365-day leap year, the swing factor alone, the
//     excuses ignored, royalty on the net to the seller), which live here
//     among the wrong methods and nowhere else.
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

const HERE = process.env.EC8_WAVE_DIR || '/root/cat-wip-gsa';
const { G, variant } = await import(`${HERE}/gsa_engine.mjs`);
const { CASES, READ, OPEN_READINGS, pricedContract } = await import(`${HERE}/gsa_capstone.mjs`);
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
const order = (o) => (c) => { c.contract ? (c.contract.makeUp.order = o) : (c.year.makeUp.order = o); };
const avg = (d) => (c) => { c.price.averagingMonths += d; };
const lag = (d) => (c) => { c.price.lagMonths += d; };
const cfBase = (b) => (c) => { c.contract.carryForward.base = b; };

const E_OZ = CASES.OZUBU.energy;
const WRONG = {
  ozubu_march_2028_mmbtu: [V('btu_59f'),
    H('mj_per_mmbtu_rounded_to_1055', () => E_OZ.quantity * 1e6 * E_OZ.heatingValue / 1055),
    H('mj_per_mmbtu_as_printed_1055_056', () => E_OZ.quantity * 1e6 * E_OZ.heatingValue / 1055.056),
    H('gigajoules_read_as_mmbtu', () => E_OZ.quantity * 1e6 * E_OZ.heatingValue / 1000)],
  ozubu_2028_acq: [V('end_date_counted'), H('three_hundred_sixty_five_days', () => CASES.OZUBU.quantities.dcq * 365),
    H('three_hundred_sixty_day_year', () => CASES.OZUBU.quantities.dcq * 360)],
  ozubu_effective_swing: [V('effective_swing_inverted'),
    H('swing_factor_alone', () => CASES.OZUBU.quantities.maxDcqPct / 100),
    H('swing_times_take_or_pay_fraction', () => (CASES.OZUBU.quantities.maxDcqPct / 100) * (CASES.OZUBU.quantities.topPct / 100))],
  ozubu_fortnight_buyer_shortfall: [V('tolerance_ignored'), V('fm_does_not_excuse_gap'), V('buyer_caused_counted')],
  ozubu_fortnight_seller_shortfall: [V('nomination_not_capped'), V('tolerance_ignored'), V('fm_does_not_excuse_gap'), V('buyer_caused_counted')],
  ozubu_2029_deficiency_payment: [V('top_on_unadjusted_acq'), V('fm_not_netted'), V('seller_shortfall_not_netted'), V('deficiency_at_contract_price')],
  ifeyi_2030_average_price: [V('lag_dropped'), V('average_over_one_more'), V('reset_ignored'), C('averaging_one_month_short', avg(-1)), C('lag_one_month_longer', lag(1))],
  ifeyi_2028_deficiency_payment: [V('top_on_unadjusted_acq'), V('fm_not_netted'), V('lag_dropped'), C('lag_one_month_longer', lag(1))],
  ifeyi_2031_make_up_taken: [C('make_up_taken_before_the_years_quantity', order('first')), C('make_up_after_the_take_or_pay_quantity', order('after-top-quantity')), V('expiry_one_year_early'), V('maintenance_not_netted')],
  ifeyi_2031_make_up_expired: [V('makeup_lifo'), V('expiry_one_year_late'), V('expiry_one_year_early'), C('make_up_taken_before_the_years_quantity', order('first'))],
  ifeyi_total_net_to_seller: [V('shortfall_damages_to_seller'), V('makeup_at_contract_price'), V('top_on_unadjusted_acq'), V('seller_shortfall_not_netted'), V('lag_dropped')],
  ifeyi_2031_dgdo_penalty: [V('dgdo_rate_three'), V('dgdo_agreement_below_minimum'),
    H('excuses_ignored', () => (CASES.IFEYI.dgdo.obligation - CASES.IFEYI.dgdo.delivered) * 3.5),
    H('voluntary_contracts_counted_as_delivered', () => Math.max(0, CASES.IFEYI.dgdo.obligation - CASES.IFEYI.dgdo.delivered - CASES.IFEYI.dgdo.voluntaryContracts) * 3.5)],
  nwaka_july_2029_price: [V('scurve_low_keeps_mid_slope'), V('scurve_low_not_anchored'), V('lag_dropped'), V('average_over_one_more'), C('lag_one_month_shorter', lag(-1))],
  nwaka_2034_average_price: [V('scurve_high_not_anchored'), V('reset_ignored'), V('lag_dropped'), C('averaging_one_month_short', avg(-1))],
  nwaka_2030_carry_forward_credit: [V('carry_forward_cap_ignored'), V('fm_not_netted'), V('top_on_unadjusted_acq'), C('carry_forward_base_swapped', cfBase('adjusted-acq'))],
  nwaka_2035_refund: [V('refund_at_contract_price'), V('seller_shortfall_not_netted'), C('make_up_taken_before_the_years_quantity', order('first')), C('make_up_after_the_adjusted_acq', order('after-adjusted-acq')), V('top_on_unadjusted_acq')],
  nwaka_npv_seller_revenue: [V('npv_one_year_early'), V('makeup_at_contract_price'), V('refund_at_contract_price'), V('carry_forward_cap_ignored'), V('scurve_low_keeps_mid_slope')],
  nwaka_2032_royalty: [V('royalty_share_ignored'), V('average_over_one_more'), V('lag_dropped'), V('reset_ignored'),
    H('royalty_on_the_net_to_the_seller', () => {
      const n = CASES.NWAKA;
      const cf = G.gsaCashFlows({ contract: pricedContract(G, n).contract, royalty: clone(n.royalty), discountRate: n.discountRate, baseYear: n.baseYear });
      const y = cf.years.find((x) => x.year === 2032);
      return y.royaltyRate * y.sellerRevenue;
    })],
};

// THE LEAD'S NAMED WRONG METHODS must each be aimed at, and move, at least one field.
const REQUIRED = ['top_on_unadjusted_acq', 'make_up_taken_before_the_years_quantity', 'expiry_one_year_late', 'expiry_one_year_early', 'fm_not_netted',
  'lag_dropped', 'average_over_one_more', 'lag_one_month_longer', 'averaging_one_month_short', 'scurve_low_keeps_mid_slope', 'scurve_low_not_anchored', 'scurve_high_not_anchored'];

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
