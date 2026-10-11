// THE PROFESSIONAL CAPSTONE CASE: QUARVIN, held-out synthetic, never Ekene.
//
// One NMO-corrected CDP gather with its RMS velocity table, and four wells'
// modelled and seismic intercepts and gradients at a target, in the plan's
// shape (Suite docs/scope/NextGen-QI-Course-PLAN.md section 5). Written to
// src/content/capstone-cases/qi/quarvin_case.json; the graded figures are
// computed from the case file's content by qi_capstone.mjs (professionalFields).
//
// Deterministic: the canonical seeded generator (lib/stats mulberry32) and
// engines/qi/inversionSpread.js addNoise on the stated seeds.
//
//   node qi_cases_p.mjs           write the case file
//   node qi_cases_p.mjs --print   print it instead
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { register } from 'node:module';

register('./qi_loader.mjs', import.meta.url);
const { REPO } = await import('./qi_engine.mjs');
const { mulberry32 } = await import('@petrolord/engines/lib/stats/stats.js');
const { addNoise } = await import('@petrolord/engines/engines/qi/inversionSpread.js');
const { rickerWavelet } = await import('@petrolord/engines/lib/waveform.js');
const { waldenAngle, velocityOnGrid } = await import('@petrolord/engines/engines/qi/prestack.js');
const { convolveCentred } = await import('@petrolord/engines/engines/qi/inversion.js');

const r = (x, nd) => { const v = Number(x.toFixed(nd)); return Object.is(v, -0) ? 0 : v; };

export function quarvin() {
  const SEED = 20261012;
  const rng = mulberry32(SEED);
  const table = [[0, 1500], [420, 1820], [880, 2140], [1310, 2385], [1720, 2590]];
  const dt = 2; const t0 = 1100; const ns = 201;
  const offsets = Array.from({ length: 20 }, (_, k) => 100 + 150 * k);
  const v = velocityOnGrid(table.map((x) => x[0]), table.map((x) => x[1]), ns, dt, t0);
  // events: [time ms, A, B]; the target is the second
  const events = [[1196, -0.045, 0.06], [1324, 0.082, -0.214], [1388, -0.06, -0.09], [1452, 0.05, 0.03]];
  const w = rickerWavelet(31, dt, 64);
  const mute = 38;
  const traces = offsets.map((x, k) => {
    const refl = new Float64Array(ns);
    for (const [t, A, B] of events) {
      const i = Math.round((t - t0) / dt);
      const th = waldenAngle(x, t / 1000, v.vrms[i], v.vint[i]);
      if (th <= mute) refl[i] += A + B * Math.sin((th * Math.PI) / 180) ** 2;
    }
    for (let j = 0; j < 14; j++) refl[Math.floor(rng() * ns)] += 0.012 * (rng() - 0.5);
    const tr = addNoise(convolveCentred(refl, w), 20, SEED + 7 + k);
    // the mute: samples past the mute angle are exact zeros, as in the kit's gathers
    return Array.from(tr, (s, i) => {
      const th = waldenAngle(x, (t0 + i * dt) / 1000, v.vrms[i], v.vint[i]);
      return th > mute ? 0 : r(1000 * s, 6);
    });
  });
  const wells = [
    { name: 'Quarvin-1', modelled: { A: 0.0847, B: -0.2213 }, observed: { A: 95.1384, B: -251.0472 } },
    { name: 'Quarvin-2', modelled: { A: 0.1022, B: -0.1786 }, observed: { A: 118.6019, B: -197.3150 } },
    { name: 'Quarvin-3', modelled: { A: 0.0611, B: -0.2632 }, observed: { A: 66.9047, B: -301.8826 } },
    { name: 'Quarvin-4', modelled: { A: 0.0938, B: -0.1517 }, observed: { A: 99.7742, B: -180.2203 } },
  ];
  return {
    case: 'QUARVIN',
    tier: 'intermediate',
    synthetic: true,
    description: 'A held-out synthetic prestack case written for the Professional capstone: one NMO-corrected CDP gather with its RMS velocity table, and the modelled and seismic intercepts and gradients at four wells, Quarvin-1 to Quarvin-4. None of it is the Ekene field.',
    velocity: { columns: ['t_ms', 'vrms_m_s'], rows: table },
    gather: { nmoCorrected: true, dt_ms: dt, t0_ms: t0, samples: ns, offsets_m: offsets, muteAngle_deg: mute, traces },
    wells,
    stated: {
      dixLayer: { fromMs: 880, toMs: 1310 },
      offsetM: 1600,
      timeMs: 1324,
      nmoVelocity: 'the RMS velocity at the stated time',
      angleEdges: [5, 15, 25, 35],
      stackAngles: [10, 20, 30],
      farBins: [2, 3],
      targetMs: 1324,
      shueyTerms: 2,
      oneScale: 'least squares over A and B together, every well',
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const c = quarvin();
  if (process.argv.includes('--print')) process.stdout.write(`${JSON.stringify(c)}\n`);
  else {
    const p = path.join(REPO, 'src/content/capstone-cases/qi/quarvin_case.json');
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, `${JSON.stringify(c)}\n`);
    console.log(`wrote ${p} (${fs.statSync(p).size} bytes)`);
  }
}
