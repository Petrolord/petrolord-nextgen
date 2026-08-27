// Material-balance teaching lab for the RC2 course (app 'mbal'). Pure math +
// fixture access; every exported value is pinned by tankLab.test.js to the RC2
// truth digest, which was derived by running the central engines over the
// committed fixtures. Panels and the learning page import THIS module.

import ekeneMbal from '@petrolord/engines/test-data/ekene-dynamic/mbal.json';
import ekeneField from '@petrolord/engines/test-data/ekene-dynamic/field.json';
import ahmed1010 from '@petrolord/engines/test-data/mbal/ahmed-ex-10-10-fetkovich.json';
import ahmed111 from '@petrolord/engines/test-data/mbal/ahmed-ex-11-1-combination.json';
import {
  computeMaterialBalance, computeOilPerTimestep, computeFetkovichWe,
} from '@petrolord/engines/engines/mbal/mbalEngine.ts';
import {
  DAKE_CT_RESERVOIR, DAKE_CT_PERFORMANCE,
} from '@petrolord/engines/test-data/mbal/dake-9-2.ts';
import { pD, pDFinite } from '@petrolord/engines/engines/aquifer/aquiferInflux.js';

export const EKENE = ekeneMbal;
export const FIELD = ekeneField;
export const AHMED_1010 = ahmed1010;
export const AHMED_111 = ahmed111;
export { pD, pDFinite };

// ---------------------------------------------------------------------------
// 1. The Ekene tank (Associate)
// ---------------------------------------------------------------------------

/** Run the real engine over the Ekene survey history, optionally forcing an
 *  aquifer model the data does not need (the Professional "wrong model" case). */
export function runEkeneTank({ aquiferModel = 'none', potW = 1e7 } = {}) {
  const inputs = JSON.parse(JSON.stringify(EKENE.inputs));
  if (aquiferModel !== 'none') {
    inputs.has_aquifer = true;
    inputs.aquifer_model = aquiferModel;
    inputs.aquifer_params = { initial_aquifer_water_in_place_rb: potW };
  }
  const result = computeMaterialBalance(inputs);
  const { per_timestep, meta } = computeOilPerTimestep(inputs);
  const rows = per_timestep.map((r) => {
    const src = inputs.production_data[r.timestep_index];
    return {
      n: r.timestep_index,
      date: src.observation_date,
      pressure_psia: r.pressure_psia,
      cum_oil_stb: src.cum_oil_stb ?? 0,
      F_rb: r.F_rb,
      Eo_rb_stb: r.Eo_rb_stb,
      Efw_rb: r.Efw_rb,
      Et_rb: r.Et_rb,
      // F/Et is constant for a closed tank; that constancy IS the straight line.
      F_over_Et: r.Et_rb > 0 ? r.F_rb / r.Et_rb : null,
      efwShare: r.Et_rb > 0 ? r.Efw_rb / r.Et_rb : null,
    };
  });
  return { result, meta, rows, last: rows[rows.length - 1] };
}

/** The reconciliation the Associate capstone turns on. */
export function reconciliation() {
  const { result } = runEkeneTank();
  const volumetric = FIELD.static.stoiip_stb;
  const mb = result.estimated_ooip_stb;
  return {
    volumetric,
    materialBalance: mb,
    absoluteGap: Math.abs(mb - volumetric),
    relativeGap: Math.abs(mb - volumetric) / volumetric,
  };
}

// ---------------------------------------------------------------------------
// 2. Fetkovich constants (Professional)
// ---------------------------------------------------------------------------

/**
 * Fetkovich aquifer constants from geometry.
 * TWO bookkeeping traps live here and both are taught:
 *  - Wi is quoted for the FULL circle; the encroachment-angle fraction is
 *    applied when Wei is formed, not when Wi is quoted.
 *  - J uses the pseudo-steady-state denominator [ln(reD) - 0.75]. Plain
 *    ln(reD) is 47 percent wrong and propagates into every influx step.
 */
export function fetkovichConstants({
  h_ft, phi, ct_psi, pi_psia, k_md, theta_deg, muw_cp, re_ft, ra_ft, reD, dt_days,
  usePseudoSteadyState = true,
} = {}) {
  const g = { ...AHMED_1010.given };
  const p = {
    h_ft: h_ft ?? g.h_ft, phi: phi ?? g.phi, ct_psi: ct_psi ?? g.ct_psi,
    pi_psia: pi_psia ?? g.pi_psia, k_md: k_md ?? g.k_md, theta_deg: theta_deg ?? g.theta_deg,
    muw_cp: muw_cp ?? g.muw_cp, re_ft: re_ft ?? g.re_ft, ra_ft: ra_ft ?? g.ra_ft,
    reD: reD ?? g.reD, dt_days: dt_days ?? g.dt_days,
  };
  const fAngle = p.theta_deg / 360;
  const WiFull = (Math.PI * (p.ra_ft ** 2 - p.re_ft ** 2) * p.h_ft * p.phi) / 5.615;
  const WiWedge = WiFull * fAngle;
  const Wei = p.ct_psi * WiWedge * p.pi_psia;
  const denom = usePseudoSteadyState ? Math.log(p.reD) - 0.75 : Math.log(p.reD);
  const J = (0.00708 * p.k_md * p.h_ft * fAngle) / (p.muw_cp * denom);
  const decay = 1 - Math.exp((-J * p.pi_psia * p.dt_days) / Wei);
  return { ...p, fAngle, WiFull, WiWedge, Wei, J, denom, decay, JpiOverWei: (J * p.pi_psia) / Wei };
}

/** March the engine's own Fetkovich scheme over the Ahmed 10-10 history. */
export function fetkovichMarch(overrides = {}) {
  const c = fetkovichConstants(overrides);
  const prod = AHMED_1010.pressure_history.map((r, i) => ({
    timestep_index: i,
    observation_date: `${1980 + Math.round(r.t_days / c.dt_days)}-01-01`,
    pressure_psia: r.p_psia,
    cum_oil_stb: 0, cum_gas_scf: 0, cum_water_stb: 0,
  }));
  const inputs = {
    fluid_system: 'oil', has_aquifer: true, has_gas_cap: false,
    initial_pressure_psia: c.pi_psia, reservoir_temperature_f: 200,
    initial_water_saturation: 0.25,
    formation_compressibility_psi: 4e-6, water_compressibility_psi: 3e-6,
    aquifer_model: 'fetkovich',
    aquifer_params: {
      initial_aquifer_water_in_place_rb: c.WiWedge,
      aquifer_pi_rb_d_psi: c.J,
      aquifer_total_compressibility_psi: c.ct_psi,
    },
    pvt_source: 'correlated',
    pvt_correlations: {
      pb_rs_bo: 'standing', oil_viscosity: 'beggs_robinson',
      z_factor: 'hall_yarborough', water: 'mccain', gas_viscosity: 'lee_gonzalez_eakin',
    },
    solver_method: 'havlena_odeh',
    production_data: prod,
  };
  const deltas = prod.map((_, i) => (i === 0 ? 0 : c.dt_days));
  const We = computeFetkovichWe(inputs, deltas);
  return { constants: c, We, printed: AHMED_1010.printed_table };
}

// ---------------------------------------------------------------------------
// 3. Combination drive (Expert): Ahmed 11-1 terms and the index convention
// ---------------------------------------------------------------------------

export function combinationDrive() {
  const g = AHMED_111.given;
  const hi = g.pvt.at_3000;
  const lo = g.pvt.at_2800;
  const Rp = g.Gp_scf / g.Np_stb;
  const F = g.Np_stb * (lo.Bt + lo.Bg_rb_scf * (Rp - hi.Rs)) + g.Wp_stb * lo.Bw;
  const Eo = lo.Bt - hi.Bt;
  const Eg = (hi.Bt / hi.Bg_rb_scf) * (lo.Bg_rb_scf - hi.Bg_rb_scf);
  const dp = g.pi_psia - g.p2_psia;
  const Efw = (hi.Bt * (1 + g.m) * (g.Swi * g.cw_psi + g.cf_psi)) / (1 - g.Swi) * dp;
  const We = F - g.N_stb * (Eo + g.m * Eg + Efw);
  const Wp_rb = g.Wp_stb * lo.Bw;
  // The book apportions NET withdrawal A = F - Wp*Bw, not F. Only that
  // convention reproduces the printed indices and only it closes to 1.
  const A = F - Wp_rb;
  const indicesBy = (den) => ({
    DDI: (g.N_stb * Eo) / den,
    SDI: (g.N_stb * g.m * Eg) / den,
    WDI: (We - Wp_rb) / den,
    EDI: (g.N_stb * Efw) / den,
  });
  const withSum = (o) => ({ ...o, sum: o.DDI + o.SDI + o.WDI + o.EDI });
  return {
    Rp, F, Eo, Eg, Efw, We, A, Wp_rb,
    byNetWithdrawal: withSum(indicesBy(A)),
    byGrossWithdrawal: withSum(indicesBy(F)),
    printed: AHMED_111.printed,
  };
}

// ---------------------------------------------------------------------------
// 4. pD families (Expert)
// ---------------------------------------------------------------------------

/** Pseudo-steady-state asymptote for a bounded circular aquifer. */
export const pssAsymptote = (tD, reD) => (2 * tD) / (reD * reD - 1) + Math.log(reD) - 0.75;

export function pdSweep(reD = 5, tDs = [0.1, 1, 5, 10, 25, 50, 100]) {
  return tDs.map((tD) => {
    const infinite = pD(tD);
    const finite = pDFinite(tD, reD);
    return { tD, infinite, finite, ratio: infinite > 0 ? finite / infinite : null, pss: pssAsymptote(tD, reD) };
  });
}

// ---------------------------------------------------------------------------
// 5. Dake Exercise 9.2, the Expert benchmark
// ---------------------------------------------------------------------------

/** Run the real engine over Dake's Exercise 9.2 performance history.
 *
 *  aquifer:
 *    'finite'   the mapped wedge aquifer at the fixture's radius ratio (reD 5),
 *               which is what the Expert capstone grades;
 *    'infinite' the same aquifer with the radius ratio removed, so the
 *               infinite-acting solution is used on a bounded aquifer;
 *    'none'     the compulsory counterfactual, no aquifer term at all.
 *
 *  The two graded capstone fields come from here, so this run is pinned by
 *  tankLab.test.js exactly as the Associate and Professional values are.
 */
export function runDakeTank({ aquifer = 'finite', radiusRatio } = {}) {
  const R = DAKE_CT_RESERVOIR;
  const production_data = DAKE_CT_PERFORMANCE.map((row, idx) => ({
    timestep_index: idx,
    observation_date: `${1980 + row.yr}-01-01`,
    pressure_psia: row.p,
    cum_oil_stb: row.Np_mmstb * 1e6,
    cum_gas_scf: row.Np_mmstb * 1e6 * row.Rp,
    cum_water_stb: 0,
    bo_rb_stb: row.Bo,
    rs_scf_stb: row.Rs,
    bg_rb_scf: row.Bg,
    bw_rb_stb: 1.0,
  }));

  const aquifer_params = {
    aquifer_radius_ft: R.aquifer_radius_ft,
    aquifer_thickness_ft: R.aquifer_thickness_ft,
    aquifer_permeability_md: R.aquifer_permeability_md,
    aquifer_porosity: R.aquifer_porosity,
    aquifer_water_viscosity_cp: R.aquifer_water_viscosity_cp,
    theta_degrees: R.aquifer_encroachment_angle_deg,
    aquifer_total_compressibility_psi: R.aquifer_total_compressibility_psi,
  };
  // radius_ratio present = bounded solution; absent = infinite-acting.
  if (aquifer === 'finite') {
    aquifer_params.radius_ratio = radiusRatio ?? R.aquifer_dim_radius_ratio;
  }

  const inputs = {
    fluid_system: 'oil',
    has_aquifer: aquifer !== 'none',
    has_gas_cap: false,
    initial_pressure_psia: R.initial_pressure_psia,
    reservoir_temperature_f: R.reservoir_temperature_f,
    initial_water_saturation: R.initial_water_saturation,
    bubble_point_psia: R.bubble_point_psia,
    oil_gravity_api: R.oil_gravity_api,
    gas_specific_gravity: R.gas_specific_gravity,
    formation_compressibility_psi: R.formation_compressibility_psi,
    water_compressibility_psi: R.water_compressibility_psi,
    gas_cap_ratio_m: 0,
    aquifer_model: aquifer === 'none' ? 'none' : 'carter_tracy',
    aquifer_params: aquifer === 'none' ? undefined : aquifer_params,
    pvt_source: 'lab_table',
    pvt_correlations: {
      pb_rs_bo: 'standing', oil_viscosity: 'beggs_robinson', z_factor: 'hall_yarborough',
      water: 'mccain', gas_viscosity: 'lee_gonzalez_eakin',
    },
    solver_method: 'havlena_odeh',
    production_data,
  };

  const result = computeMaterialBalance(inputs);
  return {
    result,
    inputs,
    ooip_mmstb: result.estimated_ooip_stb / 1e6,
    we_mmrb: (result.aquifer_cumulative_we_rb ?? 0) / 1e6,
    // Dake's own truth for the field, carried so a caller never has to recall it.
    dake_truth_mmstb: 312,
    recovery_factor_pct: (77.43e6 / result.estimated_ooip_stb) * 100,
  };
}
