// Teaching lab for EC6, Field Development Planning. The three panels, the
// course page and the vitest files all read this one module, so a number shown
// to a learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every reserve total,
// concept cost, scenario metric, cost roll-up, critical path, calendar span,
// well cost, facility estimate, risk band, rate of return and earned value
// below is a return value of engines/economics/fdp/* (the FDP Accelerator) or
// engines/economics/projectControls.js (Project Management Pro), as repaired in
// EC6-0 and EC6-1.
//
// NOTHING IN THIS FILE COMPUTES AN ECONOMIC QUANTITY. Where a reader carries a
// value the digest calls "derived" (a campaign laid out on N rigs, utilisation
// against the plan's peak, a swing, a ratio of two engine values, a difference
// of two engine values), it is the digest's own arithmetic on numbers the
// engine returned, and the key name says Derived. The lab and
// /root/ec-wip-fdp/digest.txt agree because both call the engines on the same
// inputs, not because either copied the other.
//
// UNITS. Plan money is million USD; well costs and task costs are whole
// currency units (USD); reserves are MMbbl for oil and condensate and Bcf for
// gas; ratios are plain fractions; percents run 0 to 100.
//
// THE CLOCK. This course has three clock surfaces and every one of them is
// given an explicit date: the concept schedule (calculateConceptSchedule takes
// a today), the calendar span (the dates typed on the activities) and the
// earned value as-of date (calculateEVM takes an asOf). No value here depends
// on the day it runs; a clock gate in fdpLab.test.js proves it under two faked
// system dates.
//
// THE TIMEZONE. EC6-0 made every date-only string parse as LOCAL midnight and
// every span count whole calendar days, so a schedule no longer moves with the
// reader's zone. fdpLab.test.js rebuilds the whole digest a second time under
// TZ=America/Los_Angeles and requires it byte for byte.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised and
// nothing is random.

import fdpGolden from '@petrolord/engines/test-data/economics/goldens/fdp_cases.json';
import afeGolden from '@petrolord/engines/test-data/economics/goldens/afe_cases.json';
// Namespaces, not named imports: eslint's resolver follows the node_modules
// symlink to the SHARED checkout's engines, which predate EC6-0 and EC6-1 and
// export no conceptCapexMM, criticalPaths, countUnscoredRisks or reservesP50.
// Vite and vitest alias @petrolord/engines to this worktree's packages/engines,
// which do. import/namespace still checks members against the shared copy, so
// it is off for this file only; the vitest files prove every member resolves.
/* eslint-disable import/namespace */
import * as E from '@petrolord/engines/engines/economics/fdp/economics.js';
import * as SC from '@petrolord/engines/engines/economics/fdp/scenarioCalculations.js';
import * as CO from '@petrolord/engines/engines/economics/fdp/costCalculations.js';
import * as CN from '@petrolord/engines/engines/economics/fdp/conceptCalculations.js';
import * as SB from '@petrolord/engines/engines/economics/fdp/subsurfaceCalculations.js';
import * as WL from '@petrolord/engines/engines/economics/fdp/wellCalculations.js';
import * as FA from '@petrolord/engines/engines/economics/fdp/facilitiesCalculations.js';
import * as HS from '@petrolord/engines/engines/economics/fdp/hseCalculations.js';
import * as RK from '@petrolord/engines/engines/economics/fdp/riskCalculations.js';
import * as RM from '@petrolord/engines/engines/economics/fdp/riskModel.js';
import * as SH from '@petrolord/engines/engines/economics/fdp/scheduleCalculations.js';
import * as FD from '@petrolord/engines/engines/economics/fdp/fdpCalculations.js';
import * as PC from '@petrolord/engines/engines/economics/projectControls.js';

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes an economic quantity.
// ---------------------------------------------------------------------------

const clone = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));

const attempt = (fn) => {
  try { return { ok: true, name: null, error: null, value: fn() }; } catch (e) { return { ok: false, name: e.name, error: e.message, value: null }; }
};

/** A refusal as the digest reports one: the engine's own class name and message. */
const refusalOf = (fn) => {
  const a = attempt(fn);
  // `errorName`, not `name`: a refusal row is spread into a case that already
  // carries the case's own name, and the engine's class name must not take it.
  return { ok: a.ok, errorName: a.name, error: a.error };
};

export const goldenCounts = () => ({
  fdp: Object.values(fdpGolden).filter(Array.isArray).reduce((s, v) => s + v.length, 0)
    + Object.values(fdpGolden.subsurface).reduce((s, v) => s + v.length, 0),
  afe: Object.values(afeGolden).filter(Array.isArray).reduce((s, v) => s + v.length, 0),
});

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from /root/ec-wip-fdp/ec6_fields.mjs.
// One development plan (EGINA, million USD) and one project schedule (ODUDU-2,
// whole USD). None of them is a golden case and none of them is graded
// anywhere.
// ---------------------------------------------------------------------------

export const EGINA_RESERVOIRS = [
  { id: 'eg-1', name: 'Egina Main', fluid: 'Oil', p90: 60, p50: 95, p10: 145, rf: 0.34 },
  { id: 'eg-2', name: 'Egina Deep', fluid: 'Oil', p90: 20, p50: 35, p10: 60, rf: 0.28 },
  { id: 'eg-3', name: 'Egina Gas Cap', fluid: 'Gas', p90: 40, p50: 70, p10: 110, rf: 0.65 },
];

export const EGINA_CONCEPTS = [
  {
    id: 101,
    name: 'FPSO development',
    facilityType: 'FPSO',
    drillingCapex: 520,
    facilitiesCapex: 1350,
    subseaCapex: 380,
    opex: 95,
    lifeOfField: 20,
    peakProduction: 60,
    startDate: '2027-04-01',
    driveMechanism: 'Water Injection',
  },
  {
    id: 102,
    name: 'Subsea tie-back',
    facilityType: 'Subsea Tie-back',
    drillingCapex: 240,
    facilitiesCapex: 180,
    subseaCapex: 310,
    opex: 40,
    lifeOfField: 15,
    peakProduction: 25,
    startDate: '2027-04-01',
    driveMechanism: 'Natural Depletion',
  },
];

export const EGINA_SCENARIOS = [
  { id: 201, name: 'Base', type: 'Base', conceptId: 101, oilPrice: 70, discountRate: 10 },
  { id: 202, name: 'Low price', type: 'Low', conceptId: 101, oilPrice: 48, discountRate: 10 },
  { id: 203, name: 'High price', type: 'High', conceptId: 101, oilPrice: 92, discountRate: 10 },
  { id: 204, name: 'Stress', type: 'Stress', conceptId: 101, oilPrice: 18, discountRate: 10 },
  { id: 205, name: 'Tie-back base', type: 'Base', conceptId: 102, oilPrice: 70, discountRate: 10 },
];

// The plan's own cost items. CAPEX sums to 2250 (the FPSO concept's capex),
// OPEX to 95 a year; the ABEX line is not in the screening case.
export const EGINA_COSTS = [
  { id: 'c1', name: 'Development drilling', category: 'Drilling', type: 'CAPEX', amount: 520, phase: 'Execution' },
  { id: 'c2', name: 'FPSO hull and topsides', category: 'Fabrication', type: 'CAPEX', amount: 1180, phase: 'Construction' },
  { id: 'c3', name: 'Mooring and installation', category: 'Installation', type: 'CAPEX', amount: 170, phase: 'Installation' },
  { id: 'c4', name: 'Subsea system', category: 'Installation', type: 'CAPEX', amount: 380, phase: 'Installation' },
  { id: 'c5', name: 'Operations and logistics', category: 'Operations', type: 'OPEX', amount: 72, phase: 'Operate' },
  { id: 'c6', name: 'Maintenance and integrity', category: 'Operations', type: 'OPEX', amount: 23, phase: 'Operate' },
  { id: 'c7', name: 'Decommissioning provision', category: 'Abandonment', type: 'ABEX', amount: 260, phase: 'Operate' },
];

// The schedule network. Finish to start; every activity carries its own id,
// duration in days and the ids that must finish first.
export const EGINA_SCHEDULE = [
  { id: 'a1', name: 'Project sanction', type: 'Milestone', duration: 0, dependencies: [], start: '2027-04-01', end: '2027-04-01' },
  { id: 'a2', name: 'Detailed engineering', type: 'Engineering', duration: 210, dependencies: ['a1'], start: '2027-04-02', end: '2027-10-28' },
  { id: 'a3', name: 'Long lead procurement', type: 'Procurement', duration: 300, dependencies: ['a1'], start: '2027-04-02', end: '2028-01-26' },
  { id: 'a4', name: 'Hull conversion', type: 'Fabrication', duration: 420, dependencies: ['a3'], start: '2028-01-27', end: '2029-03-22' },
  { id: 'a5', name: 'Topsides fabrication', type: 'Fabrication', duration: 330, dependencies: ['a2'], start: '2027-10-29', end: '2028-09-23' },
  { id: 'a6', name: 'Subsea installation', type: 'Installation', duration: 180, dependencies: ['a2'], start: '2027-10-29', end: '2028-04-26' },
  { id: 'a7', name: 'Integration and commissioning', type: 'Commissioning', duration: 150, dependencies: ['a4', 'a5'], start: '2029-03-23', end: '2029-08-20' },
  // First oil is dated two months later than the network needs, which is the
  // calendar float the plan is carrying.
  { id: 'a8', name: 'First oil', type: 'Milestone', duration: 0, dependencies: ['a6', 'a7'], start: '2029-10-20', end: '2029-10-20' },
];

export const EGINA_WELLS = [
  { id: 'w1', name: 'EG-01', type: 'Producer', trajectory: 'Horizontal', md: 14200, tvd: 9800 },
  { id: 'w2', name: 'EG-02', type: 'Producer', trajectory: 'Deviated', md: 11600, tvd: 9400 },
  { id: 'w3', name: 'EG-03', type: 'Water Injector', trajectory: 'Deviated', md: 10800, tvd: 9200 },
  { id: 'w4', name: 'EG-04', type: 'Producer', trajectory: 'Vertical', md: 9400, tvd: 9400 },
];
export const EGINA_RIG_RATE = 310000;
export const EGINA_RIG_COUNTS = [1, 2, 3];

export const EGINA_FACILITIES = [
  { id: 'f1', name: 'Egina FPSO', type: 'FPSO', nameplateCapacity: 60000, designLife: 20 },
  { id: 'f2', name: 'Egina FPSO, debottlenecked', type: 'FPSO', nameplateCapacity: 150000, designLife: 20 },
  { id: 'f3', name: 'Deep tie-back', type: 'Subsea Tie-back', nameplateCapacity: 25000, designLife: 15 },
];
export const EGINA_FLUID = { type: 'oil', api: 31, gor: 640, viscosity: 1.4 };

// The risk register. One risk in each band, and one nobody has scored.
export const EGINA_RISKS = [
  { id: 'r1', name: 'Subsea tie-in slips', probability: 4, impact: 5, costImpact: 180, source: 'Schedule', mitigation: 'Early order of the tie-in spools' },
  { id: 'r2', name: 'Hull yard delay', probability: 3, impact: 4, costImpact: 240, source: 'Fabrication', mitigation: 'Second yard qualified' },
  { id: 'r3', name: 'Reservoir underperformance', probability: 2, impact: 4, costImpact: 300, source: 'Subsurface', mitigation: 'Appraisal well before sanction' },
  { id: 'r4', name: 'Logistics congestion', probability: 2, impact: 2, costImpact: 25, source: 'Operations', mitigation: 'Second supply base' },
  { id: 'r5', name: 'Host government approval', impact: 5, costImpact: 400, source: 'Regulatory', mitigation: 'Early engagement' },
];

// ODUDU-2, the project schedule the earned value is measured on. Costs in
// whole USD, windows on the calendar, read at stated as-of dates.
export const ODUDU_TASKS = [
  { name: 'Front end engineering', planned_cost: 2400000, actual_cost: 2510000, percent_complete: 100, planned_start_date: '2028-01-10', planned_end_date: '2028-06-30' },
  { name: 'Detailed design', planned_cost: 5200000, actual_cost: 3180000, percent_complete: 65, planned_start_date: '2028-05-01', planned_end_date: '2029-02-28' },
  { name: 'Procurement', planned_cost: 8600000, actual_cost: 2450000, percent_complete: 30, planned_start_date: '2028-08-01', planned_end_date: '2029-07-31' },
  { name: 'Fabrication', planned_cost: 12500000, actual_cost: 0, percent_complete: 0, planned_start_date: '2029-03-01', planned_end_date: '2030-04-30' },
  { name: 'Commissioning', planned_cost: 3300000, actual_cost: 0, percent_complete: 0, planned_start_date: '2030-05-01', planned_end_date: '2030-10-31' },
];
export const ODUDU_AS_OF = ['2028-01-01', '2028-06-30', '2028-12-31', '2029-06-30', '2031-01-01'];

// ---------------------------------------------------------------------------
// The derived fields the digest's own generator makes, and the shorthands the
// readers share.
// ---------------------------------------------------------------------------

/**
 * The schedule rows carry `start` and `end`; the engine's calendar span reads
 * `startDate` and `endDate`, the same mapping the studio makes.
 */
export const EGINA_NETWORK = EGINA_SCHEDULE.map((a) => ({ ...a, startDate: a.start, endDate: a.end }));

/** The volumetric zone of section 2: an EGINA Main zone, acres, feet, fractions. */
export const EGINA_ZONE = { area: 2400, thickness: 140, porosity: 0.26, sw: 0.22, bo: 1.31 };
/** The average recoverable volume per well the well count is asked for, MMbbl. */
export const EGINA_EUR_PER_WELL = 12;
/** The four prices the FPSO concept is run at, USD a barrel. */
export const PRICE_LADDER = [40, 55, 70, 85];
/** The rig rate the campaign is repriced at, USD a day. */
export const ALTERNATIVE_RIG_RATE = 250000;
/** The depth, trajectories and complexities the well probe uses. */
export const PROBE_WELL_DEPTH_FT = 12000;
export const TRAJECTORIES = ['Vertical', 'Deviated', 'Horizontal'];
export const COMPLEXITIES = ['Low', 'Medium', 'High'];
/** The as-of date the digest reads ODUDU-2's indexes at. */
export const ODUDU_MID_AS_OF = '2028-12-31';
/** The concept start dates and types the date probe runs. */
export const CONCEPT_DATE_PROBES = [['2027-04-01', 'FPSO'], ['2027-04-01', 'Platform'], ['2028-02-29', 'FPSO']];
/** The date the undated concept is dated from when a today is passed. */
export const CONCEPT_TODAY = '2027-04-01';
/** The window that crosses a daylight-saving change in some zones. */
export const DST_WINDOW = { startDate: '2026-10-30', endDate: '2026-11-03' };
/** The probability-to-factor table calculateRiskExposure uses, copied from the engine. */
export const RISK_PROBABILITY_FACTORS = { 1: 0.05, 2: 0.2, 3: 0.4, 4: 0.6, 5: 0.85 };
/** The five irrStatus values the engine can report. */
export const IRR_STATUSES = ['ok', 'no-sign-change', 'above-clamp', 'multiple-roots', 'no-root'];
/** The band the engine searches for a rate of return, percent. */
export const IRR_BAND = { low: -99, high: 1000 };
/**
 * The stress prices the rate of return is read at, USD a barrel. BOTH are
 * no-root now: 30 used to be this course's multiple-roots example, and charging
 * the plan's end-of-life cost (EC6-8) moved it. The multiple-root cases are the
 * ones that earn, and they are in `rateOfReturn().multipleRoots`.
 */
export const STRESS_PRICES = { noRoot: 18, alsoNoRoot: 30 };

const FPSO = EGINA_CONCEPTS[0];
const TIEBACK = EGINA_CONCEPTS[1];
const BASE = EGINA_SCENARIOS[0];

const conceptByScenario = (scenario) => EGINA_CONCEPTS.find((c) => c.id === scenario.conceptId);
/**
 * EC6-8 (engines #183/#191). The plan's end-of-life cost. `planAbandonment`
 * reads the plan's ABEX cost items first and falls back to the facility
 * decommissioning estimate only when the plan carries none. EGINA carries one,
 * so every EGINA screening case below is charged it in its final production
 * year. Before this repair the ABEX line sat on the cost screen and reached no
 * cash flow, and every NPV this lab reported was the value of a plan that never
 * paid to abandon the field. A fresh object each call: nothing here is shared.
 */
const abex = () => E.planAbandonment({ costs: { items: clone(EGINA_COSTS) }, facilities: { list: clone(EGINA_FACILITIES) } });
const conceptShape = () => SC.conceptProfileKbpd(clone(FPSO));
const planCase = () => {
  const shape = conceptShape();
  return {
    capexMM: CO.calculateTotalCAPEX(clone(EGINA_COSTS)),
    annualOpexMM: CO.calculateTotalOPEX(clone(EGINA_COSTS)),
    productionKbpd: shape,
    pricesUsd: new Array(shape.length).fill(70),
    abandonment: abex(),
  };
};
/** The EGINA plan as the completeness check and the document reader see it. */
const eginaPlan = () => ({
  fieldData: { fieldName: 'Egina', country: 'Nigeria' },
  subsurface: { reserves: { summary: { p10: 0, p50: 0, p90: 0 }, breakdown: clone(EGINA_RESERVOIRS) } },
  concepts: { list: clone(EGINA_CONCEPTS), selectedId: 101 },
  scenarios: { list: clone(EGINA_SCENARIOS), selectedId: 201 },
  wells: { list: clone(EGINA_WELLS), rigs: 2, rigRate: EGINA_RIG_RATE },
  facilities: { list: clone(EGINA_FACILITIES) },
  schedule: { activities: clone(EGINA_NETWORK) },
  costs: { items: clone(EGINA_COSTS) },
  economics: { npv: E.runFdpCase(planCase()).metrics.npv, capex: CO.calculateTotalCAPEX(clone(EGINA_COSTS)) },
  hseData: { hazards: clone(EGINA_RISKS) },
  risks: clone(EGINA_RISKS),
});

// ---------------------------------------------------------------------------
// SECTION 1. What a plan holds, and what the engine refuses.
// ---------------------------------------------------------------------------

/** The EGINA probes of section 1: a concept or a scenario with one field taken away. */
export const EGINA_REFUSAL_PROBES = [
  ['the concept with its capex fields removed', { drillingCapex: undefined, facilitiesCapex: undefined, subseaCapex: undefined }, null],
  ['the concept with no operating cost', { opex: undefined }, null],
  ['the concept with no peak rate', { peakProduction: '' }, null],
  ['the scenario with no oil price', null, { oilPrice: undefined }],
  ['a negative drilling capex', { drillingCapex: -520 }, null],
];

export const planAndRefusals = () => ({
  fiscal: {
    royaltyRate: E.DEFAULT_FISCAL.royaltyRate,
    taxRate: E.DEFAULT_FISCAL.taxRate,
    discountRate: E.DEFAULT_FISCAL.discountRate,
    variableOpexPerBbl: E.DEFAULT_FISCAL.variableOpexPerBbl,
  },
  published: fdpGolden.scenarioRefusals.map((c) => ({
    name: c.name,
    ...refusalOf(() => SC.runScenario(clone(c.inputs.scenario), clone(c.inputs.concept))),
  })),
  probes: EGINA_REFUSAL_PROBES.map(([label, conceptPatch, scenarioPatch]) => ({
    label,
    ...refusalOf(() => SC.runScenario(
      { ...clone(BASE), ...(scenarioPatch || {}) },
      { ...clone(FPSO), ...(conceptPatch || {}) },
      abex(),
    )),
  })),
  zeroPriceNpv: SC.runScenario({ ...clone(BASE), oilPrice: 0 }, clone(FPSO), abex()).metrics.npv,
});

// ---------------------------------------------------------------------------
// SECTION 2. Reserves, one total per fluid.
// ---------------------------------------------------------------------------

export const reservesPerFluid = () => {
  const agg = SB.aggregateReserves(clone(EGINA_RESERVOIRS));
  const oilP50 = SB.reservesP50(agg);
  const gasP50 = SB.reservesP50(agg, 'Gas');
  const ooip = SB.calculateOOIP(EGINA_ZONE.area, EGINA_ZONE.thickness, EGINA_ZONE.porosity, EGINA_ZONE.sw, EGINA_ZONE.bo);
  return {
    reservoirs: clone(EGINA_RESERVOIRS),
    fluids: agg.fluids,
    byFluid: agg.fluids.map((fl) => ({
      fluid: fl,
      units: agg.byFluid[fl].units,
      count: agg.byFluid[fl].count,
      p90Sum: agg.byFluid[fl].p90Sum,
      p50Sum: agg.byFluid[fl].p50Sum,
      p10Sum: agg.byFluid[fl].p10Sum,
    })),
    oilP50,
    gasP50,
    // The number the digest prints to show what adding two fluids gives: a
    // quantity in no unit at all.
    addedAcrossFluidsDerived: oilP50 + gasP50,
    percentileNote: agg.percentileNote,
    unlabelledRefusal: refusalOf(() => SB.aggregateReserves([{ name: 'Unlabelled', p50: 10 }])),
    brineRefusal: refusalOf(() => SB.aggregateReserves([{ name: 'Aquifer', fluid: 'Brine', p50: 10 }])),
    published: fdpGolden.subsurface.aggregateReserves.map((c) => {
      const a = SB.aggregateReserves(clone(c.inputs));
      return {
        name: c.name,
        fluids: a.fluids,
        perFluid: a.fluids.map((fl) => ({ fluid: fl, p50Sum: a.byFluid[fl].p50Sum, units: a.byFluid[fl].units })),
      };
    }),
    publishedRefusals: fdpGolden.subsurface.aggregateReservesRefusals.map((c) => ({
      name: c.name,
      ...refusalOf(() => SB.aggregateReserves(clone(c.inputs))),
    })),
    volumetrics: {
      zone: { ...EGINA_ZONE },
      ooip,
      ooipMMstbDerived: ooip / 1e6,
      // The whole field's oil P50 against one zone's oil in place: two
      // different footprints, which is the point the digest makes.
      recoveryFactorImplied: SB.calculateRecoveryFactor(ooip, oilP50 * 1e6),
      likeForLike: {
        reservoirName: EGINA_RESERVOIRS[0].name,
        p50: EGINA_RESERVOIRS[0].p50,
        recoveryFactor: SB.calculateRecoveryFactor(ooip, EGINA_RESERVOIRS[0].p50 * 1e6),
        statedRf: EGINA_RESERVOIRS[0].rf,
      },
      eurPerWell: EGINA_EUR_PER_WELL,
      wellsNeeded: WL.calculateWellCount(oilP50, EGINA_EUR_PER_WELL),
      wellsInPlan: EGINA_WELLS.length,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. Concepts, and the capex a concept carries.
// ---------------------------------------------------------------------------

export const conceptsAndCapex = () => {
  const shape = conceptShape();
  return {
    rows: clone(EGINA_CONCEPTS).map((c) => ({
      name: c.name,
      facilityType: c.facilityType,
      drillingCapex: c.drillingCapex,
      facilitiesCapex: c.facilitiesCapex,
      subseaCapex: c.subseaCapex,
      totalCapex: SC.conceptCapexMM(clone(c)),
      opex: c.opex,
      lifeOfField: c.lifeOfField,
      peakProduction: c.peakProduction,
    })),
    costs: clone(EGINA_CONCEPTS).map((c) => {
      const cost = CN.calculateConceptCost(clone(c));
      return {
        name: c.name,
        lifeOfField: c.lifeOfField,
        totalCapex: cost.totalCapex,
        totalOpex: cost.totalOpex,
        totalLifecycleCost: cost.totalLifecycleCost,
      };
    }),
    oneFieldOnly: { facilitiesCapex: FPSO.facilitiesCapex, totalCapex: SC.conceptCapexMM({ facilitiesCapex: FPSO.facilitiesCapex }) },
    preTotalled: { entered: 2250, totalCapex: SC.conceptCapexMM({ capex: 2250 }) },
    shape: {
      conceptName: FPSO.name,
      peakProduction: FPSO.peakProduction,
      years: shape.length,
      rates: shape,
      firstSix: shape.slice(0, 6),
      last: shape[shape.length - 1],
      // Year 4 against year 3, the decline the screening shape applies.
      declineRatioDerived: shape[3] / shape[2],
      plateauLastYear: shape.findIndex((x, i) => i > 0 && x < shape[i - 1]),
      // Each year's kbpd x 1000 x 365, summed, in millions of barrels.
      volumeMMbblDerived: shape.reduce((sum, k) => sum + (k * 1000 * 365) / 1e6, 0),
    },
    schedules: clone(EGINA_CONCEPTS).map((c) => {
      const s = CN.calculateConceptSchedule(clone(c));
      return { name: c.name, fidDate: s.fidDate, firstOilDate: s.firstOilDate, durationMonths: s.durationMonths };
    }),
    noStartDateRefusal: refusalOf(() => CN.calculateConceptSchedule({ facilityType: 'FPSO' })),
    datedFromToday: {
      today: CONCEPT_TODAY,
      firstOilDate: CN.calculateConceptSchedule({ facilityType: 'FPSO' }, { today: CONCEPT_TODAY }).firstOilDate,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 4. What a scenario is worth.
// ---------------------------------------------------------------------------

export const scenarioValues = () => {
  const end = abex();
  const baseRun = SC.runScenario(clone(BASE), clone(FPSO), end);
  const tie = SC.runScenario(clone(EGINA_SCENARIOS[4]), clone(TIEBACK), end);
  const tieCapex = SC.conceptCapexMM(clone(TIEBACK));
  const fpsoCapex = SC.conceptCapexMM(clone(FPSO));
  return {
    rows: clone(EGINA_SCENARIOS).map((s) => {
      const concept = conceptByScenario(s);
      const res = SC.runScenario(clone(s), clone(concept), abex());
      return {
        name: s.name,
        conceptName: concept.name,
        oilPrice: s.oilPrice,
        capex: SC.conceptCapexMM(clone(concept)),
        npv: res.metrics.npv,
        irr: res.metrics.irr,
        irrStatus: res.metrics.irrStatus,
        payback: SC.scenarioPayback(clone(s), clone(concept)),
      };
    }),
    abandonment: {
      source: baseRun.abandonmentSource,
      amountMM: baseRun.abandonmentMM,
      year: baseRun.abandonmentYear,
      basis: end.abandonmentBasis,
    },
    base: {
      totalRevenue: baseRun.metrics.totalRevenue,
      totalRoyalty: baseRun.metrics.totalRoyalty,
      totalTax: baseRun.metrics.totalTax,
      totalCapex: baseRun.metrics.totalCapex,
      totalOpex: baseRun.metrics.totalOpex,
      totalGovTake: baseRun.metrics.totalGovTake,
      maxExposure: baseRun.metrics.maxExposure,
      govTakeShareDerived: baseRun.metrics.totalGovTake / baseRun.metrics.totalRevenue,
    },
    cashflowRows: baseRun.cashflow.slice(0, 8).map((row, i) => ({
      year: i,
      grossRevenue: row.grossRevenue,
      royalty: row.royalty,
      capex: row.capex,
      opex: row.opex,
      tax: row.tax,
      ncf: row.ncf,
      cumulativeNCF: row.cumulativeNCF,
    })),
    cashflowRowCount: baseRun.cashflow.length,
    priceLadder: PRICE_LADDER.map((price) => {
      const res = SC.runScenario({ ...clone(BASE), oilPrice: price }, clone(FPSO), abex());
      return { price, npv: res.metrics.npv, irr: res.metrics.irr, irrStatus: res.metrics.irrStatus };
    }),
    comparison: {
      tieBackNpv: tie.metrics.npv,
      tieBackCapex: tieCapex,
      fpsoNpv: baseRun.metrics.npv,
      fpsoCapex,
      tieBackPerMillionDerived: tie.metrics.npv / tieCapex,
      fpsoPerMillionDerived: baseRun.metrics.npv / fpsoCapex,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 5. The plan's own economics, and when there are none.
// ---------------------------------------------------------------------------

/** The three year profile the price deck probe is run on, kbpd. */
export const PRICE_DECK_PROBE = { capexMM: 800, annualOpexMM: 60, productionKbpd: [10, 20, 30], priceUsd: 70 };

export const planEconomics = () => {
  const items = clone(EGINA_COSTS);
  const capexSum = CO.calculateTotalCAPEX(items);
  const opexSum = CO.calculateTotalOPEX(items);
  const kase = planCase();
  const run = E.runFdpCase(kase);
  const withoutEnd = E.runFdpCase({ ...planCase(), abandonment: undefined });
  const deck = (n) => new Array(n).fill({ oil_price_usd: PRICE_DECK_PROBE.priceUsd });
  const short = refusalOf(() => CO.calculateCashFlows(
    PRICE_DECK_PROBE.capexMM, PRICE_DECK_PROBE.annualOpexMM, clone(PRICE_DECK_PROBE.productionKbpd), deck(2),
  ));
  return {
    items,
    capexTotal: capexSum,
    opexTotal: opexSum,
    abexAmount: EGINA_COSTS[6].amount,
    byPhase: Object.entries(CO.calculateCostByPhase(items)).map(([phase, total]) => ({ phase, total })),
    planRun: {
      capex: kase.capexMM,
      annualOpex: kase.annualOpexMM,
      years: kase.productionKbpd.length,
      priceUsd: kase.pricesUsd[0],
      npv: run.metrics.npv,
      irr: run.metrics.irr,
      irrStatus: run.metrics.irrStatus,
      payback: E.paybackYears(run),
    },
    abandonment: {
      source: run.abandonmentSource,
      amountMM: run.abandonmentMM,
      year: run.abandonmentYear,
      basis: kase.abandonment.abandonmentBasis,
      withoutNpv: withoutEnd.metrics.npv,
      withoutIrr: withoutEnd.metrics.irr,
      withoutIrrStatus: withoutEnd.metrics.irrStatus,
      // What charging it costs the plan: two engine NPVs, one subtraction.
      costDerived: withoutEnd.metrics.npv - run.metrics.npv,
    },
    conceptCapex: SC.conceptCapexMM(clone(FPSO)),
    priceDeck: {
      shortRefusal: short,
      coveredNpv: CO.calculateNPV(CO.calculateCashFlows(
        PRICE_DECK_PROBE.capexMM, PRICE_DECK_PROBE.annualOpexMM, clone(PRICE_DECK_PROBE.productionKbpd), deck(3),
      )),
    },
    sweep: E.runFdpSensitivity(kase).map((s) => ({
      name: s.name,
      lowParamNPV: s.lowParamNPV,
      highParamNPV: s.highParamNPV,
      baseNPV: s.baseNPV,
      swingDerived: Math.abs(s.highParamNPV - s.lowParamNPV),
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 6. The plan that cannot be costed yet.
// ---------------------------------------------------------------------------

export const completeness = () => {
  const plan = eginaPlan();
  const score = FD.calculateCompleteness(plan);
  const validation = FD.validateFDPData(plan);
  const noEconomics = { ...plan, economics: { npv: 0, capex: 0 } };
  const summaryOnly = { ...plan, subsurface: { reserves: { summary: { p50: 130 }, breakdown: [] } } };
  const unreadable = { ...plan, subsurface: { reserves: { breakdown: [{ name: 'Unlabelled', p50: 99 }] } } };
  return {
    egina: { score: score.score, valid: score.breakdown.filter((c) => c.valid).length, sections: score.breakdown.length },
    validation: { isValid: validation.isValid, errors: validation.errors, warnings: validation.warnings },
    noEconomics: { score: FD.calculateCompleteness(noEconomics).score, errors: FD.validateFDPData(noEconomics).errors },
    summaryOnlyP50: FD.planReservesP50(summaryOnly),
    unreadable: {
      p50: FD.planReservesP50(unreadable),
      score: FD.calculateCompleteness(unreadable).score,
      isValid: FD.validateFDPData(unreadable).isValid,
      errors: FD.validateFDPData(unreadable).errors,
    },
    planP50: { oil: FD.planReservesP50(plan), gas: FD.planReservesP50(plan, 'Gas') },
    published: fdpGolden.plan.map((c) => ({
      name: c.name,
      score: c.expected.completeness.score,
      isValid: c.expected.validation.isValid,
      errors: c.expected.validation.errors,
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 7. The schedule as a network.
// ---------------------------------------------------------------------------

export const network = () => {
  const net = clone(EGINA_NETWORK);
  const cpm = SH.calculateCPM(net);
  const textbook = fdpGolden.schedule.find((c) => c.name.startsWith('textbook network'));
  return {
    activities: net.map((a) => ({ id: a.id, name: a.name, type: a.type, duration: a.duration, dependencies: a.dependencies })),
    cpm: cpm.map((a) => ({ id: a.id, name: a.name, duration: a.duration, es: a.es, ef: a.ef, ls: a.ls, lf: a.lf, float: a.float, isCritical: a.isCritical })),
    duration: SH.calculateNetworkDuration(net),
    paths: SH.criticalPaths(net),
    calendarSpan: SH.calculateProjectDuration(net),
    withFloat: cpm.filter((a) => !a.isCritical).map((a) => ({ id: a.id, float: a.float })),
    refusals: fdpGolden.schedule.filter((c) => c.expected.refused).map((c) => ({
      name: c.name,
      ...refusalOf(() => SH.calculateCPM(clone(c.inputs))),
    })),
    published: fdpGolden.schedule.filter((c) => !c.expected.refused && c.inputs.length).map((c) => {
      const t = SH.calculateCPM(clone(c.inputs));
      return {
        name: c.name,
        duration: SH.calculateNetworkDuration(clone(c.inputs)),
        critical: t.filter((a) => a.isCritical).map((a) => a.id),
        paths: SH.criticalPaths(clone(c.inputs)),
        goldenDuration: c.expected.cpmReference.projectDurationDays,
        goldenCritical: c.expected.cpmReference.criticalActivities,
      };
    }),
    textbook: {
      retiredCount: textbook.expected.retiredPassthrough.length,
      criticalPath: textbook.expected.cpmReference.criticalPaths[0],
      disagreements: textbook.expected.criticalityDisagreements,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 8. Dates that do not move.
// ---------------------------------------------------------------------------

export const dates = () => ({
  dstWindow: { ...DST_WINDOW, days: SH.calculateProjectDuration([{ ...DST_WINDOW }]) },
  undatedSpan: SH.calculateProjectDuration([{ id: 'x', duration: 3 }]),
  emptySpan: SH.calculateProjectDuration([]),
  milestones: SH.identifyMilestones(clone(EGINA_NETWORK)).map((a) => a.name),
  conceptSchedules: CONCEPT_DATE_PROBES.map(([startDate, facilityType]) => {
    const s = CN.calculateConceptSchedule({ startDate, facilityType });
    return { startDate, facilityType, firstOilDate: s.firstOilDate, durationMonths: s.durationMonths };
  }),
  unreadableStartRefusal: refusalOf(() => CN.calculateConceptSchedule({ startDate: 'next spring' })),
});

// ---------------------------------------------------------------------------
// SECTION 9. Wells, and what a rig day costs.
// ---------------------------------------------------------------------------

const wellDays = (well) => WL.calculateDrillingTime(well.md, well.trajectory);
const wellCost = (well, rate) => WL.calculateDrillingCost(wellDays(well), rate);

export const wellsAndRigs = () => {
  const rows = clone(EGINA_WELLS).map((well) => ({
    name: well.name,
    type: well.type,
    trajectory: well.trajectory,
    md: well.md,
    days: wellDays(well),
    cost: wellCost(well, EGINA_RIG_RATE),
  }));
  const totalDays = rows.reduce((s, x) => s + x.days, 0);
  const totalCost = rows.reduce((s, x) => s + x.cost, 0);
  return {
    rigRate: EGINA_RIG_RATE,
    rows,
    totals: {
      daysDerived: totalDays,
      costDerived: totalCost,
      costMMDerived: totalCost / 1e6,
      // Trajectory and depth move the DAYS; the day itself is priced the same
      // for every well, so every row divides to this one all-in day.
      allInDayDerived: totalCost / totalDays,
    },
    alternativeRate: {
      rate: ALTERNATIVE_RIG_RATE,
      costDerived: clone(EGINA_WELLS).reduce((s, well) => s + wellCost(well, ALTERNATIVE_RIG_RATE), 0),
    },
    trajectories: TRAJECTORIES.map((trajectory) => {
      const days = WL.calculateDrillingTime(PROBE_WELL_DEPTH_FT, trajectory);
      return { trajectory, depthFt: PROBE_WELL_DEPTH_FT, days, cost: WL.calculateDrillingCost(days, EGINA_RIG_RATE) };
    }),
    complexities: COMPLEXITIES.map((complexity) => ({
      complexity,
      depthFt: PROBE_WELL_DEPTH_FT,
      days: WL.calculateDrillingTime(PROBE_WELL_DEPTH_FT, 'Horizontal', complexity),
    })),
    // Each well goes to the rig that comes free first: the digest's own
    // arithmetic on the engine's per-well days, not an engine scheduler.
    campaigns: EGINA_RIG_COUNTS.map((rigs) => {
      const free = new Array(rigs).fill(0);
      clone(EGINA_WELLS).forEach((well) => {
        const days = wellDays(well);
        let next = 0;
        for (let i = 1; i < free.length; i += 1) if (free[i] < free[next]) next = i;
        free[next] += days;
      });
      return { rigs, daysDerived: Math.max(...free), rigDaysDerived: totalDays, rigFinishDaysDerived: [...free] };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 10. Facilities, sized and priced.
// ---------------------------------------------------------------------------

export const facilities = () => {
  const rows = clone(EGINA_FACILITIES).map((fac) => {
    const cost = FA.calculateFacilityCost(clone(fac));
    const cap = FA.calculateFacilityCapacity(clone(fac));
    return {
      name: fac.name,
      type: fac.type,
      nameplateCapacity: fac.nameplateCapacity,
      capex: cost.capex,
      opex: cost.opex,
      decommissioning: cost.decommissioning,
      gasCapacity: cap.gasCapacity,
      waterHandling: cap.waterHandling,
      oilCapacity: cap.oilCapacity,
    };
  });
  const small = rows[0];
  const big = rows[1];
  const peakKbpd = FPSO.peakProduction;
  const peakBpd = peakKbpd * 1000;
  const gasMscfd = (peakBpd * EGINA_FLUID.gor) / 1000;
  return {
    rows,
    scaling: {
      fromNameplate: small.nameplateCapacity,
      toNameplate: big.nameplateCapacity,
      sizeFactorDerived: big.nameplateCapacity / small.nameplateCapacity,
      capexFactorDerived: big.capex / small.capex,
      opexFactorDerived: big.opex / small.opex,
    },
    decommissioning: {
      rows: rows.map((x) => ({
        name: x.name,
        capex: x.capex,
        decommissioning: x.decommissioning,
        // Taken from the engine's own unrounded values, which is why a share
        // read off the four decimal figures can land a digit out.
        shareDerived: x.decommissioning / x.capex,
      })),
    },
    utilisation: {
      peakKbpd,
      peakBpdDerived: peakBpd,
      gor: EGINA_FLUID.gor,
      gasMscfdDerived: gasMscfd,
      rows: clone(EGINA_FACILITIES).map((fac) => {
        const cap = FA.calculateFacilityCapacity(clone(fac));
        return {
          name: fac.name,
          oilUtilisationDerived: peakBpd / cap.oilCapacity,
          gasUtilisationDerived: gasMscfd / cap.gasCapacity,
          // There is no produced water forecast at all, so there is nothing
          // to divide the water handling capacity by.
          waterHandling: cap.waterHandling,
          bottlenecks: FA.identifyBottlenecks(clone(fac), { oil: peakBpd, gas: gasMscfd, water: 0 }),
        };
      }),
    },
    flowAssurance: {
      fluid: { ...EGINA_FLUID },
      rows: clone(EGINA_FACILITIES).map((fac) => {
        const fa = FA.calculateFlowAssuranceRisk(clone(fac), clone(EGINA_FLUID));
        return { name: fac.name, score: fa.score, level: fa.level, hazards: fa.risks.map((x) => `${x.type} ${x.severity}`) };
      }),
      h2sProbe: {
        name: EGINA_FACILITIES[2].name,
        h2sPpm: 12,
        hazards: FA.calculateFlowAssuranceRisk(clone(EGINA_FACILITIES[2]), { ...clone(EGINA_FLUID), h2s: 12 }).risks.map((x) => `${x.type} ${x.severity}`),
      },
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. One risk scale.
// ---------------------------------------------------------------------------

/** The probability and impact pairs the band table walks, high to low. */
export const RISK_BAND_PROBES = [[5, 5], [4, 5], [4, 4], [3, 4], [3, 3], [2, 3], [2, 2], [1, 3], [1, 1]];

export const riskRegister = () => {
  const risks = clone(EGINA_RISKS);
  const levels = RK.aggregateRisksByLevel(risks);
  const matrix = HS.calculateRiskMatrix(risks);
  const scoredOnly = risks.filter((risk) => RM.riskScore(risk) !== null);
  const exposure = RK.calculateRiskExposure(risks);
  const withoutUnscored = RK.calculateRiskExposure(scoredOnly);
  const largest = risks[0];
  return {
    bands: RISK_BAND_PROBES.map(([probability, impact]) => ({
      probability, impact, score: RM.riskScore({ probability, impact }), level: RM.getRiskLevel(probability * impact).level,
    })),
    rows: risks.map((risk) => {
      const score = RM.riskScore(risk);
      return {
        name: risk.name,
        source: risk.source,
        probability: risk.probability ?? null,
        impact: risk.impact ?? null,
        score,
        band: score === null ? 'Unscored' : RM.getRiskLevel(score).level,
        costImpact: risk.costImpact,
        mitigation: risk.mitigation,
      };
    }),
    levels: { Critical: levels.Critical, High: levels.High, Medium: levels.Medium, Low: levels.Low, Unscored: levels.Unscored },
    matrix: { critical: matrix.critical, high: matrix.high, medium: matrix.medium, low: matrix.low, unscored: matrix.unscored, total: matrix.total },
    consolidated: RK.calculateConsolidatedRiskScore(risks),
    unscoredCount: RK.countUnscoredRisks(risks),
    health: RK.calculatePortfolioHealth(risks),
    healthWithoutUnscored: RK.calculatePortfolioHealth(scoredOnly),
    exposure,
    factors: { ...RISK_PROBABILITY_FACTORS },
    largest: {
      name: largest.name,
      factor: RISK_PROBABILITY_FACTORS[largest.probability],
      costImpact: largest.costImpact,
      contributionDerived: RISK_PROBABILITY_FACTORS[largest.probability] * largest.costImpact,
    },
    contributions: risks.map((risk) => ({
      name: risk.name,
      probability: risk.probability === undefined ? null : risk.probability,
      factor: RISK_PROBABILITY_FACTORS[risk.probability] ?? null,
      costImpact: risk.costImpact,
      contributionDerived: risk.probability === undefined ? null : RISK_PROBABILITY_FACTORS[risk.probability] * risk.costImpact,
    })),
    // What the register would cost if every risk happened. Not the exposure,
    // and not a worst case either.
    costImpactTotalDerived: risks.reduce((sum, risk) => sum + risk.costImpact, 0),
    unscored: {
      costImpact: risks[4].costImpact,
      impact: risks[4].impact,
      // The whole register's exposure less the same register without the
      // unscored risk: what a risk with no probability adds.
      contributionDerived: exposure - withoutUnscored,
    },
    bySource: RK.aggregateRisksBySource(risks),
    published: fdpGolden.risk.map((c) => ({
      name: c.name,
      consolidatedScore: c.expected.consolidatedScore,
      exposure: c.expected.exposure,
      health: c.expected.health,
      byLevel: c.expected.byLevel,
    })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 12. The document, and what it reports.
// ---------------------------------------------------------------------------

export const documentRollups = () => {
  const plan = eginaPlan();
  const score = FD.calculateCompleteness(plan);
  const items = clone(EGINA_COSTS);
  const run = E.runFdpCase(planCase());
  return {
    completeness: score.score,
    modules: score.breakdown.map((c) => c.module),
    breakdown: score.breakdown.map((c) => ({ module: c.module, valid: c.valid })),
    headline: {
      oilP50: FD.planReservesP50(plan),
      gasP50: FD.planReservesP50(plan, 'Gas'),
      totalCapex: CO.calculateTotalCAPEX(items),
      npv: run.metrics.npv,
      irr: run.metrics.irr,
      irrStatus: run.metrics.irrStatus,
      wells: EGINA_WELLS.length,
    },
    totals: { capex: CO.calculateTotalCAPEX(items), opex: CO.calculateTotalOPEX(items) },
    published: fdpGolden.costItems.map((c) => ({ name: c.name, totalCAPEX: c.expected.totalCAPEX, totalOPEX: c.expected.totalOPEX })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. The rate of return, and when there is none.
// ---------------------------------------------------------------------------

/** The two cases of section 13 that are not a scenario: a case that only spends, and a tiny capex against one fat year. */
export const IRR_PROBE_CASES = [
  ['a case that only spends', { capexMM: 500, annualOpexMM: 20, productionKbpd: [0, 0, 0], pricesUsd: [70, 70, 70] }],
  ['the published tiny capex case, listed again below', { capexMM: 1, annualOpexMM: 0, productionKbpd: [10], pricesUsd: [75] }],
];

export const rateOfReturn = () => {
  const scenarioRow = (label, oilPrice) => {
    const res = SC.runScenario({ ...clone(BASE), oilPrice }, clone(FPSO), abex());
    return { label, npv: res.metrics.npv, irr: res.metrics.irr, irrStatus: res.metrics.irrStatus };
  };
  const rootRow = (label, scenario, concept) => {
    const res = SC.runScenario(clone(scenario), clone(concept), abex());
    return { label, npv: res.metrics.npv, irrStatus: res.metrics.irrStatus, roots: res.metrics.irrRoots };
  };
  const kase = planCase();
  const planRun = E.runFdpCase(kase);
  const baseWithoutEnd = SC.runScenario(clone(BASE), clone(FPSO));
  const recovered = fdpGolden.fdpCase.find((c) => c.name.startsWith('suite test: never pays back'));
  const recoveredRun = recovered ? E.runFdpCase(clone(recovered.inputs)) : null;
  return {
    statuses: [...IRR_STATUSES],
    band: { ...IRR_BAND },
    rows: [
      scenarioRow('EGINA Base, 70 USD a barrel', BASE.oilPrice),
      scenarioRow('EGINA at 18 USD a barrel', STRESS_PRICES.noRoot),
      scenarioRow('EGINA at 30 USD a barrel', STRESS_PRICES.alsoNoRoot),
      ...IRR_PROBE_CASES.map(([label, inputs]) => {
        const res = E.runFdpCase(clone(inputs));
        return { label, npv: res.metrics.npv, irr: res.metrics.irr, irrStatus: res.metrics.irrStatus };
      }),
    ],
    published: fdpGolden.fdpCase.filter((c) => c.expected.metrics.irr === null).map((c) => {
      const res = E.runFdpCase(clone(c.inputs));
      return {
        name: c.name,
        npv: res.metrics.npv,
        irrStatus: res.metrics.irrStatus,
        hiddenRootPercent: c.expected.irrRootsPercent ? c.expected.irrRootsPercent[0] : null,
      };
    }),
    recovered: recoveredRun && {
      name: recovered.name,
      npv: recoveredRun.metrics.npv,
      irr: recoveredRun.metrics.irr,
      irrStatus: recoveredRun.metrics.irrStatus,
    },
    multipleRoots: {
      capexMM: kase.capexMM,
      years: kase.productionKbpd.length,
      abandonmentMM: planRun.abandonmentMM,
      rows: [
        rootRow('EGINA Base, 70 USD a barrel', BASE, FPSO),
        rootRow('EGINA Low price, 48 USD a barrel', EGINA_SCENARIOS[1], FPSO),
        rootRow('EGINA High price, 92 USD a barrel', EGINA_SCENARIOS[2], FPSO),
        rootRow('EGINA Tie-back base, 70 USD a barrel', EGINA_SCENARIOS[4], TIEBACK),
        rootRow('EGINA at 18 USD a barrel', { ...clone(BASE), oilPrice: STRESS_PRICES.noRoot }, FPSO),
      ],
      // The same case with no end-of-life cost: one rate, and a status of ok.
      withoutEnd: { irr: baseWithoutEnd.metrics.irr, irrStatus: baseWithoutEnd.metrics.irrStatus },
    },
    paybacks: [
      ['EGINA Base', BASE.oilPrice],
      ['EGINA at 30 USD a barrel', STRESS_PRICES.alsoNoRoot],
      ['EGINA at 18 USD a barrel', STRESS_PRICES.noRoot],
    ].map(([label, oilPrice]) => ({ label, payback: SC.scenarioPayback({ ...clone(BASE), oilPrice }, clone(FPSO)) })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. What a sensitivity says, and what it does not.
// ---------------------------------------------------------------------------

export const sensitivitySweep = () => {
  const sweep = E.runFdpSensitivity(planCase()).map((s) => {
    const swing = Math.abs(s.highParamNPV - s.lowParamNPV);
    return {
      name: s.name,
      lowParamNPV: s.lowParamNPV,
      highParamNPV: s.highParamNPV,
      baseNPV: s.baseNPV,
      swingDerived: swing,
      swingShareDerived: swing / Math.abs(s.baseNPV),
    };
  });
  return {
    rows: sweep,
    rankedBySwingDerived: [...sweep].sort((a, b) => b.swingDerived - a.swingDerived).map((s) => s.name),
    capexRow: sweep[1],
    published: fdpGolden.sensitivity.map((c) => {
      const s = E.runFdpSensitivity({
        capexMM: c.inputs.capexMM,
        annualOpexMM: c.inputs.annualOpexMM,
        productionKbpd: clone(c.inputs.productionKbpd),
        pricesUsd: clone(c.inputs.pricesUsd),
        fiscal: clone(c.inputs.fiscal) || {},
      });
      return {
        name: c.name,
        capexMM: c.inputs.capexMM,
        annualOpexMM: c.inputs.annualOpexMM,
        years: c.inputs.productionKbpd.length,
        priceUsd: c.inputs.pricesUsd[0],
        fiscal: c.inputs.fiscal ? { royaltyRate: c.inputs.fiscal.royaltyRate, taxRate: c.inputs.fiscal.taxRate } : null,
        baseNPV: s[0].baseNPV,
        drivers: s.map((x) => ({ name: x.name, lowParamNPV: x.lowParamNPV, highParamNPV: x.highParamNPV })),
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 15. Earned value, measured to a date.
// ---------------------------------------------------------------------------

/** The one task of the ahead-of-plan probe: 90 percent done half way through its window. */
export const AHEAD_TASK = { name: 'ahead', planned_cost: 1000000, percent_complete: 90, planned_start_date: '2028-01-01', planned_end_date: '2028-12-31' };
export const AHEAD_AS_OF = '2028-07-02';
/** The costed task nobody has dated, added to ODUDU-2. */
export const UNDATED_TASK = { name: 'Late scope, undated', planned_cost: 900000, percent_complete: 10 };
/** The two ODUDU-2 tasks whose planned cost the zero-cost probe drops, and the progress each carries. */
export const ZERO_COST_PROBES = [['Procurement', 30], ['Fabrication', 0]];
/** A project with no costed task at all. */
export const UNCOSTED_TASKS = [{ name: 'no cost' }, { name: 'no cost either' }];
/** The as-of date that is not a date. */
export const BAD_AS_OF = 'last Friday';
/** The ratio the app used to call SPI, shown at the half way point it could never pass. */
export const OLD_RATIO_EXAMPLE = 0.5;

/** One as-of reading of ODUDU-2. Only the digest's own dates are allowed. */
export const oduduAsOf = (asOf) => {
  if (!ODUDU_AS_OF.includes(asOf)) throw new Error(`oduduAsOf: the digest's as-of dates only, not ${asOf}`);
  const e = PC.calculateEVM(clone(ODUDU_TASKS), { asOf });
  return { asOf, pv: e.pv, ev: e.ev, ac: e.ac, spi: e.spi, cpi: e.cpi, completionRatio: e.completionRatio, bac: e.bac, spiBasis: e.spiBasis };
};

export const earnedValue = () => {
  const mid = PC.calculateEVM(clone(ODUDU_TASKS), { asOf: ODUDU_MID_AS_OF });
  const ahead = PC.calculateEVM([clone(AHEAD_TASK)], { asOf: AHEAD_AS_OF });
  const undated = PC.calculateEVM([...clone(ODUDU_TASKS), clone(UNDATED_TASK)], { asOf: ODUDU_MID_AS_OF });
  const uncosted = PC.calculateEVM(clone(UNCOSTED_TASKS), { asOf: ODUDU_MID_AS_OF });
  return {
    tasks: clone(ODUDU_TASKS).map((t) => ({
      name: t.name,
      plannedCost: t.planned_cost,
      actualCost: t.actual_cost,
      percentComplete: t.percent_complete,
      plannedStart: t.planned_start_date,
      plannedEnd: t.planned_end_date,
    })),
    asOfRows: ODUDU_AS_OF.map((d) => oduduAsOf(d)),
    mid: {
      asOf: ODUDU_MID_AS_OF,
      bac: mid.bac,
      pv: mid.pv,
      ev: mid.ev,
      ac: mid.ac,
      spi: mid.spi,
      cpi: mid.cpi,
      completionRatio: mid.completionRatio,
      spiBasis: mid.spiBasis,
      oldRatioExample: OLD_RATIO_EXAMPLE,
    },
    ahead: { asOf: AHEAD_AS_OF, percentComplete: AHEAD_TASK.percent_complete, spi: ahead.spi, completionRatio: ahead.completionRatio },
    undated: {
      asOf: ODUDU_MID_AS_OF,
      plannedCost: UNDATED_TASK.planned_cost,
      percentComplete: UNDATED_TASK.percent_complete,
      spi: undated.spi,
      spiBasis: undated.spiBasis,
      bac: undated.bac,
      ev: undated.ev,
      completionRatio: undated.completionRatio,
    },
    // A planned cost read as zero takes the task's budget out of the
    // denominator AND the value it had already earned out of the numerator.
    zeroCost: ZERO_COST_PROBES.map(([taskName, percentComplete]) => {
      const e = PC.calculateEVM(
        clone(ODUDU_TASKS).map((t) => (t.name === taskName ? { ...t, planned_cost: 0 } : t)),
        { asOf: ODUDU_MID_AS_OF },
      );
      return { taskName, percentComplete, bac: e.bac, ev: e.ev, completionRatio: e.completionRatio, spi: e.spi };
    }),
    uncosted: { spi: uncosted.spi, cpi: uncosted.cpi, percentComplete: uncosted.percentComplete, spiBasis: uncosted.spiBasis },
    refusals: afeGolden.evmRefusals.map((c) => ({
      name: c.name,
      ...refusalOf(() => PC.calculateEVM(clone(c.inputs.tasks), { asOf: c.inputs.asOf })),
    })),
    badAsOfRefusal: refusalOf(() => PC.calculateEVM(clone(ODUDU_TASKS), { asOf: BAD_AS_OF })),
    published: afeGolden.evm.map((c) => {
      const e = PC.calculateEVM(clone(c.inputs.tasks), { asOf: c.inputs.asOf });
      return { name: c.name, asOf: c.inputs.asOf, pv: e.pv, ev: e.ev, ac: e.ac, spi: e.spi, cpi: e.cpi };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 16. Reading a plan against itself.
// ---------------------------------------------------------------------------

export const reconciliations = () => {
  const net = clone(EGINA_NETWORK);
  const items = clone(EGINA_COSTS);
  const baseRun = SC.runScenario(clone(BASE), clone(FPSO), abex());
  const planRun = E.runFdpCase(planCase());
  const networkDays = SH.calculateNetworkDuration(net);
  const calendarDays = SH.calculateProjectDuration(net);
  return {
    cost: {
      conceptCapex: SC.conceptCapexMM(clone(FPSO)),
      conceptDrillingCapex: FPSO.drillingCapex,
      conceptFacilitiesCapex: FPSO.facilitiesCapex,
      conceptSubseaCapex: FPSO.subseaCapex,
      costItemsCapex: CO.calculateTotalCAPEX(items),
      facilityScreeningCapex: FA.calculateFacilityCost(clone(EGINA_FACILITIES[0])).capex,
      // The only pair that is like for like: one facility against the
      // concept's FACILITIES field, not against the whole development.
      likeForLikeGapDerived: FA.calculateFacilityCost(clone(EGINA_FACILITIES[0])).capex - FPSO.facilitiesCapex,
    },
    schedule: {
      networkDays,
      calendarDays,
      spentFloatDerived: calendarDays - networkDays,
    },
    economics: {
      conceptCaseNpv: baseRun.metrics.npv,
      planCaseNpv: planRun.metrics.npv,
      differenceDerived: Math.abs(baseRun.metrics.npv - planRun.metrics.npv),
    },
  };
};

// ---------------------------------------------------------------------------
// The end-to-end reading the course page prints.
// ---------------------------------------------------------------------------

export const endToEnd = () => {
  const s = scenarioValues();
  const n = network();
  const r = riskRegister();
  const ev = earnedValue();
  const rec = reconciliations();
  return {
    base: s.rows[0],
    stress: s.rows[3],
    network: { duration: n.duration, calendarSpan: n.calendarSpan, path: n.paths[0] },
    risk: { health: r.health, exposure: r.exposure, unscored: r.levels.Unscored },
    earned: { asOf: ev.mid.asOf, pv: ev.mid.pv, evValue: ev.mid.ev, spi: ev.mid.spi, cpi: ev.mid.cpi, completionRatio: ev.mid.completionRatio },
    reconcile: rec,
  };
};

// ===========================================================================
// THE CAPSTONE. UKOT AND MEREN-3 ONLY. NOT FOR LESSONS, NOT FOR PANELS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL. UKOT's reservoirs, concepts,
// scenarios, cost items, schedule, wells, rig rate, facilities and risks, and
// MEREN-3's tasks and as-of date, are copied VERBATIM from
// /root/ec-wip-fdp/ec6_fields_capstone.mjs so the grader, the lab's own tests
// and the migration headers all read one derivation. Every name carries UKOT or
// MEREN, and panelCapstoneGuard.test.js greps the three panel sources and the
// learning page for every one of them. The leak gate in fdpLab.test.js checks
// every TEACHING export's return values against the eighteen graded answers.
//
// The teaching digest and the capstone are two files with opposite audiences
// and they never share a number.
// ===========================================================================

export const UKOT_RESERVOIRS = [
  { id: 'uk-1', name: 'Ukot North', fluid: 'Oil', p90: 48, p50: 82, p10: 130, rf: 0.31 },
  { id: 'uk-2', name: 'Ukot South', fluid: 'Oil', p90: 17, p50: 29, p10: 47, rf: 0.26 },
  { id: 'uk-3', name: 'Ukot Shallow Gas', fluid: 'Gas', p90: 26, p50: 46, p10: 73, rf: 0.61 },
  { id: 'uk-4', name: 'Ukot Deep Gas', fluid: 'Gas', p90: 15, p50: 28, p10: 45, rf: 0.58 },
];
export const UKOT_CONCEPT = {
  id: 301, name: 'Wellhead platform', facilityType: 'Platform',
  drillingCapex: 410, facilitiesCapex: 760, subseaCapex: 150,
  opex: 68, lifeOfField: 18, peakProduction: 44,
  startDate: '2028-06-01', driveMechanism: 'Water Injection',
};
export const UKOT_ALTERNATIVE = {
  id: 302, name: 'Extended tie-back', facilityType: 'Subsea Tie-back',
  drillingCapex: 190, facilitiesCapex: 120, subseaCapex: 260,
  opex: 33, lifeOfField: 14, peakProduction: 19,
  startDate: '2028-06-01', driveMechanism: 'Natural Depletion',
};
export const UKOT_BASE = { id: 401, name: 'Board case', type: 'Base', conceptId: 301, oilPrice: 68, discountRate: 10 };
export const UKOT_STRESS = { id: 402, name: 'Low case', type: 'Low', conceptId: 301, oilPrice: 22, discountRate: 10 };
export const UKOT_COSTS = [
  { id: 'k1', name: 'Development wells', type: 'CAPEX', amount: 410, phase: 'Execution' },
  { id: 'k2', name: 'Platform jacket and topsides', type: 'CAPEX', amount: 760, phase: 'Construction' },
  { id: 'k3', name: 'Flowlines and umbilicals', type: 'CAPEX', amount: 150, phase: 'Installation' },
  { id: 'k4', name: 'Operations', type: 'OPEX', amount: 44, phase: 'Operate' },
  { id: 'k5', name: 'Integrity and inspection', type: 'OPEX', amount: 24, phase: 'Operate' },
  { id: 'k6', name: 'Abandonment provision', type: 'ABEX', amount: 190, phase: 'Operate' },
];
export const UKOT_SCHEDULE = [
  { id: 'u1', name: 'Sanction', type: 'Milestone', duration: 0, dependencies: [], start: '2028-06-01', end: '2028-06-01' },
  { id: 'u2', name: 'Jacket fabrication', type: 'Fabrication', duration: 260, dependencies: ['u1'], start: '2028-06-02', end: '2029-02-16' },
  { id: 'u3', name: 'Topsides fabrication', type: 'Fabrication', duration: 380, dependencies: ['u1'], start: '2028-06-02', end: '2029-06-16' },
  { id: 'u4', name: 'Flowline procurement', type: 'Procurement', duration: 190, dependencies: ['u1'], start: '2028-06-02', end: '2028-12-08' },
  { id: 'u5', name: 'Offshore installation', type: 'Installation', duration: 120, dependencies: ['u2', 'u3'], start: '2029-06-17', end: '2029-10-14' },
  { id: 'u6', name: 'Hook up and commissioning', type: 'Commissioning', duration: 171, dependencies: ['u5'], start: '2029-10-15', end: '2030-04-03' },
  { id: 'u7', name: 'First production', type: 'Milestone', duration: 0, dependencies: ['u4', 'u6'], start: '2030-07-05', end: '2030-07-05' },
];
export const UKOT_WELLS = [
  { id: 'k-w1', name: 'UK-01', type: 'Producer', trajectory: 'Horizontal', md: 13100 },
  { id: 'k-w2', name: 'UK-02', type: 'Producer', trajectory: 'Deviated', md: 10400 },
  { id: 'k-w3', name: 'UK-03', type: 'Water Injector', trajectory: 'Vertical', md: 8700 },
];
export const UKOT_RIG_RATE = 265000;
export const UKOT_FACILITIES = [
  { id: 'k-f1', name: 'Ukot platform', type: 'Platform', nameplateCapacity: 45000, designLife: 18 },
  { id: 'k-f2', name: 'Ukot platform, expanded', type: 'Platform', nameplateCapacity: 110000, designLife: 18 },
];
export const UKOT_RISKS = [
  { id: 'k-r1', name: 'Jacket delivery slips', probability: 3, impact: 5, costImpact: 150, source: 'Fabrication', mitigation: 'Penalty clause and a second slot' },
  { id: 'k-r2', name: 'Weather window missed', probability: 4, impact: 4, costImpact: 210, source: 'Installation', mitigation: 'Early season campaign' },
  { id: 'k-r3', name: 'Injector underperforms', probability: 2, impact: 3, costImpact: 95, source: 'Subsurface', mitigation: 'Pilot injection test' },
  { id: 'k-r4', name: 'Permit renewal', probability: 1, impact: 4, costImpact: 60, source: 'Regulatory', mitigation: 'File twelve months early' },
];
export const MEREN_TASKS = [
  { name: 'Concept select', planned_cost: 1800000, actual_cost: 1950000, percent_complete: 100, planned_start_date: '2029-02-01', planned_end_date: '2029-07-31' },
  { name: 'Define and FEED', planned_cost: 4600000, actual_cost: 2860000, percent_complete: 70, planned_start_date: '2029-06-01', planned_end_date: '2030-05-31' },
  { name: 'Equipment orders', planned_cost: 7300000, actual_cost: 1180000, percent_complete: 20, planned_start_date: '2029-11-01', planned_end_date: '2030-12-31' },
  { name: 'Site construction', planned_cost: 9900000, actual_cost: 0, percent_complete: 0, planned_start_date: '2030-07-01', planned_end_date: '2031-09-30' },
];
export const MEREN_AS_OF = '2030-03-31';

const UKOT_MONEY = 0.05; // million USD, on a screening NPV
const UKOT_EXACT_MONEY = 0.001; // million USD, on a figure the learner reads off unchanged
const UKOT_PERCENT = 0.01;
const UKOT_DAYS = 0.5;
const UKOT_USD = 1; // whole currency units
const UKOT_FACILITY_MONEY = 0.01;
const MEREN_RATIO = 0.00001;

/** The capstone runs, exactly as the derivation makes them. */
export const ukotRuns = () => {
  const net = UKOT_SCHEDULE.map((a) => ({ ...a, startDate: a.start, endDate: a.end }));
  const agg = SB.aggregateReserves(clone(UKOT_RESERVOIRS));
  // EC6-8: UKOT carries an ABEX cost item, so every case it implies is charged
  // that end-of-life cost in its final production year.
  const end = E.planAbandonment({ costs: { items: clone(UKOT_COSTS) }, facilities: { list: clone(UKOT_FACILITIES) } });
  const base = SC.runScenario(clone(UKOT_BASE), clone(UKOT_CONCEPT), end);
  const stress = SC.runScenario(clone(UKOT_STRESS), clone(UKOT_CONCEPT), end);
  const alt = SC.runScenario({ ...clone(UKOT_BASE), conceptId: 302 }, clone(UKOT_ALTERNATIVE), end);
  const shape = SC.conceptProfileKbpd(clone(UKOT_CONCEPT));
  const kase = {
    capexMM: CO.calculateTotalCAPEX(clone(UKOT_COSTS)),
    annualOpexMM: CO.calculateTotalOPEX(clone(UKOT_COSTS)),
    productionKbpd: shape,
    pricesUsd: new Array(shape.length).fill(UKOT_BASE.oilPrice),
    abandonment: end,
  };
  const sweep = E.runFdpSensitivity(kase);
  return {
    agg,
    base,
    stress,
    alt,
    net,
    sweep,
    price: sweep.find((s) => s.name === 'Oil Price'),
    evm: PC.calculateEVM(clone(MEREN_TASKS), { asOf: MEREN_AS_OF }),
  };
};

/**
 * The eighteen graded fields as [tier, key, value, tolerance], in the order and
 * with the tolerances the capstone publishes. THE TOLERANCE IS ABSOLUTE, in the
 * field's own units: academy_submit_capstone grades abs(v_got - v_exp) <= v_tol.
 */
export const ukotCapstoneFields = () => {
  const { agg, base, stress, alt, net, price, evm } = ukotRuns();
  const wellCostOf = (well) => WL.calculateDrillingCost(WL.calculateDrillingTime(well.md, well.trajectory), UKOT_RIG_RATE);
  return [
    ['beginner', 'ukot_concept_capex_mm', SC.conceptCapexMM(clone(UKOT_CONCEPT)), UKOT_EXACT_MONEY],
    ['beginner', 'ukot_oil_p50_mmbbl', SB.reservesP50(agg), UKOT_EXACT_MONEY],
    ['beginner', 'ukot_gas_p50_bcf', SB.reservesP50(agg, 'Gas'), UKOT_EXACT_MONEY],
    ['beginner', 'ukot_base_npv_mm', base.metrics.npv, UKOT_MONEY],
    // EC6-8 RETIRED ukot_base_irr_pct. Charging the end-of-life cost makes the
    // Board case flow change sign twice, so the engine returns irr null with
    // irrStatus multiple-roots and BOTH roots in irrRoots. A numerically graded
    // field cannot grade a null. The HIGHER root sits 0.0097 from the retired
    // answer of 37.66903, inside the old tolerance of 0.01, so grading it would
    // pass a learner who ran the pre-repair case; the LOWER root can only be
    // reached by reading both, which is the judgement the repair exposes.
    ['beginner', 'ukot_base_irr_low_root_pct', base.metrics.irrRoots[0], UKOT_PERCENT],
    ['beginner', 'ukot_alternative_npv_mm', alt.metrics.npv, UKOT_MONEY],
    ['intermediate', 'ukot_network_duration_days', SH.calculateNetworkDuration(net), UKOT_DAYS],
    ['intermediate', 'ukot_calendar_span_days', SH.calculateProjectDuration(net), UKOT_DAYS],
    ['intermediate', 'ukot_uk01_well_cost_usd', wellCostOf(UKOT_WELLS[0]), UKOT_USD],
    ['intermediate', 'ukot_campaign_cost_usd', UKOT_WELLS.reduce((sum, w) => sum + wellCostOf(w), 0), UKOT_USD],
    ['intermediate', 'ukot_platform_capex_mm', FA.calculateFacilityCost(clone(UKOT_FACILITIES[0])).capex, UKOT_FACILITY_MONEY],
    ['intermediate', 'ukot_platform_decommissioning_mm', FA.calculateFacilityCost(clone(UKOT_FACILITIES[0])).decommissioning, UKOT_FACILITY_MONEY],
    ['advanced', 'meren_planned_value_usd', evm.pv, UKOT_USD],
    ['advanced', 'meren_earned_value_usd', evm.ev, UKOT_USD],
    ['advanced', 'meren_spi', evm.spi, MEREN_RATIO],
    ['advanced', 'meren_completion_ratio', evm.completionRatio, MEREN_RATIO],
    ['advanced', 'ukot_price_swing_mm', Math.abs(price.highParamNPV - price.lowParamNPV), UKOT_MONEY],
    ['advanced', 'ukot_stress_npv_mm', stress.metrics.npv, UKOT_MONEY],
  ];
};

/** The graded answers keyed by field. A field list already in hand can be passed in. */
export const ukotCapstoneValues = (fieldList) =>
  Object.fromEntries((fieldList ?? ukotCapstoneFields()).map(([, key, v]) => [key, v]));

/** The grading tolerance of each field, absolute, in the field's own units. */
export const ukotCapstoneTolerances = (fieldList) =>
  Object.fromEntries((fieldList ?? ukotCapstoneFields()).map(([, key, , tol]) => [key, tol]));

/**
 * Every export of this module that is built on the capstone. The panel guard
 * greps the panel sources for each name; the leak gate skips each one when it
 * walks the teaching surface.
 */
export const CAPSTONE_ONLY_EXPORTS = [
  'UKOT_RESERVOIRS', 'UKOT_CONCEPT', 'UKOT_ALTERNATIVE', 'UKOT_BASE', 'UKOT_STRESS', 'UKOT_COSTS',
  'UKOT_SCHEDULE', 'UKOT_WELLS', 'UKOT_RIG_RATE', 'UKOT_FACILITIES', 'UKOT_RISKS',
  'MEREN_TASKS', 'MEREN_AS_OF',
  'ukotRuns', 'ukotCapstoneFields', 'ukotCapstoneValues', 'ukotCapstoneTolerances',
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
      out.push({ tier, key, tag, value: v * factor, gradingBand, band: LEAK_GUARD_MARGIN * gradingBand });
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
