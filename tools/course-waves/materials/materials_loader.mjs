// A NODE 18 LOADER HOOK FOR THE NAMED WRONG-METHOD AND OPEN-READING VARIANTS
// OF inventory.js THAT discriminate.mjs AND materials_capstone.mjs CALL.
//
// engines/supplychain/inventory.js is plain JavaScript (its three imports,
// lib/stats/stats.js, lib/conventions/percentile.js and
// engines/hse/safetyStats.js, are plain JavaScript too), so no type stripping
// is needed; this hook exists for the variants alone.
//
// A URL for inventory.js carrying ?variant=<name> loads the SAME source with
// the named textual substitutions from VARIANTS below: a plausible wrong method
// a learner might use (the EOQ without its factor 2, the holding rate taken as
// the holding cost, the lead-time variance left out of sigma, z read at one
// less the service level, the Poisson loss off by one, downtime counted once a
// year), taken from the engine's own negative control list
// (negcontrol_inventory.sh) and a few more, or the other side of a reading the
// engine states (exact comparison where the engine compares at twelve
// significant digits, halves rounded downward, a class or band minimum read
// exclusive, a discount or spares tie taken the other way, a stockout counted
// at equality, the P90 and P10 of a sampled figure swapped). A variant is one
// [find, replace] pair or a list of them; each find must match EXACTLY ONCE, or
// the load throws naming the variant, so a variant can never silently run the
// true engine. The true engine is loaded with no query and is never patched.
// No digest line and no graded field is computed from a variant.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// [find, replace] or [[find, replace], ...]: every find is an exact string that must occur exactly once in inventory.js.
export const VARIANTS = {
  // ---- wrong methods (discriminate.mjs), the engine's negative control list first ----
  // criticality
  criticality_weights_ignored: [
    'const v = (c.weight * it.scores[c.id]) / scoreMax;',
    'const v = (25 * it.scores[c.id]) / scoreMax;',
  ],
  criticality_not_over_score_max: [
    'const v = (c.weight * it.scores[c.id]) / scoreMax;',
    'const v = (c.weight * it.scores[c.id]) / 5;',
  ],
  criticality_scores_summed: [
    'const v = (c.weight * it.scores[c.id]) / scoreMax;',
    'const v = it.scores[c.id];',
  ],
  // ABC
  abc_share_before_under_at_or_below: [
    "cls = key12(after) <= key12(aPct) ? 'A' : key12(after) <= key12(bPct) ? 'B' : 'C';",
    "cls = key12(before) <= key12(aPct) ? 'A' : key12(before) <= key12(bPct) ? 'B' : 'C';",
  ],
  abc_ranked_lowest_first: [
    '? b.annualValue - a.annualValue : cmpStr(a.id, b.id)));',
    '? a.annualValue - b.annualValue : cmpStr(a.id, b.id)));',
  ],
  abc_value_without_unit_cost: [
    'const rows = items.map((it) => ({ id: it.id, annualValue: it.annualUsage * it.unitCost }));',
    'const rows = items.map((it) => ({ id: it.id, annualValue: it.annualUsage }));',
  ],
  // EOQ
  eoq_without_factor_two: [
    'const q = Math.sqrt((2 * orderCost * annualDemand) / h);',
    'const q = Math.sqrt((orderCost * annualDemand) / h);',
  ],
  eoq_holding_rate_as_holding_cost: [
    '    h = holdingRate * unitCost;',
    '    h = holdingRate;',
  ],
  eoq_holding_on_whole_lot: [
    '  const holdingCost = (h * qr) / 2;',
    '  const holdingCost = h * qr;',
  ],
  eoq_costs_at_the_unrounded_quantity: [
    ['  const orderingCost = (orderCost * annualDemand) / qr;', '  const orderingCost = (orderCost * annualDemand) / q;'],
    ['  const holdingCost = (h * qr) / 2;', '  const holdingCost = (h * q) / 2;'],
  ],
  rounding_up_taken_as_nearest: [
    "const n = r.rule === 'up' ? Math.ceil(q)",
    "const n = r.rule === 'up' ? Math.floor(q + 0.5)",
  ],
  // quantity discounts
  discount_break_never_a_candidate: [
    '      quantity = lo;',
    '      quantity = null;',
  ],
  discount_fixed_cost_not_carried: [
    'F.push(F[i - 1] + (breaks[i - 1].unitPrice - breaks[i].unitPrice) * breaks[i].minQuantity);',
    'F.push((breaks[i - 1].unitPrice - breaks[i].unitPrice) * breaks[i].minQuantity);',
  ],
  discount_incremental_priced_all_units: [
    "const lot = discountType === 'all-units' ? v * Q : F[i] + v * Q;",
    'const lot = v * Q;',
  ],
  discount_eoq_without_fixed_cost: [
    "const q = Math.sqrt((2 * D * (A + (discountType === 'all-units' ? 0 : F[i]))) / (r * v));",
    'const q = Math.sqrt((2 * D * A) / (r * v));',
  ],
  // safety stock (normal)
  sigma_without_lead_time_variance: [
    'const sigma = Math.sqrt(P * demandSd * demandSd + demandMean * demandMean * leadTimeSd * leadTimeSd);',
    'const sigma = Math.sqrt(P * demandSd * demandSd);',
  ],
  sigma_sd_times_period: [
    'const sigma = Math.sqrt(P * demandSd * demandSd + demandMean * demandMean * leadTimeSd * leadTimeSd);',
    'const sigma = Math.sqrt(P * P * demandSd * demandSd + demandMean * demandMean * leadTimeSd * leadTimeSd);',
  ],
  review_period_left_out: [
    '  const P = leadTime + reviewPeriod;',
    '  const P = leadTime;',
  ],
  z_at_one_less_the_level: [
    'inverseNormal(serviceLevel) : solveLoss',
    'inverseNormal(1 - serviceLevel) : solveLoss',
  ],
  fill_target_without_one_less_the_level: [
    'solveLoss((orderQuantity * (1 - serviceLevel)) / sigma)',
    'solveLoss((orderQuantity * serviceLevel) / sigma)',
  ],
  fill_rate_read_as_cycle_service: [
    "const kExact = serviceMeasure === 'cycle-service' ? inverseNormal(serviceLevel)",
    'const kExact = true ? inverseNormal(serviceLevel)',
  ],
  safety_stock_not_scaled_by_sigma: [
    '  const safety = k * sigma;',
    '  const safety = k;',
  ],
  // Poisson
  poisson_loss_off_by_one: [
    '    Ls -= 1 - F;',
    '    Ls -= 1 - F - p;',
  ],
  poisson_mean_without_review: [
    '  const m = demandRate * (leadTime + reviewPeriod);',
    '  const m = demandRate * leadTime;',
  ],
  poisson_fill_limit_at_the_level: [
    "const limit = serviceMeasure === 'fill-rate' ? orderQuantity * (1 - serviceLevel) : null;",
    "const limit = serviceMeasure === 'fill-rate' ? orderQuantity * serviceLevel : null;",
  ],
  // insurance spares
  insurance_downtime_without_days: [
    'const downtime = r.expectedShort * daysPerYear * downtimeCostPerDay;',
    'const downtime = r.expectedShort * downtimeCostPerDay;',
  ],
  insurance_holding_on_n_less_one: [
    '    const holding = r.s * holdingPerSpare;',
    '    const holding = Math.max(0, r.s - 1) * holdingPerSpare;',
  ],
  insurance_holding_without_rate: [
    '  const holdingPerSpare = unitCost * holdingRate;',
    '  const holdingPerSpare = unitCost;',
  ],
  insurance_fill_rate_as_no_shortage: [
    'fillRate: r.s === 0 ? 0 : rows[r.s - 1].cumulative,',
    'fillRate: r.cumulative,',
  ],
  insurance_mean_without_lead_time: [
    '  const m = (failuresPerYear * leadTimeDays) / daysPerYear;',
    '  const m = failuresPerYear / daysPerYear;',
  ],
  insurance_mean_over_a_year_of_lead_time: [
    '  const m = (failuresPerYear * leadTimeDays) / daysPerYear;',
    '  const m = failuresPerYear;',
  ],
  // slow-moving
  write_down_not_over_one_hundred: [
    '    const writeDown = (stockValue * b.writeDownPct) / 100;',
    '    const writeDown = stockValue * b.writeDownPct;',
  ],
  write_down_on_quantity: [
    '    const writeDown = (stockValue * b.writeDownPct) / 100;',
    '    const writeDown = (it.onHand * b.writeDownPct) / 100;',
  ],
  band_one_below: [
    'for (let i = 0; i < bands.length; i += 1) if (key12(it.monthsSinceLastIssue) >= key12(bands[i].minMonths)) bi = i;',
    'for (let i = 0; i < bands.length; i += 1) if (key12(it.monthsSinceLastIssue) >= key12(bands[i].minMonths)) bi = Math.max(0, i - 1);',
  ],
  excess_on_all_stock: [
    'const excessQuantity = it.monthlyUsage > 0 ? Math.max(0, it.onHand - excessCoverMonths * it.monthlyUsage) : it.onHand;',
    'const excessQuantity = it.onHand;',
  ],
  // ---- the other side of each reading the engine states (never moves a graded field) ----
  // Exact comparison where the engine compares two figures at twelve significant digits.
  reading_exact_comparison: [
    'const key12 = (x) => Number(x.toPrecision(DEFAULTS.TIE_DIGITS));',
    'const key12 = (x) => x;',
  ],
  // The nearest multiple taken with halves downward.
  reading_nearest_halves_down: [
    ': Math.floor(q + 0.5);',
    ': Math.ceil(q - 0.5);',
  ],
  // A criticality class minimum read exclusive (the score must be above it).
  reading_class_minimum_exclusive: [
    'const byScore = classes.find((c) => key12(score) >= key12(c.minScore));',
    'const byScore = classes.find((c) => key12(score) > key12(c.minScore) || c.minScore === 0);',
  ],
  // A discount tie taken to the larger quantity.
  reading_discount_tie_larger: [
    ': a.quantity - b.quantity));',
    ': b.quantity - a.quantity));',
  ],
  // A Poisson service target met only strictly above it.
  reading_poisson_target_exclusive: [
    '? (row) => key12(row.cumulative) >= key12(serviceLevel)',
    '? (row) => key12(row.cumulative) > key12(serviceLevel)',
  ],
  // A Poisson fill-rate target met only strictly below the stated units short.
  reading_poisson_fill_exclusive: [
    ': (row) => key12(row.expectedShort) <= key12(limit);',
    ': (row) => key12(row.expectedShort) < key12(limit);',
  ],
  // An ABC tie in annual usage value broken by id descending.
  reading_abc_ties_by_id_descending: [
    '? b.annualValue - a.annualValue : cmpStr(a.id, b.id)));',
    '? b.annualValue - a.annualValue : cmpStr(b.id, a.id)));',
  ],
  // An insurance-spares tie taken to more spares.
  reading_spares_tie_more: [
    'if (key12(o.totalCost) < key12(best.totalCost)) best = o;',
    'if (key12(o.totalCost) <= key12(best.totalCost)) best = o;',
  ],
  // A slow-moving band reached only strictly above its minimum.
  reading_band_minimum_exclusive: [
    'if (key12(it.monthsSinceLastIssue) >= key12(bands[i].minMonths)) bi = i;',
    'if (key12(it.monthsSinceLastIssue) > key12(bands[i].minMonths) || i === 0) bi = i;',
  ],
  // Stock at exactly the cover limit counted as excess.
  reading_cover_limit_inclusive: [
    ': key12(cover) > key12(excessCoverMonths);',
    ': key12(cover) >= key12(excessCoverMonths);',
  ],
  // A lead-time demand equal to the reorder point counted as a stockout.
  reading_stockout_at_equality: [
    ['    short[i] = x > reorderPoint ? x - reorderPoint : 0;', '    short[i] = x >= reorderPoint ? x - reorderPoint : 0;'],
    ['    if (x > reorderPoint) outs += 1;', '    if (x >= reorderPoint) outs += 1;'],
  ],
  // The reorder point for a service level read one sorted draw higher.
  reading_service_index_one_high: [
    'Math.ceil(key12(serviceLevel * iterations)) - 1)];',
    'Math.ceil(key12(serviceLevel * iterations)))];',
  ],
  // The P90 and P10 of a sampled lead time and lead-time demand swapped (P90 read as the high figure).
  reading_p90_as_high: [
    'const pick = (s) => ({ mean: s.mean, p90: s.p90, p50: s.p50, p10: s.p10, min: s.min, max: s.max });',
    'const pick = (s) => ({ mean: s.mean, p90: s.p10, p50: s.p50, p10: s.p90, min: s.min, max: s.max });',
  ],
};

const pairs = (v) => (Array.isArray(v[0]) ? v : [v]);

export async function load(url, context, nextLoad) {
  const u = new URL(url);
  if (u.protocol !== 'file:') return nextLoad(url, context);
  const variant = u.searchParams.get('variant');
  if (variant && u.pathname.endsWith('/inventory.js')) {
    let src = fs.readFileSync(fileURLToPath(`file://${u.pathname}`), 'utf8');
    const v = VARIANTS[variant];
    if (!v) throw new Error(`materials_loader: no variant named ${variant}`);
    for (const [find, repl] of pairs(v)) {
      const n = src.split(find).length - 1;
      if (n !== 1) throw new Error(`materials_loader: variant ${variant} matched ${n} times; it must match exactly once: ${find.slice(0, 60)}`);
      src = src.replace(find, () => repl);
    }
    return { format: 'module', source: src, shortCircuit: true };
  }
  return nextLoad(url, context);
}
