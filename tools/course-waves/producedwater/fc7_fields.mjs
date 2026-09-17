// THE FC7 TEACHING FIELDS. Every stream, sweep and probe the digest is built
// from lives here, so a reader of fc7_dump.mjs can see what was asked as well
// as what came back.
//
// THESE ARE NOT THE CAPSTONE STREAMS. The capstone runs three other streams
// entirely, and their names are written down in ONE place, fc7_fields_capstone.mjs.
// They are deliberately not repeated here, because gate_capstone_leak.py greps
// this file for them and a comment saying "the capstone streams are X, Y and Z"
// is itself the leak the gate is looking for. That is not a hypothetical: the
// first draft of this header named all three and the gate caught it.
//
// The three teaching streams are UZERE, KOKORI and OGBOTOBO.

/** One barrel, exactly, in cubic metres. */
export const BARREL_M3 = 0.158987294928;
export const m3PerSecond = (bwpd) => (bwpd * BARREL_M3) / 86400;

/* ---------------------------------------------------------------- UZERE --
 * Associate. A 28,000 bwpd produced water stream off a cool, saline field,
 * into a gravity front end.
 */
export const UZERE_WATER = { tC: 41, tdsPpm: 62000 };
export const UZERE_OIL = { apiGravity: 24, tC: 41 };
export const UZERE_BWPD = 28000;
export const UZERE_INLET = { oiwPpm: 650, d50Micron: 26, sigma: 0.8 };
export const UZERE_BASIN = { lengthM: 10, widthM: 2.6, depthM: 1.4 };
/**
 * The same basin at a shallower water depth. The depth does NOT enter the cut
 * size and it DOES enter the horizontal velocity check, and printing the two
 * side by side is the only way to show that.
 */
export const UZERE_BASIN_SHALLOW_DEPTH_M = 0.9;
export const UZERE_PLATES = { plateAreaM2: 3.0, nPlates: 30 };
/** The droplet the Associate tier follows through the basin. */
export const UZERE_DROPLET_MICRON = 26;

/* --------------------------------------------------------------- KOKORI --
 * Professional. A 75,000 bwpd stream off a warm, fresher field, through the
 * three devices whose cut does not come from gravity alone.
 */
export const KOKORI_WATER = { tC: 53, tdsPpm: 15000 };
export const KOKORI_OIL = { apiGravity: 29, tC: 53 };
export const KOKORI_BWPD = 75000;
export const KOKORI_LINERS = { nLiners: 200 };
export const KOKORI_FLOTATION = {
  cellVolumeM3: 12, nCells: 5, cellDepthM: 2.8, gasRatio: 0.25, bubbleMicron: 400,
};
export const KOKORI_FILTER = { areaM2: 20, bedDepthM: 0.8, mediaMicron: 650 };

/* ------------------------------------------------------------ OGBOTOBO --
 * Expert. A 65,000 bwpd stream off a hot, very saline field carrying fine
 * sheared oil, through a FOUR stage train, which is where the coupling is
 * easiest to watch.
 */
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
/**
 * Two specification figures, used ONLY to show which branch of the verdict
 * fires. Neither is a limit: this module states none and this course states
 * none. See the block they are printed in.
 */
export const OGBOTOBO_SPEC_TIGHT_PPM = 30;
export const OGBOTOBO_SPEC_LOOSE_PPM = 60;
/** A dissolved oil floor the CALLER states. The module states no value. */
export const OGBOTOBO_CALLER_FLOOR_PPM = 5;
/**
 * The narrow inlet the floor block is illustrated on, and one very fine device.
 * A dispersed outlet only falls far enough for a floor to matter when the
 * distribution is NARROW: on a wide one the fine tail carries volume no device
 * in this module removes, which is the second half of the same lesson.
 */
export const FLOOR_DEMO_INLET = { oiwPpm: 650, d50Micron: 26, sigma: 0.7 };
export const FLOOR_DEMO_CUT_MICRON = 2;
/** The wide-water counterpart: an artificial chain of identical fine devices. */
export const FLOOR_WIDE_STAGES = 8;
export const FLOOR_WIDE_CUT_MICRON = 4;

/* ------------------------------------------------------------- sweeps --- */

/** Viscosity against temperature at one salinity, and against salinity at one temperature. */
export const VISC_T_SWEEP = [20, 35, 50, 65, 80, 95];
export const VISC_TDS_SWEEP = [0, 25000, 62000, 120000, 200000, 280000];
/** Crude density against API gravity at the UZERE temperature. */
export const API_SWEEP = [12, 19, 24, 30, 38, 46];
/** The temperature and TDS bands, at their edges and just past them. */
export const VISC_BAND = { lowEdge: -10, belowLow: -10.5, highEdge: 200, aboveHigh: 200.5 };
export const DENSITY_BAND = { lowEdge: 0, belowLow: -0.5, highEdge: 100, aboveHigh: 100.5 };
export const TDS_BAND = { max: 300000, justOver: 300001, negative: -1 };
export const API_BAND = { low: 5, belowLow: 4.9, high: 100, aboveHigh: 100.1, infinite: -131.5 };

/** The bin grid: the median identity and the truncated tail. */
export const NBINS_SWEEP = [30, 60, 120, 600];
export const SPAN_SWEEP = [3, 4, 5, 6];
export const SIGMA_SWEEP = [0.5, 0.7, 0.8, 1.0, 1.5];
/** The reduced-efficiency curve, at both sharpnesses the module uses. */
export const GRADE_RATIOS = [0.25, 0.5, 0.75, 1.0, 1.5, 2, 4];
export const GRADE_SHARPNESS = [2, 3];

/** The basin, swept on the two things a designer can change. */
export const BASIN_AREA_SWEEP = [{ lengthM: 6, widthM: 2 }, { lengthM: 10, widthM: 2.6 },
  { lengthM: 14, widthM: 3 }, { lengthM: 20, widthM: 4 }];
export const SHORT_CIRCUIT_SWEEP = [1.0, 1.3, 1.5, 1.8, 2.5];
export const SHORT_CIRCUIT_REFUSED = [0, -2, 6];
/** The plate pack, swept on plate count. */
export const PLATE_COUNT_SWEEP = [10, 30, 60, 120];

/** The liner bank, swept DOWNWARD, which is the sweep the old model failed. */
export const LINER_SWEEP = [600, 460, 350, 280, 230, 200, 177, 150, 120];
export const LINER_REFUSED = [115, 1];
export const LINER_STARVED = 700;
/**
 * The liner geometry, swept on the two dimensions that set the residence time.
 *
 * THE BORE LEG IS FIVE ROWS AT ONE LENGTH, over a tenfold span of bore, because
 * ONE row cannot show a direction and cannot show that the direction holds. The
 * first draft carried a single wider bore beside the length leg and the
 * sentence under the table read the pair backwards, asserting a coarser cut
 * where the engine had printed a finer one. A sweep is the cheapest thing in
 * this file and it is the only thing that settles a direction.
 */
export const LINER_GEOMETRY_SWEEP = [
  { linerDiameterM: 0.035, linerLengthM: 0.5 },
  { linerDiameterM: 0.035, linerLengthM: 0.7 },
  { linerDiameterM: 0.035, linerLengthM: 1.0 },
  { linerDiameterM: 0.01, linerLengthM: 0.7 },
  { linerDiameterM: 0.02, linerLengthM: 0.7 },
  { linerDiameterM: 0.06, linerLengthM: 0.7 },
  { linerDiameterM: 0.1, linerLengthM: 0.7 },
];
/** The length the bore leg above is swept at, and the rows that make it up. */
export const LINER_BORE_LEG_LENGTH_M = 0.7;
export const CORE_FRACTION_SWEEP = [0.2, 0.35, 0.5, 0.65];
export const CORE_FRACTION_REFUSED = 0.75;

/** Flotation: the two boxes that separate induced gas from dissolved gas. */
export const BUBBLE_SWEEP = [40, 80, 150, 300, 600, 1200];
export const GAS_RATIO_SWEEP = [0.02, 0.05, 0.12, 0.25, 0.6, 1.5];
export const CELL_DEPTH_SWEEP = [1.5, 2.8, 4.0, 6.0];
/**
 * The cell count at EQUAL TOTAL VOLUME and EQUAL TOTAL GAS. The gas ratio is
 * scaled by the cell count so the unit is fed the same gas however it is
 * arranged, which is the identity the old arrangement bug broke.
 */
export const CELL_ARRANGEMENT = [
  { nCells: 1, cellVolumeM3: 60 }, { nCells: 2, cellVolumeM3: 30 },
  { nCells: 4, cellVolumeM3: 15 }, { nCells: 12, cellVolumeM3: 5 },
];
export const ARRANGEMENT_TOTAL_GAS_RATIO = 0.3;
export const IGF_PRESET = { gasRatio: 0.2, bubbleMicron: 300 };
export const DAF_PRESET = { gasRatio: 0.03, bubbleMicron: 80 };
export const FLOTATION_REFUSED = { gasRatio: 4, bubbleMicron: 5, attachmentEfficiency: 0 };

/** The bed: the two inputs that used to move the answer by nothing at all. */
export const BED_DEPTH_SWEEP = [0.1, 0.4, 0.8, 1.6, 3.0, 10.0];
export const MEDIA_SWEEP = [400, 650, 800, 1200, 1600];
export const LOADING_AREA_SWEEP = [8, 12, 20, 40, 80];
/**
 * THE LOADING FLOOR, which is the FC7-1 repair and the subject this whole wave
 * is named for. The digest promised a refusal, a bed below the floor and the
 * bed that runs the flow at the floor, and carried none of the three, so both
 * the Professional and the Expert writer taught the floor from the declared
 * constant alone with no worked example anywhere to quote.
 *
 * THE ANSWERING AREAS STOP SHORT OF THE FLOOR ON PURPOSE. The bed that runs
 * this flow exactly at the floor is an irrational area, and the six-decimal
 * form a reader would type back is LARGER than it, which loads lower and is
 * REFUSED. A row that answers at a printed area a reader cannot reproduce is
 * worse than no row, so the floor area is stated as the quantity the refusal
 * names and the answering rows sit inside it.
 */
export const FILTER_FLOOR_ANSWER_AREAS = [200, 400, 490];
export const FILTER_FLOOR_REFUSED_AREAS = [600, 2000];

/** The droplet the Stokes group constant is measured out of the engine with. */
export const STOKES_PROBE_MICRON = 100;
/** A cut far below the water, to show what the module does with numerical dust. */
export const DUST_CUT_MICRON = 0.001;
/** The bubble the bubble sweep is read against. */
export const BUBBLE_REFERENCE_MICRON = 300;
/** The inlet the Professional reading runs on. */
export const KOKORI_TRAIN_INLET = { oiwPpm: 900, d50Micron: 20, sigma: 0.7 };
/** Stokes against the full drag balance, across four decades of Reynolds. */
export const RISE_GAP_SWEEP = [5, 20, 60, 120, 240, 500];

/** A train whose stages are all the same device, to show the coupling alone. */
export const IDENTICAL_STAGE_CUT_MICRON = 9;
export const IDENTICAL_STAGE_COUNT = 5;
/** A stage that cannot run, to show what the train does about it. */
export const BROKEN_PLATE_AREA = null;

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
