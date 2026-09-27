// THE DISCRIMINATE SWEEP over every SC4 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test. And the SC4 rule beside it: the
// OTHER SIDE of every reading the engine states in marineLogistics.js (a load
// at capacity read as overloaded, a binding tie to the last constraint,
// counts rounded up without the twelve-digit key, nearest halves rounded down,
// a tie of demand and minimum visits named as minimum visits, FFD ties lighter
// first, a deck fit read strictly, the berth target read strictly, short at
// equality, the P90 of a requirement read at the high side) must NOT move any
// graded field at all, because the course never grades a reading.
//
// The STATED-INPUT readings (the activities the weather slows, the rounding
// rules, first-fit decreasing or first fit, M/M/c or M/D/c) are inputs every
// capstone states, so the other option of each is a WRONG TERM here: a learner
// who ignores what the case states lands outside the tolerance.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). A route is
// READING-DEPENDENT if any stated reading moves it by any amount. The closest
// miss is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is the engine call marine_capstone.mjs makes,
// checked against fields.json. The wrong methods are the mistakes a learner
// makes:
//   * the ENGINE WITH ONE WRONG RULE (variant_loader.mjs VARIANTS), led by the
//     engine's own negative control list (negcontrol_marine.sh): the weather
//     factor on every activity or ignored, knots read as km/h, the return leg
//     dropped, every activity burning at the sailing rate, the price per
//     thousand tonnes, the usable deck fraction ignored, deadweight without
//     bulk, bulk m3 counted as tonnes, voyages rounded to the nearest, vessels
//     over the period, the Erlang B recursion one step too far, the mean wait
//     without 1 - rho, the Cosmetatos correction dropped, M/D/c answered as
//     M/M/c, concurrent service summed, the 24-hour clock, FFD ascending, the
//     deck load ignored, last fit;
//   * the ENGINE CALLED WITH A WRONG TERM (the weather on every activity, the
//     voyages not rounded, the vessels not rounded, first fit in the stated
//     order, the other queue model, the service one after the other, a
//     24-hour working day);
//   * a few HAND READINGS (the load over the gross deck, one leg of each
//     dedicated voyage, the vessel-days over the period), which live here among
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

const HERE = process.env.SC4_WAVE_DIR || '/root/cat-wip-marine';
const { M: G, variant } = await import(`${HERE}/marine_engine.mjs`);
const { CASES, READ, OPEN_READINGS } = await import(`${HERE}/marine_capstone.mjs`);
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

const withCase = (cn, patch, fn) => {
  const saved = clone(CASES[cn]);
  patch(CASES[cn]);
  try { return fn(); } finally { Object.keys(CASES[cn]).forEach((k) => delete CASES[cn][k]); Object.assign(CASES[cn], saved); }
};
const NK = CASES.NKEREFI;
const AK = CASES.AKOKWA;
const MG = CASES.MGBIDI;
const nkBlocks = ['voyagePlan:milk-run', 'voyagePlan:dedicated'];
const nkAll = (f) => (c) => nkBlocks.forEach((k) => f(c[k]));
const nkM = () => G.voyagePlan(clone(NK['voyagePlan:milk-run']));
const nkD = () => G.voyagePlan(clone(NK['voyagePlan:dedicated']));
const akF = () => G.fleetSize(clone(AK.fleetSize));
const mgBoth = (f) => (c) => ['shoreBase:mmc', 'shoreBase:mdc'].forEach((k) => f(c[k]));
const weatherAll = nkAll((b) => { b.weather.appliesTo = ['sailing', 'port', 'field']; });

const WRONG = {
  nkerefi_milkrun_hours: [V('weather_ignored'), V('speed_read_as_kmh'), V('return_leg_dropped'),
    C('weather_on_every_activity_stated', weatherAll),
    H('sailing_hours_only', () => nkM().voyages[0].hours.sailing)],
  nkerefi_milkrun_fuel_t: [V('weather_ignored'), V('every_activity_at_sailing_rate'), V('return_leg_dropped'),
    C('weather_on_every_activity_stated', weatherAll),
    H('sailing_fuel_only', () => nkM().voyages[0].fuelT.sailing)],
  nkerefi_milkrun_fuel_cost: [V('fuel_price_per_thousand_tonnes'), V('every_activity_at_sailing_rate'), V('weather_ignored'),
    C('weather_on_every_activity_stated', weatherAll),
    H('the_hours_times_the_price', () => nkM().voyages[0].hours.total * NK['voyagePlan:milk-run'].fuelPricePerT)],
  nkerefi_milkrun_deadweight_t: [V('deadweight_without_bulk'), V('bulk_m3_as_tonnes'),
    H('the_deck_load_capacity_less_the_deck_weight', () => NK['voyagePlan:milk-run'].vessel.deckLoadT - nkM().voyages[0].load.deckWeightT),
    H('the_tank_capacities_at_their_densities', () => nkM().voyages[0].load.deckWeightT + NK['voyagePlan:milk-run'].products.reduce((s, p) => s + NK['voyagePlan:milk-run'].vessel.tanks[p.id] * p.densityTPerM3, 0))],
  nkerefi_binding_utilisation: [V('usable_fraction_ignored'),
    H('the_deck_load_utilisation', () => nkM().voyages[0].constraints.find((c) => c.constraint === 'deck load').utilisation),
    H('the_deadweight_utilisation', () => nkM().voyages[0].constraints.find((c) => c.constraint === 'deadweight').utilisation),
    H('the_highest_tank_utilisation', () => Math.max(...nkM().voyages[0].constraints.filter((c) => c.constraint.startsWith('tank')).map((c) => c.utilisation)))],
  nkerefi_dedicated_days: [V('dedicated_one_way'), V('weather_ignored'), V('speed_read_as_kmh'),
    C('weather_on_every_activity_stated', weatherAll),
    H('the_total_hours_read_as_days', () => nkD().totals.hours)],
  akokwa_voyages_exact: [V('usable_fraction_ignored'),
    H('the_minimum_visits_of_the_run', () => Math.max(...AK.fleetSize.installations.map((x) => x.minVisits))),
    H('the_deck_load_ratio', () => akF().voyageSets[0].constraints.find((c) => c.constraint === 'deck load').demand / AK.fleetSize.vessel.deckLoadT),
    H('the_rounded_count', () => akF().voyageSets[0].voyages)],
  akokwa_vessel_days: [V('voyages_rounded_nearest'), V('usable_fraction_ignored'), V('weather_ignored'),
    C('voyages_not_rounded', (c) => { c.fleetSize.voyageRounding = 'none'; }),
    C('weather_on_every_activity_stated', (c) => { c.fleetSize.weather.appliesTo = ['sailing', 'port', 'field']; }),
    H('the_minimum_visits_times_the_voyage_days', () => akF().voyageSets[0].voyageDays * 3)],
  akokwa_vessels_exact: [V('vessels_over_the_period'), V('voyages_rounded_nearest'), V('weather_ignored'),
    C('voyages_not_rounded', (c) => { c.fleetSize.voyageRounding = 'none'; }),
    C('weather_on_every_activity_stated', (c) => { c.fleetSize.weather.appliesTo = ['sailing', 'port', 'field']; })],
  akokwa_spare_vessel_days: [V('voyages_rounded_nearest'),
    C('vessels_not_rounded', (c) => { c.fleetSize.vesselRounding = 'none'; }),
    C('voyages_not_rounded', (c) => { c.fleetSize.voyageRounding = 'none'; }),
    H('the_period_in_place_of_the_available_days', () => akF().vessels * AK.fleetSize.periodDays - akF().vesselDays)],
  akokwa_ffd_v1_area_m2: [V('ffd_ascending'), V('deck_usable_fraction_ignored'), V('last_fit'),
    C('first_fit_in_the_stated_order', (c) => { c.deckPlan.rule = 'first-fit'; })],
  akokwa_ffd_v2_load_utilisation: [V('ffd_ascending'), V('deck_usable_fraction_ignored'), V('last_fit'),
    C('first_fit_in_the_stated_order', (c) => { c.deckPlan.rule = 'first-fit'; })],
  mgbidi_mmc_wait_hours: [V('erlang_b_one_step_too_far'), V('wait_without_one_minus_rho'), V('twenty_four_hour_clock'),
    C('the_other_queue_model', mgBoth((b) => { b.model = b.model === 'M/M/c' ? 'M/D/c' : 'M/M/c'; })),
    C('service_one_after_the_other', mgBoth((b) => { b.service.concurrent = false; }))],
  mgbidi_mmc_probability_wait: [V('erlang_b_one_step_too_far'), V('twenty_four_hour_clock'), V('concurrent_service_summed'),
    H('the_berth_utilisation', () => G.shoreBase(clone(MG['shoreBase:mmc'])).berthUtilisation)],
  mgbidi_mmc_time_at_base_hours: [V('erlang_b_one_step_too_far'), V('wait_without_one_minus_rho'), V('twenty_four_hour_clock'),
    C('service_one_after_the_other', mgBoth((b) => { b.service.concurrent = false; })),
    H('the_mean_wait_alone', () => G.shoreBase(clone(MG['shoreBase:mmc'])).meanWaitHours)],
  mgbidi_mdc_wait_hours: [V('cosmetatos_correction_dropped'), V('mdc_answered_as_mmc'), V('erlang_b_one_step_too_far'), V('twenty_four_hour_clock'),
    C('service_one_after_the_other', mgBoth((b) => { b.service.concurrent = false; }))],
  mgbidi_mdc_mean_queue: [V('cosmetatos_correction_dropped'), V('mdc_answered_as_mmc'), V('wait_without_one_minus_rho'),
    C('service_one_after_the_other', mgBoth((b) => { b.service.concurrent = false; })),
    H('the_mean_wait_as_the_queue', () => G.shoreBase(clone(MG['shoreBase:mdc'])).meanWaitHours)],
  mgbidi_target_wait_hours: [V('erlang_b_one_step_too_far'), V('twenty_four_hour_clock'), V('concurrent_service_summed'),
    C('the_other_queue_model', mgBoth((b) => { b.model = b.model === 'M/M/c' ? 'M/D/c' : 'M/M/c'; })),
    H('the_wait_at_the_stated_berths', () => G.shoreBase(clone(MG['shoreBase:mmc'])).meanWaitHours)],
};

// THE ENGINE'S NAMED WRONG METHODS (its negative control list) this sweep uses must each be aimed at, and move, at least one field.
const REQUIRED = ['weather_on_every_activity_stated', 'weather_ignored', 'usable_fraction_ignored', 'deadweight_without_bulk', 'bulk_m3_as_tonnes',
  'voyages_rounded_nearest', 'vessels_over_the_period', 'erlang_b_one_step_too_far', 'wait_without_one_minus_rho', 'cosmetatos_correction_dropped',
  'mdc_answered_as_mmc', 'concurrent_service_summed', 'twenty_four_hour_clock', 'ffd_ascending', 'first_fit_in_the_stated_order', 'the_other_queue_model',
  'voyages_not_rounded', 'vessels_not_rounded'];

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
    const d = v === null ? Infinity : Math.abs(v - truth) / tol;
    if (d > 1) { moves += 1; moved.add(w.name); } else blind += 1;
    if (d < closest.d) closest = { d, key, w: w.name };
    out.push(`${w.name} ${v === null ? 'none (the field is not returned)' : d.toExponential(2)}${d > 1 ? '' : ' BLIND'}`);
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
say(`THE NAMED WRONG METHODS: ${REQUIRED.length - missing.length} of ${REQUIRED.length} aimed at a field and moving it${missing.length ? `; MISSING ${missing.join(', ')}` : ''}`);
say(`STATED READINGS: ${dependent} field-reading pair(s) move a graded value`);
say(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.w}, ${closest.d.toExponential(3)} tolerances away`);
if (SLACK !== 1) {
  say(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
say(`WEAK ROUTES: ${weak}; READING-DEPENDENT: ${dependent}`);
if (JSONOUT) process.stdout.write(`${JSON.stringify(VALUES)}\n`);
process.exit(weak || dependent || missing.length ? 1 : 0);
