// THE SUPPLY TEACHING CASES. Every record the digest is built on, in one place,
// so a sweep, a claim gate, a lesson and the panels' lab all read the same case.
//
// THREE TEACHING CASES, AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs three other records, written in supply_fields_capstone.mjs, and nothing
// in this file or in supply_dump.mjs imports, reads, names or reproduces any of
// it. gate_capstone_leak.py sweeps both directions on every rebuild.
//
//   AKODO     a coastal import terminal on the Lekki corridor run by an
//             invented operator, Akodo Lagoon Terminals Ltd: three product
//             tanks with their strapping tables, a morning's dips and water
//             cuts, and one day's movements (Terminal & Depot Operations).
//             The Associate tier's case.
//   IBAFO     an inland depot on the Lagos to Ibadan corridor run by an
//             invented operator, Ibafo Inland Depot Ltd: its loading rack, its
//             tank farm, its throughput economics, a truck lane to a station
//             cluster, and one forecourt (Terminal & Depot Operations, Fuel
//             Pricing & Supply Chain). The Professional tier's case.
//   BADAGRY   a petrol cargo discharged at an invented jetty at Badagry by an
//             invented importer, Gberefu Energy Trading Ltd, priced from FOB to
//             landed and from the depot gate to the nozzle (Fuel Pricing &
//             Supply Chain). The Expert tier's case.
//
// EVERY RECORD IS INVENTED, AND SO IS EVERY RATE. No duty, levy, margin, freight
// rate, VAT rate or exchange rate here is a published figure; each is a round
// invented number chosen to make a lesson legible, and the digest says so in
// its header and again beside every rate table. The engine ships no rate and no
// volume correction coefficient (FINDINGS-supply H2), and neither does this
// file: the one coefficient row below is SYNTHETIC and labelled so, chosen to
// resemble no published commodity group.
//
// NOTHING HERE READS A CLOCK. Neither module reads a date; the one date-shaped
// field (a trend row's date) is a label the engine carries and never compares.

/* ------------------------------------------------------------------ *
 * Strapping tables, written the way a calibration contractor prints one:
 * a height in millimetres and a volume in cubic metres to the litre.
 * The volumes come from the tank's geometry, rounded to three decimals.
 * ------------------------------------------------------------------ */
const r3 = (v) => Math.round(v * 1000) / 1000;
/** A vertical cylinder: volume is the floor area times the height. */
export const verticalTable = (diameterM, topMm, stepMm) => {
  const area = (Math.PI * diameterM * diameterM) / 4;
  const out = [];
  for (let h = 0; h <= topMm; h += stepMm) out.push({ heightMm: h, volumeM3: r3((area * h) / 1000) });
  return out;
};
/** A horizontal cylinder (a bullet tank): the wetted circular segment times the length. */
export const horizontalVolume = (diameterM, lengthM, hMm) => {
  const r = diameterM / 2; const x = hMm / 1000;
  return lengthM * (r * r * Math.acos((r - x) / r) - (r - x) * Math.sqrt(Math.max(0, 2 * r * x - x * x)));
};
export const horizontalTable = (diameterM, lengthM, stepMm) => {
  const out = [];
  for (let h = 0; h <= Math.round(diameterM * 1000); h += stepMm) out.push({ heightMm: h, volumeM3: r3(horizontalVolume(diameterM, lengthM, h)) });
  return out;
};

/* ------------------------------------------------------------------ *
 * AKODO (Associate): three tanks, a morning's dips, one day.
 * ------------------------------------------------------------------ */
export const AKODO_TANKS = [
  { id: 'AK-01', product: 'PMS', shape: 'vertical', diameterM: 22.0, topMm: 14750, stepMm: 250,
    dipMm: 9318, waterMm: 212, densityKgM3: 741.6, temperatureC: 31.5, vcfTyped: 0.9803 },
  { id: 'AK-02', product: 'AGO', shape: 'vertical', diameterM: 16.0, topMm: 12000, stepMm: 250,
    dipMm: 5406, waterMm: 95, densityKgM3: 846.3, temperatureC: 30.0, vcfTyped: 0.9876 },
  { id: 'AK-03', product: 'DPK', shape: 'horizontal', diameterM: 3.0, lengthM: 11.5, stepMm: 100,
    dipMm: 1847, waterMm: 41, densityKgM3: 796.8, temperatureC: 29.0, vcfTyped: 0.9884 },
];
export const akodoTable = (t) => (t.shape === 'vertical'
  ? verticalTable(t.diameterM, t.topMm, t.stepMm)
  : horizontalTable(t.diameterM, t.lengthM, t.stepMm));

/** A dip swept up AK-01's table, including both ends and both refusals. */
export const AKODO_DIP_SWEEP = [0, 125, 250, 9318, 9500, 14750, 14800, -5, null, ''];
/** The same tank with a table that stops short of the floor (a partial calibration). */
export const AKODO_PARTIAL_TABLE = [300, 550, 800].map((h) => ({ heightMm: h, volumeM3: r3((Math.PI * 22.0 * 22.0 / 4) * h / 1000) }));
export const AKODO_PARTIAL_DIPS = [[180, 0], [300, 0], [640, 0], [640, 150], [640, 700], [640, -10]];
/** The water cuts put to AK-02: none, a normal one, one above the dip, a negative one. */
export const AKODO_WATER_SWEEP = [0, 95, 400, 5406, 5500, -3];

/** SYNTHETIC coefficients. Invented for this course; they are not any
 * published commodity group's row, and the digest says so beside every VCF. */
export const SYNTHETIC_COEFFICIENTS = { k0: 520, k1: 0.3, k2: 0 };
export const AKODO_VCF_TEMPERATURES = [10, 15, 20, 25, 31.5, 35, 40];
export const AKODO_VCF_DENSITIES = [700, 741.6, 796.8, 846.3, 900];

/** The day: yesterday's closing stock and today's movements, all in m3 at standard. */
export const AKODO_DAY = {
  openingM3: 4953.7, receiptsM3: 2870.0, deliveriesM3: 3312.5, knownLossM3: 3.1, tolerancePercentOfThroughput: 0.2,
};
/** Three other closing dips, for the reconciliation that cannot fail. */
export const AKODO_OTHER_CLOSINGS = [4380.25, 4600.0, 4855.5];
export const AKODO_TOLERANCE_SWEEP = [0.05, 0.1, 0.2, 0.3, 0.5];
/** The trend: nine days of unaccounted m3 against throughput, ending in a run of losses. */
export const AKODO_HISTORY = [
  { date: 'day 1', unaccountedM3: 4.2, throughputM3: 6105 },
  { date: 'day 2', unaccountedM3: -3.6, throughputM3: 5870 },
  { date: 'day 3', unaccountedM3: 1.9, throughputM3: 6240 },
  { date: 'day 4', unaccountedM3: -2.4, throughputM3: 6010 },
  { date: 'day 5', unaccountedM3: -5.3, throughputM3: 6395 },
  { date: 'day 6', unaccountedM3: -4.1, throughputM3: 5925 },
  { date: 'day 7', unaccountedM3: -6.8, throughputM3: 6180 },
  { date: 'day 8', unaccountedM3: -3.9, throughputM3: 6050 },
  { date: 'day 9', unaccountedM3: -7.2, throughputM3: 6310 },
];

/* ------------------------------------------------------------------ *
 * IBAFO (Professional): rack, farm, economics, lane, fleet, station.
 * ------------------------------------------------------------------ */
export const IBAFO_RACK = { arrivalsPerHour: 9, loadMinutes: 24, bays: 4 };
export const IBAFO_BAY_SWEEP = [3, 4, 5, 6, 7];
export const IBAFO_ARRIVAL_SWEEP = [6, 7, 8, 9, 9.5, 10];
export const IBAFO_RACK_REFUSALS = [
  { arrivalsPerHour: 9, loadMinutes: 24, bays: 0 },
  { arrivalsPerHour: 9, loadMinutes: 24, bays: 2.5 },
  { arrivalsPerHour: 9, loadMinutes: 24, bays: null },
  { arrivalsPerHour: null, loadMinutes: 24, bays: 4 },
  { arrivalsPerHour: 9, loadMinutes: null, bays: 4 },
];
export const IBAFO_TANKS = [
  { id: 'IB-T1 (PMS)', capacityM3: 7500, heelM3: 210, stockM3: 5288.4 },
  { id: 'IB-T2 (PMS)', capacityM3: 7500, heelM3: 210, stockM3: 164.7 },
  { id: 'IB-T3 (AGO)', capacityM3: 5000, heelM3: 150, stockM3: 3902.6 },
  { id: 'IB-T4 (DPK)', capacityM3: 2500, heelM3: 85, stockM3: 1377.0 },
];
/** Daily liftings from the farm, m3. */
export const IBAFO_DAILY_M3 = 2640;
export const IBAFO_ECONOMICS = {
  throughputM3: 2640, feePerM3: 7.8, variableCostPerM3: 2.35, fixedCostPerPeriod: 9400,
  lossM3: 4.6, productDensityKgM3: 745.2,
};
/** SYNTHETIC, invented for this course: not a published emission factor. */
export const SYNTHETIC_LOSS_FACTOR_KG_PER_T = 850;
export const IBAFO_LANE = {
  distanceKm: 312, payloadLitres: 33000, averageSpeedKmh: 46, loadHours: 1.5, dischargeHours: 1.25,
  queueHours: 1.75, fuelConsumptionLPer100Km: 36, dieselPricePerLitre: 1240, driverCostPerTrip: 58000,
  maintenancePerKm: 41, tyresPerKm: 24, overheadPerTrip: 37500, tollsAndLeviesPerTrip: 21000,
  truckCapitalCost: 96000000, truckLifeYears: 8, workingHoursPerDay: 12, workingDaysPerYear: 300,
  transitLossPercent: 0.3,
};
export const IBAFO_DEMAND_L_PER_DAY = 1260000;
export const IBAFO_STATION = {
  dailyThroughputLitres: 36000, peakHourShare: 0.12, litresPerTransaction: 32, dispenseRateLitresPerMinute: 38,
  transactionOverheadMinutes: 1.5, nozzles: 6, tankCapacityLitres: 40000, deadStockLitres: 2500,
  reorderAtFraction: 0.25, deliveryPayloadLitres: 33000,
};
export const IBAFO_NOZZLE_SWEEP = [4, 5, 6, 7, 8];
export const IBAFO_REORDER_SWEEP = [0.1, 0.15, 0.2, 0.25];

/* ------------------------------------------------------------------ *
 * BADAGRY (Expert): one PMS cargo, landed and priced.
 * ------------------------------------------------------------------ */
export const BADAGRY_CARGO = {
  quantity: 34000, quantityUnit: 'tonne', densityKgM3: 742.8, fobPrice: 688, fobBasis: 'per_tonne',
  oceanLossPercent: 0.45, fxRate: 1520.4,
};
/** Every rate INVENTED for this course, keyed by the IMPORT_TEMPLATE line id. */
export const BADAGRY_RATES = {
  freight: 26.5, insurance: 0.16, duty: 5.75, port: 3.05, regulator: 0.0024, jetty: 1.2, storage: 2.65,
  finance: 1.4, demurrage: 52500,
};
/** Every pump element INVENTED for this course, keyed by the PUMP_TEMPLATE id. */
export const BADAGRY_ELEMENTS = {
  depot: 21, bridging: 24.5, transport: 19.8, marketer: 18.4, dealer: 31.25, levies: 9.6, vat: 6.5,
};
export const BADAGRY_CAP = 1150;
/** A second cap, below what the chain costs. */
export const BADAGRY_LOW_CAP = 1040;
export const BADAGRY_LOSS_SWEEP = [0, 0.2, 0.45, 1];
export const BADAGRY_FX_VALUES = [1200, 1350, 1500, 1650, 1800, 1950, 2100];
/** A narrower bracket with no crossing, and a bracket written backwards. */
export const BADAGRY_FX_NARROW = [1300, 1400, 1500];
export const BADAGRY_QUANTITY_UNITS = [
  [34000, 'tonne'], [45772.7, 'm3'], [45772700, 'litre'], [287900, 'bbl'], [34000, 'kg'],
];
