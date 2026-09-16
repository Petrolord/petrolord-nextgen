// THE FC1 TEACHING FIELDS. ABANA, AGBAMI and the ERHA flow station.
//
// These are the streams and the site the LESSONS are written from. The
// capstone runs different conditions entirely: see fc1_fields_capstone.mjs,
// which nothing here imports and no lesson writer opens.
//
// Field units throughout: MMscfd, bpd, psig and psia, degF, ft, minutes,
// and metres for the layout.

/* ------------------------------------------------------------------ *
 * ABANA. Two vessels on one stream: a vertical test separator and the
 * horizontal production separator, plus the slug catcher at the end of
 * the flowline that pigs.
 * ------------------------------------------------------------------ */

/** ABANA-1, the vertical test separator: a small liquid duty. */
export const ABANA_1 = {
  qGasMMscfd: 18,
  pPsig: 600,
  tF: 95,
  gasSg: 0.68,
  qOilBpd: 2600,
  qWaterBpd: 400,
  oilApi: 33,
  waterSg: 1.04,
  retentionMin: 3,
  allowanceFt: 6,
  internalsId: 'verticalMesh',
};
export const ABANA_1_SWEEP = { diametersFt: [2, 2.5, 3, 3.5, 4], ldMin: 2, ldMax: 4 };

/** ABANA-2, the horizontal production separator: the whole station. */
export const ABANA_2 = {
  qGasMMscfd: 110,
  pPsig: 600,
  tF: 95,
  gasSg: 0.68,
  qOilBpd: 24000,
  qWaterBpd: 6000,
  oilApi: 33,
  waterSg: 1.04,
  retentionMin: 5,
  liquidLevelFrac: 0.5,
  internalsId: 'horizontalMesh',
  /** The diameter the station's vessel was built at. */
  diameterFt: 8,
};
export const ABANA_2_SWEEP = { diametersFt: [5, 6, 7, 8, 9, 10], ldMin: 3, ldMax: 5 };
/** The same family judged against a widened band, which is an input. */
export const ABANA_2_WIDE_BAND = { ldMin: 3, ldMax: 7 };
/** A level a wide-open dump valve leaves the vessel at. */
export const ABANA_2_LOW_LEVEL_FRAC = 0.3;

/** The slug ABANA's flowline delivers when it is pigged. */
export const ABANA_SLUG = {
  slugBbl: 350, qLiquidBpd: 12000, holdMin: 5, fillFraction: 0.6, ldRatio: 4,
};
export const ABANA_FINGERS = {
  slugBbl: 350, fingerIdIn: 20, nFingers: 5, fillFraction: 0.8,
};
/** The same slug in too few fingers, which is how the harp warning reads. */
export const ABANA_FINGERS_FEW = {
  slugBbl: 350, fingerIdIn: 12, nFingers: 2, fillFraction: 0.8,
};

/* ------------------------------------------------------------------ *
 * AGBAMI. A three-phase separator with a real water cut, heavy oil and
 * two droplet specifications.
 * ------------------------------------------------------------------ */

export const AGBAMI = {
  qGasMMscfd: 18,
  pPsig: 350,
  tF: 110,
  gasSg: 0.7,
  qOilBpd: 12000,
  qWaterBpd: 8000,
  oilApi: 27,
  waterSg: 1.05,
  sgOil: 0.8927,
  sgWater: 1.05,
  muOilCp: 4,
  muWaterCp: 0.8,
  waterDropletMicron: 500,
  oilDropletMicron: 200,
  oilRetentionMin: 5,
  waterRetentionMin: 8,
  internalsId: 'horizontalVane',
  diameterFt: 10,
  liquidLevelFrac: 0.5,
};
/** The interface an operator holds the vessel at when the level is set
 *  by hand rather than left to the retention split. */
export const AGBAMI_EXPLICIT_WATER_FRAC = 0.3;
/** The tighter water specification the oil buyer asks for. */
export const AGBAMI_TIGHT_WATER_DROPLET_MICRON = 150;
export const AGBAMI_SWEEP = { diametersFt: [6, 7, 8, 9, 10], ldMin: 3, ldMax: 5 };
/** A band narrowed by a plot constraint, which leaves feasible rows with
 *  none of them eligible. */
export const AGBAMI_NARROW_BAND = { ldMin: 4, ldMax: 5 };

/* ------------------------------------------------------------------ *
 * The ERHA flow station. Equipment on a site, a flare and a bunded tank,
 * in the Niger Delta. Positions are laid out in METRES from the station
 * datum and converted once, so the site plan is readable.
 * ------------------------------------------------------------------ */

export const ERHA_DATUM = { lat: 4.7412, lon: 7.1836 };
const M_PER_DEG_LAT = 110574;
const M_PER_DEG_LON = 111320 * Math.cos((ERHA_DATUM.lat * Math.PI) / 180);
/** North and east offsets in metres from the datum, as lat and lon. */
export const atM = (northM, eastM) => ({
  lat: ERHA_DATUM.lat + northM / M_PER_DEG_LAT,
  lon: ERHA_DATUM.lon + eastM / M_PER_DEG_LON,
});

export const ERHA_ITEMS = [
  { id: 'wh1', name: 'Wellhead 1', type: 'wellhead', ...atM(0, 0) },
  { id: 'wh2', name: 'Wellhead 2', type: 'wellhead', ...atM(5, 0) },
  { id: 'mf1', name: 'Production manifold', type: 'manifold', ...atM(30, 12) },
  { id: 'sp1', name: 'Inlet separator', type: 'separator', ...atM(55, 25) },
  { id: 'vv1', name: 'Separator dump valve', type: 'valve', ...atM(57, 27) },
  { id: 'ps1', name: 'Separator relief valve', type: 'psv', ...atM(59, 29) },
  { id: 'sk1', name: 'Chemical injection skid', type: 'skid', ...atM(35, 15) },
  { id: 'ht1', name: 'Heater treater', type: 'heaterTreater', ...atM(75, 40) },
  { id: 'tk1', name: 'Crude tank', type: 'tank', ...atM(115, 70) },
  { id: 'pm1', name: 'Transfer pump A', type: 'pump', ...atM(150, 95) },
  { id: 'pm2', name: 'Transfer pump B', type: 'pump', ...atM(151.2, 95) },
  { id: 'fl1', name: 'Flare stack', type: 'flare', ...atM(260, 180) },
  { id: 'cr1', name: 'Control room', type: 'control', ...atM(290, 215) },
];

/** The flare duty the station relieves, and the bund around the tank. */
export const ERHA_FLARE = {
  reliefRateKgS: 18, lhvKjKg: 46000, allowableKwM2: 4.73,
  fractionRadiated: 0.3, transmissivity: 1,
};
export const ERHA_POOL = {
  poolDiameterM: 18, burnRateKgM2S: 0.055, lhvKjKg: 43000,
  allowableKwM2: 4.73, fractionRadiated: 0.35, transmissivity: 1,
};

/** An item the mapper never placed, and a radiation source whose item is
 *  not on the plan, for the completeness reading. */
export const ERHA_UNPLACED = { id: 'tk2', name: 'Second crude tank', type: 'tank', lat: null, lon: null };
export const ERHA_GHOST_SOURCE = { id: 'fl2', label: 'Portable flare, not placed', setbackM: 40, allowableKwM2: 4.73 };
