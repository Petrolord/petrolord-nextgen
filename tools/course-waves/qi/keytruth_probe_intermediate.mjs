// Key-truth probe for the Professional tier: every keyed figure through the
// Professional lab (qiLabPro.js), never a restated formula.
import { register } from 'node:module';
register('/root/qi-wip-qi/qi_loader.mjs', import.meta.url);
const { LABP: P } = await import('/root/qi-wip-qi/qi_engine_p.mjs');
const { LAB: L } = await import('/root/qi-wip-qi/qi_engine.mjs');
const out = {}; const put = (k, v) => { out[k] = v; };
const f = (x) => (typeof x === 'number' ? +x.toFixed(6) : x);
const F = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'number' ? f(v) : v)));
const E = P.EKENE_PRO; const W4 = ['Ekene-1', 'Ekene-2', 'Ekene-3', 'Ekene-4'];
const tab = P.packVelocity();

/* m01: synthetic, wavelets, phase */
const sw1 = P.wellStatWavelet('Ekene-1');
const syn1 = P.synthetic('Ekene-1', sw1);
const tr1 = P.wellTrace('Ekene-1', 'full');
const live = Array.from(syn1.synthetic).map((v, i) => (Number.isFinite(v) ? i : -1)).filter((i) => i >= 0);
const big = live.map((i) => [i, Math.abs(syn1.rc[i])]).sort((a, b) => b[1] - a[1])[0];
const bs1 = P.bulkShift(syn1.synthetic, tr1.values, tr1.dtMs);
put('syn1', { live: syn1.live, rcMax: f(syn1.rc[big[0]]), rcMaxMs: f(P.sampleTime(tr1, big[0])), corr0: f(bs1.series.find((s) => s.lagMs === 0).corr), clock: [tr1.dtMs, tr1.t0Ms] });
for (const w of W4) { const s = P.wellStatWavelet(w); const sp = P.waveletSpectrum(s, 4); put(`stat.${w}`, [s.length, f(sp.peakHz), f(sp.centroidHz), f(sp.low6Hz), f(sp.high6Hz)]); }
{ const rk = P.rickerOf(25, 4, 60); const sp = P.waveletSpectrum(rk, 4); put('ricker25', [rk.length, f(sp.peakHz), f(sp.centroidHz)]); }
for (const h of [15, 5, 3]) { const r = P.wellWavelet('Ekene-1', { wavelet: sw1, halfLength: h }); put(`wellWavelet.h${h}`, r.error ? r.error : [r.wavelet.length, r.used, f(r.fitCorr)]); }
const ph1 = P.phaseMatch(syn1.synthetic, tr1.values); put('phase.E1', F(ph1));
for (const deg of [30, 60, 90]) {
  const r = P.rotate(Array.from(syn1.synthetic, (v) => (Number.isFinite(v) ? v : 0)), deg);
  const p = P.phaseMatch(r.map((v, i) => (Number.isFinite(syn1.synthetic[i]) ? v : NaN)), tr1.values);
  put(`phase.add${deg}`, F(p));
}
{ const r0 = P.rotate([0, 1, 0, -1, 0, 1, 0, -1, 0, 1], 0); const r180 = P.rotate([0, 1, 0, -1, 0, 1, 0, -1, 0, 1], 180); put('rotate.0and180', [F(r0).slice(0, 4), F(r180).slice(0, 4)]); }

/* m02: bulk shift, anchors, record, wavelets */
for (const w of W4) { const s = P.wellStatWavelet(w); const sy = P.synthetic(w, s); const t = P.wellTrace(w, 'full'); const b = P.bulkShift(sy.synthetic, t.values, t.dtMs); put(`bulk.${w}`, [f(b.lagMs ?? b.shiftMs), f(b.corr ?? b.bestCorr), Object.keys(b)]); }
for (const sh of [-8, 8]) { const sy = P.synthetic('Ekene-1', sw1, { shiftMs: sh }); const b = P.bulkShift(sy.synthetic, tr1.values, tr1.dtMs); put(`bulk.moved${sh}`, F(Object.fromEntries(Object.entries(b).filter(([k]) => k !== 'series')))); }
{ const w = P.tieWarp([{ synTwtMs: 1250, seisTwtMs: 1252 }, { synTwtMs: 1350, seisTwtMs: 1356 }]); put('warp2', [1200, 1250, 1300, 1350, 1400].map((t) => f(w.toSeismicMs(t)))); }
{ const w = P.tieWarp([{ synTwtMs: 1305.746335, seisTwtMs: 1301.746335 }]); put('warp1.shift-4', w.error ? w.error : [1200, 1305.746335, 1400].map((t) => f(w.toSeismicMs(t)))); }
{ const w = P.tieWarp([{ synTwtMs: 1250, seisTwtMs: 1260 }, { synTwtMs: 1350, seisTwtMs: 1255 }]); put('warp.fold', w.error ? 'REFUSED' : 'NO REFUSAL'); }
for (const w of W4) put(`topTwt.${w}`, f(P.checkshotTwt(w, L.packWell(w).topFt)));
const ws = W4.map((w) => ({ name: w, samples: P.wellStatWavelet(w) }));
const cmp = P.compare(ws); put('compare', F({ keys: Object.keys(cmp), lags: cmp.lags, matrix: cmp.similarity ?? cmp.matrix, misfit: cmp.misfit ?? cmp.corrWithAverage }));
{ const sp = P.waveletSpectrum(Array.from(cmp.average), 4); put('average', [cmp.average.length, f(sp.peakHz), f(sp.centroidHz), P.resample(Array.from(cmp.average), 4, 2).length]); }
for (const deg of [90, 180]) { const c = P.compare(ws.map((w) => (w.name === 'Ekene-3' ? { name: w.name, samples: P.rotate(w.samples, deg) } : w))); put(`compare.E3rot${deg}`, F(c.misfit ?? c.corrWithAverage)); }

/* m03: gathers and QC */
const g5 = P.packGather(5); put('g5', [g5.inline, g5.crossline, g5.offsets.length, g5.offsets[0], g5.offsets[g5.offsets.length - 1], P.PACK ? 'x' : '']);
const bins = P.offsetBins(g5.offsets, E.binWidthM); put('bins200', F({ fold: bins.fold, summary: P.foldOf(bins.fold, bins.centres, 1) }));
const top5 = P.pickEvent(g5, g5.traces[0], 1289); put('pick.g5', f(top5.tMs));
const v5 = P.velocityAt(tab, top5.tMs); put('vel.1292', [f(v5.vrms), f(v5.vint)]);
put('vel.beyond', [1900, 2500].map((t) => { const v = P.velocityAt(tab, t); return [f(v.vrms), f(v.vint)]; }));
put('stretch', g5.offsets.map((x) => [x, f(P.stretch(x, top5.tMs, v5.vrms))]));
put('mute', [f(P.muteOffset(top5.tMs, v5.vrms, 0.2)), f(P.muteOffset(top5.tMs, v5.vrms, 0.3))]);
const r5 = P.rmo(g5, top5.tMs); put('rmo.g5', F({ ...Object.fromEntries(Object.entries(r5).filter(([k]) => !['perOffset', 'lags', 'corrs'].includes(k))), lagsLast3: (r5.lagsMs || r5.lags || []).slice(-3), corrLast3: (r5.corr || r5.corrs || []).slice(-3) }));
put('rmo.all', Array.from({ length: 12 }, (_, k) => { const g = P.packGather(k); const t = P.pickEvent(g, g.traces[0], 1289); const r = P.rmo(g, t.tMs); return [k, g.inline, g.crossline, f(t.tMs), r.method, r.fitted ?? r.nFitted, f(r.rmoFarMs)]; }));
const ag5 = P.angles(g5, tab, { edges: E.angleEdges });
const i5 = Math.round((top5.tMs - g5.t0Ms) / g5.dtMs);
put('angle.g5', F({ fold: ag5.fold.map((b) => b[i5]), mean: ag5.gather.map((b) => b[i5]) }));
put('usable', [1, 2, 3, 4, 5].map((m) => { const u = P.usable(ag5, E.angleEdges, m)[i5]; return Number.isFinite(u) ? f(u) : 'none'; }));

/* m04: Dix, Walden, stacks */
put('dix', P.dix(tab).map(f));
put('dix.refusal', P.dix({ tMs: [1000, 1100], vrms: [2500, 2000] }).error);
put('walden.ekene', [500, 1000, 1500, 2000, 2500].map((x) => f(P.walden(x, top5.tMs, v5.vrms, v5.vint))));
put('walden.sinAbove1', f(P.walden(1e6, 100, 2000, 6000)));
{ const earth = [{ thicknessM: 600, v: 1800 }, { thicknessM: 600, v: 2200 }, { thicknessM: 500, v: 2600 }, { thicknessM: 400, v: 3000 }]; const lr = P.layered(earth);
  put('earth.base3', [f(lr[2].t0 * 1000), f(lr[2].vrms)]);
  put('earth.rows', [500, 1000, 1500, 2000, 2500, 3000].map((x) => { const w = P.walden(x, lr[2].t0 * 1000, lr[2].vrms, 2600); const r = P.rayTrace(earth, 2, x); const rt = typeof r === 'number' ? r : (r.angleDeg ?? r.thetaDeg ?? r); return [x, f(w), f(rt), f(w - rt)]; })); }
const pk = L.PACK;
put('stacks', [[0, 1, 'near'], [1, 2, 'mid'], [2, 3, 'far']].map(([a, b, n]) => {
  const full = P.stackOf(ag5, a, b); const t = P.wellTrace('Ekene-1', n); const ii = Math.round((top5.tMs - t.t0Ms) / t.dtMs);
  const kit = P.traceWindow(t, t.values, g5.t0Ms, pk.gathers.t1_ms);
  const z = P.bulkShift(full.map((v) => (Number.isFinite(v) ? v : NaN)), kit, g5.dtMs, { maxLagMs: g5.dtMs }).series.find((x) => x.lagMs === 0);
  return [n, f(full[i5]), f(t.values[ii]), f(z.corr)];
}));
{ const all = P.stackOf(ag5, 0, 3); put('stack.all3', f(all[i5])); }

/* m05: Shuey, trend, contrasts, chi */
const amps5 = ag5.gather.map((b) => b[i5]);
const f2 = P.shueyFit(E.stackAngles, amps5, { terms: 2 }); const f3 = P.shueyFit(E.stackAngles, amps5, { terms: 3 });
put('shuey2', F(f2)); put('shuey3', F(f3));
{ const fine = P.angles(g5, tab, { edges: E.angleEdgesFine }); const ang = E.angleEdgesFine.slice(0, -1).map((e, k) => (e + E.angleEdgesFine[k + 1]) / 2); put('shuey2.fine', F(P.shueyFit(ang, fine.gather.map((b) => b[i5]), { terms: 2 }))); }
put('shuey2.farGap', F(P.shueyFit(E.stackAngles, [amps5[0], amps5[1], NaN], { terms: 2 })));
const As = []; const Bs = [];
for (let i = 0; i < g5.traces[0].length; i++) { const r = P.shueyFit(E.stackAngles, ag5.gather.map((b) => b[i]), { terms: 2 }); if (r && Number.isFinite(r.A) && Number.isFinite(r.B) && ag5.gather.every((b) => Number.isFinite(b[i]))) { As.push(r.A); Bs.push(r.B); } }
const bt = P.trend(As, Bs); put('trend', [As.length, f(bt.m)]);
put('offTop', f(P.off(f2.A, f2.B, bt.m)));
const wells = P.packAvoAtWells(); put('avoWells', F({ scale: wells.scale, agree: wells.agree, n: wells.n, wells: wells.wells ?? wells.rows }));
const S = wells.scale;
put('contrasts.0.5', F(P.contrasts(f2.A / S, f2.B / S, 0.5)));
put('contrasts.0.4', F(P.contrasts(f2.A / S, f2.B / S, 0.4)));
put('contrasts.0.6', F(P.contrasts(f2.A / S, f2.B / S, 0.6)));
put('contrasts.unscaled.0.5', F(P.contrasts(f2.A, f2.B, 0.5)));
const chiDeg = (Math.atan(bt.m) * 180) / Math.PI;
put('chi', [f(P.chi(f2.A, f2.B, 30)), f(chiDeg), f(P.chi(f2.A, f2.B, chiDeg)), f(P.chi(f2.A, f2.B, 0))]);

/* m06: classes */
put('class.band', W4.map((w, k) => { const r = (wells.wells ?? wells.rows)[k]; return r; }).length);
console.log(JSON.stringify(out, null, 0).replace(/,"/g, ',\n"'));

/* the prestack explorer's defaults (QiPrestackExplorer.jsx startState): event 1289 ms = round(checkshot top),
   sample time 1289 ms, scale 1, stretch limit 0.3 */
{
  const ev = Math.round(P.checkshotTwt('Ekene-1', L.packWell('Ekene-1').topFt));
  const i = Math.round((ev - g5.t0Ms) / g5.dtMs);
  const v = P.velocityAt(tab, ev);
  const fit = P.shueyFit(E.stackAngles, ag5.gather.map((b) => b[i]), { terms: 2 });
  put('explorer.defaults', F({ event: ev, sampleIndexTime: g5.t0Ms + i * g5.dtMs, velAtEvent: [v.vrms, v.vint], waldenAt1500: P.walden(1500, ev, v.vrms, v.vint), stretchAt1500: P.stretch(1500, ev, v.vrms),
    fold: ag5.fold.map((b) => b[i]), mean: ag5.gather.map((b) => b[i]), farStack: P.stackOf(ag5, 2, 3)[i], usable2: P.usable(ag5, E.angleEdges, 2)[i], fitA: fit.A, fitB: fit.B,
    contrastsScale1: P.contrasts(fit.A, fit.B, 0.5), classScale1: P.classOf(fit.A, fit.B) }));
}
console.log(JSON.stringify({ explorer: out['explorer.defaults'] }));
