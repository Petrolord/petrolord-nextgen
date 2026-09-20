// THE TEACHING STREAMS OF THE H3 DIGEST, and the sweeps around them.
//
// THESE ARE NOT THE CAPSTONE FACILITIES. The capstones run three other
// facilities on other frequencies, probabilities, failure rates and targets;
// no distinctive input and no facility name is shared between the two files,
// nothing here imports h3_capstone.mjs and nothing there imports this.
// gate_capstone_leak.mjs proves both directions.
//
// Every stream exists to reach a BRANCH of the engine that a lesson has to
// teach, and each one says which. The NextGen teaching lab
// (src/components/course/panels/lopa/lopaLab.js) carries the same streams, and
// its vitest suite asserts they are deep-equal to these.
//
// FAILURE RATES ARE ILLUSTRATIVE, never data. The published worked SIF the
// course reproduces is read from the vendored golden, not typed here.

/** ORONI: one separator overfill scenario, taken through every step of a LOPA
 *  row. Four IPLs: two credited, one that shares the initiating controller
 *  (independent false), one on a procedure never audited (auditable false). */
export const ORONI = Object.freeze({
  initiatingEventFrequencyPerYr: 0.45,
  initiatingEvent: 'level control valve fails open',
  enablingConditions: Object.freeze([{ name: 'separator on the high pressure manifold', probability: 0.3 }]),
  conditionalModifiers: Object.freeze([
    { name: 'ignition', probability: 0.5 },
    { name: 'operator in the blast zone', probability: 0.2 },
  ]),
  ipls: Object.freeze([
    { name: 'high level alarm with operator response', pfd: 0.1, independent: true },
    { name: 'relief valve sized for the blocked outlet case', pfd: 0.01, independent: true },
    { name: 'BPCS level trip on the initiating controller', pfd: 0.1, independent: false },
    { name: 'operator round on a procedure never audited', pfd: 0.1, independent: true, auditable: false },
  ]),
  tmelPerYr: 1e-6,
});

/** The same ORONI row against a ladder of TMELs: all six outcome states. */
export const TMEL_LADDER = Object.freeze([1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10]);

/** ORONI at a TMEL of 1e-7 closed with four proposed SIFs: one in SIL 1 that
 *  misses, one in the SIL 2 band that STILL misses, one that meets, one well
 *  inside SIL 3. */
export const LOOP_TMEL = 1e-7;
export const PROPOSED_SIFS = Object.freeze([0.02, 0.009, 0.005, 0.0005]);

/** PFDavg values for the low demand bands, exact decades included. */
export const PFD_LADDER = Object.freeze([1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 1e-4, 5e-5, 1e-5, 5e-6]);
/** Required RRFs for the outcome states, exact decades included. */
export const RRF_LADDER = Object.freeze([0.5, 1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000]);

/** Frequency products whose exact value is a decade, and how IEEE double lands. */
export const SNAP_PRODUCTS = Object.freeze([
  { factors: [0.1, 0.1, 0.1], tmelPerYr: 1e-5 },
  { factors: [0.3, 0.1], tmelPerYr: 3e-4 },
  { factors: [0.2, 0.5, 0.1], tmelPerYr: 1e-4 },
  { factors: [0.7, 0.1, 0.1], tmelPerYr: 7e-5 },
  { factors: [0.9, 0.1], tmelPerYr: 9e-4 },
]);
/** RRFs typed near 100, to show the width of the snap. */
export const SNAP_WIDTH = Object.freeze([100, 100.0000001, 100.000001, 100.00001, 99.9999999]);

/** EKULAMA: the teaching channel. DU only for the simplified forms; the FULL
 *  set adds detected failures, MTTR and MRT for the Annex B form. */
export const EKULAMA_DU = Object.freeze({ lambdaDuPerHour: 1.2e-6, proofTestIntervalHours: 8760, beta: 0.05 });
export const EKULAMA_FULL = Object.freeze({
  lambdaDuPerHour: 1.2e-6, lambdaDdPerHour: 2.8e-6, proofTestIntervalHours: 8760,
  mttrHours: 8, mrtHours: 8, beta: 0.05, betaD: 0.02,
});
/** MRT ladder, at the EKULAMA_FULL MTTR of 8 hours. */
export const MRT_LADDER = Object.freeze([0, 8, 24, 72, 168]);
/** Beta factor ladder for 1oo2 and 2oo3; betaD is set to half of beta. */
export const BETA_LADDER = Object.freeze([0, 0.02, 0.05, 0.1, 0.2]);

/** OBAGI: a single shutdown valve whose proof test covers only part of its
 *  dangerous undetected failures; the rest are found at the ten year overhaul. */
export const OBAGI_VALVE = Object.freeze({
  architecture: '1oo1', lambdaDuPerHour: 9e-7, proofTestIntervalHours: 8760, mrtHours: 24, lifetimeHours: 87600,
});
export const PTC_LADDER = Object.freeze([1, 0.95, 0.9, 0.8, 0.7]);
export const OBAGI_TARGET_PFDAVG = 0.02;

/** IDU: the teaching SIF. 2oo3 transmitters on the EKULAMA channel, a 1oo1
 *  logic solver and two shutdown valves 1oo2. It answers the ORONI row at the
 *  LOOP_TMEL. */
export const IDU = Object.freeze({
  transmitters: Object.freeze({ architecture: '2oo3', ...EKULAMA_FULL }),
  logicSolver: Object.freeze({
    architecture: '1oo1', lambdaDuPerHour: 3e-8, lambdaDdPerHour: 6e-7, proofTestIntervalHours: 8760, mttrHours: 8, mrtHours: 8,
  }),
  valves: Object.freeze({
    architecture: '1oo2', lambdaDuPerHour: 2.6e-6, proofTestIntervalHours: 8760, mrtHours: 24, beta: 0.1,
  }),
});

/** Proof test intervals for the sensitivity tables: a quarter to eight years. */
export const SENS_INTERVALS = Object.freeze([2190, 4380, 8760, 17520, 35040, 70080]);
/** Targets for the longest interval of the IDU valves. */
export const VALVE_TARGETS = Object.freeze([5e-4, 1e-3, 2e-3, 5e-3, 1e-2]);

/** One subsystem for each state the longest interval can return. */
export const STATE_CASES = Object.freeze({
  UNACHIEVABLE: Object.freeze({ params: { architecture: '1oo1', lambdaDuPerHour: 1e-6, lambdaDdPerHour: 2e-4, mttrHours: 72 }, target: 0.01 }),
  INTERVAL_INDEPENDENT: Object.freeze({ params: { architecture: '1oo1', lambdaDuPerHour: 0, lambdaDdPerHour: 1e-6, mttrHours: 8 }, target: 0.01 }),
  CAPPED_AT_LIFETIME: Object.freeze({ params: { architecture: '1oo1', lambdaDuPerHour: 2e-8, proofTestCoverage: 0.9, lifetimeHours: 87600 }, target: 0.01 }),
});

/** The published example's inferred lifetime, swept, in years. */
export const T2_YEARS = Object.freeze([5, 8, 10, 12, 15]);

/** Intervals the IDU SIF is re-verified at when every proof test is stretched. */
export const STRETCH_YEARS = Object.freeze([1, 2, 3, 3.5, 4]);
