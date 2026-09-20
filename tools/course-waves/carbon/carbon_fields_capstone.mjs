// THE CARBON CAPSTONE CONDITIONS. Three records, one a tier, none of them a
// teaching case:
//
//   OWAZA     the Owaza flow station in Abia State of an invented operator,
//             Ukwa Basin Energy Ltd: its fired heaters, its flare, its vented
//             methane and the power it buys, as one inventory (Associate).
//   IGRITA    the Igrita gas conditioning plant in Rivers State of an invented
//             operator, Aluu Gas Services Ltd: one fired heater and its fuel
//             gas, a failed steam trap read on a gauge, and four process
//             streams (Professional).
//   IKORODU   the Ikorodu gas distribution and power complex in Lagos State of
//             an invented operator, Lagoon Midstream Holdings Ltd: six
//             abatement measures, its inventory, a target and a path, and one
//             saving priced in money and carbon (Expert).
//
// Nothing here is imported by carbon_dump.mjs, and nothing in carbon_fields.mjs
// is imported here. gate_capstone_leak.py sweeps both directions on every
// rebuild.
//
// EVERY COST, FACTOR, FLOW, TEMPERATURE AND DESTRUCTION EFFICIENCY HERE IS
// INVENTED for the course and labelled so in the prompt. The one published set
// of figures is the GWP set, stated in the prompt with its report and horizon.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE, graded numerically.

/** The GWP set every capstone inventory is computed on, stated in the prompt. */
export const CAP_GWP = { label: 'IPCC AR6 GWP100, fossil methane', values: { CH4: 29.8, N2O: 273 } };
/** The wrong-route sets (the prompt names only CAP_GWP). */
export const ALT_GWP = { ar6NonFossil: { CH4: 27.0 }, ar5Fossil: { CH4: 30 }, ar5NonFossil: { CH4: 28 } };

/* ------------------------------------------------------------------ *
 * OWAZA (Associate)
 * ------------------------------------------------------------------ */
export const OWAZA_HEATERS = { fuelKmolPerYear: 356000, carbonPerKmolFuel: 1.07, destructionEfficiencyFraction: 0.995 };
export const OWAZA_FLARE = { fuelKmolPerYear: 52800, carbonPerKmolFuel: 1.46, destructionEfficiencyFraction: 0.97 };
export const OWAZA_VENT = {
  label: 'Vented and fugitive methane', scope: 1, activity: 96.5, activityUnit: 't CH4',
  factor: { label: 'Measured methane mass', value: 1, unit: 'tCH4/t', gas: 'CH4', source: 'Ukwa leak survey (invented)', version: '2026 Q1', vintage: '2026' },
};
export const OWAZA_POWER = {
  label: 'Purchased electricity', scope: 2, activity: 18400, activityUnit: 'MWh',
  factor: { label: 'Grid electricity factor (SYNTHETIC)', value: 0.387, unit: 'tCO2/MWh', gas: 'CO2', source: 'Distribution company statement (invented)', version: '2025', vintage: '2025' },
};

/* ------------------------------------------------------------------ *
 * IGRITA (Professional)
 * ------------------------------------------------------------------ */
export const IGRITA_FUEL = [['CH4', 0.912], ['C2H6', 0.041], ['C3H8', 0.012], ['CO2', 0.021], ['N2', 0.014]];
export const IGRITA_HEATER = {
  stackTempC: 251, combustionAirTempC: 31, currentO2Percent: 6.2, targetO2Percent: 3.1,
  minimumSafeO2Percent: 2.4, radiationLossPercent: 2.1, unburnedLossPercent: 0, annualFuelEnergyGJ: 365000,
};
/** The trap's upstream pressure is read on a gauge; the prompt gives the local atmosphere. */
export const IGRITA_TRAP = {
  orificeDiameterMm: 5, upstreamPressureBarG: 7.2, atmosphereBarA: 1.013, dischargeCoefficient: 0.68,
  steamDensityKgM3: 4.28, specificHeatRatio: 1.135, hoursPerYear: 8200,
};
export const IGRITA_STREAMS = [
  { label: 'H1 regeneration gas cooler', supplyC: 187, targetC: 55, cpKWperK: 2.72 },
  { label: 'H2 lean amine cooler', supplyC: 124, targetC: 46, cpKWperK: 6.3 },
  { label: 'C1 rich amine preheat', supplyC: 36, targetC: 161, cpKWperK: 4.55 },
  { label: 'C2 fuel gas heater', supplyC: 29, targetC: 88, cpKWperK: 1.85 },
];
export const IGRITA_DTMIN = 12;

/* ------------------------------------------------------------------ *
 * IKORODU (Expert)
 * ------------------------------------------------------------------ */
export const IKORODU_DISCOUNT_RATE = 0.09;
export const IKORODU_MEASURES = [
  { label: 'Tune the boilers', capitalCost: 26000, annualSavings: 118000, annualCost: 0, tonnesAbatedPerYear: 690, lifeYears: 4, actsOn: ['boilers'], startYear: 2027 },
  { label: 'Waste heat recovery on the gas turbine exhausts', capitalCost: 3450000, annualSavings: 520000, annualCost: 38000, tonnesAbatedPerYear: 4150, lifeYears: 18, actsOn: ['turbines'], startYear: 2030 },
  { label: 'Repair the steam traps', capitalCost: 52000, annualSavings: 176000, annualCost: 0, tonnesAbatedPerYear: 980, lifeYears: 3, actsOn: ['boilers'], startYear: 2027 },
  { label: 'Flare gas recovery compressor', capitalCost: 6100000, annualSavings: 410000, annualCost: 155000, tonnesAbatedPerYear: 5900, lifeYears: 15, actsOn: ['flare'], startYear: 2029 },
  { label: 'Lighting and variable speed drives', capitalCost: 390000, annualSavings: 88000, annualCost: 0, tonnesAbatedPerYear: 610, lifeYears: 10, actsOn: ['power'], startYear: 2028 },
  { label: 'Vapour recovery on the condensate tanks', capitalCost: 540000, annualSavings: 31000, annualCost: 12000, tonnesAbatedPerYear: 1400, lifeYears: 12, actsOn: ['vents'], startYear: null },
];
/** The inventory the baseline is built from. */
export const IKORODU_LINES = {
  boilersCo2T: 18650, turbinesCo2T: 23200, flareCo2T: 5270, flareCh4T: 118.4, ventCh4T: 64.2,
  powerMWh: 31200, powerFactor: 0.43,
};
export const IKORODU_PLAN = { startYear: 2026, endYear: 2034, targetReductionPercentByEnd: 35 };
export const IKORODU_SAVING = {
  label: 'Economiser on the boilers', energySavedGJ: 9650, fuelCostPerGJ: 6.8, emissionFactorKgCo2ePerGJ: 56.1,
  implementationCost: 185000, lifeYears: 7, discountRate: 0.09,
};

/** Which capstone record and engine return each graded field is. */
export const FIELD_SOURCES = {
  owaza_heater_co2_t: 'OWAZA heaters: carbonAbatement.combustionCo2FromCarbon(...).co2Tonnes',
  owaza_flare_co2_t: 'OWAZA flare: carbonAbatement.combustionCo2FromCarbon(...).co2Tonnes',
  owaza_flare_ch4_t: 'OWAZA flare: carbonAbatement.combustionCo2FromCarbon(...).ch4Tonnes',
  owaza_flare_ch4_tco2e: 'OWAZA flare methane line: carbonAbatement.emissionLine(...).tCo2e on the stated set',
  owaza_scope1_tco2e: 'OWAZA inventory: carbonAbatement.buildInventory(...).scope1Tonnes',
  owaza_total_tco2e: 'OWAZA inventory: carbonAbatement.buildInventory(...).totalTonnes',
  igrita_excess_air_pct: 'IGRITA heater at its current oxygen: energyEfficiency.excessAirFromFlueOxygen(...).excessAirPercent',
  igrita_efficiency_lhv_pct: 'IGRITA heater at its current oxygen: energyEfficiency.stackLossEfficiency(... LHV).efficiencyPercent',
  igrita_tuning_saving_gj: 'IGRITA tuning: energyEfficiency.excessAirSaving(...).annualEnergySavedGJ',
  igrita_trap_t_per_yr: 'IGRITA trap: energyEfficiency.steamTrapLoss(... bar a).tonnesPerYear',
  igrita_pinch_hot_utility_kw: 'IGRITA streams: energyEfficiency.pinchTargets(...).hotUtilityKW',
  igrita_pinch_cold_utility_kw: 'IGRITA streams: energyEfficiency.pinchTargets(...).coldUtilityKW',
  ikorodu_boiler_tuning_cost_per_t_usd: 'IKORODU Tune the boilers: carbonAbatement.abatementCost(...).costPerTonne',
  ikorodu_waste_heat_cost_per_t_usd: 'IKORODU waste heat recovery: carbonAbatement.abatementCost(...).costPerTonne',
  ikorodu_flare_recovery_net_annual_cost_usd: 'IKORODU flare gas recovery: carbonAbatement.abatementCost(...).netAnnualCost',
  ikorodu_curve_weighted_average_usd_per_t: 'IKORODU curve: carbonAbatement.abatementCurve(...).weightedAverageCostPerTonne',
  ikorodu_path_final_gap_t: 'IKORODU path: carbonAbatement.decarbonisationPath(...).finalGapTonnes',
  ikorodu_saving_cost_per_t_usd: 'IKORODU economiser: energyEfficiency.priceSaving(...).costPerTonneCo2e',
};
