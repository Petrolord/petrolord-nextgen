// W5b re-case, porepressure: every graded value is what the course panel
// shows once the learner types the setting the brief states. Each key calls
// the same teaching function the panel calls (src/lib/porepressureTeaching.js,
// on the vendored engines), with the setting read from porepressure.json.
import {
  PARAMS, WELL, computeBasics, computeEatonExplorer, computeWindowExplorer, computeBowersFacts,
} from '../../../src/lib/porepressureTeaching.js';
import { nctDt } from '../../../packages/engines/engines/porepressure/nct.js';
import { gardnerRho } from '../../../packages/engines/engines/porepressure/gardner.js';

export function compute(tiers) {
  const out = {};
  const b = tiers.beginner.case;
  const basics = computeBasics({ waterDepthM: b.water_depth_m, rhoFluidKgM3: b.rho_fluid_kg_m3, fitDtMa: b.fit_dt_ma });
  const iTd = WELL.z_bml_m.length - 1;
  const { nct } = PARAMS;
  out.beginner = {
    hydro_td_mpa: basics.prof.hydrostaticPa[iTd] / 1e6,
    ob_td_mpa: basics.prof.overburdenPa[iTd] / 1e6,
    gardner_rho: gardnerRho(b.gardner_v_ms),
    nct_case_depth: nctDt(b.nct_depth_m, nct.dtMlUsPerM, nct.dtMaUsPerM, nct.cPerM),
    fit_dtml: basics.fit.dtMl,
    fit_c_per_km: basics.fit.c * 1000,
  };
  const i = tiers.intermediate.case;
  const m = computeEatonExplorer(i.eaton_n, 'well', i.threshold_mpa,
    { waterDepthM: i.water_depth_m, rhoFluidKgM3: i.rho_fluid_kg_m3, nu: i.nu });
  out.intermediate = {
    onset_m: m.onsetM,
    budget_td_mpa: m.budgetTdMpa,
    pp_3000_mpa: m.pp3000Mpa,
    pp_td_mpa: m.ppTdMpa,
    op_td_mpa: m.opTdMpa,
    fp_td_mpa: m.fpTdMpa,
  };
  const a = tiers.advanced.case;
  const setting = { waterDepthM: a.water_depth_m, rhoFluidKgM3: a.rho_fluid_kg_m3, nu: a.nu };
  const w = computeWindowExplorer(a.eaton_n, setting);
  const w2 = computeWindowExplorer(a.eaton_n_alt, setting);
  const bw = computeBowersFacts({
    A: a.bowers_a, B: a.bowers_b, stressMPa: a.bowers_stress_mpa, vUnloadMs: a.bowers_v_unload_ms,
    sigmaMaxMPa: a.bowers_sigma_max_mpa, U: a.bowers_u,
  });
  out.advanced = {
    pp_emw_td: w.ppEmwTd,
    fp_emw_td: w.fpEmwTd,
    window_td: w.windowTd,
    bowers_v_case: bw.vLoad5MPa,
    bowers_sigma_mpa: bw.sigmaUnloadPa / 1e6,
    pp_td_alt_n_mpa: w2.ppTdMpa,
  };
  return out;
}
