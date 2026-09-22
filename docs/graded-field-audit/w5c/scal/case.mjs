// W5c (section 3 pick A), scal beginner: the OKORO sand displacement case.
//
// The Associate capstone moves off the Ekene design (which the panels open on
// and every lesson works) to the OKORO sand, stated in full in the brief. The
// learner types it into the displacement explorer's "your case" mode. The six
// keys are regenerated here through the panel lab functions
// (displacementCase, btDaysFor), which call the vendored fractional-flow
// engine; nothing here computes a graded value itself.
import { displacementCase, btDaysFor } from '../../../../src/components/course/panels/scal/scalLab.js';

export const OKORO = {
  Swc: 0.22, Sor: 0.27, krwMax: 0.34, kroMax: 0.78, nw: 2.7, no: 2.2,
  muW: 0.48, muO: 2.9, pvBbl: 9650000, iw: 7200,
};

export function gradedKeys() {
  const r = displacementCase(OKORO);
  return {
    beginner: [
      { key: 'okoro_m_ratio', tol: 0.005, unit: '-', label: 'OKORO endpoint mobility ratio M', expected: r.M },
      { key: 'okoro_swf', tol: 0.0005, unit: 'fraction', label: 'OKORO Welge front saturation Swf', expected: r.bl.Swf },
      { key: 'okoro_fwf', tol: 0.001, unit: 'fraction', label: 'OKORO fractional flow at the front', expected: r.bl.fwf },
      { key: 'okoro_qi_bt_pv', tol: 0.001, unit: 'PV', label: 'OKORO pore volumes injected at breakthrough', expected: r.bl.QiBt },
      { key: 'okoro_ed_bt', tol: 0.001, unit: 'fraction', label: 'OKORO displacement efficiency at breakthrough', expected: r.bl.EDbt },
      { key: 'okoro_bt_days', tol: 2, unit: 'days', label: 'OKORO days to breakthrough at 7200 bwpd', expected: btDaysFor(r.bl.QiBt, OKORO.pvBbl, OKORO.iw) },
    ],
  };
}
