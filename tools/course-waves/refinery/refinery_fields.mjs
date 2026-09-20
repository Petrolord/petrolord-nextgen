// THE REFINERY TEACHING CASES. Every record the digest is built on, in one
// place, so a sweep, a claim gate and a lesson all read the same case.
//
// THREE TEACHING CASES, AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs three other records, written in refinery_fields_capstone.mjs, and
// nothing in this file or in refinery_dump.mjs imports, reads, names or
// reproduces any of it. gate_capstone_leak.py sweeps both directions on every
// rebuild.
//
//   OKORDIA   a modular refinery studied for a site in Bayelsa by an invented
//             sponsor, Okordia Energy Refining Ltd: the scaling laws, the three
//             configurations, the product slate, the annual streams, the supply
//             scenarios and the licensing sequence (Modular Refinery
//             Feasibility Studio). The Associate tier's case.
//   ABUA      one month's plan at the Abua refinery of an invented operator,
//             Abua Coastal Refining Ltd: three crudes, a crude unit, a reformer
//             and a diesel hydrotreater, six products, and the schedule the plan
//             cascades into (Refinery Planning Studio). The Professional tier's
//             case.
//   ODIOMA    the Odioma refinery of an invented operator, Odioma Petroleum
//             Refining Ltd: a month's plan, the actuals recorded against it and
//             the variance (Refinery Planning Studio, Actuals), and the
//             feasibility of a conversion expansion valued through the screening
//             economics engine (Modular Refinery Feasibility Studio). The Expert
//             tier's case.
//
// Every record is INVENTED. Crude grade names (Bonny Light, Forcados, Brass
// River, Escravos) appear ONLY as labels on invented yields and prices; the
// digest says so in its header. Product prices are illustrative West African
// cargo prices in US dollars a barrel, set for teaching, and quote no market.
//
// THE PERIOD. cascadeToSchedule dates a plan from a period start, and reads the
// machine clock when none is given. Every schedule call passes PERIOD_START,
// a YYYY-MM-DD string, which the engine reads as a UTC calendar day. The period
// is March 2027, which crosses the North American spring clock change
// (14 March 2027): the change where a schedule dated by local calendar arithmetic
// and printed in UTC would slip a day west of Greenwich.
//
// THE START YEAR. feasibilityEconomics labels the cash flow from a start year and
// reads the machine clock's year when none is given. Every call passes
// START_YEAR. The year labels no figure: the NPV, the tax and every stream are the
// same for any start year, and the digest prints that check.

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
