// THE DISCRIMINATE SWEEP over every QI capstone field (all eighteen: Associate, Professional and Expert).
//
// The programme rule: a gate that restates the formula validates nothing. For
// each graded field, does a PLAUSIBLE WRONG METHOD move it past its own
// ABSOLUTE tolerance? A field no plausible error moves grades nothing.
//
// The TRUTH of each field is the lab call qi_capstone.mjs makes on the case
// file, checked against fields.json bit for bit. The wrong methods are the
// mistakes a learner makes, run through the same teaching lab (qiLab.js) or the
// vendored engines with ONE thing changed: a stated input ignored (the taper,
// the net sand cut, the block length, the cap-rock thickness), the wrong
// selection (one trace, the oil leg, all net sand), the wrong reading of a
// result (the -20 dB edge, the peak, an amplitude-weighted centroid), the wrong
// physics (a Voigt fluid mix, a pure quartz mineral, Greenberg-Castagna), or the
// wrong object (the in situ sample, the brine interface, the published line).
//
// A field is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). The closest miss
// is reported in tolerances, so "it discriminates" arrives with a margin.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e15 and must report every field
// WEAK, proving the sweep reads the tolerances rather than printing a constant.
//
// Exit 0 clean, 1 if any field is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { register } from 'node:module';

register('./qi_loader.mjs', import.meta.url);
const HERE = path.dirname(new URL(import.meta.url).pathname);
const { LAB: L, REPO } = await import('./qi_engine.mjs');
const { associateFields, professionalFields } = await import('./qi_capstone.mjs');
const { LABP: P } = await import('./qi_engine_p.mjs');
const PS = await import('@petrolord/engines/engines/qi/prestack.js');
const FL = await import('@petrolord/engines/engines/rockphysics/fluids.js');
const GS = await import('@petrolord/engines/engines/rockphysics/gassmann.js');
const ES = await import('@petrolord/engines/engines/rockphysics/elasticSet.js');
const MN = await import('@petrolord/engines/engines/rockphysics/minerals.js');

const SLACK = process.argv.includes('--slack-tolerances') ? 1e15 : 1;
const say = (s) => console.log(s);
const die = (m) => { say(`discriminate REFUSES: ${m}`); process.exit(2); };
const fields = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(HERE, 'fields.json'), 'utf8')).map((r) => [r[1], r]));
if (!Object.keys(fields).length) die('fields.json is empty');
const C = JSON.parse(fs.readFileSync(path.join(REPO, 'src/content/capstone-cases/qi/tamberlo_case.json'), 'utf8'));
const Q = JSON.parse(fs.readFileSync(path.join(REPO, 'src/content/capstone-cases/qi/quarvin_case.json'), 'utf8'));
const truthRows = Object.fromEntries([...associateFields(C), ...professionalFields(Q)].map((r) => [r.key, r.value]));

const st = C.stated;
const T = L.caseTraces(C);
const W = L.caseWell(C);
const fluids = L.fluidsAt(C.conditions);
const spec = (traces, taper = st.taper) => L.spectrum(traces, T.dtMs, { taper });
const ampCentroid = (s) => { let a = 0; let b = 0; s.amp.forEach((v, k) => { a += v * s.freqHz[k]; b += v; }); return a / b; };
const slope = (samples, form = st.shearForm) => L.shearTrend(samples, { form }).coef[1];
const zs = (zone, o = {}) => L.zoneSamples(W, zone, { vshCut: st.netSandVshCut, shaleAboveFt: st.shaleAboveFt, ...o });
const sample = L.sampleAt(W, st.substitutionSampleFt);
const sub = (s, fl = fluids) => L.substituteSample(s, fl, { toSw: 1 });
// a wrong-physics substitution, built from the engines with one piece swapped
const subWith = (s, { mix = 'wood', mineral = 'vrh' } = {}) => {
  const ph = (sw) => [{ ...fluids.brine, sat: sw }, { ...fluids.oil, sat: 1 - sw }];
  const flA = mix === 'voigt' ? FL.voigtMix(ph(s.sw)) : FL.woodMix(ph(s.sw));
  const flB = FL.woodMix(ph(1));
  const kmin = mineral === 'quartz' ? MN.MINERALS.quartz.k : MN.mixMinerals([{ name: 'quartz', frac: 1 - s.vsh }, { name: 'clay', frac: s.vsh }]).k;
  const o = GS.substituteVels(s.vp, s.vs, s.rho, kmin, s.phit, flA, flB);
  return ES.elasticPoint(o.vp, o.vs, o.rho);
};
const meanSw = L.layerMeans(zs('oil')).sw;
const neighbour = L.sampleAt(W, st.substitutionSampleFt + 0.5);
const dist = ({ capFt = st.shaleAboveFt, blockFt = st.trendBlockFt, lower = 'oil', line = 'fit' } = {}) => {
  const shale = L.layerMeans(zs('shale', { shaleAboveFt: capFt }));
  const lowerM = lower === 'brine' ? (() => { const z = L.substituteZone(zs('oil'), fluids); return { vp: z.vpAfter, vs: z.vsAfter, rho: z.rhoAfter }; })() : L.layerMeans(zs(lower));
  const ab = L.interfaceAB(shale, lowerM);
  const wt = L.wetTrend(W, fluids, { blockFt });
  return L.distance(ab.a, ab.b, line === 'castagna' ? wt.castagnaSlope : wt.line.slope);
};

const WRONG = {
  tamberlo_low6_hz: [
    ['no taper', () => spec(T.traces, 0).low6Hz],
    ['taper 0.25', () => spec(T.traces, 0.25).low6Hz],
    ['the first trace alone', () => spec([T.traces[0]]).low6Hz],
    ['the -20 dB low edge', () => spec(T.traces).low20Hz],
    ['the peak frequency', () => spec(T.traces).peakHz],
    ['the -6 dB high edge', () => spec(T.traces).high6Hz],
  ],
  tamberlo_centroid_hz: [
    ['amplitude-weighted centroid', () => ampCentroid(spec(T.traces))],
    ['no taper', () => spec(T.traces, 0).centroidHz],
    ['the first trace alone', () => spec([T.traces[0]]).centroidHz],
    ['the peak frequency', () => spec(T.traces).peakHz],
    ['the middle of the -6 dB band', () => { const s = spec(T.traces); return (s.low6Hz + s.high6Hz) / 2; }],
  ],
  tamberlo_shear_slope: [
    ['fitted on the oil leg', () => slope(zs('oil'))],
    ['fitted on all net sand', () => slope(zs('sand'))],
    ['the quadratic form', () => slope(zs('water'), 'quadratic')],
    ['the Greenberg-Castagna sandstone slope', () => L.GC_COEFF.sandstone[1] * 1000],
    ['no net sand cut', () => slope(zs('water', { vshCut: 1 }))],
    ['a net sand cut of 0.25', () => slope(zs('water', { vshCut: 0.25 }))],
  ],
  tamberlo_ai_brine: [
    ['the in situ AI', () => sub(sample).aiBefore],
    ['the zone-mean Sw', () => sub({ ...sample, sw: meanSw }).aiAfter],
    ['a Voigt fluid mix', () => subWith(sample, { mix: 'voigt' }).ai],
    ['a pure quartz mineral', () => subWith(sample, { mineral: 'quartz' }).ai],
    ['the next sample down', () => sub(neighbour).aiAfter],
  ],
  tamberlo_vpvs_brine: [
    ['the in situ Vp/Vs', () => sub(sample).vpvsBefore],
    ['the zone-mean Sw', () => sub({ ...sample, sw: meanSw }).vpvsAfter],
    ['a Voigt fluid mix', () => subWith(sample, { mix: 'voigt' }).vpvs],
    ['a pure quartz mineral', () => subWith(sample, { mineral: 'quartz' }).vpvs],
    ['the next sample down', () => sub(neighbour).vpvsAfter],
  ],
  tamberlo_wet_distance: [
    ['from the published Castagna line', () => dist({ line: 'castagna' })],
    ['the brine interface', () => dist({ lower: 'brine' })],
    ['blocks of 8 ft', () => dist({ blockFt: 8 })],
    ['blocks of 24 ft', () => dist({ blockFt: 24 })],
    ['a cap rock of 30 ft', () => dist({ capFt: 30 })],
    ['a cap rock of 100 ft', () => dist({ capFt: 100 })],
    ['all net sand below the cap', () => dist({ lower: 'sand' })],
  ],
};

/* ------------------------------------------------ Professional: QUARVIN */
const qs = Q.stated;
const qtab = { tMs: Q.velocity.rows.map((x) => x[0]), vrms: Q.velocity.rows.map((x) => x[1]) };
const qg = { traces: Q.gather.traces, offsets: Q.gather.offsets_m, dtMs: Q.gather.dt_ms, t0Ms: Q.gather.t0_ms };
const qli = qtab.tMs.indexOf(qs.dixLayer.toMs);
const qvint = P.dix(qtab);
const qv = P.velocityAt(qtab, qs.timeMs);
const qi = Math.round((qs.targetMs - qg.t0Ms) / qg.dtMs);
const qv2 = (t) => P.velocityAt(qtab, t);
// an angle gather with Vint taken equal to Vrms (the straight ray read without Walden's ratio)
const agNoRatio = (edges = qs.angleEdges) => {
  const ns = qg.traces[0].length;
  const v = P.velocityOn(qtab, qg, ns);
  return PS.angleGather({ traces: qg.traces, offsets: qg.offsets, vrms: v.vrms, vint: v.vrms, dtMs: qg.dtMs, edges, t0Ms: qg.t0Ms });
};
const agQ = (edges = qs.angleEdges, table = qtab) => P.angles(qg, table, { edges });
const shueyAt = (ag, i, angles = qs.stackAngles, terms = qs.shueyTerms) => P.shueyFit(angles, ag.gather.map((b) => b[i]), { terms }).A;
const scaleBy = (keys) => { let so = 0; let sm = 0; for (const w of Q.wells) for (const k of keys) { so += w.observed[k] * w.modelled[k]; sm += w.modelled[k] ** 2; } return so / sm; };
Object.assign(WRONG, {
  quarvin_dix_vint: [
    ['the RMS velocity at the layer base', () => qtab.vrms[qli]],
    ['the mean of the two RMS velocities', () => (qtab.vrms[qli] + qtab.vrms[qli - 1]) / 2],
    ['the layer below', () => qvint[qli + 1]],
    ['the layer above', () => qvint[qli - 1]],
    ['the interval velocity at the stated time', () => qv.vint],
  ],
  quarvin_walden_deg: [
    ['Vint taken equal to Vrms', () => P.walden(qs.offsetM, qs.timeMs, qv.vrms, qv.vrms)],
    ['the geometric angle atan(x / (Vrms t0))', () => (Math.atan(qs.offsetM / (qv.vrms * qs.timeMs / 1000)) * 180) / Math.PI],
    ['half the offset', () => P.walden(qs.offsetM / 2, qs.timeMs, qv.vrms, qv.vint)],
    ['one-way time', () => P.walden(qs.offsetM, qs.timeMs / 2, qv.vrms, qv.vint)],
    ['the velocities of the next table row', () => { const v = qv2(qtab.tMs[qli + 1]); return P.walden(qs.offsetM, qs.timeMs, v.vrms, v.vint); }],
  ],
  quarvin_nmo_stretch: [
    ['the interval velocity as the NMO velocity', () => P.stretch(qs.offsetM, qs.timeMs, qv.vint)],
    ['one-way time', () => P.stretch(qs.offsetM, qs.timeMs / 2, qv.vrms)],
    ['half the offset', () => P.stretch(qs.offsetM / 2, qs.timeMs, qv.vrms)],
    ['stretch read as 1 - t0 / t', () => { const r = P.stretch(qs.offsetM, qs.timeMs, qv.vrms); return 1 - 1 / (1 + r); }],
    ['the RMS velocity at the layer base', () => P.stretch(qs.offsetM, qs.timeMs, qtab.vrms[qli])],
  ],
  quarvin_far_stack_amp: [
    ['every bin stacked', () => P.stackOf(agQ(), 0, qs.angleEdges.length - 1)[qi]],
    ['the mid bin', () => P.stackOf(agQ(), qs.farBins[0] - 1, qs.farBins[1] - 1)[qi]],
    ['Vint taken equal to Vrms', () => P.stackOf(agNoRatio(), qs.farBins[0], qs.farBins[1])[qi]],
    ['edges moved down five degrees', () => P.stackOf(agQ(qs.angleEdges.map((e) => e - 5)), qs.farBins[0], qs.farBins[1])[qi]],
    ['the next sample down', () => P.stackOf(agQ(), qs.farBins[0], qs.farBins[1])[qi + 1]],
  ],
  quarvin_shuey_a: [
    ['three Shuey terms', () => shueyAt(agQ(), qi, qs.stackAngles, 3)],
    ['angles at the bins\' near edges', () => shueyAt(agQ(), qi, qs.angleEdges.slice(0, -1))],
    ['the near bin amplitude', () => agQ().gather[0][qi]],
    ['Vint taken equal to Vrms', () => shueyAt(agNoRatio(), qi)],
    ['the next sample down', () => shueyAt(agQ(), qi + 1)],
  ],
  quarvin_one_scale: [
    ['intercepts alone', () => scaleBy(['A'])],
    ['gradients alone', () => scaleBy(['B'])],
    ['the mean of the wells\' own ratios', () => Q.wells.reduce((t, w) => t + (w.observed.A * w.modelled.A + w.observed.B * w.modelled.B) / (w.modelled.A ** 2 + w.modelled.B ** 2), 0) / Q.wells.length],
    ['the inverse, modelled over observed', () => 1 / scaleBy(['A', 'B'])],
    ['the first three wells', () => { let so = 0; let sm = 0; for (const w of Q.wells.slice(0, 3)) for (const k of ['A', 'B']) { so += w.observed[k] * w.modelled[k]; sm += w.modelled[k] ** 2; } return so / sm; }],
  ],
});

/* ------------------------------------------------ Expert: DELSHOLM */
const { LABE: XE } = await import('./qi_engine_e.mjs');
const { expertFields } = await import('./qi_capstone_e.mjs');
const DC = JSON.parse(fs.readFileSync(path.join(REPO, 'src/content/capstone-cases/qi/delsholm_case.json'), 'utf8'));
for (const r of expertFields(DC)) truthRows[r.key] = r.value;
const ds = DC.stated;
const DX = XE.caseExpert(DC);
const DA = DX.A;
const lfmB = (o = {}, at = DX.B) => XE.lfmAt(DX.lfm, at, DX.win, { power: ds.lfm.power, ...o });
const mbAt = (o = {}) => XE.modelBasedOn({ d: DA.full, wavelet: DA.fullWavelet, m0: DA.lowFrequencyModels.lnAi, eps: ds.modelBased.eps, iters: ds.modelBased.iters, ...o });
const simAt = (o = {}) => XE.simultaneousOn({ traces: DA.angleTraces, thetaDeg: DA.angles_deg, wavelets: DA.angleWavelets, vsVp: DA.backgroundVsVp, m0: DA.lowFrequencyModels, eps: ds.simultaneous.eps, iters: ds.simultaneous.iters, ...o });
const vpvsOf = (r, k = ds.simultaneous.sampleA) => Math.exp(r.lnAi[k] - r.lnSi[k]);
const flat = (a) => { const m = a.reduce((t, v) => t + v, 0) / a.length; return a.map(() => m); };
const kA = ds.modelBased.sampleA;
const porFit = (o = {}) => XE.porosityTransform(DX.porositySamples, [ds.porosity.atAi], o.level ?? ds.porosity.level);
const facAt = (o = {}) => XE.faciesModel(DX.faciesSamples, { attrs: ['ai'], kind: ds.facies.kind, at: [[o.ai ?? ds.facies.atAi]], ...o });
const pOf = (f, name = ds.facies.class) => f.posteriors[0].probs[f.model.classes.findIndex((m) => m.name === name)];
const dg = DX.grid;
const second = (() => { let best = -1; let bd = Infinity; for (let i = 0; i < dg.z.length; i++) { const x = (i % dg.spec.nx) * dg.spec.dx; const y = Math.floor(i / dg.spec.nx) * dg.spec.dy; const d = (x - 7400) ** 2 + (y - 4300) ** 2; if (d < bd) { bd = d; best = i; } } return best; })();
Object.assign(WRONG, {
  delsholm_lfm_lnai_b: [
    ['inverse distance power 1', () => lfmB({ power: 1 })[ds.lfm.sampleB]],
    ['power 0, a plain mean of the wells', () => lfmB({ power: 0 })[ds.lfm.sampleB]],
    ['at constant time, the horizons ignored', () => XE.lfmAt(DX.lfm.map((w) => ({ ...w, horizons: undefined })), { x: DX.B.x, y: DX.B.y }, DX.win, { power: ds.lfm.power })[ds.lfm.sampleB]],
    ['one sample late', () => lfmB()[ds.lfm.sampleB + 1]],
    ['the target position in place of the second', () => lfmB({}, { x: DA.x, y: DA.y, horizons: DX.B.horizons })[ds.lfm.sampleB]],
  ],
  delsholm_mb_ai: [
    ['a flat LFM, the mean of the supplied one', () => mbAt({ m0: flat(DA.lowFrequencyModels.lnAi) }).ai[kA]],
    ['the LFM alone, no inversion', () => Math.exp(DA.lowFrequencyModels.lnAi[kA])],
    ['eps ten times the stated', () => mbAt({ eps: 10 * ds.modelBased.eps }).ai[kA]],
    ['the far-angle trace in place of the full stack', () => mbAt({ d: DA.angleTraces[2] }).ai[kA]],
    ['the near-angle wavelet', () => mbAt({ wavelet: DA.angleWavelets[0] }).ai[kA]],
    ['one sample late', () => mbAt().ai[kA + 1]],
  ],
  delsholm_sim_vpvs: [
    ['the near trace alone', () => vpvsOf(simAt({ traces: [DA.angleTraces[0]], thetaDeg: [DA.angles_deg[0]], wavelets: [DA.angleWavelets[0]] }))],
    ['the full-stack wavelet for every angle', () => vpvsOf(simAt({ wavelets: DA.angleWavelets.map(() => DA.fullWavelet) }))],
    ['a background Vs/Vp of 0.5', () => vpvsOf(simAt({ vsVp: 0.5 }))],
    ['the LFMs alone', () => Math.exp(DA.lowFrequencyModels.lnAi[ds.simultaneous.sampleA] - DA.lowFrequencyModels.lnSi[ds.simultaneous.sampleA])],
    ['Vs/Vp read in place of Vp/Vs', () => 1 / vpvsOf(simAt())],
    ['one sample late', () => vpvsOf(simAt(), ds.simultaneous.sampleA + 1)],
  ],
  delsholm_phi_q90: [
    ['the 90 percent interval', () => porFit({ level: 0.9 }).predictions[0].hi],
    ['the predicted porosity', () => porFit().predictions[0].y],
    ['the low end of the interval', () => porFit().predictions[0].lo],
    ['the 80 percent interval read as the 60 percent', () => porFit({ level: 0.6 }).predictions[0].hi],
    ['y + 1.2816 s, a normal quantile and no leverage', () => { const f = porFit().fit; return f.a + f.b * ds.porosity.atAi + 1.2815515655446004 * f.s; }],
  ],
  delsholm_p_oil: [
    ['equal priors', () => pOf(facAt({ priors: { shale: 1, 'brine sand': 1, 'oil sand': 1 } }))],
    ['a kernel density', () => pOf(facAt({ kind: 'kde' }))],
    ['the brine-sand posterior', () => pOf(facAt(), 'brine sand')],
    ['the oil-sand prior alone', () => facAt().model.classes.find((m) => m.name === ds.facies.class).prior],
    ['at the porosity transform\'s AI', () => pOf(facAt({ ai: ds.porosity.atAi }))],
  ],
  delsholm_column_ft: [
    ['the column in metres', () => truthRows.delsholm_column_ft * 0.3048],
    ['the second culmination\'s trap', () => XE.trapFrom(dg, second).columnFt],
    ['crest less the mean of the mapped nodes', () => { const c = XE.closureOf(dg); const z = Array.from(dg.z).filter((v) => Math.abs(v) < 1e29); return c.crestZ - z.reduce((t, v) => t + v, 0) / z.length; }],
    ['crest less the lowest mapped node', () => { const c = XE.closureOf(dg); return c.crestZ - Math.min(...Array.from(dg.z).filter((v) => Math.abs(v) < 1e29)); }],
  ],
});

const JSON_OUT = process.argv.includes('--json');
if (JSON_OUT) {
  const o = {};
  for (const [key, [, , value]] of Object.entries(fields)) {
    const wrong = {};
    for (const [name, fn] of WRONG[key]) { let v = null; try { v = fn(); } catch { v = null; } wrong[name] = Number.isFinite(v) ? v : null; }
    o[key] = { truth: truthRows[key], expected: value, wrong };
  }
  process.stdout.write(`${JSON.stringify(o)}\n`);
  process.exit(0);
}
let weak = 0;
let closest = { d: Infinity };
const table = [];
for (const [key, [, , value, tol0]] of Object.entries(fields)) {
  const tol = tol0 * SLACK;
  const truth = truthRows[key];
  if (truth !== value) die(`${key}: the lab gives ${truth}, fields.json holds ${value}`);
  const ws = WRONG[key];
  if (!ws) die(`no wrong methods are written for ${key}`);
  let moves = 0;
  let blind = 0;
  let minD = Infinity;
  const out = [];
  for (const [name, fn] of ws) {
    let v;
    try { v = fn(); } catch (e) { out.push(`${name} REFUSED (${String(e.message).slice(0, 60)})`); blind += 1; continue; }
    if (!Number.isFinite(v)) { out.push(`${name} not a number`); blind += 1; continue; }
    const d = Math.abs(v - truth) / tol;
    if (d > 1) moves += 1; else blind += 1;
    minD = Math.min(minD, d);
    if (d < closest.d) closest = { d, key, w: name };
    out.push(`${name} ${d.toExponential(2)}${d > 1 ? '' : ' BLIND'}`);
  }
  const isWeak = moves < 3 || blind > 0;
  if (isWeak) weak += 1;
  table.push([key, ws.length, moves, minD]);
  say(`${isWeak ? 'WEAK ' : 'ok   '} ${key}  (${moves} of ${ws.length} wrong methods move it; closest ${minD.toExponential(3)} tolerances)`);
  say(`        wrong, in tolerances: ${out.join('; ')}`);
}
say(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.w}, ${closest.d.toExponential(3)} tolerances away`);
const n = Object.keys(fields).length;
if (SLACK !== 1) {
  say(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected ${n} WEAK fields, got ${weak}.`);
  process.exit(weak === n ? 1 : 2);
}
say(`FIELDS: ${n}; WEAK: ${weak}`);
process.exit(weak ? 1 : 0);
