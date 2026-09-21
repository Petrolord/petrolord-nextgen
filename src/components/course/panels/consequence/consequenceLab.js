// THE H4 TEACHING LAB: Consequence Modelling.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/hse/consequence.js, sha-identical with
// petrolord-engines 16fd6c9) on the teaching streams below, on the published
// worked cases read from the vendored golden, or on the inputs a learner types
// into a panel. The teaching streams are the same streams the wave's digest
// generator runs (tools/course-waves/consequence/h4_fields.mjs), and
// consequenceLab.test.js asserts they are deep-equal and that every number a
// teaching reader returns is printed in the digest.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone facility or input, and panelCapstoneGuard.test.js greps this
// file, the three panels and the learning page for every rendering of all
// eighteen answers and every distinctive capstone input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// PROPERTIES ARE ILLUSTRATIVE teaching inputs, never data.
//
// Nothing here reads a clock, a random number or a locale.
import * as E from '@petrolord/engines/engines/hse/consequence.js';
import GOLD from '@petrolord/engines/test-data/hse/goldens/consequence_cases.json';

const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/* ------------------------------------------------------------ the streams */

export const STREAMS = Object.freeze({
  AMENAM_LIQUID: freeze({
    dischargeCoefficient: 0.62, holeDiameterM: 0.05, liquidDensityKgM3: 850, liquidHeadM: 6, pressureAboveLiquidPa: 2e5,
  }),
  HEAD_LADDER: Object.freeze([0, 1, 3, 6, 12]),
  ULLAGE_LADDER: Object.freeze([101325, 1.5e5, 2e5, 5e5, 1e6]),
  CD_LADDER: Object.freeze([0.6, 0.62, 0.8, 1]),
  HOLE_LADDER: Object.freeze([0.01, 0.025, 0.05, 0.1]),
  AMENAM_GAS: freeze({
    dischargeCoefficient: 0.62, holeDiameterM: 0.025, upstreamTemperatureK: 300, molarMassKgMol: 0.01604, heatCapacityRatio: 1.31,
  }),
  PRESSURE_LADDER: Object.freeze([1.2e5, 1.5e5, 1.8e5, 2.5e5, 5e5, 2e6, 1e7]),
  GAMMA_LADDER: Object.freeze([1.1, 1.2, 1.31, 1.4, 1.67]),
  SPILL_M3: 30,
  BUND: freeze({ bundAreaM2: 400, bundWallHeightM: 0.5 }),
  SMALL_BUND: freeze({ bundAreaM2: 50, bundWallHeightM: 0.5 }),
  THICKNESS_LADDER: Object.freeze([0.005, 0.01, 0.02, 0.05]),
  EVAP: freeze({
    poolDiameterM: 10, windSpeed10mMS: 3, vapourPressurePa: 16000, molarMassKgMol: 0.08618, liquidTemperatureK: 293.15,
  }),
  EVAP_WIND: Object.freeze([1, 2, 3, 5, 8]),
  EVAP_DIAMETER: Object.freeze([2, 5, 10, 20, 40]),
  SIGMA_DISTANCES: Object.freeze([60, 100, 300, 1000, 3000, 10000, 20000]),
  UBIT: freeze({ massRateKgS: 2, windSpeedMS: 3, molarMassGMol: 28.01 }),
  PLUME_DISTANCES: Object.freeze([100, 200, 500, 1000, 2000, 5000]),
  STACK_HEIGHT_M: 25,
  CROSSWIND_LADDER: Object.freeze([0, 20, 50, 100]),
  REACH_TARGETS: Object.freeze([500, 100, 20]),
  REACH_NOT_REACHED_MGM3: 5000,
  REACH_SHORT_MAX_M: 2000,
  CONVERT_PPM: Object.freeze([50, 400, 1200]),
  CONVERT_TEMPERATURES_K: Object.freeze([273.15, 293.15, 298.15]),
  H2S_MOLAR_MASS: 34.08,
  ERHA: freeze({
    poolDiameterM: 20, fuel: 'heptane', heatOfCombustionJKg: 44.6e6, airDensityKgM3: 1.2, airKinematicViscosityM2S: 1.5e-5,
    radiativeFraction: 0.3, sootFraction: 0.8,
  }),
  BURN_DIAMETERS: Object.freeze([0.5, 1, 2, 5, 10, 20, 50]),
  BURN_FUELS: Object.freeze(['lng', 'lpg', 'heptane', 'gasoline', 'kerosene', 'methanol']),
  BURGESS_HEXANE: freeze({
    heatOfCombustionJKg: 44.7e6, heatOfVaporisationJKg: 3.35e5, liquidHeatCapacityJKgK: 2270, boilingPointK: 341.9, ambientTemperatureK: 293.15,
  }),
  WIND_LADDER: Object.freeze([0, 2, 4, 8, 12]),
  SEP_DIAMETERS: Object.freeze([2, 5, 10, 20, 40, 80]),
  VF_TARGETS: Object.freeze([15, 20, 30, 50, 80, 120]),
  VF_TILTS: Object.freeze([0, 20, 40]),
  VF_OVERHANG: freeze({ flameRadiusM: 10, flameLengthM: 30, distanceFromAxisM: 25, tiltDeg: 40 }),
  BAGSTER_PW: 1500,
  BAGSTER_PATHS: Object.freeze([5, 10, 30, 60, 70]),
  ERHA_TAU: 0.8,
  ERHA_DISTANCES: Object.freeze([25, 40, 60, 100, 150]),
  ERHA_WIND: 4,
  HEAT_FLUX_TARGETS: Object.freeze([35000, 12500, 5000]),
  BONGA_TNT: freeze({ fuelMassKg: 3000, heatOfCombustionJKg: 45.7e6, yieldFactor: 0.04, tntBlastEnergyJKg: 4.6e6 }),
  YIELD_LADDER: Object.freeze([0.02, 0.04, 0.1, 0.2]),
  Z_LADDER: Object.freeze([0.1, 0.5, 1, 2, 5, 10, 20, 40]),
  BONGA_CHARGE_KG: 500,
  BONGA_DISTANCES: Object.freeze([20, 50, 100, 200, 300]),
  OVERPRESSURE_TARGETS: Object.freeze([100000, 50000, 20000, 10000, 5000]),
  PROBIT_LADDER: Object.freeze([2, 3, 4, 5, 6, 7, 8]),
  THERMAL_FLUXES_WM2: Object.freeze([5000, 10000, 20000, 35000]),
  THERMAL_TIMES_S: Object.freeze([10, 20, 40]),
  OVERPRESSURE_PSIG: Object.freeze([2, 5, 10, 20, 40]),
  CHLORINE_PPM: Object.freeze([50, 100, 200, 400]),
  CHLORINE_MINUTES: 10,
  CHLORINE_MOLAR_MASS: 70.9,
  H2S_PB: freeze({ concentrationPpm: 800, exposureMinutes: 15, temperatureK: 293.15 }),
  TOXIC_HISTORY: freeze([
    { concentration: 150, minutes: 5 },
    { concentration: 90, minutes: 10 },
    { concentration: 30, minutes: 20 },
  ]),
  INVERSE_PROBABILITIES: Object.freeze([0.01, 0.1, 0.5, 0.9, 0.99]),
});

export const STABILITY_CLASSES = E.STABILITY_CLASSES;
export const FUELS = Object.keys(E.POOL_FIRE_FUELS);
export const THERMAL_PRESETS = Object.keys(E.THERMAL_PROBITS);
export const TOXIC_PRESETS = Object.keys(E.TOXIC_PROBITS);
export const ATM_PA = E.ATM_PA;
export const PA_PER_PSI = E.PA_PER_PSI;

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/** A comma, space or newline separated list of numbers. */
export const parseSeries = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the list is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const values = parts.map(Number);
  const bad = parts.filter((p, i) => !Number.isFinite(values[i]));
  if (bad.length) return { error: `these entries are not numbers: ${bad.join(', ')}` };
  return { values };
};

/** A toxic history, one step per line as "concentration, minutes". */
export const parseHistory = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return [];
  return text.split('\n').map((l) => l.trim()).filter((l) => l !== '').map((l) => {
    const [c, m] = l.split(',');
    return { concentration: parseNumber((c || '').trim()), minutes: parseNumber((m || '').trim()) };
  });
};
export const historyText = (rows) => rows.map((r) => `${r.concentration}, ${r.minutes}`).join('\n');

/** Drop the keys a learner left blank, so the engine applies its own default. */
export const typed = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const liquid = (a) => E.liquidOrificeDischarge(typed(a));
export const gas = (a) => E.gasOrificeDischarge(typed(a));
export const pool = (a) => E.poolFromSpill(typed(a));
export const evaporation = (a) => E.poolEvaporationMackayMatsugu(typed(a));
export const sigmas = (a) => E.briggsRuralSigmas(typed(a));
export const plume = (a) => E.gaussianPlume(typed(a));
export const reachOf = (a) => E.plumeDistanceToConcentration(typed(a));
export const burning = (a) => E.poolBurningRate(typed(a));
export const flameLength = (a) => E.poolFireFlameLength(typed(a));
export const tilt = (a) => E.poolFireTilt(typed(a));
export const sep = (a) => E.surfaceEmissivePower(typed(a));
export const viewFactor = (a) => E.cylinderViewFactor(typed(a));
export const bagster = (a) => E.atmosphericTransmissivityBagster(typed(a));
export const solidFlame = (a) => E.poolFireSolidFlame(typed(a));
export const distanceToHeatFlux = (a) => E.solidFlameDistanceForHeatFlux(typed(a));
export const tnt = (a) => E.tntEquivalentMass(typed(a));
export const blast = (a) => E.kinneyGrahamOverpressure(typed(a));
export const blastDistance = (a) => E.distanceForOverpressure(typed(a));
export const toProbability = (y) => E.probitToProbability(y);
export const toProbit = (p) => E.probabilityToProbit(p);
export const thermal = (a) => E.thermalProbit(typed(a));
export const toxic = (a) => E.toxicProbit(typed(a));
export const toxicLoad = (a) => E.toxicDose(a);
export const overpressureHarm = (a) => E.overpressureProbit(typed(a));

/* ------------------------------------------------- the teaching readers */

const S = STREAMS;

/** Associate: the AMENAM liquid line, its head and ullage swept. */
export const liquidTeaching = () => {
  const r = E.liquidOrificeDischarge(S.AMENAM_LIQUID);
  return {
    holeAreaM2: r.holeAreaM2,
    pressureAtHolePa: r.pressureAtHolePa,
    drivingPressurePa: r.drivingPressurePa,
    massRateKgS: r.massRateKgS,
    jetVelocityMS: r.jetVelocityMS,
    model: r.basis.model,
    heads: S.HEAD_LADDER.map((h) => {
      const x = E.liquidOrificeDischarge({ ...S.AMENAM_LIQUID, liquidHeadM: h });
      return { liquidHeadM: h, drivingPressurePa: x.drivingPressurePa, massRateKgS: x.massRateKgS };
    }),
    ullages: S.ULLAGE_LADDER.map((p) => {
      const x = E.liquidOrificeDischarge({ ...S.AMENAM_LIQUID, pressureAboveLiquidPa: p });
      return { pressureAboveLiquidPa: p, drivingPressurePa: x.drivingPressurePa, massRateKgS: x.massRateKgS };
    }),
  };
};

/** Associate: the AMENAM gas line across the critical ratio. */
export const gasTeaching = () => ({
  rows: S.PRESSURE_LADDER.map((p) => {
    const r = E.gasOrificeDischarge({ ...S.AMENAM_GAS, upstreamPressurePa: p });
    return {
      upstreamPressurePa: p, pressureRatio: r.pressureRatio, regime: r.regime, psi: r.outflowCoefficientPsi,
      upstreamDensityKgM3: r.upstreamDensityKgM3, massRateKgS: r.massRateKgS,
    };
  }),
  criticalRatios: S.GAMMA_LADDER.map((g) => ({
    heatCapacityRatio: g,
    criticalPressureRatio: E.gasOrificeDischarge({ ...S.AMENAM_GAS, upstreamPressurePa: 5e5, heatCapacityRatio: g }).criticalPressureRatio,
  })),
  model: E.gasOrificeDischarge({ ...S.AMENAM_GAS, upstreamPressurePa: 5e5 }).basis.model,
});

/** Associate: the spill in its bund and at stated thicknesses. */
export const poolTeaching = () => {
  const b = E.poolFromSpill({ spillVolumeM3: S.SPILL_M3, ...S.BUND });
  return {
    bund: { containment: b.containment, areaM2: b.areaM2, depthM: b.depthM, equivalentDiameterM: b.equivalentDiameterM },
    thicknesses: S.THICKNESS_LADDER.map((d) => {
      const r = E.poolFromSpill({ spillVolumeM3: S.SPILL_M3, poolThicknessM: d });
      return { poolThicknessM: d, areaM2: r.areaM2, equivalentDiameterM: r.equivalentDiameterM };
    }),
  };
};

/** Associate: Mackay and Matsugu on the hexane-like pool, wind and diameter swept. */
export const evaporationTeaching = () => {
  const r = E.poolEvaporationMackayMatsugu(S.EVAP);
  return {
    massTransferCoefficientMS: r.massTransferCoefficientMS,
    evaporationFluxKgM2S: r.evaporationFluxKgM2S,
    evaporationRateKgS: r.evaporationRateKgS,
    winds: S.EVAP_WIND.map((u) => ({ windSpeed10mMS: u, evaporationRateKgS: E.poolEvaporationMackayMatsugu({ ...S.EVAP, windSpeed10mMS: u }).evaporationRateKgS })),
  };
};

/** Associate: the Briggs sigmas at the teaching distances, class D. */
export const sigmaTeaching = () => S.SIGMA_DISTANCES.map((x) => {
  const r = E.briggsRuralSigmas({ stabilityClass: 'D', downwindDistanceM: x });
  return { downwindDistanceM: x, sigmaYM: r.sigmaYM, sigmaZM: r.sigmaZM, warning: !!r.warning };
});

const ubit = { massRateKgS: S.UBIT.massRateKgS, windSpeedMS: S.UBIT.windSpeedMS, molarMassGMol: S.UBIT.molarMassGMol };

/** Associate: the UBIT plume on the centreline, class D, and by class at 500 m. */
export const plumeTeaching = () => ({
  distances: S.PLUME_DISTANCES.map((x) => {
    const r = E.gaussianPlume({ ...ubit, stabilityClass: 'D', downwindDistanceM: x });
    return { downwindDistanceM: x, concentrationMgM3: r.concentrationMgM3, concentrationPpm: r.concentrationPpm };
  }),
  classes: E.STABILITY_CLASSES.map((k) => {
    const r = E.gaussianPlume({ ...ubit, stabilityClass: k, downwindDistanceM: 500 });
    return { stabilityClass: k, concentrationMgM3: r.concentrationMgM3 };
  }),
  crosswind: S.CROSSWIND_LADDER.map((y) => ({
    crosswindDistanceM: y,
    concentrationMgM3: E.gaussianPlume({ ...ubit, stabilityClass: 'D', downwindDistanceM: 500, crosswindDistanceM: y }).concentrationMgM3,
  })),
});

/** Associate: the distance to a concentration, from the ground and from the stack. */
export const reachTeaching = () => {
  const base = { massRateKgS: S.UBIT.massRateKgS, windSpeedMS: S.UBIT.windSpeedMS };
  return {
    ground: ['D', 'F'].flatMap((k) => S.REACH_TARGETS.map((t) => {
      const r = E.plumeDistanceToConcentration({ ...base, stabilityClass: k, targetConcentrationMgM3: t });
      return { stabilityClass: k, target: t, state: r.state, farDistanceM: r.farDistanceM };
    })),
    stack: [...S.REACH_TARGETS, S.REACH_NOT_REACHED_MGM3].map((t) => {
      const r = E.plumeDistanceToConcentration({ ...base, stabilityClass: 'D', targetConcentrationMgM3: t, releaseHeightM: S.STACK_HEIGHT_M });
      return {
        target: t, state: r.state, peakConcentrationMgM3: r.peakConcentrationMgM3, peakDistanceM: r.peakDistanceM,
        nearDistanceM: r.nearDistanceM, farDistanceM: r.farDistanceM,
      };
    }),
  };
};

const erhaFlux = () => E.poolBurningRate({ method: 'babrauskas', fuel: S.ERHA.fuel, poolDiameterM: S.ERHA.poolDiameterM }).burningFluxKgM2S;

/** Professional: the Babrauskas burning flux against the diameter, six fuels. */
export const burningTeaching = () => S.BURN_FUELS.map((fuel) => ({
  fuel,
  rows: S.BURN_DIAMETERS.map((d) => ({ poolDiameterM: d, burningFluxKgM2S: E.poolBurningRate({ method: 'babrauskas', fuel, poolDiameterM: d }).burningFluxKgM2S })),
}));

/** Professional: ERHA flame length and tilt against the wind. */
export const flameTeaching = () => {
  const m = erhaFlux();
  const common = { poolDiameterM: S.ERHA.poolDiameterM, burningFluxKgM2S: m, airDensityKgM3: S.ERHA.airDensityKgM3 };
  const still = E.poolFireFlameLength({ method: 'thomas-still-air', ...common });
  return {
    burningFluxKgM2S: m,
    stillAirFlameLengthM: still.flameLengthM,
    winds: S.WIND_LADDER.map((u) => {
      const l = E.poolFireFlameLength({ method: 'thomas-wind', ...common, windSpeed10mMS: u });
      const t = E.poolFireTilt({ poolDiameterM: S.ERHA.poolDiameterM, windSpeed10mMS: u, airKinematicViscosityM2S: S.ERHA.airKinematicViscosityM2S });
      return { windSpeed10mMS: u, scaledWindSpeed: l.scaledWindSpeed, flameLengthM: l.flameLengthM, tiltDeg: t.tiltDeg };
    }),
  };
};

/** Professional: the three surface emissive powers for ERHA at its wind. */
export const sepTeaching = () => {
  const m = erhaFlux();
  const L = E.poolFireFlameLength({
    method: 'thomas-wind', poolDiameterM: S.ERHA.poolDiameterM, burningFluxKgM2S: m, airDensityKgM3: S.ERHA.airDensityKgM3, windSpeed10mMS: S.ERHA_WIND,
  }).flameLengthM;
  const args = {
    poolDiameterM: S.ERHA.poolDiameterM, radiativeFraction: S.ERHA.radiativeFraction, burningFluxKgM2S: m,
    heatOfCombustionJKg: S.ERHA.heatOfCombustionJKg, flameLengthM: L,
  };
  return {
    flameLengthM: L,
    mudan: E.surfaceEmissivePower({ method: 'mudan-diameter', poolDiameterM: S.ERHA.poolDiameterM }).surfaceEmissivePowerWM2,
    clear: E.surfaceEmissivePower({ method: 'radiative-fraction', ...args }).surfaceEmissivePowerWM2,
    soot: E.surfaceEmissivePower({ method: 'radiative-fraction-soot', ...args, sootFraction: S.ERHA.sootFraction }).surfaceEmissivePowerWM2,
  };
};

/** Professional: the view factor grid, refusals included. */
export const viewFactorTeaching = () => S.VF_TILTS.flatMap((t) => S.VF_TARGETS.map((x) => {
  const r = E.cylinderViewFactor({ flameRadiusM: 10, flameLengthM: 30, distanceFromAxisM: x, tiltDeg: t });
  return r.error
    ? { tiltDeg: t, distanceFromAxisM: x, field: r.field, error: r.error }
    : { tiltDeg: t, distanceFromAxisM: x, viewFactorVertical: r.viewFactorVertical, viewFactorHorizontal: r.viewFactorHorizontal, viewFactorMax: r.viewFactorMax };
}));

/** Professional: Bagster at the teaching partial pressure. */
export const bagsterTeaching = () => S.BAGSTER_PATHS.map((x) => {
  const r = E.atmosphericTransmissivityBagster({ waterVapourPartialPressurePa: S.BAGSTER_PW, pathLengthM: x });
  return r.error ? { pathLengthM: x, field: r.field } : { pathLengthM: x, transmissivity: r.transmissivity };
});

/** The ERHA composite arguments, with its stated transmissivity. */
export const erhaArgs = () => ({
  poolDiameterM: S.ERHA.poolDiameterM, burningFluxKgM2S: erhaFlux(), heatOfCombustionJKg: S.ERHA.heatOfCombustionJKg,
  flameLengthMethod: 'thomas-wind', airDensityKgM3: S.ERHA.airDensityKgM3, windSpeed10mMS: S.ERHA_WIND,
  airKinematicViscosityM2S: S.ERHA.airKinematicViscosityM2S,
  sep: { method: 'radiative-fraction-soot', radiativeFraction: S.ERHA.radiativeFraction, sootFraction: S.ERHA.sootFraction },
  transmissivity: S.ERHA_TAU,
});

/** Professional: the ERHA heat flux at distances, and the distance to three heat fluxes. */
export const solidFlameTeaching = () => {
  const a = erhaArgs();
  return {
    rows: S.ERHA_DISTANCES.map((x) => {
      const r = E.poolFireSolidFlame({ ...a, distanceFromCentreM: x });
      return r.error ? { distanceFromCentreM: x, field: r.field } : { distanceFromCentreM: x, viewFactorMax: r.viewFactorMax, heatFluxWM2: r.heatFluxWM2 };
    }),
    targets: S.HEAT_FLUX_TARGETS.map((q) => {
      const r = E.solidFlameDistanceForHeatFlux({ ...a, targetHeatFluxWM2: q });
      return { target: q, state: r.state, distanceFromCentreM: r.distanceFromCentreM };
    }),
  };
};

/** Professional: the Yellow Book pool fire through the engine, beside what the book prints. */
export const yellowBookPoolFire = () => {
  const yb = GOLD.fires.ybPoolFire;
  const r = E.poolFireSolidFlame(yb.args);
  return {
    source: yb.source,
    flameLengthM: r.flameLengthM,
    tiltDeg: r.tiltDeg,
    surfaceEmissivePowerWM2: r.surfaceEmissivePowerWM2,
    viewFactorMax: r.viewFactorMax,
    heatFluxWM2: r.heatFluxWM2,
    printed: {
      flameLengthM: yb.printed.flameLengthM, tiltDeg: yb.printed.tiltDeg, surfaceEmissivePowerWM2: yb.printed.sepAct,
      viewFactorMax: yb.printed.viewFactorMax, heatFluxWM2: yb.printed.heatFluxWM2,
    },
  };
};

/** Expert: BONGA's TNT mass, its charge's blast field and the inverse. */
export const blastTeaching = () => ({
  tnt: S.YIELD_LADDER.map((y) => ({ yieldFactor: y, tntMassKg: E.tntEquivalentMass({ ...S.BONGA_TNT, yieldFactor: y }).tntMassKg })),
  forward: S.BONGA_DISTANCES.map((x) => {
    const r = E.kinneyGrahamOverpressure({ distanceM: x, tntMassKg: S.BONGA_CHARGE_KG });
    return { distanceM: x, scaledDistanceMKg13: r.scaledDistanceMKg13, overpressurePa: r.overpressurePa };
  }),
  inverse: S.OVERPRESSURE_TARGETS.map((p) => {
    const r = E.distanceForOverpressure({ tntMassKg: S.BONGA_CHARGE_KG, overpressurePa: p });
    return { overpressurePa: p, scaledDistanceMKg13: r.scaledDistanceMKg13, distanceM: r.distanceM };
  }),
});

/** Expert: the probit ladder and the thermal presets on the teaching exposures. */
export const probitTeaching = () => ({
  ladder: S.PROBIT_LADDER.map((y) => ({ probit: y, probability: E.probitToProbability(y).probability })),
  thermal: S.THERMAL_FLUXES_WM2.flatMap((q) => S.THERMAL_TIMES_S.map((t) => ({
    heatFluxWM2: q,
    exposureTimeS: t,
    probabilities: THERMAL_PRESETS.map((k) => E.thermalProbit({ coefficients: k, heatFluxWM2: q, exposureTimeS: t }).probability),
  }))),
  overpressure: S.OVERPRESSURE_PSIG.map((psi) => {
    const r = E.overpressureProbit({ overpressurePa: psi * E.PA_PER_PSI });
    return { psig: psi, probit: r.probit, probability: r.probability };
  }),
});

/** Expert: chlorine under two sources, and a toxic history. */
export const toxicTeaching = () => ({
  chlorine: S.CHLORINE_PPM.map((c) => {
    const l = E.toxicProbit({ coefficients: 'lees-chlorine', concentrationPpm: c, exposureMinutes: S.CHLORINE_MINUTES });
    const p = E.toxicProbit({
      coefficients: 'pb-chlorine', concentrationPpm: c, exposureMinutes: S.CHLORINE_MINUTES, molarMassGMol: S.CHLORINE_MOLAR_MASS,
    });
    return { concentrationPpm: c, leesProbability: l.probability, pbProbability: p.probability };
  }),
  history: E.toxicDose({ n: 2, history: S.TOXIC_HISTORY }).dose,
});

/** Every refusal a panel can show, with the engine's own words. */
export const refusalSamples = () => [
  ['poolFromSpill', 'a spill that overtops its bund', E.poolFromSpill({ spillVolumeM3: S.SPILL_M3, ...S.SMALL_BUND })],
  ['gaussianPlume', 'a wind speed of zero', E.gaussianPlume({ massRateKgS: 2, windSpeedMS: 0, downwindDistanceM: 500, stabilityClass: 'D' })],
  ['cylinderViewFactor', 'a flame that leans over the target', E.cylinderViewFactor(S.VF_OVERHANG)],
  ['atmosphericTransmissivityBagster', 'a path too short for the fit', E.atmosphericTransmissivityBagster({ waterVapourPartialPressurePa: S.BAGSTER_PW, pathLengthM: 5 })],
  ['kinneyGrahamOverpressure', 'a scaled distance beyond the range', E.kinneyGrahamOverpressure({ scaledDistanceMKg13: 60 })],
  ['toxicProbit', 'ppm on a mg/m3 preset with no molar mass', E.toxicProbit({ coefficients: 'pb-hydrogen-sulfide', concentrationPpm: 500, exposureMinutes: 10 })],
].map(([fn, what, r]) => ({ fn, what, field: r.field, error: r.error }));
