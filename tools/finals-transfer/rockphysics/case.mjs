// W6 transfer case for the rockphysics finals: the OKIRIKA sand.
//
// A case no module, lesson or capstone of the course works. The Ekene SAND is
// the teaching case (60 degC, 25 MPa, 35000 ppm, 70/30 quartz and clay, the
// 3200/1800/2250 log point under the 2743/1394/2450 shale, 25 and 40 Hz); the
// W5a capstone case is UQUO. OKIRIKA is hotter, deeper and saltier, carries a
// three-mineral frame with calcite cement, a faster logged sand, a harder
// shale and a 30 Hz survey.
//
// Every figure the W6 items print is computed here through the VENDORED
// engines, including each numeric distractor, which is the same engine call
// run with the wrong input or the wrong method a learner would make. The
// output is the digest: {inputs, values, print}. Run by
// tools/finals-transfer/w6.py (vite-node with vitest.config.js).
import {
  brine, gas, liveOil, deadOil, woodMix, apiToRho0, waterDensity,
} from '@petrolord/engines/engines/rockphysics/fluids.js';
import { MINERALS, mixMinerals, voigtReussHill } from '@petrolord/engines/engines/rockphysics/minerals.js';
import { kdry, ksat, substituteVels } from '@petrolord/engines/engines/rockphysics/gassmann.js';
import { gcLithVs, greenbergCastagnaVs, mudrockVs } from '@petrolord/engines/engines/rockphysics/vsEstimate.js';
import { shuey, avoClass, zoeppritzRpp } from '@petrolord/engines/engines/rockphysics/avo.js';
import { tuningCurve, tuningThicknessMs } from '@petrolord/engines/engines/rockphysics/wedge.js';

const values = {};
const print = {};
const put = (key, v, d) => { values[key] = v; print[key] = Number(v).toFixed(d); };
const putS = (key, s) => { values[key] = s; print[key] = s; };

// ------------------------------------------------------------------ inputs
const COND = { tC: 90, pMPa: 34, salinity: 0.08, gasGravity: 0.75, api: 30, gorLL: 90 };
const FRAME = [{ name: 'quartz', frac: 0.62 }, { name: 'calcite', frac: 0.2 }, { name: 'clay', frac: 0.18 }];
const SW_MIX = 0.9;
const LOG = { vp: 3520, vs: 2050, rho: 2310 };
const PHI = 0.2;
const SHALE = { vp: 2800, vs: 1560, rho: 2500 };
const GC_VP = 3350;
const GC_SPLIT = { sandstone: 0.8, shale: 0.2 };
const FREQ = 30;
const THRESH = 0.02;

const { tC, pMPa, salinity, gasGravity, gorLL } = COND;
const rho0 = apiToRho0(COND.api);

// ------------------------------------------------------------------ beginner: fluids
const br = brine(tC, pMPa, salinity);
put('b_brine_rho', br.rho, 2);
put('b_brine_k_gpa', br.k / 1e9, 4);
put('b_brine_vp', br.vp, 1);
const water = { rho: waterDensity(tC, pMPa) * 1000 };
put('b_water_rho', water.rho, 2);                          // salt left out
const brSlip = brine(tC, pMPa, salinity / 10);             // 80000 ppm read as 0.008
put('b_brine_rho_slip', brSlip.rho, 2);
put('b_brine_k_slip_gpa', brSlip.k / 1e9, 4);
const brSurf = brine(20, 0.1, salinity);                   // surface conditions
put('b_brine_rho_surface', brSurf.rho, 2);
put('b_brine_k_surface_gpa', brSurf.k / 1e9, 4);
const brHalfSalt = brine(tC, pMPa, salinity / 8);                // an eighth of the salinity, 0.01
put('b_brine_k_low_salt_gpa', brHalfSalt.k / 1e9, 4);
put('b_salt_k_rise_pct', 100 * (br.k / brHalfSalt.k - 1), 2);
put('b_salt_rho_rise', br.rho - brHalfSalt.rho, 2);

const gs = gas(tC, pMPa, gasGravity);
put('b_gas_rho', gs.rho, 2);
put('b_gas_k_mpa', gs.k / 1e6, 2);
const gsLight = gas(tC, pMPa, 0.6);                        // the default gravity
put('b_gas_k_light_mpa', gsLight.k / 1e6, 2);
const gsHalfP = gas(tC, pMPa / 2, gasGravity);
put('b_gas_k_halfp_mpa', gsHalfP.k / 1e6, 2);
put('b_gas_k_p_ratio', gs.k / gsHalfP.k, 3);
put('b_gas_rho_p_ratio', gs.rho / gsHalfP.rho, 3);
put('b_gas_k_isothermal_mpa', pMPa, 2);                    // ideal isothermal gas: K = P
put('b_stiff_ratio', br.k / gs.k, 2);
put('b_stiff_ratio_iso', br.k / (pMPa * 1e6), 2);            // against the isothermal ideal gas
put('b_rho_ratio', br.rho / gs.rho, 2);
put('b_vp_ratio', br.vp / Math.sqrt(gs.k / gs.rho), 2);

put('b_rho0', rho0 * 1000, 1);                            // stock tank density, kg/m3
const oil = liveOil(tC, pMPa, rho0, gorLL, gasGravity);
put('b_oil_rho', oil.rho, 2);
put('b_oil_k_gpa', oil.k / 1e9, 4);
put('b_oil_vp', oil.vp, 1);
const dead = deadOil(tC, pMPa, rho0);
put('b_dead_rho', dead.rho, 2);
put('b_dead_k_gpa', dead.k / 1e9, 4);
const oilLightGas = liveOil(tC, pMPa, rho0, gorLL, 0.6);
put('b_oil_rho_light_gas', oilLightGas.rho, 2);

// ------------------------------------------------------------------ beginner: frame
const fr = mixMinerals(FRAME);
put('b_frame_k_gpa', fr.k / 1e9, 4);
put('b_frame_mu_gpa', fr.mu / 1e9, 4);
put('b_frame_rho', fr.rho, 1);
const partsK = FRAME.map((e) => ({ frac: e.frac, m: MINERALS[e.name].k }));
const partsMu = FRAME.map((e) => ({ frac: e.frac, m: MINERALS[e.name].mu }));
const voigt = (p) => p.reduce((s, x) => s + x.frac * x.m, 0);
const reuss = (p) => 1 / p.reduce((s, x) => s + x.frac / x.m, 0);
put('b_k_voigt_gpa', voigt(partsK) / 1e9, 4);
put('b_k_reuss_gpa', reuss(partsK) / 1e9, 4);
put('b_mu_voigt_gpa', voigt(partsMu) / 1e9, 4);
put('b_mu_reuss_gpa', reuss(partsMu) / 1e9, 4);
put('b_k_spread_pct', 100 * (voigt(partsK) / reuss(partsK) - 1), 1);
put('b_mu_spread_pct', 100 * (voigt(partsMu) / reuss(partsMu) - 1), 1);
put('b_k_unweighted_gpa', (MINERALS.quartz.k + MINERALS.calcite.k + MINERALS.clay.k) / 3e9, 4);
// the frame as if the calcite were quartz (a two-mineral 85/15 split)
const fr2 = mixMinerals([{ name: 'quartz', frac: 0.85 }, { name: 'clay', frac: 0.15 }]);
put('b_frame_k_nocalcite_gpa', fr2.k / 1e9, 4);
put('b_frame_rho_harm', 1 / FRAME.reduce((s, e) => s + e.frac / MINERALS[e.name].rho, 0), 1);
// zero-porosity velocities of the frame
put('b_frame_vp', Math.sqrt((fr.k + (4 / 3) * fr.mu) / fr.rho), 1);
put('b_frame_vp_noshear', Math.sqrt(fr.k / fr.rho), 1);
put('b_frame_vp_kmu', Math.sqrt((fr.k + fr.mu) / fr.rho), 1);
put('b_frame_vs', Math.sqrt(fr.mu / fr.rho), 1);
void voigtReussHill;

// ------------------------------------------------------------------ beginner: Wood mix
const mixed = woodMix([{ sat: SW_MIX, k: br.k, rho: br.rho }, { sat: 1 - SW_MIX, k: gs.k, rho: gs.rho }]);
put('b_mix_k_mpa', mixed.k / 1e6, 2);
put('b_mix_rho', mixed.rho, 2);
put('b_mix_k_linear_mpa', (SW_MIX * br.k + (1 - SW_MIX) * gs.k) / 1e6, 2);
const swapped = woodMix([{ sat: 1 - SW_MIX, k: br.k, rho: br.rho }, { sat: SW_MIX, k: gs.k, rho: gs.rho }]);
put('b_mix_k_swapped_mpa', swapped.k / 1e6, 2);
put('b_mix_rho_swapped', swapped.rho, 2);
put('b_mix_k_hill_mpa', 0.5 * ((SW_MIX * br.k + (1 - SW_MIX) * gs.k) + mixed.k) / 1e6, 2);
put('b_mix_rho_harm', 1 / (SW_MIX / br.rho + (1 - SW_MIX) / gs.rho), 2);
const gasCompl = ((1 - SW_MIX) / gs.k) / (SW_MIX / br.k + (1 - SW_MIX) / gs.k);
put('b_gas_compliance_pct', 100 * gasCompl, 0);
put('b_brine_compliance_pct', 100 * (1 - gasCompl), 0);
put('b_mix_k_drop_pct', 100 * (1 - mixed.k / br.k), 1);
put('b_mix_rho_drop_pct', 100 * (1 - mixed.rho / br.rho), 1);

// ------------------------------------------------------------------ intermediate: substitution
const KMIN = fr.k;                                         // the OKIRIKA frame's own VRH modulus
put('i_kmin_gpa', KMIN / 1e9, 2);
const mu = LOG.rho * LOG.vs ** 2;
const ksatB = LOG.rho * LOG.vp ** 2 - (4 / 3) * mu;
put('i_mu_gpa', mu / 1e9, 4);
put('i_ksat_gpa', ksatB / 1e9, 4);
put('i_rhovp2_gpa', (LOG.rho * LOG.vp ** 2) / 1e9, 4);          // forgot the shear term
put('i_rho_vp2_minus_vs2_gpa', (LOG.rho * (LOG.vp ** 2 - LOG.vs ** 2)) / 1e9, 4);
const kd = kdry(ksatB, KMIN, br.k, PHI);
put('i_kdry_gpa', kd / 1e9, 4);
put('i_ksat_forward_gpa', ksat(kd, KMIN, br.k, PHI) / 1e9, 4);   // forward Gassmann returns the log
const kdAsGas = kdry(ksatB, KMIN, gs.k, PHI);              // log wrongly treated as gas bearing
put('i_kdry_asgas_gpa', kdAsGas / 1e9, 4);
put('i_biot', 1 - kd / KMIN, 3);
put('i_biot_ksat', 1 - ksatB / KMIN, 3);                   // Biot from the saturated modulus
put('i_biot_mu', 1 - mu / fr.mu, 3);
const gasCase = substituteVels(LOG.vp, LOG.vs, LOG.rho, KMIN, PHI, br, gs);
put('i_gas_vp', gasCase.vp, 1);
put('i_gas_vs', gasCase.vs, 1);
put('i_gas_rho', gasCase.rho, 1);
put('i_gas_ksat_gpa', gasCase.ksat / 1e9, 4);
// wrong methods on the gas case
put('i_gas_vp_rhofixed', Math.sqrt((gasCase.ksat + (4 / 3) * mu) / LOG.rho), 1);   // density not swapped
put('i_gas_vs_rhofixed', LOG.vs, 1);
put('i_gas_rho_graingas', LOG.rho * (1 - PHI) + PHI * gs.rho, 1);         // log density taken as the grain density
put('i_gas_rho_up', LOG.rho + PHI * (br.rho - gs.rho), 1);              // bookkeeping backwards
put('i_gas_vs_rho_up', Math.sqrt(mu / (LOG.rho + PHI * (br.rho - gs.rho))), 1);
const gasQtzKmin = substituteVels(LOG.vp, LOG.vs, LOG.rho, MINERALS.quartz.k, PHI, br, gs);
put('i_gas_vp_quartz_kmin', gasQtzKmin.vp, 1);
put('i_kmin_quartz_gpa', MINERALS.quartz.k / 1e9, 2);
put('i_gas_vs_mudrock', mudrockVs(gasCase.vp), 1);
// impedance and ratio
const zB = LOG.rho * LOG.vp;
const zG = gasCase.rho * gasCase.vp;
put('i_z_brine_e6', zB / 1e6, 4);
put('i_z_gas_e6', zG / 1e6, 4);
put('i_z_drop_pct', 100 * (1 - zG / zB), 1);
put('i_vp_drop_pct', 100 * (1 - gasCase.vp / LOG.vp), 1);
put('i_rho_drop_pct', 100 * (1 - gasCase.rho / LOG.rho), 1);
put('i_vpvs_brine', LOG.vp / LOG.vs, 4);
put('i_vpvs_gas', gasCase.vp / gasCase.vs, 4);
put('i_vpvs_drop_pct', 100 * (1 - (gasCase.vp / gasCase.vs) / (LOG.vp / LOG.vs)), 1);
// oil case
const oilCase = substituteVels(LOG.vp, LOG.vs, LOG.rho, KMIN, PHI, br, oil);
put('i_oil_vp', oilCase.vp, 1);
put('i_oil_rho', oilCase.rho, 1);
const deadCase = substituteVels(LOG.vp, LOG.vs, LOG.rho, KMIN, PHI, br, dead);
put('i_dead_vp', deadCase.vp, 1);
put('i_oil_vs', oilCase.vs, 1);
// the first percent and the velocity minimum
const atSw = (sw) => {
  const m = woodMix([{ sat: sw, k: br.k, rho: br.rho }, { sat: 1 - sw, k: gs.k, rho: gs.rho }]);
  return substituteVels(LOG.vp, LOG.vs, LOG.rho, KMIN, PHI, br, m);
};
const v99 = atSw(0.99);
put('i_vp_sw99', v99.vp, 1);
put('i_first_pct_share', 100 * (LOG.vp - v99.vp) / (LOG.vp - gasCase.vp), 1);
const v90 = atSw(0.9);
put('i_vp_sw90', v90.vp, 1);
put('i_sw90_share', 100 * (LOG.vp - v90.vp) / (LOG.vp - gasCase.vp), 1);
let minSw = 1;
let minVp = LOG.vp;
for (let k = 100; k >= 0; k -= 1) {
  const s = k / 100;
  const v = atSw(s).vp;
  if (v < minVp) { minVp = v; minSw = s; }
}
put('i_vpmin_sw', minSw, 2);
put('i_vpmin', minVp, 1);
put('i_vpmin_below_gas', minVp < gasCase.vp ? gasCase.vp - minVp : 0, 1);
// porosity sensitivity
const gasPhiLo = substituteVels(LOG.vp, LOG.vs, LOG.rho, KMIN, PHI - 0.05, br, gs);
const gasPhiHi = substituteVels(LOG.vp, LOG.vs, LOG.rho, KMIN, PHI + 0.05, br, gs);
put('i_gas_vp_phi_lo', gasPhiLo.vp, 1);
put('i_gas_vp_phi_hi', gasPhiHi.vp, 1);
put('i_phi_lo', PHI - 0.05, 2);
put('i_phi_hi', PHI + 0.05, 2);
put('i_phi_range_ms', Math.abs(gasPhiLo.vp - gasPhiHi.vp), 1);
put('i_oil_gas_sep', oilCase.vp - gasCase.vp, 1);
// round trip
const back = substituteVels(gasCase.vp, gasCase.vs, gasCase.rho, KMIN, PHI, gs, br);
put('i_roundtrip_vp', back.vp, 4);
put('i_roundtrip_vs', back.vs, 4);
// grain density
put('i_grain_rho', (LOG.rho - PHI * br.rho) / (1 - PHI), 1);
put('i_grain_rho_gas', (LOG.rho - PHI * gs.rho) / (1 - PHI), 1);
put('i_grain_rho_nofluid', LOG.rho / (1 - PHI), 1);
// shear estimation
put('i_gc_vs', greenbergCastagnaVs(GC_VP, GC_SPLIT), 1);
put('i_gc_sand_vs', gcLithVs(GC_VP, 'sandstone'), 1);
put('i_gc_shale_vs', gcLithVs(GC_VP, 'shale'), 1);
put('i_gc_arith_vs', GC_SPLIT.sandstone * gcLithVs(GC_VP, 'sandstone') + GC_SPLIT.shale * gcLithVs(GC_VP, 'shale'), 1);
put('i_mudrock_vs', mudrockVs(GC_VP), 1);
put('i_mudrock_at_log', mudrockVs(LOG.vp), 1);
const gcAtLog = greenbergCastagnaVs(LOG.vp, GC_SPLIT);
put('i_gc_at_log', gcAtLog, 1);
put('i_gc_at_log_err_pct', 100 * (gcAtLog / LOG.vs - 1), 1);
const gcAtGasVp = greenbergCastagnaVs(gasCase.vp, GC_SPLIT);
put('i_gc_at_gas_vp', gcAtGasVp, 1);
put('i_gc_at_gas_err_pct', 100 * (1 - gcAtGasVp / gasCase.vs), 1);

// ------------------------------------------------------------------ advanced: AVO
const sh = SHALE;
const lowerB = LOG;
const lowerG = { vp: gasCase.vp, vs: gasCase.vs, rho: gasCase.rho };
const ni = (u, l) => (l.rho * l.vp - u.rho * u.vp) / (l.rho * l.vp + u.rho * u.vp);
put('a_ni_brine', ni(sh, lowerB), 5);
put('a_ni_gas', ni(sh, lowerG), 5);
put('a_ni_brine_flip', -ni(sh, lowerB), 5);
put('a_vp_only_brine', (lowerB.vp - sh.vp) / (lowerB.vp + sh.vp), 5);
put('a_rho_only_brine', (lowerB.rho - sh.rho) / (lowerB.rho + sh.rho), 5);
const sB = shuey(sh.vp, sh.vs, sh.rho, lowerB.vp, lowerB.vs, lowerB.rho, 0);
const sG = shuey(sh.vp, sh.vs, sh.rho, lowerG.vp, lowerG.vs, lowerG.rho, 0);
put('a_A_brine', sB.a, 5);
put('a_B_brine', sB.b, 5);
put('a_C_brine', sB.c, 5);
put('a_A_gas', sG.a, 5);
put('a_B_gas', sG.b, 5);
put('a_C_gas', sG.c, 5);
put('a_A_brine_vponly', 0.5 * ((lowerB.vp - sh.vp) / (0.5 * (lowerB.vp + sh.vp))), 5);
const sBrev = shuey(lowerB.vp, lowerB.vs, lowerB.rho, sh.vp, sh.vs, sh.rho, 0);
put('a_A_brine_transposed', sBrev.a, 5);
put('a_B_brine_transposed', sBrev.b, 5);
putS('a_class_brine', avoClass(sB.a, sB.b, THRESH));
putS('a_class_gas', avoClass(sG.a, sG.b, THRESH));
putS('a_class_brine_t04', avoClass(sB.a, sB.b, 0.04));
putS('a_class_brine_t05', avoClass(sB.a, sB.b, 0.05));
putS('a_class_gas_t01', avoClass(sG.a, sG.b, 0.01));
put('a_gas_A_over_thresh', Math.abs(sG.a) / THRESH, 2);
put('a_brine_A_over_thresh', sB.a / THRESH, 2);
putS('a_class_brine_t01', avoClass(sB.a, sB.b, 0.01));
// the gradient decomposed on the gas case
{
  const g = lowerG;
  const vpm = 0.5 * (sh.vp + g.vp); const vsm = 0.5 * (sh.vs + g.vs); const rhom = 0.5 * (sh.rho + g.rho);
  const w = (vsm / vpm) ** 2;
  put('a_Bg_vp_term', 0.5 * ((g.vp - sh.vp) / vpm), 5);
  put('a_Bg_rho_term', -2 * w * ((g.rho - sh.rho) / rhom), 5);
  put('a_Bg_vs_term', -2 * w * ((2 * (g.vs - sh.vs)) / vsm), 5);
}
// exact against Shuey across angle
const curve = (lower) => {
  const out = [];
  for (let th = 0; th <= 40; th += 1) {
    const s3 = shuey(sh.vp, sh.vs, sh.rho, lower.vp, lower.vs, lower.rho, th).r;
    const s2 = shuey(sh.vp, sh.vs, sh.rho, lower.vp, lower.vs, lower.rho, th, { threeTerm: false }).r;
    const z = zoeppritzRpp(sh.vp, sh.vs, sh.rho, lower.vp, lower.vs, lower.rho, th);
    out.push({ th, s3, s2, z: z.re, zi: z.im });
  }
  return out;
};
const cB = curve(lowerB);
const cG = curve(lowerG);
const maxErr = (c) => c.reduce((m, p) => Math.max(m, Math.abs(p.s3 - p.z)), 0);
put('a_maxerr_brine', maxErr(cB), 6);
put('a_maxerr_gas', maxErr(cG), 6);
put('a_maxerr_brine_2t', cB.reduce((m, p) => Math.max(m, Math.abs(p.s2 - p.z)), 0), 6);
put('a_maxim_brine', cB.reduce((m, p) => Math.max(m, Math.abs(p.zi)), 0), 6);
put('a_z30_gas', cG[30].z, 5);
put('a_s3_30_gas', cG[30].s3, 5);
put('a_s2_30_gas', cG[30].s2, 5);
put('a_z30_brine', cB[30].z, 5);
put('a_z40_brine', cB[40].z, 5);
put('a_s2_40_brine', cB[40].s2, 5);
put('a_s3_30_brine', cB[30].s3, 5);
put('a_err30_brine', cB[30].s3 - cB[30].z, 5);
put('a_err30_brine_pct_of_A', 100 * Math.abs(cB[30].s3 - cB[30].z) / sB.a, 1);
put('a_z0_brine', cB[0].z, 5);
// polarity crossing, brine case: exact (bisection on the engine), 3-term and 2-term Shuey
const cross = (fn) => {
  // first sign change from positive to non-positive, scanning 0 to 60 degrees
  // at 0.01, then bisected to the root; null when there is none
  let prev = fn(0);
  for (let k = 1; k <= 6000; k += 1) {
    const th = k / 100;
    const v = fn(th);
    if (prev > 0 && v <= 0) {
      let lo = th - 0.01; let hi = th;
      for (let j = 0; j < 60; j += 1) { const m = 0.5 * (lo + hi); if (fn(m) > 0) lo = m; else hi = m; }
      return 0.5 * (lo + hi);
    }
    prev = v;
  }
  return null;
};
const crossExact = cross((th) => zoeppritzRpp(sh.vp, sh.vs, sh.rho, lowerB.vp, lowerB.vs, lowerB.rho, th).re);
const cross3 = cross((th) => shuey(sh.vp, sh.vs, sh.rho, lowerB.vp, lowerB.vs, lowerB.rho, th).r);
const cross2 = cross((th) => shuey(sh.vp, sh.vs, sh.rho, lowerB.vp, lowerB.vs, lowerB.rho, th, { threeTerm: false }).r);
put('a_cross_exact', crossExact, 2);
if (cross3 === null) putS('a_cross_3t', 'none'); else put('a_cross_3t', cross3, 2);
put('a_cross_2t', cross2, 2);
put('a_cross_2t_early', crossExact - cross2, 2);
// critical angle of the shale over each sand
put('a_crit_brine', (Math.asin(sh.vp / lowerB.vp) * 180) / Math.PI, 1);
put('a_crit_gas', (Math.asin(sh.vp / lowerG.vp) * 180) / Math.PI, 1);
// tuning
const tc = tuningCurve(0.1, -0.1, FREQ, 1, 60);
const tMs = tuningThicknessMs(tc.amplitudes, 1);
put('a_tuning_ms', tMs, 0);
put('a_tuning_theory_ms', (1000 * Math.sqrt(6)) / (2 * Math.PI * FREQ), 3);
put('a_tuning_kw_ms', 1000 / (2.6 * FREQ), 3);
put('a_tuning_period_ms', 1000 / FREQ, 3);
put('a_tuning_m_gas', (gasCase.vp * tMs) / 2000, 1);
put('a_tuning_m_gas_oneway', (gasCase.vp * tMs) / 1000, 1);
put('a_tuning_m_brine', (LOG.vp * tMs) / 2000, 1);
put('a_tuning_m_shale', (sh.vp * tMs) / 2000, 1);
const tc40 = tuningCurve(0.1, -0.1, 45, 1, 60);
put('a_tuning_45_ms', tuningThicknessMs(tc40.amplitudes, 1), 0);
put('a_tune_amp_ratio', tc.amplitudes[tMs] / tc.amplitudes[60], 3);
// shear estimated (uncalibrated) for the brine sand under the same shale
const vsEst = greenbergCastagnaVs(LOG.vp, GC_SPLIT);
const sBest = shuey(sh.vp, sh.vs, sh.rho, LOG.vp, vsEst, LOG.rho, 0);
put('a_vs_est_brine', vsEst, 1);
put('a_B_brine_estvs', sBest.b, 5);
putS('a_class_brine_estvs', avoClass(sBest.a, sBest.b, THRESH));

const inputs = {
  case: 'OKIRIKA',
  tC, pMPa, salinity_ppm: 80000, salinity: salinity, gasGravity, api: COND.api, gorLL,
  frame: { quartz: 0.62, calcite: 0.2, clay: 0.18 },
  minerals_gpa: { quartz_k: 36.6, quartz_mu: 45, calcite_k: 76.8, calcite_mu: 32, clay_k: 20.9, clay_mu: 6.9 },
  mineral_rho: { quartz: 2650, calcite: 2710, clay: 2580 },
  sw_mix: SW_MIX, sw_first: 0.99,
  log: LOG, phi: PHI, shale: SHALE, gc_vp: GC_VP, gc_split: { sandstone: 0.8, shale: 0.2 },
  freq_hz: FREQ, freq_alt_hz: 45, threshold: THRESH, thresholds_alt: [0.01, 0.05], angle_max_deg: 40,
  angle_min_deg: 0, sw_step: 0.01, salinity_slip: 0.008, gas_gravity_default: 0.6,
  angle_deg: 30, low_salinity: 0.01, half_pressure_mpa: 17, surface: { tC: 20, pMPa: 0.1 },
};
console.log(JSON.stringify({ inputs, values, print }));
