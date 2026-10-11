// THE QI EXPERT CAPSTONE FIELDS (DELSHOLM), computed from the case file's
// content through the Expert teaching lab (qiLabExp.js), the functions the
// inversion and prospect explorers call. Each field names the engine call that
// returns it and the engines pull request its grader waits on.
//
// NOT YET GRADED. No Expert field is in gradedTolerance.js. A field is wired
// into the grader only once its engine passes the extraction gate (a golden
// and an independent oracle):
//   delsholm_lfm_lnai_b   engines/qi/lfm.js lfmTrace               WAITS ON E1c (gap G5)
//   delsholm_mb_ai        engines/qi/inversion.js modelBased       open today
//   delsholm_sim_vpvs     engines/qi/prestackInversion.js          open today
//                         simultaneousInversion
//   delsholm_phi_q90      engines/qi/propertyPrediction.js         open today
//                         fitLinearTransform + predictWithInterval
//   delsholm_p_oil        engines/qi/propertyPrediction.js         open today
//                         fitFaciesModel + faciesPosterior
//   delsholm_column_ft    lib/gridding/closure.js spillAnalysis    open today
// The low-frequency models the two inversions use are SUPPLIED in the case
// (traceA.lowFrequencyModels), so neither inversion field depends on lfm.js,
// and the LFM field is read at a different position (positionB) so the
// supplied models cannot hand it over.
//
// TOLERANCE PROPOSAL (a proposal only; gradedTolerance.js is the one place a
// tolerance is made, and it carries none of these yet):
//   closed-form fields (delsholm_phi_q90, delsholm_p_oil, delsholm_column_ft,
//     delsholm_lfm_lnai_b): the house printed floor, 5e-7 (six decimals).
//   iterative fields (delsholm_mb_ai, delsholm_sim_vpvs): the engine at the
//     stated iteration count is deterministic arithmetic with no Math.sin,
//     Math.cos or random draw in the loop (only Math.exp at the end of
//     modelBased, an ulp apart at most across browsers), so a learner who
//     pastes the case reproduces it to far below the floor. The measured
//     engine-against-oracle agreement in the vendored goldens is: post-stack
//     modelBased against pylops' regularised least squares, max |ln AI
//     difference| below 1e-6 (qi.inversion.test.js, 2000 iterations);
//     simultaneous against pylops, max |ln difference| below 2e-4 (3000
//     iterations, qi.prestackInversion.test.js). This script also measures the
//     case's own convergence: the change in the field between the stated
//     iteration count and four times it (printed by --json as convergence).
//     PROPOSED: tolerance = max(5e-7 printed floor, 10 x the measured case
//     convergence change, the oracle ln agreement x the field value x 10 for
//     the property it maps to). For delsholm_mb_ai that is 1e-6 x AI x 10;
//     for delsholm_sim_vpvs it is 2e-4 x Vp/Vs x 10. The safety factor of 10
//     is stated, and discriminate must then show every wrong method (no LFM,
//     the wrong wavelet, the wrong angle convention) missing by more than it.
//
//   node qi_capstone_e.mjs           print the fields
//   node qi_capstone_e.mjs --json    the same as JSON
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { register } from 'node:module';

register('./qi_loader.mjs', import.meta.url);
const { LABE: E, REPO } = await import('./qi_engine_e.mjs');

const CASE = path.join(REPO, 'src/content/capstone-cases/qi/delsholm_case.json');
const must = (x, what) => { if (!x || x.error) throw new Error(`${what}: ${x && x.error}`); return x; };

export function expertFields(c, { itersScale = 1 } = {}) {
  const st = c.stated;
  const P = must(E.caseExpert(c), 'case');
  const lfmB = must(E.lfmAt(P.lfm, P.B, P.win, { power: st.lfm.power }), 'lfm at B');
  const A = P.A;
  const mb = must(E.modelBasedOn({ d: A.full, wavelet: A.fullWavelet, m0: A.lowFrequencyModels.lnAi, eps: st.modelBased.eps, iters: st.modelBased.iters * itersScale }), 'model-based');
  const sim = must(E.simultaneousOn({
    traces: A.angleTraces, thetaDeg: A.angles_deg, wavelets: A.angleWavelets, vsVp: A.backgroundVsVp,
    m0: A.lowFrequencyModels, eps: st.simultaneous.eps, iters: st.simultaneous.iters * itersScale,
  }), 'simultaneous');
  const kA = st.modelBased.sampleA; const kS = st.simultaneous.sampleA;
  const por = must(E.porosityTransform(P.porositySamples, [st.porosity.atAi], st.porosity.level), 'porosity');
  const fac = must(E.faciesModel(P.faciesSamples, { attrs: ['ai'], kind: st.facies.kind, at: [[st.facies.atAi]] }), 'facies');
  const oilIdx = fac.model.classes.findIndex((k) => k.name === st.facies.class);
  const clo = must(E.closureOf(P.grid), 'closure');
  if (clo.limitedByEdge) throw new Error('the case trap is limited by the map edge');
  return [
    { tier: 'advanced', key: 'delsholm_lfm_lnai_b', cls: 'ratio', value: lfmB[st.lfm.sampleB], call: 'lfmTrace', waitsOn: 'E1c (G5)' },
    { tier: 'advanced', key: 'delsholm_mb_ai', cls: 'impedance', value: mb.ai[kA], call: 'modelBased ai', waitsOn: null },
    { tier: 'advanced', key: 'delsholm_sim_vpvs', cls: 'ratio', value: Math.exp(sim.lnAi[kS] - sim.lnSi[kS]), call: 'simultaneousInversion exp(lnAi - lnSi)', waitsOn: null },
    { tier: 'advanced', key: 'delsholm_phi_q90', cls: 'fraction', value: por.predictions[0].hi, call: 'fitLinearTransform + predictWithInterval hi (level 0.8)', waitsOn: null },
    { tier: 'advanced', key: 'delsholm_p_oil', cls: 'probability', value: fac.posteriors[0].probs[oilIdx], call: 'fitFaciesModel + faciesPosterior', waitsOn: null },
    { tier: 'advanced', key: 'delsholm_column_ft', cls: 'depth', value: clo.columnFt, call: 'spillAnalysis crest.z - spillZ', waitsOn: null },
  ];
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const c = JSON.parse(fs.readFileSync(CASE, 'utf8'));
  const rows = expertFields(c);
  const long = expertFields(c, { itersScale: 4 });
  rows.forEach((r, i) => { r.convergence = Math.abs(long[i].value - r.value); });
  for (const r of rows) if (!Number.isFinite(r.value)) throw new Error(`${r.key} is not finite`);
  if (process.argv.includes('--json')) process.stdout.write(`${JSON.stringify(rows)}\n`);
  else for (const r of rows) console.log(`${r.key.padEnd(22)} ${String(r.value).padEnd(22)} conv ${r.convergence.toExponential(2).padEnd(10)} ${r.call}${r.waitsOn ? `  [waits on ${r.waitsOn}]` : ''}`);
}
