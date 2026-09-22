// Shared math for the petrophysics teaching panels: thin, pure helpers
// over @petrolord/engines and the bundled typewell. Panels own the UI;
// everything computable lives here so the vitest suite can pin the
// panel math to the engine oracles without a DOM.
import typewell from '@petrolord/engines/test-data/petrophysics/typewell.json';
import {
  phiDensity, phiSonicWyllie, phiSonicRhg, phiNd,
} from '@petrolord/engines/engines/petrophysics/porosity.js';
import { vshFromGr } from '@petrolord/engines/engines/petrophysics/vsh.js';
import { swArchie, swSimandoux, swIndonesia } from '@petrolord/engines/engines/petrophysics/sw.js';
import { netPay } from '@petrolord/engines/engines/petrophysics/netpay.js';
import { pickettFitDepthWindow, pickettIsoSwLine } from '@petrolord/engines/engines/petrophysics/crossplot.js';
import { rwArps, spK, rweFromSsp } from '@petrolord/engines/engines/petrophysics/rw.js';

export const TW = typewell.params;
export const CURVES = typewell.curves;
export const DEPTH = typewell.curves.DEPT;
export const ZONES = typewell.params.zones;
export const WATER_LEG = typewell.params.water_leg;

// A WELL is { name, DEPTH, CURVES, ZONES, WATER_LEG }: the bundled typewell by
// default, or a LAS file the learner opened (the capstone case wells), with the
// zones and water leg the brief states. Every helper below takes one, so the
// panels run the same engine calls on whichever well is open. The constants
// (TW: matrix, fluid, Archie, cutoffs) are the course's givens on every well.
export const TYPEWELL = { name: 'typewell', DEPTH, CURVES, ZONES, WATER_LEG };

// A well from a parsed LAS file (engines/welldata/lasParse), with the zone and
// water-leg depths typed by the learner. Curves are matched by mnemonic.
export function wellFromLas(parsed, { name, zones, waterLeg }) {
  const byName = Object.fromEntries(parsed.curves.map((c) => [String(c.mnemonic).toUpperCase(), c]));
  const need = ['GR', 'RHOB', 'NPHI', 'DT', 'RT'];
  const missing = need.filter((k) => !byName[k]);
  if (missing.length) throw new Error(`The file has no ${missing.join(', ')} curve.`);
  const arr = (c) => Array.from(c.data, (v) => (Number.isFinite(v) ? v : NaN));
  const depth = arr(parsed.curves[0]);
  const curves = { DEPT: depth };
  need.forEach((k) => { curves[k] = arr(byName[k]); });
  return { name, DEPTH: depth, CURVES: curves, ZONES: zones, WATER_LEG: waterLeg };
}

export { rwArps, spK, rweFromSsp };

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export function zoneMean(arr, [top, base], well = TYPEWELL) {
  const DEPTH = well.DEPTH;
  let s = 0;
  let n = 0;
  for (let i = 0; i < DEPTH.length; i++) {
    if (DEPTH[i] < top || DEPTH[i] > base) continue;
    if (!Number.isFinite(arr[i])) continue;
    s += arr[i]; n += 1;
  }
  return n ? s / n : NaN;
}

export function sampleIndexAt(depth, well = TYPEWELL) {
  const i = well.DEPTH.findIndex((d) => d >= depth);
  return i === -1 ? well.DEPTH.length - 1 : i;
}

// The intermediate course's Vsh convention: linear IGR, clamped.
export function vshLinearCurve(grClean, grClay, well = TYPEWELL) {
  return well.CURVES.GR.map((g) => clamp01((g - grClean) / (grClay - grClean)));
}

// The Associate booking recipe's Vsh: Larionov tertiary on the givens.
export function vshLarionovCurve(well = TYPEWELL) {
  return Array.from(vshFromGr(well.CURVES.GR, {
    grClean: TW.gr_clean, grClay: TW.gr_clay, method: 'larionov-tertiary',
  }));
}

// All four porosity families from learner-set constants.
export function porosityCurves({ rhoMa, rhoFl, dtMa, dtFl, ndMethod = 'avg' }, well = TYPEWELL) {
  const CURVES = well.CURVES;
  const phiD = CURVES.RHOB.map((r) => phiDensity(r, rhoMa, rhoFl));
  const phiW = CURVES.DT.map((d) => phiSonicWyllie(d, dtMa, dtFl));
  const phiRhg = CURVES.DT.map((d) => phiSonicRhg(d, dtMa));
  const phiNdArr = phiD.map((pd, i) => phiNd(pd, CURVES.NPHI[i], ndMethod));
  return { phiD, phiW, phiRhg, phiNdArr };
}

// Saturation curve for one model over a given porosity/Vsh pair.
export function swCurve({ method, phi, vsh, rw, rsh, a, m, n }, well = TYPEWELL) {
  return well.CURVES.RT.map((rt, i) => {
    if (method === 'simandoux') return swSimandoux(rt, phi[i], rw, vsh[i], rsh, a, m);
    if (method === 'indonesia') return swIndonesia(rt, phi[i], rw, vsh[i], rsh, a, m, n);
    return swArchie(rt, phi[i], rw, a, m, n);
  });
}

export function fitPickett(phi, top, base, well = TYPEWELL) {
  return pickettFitDepthWindow(well.DEPTH, phi, well.CURVES.RT, top, base);
}

// Iso-Sw line endpoints in (phi, rt) orientation for the explorer's
// phi-on-x Pickett axes (the engine reports x = Rt, y = phi).
export function isoSwSegment(sw, { aRw, m, n }, phiMin, phiMax) {
  const line = pickettIsoSwLine(sw, { a: 1, m, n, rw: aRw }, phiMin, phiMax);
  return line.pts.map((p) => ({ phi: p.y, rt: p.x }));
}

// The Expert booking: the Associate recipe (density porosity, Larionov
// tertiary Vsh, Archie Sw, given cutoffs) with ONLY Rw learner-chosen,
// so the panel isolates what Rw does to booked pay.
export function bookSandA(rw, well = TYPEWELL) {
  const { DEPTH, CURVES, ZONES } = well;
  const phiD = CURVES.RHOB.map((r) => phiDensity(r, TW.rho_ma, TW.rho_fl));
  const vsh = vshLarionovCurve(well);
  const sw = DEPTH.map((_, i) => swArchie(CURVES.RT[i], phiD[i], rw, TW.a, TW.m, TW.n));
  return netPay({ depth: DEPTH, phi: phiD, vsh, sw }, {
    cutPhi: TW.cut_phi, cutVsh: TW.cut_vsh, cutSw: TW.cut_sw,
    top: ZONES.SAND_A[0], base: ZONES.SAND_A[1],
  }).summary;
}

// Water-leg validation: mean Archie Sw on neutron-density porosity over
// the leg with a learner-chosen Rw. A validated Rw reads ~1 here.
export function waterLegMeanSw(rw, well = TYPEWELL) {
  const { DEPTH, CURVES, WATER_LEG } = well;
  const phiD = CURVES.RHOB.map((r) => phiDensity(r, TW.rho_ma, TW.rho_fl));
  const phiN = phiD.map((pd, i) => phiNd(pd, CURVES.NPHI[i], 'avg'));
  let s = 0;
  let n = 0;
  for (let i = 0; i < DEPTH.length; i++) {
    if (DEPTH[i] < WATER_LEG[0] || DEPTH[i] > WATER_LEG[1]) continue;
    const sw = swArchie(CURVES.RT[i], phiN[i], rw, TW.a, TW.m, TW.n);
    if (!Number.isFinite(sw)) continue;
    s += sw; n += 1;
  }
  return n ? s / n : NaN;
}

export const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');
export const num = (s) => {
  const v = Number(s);
  return s === '' || s === null || !Number.isFinite(v) ? NaN : v;
};
