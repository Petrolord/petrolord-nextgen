// THE CRUDE TEACHING CASES. Every record the digest is built on, in one place,
// so a sweep, a claim gate, a panel and a lesson all read the same case.
//
// THREE TEACHING CASES, AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs three other records, written in crude_fields_capstone.mjs, and nothing
// in this file or in crude_dump.mjs imports, reads, names or reproduces any of
// it. gate_capstone_leak.py sweeps both directions on every rebuild.
//
//   OBIGBO   an invented crude library at an invented Rivers State export
//            terminal: four field streams and one partial assay, and the export
//            blend of the two lightest, commingled for a cargo sold to a West
//            African refinery. The Associate tier's case (Crude Assay &
//            Blending Studio).
//   KWALE    an invented modular (topping) refinery in Delta State valuing a
//            blend of two invented crudes on its own cut set against its own
//            product prices and a marker netback. The Professional tier's case
//            (Crude Assay & Blending Studio, the Yields and Netback tabs).
//   APAPA    an invented Lagos import and blending terminal making a PMS
//            (gasoline) cargo and an AGO (diesel) cargo from bought-in
//            components. The Expert tier's case (Product Blending Optimizer).
//
// Beside them the digest prints the two apps' own opening examples (the
// studio's default crude pair and the optimizer's default gasoline pool),
// because that is what a learner sees on opening the live app, and those are
// read from the Suite source into this file as data, never typed from memory.
//
// EVERY FIGURE HERE IS INVENTED AND ILLUSTRATIVE. No stream, price or assay is
// a published figure for any real grade, and the digest says so in its
// preamble. Place names are real places; the records are not.
//
// NOTHING HERE READS A CLOCK. The engines in scope take no date, and the
// generator's clock gate (gate_clock.sh) proves the digest does not move with
// the machine clock.

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
