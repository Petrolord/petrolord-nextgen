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
