// Key-truth probe for the Expert tier: every keyed figure through the Expert
// lab (qiLabExp.js, loaded by qi_engine_e.mjs, the file the inversion and
// prospect explorers run), never a restated formula. Run from /root/qi-wip-qi:
//   node keytruth_probe_advanced.mjs
import { register } from 'node:module';
register('/root/qi-wip-qi/qi_loader.mjs', import.meta.url);
const { LABE: E } = await import('/root/qi-wip-qi/qi_engine_e.mjs');
const INV = await import('@petrolord/engines/engines/qi/inversion.js');
const PSI = await import('@petrolord/engines/engines/qi/prestackInversion.js');
const LFM = await import('@petrolord/engines/engines/qi/lfm.js');
const PA = await import('@petrolord/engines/engines/qi/prospectAssessment.js');
const CL = await import('@petrolord/engines/lib/gridding/closure.js');

const out = {}; const put = (k, v) => { out[k] = v; };
const f = (x) => (typeof x === 'number' ? (Number.isFinite(x) ? +x.toFixed(6) : String(x)) : x);
const F = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'number' ? f(v) : v)));
const fin = Number.isFinite;
const X = E.EXPERT;
const S = E.ekeneSetup();
const ms = (i) => S.win.t0Ms + i * S.win.dtMs;
const covered = (l) => l.lnAi.map((v, i) => (fin(v) ? i : -1)).filter((i) => i >= 0);
const E1 = S.logs.find((l) => l.name === 'Ekene-1');
const iTop = Math.round((E1.horizonsMs[0] - S.win.t0Ms) / S.win.dtMs);

// explorer check (m01 l02): where the Ekene-1 full stack peaks round the top of the sand
put('trace.E1.1276to1316', Array.from({ length: 11 }, (_, k) => 1276 + 4 * k).map((t) => [t, f(E.wellTrace('Ekene-1')[(t - 1100) / 4])]));
// m01 l04 exercise: a 60 ms half length and a 30 Hz Ricker through the scale
{ const a = E.ekeneSetup(undefined, { waveletHalfMs: 60 }); const b = E.ekeneSetup(undefined, { waveletHz: 30 }); put('scale.half60', a.error || [f(a.scale), a.scaleSamples]); put('scale.30Hz', b.error || [f(b.scale), b.scaleSamples]); }

/* m01: settings, wells in time, forward model, adjoint, LFM, scale */
put('settings', F({ win: X.windowMs, ns: S.win.ns, dt: S.win.dtMs, rickerHz: X.waveletHz, halfMs: X.waveletHalfMs, wavN: S.raw.length, lfmHz: X.lfmHz, truthHz: X.truthHz, eps: X.eps, iters: X.iters, epsTV: X.epsTV, outer: X.outer, lambda: X.lambda, idw: X.idwPower, band: X.band, angles: X.angles }));
put('wellsInTime', S.logs.map((l) => { const c = covered(l); return [l.name, c.length, ms(c[0]), ms(c.at(-1)), f(l.horizonsMs[0]), f(l.horizonsMs[1])]; }));
{ const a = E.adjointTest(S.wavelet, S.win.ns, 42); put('adjoint', F({ D: a.d, C: a.c })); }
const tr1 = E.wellTrace('Ekene-1');
{ const c = covered(E1); const held = E1.lnAi.map((v, i) => (fin(v) ? v : (i < c[0] ? E1.lnAi[c[0]] : E1.lnAi[c.at(-1)])));
  const syn = INV.forwardPoststack(held, S.wavelet);
  put('synE1', [-4, -2, 0, 2, 4, 6].map((d) => iTop + d).map((i) => [ms(i), f(held[i]), f(syn[i]), f(tr1[i])]));
  put('synE1.corr', F(E.corrOf(syn.slice(c[0], c.at(-1) + 1), tr1.slice(c[0], c.at(-1) + 1)))); }
put('lfm.halfWindow', E.halfWindowFor(X.lfmHz, S.win.dtMs));
{ const others = S.lfm.filter((w) => w.name !== 'Ekene-1');
  // shares read off the engine: the LFM at Ekene-1 of three unit-impulse wells
  const at = { x: E1.x, y: E1.y, horizons: E1.horizonsMs };
  const shares = others.map((w) => { const probe = S.lfm.map((v) => ({ ...v, values: v.values.map(() => (v.name === w.name ? 1 : 0)) })); const r = E.lfmAt(probe, at, S.win, { exclude: 'Ekene-1' }); return [w.name, f(Math.hypot(w.x - E1.x, w.y - E1.y)), f(r[iTop])]; });
  put('lfm.shares(engine)', shares); }
{ const e2 = S.logs.find((l) => l.name === 'Ekene-2'); const t = [E1.horizonsMs[0] - 8, E1.horizonsMs[0], (E1.horizonsMs[0] + E1.horizonsMs[1]) / 2, E1.horizonsMs[1] + 8]; put('mapToWellTime', t.map((x) => [f(x), f(LFM.mapToWellTime(x, E1.horizonsMs, e2.horizonsMs))])); }
put('lfm.atWells', S.logs.map((l) => { const at = { x: l.x, y: l.y, horizons: l.horizonsMs }; const b = E.lfmAt(S.lfm, at, S.win, { exclude: l.name }); const k = E.lfmAt(S.lfm, at, S.win); const t = E.truthOf(l); return [l.name, f(b[iTop]), f(k[iTop]), f(LFM.blindWellScore(b, t).rmsPct), f(LFM.blindWellScore(k, t).rmsPct)]; }));
put('scale', [f(S.scale), S.scaleSamples, f(Math.max(...S.raw)), f(Math.max(...S.wavelet))]);
put('scale.refusal', E.waveletScale([{ trace: [1, 2, 3], lnAi: [15, 15.1, 15.2] }], S.raw).error);

/* m02: model-based, iterations, eps, blocky, sparse-spike, coloured, blind, spread */
const truth1 = E.truthOf(E1);
const mb = E.invertAt(S, 'Ekene-1', { exclude: true });
put('mb', F({ iters: mb.iterations, res: mb.residualRms, rows: [-2, 0, 2, 4, 6].map((d) => iTop + d).map((i) => [ms(i), Math.exp(truth1[i]), Math.exp(mb.m0[i]), mb.ai[i]]) }));
put('mb.iters', [20, 60, 120, 300].map((it) => { const r = E.invertAt(S, 'Ekene-1', { exclude: true, iters: it }); const s = LFM.blindWellScore(r.m, truth1); return [it, r.iterations, f(r.residualRms), f(s.corr), f(s.rmsPct)]; }));
put('mb.eps300', [0.05, 1, 5].map((eps) => { const r = E.invertAt(S, 'Ekene-1', { exclude: true, eps, iters: 300 }); const s = LFM.blindWellScore(r.m, truth1); return [eps, f(r.residualRms), f(s.corr), f(s.rmsPct)]; }));
const nz = (lam, it) => Array.from(E.reflectivityOf({ d: tr1, wavelet: S.wavelet, lambda: lam, iters: it }).r).filter((v) => v !== 0).length;
put('fista.nonzero', [0.002, 200, 1000, 5000].map((l) => [l, nz(l, 60), nz(l, 400)]));
put('trace.maxAbs', f(Math.max(...Array.from(tr1, Math.abs))));
{ const sp = E.invertAt(S, 'Ekene-1', { method: 'sparse_spike', exclude: true, iters: X.iters }); const bl = E.invertAt(S, 'Ekene-1', { method: 'blocky', exclude: true });
  put('methods.E1', F({ mb: LFM.blindWellScore(mb.m, truth1), blocky: LFM.blindWellScore(bl.m, truth1), sparse: LFM.blindWellScore(sp.m, truth1) })); }
{ const co = E.colouredAt(S); put('coloured', F({ alpha: co.alpha, N: co.N, slopes: co.slopes.map((s) => [s.name, s.alpha]), corr: co.out.map((o) => { const l = S.logs.find((x) => x.name === o.name); const hi = E.lowPassFinite(l.lnAi, E.halfWindowFor(X.truthHz, S.win.dtMs)); const lo = E.lowPassFinite(l.lnAi, E.halfWindowFor(X.band[0], S.win.dtMs)); const c = E.corrOf(o.rel, hi.map((v, i) => v - lo[i])); return [o.name, c.corr, c.n]; }) })); }
const bt = E.blindTable(S); const btS = E.blindTable(S, 'sparse_spike');
put('blind.mb', bt.map((r) => [r.name, f(r.blind.corr), f(r.blind.rmsPct), r.blind.n, f(r.withWell.corr), f(r.withWell.rmsPct), f(r.lfmOnly.corr), f(r.lfmOnly.rmsPct)]));
put('blind.sparse', btS.map((r) => [r.name, f(r.blind.corr), f(r.blind.rmsPct)]));
put('blind.lfmBeatsMb', bt.filter((r) => r.lfmOnly.rmsPct < r.blind.rmsPct).map((r) => r.name));
put('blind.lfmBeatsSparse', bt.filter((r, k) => r.lfmOnly.rmsPct < btS[k].blind.rmsPct).map((r) => r.name));
put('blind.keptRange', [f(Math.min(...bt.map((r) => r.withWell.corr))), f(Math.max(...bt.map((r) => r.withWell.corr)))]);
{ const sp = E.spreadAt(S, 'Ekene-1'); const kA = covered(E1);
  put('spread', F({ n: sp.realisations, rows: [-2, 0, 2, 4].map((d) => iTop + d).map((i) => [ms(i), sp.q10[i], sp.q50[i], sp.q90[i], sp.spread[i]]), mean: kA.reduce((s, i) => s + sp.spread[i], 0) / kA.length, q10BelowQ90Everywhere: kA.every((i) => sp.q10[i] <= sp.q50[i] && sp.q50[i] <= sp.q90[i]) })); }

/* m03: Fatti, scales, angle wavelets, stacks, blind per parameter */
const M = E.ekeneSimSetup(S);
put('fatti', F({ K: M.vsVp, G: PSI.fattiCoefficients([0, 10, 20, 30, 40], M.vsVp) }));
put('fatti.scales', M.stacks.map((k, i) => [k, M.angles[i], f(M.scales[i].scale), M.scales[i].samples]));
{ const rc = Float64Array.from(E1.lnAi.map((v, i, a) => (fin(v) && fin(a[i - 1]) ? 0.5 * (v - a[i - 1]) : NaN)));
  put('wellWavelet.h15', E.wellWaveletOf(rc, tr1, { halfLength: 15 }).error); put('wellWavelet.h5', E.wellWaveletOf(rc, tr1, { halfLength: 5 }).error);
  const a3 = E.angleWaveletsAt(S, M, { halfLength: 3 }); const a15 = E.angleWaveletsAt(S, M, { halfLength: 15 });
  put('angleWavelets.h15', a15.filter((a) => a.samples).length + ' of ' + a15.length);
  put('angleWavelets.h3', F({ n: a3.filter((a) => a.samples).length, len: a3[0].samples && a3[0].samples.length, rows: a3.flatMap((a) => a.wells.map((w) => [w.name, a.angle, w.fitCorr, w.synthCorr])) })); }
const sc6 = (s) => F([s.ai.corr, s.ai.rmsPct, s.vpvs.corr, s.vpvs.rmsPct, s.rho.corr, s.rho.rmsPct]);
{ const at = { x: E1.x, y: E1.y, horizons: E1.horizonsMs }; const o = { exclude: 'Ekene-1' };
  const lfm3 = { lnAi: E.lfmAt(M.lfm.lnAi, at, S.win, o), lnSi: E.lfmAt(M.lfm.lnSi, at, S.win, o), lnRho: E.lfmAt(M.lfm.lnRho, at, S.win, o) };
  put('sim.E1.lfms', sc6(E.scoreSim(lfm3, E1)));
  put('sim.E1.near', sc6(E.scoreSim(E.simAt(S, M, 'Ekene-1', { exclude: true, stacks: ['near'] }), E1)));
  put('sim.E1.nearMid', sc6(E.scoreSim(E.simAt(S, M, 'Ekene-1', { exclude: true, stacks: ['near', 'mid'] }), E1))); }
put('sim.blind.all', S.logs.map((l) => [l.name, ...sc6(E.scoreSim(E.simAt(S, M, l.name, { exclude: true }), l))]));

/* m04: transform, interval, left-out band, facies */
const logS = E.logScaleSamples(); const sand = logS.filter((s) => s.facies !== 'shale');
{ const pt = E.porosityTransform(sand, [6.5e6, 7e6, 7.5e6, 8.5e6]); const p90 = E.porosityTransform(sand, [7e6], 0.9);
  put('transform', F({ n: sand.length, a: pt.fit.a, b: pt.fit.b * 1e6, s: pt.fit.s, r2: pt.fit.r2, xMean: pt.fit.xMean, range: [Math.min(...sand.map((s) => s.ai)), Math.max(...sand.map((s) => s.ai))], rows: pt.predictions.map((p) => [p.ai, p.y, p.lo, p.hi]), at90: [p90.predictions[0].y, p90.predictions[0].lo, p90.predictions[0].hi] })); }
{ const cal = E.leftOutBand(S); put('leftOut', F({ bPer1e6: cal.summary.b * 1e6, summary: cal.summary, rows: cal.rows.map((r) => [r.name, r.n, r.rms, r.bias, r.corr, r.coverage]) })); }
{ const counts = {}; for (const s of logS) counts[s.facies] = (counts[s.facies] || 0) + 1; put('facies.counts', counts);
  const fm1 = E.faciesModel(logS, { at: [6.0e6, 6.6e6, 7.2e6, 7.8e6].map((v) => [v]) });
  put('facies.1', F({ names: fm1.model.classes.map((c) => c.name), priors: fm1.model.classes.map((c) => c.prior), post: fm1.posteriors.map((p) => [...p.probs, p.best]), acc: fm1.confusion.accuracy, cm: fm1.confusion.counts }));
  const fe = E.faciesModel(logS, { priors: { shale: 1, 'oil sand': 1, 'brine sand': 1 }, at: [[6.6e6]] }); put('facies.equal', F(fe.posteriors[0].probs));
  const fm2 = E.faciesModel(logS, { attrs: ['ai', 'vpvs'], at: [[6.6e6, 1.75], [6.6e6, 2.0]] });
  put('facies.2', F({ post: fm2.posteriors.map((p) => p.probs), acc: fm2.confusion.accuracy, cm: fm2.confusion.counts })); }

/* m05: closure, climb, conformance, evidence, assessment */
const g = E.gridFt(); const clo = E.closureOf(g, { levels: 4 });
put('closure', F({ nx: g.spec.nx, ny: g.spec.ny, dx: g.spec.dx, mapped: Array.from(g.z).filter((v) => Math.abs(v) < 1e29).length, crest: clo.crestZ, spill: clo.spillZ, column: clo.columnFt, edge: clo.limitedByEdge, nodes: clo.atSpill.nodes, area: clo.atSpill.areaM2, grv: clo.atSpill.grvM3, atOwcClosed: CL.closureAt(clo.spill, g.spec, -1560 / 0.3048).closed }));
{ let start = -1; let bd = Infinity; for (let i = 0; i < g.z.length; i++) { if (!(Math.abs(g.z[i]) < 1e29)) continue; const r = Math.floor(i / g.spec.nx); const c = i % g.spec.nx; const d = (r - (g.spec.ny - 1) / 2) ** 2 + (c - (g.spec.nx - 1) / 2) ** 2; if (d < bd) { bd = d; start = i; } }
  const cl = E.trapFrom(g, start); put('climb', F({ col: start % g.spec.nx, row: Math.floor(start / g.spec.nx), z0: g.z[start], node: cl.seed, crest: cl.crestZ, sameAsHighest: cl.seed === clo.spill.order[0] })); }
const mA = E.maskAbove(g, clo.spillZ); const mB = E.maskCut(g, clo.spillZ - 20, g.spec.x0 + Math.floor(g.spec.nx / 2) * g.spec.dx);
const cA = E.conformanceOf(g, mA, clo.spill); const cB = E.conformanceOf(g, mB, clo.spill);
const pick = (c) => F({ nodes: c.anomalyNodes, edge: c.edgeNodes, conf: c.conformance, inside: c.insideClosure, implied: c.impliedContactZ, sd: c.edgeSdM, relief: c.reliefM });
put('conf.A', pick(cA)); put('conf.B', pick(cB));
put('evidence.3', F(PA.evidenceIndependence([{ name: 'full-stack RMS amplitude', source: 'full_stack' }, { name: 'impedance from the full stack', source: 'full_stack' }, { name: 'far-stack brightening', source: 'far_stack' }])));
put('evidence.2same', F(PA.evidenceIndependence([{ name: 'full-stack RMS amplitude', source: 'full_stack' }, { name: 'impedance from the full stack', source: 'full_stack' }])));
const A = (a) => { const r = PA.assessProspect(a); return [r.recommendation, r.seismicSupport]; };
const base = { anomalyPresent: true, conformance: 0.83, insideClosure: 0.9, independent: 2, feasibility: 'feasible', competing: [] };
put('assess.table', [A(base), A({ ...base, independent: 1 }), A({ anomalyPresent: false, feasibility: 'feasible' }), A({ anomalyPresent: false, feasibility: '' }), A({ ...base, competing: [{ name: 'tuning', status: 'likely' }] })]);
// class-1 checks: inputs the prompts did not rule out
put('assess.likely.conf0.2', A({ ...base, conformance: 0.2, competing: [{ name: 'brine sand', status: 'likely' }] }));
put('assess.likely.noConf', A({ anomalyPresent: true, competing: [{ name: 'brine sand', status: 'likely' }] }));
put('assess.likely.oneSource', A({ ...base, independent: 1, competing: [{ name: 'tuning', status: 'likely' }] }));
put('assess.A.conf', A({ ...base, conformance: cA.conformance, insideClosure: cA.insideClosure }));
put('assess.B.conf', A({ ...base, conformance: cB.conformance, insideClosure: cB.insideClosure }));
put('assess.oneSource.lowConf', A({ ...base, independent: 1, conformance: 0.2 }));
put('assess.noAnomaly.conditional', A({ anomalyPresent: false, feasibility: 'conditional' }));
put('assess.twoSameSource', A({ ...base, independent: PA.evidenceIndependence([{ name: 'a', source: 'full_stack' }, { name: 'b', source: 'full_stack' }]).independent }));
put('assess.keys', Object.keys(PA.assessProspect(base)));

console.log(JSON.stringify(out, null, 0).replace(/,"/g, ',\n"'));
