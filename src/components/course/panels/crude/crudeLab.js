// Teaching lab for the crude course, "Crude Assay & Blending" (academy module
// commercial_trading). The three explorer panels, the course learning page and
// the vitest files all read this one module, so a number shown to a learner and
// a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every gravity, property,
// basis word, curve point, yield, index, netback, recipe volume, shadow price and
// refusal below is a return value of engines/downstream/crudeAssay.js,
// engines/downstream/productBlending.js or lib/lp/simplex.js, as vendored at
// petrolord-engines 60ee266. This is the ONLY file in the course that imports
// those modules, and it restates none of their formulas.
//
// THE BASIS RULE. Every figure a panel shows is the engine's, on the engine's
// basis, and the basis the engine names travels beside it. Where a panel shows
// the WRONG basis for contrast (API averaged on volume, sulfur on volume, the
// Refutas index on volume, the SARA fractions on volume, T50 read at the grid,
// losses taken after the costs, rowPrice), the reading is computed HERE, with
// the engine's own helpers (blendOnVolume, blendOnMass, blendViscosity,
// propertyOfBlend), exactly as tools/course-waves/crude/crude_dump.mjs computes
// it for the digest, and it is labelled as the reading the engine does not use.
// A difference between two figures is the difference of the two figures as the
// digest prints them, each rounded to four decimals first (d4), so a learner
// subtracting two printed numbers gets the printed difference.
//
// FOUR DECIMALS. fx() prints a computed figure to four decimals, the digest's
// precision, with a negative zero printed as zero. An input prints as typed.
//
// NO CLOCK. None of the three engine files reads a date, a timer or a random
// number, and neither does this lab. crudeLab.test.js builds the whole snapshot
// under two faked system dates and under TZ=Pacific/Pago_Pago and demands the
// same bytes.
//
// EVERY REFUSAL IS THE ENGINE'S OWN RETURNED SENTENCE. No refusal is written as
// a literal anywhere in this directory, and the lab test asserts that over the
// lab and every panel source.
//
// THE TEACHING CASES are the wave's own records, copied VERBATIM below from
// tools/course-waves/crude/crude_fields.mjs, which crude_dump.mjs imports to
// build the teaching digest. crudeLab.test.js reads that file through
// tools/course-waves/waveInputs.mjs, compares the block with it byte for byte
// and imports it to compare every value, so the copy cannot be edited here
// alone. The probe inputs that live in the dump rather than the fields file
// (the gravity ladder, the curve probes, the gravity-screen probes, the re-solve
// limits) are copied below the block, and every figure they produce is pinned
// against the digest line the dump printed from the same inputs.
//
// THREE TEACHING CASES AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs three other records, and nothing in this lab imports, reads, names or
// reproduces any of them. panelCapstoneGuard.test.js sweeps this directory and
// the learning page for every graded answer.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

/* eslint-disable import/namespace */
import * as CA from '@petrolord/engines/engines/downstream/crudeAssay.js';
import * as PB from '@petrolord/engines/engines/downstream/productBlending.js';
import * as LP from '@petrolord/engines/lib/lp/simplex.js';

/** The engine namespaces, for the lab test's resolution and clock checks. */
export const ENGINE = Object.freeze({ CA, PB, LP });

// ---- BEGIN VERBATIM crude_fields.mjs ----
const curve = (pts) => pts.map(([volumePercent, temperatureF]) => ({ volumePercent, temperatureF }));

/* ------------------------------------------------------------------ *
 * OBIGBO: the crude library (Associate)
 * ------------------------------------------------------------------ */
export const OBIGBO_LIGHT = {
  id: 'obl', name: 'Obigbo Light', api: 36.8, sulfurWtPct: 0.14, tanMgKohG: 0.26, nitrogenWtPct: 0.07,
  nickelPpm: 3.2, vanadiumPpm: 1.4, viscosityCSt: 4.6,
  sara: { saturates: 52.0, aromatics: 33.5, resins: 12.8, asphaltenes: 1.7 },
  curve: curve([[0, 85], [10, 205], [30, 390], [50, 548], [70, 742], [90, 1060], [100, 1380]]),
};
export const EGBEMA_MEDIUM = {
  id: 'egm', name: 'Egbema Medium', api: 25.9, sulfurWtPct: 0.48, tanMgKohG: 0.62, nitrogenWtPct: 0.16,
  nickelPpm: 12.5, vanadiumPpm: 8.7, viscosityCSt: 22,
  sara: { saturates: 34.1, aromatics: 42.6, resins: 19.8, asphaltenes: 3.5 },
  curve: curve([[0, 95], [10, 280], [30, 500], [50, 668], [70, 880], [90, 1230], [100, 1480]]),
};
export const ASARAMA_HEAVY = {
  id: 'ash', name: 'Asarama Heavy', api: 17.2, sulfurWtPct: 1.85, tanMgKohG: 1.4, nitrogenWtPct: 0.34,
  nickelPpm: 41, vanadiumPpm: 96, viscosityCSt: 610,
  sara: { saturates: 31.5, aromatics: 37.2, resins: 19.4, asphaltenes: 11.9 },
  curve: curve([[0, 120], [10, 380], [30, 610], [50, 790], [70, 1000], [90, 1320], [100, 1560]]),
};
export const UBIE_CONDENSATE = {
  id: 'ubc', name: 'Ubie Condensate', api: 54.6, sulfurWtPct: 0.03, tanMgKohG: 0.05, nitrogenWtPct: 0.01,
  nickelPpm: 0.4, vanadiumPpm: 0.2, viscosityCSt: 1.1,
  sara: { saturates: 89.1, aromatics: 9.2, resins: 1.5, asphaltenes: 0.2 },
  curve: curve([[0, 70], [10, 140], [30, 230], [50, 320], [70, 430], [90, 600], [100, 760]]),
};
/** A partial assay: its curve starts at 4 percent and stops at 88. */
export const EBOCHA_PARTIAL = {
  id: 'ebp', name: 'Ebocha partial assay', api: 31.4, sulfurWtPct: 0.22,
  curve: curve([[4, 110], [25, 370], [50, 590], [70, 760], [88, 920]]),
};
export const OBIGBO_LIBRARY = [OBIGBO_LIGHT, EGBEMA_MEDIUM, ASARAMA_HEAVY, UBIE_CONDENSATE];

/** The export blend: Obigbo Light and Egbema Medium, 65 to 35 by volume. */
export const OBIGBO_BLEND_SHARES = { obl: 65, egm: 35 };

/** Three stability pairs, by volume, chosen to land one in each CII band. */
export const OBIGBO_STABILITY_PAIRS = [
  { label: 'Asarama Heavy with Ubie Condensate', ids: ['ash', 'ubc'], shares: [50, 50] },
  { label: 'Asarama Heavy with Egbema Medium', ids: ['ash', 'egm'], shares: [70, 30] },
  { label: 'Egbema Medium with Obigbo Light', ids: ['egm', 'obl'], shares: [85, 15] },
];

/** The API teaching pair: two gravities twenty degrees apart, half and half. */
export const API_PAIR = [
  { id: 'a20', name: 'A 20 API crude', api: 20 },
  { id: 'a40', name: 'A 40 API crude', api: 40 },
];

/** The default cut set the studio opens on (Suite CrudeAssayContext DEFAULT_CUTS). */
export const STUDIO_CUTS = [
  { id: 'lpg', name: 'LPG / Light ends', fromF: null, toF: 90 },
  { id: 'naphtha', name: 'Naphtha', fromF: 90, toF: 350 },
  { id: 'kerosene', name: 'Kerosene / Jet', fromF: 350, toF: 500 },
  { id: 'diesel', name: 'Diesel / Gasoil', fromF: 500, toF: 650 },
  { id: 'vgo', name: 'Vacuum gasoil', fromF: 650, toF: 1000 },
  { id: 'residue', name: 'Vacuum residue', fromF: 1000, toF: null },
];

/** The two example crudes the studio opens on (Suite CrudeAssayContext DEFAULT_CRUDES), 60 to 40. */
export const STUDIO_PAIR = [
  { id: 'sls', name: 'Light sweet (example)', api: 35.4, sulfurWtPct: 0.15, tanMgKohG: 0.30, nitrogenWtPct: 0.10,
    nickelPpm: 5, vanadiumPpm: 1, viscosityCSt: 5, volumeFraction: 60,
    curve: curve([[0, 80], [10, 210], [30, 400], [50, 560], [70, 760], [90, 1080], [100, 1400]]) },
  { id: 'sms', name: 'Medium sour (example)', api: 24.0, sulfurWtPct: 2.20, tanMgKohG: 0.45, nitrogenWtPct: 0.22,
    nickelPpm: 22, vanadiumPpm: 60, viscosityCSt: 45, volumeFraction: 40,
    curve: curve([[0, 100], [10, 300], [30, 520], [50, 690], [70, 900], [90, 1250], [100, 1500]]) },
];
/** The studio's default valuation (Suite CrudeAssayContext DEFAULT_VALUATION). */
export const STUDIO_VALUATION = {
  prices: { lpg: 55, naphtha: 78, kerosene: 96, diesel: 101, vgo: 72, residue: 44 },
  processingCostPerBbl: 4.5, freightPerBbl: 2.0, lossPercent: 0.5,
};

/* ------------------------------------------------------------------ *
 * KWALE: the modular refinery's valuation (Professional)
 * ------------------------------------------------------------------ */
export const KWALE_LIGHT = {
  id: 'kwl', name: 'Kwale Light', api: 38.4, sulfurWtPct: 0.11,
  curve: curve([[0, 75], [10, 190], [30, 370], [50, 530], [70, 720], [90, 1030], [100, 1350]]),
};
export const UGHELLI_MEDIUM = {
  id: 'ugm', name: 'Ughelli Medium', api: 27.1, sulfurWtPct: 0.36,
  curve: curve([[0, 90], [10, 265], [30, 480], [50, 650], [70, 860], [90, 1200], [100, 1470]]),
};
export const KWALE_CRUDES = [KWALE_LIGHT, UGHELLI_MEDIUM];
/** The blend the refinery is offered: 55 to 45 by volume. */
export const KWALE_SHARES = { kwl: 55, ugm: 45 };
/** A topping refinery has no vacuum unit, so its heaviest cut is atmospheric residue. */
export const KWALE_CUTS = [
  { id: 'lpg', name: 'LPG / Light ends', fromF: null, toF: 90 },
  { id: 'naphtha', name: 'Naphtha', fromF: 90, toF: 330 },
  { id: 'kerosene', name: 'Kerosene / DPK', fromF: 330, toF: 480 },
  { id: 'diesel', name: 'Diesel / AGO', fromF: 480, toF: 650 },
  { id: 'residue', name: 'Atmospheric residue', fromF: 650, toF: null },
];
/** The same set with the diesel end point moved from 650 F to 700 F. */
export const KWALE_CUTS_DEEPER_DIESEL = KWALE_CUTS.map((c) => (c.id === 'diesel' ? { ...c, toF: 700 }
  : c.id === 'residue' ? { ...c, fromF: 700 } : c));
export const KWALE_VALUATION = {
  prices: { lpg: 48, naphtha: 74, kerosene: 93, diesel: 98, residue: 57 },
  processingCostPerBbl: 6.8, freightPerBbl: 1.9, lossPercent: 0.8, marker: 72.5,
};
/** A cut set that asks the curve for something it cannot answer: a cut past a partial assay's last point. */
export const KWALE_WITH_PARTIAL_SHARES = { kwl: 50, ebp: 50 };

/* ------------------------------------------------------------------ *
 * APAPA: the Lagos blending terminal (Expert)
 * ------------------------------------------------------------------ */
/** The PMS pool: five bought-in components, availability in barrels. */
export const APAPA_PMS_POOL = [
  { id: 'ref', name: 'Reformate', cost: 93.8, sg: 0.805, density: 0.805, ron: 98.6, mon: 87.9, sulfurPpm: 4, rvp: 3.2, minVolume: 0, maxVolume: 3500 },
  { id: 'fcc', name: 'FCC gasoline', cost: 84.9, sg: 0.748, density: 0.748, ron: 92.3, mon: 80.6, sulfurPpm: 110, rvp: 6.2, minVolume: 0, maxVolume: 4000 },
  { id: 'iso', name: 'Isomerate', cost: 88.2, sg: 0.662, density: 0.662, ron: 87.6, mon: 85.4, sulfurPpm: 1, rvp: 12.9, minVolume: 0, maxVolume: 1500 },
  { id: 'but', name: 'Butane', cost: 54.1, sg: 0.582, density: 0.582, ron: 93.8, mon: 89.1, sulfurPpm: 1, rvp: 52.8, minVolume: 0, maxVolume: 400 },
];
export const APAPA_PMS_TARGET = 8000;
/** The AGO pool, blended to the 50 ppm diesel template. */
export const APAPA_AGO_POOL = [
  { id: 'sr', name: 'Straight-run gasoil', cost: 101.5, sg: 0.846, density: 0.846, cetane: 52, sulfurPpm: 12, viscosityCSt: 3.8, flashPointC: 74, minVolume: 0, maxVolume: 5000 },
  { id: 'kero', name: 'Kerosene', cost: 107.2, sg: 0.795, density: 0.795, cetane: 44, sulfurPpm: 6, viscosityCSt: 1.3, flashPointC: 46, minVolume: 0, maxVolume: 1800 },
  { id: 'lco', name: 'Hydrotreated LCO', cost: 86.4, sg: 0.921, density: 0.921, cetane: 29, sulfurPpm: 35, viscosityCSt: 2.7, flashPointC: 66, minVolume: 0, maxVolume: 1500 },
  { id: 'lvgo', name: 'Light vacuum gasoil', cost: 90.3, sg: 0.866, density: 0.866, cetane: 54, sulfurPpm: 85, viscosityCSt: 6.9, flashPointC: 112, minVolume: 0, maxVolume: 1200 },
];
export const APAPA_AGO_TARGET = 6000;

/** The optimizer's default gasoline pool (Suite BlendOptimizerContext DEFAULT_COMPONENTS), 1000 bbl. */
export const OPTIMIZER_DEFAULT_POOL = [
  { id: 'reformate', name: 'Reformate', cost: 92, sg: 0.80, density: 0.800, ron: 100, mon: 89, sulfurPpm: 2, rvp: 3.0, minVolume: 0, maxVolume: 600 },
  { id: 'fcc', name: 'FCC gasoline', cost: 84, sg: 0.75, density: 0.750, ron: 92, mon: 80, sulfurPpm: 120, rvp: 6.0, minVolume: 0, maxVolume: 600 },
  { id: 'isomerate', name: 'Isomerate', cost: 89, sg: 0.66, density: 0.660, ron: 87, mon: 85, sulfurPpm: 1, rvp: 13.0, minVolume: 0, maxVolume: 300 },
  { id: 'butane', name: 'Butane', cost: 55, sg: 0.58, density: 0.580, ron: 94, mon: 89, sulfurPpm: 1, rvp: 52.0, minVolume: 0, maxVolume: 80 },
];
export const OPTIMIZER_DEFAULT_TARGET = 1000;

/**
 * THE TEXTBOOK LP, before any blending: two products from two shared units.
 * Maximise 5x + 4y subject to 6x + 4y <= 24 and x + 2y <= 6, x, y >= 0.
 * Solved by the kernel itself (solveLP), in the form the kernel minimises.
 */
export const TEXTBOOK_LP = {
  label: 'two products, two shared units',
  c: [5, 4], A: [[6, 4], [1, 2]], b: [24, 6], ops: ['<=', '<='], maximize: true,
};
// ---- END VERBATIM crude_fields.mjs ----

// ---------------------------------------------------------------------------
// THE PROBE INPUTS, copied from crude_dump.mjs where the dump types them beside
// the question. Each one is pinned by the lab test against the digest line the
// dump printed from it.
// ---------------------------------------------------------------------------
export const PROBES = Object.freeze({
  apiLadder: [10, 17.2, 20, 25.9, 30, 36.8, 40, 54.6],
  sgLadder: [0.75, 0.8, 0.85, 0.9, 0.95, 1.0],
  viscosityDomain: [0.1, 0.2, 0.2001, 1, 10, 100, 1000],
  curveTemps: [['obl', [60, 85, 300, 548, 600, 1380, 1500]], ['ebp', [60, 110, 240, 590, 920, 1000]]],
  curveVolumes: [['obl', [0, 10, 25, 50, 95, 100]], ['ebp', [2, 4, 50, 80, 88, 95]]],
  insideCuts: [
    { id: 'a', name: '110 to 370 F', fromF: 110, toF: 370 },
    { id: 'b', name: '370 to 760 F', fromF: 370, toF: 760 },
    { id: 'c', name: '760 to 920 F', fromF: 760, toF: 920 },
  ],
  invertedCut: { id: 'x', name: 'inverted, 500 to 350 F', fromF: 500, toF: 350 },
  gravityScreen: [
    ['contrast at its threshold', 40, 25], ['contrast just past it', 40, 24.99], ['contrast well past it', 40, 24],
    ['lighter crude at its threshold', 35, 19], ['lighter crude just past it', 35.01, 19], ['lighter crude well past it', 36, 19],
  ],
  kwaleCurvePercents: [10, 30, 50, 70, 90],
  d86: [[10, 250], [30, 320], [50, 380], [70, 450], [90, 560]],
  lossRefusals: [101, -1],
  giveawayUnitValues: { ron: 0.6, mon: 0.4 },
  reliefResolves: [['sulfurPpm', 'max', 51], ['sulfurPpm', 'max', 49], ['rvp', 'max', 10], ['rvp', 'max', 8]],
  butaneMaxima: [['400 (as typed)', 400], ['0 (tank empty)', 0], ['left blank (no limit)', '']],
  textbookFixedPoints: [[0, 0], [4, 0], [0, 3]],
  isoFloor: 1200,
});

// ---------------------------------------------------------------------------
// Printing, as the digest prints.
// ---------------------------------------------------------------------------

/** A computed figure to four decimals, a negative zero printed as zero; a missing figure is its word. */
export const fx = (v, word = 'not formed') => {
  if (typeof v !== 'number' || !Number.isFinite(v)) return word;
  const s = v.toFixed(4);
  return /^-0\.0+$/.test(s) ? s.slice(1) : s;
};
/** A figure as the digest prints it, read back as a number. */
export const r4 = (v) => Number(fx(v));
/** The difference of two PRINTED figures, so it matches the digest's difference column. */
export const d4 = (a, b) => (Number.isFinite(a) && Number.isFinite(b) ? r4(a) - r4(b) : null);
/** An input, as typed. */
export const inp = (v) => (v === null || v === undefined || v === '' ? 'left blank' : String(v));
/** The engine's three-valued stable flag, in the digest's words. No verdict is its own state. */
export const verdictWord = (s) => (s === true ? 'true' : s === false ? 'false' : 'no verdict');

const byId = (rows) => Object.fromEntries(rows.map((r) => [r.id, r]));
/** Every crude a panel can pick, the four streams and the partial assay. */
export const LIBRARY = byId([...OBIGBO_LIBRARY, EBOCHA_PARTIAL]);
export const LIBRARY_IDS = Object.keys(LIBRARY);
const given = (v) => v !== undefined && v !== null && v !== '' && Number.isFinite(Number(v));
const SARA_KEYS = ['saturates', 'aromatics', 'resins', 'asphaltenes'];

/** The per-mass properties, with the digest's own labels. */
export const MASS_KEYS = [
  ['sulfurWtPct', 'sulfur wt%'], ['tanMgKohG', 'TAN mg KOH/g'], ['nitrogenWtPct', 'nitrogen wt%'],
  ['nickelPpm', 'nickel ppm'], ['vanadiumPpm', 'vanadium ppm'],
];
/** The properties a learner may blank on one crude. */
export const BLANKABLE = [...MASS_KEYS, ['viscosityCSt', 'viscosity cSt'], ['sara', 'SARA analysis']];

// ---------------------------------------------------------------------------
// SECTION 1: what the modules export, counted from the modules.
// ---------------------------------------------------------------------------
export const modules = () => [['crudeAssay', CA], ['productBlending', PB], ['lib/lp/simplex', LP]].map(([name, mod]) => ({
  name,
  functions: Object.entries(mod).filter(([, v]) => typeof v === 'function').map(([k]) => k).sort(),
  constants: Object.entries(mod).filter(([, v]) => typeof v !== 'function').map(([k]) => k).sort(),
}));

// ---------------------------------------------------------------------------
// SECTION 2: gravity.
// ---------------------------------------------------------------------------
export const gravity = () => {
  const A = CA.apiFromSg(0.5) - CA.apiFromSg(1);
  let prev = null;
  return {
    A,
    B: A - CA.apiFromSg(1),
    rows: PROBES.apiLadder.map((api) => ({ api, sg: CA.sgFromApi(api), roundTrip: CA.apiFromSg(CA.sgFromApi(api)) })),
    steps: PROBES.sgLadder.map((sg) => {
      const api = CA.apiFromSg(sg);
      const step = prev === null ? null : d4(api, prev);
      prev = api;
      return { sg, api, step };
    }),
    water: CA.apiFromSg(1),
  };
};

/** One point on the API hyperbola, for the gravity dial. */
export const apiAt = (sg) => ({ sg, api: CA.apiFromSg(sg) });
/** The hyperbola itself, sampled by the engine, for a chart. */
export const apiCurve = (from = 0.7, to = 1.0, steps = 30) => Array.from({ length: steps + 1 }, (_, i) => {
  const sg = from + ((to - from) * i) / steps;
  return { sg: Number(sg.toFixed(4)), api: CA.apiFromSg(sg) };
});

// ---------------------------------------------------------------------------
// SECTION 3: the OBIGBO library as cards.
// ---------------------------------------------------------------------------
export const library = () => [...OBIGBO_LIBRARY, EBOCHA_PARTIAL].map((c) => ({
  id: c.id,
  name: c.name,
  api: c.api,
  sg: CA.sgFromApi(c.api),
  properties: Object.fromEntries([...MASS_KEYS, ['viscosityCSt']].map(([k]) => [k, given(c[k]) ? c[k] : null])),
  sara: c.sara || null,
  cii: c.sara ? CA.colloidalInstabilityIndex(c.sara) : null,
  refutasIndex: given(c.viscosityCSt) ? CA.viscosityBlendIndex(c.viscosityCSt) : null,
  curve: c.curve,
  partial: c.curve[0].volumePercent !== 0 || c.curve[c.curve.length - 1].volumePercent !== 100,
}));

// ---------------------------------------------------------------------------
// SECTIONS 4 TO 8 AND 12: a blend of any library crudes, every property beside
// the basis the engine names and beside the reading the engine does not use.
// ---------------------------------------------------------------------------

/**
 * The components a blend is built from. `blank` is { id, key }: that crude's
 * property is left blank, which the engine reads as absent. A SARA blank takes
 * the whole analysis away from that crude. `dropSara` takes it from every crude,
 * so the screen falls back to gravity.
 */
export const blendComponents = (ids, shares, { blank = null, byMass = false, dropSara = false } = {}) => ids.map((id, i) => {
  const base = LIBRARY[id];
  if (!base) throw new Error(`no crude ${id} in the library`);
  const c = { ...base, [byMass ? 'massFraction' : 'volumeFraction']: shares[i] };
  if (dropSara) delete c.sara;
  if (blank && blank.id === id) {
    if (blank.key === 'sara') delete c.sara;
    else c[blank.key] = '';
  }
  return c;
});

export const blendOf = (ids, shares, opts = {}) => {
  const comps = blendComponents(ids, shares, opts);
  const b = CA.blendCrudes(comps);
  if (!b || b.error) return { error: b ? b.error : 'no answer', ids, shares };
  const vol = b.fractions.map((f) => f.volumeFraction);
  const mass = b.fractions.map((f) => f.massFraction);
  const allGiven = (k) => comps.every((c) => given(c[k]));
  const apis = comps.map((c) => c.api);
  const apiOnVolume = CA.blendOnVolume(apis, vol);
  const apiOnMass = CA.blendOnMass(apis, mass);
  const visc = comps.map((c) => c.viscosityCSt);
  const viscOK = allGiven('viscosityCSt');
  const viscOnVolumeIndex = viscOK ? CA.blendViscosity(visc, vol) : null;
  const viscLinear = viscOK ? CA.blendOnMass(visc, mass) : null;
  const saraOK = comps.every((c) => c.sara && SARA_KEYS.every((k) => given(c.sara[k])));
  const ciiOnVolume = saraOK
    ? CA.colloidalInstabilityIndex(Object.fromEntries(SARA_KEYS.map((k) => [k, CA.blendOnVolume(comps.map((c) => c.sara[k]), vol)])))
    : null;
  const st = b.stability;
  const crv = CA.blendDistillationCurves(comps, vol);
  const yields = crv.length ? CA.cutYields({ curve: crv, cuts: STUDIO_CUTS }) : null;
  return {
    ids,
    shares,
    byMass: Boolean(opts.byMass),
    fractions: b.fractions.map((f, i) => ({
      ...f,
      sg: CA.sgFromApi(comps[i].api),
      massMinusVolume: d4(f.massFraction, f.volumeFraction),
    })),
    sg: { value: b.properties.sg, basis: 'volume' },
    api: {
      value: b.properties.api,
      basis: b.bases.api,
      onVolume: apiOnVolume,
      minusOnVolume: d4(b.properties.api, apiOnVolume),
      onMass: apiOnMass,
      minusOnMass: d4(b.properties.api, apiOnMass),
    },
    massProperties: MASS_KEYS.map(([key, label]) => {
      const onVolume = allGiven(key) ? CA.blendOnVolume(comps.map((c) => c[key]), vol) : null;
      const value = b.properties[key];
      return {
        key,
        label,
        value,
        basis: b.bases[key],
        missing: b.missing[key] || [],
        onVolume,
        massMinusVolume: value === null ? null : d4(value, onVolume),
      };
    }),
    viscosity: {
      value: b.properties.viscosityCSt,
      basis: b.bases.viscosityCSt,
      indexOnVolume: viscOnVolumeIndex,
      massMinusVolume: d4(b.properties.viscosityCSt, viscOnVolumeIndex),
      linearOnMass: viscLinear,
      linearMinusEngine: d4(viscLinear, b.properties.viscosityCSt),
    },
    missing: b.missing,
    stability: {
      basis: st.basis,
      cii: st.cii ?? null,
      band: st.band ?? null,
      stable: st.stable,
      verdict: verdictWord(st.stable),
      message: st.message,
      contrast: st.contrast ?? null,
      blendedSara: st.blendedSara || null,
      ciiOnVolume,
      volumeMinusEngine: st.cii === undefined ? null : d4(ciiOnVolume, st.cii),
    },
    curve: crv,
    yields,
  };
};

/** SECTION 12: the Obigbo export blend, 65 and 35 by volume. */
export const exportBlend = () => {
  const ids = Object.keys(OBIGBO_BLEND_SHARES);
  return blendOf(ids, ids.map((id) => OBIGBO_BLEND_SHARES[id]));
};

/** SECTION 4: four blends, the API through specific gravity against the averaged API numbers. */
export const apiBlends = () => {
  const pair = (() => {
    const b = CA.blendCrudes(API_PAIR.map((c) => ({ ...c, volumeFraction: 50 })));
    const vol = b.fractions.map((f) => f.volumeFraction);
    const mass = b.fractions.map((f) => f.massFraction);
    const onVolume = CA.blendOnVolume(API_PAIR.map((c) => c.api), vol);
    const onMass = CA.blendOnMass(API_PAIR.map((c) => c.api), mass);
    return {
      label: 'A 20 API crude and a 40 API crude, 50 and 50', sg: b.properties.sg, api: b.properties.api,
      onVolume, minusOnVolume: d4(b.properties.api, onVolume), onMass, minusOnMass: d4(b.properties.api, onMass),
    };
  })();
  const row = (label, ids, shares) => {
    const r = blendOf(ids, shares);
    return {
      label, sg: r.sg.value, api: r.api.value, onVolume: r.api.onVolume, minusOnVolume: r.api.minusOnVolume,
      onMass: r.api.onMass, minusOnMass: r.api.minusOnMass,
    };
  };
  return [
    pair,
    row('Obigbo Light and Egbema Medium, 65 and 35', ['obl', 'egm'], [65, 35]),
    row('Asarama Heavy and Ubie Condensate, 50 and 50', ['ash', 'ubc'], [50, 50]),
    row('Obigbo Light, Egbema Medium and Asarama Heavy, 50, 30 and 20', ['obl', 'egm', 'ash'], [50, 30, 20]),
  ];
};

/** SECTION 5: the same three crudes given by volume and by mass. */
export const volumeAndMass = () => ({
  byVolume: blendOf(['obl', 'egm', 'ash'], [50, 30, 20]),
  byMass: blendOf(['obl', 'egm', 'ash'], [50, 30, 20], { byMass: true }),
});

/** SECTION 7: a blank, a typed zero, and what blendCrudes refuses, each asked as the dump asks it. */
export const blanksAndRefusals = () => {
  const obl = { ...LIBRARY.obl, volumeFraction: 65 };
  const egm = { ...LIBRARY.egm, volumeFraction: 35 };
  const ask = (label, comps) => {
    const r = CA.blendCrudes(comps);
    return { label, ok: !r.error, reason: r.error || null };
  };
  return {
    both: exportBlend(),
    blankSulfur: blendOf(['obl', 'egm'], [65, 35], { blank: { id: 'egm', key: 'sulfurWtPct' } }),
    zeroSulfur: (() => {
      const b = CA.blendCrudes([obl, { ...egm, sulfurWtPct: 0 }]);
      return {
        sg: b.properties.sg, api: b.properties.api, sulfurWtPct: b.properties.sulfurWtPct, tanMgKohG: b.properties.tanMgKohG,
        vanadiumPpm: b.properties.vanadiumPpm, viscosityCSt: b.properties.viscosityCSt, basis: b.bases.sulfurWtPct,
        missingCount: Object.keys(b.missing).length,
      };
    })(),
    blankViscosity: blendOf(['obl', 'egm'], [65, 35], { blank: { id: 'egm', key: 'viscosityCSt' } }),
    refusals: [
      ask('an empty list', []),
      ask('Egbema Medium with no API and no specific gravity', [obl, { ...egm, api: undefined }]),
      ask('one crude by volume, the other by mass', [obl, { ...LIBRARY.egm, massFraction: 35 }]),
      ask('one crude with a share, the other with none', [{ ...LIBRARY.obl, massFraction: 65 }, { ...LIBRARY.egm }]),
      ask('a share of -10', [{ ...LIBRARY.obl, volumeFraction: 110 }, { ...LIBRARY.egm, volumeFraction: -10 }]),
      ask('shares of 0 and 0', [{ ...LIBRARY.obl, volumeFraction: 0 }, { ...LIBRARY.egm, volumeFraction: 0 }]),
    ],
    normalised: [[65, 35], [13, 7], [650000, 350000]].map(([a, b]) => {
      const r = blendOf(['obl', 'egm'], [a, b]);
      return { shares: [a, b], api: r.api.value, sulfurWtPct: r.massProperties[0].value };
    }),
  };
};

/** SECTION 8: the Refutas index, its constants, its domain and three blends. */
export const refutas = () => {
  const B = CA.viscosityBlendIndex(Math.E - 0.8);
  const floorNu = CA.viscosityFromBlendIndex(-1e6);
  const outside = CA.blendCrudes([{ ...LIBRARY.obl, volumeFraction: 65 }, { ...LIBRARY.egm, viscosityCSt: 0.15, volumeFraction: 35 }]);
  return {
    crudes: OBIGBO_LIBRARY.map((c) => {
      const i = CA.viscosityBlendIndex(c.viscosityCSt);
      return { name: c.name, viscosityCSt: c.viscosityCSt, index: i, back: CA.viscosityFromBlendIndex(i) };
    }),
    blends: [
      ['Obigbo export blend, 65 and 35', ['obl', 'egm'], [65, 35]],
      ['Asarama Heavy and Ubie Condensate, 50 and 50', ['ash', 'ubc'], [50, 50]],
      ['Egbema Medium and Asarama Heavy, 50 and 50', ['egm', 'ash'], [50, 50]],
    ].map(([label, ids, shares]) => ({ label, ...blendOf(ids, shares).viscosity })),
    B,
    A: CA.viscosityBlendIndex(Math.exp(Math.E) - 0.8) - B,
    offset: 1 - floorNu,
    floor: floorNu,
    domain: PROBES.viscosityDomain.map((v) => ({ viscosityCSt: v, index: CA.viscosityBlendIndex(v) })),
    outsideBasis: outside.bases.viscosityCSt,
    outsideValue: outside.properties.viscosityCSt,
    outsideApi: outside.properties.api,
    outsideSulfur: outside.properties.sulfurWtPct,
  };
};

/** The Refutas index across a viscosity range, drawn by the engine. */
export const refutasCurve = () => [0.3, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].map((v) => ({ viscosityCSt: v, index: CA.viscosityBlendIndex(v) }));

// ---------------------------------------------------------------------------
// SECTIONS 9 AND 10: the curve between and outside its points, and cut yields.
// ---------------------------------------------------------------------------
export const curveProbes = () => ({
  temps: PROBES.curveTemps.flatMap(([id, ts]) => ts.map((t) => ({ id, name: LIBRARY[id].name, temperatureF: t, volumePercent: CA.volumePercentAt(LIBRARY[id].curve, t) }))),
  volumes: PROBES.curveVolumes.flatMap(([id, vs]) => vs.map((v) => ({ id, name: LIBRARY[id].name, volumePercent: v, temperatureF: CA.temperatureAtVolumePercent(LIBRARY[id].curve, v) }))),
});

/**
 * One crude's curve for a chart: the measured points marked, and the engine
 * read every 20 F from 0 to 1600 F. Where the engine answers null the point is
 * carried as unknown, so a panel draws the region beyond a partial curve as
 * unknown and never joins across it.
 */
export const curvePlot = (id) => {
  const c = LIBRARY[id];
  if (!c) return null;
  const sampled = [];
  for (let t = 0; t <= 1600; t += 20) sampled.push({ temperatureF: t, volumePercent: CA.volumePercentAt(c.curve, t) });
  const known = sampled.filter((p) => p.volumePercent !== null);
  return {
    id,
    name: c.name,
    measured: c.curve,
    sampled,
    unknownBelowF: sampled[0].volumePercent === null ? known[0]?.temperatureF ?? null : null,
    unknownAboveF: sampled[sampled.length - 1].volumePercent === null ? known[known.length - 1]?.temperatureF ?? null : null,
  };
};

/** SECTION 10: one crude's cut set as bands, each cut's yield, the total and whether it closes. */
export const cutsOf = (id, cuts = STUDIO_CUTS) => {
  const c = LIBRARY[id];
  if (!c) return null;
  const y = CA.cutYields({ curve: c.curve, cuts });
  return { id, name: c.name, ...y };
};

export const cutSets = () => ({
  cuts: STUDIO_CUTS,
  crudes: [...OBIGBO_LIBRARY, EBOCHA_PARTIAL].map((c) => cutsOf(c.id)),
  inside: cutsOf('ebp', PROBES.insideCuts),
  inverted: cutsOf('obl', [PROBES.invertedCut]),
});

// ---------------------------------------------------------------------------
// SECTION 11: the stability screen.
// ---------------------------------------------------------------------------
export const stability = () => {
  const probe = (hi, lo) => CA.screenBlendStability({ components: [{ name: 'light', api: hi }, { name: 'heavy', api: lo }], massFractions: [0.5, 0.5] });
  const bisect = (make) => {
    let lo = 0;
    let hi = 60;
    for (let i = 0; i < 200; i += 1) {
      const m = (lo + hi) / 2;
      if (make(m).stable === false) hi = m; else lo = m;
    }
    return hi;
  };
  const blind = CA.screenBlendStability({ components: [{ name: 'x' }, { name: 'y', api: 30 }], massFractions: [0.5, 0.5] });
  return {
    bands: { ...CA.CII_BANDS },
    alone: OBIGBO_LIBRARY.map((c) => ({ name: c.name, cii: CA.colloidalInstabilityIndex(c.sara) })),
    pairs: OBIGBO_STABILITY_PAIRS.map((p) => ({ label: p.label, shares: p.shares, ...blendOf(p.ids, p.shares).stability })),
    probes: PROBES.gravityScreen.map(([what, hi, lo]) => {
      const st = probe(hi, lo);
      return { what, lighter: hi, heavier: lo, contrast: st.contrast, stable: st.stable, verdict: verdictWord(st.stable) };
    }),
    thresholds: {
      contrast: bisect((d) => probe(45, 45 - d)),
      lighter: bisect((a) => probe(a, a - 25)),
    },
    noSara: [
      ['Asarama Heavy and Ubie Condensate, 50 and 50', blendOf(['ash', 'ubc'], [50, 50], { dropSara: true }).stability],
      ['Obigbo export blend, 65 and 35', blendOf(['obl', 'egm'], [65, 35], { dropSara: true }).stability],
      ['a crude with no API and no SG beside one of 30 API (screenBlendStability called on its own)', {
        basis: blind.basis, contrast: null, stable: blind.stable, verdict: verdictWord(blind.stable), message: blind.message,
      }],
    ].map(([label, st]) => ({ label, ...st })),
    partialSara: blendOf(['obl', 'egm'], [65, 35], { blank: { id: 'egm', key: 'sara' } }).stability,
  };
};

// ---------------------------------------------------------------------------
// SECTIONS 13 TO 18: KWALE, the blended barrel and what it is worth.
// ---------------------------------------------------------------------------

const kwaleComps = (shareLight = KWALE_SHARES.kwl) => [
  { ...KWALE_LIGHT, volumeFraction: shareLight },
  { ...UGHELLI_MEDIUM, volumeFraction: 100 - shareLight },
];

/** The cut set from four cut points, the names and ids of Kwale's own cuts. */
export const KWALE_CUT_POINTS = [KWALE_CUTS[0].toF, KWALE_CUTS[1].toF, KWALE_CUTS[2].toF, KWALE_CUTS[3].toF];
export const cutsFromPoints = (points) => KWALE_CUTS.map((c, i) => ({
  ...c,
  fromF: i === 0 ? null : points[i - 1],
  toF: i === KWALE_CUTS.length - 1 ? null : points[i],
}));

/** How far a cut point may be dragged: ten degrees short of its neighbours, so the cuts stay in order. */
export const cutPointRange = (points, i) => ({
  min: i === 0 ? 40 : points[i - 1] + 10,
  max: i === points.length - 1 ? 1100 : points[i + 1] - 10,
});

/** T50 read four ways, the engine's first. */
const t50Readings = (comps, blend, crv) => {
  const t50 = CA.temperatureAtVolumePercent(crv, 50);
  const gridPoint = crv.find((p) => p.volumePercent >= 50);
  const grid = gridPoint ? gridPoint.temperatureF : null;
  const each = comps.map((c) => CA.temperatureAtVolumePercent(c.curve, 50));
  const volMean = CA.blendOnVolume(each, blend.fractions.map((f) => f.volumeFraction));
  const massMean = CA.blendOnMass(each, blend.fractions.map((f) => f.massFraction));
  return {
    t50,
    grid,
    componentT50: each,
    volumeMean: volMean,
    massMean,
    gridMinusEngine: d4(grid, t50),
    volumeMeanMinusEngine: d4(volMean, t50),
    massMeanMinusEngine: d4(massMean, t50),
    watsonK: CA.watsonK({ meanBoilingPointF: t50, sg: blend.properties.sg }),
    watsonKAtGrid: grid === null ? null : CA.watsonK({ meanBoilingPointF: grid, sg: blend.properties.sg }),
    sg: blend.properties.sg,
  };
};

/** The Kwale blend at a share of Kwale Light, its own curve beside its two crudes' curves. */
export const kwaleBlend = (shareLight = KWALE_SHARES.kwl) => {
  const comps = kwaleComps(shareLight);
  const b = CA.blendCrudes(comps);
  if (b.error) return { error: b.error };
  const vol = b.fractions.map((f) => f.volumeFraction);
  const crv = CA.blendDistillationCurves(comps, vol);
  return {
    shareLight,
    shareMedium: 100 - shareLight,
    crudes: KWALE_CRUDES.map((c) => ({ id: c.id, name: c.name, api: c.api, sg: CA.sgFromApi(c.api), sulfurWtPct: c.sulfurWtPct, curve: c.curve })),
    api: b.properties.api,
    sg: b.properties.sg,
    sulfurWtPct: b.properties.sulfurWtPct,
    sulfurBasis: b.bases.sulfurWtPct,
    fractions: b.fractions,
    curve: crv,
    table: crv.map((p) => ({
      temperatureF: p.temperatureF,
      light: CA.volumePercentAt(KWALE_LIGHT.curve, p.temperatureF),
      medium: CA.volumePercentAt(UGHELLI_MEDIUM.curve, p.temperatureF),
      blend: p.volumePercent,
    })),
    measuredTemperatures: new Set(KWALE_CRUDES.flatMap((c) => c.curve.map((p) => p.temperatureF))).size,
    t50: t50Readings(comps, b, crv),
    points: PROBES.kwaleCurvePercents.map((v) => ({ volumePercent: v, temperatureF: CA.temperatureAtVolumePercent(crv, v) })),
  };
};

/** A partial assay in a blend: Kwale Light and the Ebocha partial assay, the temperatures it drops marked. */
export const kwalePartial = () => {
  const comps = KWALE_CRUDES.filter((c) => KWALE_WITH_PARTIAL_SHARES[c.id] !== undefined)
    .concat([EBOCHA_PARTIAL])
    .map((c) => ({ ...c, volumeFraction: KWALE_WITH_PARTIAL_SHARES[c.id] }));
  const b = CA.blendCrudes(comps);
  const crv = CA.blendDistillationCurves(comps, b.fractions.map((f) => f.volumeFraction));
  const all = [...new Set(comps.flatMap((c) => c.curve.map((p) => p.temperatureF)))].sort((x, y) => x - y);
  const kept = new Set(crv.map((p) => p.temperatureF));
  const y = CA.cutYields({ curve: crv, cuts: KWALE_CUTS });
  const v = KWALE_VALUATION;
  const nb = CA.netbackValue({ cuts: y.cuts, prices: v.prices, processingCostPerBbl: v.processingCostPerBbl, freightPerBbl: v.freightPerBbl, lossPercent: v.lossPercent });
  return {
    names: comps.map((c) => c.name),
    curve: crv,
    measured: all.length,
    dropped: all.filter((t) => !kept.has(t)),
    yields: y,
    netback: nb.netback,
    unyieldedCuts: nb.unyieldedCuts,
    complete: nb.complete,
  };
};

/** SECTION 14 for the studio's default pair, 60 and 40, what the app opens on. */
export const studioPair = () => {
  const b = CA.blendCrudes(STUDIO_PAIR);
  const crv = CA.blendDistillationCurves(STUDIO_PAIR, b.fractions.map((f) => f.volumeFraction));
  const y = CA.cutYields({ curve: crv, cuts: STUDIO_CUTS });
  const nb = CA.netbackValue({ cuts: y.cuts, ...STUDIO_VALUATION });
  return {
    api: b.properties.api,
    sulfurWtPct: b.properties.sulfurWtPct,
    sulfurBasis: b.bases.sulfurWtPct,
    t50: t50Readings(STUDIO_PAIR, b, crv),
    yields: y,
    grossValue: nb.grossValue,
    netback: nb.netback,
    stabilityBasis: b.stability.basis,
  };
};

/** Watson K's offset and what it declines. */
export const watson = () => ({
  rankineOffset: CA.watsonK({ meanBoilingPointF: 0, sg: 1 }) ** 3,
  atMinus500: CA.watsonK({ meanBoilingPointF: -500, sg: 0.85 }),
  atSgZero: CA.watsonK({ meanBoilingPointF: 600, sg: 0 }),
});

/**
 * SECTION 15: the blend's cut yields on a cut set drawn from four cut points.
 * Beside each blend yield, each crude's own yield, the volume-weighted and
 * mass-weighted sums of those, and the change from the refinery's own cut
 * points, so moving one point shows barrels moving between two cuts only.
 */
export const kwaleCuts = (points = KWALE_CUT_POINTS, shareLight = KWALE_SHARES.kwl) => {
  const comps = kwaleComps(shareLight);
  const b = CA.blendCrudes(comps);
  const vol = b.fractions.map((f) => f.volumeFraction);
  const mass = b.fractions.map((f) => f.massFraction);
  const crv = CA.blendDistillationCurves(comps, vol);
  const cuts = cutsFromPoints(points);
  const y = CA.cutYields({ curve: crv, cuts });
  const base = CA.cutYields({ curve: crv, cuts: KWALE_CUTS });
  const light = CA.cutYields({ curve: KWALE_LIGHT.curve, cuts });
  const medium = CA.cutYields({ curve: UGHELLI_MEDIUM.curve, cuts });
  return {
    points,
    shareLight,
    rows: y.cuts.map((r, i) => {
      const each = [light.cuts[i].yieldVolPercent, medium.cuts[i].yieldVolPercent];
      const known = each.every((v) => v !== null);
      const onVolume = known ? CA.blendOnVolume(each, vol) : null;
      return {
        ...r,
        light: each[0],
        medium: each[1],
        onVolume,
        blendMinusOnVolume: d4(r.yieldVolPercent, onVolume),
        onMass: known ? CA.blendOnMass(each, mass) : null,
        base: base.cuts[i].yieldVolPercent,
        change: d4(r.yieldVolPercent, base.cuts[i].yieldVolPercent),
      };
    }),
    total: y.totalVolPercent,
    totalChange: d4(y.totalVolPercent, base.totalVolPercent),
    lightTotal: light.totalVolPercent,
    mediumTotal: medium.totalVolPercent,
    closes: y.closes,
    unknownCuts: y.unknownCuts,
    cuts: y.cuts,
    studioCuts: CA.cutYields({ curve: crv, cuts: STUDIO_CUTS }),
  };
};

/**
 * SECTIONS 16 AND 17: the netback, every term, and the waterfall a panel draws
 * from it. Options leave a cost or a price blank, or change the loss.
 */
export const netback = ({
  shareLight = KWALE_SHARES.kwl, points = KWALE_CUT_POINTS, blankFreight = false, blankLosses = false,
  blankPrice = null, lossPercent = KWALE_VALUATION.lossPercent,
} = {}) => {
  const v = KWALE_VALUATION;
  const cuts = kwaleCuts(points, shareLight).cuts;
  const prices = { ...v.prices };
  if (blankPrice) delete prices[blankPrice];
  const r = CA.netbackValue({
    cuts,
    prices,
    processingCostPerBbl: v.processingCostPerBbl,
    freightPerBbl: blankFreight ? '' : v.freightPerBbl,
    lossPercent: blankLosses ? undefined : lossPercent,
    marker: v.marker,
  });
  if (r.error) return { error: r.error };
  const lossAfter = (r.grossValue - r.processingCostPerBbl - r.freightPerBbl) * (1 - (blankLosses ? 0 : lossPercent) / 100);
  const lossLeftOut = r.grossValue - r.processingCostPerBbl - r.freightPerBbl;
  const afterLoss = r.grossValue - r.lossValue;
  const afterProcessing = afterLoss - r.processingCostPerBbl;
  return {
    ...r,
    lossPercent: blankLosses ? null : lossPercent,
    lossesAfterCosts: lossAfter,
    lossesAfterCostsMinusEngine: d4(lossAfter, r.netback),
    lossesLeftOut: lossLeftOut,
    lossesLeftOutMinusEngine: d4(lossLeftOut, r.netback),
    // The waterfall, each step from where the one before it stopped. The
    // running levels are the engine's own terms taken in the engine's order.
    // `low` and `span` are the bar a chart draws, so a panel does no arithmetic.
    waterfall: [
      { step: 'gross product value', from: 0, to: r.grossValue, value: r.grossValue },
      { step: 'lost to losses, on the product side', from: r.grossValue, to: afterLoss, value: -r.lossValue },
      { step: 'processing', from: afterLoss, to: afterProcessing, value: -r.processingCostPerBbl },
      { step: 'freight', from: afterProcessing, to: r.netback, value: -r.freightPerBbl },
      { step: 'netback', from: 0, to: r.netback, value: r.netback },
      { step: 'marker netback', from: 0, to: r.marker.netback, value: r.marker.netback },
      { step: 'differential against the marker', from: r.marker.netback, to: r.netback, value: r.marker.differential },
    ].map((w) => ({ ...w, low: Math.min(w.from, w.to), span: Math.abs(w.to - w.from) })),
  };
};

/** SECTION 17: each crude alone on the same cut set, prices, costs and losses as the blend. */
export const marker = () => {
  const v = KWALE_VALUATION;
  const nb = (crv) => CA.netbackValue({
    cuts: CA.cutYields({ curve: crv, cuts: KWALE_CUTS }).cuts, prices: v.prices, processingCostPerBbl: v.processingCostPerBbl,
    freightPerBbl: v.freightPerBbl, lossPercent: v.lossPercent, marker: v.marker,
  });
  const light = nb(KWALE_LIGHT.curve);
  const medium = nb(UGHELLI_MEDIUM.curve);
  const blend = netback();
  const vol = kwaleBlend().fractions.map((f) => f.volumeFraction);
  const mean = CA.blendOnVolume([light.netback, medium.netback], vol);
  return {
    marker: v.marker,
    rows: [
      { label: 'Kwale Light alone', grossValue: light.grossValue, netback: light.netback, differential: light.marker.differential },
      { label: 'Ughelli Medium alone', grossValue: medium.grossValue, netback: medium.netback, differential: medium.marker.differential },
      { label: 'the blend, 55 and 45', grossValue: blend.grossValue, netback: blend.netback, differential: blend.marker.differential },
    ],
    volumeMean: mean,
    blendMinusMean: d4(blend.netback, mean),
    refusals: PROBES.lossRefusals.map((loss) => {
      const r = CA.netbackValue({ cuts: kwaleCuts().cuts, prices: v.prices, lossPercent: loss });
      return { label: `losses of ${loss} percent`, ok: !r.error, reason: r.error || null };
    }),
    d86: (() => {
      const d86 = PROBES.d86.map(([volumePercent, temperatureF]) => ({ volumePercent, temperatureF }));
      const none = CA.d86ToTbp(d86, null);
      const no50 = CA.d86ToTbp(d86.filter((p) => p.volumePercent !== 50), { fifty: { a: 1, b: 1 }, differences: [] });
      return [
        { label: 'a D86 curve and no coefficients', ok: !none.error, reason: none.error || null },
        { label: 'a D86 curve with no 50 percent point, and a table', ok: !no50.error, reason: no50.error || null },
      ];
    })(),
  };
};

// ---------------------------------------------------------------------------
// SECTION 19: the textbook LP, in two dimensions.
// ---------------------------------------------------------------------------

/**
 * The textbook LP at right-hand sides b. Its optimum and row prices from the
 * kernel, each row raised by one and re-solved, and the feasible region's
 * vertices FOUND BY THE KERNEL: it is asked to maximise in 72 directions and
 * every distinct optimum is a vertex. No vertex is solved for by hand.
 */
export const textbook = (b = TEXTBOOK_LP.b) => {
  const tb = { ...TEXTBOOK_LP, b: [...b] };
  const r = LP.solveLP(tb);
  const raised = [0, 1].map((k) => {
    const b2 = tb.b.map((v, i) => (i === k ? v + 1 : v));
    const r2 = LP.solveLP({ ...tb, b: b2 });
    return { row: k + 1, rhs: b2[k], objective: r2.objective, change: d4(r2.objective, r.objective) };
  });
  const found = new Map();
  for (let k = 0; k < 72; k += 1) {
    const a = (2 * Math.PI * k) / 72;
    const s = LP.solveLP({ ...tb, c: [Math.cos(a), Math.sin(a)], maximize: true });
    if (s.status === 'optimal') {
      const x = Math.round(s.x[0] * 1e9) / 1e9 + 0;
      const y = Math.round(s.x[1] * 1e9) / 1e9 + 0;
      const key = `${x},${y}`;
      if (!found.has(key)) found.set(key, { x, y, angle: a });
    }
  }
  const vertices = [...found.values()].sort((p, q) => p.angle - q.angle).map(({ x, y }) => {
    const at = LP.solveLP({ ...tb, lo: [x, y], hi: [x, y] });
    return { x, y, objective: at.objective, status: at.status };
  });
  const opt = r.status === 'optimal' ? r.objective : null;
  return {
    b: tb.b,
    c: tb.c,
    A: tb.A,
    status: r.status,
    x: r.x,
    objective: r.objective,
    shadowPrices: r.shadowPrices,
    iterations: r.iterations,
    raised,
    vertices,
    // The objective line through the optimum, drawn where it meets the axes.
    objectiveLine: opt === null ? null : [{ x: opt / tb.c[0], y: 0 }, { x: 0, y: opt / tb.c[1] }],
  };
};

/** The textbook LP with one right-hand side dragged: the re-solved change beside the row price times the step. */
export const textbookDrag = (row, rhs) => {
  const base = textbook();
  const b = TEXTBOOK_LP.b.map((v, i) => (i === row ? rhs : v));
  const moved = textbook(b);
  const step = rhs - TEXTBOOK_LP.b[row];
  return {
    row: row + 1,
    rhs,
    step,
    base,
    moved,
    change: moved.objective === null ? null : moved.objective - base.objective,
    priceTimesStep: base.shadowPrices[row] * step,
  };
};

export const lpCases = () => {
  const fixed = [...PROBES.textbookFixedPoints, (() => { const t = LP.solveLP(TEXTBOOK_LP); return t.x; })()].map(([x, y]) => {
    const r = LP.solveLP({ ...TEXTBOOK_LP, lo: [x, y], hi: [x, y] });
    return { x, y, objective: r.status === 'optimal' ? r.objective : null, status: r.status };
  });
  const three = LP.solveLP({ c: [3, 2], A: [[1, 1], [0, 1]], b: [2, 2], ops: ['<=', '>='], maximize: true });
  let malformed = null;
  try { LP.solveLP({ c: [1, 1], A: [[1]], b: [1] }); } catch (e) { malformed = e.message; }
  return {
    fixed,
    statuses: [
      { problem: 'minimise x + y with x + y <= 2 and x + y >= 3', status: LP.solveLP({ c: [1, 1], A: [[1, 1], [1, 1]], b: [2, 3], ops: ['<=', '>='] }).status },
      { problem: 'maximise x with x - y <= 1 (y unbounded above)', status: LP.solveLP({ c: [1, 0], A: [[1, -1]], b: [1], ops: ['<='], maximize: true }).status },
      { problem: 'minimise x with a lower bound of 5 above an upper bound of 3', status: LP.solveLP({ c: [1], A: [[1]], b: [10], ops: ['<='], lo: [5], hi: [3] }).status },
      { problem: 'maximise 3x + 2y with x + y <= 2 and y >= 2', status: three.status, objective: three.objective },
    ],
    malformed,
    statusWords: { ...LP.LP_STATUS },
  };
};

// ---------------------------------------------------------------------------
// SECTIONS 20 TO 26: APAPA, the least-cost recipe.
// ---------------------------------------------------------------------------

/** How each basis becomes a row's weights, in the digest's words. */
export const ROW_BASES = [
  ['volume', 'the property', '1'],
  ['mass', 'SG x the property', 'SG'],
  ['index, on volume (RVP)', "the property's index", '1'],
  ['index, on mass (viscosity)', "SG x the property's index", 'SG'],
];

export const blendingRules = () => ({
  exponent: PB.RVP_INDEX_EXPONENT,
  tolerance: PB.BINDING_TOLERANCE,
  rvp: [3.2, 6.2, 9, 12.9, 52.8].map((v) => ({ rvp: v, index: PB.rvpIndex(v), back: PB.rvpFromIndex(PB.rvpIndex(v)) })),
  templates: Object.values(PB.SPEC_TEMPLATES).map((t) => ({
    id: t.id,
    name: t.name,
    specs: t.specs.map((s) => ({
      id: s.id, name: s.name,
      basis: s.basis + (s.basis === PB.BLEND_BASIS.INDEX ? (s.indexOnMass ? ', on mass' : ', on volume') : ''),
      min: s.min ?? null, max: s.max ?? null, unit: s.unit || null,
    })),
  })),
});

const PMS_SPECS = PB.SPEC_TEMPLATES.gasoline_50ppm.specs;
const AGO_SPECS = PB.SPEC_TEMPLATES.diesel_50ppm.specs;

/** The specification ids a learner may move, with the bound each one has. */
export const PMS_LIMITS = PMS_SPECS.flatMap((s) => [['min', s.min], ['max', s.max]]
  .filter(([, v]) => v !== undefined)
  .map(([bound, v]) => ({ id: s.id, name: s.name, bound, value: v, unit: s.unit || '', basis: s.basis })));

/**
 * The PMS pool asked with every control a panel offers. `limits` moves a
 * template limit ({ 'sulfurPpm.max': 51 }); `butaneMax` types butane's
 * availability (a number, 0, or '' for no limit); `blank` leaves one
 * component's figure blank ({ id, key }), which is how a blank cost is refused
 * and a blank sulfur or SG skips a specification; `isoFloor` sets a minimum.
 */
export const pmsComponents = ({ butaneMax, blank = null, isoFloor = null } = {}) => APAPA_PMS_POOL.map((c) => {
  let x = { ...c };
  if (butaneMax !== undefined && c.id === 'but') x.maxVolume = butaneMax;
  if (isoFloor !== null && c.id === 'iso') x.minVolume = isoFloor;
  if (blank && blank.id === c.id) {
    x = { ...x };
    if (blank.key === 'density') { delete x.sg; delete x.api; } else x[blank.key] = blank.key === 'cost' ? '' : undefined;
  }
  return x;
});

export const pmsSpecs = (limits = {}, template = 'gasoline_50ppm') => PB.SPEC_TEMPLATES[template].specs.map((s) => {
  let x = s;
  ['min', 'max'].forEach((bound) => {
    const k = `${s.id}.${bound}`;
    if (limits[k] !== undefined && s[bound] !== undefined) x = { ...x, [bound]: limits[k] };
  });
  return x;
});

/** A recipe with its reading: components at their availability, and each row's scale. */
const readRecipe = (components, r) => {
  if (!r || r.status !== 'optimal') {
    return { status: r ? r.status : 'none', error: r ? r.error || null : null, skippedSpecs: r?.skippedSpecs || [] };
  }
  const vols = r.recipe.map((x) => x.volume);
  const massScale = components.every((c) => given(c.sg))
    ? CA.blendOnVolume(components.map((c) => c.sg), vols) : null;
  return {
    ...r,
    atAvailability: r.recipe.filter((x) => {
      const cap = components.find((c) => c.id === x.id).maxVolume;
      return given(cap) && Math.abs(x.volume - Number(cap)) < 1e-6;
    }).map((x) => x.name),
    atZero: r.recipe.filter((x) => Math.abs(x.volume) < 1e-9).map((x) => x.name),
    massScale,
    marginalMinusAverage: d4(r.shadowPrices[0].price, r.unitCost),
  };
};

export const pmsRecipe = ({
  limits = {}, butaneMax, blank = null, isoFloor = null, template = 'gasoline_50ppm',
} = {}) => {
  const components = pmsComponents({ butaneMax, blank, isoFloor });
  const r = PB.optimiseBlend({ components, specs: pmsSpecs(limits, template), targetVolume: APAPA_PMS_TARGET });
  return { components, ...readRecipe(components, r) };
};

/** SECTION 20: propertyOfBlend on the finished recipe beside what optimiseBlend reported. */
export const propertyCheck = () => {
  const r = pmsRecipe();
  const vols = r.recipe.map((x) => x.volume);
  return r.achieved.map((a) => {
    const again = PB.propertyOfBlend({ components: APAPA_PMS_POOL, volumes: vols, spec: PMS_SPECS.find((s) => s.id === a.id) });
    return { name: a.name, achieved: a.value, again, difference: d4(again, a.value) };
  });
};

/** SECTION 22: giveaway and what it is worth where a unit has a price. */
export const giveaway = (unitValues = PROBES.giveawayUnitValues) => {
  const r = pmsRecipe();
  const rows = PB.valueGiveaway({ achieved: r.achieved, totalVolume: r.totalVolume, unitValues });
  return { rows, notListed: r.achieved.filter((a) => !rows.some((g) => g.id === a.id)).map((a) => a.name) };
};

/**
 * SECTION 23: relief checked by re-solving. The limit is moved to newLimit and
 * the recipe re-solved; the saving is the money that move actually saved, and
 * beside it the shadow price times the relief, which is what the derivative
 * predicts. A learner drags the limit and watches the two part.
 */
export const reliefResolve = (id, bound, newLimit, base = pmsRecipe()) => {
  const spec = PMS_SPECS.find((s) => s.id === id);
  const sp = base.shadowPrices.find((s) => s.specId === id && s.bound === bound);
  const moved = pmsRecipe({ limits: { [`${id}.${bound}`]: newLimit } });
  const relief = bound === 'max' ? newLimit - spec[bound] : spec[bound] - newLimit;
  return {
    id,
    bound,
    name: sp.name,
    per: sp.per,
    limit: spec[bound],
    newLimit,
    relief,
    price: sp.price,
    rowPrice: sp.rowPrice,
    status: moved.status,
    totalCost: moved.status === 'optimal' ? moved.totalCost : null,
    saving: moved.status === 'optimal' ? d4(base.totalCost, moved.totalCost) : null,
    predicted: sp.price * relief,
  };
};

/** How far a panel lets a learner drag each PMS limit: [low, high, step]. */
export const LIMIT_RANGES = {
  'sulfurPpm.max': [30, 70, 1],
  'rvp.max': [7, 11, 0.1],
  'ron.min': [88, 95, 0.1],
  'mon.min': [78, 85, 0.1],
  'density.max': [0.75, 0.8, 0.001],
  'density.min': [0.7, 0.75, 0.001],
};

/**
 * The re-solved saving and the derivative's prediction across the drag range
 * of one limit, for a chart: the two agree at the optimum and part as the
 * relief grows, because the rows move non-linearly in the limit and the
 * optimal vertex can change.
 */
export const reliefSweep = (id, bound, points = 11) => {
  const range = LIMIT_RANGES[`${id}.${bound}`];
  if (!range) return null;
  const base = pmsRecipe();
  const [lo, hi] = range;
  return Array.from({ length: points }, (_, i) => {
    const limit = Number((lo + ((hi - lo) * i) / (points - 1)).toFixed(6));
    const r = reliefResolve(id, bound, limit, base);
    return {
      limit, saving: r.saving, predicted: r.predicted, status: r.status,
    };
  });
};

/** The blanks a learner may leave on one PMS component, each as the engine is asked it. */
export const PMS_BLANKS = [
  ['', 'nothing left blank', null],
  ['iso.cost', "Isomerate's cost", { id: 'iso', key: 'cost' }],
  ['iso.sulfurPpm', "Isomerate's sulfur figure", { id: 'iso', key: 'sulfurPpm' }],
  ['fcc.density', "FCC gasoline's SG and API", { id: 'fcc', key: 'density' }],
];

export const relief = () => {
  const base = pmsRecipe();
  const sp = (n) => base.shadowPrices.find((s) => s.name === n);
  const sulfur = sp('Sulfur maximum');
  const rvp = sp('RVP maximum');
  const rvpLimit = PMS_SPECS.find((s) => s.id === 'rvp').max;
  const perIndex = rvp.rowPrice * base.totalVolume;
  const plus = PB.optimiseBlend({ components: APAPA_PMS_POOL, specs: PMS_SPECS, targetVolume: APAPA_PMS_TARGET + 1 });
  return {
    rows: base.shadowPrices,
    sulfurScale: base.massScale,
    sulfurRowTimesScale: sulfur.rowPrice * base.massScale,
    sulfurPrice: sulfur.price,
    rvpPerIndex: perIndex,
    rvpPrice: rvp.price,
    rvpIndexSlope: rvp.price / -perIndex,
    rvpSlopeFromExponent: PB.RVP_INDEX_EXPONENT * rvpLimit ** (PB.RVP_INDEX_EXPONENT - 1),
    rvpLimit,
    resolves: PROBES.reliefResolves.map(([id, bound, lim]) => reliefResolve(id, bound, lim, base)),
    marginal: {
      volumeRowPrice: base.shadowPrices[0].price,
      unitCost: base.unitCost,
      marginalMinusAverage: base.marginalMinusAverage,
      resolvedTarget: APAPA_PMS_TARGET + 1,
      resolvedStep: d4(plus.totalCost, base.totalCost),
    },
    nonBinding: base.achieved.filter((a) => !a.binding).map((a) => a.name),
  };
};

/** SECTION 24: the AGO pool, viscosity through the Refutas index on mass, and on volume for contrast. */
export const agoRecipe = ({ indexOnMass = true } = {}) => {
  const specs = indexOnMass ? AGO_SPECS : AGO_SPECS.map((s) => (s.id === 'viscosityCSt' ? { ...s, indexOnMass: false } : s));
  const r = readRecipe(APAPA_AGO_POOL, PB.optimiseBlend({ components: APAPA_AGO_POOL, specs, targetVolume: APAPA_AGO_TARGET }));
  if (r.status !== 'optimal') return r;
  const vols = r.recipe.map((x) => x.volume);
  const viscSpec = AGO_SPECS.find((s) => s.id === 'viscosityCSt');
  return {
    ...r,
    bySpec: r.achieved.map((a) => {
      const sps = r.shadowPrices.filter((s) => s.specId === a.id);
      const shown = sps.find((s) => Math.abs(s.price) > 1e-9) || sps[0];
      return { ...a, price: shown.price, per: shown.per, row: shown.name };
    }),
    viscosityIndexOnMass: PB.propertyOfBlend({ components: APAPA_AGO_POOL, volumes: vols, spec: viscSpec }),
    viscosityIndexOnVolume: PB.propertyOfBlend({ components: APAPA_AGO_POOL, volumes: vols, spec: { ...viscSpec, indexOnMass: false } }),
    volumeRows: r.shadowPrices.filter((s) => s.kind === 'spec' && /Cetane|Density maximum/.test(s.name)).map((s) => ({
      ...s, scale: r.totalVolume, rowTimesScale: s.rowPrice * r.totalVolume,
    })),
  };
};

/** SECTION 25: infeasible, refused and skipped, every one as the engine returned it. */
export const refusedAndSkipped = () => {
  const t10 = PB.SPEC_TEMPLATES.gasoline_10ppm.specs;
  const t50 = PMS_SPECS;
  const moves = [];
  t10.forEach((x) => {
    const y = t50.find((z) => z.id === x.id);
    ['min', 'max'].forEach((key) => { if (x[key] !== undefined && x[key] !== y[key]) moves.push({ id: x.id, name: x.name, key, t10: x[key], t50: y[key] }); });
  });
  const solve = (specs, components = APAPA_PMS_POOL) => PB.optimiseBlend({ components, specs, targetVolume: APAPA_PMS_TARGET });
  const verdict = (label, r) => ({ label, status: r.status, ok: r.status === 'optimal', reason: r.error || null });
  return {
    infeasible: [
      verdict('Apapa PMS pool to the 10 ppm gasoline template', solve(t10)),
      verdict('Apapa PMS pool with a RON minimum of 99', solve(pmsSpecs({ 'ron.min': 99 }))),
    ],
    movedBack: moves.map((m) => ({ ...m, status: solve(t10.map((z) => (z.id === m.id ? { ...z, [m.key]: m.t50 } : z))).status })),
    tightened: moves.map((m) => ({ ...m, status: solve(t50.map((z) => (z.id === m.id ? { ...z, [m.key]: m.t10 } : z))).status })),
    availability: PROBES.butaneMaxima.map(([label, v]) => {
      const r = pmsRecipe({ butaneMax: v });
      return { label, status: r.status, butane: r.recipe.find((x) => x.id === 'but').volume, totalCost: r.totalCost, binding: r.bindingSpecs };
    }),
    refusals: [
      verdict('no components', PB.optimiseBlend({ components: [], specs: t50, targetVolume: APAPA_PMS_TARGET })),
      verdict('a target volume of 0', PB.optimiseBlend({ components: APAPA_PMS_POOL, specs: t50, targetVolume: 0 })),
      verdict('Isomerate with its cost left blank', solve(t50, pmsComponents({ blank: { id: 'iso', key: 'cost' } }))),
      verdict('Butane with a maximum of -50', solve(t50, pmsComponents({ butaneMax: -50 }))),
      verdict('Reformate with a minimum of 3000 and a maximum of 2000', solve(t50, APAPA_PMS_POOL.map((c) => (c.id === 'ref' ? { ...c, minVolume: 3000, maxVolume: 2000 } : c)))),
    ],
    skipped: [
      ['Isomerate with no sulfur figure', { id: 'iso', key: 'sulfurPpm' }],
      ['FCC gasoline with no SG and no API', { id: 'fcc', key: 'density' }],
    ].map(([label, blank]) => {
      const r = pmsRecipe({ blank });
      const sk = r.skippedSpecs[0];
      const dn = r.achieved.find((a) => a.id === 'density');
      return {
        label,
        status: r.status,
        totalCost: r.totalCost,
        skipped: sk.name,
        reason: sk.reason,
        skippedAchieved: r.achieved.find((a) => a.id === sk.id).value,
        densityApplied: dn.applied,
        density: dn.value,
      };
    }),
    floor: (() => {
      const r = pmsRecipe({ isoFloor: PROBES.isoFloor });
      const cap = APAPA_PMS_POOL.find((c) => c.id === 'but').maxVolume;
      const but = r.recipe.find((x) => x.id === 'but').volume;
      return {
        status: r.status,
        isomerate: r.recipe.find((x) => x.id === 'iso').volume,
        totalCost: r.totalCost,
        binding: r.bindingSpecs,
        sulfurRelief: r.shadowPrices.find((s) => s.name === 'Sulfur maximum').price,
        butane: but,
        butaneCap: cap,
        butaneAtCap: Math.abs(but - cap) < 1e-6,
      };
    })(),
  };
};

/** SECTION 26: what the Product Blending Optimizer shows with nothing typed. */
export const optimizerDefault = () => readRecipe(OPTIMIZER_DEFAULT_POOL, PB.optimiseBlend({
  components: OPTIMIZER_DEFAULT_POOL, specs: PMS_SPECS, targetVolume: OPTIMIZER_DEFAULT_TARGET,
}));

/** SECTION 27: the constants the engines state, and the three held items. */
export const constants = () => ({
  ciiStable: CA.CII_BANDS.STABLE,
  ciiUnstable: CA.CII_BANDS.UNSTABLE,
  rvpExponent: PB.RVP_INDEX_EXPONENT,
  bindingTolerance: PB.BINDING_TOLERANCE,
  refutasOfOne: CA.viscosityBlendIndex(1),
  water: CA.sgFromApi(10),
});

export const HELD = [
  ['L4', 'the LP kernel uses absolute tolerances on its pivots and on phase one', 'right for the barrel-scale problems the two apps pose; a problem scaled in millions is outside what it is shown to handle'],
  ['C12', 'the Refutas index blends on mass fraction', 'ASTM D7152 blends on volume; the two disagree, and the basis is a course and owner decision'],
  ['C13', "Watson K is taken at the blend's T50", 'a screening basis; the strict basis is the mean average boiling point'],
];

// ---------------------------------------------------------------------------
// The whole teaching surface, for the lab test and the zone gate.
// ---------------------------------------------------------------------------
export const teachingSurface = () => ({
  modules: modules(),
  gravity: gravity(),
  apiCurve: apiCurve(),
  library: library(),
  apiBlends: apiBlends(),
  volumeAndMass: volumeAndMass(),
  exportBlend: exportBlend(),
  blanks: blanksAndRefusals(),
  refutas: refutas(),
  refutasCurve: refutasCurve(),
  curveProbes: curveProbes(),
  curvePlots: LIBRARY_IDS.map((id) => curvePlot(id)),
  cutSets: cutSets(),
  stability: stability(),
  kwale: kwaleBlend(),
  kwaleAt70: kwaleBlend(70),
  kwalePartial: kwalePartial(),
  studioPair: studioPair(),
  watson: watson(),
  kwaleCuts: kwaleCuts(),
  kwaleCutsDeeper: kwaleCuts(KWALE_CUTS_DEEPER_DIESEL.slice(0, 4).map((c) => c.toF)),
  netback: netback(),
  netbackBlank: netback({ blankFreight: true, blankLosses: true }),
  netbackUnpriced: netback({ blankPrice: 'residue' }),
  marker: marker(),
  textbook: textbook(),
  textbookDrag: textbookDrag(0, 28),
  lpCases: lpCases(),
  blendingRules: blendingRules(),
  pms: pmsRecipe(),
  propertyCheck: propertyCheck(),
  giveaway: giveaway(),
  relief: relief(),
  reliefSweep: reliefSweep('sulfurPpm', 'max'),
  ago: agoRecipe(),
  agoOnVolume: agoRecipe({ indexOnMass: false }),
  refused: refusedAndSkipped(),
  optimizerDefault: optimizerDefault(),
  constants: constants(),
  held: HELD,
});
