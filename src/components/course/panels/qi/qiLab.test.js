// THE QI TEACHING LAB AGAINST THE TEACHING DIGEST (the Associate sections).
//
// The digest is printed from this lab by the wave's qi_dump.mjs. This suite
// recomputes, through the lab, the figures the Associate sections print and
// requires each one to appear in the digest at the digest's own precision (six
// decimals, or a whole count), so a lab change that moves a lesson figure fails
// here. The digest is read from the committed wave mirror (tools/course-waves/qi)
// when it is registered, else from NEXTGEN_WAVE_DIR_QI, else from the live wave
// directory, and the suite prints which copy it read. With none of the three it
// fails: absence is a failure, never a skip.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import * as L from './qiLab.js';
import * as P from './qiLabPro.js';
import { qiWaveInput } from './qiCaseFigures.testkit.js';

const f6 = (x) => { const s = x.toFixed(6); return s === '-0.000000' ? '0.000000' : s; };
const LIVE = ['', 'root', 'qi-wip-qi', 'digest.txt'].join('/');

async function digest() {
  const src = await qiWaveInput('digest.txt');
  if (!src.missing) return { text: fs.readFileSync(src.path, 'utf8'), from: src.from };
  if (fs.existsSync(LIVE)) return { text: fs.readFileSync(LIVE, 'utf8'), from: `the live wave directory (${src.missing})` };
  throw new Error(`[qi lab] no digest to check against: ${src.missing}`);
}

/** Every figure the Associate sections print from the lab, as [label, printed string]. */
function associateFigures() {
  const out = [];
  const add = (label, v) => out.push([label, Number.isInteger(v) && !String(label).startsWith('six:') ? String(v) : f6(v)]);
  const E = L.EKENE;
  const E1 = L.packWell('Ekene-1');
  const fluids = L.fluidsAt(L.PACK.conditions.ekene);
  // seismic QC
  for (const [a, b] of [...E.qcWindowsMs, [E.qcWindowsMs[0][0], E.qcWindowsMs[1][1]]]) {
    const s = L.spectrum(L.timeWindow(L.qcTraces('spread'), { t0Ms: a, t1Ms: b }), L.QC_CLOCK.dtMs, { taper: E.qcTaper });
    ['peakHz', 'centroidHz', 'low6Hz', 'high6Hz', 'bandwidth6Hz', 'low20Hz', 'high20Hz'].forEach((k) => add(`spectrum ${a}-${b} ${k}`, s[k]));
  }
  for (const tp of [0, 0.25, 0.5]) {
    const s = L.spectrum(L.timeWindow(L.qcTraces('spread'), { t0Ms: E.qcWindowsMs[0][0], t1Ms: E.qcWindowsMs[0][1] }), L.QC_CLOCK.dtMs, { taper: tp });
    add(`taper ${tp} peak`, s.peakHz); add(`taper ${tp} low6`, s.low6Hz);
  }
  for (const [a, b] of E.qcWindowsMs) {
    const sn = L.snr(L.timeWindow(L.qcTraces('neighbours'), { t0Ms: a, t1Ms: b }), { maxLag: E.snrMaxLag });
    add(`snr ${a}-${b}`, sn.snr); add(`snr dB ${a}-${b}`, sn.snrDb);
  }
  const fp = L.stripe(L.packSlice(), { minPeriod: E.footprintPeriods[0], maxPeriod: E.footprintPeriods[1] });
  add('footprint crossline period', fp.alongCrossline.period); add('footprint crossline share', fp.alongCrossline.share); add('footprint inline prominence', fp.alongInline.prominence);
  const fpP = L.stripe(L.withStripe(L.packSlice(), { period: 6, gain: 1.2 }), { minPeriod: E.footprintPeriods[0], maxPeriod: E.footprintPeriods[1] });
  add('designed stripe period', fpP.alongCrossline.period); add('designed stripe share', fpP.alongCrossline.share);
  // shear
  const wet = L.zoneSamples(E1, 'water');
  add('water leg samples', wet.length);
  add('GC mean ratio', L.shearAgainstGc(wet).meanRatio);
  const tr = L.shearTrend(wet, { form: 'linear', level: E.shearLevel, at: [2900, 3100, 3300, 3700] });
  add('trend c0', tr.coef[0]); add('trend c1', tr.coef[1]); add('trend s', tr.s); add('trend r2', tr.r2);
  tr.predictions.forEach((p) => { add(`pred vs ${p.vp}`, p.vs); add(`pred lo ${p.vp}`, p.lo); add(`pred hi ${p.vp}`, p.hi); });
  // elastic set
  const layers = ['shale', 'oil', 'water'].map((z) => L.layerMeans(L.zoneSamples(E1, z)));
  layers.forEach((m, i) => { const e = L.elastic(m.vp, m.vs, m.rho); add(`layer ${i} ai`, e.ai); add(`layer ${i} vpvs`, e.vpvs); add(`layer ${i} pr`, e.pr); });
  // fluids and substitution
  add('brine rho', fluids.brine.rho); add('brine vp', fluids.brine.vp); add('oil rho', fluids.oil.rho); add('oil vp', fluids.oil.vp);
  add('degC', fluids.tC); add('MPa', fluids.pMPa); add('gor L/L', fluids.gorLL);
  const sub = L.substituteZone(L.zoneSamples(E1, 'oil'), fluids);
  add('sub ai before', sub.aiBefore); add('sub ai after', sub.aiAfter); add('sub vpvs before', sub.vpvsBefore); add('sub vpvs after', sub.vpvsAfter);
  add('sub ai percent', (100 * (sub.aiAfter - sub.aiBefore)) / sub.aiBefore);
  // wet trend, distance, AVO
  const wt = L.wetTrend(E1, fluids, { blockFt: E.trendBlockFt });
  add('wet slope', wt.line.slope); add('wet angle', wt.line.angleDeg); add('wet rms', wt.line.rmsDistance); add('castagna slope', wt.castagnaSlope); add('wet vs/vp', wt.vsVp);
  const brine = { vp: sub.vpAfter, vs: sub.vsAfter, rho: sub.rhoAfter };
  const abIn = L.interfaceAB(layers[0], layers[1]);
  const abBr = L.interfaceAB(layers[0], brine);
  add('A in situ', abIn.a); add('B in situ', abIn.b); add('A brine', abBr.a); add('B brine', abBr.b);
  add('distance in situ', L.distance(abIn.a, abIn.b, wt.line.slope)); add('distance brine', L.distance(abBr.a, abBr.b, wt.line.slope));
  const avo = L.modelledAvo(layers[0], layers[1]);
  avo.exact.forEach((x) => add(`R in situ ${x.angle}`, x.r));
  Object.entries(avo.stackMeans).forEach(([k, v]) => add(`stack ${k}`, v));
  return out;
}

describe('THE QI LAB REPRODUCES THE ASSOCIATE DIGEST', () => {
  it('every Associate figure the lab returns is printed in the digest', async () => {
    const d = await digest();
    console.log(`[qi lab] digest read from ${d.from}`);
    const figs = associateFigures();
    expect(figs.length).toBeGreaterThan(90);
    const absent = figs.filter(([, s]) => !d.text.includes(s)).map(([l, s]) => `${l} ${s}`);
    expect(absent).toEqual([]);
  });

  it('NEGATIVE CONTROL: a figure moved by one unit in the sixth decimal is not in the digest', async () => {
    const d = await digest();
    const moved = associateFigures().filter(([, s]) => s.includes('.')).slice(0, 25)
      .map(([l, s]) => [l, f6(Number(s) + 1e-6 * (Number(s) >= 0 ? 1 : -1))]);
    const found = moved.filter(([, s]) => d.text.includes(s));
    expect(found.length).toBeLessThanOrEqual(1);
  });

  it('a case well and its traces are read by column name, and missing parts are named', () => {
    expect(L.caseWell({}).error).toBe('The case has no well block.');
    expect(L.caseWell({ well: { topFt: 1, baseFt: 2, owcFt: 1.5, columns: ['md_ft'], rows: [] } }).error).toMatch(/no column vp/);
    expect(L.caseTraces({ traces: { traces: [[1]] } }).error).toMatch(/dt_ms/);
  });

  it('an engine refusal comes back as the engine\'s own words', () => {
    expect(L.fluidsAt({ tF: 180, pPsia: 0, salinity: 0.035, api: 32, gorScfStb: 400, gasSg: 0.75 }).error).toBe('Temperature (degC) and positive pressure (MPa) required.');
    expect(L.snr([[1, 2, 3]]).error).toBe('Signal-to-noise needs at least two neighbouring traces.');
  });
});

/** Every figure the Professional sections print from the lab, as [label, printed string]. */
function professionalFigures() {
  const out = [];
  const add = (label, v) => out.push([label, f6(v)]);
  const addN = (label, n) => out.push([label, String(n)]);
  const E = P.EKENE_PRO;
  const WELLS = L.PACK_WELLS;
  const tab = P.packVelocity();
  // wavelets, synthetic, phase, bulk shift
  const sw1 = P.wellStatWavelet('Ekene-1');
  const tr1 = P.wellTrace('Ekene-1', 'full');
  const syn1 = P.synthetic('Ekene-1', sw1);
  addN('live synthetic samples', syn1.live);
  WELLS.forEach((w) => {
    const sw = P.wellStatWavelet(w); const sp = P.waveletSpectrum(sw, 4);
    add(`${w} wavelet peak`, sp.peakHz); add(`${w} wavelet centroid`, sp.centroidHz);
    const sy = P.synthetic(w, sw); const t = P.wellTrace(w, 'full');
    const b = P.bulkShift(sy.synthetic, t.values, t.dtMs); add(`${w} bulk shift`, b.lagMs); add(`${w} bulk corr`, b.corr);
    const pw = L.packWell(w); add(`${w} top twt`, P.checkshotTwt(w, pw.topFt));
  });
  const ph = P.phaseMatch(syn1.synthetic, tr1.values); add('phase', ph.phiDeg); add('phase corr', ph.corr); add('phase corr0', ph.corr0);
  for (const sh of [-8, 8]) { const sy = P.synthetic('Ekene-1', sw1, { shiftMs: sh }); add(`shift ${sh}`, P.bulkShift(sy.synthetic, tr1.values, tr1.dtMs).lagMs); }
  // wavelets across wells
  const cmp = P.compare(WELLS.map((w) => ({ name: w, samples: P.wellStatWavelet(w) })));
  cmp.misfit.forEach((m) => add(`misfit ${m.name}`, m.corrToAverage));
  add('field wavelet peak', P.waveletSpectrum(Array.from(cmp.average), 4).peakHz);
  // gathers
  const g = P.packGather(5);
  const top = P.pickEvent(g, g.traces[0], 1289); add('top on gather 5', top.tMs);
  const v = P.velocityAt(tab, top.tMs); add('vrms at top', v.vrms); add('vint at top', v.vint);
  g.offsets.filter((_, k) => k % 2 === 0).forEach((x) => add(`stretch ${x}`, P.stretch(x, top.tMs, v.vrms)));
  add('mute 0.3', P.muteOffset(top.tMs, v.vrms, E.maxStretch));
  add('rmo far', P.rmo(g, top.tMs).rmoFarMs);
  P.dix(tab).forEach((x, i) => add(`dix ${i}`, x));
  [500, 1000, 1500, 2000, 2500].forEach((x) => add(`walden ${x}`, P.walden(x, top.tMs, v.vrms, v.vint)));
  // angles and AVO
  const ag = P.angles(g, tab, { edges: E.angleEdges });
  const i = Math.round((top.tMs - g.t0Ms) / g.dtMs);
  ag.gather.forEach((b, k) => add(`bin ${k}`, b[i]));
  const f2 = P.shueyFit(E.stackAngles, ag.gather.map((b) => b[i]), { terms: 2 });
  const f3 = P.shueyFit(E.stackAngles, ag.gather.map((b) => b[i]), { terms: 3 });
  add('A2', f2.A); add('B2', f2.B); add('A3', f3.A); add('C3', f3.C);
  WELLS.forEach((w) => { const o = P.observedAtWell(w); const m = P.modelledAtWell(w); add(`${w} seismic A`, o.A); add(`${w} seismic B`, o.B); add(`${w} modelled A`, m.A); });
  return out;
}

describe('THE QI LAB REPRODUCES THE PROFESSIONAL DIGEST', () => {
  it('every Professional figure the lab returns is printed in the digest', async () => {
    const d = await digest();
    if (!d.text.includes('# SECTION 22:')) throw new Error(`[qi lab] the digest read from ${d.from} has no Professional sections`);
    const figs = professionalFigures();
    expect(figs.length).toBeGreaterThan(60);
    const absent = figs.filter(([, s]) => !d.text.includes(s)).map(([l, s]) => `${l} ${s}`);
    expect(absent).toEqual([]);
  });

  it('NEGATIVE CONTROL: a Professional figure moved by one unit in the sixth decimal is not in the digest', async () => {
    const d = await digest();
    const moved = professionalFigures().filter(([, s]) => s.includes('.') && Number(s) !== 0).slice(0, 25)
      .map(([l, s]) => [l, f6(Number(s) + 1e-6 * (Number(s) >= 0 ? 1 : -1))]);
    expect(moved.filter(([, s]) => d.text.includes(s)).length).toBeLessThanOrEqual(1);
  });

  it('a Professional refusal comes back as the engine\'s own words', () => {
    expect(P.dix({ tMs: [1000, 1100], vrms: [2500, 2000] }).error).toBe('The RMS velocities give no real interval velocity at 1.1 s.');
    expect(P.offsetBins([100, 200], 0).error).toBe('The offset bin width must be positive.');
  });
});

/* ------------------------------------------------------------------ Expert */
import * as X from './qiLabExp.js';
import { mulberry32 } from '@petrolord/engines/lib/stats/stats.js';

/** Every figure the Expert sections print from the Expert lab, as [label, printed string]. */
function expertFigures() {
  const out = [];
  const add = (label, v) => out.push([label, f6(v)]);
  const fin = Number.isFinite;
  const S = X.ekeneSetup();
  const E1 = S.logs.find((l) => l.name === 'Ekene-1');
  const ms = (i) => S.win.t0Ms + i * S.win.dtMs;
  const cov = (l) => l.lnAi.map((v, i) => (fin(v) ? i : -1)).filter((i) => i >= 0);
  S.logs.forEach((l) => { add(`${l.name} top ms`, l.horizonsMs[0]); add(`${l.name} base ms`, l.horizonsMs[1]); add(`${l.name} first logged`, ms(cov(l)[0])); });
  // the adjoint test on the stated seed
  const rng = mulberry32(42);
  const xv = Array.from({ length: S.win.ns }, () => rng() - 0.5);
  const yv = Array.from({ length: S.win.ns }, () => rng() - 0.5);
  const dot = (a, b) => a.reduce((t, v, i) => t + v * b[i], 0);
  add('adjoint D', dot(X.diffCentred(xv), yv)); add('adjoint C', dot(X.convolveCentred(xv, S.wavelet), yv));
  add('scale', S.scale);
  const iTop = Math.round((E1.horizonsMs[0] - S.win.t0Ms) / S.win.dtMs);
  // the LFM at each well
  S.logs.forEach((l) => {
    const at = { x: l.x, y: l.y, horizons: l.horizonsMs };
    const blind = X.lfmAt(S.lfm, at, S.win, { exclude: l.name });
    add(`${l.name} lfm blind at top`, blind[iTop]);
    add(`${l.name} lfm-only error`, X.scoreOf(blind, X.truthOf(l)).rmsPct);
  });
  // model-based, iterations and weights
  const mb = X.invertAt(S, 'Ekene-1', { exclude: true });
  add('mb residual', mb.residualRms);
  [-2, 0, 2, 4, 6].forEach((d) => add(`mb ai ${d}`, mb.ai[iTop + d]));
  [20, 120, 300].forEach((it) => add(`iters ${it} error`, X.scoreOf(X.invertAt(S, 'Ekene-1', { exclude: true, iters: it }).m, X.truthOf(E1)).rmsPct));
  [1, 5].forEach((eps) => add(`eps ${eps} error`, X.scoreOf(X.invertAt(S, 'Ekene-1', { exclude: true, eps, iters: 300 }).m, X.truthOf(E1)).rmsPct));
  // blind wells, model-based and sparse-spike
  X.blindTable(S).forEach((r) => { add(`${r.name} blind corr`, r.blind.corr); add(`${r.name} blind error`, r.blind.rmsPct); add(`${r.name} kept error`, r.withWell.rmsPct); });
  X.blindTable(S, 'sparse_spike').forEach((r) => add(`${r.name} sparse error`, r.blind.rmsPct));
  // coloured
  const co = X.colouredAt(S);
  add('alpha', co.alpha); co.slopes.forEach((x) => add(`${x.name} alpha`, x.alpha));
  // realisations
  const sp = X.spreadAt(S, 'Ekene-1');
  [-2, 0, 2, 4].forEach((d) => { add(`q10 ${d}`, sp.q10[iTop + d]); add(`q90 ${d}`, sp.q90[iTop + d]); });
  // simultaneous
  const M = X.ekeneSimSetup(S);
  add('vs/vp', M.vsVp); M.scales.forEach((x, i) => add(`stack scale ${i}`, x.scale));
  X.fattiCoefficients([10, 20, 30, 40], M.vsVp).forEach((g, i) => { add(`G1 ${i}`, g[0]); add(`G3 ${i}`, g[2]); });
  S.logs.forEach((l) => { const sc = X.scoreSim(X.simAt(S, M, l.name, { exclude: true }), l); add(`${l.name} sim ai corr`, sc.ai.corr); add(`${l.name} sim rho error`, sc.rho.rmsPct); });
  // properties
  const logS = X.logScaleSamples();
  const pt = X.porosityTransform(logS.filter((s) => s.facies !== 'shale'), [6.5e6, 7e6, 7.5e6, 8.5e6]);
  add('transform a', pt.fit.a); add('transform s', pt.fit.s); add('transform r2', pt.fit.r2);
  pt.predictions.forEach((p) => { add(`phi ${p.ai}`, p.y); add(`phi hi ${p.ai}`, p.hi); });
  const fm = X.faciesModel(logS, { at: [[6.0e6], [6.6e6], [7.2e6], [7.8e6]] });
  fm.model.classes.forEach((c) => { add(`${c.name} prior`, c.prior); add(`${c.name} mean`, c.mean[0]); });
  fm.posteriors.forEach((p, i) => add(`posterior oil ${i}`, p.probs[1]));
  add('accuracy one', fm.confusion.accuracy);
  add('accuracy two', X.faciesModel(logS, { attrs: ['ai', 'vpvs'] }).confusion.accuracy);
  // closure and conformance on the Ekene grid
  const g = X.gridFt();
  const c = X.closureOf(g);
  add('crest', c.crestZ); add('spill', c.spillZ); add('column', c.columnFt); add('grv', c.atSpill.grvM3);
  const cA = X.conformanceOf(g, X.maskAbove(g, c.spillZ), c.spill);
  add('conformance A', cA.conformance); add('implied contact A', cA.impliedContactZ);
  return out;
}

describe('THE QI LAB REPRODUCES THE EXPERT DIGEST', () => {
  it('every Expert figure the lab returns is printed in the digest', async () => {
    const d = await digest();
    if (!d.text.includes('# SECTION 42:')) throw new Error(`[qi lab] the digest read from ${d.from} has no Expert sections`);
    const figs = expertFigures();
    expect(figs.length).toBeGreaterThan(100);
    const absent = figs.filter(([, s]) => !d.text.includes(s)).map(([l, s]) => `${l} ${s}`);
    expect(absent).toEqual([]);
  });

  it('NEGATIVE CONTROL: an Expert figure moved by one unit in the sixth decimal is not in the digest', async () => {
    const d = await digest();
    const moved = expertFigures().filter(([, s]) => s.includes('.') && Number(s) !== 0).slice(0, 30)
      .map(([l, s]) => [l, f6(Number(s) + 1e-6 * (Number(s) >= 0 ? 1 : -1))]);
    expect(moved.filter(([, s]) => d.text.includes(s)).length).toBeLessThanOrEqual(1);
  });

  it('an Expert refusal comes back as the engine\'s own words', () => {
    expect(X.modelBasedOn({ d: [1, 2, 3, 4, 5], wavelet: [0, 1, 0], m0: [1, 1, 1, 1, 1], eps: -1, iters: 5 }).error).toBe('The regularisation weight must be zero or positive.');
    expect(X.porosityTransform([{ ai: 1, phit: 0.2 }, { ai: 2, phit: 0.1 }]).error).toBe('A transform needs at least three calibration points.');
  });
});
