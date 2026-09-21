// THE TEACHING STREAMS OF THE H4 DIGEST, and the sweeps around them.
//
// THESE ARE NOT THE CAPSTONE FACILITIES. The capstones run three other
// facilities on other holes, pressures, pools, winds, charges and exposures; no
// distinctive input and no facility name is shared between the two files,
// nothing here imports h4_capstone.mjs and nothing there imports this.
// gate_capstone_leak.mjs proves both directions.
//
// Every stream exists to reach a BRANCH of the engine a lesson has to teach,
// and each one says which. The NextGen teaching lab
// (src/components/course/panels/consequence/consequenceLab.js) carries the same
// streams, and its vitest suite asserts they are deep-equal to these.
//
// PROPERTIES ARE ILLUSTRATIVE teaching inputs, never data this course
// recommends. Published worked examples are read from the vendored golden, not
// typed here.

/** AMENAM LIQUID: a crude run-down line under a static head and a blanketed
 *  ullage. The head and the ullage pressure are swept separately. */
export const AMENAM_LIQUID = Object.freeze({
  dischargeCoefficient: 0.62, holeDiameterM: 0.05, liquidDensityKgM3: 850, liquidHeadM: 6, pressureAboveLiquidPa: 2e5,
});
export const HEAD_LADDER = Object.freeze([0, 1, 3, 6, 12]);
export const ULLAGE_LADDER = Object.freeze([101325, 1.5e5, 2e5, 5e5, 1e6]);
/** Discharge coefficients for the same hole, and hole diameters for the same coefficient. */
export const CD_LADDER = Object.freeze([0.6, 0.62, 0.8, 1]);
export const HOLE_LADDER = Object.freeze([0.01, 0.025, 0.05, 0.1]);

/** AMENAM GAS: a methane line leaking through one hole at a ladder of
 *  upstream pressures, from subsonic through the critical ratio to choked. */
export const AMENAM_GAS = Object.freeze({
  dischargeCoefficient: 0.62, holeDiameterM: 0.025, upstreamTemperatureK: 300, molarMassKgMol: 0.01604, heatCapacityRatio: 1.31,
});
export const PRESSURE_LADDER = Object.freeze([1.2e5, 1.5e5, 1.8e5, 2.5e5, 5e5, 2e6, 1e7]);
/** Heat capacity ratios for the critical pressure ratio table. */
export const GAMMA_LADDER = Object.freeze([1.1, 1.2, 1.31, 1.4, 1.67]);

/** Pools: one spill, a bund floor, a bund that overtops, and stated thicknesses. */
export const SPILL_M3 = 30;
export const BUND = Object.freeze({ bundAreaM2: 400, bundWallHeightM: 0.5 });
export const SMALL_BUND = Object.freeze({ bundAreaM2: 50, bundWallHeightM: 0.5 });
export const THICKNESS_LADDER = Object.freeze([0.005, 0.01, 0.02, 0.05]);

/** Evaporation of a hexane-like pool, Mackay and Matsugu: wind and diameter swept. */
export const EVAP = Object.freeze({
  poolDiameterM: 10, windSpeed10mMS: 3, vapourPressurePa: 16000, molarMassKgMol: 0.08618, liquidTemperatureK: 293.15,
});
export const EVAP_WIND = Object.freeze([1, 2, 3, 5, 8]);
export const EVAP_DIAMETER = Object.freeze([2, 5, 10, 20, 40]);

/** Distances for the Briggs sigma table, m. */
export const SIGMA_DISTANCES = Object.freeze([60, 100, 300, 1000, 3000, 10000, 20000]);

/** UBIT: a sustained carbon monoxide release, ground level and from a stack. */
export const UBIT = Object.freeze({ massRateKgS: 2, windSpeedMS: 3, molarMassGMol: 28.01 });
export const PLUME_DISTANCES = Object.freeze([100, 200, 500, 1000, 2000, 5000]);
export const STACK_HEIGHT_M = 25;
export const CROSSWIND_LADDER = Object.freeze([0, 20, 50, 100]);
/** Targets, mg/m3, for the distance to a concentration. */
export const REACH_TARGETS = Object.freeze([500, 100, 20]);
/** A stack target the peak never reaches, and a class F case beyond a short search. */
export const REACH_NOT_REACHED_MGM3 = 5000;
export const REACH_SHORT_MAX_M = 2000;

/** Conversions: carbon monoxide and hydrogen sulphide at three temperatures. */
export const CONVERT_PPM = Object.freeze([50, 400, 1200]);
export const CONVERT_TEMPERATURES_K = Object.freeze([273.15, 293.15, 298.15]);
export const H2S_MOLAR_MASS = 34.08;

/** ERHA: a heptane bund fire, the solid flame chain one step at a time. */
export const ERHA = Object.freeze({
  poolDiameterM: 20, fuel: 'heptane', heatOfCombustionJKg: 44.6e6, airDensityKgM3: 1.2, airKinematicViscosityM2S: 1.5e-5,
  radiativeFraction: 0.3, sootFraction: 0.8,
});
export const BURN_DIAMETERS = Object.freeze([0.5, 1, 2, 5, 10, 20, 50]);
export const BURN_FUELS = Object.freeze(['lng', 'lpg', 'heptane', 'gasoline', 'kerosene', 'methanol']);
/** Burgess for n-hexane, as a single-component liquid below its boiling point. */
export const BURGESS_HEXANE = Object.freeze({
  heatOfCombustionJKg: 44.7e6, heatOfVaporisationJKg: 3.35e5, liquidHeatCapacityJKgK: 2270, boilingPointK: 341.9, ambientTemperatureK: 293.15,
});
export const WIND_LADDER = Object.freeze([0, 2, 4, 8, 12]);
export const SEP_DIAMETERS = Object.freeze([2, 5, 10, 20, 40, 80]);
/** View factor geometry: flame radius 10 m, flame length 30 m, targets swept. */
export const VF_TARGETS = Object.freeze([15, 20, 30, 50, 80, 120]);
export const VF_TILTS = Object.freeze([0, 20, 40]);
export const VF_OVERHANG = Object.freeze({ flameRadiusM: 10, flameLengthM: 30, distanceFromAxisM: 25, tiltDeg: 40 });
/** Bagster: water vapour partial pressure 1500 Pa, path lengths swept. */
export const BAGSTER_PW = 1500;
export const BAGSTER_PATHS = Object.freeze([5, 10, 30, 60, 70]);
/** The ERHA composite, with a stated transmissivity, at distances from the centre. */
export const ERHA_TAU = 0.8;
export const ERHA_DISTANCES = Object.freeze([25, 40, 60, 100, 150]);
export const ERHA_WIND = 4;
export const HEAT_FLUX_TARGETS = Object.freeze([35000, 12500, 5000]);

/** BONGA: a butane cloud as TNT, and a charge for the blast field. */
export const BONGA_TNT = Object.freeze({ fuelMassKg: 3000, heatOfCombustionJKg: 45.7e6, yieldFactor: 0.04, tntBlastEnergyJKg: 4.6e6 });
export const YIELD_LADDER = Object.freeze([0.02, 0.04, 0.1, 0.2]);
export const Z_LADDER = Object.freeze([0.1, 0.5, 1, 2, 5, 10, 20, 40]);
export const BONGA_CHARGE_KG = 500;
export const BONGA_DISTANCES = Object.freeze([20, 50, 100, 200, 300]);
export const OVERPRESSURE_TARGETS = Object.freeze([100000, 50000, 20000, 10000, 5000]);

/** Probits. */
export const PROBIT_LADDER = Object.freeze([2, 3, 4, 5, 6, 7, 8]);
export const THERMAL_FLUXES_WM2 = Object.freeze([5000, 10000, 20000, 35000]);
export const THERMAL_TIMES_S = Object.freeze([10, 20, 40]);
export const OVERPRESSURE_PSIG = Object.freeze([2, 5, 10, 20, 40]);
/** Chlorine under the two sources that carry it, and hydrogen sulphide on the mg/m3 preset. */
export const CHLORINE_PPM = Object.freeze([50, 100, 200, 400]);
export const CHLORINE_MINUTES = 10;
export const CHLORINE_MOLAR_MASS = 70.9;
export const H2S_PB = Object.freeze({ concentrationPpm: 800, exposureMinutes: 15, temperatureK: 293.15 });
/** A concentration that changes: three steps of one toxic history. */
export const TOXIC_HISTORY = Object.freeze([
  Object.freeze({ concentration: 150, minutes: 5 }),
  Object.freeze({ concentration: 90, minutes: 10 }),
  Object.freeze({ concentration: 30, minutes: 20 }),
]);
/** Probabilities for the inverse probit. */
export const INVERSE_PROBABILITIES = Object.freeze([0.01, 0.1, 0.5, 0.9, 0.99]);
