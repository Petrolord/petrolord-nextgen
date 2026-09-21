// THE TEACHING RECORDS OF THE H2 DIGEST, and the sweeps around them.
//
// THESE ARE NOT THE CAPSTONE SITES. The capstones run UTOROGU, AMUKPE and
// OSIOKA, and no site name, level, duration, concentration, limit, NRR, shift
// length, WBGT readout or metabolic rate is shared between the two files.
// Nothing here imports h2_capstone.mjs and nothing there imports this, and
// gate_capstone_leak.py proves both directions.
//
// Every record exists to reach a BRANCH of the engine a lesson has to teach,
// and each one says which branch in its comment.

const f = (o) => Object.freeze(o);
const fa = (a) => Object.freeze(a.map(f));

/** OBEN: an eight-hour compressor-deck walkdown. The base dosimeter record,
 *  with periods below 80, between 80 and 90, and above 90, so the three
 *  criteria integrate three different subsets of the same day. */
export const OBEN = fa([
  { levelDbA: 84.3, durationH: 2.6 },
  { levelDbA: 89.8, durationH: 1.9 },
  { levelDbA: 94.6, durationH: 0.8 },
  { levelDbA: 81.2, durationH: 1.75 },
  { levelDbA: 99.1, durationH: 0.2 },
  { levelDbA: 76.5, durationH: 0.75 },
]);

/** ORONI: periods sitting EXACTLY on the two thresholds and just under one,
 *  so the inclusive threshold (judgement J2) is visible in a contribution. */
export const ORONI = fa([
  { levelDbA: 80, durationH: 3 },
  { levelDbA: 90, durationH: 2 },
  { levelDbA: 79.9, durationH: 3 },
]);

/** The warning records: above the Table G-16 top of 115, above the NIOSH
 *  ceiling of 115, and above the Table G-16a top of 130. */
export const LOUD_117 = fa([{ levelDbA: 117, durationH: 0.1 }, { levelDbA: 86, durationH: 7.9 }]);
export const LOUD_132 = fa([{ levelDbA: 132, durationH: 0.02 }, { levelDbA: 84, durationH: 7.98 }]);

/** OLOMORO: a ten-hour shift on the action-level dosimeter, for the dose that
 *  accumulates over the whole shift. */
export const OLOMORO = fa([
  { levelDbA: 86.1, durationH: 3.1 },
  { levelDbA: 83.4, durationH: 3.6 },
  { levelDbA: 90.8, durationH: 1.2 },
  { levelDbA: 78.9, durationH: 2.1 },
]);

/** EVWRENI: a task-based LEX survey of one eight-hour day, and the same crew
 *  on a 10.5 hour day, so the eight-hour normaliser is visible. */
export const EVWRENI = fa([
  { laeqDbA: 87.2, durationH: 2.2 },
  { laeqDbA: 80.9, durationH: 3.4 },
  { laeqDbA: 95.4, durationH: 0.6 },
  { laeqDbA: 73.8, durationH: 1.8 },
]);
export const EVWRENI_LONG = fa([
  { laeqDbA: 87.2, durationH: 2.9 },
  { laeqDbA: 80.9, durationH: 4.4 },
  { laeqDbA: 95.4, durationH: 0.6 },
  { laeqDbA: 73.8, durationH: 2.6 },
]);
/** The same crew's weeks: five days, four days, and six days. */
export const WEEK_5 = Object.freeze([86.4, 83.1, 88.2, 84.9, 81.7]);
export const WEEK_4 = Object.freeze([89.5, 87.1, 90.2, 86.3]);
export const WEEK_6 = Object.freeze([84.2, 84.2, 84.2, 84.2, 84.2, 84.2]);

/** Protector teaching cases: an A-weighted TWA and a C-weighted one. */
export const PROTECTOR_A = f({ exposureDb: 97.6, nrrDb: 27 });
export const PROTECTOR_C = f({ exposureDb: 103.2, nrrDb: 27 });
export const NRR_SWEEP = Object.freeze([0, 5, 7, 10, 15, 20, 25, 30, 33]);

/** IGBOMOTORU: personal air samples. A partial shift, a full shift, and a
 *  ten-hour shift, so the divisor of 8 is visible in all three directions. */
export const IGBO_PARTIAL = fa([
  { concentration: 38, durationH: 2.5 },
  { concentration: 64, durationH: 1.25 },
  { concentration: 22, durationH: 3 },
]);
export const IGBO_FULL = fa([
  { concentration: 38, durationH: 2.5 },
  { concentration: 64, durationH: 1.25 },
  { concentration: 22, durationH: 3 },
  { concentration: 15, durationH: 1.25 },
]);
export const IGBO_LONG = fa([
  { concentration: 38, durationH: 3.5 },
  { concentration: 64, durationH: 1.75 },
  { concentration: 22, durationH: 3 },
  { concentration: 15, durationH: 1.75 },
]);
/** Short-term records: a full fifteen-minute window and a short one. */
export const STEL_FULL = fa([{ concentration: 240, durationMin: 5 }, { concentration: 110, durationMin: 10 }]);
export const STEL_SHORT = fa([{ concentration: 180, durationMin: 4 }, { concentration: 95, durationMin: 7 }]);

/** A teaching mixture with public OSHA limits typed as inputs. */
export const MIXTURE = fa([
  { name: 'toluene', concentration: 72.5, limit: 200 },
  { name: 'xylene', concentration: 31.2, limit: 100 },
  { name: 'acetone', concentration: 385, limit: 1000 },
]);

/** Heat: one indoor and one outdoor set of thermometer readings, a work and
 *  rest hour, and the metabolic rates of that hour. */
export const HEAT_INDOOR = f({ naturalWetBulbC: 26.4, globeC: 38.7 });
export const HEAT_OUTDOOR = f({ naturalWetBulbC: 27.1, globeC: 45.3, dryBulbC: 33.8 });
export const HEAT_WBGT_HOUR = fa([{ wbgtC: 30.8, durationMin: 40 }, { wbgtC: 25.6, durationMin: 20 }]);
export const HEAT_MET_HOUR = fa([{ metabolicRateW: 380, durationMin: 40 }, { metabolicRateW: 140, durationMin: 20 }]);
/** Metabolic rates for the RAL and REL sweep, W: either side of the figure range. */
export const MET_SWEEP = Object.freeze([100, 116, 150, 200, 233, 300, 348.9, 400, 465, 500, 580, 600]);

/** Shift lengths for the extended-shift action level and Brief and Scala. */
export const SHIFT_SWEEP = Object.freeze([4, 6, 8, 9, 10, 10.5, 12, 14, 16, 20, 24]);
export const WEEK_HOURS_SWEEP = Object.freeze([30, 40, 48, 50, 56, 60, 72, 84]);
/** The adjusted-limit teaching pairs, [shiftHours, weeklyHours]. */
export const BS_PAIRS = Object.freeze([[12, 48], [12, 60], [10, 70], [10, 40], [9, 54], [14, 42]]);
