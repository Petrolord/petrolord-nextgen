// Pore Pressure teaching workflow — the golden synthetic well through
// the central porepressure engines. The well IS the committed golden
// fixture (packages/engines/test-data/porepressure/goldens.json):
// 401 samples 0-4000 m below mudline in 100 m of water, built
// forward-inverse consistent — a normal-compaction sonic down to
// 2500 m, then a 4 kPa/m overpressure ramp encoded INTO the transit
// times, so an Eaton run over the log must recover the imposed
// pressures exactly. Beginner builds the frame (hydrostatic column,
// overburden integration, Gardner density, the NCT and its exact
// least-squares fit); Intermediate runs the full Eaton prognosis and
// reads the overpressure onset; Advanced converts the prognosis into
// the driller's mud-weight window at TD, cross-checks with Bowers
// (loading and unloading), and probes the Eaton-exponent lever. The
// capstone oracle was reproduced by running exactly these pipelines
// in Node before the migration was seeded.
//
// The golden well with its header parameters is the TEACHING case: the
// panels open on it and the lessons work it. Since W5b (2026-09) each
// tier's capstone runs the same logs under a setting of its own (water
// depth, pore-fluid density, Eaton exponent, Poisson's ratio, onset
// threshold, fit matrix, Bowers coefficients), stated in the brief and
// typed into the panels. Every function below takes that setting as an
// optional last argument and defaults to the teaching case; nothing in
// this file carries a capstone setting, and panelCapstoneGuard.test.js
// checks that no panel default lands on a graded answer.
import goldens from '@petrolord/engines/test-data/porepressure/goldens.json';
import { computeProfile } from '@petrolord/engines/engines/porepressure/profile.js';
import { nctDt, fitNct } from '@petrolord/engines/engines/porepressure/nct.js';
import { gardnerRho } from '@petrolord/engines/engines/porepressure/gardner.js';
import { bowersVLoading, bowersSigmaUnloading } from '@petrolord/engines/engines/porepressure/bowers.js';
import { G_ACCEL } from '@petrolord/engines/engines/porepressure/constants.js';

export const WELL = goldens.well;           // z/dt/rho arrays + params
export const NCT_PICKS = goldens.nct_fit;   // 12 shale picks + dt_ma

// The golden well's parameters, in the engine's computeProfile shape.
const P = WELL.params;
export const PARAMS = {
  waterDepthM: P.water_depth_m,
  rhoSeawaterKgM3: P.rho_seawater,
  rhoFluidKgM3: P.rho_fluid,
  nct: { dtMlUsPerM: P.dt_ml_us_per_m, dtMaUsPerM: P.dt_ma_us_per_m, cPerM: P.c_nct_per_m },
  method: 'eaton',
  eatonN: P.eaton_n,
  nu: P.nu,
};
export const RAMP_TOP_M = P.ramp_top_m;     // 2500 m: where overpressure starts
export const TD_M = WELL.z_bml_m[WELL.z_bml_m.length - 1]; // 4000 m
export const EATON_N_OPTIONS = [3.0, 1.2];
export const TEACHING_EATON_N = 3.0;

/** The golden well's parameters with a typed setting laid over them:
 *  { waterDepthM, rhoFluidKgM3, rhoSeawaterKgM3, nu } (any subset). */
export function caseParams(c = {}) {
  return {
    ...PARAMS,
    waterDepthM: c.waterDepthM ?? PARAMS.waterDepthM,
    rhoFluidKgM3: c.rhoFluidKgM3 ?? PARAMS.rhoFluidKgM3,
    rhoSeawaterKgM3: c.rhoSeawaterKgM3 ?? PARAMS.rhoSeawaterKgM3,
    nu: c.nu ?? PARAMS.nu,
  };
}

const idxAt = (zM) => WELL.z_bml_m.findIndex((z) => z === zM);

/** Beginner: the pressure frame and the compaction trend. */
export function computeBasics(c = {}) {
  const prof = computeProfile({
    zBmlM: WELL.z_bml_m, dtUsPerM: WELL.dt_us_per_m, rhoKgM3: WELL.rho_kg_m3, params: caseParams(c),
  });
  const iTd = WELL.z_bml_m.length - 1;
  const fit = fitNct(NCT_PICKS.picks_z_m, NCT_PICKS.picks_dt_us_per_m, c.fitDtMa ?? NCT_PICKS.dt_ma);
  return {
    hydroTdPa: prof.hydrostaticPa[iTd],
    obTdPa: prof.overburdenPa[iTd],
    gardnerRho1600: gardnerRho(1600),
    nct2500: nctDt(2500, P.dt_ml_us_per_m, P.dt_ma_us_per_m, P.c_nct_per_m),
    fit,                     // { dtMl, c } from the 12 shale picks
    prof,
  };
}

/** Intermediate: the full Eaton prognosis over the golden sonic. */
export function computePrognosis(eatonN = TEACHING_EATON_N, c = {}) {
  const prof = computeProfile({
    zBmlM: WELL.z_bml_m, dtUsPerM: WELL.dt_us_per_m, rhoKgM3: WELL.rho_kg_m3,
    params: { ...caseParams(c), eatonN },
  });
  // Overpressure onset: the first sample measurably above hydrostatic
  // (> 0.05 MPa clears float noise; the ramp adds 0.4 MPa per sample).
  const thrPa = (c.thresholdMPa ?? 0.05) * 1e6;
  let onsetM = null;
  for (let i = 0; i < WELL.z_bml_m.length; i++) {
    if (prof.porePressurePa[i] - prof.hydrostaticPa[i] > thrPa) { onsetM = WELL.z_bml_m[i]; break; }
  }
  const i3000 = idxAt(3000);
  const iTd = WELL.z_bml_m.length - 1;
  return {
    prof,
    onsetM,
    pp3000Pa: prof.porePressurePa[i3000],
    ppTdPa: prof.porePressurePa[iTd],
    overpressureTdPa: prof.porePressurePa[iTd] - prof.hydrostaticPa[iTd],
    fpTdPa: prof.fracPressurePa[iTd],
    dtnTd: prof.dtNormalUsPerM[iTd],
    eatonN,
  };
}

/** Equivalent mud weight [kg/m3] of pressure P at z below mudline,
 *  referenced to sea level (the seawater + sediment column height). */
export function emwKgM3(pPa, zBmlM, waterDepthM = PARAMS.waterDepthM) {
  return pPa / (G_ACCEL * (zBmlM + waterDepthM));
}

/** Advanced: the mud-weight window at TD + the Bowers cross-check. */
export function computeMudWindow() {
  const base = computePrognosis(TEACHING_EATON_N);
  const alt = computePrognosis(1.2);
  const ppEmwTd = emwKgM3(base.ppTdPa, TD_M);
  const fpEmwTd = emwKgM3(base.fpTdPa, TD_M);
  // Golden Bowers fixture points (loading: A 10, B 0.75; unloading adds
  // sigma_max 50 MPa, U 3): the same coefficients both ways round.
  const bowersV5MPa = bowersVLoading(5e6, 10.0, 0.75);
  const bowersSigmaUnload = bowersSigmaUnloading(3125.808993287662, 50e6, 10.0, 0.75, 3.0);
  return {
    base,
    alt,
    ppEmwTd,
    fpEmwTd,
    windowTd: fpEmwTd - ppEmwTd,
    ppTdN12Pa: alt.ppTdPa,
    bowersV5MPa,
    bowersSigmaUnload,
  };
}

// ---------------------------------------------------------------------------
// DC26/DC27 panel support. Everything below is additive: the capstone
// drivers above are the graded oracles and stay untouched.
import { bowersSigmaLoading, bowersVUnloading } from '@petrolord/engines/engines/porepressure/bowers.js';

/** The exact least-squares trend through the 12 shale picks (the
 *  beginner tier's fit), as computeProfile nct params. */
export function fittedNctParams() {
  const fit = fitNct(NCT_PICKS.picks_z_m, NCT_PICKS.picks_dt_us_per_m, NCT_PICKS.dt_ma);
  return { dtMlUsPerM: fit.dtMl, dtMaUsPerM: NCT_PICKS.dt_ma, cPerM: fit.c };
}

export const EXPLORER_N_OPTIONS_PRO = [1.0, 2.0, 3.0, 4.0, 5.0];
export const EXPLORER_THRESHOLDS_MPA = [0.01, 0.05, 0.2];
export const RAMP_KPA_PER_M = WELL.params.ramp_kpa_per_m; // 4

/** DC26: the full Eaton prognosis with the tier's three levers exposed:
 *  the exponent, the trend the ratio is measured against, and the onset
 *  detection threshold. QC tile: the worst disagreement between the
 *  recovered overpressure and the ramp the well encodes (meaningful on
 *  the well trend at n = 3, where the loop closes). */
export function computeEatonExplorer(eatonN = TEACHING_EATON_N, trend = 'well', thresholdMPa = 0.05, c = {}) {
  const nct = trend === 'fitted' ? fittedNctParams() : PARAMS.nct;
  const prof = computeProfile({
    zBmlM: WELL.z_bml_m, dtUsPerM: WELL.dt_us_per_m, rhoKgM3: WELL.rho_kg_m3,
    params: { ...caseParams(c), eatonN, nct },
  });
  const n = WELL.z_bml_m.length;
  const iTd = n - 1;
  let onsetM = null;
  let maxRampErrPa = 0;
  for (let i = 0; i < n; i++) {
    const opPa = prof.porePressurePa[i] - prof.hydrostaticPa[i];
    if (onsetM === null && opPa > thresholdMPa * 1e6) onsetM = WELL.z_bml_m[i];
    const rampPa = Math.max(0, WELL.z_bml_m[i] - RAMP_TOP_M) * RAMP_KPA_PER_M * 1e3;
    const err = Math.abs(opPa - rampPa);
    if (err > maxRampErrPa) maxRampErrPa = err;
  }
  const curve = [];
  for (let i = 0; i < n; i += 4) {
    curve.push({
      z: WELL.z_bml_m[i],
      ppMpa: prof.porePressurePa[i] / 1e6,
      fpMpa: prof.fracPressurePa[i] / 1e6,
      hydroMpa: prof.hydrostaticPa[i] / 1e6,
      obMpa: prof.overburdenPa[i] / 1e6,
    });
  }
  const i3000 = WELL.z_bml_m.findIndex((z) => z === 3000);
  return {
    eatonN, trend, thresholdMPa, curve, onsetM, maxRampErrPa,
    dtnTd: prof.dtNormalUsPerM[iTd],
    ratioTd: prof.dtNormalUsPerM[iTd] / WELL.dt_us_per_m[iTd],
    pp3000Mpa: prof.porePressurePa[i3000] / 1e6,
    ppTdMpa: prof.porePressurePa[iTd] / 1e6,
    opTdMpa: (prof.porePressurePa[iTd] - prof.hydrostaticPa[iTd]) / 1e6,
    fpTdMpa: prof.fracPressurePa[iTd] / 1e6,
    budgetTdMpa: (prof.overburdenPa[iTd] - prof.hydrostaticPa[iTd]) / 1e6,
  };
}

/** DC27: the window in equivalent mud weight down the well. */
export function computeWindowExplorer(eatonN = TEACHING_EATON_N, c = {}) {
  const prog = computePrognosis(eatonN, c);
  const wd = caseParams(c).waterDepthM;
  const emw = (p, z) => emwKgM3(p, z, wd); // referenced to this setting's sea level
  const n = WELL.z_bml_m.length;
  const iTd = n - 1;
  const curve = [];
  for (let i = 0; i < n; i += 2) {
    const z = WELL.z_bml_m[i];
    if (z === 0) continue; // at the mudline every EMW collapses to the seawater density; start the plot one sample down
    curve.push({
      z,
      ppEmw: emw(prog.prof.porePressurePa[i], z),
      fpEmw: emw(prog.prof.fracPressurePa[i], z),
      hydroEmw: emw(prog.prof.hydrostaticPa[i], z),
      obEmw: emw(prog.prof.overburdenPa[i], z),
    });
  }
  const ppEmwTd = emw(prog.prof.porePressurePa[iTd], TD_M);
  const fpEmwTd = emw(prog.prof.fracPressurePa[iTd], TD_M);
  return {
    eatonN, curve, ppEmwTd, fpEmwTd,
    windowTd: fpEmwTd - ppEmwTd,
    hydroEmwTd: emw(prog.prof.hydrostaticPa[iTd], TD_M),
    obEmwTd: emw(prog.prof.overburdenPa[iTd], TD_M),
    ppTdMpa: prog.ppTdPa / 1e6,
  };
}

export const BOWERS_UNLOAD_V_MS = 3125.808993287662;

/** DC27: the Bowers pair, the mechanism contrast and the cross-check
 *  against the Eaton prognosis at TD. The coefficients, the loading stress
 *  and the unloading velocity open on the golden fixture; a typed setting
 *  { A, B, stressMPa, vUnloadMs, sigmaMaxMPa, U } replaces any of them. */
export const BOWERS_TEACHING = { A: 10.0, B: 0.75, stressMPa: 5, vUnloadMs: BOWERS_UNLOAD_V_MS, sigmaMaxMPa: 50, U: 3.0 };

export function computeBowersFacts(bw = {}) {
  const b = { ...BOWERS_TEACHING, ...bw };
  const base = computePrognosis(TEACHING_EATON_N);
  const iTd = WELL.z_bml_m.length - 1;
  const vTd = 1e6 / WELL.dt_us_per_m[iTd];
  const eatonSigmaTdPa = base.prof.overburdenPa[iTd] - base.prof.porePressurePa[iTd];
  const bowersSigmaTdPa = bowersSigmaLoading(vTd, b.A, b.B);
  const bowersPpTdPa = base.prof.overburdenPa[iTd] - bowersSigmaTdPa;
  return {
    bowers: b,
    vLoad5MPa: bowersVLoading(b.stressMPa * 1e6, b.A, b.B),
    sigmaUnloadPa: bowersSigmaUnloading(b.vUnloadMs, b.sigmaMaxMPa * 1e6, b.A, b.B, b.U),
    sigmaLoadSameVPa: bowersSigmaLoading(b.vUnloadMs, b.A, b.B),
    rejoinLoadVMs: bowersVLoading(b.sigmaMaxMPa * 1e6, b.A, b.B),
    rejoinUnloadVMs: bowersVUnloading(b.sigmaMaxMPa * 1e6, b.sigmaMaxMPa * 1e6, b.A, b.B, b.U),
    mudlineVMs: 5000.0 * 0.3048,
    vTdMs: vTd,
    eatonSigmaTdPa,
    bowersSigmaTdPa,
    bowersPpTdPa,
    eatonPpTdPa: base.prof.porePressurePa[iTd],
    agreementPa: base.prof.porePressurePa[iTd] - bowersPpTdPa,
  };
}
