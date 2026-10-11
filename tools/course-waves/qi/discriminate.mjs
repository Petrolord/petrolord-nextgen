// THE DISCRIMINATE SWEEP over every QI capstone field (the Associate six today).
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
const { associateFields } = await import('./qi_capstone.mjs');
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
const truthRows = Object.fromEntries(associateFields(C).map((r) => [r.key, r.value]));

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
