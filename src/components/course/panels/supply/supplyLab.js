// Teaching lab for MD3, Terminals, Depots & Fuel Supply. The three explorer
// panels, the course learning page and the vitest files all read this one
// module, so a number shown to a learner and a number a test pins cannot drift
// apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every volume, VCF,
// reconciliation, queue figure, farm figure, margin, lane cost, fleet, station,
// cargo quantity, landed cost line, pump price element, recipient group and
// breakeven below is a return value of engines/downstream/terminalDepot.js or
// engines/downstream/fuelPricing.js at engines e4d3b10. This is the ONLY file in
// the course that imports either module, and panelCapstoneGuard.test.js asserts
// that over every panel and the page.
//
// NOTHING IN THIS FILE COMPUTES A TERMINAL OR PRICING QUANTITY. Where a reader
// carries a figure the digest prints as its own arithmetic on engine returns,
// the key says Derived or NotUsed and the arithmetic is the digest's, stated
// beside it: the sum of three tanks' standard volumes (the closing stock the day
// is closed on), receipts plus deliveries (the throughput the tolerance is a
// percent of), the dip less the water HEIGHT (the reading the engine does not
// use), the opening stock taken from the closing dip (SECTION 7's
// demonstration), the farm's stock less the farm's heel (the figure the engine
// does not use), Erlang B from the engine's Erlang C by the identity, and the
// running sum the landed cost staircase is drawn on.
//
// A MISSING INPUT IS MISSING. Every reader hands its inputs to the engine as it
// received them: a blank control arrives as '' and the engine reads it as
// missing. No reader fills a density, a bay count, a coefficient, a rate or an
// opening stock from anywhere.
//
// NO RATE AND NO COEFFICIENT IS SHIPPED. The engine ships none. The rates below
// are the course's invented ones, copied verbatim from the wave file, and the
// one coefficient row is SYNTHETIC. No reader offers a list of real rates or
// commodity groups.
//
// EVERY REFUSAL IS THE ENGINE'S OWN SENTENCE, carried from the engine's `error`
// or `reason` key. No refusal is written as a literal in this directory, and
// supplyLab.test.js asserts that over the lab, every panel and the page.
//
// THE CLOCK. Neither engine reads a date or a random number, so no reader takes
// a date. supplyLab.test.js rebuilds the whole snapshot under two faked system
// dates and under TZ=Pacific/Pago_Pago and TZ=Pacific/Kiritimati and demands
// the same bytes.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

// A namespace rather than named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which may predate the
// downstream modules. Vite and vitest alias @petrolord/engines to this
// worktree's packages/engines, and supplyLab.test.js proves every member the lab
// names resolves there.
/* eslint-disable import/namespace */
import * as TD from '@petrolord/engines/engines/downstream/terminalDepot.js';
import * as FP from '@petrolord/engines/engines/downstream/fuelPricing.js';

/** The two vendored modules, for the resolution test and nothing else. */
export const ENGINE = { TD, FP };

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from
// tools/course-waves/supply/supply_fields.mjs, which supply_dump.mjs imports.
// supplyLab.test.js compares this block with the wave file text byte for byte
// and each export by value, so it cannot be edited here alone. The capstone's
// records live in another file and nothing here reads them.
// ---------------------------------------------------------------------------

// ---- BEGIN VERBATIM supply_fields.mjs ----
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
// ---- END VERBATIM supply_fields.mjs ----

// ---------------------------------------------------------------------------
// The few sweep inputs supply_dump.mjs holds inline rather than in the fields
// file, copied here. supplyLab.test.js finds each one in the dump's text.
// ---------------------------------------------------------------------------

/** SECTION 10: the mean load minutes swept on the IBAFO rack. */
export const IBAFO_LOAD_SWEEP = [16, 20, 22, 24, 26];
/** SECTION 14: the lane at half, one and one and a half times its distance. */
export const IBAFO_DISTANCE_SWEEP = [156, 312, 468];
/** SECTION 15: the demand swept on the same lane. */
export const IBAFO_DEMAND_SWEEP = [330000, 660000, 1260000, 1980000];
/** SECTION 8: the history trimmed one day at a time. */
export const AKODO_DAYS_KEPT = [5, 6, 7, 8, 9];
/** SECTION 18: the refused charges, as the dump types them. */
export const BADAGRY_FORWARD_FREIGHT_RATE = 4;
export const BADAGRY_CUSTOMS_CHARGE = { id: 'extra', label: 'Customs processing', basis: 'per_tonne', stage: 'customs', amount: 0.5 };
export const BADAGRY_FULL_INSURANCE = 100;

// ---------------------------------------------------------------------------
// THE DIGEST'S OWN PRINTING PRECISION, one table, so a panel prints what a
// lesson prints. It is supply_dump.mjs's PRINT table.
// ---------------------------------------------------------------------------

export const PRINT = {
  m3: 3, mm: 0, vcf: 6, alpha: 9, prob: 6, util: 6, erlang: 4, min: 4, days: 4, turns: 4, queue: 4,
  usd: 2, usdL: 6, local: 4, localL: 4, litres: 2, tonnes: 4, bbl: 4, km: 2, hours: 3, trips: 6, fx: 4, pct: 4, kg: 4, share: 6,
};

const fixedAt = (cls) => (v) => {
  if (v === null || v === undefined || v === '') return 'none';
  const n = Number(v);
  if (!Number.isFinite(n)) return 'none';
  const s = n.toFixed(PRINT[cls]);
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
};

/** One printer per class, each the digest's own width. A missing value prints none. */
export const fmt = Object.fromEntries(Object.keys(PRINT).map((k) => [k, fixedAt(k)]));
/** A value the digest prints as it is: none for missing, blank for an empty box. */
export const plain = (v) => (v === null || v === undefined ? 'none' : v === '' ? 'blank' : String(v));

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a terminal or pricing quantity.
// ---------------------------------------------------------------------------

/** The engine's refusal sentence, from whichever key that call carries it on. */
const reasonOf = (r) => (r && (r.error || (r.found === false ? r.reason : null))) || null;

/** A refusal as a panel shows one: its label and the ENGINE'S OWN message. */
const refusalOf = (label, r) => ({ label, message: reasonOf(r) });

/** A number for LOCATING a height in a table, never for sending to an engine. */
const position = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));

const clone = (o) => JSON.parse(JSON.stringify(o));

const TANKS = AKODO_TANKS.map((t) => ({ ...t, table: akodoTable(t) }));
const tankOf = (id) => TANKS.find((t) => t.id === id) || null;
const BC = BADAGRY_CARGO;

// ===========================================================================
// SECTIONS 1 AND 2: what the two apps compute, and missing stays missing.
// ===========================================================================

/** SECTION 1: the modules' exports, counted off the modules themselves, and their constants. */
export function enginesAt() {
  const count = (mod) => ({
    functions: Object.entries(mod).filter(([, v]) => typeof v === 'function').map(([k]) => k).sort(),
    constants: Object.entries(mod).filter(([, v]) => typeof v !== 'function').map(([k]) => k).sort(),
  });
  const S0 = IBAFO_STATION;
  const st = FP.stationSizing({ ...S0 });
  // The station queues on its own unrounded arrivals and service minutes. These
  // two are the digest's statement of them, handed to rackQueue to show that a
  // forecourt and a rack are one queue model.
  const arrivalsDerived = (S0.dailyThroughputLitres / S0.litresPerTransaction) * S0.peakHourShare;
  const serviceDerived = S0.litresPerTransaction / S0.dispenseRateLitresPerMinute + S0.transactionOverheadMinutes;
  const rack = TD.rackQueue({ arrivalsPerHour: arrivalsDerived, loadMinutes: serviceDerived, bays: S0.nozzles });
  const printed = TD.rackQueue({ arrivalsPerHour: st.peakTransactionsPerHour, loadMinutes: st.serviceMinutesPerTransaction, bays: S0.nozzles });
  return {
    terminalDepot: count(TD),
    fuelPricing: count(FP),
    litresPerM3: FP.LITRES_PER_M3,
    m3PerBbl: FP.M3_PER_BBL,
    chargeBasis: Object.values(FP.CHARGE_BASIS),
    priceElementBasis: Object.values(FP.PRICE_ELEMENT_BASIS),
    importTemplate: clone(FP.IMPORT_TEMPLATE),
    pumpTemplate: clone(FP.PUMP_TEMPLATE),
    rateDisclaimer: FP.RATE_DISCLAIMER,
    productReference: clone(FP.PRODUCT_REFERENCE),
    stationQueue: {
      stationProbability: st.queue.probabilityOfWaiting,
      rackProbability: rack.probabilityOfWaiting,
      agree: Math.abs(st.queue.probabilityOfWaiting - rack.probabilityOfWaiting) < 1e-12,
      onPrintedRoundings: printed.probabilityOfWaiting,
    },
  };
}

/** The two templates' line items, for a panel's rate boxes. Every rate in them is absent. */
export const importTemplate = () => clone(FP.IMPORT_TEMPLATE);
export const pumpTemplate = () => clone(FP.PUMP_TEMPLATE);

/** SECTION 2: one call per row with one measured input left out. */
export function missingAt() {
  const AK1 = TANKS[0];
  const closing = morningAt().closingStandardM3;
  const noVcf = TD.dipToStandardVolume({ strapping: AK1.table, heightMm: AK1.dipMm, waterMm: AK1.waterMm, vcf: null });
  const noClose = TD.reconcileStock({ ...AKODO_DAY, closingDippedM3: null });
  const noFactor = TD.throughputEconomics({ ...IBAFO_ECONOMICS });
  const allBlank = landedAt({ rates: {}, insuranceBasis: 'cf' });
  const rows = [
    ['volumeAtDip', 'the strapping table', TD.volumeAtDip({ strapping: [], heightMm: 5000 })],
    ['volumeAtDip', 'the dip (null)', TD.volumeAtDip({ strapping: AK1.table, heightMm: null })],
    ['volumeAtDip', 'the dip (blank)', TD.volumeAtDip({ strapping: AK1.table, heightMm: '' })],
    ['dipToStandardVolume', 'the VCF', null, { grossM3: noVcf.grossM3, standardM3: noVcf.standardM3, note: noVcf.note }],
    ['volumeCorrectionFactor', 'the coefficients', TD.volumeCorrectionFactor({ densityKgM3: AK1.densityKgM3, temperatureC: AK1.temperatureC })],
    ['volumeCorrectionFactor', 'the density', TD.volumeCorrectionFactor({ temperatureC: AK1.temperatureC, coefficients: SYNTHETIC_COEFFICIENTS })],
    ['reconcileStock', 'the opening stock', TD.reconcileStock({ ...AKODO_DAY, openingM3: null, closingDippedM3: closing })],
    ['reconcileStock', 'the closing dip', null, { expectedClosingM3: noClose.expectedClosingM3, unaccountedM3: noClose.unaccountedM3, note: noClose.note }],
    ['rackQueue', 'the arrival rate', TD.rackQueue({ ...IBAFO_RACK, arrivalsPerHour: null })],
    ['throughputEconomics', 'the emission factor', null, { margin: noFactor.margin, emissionsKgCo2e: noFactor.emissionsKgCo2e, note: noFactor.carbonNote }],
    ['cargoQuantities', 'the density', FP.cargoQuantities({ quantity: BC.quantity, unit: BC.quantityUnit })],
    ['cargoQuantities', 'the quantity', FP.cargoQuantities({ unit: BC.quantityUnit, densityKgM3: BC.densityKgM3 })],
    ['landedCost', 'the FOB price', { error: landedAt({ insuranceBasis: 'cf', fobPrice: null }).refusal }],
    ['landedCost', 'every rate in the template', null, {
      complete: allBlank.complete, missing: allBlank.missingRates.length, totalUsd: allBlank.totalUsd, note: allBlank.basisOfTotal,
    }],
    ['buildPumpPrice', 'the landed cost per litre', FP.buildPumpPrice({ elements: elementsWith(BADAGRY_ELEMENTS) })],
    ['truckingEconomics', 'the distance', FP.truckingEconomics({ ...IBAFO_LANE, distanceKm: null })],
    ['fleetSizing', 'the trips per truck', FP.fleetSizing({ demandLitresPerDay: IBAFO_DEMAND_L_PER_DAY, payloadLitres: IBAFO_LANE.payloadLitres })],
    ['stationSizing', 'the nozzle count', FP.stationSizing({ ...IBAFO_STATION, nozzles: null })],
  ];
  return rows.map(([call, what, r, answer]) => ({
    call, what, refusal: r ? reasonOf(r) : null, answer: answer || null,
  }));
}

// ===========================================================================
// THE TANK EXPLORER (Associate): SECTIONS 3 TO 8.
// ===========================================================================

/** SECTION 3: the three AKODO tanks, each with its whole strapping table. */
export function akodoTablesAt() {
  return TANKS.map((t) => ({
    id: t.id,
    product: t.product,
    shape: t.shape,
    size: t.shape === 'vertical'
      ? `diameter ${t.diameterM} m, strapped to ${t.topMm} mm`
      : `diameter ${t.diameterM} m, length ${t.lengthM} m`,
    entries: t.table.length,
    stepMm: t.stepMm,
    first: { ...t.table[0] },
    last: { ...t.table[t.table.length - 1] },
    table: t.table.map((p) => ({ ...p })),
    dipMm: t.dipMm,
    waterMm: t.waterMm,
    densityKgM3: t.densityKgM3,
    temperatureC: t.temperatureC,
    vcfTyped: t.vcfTyped,
  }));
}

/** The partial calibration SECTION 4 puts to AK-01's diameter. */
export const partialTable = () => AKODO_PARTIAL_TABLE.map((p) => ({ ...p }));

/** The two table entries either side of a height, found by looking, never computed. */
const bracketOf = (table, dipMm) => {
  const h = position(dipMm);
  if (!Number.isFinite(h)) return { below: null, above: null };
  const below = [...table].reverse().find((p) => p.heightMm <= h) || null;
  const above = table.find((p) => p.heightMm >= h) || null;
  return { below: below && { ...below }, above: above && { ...above } };
};

/**
 * One dip on one tank's table, or on the partial table: the entries either side
 * and the volume volumeAtDip interpolates, or the engine's refusal.
 */
export function dipAt(tankId, dipMm, { partial = false } = {}) {
  const t = tankOf(tankId);
  if (!t) return { error: `There is no AKODO tank called ${tankId}.` };
  const table = partial ? AKODO_PARTIAL_TABLE : t.table;
  const r = TD.volumeAtDip({ strapping: table, heightMm: dipMm });
  return {
    tank: t.id, partial, dipMm, volumeM3: r.volumeM3, refusal: reasonOf(r), ...bracketOf(table, dipMm),
    firstMm: table[0].heightMm, lastMm: table[table.length - 1].heightMm,
  };
}

/** SECTION 3: the bracketing entries at each morning dip. */
export const morningDipsAt = () => TANKS.map((t) => dipAt(t.id, t.dipMm));

/** SECTION 3: AK-03's 100 mm table against the same bullet every 10 mm, and AK-01 the same way. */
export function curveAt() {
  const AK1 = TANKS[0]; const AK3 = TANKS[2];
  const fine3 = horizontalTable(AK3.diameterM, AK3.lengthM, 10);
  const fine1 = verticalTable(AK1.diameterM, AK1.topMm, 10);
  const at = (table, h) => TD.volumeAtDip({ strapping: table, heightMm: h }).volumeM3;
  const pair = (h) => {
    const coarse = at(AK3.table, h); const fine = at(fine3, h);
    return { heightMm: h, coarseM3: coarse, fineM3: fine, coarseLessFineDerivedM3: coarse - fine };
  };
  return {
    fineEntries: fine3.length,
    stepMm: AK3.stepMm,
    rows: [pair(AK3.dipMm), pair(AK3.waterMm)],
    ak01: { coarseM3: at(AK1.table, AK1.dipMm), fineM3: at(fine1, AK1.dipMm), stepMm: AK1.stepMm },
  };
}

/** SECTION 4: AK-01's dip swept up its table, both ends and both refusals. */
export const dipSweepAt = () => AKODO_DIP_SWEEP.map((d) => dipAt('AK-01', d));

/** SECTION 4: dips and water cuts put to the partial table through dipToStandardVolume. */
export const partialDipsAt = () => AKODO_PARTIAL_DIPS.map(([d, w]) => {
  const r = TD.dipToStandardVolume({ strapping: AKODO_PARTIAL_TABLE, heightMm: d, waterMm: w, vcf: null });
  return { dipMm: d, waterMm: w, grossM3: r.grossM3, refusal: r.grossM3 === null ? reasonOf(r) : null };
});

/** SECTION 4: AK-02 and AK-03 dipped ten millimetres above their own last entries. */
export const aboveLastAt = () => TANKS.slice(1).map((t) => {
  const top = t.table[t.table.length - 1].heightMm;
  return { ...dipAt(t.id, top + 10), lastMm: top };
});

/**
 * One tank's dip and water cut through dipToStandardVolume, with the VCF typed.
 * Beside it, the volume at the dip less the water HEIGHT: the reading the engine
 * DOES NOT USE, drawn so the difference on a curved tank can be seen.
 */
export function waterAt(tankId, dipMm, waterMm, vcf = null) {
  const t = tankOf(tankId);
  if (!t) return { error: `There is no AKODO tank called ${tankId}.` };
  const r = TD.dipToStandardVolume({ strapping: t.table, heightMm: dipMm, waterMm, vcf });
  const total = TD.volumeAtDip({ strapping: t.table, heightMm: dipMm });
  const d = position(dipMm); const w = position(waterMm);
  const byHeight = Number.isFinite(d) && Number.isFinite(w)
    ? TD.volumeAtDip({ strapping: t.table, heightMm: d - w }) : null;
  return {
    tank: t.id,
    shape: t.shape,
    dipMm,
    waterMm,
    volumeAtDipM3: total.volumeM3,
    waterM3: r.waterM3 === undefined ? null : r.waterM3,
    grossM3: r.grossM3,
    vcf: r.vcf === undefined ? null : r.vcf,
    standardM3: r.standardM3,
    note: r.note || null,
    refusal: r.grossM3 === null ? reasonOf(r) : null,
    heightLessWaterDerivedMm: Number.isFinite(d) && Number.isFinite(w) ? d - w : null,
    byHeightNotUsedM3: byHeight ? byHeight.volumeM3 : null,
  };
}

/** SECTION 5: AK-02 at its dip with the water cut swept. */
export const waterSweepAt = () => AKODO_WATER_SWEEP.map((w) => waterAt('AK-02', TANKS[1].dipMm, w));

/**
 * SECTIONS 5 AND 6: the morning, tank by tank at the typed VCFs, and the two
 * totals the digest sums from the engine's unrounded volumes.
 */
export function morningAt(vcfs = null) {
  const rows = TANKS.map((t) => waterAt(t.id, t.dipMm, t.waterMm, vcfs && t.id in vcfs ? vcfs[t.id] : t.vcfTyped));
  const sum = (k) => (rows.every((r) => Number.isFinite(r[k])) ? rows.reduce((a, r) => a + r[k], 0) : null);
  return {
    rows: rows.map((r, i) => ({ ...r, densityKgM3: TANKS[i].densityKgM3, temperatureC: TANKS[i].temperatureC })),
    closingGrossM3: sum('grossM3'),
    closingStandardM3: sum('standardM3'),
  };
}

/** SECTION 6: the ASTM D1250 FORM on the SYNTHETIC coefficient row. */
export function vcfAt(densityKgM3, temperatureC, coefficients = SYNTHETIC_COEFFICIENTS) {
  const r = TD.volumeCorrectionFactor({ densityKgM3, temperatureC, coefficients });
  return {
    densityKgM3, temperatureC, alpha: r.alpha === undefined ? null : r.alpha, vcf: r.vcf, refusal: reasonOf(r),
  };
}

/** The synthetic form across a temperature range, at one density, for a panel to draw. */
export function vcfCurveAt(densityKgM3 = TANKS[0].densityKgM3) {
  const out = [];
  for (let T = -10; T <= 60; T += 2.5) {
    const r = vcfAt(densityKgM3, T);
    if (r.vcf !== null) out.push({ temperatureC: T, vcf: r.vcf });
  }
  return out;
}

/** SECTION 6: with no coefficients, and with no density. */
export const vcfRefusalsAt = () => [
  refusalOf('no coefficients', TD.volumeCorrectionFactor({ densityKgM3: TANKS[0].densityKgM3, temperatureC: TANKS[0].temperatureC })),
  refusalOf('no density', TD.volumeCorrectionFactor({ temperatureC: TANKS[0].temperatureC, coefficients: SYNTHETIC_COEFFICIENTS })),
];
export const vcfTemperatureSweepAt = () => AKODO_VCF_TEMPERATURES.map((T) => vcfAt(TANKS[0].densityKgM3, T));
export const vcfDensitySweepAt = () => AKODO_VCF_DENSITIES.map((rho) => vcfAt(rho, TANKS[0].temperatureC));

/**
 * SECTION 7: the day closed by reconcileStock. Every input is handed over as the
 * learner left it. The throughput is the digest's sum of receipts and deliveries.
 */
export function dayAt(inputs = {}) {
  const args = {
    openingM3: AKODO_DAY.openingM3,
    receiptsM3: AKODO_DAY.receiptsM3,
    deliveriesM3: AKODO_DAY.deliveriesM3,
    knownLossM3: AKODO_DAY.knownLossM3,
    tolerancePercentOfThroughput: AKODO_DAY.tolerancePercentOfThroughput,
    closingDippedM3: morningAt().closingStandardM3,
    ...inputs,
  };
  const r = TD.reconcileStock(args);
  const rc = position(args.receiptsM3); const dl = position(args.deliveriesM3);
  return {
    inputs: args,
    expectedClosingM3: r.expectedClosingM3,
    dippedClosingM3: r.dippedClosingM3,
    unaccountedM3: r.unaccountedM3,
    unaccountedPercentOfThroughput: r.unaccountedPercentOfThroughput === undefined ? null : r.unaccountedPercentOfThroughput,
    toleranceM3: r.toleranceM3 === undefined ? null : r.toleranceM3,
    withinTolerance: r.withinTolerance,
    direction: r.direction || null,
    note: r.note || null,
    refusal: r.error || null,
    throughputDerivedM3: Number.isFinite(rc) && Number.isFinite(dl) ? rc + dl : null,
  };
}

/**
 * SECTION 7'S DEMONSTRATION, and nothing else: the opening stock taken from the
 * day's own closing dip, opening = closing - receipts + deliveries + known losses.
 * A day closed on it balances whatever the dip reads, so it measures nothing.
 */
export function openingFromClosingDerived(closingM3, inputs = {}) {
  const day = { ...AKODO_DAY, ...inputs };
  const vals = [closingM3, day.receiptsM3, day.deliveriesM3, day.knownLossM3].map(position);
  if (!vals.every(Number.isFinite)) return null;
  const [c, rc, dl, kl] = vals;
  return c - rc + dl + kl;
}

/** SECTION 7: the reconciliation that cannot fail, at the day's own dip and three others. */
export const cannotFailAt = () => [morningAt().closingStandardM3, ...AKODO_OTHER_CLOSINGS].map((c) => {
  const opening = openingFromClosingDerived(c);
  return { closingM3: c, openingM3: opening, ...dayAt({ openingM3: opening, closingDippedM3: c }) };
});

/** SECTION 7: the same day closed on the GROSS closing stock. */
export const grossDayAt = () => ({ closingGrossM3: morningAt().closingGrossM3, ...dayAt({ closingDippedM3: morningAt().closingGrossM3 }) });

/** SECTION 7: the tolerance percent swept. */
export const toleranceSweepAt = () => AKODO_TOLERANCE_SWEEP.map((tp) => ({ percent: tp, ...dayAt({ tolerancePercentOfThroughput: tp }) }));

/** SECTION 7: a day with no receipts and no deliveries. The dip is the digest's opening plus half a cubic metre. */
export const stillDayAt = () => {
  const r = TD.reconcileStock({
    openingM3: AKODO_DAY.openingM3, closingDippedM3: AKODO_DAY.openingM3 + 0.5, tolerancePercentOfThroughput: AKODO_DAY.tolerancePercentOfThroughput,
  });
  return {
    openingM3: AKODO_DAY.openingM3, dippedClosingM3: r.dippedClosingM3, unaccountedM3: r.unaccountedM3,
    toleranceM3: r.toleranceM3, withinTolerance: r.withinTolerance, direction: r.direction,
  };
};

/** SECTION 8: the history, the first n days kept, through trendUnaccounted. */
export function trendAt(daysKept = AKODO_HISTORY.length) {
  const n = Math.max(0, Math.min(AKODO_HISTORY.length, Math.round(position(daysKept)) || 0));
  const r = TD.trendUnaccounted(AKODO_HISTORY.slice(0, n));
  return {
    daysKept: n,
    rows: r.rows.map((x) => ({ ...x })),
    cumulativeM3: r.cumulativeM3,
    meanPercent: r.meanPercent,
    runLength: r.runLength,
    runDirection: r.runDirection,
    prompt: r.prompt === undefined ? null : r.prompt,
    cumulativeThroughputDerivedM3: r.rows.reduce((a, x) => a + x.throughputM3, 0),
  };
}

/** SECTION 8: the prompt threshold, the history trimmed one day at a time. */
export const trendThresholdAt = () => AKODO_DAYS_KEPT.map((n) => trendAt(n));

// ===========================================================================
// THE DEPOT EXPLORER (Professional): SECTIONS 9 TO 16.
// ===========================================================================

/**
 * SECTIONS 9 TO 11: the rack through rackQueue, exactly as the learner set it.
 * Three figures beside the engine's are the digest's own arithmetic on them:
 * Erlang B by the identity B = C(1 - u) / (1 - uC), the wait of a truck that
 * does queue (the mean wait over the probability of waiting), and Little's law.
 */
export function rackAt(inputs = {}) {
  const args = { ...IBAFO_RACK, ...inputs };
  const r = TD.rackQueue(args);
  const C = r.probabilityOfWaiting; const u = r.utilisation;
  const ok = r.stable === true;
  return {
    inputs: args,
    offered: r.offered === undefined ? null : r.offered,
    utilisation: r.utilisation,
    bays: r.bays === undefined ? null : r.bays,
    stable: r.stable === undefined ? null : r.stable,
    probabilityOfWaiting: C === undefined ? null : C,
    averageWaitMinutes: r.averageWaitMinutes === undefined ? null : r.averageWaitMinutes,
    averageTimeOnSiteMinutes: r.averageTimeOnSiteMinutes === undefined ? null : r.averageTimeOnSiteMinutes,
    queueLength: r.queueLength === undefined ? null : r.queueLength,
    trucksPerDay: r.trucksPerDay === undefined ? null : r.trucksPerDay,
    refusal: r.error || null,
    erlangBDerived: ok ? (C * (1 - u)) / (1 - u * C) : null,
    waitIfQueuedDerivedMinutes: ok ? r.averageWaitMinutes / C : null,
    littleQueueDerived: ok ? (position(args.arrivalsPerHour) * r.averageWaitMinutes) / 60 : null,
  };
}

export const baySweepAt = () => IBAFO_BAY_SWEEP.map((b) => rackAt({ bays: b }));
export const rackRefusalsAt = () => [...IBAFO_RACK_REFUSALS, { ...IBAFO_RACK, loadMinutes: 0 }].map((q) => rackAt(q));
export const loadSweepAt = () => IBAFO_LOAD_SWEEP.map((lm) => rackAt({ loadMinutes: lm }));
export const arrivalSweepAt = () => IBAFO_ARRIVAL_SWEEP.map((a) => rackAt({ arrivalsPerHour: a }));

/**
 * The curve a panel draws: the engine asked at arrivals from one an hour up in
 * half steps, on the loading time and bays the learner set. A point where the
 * engine refuses is kept, with no wait, so the chart shows where the rack stops.
 */
export function rackCurveAt(inputs = {}) {
  const out = [];
  for (let a = 1; a <= 24; a += 0.5) {
    const r = rackAt({ ...inputs, arrivalsPerHour: a });
    if (r.utilisation === null) return out;
    out.push({ arrivalsPerHour: a, utilisation: r.utilisation, probabilityOfWaiting: r.probabilityOfWaiting, averageWaitMinutes: r.averageWaitMinutes, stable: r.stable });
    if (r.stable === false) return out;
  }
  return out;
}

/**
 * SECTION 12: the farm through tankFarmCover, and each tank through it alone.
 * The farm's stock less the farm's heel sits beside the pumpable stock as the
 * figure the engine DOES NOT USE.
 */
export function farmAt(tanks = IBAFO_TANKS, dailyThroughputM3 = IBAFO_DAILY_M3) {
  const f = TD.tankFarmCover({ tanks, dailyThroughputM3 });
  return {
    tanks: tanks.map((t) => {
      const one = TD.tankFarmCover({ tanks: [t], dailyThroughputM3 });
      // The part of the stock at or below the heel, drawn under the pumpable
      // stock so a tank's three bars add up to its capacity on the chart.
      const s = position(t.stockM3); const h = position(t.heelM3);
      return {
        ...t, pumpableM3: one.pumpableStockM3, ullageM3: one.ullageM3,
        stockAtOrBelowHeelDrawnM3: Number.isFinite(s) && Number.isFinite(h) ? Math.min(s, h) : null,
      };
    }),
    capacityM3: f.capacityM3,
    heelM3: f.heelM3,
    workingCapacityM3: f.workingCapacityM3,
    stockM3: f.stockM3,
    pumpableStockM3: f.pumpableStockM3,
    ullageM3: f.ullageM3,
    dailyThroughputM3,
    daysOfCover: f.daysOfCover,
    turnsPerYear: f.turnsPerYear,
    stockLessHeelNotUsedM3: f.stockM3 - f.heelM3,
  };
}

/** SECTION 23: IB-T1 and IB-T2 together. */
export const farmPairAt = () => farmAt(IBAFO_TANKS.slice(0, 2));

/** SECTION 12: with no daily throughput. */
export const farmNoThroughputAt = () => {
  const f = TD.tankFarmCover({ tanks: IBAFO_TANKS });
  return { daysOfCover: f.daysOfCover, turnsPerYear: f.turnsPerYear };
};

/** SECTION 13: throughputEconomics, the carbon ledger beside the money one. */
export function economicsAt(inputs = {}) {
  const args = { ...IBAFO_ECONOMICS, lossEmissionFactorKgCo2ePerTonne: SYNTHETIC_LOSS_FACTOR_KG_PER_T, ...inputs };
  const r = TD.throughputEconomics(args);
  return {
    inputs: args,
    revenue: r.revenue === undefined ? null : r.revenue,
    variableCost: r.variableCost === undefined ? null : r.variableCost,
    fixedCost: r.fixedCost === undefined ? null : r.fixedCost,
    margin: r.margin,
    marginPerM3: r.marginPerM3 === undefined ? null : r.marginPerM3,
    lossTonnes: r.lossTonnes === undefined ? null : r.lossTonnes,
    emissionsKgCo2e: r.emissionsKgCo2e === undefined ? null : r.emissionsKgCo2e,
    kgCo2ePerTonneThroughput: r.kgCo2ePerTonneThroughput === undefined ? null : r.kgCo2ePerTonneThroughput,
    carbonNote: r.carbonNote === undefined ? null : r.carbonNote,
    assumedZero: r.assumedZero ? [...r.assumedZero] : [],
    refusal: r.error || null,
  };
}

export const economicsCasesAt = () => [
  ['factor and density supplied', economicsAt()],
  ['no emission factor', economicsAt({ lossEmissionFactorKgCo2ePerTonne: null })],
  ['no density', economicsAt({ productDensityKgM3: null })],
];

export const economicsBlanksAt = () => [
  ['the throughput', economicsAt({ throughputM3: '', lossEmissionFactorKgCo2ePerTonne: null })],
  ['the fee', economicsAt({ feePerM3: null, lossEmissionFactorKgCo2ePerTonne: null })],
  ['the fixed cost', economicsAt({ fixedCostPerPeriod: '', lossEmissionFactorKgCo2ePerTonne: null })],
  ['nothing', economicsAt({ lossEmissionFactorKgCo2ePerTonne: null })],
];

/**
 * SECTION 14: the lane through truckingEconomics. A key the caller leaves out
 * of `omit` is left out of the call, which is how the digest shows a signature
 * default beside a blank box.
 */
export function laneAt(inputs = {}, omit = []) {
  const args = Object.fromEntries(Object.entries({ ...IBAFO_LANE, ...inputs }).filter(([k]) => !omit.includes(k)));
  const r = FP.truckingEconomics(args);
  if (r.error) return { inputs: args, refusal: r.error };
  return {
    inputs: args,
    refusal: null,
    complete: r.complete,
    missingInputs: [...r.missingInputs],
    roundTripKm: r.roundTripKm,
    cycleHours: r.cycleHours,
    tripsPerTruckPerDay: r.tripsPerTruckPerDay,
    tripsPerTruckPerYear: r.tripsPerTruckPerYear,
    components: r.components.map((c) => ({ ...c })),
    costPerTrip: r.costPerTrip,
    deliveredLitresPerTrip: r.deliveredLitresPerTrip,
    costPerLitreDelivered: r.costPerLitreDelivered,
    dieselLitresPerTrip: r.dieselLitresPerTrip,
    kgCo2ePerTrip: r.kgCo2ePerTrip,
    carbonNote: r.carbonNote,
  };
}

export const laneDriverCasesAt = () => [
  ['typed', laneAt()],
  ['blank', laneAt({ driverCostPerTrip: '' })],
  ['null', laneAt({ driverCostPerTrip: null })],
  ['left out of the call', laneAt({}, ['driverCostPerTrip'])],
];
export const laneNoCapitalAt = () => laneAt({ truckCapitalCost: null });
export const laneDistancesAt = () => IBAFO_DISTANCE_SWEEP.map((d) => laneAt({ distanceKm: d }));

/** SECTION 15: fleetSizing on the lane's own trips a truck a day. */
export function fleetAt(demandLitresPerDay = IBAFO_DEMAND_L_PER_DAY, lane = null) {
  const l = lane || laneAt();
  const r = FP.fleetSizing({
    demandLitresPerDay, payloadLitres: l.inputs ? l.inputs.payloadLitres : IBAFO_LANE.payloadLitres, tripsPerTruckPerDay: l.tripsPerTruckPerDay,
  });
  if (r.error) return { demandLitresPerDay, refusal: r.error };
  return { demandLitresPerDay, payloadLitres: l.inputs.payloadLitres, tripsPerTruckPerDay: l.tripsPerTruckPerDay, refusal: null, ...r };
}
export const fleetSweepAt = () => IBAFO_DEMAND_SWEEP.map((d) => fleetAt(d));
export const fleetNoDemandAt = () => fleetAt(null);

/** SECTION 16: stationSizing, its queue from rackQueue, and the ullage check. */
export function stationAt(inputs = {}) {
  const args = { ...IBAFO_STATION, ...inputs };
  const r = FP.stationSizing(args);
  if (r.error) return { inputs: args, refusal: r.error };
  return {
    inputs: args,
    refusal: null,
    transactionsPerDay: r.transactionsPerDay,
    peakTransactionsPerHour: r.peakTransactionsPerHour,
    serviceMinutesPerTransaction: r.serviceMinutesPerTransaction,
    queue: {
      utilisation: r.queue.utilisation,
      stable: r.queue.stable === undefined ? null : r.queue.stable,
      probabilityOfWaiting: r.queue.probabilityOfWaiting === undefined ? null : r.queue.probabilityOfWaiting,
      averageWaitMinutes: r.queue.averageWaitMinutes === undefined ? null : r.queue.averageWaitMinutes,
      refusal: r.queue.error || null,
    },
    usableTankLitres: r.usableTankLitres,
    coverDays: r.coverDays,
    reorderLevelLitres: r.reorderLevelLitres,
    ullageAtReorderLitres: r.ullageAtReorderLitres,
    deliveryPayloadLitres: r.deliveryPayloadLitres,
    payloadFitsUllage: r.payloadFitsUllage,
    ullageWarning: r.ullageWarning,
  };
}
export const nozzleSweepAt = () => IBAFO_NOZZLE_SWEEP.map((n) => stationAt({ nozzles: n }));
export const reorderSweepAt = () => IBAFO_REORDER_SWEEP.map((fr) => stationAt({ reorderAtFraction: fr }));

// ===========================================================================
// THE PRICE EXPLORER (Expert): SECTIONS 17 TO 22.
// ===========================================================================

/** SECTION 17: one cargo in every unit, through cargoQuantities. */
export function cargoAt(quantity = BC.quantity, unit = BC.quantityUnit, densityKgM3 = BC.densityKgM3) {
  const r = FP.cargoQuantities({ quantity, unit, densityKgM3 });
  if (r.error) return { quantity, unit, densityKgM3, refusal: r.error };
  return { quantity, unit, densityKgM3, refusal: null, m3: r.m3, litres: r.litres, tonnes: r.tonnes, bbl: r.bbl };
}
/** The units a panel offers, read off the digest's own unit rows (the last one is refused). */
export const CARGO_UNITS = [...new Set(BADAGRY_QUANTITY_UNITS.map(([, u]) => u))];
export const cargoUnitsAt = () => BADAGRY_QUANTITY_UNITS.map(([q, u]) => cargoAt(q, u));
export const cargoDensitiesAt = () => FP.PRODUCT_REFERENCE.map((p) => ({ code: p.code, ...cargoAt(BC.quantity, 'tonne', p.typicalDensityKgM3) }));
export const cargoZeroAt = () => cargoAt(0);

/** The import template with the course's invented rates in it. A rate the caller leaves out is absent. */
export const chargesWith = (rates, insuranceBasis = 'cif', over = {}) => FP.IMPORT_TEMPLATE.map((c) => ({
  ...c,
  amount: rates[c.id] ?? null,
  ...(c.id === 'insurance' && insuranceBasis === 'cif' ? { basis: FP.CHARGE_BASIS.PERCENT_OF_CIF } : {}),
  ...(over[c.id] || {}),
}));

/** The pump template with the course's invented elements in it. */
export const elementsWith = (vals, vatBasis = 'running') => FP.PUMP_TEMPLATE.map((e) => ({
  ...e,
  amount: vals[e.id] ?? null,
  ...(e.id === 'vat' && vatBasis === 'landed' ? { basis: FP.PRICE_ELEMENT_BASIS.PERCENT_OF_LANDED } : {}),
}));

/**
 * SECTIONS 18 AND 19: the landed cost walk through landedCost. The insurance
 * basis is a switch between CIF (the usual marine quote, and the case the
 * digest prices) and C&F (the basis the template ships). The staircase a panel
 * draws is the running sum of the engine's own line amounts, and its last step
 * is the engine's total.
 */
export function landedAt({
  rates = BADAGRY_RATES, insuranceBasis = 'cif', over = {}, extraCharges = [],
  oceanLossPercent = BC.oceanLossPercent, fxRate = BC.fxRate, fobPrice = BC.fobPrice,
  quantity = BC.quantity, densityKgM3 = BC.densityKgM3,
} = {}) {
  const r = FP.landedCost({
    quantity, quantityUnit: BC.quantityUnit, densityKgM3, fobPrice, fobBasis: BC.fobBasis,
    charges: [...chargesWith(rates, insuranceBasis, over), ...extraCharges], oceanLossPercent, fxRate,
  });
  if (r.error) {
    return { refusal: r.error, complete: false, missingRates: [], lines: (r.lines || []).map((l) => ({ ...l })) };
  }
  let run = 0;
  return {
    refusal: null,
    complete: r.complete,
    missingRates: [...r.missingRates],
    quantities: { ...r.quantities },
    outturn: { ...r.outturn },
    lines: r.lines.map((l) => {
      const base = run;
      if (Number.isFinite(l.amount)) run += l.amount;
      return { ...l, baseDrawnUsd: base, runningDrawnUsd: run };
    }),
    fob: r.fob,
    cf: r.cf,
    cif: r.cif,
    totalUsd: r.totalUsd,
    perLitreUsd: r.perLitreUsd,
    perLitreLocal: r.perLitreLocal,
    fxRate: r.fxRate,
    oceanLossPercent: r.oceanLossPercent,
    basisOfTotal: r.basisOfTotal,
  };
}

/** SECTION 18: the four charges the walk refuses. */
export const landedRefusalsAt = () => [
  ['freight typed as a percent of CIF', landedAt({ insuranceBasis: 'cf', over: { freight: { basis: FP.CHARGE_BASIS.PERCENT_OF_CIF, amount: BADAGRY_FORWARD_FREIGHT_RATE } } })],
  ['freight typed as a percent of C&F', landedAt({ insuranceBasis: 'cf', over: { freight: { basis: FP.CHARGE_BASIS.PERCENT_OF_CF, amount: BADAGRY_FORWARD_FREIGHT_RATE } } })],
  ['a charge with the stage "customs"', landedAt({ extraCharges: [{ ...BADAGRY_CUSTOMS_CHARGE }] })],
  ['insurance on CIF at 100 percent', landedAt({ rates: { ...BADAGRY_RATES, insurance: BADAGRY_FULL_INSURANCE } })],
].map(([label, r]) => ({ label, message: r.refusal }));

/** SECTION 18: floors, and a rate typed 0 beside a rate left blank. */
export const landedFloorsAt = () => ({
  dutyAndFinanceBlank: landedAt({ rates: { ...BADAGRY_RATES, duty: null, finance: null } }),
  everyRateBlank: landedAt({ rates: {} }),
  dutyZero: landedAt({ rates: { ...BADAGRY_RATES, duty: 0 } }),
  dutyBlank: landedAt({ rates: { ...BADAGRY_RATES, duty: '' } }),
});

/** SECTION 19: the ocean loss swept, the landed total fixed. */
export const lossSweepAt = () => BADAGRY_LOSS_SWEEP.map((lp) => ({ lossPercent: lp, ...landedAt({ oceanLossPercent: lp }) }));

/** The ocean loss from none to two percent, for a panel to draw. */
export function lossCurveAt() {
  const out = [];
  for (let i = 0; i <= 20; i += 1) {
    const r = landedAt({ oceanLossPercent: i / 10 });
    if (!r.refusal) out.push({ lossPercent: i / 10, perLitreUsd: r.perLitreUsd, perLitreLocal: r.perLitreLocal, totalUsd: r.totalUsd });
  }
  return out;
}

/**
 * SECTION 19, H1: every charge quoted per quantity is charged on the bill of
 * lading. The four such lines, and the two quantities.
 */
export function h1At(lossPercent = BC.oceanLossPercent) {
  const l = landedAt({ oceanLossPercent: lossPercent });
  if (l.refusal) return { refusal: l.refusal };
  const line = (k) => l.lines.find((x) => x.key === k) || null;
  return {
    jetty: line('jetty'), storage: line('storage'), regulator: line('regulator'), port: line('port'),
    billOfLadingM3: l.quantities.m3, billOfLadingLitres: l.quantities.litres, billOfLadingTonnes: l.quantities.tonnes,
    outturnM3: l.outturn.m3, outturnLitres: l.outturn.litres,
  };
}

/** The landed cost a litre at the depot gate, in naira, that the digest's pump build-up starts from. */
const landedLocal = () => landedAt().perLitreLocal;

/**
 * SECTIONS 20 AND 21: buildPumpPrice on the landed cost, and marginWaterfall on
 * the build-up. The cap is a control; so is the basis of the VAT line.
 */
export function pumpAt({
  landedPerLitre = landedLocal(), elements = BADAGRY_ELEMENTS, capPerLitre = BADAGRY_CAP, vatBasis = 'running', dropRecipient = null,
} = {}) {
  const els = elementsWith(elements, vatBasis).map((e) => (e.id === dropRecipient ? { ...e, recipient: undefined } : e));
  const r = FP.buildPumpPrice({ landedPerLitre, elements: els, capPerLitre });
  const w = FP.marginWaterfall(r);
  if (r.error) return { refusal: r.error, lines: [], groups: [], waterfallRefusal: w.error || null };
  return {
    refusal: null,
    complete: r.complete,
    missingRates: [...r.missingRates],
    // The waterfall a panel draws stands each element on the engine's running
    // total before it, which is the running total after it less its amount.
    lines: r.lines.map((l, i) => ({ ...l, baseDrawn: i === 0 ? 0 : r.lines[i - 1].running })),
    landedPerLitre: r.landedPerLitre,
    pricePerLitre: r.pricePerLitre,
    capPerLitre: r.capPerLitre,
    shortfallPerLitre: r.shortfallPerLitre,
    capCoversChain: r.capCoversChain,
    basisOfPrice: r.basisOfPrice,
    groups: w.groups.map((g) => ({ ...g, lines: [...g.lines] })),
    waterfallRefusal: w.error || null,
  };
}

/** SECTIONS 20 AND 21: the build-up's other cases. */
export const pumpCasesAt = () => ({
  lowCap: pumpAt({ capPerLitre: BADAGRY_LOW_CAP }),
  vatOnLanded: pumpAt({ vatBasis: 'landed', capPerLitre: null }),
  dealerAndLeviesBlank: pumpAt({ elements: { ...BADAGRY_ELEMENTS, dealer: null, levies: null }, capPerLitre: null }),
  bridgingUnattributed: pumpAt({ dropRecipient: 'bridging' }),
  refused: pumpAt({ landedPerLitre: null }),
});

/** The whole chain re-priced at one exchange rate: landed, then the pump build-up. */
export const priceAtFx = (rate) => {
  const l = landedAt({ fxRate: rate });
  if (l.refusal || l.perLitreLocal === null) return NaN;
  return FP.buildPumpPrice({ landedPerLitre: l.perLitreLocal, elements: elementsWith(BADAGRY_ELEMENTS) }).pricePerLitre;
};

/**
 * SECTION 22: the exchange rate sensitivity. The bracket is two controls; the
 * chain is re-priced by priceSensitivity at seven evenly spaced rates across it,
 * and solveCrossing searches that bracket for the rate where the price meets the
 * cap. With no cap there is nothing to cross. A bracket written backwards goes to
 * solveCrossing as written, and it is the engine that refuses it.
 */
export function fxAt({ lo = Math.min(...BADAGRY_FX_VALUES), hi = Math.max(...BADAGRY_FX_VALUES), capPerLitre = BADAGRY_CAP } = {}) {
  const a = position(lo); const b = position(hi); const cap = position(capPerLitre);
  const values = Number.isFinite(a) && Number.isFinite(b) && a < b
    ? Array.from({ length: 7 }, (_, i) => a + (i * (b - a)) / 6) : [];
  const s = FP.priceSensitivity({ price: priceAtFx, values, capPerLitre: Number.isFinite(cap) ? cap : null });
  const breakeven = Number.isFinite(cap)
    ? FP.solveCrossing({ evaluate: (x) => priceAtFx(x) - cap, lo, hi })
    : null;
  return {
    lo, hi, capPerLitre,
    points: s.points.map((p) => ({ ...p })),
    breakeven: breakeven && {
      found: breakeven.found,
      value: breakeven.value === undefined ? null : breakeven.value,
      iterations: breakeven.iterations === undefined ? null : breakeven.iterations,
      refusal: breakeven.found ? null : breakeven.reason,
      atLo: breakeven.atLo === undefined ? null : breakeven.atLo,
      atHi: breakeven.atHi === undefined ? null : breakeven.atHi,
    },
  };
}

/** SECTION 22: the chain at each exchange rate, element by element. */
export const fxChainAt = () => BADAGRY_FX_VALUES.map((v) => {
  const l = landedAt({ fxRate: v });
  const p = pumpAt({ landedPerLitre: l.perLitreLocal, capPerLitre: null });
  const g = p.groups.find((x) => x.recipient === 'Government');
  return { fx: v, landedLocal: l.perLitreLocal, government: g ? g.amountPerLitre : null, pricePerLitre: p.pricePerLitre };
});

/** SECTION 22: the digest's own sweep, through priceSensitivity on the digest's seven rates. */
export const fxDigestSweepAt = () => {
  const s = FP.priceSensitivity({ price: priceAtFx, values: BADAGRY_FX_VALUES, capPerLitre: BADAGRY_CAP });
  return { points: s.points.map((p) => ({ ...p })), breakeven: { ...s.breakeven } };
};

/** SECTION 22: the two brackets that find nothing, and no cap. */
export const fxEdgesAt = () => ({
  narrow: fxAt({ lo: BADAGRY_FX_NARROW[0], hi: BADAGRY_FX_NARROW[BADAGRY_FX_NARROW.length - 1] }),
  backwards: fxAt({ lo: BADAGRY_FX_VALUES[BADAGRY_FX_VALUES.length - 1], hi: BADAGRY_FX_VALUES[0] }),
  noCap: fxAt({ capPerLitre: null }),
});

// ===========================================================================
// SECTION 23 and the whole surface.
// ===========================================================================

/** SECTION 23: the rules the engines keep, measured. */
export function rulesAt() {
  return {
    importRatesShipped: FP.IMPORT_TEMPLATE.filter((c) => c.amount !== null).length,
    importLines: FP.IMPORT_TEMPLATE.length,
    pumpRatesShipped: FP.PUMP_TEMPLATE.filter((c) => c.amount !== null).length,
    pumpLines: FP.PUMP_TEMPLATE.length,
    noOpening: dayAt({ openingM3: '' }).refusal,
    halfBay: rackAt({ bays: 2.5 }).refusal,
    zeroLoad: rackAt({ loadMinutes: 0 }).refusal,
    blankFee: economicsAt({ feePerM3: '' }).refusal,
    pair: farmPairAt(),
    cif: landedAt().cif,
    noThroughputTurns: farmNoThroughputAt().turnsPerYear,
    vcfAt15: vcfAt(TANKS[0].densityKgM3, 15).vcf,
  };
}

/** Every reader at its defaults: the snapshot the clock and zone gates compare. */
export function teachingSurface() {
  return {
    engines: enginesAt(),
    missing: missingAt(),
    tables: akodoTablesAt(),
    morningDips: morningDipsAt(),
    curve: curveAt(),
    dipSweep: dipSweepAt(),
    partialDips: partialDipsAt(),
    aboveLast: aboveLastAt(),
    waterSweep: waterSweepAt(),
    morning: morningAt(),
    vcfRefusals: vcfRefusalsAt(),
    vcfTemperature: vcfTemperatureSweepAt(),
    vcfDensity: vcfDensitySweepAt(),
    day: dayAt(),
    cannotFail: cannotFailAt(),
    grossDay: grossDayAt(),
    toleranceSweep: toleranceSweepAt(),
    stillDay: stillDayAt(),
    trend: trendAt(),
    trendThreshold: trendThresholdAt(),
    rack: rackAt(),
    baySweep: baySweepAt(),
    rackRefusals: rackRefusalsAt(),
    loadSweep: loadSweepAt(),
    arrivalSweep: arrivalSweepAt(),
    rackCurve: rackCurveAt(),
    vcfCurve: vcfCurveAt(),
    lossCurve: lossCurveAt(),
    farm: farmAt(),
    farmNoThroughput: farmNoThroughputAt(),
    economics: economicsCasesAt(),
    economicsBlanks: economicsBlanksAt(),
    lane: laneAt(),
    laneDriver: laneDriverCasesAt(),
    laneNoCapital: laneNoCapitalAt(),
    laneDistances: laneDistancesAt(),
    fleet: fleetAt(),
    fleetSweep: fleetSweepAt(),
    fleetNoDemand: fleetNoDemandAt(),
    station: stationAt(),
    nozzleSweep: nozzleSweepAt(),
    reorderSweep: reorderSweepAt(),
    cargoUnits: cargoUnitsAt(),
    cargoDensities: cargoDensitiesAt(),
    cargoZero: cargoZeroAt(),
    landed: landedAt(),
    landedCf: landedAt({ insuranceBasis: 'cf' }),
    landedRefusals: landedRefusalsAt(),
    landedFloors: landedFloorsAt(),
    lossSweep: lossSweepAt(),
    h1: h1At(),
    pump: pumpAt(),
    pumpCases: pumpCasesAt(),
    fx: fxAt(),
    fxDigest: fxDigestSweepAt(),
    fxChain: fxChainAt(),
    fxEdges: fxEdgesAt(),
    rules: rulesAt(),
  };
}
