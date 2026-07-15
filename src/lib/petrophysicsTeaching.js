// Petrophysics teaching workflow — drives the central @petrolord/engines
// petrophysics engine over the bundled typewell teaching dataset. The
// engine is consumed as-is (git-subtree at packages/engines); this module
// only orchestrates it for Learning Mode. The net-pay summaries it
// produces are auto-graded server-side against the validation goldens
// (academy_submit_capstone).
import { phiDensity } from '@petrolord/engines/engines/petrophysics/porosity.js';
import { vshFromGr } from '@petrolord/engines/engines/petrophysics/vsh.js';
import { swArchie } from '@petrolord/engines/engines/petrophysics/sw.js';
import { netPay } from '@petrolord/engines/engines/petrophysics/netpay.js';
import typewell from '@petrolord/engines/test-data/petrophysics/typewell.json';

export const TYPEWELL = typewell;

// Parameters the dataset provides as "given" petrophysical constants,
// pre-filled but editable so the learner owns the interpretation.
export function defaultParams() {
  const p = typewell.params;
  return {
    rhoMa: p.rho_ma, rhoFl: p.rho_fl,          // porosity (density)
    grClean: p.gr_clean, grClay: p.gr_clay,    // Vsh (from GR)
    vshMethod: 'larionov-tertiary',
    rw: p.rw, a: p.a, m: p.m, n: p.n,          // Archie Sw
    cutPhi: p.cut_phi, cutVsh: p.cut_vsh, cutSw: p.cut_sw,
  };
}

export const ZONES = typewell.params.zones; // { SAND_A: [top,base], SAND_B: [top,base] }

// Run the full VSH → PHI → SW → net-pay workflow with the learner's
// parameters. Returns per-depth curves and the two zone summaries.
export function computeWorkflow(params) {
  const c = typewell.curves;
  const depth = c.DEPT;
  const phi = c.RHOB.map((r) => phiDensity(r, Number(params.rhoMa), Number(params.rhoFl)));
  const vsh = Array.from(vshFromGr(c.GR, {
    grClean: Number(params.grClean),
    grClay: Number(params.grClay),
    method: params.vshMethod,
  }));
  const sw = depth.map((_, i) =>
    swArchie(c.RT[i], phi[i], Number(params.rw), Number(params.a), Number(params.m), Number(params.n)));

  const opts = {
    cutPhi: Number(params.cutPhi),
    cutVsh: Number(params.cutVsh),
    cutSw: Number(params.cutSw),
  };
  const zoneSummary = (name) => {
    const [top, base] = ZONES[name];
    return netPay({ depth, phi, vsh, sw }, { ...opts, top, base }).summary;
  };

  return {
    depth,
    curves: { GR: c.GR, RHOB: c.RHOB, RT: c.RT, phi, vsh, sw },
    zones: { SAND_A: zoneSummary('SAND_A'), SAND_B: zoneSummary('SAND_B') },
  };
}

// Map the workflow result to the capstone answer fields.
export function capstoneAnswers(result) {
  return {
    sand_a_net_m: result.zones.SAND_A.net_m,
    sand_a_phi_avg: result.zones.SAND_A.phi_avg,
    sand_a_sw_avg: result.zones.SAND_A.sw_avg,
    sand_b_net_m: result.zones.SAND_B.net_m,
    sand_b_phi_avg: result.zones.SAND_B.phi_avg,
    sand_b_sw_avg: result.zones.SAND_B.sw_avg,
  };
}

// Downsample a curve for charting (the log has ~hundreds of samples).
export function chartRows(depth, curves, step = 2) {
  const rows = [];
  for (let i = 0; i < depth.length; i += step) {
    rows.push({
      depth: depth[i],
      GR: curves.GR[i],
      RHOB: curves.RHOB[i],
      RT: curves.RT[i],
      phi: Number.isFinite(curves.phi[i]) ? +curves.phi[i].toFixed(4) : null,
      vsh: Number.isFinite(curves.vsh[i]) ? +curves.vsh[i].toFixed(4) : null,
      sw: Number.isFinite(curves.sw[i]) ? +curves.sw[i].toFixed(4) : null,
    });
  }
  return rows;
}
