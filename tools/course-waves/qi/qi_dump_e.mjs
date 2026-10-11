// THE EXPERT SECTIONS OF THE QI TEACHING DIGEST (sections 42 to 59).
// Printed from the Expert teaching lab's own return values (qiLabExp.js,
// through qi_engine_e.mjs), on the Ekene teaching pack and the Ekene Sand top
// grid. Two pieces of QI Studio app code are run for comparison, through the
// loader's '@suite/' alias, and labelled as app code where they print:
// inversionRun.waveletScale and propertyRun.calibrateProperty, plus the
// Seismolord well-wavelet extraction whose refusal section 52 quotes.
import { f6, whole, table, section, refusal } from './qi_digest_kit.mjs';
import { LABE as E } from './qi_engine_e.mjs';
import * as INV from '@petrolord/engines/engines/qi/inversion.js';
import * as SPR from '@petrolord/engines/engines/qi/inversionSpread.js';
import * as PSI from '@petrolord/engines/engines/qi/prestackInversion.js';
import * as PP from '@petrolord/engines/engines/qi/propertyPrediction.js';
import * as LFM from '@petrolord/engines/engines/qi/lfm.js';
import * as PA from '@petrolord/engines/engines/qi/prospectAssessment.js';
import * as CL from '@petrolord/engines/lib/gridding/closure.js';
import { mulberry32 } from '@petrolord/engines/lib/stats/stats.js';
import { waveletScale as suiteWaveletScale } from '@suite/pages/apps/QIStudio/services/inversionRun.js';
import { calibrateProperty } from '@suite/pages/apps/QIStudio/services/propertyRun.js';
import { extractWellWavelet } from '@suite/pages/apps/Seismolord/lib/wellWavelet.js';

const X = E.EXPERT;
const fin = Number.isFinite;
const fv = (x) => (fin(x) ? f6(x) : 'NaN');
const ms = (S, i) => S.win.t0Ms + i * S.win.dtMs;
const ft = (m) => f6(m / 0.3048);
const covered = (log) => log.lnAi.map((v, i) => (fin(v) ? i : -1)).filter((i) => i >= 0);
const scoreRow = (s) => (s.error ? [s.error, '', ''] : [f6(s.corr), f6(s.rmsPct), whole(s.n)]);

export const SUITE_FILES_E = {
  inversionRun: 'src/pages/apps/QIStudio/services/inversionRun.js',
  propertyRun: 'src/pages/apps/QIStudio/services/propertyRun.js',
  wellWavelet: 'src/pages/apps/Seismolord/lib/wellWavelet.js',
};

export function sectionsE(ctx) {
  const out = [];
  const S = E.ekeneSetup();
  if (S.error) throw new Error(S.error);
  const E1 = S.logs.find((l) => l.name === 'Ekene-1');
  const sc = ctx.suiteCommit.slice(0, 9);

  /* ------------------------------------------------------------ 42 */
  out.push(section(42, 'What the Expert tier adds, and the settings it states', 'Expert m01 l01', `
THE EXPERT QUESTION. From the seismic to impedance, from impedance to properties, and from properties to a prospect and a report. The Associate tier asked whether the seismic can see the fluid; the Professional tier tied the wells and read AVO; this tier inverts, predicts and decides what QI can and cannot say.

THE ENGINES AND THEIR GATE (the extraction gate: a golden plus an independent oracle in the engines repository):

${table(['engine', 'what it computes', 'gate'], [
    ['engines/qi/inversion.js', 'the forward model, model-based, blocky, sparse-spike and coloured inversion, the low-frequency model of one log', 'golden and oracle (pylops)'],
    ['engines/qi/inversionSpread.js', 'quantiles across realisations, the relative spread, seeded noise', 'golden and oracle'],
    ['engines/qi/prestackInversion.js', "Fatti's coefficients, the prestack forward model, simultaneous inversion", 'golden and oracle (pylops)'],
    ['engines/qi/propertyPrediction.js', 'the linear transform and its interval, Bayesian facies, the confusion matrix', 'golden and oracle'],
    ['lib/gridding/closure.js', 'crest, spill point, closure and gross rock volume', 'golden and oracle'],
    ['engines/qi/lfm.js', 'the low-frequency model between wells, the blind-well score', 'awaiting its oracle; taught, never graded until it lands'],
    ['engines/qi/prospectAssessment.js', 'anomaly conformance, evidence independence, the assessment', 'awaiting its oracle; taught, never graded until it lands'],
  ])}

THE SETTINGS THE TIER STATES ON THE EKENE PACK (each a stated input; QI Studio's own defaults where it has one):

${table(['setting', 'value'], [
    ['inversion window on the well traces, ms', `${whole(X.windowMs[0])} to ${whole(X.windowMs[1])} (${whole(S.win.ns)} samples every ${f6(S.win.dtMs)} ms)`],
    ['wavelet', `a zero-phase Ricker of ${whole(X.waveletHz)} Hz, half length ${whole(X.waveletHalfMs)} ms (${whole(S.raw.length)} samples)`],
    ['low-frequency cut of the LFM, Hz', whole(X.lfmHz)],
    ['high cut of the log a result is scored against, Hz', whole(X.truthHz)],
    ['regularisation weight eps', f6(X.eps)],
    ['iterations', whole(X.iters)],
    ['blocky: epsTV, outer loops', `${f6(X.epsTV)}, ${whole(X.outer)}`],
    ['sparse-spike lambda', f6(X.lambda)],
    ['inverse distance power', whole(X.idwPower)],
    ['coloured band, Hz', `${whole(X.band[0])} to ${whole(X.band[1])}`],
    ['angle of each stack, degrees', `near ${whole(X.angles.near)}, mid ${whole(X.angles.mid)}, far ${whole(X.angles.far)}`],
  ])}

THE WELLS IN TIME. Each pack well's logs go to two-way time on its checkshots (linear between levels) and onto the trace clock by the engine's \`resampleToDt\`; the pack's logs cover the Ekene Sand and the shale above it, so only part of the window carries a log:

${table(['well', 'log samples in the window', 'first logged time ms', 'last logged time ms', 'top Ekene Sand ms', 'base Ekene Sand ms'], S.logs.map((l) => {
    const c = covered(l);
    return [l.name, whole(c.length), f6(ms(S, c[0])), f6(ms(S, c[c.length - 1])), f6(l.horizonsMs[0]), f6(l.horizonsMs[1])];
  }))}`));

  /* ------------------------------------------------------------ 43 */
  const rng = mulberry32(42);
  const xv = Array.from({ length: S.win.ns }, () => rng() - 0.5);
  const yv = Array.from({ length: S.win.ns }, () => rng() - 0.5);
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const lhsD = dot(INV.diffCentred(xv), yv); const rhsD = dot(xv, INV.diffCentredAdjoint(yv));
  const lhsC = dot(INV.convolveCentred(xv, S.wavelet), yv); const rhsC = dot(xv, INV.convolveCentredAdjoint(yv, S.wavelet));
  const fill = E1.lnAi.map((v, i, a) => (fin(v) ? v : NaN));
  const firstI = covered(E1)[0]; const lastI = covered(E1).at(-1);
  const held = fill.map((v, i) => (fin(v) ? v : (i < firstI ? fill[firstI] : fill[lastI])));
  const syn = INV.forwardPoststack(held, S.wavelet);
  const tr1 = E.wellTrace('Ekene-1');
  const iTop = Math.round((E1.horizonsMs[0] - S.win.t0Ms) / S.win.dtMs);
  const synRows = [-4, -2, 0, 2, 4, 6].map((d) => iTop + d).map((i) => [f6(ms(S, i)), f6(held[i]), f6(syn[i]), f6(tr1[i])]);
  const cSyn = E.corrOf(syn.slice(firstI, lastI + 1), tr1.slice(firstI, lastI + 1));
  out.push(section(43, 'The convolutional model and its adjoint', 'Expert m01 l02', `
THE MODEL (forwardPoststack, the operator of pylops' PoststackLinearModelling, kind centred). The unknown is m = ln(AI) on the trace clock; D is the centred first difference, (D m)_i = (m_(i+1) - m_(i-1)) / 2, zero at the first and last sample; C is the centred convolution with the wavelet (offset the floor of half its length). The seismic trace is d = C D m. Half the difference of ln(AI) is close to the reflection coefficient for small contrasts, which is why the model is written in ln(AI).

THE ADJOINT. Every solver here needs the transpose of the operator. The test of an adjoint is the dot product: for any x and y, (C x) . y equals x . (C^T y). On two seeded vectors of ${whole(S.win.ns)} samples (mulberry32 seed 42):

${table(['operator', '(A x) . y', 'x . (A^T y)', 'difference'], [
    ['centred difference D', f6(lhsD), f6(rhsD), f6(lhsD - rhsD)],
    ['centred convolution C with the scaled wavelet', f6(lhsC), f6(rhsC), f6(lhsC - rhsC)],
  ])}

AT EKENE-1. The ln(AI) log in time, held at its first and last values beyond the logged samples, through the scaled wavelet (section 45), against the full-stack trace at the well, round the top of the Ekene Sand (${f6(E1.horizonsMs[0])} ms):

${table(['time ms', 'ln(AI) log', 'synthetic', 'full-stack trace'], synRows)}

Over the logged samples the synthetic and the trace correlate at ${f6(cSyn.corr)} (${whole(cSyn.n)} samples).`));

  /* ------------------------------------------------------------ 44 */
  const lfmRows = S.logs.map((l) => {
    const at = { x: l.x, y: l.y, horizons: l.horizonsMs };
    const blind = E.lfmAt(S.lfm, at, S.win, { exclude: l.name });
    const kept = E.lfmAt(S.lfm, at, S.win);
    const t = E.truthOf(l);
    const sB = LFM.blindWellScore(blind, t); const sK = LFM.blindWellScore(kept, t);
    return [l.name, f6(blind[iTop]), f6(kept[iTop]), f6(sB.rmsPct), f6(sK.rmsPct)];
  });
  const others = S.lfm.filter((w) => w.name !== 'Ekene-1');
  const wts = others.map((w) => { const d = Math.hypot(w.x - E1.x, w.y - E1.y); return [w.name, f6(d), f6(1 / d ** X.idwPower)]; });
  const wsum = others.reduce((s, w) => s + 1 / Math.hypot(w.x - E1.x, w.y - E1.y) ** X.idwPower, 0);
  const mapT = [E1.horizonsMs[0] - 8, E1.horizonsMs[0], (E1.horizonsMs[0] + E1.horizonsMs[1]) / 2, E1.horizonsMs[1] + 8];
  const e2 = S.logs.find((l) => l.name === 'Ekene-2');
  const mapRows = mapT.map((t) => [f6(t), f6(LFM.mapToWellTime(t, E1.horizonsMs, e2.horizonsMs))]);
  out.push(section(44, 'The low-frequency model from wells and horizons', 'Expert m01 l03 and Expert m02 l04', `
WHY IT IS NEEDED. The seismic band holds no trend: a band-limited trace says how impedance changes, never its level. The low-frequency model (LFM) supplies what the seismic lacks below about ${whole(X.lfmHz)} Hz, from the wells.

HOW IT IS BUILT (lfm.js; THIS ENGINE AWAITS ITS INDEPENDENT ORACLE, engines PR E1c: the course teaches it and grades nothing through it until that lands). Each well's ln(AI) in time is low-passed by a moving average whose half window is round(1000 / (cut x dt) / 2) samples (${whole(E.halfWindowFor(X.lfmHz, S.win.dtMs))} samples here, lowFrequencyModel), then carried to a trace by inverse distance weighting with power ${whole(X.idwPower)}. Between two horizons a sample keeps its proportional position (mapToWellTime), so a layer that thickens or dips between wells keeps its impedance; above the first horizon and below the last the time offset from that horizon is kept. Samples no well covers hold the nearest covered value.

THE PROPORTIONAL POSITION, the Ekene-1 trace's times mapped to Ekene-2's horizons (top and base Ekene Sand):

${table(['time at Ekene-1 ms', 'the same position at Ekene-2 ms'], mapRows)}

THE WEIGHTS at Ekene-1 with Ekene-1 left out (distance in metres in the kit's projection): ${wts.map((w) => `${w[0]} distance ${w[1]}, weight ${w[2]}`).join('; ')}. Each weight is the inverse square of the distance; the sum is ${f6(wsum)} and each well's share is its weight over that sum.

AT EACH WELL, the LFM ln(AI) at the sample of the top of Ekene-1's sand (${f6(ms(S, iTop))} ms), with the well left out and kept in, and the RMS error in AI of the LFM alone against the well's log after the ${whole(X.truthHz)} Hz high cut (blindWellScore, over the logged samples):

${table(['well', 'LFM ln(AI), well left out', 'LFM ln(AI), well kept', 'LFM-only AI error percent, left out', 'LFM-only AI error percent, kept'], lfmRows)}`));

  /* ------------------------------------------------------------ 45 */
  const pairs = S.logs.map((l) => ({ trace: E.wellTrace(l.name), lnAi: l.lnAi }));
  const suite = suiteWaveletScale(pairs, S.raw);
  out.push(section(45, 'The wavelet scale', 'Expert m01 l04', `
THE PROBLEM. A wavelet extracted or chosen for its shape carries an arbitrary amplitude, and the inversion reads impedance contrast from the ratio of the trace to the synthetic. The scale is set at the wells: the one number s that makes s times the forward model of the logs match the seismic best, by least squares pooled over every well sample whose wavelet span the log covers.

THE EKENE SCALE. The ${whole(X.waveletHz)} Hz Ricker (peak amplitude ${f6(Math.max(...S.raw))}) against the full stack at the four pack wells: scale ${f6(S.scale)} over ${whole(S.scaleSamples)} samples; the scaled wavelet's peak is ${f6(Math.max(...S.wavelet))}.

THE SAME BY QI STUDIO'S OWN CODE. \`waveletScale\` in ${SUITE_FILES_E.inversionRun} (APP CODE, petrolord-suite ${sc}; it is not one of the extraction-gated engines) on the same pairs returns ${f6(suite.scale)} over ${whole(suite.samples)} samples.

A REFUSAL BY THE SAME RULE. QI Studio refuses to scale when the wells overlap fewer than ten usable samples of seismic: "${refusal(() => suiteWaveletScale([{ trace: [1, 2, 3], lnAi: [15, 15.1, 15.2] }], S.raw))}"`));

  /* ------------------------------------------------------------ 46 */
  const mb = E.invertAt(S, 'Ekene-1', { exclude: true });
  const kA = covered(E1);
  const truth1 = E.truthOf(E1);
  const mbRows = [-2, 0, 2, 4, 6].map((d) => iTop + d).map((i) => [f6(ms(S, i)), f6(Math.exp(truth1[i])), f6(Math.exp(mb.m0[i])), f6(mb.ai[i])]);
  const itRows = [20, 60, 120, 300].map((it) => {
    const r = E.invertAt(S, 'Ekene-1', { exclude: true, iters: it });
    const s = LFM.blindWellScore(r.m, truth1);
    return [whole(it), whole(r.iterations), f6(r.residualRms), f6(s.corr), f6(s.rmsPct)];
  });
  const epsRows = [0.05, 1, 5].map((eps) => {
    const r = E.invertAt(S, 'Ekene-1', { exclude: true, eps, iters: 300 });
    const s = LFM.blindWellScore(r.m, truth1);
    return [f6(eps), f6(r.residualRms), f6(s.corr), f6(s.rmsPct)];
  });
  out.push(section(46, 'Model-based least squares', 'Expert m02 l01', `
THE PROBLEM (modelBased). Minimise ||C D m - d||^2 + eps^2 ||m - m0||^2 by conjugate gradients on the normal equations (CGLS), starting from the LFM m0, for the stated number of iterations or until the gradient falls to 1e-10 of its first value. eps pulls the result towards the LFM. The output is ln(AI) and AI = exp(ln(AI)).

EKENE-1, the well left out of its own LFM (a blind inversion at the well), eps ${f6(X.eps)}, ${whole(X.iters)} iterations: ${whole(mb.iterations)} iterations run, residual RMS ${f6(mb.residualRms)} (trace units). Round the top of the Ekene Sand:

${table(['time ms', 'log AI after the high cut', 'LFM AI', 'inverted AI'], mbRows)}

THE ITERATION COUNT IS A STATED CHOICE, and here it is also the regularisation. The same blind inversion at four counts (eps ${f6(X.eps)}), scored against the log after the high cut:

${table(['iterations asked', 'iterations run', 'residual RMS', 'correlation with the log', 'AI error percent'], itRows)}

THE WEIGHT AT 300 ITERATIONS:

${table(['eps', 'residual RMS', 'correlation with the log', 'AI error percent'], epsRows)}

Read the two tables together: the residual keeps falling with more iterations while the error at the well rises, because the solver fits the trace beyond what the stated wavelet and the scale can explain. A smaller residual is no better inversion; the blind well is the check (section 49).`));

  /* ------------------------------------------------------------ 47 */
  const sp = E.invertAt(S, 'Ekene-1', { method: 'sparse_spike', exclude: true, iters: X.iters });
  const bl = E.invertAt(S, 'Ekene-1', { method: 'blocky', exclude: true });
  const fr = E.reflectivityOf({ d: tr1, wavelet: S.wavelet, lambda: X.lambda, iters: X.iters });
  const nz = Array.from(fr.r).filter((v) => v !== 0).length;
  const lamRows = [0.0005, 0.002, 0.008].map((lam) => { const r = E.reflectivityOf({ d: tr1, wavelet: S.wavelet, lambda: lam, iters: X.iters }); return [f6(lam), whole(Array.from(r.r).filter((v) => v !== 0).length)]; });
  const sMB = LFM.blindWellScore(mb.m, truth1); const sSP = LFM.blindWellScore(sp.m, truth1); const sBL = LFM.blindWellScore(bl.m, truth1);
  out.push(section(47, 'Blocky and sparse-spike inversion', 'Expert m02 l02', `
BLOCKY (modelBased with blocky). Adds an iteratively reweighted total variation term, epsTV^2 sum of w_i (m_(i+1) - m_i)^2 with w_i = 1 / sqrt((m_(i+1) - m_i)^2 + beta^2), re-solved over the stated outer loops (beta 0.001 by default), so few large steps cost less than many small ones.

SPARSE-SPIKE (sparseSpike). FISTA (Beck and Teboulle 2009) solves min 1/2 ||C r - d||^2 + lambda ||r||_1 for a sparse reflectivity r (fistaReflectivity); r is integrated to a relative ln(AI) (m_(i+1) = m_(i-1) + 2 r_i, each of the two interleaved chains levelled to its mean), and the low frequencies come from the LFM through a moving-average crossover at ${whole(X.lfmHz)} Hz.

THE SPARSITY IS SET BY LAMBDA. Non-zero reflectivity samples in the ${whole(S.win.ns)}-sample Ekene-1 trace, ${whole(X.iters)} iterations:

${table(['lambda', 'non-zero samples'], lamRows)}

At the stated lambda ${f6(X.lambda)} there are ${whole(nz)}.

THREE METHODS AT EKENE-1, each blind (the well left out of its LFM), scored against the log after the high cut:

${table(['method', 'correlation', 'AI error percent', 'samples'], [
    ['model-based', ...scoreRow(sMB)], ['model-based, blocky', ...scoreRow(sBL)], ['sparse-spike', ...scoreRow(sSP)],
  ])}`));

  /* ------------------------------------------------------------ 48 */
  const co = E.colouredAt(S);
  if (co.error) throw new Error(co.error);
  const colRows = co.out.map((o) => {
    const l = S.logs.find((x) => x.name === o.name);
    const hi = E.lowPassFinite(l.lnAi, E.halfWindowFor(X.truthHz, S.win.dtMs));
    const lo = E.lowPassFinite(l.lnAi, E.halfWindowFor(X.band[0], S.win.dtMs));
    const rel = hi.map((v, i) => v - lo[i]);
    const c = E.corrOf(o.rel, rel);
    return [o.name, f6(co.slopes.find((s) => s.name === o.name).alpha), f6(c.corr), whole(c.n)];
  });
  out.push(section(48, 'Coloured inversion', 'Expert m02 l03', `
THE METHOD (Lancaster and Whitcombe 2000; impedanceSpectrumSlope, colouredOperator, applyColoured). One operator for every trace: its amplitude spectrum turns the seismic's average spectrum into the wells' impedance spectrum, a power law f^alpha fitted to the logs (log-log least squares over 5 to 80 Hz), inside the stated band with cosine tapers 5 Hz wide, and its phase is minus 90 degrees. No wavelet and no LFM: the output is RELATIVE impedance, band-limited, with no level.

EKENE. The slope from each pack well's AI log in time (the logged samples only) and the mean the operator uses, alpha ${f6(co.alpha)}, transform length ${whole(co.N)}. Scored by correlation alone against the log band-passed between ${whole(X.band[0])} and ${whole(X.truthHz)} Hz (relative impedance has no level to compare), over the logged samples:

${table(['well', 'alpha from its log', 'correlation with the band-passed log', 'samples'], colRows)}

The logs here are short (the pack covers the Ekene Sand and the shale above it), so each slope rests on few frequencies; that is why the four slopes differ.`));

  /* ------------------------------------------------------------ 49 */
  const bt = E.blindTable(S);
  const btS = E.blindTable(S, 'sparse_spike');
  out.push(section(49, 'Blind wells', 'Expert m02 l04 and Expert m03 l04', `
THE CHECK. Each well is inverted with the LFM built from the OTHER wells, and scored against its own log after the ${whole(X.truthHz)} Hz high cut (blindWellScore: the correlation of AI with the log's AI, and the RMS of the relative AI error in percent, over samples where both exist). Beside it the same well with itself in the LFM, and the LFM alone: the share of the match that comes from the LFM is then visible. The same rule as QI Studio's blind-well table.

MODEL-BASED (eps ${f6(X.eps)}, ${whole(X.iters)} iterations):

${table(['well', 'blind correlation', 'blind AI error percent', 'samples', 'kept-in correlation', 'kept-in AI error percent', 'LFM-only correlation', 'LFM-only AI error percent'], bt.map((r) => [r.name, f6(r.blind.corr), f6(r.blind.rmsPct), whole(r.blind.n), f6(r.withWell.corr), f6(r.withWell.rmsPct), f6(r.lfmOnly.corr), f6(r.lfmOnly.rmsPct)]))}

SPARSE-SPIKE, blind:

${table(['well', 'blind correlation', 'blind AI error percent'], btS.map((r) => [r.name, f6(r.blind.corr), f6(r.blind.rmsPct)]))}

The LFM alone has a small error and a negative correlation: it has the level and none of the shape. The inversion adds the shape the seismic carries.`));

  /* ------------------------------------------------------------ 50 */
  const sprd = E.spreadAt(S, 'Ekene-1');
  const spRows = [-2, 0, 2, 4].map((d) => iTop + d).map((i) => [f6(ms(S, i)), f6(sprd.q10[i]), f6(sprd.q50[i]), f6(sprd.q90[i]), f6(sprd.spread[i])]);
  const meanSpread = kA.reduce((s, i) => s + sprd.spread[i], 0) / kA.length;
  out.push(section(50, 'Sensitivity across realisations', 'Expert m02 l05', `
THE METHOD (inversionSpread.js). Realisations that differ in one assumption each, here the noise: the Ekene-1 full-stack trace plus seeded Gaussian noise at a signal-to-noise ratio of ${whole(X.noiseSnr)} (addNoise: RMS of the trace over the noise standard deviation), on the ${whole(X.seeds.length)} seeds ${whole(X.seeds[0])} to ${whole(X.seeds[X.seeds.length - 1])}, each inverted blind exactly as section 46. Per sample, the quantiles across the realisations (quantilesAcross: linear interpolation between order statistics, Hyndman and Fan type 7) and the relative spread (Q90 - Q10) / Q50 (relativeSpread).

THE LABELS (the Suite's percentile convention for parameters, PT10): Q10 is the 10th percentile, the value 10 percent of realisations fall below, so it is the LOW figure; Q50 the median; Q90 the 90th percentile, the HIGH figure. P-labels are kept for outcomes such as volumes, where P90 is the low figure.

EKENE-1, ${whole(sprd.realisations)} realisations, AI:

${table(['time ms', 'Q10 AI', 'Q50 AI', 'Q90 AI', 'relative spread'], spRows)}

Mean relative spread over the ${whole(kA.length)} logged samples: ${f6(meanSpread)}. The spread is an estimate on stated seeds and a stated noise level; a different set of seeds gives different figures.`));

  /* ------------------------------------------------------------ 51 */
  const M = E.ekeneSimSetup(S);
  if (M.error) throw new Error(M.error);
  const G = PSI.fattiCoefficients([0, 10, 20, 30, 40], M.vsVp);
  out.push(section(51, "Fatti's three parameters", 'Expert m03 l01', `
THE LINEARISATION (Fatti and others 1994; fattiCoefficients). R(theta) = G1 dln(AI) + G2 dln(SI) + G3 dln(rho), with G1 = (1 + tan^2 theta) / 2, G2 = -4 K^2 sin^2 theta, G3 = (4 K^2 sin^2 theta - tan^2 theta) / 2 and K the background Vs/Vp. The simultaneous inversion (simultaneousInversion, pylops' PrestackLinearModelling with the Fatti linearisation, kind centred) solves for ln(AI), ln(SI) and ln(rho) together by CGLS, each pulled to its own LFM by its own weight.

THE EKENE BACKGROUND Vs/Vp: the mean of Vs / Vp over every logged sample of the four pack wells in the window, ${f6(M.vsVp)}. The coefficients at that K:

${table(['angle degrees', 'G1 (AI)', 'G2 (SI)', 'G3 (density)'], G.map((g, i) => [whole([0, 10, 20, 30, 40][i]), f6(g[0]), f6(g[1]), f6(g[2])]))}

At normal incidence only AI contributes. G3 stays small at every angle in the table, and it changes sign between 30 and 40 degrees at this K: density is the parameter the angles see least.`));

  /* ------------------------------------------------------------ 52 */
  const sw = refusal(() => extractWellWavelet(Float64Array.from(E1.lnAi.map((v, i, a) => (fin(v) && fin(a[i - 1]) ? 0.5 * (v - a[i - 1]) : NaN))), tr1, { halfLength: 15 }));
  out.push(section(52, 'Angle-dependent wavelets', 'Expert m03 l02', `
WHY EACH ANGLE HAS ITS OWN. A far-angle stack carries less high frequency and a different amplitude scale than a near one, so the simultaneous inversion takes one wavelet per angle stack.

THE EKENE SETTING. The same ${whole(X.waveletHz)} Hz Ricker shape for every stack, scaled per stack by least squares of the Fatti synthetic of the logs (unit wavelet amplitude, the stack's angle) against that stack at the four wells (lab \`fattiScale\`):

${table(['stack', 'angle degrees', 'scale', 'samples'], M.stacks.map((k, i) => [k, whole(M.angles[i]), f6(M.scales[i].scale), whole(M.scales[i].samples)]))}

QI STUDIO extracts a wavelet per angle at every well by least squares against that well's reflectivity, then aligns and averages them across the wells (angleWavelets, APP CODE). On the pack's short logs that extraction refuses: Seismolord's well-wavelet extraction (${SUITE_FILES_E.wellWavelet}, petrolord-suite ${sc}) with its default 31-sample wavelet at Ekene-1 says "${sw}" The course therefore states the shape and scales it per stack.`));

  /* ------------------------------------------------------------ 53 */
  const simAll = S.logs.map((l) => ({ l, full: E.simAt(S, M, l.name, { exclude: true }), near: E.simAt(S, M, l.name, { exclude: true, stacks: ['near'] }), nm: E.simAt(S, M, l.name, { exclude: true, stacks: ['near', 'mid'] }) }));
  const r1 = simAll.find((x) => x.l.name === 'Ekene-1');
  const sc3 = (res) => E.scoreSim(res, r1.l);
  out.push(section(53, 'Why density needs the far angles', 'Expert m03 l03', `
THE EXPERIMENT. Ekene-1, blind, simultaneous inversion with eps ${X.simEps.map(f6).join(', ')} and ${whole(X.iters)} iterations, from three sets of stacks; each parameter scored against the well's log after the high cut (correlation; RMS of the relative error in percent of AI, Vp/Vs and density):

${table(['stacks used', 'AI correlation', 'AI error percent', 'Vp/Vs correlation', 'Vp/Vs error percent', 'density correlation', 'density error percent'], [
    ['near only', ...((s) => [f6(s.ai.corr), f6(s.ai.rmsPct), f6(s.vpvs.corr), f6(s.vpvs.rmsPct), f6(s.rho.corr), f6(s.rho.rmsPct)])(sc3(r1.near))],
    ['near and mid', ...((s) => [f6(s.ai.corr), f6(s.ai.rmsPct), f6(s.vpvs.corr), f6(s.vpvs.rmsPct), f6(s.rho.corr), f6(s.rho.rmsPct)])(sc3(r1.nm))],
    ['near, mid and far', ...((s) => [f6(s.ai.corr), f6(s.ai.rmsPct), f6(s.vpvs.corr), f6(s.vpvs.rmsPct), f6(s.rho.corr), f6(s.rho.rmsPct)])(sc3(r1.full))],
  ])}

AI is held by the near angles alone. With the near stack only, density stays close to its LFM (a small error and no shape of its own), because G3 is tiny at ${whole(X.angles.near)} degrees (section 51). The far stack here reaches ${whole(X.angles.far)} degrees, still short of where G3 grows, so the density result stays the least reliable of the three at every stack set in this table.`));

  /* ------------------------------------------------------------ 54 */
  out.push(section(54, 'Blind wells per parameter', 'Expert m03 l04', `
EVERY PACK WELL, blind, near, mid and far stacks, scored per parameter:

${table(['well', 'AI correlation', 'AI error percent', 'Vp/Vs correlation', 'Vp/Vs error percent', 'density correlation', 'density error percent'], simAll.map(({ l, full }) => {
    const s = E.scoreSim(full, l);
    return [l.name, f6(s.ai.corr), f6(s.ai.rmsPct), f6(s.vpvs.corr), f6(s.vpvs.rmsPct), f6(s.rho.corr), f6(s.rho.rmsPct)];
  }))}

AI correlates well at every well; Vp/Vs and density do not, and each is reported for what it is. A study quotes the blind figure for each parameter it uses.`));

  /* ------------------------------------------------------------ 55 */
  const logS = E.logScaleSamples();
  const sand = logS.filter((s) => s.facies !== 'shale');
  const aiAt = [6.5e6, 7e6, 7.5e6, 8.5e6];
  const pt = E.porosityTransform(sand, aiAt);
  const lvl90 = E.porosityTransform(sand, [7e6], 0.9);
  const loS = sand.reduce((m, s) => Math.min(m, s.ai), Infinity); const hiS = sand.reduce((m, s) => Math.max(m, s.ai), -Infinity);
  ctx.ptE = pt;
  out.push(section(55, 'A linear transform and its interval', 'Expert m04 l01', `
THE TRANSFORM (fitLinearTransform). Porosity = a + b AI by least squares, with n, the residual standard error s on n - 2 degrees of freedom and R squared. THE INTERVAL (predictWithInterval) of a new observation at AI x0: y +/- t s sqrt(1 + 1/n + (x0 - mean)^2 / Sxx), t Student's quantile; the 80 percent interval gives Q10 (its low end) and Q90 (its high end).

EKENE, AT LOG SCALE: the net sand samples of the Ekene Sand in the four pack wells, both legs (${whole(sand.length)} samples; AI from Vp x density in kg/(m2 s), the kit's PHIT): a ${f6(pt.fit.a)}, b ${f6(pt.fit.b * 1e6)} per 10^6 kg/(m2 s), s ${f6(pt.fit.s)}, R squared ${f6(pt.fit.r2)}, mean AI ${f6(pt.fit.xMean)}. The calibration AI runs from ${f6(loS)} to ${f6(hiS)}.

${table(['AI kg/(m2 s)', 'predicted porosity', 'Q10 (low end, 80 percent)', 'Q90 (high end, 80 percent)'], pt.predictions.map((p) => [f6(p.ai), f6(p.y), f6(p.lo), f6(p.hi)]))}

The last row lies outside the calibration range: the engine still answers, and its interval widens only by the distance term. At the 90 percent level and AI 7000000 the interval is ${f6(lvl90.predictions[0].lo)} to ${f6(lvl90.predictions[0].hi)}.`));

  /* ------------------------------------------------------------ 56 */
  const blindAi = S.logs.map((l) => E.invertAt(S, l.name, { exclude: true }).ai);
  const pr = {
    kind: 'porosity', upscaleHz: X.truthHz,
    wells: S.logs.map((l, k) => ({
      name: l.name, il: k, xl: 0,
      ln_ai: Array.from(l.lnAi, (v) => (fin(v) ? v : null)),
      target: Array.from(l.phit, (v, i) => { const t = ms(S, i); return fin(v) && t >= l.horizonsMs[0] && t <= l.horizonsMs[1] ? v : null; }),
    })),
  };
  const cal = calibrateProperty({ pr, aiTraces: blindAi.map((a) => Array.from(a)), dtMs: S.win.dtMs });
  out.push(section(56, 'Left-out wells and the widened band', 'Expert m04 l02', `
THE CHECK (QI Studio's calibrateProperty in ${SUITE_FILES_E.propertyRun}, APP CODE, petrolord-suite ${sc}; it calls the extraction-gated engine propertyPrediction.js). At seismic scale: each well's ln(AI) and porosity in time are low-passed at ${whole(X.truthHz)} Hz, the transform is fitted to the wells, then each well is left out, the transform refitted on the others, and porosity predicted from the BLIND INVERTED AI at that well (section 49). The left-out residuals carry the inversion's error, which a log-against-log fit cannot see, so their pooled RMS widens the band: s_extra = sqrt(RMS^2 - s^2) when the RMS exceeds s. Each well's coverage is tested with the other wells' residuals only.

EKENE, the porosity of each well inside its Ekene Sand times:

${table(['quantity', 'value'], [
    ['a', f6(cal.summary.a)], ['b, per 10^6 kg/(m2 s)', f6(cal.summary.b * 1e6)], ['n (upscaled samples)', whole(cal.summary.n)],
    ['s, the log-against-log residual error', f6(cal.summary.s)], ['pooled left-out RMS', f6(cal.summary.sLoo)], ['s_extra, the widening', f6(cal.summary.sExtra)],
  ])}

A correlation over too few samples with no spread prints as NaN, which is the engine's own result.

${table(['well left out', 'samples', 'RMS porosity error', 'bias', 'correlation', 'share inside the widened 80 percent band'], cal.rows.map((r) => (r.error ? [r.name, r.error, '', '', '', ''] : [r.name, whole(r.n), fv(r.rms), fv(r.bias), fv(r.corr), fv(r.coverage)])))}`));

  /* ------------------------------------------------------------ 57 */
  const counts = {}; for (const s of logS) counts[s.facies] = (counts[s.facies] || 0) + 1;
  const at1 = [6.0e6, 6.6e6, 7.2e6, 7.8e6];
  const fm1 = E.faciesModel(logS, { at: at1.map((v) => [v]) });
  const at2 = [[6.6e6, 1.75], [6.6e6, 2.0]];
  const fm2 = E.faciesModel(logS, { attrs: ['ai', 'vpvs'], at: at2 });
  const fmEq = E.faciesModel(logS, { priors: { shale: 1, 'oil sand': 1, 'brine sand': 1 }, at: [[6.6e6]] });
  const names = fm1.model.classes.map((c) => c.name);
  const conf = (cm) => cm.names.map((n, i) => [n, ...cm.counts[i].map(whole)]);
  out.push(section(57, 'Bayesian facies on impedance, two attributes, and the confusion matrix', 'Expert m04 l03 and Expert m04 l04 and Expert m04 l05', `
THE METHOD (fitFaciesModel, faciesPosterior, confusionMatrix; Avseth and others 2005, chapter 4). A Gaussian density per facies in attribute space from labelled samples, priors from the samples' proportions unless stated, and the posterior probability of each facies at a point with the most likely one. The Facies course teaches Bayesian classification as a subject; this tier applies it to impedance.

EKENE, AT LOG SCALE, the four pack wells: oil sand (net sand of the Ekene Sand above the contact), brine sand (net sand at or below it) and shale (Vsh above the cut-off anywhere in the window); net sand outside the Ekene Sand is left out. Samples: ${names.map((n) => `${n} ${whole(counts[n])}`).join(', ')}.

ONE ATTRIBUTE, AI:

${table(['facies', 'samples', 'prior', 'mean AI', 'standard deviation of AI'], fm1.model.classes.map((c) => [c.name, whole(c.n), f6(c.prior), f6(c.mean[0]), f6(Math.sqrt(c.cov[0][0]))]))}

${table(['AI', ...names.map((n) => `P(${n})`), 'most likely'], fm1.posteriors.map((p, i) => [f6(at1[i]), ...p.probs.map(f6), names[p.best]]))}

With equal priors at AI 6600000: ${names.map((n, i) => `P(${n}) ${f6(fmEq.posteriors[0].probs[i])}`).join(', ')}. The prior is a stated choice and it moves the answer.

The confusion matrix of the one-attribute model on its own samples (rows the true facies, columns the predicted, in the order ${names.join(', ')}), share correct ${f6(fm1.confusion.accuracy)}:

${table(['true facies', ...names], conf(fm1.confusion))}

TWO ATTRIBUTES, AI AND Vp/Vs: share correct ${f6(fm2.confusion.accuracy)}.

${table(['true facies', ...names], conf(fm2.confusion))}

${table(['AI', 'Vp/Vs', ...names.map((n) => `P(${n})`)], fm2.posteriors.map((p, i) => [f6(at2[i][0]), f6(at2[i][1]), ...p.probs.map(f6)]))}

A FLUID HYPOTHESIS. A facies named for a fluid (oil sand, brine sand) is a hypothesis about the pore fluid; QI Studio labels such a class fluid_hypothesis and every other class calibrated_prediction. On AI alone most oil-sand samples are called brine sand; adding Vp/Vs separates them.`));

  /* ------------------------------------------------------------ 58 */
  const g = E.gridFt();
  const clo = E.closureOf(g, { levels: 4 });
  if (clo.error) throw new Error(clo.error);
  const owcFt = -1560 / 0.3048;
  const atOwc = CL.closureAt(clo.spill, g.spec, owcFt);
  const live = Array.from(g.z).filter((v) => Math.abs(v) < 1e29).length;
  const maskA = E.maskAbove(g, clo.spillZ);
  const xMid = g.spec.x0 + Math.floor(g.spec.nx / 2) * g.spec.dx;
  const maskB = E.maskCut(g, clo.spillZ - 20, xMid);
  const cA = E.conformanceOf(g, maskA, clo.spill);
  const cB = E.conformanceOf(g, maskB, clo.spill);
  const cfRow = (label, c) => (c.error ? [label, c.error, '', '', '', '', ''] : [label, whole(c.anomalyNodes), whole(c.edgeNodes), fin(c.conformance) ? f6(c.conformance) : 'NaN', f6(c.insideClosure), fin(c.impliedContactZ) ? f6(c.impliedContactZ) : 'NaN', fin(c.edgeSdM) ? f6(c.edgeSdM) : 'NaN']);
  const ev = PA.evidenceIndependence([
    { name: 'full-stack RMS amplitude', source: 'full_stack' },
    { name: 'impedance from the full stack', source: 'full_stack' },
    { name: 'far-stack brightening', source: 'far_stack' },
  ]);
  const asmt = [
    ['anomaly present, conformance 0.83, inside 0.9, two independent sources, feasible, nothing open', { anomalyPresent: true, conformance: 0.83, insideClosure: 0.9, independent: 2, feasibility: 'feasible', competing: [] }],
    ['the same with one independent source', { anomalyPresent: true, conformance: 0.83, insideClosure: 0.9, independent: 1, feasibility: 'feasible', competing: [] }],
    ['no anomaly, feasible', { anomalyPresent: false, feasibility: 'feasible' }],
    ['no anomaly, feasibility not stated', { anomalyPresent: false, feasibility: '' }],
    ['anomaly present, a competing explanation judged likely', { anomalyPresent: true, conformance: 0.83, insideClosure: 0.9, independent: 2, feasibility: 'feasible', competing: [{ name: 'tuning', status: 'likely' }] }],
  ].map(([label, a]) => { const r = PA.assessProspect(a); return [label, r.recommendation, r.seismicSupport]; });
  out.push(section(58, 'Prospects: crest, spill and closure, anomaly conformance, evidence and the assessment', 'Expert m05 l01 and Expert m05 l02 and Expert m05 l03 and Expert m05 l04', `
CLOSURE (lib/gridding/closure.js spillAnalysis, closureAt, closureCurve). From the crest (the highest mapped node unless a seed is stated) a priority flood always expands the highest frontier node; the spill elevation is the running minimum when the flood first reaches the edge of the mapped area, and a contact at or above it leaves the closure closed. Four-neighbour connectivity; the mapped edge is any grid-edge node or any node beside a null. The engine reads elevation and spacing in one unit; the course runs it in feet.

THE EKENE SAND TOP GRID, as the kit grids it from the six development wells' tops (02-surfaces/EkeneSand-top-6wells.zmap of ekene-demo-v3): ${whole(g.spec.nx)} by ${whole(g.spec.ny)} nodes every ${f6(g.spec.dx)} ft, ${whole(live)} of them mapped; z is minus the depth below the kelly bushing, in feet.

${table(['quantity', 'value'], [
    ['crest, ft', f6(clo.crestZ)], ['spill, ft', f6(clo.spillZ)], ['column from crest to spill, ft', f6(clo.columnFt)],
    ['spill limited by the map edge', clo.limitedByEdge ? 'yes' : 'no'], ['nodes in the closure at the spill', whole(clo.atSpill.nodes)],
    ['area at the spill, ft2', f6(clo.atSpill.areaM2)], ['gross rock volume at the spill, ft3', f6(clo.atSpill.grvM3)],
    ['the oil-water contact of the wells, ft', f6(owcFt)], ['closure at that contact closed', atOwc.closed ? 'yes' : 'no'],
  ])}

The map spills at the edge of its own mapped area, ${f6(clo.columnFt)} ft below the crest and above the contact the wells see: six wells grid too little of the structure to close the trap on the map. The engine says so (limited by the edge); a closure figure from this grid is the map's limit and no measurement of the trap.

ANOMALY CONFORMANCE (prospectAssessment.js anomalyConformance; THIS ENGINE AWAITS ITS INDEPENDENT ORACLE, engines PR E1c: taught, never graded until it lands). A hydrocarbon anomaly ends downdip at a contact, so its downdip edge follows one depth contour. The engine reads the anomaly's downdip edge (an anomaly node beside a lower node outside it, at their midpoint), its scatter against the closure's relief, conformance = 1 - scatter / relief clipped to 0 to 1, the share of the anomaly inside the closure, and the contact the edge implies. Two DESIGNED TEACHING ANOMALIES on the Ekene grid, labelled as such: A, every mapped node shallower than the spill; B, every node 20 ft shallower than the spill and west of the grid's middle column (an anomaly that cuts across the contours):

${table(['anomaly', 'nodes', 'edge nodes', 'conformance', 'share inside the closure', 'implied contact ft', 'edge scatter ft'], [cfRow('A, a contour', cA), cfRow('B, cut across', cB)])}

EVIDENCE (evidenceIndependence). Attributes computed from one seismic response are one piece of evidence. A full-stack RMS amplitude, an impedance from the same full stack and a far-stack brightening make ${whole(ev.supporting)} supporting items and ${whole(ev.independent)} independent sources; the shared source is ${ev.shared.map((s) => `${s.source} (${s.items.join(', ')})`).join('; ')}.

THE ASSESSMENT (assessProspect, the decision table; conformance 0.7 and above fits, under 0.3 cuts across; two independent supporting sources to mature):

${table(['case', 'recommendation', 'seismic support'], asmt)}

The absence of an anomaly counts against a prospect only where the feasibility study says the case would be visible.`));

  /* ------------------------------------------------------------ 59 */
  out.push(section(59, 'The report and the limits, and the Expert capstone', 'Expert m06 l01 and Expert m06 l02 and Expert m06 l03 and Expert m06 l04', `
THE QI REPORT states, for every product, the method, the stated settings (window, wavelet and its scale, LFM cut, weights, iterations, seeds), the blind-well figures per parameter, the calibration and its left-out check, the prospect figures with their limits, and every issue raised. The handover files are the products and that record; a result without its settings cannot be checked.

WHAT QI NEVER SETS: the geological chance of success. QI reports what the seismic says (supports, neutral, against) for the risk team to weigh; prospectAssessment.js returns a recommendation and a seismic support, never a probability of success.

WHAT THE ENGINES DO NOT COMPUTE, checked against the functions this tier calls: no wavelet is estimated inside an inversion (it is an input); no LFM is built inside modelBased or simultaneousInversion (m0 is an input); no horizon is picked; no grid is gridded (closure reads a stated grid); no fluid is inferred from a class name; no geological chance; no volume in barrels (closure returns gross rock volume only).

THE EXPERT CAPSTONE runs on a held-out synthetic case, never the Ekene field, supplied as a case file the learner pastes into the inversion and prospect explorers. It asks for six figures, each read from the panels: the LFM ln(AI) at a stated sample of a second trace position, built from the case's wells by inverse distance and their horizons; the model-based AI at a stated sample of the target trace, with the case's supplied low-frequency model, wavelet, weight and iteration count; the Vp/Vs from the simultaneous inversion at that sample, with the case's angle wavelets; the high end of the 80 percent porosity interval at a stated AI; the posterior probability of the oil-sand facies at a stated AI; and the column from crest to spill on the case's depth grid, in feet. Every input those figures depend on is stated in the case file.`));

  return out;
}
