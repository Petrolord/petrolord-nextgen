// W5c (section 3 pick A), mbal beginner: the ISAN tank.
//
// The Associate capstone graded the Ekene survey history, which the tank
// explorer opened on and every beginner lesson worked. It moves to the ISAN
// tank: a closed, undersaturated oil tank whose initial state and six surveys
// are stated in full in the brief and typed into the tank explorer's own-tank
// mode. The survey table is built here by the same closed-form inversion the
// Ekene fixture used (dp = Np / (N (co + efwSlope) - Np co); Bo = Boi (1 + co
// dp)), then ROUNDED to what the brief prints (pressure 0.1 psi, Np 1 stb, Bo
// 6 dp): the keys are regenerated from the rounded table, the numbers the
// learner types, by the engine through the panel lab (typedTankInputs,
// runTank). Nothing here computes a graded value itself.
import { typedTankInputs, runTank } from '../../../../src/components/course/panels/mbal/tankLab.js';

export const DESIGN = { N: 8.4e6, boi: 1.285, co: 1.5e-5, cf: 4.2e-6, cw: 3.2e-6, swi: 0.28, pi: 3650 };
export const NP = [0, 52000, 118000, 176000, 227000, 268000, 301000];

const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d;

export function surveyTable() {
  const { N, boi, co, cf, cw, swi } = DESIGN;
  const efwSlope = (boi * (cw * swi + cf)) / (1 - swi) / boi;
  return NP.map((np) => {
    const dp = np === 0 ? 0 : np / (N * (co + efwSlope) - np * co);
    return { p: round(DESIGN.pi - dp, 1), np, bo: round(boi * (1 + co * dp), 6) };
  });
}

export const ISAN = { pi: DESIGN.pi, swi: DESIGN.swi, cf: DESIGN.cf, cw: DESIGN.cw, rows: surveyTable() };

export function gradedKeys() {
  const { result, last } = runTank(typedTankInputs(ISAN));
  return {
    beginner: [
      { key: 'isan_f_last_rb', tol: 50, unit: 'rb', label: 'ISAN underground withdrawal F at the last survey', expected: last.F_rb },
      { key: 'isan_et_last_rb', tol: 5e-05, unit: 'rb/stb', label: 'ISAN total expansion Et at the last survey', expected: last.Et_rb },
      { key: 'isan_ooip_stb', tol: 20000, unit: 'stb', label: 'ISAN OOIP from the Havlena-Odeh slope', expected: result.estimated_ooip_stb },
      { key: 'isan_efw_share_pct', tol: 0.2, unit: '%', label: 'ISAN Efw share of Et at the last survey', expected: last.efwShare * 100 },
      { key: 'isan_ddi_final', tol: 0.005, unit: '-', label: 'ISAN depletion drive index at the last survey', expected: result.final_ddi },
      { key: 'isan_eo_last_rb_stb', tol: 5e-05, unit: 'rb/stb', label: 'ISAN oil expansion Eo at the last survey', expected: last.Eo_rb_stb },
    ],
  };
}
