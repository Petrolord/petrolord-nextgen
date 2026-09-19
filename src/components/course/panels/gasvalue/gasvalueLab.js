// Teaching lab for gasvalue, Flare Gas to Value & LPG/CNG. The three explorer
// panels, the course learning page and the vitest files all read this one
// module, so a number shown to a learner and a number a test pins cannot drift
// apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every heating value,
// liquids figure, carbon count, flare tonnage, screening check, ceiling, route
// year, capital, abatement, credit point, blend, vessel, duty, queue, float,
// bank mass, cascade, compressor bridge and switch figure below is a return
// value of engines/downstream/flareToValue.js or engines/downstream/lpgCng.js
// (with modularRefinery.js for SCALING_EXPONENT and scaleCapex) at engines
// f0aef14. This is the ONLY file in the course that imports any of the three,
// and panelCapstoneGuard.test.js asserts that over every panel and the page.
//
// THE BASIS RULE. Every figure is the engine's, on the engine's basis, and a
// panel prints the basis the engine names beside it. Where a panel shows a
// shortcut for contrast, the key ends NotUsed and the arithmetic is
// gasvalue_dump.mjs's, stated beside it: the heating value weighted by mass,
// the methane counted as every unburned carbon, the fill limit read on the
// other basis, the latent heat averaged on volume, the gauge reading typed as
// absolute and the one-bank cascade. A key ending Derived is a column the
// digest prints as its own arithmetic on engine returns (a minus or an over).
//
// A MISSING INPUT IS MISSING. Every reader hands its inputs to the engine as it
// received them: a blank box arrives as '' and the engine reads it as missing.
// No reader fills an efficiency, a GWP, a boiling point, a fill basis or an
// efficiency ratio from anywhere.
//
// EVERY REFUSAL AND EVERY NOTE IS THE ENGINE'S OWN SENTENCE, carried from the
// engine's `error` key or its note fields. No engine sentence is written as a
// literal in this directory, and gasvalueLab.test.js asserts that over the lab,
// every panel and the page. An engine release that rewords a note changes what
// a panel shows and nothing here.
//
// THE CLOCK. Neither engine reads a date or a random number. modularRefinery
// exports one function that reads the machine year (feasibilityEconomics), and
// this lab never names it. gasvalueLab.test.js rebuilds the whole snapshot
// under two faked system dates and under TZ=Pacific/Pago_Pago and
// TZ=Pacific/Kiritimati and demands the same bytes.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

// A namespace rather than named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which may predate the
// downstream modules. Vite and vitest alias @petrolord/engines to this
// worktree's packages/engines, and gasvalueLab.test.js proves every member the
// lab names resolves there.
/* eslint-disable import/namespace */
import * as FV from '@petrolord/engines/engines/downstream/flareToValue.js';
import * as LC from '@petrolord/engines/engines/downstream/lpgCng.js';
import * as MR from '@petrolord/engines/engines/downstream/modularRefinery.js';

/** The three vendored modules, for the resolution test and nothing else. */
export const ENGINE = { FV, LC, MR };

// ---------------------------------------------------------------------------
// THE TEACHING CASES, copied VERBATIM from
// tools/course-waves/gasvalue/gasvalue_fields.mjs, which gasvalue_dump.mjs
// imports. gasvalueLab.test.js compares this block with the wave file text byte
// for byte and each export by value, so it cannot be edited here alone. The
// capstone's records live in another file and nothing here reads them.
// ---------------------------------------------------------------------------

// ---- BEGIN VERBATIM gasvalue_fields.mjs ----
/* ------------------------------------------------------------------ *
 * EGBEMA flow station (Associate and Professional)
 * ------------------------------------------------------------------ */
/** The associated gas analysis, mole fractions, as the laboratory reported it. */
export const EGBEMA_GAS = [
  ['C1', 0.742], ['C2', 0.104], ['C3', 0.062], ['IC4', 0.013],
  ['NC4', 0.021], ['C5', 0.012], ['N2', 0.018], ['CO2', 0.028],
];
/** The flared parcel and the study's flare figures. */
export const EGBEMA_PARCEL = {
  volumeMMscfd: 7.5, onstreamDays: 355,
  flareDestructionEfficiency: 0.97, flareCombustionEfficiency: 0.955,
  gwpMethane: 29.8,
};
/** The same analysis typed short: a laboratory sheet that sums to 0.985. */
export const EGBEMA_SHORT_GAS = [
  ['C1', 0.73], ['C2', 0.102], ['C3', 0.061], ['IC4', 0.013],
  ['NC4', 0.021], ['C5', 0.012], ['N2', 0.018], ['CO2', 0.028],
];
/** A lean gas beside it, from a neighbouring invented non-associated well. */
export const OGUTA_LEAN_GAS = [
  ['C1', 0.925], ['C2', 0.031], ['C3', 0.012], ['IC4', 0.002],
  ['NC4', 0.003], ['N2', 0.012], ['CO2', 0.015],
];
/** Route by route: yield, recovery, price, reference plant and costs. */
export const EGBEMA_ROUTES = {
  cng: { productUnitPerMscf: 18.5, productUnitLabel: 'kg CNG', recoveryFraction: 0.88, pricePerProductUnit: 0.55, referenceCapitalCost: 24000000, referenceCapacityMMscfd: 6, fixedOpexPerYear: 1900000, variableOpexPerMscf: 0.35 },
  mini_lng: { productUnitPerMscf: 0.0175, productUnitLabel: 't LNG', recoveryFraction: 0.86, pricePerProductUnit: 455, referenceCapitalCost: 80000000, referenceCapacityMMscfd: 15, fixedOpexPerYear: 5200000, variableOpexPerMscf: 0.65 },
  lpg_extraction: { productUnitPerMscf: 0.0052, productUnitLabel: 't LPG', recoveryFraction: 0.82, pricePerProductUnit: 470, referenceCapitalCost: 38000000, referenceCapacityMMscfd: 10, fixedOpexPerYear: 2600000, variableOpexPerMscf: 0.28 },
  gas_to_power: { productUnitPerMscf: 0.085, productUnitLabel: 'MWh', recoveryFraction: 0.94, pricePerProductUnit: 58, referenceCapitalCost: 50000000, referenceCapacityMMscfd: 12, fixedOpexPerYear: 3600000, variableOpexPerMscf: 0.45 },
};
/** The study's own requirement limits, route by route. A key left out is left unset. */
export const EGBEMA_LIMITS = {
  cng: { minVolumeMMscfd: 5, maxInertFraction: 0.06, minGhvBtuScf: 1000 },
  mini_lng: { minVolumeMMscfd: 10, maxCo2Fraction: 0.02, maxInertFraction: 0.06 },
  lpg_extraction: { minVolumeMMscfd: 5, minGpmC3Plus: 2 },
  gas_to_power: { minVolumeMMscfd: 3, minGhvBtuScf: 950 },
};
/** The counterfactual for the CNG route, and two others beside it on the same flare. */
export const EGBEMA_COUNTERFACTUALS = [
  { counterfactualLabel: 'CNG displacing diesel in haulage trucks', productCombustionTonnesCo2ePerYear: 128000, displacedFuelTonnesCo2ePerYear: 156000 },
  { counterfactualLabel: 'CNG displacing pipeline gas already burned', productCombustionTonnesCo2ePerYear: 128000, displacedFuelTonnesCo2ePerYear: 128000 },
  { counterfactualLabel: 'CNG sold into a market that burned nothing', productCombustionTonnesCo2ePerYear: 128000, displacedFuelTonnesCo2ePerYear: 0 },
];
/** Gas to power sold into a new load that burned nothing: the route's own counterfactual. */
export const EGBEMA_POWER_COUNTERFACTUAL = { counterfactualLabel: 'Gas to power for a new load that burned nothing', productCombustionTonnesCo2ePerYear: 205000, displacedFuelTonnesCo2ePerYear: 0 };
/** The credit test on the CNG route, prices typed in the order the bid team typed them. */
export const EGBEMA_CREDITS = { creditPrices: [40, 8, 20, 12], hurdleMarginPerYear: 24500000 };
/** A second hurdle the same route clears on its own. */
export const EGBEMA_LOW_HURDLE = 20000000;

/* ------------------------------------------------------------------ *
 * KANO LPG storage and bottling plant (Expert)
 * ------------------------------------------------------------------ */
/** The blend by liquid volume; densities, molar masses and latent heats are the engine's typical table. */
export const KANO_BLEND = { propane: 0.35, butane: 0.65 };
export const KANO_VESSEL = {
  vesselCapacityM3: 150, demandTonnesPerDay: 8, deliveryTonnes: 20, leadTimeDays: 3, safetyDays: 2,
};
/** Two ways a fill limit is stated, as illustrative figures (the code value is the site's, and is held). */
export const KANO_FILL_LIMITS = [
  { maxFillRatio: 0.85, fillRatioBasis: 'liquid_volume' },
  { maxFillRatio: 0.42, fillRatioBasis: 'water_capacity_mass' },
];
export const KANO_VAPORIZER = {
  massFlowKgHr: 650, liquidCpKJkgK: 2.45, inletTempC: 18, boilingPointC: 38,
  vapourCpKJkgK: 1.68, outletTempC: 55, designMarginPercent: 15,
};
export const KANO_BOTTLING = {
  cylindersPerDay: 3200, fillMinutesPerCylinder: 2.2, positions: 18,
  shiftHoursPerDay: 10, availabilityFraction: 0.92,
};
export const KANO_CYLINDER_CYCLE = [
  { label: 'At the customer', days: 24 }, { label: 'In transit out', days: 1.5 },
  { label: 'At the plant', days: 1.5 }, { label: 'In transit back', days: 1.5 },
];
export const KANO_CYLINDER_SPARES = 0.08;

/* ------------------------------------------------------------------ *
 * IBAFO CNG mother station (Expert)
 * ------------------------------------------------------------------ */
export const IBAFO_GAS = { gasSg: 0.62, temperatureC: 30 };
/** Bank pressures in bar(a), the engine's basis. */
export const IBAFO_BANKS = [
  { label: 'Low', volumeM3: 2, pressureBar: 230 },
  { label: 'Mid', volumeM3: 2, pressureBar: 250 },
  { label: 'High', volumeM3: 2, pressureBar: 270 },
];
/** A bus tank, filled from 25 to 200 bar(a). */
export const IBAFO_VEHICLE = { vehicleTankM3: 0.1, vehicleStartBar: 25, vehicleTargetBar: 200 };
/** One bank gauge read at 249 bar(g) with the site's atmosphere taken as 1.013 bar(a). */
export const IBAFO_GAUGE = { volumeM3: 2, gaugeBar: 249, atmosphereBar: 1.013 };
/** The compressor feeding the banks: taught as a unit bridge, never graded (FC3 owns its thermodynamics). */
export const IBAFO_COMPRESSION = {
  throughputKgPerHour: 400, suctionBar: 5, dischargeBar: 255, suctionTempC: 32, k: 1.31, polytropicEfficiency: 0.75,
};
export const IBAFO_DISPENSING = { vehiclesPerHour: 14, fillMinutes: 6, dispenserCounts: [2, 3] };
export const IBAFO_TRAILER_CYCLE = [
  { label: 'Loading', days: 0.2 }, { label: 'Run out', days: 0.3 },
  { label: 'On station', days: 1 }, { label: 'Run back', days: 0.3 },
];
export const IBAFO_TRAILER_TRIPS = 4;
export const IBAFO_TRAILER_SPARES = 0.1;
/** A Lagos bus operator's switch from PMS to CNG, one bus, prices in naira. */
export const IBAFO_CONVERSION = {
  annualDistanceKm: 55000,
  baseFuel: { label: 'PMS', consumptionPer100Km: 14, pricePerUnit: 780, energyPerUnitMJ: 32, emissionFactorKgCo2ePerUnit: 2.3 },
  newFuel: { label: 'CNG', pricePerUnit: 380, energyPerUnitMJ: 48, emissionFactorKgCo2ePerUnit: 2.75, efficiencyRatio: 0.92 },
  conversionCost: 1200000, annualExtraMaintenance: 60000,
};

/* ------------------------------------------------------------------ *
 * The two live apps' opening examples, copied from the Suite contexts
 * (src/contexts/FlareToValueContext.jsx and LpgCngContext.jsx) as data.
 * ------------------------------------------------------------------ */
export const SUITE_FLARE = {
  gas: [['C1', 0.78], ['C2', 0.09], ['C3', 0.05], ['IC4', 0.01], ['NC4', 0.02], ['C5', 0.01], ['N2', 0.02], ['CO2', 0.02]],
  volumeMMscfd: 10, onstreamDays: 350,
  /** The page's LPG route yield on the repaired defaults, and the figure it replaced. */
  lpgYieldPerMscf: 0.0045, lpgYieldBefore: 0.02,
};
export const SUITE_ROLLOUT = {
  banks: [{ label: 'Low', volumeM3: 1.5, pressureBar: 250 }, { label: 'Mid', volumeM3: 1.5, pressureBar: 250 }, { label: 'High', volumeM3: 1.5, pressureBar: 250 }],
  vehicleTankM3: 0.08, vehicleStartBar: 20, vehicleTargetBar: 200, temperatureC: 15, gasSg: 0.6,
  bottling: { cylindersPerDay: 2400, fillMinutesPerCylinder: 2.5, positions: 16, shiftHoursPerDay: 8, availabilityFraction: 0.9 },
  dispensing: { vehiclesPerHour: 12, fillMinutes: 5, dispensers: 2 },
};
// ---- END VERBATIM gasvalue_fields.mjs ----

// ---------------------------------------------------------------------------
// The probe inputs gasvalue_dump.mjs holds inline rather than in the fields
// file, copied here. gasvalueLab.test.js finds each one in the dump's text.
// ---------------------------------------------------------------------------

/** SECTION 2: the pure components asked about one Mscf each. */
export const PURE_CODES = ['C1', 'C2', 'C3', 'N2', 'CO2'];
/** SECTION 6: methane and propane, the carbon number probe. */
export const CARBON_PROBE = [['C1', 0.9], ['C3', 0.1]];
/** SECTION 11: the destruction efficiency swept with combustion left out. */
export const DESTRUCTION_SWEEP = [0.9, 0.95, 0.97, 0.99, 1];
/** SECTION 12: the two other GWPs, for comparison only. */
export const GWP_OTHERS = [20, 40];
/** SECTION 25: the studio's opening blend. */
export const STUDIO_BLEND = { propane: 0.4, butane: 0.6 };
/** SECTION 18: the recovery the dump gives the studio's LPG route. */
export const STUDIO_LPG_RECOVERY = 0.85;
/** SECTION 33: the arrivals the forecourt cannot keep up with. */
export const FORECOURT_OVERLOAD = 25;

// ---------------------------------------------------------------------------
// THE DIGEST'S OWN PRINTING PRECISION, so a panel prints what a lesson quotes:
// tonnes a year and cascade kilograms to three decimals, dollars of revenue,
// cost, margin, capital and cash flow to two, every other computed figure to
// four. Counts and inputs print as they are.
// ---------------------------------------------------------------------------

export const PRINT = { f4: 4, t3: 3, d2: 2 };

const fixedAt = (dp) => (v) => {
  if (v === null || v === undefined || v === '') return 'none';
  const n = Number(v);
  if (!Number.isFinite(n)) return 'none';
  const s = n.toFixed(dp);
  return /^-0\.?0*$/.test(s) ? s.slice(1) : s;
};

/** One printer per class, each the digest's own width. A missing value prints none. */
export const fmt = Object.fromEntries(Object.entries(PRINT).map(([k, dp]) => [k, fixedAt(dp)]));
/** A value as it was typed: none for missing, blank for an empty box. */
export const plain = (v) => (v === null || v === undefined ? 'none' : v === '' ? 'blank' : String(v));
/** True when a box holds nothing. */
const blank = (v) => v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
/** A number for the digest's own arithmetic on returns, never for sending to an engine. */
const num = (v) => (blank(v) ? NaN : Number(v));
const orNull = (v) => (v === undefined ? null : v);
const clone = (o) => JSON.parse(JSON.stringify(o));

// ===========================================================================
// THE REFERENCE TABLES AND THE GAS ROWS A PANEL EDITS.
// ===========================================================================

const REF = Object.fromEntries(FV.GAS_COMPONENT_REFERENCE.map((r) => [r.code, r]));
const LPG = Object.fromEntries(LC.LPG_REFERENCE.map((r) => [r.code, r]));

/**
 * A gas as the rows a panel edits, filled from the engine's reference table by
 * code: the carbon number, the molar mass, the heating value and the liquid
 * density. The analysis carries the figures and the engine reads what it is given.
 */
export const rowsOf = (pairs) => pairs.map(([code, moleFraction]) => {
  const r = REF[code];
  return {
    code,
    moleFraction,
    c: r ? r.c : null,
    molarMassLbLbmol: r ? r.molarMassLbLbmol : null,
    ghvBtuScf: r ? r.typicalGhvBtuScf : null,
    liquidDensityLbGal: r ? r.liquidDensityLbGal : null,
  };
});

/** The gases a panel offers as presets, each named as the digest names it. */
export const GAS_PRESETS = [
  ['egbema', 'EGBEMA, the laboratory sheet in full', EGBEMA_GAS],
  ['egbema_short', 'EGBEMA, the same sheet typed short', EGBEMA_SHORT_GAS],
  ['oguta', 'OGUTA, a lean gas beside it', OGUTA_LEAN_GAS],
  ['studio', "The studio's opening gas", SUITE_FLARE.gas],
];
export const presetRows = (id) => {
  const p = GAS_PRESETS.find(([k]) => k === id);
  return p ? rowsOf(p[2]) : [];
};

/** The rows as the engine takes them. recoverableAsNgl and inert come from the reference by code. */
const componentsOf = (rows) => (Array.isArray(rows) ? rows : []).map((x) => {
  const r = REF[x.code] || {};
  return {
    code: x.code,
    moleFraction: x.moleFraction,
    c: x.c,
    molarMassLbLbmol: x.molarMassLbLbmol,
    ghvBtuScf: x.ghvBtuScf,
    liquidDensityLbGal: x.liquidDensityLbGal,
    recoverableAsNgl: !!r.recoverableAsNgl,
    inert: !!r.inert,
  };
});

/** SECTION 1: the modules' exports, counted off the modules themselves. */
export function enginesAt() {
  const count = (mod) => ({
    functions: Object.entries(mod).filter(([, v]) => typeof v === 'function').map(([k]) => k).sort(),
    constants: Object.entries(mod).filter(([, v]) => typeof v !== 'function').map(([k]) => k).sort(),
  });
  return { flareToValue: count(FV), lpgCng: count(LC) };
}

/** SECTIONS 2 AND 3: the unit constants, the reference table and its note. */
export function referenceAt() {
  return {
    constants: [
      ['SCF_PER_LBMOL', FV.SCF_PER_LBMOL, 'standard cubic feet in one lb-mol'],
      ['LB_PER_KG', FV.LB_PER_KG, 'pounds in one kilogram'],
      ['GAL_PER_FT3', FV.GAL_PER_FT3, 'US gallons in one cubic foot'],
      ['BTU_PER_MWH', FV.BTU_PER_MWH, 'International Table Btu in one megawatt hour'],
      ['M3_PER_SCF (lpgCng)', LC.M3_PER_SCF, 'cubic metres in one standard cubic foot'],
      ['KJ_PER_KWH (lpgCng)', LC.KJ_PER_KWH, 'kilojoules in one kilowatt hour'],
      ['PSI_PER_BAR (lpgCng)', LC.PSI_PER_BAR, 'psi in one bar'],
    ].map(([name, value, what]) => ({ name, value, what })),
    table: clone(FV.GAS_COMPONENT_REFERENCE),
    note: FV.GAS_REFERENCE_NOTE,
  };
}

// ===========================================================================
// THE FLARE EXPLORER (Associate): SECTIONS 2 TO 15.
// ===========================================================================

/**
 * One gas through characteriseGas, exactly as the rows hold it. Beside the
 * engine: the same heating values weighted by mass (the reading the engine does
 * not use, from the typed fractions and molar masses as gasvalue_dump.mjs
 * weighs them), the engine asked about the hydrocarbons alone, and the two
 * columns the digest prints as its own arithmetic (the ethane, and the C3+
 * share of the mass).
 */
export function gasAt(rows) {
  const comps = componentsOf(rows);
  const g = FV.characteriseGas({ components: comps });
  if (!g || g.error) return { refusal: (g && g.error) || null, rows: clone(comps) };
  const y = comps.map((c) => num(c.moleFraction));
  const m = comps.map((c) => num(c.molarMassLbLbmol));
  const h = comps.map((c) => num(c.ghvBtuScf));
  const massOk = [...y, ...m, ...h].every(Number.isFinite);
  const masses = massOk ? y.map((v, i) => v * m[i]) : [];
  const total = masses.reduce((s, v) => s + v, 0);
  const onMass = massOk && total > 0 ? masses.reduce((s, v, i) => s + (v / total) * h[i], 0) : null;
  const hc = FV.characteriseGas({ components: comps.filter((c) => !c.inert) });
  const hcGhv = hc && !hc.error ? hc.ghvBtuScf : null;
  const ok = (v) => v !== null && v !== undefined;
  return {
    refusal: null,
    rows: clone(comps),
    normalised: g.normalised.map((x) => ({ ...x })),
    rawMoleFractionSum: g.rawMoleFractionSum,
    normalisationNote: g.normalisationNote,
    ghvBtuScf: g.ghvBtuScf,
    ghvNote: g.ghvNote,
    inertMoleFraction: g.inertMoleFraction,
    co2MoleFraction: g.co2MoleFraction,
    methaneMoleFraction: g.methaneMoleFraction,
    carbonPerMol: g.carbonPerMol,
    hydrocarbonCarbonPerMol: g.hydrocarbonCarbonPerMol,
    carbonLessHydrocarbonDerived: ok(g.carbonPerMol) && ok(g.hydrocarbonCarbonPerMol) ? g.carbonPerMol - g.hydrocarbonCarbonPerMol : null,
    molarMassLbLbmol: g.molarMassLbLbmol,
    kgPerMscf: g.kgPerMscf,
    c3PlusKgPerMscf: g.c3PlusKgPerMscf,
    c3PlusShareDerived: ok(g.c3PlusKgPerMscf) && ok(g.kgPerMscf) && g.kgPerMscf ? g.c3PlusKgPerMscf / g.kgPerMscf : null,
    gpmC2Plus: g.gpmC2Plus,
    gpmC3Plus: g.gpmC3Plus,
    ethaneGpmDerived: ok(g.gpmC2Plus) && ok(g.gpmC3Plus) ? g.gpmC2Plus - g.gpmC3Plus : null,
    gpmBasis: g.gpmBasis,
    missingLiquidDensity: [...(g.missingLiquidDensity || [])],
    richness: g.richness,
    massWeightedGhvNotUsed: onMass,
    massWeightedLessEngineNotUsed: onMass !== null && ok(g.ghvBtuScf) ? onMass - g.ghvBtuScf : null,
    hydrocarbonsOnlyGhv: hcGhv,
    hydrocarbonsOnlyLessEngine: ok(hcGhv) && ok(g.ghvBtuScf) ? hcGhv - g.ghvBtuScf : null,
  };
}

/** The engine's characterised gas, as the flare and route calls take it (a refusal passes through as one). */
const engineGas = (rows) => FV.characteriseGas({ components: componentsOf(rows) });

export const presetGasAt = (id) => gasAt(presetRows(id));

/** SECTION 2: one Mscf of each pure component. */
export const pureComponentsAt = () => PURE_CODES.map((code) => {
  const g = gasAt(rowsOf([[code, 1]]));
  return { code, label: REF[code].label, molarMassLbLbmol: REF[code].molarMassLbLbmol, kgPerMscf: g.kgPerMscf };
});

/** SECTION 6: the carbon number typed, and left blank for the reference to fill. */
export function carbonProbeAt() {
  const typed = rowsOf(CARBON_PROBE);
  const left = typed.map((r) => (r.code === 'C3' ? { ...r, c: null } : r));
  const a = gasAt(typed); const b = gasAt(left);
  return [
    { probe: 'propane carbon number typed', carbonPerMol: a.carbonPerMol, hydrocarbonCarbonPerMol: a.hydrocarbonCarbonPerMol },
    { probe: 'propane carbon number left blank', carbonPerMol: b.carbonPerMol, hydrocarbonCarbonPerMol: b.hydrocarbonCarbonPerMol },
  ];
}

/** SECTION 6: what characteriseGas refuses, each in the engine's own words. */
export function analysisRefusalsAt() {
  const unknown = [...rowsOf([['C1', 0.9]]), { code: 'XX', moleFraction: 0.1, c: null, molarMassLbLbmol: 30 }];
  return [
    ['an unknown code (XX) with no carbon number', unknown],
    ['a negative mole fraction (methane 1.1, ethane -0.1)', rowsOf([['C1', 1.1], ['C2', -0.1]])],
    ["a blank mole fraction (methane typed as '')", rowsOf([['C1', '']])],
    ['every mole fraction zero', rowsOf([['C1', 0], ['C2', 0]])],
  ].map(([probe, rows]) => ({ probe, refusal: gasAt(rows).refusal }));
}

/** SECTION 8: EGBEMA with a density, and then a heating value, left blank. */
export function missingProbesAt() {
  const eg = rowsOf(EGBEMA_GAS);
  return [
    ['EGBEMA as typed', gasAt(eg)],
    ['propane density blank', gasAt(eg.map((r) => (r.code === 'C3' ? { ...r, liquidDensityLbGal: null } : r)))],
    ['n-butane heating value blank', gasAt(eg.map((r) => (r.code === 'NC4' ? { ...r, ghvBtuScf: null } : r)))],
  ].map(([probe, g]) => ({ probe, ...g }));
}

/**
 * SECTION 7: where the richness word changes, read from the engine's export
 * RICHNESS_GPM (MD45-1), as the dump reads it. The words either side come from
 * a methane and propane mix a ten-thousandth below and above each edge.
 */
export function richnessEdgesAt() {
  const gpmPropane = gasAt(rowsOf([['C3', 1]])).gpmC3Plus;
  const wordAt = (gpm) => { const x = gpm / gpmPropane; return gasAt(rowsOf([['C1', 1 - x], ['C3', x]])).richness; };
  const edge = (gpm) => ({ gpmC3Plus: gpm, below: wordAt(gpm * (1 - 1e-4)), above: wordAt(gpm * (1 + 1e-4)) });
  return { leanToModerate: edge(FV.RICHNESS_GPM.moderate), moderateToRich: edge(FV.RICHNESS_GPM.rich) };
}

/** SECTION 10: the molar masses the flare's tonnes are weighed at, the engine's export FLARE_MOLAR_MASS (MD45-1). */
export function flareMolarMassAt(code) {
  if (code === 'CO2') return FV.FLARE_MOLAR_MASS.CO2;
  if (code === 'C1' || code === 'CH4') return FV.FLARE_MOLAR_MASS.CH4;
  return null;
}
export const flareMolarMassesAt = () => ({ co2: flareMolarMassAt('CO2'), methane: flareMolarMassAt('C1') });

/** The flare inputs, every one blank: the explorer starts here, and the engine's refusal shows. */
export const BLANK_FLARE = {
  volumeMMscfd: '', onstreamDays: '', flareDestructionEfficiency: '', flareCombustionEfficiency: '', gwpMethane: '',
};
/** EGBEMA's parcel and flare study, as a preset. */
export const egbemaFlareInputs = () => ({ ...EGBEMA_PARCEL });

/**
 * SECTIONS 10 TO 13: abatement's flare half, on the rows and the inputs exactly
 * as typed. Beside the engine's methane: every unburned carbon counted as
 * methane, from the engine's own carbon per mole and its own methane molar
 * mass, as gasvalue_dump.mjs computes it: the reading the engine does not use.
 */
export function flareAt(rows, inputs = BLANK_FLARE) {
  const gas = engineGas(rows);
  const r = FV.abatement({ gas, ...inputs });
  if (!r || r.error) return { inputs: { ...inputs }, refusal: (r && r.error) || null };
  let allCarbon = null;
  if (gas && !gas.error && Number.isFinite(r.destructionEfficiency) && Number.isFinite(gas.carbonPerMol)) {
    const lbmolYr = r.scfPerYear / FV.SCF_PER_LBMOL;
    const mwCh4 = flareMolarMassAt('C1');
    allCarbon = (lbmolYr * gas.carbonPerMol * (1 - r.destructionEfficiency) * mwCh4) / FV.LB_PER_KG / 1000;
  }
  return {
    inputs: { ...inputs },
    refusal: null,
    scfPerYear: r.scfPerYear,
    flareCo2Tonnes: r.flareCo2Tonnes,
    flareCh4Tonnes: r.flareCh4Tonnes,
    flareCo2eTonnes: r.flareCo2eTonnes,
    methaneShareOfFlareCo2e: orNull(r.methaneShareOfFlareCo2e),
    destructionEfficiency: r.destructionEfficiency,
    combustionEfficiency: r.combustionEfficiency,
    combustionEfficiencyNote: r.combustionEfficiencyNote,
    basis: r.basis,
    gwpMethane: orNull(r.gwpMethane),
    blockedBy: orNull(r.blockedBy),
    allCarbonMethaneNotUsed: allCarbon,
    allCarbonOverEngineNotUsed: allCarbon !== null && r.flareCh4Tonnes ? allCarbon / r.flareCh4Tonnes : null,
  };
}

/** SECTION 10: EGBEMA's flare at the study's figures. */
export const egbemaFlareAt = () => flareAt(rowsOf(EGBEMA_GAS), egbemaFlareInputs());

/** SECTION 10: the CO2 in the gas passes through; methane comes from the methane. */
export const passThroughAt = () => [
  ['all CO2, EGBEMA efficiencies', flareAt(rowsOf([['CO2', 1]]), egbemaFlareInputs())],
  ['all CO2, both efficiencies 0.5', flareAt(rowsOf([['CO2', 1]]), { ...egbemaFlareInputs(), flareDestructionEfficiency: 0.5, flareCombustionEfficiency: 0.5 })],
  ['all methane, EGBEMA efficiencies', flareAt(rowsOf([['C1', 1]]), egbemaFlareInputs())],
].map(([probe, f]) => ({ probe, flareCo2Tonnes: f.flareCo2Tonnes, flareCh4Tonnes: f.flareCh4Tonnes }));

/** SECTION 11: both efficiencies given, and combustion left out so destruction stands in. */
export function standInAt() {
  const given = egbemaFlareAt();
  const left = flareAt(rowsOf(EGBEMA_GAS), { ...egbemaFlareInputs(), flareCombustionEfficiency: null });
  return {
    given,
    left,
    leftLessGivenDerived: {
      combustionEfficiency: left.combustionEfficiency - given.combustionEfficiency,
      flareCo2Tonnes: left.flareCo2Tonnes - given.flareCo2Tonnes,
      flareCh4Tonnes: left.flareCh4Tonnes - given.flareCh4Tonnes,
      flareCo2eTonnes: left.flareCo2eTonnes - given.flareCo2eTonnes,
    },
  };
}

/** SECTION 11: the destruction efficiency swept, combustion left out. */
export const destructionSweepAt = () => DESTRUCTION_SWEEP.map((eta) => ({
  eta, ...flareAt(rowsOf(EGBEMA_GAS), { ...egbemaFlareInputs(), flareDestructionEfficiency: eta, flareCombustionEfficiency: null }),
}));

/** SECTION 12: the study's GWP and two others, and the GWP left blank. */
export const gwpSweepAt = () => [EGBEMA_PARCEL.gwpMethane, ...GWP_OTHERS].map((gwp) => ({
  gwp, ...flareAt(rowsOf(EGBEMA_GAS), { ...egbemaFlareInputs(), gwpMethane: gwp }),
}));
export const noGwpAt = () => flareAt(rowsOf(EGBEMA_GAS), { ...egbemaFlareInputs(), gwpMethane: '' });

/** SECTION 13: what abatement refuses, each probe on EGBEMA's gas with the rest of the parcel. */
export function flareRefusalsAt() {
  const eg = rowsOf(EGBEMA_GAS);
  const P = egbemaFlareInputs();
  return [
    ["destruction efficiency left blank ('')", eg, { ...P, flareDestructionEfficiency: '' }],
    ['destruction efficiency 1.2', eg, { ...P, flareDestructionEfficiency: 1.2 }],
    ['combustion efficiency 0.98 above a destruction efficiency of 0.97', eg, { ...P, flareCombustionEfficiency: 0.98 }],
    ['no volume', eg, { ...P, volumeMMscfd: '' }],
    ["on-stream days left blank ('')", eg, { ...P, onstreamDays: '' }],
    ['on-stream days 367', eg, { ...P, onstreamDays: 367 }],
    ['a gas the analysis refused', rowsOf([['C1', '']]), P],
  ].map(([probe, rows, inputs]) => ({ probe, refusal: flareAt(rows, inputs).refusal }));
}

/** SECTION 13: on-stream days left out of the call keep the stated default. */
export function omittedDaysAt() {
  const P = EGBEMA_PARCEL;
  const f = flareAt(rowsOf(EGBEMA_GAS), { volumeMMscfd: P.volumeMMscfd, flareDestructionEfficiency: P.flareDestructionEfficiency, gwpMethane: P.gwpMethane });
  return { scfPerYear: f.scfPerYear };
}

/** SECTION 14: the studio's opening gas and parcel with both efficiencies and the GWP blank. */
export const studioFlareAt = () => flareAt(rowsOf(SUITE_FLARE.gas), {
  volumeMMscfd: SUITE_FLARE.volumeMMscfd, onstreamDays: SUITE_FLARE.onstreamDays, flareDestructionEfficiency: '', gwpMethane: '',
});

// ===========================================================================
// THE ROUTE EXPLORER (Professional): SECTIONS 16 TO 24.
// ===========================================================================

const templateOf = (id) => FV.ROUTE_TEMPLATES.find((t) => t.id === id) || null;
export const ROUTE_IDS = FV.ROUTE_TEMPLATES.map((t) => t.id);

/** SECTION 16: the templates as the engine exports them, their note and the notes on two requirements. */
export function routeTemplatesAt() {
  return {
    templates: clone(FV.ROUTE_TEMPLATES),
    note: FV.ROUTE_TEMPLATE_NOTE,
    requirementNotes: FV.ROUTE_TEMPLATES.flatMap((t) => t.requirements.filter((q) => q.note).map((q) => ({ route: t.label, requirement: q.label, note: q.note }))),
  };
}

/** A template with the learner's limits in it. A limit the learner leaves out is unset. */
const withLimits = (id, limits) => {
  const t = templateOf(id);
  if (!t) return null;
  return { ...t, requirements: t.requirements.map((q) => ({ ...q, limit: limits && limits[q.key] !== undefined ? limits[q.key] : null })) };
};

/** EGBEMA's study limits, one box per requirement, and every box empty as the studio opens. */
export const egbemaLimits = () => clone(EGBEMA_LIMITS);
export const blankLimits = () => Object.fromEntries(FV.ROUTE_TEMPLATES.map((t) => [t.id, {}]));

/** SECTIONS 16 AND 17: one route screened against the learner's limits. */
export function screenAt(id, limits, rows = rowsOf(EGBEMA_GAS), volumeMMscfd = EGBEMA_PARCEL.volumeMMscfd) {
  const s = FV.screenRoute({ route: withLimits(id, limits), gas: engineGas(rows), volumeMMscfd });
  if (!s || s.error) return { routeId: id, refusal: (s && s.error) || null };
  return {
    routeId: id,
    refusal: null,
    label: s.label,
    checks: s.checks.map((c) => ({ ...c })),
    verdict: s.verdict,
    failures: s.failures.map((x) => ({ ...x })),
    uncheckedRequirements: [...s.uncheckedRequirements],
  };
}
export const screensAt = (limitsByRoute = egbemaLimits(), rows = rowsOf(EGBEMA_GAS), volumeMMscfd = EGBEMA_PARCEL.volumeMMscfd) => ROUTE_IDS
  .map((id) => screenAt(id, (limitsByRoute || {})[id] || {}, rows, volumeMMscfd));

/** SECTION 17: screenRoute on a gas the analysis refused. */
export const screenRefusalAt = () => screenAt('cng', {}, rowsOf([['C1', '']])).refusal;

/** SECTION 18: each route's ceiling on one gas, by the basis the template names. */
export const ceilingsAt = (rows = rowsOf(EGBEMA_GAS)) => {
  const gas = engineGas(rows);
  return FV.ROUTE_TEMPLATES.map((t) => ({
    routeId: t.id, label: t.label, unit: t.yieldBasis.unit, basis: t.yieldBasis.ceiling, ceiling: FV.yieldCeiling({ yieldBasis: t.yieldBasis, gas }),
  }));
};

/**
 * SECTION 18: each route's ceiling on one gas beside the yield typed for it.
 * The typed yield over the ceiling is the digest's own column.
 */
export const yieldChecksAt = (inputs = EGBEMA_ROUTES, rows = rowsOf(EGBEMA_GAS)) => ceilingsAt(rows).map((c) => {
  const typed = ((inputs || {})[c.routeId] || {}).productUnitPerMscf;
  const y = num(typed);
  return {
    ...c, typed: orNull(typed), yieldOverCeilingDerived: Number.isFinite(y) && Number.isFinite(c.ceiling) && c.ceiling ? y / c.ceiling : null,
  };
});

/** The route inputs a panel edits, as EGBEMA's study typed them. */
export const egbemaRouteInputs = () => clone(EGBEMA_ROUTES);
/** EGBEMA's parcel for the routes. */
export const egbemaParcel = () => ({ volumeMMscfd: EGBEMA_PARCEL.volumeMMscfd, onstreamDays: EGBEMA_PARCEL.onstreamDays });

/**
 * SECTIONS 18 TO 20: a route's year through routeEconomics, exactly as typed.
 * Beside the engine's capital: the six-tenths rule on the same plant through
 * modularRefinery.scaleCapex at STICK_BUILT, as the dump computes it, the
 * reading this route does not use.
 */
export function routeYearAt(id, inputs = EGBEMA_ROUTES[id], rows = rowsOf(EGBEMA_GAS), parcel = egbemaParcel()) {
  const t = templateOf(id);
  const r = FV.routeEconomics({ route: t, gas: engineGas(rows), volumeMMscfd: parcel.volumeMMscfd, onstreamDays: parcel.onstreamDays, ...inputs });
  if (!r || r.error) return { routeId: id, inputs: { ...inputs }, refusal: (r && r.error) || null };
  const stick = MR.scaleCapex({
    baseCost: inputs.referenceCapitalCost, baseCapacity: inputs.referenceCapacityMMscfd, capacity: parcel.volumeMMscfd, exponent: MR.SCALING_EXPONENT.STICK_BUILT,
  });
  const stickCost = stick && !stick.error && Number.isFinite(stick.cost) ? stick.cost : null;
  return {
    routeId: id,
    inputs: { ...inputs },
    refusal: null,
    label: r.label,
    productUnitLabel: orNull(r.productUnitLabel),
    mscfPerYear: r.mscfPerYear,
    onstreamDays: r.onstreamDays,
    recoveryFraction: r.recoveryFraction,
    yieldCeilingPerMscf: r.yieldCeilingPerMscf,
    productPerYear: r.productPerYear,
    revenuePerYear: r.revenuePerYear,
    operatingCostPerYear: r.operatingCostPerYear,
    grossMarginPerYear: r.grossMarginPerYear,
    valuePerMscf: r.valuePerMscf,
    assumedZero: [...(r.assumedZero || [])],
    capitalCost: r.capitalCost,
    scalingExponent: r.scalingExponent,
    capexNote: r.capexNote,
    cashFlow: { ...r.cashFlow },
    valuationNote: r.valuationNote,
    sixTenthsNotUsed: stickCost,
    modularLessSixTenthsDerived: stickCost !== null && Number.isFinite(r.capitalCost) ? r.capitalCost - stickCost : null,
  };
}
export const routeYearsAt = (inputs = egbemaRouteInputs(), rows = rowsOf(EGBEMA_GAS), parcel = egbemaParcel()) => ROUTE_IDS
  .map((id) => routeYearAt(id, (inputs || {})[id] || {}, rows, parcel));

/** SECTION 18: the yields the engine refuses. */
export const yieldRefusalsAt = () => [
  [`studio opening gas, LPG route at ${SUITE_FLARE.lpgYieldBefore} t/Mscf`, routeYearAt('lpg_extraction', { productUnitPerMscf: SUITE_FLARE.lpgYieldBefore, recoveryFraction: STUDIO_LPG_RECOVERY }, rowsOf(SUITE_FLARE.gas), { volumeMMscfd: SUITE_FLARE.volumeMMscfd })],
  ['EGBEMA, CNG route at 30 kg/Mscf', routeYearAt('cng', { productUnitPerMscf: 30, recoveryFraction: EGBEMA_ROUTES.cng.recoveryFraction }, rowsOf(EGBEMA_GAS), { volumeMMscfd: EGBEMA_PARCEL.volumeMMscfd })],
  ['EGBEMA, gas to power at 0 MWh/Mscf', routeYearAt('gas_to_power', { productUnitPerMscf: 0, recoveryFraction: EGBEMA_ROUTES.gas_to_power.recoveryFraction }, rowsOf(EGBEMA_GAS), { volumeMMscfd: EGBEMA_PARCEL.volumeMMscfd })],
].map(([probe, r]) => ({ probe, refusal: r.refusal }));

/** SECTION 18: the studio's LPG route at its repaired yield, and the typed yield over its ceiling. */
export function studioLpgAt() {
  const r = routeYearAt('lpg_extraction', { productUnitPerMscf: SUITE_FLARE.lpgYieldPerMscf, recoveryFraction: STUDIO_LPG_RECOVERY }, rowsOf(SUITE_FLARE.gas), { volumeMMscfd: SUITE_FLARE.volumeMMscfd });
  return { yieldPerMscf: SUITE_FLARE.lpgYieldPerMscf, ceiling: r.yieldCeilingPerMscf, yieldOverCeilingDerived: SUITE_FLARE.lpgYieldPerMscf / r.yieldCeilingPerMscf };
}

/** SECTION 19: recovery and days the engine refuses, and the blank costs it names. */
export const routeRefusalsAt = () => [
  ['CNG recovery 0', { recoveryFraction: 0 }],
  ['CNG recovery 1.2', { recoveryFraction: 1.2 }],
  ["CNG recovery left blank ('')", { recoveryFraction: '' }],
].map(([probe, over]) => ({ probe, refusal: routeYearAt('cng', { ...EGBEMA_ROUTES.cng, ...over }, rowsOf(EGBEMA_GAS), { volumeMMscfd: EGBEMA_PARCEL.volumeMMscfd }).refusal }))
  .concat([{ probe: "CNG on-stream days left blank ('')", refusal: routeYearAt('cng', EGBEMA_ROUTES.cng, rowsOf(EGBEMA_GAS), { volumeMMscfd: EGBEMA_PARCEL.volumeMMscfd, onstreamDays: '' }).refusal }]);

export const blankCostsAt = () => [
  ['both costs typed', routeYearAt('cng')],
  ["variable cost left blank ('')", routeYearAt('cng', { ...EGBEMA_ROUTES.cng, variableOpexPerMscf: '' })],
  ['fixed cost left blank (null)', routeYearAt('cng', { ...EGBEMA_ROUTES.cng, fixedOpexPerYear: null })],
].map(([probe, r]) => ({ probe, ...r }));

/** SECTION 20: the reference cost left blank. */
export const noReferenceCostAt = () => routeYearAt('cng', { ...EGBEMA_ROUTES.cng, referenceCapitalCost: '' });

/** The exponents modularRefinery exports. */
export const scalingExponentsAt = () => Object.entries(MR.SCALING_EXPONENT).map(([k, v]) => ({ name: k, value: v }));

/** The counterfactuals a panel offers as presets. */
export const COUNTERFACTUAL_PRESETS = [
  ...EGBEMA_COUNTERFACTUALS.map((c, i) => [`cng${i}`, c.counterfactualLabel, 'cng', c]),
  ['power', EGBEMA_POWER_COUNTERFACTUAL.counterfactualLabel, 'gas_to_power', EGBEMA_POWER_COUNTERFACTUAL],
];

/** EGBEMA's CNG route against diesel, every input a box. */
export const egbemaCounterfactualInputs = () => ({
  ...EGBEMA_PARCEL, recoveryFraction: EGBEMA_ROUTES.cng.recoveryFraction, ...EGBEMA_COUNTERFACTUALS[0],
});

/**
 * SECTION 21: abatement with the recovered share and the declared
 * counterfactual, exactly as typed. The net minus the gross flare is the
 * digest's own column.
 */
export function counterfactualAt(inputs = egbemaCounterfactualInputs(), rows = rowsOf(EGBEMA_GAS)) {
  const r = FV.abatement({ gas: engineGas(rows), ...inputs });
  if (!r || r.error) return { inputs: { ...inputs }, refusal: (r && r.error) || null };
  const net = r.netAbatementTonnesCo2ePerYear;
  return {
    inputs: { ...inputs },
    refusal: null,
    flareCo2eTonnes: r.flareCo2eTonnes,
    recoveryFraction: orNull(r.recoveryFraction),
    avoidedFlareCo2eTonnes: orNull(r.avoidedFlareCo2eTonnes),
    productCombustionTonnesCo2ePerYear: orNull(r.productCombustionTonnesCo2ePerYear),
    displacedFuelTonnesCo2ePerYear: orNull(r.displacedFuelTonnesCo2ePerYear),
    counterfactualLabel: orNull(r.counterfactualLabel),
    counterfactualDeclared: orNull(r.counterfactualDeclared),
    netAbatementTonnesCo2ePerYear: orNull(net),
    grossClaimIfNoCounterfactual: orNull(r.grossClaimIfNoCounterfactual),
    netLessGrossDerived: net !== null && net !== undefined && Number.isFinite(r.grossClaimIfNoCounterfactual) ? net - r.grossClaimIfNoCounterfactual : null,
    blockedBy: orNull(r.blockedBy),
    warning: orNull(r.warning),
  };
}

/** SECTION 21: the three CNG counterfactuals and gas to power's own. */
export const counterfactualsAt = () => COUNTERFACTUAL_PRESETS.map(([key, , routeId, cf]) => ({
  key, routeId, ...counterfactualAt({ ...EGBEMA_PARCEL, recoveryFraction: EGBEMA_ROUTES[routeId].recoveryFraction, ...cf }),
}));

/** SECTION 21: blocked until declared. */
export const blockedAt = () => [
  ['no GWP', { gwpMethane: '' }],
  ['no recovery fraction', { recoveryFraction: '' }],
  ['recovery 1.5', { recoveryFraction: 1.5 }],
  ['no counterfactual label', { counterfactualLabel: null }],
  ['no displaced fuel figure', { displacedFuelTonnesCo2ePerYear: '' }],
].map(([probe, over]) => ({ probe, ...counterfactualAt({ ...egbemaCounterfactualInputs(), ...over }) }));

/** Credit prices as typed into one box, split at the commas and handed over as typed. */
export const pricesOf = (text) => (blank(text) ? [] : String(text).split(',').map((s) => s.trim()));
export const egbemaCreditInputs = () => ({ prices: EGBEMA_CREDITS.creditPrices.join(', '), hurdleMarginPerYear: EGBEMA_CREDITS.hurdleMarginPerYear });

/**
 * SECTION 22: creditSensitivity on a net abatement and a margin. The first
 * price in the order typed that clears is read off the engine's own points.
 */
export function creditsAt({ net, margin, prices, hurdleMarginPerYear }) {
  const r = FV.creditSensitivity({
    netAbatementTonnesCo2ePerYear: net, grossMarginPerYear: margin, creditPrices: pricesOf(prices), hurdleMarginPerYear,
  });
  if (!r || r.error) return { refusal: (r && r.error) || null };
  const first = (r.points || []).find((p) => p.clearsHurdle === true);
  return {
    refusal: null,
    netAbatementTonnesCo2ePerYear: r.netAbatementTonnesCo2ePerYear,
    points: (r.points || []).map((p) => ({ ...p })),
    hurdleMarginPerYear: orNull(r.hurdleMarginPerYear),
    standsAloneWithoutCredits: orNull(r.standsAloneWithoutCredits),
    breakevenCreditPrice: orNull(r.breakevenCreditPrice),
    lowestTestedClearingPrice: orNull(r.lowestTestedClearingPrice),
    firstTypedClearingPrice: first ? first.creditPrice : null,
    verdict: orNull(r.verdict),
  };
}

/** SECTION 22: EGBEMA's CNG route against diesel. */
export const egbemaCreditsAt = (over = {}) => {
  const cf = counterfactualAt();
  const y = routeYearAt('cng');
  return creditsAt({ net: cf.netAbatementTonnesCo2ePerYear, margin: y.grossMarginPerYear, ...egbemaCreditInputs(), ...over });
};

/** SECTION 22: what creditSensitivity refuses, and what it answers with no verdict. */
export function creditEdgesAt() {
  const cf = counterfactualAt();
  const y = routeYearAt('cng');
  const power = counterfactualsAt().find((c) => c.key === 'power');
  const powerYear = routeYearAt('gas_to_power');
  const C = egbemaCreditInputs();
  return {
    lowHurdle: egbemaCreditsAt({ hurdleMarginPerYear: EGBEMA_LOW_HURDLE }),
    addsEmissions: creditsAt({ net: power.netAbatementTonnesCo2ePerYear, margin: powerYear.grossMarginPerYear, ...C }).refusal,
    noNet: creditsAt({ net: null, margin: undefined, ...C }).refusal,
    badHurdle: creditsAt({ net: cf.netAbatementTonnesCo2ePerYear, margin: y.grossMarginPerYear, prices: '10', hurdleMarginPerYear: 'x' }).refusal,
    noMargin: creditsAt({ net: cf.netAbatementTonnesCo2ePerYear, margin: null, ...C }),
    blankHurdle: creditsAt({ net: cf.netAbatementTonnesCo2ePerYear, margin: y.grossMarginPerYear, prices: C.prices, hurdleMarginPerYear: '' }),
  };
}

/**
 * SECTION 23: compareRoutes over the screenings, the route years and the
 * abatement credited to one route.
 */
export function bidAt({ limits = egbemaLimits(), inputs = egbemaRouteInputs(), rows = rowsOf(EGBEMA_GAS), parcel = egbemaParcel(), credited = { cng: counterfactualAt() } } = {}) {
  const screenings = ROUTE_IDS.map((id) => FV.screenRoute({ route: withLimits(id, (limits || {})[id] || {}), gas: engineGas(rows), volumeMMscfd: parcel.volumeMMscfd }));
  const economics = ROUTE_IDS.map((id) => FV.routeEconomics({ route: templateOf(id), gas: engineGas(rows), volumeMMscfd: parcel.volumeMMscfd, onstreamDays: parcel.onstreamDays, ...((inputs || {})[id] || {}) }));
  const abatements = Object.fromEntries(Object.entries(credited || {}).filter(([, a]) => a && !a.refusal).map(([k, a]) => [k, { netAbatementTonnesCo2ePerYear: a.netAbatementTonnesCo2ePerYear }]));
  const r = FV.compareRoutes({ screenings, economics, abatements });
  if (!r || r.error) return { refusal: (r && r.error) || null };
  return {
    refusal: null,
    rows: (r.rows || []).map((x) => ({ ...x })),
    bestByValuePerMscf: orNull(r.bestByValuePerMscf),
    leaderNotFullyScreened: orNull(r.leaderNotFullyScreened),
    screenedOut: [...(r.screenedOut || [])],
    notFullyScreened: [...(r.notFullyScreened || [])],
    rankingNote: orNull(r.rankingNote),
  };
}
export const bidOpenAt = () => bidAt({ limits: blankLimits(), credited: {} });

// ===========================================================================
// THE ROLLOUT EXPLORER (Expert): SECTIONS 25 TO 36.
// ===========================================================================

/** SECTION 25: LPG_REFERENCE as the engine exports it, and its note. */
export const lpgReferenceAt = () => ({ table: clone(LC.LPG_REFERENCE), note: LC.LPG_PROPERTY_NOTE });

/** A blend as the boxes a panel edits, filled from LPG_REFERENCE's typical figures. */
export const blendRowsOf = (shares) => Object.entries(shares).map(([code, v]) => ({
  code, volumeFraction: v, liquidDensityKgM3: LPG[code].typicalLiquidDensityKgM3, molarMassKgKmol: LPG[code].molarMassKgKmol, latentHeatKJkg: LPG[code].typicalLatentHeatKJkg,
}));
export const BLEND_PRESETS = [['kano', "KANO's blend", KANO_BLEND], ['studio', "The studio's opening blend", STUDIO_BLEND]];

/**
 * SECTION 25: lpgBlendProperties on the three bases it names. Beside it, the
 * latent heat averaged on the volume fractions, as the dump computes it: the
 * reading the engine does not use.
 */
export function blendAt(rows = blendRowsOf(KANO_BLEND)) {
  const r = LC.lpgBlendProperties({ components: rows.map((x) => ({ ...x })) });
  if (!r || r.error) return { rows: clone(rows), refusal: (r && r.error) || null };
  const v = rows.map((x) => num(x.volumeFraction)); const h = rows.map((x) => num(x.latentHeatKJkg));
  const onVol = [...v, ...h].every(Number.isFinite) ? v.reduce((s, x, i) => s + x * h[i], 0) : null;
  return {
    rows: clone(rows),
    refusal: null,
    densityKgM3: r.densityKgM3,
    densityBasis: r.densityBasis,
    latentHeatKJkg: r.latentHeatKJkg,
    latentHeatBasis: r.latentHeatBasis,
    molarMassKgKmol: r.molarMassKgKmol,
    molarMassBasis: r.molarMassBasis,
    massFractions: r.massFractions.map((x) => ({ ...x })),
    latentOnVolumeNotUsed: onVol,
    latentOnVolumeLessEngineNotUsed: onVol !== null ? onVol - r.latentHeatKJkg : null,
  };
}

/** SECTION 25: what lpgBlendProperties refuses. */
export const blendRefusalsAt = () => [
  ['a blank butane volume fraction', blendRowsOf({ propane: 0.35, butane: '' })],
  ['a butane liquid density left blank', blendRowsOf(KANO_BLEND).map((c) => (c.code === 'butane' ? { ...c, liquidDensityKgM3: '' } : c))],
  ['a negative volume fraction', blendRowsOf({ propane: -0.1, butane: 1.1 })],
].map(([probe, rows]) => ({ probe, refusal: blendAt(rows).refusal }));

/** The fill ratio bases the engine takes, read off FILL_RATIO_BASIS. */
export const FILL_BASES = Object.values(LC.FILL_RATIO_BASIS);
export const kanoVesselInputs = () => ({ ...KANO_VESSEL, maxFillRatio: '', fillRatioBasis: '' });

/**
 * SECTION 26: lpgStorageSizing exactly as typed, on the blend's density. Beside
 * it, the same fill limit read on the other basis: the reading the engine does
 * not use for the basis chosen.
 */
export function vesselAt(inputs = kanoVesselInputs(), densityKgM3 = blendAt().densityKgM3) {
  const r = LC.lpgStorageSizing({ ...inputs, liquidDensityKgM3: densityKgM3 });
  const out = { inputs: { ...inputs }, densityKgM3: orNull(densityKgM3), refusal: (r && r.error) || null };
  if (!r || r.error) return out;
  const other = FILL_BASES.find((b) => b !== r.fillRatioBasis);
  const o = LC.lpgStorageSizing({ ...inputs, fillRatioBasis: other, liquidDensityKgM3: densityKgM3 });
  const otherTonnes = o && !o.error ? o.usableTonnes : null;
  return {
    ...out,
    usableM3: r.usableM3,
    usableTonnes: r.usableTonnes,
    vapourSpaceM3: r.vapourSpaceM3,
    fillRatioBasis: r.fillRatioBasis,
    coverDays: r.coverDays,
    missingInputs: [...(r.missingInputs || [])],
    safetyStockTonnes: r.safetyStockTonnes,
    reorderAtTonnes: r.reorderAtTonnes,
    ullageAtReorderTonnes: r.ullageAtReorderTonnes,
    deliveryTonnes: r.deliveryTonnes,
    deliveryFitsUllage: r.deliveryFitsUllage,
    deliveryWarning: orNull(r.deliveryWarning),
    deliveriesPerMonth: r.deliveriesPerMonth,
    otherBasis: other || null,
    otherBasisTonnesNotUsed: otherTonnes,
    otherBasisLessEngineNotUsed: otherTonnes !== null ? otherTonnes - r.usableTonnes : null,
  };
}
export const kanoVesselsAt = () => KANO_FILL_LIMITS.map((f) => vesselAt({ ...KANO_VESSEL, ...f }));

/** SECTION 26: what lpgStorageSizing refuses, and the blank lead time. */
export function vesselEdgesAt() {
  const rho = blendAt().densityKgM3;
  return {
    refusals: [
      ['fill limit left blank', { ...KANO_VESSEL }, rho],
      ['fill limit 1', { ...KANO_VESSEL, maxFillRatio: 1 }, rho],
      ["basis typed as 'weight'", { ...KANO_VESSEL, maxFillRatio: 0.42, fillRatioBasis: 'weight' }, rho],
      ['a filling density of 0.6 on water capacity at the KANO blend density', { ...KANO_VESSEL, maxFillRatio: 0.6, fillRatioBasis: 'water_capacity_mass' }, rho],
      ['no liquid density', { ...KANO_VESSEL, maxFillRatio: 0.85 }, null],
    ].map(([probe, inputs, d]) => ({ probe, refusal: vesselAt(inputs, d).refusal })),
    blankLead: vesselAt({ ...KANO_VESSEL, ...KANO_FILL_LIMITS[0], leadTimeDays: '' }),
    waterKgM3: LC.WATER_KG_M3,
  };
}

/** KANO's vaporizer, with the boiling point blank until the learner types the one at the vaporizer's pressure. */
export const kanoVaporizerInputs = () => ({ ...KANO_VAPORIZER, boilingPointC: '' });

/** SECTION 27: vaporizerDuty exactly as typed, on the blend's latent heat. */
export function vaporizerAt(inputs = kanoVaporizerInputs(), latentHeatKJkg = blendAt().latentHeatKJkg) {
  const r = LC.vaporizerDuty({ ...inputs, latentHeatKJkg });
  if (!r || r.error) return { inputs: { ...inputs }, latentHeatKJkg: orNull(latentHeatKJkg), refusal: (r && r.error) || null };
  return {
    inputs: { ...inputs },
    latentHeatKJkg,
    refusal: null,
    complete: r.complete,
    terms: r.terms.map((t) => ({ ...t })),
    dutyKW: r.dutyKW,
    designDutyKW: r.designDutyKW,
    missingTerms: [...(r.missingTerms || [])],
    note: orNull(r.note),
  };
}
export const kanoVaporizerAt = () => vaporizerAt({ ...KANO_VAPORIZER });

/** SECTION 27: n-butane's atmospheric boiling point, read from LPG_REFERENCE for the refusal it earns. */
export const BUTANE_ATMOSPHERIC_BOILING_C = LPG.butane.typicalBoilingPointC;
export const vaporizerRefusalsAt = () => [
  [`boiling point ${BUTANE_ATMOSPHERIC_BOILING_C} C, liquid in at ${KANO_VAPORIZER.inletTempC} C`, { ...KANO_VAPORIZER, boilingPointC: BUTANE_ATMOSPHERIC_BOILING_C }, undefined],
  [`vapour out at 30 C, below the ${KANO_VAPORIZER.boilingPointC} C boiling point`, { ...KANO_VAPORIZER, outletTempC: 30 }, undefined],
  ['no latent heat', { ...KANO_VAPORIZER }, null],
  ['a design margin of -5 percent', { ...KANO_VAPORIZER, designMarginPercent: -5 }, undefined],
].map(([probe, inputs, lh]) => ({ probe, refusal: vaporizerAt(inputs, lh === null ? null : blendAt().latentHeatKJkg).refusal }));

/** SECTION 28: bottlingPlant exactly as typed. */
export function carouselAt(inputs = KANO_BOTTLING) {
  const r = LC.bottlingPlant({ ...inputs });
  if (!r || r.error) return { inputs: { ...inputs }, refusal: (r && r.error) || null };
  return {
    inputs: { ...inputs },
    refusal: null,
    arrivalsPerHour: r.arrivalsPerHour,
    effectivePositions: r.effectivePositions,
    queuePositions: r.queuePositions,
    positionRoundingNote: orNull(r.positionRoundingNote),
    minimumPositionsForThroughput: r.minimumPositionsForThroughput,
    queue: {
      offered: orNull(r.queue.offered),
      utilisation: orNull(r.queue.utilisation),
      stable: orNull(r.queue.stable),
      probabilityOfWaiting: orNull(r.queue.probabilityOfWaiting),
      averageWaitMinutes: orNull(r.queue.averageWaitMinutes),
      queueLength: orNull(r.queue.queueLength),
      message: orNull(r.queue.error),
    },
    throughputCapacityPerDay: r.throughputCapacityPerDay,
    meetsDemand: r.meetsDemand,
    note: orNull(r.note),
  };
}

/** SECTION 28: the positions wholly working, one more, and the count typed, each at availability 1. */
export function positionsSweepAt(inputs = KANO_BOTTLING) {
  const k = carouselAt(inputs);
  if (k.refusal) return [];
  return [k.queuePositions, k.queuePositions + 1, inputs.positions].map((n) => ({ positions: n, ...carouselAt({ ...inputs, positions: n, availabilityFraction: 1 }) }));
}
export const studioCarouselAt = () => carouselAt(SUITE_ROLLOUT.bottling);
export const carouselRefusalsAt = () => [
  ['one position at availability 0.4', { ...KANO_BOTTLING, positions: 1, availabilityFraction: 0.4 }],
  ["shift hours left blank ('')", { ...KANO_BOTTLING, shiftHoursPerDay: '' }],
  ['availability 1.2', { ...KANO_BOTTLING, availabilityFraction: 1.2 }],
  ['no fill time', { ...KANO_BOTTLING, fillMinutesPerCylinder: '' }],
].map(([probe, inputs]) => ({ probe, refusal: carouselAt(inputs).refusal }));

/** SECTION 29: assetFloat by Little's law, exactly as typed. */
export function floatAt({ unitsPerDay, cycleStages, sparesFraction }) {
  const r = LC.assetFloat({ unitsPerDay, cycleStages: (cycleStages || []).map((s) => ({ ...s })), sparesFraction });
  if (!r || r.error) return { refusal: (r && r.error) || null };
  return {
    refusal: null,
    stages: r.stages.map((s) => ({ ...s })),
    cycleDays: r.cycleDays,
    inCirculation: r.inCirculation,
    sparesAllowance: r.sparesAllowance,
    fleetRequired: r.fleetRequired,
    spareCapacityUnits: r.spareCapacityUnits,
    dominantStage: r.dominantStage,
    basis: orNull(r.basis),
  };
}
export const kanoCylindersInputs = () => ({ unitsPerDay: KANO_BOTTLING.cylindersPerDay, cycleStages: clone(KANO_CYLINDER_CYCLE), sparesFraction: KANO_CYLINDER_SPARES });
export const ibafoTrailersInputs = () => ({ unitsPerDay: IBAFO_TRAILER_TRIPS, cycleStages: clone(IBAFO_TRAILER_CYCLE), sparesFraction: IBAFO_TRAILER_SPARES });
export const floatRefusalsAt = () => [
  ['KANO\'s cycle with "At the customer" left blank', { ...kanoCylindersInputs(), cycleStages: KANO_CYLINDER_CYCLE.map((s, i) => (i === 0 ? { ...s, days: '' } : s)) }],
  ['no stages', { unitsPerDay: 10, cycleStages: [] }],
  ['a negative spares allowance', { unitsPerDay: 10, cycleStages: [{ label: 'x', days: 1 }], sparesFraction: -0.1 }],
].map(([probe, inputs]) => ({ probe, refusal: floatAt(inputs).refusal }));

/** The pressure basis every CNG result names. */
export const PRESSURE_BASIS = LC.PRESSURE_BASIS;
export const DAK_RANGE = { ...LC.DAK_RANGE };

/**
 * SECTION 30: gasMassInVessel. With the gauge toggle on, the pressure typed is
 * a gauge reading and the engine is given the gauge plus the stated atmosphere,
 * as the dump gives it; the gauge reading typed as if absolute is shown beside
 * it, the reading the engine does not use.
 */
export function bankAt({ volumeM3, pressureBar, temperatureC, gasSg, gauge = false, atmosphereBar = '' }) {
  const p = num(pressureBar); const a = num(atmosphereBar);
  const sent = gauge ? (Number.isFinite(p) && Number.isFinite(a) ? p + a : '') : pressureBar;
  const r = LC.gasMassInVessel({ volumeM3, pressureBar: sent, temperatureC, gasSg });
  const base = { inputs: { volumeM3, pressureBar, temperatureC, gasSg, gauge, atmosphereBar }, pressureSentBar: sent === '' ? null : Number(sent) };
  if (!r || r.error) return { ...base, refusal: (r && r.error) || null };
  let asGauge = null;
  if (gauge) {
    const g = LC.gasMassInVessel({ volumeM3, pressureBar, temperatureC, gasSg });
    asGauge = g && !g.error ? g.massKg : null;
  }
  return {
    ...base,
    refusal: null,
    z: r.z,
    ppr: r.ppr,
    tpr: r.tpr,
    correlationInRange: r.correlationInRange,
    correlationNote: orNull(r.correlationNote),
    massKg: r.massKg,
    idealMassKg: r.idealMassKg,
    realVersusIdeal: r.realVersusIdeal,
    pressureBasis: r.pressureBasis,
    gaugeAsAbsoluteMassNotUsed: asGauge,
    absoluteLessGaugeAsAbsoluteNotUsed: asGauge !== null ? r.massKg - asGauge : null,
  };
}
/** IBAFO's Mid bank as the boxes a panel edits, read as absolute; and the gauge case. */
export const ibafoBankInputs = () => ({
  volumeM3: IBAFO_BANKS[1].volumeM3, pressureBar: IBAFO_BANKS[1].pressureBar, ...IBAFO_GAS, gauge: false, atmosphereBar: IBAFO_GAUGE.atmosphereBar,
});
export const ibafoGaugeInputs = () => ({
  volumeM3: IBAFO_GAUGE.volumeM3, pressureBar: IBAFO_GAUGE.gaugeBar, ...IBAFO_GAS, gauge: true, atmosphereBar: IBAFO_GAUGE.atmosphereBar,
});
export const ibafoBanksAt = () => IBAFO_BANKS.map((b) => ({ label: b.label, ...bankAt({ volumeM3: b.volumeM3, pressureBar: b.pressureBar, ...IBAFO_GAS }) }));
export const ibafoGaugeAt = () => bankAt({ volumeM3: IBAFO_GAUGE.volumeM3, pressureBar: IBAFO_GAUGE.gaugeBar, ...IBAFO_GAS, gauge: true, atmosphereBar: IBAFO_GAUGE.atmosphereBar });
export const coldBankAt = () => bankAt({ volumeM3: 2, pressureBar: 250, temperatureC: -80, gasSg: IBAFO_GAS.gasSg });
export const bankRefusalsAt = () => [
  ['no pressure', { volumeM3: 2, pressureBar: '', ...IBAFO_GAS }],
  ["gas gravity left blank ('')", { volumeM3: 2, pressureBar: 250, temperatureC: 30, gasSg: '' }],
  ['no temperature', { volumeM3: 2, pressureBar: 250, temperatureC: '', gasSg: 0.62 }],
].map(([probe, inputs]) => ({ probe, refusal: bankAt(inputs).refusal }));

export const ibafoCascadeInputs = () => ({ banks: clone(IBAFO_BANKS), ...IBAFO_VEHICLE, ...IBAFO_GAS });

/**
 * SECTION 31: cascadeFills exactly as typed. storedKg minus deliveredKg minus
 * leftInBanksKg is the digest's own ledger column. Beside it, the same total
 * volume as one bank at the middle bank's pressure, the comparison the dump
 * runs: the one-bank reading.
 */
export function cascadeAt(inputs = ibafoCascadeInputs()) {
  const { banks, ...rest } = inputs;
  const r = LC.cascadeFills({ banks: (banks || []).map((b) => ({ ...b })), ...rest });
  if (!r || r.error) return { inputs: clone(inputs), refusal: (r && r.error) || null };
  const vols = (banks || []).map((b) => num(b.volumeM3));
  const mid = (banks || [])[Math.floor((banks || []).length / 2)] || null;
  let one = null;
  if (vols.length && vols.every(Number.isFinite) && mid) {
    const total = vols.reduce((s, v) => s + v, 0);
    const o = LC.cascadeFills({ banks: [{ label: 'One bank', volumeM3: total, pressureBar: mid.pressureBar }], ...rest });
    one = o && !o.error ? {
      volumeM3: total, pressureBar: mid.pressureBar, atBank: mid.label, fillsBeforeRecharge: o.fillsBeforeRecharge, cascadeEfficiency: o.cascadeEfficiency, leftInBanksKg: o.leftInBanksKg,
    } : null;
  }
  return {
    inputs: clone(inputs),
    refusal: null,
    kgPerFill: r.kgPerFill,
    fillsBeforeRecharge: r.fillsBeforeRecharge,
    fills: r.fills.map((f) => ({ ...f, banks: [...f.banks] })),
    deliveredKg: r.deliveredKg,
    storedKg: r.storedKg,
    leftInBanksKg: r.leftInBanksKg,
    ledgerDerivedKg: r.storedKg - r.deliveredKg - r.leftInBanksKg,
    cascadeEfficiency: r.cascadeEfficiency,
    banksAfter: r.banksAfter.map((b) => ({ ...b })),
    nextVehicleReachesBar: r.nextVehicleReachesBar,
    hitFillLimit: r.hitFillLimit,
    pressureBasis: r.pressureBasis,
    note: orNull(r.note),
    oneBank: one,
  };
}
export const studioCascadeAt = () => cascadeAt({
  banks: clone(SUITE_ROLLOUT.banks), vehicleTankM3: SUITE_ROLLOUT.vehicleTankM3, vehicleStartBar: SUITE_ROLLOUT.vehicleStartBar,
  vehicleTargetBar: SUITE_ROLLOUT.vehicleTargetBar, temperatureC: SUITE_ROLLOUT.temperatureC, gasSg: SUITE_ROLLOUT.gasSg,
});
export const cascadeRefusalsAt = () => [
  ['a target below the start', { banks: clone(IBAFO_BANKS), vehicleTankM3: 0.1, vehicleStartBar: 200, vehicleTargetBar: 25, ...IBAFO_GAS }],
  ['no banks', { ...ibafoCascadeInputs(), banks: [] }],
  ['a bank with no pressure', { ...ibafoCascadeInputs(), banks: [{ label: 'Low', volumeM3: 2, pressureBar: '' }] }],
  ["temperature left blank ('')", { ...ibafoCascadeInputs(), temperatureC: '' }],
].map(([probe, inputs]) => ({ probe, refusal: cascadeAt(inputs).refusal }));

export const ibafoCompressionInputs = () => ({ ...IBAFO_COMPRESSION, gasSg: IBAFO_GAS.gasSg });

/**
 * SECTION 32: cngCompression as a UNIT BRIDGE and nothing more. A panel reads
 * the standard volume, the suction in psia (the suction bar(a) times the
 * engine's PSI_PER_BAR, as the dump prints it) and the stage pressures. No
 * power, temperature or head leaves this reader: those are the Facilities
 * engine's, taught and graded in its own course.
 */
export function compressionAt(inputs = ibafoCompressionInputs()) {
  const r = LC.cngCompression({ ...inputs });
  if (!r || r.error) return { inputs: { ...inputs }, refusal: (r && r.error) || null };
  const s = num(inputs.suctionBar);
  return {
    inputs: { ...inputs },
    refusal: null,
    qMMscfd: r.qMMscfd,
    suctionPsia: Number.isFinite(s) ? s * LC.PSI_PER_BAR : null,
    stageCount: r.stageCount,
    stages: r.stages.map((x) => ({ stage: x.stage, suctionBar: x.suctionBar, dischargeBar: x.dischargeBar, ratio: x.ratio })),
    pressureBasis: r.pressureBasis,
    basis: r.basis,
  };
}
export const compressionRefusalsAt = () => [
  ['discharge below suction', { ...ibafoCompressionInputs(), dischargeBar: 3 }],
  ['no throughput', { ...ibafoCompressionInputs(), throughputKgPerHour: '' }],
].map(([probe, inputs]) => ({ probe, refusal: compressionAt(inputs).refusal }));

/** SECTION 33: cngDispensing exactly as typed. An unstable forecourt is an answer. */
export function forecourtAt({ vehiclesPerHour, fillMinutes, dispensers, kgPerFill }) {
  const r = LC.cngDispensing({ vehiclesPerHour, fillMinutes, dispensers, kgPerFill });
  if (!r || r.error) return { refusal: (r && r.error) || null };
  return {
    refusal: null,
    queue: {
      utilisation: orNull(r.queue.utilisation),
      stable: orNull(r.queue.stable),
      probabilityOfWaiting: orNull(r.queue.probabilityOfWaiting),
      averageWaitMinutes: orNull(r.queue.averageWaitMinutes),
      message: orNull(r.queue.error),
    },
    kgPerHour: orNull(r.kgPerHour),
    note: orNull(r.note),
  };
}
/** IBAFO's forecourt as the boxes a panel edits, on the first dispenser count the digest runs. */
export const ibafoForecourtInputs = () => ({
  vehiclesPerHour: IBAFO_DISPENSING.vehiclesPerHour, fillMinutes: IBAFO_DISPENSING.fillMinutes, dispensers: IBAFO_DISPENSING.dispenserCounts[0],
});
export const ibafoForecourtAt = () => {
  const kg = cascadeAt().kgPerFill;
  return IBAFO_DISPENSING.dispenserCounts.map((n) => ({
    dispensers: n, ...forecourtAt({ vehiclesPerHour: IBAFO_DISPENSING.vehiclesPerHour, fillMinutes: IBAFO_DISPENSING.fillMinutes, dispensers: n, kgPerFill: kg }),
  }));
};
export const overloadAt = () => forecourtAt({ vehiclesPerHour: FORECOURT_OVERLOAD, fillMinutes: IBAFO_DISPENSING.fillMinutes, dispensers: 2 });
export const forecourtRefusalsAt = () => [
  ['2.5 dispensers', { vehiclesPerHour: IBAFO_DISPENSING.vehiclesPerHour, fillMinutes: IBAFO_DISPENSING.fillMinutes, dispensers: 2.5 }],
  ['no fill time', { vehiclesPerHour: IBAFO_DISPENSING.vehiclesPerHour, fillMinutes: '', dispensers: 2 }],
].map(([probe, inputs]) => ({ probe, refusal: forecourtAt(inputs).refusal }));

/** The bus operator's switch with the efficiency ratio blank, the one input the engine will not assume. */
export const ibafoSwitchInputs = () => ({ ...clone(IBAFO_CONVERSION), newFuel: { ...IBAFO_CONVERSION.newFuel, efficiencyRatio: '' } });

/** SECTION 34: conversionEconomics exactly as typed. */
export function switchAt(inputs = IBAFO_CONVERSION) {
  const r = LC.conversionEconomics(clone(inputs));
  if (!r || r.error) return { inputs: clone(inputs), refusal: (r && r.error) || null };
  return {
    inputs: clone(inputs),
    refusal: null,
    consumptionSource: r.consumptionSource,
    newFuelConsumptionPer100Km: r.newFuelConsumptionPer100Km,
    baseFuel: { ...r.baseFuel },
    newFuel: { ...r.newFuel },
    annualSaving: r.annualSaving,
    savingPerKm: r.savingPerKm,
    simplePaybackYears: r.simplePaybackYears,
    kgCo2eAvoidedPerYear: orNull(r.kgCo2eAvoidedPerYear),
    paybackNote: orNull(r.paybackNote),
    annualCashFlow: { ...r.annualCashFlow },
  };
}
export const RATIO_SWEEP = [0.8, IBAFO_CONVERSION.newFuel.efficiencyRatio, 1];
export const ratioSweepAt = () => RATIO_SWEEP.map((e) => ({ ratio: e, ...switchAt({ ...IBAFO_CONVERSION, newFuel: { ...IBAFO_CONVERSION.newFuel, efficiencyRatio: e } }) }));
export const switchEdgesAt = () => ({
  measured: switchAt({ ...IBAFO_CONVERSION, newFuel: { ...IBAFO_CONVERSION.newFuel, consumptionPer100Km: 9.5 } }),
  noSaving: switchAt({ ...IBAFO_CONVERSION, newFuel: { ...IBAFO_CONVERSION.newFuel, pricePerUnit: 1100 } }),
  noRatio: switchAt({ ...IBAFO_CONVERSION, newFuel: { ...IBAFO_CONVERSION.newFuel, efficiencyRatio: '' } }).refusal,
  noDistance: switchAt({ ...IBAFO_CONVERSION, annualDistanceKm: '' }).refusal,
});

// ===========================================================================
// The whole surface.
// ===========================================================================

/** Every reader at its defaults: the snapshot the clock and zone gates compare. */
export function teachingSurface() {
  return {
    engines: enginesAt(),
    reference: referenceAt(),
    pure: pureComponentsAt(),
    egbema: presetGasAt('egbema'),
    egbemaShort: presetGasAt('egbema_short'),
    oguta: presetGasAt('oguta'),
    studio: presetGasAt('studio'),
    carbonProbe: carbonProbeAt(),
    analysisRefusals: analysisRefusalsAt(),
    richnessEdges: richnessEdgesAt(),
    missingProbes: missingProbesAt(),
    flareMolarMasses: flareMolarMassesAt(),
    blankFlare: flareAt(rowsOf(EGBEMA_GAS)),
    egbemaFlare: egbemaFlareAt(),
    passThrough: passThroughAt(),
    standIn: standInAt(),
    destructionSweep: destructionSweepAt(),
    gwpSweep: gwpSweepAt(),
    noGwp: noGwpAt(),
    flareRefusals: flareRefusalsAt(),
    omittedDays: omittedDaysAt(),
    studioFlare: studioFlareAt(),
    templates: routeTemplatesAt(),
    screens: screensAt(),
    openScreens: screensAt(blankLimits()),
    screenRefusal: screenRefusalAt(),
    yieldChecks: yieldChecksAt(),
    ceilings: { egbema: ceilingsAt(rowsOf(EGBEMA_GAS)), oguta: ceilingsAt(rowsOf(OGUTA_LEAN_GAS)), studio: ceilingsAt(rowsOf(SUITE_FLARE.gas)) },
    yieldRefusals: yieldRefusalsAt(),
    studioLpg: studioLpgAt(),
    routeYears: routeYearsAt(),
    routeRefusals: routeRefusalsAt(),
    blankCosts: blankCostsAt(),
    noReferenceCost: noReferenceCostAt(),
    exponents: scalingExponentsAt(),
    counterfactuals: counterfactualsAt(),
    blocked: blockedAt(),
    credits: egbemaCreditsAt(),
    creditEdges: creditEdgesAt(),
    bid: bidAt(),
    bidOpen: bidOpenAt(),
    lpgReference: lpgReferenceAt(),
    kanoBlend: blendAt(),
    studioBlend: blendAt(blendRowsOf(STUDIO_BLEND)),
    blendRefusals: blendRefusalsAt(),
    kanoVessels: kanoVesselsAt(),
    vesselStart: vesselAt(),
    vesselEdges: vesselEdgesAt(),
    vaporizerStart: vaporizerAt(),
    kanoVaporizer: kanoVaporizerAt(),
    vaporizerRefusals: vaporizerRefusalsAt(),
    carousel: carouselAt(),
    positionsSweep: positionsSweepAt(),
    studioCarousel: studioCarouselAt(),
    carouselRefusals: carouselRefusalsAt(),
    cylinders: floatAt(kanoCylindersInputs()),
    trailers: floatAt(ibafoTrailersInputs()),
    floatRefusals: floatRefusalsAt(),
    banks: ibafoBanksAt(),
    gauge: ibafoGaugeAt(),
    cold: coldBankAt(),
    bankRefusals: bankRefusalsAt(),
    cascade: cascadeAt(),
    studioCascade: studioCascadeAt(),
    cascadeRefusals: cascadeRefusalsAt(),
    compression: compressionAt(),
    compressionRefusals: compressionRefusalsAt(),
    forecourt: ibafoForecourtAt(),
    overload: overloadAt(),
    forecourtRefusals: forecourtRefusalsAt(),
    switchStart: switchAt(ibafoSwitchInputs()),
    ibafoSwitch: switchAt(),
    ratioSweep: ratioSweepAt(),
    switchEdges: switchEdgesAt(),
  };
}
