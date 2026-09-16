// Teaching lab for FC1, Separation & Slug Catching. The three panels, the
// course page and the vitest files all read this one module, so a number shown
// to a learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every z factor, density,
// K value, settling velocity, vessel dimension, segment area, length
// requirement, slug catcher, interface height, droplet verdict, sweep row,
// distance, setback and layout reading below is a return value of
// engines/facilities/separatorSizing.js (the Separator & Slug Catcher
// Designer), engines/facilities/spacing.js (the Facility Layout Mapper's
// missing half) or engines/production/gasProperties.js (the Sutton
// pseudo-criticals and the Rankine conversion), as repaired in FC1-0.
//
// NOTHING IN THIS FILE COMPUTES A SEPARATION QUANTITY. Where a reader carries a
// value the teaching digest calls "derived", it is the digest's own arithmetic
// on numbers the engine returned, with the arithmetic stated, and the key name
// says Derived: an absolute pressure from a gauge pressure, a standard rate in
// ft3/s, the average of two densities shown to be the wrong answer, half a pool
// diameter, and the chord rule a retired version used. The lab and
// /root/fc-wip-separation/digest.txt agree because both call the engines on the
// same inputs, not because either copied the other.
//
// UNITS. Field units for the vessels: MMscfd, bpd, psig and psia, degF, ft, ft2,
// ft per s, lb per ft3, minutes and seconds. Metres, square metres and
// kilowatts for the site. Ratios and fractions are plain numbers.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// belongs anywhere in it.
//
// THE CLOCK. Nothing in this domain reads a clock or a random number. There is
// no date input, no seed and no default that falls back to today, so every
// reader is a pure function of its engine inputs. A clock gate in
// separationLab.test.js proves it under two faked system dates anyway, and a
// timezone gate rebuilds the whole digest a second time west of Greenwich.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

import separatorGolden from '@petrolord/engines/test-data/facilities/goldens/separator_cases.json';
import spacingGolden from '@petrolord/engines/test-data/facilities/goldens/spacing_cases.json';
// Namespaces, not named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which predate FC1-0
// and carry no engines/facilities at all. Vite and vitest alias
// @petrolord/engines to this worktree's packages/engines, which does.
// import/namespace still checks members against the shared copy, so it is off
// for this file only; separationLab.test.js proves every member resolves.
/* eslint-disable import/namespace */
import * as S from '@petrolord/engines/engines/facilities/separatorSizing.js';
import * as L from '@petrolord/engines/engines/facilities/spacing.js';
import * as GP from '@petrolord/engines/engines/production/gasProperties.js';

export const G = separatorGolden;
export const GL = spacingGolden;

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a separation quantity.
// ---------------------------------------------------------------------------

/**
 * A refusal exactly as the digest reports one: whether the call was accepted,
 * the engine's own class name, the input it named, and its own message. The
 * message is never retyped in this file; a gate in the test file proves that
 * no refusal message appears as a literal in this source.
 */
const attempt = (fn) => {
  try {
    const value = fn();
    return {
      ok: true, errorName: null, input: null, message: null, softError: value && value.error ? value.error : null,
    };
  } catch (err) {
    return {
      ok: false, errorName: err.name, input: err.input, message: err.message, softError: null,
    };
  }
};

/** A state the method has no answer for, returned rather than thrown. */
const softOf = (r) => (r && r.error ? r.error : null);

export const goldenCounts = () => ({
  separator: Object.values(separatorGolden).reduce((s, v) => s + v.length, 0),
  spacing: Object.values(spacingGolden).reduce((s, v) => s + v.length, 0),
});

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from /root/fc-wip-separation/fc1_fields.mjs.
// Two ABANA vessels on one stream, the AGBAMI three-phase separator, and the
// ERHA flow station. None of them is a golden case and none of them is graded
// anywhere.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// The probes the digest walks. Each one is an input the digest prints, kept
// here so the lab, the panels and the test file all read one list.
// ---------------------------------------------------------------------------

/** The liquid levels section 7 cuts the ABANA-2 drum at. */
export const LEVEL_FRACTIONS = [0.2, 0.3, 0.4, 0.5, 0.6, 0.75];
/** The two drums section 7 runs the area and its inverse on. */
export const INVERSE_PROBES = [
  { diameterFt: 8, frac: 0.35 },
  { diameterFt: 10, frac: 0.6 },
];
/** The mist extractors and pressures section 3 reads K at. */
export const K_AT_PRESSURE_PROBES = [
  ['verticalMesh', 0], ['verticalMesh', 100], ['verticalMesh', ABANA_1.pPsig],
  ['horizontalMesh', ABANA_2.pPsig], ['horizontalVane', AGBAMI.pPsig],
  ['verticalNone', 2000], ['horizontalNone', 1500], ['verticalNone', 3000],
];
/** The K a vendor quotes, which wins outright over the table. */
export const K_OVERRIDE_PROBE = 0.28;
/** The droplet sizes section 14 walks to show the square law. */
export const DROPLET_LADDER = [500, 350, 250, 150, 100];
/** The equipment pairs section 11 reads out of the spacing table. */
export const TABLE_PAIRS = [
  ['wellhead', 'wellhead'], ['wellhead', 'separator'], ['separator', 'tank'], ['tank', 'pump'],
  ['heaterTreater', 'tank'], ['flare', 'tank'], ['flare', 'control'], ['pump', 'pump'],
  ['valve', 'psv'], ['separator', 'valve'], ['tank', 'skid'],
];
/** The pairs of ERHA items section 11 measures. */
export const SITE_PAIRS = [
  ['wh1', 'wh2'], ['wh1', 'sp1'], ['sp1', 'tk1'], ['tk1', 'pm1'],
  ['pm1', 'pm2'], ['tk1', 'fl1'], ['fl1', 'cr1'],
];
/** The conditions section 17 reads the DAK range at. */
export const DAK_PROBES = [
  ['a cold gas below the range', { pPsia: 1000, tF: -150, gasSg: 0.65 }],
  ['a hot gas above the range', { pPsia: 500, tF: 700, gasSg: 0.65 }],
  ['a pressure above the range', { pPsia: 25000, tF: 150, gasSg: 0.65 }],
  ['a low-pressure separator below the fit data', { pPsia: 100, tF: 100, gasSg: 0.65 }],
];

/**
 * Every refusal section 1 prints. Each entry is the label the digest uses and
 * the engine call that earns the refusal. The MESSAGE is never written here:
 * it comes back from the engine, and the test file asserts that no refusal
 * message appears as a literal anywhere in this source.
 */
export const REFUSAL_PROBES = [
  { label: 'kValue with no mist extractor and no override', call: () => S.kValue({ pPsig: 100 }) },
  { label: 'kValue with a mist extractor that is not in the table', call: () => S.kValue({ internalsId: 'verticalFoam', pPsig: 100 }) },
  { label: 'kValue with no pressure', call: () => S.kValue({ internalsId: 'verticalMesh' }) },
  { label: 'kValue at a negative gauge pressure', call: () => S.kValue({ internalsId: 'verticalMesh', pPsig: -20 }) },
  { label: 'kValue with an override of zero', call: () => S.kValue({ kOverride: 0 }) },
  { label: 'gas density with no pressure', call: () => S.gasDensityLbFt3({ tF: 100, gasSg: 0.65 }) },
  { label: 'gas density with a temperature that is not a number', call: () => S.gasDensityLbFt3({ pPsia: 500, tF: 'warm', gasSg: 0.65 }) },
  { label: 'gas density with no gas gravity', call: () => S.gasDensityLbFt3({ pPsia: 500, tF: 100 }) },
  { label: 'a liquid level of zero', call: () => S.horizontalSegments({ diameterFt: 8, liquidLevelFrac: 0 }) },
  { label: 'a liquid level of one', call: () => S.horizontalSegments({ diameterFt: 8, liquidLevelFrac: 1 }) },
  { label: 'a sweep over an empty diameter list', call: () => S.ldSweep({ mode: 'vertical2', diametersFt: [] }) },
  { label: 'a sweep whose band runs backwards', call: () => S.ldSweep({ mode: 'vertical2', diametersFt: [4], ldMin: 5, ldMax: 3 }) },
  { label: 'a slug catcher with a length-to-diameter ratio of zero', call: () => S.vesselSlugCatcher({ slugBbl: 200, ldRatio: 0 }) },
  { label: 'a slug catcher with a negative hold time', call: () => S.vesselSlugCatcher({ slugBbl: 200, holdMin: -5 }) },
  { label: 'a slug catcher with a negative normal liquid rate', call: () => S.vesselSlugCatcher({ slugBbl: 200, qLiquidBpd: -100 }) },
  { label: 'a harp with two and a half fingers', call: () => S.fingerSlugCatcher({ slugBbl: 200, fingerIdIn: 20, nFingers: 2.5 }) },
  { label: 'three-phase sizing with the retired droplet argument', call: () => S.horizontalThreePhase({ diameterFt: 10, dropletMicron: 500 }) },
];

/** Every state section 1 shows the method has no answer for. */
export const SOFT_STATE_PROBES = [
  { label: 'an unknown sizing mode', call: () => S.ldSweep({ mode: 'cylindrical', diametersFt: [4] }) },
  { label: 'a settling velocity of zero in a vertical vessel', call: () => S.verticalTwoPhase({ qGasActFt3S: 10, vTerminalFtS: 0, qLiquidBpd: 1000, retentionMin: 3 }) },
  { label: 'a gas denser than the liquid', call: () => S.terminalVelocityFtS({ k: 0.35, rhoLLbFt3: 2, rhoGLbFt3: 5 }) },
  { label: 'a segment area larger than the circle', call: () => S.segmentHeightForAreaFt({ diameterFt: 8, areaFt2: 100 }) },
  { label: 'a slug catcher with no slug', call: () => S.vesselSlugCatcher({ slugBbl: 0 }) },
  { label: 'a slug catcher filled to the brim', call: () => S.vesselSlugCatcher({ slugBbl: 200, fillFraction: 1 }) },
  { label: 'a droplet with no viscosity to fall through', call: () => S.liquidLiquidSettlingFtS({ dropletMicron: 500, sgHeavy: 1.05, sgLight: 0.85, muCp: 0 }) },
  { label: 'a light phase denser than the heavy phase', call: () => S.liquidLiquidSettlingFtS({ dropletMicron: 500, sgHeavy: 0.85, sgLight: 1.05, muCp: 2 }) },
  { label: 'a layout check over something that is not a list', call: () => L.checkLayout({ items: null }) },
  { label: 'a distance with one coordinate pair', call: () => L.haversineM({ lat1: 4.5, lon1: 7.1 }) },
  { label: 'a flare setback with no relief rate', call: () => L.flareSetbackM({ lhvKjKg: 46000 }) },
  { label: 'a pool fire with no pool', call: () => L.poolFireSetbackM({ poolDiameterM: 0 }) },
];

/** What three-phase sizing demands, refused by name and with no default. */
export const THREE_PHASE_REFUSAL_PROBES = [
  ['no oil rate', { diameterFt: 10, qWaterBpd: 4000 }],
  ['no water rate', { diameterFt: 10, qOilBpd: 6000 }],
  ['no oil retention time', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000 }],
  ['no oil gravity', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5 }],
  ['water lighter than the oil', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5, sgOil: 1.1, sgWater: 1.0 }],
  ['no oil viscosity', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5, sgOil: 0.85, sgWater: 1.05 }],
  ['no water droplet size', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5, sgOil: 0.85, sgWater: 1.05, muOilCp: 2, muWaterCp: 0.7 }],
  ['no oil droplet size', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5, sgOil: 0.85, sgWater: 1.05, muOilCp: 2, muWaterCp: 0.7, waterDropletMicron: 500 }],
  ['a pinned water share of zero', { ...AGBAMI, diameterFt: 10, qGasActFt3S: 20, vTerminalFtS: 1, waterFracOfLiquid: 0 }],
];

/**
 * THE FOUR HELD QUANTITIES. Each is taught as a limit of the method and is
 * never an answer: no graded capstone field reads one, and every panel that
 * shows one shows this wording beside it. A gate in separationLab.test.js
 * greps the three panel sources for the marker and checks the capstone against
 * each held quantity.
 */
export const HELD_MARKER = 'HELD FOR LITERATURE';
export const HELD_ITEMS = [
  {
    id: 'k-derating',
    title: 'The K pressure derating and its floor',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: the derating of 0.01 per 100 psi above 100 psig, and the 0.12 floor, are the customary rule of thumb as this module records it. The published form has not been checked against the source, so a vendor K is the only honest input where the derating bites.',
  },
  {
    id: 'horizontal-settling-velocity',
    title: 'The settling velocity a horizontal vessel borrows',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: a horizontal vessel uses the Souders-Brown velocity at the horizontal K as the droplet settling velocity in the gas length requirement. That packaging has not been checked against API 12J or Arnold and Stewart.',
  },
  {
    id: 'radiation-labels',
    title: 'The API 521 radiation labels',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: the API 521 radiation labels are recorded here with no source checked. A course may teach what a recorded label is; it may not treat one as a calculation.',
  },
  {
    id: 'spacing-table',
    title: 'The spacing table figures',
    note: 'HELD FOR LITERATURE, taught as a limit and never as an answer: the spacing table figures are the customary onshore production-facility values as this engine records them, with no source checked, and they are meant to be replaced by a site standard. A course may teach what a table is; it may not treat a table figure as a calculation.',
  },
];

// ---------------------------------------------------------------------------
// The chain the Separator & Slug Catcher Designer runs on a stream:
// conditions, then z and the two densities, then K, then settling, then the
// actual gas rate the vessel sees. Copied from the digest generator.
// ---------------------------------------------------------------------------

const conditions = (p) => {
  const pPsia = p.pPsig + 14.7;
  const gas = S.gasDensityLbFt3({ pPsia, tF: p.tF, gasSg: p.gasSg });
  const rhoOil = p.oilApi !== undefined ? S.oilDensityLbFt3(p.oilApi) : p.sgOil * 62.4;
  const rhoWater = (p.waterSg ?? p.sgWater) * 62.4;
  const qLiquid = p.qOilBpd + p.qWaterBpd;
  const rhoLiquid = (rhoOil * p.qOilBpd + rhoWater * p.qWaterBpd) / qLiquid;
  const k = S.kValue({ internalsId: p.internalsId, pPsig: p.pPsig });
  const vt = S.terminalVelocityFtS({ k: k.k, rhoLLbFt3: rhoLiquid, rhoGLbFt3: gas.rhoLbFt3 });
  return {
    pPsia, gas, z: gas.z, ppr: gas.ppr, tpr: gas.tpr,
    rhoGas: gas.rhoLbFt3, rhoOil, rhoWater, rhoLiquid, qLiquid,
    kResult: k, k: k.k, vT: vt.vFtS,
    qGasActFt3S: S.gasActualFt3S({ qGasMMscfd: p.qGasMMscfd, pPsia, tF: p.tF, z: gas.z }),
  };
};

const A1 = () => conditions(ABANA_1);
const A2 = () => conditions(ABANA_2);
const AG = () => conditions(AGBAMI);

const verticalAt = (c, diameterOverride) => S.verticalTwoPhase({
  qGasActFt3S: c.qGasActFt3S, vTerminalFtS: c.vT, qLiquidBpd: c.qLiquid,
  retentionMin: ABANA_1.retentionMin, allowanceFt: ABANA_1.allowanceFt, diameterOverride,
});

const horizontalAt = (c, diameterFt, liquidLevelFrac) => S.horizontalTwoPhase({
  diameterFt, qGasActFt3S: c.qGasActFt3S, vTerminalFtS: c.vT,
  qLiquidBpd: c.qLiquid, retentionMin: ABANA_2.retentionMin, liquidLevelFrac,
});

const threePhaseAt = (c, extra = {}) => S.horizontalThreePhase({
  diameterFt: AGBAMI.diameterFt, qGasActFt3S: c.qGasActFt3S, vTerminalFtS: c.vT,
  liquidLevelFrac: AGBAMI.liquidLevelFrac, ...AGBAMI, ...extra,
});

/** The ERHA layout as section 12 and section 16 read it: the plan plus the
 *  unplaced tank, checked against the table and the station's own two
 *  computed setbacks plus one source whose item is not on the plan.
 *
 *  `poolSetbackM` picks which pool figure the tank's radiation source carries.
 *  The engine's own answer is the radius from the pool CENTRE, because the
 *  check measures centre to centre. The retired Suite layer handed it the
 *  setback from the pool EDGE, and running the same plot both ways is what
 *  section 12 prices the defect with. */
const erhaLayoutWith = (poolSetbackM) => {
  const flare = L.flareSetbackM(ERHA_FLARE);
  return L.checkLayout({
    items: [...ERHA_ITEMS, ERHA_UNPLACED],
    radiationSources: [
      { id: 'fl1', label: 'Flare radiation', setbackM: flare.distanceM, allowableKwM2: ERHA_FLARE.allowableKwM2 },
      { id: 'tk1', label: 'Tank pool fire', setbackM: poolSetbackM, allowableKwM2: ERHA_POOL.allowableKwM2 },
      ERHA_GHOST_SOURCE,
    ],
  });
};

const erhaLayout = () => erhaLayoutWith(L.poolFireSetbackM(ERHA_POOL).radiusFromCentreM);

// ---------------------------------------------------------------------------
// SECTION 1. What the sizing engine does, and what it refuses.
// ---------------------------------------------------------------------------

export const engineScope = () => ({
  refusals: REFUSAL_PROBES.map(({ label, call }) => ({ label, ...attempt(call) })),
  softStates: SOFT_STATE_PROBES.map(({ label, call }) => ({ label, error: softOf(call()) })),
});

// ---------------------------------------------------------------------------
// SECTION 2. The gas at separator conditions.
// ---------------------------------------------------------------------------

export const gasAtConditions = () => {
  const streams = [
    ['ABANA-1 test separator', 'ABANA-1', ABANA_1, A1()],
    ['ABANA-2 production separator', 'ABANA-2', ABANA_2, A2()],
    ['AGBAMI three-phase', 'AGBAMI', AGBAMI, AG()],
  ].map(([longLabel, label, p, c]) => {
    const pc = GP.suttonPseudoCriticals(p.gasSg);
    return {
      longLabel,
      label,
      qGasMMscfd: p.qGasMMscfd,
      pPsig: p.pPsig,
      pPsiaDerived: c.pPsia,
      tF: p.tF,
      gasSg: p.gasSg,
      tpcR: pc.tpcR,
      ppcPsia: pc.ppcPsia,
      ppr: c.ppr,
      tpr: c.tpr,
      z: c.z,
      rhoGas: c.rhoGas,
      qGasActFt3S: c.qGasActFt3S,
      rankineR: GP.toRankine(p.tF),
      standardFt3SDerived: (p.qGasMMscfd * 1e6) / 86400,
      shrinkageDerived: ((p.qGasMMscfd * 1e6) / 86400) / c.qGasActFt3S,
    };
  });
  const a2 = A2();
  return {
    streams,
    abana1GasMMscfd: ABANA_1.qGasMMscfd,
    abana2GasMMscfd: ABANA_2.qGasMMscfd,
    rankineAtAbana: GP.toRankine(ABANA_1.tF),
    abana2StandardFt3SDerived: (ABANA_2.qGasMMscfd * 1e6) / 86400,
    abana2ActualFt3S: a2.qGasActFt3S,
    abana2PPsia: a2.pPsia,
    abana2TF: ABANA_2.tF,
    published: G.gasDensity.map((c) => {
      const r = S.gasDensityLbFt3(c.input);
      return {
        name: c.name,
        input: c.input,
        error: r.error || null,
        ppr: r.ppr,
        tpr: r.tpr,
        z: r.z,
        rhoLbFt3: r.rhoLbFt3,
        note: r.note || null,
        goldenStatus: c.expected.status,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. The K value.
// ---------------------------------------------------------------------------

export const kValueTable = () => ({
  base: S.K_BASE.map((k) => ({ ...k })),
  floor: S.K_FLOOR,
  atPressure: K_AT_PRESSURE_PROBES.map(([id, pPsig]) => {
    const k = S.kValue({ internalsId: id, pPsig });
    return {
      internalsId: id, pPsig, kBase: k.kBase, kDerated: k.kDerated, k: k.k, derated: k.derated, floored: k.floored,
      nearFloor: k.nearFloor,
    };
  }),
  flooredWarning: S.kValue({ internalsId: 'verticalNone', pPsig: 3000 }).warning,
  override: S.kValue({ kOverride: K_OVERRIDE_PROBE }),
  // How close a derated K sits to the floor, and the flag that says so. The
  // case is a published one, so the name is the golden's own.
  nearFloor: (() => {
    const c = G.kValue.find((x) => x.input.internalsId === 'verticalNone' && x.input.pPsig === 650);
    const near = S.kValue(c.input);
    return {
      name: c.name,
      k: near.k,
      derated: near.derated,
      floored: near.floored,
      nearFloor: near.nearFloor,
      floor: S.K_FLOOR,
      gapAboveFloorDerived: near.k - S.K_FLOOR,
    };
  })(),
  published: G.kValue.map((c) => {
    const k = S.kValue(c.input);
    return {
      name: c.name, k: k.k, kDerated: k.kDerated, derated: k.derated, floored: k.floored, nearFloor: k.nearFloor,
    };
  }),
  held: HELD_ITEMS[0],
});

// ---------------------------------------------------------------------------
// SECTION 4. Settling.
// ---------------------------------------------------------------------------

export const settling = () => {
  const ag = AG();
  return {
    densities: [
      ['ABANA-1', ABANA_1, A1()], ['ABANA-2', ABANA_2, A2()], ['AGBAMI', AGBAMI, ag],
    ].map(([label, p, c]) => ({
      label,
      oilApi: p.oilApi,
      rhoOil: c.rhoOil,
      waterSg: p.waterSg,
      rhoWater: c.rhoWater,
      qOilBpd: p.qOilBpd,
      qWaterBpd: p.qWaterBpd,
      rhoLiquid: c.rhoLiquid,
    })),
    agbamiAverageDerived: (ag.rhoOil + ag.rhoWater) / 2,
    agbamiWeighted: ag.rhoLiquid,
    soudersBrown: [
      ['ABANA-1 vertical mesh', A1()], ['ABANA-2 horizontal mesh', A2()], ['AGBAMI horizontal vane', ag],
    ].map(([label, c]) => ({
      label, k: c.k, rhoLiquid: c.rhoLiquid, rhoGas: c.rhoGas, vT: c.vT,
    })),
    published: G.soudersBrown.map((c) => ({
      name: c.name, input: c.input, vFtS: S.terminalVelocityFtS(c.input).vFtS,
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 5. The vertical vessel.
// ---------------------------------------------------------------------------

export const verticalVessel = () => {
  const c = A1();
  const gasSized = verticalAt(c, undefined);
  return {
    gasAreaDerived: c.qGasActFt3S / c.vT,
    diameterGasFt: gasSized.diameterGasFt,
    hLiquidFt: gasSized.hLiquidFt,
    heightFt: gasSized.heightFt,
    allowanceFt: ABANA_1.allowanceFt,
    ldRatio: gasSized.ldRatio,
    velocityMargin: gasSized.velocityMargin,
    liquidVolFt3: gasSized.liquidVolFt3,
    qLiquidBpd: c.qLiquid,
    retentionMin: ABANA_1.retentionMin,
    rows: ABANA_1_SWEEP.diametersFt.map((d) => {
      const v = verticalAt(c, d);
      return {
        diameterFt: d,
        hLiquidFt: v.hLiquidFt,
        heightFt: v.heightFt,
        ldRatio: v.ldRatio,
        gasVelocityFtS: v.gasVelocityFtS,
        velocityMargin: v.velocityMargin,
        gasCapacityOk: v.gasCapacityOk,
      };
    }),
    published: G.vertical.map((x) => {
      const v = S.verticalTwoPhase(x.input);
      return {
        name: x.name,
        input: x.input,
        diameterFt: v.diameterFt,
        hLiquidFt: v.hLiquidFt,
        heightFt: v.heightFt,
        ldRatio: v.ldRatio,
        velocityMargin: v.velocityMargin,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 6. The Associate reading, one chain end to end.
// ---------------------------------------------------------------------------

export const associateChain = () => {
  const c = A1();
  const gasSized = verticalAt(c, undefined);
  return {
    pPsig: ABANA_1.pPsig,
    pPsiaDerived: c.pPsia,
    gasSg: ABANA_1.gasSg,
    ppr: c.ppr,
    tpr: c.tpr,
    z: c.z,
    rhoGas: c.rhoGas,
    qGasActFt3S: c.qGasActFt3S,
    rhoLiquid: c.rhoLiquid,
    k: c.k,
    kBase: c.kResult.kBase,
    vT: c.vT,
    diameterGasFt: gasSized.diameterGasFt,
    preferredDiameterFt: 3,
    heightAtPreferredFt: verticalAt(c, 3).heightFt,
  };
};

// ---------------------------------------------------------------------------
// SECTION 7. The horizontal vessel, a circle cut by a level.
// ---------------------------------------------------------------------------

export const crossSection = () => ({
  diameterFt: ABANA_2.diameterFt,
  rows: LEVEL_FRACTIONS.map((lf) => {
    const s = S.horizontalSegments({ diameterFt: ABANA_2.diameterFt, liquidLevelFrac: lf });
    return {
      liquidLevelFrac: lf,
      liquidLevelFt: s.liquidLevelFt,
      areaLiquidFt2: s.areaLiquidFt2,
      areaGasFt2: s.areaGasFt2,
      gasHeightFt: s.gasHeightFt,
      gasLiquidChordFt: s.gasLiquidChordFt,
      areaTotalFt2: s.areaTotalFt2,
    };
  }),
  halfFullAreaFt2: S.horizontalSegments({ diameterFt: ABANA_2.diameterFt, liquidLevelFrac: 0.5 }).areaLiquidFt2,
  published: G.segments.map((c) => ({
    name: c.name, areaLiquidFt2: S.horizontalSegments(c.input).areaLiquidFt2,
  })),
  inverses: INVERSE_PROBES.map(({ diameterFt, frac }) => {
    const seg = S.horizontalSegments({ diameterFt, liquidLevelFrac: frac });
    const back = S.segmentHeightForAreaFt({ diameterFt, areaFt2: seg.areaLiquidFt2 });
    return {
      diameterFt,
      frac,
      liquidLevelFt: seg.liquidLevelFt,
      areaLiquidFt2: seg.areaLiquidFt2,
      backHeightFt: back.heightFt,
    };
  }),
});

// ---------------------------------------------------------------------------
// SECTION 8. Two lengths, one vessel.
// ---------------------------------------------------------------------------

export const twoLengths = () => {
  const c = A2();
  const built = horizontalAt(c, ABANA_2.diameterFt, ABANA_2.liquidLevelFrac);
  const low = horizontalAt(c, ABANA_2.diameterFt, ABANA_2_LOW_LEVEL_FRAC);
  return {
    diameterFt: ABANA_2.diameterFt,
    liquidLevelFrac: ABANA_2.liquidLevelFrac,
    lowLevelFrac: ABANA_2_LOW_LEVEL_FRAC,
    built: {
      lengthLiquidFt: built.lengthLiquidFt,
      lengthGasFt: built.lengthGasFt,
      lengthFt: built.lengthFt,
      controlling: built.controlling,
      ldRatio: built.ldRatio,
      liquidVolFt3: built.liquidVolFt3,
      areaLiquidFt2: built.areaLiquidFt2,
    },
    low: {
      lengthLiquidFt: low.lengthLiquidFt,
      areaLiquidFt2: low.areaLiquidFt2,
      areaGasFt2: low.areaGasFt2,
      gasVelocityFtS: low.gasVelocityFtS,
      gasHeightFt: low.gasHeightFt,
      gasLiquidChordFt: low.gasLiquidChordFt,
      gasVelocityMargin: low.gasVelocityMargin,
      lengthGasFt: low.lengthGasFt,
      gasCapacityOk: low.gasCapacityOk,
      controlling: low.controlling,
      lengthFt: low.lengthFt,
      ldRatio: low.ldRatio,
    },
    // The cross-section per bore at the level ABANA-2 runs, which is where the
    // gas height and the chord come from.
    bores: ABANA_2_SWEEP.diametersFt.map((d) => {
      const s = S.horizontalSegments({ diameterFt: d, liquidLevelFrac: ABANA_2.liquidLevelFrac });
      return {
        diameterFt: d,
        liquidLevelFt: s.liquidLevelFt,
        gasHeightFt: s.gasHeightFt,
        gasLiquidChordFt: s.gasLiquidChordFt,
        areaGasFt2: s.areaGasFt2,
        areaLiquidFt2: s.areaLiquidFt2,
      };
    }),
    rows: ABANA_2_SWEEP.diametersFt.map((d) => {
      const h = horizontalAt(c, d, ABANA_2.liquidLevelFrac);
      return {
        diameterFt: d,
        areaLiquidFt2: h.areaLiquidFt2,
        areaGasFt2: h.areaGasFt2,
        lengthLiquidFt: h.lengthLiquidFt,
        lengthGasFt: h.lengthGasFt,
        lengthFt: h.lengthFt,
        controlling: h.controlling,
        ldRatio: h.ldRatio,
      };
    }),
    published: G.horizontal.map((x) => {
      const h = S.horizontalTwoPhase(x.input);
      return {
        name: x.name,
        input: x.input,
        lengthLiquidFt: h.lengthLiquidFt,
        lengthGasFt: h.lengthGasFt,
        lengthFt: h.lengthFt,
        controlling: h.controlling,
        ldRatio: h.ldRatio,
        gasVelocityFtS: h.gasVelocityFtS,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 9. Gas capacity.
// ---------------------------------------------------------------------------

export const gasCapacity = () => {
  const c = A2();
  const built = horizontalAt(c, ABANA_2.diameterFt, ABANA_2.liquidLevelFrac);
  const overloadedCase = G.threePhase.find((x) => x.name === 'gasOverloaded6ftGasControls');
  const overloaded = S.horizontalThreePhase(overloadedCase.input);
  return {
    diameterFt: ABANA_2.diameterFt,
    gasVelocityFtS: built.gasVelocityFtS,
    vT: c.vT,
    gasVelocityMargin: built.gasVelocityMargin,
    gasCapacityOk: built.gasCapacityOk,
    rows: ABANA_2_SWEEP.diametersFt.map((d) => {
      const h = horizontalAt(c, d, ABANA_2.liquidLevelFrac);
      return {
        diameterFt: d,
        areaGasFt2: h.areaGasFt2,
        gasVelocityFtS: h.gasVelocityFtS,
        gasVelocityMargin: h.gasVelocityMargin,
        gasCapacityOk: h.gasCapacityOk,
      };
    }),
    overloaded: {
      name: overloadedCase.name,
      gasVelocityFtS: overloaded.gasVelocityFtS,
      vTerminalFtS: overloadedCase.input.vTerminalFtS,
      gasVelocityMargin: overloaded.gasVelocityMargin,
      gasCapacityOk: overloaded.gasCapacityOk,
      lengthGasFt: overloaded.lengthGasFt,
      gasHeightFt: overloaded.gasHeightFt,
      controlling: overloaded.controlling,
    },
    held: HELD_ITEMS[1],
  };
};

// ---------------------------------------------------------------------------
// SECTION 10. Slug catchers.
// ---------------------------------------------------------------------------

export const slugCatchers = () => {
  const vessel = S.vesselSlugCatcher(ABANA_SLUG);
  const fingers = S.fingerSlugCatcher(ABANA_FINGERS);
  const few = S.fingerSlugCatcher(ABANA_FINGERS_FEW);
  return {
    slug: ABANA_SLUG,
    vessel,
    fingersInput: ABANA_FINGERS,
    fingers,
    fewInput: ABANA_FINGERS_FEW,
    few,
    publishedVessel: G.vesselSlug.map((c) => {
      const v = S.vesselSlugCatcher(c.input);
      return {
        name: c.name,
        input: c.input,
        normalBbl: v.normalBbl,
        totalVolumeFt3: v.totalVolumeFt3,
        diameterFt: v.diameterFt,
        lengthFt: v.lengthFt,
      };
    }),
    publishedFinger: G.fingerSlug.map((c) => {
      const v = S.fingerSlugCatcher(c.input);
      return {
        name: c.name,
        input: c.input,
        totalVolumeFt3: v.totalVolumeFt3,
        fingerLengthFt: v.fingerLengthFt,
        totalPipeFt: v.totalPipeFt,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. Distances and computed setbacks on a site.
// ---------------------------------------------------------------------------

export const distancesAndSetbacks = () => {
  const flare = L.flareSetbackM(ERHA_FLARE);
  const pool = L.poolFireSetbackM(ERHA_POOL);
  return {
    datum: ERHA_DATUM,
    table: TABLE_PAIRS.map(([a, b]) => ({ typeA: a, typeB: b, requiredM: L.requiredSpacingM({ typeA: a, typeB: b }) })),
    distances: SITE_PAIRS.map(([a, b]) => {
      const A = ERHA_ITEMS.find((i) => i.id === a);
      const B = ERHA_ITEMS.find((i) => i.id === b);
      return { fromName: A.name, toName: B.name, distanceM: L.haversineM({ lat1: A.lat, lon1: A.lon, lat2: B.lat, lon2: B.lon }).distanceM };
    }),
    // The sphere the engine measures on, read out of the engine rather than
    // typed: R_EARTH_M is not exported, so a quarter turn along the equator is
    // measured and the radius derived from it.
    quarterTurnM: L.haversineM({
      lat1: 0, lon1: 0, lat2: 0, lon2: 90,
    }).distanceM,
    earthRadiusDerivedM: (2 * L.haversineM({
      lat1: 0, lon1: 0, lat2: 0, lon2: 90,
    }).distanceM) / Math.PI,
    publishedDistances: GL.distances.map((c) => ({
      name: c.name,
      haversineM: L.haversineM(c.input).distanceM,
      vincentyM: c.expected.vincentyM,
      chordM: c.expected.chordM,
    })),
    flareInput: ERHA_FLARE,
    flare,
    radiationLevels: L.RADIATION_LEVELS.map((r) => ({ ...r })),
    publishedFlare: GL.flare.map((c) => {
      const r = L.flareSetbackM(c.input);
      return {
        name: c.name, input: c.input, qKw: r.qKw, distanceM: r.distanceM, intensityAtDistance: c.expected.intensityAtDistance,
      };
    }),
    poolInput: ERHA_POOL,
    pool,
    halfPoolDiameterDerivedM: ERHA_POOL.poolDiameterM / 2,
    publishedPool: GL.poolFire.map((c) => {
      const r = L.poolFireSetbackM(c.input);
      return {
        name: c.name,
        input: c.input,
        qKw: r.qKw,
        flameHeightM: r.flameHeightM,
        radiusFromCentreM: r.radiusFromCentreM,
        setbackFromEdgeM: r.setbackFromEdgeM,
        setbackStatus: r.setbackStatus,
        note: r.note,
      };
    }),
    heldTable: HELD_ITEMS[3],
    heldLabels: HELD_ITEMS[2],
  };
};

// ---------------------------------------------------------------------------
// SECTION 12. The Professional reading, a station judged.
// ---------------------------------------------------------------------------

export const stationJudged = () => {
  const layout = erhaLayout();
  const nn = L.nearestNeighbours({ items: ERHA_ITEMS });
  // The same plot judged the retired way, with the tank's requirement handed
  // in as the setback from the pool EDGE rather than the radius from its
  // centre. Both readings are engine calls; only the input moved.
  const pool = L.poolFireSetbackM(ERHA_POOL);
  const edge = erhaLayoutWith(pool.setbackFromEdgeM);
  const tankRow = (v) => {
    const old = edge.violations.find((x) => x.kind === 'radiation' && x.aId === 'tk1' && x.bId === v.bId);
    return {
      bName: v.bName,
      bId: v.bId,
      actualM: v.actualM,
      requiredM: v.requiredM,
      shortfallM: v.shortfallM,
      retiredRequiredM: pool.setbackFromEdgeM,
      retiredShortfallM: old ? old.shortfallM : null,
    };
  };
  const heaterNow = layout.violations.find((v) => v.kind === 'radiation' && v.bId === 'ht1');
  const heaterRetired = edge.violations.find((v) => v.kind === 'radiation' && v.bId === 'ht1');
  return {
    retiredEdge: {
      edgeSetbackM: pool.setbackFromEdgeM,
      radiusFromCentreM: pool.radiusFromCentreM,
      halfBundDerivedM: pool.radiusFromCentreM - pool.setbackFromEdgeM,
      rows: layout.violations.filter((v) => v.kind === 'radiation' && v.aId === 'tk1').map(tankRow),
      heaterTreaterShortfallM: heaterNow ? heaterNow.shortfallM : null,
      heaterTreaterRetiredShortfallM: heaterRetired ? heaterRetired.shortfallM : null,
      retiredViolationCount: edge.violations.length,
    },
    checked: layout.checked,
    zeroRequirementPairs: layout.zeroRequirementPairs,
    violationCount: layout.violations.length,
    complete: layout.complete,
    pass: layout.pass,
    passStatus: layout.passStatus,
    violations: layout.violations.map((v) => ({ ...v })),
    worstAbsolute: { ...layout.worstAbsolute },
    worstRelative: { ...layout.worstRelative },
    skipped: layout.skipped.map((s) => ({ ...s })),
    unknownPairCount: layout.unknownPairs.length,
    neighbours: nn.rows.map((r) => ({
      name: r.name,
      nearestName: r.nearest.name,
      distanceM: r.nearest.distanceM,
      requiredM: r.requiredM,
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. Three phases in one vessel.
// ---------------------------------------------------------------------------

export const threePhaseSplit = () => {
  const c = AG();
  const proportional = threePhaseAt(c);
  const pinned = threePhaseAt(c, { waterFracOfLiquid: AGBAMI_EXPLICIT_WATER_FRAC });
  return {
    diameterFt: AGBAMI.diameterFt,
    liquidLevelFrac: AGBAMI.liquidLevelFrac,
    qOilBpd: AGBAMI.qOilBpd,
    oilRetentionMin: AGBAMI.oilRetentionMin,
    qWaterBpd: AGBAMI.qWaterBpd,
    waterRetentionMin: AGBAMI.waterRetentionMin,
    proportional: {
      interfaceSplit: proportional.interfaceSplit,
      waterShare: proportional.waterShare,
      areaWaterFt2: proportional.areaWaterFt2,
      areaOilFt2: proportional.areaOilFt2,
      areaLiquidFt2: proportional.areaLiquidFt2,
      interfaceHeightFt: proportional.interfaceHeightFt,
      waterLayerFt: proportional.waterLayerFt,
      oilLayerFt: proportional.oilLayerFt,
      liquidLevelFt: proportional.liquidLevelFt,
      gasLiquidChordFt: proportional.gasLiquidChordFt,
      liquidRetentionLengthFt: proportional.liquidRetentionLengthFt,
      phaseRetentionLengthsFt: proportional.phaseRetentionLengthsFt,
      retentionPhase: proportional.retentionPhase,
      lengthFt: proportional.lengthFt,
      controlling: proportional.controlling,
    },
    retiredChordLayerDerivedFt: proportional.areaWaterFt2 / proportional.gasLiquidChordFt,
    explicitWaterFrac: AGBAMI_EXPLICIT_WATER_FRAC,
    pinned: {
      interfaceSplit: pinned.interfaceSplit,
      interfaceHeightFt: pinned.interfaceHeightFt,
      oilLayerFt: pinned.oilLayerFt,
      phaseRetentionLengthsFt: pinned.phaseRetentionLengthsFt,
      liquidRetentionLengthFt: pinned.liquidRetentionLengthFt,
      retentionPhase: pinned.retentionPhase,
    },
    retentionTieRel: S.RETENTION_TIE_REL,
    published: G.threePhase.map((x) => {
      const r = S.horizontalThreePhase(x.input);
      return {
        name: x.name,
        diameterFt: x.input.diameterFt,
        liquidLevelFrac: x.input.liquidLevelFrac ?? 0.5,
        pinnedWaterFrac: x.input.waterFracOfLiquid ? x.input.waterFracOfLiquid : null,
        waterShare: r.waterShare,
        interfaceHeightFt: r.interfaceHeightFt,
        waterLayerFt: r.waterLayerFt,
        oilLayerFt: r.oilLayerFt,
        liquidRetentionLengthFt: r.liquidRetentionLengthFt,
        lengthFt: r.lengthFt,
        controlling: r.controlling,
        retentionPhase: r.retentionPhase,
        retiredChordWaterLayerFt: x.expected.retiredChordRule.waterLayerFt,
        retiredChordOilLayerFt: x.expected.retiredChordRule.oilLayerFt,
      };
    }),
    refusals: THREE_PHASE_REFUSAL_PROBES.map(([label, args]) => ({
      label, ...attempt(() => S.horizontalThreePhase(args)),
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. Droplets, and the verdicts they carry.
// ---------------------------------------------------------------------------

export const dropletsAndVerdicts = () => {
  const c = AG();
  const proportional = threePhaseAt(c);
  const pinned = threePhaseAt(c, { waterFracOfLiquid: AGBAMI_EXPLICIT_WATER_FRAC });
  const tight = threePhaseAt(c, { waterDropletMicron: AGBAMI_TIGHT_WATER_DROPLET_MICRON });
  return {
    publishedStokes: G.stokes.map((x) => {
      const v = S.liquidLiquidSettlingFtS(x.input).vFtS;
      return {
        name: x.name, input: x.input, engineVFtS: v, oracleVFtS: x.expected.vFtS, ratioDerived: x.expected.vFtS / v,
      };
    }),
    ladder: DROPLET_LADDER.map((dm) => ({
      dropletMicron: dm,
      muOilCp: AGBAMI.muOilCp,
      vFtS: S.liquidLiquidSettlingFtS({
        dropletMicron: dm, sgHeavy: AGBAMI.sgWater, sgLight: AGBAMI.sgOil, muCp: AGBAMI.muOilCp,
      }).vFtS,
    })),
    lengthFt: proportional.lengthFt,
    residenceOilS: proportional.dropChecks.residenceOilS,
    residenceWaterS: proportional.dropChecks.residenceWaterS,
    waterDropletMicron: AGBAMI.waterDropletMicron,
    waterDropVelocityFtS: proportional.dropChecks.waterDropVelocityFtS,
    waterDropFallS: proportional.dropChecks.waterDropFallS,
    oilLayerFt: proportional.oilLayerFt,
    waterCarryover: proportional.dropChecks.waterCarryover,
    oilDropletMicron: AGBAMI.oilDropletMicron,
    oilDropVelocityFtS: proportional.dropChecks.oilDropVelocityFtS,
    oilDropRiseS: proportional.dropChecks.oilDropRiseS,
    waterLayerFt: proportional.waterLayerFt,
    oilCarryunder: proportional.dropChecks.oilCarryunder,
    tightMicron: AGBAMI_TIGHT_WATER_DROPLET_MICRON,
    tight: {
      waterDropVelocityFtS: tight.dropChecks.waterDropVelocityFtS,
      waterDropFallS: tight.dropChecks.waterDropFallS,
      residenceOilS: tight.dropChecks.residenceOilS,
      waterCarryover: tight.dropChecks.waterCarryover,
      warning: tight.warning,
    },
    pinnedResidenceOilS: pinned.dropChecks.residenceOilS,
    pinnedResidenceWaterS: pinned.dropChecks.residenceWaterS,
    // Reading the square law as a straight line, and what that costs.
    linearFoil: (() => {
      const settle = (dm) => S.liquidLiquidSettlingFtS({
        dropletMicron: dm, sgHeavy: AGBAMI.sgWater, sgLight: AGBAMI.sgOil, muCp: AGBAMI.muOilCp,
      }).vFtS;
      const v500 = settle(500);
      const v250 = settle(250);
      return {
        micronLarge: 500,
        micronSmall: 250,
        vLarge: v500,
        vSmall: v250,
        halfOfLargeDerived: v500 / 2,
        gapDerived: v500 / 2 - v250,
      };
    })(),
  };
};

// ---------------------------------------------------------------------------
// SECTION 15. The family of vessels.
// ---------------------------------------------------------------------------

const sweepShape = (res) => ({
  rows: res.rows.map((r) => ({
    diameterFt: r.diameterFt,
    lengthFt: r.lengthFt,
    ldRatio: r.ldRatio,
    inRange: r.inRange,
    feasible: r.feasible,
    reasons: [...r.reasons],
  })),
  preferred: res.preferred ? { diameterFt: res.preferred.diameterFt, lengthFt: res.preferred.lengthFt } : null,
  preferredStatus: res.preferredStatus,
  ldMin: res.ldMin,
  ldMax: res.ldMax,
});

export const vesselFamily = () => {
  const c1 = A1();
  const c2 = A2();
  const cg = AG();
  const abana1 = S.ldSweep({
    mode: 'vertical2', ...ABANA_1_SWEEP, qGasActFt3S: c1.qGasActFt3S, vTerminalFtS: c1.vT,
    qLiquidBpd: c1.qLiquid, retentionMin: ABANA_1.retentionMin, allowanceFt: ABANA_1.allowanceFt,
  });
  const abana2 = S.ldSweep({
    mode: 'horizontal2', ...ABANA_2_SWEEP, qGasActFt3S: c2.qGasActFt3S, vTerminalFtS: c2.vT,
    qLiquidBpd: c2.qLiquid, retentionMin: ABANA_2.retentionMin, liquidLevelFrac: ABANA_2.liquidLevelFrac,
  });
  const abana2Wide = S.ldSweep({
    mode: 'horizontal2', diametersFt: ABANA_2_SWEEP.diametersFt, ...ABANA_2_WIDE_BAND,
    qGasActFt3S: c2.qGasActFt3S, vTerminalFtS: c2.vT, qLiquidBpd: c2.qLiquid,
    retentionMin: ABANA_2.retentionMin, liquidLevelFrac: ABANA_2.liquidLevelFrac,
  });
  const agbami = S.ldSweep({
    mode: 'horizontal3', ...AGBAMI_SWEEP, qGasActFt3S: cg.qGasActFt3S, vTerminalFtS: cg.vT,
    liquidLevelFrac: AGBAMI.liquidLevelFrac, ...AGBAMI, diameterFt: undefined,
  });
  const agbamiTight = S.ldSweep({
    mode: 'horizontal3', ...AGBAMI_SWEEP, qGasActFt3S: cg.qGasActFt3S, vTerminalFtS: cg.vT,
    liquidLevelFrac: AGBAMI.liquidLevelFrac, ...AGBAMI,
    waterDropletMicron: AGBAMI_TIGHT_WATER_DROPLET_MICRON, diameterFt: undefined,
  });
  const agbamiNarrow = S.ldSweep({
    mode: 'horizontal3', diametersFt: AGBAMI_SWEEP.diametersFt, ...AGBAMI_NARROW_BAND,
    qGasActFt3S: cg.qGasActFt3S, vTerminalFtS: cg.vT, liquidLevelFrac: AGBAMI.liquidLevelFrac,
    ...AGBAMI, diameterFt: undefined,
  });
  return {
    abana1: sweepShape(abana1),
    abana2: sweepShape(abana2),
    abana2Wide: sweepShape(abana2Wide),
    wideAdmittedRow: {
      diameterFt: abana2Wide.rows[1].diameterFt,
      inRange: abana2Wide.rows[1].inRange,
      reasons: [...abana2Wide.rows[1].reasons],
      preferredDiameterFt: abana2Wide.preferred.diameterFt,
    },
    waterDropletMicron: AGBAMI.waterDropletMicron,
    tightMicron: AGBAMI_TIGHT_WATER_DROPLET_MICRON,
    narrowBand: AGBAMI_NARROW_BAND,
    agbami: sweepShape(agbami),
    agbamiTight: sweepShape(agbamiTight),
    agbamiNarrow: sweepShape(agbamiNarrow),
    published: G.sweep.map((c) => {
      const r = S.ldSweep(c.input);
      return {
        name: c.name,
        mode: c.input.mode,
        ldMin: c.input.ldMin,
        ldMax: c.input.ldMax,
        preferredDiameterFt: r.preferred ? r.preferred.diameterFt : null,
        preferredStatus: r.preferredStatus,
        retiredPreferredDiameterFt: c.expected.retiredPreferredDiameterFt,
        rows: r.rows.map((row) => ({
          diameterFt: row.diameterFt,
          ldRatio: row.ldRatio,
          lengthFt: row.lengthFt,
          inRange: row.inRange,
          feasible: row.feasible,
          reasons: [...row.reasons],
        })),
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 16. Judging a layout.
// ---------------------------------------------------------------------------

export const layoutReading = () => {
  const layout = erhaLayout();
  return {
    checked: layout.checked,
    zeroRequirementPairs: layout.zeroRequirementPairs,
    skippedCount: layout.skipped.length,
    unknownPairCount: layout.unknownPairs.length,
    complete: layout.complete,
    pass: layout.pass,
    passStatus: layout.passStatus,
    published: GL.layout.map((c) => {
      const r = L.checkLayout(c.input);
      return {
        name: c.name,
        checked: r.checked,
        zeroRequirementPairs: r.zeroRequirementPairs,
        violationCount: r.violations.length,
        skipped: r.skipped.map((s) => ({ ...s })),
        unknownPairs: r.unknownPairs.map((u) => ({ ...u })),
        complete: r.complete,
        pass: r.pass,
        passStatus: r.passStatus,
        retiredChecked: c.expected.retiredRule.checked,
        retiredPass: c.expected.retiredRule.pass,
        retiredWorstPair: c.expected.retiredRule.worstPair,
        worstAbsolute: r.worstAbsolute ? { ...r.worstAbsolute } : null,
        worstRelative: r.worstRelative ? { ...r.worstRelative } : null,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 17. What the method does not know.
// ---------------------------------------------------------------------------

export const heldItems = () => {
  const c = A1();
  return {
    items: HELD_ITEMS.map((h) => ({ ...h })),
    marker: HELD_MARKER,
    kFloor: S.K_FLOOR,
    abanaPsig: ABANA_1.pPsig,
    kBase: c.kResult.kBase,
    kUsed: c.kResult.k,
    dakProbes: DAK_PROBES.map(([label, input]) => {
      const r = S.gasDensityLbFt3(input);
      return {
        label, input, error: r.error || null, z: r.z, rhoLbFt3: r.rhoLbFt3, note: r.note || null,
      };
    }),
    dakBounds: {
      tprMin: S.DAK_TPR_MIN, tprMax: S.DAK_TPR_MAX, pprMax: S.DAK_PPR_MAX, pprMinFit: S.DAK_PPR_MIN_FIT,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 18. The Expert reading, a stream and a site together.
// ---------------------------------------------------------------------------

export const expertChain = () => {
  const c = AG();
  const three = threePhaseAt(c);
  const flare = L.flareSetbackM(ERHA_FLARE);
  const pool = L.poolFireSetbackM(ERHA_POOL);
  const layout = erhaLayout();
  return {
    pPsig: AGBAMI.pPsig,
    tF: AGBAMI.tF,
    ppr: c.ppr,
    tpr: c.tpr,
    z: c.z,
    rhoGas: c.rhoGas,
    k: c.k,
    vT: c.vT,
    qGasActFt3S: c.qGasActFt3S,
    diameterFt: AGBAMI.diameterFt,
    interfaceHeightFt: three.interfaceHeightFt,
    lengthFt: three.lengthFt,
    controlling: three.controlling,
    waterDropletMicron: AGBAMI.waterDropletMicron,
    tightMicron: AGBAMI_TIGHT_WATER_DROPLET_MICRON,
    flareSetbackM: flare.distanceM,
    flareQKw: flare.qKw,
    poolRadiusM: pool.radiusFromCentreM,
    poolEdgeM: pool.setbackFromEdgeM,
    violationCount: layout.violations.length,
    worstAbsoluteShortfallM: layout.worstAbsolute.shortfallM,
    worstRelativeFraction: layout.worstRelative.shortfallFraction,
    skippedCount: layout.skipped.length,
  };
};

// ===========================================================================
// THE CAPSTONE. EJULEBE, ODEAMA AND ADANGA ONLY. NOT FOR LESSONS, NOT FOR
// PANELS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL, copied VERBATIM from
// /root/fc-wip-separation/fc1_fields_capstone.mjs so the grader, the lab's own
// tests and the migration headers all read one derivation. The one departure
// from verbatim is that the yard's two metres-per-degree constants and its
// offset helper are renamed (ADANGA_M_PER_DEG_LAT, ADANGA_M_PER_DEG_LON,
// adangaAt), because the teaching block above already owns those names in this
// one module. Their VALUES are unchanged, and the eighteen fields reproducing
// fields.json exactly is the proof.
//
// EVERY TIER STATES ITS OWN VENDOR K, so no graded field depends on a HELD
// quantity: the pressure derating and its floor are nowhere below, no graded
// field reads a spacing TABLE figure, and the Expert layout is handed the
// site's own setbacks and graded on radiation shortfalls only.
//
// Every name carries EJULEBE, ODEAMA or ADANGA, and panelCapstoneGuard.test.js
// greps the three panel sources and the learning page for every one of them.
// The leak gate in separationLab.test.js checks every TEACHING export's return
// values against the eighteen graded answers.
// ===========================================================================

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

export const ADANGA_DATUM = { lat: 4.9021, lon: 6.8714 };
const ADANGA_M_PER_DEG_LAT = 110574;
const ADANGA_M_PER_DEG_LON = 111320 * Math.cos((ADANGA_DATUM.lat * Math.PI) / 180);
const adangaAt = (northM, eastM) => ({
  lat: ADANGA_DATUM.lat + northM / ADANGA_M_PER_DEG_LAT,
  lon: ADANGA_DATUM.lon + eastM / ADANGA_M_PER_DEG_LON,
});

export const ADANGA_ITEMS = [
  { id: 'a-wh1', name: 'Wellhead A', type: 'wellhead', ...adangaAt(0, 0) },
  { id: 'a-wh2', name: 'Wellhead B', type: 'wellhead', ...adangaAt(4, 0) },
  { id: 'a-mf1', name: 'Manifold', type: 'manifold', ...adangaAt(26, 14) },
  { id: 'a-sp1', name: 'Test separator', type: 'separator', ...adangaAt(48, 30) },
  { id: 'a-vv1', name: 'Isolation valve', type: 'valve', ...adangaAt(50, 32) },
  { id: 'a-px1', name: 'Custody flow meter', type: 'flowmeter', ...adangaAt(70, 44) },
  { id: 'a-tk1', name: 'Slop tank', type: 'tank', ...adangaAt(84, 55) },
  { id: 'a-fl1', name: 'Yard flare', type: 'flare', ...adangaAt(215, 150) },
  { id: 'a-cr1', name: 'Yard control room', type: 'control', ...adangaAt(245, 185) },
  { id: 'a-tk2', name: 'Second slop tank', type: 'tank', lat: null, lon: null },
];

export const ADANGA_SOURCES = [
  { id: 'a-fl1', label: 'Yard flare radiation', setbackM: 100, allowableKwM2: 6.31 },
  { id: 'a-tk1', label: 'Slop tank pool fire', setbackM: 47, allowableKwM2: 4.73 },
  { id: 'a-ghost', label: 'Portable flare, not placed', setbackM: 35, allowableKwM2: 4.73 },
];

/** The conditions chain the capstone runs, which states its K rather than
 *  reading the held derating. */
const ejulebeConditions = (p) => {
  const pPsia = p.pPsig + 14.7;
  const gas = S.gasDensityLbFt3({ pPsia, tF: p.tF, gasSg: p.gasSg });
  const rhoOil = p.oilApi !== undefined ? S.oilDensityLbFt3(p.oilApi) : p.sgOil * 62.4;
  const rhoWater = (p.waterSg ?? p.sgWater) * 62.4;
  const qLiquid = p.qOilBpd + p.qWaterBpd;
  const rhoLiquid = (rhoOil * p.qOilBpd + rhoWater * p.qWaterBpd) / qLiquid;
  const k = S.kValue({ kOverride: p.kOverride });
  const vt = S.terminalVelocityFtS({ k: k.k, rhoLLbFt3: rhoLiquid, rhoGLbFt3: gas.rhoLbFt3 });
  return {
    pPsia, z: gas.z, ppr: gas.ppr, tpr: gas.tpr,
    rhoGas: gas.rhoLbFt3, rhoOil, rhoWater, rhoLiquid, qLiquid, k: k.k,
    vT: vt.vFtS,
    qGasActFt3S: S.gasActualFt3S({ qGasMMscfd: p.qGasMMscfd, pPsia, tF: p.tF, z: gas.z }),
  };
};

/** The capstone runs, exactly as the derivation makes them. */
export const ejulebeRuns = () => {
  const c1 = ejulebeConditions(EJULEBE_1);
  const c1v = S.verticalTwoPhase({
    qGasActFt3S: c1.qGasActFt3S, vTerminalFtS: c1.vT, qLiquidBpd: c1.qLiquid,
    retentionMin: EJULEBE_1.retentionMin, allowanceFt: EJULEBE_1.allowanceFt,
    diameterOverride: EJULEBE_1.diameterFt,
  });
  const c2 = ejulebeConditions(EJULEBE_2);
  const c2h = S.horizontalTwoPhase({
    diameterFt: EJULEBE_2.diameterFt, qGasActFt3S: c2.qGasActFt3S, vTerminalFtS: c2.vT,
    qLiquidBpd: c2.qLiquid, retentionMin: EJULEBE_2.retentionMin,
    liquidLevelFrac: EJULEBE_2.liquidLevelFrac,
  });
  const c2slug = S.vesselSlugCatcher(EJULEBE_SLUG);
  const c2fing = S.fingerSlugCatcher(EJULEBE_FINGERS);
  const c2flare = L.flareSetbackM(ODEAMA_FLARE);
  const c2pool = L.poolFireSetbackM(ODEAMA_POOL);
  const c3 = ejulebeConditions({ ...EJULEBE_3, waterSg: EJULEBE_3.sgWater });
  const c33 = S.horizontalThreePhase({
    diameterFt: EJULEBE_3.diameterFt, qGasActFt3S: c3.qGasActFt3S, vTerminalFtS: c3.vT,
    liquidLevelFrac: EJULEBE_3.liquidLevelFrac, ...EJULEBE_3,
  });
  const c4 = ejulebeConditions(EJULEBE_4);
  const c4sweep = S.ldSweep({
    mode: 'vertical2', diametersFt: EJULEBE_4.diametersFt,
    ldMin: EJULEBE_4.ldMin, ldMax: EJULEBE_4.ldMax,
    qGasActFt3S: c4.qGasActFt3S, vTerminalFtS: c4.vT,
    qLiquidBpd: EJULEBE_4.qOilBpd + EJULEBE_4.qWaterBpd,
    retentionMin: EJULEBE_4.retentionMin, allowanceFt: EJULEBE_4.allowanceFt,
  });
  const c3lay = L.checkLayout({ items: ADANGA_ITEMS, radiationSources: ADANGA_SOURCES });
  return {
    c1, c1v, c2, c2h, c2slug, c2fing, c2flare, c2pool, c3, c33, c4, c4sweep, c3lay,
  };
};

/**
 * THE GRADING FLOOR. A tolerance below half a unit in the last place the digest
 * PRINTS a quantity grades a correctly-read figure WRONG: a learner reads the
 * right row, quotes it exactly as the course told them to, and still fails. The
 * kit has now found that shape three times each in FC2, FC3 and FC4, and none of
 * the six independent tier audits across those waves caught any of them, because
 * each looked at lessons, or banks, or the digest, and nobody looked across the
 * seam between the stated precision and the grader.
 *
 * FC1's digest header states two precisions: vessel work (ft, ft2, lb per ft3,
 * ft per s, ratios) to SIX decimals, site work (metres, kilowatts, seconds) to
 * FOUR. So every tolerance below is derived rather than typed:
 *
 *     tol = max(stated, halfUlp(the decimals that class prints to))
 *
 * MAX AND NEVER MIN. It only ever loosens, so nothing that graded correct before
 * this can grade wrong after it. On FC1 every stated tolerance already clears its
 * floor, so this changes no number today; it is here so that a later change to a
 * stated tolerance cannot silently drop below what the course prints.
 */
const gradeFloor = (stated, decimals) => Math.max(stated, 0.5 * 10 ** -decimals);

/**
 * The eighteen graded fields as [tier, key, value, tolerance], in the order and
 * with the tolerances the capstone publishes. THE TOLERANCE IS ABSOLUTE, in the
 * field's own units: academy_submit_capstone grades abs(v_got - v_exp) <= v_tol.
 */
export const ejulebeCapstoneFields = () => {
  const {
    c1, c1v, c2h, c2slug, c2fing, c2flare, c2pool, c33, c4sweep, c3lay,
  } = ejulebeRuns();
  return [
    ['beginner', 'ejulebe1_gas_density_lbft3', c1.rhoGas, gradeFloor(1e-4, 6)],
    ['beginner', 'ejulebe1_gas_actual_ft3s', c1.qGasActFt3S, gradeFloor(1e-4, 6)],
    ['beginner', 'ejulebe1_terminal_velocity_fts', c1.vT, gradeFloor(1e-5, 6)],
    ['beginner', 'ejulebe1_gas_diameter_ft', c1v.diameterGasFt, gradeFloor(1e-4, 6)],
    ['beginner', 'ejulebe1_height_ft', c1v.heightFt, gradeFloor(1e-4, 6)],
    ['beginner', 'ejulebe1_velocity_margin', c1v.velocityMargin, gradeFloor(1e-5, 6)],
    ['intermediate', 'ejulebe2_liquid_length_ft', c2h.lengthLiquidFt, gradeFloor(1e-4, 6)],
    ['intermediate', 'ejulebe2_gas_velocity_fts', c2h.gasVelocityFtS, gradeFloor(1e-5, 6)],
    ['intermediate', 'ejulebe_slug_vessel_diameter_ft', c2slug.diameterFt, gradeFloor(1e-4, 6)],
    ['intermediate', 'ejulebe_finger_length_ft', c2fing.fingerLengthFt, gradeFloor(1e-3, 6)],
    ['intermediate', 'odeama_flare_setback_m', c2flare.distanceM, gradeFloor(1e-3, 4)],
    ['intermediate', 'odeama_pool_setback_edge_m', c2pool.setbackFromEdgeM, gradeFloor(1e-3, 4)],
    ['advanced', 'ejulebe3_interface_height_ft', c33.interfaceHeightFt, gradeFloor(1e-5, 6)],
    ['advanced', 'ejulebe3_water_drop_fall_s', c33.dropChecks.waterDropFallS, gradeFloor(1e-3, 4)],
    ['advanced', 'ejulebe3_oil_drop_rise_s', c33.dropChecks.oilDropRiseS, gradeFloor(1e-3, 4)],
    ['advanced', 'ejulebe4_preferred_height_ft', c4sweep.preferred.lengthFt, gradeFloor(1e-4, 6)],
    ['advanced', 'adanga_worst_absolute_shortfall_m', c3lay.worstAbsolute.shortfallM, gradeFloor(1e-4, 4)],
    ['advanced', 'adanga_worst_relative_fraction', c3lay.worstRelative.shortfallFraction, gradeFloor(1e-6, 6)],
  ];
};

/** The graded answers keyed by field. A field list already in hand can be passed in. */
export const ejulebeCapstoneValues = (fieldList) =>
  Object.fromEntries((fieldList ?? ejulebeCapstoneFields()).map(([, key, v]) => [key, v]));

/** The grading tolerance of each field, absolute, in the field's own units. */
export const ejulebeCapstoneTolerances = (fieldList) =>
  Object.fromEntries((fieldList ?? ejulebeCapstoneFields()).map(([, key, , tol]) => [key, tol]));

/**
 * Every export of this module that is built on the capstone. The panel guard
 * greps the panel sources for each name; the leak gate skips each one when it
 * walks the teaching surface.
 */
export const CAPSTONE_ONLY_EXPORTS = [
  'EJULEBE_1', 'EJULEBE_2', 'EJULEBE_SLUG', 'EJULEBE_FINGERS', 'EJULEBE_3', 'EJULEBE_4',
  'ODEAMA_FLARE', 'ODEAMA_POOL',
  'ADANGA_DATUM', 'ADANGA_ITEMS', 'ADANGA_SOURCES',
  'ejulebeRuns', 'ejulebeCapstoneFields', 'ejulebeCapstoneValues', 'ejulebeCapstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

// ---------------------------------------------------------------------------
// The leak guard machinery, the EC3 course's, unchanged.
// ---------------------------------------------------------------------------

/** How much wider than the grader's own band a teaching number has to stand clear. */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = [
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
];

/**
 * Every forbidden neighbourhood: eighteen answers, three shiftings, ten times
 * the grading band, the band SCALED with the shifting because the grader's
 * tolerance is absolute in the field's own units.
 */
export const leakGuardTargets = (fieldList) => {
  const out = [];
  fieldList.forEach(([tier, key, v, tol]) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const gradingBand = tol * Math.abs(factor);
      out.push({
        tier, key, tag, value: v * factor, gradingBand, band: LEAK_GUARD_MARGIN * gradingBand,
      });
    });
  });
  return out;
};

/** The target a number collides with, or null. Dimension blind: a box takes any number. */
export const leakGuardHit = (v, targets) => {
  if (!Number.isFinite(v)) return null;
  for (const t of targets) {
    if (Math.abs(v - t.value) < t.band) return t;
  }
  return null;
};

/** Every finite number reachable inside a value, with the path it sits at. */
export const collectNumbers = (v, path = '', out = [], depth = 0) => {
  if (depth > 12) return out;
  if (typeof v === 'number') {
    if (Number.isFinite(v)) out.push({ path, value: v });
    return out;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => collectNumbers(x, `${path}[${i}]`, out, depth + 1));
    return out;
  }
  if (v && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => collectNumbers(x, path ? `${path}.${k}` : k, out, depth + 1));
  }
  return out;
};
