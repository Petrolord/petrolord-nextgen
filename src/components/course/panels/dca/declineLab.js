// Decline-curve teaching lab for the RC1 course (app 'dca'). Pure math +
// fixture access; every exported value is pinned by declineLab.test.js to
// the RC1 truth digest, which was derived by running the central engines
// over the committed ekene-dynamic goldens. Panels and the learning page
// import THIS module; nothing here re-implements engine math beyond the
// closed forms the course teaches by hand.

import ratesFix from '@petrolord/engines/test-data/ekene-dynamic/rates.json';
import fieldFix from '@petrolord/engines/test-data/ekene-dynamic/field.json';
import { fitArpsModel, calculateEUR, getFitQuality } from '@petrolord/engines/engines/dca/arps.js';
import { normalizeByTimeAndRate, fitTypeCurve, applyTypeCurve } from '@petrolord/engines/engines/dca/typeCurve.js';

export const FIELD = fieldFix;
export const WELLS = ratesFix.wells;
export const FLOOD_START = ratesFix.flood_start;
export const ECON_LIMIT_BOPD = 10;

export const wellByName = (name) => WELLS.find((w) => w.name === name);

// ---------------------------------------------------------------------------
// Closed forms (the hand-reachable math the course teaches; t in days)
// ---------------------------------------------------------------------------

export function arpsRate(model, qi, Di, b, t) {
  if (t < 0) return 0;
  if (model === 'exponential') return qi * Math.exp(-Di * t);
  if (model === 'harmonic') return qi / (1 + Di * t);
  return qi / Math.pow(1 + b * Di * t, 1 / b);
}

export function arpsCum(model, qi, Di, b, t) {
  if (t <= 0) return 0;
  if (model === 'exponential') return (qi / Di) * (1 - Math.exp(-Di * t));
  if (model === 'harmonic') return (qi / Di) * Math.log(1 + Di * t);
  return (qi / (Di * (1 - b))) * (1 - Math.pow(1 + b * Di * t, 1 - 1 / b));
}

export function timeToLimit(model, qi, Di, b, qLimit) {
  if (qLimit >= qi) return 0;
  if (model === 'exponential') return Math.log(qi / qLimit) / Di;
  if (model === 'harmonic') return (qi / qLimit - 1) / Di;
  return (Math.pow(qi / qLimit, b) - 1) / (b * Di);
}

// Tangent effective annual decline from a per-day nominal Di.
export const tangentEffectiveAnnual = (diPerDay) => 1 - Math.exp(-diPerDay * 365);
// Secant effective annual decline (SPEE): 1 - q(1 yr)/qi for the model.
export const secantEffectiveAnnual = (model, qi, Di, b) => 1 - arpsRate(model, qi, Di, b, 365) / qi;

export const daysBetween = (isoA, isoB) => (Date.parse(isoB) - Date.parse(isoA)) / 86400000;

// ---------------------------------------------------------------------------
// Fitting through the real engine
// ---------------------------------------------------------------------------

// Named windows the course uses. 'primary' ends before the first flood-era
// row; 'postRamp' starts after every producer's response ramp has finished.
export const WINDOWS = {
  primary: { label: 'Primary (pre-flood)', endDate: '2022-12-15' },
  full: { label: 'Full history' },
  postRamp: { label: 'Post-ramp (2024-05 on)', startDate: '2024-05-01', endDate: '2025-12-15' },
};

export function fitWell(name, modelType = 'Auto-Select', windowKey = 'primary', custom = null) {
  const w = wellByName(name);
  const rows = w.monthly.map((r) => ({ date: r.date, rate: r.oil_bpd }));
  let window = null;
  if (windowKey === 'custom' && custom) {
    window = { startDate: custom.startDate, endDate: custom.endDate };
  } else if (windowKey !== 'full') {
    const preset = WINDOWS[windowKey];
    window = { startDate: preset.startDate || w.start_date, endDate: preset.endDate };
  }
  const fit = fitArpsModel(rows, modelType, window);
  return { well: w, fit, window };
}

// Everything the Associate booking derives from a fit.
export function bookFromFit(params, qLimit = ECON_LIMIT_BOPD, t0 = null, npAtDate = FLOOD_START) {
  const model = (params.modelType || '').toLowerCase();
  const eur = calculateEUR(params.qi, params.Di, params.b, qLimit, model);
  const tLim = timeToLimit(model, params.qi, params.Di, params.b, qLimit);
  const np = t0 ? arpsCum(model, params.qi, params.Di, params.b, daysBetween(t0, npAtDate)) : null;
  return {
    eur,
    timeToLimitDays: tLim,
    npAtDate: np,
    effectiveDeclinePct: tangentEffectiveAnnual(params.Di) * 100,
    quality: getFitQuality,
  };
}

export { calculateEUR, getFitQuality };

// ---------------------------------------------------------------------------
// Type curves (Professional): pool -> normalize -> fit -> fixed-b apply
// ---------------------------------------------------------------------------

export function typeCurvePipeline(poolNames = ['Ekene-3', 'Ekene-6'], targetName = 'Ekene-6') {
  const primaryRows = (n) =>
    wellByName(n).monthly.filter((r) => r.date < FLOOD_START).map((r) => ({ date: r.date, rate: r.oil_bpd }));
  const pooled = poolNames.flatMap((n) => normalizeByTimeAndRate(primaryRows(n)));
  const tc = fitTypeCurve(pooled, 'Hyperbolic');
  if (!tc) return { tc: null };
  const applied = applyTypeCurve(tc, primaryRows(targetName));
  const eurFixedB = applied ? calculateEUR(applied.qi, applied.Di, applied.b, ECON_LIMIT_BOPD, 'hyperbolic') : null;
  const eurTrue = wellByName(targetName).closed_form.eur_at_econ_limit_stb;
  return {
    tc,
    applied,
    eurFixedB,
    eurTrue,
    pctOff: eurFixedB != null ? (eurFixedB / eurTrue - 1) * 100 : null,
  };
}

// ---------------------------------------------------------------------------
// b-leverage and the triangular closed forms (Expert)
// ---------------------------------------------------------------------------

export const B_LEVERAGE_BASE = { qi: 120, Di: 0.0012, qLimit: ECON_LIMIT_BOPD };

export function bLeverageRow(b) {
  const { qi, Di, qLimit } = B_LEVERAGE_BASE;
  const model = b === 0 ? 'exponential' : Math.abs(b - 1) < 1e-9 ? 'harmonic' : 'hyperbolic';
  const eur = calculateEUR(qi, Di, b, qLimit, model);
  return { b, eur, ratioToExponential: eur / calculateEUR(qi, Di, 0, qLimit, 'exponential') };
}

// The field EUR triangle the Expert capstone uses (mode = the closed-form
// sum of the four wells' EURs at the 10 stb/d limit).
export const FIELD_TRIANGLE = {
  min: 380000,
  mode: WELLS.reduce((s, w) => s + w.closed_form.eur_at_econ_limit_stb, 0),
  max: 580000,
};

export function triangularQuantile(u, { min: a, mode: m, max: b }) {
  const Fc = (m - a) / (b - a);
  return u <= Fc
    ? a + Math.sqrt(u * (b - a) * (m - a))
    : b - Math.sqrt((1 - u) * (b - a) * (b - m));
}

export function triangularSummary(tri = FIELD_TRIANGLE) {
  const { min: a, mode: m, max: b } = tri;
  return {
    p90: triangularQuantile(0.1, tri), // petroleum convention: P90 = low
    p50: triangularQuantile(0.5, tri),
    p10: triangularQuantile(0.9, tri),
    mean: (a + m + b) / 3,
    fAtMode: (m - a) / (b - a),
  };
}

// ---------------------------------------------------------------------------
// Snapshot-versus-integral honesty (Professional m03 / Expert capstone)
// ---------------------------------------------------------------------------

export function monthlySnapshotNp(name = 'Ekene-1') {
  const w = wellByName(name);
  const prim = w.monthly.filter((r) => r.date < FLOOD_START);
  let np = 0;
  for (let i = 0; i < prim.length; i++) {
    const next = i + 1 < prim.length ? prim[i + 1].date : FLOOD_START;
    np += prim[i].oil_bpd * daysBetween(prim[i].date, next);
  }
  const exact = w.closed_form.np_at_flood_start_stb;
  return { snapshot: np, exact, overstatementPct: (np / exact - 1) * 100 };
}
