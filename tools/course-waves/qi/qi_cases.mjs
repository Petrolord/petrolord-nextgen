// THE QI CAPSTONE CASES: held-out synthetic cases, never the Ekene field.
//
// The members-only videos speak the Ekene answers aloud, so every capstone
// runs on a case built here with its own layers, rock, fluids, conditions and
// traces (owner decision D2, 2026-10-11). Each case is written as a JSON case
// file under src/content/capstone-cases/qi/ that the capstone prompt names and
// the learner pastes into the tier's panel. The graded figures are computed by
// qi_capstone.mjs from the CASE FILE'S CONTENT through the teaching lab, never
// from the generator's internal truth, so a field depends only on what the
// learner is given.
//
// Deterministic: every random draw comes from the canonical seeded generator
// (lib/stats/stats.js mulberry32, and engines/qi/inversionSpread.js addNoise
// for the trace noise), on the seeds stated below.
//
//   node qi_cases.mjs            write the case files into the NextGen worktree
//   node qi_cases.mjs --print    print them to stdout instead
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { register } from 'node:module';

register('./qi_loader.mjs', import.meta.url);
const { LAB: L, REPO } = await import('./qi_engine.mjs');
const { mulberry32 } = await import('@petrolord/engines/lib/stats/stats.js');
const { convolveCentred } = await import('@petrolord/engines/engines/qi/inversion.js');
const { addNoise } = await import('@petrolord/engines/engines/qi/inversionSpread.js');
const { rickerWavelet } = await import('@petrolord/engines/lib/waveform.js');

const r = (x, nd) => { const v = Number(x.toFixed(nd)); return Object.is(v, -0) ? 0 : v; };
const gauss = (rng) => {
  let u = 0; let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/* ------------------------------------------------- Associate: TAMBERLO */

export function tamberlo() {
  const SEED = 20261011;
  const rng = mulberry32(SEED);
  const top = 7520; const base = 7640; const owc = 7590;
  const conditions = { tF: 195, pPsia: 3650, salinity: 0.05, api: 28, gorScfStb: 520, gasSg: 0.7 };
  const fluids = L.fluidsAt(conditions);
  if (fluids.error) throw new Error(fluids.error);
  const rows = [];
  for (let md = 7400; md <= 7700 + 1e-9; md += 0.5) {
    let vsh; let phi; let vp; let vs; let rho;
    if (md < top || md > base) {
      vsh = clamp(0.74 + 0.04 * gauss(rng), 0.55, 0.95);
      phi = clamp(0.15 + 0.01 * gauss(rng), 0.08, 0.22);
      vp = 2650 + 45 * gauss(rng) + (md > base ? 120 : 0);
      vs = 1090 + 30 * gauss(rng) + (md > base ? 60 : 0);
      rho = 2425 + 15 * gauss(rng);
    } else {
      const x = (md - top) / (base - top);
      vsh = clamp(0.17 + 0.11 * Math.sin(2 * Math.PI * 2.3 * x) + 0.025 * gauss(rng), 0.03, 0.6);
      phi = clamp(0.275 - 0.24 * vsh + 0.012 * gauss(rng), 0.08, 0.33);
      vp = 4320 - 5300 * phi - 950 * vsh + 45 * gauss(rng);
      vs = -760 + 0.79 * vp + 38 * gauss(rng);
      const rhoMin = 2650 * (1 - vsh) + 2580 * vsh;
      rho = (1 - phi) * rhoMin + phi * fluids.brine.rho;
    }
    let sw = 1;
    const s = { md_ft: md, vp, vs, rho, phit: phi, vsh, sw: 1 };
    if (md >= top && md < owc) {
      sw = clamp(0.3 + 0.55 * ((md - top) / (owc - top)) ** 2 + 0.02 * gauss(rng), 0.2, 0.95);
      const sub = L.substituteSample(s, fluids, { toSw: sw });
      if (sub.error) throw new Error(`${md}: ${sub.error}`);
      vp = sub.vp; vs = sub.vs; rho = sub.rho;
    }
    rows.push([r(md, 1), r(vp, 3), r(vs, 3), r(rho, 2), r(phi, 4), r(vsh, 4), r(sw, 4)]);
  }
  // the trace patch: a stated Ricker on seeded reflectivity, with seeded noise
  const dt = 2; const ns = 400; const ntr = 18;
  const w = rickerWavelet(36, dt, 64);
  const traces = [];
  const common = [[120, 0.09], [151, -0.07], [212, 0.11], [290, -0.05]];
  for (let k = 0; k < ntr; k++) {
    const refl = new Float64Array(ns);
    for (let j = 0; j < 46; j++) refl[Math.floor(rng() * ns)] += 0.045 * gauss(rng);
    for (const [i, a] of common) refl[i + Math.round(1.5 * gauss(rng))] += a;
    const clean = convolveCentred(refl, w);
    const noisy = addNoise(clean, 7, SEED + 101 + k);
    traces.push(Array.from(noisy, (v) => r(v, 7)));
  }
  return {
    case: 'TAMBERLO',
    tier: 'beginner',
    synthetic: true,
    description: 'A held-out synthetic feasibility case written for the Associate capstone: one well, Tamberlo-1, over a shale cap, an oil-bearing sand with a water leg and the shale below it, and a patch of eighteen seismic traces. None of it is the Ekene field.',
    traces: { dt_ms: dt, t0_ms: 0, count: ntr, samples: ns, traces },
    well: {
      name: 'Tamberlo-1',
      topFt: top, baseFt: base, owcFt: owc,
      columns: ['md_ft', 'vp', 'vs', 'rho', 'phit', 'vsh', 'sw'],
      units: { md_ft: 'ft', vp: 'm/s', vs: 'm/s', rho: 'kg/m3', phit: 'fraction', vsh: 'fraction', sw: 'fraction' },
      rows,
    },
    conditions,
    stated: {
      taper: 0.1,
      netSandVshCut: 0.35,
      shearForm: 'linear',
      trendBlockFt: 16,
      shaleAboveFt: 65,
      substitutionSampleFt: 7561.5,
      minerals: 'quartz and clay by Voigt-Reuss-Hill on Vsh',
      poreFluid: 'brine and oil by Wood at the sample Sw',
    },
  };
}

export const CASES = { tamberlo };

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const out = Object.fromEntries(Object.entries(CASES).map(([k, f]) => [k, f()]));
  if (process.argv.includes('--print')) {
    process.stdout.write(`${JSON.stringify(out)}\n`);
  } else {
    const dir = path.join(REPO, 'src/content/capstone-cases/qi');
    fs.mkdirSync(dir, { recursive: true });
    for (const [k, c] of Object.entries(out)) {
      const p = path.join(dir, `${k}_case.json`);
      fs.writeFileSync(p, `${JSON.stringify(c)}\n`);
      console.log(`wrote ${p} (${fs.statSync(p).size} bytes)`);
    }
  }
}
