// Teaching lab for FC9, Corrosion & Integrity. The three panels, the course
// page and the vitest files all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINE'S OWN OUTPUT. Every fugacity
// coefficient, fugacity, reaction term, mass-transfer term, combined rate,
// scale factor, film onset, pH factor, wetting factor, wall shear, Reynolds
// number, friction factor, threshold comparison, regime word, remaining life,
// category label and binding constraint below is a return value of
// engines/facilities/corrosion.js, as repaired in FC9-0 and vendored
// sha-identical with petrolord-engines d4c19ad.
//
// NOTHING IN THIS FILE COMPUTES A CORROSION QUANTITY. Where a reader carries a
// value the teaching digest calls "derived", it is the digest's own arithmetic
// on numbers the engine returned, with the arithmetic stated: a ratio of two
// engine rates, a difference of two engine lives, a spread across a swept
// column, a mils-a-year conversion of an engine rate. The lab and
// tools/course-waves/corrosion/digest.txt agree because both call the engine on
// the same inputs, and neither copied the other.
//
// CONSTANTS ARE MEASURED, NEVER TYPED. Every held constant this lab reports is
// recovered by asking the engine a question whose answer is that constant and
// nothing else: a slope solved from two calls, a cap or a threshold or a band
// bisected on the flag or the WORD the engine returns. A constant written as a
// literal here would be a claim about the engine rather than a reading of it.
// The one place literals appear is `PIN_LITERALS`, which is the third location
// the digest pins each measurement against, and it says so in its own comment.
//
// THIS COURSE GRADES NO CORROSION RATE. Eleven items in this engine have no
// source anywhere in the repository and one sour-service severity region was
// WITHDRAWN rather than retuned. `heldItems()` is the reader for all of them
// and every panel shows it. No rate the correlation produced, no category word,
// no threshold verdict, no regime and no material is a graded answer anywhere
// in this course.
//
// THIS LAB HOLDS NO GRADING TOLERANCE. The tolerance of every graded field is
// made in exactly one place, gradedTolerance.js, and written out of that one
// derivation into fields.json and precision.json. This module imports
// `GRADED_FIELDS` for the published ORDER and the quantity CLASS of each field
// and never reads its stated tolerance, so there is no second copy here to go
// stale. Three sibling waves shipped a stale third copy of a tolerance table
// and one of them removed the class rather than the instance.
//
// UNITS. The engine's own correlation units throughout: temperature in degrees
// Celsius, pressures in bar, rates in millimetres a year, velocity in metres a
// second, diameter in metres, density in kilograms a cubic metre, viscosity in
// pascal seconds, wall shear in pascals, allowances in millimetres and lives in
// years. Percentages and percentage points are plain numbers, and so is every
// dimensionless ratio. Mils a year appears beside millimetres a year where the
// studio prints both.
//
// NO P LABEL. Nothing in this course is a distribution, so no P label
// belongs anywhere in it.
//
// THE CLOCK. Nothing in this domain reads a clock or a random number. There is
// no date input, no seed and no default that falls back to today, so every
// reader is a pure function of its engine inputs. A clock gate in
// corrosionLab.test.js proves it under two faked system dates, and a timezone
// gate rebuilds the whole digest a second time west of Greenwich.
//
// REPAIR HISTORY. Digest section 25 is the one framed history section and
// `repairHistory()` is the reader for it. Section 2, the withdrawal, is NOT
// history: the absence is current, permanent and declared, and the engine
// returns `regionProvided` false and `materialGuidanceProvided` false today.
// The counting rule for the engine's own past-tense comment lines lives here as
// `HISTORY_COMMENT_RE` and `countHistoryComments`; the read of the vendored
// source is the test's, because a browser module cannot read a file.
//
// PURITY. Every reader is pure and deterministic, and every one returns a fresh
// object. Nothing is memoised.

import corrosionGolden from '@petrolord/engines/test-data/facilities/goldens/corrosion_cases.json';
// A namespace import rather than named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which predate FC1-0
// and carry no engines/facilities at all. Vite and vitest alias
// @petrolord/engines to this worktree's packages/engines, which does.
// import/namespace still checks members against the shared copy, so it is off
// for this file only; corrosionLab.test.js proves every member resolves.
/* eslint-disable import/namespace */
import * as C from '@petrolord/engines/engines/facilities/corrosion.js';
import { GRADED_FIELDS } from './gradedTolerance.js';

export const GOLD = corrosionGolden;

/** The published case counts, so a golden that loses a block is caught. */
export const goldenCounts = () => ({
  blocks: Object.keys(GOLD).length,
  rows: Object.entries(GOLD).reduce((a, [, v]) => a + (Array.isArray(v) ? v.length : 1), 0),
  cases: GOLD.cases.length,
  categoryRows: GOLD.categoryRows.length,
  refusals: GOLD.refusals.length,
  heldConstants: Object.keys(GOLD.heldConstants).length,
});

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a corrosion quantity.
// ---------------------------------------------------------------------------

/** A state the engine has no answer for, returned rather than thrown. */
const softOf = (r) => (r && r.error ? r.error : null);

/** A refusal reported as the digest reports one: a label and the engine's message. */
export const probeRefusal = (label, r) => ({ label, error: softOf(r), keys: r && typeof r === 'object' ? Object.keys(r) : [] });

/**
 * ONE BISECTION ROUTINE, and it bisects on a PREDICATE THE ENGINE ANSWERS
 * rather than on a formula. A bracket whose two ends give the same verdict
 * proves nothing, so it returns NaN there and the caller's finiteness check
 * fails loudly. 300 rounds takes a double to its last bit.
 */
export const bisect = (lo, hi, pred) => {
  let a = lo; let b = hi;
  const pa = pred(a);
  if (pa === pred(b)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pa) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
  }
  return (a + b) / 2;
};

/** Two linear equations in two unknowns, for recovering a fit from two points. */
const solve2 = ([a1, b1, c1], [a2, b2, c2]) => {
  const det = a1 * b2 - a2 * b1;
  return [(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det];
};

/** Agreement with a golden row is a RESULT WITH A SIZE, never an identity. */
export const relDiff = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);

const deepFreeze = (o) => {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o);
    Object.values(o).forEach(deepFreeze);
  }
  return o;
};

// ---------------------------------------------------------------------------
// THE TEACHING STREAMS, copied VERBATIM from
// tools/course-waves/corrosion/fc9_fields.mjs, which fc9_dump.mjs imports. The
// lab test compares each declaration with the wave file text and fails on any
// drift, so these cannot be edited here alone.
//
// These are NOT the capstone plants. The capstone runs three different lines at
// conditions that share nothing with these, and the capstone guard proves both
// directions.
// ---------------------------------------------------------------------------

/** ETELEBOU: a water-wet oil line below the film onset. The base case. */
export const ETELEBOU = Object.freeze({
  tC: 58.2, pTotalBar: 46.7, co2MolFrac: 0.0182, h2sMolFrac: 0.00006,
  ph: 4.9, velocityMS: 2.6, diameterM: 0.1778, densityKgM3: 882.4, viscosityPaS: 0.0013,
  flowRegime: 'waterWet', waterCutFrac: 1,
  inhibitorEfficiencyPct: 0, inhibitorAvailabilityPct: 100,
});

/** KANBI: hot enough that the protective film IS credited, so the scale factor
 *  is below one and the onset the engine computes is below the temperature. */
export const KANBI = Object.freeze({
  tC: 119.4, pTotalBar: 63.9, co2MolFrac: 0.0246, h2sMolFrac: 0.00011,
  ph: 5.3, velocityMS: 1.9, diameterM: 0.2032, densityKgM3: 848.1, viscosityPaS: 0.0009,
  flowRegime: 'waterWet', waterCutFrac: 1,
  inhibitorEfficiencyPct: 0, inhibitorAvailabilityPct: 100,
});

/** TUNU: fast in a small line, so the wall shear is above the film-stripping
 *  threshold and `screen` removes the corrosion inhibitor credit. */
export const TUNU = Object.freeze({
  tC: 52.7, pTotalBar: 71.3, co2MolFrac: 0.0308, h2sMolFrac: 0.00022,
  ph: 4.4, velocityMS: 16.8, diameterM: 0.0762, densityKgM3: 913.6, viscosityPaS: 0.0011,
  flowRegime: 'waterWet', waterCutFrac: 1,
  inhibitorEfficiencyPct: 82, inhibitorAvailabilityPct: 96,
});

/** OPUKUSHI: an intermittently wetted line, so the water cut is the wetting
 *  factor rather than being inert. */
export const OPUKUSHI = Object.freeze({
  tC: 61.9, pTotalBar: 38.4, co2MolFrac: 0.0159, h2sMolFrac: 0.00004,
  ph: 5.1, velocityMS: 1.4, diameterM: 0.2540, densityKgM3: 869.7, viscosityPaS: 0.0016,
  flowRegime: 'intermittent', waterCutFrac: 0.37,
  inhibitorEfficiencyPct: 74, inhibitorAvailabilityPct: 89,
});

/** DIEBU: sour enough that the H2S to CO2 ratio reaches the SULPHIDE regime, so
 *  the category and the life are withheld and the rate is an upper bound. */
export const DIEBU = Object.freeze({
  tC: 66.3, pTotalBar: 84.2, co2MolFrac: 0.0121, h2sMolFrac: 0.0017,
  ph: 4.7, velocityMS: 3.2, diameterM: 0.1524, densityKgM3: 896.2, viscosityPaS: 0.0012,
  flowRegime: 'waterWet', waterCutFrac: 1,
  inhibitorEfficiencyPct: 88, inhibitorAvailabilityPct: 93,
});

/** ANGIAMA: viscous, small and slow, so the Reynolds number falls on the
 *  LAMINAR side of the friction-factor switch. */
export const ANGIAMA = Object.freeze({
  tC: 44.8, pTotalBar: 22.6, co2MolFrac: 0.0093, h2sMolFrac: 0.00002,
  ph: 5.6, velocityMS: 0.06, diameterM: 0.0508, densityKgM3: 941.3, viscosityPaS: 0.85,
  flowRegime: 'waterWet', waterCutFrac: 1,
  inhibitorEfficiencyPct: 0, inhibitorAvailabilityPct: 100,
});

/** The allowance question each stream is asked, in mm and years. */
export const INTEGRITY = Object.freeze({
  corrosionAllowanceMm: 3.175, consumedMm: 0.4, designLifeYears: 20,
});

/** Velocity sweeps, in m/s, wide enough to cross the film-stripping shear. */
export const VELOCITY_SWEEP = Object.freeze([0.5, 1, 2, 4, 8, 12, 18, 25]);
/** Temperature sweep, in C, crossing the computed film onset. */
export const TEMPERATURE_SWEEP = Object.freeze([40, 55, 70, 85, 100, 115, 130, 150]);
/** pH sweep, from the reference upward, plus the refusals below it. */
export const PH_SWEEP = Object.freeze([4.0, 4.5, 5.0, 5.5, 6.0, 7.0, 8.0, 9.0]);
export const PH_REFUSALS = Object.freeze([2.0, 3.0, 3.5, 3.9999]);
/** Corrosion inhibitor availability sweep at one efficiency, in percent. */
export const AVAILABILITY_SWEEP = Object.freeze([100, 98, 95, 90, 80, 70, 50, 25]);
/** Total pressures, straddling the fugacity cap. */
export const PRESSURE_SWEEP = Object.freeze([1, 10, 50, 100, 200, 249, 250, 251, 400]);
/** Diameters, in m, for the mass-transfer power law. */
export const DIAMETER_SWEEP = Object.freeze([0.0508, 0.1016, 0.2032, 0.4064]);
/** fCO2 values, in bar, for the film onset. */
export const FCO2_SWEEP = Object.freeze([0.05, 0.2, 1, 2, 5, 20, 60]);
/** H2S to CO2 mole-fraction pairs, reaching all four regime answers. */
export const REGIME_PAIRS = Object.freeze([
  [0.02, 0.00001], [0.02, 0.00003], [0.02, 0.0002], [0.02, 0.0008],
  [0.02, 0.0012], [0.02, 0.006], [0.02, 0.02], [0, 0.001],
]);
/** Rates, in mm/yr, either side of every category band. */
export const CATEGORY_PROBES = Object.freeze([0, 0.05, 0.0999, 0.1, 0.1001, 0.4999, 0.5, 0.5001, 0.9999, 1, 1.0001, 4.2]);
/** The corrosion inhibitor pairs a clamp is reached with, as [efficiency, availability]. */
export const CLAMP_PROBES = Object.freeze([[-5, 90], [120, 90], [90, 130]]);

/**
 * THE SHIPPED DEFAULTS of the live studio, in the engine's units. The stated
 * conversions are the studio's own: (140 - 32)/1.8, (725 + 14.7)/14.5038,
 * 10 * 0.3048, 6 * 0.0254, 56 * 16.0185, 1 * 1e-3, 0.125 * 25.4. Section 24 is
 * about the one of them that is truncated.
 */
export const APP = Object.freeze({
  tC: (140 - 32) / 1.8, pTotalBar: (725 + 14.7) / 14.5038,
  co2MolFrac: 3 / 100, h2sMolFrac: 0.1 / 100, ph: 4.5,
  velocityMS: 10 * 0.3048, diameterM: 6 * 0.0254,
  densityKgM3: 56 * 16.0185, viscosityPaS: 1 * 1e-3,
  flowRegime: 'waterWet', waterCutFrac: 100 / 100,
  inhibitorEfficiencyPct: 90, inhibitorAvailabilityPct: 95,
  corrosionAllowanceMm: 0.125 * 25.4, consumedMm: 0, designLifeYears: 20,
});

/** The studio's field-unit defaults as a user types them, beside the engine value. */
export const APP_AS_TYPED = Object.freeze([
  ['temperature', '140 F', 'tC'], ['pressure', '725 psig', 'pTotalBar'],
  ['CO2', '3 mol%', 'co2MolFrac'], ['H2S', '0.1 mol%', 'h2sMolFrac'],
  ['in-situ pH', '4.5', 'ph'], ['velocity', '10 ft/s', 'velocityMS'],
  ['line inside diameter', '6 in', 'diameterM'], ['density', '56 lb/ft3', 'densityKgM3'],
  ['viscosity', '1 cp', 'viscosityPaS'], ['wetting regime', 'water wet', 'flowRegime'],
  ['water cut', '100 percent', 'waterCutFrac'], ['inhibitor efficiency', '90 percent', 'inhibitorEfficiencyPct'],
  ['inhibitor availability', '95 percent', 'inhibitorAvailabilityPct'],
  ['corrosion allowance', '0.125 in', 'corrosionAllowanceMm'],
  ['consumed', '0 in', 'consumedMm'], ['design life', '20 yr', 'designLifeYears'],
]);

/** The studio's own truncated psig divisor. Section 24 measures what it costs. */
export const STUDIO_PSIA_DIVISOR = 14.5038;
/** The psia figure an old hint claimed the sour threshold was. It is not. */
export const CLAIMED_SOUR_PSIA = 0.05;
/** The mils-a-year conversion, stated rather than assumed. */
export const mpy = (mmYr) => (mmYr / 25.4) * 1000;

// ---------------------------------------------------------------------------
// THE MEASUREMENTS. Taken once at module load, deterministically, so every
// reader quotes a measured constant rather than a typed one. Each one states
// the arguments it passes, because a sibling wave found four of its own
// measurements wrong for running at the engine's defaults rather than at the
// unit values the recipe assumed.
// ---------------------------------------------------------------------------

const frictionAt = (re) => C.wallShearStressPa({
  velocityMS: re * 1e-5, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001,
});
const shearAtVelocity = (u) => C.wallShearStressPa({
  velocityMS: u, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001,
});

const measureAll = () => {
  // the fugacity coefficient: log10(a)/P is linear in 1/T, so two temperatures
  // solve for both constants. Arguments stated: 10 bar, at 20 C and at 180 C.
  const at = (tC) => {
    const a = C.co2FugacityCoefficient({ tC, pTotalBar: 10 });
    return [1, -1 / (tC + 273.15), Math.log10(a) / 10];
  };
  const [fugA, fugB] = solve2(at(20), at(180));

  // the fugacity CAP, bisected on where the coefficient stops moving, at 60 C.
  // The predicate is EQUALITY with the capped value. An inequality does not
  // straddle: above the cap the coefficient is held flat.
  const fugCap = bisect(100, 400,
    (p) => C.co2FugacityCoefficient({ tC: 60, pTotalBar: p })
      === C.co2FugacityCoefficient({ tC: 60, pTotalBar: 400 }));

  // the de Waard-Milliams reaction constants: log10 Vr is linear in 1/T and in
  // log10 fCO2, so three points solve for all three.
  const lgR = (tC, f) => Math.log10(C.dwmReactionRate({ tC, fco2Bar: f }));
  const dwmN = (lgR(60, 10) - lgR(60, 1)) / (Math.log10(10) - Math.log10(1));
  const dwmB = -(lgR(180, 1) - lgR(20, 1)) / (1 / (180 + 273.15) - 1 / (20 + 273.15));
  const dwmA = lgR(60, 1) + dwmB / (60 + 273.15);

  // the mass-transfer constants: the doubling ratios in U and in d give the
  // exponents, and the unit call gives the coefficient.
  const vm = (u, d, f) => C.dwmMassTransferRate({ velocityMS: u, diameterM: d, fco2Bar: f });
  const vmUExp = Math.log2(vm(2, 1, 1) / vm(1, 1, 1));
  const vmDExp = -Math.log2(vm(1, 2, 1) / vm(1, 1, 1));
  const vmC = vm(1, 1, 1);
  const vmFExp = Math.log2(vm(1, 1, 2) / vm(1, 1, 1));

  // the scale-factor constants, measured where the factor is UNCLAMPED, which
  // is the trap: below the onset the engine returns exactly 1 and every slope
  // measured there is zero. Arguments stated: 150 C and 200 C at fCO2 1 and 10.
  const lgS = (tC, f) => Math.log10(C.scaleFactor({ tC, fco2Bar: f }));
  const scaleA = (lgS(150, 1) - lgS(200, 1)) / (1 / (150 + 273.15) - 1 / (200 + 273.15));
  const scaleC = -(lgS(150, 1) - scaleA / (150 + 273.15));
  const scaleN = -(lgS(150, 10) - lgS(150, 1)) / (Math.log10(10) - Math.log10(1));
  const scaleUnclamped = C.scaleFactor({ tC: 150, fco2Bar: 1 }) < 1 && C.scaleFactor({ tC: 200, fco2Bar: 1 }) < 1;
  const scaleClampedBelow = C.scaleFactor({ tC: 40, fco2Bar: 1 }) === 1 && C.scaleFactor({ tC: 50, fco2Bar: 1 }) === 1;

  // the pH slope and the reference.
  const phSlope = Math.log10(C.phFactor({ ph: 7 }).factor / C.phFactor({ ph: 5 }).factor) / 2;
  const phRef = bisect(1, 8, (p) => C.phFactor({ ph: p }).error !== undefined);

  // the Blasius pair, the laminar constant and the branch switch, from the
  // friction factor the shear door returns. Density 1000, diameter 0.1,
  // viscosity 0.001, so the velocity that reaches a Reynolds number is Re * 1e-5.
  const blasiusN = Math.log(frictionAt(8e5).fanningFriction / frictionAt(2e5).fanningFriction) / Math.log(8e5 / 2e5);
  const blasiusC = frictionAt(2e5).fanningFriction / (2e5 ** blasiusN);
  const laminarC = frictionAt(1500).fanningFriction * 1500;
  const switchRe = bisect(1000, 20000, (re) => frictionAt(re).flowRegime === 'turbulent');
  const switchJump = frictionAt(switchRe * 1.0001).tauPa / frictionAt(switchRe * 0.9999).tauPa;

  // the film thresholds, bisected on the risk WORD the engine returns.
  const filmStripU = bisect(0.1, 40, (u) => shearAtVelocity(u).filmRisk === 'high');
  const filmModerateU = bisect(0.1, 40, (u) => shearAtVelocity(u).filmRisk !== 'low');
  const filmStrip = shearAtVelocity(filmStripU).tauPa;
  const filmModerate = shearAtVelocity(filmModerateU).tauPa;

  // the sour threshold, bisected on the sour FLAG, and its psia value.
  const sourBar = bisect(1e-6, 1, (p) => C.sourServiceScreen({ ph2sBar: p }).sour === true);
  const sourPsia = C.sourServiceScreen({ ph2sBar: sourBar }).ph2sPsia;
  const barPsia = C.sourServiceScreen({ ph2sBar: 1 }).ph2sPsia;

  // the regime boundaries, bisected on the regime WORD at pco2 1 bar.
  const regCarb = bisect(1e-6, 1, (r) => C.corrosionRegime({ ph2sBar: r, pco2Bar: 1 }).regime !== 'carbonate');
  const regMixed = bisect(1e-6, 1, (r) => C.corrosionRegime({ ph2sBar: r, pco2Bar: 1 }).regime === 'sulphide');

  // the category bands, bisected on the category WORD.
  const catLow = bisect(1e-6, 1, (r) => C.rateCategory(r) !== 'low');
  const catMod = bisect(0.2, 0.9, (r) => C.rateCategory(r) !== 'moderate');
  const catHigh = bisect(0.6, 3, (r) => C.rateCategory(r) !== 'high');

  // the controlling-word reporting margin, bisected on the word itself: hold the
  // reaction term fixed, solve the velocity that puts the transport term a
  // stated ratio above it, and read the word back.
  const ctrlBase = {
    tC: 60, pTotalBar: 50, co2MolFrac: 0.02, ph: 4.5, diameterM: 0.15, flowRegime: 'waterWet',
  };
  const ctrlMargin = bisect(1, 3, (m) => {
    const fco2 = C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: 0.02 }).fco2Bar;
    const vr = C.dwmReactionRate({ tC: 60, fco2Bar: fco2 });
    const u = ((m * vr) / (2.45 * fco2) * ctrlBase.diameterM ** 0.2) ** (1 / 0.8);
    return C.corrosionRate({ ...ctrlBase, velocityMS: u }).controlling !== 'comparable';
  }) - 1;

  // the corrosion inhibitor shortfall trigger, bisected on the warning
  // appearing: at efficiency 50 the shortfall is 50 (1 - a/100).
  const shortBase = {
    tC: 60, pTotalBar: 50, co2MolFrac: 0.02, ph: 4.5, velocityMS: 3, diameterM: 0.15, flowRegime: 'waterWet',
  };
  const shortAvail = bisect(99.9999, 90, (av) => C.corrosionRate({
    ...shortBase, inhibitorEfficiencyPct: 50, inhibitorAvailabilityPct: av,
  }).warning !== null);
  const shortfallTrigger = 50 * (1 - shortAvail / 100);

  return {
    fugA,
    fugB,
    fugCap,
    dwmA,
    dwmB,
    dwmN,
    vmC,
    vmUExp,
    vmDExp,
    vmFExp,
    scaleA,
    scaleC,
    scaleN,
    scaleUnclamped,
    scaleClampedBelow,
    phSlope,
    phRef,
    blasiusN,
    blasiusC,
    laminarC,
    switchRe,
    switchJump,
    filmStrip,
    filmModerate,
    filmStripU,
    filmModerateU,
    sourBar,
    sourPsia,
    barPsia,
    regCarb,
    regMixed,
    catLow,
    catMod,
    catHigh,
    ctrlMargin,
    shortfallTrigger,
  };
};

/** Every held constant, measured out of the engine's behaviour. */
export const MEASURED = deepFreeze(measureAll());

/**
 * THE THIRD LOCATION, and the only literals in this file.
 *
 * A constant that lives in the engine and in the oracle cannot be validated by
 * comparing the engine with the oracle: a paired battery proved it, with
 * fifteen of seventeen constants moved in both files at once leaving the suite
 * green. So the digest compares each MEASUREMENT against a literal typed here,
 * which is neither the engine nor the golden, and the golden's own
 * `heldConstants` block is a fourth. These are pins and not teaching values:
 * every one of them is HELD FOR LITERATURE and none is graded anywhere.
 */
export const PIN_LITERALS = Object.freeze([
  ['the fugacity coefficient constant A', 'fugA', 0.0031, 1e-9],
  ['the fugacity coefficient constant B', 'fugB', 1.4, 1e-9],
  ['the fugacity pressure cap, bar', 'fugCap', 250, 1e-12],
  ['the reaction constant A', 'dwmA', 4.93, 1e-9],
  ['the reaction constant B', 'dwmB', 1119, 1e-9],
  ['the reaction fugacity exponent', 'dwmN', 0.58, 1e-9],
  ['the mass-transfer coefficient', 'vmC', 2.45, 1e-12],
  ['the mass-transfer velocity exponent', 'vmUExp', 0.8, 1e-12],
  ['the mass-transfer diameter exponent', 'vmDExp', 0.2, 1e-12],
  ['the mass-transfer fugacity exponent, which is exactly one', 'vmFExp', 1, 1e-12],
  ['the scale constant A', 'scaleA', 2400, 1e-9],
  ['the scale constant C', 'scaleC', 6.7, 1e-9],
  ['the scale fugacity exponent', 'scaleN', 0.6, 1e-9],
  ['the pH slope', 'phSlope', -0.5, 1e-12],
  ['the pH reference', 'phRef', 4, 1e-12],
  ['the Blasius exponent', 'blasiusN', -0.2, 1e-9],
  ['the Blasius coefficient', 'blasiusC', 0.046, 1e-9],
  ['the laminar constant', 'laminarC', 16, 1e-12],
  ['the friction branch switch Reynolds number', 'switchRe', 4000, 1e-12],
  ['the film-stripping threshold, Pa', 'filmStrip', 100, 1e-9],
  ['the moderate band, Pa', 'filmModerate', 50, 1e-9],
  ['the sour screening threshold, bar', 'sourBar', 0.0035, 1e-9],
  ['the bar to psia factor', 'barPsia', 14.503773800721815, 1e-15],
  ['the carbonate boundary as an H2S to CO2 ratio', 'regCarb', 1 / 500, 1e-12],
  ['the mixed boundary as an H2S to CO2 ratio', 'regMixed', 1 / 20, 1e-12],
  ['the low category band, mm/yr', 'catLow', 0.1, 1e-12],
  ['the moderate category band, mm/yr', 'catMod', 0.5, 1e-12],
  ['the high category band, mm/yr', 'catHigh', 1, 1e-12],
  ['the controlling reporting margin', 'ctrlMargin', 0.1, 1e-9],
  ['the inhibitor shortfall trigger, percentage points', 'shortfallTrigger', 0.1, 1e-6],
]);

/** How each pinned constant was measured, one clause a constant. */
export const PIN_METHOD = Object.freeze({
  'the fugacity coefficient constant A': 'log10 of the coefficient divided by the pressure is linear in the reciprocal temperature, so 20 C and 180 C at 10 bar solve for both constants',
  'the fugacity coefficient constant B': 'the same pair',
  'the fugacity pressure cap, bar': 'bisected on the pressure at which the coefficient stops moving, at 60 C',
  'the reaction constant A': 'log10 of the reaction rate at fCO2 1 bar and 60 C, with the B term removed',
  'the reaction constant B': 'the slope of log10 of the reaction rate against the reciprocal temperature, 20 C against 180 C at fCO2 1 bar',
  'the reaction fugacity exponent': 'the slope of log10 of the reaction rate against log10 fCO2, 1 bar against 10 bar at 60 C',
  'the mass-transfer coefficient': 'the mass-transfer rate at velocity 1, diameter 1 and fCO2 1, where every power is unity',
  'the mass-transfer velocity exponent': 'the base-two log of the doubling ratio in velocity, at diameter 1 and fCO2 1',
  'the mass-transfer diameter exponent': 'the negative base-two log of the doubling ratio in diameter, at velocity 1 and fCO2 1',
  'the mass-transfer fugacity exponent, which is exactly one': 'the base-two log of the doubling ratio in fCO2, which is a PROPERTY and not a typed constant: the term is exactly linear in fugacity',
  'the scale constant A': 'the slope of log10 of the scale factor against the reciprocal temperature at 150 C and 200 C, WHERE THE FACTOR IS UNCLAMPED. Below the onset the engine returns exactly 1 and this slope would be zero',
  'the scale constant C': 'the same pair, with the A term removed',
  'the scale fugacity exponent': 'the slope of log10 of the scale factor against log10 fCO2 at 150 C, again above the onset',
  'the pH slope': 'log10 of the ratio of the factors at pH 5 and pH 7, over two pH units',
  'the pH reference': 'bisected on the pH at which the engine stops returning a factor and starts returning a refusal',
  'the Blasius exponent': 'the log ratio of the friction factor at Reynolds 200000 and 800000',
  'the Blasius coefficient': 'the friction factor at Reynolds 200000 with the measured exponent removed',
  'the laminar constant': 'the friction factor times the Reynolds number, at Reynolds 1500',
  'the friction branch switch Reynolds number': 'bisected on the branch NAME the engine returns',
  'the film-stripping threshold, Pa': 'the velocity at which the risk word turns high is bisected, and the shear is read there',
  'the moderate band, Pa': 'the velocity at which the risk word leaves low is bisected, and the shear is read there',
  'the sour screening threshold, bar': 'bisected on the sour flag',
  'the bar to psia factor': 'the psia value the engine reports for a partial pressure of exactly 1 bar',
  'the carbonate boundary as an H2S to CO2 ratio': 'bisected on the regime WORD at a CO2 partial pressure of 1 bar',
  'the mixed boundary as an H2S to CO2 ratio': 'bisected on the regime WORD at the same CO2 partial pressure',
  'the low category band, mm/yr': 'bisected on the category WORD',
  'the moderate category band, mm/yr': 'bisected on the category WORD',
  'the high category band, mm/yr': 'bisected on the category WORD',
  'the controlling reporting margin': 'the velocity that puts the mass-transfer term a stated ratio above the reaction term is solved, and the word the engine returns is bisected on that ratio',
  'the inhibitor shortfall trigger, percentage points': 'at a 50 percent efficiency the availability at which the warning first appears is bisected, and the shortfall it corresponds to is derived from it',
});

/** Which engine EXPORT declares each measured constant, where one does. */
export const EXPORT_PINS = Object.freeze([
  ['BAR_TO_PSIA', 'barPsia'],
  ['FUGACITY_CAP_BAR', 'fugCap'],
  ['PH_REFERENCE', 'phRef'],
  ['FILM_STRIP_PA', 'filmStrip'],
  ['FILM_MODERATE_PA', 'filmModerate'],
  ['SHEAR_SWITCH_RE', 'switchRe'],
  ['SOUR_THRESHOLD_BAR', 'sourBar'],
  ['SOUR_THRESHOLD_PSIA', 'sourPsia'],
  ['REGIME_CARBONATE_MAX', 'regCarb'],
  ['REGIME_MIXED_MAX', 'regMixed'],
  ['CONTROLLING_MARGIN', 'ctrlMargin'],
  ['INHIBITOR_SHORTFALL_PP', 'shortfallTrigger'],
  ['RATE_CATEGORY_BANDS.low', 'catLow'],
  ['RATE_CATEGORY_BANDS.moderate', 'catMod'],
  ['RATE_CATEGORY_BANDS.high', 'catHigh'],
]);

/** The engine's declared value of an export named in EXPORT_PINS. */
const exportedValue = (name) => (name.startsWith('RATE_CATEGORY_BANDS.')
  ? C.RATE_CATEGORY_BANDS[name.split('.')[1]]
  : C[name]);

/** Which golden `heldConstants` key each measurement is cross-pinned against. */
export const GOLDEN_PINS = Object.freeze([
  ['fugacityA', 'fugA'], ['fugacityB', 'fugB'], ['fugacityCapBar', 'fugCap'],
  ['dwmA', 'dwmA'], ['dwmB', 'dwmB'], ['dwmN', 'dwmN'],
  ['vmC', 'vmC'], ['vmUExp', 'vmUExp'], ['vmDExp', 'vmDExp'],
  ['scaleA', 'scaleA'], ['scaleC', 'scaleC'], ['scaleN', 'scaleN'],
  ['phSlope', 'phSlope'], ['phReference', 'phRef'],
  ['blasiusC', 'blasiusC'], ['blasiusN', 'blasiusN'], ['laminarC', 'laminarC'],
  ['switchRe', 'switchRe'], ['filmStripPa', 'filmStrip'], ['filmModeratePa', 'filmModerate'],
  ['sourThresholdBar', 'sourBar'], ['barToPsia', 'barPsia'],
  ['regimeCarbonateMax', 'regCarb'], ['regimeMixedMax', 'regMixed'],
  ['categoryLow', 'catLow'], ['categoryModerate', 'catMod'], ['categoryHigh', 'catHigh'],
  ['controllingMargin', 'ctrlMargin'],
]);

// ---------------------------------------------------------------------------
// The stream runs, once per call, so every reader quotes the same objects.
// ---------------------------------------------------------------------------

const screenOf = (s) => C.screen({ ...s, ...INTEGRITY });
const appScreen = () => C.screen(APP);

/** The six teaching streams, each with its whole screening. */
export const streams = () => [
  ['Etelebou', { ...ETELEBOU }, screenOf(ETELEBOU)],
  ['Kanbi', { ...KANBI }, screenOf(KANBI)],
  ['Tunu', { ...TUNU }, screenOf(TUNU)],
  ['Opukushi', { ...OPUKUSHI }, screenOf(OPUKUSHI)],
  ['Diebu', { ...DIEBU }, screenOf(DIEBU)],
  ['Angiama', { ...ANGIAMA }, screenOf(ANGIAMA)],
];

/** The six branches the streams exist to reach, measured rather than claimed. */
export const streamBranches = () => {
  const [et, ka, tu, op, di, an] = streams().map(([, , s]) => s);
  return {
    etelebouScaleFactor: et.rate.scaleFactor,
    kanbiScaleFactor: ka.rate.scaleFactor,
    tunuFilmStripped: tu.filmStripped,
    opukushiWettingFactor: op.rate.waterWettingFactor,
    diebuRegime: di.regime.regime,
    angiamaBranch: an.shear.flowRegime,
    diebuCategory: di.category,
    diebuLife: di.life,
    distinctBindings: [...new Set(streams().map(([, , s]) => s.binding.what))].sort(),
  };
};

// ---------------------------------------------------------------------------
// THE SECTION READERS. One per digest section, in the digest's order.
// ---------------------------------------------------------------------------

/**
 * The fourteen doors of this engine, with what each returns and what it needs.
 * The names are asserted against the module's own exports by `doorCensus`, so a
 * renamed door fails here rather than being described by a stale row.
 */
export const ENGINE_DOORS = Object.freeze([
  ['co2FugacityCoefficient', 'the fugacity coefficient of CO2, a bare number', 'a temperature and a total pressure'],
  ['co2Fugacity', 'the CO2 partial pressure, the coefficient, the fugacity and whether the pressure cap was applied', 'a temperature, a total pressure and a CO2 mole fraction'],
  ['dwmReactionRate', 'the reaction rate term in mm/yr, a bare number', 'a temperature and a CO2 fugacity'],
  ['dwmMassTransferRate', 'the mass-transfer rate term in mm/yr, a bare number', 'a velocity, a diameter and a CO2 fugacity'],
  ['scaleFactor', 'the protective-film multiplier, clamped at 1', 'a temperature and a CO2 fugacity'],
  ['scaleOnsetTC', 'the temperature at which that multiplier leaves 1', 'a CO2 fugacity'],
  ['phFactor', 'the pH multiplier and the reference it is taken against, or a refusal', 'an in-situ pH'],
  ['corrosionRate', 'the whole rate with every factor reported separately', 'the conditions, the wetting regime and the corrosion inhibitor programme'],
  ['wallShearStressPa', 'the Reynolds number, the friction branch, the friction factor, the wall shear and a film-risk word', 'a velocity, a diameter, a density and a viscosity'],
  ['sourServiceScreen', 'the H2S partial pressure in bar and psia, the threshold in both, and whether the stream is above it', 'an H2S partial pressure'],
  ['corrosionRegime', 'which corrosion product governs, and whether the CO2 rate model applies at all', 'the H2S and CO2 partial pressures'],
  ['remainingLife', 'the remaining allowance, the remaining years, the allowance a target life demands and the shortfall', 'a rate, an allowance, a consumed depth and optionally a design life'],
  ['rateCategory', 'a band label, and nothing else', 'a rate in mm/yr'],
  ['screen', 'all of the above reconciled, plus a BINDING CONSTRAINT and a withheld block', 'everything'],
]);

/** Every door named above, with what the module actually exports under it. */
export const doorCensus = () => ENGINE_DOORS.map(([name]) => ({ name, kind: typeof C[name] }));

/** Section 1. What this engine computes, and what it refuses to compute. */
export const engineScope = () => ({
  doors: ENGINE_DOORS.map((r) => [...r]),
  census: doorCensus(),
  notProvided: [...C.NOT_PROVIDED],
  notProvidedCount: C.NOT_PROVIDED.length,
  heldCount: C.HELD_FOR_LITERATURE.length,
});

/** Section 2. THE WITHDRAWAL, as the engine states it today. */
export const theWithdrawal = () => {
  const { sour } = appScreen();
  return {
    ph2sBar: sour.ph2sBar,
    ph2sPsia: sour.ph2sPsia,
    thresholdBar: sour.thresholdBar,
    thresholdPsia: sour.thresholdPsia,
    thresholdHeld: sour.thresholdHeld,
    sour: sour.sour,
    decadesAboveThreshold: sour.decadesAboveThreshold,
    regionProvided: sour.regionProvided,
    materialGuidanceProvided: sour.materialGuidanceProvided,
    label: sour.label,
    regionFunctionKind: typeof C.sourServiceRegion,
  };
};

/** The three withdrawn guidance strings and the withdrawn function name, as
 *  ABSENCES to search the engine source for. None may appear. */
export const WITHDRAWN_STRINGS = Object.freeze([
  'Most carbon steels qualified to MR0175 are acceptable with hardness control',
  'Carbon steel needs hardness and heat-treatment control; qualify weldments explicitly',
  'qualified CRA or fully qualified low-alloy steel with documented testing',
  'sourServiceRegion',
]);

/** The two standard names, which may appear in a comment and in no line of code. */
export const STANDARD_NAMES = Object.freeze(['MR0175', '15156']);

/** Three whole screenings serialised, so a sweep can prove no returned string
 *  anywhere in them names either standard. */
export const screenTextForStandardSweep = () => JSON.stringify(appScreen())
  + JSON.stringify(screenOf(DIEBU))
  + JSON.stringify(C.screen({ ...APP, h2sMolFrac: 0.01 }));

/** Section 3. The numbers this module stands on, measured and pinned. */
export const heldConstantsTable = () => {
  const pins = PIN_LITERALS.map(([label, key, literal]) => {
    const measuredValue = MEASURED[key];
    return {
      label, key, measuredValue, literal, rel: relDiff(measuredValue, literal), how: PIN_METHOD[label],
    };
  });
  const exportRows = EXPORT_PINS.map(([name, key]) => ({
    name, exported: exportedValue(name), measuredValue: MEASURED[key], rel: relDiff(exportedValue(name), MEASURED[key]),
  }));
  const goldRows = GOLDEN_PINS.map(([goldKey, key]) => ({
    goldKey,
    goldValue: GOLD.heldConstants[goldKey],
    measuredValue: MEASURED[key],
    present: Object.prototype.hasOwnProperty.call(GOLD.heldConstants, goldKey),
    rel: relDiff(MEASURED[key], GOLD.heldConstants[goldKey]),
  }));
  const barWouldBe = CLAIMED_SOUR_PSIA / MEASURED.barPsia;
  return {
    pins,
    exportRows,
    goldRows,
    goldenHeldKeys: Object.keys(GOLD.heldConstants).length,
    sourPsia: MEASURED.sourPsia,
    sourBar: MEASURED.sourBar,
    claimedSourPsiaAsBar: barWouldBe,
    // The gap between the two, as a fraction of THE SMALLER. Section 24 computes
    // a different relationship for the same pair, against the threshold the
    // engine actually uses, and the two figures are not interchangeable.
    gapPctOfSmaller: (Math.abs(MEASURED.sourBar - barWouldBe) / barWouldBe) * 100,
    claimedIsNotThreshold: Math.abs(MEASURED.sourPsia - CLAIMED_SOUR_PSIA) / CLAIMED_SOUR_PSIA > 1e-3,
  };
};

/** Section 4. CO2 partial pressure, CO2 fugacity, and the difference. */
export const fugacityAndPartialPressure = () => {
  const ap = appScreen();
  const sweep = PRESSURE_SWEEP.map((p) => {
    const f = C.co2Fugacity({ tC: 60, pTotalBar: p, co2MolFrac: 0.03 });
    return {
      pTotalBar: p,
      fugacityCoefficient: f.fugacityCoefficient,
      pco2Bar: f.pco2Bar,
      fco2Bar: f.fco2Bar,
      pressureCapApplied: f.pressureCapApplied,
      hasNote: typeof f.note === 'string',
    };
  });
  const capLo = C.co2Fugacity({ tC: 60, pTotalBar: MEASURED.fugCap - 1, co2MolFrac: 0.03 });
  const capHi = C.co2Fugacity({ tC: 60, pTotalBar: MEASURED.fugCap + 150, co2MolFrac: 0.03 });
  const refusals = [
    ['a non-finite temperature', C.co2Fugacity({ tC: NaN, pTotalBar: 50, co2MolFrac: 0.03 })],
    ['a temperature at absolute zero', C.co2Fugacity({ tC: -273.15, pTotalBar: 50, co2MolFrac: 0.03 })],
    ['a temperature below absolute zero', C.co2Fugacity({ tC: -300, pTotalBar: 50, co2MolFrac: 0.03 })],
    ['a zero total pressure', C.co2Fugacity({ tC: 60, pTotalBar: 0, co2MolFrac: 0.03 })],
    ['a blank CO2 mole fraction', C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: undefined })],
    ['a CO2 mole fraction of 3, meaning 300 mol percent', C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: 3 })],
  ].map(([label, r]) => probeRefusal(label, r));
  return {
    appPco2Bar: ap.rate.pco2Bar,
    appCoefficient: ap.rate.fugacityCoefficient,
    appFco2Bar: ap.rate.fco2Bar,
    ph2sFugacityApplied: ap.ph2sFugacityApplied,
    sweep,
    capBar: MEASURED.fugCap,
    belowCapBar: MEASURED.fugCap - 1,
    aboveCapBar: MEASURED.fugCap + 150,
    belowCapCoefficient: capLo.fugacityCoefficient,
    aboveCapCoefficient: capHi.fugacityCoefficient,
    belowCapApplied: capLo.pressureCapApplied,
    aboveCapApplied: capHi.pressureCapApplied,
    capNote: capHi.note,
    refusals,
    coefficientBelowAbsoluteZero: C.co2FugacityCoefficient({ tC: -300, pTotalBar: 50 }),
  };
};

/** Section 5. Two resistances in series, and which one holds the rate back. */
export const twoResistances = () => {
  const rows = streams().map(([name, , s]) => {
    const r = s.rate;
    const smaller = Math.min(r.reactionMmYr, r.massTransferMmYr);
    return {
      name,
      reactionMmYr: r.reactionMmYr,
      massTransferMmYr: r.massTransferMmYr,
      combinedMmYr: r.combinedMmYr,
      combinedOverSmaller: r.combinedMmYr / smaller,
      controlling: r.controlling,
      controllingMargin: r.controllingMargin,
      belowBoth: r.combinedMmYr < r.reactionMmYr && r.combinedMmYr < r.massTransferMmYr,
      seriesResidual: 1 / r.combinedMmYr - 1 / r.reactionMmYr - 1 / r.massTransferMmYr,
    };
  });
  const powerLaw = DIAMETER_SWEEP.map((d) => {
    const v = (u) => C.dwmMassTransferRate({ velocityMS: u, diameterM: d, fco2Bar: 1.5 });
    const r1 = v(1); const r2 = v(2); const r4v = v(4);
    return {
      diameterM: d, at1: r1, at2: r2, ratioOne: r2 / r1, at4: r4v, ratioTwo: r4v / r2,
    };
  });
  const missing = [
    ['a blank velocity', C.dwmMassTransferRate({ diameterM: 0.15, fco2Bar: 1.5 })],
    ['a blank diameter', C.dwmMassTransferRate({ velocityMS: 3, fco2Bar: 1.5 })],
    ['a zero velocity', C.dwmMassTransferRate({ velocityMS: 0, diameterM: 0.15, fco2Bar: 1.5 })],
    ['a negative diameter', C.dwmMassTransferRate({ velocityMS: 3, diameterM: -0.15, fco2Bar: 1.5 })],
  ].map(([label, v]) => ({ label, value: v, isNaN: Number.isNaN(v) }));
  return {
    rows,
    controllingMargin: MEASURED.ctrlMargin,
    controllingMarginPct: MEASURED.ctrlMargin * 100,
    powerLaw,
    velocityExponent: MEASURED.vmUExp,
    diameterExponent: MEASURED.vmDExp,
    missing,
  };
};

/** Section 6. The protective film, and an onset temperature that MOVES. */
export const protectiveFilm = () => {
  const ap = appScreen();
  const onsets = FCO2_SWEEP.map((f) => {
    const on = C.scaleOnsetTC({ fco2Bar: f });
    return {
      fco2Bar: f,
      onsetC: on,
      at60: C.scaleFactor({ tC: 60, fco2Bar: f }),
      atOnset: C.scaleFactor({ tC: on, fco2Bar: f }),
      above: C.scaleFactor({ tC: on + 20, fco2Bar: f }),
    };
  });
  const onsetValues = onsets.map((o) => o.onsetC);
  const temperatureRows = TEMPERATURE_SWEEP.map((t) => {
    const r = C.corrosionRate({ ...KANBI, tC: t });
    return {
      tC: t, scaleFactor: r.scaleFactor, rateMmYr: r.rateMmYr, credited: r.scaleFactor < 1,
    };
  });
  const [et, ka] = streams().map(([, , s]) => s);
  const scaleOneStreams = streams().filter(([, , s]) => s.rate.scaleFactor === 1).map(([nm]) => nm);
  return {
    onsets,
    onsetSpreadC: Math.max(...onsetValues) - Math.min(...onsetValues),
    appFco2Bar: ap.rate.fco2Bar,
    appOnsetC: ap.rate.scaleOnsetTC,
    appTC: APP.tC,
    appScaleFactor: ap.rate.scaleFactor,
    temperatureRows,
    kanbiTC: KANBI.tC,
    kanbiFco2Bar: ka.rate.fco2Bar,
    kanbiOnsetC: ka.rate.scaleOnsetTC,
    kanbiScaleFactor: ka.rate.scaleFactor,
    etelebouTC: ETELEBOU.tC,
    etelebouFco2Bar: et.rate.fco2Bar,
    etelebouOnsetC: et.rate.scaleOnsetTC,
    etelebouScaleFactor: et.rate.scaleFactor,
    scaleOneStreams,
  };
};

/** Section 7. pH, the reference it is taken against, and the refusal below it. */
export const phAndItsReference = () => {
  const refFactor = C.phFactor({ ph: MEASURED.phRef }).factor;
  const rows = PH_SWEEP.map((p) => {
    const f = C.phFactor({ ph: p });
    const r = C.corrosionRate({ ...ETELEBOU, ph: p });
    return {
      ph: p, factor: f.factor, relativeToReference: f.factor / refFactor, rateMmYr: r.rateMmYr,
    };
  });
  const rates = rows.map((r) => r.rateMmYr);
  const decade = PH_SWEEP.filter((p) => PH_SWEEP.includes(p + 2))
    .map((p) => ({ ph: p, ratio: C.phFactor({ ph: p + 2 }).factor / C.phFactor({ ph: p }).factor }));
  const refusals = PH_REFUSALS.map((p) => {
    const r = C.phFactor({ ph: p });
    return {
      ph: p, error: r.error, phReference: r.phReference, namesReference: r.error.includes(String(MEASURED.phRef)),
    };
  });
  const rangeRefusals = [-1, 14.5].map((p) => ({ ph: p, error: C.phFactor({ ph: p }).error }));
  return {
    phReference: MEASURED.phRef,
    referenceFactor: refFactor,
    rows,
    monotonic: rates.every((v, i) => i === 0 || v < rates[i - 1]),
    firstRateMmYr: rates[0],
    lastRateMmYr: rates[rates.length - 1],
    firstPh: PH_SWEEP[0],
    lastPh: PH_SWEEP[PH_SWEEP.length - 1],
    spanFactor: rates[0] / rates[rates.length - 1],
    decade,
    refusals,
    boundaryMessage: C.phFactor({ ph: 3.5 }).error,
    rangeRefusals,
    blankMessage: C.phFactor({ ph: undefined }).error,
  };
};

/** Section 8. Water wetting, and the largest single lever in this model. */
export const waterWetting = () => {
  const regimes = [['waterWet', 1], ['intermittent', OPUKUSHI.waterCutFrac], ['oilWet', 0]].map(([reg, expected]) => {
    const s = C.screen({
      ...ETELEBOU, flowRegime: reg, waterCutFrac: OPUKUSHI.waterCutFrac, ...INTEGRITY,
    });
    return {
      regime: reg,
      expectedFactor: expected,
      waterWettingFactor: s.rate.waterWettingFactor,
      rateMmYr: s.rate.rateMmYr,
      category: s.category,
      remainingYears: s.life ? s.life.remainingYears : null,
      why: s.withheld ? s.withheld.why : 'the model applies',
    };
  });
  const oilWet = C.screen({ ...ETELEBOU, flowRegime: 'oilWet', ...INTEGRITY });
  const accepted = ['oilWet', 'OILWET', 'oil-wet', 'Oil Wet', 'oil_wet'].map((s) => ({
    typed: s, resolved: C.corrosionRate({ ...ETELEBOU, flowRegime: s }).flowRegime,
  }));
  const rejected = ['wet', 'waterwette', '', 'gasWet'].map((s) => ({
    typed: s, error: C.corrosionRate({ ...ETELEBOU, flowRegime: s }).error,
  }));
  const cuts = [['waterWet', 0.37], ['intermittent', 0], ['intermittent', 0.37], ['intermittent', 1]].map(([reg, wc]) => {
    const r = C.corrosionRate({ ...ETELEBOU, flowRegime: reg, waterCutFrac: wc });
    return {
      regime: reg, waterCutFrac: wc, waterWettingFactor: r.waterWettingFactor, rateMmYr: r.rateMmYr,
    };
  });
  const cutRefusals = [
    ['intermittent', 5, 'a water cut of 500 percent'],
    ['intermittent', -0.1, 'a negative water cut'],
    ['intermittent', NaN, 'a water cut that is not a number'],
  ].map(([reg, wc, label]) => ({
    regime: reg, waterCutFrac: wc, label, error: C.corrosionRate({ ...ETELEBOU, flowRegime: reg, waterCutFrac: wc }).error,
  }));
  const omitted = C.corrosionRate({ ...ETELEBOU, flowRegime: 'intermittent' });
  return {
    regimes,
    oilWetWhy: oilWet.withheld.why,
    oilWetEffectiveInhibitionPct: oilWet.rate.effectiveInhibitionPct,
    accepted,
    rejected,
    cuts,
    cutRefusals,
    omittedWettingFactor: omitted.waterWettingFactor,
    omittedRateMmYr: omitted.rateMmYr,
  };
};

/** Section 9. The corrosion inhibitor, and the arithmetic that surprises people. */
export const inhibitorArithmetic = () => {
  const datasheet = C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 95, inhibitorAvailabilityPct: 100 });
  const rows = AVAILABILITY_SWEEP.map((a) => {
    const r = C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 95, inhibitorAvailabilityPct: a });
    return {
      efficiencyPct: 95,
      availabilityPct: a,
      effectiveInhibitionPct: r.effectiveInhibitionPct,
      inhibitorShortfallPp: r.inhibitorShortfallPp,
      rateMmYr: r.rateMmYr,
      metalLossRatio: r.rateMmYr / datasheet.rateMmYr,
    };
  });
  const eighty = C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 95, inhibitorAvailabilityPct: 80 });
  const clamps = CLAMP_PROBES.map(([eff, avail]) => {
    const r = C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: eff, inhibitorAvailabilityPct: avail });
    return {
      efficiencyPct: eff,
      availabilityPct: avail,
      effectiveInhibitionPct: r.effectiveInhibitionPct,
      clamps: [...r.clamps],
    };
  });
  const hundred = C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 100, inhibitorAvailabilityPct: 95 });
  const ap = appScreen();
  return {
    rows,
    eightyEffectivePct: eighty.effectiveInhibitionPct,
    eightyShortfallPp: eighty.inhibitorShortfallPp,
    eightyMetalLossRatio: eighty.rateMmYr / datasheet.rateMmYr,
    eightyWarning: eighty.warning,
    shortfallTriggerPp: MEASURED.shortfallTrigger,
    appEffectivePct: ap.rate.effectiveInhibitionPct,
    appShortfallPp: ap.rate.inhibitorShortfallPp,
    appWarningPresent: typeof ap.rate.warning === 'string' && ap.rate.warning.length > 0,
    clamps,
    hundredEffectivePct: hundred.effectiveInhibitionPct,
    hundredNote: hundred.note,
  };
};

/** Section 10. Wall shear, the friction branch, and a reported discontinuity. */
export const wallShear = () => {
  const streamRows = streams().map(([name, , s]) => ({
    name,
    reynolds: s.shear.reynolds,
    branch: s.shear.flowRegime,
    fanningFriction: s.shear.fanningFriction,
    tauPa: s.shear.tauPa,
    filmRisk: s.shear.filmRisk,
  }));
  const velocityRows = VELOCITY_SWEEP.map((u) => {
    const s = C.screen({ ...TUNU, velocityMS: u, ...INTEGRITY });
    return {
      velocityMS: u,
      reynolds: s.shear.reynolds,
      branch: s.shear.flowRegime,
      tauPa: s.shear.tauPa,
      filmRisk: s.shear.filmRisk,
      creditRemoved: s.filmStripped,
    };
  });
  const stripU = bisect(0.5, 30, (u) => C.screen({ ...TUNU, velocityMS: u, ...INTEGRITY }).filmStripped === true);
  const stripTau = C.screen({ ...TUNU, velocityMS: stripU, ...INTEGRITY }).shear.tauPa;
  const branchRows = [2000, 3600, 3960, MEASURED.switchRe, 4040, 4400, 8000].map((re) => {
    const s = frictionAt(re);
    return {
      reynolds: s.reynolds,
      branch: s.flowRegime,
      fanningFriction: s.fanningFriction,
      tauPa: s.tauPa,
      nearSwitch: s.nearSwitch,
    };
  });
  const near = frictionAt(MEASURED.switchRe * 1.02);
  const angiama = screenOf(ANGIAMA);
  const refusals = [
    ['a blank velocity', { diameterM: 0.15, densityKgM3: 900, viscosityPaS: 0.001 }],
    ['a blank diameter', { velocityMS: 3, densityKgM3: 900, viscosityPaS: 0.001 }],
    ['a blank density', { velocityMS: 3, diameterM: 0.15, viscosityPaS: 0.001 }],
    ['a blank viscosity', { velocityMS: 3, diameterM: 0.15, densityKgM3: 900 }],
    ['a zero viscosity', { velocityMS: 3, diameterM: 0.15, densityKgM3: 900, viscosityPaS: 0 }],
  ].map(([label, arg]) => probeRefusal(label, C.wallShearStressPa(arg)));
  return {
    streamRows,
    velocityRows,
    strippingVelocityMS: stripU,
    strippingTauPa: stripTau,
    filmStripPa: MEASURED.filmStrip,
    switchRe: MEASURED.switchRe,
    switchJump: MEASURED.switchJump,
    branchRows,
    nearSwitchFlag: near.nearSwitch,
    nearSwitchNote: near.note,
    angiama: {
      reynolds: angiama.shear.reynolds,
      branch: angiama.shear.flowRegime,
      fanningFriction: angiama.shear.fanningFriction,
      tauPa: angiama.shear.tauPa,
      filmRisk: angiama.shear.filmRisk,
    },
    refusals,
  };
};

/** Section 11. THE COUPLING. The shear verdict acts on the rate. */
export const theCoupling = () => {
  const rows = streams().map(([name, s, sc]) => {
    const kept = C.corrosionRate({ ...s, inhibitorFilmIntact: true });
    const keptLife = kept.rateMmYr > 0 ? C.remainingLife({ ...INTEGRITY, rateMmYr: kept.rateMmYr }) : null;
    return {
      name,
      filmStripped: sc.filmStripped,
      rateMmYr: sc.rate.rateMmYr,
      rateWithCreditMmYr: sc.rateWithFilmCreditMmYr,
      ratio: sc.rate.rateMmYr / sc.rateWithFilmCreditMmYr,
      lifeYr: sc.life ? sc.life.remainingYears : null,
      lifeWithCreditYr: keptLife ? keptLife.remainingYears : null,
    };
  });
  const tunu = screenOf(TUNU);
  const retained = 1 - (TUNU.inhibitorAvailabilityPct / 100) * (TUNU.inhibitorEfficiencyPct / 100);
  const blanks = [
    ['the density', { ...TUNU, densityKgM3: undefined }],
    ['the viscosity', { ...TUNU, viscosityPaS: undefined }],
    ['the velocity', { ...TUNU, velocityMS: undefined }],
    ['the line inside diameter', { ...TUNU, diameterM: undefined }],
  ].map(([label, arg]) => probeRefusal(label, C.screen({ ...arg, ...INTEGRITY })));
  return {
    rows,
    tunuRatio: tunu.rate.rateMmYr / tunu.rateWithFilmCreditMmYr,
    reciprocalOfRetained: 1 / retained,
    tunuWarning: tunu.rate.warning,
    tunuBindingWhy: tunu.binding.why,
    blanks,
  };
};

/** Section 12. H2S, a threshold comparison, and nothing more. */
export const h2sThreshold = () => {
  const probes = [1e-5, 1e-4, MEASURED.sourBar * 0.999, MEASURED.sourBar, MEASURED.sourBar * 1.001, 0.01, 0.1, 1, 10];
  const rows = probes.map((p) => {
    const s = C.sourServiceScreen({ ph2sBar: p });
    return {
      ph2sBar: p,
      ph2sPsia: s.ph2sPsia,
      sour: s.sour,
      decadesAboveThreshold: s.decadesAboveThreshold,
      label: s.label,
    };
  });
  const zero = C.sourServiceScreen({ ph2sBar: 0 });
  const refusals = [
    ['a blank H2S partial pressure', C.sourServiceScreen({ ph2sBar: undefined })],
    ['a negative H2S partial pressure', C.sourServiceScreen({ ph2sBar: -0.01 })],
  ].map(([label, r]) => probeRefusal(label, r));
  return {
    rows,
    zeroDecades: zero.decadesAboveThreshold,
    zeroSour: zero.sour,
    thresholdHeld: zero.thresholdHeld,
    thresholdBar: MEASURED.sourBar,
    thresholdPsia: MEASURED.sourPsia,
    aboveNote: C.sourServiceScreen({ ph2sBar: 0.05 }).note,
    refusals,
  };
};

/** Section 13. Which film governs, from a ratio that needs no pressure at all. */
export const whichFilmGoverns = () => {
  const pressureFree = [10, 50, 137.4, 250, 400].map((p) => {
    const co2 = 0.02; const h2s = 0.0008;
    const f = C.co2Fugacity({ tC: 60, pTotalBar: p, co2MolFrac: co2 });
    const g = C.corrosionRegime({ ph2sBar: p * h2s, pco2Bar: f.pco2Bar });
    return {
      pTotalBar: p,
      co2MolFrac: co2,
      h2sMolFrac: h2s,
      ratioFromPartials: g.ratio,
      ratioFromMoles: h2s / co2,
      difference: Math.abs(g.ratio - h2s / co2),
    };
  });
  const regimeRows = REGIME_PAIRS.map(([co2, h2s]) => {
    const p = 60;
    const pco2 = co2 > 0 ? C.co2Fugacity({ tC: 60, pTotalBar: p, co2MolFrac: co2 }).pco2Bar : 0;
    const g = C.corrosionRegime({ ph2sBar: p * h2s, pco2Bar: pco2 });
    return {
      co2MolFrac: co2,
      h2sMolFrac: h2s,
      ratio: g.ratio,
      regime: g.regime,
      rateApplies: g.rateApplies,
      rateIsUpperBound: !!g.rateIsUpperBound,
      note: g.note,
    };
  });
  const unknowns = [
    ['a zero CO2 partial pressure', { ph2sBar: 0.06, pco2Bar: 0 }],
    ['a blank CO2 partial pressure', { ph2sBar: 0.06, pco2Bar: undefined }],
    ['a blank H2S partial pressure', { ph2sBar: undefined, pco2Bar: 1.2 }],
  ].map(([label, arg]) => {
    const g = C.corrosionRegime(arg);
    return { label, regime: g.regime, note: g.note };
  });
  const diebu = screenOf(DIEBU);
  const mixed = C.corrosionRegime({
    ph2sBar: 60 * 0.0008,
    pco2Bar: C.co2Fugacity({ tC: 60, pTotalBar: 60, co2MolFrac: 0.02 }).pco2Bar,
  });
  return {
    pressureFree,
    regimeRows,
    regimeWords: [...new Set(regimeRows.map((r) => r.regime))].sort(),
    carbonateBoundary: MEASURED.regCarb,
    mixedBoundary: MEASURED.regMixed,
    unknowns,
    diebuRatio: diebu.regime.ratio,
    diebuRegime: diebu.regime.regime,
    diebuCategory: diebu.category,
    diebuLife: diebu.life,
    diebuUpperBoundMmYr: diebu.withheld.upperBoundMmYr,
    diebuWhy: diebu.withheld.why,
    mixedIsUpperBound: mixed.rateIsUpperBound,
    mixedApplies: mixed.rateApplies,
    mixedNote: mixed.note,
  };
};

/** Section 14. The allowance, the remaining life, and a zero rate. */
export const allowanceAndLife = () => {
  const rows = streams().map(([name, , s]) => {
    if (!s.life) {
      return {
        name, rateMmYr: s.rate.rateMmYr, withheld: true,
      };
    }
    return {
      name,
      rateMmYr: s.rate.rateMmYr,
      withheld: false,
      remainingMm: s.life.remainingMm,
      remainingYears: s.life.remainingYears,
      requiredAllowanceMm: s.life.requiredAllowanceMm,
      shortfallMm: s.life.shortfallMm,
      meetsDesignLife: s.life.meetsDesignLife,
      remainingMatchesArithmetic: Math.abs(
        s.life.remainingMm - (INTEGRITY.corrosionAllowanceMm - INTEGRITY.consumedMm),
      ) < 1e-12,
    };
  });
  const worked = C.remainingLife({
    rateMmYr: 0.25, corrosionAllowanceMm: 4, consumedMm: 1.2, designLifeYears: 20,
  });
  const reinstate = bisect(1, 30, (ca) => C.remainingLife({
    rateMmYr: 0.25, corrosionAllowanceMm: ca, consumedMm: 1.2, designLifeYears: 20,
  }).meetsDesignLife === true);
  const zero = C.remainingLife({
    rateMmYr: 0, corrosionAllowanceMm: 3.175, consumedMm: 0, designLifeYears: 20,
  });
  const refusals = [
    ['a blank allowance', { rateMmYr: 0.3, consumedMm: 0, designLifeYears: 20 }],
    ['a zero allowance', {
      rateMmYr: 0.3, corrosionAllowanceMm: 0, consumedMm: 0, designLifeYears: 20,
    }],
    ['a negative consumed depth', {
      rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: -1, designLifeYears: 20,
    }],
    ['a negative rate', {
      rateMmYr: -0.3, corrosionAllowanceMm: 4, consumedMm: 0, designLifeYears: 20,
    }],
    ['a blank rate', { corrosionAllowanceMm: 4, consumedMm: 0, designLifeYears: 20 }],
    ['a design life that is not a number', {
      rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 0, designLifeYears: NaN,
    }],
    ['an allowance already fully consumed', {
      rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 4, designLifeYears: 20,
    }],
    ['an allowance consumed past its own depth', {
      rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 5, designLifeYears: 20,
    }],
  ].map(([label, arg]) => probeRefusal(label, C.remainingLife(arg)));
  const noDesignLife = C.remainingLife({ rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 0 });
  return {
    allowanceMm: INTEGRITY.corrosionAllowanceMm,
    consumedMm: INTEGRITY.consumedMm,
    rows,
    workedRequiredAllowanceMm: worked.requiredAllowanceMm,
    workedRemainingMm: worked.remainingMm,
    workedShortfallMm: worked.shortfallMm,
    reinstatingAllowanceMm: reinstate,
    reinstateGapIsConsumed: Math.abs((reinstate - worked.requiredAllowanceMm) - 1.2) < 1e-9,
    zeroRemainingYears: zero.remainingYears,
    zeroMeetsDesignLife: zero.meetsDesignLife,
    zeroUnbounded: zero.unbounded,
    zeroNote: zero.note,
    goldenZeroRemainingYears: GOLD.lifeZeroRate.remainingYears,
    goldenZeroUnbounded: GOLD.lifeZeroRate.unbounded,
    goldenZeroMeetsDesignLife: GOLD.lifeZeroRate.meetsDesignLife,
    refusals,
    noDesignLifeRemainingYears: noDesignLife.remainingYears,
    noDesignLifeMeets: noDesignLife.meetsDesignLife,
    noDesignLifeRequiredAllowanceMm: noDesignLife.requiredAllowanceMm,
    noDesignLifeShortfallMm: noDesignLife.shortfallMm,
  };
};

/** Section 15. The rate category is a LABEL, and the label is held. */
export const rateCategoryLabel = () => {
  const ap = appScreen();
  const goldenFinite = GOLD.categoryRows.filter((r) => Number.isFinite(r.rateMmYr));
  const zeroRow = goldenFinite.find((r) => r.rateMmYr === 0);
  const tinyRow = goldenFinite.filter((r) => r.rateMmYr > 0).sort((a, b) => a.rateMmYr - b.rateMmYr)[0];
  return {
    // THE FOURTH BOUNDARY IS ZERO ITSELF. The door returns "negligible" at
    // exactly zero and below, and "low" the instant the rate is positive, so
    // negligible is not a band a small rate reaches by being small. The golden
    // carries both sides of it and the two sides carry different words.
    zeroRateMmYr: zeroRow ? zeroRow.rateMmYr : null,
    zeroCategory: zeroRow ? zeroRow.category : null,
    tinyRateMmYr: tinyRow ? tinyRow.rateMmYr : null,
    tinyCategory: tinyRow ? tinyRow.category : null,
    probes: CATEGORY_PROBES.map((r) => ({ rateMmYr: r, category: C.rateCategory(r) })),
    edgeCases: [['a blank rate', undefined], ['a NaN rate', NaN], ['a negative rate', -1]]
      .map(([label, v]) => ({ label, category: C.rateCategory(v) })),
    lowBand: MEASURED.catLow,
    moderateBand: MEASURED.catMod,
    highBand: MEASURED.catHigh,
    heldSentence: C.HELD_FOR_LITERATURE.find((s) => s.includes('rate category bands')),
    goldenRowCount: GOLD.categoryRows.length,
    goldenRows: goldenFinite.map((r) => ({
      rateMmYr: r.rateMmYr, goldenCategory: r.category, engineCategory: C.rateCategory(r.rateMmYr),
    })),
    appRateMmYr: ap.rate.rateMmYr,
    appCategory: ap.category,
  };
};

/** Section 16. The binding constraint, which is the summary this module lacked. */
export const bindingConstraint = () => {
  const rows = streams().map(([name, , s]) => ({
    name, what: s.binding.what, valueLabel: s.binding.valueLabel, why: s.binding.why,
  }));
  const cases = [
    ['the shipped app defaults', appScreen()],
    ['the same at 60 ft per second', C.screen({ ...APP, velocityMS: 60 * 0.3048 })],
    ['the same at 1 mol percent H2S', C.screen({ ...APP, h2sMolFrac: 0.01 })],
    ['the same oil wet', C.screen({ ...APP, flowRegime: 'oilWet' })],
  ].map(([label, s]) => ({ label, what: s.binding.what, valueLabel: s.binding.valueLabel }));
  return {
    rows,
    distinct: [...new Set(rows.map((r) => r.what))].sort(),
    cases,
  };
};

/** Section 17. The whole screening in one call, and the order that makes it honest. */
export const wholeScreening = () => {
  const ap = appScreen();
  const guards = [
    ['an H2S mole fraction that is not a number', { ...APP, h2sMolFrac: NaN }],
    ['an H2S mole fraction of 3', { ...APP, h2sMolFrac: 3 }],
    ['a negative H2S mole fraction', { ...APP, h2sMolFrac: -0.01 }],
    ['CO2 and H2S mole fractions summing above one', { ...APP, co2MolFrac: 0.7, h2sMolFrac: 0.4 }],
  ].map(([label, arg]) => probeRefusal(label, C.screen(arg)));
  const h2sOmitted = C.screen({
    tC: APP.tC,
    pTotalBar: APP.pTotalBar,
    co2MolFrac: APP.co2MolFrac,
    ph: APP.ph,
    velocityMS: APP.velocityMS,
    diameterM: APP.diameterM,
    densityKgM3: APP.densityKgM3,
    viscosityPaS: APP.viscosityPaS,
    flowRegime: 'waterWet',
    inhibitorEfficiencyPct: APP.inhibitorEfficiencyPct,
    inhibitorAvailabilityPct: APP.inhibitorAvailabilityPct,
    corrosionAllowanceMm: APP.corrosionAllowanceMm,
    consumedMm: 0,
    designLifeYears: APP.designLifeYears,
  });
  const swallowed = [
    ['a blank corrosion allowance box', C.screen({ ...APP, corrosionAllowanceMm: undefined })],
    ['an allowance that is not a number', C.screen({ ...APP, corrosionAllowanceMm: NaN })],
    ['an allowance already consumed past its own depth', C.screen({ ...APP, consumedMm: 5 })],
    ['a negative consumed depth', C.screen({ ...APP, consumedMm: -1 })],
  ].map(([label, r]) => ({
    label,
    topLevelError: r.error,
    lifeIsNull: r.life === null,
    lifeError: r.life && r.life.error ? r.life.error : null,
    withheld: r.withheld,
    screeningComplete: r.screeningComplete,
    bindingWhat: r.binding ? r.binding.what : null,
  }));
  const sumOk = C.screen({ ...APP, co2MolFrac: 0.6, h2sMolFrac: 0.4 });
  return {
    topLevelFields: Object.keys(ap),
    fieldCount: Object.keys(ap).length,
    rateMmYr: ap.rate.rateMmYr,
    uninhibitedMmYr: ap.rate.uninhibitedMmYr,
    rateWithFilmCreditMmYr: ap.rateWithFilmCreditMmYr,
    filmStripped: ap.filmStripped,
    tauPa: ap.shear.tauPa,
    filmRisk: ap.shear.filmRisk,
    sour: ap.sour.sour,
    regime: ap.regime.regime,
    category: ap.category,
    categoryHeld: ap.categoryHeld,
    remainingYears: ap.life.remainingYears,
    meetsDesignLife: ap.life.meetsDesignLife,
    ph2sBar: ap.ph2sBar,
    ph2sFugacityApplied: ap.ph2sFugacityApplied,
    withheld: ap.withheld,
    bindingWhat: ap.binding.what,
    screeningComplete: ap.screeningComplete,
    clamps: [...ap.clamps],
    notProvidedCount: ap.notProvided.length,
    limitsCount: ap.limits.length,
    guards,
    h2sOmittedPh2sBar: h2sOmitted.ph2sBar,
    h2sOmittedSour: h2sOmitted.sour.sour,
    h2sOmittedRegime: h2sOmitted.regime.regime,
    h2sOmittedCategory: h2sOmitted.category,
    appSour: ap.sour.sour,
    appRegime: ap.regime.regime,
    swallowed,
    sumAcceptedPartialsBar: sumOk.rate.pco2Bar + sumOk.ph2sBar,
    sumAcceptedTotalBar: APP.pTotalBar,
    sumAccepted: !sumOk.error,
  };
};

/** Section 18. Every refusal this module can produce, in one table. */
export const everyRefusal = () => {
  const rows = [
    ['co2Fugacity', 'a blank temperature', C.co2Fugacity({ pTotalBar: 50, co2MolFrac: 0.03 })],
    ['co2Fugacity', 'a temperature at or below absolute zero', C.co2Fugacity({ tC: -273.15, pTotalBar: 50, co2MolFrac: 0.03 })],
    ['co2Fugacity', 'a blank total pressure', C.co2Fugacity({ tC: 60, co2MolFrac: 0.03 })],
    ['co2Fugacity', 'a blank CO2 mole fraction', C.co2Fugacity({ tC: 60, pTotalBar: 50 })],
    ['co2Fugacity', 'a CO2 mole fraction outside nought to one', C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: 1.4 })],
    ['phFactor', 'a blank pH', C.phFactor({})],
    ['phFactor', 'a pH outside nought to fourteen', C.phFactor({ ph: 15 })],
    ['phFactor', 'a pH below the reference', C.phFactor({ ph: 3.9 })],
    ['corrosionRate', 'a blank velocity', C.corrosionRate({ ...ETELEBOU, velocityMS: undefined })],
    ['corrosionRate', 'a blank line inside diameter', C.corrosionRate({ ...ETELEBOU, diameterM: undefined })],
    ['corrosionRate', 'an unrecognised wetting regime', C.corrosionRate({ ...ETELEBOU, flowRegime: 'damp' })],
    ['corrosionRate', 'a water cut outside nought to one', C.corrosionRate({ ...ETELEBOU, flowRegime: 'intermittent', waterCutFrac: 5 })],
    ['corrosionRate', 'a non-finite inhibitor efficiency', C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: NaN })],
    ['wallShearStressPa', 'a blank density', C.wallShearStressPa({ velocityMS: 3, diameterM: 0.15, viscosityPaS: 0.001 })],
    ['wallShearStressPa', 'a blank viscosity', C.wallShearStressPa({ velocityMS: 3, diameterM: 0.15, densityKgM3: 900 })],
    ['sourServiceScreen', 'a blank H2S partial pressure', C.sourServiceScreen({})],
    ['sourServiceScreen', 'a negative H2S partial pressure', C.sourServiceScreen({ ph2sBar: -1 })],
    ['remainingLife', 'a blank allowance', C.remainingLife({ rateMmYr: 0.3 })],
    ['remainingLife', 'a negative consumed depth', C.remainingLife({ rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: -1 })],
    ['remainingLife', 'a negative rate', C.remainingLife({ rateMmYr: -1, corrosionAllowanceMm: 4 })],
    ['remainingLife', 'an allowance already consumed', C.remainingLife({ rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 4 })],
    ['screen', 'an H2S mole fraction that is not a number', C.screen({ ...APP, h2sMolFrac: NaN })],
    ['screen', 'mole fractions summing above one', C.screen({ ...APP, co2MolFrac: 0.8, h2sMolFrac: 0.3 })],
    ['screen', 'a blank density, so the film check cannot run', C.screen({ ...APP, densityKgM3: undefined })],
    ['screen', 'a blank viscosity, so the film check cannot run', C.screen({ ...APP, viscosityPaS: undefined })],
    ['screen', 'a blank pH', C.screen({ ...APP, ph: undefined })],
    ['screen', 'a pH below the reference', C.screen({ ...APP, ph: 3.5 })],
    ['screen', 'a blank temperature', C.screen({ ...APP, tC: undefined })],
    ['screen', 'a blank CO2 mole fraction', C.screen({ ...APP, co2MolFrac: undefined })],
    ['screen', 'a temperature below absolute zero', C.screen({ ...APP, tC: -300 })],
  ].map(([door, label, r]) => ({ door, label, error: softOf(r) }));
  const typedZero = C.screen({ ...APP, co2MolFrac: 0 });
  return {
    rows,
    count: rows.length,
    goldenRefusalCount: GOLD.refusals.length,
    typedZeroRateMmYr: typedZero.rate.rateMmYr,
    typedZeroApplies: typedZero.rate.rateApplies,
    typedZeroCategory: typedZero.category,
    typedZeroLife: typedZero.life,
    typedZeroNote: typedZero.rate.note,
    blankCo2Error: C.screen({ ...APP, co2MolFrac: undefined }).error,
  };
};

/** 0.05 in against the studio's own 0.125 in corrosion allowance, in mm. The
 *  shipped case consumes nothing, and at a consumed depth of zero the field
 *  that IGNORES what has gone and the field that does not read the same. */
export const CONSUMED_PROBE_MM = 0.05 * 25.4;

/** Section 19. The live studio's own defaults, end to end. */
export const studioDefaults = () => {
  const ap = appScreen();
  const fast = C.screen({ ...APP, velocityMS: 60 * 0.3048 });
  const sourCase = C.screen({ ...APP, h2sMolFrac: 0.01 });
  const oil = C.screen({ ...APP, flowRegime: 'oilWet' });
  const ph4 = C.screen({ ...APP, ph: 4 });
  // THE SHIPPED CASE WITH A CONSUMED DEPTH TYPED IN. The shipped case consumes
  // 0 mm, so the remaining allowance and the allowance the design life demands
  // cannot be told apart by watching them, and the only worked case with a
  // non-zero consumed depth was in an Expert-owned section.
  const used = C.screen({ ...APP, consumedMm: CONSUMED_PROBE_MM });
  return {
    inputs: APP_AS_TYPED.map(([label, typed, key]) => ({
      label, typed, key, value: APP[key],
    })),
    viscosityMPaS: APP.viscosityPaS * 1000,
    pco2Bar: ap.rate.pco2Bar,
    fugacityCoefficient: ap.rate.fugacityCoefficient,
    fco2Bar: ap.rate.fco2Bar,
    reactionMmYr: ap.rate.reactionMmYr,
    massTransferMmYr: ap.rate.massTransferMmYr,
    combinedMmYr: ap.rate.combinedMmYr,
    controlling: ap.rate.controlling,
    controllingMargin: ap.rate.controllingMargin,
    scaleFactor: ap.rate.scaleFactor,
    scaleOnsetTC: ap.rate.scaleOnsetTC,
    phFactor: ap.rate.phFactor,
    phReference: ap.rate.phReference,
    waterWettingFactor: ap.rate.waterWettingFactor,
    uninhibitedMmYr: ap.rate.uninhibitedMmYr,
    effectiveInhibitionPct: ap.rate.effectiveInhibitionPct,
    inhibitorShortfallPp: ap.rate.inhibitorShortfallPp,
    rateMmYr: ap.rate.rateMmYr,
    rateWithFilmCreditMmYr: ap.rateWithFilmCreditMmYr,
    category: ap.category,
    categoryHeld: ap.categoryHeld,
    reynolds: ap.shear.reynolds,
    branch: ap.shear.flowRegime,
    tauPa: ap.shear.tauPa,
    filmRisk: ap.shear.filmRisk,
    filmStripped: ap.filmStripped,
    ph2sBar: ap.ph2sBar,
    ph2sPsia: ap.sour.ph2sPsia,
    sour: ap.sour.sour,
    decadesAboveThreshold: ap.sour.decadesAboveThreshold,
    regionProvided: ap.sour.regionProvided,
    materialGuidanceProvided: ap.sour.materialGuidanceProvided,
    h2sToCo2Ratio: ap.regime.ratio,
    regime: ap.regime.regime,
    rateIsUpperBound: !!ap.regime.rateIsUpperBound,
    remainingMm: ap.life.remainingMm,
    remainingYears: ap.life.remainingYears,
    requiredAllowanceMm: ap.life.requiredAllowanceMm,
    shortfallMm: ap.life.shortfallMm,
    meetsDesignLife: ap.life.meetsDesignLife,
    bindingWhat: ap.binding.what,
    bindingValueLabel: ap.binding.valueLabel,
    warning: ap.rate.warning,
    bindingWhy: ap.binding.why,
    changes: [
      ['nothing, the shipped defaults', ap],
      ['velocity from 10 to 60 ft/s', fast],
      ['H2S from 0.1 to 1 mol%', sourCase],
      ['the wetting regime to oil wet', oil],
      ['pH from 4.5 to 4.0', ph4],
    ].map(([label, s]) => ({
      label,
      rateMmYr: s.rate.rateMmYr,
      category: s.category,
      remainingYears: s.life ? s.life.remainingYears : null,
      bindingWhat: s.binding.what,
    })),
    fastTauPa: fast.shear.tauPa,
    fastFilmRisk: fast.shear.filmRisk,
    fastRateMmYr: fast.rate.rateMmYr,
    fastCreditedMmYr: fast.rateWithFilmCreditMmYr,
    fastRatio: fast.rate.rateMmYr / fast.rateWithFilmCreditMmYr,
    fastRemainingYears: fast.life.remainingYears,
    filmStripPa: MEASURED.filmStrip,
    sourRatio: sourCase.regime.ratio,
    sourRegime: sourCase.regime.regime,
    sourRateMmYr: sourCase.rate.rateMmYr,
    sourUpperBoundMmYr: sourCase.withheld.upperBoundMmYr,
    ph4RateMmYr: ph4.rate.rateMmYr,
    mpyRows: [
      ['the rate', ap.rate.rateMmYr],
      ['the uninhibited rate', ap.rate.uninhibitedMmYr],
      ['the rate with the credit kept', ap.rateWithFilmCreditMmYr],
      ['the reaction term', ap.rate.reactionMmYr],
      ['the mass-transfer term', ap.rate.massTransferMmYr],
    ].map(([label, v]) => ({ label, mmYr: v, mpy: mpy(v) })),
    consumedProbeMm: CONSUMED_PROBE_MM,
    consumedRows: [
      ['remaining allowance mm', ap.life.remainingMm, used.life.remainingMm],
      ['remaining life yr', ap.life.remainingYears, used.life.remainingYears],
      ['allowance the design life demands mm', ap.life.requiredAllowanceMm, used.life.requiredAllowanceMm],
      ['shortfall mm', ap.life.shortfallMm, used.life.shortfallMm],
    ].map(([label, base, withConsumed]) => ({ label, base, withConsumed, moved: base !== withConsumed })),
    consumedRequiredAllowanceMm: used.life.requiredAllowanceMm,
    consumedShortfallRiseMm: used.life.shortfallMm - ap.life.shortfallMm,
    consumedRateMmYr: used.rate.rateMmYr,
    consumedBindingWhat: used.binding.what,
    consumedBindingWhy: used.binding.why,
  };
};

/** What each golden block covers, one clause a block. */
export const GOLDEN_BLOCK_NOTE = Object.freeze({
  cases: 'whole corrosionRate cases with every factor and the shear alongside',
  categoryBands: 'the three band edges, as the oracle read them',
  categoryRows: 'the category word either side of all three bands, plus a non-finite rate',
  heldConstants: "the oracle's own copy of every held constant, cross-pinned in section 3",
  inhibitor: 'the corrosion inhibitor time average, rebuilt as an hour-by-hour duty cycle',
  inhibitorClamps: 'the three clamped inputs and the clamp count each produces',
  lifeRows: 'remaining life, reached by marching the wall loss forward rather than by dividing',
  lifeZeroRate: 'the zero-rate row, where the life is null and the verdict is null',
  phRows: 'the pH factor at and above its reference, and the two-unit decade property',
  provenance: 'the statement that none of this is published, and why',
  refusalBase: 'the input set every refusal row is a single change away from',
  refusals: 'sixteen input sets that must refuse, each naming its input',
  regimeRows: 'the H2S to CO2 ratio at five pressures, reaching all four regimes',
  scaleOnset: 'the film onset at seven fugacities, found by bisection and by the closed form',
  screenRows: 'nine whole screenings, every field, three different binding constraints',
  sourRows: 'the threshold comparison above and below, done in psia against the engine doing it in bar',
  sourThreshold: 'the threshold in both units, and the bar value that would be exactly 0.05 psia',
});

/** What each oracle route is independent because of, and what it cannot check. */
export const ORACLE_ROUTES = Object.freeze([
  ['the series combination', 'solved by bisection on the reciprocal rather than formed as a reciprocal, with the residual identity checked separately', 'nothing'],
  ['the corrosion inhibitor time average', 'rebuilt as an explicit 8760 hour duty cycle, which rounds to whole hours, so the agreement is loose and that looseness IS the independence', 'nothing'],
  ['the wall shear', 'reached through a momentum balance over a stated length, with the pipe force balance checked as an identity', 'the Blasius pair, the laminar constant and the branch switch'],
  ['the film onset', 'found by bisection on the unclamped expression and cross-checked against the closed form', 'the three scale constants'],
  ['the remaining life', 'reached by marching the wall loss forward in small steps rather than by dividing, held to one step absolute', 'nothing'],
  ['the allowance shortfall', 'formed as a deficit of YEARS times the rate rather than as a subtraction of two allowances', 'nothing'],
  ['the H2S to CO2 ratio', 'formed from MOLE FRACTIONS, so it needs no pressure at all', 'the two boundary ratios'],
  ['the sour comparison', 'done entirely in psia against the engine doing it in bar', 'the threshold value'],
]);

/** Section 20. What the vendored cases can and cannot discriminate. */
export const goldenDiscrimination = () => ({
  rows: goldenCounts().rows,
  blocks: Object.keys(GOLD).length,
  published: GOLD.provenance.published,
  why: GOLD.provenance.why,
  blockRows: Object.entries(GOLD).map(([b, v]) => ({
    block: b, rows: Array.isArray(v) ? v.length : 1, note: GOLDEN_BLOCK_NOTE[b] || 'see the golden',
  })),
  cases: GOLD.cases.map((g, i) => {
    const r = C.corrosionRate({
      tC: g.tC,
      pTotalBar: g.pTotalBar,
      co2MolFrac: g.co2MolFrac,
      velocityMS: g.velocityMS,
      diameterM: g.diameterM,
      ph: g.ph,
      waterCutFrac: g.waterCutFrac,
      flowRegime: g.flowRegime,
      inhibitorEfficiencyPct: g.inhibitorEfficiencyPct,
      inhibitorAvailabilityPct: g.inhibitorAvailabilityPct,
    });
    return {
      index: i + 1,
      goldenRateMmYr: g.rateMmYr,
      engineRateMmYr: r.rateMmYr,
      rateRel: relDiff(r.rateMmYr, g.rateMmYr),
      goldenCombinedMmYr: g.combinedMmYr,
      engineCombinedMmYr: r.combinedMmYr,
      combinedRel: relDiff(r.combinedMmYr, g.combinedMmYr),
    };
  }),
  routes: ORACLE_ROUTES.map((r) => [...r]),
});

/** What is graded in this course, and why each is clear of every held item. */
export const GRADED_GROUPS = Object.freeze([
  ['the stream bookkeeping: the CO2 partial pressure, the H2S partial pressure in bar and in psia, and the H2S to CO2 mole ratio',
    'each is the total pressure times a mole fraction, or a ratio of two mole fractions, or a conversion by a factor exact by the definition of the bar. No correlation constant, no fugacity coefficient, no threshold and no boundary is in any chain'],
  ['the flow definition: the Reynolds number',
    'density times velocity times diameter over viscosity is a definition. The Blasius pair and the branch switch act on the friction factor DOWNSTREAM of it, and no graded field reads a friction factor or a shear stress'],
  ['the inhibitor arithmetic: the effective protection, the shortfall, the retained fraction and the metal-loss ratio',
    'all four are arithmetic over two typed percentages, and the two that are ratios of engine rates share the whole correlation chain so it divides out exactly. The capstone generator MEASURES that invariance rather than claiming it, by re-running at conditions that move the rate by more than half and cross the fugacity cap'],
  ['the allowance arithmetic: the remaining life, the required allowance, the tolerable rate and the allowance a reinstatement needs',
    "the remaining-life door takes an allowance, a consumed depth, a design life and A RATE THE CAPSTONE STATES from an inspection survey. No correlation constant is reachable from it, and the Expert fields are found by bisecting the engine's own verdict rather than by an algebraic shortcut around it"],
]);

/** The four things a reader will look for that this module does not have. */
export const ABSENCE_TABLE = Object.freeze([
  ['when to inspect next', 'a remaining life against a stated allowance', 'an interval, a risk basis and any inspection standard'],
  ['what thickness to retire at', 'a corrosion allowance the caller types in', 'a minimum thickness, a pressure-containing calculation and any retirement criterion'],
  ['whether the line is fit for service', 'nothing', 'a fitness-for-service method of any kind'],
  ['whether the velocity is erosional', 'a wall shear and a film-risk word', 'an erosional-velocity criterion. Section 23 names the course that cites one'],
  ['whether it will pit', 'a general uniform rate', 'a pitting criterion, a localised rate and any pit-depth model'],
  ['whether it will crack', 'an H2S threshold comparison', 'a sulphide-stress-cracking criterion, a hydrogen-induced-cracking criterion and any hardness limit'],
]);

/** Section 21. What is HELD, what is NOT PROVIDED, what is never graded. */
export const heldItems = () => ({
  held: [...C.HELD_FOR_LITERATURE],
  heldCount: C.HELD_FOR_LITERATURE.length,
  notProvided: [...C.NOT_PROVIDED],
  notProvidedCount: C.NOT_PROVIDED.length,
  withdrawn: ['the sour-service severity region', 'the material guidance that went with it'],
  gradedGroups: GRADED_GROUPS.map((r) => [...r]),
  absences: ABSENCE_TABLE.map((r) => [...r]),
});

/** The three legislated vocabulary collisions, and the rule for each. */
export const vocabularyCollisions = () => ({
  collisions: [
    ['inhibitor',
      'a HYDRATE inhibitor in the Flow Assurance course: methanol or monoethylene glycol, injected to depress a hydrate formation temperature, and dosed in mass fraction of the water phase',
      'a CORROSION inhibitor: a filming amine on the steel, with an efficiency and an availability, which removes a fraction of the metal loss while it is present',
      'ALWAYS write "corrosion inhibitor" on first use in every lesson and every bank question, and never write bare "inhibitor" in a prompt, an option or a heading. The two are different chemicals doing different jobs in different phases, and a learner who has taken Flow Assurance will read the bare word the other way'],
    ['erosion',
      'a GEOLOGICAL process in the Basin Modelling course: material removed from a sedimentary column over geological time, which changes a burial history',
      'MECHANICAL wall loss from entrained solids or from liquid impingement, which this module DOES NOT MODEL AT ALL',
      'ALWAYS write "mechanical erosion" or "erosional wall loss", and every use in this course must be accompanied by the statement that the engine has no erosional-velocity criterion. Never write bare "erosion" as though this module measured it'],
    ['friction factor and Reynolds number',
      'owned by the Pipeline & Line Sizing course, which computes both with a DIFFERENT correlation and a DIFFERENT laminar to turbulent transition',
      null,
      'ALWAYS write "the corrosion module\'s friction factor" or "this module\'s Reynolds number" when the number is this one, and ALWAYS state that the line sizing course computes its own and that the two will not agree. Never present either number as the platform\'s single answer'],
  ],
  switchRe: MEASURED.switchRe,
  blasiusC: MEASURED.blasiusC,
  blasiusN: MEASURED.blasiusN,
  laminarC: MEASURED.laminarC,
  misreadings: [
    ['integrity', 'that this module assesses fitness for service, computes a minimum thickness or sets an inspection interval',
      'in this course "integrity" means one arithmetic: a corrosion allowance divided by a rate. Say so wherever the word appears'],
    ['rate', 'that the single rate this module returns applies to the worst spot on the line',
      'it is a GENERAL UNIFORM rate and the engine says so. Never write it as a wall-loss prediction for a weld, a bend, a top-of-line film or a pit'],
  ],
});

/** Section 23. The scope seams: what to cite rather than teach. */
export const scopeSeams = () => ({
  seams: [
    ['the erosional velocity criterion', 'the Casing & Tubing Design Expert tier, and cited again in Nodal Analysis and Gas Well Deliverability',
      'name the owner, and state plainly that THIS engine has no erosional-velocity limit and computes a wall shear for a completely different purpose, which is whether an inhibitor film survives'],
    ['wall loss taken to a derated burst pressure', 'the Torque & Drag Expert tier',
      'name the owner. This module consumes an allowance and never computes a pressure, so the comparison is a pivot and not a derivation'],
    ['the Barlow thin-wall relation with a design factor', 'the Pipeline Network Associate tier',
      'name the owner. This module has no minimum thickness, so it cannot say what the allowance is being taken off'],
    ['fugacity and partial pressure', 'the Fluid Properties Expert tier',
      'name the owner for the thermodynamics, then teach what is specific here: which quantity drives the RATE, which drives the H2S threshold and the film ratio, and that no fugacity correction is applied to H2S at all'],
    ['the corrosion allowance as a wall thickness component', 'the Pipeline & Line Sizing and Storage Tank studios, which both ADD one',
      'state the seam as section 21 states it: three apps, one word, no link, and the wall this studio eats is not the wall either of those sized'],
  ],
});

/** The studio's own conversions, field units into the engine's units. */
export const UNIT_CONVERSIONS = Object.freeze([
  ['temperature', 'subtract 32, divide by 1.8', 'degrees Celsius'],
  ['pressure', 'add 14.7, divide by 14.5038', 'bar absolute'],
  ['CO2 and H2S', 'divide by 100', 'mole fraction'],
  ['velocity', 'multiply by 0.3048', 'metres a second'],
  ['line inside diameter', 'multiply by 0.0254', 'metres'],
  ['density', 'multiply by 16.0185', 'kilograms a cubic metre'],
  ['viscosity', 'multiply by 0.001', 'pascal seconds'],
  ['corrosion allowance and consumed depth', 'multiply by 25.4', 'millimetres'],
  ['every rate on the way back out', 'divide by 25.4, multiply by 1000', 'mils a year alongside millimetres a year'],
]);

/** Section 24. Units, and the one studio factor that is truncated. */
export const unitsAndTruncation = () => {
  const ap = appScreen();
  const exact = C.screen({ ...APP, pTotalBar: (725 + 14.7) / MEASURED.barPsia });
  const barWouldBe = CLAIMED_SOUR_PSIA / MEASURED.barPsia;
  return {
    conversions: UNIT_CONVERSIONS.map((r) => [...r]),
    barPsiaExact: MEASURED.barPsia,
    studioDivisor: STUDIO_PSIA_DIVISOR,
    divisorFraction: Math.abs(STUDIO_PSIA_DIVISOR - MEASURED.barPsia) / MEASURED.barPsia,
    studioPTotalBar: APP.pTotalBar,
    studioRateMmYr: ap.rate.rateMmYr,
    exactPTotalBar: (725 + 14.7) / MEASURED.barPsia,
    exactRateMmYr: exact.rate.rateMmYr,
    rateFraction: relDiff(exact.rate.rateMmYr, ap.rate.rateMmYr),
    sourPsia: MEASURED.sourPsia,
    claimedSourPsiaAsBar: barWouldBe,
    // A DIFFERENT RELATIONSHIP FROM SECTION 3's, on the same pair of numbers.
    // Section 3 takes the gap as a fraction of the SMALLER of the two. This one
    // takes it as a fraction of the threshold the engine actually uses, which is
    // the larger. The two figures are not interchangeable and a sentence that
    // welds one's number to the other's wording is false.
    belowThresholdPct: (Math.abs(barWouldBe - MEASURED.sourBar) / MEASURED.sourBar) * 100,
  };
};

/**
 * The rule that counts the engine's own past-tense comment lines. A line that
 * begins with a comment marker and carries one of these phrases is a sentence
 * about former behaviour, and a sentence lifted out of one arrives with no
 * frame around it. The walk over the vendored source is the test's, because a
 * browser module cannot read a file.
 */
export const HISTORY_COMMENT_RE = /used to|previous version|earlier version|before|no longer|silently|would have/i;
export const COMMENT_LINE_RE = /^\s*(\*|\/\/|\/\*)/;
export const HISTORY_MARKER = 'FC9-0';

/** How many lines of a source text are past-tense comment lines about behaviour. */
export const countHistoryComments = (text) => text.split('\n')
  .filter((l) => COMMENT_LINE_RE.test(l) && HISTORY_COMMENT_RE.test(l)).length;

/** How many lines carry the repair marker. */
export const countHistoryMarkers = (text) => text.split('\n').filter((l) => l.includes(HISTORY_MARKER)).length;

/** How many comment lines name a standard, and whether any line of CODE does. */
export const standardNameCensus = (text) => {
  const lines = text.split('\n');
  const codeOnly = lines.filter((l) => !COMMENT_LINE_RE.test(l)).join('\n');
  return {
    commentLines: lines.filter((l) => STANDARD_NAMES.some((n) => l.includes(n))).length,
    inCode: STANDARD_NAMES.filter((n) => codeOnly.includes(n)),
    withdrawnPresent: WITHDRAWN_STRINGS.filter((s) => text.includes(s)),
    lines: lines.length,
  };
};

/** Section 25. What this engine used to do. The one framed history section. */
export const repairHistory = () => {
  const ph = phAndItsReference();
  const ap = appScreen();
  return {
    regionProvided: ap.sour.regionProvided,
    materialGuidanceProvided: ap.sour.materialGuidanceProvided,
    firstRateMmYr: ph.firstRateMmYr,
    firstPh: ph.firstPh,
    lastRateMmYr: ph.lastRateMmYr,
    lastPh: ph.lastPh,
    shortfallTriggerPp: MEASURED.shortfallTrigger,
    pinCount: PIN_LITERALS.length,
  };
};

// ---------------------------------------------------------------------------
// THE CAPSTONE. Below this line nothing is a teaching value, and NO PANEL AND
// NO COURSE PAGE MAY IMPORT ANY OF IT. panelCapstoneGuard.test.js greps every
// panel source, this file and the learning page for a graded answer in four
// string shapes and for a plant name outside a graded field key.
//
// The three capstone lines are named only by the eighteen graded field KEYS,
// which gradedTolerance.js owns. Nothing here spells a plant name of its own,
// so the guard's key exemption never has to cover this file.
//
// NOT ONE OF THE EIGHTEEN IS A CORROSION RATE THE CORRELATION PRODUCED. The
// first six are the stream bookkeeping and the flow definition, the second six
// are the corrosion inhibitor arithmetic and the allowance on a rate the
// capstone STATES from an ultrasonic survey, and the last six are found by bisecting the
// engine's own verdict.
// ---------------------------------------------------------------------------

/** The Associate line: a wet gas gathering line, in the ENGINE'S own units. */
export const CAPSTONE_A = Object.freeze({
  tC: 64.8,
  pTotalBar: 137.42,
  co2MolFrac: 0.0237,
  h2sMolFrac: 0.00093,
  ph: 4.62,
  velocityMS: 3.4442,
  diameterM: 0.20272,
  densityKgM3: 860.19,
  viscosityPaS: 0.00114,
  flowRegime: 'waterWet',
  waterCutFrac: 1,
  inhibitorEfficiencyPct: 87,
  inhibitorAvailabilityPct: 91.4,
});

/** The Professional line: an oil line whose wall-loss rate came off a survey. */
export const CAPSTONE_B = Object.freeze({
  surveyedUninhibitedMmYr: 1.9826,
  corrosionAllowanceMm: 3.048,
  consumedMm: 0.6731,
  designLifeYears: 18,
  inhibitorEfficiencyPct: 93,
  inhibitorAvailabilityPct: 88.5,
  tC: 68.4,
  pTotalBar: 44.83,
  co2MolFrac: 0.0192,
  ph: 4.71,
  velocityMS: 2.1341,
  diameterM: 0.10318,
});

/** The Expert line: the wall shear has already taken the credit away. */
export const CAPSTONE_C = Object.freeze({
  surveyedUninhibitedMmYr: 2.1082,
  corrosionAllowanceMm: 4.7625,
  consumedMm: 1.3607,
  designLifeYears: 24,
  inhibitorEfficiencyPct: 96,
  inhibitorAvailabilityPct: 82.3,
  targetEffectiveProtectionPct: 88,
  tC: 74.9,
  pTotalBar: 88.61,
  co2MolFrac: 0.0154,
  ph: 4.83,
  velocityMS: 4.5739,
  diameterM: 0.15613,
});

/** Every export below this line, so the leak gate can tell the two halves apart. */
export const CAPSTONE_ONLY_EXPORTS = Object.freeze([
  'CAPSTONE_A', 'CAPSTONE_B', 'CAPSTONE_C',
  'capstoneRuns', 'capstoneFields', 'capstoneValues', 'CAPSTONE_ONLY_EXPORTS',
]);

const capstoneBCommon = () => ({
  tC: CAPSTONE_B.tC,
  pTotalBar: CAPSTONE_B.pTotalBar,
  co2MolFrac: CAPSTONE_B.co2MolFrac,
  ph: CAPSTONE_B.ph,
  velocityMS: CAPSTONE_B.velocityMS,
  diameterM: CAPSTONE_B.diameterM,
  flowRegime: 'waterWet',
});

const capstoneCCommon = () => ({
  tC: CAPSTONE_C.tC,
  pTotalBar: CAPSTONE_C.pTotalBar,
  co2MolFrac: CAPSTONE_C.co2MolFrac,
  ph: CAPSTONE_C.ph,
  velocityMS: CAPSTONE_C.velocityMS,
  diameterM: CAPSTONE_C.diameterM,
  flowRegime: 'waterWet',
});

/** Every engine call the three capstones make, in one place. */
export const capstoneRuns = () => {
  const aFug = C.co2Fugacity({
    tC: CAPSTONE_A.tC, pTotalBar: CAPSTONE_A.pTotalBar, co2MolFrac: CAPSTONE_A.co2MolFrac,
  });
  const aPh2s = CAPSTONE_A.pTotalBar * CAPSTONE_A.h2sMolFrac;
  const aSour = C.sourServiceScreen({ ph2sBar: aPh2s });
  const aRegime = C.corrosionRegime({ ph2sBar: aPh2s, pco2Bar: aFug.pco2Bar });
  const aShear = C.wallShearStressPa({
    velocityMS: CAPSTONE_A.velocityMS,
    diameterM: CAPSTONE_A.diameterM,
    densityKgM3: CAPSTONE_A.densityKgM3,
    viscosityPaS: CAPSTONE_A.viscosityPaS,
  });
  const aRate = C.corrosionRate(CAPSTONE_A);
  const aDatasheet = C.corrosionRate({ ...CAPSTONE_A, inhibitorAvailabilityPct: 100 });

  const bCommon = capstoneBCommon();
  const bRate = C.corrosionRate({
    ...bCommon,
    inhibitorEfficiencyPct: CAPSTONE_B.inhibitorEfficiencyPct,
    inhibitorAvailabilityPct: CAPSTONE_B.inhibitorAvailabilityPct,
  });
  const bDatasheet = C.corrosionRate({
    ...bCommon, inhibitorEfficiencyPct: CAPSTONE_B.inhibitorEfficiencyPct, inhibitorAvailabilityPct: 100,
  });
  const bRetained = bRate.rateMmYr / bRate.uninhibitedMmYr;
  const bDatasheetRetained = bDatasheet.rateMmYr / bDatasheet.uninhibitedMmYr;
  const bInhibitedRate = CAPSTONE_B.surveyedUninhibitedMmYr * bRetained;
  const bLife = C.remainingLife({
    rateMmYr: bInhibitedRate,
    corrosionAllowanceMm: CAPSTONE_B.corrosionAllowanceMm,
    consumedMm: CAPSTONE_B.consumedMm,
    designLifeYears: CAPSTONE_B.designLifeYears,
  });
  const bDatasheetLife = C.remainingLife({
    rateMmYr: CAPSTONE_B.surveyedUninhibitedMmYr * bDatasheetRetained,
    corrosionAllowanceMm: CAPSTONE_B.corrosionAllowanceMm,
    consumedMm: CAPSTONE_B.consumedMm,
    designLifeYears: CAPSTONE_B.designLifeYears,
  });

  const cCommon = capstoneCCommon();
  const cRate = C.corrosionRate({
    ...cCommon,
    inhibitorEfficiencyPct: CAPSTONE_C.inhibitorEfficiencyPct,
    inhibitorAvailabilityPct: CAPSTONE_C.inhibitorAvailabilityPct,
  });
  const cRetained = cRate.rateMmYr / cRate.uninhibitedMmYr;
  const cEffectiveRate = CAPSTONE_C.surveyedUninhibitedMmYr * cRetained;
  const cBase = {
    corrosionAllowanceMm: CAPSTONE_C.corrosionAllowanceMm,
    consumedMm: CAPSTONE_C.consumedMm,
    designLifeYears: CAPSTONE_C.designLifeYears,
  };
  const cProgrammeLife = C.remainingLife({ ...cBase, rateMmYr: cEffectiveRate });
  const cTolerableRate = bisect(1e-6, 5,
    (r) => C.remainingLife({ ...cBase, rateMmYr: r }).meetsDesignLife === true);
  const cRequiredAvail = bisect(1, 100, (a) => C.corrosionRate({
    ...cCommon, inhibitorEfficiencyPct: CAPSTONE_C.inhibitorEfficiencyPct, inhibitorAvailabilityPct: a,
  }).effectiveInhibitionPct >= CAPSTONE_C.targetEffectiveProtectionPct);
  const cAvailForLife = bisect(1, 100, (a) => {
    const r = C.corrosionRate({
      ...cCommon, inhibitorEfficiencyPct: CAPSTONE_C.inhibitorEfficiencyPct, inhibitorAvailabilityPct: a,
    });
    const retained = r.rateMmYr / r.uninhibitedMmYr;
    return C.remainingLife({
      ...cBase, rateMmYr: CAPSTONE_C.surveyedUninhibitedMmYr * retained,
    }).meetsDesignLife === true;
  });
  const cAllowanceToReinstate = bisect(2, 40, (ca) => C.remainingLife({
    ...cBase, corrosionAllowanceMm: ca, rateMmYr: cEffectiveRate,
  }).meetsDesignLife === true);
  const cStrippedLife = C.remainingLife({ ...cBase, rateMmYr: CAPSTONE_C.surveyedUninhibitedMmYr });

  return {
    aPco2Bar: aFug.pco2Bar,
    aPh2sPsia: aSour.ph2sPsia,
    aRatio: aRegime.ratio,
    aReynolds: aShear.reynolds,
    aEffectiveInhibitionPct: aRate.effectiveInhibitionPct,
    aMetalLossRatio: aRate.rateMmYr / aDatasheet.rateMmYr,
    aScaleFactor: aRate.scaleFactor,
    bRetained,
    bShortfallPp: bRate.inhibitorShortfallPp,
    bInhibitedRate,
    bRemainingYears: bLife.remainingYears,
    bRequiredAllowanceMm: bLife.requiredAllowanceMm,
    bLifeLostYr: bDatasheetLife.remainingYears - bLife.remainingYears,
    bMeetsDesignLife: bLife.meetsDesignLife,
    bScaleFactor: bRate.scaleFactor,
    cTolerableRate,
    cRequiredAvail,
    cAvailForLife,
    cAllowanceToReinstate,
    cStrippedLifeYr: cStrippedLife.remainingYears,
    cCreditLifeRatio: cProgrammeLife.remainingYears / cStrippedLife.remainingYears,
    cMeetsDesignLife: cProgrammeLife.meetsDesignLife,
    cRequiredAllowanceMm: cProgrammeLife.requiredAllowanceMm,
    cScaleFactor: cRate.scaleFactor,
  };
};

/**
 * The eighteen graded answers, in the published order, as [tier, key, value]
 * TRIPLES. There is no fourth element and there never will be: the grading band
 * of every field is made in gradedTolerance.js and written into fields.json,
 * and a lab that carried a mirror of it would be the third copy that two
 * sibling waves shipped stale.
 *
 * The order and the tier of each row come from GRADED_FIELDS rather than from a
 * second list here, so a field that moves tier moves in one place.
 */
export const capstoneFields = () => {
  const r = capstoneRuns();
  const values = [
    r.aPco2Bar, r.aPh2sPsia, r.aRatio, r.aReynolds, r.aEffectiveInhibitionPct, r.aMetalLossRatio,
    r.bRetained, r.bShortfallPp, r.bInhibitedRate, r.bRemainingYears, r.bRequiredAllowanceMm, r.bLifeLostYr,
    r.cTolerableRate, r.cRequiredAvail, r.cAvailForLife, r.cAllowanceToReinstate, r.cStrippedLifeYr, r.cCreditLifeRatio,
  ];
  return GRADED_FIELDS.map(([tier, key], i) => [tier, key, values[i]]);
};

/** The same eighteen, by key. */
export const capstoneValues = () => Object.fromEntries(capstoneFields().map(([, k, v]) => [k, v]));

// ---------------------------------------------------------------------------
// THE LEAK GUARD. A teaching number that lands on a graded answer hands the
// assessment away, so the gate walks every number every teaching export
// returns and refuses a surface too small to mean anything.
// ---------------------------------------------------------------------------

/** How many grading bands of clearance a teaching number must keep. */
export const LEAK_GUARD_MARGIN = 10;
/** The unit shiftings a teaching number could reach a learner in. */
export const LEAK_GUARD_SCALINGS = Object.freeze([
  { factor: 1, tag: 'as published' },
  { factor: 1000, tag: 'times a thousand' },
  { factor: 0.001, tag: 'divided by a thousand' },
]);
/** A relative cap, so a large answer's band does not swallow the whole axis. */
export const LEAK_GUARD_RELATIVE_CAP = 1e-3;

/**
 * Every graded answer in every shifting, with the band scaled with it. The
 * bands are READ FROM THE ANSWER FILE and never restated here, so a tolerance
 * that moves in fields.json moves here with it.
 */
export const leakGuardTargets = (fields) => fields.flatMap(([, key, value, tol]) => LEAK_GUARD_SCALINGS
  .map(({ factor, tag }) => {
    const scaled = value * factor;
    const gradingBand = tol * factor;
    const band = Math.min(gradingBand * LEAK_GUARD_MARGIN, Math.abs(scaled) * LEAK_GUARD_RELATIVE_CAP);
    return {
      key, tag, value: scaled, gradingBand, band,
    };
  }));

/** The first target a number sits inside, or null. */
export const leakGuardHit = (x, targets) => {
  if (!Number.isFinite(x)) return null;
  return targets.find((t) => Math.abs(x - t.value) <= t.band) || null;
};

/** Every finite number inside a value, with the path it was found at. */
export const collectNumbers = (value, path = '') => {
  if (typeof value === 'number') return Number.isFinite(value) ? [{ path, value }] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => collectNumbers(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => collectNumbers(v, path ? `${path}.${k}` : k));
  }
  return [];
};
