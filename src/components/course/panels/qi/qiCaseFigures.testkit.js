// TEST SUPPORT ONLY (imported by the QI panel suites, never by a panel): the
// six Associate figures of a capstone case, computed through the teaching lab
// with the case file's own stated choices, exactly as the wave's
// qi_capstone.mjs computes them, and the resolver for the wave inputs.
//
// The panel capstone guard lists this file as a test support file, so it is
// not swept as learner-visible source; it holds no number of its own.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as L from './qiLab.js';
import * as P from './qiLabPro.js';
import * as X from './qiLabExp.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '../../../../..');

const must = (x, what) => { if (!x || x.error) throw new Error(`${what}: ${x && x.error}`); return x; };

export const readCaseText = (name) => fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/qi/${name}_case.json`), 'utf8');

/** The six Associate figures of a case, keyed as gradedTolerance keys them for TAMBERLO. */
export function associateFigures(c, prefix = 'tamberlo') {
  const st = c.stated;
  const T = must(L.caseTraces(c), 'traces');
  const W = must(L.caseWell(c), 'well');
  const fluids = must(L.fluidsAt(c.conditions), 'fluids');
  const spec = must(L.spectrum(T.traces, T.dtMs, { taper: st.taper }), 'spectrum');
  const trend = must(L.shearTrend(must(L.zoneSamples(W, 'water', { vshCut: st.netSandVshCut }), 'water'), { form: st.shearForm }), 'trend');
  const sub = must(L.substituteSample(must(L.sampleAt(W, st.substitutionSampleFt), 'sample'), fluids, { toSw: 1 }), 'substitution');
  const shale = must(L.layerMeans(L.zoneSamples(W, 'shale', { shaleAboveFt: st.shaleAboveFt })), 'shale');
  const oil = must(L.layerMeans(L.zoneSamples(W, 'oil', { vshCut: st.netSandVshCut })), 'oil');
  const ab = must(L.interfaceAB(shale, oil), 'interface');
  const wt = must(L.wetTrend(W, fluids, { blockFt: st.trendBlockFt }), 'wet trend');
  return {
    [`${prefix}_low6_hz`]: spec.low6Hz,
    [`${prefix}_centroid_hz`]: spec.centroidHz,
    [`${prefix}_shear_slope`]: trend.coef[1],
    [`${prefix}_ai_brine`]: sub.aiAfter,
    [`${prefix}_vpvs_brine`]: sub.vpvsAfter,
    [`${prefix}_wet_distance`]: L.distance(ab.a, ab.b, wt.line.slope),
  };
}

/**
 * The six Professional figures of a prestack case (QUARVIN), computed through
 * the Professional lab with the case file's own stated choices, as the wave's
 * qi_capstone_p.mjs computes them. None is graded yet (their engines wait on
 * the extraction gate), so these feed the capstone guard only. The one scale
 * is QI Studio app code (compareAtWells) until the engines carry it; the guard
 * computes the same least-squares scale, sum(observed x modelled) over
 * sum(modelled squared) on A and B, here, to have it to search for.
 */
export function professionalFigures(c, prefix = 'quarvin') {
  const st = c.stated;
  const table = { tMs: c.velocity.rows.map((x) => x[0]), vrms: c.velocity.rows.map((x) => x[1]) };
  const g = { traces: c.gather.traces, offsets: c.gather.offsets_m, dtMs: c.gather.dt_ms, t0Ms: c.gather.t0_ms };
  const vint = must(P.dix(table), 'dix');
  const li = table.tMs.indexOf(st.dixLayer.toMs);
  const v = must(P.velocityAt(table, st.timeMs), 'velocity');
  const ag = must(P.angles(g, table, { edges: st.angleEdges }), 'angles');
  const i = Math.round((st.targetMs - g.t0Ms) / g.dtMs);
  const fit = P.shueyFit(st.stackAngles, ag.gather.map((b) => b[i]), { terms: st.shueyTerms });
  let so = 0; let sm = 0;
  for (const w of c.wells) for (const k of ['A', 'B']) { so += w.observed[k] * w.modelled[k]; sm += w.modelled[k] * w.modelled[k]; }
  return {
    [`${prefix}_dix_vint`]: vint[li],
    [`${prefix}_walden_deg`]: P.walden(st.offsetM, st.timeMs, v.vrms, v.vint),
    [`${prefix}_nmo_stretch`]: P.stretch(st.offsetM, st.timeMs, v.vrms),
    [`${prefix}_far_stack_amp`]: P.stackOf(ag, st.farBins[0], st.farBins[1])[i],
    [`${prefix}_shuey_a`]: fit.A,
    [`${prefix}_one_scale`]: so / sm,
  };
}

/**
 * The six Expert figures of an Expert case (DELSHOLM), computed through the
 * Expert lab with the case file's own stated choices, as the wave's
 * qi_capstone_e.mjs computes them. None is graded yet (gradedTolerance holds
 * none), so these feed the capstone guard only.
 */
export function expertFigures(c, prefix = 'delsholm') {
  const st = c.stated;
  const D = must(X.caseExpert(c), 'case');
  const A = D.A;
  const lfm = must(X.lfmAt(D.lfm, D.B, D.win, { power: st.lfm.power }), 'lfm');
  const mb = must(X.modelBasedOn({ d: A.full, wavelet: A.fullWavelet, m0: A.lowFrequencyModels.lnAi, eps: st.modelBased.eps, iters: st.modelBased.iters }), 'model-based');
  const sim = must(X.simultaneousOn({ traces: A.angleTraces, thetaDeg: A.angles_deg, wavelets: A.angleWavelets, vsVp: A.backgroundVsVp, m0: A.lowFrequencyModels, eps: st.simultaneous.eps, iters: st.simultaneous.iters }), 'simultaneous');
  const por = must(X.porosityTransform(D.porositySamples, [st.porosity.atAi], st.porosity.level), 'porosity');
  const fac = must(X.faciesModel(D.faciesSamples, { attrs: ['ai'], kind: st.facies.kind, at: [[st.facies.atAi]] }), 'facies');
  const clo = must(X.closureOf(D.grid), 'closure');
  const k = st.simultaneous.sampleA;
  return {
    [`${prefix}_lfm_lnai_b`]: lfm[st.lfm.sampleB],
    [`${prefix}_mb_ai`]: mb.ai[st.modelBased.sampleA],
    [`${prefix}_sim_vpvs`]: Math.exp(sim.lnAi[k] - sim.lnSi[k]),
    [`${prefix}_phi_q90`]: por.predictions[0].hi,
    [`${prefix}_p_oil`]: fac.posteriors[0].probs[fac.model.classes.findIndex((m) => m.name === st.facies.class)],
    [`${prefix}_column_ft`]: clo.columnFt,
  };
}

/**
 * A QI wave input (digest.txt, fields.json): the committed mirror under
 * tools/course-waves/qi when it is registered, else the live wave directory
 * named by NEXTGEN_WAVE_DIR_QI or NEXTGEN_WAVE_DIR. Returns { path, from } or
 * { missing } with the reason; a caller that needs the file fails on missing.
 */
export async function qiWaveInput(file) {
  try {
    const { waveInput } = await import('../../../../../tools/course-waves/waveInputs.mjs');
    const p = waveInput('qi', file);
    return { path: p, from: 'the committed mirror (or its override)' };
  } catch (e) {
    const dir = process.env.NEXTGEN_WAVE_DIR_QI || process.env.NEXTGEN_WAVE_DIR;
    if (dir && fs.existsSync(path.join(dir, file))) return { path: path.join(dir, file), from: `the live wave directory ${dir} (no committed mirror yet)` };
    return { missing: `no committed mirror for qi yet (${e.message.slice(0, 120)}) and no NEXTGEN_WAVE_DIR_QI holding ${file}` };
  }
}
