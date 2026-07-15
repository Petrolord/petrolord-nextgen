// Petrophysics teaching workflow — drives the central @petrolord/engines
// petrophysics engine over the bundled typewell teaching dataset. The
// engine is consumed as-is (git-subtree at packages/engines); this module
// only orchestrates it for Learning Mode. The net-pay summaries it
// produces are auto-graded server-side against the validation goldens
// (academy_submit_capstone).
import { phiDensity, phiSonicWyllie, phiNd } from '@petrolord/engines/engines/petrophysics/porosity.js';
import { vshFromGr } from '@petrolord/engines/engines/petrophysics/vsh.js';
import { swArchie, swSimandoux, swIndonesia } from '@petrolord/engines/engines/petrophysics/sw.js';
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

// ---- Intermediate tier (NG6): multi-method porosity, Pickett, shaly-
// sand saturation. All engine calls; parameters are the typewell givens.
// Oracle-reproduced in Node before the NG6 migration was seeded.
import { pickettFitDepthWindow } from '@petrolord/engines/engines/petrophysics/crossplot.js';

// ---- Advanced tier (NG7): Rw triangulation. The lab sample corrected
// with Arps, the SP quicklook, and the NG6 Pickett fit all converge on
// the typewell's own Rw = 0.05; then SAND_A is booked with the
// corrected and the raw Rw to show what the wrong Rw does to pay.
// Oracle-reproduced in Node before the NG7 migration was seeded.
import { rwArps, spK, rweFromSsp } from '@petrolord/engines/engines/petrophysics/rw.js';

export const ADVANCED_GIVENS = {
  rwSample: 0.114, tSampleF: 75, tFmF: 180,   // the lab water sample
  sspMv: -93, rmfe: 0.62,                     // the SP quicklook reading
};

export function computeAdvanced() {
  const c = typewell.curves;
  const p = typewell.params;
  const g = ADVANCED_GIVENS;
  const rwA = rwArps(g.rwSample, g.tSampleF, g.tFmF);
  const k = spK(g.tFmF);
  const rwe = rweFromSsp(g.sspMv, g.rmfe, g.tFmF);

  const phiD = c.RHOB.map((r) => phiDensity(r, p.rho_ma, p.rho_fl));
  const phiND = phiD.map((pd, i) => phiNd(pd, c.NPHI[i], 'avg'));
  const swWl = [];
  for (let i = 0; i < c.DEPT.length; i++) {
    if (c.DEPT[i] < p.water_leg[0] || c.DEPT[i] > p.water_leg[1]) continue;
    const s = swArchie(c.RT[i], phiND[i], rwA, p.a, p.m, p.n);
    if (Number.isFinite(s)) swWl.push(s);
  }

  const vsh = Array.from(vshFromGr(c.GR, {
    grClean: p.gr_clean, grClay: p.gr_clay, method: 'larionov-tertiary',
  }));
  const book = (rw) => {
    const sw = c.DEPT.map((_, i) => swArchie(c.RT[i], phiD[i], rw, p.a, p.m, p.n));
    return netPay({ depth: c.DEPT, phi: phiD, vsh, sw }, {
      cutPhi: p.cut_phi, cutVsh: p.cut_vsh, cutSw: p.cut_sw,
      top: p.zones.SAND_A[0], base: p.zones.SAND_A[1],
    }).summary;
  };
  return {
    givens: g,
    rwArps: rwA,
    spK: k,
    rweSsp: rwe,
    swWaterlegMean: swWl.reduce((a, b) => a + b, 0) / swWl.length,
    corrected: book(rwA),
    uncorrected: book(g.rwSample),
  };
}

export function computeIntermediate() {
  const c = typewell.curves;
  const p = typewell.params;
  const zone = p.zones.SAND_A;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const vshLin = c.GR.map((g) => clamp01((g - p.gr_clean) / (p.gr_clay - p.gr_clean)));
  const phiD = c.RHOB.map((r) => phiDensity(r, p.rho_ma, p.rho_fl));
  const phiW = c.DT.map((d) => phiSonicWyllie(d, p.dt_ma, p.dt_fl));
  const phiND = phiD.map((pd, i) => phiNd(pd, c.NPHI[i], 'avg'));
  const swSim = c.RT.map((rt, i) => swSimandoux(rt, phiND[i], p.rw, vshLin[i], p.rsh, p.a, p.m));
  const swInd = c.RT.map((rt, i) => swIndonesia(rt, phiND[i], p.rw, vshLin[i], p.rsh, p.a, p.m, p.n));
  const pickett = pickettFitDepthWindow(c.DEPT, phiND, c.RT, p.water_leg[0], p.water_leg[1]);
  const zoneMean = (arr) => {
    let s = 0;
    let n = 0;
    for (let i = 0; i < c.DEPT.length; i++) {
      if (c.DEPT[i] < zone[0] || c.DEPT[i] > zone[1]) continue;
      if (!Number.isFinite(arr[i])) continue;
      s += arr[i]; n += 1;
    }
    return s / n;
  };
  return {
    waterLeg: p.water_leg,
    pickett,
    phindAvgSandA: zoneMean(phiND),
    phiwAvgSandA: zoneMean(phiW),
    swSimSandA: zoneMean(swSim),
    swIndSandA: zoneMean(swInd),
    swArchieSandA: zoneMean(c.RT.map((rt, i) => {
      const phi = phiND[i];
      return Number.isFinite(phi) && phi > 0 ? Math.min(1, Math.pow((p.a * p.rw) / (Math.pow(phi, p.m) * rt), 1 / p.n)) : NaN;
    })),
  };
}
