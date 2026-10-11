// Key-truth probe for the Associate tier: every keyed figure through the lab (qiLab.js).
import { register } from 'node:module';
register('/root/qi-wip-qi/qi_loader.mjs', import.meta.url);
const { LAB: L } = await import('/root/qi-wip-qi/qi_engine.mjs');
const AV = await import('@petrolord/engines/engines/rockphysics/avo.js');
const FL = await import('@petrolord/engines/engines/rockphysics/fluids.js');
const QC = await import('@petrolord/engines/engines/qi/seismicQc.js');
const ES = await import('@petrolord/engines/engines/rockphysics/elasticSet.js');
const AT = await import('@petrolord/engines/engines/rockphysics/avoTrend.js');
const MN = await import('@petrolord/engines/engines/rockphysics/minerals.js');
const GS = await import('@petrolord/engines/engines/rockphysics/gassmann.js');
const out = {}; const put = (k, v) => { out[k] = v; };
const P = L.PACK, E = L.EKENE; const f = (x) => typeof x === 'number' ? +x.toFixed(6) : x;
const E1 = L.packWell('Ekene-1');
for (const w of L.PACK_WELLS) { const W = L.packWell(w); for (const z of ['sand','oil','water','shale']) put(`count.${w}.${z}`, L.zoneSamples(W, z).length); put(`top.${w}`, f(W.topFt)); }
put('owcFt', f(L.mToFt(P.contacts_m.ekeneOwc)));
const fluids = L.fluidsAt(P.conditions.ekene);
put('fluids', { tC: f(fluids.tC), pMPa: f(fluids.pMPa), gorLL: f(fluids.gorLL), rho0: f(fluids.rho0), brine: { rho: f(fluids.brine.rho), vp: f(fluids.brine.vp), k: f(fluids.brine.k/1e9) }, oil: { rho: f(fluids.oil.rho), vp: f(fluids.oil.vp), k: f(fluids.oil.k/1e9) } });
for (const sw of [0.2, 0.5, 0.8, 1, 0.574254]) { const m = L.poreFluid(fluids, sw); put(`wood.${sw}`, [f(m.k/1e9), f(m.rho)]); }
const win = (w, a, b) => L.timeWindow(L.qcTraces(w), { t0Ms: a, t1Ms: b });
for (const [a,b] of [[800,1600],[1600,2400],[800,2400]]) { const s = L.spectrum(win('spread',a,b), 4, { taper: 0.1 }); put(`spec.${a}-${b}`, { n: s.traces, df: f(s.df), peak: f(s.peakHz), cen: f(s.centroidHz), lo6: f(s.low6Hz), hi6: f(s.high6Hz), bw6: f(s.bandwidth6Hz), lo20: f(s.low20Hz), hi20: f(s.high20Hz) }); }
for (const tp of [0, 0.1, 0.25, 0.5]) { const s = L.spectrum(win('spread',800,1600), 4, { taper: tp }); put(`taper.${tp}`, [f(s.peakHz), f(s.centroidHz), f(s.low6Hz), f(s.high6Hz)]); }
{ const s = L.spectrum(win('ekene1',800,1600), 4, { taper: 0.1 }); put('one.trace', [f(s.peakHz), f(s.centroidHz), f(s.low6Hz), f(s.high6Hz)]); }
{ const rk = L.ricker(30, 4, 60); const s = L.traceSpectrum(rk, 4, { taper: 0 }); put('ricker30', [rk.length, f(s.peakHz), f(s.low6Hz), f(s.high6Hz), f(s.centroidHz)]); }
for (const [a,b] of [[800,1600],[1600,2400]]) { const s = L.snr(win('neighbours',a,b), { maxLag: 3 }); put(`snr.${a}-${b}`, [s.pairs ?? s.ratios?.length, f(s.snr), f(s.snrDb), (s.perPair||[]).slice(0,5).map(f)]); }
for (const lg of [0,1,3,6]) { const s = L.snr(win('neighbours',800,1600), { maxLag: lg }); put(`snrlag.${lg}`, [f(s.snr), f(s.snrDb)]); }
const sl = L.packSlice(); const fp = L.stripe(sl, { minPeriod: 2, maxPeriod: 16 }); const fpd = L.stripe(L.withStripe(sl, { period: 6, gain: 1.2 }), { minPeriod: 2, maxPeriod: 16 });
put('footprint', JSON.parse(JSON.stringify(fp, (k,v)=> typeof v==='number'? f(v): v)).toString?.() ? fp : fp); put('footprintDesigned', fpd);
const wet = L.zoneSamples(E1, 'water'), oilS = L.zoneSamples(E1, 'oil'), sh = L.zoneSamples(E1, 'shale');
put('gc.water.mean', f(L.shearAgainstGc(wet).meanRatio)); put('gc.oil.mean', f(L.shearAgainstGc(oilS).meanRatio));
const tr = L.shearTrend(wet, { form: 'linear', level: 0.9, at: [2900, 3100, 3300, 3700] }); put('trend', JSON.parse(JSON.stringify(tr, (k,v)=> typeof v==='number'? f(v): v)));
put('trend80', JSON.parse(JSON.stringify(L.shearTrend(wet, { form: 'linear', level: 0.8, at: [3100] }), (k,v)=> typeof v==='number'? f(v): v)));
put('trendQuad', JSON.parse(JSON.stringify(L.shearTrend(wet, { form: 'quadratic', level: 0.9, at: [3100] }), (k,v)=> typeof v==='number'? f(v): v)));
const all4 = L.PACK_WELLS.flatMap((w) => L.zoneSamples(L.packWell(w), 'water'));
put('trend4', JSON.parse(JSON.stringify(L.shearTrend(all4, { form: 'linear', level: 0.9, at: [3100] }), (k,v)=> typeof v==='number'? f(v): v)));
const shM = L.layerMeans(sh), oilM = L.layerMeans(oilS), wM = L.layerMeans(wet);
for (const [n, m] of [['cap', shM], ['oil', oilM], ['water', wM]]) { const e = L.elastic(m.vp, m.vs, m.rho); put(`el.${n}`, { n: m.n, vp: f(m.vp), vs: f(m.vs), rho: f(m.rho), ai: f(e.ai), si: f(e.si), vpvs: f(e.vpvs), pr: f(e.pr), lr: f(e.lambdaRho/1e12), mr: f(e.muRho/1e12), phit: f(m.phit), vsh: f(m.vsh), sw: f(m.sw) }); }
put('nanPoint', L.elastic(2000, 2100, 2300));
const sub = L.substituteZone(oilS, fluids); put('sub', { aiB: f(sub.aiBefore ?? sub.meanAiBefore), keys: Object.keys(sub) });
put('subMeans', JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(sub).filter(([k]) => k !== 'rows')), (k,v)=> typeof v==='number'? f(v): v)));
const wt = L.wetTrend(E1, fluids, { blockFt: 16 }); put('wet16', JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(wt).filter(([k]) => k !== 'points')), (k,v)=> typeof v==='number'? f(v): v)));
for (const b of [8, 24]) { const w = L.wetTrend(E1, fluids, { blockFt: b }); put(`wet${b}`, [w.blockSamples, w.points.length, f(w.line.slope), f(w.line.rmsDistance)]); }
const brineL = { vp: sub.vpAfter, vs: sub.vsAfter, rho: sub.rhoAfter };
const abIn = L.interfaceAB(shM, oilM), abBr = L.interfaceAB(shM, brineL);
put('ab', { in: [f(abIn.a), f(abIn.b), f(abIn.c)], br: [f(abBr.a), f(abBr.b), f(abBr.c)] });
put('dist', { inFit: f(L.distance(abIn.a, abIn.b, wt.line.slope)), brFit: f(L.distance(abBr.a, abBr.b, wt.line.slope)), inPub: f(L.distance(abIn.a, abIn.b, wt.castagnaSlope)), brPub: f(L.distance(abBr.a, abBr.b, wt.castagnaSlope)) });
const avIn = L.modelledAvo(shM, oilM), avBr = L.modelledAvo(shM, brineL);
put('avoIn', JSON.parse(JSON.stringify(avIn, (k,v)=> typeof v==='number'? f(v): v))); put('avoBr', JSON.parse(JSON.stringify(avBr, (k,v)=> typeof v==='number'? f(v): v)));
// refusals
const R = (fn) => { try { const r = fn(); return r && r.error ? r.error : 'NO THROW'; } catch (e) { return e.message; } };
put('ref', {
 dt0: R(() => QC.amplitudeSpectrum([1,2,3,4,5,6,7,8,9], 0)), n5: R(() => QC.amplitudeSpectrum([1,2,3,4,5], 4)),
 avg0: R(() => QC.averageSpectrum([], 4)), avgLen: R(() => QC.averageSpectrum([new Array(16).fill(1), new Array(20).fill(1)], 4)),
 snr1: R(() => QC.snrFromCoherency([[1,2,3]])), snrNull: R(() => QC.snrFromCoherency([[null,null,null],[null,null,null]])),
 fp3: R(() => QC.footprint([[1,2,3],[1,2,3],[1,2,3]])),
 vs3: R(() => ES.fitVsRegression([3000,3100,3200].map(v=>({vp:v,vs:v/2})))),
 cubic: R(() => ES.fitVsRegression([1,2,3,4,5,6].map(i=>({vp:2800+i*50,vs:1500+i*20})), { form: 'cubic' })),
 sing: R(() => ES.fitVsRegression([1,2,3,4,5,6].map(i=>({vp:3000,vs:1500+i})))),
 brineP0: R(() => FL.brine(80, 0, 0.035)), brineS: R(() => FL.brine(80, 20, 0.6)), api0: R(() => FL.apiToRho0(0)),
 wood: R(() => FL.woodMix([{k:2e9,rho:1000,sat:0.6},{k:1e9,rho:800,sat:0.6}])),
 minerals: R(() => MN.mixMinerals([{name:'quartz',frac:0.7},{name:'clay',frac:0.2}])),
 bg: R(() => AT.backgroundSlope(1.2)), fl2: R(() => AT.fitFluidLine([{a:0.1,b:-0.2},{a:0.2,b:-0.3}])),
 zo: R(() => AV.zoeppritzRpp(2000,2100,2300,3000,1500,2400,10)),
 lvl: R(() => ES.predictVs(tr.fit, 3100, { level: 1.2 })),
 svNeg: R(() => GS.substituteVels(-3000,1500,2300,36e9,0.2,{k:1e9,rho:800},{k:2.6e9,rho:1000})),
 svPhi0: R(() => GS.substituteVels(3000,1500,2300,36e9,0,{k:1e9,rho:800},{k:2.6e9,rho:1000})),
});
console.log(JSON.stringify(out, null, 0).replace(/,"/g, ',\n"'));
