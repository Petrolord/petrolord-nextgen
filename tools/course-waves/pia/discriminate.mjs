// THE DISCRIMINATE SWEEP over every EC7 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test. And the EC7 rule beside it: an
// OPEN READING of the texts (the royalty by price base year, the new-acreage
// lease rate, the deep offshore rate under the Nigeria Tax Act 2025) must NOT
// move any graded field at all, because the course never grades a reading.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). A route is
// READING-DEPENDENT if any open reading moves it by any amount. The closest
// miss is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is the engine call pia_capstone.mjs makes, checked
// against fields.json. The wrong methods are the mistakes a learner makes:
//   * the ENGINE WITH ONE WRONG RULE (ts_loader.mjs VARIANTS: a flat terrain
//     royalty, the deep offshore step, the unconverted-lease gas rates, the
//     in-country share ignored, NDDC outside the hydrocarbon tax base, the
//     tertiary education tax at 2.5 percent after 2023, one framework for the
//     whole ledger, the cost price ratio on gross revenue, the shared costs not
//     apportioned, the carry dropped, no allowance after the cap, the deep
//     offshore allowance kept in NTA years, the development levy in PIA years,
//     the royalty by price on gas, HCDT on the current year, the daily rate on
//     crude alone or over 365 days);
//   * the ENGINE CALLED WITH A WRONG TERM (the working interest ignored, the
//     converted lease read as a prospecting licence, the prior production left
//     out of the cap, the escrow condition taken as met);
//   * a few HAND READINGS (the tranche read on the share of the volume, five
//     percent on everything below the first tranche edge), which live here
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

const HERE = process.env.EC7_WAVE_DIR || '/root/cat-wip-pia';
const { E, variant } = await import(`${HERE}/pia_engine.mjs`);
const { CASES, READ, OPEN_READINGS } = await import(`${HERE}/pia_capstone.mjs`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e15 : 1;
const JSONOUT = process.argv.includes('--json');
const say = JSONOUT ? () => {} : console.log;
const VALUES = {};
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

const clone = (o) => JSON.parse(JSON.stringify(o));
const run = (Eng, c, patch = {}) => Eng.computeCashFlow({ cfg: { ...clone(c.cfg), ...patch }, prodRows: clone(c.prodRows), capexRows: clone(c.capexRows), opexRows: clone(c.opexRows) });
const row = (r, y) => r.cashFlowData.find((d) => d.year === y);
const V = (name) => ({ kind: 'variant', name });
const C = (name, patch) => ({ kind: 'term', name, patch });
const H = (name, fn) => ({ kind: 'hand', name, fn });
const WI100 = C('working_interest_ignored', { pia_working_interest_pct: 100 });

const WRONG = {
  odozi_2028_liquids_royalty_rate: [V('flat_royalty'), V('daily_rate_365_days'),
    H('tranche_read_on_the_share_of_the_volume', (r, c) => E.deriveOilRoyaltyRate(c.cfg.pia_terrain, row(r, 2028).royalty_liquids_bopd * c.cfg.pia_working_interest_pct / 100)),
    H('five_percent_on_every_barrel', () => 0.05)],
  odozi_2029_production_royalty_usd: [V('flat_royalty'), V('old_gas_rates'), V('gas_in_country_ignored'), WI100],
  odozi_2030_hct_usd: [V('flat_royalty'), V('nddc_outside_hct_base'), V('hcdt_current_year'), C('read_as_a_prospecting_licence', { pia_license_type: 'PPL' }), WI100],
  odozi_2031_dev_levy_usd: [V('flat_royalty'), V('old_gas_rates'), V('hcdt_current_year'), V('gas_in_country_ignored'), WI100],
  odozi_total_cit_usd: [V('flat_royalty'), V('old_gas_rates'), V('hcdt_current_year'), V('gas_in_country_ignored'), WI100],
  odozi_government_take_pct: [V('flat_royalty'), V('old_gas_rates'), V('nddc_outside_hct_base'), V('hcdt_current_year'), C('read_as_a_prospecting_licence', { pia_license_type: 'PPL' })],
  nkemdi_2028_liquids_royalty_usd: [V('flat_royalty'), V('daily_rate_365_days'), V('daily_rate_crude_only'), WI100],
  nkemdi_2029_production_allowance_usd: [V('no_allowance_after_cap'), C('prior_production_left_out_of_the_cap', { pia_prior_cumulative_oil_bbl: 0 }), C('read_as_a_converted_lease', { pia_lease_status: 'converted' }), WI100],
  nkemdi_2029_hct_chargeable_profit_usd: [V('flat_royalty'), V('nddc_outside_hct_base'), V('no_allowance_after_cap'), V('daily_rate_crude_only'), WI100],
  nkemdi_2031_cpr_deferred_usd: [V('cpr_on_gross_revenue'), V('cpr_costs_not_apportioned'), V('cpr_carry_dropped'), WI100],
  nkemdi_cpr_forfeited_usd: [V('cpr_on_gross_revenue'), V('cpr_costs_not_apportioned'), V('cpr_carry_dropped'), WI100],
  nkemdi_total_cit_usd: [V('flat_royalty'), V('old_gas_rates'), V('hcdt_current_year'), V('daily_rate_crude_only'), WI100],
  alaku_2026_total_royalty_usd: [V('deep_offshore_step'), V('flat_royalty'), V('old_gas_rates'), V('gas_in_country_ignored'), V('price_royalty_on_gas'), WI100],
  alaku_2026_hct_chargeable_profit_usd: [V('nta_deep_allowance_kept'), V('one_framework_per_ledger'), V('nddc_outside_hct_base'), V('deep_offshore_step'), WI100],
  alaku_2025_tet_usd: [V('tet_25_after_2023'), V('levy_in_pia_years'), V('deep_offshore_step'), V('price_royalty_on_gas'), WI100],
  alaku_2027_dev_levy_usd: [V('one_framework_per_ledger'), V('flat_royalty'), V('old_gas_rates'), V('price_royalty_on_gas'), WI100],
  alaku_2028_cit_usd: [C('escrow_condition_taken_as_met', { pia_decom_escrow_condition_met: true }), V('one_framework_per_ledger'), V('flat_royalty'), V('price_royalty_on_gas'), WI100],
  alaku_total_cit_usd: [V('deep_offshore_step'), V('one_framework_per_ledger'), C('escrow_condition_taken_as_met', { pia_decom_escrow_condition_met: true }), V('flat_royalty'), V('price_royalty_on_gas'), WI100],
};

// THE LEAD'S NAMED WRONG METHODS must each be aimed at, and move, at least one field.
const REQUIRED = ['flat_royalty', 'old_gas_rates', 'nddc_outside_hct_base', 'tet_25_after_2023', 'one_framework_per_ledger'];

let weak = 0;
let dependent = 0;
let closest = { d: Infinity };
const moved = new Set();
const truthRuns = Object.fromEntries(Object.entries(CASES).map(([n, c]) => [n, run(E, c)]));
for (const [key, [, , value, tol]] of Object.entries(fields)) {
  const [cn, get] = READ[key];
  const c = CASES[cn];
  const truth = get(truthRuns[cn]);
  if (truth !== value) { say(`REFUSED: ${key} truth ${truth} is not fields.json ${value}`); process.exit(2); }
  const out = [];
  VALUES[key] = { truth, wrong: {} };
  let moves = 0;
  let blind = 0;
  for (const w of WRONG[key] || []) {
    let v;
    try {
      if (w.kind === 'variant') v = get(run(await variant(w.name), c));
      else if (w.kind === 'term') v = get(run(E, c, w.patch));
      else v = w.fn(truthRuns[cn], c);
    } catch (e) { out.push(`${w.name} REFUSED BY THE ENGINE (${e.message.slice(0, 60)})`); continue; }
    VALUES[key].wrong[w.name] = v;
    const d = Math.abs(v - truth) / tol;
    if (d > 1) { moves += 1; moved.add(w.name); } else blind += 1;
    if (d < closest.d) closest = { d, key, w: w.name };
    out.push(`${w.name} ${d.toExponential(2)}${d > 1 ? '' : ' BLIND'}`);
  }
  const readings = [];
  for (const [rn, patch] of Object.entries(OPEN_READINGS[cn])) {
    const v = get(run(E, c, patch));
    readings.push(`${rn} ${v === truth ? 'identical' : `MOVES BY ${Math.abs(v - truth)}`}`);
    if (v !== truth) dependent += 1;
  }
  const isWeak = moves < 3 || blind > 0;
  if (isWeak) weak += 1;
  say(`${isWeak ? 'WEAK ' : 'ok   '} ${key}  (${moves} of ${(WRONG[key] || []).length} wrong methods move it)`);
  say(`        wrong, in tolerances: ${out.join('; ')}`);
  say(`        open readings: ${readings.join('; ')}`);
}
const missing = REQUIRED.filter((n) => !moved.has(n));
say(`LEAD'S NAMED WRONG METHODS: ${REQUIRED.length - missing.length} of ${REQUIRED.length} aimed at a field and moving it${missing.length ? `; MISSING ${missing.join(', ')}` : ''}`);
say(`OPEN READINGS: ${dependent} field-reading pair(s) move a graded value`);
say(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.w}, ${closest.d.toExponential(3)} tolerances away`);
if (SLACK !== 1) {
  say(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
say(`WEAK ROUTES: ${weak}; READING-DEPENDENT: ${dependent}`);
if (JSONOUT) process.stdout.write(`${JSON.stringify(VALUES)}\n`);
process.exit(weak || dependent || missing.length ? 1 : 0);
