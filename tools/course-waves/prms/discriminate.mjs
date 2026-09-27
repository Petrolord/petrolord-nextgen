// THE DISCRIMINATE SWEEP over every EC11 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test. And the EC11 rule beside it: the
// OTHER SIDE of every reading the engine states in prms.js (the five-year
// benchmark read exclusive, an undiscounted net cash flow of exactly 0 read as
// economic, the economic limit placed at the PRMS cumulative peak, the
// replacement ratio over additions alone, the life index on the low estimate,
// a difference equal to the tolerance read as not closing, the Monte Carlo low
// read at the 0.9 quantile) must NOT move any graded field at all, because the
// course never grades a reading.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). A route is
// READING-DEPENDENT if any stated reading moves it by any amount. The closest
// miss is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is the engine call prms_capstone.mjs makes,
// checked against fields.json. The wrong methods are the mistakes a learner
// makes:
//   * the ENGINE WITH ONE WRONG RULE (ts_loader.mjs VARIANTS), led by the
//     engine's own negative control list (negcontrol_prms.sh): P90 read as
//     high (a lognormal's low and high swapped), incremental taken as
//     cumulative, the economic limit ignored, 1P kept when the low case fails,
//     the licence ignored, the working interest not applied, the Pc of a
//     prospect read as Pg, the risked mean without the chance, production and
//     divestments added in a reconciliation; and a few more (a normal's or a
//     triangular's low and high swapped, a triangular read off its min, mode
//     and max, cumulative taken as increments, the royalty interest left in,
//     the gas left out of BOE or converted the wrong way);
//   * the ENGINE CALLED WITH A WRONG TERM (the working-interest basis, the
//     gross basis, no abandonment cost, a zero discount rate, a renewal
//     expected, the revisions or the transfers left out);
//   * a few HAND READINGS (Pg plus Pd, the complement product, the 2P read as
//     the P2, the high less the low), which live here among the wrong methods
//     and nowhere else.
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

const HERE = process.env.EC11_WAVE_DIR || '/root/cat-wip-prms';
const { P: G, variant } = await import(`${HERE}/prms_engine.mjs`);
const { CASES, READ, OPEN_READINGS } = await import(`${HERE}/prms_capstone.mjs`);
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
// A dotted path whose first step may be a block key with a colon (classify:prospect).
const set = (path, v) => (c) => { const ks = path.split('.'); let o = c; ks.slice(0, -1).forEach((k) => { o = o[k]; }); if (v === undefined) delete o[ks[ks.length - 1]]; else o[ks[ks.length - 1]] = v; };
const mapMoves = (types) => (c) => { c.reconcile.movements = c.reconcile.movements.filter((m) => !types.includes(m.type)); };

const AB = CASES.ABAGANA;
const pr = AB['classify:prospect'].chances;
const ld = AB['classify:lead'].chances;
const rs = AB['categorize:reserves'].estimates;
const ct = AB['categorize:contingent'].estimates;
const AW = CASES.AWKUZU.economicLimit;
const IS = CASES.ISUOFIA;
const awk = () => G.economicLimit(clone(AW));
const isR = () => G.aggregate(clone(IS['aggregate:reserves']));
const isC = () => G.aggregate(clone(IS['aggregate:contingent']));
const isQ = () => G.reconcile(clone(IS.reconcile));
const sumOil = (rows, from) => rows.filter((r) => r.year >= from).reduce((s, r) => s + r.oil, 0);
const WRONG = {
  abagana_prospect_pc_pct: [V('pc_read_as_pg'), V('pc_read_as_pd'),
    H('pg_plus_pd', () => pr.geologicDiscoveryPct + pr.developmentPct),
    H('either_of_the_two', () => 100 - ((100 - pr.geologicDiscoveryPct) * (100 - pr.developmentPct)) / 100)],
  abagana_lead_pc_pct: [V('pc_read_as_pg'), V('pc_read_as_pd'),
    H('pg_plus_pd', () => ld.geologicDiscoveryPct + ld.developmentPct),
    H('the_mean_of_the_two', () => (ld.geologicDiscoveryPct + ld.developmentPct) / 2)],
  abagana_reserves_p2: [V('categorize_cumulative_as_increments'),
    H('the_high_less_the_low', () => rs.high - rs.low),
    H('the_1p_as_the_p2', () => rs.low),
    H('the_high_less_the_best', () => rs.high - rs.best)],
  abagana_reserves_p3: [V('categorize_cumulative_as_increments'),
    H('the_high_less_the_low', () => rs.high - rs.low),
    H('the_2p_as_the_p3', () => rs.best),
    H('the_best_less_the_low', () => rs.best - rs.low)],
  abagana_contingent_2c: [V('categorize_increments_as_cumulative'),
    H('the_c2_alone', () => ct.second),
    H('all_three_increments', () => ct.first + ct.second + ct.third),
    H('the_c2_and_c3', () => ct.second + ct.third)],
  abagana_contingent_3c: [V('categorize_increments_as_cumulative'),
    H('the_c3_alone', () => ct.third),
    H('the_c1_and_c3', () => ct.first + ct.third),
    H('the_c2_and_c3', () => ct.second + ct.third)],
  awkuzu_best_ncf_share: [V('economic_limit_off_in_cash'), V('working_interest_not_applied_to_cash'),
    C('no_abandonment_cost', set('economicLimit.costs.abandonment', 0)),
    C('no_tax', set('economicLimit.tax.ratePct', 0)),
    H('the_npv_as_the_net_cash_flow', () => awk().cases.best.npvShare)],
  awkuzu_best_npv_share: [V('economic_limit_off_in_cash'), V('working_interest_not_applied_to_cash'),
    C('no_tax', set('economicLimit.tax.ratePct', 0)),
    C('no_discounting', set('economicLimit.discountRatePct', 0)),
    C('no_abandonment_cost', set('economicLimit.costs.abandonment', 0))],
  awkuzu_2p_net_oil: [V('economic_limit_ignored'), V('working_interest_not_applied'), V('royalty_interest_not_deducted'),
    C('the_working_interest_basis', set('economicLimit.reportingBasis', 'working-interest')),
    C('the_gross_basis', set('economicLimit.reportingBasis', 'gross'))],
  awkuzu_p2_boe: [V('low_kept_when_failing'), V('economic_limit_ignored'), V('working_interest_not_applied'), V('royalty_interest_not_deducted'),
    V('boe_without_gas'), V('boe_factor_inverted')],
  awkuzu_p3_boe: [V('economic_increments_as_cumulative'), V('economic_limit_ignored'), V('licence_ignored'), V('working_interest_not_applied'),
    V('royalty_interest_not_deducted'), V('boe_without_gas')],
  awkuzu_high_beyond_licence_oil: [V('licence_ignored'),
    C('renewal_expected', set('economicLimit.licence.renewalExpected', true)),
    H('the_expiry_year_counted_as_beyond', () => sumOil(AW.forecasts.high, AW.licence.expiryYear)),
    H('the_net_entitlement_of_it', () => (awk().cases.high.beyondLicence.oil * AW.workingInterestPct * (100 - AW.royalty.ratePct)) / 10000)],
  isuofia_reserves_arith_1p: [V('lognormal_low_high_swapped'), V('normal_low_high_swapped'), V('triangular_low_high_swapped'), V('triangular_min_mode_max'),
    H('the_sum_of_the_means', () => isR().sumOfMeans)],
  isuofia_reserves_arith_3p: [V('lognormal_low_high_swapped'), V('normal_low_high_swapped'), V('triangular_low_high_swapped'), V('triangular_min_mode_max'),
    H('the_sum_of_the_means', () => isR().sumOfMeans)],
  isuofia_contingent_risked_mean: [V('risked_mean_without_chance'), V('risked_mean_on_best'),
    H('the_mean_chance_times_the_sum_of_means', () => { const r = isC(); return (r.projects.reduce((s, p) => s + p.chanceOfCommercialityPct, 0) / r.projects.length / 100) * r.sumOfMeans; }),
    H('chance_times_the_low_estimate', () => isC().projects.reduce((s, p) => s + (p.chanceOfCommercialityPct * p.low) / 100, 0))],
  isuofia_closing_1p: [V('production_added'), V('divestments_added'), V('production_from_best_only'),
    C('the_revisions_left_out', mapMoves(['revisions'])),
    C('the_transfers_left_out', mapMoves(['transfers']))],
  isuofia_closing_3p: [V('production_added'), V('divestments_added'), V('production_from_best_only'),
    C('the_revisions_left_out', mapMoves(['revisions'])),
    C('the_transfers_left_out', mapMoves(['transfers']))],
  isuofia_difference_2p: [V('production_added'), V('divestments_added'),
    C('the_revisions_left_out', mapMoves(['revisions'])),
    H('the_computed_less_the_stated', () => -isQ().difference.best)],
};

// THE LEAD'S NAMED WRONG METHODS (the engine's negative control list) must each be aimed at, and move, at least one field.
const REQUIRED = ['lognormal_low_high_swapped', 'categorize_increments_as_cumulative', 'economic_increments_as_cumulative', 'economic_limit_ignored',
  'economic_limit_off_in_cash', 'low_kept_when_failing', 'licence_ignored', 'working_interest_not_applied', 'pc_read_as_pg', 'risked_mean_without_chance',
  'production_added', 'divestments_added'];

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
