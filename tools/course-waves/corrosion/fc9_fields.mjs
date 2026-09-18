// THE SIX TEACHING STREAMS OF THE FC9 DIGEST, and the sweeps around them.
//
// THESE ARE NOT THE CAPSTONE PLANTS. The capstones run OBIGBO, NEMBE CREEK and
// SOKU, and no name, pressure, temperature, mole fraction, velocity, diameter,
// density, viscosity, pH, allowance, consumed depth, design life, efficiency,
// availability or surveyed rate is shared between the two files. Nothing here
// imports fc9_capstone.mjs and nothing there imports this, and
// gate_capstone_leak.py proves both directions.
//
// Every stream exists to reach a BRANCH of the engine that a lesson has to
// teach, and each one says which branch in its comment.

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
 *  threshold and `screen` removes the inhibitor credit. */
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
/** Inhibitor availability sweep at one efficiency, in percent. */
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
/** The inhibitor pairs a clamp is reached with, as [efficiency, availability]. */
export const CLAMP_PROBES = Object.freeze([[-5, 90], [120, 90], [90, 130]]);
