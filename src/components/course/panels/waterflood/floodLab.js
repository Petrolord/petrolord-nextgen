// Waterflood teaching lab for the RC4 course (app 'waterflood'). Pure math plus
// fixture access; every exported value is pinned by floodLab.test.js to the RC4
// truth digest, which was derived by running the vendored engines over the
// committed fixtures. Panels and the learning page import THIS module.
//
// Scope rule: displacement physics (Corey, fw, the Welge tangent, ED) belongs to
// the RC3 SCAL course. This module imports analyzeDisplacement through the
// waterflood pattern engine and never re-derives it.

import ekeneFlood from '@petrolord/engines/test-data/ekene-dynamic/waterflood.json';
import ekeneField from '@petrolord/engines/test-data/ekene-dynamic/field.json';
import ekeneScal from '@petrolord/engines/test-data/ekene-dynamic/scal.json';
import ekeneMbal from '@petrolord/engines/test-data/ekene-dynamic/mbal.json';
import {
  computePeriodVoidage, computeVRRSeries, classifyVRR, summarizeVRR,
} from '@petrolord/engines/engines/waterflood/vrr.js';
import {
  buildFieldPeriods, classifyLedgerWells, computeRollingVRR, flagPeriods,
  analyzeLedger, attachPressure, findFillUp, interpolateFvfTrack,
  validateAllocation, allocateInjection, patternHasAllocation,
  buildPatternPeriods, recommendPatternInjection,
} from '@petrolord/engines/engines/waterflood/vrrLedger.js';
import {
  analyzeWaterflood, classifyChan,
} from '@petrolord/engines/engines/waterflood/waterflood.js';
import {
  analyzeLayeredSweep, analyzeDykstraParsons, analyzeStiles, dykstraParsonsV,
  dpFrontPosition, normalizeLayers, inverseNormal, sampleLayeredData,
} from '@petrolord/engines/engines/waterflood/layeredSweep.js';
import {
  forecastPattern, arealSweepAtBreakthrough, arealSweepAfterBreakthrough,
  displacementStateAtQi,
} from '@petrolord/engines/engines/waterflood/patternForecast.js';

export const EKENE_FLOOD = ekeneFlood;
export const FIELD = ekeneField;
export const EKENE_SCAL = ekeneScal;
export const EKENE_MBAL = ekeneMbal;

export {
  computePeriodVoidage, computeVRRSeries, classifyVRR, summarizeVRR,
  buildFieldPeriods, classifyLedgerWells, computeRollingVRR, flagPeriods,
  analyzeLedger, attachPressure, findFillUp, interpolateFvfTrack,
  validateAllocation, allocateInjection, patternHasAllocation,
  buildPatternPeriods, recommendPatternInjection,
  analyzeWaterflood, classifyChan,
  analyzeLayeredSweep, analyzeDykstraParsons, analyzeStiles, dykstraParsonsV,
  dpFrontPosition, normalizeLayers, inverseNormal, sampleLayeredData,
  forecastPattern, arealSweepAtBreakthrough, arealSweepAfterBreakthrough,
  displacementStateAtQi,
};

/** The frozen ledger FVF set (Bo at the flood-era 2100 psia). */
export const LEDGER_FVF = EKENE_FLOOD.fvf;

/** The operator target band the course uses throughout. */
export const TARGET_BAND = { min: 1.0, max: 1.2 };

/** The reference pressure the injection-pressure model sits on. The Hall
 *  lessons subtract it; that number is parsed from the fixture's own design
 *  note so the lab cannot drift from the data. */
export const HALL_REFERENCE_PSIA = Number(
  /(\d+) \+ inj_daily/.exec(EKENE_FLOOD.design.injectivity_story)[1],
);

/** The daily-surveillance engine reads LOWERCASE keys. Handing it the
 *  capitalised ledger fvf object silently defaults Bo to 1. Both shapes are
 *  exported so the lesson can run the mistake as well as the fix. */
export const SURVEILLANCE_CONFIG = {
  bo: LEDGER_FVF.Bo, bw: LEDGER_FVF.Bw, bg: LEDGER_FVF.Bg, rs: LEDGER_FVF.Rs,
};
export const SURVEILLANCE_CONFIG_WRONG_CASE = LEDGER_FVF;

// ---------------------------------------------------------------------------
// 1. The field ledger (Associate)
// ---------------------------------------------------------------------------

/** Field periods rebuilt from the per-well rows, then the voidage series.
 *  This is the path a real importer takes, not a shortcut through the
 *  committed period table. */
export function fieldLedger() {
  const periods = buildFieldPeriods(EKENE_FLOOD.ledger_rows);
  const series = computeVRRSeries(periods, LEDGER_FVF);
  return { periods, series, summary: summarizeVRR(series), wells: classifyLedgerWells(EKENE_FLOOD.ledger_rows) };
}

/** The ledger read at a chosen rolling window and operator band (the panel's
 *  sliders). Window 1 reproduces the instantaneous series exactly. */
export function ledgerWith({ window = 3, band = TARGET_BAND } = {}) {
  const { periods, series, summary } = fieldLedger();
  const rolling = computeRollingVRR(series, window);
  const flags = flagPeriods(series, band);
  return {
    periods, series, summary, rolling, flags,
    fillUp: findFillUp(series),
    monthsUnder: flags.filter((f) => f === 'under').length,
    monthsOver: flags.filter((f) => f === 'over').length,
    monthsInBand: flags.filter((f) => f === 'in-band').length,
  };
}

/** One period worked end to end, the way the voidage lesson does it. */
export function periodVoidage(label) {
  const period = EKENE_FLOOD.ledger_periods.find((p) => p.label === label);
  if (!period) return null;
  const v = computePeriodVoidage(period, LEDGER_FVF);
  return {
    period,
    ...v,
    solutionGasMscf: (LEDGER_FVF.Rs * period.Np) / 1000,
    classification: classifyVRR(v.instantaneousVRR),
  };
}

/** The same period read under a PVT convention that treats all gas as free.
 *  Same data, a different answer, and the lesson is that the convention has
 *  to be stated. */
export function periodVoidageAsFreeGas(label, { Bg = 0.9 } = {}) {
  const period = EKENE_FLOOD.ledger_periods.find((p) => p.label === label);
  if (!period) return null;
  return computePeriodVoidage(period, { ...LEDGER_FVF, Bg, Rs: 0 });
}

// ---------------------------------------------------------------------------
// 2. Pressure (Associate)
// ---------------------------------------------------------------------------

/** Break-even VRR: while produced water is zero the net withdrawal changes
 *  sign at Boi/Bo(ledger), not at 1.0, because the ledger freezes Bo at the
 *  flood-era pressure while the tank is referenced to Boi. */
export const BREAK_EVEN_VRR = FIELD.static.boi_rb_stb / EKENE_FLOOD.fvf.Bo;

/** The true closed-form track, the six-monthly surveys, and what a reader who
 *  only has the surveys would interpolate. */
export function pressureView() {
  const track = EKENE_FLOOD.pressure.track;
  const attached = attachPressure(EKENE_FLOOD.ledger_periods, EKENE_FLOOD.pressure.surveys);
  const troughIdx = track.reduce((b, r, i) => (r.p_end_psia < track[b].p_end_psia ? i : b), 0);
  const seenIdx = attached.reduce((b, r, i) => (r.pressure < attached[b].pressure ? i : b), 0);
  return {
    track,
    surveys: EKENE_FLOOD.pressure.surveys,
    attached,
    trough: track[troughIdx],
    interpolatedTrough: attached[seenIdx],
    troughMissedByPsi: attached[seenIdx].pressure - track[troughIdx].p_end_psia,
    breakEvenVrr: BREAK_EVEN_VRR,
    recoveryPsi: track[track.length - 1].p_end_psia - track[troughIdx].p_end_psia,
  };
}

/** The ledger recomputed on a pressure-tracked Bo instead of the frozen one.
 *  The table is linear in pressure, so the interpolation is exact and the
 *  whole difference is the convention, not the arithmetic. */
export function trackedFvfLedger() {
  const attached = attachPressure(EKENE_FLOOD.ledger_periods, EKENE_FLOOD.pressure.surveys);
  const fvfTrack = interpolateFvfTrack(EKENE_FLOOD.pressure.pvt_table, attached.map((r) => r.pressure));
  const periods = EKENE_FLOOD.ledger_periods.map((p, i) => ({ ...p, Bo: fvfTrack[i].Bo }));
  const series = computeVRRSeries(periods, LEDGER_FVF);
  const frozen = fieldLedger().summary.cumulativeVRR;
  const tracked = series[series.length - 1].cumulativeVRR;
  return { fvfTrack, series, tracked, frozen, differencePct: (tracked / frozen - 1) * 100 };
}

// ---------------------------------------------------------------------------
// 3. Allocation and patterns (Professional)
// ---------------------------------------------------------------------------

export const ALLOCATION = EKENE_FLOOD.allocation;
export const PATTERNS = EKENE_FLOOD.patterns;

/** The conservation audit behind the matrix editor. The residual is exactly
 *  zero, not nearly zero, and that is worth checking rather than assuming. */
export function allocationAudit() {
  const validation = validateAllocation(ALLOCATION);
  const allocated = allocateInjection(EKENE_FLOOD.ledger_rows, ALLOCATION);
  const totalInjected = EKENE_FLOOD.ledger_rows.reduce((s, r) => s + r.winj_stb, 0);
  const allocatedTotal = Object.values(allocated.perProducer).reduce((s, v) => s + v.winj_stb, 0);
  return {
    validation,
    perProducer: allocated.perProducer,
    unallocated: allocated.unallocated,
    totalInjected,
    allocatedTotal,
    residual: totalInjected - (allocatedTotal + allocated.unallocated.winj_stb),
    outOfZoneFraction: allocated.unallocated.winj_stb / totalInjected,
  };
}

const patternByName = (name) => PATTERNS.find((p) => p.name === name || p.name.startsWith(name));

/** One pattern's own ledger. Production is summed over its producers;
 *  injection is the allocation-weighted share of every injector. */
export function patternLedger(name, { window = 3 } = {}) {
  const pattern = patternByName(name);
  if (!pattern) return null;
  const periods = buildPatternPeriods(EKENE_FLOOD.ledger_rows, pattern, ALLOCATION);
  const series = computeVRRSeries(periods, LEDGER_FVF);
  const last = series[series.length - 1];
  return {
    pattern,
    periods,
    series,
    rolling: computeRollingVRR(series, window),
    cumulativeVRR: last.cumulativeVRR,
    latestInstantaneousVRR: last.instantaneousVRR,
    producedVoidage: last.cumProd,
    injectedVoidage: last.cumInj,
    fillUp: findFillUp(series),
    hasAllocation: patternHasAllocation(pattern, ALLOCATION),
  };
}

/** Injection advice for one pattern. Withheld, never faked, when nothing
 *  routes to it. */
export function patternAdvice(name, { targetVRR = 1.0, windowPeriods = 3 } = {}) {
  const pattern = patternByName(name) || { name, producers: [] };
  return recommendPatternInjection(EKENE_FLOOD.ledger_rows, pattern, ALLOCATION, LEDGER_FVF, { targetVRR, windowPeriods });
}

/** The invariant: one pattern holding every producer, with every injector row
 *  summing to 1, reproduces the field series exactly. */
export function wholeFieldPattern() {
  const producers = classifyLedgerWells(EKENE_FLOOD.ledger_rows).producers;
  const even = 1 / producers.length;
  const allocation = {};
  classifyLedgerWells(EKENE_FLOOD.ledger_rows).injectors.forEach((inj) => {
    allocation[inj] = Object.fromEntries(producers.map((p) => [p, even]));
  });
  const periods = buildPatternPeriods(EKENE_FLOOD.ledger_rows, { name: 'All', producers }, allocation);
  const series = computeVRRSeries(periods, LEDGER_FVF);
  return series[series.length - 1].cumulativeVRR;
}

// ---------------------------------------------------------------------------
// 4. Daily surveillance (Professional)
// ---------------------------------------------------------------------------

/** The daily engine on the surveillance rows. Pass wrongCase to reproduce the
 *  silent Bo = 1 default the capitalised config triggers. */
export function surveillance({ wrongCase = false } = {}) {
  return analyzeWaterflood(
    EKENE_FLOOD.surveillance_rows,
    wrongCase ? SURVEILLANCE_CONFIG_WRONG_CASE : SURVEILLANCE_CONFIG,
  );
}

/** Hall plots on the measured absolute wellhead pressure, or on pressure
 *  ABOVE the reference. Only the second recovers 1/II. */
export function hallPlots({ aboveReference = false } = {}) {
  const rows = aboveReference
    ? EKENE_FLOOD.surveillance_rows.map((r) => ({
      ...r,
      whp_psi: r.whp_psi == null ? null : r.whp_psi - HALL_REFERENCE_PSIA,
    }))
    : EKENE_FLOOD.surveillance_rows;
  const a = analyzeWaterflood(rows, SURVEILLANCE_CONFIG);
  return {
    plots: a.hall_plots,
    alerts: a.alerts.injectivity_issue,
    capability: a.capabilities.hall,
  };
}

export function chanDiagnostics() {
  return surveillance().chan;
}

export function lagTable() {
  return surveillance().pattern_lags;
}

/** The three cumulative VRR numbers the same flood produces. */
export function vrrComparison() {
  const ledger = fieldLedger().summary.cumulativeVRR;
  const daily = surveillance().kpis.vrr_avg;
  const wrong = surveillance({ wrongCase: true }).kpis.vrr_avg;
  return {
    ledgerVolumes: ledger,
    dailyRowsAsDays: daily,
    wrongCase: wrong,
    dailyVsLedgerPct: (daily / ledger - 1) * 100,
    wrongCaseRatio: wrong / daily,
  };
}

// ---------------------------------------------------------------------------
// 5. Layered sweep (Expert)
// ---------------------------------------------------------------------------

export const LAYERS = EKENE_FLOOD.layers;
export const LAYER_DESIGN = EKENE_FLOOD.layer_design;

const engineLayers = () => LAYERS.map((l) => ({ h: l.h_ft, k: l.k_md }));

/** Both layered methods at a chosen mobility ratio. A defaults to the surface
 *  form of the same M, which is what the Stiles capacity ratio IS. */
export function layerSweep({ M = LAYER_DESIGN.mobility_ratio, A } = {}) {
  const capacityRatio = A ?? (M * LEDGER_FVF.Bo) / LEDGER_FVF.Bw;
  const r = analyzeLayeredSweep({ layers: engineLayers(), M, A: capacityRatio });
  return { ...r, M, A: capacityRatio, netPayFt: LAYER_DESIGN.net_pay_ft };
}

/** The permeability variation on its own, so the fit can be shown recovering
 *  the plant. */
export function permeabilityVariation(perms) {
  return dykstraParsonsV(perms ?? LAYERS.map((l) => l.k_md));
}

/** The vertical sweep the forecast borrows: coverage at the first layer
 *  breakthrough. */
export function evAtFirstBreakthrough(M = LAYER_DESIGN.mobility_ratio) {
  return layerSweep({ M }).dykstraParsons[0].coverage;
}

// ---------------------------------------------------------------------------
// 6. Pattern forecast (Expert)
// ---------------------------------------------------------------------------

export const ELEMENT = EKENE_FLOOD.pattern_element;

const displacementSpec = () => ({
  krSpec: EKENE_SCAL.design.krSpec,
  muW: EKENE_SCAL.design.muW_cp,
  muO: EKENE_SCAL.design.muO_cp,
});

/** The five-spot forecast. Defaults are the design case; every input is a
 *  slider on the Expert panel. */
export function forecast({
  iw = ELEMENT.iw_design_rb_d,
  EV = EKENE_FLOOD.expected.layered_sweep.ev_first_breakthrough,
  Sgi = 0,
  worLimit = 25,
  maxYears = 30,
  muO = EKENE_SCAL.design.muO_cp,
} = {}) {
  return forecastPattern({
    displacementSpec: { ...displacementSpec(), muO },
    pattern: {
      area_acres: ELEMENT.area_acres,
      h_ft: ELEMENT.net_thickness_ft,
      phi: ELEMENT.phi,
      Bo: ELEMENT.Bo,
      Bw: ELEMENT.Bw,
      iw_bpd: iw,
      Sgi,
      EV,
      worLimit,
      maxYears,
    },
  });
}

/** The three named cases the course grades and discusses. */
export function namedForecast(name) {
  const inputs = EKENE_FLOOD.expected.pattern_forecast[name]?.inputs;
  if (!inputs) return null;
  return forecastPattern({ displacementSpec: displacementSpec(), pattern: inputs });
}

/** The pore volume the observed Ekene-6 breakthrough implies, against the
 *  element the forecast assumes. This is what channeling means as a number. */
export function channelBackout() {
  const c = EKENE_FLOOD.expected.channeling;
  const impliedPv = (c.allocated_injection_bbl * LEDGER_FVF.Bw) / (c.QiBt * c.EAbt);
  return {
    ...c,
    impliedSweptPvRb: impliedPv,
    elementPvRb: ELEMENT.pv_exact_rb,
    fractionOfElement: impliedPv / ELEMENT.pv_exact_rb,
  };
}

/** Field-unit pore volume against the exact metric one. The 7758 constant is
 *  not exact and the gap is teachable, not a defect. */
export function poreVolumeUnits() {
  const fieldUnits = 7758 * ELEMENT.area_acres * ELEMENT.net_thickness_ft * ELEMENT.phi;
  return {
    fieldUnits,
    exact: ELEMENT.pv_exact_rb,
    relDiff: (fieldUnits - ELEMENT.pv_exact_rb) / ELEMENT.pv_exact_rb,
  };
}
