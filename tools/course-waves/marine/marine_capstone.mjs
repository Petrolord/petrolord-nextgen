// THE THREE SC4 CAPSTONES AND THEIR EIGHTEEN GRADED FIELDS.
//
// Every graded value is a RETURN VALUE of the vendored engine
// (engines/supplychain/marineLogistics.js, with the canonical sampler it
// imports from lib/stats/stats.js and the exceedance sentence it imports from
// lib/conventions/percentile.js) on the inputs typed below. Nothing here
// computes an hour, a tonne, a cost, a load, a utilisation, a voyage count, a
// packing or a queue figure by its own arithmetic: every number is read off an
// engine result object, and discriminate.mjs is where the wrong methods live.
//
//   NKEREFI  Associate     voyages, capacity and the binding constraint: one
//                          PSV's milk run through three installations (its
//                          hours, fuel tonnes and fuel cost with the weather
//                          factor on the stated activities, its deadweight
//                          load from the stated densities, the binding
//                          constraint's utilisation) and the total days of
//                          dedicated voyages to the same three
//   AKOKWA   Professional  fleet sizing and deck planning: a week's demand of
//                          four installations on one PSV milk run (the voyages
//                          of demand before rounding, the vessel-days, the
//                          vessels before rounding, the spare vessel-days) and
//                          one voyage's deck cargo packed first-fit decreasing
//                          by area on two voyages (the first voyage's area and
//                          the second voyage's deck load utilisation)
//   MGBIDI   Expert        shore base queues: a supply base with three berths
//                          on a twenty-hour working day, as M/M/c (the mean
//                          wait, the delay probability and the mean time at
//                          the base) and as M/D/c (the mean wait and the mean
//                          queue), and the M/M/c mean wait at the fewest
//                          berths that meet a stated target; the case also
//                          carries a fleet under weather and demand
//                          variability for the seeded Monte Carlo, which is
//                          run, reported with its seed and draws, and never
//                          graded
//
// THE CASES ARE EKENE SYNTHETIC CLUSTERS OF THEIR OWN, typed here with their own
// vessels, installations, products, legs, demands, deck items and base terms,
// none of them the digest's. Their names, terms and values must never enter a
// lesson, a bank, a panel default or a brief (gate_capstone_leak.mjs).
//
// EVERY FIELD IS FREE OF EVERY STATED READING AND OF EVERY DRAW. Two families
// of reading, both asserted below:
//   * THE ENGINE'S OWN READINGS (the conventions it states where no text fixes
//     one: a load at capacity is feasible, a binding tie goes to the first
//     constraint, counts round up on the twelve-digit key, nearest halves
//     round up, a tie of demand and minimum visits names demand, FFD ties go
//     heavier first, a deck fit is inclusive, the berth target is met at or
//     below it, short means strictly above, the P90 of a requirement is the
//     low figure). This file runs every capstone again through the engine with
//     the OTHER side of each (variant_loader.mjs reading_* variants) and
//     ASSERTS that every graded value comes out bit-identical.
//   * THE STATED-INPUT READINGS (the activities the weather factor slows, the
//     voyage and vessel rounding rules, first-fit decreasing or first fit, M/M/c
//     or M/D/c). These are inputs, so every capstone STATES each one it uses,
//     and this file records, per field, whether the other option moves it:
//     a field it moves is graded only because the case states the option
//     (discriminate.mjs requires the other option to land outside the
//     tolerance), and a field it does not move is asserted bit-identical under
//     it.
// The Expert case runs the seeded Monte Carlo of fleetVariability, and no
// graded field reads it: this file runs it on a second seed and a second draw
// count and asserts every graded value bit-identical, and asserts that the
// Monte Carlo figures themselves did move.
//
// THE CARE RULES, all asserted below:
//   * ONE ANSWER. Every graded value is finite, non-zero and not a whole number.
//   * EVERY TERM IS STATED. Every input a value depends on is in the case,
//     printed by --inputs for the capstone brief and the case files.
//   * NO COLLISION. No two graded values sit within one tolerance of each other.
//   * NO BOUNDARY. No graded value sits on a rule's boundary: no load equals a
//     capacity, no ratio is within the twelve-digit key of a whole number, no
//     wait equals the target (the reading variants would catch each one).
//
// Usage:
//   node marine_capstone.mjs            the human table
//   node marine_capstone.mjs --json     the rows make_fields.mjs writes
//   node marine_capstone.mjs --inputs   the three cases, for gen_course.py,
//                                       discriminate.mjs, oracle_check.py and
//                                       gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST, and the digest generator reads nothing here.
import process from 'node:process';

const HERE = process.env.SC4_WAVE_DIR || '/root/cat-wip-marine';
const { M, variant } = await import(`${HERE}/marine_engine.mjs`);
const TOLPATH = process.env.SC4_TOLERANCE
  || '/root/wt-sc4-nextgen/src/components/course/panels/marine/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const clone = (o) => JSON.parse(JSON.stringify(o));
const ok = (label, r) => {
  if (!r || r.error) throw new Error(`${label} was refused: ${r && r.error}`);
  return r;
};

/* ====================================================== NKEREFI, Associate

   The Nkerefi cluster (synthetic): a production platform, a jack-up and an
   FPSO served by one PSV. One milk run in the stated order with one voyage's
   cargo for each installation, and the same three served by dedicated
   voyages out and back. The weather factor slows sailing and field time. */

const NK_PRODUCTS = [
  { id: 'diesel', name: 'Marine gas oil (synthetic)', kind: 'liquid', densityTPerM3: 0.84 },
  { id: 'water', name: 'Drill water (synthetic)', kind: 'liquid', densityTPerM3: 1 },
  { id: 'mud', name: 'Oil-based mud (synthetic)', kind: 'liquid', densityTPerM3: 1.35 },
];
const NK_VESSEL = {
  name: 'PSV Nkerefi Dawn (synthetic)', speedKnots: 11.5, deckAreaM2: 720, deckUsableFraction: 0.8, deckLoadT: 1650, deadweightT: 3100,
  tanks: { diesel: 700, water: 900, mud: 500 }, fuelTPerHour: { sailing: 0.46, port: 0.035, field: 0.27 },
};
const NK_CARGO = {
  'NK-P': { deckAreaM2: 212.5, deckWeightT: 246.75, bulk: { diesel: 185, water: 320 } },
  'NK-R': { deckAreaM2: 238.25, deckWeightT: 402.5, bulk: { diesel: 210, water: 275, mud: 340 } },
  'NK-F': { deckAreaM2: 97.75, deckWeightT: 88.25, bulk: { diesel: 130, water: 145 } },
};
const NK_INST = [
  { id: 'NK-P', name: 'Nkerefi production platform (synthetic)', fieldHours: 5.5 },
  { id: 'NK-R', name: 'Nkerefi jack-up drilling unit (synthetic)', fieldHours: 7.25 },
  { id: 'NK-F', name: 'Nkerefi FPSO (synthetic)', fieldHours: 4.75 },
];
const NK_WEATHER = { factor: 1.15, appliesTo: ['sailing', 'field'] };

const NKEREFI = {
  name: 'NKEREFI',
  label: 'NKEREFI, one PSV serving the Nkerefi cluster (synthetic)',
  'voyagePlan:milk-run': {
    vessel: NK_VESSEL,
    products: NK_PRODUCTS,
    installations: NK_INST.map((x) => ({ ...x, cargo: NK_CARGO[x.id] })),
    route: { mode: 'milk-run', stops: ['NK-P', 'NK-R', 'NK-F'], legsNm: [47.5, 13.25, 21.5, 58.75] },
    portHours: 10.5,
    weather: NK_WEATHER,
    fuelPricePerT: 845.5,
  },
  'voyagePlan:dedicated': {
    vessel: NK_VESSEL,
    products: NK_PRODUCTS,
    installations: NK_INST.map((x, i) => ({ ...x, distanceFromBaseNm: [47.5, 55.25, 58.75][i], cargo: NK_CARGO[x.id] })),
    route: { mode: 'dedicated' },
    portHours: 10.5,
    weather: NK_WEATHER,
    fuelPricePerT: 845.5,
  },
};

/* ================================================== AKOKWA, Professional

   The Akokwa cluster (synthetic): four installations with a week's demand
   and minimum visits, served by one PSV on a milk run in a seven-day week
   with 6.25 days available a vessel; voyages rounded up, vessels rounded up.
   The weather factor slows sailing and port time. And one voyage's deck
   cargo for the same PSV, packed first-fit decreasing by area on two
   voyages. */

const AK_VESSEL = {
  name: 'PSV Akokwa Crest (synthetic)', speedKnots: 12.5, deckAreaM2: 860, deckUsableFraction: 0.72, deckLoadT: 2150, deadweightT: 3850,
  tanks: { diesel: 850, water: 1100, brine: 450, cement: 280 }, fuelTPerHour: { sailing: 0.52, port: 0.04, field: 0.31 },
};
const AKOKWA = {
  name: 'AKOKWA',
  label: 'AKOKWA, a week of supply and one voyage of deck cargo for the Akokwa cluster (synthetic)',
  fleetSize: {
    vessel: AK_VESSEL,
    products: [
      { id: 'diesel', name: 'Marine gas oil (synthetic)', kind: 'liquid', densityTPerM3: 0.845 },
      { id: 'water', name: 'Potable water (synthetic)', kind: 'liquid', densityTPerM3: 1 },
      { id: 'brine', name: 'Completion brine (synthetic)', kind: 'liquid', densityTPerM3: 1.25 },
      { id: 'cement', name: 'Cement, dry bulk (synthetic)', kind: 'dry', densityTPerM3: 1.45 },
    ],
    installations: [
      { id: 'AK-1', name: 'Akokwa wellhead platform (synthetic)', fieldHours: 4.5, minVisits: 2, demand: { deckAreaM2: 415.5, deckWeightT: 388.25, bulk: { diesel: 365, water: 610 } } },
      { id: 'AK-2', name: 'Akokwa semi-submersible (synthetic)', fieldHours: 9.25, minVisits: 3, demand: { deckAreaM2: 1037.75, deckWeightT: 1420.5, bulk: { diesel: 540, water: 820, brine: 395, cement: 215 } } },
      { id: 'AK-3', name: 'Akokwa processing platform (synthetic)', fieldHours: 6.75, minVisits: 2, demand: { deckAreaM2: 372.25, deckWeightT: 305.5, bulk: { diesel: 290, water: 540 } } },
      { id: 'AK-4', name: 'Akokwa FSO (synthetic)', fieldHours: 3.5, minVisits: 1, demand: { deckAreaM2: 118.5, deckWeightT: 96.75, bulk: { diesel: 175, water: 230 } } },
    ],
    route: { mode: 'milk-run', stops: ['AK-1', 'AK-2', 'AK-3', 'AK-4'], legsNm: [58.5, 16.25, 11.75, 24.5, 83.25] },
    portHours: 14.5,
    weather: { factor: 1.25, appliesTo: ['sailing', 'port'] },
    fuelPricePerT: 812.75,
    periodDays: 7,
    vesselAvailableDays: 6.25,
    voyageRounding: 'up',
    vesselRounding: 'up',
  },
  deckPlan: {
    deck: { name: 'PSV Akokwa Crest clear deck (synthetic)', areaM2: 860, usableFraction: 0.72, loadT: 2150 },
    items: [
      { id: 'ak-ibc', name: 'Chemical IBC in a frame (synthetic)', lengthM: 1.25, widthM: 1.05, weightT: 1.35, quantity: 14 },
      { id: 'ak-skip', name: 'Waste skip (synthetic)', lengthM: 2.6, widthM: 1.75, weightT: 2.9, quantity: 7 },
      { id: 'ak-c10', name: '10 ft offshore container (synthetic)', lengthM: 2.99, widthM: 2.44, weightT: 7.5, quantity: 11 },
      { id: 'ak-bskt', name: '8 m cargo basket (synthetic)', lengthM: 8, widthM: 2.45, weightT: 7.25, quantity: 6 },
      { id: 'ak-tank', name: 'Portable brine tank (synthetic)', lengthM: 5.2, widthM: 2.35, weightT: 15.5, quantity: 5 },
      { id: 'ak-c20', name: '20 ft offshore container (synthetic)', lengthM: 6.06, widthM: 2.44, weightT: 11.5, quantity: 14 },
      { id: 'ak-riser', name: 'Riser joints, bundled (synthetic)', lengthM: 15.25, widthM: 2.75, weightT: 41.5, quantity: 3 },
    ],
    voyages: 2,
    rule: 'first-fit-decreasing-area',
  },
};

/* ======================================================= MGBIDI, Expert

   The Mgbidi supply base (synthetic): three berths, 4.6 arrivals a day over
   a twenty-hour working day, a call needing 1.5 fixed hours and 84 lifts at
   14 an hour alongside 540 m3 of bulk at 120 m3 an hour. As M/M/c with a
   target mean wait, and as M/D/c. And a two-installation fleet under weather
   and demand variability, run through the seeded Monte Carlo and never
   graded. */

const MG_SERVICE = { fixedHours: 1.5, lifts: 84, liftsPerHour: 14, bulkM3: 540, bulkM3PerHour: 120, concurrent: true };
const MGBIDI = {
  name: 'MGBIDI',
  label: 'MGBIDI, the Mgbidi supply base and its fleet (synthetic)',
  'shoreBase:mmc': {
    berths: 3, arrivalsPerDay: 4.6, workingHoursPerDay: 20, service: MG_SERVICE, model: 'M/M/c', targetMeanWaitHours: 0.35,
  },
  'shoreBase:mdc': {
    berths: 3, arrivalsPerDay: 4.6, workingHoursPerDay: 20, service: MG_SERVICE, model: 'M/D/c',
  },
  fleetVariability: {
    vessel: {
      name: 'PSV Mgbidi Pride (synthetic)', speedKnots: 12, deckAreaM2: 780, deckUsableFraction: 0.74, deckLoadT: 1900, deadweightT: 3400,
      tanks: { diesel: 780, water: 1000 }, fuelTPerHour: { sailing: 0.49, port: 0.036, field: 0.29 },
    },
    products: [
      { id: 'diesel', name: 'Marine gas oil (synthetic)', kind: 'liquid', densityTPerM3: 0.85 },
      { id: 'water', name: 'Potable water (synthetic)', kind: 'liquid', densityTPerM3: 1 },
    ],
    installations: [
      { id: 'MG-A', name: 'Mgbidi-A platform (synthetic)', distanceFromBaseNm: 71.5, fieldHours: 6.5, minVisits: 2, demand: { deckAreaM2: 690.5, deckWeightT: 812.25, bulk: { diesel: 505, water: 880 } } },
      { id: 'MG-B', name: 'Mgbidi-B platform (synthetic)', distanceFromBaseNm: 88.25, fieldHours: 5.25, minVisits: 2, demand: { deckAreaM2: 402.75, deckWeightT: 455.5, bulk: { diesel: 310, water: 520 } } },
    ],
    route: { mode: 'dedicated' },
    portHours: 13.5,
    weather: { factor: { min: 1, mode: 1.15, max: 1.55 }, appliesTo: ['sailing', 'field'] },
    fuelPricePerT: 830.25,
    periodDays: 7,
    vesselAvailableDays: 6.5,
    voyageRounding: 'up',
    vesselRounding: 'up',
    demandFactor: { min: 0.9, mode: 1, max: 1.35 },
    plannedVessels: 2,
    iterations: 20000,
    seed: 20291117,
  },
};

export const CASES = { NKEREFI, AKOKWA, MGBIDI };

/* ------------------------------------------------------ the engine routes

   READ[key] = [case, (E) => value]: the value the key names, read off the
   engine module E. The true engine is M; discriminate.mjs passes a variant. */

const nkM = (E) => ok('voyagePlan', E.voyagePlan(clone(NKEREFI['voyagePlan:milk-run'])));
const nkD = (E) => ok('voyagePlan', E.voyagePlan(clone(NKEREFI['voyagePlan:dedicated'])));
const akF = (E) => ok('fleetSize', E.fleetSize(clone(AKOKWA.fleetSize)));
const akD = (E) => ok('deckPlan', E.deckPlan(clone(AKOKWA.deckPlan)));
const mgM = (E) => ok('shoreBase', E.shoreBase(clone(MGBIDI['shoreBase:mmc'])));
const mgD = (E) => ok('shoreBase', E.shoreBase(clone(MGBIDI['shoreBase:mdc'])));
const mgV = (E) => ok('fleetVariability', E.fleetVariability(clone(MGBIDI.fleetVariability)));

export const READ = {
  nkerefi_milkrun_hours: ['NKEREFI', (E) => nkM(E).voyages[0].hours.total],
  nkerefi_milkrun_fuel_t: ['NKEREFI', (E) => nkM(E).voyages[0].fuelT.total],
  nkerefi_milkrun_fuel_cost: ['NKEREFI', (E) => nkM(E).voyages[0].fuelCost],
  nkerefi_milkrun_deadweight_t: ['NKEREFI', (E) => nkM(E).voyages[0].load.deadweightT],
  nkerefi_binding_utilisation: ['NKEREFI', (E) => nkM(E).voyages[0].binding.utilisation],
  nkerefi_dedicated_days: ['NKEREFI', (E) => nkD(E).totals.days],
  akokwa_voyages_exact: ['AKOKWA', (E) => akF(E).voyageSets[0].voyagesExact],
  akokwa_vessel_days: ['AKOKWA', (E) => akF(E).vesselDays],
  akokwa_vessels_exact: ['AKOKWA', (E) => akF(E).vesselsExact],
  akokwa_spare_vessel_days: ['AKOKWA', (E) => akF(E).spareVesselDays],
  akokwa_ffd_v1_area_m2: ['AKOKWA', (E) => akD(E).voyages[0].areaM2],
  akokwa_ffd_v2_load_utilisation: ['AKOKWA', (E) => akD(E).voyages[1].loadUtilisation],
  mgbidi_mmc_wait_hours: ['MGBIDI', (E) => mgM(E).meanWaitHours],
  mgbidi_mmc_probability_wait: ['MGBIDI', (E) => mgM(E).probabilityWait],
  mgbidi_mmc_time_at_base_hours: ['MGBIDI', (E) => mgM(E).meanTimeAtBaseHours],
  mgbidi_mdc_wait_hours: ['MGBIDI', (E) => mgD(E).meanWaitHours],
  mgbidi_mdc_mean_queue: ['MGBIDI', (E) => mgD(E).meanQueue],
  mgbidi_target_wait_hours: ['MGBIDI', (E) => mgM(E).target.meanWaitHours],
};

/** The other side of each reading the engine states in marineLogistics.js. No graded value may move under any of them. */
export const OPEN_READINGS = ['reading_capacity_exclusive', 'reading_binding_tie_last', 'reading_ceil_without_key', 'reading_nearest_halves_down',
  'reading_tie_names_minimum_visits', 'reading_ffd_tie_lighter_first', 'reading_deck_fit_exclusive', 'reading_berth_target_strict',
  'reading_short_at_equality', 'reading_p90_high'];

/**
 * THE STATED-INPUT READINGS: the other option of each stated choice, as a
 * patch of the case. A field either moves under it (graded only because the
 * case states the option; discriminate.mjs requires the move to clear the
 * tolerance) or is asserted bit-identical under it.
 */
const setAll = (cn, key, f) => (c) => { Object.keys(c).filter((k) => k === key || k.startsWith(`${key}:`)).forEach((k) => f(c[k])); };
export const STATED_READINGS = [
  ['weather on sailing, port and field alike', ['NKEREFI', 'AKOKWA'], (cn) => setAll(cn, cn === 'NKEREFI' ? 'voyagePlan' : 'fleetSize', (b) => { b.weather.appliesTo = ['sailing', 'port', 'field']; })],
  ['voyages not rounded (voyageRounding none)', ['AKOKWA'], () => (c) => { c.fleetSize.voyageRounding = 'none'; }],
  ['vessels rounded to the nearest (vesselRounding nearest)', ['AKOKWA'], () => (c) => { c.fleetSize.vesselRounding = 'nearest'; }],
  ['vessels not rounded (vesselRounding none)', ['AKOKWA'], () => (c) => { c.fleetSize.vesselRounding = 'none'; }],
  ['first fit in the stated order (rule first-fit)', ['AKOKWA'], () => (c) => { c.deckPlan.rule = 'first-fit'; }],
  ['M/D/c in place of M/M/c and M/M/c in place of M/D/c', ['MGBIDI'], () => (c) => { c['shoreBase:mmc'].model = 'M/D/c'; c['shoreBase:mdc'].model = 'M/M/c'; }],
];

/* ------------------------------------------------------------ the checks */

const KEYS = GRADED_FIELDS.map(([, k]) => k);
must('READ carries exactly the eighteen graded keys, in order', JSON.stringify(Object.keys(READ)) === JSON.stringify(KEYS), Object.keys(READ).join(','));
const rows = GRADED_FIELDS.map(([tier, key, cls]) => {
  const value = READ[key][1](M);
  return { tier, key, cls, value, tol: gradedTolerance(key), case: READ[key][0] };
});
rows.forEach((r) => {
  must(`ONE ANSWER: ${r.key} is finite`, Number.isFinite(r.value), r.value);
  must(`ONE ANSWER: ${r.key} is not zero`, r.value !== 0, r.value);
  must(`ONE ANSWER: ${r.key} is not a whole number`, !Number.isInteger(r.value), r.value);
  must(`PRINTABLE: ${r.key} prints at six decimals in fewer than sixteen significant digits`, r.value.toFixed(6).replace(/^-/, '').replace('.', '').replace(/^0+/, '').length <= 15, r.value.toFixed(6));
  must(`NO BOUNDARY: ${r.key} is not within the twelve-digit key of a whole number`, Number(r.value.toPrecision(12)) !== Math.round(r.value), r.value);
});
for (let i = 0; i < rows.length; i += 1) {
  for (let j = i + 1; j < rows.length; j += 1) {
    must(`NO COLLISION: ${rows[i].key} and ${rows[j].key}`, Math.abs(rows[i].value - rows[j].value) > Math.max(rows[i].tol, rows[j].tol), `${rows[i].value} ${rows[j].value}`);
  }
}
// Every engine reading leaves every graded value bit-identical.
for (const name of OPEN_READINGS) {
  const V = await variant(name);
  rows.forEach((r) => {
    const v = READ[r.key][1](V);
    must(`READING-FREE: ${r.key} under ${name}`, Object.is(v, r.value), `${v} against ${r.value}`);
  });
}
// The stated-input readings: per field, moved (and stated in the case) or bit-identical.
const withCase = (cn, patch, fn) => {
  const saved = clone(CASES[cn]);
  patch(CASES[cn]);
  try { return fn(); } finally { Object.keys(CASES[cn]).forEach((k) => delete CASES[cn][k]); Object.assign(CASES[cn], saved); }
};
export const STATED_TABLE = [];
for (const [what, cases, mk] of STATED_READINGS) {
  for (const cn of cases) {
    rows.filter((r) => r.case === cn).forEach((r) => {
      const v = withCase(cn, mk(cn), () => READ[r.key][1](M));
      const moved = !Object.is(v, r.value);
      STATED_TABLE.push({ reading: what, key: r.key, moved, by: moved ? Math.abs(v - r.value) / r.tol : 0 });
      if (moved) must(`STATED: ${r.key} moves under "${what}" past its tolerance, so the case states that choice`, Math.abs(v - r.value) > r.tol, `${v} against ${r.value}`);
      else must(`STATED: ${r.key} is bit-identical under "${what}"`, Object.is(v, r.value), `${v}`);
    });
  }
}
// No graded value is a draw: the Monte Carlo on another seed and another draw count.
{
  const fv = MGBIDI.fleetVariability;
  const first = mgV(M);
  const saved = [fv.seed, fv.iterations];
  fv.seed = 7; fv.iterations = 5000;
  try {
    const second = mgV(M);
    must('DRAW-FREE: the Monte Carlo figures themselves move on the second seed (so the check below is not empty)', first.vesselDays.p90 !== second.vesselDays.p90 || first.vesselDays.mean !== second.vesselDays.mean, `${first.vesselDays.mean} ${second.vesselDays.mean}`);
    rows.forEach((r) => {
      const v = READ[r.key][1](M);
      must(`DRAW-FREE: ${r.key} on another seed and draw count`, Object.is(v, r.value), `${v} against ${r.value}`);
    });
  } finally {
    [fv.seed, fv.iterations] = saved;
  }
}

// SCENARIO CLAIMS the capstone briefs make, each asserted.
const nkm = nkM(M);
const nkd = nkD(M);
must('NKEREFI: the milk run is feasible and deck area binds it', nkm.voyages[0].feasible && nkm.voyages[0].binding.constraint === 'deck area', nkm.voyages[0].reasons.join(' '));
must('NKEREFI: no load sits on a capacity (the capacity reading cannot act)', nkm.voyages[0].constraints.every((c) => c.load !== c.capacity), 'loads');
must('NKEREFI: the weather factor acts on the milk run (sailing and field hours differ from calm)', nkm.voyages[0].hours.sailing !== nkm.voyages[0].legs.reduce((s, l) => s + l.calmHours, 0), 'weather');
must('NKEREFI: the dedicated plan sails three voyages', nkd.voyages.length === 3, nkd.voyages.length);
const akf = akF(M);
must('AKOKWA: deck area drives the milk run above the minimum visits, and four voyages are rounded up from it', akf.voyageSets[0].drivenBy === 'deck area' && akf.voyageSets[0].voyages === 4 && akf.voyageSets[0].voyagesExact > 3, JSON.stringify(akf.voyageSets[0].drivenBy));
must('AKOKWA: two vessels, with spare vessel-days and no shortfall', akf.vessels === 2 && akf.shortVesselDays === 0 && akf.spareVesselDays > 0, `${akf.vessels} ${akf.spareVesselDays}`);
const akd = akD(M);
must('AKOKWA: the deck cargo does not fit one voyage, and FFD carries it all on two with no overflow', akd.lowerBound === 2 && akd.overflow.length === 0 && akd.voyagesUsed === 2, `${akd.lowerBound} ${akd.overflow.length}`);
must('AKOKWA: no footprint area ties with a different weight (the FFD tie reading cannot act)', (() => { const it = AKOKWA.deckPlan.items; return it.every((a) => it.every((b) => a === b || a.lengthM * a.widthM !== b.lengthM * b.widthM)); })(), 'areas');
must('AKOKWA: the first voyage does not fill the usable deck exactly (the deck-fit reading cannot act)', akd.voyages[0].areaM2 < akd.usableAreaM2, `${akd.voyages[0].areaM2} ${akd.usableAreaM2}`);
const mgm = mgM(M);
const mgd = mgD(M);
must('MGBIDI: the base is steady with three berths and M/D/c waits less than M/M/c', mgm.berthUtilisation < 1 && mgd.meanWaitHours < mgm.meanWaitHours, `${mgm.berthUtilisation}`);
must('MGBIDI: the target is met at more berths than the base has, and the wait there is below the target (not on it)', mgm.target.berths > 3 && mgm.target.meanWaitHours < MGBIDI['shoreBase:mmc'].targetMeanWaitHours, JSON.stringify(mgm.target));
must('MGBIDI: the service runs lifts alongside bulk, so it is the fixed hours plus the longer of the two', mgm.serviceHours === 1.5 + Math.max(84 / 14, 540 / 120), mgm.serviceHours);
const mgv = mgV(M);
must('MGBIDI: the Monte Carlo reports its seed and draws in the basis and the exceedance sentence', mgv.basis.rule.includes(`seed ${MGBIDI.fleetVariability.seed}`) && typeof mgv.percentileDefinition === 'string', mgv.basis.rule.slice(0, 80));

/* ------------------------------------------------------------ the output */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`marine_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED\n`);
  if (process.argv.includes('--show')) rows.forEach((r) => console.log(`${r.tier.padEnd(13)} ${r.key.padEnd(36)} ${String(r.value)}`));
  process.exit(1);
}
const MAIN = import.meta.url === `file://${process.argv[1]}`;
if (MAIN && process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(rows.map(({ tier, key, cls, value }) => ({ tier, key, cls, value })))}\n`);
} else if (MAIN && process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify(CASES)}\n`);
} else if (MAIN && process.argv.includes('--stated')) {
  STATED_TABLE.forEach((s) => console.log(`${s.moved ? 'moves ' : 'same  '} ${s.key.padEnd(34)} ${s.reading}${s.moved ? ` (${s.by.toExponential(2)} tolerances)` : ''}`));
} else if (MAIN) {
  rows.forEach((r) => console.log(`${r.tier.padEnd(13)} ${r.key.padEnd(36)} ${String(r.value).padEnd(24)} tol ${r.tol}`));
  const moved = STATED_TABLE.filter((s) => s.moved).length;
  console.log(`marine_capstone: ${ASSERTS.length} assertions, 0 failed; ${OPEN_READINGS.length} engine readings and a second seed, every field bit-identical under each; ${STATED_READINGS.length} stated-input readings over ${STATED_TABLE.length} field pairs: ${moved} move past the tolerance and are stated in the case, ${STATED_TABLE.length - moved} bit-identical`);
}
