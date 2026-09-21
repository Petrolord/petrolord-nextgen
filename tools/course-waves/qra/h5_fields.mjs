// THE TEACHING STREAMS OF THE H5 DIGEST, and the sweeps around them.
//
// THESE ARE NOT THE CAPSTONE FACILITIES. The capstones run three other
// facilities on other frequencies, probabilities, hours, fatality counts and
// costs; no distinctive input and no facility name is shared between the two
// files, nothing here imports h5_capstone.mjs and nothing there imports this.
// gate_capstone_leak.mjs proves both directions.
//
// Every stream exists to reach a BRANCH of the engine that a lesson has to
// teach, and each one says which. The NextGen teaching lab
// (src/components/course/panels/qra/qraLab.js) carries the same streams, and
// its vitest suite asserts they are deep-equal to these.
//
// EVERY PROBABILITY OF DEATH HERE IS A STATED TEACHING INPUT. The consequence
// models that produce one belong to the H4 course. The published values the
// course reproduces (Purple Book Appendix 6.B, the CBA checklist example, the
// R2P2 box) are read from the vendored golden, never typed here.

/* ================================================== EREMOR, Associate */

/** EREMOR: a gas release on a processing platform, taken through the
 *  flammable release tree with the Purple Book split preset. */
export const EREMOR_RELEASE = Object.freeze({
  initiatingFrequencyPerYr: 5e-4,
  immediateIgnitionProbability: 0.1,
  delayedIgnitionProbability: 0.3,
});

/** EREMOR tank overfill: a general tree with three levels whose two
 *  'pool fire' leaves pool into one outcome. */
export const EREMOR_OVERFILL = Object.freeze({
  initiatingFrequencyPerYr: 2e-3,
  tree: Object.freeze({
    branches: Object.freeze([
      Object.freeze({ name: 'high level alarm answered', probability: 0.95, outcome: 'no release' }),
      Object.freeze({
        name: 'high level alarm missed',
        probability: 0.05,
        next: Object.freeze({
          branches: Object.freeze([
            Object.freeze({
              name: 'bund contains the spill',
              probability: 0.7,
              next: Object.freeze({
                branches: Object.freeze([
                  Object.freeze({ name: 'ignited in the bund', probability: 0.1, outcome: 'pool fire' }),
                  Object.freeze({ name: 'not ignited in the bund', probability: 0.9, outcome: 'no fire' }),
                ]),
              }),
            }),
            Object.freeze({
              name: 'bund overtopped',
              probability: 0.3,
              next: Object.freeze({
                branches: Object.freeze([
                  Object.freeze({ name: 'ignited outside the bund', probability: 0.25, outcome: 'pool fire' }),
                  Object.freeze({ name: 'not ignited outside the bund', probability: 0.75, outcome: 'no fire' }),
                ]),
              }),
            }),
          ]),
        }),
      }),
    ]),
  }),
});

/** A branch set that does not close, and one that sums to 1 only in exact
 *  arithmetic (0.7 + 0.2 + 0.1 is 0.9999999999999999 in double). */
export const OPEN_BRANCHES = Object.freeze([0.6, 0.3]);
export const FLOAT_BRANCHES = Object.freeze([0.7, 0.2, 0.1]);
export const NEAR_BRANCHES = Object.freeze([0.4000001, 0.6]);

/** EREMOR places: the probability of death per outcome of a person present
 *  outdoors and unprotected there, stated. */
export const EREMOR_PLACES = Object.freeze({
  'process deck': Object.freeze({ 'jet or pool fire': 0.5, 'flash fire': 1, explosion: 0.7, 'pool fire': 0.3 }),
  'control room': Object.freeze({ 'jet or pool fire': 0.02, 'flash fire': 0, explosion: 0.1, 'pool fire': 0.01 }),
  accommodation: Object.freeze({ 'jet or pool fire': 0, 'flash fire': 0, explosion: 0.002, 'pool fire': 0 }),
});

/** EREMOR people: an operator in hours, a supervisor in fractions of the
 *  year, and a roster that asks for more than the whole year. */
export const EREMOR_OPERATOR = Object.freeze([
  Object.freeze({ place: 'process deck', hoursPerYr: 1000 }),
  Object.freeze({ place: 'control room', hoursPerYr: 800 }),
  Object.freeze({ place: 'accommodation', hoursPerYr: 2560 }),
]);
export const EREMOR_SUPERVISOR = Object.freeze([
  Object.freeze({ place: 'process deck', occupancyFraction: 0.05 }),
  Object.freeze({ place: 'control room', occupancyFraction: 0.2 }),
  Object.freeze({ place: 'accommodation', occupancyFraction: 0.25 }),
]);
export const EREMOR_OVERBOOKED = Object.freeze([
  Object.freeze({ place: 'process deck', occupancyFraction: 0.6 }),
  Object.freeze({ place: 'control room', occupancyFraction: 0.5 }),
]);
/** A vulnerability factor of the analyst's own, applied to the accommodation. */
export const ACCOMMODATION_VULNERABILITY = 0.5;

/** Direct ignition lookups on both sides of every printed band edge. */
export const IGNITION_RATES_KG_S = Object.freeze([5, 10, 50, 100, 200]);
export const IGNITION_MASSES_KG = Object.freeze([500, 1000, 5000, 10000, 20000]);

/** EREMOR transect: distances from the release and a stated probability of
 *  death at each, for two scenarios. */
export const EREMOR_TRANSECT = Object.freeze({
  distancesM: Object.freeze([0, 50, 100, 150, 200, 300, 400]),
  scenarios: Object.freeze([
    Object.freeze({ name: 'jet fire', frequencyPerYr: 5e-5, fatalityProbabilities: Object.freeze([1, 0.9, 0.35, 0.05, 0.004, 0, 0]) }),
    Object.freeze({ name: 'explosion', frequencyPerYr: 2e-5, fatalityProbabilities: Object.freeze([1, 0.8, 0.4, 0.1, 0.02, 0.001, 0]) }),
  ]),
});

/* ================================================= JISIKE, Professional */

/** JISIKE crew: expected crew deaths per scenario, one with none. */
export const JISIKE_CREW = Object.freeze([
  Object.freeze({ name: 'process fire', frequencyPerYr: 5e-4, fatalities: 1.2 }),
  Object.freeze({ name: 'module explosion', frequencyPerYr: 4e-5, fatalities: 8 }),
  Object.freeze({ name: 'fall from height', frequencyPerYr: 3e-3, fatalities: 0.5 }),
  Object.freeze({ name: 'spill with no one near', frequencyPerYr: 6e-3, fatalities: 0 }),
]);
export const JISIKE_CREW_PERSONS = 60;
export const JISIKE_HOURS_PER_PERSON = 2000;
/** A PLL that is a whole number, so FAR can be checked against H1. */
export const WHOLE_PLL = Object.freeze({ fatalities: 2, exposedHoursPerYr: 4e7 });

/** JISIKE off-site: expected deaths beyond the fence per scenario. */
export const JISIKE_OFFSITE = Object.freeze([
  Object.freeze({ name: 'toxic cloud over the town', frequencyPerYr: 2e-7, fatalities: 300 }),
  Object.freeze({ name: 'vapour cloud explosion', frequencyPerYr: 1.5e-6, fatalities: 40 }),
  Object.freeze({ name: 'flash fire at the road', frequencyPerYr: 8e-6, fatalities: 12 }),
  Object.freeze({ name: 'jet fire at the fence', frequencyPerYr: 3e-5, fatalities: 3 }),
  Object.freeze({ name: 'second jet fire at the fence', frequencyPerYr: 1e-5, fatalities: 3 }),
  Object.freeze({ name: 'release that reaches no one', frequencyPerYr: 5e-5, fatalities: 0 }),
]);

/** A curve built to sit exactly on the Dutch line at ten deaths. */
export const TOUCHING = Object.freeze([
  Object.freeze({ name: 'touching scenario', frequencyPerYr: 1e-5, fatalities: 10 }),
  Object.freeze({ name: 'small scenario', frequencyPerYr: 2e-5, fatalities: 1 }),
]);

/** The slope minus one line through the R2P2 point: common practice, never a
 *  preset, so it is supplied as the analyst's own criterion. */
export const CALLER_LINE = Object.freeze({ constantC: 0.01, exponentAlpha: 1 });
/** The same Dutch constants with a finite upper end, to reach nMax. */
export const CAPPED_LINE = Object.freeze({ constantC: 1e-3, exponentAlpha: 2, minFatalities: 10, maxFatalities: 100 });

/** PB fraction cases: a stated probability of death for a toxic cloud, an
 *  explosion either side of each printed overpressure, a flash fire in and
 *  out of the envelope, and a fire at and above the ignition flux. */
export const TOXIC_PE = 0.4;
export const OVERPRESSURES_PA = Object.freeze([5000, 10000, 20000, 30000, 40000]);

/* ===================================================== EDIKAN, Expert */

/** Individual risks against the R2P2 bands, exact thresholds included. */
export const IR_LADDER = Object.freeze([1e-2, 2e-3, 1e-3, 5e-4, 1e-4, 2e-5, 1e-6, 5e-7, 0]);
/** Products that land on a threshold only in exact arithmetic: each lands a
 *  hair ABOVE the threshold in IEEE double. */
export const SNAP_PRODUCTS = Object.freeze([
  Object.freeze({ factors: Object.freeze([0.1, 0.1, 0.1]), thresholdPerYr: 1e-3, preset: 'r2p2-workers' }),
  Object.freeze({ factors: Object.freeze([0.1, 0.1, 0.01]), thresholdPerYr: 1e-4, preset: 'r2p2-public' }),
  Object.freeze({ factors: Object.freeze([0.2, 5e-6]), thresholdPerYr: 1e-6, preset: 'r2p2-public' }),
]);

/** EDIKAN firewall: one measure, weighed three ways. */
export const EDIKAN_FIREWALL = Object.freeze({
  deltaPllPerYr: 2e-3,
  vpf: 1000000,
  lifetimeYears: 20,
  capitalCost: 250000,
  annualCost: 5000,
  disproportionFactor: 3,
});
export const CONVENTIONS = Object.freeze([
  Object.freeze({ label: 'undiscounted', benefitDiscountRate: 0, costDiscountRate: 0, benefitGrowthRate: 0 }),
  Object.freeze({ label: 'the 2003 checklist limits', benefitDiscountRate: 0.015, costDiscountRate: 0.035, benefitGrowthRate: 0 }),
  Object.freeze({ label: 'R2P2 Appendix 3', benefitDiscountRate: 0.06, costDiscountRate: 0.06, benefitGrowthRate: 0.04 }),
]);
/** Disproportion factors swept against the firewall, undiscounted. */
export const DF_SWEEP = Object.freeze([1, 2, 3, 5, 10]);
