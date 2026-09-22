// W6 transfer case for the fluid finals: the ISEKI-2 oil.
//
// A fluid no lesson, module question or capstone of this course works. It is
// worked here through the VENDORED engines (and the course lab, which is the
// engines plus the Sutton pseudo-criticals the lessons print) and printed as
// one JSON object {inputs, values, print}. Every figure a W6 fluid item
// prints is a "print" string below, referenced from items.json as {{key}}.
// Wrong-method distractors are computed here too, each by the named wrong
// method, so no number in the finals is typed by hand.
//
// Run: node_modules/.bin/vite-node -c vitest.config.js tools/finals-transfer/fluid/case.mjs
import {
  standingPb, standingRs, standingBoSat,
  vasquezBeggsPb, vasquezBeggsRs, vasquezBeggsBoSat,
  glasoPb, glasoBoSat,
  hallYarboroughZ, dranchukAbouKassemZ,
  bgRbPerScf, mccainBw, mccainMuW,
  bealDeadOilViscosity, beggsRobinsonLiveOilViscosity,
  vasquezBeggsUndersaturatedOilViscosity, leeGonzalezEakinGasViscosity,
  correlationValidityWarnings, viscosityValidityWarnings,
} from '@petrolord/engines/engines/fluid/blackOil.ts';
import { bgRbPerScf as bgCompositional } from '@petrolord/engines/engines/fluid/experiments.js';
import { characterizePlusFraction, mixtureWithPlusFraction, edmisterOmega } from '@petrolord/engines/engines/fluid/characterization.js';
import { saturationPressure } from '@petrolord/engines/engines/fluid/envelope.js';
import { separatorTrain } from '@petrolord/engines/engines/fluid/separator.js';
import { flashPT, wilsonK } from '@petrolord/engines/engines/fluid/flash.js';
import { kappaPR78, phaseProps } from '@petrolord/engines/engines/fluid/pr78.js';
import { lbcViscosity, weinaugKatzIFT } from '@petrolord/engines/engines/fluid/transport.js';
import { tuneToLab, predictTargets } from '@petrolord/engines/engines/fluid/labTune.js';
import { tunedMixtureWithPlusFraction } from '@petrolord/engines/engines/fluid/tuning.js';
import { COMPONENTS } from '@petrolord/engines/engines/fluid/components.js';
import { degFtoR } from '@petrolord/engines/engines/fluid/units.js';
import { oilSg, suttonPseudoCriticals, reducedState } from '../../../src/components/course/panels/fluid/fluidLab.js';

// ---------------------------------------------------------------- the case
const PSIG_BASE = 14.65;          // the laboratory's stated pressure base, psia
const T_F = 206;                  // reservoir temperature, F
const PB_PSIG = 2880;             // CCE bubble point as printed, psig
const PB = PB_PSIG + PSIG_BASE;   // 2945.65 psia
const PI = 4150;                  // initial reservoir pressure, psia
const API = 40.2;                 // stock tank gravity, separator test
const GG = 0.84;                  // separator gas gravity
const RS = 853;                   // total gas-oil ratio, separator test, scf/stb
const BOFB = 1.489;               // separator-test Bo at the bubble point
const SEP_PSIG = 115;             // separator, psig
const SEP_P = SEP_PSIG + PSIG_BASE;
const SEP_T = 80;                 // separator and tank temperature, F
const CO = 2.2e-5;                // undersaturated oil compressibility, 1/psi
const SALINITY = 60000;           // formation water, ppm
// differential liberation, as the report prints it (Amyx inputs)
const BODB = 1.562;               // differential Bo at the bubble point
const RSDB = 952;                 // differential Rs at the bubble point
const P_DL = 2000;                // a depletion step, psia
const BOD = 1.372;                // differential Bo at that step
const RSD = 610;                  // differential Rs at that step

const P_FLASH = 1100;             // the flash the advanced items read, psia

const KEYS = ['CO2', 'N2', 'C1', 'C2', 'C3', 'iC4', 'nC4', 'iC5', 'nC5', 'nC6'];
const Z = [0.0142, 0.0035, 0.4038, 0.0851, 0.0584, 0.0121, 0.0302, 0.0118, 0.0137, 0.0366, 0.3306];
const PLUS = { mw: 207, sg: 0.8440 };
const STAGES_F = [[SEP_T, SEP_P], [SEP_T, PSIG_BASE]];
const tR = degFtoR(T_F);
const stages = STAGES_F.map(([t, p]) => ({ tR: degFtoR(t), pPsia: p }));

const values = {};
const print = {};
const put = (k, v, digits) => { values[k] = v; print[k] = typeof v === 'number' ? v.toFixed(digits) : String(v); };
const pct = (a, b) => (a - b) / b * 100;

// inputs, printed exactly as the items quote them
const inputs = {
  temp_f: T_F, pb_psig: PB_PSIG, psig_base: PSIG_BASE, pi_psia: PI, api: API, gas_sg: GG,
  rs: RS, bofb: BOFB, sep_psig: SEP_PSIG, sep_t_f: SEP_T, co: CO, salinity_ppm: SALINITY,
  bodb: BODB, rsdb: RSDB, p_dl: P_DL, bod: BOD, rsd: RSD, keys: KEYS, z: Z, plus: PLUS,
};
put('in_t', T_F, 0); put('in_pb', PB, 2); put('in_pb_psig', PB_PSIG, 0); put('in_base', PSIG_BASE, 2);
put('in_pi', PI, 0); put('in_api', API, 1); put('in_gg', GG, 2); put('in_rs', RS, 0); put('in_bofb', BOFB, 3);
put('in_sep_psig', SEP_PSIG, 0); put('in_sep_p', SEP_P, 2); put('in_sep_t', SEP_T, 0); put('in_co', CO.toFixed(6));
put('in_sal', SALINITY, 0); put('in_bodb', BODB, 3); put('in_rsdb', RSDB, 0); put('in_pdl', P_DL, 0);
put('in_bod', BOD, 3); put('in_rsd', RSD, 0); put('in_mw', PLUS.mw, 0); put('in_sg', PLUS.sg, 4);
put('in_c1', Z[2], 4); put('in_c7', Z[10], 4); put('in_undersat', PI - PB, 2);
put('in_std_t', 60, 0); put('in_psc', 14.696, 3); put('in_pflash', P_FLASH, 0); put('in_p3500', 3500, 0);
put('in_pr_switch', 0.491, 3); put('in_bisect', 0.05, 2); put('in_bg_const', '0.005035');

// ============================================================ BEGINNER
const osg = oilSg(API);
const pbSt = standingPb(RS, GG, API, T_F);
const pbVb = vasquezBeggsPb(RS, GG, API, T_F);
const pbGl = glasoPb(RS, GG, API, T_F);
put('b_pb_st', pbSt, 1); put('b_pb_vb', pbVb, 1); put('b_pb_gl', pbGl, 1);
// wrong input: temperature fed in degrees Rankine
put('b_pb_st_rankine', standingPb(RS, GG, API, tR), 1);
const pbs = [pbSt, pbVb, pbGl].sort((a, b) => a - b);
put('b_pb_spread', pbs[2] - pbs[0], 1);
put('b_pb_spread_pct', (pbs[2] - pbs[0]) / pbs[1] * 100, 2);
put('b_pb_spread_pct_of_min', (pbs[2] - pbs[0]) / pbs[0] * 100, 2);  // wrong base
put('b_pb_st_err_pct', pct(pbSt, PB), 2);
// reading backwards: the measured bubble point in, Rs out
const rsSt = standingRs(PB, PB, GG, API, T_F);
put('b_rs_st_at_pb', rsSt, 1);
put('b_rs_vb_at_pb', vasquezBeggsRs(PB, PB, GG, API, T_F), 1);
// wrong: asking for Rs at the initial pressure with the initial pressure as the bubble point
put('b_rs_st_at_pi_as_pb', standingRs(PI, PI, GG, API, T_F), 1);
// Bo at the measured Rs
const boSt = standingBoSat(RS, GG, osg, T_F);
put('b_bo_st', boSt, 4); put('b_bo_vb', vasquezBeggsBoSat(RS, GG, API, T_F), 4);
put('b_bo_gl', glasoBoSat(RS, GG, osg, T_F), 4);
put('b_bo_st_err_pct', pct(boSt, BOFB), 2); put('b_stoiip_fall_pct', (1 - BOFB / boSt) * 100, 2);
put('b_bo_st_at_rs_st', standingBoSat(rsSt, GG, osg, T_F), 4);
// undersaturated branch Bo = Bob exp(-co (p - pb)): the lesson's form; no engine export carries it
put('b_bo_factor', Math.exp(-CO * (PI - PB)), 4);
put('b_bo_pi', BOFB * Math.exp(-CO * (PI - PB)), 4);
put('b_bo_pi_wrong_sign', BOFB * Math.exp(CO * (PI - PB)), 4);        // expands on compression
put('b_bo_pi_whole_p', BOFB * Math.exp(-CO * PI), 4);                  // uses p instead of p - pb
// viscosity chain
const muod = bealDeadOilViscosity(API, T_F);
const muob = beggsRobinsonLiveOilViscosity(RS, muod);
const muoPi = vasquezBeggsUndersaturatedOilViscosity(PI, PB, muob);
put('b_muod', muod, 4); put('b_muob', muob, 4); put('b_muo_pi', muoPi, 4);
put('b_muod_60f', bealDeadOilViscosity(API, 60), 4);                  // tank sample at 60 F
put('b_muob_rs_st', beggsRobinsonLiveOilViscosity(rsSt, muod), 4);
put('b_muo_thicken_pct', pct(muoPi, muob), 2); put('b_muo_thicken_factor', muoPi / muob, 4);
put('b_muob_over_muod', muob / muod, 4);
// gas: Sutton, reduced state, two z, Bg, viscosity
const sut = suttonPseudoCriticals(GG);
const red = reducedState(PI, T_F, GG);
put('b_ppc', sut.ppcPsia, 3); put('b_tpc', sut.tpcR, 3);
put('b_ppr', red.ppr, 4); put('b_tpr', red.tpr, 4);
put('b_tpr_f', (T_F) / sut.tpcR, 4);                                  // Fahrenheit, no 459.67
const zHy = hallYarboroughZ(red.ppr, red.tpr);
const zDak = dranchukAbouKassemZ(red.ppr, red.tpr);
put('b_z_hy', zHy, 4); put('b_z_dak', zDak, 4); put('b_z_gap_pct', pct(zHy, zDak), 3);
const bg = bgRbPerScf(PI, T_F, zHy);
put('b_bg', bg, 7); put('b_bg_exp', 1 / bg, 1);
put('b_bg_ideal', bgRbPerScf(PI, T_F, 1), 7);
put('b_bg_comp', bgCompositional(zHy, tR, PI), 7);
put('b_bg_diff_pct', pct(bgCompositional(zHy, tR, PI), bg), 4);
const mug = leeGonzalezEakinGasViscosity(PI, T_F, GG, zHy);
put('b_mug', mug, 4); put('b_mu_ratio', muoPi / mug, 1);
// water
put('b_bw', mccainBw(PI, T_F), 4);
put('b_muw_brine', mccainMuW(PI, T_F, SALINITY), 4);
put('b_muw_fresh', mccainMuW(PI, T_F, 0), 4);
// validity: the case's own conditions, and the same with Vasquez-Beggs at 320 F
const vw = correlationValidityWarnings('standing', 'hall_yarborough', 'mccain',
  { pi: PI, temp_f: T_F, api: API, gas_sg: GG, ppr_max: red.ppr, tpr: red.tpr });
const vv = viscosityValidityWarnings('beggs_robinson', 'lee_gonzalez_eakin',
  { pi: PI, temp_f: T_F, api: API, gas_sg: GG, rs_max: RS });
values.b_warnings = [...vw, ...vv];
put('b_warning_count', vw.length + vv.length, 0);

// ============================================================ INTERMEDIATE
const ch = characterizePlusFraction(PLUS);
put('i_tb', ch.meta.tbR, 1); put('i_tb_f', ch.meta.tbR - 459.67, 1);
put('i_tc', ch.comp.tcR, 1); put('i_pc', ch.comp.pcPsia, 1);
put('i_omega', ch.comp.omega, 4);
put('i_omega_edm', edmisterOmega(ch.meta.tbR, ch.comp.tcR, ch.comp.pcPsia), 4);
put('i_shift', ch.comp.shift, 4); put('i_watson', ch.meta.watsonK, 2);
put('i_watson_sg_squared', Math.cbrt(ch.meta.tbR) / (PLUS.sg * PLUS.sg), 2);   // wrong: SG squared
put('i_bip_c1', ch.bip.C1, 4);
// mass fraction of the plus fraction (library molecular weights)
const mws = [...KEYS.map((k) => COMPONENTS[k].mw), PLUS.mw];
const mbar = Z.reduce((s, zi, i) => s + zi * mws[i], 0);
put('i_mbar', mbar, 2); put('i_c7_mass', Z[10] * PLUS.mw / mbar, 4);
// wrong shortcut: every light component weighed as methane
put('i_c7_mass_c1', Z[10] * PLUS.mw / (Z[10] * PLUS.mw + (1 - Z[10]) * COMPONENTS.C1.mw), 4);
// the untuned model against the study
const mix = mixtureWithPlusFraction(KEYS, PLUS);
const sat = saturationPressure(mix, Z, tR, {});
put('i_psat_u', sat.pPsia, 1); values.i_psat_kind = sat.kind; print.i_psat_kind = sat.kind;
put('i_psat_err_pct', pct(sat.pPsia, PB), 2);
put('i_psat_err_pct_psig', pct(sat.pPsia, PB_PSIG), 2);          // compared against the psig figure
const sepRes = separatorTrain(mix, Z, stages, { resTR: tR, resPPsia: PB });
put('i_gor_u', sepRes.totals.totalGor, 1); put('i_gor_err_pct', pct(sepRes.totals.totalGor, RS), 2);
put('i_sepgor_u', sepRes.totals.separatorGor, 1); put('i_tankgor_u', sepRes.totals.stockTankGor, 1);
put('i_api_u', sepRes.stockTank.api, 2); put('i_api_err', sepRes.stockTank.api - API, 2);
put('i_gasgrav_u', sepRes.totals.surfaceGasGravity, 3);
values.i_bo_at_lab_pb = sepRes.bo.multistage; print.i_bo_at_lab_pb = String(sepRes.bo.multistage);
values.i_res_phases = sepRes.bo.reservoirPhases; print.i_res_phases = String(sepRes.bo.reservoirPhases);
const sepAtSat = separatorTrain(mix, Z, stages, { resTR: tR, resPPsia: sat.pPsia * 1.001 });
put('i_bo_at_model_psat', sepAtSat.bo.multistage, 4);
put('i_bo_single', sepAtSat.bo.singleStage, 4); put('i_gor_single', sepAtSat.bo.singleStageGor, 1);
// separator pressure sweep: stock tank liquid and gravity against separator pressure
const sweep = [44.65, 129.65, 264.65, 514.65].map((p) => {
  const r = separatorTrain(mix, Z, [{ tR: degFtoR(SEP_T), pPsia: p }, { tR: degFtoR(SEP_T), pPsia: PSIG_BASE }]);
  return { p, gor: r.totals.totalGor, api: r.stockTank.api, sto: r.totals.stoVolFt3PerFeedMol };
});
sweep.forEach((s, i) => {
  put(`i_sw_p${i}`, s.p, 2); put(`i_sw_gor${i}`, s.gor, 1); put(`i_sw_api${i}`, s.api, 2);
});
const best = sweep.reduce((a, b) => (b.sto > a.sto ? b : a));
put('i_sw_best_p', best.p, 2);
// Amyx composite from the stated differential and separator data (the
// lesson's rule, applied to the report's printed numbers; the engine's
// eosBlackOilTable builds the same composite from the EOS, not from a report)
const amyxBo = BOD * BOFB / BODB;
const amyxRs = RS - (RSDB - RSD) * BOFB / BODB;
put('i_amyx_bo', amyxBo, 4); put('i_amyx_rs', amyxRs, 1);
put('i_amyx_ratio', BOFB / BODB, 4);
put('i_amyx_bo_inverted', BOD * BODB / BOFB, 4);                    // ratio upside down
put('i_amyx_rs_raw', RS - (RSDB - RSD), 1);                         // no shrinkage ratio
// correlations against the study (Standing on the measured summary)
put('i_st_pb_err_pct', pct(pbSt, PB), 2); put('i_st_bo_err_pct', pct(boSt, BOFB), 2);

// ============================================================ ADVANCED
put('a_kappa78', kappaPR78(ch.comp.omega), 4);
const w = ch.comp.omega;
put('a_kappa76', 0.37464 + w * (1.54226 - w * 0.26992), 4);      // the 1976 quadratic, not exported
const kW = wilsonK(mix, tR, P_FLASH);
put('a_wilson_c1', kW[2], 3); put('a_wilson_plus', kW[10], 6);
const f1500 = flashPT(mix, Z, tR, P_FLASH);
put('a_beta_flash', f1500.beta, 4); put('a_liq_frac_flash', 1 - f1500.beta, 4);
values.a_phases_flash = f1500.phases;
put('a_y_c1_flash', f1500.y[2], 4); put('a_x_c1_flash', f1500.x[2], 4); put('a_k_c1_flash', f1500.K[2], 3);
const f3500 = flashPT(mix, Z, tR, 3500);
values.a_phases_3500 = f3500.phases; print.a_phases_3500 = String(f3500.phases);
// volume shift cannot move the saturation pressure: same Psat with sPlus moved
const start = { fTc: 1, fPc: 1, kC1: ch.bip.C1, sPlus: ch.comp.shift };
const tgt = { psat: { tF: T_F, pPsia: PB } };
const ps0 = predictTargets({ keys: KEYS, plus: PLUS, z: Z }, tgt, start).psatPsia;
const psShift = predictTargets({ keys: KEYS, plus: PLUS, z: Z }, tgt, { ...start, sPlus: 0.25 }).psatPsia;
const psK = predictTargets({ keys: KEYS, plus: PLUS, z: Z }, tgt, { ...start, kC1: 0.10 }).psatPsia;
put('a_psat_s0', ps0, 1); put('a_psat_shift', psShift, 1); put('a_psat_kc1', psK, 1);
put('a_shift_test', 0.25, 2); put('a_kc1_test', 0.10, 2);
// the regression against all four measurements
const fit = tuneToLab({ keys: KEYS, plus: PLUS, z: Z }, {
  psat: { tF: T_F, pPsia: PB },
  separatorTest: { stagesF: STAGES_F, resTF: T_F, resPPsia: PB, totalGor: RS, stoApi: API, bo: BOFB },
});
values.a_converged = fit.converged; values.a_bounds_hit = fit.boundsHit;
put('a_ftc', fit.tuning.fTc, 4); put('a_fpc', fit.tuning.fPc, 4);
put('a_kc1', fit.tuning.kC1, 4); put('a_splus', fit.tuning.sPlus, 4);
put('a_splus0', fit.start.sPlus, 4); put('a_kc10', fit.start.kC1, 4);
put('a_splus_move_pct', pct(fit.tuning.sPlus, fit.start.sPlus), 1); put('a_kc1_move_pct', pct(fit.tuning.kC1, fit.start.kC1), 1);
put('a_ssr0', fit.ssr0, 6); put('a_ssr', fit.ssr, 6); put('a_ssr_ratio', fit.ssr0 / fit.ssr, 1);
const row = (n) => fit.report.find((r) => r.name === n);
for (const [n, d] of [['psat', 1], ['totalGor', 1], ['stoApi', 2], ['bo', 4]]) {
  put(`a_${n}_u`, row(n).untuned, d); put(`a_${n}_t`, row(n).tuned, d);
  put(`a_${n}_ue`, row(n).untunedErr, 2); put(`a_${n}_te`, row(n).tunedErr, 2);
}
values.a_worse = fit.report.filter((r) => Math.abs(r.tunedErr) > Math.abs(r.untunedErr)).map((r) => r.name);
print.a_worse = values.a_worse.join(',');
// screening quantities on the tuned model at 1500 psia (taught, never graded)
const tunedMix = tunedMixtureWithPlusFraction(KEYS, PLUS, fit.tuning);
const ft = flashPT(tunedMix, Z, tR, P_FLASH);
const liq = phaseProps(tunedMix, ft.x, tR, P_FLASH);
const vap = phaseProps(tunedMix, ft.y, tR, P_FLASH);
put('a_lbc_liq', lbcViscosity(tunedMix, ft.x, tR, liq).viscosityCp, 4);
put('a_ift', weinaugKatzIFT(tunedMix, ft.x, ft.y, liq, vap).iftDynPerCm, 3);
// the black-oil chain on the same oil at 1500 psia, for the comparison
put('a_bo_chain_flash', vasquezBeggsUndersaturatedOilViscosity(P_FLASH, PB,
  beggsRobinsonLiveOilViscosity(standingRs(P_FLASH, PB, GG, API, T_F), muod)), 4);

console.log(JSON.stringify({ inputs, values, print }));
