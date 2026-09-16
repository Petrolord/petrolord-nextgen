// THE FC1 CAPSTONE CONDITIONS. EJULEBE and the ADANGA manifold yard.
//
// Nothing here is imported by fc1_dump.mjs, and no stream, pressure,
// rate, droplet size, coordinate or duty is shared with the teaching
// fields in fc1_fields.mjs. Only the migration headers and the go-live
// may read the values this produces.
//
// EVERY TIER STATES ITS OWN VENDOR K. The pressure derating of K and its
// 0.12 floor are HELD FOR LITERATURE, so nothing graded here may depend
// on them: each vessel is quoted a K by its vendor and the engine is
// called with kOverride. For the same reason no graded field reads a
// spacing TABLE figure or an API 521 radiation label: the Expert layout
// is handed the site's own setbacks and is graded on radiation
// shortfalls only.

/* ------------------------------------------------------------------ *
 * Associate. EJULEBE-1, a vertical two-phase inlet separator.
 * ------------------------------------------------------------------ */

export const EJULEBE_1 = {
  qGasMMscfd: 31,
  pPsig: 740,
  tF: 105,
  gasSg: 0.71,
  qOilBpd: 7350,
  qWaterBpd: 2480,
  oilApi: 29,
  waterSg: 1.06,
  retentionMin: 4,
  allowanceFt: 6.5,
  kOverride: 0.33,
  /** The diameter the vendor quoted the vessel at. */
  diameterFt: 6.4,
};

/* ------------------------------------------------------------------ *
 * Professional. EJULEBE-2, the horizontal production separator, the slug
 * catcher behind it, and the ODEAMA flow station's two radiation duties.
 * ------------------------------------------------------------------ */

export const EJULEBE_2 = {
  qGasMMscfd: 46,
  pPsig: 415,
  tF: 118,
  gasSg: 0.66,
  qOilBpd: 15500,
  qWaterBpd: 4300,
  oilApi: 31,
  waterSg: 1.03,
  retentionMin: 6,
  kOverride: 0.4,
  diameterFt: 9,
  liquidLevelFrac: 0.45,
};

export const EJULEBE_SLUG = {
  slugBbl: 620, qLiquidBpd: 19800, holdMin: 8, fillFraction: 0.65, ldRatio: 5,
};
export const EJULEBE_FINGERS = {
  slugBbl: 620, fingerIdIn: 26, nFingers: 7, fillFraction: 0.75,
};

export const ODEAMA_FLARE = {
  reliefRateKgS: 27, lhvKjKg: 47500, allowableKwM2: 6.31,
  fractionRadiated: 0.28, transmissivity: 0.95,
};
export const ODEAMA_POOL = {
  poolDiameterM: 24, burnRateKgM2S: 0.048, lhvKjKg: 41500,
  allowableKwM2: 4.73, fractionRadiated: 0.32, transmissivity: 1,
};

/* ------------------------------------------------------------------ *
 * Expert. EJULEBE-3, a three-phase separator with two droplet
 * specifications; EJULEBE-4, the vertical scrubber family; and the
 * ADANGA manifold yard.
 * ------------------------------------------------------------------ */

export const EJULEBE_3 = {
  qGasMMscfd: 21,
  pPsig: 290,
  tF: 124,
  gasSg: 0.73,
  qOilBpd: 9600,
  qWaterBpd: 7200,
  sgOil: 0.8762,
  sgWater: 1.07,
  muOilCp: 6.5,
  muWaterCp: 0.75,
  waterDropletMicron: 350,
  oilDropletMicron: 150,
  oilRetentionMin: 7,
  waterRetentionMin: 9,
  kOverride: 0.37,
  diameterFt: 11,
  liquidLevelFrac: 0.55,
};

/** EJULEBE-4, the vertical scrubber downstream of the compressor: its
 *  own stream, and the family the vendor offers. */
export const EJULEBE_4 = {
  qGasMMscfd: 70,
  pPsig: 620,
  tF: 96,
  gasSg: 0.69,
  qOilBpd: 1900,
  qWaterBpd: 350,
  oilApi: 30,
  waterSg: 1.05,
  retentionMin: 3,
  allowanceFt: 7,
  kOverride: 0.31,
  diametersFt: [3, 3.5, 4, 4.5, 5, 6],
  ldMin: 2,
  ldMax: 4,
};

/** The ADANGA manifold yard. Its two radiation setbacks are STATED to
 *  the learner (they are the site's own figures, and neither is a graded
 *  answer of any tier), so the Expert tier is judging a layout rather
 *  than recomputing a duty. */
export const ADANGA_DATUM = { lat: 4.9021, lon: 6.8714 };
const M_PER_DEG_LAT = 110574;
const M_PER_DEG_LON = 111320 * Math.cos((ADANGA_DATUM.lat * Math.PI) / 180);
const at = (northM, eastM) => ({
  lat: ADANGA_DATUM.lat + northM / M_PER_DEG_LAT,
  lon: ADANGA_DATUM.lon + eastM / M_PER_DEG_LON,
});

export const ADANGA_ITEMS = [
  { id: 'a-wh1', name: 'Wellhead A', type: 'wellhead', ...at(0, 0) },
  { id: 'a-wh2', name: 'Wellhead B', type: 'wellhead', ...at(4, 0) },
  { id: 'a-mf1', name: 'Manifold', type: 'manifold', ...at(26, 14) },
  { id: 'a-sp1', name: 'Test separator', type: 'separator', ...at(48, 30) },
  { id: 'a-vv1', name: 'Isolation valve', type: 'valve', ...at(50, 32) },
  { id: 'a-px1', name: 'Custody flow meter', type: 'flowmeter', ...at(70, 44) },
  { id: 'a-tk1', name: 'Slop tank', type: 'tank', ...at(84, 55) },
  { id: 'a-fl1', name: 'Yard flare', type: 'flare', ...at(215, 150) },
  { id: 'a-cr1', name: 'Yard control room', type: 'control', ...at(245, 185) },
  { id: 'a-tk2', name: 'Second slop tank', type: 'tank', lat: null, lon: null },
];

export const ADANGA_SOURCES = [
  { id: 'a-fl1', label: 'Yard flare radiation', setbackM: 100, allowableKwM2: 6.31 },
  { id: 'a-tk1', label: 'Slop tank pool fire', setbackM: 47, allowableKwM2: 4.73 },
  { id: 'a-ghost', label: 'Portable flare, not placed', setbackM: 35, allowableKwM2: 4.73 },
];
