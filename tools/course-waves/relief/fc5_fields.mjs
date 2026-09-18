// FC5 relief: THE TEACHING FIELDS. Six streams this wave designed for
// itself, plus every sweep and probe the digest prints around them.
//
// THIS FILE IS THE TEACHING HALF AND NOTHING ELSE. The FC5 capstone runs
// KOLO CREEK, OGBAINBIRI and GBARAN, which are different vessels entirely.
// Nothing here imports, reads or reproduces fc5_fields_capstone.mjs,
// fc5_capstone.mjs or fields.json, and no rate, pressure, temperature,
// gravity, viscosity, level, droplet, diameter, orifice or coefficient
// below is a capstone condition.
//
// These are CONDITIONS ONLY. Not one number here is an answer: every
// answer in the digest is a return value of the vendored engine, computed
// by fc5_dump.mjs at build time.

/* ---------------------------------------------------- the six streams */

// ORUBIRI, a gas and vapour relief case with a back pressure high enough
// that the branch decision is visible rather than assumed.
export const ORUBIRI = {
  wLbHr: 68000, setPsig: 420, overpressurePct: 10, backPsig: 35,
  tF: 185, mw: 20.5, z: 0.87, k: 1.27, kd: 0.975, kb: 1.0, kc: 1.0,
};

// AKASO, a liquid relief case viscous enough that the Kv loop moves the
// answer and a single pass would not reach it.
export const AKASO = {
  qGpm: 860, setPsig: 310, overpressurePct: 10, backPsig: 40,
  sg: 0.84, muCp: 85, kd: 0.65, kw: 1.0, kc: 1.0,
};

// TEBIDABA, a steam case whose relieving pressure sits inside the
// published Napier range and above the threshold.
export const TEBIDABA = {
  wLbHr: 94000, setPsig: 1740, overpressurePct: 10,
  kd: 0.975, kb: 1.0, kc: 1.0, ksh: 1.0,
};

// BENISEDE, a horizontal vessel in a pool fire, at a level that is not
// half its diameter.
export const BENISEDE = {
  orientation: 'horizontal', diameterFt: 12, lengthFt: 45, liquidLevelFt: 4.2,
  adequateDrainage: true, envFactor: 1.0, latentBtuLb: 128,
  setPsig: 275, overpressurePct: 21, tF: 180, mw: 21, z: 0.9, k: 1.22,
};

// ODIDI, a flare knockout drum.
export const ODIDI = {
  qVaporMMscfd: 44, pPsia: 42, tF: 160, gasSg: 0.68,
  dropletMicron: 400, rhoLLbFt3: 36.5, muVCp: 0.0135,
  diameterFt: 9, liquidFraction: 0.30,
};

// AFIESERE, a vessel depressuring through a fixed orifice.
export const AFIESERE = {
  volumeFt3: 720, p0Psia: 1240, t0R: 545, pEndPsia: 145,
  mw: 20, k: 1.28, z: 0.88, orificeDIn: 1.25, cd: 0.82,
};

/* --------------------------------------------------------- the sweeps */

// The back pressure walked across the branch, as a RATIO of the relieving
// pressure, so the row labels carry no pressure of their own.
//
// THE TWO PROBE ROWS EITHER SIDE OF THE CROSSING ARE NOT LISTED HERE, because
// the crossing is a MEASUREMENT. This list used to carry 0.5497 and 0.5498 as
// typed probes and the section heading above them said they were chosen either
// side of the engine's own critical ratio. Both sat BELOW that ratio, 0.551208,
// and both came back critical, so the one demonstration the rows existed to
// make was never made. The dump now derives the pair from the ratio the engine
// reports and asserts that they land on opposite branches, which is a claim a
// typed pair cannot keep.
export const ORUBIRI_BACK_RATIOS = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90];

// How far either side of the measured critical ratio the two probe rows sit.
// Wide enough to survive the digest's six-decimal printing as two distinct
// numbers, which is what stopped Section 10's 0.503 pair being readable.
export const CRITICAL_PROBE_OFFSET = 1e-6;

// k walked across the range the standard covers, for C and the ratio.
export const K_SWEEP = [1.05, 1.10, 1.20, 1.30, 1.40, 1.50, 1.60, 1.80];

// The viscosity walked so the Kv loop can be watched arriving.
export const AKASO_MU_SWEEP = [0, 1, 5, 20, 85, 300, 1200, 5000];

// Reynolds numbers chosen to expose which of the Kv fit's two correction
// terms is worth anything where. The digest prints, at each of these, how
// much each term contributes, which is the only way to say the 342.75 term
// has a band without asserting it.
export const KV_RE_SWEEP = [10, 30, 92, 300, 900, 3000, 10000, 100000, 196000, 300000, 1e8];

// Steam relieving pressures across both unity crossings of the Napier fit
// and both ends of its published range.
export const KN_P_SWEEP = [1000, 1400, 1500, 1520, 1550, 1580, 1600, 1800, 2000, 2500, 3000, 3200];

// The bisection targets the digest MEASURES rather than types.
export const BISECT = {
  napierThreshold: [1000, 2000],      // where KN leaves unity
  napierTop: [3000, 4000],            // where the refusal starts
  napierUnityCrossing: [1500, 2000],  // where KN returns to unity
  dragClamp: [1e-4, 10],              // the vapour viscosity the low-Reynolds cap engages at
  latentWarning: [1, 200],            // the latent heat the warning fires below
  kvWarning: [1e-6, 1],               // the Kv the envelope warning fires below
  ldHigh: [0.1, 200],                 // the L over D the note changes at, above
  ldLow: [0.1, 200],                  // and below
  backPressureWarning: [0.01, 0.99],  // the back-pressure ratio the Kb warning fires above
  blowdownLimit: [1, 20000],          // the time limit the refusal quotes
};

// The BENISEDE level walked from empty to full, including the half-full
// coincidence, so both orientations can be printed on one row.
export const BENISEDE_LEVEL_SWEEP = [0.6, 1.2, 2.4, 4.2, 6.0, 7.8, 9.6, 10.8, 12.0];

// Drainage and environment credit, one at a time.
export const ENV_SWEEP = [1.0, 0.85, 0.5, 0.3, 0.15];

// Two areas an order apart, for MEASURING the pool-fire exponent.
export const FIRE_EXPONENT_PROBE = { a1: 100, a2: 1000 };

// Droplet sizes spanning the clamped, intermediate and Newton regimes.
export const ODIDI_DROPLET_SWEEP = [5, 20, 60, 150, 400, 900, 2000, 6000];

// The drum's own holdup fraction walked end to end. The digest prints the
// length at every one of these AND the spread between them, because a
// claim about what an input does to an answer is a RELATIONSHIP and this
// file's rule is that a relationship must be computed before it is said.
export const ODIDI_HOLDUP_SWEEP = [0, 0.10, 0.25, 0.30, 0.50, 0.75, 0.90, 0.99];

// Candidate drum diameters, for the length and the L over D.
export const ODIDI_DIAMETER_SWEEP = [5, 6, 7, 8, 9, 10, 12, 14];

// Blowdown orifices, and blowdown steps for the refinement study. The
// steps are a CONTIGUOUS halving sequence, because a convergence table is
// only honest over a contiguous slice.
export const AFIESERE_ORIFICE_SWEEP = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0];
export const AFIESERE_STEP_SWEEP = [0.8, 0.4, 0.2, 0.1, 0.05, 0.025, 0.0125];

// The flare the AFIESERE vessel discharges to, for the point source.
export const AFIESERE_FLARE = {
  reliefWLbHr: 210000, lhvBtuLb: 19400,
  fractionRadiated: 0.32, transmissivity: 0.92,
  distanceM: 140,
};
export const RADIATION_DISTANCE_SWEEP = [40, 60, 80, 100, 140, 200, 300, 450];

/* ------------------------------------------------- measurement probes */
//
// Where a constant is not exported, the digest asks the engine a question
// whose answer IS the constant and nothing else. These are the questions.

export const PROBES = {
  // C: gasConstantC(k) at any k, against the bracket computed from the
  // same k, leaves 520 alone.
  cAtK: 1.4,
  // 735: one subcritical area against its own inputs and its own F2.
  // AT UNIT CERTIFIED COEFFICIENTS. Without kd and kc the probe recovers the
  // leading constant TIMES the engine's default discharge coefficient, which is
  // a different number and reads exactly like the right one.
  subcritical: { wLbHr: 10000, p1Psia: 500, p2Psia: 400, tR: 600, mw: 20, z: 1, k: 1.3, kd: 1, kc: 1 },
  // 38: one inviscid liquid area against its own inputs.
  liquidBare: { qGpm: 100, p1Psig: 100, p2Psig: 0, sg: 1, kd: 1, kw: 1, kc: 1 },
  // 51.5: one steam area below the Napier threshold, at unit factors.
  steamBare: { wLbHr: 10000, p1Psia: 1000, kd: 1, kb: 1, kc: 1, ksh: 1 },
  // 21000 and 34500: one fire duty each at a unit area and a unit factor.
  fireBare: { wettedFt2: 1, envFactor: 1 },
  // the 0.82 exponent: two duties an order of area apart.
  // 1.15, g, the micron and the centipoise: the settling answer against
  // its own returned drag coefficient at two droplet sizes and two
  // viscosities, which separates the four.
  settleA: { dropletMicron: 100, rhoLLbFt3: 50, rhoVLbFt3: 0.5, muVCp: 0.01 },
  settleB: { dropletMicron: 200, rhoLLbFt3: 50, rhoVLbFt3: 0.5, muVCp: 0.01 },
  settleC: { dropletMicron: 100, rhoLLbFt3: 50, rhoVLbFt3: 0.5, muVCp: 0.02 },
  // 2800: the returned Reynolds number against its own area.
  liquidRe: { qGpm: 200, p1Psig: 150, p2Psig: 0, sg: 1, muCp: 50, kd: 1, kw: 1, kc: 1 },
  // 1545.349 and the hidden 0.975: the blowdown march's own first step.
  blowdownProbe: {
    volumeFt3: 1000, p0Psia: 900, t0R: 540, pEndPsia: 100,
    mw: 20, k: 1.3, z: 0.9, orificeDIn: 1.0, cd: 1.0, dtS: 0.001,
  },
  // 14.7: two gas calls differing only in whether p2 is given.
  atmProbeGiven: { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3 },
  atmProbeOmitted: { wLbHr: 10000, p1Psia: 500, tR: 600, mw: 20, z: 1, k: 1.3 },
  // 4 pi: the point source against its own inverse at a known duty.
  pointSource: { qKw: 1000, distanceM: 10, fractionRadiated: 1, transmissivity: 1 },
};

/* ------------------------------------------------- refusal probes */
//
// Every refusal this module can produce, each reached by ONE bad input
// with everything else sound, so the message and the input that caused it
// are on the same row.

export const REFUSALS = [
  // Each row is ONE bad input with everything else sound, so the message and
  // the input that caused it sit on the same digest row. The digest ASSERTS
  // that every one of these actually refuses: a row labelled a refusal whose
  // call succeeded would print success fields under a refusal heading, which
  // is a defect a numeric sweep cannot see.
  ['selectOrifice', 'a required area of zero', 0],
  ['selectOrifice', 'a required area past the largest standard orifice', 30],
  ['selectOrifice', 'a required area that is not a number', Infinity],
  ['gasVaporArea', 'a relief load of zero', { wLbHr: 0, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3 }],
  ['gasVaporArea', 'an isentropic exponent of one', { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.0 }],
  ['gasVaporArea', 'a back pressure at the relieving pressure', { wLbHr: 10000, p1Psia: 500, p2Psia: 500, tR: 600, mw: 20, z: 1, k: 1.3 }],
  ['gasVaporArea', 'a negative back pressure', { wLbHr: 10000, p1Psia: 500, p2Psia: -5, tR: 600, mw: 20, z: 1, k: 1.3 }],
  ['gasVaporArea', 'a certified discharge coefficient of zero', { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3, kd: 0 }],
  ['gasVaporArea', 'a certified discharge coefficient above one', { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3, kd: 2 }],
  ['gasVaporArea', 'a back-pressure correction above one', { wLbHr: 10000, p1Psia: 500, p2Psia: 14.7, tR: 600, mw: 20, z: 1, k: 1.3, kb: 1.4 }],
  ['liquidArea', 'a rate of zero', { qGpm: 0, p1Psig: 200, p2Psig: 0, sg: 0.9 }],
  ['liquidArea', 'a negative viscosity', { qGpm: 500, p1Psig: 200, p2Psig: 0, sg: 0.9, muCp: -400 }],
  ['liquidArea', 'a back pressure at the set pressure', { qGpm: 500, p1Psig: 200, p2Psig: 200, sg: 0.9 }],
  ['liquidArea', 'a liquid back-pressure correction above one', { qGpm: 500, p1Psig: 200, p2Psig: 0, sg: 0.9, kw: 1.2 }],
  ['steamArea', 'a flow of zero', { wLbHr: 0, p1Psia: 500 }],
  ['steamArea', 'a superheat factor of zero', { wLbHr: 60000, p1Psia: 500, ksh: 0 }],
  ['steamArea', 'a pressure past the published Napier range', { wLbHr: 60000, p1Psia: 3400 }],
  ['wettedAreaFt2', 'a diameter of zero', { orientation: 'horizontal', diameterFt: 0, lengthFt: 40, liquidLevelFt: 5 }],
  ['wettedAreaFt2', 'a missing liquid level', { orientation: 'horizontal', diameterFt: 10, lengthFt: 40 }],
  ['wettedAreaFt2', 'a negative liquid level', { orientation: 'vertical', diameterFt: 10, lengthFt: 40, liquidLevelFt: -3 }],
  ['wettedAreaFt2', 'an orientation the engine does not recognise', { orientation: 'slanted', diameterFt: 10, lengthFt: 40, liquidLevelFt: 5 }],
  ['fireHeatInput', 'a wetted area of zero', { wettedFt2: 0 }],
  ['fireHeatInput', 'a drainage answer given as a string', { wettedFt2: 600, adequateDrainage: 'false' }],
  ['fireHeatInput', 'an environment factor of zero', { wettedFt2: 600, envFactor: 0 }],
  ['fireReliefLoad', 'a latent heat of zero', { qBtuHr: 4e6, latentBtuLb: 0 }],
  ['dropoutVelocityFtS', 'a vapour denser than the liquid', { dropletMicron: 300, rhoLLbFt3: 0.5, rhoVLbFt3: 31.2, muVCp: 0.012 }],
  ['dropoutVelocityFtS', 'a vapour viscosity of zero', { dropletMicron: 300, rhoLLbFt3: 31.2, rhoVLbFt3: 0.5, muVCp: 0 }],
  ['koDrumHorizontal', 'a diameter of zero', { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 0 }],
  ['koDrumHorizontal', 'a liquid level fraction at one', { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 8, liquidFraction: 1 }],
  ['koDrumHorizontal', 'a negative liquid level fraction', { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 8, liquidFraction: -0.5 }],
  ['koDrumHorizontal', 'a liquid level fraction given as null', { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 8, liquidFraction: null }],
  ['radiationIntensity', 'a distance of zero', { qKw: 50000, distanceM: 0 }],
  ['radiationIntensity', 'a radiated fraction above one', { qKw: 50000, distanceM: 100, fractionRadiated: 1.5 }],
  ['radiationIntensity', 'a transmissivity above one', { qKw: 50000, distanceM: 100, transmissivity: 2 }],
  ['distanceForIntensity', 'an allowable intensity of zero', { qKw: 50000, allowableKwM2: 0 }],
  ['distanceForIntensity', 'a radiated fraction of zero', { qKw: 50000, allowableKwM2: 4.73, fractionRadiated: 0 }],
  ['distanceForIntensity', 'a negative transmissivity', { qKw: 50000, allowableKwM2: 4.73, transmissivity: -1 }],
  ['blowdown', 'an end pressure above the start pressure', { volumeFt3: 500, p0Psia: 200, t0R: 560, pEndPsia: 900, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1 }],
  ['blowdown', 'a negative discharge coefficient', { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1, cd: -0.85 }],
  ['blowdown', 'a time step of zero', { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1, dtS: 0 }],
  ['blowdown', 'a negative time step', { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1, dtS: -1 }],
  ['blowdown', 'an orifice too small to finish inside the time limit', { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 0.02 }],
];

// The three calls that used to return a depressuring time of ZERO with no
// error key and the vessel still at its start pressure, at the smallest
// orifice that did it. The digest runs them and prints what the engine returns
// NOW, which is a march that reaches the end pressure.
export const ZERO_TIME_CASES = [
  { volumeFt3: 5, p0Psia: 1014.7, t0R: 560, pEndPsia: 114.7, mw: 19, k: 1.3, z: 0.9, orificeDIn: 4 },
  { volumeFt3: 100, p0Psia: 1014.7, t0R: 560, pEndPsia: 114.7, mw: 19, k: 1.3, z: 0.9, orificeDIn: 17 },
  { volumeFt3: 500, p0Psia: 1014.7, t0R: 560, pEndPsia: 114.7, mw: 19, k: 1.3, z: 0.9, orificeDIn: 38 },
];

// A drum read at one holdup with the level convention stated, and the SAME
// drum read as if the fraction were an AREA fraction, so the digest can print
// the difference the convention makes without asserting it.
export const CONVENTION_PROBE = { qVaporAcfs: 120, udFtS: 1.73, diameterFt: 8 };
export const CONVENTION_LEVELS = [0.1, 0.25, 0.5, 0.75, 0.9];

/* --------------------------------- the bare-number export contract */
//
// Five exports return a bare number rather than an object. The digest
// MEASURES that contract with typeof rather than listing it, so no
// function can drift out of it silently, and asserts each has at least one
// refusing input.

export const BARE_NUMBER_EXPORTS = [
  'gasConstantC', 'criticalPressureRatio', 'subcriticalF2',
  'liquidKvUnclamped', 'liquidKv', 'steamKn', 'segmentAreaFraction',
];

// Two exports are neither a function nor an object: a published table and a
// derived constant. The digest MEASURES that with typeof rather than listing
// it, so nothing drifts out of the contract silently.
export const DATA_EXPORTS = ['API_ORIFICES', 'RADIATION_LEVELS'];
export const CONSTANT_EXPORTS = ['NAPIER_UNITY_PSIA'];
