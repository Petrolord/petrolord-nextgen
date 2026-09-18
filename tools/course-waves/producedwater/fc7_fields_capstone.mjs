// THE THREE FC7 CAPSTONE STREAMS. NOT FOR LESSONS, NOT FOR PANELS, NOT FOR THE
// DIGEST.
//
// The teaching streams are UZERE, KOKORI and OGBOTOBO and they live in
// fc7_fields.mjs. These three are OGULAGHA, IZOMBE and TUNU, they appear
// nowhere else in this wave, and gate_capstone_leak.py greps the digest and
// every generator for all three names and for every graded answer in several
// renderings.
//
// ---------------------------------------------------------------------------
// HOW THE HELD ITEMS ARE NEUTRALISED, BY CONSTRUCTION AND NOT BY A PROMISE
// ---------------------------------------------------------------------------
// FC7-0 held six things for literature. A graded field may not depend on any of
// them, and on this wave that is harder than on any earlier one, because one of
// the six is a CALIBRATION sitting inside the flotation chain. Each is
// neutralised by the way the streams below are built, and fc7_capstone.mjs
// ASSERTS every one of these sentences against the engine's own return values
// rather than trusting them:
//
// 1. THE DISSOLVED AND SOLUBLE OIL FLOOR has no value in this module. No
//    capstone passes `dissolvedOilFloorPpm`, so no graded concentration is a
//    floored one. Asserted: `dissolvedOilFloorPpm` comes back null and
//    `floorApplied` comes back false on the TUNU train.
// 2. API 421's HORIZONTAL VELOCITY RULE is implemented in its fixed half only.
//    The OGULAGHA basin is 3.4 m wide and 1.5 m deep, which puts its horizontal
//    velocity BELOW the fixed limit, so the missing half cannot decide
//    anything. Asserted: the basin returns no warning at all.
// 3. THE DISCHARGE LIMIT. The engine states none and a test asserts it states
//    none, so NO graded field is a verdict, a margin or a spec comparison. The
//    TUNU train is run with no spec at all and the engine withholds its verdict
//    for that reason, which is the lesson. Asserted: `meetsSpec` and `marginPpm`
//    come back null and `verdictWithheldReason` is the no-specification one.
// 4. THE MEDIA FILTER'S LAMBDA EXPONENT. Lambda goes as the inverse CUBE of the
//    grain size and this repository carries no bed data to check the exponent
//    against. BOTH graded filters run at the module's own REFERENCE grain size,
//    800 micron, where the media factor is exactly 1 and the held exponent
//    cannot move the answer whatever it is. Asserted: `mediaMicron` equals
//    `DECLARED_CONSTANTS.filterReferenceMediaMicron` on both.
// 5. `attachmentEfficiency` = 0.01 IS A CALIBRATION with no derivation. NO
//    graded field reads a flotation CUT SIZE. What IZOMBE grades from its
//    flotation cell is the bubble rise velocity, which is the Schiller-Naumann
//    drag balance and is validated by the oracle's own bisection, and the gas
//    holdup, which is the superficial gas velocity over that rise velocity.
//    Neither contains the attachment efficiency, the interception coefficient
//    or the cut. Asserted: perturbing `attachmentEfficiency` by a factor of ten
//    moves the flotation CUT and leaves both graded flotation fields identical
//    to the last bit.
// 6. E28's UNSOURCED CONSTANTS are pinned rather than validated. Every one of
//    them that touches a graded answer is PASSED EXPLICITLY below and stated on
//    the capstone page, the way FC1 stated a vendor K on every tier: the
//    short-circuit factor, the plate efficiency factor, the whole liner
//    geometry with its design flow and its rated field, the filter coefficient
//    with its reference droplet and grain, and the bin grid. A learner grades
//    the engine's arithmetic on numbers they can see, and no pinned number
//    reaches them as though it were published. The property fits and the
//    reduced-efficiency sharpness cannot be passed as inputs at all; they are
//    named as the module's own declared choices in the capstone brief, which is
//    the whole of what any gate can do with a pin.
//
// The de-oiler cut being finer than field de-oilers are customarily credited
// with is also held. It is a statement about what the model LEAVES OUT, carried
// on `cutBasis` in every hydrocyclone return, and the capstone brief carries it
// beside the graded cut rather than grading against a field figure that does
// not exist here.

/** One barrel, exactly, in cubic metres. The only unit conversion in this file. */
export const BARREL_M3 = 0.158987294928;
export const m3PerSecond = (bwpd) => (bwpd * BARREL_M3) / 86400;

/* ------------------------------------------------------ Associate, OGULAGHA */
/**
 * OGULAGHA. A 36,000 bwpd produced water stream off a warm, moderately saline
 * field, into a gravity front end: an API 421 basin followed by a plate pack.
 */
export const OGULAGHA_WATER = { tC: 58.5, tdsPpm: 42500 };
export const OGULAGHA_OIL = { apiGravity: 27.5, tC: 58.5 };
export const OGULAGHA_BWPD = 36000;
export const OGULAGHA_INLET = { oiwPpm: 420, d50Micron: 22, sigma: 0.75 };
/** The basin. The width and depth are what keep it under the fixed velocity limit. */
export const OGULAGHA_BASIN = {
  lengthM: 15, widthM: 3.4, depthM: 1.5, shortCircuitF: 1.6,
};
export const OGULAGHA_PLATES = { plateAreaM2: 2.5, nPlates: 48, efficiencyFactor: 0.7 };

/* --------------------------------------------------- Professional, IZOMBE */
/**
 * IZOMBE. A 58,000 bwpd stream off a cooler, much more saline field, through
 * the three devices whose cut size does not come from gravity alone. The liner
 * bank is deliberately SHORT: 100 liners carry 1.78 times their design flow, so
 * the field is at its ceiling and the cut carries the inlet shear penalty. That
 * is the FC7-0 decision the tier exists to teach, and the engine says how many
 * liners the flow wants.
 */
export const IZOMBE_WATER = { tC: 47, tdsPpm: 88000 };
export const IZOMBE_OIL = { apiGravity: 31, tC: 47 };
export const IZOMBE_BWPD = 58000;
export const IZOMBE_LINERS = {
  nLiners: 100,
  linerDiameterM: 0.035,
  linerLengthM: 0.7,
  designFlowPerLinerM3S: 0.0006,
  gFieldAtDesign: 1000,
  coreRadiusFraction: 0.5,
};
export const IZOMBE_FLOTATION = {
  cellVolumeM3: 26, nCells: 3, cellDepthM: 3.5, gasRatio: 0.12,
  bubbleMicron: 220, gasDensityKgM3: 1.2, attachmentEfficiency: 0.01,
};
export const IZOMBE_FILTER = {
  areaM2: 18, bedDepthM: 1.1, mediaMicron: 800,
  filterCoefficientPerM: 3.5, referenceDropletMicron: 20,
};

/* --------------------------------------------------------- Expert, TUNU */
/**
 * TUNU. A 44,000 bwpd stream off a hot, fresher field, through a full three
 * stage train whose every cut size is computed from the equipment's own
 * geometry rather than typed, so the coupling is the engine's own. There is NO
 * flotation stage in it, which is what keeps the calibration out of every
 * graded answer, and NO discharge spec, which is what keeps the held limit out
 * of the verdict.
 */
export const TUNU_WATER = { tC: 66, tdsPpm: 21000 };
export const TUNU_OIL = { apiGravity: 36, tC: 66 };
export const TUNU_BWPD = 44000;
export const TUNU_INLET = { oiwPpm: 1150, d50Micron: 19, sigma: 0.85 };
export const TUNU_PLATES = { plateAreaM2: 2.2, nPlates: 56, efficiencyFactor: 0.7 };
export const TUNU_LINERS = {
  nLiners: 120,
  linerDiameterM: 0.035,
  linerLengthM: 0.7,
  designFlowPerLinerM3S: 0.0006,
  gFieldAtDesign: 1000,
  coreRadiusFraction: 0.5,
};
export const TUNU_FILTER = {
  areaM2: 14, bedDepthM: 1.4, mediaMicron: 800,
  filterCoefficientPerM: 3.5, referenceDropletMicron: 20,
};
/** The bin grid the train is integrated on, stated rather than defaulted. */
export const TUNU_GRID = { nBins: 60, spanSigma: 4 };
/**
 * The coarse droplet the Expert tier reads the creeping flow band on. 240
 * micron is well outside it in this water, and the graded number is the
 * Reynolds number the engine reports beside its own Stokes answer.
 */
export const TUNU_COARSE_DROPLET_MICRON = 240;
