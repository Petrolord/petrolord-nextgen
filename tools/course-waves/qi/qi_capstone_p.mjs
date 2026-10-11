// THE PROFESSIONAL CAPSTONE FIELDS (QUARVIN), computed from the case file's
// content through the Professional teaching lab (qiLabPro.js).
//
// NOT YET GRADABLE. None of these six fields is in gradedTolerance.js: the
// engines behind them have not passed the extraction gate (a golden plus an
// independent oracle). Each row names the engines PR it waits on:
//   E1a  qi/prestack.js (G1) and qi/prestackQc.js (G2)
//   E1b  qi/avo.js (G3) and qi/wavelets.js (G4)
//   E2   avoWells, which lives in the Suite app (G7) until E2 moves it into
//        engines/qi/avoWells.js; until then the one scale is computed here by
//        calling the Suite's src/pages/apps/QIStudio/services/avoWells.js
//        through the loader's '@suite/' alias, and is PROVISIONAL.
// One change from the plan's field list: the plan's "usable angle at the
// stated minimum fold" returns a bin edge, a small discrete set a learner
// could guess, so the fourth field is the far partial stack amplitude at the
// target sample, which runs the same angle gather, fold and mute.
//
//   node qi_capstone_p.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { register } from 'node:module';

register('./qi_loader.mjs', import.meta.url);
const { LABP: P, REPO } = await import('./qi_engine_p.mjs');
const { compareAtWells } = await import('@suite/pages/apps/QIStudio/services/avoWells.js');

const must = (x, what) => { if (x === null || x === undefined || x.error) throw new Error(`${what}: ${x && x.error}`); return x; };

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
  const far = P.stackOf(ag, st.farBins[0], st.farBins[1]);
  const fit = P.shueyFit(st.stackAngles, ag.gather.map((b) => b[i]), { terms: st.shueyTerms });
  const cmp = compareAtWells(c.wells);
  return [
    { tier: 'intermediate', key: 'quarvin_dix_vint', cls: 'velocity', value: vint[li], call: 'qi/prestack dixInterval', waitsOn: 'E1a (G1)' },
    { tier: 'intermediate', key: 'quarvin_walden_deg', cls: 'angle', value: P.walden(st.offsetM, st.timeMs, v.vrms, v.vint), call: 'qi/prestack velocityOnGrid + waldenAngle', waitsOn: 'E1a (G1)' },
    { tier: 'intermediate', key: 'quarvin_nmo_stretch', cls: 'ratio', value: P.stretch(st.offsetM, st.timeMs, v.vrms), call: 'qi/prestackQc nmoStretch', waitsOn: 'E1a (G2)' },
    { tier: 'intermediate', key: 'quarvin_far_stack_amp', cls: 'amplitude', value: far[i], call: 'qi/prestack angleGather + partialStack', waitsOn: 'E1a (G1)' },
    { tier: 'intermediate', key: 'quarvin_shuey_a', cls: 'amplitude', value: fit.A, call: 'qi/avo fitShuey A', waitsOn: 'E1b (G3)' },
    { tier: 'intermediate', key: 'quarvin_one_scale', cls: 'ratio', value: cmp.scale, call: 'Suite QIStudio services/avoWells compareAtWells scale (PROVISIONAL)', waitsOn: 'E2 (G7)' },
  ];
}

export function allFieldsP() {
  const c = JSON.parse(fs.readFileSync(path.join(REPO, 'src/content/capstone-cases/qi/quarvin_case.json'), 'utf8'));
  return professionalFields(c);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const rows = allFieldsP();
  for (const r of rows) if (!Number.isFinite(r.value)) throw new Error(`${r.key} is not finite`);
  if (process.argv.includes('--json')) process.stdout.write(`${JSON.stringify(rows)}\n`);
  else for (const r of rows) console.log(`${r.key.padEnd(24)} ${String(r.value).padEnd(22)} ${r.waitsOn.padEnd(10)} ${r.call}`);
}
