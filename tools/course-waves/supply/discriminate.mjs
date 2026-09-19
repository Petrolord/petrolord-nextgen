// THE DISCRIMINATE SWEEP, per gate-must-call-the-engine: for each of the
// eighteen graded fields, does a plausible WRONG ROUTE actually move it past
// its own tolerance? A field no error moves grades nothing, whatever the prompt
// claims it tests.
//
// Every wrong route is the ENGINE asked the wrong question (the wrong height,
// the wrong basis, the wrong opening stock, a rule skipped) or the one piece of
// arithmetic a learner most plausibly does instead, and each is named for the
// mistake. The routes model the defects MD3-0 repaired and the ordinary ones:
// an opening stock taken from today's dip or read as zero, heel netted across
// tanks, Erlang B for Erlang C, insurance on FOB or on C&F, ocean loss added
// instead of divided, a forward reference, a blank cost read as zero.
//
// It is run at the FINAL tolerances in fields.json. A route is BLIND if it lands
// inside the field's tolerance, and a field is WEAK if any route aimed at it is
// blind or fewer than three routes are aimed at it. The CLOSEST MISS is printed
// in tolerances, so "it discriminates" arrives with its margin.
//
// Usage: node discriminate.mjs [--plant]   (exit 1 on any WEAK field, 2 on a refusal)
// --plant is the negative control: it adds an identity route to one field and
// the sweep must then report exactly one WEAK field.
import fs from 'fs';
import * as K from './supply_fields_capstone.mjs';
import { horizontalVolume } from './supply_fields.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-supply-nextgen/packages/engines';
const TD = await import(`${ROOT}/engines/downstream/terminalDepot.js`);
const FP = await import(`${ROOT}/engines/downstream/fuelPricing.js`);
const C = await import('./supply_capstone.mjs');
const fields = Object.fromEntries(JSON.parse(fs.readFileSync(`${HERE}fields.json`, 'utf8')).map((f) => [f[1], f]));

/* ------------------------------ OKOMU ------------------------------ */
const T1 = K.OKOMU_T1; const T2 = K.OKOMU_T2; const DY = K.OKOMU_DAY;
const v = (table, h) => TD.volumeAtDip({ strapping: table, heightMm: h }).volumeM3;
const g1 = TD.dipToStandardVolume({ strapping: K.OKOMU_T1_TABLE, heightMm: T1.dipMm, waterMm: T1.waterMm, vcf: T1.vcfTyped });
const g2 = TD.dipToStandardVolume({ strapping: K.OKOMU_T2_TABLE, heightMm: T2.dipMm, waterMm: T2.waterMm, vcf: T2.vcfTyped });
const below = (table, h) => [...table].reverse().find((p) => p.heightMm <= h).heightMm;
const above = (table, h) => table.find((p) => p.heightMm >= h).heightMm;
const closing = g1.standardM3 + g2.standardM3;
const day = (extra) => TD.reconcileStock({ ...DY, closingDippedM3: closing, ...extra });
const truthDay = day({});
const thru = DY.receiptsM3 + DY.deliveriesM3;
const geom2 = (horizontalVolume(T2.diameterM, T2.lengthM, T2.dipMm) - horizontalVolume(T2.diameterM, T2.lengthM, T2.waterMm)) * T2.vcfTyped;

/* ----------------------------- OGWASHI ----------------------------- */
const R = K.OGWASHI_RACK;
const rack = TD.rackQueue(R);
const mu = 60 / R.loadMinutes; const A = R.arrivalsPerHour / mu; const c = R.bays; const rho = A / c;
let erlangB = 1; for (let i = 1; i <= c; i += 1) erlangB = (A * erlangB) / (i + A * erlangB);
const farm = TD.tankFarmCover({ tanks: K.OGWASHI_TANKS, dailyThroughputM3: K.OGWASHI_LIFTINGS_M3 });
const LN = K.OGWASHI_LANE;
const lane = FP.truckingEconomics(LN);
const comp = (label) => lane.components.find((x) => x.label === label).amount;
const noWaitLane = FP.truckingEconomics({ ...LN, loadHours: 0, dischargeHours: 0, queueHours: 0 });
const fleet = FP.fleetSizing({ demandLitresPerDay: K.OGWASHI_DEMAND_L_PER_DAY, payloadLitres: LN.payloadLitres, tripsPerTruckPerDay: lane.tripsPerTruckPerDay });
const tripsNeeded = K.OGWASHI_DEMAND_L_PER_DAY / LN.payloadLitres;

/* ------------------------------- ORON ------------------------------ */
const OC = K.ORON_CARGO;
const land = (over = {}, extra = {}) => FP.landedCost({
  quantity: OC.quantity, quantityUnit: OC.quantityUnit, densityKgM3: OC.densityKgM3, fobPrice: OC.fobPrice, fobBasis: OC.fobBasis,
  charges: C.oronCharges().map((ch) => ({ ...ch, ...(over[ch.id] || {}) })), oceanLossPercent: OC.oceanLossPercent, fxRate: OC.fxRate, ...extra,
});
const oron = land();
const onCf = land({ insurance: { basis: FP.CHARGE_BASIS.PERCENT_OF_CF } });
const onFob = land({ insurance: { basis: FP.CHARGE_BASIS.PERCENT_OF_FOB } });
const dutyOnFob = land({ duty: { basis: FP.CHARGE_BASIS.PERCENT_OF_FOB }, finance: { basis: FP.CHARGE_BASIS.PERCENT_OF_FOB } });
const dutyOnCf = land({ duty: { basis: FP.CHARGE_BASIS.PERCENT_OF_CF }, finance: { basis: FP.CHARGE_BASIS.PERCENT_OF_CF } });
const blLitres = oron.quantities.litres;
const lossAddedPerLitre = (oron.totalUsd / blLitres) * (1 + OC.oceanLossPercent / 100) * OC.fxRate;
const lossIgnoredPerLitre = (oron.totalUsd / blLitres) * OC.fxRate;
const pumpOn = (landedPerLitre, els = C.oronElements()) => FP.buildPumpPrice({ landedPerLitre, elements: els });
const pump = pumpOn(oron.perLitreLocal);
const els = (patch) => C.oronElements().map((e) => (patch[e.id] ? { ...e, ...patch[e.id] } : e));
const vatOnLanded = pumpOn(oron.perLitreLocal, els({ vat: { basis: FP.PRICE_ELEMENT_BASIS.PERCENT_OF_LANDED } }));
const vatOut = pumpOn(oron.perLitreLocal, els({ vat: { amount: 0 } }));
const vatPerLitre = pumpOn(oron.perLitreLocal, els({ vat: { basis: FP.PRICE_ELEMENT_BASIS.PER_LITRE } }));
const lossAddedPump = pumpOn(Math.round(lossAddedPerLitre * 1e4) / 1e4);
const line = (p, id) => p.lines.find((l) => l.key === id).amount;
const gov = FP.marginWaterfall(pump).groups.find((g) => g.recipient === 'Government').amountPerLitre;
const dutyPerLitreLocal = oron.lines.find((l) => l.key === 'duty').perLitre * OC.fxRate;
const priceAt = (rate, elements = C.oronElements()) => {
  const l = land({}, { fxRate: rate });
  return FP.buildPumpPrice({ landedPerLitre: l.perLitreLocal, elements }).pricePerLitre;
};
const breakevenWith = (elements) => FP.priceSensitivity({ price: (x) => priceAt(x, elements), values: K.ORON_FX_VALUES, capPerLitre: K.ORON_CAP }).breakeven.value;
const firstUncovered = FP.priceSensitivity({ price: (x) => priceAt(x), values: K.ORON_FX_VALUES, capPerLitre: K.ORON_CAP }).points.find((p) => !p.covered).value;

const WRONG = {
  okomu_t1_gross_m3: {
    truth: g1.grossM3,
    routes: {
      water_not_subtracted: v(K.OKOMU_T1_TABLE, T1.dipMm),
      dip_read_at_the_entry_below: v(K.OKOMU_T1_TABLE, below(K.OKOMU_T1_TABLE, T1.dipMm)) - g1.waterM3,
      dip_read_at_the_entry_above: v(K.OKOMU_T1_TABLE, above(K.OKOMU_T1_TABLE, T1.dipMm)) - g1.waterM3,
      the_standard_volume_given: g1.standardM3,
    },
  },
  okomu_t1_standard_m3: {
    truth: g1.standardM3,
    routes: {
      vcf_divided_instead_of_multiplied: g1.grossM3 / T1.vcfTyped,
      water_not_subtracted: v(K.OKOMU_T1_TABLE, T1.dipMm) * T1.vcfTyped,
      the_gross_volume_given: g1.grossM3,
      the_other_tanks_vcf: g1.grossM3 * T2.vcfTyped,
    },
  },
  okomu_t2_standard_m3: {
    truth: g2.standardM3,
    routes: {
      water_subtracted_as_a_height: v(K.OKOMU_T2_TABLE, T2.dipMm - T2.waterMm) * T2.vcfTyped,
      water_not_subtracted: v(K.OKOMU_T2_TABLE, T2.dipMm) * T2.vcfTyped,
      vcf_divided_instead_of_multiplied: g2.grossM3 / T2.vcfTyped,
      the_bullet_geometry_instead_of_the_table: geom2,
    },
  },
  okomu_expected_closing_m3: {
    truth: truthDay.expectedClosingM3,
    routes: {
      known_loss_added: DY.openingM3 + DY.receiptsM3 - DY.deliveriesM3 + DY.knownLossM3,
      receipts_and_deliveries_swapped: DY.openingM3 - DY.receiptsM3 + DY.deliveriesM3 - DY.knownLossM3,
      known_loss_left_out: DY.openingM3 + DY.receiptsM3 - DY.deliveriesM3,
      opening_taken_from_todays_dip: day({ openingM3: closing - DY.receiptsM3 + DY.deliveriesM3 + DY.knownLossM3 }).expectedClosingM3,
    },
  },
  okomu_unaccounted_m3: {
    truth: truthDay.unaccountedM3,
    routes: {
      opening_taken_from_todays_dip: day({ openingM3: closing - DY.receiptsM3 + DY.deliveriesM3 + DY.knownLossM3 }).unaccountedM3,
      missing_opening_read_as_zero: closing - (DY.receiptsM3 - DY.deliveriesM3 - DY.knownLossM3),
      sign_reversed: -truthDay.unaccountedM3,
      closed_on_gross_volumes: day({ closingDippedM3: g1.grossM3 + g2.grossM3 }).unaccountedM3,
      known_loss_added: closing - (DY.openingM3 + DY.receiptsM3 - DY.deliveriesM3 + DY.knownLossM3),
    },
  },
  okomu_tolerance_m3: {
    truth: truthDay.toleranceM3,
    routes: {
      on_the_closing_stock: (closing * DY.tolerancePercentOfThroughput) / 100,
      on_receipts_only: (DY.receiptsM3 * DY.tolerancePercentOfThroughput) / 100,
      on_deliveries_only: (DY.deliveriesM3 * DY.tolerancePercentOfThroughput) / 100,
      on_the_net_movement: (Math.abs(DY.receiptsM3 - DY.deliveriesM3) * DY.tolerancePercentOfThroughput) / 100,
      percent_read_as_a_fraction: thru * DY.tolerancePercentOfThroughput,
    },
  },
  ogwashi_rack_probability_of_waiting: {
    truth: rack.probabilityOfWaiting,
    routes: {
      erlang_b_for_erlang_c: erlangB,
      utilisation_read_as_the_probability: rho,
      probability_of_exactly_every_bay_busy: rack.probabilityOfWaiting * (1 - rho),
    },
  },
  ogwashi_rack_mean_wait_min: {
    truth: rack.averageWaitMinutes,
    routes: {
      erlang_b_for_erlang_c: (erlangB / (c * mu - R.arrivalsPerHour)) * 60,
      the_wait_of_a_truck_that_waits: (1 / (c * mu - R.arrivalsPerHour)) * 60,
      probability_times_the_load_time: rack.probabilityOfWaiting * R.loadMinutes,
      time_on_site_given: rack.averageTimeOnSiteMinutes,
      one_queue_a_bay_with_arrivals_split: (rho / (mu - R.arrivalsPerHour / c)) * 60,
    },
  },
  ogwashi_pumpable_stock_m3: {
    truth: farm.pumpableStockM3,
    routes: {
      heel_netted_across_the_farm: farm.stockM3 - farm.heelM3,
      heel_not_removed: farm.stockM3,
      working_capacity_given: farm.workingCapacityM3,
    },
  },
  ogwashi_days_of_cover: {
    truth: farm.daysOfCover,
    routes: {
      heel_netted_across_the_farm: (farm.stockM3 - farm.heelM3) / K.OGWASHI_LIFTINGS_M3,
      heel_not_removed: farm.stockM3 / K.OGWASHI_LIFTINGS_M3,
      cover_on_receipts_plus_liftings: TD.tankFarmCover({ tanks: K.OGWASHI_TANKS, dailyThroughputM3: K.OGWASHI_LIFTINGS_M3 + K.OGWASHI_RECEIPTS_M3 }).daysOfCover,
      working_capacity_over_liftings: farm.workingCapacityM3 / K.OGWASHI_LIFTINGS_M3,
    },
  },
  ogwashi_cost_per_litre_delivered_ngn: {
    truth: lane.costPerLitreDelivered,
    routes: {
      divided_by_the_payload_loaded: lane.costPerTrip / LN.payloadLitres,
      depreciation_left_out: (lane.costPerTrip - comp('Truck depreciation')) / lane.deliveredLitresPerTrip,
      fuel_and_wear_on_one_way_only: (lane.costPerTrip - comp('Diesel') / 2 - comp('Maintenance and tyres') / 2) / lane.deliveredLitresPerTrip,
      cycle_without_loading_discharge_or_queue: noWaitLane.costPerLitreDelivered,
      loss_added_to_the_payload: lane.costPerTrip / (LN.payloadLitres * (1 + LN.transitLossPercent / 100)),
    },
  },
  ogwashi_trucks_required: {
    truth: fleet.trucksRequired,
    routes: {
      trips_rounded_down: Math.floor(tripsNeeded / lane.tripsPerTruckPerDay),
      cycle_without_loading_discharge_or_queue: FP.fleetSizing({ demandLitresPerDay: K.OGWASHI_DEMAND_L_PER_DAY, payloadLitres: LN.payloadLitres, tripsPerTruckPerDay: noWaitLane.tripsPerTruckPerDay }).trucksRequired,
      one_trip_a_truck_a_day: Math.ceil(tripsNeeded),
      a_twenty_four_hour_working_day: FP.fleetSizing({ demandLitresPerDay: K.OGWASHI_DEMAND_L_PER_DAY, payloadLitres: LN.payloadLitres, tripsPerTruckPerDay: FP.truckingEconomics({ ...LN, workingHoursPerDay: 24 }).tripsPerTruckPerDay }).trucksRequired,
    },
  },
  oron_cif_usd: {
    truth: oron.cif,
    routes: {
      insurance_on_fob: onFob.cif,
      insurance_on_c_and_f: onCf.cif,
      insurance_left_out: oron.cf,
    },
  },
  oron_landed_total_usd: {
    truth: oron.totalUsd,
    routes: {
      insurance_on_c_and_f: onCf.totalUsd,
      duty_and_finance_on_fob: dutyOnFob.totalUsd,
      duty_and_finance_on_c_and_f: dutyOnCf.totalUsd,
      ocean_loss_added_as_a_charge: oron.totalUsd * (1 + OC.oceanLossPercent / 100),
    },
  },
  oron_landed_per_litre_ngn: {
    truth: oron.perLitreLocal,
    routes: {
      ocean_loss_added_instead_of_divided: lossAddedPerLitre,
      ocean_loss_ignored: lossIgnoredPerLitre,
      insurance_on_c_and_f: onCf.perLitreLocal,
      insurance_on_fob: onFob.perLitreLocal,
    },
  },
  oron_pump_price_ngn: {
    truth: pump.pricePerLitre,
    routes: {
      vat_on_the_landed_cost_only: vatOnLanded.pricePerLitre,
      vat_left_out: vatOut.pricePerLitre,
      vat_read_as_naira_a_litre: vatPerLitre.pricePerLitre,
      ocean_loss_added_upstream: lossAddedPump.pricePerLitre,
    },
  },
  oron_government_share_ngn: {
    truth: gov,
    routes: {
      levies_only: line(pump, 'levies'),
      vat_only: line(pump, 'vat'),
      vat_on_the_landed_cost_only: line(vatOnLanded, 'levies') + line(vatOnLanded, 'vat'),
      import_duty_counted_as_well: gov + dutyPerLitreLocal,
    },
  },
  oron_breakeven_fx: {
    truth: FP.priceSensitivity({ price: (x) => priceAt(x), values: K.ORON_FX_VALUES, capPerLitre: K.ORON_CAP }).breakeven.value,
    routes: {
      whole_price_scaled_with_the_rate: OC.fxRate * (K.ORON_CAP / pump.pricePerLitre),
      vat_left_out: breakevenWith(els({ vat: { amount: 0 } })),
      the_landed_cost_meets_the_cap: K.ORON_CAP / oron.perLitreUsd,
      the_first_rate_in_the_table_the_cap_fails: firstUncovered,
    },
  },
};

if (process.argv.includes('--plant')) WRONG.ogwashi_trucks_required.routes.planted_identity = WRONG.ogwashi_trucks_required.truth;
let weak = 0; let routes = 0; let closest = { ratio: Infinity, key: null, name: null };
console.log('field                                     routes  moved  blind   closest miss (in tolerances)');
for (const [key, { truth, routes: rs }] of Object.entries(WRONG)) {
  if (!fields[key]) { console.log(`  REFUSES: ${key} is not in fields.json`); process.exit(2); }
  if (fields[key][2] !== truth) { console.log(`  REFUSES: ${key} in fields.json is ${fields[key][2]} and this sweep computes ${truth}`); process.exit(2); }
  const tol = fields[key][3];
  const blind = []; let nearest = Infinity; let nearestName = null;
  for (const [name, got] of Object.entries(rs)) {
    routes += 1;
    if (!Number.isFinite(got)) { console.log(`  REFUSES: route ${key}.${name} produced ${got}`); process.exit(2); }
    const d = Math.abs(got - truth);
    if (d <= tol) blind.push(`${name} (lands on ${got})`);
    else if (d / tol < nearest) { nearest = d / tol; nearestName = name; }
  }
  const n = Object.keys(rs).length;
  if (blind.length || n < 3) weak += 1;
  if (nearest < closest.ratio) closest = { ratio: nearest, key, name: nearestName };
  console.log(`${key.padEnd(41)} ${String(n).padStart(6)} ${String(n - blind.length).padStart(6)} ${String(blind.length).padStart(6)}   ${nearest.toFixed(1)} (${nearestName})`);
  blind.forEach((b) => console.log(`    BLIND ${b}`));
}
if (Object.keys(WRONG).length !== 18) { console.log('  REFUSES: not eighteen fields'); process.exit(2); }
console.log(`\ndiscriminate: 18 graded fields, ${routes} wrong routes swept, ${weak} WEAK field(s)`);
console.log(`the closest miss anywhere in the eighteen: ${closest.key} by route ${closest.name}, ${closest.ratio.toFixed(1)} tolerances out`);
if (routes < 18 * 3) { console.log('  GATE REFUSES: fewer than three wrong routes a field is not a sweep'); process.exit(2); }
process.exit(weak ? 1 : 0);
