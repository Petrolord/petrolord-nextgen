// THE CARBON TEACHING CASES. Three invented records, one a tier, and the
// three GWP sets the course prints. Nothing here is a capstone record, and
// nothing here is a published figure except the GWP values, which are
// labelled with the report, the horizon and the document they were read from.
//
//   IGBOGENE  the Igbogene flow station and gas plant in Bayelsa State of an
//             invented operator, Epie Creek Energy Ltd: its fired heaters,
//             its flare, its vented and fugitive methane and the power it
//             buys, rolled into one inventory (Associate).
//   ISIOKPO   the Isiokpo gas plant in Rivers State of an invented operator,
//             Ikwerre Midstream Services Ltd: one fired heater and its fuel
//             gas, a failed steam trap, the condensate system and five
//             process streams for a pinch study (Professional).
//   AGBOR     the Agbor gas processing and distribution complex in Delta
//             State of an invented operator, Ika Energy Holdings Ltd: six
//             abatement measures, a marginal abatement cost curve, a target
//             and a path, one saving priced in money and carbon, and the
//             plant's energy intensity (Expert).
//
// EVERY RATE, COST, FACTOR, TEMPERATURE AND FLOW HERE IS INVENTED for the
// course. The engines ship no emission factor and no GWP by design; the
// electricity and fuel emission factors below are SYNTHETIC.
//
// Usage: imported by carbon_dump.mjs only.

/* ------------------------------------------------------------------ *
 * THE GWP SETS. The engine ships none (makeGwpSet takes them as inputs).
 * Values as the GHG Protocol tabulates them, 100-year horizon.
 * ------------------------------------------------------------------ */
export const GWP_SOURCE = 'GHG Protocol, "IPCC Global Warming Potential Values", version 2.0, 7 August 2024, adapted from IPCC AR6 WG1 chapter 7 (section 7.6.1.1) and IPCC AR5 WG1 chapter 8';
export const GWP_HORIZON = '100-year (GWP100)';
export const GWP_SETS = {
  ar6Fossil: { label: 'IPCC AR6 GWP100, fossil methane', report: 'AR6', values: { CH4: 29.8, N2O: 273 } },
  ar6NonFossil: { label: 'IPCC AR6 GWP100, non-fossil methane', report: 'AR6', values: { CH4: 27.0, N2O: 273 } },
  ar5Fossil: { label: 'IPCC AR5 GWP100, fossil methane', report: 'AR5', values: { CH4: 30, N2O: 265 } },
  ar5NonFossil: { label: 'IPCC AR5 GWP100, non-fossil methane', report: 'AR5', values: { CH4: 28, N2O: 265 } },
};
/** The set the course computes its inventories on, and why (FINDINGS-carbon C10). */
export const COURSE_SET = 'ar6Fossil';

/* ------------------------------------------------------------------ *
 * IGBOGENE (Associate)
 * ------------------------------------------------------------------ */
export const IGBOGENE_HEATERS = { fuelKmolPerYear: 482000, carbonPerKmolFuel: 1.09, destructionEfficiencyFraction: 1 };
export const IGBOGENE_FLARE = { fuelKmolPerYear: 38500, carbonPerKmolFuel: 1.32 };
/** The flare's destruction efficiency, as the operator's flare study states it (invented). */
export const IGBOGENE_FLARE_DE = 0.98;
export const IGBOGENE_FLARE_SWEEP = [1, 0.99, 0.98, 0.95, 0.9];
export const IGBOGENE_VENT = {
  label: 'Vented and fugitive methane', scope: 1, activity: 142, activityUnit: 't CH4',
  factor: { label: 'Measured methane mass', value: 1, unit: 'tCH4/t', gas: 'CH4', source: 'Epie Creek leak detection survey (invented)', version: '2026 Q2', vintage: '2026' },
};
export const IGBOGENE_POWER = {
  label: 'Purchased electricity', scope: 2, activity: 31500, activityUnit: 'MWh',
  factor: { label: 'Grid electricity factor (SYNTHETIC)', value: 0.41, unit: 'tCO2/MWh', gas: 'CO2', source: 'Supplier statement (invented)', version: '2025', vintage: '2025' },
};
export const IGBOGENE_INTENSITY = { denominatorValue: 3650000, denominatorUnit: 'barrel of oil equivalent produced', boundaryLabel: 'Igbogene flow station and gas plant, inlet to export' };
/** The same plant measured against a second boundary (the oil it exports alone). */
export const IGBOGENE_INTENSITY_ALT = { denominatorValue: 2410000, denominatorUnit: 'barrel of oil exported', boundaryLabel: 'Igbogene crude export only' };

/* ------------------------------------------------------------------ *
 * ISIOKPO (Professional)
 * ------------------------------------------------------------------ */
/** The fuel gas analysis, mole fractions (invented). Heating values: the engine's typical reference. */
export const ISIOKPO_FUEL = [['CH4', 0.868], ['C2H6', 0.071], ['C3H8', 0.021], ['CO2', 0.025], ['N2', 0.015]];
export const ISIOKPO_HEATER = {
  stackTempC: 238, combustionAirTempC: 28, currentO2Percent: 5.5, targetO2Percent: 2.8,
  minimumSafeO2Percent: 2.0, radiationLossPercent: 1.8, unburnedLossPercent: 0,
  annualFuelEnergyGJ: 410000,
};
export const ISIOKPO_O2_SWEEP = [0, 1, 2, 2.8, 4, 5.5, 8, 12];
export const ISIOKPO_TRAP = {
  orificeDiameterMm: 4, upstreamPressureBarA: 9.0, dischargeCoefficient: 0.72, steamDensityKgM3: 4.65,
  specificHeatRatio: 1.135, hoursPerYear: 8400, steamCostPerTonne: 22, steamEnergyMJPerTonne: 2650,
  boilerEfficiencyFraction: 0.83, emissionFactorKgCo2ePerGJ: 56.1,
};
export const ISIOKPO_CONDENSATE = {
  steamTonnesPerHour: 16, currentReturnFraction: 0.35, targetReturnFraction: 0.65, condensateTempC: 92,
  makeupTempC: 27, boilerEfficiencyFraction: 0.83, fuelCostPerGJ: 7.5, waterCostPerTonne: 0.55,
  treatmentCostPerTonne: 1.35, emissionFactorKgCo2ePerGJ: 56.1, hoursPerYear: 8400,
};
export const ISIOKPO_STREAMS = [
  { label: 'H1 compressor aftercooler', supplyC: 163, targetC: 48, cpKWperK: 3.15 },
  { label: 'H2 lean oil cooler', supplyC: 118, targetC: 41, cpKWperK: 5.7 },
  { label: 'C1 rich oil preheat', supplyC: 32, targetC: 141, cpKWperK: 4.35 },
  { label: 'C2 stabiliser feed', supplyC: 57, targetC: 104, cpKWperK: 2.4 },
];
export const ISIOKPO_DTMIN = [10, 15, 20];
export const ISIOKPO_DTMIN_CASE = 15;

/* ------------------------------------------------------------------ *
 * AGBOR (Expert)
 * ------------------------------------------------------------------ */
export const AGBOR_DISCOUNT_RATE = 0.1;
/** Money in US dollars, every figure invented. actsOn names the source a measure reduces. */
export const AGBOR_MEASURES = [
  { label: 'Tune the fired heaters', capitalCost: 18000, annualSavings: 132000, annualCost: 0, tonnesAbatedPerYear: 760, lifeYears: 5, actsOn: ['heaters'], startYear: 2027 },
  { label: 'Repair failed steam traps', capitalCost: 45000, annualSavings: 198000, annualCost: 0, tonnesAbatedPerYear: 1150, lifeYears: 3, actsOn: ['steam'], startYear: 2027 },
  { label: 'Heat integration project', capitalCost: 2750000, annualSavings: 410000, annualCost: 0, tonnesAbatedPerYear: 3400, lifeYears: 15, actsOn: ['heaters'], startYear: 2029 },
  { label: 'Flare gas recovery', capitalCost: 4900000, annualSavings: 265000, annualCost: 105000, tonnesAbatedPerYear: 6200, lifeYears: 15, actsOn: ['flare'], startYear: 2030 },
  { label: 'Solar for purchased power', capitalCost: 1850000, annualSavings: 142000, annualCost: 21000, tonnesAbatedPerYear: 2100, lifeYears: 20, actsOn: ['power'], startYear: 2028 },
  { label: 'Vapour recovery on the storage tanks', capitalCost: 610000, annualSavings: 38000, annualCost: 14000, tonnesAbatedPerYear: 1850, lifeYears: 12, actsOn: ['vents'], startYear: 2031 },
];
/** The Agbor inventory the measures act on, one engine call per source. */
export const AGBOR_SOURCES = {
  heaters: { fuelKmolPerYear: 715000, carbonPerKmolFuel: 1.11, destructionEfficiencyFraction: 1 },
  flare: { fuelKmolPerYear: 104000, carbonPerKmolFuel: 1.38, destructionEfficiencyFraction: 0.98 },
};
export const AGBOR_VENT_T_CH4 = 88;
export const AGBOR_POWER = { activity: 26800, factor: 0.41 };
/** A flare recovery claim above what the flare emits, for the over-claim demonstration. */
export const AGBOR_FLARE_OVERCLAIM_T = 9400;
export const AGBOR_PLAN = { startYear: 2026, endYear: 2033, targetReductionPercentByEnd: 30 };
/** One saving priced in money and carbon (priceSaving). */
export const AGBOR_SAVING = {
  energySavedGJ: 11800, fuelCostPerGJ: 7.5, emissionFactorKgCo2ePerGJ: 56.1,
  implementationCost: 210000, lifeYears: 8, discountRate: 0.1,
};
export const AGBOR_ENERGY = {
  streams: [
    { label: 'Fuel gas', energyGJ: 740000 },
    { label: 'Purchased power', energyGJ: 96000 },
    { label: 'Imported steam', energyGJ: 41000 },
  ],
  throughputTonnes: 1240000,
  peerIntensityMJPerTonne: 680,
};
