// THE DISCRIMINATE SWEEP over every H4 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). The closest miss
// is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is an engine call, checked against fields.json. The
// wrong methods may use any arithmetic, because they are the mistakes a learner
// makes: the ground reflection dropped from a plume, a choked release worked
// subsonic, the two in Bernoulli lost, the still air flame height used where
// the wind form is due, a view factor taken vertical only, the Kinney and
// Graham constants as the secondary paper PRINTS them rather than as its own
// column computes them, a probit read as Phi(Y) rather than Phi(Y - 5), and a
// concentration converted through a molar volume at the wrong temperature.
//
// THE WRONG-METHOD CALCULATOR. The mutations need the models written here,
// independently of the engine, with a switch per mistake. Before it is allowed
// to produce a single wrong answer it must reproduce the ENGINE, with every
// switch off, on all eighteen routes at 1e-12 relative, and its own bisections
// must reproduce the engine's two root searches at 1e-9 relative. A calculator
// that cannot produce the right answer produces no wrong ones.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//   node discriminate.mjs --values             also print every wrong value
//
// The control multiplies every tolerance by 1e15 and must report EIGHTEEN WEAK
// ROUTES, proving the sweep reads the tolerances rather than printing a
// constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.H4_WAVE_DIR || '/root/hse-wip-consequence';
const ROOT = process.env.H4_ENGINES || '/root/wt-h4-nextgen/packages/engines';
const C = await import(`${ROOT}/engines/hse/consequence.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e15 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The scenarios come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/h4_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
const O = inp.OKAN; const Y = inp.YOKRI; const P = inp.PENNINGTON;

const G = 9.80665;
const RGAS = 8.314462618;
const ATM = 101325;
const PSI = 6894.757293168361;

/* =============================================== the wrong-method calculator */

/** Bisection on a monotone function, written here and not imported. */
const root = (f, lo, hi) => {
  let a = lo; let b = hi; let fa = f(a);
  for (let i = 0; i < 400; i += 1) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (fm === 0) return m;
    if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else { b = m; }
    if (b - a <= 1e-14 * Math.abs(m)) break;
  }
  return 0.5 * (a + b);
};

const area = (d, o = {}) => (o.radiusAsDiameter ? Math.PI * d * d : (Math.PI / 4) * d * d);

/** Bernoulli liquid outflow, YB 2.194. */
const liquid = (s, o = {}) => {
  const hydro = o.headForgotten ? 0 : s.liquidDensityKgM3 * G * s.liquidHeadM;
  const ull = o.ullageForgotten ? ATM : s.pressureAboveLiquidPa;
  const dp = o.ambientNotSubtracted ? hydro + ull : hydro + ull - ATM;
  if (o.torricelli) {
    return s.dischargeCoefficient * area(s.holeDiameterM, o) * s.liquidDensityKgM3
      * Math.sqrt(2 * G * s.liquidHeadM);
  }
  const two = o.twoDropped ? 1 : 2;
  return s.dischargeCoefficient * area(s.holeDiameterM, o) * Math.sqrt(two * dp * s.liquidDensityKgM3);
};

/** Ideal gas outflow through a hole, YB 2.22 to 2.26. */
const gas = (s, o = {}) => {
  const g = s.heatCapacityRatio;
  const rcrit = (2 / (g + 1)) ** (g / (g - 1));
  const r = ATM / s.upstreamPressurePa;
  let choked = r <= rcrit;
  if (o.criticalRatioInverted) choked = !choked;
  const psiSq = o.psiForced === 'choked' ? 1
    : (choked && !o.subsonicPsiAlways ? 1
      : (2 / (g - 1)) * ((g + 1) / 2) ** ((g + 1) / (g - 1))
        * r ** (o.psiExponentOneOverGamma ? 1 / g : 2 / g) * (1 - r ** ((g - 1) / g)));
  const psi = o.psiNotSquared ? psiSq : Math.sqrt(psiSq);
  const rho0 = ((o.densityAtAmbient ? ATM : s.upstreamPressurePa) * s.molarMassKgMol)
    / (RGAS * s.upstreamTemperatureK);
  if (o.bernoulli) {
    return s.dischargeCoefficient * area(s.holeDiameterM, o)
      * Math.sqrt(2 * (s.upstreamPressurePa - ATM) * rho0);
  }
  const gterm = o.gammaTermDropped ? 1 : Math.sqrt(g * (2 / (g + 1)) ** ((g + 1) / (g - 1)));
  return s.dischargeCoefficient * area(s.holeDiameterM, o) * psi
    * Math.sqrt(rho0 * s.upstreamPressurePa) * gterm;
};

/** Pool from a stated thickness, YB 6.65. */
const poolD = (s, o = {}) => {
  const delta = o.thicknessInMillimetres ? s.poolThicknessM * 1000 : (o.thicknessIgnored ? 1 : s.poolThicknessM);
  const a = s.spillVolumeM3 / delta;
  if (o.areaAsDiameter) return a;
  const d = Math.sqrt((o.fourDropped ? 1 : 4) * a / Math.PI);
  return o.radiusReported ? d / 2 : d;
};

const BRIGGS = {
  A: { sy1: 0.22, sy2: 0.0001, sz1: 0.2, sz2: 0, sz3: 0 },
  B: { sy1: 0.16, sy2: 0.0001, sz1: 0.12, sz2: 0, sz3: 0 },
  C: { sy1: 0.11, sy2: 0.0001, sz1: 0.08, sz2: 0.0002, sz3: -0.5 },
  D: { sy1: 0.08, sy2: 0.0001, sz1: 0.06, sz2: 0.0015, sz3: -0.5 },
  E: { sy1: 0.06, sy2: 0.0001, sz1: 0.03, sz2: 0.0003, sz3: -1 },
  F: { sy1: 0.04, sy2: 0.0001, sz1: 0.016, sz2: 0.0003, sz3: -1 },
};
const sigmas = (cls, x, o = {}) => {
  const c = BRIGGS[o.stabilityClass || cls];
  return {
    sy: (c.sy1 * x) / Math.sqrt(1 + c.sy2 * x),
    sz: c.sz1 * x * (1 + c.sz2 * x) ** c.sz3,
  };
};
/** Continuous Gaussian plume with ground reflection, kg/m3. */
const plumeKg = (s, x, o = {}) => {
  const { sy, sz } = sigmas(s.stabilityClass, x, o);
  const y = o.centrelineTaken ? 0 : (s.crosswindDistanceM || 0);
  const z = o.receptorAtGround ? 0 : (s.receptorHeightM || 0);
  const h = o.releaseHeightIgnored ? 0 : (s.releaseHeightM || 0);
  const pre = s.massRateKgS / ((o.twoPiAsPi ? Math.PI : 2 * Math.PI) * sy * sz * s.windSpeedMS);
  const img = o.reflectionDropped ? 0 : Math.exp(-((z + h) ** 2) / (2 * sz * sz));
  return pre * Math.exp(-(y * y) / (2 * sy * sy)) * (Math.exp(-((z - h) ** 2) / (2 * sz * sz)) + img);
};
const plumePpm = (s, o = {}) => {
  const mg = plumeKg(s, s.downwindDistanceM, o) * 1e6;
  const vmL = ((RGAS * (o.molarVolumeAtZeroC ? 273.15 : 298.15)) / ATM) * 1000;
  return (mg * vmL) / s.molarMassGMol;
};
/** The far root of the plume against a target concentration in mg/m3. */
const plumeFar = (s, o = {}) => {
  const conc = (x) => plumeKg({ ...s, crosswindDistanceM: 0 }, x, o) * 1e6;
  // the peak, by golden section in log x, as the engine does
  let a = Math.log(1); let b = Math.log(100000);
  const gr = (Math.sqrt(5) - 1) / 2;
  let c1 = b - gr * (b - a); let c2 = a + gr * (b - a);
  let f1 = conc(Math.exp(c1)); let f2 = conc(Math.exp(c2));
  for (let i = 0; i < 300 && b - a > 1e-12; i += 1) {
    if (f1 > f2) { b = c2; c2 = c1; f2 = f1; c1 = b - gr * (b - a); f1 = conc(Math.exp(c1)); } else { a = c1; c1 = c2; f1 = f2; c2 = a + gr * (b - a); f2 = conc(Math.exp(c2)); }
  }
  let peakX = Math.exp(0.5 * (a + b));
  if (conc(1) >= conc(peakX)) peakX = 1;
  if (o.peakReported) return peakX;
  if (o.nearRootReported) {
    if (conc(1) >= s.targetConcentrationMgM3) return NaN;
    return root((x) => conc(x) - s.targetConcentrationMgM3, 1, peakX);
  }
  if (conc(peakX) < s.targetConcentrationMgM3) return NaN;
  return root((x) => conc(x) - s.targetConcentrationMgM3, peakX, 100000);
};

/* ------------------------------------------------------------- the fire */

const burnFlux = 0.039 * (1 - Math.exp(-3.5 * Y.poolDiameterM));
const flameLen = (o = {}) => {
  const D = Y.poolDiameterM;
  const m = burnFlux;
  const rho = Y.airDensityKgM3;
  if (o.stillAir) return D * 42 * (m / (rho * Math.sqrt(G * D))) ** 0.61;
  const uc = ((G * m * D) / rho) ** (o.ucWithoutCubeRoot ? 1 : 1 / 3);
  let uStar = Math.max(1, Y.windSpeed10mMS / uc);
  if (o.windRatioInverted) uStar = Math.max(1, uc / Y.windSpeed10mMS);
  const k = o.constant50 ? 50 : 55;
  const p = o.exponent061 ? 0.61 : 0.67;
  const e = o.uStarExponentPositive ? 0.21 : -0.21;
  return D * k * (m / (rho * Math.sqrt(G * D))) ** p * uStar ** e;
};
const tiltDeg = (o = {}) => {
  const D = Y.poolDiameterM;
  const u = Y.windSpeed10mMS;
  const nu = o.printedViscosity ? 7.5133e-6 : Y.airKinematicViscosityM2S;
  const fr = o.froudeWithoutDiameter ? (u * u) / G : (u * u) / (G * D);
  const re = (u * D) / nu;
  const c = 0.666 * fr ** (o.froudeExponentHalf ? 0.5 : 0.333) * re ** (o.reynoldsExponent017 ? 0.17 : 0.117);
  if (o.tanReadAsTilt) return (Math.atan(c) * 180) / Math.PI;
  return (Math.asin((Math.sqrt(4 * c * c + 1) - 1) / (2 * c)) * 180) / Math.PI;
};
const sepMudan = (o = {}) => {
  const D = o.radiusUsed ? Y.poolDiameterM / 2 : Y.poolDiameterM;
  const k = o.exponent02 ? 0.2 : 0.12;
  const e = Math.exp((o.exponentSignFlipped ? k : -k) * D);
  if (o.sootTermDropped) return 140e3 * e;
  if (o.weightsSwapped) return 20e3 * e + 140e3 * (1 - e);
  return 140e3 * e + 20e3 * (1 - e);
};
const sepActual = (o = {}) => {
  const D = Y.poolDiameterM;
  const L = o.stillAirFlameLength ? flameLen({ stillAir: true }) : flameLen();
  const fs = o.radiativeFractionOmitted ? 1 : Y.radiativeFraction;
  const denom = 1 + (o.viewRatioWithoutFour ? 1 : 4) * (L / D);
  const sepMax = (fs * burnFlux * Y.heatOfCombustionJKg) / denom;
  if (o.clearFlameReported) return sepMax;
  const s = o.sootComplement ? 1 - Y.sootFraction : Y.sootFraction;
  const soot = o.sootEmissivePower140k ? 140e3 : 20000;
  return sepMax * (1 - s) + soot * s;
};
const viewFactors = (o = {}) => {
  const R = Y.poolDiameterM / 2;
  const L = flameLen();
  const a = L / R;
  const b = Y.targetDistanceFromCentreM / R * (o.distanceFromEdge ? (Y.targetDistanceFromCentreM - R) / Y.targetDistanceFromCentreM : 1);
  let deg = o.tiltIgnored ? 0 : tiltDeg();
  if (o.tiltSignFlipped) deg = -deg;
  const t = (deg * Math.PI) / 180;
  const s = Math.sin(t);
  const co = Math.cos(t);
  const A = Math.sqrt(a * a + (b + 1) ** 2 - 2 * a * (b + 1) * s);
  const B = Math.sqrt(a * a + (b - 1) ** 2 - 2 * a * (b - 1) * s);
  const cc = o.garbledC ? Math.sqrt(1 + (b - 1) ** 2 * co * co) : Math.sqrt(1 + (b * b - 1) * co * co);
  const DD = Math.sqrt((b - 1) / (b + 1));
  const E = (a * co) / (b - a * s);
  const F = Math.sqrt(b * b - 1);
  const arcs = Math.atan((a * b - F * F * s) / (F * cc)) + Math.atan((F * s) / cc);
  const atanADB = Math.atan((A * DD) / B);
  const fv = (-E * Math.atan(DD) + E * ((a * a + (b + 1) ** 2 - 2 * b * (1 + a * s)) / (A * B)) * atanADB
    + (co / cc) * arcs) / Math.PI;
  const fh = (Math.atan(1 / DD) + (s / cc) * arcs
    - ((a * a + (b + 1) ** 2 - 2 * (b + 1 + a * b * s)) / (A * B)) * atanADB) / Math.PI;
  return { fv, fh, fmax: Math.sqrt(fv * fv + fh * fh) };
};
const solidFlux = (o = {}) => {
  const vf = viewFactors(o);
  const f = o.verticalViewFactor ? vf.fv : vf.fmax;
  const sep = o.mudanSep ? sepMudan() : sepActual(o);
  const tau = o.transmissivityOmitted ? 1 : Y.transmissivity;
  return sep * f * tau;
};

/* ------------------------------------------------- the blast and the probits */

const kgRatio = (z, o = {}) => ((o.cbuPrinted ? 800 : 808) * (o.numeratorTermDropped ? 1 : 1 + (z / 4.5) ** 2))
  / (Math.sqrt(1 + (z / (o.cbuPrinted ? 0.049 : 0.048)) ** 2) * Math.sqrt(1 + (z / 0.32) ** 2)
    * Math.sqrt(1 + (z / (o.term135as13 ? 1.3 : 1.35)) ** 2));
const scaled = (o = {}) => P.distanceM / (o.squareRootScaling ? Math.sqrt(P.tntMassKg)
  : (o.massNotRooted ? P.tntMassKg : Math.cbrt(P.tntMassKg)));
const blastPa = (o = {}) => kgRatio(scaled(o), o) * (o.ambientNotApplied ? 1 : ATM);
const blastDistance = (o = {}) => {
  if (o.forwardNotInverted) return scaled() * Math.cbrt(P.tntMassKg);
  const target = (o.overpressureAsAbsolute ? P.targetOverpressurePa + ATM : P.targetOverpressurePa) / ATM;
  const z = root((zz) => kgRatio(zz, o) - target, 0.05, 40);
  if (o.scaledDistanceReported) return z;
  return z * (o.squareRootScaling ? Math.sqrt(P.tntMassKg) : Math.cbrt(P.tntMassKg));
};
/** Abramowitz and Stegun 7.1.26 as lib/stats states it, written out here:
 *  Phi(x) = (1 + erf(x / sqrt 2)) / 2 with the five-term rational erf. */
const ERF = (x) => {
  const s = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592)
    * t * Math.exp(-ax * ax);
  return s * y;
};
const NORM = (x) => 0.5 * (1 + ERF(x / Math.SQRT2));
const probOf = (y, o = {}) => NORM(o.phiOfY ? y : y - 5);
const overProb = (o = {}) => {
  const p = o.pressureInPa ? P.buildingOverpressurePa
    : (o.pressureInBarg ? P.buildingOverpressurePa / 1e5 : P.buildingOverpressurePa / PSI);
  const y = 1.47 + 1.37 * (o.log10 ? Math.log10(p) : Math.log(p));
  return o.probitReported ? y : probOf(y, o);
};
const THERMAL = { eisenberg: [-14.9, 2.56], 'tsao-perry': [-12.8, 2.56], lees: [-10.7, 1.99] };
const thermalY = (o = {}) => {
  const [a, b] = THERMAL[o.preset || 'eisenberg'];
  const I = o.intensityInWM2 ? P.thermal.heatFluxWM2 : P.thermal.heatFluxWM2 / 1000;
  const t = o.timeInMinutes ? P.thermal.exposureTimeS / 60 : P.thermal.exposureTimeS;
  const v = t * I ** (o.fourThirdsDropped ? 1 : 4 / 3);
  return a + b * (o.log10 ? Math.log10(v) : Math.log(v));
};
const LEES_CL = [-8.29, 0.92, 2];
const PB_CL = [-6.35, 0.5, 2.75];
const toxProb = (o = {}) => {
  const [a, b, n] = o.pbPreset ? PB_CL : LEES_CL;
  const t = o.timeInSeconds ? P.toxic.exposureMinutes * 60 : P.toxic.exposureMinutes;
  const v = P.toxic.concentrationPpm ** (o.exponentIgnored ? 1 : n) * t;
  const y = a + b * (o.log10 ? Math.log10(v) : Math.log(v));
  return probOf(y, o);
};
/* Lees ammonia, ppm and minutes (OSD/30 Table 2); PB Table 5.2 ammonia is in mg/m3. */
const LEES_NH3 = [-35.9, 1.85, 2];
const PB_NH3 = [-15.6, 1, 2];
const nh3Prob = (o = {}) => {
  const s = P.ammonia;
  const T = o.molarVolumeAt25C ? 298.15 : (o.molarVolumeAt0C ? 273.15 : s.temperatureK);
  const vm = (RGAS * T / ATM) * 1000;
  let c;
  let coef = LEES_NH3;
  if (o.pbPresetOnTheMgValue) { c = s.concentrationMgM3; coef = PB_NH3; } else if (o.mgFedAsPpm) c = s.concentrationMgM3;
  else if (o.conversionInverted) c = (s.concentrationMgM3 * s.molarMassGMol) / vm;
  else c = (s.concentrationMgM3 * vm) / s.molarMassGMol;
  const [a, b, n] = coef;
  const v = c ** (o.exponentIgnored ? 1 : n) * s.exposureMinutes;
  const y = a + b * Math.log(v);
  return probOf(y, o);
};

/* ============================================================== the routes */

const ROUTES = {
  okan_condensate_leak_mass_rate_kg_s: {
    truth: () => C.liquidOrificeDischarge(O.condensate).massRateKgS,
    mine: () => liquid(O.condensate),
    wrong: {
      static_head_forgotten: () => liquid(O.condensate, { headForgotten: true }),
      ullage_pressure_forgotten: () => liquid(O.condensate, { ullageForgotten: true }),
      ambient_not_subtracted: () => liquid(O.condensate, { ambientNotSubtracted: true }),
      the_two_dropped_from_bernoulli: () => liquid(O.condensate, { twoDropped: true }),
      hole_diameter_used_as_a_radius: () => liquid(O.condensate, { radiusAsDiameter: true }),
      torricelli_on_the_head_alone: () => liquid(O.condensate, { torricelli: true }),
    },
  },
  okan_gas_riser_choked_mass_rate_kg_s: {
    truth: () => C.gasOrificeDischarge(O.riser).massRateKgS,
    mine: () => gas(O.riser),
    wrong: {
      worked_subsonic: () => gas(O.riser, { subsonicPsiAlways: true }),
      critical_pressure_ratio_inverted: () => gas(O.riser, { criticalRatioInverted: true, subsonicPsiAlways: true }),
      density_taken_at_ambient: () => gas(O.riser, { densityAtAmbient: true }),
      the_gamma_group_dropped: () => gas(O.riser, { gammaTermDropped: true }),
      bernoulli_used_for_a_gas: () => gas(O.riser, { bernoulli: true }),
      hole_diameter_used_as_a_radius: () => gas(O.riser, { radiusAsDiameter: true }),
    },
  },
  okan_vent_subsonic_mass_rate_kg_s: {
    truth: () => C.gasOrificeDischarge(O.vent).massRateKgS,
    mine: () => gas(O.vent),
    wrong: {
      worked_choked: () => gas(O.vent, { psiForced: 'choked' }),
      psi_exponent_one_over_gamma: () => gas(O.vent, { psiExponentOneOverGamma: true }),
      psi_squared_used_as_psi: () => gas(O.vent, { psiNotSquared: true }),
      density_taken_at_ambient: () => gas(O.vent, { densityAtAmbient: true }),
      bernoulli_used_for_a_gas: () => gas(O.vent, { bernoulli: true }),
    },
  },
  okan_deck_spill_equivalent_diameter_m: {
    truth: () => C.poolFromSpill(O.spill).equivalentDiameterM,
    mine: () => poolD(O.spill),
    wrong: {
      radius_reported: () => poolD(O.spill, { radiusReported: true }),
      the_four_dropped: () => poolD(O.spill, { fourDropped: true }),
      thickness_ignored: () => poolD(O.spill, { thicknessIgnored: true }),
      area_reported_as_a_diameter: () => poolD(O.spill, { areaAsDiameter: true }),
      thickness_read_in_millimetres: () => poolD(O.spill, { thicknessInMillimetres: true }),
    },
  },
  okan_plume_receptor_concentration_ppm: {
    truth: () => C.gaussianPlume(O.plume).concentrationPpm,
    mine: () => plumePpm(O.plume),
    wrong: {
      ground_reflection_dropped: () => plumePpm(O.plume, { reflectionDropped: true }),
      read_on_the_centreline: () => plumePpm(O.plume, { centrelineTaken: true }),
      release_height_ignored: () => plumePpm(O.plume, { releaseHeightIgnored: true }),
      receptor_taken_at_ground_level: () => plumePpm(O.plume, { receptorAtGround: true }),
      two_pi_read_as_pi: () => plumePpm(O.plume, { twoPiAsPi: true }),
      molar_volume_at_zero_celsius: () => plumePpm(O.plume, { molarVolumeAtZeroC: true }),
      the_neighbouring_stability_class: () => plumePpm(O.plume, { stabilityClass: 'C' }),
    },
  },
  okan_plume_far_distance_m: {
    truth: () => C.plumeDistanceToConcentration(O.reach).farDistanceM,
    mine: () => plumeFar(O.reach),
    wrong: {
      the_near_root_reported: () => plumeFar(O.reach, { nearRootReported: true }),
      the_peak_distance_reported: () => plumeFar(O.reach, { peakReported: true }),
      ground_level_release_assumed: () => plumeFar(O.reach, { releaseHeightIgnored: true }),
      ground_reflection_dropped: () => plumeFar(O.reach, { reflectionDropped: true }),
      the_neighbouring_stability_class: () => plumeFar(O.reach, { stabilityClass: 'D' }),
      receptor_taken_at_ground_level: () => plumeFar(O.reach, { receptorAtGround: true }),
    },
  },
  yokri_flame_length_with_wind_m: {
    truth: () => C.poolFireFlameLength({
      method: 'thomas-wind',
      poolDiameterM: Y.poolDiameterM,
      burningFluxKgM2S: C.poolBurningRate({ method: 'babrauskas', fuel: Y.fuel, poolDiameterM: Y.poolDiameterM }).burningFluxKgM2S,
      airDensityKgM3: Y.airDensityKgM3,
      windSpeed10mMS: Y.windSpeed10mMS,
    }).flameLengthM,
    mine: () => flameLen(),
    wrong: {
      the_still_air_thomas_form: () => flameLen({ stillAir: true }),
      wind_ratio_inverted: () => flameLen({ windRatioInverted: true }),
      the_still_air_exponent_kept: () => flameLen({ exponent061: true }),
      characteristic_wind_speed_without_its_cube_root: () => flameLen({ ucWithoutCubeRoot: true }),
      scaled_wind_exponent_positive: () => flameLen({ uStarExponentPositive: true }),
      the_constant_read_as_fifty: () => flameLen({ constant50: true }),
    },
  },
  yokri_flame_tilt_deg: {
    truth: () => C.poolFireTilt({
      poolDiameterM: Y.poolDiameterM,
      windSpeed10mMS: Y.windSpeed10mMS,
      airKinematicViscosityM2S: Y.airKinematicViscosityM2S,
    }).tiltDeg,
    mine: () => tiltDeg(),
    wrong: {
      reynolds_exponent_read_as_point_one_seven: () => tiltDeg({ reynoldsExponent017: true }),
      froude_number_without_the_diameter: () => tiltDeg({ froudeWithoutDiameter: true }),
      the_worked_examples_printed_viscosity: () => tiltDeg({ printedViscosity: true }),
      the_tilt_parameter_read_as_a_tangent: () => tiltDeg({ tanReadAsTilt: true }),
      froude_exponent_read_as_a_half: () => tiltDeg({ froudeExponentHalf: true }),
    },
  },
  yokri_surface_emissive_power_mudan_w_m2: {
    truth: () => C.surfaceEmissivePower({ method: 'mudan-diameter', poolDiameterM: Y.poolDiameterM }).surfaceEmissivePowerWM2,
    mine: () => sepMudan(),
    wrong: {
      exponent_sign_flipped: () => sepMudan({ exponentSignFlipped: true }),
      radius_used_for_the_diameter: () => sepMudan({ radiusUsed: true }),
      the_smoky_term_dropped: () => sepMudan({ sootTermDropped: true }),
      the_two_weights_swapped: () => sepMudan({ weightsSwapped: true }),
      decay_constant_read_as_point_two: () => sepMudan({ exponent02: true }),
    },
  },
  yokri_surface_emissive_power_actual_w_m2: {
    truth: () => C.surfaceEmissivePower({
      method: 'radiative-fraction-soot',
      poolDiameterM: Y.poolDiameterM,
      radiativeFraction: Y.radiativeFraction,
      burningFluxKgM2S: C.poolBurningRate({ method: 'babrauskas', fuel: Y.fuel, poolDiameterM: Y.poolDiameterM }).burningFluxKgM2S,
      heatOfCombustionJKg: Y.heatOfCombustionJKg,
      flameLengthM: C.poolFireFlameLength({
        method: 'thomas-wind',
        poolDiameterM: Y.poolDiameterM,
        burningFluxKgM2S: C.poolBurningRate({ method: 'babrauskas', fuel: Y.fuel, poolDiameterM: Y.poolDiameterM }).burningFluxKgM2S,
        airDensityKgM3: Y.airDensityKgM3,
        windSpeed10mMS: Y.windSpeed10mMS,
      }).flameLengthM,
      sootFraction: Y.sootFraction,
    }).surfaceEmissivePowerWM2,
    mine: () => sepActual(),
    wrong: {
      the_clear_flame_value_reported: () => sepActual({ clearFlameReported: true }),
      soot_fraction_and_its_complement_swapped: () => sepActual({ sootComplement: true }),
      the_four_dropped_from_the_length_ratio: () => sepActual({ viewRatioWithoutFour: true }),
      radiative_fraction_omitted: () => sepActual({ radiativeFractionOmitted: true }),
      the_still_air_flame_length_used: () => sepActual({ stillAirFlameLength: true }),
      the_soot_emissive_power_read_as_the_clear_flame_maximum: () => sepActual({ sootEmissivePower140k: true }),
    },
  },
  yokri_view_factor_max: {
    truth: () => C.cylinderViewFactor({
      flameRadiusM: Y.poolDiameterM / 2,
      flameLengthM: C.poolFireFlameLength({
        method: 'thomas-wind',
        poolDiameterM: Y.poolDiameterM,
        burningFluxKgM2S: C.poolBurningRate({ method: 'babrauskas', fuel: Y.fuel, poolDiameterM: Y.poolDiameterM }).burningFluxKgM2S,
        airDensityKgM3: Y.airDensityKgM3,
        windSpeed10mMS: Y.windSpeed10mMS,
      }).flameLengthM,
      distanceFromAxisM: Y.targetDistanceFromCentreM,
      tiltDeg: C.poolFireTilt({
        poolDiameterM: Y.poolDiameterM,
        windSpeed10mMS: Y.windSpeed10mMS,
        airKinematicViscosityM2S: Y.airKinematicViscosityM2S,
      }).tiltDeg,
    }).viewFactorMax,
    mine: () => viewFactors().fmax,
    wrong: {
      the_vertical_view_factor_alone: () => viewFactors().fv,
      the_horizontal_view_factor_alone: () => viewFactors().fh,
      the_two_added_rather_than_squared: () => viewFactors().fv + viewFactors().fh,
      the_tilt_ignored: () => viewFactors({ tiltIgnored: true }).fmax,
      the_tilt_taken_away_from_the_target: () => viewFactors({ tiltSignFlipped: true }).fmax,
      the_garbled_c_of_the_extracted_text: () => viewFactors({ garbledC: true }).fmax,
      the_distance_taken_from_the_pool_edge: () => viewFactors({ distanceFromEdge: true }).fmax,
    },
  },
  yokri_solid_flame_heat_flux_w_m2: {
    truth: () => C.poolFireSolidFlame({
      poolDiameterM: Y.poolDiameterM,
      burningFluxKgM2S: C.poolBurningRate({ method: 'babrauskas', fuel: Y.fuel, poolDiameterM: Y.poolDiameterM }).burningFluxKgM2S,
      heatOfCombustionJKg: Y.heatOfCombustionJKg,
      flameLengthMethod: 'thomas-wind',
      airDensityKgM3: Y.airDensityKgM3,
      windSpeed10mMS: Y.windSpeed10mMS,
      airKinematicViscosityM2S: Y.airKinematicViscosityM2S,
      sep: { method: 'radiative-fraction-soot', radiativeFraction: Y.radiativeFraction, sootFraction: Y.sootFraction },
      distanceFromCentreM: Y.targetDistanceFromCentreM,
      transmissivity: Y.transmissivity,
    }).heatFluxWM2,
    mine: () => solidFlux(),
    wrong: {
      the_diameter_correlation_surface_emissive_power_used: () => solidFlux({ mudanSep: true }),
      the_vertical_view_factor_used: () => solidFlux({ verticalViewFactor: true }),
      transmissivity_omitted: () => solidFlux({ transmissivityOmitted: true }),
      the_clear_flame_surface_emissive_power_used: () => solidFlux({ clearFlameReported: true }),
      the_tilt_ignored: () => solidFlux({ tiltIgnored: true }),
      the_still_air_flame_length_used: () => solidFlux({ stillAirFlameLength: true }),
    },
  },
  pennington_blast_overpressure_pa: {
    truth: () => C.kinneyGrahamOverpressure({ distanceM: P.distanceM, tntMassKg: P.tntMassKg }).overpressurePa,
    mine: () => blastPa(),
    wrong: {
      the_papers_printed_constants: () => blastPa({ cbuPrinted: true }),
      square_root_scaling: () => blastPa({ squareRootScaling: true }),
      the_ratio_reported_as_a_pressure: () => blastPa({ ambientNotApplied: true }),
      the_charge_mass_not_cube_rooted: () => blastPa({ massNotRooted: true }),
      the_third_break_read_as_one_point_three: () => blastPa({ term135as13: true }),
      the_numerator_rise_term_dropped: () => blastPa({ numeratorTermDropped: true }),
    },
  },
  pennington_blast_distance_for_overpressure_m: {
    truth: () => C.distanceForOverpressure({ tntMassKg: P.tntMassKg, overpressurePa: P.targetOverpressurePa }).distanceM,
    mine: () => blastDistance(),
    wrong: {
      the_forward_distance_reported: () => blastDistance({ forwardNotInverted: true }),
      the_papers_printed_constants: () => blastDistance({ cbuPrinted: true }),
      square_root_scaling: () => blastDistance({ squareRootScaling: true }),
      the_target_read_as_an_absolute_pressure: () => blastDistance({ overpressureAsAbsolute: true }),
      the_scaled_distance_reported: () => blastDistance({ scaledDistanceReported: true }),
    },
  },
  pennington_overpressure_fatality_probability: {
    truth: () => C.overpressureProbit({ overpressurePa: P.buildingOverpressurePa }).probability,
    mine: () => overProb(),
    wrong: {
      phi_of_the_probit_itself: () => overProb({ phiOfY: true }),
      the_overpressure_left_in_pascals: () => overProb({ pressureInPa: true }),
      the_overpressure_read_in_bar: () => overProb({ pressureInBarg: true }),
      a_base_ten_logarithm: () => overProb({ log10: true }),
      the_probit_reported_as_a_probability: () => overProb({ probitReported: true }),
    },
  },
  pennington_thermal_lethality_probability: {
    truth: () => C.thermalProbit(P.thermal).probability,
    mine: () => probOf(thermalY()),
    wrong: {
      the_tsao_and_perry_coefficients: () => probOf(thermalY({ preset: 'tsao-perry' })),
      the_lees_coefficients: () => probOf(thermalY({ preset: 'lees' })),
      the_intensity_left_in_watts: () => probOf(thermalY({ intensityInWM2: true })),
      the_four_thirds_power_dropped: () => probOf(thermalY({ fourThirdsDropped: true })),
      a_base_ten_logarithm: () => probOf(thermalY({ log10: true })),
      the_exposure_time_in_minutes: () => probOf(thermalY({ timeInMinutes: true })),
      phi_of_the_probit_itself: () => probOf(thermalY(), { phiOfY: true }),
    },
  },
  pennington_toxic_lethality_probability: {
    truth: () => C.toxicProbit(P.toxic).probability,
    mine: () => toxProb(),
    wrong: {
      the_toxic_load_exponent_ignored: () => toxProb({ exponentIgnored: true }),
      the_exposure_time_in_seconds: () => toxProb({ timeInSeconds: true }),
      the_other_sources_coefficients_for_the_same_substance: () => toxProb({ pbPreset: true }),
      phi_of_the_probit_itself: () => toxProb({ phiOfY: true }),
      a_base_ten_logarithm: () => toxProb({ log10: true }),
    },
  },
  pennington_ammonia_lethality_probability: {
    truth: () => C.toxicProbit(P.ammonia).probability,
    mine: () => nh3Prob(),
    wrong: {
      the_mg_fed_straight_into_a_ppm_preset: () => nh3Prob({ mgFedAsPpm: true }),
      the_conversion_turned_upside_down: () => nh3Prob({ conversionInverted: true }),
      the_molar_volume_at_twenty_five_c: () => nh3Prob({ molarVolumeAt25C: true }),
      the_molar_volume_at_zero_c: () => nh3Prob({ molarVolumeAt0C: true }),
      the_other_sources_mg_coefficients: () => nh3Prob({ pbPresetOnTheMgValue: true }),
      the_toxic_load_exponent_ignored: () => nh3Prob({ exponentIgnored: true }),
      phi_of_the_probit_itself: () => nh3Prob({ phiOfY: true }),
    },
  },
};

/* The calculator proves itself on every route before it is allowed a mistake. */
let reproduced = 0;
Object.entries(ROUTES).forEach(([key, r]) => {
  const t = r.truth();
  const m = r.mine();
  const tol = /distance|far/.test(key) ? 1e-9 : 1e-12;
  if (!Number.isFinite(m) || !(Math.abs(m / t - 1) < tol)) {
    console.log(`REFUSED: the wrong-method calculator does not reproduce the engine on ${key} (${m} against ${t})`);
    process.exit(2);
  }
  reproduced += 1;
});

let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
const report = [];
console.log(`discriminate: the wrong-method calculator reproduced the engine on all ${reproduced} routes (1e-12 relative, 1e-9 on the two root searches) before it was allowed a single mistake`);
console.log('field                                                  tol        errors  moved  blind  closest miss (tolerances)');
Object.entries(ROUTES).forEach(([key, { truth, wrong }]) => {
  if (!fields[key]) { console.log(`REFUSED: ${key} is not a graded field`); process.exit(2); }
  const tol = fields[key][3];
  const t = truth();
  if (!Number.isFinite(t)) { console.log(`REFUSED: the true value of ${key} did not evaluate`); process.exit(2); }
  if (SLACK === 1 && Math.abs(t - fields[key][2]) > 1e-12 * Math.abs(t)) {
    console.log(`REFUSED: the truth route for ${key} gives ${t}, and fields.json carries ${fields[key][2]}`); process.exit(2);
  }
  const moved = []; const blind = [];
  let nearest = Infinity; let nearestName = null;
  Object.entries(wrong).forEach(([name, f]) => {
    totalWrong += 1;
    let got;
    try { got = f(); } catch (e) { got = NaN; }
    const d = Math.abs(got - t);
    if (!Number.isFinite(got) || d > tol) {
      moved.push(name);
      const ratio = Number.isFinite(got) ? d / tol : Infinity;
      if (ratio < nearest) { nearest = ratio; nearestName = name; }
      report.push({ key, name, value: got });
    } else { blind.push(`${name} (off by ${d.toExponential(3)})`); }
  });
  if (nearest < closest.ratio) closest = { key, name: nearestName, ratio: nearest };
  const isWeak = moved.length < 3 || blind.length > 0;
  if (isWeak) weak += 1;
  console.log(`${key.padEnd(54)} ${String(tol).padEnd(10)} ${String(moved.length + blind.length).padStart(6)} ${String(moved.length).padStart(6)} ${String(blind.length).padStart(6)}  ${nearest === Infinity ? 'all infinite' : nearest.toExponential(3)} (${nearestName})${isWeak ? '   WEAK' : ''}`);
  if (blind.length) console.log(`${' '.repeat(55)}BLIND TO: ${blind.join(', ')}`);
});
console.log();
console.log(`routes swept: ${Object.keys(ROUTES).length}  plausible wrong methods aimed at them: ${totalWrong}  WEAK routes: ${weak}`);
console.log(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.name}, ${closest.ratio.toExponential(3)} tolerances away`);
if (process.argv.includes('--values')) {
  report.forEach((r) => console.log(`  wrong ${r.key} ${r.name} = ${r.value}`));
}
if (Object.keys(ROUTES).length !== 18 || totalWrong < 54) {
  console.log('REFUSED: a sweep with fewer than three wrong methods a field is not a sweep');
  process.exit(2);
}
if (SLACK !== 1) {
  console.log(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
process.exit(weak ? 1 : 0);
