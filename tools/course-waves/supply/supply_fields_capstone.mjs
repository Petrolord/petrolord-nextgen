// THE SUPPLY CAPSTONE CONDITIONS. Three records, one a tier, none of them a
// teaching case:
//
//   OKOMU     the Okomu inland depot in Edo State of an invented operator,
//             Ologbo Energy Depots Ltd: two tanks (a vertical AGO tank and a
//             horizontal PMS bullet) dipped one morning, and the day they close
//             (Associate).
//   OGWASHI   the Ogwashi depot in Delta State of an invented operator, Anioma
//             Fuel Logistics Ltd: its loading rack, its three-tank farm, a truck
//             lane to the stations it serves and the fleet the lane needs
//             (Professional).
//   ORON      an AGO cargo discharged at an invented jetty at Oron by an
//             invented importer, Cross River Estuary Energy Ltd, landed and
//             priced to the nozzle against a price cap (Expert).
//
// Nothing here is imported by supply_dump.mjs, and nothing in supply_fields.mjs
// is imported here except the two geometry helpers that build a strapping
// table, which are functions and carry no case. gate_capstone_leak.py sweeps
// both directions on every rebuild.
//
// EVERY RATE AND EVERY COST HERE IS INVENTED for the course and labelled so in
// the prompt. No published duty, levy, VAT rate, margin, freight rate or
// exchange rate appears, and no VCF coefficient: each tank's VCF is a figure
// the depot reads off its own tables, typed in, invented for the course.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE, graded numerically. The
// academy grader (public.academy_submit_capstone) compares a numeric answer to
// a numeric expected value within a numeric tolerance and nothing else. No
// graded value may be within its tolerance of any number the teaching digest
// prints (gate_collisions.py), which is why several conditions below were moved
// until none was.
import { verticalTable, horizontalTable } from './supply_fields.mjs';

/* ------------------------------------------------------------------ *
 * OKOMU (Associate)
 * ------------------------------------------------------------------ */
export const OKOMU_T1 = {
  id: 'OK-1', product: 'AGO', shape: 'vertical', diameterM: 18.6, topMm: 14400, stepMm: 200,
  dipMm: 8437, waterMm: 143, densityKgM3: 842.7, temperatureC: 31.0, vcfTyped: 0.9868,
};
export const OKOMU_T2 = {
  id: 'OK-2', product: 'PMS', shape: 'horizontal', diameterM: 3.4, lengthM: 15.2, stepMm: 100,
  dipMm: 2265, waterMm: 38, densityKgM3: 739.4, temperatureC: 30.5, vcfTyped: 0.9811,
};
export const OKOMU_T1_TABLE = verticalTable(OKOMU_T1.diameterM, OKOMU_T1.topMm, OKOMU_T1.stepMm);
export const OKOMU_T2_TABLE = horizontalTable(OKOMU_T2.diameterM, OKOMU_T2.lengthM, OKOMU_T2.stepMm);
/** The day, in m3 at standard. The opening stock is yesterday's closing dip. */
export const OKOMU_DAY = {
  openingM3: 2498.45, receiptsM3: 1180.0, deliveriesM3: 1352.6, knownLossM3: 1.4, tolerancePercentOfThroughput: 0.18,
};

/* ------------------------------------------------------------------ *
 * OGWASHI (Professional)
 * ------------------------------------------------------------------ */
export const OGWASHI_RACK = { arrivalsPerHour: 14, loadMinutes: 26, bays: 7 };
export const OGWASHI_TANKS = [
  { id: 'OG-1 (PMS)', capacityM3: 6200, heelM3: 180, stockM3: 4127.5 },
  { id: 'OG-2 (PMS)', capacityM3: 4400, heelM3: 140, stockM3: 18.6 },
  { id: 'OG-3 (AGO)', capacityM3: 2800, heelM3: 92, stockM3: 1873.9 },
];
/** Daily liftings, m3. Receipts on the day are a further 1,240 m3 by pipeline. */
export const OGWASHI_LIFTINGS_M3 = 1760;
export const OGWASHI_RECEIPTS_M3 = 1240;
export const OGWASHI_LANE = {
  distanceKm: 238, payloadLitres: 42000, averageSpeedKmh: 43, loadHours: 1.75, dischargeHours: 1.25,
  queueHours: 2.5, fuelConsumptionLPer100Km: 41, dieselPricePerLitre: 1285, driverCostPerTrip: 72500,
  maintenancePerKm: 52, tyresPerKm: 31, overheadPerTrip: 46000, tollsAndLeviesPerTrip: 33500,
  truckCapitalCost: 118000000, truckLifeYears: 7, workingHoursPerDay: 14, workingDaysPerYear: 310,
  transitLossPercent: 0.25,
};
export const OGWASHI_DEMAND_L_PER_DAY = 2350000;

/* ------------------------------------------------------------------ *
 * ORON (Expert)
 * ------------------------------------------------------------------ */
export const ORON_CARGO = {
  quantity: 28500, quantityUnit: 'tonne', densityKgM3: 838.2, fobPrice: 742.5, fobBasis: 'per_tonne',
  oceanLossPercent: 0.35, fxRate: 1487.6,
};
/** Invented rates, keyed by the IMPORT_TEMPLATE line id. Insurance is quoted on CIF. */
export const ORON_RATES = {
  freight: 31.4, insurance: 0.175, duty: 6.25, port: 2.85, regulator: 0.0019, jetty: 1.35, storage: 2.1,
  finance: 1.25, demurrage: 48000,
};
export const ORON_INSURANCE_BASIS = 'percent_of_cif';
/** Invented pump elements, keyed by the PUMP_TEMPLATE id. */
export const ORON_ELEMENTS = {
  depot: 18.5, bridging: 26, transport: 22.75, marketer: 17.25, dealer: 29.5, levies: 8.4, vat: 5.5,
};
export const ORON_CAP = 1390;
/** The exchange rates the sensitivity is run over, naira to the dollar. */
export const ORON_FX_VALUES = [1200, 1300, 1400, 1500, 1600, 1700, 1800];

/** Which capstone record and engine return each graded field is. */
export const FIELD_SOURCES = {
  okomu_t1_gross_m3: 'OKOMU OK-1: terminalDepot.dipToStandardVolume(...).grossM3',
  okomu_t1_standard_m3: 'OKOMU OK-1: terminalDepot.dipToStandardVolume(... vcf typed).standardM3',
  okomu_t2_standard_m3: 'OKOMU OK-2: terminalDepot.dipToStandardVolume(... vcf typed).standardM3',
  okomu_expected_closing_m3: 'OKOMU day: terminalDepot.reconcileStock(...).expectedClosingM3',
  okomu_unaccounted_m3: 'OKOMU day closed on the two standard volumes: terminalDepot.reconcileStock(...).unaccountedM3',
  okomu_tolerance_m3: 'OKOMU day: terminalDepot.reconcileStock(...).toleranceM3',
  ogwashi_rack_probability_of_waiting: 'OGWASHI rack: terminalDepot.rackQueue(...).probabilityOfWaiting',
  ogwashi_rack_mean_wait_min: 'OGWASHI rack: terminalDepot.rackQueue(...).averageWaitMinutes',
  ogwashi_pumpable_stock_m3: 'OGWASHI farm: terminalDepot.tankFarmCover(...).pumpableStockM3',
  ogwashi_days_of_cover: 'OGWASHI farm on its liftings: terminalDepot.tankFarmCover(...).daysOfCover',
  ogwashi_cost_per_litre_delivered_ngn: 'OGWASHI lane: fuelPricing.truckingEconomics(...).costPerLitreDelivered',
  ogwashi_trucks_required: 'OGWASHI fleet on the lane\'s trips: fuelPricing.fleetSizing(...).trucksRequired',
  oron_cif_usd: 'ORON cargo, insurance on CIF: fuelPricing.landedCost(...).cif',
  oron_landed_total_usd: 'ORON cargo: fuelPricing.landedCost(...).totalUsd',
  oron_landed_per_litre_ngn: 'ORON cargo: fuelPricing.landedCost(...).perLitreLocal',
  oron_pump_price_ngn: 'ORON pump: fuelPricing.buildPumpPrice({ landedPerLitre: perLitreLocal, ... }).pricePerLitre',
  oron_government_share_ngn: 'ORON pump: fuelPricing.marginWaterfall(...) group Government amountPerLitre',
  oron_breakeven_fx: 'ORON: fuelPricing.priceSensitivity over ORON_FX_VALUES against ORON_CAP, breakeven.value',
};
