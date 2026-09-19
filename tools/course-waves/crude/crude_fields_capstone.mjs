// THE CRUDE CAPSTONE CONDITIONS. Three records, one a tier, none of them a
// teaching case:
//
//   IDAMA   an invented Bayelsa export terminal commingling three invented field
//           streams (Idama Light, Opuama Medium, Abiteye Heavy) into one cargo
//           (Associate: the assay and the blend).
//   OGBELE  an invented modular (topping) refinery in Rivers State valuing a
//           blend of two invented crudes on its own cut set, its own product
//           prices and its own processing, freight and loss (Professional: the
//           blended barrel and its netback).
//   ONNE    an invented blending terminal at Onne making a 10,000 bbl PMS
//           (gasoline) cargo for a West African buyer from five bought-in
//           components, one of whose tanks is typed as empty (Expert: the
//           least-cost recipe and the value of relief).
//
// Nothing here is imported by crude_dump.mjs, and nothing in crude_fields.mjs
// is imported here. gate_capstone_leak.py sweeps both directions on every
// rebuild. Every figure is INVENTED and illustrative; no stream, price or
// specification is a published figure or a regulation.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE (crude_capstone.mjs), and
// an independent oracle reproduces every one of them (oracle_check.py). Nothing
// graded is a FINDINGS HELD item: Refutas viscosity (C12, the index basis) and
// Watson K on T50 (C13, the boiling-point basis) are taught as stated limits
// and never graded, and the LP is graded only on barrel-scale problems, the
// regime L4's absolute tolerances are right for.

const curve = (pts) => pts.map(([volumePercent, temperatureF]) => ({ volumePercent, temperatureF }));

/* ------------------------------------------------------------------ *
 * IDAMA (Associate)
 * ------------------------------------------------------------------ */
export const IDAMA_CRUDES = [
  { id: 'idl', name: 'Idama Light', api: 42.3, sulfurWtPct: 0.07, tanMgKohG: 0.18, nitrogenWtPct: 0.04,
    nickelPpm: 1.9, vanadiumPpm: 1.1, viscosityCSt: 2.9,
    sara: { saturates: 58.6, aromatics: 29.9, resins: 10.7, asphaltenes: 0.7 },
    curve: curve([[0, 78], [10, 175], [30, 330], [50, 485], [70, 665], [90, 960], [100, 1290]]) },
  { id: 'opm', name: 'Opuama Medium', api: 28.7, sulfurWtPct: 0.41, tanMgKohG: 0.55, nitrogenWtPct: 0.13,
    nickelPpm: 9.6, vanadiumPpm: 6.3, viscosityCSt: 13.8,
    sara: { saturates: 41.3, aromatics: 38.4, resins: 17.1, asphaltenes: 3.4 },
    curve: curve([[0, 92], [10, 255], [30, 465], [50, 628], [70, 835], [90, 1175], [100, 1455]]) },
  { id: 'abh', name: 'Abiteye Heavy', api: 19.6, sulfurWtPct: 1.62, tanMgKohG: 1.15, nitrogenWtPct: 0.29,
    nickelPpm: 33.5, vanadiumPpm: 71.4, viscosityCSt: 385,
    sara: { saturates: 30.7, aromatics: 36.9, resins: 22.6, asphaltenes: 9.8 },
    curve: curve([[0, 115], [10, 355], [30, 585], [50, 765], [70, 975], [90, 1295], [100, 1545]]) },
];
/** Barrels of each stream in the cargo. */
export const IDAMA_BARRELS = { idl: 408000, opm: 263000, abh: 125000 };
/** The cut the Associate capstone asks about, on the studio's own default cut set. */
export const IDAMA_CUT = { crude: 'opm', cut: { id: 'kerosene', name: 'Kerosene / Jet', fromF: 350, toF: 500 } };

/* ------------------------------------------------------------------ *
 * OGBELE (Professional)
 * ------------------------------------------------------------------ */
export const OGBELE_CRUDES = [
  { id: 'ogl', name: 'Ogbele Light', api: 39.7, sulfurWtPct: 0.09,
    curve: curve([[0, 72], [10, 182], [30, 355], [50, 515], [70, 705], [90, 1010], [100, 1330]]) },
  { id: 'omm', name: 'Omoku Medium', api: 26.2, sulfurWtPct: 0.44,
    curve: curve([[0, 98], [10, 285], [30, 505], [50, 675], [70, 885], [90, 1225], [100, 1490]]) },
];
/** The blend on offer, by volume. */
export const OGBELE_SHARES = { ogl: 62, omm: 38 };
/** The topping refinery's own cut set: no vacuum unit, so the heaviest cut is atmospheric residue. */
export const OGBELE_CUTS = [
  { id: 'lpg', name: 'LPG / Light ends', fromF: null, toF: 90 },
  { id: 'naphtha', name: 'Naphtha', fromF: 90, toF: 340 },
  { id: 'kerosene', name: 'Kerosene / DPK', fromF: 340, toF: 470 },
  { id: 'diesel', name: 'Diesel / AGO', fromF: 470, toF: 640 },
  { id: 'residue', name: 'Atmospheric residue', fromF: 640, toF: null },
];
export const OGBELE_VALUATION = {
  prices: { lpg: 46.5, naphtha: 71.2, kerosene: 94.6, diesel: 99.3, residue: 54.8 },
  processingCostPerBbl: 7.35, freightPerBbl: 2.15, lossPercent: 1.1,
};

/* ------------------------------------------------------------------ *
 * ONNE (Expert)
 * ------------------------------------------------------------------ */
export const ONNE_POOL = [
  { id: 'ref', name: 'Reformate', cost: 95.3, sg: 0.812, density: 0.812, ron: 99.2, mon: 88.4, sulfurPpm: 3, rvp: 3.4, minVolume: 0, maxVolume: 4600 },
  { id: 'fcc', name: 'FCC gasoline', cost: 86.2, sg: 0.742, density: 0.742, ron: 91.6, mon: 80.1, sulfurPpm: 140, rvp: 6.8, minVolume: 0, maxVolume: 5000 },
  { id: 'lsr', name: 'Light naphtha', cost: 76.9, sg: 0.668, density: 0.668, ron: 68.5, mon: 66.2, sulfurPpm: 25, rvp: 11.8, minVolume: 0, maxVolume: 3000 },
  { id: 'but', name: 'Butane', cost: 52.6, sg: 0.584, density: 0.584, ron: 93.5, mon: 89.6, sulfurPpm: 2, rvp: 51.5, minVolume: 0, maxVolume: 650 },
  // The alkylate parcel has not arrived: its tank is typed as 0 barrels.
  { id: 'alk', name: 'Alkylate', cost: 91.5, sg: 0.697, density: 0.697, ron: 95.8, mon: 93.2, sulfurPpm: 4, rvp: 4.6, minVolume: 0, maxVolume: 0 },
];
export const ONNE_TARGET = 10000;
/** The buyer's specification, as plain data; the RVP index conversions are attached by the generator from the engine. */
export const ONNE_SPECS = [
  { id: 'ron', name: 'RON', basis: 'volume', min: 91, unit: '' },
  { id: 'mon', name: 'MON', basis: 'volume', min: 81, unit: '' },
  { id: 'sulfurPpm', name: 'Sulfur', basis: 'mass', max: 50, unit: 'ppm' },
  { id: 'rvp', name: 'RVP', basis: 'index', max: 9.0, unit: 'psi' },
  { id: 'density', name: 'Density', basis: 'volume', min: 0.720, max: 0.775, unit: 'kg/l' },
];

/** The engine return behind each graded key, stated once. */
export const FIELD_SOURCES = {
  idama_blend_api: 'IDAMA: crudeAssay.blendCrudes(three crudes by barrels).properties.api',
  idama_blend_sulfur_wtpct: 'IDAMA: crudeAssay.blendCrudes(...).properties.sulfurWtPct (mass basis)',
  idama_blend_vanadium_ppm: 'IDAMA: crudeAssay.blendCrudes(...).properties.vanadiumPpm (mass basis)',
  idama_abiteye_mass_share_pct: 'IDAMA: 100 x crudeAssay.blendCrudes(...).fractions[Abiteye Heavy].massFraction',
  idama_blend_cii: 'IDAMA: crudeAssay.blendCrudes(...).stability.cii (SARA on mass)',
  idama_opuama_kerosene_yield_pct: 'IDAMA: crudeAssay.cutYields({curve: Opuama Medium, cuts: [Kerosene / Jet 350 to 500 F]}).cuts[0].yieldVolPercent',
  ogbele_blend_t50_f: 'OGBELE: crudeAssay.temperatureAtVolumePercent(blendDistillationCurves(...), 50)',
  ogbele_blend_kerosene_yield_pct: 'OGBELE: crudeAssay.cutYields({curve: blended, cuts: OGBELE_CUTS}) kerosene yieldVolPercent',
  ogbele_blend_diesel_yield_pct: 'OGBELE: crudeAssay.cutYields({curve: blended, cuts: OGBELE_CUTS}) diesel yieldVolPercent',
  ogbele_gross_value_per_bbl: 'OGBELE: crudeAssay.netbackValue({...}).grossValue',
  ogbele_loss_value_per_bbl: 'OGBELE: crudeAssay.netbackValue({...}).lossValue',
  ogbele_netback_per_bbl: 'OGBELE: crudeAssay.netbackValue({...}).netback',
  onne_total_cost_usd: 'ONNE: productBlending.optimiseBlend({...}).totalCost',
  onne_fcc_volume_bbl: 'ONNE: productBlending.optimiseBlend({...}).recipe[FCC gasoline].volume',
  onne_butane_volume_bbl: 'ONNE: productBlending.optimiseBlend({...}).recipe[Butane].volume',
  onne_sulfur_relief_usd_per_ppm: 'ONNE: productBlending.optimiseBlend({...}).shadowPrices[Sulfur maximum].price',
  onne_rvp_relief_usd_per_psi: 'ONNE: productBlending.optimiseBlend({...}).shadowPrices[RVP maximum].price',
  onne_ron_relief_usd_per_octane: 'ONNE: productBlending.optimiseBlend({...}).shadowPrices[RON minimum].price',
};
