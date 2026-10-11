// THE QI CAPSTONE FIELDS, computed from each case file's content through the
// teaching lab (qiLab.js), the same functions the panels call. Every field is
// a return value of a vendored engine: the call that returns it is named
// beside it. The case files are the ones qi_cases.mjs writes into the NextGen
// worktree, read back from disk, so a field depends only on what a learner is
// given.
//
//   node qi_capstone.mjs           print the fields, one per line
//   node qi_capstone.mjs --json    the same as JSON (make_fields.mjs reads this)
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { register } from 'node:module';

register('./qi_loader.mjs', import.meta.url);
const { LAB: L, REPO } = await import('./qi_engine.mjs');
const { LABP: P } = await import('./qi_engine_p.mjs');
const { expertFields } = await import('./qi_capstone_e.mjs');

const CASE_DIR = path.join(REPO, 'src/content/capstone-cases/qi');
const readCase = (k) => JSON.parse(fs.readFileSync(path.join(CASE_DIR, `${k}_case.json`), 'utf8'));
const must = (x, what) => { if (!x || x.error) throw new Error(`${what}: ${x && x.error}`); return x; };

export function associateFields(c) {
  const st = c.stated;
  const T = must(L.caseTraces(c), 'traces');
  const W = must(L.caseWell(c), 'well');
  const fluids = must(L.fluidsAt(c.conditions), 'fluids');
  const spec = must(L.spectrum(T.traces, T.dtMs, { taper: st.taper }), 'spectrum');
  const wet = must(L.zoneSamples(W, 'water', { vshCut: st.netSandVshCut }), 'water leg');
  const trend = must(L.shearTrend(wet, { form: st.shearForm }), 'shear trend');
  const sample = must(L.sampleAt(W, st.substitutionSampleFt), 'sample');
  const sub = must(L.substituteSample(sample, fluids, { toSw: 1 }), 'substitution');
  const shale = must(L.layerMeans(L.zoneSamples(W, 'shale', { shaleAboveFt: st.shaleAboveFt })), 'cap rock');
  const oil = must(L.layerMeans(L.zoneSamples(W, 'oil', { vshCut: st.netSandVshCut })), 'oil leg');
  const ab = must(L.interfaceAB(shale, oil), 'interface');
  const wt = must(L.wetTrend(W, fluids, { blockFt: st.trendBlockFt }), 'wet trend');
  return [
    { tier: 'beginner', key: 'tamberlo_low6_hz', cls: 'frequency', value: spec.low6Hz, call: 'averageSpectrum + spectrumStats band6[0]' },
    { tier: 'beginner', key: 'tamberlo_centroid_hz', cls: 'frequency', value: spec.centroidHz, call: 'averageSpectrum + spectrumStats centroidHz' },
    { tier: 'beginner', key: 'tamberlo_shear_slope', cls: 'slope', value: trend.coef[1], call: 'fitVsRegression coef[1]' },
    { tier: 'beginner', key: 'tamberlo_ai_brine', cls: 'impedance', value: sub.aiAfter, call: 'substituteVels then elasticPoint ai' },
    { tier: 'beginner', key: 'tamberlo_vpvs_brine', cls: 'ratio', value: sub.vpvsAfter, call: 'substituteVels then elasticPoint vpvs' },
    { tier: 'beginner', key: 'tamberlo_wet_distance', cls: 'ratio', value: L.distance(ab.a, ab.b, wt.line.slope), call: 'shuey, fitFluidLine, distanceFromLine' },
  ];
}

/* ---------------------------------------------------- Professional: QUARVIN */
// Every field through the vendored engines via qiLabPro.js (qi/prestack,
// qi/prestackQc, qi/avo and qi/avoWells, gated by E1a, E1b and E2). One change
// from the plan's list: its "usable angle at the stated minimum fold" returns a
// bin edge, a small set a learner could guess, so the fourth field is the far
// partial stack amplitude at the target sample, which runs the same angle
// gather, fold and mute.
export function professionalFields(c) {
  const st = c.stated;
  const table = { tMs: c.velocity.rows.map((x) => x[0]), vrms: c.velocity.rows.map((x) => x[1]) };
  const g = { traces: c.gather.traces, offsets: c.gather.offsets_m, dtMs: c.gather.dt_ms, t0Ms: c.gather.t0_ms };
  const vint = must(P.dix(table), 'dix');
  const li = table.tMs.indexOf(st.dixLayer.toMs);
  if (li < 1 || table.tMs[li - 1] !== st.dixLayer.fromMs) throw new Error('the stated Dix layer is not a table segment');
  const v = must(P.velocityAt(table, st.timeMs), 'velocity');
  const ag = must(P.angles(g, table, { edges: st.angleEdges }), 'angle gather');
  const i = Math.round((st.targetMs - g.t0Ms) / g.dtMs);
  const fit = P.shueyFit(st.stackAngles, ag.gather.map((b) => b[i]), { terms: st.shueyTerms });
  const cmp = must(P.avoAtWells(c.wells), 'avo at wells');
  return [
    { tier: 'intermediate', key: 'quarvin_dix_vint', cls: 'velocity', value: vint[li], call: 'qi/prestack dixInterval' },
    { tier: 'intermediate', key: 'quarvin_walden_deg', cls: 'angle', value: P.walden(st.offsetM, st.timeMs, v.vrms, v.vint), call: 'qi/prestack velocityOnGrid + waldenAngle' },
    { tier: 'intermediate', key: 'quarvin_nmo_stretch', cls: 'ratio', value: P.stretch(st.offsetM, st.timeMs, v.vrms), call: 'qi/prestackQc nmoStretch' },
    { tier: 'intermediate', key: 'quarvin_far_stack_amp', cls: 'amplitude', value: P.stackOf(ag, st.farBins[0], st.farBins[1])[i], call: 'qi/prestack angleGather + partialStack' },
    { tier: 'intermediate', key: 'quarvin_shuey_a', cls: 'amplitude', value: fit.A, call: 'qi/avo fitShuey A' },
    { tier: 'intermediate', key: 'quarvin_one_scale', cls: 'ratio', value: cmp.scale, call: 'qi/avoWells compareAtWells scale' },
  ];
}

export function allFields() {
  return [...associateFields(readCase('tamberlo')), ...professionalFields(readCase('quarvin')),
    // Expert: DELSHOLM, through the Expert lab (qi_capstone_e.mjs names each field's engine call)
    ...expertFields(readCase('delsholm')).map(({ tier, key, cls, value, call }) => ({ tier, key, cls, value, call }))];
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const rows = allFields();
  for (const r of rows) if (!Number.isFinite(r.value)) throw new Error(`${r.key} is not finite`);
  if (process.argv.includes('--json')) process.stdout.write(`${JSON.stringify(rows)}\n`);
  else for (const r of rows) console.log(`${r.tier.padEnd(13)} ${r.key.padEnd(26)} ${String(r.value).padEnd(22)} ${r.call}`);
}
