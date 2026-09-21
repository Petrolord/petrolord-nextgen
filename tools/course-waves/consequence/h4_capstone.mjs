// THE EIGHTEEN GRADED H4 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three facilities, six graded fields each, every one a RETURN VALUE of the
// vendored engines/hse/consequence.js. A gate that restates the formula
// validates nothing, so nothing here computes a mass rate, a concentration, a
// flame length, a view factor, an overpressure or a probit by its own
// arithmetic: every number is read off an engine result object, and
// discriminate.mjs is where the wrong methods live.
//
//   OKAN        Associate     HOW MUCH GETS OUT AND WHERE DOES IT GO. Two
//                             discharges, one of each regime, a spilled pool
//                             and a Gaussian plume read at a receptor and
//                             solved for a distance.
//   YOKRI       Professional  WHAT DOES THE FIRE RADIATE. The solid flame
//                             chain: flame length with wind, tilt, two surface
//                             emissive powers, the view factor and the flux.
//   PENNINGTON  Expert        WHO IS HURT. The Kinney and Graham blast field
//                             forward and inverse, and four probits.
//
// Usage:
//   node h4_capstone.mjs            the human table
//   node h4_capstone.mjs --json     the rows make_fields.mjs writes
//   node h4_capstone.mjs --inputs   the three scenarios, for oracle_check.py
//
// NOTHING HERE READS THE DIGEST OR THE TEACHING STREAMS, and the digest
// generator reads nothing here. The two run different facilities on different
// numbers, and gate_capstone_leak.mjs proves it in both directions.
//
// WHAT IS DELIBERATELY NOT GRADED HERE, and why:
//   * The POINT SOURCE flare and pool fire radiation and the setbacks they
//     imply. Those belong to the live FC1 and FC5 Facilities courses, this
//     engine does not export them, and no field below is a radiation level or
//     a distance to one.
//   * Every SINGLE ROUTE quantity the engine's validation record names as
//     carrying no second derivation: Mackay and Matsugu evaporation, the
//     Bagster transmissivity, the Burgess burning rate, the TNT equivalence
//     and the still air Thomas flame height. They are taught and they are
//     never a graded answer. The flame length WITH WIND, the flame tilt and
//     both surface emissive powers are graded, because a published worked
//     example reproduces each of them.
//   * The Babrauskas burning flux at any pool of interest, which saturates at
//     its own asymptote and so cannot tell a right method from a wrong one.
//
// EVERY FAILURE INPUT BELOW IS A STATED CAPSTONE INPUT chosen for the
// exercise, never data this course recommends.
import process from 'node:process';

const ROOT = process.env.H4_ENGINES || '/root/wt-h4-nextgen/packages/engines';
const C = await import(`${ROOT}/engines/hse/consequence.js`);
const TOLPATH = process.env.H4_TOLERANCE
  || '/root/wt-h4-nextgen/src/components/course/panels/consequence/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
/** A call this file LABELS a success: no error key, and every top-level number finite. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};

/* ============================================================ OKAN, Associate

   A gas and condensate platform's loss of containment day.
   CONDENSATE   a hole in the stabiliser bottoms line under a static head and
                a pressurised ullage, liquid outflow.
   RISER        a hole in the gas riser at pipeline pressure, choked.
   VENT         the low pressure flash gas vent to atmosphere, subsonic, the
                same hole size so only the pressure differs.
   DECK SPILL   a stated thickness spill on an open deck, no bund.
   PLUME        a sustained hydrogen sulphide release from the vent stack,
                read at a receptor off the centreline, then solved for the
                distance at which a stated concentration is met.
   ==================================================================== */

const OKAN = Object.freeze({
  condensate: Object.freeze({
    dischargeCoefficient: 0.62,
    holeDiameterM: 0.041,
    liquidDensityKgM3: 786,
    liquidHeadM: 4.37,
    pressureAboveLiquidPa: 310000,
  }),
  riser: Object.freeze({
    dischargeCoefficient: 0.62,
    holeDiameterM: 0.059,
    upstreamPressurePa: 4.7e6,
    upstreamTemperatureK: 308.15,
    molarMassKgMol: 0.0187,
    heatCapacityRatio: 1.28,
  }),
  vent: Object.freeze({
    dischargeCoefficient: 0.62,
    holeDiameterM: 0.059,
    upstreamPressurePa: 1.28e5,
    upstreamTemperatureK: 308.15,
    molarMassKgMol: 0.0187,
    heatCapacityRatio: 1.28,
  }),
  spill: Object.freeze({ spillVolumeM3: 24.8, poolThicknessM: 0.017 }),
  plume: Object.freeze({
    massRateKgS: 0.815,
    windSpeedMS: 4.2,
    downwindDistanceM: 620,
    crosswindDistanceM: 35,
    receptorHeightM: 1.7,
    releaseHeightM: 12,
    stabilityClass: 'D',
    molarMassGMol: 34.08,
  }),
  reach: Object.freeze({
    massRateKgS: 0.815,
    windSpeedMS: 4.2,
    stabilityClass: 'E',
    targetConcentrationMgM3: 21,
    releaseHeightM: 12,
    receptorHeightM: 1.7,
  }),
});

const okLiq = success('Okan condensate line', C.liquidOrificeDischarge(OKAN.condensate));
const okGas = success('Okan gas riser', C.gasOrificeDischarge(OKAN.riser));
const okVent = success('Okan flash gas vent', C.gasOrificeDischarge(OKAN.vent));
const okPool = success('Okan deck spill', C.poolFromSpill(OKAN.spill));
const okPlume = success('Okan plume at the receptor', C.gaussianPlume(OKAN.plume));
const okReach = success('Okan plume reach', C.plumeDistanceToConcentration(OKAN.reach));

must('Okan riser: the release is choked', okGas.regime === 'CHOKED' && okGas.choked === true, okGas.regime);
must('Okan riser: the outflow coefficient is one when choked', okGas.outflowCoefficientPsi === 1, okGas.outflowCoefficientPsi);
must('Okan vent: the release is subsonic', okVent.regime === 'SUBSONIC' && okVent.choked === false, okVent.regime);
must('Okan vent: the outflow coefficient is below one', okVent.outflowCoefficientPsi < 1 && okVent.outflowCoefficientPsi > 0,
  okVent.outflowCoefficientPsi);
must('Okan: the two gas releases share a hole and a gas, so only the pressure separates them',
  okVent.holeAreaM2 === okGas.holeAreaM2 && okVent.criticalPressureRatio === okGas.criticalPressureRatio,
  `${okVent.holeAreaM2} ${okVent.criticalPressureRatio}`);
must('Okan condensate: the pressure at the hole exceeds the ullage pressure by the static head',
  okLiq.pressureAtHolePa > OKAN.condensate.pressureAboveLiquidPa, okLiq.pressureAtHolePa);
must('Okan deck spill: the pool is unconfined at the stated thickness',
  okPool.containment === 'UNCONFINED_STATED_THICKNESS', okPool.containment);
must('Okan deck spill: a bund of this floor area would overtop and be refused',
  !!C.poolFromSpill({ spillVolumeM3: OKAN.spill.spillVolumeM3, bundAreaM2: 900, bundWallHeightM: 0.02 }).error, 'refused');
must('Okan plume: the receptor is off the centreline and below the release height',
  OKAN.plume.crosswindDistanceM > 0 && OKAN.plume.receptorHeightM < OKAN.plume.releaseHeightM, 'off axis');
must('Okan plume: the concentration in ppm follows the same call as the mass concentration',
  Number.isFinite(okPlume.concentrationPpm) && okPlume.concentrationPpm > 0, okPlume.concentrationPpm);
must('Okan plume: the sigmas are inside the range the Briggs curves are quoted over, so no warning',
  okPlume.warning === undefined, String(okPlume.warning));
must('Okan reach: an elevated release gives a near root and a far root', okReach.state === 'REACHED'
  && okReach.nearDistanceM > 0 && okReach.farDistanceM > okReach.peakDistanceM,
  `${okReach.state} ${okReach.nearDistanceM} ${okReach.farDistanceM}`);
must('Okan reach: the far root is the one beyond the peak', okReach.farDistanceM > okReach.nearDistanceM,
  `${okReach.nearDistanceM} ${okReach.farDistanceM}`);

/* ========================================================= YOKRI, Professional

   A kerosene tank farm bund fire on a windy afternoon, worked through the
   solid flame model one step at a time. The pool diameter and the burning
   flux method are stated; the flame length is taken with wind, the tilt from
   the wind and the printed air viscosity, and two surface emissive powers are
   computed, one from the diameter correlation and one from the radiative
   fraction with soot. The view factor is taken to a target at ground level
   away from the pool centre, and the flux uses a STATED transmissivity, so
   the Bagster fit never carries a graded answer.
   ==================================================================== */

const YOKRI = Object.freeze({
  poolDiameterM: 31.5,
  fuel: 'kerosene',
  heatOfCombustionJKg: 43.0e6,
  windSpeed10mMS: 6.0,
  airDensityKgM3: 1.2,
  airKinematicViscosityM2S: 1.48e-5,
  radiativeFraction: 0.235,
  sootFraction: 0.8,
  targetDistanceFromCentreM: 72,
  transmissivity: 0.765,
});

const yoBurn = success('Yokri burning flux', C.poolBurningRate({
  method: 'babrauskas', fuel: YOKRI.fuel, poolDiameterM: YOKRI.poolDiameterM,
}));
const yoLen = success('Yokri flame length with wind', C.poolFireFlameLength({
  method: 'thomas-wind',
  poolDiameterM: YOKRI.poolDiameterM,
  burningFluxKgM2S: yoBurn.burningFluxKgM2S,
  airDensityKgM3: YOKRI.airDensityKgM3,
  windSpeed10mMS: YOKRI.windSpeed10mMS,
}));
const yoTilt = success('Yokri flame tilt', C.poolFireTilt({
  poolDiameterM: YOKRI.poolDiameterM,
  windSpeed10mMS: YOKRI.windSpeed10mMS,
  airKinematicViscosityM2S: YOKRI.airKinematicViscosityM2S,
}));
const yoSepD = success('Yokri surface emissive power from the diameter correlation',
  C.surfaceEmissivePower({ method: 'mudan-diameter', poolDiameterM: YOKRI.poolDiameterM }));
const yoSepA = success('Yokri actual surface emissive power with soot', C.surfaceEmissivePower({
  method: 'radiative-fraction-soot',
  poolDiameterM: YOKRI.poolDiameterM,
  radiativeFraction: YOKRI.radiativeFraction,
  burningFluxKgM2S: yoBurn.burningFluxKgM2S,
  heatOfCombustionJKg: YOKRI.heatOfCombustionJKg,
  flameLengthM: yoLen.flameLengthM,
  sootFraction: YOKRI.sootFraction,
}));
const yoVf = success('Yokri view factor at the target', C.cylinderViewFactor({
  flameRadiusM: YOKRI.poolDiameterM / 2,
  flameLengthM: yoLen.flameLengthM,
  distanceFromAxisM: YOKRI.targetDistanceFromCentreM,
  tiltDeg: yoTilt.tiltDeg,
}));
const yoFlux = success('Yokri solid flame heat flux', C.poolFireSolidFlame({
  poolDiameterM: YOKRI.poolDiameterM,
  burningFluxKgM2S: yoBurn.burningFluxKgM2S,
  heatOfCombustionJKg: YOKRI.heatOfCombustionJKg,
  flameLengthMethod: 'thomas-wind',
  airDensityKgM3: YOKRI.airDensityKgM3,
  windSpeed10mMS: YOKRI.windSpeed10mMS,
  airKinematicViscosityM2S: YOKRI.airKinematicViscosityM2S,
  sep: { method: 'radiative-fraction-soot', radiativeFraction: YOKRI.radiativeFraction, sootFraction: YOKRI.sootFraction },
  distanceFromCentreM: YOKRI.targetDistanceFromCentreM,
  transmissivity: YOKRI.transmissivity,
}));

must('Yokri: the Babrauskas flux has saturated at its own asymptote, so it is taught and never graded',
  yoBurn.burningFluxKgM2S === yoBurn.massBurningFluxInfKgM2S, yoBurn.burningFluxKgM2S);
must('Yokri: the wind exceeds the characteristic wind speed, so the scaled wind speed is above one',
  yoLen.scaledWindSpeed > 1 && YOKRI.windSpeed10mMS > yoLen.characteristicWindSpeedMS,
  `${yoLen.scaledWindSpeed} ${yoLen.characteristicWindSpeedMS}`);
must('Yokri: the flame leans well over from the vertical', yoTilt.tiltDeg > 45 && yoTilt.tiltDeg < 70, yoTilt.tiltDeg);
must('Yokri: the two surface emissive powers disagree, which is why the capstone names its method',
  Math.abs(yoSepA.surfaceEmissivePowerWM2 - yoSepD.surfaceEmissivePowerWM2) > 1e3,
  `${yoSepD.surfaceEmissivePowerWM2} ${yoSepA.surfaceEmissivePowerWM2}`);
must('Yokri: soot pulls the actual surface emissive power far below the clear flame value',
  yoSepA.surfaceEmissivePowerWM2 < yoSepA.clearFlameEmissivePowerWM2, yoSepA.clearFlameEmissivePowerWM2);
must('Yokri: the tilted flame does not reach over the target, so the closed form applies',
  1 + (yoVf.a * Math.sin((yoTilt.tiltDeg * Math.PI) / 180)) < yoVf.b, `${yoVf.a} ${yoVf.b}`);
must('Yokri: the maximum view factor is the vector sum of the vertical and horizontal ones',
  yoVf.viewFactorMax > yoVf.viewFactorVertical && yoVf.viewFactorMax > yoVf.viewFactorHorizontal,
  `${yoVf.viewFactorVertical} ${yoVf.viewFactorHorizontal} ${yoVf.viewFactorMax}`);
must('Yokri: the flux is the product of the actual surface emissive power, the maximum view factor and the stated transmissivity',
  yoFlux.surfaceEmissivePowerWM2 === yoSepA.surfaceEmissivePowerWM2
  && yoFlux.viewFactorMax === yoVf.viewFactorMax && yoFlux.transmissivity === YOKRI.transmissivity,
  `${yoFlux.surfaceEmissivePowerWM2} ${yoFlux.viewFactorMax}`);
must('Yokri: the graded flux is well below the lowest API 521 radiation level, so it is no setback answer',
  yoFlux.heatFluxWM2 < 1580, yoFlux.heatFluxWM2);

/* ======================================================== PENNINGTON, Expert

   A vapour cloud explosion at a storage terminal and the harm it and two
   other agents do. The TNT equivalent mass is STATED, because the TNT
   equivalence is a single route quantity in this engine's validation record.
   From that mass the blast field is taken forward at a distance and inverted
   for a distance at a stated overpressure. Four probits then turn doses into
   a probit value or a probability, the last on a ppm preset fed a
   concentration in mg/m3 at a stated temperature. No inverse of the normal CDF
   is graded (gradedTolerance.js says why).
   ==================================================================== */

const PENNINGTON = Object.freeze({
  tntMassKg: 2650,
  distanceM: 145,
  targetOverpressurePa: 19800,
  buildingOverpressurePa: 65000,
  thermal: Object.freeze({ coefficients: 'eisenberg', heatFluxWM2: 11900, exposureTimeS: 60 }),
  toxic: Object.freeze({ coefficients: 'lees-chlorine', concentrationPpm: 270, exposureMinutes: 20 }),
  ammonia: Object.freeze({
    coefficients: 'lees-ammonia', concentrationMgM3: 11050, exposureMinutes: 12, molarMassGMol: 17.031, temperatureK: 288.15,
  }),
});

const peBlast = success('Pennington blast at the control room', C.kinneyGrahamOverpressure({
  distanceM: PENNINGTON.distanceM, tntMassKg: PENNINGTON.tntMassKg,
}));
const peInv = success('Pennington distance for a stated overpressure', C.distanceForOverpressure({
  tntMassKg: PENNINGTON.tntMassKg, overpressurePa: PENNINGTON.targetOverpressurePa,
}));
const peOp = success('Pennington overpressure fatality probit',
  C.overpressureProbit({ overpressurePa: PENNINGTON.buildingOverpressurePa }));
const peTh = success('Pennington thermal probit', C.thermalProbit(PENNINGTON.thermal));
const peTox = success('Pennington toxic probit', C.toxicProbit(PENNINGTON.toxic));
const peLees = C.TOXIC_PROBITS[PENNINGTON.toxic.coefficients];
const peNh3 = success('Pennington ammonia probit on the ppm preset, fed mg/m3', C.toxicProbit(PENNINGTON.ammonia));

must('Pennington: the scaled distance is inside the range the fit is used over',
  peBlast.scaledDistanceMKg13 > 0.05 && peBlast.scaledDistanceMKg13 < 40, peBlast.scaledDistanceMKg13);
must('Pennington: the inverse lands nearer than the forward point, because the overpressure asked for is the higher one',
  peInv.distanceM < PENNINGTON.distanceM && PENNINGTON.targetOverpressurePa > peBlast.overpressurePa,
  `${peInv.distanceM} ${peBlast.overpressurePa}`);
must('Pennington: the inverse round trips through the forward model',
  Math.abs(C.kinneyGrahamOverpressure({ scaledDistanceMKg13: peInv.scaledDistanceMKg13 }).overpressurePa
    - PENNINGTON.targetOverpressurePa) < 1e-6 * PENNINGTON.targetOverpressurePa, 'round trip');
must('Pennington: the overpressure probit sits below five, so the probability is below a half',
  peOp.probit < 5 && peOp.probability < 0.5, `${peOp.probit} ${peOp.probability}`);
must('Pennington: the thermal probit is read at a dose in seconds and kW/m2 to the four thirds',
  peTh.doseUnit === 's (kW/m2)^(4/3)' && peTh.probit < 5, `${peTh.doseUnit} ${peTh.probit}`);
must('Pennington: Tsao and Perry would put the same thermal dose far higher',
  C.thermalProbit({ ...PENNINGTON.thermal, coefficients: 'tsao-perry' }).probit > peTh.probit + 2,
  C.thermalProbit({ ...PENNINGTON.thermal, coefficients: 'tsao-perry' }).probit);
must('Pennington: the toxic probability is in a band a learner can read to six decimals',
  peTox.probability > 0.05 && peTox.probability < 0.95, peTox.probability);
must('Pennington: the toxic preset is the ppm one, so no molar mass is needed',
  peLees.unit === 'ppm' && peTox.concentrationInPresetUnit === PENNINGTON.toxic.concentrationPpm,
  `${peLees.unit} ${peTox.concentrationInPresetUnit}`);
must('Pennington ammonia: the preset is in ppm, so the mg/m3 given is converted at the stated temperature',
  C.TOXIC_PROBITS['lees-ammonia'].unit === 'ppm'
  && Math.abs(peNh3.concentrationInPresetUnit - C.mgM3ToPpm({
    concentrationMgM3: PENNINGTON.ammonia.concentrationMgM3, molarMassGMol: 17.031, temperatureK: 288.15,
  }).concentrationPpm) === 0, peNh3.concentrationInPresetUnit);
must('Pennington ammonia: the stated temperature is not the 25 C default, so the molar volume matters',
  PENNINGTON.ammonia.temperatureK !== 298.15, PENNINGTON.ammonia.temperatureK);
must('Pennington ammonia: the probability is in a band a learner can read to six decimals',
  peNh3.probability > 0.05 && peNh3.probability < 0.95, peNh3.probability);

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'okan_condensate_leak_mass_rate_kg_s', 'kgPerS', okLiq.massRateKgS],
  ['beginner', 'okan_gas_riser_choked_mass_rate_kg_s', 'kgPerS', okGas.massRateKgS],
  ['beginner', 'okan_vent_subsonic_mass_rate_kg_s', 'kgPerS', okVent.massRateKgS],
  ['beginner', 'okan_deck_spill_equivalent_diameter_m', 'm', okPool.equivalentDiameterM],
  ['beginner', 'okan_plume_receptor_concentration_ppm', 'ppm', okPlume.concentrationPpm],
  ['beginner', 'okan_plume_far_distance_m', 'm', okReach.farDistanceM],
  ['intermediate', 'yokri_flame_length_with_wind_m', 'm', yoLen.flameLengthM],
  ['intermediate', 'yokri_flame_tilt_deg', 'deg', yoTilt.tiltDeg],
  ['intermediate', 'yokri_surface_emissive_power_mudan_w_m2', 'wPerM2', yoSepD.surfaceEmissivePowerWM2],
  ['intermediate', 'yokri_surface_emissive_power_actual_w_m2', 'wPerM2', yoSepA.surfaceEmissivePowerWM2],
  ['intermediate', 'yokri_view_factor_max', 'viewFactor', yoVf.viewFactorMax],
  ['intermediate', 'yokri_solid_flame_heat_flux_w_m2', 'wPerM2', yoFlux.heatFluxWM2],
  ['advanced', 'pennington_blast_overpressure_pa', 'pa', peBlast.overpressurePa],
  ['advanced', 'pennington_blast_distance_for_overpressure_m', 'm', peInv.distanceM],
  ['advanced', 'pennington_overpressure_fatality_probability', 'probability', peOp.probability],
  ['advanced', 'pennington_thermal_lethality_probability', 'probability', peTh.probability],
  ['advanced', 'pennington_toxic_lethality_probability', 'probability', peTox.probability],
  ['advanced', 'pennington_ammonia_lethality_probability', 'probability', peNh3.probability],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite positive number`, Number.isFinite(r.value) && r.value > 0, r.value));
// NEVER GRADE A SMALL INTEGER (kit README section 11), and never grade a value
// that PRINTS as one: every graded value must carry digits a learner reads off
// the engine, at the precision the course prints its class to.
ROWS.forEach((r) => {
  const dp = PRINTED_DECIMALS[r.cls];
  must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3, r.value.toFixed(dp));
  const digits = (r.value.toFixed(dp).split('.')[1] || '').replace(/0+$/, '');
  must(`${r.key} carries at least four printed decimal digits a learner must read`, digits.length >= 4, r.value.toFixed(dp));
});
// A value graded at an ABSOLUTE tolerance must not be so small that the
// tolerance swallows its leading digits.
ROWS.forEach((r) => must(`${r.key} is large enough for its absolute tolerance to grade it`,
  r.value > 1e4 * gradedTolerance(r.key), `${r.value} against ${gradedTolerance(r.key)}`));

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h4_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h4_capstone: ${ASSERTS.length} label-and-call and scenario assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ OKAN, YOKRI, PENNINGTON })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 48)}${pad('CLASS', 12)}${pad('VALUE', 22)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 48)}${pad(r.cls, 12)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 22)}${gradedTolerance(r.key)}\n`));
}
