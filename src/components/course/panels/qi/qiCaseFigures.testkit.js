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
