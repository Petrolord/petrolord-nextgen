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
export const CAPSTONE_EATON_N = 3.0;

const idxAt = (zM) => WELL.z_bml_m.findIndex((z) => z === zM);

/** Beginner: the pressure frame and the compaction trend. */
export function computeBasics() {
  const prof = computeProfile({
    zBmlM: WELL.z_bml_m, dtUsPerM: WELL.dt_us_per_m, rhoKgM3: WELL.rho_kg_m3, params: PARAMS,
  });
  const iTd = WELL.z_bml_m.length - 1;
  const fit = fitNct(NCT_PICKS.picks_z_m, NCT_PICKS.picks_dt_us_per_m, NCT_PICKS.dt_ma);
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
export function computePrognosis(eatonN = CAPSTONE_EATON_N) {
  const prof = computeProfile({
    zBmlM: WELL.z_bml_m, dtUsPerM: WELL.dt_us_per_m, rhoKgM3: WELL.rho_kg_m3,
    params: { ...PARAMS, eatonN },
  });
  // Overpressure onset: the first sample measurably above hydrostatic
  // (> 0.05 MPa clears float noise; the ramp adds 0.4 MPa per sample).
  let onsetM = null;
  for (let i = 0; i < WELL.z_bml_m.length; i++) {
    if (prof.porePressurePa[i] - prof.hydrostaticPa[i] > 0.05e6) { onsetM = WELL.z_bml_m[i]; break; }
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
export function emwKgM3(pPa, zBmlM) {
  return pPa / (G_ACCEL * (zBmlM + PARAMS.waterDepthM));
}

/** Advanced: the mud-weight window at TD + the Bowers cross-check. */
export function computeMudWindow() {
  const base = computePrognosis(CAPSTONE_EATON_N);
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
export function computeEatonExplorer(eatonN = CAPSTONE_EATON_N, trend = 'well', thresholdMPa = 0.05) {
  const nct = trend === 'fitted' ? fittedNctParams() : PARAMS.nct;
  const prof = computeProfile({
    zBmlM: WELL.z_bml_m, dtUsPerM: WELL.dt_us_per_m, rhoKgM3: WELL.rho_kg_m3,
    params: { ...PARAMS, eatonN, nct },
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
export function computeWindowExplorer(eatonN = CAPSTONE_EATON_N) {
  const prog = computePrognosis(eatonN);
  const n = WELL.z_bml_m.length;
  const iTd = n - 1;
  const curve = [];
  for (let i = 0; i < n; i += 2) {
    const z = WELL.z_bml_m[i];
    if (z === 0) continue; // at the mudline every EMW collapses to the seawater density; start the plot one sample down
    curve.push({
      z,
      ppEmw: emwKgM3(prog.prof.porePressurePa[i], z),
      fpEmw: emwKgM3(prog.prof.fracPressurePa[i], z),
      hydroEmw: emwKgM3(prog.prof.hydrostaticPa[i], z),
      obEmw: emwKgM3(prog.prof.overburdenPa[i], z),
    });
  }
  const ppEmwTd = emwKgM3(prog.prof.porePressurePa[iTd], TD_M);
  const fpEmwTd = emwKgM3(prog.prof.fracPressurePa[iTd], TD_M);
  return {
    eatonN, curve, ppEmwTd, fpEmwTd,
    windowTd: fpEmwTd - ppEmwTd,
    hydroEmwTd: emwKgM3(prog.prof.hydrostaticPa[iTd], TD_M),
    obEmwTd: emwKgM3(prog.prof.overburdenPa[iTd], TD_M),
    ppTdMpa: prog.ppTdPa / 1e6,
  };
}

export const BOWERS_UNLOAD_V_MS = 3125.808993287662;

/** DC27: the Bowers pair, the mechanism contrast and the cross-check
 *  against the Eaton prognosis at TD. */
export function computeBowersFacts() {
  const base = computePrognosis(CAPSTONE_EATON_N);
  const iTd = WELL.z_bml_m.length - 1;
  const vTd = 1e6 / WELL.dt_us_per_m[iTd];
  const eatonSigmaTdPa = base.prof.overburdenPa[iTd] - base.prof.porePressurePa[iTd];
  const bowersSigmaTdPa = bowersSigmaLoading(vTd, 10.0, 0.75);
  const bowersPpTdPa = base.prof.overburdenPa[iTd] - bowersSigmaTdPa;
  return {
    vLoad5MPa: bowersVLoading(5e6, 10.0, 0.75),
    sigmaUnloadPa: bowersSigmaUnloading(BOWERS_UNLOAD_V_MS, 50e6, 10.0, 0.75, 3.0),
    sigmaLoadSameVPa: bowersSigmaLoading(BOWERS_UNLOAD_V_MS, 10.0, 0.75),
    rejoinLoadVMs: bowersVLoading(50e6, 10.0, 0.75),
    rejoinUnloadVMs: bowersVUnloading(50e6, 50e6, 10.0, 0.75, 3.0),
    mudlineVMs: 5000.0 * 0.3048,
    vTdMs: vTd,
    eatonSigmaTdPa,
    bowersSigmaTdPa,
    bowersPpTdPa,
    eatonPpTdPa: base.prof.porePressurePa[iTd],
    agreementPa: base.prof.porePressurePa[iTd] - bowersPpTdPa,
  };
}
