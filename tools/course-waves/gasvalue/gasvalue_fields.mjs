// THE GASVALUE TEACHING CASES. Every record the digest teaches from, as plain
// data. Nothing here is a capstone record, and nothing in
// gasvalue_fields_capstone.mjs is imported here (gate_capstone_leak.py sweeps
// both directions on every rebuild).
//
//   EGBEMA  an invented flow station in Imo State flaring its associated gas:
//           the analysis, the flare under the rule, the four recovery routes,
//           the counterfactual and the credits (Associate and Professional).
//   KANO    an invented LPG storage and bottling plant in Kano: the blend, the
//           vessel, the vaporizer, the carousel and the cylinder float
//           (Expert).
//   IBAFO   an invented CNG mother station on the Lagos-Ibadan expressway at
//           Ibafo: the banks, the cascade, the compressor bridge, the
//           forecourt, the trailers to the daughter stations, and a Lagos bus
//           operator's switch from PMS to CNG (Expert).
//
// Beside them the digest runs the two live apps' own opening examples
// (SUITE_FLARE and SUITE_ROLLOUT below, copied from the Suite contexts as data).
//
// EVERY FIGURE IS INVENTED AND ILLUSTRATIVE: no analysis, flare efficiency,
// price, cost, GWP, fill limit or vehicle figure is a published figure, a
// measured value or a regulation. Place names are real places; the records are
// not. Component heating values, liquid densities and the LPG properties are
// the ENGINE'S labelled typical tables, read from the engine by the generator
// and never typed here.

/* ------------------------------------------------------------------ *
 * EGBEMA flow station (Associate and Professional)
 * ------------------------------------------------------------------ */
/** The associated gas analysis, mole fractions, as the laboratory reported it. */
export const EGBEMA_GAS = [
  ['C1', 0.742], ['C2', 0.104], ['C3', 0.062], ['IC4', 0.013],
  ['NC4', 0.021], ['C5', 0.012], ['N2', 0.018], ['CO2', 0.028],
];
/** The flared parcel and the study's flare figures. */
export const EGBEMA_PARCEL = {
  volumeMMscfd: 7.5, onstreamDays: 355,
  flareDestructionEfficiency: 0.97, flareCombustionEfficiency: 0.955,
  gwpMethane: 29.8,
};
/** The same analysis typed short: a laboratory sheet that sums to 0.985. */
export const EGBEMA_SHORT_GAS = [
  ['C1', 0.73], ['C2', 0.102], ['C3', 0.061], ['IC4', 0.013],
  ['NC4', 0.021], ['C5', 0.012], ['N2', 0.018], ['CO2', 0.028],
];
/** A lean gas beside it, from a neighbouring invented non-associated well. */
export const OGUTA_LEAN_GAS = [
  ['C1', 0.925], ['C2', 0.031], ['C3', 0.012], ['IC4', 0.002],
  ['NC4', 0.003], ['N2', 0.012], ['CO2', 0.015],
];
/** Route by route: yield, recovery, price, reference plant and costs. */
export const EGBEMA_ROUTES = {
  cng: { productUnitPerMscf: 18.5, productUnitLabel: 'kg CNG', recoveryFraction: 0.88, pricePerProductUnit: 0.55, referenceCapitalCost: 24000000, referenceCapacityMMscfd: 6, fixedOpexPerYear: 1900000, variableOpexPerMscf: 0.35 },
  mini_lng: { productUnitPerMscf: 0.0175, productUnitLabel: 't LNG', recoveryFraction: 0.86, pricePerProductUnit: 455, referenceCapitalCost: 80000000, referenceCapacityMMscfd: 15, fixedOpexPerYear: 5200000, variableOpexPerMscf: 0.65 },
  lpg_extraction: { productUnitPerMscf: 0.0052, productUnitLabel: 't LPG', recoveryFraction: 0.82, pricePerProductUnit: 470, referenceCapitalCost: 38000000, referenceCapacityMMscfd: 10, fixedOpexPerYear: 2600000, variableOpexPerMscf: 0.28 },
  gas_to_power: { productUnitPerMscf: 0.085, productUnitLabel: 'MWh', recoveryFraction: 0.94, pricePerProductUnit: 58, referenceCapitalCost: 50000000, referenceCapacityMMscfd: 12, fixedOpexPerYear: 3600000, variableOpexPerMscf: 0.45 },
};
/** The study's own requirement limits, route by route. A key left out is left unset. */
export const EGBEMA_LIMITS = {
  cng: { minVolumeMMscfd: 5, maxInertFraction: 0.06, minGhvBtuScf: 1000 },
  mini_lng: { minVolumeMMscfd: 10, maxCo2Fraction: 0.02, maxInertFraction: 0.06 },
  lpg_extraction: { minVolumeMMscfd: 5, minGpmC3Plus: 2 },
  gas_to_power: { minVolumeMMscfd: 3, minGhvBtuScf: 950 },
};
/** The counterfactual for the CNG route, and two others beside it on the same flare. */
export const EGBEMA_COUNTERFACTUALS = [
  { counterfactualLabel: 'CNG displacing diesel in haulage trucks', productCombustionTonnesCo2ePerYear: 128000, displacedFuelTonnesCo2ePerYear: 156000 },
  { counterfactualLabel: 'CNG displacing pipeline gas already burned', productCombustionTonnesCo2ePerYear: 128000, displacedFuelTonnesCo2ePerYear: 128000 },
  { counterfactualLabel: 'CNG sold into a market that burned nothing', productCombustionTonnesCo2ePerYear: 128000, displacedFuelTonnesCo2ePerYear: 0 },
];
/** Gas to power sold into a new load that burned nothing: the route's own counterfactual. */
export const EGBEMA_POWER_COUNTERFACTUAL = { counterfactualLabel: 'Gas to power for a new load that burned nothing', productCombustionTonnesCo2ePerYear: 205000, displacedFuelTonnesCo2ePerYear: 0 };
/** The credit test on the CNG route, prices typed in the order the bid team typed them. */
export const EGBEMA_CREDITS = { creditPrices: [40, 8, 20, 12], hurdleMarginPerYear: 24500000 };
/** A second hurdle the same route clears on its own. */
export const EGBEMA_LOW_HURDLE = 20000000;

/* ------------------------------------------------------------------ *
 * KANO LPG storage and bottling plant (Expert)
 * ------------------------------------------------------------------ */
/** The blend by liquid volume; densities, molar masses and latent heats are the engine's typical table. */
export const KANO_BLEND = { propane: 0.35, butane: 0.65 };
export const KANO_VESSEL = {
  vesselCapacityM3: 150, demandTonnesPerDay: 8, deliveryTonnes: 20, leadTimeDays: 3, safetyDays: 2,
};
/** Two ways a fill limit is stated, as illustrative figures (the code value is the site's, and is held). */
export const KANO_FILL_LIMITS = [
  { maxFillRatio: 0.85, fillRatioBasis: 'liquid_volume' },
  { maxFillRatio: 0.42, fillRatioBasis: 'water_capacity_mass' },
];
export const KANO_VAPORIZER = {
  massFlowKgHr: 650, liquidCpKJkgK: 2.45, inletTempC: 18, boilingPointC: 38,
  vapourCpKJkgK: 1.68, outletTempC: 55, designMarginPercent: 15,
};
export const KANO_BOTTLING = {
  cylindersPerDay: 3200, fillMinutesPerCylinder: 2.2, positions: 18,
  shiftHoursPerDay: 10, availabilityFraction: 0.92,
};
export const KANO_CYLINDER_CYCLE = [
  { label: 'At the customer', days: 24 }, { label: 'In transit out', days: 1.5 },
  { label: 'At the plant', days: 1.5 }, { label: 'In transit back', days: 1.5 },
];
export const KANO_CYLINDER_SPARES = 0.08;

/* ------------------------------------------------------------------ *
 * IBAFO CNG mother station (Expert)
 * ------------------------------------------------------------------ */
export const IBAFO_GAS = { gasSg: 0.62, temperatureC: 30 };
/** Bank pressures in bar(a), the engine's basis. */
export const IBAFO_BANKS = [
  { label: 'Low', volumeM3: 2, pressureBar: 230 },
  { label: 'Mid', volumeM3: 2, pressureBar: 250 },
  { label: 'High', volumeM3: 2, pressureBar: 270 },
];
/** A bus tank, filled from 25 to 200 bar(a). */
export const IBAFO_VEHICLE = { vehicleTankM3: 0.1, vehicleStartBar: 25, vehicleTargetBar: 200 };
/** One bank gauge read at 249 bar(g) with the site's atmosphere taken as 1.013 bar(a). */
export const IBAFO_GAUGE = { volumeM3: 2, gaugeBar: 249, atmosphereBar: 1.013 };
/** The compressor feeding the banks: taught as a unit bridge, never graded (FC3 owns its thermodynamics). */
export const IBAFO_COMPRESSION = {
  throughputKgPerHour: 400, suctionBar: 5, dischargeBar: 255, suctionTempC: 32, k: 1.31, polytropicEfficiency: 0.75,
};
export const IBAFO_DISPENSING = { vehiclesPerHour: 14, fillMinutes: 6, dispenserCounts: [2, 3] };
export const IBAFO_TRAILER_CYCLE = [
  { label: 'Loading', days: 0.2 }, { label: 'Run out', days: 0.3 },
  { label: 'On station', days: 1 }, { label: 'Run back', days: 0.3 },
];
export const IBAFO_TRAILER_TRIPS = 4;
export const IBAFO_TRAILER_SPARES = 0.1;
/** A Lagos bus operator's switch from PMS to CNG, one bus, prices in naira. */
export const IBAFO_CONVERSION = {
  annualDistanceKm: 55000,
  baseFuel: { label: 'PMS', consumptionPer100Km: 14, pricePerUnit: 780, energyPerUnitMJ: 32, emissionFactorKgCo2ePerUnit: 2.3 },
  newFuel: { label: 'CNG', pricePerUnit: 380, energyPerUnitMJ: 48, emissionFactorKgCo2ePerUnit: 2.75, efficiencyRatio: 0.92 },
  conversionCost: 1200000, annualExtraMaintenance: 60000,
};

/* ------------------------------------------------------------------ *
 * The two live apps' opening examples, copied from the Suite contexts
 * (src/contexts/FlareToValueContext.jsx and LpgCngContext.jsx) as data.
 * ------------------------------------------------------------------ */
export const SUITE_FLARE = {
  gas: [['C1', 0.78], ['C2', 0.09], ['C3', 0.05], ['IC4', 0.01], ['NC4', 0.02], ['C5', 0.01], ['N2', 0.02], ['CO2', 0.02]],
  volumeMMscfd: 10, onstreamDays: 350,
  /** The page's LPG route yield on the repaired defaults, and the figure it replaced. */
  lpgYieldPerMscf: 0.0045, lpgYieldBefore: 0.02,
};
export const SUITE_ROLLOUT = {
  banks: [{ label: 'Low', volumeM3: 1.5, pressureBar: 250 }, { label: 'Mid', volumeM3: 1.5, pressureBar: 250 }, { label: 'High', volumeM3: 1.5, pressureBar: 250 }],
  vehicleTankM3: 0.08, vehicleStartBar: 20, vehicleTargetBar: 200, temperatureC: 15, gasSg: 0.6,
  bottling: { cylindersPerDay: 2400, fillMinutesPerCylinder: 2.5, positions: 16, shiftHoursPerDay: 8, availabilityFraction: 0.9 },
  dispensing: { vehiclesPerHour: 12, fillMinutes: 5, dispensers: 2 },
};
