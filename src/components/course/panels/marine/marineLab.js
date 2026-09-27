// THE SC4 TEACHING LAB: Offshore & Marine Logistics.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/supplychain/marineLogistics.js, sha-identical with
// petrolord-engines e67e7ba, with the canonical Monte Carlo it imports from
// lib/stats and the exceedance sentence it imports from
// lib/conventions/percentile.js) on the vendored Ekene fixture
// (test-data/supplychain/ekene-marine), on the INPUTS of the vendored golden
// file (test-data/supplychain/goldens/marine_cases.json), or on the inputs a
// learner types into a calculator panel. The golden file's expected figures
// are oracle output and this lab never reads them: GOLDEN_ARGS carries the
// inputs only. marineLab.test.js asserts that every number a teaching reader
// returns is printed in the teaching digest.
//
// THIS IS AN APP COURSE. The Suite app is the Marine Logistics Planner, which
// runs the same engine file; the course's practicals run in the four
// calculator panels this lab feeds, so a learner without a Suite seat can work
// every exercise.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone case, and panelCapstoneGuard.test.js greps this file, the four
// panels and the learning page for every rendering of all eighteen answers and
// every capstone name, label and distinctive input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. The engine refuses by returning
// { error, field }; every route passes that object through untouched, so the
// lesson that quotes a refusal and the panel print the same words.
//
// NO HIDDEN DEFAULT. A control on a panel writes a stated input INTO the box
// (setStated); choosing "not stated" removes the key, and the engine refuses.
//
// Nothing here reads a clock, a random number or a locale. The one Monte Carlo
// (fleetVariability) is seeded by the seed the box states.
import FX from '@petrolord/engines/test-data/supplychain/ekene-marine/marine.json';
import GOLD from '@petrolord/engines/test-data/supplychain/goldens/marine_cases.json';
import {
  voyagePlan, fleetSize, fleetVariability, deckPlan, shoreBase, DEFAULTS, ACTIVITIES,
} from '@petrolord/engines/engines/supplychain/marineLogistics.js';

export { DEFAULTS, ACTIVITIES };

const clone = (o) => JSON.parse(JSON.stringify(o));

/** The golden file's INPUTS, by case id; its expected figures are left out. */
export const GOLDEN_ARGS = Object.freeze(Object.fromEntries(GOLD.cases.map((c) => [c.id, Object.freeze({ fn: c.fn, args: c.args })])));

/** The Ekene cluster as the fixture states it. */
export const FIXTURE = FX;

/* ------------------------------------------------ what a learner can type */

/** JSON a learner pastes. Returns { value } or { error }. */
export const parseJson = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the box is empty' };
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: `the box does not hold valid JSON (${e.message})` };
  }
};

/** Pretty JSON for a text box a learner edits. */
export const pretty = (v) => JSON.stringify(v, null, 1);

const isObj = (o) => o !== null && typeof o === 'object' && !Array.isArray(o);
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/**
 * A CASE FILE holds several calls under named BLOCK KEYS: the view's own name
 * ("fleetSize", "deckPlan") or the view's name and a colon and a name
 * ("voyagePlan:milk-run", "shoreBase:mmc"), so one view can offer several
 * blocks. No engine input key is a view name, so a box that holds one call's
 * inputs is read as it stands, and a box that holds a case file is read at the
 * block the view chose.
 */
export const VIEWS = Object.freeze(['voyagePlan', 'fleetSize', 'fleetVariability', 'deckPlan', 'shoreBase']);

/** The block keys of a case file a view can read, in the file's order ([] for one call's inputs). */
export const blockKeysOf = (c, view) => (isObj(c) ? Object.keys(c).filter((k) => (k === view || k.startsWith(`${view}:`)) && isObj(c[k])) : []);

/** The block of a box a key names, or the box itself when it holds one call's inputs. */
export const pick = (c, key) => (isObj(c) && own(c, key) && isObj(c[key]) ? c[key] : c);

const INDEX = /^\d+$/;
const step = (a, k) => (isObj(a) ? a[k] : (Array.isArray(a) && INDEX.test(k) ? a[Number(k)] : undefined));

/** The value at a dotted path of an object, or undefined. A numeric step reads an array entry (installations.0.cargo.deckAreaM2). */
export const getAt = (o, path) => path.split('.').reduce(step, o);

/**
 * Write ONE stated input into the block of the text in a box (a whole case
 * file or one call's inputs), at a dotted path. value undefined REMOVES the
 * key, so the engine refuses by name: the panel supplies no default. Returns
 * { text } or { error } (the box does not hold a JSON object).
 */
export const setStated = (text, blockKey, path, value) => {
  const p = parseJson(text);
  if (p.error) return p;
  if (!isObj(p.value)) return { error: 'the box does not hold a JSON object' };
  const next = clone(p.value);
  const block = pick(next, blockKey);
  if (!isObj(block)) return { error: `the box does not hold an object at ${blockKey}` };
  const keys = path.split('.');
  const container = (x) => isObj(x) || Array.isArray(x);
  let o = block;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = Array.isArray(o) ? Number(keys[i]) : keys[i];
    if (Array.isArray(o) && !INDEX.test(keys[i])) return { error: `${keys.slice(0, i + 1).join('.')} is a list and needs a number` };
    if (!container(o[k])) {
      if (value === undefined) return { text: pretty(next) };
      o[k] = INDEX.test(keys[i + 1]) ? [] : {};
    }
    o = o[k];
  }
  const lastKey = keys[keys.length - 1];
  if (Array.isArray(o)) {
    if (!INDEX.test(lastKey)) return { error: `${path} is a list entry and needs a number` };
    if (value === undefined) o.splice(Number(lastKey), 1); else o[Number(lastKey)] = value;
  } else if (value === undefined) delete o[lastKey]; else o[lastKey] = value;
  return { text: pretty(next) };
};

/**
 * A WEATHER OR DEMAND FACTOR, rewritten whole for a form: a fixed number, or a
 * triangular { min, mode, max }. A term is kept only when the old factor
 * carried it in the same form; nothing is converted, so the learner states the
 * new form and the engine checks it. form undefined returns undefined.
 */
export const factorFor = (form, old) => {
  if (form === undefined) return undefined;
  if (form === 'fixed') return typeof old === 'number' ? old : undefined;
  const was = isObj(old) ? old : {};
  return Object.fromEntries(['min', 'mode', 'max'].filter((k) => was[k] !== undefined).map((k) => [k, was[k]]));
};

/**
 * THE ROUTE OF A BLOCK, rewritten whole for a mode, with the installations
 * made to match: a milk run takes its distances from its legs, so every
 * installation's distance from the base is removed and the stops are listed in
 * the installations' order with no legs stated; a dedicated route reads each
 * installation's distance, so the stops and legs are removed and no distance is
 * invented. The engine then refuses by name whatever the new mode still needs.
 * Returns { text } or { error }.
 */
export const setRouteMode = (text, blockKey, mode) => {
  const p = parseJson(text);
  if (p.error) return p;
  if (!isObj(p.value)) return { error: 'the box does not hold a JSON object' };
  const next = clone(p.value);
  const block = pick(next, blockKey);
  if (!isObj(block)) return { error: `the box does not hold an object at ${blockKey}` };
  const insts = Array.isArray(block.installations) ? block.installations : [];
  if (mode === undefined) { delete block.route; return { text: pretty(next) }; }
  if (mode === 'milk-run') {
    insts.forEach((x) => { if (isObj(x)) delete x.distanceFromBaseNm; });
    block.route = { mode, stops: insts.filter(isObj).map((x) => x.id), legsNm: [] };
  } else {
    block.route = { mode };
  }
  return { text: pretty(next) };
};

/* ------------------------------------------------ the engine routes, unchanged */

export const voyagePlanOf = (a) => voyagePlan(clone(a));
export const fleetSizeOf = (a) => fleetSize(clone(a));
export const fleetVariabilityOf = (a) => fleetVariability(clone(a));
export const deckPlanOf = (a) => deckPlan(clone(a));
export const shoreBaseOf = (a) => shoreBase(clone(a));

/* ------------------------------------------------ the view routes: what a pasted box goes through */

const ROUTE = { voyagePlan: voyagePlanOf, fleetSize: fleetSizeOf, fleetVariability: fleetVariabilityOf, deckPlan: deckPlanOf, shoreBase: shoreBaseOf };
/** Run a view on a box at a block key (the view's name when the box holds one call's inputs). */
export const viewRun = (view, v, blockKey = view) => ROUTE[view](pick(v, blockKey));

/**
 * THE SAME CALL AT MORE BERTHS: the shore base the box states, run again with
 * the berths stated one to four above it (each an engine call, labelled on the
 * panel as a stated probe). Returns [[berths, result], ...], or [] when the box
 * does not state a whole number of berths.
 */
export const berthSweep = (a, extra = 4) => {
  if (!isObj(a) || !Number.isInteger(a.berths)) return [];
  return Array.from({ length: extra }, (_, i) => a.berths + i + 1).map((c) => [c, shoreBaseOf({ ...a, berths: c })]);
};

/* ------------------------------------------------ the teaching cases, as a panel starts */

const G = (id) => GOLDEN_ARGS[id].args;

/** The starting inputs of every panel view: the fixture and golden inputs only. */
export const STARTS = Object.freeze({
  // voyagePlan
  voyEkenePsv: G('ekene-voyage-milk-run-psv'),
  voyEkeneAhts: G('ekene-voyage-milk-run-ahts'),
  voyDedicatedPsv: G('ekene-voyage-dedicated-psv'),
  voyCalm: G('ekene-voyage-calm'),
  voyWeatherAll: G('ekene-voyage-weather-on-all-activities'),
  voyDeckOverloaded: G('ekene-voyage-deck-overloaded'),
  voyAtCapacity: G('voyage-at-capacity-feasible'),
  voyOneOver: G('voyage-one-over-deck-load'),
  voyTie: G('voyage-binding-tie-goes-to-deck-area'),
  voyTank: G('voyage-binding-tank'),
  voyDeadweight: G('voyage-deadweight-from-density'),
  voyDecimalSum: G('voyage-decimal-sum-at-capacity'),
  voyZeroLeg: G('voyage-zero-distance-leg'),
  voySkokoDay: G('skoko-2024-table1-psv-daily-fuel'),
  voySkokoAhts: G('skoko-2024-table7-ahts-optimal-fuel'),
  // fleetSize
  fleetEkenePsv: G('ekene-fleet-psv-milk-run'),
  fleetEkeneAhts: G('ekene-fleet-ahts-milk-run'),
  fleetDedicatedPsv: G('ekene-fleet-psv-dedicated'),
  fleetDedicatedAhts: G('ekene-fleet-ahts-dedicated'),
  fleetFractional: G('ekene-fleet-fractional'),
  fleetNearest: G('ekene-fleet-nearest-vessels'),
  fleetCalm: G('ekene-fleet-calm'),
  fleetExactlyThree: G('fleet-demand-exactly-three-voyages'),
  fleetJustOverThree: G('fleet-demand-just-over-three-voyages'),
  fleetDecimalThree: G('fleet-decimal-ratio-2-1-over-0-7-is-three'),
  fleetMinVisits: G('fleet-min-visits-drive'),
  fleetTieDemand: G('fleet-min-visits-equal-demand-names-demand'),
  fleetNoDemand: G('fleet-no-demand-no-visits'),
  fleetTank: G('fleet-tank-drives'),
  fleetVesselsUp: G('fleet-vessels-up'),
  fleetNearestShort: G('fleet-vessels-nearest-short'),
  fleetVesselsNone: G('fleet-vessels-none'),
  fleetHalfUp: G('fleet-vessels-nearest-half-rounds-up'),
  fleetExactlyTwo: G('fleet-vessel-days-exactly-two-vessels'),
  fleetLonger: G('fleet-voyage-longer-than-available'),
  fleetAvailableEqual: G('fleet-available-equals-period'),
  // fleetVariability
  varEkenePsv: G('ekene-variability-psv-milk-run'),
  varEkeneAhts: G('ekene-variability-ahts-dedicated'),
  varFixed: G('variability-fixed-factors-equal-fleet-size'),
  varWeatherOnly: G('variability-weather-only'),
  varDemandOnly: G('variability-demand-only-fractional'),
  varPlannedZero: G('variability-planned-zero'),
  varAtCapacity: G('variability-at-capacity-is-not-short'),
  varShortAlways: G('variability-one-vessel-short-always'),
  // deckPlan
  deckEkeneFfd: G('ekene-deck-one-voyage-ffd'),
  deckEkeneFirstFit: G('ekene-deck-one-voyage-first-fit'),
  deckEkeneTwo: G('ekene-deck-two-voyages-ffd'),
  deckLightLoad: G('ekene-deck-light-load-limit'),
  deckCgj60: G('ffd-wikipedia-cgj-capacity-60'),
  deckCgj61: G('ffd-wikipedia-cgj-capacity-61'),
  deckCgjFirstFit: G('ffd-wikipedia-cgj-first-fit-order'),
  deckHuangLu: G('ffd-wikipedia-huang-lu-capacity-75'),
  deckDosa: G('ffd-wikipedia-dosa-tight-example'),
  deckTies: G('deck-ties-heavier-first-then-id'),
  deckExactFit: G('deck-exact-fit-inclusive'),
  deckTooLarge: G('deck-item-larger-than-deck'),
  deckTooHeavy: G('deck-item-heavier-than-deck-load'),
  deckAreaStops: G('deck-overflow-area-stops-it'),
  deckLoadStops: G('deck-overflow-deck-load-stops-it'),
  deckBothStop: G('deck-overflow-both-stop-it'),
  deckNoOneVoyage: G('deck-overflow-no-one-voyage-has-both'),
  deckExactRoom: G('deck-overflow-at-exact-remaining-room'),
  // shoreBase
  baseEkeneMmc: G('ekene-base-mmc'),
  baseEkeneMdc: G('ekene-base-mdc'),
  baseTargetMmc: G('ekene-base-mmc-target-one-hour'),
  baseTargetMdc: G('ekene-base-mdc-target-one-hour'),
  baseSequential: G('ekene-base-sequential-service'),
  baseTwelveHour: G('ekene-base-twelve-hour-day'),
  baseOneBerth: G('base-refuse-ekene-one-berth-overloaded'),
  baseMd1: G('base-md1-pollaczek-khinchin'),
  baseMdc3: G('base-mdc-three-berths'),
  baseAr51c5: G('adan-resing-table-5-1-c5'),
  baseAr52c20: G('adan-resing-table-5-2-c20'),
  baseIversen1: G('iversen-2001-example-12-3-1-system-1'),
  baseIversen2: G('iversen-2001-example-12-3-1-system-2'),
  baseJustBelow: G('base-just-below-saturation'),
  baseTargetExact: G('base-target-met-exactly-by-current'),
  baseTargetZero: G('base-target-zero-unreachable'),
});

/** The starts the engine refuses by design, each shown with its refusal. */
export const REFUSED_STARTS = Object.freeze(['baseOneBerth']);

/* ------------------------------------------------ the teaching readers (pinned by marineLab.test.js) */

/** The Ekene PSV milk run: hours, days, fuel, cost, the deadweight load and the binding utilisation. */
export const voyageReader = () => {
  const v = voyagePlanOf(STARTS.voyEkenePsv).voyages[0];
  return { hours: v.hours.total, days: v.days, fuelT: v.fuelT.total, fuelCost: v.fuelCost, deadweightT: v.load.deadweightT, binding: v.binding.utilisation };
};

/** The Ekene week on the PSV milk run: the voyages, the vessel-days and the vessels. */
export const fleetReader = () => {
  const r = fleetSizeOf(STARTS.fleetEkenePsv);
  return {
    voyagesExact: r.voyageSets[0].voyagesExact, voyages: r.voyageSets[0].voyages, vesselDays: r.vesselDays, vesselsExact: r.vesselsExact,
    vessels: r.vessels, spare: r.spareVesselDays, utilisation: r.fleetUtilisation, fuelT: r.fuelT,
  };
};

/** The Ekene voyage of deck cargo: both rules on one voyage, and first-fit decreasing on two. */
export const deckReader = () => {
  const f = deckPlanOf(STARTS.deckEkeneFfd);
  const ff = deckPlanOf(STARTS.deckEkeneFirstFit);
  const two = deckPlanOf(STARTS.deckEkeneTwo);
  return {
    ffdArea: f.voyages[0].areaM2, ffdOverflow: f.overflow.length, firstFitArea: ff.voyages[0].areaM2, firstFitOverflow: ff.overflow.length,
    lowerBound: f.lowerBound, twoSecondArea: two.voyages[1].areaM2, totalArea: f.totalAreaM2,
  };
};

/** The Ekene supply base: M/M/c and M/D/c. */
export const baseReader = () => {
  const m = shoreBaseOf(STARTS.baseEkeneMmc);
  const d = shoreBaseOf(STARTS.baseEkeneMdc);
  return { utilisation: m.berthUtilisation, probabilityWait: m.probabilityWait, meanQueue: m.meanQueue, mmcWait: m.meanWaitHours, mdcWait: d.meanWaitHours, service: m.serviceHours };
};

/** The Ekene week under variability: seeded estimates; none of them is graded. */
export const variabilityReader = () => {
  const r = fleetVariabilityOf(STARTS.varEkenePsv);
  return {
    seed: STARTS.varEkenePsv.seed, iterations: STARTS.varEkenePsv.iterations,
    mean: r.vesselDays.mean, p90: r.vesselDays.p90, p50: r.vesselDays.p50, p10: r.vesselDays.p10,
    probabilityShort: r.probabilityShort, expectedShort: r.expectedShortVesselDays, planDays: r.plan.vesselDays,
  };
};
