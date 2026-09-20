// THE REFINERY CAPSTONE CONDITIONS. Three records, one a tier, none of them a
// teaching case:
//
//   IKARAMA   a conversion modular refinery screened for a site near Ikarama by
//             an invented sponsor, Ikarama Petroleum Refinery Ltd, on a vendor
//             quotation for a larger plant, under tight crude supply
//             (Associate).
//   AMASSOMA  one month's plan at the Amassoma refinery of an invented operator,
//             Amassoma River Refining Ltd: three crudes (one cargo cancelled and
//             typed as 0), a crude unit, a reformer and a diesel hydrotreater,
//             six products (Professional).
//   KOLOAMA   the Koloama refinery of an invented operator, Koloama Energy
//             Refining Ltd: a month's plan and the actuals recorded against it,
//             and the tax a hydroskimming expansion pays once its construction
//             losses are carried forward (Expert).
//
// Nothing here is imported by refinery_dump.mjs, and nothing in
// refinery_fields.mjs is imported here. gate_capstone_leak.py sweeps both
// directions on every rebuild. Crude grade names are labels on invented yields
// and prices, and none is a label the teaching cases use.
//
// EVERY GRADED FIELD IS A NUMBER THE ENGINE RETURNS, rounded to the places the
// digest declares for its class and graded at half a unit in that place. No
// graded field is an NPV or an IRR: the Economics courses grade those. The tax
// fields are the screening engine's own per-year tax, read through
// feasibilityEconomics with the refinery's loss carry-forward switched on.

export const PERIOD_START = '2027-03-01';
export const PERIOD_DAYS = 31;
export const START_YEAR = 2027;

/* ------------------------------------------------------------------ *
 * IKARAMA (Associate): the modular screen.
 * ------------------------------------------------------------------ */
export const IKARAMA = {
  sponsor: 'Ikarama Petroleum Refinery Ltd',
  configurationId: 'conversion',
  // The vendor quoted one plant of 12000 bpd at 150 million dollars.
  baseCost: 150e6,
  baseCapacity: 12000,
  capacityBpd: 8000,
  onstreamDays: 335,
  scenarioId: 'tight',
  crudeCostPerBbl: 71,
  fixedOpexPerYear: 9.4e6,
  variableOpexPerBbl: 4.1,
  projectLife: 20,
  constructionYears: 2,
  prices: { lpg: 51.5, gasoline: 106.4, kerosene: 98.7, diesel: 102.9, fuelOil: 56.2 },
};

/* ------------------------------------------------------------------ *
 * AMASSOMA (Professional): one month's plan.
 * ------------------------------------------------------------------ */
export const AMASSOMA = {
  operator: 'Amassoma River Refining Ltd',
  streams: ['naphtha', 'reformate', 'kero', 'gasoil', 'ulsd', 'residue', 'offgas'],
  crudes: [
    { id: 'amenam', name: 'Amenam Blend (illustrative)', cost: 79.4, available: 1600000,
      yields: { naphtha: 0.24, kero: 0.16, gasoil: 0.3, residue: 0.27, offgas: 0.03 } },
    { id: 'okono', name: 'Okono (illustrative)', cost: 76.1, available: 1200000,
      yields: { naphtha: 0.17, kero: 0.14, gasoil: 0.33, residue: 0.34, offgas: 0.02 } },
    // The Qua Iboe cargo was cancelled; the planner typed its availability as 0.
    { id: 'qua_iboe', name: 'Qua Iboe (illustrative)', cost: 75.2, available: 0,
      yields: { naphtha: 0.25, kero: 0.15, gasoil: 0.31, residue: 0.26, offgas: 0.03 } },
  ],
  units: [
    { id: 'cdu', name: 'Crude distillation', capacity: 2300000, opex: 1.35, feed: '', yields: {} },
    { id: 'reformer', name: 'Naphtha reformer', capacity: 380000, opex: 2.85, feed: 'naphtha', yields: { reformate: 0.86, offgas: 0.09 } },
    { id: 'dht', name: 'Diesel hydrotreater', capacity: 600000, opex: 1.9, feed: 'gasoil', yields: { ulsd: 0.97, offgas: 0.02 } },
  ],
  products: [
    { id: 'gasoline', name: 'Gasoline', price: 109.5, minDemand: 0, maxDemand: 400000, recipe: { reformate: 1 } },
    { id: 'naphtha_export', name: 'Naphtha export', price: 71.8, minDemand: 0, maxDemand: 250000, recipe: { naphtha: 1 } },
    { id: 'jet', name: 'Jet A-1', price: 104.2, minDemand: 0, maxDemand: 350000, recipe: { kero: 1 } },
    { id: 'diesel', name: 'Diesel (ULSD)', price: 103.6, minDemand: 0, maxDemand: 700000, recipe: { ulsd: 1 } },
    { id: 'gasoil_export', name: 'Gasoil export', price: 88, minDemand: 0, maxDemand: 300000, recipe: { gasoil: 1 } },
    { id: 'fuel_oil', name: 'Fuel oil', price: 58.3, minDemand: 0, maxDemand: 900000, recipe: { residue: 1 } },
  ],
};

/* ------------------------------------------------------------------ *
 * KOLOAMA (Expert): the month's plan, its actuals, and the expansion tax.
 * ------------------------------------------------------------------ */
export const KOLOAMA = {
  operator: 'Koloama Energy Refining Ltd',
  streams: ['naphtha', 'reformate', 'kero', 'gasoil', 'residue', 'offgas'],
  crudes: [
    { id: 'usan', name: 'Usan (illustrative)', cost: 77.7, available: 900000,
      yields: { naphtha: 0.2, kero: 0.14, gasoil: 0.32, residue: 0.31, offgas: 0.03 } },
    { id: 'yoho', name: 'Yoho (illustrative)', cost: 80.6, available: 500000,
      yields: { naphtha: 0.27, kero: 0.16, gasoil: 0.3, residue: 0.24, offgas: 0.03 } },
  ],
  units: [
    { id: 'cdu', name: 'Crude distillation', capacity: 1350000, opex: 1.3, feed: '', yields: {} },
    { id: 'reformer', name: 'Naphtha reformer', capacity: 240000, opex: 2.95, feed: 'naphtha', yields: { reformate: 0.87, offgas: 0.08 } },
  ],
  products: [
    { id: 'gasoline', name: 'Gasoline', price: 109.8, minDemand: 0, maxDemand: 260000, recipe: { reformate: 1 } },
    { id: 'jet', name: 'Jet A-1', price: 103.7, minDemand: 0, maxDemand: 200000, recipe: { kero: 1 } },
    { id: 'diesel', name: 'Diesel', price: 101.3, minDemand: 0, maxDemand: 450000, recipe: { gasoil: 1 } },
    { id: 'fuel_oil', name: 'Fuel oil', price: 59.4, minDemand: 0, maxDemand: 600000, recipe: { residue: 1 } },
  ],
  cargoSize: 450000,
  // What the month did, one aggregated movement a material and type, in
  // barrels and US dollars. A delivery's cost is what it sold for.
  actuals: [
    { materialId: 'usan', type: 'receipt', quantity: 935000, cost: 73304000 },
    { materialId: 'yoho', type: 'receipt', quantity: 205000, cost: 16676750 },
    { materialId: 'cdu', type: 'unit_run', quantity: 1140000, cost: 1527600 },
    { materialId: 'reformer', type: 'unit_run', quantity: 226500, cost: 684030 },
    { materialId: 'gasoline', type: 'delivery', quantity: 197100, cost: 21799260 },
    { materialId: 'jet', type: 'delivery', quantity: 158900, cost: 16358755 },
    { materialId: 'diesel', type: 'delivery', quantity: 361200, cost: 36788220 },
    { materialId: 'fuel_oil', type: 'delivery', quantity: 338400, cost: 19847160 },
    // A spot sale nobody planned: liquefied gas recovered from the off-gas.
    { materialId: 'lpg', type: 'delivery', quantity: 7500, cost: 361500 },
  ],
  // The expansion: a second hydroskimming train, valued through the screening
  // engine with its construction losses carried forward.
  expansion: {
    configurationId: 'hydroskimming',
    capacityBpd: 7500,
    onstreamDays: 338,
    scenarioId: 'firm',
    crudeCostPerBbl: 72.5,
    baseCost: 95e6,
    baseCapacity: 10000,
    modularExponent: 0.9,
    fixedOpexPerYear: 8.8e6,
    variableOpexPerBbl: 3.4,
    projectLife: 15,
    constructionYears: 2,
    discountRate: 10,
    taxRate: 30,
    prices: { lpg: 50.8, gasoline: 107.1, naphtha: 74.6, kerosene: 99.3, diesel: 103.4, fuelOil: 57.6 },
  },
};

/* ------------------------------------------------------------------ *
 * Where each graded field comes from, and the class it is graded in.
 * ------------------------------------------------------------------ */
export const FIELD_SOURCES = {
  ikarama_modular_capex_usd: 'IKARAMA: modularRefinery.scaleCapex({baseCost, baseCapacity, capacity, exponent: SCALING_EXPONENT.MODULAR}).cost',
  ikarama_stick_built_capex_usd: 'IKARAMA: modularRefinery.scaleCapex({..., exponent: SCALING_EXPONENT.STICK_BUILT}).cost',
  ikarama_gross_value_per_bbl: 'IKARAMA: modularRefinery.productSlate({productYields: CONFIGURATIONS.conversion.productYields, prices}).grossValuePerBbl',
  ikarama_annual_throughput_bbl: 'IKARAMA under tight supply: modularRefinery.feasibilityStreams(...).annualBbl',
  ikarama_gross_margin_per_bbl: 'IKARAMA under tight supply: modularRefinery.feasibilityStreams(...).grossMarginPerBbl',
  ikarama_first_year_revenue_usd: 'IKARAMA under tight supply: feasibilityStreams(...).years[constructionYears].revenue',
  amassoma_crude_run_bbl: 'AMASSOMA: refineryPlanning.planRefinery(...).totalCrude',
  amassoma_cdu_utilisation_pct: 'AMASSOMA: planRefinery(...).unitRuns[crude unit].utilisation x 100',
  amassoma_plan_margin_usd: 'AMASSOMA: planRefinery(...).margin',
  amassoma_gross_margin_per_bbl: 'AMASSOMA: planRefinery(...).grossMarginPerBbl',
  amassoma_naphtha_value_per_bbl: 'AMASSOMA: planRefinery(...).streamBalance[naphtha].marginalValue',
  amassoma_gasoil_value_per_bbl: 'AMASSOMA: planRefinery(...).streamBalance[gasoil].marginalValue',
  koloama_usan_price_variance_usd: 'KOLOAMA: reconcilePeriod({planEvents: cascadeToSchedule(plan).events, actualEvents}).lines[usan receipt].priceVariance',
  koloama_diesel_volume_variance_usd: 'KOLOAMA: reconcilePeriod(...).lines[diesel delivery].volumeVariance',
  koloama_margin_variance_usd: 'KOLOAMA: reconcilePeriod(...).total.totalVariance (the margin basis)',
  koloama_cost_variance_usd: 'KOLOAMA: reconcilePeriod(...).total.cost.totalVariance',
  koloama_first_tax_mm: 'KOLOAMA expansion: feasibilityEconomics(...).cashflow[first year with tax > 0].tax, millions of US dollars',
  koloama_lifetime_tax_mm: 'KOLOAMA expansion: the sum of feasibilityEconomics(...).cashflow[].tax, millions of US dollars',
};

/* The grading classes. `decimals` is what the digest prints for the class;
 * `tol` is the absolute tolerance the grader applies, half a unit in the place
 * the capstone asks the answer to (never tighter than half a unit of what the
 * digest prints). */
export const CLASSES = {
  usd: { decimals: 2, tol: 0.5, suffix: /_usd$/, words: 'US dollars, to the whole dollar' },
  bbl: { decimals: 2, tol: 0.5, suffix: /_bbl$/, words: 'barrels, to the whole barrel' },
  per_bbl: { decimals: 4, tol: 0.005, suffix: /_per_bbl$/, words: 'US dollars a barrel, to the cent' },
  pct: { decimals: 2, tol: 0.005, suffix: /_pct$/, words: 'percent, to two decimals' },
  mm: { decimals: 4, tol: 0.00005, suffix: /_mm$/, words: 'millions of US dollars, to four decimals' },
};
