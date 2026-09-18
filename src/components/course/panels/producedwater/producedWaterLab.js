// Teaching lab for FC7, Produced Water Treatment. The three explorer panels,
// the course page and the vitest files all read this one module, so a number
// shown to a learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINE'S OWN OUTPUT. Every viscosity,
// density, bin set, cut size, grade efficiency, centrifugal field, turndown,
// shear penalty, bubble rise velocity, gas holdup, filter coefficient, stage
// removal, outlet concentration, droplet median, warning and refusal below is a
// return value of engines/facilities/producedWater.js, vendored sha-identical
// with petrolord-engines 9874d58, the FC7-1 repair.
//
// NOTHING IN THIS FILE COMPUTES A PRODUCED WATER QUANTITY. Where a reader
// carries a value the teaching digest calls "derived", it is the digest's own
// arithmetic on numbers the engine returned in the same block, with the
// arithmetic stated: a ratio of two engine cut sizes, a difference of two
// engine densities, a product of a cut and a root, a spread across a swept
// column. The lab and tools/course-waves/producedwater/digest.txt agree because
// both call the engine on the same inputs, and neither copied the other.
//
// THIS LAB HOLDS NO GRADING TOLERANCE. The tolerance of every graded field is
// made in exactly one place, gradedTolerance.js, and written out of that one
// derivation into fields.json and precision.json. This module imports
// `GRADED_FIELDS` for the published ORDER and the TIER of each field and never
// reads its stated tolerance, so there is no second copy here to go stale. Two
// sibling waves shipped a stale third copy of a tolerance table. The capstone
// rows this file returns are TRIPLES, so there is no slot for a band to sit in,
// and producedWaterLab.test.js asserts both halves of that: nothing matching
// /tolerance|tol$/i is exported, and no published band value appears as a
// literal anywhere in this source.
//
// NOTHING IS MEASURED AT IMPORT TIME, AND THAT IS A DECISION. A sibling wave's
// lab runs a bisecting measurement block at module load, which then executes in
// the browser for every learner who opens the course. This module has nothing
// to bisect: every constant it reports is either read off `DECLARED_CONSTANTS`
// or recovered by ONE arithmetic step on ONE engine return, and the heaviest
// thing here is a sixty bin quadrature through four stages. So every reader is
// a plain function, called only by the panel that displays it, and a learner
// who opens the water explorer never runs the liner sweep or the train.
//
// UNITS. The engine's own units throughout: degrees Celsius, ppm of total
// dissolved solids, degrees API, Pa.s for viscosity, kg/m3 for density, m3/s
// and m for the equipment, micron for droplets and bubbles, ppm for oil in
// water, percent for a removal, seconds for a residence and m/hr for a bed
// loading. Barrels a day appear only where a stream is named, and the barrel is
// exact.
//
// NO P LABEL. Nothing in this course is a distribution in the statistical
// sense that a percentile would describe, so no P label belongs anywhere in it.
// The droplet distribution is a volume distribution over size, and its median
// is reported as a median.
//
// THE CLOCK. Nothing in this domain reads a clock or a random number. There is
// no date input, no seed and no default that falls back to today, so every
// reader is a pure function of its engine inputs. A clock gate in
// producedWaterLab.test.js proves it under two faked system dates, and a
// timezone gate rebuilds the whole digest a second time west of Greenwich.
//
// REPAIR HISTORY. Digest Section 22 is the one framed history section and
// `repairHistory()` is the reader for it. Nothing else in this file describes
// what the engine used to do.
//
// PURITY. Every reader is pure and deterministic, and every one returns a fresh
// object. Nothing is memoised.

import producedWaterGolden from '@petrolord/engines/test-data/facilities/goldens/producedwater_cases.json';
// A namespace import rather than named imports: eslint's node resolver follows
// the node_modules symlink to the SHARED checkout's engines, which predate FC1
// and carry no engines/facilities at all. Vite and vitest alias
// @petrolord/engines to this worktree's packages/engines, which does.
// import/namespace still checks members against the shared copy, so it is off
// for this file only; producedWaterLab.test.js proves every member resolves.
/* eslint-disable import/namespace */
import * as P from '@petrolord/engines/engines/facilities/producedWater.js';
import { GRADED_FIELDS } from './gradedTolerance.js';

export const GOLD = producedWaterGolden;
/** The engine's own frozen constants, read rather than copied. */
export const DECLARED = P.DECLARED_CONSTANTS;
/** The half of the API 421 velocity rule this module carries, and its note. */
export const API_421 = P.API_421;
export const CONCENTRATION_BASIS = P.CONCENTRATION_BASIS;
export const DISSOLVED_OIL_NOTE = P.DISSOLVED_OIL_NOTE;

/** The published case counts, so a golden that loses a group is caught. */
export const goldenCounts = () => {
  const groups = Object.keys(GOLD).filter((k) => Array.isArray(GOLD[k])).sort();
  return {
    groups,
    groupCount: groups.length,
    rows: groups.reduce((s, k) => s + GOLD[k].length, 0),
    declaredConstantKeys: Object.keys(GOLD.declaredConstants || {}).length,
  };
};

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a produced water quantity.
// ---------------------------------------------------------------------------

/**
 * A ROW LABELLED AN ANSWER MUST ANSWER. Every engine call whose result a panel
 * prints as an answer goes through this, so a refusal can never be rendered
 * with its fields read as `undefined` under a heading that promises numbers.
 * This is the generator's own guard, in the shape a browser module can use.
 */
export const answered = (label, r) => {
  if (r && typeof r === 'object' && typeof r.error === 'string') {
    throw new Error(`the lab asked for "${label}" as an answer and the engine REFUSED it: ${r.error}`);
  }
  if (r === undefined || r === null || (typeof r === 'number' && Number.isNaN(r))) {
    throw new Error(`the lab asked for "${label}" as an answer and the engine returned ${String(r)}`);
  }
  return r;
};

/**
 * A ROW LABELLED A REFUSAL MUST REFUSE. It throws when the call ANSWERED,
 * because a refusal row computed from a successful call prints real numbers
 * under a false heading, which no numeric sweep can see.
 */
export const refused = (label, r) => {
  if (!r || typeof r.error !== 'string') {
    throw new Error(`the lab labels "${label}" a refusal and the engine ANSWERED it. Keys returned: ${r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r)}`);
  }
  return r;
};

/** One refusal as the digest and the panels present one: the input and the engine's words. */
export const refusalRow = (label, r) => ({ label, error: refused(label, r).error, raw: r });

/**
 * A leaf that says it has no answer with a bare NaN. Asserted to be NaN rather
 * than assumed, so a leaf that starts returning a number is caught here.
 */
export const leafNaN = (label, v) => {
  if (!(typeof v === 'number' && Number.isNaN(v))) {
    throw new Error(`the lab labels "${label}" a bare NaN and the leaf returned ${String(v)}`);
  }
  return { label, isNaN: true };
};

/**
 * NAME THE WARNING FROM THE RETURN VALUES, AND CHECK THE NAME. A column that
 * reads `r.warning ? 'the thing I had in mind' : 'none'` is a CLAIM about which
 * of a device's several warnings fired. Every warning label here is built by
 * testing the CONDITIONS against the engine's own returned quantities and then
 * checked against whether the engine warned at all, so a label and a warning
 * cannot disagree without throwing.
 */
export const warnLabel = (r, conditions) => {
  const fired = conditions.filter(([, holds]) => holds).map(([name]) => name);
  const warned = Boolean(r.warning);
  if (fired.length && !warned) {
    throw new Error(`this row names the warning(s) ${fired.join(', ')} and the engine warned about nothing at all`);
  }
  if (!fired.length && warned) {
    throw new Error(`this row names no warning and the engine warned: ${r.warning}`);
  }
  return fired.length ? fired.join(' and ') : 'none';
};

/** The three conditions a flotation return warns on, named off its own values. */
export const flotationWarnLabel = (r) => warnLabel(r, [
  // READ THE DECLARED CONSTANT, NEVER RESTATE IT. A second copy of a threshold
  // is the same defect as an undeclared one, one step further from the engine.
  [`less than the ${DECLARED.flotationResidenceWarnS} s of residence this module warns below`, r.residenceS < DECLARED.flotationResidenceWarnS],
  ['a gas holdup past the swarm limit', r.gasHoldup > DECLARED.gasHoldupWarn],
  ['a cut coarser than produced water carries', r.d50cMicron > DECLARED.coarseCutWarnMicron],
]);

/** Agreement with a golden row is a RESULT WITH A SIZE, never an identity. */
export const relDiff = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);

// ---------------------------------------------------------------------------
// THE TEACHING STREAMS AND SWEEPS, copied VERBATIM from
// tools/course-waves/producedwater/fc7_fields.mjs, which fc7_dump.mjs imports.
// The lab test compares each declaration with the wave file text and fails on
// any drift, so these cannot be edited here alone.
//
// These are NOT the capstone plants. The capstone runs three different streams
// at conditions that share nothing with these, they are declared at the foot of
// this file under neutral names, and the capstone guard proves both directions.
// ---------------------------------------------------------------------------

/** One barrel, exactly, in cubic metres. */
export const BARREL_M3 = 0.158987294928;
export const m3PerSecond = (bwpd) => (bwpd * BARREL_M3) / 86400;

export const UZERE_WATER = { tC: 41, tdsPpm: 62000 };
export const UZERE_OIL = { apiGravity: 24, tC: 41 };
export const UZERE_BWPD = 28000;
export const UZERE_INLET = { oiwPpm: 650, d50Micron: 26, sigma: 0.8 };
export const UZERE_BASIN = { lengthM: 10, widthM: 2.6, depthM: 1.4 };
export const UZERE_BASIN_SHALLOW_DEPTH_M = 0.9;
export const UZERE_PLATES = { plateAreaM2: 3.0, nPlates: 30 };
export const UZERE_DROPLET_MICRON = 26;

export const KOKORI_WATER = { tC: 53, tdsPpm: 15000 };
export const KOKORI_OIL = { apiGravity: 29, tC: 53 };
export const KOKORI_BWPD = 75000;
export const KOKORI_LINERS = { nLiners: 200 };
export const KOKORI_FLOTATION = {
  cellVolumeM3: 12, nCells: 5, cellDepthM: 2.8, gasRatio: 0.25, bubbleMicron: 400,
};
export const KOKORI_FILTER = { areaM2: 20, bedDepthM: 0.8, mediaMicron: 650 };

export const OGBOTOBO_WATER = { tC: 78, tdsPpm: 120000 };
export const OGBOTOBO_OIL = { apiGravity: 19, tC: 78 };
export const OGBOTOBO_BWPD = 65000;
export const OGBOTOBO_INLET = { oiwPpm: 1800, d50Micron: 14, sigma: 0.95 };
export const OGBOTOBO_BASIN = { lengthM: 18, widthM: 4.0, depthM: 2.2 };
export const OGBOTOBO_LINERS = { nLiners: 220 };
export const OGBOTOBO_FLOTATION = {
  cellVolumeM3: 30, nCells: 2, cellDepthM: 3.2, gasRatio: 0.15, bubbleMicron: 120,
};
export const OGBOTOBO_FILTER = { areaM2: 22, bedDepthM: 1.6, mediaMicron: 900 };
export const OGBOTOBO_SPEC_TIGHT_PPM = 30;
export const OGBOTOBO_SPEC_LOOSE_PPM = 60;
export const OGBOTOBO_CALLER_FLOOR_PPM = 5;
export const FLOOR_DEMO_INLET = { oiwPpm: 650, d50Micron: 26, sigma: 0.7 };
export const FLOOR_DEMO_CUT_MICRON = 2;
export const FLOOR_WIDE_STAGES = 8;
export const FLOOR_WIDE_CUT_MICRON = 4;

export const VISC_T_SWEEP = [20, 35, 50, 65, 80, 95];
export const VISC_TDS_SWEEP = [0, 25000, 62000, 120000, 200000, 280000];
export const API_SWEEP = [12, 19, 24, 30, 38, 46];
export const VISC_BAND = { lowEdge: -10, belowLow: -10.5, highEdge: 200, aboveHigh: 200.5 };
export const DENSITY_BAND = { lowEdge: 0, belowLow: -0.5, highEdge: 100, aboveHigh: 100.5 };
export const TDS_BAND = { max: 300000, justOver: 300001, negative: -1 };
export const API_BAND = {
  low: 5, belowLow: 4.9, high: 100, aboveHigh: 100.1, infinite: -131.5,
};

export const NBINS_SWEEP = [30, 60, 120, 600];
export const SPAN_SWEEP = [3, 4, 5, 6];
export const NBINS_REFUSED = { fractional: 60.5, belowFloor: 4 };
export const SPAN_REFUSED = 2;
export const SIGMA_SWEEP = [0.5, 0.7, 0.8, 1.0, 1.5];
export const GRADE_RATIOS = [0.25, 0.5, 0.75, 1.0, 1.5, 2, 4];
export const GRADE_SHARPNESS = [2, 3];

export const BASIN_AREA_SWEEP = [{ lengthM: 6, widthM: 2 }, { lengthM: 10, widthM: 2.6 },
  { lengthM: 14, widthM: 3 }, { lengthM: 20, widthM: 4 }];
export const SHORT_CIRCUIT_SWEEP = [1.0, 1.3, 1.5, 1.8, 2.5];
export const SHORT_CIRCUIT_REFUSED = [0, -2, 6];
export const PLATE_COUNT_SWEEP = [10, 30, 60, 120];

export const LINER_SWEEP = [600, 460, 350, 280, 230, 200, 177, 150, 120];
export const LINER_REFUSED = [115, 1];
export const LINER_STARVED = 700;
export const LINER_GEOMETRY_SWEEP = [
  { linerDiameterM: 0.035, linerLengthM: 0.5 },
  { linerDiameterM: 0.035, linerLengthM: 0.7 },
  { linerDiameterM: 0.035, linerLengthM: 1.0 },
  { linerDiameterM: 0.01, linerLengthM: 0.7 },
  { linerDiameterM: 0.02, linerLengthM: 0.7 },
  { linerDiameterM: 0.06, linerLengthM: 0.7 },
  { linerDiameterM: 0.1, linerLengthM: 0.7 },
];
export const LINER_BORE_LEG_LENGTH_M = 0.7;
export const CORE_FRACTION_SWEEP = [0.2, 0.35, 0.5, 0.65];
export const CORE_FRACTION_REFUSED = 0.75;

export const BUBBLE_SWEEP = [40, 80, 150, 300, 600, 1200];
export const GAS_RATIO_SWEEP = [0.02, 0.05, 0.12, 0.25, 0.6, 1.5];
export const CELL_DEPTH_SWEEP = [1.5, 2.8, 4.0, 6.0];
export const CELL_ARRANGEMENT = [
  { nCells: 1, cellVolumeM3: 60 }, { nCells: 2, cellVolumeM3: 30 },
  { nCells: 4, cellVolumeM3: 15 }, { nCells: 12, cellVolumeM3: 5 },
];
export const ARRANGEMENT_TOTAL_GAS_RATIO = 0.3;
export const IGF_PRESET = { gasRatio: 0.2, bubbleMicron: 300 };
export const DAF_PRESET = { gasRatio: 0.03, bubbleMicron: 80 };
export const FLOTATION_REFUSED = { gasRatio: 4, bubbleMicron: 5, attachmentEfficiency: 0 };

export const BED_DEPTH_SWEEP = [0.1, 0.4, 0.8, 1.6, 3.0, 10.0];
export const MEDIA_SWEEP = [400, 650, 800, 1200, 1600];
export const LOADING_AREA_SWEEP = [8, 12, 20, 40, 80];
export const FILTER_FLOOR_ANSWER_AREAS = [200, 400, 490];
export const FILTER_FLOOR_REFUSED_AREAS = [600, 2000];

export const STOKES_PROBE_MICRON = 100;
export const DUST_CUT_MICRON = 0.001;
export const BUBBLE_REFERENCE_MICRON = 300;
export const KOKORI_TRAIN_INLET = { oiwPpm: 900, d50Micron: 20, sigma: 0.7 };
export const RISE_GAP_SWEEP = [5, 20, 60, 120, 240, 500];

export const IDENTICAL_STAGE_CUT_MICRON = 9;
export const IDENTICAL_STAGE_COUNT = 5;
export const BROKEN_PLATE_AREA = null;

/** The cut sizes Section 8 reads a removal and an outlet median off. */
export const DEVICE_CUT_SWEEP = [30, 20, 12, 6, 2];
/** The one cut the sigma sweep is read at. */
export const SIGMA_PROBE_CUT_MICRON = 12;
/** The cut sizes Section 15 watches the outlet median track. */
export const MEDIAN_TRACKING_CUTS = [20, 12, 8, 5, 3, 1.5];
/** The attachment efficiencies Section 17 sweeps the one calibration over. */
export const ATTACHMENT_SWEEP = [0.002, 0.005, DECLARED.attachmentEfficiency, 0.02, 0.05];
/** The fluid every one of the five doors is handed in Section 16. */
export const BAD_FLUID = { rhoWater: 860, rhoOil: 1010, muPaS: 6e-4 };

/**
 * THE CONTRACT CENSUS. Every export of the module, asked a question it can
 * answer and a question it cannot, with the SHAPE of both answers read off the
 * return value rather than described. Measured, never listed: a list goes stale
 * the first time an export is added.
 */
export const contractCensus = (M) => {
  const fluid = { rhoWater: 1010, rhoOil: 860, muPaS: 6e-4 };
  const bad = { rhoWater: 860, rhoOil: 1010, muPaS: 6e-4 };
  const probes = [
    ['waterViscosityPaS', () => M.waterViscosityPaS({ tC: 40, tdsPpm: 10000 }), () => M.waterViscosityPaS({ tC: 400, tdsPpm: 10000 })],
    ['waterDensityKgM3', () => M.waterDensityKgM3({ tC: 40, tdsPpm: 10000 }), () => M.waterDensityKgM3({ tC: 400 })],
    ['oilDensityKgM3', () => M.oilDensityKgM3({ apiGravity: 30, tC: 40 }), () => M.oilDensityKgM3({ apiGravity: -200, tC: 40 })],
    ['logNormalCdf', () => M.logNormalCdf({ d: 20, d50: 25, sigma: 0.7 }), () => M.logNormalCdf({ d: -1, d50: 25, sigma: 0.7 })],
    ['dropletBins', () => M.dropletBins({ d50: 25, sigma: 0.7 }), () => M.dropletBins({ d50: 25, sigma: 9 })],
    ['gradeEfficiency', () => M.gradeEfficiency({ dMicron: 20, d50cMicron: 10 }), () => M.gradeEfficiency({ dMicron: 20, d50cMicron: 0 })],
    ['applyDevice', () => M.applyDevice({ bins: M.dropletBins({ d50: 25, sigma: 0.7 }).bins, d50cMicron: 10 }), () => M.applyDevice({ bins: [], d50cMicron: 10 })],
    ['medianOfBins', () => M.medianOfBins(M.dropletBins({ d50: 25, sigma: 0.7 }).bins), () => M.medianOfBins([])],
    ['stokesRiseMS', () => M.stokesRiseMS({ dMicron: 30, ...fluid }), () => M.stokesRiseMS({ dMicron: 30, ...bad })],
    ['terminalRiseMS', () => M.terminalRiseMS({ dMicron: 300, rhoHeavy: 1010, rhoLight: 1.2, muPaS: 6e-4 }), () => M.terminalRiseMS({ dMicron: 300, rhoHeavy: 1.2, rhoLight: 1010, muPaS: 6e-4 })],
    ['apiSeparator', () => M.apiSeparator({ flowM3S: 0.02, lengthM: 10, widthM: 3, depthM: 1.2, ...fluid }), () => M.apiSeparator({ flowM3S: 0.02, lengthM: 10, widthM: 3, depthM: 1.2, ...bad })],
    ['plateInterceptor', () => M.plateInterceptor({ flowM3S: 0.02, plateAreaM2: 2, nPlates: 40, ...fluid }), () => M.plateInterceptor({ flowM3S: 0.02, plateAreaM2: 2, nPlates: 0, ...fluid })],
    ['hydrocyclone', () => M.hydrocyclone({ flowM3S: 0.06, nLiners: 100, ...fluid }), () => M.hydrocyclone({ flowM3S: 0.06, nLiners: 10, ...fluid })],
    ['flotation', () => M.flotation({ flowM3S: 0.06, cellVolumeM3: 20, nCells: 3, ...fluid }), () => M.flotation({ flowM3S: 0.06, cellVolumeM3: 20, nCells: 3, gasRatio: 0, ...fluid })],
    ['mediaFilter', () => M.mediaFilter({ flowM3S: 0.06, areaM2: 15 }), () => M.mediaFilter({ flowM3S: 0.06, areaM2: 0 })],
    ['treatmentTrain', () => M.treatmentTrain({ inletOiwPpm: 500, inletD50Micron: 25, devices: [{ name: 'd', d50cMicron: 12, sharpness: 3 }] }), () => M.treatmentTrain({ inletOiwPpm: 500, inletD50Micron: 25, devices: 'not an array' })],
  ];
  const shapeOf = (v) => {
    if (typeof v === 'number') return Number.isNaN(v) ? 'a bare NaN' : 'a bare number';
    if (v && typeof v === 'object') return typeof v.error === 'string' ? 'an object with a named error' : 'an object of results';
    return typeof v;
  };
  const rows = probes.map(([name, good, poor]) => ({
    name, answers: shapeOf(good()), refuses: shapeOf(poor()),
  }));
  const exported = Object.keys(M).sort();
  const callable = exported.filter((k) => typeof M[k] === 'function');
  const frozen = exported.filter((k) => typeof M[k] !== 'function');
  return { rows, exported, callable, frozen };
};

/** The census of the module this lab actually imported. */
export const census = () => {
  const c = contractCensus(P);
  return {
    ...c,
    errorContract: c.rows.filter((r) => r.refuses === 'an object with a named error').length,
    leaves: c.rows.filter((r) => r.refuses === 'a bare NaN'),
  };
};

// ---------------------------------------------------------------------------
// THE THREE TEACHING STREAMS, RUN. Each is a plain function, so a panel that
// shows one stream never runs the other two.
// ---------------------------------------------------------------------------

/** UZERE, the Associate stream: a gravity front end. */
export const uzere = () => {
  const q = m3PerSecond(UZERE_BWPD);
  const mu = answered('the UZERE viscosity', P.waterViscosityPaS(UZERE_WATER));
  const rhoW = answered('the UZERE brine density', P.waterDensityKgM3(UZERE_WATER));
  const rhoO = answered('the UZERE crude density', P.oilDensityKgM3(UZERE_OIL));
  const fluid = { rhoWater: rhoW.rhoKgM3, rhoOil: rhoO.rhoKgM3, muPaS: mu.muPaS };
  return {
    q,
    mu,
    rhoW,
    rhoO,
    fluid,
    basin: answered('the UZERE basin', P.apiSeparator({ flowM3S: q, ...UZERE_BASIN, ...fluid })),
    plate: answered('the UZERE plate pack', P.plateInterceptor({ flowM3S: q, ...UZERE_PLATES, ...fluid })),
    bins: answered('the UZERE inlet bins', P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma })),
    rise: answered('the UZERE median droplet rise', P.stokesRiseMS({ dMicron: UZERE_DROPLET_MICRON, ...fluid })),
  };
};

/** KOKORI, the Professional stream: the three devices gravity alone does not size. */
export const kokori = () => {
  const q = m3PerSecond(KOKORI_BWPD);
  const mu = answered('the KOKORI viscosity', P.waterViscosityPaS(KOKORI_WATER));
  const rhoW = answered('the KOKORI brine density', P.waterDensityKgM3(KOKORI_WATER));
  const rhoO = answered('the KOKORI crude density', P.oilDensityKgM3(KOKORI_OIL));
  const fluid = { rhoWater: rhoW.rhoKgM3, rhoOil: rhoO.rhoKgM3, muPaS: mu.muPaS };
  return {
    q,
    mu,
    rhoW,
    rhoO,
    fluid,
    cyclone: answered('the KOKORI liner bank', P.hydrocyclone({ flowM3S: q, ...KOKORI_LINERS, ...fluid })),
    flotation: answered('the KOKORI flotation', P.flotation({ flowM3S: q, ...KOKORI_FLOTATION, ...fluid })),
    filter: answered('the KOKORI bed', P.mediaFilter({ flowM3S: q, ...KOKORI_FILTER })),
  };
};

/** OGBOTOBO, the Expert stream: four stages, where the coupling is easiest to watch. */
export const ogbotobo = () => {
  const q = m3PerSecond(OGBOTOBO_BWPD);
  const mu = answered('the OGBOTOBO viscosity', P.waterViscosityPaS(OGBOTOBO_WATER));
  const rhoW = answered('the OGBOTOBO brine density', P.waterDensityKgM3(OGBOTOBO_WATER));
  const rhoO = answered('the OGBOTOBO crude density', P.oilDensityKgM3(OGBOTOBO_OIL));
  const fluid = { rhoWater: rhoW.rhoKgM3, rhoOil: rhoO.rhoKgM3, muPaS: mu.muPaS };
  const basin = answered('the OGBOTOBO basin', P.apiSeparator({ flowM3S: q, ...OGBOTOBO_BASIN, ...fluid }));
  const cyclone = answered('the OGBOTOBO liner bank', P.hydrocyclone({ flowM3S: q, ...OGBOTOBO_LINERS, ...fluid }));
  const flot = answered('the OGBOTOBO flotation', P.flotation({ flowM3S: q, ...OGBOTOBO_FLOTATION, ...fluid }));
  const filt = answered('the OGBOTOBO bed', P.mediaFilter({ flowM3S: q, ...OGBOTOBO_FILTER }));
  const devices = [
    { name: 'API 421 basin', ...basin },
    { name: 'Hydrocyclone bank', ...cyclone },
    { name: 'Induced gas flotation', ...flot },
    { name: 'Walnut shell filter', ...filt },
  ];
  return {
    q,
    mu,
    rhoW,
    rhoO,
    fluid,
    basin,
    cyclone,
    flotation: flot,
    filter: filt,
    devices,
    train: answered('the OGBOTOBO train', P.treatmentTrain({
      inletOiwPpm: OGBOTOBO_INLET.oiwPpm,
      inletD50Micron: OGBOTOBO_INLET.d50Micron,
      sigma: OGBOTOBO_INLET.sigma,
      devices,
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 1. What this engine treats, and what it refuses.
// ---------------------------------------------------------------------------

export const whatThisEngineTreats = () => {
  const c = census();
  const uz = uzere();
  const ko = kokori();
  const og = ogbotobo();
  return {
    exportedCount: c.exported.length,
    callableCount: c.callable.length,
    frozenCount: c.frozen.length,
    errorContract: c.errorContract,
    leafCount: c.leaves.length,
    uzere: {
      qM3S: uz.q,
      muPaS: uz.mu.muPaS,
      rhoWaterKgM3: uz.rhoW.rhoKgM3,
      rhoOilKgM3: uz.rhoO.rhoKgM3,
      basinCutMicron: uz.basin.d50cMicron,
      plateCutMicron: uz.plate.d50cMicron,
    },
    kokori: {
      turndownRatio: ko.cyclone.turndownRatio,
      gField: ko.cyclone.gField,
      cycloneCutMicron: ko.cyclone.d50cMicron,
      flotationCutMicron: ko.flotation.d50cMicron,
      filterCutMicron: ko.filter.d50cMicron,
    },
    ogbotobo: {
      outletOiwPpm: og.train.outletOiwPpm,
      overallRemovalPct: og.train.overallRemovalPct,
      inletMedianMicron: og.train.inletMedianMicron,
      outletMedianMicron: og.train.outletMedianMicron,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 2. The numbers this module stands on, in four kinds.
//
// THE MEASURED KIND ONE VALUES ARE RECOVERED FROM THE ENGINE, never typed. Each
// is one arithmetic step on one engine return, with the step stated, which is
// why this file needs no bisection and no import time work.
// ---------------------------------------------------------------------------

/** The table rows of KIND TWO, and what each declared constant sets. */
export const DECLARED_ROWS = [
  ['vogelA', 'the fresh water viscosity fit, coefficient'],
  ['vogelB', 'the same fit, numerator'],
  ['vogelC', 'the same fit, offset'],
  ['salinityViscosityMultiplier', 'how fast viscosity rises with dissolved solids'],
  ['brineDensitySlopeKgM3', 'how fast density rises with dissolved solids'],
  ['crudeThermalExpansionPerC', 'how fast the crude thins with temperature'],
  ['crudeReferenceWaterKgM3', 'the water the API gravity specific gravity is taken against'],
  ['defaultNBins', 'the droplet grid, bin count'],
  ['defaultSpanSigma', 'the droplet grid, how far either side of the median it reaches'],
  ['defaultSharpness', 'the grade curve of the gravity and centrifugal devices'],
  ['interceptionCoefficient', 'the Stokes-flow interception efficiency coefficient'],
  ['shortCircuitFDefault', 'the API 421 turbulence and short-circuiting allowance'],
  ['plateEfficiencyFactor', 'the fraction of a plate pack projected area that settles'],
  ['linerDiameterM', 'the liner bore'],
  ['linerLengthM', 'the liner length, which sets its residence time'],
  ['designFlowPerLinerM3S', 'the flow one liner is rated at'],
  ['gFieldAtDesign', 'the field one liner develops at that flow'],
  ['coreRadiusFraction', 'where the oil core sits, as a fraction of the radius'],
  ['starvedTurndown', 'the bottom of the liner operating envelope'],
  ['overloadTurndown', 'the top of it, past which the field stops rising'],
  ['maxTurndown', 'past which the module refuses to answer at all'],
  ['flotationCellDepthM', 'the default cell depth, an input since FC7-0'],
  ['flotationGasDensityKgM3', 'the gas in the bubbles, an input'],
  ['bubbleMicronDefault', 'the default bubble'],
  ['gasRatioDefault', 'the default gas to water volume ratio'],
  ['gasHoldupWarn', 'the holdup past which a swarm is no longer independent bubbles'],
  ['filterCoefficientPerM', 'the bed filter coefficient at its reference triple'],
  ['filterReferenceDropletMicron', 'the droplet that coefficient is declared at'],
  ['filterReferenceMediaMicron', 'the grain size it is declared at'],
  ['filterReferenceLoadingMHr', 'the loading rate it is declared at'],
  ['filterLoadingExponent', 'how fast capture falls with loading rate'],
  ['filterBreakthroughLoadingMHr', 'the loading this module warns past'],
  ['filterMinLoadingMHr', 'the loading this module REFUSES below, because the coefficient is declared at one rate'],
  ['flotationResidenceWarnS', 'the flotation residence this module warns below'],
  ['minNBins', 'the fewest bins the distribution will be described on'],
  ['minSpanSigma', 'the fewest sigma either side of the median the grid must span'],
  ['stokesReynoldsLimit', 'the Reynolds number Stokes law is stated to here'],
  ['tdsMaxPpm', 'the salinity the linear correction is stated to'],
  ['sigmaMax', 'the widest droplet spread this module will describe'],
];

export const fourKinds = () => {
  const uz = uzere();
  const ko = kokori();
  const cdfAtCut = answered('the cdf at the cut', P.gradeEfficiency({
    dMicron: 10, d50cMicron: 10, sharpness: DECLARED.defaultSharpness,
  }));
  // The half-area radius of a round liner. One over the root of two, which is
  // where half the flow area sits, so it is where the median droplet enters.
  const halfAreaRadiusFraction = Math.SQRT1_2;
  // Standard gravity, recovered from one Stokes return: eighteen times the
  // viscosity times the rise velocity, over the diameter squared times the
  // density difference.
  //
  // THE DIAMETER IN METRES IS RECOVERED FROM THE ENGINE TOO, never converted
  // here. The engine reports the Reynolds number of the same droplet, which is
  // the density times the velocity times the diameter over the viscosity, so
  // the diameter falls out of two numbers it already returned and this file
  // types no micron conversion of its own.
  const gravityProbe = answered('a rise to measure gravity with', P.stokesRiseMS({
    dMicron: STOKES_PROBE_MICRON, ...uz.fluid,
  }));
  const probeDiameterM = (gravityProbe.reynolds * uz.fluid.muPaS)
    / (uz.fluid.rhoWater * gravityProbe.vMS);
  const measuredG = (18 * uz.fluid.muPaS * gravityProbe.vMS)
    / (probeDiameterM ** 2 * (uz.fluid.rhoWater - uz.fluid.rhoOil));
  // The natural logarithm of two, recovered from one bed return: the filter
  // coefficient at the reported cut size, times the bed depth.
  const ln2Probe = answered('a bed to measure the half point with', P.mediaFilter({
    flowM3S: ko.q, ...KOKORI_FILTER,
  }));
  const measuredLn2 = ln2Probe.filterCoefficientPerM
    * (ln2Probe.d50cMicron / ln2Probe.referenceDropletMicron) ** 2 * ln2Probe.bedDepthM;
  // The 18 in the Stokes group, recovered the other way round from the same
  // rise: gravity times the diameter squared times the density difference, over
  // the viscosity times the velocity.
  const stokes18 = answered('a rise to measure the Stokes group with', P.stokesRiseMS({
    dMicron: STOKES_PROBE_MICRON, ...uz.fluid,
  }));
  const stokes18DiameterM = (stokes18.reynolds * uz.fluid.muPaS)
    / (uz.fluid.rhoWater * stokes18.vMS);
  const measured18 = (9.80665 * stokes18DiameterM ** 2
    * (uz.fluid.rhoWater - uz.fluid.rhoOil)) / (uz.fluid.muPaS * stokes18.vMS);
  const declaredRows = DECLARED_ROWS.map(([key, what]) => {
    if (!(key in DECLARED)) {
      throw new Error(`DECLARED_CONSTANTS has no key ${key}, so this table row describes nothing`);
    }
    return { key, value: DECLARED[key], what };
  });
  return {
    cdfAtCut,
    halfAreaRadiusFraction,
    interceptionSharpness: DECLARED.interceptionSharpness,
    probeMicron: STOKES_PROBE_MICRON,
    measuredG,
    measuredLn2,
    stokesProbeVMS: stokes18.vMS,
    measured18,
    declaredRows,
    declaredKeyCount: Object.keys(DECLARED).length,
    declaredRowCount: DECLARED_ROWS.length,
    untabulatedCount: Object.keys(DECLARED).length - DECLARED_ROWS.length,
    attachmentEfficiency: DECLARED.attachmentEfficiency,
    velocityRuleComplete: API_421.velocityRuleComplete,
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. Where temperature and salinity finally matter.
// ---------------------------------------------------------------------------

export const temperatureAndSalinity = () => {
  const uz = uzere();
  const hot = answered('the viscosity at the top of the sweep', P.waterViscosityPaS({
    tC: VISC_T_SWEEP[VISC_T_SWEEP.length - 1], tdsPpm: UZERE_WATER.tdsPpm,
  }));
  const cold = answered('the viscosity at the bottom of the sweep', P.waterViscosityPaS({
    tC: VISC_T_SWEEP[0], tdsPpm: UZERE_WATER.tdsPpm,
  }));
  const byTemperature = VISC_T_SWEEP.map((tC) => {
    const r = answered(`the viscosity at ${tC} C`, P.waterViscosityPaS({ tC, tdsPpm: UZERE_WATER.tdsPpm }));
    // DERIVED, each brine viscosity over the last row of the same column.
    return { tC, ...r, overHot: r.muPaS / hot.muPaS };
  });
  const bySalinity = VISC_TDS_SWEEP.map((tdsPpm) => ({
    tdsPpm,
    ...answered(`the viscosity at ${tdsPpm} ppm`, P.waterViscosityPaS({ tC: UZERE_WATER.tC, tdsPpm })),
  }));
  const densities = [
    [UZERE_WATER.tC, 0], [UZERE_WATER.tC, UZERE_WATER.tdsPpm],
    [KOKORI_WATER.tC, KOKORI_WATER.tdsPpm], [OGBOTOBO_WATER.tC, OGBOTOBO_WATER.tdsPpm],
  ].map(([tC, tdsPpm]) => ({
    tC,
    tdsPpm,
    ...answered(`the brine density at ${tC} C and ${tdsPpm} ppm`, P.waterDensityKgM3({ tC, tdsPpm })),
  }));
  const crude = API_SWEEP.map((apiGravity) => {
    const r = answered(`the crude density at ${apiGravity} API`, P.oilDensityKgM3({ apiGravity, tC: UZERE_OIL.tC }));
    // DERIVED, the UZERE brine density minus this crude density.
    return { apiGravity, ...r, differenceFromBrine: uz.rhoW.rhoKgM3 - r.rhoKgM3 };
  });
  // BOTH EFFECTS OF THE SALINITY AT ONCE, RANKED BY THE ENGINE. A lesson says the
  // saline water cuts finer on every crude of the sweep, which is a RANKING, so
  // it is two engine cuts per row here and the lab throws if any row refutes it.
  const freshMu = answered('the fresh water viscosity at the UZERE temperature', P.waterViscosityPaS({ tC: UZERE_WATER.tC, tdsPpm: 0 }));
  const freshRw = answered('the fresh water density at the UZERE temperature', P.waterDensityKgM3({ tC: UZERE_WATER.tC, tdsPpm: 0 }));
  const basinCut = (label, rhoWater, rhoOil, muPaS) => answered(label, P.apiSeparator({
    flowM3S: uz.q, ...UZERE_BASIN, rhoWater, rhoOil, muPaS,
  })).d50cMicron;
  const bothRows = crude.map((c) => {
    const freshCut = basinCut(`the UZERE basin on ${c.apiGravity} API crude in fresh water`, freshRw.rhoKgM3, c.rhoKgM3, freshMu.muPaS);
    const brineCut = basinCut(`the UZERE basin on ${c.apiGravity} API crude in the UZERE brine`, uz.rhoW.rhoKgM3, c.rhoKgM3, uz.mu.muPaS);
    // DERIVED, the two engine cuts on the same row divided.
    return {
      apiGravity: c.apiGravity, differenceFromFresh: freshRw.rhoKgM3 - c.rhoKgM3, freshCut, brineCut, ratio: brineCut / freshCut,
    };
  });
  if (!bothRows.every((r) => r.brineCut < r.freshCut)) {
    throw new Error('the lab says the saline water cuts finer on every crude of the sweep and at least one row does not');
  }
  const viscosityFactor = uz.mu.muPaS / freshMu.muPaS;
  const densityGain = uz.rhoW.rhoKgM3 - freshRw.rhoKgM3;
  // DERIVED: where the two effects balance, then CHECKED by the engine.
  const balanceFromFresh = densityGain / (viscosityFactor - 1);
  const balanceOil = freshRw.rhoKgM3 - balanceFromFresh;
  const balanceFreshCut = basinCut('the UZERE basin at the balance point in fresh water', freshRw.rhoKgM3, balanceOil, freshMu.muPaS);
  const balanceBrineCut = basinCut('the UZERE basin at the balance point in the UZERE brine', uz.rhoW.rhoKgM3, balanceOil, uz.mu.muPaS);
  if (!(Math.abs(balanceBrineCut / balanceFreshCut - 1) <= Number.EPSILON * 16)) {
    throw new Error(`the salinity balance point does not balance in the engine: ${balanceBrineCut / balanceFreshCut}`);
  }
  const salinityBoth = {
    rows: bothRows,
    count: bothRows.length,
    brineFinerOnEveryRow: true,
    viscosityFactor,
    densityGain,
    balanceFromFresh,
    balanceFromBrine: balanceFromFresh + densityGain,
    balanceCut: balanceFreshCut,
    largestFromBrine: Math.max(...crude.map((c) => c.differenceFromBrine)),
  };
  return {
    byTemperature,
    bySalinity,
    densities,
    crude,
    salinityBoth,
    // DERIVED, the largest difference against the brine over the smallest.
    crudeSpread: Math.max(...crude.map((c) => c.differenceFromBrine)) / Math.min(...crude.map((c) => c.differenceFromBrine)),
    thinningFactor: cold.muPaS / hot.muPaS,
    salinityMultiplier: DECLARED.salinityViscosityMultiplier,
    tdsMaxPpm: DECLARED.tdsMaxPpm,
    // The stated limit, with the engine enforcing it on the same sweep rather
    // than only in the export census of Section 16, which this tier never reads.
    tdsRefusal: refusalRow(
      `${TDS_BAND.justOver} ppm TDS at the ${UZERE_WATER.tC} C of the sweep above`,
      P.waterViscosityPaS({ tC: UZERE_WATER.tC, tdsPpm: TDS_BAND.justOver }),
    ),
  };
};

// ---------------------------------------------------------------------------
// SECTION 4. Oil in water is a distribution.
// ---------------------------------------------------------------------------

export const theDistribution = () => {
  const uz = uzere();
  const b = uz.bins;
  const byBinCount = NBINS_SWEEP.map((nBins) => {
    const r = answered(`the bins at ${nBins}`, P.dropletBins({
      d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, nBins,
    }));
    const lo = Math.exp(Math.log(UZERE_INLET.d50Micron) - r.spanSigma * UZERE_INLET.sigma);
    const analytic = 2 * answered('the cdf at the span edge', P.logNormalCdf({
      d: lo, d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma,
    }));
    return {
      nBins,
      medianMicron: P.medianOfBins(r.bins),
      truncatedTailFraction: r.truncatedTailFraction,
      // DERIVED, the reported tail over twice the module's own cdf at the edge.
      tailOverAnalytic: r.truncatedTailFraction / analytic,
    };
  });
  const bySpan = SPAN_SWEEP.map((spanSigma) => {
    const r = answered(`the bins spanning ${spanSigma} sigma`, P.dropletBins({
      d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, spanSigma,
    }));
    return {
      spanSigma,
      truncatedTailFraction: r.truncatedTailFraction,
      coarsestMicron: r.bins[r.bins.length - 1].dHiMicron,
    };
  });
  const bySigma = SIGMA_SWEEP.map((sigma) => {
    const bins = answered(`the bins at sigma ${sigma}`, P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma }));
    const ap = answered(`a device on sigma ${sigma}`, P.applyDevice({
      bins: bins.bins, d50cMicron: SIGMA_PROBE_CUT_MICRON,
    }));
    return {
      sigma,
      removalPct: ap.removalFraction * 100,
      outletMedianMicron: P.medianOfBins(ap.outletBins),
      warning: warnLabel(bins, [
        ['sigma outside the customary band', sigma < DECLARED.sigmaCustomaryMin || sigma > DECLARED.sigmaCustomaryMax],
      ]),
    };
  });
  return {
    nBins: b.nBins,
    spanSigma: b.spanSigma,
    coarsestMicron: b.bins[b.bins.length - 1].dHiMicron,
    finestMicron: b.bins[0].dLoMicron,
    truncatedTailFraction: b.truncatedTailFraction,
    medianMicron: answered('the UZERE inlet median', P.medianOfBins(b.bins)),
    byBinCount,
    bySpan,
    bySigma,
    // THE GRID GUARDS. The bin count must be a WHOLE NUMBER and at least
    // `minNBins`, and the span must reach at least `minSpanSigma`. A lesson
    // asserted the whole-number guard while nothing printed it.
    gridRefusals: [
      refusalRow(`a bin count of ${NBINS_REFUSED.fractional}`, P.dropletBins({
        d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, nBins: NBINS_REFUSED.fractional,
      })),
      refusalRow(`a bin count of ${NBINS_REFUSED.belowFloor}`, P.dropletBins({
        d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, nBins: NBINS_REFUSED.belowFloor,
      })),
      refusalRow(`a span of ${SPAN_REFUSED} sigma either side`, P.dropletBins({
        d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, spanSigma: SPAN_REFUSED,
      })),
    ],
    fractionalBins: NBINS_REFUSED.fractional,
    probeCutMicron: SIGMA_PROBE_CUT_MICRON,
    sigmaCustomaryMin: DECLARED.sigmaCustomaryMin,
    sigmaCustomaryMax: DECLARED.sigmaCustomaryMax,
    sigmaMax: DECLARED.sigmaMax,
  };
};

// ---------------------------------------------------------------------------
// SECTION 5. A droplet's rise, and the band it is honest in.
// ---------------------------------------------------------------------------

export const riseAndItsBand = () => {
  const uz = uzere();
  const rows = RISE_GAP_SWEEP.map((dMicron) => {
    const s = answered(`Stokes at ${dMicron} micron`, P.stokesRiseMS({ dMicron, ...uz.fluid }));
    const t = answered(`the drag balance at ${dMicron} micron`, P.terminalRiseMS({
      dMicron, rhoHeavy: uz.fluid.rhoWater, rhoLight: uz.fluid.rhoOil, muPaS: uz.fluid.muPaS,
    }));
    return {
      dMicron,
      stokesMS: s.vMS,
      reynolds: s.reynolds,
      balanceMS: t.vMS,
      // DERIVED, the two velocities on the same row divided.
      ratio: s.vMS / t.vMS,
      departure: s.vMS / t.vMS - 1,
      inBand: !s.warning,
    };
  });
  if (!rows.every((r, i) => i === 0 || r.departure > rows[i - 1].departure)) {
    throw new Error('this reader states the departure grows with the Reynolds number and it does not');
  }
  const nearBand = rows.reduce((a, b) => (Math.abs(b.reynolds - DECLARED.stokesReynoldsLimit)
    < Math.abs(a.reynolds - DECLARED.stokesReynoldsLimit) ? b : a));
  return {
    muPaS: uz.fluid.muPaS,
    // DERIVED, the brine and crude densities of Section 1 subtracted.
    densityDifference: uz.fluid.rhoWater - uz.fluid.rhoOil,
    rows,
    fine: rows[0],
    coarse: rows[rows.length - 1],
    nearBand,
    stokesReynoldsLimit: DECLARED.stokesReynoldsLimit,
  };
};

// ---------------------------------------------------------------------------
// SECTION 6. The gravity devices: a cut size is a surface loading inverted.
// ---------------------------------------------------------------------------

export const gravityDevices = () => {
  const uz = uzere();
  const depths = [UZERE_BASIN.depthM, UZERE_BASIN_SHALLOW_DEPTH_M].map((depthM) => {
    const r = answered(`the UZERE basin at ${depthM} m of water`, P.apiSeparator({
      flowM3S: uz.q, ...UZERE_BASIN, depthM, ...uz.fluid,
    }));
    return {
      depthM,
      d50cMicron: r.d50cMicron,
      horizontalVelocityMS: r.horizontalVelocityMS,
      residenceS: r.residenceS,
      warning: warnLabel(r, [
        ['the horizontal velocity above its limit', r.horizontalVelocityMS > r.horizontalVelocityLimitMS],
        ['F outside the customary band', r.shortCircuitF < API_421.shortCircuitCustomaryMin || r.shortCircuitF > API_421.shortCircuitCustomaryMax],
        ['the cut droplet outside creeping flow', r.cutReynolds > DECLARED.stokesReynoldsLimit],
      ]),
    };
  });
  const areas = BASIN_AREA_SWEEP.map((g) => {
    const r = answered(`a basin ${g.lengthM} by ${g.widthM}`, P.apiSeparator({
      flowM3S: uz.q, ...g, depthM: UZERE_BASIN.depthM, ...uz.fluid,
    }));
    return {
      ...g,
      // DERIVED, the two dimensions multiplied.
      planAreaM2: g.lengthM * g.widthM,
      overflowRateMS: r.overflowRateMS,
      d50cMicron: r.d50cMicron,
      // DERIVED, the cut over the root of the loading on the same row.
      cutPerRootLoading: r.d50cMicron / Math.sqrt(r.overflowRateMS),
    };
  });
  const shortCircuit = SHORT_CIRCUIT_SWEEP.map((shortCircuitF) => {
    const r = answered(`a basin at F ${shortCircuitF}`, P.apiSeparator({
      flowM3S: uz.q, ...UZERE_BASIN, shortCircuitF, ...uz.fluid,
    }));
    return {
      shortCircuitF,
      d50cMicron: r.d50cMicron,
      warning: warnLabel(r, [
        ['F outside the customary band', shortCircuitF < API_421.shortCircuitCustomaryMin || shortCircuitF > API_421.shortCircuitCustomaryMax],
        ['the horizontal velocity above its limit', r.horizontalVelocityMS > r.horizontalVelocityLimitMS],
        ['the cut droplet outside creeping flow', r.cutReynolds > DECLARED.stokesReynoldsLimit],
      ]),
    };
  });
  const shortCircuitRefusals = SHORT_CIRCUIT_REFUSED.map((shortCircuitF) => refusalRow(
    `F of ${shortCircuitF}`,
    P.apiSeparator({
      flowM3S: uz.q, ...UZERE_BASIN, shortCircuitF, ...uz.fluid,
    }),
  ));
  const plates = PLATE_COUNT_SWEEP.map((nPlates) => {
    const r = answered(`a pack of ${nPlates} plates`, P.plateInterceptor({
      flowM3S: uz.q, ...UZERE_PLATES, nPlates, ...uz.fluid,
    }));
    return {
      nPlates,
      effectiveAreaM2: r.effectiveAreaM2,
      designRiseMS: r.designRiseMS,
      d50cMicron: r.d50cMicron,
    };
  });
  return {
    basin: uz.basin,
    depths,
    areas,
    shortCircuit,
    shortCircuitRefusals,
    plates,
    customaryMin: API_421.shortCircuitCustomaryMin,
    customaryMax: API_421.shortCircuitCustomaryMax,
    plateEfficiencyFactor: DECLARED.plateEfficiencyFactor,
  };
};

// ---------------------------------------------------------------------------
// SECTION 7. The published gravity cases.
// ---------------------------------------------------------------------------

export const publishedGravityCases = () => {
  const basins = GOLD.apiSeparator.map((c, i) => {
    const r = answered(`the golden basin row ${i + 1}`, P.apiSeparator({
      flowM3S: c.flowM3S,
      lengthM: c.lengthM,
      widthM: c.widthM,
      depthM: c.depthM,
      shortCircuitF: c.shortCircuitF,
      rhoWater: c.rhoWater,
      rhoOil: c.rhoOil,
      muPaS: c.muPaS,
    }));
    // DERIVED, the engine answer over the golden value on the same row.
    return { c, engineCutMicron: r.d50cMicron, engineOverGolden: r.d50cMicron / c.d50cMicron };
  });
  const plates = GOLD.plateInterceptor.map((c, i) => {
    const r = answered(`the golden plate row ${i + 1}`, P.plateInterceptor({
      flowM3S: c.flowM3S,
      plateAreaM2: c.plateAreaM2,
      nPlates: c.nPlates,
      efficiencyFactor: c.efficiencyFactor,
      rhoWater: c.rhoWater,
      rhoOil: c.rhoOil,
      muPaS: c.muPaS,
    }));
    return { c, engineCutMicron: r.d50cMicron, engineOverGolden: r.d50cMicron / c.d50cMicron };
  });
  const outOfBand = [...GOLD.apiSeparator, ...GOLD.plateInterceptor, ...GOLD.rise]
    .filter((c) => (c.cutReynolds ?? c.reynolds) > DECLARED.stokesReynoldsLimit);
  if (!outOfBand.length) {
    throw new Error('this reader states that published rows sit outside the creeping flow band and none does');
  }
  return {
    goldenRows: goldenCounts().rows,
    goldenGroups: goldenCounts().groupCount,
    basins,
    plates,
    outOfBand,
    channelHeightIndependence: GOLD.plateInterceptor.map((c) => c.channelHeightIndependence),
  };
};

// ---------------------------------------------------------------------------
// SECTION 8. What a device does to a distribution.
// ---------------------------------------------------------------------------

export const whatADeviceDoes = () => {
  const uz = uzere();
  const curve = GRADE_RATIOS.map((ratio) => ({
    ratio,
    cells: GRADE_SHARPNESS.map((sharpness) => answered(
      `the grade efficiency at ${ratio} and m ${sharpness}`,
      P.gradeEfficiency({ dMicron: ratio * 10, d50cMicron: 10, sharpness }),
    )),
  }));
  const separation = {
    coarseSharp: 100 * P.gradeEfficiency({ dMicron: 40, d50cMicron: 10, sharpness: 3 }),
    coarseBlunt: 100 * P.gradeEfficiency({ dMicron: 40, d50cMicron: 10, sharpness: 2 }),
    fineSharp: 100 * P.gradeEfficiency({ dMicron: 2.5, d50cMicron: 10, sharpness: 3 }),
    fineBlunt: 100 * P.gradeEfficiency({ dMicron: 2.5, d50cMicron: 10, sharpness: 2 }),
  };
  const cuts = DEVICE_CUT_SWEEP.map((d50cMicron) => {
    const ap = answered(`a device at ${d50cMicron} micron`, P.applyDevice({ bins: uz.bins.bins, d50cMicron }));
    return {
      d50cMicron,
      removalPct: ap.removalFraction * 100,
      survivingVolume: ap.survivingVolume,
      outletMedianMicron: P.medianOfBins(ap.outletBins),
    };
  });
  const dust = answered('a device at a cut far below the water', P.applyDevice({
    bins: uz.bins.bins, d50cMicron: DUST_CUT_MICRON,
  }));
  return {
    curve,
    separation,
    cuts,
    dustCutMicron: DUST_CUT_MICRON,
    dust: {
      removalPct: dust.removalFraction * 100,
      survivingVolume: dust.survivingVolume,
      outletNormalised: dust.outletNormalised,
      warning: dust.warning,
    },
    defaultSharpness: DECLARED.defaultSharpness,
    interceptionSharpness: DECLARED.interceptionSharpness,
  };
};

// ---------------------------------------------------------------------------
// SECTION 9. The hydrocyclone, on stated geometry.
// ---------------------------------------------------------------------------

export const theHydrocyclone = () => {
  const ko = kokori();
  const geometry = LINER_GEOMETRY_SWEEP.map((g) => {
    const r = answered(`a liner ${g.linerDiameterM} by ${g.linerLengthM}`, P.hydrocyclone({
      flowM3S: ko.q, ...KOKORI_LINERS, ...g, ...ko.fluid,
    }));
    return {
      ...g,
      linerVolumeM3: r.linerVolumeM3,
      residenceS: r.residenceS,
      radialTravelM: r.radialTravelM,
      gField: r.gField,
      d50cMicron: r.d50cMicron,
    };
  });
  // The leg is read in TABLE order and swept in BORE order, which are not the
  // same order. THE CONSTANT PRODUCT IS MEASURED ACROSS THE LEG, never typed.
  const boreLeg = geometry
    .filter((g) => g.linerLengthM === LINER_BORE_LEG_LENGTH_M)
    .map((g) => ({ bore: g.linerDiameterM, cut: g.d50cMicron }))
    .sort((a, b) => a.bore - b.bore);
  const boreProducts = boreLeg.map((b) => b.cut * Math.sqrt(b.bore));
  const boreSpread = Math.max(...boreProducts) - Math.min(...boreProducts);
  if (boreLeg.length < 4) {
    throw new Error(`the bore leg is ${boreLeg.length} rows and one or two rows cannot establish a direction`);
  }
  if (!(boreSpread < 1e-9)) {
    throw new Error(`the bore leg is stated to go as one over the root of the bore and the products spread by ${boreSpread}`);
  }
  for (let i = 1; i < boreLeg.length; i += 1) {
    if (!(boreLeg[i].cut < boreLeg[i - 1].cut)) {
      throw new Error(`the bore leg is stated to be monotone and a bore of ${boreLeg[i].bore} cuts ${boreLeg[i].cut} against ${boreLeg[i - 1].cut} at ${boreLeg[i - 1].bore}`);
    }
  }
  const cores = CORE_FRACTION_SWEEP.map((coreRadiusFraction) => {
    const r = answered(`a core at ${coreRadiusFraction} of the radius`, P.hydrocyclone({
      flowM3S: ko.q, ...KOKORI_LINERS, coreRadiusFraction, ...ko.fluid,
    }));
    return { coreRadiusFraction, radialTravelM: r.radialTravelM, d50cMicron: r.d50cMicron };
  });
  // THE HALF-AREA RADIUS, MEASURED BACK OUT OF THE BANK'S OWN RETURN. The radius
  // comes from the returned liner volume and length, so only the core fraction
  // on this line is read rather than measured. It was printed only in Section 2,
  // which the Professional tier does not own.
  const linerRadiusM = Math.sqrt(ko.cyclone.linerVolumeM3 / (Math.PI * ko.cyclone.linerLengthM));
  const halfAreaRadiusFraction = ko.cyclone.radialTravelM / linerRadiusM + DECLARED.coreRadiusFraction;
  if (!(Math.abs(halfAreaRadiusFraction - Math.SQRT1_2) <= Number.EPSILON * 8)) {
    throw new Error(`the half-area radius measured out of the hydrocyclone return is ${halfAreaRadiusFraction} and the criterion is ${Math.SQRT1_2}`);
  }
  return {
    bank: ko.cyclone,
    halfAreaRadiusFraction,
    coreRadiusFraction: DECLARED.coreRadiusFraction,
    geometry,
    boreLeg,
    boreProducts,
    boreLegLengthM: LINER_BORE_LEG_LENGTH_M,
    cores,
    coreRefusal: refusalRow(
      `a core at ${CORE_FRACTION_REFUSED} of the radius`,
      P.hydrocyclone({
        flowM3S: ko.q, ...KOKORI_LINERS, coreRadiusFraction: CORE_FRACTION_REFUSED, ...ko.fluid,
      }),
    ),
  };
};

// ---------------------------------------------------------------------------
// SECTION 10. The envelope, the ceiling and the refusal.
//
// THE SWEEP TURNS OVER, and a panel that hides the turn by plotting only the
// sensible range has removed the one thing the Professional tier exists to
// teach. The refusals are returned beside the answering rows for that reason.
// ---------------------------------------------------------------------------

/** One liner count on one flow, as an answer or as a refusal, whichever it is. */
export const linerBankAt = (flowM3S, nLiners, fluid) => {
  const r = P.hydrocyclone({ flowM3S, nLiners, ...fluid });
  if (r && typeof r.error === 'string') {
    return {
      nLiners, refused: true, error: r.error, linersAtDesignFlow: r.linersAtDesignFlow ?? null,
    };
  }
  return {
    nLiners,
    refused: false,
    perLinerM3S: r.perLinerM3S,
    turndownRatio: r.turndownRatio,
    gField: r.gField,
    shearPenalty: r.shearPenalty,
    idealD50cMicron: r.idealD50cMicron,
    d50cMicron: r.d50cMicron,
    warning: warnLabel(r, [
      ['starved', r.turndownRatio < DECLARED.starvedTurndown],
      ['overloaded', r.turndownRatio > DECLARED.overloadTurndown],
    ]),
  };
};

export const theEnvelope = () => {
  const ko = kokori();
  const rows = LINER_SWEEP.map((nLiners) => {
    const r = answered(`a bank of ${nLiners} liners`, P.hydrocyclone({
      flowM3S: ko.q, nLiners, ...ko.fluid,
    }));
    return {
      nLiners,
      perLinerM3S: r.perLinerM3S,
      turndownRatio: r.turndownRatio,
      gField: r.gField,
      shearPenalty: r.shearPenalty,
      idealD50cMicron: r.idealD50cMicron,
      d50cMicron: r.d50cMicron,
      warning: warnLabel(r, [
        ['starved', r.turndownRatio < DECLARED.starvedTurndown],
        ['overloaded', r.turndownRatio > DECLARED.overloadTurndown],
      ]),
    };
  });
  const best = rows.reduce((a, b) => (b.d50cMicron < a.d50cMicron ? b : a));
  const fewest = rows[rows.length - 1];
  const starved = answered(`a bank of ${LINER_STARVED} liners`, P.hydrocyclone({
    flowM3S: ko.q, nLiners: LINER_STARVED, ...ko.fluid,
  }));
  const golden = GOLD.hydrocyclone.map((c, i) => {
    const r = answered(`the golden liner row ${i + 1}`, P.hydrocyclone({
      flowM3S: c.flowM3S,
      nLiners: c.nLiners,
      rhoWater: c.rhoWater,
      rhoOil: c.rhoOil,
      muPaS: c.muPaS,
      ...(c.linerDiameterM ? { linerDiameterM: c.linerDiameterM } : {}),
      ...(c.linerLengthM ? { linerLengthM: c.linerLengthM } : {}),
      ...(c.designFlowPerLinerM3S ? { designFlowPerLinerM3S: c.designFlowPerLinerM3S } : {}),
      ...(c.gFieldAtDesign ? { gFieldAtDesign: c.gFieldAtDesign } : {}),
      ...(c.coreRadiusFraction ? { coreRadiusFraction: c.coreRadiusFraction } : {}),
    }));
    return { c, engineCutMicron: r.d50cMicron };
  });
  return {
    rows,
    best,
    fewest,
    // DERIVED, the two cut sizes divided.
    fewestOverBest: fewest.d50cMicron / best.d50cMicron,
    overloadTurndown: DECLARED.overloadTurndown,
    maxTurndown: DECLARED.maxTurndown,
    // The reported field cannot exceed this, written in the engine's own left to
    // right order because 1000 * 1.3 * 1.3 and 1000 * 1.3 ** 2 are different floats.
    fieldCeiling: DECLARED.gFieldAtDesign * DECLARED.overloadTurndown * DECLARED.overloadTurndown,
    refusals: LINER_REFUSED.map((nLiners) => refusalRow(
      `${nLiners} liners on the KOKORI flow`,
      P.hydrocyclone({ flowM3S: ko.q, nLiners, ...ko.fluid }),
    )),
    starved: {
      nLiners: LINER_STARVED,
      turndownRatio: starved.turndownRatio,
      d50cMicron: starved.d50cMicron,
      warning: starved.warning,
    },
    golden,
    captureAtCut: GOLD.hydrocyclone[0].mcCaptureFractionAtCut,
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. Flotation is attachment kinetics.
// ---------------------------------------------------------------------------

export const flotationKinetics = () => {
  const ko = kokori();
  const reference = answered(`flotation at ${BUBBLE_REFERENCE_MICRON} micron bubbles`, P.flotation({
    flowM3S: ko.q, ...KOKORI_FLOTATION, bubbleMicron: BUBBLE_REFERENCE_MICRON, ...ko.fluid,
  }));
  const bubbles = BUBBLE_SWEEP.map((bubbleMicron) => {
    const r = answered(`flotation at ${bubbleMicron} micron bubbles`, P.flotation({
      flowM3S: ko.q, ...KOKORI_FLOTATION, bubbleMicron, ...ko.fluid,
    }));
    return {
      bubbleMicron,
      bubbleRiseMS: r.bubbleRiseMS,
      bubbleReynolds: r.bubbleReynolds,
      gasHoldup: r.gasHoldup,
      d50cMicron: r.d50cMicron,
      // DERIVED, each cut over the reference bubble row.
      overReference: r.d50cMicron / reference.d50cMicron,
    };
  });
  const gasRatios = GAS_RATIO_SWEEP.map((gasRatio) => {
    const r = answered(`flotation at a gas ratio of ${gasRatio}`, P.flotation({
      flowM3S: ko.q, ...KOKORI_FLOTATION, gasRatio, ...ko.fluid,
    }));
    return {
      gasRatio,
      superficialGasMS: r.superficialGasMS,
      gasHoldup: r.gasHoldup,
      d50cMicron: r.d50cMicron,
      warning: flotationWarnLabel(r),
    };
  });
  const refusals = [
    refusalRow(`a gas to water ratio of ${FLOTATION_REFUSED.gasRatio}`, P.flotation({
      flowM3S: ko.q, ...KOKORI_FLOTATION, gasRatio: FLOTATION_REFUSED.gasRatio, ...ko.fluid,
    })),
    refusalRow(`a ${FLOTATION_REFUSED.bubbleMicron} micron bubble`, P.flotation({
      flowM3S: ko.q, ...KOKORI_FLOTATION, bubbleMicron: FLOTATION_REFUSED.bubbleMicron, ...ko.fluid,
    })),
    refusalRow(`an attachment efficiency of ${FLOTATION_REFUSED.attachmentEfficiency}`, P.flotation({
      flowM3S: ko.q, ...KOKORI_FLOTATION, attachmentEfficiency: FLOTATION_REFUSED.attachmentEfficiency, ...ko.fluid,
    })),
  ];
  // THE STRADDLE IS THE PUBLISHED ONE, chosen off the golden's own fields rather
  // than invented here: a cell shrunk on the KOKORI stream until it warns also
  // drives the holdup past its own limit and fires BOTH warnings at once, which
  // demonstrates neither. These two rows differ in cell volume alone.
  const candidates = GOLD.flotation.filter((c) => 'expectResidenceWarning' in c && c.expectHoldupWarning === false);
  const sorted = [...candidates].sort((a, b) => Math.abs(a.residenceS - DECLARED.flotationResidenceWarnS)
    - Math.abs(b.residenceS - DECLARED.flotationResidenceWarnS));
  const pair = sorted.slice(0, 2).sort((a, b) => b.residenceS - a.residenceS);
  if (pair.length !== 2 || pair[0].expectResidenceWarning !== false || pair[1].expectResidenceWarning !== true) {
    throw new Error('the golden carries no clean pair straddling the flotation residence threshold with the holdup warning off on both sides');
  }
  const straddle = pair.map((c) => {
    const r = answered(`the published residence straddle at ${c.cellVolumeM3} m3`, P.flotation({
      flowM3S: c.flowM3S,
      cellVolumeM3: c.cellVolumeM3,
      nCells: c.nCells,
      cellDepthM: c.cellDepthM,
      gasRatio: c.gasRatio,
      bubbleMicron: c.bubbleMicron,
      rhoWater: c.rhoWater,
      rhoOil: c.rhoOil,
      muPaS: c.muPaS,
    }));
    return {
      c,
      cellVolumeM3: c.cellVolumeM3,
      residenceS: r.residenceS,
      gasHoldup: r.gasHoldup,
      d50cMicron: r.d50cMicron,
      warning: flotationWarnLabel(r),
      message: r.warning,
    };
  });
  const depths = CELL_DEPTH_SWEEP.map((cellDepthM) => {
    const r = answered(`flotation in a ${cellDepthM} m cell`, P.flotation({
      flowM3S: ko.q, ...KOKORI_FLOTATION, cellDepthM, ...ko.fluid,
    }));
    return {
      cellDepthM, planAreaM2: r.planAreaM2, superficialGasMS: r.superficialGasMS, d50cMicron: r.d50cMicron,
    };
  });
  return {
    cell: ko.flotation,
    gasRatio: KOKORI_FLOTATION.gasRatio,
    bubbles,
    referenceBubbleMicron: BUBBLE_REFERENCE_MICRON,
    gasRatios,
    refusals,
    straddle,
    depths,
    gasHoldupWarn: DECLARED.gasHoldupWarn,
    residenceWarnS: DECLARED.flotationResidenceWarnS,
  };
};

// ---------------------------------------------------------------------------
// SECTION 12. Two kinds of cell, and an invariance.
// ---------------------------------------------------------------------------

export const twoKindsOfCell = () => {
  const ko = kokori();
  const presets = [['induced gas', IGF_PRESET], ['dissolved gas', DAF_PRESET]].map(([name, preset]) => {
    const r = answered(`the ${name} preset`, P.flotation({
      flowM3S: ko.q, ...KOKORI_FLOTATION, ...preset, ...ko.fluid,
    }));
    return {
      name,
      gasRatio: preset.gasRatio,
      bubbleMicron: preset.bubbleMicron,
      superficialGasMS: r.superficialGasMS,
      d50cMicron: r.d50cMicron,
    };
  });
  const arrangement = CELL_ARRANGEMENT.map((a) => {
    const gasRatio = ARRANGEMENT_TOTAL_GAS_RATIO / a.nCells;
    const r = answered(`${a.nCells} cells of ${a.cellVolumeM3} m3`, P.flotation({
      flowM3S: ko.q,
      nCells: a.nCells,
      cellVolumeM3: a.cellVolumeM3,
      cellDepthM: KOKORI_FLOTATION.cellDepthM,
      bubbleMicron: KOKORI_FLOTATION.bubbleMicron,
      gasRatio,
      ...ko.fluid,
    }));
    return {
      ...a,
      // DERIVED, the cell count times the volume of each.
      totalVolumeM3: a.nCells * a.cellVolumeM3,
      gasRatio,
      totalGasFlowM3S: r.totalGasFlowM3S,
      residenceS: r.residenceS,
      d50cMicron: r.d50cMicron,
    };
  });
  const cuts = arrangement.map((a) => a.d50cMicron);
  return {
    presets,
    // DERIVED, the two preset cut sizes divided, and the two gas ratios divided.
    finerBy: presets[0].d50cMicron / presets[1].d50cMicron,
    gasRatioBy: DAF_PRESET.gasRatio / IGF_PRESET.gasRatio,
    arrangement,
    // DERIVED, the largest cut across the arrangements minus the smallest.
    spread: Math.max(...cuts) - Math.min(...cuts),
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. The bed, and a cut size that is an inversion.
//
// THE FLOOR IS THE FC7-1 REPAIR AND THIS READER OWNS IT. A device whose one
// refusal is never shown refusing is a device a reader can only take the
// declared constant's word for.
// ---------------------------------------------------------------------------

/** One bed area on one flow, as an answer or as a refusal, whichever it is. */
export const bedAt = (flowM3S, areaM2, rest = {}) => {
  const r = P.mediaFilter({ flowM3S, areaM2, ...rest });
  if (r && typeof r.error === 'string') {
    return {
      areaM2,
      refused: true,
      error: r.error,
      loadingMHr: r.loadingMHr ?? null,
      areaAtFloorM2: r.areaAtFloorM2 ?? null,
    };
  }
  return {
    areaM2,
    refused: false,
    loadingMHr: r.loadingMHr,
    filterCoefficientPerM: r.filterCoefficientPerM,
    d50cMicron: r.d50cMicron,
    warning: r.warning,
  };
};

export const theBed = () => {
  const ko = kokori();
  const depths = BED_DEPTH_SWEEP.map((bedDepthM) => {
    const r = answered(`a bed ${bedDepthM} m deep`, P.mediaFilter({
      flowM3S: ko.q, ...KOKORI_FILTER, bedDepthM,
    }));
    return {
      bedDepthM,
      filterCoefficientPerM: r.filterCoefficientPerM,
      removalAtRefDropletPct: r.removalAtRefDroplet * 100,
      d50cMicron: r.d50cMicron,
      // DERIVED, the cut times the square root of the depth on the same row.
      cutTimesRootDepth: r.d50cMicron * Math.sqrt(bedDepthM),
    };
  });
  const lamRef = answered('the reference grain', P.mediaFilter({
    flowM3S: ko.q, ...KOKORI_FILTER, mediaMicron: DECLARED.filterReferenceMediaMicron,
  }));
  const grains = MEDIA_SWEEP.map((mediaMicron) => {
    const r = answered(`${mediaMicron} micron media`, P.mediaFilter({
      flowM3S: ko.q, ...KOKORI_FILTER, mediaMicron,
    }));
    return {
      mediaMicron,
      filterCoefficientPerM: r.filterCoefficientPerM,
      d50cMicron: r.d50cMicron,
      // DERIVED, each lambda over the row at the module's own reference grain.
      overReference: r.filterCoefficientPerM / lamRef.filterCoefficientPerM,
    };
  });
  const loadings = LOADING_AREA_SWEEP.map((areaM2) => {
    const r = answered(`a ${areaM2} m2 bed`, P.mediaFilter({ flowM3S: ko.q, ...KOKORI_FILTER, areaM2 }));
    return {
      areaM2,
      loadingMHr: r.loadingMHr,
      filterCoefficientPerM: r.filterCoefficientPerM,
      d50cMicron: r.d50cMicron,
      warning: warnLabel(r, [
        ['above the breakthrough loading', r.loadingMHr > DECLARED.filterBreakthroughLoadingMHr],
      ]),
    };
  });
  const floorRefusals = FILTER_FLOOR_REFUSED_AREAS.map((areaM2) => refused(
    `a ${areaM2} m2 bed on this flow`,
    P.mediaFilter({ flowM3S: ko.q, ...KOKORI_FILTER, areaM2 }),
  ));
  // THE BED AT THE FLOOR IS READ OFF THE REFUSAL, never computed here. The
  // refusal's job is to name the bed that would work.
  const areaAtFloorM2 = floorRefusals[0].areaAtFloorM2;
  floorRefusals.forEach((r) => {
    if (r.areaAtFloorM2 !== areaAtFloorM2) {
      throw new Error(`two refusals on one flow name different beds at the floor, ${r.areaAtFloorM2} and ${areaAtFloorM2}`);
    }
  });
  const floorAnswers = FILTER_FLOOR_ANSWER_AREAS.map((areaM2) => {
    const r = answered(`a ${areaM2} m2 bed above the floor`, P.mediaFilter({
      flowM3S: ko.q, ...KOKORI_FILTER, areaM2,
    }));
    return {
      areaM2, loadingMHr: r.loadingMHr, filterCoefficientPerM: r.filterCoefficientPerM, d50cMicron: r.d50cMicron,
    };
  });
  const golden = GOLD.mediaFilter.map((c, i) => {
    const r = answered(`the golden bed row ${i + 1}`, P.mediaFilter({
      flowM3S: c.flowM3S,
      areaM2: c.areaM2,
      ...(c.bedDepthM ? { bedDepthM: c.bedDepthM } : {}),
      ...(c.mediaMicron ? { mediaMicron: c.mediaMicron } : {}),
      ...(c.filterCoefficientPerM ? { filterCoefficientPerM: c.filterCoefficientPerM } : {}),
    }));
    return { c, engineCutMicron: r.d50cMicron };
  });
  return {
    bed: ko.filter,
    depths,
    // DERIVED, the shallowest bed's cut over the deepest bed's.
    depthFactor: depths[0].d50cMicron / depths[depths.length - 1].d50cMicron,
    grains,
    loadings,
    floorAnswers,
    floorRefusals: FILTER_FLOOR_REFUSED_AREAS.map((areaM2) => refusalRow(
      `a ${areaM2} m2 bed on this flow`,
      P.mediaFilter({ flowM3S: ko.q, ...KOKORI_FILTER, areaM2 }),
    )),
    areaAtFloorM2,
    installedAreaM2: KOKORI_FILTER.areaM2,
    golden,
    minLoadingMHr: DECLARED.filterMinLoadingMHr,
    referenceLoadingMHr: DECLARED.filterReferenceLoadingMHr,
    breakthroughLoadingMHr: DECLARED.filterBreakthroughLoadingMHr,
    loadingExponent: DECLARED.filterLoadingExponent,
    referenceCoefficientPerM: DECLARED.filterCoefficientPerM,
    referenceDropletMicron: DECLARED.filterReferenceDropletMicron,
    referenceMediaMicron: DECLARED.filterReferenceMediaMicron,
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. The train, and why three good devices are not one great one.
// ---------------------------------------------------------------------------

export const theTrain = () => {
  const og = ogbotobo();
  const identical = answered('a train of identical devices', P.treatmentTrain({
    inletOiwPpm: OGBOTOBO_INLET.oiwPpm,
    inletD50Micron: OGBOTOBO_INLET.d50Micron,
    sigma: OGBOTOBO_INLET.sigma,
    devices: Array.from({ length: IDENTICAL_STAGE_COUNT }, (unused, i) => ({
      name: `stage ${i + 1}`, d50cMicron: IDENTICAL_STAGE_CUT_MICRON, sharpness: DECLARED.defaultSharpness,
    })),
  }));
  const reversed = answered('the reversed train', P.treatmentTrain({
    inletOiwPpm: OGBOTOBO_INLET.oiwPpm,
    inletD50Micron: OGBOTOBO_INLET.d50Micron,
    sigma: OGBOTOBO_INLET.sigma,
    devices: [...og.devices].reverse(),
  }));
  const outletGap = Math.abs(reversed.outletOiwPpm - og.train.outletOiwPpm) / og.train.outletOiwPpm;
  // A FLOAT ROUNDING THRESHOLD, written in machine epsilons rather than as a
  // round power of ten: the two trains are the same product taken in a
  // different order, so what separates them is a handful of last bits.
  if (!(outletGap < Number.EPSILON * 64)) {
    throw new Error(`this reader states the train outlet is invariant under reordering and the two outlets differ by ${outletGap} relative`);
  }
  const stageGaps = og.train.stages.map((st, i) => Math.abs(st.removalPct - reversed.stages[i].removalPct));
  if (!stageGaps.some((g) => g > 1)) {
    throw new Error('this reader states the stage removals move under reordering and none of them moved by a whole point');
  }
  const golden = GOLD.train.map((c, i) => {
    const r = answered(`the golden train row ${i + 1}`, P.treatmentTrain({
      inletOiwPpm: c.inletOiwPpm,
      inletD50Micron: c.inletD50Micron,
      sigma: c.sigma,
      spanSigma: c.spanSigma,
      devices: c.devices,
    }));
    return { c, engineOutletPpm: r.outletOiwPpm, engineOutletMedianMicron: r.outletMedianMicron };
  });
  return {
    train: og.train,
    identical,
    // DERIVED, each stage removal over the first stage's.
    identicalRatios: identical.stages.map((s) => s.removalPct / identical.stages[0].removalPct),
    // DERIVED, the first stage removal compounded over the stage count.
    compounded: OGBOTOBO_INLET.oiwPpm
      * (1 - identical.stages[0].removalPct / 100) ** IDENTICAL_STAGE_COUNT,
    reversed,
    outletGap,
    stageGaps,
    worstStageGap: Math.max(...stageGaps),
    golden,
    identicalStageCount: IDENTICAL_STAGE_COUNT,
    identicalStageCutMicron: IDENTICAL_STAGE_CUT_MICRON,
  };
};

// ---------------------------------------------------------------------------
// SECTION 15. The two medians, and the grid they are measured on.
// ---------------------------------------------------------------------------

export const twoMedians = () => {
  const og = ogbotobo();
  const tracking = MEDIAN_TRACKING_CUTS.map((d50cMicron) => {
    const t = answered(`one device at ${d50cMicron} micron`, P.treatmentTrain({
      inletOiwPpm: OGBOTOBO_INLET.oiwPpm,
      inletD50Micron: OGBOTOBO_INLET.d50Micron,
      sigma: OGBOTOBO_INLET.sigma,
      devices: [{ name: 'one device', d50cMicron, sharpness: DECLARED.defaultSharpness }],
    }));
    return { d50cMicron, outletOiwPpm: t.outletOiwPpm, outletMedianMicron: t.outletMedianMicron };
  });
  return {
    medianBasis: og.train.medianBasis,
    inletMedianMicron: og.train.inletMedianMicron,
    inletD50Micron: og.train.inletD50Micron,
    // DERIVED, the difference over the typed value.
    inletRelativeGap: Math.abs(og.train.inletMedianMicron - og.train.inletD50Micron) / og.train.inletD50Micron,
    tracking,
    binGrid: GOLD.binGrid.map((c) => ({
      ...c,
      nBinsStated: c.nBins ?? DECLARED.defaultNBins,
      spanStated: c.spanSigma ?? DECLARED.defaultSpanSigma,
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 16. A refusal, a withheld verdict, and the difference.
//
// THE THREE WAYS THIS ENGINE DECLINES TO ANSWER. A panel shows the refusal and
// its named cause, shows the reason a verdict was withheld, and does NOT paint
// a blank as a failure, which is the studio defect this course exists after.
// ---------------------------------------------------------------------------

export const notAnswering = () => {
  const uz = uzere();
  const og = ogbotobo();
  const c = census();
  const leaves = [
    leafNaN('gradeEfficiency at a cut size of zero', P.gradeEfficiency({ dMicron: 20, d50cMicron: 0 })),
    leafNaN('medianOfBins on an empty bin set', P.medianOfBins([])),
    leafNaN('logNormalCdf at a negative diameter', P.logNormalCdf({ d: -5, d50: 25, sigma: 0.8 })),
  ];
  const leafCaller = refusalRow(
    'applyDevice at a cut size of zero, which is the caller that turns that NaN into a name',
    P.applyDevice({ bins: uz.bins.bins, d50cMicron: 0 }),
  );
  const bandRefusals = [
    refusalRow(`a water temperature of ${VISC_BAND.aboveHigh} C`, P.waterViscosityPaS({ tC: VISC_BAND.aboveHigh, tdsPpm: 0 })),
    refusalRow(`a water temperature of ${VISC_BAND.belowLow} C`, P.waterViscosityPaS({ tC: VISC_BAND.belowLow, tdsPpm: 0 })),
    refusalRow(`a brine density at ${DENSITY_BAND.aboveHigh} C`, P.waterDensityKgM3({ tC: DENSITY_BAND.aboveHigh, tdsPpm: 0 })),
    refusalRow(`${TDS_BAND.justOver} ppm TDS`, P.waterViscosityPaS({ tC: 40, tdsPpm: TDS_BAND.justOver })),
    refusalRow(`${TDS_BAND.negative} ppm TDS`, P.waterViscosityPaS({ tC: 40, tdsPpm: TDS_BAND.negative })),
    refusalRow(`${API_BAND.aboveHigh} API`, P.oilDensityKgM3({ apiGravity: API_BAND.aboveHigh, tC: 40 })),
    refusalRow(`${API_BAND.infinite} API, where the specific gravity denominator is zero`, P.oilDensityKgM3({ apiGravity: API_BAND.infinite, tC: 40 })),
    refusalRow('an oil heavier than the water', P.stokesRiseMS({ dMicron: 30, ...BAD_FLUID })),
  ];
  const doors = [
    refusalRow('a gravity separator on an oil heavier than its water', P.apiSeparator({
      flowM3S: 0.02, lengthM: 10, widthM: 3, depthM: 1.2, ...BAD_FLUID,
    })),
    refusalRow('a plate pack on the same fluid', P.plateInterceptor({
      flowM3S: 0.02, plateAreaM2: 2, nPlates: 40, ...BAD_FLUID,
    })),
    refusalRow('a hydrocyclone on the same fluid', P.hydrocyclone({ flowM3S: 0.02, nLiners: 60, ...BAD_FLUID })),
    refusalRow('flotation on the same fluid', P.flotation({
      flowM3S: 0.02, cellVolumeM3: 20, nCells: 2, ...BAD_FLUID,
    })),
    refusalRow('a missing viscosity into a plate pack', P.plateInterceptor({
      flowM3S: 0.02, plateAreaM2: 2, nPlates: 40, rhoWater: 1010, rhoOil: 860,
    })),
    refusalRow('a train given something that is not an array of devices', P.treatmentTrain({
      inletOiwPpm: 500, inletD50Micron: 25, devices: null,
    })),
  ];
  const broken = answered('a train with a stage that cannot run', P.treatmentTrain({
    inletOiwPpm: OGBOTOBO_INLET.oiwPpm,
    inletD50Micron: OGBOTOBO_INLET.d50Micron,
    sigma: OGBOTOBO_INLET.sigma,
    specPpm: OGBOTOBO_SPEC_LOOSE_PPM,
    devices: [
      { name: 'API 421 basin', ...og.basin },
      {
        name: 'CPI plate pack',
        ...P.plateInterceptor({
          flowM3S: og.q, plateAreaM2: BROKEN_PLATE_AREA, nPlates: 40, ...og.fluid,
        }),
      },
      { name: 'Walnut shell filter', ...og.filter },
    ],
  }));
  const zeroSpec = answered('the OGBOTOBO train at a spec of zero', P.treatmentTrain({
    inletOiwPpm: OGBOTOBO_INLET.oiwPpm,
    inletD50Micron: OGBOTOBO_INLET.d50Micron,
    sigma: OGBOTOBO_INLET.sigma,
    devices: og.devices,
    specPpm: 0,
  }));
  const verdicts = [OGBOTOBO_SPEC_TIGHT_PPM, OGBOTOBO_SPEC_LOOSE_PPM].map((specPpm) => {
    const t = answered(`the OGBOTOBO train against ${specPpm} ppm`, P.treatmentTrain({
      inletOiwPpm: OGBOTOBO_INLET.oiwPpm,
      inletD50Micron: OGBOTOBO_INLET.d50Micron,
      sigma: OGBOTOBO_INLET.sigma,
      devices: og.devices,
      specPpm,
    }));
    return {
      specPpm, outletOiwPpm: t.outletOiwPpm, meetsSpec: t.meetsSpec, marginPpm: t.marginPpm,
    };
  });
  return {
    censusRows: c.rows,
    leafCount: c.leaves.length,
    leafNames: c.leaves.map((r) => r.name),
    leaves,
    leafCaller,
    bandRefusals,
    doors,
    broken,
    noSpec: {
      meetsSpec: og.train.meetsSpec,
      verdictWithheldReason: og.train.verdictWithheldReason,
    },
    zeroSpec: {
      meetsSpec: zeroSpec.meetsSpec,
      verdictWithheldReason: zeroSpec.verdictWithheldReason,
    },
    verdicts,
  };
};

// ---------------------------------------------------------------------------
// SECTION 17. What the method does not know. Six things held for literature.
//
// HELD MEANS THE REPOSITORY CARRIES NO PUBLICATION FOR THE NUMBER. Every panel
// shows this reader, and no held quantity is presented as an answer.
// ---------------------------------------------------------------------------

export const heldForLiterature = () => {
  const ko = kokori();
  const og = ogbotobo();
  const floorDemoNoFloor = answered('the floor demonstration with no floor', P.treatmentTrain({
    inletOiwPpm: FLOOR_DEMO_INLET.oiwPpm,
    inletD50Micron: FLOOR_DEMO_INLET.d50Micron,
    sigma: FLOOR_DEMO_INLET.sigma,
    devices: [{ name: 'one very fine device', d50cMicron: FLOOR_DEMO_CUT_MICRON, sharpness: DECLARED.defaultSharpness }],
  }));
  const floored = answered('the floor demonstration with a caller floor', P.treatmentTrain({
    inletOiwPpm: FLOOR_DEMO_INLET.oiwPpm,
    inletD50Micron: FLOOR_DEMO_INLET.d50Micron,
    sigma: FLOOR_DEMO_INLET.sigma,
    devices: [{ name: 'one very fine device', d50cMicron: FLOOR_DEMO_CUT_MICRON, sharpness: DECLARED.defaultSharpness }],
    dissolvedOilFloorPpm: OGBOTOBO_CALLER_FLOOR_PPM,
  }));
  if (!floored.floorApplied) {
    throw new Error('this block is labelled as the floor biting and the engine did not apply it');
  }
  const wideChain = answered('an artificial chain on the wide inlet', P.treatmentTrain({
    inletOiwPpm: OGBOTOBO_INLET.oiwPpm,
    inletD50Micron: OGBOTOBO_INLET.d50Micron,
    sigma: OGBOTOBO_INLET.sigma,
    devices: Array.from({ length: FLOOR_WIDE_STAGES }, (unused, i) => ({
      name: `stage ${i + 1}`, d50cMicron: FLOOR_WIDE_CUT_MICRON, sharpness: DECLARED.defaultSharpness,
    })),
  }));
  const attachment = ATTACHMENT_SWEEP.map((attachmentEfficiency) => {
    const r = answered(`flotation at an attachment efficiency of ${attachmentEfficiency}`, P.flotation({
      flowM3S: ko.q, ...KOKORI_FLOTATION, attachmentEfficiency, ...ko.fluid,
    }));
    return {
      attachmentEfficiency,
      d50cMicron: r.d50cMicron,
      // DERIVED, each cut over the KOKORI row.
      overDeclared: r.d50cMicron / ko.flotation.d50cMicron,
    };
  });
  return {
    dissolvedOilNote: og.train.dissolvedOilNote,
    train: {
      outletOiwPpm: og.train.outletOiwPpm,
      dispersedOutletOiwPpm: og.train.dispersedOutletOiwPpm,
      floorApplied: og.train.floorApplied,
      dissolvedOilFloorPpm: og.train.dissolvedOilFloorPpm,
    },
    floorDemoNoFloor: {
      outletOiwPpm: floorDemoNoFloor.outletOiwPpm, floorApplied: floorDemoNoFloor.floorApplied,
    },
    floored: {
      dispersedOutletOiwPpm: floored.dispersedOutletOiwPpm,
      outletOiwPpm: floored.outletOiwPpm,
      floorApplied: floored.floorApplied,
      warning: floored.warning,
    },
    callerFloorPpm: OGBOTOBO_CALLER_FLOOR_PPM,
    wideChain: { outletOiwPpm: wideChain.outletOiwPpm, outletMedianMicron: wideChain.outletMedianMicron },
    velocityRuleComplete: API_421.velocityRuleComplete,
    velocityRuleNote: API_421.velocityRuleNote,
    basin: {
      horizontalVelocityMS: og.basin.horizontalVelocityMS,
      horizontalVelocityLimitMS: og.basin.horizontalVelocityLimitMS,
      warning: og.basin.warning,
    },
    attachmentEfficiency: DECLARED.attachmentEfficiency,
    attachment,
    cutBasis: ko.cyclone.cutBasis,
  };
};

/** The six held items as a panel lists them, each with what the absence is. */
export const heldItems = () => [
  {
    id: 'floor',
    title: 'The value of the dissolved and soluble oil floor',
    note: 'Its existence is stated on every train return and it is applied only when a caller supplies a value. This module states none.',
  },
  {
    id: 'velocity-rule',
    title: 'The second half of the API 421 horizontal velocity rule',
    note: 'The standard limits the horizontal velocity to the lesser of a fixed velocity and a multiple of the design droplet rise. Only the fixed half is here, and every return that carries the check says so.',
  },
  {
    id: 'discharge-limit',
    title: 'Any discharge limit at all',
    note: 'The engine states none and a test asserts it states none. A specification is the caller\'s own, out of the caller\'s own permit.',
  },
  {
    id: 'grain-exponent',
    title: 'The media filter grain size exponent',
    note: 'The interception derivation gives the inverse cube. No bed data in this repository can check it, and the grain column is the model\'s statement rather than a measurement.',
  },
  {
    id: 'attachment',
    title: 'The attachment efficiency, which is the one calibration',
    note: 'Chosen so a cell at the module\'s own defaults cuts in the range induced gas flotation is customarily credited with. It is an input, so a caller with a vendor curve can move it.',
  },
  {
    id: 'shape-constants',
    title: 'The shape and scale constants',
    note: 'Pinned by literal in the vendored suite with an exact key set match. A pin is not a validation, and both the engine and its test say so.',
  },
];

// ---------------------------------------------------------------------------
// SECTION 18. What an independent oracle is.
// ---------------------------------------------------------------------------

/** The oracle's routes, and what makes each one independent of the engine. */
export const ORACLE_ROUTES = [
  ['the creeping flow rise velocity', 'the force balance solved numerically, with the drag coefficient as 24 over the Reynolds number and the two force expressions typed out'],
  ['the terminal rise velocity', 'bisection on the drag residual, against the engine\'s damped iteration'],
  ['the basin and plate cut sizes', 'a droplet trajectory marched through the geometry, bisected on the size that just clears'],
  ['the hydrocyclone cut', 'the radial migration marched, with the field re-derived through the tangential velocity, plus a Monte Carlo over starting radii uniform by area'],
  ['the flotation cut', 'the kinetics assembled from its parts in a different order, with the attachment marched by Euler'],
  ['the filter cut', 'the bed marched layer by layer, and the droplet whose marched removal is exactly one half bisected out'],
  ['the whole train', 'particle tracking, 400,000 droplets each carrying a surviving weight through every stage, with no binning anywhere'],
  ['the error function series', 'against the C library\'s own erf'],
];

export const whatAnOracleIs = () => {
  const uz = uzere();
  const gaps = [
    ['apiSeparator', GOLD.apiSeparator.map((c) => [c.d50cMicron, P.apiSeparator({
      flowM3S: c.flowM3S,
      lengthM: c.lengthM,
      widthM: c.widthM,
      depthM: c.depthM,
      shortCircuitF: c.shortCircuitF,
      rhoWater: c.rhoWater,
      rhoOil: c.rhoOil,
      muPaS: c.muPaS,
    }).d50cMicron])],
    ['plateInterceptor', GOLD.plateInterceptor.map((c) => [c.d50cMicron, P.plateInterceptor({
      flowM3S: c.flowM3S,
      plateAreaM2: c.plateAreaM2,
      nPlates: c.nPlates,
      efficiencyFactor: c.efficiencyFactor,
      rhoWater: c.rhoWater,
      rhoOil: c.rhoOil,
      muPaS: c.muPaS,
    }).d50cMicron])],
    ['hydrocyclone', GOLD.hydrocyclone.map((c) => [c.d50cMicron, P.hydrocyclone({
      flowM3S: c.flowM3S, nLiners: c.nLiners, rhoWater: c.rhoWater, rhoOil: c.rhoOil, muPaS: c.muPaS,
    }).d50cMicron])],
    ['mediaFilter', GOLD.mediaFilter.map((c) => [c.d50cMicron, P.mediaFilter({
      flowM3S: c.flowM3S,
      areaM2: c.areaM2,
      ...(c.bedDepthM ? { bedDepthM: c.bedDepthM } : {}),
      ...(c.mediaMicron ? { mediaMicron: c.mediaMicron } : {}),
      ...(c.filterCoefficientPerM ? { filterCoefficientPerM: c.filterCoefficientPerM } : {}),
    }).d50cMicron])],
    ['train, outlet concentration', GOLD.train.map((c) => [c.outletOiwPpm, P.treatmentTrain({
      inletOiwPpm: c.inletOiwPpm,
      inletD50Micron: c.inletD50Micron,
      sigma: c.sigma,
      spanSigma: c.spanSigma,
      devices: c.devices,
    }).outletOiwPpm])],
    ['train, outlet droplet median', GOLD.train.map((c) => [c.outletMedianMicron, P.treatmentTrain({
      inletOiwPpm: c.inletOiwPpm,
      inletD50Micron: c.inletD50Micron,
      sigma: c.sigma,
      spanSigma: c.spanSigma,
      devices: c.devices,
    }).outletMedianMicron])],
  ].map(([name, pairs]) => {
    const worst = Math.max(...pairs.map(([g, e]) => {
      if (!Number.isFinite(g) || !Number.isFinite(e)) {
        throw new Error(`the ${name} gap row compares ${g} with ${e}`);
      }
      return Math.abs(e - g) / Math.abs(g);
    }));
    return { name, rows: pairs.length, worst };
  });
  return {
    routes: ORACLE_ROUTES,
    halfAtTheCut: answered('half the volume at the cut', P.gradeEfficiency({ dMicron: 12, d50cMicron: 12 })),
    medianIdentity: answered('the median identity', P.medianOfBins(uz.bins.bins)),
    typedD50Micron: UZERE_INLET.d50Micron,
    gaps,
  };
};

// ---------------------------------------------------------------------------
// SECTION 19. What a published case can and cannot catch.
//
// SECTION 19 CARRIES THE WHOLE SEVEN ROW FLOOR GROUP, which is the only group
// in the golden whose subject is a refusal.
// ---------------------------------------------------------------------------

/** What each golden group pins. Every group in the file must be described. */
export const GROUP_NOTE = {
  apiSeparator: 'basin cut sizes, the velocity warning on both sides of the limit, and Reynolds numbers inside and outside the creeping flow band',
  binGrid: 'the median identity and the truncated tail across bin counts and spans',
  bubbleRise: 'the full drag balance at bubble Reynolds numbers from below one to the tens',
  cdf: 'the error function series against the C library, on an absolute tolerance that is the series own published accuracy',
  flotation: 'the whole attachment chain, with the holdup and residence warnings straddled',
  hydrocyclone: 'the field, the envelope, the shear penalty and the captured fraction at the cut',
  mediaFilter: 'depth filtration, the inverted cut, the grain size and the breakthrough warning, with three rows added at low loading where the bed area used to move nothing',
  mediaFilterFloor: 'the loading floor: five beds REFUSED below it, two answered at and above it, and the bed area that would run the flow at the floor',
  oilDensity: 'the crude density FUNCTION, called rather than fed its own answers back',
  plateInterceptor: 'the pack cut and the channel height independence',
  properties: 'the viscosity and brine density fits, including the one published check in the file',
  removal: 'the binned quadrature against a Monte Carlo of the same distribution',
  rise: 'Stokes, its Reynolds number, and the measured gap to the real drag balance',
  train: 'the coupling, both medians and every stage, by particle tracking',
};

/** The golden's own warning fields, each straddled by rows on both sides. */
export const WARN_KEYS = ['expectVelocityWarning', 'expectStarvedWarning', 'expectOverloadWarning',
  'expectResidenceWarning', 'expectHoldupWarning', 'expectBreakthroughWarning'];

export const whatAPublishedCaseCatches = () => {
  const groups = Object.keys(GOLD).filter((k) => Array.isArray(GOLD[k])).sort();
  const groupRows = groups.map((k) => {
    if (!GROUP_NOTE[k]) throw new Error(`the golden carries a group "${k}" this reader does not describe`);
    return { group: k, rows: GOLD[k].length, note: GROUP_NOTE[k] };
  });
  const warnRows = WARN_KEYS.map((key) => {
    const rows = groups.flatMap((g) => GOLD[g]).filter((c) => key in c);
    if (!rows.length) throw new Error(`no golden row carries ${key}`);
    return { key, carrying: rows.length, trueRows: rows.filter((c) => c[key] === true).length };
  });
  const floorGroup = GOLD.mediaFilterFloor;
  const floorRows = floorGroup.map((c, i) => {
    const r = P.mediaFilter({ flowM3S: c.flowM3S, areaM2: c.areaM2 });
    const isRefused = Boolean(r && typeof r.error === 'string');
    if (isRefused !== c.expectRefusal) {
      throw new Error(`the golden floor row ${i + 1} expects ${c.expectRefusal ? 'a refusal' : 'an answer'} at ${c.areaM2} m2 and the engine ${isRefused ? 'refused' : 'answered'}`);
    }
    return {
      areaM2: c.areaM2, loadingMHr: c.loadingMHr, expectRefusal: c.expectRefusal, engineRefused: isRefused,
    };
  });
  // THE GROUP IS TWO DEMONSTRATIONS, told apart by how far the loading sits from
  // the floor rather than by position in the file.
  const nearFloor = floorGroup.filter((c) => Math.abs(c.loadingMHr - DECLARED.filterMinLoadingMHr)
    / DECLARED.filterMinLoadingMHr < 0.05);
  const flatRows = floorGroup.filter((c) => !nearFloor.includes(c));
  const nearRefused = nearFloor.filter((c) => c.expectRefusal);
  const nearAnswered = nearFloor.filter((c) => !c.expectRefusal);
  if (!flatRows.length || nearRefused.length !== 1 || !nearAnswered.length) {
    throw new Error(`the floor group does not split into flat rows and a straddle: ${flatRows.length} flat, ${nearRefused.length} refused near the floor, ${nearAnswered.length} answered near it`);
  }
  return {
    groupRows,
    groupCount: groups.length,
    totalRows: groups.reduce((s, k) => s + GOLD[k].length, 0),
    warnRows,
    floorRows,
    flatCount: flatRows.length,
    nearCount: nearFloor.length,
    floorGroupCount: floorGroup.length,
    // DERIVED, the largest of the flat areas over the smallest.
    areaSpan: Math.max(...flatRows.map((c) => c.areaM2)) / Math.min(...flatRows.map((c) => c.areaM2)),
    nearRefusedLoadingMHr: nearRefused[0].loadingMHr,
    nearAnsweredLoadingMHr: nearAnswered[0].loadingMHr,
    // DERIVED, the two loadings subtracted and taken over the floor.
    straddleGapOfFloor: (nearAnswered[0].loadingMHr - nearRefused[0].loadingMHr) / DECLARED.filterMinLoadingMHr,
    areaAtFloorM2: floorGroup[0].areaAtFloorM2,
  };
};

// ---------------------------------------------------------------------------
// SECTION 20. The Associate reading, one stream from the water to the plate pack.
// ---------------------------------------------------------------------------

export const associateReading = () => {
  const uz = uzere();
  const basinRemoval = answered('the basin on the UZERE water', P.applyDevice({
    bins: uz.bins.bins, d50cMicron: uz.basin.d50cMicron, sharpness: uz.basin.sharpness,
  }));
  const train = answered('the UZERE two stage train', P.treatmentTrain({
    inletOiwPpm: UZERE_INLET.oiwPpm,
    inletD50Micron: UZERE_INLET.d50Micron,
    sigma: UZERE_INLET.sigma,
    devices: [{ name: 'API 421 basin', ...uz.basin }, { name: 'CPI plate pack', ...uz.plate }],
  }));
  return {
    qM3S: uz.q,
    barrelM3: BARREL_M3,
    muPaS: uz.mu.muPaS,
    muFreshPaS: uz.mu.muFreshPaS,
    salinityFactor: uz.mu.salinityFactor,
    rhoWaterKgM3: uz.rhoW.rhoKgM3,
    rhoFreshKgM3: uz.rhoW.rhoFreshKgM3,
    rhoOilKgM3: uz.rhoO.rhoKgM3,
    sg60: uz.rhoO.sg60,
    // DERIVED, the brine and crude densities above subtracted.
    densityDifference: uz.rhoW.rhoKgM3 - uz.rhoO.rhoKgM3,
    riseMS: uz.rise.vMS,
    riseReynolds: uz.rise.reynolds,
    overflowRateMS: uz.basin.overflowRateMS,
    basinCutMicron: uz.basin.d50cMicron,
    basinRemovalPct: basinRemoval.removalFraction * 100,
    plateCutMicron: uz.plate.d50cMicron,
    plateEffectiveAreaM2: uz.plate.effectiveAreaM2,
    outletOiwPpm: train.outletOiwPpm,
    overallRemovalPct: train.overallRemovalPct,
    outletMedianMicron: train.outletMedianMicron,
    inletMedianMicron: train.inletMedianMicron,
    meetsSpec: train.meetsSpec,
    verdictWithheldReason: train.verdictWithheldReason,
  };
};

// ---------------------------------------------------------------------------
// SECTION 21. The Professional reading, one de-oiling train through three
// unlike devices.
// ---------------------------------------------------------------------------

export const professionalReading = () => {
  const ko = kokori();
  const train = answered('the KOKORI train', P.treatmentTrain({
    inletOiwPpm: KOKORI_TRAIN_INLET.oiwPpm,
    inletD50Micron: KOKORI_TRAIN_INLET.d50Micron,
    sigma: KOKORI_TRAIN_INLET.sigma,
    devices: [
      { name: 'Hydrocyclone bank', ...ko.cyclone },
      { name: 'Induced gas flotation', ...ko.flotation },
      { name: 'Walnut shell filter', ...ko.filter },
    ],
  }));
  return {
    muPaS: ko.mu.muPaS,
    rhoWaterKgM3: ko.rhoW.rhoKgM3,
    rhoOilKgM3: ko.rhoO.rhoKgM3,
    // DERIVED, the two densities subtracted.
    densityDifference: ko.rhoW.rhoKgM3 - ko.rhoO.rhoKgM3,
    cyclone: ko.cyclone,
    flotation: ko.flotation,
    filter: ko.filter,
    train,
  };
};

// ---------------------------------------------------------------------------
// SECTION 22. HISTORY, and the one reader whose subject is the repair.
// ---------------------------------------------------------------------------

export const repairHistory = () => ({
  minLoadingMHr: DECLARED.filterMinLoadingMHr,
  referenceLoadingMHr: DECLARED.filterReferenceLoadingMHr,
  residenceWarnS: DECLARED.flotationResidenceWarnS,
});

// ---------------------------------------------------------------------------
// THE CAPSTONE. Below this line nothing is a teaching value, and NO PANEL AND
// NO COURSE PAGE MAY IMPORT ANY OF IT. capstoneLeak.test.js greps every panel
// source, this file and the learning page for a graded answer in five string
// shapes and for a numeric match inside tolerance.
//
// The three capstone streams are named only by the eighteen graded field KEYS,
// which gradedTolerance.js owns. Nothing here spells a stream name of its own,
// so the guard's key exemption never has to cover this file.
//
// NOT ONE OF THE EIGHTEEN DEPENDS ON A HELD ITEM. No graded field is a verdict,
// a margin or a spec comparison; both graded beds run at the module's own
// reference grain size where the held grain exponent multiplies by exactly one;
// no graded field reads a flotation cut size, so the one calibration in this
// module reaches none of them; and no train here is given a dissolved oil floor.
// ---------------------------------------------------------------------------

/** The Associate line: a gravity front end, a basin then a plate pack. */
export const CAPSTONE_A = Object.freeze({
  water: { tC: 58.5, tdsPpm: 42500 },
  oil: { apiGravity: 27.5, tC: 58.5 },
  bwpd: 36000,
  inlet: { oiwPpm: 420, d50Micron: 22, sigma: 0.75 },
  basin: {
    lengthM: 15, widthM: 3.4, depthM: 1.5, shortCircuitF: 1.6,
  },
  plates: { plateAreaM2: 2.5, nPlates: 48, efficiencyFactor: 0.7 },
});

/** The Professional line: a short liner bank, a flotation cell and a bed. */
export const CAPSTONE_B = Object.freeze({
  water: { tC: 47, tdsPpm: 88000 },
  oil: { apiGravity: 31, tC: 47 },
  bwpd: 58000,
  liners: {
    nLiners: 100,
    linerDiameterM: 0.035,
    linerLengthM: 0.7,
    designFlowPerLinerM3S: 0.0006,
    gFieldAtDesign: 1000,
    coreRadiusFraction: 0.5,
  },
  flotation: {
    cellVolumeM3: 26,
    nCells: 3,
    cellDepthM: 3.5,
    gasRatio: 0.12,
    bubbleMicron: 220,
    gasDensityKgM3: 1.2,
    attachmentEfficiency: 0.01,
  },
  filter: {
    areaM2: 18, bedDepthM: 1.1, mediaMicron: 800, filterCoefficientPerM: 3.5, referenceDropletMicron: 20,
  },
});

/** The Expert line: a three stage train with no flotation and no spec. */
export const CAPSTONE_C = Object.freeze({
  water: { tC: 66, tdsPpm: 21000 },
  oil: { apiGravity: 36, tC: 66 },
  bwpd: 44000,
  inlet: { oiwPpm: 1150, d50Micron: 19, sigma: 0.85 },
  plates: { plateAreaM2: 2.2, nPlates: 56, efficiencyFactor: 0.7 },
  liners: {
    nLiners: 120,
    linerDiameterM: 0.035,
    linerLengthM: 0.7,
    designFlowPerLinerM3S: 0.0006,
    gFieldAtDesign: 1000,
    coreRadiusFraction: 0.5,
  },
  filter: {
    areaM2: 14, bedDepthM: 1.4, mediaMicron: 800, filterCoefficientPerM: 3.5, referenceDropletMicron: 20,
  },
  grid: { nBins: 60, spanSigma: 4 },
  coarseDropletMicron: 240,
});

/** Every export below this line, so the leak gate can tell the two halves apart. */
export const CAPSTONE_ONLY_EXPORTS = Object.freeze([
  'CAPSTONE_A', 'CAPSTONE_B', 'CAPSTONE_C',
  'capstoneRuns', 'capstoneFields', 'capstoneValues', 'CAPSTONE_ONLY_EXPORTS',
]);

/** Every engine call the three capstone lines make, in one place. */
export const capstoneRuns = () => {
  const aQ = m3PerSecond(CAPSTONE_A.bwpd);
  const aMu = answered('the Associate line viscosity', P.waterViscosityPaS(CAPSTONE_A.water));
  const aRhoW = answered('the Associate line brine density', P.waterDensityKgM3(CAPSTONE_A.water));
  const aRhoO = answered('the Associate line crude density', P.oilDensityKgM3(CAPSTONE_A.oil));
  const aFluid = { rhoWater: aRhoW.rhoKgM3, rhoOil: aRhoO.rhoKgM3, muPaS: aMu.muPaS };
  const aRise = answered('the Associate line median droplet rise', P.stokesRiseMS({
    dMicron: CAPSTONE_A.inlet.d50Micron, ...aFluid,
  }));
  const aBasin = answered('the Associate line basin', P.apiSeparator({
    flowM3S: aQ, ...CAPSTONE_A.basin, ...aFluid,
  }));
  const aPlate = answered('the Associate line plate pack', P.plateInterceptor({
    flowM3S: aQ, ...CAPSTONE_A.plates, ...aFluid,
  }));

  const bQ = m3PerSecond(CAPSTONE_B.bwpd);
  const bMu = answered('the Professional line viscosity', P.waterViscosityPaS(CAPSTONE_B.water));
  const bRhoW = answered('the Professional line brine density', P.waterDensityKgM3(CAPSTONE_B.water));
  const bRhoO = answered('the Professional line crude density', P.oilDensityKgM3(CAPSTONE_B.oil));
  const bFluid = { rhoWater: bRhoW.rhoKgM3, rhoOil: bRhoO.rhoKgM3, muPaS: bMu.muPaS };
  const bCyc = answered('the Professional line liner bank', P.hydrocyclone({
    flowM3S: bQ, ...CAPSTONE_B.liners, ...bFluid,
  }));
  const bFlot = answered('the Professional line flotation cell', P.flotation({
    flowM3S: bQ, ...CAPSTONE_B.flotation, ...bFluid,
  }));
  const bFilter = answered('the Professional line bed', P.mediaFilter({ flowM3S: bQ, ...CAPSTONE_B.filter }));

  const cQ = m3PerSecond(CAPSTONE_C.bwpd);
  const cMu = answered('the Expert line viscosity', P.waterViscosityPaS(CAPSTONE_C.water));
  const cRhoW = answered('the Expert line brine density', P.waterDensityKgM3(CAPSTONE_C.water));
  const cRhoO = answered('the Expert line crude density', P.oilDensityKgM3(CAPSTONE_C.oil));
  const cFluid = { rhoWater: cRhoW.rhoKgM3, rhoOil: cRhoO.rhoKgM3, muPaS: cMu.muPaS };
  const cPlate = answered('the Expert line plate pack', P.plateInterceptor({
    flowM3S: cQ, ...CAPSTONE_C.plates, ...cFluid,
  }));
  const cCyc = answered('the Expert line liner bank', P.hydrocyclone({
    flowM3S: cQ, ...CAPSTONE_C.liners, ...cFluid,
  }));
  const cFilter = answered('the Expert line bed', P.mediaFilter({ flowM3S: cQ, ...CAPSTONE_C.filter }));
  const cTrain = answered('the Expert line train', P.treatmentTrain({
    inletOiwPpm: CAPSTONE_C.inlet.oiwPpm,
    inletD50Micron: CAPSTONE_C.inlet.d50Micron,
    sigma: CAPSTONE_C.inlet.sigma,
    ...CAPSTONE_C.grid,
    devices: [
      { name: 'CPI plate pack', ...cPlate },
      { name: 'Hydrocyclone bank', ...cCyc },
      { name: 'Walnut shell filter', ...cFilter },
    ],
  }));
  const cCoarse = answered('the Expert line coarse droplet rise', P.stokesRiseMS({
    dMicron: CAPSTONE_C.coarseDropletMicron, ...cFluid,
  }));

  return {
    aMuPaS: aMu.muPaS,
    aRhoWaterKgM3: aRhoW.rhoKgM3,
    aRhoOilKgM3: aRhoO.rhoKgM3,
    aRiseMS: aRise.vMS,
    aBasinCutMicron: aBasin.d50cMicron,
    aPlateCutMicron: aPlate.d50cMicron,
    bTurndownRatio: bCyc.turndownRatio,
    bShearPenalty: bCyc.shearPenalty,
    bCycloneCutMicron: bCyc.d50cMicron,
    bBubbleRiseMS: bFlot.bubbleRiseMS,
    bGasHoldup: bFlot.gasHoldup,
    bFilterCutMicron: bFilter.d50cMicron,
    cCycloneStageMedianMicron: cTrain.stages[1].outletMedianMicron,
    cPlateStageRemovalPct: cTrain.stages[0].removalPct,
    cCycloneStageRemovalPct: cTrain.stages[1].removalPct,
    cTrainOutletPpm: cTrain.outletOiwPpm,
    cTrainOutletMedianMicron: cTrain.outletMedianMicron,
    cCoarseReynolds: cCoarse.reynolds,
    // The soundness statements a capstone gate re-measures, carried as values
    // rather than as prose so nothing here has to be taken on trust.
    aBasinWarning: aBasin.warning,
    aPlateWarning: aPlate.warning,
    aBasinVelocityRuleComplete: aBasin.velocityRuleComplete,
    bFlotationWarning: bFlot.warning,
    bFilterRemovalFraction: bFilter.removalFraction,
    bFilterMediaMicron: CAPSTONE_B.filter.mediaMicron,
    cFilterMediaMicron: CAPSTONE_C.filter.mediaMicron,
    cShearPenalty: cCyc.shearPenalty,
    cTrainComplete: cTrain.complete,
    cStagesRun: cTrain.stagesRun,
    cStagesSkipped: cTrain.stagesSkipped,
    cDissolvedOilFloorPpm: cTrain.dissolvedOilFloorPpm,
    cFloorApplied: cTrain.floorApplied,
    cMeetsSpec: cTrain.meetsSpec,
    cMarginPpm: cTrain.marginPpm,
    cVerdictWithheldReason: cTrain.verdictWithheldReason,
    cInletMedianMicron: cTrain.inletMedianMicron,
    cStageNames: cTrain.stages.map((s) => s.name),
    bLinersAtDesignFlow: bCyc.linersAtDesignFlow,
    bIdealCutMicron: bCyc.idealD50cMicron,
    bGField: bCyc.gField,
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
    r.aMuPaS, r.aRhoWaterKgM3, r.aRhoOilKgM3, r.aRiseMS, r.aBasinCutMicron, r.aPlateCutMicron,
    r.bTurndownRatio, r.bShearPenalty, r.bCycloneCutMicron, r.bBubbleRiseMS, r.bGasHoldup, r.bFilterCutMicron,
    r.cCycloneStageMedianMicron, r.cPlateStageRemovalPct, r.cCycloneStageRemovalPct,
    r.cTrainOutletPpm, r.cTrainOutletMedianMicron, r.cCoarseReynolds,
  ];
  return GRADED_FIELDS.map(([tier, key], i) => [tier, key, values[i]]);
};

/** The same eighteen, by key. */
export const capstoneValues = () => Object.fromEntries(capstoneFields().map(([, k, v]) => [k, v]));

// ---------------------------------------------------------------------------
// THE LEAK GUARD. A teaching number that lands on a graded answer hands the
// assessment away, so the gate walks every number every teaching export returns
// and refuses a surface too small to mean anything.
//
// THE BANDS ARE READ FROM THE ANSWER FILE AND NEVER RESTATED HERE. Nothing
// below types a tolerance: `leakGuardTargets` is handed the rows of fields.json
// and scales whatever band it finds there.
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

/** Every graded answer in every shifting, with the band scaled with it. */
export const leakGuardTargets = (fields) => fields.flatMap(([, key, value, band]) => LEAK_GUARD_SCALINGS
  .map(({ factor, tag }) => {
    const scaled = value * factor;
    const scaledBand = band * factor;
    return {
      key,
      tag,
      value: scaled,
      gradingBand: scaledBand,
      band: Math.min(scaledBand * LEAK_GUARD_MARGIN, Math.abs(scaled) * LEAK_GUARD_RELATIVE_CAP),
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
