// Teaching lab for the refinery course, "Refinery Feasibility & Planning"
// (academy module commercial_trading). The three explorer panels, the course
// learning page and the vitest files all read this one module, so a number shown
// to a learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every capital cost, slate
// value, throughput, margin, plan volume, stream value, schedule date, variance
// and tax figure below is a return value of engines/downstream (modularRefinery,
// refineryPlanning, streamModel) or of engines/economics/screening, reached
// through feasibilityEconomics, as vendored under packages/engines at petrolord
// engines e4d3b10. This is the ONLY file in the course that imports those
// modules. Where a reader carries a value that is not an engine return, it is a
// comparison or a sum of engine returns and it is commented Derived: whether a
// unit sits at its capacity, the plan-ledger totals summed from the schedule's
// events, the gap between two engine totals.
//
// NO FORMULA IS RESTATED. The capital comes from scaleCapex, the slate value from
// productSlate, the throughput, gross margin and every stream year from
// feasibilityStreams, the plan from planRefinery, the dates from
// cascadeToSchedule, the variance from reconcilePeriod and the tax from the
// screening engine. The one piece of caller arithmetic is the scenario's crude
// premium added to the crude cost before the streams are built, which is the
// caller's job in the engine's own contract (digest SECTION 6).
//
// THE CLOCK. cascadeToSchedule reads the machine clock when it is given no
// period start, and feasibilityEconomics and calculateEconomics read the year
// when they are given no start year. This lab passes periodStart: PERIOD_START,
// the YYYY-MM-DD STRING, and startYear: START_YEAR on every call. A Date built at
// local midnight would move the schedule back a day east of Greenwich (digest
// SECTION 16), so the one call that hands the engine a Date is the zone
// demonstration, zoneSchedules(), which builds that Date on purpose and says so.
// Nothing here constructs a Date with no arguments or reads Date.now.
// refineryLab.test.js builds the whole snapshot under two faked system dates and
// in child processes under Pacific/Pago_Pago and Africa/Lagos, and demands the
// same bytes.
//
// EVERY REFUSAL IS THE ENGINE'S OWN SENTENCE. A reader that the engine refused
// hands back { error } carrying the string the engine returned or threw. No
// refusal sentence is written as a literal anywhere in this directory, and the
// lab test asserts that over the lab and every panel source.
//
// NO NPV OR IRR HEADLINE. The expansion's NPV is handed back as one reading
// beside its cash flow and nothing more; the IRR the screening engine computes is
// never handed to a panel at all, and the lab test asserts no key names it.
//
// THE TEACHING CASES are the wave's own records, copied VERBATIM below from
// tools/course-waves/refinery/refinery_fields.mjs, which refinery_dump.mjs
// imports to build the teaching digest. refineryLab.test.js compares the block
// with the wave file byte for byte and imports the wave file to compare every
// value, so the copy cannot be edited here alone.
//
// THREE TEACHING CASES AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs three other records, and nothing in this lab imports, reads, names or
// reproduces any of them. panelCapstoneGuard.test.js sweeps this directory and
// the learning page for every graded answer, whole token, signed and bare.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

/* eslint-disable import/namespace */
import * as MR from '@petrolord/engines/engines/downstream/modularRefinery.js';
import * as RP from '@petrolord/engines/engines/downstream/refineryPlanning.js';
import * as SM from '@petrolord/engines/engines/downstream/streamModel.js';
import * as SC from '@petrolord/engines/engines/economics/screening.js';

/** The engine namespaces, for the lab test's resolution and clock checks. */
export const ENGINE = Object.freeze({
  MR, RP, SM, SC,
});

// ---- BEGIN VERBATIM refinery_fields.mjs ----
export const PERIOD_START = '2027-03-01';
export const PERIOD_DAYS = 31;
export const START_YEAR = 2027;
// A second start year, used once, to show the year labels no figure.
export const START_YEAR_CHECK = 2031;

/* ------------------------------------------------------------------ *
 * OKORDIA: the modular refinery feasibility screen (Associate).
 * ------------------------------------------------------------------ */
export const OKORDIA = {
  sponsor: 'Okordia Energy Refining Ltd',
  // A vendor's quotation for one plant, the reference point both scaling laws
  // start from.
  baseCost: 64e6,
  baseCapacity: 5000,
  capacities: [1000, 2500, 5000, 10000, 20000, 30000],
  // The study plant.
  configurationId: 'hydroskimming',
  capacityBpd: 5000,
  onstreamDays: 330,
  crudeCostPerBbl: 76,
  fixedOpexPerYear: 7.5e6,
  variableOpexPerBbl: 3.2,
  projectLife: 20,
  constructionYears: 2,
  prices: { lpg: 52, gasoline: 104, naphtha: 74, kerosene: 97, diesel: 101, fuelOil: 55 },
  // A product table where naphtha has no price typed, for the topping plant.
  pricesNaphthaBlank: { lpg: 52, gasoline: 104, kerosene: 97, diesel: 101, fuelOil: 55 },
  // Yields a user typed that do not account for the whole barrel.
  yieldsTyped: { lpg: 0.03, gasoline: 0.19, kerosene: 0.13, diesel: 0.31, fuelOil: 0.29, loss: 0.02 },
  licensingDone: ['lte'],
  licensingOutOfOrder: ['ltc'],
};

/* ------------------------------------------------------------------ *
 * ABUA: one month's configuration plan (Professional).
 * ------------------------------------------------------------------ */
export const ABUA = {
  operator: 'Abua Coastal Refining Ltd',
  streams: ['naphtha', 'reformate', 'kero', 'gasoil', 'ulsd', 'residue', 'offgas'],
  crudes: [
    { id: 'bonny_light', name: 'Bonny Light (illustrative)', cost: 81.3, available: 1500000,
      yields: { naphtha: 0.23, kero: 0.15, gasoil: 0.31, residue: 0.28, offgas: 0.03 } },
    { id: 'forcados', name: 'Forcados (illustrative)', cost: 77.6, available: 1100000,
      yields: { naphtha: 0.16, kero: 0.13, gasoil: 0.34, residue: 0.35, offgas: 0.02 } },
    { id: 'brass_river', name: 'Brass River (illustrative)', cost: 80.4, available: 600000,
      yields: { naphtha: 0.26, kero: 0.16, gasoil: 0.29, residue: 0.26, offgas: 0.03 } },
  ],
  units: [
    { id: 'cdu', name: 'Crude distillation', capacity: 2600000, opex: 1.25, feed: '', yields: {} },
    { id: 'reformer', name: 'Naphtha reformer', capacity: 420000, opex: 2.9, feed: 'naphtha', yields: { reformate: 0.85, offgas: 0.1 } },
    { id: 'dht', name: 'Diesel hydrotreater', capacity: 650000, opex: 1.8, feed: 'gasoil', yields: { ulsd: 0.97, offgas: 0.02 } },
  ],
  products: [
    { id: 'gasoline', name: 'Gasoline', price: 111, minDemand: 0, maxDemand: 450000, recipe: { reformate: 1 } },
    { id: 'naphtha_export', name: 'Naphtha export', price: 72.5, minDemand: 0, maxDemand: 200000, recipe: { naphtha: 1 } },
    { id: 'jet', name: 'Jet A-1', price: 105.5, minDemand: 0, maxDemand: 380000, recipe: { kero: 1 } },
    { id: 'diesel', name: 'Diesel (ULSD)', price: 104.8, minDemand: 0, maxDemand: 750000, recipe: { ulsd: 1 } },
    { id: 'gasoil_export', name: 'Gasoil export', price: 89.5, minDemand: 0, maxDemand: 250000, recipe: { gasoil: 1 } },
    { id: 'fuel_oil', name: 'Fuel oil', price: 59, minDemand: 0, maxDemand: 1000000, recipe: { residue: 1 } },
  ],
  cargoSize: 400000,
  // The variants the tier reads the plan under. Each is a path and a value.
  variants: [
    { id: 'dht-shut', label: 'the diesel hydrotreater typed as shut for a turnaround (capacity 0)', set: [['units', 'dht', 'capacity', 0]] },
    { id: 'dht-blank', label: 'the diesel hydrotreater capacity left blank (no limit)', set: [['units', 'dht', 'capacity', '']] },
    { id: 'cdu-tight', label: 'the crude unit at 1900000 barrels for the month', set: [['units', 'cdu', 'capacity', 1900000]] },
    { id: 'forcados-zero', label: 'the Forcados cargo cancelled (availability typed 0)', set: [['crudes', 'forcados', 'available', 0]] },
    { id: 'floors', label: 'a jet floor of 300000 and a fuel oil floor of 700000', set: [['products', 'jet', 'minDemand', 300000], ['products', 'fuel_oil', 'minDemand', 700000]] },
  ],
  // Reformer capacities for the debottleneck sweep.
  reformerSweep: [380000, 400000, 420000, 440000, 460000, 480000],
  refusals: [
    { id: 'blank-cost', label: 'the Forcados cost left blank', set: [['crudes', 'forcados', 'cost', '']] },
    { id: 'blank-opex-price', label: 'the reformer operating cost and the jet price left blank', set: [['units', 'reformer', 'opex', ''], ['products', 'jet', 'price', null]] },
    { id: 'negative-capacity', label: 'the reformer capacity typed as -1', set: [['units', 'reformer', 'capacity', -1]] },
    { id: 'crossed-demand', label: 'a gasoline floor of 500000 above its ceiling of 450000', set: [['products', 'gasoline', 'minDemand', 500000]] },
    { id: 'infeasible', label: 'a jet floor of 1000000 with its ceiling raised to 1200000', set: [['products', 'jet', 'minDemand', 1000000], ['products', 'jet', 'maxDemand', 1200000]] },
    { id: 'unbounded', label: 'every crude availability, unit capacity and demand ceiling left blank', blankAllLimits: true },
  ],
};

/* ------------------------------------------------------------------ *
 * ODIOMA: a month's plan, its actuals, and the expansion case (Expert).
 * ------------------------------------------------------------------ */
export const ODIOMA = {
  operator: 'Odioma Petroleum Refining Ltd',
  streams: ['naphtha', 'reformate', 'kero', 'gasoil', 'residue', 'offgas'],
  crudes: [
    { id: 'escravos', name: 'Escravos (illustrative)', cost: 78.9, available: 700000,
      yields: { naphtha: 0.21, kero: 0.14, gasoil: 0.33, residue: 0.29, offgas: 0.03 } },
    { id: 'forcados', name: 'Forcados (illustrative)', cost: 76.8, available: 400000,
      yields: { naphtha: 0.16, kero: 0.13, gasoil: 0.34, residue: 0.35, offgas: 0.02 } },
  ],
  units: [
    { id: 'cdu', name: 'Crude distillation', capacity: 1200000, opex: 1.4, feed: '', yields: {} },
    { id: 'reformer', name: 'Naphtha reformer', capacity: 190000, opex: 3.1, feed: 'naphtha', yields: { reformate: 0.86, offgas: 0.09 } },
  ],
  products: [
    { id: 'gasoline', name: 'Gasoline', price: 110.5, minDemand: 0, maxDemand: 200000, recipe: { reformate: 1 } },
    { id: 'jet', name: 'Jet A-1', price: 104.9, minDemand: 0, maxDemand: 160000, recipe: { kero: 1 } },
    { id: 'diesel', name: 'Diesel', price: 100.6, minDemand: 0, maxDemand: 400000, recipe: { gasoil: 1 } },
    { id: 'fuel_oil', name: 'Fuel oil', price: 60.2, minDemand: 0, maxDemand: 500000, recipe: { residue: 1 } },
  ],
  cargoSize: 350000,
  // What the month actually did, one aggregated movement a material and type,
  // in barrels and US dollars. A delivery's cost is what it sold for.
  actuals: [
    { materialId: 'escravos', type: 'receipt', quantity: 735000, cost: 58947000 },
    // The Forcados cargo never berthed; the terminal still billed demurrage
    // against it. Money with no barrels.
    { materialId: 'forcados', type: 'receipt', quantity: 0, cost: 212000 },
    { materialId: 'cdu', type: 'unit_run', quantity: 735000, cost: 1080450 },
    { materialId: 'reformer', type: 'unit_run', quantity: 131000, cost: 419200 },
    { materialId: 'gasoline', type: 'delivery', quantity: 112660, cost: 12628000 },
    { materialId: 'jet', type: 'delivery', quantity: 101200, cost: 10534900 },
    { materialId: 'diesel', type: 'delivery', quantity: 244000, cost: 24009600 },
    { materialId: 'fuel_oil', type: 'delivery', quantity: 210000, cost: 12810000 },
    // A spot sale nobody planned: liquefied gas recovered from the off-gas.
    { materialId: 'lpg', type: 'delivery', quantity: 9000, cost: 441000 },
  ],
  // Stocks at the start of the month and the closing dips. The digest prints no
  // material balance (RECON.md 3b, STOPPED); recon_findings.mjs reproduces the
  // finding from these two tables.
  openingStock: { escravos: 120000, diesel: 45000, fuel_oil: 60000 },
  closingDip: { escravos: 130500, diesel: 47300 },
  // The expansion: a conversion plant, valued through the screening engine.
  expansion: {
    configurationId: 'conversion',
    capacityBpd: 12000,
    onstreamDays: 340,
    scenarioId: 'firm',
    crudeCostPerBbl: 74,
    baseCost: 100e6,
    baseCapacity: 10000,
    modularExponent: 0.9,
    fixedOpexPerYear: 14e6,
    variableOpexPerBbl: 4.2,
    projectLife: 20,
    constructionYears: 2,
    discountRate: 12,
    taxRate: 30,
    prices: { lpg: 53, gasoline: 106, naphtha: 75, kerosene: 99, diesel: 102, fuelOil: 57 },
  },
};
// ---- END VERBATIM refinery_fields.mjs ----

/* ================================================================== *
 * Printing. The digest's own precision, one formatter a class, so a panel
 * prints a figure exactly as the lesson quotes it.
 * ================================================================== */

/** A number to d places, with a negative zero printed as zero; null prints as null. */
export const fx = (v, d) => {
  if (v === null || v === undefined) return 'null';
  if (typeof v !== 'number' || !Number.isFinite(v)) return String(v);
  const s = v.toFixed(d);
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
};
/** Barrels, two decimals. */
export const bbl = (v) => fx(v, 2);
/** US dollars, two decimals. */
export const usd = (v) => fx(v, 2);
/** US dollars a barrel, four decimals. */
export const pbl = (v) => fx(v, 4);
/** A fraction the engine returns, printed as a percent to two decimals. */
export const pct = (v) => (v === null || v === undefined ? 'null' : fx(v * 100, 2));
/** A fraction, four decimals. */
export const frac = (v) => fx(v, 4);
/** The screening engine's millions of US dollars, four decimals. */
export const mmd = (v) => fx(v, 4);
/** A difference taken over the PRINTED figures, as the digest takes it. Derived. */
export const pdiff = (a, b, f) => f(Number(f(a)) - Number(f(b)));

const absent = (v) => v === null || v === undefined || v === '';
const clone = (x) => JSON.parse(JSON.stringify(x));
const errorOf = (e) => (e && typeof e.message === 'string' ? e.message : String(e));

/* ================================================================== *
 * The lists the engines export, handed on as plain data.
 * ================================================================== */

export const SCALING_EXPONENT = { ...MR.SCALING_EXPONENT };
export const CONFIGURATION_IDS = Object.keys(MR.CONFIGURATIONS);
export const PRODUCT_IDS = ['lpg', 'naphtha', 'gasoline', 'kerosene', 'diesel', 'fuelOil'];
export const SUPPLY_SCENARIOS = MR.SUPPLY_SCENARIOS.map((s) => ({ ...s }));
export const LICENSING_STAGES = MR.LICENSING_STAGES.map((s) => ({ ...s, typicalEvidence: [...s.typicalEvidence] }));

/** One configuration as the engine exports it. */
export const configurationOf = (id) => {
  const c = MR.CONFIGURATIONS[id];
  if (!c) return null;
  return {
    id: c.id, name: c.name, description: c.description, units: [...c.units], productYields: { ...c.productYields },
  };
};

/** The engine's exported names, counted, for the course's first lesson (digest SECTION 1). */
export const moduleCounts = () => [['modularRefinery', MR], ['refineryPlanning', RP], ['streamModel', SM], ['screening', SC]]
  .map(([name, ns]) => ({
    module: name,
    functions: Object.values(ns).filter((v) => typeof v === 'function').length,
    constants: Object.values(ns).filter((v) => typeof v !== 'function').length,
  }));

/* ================================================================== *
 * ASSOCIATE. The OKORDIA screen (Modular Refinery Feasibility Studio).
 * ================================================================== */

/** Capacities the screen explorer draws both curves across, in bpd. */
export const CURVE_CAPACITIES = Array.from({ length: 60 }, (_, i) => (i + 1) * 500);

/**
 * Both scaling laws from OKORDIA's quotation (digest SECTION 3), with each
 * exponent a control. scaleComparison computes every cost; modularCheaper and
 * lawsEqual compare two of its returns (Derived).
 */
export const scaleAt = ({
  capacity = OKORDIA.capacityBpd,
  modularExponent = MR.SCALING_EXPONENT.MODULAR,
  stickBuiltExponent = MR.SCALING_EXPONENT.STICK_BUILT,
} = {}) => {
  const args = {
    baseCost: OKORDIA.baseCost, baseCapacity: OKORDIA.baseCapacity, modularExponent, stickBuiltExponent,
  };
  const withFlags = (r) => ({
    ...r,
    modularCheaper: r.modularCost !== null && r.stickBuiltCost !== null && r.modularCost < r.stickBuiltCost,
    lawsEqual: r.modularCost !== null && r.modularCost === r.stickBuiltCost,
  });
  const [point] = MR.scaleComparison({ ...args, capacities: [capacity] }).map(withFlags);
  const noExponentPassed = MR.scaleCapex({ baseCost: OKORDIA.baseCost, baseCapacity: OKORDIA.baseCapacity, capacity });
  return {
    reference: { cost: OKORDIA.baseCost, capacity: OKORDIA.baseCapacity },
    exponents: { modular: modularExponent, stickBuilt: stickBuiltExponent, defaults: { ...MR.SCALING_EXPONENT } },
    point,
    table: MR.scaleComparison({ ...args, capacities: OKORDIA.capacities }).map(withFlags),
    curve: MR.scaleComparison({ ...args, capacities: CURVE_CAPACITIES }).map(withFlags),
    noExponentPassed: { cost: noExponentPassed.cost, perBpd: noExponentPassed.perBpd, exponent: noExponentPassed.exponent },
    linearAt10000: MR.scaleCapex({
      baseCost: OKORDIA.baseCost, baseCapacity: OKORDIA.baseCapacity, capacity: 10000, exponent: 1,
    }),
  };
};

/** scaleCapex with a blank or zero input: no cost at all (digest SECTION 2). */
export const scaleNullCases = () => [
  ['capacity 0', { capacity: 0 }],
  ['reference cost blank', { baseCost: '' }],
  ['reference capacity blank', { baseCapacity: null }],
].map(([label, patch]) => {
  const r = MR.scaleCapex({
    baseCost: OKORDIA.baseCost, baseCapacity: OKORDIA.baseCapacity, capacity: OKORDIA.capacityBpd, ...patch,
  });
  return { label, cost: r.cost, perBpd: r.perBpd };
});

/**
 * The product slate of one configuration at a price table (digest SECTION 4).
 * A price left blank reaches the engine blank and comes back named as unpriced;
 * yields that do not close come back reported and never normalised.
 */
export const slateOf = ({ configurationId = OKORDIA.configurationId, prices = OKORDIA.prices, yields = null } = {}) => {
  const config = configurationOf(configurationId);
  if (!config) return { error: `No configuration ${configurationId}` };
  const productYields = yields || config.productYields;
  const s = MR.productSlate({ productYields, prices });
  return {
    configuration: config,
    productYields: { ...productYields },
    rows: s.rows.map((r) => ({ ...r })),
    loss: absent(productYields.loss) ? null : Number(productYields.loss),
    grossValuePerBbl: s.grossValuePerBbl,
    yieldTotal: s.yieldTotal,
    yieldsClose: s.yieldsClose,
    unpriced: [...s.unpriced],
  };
};

/** Every configuration's slate at OKORDIA's prices. */
export const slates = (prices = OKORDIA.prices) => CONFIGURATION_IDS.map((id) => slateOf({ configurationId: id, prices }));

const scenarioOf = (id) => MR.SUPPLY_SCENARIOS.find((s) => s.id === id) || null;

/** The screen's inputs as OKORDIA carries them, for a panel to edit. */
export const okordiaInputs = () => ({
  configurationId: OKORDIA.configurationId,
  capacityBpd: OKORDIA.capacityBpd,
  onstreamDays: OKORDIA.onstreamDays,
  scenarioId: 'firm',
  utilisation: undefined,
  crudeCostPerBbl: OKORDIA.crudeCostPerBbl,
  fixedOpexPerYear: OKORDIA.fixedOpexPerYear,
  variableOpexPerBbl: OKORDIA.variableOpexPerBbl,
  projectLife: OKORDIA.projectLife,
  constructionYears: OKORDIA.constructionYears,
  capexTyped: undefined,
  modularExponent: MR.SCALING_EXPONENT.MODULAR,
  prices: { ...OKORDIA.prices },
  yields: null,
});

/**
 * The OKORDIA screen through feasibilityStreams (digest SECTIONS 2, 5, 6).
 *
 * The capital is the modular law at the plant's capacity unless a capital is
 * typed (capexTyped): a typed blank reaches the engine blank and is refused. The
 * utilisation is the scenario's unless one is typed; a typed utilisation reaches
 * the engine exactly as typed, so 90 is refused with the engine's range. The
 * scenario's premium is added to the crude cost only when a crude cost was typed,
 * so a blank crude cost still reaches the engine blank.
 */
export const screenOf = (over = {}) => {
  const i = { ...okordiaInputs(), ...over };
  const scenario = scenarioOf(i.scenarioId);
  if (!scenario) return { error: `No supply scenario ${i.scenarioId}` };
  const slate = slateOf({ configurationId: i.configurationId, prices: i.prices, yields: i.yields });
  if (slate.error) return { error: slate.error };
  const law = MR.scaleCapex({
    baseCost: OKORDIA.baseCost, baseCapacity: OKORDIA.baseCapacity, capacity: i.capacityBpd, exponent: i.modularExponent,
  });
  const capex = i.capexTyped === undefined ? law.cost : i.capexTyped;
  const crudeCost = absent(i.crudeCostPerBbl) ? i.crudeCostPerBbl : Number(i.crudeCostPerBbl) + scenario.crudePremium;
  const st = MR.feasibilityStreams({
    capacityBpd: i.capacityBpd,
    onstreamDays: i.onstreamDays,
    utilisation: i.utilisation === undefined ? scenario.utilisation : i.utilisation,
    crudeCostPerBbl: crudeCost,
    slate,
    fixedOpexPerYear: i.fixedOpexPerYear,
    variableOpexPerBbl: i.variableOpexPerBbl,
    projectLife: i.projectLife,
    constructionYears: i.constructionYears,
    capex,
  });
  const base = {
    scenario: { ...scenario },
    slate,
    lawCapex: law.cost,
    crudeCostWithPremium: absent(crudeCost) ? null : crudeCost,
  };
  if (st.error) return { ...base, error: st.error, missing: st.missing ? [...st.missing] : null };
  const first = st.years.findIndex((y) => y.producing); // Derived
  return {
    ...base,
    capex: st.capex,
    capexPerBpd: st.capexPerBpd,
    annualBbl: st.annualBbl,
    grossValuePerBbl: slate.grossValuePerBbl,
    grossMarginPerBbl: st.grossMarginPerBbl,
    years: st.years.map((y) => ({ ...y })),
    yearsInStreams: st.years.length,
    firstProducingYear: first,
    firstProducing: first >= 0 ? { ...st.years[first] } : null,
  };
};

/** OKORDIA under each supply scenario (digest SECTION 6). */
export const scenarioTable = (over = {}) => MR.SUPPLY_SCENARIOS.map((s) => {
  const r = screenOf({ ...over, scenarioId: s.id, utilisation: undefined });
  return {
    id: s.id, name: s.name, utilisation: s.utilisation, crudePremium: s.crudePremium, note: s.note,
    error: r.error || null,
    crudeCostWithPremium: r.crudeCostWithPremium,
    annualBbl: r.error ? null : r.annualBbl,
    grossMarginPerBbl: r.error ? null : r.grossMarginPerBbl,
    firstRevenue: r.error ? null : r.firstProducing.revenue,
    firstCrudeCost: r.error ? null : r.firstProducing.crudeCost,
  };
});

/** Every configuration under every supply scenario (digest SECTION 8). */
export const screenTable = () => CONFIGURATION_IDS.flatMap((configurationId) => MR.SUPPLY_SCENARIOS.map((s) => {
  const r = screenOf({ configurationId, scenarioId: s.id });
  return {
    configurationId,
    scenarioId: s.id,
    grossValuePerBbl: r.grossValuePerBbl,
    annualBbl: r.annualBbl,
    grossMarginPerBbl: r.grossMarginPerBbl,
    firstRevenue: r.firstProducing.revenue,
  };
}));

/**
 * The blank boxes and out-of-range entries on the OKORDIA plant, one at a time,
 * each with what the engine returned (digest SECTION 2). The capital is the
 * modular law at the reference point; the utilisation is the firm scenario's.
 */
export const screenRefusals = () => {
  const slate = slateOf();
  const cap = MR.scaleCapex({ baseCost: OKORDIA.baseCost, baseCapacity: OKORDIA.baseCapacity, capacity: OKORDIA.capacityBpd });
  const base = {
    capacityBpd: OKORDIA.capacityBpd,
    onstreamDays: OKORDIA.onstreamDays,
    utilisation: scenarioOf('firm').utilisation,
    crudeCostPerBbl: OKORDIA.crudeCostPerBbl,
    slate,
    fixedOpexPerYear: OKORDIA.fixedOpexPerYear,
    variableOpexPerBbl: OKORDIA.variableOpexPerBbl,
    projectLife: OKORDIA.projectLife,
    constructionYears: OKORDIA.constructionYears,
    capex: cap.cost,
  };
  const streams = [
    ['crude cost left blank', { crudeCostPerBbl: '' }],
    ['capital cost left blank', { capex: '' }],
    ['capacity and fixed operating cost left blank', { capacityBpd: '', fixedOpexPerYear: '' }],
    ['variable operating cost left blank', { variableOpexPerBbl: null }],
    ['utilisation typed as 90', { utilisation: 90 }],
    ['utilisation typed as -0.1', { utilisation: -0.1 }],
    ['on-stream days typed as 400', { onstreamDays: 400 }],
    ['on-stream days typed as 0', { onstreamDays: 0 }],
    ['utilisation typed as 0', { utilisation: 0 }],
  ].map(([label, patch]) => {
    const r = MR.feasibilityStreams({ ...base, ...patch });
    return { label, error: r.error || null, annualBbl: r.error ? null : r.annualBbl };
  });
  const good = MR.feasibilityStreams(base);
  const bad = MR.feasibilityStreams({ ...base, crudeCostPerBbl: '' });
  const economics = [
    ['streams refused for a blank crude cost', MR.feasibilityEconomics({
      streams: bad, discountRate: 12, taxRate: 30, startYear: START_YEAR,
    })],
    ['tax rate left out of the call', MR.feasibilityEconomics({ streams: good, discountRate: 12, startYear: START_YEAR })],
    ['tax rate left blank', MR.feasibilityEconomics({
      streams: good, discountRate: 12, taxRate: '', startYear: START_YEAR,
    })],
    ['discount rate typed as null', MR.feasibilityEconomics({
      streams: good, discountRate: null, taxRate: 30, startYear: START_YEAR,
    })],
  ].map(([label, r]) => ({ label, error: r.error || null }));
  return { streams, economics, scale: scaleNullCases() };
};

/** A schedule term left out, then each one left blank (digest SECTION 5). */
export const scheduleTermDefaults = () => {
  const slate = slateOf();
  const cap = MR.scaleCapex({ baseCost: OKORDIA.baseCost, baseCapacity: OKORDIA.baseCapacity, capacity: OKORDIA.capacityBpd });
  const need = {
    capacityBpd: OKORDIA.capacityBpd,
    crudeCostPerBbl: OKORDIA.crudeCostPerBbl,
    slate,
    fixedOpexPerYear: OKORDIA.fixedOpexPerYear,
    variableOpexPerBbl: OKORDIA.variableOpexPerBbl,
    capex: cap.cost,
  };
  return [
    ['every term left out', {}],
    ['on-stream days blank', { onstreamDays: '' }],
    ['utilisation blank', { utilisation: '' }],
    ['project life blank', { projectLife: '' }],
    ['construction years blank', { constructionYears: '' }],
  ].map(([label, patch]) => {
    const r = MR.feasibilityStreams({ ...need, ...patch });
    return {
      label, annualBbl: r.annualBbl, yearsInStreams: r.years.length, year0Capex: r.years[0].capex,
    };
  });
};

/** Where a project has got to in the licensing sequence (digest SECTION 7). */
export const licensingOf = (completedIds = []) => {
  const p = MR.licensingProgress(completedIds);
  return {
    completed: [...completedIds],
    stages: p.stages.map((s) => ({
      id: s.id, name: s.name, stage: s.stage, summary: s.summary, typicalEvidence: [...s.typicalEvidence], complete: s.complete,
    })),
    completeCount: p.completeCount,
    nextStage: p.nextStage ? p.nextStage.name : null,
    outOfOrder: p.outOfOrder,
  };
};

/* ================================================================== *
 * PROFESSIONAL. The ABUA plan and its schedule (Refinery Planning Studio).
 * ================================================================== */

/** A plan input from a case: its streams, crudes, units and products, deep-copied. */
export const planInputOf = (c) => clone({
  streams: c.streams, crudes: c.crudes, units: c.units, products: c.products,
});

/** ABUA's configuration as typed, for a panel to edit. */
export const abuaInput = () => planInputOf(ABUA);

/** One or more [kind, id, field, value] changes applied to a plan input. */
export const withSet = (set, input = abuaInput()) => {
  const x = clone(input);
  (set || []).forEach(([kind, id, field, value]) => {
    const r = (x[kind] || []).find((y) => y.id === id);
    if (r) r[field] = value;
  });
  return x;
};

/** Every crude availability, unit capacity and demand ceiling left blank. */
export const blankAllLimits = (input = abuaInput()) => {
  const x = clone(input);
  x.crudes.forEach((r) => { r.available = ''; });
  x.units.forEach((r) => { r.capacity = ''; });
  x.products.forEach((r) => { r.maxDemand = ''; });
  return x;
};

const finiteLimit = (v) => !absent(v) && Number.isFinite(Number(v));
const near = (a, b) => Math.abs(a - b) < 1e-6;

/**
 * The plan for a configuration (digest SECTIONS 9 to 14). A plan the engine
 * could not make comes back as its status and the engine's sentence. An optimal
 * plan comes back with the engine's figures and a few Derived readings taken
 * from them: the crude unit, whether its throughput and the crude run agree, the
 * units at their capacity, the crudes at their availability, the products at
 * their ceiling, and for each stream the products it goes into and the unit it
 * feeds, read off the configuration.
 */
export const planOf = (input = abuaInput()) => {
  let p;
  try {
    p = RP.planRefinery(input);
  } catch (e) {
    return { status: 'invalid', error: errorOf(e) };
  }
  if (p.status !== 'optimal') {
    return { status: p.status, error: p.error, missing: p.missing ? [...p.missing] : null };
  }
  const crudes = p.crudeRuns.map((c, i) => {
    const typed = input.crudes[i].available;
    return {
      id: c.id,
      name: c.name,
      volume: c.volume,
      cost: c.cost,
      available: finiteLimit(typed) ? Number(typed) : null,
      atAvailability: finiteLimit(typed) && near(c.volume, Number(typed)), // Derived
    };
  });
  const units = p.unitRuns.map((u) => ({
    id: u.id,
    name: u.name,
    crudeUnit: u.crudeUnit,
    throughput: u.throughput,
    capacity: Number.isFinite(u.capacity) ? u.capacity : null,
    capacityReported: String(u.capacity),
    utilisation: u.utilisation,
    atCapacity: u.utilisation !== null && Math.abs(u.utilisation - 1) < 1e-9, // Derived
    cost: u.cost,
  }));
  const products = p.productMakes.map((m, i) => {
    const pr = input.products[i];
    return {
      id: m.id,
      name: m.name,
      volume: m.volume,
      revenue: m.revenue,
      price: Number(pr.price),
      floor: finiteLimit(pr.minDemand) ? Number(pr.minDemand) : 0,
      ceiling: finiteLimit(pr.maxDemand) ? Number(pr.maxDemand) : null,
      atCeiling: finiteLimit(pr.maxDemand) && near(m.volume, Number(pr.maxDemand)), // Derived
    };
  });
  const streams = p.streamBalance.map((s) => ({
    id: s.id,
    made: s.made,
    consumed: s.consumed,
    placed: s.placed,
    surplus: s.surplus,
    marginalValue: s.marginalValue,
    goesInto: input.products.filter((pr) => pr.recipe && pr.recipe[s.id]).map((pr) => ({ name: pr.name, price: Number(pr.price) })),
    feeds: input.units.filter((u) => u.feed === s.id).map((u) => u.name),
  }));
  const cdu = units.find((u) => u.crudeUnit) || null;
  return {
    status: p.status,
    crudes,
    units,
    products,
    streams,
    revenue: p.revenue,
    crudeCost: p.crudeCost,
    unitCost: p.unitCost,
    margin: p.margin,
    totalCrude: p.totalCrude,
    grossMarginPerBbl: p.grossMarginPerBbl,
    crudeUnit: cdu,
    crudeUnitAgrees: cdu ? near(cdu.throughput, p.totalCrude) : false, // Derived
    unitsAtCapacity: units.filter((u) => u.atCapacity).map((u) => u.name),
    crudesAtAvailability: crudes.filter((c) => c.atAvailability).map((c) => c.name),
  };
};

/** The diesel hydrotreater as typed, typed as 0 and left blank (digest SECTION 9). */
export const hydrotreaterThreeWays = () => [
  ['as typed', ABUA.units.find((u) => u.id === 'dht').capacity],
  ['typed as shut', 0],
  ['left blank', ''],
].map(([label, capacity]) => {
  const p = planOf(withSet([['units', 'dht', 'capacity', capacity]]));
  const dht = p.units.find((u) => u.id === 'dht');
  return {
    label,
    typed: capacity,
    throughput: dht.throughput,
    capacityReported: dht.capacityReported,
    utilisation: dht.utilisation,
    totalCrude: p.totalCrude,
    margin: p.margin,
  };
});

/** Each of ABUA's refusal cases, plus no crude and no product (digest SECTION 10). */
export const planRefusals = () => [
  ...ABUA.refusals.map((r) => ({ label: r.label, input: r.blankAllLimits ? blankAllLimits() : withSet(r.set) })),
  { label: 'no crude at all', input: { ...abuaInput(), crudes: [] } },
  { label: 'no product at all', input: { ...abuaInput(), products: [] } },
].map(({ label, input }) => {
  const p = planOf(input);
  return {
    label, status: p.status, error: p.error || null, missing: p.missing || null,
  };
});

/**
 * The crude unit with a feed stream no crude makes, so no unit is feedless
 * (digest SECTION 11): the engine writes no crude-unit row, and the unit's
 * capacity and operating cost bind nothing.
 */
export const crudeUnitGivenAFeed = (input = abuaInput()) => {
  const fed = { ...clone(input), units: input.units.map((u) => (u.feed ? { ...u } : { ...u, feed: 'crude_feed' })) };
  return planOf(fed);
};

/** ABUA under its five changes, and the stream values under each (digest SECTIONS 13 and 14). */
export const variantPlans = () => {
  const base = planOf();
  const rows = [{ id: 'as-typed', label: 'the plan as typed', plan: base }]
    .concat(ABUA.variants.map((v) => ({ id: v.id, label: v.label, plan: planOf(withSet(v.set)) })));
  return rows.map(({ id, label, plan }) => ({
    id,
    label,
    status: plan.status,
    totalCrude: plan.totalCrude,
    crudeUnitUtilisation: plan.crudeUnit ? plan.crudeUnit.utilisation : null,
    margin: plan.margin,
    grossMarginPerBbl: plan.grossMarginPerBbl,
    marginChange: pdiff(plan.margin, base.margin, usd), // Derived, over the printed figures
    grossMarginChange: pdiff(plan.grossMarginPerBbl, base.grossMarginPerBbl, pbl), // Derived
    streamValues: Object.fromEntries(plan.streams.map((s) => [s.id, s.marginalValue])),
  }));
};

/** The plan with the reformer capacity set to one value, everything else as given. */
export const reformerAt = (capacity, input = abuaInput()) => planOf(withSet([['units', 'reformer', 'capacity', capacity]], input));

/**
 * The reformer debottleneck sweep (digest SECTION 14). The change in margin and
 * the margin gained per extra barrel of capacity are taken over the printed
 * figures, as the digest takes them (Derived).
 */
export const reformerSweep = (capacities = ABUA.reformerSweep, input = abuaInput()) => {
  let prev = null;
  return capacities.map((cap) => {
    const p = reformerAt(cap, input);
    if (p.status !== 'optimal') {
      prev = null;
      return { capacity: cap, status: p.status, error: p.error };
    }
    const ref = p.units.find((u) => u.id === 'reformer');
    const row = {
      capacity: cap,
      status: p.status,
      utilisation: ref ? ref.utilisation : null,
      margin: p.margin,
      marginChange: prev ? pdiff(p.margin, prev.margin, usd) : null,
      capacityChange: prev ? bbl(cap - prev.capacity) : null,
      perExtraBarrel: prev ? pbl(Number(pdiff(p.margin, prev.margin, usd)) / (cap - prev.capacity)) : null,
    };
    prev = { capacity: cap, margin: p.margin };
    return row;
  });
};

/** The cargo sizes the schedule explorer offers, in barrels. */
export const CARGO_SIZES = [150000, 200000, 250000, 300000, 350000, 400000, 500000, 600000];

const scheduleRows = (sch) => sch.events.map((e) => ({
  id: e.id,
  date: e.date,
  type: e.type,
  materialId: e.materialId,
  quantity: e.quantity,
  value: e.cost,
  part: `${e.meta.cargo ?? e.meta.week} of ${e.meta.of}`,
}));

/** Events summed by material and type, in the order the schedule first meets them. Derived. */
const ledgerOf = (events) => {
  const agg = new Map();
  events.forEach((e) => {
    const k = `${e.materialId}|${e.type}`;
    const r = agg.get(k) || {
      materialId: e.materialId, type: e.type, events: 0, quantity: 0, value: 0,
    };
    r.events += 1;
    r.quantity += e.quantity;
    r.value += e.cost;
    agg.set(k, r);
  });
  return [...agg.values()];
};

/**
 * The plan cascaded into a dated schedule from PERIOD_START, the string, over
 * PERIOD_DAYS (digest SECTION 15). The calendar lays the engine's dates on the
 * days of the period; the period is March 2027, day 1 is PERIOD_START and the
 * period runs its 31 days to the month end, which the lab test pins.
 */
export const scheduleOf = ({ input = abuaInput(), cargoSize = ABUA.cargoSize } = {}) => {
  let raw;
  try {
    raw = RP.planRefinery(input);
  } catch (e) {
    return { error: errorOf(e), events: [], note: null };
  }
  const sch = RP.cascadeToSchedule({
    plan: raw, periodStart: PERIOD_START, periodDays: PERIOD_DAYS, cargoSize,
  });
  const events = scheduleRows(sch);
  const monthPrefix = PERIOD_START.slice(0, 8);
  const calendar = Array.from({ length: PERIOD_DAYS }, (_, k) => {
    const date = `${monthPrefix}${String(k + 1).padStart(2, '0')}`;
    return { day: k + 1, date, events: events.filter((e) => e.date === date) };
  });
  const crudeRuns = raw.status === 'optimal' ? raw.crudeRuns.filter((c) => c.volume > 0) : [];
  return {
    status: raw.status,
    error: raw.status === 'optimal' ? null : raw.error,
    periodStart: PERIOD_START,
    periodDays: PERIOD_DAYS,
    cargoSize,
    note: sch.note,
    events,
    counts: {
      all: events.length,
      receipts: events.filter((e) => e.type === 'receipt').length,
      unitRuns: events.filter((e) => e.type === 'unit_run').length,
      lifts: events.filter((e) => e.type === 'delivery').length,
    },
    calendar,
    outsideCalendar: events.filter((e) => !e.date.startsWith(monthPrefix)).map((e) => e.id),
    ledger: ledgerOf(sch.events),
    cargoes: crudeRuns.map((c) => {
      const receipts = events.filter((e) => e.type === 'receipt' && e.materialId === c.id);
      return {
        id: c.id, name: c.name, crudeRun: c.volume, runOverCargo: c.volume / cargoSize, cargoes: receipts.length, dates: receipts.map((e) => e.date),
      };
    }),
  };
};

/** The zones the schedule explorer offers, the seven the digest prints. */
export const ZONES = ['UTC', 'Africa/Lagos', 'Pacific/Kiritimati', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Pacific/Pago_Pago'];

/**
 * The instant a clock in timeZone reads as midnight at the start of a
 * YYYY-MM-DD day: what new Date(2027, 2, 1) builds in a process running in that
 * zone. Read from Intl with the zone named, so it is the same in every process.
 */
export const localMidnightIn = (ymd, timeZone) => {
  const [y, m, d] = ymd.split('-').map(Number);
  const target = Date.UTC(y, m - 1, d);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const wallOf = (t) => {
    const parts = fmt.formatToParts(new Date(t));
    const g = (k) => Number(parts.find((x) => x.type === k).value);
    return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second'));
  };
  let t = target - (wallOf(target) - target);
  t = target - (wallOf(t) - t);
  return t;
};

/**
 * THE ZONE DEMONSTRATION (digest SECTION 16). The schedule dated from the
 * PERIOD_START string, and the same schedule dated from a Date built at local
 * midnight in each zone. The engine reads a Date's UTC calendar day, so east of
 * Greenwich that Date is the previous day. This is the ONE call in the lab that
 * hands the engine a Date, built on purpose to show what the string prevents.
 */
export const zoneSchedules = () => {
  const plan = RP.planRefinery(abuaInput());
  const dates = (periodStart) => RP.cascadeToSchedule({
    plan, periodStart, periodDays: PERIOD_DAYS, cargoSize: ABUA.cargoSize,
  }).events.map((e) => e.date);
  const fromString = dates(PERIOD_START);
  const sorted = (d) => [...d].sort();
  return ZONES.map((zone) => {
    const localMidnight = dates(new Date(localMidnightIn(PERIOD_START, zone)));
    return {
      zone,
      fromString: {
        first: fromString[0], last: sorted(fromString).at(-1), matchesUtc: true, dates: fromString,
      },
      fromLocalMidnight: {
        first: localMidnight[0],
        last: sorted(localMidnight).at(-1),
        matchesUtc: JSON.stringify(localMidnight) === JSON.stringify(fromString), // Derived
        dates: localMidnight,
      },
    };
  });
};

/* ================================================================== *
 * EXPERT. The ODIOMA month, its actuals and variance, and the expansion.
 * ================================================================== */

/** ODIOMA's plan and the plan ledger its schedule makes (digest SECTION 19). */
export const odiomaPlan = () => {
  const raw = RP.planRefinery(planInputOf(ODIOMA));
  const sch = RP.cascadeToSchedule({
    plan: raw, periodStart: PERIOD_START, periodDays: PERIOD_DAYS, cargoSize: ODIOMA.cargoSize,
  });
  return {
    raw, sch, plan: planOf(planInputOf(ODIOMA)), ledger: ledgerOf(sch.events),
  };
};

/** ODIOMA's actuals as recorded, for a panel to edit. */
export const odiomaActuals = () => ODIOMA.actuals.map((a) => ({ ...a }));

/**
 * The month's variance (digest SECTIONS 20 and 21). Each actual is recorded
 * through makeEvent: a value box left blank is recorded as no value (null), and
 * a quantity the engine will not take comes back as the engine's sentence.
 */
export const varianceOf = (actuals = ODIOMA.actuals) => {
  const { raw, sch, plan } = odiomaPlan();
  const actualEvents = [];
  for (let i = 0; i < actuals.length; i += 1) {
    const a = actuals[i];
    try {
      actualEvents.push(SM.makeEvent({
        id: `actual-${i + 1}`,
        ledger: 'actual',
        type: a.type,
        materialId: a.materialId,
        quantity: a.quantity,
        cost: absent(a.cost) ? null : a.cost,
      }));
    } catch (e) {
      return { error: errorOf(e), row: i, materialId: a.materialId, type: a.type };
    }
  }
  const rec = RP.reconcilePeriod({ planEvents: sch.events, actualEvents, plan: raw });
  const lines = rec.lines.map((l) => ({
    ...l,
    planUnitValue: l.planQuantity > 0 ? l.planCost / l.planQuantity : 0, // Derived
    actualUnitValue: l.actualQuantity > 0 ? l.actualCost / l.actualQuantity : 0, // Derived
    quantityGap: l.actualQuantity - l.planQuantity, // Derived
  }));
  const unmatchedOnMargin = rec.unmatched.reduce((s, u) => s + (u.type === 'delivery' ? u.cost : -u.cost), 0); // Derived
  const planTotals = SM.dualLedgerTotals(sch.events, 'plan');
  const actualTotals = SM.dualLedgerTotals(actualEvents, 'actual');
  const pick = (d) => ({
    ledger: d.ledger, events: d.events, cost: d.cost, revenue: d.revenue, margin: d.margin, uncostedEvents: d.uncostedEvents,
  });
  return {
    lines,
    unmatched: rec.unmatched.map((u) => ({ ...u })),
    total: {
      volumeVariance: rec.total.volumeVariance,
      priceVariance: rec.total.priceVariance,
      unexplained: rec.total.unexplained,
      totalVariance: rec.total.totalVariance,
      basis: rec.total.basis,
    },
    cost: { ...rec.total.cost },
    revenue: { ...rec.total.revenue },
    recordedSum: rec.lines.reduce((s, l) => s + l.totalVariance, 0), // Derived
    unitPerformance: rec.unitPerformance.map((u) => ({ ...u })),
    planMargin: rec.planMargin,
    actualMargin: rec.actualMargin,
    marginVariance: rec.marginVariance,
    planGrossMarginPerBbl: rec.planGrossMarginPerBbl,
    planOwnMargin: plan.margin,
    marginGap: rec.marginVariance - rec.total.totalVariance, // Derived
    unmatchedOnMargin,
    ledgers: [pick(planTotals), pick(actualTotals)],
    ledgerMarginsAgree: usd(planTotals.margin) === usd(rec.planMargin) && usd(actualTotals.margin) === usd(rec.actualMargin), // Derived
  };
};

const expansionStreams = () => {
  const X = ODIOMA.expansion;
  const scenario = scenarioOf(X.scenarioId);
  const slate = slateOf({ configurationId: X.configurationId, prices: X.prices });
  const cap = MR.scaleCapex({
    baseCost: X.baseCost, baseCapacity: X.baseCapacity, capacity: X.capacityBpd, exponent: X.modularExponent,
  });
  const st = MR.feasibilityStreams({
    capacityBpd: X.capacityBpd,
    onstreamDays: X.onstreamDays,
    utilisation: scenario.utilisation,
    crudeCostPerBbl: X.crudeCostPerBbl + scenario.crudePremium,
    slate,
    fixedOpexPerYear: X.fixedOpexPerYear,
    variableOpexPerBbl: X.variableOpexPerBbl,
    projectLife: X.projectLife,
    constructionYears: X.constructionYears,
    capex: cap.cost,
  });
  return { X, slate, st };
};

/** The two start years the course uses: the one every valuation passes, and the one check. */
export const START_YEARS = [START_YEAR, START_YEAR_CHECK];

/**
 * The expansion's cash flow through the screening engine (digest SECTIONS 22
 * and 23). feasibilityEconomics values it with the loss carried forward; with
 * the switch off, calculateEconomics values the same inputs with the option
 * off. The NPV comes back as one reading; the IRR is never handed on.
 */
export const expansionOf = ({ lossCarryForward = true, startYear = START_YEAR } = {}) => {
  if (!START_YEARS.includes(startYear)) throw new TypeError(`The course values the expansion from ${START_YEARS.join(' or ')}.`);
  const { X, slate, st } = expansionStreams();
  const on = MR.feasibilityEconomics({
    streams: st, discountRate: X.discountRate, taxRate: X.taxRate, startYear,
  });
  if (on.error) return { error: on.error };
  const off = SC.calculateEconomics({ ...on.inputs, lossCarryForward: false, startYear }, { skipIrr: true });
  const read = (e) => e.cashflow.map((c, k) => ({
    index: k,
    year: c.year,
    grossRevenue: c.grossRevenue,
    royalty: c.royalty,
    opex: c.opex,
    capex: c.capex,
    depreciation: c.depreciation,
    taxableBeforeRelief: c.grossRevenue - c.royalty - c.opex - c.abex - c.depreciation, // Derived
    tax: c.tax,
    lossCarriedForward: c.taxLossCarriedForward,
    ncf: c.ncf,
  }));
  const chosen = lossCarryForward ? on : off;
  const rows = read(chosen);
  const offRows = read(off);
  const first = rows.findIndex((r) => r.tax > 0); // Derived
  const i = on.inputs;
  return {
    lossCarryForward,
    startYear,
    capital: st.capex,
    grossValuePerBbl: slate.grossValuePerBbl,
    annualBbl: st.annualBbl,
    grossMarginPerBbl: st.grossMarginPerBbl,
    inputs: {
      fiscalType: i.fiscalType,
      royaltyRate: i.royaltyRate,
      taxRate: i.taxRate,
      discountRate: i.discountRate,
      lossCarryForward: chosen === on ? i.lossCarryForward : false,
      projectLife: i.projectLife,
      startYear: i.startYear,
      firstProduction: i.production.oil[X.constructionYears],
      firstPrice: i.price.oil[X.constructionYears],
      firstOpexFixed: i.opexFixed[X.constructionYears],
      firstOpexVariable: i.opexVariable[X.constructionYears],
      year0Capex: i.capex[0],
    },
    rows,
    taxOptionOff: offRows.map((r) => r.tax),
    firstTaxYear: first,
    firstTax: first >= 0 ? rows[first].tax : null,
    totalTax: chosen.metrics.totalTax,
    totalTaxOn: on.metrics.totalTax,
    totalTaxOff: off.metrics.totalTax,
    totalTaxDifference: pdiff(off.metrics.totalTax, on.metrics.totalTax, mmd), // Derived
    npvReading: chosen.metrics.npv,
  };
};

/* ================================================================== *
 * The whole surface at the digest's own settings, for the tests.
 * ================================================================== */

export const teachingSurface = () => ({
  counts: moduleCounts(),
  scale: scaleAt(),
  slates: slates(),
  slateNaphthaBlank: slateOf({ configurationId: 'topping', prices: OKORDIA.pricesNaphthaBlank }),
  slateYieldsTyped: slateOf({ configurationId: 'hydroskimming', yields: OKORDIA.yieldsTyped }),
  screen: screenOf(),
  scenarios: scenarioTable(),
  screenTable: screenTable(),
  refusals: screenRefusals(),
  termDefaults: scheduleTermDefaults(),
  licensing: [[], ['lte'], ['ltc'], ['lte', 'ltc'], ['lte', 'ltc', 'lto']].map(licensingOf),
  plan: planOf(),
  hydrotreater: hydrotreaterThreeWays(),
  planRefusals: planRefusals(),
  fed: crudeUnitGivenAFeed(),
  variants: variantPlans(),
  sweep: reformerSweep(),
  schedule: scheduleOf(),
  scheduleSmallCargo: scheduleOf({ cargoSize: 150000 }),
  zones: zoneSchedules(),
  odioma: { plan: odiomaPlan().plan, ledger: odiomaPlan().ledger },
  variance: varianceOf(),
  expansion: expansionOf(),
  expansionOff: expansionOf({ lossCarryForward: false }),
  expansionCheckYear: expansionOf({ startYear: START_YEAR_CHECK }),
});
