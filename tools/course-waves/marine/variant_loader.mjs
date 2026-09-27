// A NODE 18 LOADER HOOK FOR THE NAMED WRONG-METHOD AND OPEN-READING VARIANTS
// OF marineLogistics.js THAT discriminate.mjs AND marine_capstone.mjs CALL.
//
// engines/supplychain/marineLogistics.js is plain JavaScript and imports only
// lib/stats/stats.js and lib/conventions/percentile.js, so the true engine
// needs no hook. A URL for marineLogistics.js carrying ?variant=<name> loads
// the SAME source with the named textual substitutions from VARIANTS below: a
// plausible wrong method a learner might use (the weather factor on every
// activity, the usable deck fraction ignored, bulk counted in tonnes, voyages
// rounded to the nearest, minimum visits ignored, vessels over the period,
// the 24-hour clock, the Erlang B recursion one step too far, M/D/c answered
// as M/M/c, FFD sorted ascending, ...), taken from the engine's own negative
// control list (negcontrol_marine.sh, the same find strings), or the other
// side of a reading the engine states (a load at capacity read as overloaded,
// a binding tie to the last constraint, counts rounded up without the
// twelve-digit key, nearest halves rounded down, a tie of demand and minimum
// visits named as minimum visits, FFD ties lighter first, a deck fit read
// strictly, the berth target read strictly, short at equality, the P90 of a
// requirement read at the high side). A variant is one [find, replace] pair
// or a list of them; each find must match EXACTLY ONCE, or the load throws
// naming the variant, so a variant can never silently run the true engine.
// The true engine is loaded with no query and is never patched. No digest
// line and no graded field is computed from a variant.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// [find, replace] or [[find, replace], ...]: every find is an exact string that must occur exactly once in marineLogistics.js.
export const VARIANTS = {
  // ---- wrong methods (discriminate.mjs), the engine's negative control list first ----
  weather_on_every_activity: [
    'h[a] = appliesTo.includes(a) ? calm[a] * factor : calm[a];',
    'h[a] = calm[a] * factor;',
  ],
  weather_ignored: [
    'h[a] = appliesTo.includes(a) ? calm[a] * factor : calm[a];',
    'h[a] = calm[a];',
  ],
  speed_read_as_kmh: [
    'sailing: nm / vessel.speedKnots,',
    'sailing: nm / (vessel.speedKnots * 1.852),',
  ],
  return_leg_dropped: [
    'const nm = sum(v.legs.map((l) => l.nm));',
    'const nm = sum(v.legs.slice(0, -1).map((l) => l.nm));',
  ],
  dedicated_one_way: [
    "{ from: x.id, to: 'base', nm: x.distanceFromBaseNm }",
    "{ from: x.id, to: 'base', nm: 0 }",
  ],
  every_activity_at_sailing_rate: [
    'for (const a of ACTIVITIES) f[a] = hours[a] * vessel.fuelTPerHour[a];',
    'for (const a of ACTIVITIES) f[a] = hours[a] * vessel.fuelTPerHour.sailing;',
  ],
  fuel_price_per_thousand_tonnes: [
    'fuelCost: fuelT.total * fuelPricePerT,',
    'fuelCost: (fuelT.total * fuelPricePerT) / 1000,',
  ],
  usable_fraction_ignored: [
    'capacity: vessel.deckAreaM2 * vessel.deckUsableFraction,',
    'capacity: vessel.deckAreaM2,',
  ],
  deadweight_without_bulk: [
    'deadweightT: deckWeightT + sum(products.map((p) => bulkM3[p.id] * p.densityTPerM3)),',
    'deadweightT: deckWeightT,',
  ],
  bulk_m3_as_tonnes: [
    'bulkM3[p.id] * p.densityTPerM3',
    'bulkM3[p.id]',
  ],
  voyages_rounded_nearest: [
    "const roundVoyages = (x, rule) => (rule === 'up' ? ceil12(x) : x);",
    "const roundVoyages = (x, rule) => (rule === 'up' ? Math.round(x) : x);",
  ],
  minimum_visits_ignored: [
    'const exact = byDemand ? r : s.minVisits;',
    'const exact = r;',
  ],
  vessels_over_the_period: [
    'const vesselsExact = vesselDays / vesselAvailableDays;',
    'const vesselsExact = vesselDays / a.periodDays;',
  ],
  shortfall_never_reported: [
    'const shortVesselDays = key12(vesselDays) > key12(capacityDays) ? vesselDays - capacityDays : 0;',
    'const shortVesselDays = 0;',
  ],
  erlang_b_one_step_too_far: [
    'for (let k = 1; k <= c - 1; k += 1) b = (a * b) / (k + a * b);',
    'for (let k = 1; k <= c; k += 1) b = (a * b) / (k + a * b);',
  ],
  wait_without_one_minus_rho: [
    'const wqM = (piW * S) / (c * (1 - rho));',
    'const wqM = (piW * S) / c;',
  ],
  cosmetatos_correction_dropped: [
    'const wq = (wqM / 2) * (1 + ((1 - rho) * (c - 1) * (Math.sqrt(4 + 5 * c) - 2)) / (16 * rho * c));',
    'const wq = wqM / 2;',
  ],
  mdc_answered_as_mmc: [
    "if (model === 'M/M/c') return { rho, piW, wq: wqM };",
    'return { rho, piW, wq: wqM };',
  ],
  concurrent_service_summed: [
    '(service.concurrent ? Math.max(liftHours, bulkHours) : liftHours + bulkHours)',
    '(liftHours + bulkHours)',
  ],
  twenty_four_hour_clock: [
    'const lambda = arrivalsPerDay / workingHoursPerDay;',
    'const lambda = arrivalsPerDay / 24;',
  ],
  ffd_ascending: [
    'list.sort((p, q) => (key12(q.areaM2) - key12(p.areaM2))',
    'list.sort((p, q) => (key12(p.areaM2) - key12(q.areaM2))',
  ],
  deck_load_ignored: [
    'const loadFits = (b) => key12(b.weightT + u.weightT) <= key12(deck.loadT);',
    'const loadFits = () => true;',
  ],
  last_fit: [
    'const bin = bins.find((b) =>',
    'const bin = bins.slice().reverse().find((b) =>',
  ],
  deck_usable_fraction_ignored: [
    'const usable = deck.areaM2 * deck.usableFraction;',
    'const usable = deck.areaM2;',
  ],
  mc_draw_order_swapped: [
    'const w = draw(wTri, rng);\n    const f = draw(fTri, rng);',
    'const f = draw(fTri, rng);\n    const w = draw(wTri, rng);',
  ],
  // ---- the other side of each reading the engine states (never moves a graded field) ----
  // A load exactly at a capacity read as overloaded.
  reading_capacity_exclusive: [
    'const over = rows.filter((r) => key12(r.load) > key12(r.capacity));',
    'const over = rows.filter((r) => key12(r.load) >= key12(r.capacity));',
  ],
  // A binding tie given to the last constraint in the order.
  reading_binding_tie_last: [
    'for (const r of rows) if (key12(r.utilisation) > key12(best.utilisation)) best = r;',
    'for (const r of rows) if (key12(r.utilisation) >= key12(best.utilisation)) best = r;',
  ],
  // Counts rounded up on the raw double, without the twelve-digit key.
  reading_ceil_without_key: [
    'const ceil12 = (x) => Math.ceil(key12(x));',
    'const ceil12 = (x) => Math.ceil(x);',
  ],
  // Nearest whole vessels with halves rounded down.
  reading_nearest_halves_down: [
    "rule === 'nearest' ? Math.floor(key12(x) + 0.5)",
    "rule === 'nearest' ? Math.ceil(key12(x) - 0.5)",
  ],
  // Demand exactly equal to the minimum visits named as minimum visits (fleetSize and the Monte Carlo alike).
  reading_tie_names_minimum_visits: [
    ['const byDemand = key12(r) > 0 && key12(r) >= s.minVisits;', 'const byDemand = key12(r) > 0 && key12(r) > s.minVisits;'],
    ['const exact = key12(r) > 0 && key12(r) >= s.minVisits ? r : s.minVisits;', 'const exact = key12(r) > 0 && key12(r) > s.minVisits ? r : s.minVisits;'],
  ],
  // First-fit decreasing ties of equal area put the lighter unit first.
  reading_ffd_tie_lighter_first: [
    '|| (key12(q.weightT) - key12(p.weightT))',
    '|| (key12(p.weightT) - key12(q.weightT))',
  ],
  // A deck fit read strictly (a unit that fills the deck exactly does not fit).
  reading_deck_fit_exclusive: [
    'key12(b.areaM2 + u.areaM2) <= key12(usable)',
    'key12(b.areaM2 + u.areaM2) < key12(usable)',
  ],
  // The berth target met only strictly below it.
  reading_berth_target_strict: [
    'if (key12(qc.wq) <= key12(targetMeanWaitHours))',
    'if (key12(qc.wq) < key12(targetMeanWaitHours))',
  ],
  // Short at equality in the Monte Carlo.
  reading_short_at_equality: [
    'const short = key12(d) > key12(capacityDays);',
    'const short = key12(d) >= key12(capacityDays);',
  ],
  // The P90 of a requirement read at the high side (P90 and P10 swapped).
  reading_p90_high: [
    'const pick = (s) => ({ mean: s.mean, p90: s.p90, p50: s.p50, p10: s.p10, min: s.min, max: s.max });',
    'const pick = (s) => ({ mean: s.mean, p90: s.p10, p50: s.p50, p10: s.p90, min: s.min, max: s.max });',
  ],
};

const pairs = (v) => (Array.isArray(v[0]) ? v : [v]);

export async function load(url, context, nextLoad) {
  const u = new URL(url);
  if (u.protocol !== 'file:') return nextLoad(url, context);
  const variant = u.searchParams.get('variant');
  if (variant && u.pathname.endsWith('/marineLogistics.js')) {
    let src = fs.readFileSync(fileURLToPath(`file://${u.pathname}`), 'utf8');
    const v = VARIANTS[variant];
    if (!v) throw new Error(`variant_loader: no variant named ${variant}`);
    for (const [find, repl] of pairs(v)) {
      const n = src.split(find).length - 1;
      if (n !== 1) throw new Error(`variant_loader: variant ${variant} matched ${n} times; it must match exactly once: ${find.slice(0, 60)}`);
      src = src.replace(find, () => repl);
    }
    return { format: 'module', source: src, shortCircuit: true };
  }
  return nextLoad(url, context);
}
