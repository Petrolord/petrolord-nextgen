// Teaching lab for the carbon course, "Carbon & Energy Efficiency" (academy
// module energy_transition). The three explorer panels, the course learning
// page and the vitest files all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every tonne, line,
// inventory, intensity, stoichiometric figure, excess air, loss, efficiency,
// saving, trap loss, condensate value, pinch target, cost per tonne, curve,
// verdict, path, priced saving and energy intensity below is a return value of
// engines/downstream/carbonAbatement.js or engines/downstream/energyEfficiency.js
// as vendored at petrolord-engines f0aef14. This is the ONLY file in the course
// that imports either module, and it restates none of their formulas.
//
// WHERE A FIGURE IS ARITHMETIC ON ENGINE RETURNS, the digest prints it as
// "computed here" and so does this lab, under a key that says so (computedHere):
// the flare's methane share and its gap to the flare read as complete
// combustion, each line's share of the total, the difference between two GWP
// sets, the LHV and HHV gap, the percentage-point shortcut (the digest's
// contrast figure), the exponent ratio of the trap, the plain mean of the costs
// per tonne, the capital set against one year, the target at 30 percent of the
// inventory and its straight line, and the source emission the Carbon Studio
// passes to the curve (CO2 plus methane in CO2e). Each is the dump's own
// arithmetic, copied from tools/course-waves/carbon/carbon_dump.mjs.
//
// A MISSING INPUT IS MISSING. Every reader hands its inputs to the engine as it
// received them: a blank control arrives as '' and the engine reads it as
// missing. No reader fills a destruction efficiency, a GWP, a factor, a safe
// oxygen floor, a radiation loss, a discharge coefficient, an exponent, a boiler
// efficiency, hours a year, a capital cost or a discount rate from anywhere.
//
// NOTHING PUBLISHED IS SHIPPED. The four GWP sets are the digest's, each with
// its report, horizon and source line. Every factor, price and cost is the
// wave's invented one, and the electricity and fuel factors are SYNTHETIC.
//
// EVERY REFUSAL IS THE ENGINE'S OWN SENTENCE, carried from the engine's `error`
// key. No refusal is written as a literal in this directory, and carbonLab.test.js
// asserts that over the lab, every panel and the page.
//
// THE CLOCK. Neither engine reads a date or a random number, so no reader takes
// a date. carbonLab.test.js rebuilds the whole snapshot under two faked system
// dates and under TZ=Pacific/Pago_Pago and TZ=Pacific/Kiritimati and demands the
// same bytes.
//
// THE ENGINE FOLLOW-UP (MD45-1). The readers pass the engines everything the
// follow-up reads: a refused measure goes to abatementCurve with its label, and
// every panel shows targetBasis, a refused-measure list, a stack loss basis
// refusal and an inventory's blocked lines whenever the engine returns them. No
// reader assumes the verdict or the line list the engines return today.
//
// THE TEACHING CASES are the wave's own records, copied VERBATIM below from
// tools/course-waves/carbon/carbon_fields.mjs, which carbon_dump.mjs imports.
// carbonLab.test.js reads that file through tools/course-waves/waveInputs.mjs,
// compares the block with it byte for byte and imports it to compare every
// value. The capstone runs three other records, and nothing here reads them.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

/* eslint-disable import/namespace */
import * as CA from '@petrolord/engines/engines/downstream/carbonAbatement.js';
import * as EE from '@petrolord/engines/engines/downstream/energyEfficiency.js';

/** The two vendored modules, for the resolution and clock tests and nothing else. */
export const ENGINE = Object.freeze({ CA, EE });

// ---- BEGIN VERBATIM carbon_fields.mjs ----
/* ------------------------------------------------------------------ *
 * THE GWP SETS. The engine ships none (makeGwpSet takes them as inputs).
 * Values as the GHG Protocol tabulates them, 100-year horizon.
 * ------------------------------------------------------------------ */
export const GWP_SOURCE = 'GHG Protocol, "IPCC Global Warming Potential Values", version 2.0, 7 August 2024, adapted from IPCC AR6 WG1 chapter 7 (section 7.6.1.1) and IPCC AR5 WG1 chapter 8';
export const GWP_HORIZON = '100-year (GWP100)';
export const GWP_SETS = {
  ar6Fossil: { label: 'IPCC AR6 GWP100, fossil methane', report: 'AR6', values: { CH4: 29.8, N2O: 273 } },
  ar6NonFossil: { label: 'IPCC AR6 GWP100, non-fossil methane', report: 'AR6', values: { CH4: 27.0, N2O: 273 } },
  ar5Fossil: { label: 'IPCC AR5 GWP100, fossil methane', report: 'AR5', values: { CH4: 30, N2O: 265 } },
  ar5NonFossil: { label: 'IPCC AR5 GWP100, non-fossil methane', report: 'AR5', values: { CH4: 28, N2O: 265 } },
};
/** The set the course computes its inventories on, and why (FINDINGS-carbon C10). */
export const COURSE_SET = 'ar6Fossil';

/* ------------------------------------------------------------------ *
 * IGBOGENE (Associate)
 * ------------------------------------------------------------------ */
export const IGBOGENE_HEATERS = { fuelKmolPerYear: 482000, carbonPerKmolFuel: 1.09, destructionEfficiencyFraction: 1 };
export const IGBOGENE_FLARE = { fuelKmolPerYear: 38500, carbonPerKmolFuel: 1.32 };
/** The flare's destruction efficiency, as the operator's flare study states it (invented). */
export const IGBOGENE_FLARE_DE = 0.98;
export const IGBOGENE_FLARE_SWEEP = [1, 0.99, 0.98, 0.95, 0.9];
export const IGBOGENE_VENT = {
  label: 'Vented and fugitive methane', scope: 1, activity: 142, activityUnit: 't CH4',
  factor: { label: 'Measured methane mass', value: 1, unit: 'tCH4/t', gas: 'CH4', source: 'Epie Creek leak detection survey (invented)', version: '2026 Q2', vintage: '2026' },
};
export const IGBOGENE_POWER = {
  label: 'Purchased electricity', scope: 2, activity: 31500, activityUnit: 'MWh',
  factor: { label: 'Grid electricity factor (SYNTHETIC)', value: 0.41, unit: 'tCO2/MWh', gas: 'CO2', source: 'Supplier statement (invented)', version: '2025', vintage: '2025' },
};
export const IGBOGENE_INTENSITY = { denominatorValue: 3650000, denominatorUnit: 'barrel of oil equivalent produced', boundaryLabel: 'Igbogene flow station and gas plant, inlet to export' };
/** The same plant measured against a second boundary (the oil it exports alone). */
export const IGBOGENE_INTENSITY_ALT = { denominatorValue: 2410000, denominatorUnit: 'barrel of oil exported', boundaryLabel: 'Igbogene crude export only' };

/* ------------------------------------------------------------------ *
 * ISIOKPO (Professional)
 * ------------------------------------------------------------------ */
/** The fuel gas analysis, mole fractions (invented). Heating values: the engine's typical reference. */
export const ISIOKPO_FUEL = [['CH4', 0.868], ['C2H6', 0.071], ['C3H8', 0.021], ['CO2', 0.025], ['N2', 0.015]];
export const ISIOKPO_HEATER = {
  stackTempC: 238, combustionAirTempC: 28, currentO2Percent: 5.5, targetO2Percent: 2.8,
  minimumSafeO2Percent: 2.0, radiationLossPercent: 1.8, unburnedLossPercent: 0,
  annualFuelEnergyGJ: 410000,
};
export const ISIOKPO_O2_SWEEP = [0, 1, 2, 2.8, 4, 5.5, 8, 12];
export const ISIOKPO_TRAP = {
  orificeDiameterMm: 4, upstreamPressureBarA: 9.0, dischargeCoefficient: 0.72, steamDensityKgM3: 4.65,
  specificHeatRatio: 1.135, hoursPerYear: 8400, steamCostPerTonne: 22, steamEnergyMJPerTonne: 2650,
  boilerEfficiencyFraction: 0.83, emissionFactorKgCo2ePerGJ: 56.1,
};
export const ISIOKPO_CONDENSATE = {
  steamTonnesPerHour: 16, currentReturnFraction: 0.35, targetReturnFraction: 0.65, condensateTempC: 92,
  makeupTempC: 27, boilerEfficiencyFraction: 0.83, fuelCostPerGJ: 7.5, waterCostPerTonne: 0.55,
  treatmentCostPerTonne: 1.35, emissionFactorKgCo2ePerGJ: 56.1, hoursPerYear: 8400,
};
export const ISIOKPO_STREAMS = [
  { label: 'H1 compressor aftercooler', supplyC: 163, targetC: 48, cpKWperK: 3.15 },
  { label: 'H2 lean oil cooler', supplyC: 118, targetC: 41, cpKWperK: 5.7 },
  { label: 'C1 rich oil preheat', supplyC: 32, targetC: 141, cpKWperK: 4.35 },
  { label: 'C2 stabiliser feed', supplyC: 57, targetC: 104, cpKWperK: 2.4 },
];
export const ISIOKPO_DTMIN = [10, 15, 20];
export const ISIOKPO_DTMIN_CASE = 15;

/* ------------------------------------------------------------------ *
 * AGBOR (Expert)
 * ------------------------------------------------------------------ */
export const AGBOR_DISCOUNT_RATE = 0.1;
/** Money in US dollars, every figure invented. actsOn names the source a measure reduces. */
export const AGBOR_MEASURES = [
  { label: 'Tune the fired heaters', capitalCost: 18000, annualSavings: 132000, annualCost: 0, tonnesAbatedPerYear: 760, lifeYears: 5, actsOn: ['heaters'], startYear: 2027 },
  { label: 'Repair failed steam traps', capitalCost: 45000, annualSavings: 198000, annualCost: 0, tonnesAbatedPerYear: 1150, lifeYears: 3, actsOn: ['steam'], startYear: 2027 },
  { label: 'Heat integration project', capitalCost: 2750000, annualSavings: 410000, annualCost: 0, tonnesAbatedPerYear: 3400, lifeYears: 15, actsOn: ['heaters'], startYear: 2029 },
  { label: 'Flare gas recovery', capitalCost: 4900000, annualSavings: 265000, annualCost: 105000, tonnesAbatedPerYear: 6200, lifeYears: 15, actsOn: ['flare'], startYear: 2030 },
  { label: 'Solar for purchased power', capitalCost: 1850000, annualSavings: 142000, annualCost: 21000, tonnesAbatedPerYear: 2100, lifeYears: 20, actsOn: ['power'], startYear: 2028 },
  { label: 'Vapour recovery on the storage tanks', capitalCost: 610000, annualSavings: 38000, annualCost: 14000, tonnesAbatedPerYear: 1850, lifeYears: 12, actsOn: ['vents'], startYear: 2031 },
];
/** The Agbor inventory the measures act on, one engine call per source. */
export const AGBOR_SOURCES = {
  heaters: { fuelKmolPerYear: 715000, carbonPerKmolFuel: 1.11, destructionEfficiencyFraction: 1 },
  flare: { fuelKmolPerYear: 104000, carbonPerKmolFuel: 1.38, destructionEfficiencyFraction: 0.98 },
};
export const AGBOR_VENT_T_CH4 = 88;
export const AGBOR_POWER = { activity: 26800, factor: 0.41 };
/** A flare recovery claim above what the flare emits, for the over-claim demonstration. */
export const AGBOR_FLARE_OVERCLAIM_T = 9400;
export const AGBOR_PLAN = { startYear: 2026, endYear: 2033, targetReductionPercentByEnd: 30 };
/** One saving priced in money and carbon (priceSaving). */
export const AGBOR_SAVING = {
  energySavedGJ: 11800, fuelCostPerGJ: 7.5, emissionFactorKgCo2ePerGJ: 56.1,
  implementationCost: 210000, lifeYears: 8, discountRate: 0.1,
};
export const AGBOR_ENERGY = {
  streams: [
    { label: 'Fuel gas', energyGJ: 740000 },
    { label: 'Purchased power', energyGJ: 96000 },
    { label: 'Imported steam', energyGJ: 41000 },
  ],
  throughputTonnes: 1240000,
  peerIntensityMJPerTonne: 680,
};
// ---- END VERBATIM carbon_fields.mjs ----

// ---------------------------------------------------------------------------
// The probe inputs carbon_dump.mjs holds inline rather than in the fields file,
// copied here. carbonLab.test.js finds each one in the dump's text and pins the
// figures they produce against the digest line the dump printed from them.
// ---------------------------------------------------------------------------

export const PROBES = Object.freeze({
  /** SECTION 3: one thousand kilomoles of a one-carbon fuel. */
  unitFuel: { fuelKmolPerYear: 1000, carbonPerKmolFuel: 1 },
  unitEfficiencies: [1, 0.99, 0.98, 0.95],
  /** SECTION 4: the heaters at two lower efficiencies, and four carbon contents. */
  heaterEfficiencies: [0.999, 0.995],
  heaterCarbons: [1.0, 1.05, 1.09, 1.15],
  /** SECTION 9: two lines added to the complete inventory. */
  dieselActivityGJ: 1200,
  travelScope: 3,
  travelActivity: 400,
  /** SECTION 11: the mass balance is closed at this stack oxygen. */
  massBalanceO2: 3,
  /** SECTION 12: the readings the engine refuses. */
  refusedO2: [['dry O2 20.946 percent (all air)', 20.946], ['dry O2 21 percent', 21], ['dry O2 -1 percent', -1], ['dry O2 blank', '']],
  /** SECTION 13: the radiation loss swept. */
  radiationSweep: [1.0, 1.8, 2.5],
  /** SECTION 14: the target oxygen swept, and the target below the floor. */
  targetSweep: [2.0, 2.8, 3.5, 4.5],
  belowFloorTarget: 1.5,
  /** SECTION 15: the superheated exponent and the hours past a leap year. */
  superheatedExponent: 1.3,
  tooManyHours: 9000,
  /** SECTION 16: a return fraction above one. */
  badReturn: 1.2,
  /** SECTION 17: the threshold problem at 10 C. */
  threshold: {
    streams: [{ label: 'Hot', supplyC: 200, targetC: 50, cpKWperK: 10 }, { label: 'Cold', supplyC: 30, targetC: 60, cpKWperK: 1 }],
    minimumApproachC: 10,
  },
  negativeCp: { streams: [{ supplyC: 100, targetC: 50, cpKWperK: -2 }, { supplyC: 20, targetC: 80, cpKWperK: 1 }], minimumApproachC: 10 },
  flat: { streams: [{ supplyC: 50, targetC: 50, cpKWperK: 1 }], minimumApproachC: 10 },
  /** SECTION 19: the measure the refusals are shown on (Heat integration project), and a negative abatement. */
  refusalMeasureIndex: 2,
  negativeAbatement: -500,
  percentTypedRate: 10,
  /** SECTION 22: the measure left unscheduled. */
  unscheduledLabel: 'Vapour recovery on the storage tanks',
  /** SECTION 21: the Agbor vented methane line, as the dump types it (invented). */
  agborVent: {
    label: 'Vented and fugitive methane', scope: 1, activityUnit: 't CH4',
    factor: { label: 'Measured methane mass', value: 1, unit: 'tCH4/t', gas: 'CH4', source: 'Ika leak detection survey (invented)', version: '2026 Q1', vintage: '2026' },
  },
});

// ---------------------------------------------------------------------------
// THE DIGEST'S OWN PRINTING PRECISION, one table, so a panel prints what a
// lesson prints. It is carbon_dump.mjs's PRINT table.
// ---------------------------------------------------------------------------

export const PRINT = Object.freeze({
  t: 3, kmol: 3, pct: 4, frac: 6, gj: 3, kgh: 4, kw: 3, c: 3, usd: 2, usdt: 4, crf: 8, mm: 4, kg: 4, mjt: 4, inten: 8, share: 6,
});

/** A figure at the digest's precision for its class, 'none' for a figure the engine did not form, and no signed zero. */
export const fmt = (cls, v, word = 'none') => {
  if (v === null || v === undefined || v === '') return word;
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return word;
  const s = n.toFixed(PRINT[cls]);
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
};
export const F = Object.freeze(Object.fromEntries(Object.keys(PRINT).map((k) => [k, (v, word) => fmt(k, v, word)])));
/** The ten-decimal fractions SECTION 14 prints. */
export const f10 = (v, word = 'none') => (Number.isFinite(v) ? v.toFixed(10) : word);
/** An input as typed, or the word for a blank box. */
export const inp = (v) => (v === null || v === undefined || v === '' ? 'blank' : String(v));
/** The engine's three-valued flags, as words. */
export const yn = (v) => (v === true ? 'true' : v === false ? 'false' : 'none');

/** The given value when the caller passed one (a blank included), the record's otherwise. */
const pick = (given, dflt) => (given === undefined ? dflt : given);
const ok = (r) => Boolean(r) && !r.error;

// ---------------------------------------------------------------------------
// THE GWP SETS. The engine ships none; the four the digest prints are the only
// ones offered, and the course set is selected at load. No reader recommends one
// (held item H1).
// ---------------------------------------------------------------------------

export const GWP_KEYS = Object.keys(GWP_SETS);

/** The engine's GWP set for a key the selector offers. An unknown key is an undeclared, empty set. */
export const gwpSet = (key = COURSE_SET) => {
  const s = GWP_SETS[key];
  return s ? CA.makeGwpSet({ label: s.label, values: s.values }) : CA.makeGwpSet({ label: '', values: {} });
};

export const gwpSets = () => {
  const noLabel = CA.makeGwpSet({ values: { CH4: GWP_SETS[COURSE_SET].values.CH4 } });
  const noValues = CA.makeGwpSet({ label: 'IPCC AR6 GWP100' });
  const course = gwpSet(COURSE_SET);
  return {
    courseKey: COURSE_SET,
    source: GWP_SOURCE,
    horizon: GWP_HORIZON,
    sets: GWP_KEYS.map((key) => {
      const g = gwpSet(key);
      return {
        key, label: GWP_SETS[key].label, report: GWP_SETS[key].report, horizon: GWP_HORIZON,
        CH4: GWP_SETS[key].values.CH4, N2O: GWP_SETS[key].values.N2O, declared: g.declared, note: g.note, methaneNote: g.methaneNote,
      };
    }),
    declaredChecks: [
      { call: 'values given, no label', declared: noLabel.declared },
      { call: 'label given, no values', declared: noValues.declared },
      { call: `label and values (${course.label})`, declared: course.declared },
    ],
    empty: (() => { const e = CA.makeGwpSet({}); return { label: e.label, gases: e.gases.length, declared: e.declared }; })(),
  };
};

// ---------------------------------------------------------------------------
// THE ATOM BALANCE, and the helper that turns its result into lines through a
// factor of one, exactly as carbon_dump.mjs (and the Carbon Studio) builds them.
// ---------------------------------------------------------------------------

const atomFactor = (gas) => CA.makeFactor({
  label: `${gas} from the atom balance`, value: 1, unit: `t${gas}/t${gas}`, gas,
  source: 'Atom balance (conservation of mass)', version: 'not applicable',
});
/** The page's own way of turning an atom-balance result into lines: skipped when absent or zero. */
export const atomLines = (label, r, g) => {
  const rows = [];
  if (r && !r.error && r.co2Tonnes) rows.push(CA.emissionLine({ label: `${label} (CO2)`, scope: 1, activity: r.co2Tonnes, activityUnit: 't CO2', factor: atomFactor('CO2'), gwpSet: g }));
  if (r && !r.error && r.ch4Tonnes) rows.push(CA.emissionLine({ label: `${label} (unburned CH4)`, scope: 1, activity: r.ch4Tonnes, activityUnit: 't CH4', factor: atomFactor('CH4'), gwpSet: g }));
  return rows;
};
const lineOf = (spec, g, over = {}) => CA.emissionLine({
  label: spec.label, scope: spec.scope, activity: spec.activity, activityUnit: spec.activityUnit,
  factor: CA.makeFactor({ ...spec.factor, ...(over.factor || {}) }), gwpSet: g, ...(over.line || {}),
});

/** combustionCo2FromCarbon on the inputs as received. A key left out of `inputs` takes the record's value. */
export const atomBalance = (record, inputs = {}) => CA.combustionCo2FromCarbon({
  fuelKmolPerYear: pick(inputs.fuelKmolPerYear, record.fuelKmolPerYear),
  carbonPerKmolFuel: pick(inputs.carbonPerKmolFuel, record.carbonPerKmolFuel),
  destructionEfficiencyFraction: pick(inputs.destructionEfficiencyFraction, record.destructionEfficiencyFraction),
});
export const IGBOGENE_FLARE_RECORD = Object.freeze({ ...IGBOGENE_FLARE, destructionEfficiencyFraction: IGBOGENE_FLARE_DE });
export const heaters = (inputs = {}) => atomBalance(IGBOGENE_HEATERS, inputs);
export const flare = (inputs = {}) => atomBalance(IGBOGENE_FLARE_RECORD, inputs);

/** SECTION 3: the one-carbon fuel, the method sentence and the molar masses. */
export const atomUnit = () => {
  const one = CA.combustionCo2FromCarbon({ ...PROBES.unitFuel, destructionEfficiencyFraction: 1 });
  return {
    MW_C: CA.MW_C,
    MW_CO2: CA.MW_CO2,
    MW_CH4: CA.MW_CH4,
    computedHere: { oxygen: (CA.MW_CO2 - CA.MW_C) / 2, hydrogen: (CA.MW_CH4 - CA.MW_C) / 4 },
    method: one.method,
    gasKeys: Object.keys(one).filter((k) => /Tonnes$/.test(k)),
    rows: PROBES.unitEfficiencies.map((eta) => {
      const r = CA.combustionCo2FromCarbon({ ...PROBES.unitFuel, destructionEfficiencyFraction: eta });
      return { eta, carbonKmol: r.carbonKmolPerYear, co2Tonnes: r.co2Tonnes, ch4Tonnes: r.ch4Tonnes };
    }),
  };
};

/** SECTION 2: what the carbon engine refuses, each a call on the Igbogene flare. */
export const carbonRefusals = () => {
  const fl0 = IGBOGENE_FLARE;
  const G = gwpSet();
  const rows = [
    ['combustionCo2FromCarbon', 'flare, destruction efficiency blank', CA.combustionCo2FromCarbon({ ...fl0, destructionEfficiencyFraction: '' })],
    ['combustionCo2FromCarbon', 'flare, destruction efficiency null', CA.combustionCo2FromCarbon({ ...fl0, destructionEfficiencyFraction: null })],
    ['combustionCo2FromCarbon', 'flare, destruction efficiency 0', CA.combustionCo2FromCarbon({ ...fl0, destructionEfficiencyFraction: 0 })],
    ['combustionCo2FromCarbon', 'flare, destruction efficiency 98 (a percentage typed)', CA.combustionCo2FromCarbon({ ...fl0, destructionEfficiencyFraction: 98 })],
    ['combustionCo2FromCarbon', 'flare, fuel blank', CA.combustionCo2FromCarbon({ ...fl0, fuelKmolPerYear: '', destructionEfficiencyFraction: IGBOGENE_FLARE_DE })],
    ['combustionCo2FromCarbon', 'flare, carbon per kmol left out', CA.combustionCo2FromCarbon({ fuelKmolPerYear: fl0.fuelKmolPerYear, destructionEfficiencyFraction: IGBOGENE_FLARE_DE })],
    ['combustionCo2FromCarbon', 'flare, fuel -1 kmol', CA.combustionCo2FromCarbon({ ...fl0, fuelKmolPerYear: -1, destructionEfficiencyFraction: IGBOGENE_FLARE_DE })],
    ['emissionLine', 'a line with no registered factor', CA.emissionLine({ label: IGBOGENE_POWER.label, scope: 2, activity: IGBOGENE_POWER.activity, activityUnit: IGBOGENE_POWER.activityUnit, gwpSet: G })],
  ];
  const empty = CA.buildInventory({ lines: [], gwpSet: G });
  const ci = (args) => CA.carbonIntensity({ inventory: empty, ...args });
  rows.push(['carbonIntensity', 'no boundary named', ci({ denominatorValue: IGBOGENE_INTENSITY.denominatorValue, denominatorUnit: 'boe' })]);
  rows.push(['carbonIntensity', 'a denominator of 0', ci({ denominatorValue: 0, denominatorUnit: 'boe', boundaryLabel: 'site' })]);
  rows.push(['carbonIntensity', 'a blank denominator', ci({ denominatorValue: '', denominatorUnit: 'boe', boundaryLabel: 'site' })]);
  const left = CA.combustionCo2FromCarbon({ ...PROBES.unitFuel });
  return {
    rows: rows.map(([fn, call, r]) => ({ fn, call, error: r.error || null })),
    leftOut: { destructionEfficiencyFraction: left.destructionEfficiencyFraction, co2Tonnes: left.co2Tonnes, ch4Tonnes: left.ch4Tonnes },
  };
};

/** SECTION 4: the heaters at the record, at two lower efficiencies and at four carbon contents. */
export const heaterSweeps = () => ({
  base: heaters(),
  efficiencies: PROBES.heaterEfficiencies.map((eta) => ({ eta, r: heaters({ destructionEfficiencyFraction: eta }) })),
  carbons: PROBES.heaterCarbons.map((c) => ({ c, r: heaters({ carbonPerKmolFuel: c }) })),
});

/** One flare result read as lines on a set: its CO2, its methane line and the two together. */
const flareReading = (r, g) => {
  const lines = atomLines('Flaring', r, g);
  const co2Line = lines.find((l) => l.gas === 'CO2') || null;
  const ch4Line = lines.find((l) => l.gas === 'CH4') || null;
  const total = lines.every((l) => Number.isFinite(l.tCo2e)) && lines.length ? lines.reduce((a, l) => a + l.tCo2e, 0) : null;
  return {
    error: r.error || null, co2Tonnes: ok(r) ? r.co2Tonnes : null, ch4Tonnes: ok(r) ? r.ch4Tonnes : null,
    co2LineTCo2e: co2Line ? co2Line.tCo2e : null, ch4LineTCo2e: ch4Line ? ch4Line.tCo2e : null, flareTCo2e: total,
  };
};

/** SECTION 5: the flare at the five efficiencies on a set, the refusal, and the digest's two computed-here figures. */
export const flareSweep = (setKey = COURSE_SET, inputs = {}) => {
  const g = gwpSet(setKey);
  const rows = IGBOGENE_FLARE_SWEEP.map((eta) => ({ eta, ...flareReading(flare({ ...inputs, destructionEfficiencyFraction: eta }), g) }));
  const stated = flare(inputs);
  const at = flareReading(stated, g);
  const at1 = flare({ ...inputs, destructionEfficiencyFraction: 1 });
  return {
    setLabel: g.label,
    ch4Gwp: g.values.CH4 ?? null,
    rows,
    stated: { eta: pick(inputs.destructionEfficiencyFraction, IGBOGENE_FLARE_DE), ...at },
    blank: flare({ ...inputs, destructionEfficiencyFraction: '' }).error,
    unburnedNote: ok(stated) ? stated.unburnedNote : null,
    computedHere: {
      methaneShare: Number.isFinite(at.ch4LineTCo2e) && at.flareTCo2e ? at.ch4LineTCo2e / at.flareTCo2e : null,
      completeCombustionTCo2e: ok(at1) ? at1.co2Tonnes : null,
      belowStated: ok(at1) && Number.isFinite(at.flareTCo2e) ? at.flareTCo2e - at1.co2Tonnes : null,
    },
  };
};

// ---------------------------------------------------------------------------
// THE IGBOGENE INVENTORY.
// ---------------------------------------------------------------------------

/**
 * The Igbogene inventory on a set, from the heaters and the flare as the caller
 * sets them. A refused atom balance contributes no line (the dump's helper), and
 * the refusal is returned beside the inventory; any line the engine blocks is in
 * the inventory's own blockedLines.
 */
export const inventory = ({ setKey = COURSE_SET, heaterInputs = {}, flareInputs = {} } = {}) => {
  const g = gwpSet(setKey);
  const h = heaters(heaterInputs);
  const fl = flare(flareInputs);
  const inv = CA.buildInventory({ lines: [...atomLines('Fired heaters', h, g), ...atomLines('Flaring', fl, g), lineOf(IGBOGENE_VENT, g), lineOf(IGBOGENE_POWER, g)], gwpSet: g });
  const total = inv.totalTonnes;
  return {
    setKey,
    setLabel: g.label,
    heaters: h,
    flare: fl,
    inv,
    computedHere: { shares: inv.lines.map((l) => ({ label: l.label, share: Number.isFinite(l.tCo2e) && total ? l.tCo2e / total : null })) },
    intensity: intensityOf(inv),
  };
};

/** SECTION 10: an inventory over both Igbogene boundaries, carrying its status. */
export function intensityOf(inv) {
  return {
    boundaries: [IGBOGENE_INTENSITY, IGBOGENE_INTENSITY_ALT].map((b) => CA.carbonIntensity({ inventory: inv, ...b })),
    noBoundary: CA.carbonIntensity({ inventory: inv, denominatorValue: IGBOGENE_INTENSITY.denominatorValue, denominatorUnit: 'boe' }).error,
  };
}

/** SECTION 8: the inventory rebuilt on each of the four sets, with its difference from the course set. */
export const inventoryOnSets = () => {
  const course = inventory().inv.totalTonnes;
  return GWP_KEYS.map((key) => {
    const { inv } = inventory({ setKey: key });
    return {
      key, label: GWP_SETS[key].label, scope1: inv.scope1Tonnes, scope2: inv.scope2Tonnes, total: inv.totalTonnes,
      methaneLines: inv.lines.filter((l) => l.gas === 'CH4').map((l) => ({ label: l.label, tCo2e: l.tCo2e })),
      computedHere: { lessCourseSet: inv.totalTonnes - course },
    };
  });
};

/** SECTION 9: from a first pass to reportable, five buildInventory calls, and two lines that block. */
export const REPORTABLE_STEPS = [
  'as a first pass', 'the GWP set declared', 'the flare efficiency entered', 'the electricity factor entered with its source', 'the survey referenced',
];
export const reportableSteps = () => {
  const G = gwpSet();
  const noSet = CA.makeGwpSet({ label: '', values: {} });
  const h = heaters();
  const fl = flare();
  const flareBlank = flare({ destructionEfficiencyFraction: '' });
  const ventUnsourced = (g) => lineOf(IGBOGENE_VENT, g, { factor: { source: null, version: null } });
  const powerBlank = (g) => lineOf(IGBOGENE_POWER, g, { factor: { value: '', source: null, version: null } });
  const specs = [
    [noSet, (g) => [...atomLines('Fired heaters', h, g), ...atomLines('Flaring', flareBlank, g), ventUnsourced(g), powerBlank(g)]],
    [G, (g) => [...atomLines('Fired heaters', h, g), ...atomLines('Flaring', flareBlank, g), ventUnsourced(g), powerBlank(g)]],
    [G, (g) => [...atomLines('Fired heaters', h, g), ...atomLines('Flaring', fl, g), ventUnsourced(g), powerBlank(g)]],
    [G, (g) => [...atomLines('Fired heaters', h, g), ...atomLines('Flaring', fl, g), ventUnsourced(g), lineOf(IGBOGENE_POWER, g)]],
    [G, (g) => [...atomLines('Fired heaters', h, g), ...atomLines('Flaring', fl, g), lineOf(IGBOGENE_VENT, g), lineOf(IGBOGENE_POWER, g)]],
  ];
  const steps = specs.map(([g, lines], i) => ({ step: REPORTABLE_STEPS[i], flareError: i < 2 ? flareBlank.error : null, inv: CA.buildInventory({ lines: lines(g), gwpSet: g }) }));
  const withBad = CA.buildInventory({
    lines: [...specs[4][1](G), CA.emissionLine({ label: 'Diesel generators', scope: 1, activity: PROBES.dieselActivityGJ, activityUnit: 'GJ', gwpSet: G }),
      lineOf({ ...IGBOGENE_POWER, label: 'Business travel', scope: PROBES.travelScope, activity: PROBES.travelActivity }, G)],
    gwpSet: G,
  });
  const partial = CA.buildInventory({ lines: [...atomLines('Fired heaters', h, G), ...atomLines('Flaring', fl, G), lineOf(IGBOGENE_VENT, G), powerBlank(G)], gwpSet: G });
  return { steps, withBad, partialIntensity: CA.carbonIntensity({ inventory: partial, ...IGBOGENE_INTENSITY }) };
};

// ---------------------------------------------------------------------------
// ISIOKPO: combustion, excess air, stack loss, tuning, steam, condensate, pinch.
// ---------------------------------------------------------------------------

const ref = (c) => EE.FUEL_REFERENCE.find((r) => r.code === c);
export const FUEL_CODES = EE.FUEL_REFERENCE.map((r) => r.code);
/** The analysis as the engine takes it, each mole fraction as typed and each component's atoms and typical heating values. */
export const fuelComponents = (fuel = ISIOKPO_FUEL) => fuel.map(([c, y]) => {
  const r = ref(c);
  return { code: c, moleFraction: y, c: r.c, h: r.h, o: r.o, s: r.s, n: r.n, molarMassKgKmol: r.molarMassKgKmol, lhvMJKmol: r.typicalLhvMJKmol, hhvMJKmol: r.typicalHhvMJKmol };
});
export const stoichiometry = (fuel = ISIOKPO_FUEL) => EE.combustionStoichiometry({ components: fuelComponents(fuel) });

const PR = EE.PROPERTY_REFERENCE;
const H = ISIOKPO_HEATER;

/** The Isiokpo heater at a stack oxygen and on a basis, every other input the record's unless the caller passes it. */
export const heaterAt = (o2, basis = EE.HEATING_VALUE_BASIS.LHV, over = {}, fuel = ISIOKPO_FUEL) => {
  const st = stoichiometry(fuel);
  const ea = EE.excessAirFromFlueOxygen({ stoichiometry: st, dryO2Percent: o2 });
  if (ea.error) return ea;
  return EE.stackLossEfficiency({
    stoichiometry: st, excessAir: ea, basis, stackTempC: H.stackTempC, combustionAirTempC: H.combustionAirTempC,
    flueGasCpKJkgK: PR.fluGasCpKJkgK.typical, waterVapourCpKJkgK: PR.waterVapourCpKJkgK.typical,
    waterLatentHeatKJkg: PR.waterLatentHeatKJkg.typical, radiationLossPercent: H.radiationLossPercent,
    unburnedLossPercent: H.unburnedLossPercent, ...over,
  });
};

/** SECTION 11: the stoichiometry, the analysis without its CO2, and the mass balance at 3 percent. */
export const combustion = (fuel = ISIOKPO_FUEL) => {
  const st = stoichiometry(fuel);
  const noCo2 = stoichiometry(fuel.filter(([c]) => c !== 'CO2'));
  let massBalance = null;
  if (ok(st)) {
    const ea = EE.excessAirFromFlueOxygen({ stoichiometry: st, dryO2Percent: PROBES.massBalanceO2 });
    const eff = ok(ea) ? EE.stackLossEfficiency({
      stoichiometry: st, excessAir: ea, stackTempC: H.stackTempC, combustionAirTempC: H.combustionAirTempC,
      flueGasCpKJkgK: PR.fluGasCpKJkgK.typical, waterVapourCpKJkgK: PR.waterVapourCpKJkgK.typical, radiationLossPercent: H.radiationLossPercent,
    }) : ea;
    if (ok(eff)) {
      const inKg = st.fuelMolarMassKgKmol + ea.actualAirPerKmolFuel * EE.AIR_MOLAR_MASS;
      const outKg = eff.dryFlueGasKgPerKmolFuel + eff.moistureKgPerKmolFuel;
      massBalance = { o2: PROBES.massBalanceO2, inKg, outKg, computedHere: { outLessIn: outKg - inKg } };
    }
  }
  return {
    fuel: fuel.map(([c, y]) => ({ code: c, moleFraction: y })),
    st,
    noCo2,
    massBalance,
    constants: {
      O2_MOLE_FRACTION_DRY_AIR: EE.O2_MOLE_FRACTION_DRY_AIR, AIR_MOLAR_MASS: EE.AIR_MOLAR_MASS, O2_MOLAR_MASS: EE.O2_MOLAR_MASS,
      ATMOSPHERIC_N2_MOLAR_MASS: EE.ATMOSPHERIC_N2_MOLAR_MASS, FUEL_REFERENCE_NOTE: EE.FUEL_REFERENCE_NOTE,
    },
  };
};

/** SECTION 12: excess air at one reading, the sweep and the refusals. */
export const excessAirAt = (o2, fuel = ISIOKPO_FUEL) => EE.excessAirFromFlueOxygen({ stoichiometry: stoichiometry(fuel), dryO2Percent: o2 });
export const excessAir = (fuel = ISIOKPO_FUEL) => {
  const st = stoichiometry(fuel);
  const cur = EE.excessAirFromFlueOxygen({ stoichiometry: st, dryO2Percent: H.currentO2Percent });
  return {
    assumption: ok(cur) ? cur.assumption : null,
    rows: ISIOKPO_O2_SWEEP.map((o2) => ({ o2, r: EE.excessAirFromFlueOxygen({ stoichiometry: st, dryO2Percent: o2 }) })),
    refusals: [
      ...PROBES.refusedO2.map(([call, o2]) => ({ call, error: EE.excessAirFromFlueOxygen({ stoichiometry: st, dryO2Percent: o2 }).error })),
      { call: 'no stoichiometry', error: EE.excessAirFromFlueOxygen({ dryO2Percent: PROBES.massBalanceO2 }).error },
    ],
    airOxygenPercent: EE.O2_MOLE_FRACTION_DRY_AIR * 100,
  };
};

/** The losses of one stack loss result, by the engine's labels. */
export const lossesOf = (r) => (ok(r) ? Object.fromEntries(r.losses.map((x) => [x.label, x.percent])) : null);

/**
 * SECTION 13: the heater on LHV and on HHV side by side at one stack oxygen, the
 * radiation loss as the caller types it (required, never defaulted).
 */
export const stackLoss = ({ o2 = H.currentO2Percent, radiationLossPercent = H.radiationLossPercent, fuel = ISIOKPO_FUEL } = {}) => {
  const lhv = heaterAt(o2, EE.HEATING_VALUE_BASIS.LHV, { radiationLossPercent }, fuel);
  const hhv = heaterAt(o2, EE.HEATING_VALUE_BASIS.HHV, { radiationLossPercent }, fuel);
  return {
    o2, radiationLossPercent, lhv, hhv, lhvLosses: lossesOf(lhv), hhvLosses: lossesOf(hhv),
    computedHere: { lhvLessHhv: ok(lhv) && ok(hhv) ? lhv.efficiencyPercent - hhv.efficiencyPercent : null },
  };
};
export const stackLossCases = () => ({
  rows: [
    [`current, ${H.currentO2Percent} percent O2`, heaterAt(H.currentO2Percent)],
    [`target, ${H.targetO2Percent} percent O2`, heaterAt(H.targetO2Percent)],
    [`current, ${H.currentO2Percent} percent O2`, heaterAt(H.currentO2Percent, EE.HEATING_VALUE_BASIS.HHV)],
    [`target, ${H.targetO2Percent} percent O2`, heaterAt(H.targetO2Percent, EE.HEATING_VALUE_BASIS.HHV)],
  ].map(([label, r]) => ({ label, r, losses: lossesOf(r) })),
  refusals: [
    ['radiation loss blank', heaterAt(H.currentO2Percent, 'LHV', { radiationLossPercent: '' })],
    ['HHV with no latent heat', heaterAt(H.currentO2Percent, 'HHV', { waterLatentHeatKJkg: null })],
    ['stack temperature blank', heaterAt(H.currentO2Percent, 'LHV', { stackTempC: '' })],
    ['flue gas cp blank', heaterAt(H.currentO2Percent, 'LHV', { flueGasCpKJkgK: '' })],
  ].map(([call, r]) => ({ call, error: r.error || null })),
  radiation: PROBES.radiationSweep.map((rad) => ({ rad, r: heaterAt(H.currentO2Percent, 'LHV', { radiationLossPercent: rad }) })),
  properties: Object.entries(PR).map(([k, v]) => ({ property: k, typical: v.typical, range: v.range, note: v.note })),
});

/**
 * SECTION 14: the tuning saving from the current and target oxygen, the floor as
 * the caller declares it and the annual fuel on LHV. The percentage-point
 * shortcut is the digest's contrast figure, computed here from the engine's two
 * efficiencies, and is never the answer.
 */
export const tuning = ({
  currentO2 = H.currentO2Percent, targetO2 = H.targetO2Percent, floor = H.minimumSafeO2Percent,
  annualGJ = H.annualFuelEnergyGJ, radiationLossPercent = H.radiationLossPercent,
} = {}) => {
  const cur = heaterAt(currentO2, 'LHV', { radiationLossPercent });
  const tgt = heaterAt(targetO2, 'LHV', { radiationLossPercent });
  const save = EE.excessAirSaving({ current: cur, target: tgt, minimumSafeO2Percent: floor, targetO2Percent: targetO2, annualFuelEnergyGJ: annualGJ });
  const curH = heaterAt(currentO2, 'HHV', { radiationLossPercent });
  const tgtH = heaterAt(targetO2, 'HHV', { radiationLossPercent });
  const onHhv = EE.excessAirSaving({ current: curH, target: tgtH, minimumSafeO2Percent: floor, targetO2Percent: targetO2, annualFuelEnergyGJ: annualGJ });
  const annual = annualGJ === '' || annualGJ === null ? NaN : Number(annualGJ);
  let shortcut = null;
  if (ok(save)) {
    const fraction = (save.targetEfficiencyPercent - save.currentEfficiencyPercent) / 100;
    const gjShort = Number.isFinite(annual) ? fraction * annual : null;
    shortcut = { fraction, gj: gjShort, belowEngine: gjShort === null || save.annualEnergySavedGJ === null ? null : save.annualEnergySavedGJ - gjShort };
  }
  return {
    inputs: { currentO2, targetO2, floor, annualGJ, radiationLossPercent }, cur, tgt, save, onHhv, computedHere: { shortcut },
  };
};
export const tuningCases = () => {
  const isCur = heaterAt(H.currentO2Percent);
  const isTgt = heaterAt(H.targetO2Percent);
  const isTgtH = heaterAt(H.targetO2Percent, 'HHV');
  const sv = (args) => EE.excessAirSaving({ current: isCur, target: isTgt, annualFuelEnergyGJ: H.annualFuelEnergyGJ, ...args }).error || null;
  return {
    refusals: [
      { call: 'minimum safe oxygen blank', error: sv({ minimumSafeO2Percent: '', targetO2Percent: H.targetO2Percent }) },
      { call: 'target oxygen blank', error: sv({ minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: '' }) },
      { call: `a target of ${PROBES.belowFloorTarget} percent against the ${H.minimumSafeO2Percent} percent floor`, error: sv({ minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: PROBES.belowFloorTarget }) },
      { call: 'current on LHV, target on HHV', error: EE.excessAirSaving({ current: isCur, target: isTgtH, minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: H.targetO2Percent }).error || null },
    ],
    sweep: PROBES.targetSweep.map((o2) => {
      const tg = heaterAt(o2);
      return { o2, tgt: tg, save: EE.excessAirSaving({ current: isCur, target: tg, minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: o2, annualFuelEnergyGJ: H.annualFuelEnergyGJ }) };
    }),
  };
};

/** SECTION 15: the trap on the inputs as received; a key left out takes the record's value. */
export const trap = (inputs = {}) => EE.steamTrapLoss({ ...ISIOKPO_TRAP, ...inputs });
export const TRAP_EXPONENTS = [ISIOKPO_TRAP.specificHeatRatio, PROBES.superheatedExponent];
export const trapCases = () => {
  const sat = trap();
  const sup = trap({ specificHeatRatio: PROBES.superheatedExponent });
  const noEta = trap({ boilerEfficiencyFraction: '' });
  return {
    rows: [[ISIOKPO_TRAP.specificHeatRatio, sat], [PROBES.superheatedExponent, sup]].map(([k, r]) => ({ k, r })),
    computedHere: { moreTonnes: sup.tonnesPerYear - sat.tonnesPerYear, ratio: sup.tonnesPerYear / sat.tonnesPerYear },
    chokedNote: sat.chokedNote,
    refusals: [
      ['isentropic exponent blank', { specificHeatRatio: '' }],
      ['isentropic exponent 1', { specificHeatRatio: 1 }],
      ['hours a year blank', { hoursPerYear: '' }],
      [`hours a year ${PROBES.tooManyHours}`, { hoursPerYear: PROBES.tooManyHours }],
      ['discharge coefficient blank', { dischargeCoefficient: '' }],
      ['orifice blank', { orificeDiameterMm: '' }],
    ].map(([call, args]) => ({ call, error: trap(args).error || null })),
    noBoiler: noEta,
    hoursLeftOut: trap({ hoursPerYear: undefined }),
  };
};

/** SECTION 16: condensate return on the inputs as received; the treatment cost may be left blank. */
export const condensate = (inputs = {}) => EE.condensateReturnValue({ ...ISIOKPO_CONDENSATE, ...inputs });
export const condensateCases = () => ({
  full: condensate(),
  floor: condensate({ treatmentCostPerTonne: null }),
  refusals: [
    ['boiler efficiency blank', { boilerEfficiencyFraction: '' }],
    ['hours a year blank', { hoursPerYear: '' }],
    [`target return ${PROBES.badReturn}`, { targetReturnFraction: PROBES.badReturn }],
  ].map(([call, args]) => ({ call, error: condensate(args).error || null })),
});

/** SECTION 17: pinch targets for a stream set at a minimum approach. */
export const pinch = (dtmin = ISIOKPO_DTMIN_CASE, streams = ISIOKPO_STREAMS) => EE.pinchTargets({ streams, minimumApproachC: dtmin });
export const pinchCases = () => ({
  streams: ISIOKPO_STREAMS,
  rows: ISIOKPO_DTMIN.map((d) => ({ d, p: pinch(d) })),
  table: pinch(ISIOKPO_DTMIN_CASE),
  threshold: EE.pinchTargets(PROBES.threshold),
  refusals: [
    ['a stream with CP -2', EE.pinchTargets(PROBES.negativeCp)],
    ['minimum approach blank', pinch('')],
    ['no stream changes temperature', EE.pinchTargets(PROBES.flat)],
  ].map(([call, r]) => ({ call, error: r.error || null })),
});

// ---------------------------------------------------------------------------
// AGBOR: the cost of a tonne, the curve, the target, the path, a priced saving
// and the plant's energy intensity.
// ---------------------------------------------------------------------------

/**
 * One measure costed on the inputs as received. A refused measure comes back as
 * the engine's error with the measure's label beside it, which is what the
 * curve is handed, so an engine that names refused measures can name it.
 */
export const costMeasure = (m, rate = AGBOR_DISCOUNT_RATE) => {
  const r = CA.abatementCost({ ...m, discountRate: rate });
  return r.error ? { ...r, label: m.label } : r;
};
export const costAll = (measures = AGBOR_MEASURES, rate = AGBOR_DISCOUNT_RATE) => measures.map((m) => costMeasure(m, rate));

/** The capital set against one year, computed here from the inputs; the engine refuses to form it. */
const oneYear = (m) => {
  const n = [m.capitalCost, m.annualCost, m.annualSavings, m.tonnesAbatedPerYear].map((v) => (v === '' || v === null ? NaN : Number(v)));
  return n.every(Number.isFinite) && n[3] !== 0 ? (n[0] + n[1] - n[2]) / n[3] : null;
};

/** SECTION 18: the six measures at the rate, at a rate of 0, and the one-year contrast. */
export const costTable = (measures = AGBOR_MEASURES, rate = AGBOR_DISCOUNT_RATE) => ({
  rate,
  rows: measures.map((m) => ({ m, r: costMeasure(m, rate), atZero: costMeasure(m, 0), computedHere: { oneYear: oneYear(m) } })),
});

/** SECTION 19: the refusals on one measure, the blanks taken as 0 and named, a capital of 0, an abatement of 0. */
export const costRefusals = () => {
  const m = AGBOR_MEASURES[PROBES.refusalMeasureIndex];
  const ac = (args) => CA.abatementCost({ ...m, discountRate: AGBOR_DISCOUNT_RATE, ...args });
  return {
    label: m.label,
    rows: [
      [`abatement ${PROBES.negativeAbatement} t a year`, { tonnesAbatedPerYear: PROBES.negativeAbatement }],
      ['abatement blank', { tonnesAbatedPerYear: '' }],
      ['capital cost blank', { capitalCost: '' }],
      ['discount rate blank', { discountRate: '' }],
      [`discount rate ${PROBES.percentTypedRate} (a percentage typed)`, { discountRate: PROBES.percentTypedRate }],
      ['life blank', { lifeYears: '' }],
    ].map(([call, args]) => ({ call, error: ac(args).error || null })),
    named: ac({ annualSavings: '', annualCost: null }),
    capitalZero: CA.abatementCost({ ...m, capitalCost: 0, lifeYears: '', discountRate: '' }),
    abatementZero: CA.abatementCost({ ...m, tonnesAbatedPerYear: 0 }),
  };
};

const G_COURSE = () => gwpSet(COURSE_SET);
const co2e = (r, g) => (ok(r) ? r.co2Tonnes + r.ch4Tonnes * g.values.CH4 : null);
const agPowerSpec = (factor) => ({
  label: 'Purchased electricity', scope: 2, activity: AGBOR_POWER.activity, activityUnit: 'MWh',
  factor: { label: 'Grid electricity factor (SYNTHETIC)', value: factor, unit: 'tCO2/MWh', gas: 'CO2', source: factor === '' ? null : 'Supplier statement (invented)', version: factor === '' ? null : '2025', vintage: '2025' },
});

/**
 * SECTION 21: the Agbor inventory the measures act on, the source emissions the
 * Carbon Studio passes to the curve (CO2 plus methane in CO2e, computed here as
 * the dump computes it) and the target at 30 percent of the total.
 */
export const agborInventory = (powerFactor = AGBOR_POWER.factor) => {
  const g = G_COURSE();
  const h = CA.combustionCo2FromCarbon(AGBOR_SOURCES.heaters);
  const fl = CA.combustionCo2FromCarbon(AGBOR_SOURCES.flare);
  const inv = CA.buildInventory({
    lines: [...atomLines('Fired heaters', h, g), ...atomLines('Flaring', fl, g), lineOf({ ...PROBES.agborVent, activity: AGBOR_VENT_T_CH4 }, g), lineOf(agPowerSpec(powerFactor), g)],
    gwpSet: g,
  });
  const pct = AGBOR_PLAN.targetReductionPercentByEnd;
  return {
    inv,
    sources: { heaters: co2e(h, g), flare: co2e(fl, g) },
    computedHere: { target: Number.isFinite(inv.totalTonnes) ? (inv.totalTonnes * pct) / 100 : null },
    targetPercent: pct,
  };
};

export const CURVE_PRESETS = [
  ['costed', 'the six measures as costed'],
  ['overclaim', `flare gas recovery claiming ${AGBOR_FLARE_OVERCLAIM_T} t`],
  ['unchecked', "the same claim, the flare's emission not passed"],
];

/** The engine's refused-measure list, under whichever key the engine names it; empty when it names none. */
export const refusedNamedBy = (c) => {
  if (!ok(c)) return [];
  const list = c.refusedMeasures || c.refused || c.refusals || [];
  return Array.isArray(list) ? list.map((x) => (typeof x === 'string' ? { label: x, reason: null } : { label: x.label || null, reason: x.reason || x.error || null })) : [];
};

/**
 * SECTIONS 20 AND 21: the curve on the measures as the caller sets them. The
 * preset overclaim sets flare gas recovery at the digest's over-claim tonnes;
 * the preset unchecked passes the heaters' emission alone. Every source a
 * measure acts on is listed with the emission passed for it, or none: a source
 * with none is unchecked.
 */
export const curve = ({ measures = AGBOR_MEASURES, rate = AGBOR_DISCOUNT_RATE, preset = 'costed' } = {}) => {
  const ag = agborInventory();
  const ms = preset === 'costed' ? measures
    : measures.map((m) => (m.label === 'Flare gas recovery' ? { ...m, tonnesAbatedPerYear: AGBOR_FLARE_OVERCLAIM_T } : m));
  const costed = costAll(ms, rate);
  const sourceEmissions = preset === 'unchecked' ? { heaters: ag.sources.heaters } : ag.sources;
  const c = CA.abatementCurve({ measures: costed, sourceEmissions, targetTonnes: ag.computedHere.target });
  const valid = costed.filter(ok);
  const sourceIds = [...new Set(ms.flatMap((m) => m.actsOn || []))];
  return {
    preset,
    presetLabel: (CURVE_PRESETS.find(([k]) => k === preset) || [null, preset])[1],
    curve: c,
    refusedHere: costed.filter((r) => r.error).map((r) => ({ label: r.label, reason: r.error })),
    refusedByEngine: refusedNamedBy(c),
    sources: sourceIds.map((id) => ({
      id,
      emitted: Number.isFinite(sourceEmissions[id]) ? sourceEmissions[id] : null,
      checked: Number.isFinite(sourceEmissions[id]),
      measures: ms.filter((m) => (m.actsOn || []).includes(id)).map((m) => m.label),
    })),
    computedHere: { plainMean: valid.length ? valid.reduce((a, m) => a + m.costPerTonne, 0) / valid.length : null },
  };
};

/** The curve as a stepped line: one point at each step's start, and the last step's end. */
export const curveSteps = (c) => {
  if (!ok(c) || !Array.isArray(c.steps) || !c.steps.length) return [];
  const pts = c.steps.map((s) => ({ tonnes: s.cumulativeStartTonnes, cost: s.costPerTonne, label: s.label }));
  const last = c.steps[c.steps.length - 1];
  pts.push({ tonnes: last.cumulativeEndTonnes, cost: last.costPerTonne, label: last.label });
  return pts;
};

/** The target line the Carbon Studio draws: straight from the baseline to the end-year cut, computed here as the dump does. */
const targetsFor = (base) => {
  const out = {};
  const { startYear: y0, endYear: y1, targetReductionPercentByEnd: pct } = AGBOR_PLAN;
  for (let y = y0; y <= y1; y += 1) out[y] = base * (1 - (pct / 100) * ((y - y0) / (y1 - y0)));
  return out;
};

export const PATH_PRESETS = [
  ['full', 'the full inventory'],
  ['partial', 'the partial inventory (the electricity factor blank)'],
  ['unscheduled', `${PROBES.unscheduledLabel} with no start year`],
];

/** SECTION 22: the path on a preset. */
export const path = (preset = 'full', measures = AGBOR_MEASURES) => {
  const inv = agborInventory(preset === 'partial' ? '' : AGBOR_POWER.factor).inv;
  const ms = preset === 'unscheduled' ? measures.map((m) => (m.label === PROBES.unscheduledLabel ? { ...m, startYear: null } : m)) : measures;
  const base = inv.totalTonnes;
  const p = CA.decarbonisationPath({
    baselineTonnes: base, measures: ms.map((m) => ({ label: m.label, tonnesAbatedPerYear: m.tonnesAbatedPerYear, startYear: m.startYear })),
    startYear: AGBOR_PLAN.startYear, endYear: AGBOR_PLAN.endYear, targetByYear: targetsFor(base),
  });
  return {
    preset, presetLabel: (PATH_PRESETS.find(([k]) => k === preset) || [null, preset])[1],
    baseline: base, reportable: inv.reportable, notReportableBecause: inv.notReportableBecause, path: p,
  };
};
export const pathRefusals = () => ({
  zeroBaseline: CA.decarbonisationPath({ baselineTonnes: 0, measures: [], startYear: AGBOR_PLAN.startYear, endYear: AGBOR_PLAN.endYear }).error,
  reversedYears: CA.decarbonisationPath({ baselineTonnes: agborInventory().inv.totalTonnes, measures: [], startYear: AGBOR_PLAN.endYear, endYear: AGBOR_PLAN.startYear }).error,
});

export const BASES = ['LHV', 'HHV'];
/** SECTION 23: one saving priced in money and carbon, each basis as declared (a blank declares none). */
export const saving = ({
  energyBasis = 'LHV', fuelCostBasis = 'LHV', emissionFactorBasis = 'LHV', ...over
} = {}) => {
  const inputs = { ...AGBOR_SAVING, ...over };
  const ps = EE.priceSaving({
    ...inputs, energyBasis: energyBasis || null, fuelCostBasis: fuelCostBasis || null, emissionFactorBasis: emissionFactorBasis || null,
  });
  const cap = inputs.implementationCost === '' || inputs.implementationCost === null ? NaN : Number(inputs.implementationCost);
  return {
    inputs, bases: { energyBasis, fuelCostBasis, emissionFactorBasis }, ps,
    computedHere: {
      oneYear: ok(ps) && Number.isFinite(cap) && Number.isFinite(ps.annualValue) && ps.annualTonnesCo2e ? (cap - ps.annualValue) / ps.annualTonnesCo2e : null,
    },
  };
};
export const savingCalls = () => {
  const S = AGBOR_SAVING;
  const noLife = EE.priceSaving({ ...S, lifeYears: null, discountRate: null });
  const noEf = EE.priceSaving({ ...S, emissionFactorKgCo2ePerGJ: null });
  return {
    noLife: { costPerTonneCo2e: noLife.costPerTonneCo2e, note: noLife.costPerTonneNote },
    noFactor: { annualTonnesCo2e: noEf.annualTonnesCo2e, note: noEf.carbonNote },
    noBasis: { note: EE.priceSaving(S).basisNote },
    mixed: EE.priceSaving({ ...S, energyBasis: 'LHV', emissionFactorBasis: 'HHV' }).error,
    blank: EE.priceSaving({ ...S, energySavedGJ: '' }).error,
  };
};

/** SECTION 24: the plant's energy intensity, with a stream blanked by label when the caller asks. */
export const energy = ({ blank = null, peer = AGBOR_ENERGY.peerIntensityMJPerTonne, throughput = AGBOR_ENERGY.throughputTonnes } = {}) => EE.energyIntensity({
  energyStreams: AGBOR_ENERGY.streams.map((s) => (s.label === blank ? { ...s, energyGJ: '' } : s)),
  throughputTonnes: throughput, peerIntensityMJPerTonne: peer,
});

// ---------------------------------------------------------------------------
// SECTION 1 and SECTION 25: what the modules export, and what is held.
// ---------------------------------------------------------------------------

export const modules = () => [['carbonAbatement', CA], ['energyEfficiency', EE]].map(([name, mod]) => ({
  name,
  // Sorted, as a module namespace lists its names, whatever order the loader keeps them in.
  functions: Object.keys(mod).sort().filter((k) => typeof mod[k] === 'function'),
  constants: Object.keys(mod).sort().filter((k) => typeof mod[k] !== 'function'),
}));

/** The four held items, as SECTION 25 states them. None is a figure to compute with. */
export const HELD = [
  ['H1', 'Which IPCC assessment report a Nigerian operator files on (AR5 or AR6) is a regulatory reading and the owner\'s decision. The engine ships no GWP; the course prints both reports (SECTION 6).'],
  ['H2', `The engine's typical methane heating values are ${ref('CH4').typicalLhvMJKmol} LHV and ${ref('CH4').typicalHhvMJKmol} HHV MJ per kmol. The pair is labelled typical and is not corrected without ISO 6976 in hand; the fuel analysis governs.`],
  ['H3', 'Every escaped carbon atom is counted as methane (SECTION 5).'],
  ['H4', 'Combustion N2O is not computed by the atom balance; it needs an emission factor line (SECTION 3).'],
];

// ---------------------------------------------------------------------------
// The whole teaching surface, at the records' own settings, for the clock and
// zone gates, the answer sweep and the copy rule.
// ---------------------------------------------------------------------------

export const teachingSurface = () => ({
  modules: modules(),
  gwp: gwpSets(),
  refusals: carbonRefusals(),
  atomUnit: atomUnit(),
  heaterSweeps: heaterSweeps(),
  flareSweep: flareSweep(),
  flareSweepOnSets: GWP_KEYS.map((k) => flareSweep(k)),
  inventory: inventory(),
  inventoryOnSets: inventoryOnSets(),
  reportable: reportableSteps(),
  combustion: combustion(),
  excessAir: excessAir(),
  stackLoss: stackLoss(),
  stackLossCases: stackLossCases(),
  tuning: tuning(),
  tuningCases: tuningCases(),
  trapCases: trapCases(),
  condensateCases: condensateCases(),
  pinchCases: pinchCases(),
  costTable: costTable(),
  costRefusals: costRefusals(),
  curves: CURVE_PRESETS.map(([k]) => curve({ preset: k })),
  agbor: agborInventory(),
  paths: PATH_PRESETS.map(([k]) => path(k)),
  pathRefusals: pathRefusals(),
  saving: saving(),
  savingCalls: savingCalls(),
  energy: energy(),
  energyMissing: energy({ blank: 'Purchased power' }),
  energyNoThroughput: EE.energyIntensity({ energyStreams: AGBOR_ENERGY.streams, throughputTonnes: '' }).error,
  held: HELD,
});
