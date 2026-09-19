// THE SUPPLY CAPSTONE GENERATOR. Runs the three capstone records through the
// vendored engines and writes the eighteen graded fields, six a tier, with
// their tolerances, the precision declaration, and the draft capstone prompts.
//
// Nothing here is read by supply_dump.mjs and nothing here is quoted into a
// lesson. The digest and the capstone are two separate roads, and
// gate_capstone_leak.py sweeps both directions to keep it that way.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE, stored at the engine's
// full precision. None is arithmetic performed here. The one thing this file
// does itself is carry an engine return into the next engine call exactly as
// the live apps do: the two tanks' standard volumes are summed into the closing
// dip reconcileStock takes (the Terminal & Depot page sums its tanks the same
// way), the lane's trips a truck a day go into fleetSizing, and the landed cost
// per litre goes into buildPumpPrice (both as the Fuel Pricing page does).
//
// TOLERANCES, one table, CLASSES, and one rule. A learner is asked for each figure
// to a stated number of decimals (the prompt says which), and the tolerance is
// ONE UNIT IN THAT LAST PLACE: the engine itself rounds several of these figures
// at that place (CIF and the landed total to the cent, the per-litre figures to
// four decimals), so a correct reading can sit half a unit from the stored value
// on the engine's side and half a unit on the learner's. The one integer, the
// truck count, is graded at 0.5, which admits exactly one integer. Every
// tolerance clears gradeprecision.py (half a unit in the declared place) and
// discriminate.mjs is run at these tolerances.
//
// Usage: node supply_capstone.mjs [--json]
import fs from 'fs';
import * as K from './supply_fields_capstone.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-supply-nextgen/packages/engines';
const TD = await import(`${ROOT}/engines/downstream/terminalDepot.js`);
const FP = await import(`${ROOT}/engines/downstream/fuelPricing.js`);

/** decimals the prompt asks for, and the tolerance: one unit there (0.5 for a whole number). */
export const CLASSES = {
  m3: { decimals: 2, tol: 0.01, re: /_m3$/ },
  prob: { decimals: 4, tol: 0.0001, re: /_probability_of_waiting$/ },
  min: { decimals: 2, tol: 0.01, re: /_min$/ },
  days: { decimals: 2, tol: 0.01, re: /_days_of_cover$/ },
  ngnPerLitre: { decimals: 4, tol: 0.0001, re: /_ngn$/ },
  usd: { decimals: 2, tol: 0.01, re: /_usd$/ },
  fx: { decimals: 2, tol: 0.01, re: /_fx$/ },
  count: { decimals: 0, tol: 0.5, re: /_required$/ },
};
const classOf = (key) => {
  const hit = Object.entries(CLASSES).filter(([, c]) => c.re.test(key));
  if (hit.length !== 1) throw new Error(`${key} matches ${hit.length} tolerance classes`);
  return hit[0][0];
};

/* ---------------------------- OKOMU ---------------------------- */
const dip = (t, table) => TD.dipToStandardVolume({ strapping: table, heightMm: t.dipMm, waterMm: t.waterMm, vcf: t.vcfTyped });
const ok1 = dip(K.OKOMU_T1, K.OKOMU_T1_TABLE);
const ok2 = dip(K.OKOMU_T2, K.OKOMU_T2_TABLE);
for (const [n, r] of [['OK-1', ok1], ['OK-2', ok2]]) if (r.error || r.standardM3 === null) throw new Error(`${n} refused: ${r.error}`);
const okDay = TD.reconcileStock({ ...K.OKOMU_DAY, closingDippedM3: ok1.standardM3 + ok2.standardM3 });
if (okDay.error || okDay.unaccountedM3 === null) throw new Error(`OKOMU day refused: ${okDay.error}`);

/* --------------------------- OGWASHI --------------------------- */
const rack = TD.rackQueue(K.OGWASHI_RACK);
if (!rack.stable) throw new Error('OGWASHI rack is not stable');
const farm = TD.tankFarmCover({ tanks: K.OGWASHI_TANKS, dailyThroughputM3: K.OGWASHI_LIFTINGS_M3 });
const lane = FP.truckingEconomics(K.OGWASHI_LANE);
if (!lane.complete) throw new Error(`OGWASHI lane incomplete: ${lane.missingInputs}`);
const fleet = FP.fleetSizing({ demandLitresPerDay: K.OGWASHI_DEMAND_L_PER_DAY, payloadLitres: K.OGWASHI_LANE.payloadLitres, tripsPerTruckPerDay: lane.tripsPerTruckPerDay });

/* ----------------------------- ORON ---------------------------- */
export const oronCharges = () => FP.IMPORT_TEMPLATE.map((c) => ({
  ...c, amount: K.ORON_RATES[c.id], ...(c.id === 'insurance' ? { basis: K.ORON_INSURANCE_BASIS } : {}),
}));
export const oronElements = () => FP.PUMP_TEMPLATE.map((e) => ({ ...e, amount: K.ORON_ELEMENTS[e.id] }));
export const oronLanded = (rate = K.ORON_CARGO.fxRate) => FP.landedCost({
  quantity: K.ORON_CARGO.quantity, quantityUnit: K.ORON_CARGO.quantityUnit, densityKgM3: K.ORON_CARGO.densityKgM3,
  fobPrice: K.ORON_CARGO.fobPrice, fobBasis: K.ORON_CARGO.fobBasis, charges: oronCharges(),
  oceanLossPercent: K.ORON_CARGO.oceanLossPercent, fxRate: rate,
});
const oron = oronLanded();
if (!oron.complete || oron.error) throw new Error(`ORON landed cost incomplete: ${oron.error || oron.missingRates}`);
const pump = FP.buildPumpPrice({ landedPerLitre: oron.perLitreLocal, elements: oronElements(), capPerLitre: K.ORON_CAP });
const gov = FP.marginWaterfall(pump).groups.find((g) => g.recipient === 'Government');
// The Fuel Pricing page's own sensitivity: the whole chain re-priced at each rate.
const priceAt = (rate) => {
  const l = oronLanded(rate);
  if (l.error || l.perLitreLocal === null) return NaN;
  return FP.buildPumpPrice({ landedPerLitre: l.perLitreLocal, elements: oronElements() }).pricePerLitre;
};
const sens = FP.priceSensitivity({ price: priceAt, values: K.ORON_FX_VALUES, capPerLitre: K.ORON_CAP });
if (!sens.breakeven || !sens.breakeven.found) throw new Error('ORON breakeven not found in the bracket');

export const FIELDS = [
  ['beginner', 'okomu_t1_gross_m3', ok1.grossM3],
  ['beginner', 'okomu_t1_standard_m3', ok1.standardM3],
  ['beginner', 'okomu_t2_standard_m3', ok2.standardM3],
  ['beginner', 'okomu_expected_closing_m3', okDay.expectedClosingM3],
  ['beginner', 'okomu_unaccounted_m3', okDay.unaccountedM3],
  ['beginner', 'okomu_tolerance_m3', okDay.toleranceM3],
  ['intermediate', 'ogwashi_rack_probability_of_waiting', rack.probabilityOfWaiting],
  ['intermediate', 'ogwashi_rack_mean_wait_min', rack.averageWaitMinutes],
  ['intermediate', 'ogwashi_pumpable_stock_m3', farm.pumpableStockM3],
  ['intermediate', 'ogwashi_days_of_cover', farm.daysOfCover],
  ['intermediate', 'ogwashi_cost_per_litre_delivered_ngn', lane.costPerLitreDelivered],
  ['intermediate', 'ogwashi_trucks_required', fleet.trucksRequired],
  ['advanced', 'oron_cif_usd', oron.cif],
  ['advanced', 'oron_landed_total_usd', oron.totalUsd],
  ['advanced', 'oron_landed_per_litre_ngn', oron.perLitreLocal],
  ['advanced', 'oron_pump_price_ngn', pump.pricePerLitre],
  ['advanced', 'oron_government_share_ngn', gov.amountPerLitre],
  ['advanced', 'oron_breakeven_fx', sens.breakeven.value],
].map(([tier, key, value]) => [tier, key, value, CLASSES[classOf(key)].tol]);

for (const [tier, key, v] of FIELDS) {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${tier}.${key} is ${v}, which is not a number the engine returned`);
  if (!K.FIELD_SOURCES[key]) throw new Error(`${key} has no FIELD_SOURCES row`);
}
if (FIELDS.length !== 18 || new Set(FIELDS.map((x) => x[1])).size !== 18) throw new Error('eighteen distinct graded keys expected');
for (const t of ['beginner', 'intermediate', 'advanced']) {
  if (FIELDS.filter((x) => x[0] === t).length !== 6) throw new Error(`${t} does not grade six fields`);
}
if (!Number.isInteger(fleet.trucksRequired)) throw new Error('the truck count is not a whole number');

/* ------------------------- the prompts ------------------------- */
// DRAFT PROMPTS. They state every condition a field needs and nothing that
// hands over an answer: gate_promptleak.py refuses any prompt that carries a
// graded value, or an engine-derived intermediate, in any rendering.
const entry = (table, h) => table.find((p) => p.heightMm === h);
const bracket = (table, h) => {
  const lo = [...table].reverse().find((p) => p.heightMm <= h); const hi = table.find((p) => p.heightMm >= h);
  return `${lo.heightMm} mm ${lo.volumeM3.toFixed(3)} m3 and ${hi.heightMm} mm ${hi.volumeM3.toFixed(3)} m3`;
};
const T1 = K.OKOMU_T1; const T2 = K.OKOMU_T2; const DY = K.OKOMU_DAY;
if (!entry(K.OKOMU_T1_TABLE, 0) || !entry(K.OKOMU_T2_TABLE, 0)) throw new Error('a capstone table does not start at the empty tank');
const L = K.OGWASHI_LANE;
const rates = FP.IMPORT_TEMPLATE.map((c) => `${c.label} ${K.ORON_RATES[c.id]} ${c.id === 'insurance' ? 'percent of CIF' : c.basis.replace(/_/g, ' ').replace('percent of cif', 'percent of CIF').replace(/^per /, 'USD per ').replace('USD per cargo', 'USD for the cargo')}`).join('; ');
const els = FP.PUMP_TEMPLATE.map((e) => `${e.label} (${e.recipient}) ${K.ORON_ELEMENTS[e.id]}${e.basis === 'percent_of_running' ? ' percent of the running total' : ' naira a litre'}`).join('; ');
export const PROMPTS = {
  beginner: `OKOMU DEPOT, Ologbo Energy Depots Ltd (an invented record). Tank ${T1.id} is a vertical ${T1.product} tank whose strapping table starts at the empty tank (0 mm, 0.000 m3) and is linear between entries; the entries either side of this morning's dip are ${bracket(K.OKOMU_T1_TABLE, T1.dipMm)}, and either side of the water cut ${bracket(K.OKOMU_T1_TABLE, T1.waterMm)}. Dip ${T1.dipMm} mm, water cut ${T1.waterMm} mm, VCF ${T1.vcfTyped} read off the depot's own tables. Tank ${T2.id} is a horizontal ${T2.product} bullet whose table also starts at the empty tank; the entries either side of the dip are ${bracket(K.OKOMU_T2_TABLE, T2.dipMm)}, and either side of the water cut ${bracket(K.OKOMU_T2_TABLE, T2.waterMm)}. Dip ${T2.dipMm} mm, water cut ${T2.waterMm} mm, VCF ${T2.vcfTyped} off the same tables. The day, all at standard: yesterday's closing stock ${DY.openingM3} m3, receipts ${DY.receiptsM3} m3, deliveries ${DY.deliveriesM3} m3, known losses ${DY.knownLossM3} m3; the closing dip is the two tanks' standard volumes together; the tolerance is ${DY.tolerancePercentOfThroughput} percent of throughput. Give six numbers in m3, each to two decimals, a loss as a negative number. (1) ${T1.id}'s gross observed volume. (2) ${T1.id}'s standard volume. (3) ${T2.id}'s standard volume. (4) The expected closing stock. (5) The unaccounted figure. (6) The tolerance.`,
  intermediate: `OGWASHI DEPOT, Anioma Fuel Logistics Ltd (an invented record). The loading rack: trucks arrive at random at ${K.OGWASHI_RACK.arrivalsPerHour} an hour, a load takes ${K.OGWASHI_RACK.loadMinutes} minutes on average, and there are ${K.OGWASHI_RACK.bays} bays. The tank farm: ${K.OGWASHI_TANKS.map((t) => `${t.id} capacity ${t.capacityM3} m3, heel ${t.heelM3} m3, stock ${t.stockM3} m3`).join('; ')}. The farm's liftings are ${K.OGWASHI_LIFTINGS_M3} m3 a day, and it receives ${K.OGWASHI_RECEIPTS_M3} m3 a day by pipeline. The lane to its stations, every cost in naira and invented for the course: ${L.distanceKm} km each way, a ${L.payloadLitres} litre payload, ${L.averageSpeedKmh} km/h average, ${L.loadHours} h to load, ${L.dischargeHours} h to discharge, ${L.queueHours} h queueing, diesel at ${L.fuelConsumptionLPer100Km} litres per 100 km and ${L.dieselPricePerLitre} a litre, driver ${L.driverCostPerTrip} a trip, maintenance ${L.maintenancePerKm} and tyres ${L.tyresPerKm} a km, tolls and levies ${L.tollsAndLeviesPerTrip} a trip, overhead ${L.overheadPerTrip} a trip, a truck costing ${L.truckCapitalCost} over ${L.truckLifeYears} years, ${L.workingHoursPerDay} working hours a day and ${L.workingDaysPerYear} days a year, a transit loss of ${L.transitLossPercent} percent. The stations take ${K.OGWASHI_DEMAND_L_PER_DAY} litres a day. Give six numbers. (1) The probability that an arriving truck waits for a bay, to four decimals. (2) The mean wait for a bay in minutes, to two decimals. (3) The farm's pumpable stock in m3, to two decimals. (4) The farm's days of cover on its liftings, to two decimals. (5) The lane's cost per litre delivered in naira, to four decimals. (6) The number of trucks the lane needs, a whole number.`,
  advanced: `ORON JETTY, Cross River Estuary Energy Ltd (an invented record). An AGO cargo of ${K.ORON_CARGO.quantity} tonnes at ${K.ORON_CARGO.densityKgM3} kg/m3, FOB ${K.ORON_CARGO.fobPrice} USD a tonne, ocean loss ${K.ORON_CARGO.oceanLossPercent} percent, ${K.ORON_CARGO.fxRate} naira to the dollar. Every rate is INVENTED for the course and none is a published figure: ${rates}. Freight builds C&F, insurance builds CIF, and every other line is levied on landing; a percent-of-CIF insurance is part of the value it is charged on. The pump build-up starts from the landed cost per litre sold as the app carries it, to four decimals, and adds in order, every element invented: ${els}. The price cap is ${K.ORON_CAP} naira a litre. Give six numbers. (1) CIF in USD, to two decimals. (2) The landed total in USD, to two decimals. (3) The landed cost per litre sold in naira, to four decimals. (4) The pump price in naira a litre, to four decimals. (5) The government's share of that price in naira a litre, to four decimals. (6) The exchange rate, searched between ${K.ORON_FX_VALUES[0]} and ${K.ORON_FX_VALUES[K.ORON_FX_VALUES.length - 1]} naira to the dollar, at which the pump price meets the cap, to two decimals.`,
};

/* ------------------ derived intermediates, for promptleak ----------------- */
export const DERIVED = {
  okomu_t1_water_m3: ok1.waterM3, okomu_t2_gross_m3: ok2.grossM3, okomu_t2_water_m3: ok2.waterM3,
  okomu_closing_m3: ok1.standardM3 + ok2.standardM3, okomu_throughput_m3: K.OKOMU_DAY.receiptsM3 + K.OKOMU_DAY.deliveriesM3,
  ogwashi_offered_erlangs: rack.offered, ogwashi_utilisation: rack.utilisation, ogwashi_queue_length: rack.queueLength,
  ogwashi_farm_stock_m3: farm.stockM3, ogwashi_farm_heel_m3: farm.heelM3, ogwashi_cycle_hours: lane.cycleHours,
  ogwashi_trips_per_day: lane.tripsPerTruckPerDay, ogwashi_cost_per_trip: lane.costPerTrip, ogwashi_trips_needed: fleet.tripsNeededPerDay,
  oron_cf_usd: oron.cf, oron_fob_usd: oron.fob, oron_outturn_litres: oron.outturn.litres, oron_per_litre_usd: oron.perLitreUsd,
};

/* --------------------------- write ----------------------------- */
const fieldsOut = process.env.MD_FIELDS_OUT || `${HERE}fields.json`;
const precOut = process.env.MD_PRECISION_OUT || `${HERE}precision.json`;
const capOut = process.env.MD_CAPSTONE_OUT || `${HERE}capstone.json`;
const MAIN = process.argv[1] && new URL(import.meta.url).pathname === process.argv[1];
if (!MAIN) {
  // imported by discriminate.mjs or a gate: compute, write nothing
} else if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify({ fields: FIELDS.map(([tier, key, value, tol]) => ({ tier, key, value, tol })), derived: DERIVED })}\n`);
} else {
  fs.writeFileSync(fieldsOut, `${JSON.stringify(FIELDS, null, 1)}\n`);
  const prec = {};
  for (const [cls, c] of Object.entries(CLASSES)) {
    const keys = FIELDS.map((x) => x[1]).filter((k) => classOf(k) === cls);
    if (keys.length) prec[cls] = { decimals: c.decimals, match: `^(?:${keys.join('|')})$` };
  }
  fs.writeFileSync(precOut, `${JSON.stringify(prec, null, 1)}\n`);
  fs.writeFileSync(capOut, `${JSON.stringify({
    tiers: Object.fromEntries(['beginner', 'intermediate', 'advanced'].map((t) => [t, {
      record: { beginner: 'OKOMU', intermediate: 'OGWASHI', advanced: 'ORON' }[t],
      prompt: PROMPTS[t],
      fields: FIELDS.filter((x) => x[0] === t).map(([, key, , tol]) => ({ key, source: K.FIELD_SOURCES[key], decimals: CLASSES[classOf(key)].decimals, tol })),
    }])),
  }, null, 1)}\n`);
  for (const [tier, key, v, tol] of FIELDS) process.stdout.write(`${tier.padEnd(13)} ${key.padEnd(40)} ${String(v).padEnd(22)} tol ${tol}\n`);
}
