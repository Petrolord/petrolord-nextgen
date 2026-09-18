// THE FC6 CAPSTONE CONDITIONS. The AMENAM shell-and-tube cooler, the UBIT
// shell-and-tube train, and the OKWORI air cooler bay.
//
// Nothing here is imported by fc6_dump.mjs, and no rate, heat capacity,
// terminal temperature, coefficient, fouling allowance, conductivity,
// diameter, length, pass count, duty, ambient or barometric pressure is
// shared with the teaching fields in fc6_fields.mjs. Only the migration
// headers and the go-live may read the values this produces.
//
// NO GRADED FIELD DEPENDS ON A HELD OR FITTED ITEM, and each one is
// neutralised by CONSTRUCTION rather than by looking anything up:
//
//   * THE FIVE FITTED NUMBERS (Dittus-Boelter's 0.023, 0.8 and 0.4, the
//     Sieder-Tate 0.14 and the laminar Nusselt 3.66) live in `tubeSideFilm`
//     and nowhere else. This capstone never calls it. Both film coefficients
//     on UBIT are STATED as conditions of the study, the way FC1 stated a
//     vendor K value, so every graded U is built from numbers on the page.
//   * THE HELD BUNDLE_K TABLE sets `bundleDiameterIn` and `shellDiameterIn`
//     and nothing else. `nTubes`, `areaPerTubeFt2`, `actualAreaFt2` and
//     `areaMarginPct` are the tube surface and the pass-count rounding, which
//     carry no bundle constant at all. NO graded field reads a diameter out
//     of `tubeCount`.
//   * THE HELD CROSS-FLOW F is what `airCooler` cannot source, and it sets
//     the design AREA of a bay. NO graded field reads `areaFt2` from the air
//     cooler. The hot-day rating holds effectiveness from its DEFINITION at
//     fixed UA and fixed air mass, so it assumes no arrangement and needs no
//     F, which is exactly why the spine of this course sits there.
//   * THE HELD FAN CONSTANT and its implied water density set `fanBhp` and
//     `motorHp`. NO graded field reads either, and OKWORI states its own fan
//     static pressure, fan efficiency and motor efficiency so that not one of
//     the three held air-cooler defaults is even read.
//   * THE HELD WALL CONDUCTIVITY DEFAULT of 26 names no material. UBIT states
//     its own conductivity as a condition, so the default is not read.
//   * THE HELD COOLING EXPONENT is refused by the engine rather than
//     answered. No capstone tube side is a cooled one: AMENAM and UBIT put
//     the heated stream in the tubes, and neither calls the film at all.
//   * AND NONE OF THESE CONDITIONS IS A GOLDEN CASE. FINDINGS-heattransfer.md
//     lists every condition the FC6-0 golden now carries, in both directions,
//     because FC4's repair took a capstone's exact conditions for a golden row
//     and the published file handed back a graded answer. Every quadruple,
//     every (P, R) pair, every (NTU, Cr) pair, every (ho, hi, do, di) set,
//     every bundle case and every air cooler case below was checked against
//     that list and against FC1's separationLab conditions. Re-run
//     gate_capstone_leak.py and gate_golden_collision.py after any change
//     here: a golden can acquire a case that collides with a capstone at any
//     time without this wave touching anything.
//
// AND THE COLD INLET AND THE COEFFICIENT ARE CHOSEN SO THE PASS ROUNDING BITES.
// The tube count before the second rounding is ODD on this case, so rounding up
// to a whole multiple of the two passes MOVES it, and a candidate who skips that
// rounding gets the area margin wrong. MEASURED, not assumed: an earlier pair
// landed on an even count, and discriminate.mjs immediately reported the two
// pass-rounding routes as BLIND on the one field that grades the count.
//
// FOUR CONDITIONS WERE MOVED BY THAT GATE RATHER THAN BY A DESIGN CHOICE, and
// the record belongs here. A cold inlet of 118 and an overall coefficient of 118
// collided with a count the digest prints; a conductivity of 31 collided with the
// "about 31 percent" inside the engine's own held-exponent message; and a fan
// static pressure of 0.65 collided with the engine's DEFAULT fan efficiency,
// which the digest prints in its held-items table. None of the four was a
// physical collision and all four are now moved, because a leak gate that has to
// be argued with stops being read.

/* ------------------------------------------------------------------ *
 * Associate. AMENAM, a crude cooler on a flow station: one exchanger
 * from its energy balance to the number of tubes it takes.
 * ------------------------------------------------------------------ */

/** The two streams. The hot outlet is specified, so the cold outlet is the
 *  engine's answer rather than a condition. */
export const AMENAM_HOT = { mLbHr: 62000, cpBtuLbF: 0.58 };
export const AMENAM_COLD = { mLbHr: 91000, cpBtuLbF: 0.97 };
export const AMENAM_TERMINALS = { thIn: 328, thOut: 214, tcIn: 119 };
export const AMENAM_ARRANGEMENT = 'counter';
/** The overall coefficient this study was given, so no film is computed. */
export const AMENAM_U_BTU_HR_FT2_F = 126;
/** The bundle the fabricator quoted. */
export const AMENAM_TUBE = { doIn: 0.875, tubeLengthFt: 18, passes: 2 };
export const AMENAM_LAYOUT_DEG = 30;
export const AMENAM_BUNDLE_CLEARANCE_IN = 2.75;

/* ------------------------------------------------------------------ *
 * Professional. UBIT, a shell-and-tube train: the correction a shell
 * count buys, and an overall coefficient assembled from five named
 * resistances.
 * ------------------------------------------------------------------ */

/** The four terminals the correction is read from. */
export const UBIT_TERMINALS = { thIn: 405, thOut: 265, tcIn: 135, tcOut: 233 };
/** One shell first, then the same duty in two shells in series. */
export const UBIT_SHELLS = 1;
export const UBIT_SHELLS_IN_SERIES = 2;
/** Both films STATED, which is what keeps every graded U clear of the fits. */
export const UBIT_STACK = {
  hoBtuHrFt2F: 265,
  hiBtuHrFt2F: 1120,
  doIn: 0.875,
  diIn: 0.729,
  kWallBtuHrFtF: 29,
  foulingOut: 0.0015,
  foulingIn: 0.0025,
};

/* ------------------------------------------------------------------ *
 * Expert. OKWORI, an air cooler bay: the design point it was bought
 * on, and the hot afternoon it has to hold.
 * ------------------------------------------------------------------ */

export const OKWORI = {
  qBtuHr: 26400000,
  processInF: 268,
  processOutF: 172,
  ambientF: 93,
  airRiseF: 27,
  uBtuHrFt2F: 4.85,
  /** Stated, so no held air-cooler default is read on this capstone. */
  staticPressureInH2O: 0.78,
  fanEfficiency: 0.68,
  motorEfficiency: 0.94,
  /** The afternoon the bay is judged on, and the elevation it sits at. */
  checkAmbientF: 113,
  draftType: 'forced',
  barometricPsia: 13.9,
};
