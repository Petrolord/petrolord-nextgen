// THE QI EXPERT CAPSTONE CASE: DELSHOLM, a held-out synthetic case (never
// the Ekene field; owner decision D2, 2026-10-11). Built here from a stated
// layered earth with the vendored engines, on stated seeds, and written as a
// JSON case file under src/content/capstone-cases/qi/ that the Expert prompt
// names and the learner pastes into the inversion and prospect explorers.
// qi_capstone_e.mjs computes the six graded figures from the CASE FILE'S
// CONTENT through qiLabExp.js and qiLab.js, never from this generator's truth.
//
// What the case holds:
//   wells       Delsholm-1 to Delsholm-3: position, horizon times (top and base
//               of the reservoir) and the well's ln(AI) log in two-way time,
//               already low-passed for a low-frequency model
//   positionB   a second trace position with its horizon times (the LFM field)
//   traceA      the target trace position: full, near, mid and far traces, the
//               full-stack wavelet and one wavelet per angle (samples stated,
//               so no browser rebuilds a wavelet), the supplied low-frequency
//               models of ln(AI), ln(SI) and ln(density) at A, the background
//               Vs/Vp, the regularisation weights and the iteration count
//   calibration porosity and AI pairs; labelled facies samples on AI
//   grid        a depth grid in feet (elevation, negative down) over a trap
//   stated      every choice a field depends on
//
//   node qi_cases_e.mjs            write delsholm_case.json into the worktree
//   node qi_cases_e.mjs --print    print it instead
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { register } from 'node:module';

register('./qi_loader.mjs', import.meta.url);
const { REPO } = await import('./qi_engine.mjs');
const { mulberry32 } = await import('@petrolord/engines/lib/stats/stats.js');
const { forwardPoststack, lowFrequencyModel } = await import('@petrolord/engines/engines/qi/inversion.js');
const { forwardFatti } = await import('@petrolord/engines/engines/qi/prestackInversion.js');
const { addNoise } = await import('@petrolord/engines/engines/qi/inversionSpread.js');
const { rickerWavelet } = await import('@petrolord/engines/lib/waveform.js');

const r = (x, nd) => { const v = Number(x.toFixed(nd)); return Object.is(v, -0) ? 0 : v; };
const gauss = (rng) => {
  let u = 0; let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export function delsholm() {
  const SEED = 20261013;
  const rng = mulberry32(SEED);
  const dt = 4; const t0 = 1600; const ns = 120;
  // a layered earth in time: background trend, a cap shale, the reservoir (an
  // oil part over a brine part) and the shale below; the reservoir top and
  // base times vary with position (a dome centred near Delsholm-2)
  const domeAt = (x, y) => 1720 + 0.000004 * ((x - 15000) ** 2 + (y - 12000) ** 2);
  const model = (x, y, noise) => {
    const top = domeAt(x, y); const base = top + 36;
    const contact = 1745; // a flat contact in time for the teaching earth
    const lnAi = []; const lnSi = []; const lnRho = [];
    for (let k = 0; k < ns; k++) {
      const t = t0 + k * dt;
      const trend = 15.65 + 0.00022 * (t - t0);
      let ai = trend; let si = trend - 0.62; let rho = 7.76 + 0.00002 * (t - t0);
      if (t >= top && t < base) {
        const oil = t < contact;
        ai = trend - (oil ? 0.155 : 0.07);
        si = trend - 0.62 + 0.03;
        rho = rho - (oil ? 0.045 : 0.025);
      }
      const n = noise ? 1 : 0;
      lnAi.push(ai + n * 0.012 * gauss(rng));
      lnSi.push(si + n * 0.014 * gauss(rng));
      lnRho.push(rho + n * 0.006 * gauss(rng));
    }
    return { lnAi, lnSi, lnRho, horizons: [top, base] };
  };
  const wellsXY = [['Delsholm-1', 11800, 10400], ['Delsholm-2', 15400, 12600], ['Delsholm-3', 18200, 9800]];
  const half = 6; // the low-pass half window, samples, for the wells' LFM logs
  const wells = wellsXY.map(([name, x, y]) => {
    const m = model(x, y, true);
    return {
      name, x, y,
      horizonsMs: m.horizons.map((v) => r(v, 3)),
      lnAiLowPassed: Array.from(lowFrequencyModel(m.lnAi, half), (v) => r(v, 7)),
    };
  });
  const B = { x: 13900, y: 9100 };
  const Bm = model(B.x, B.y, false);
  const A = { x: 16100, y: 11300 };
  const Am = model(A.x, A.y, true);
  // wavelets: stated samples, scaled to a stated amplitude
  const wFull = Array.from(rickerWavelet(27, dt, 40), (v) => r(v * 0.9, 9));
  const angles = [8, 18, 28];
  const wAng = [30, 27, 24].map((f, i) => Array.from(rickerWavelet(f, dt, 40), (v) => r(v * [1.0, 0.95, 0.9][i], 9)));
  const vsVp = 0.47;
  const full = addNoise(forwardPoststack(Am.lnAi, wFull), 9, SEED + 1);
  const ang = forwardFatti({ lnAi: Am.lnAi, lnSi: Am.lnSi, lnRho: Am.lnRho }, angles, wAng, vsVp).map((tr, i) => addNoise(tr, 9, SEED + 2 + i));
  const truthA = model(A.x, A.y, false);
  const lp = (a) => Array.from(lowFrequencyModel(a, 10), (v) => r(v, 7));
  const traceA = {
    x: A.x, y: A.y, t0_ms: t0, dt_ms: dt, samples: ns,
    full: Array.from(full, (v) => r(v, 8)),
    angles_deg: angles,
    angleTraces: ang.map((t) => Array.from(t, (v) => r(v, 8))),
    fullWavelet: wFull,
    angleWavelets: wAng,
    lowFrequencyModels: { lnAi: lp(truthA.lnAi), lnSi: lp(truthA.lnSi), lnRho: lp(truthA.lnRho) },
    backgroundVsVp: vsVp,
  };
  // calibration: porosity against AI; facies on AI
  const calRng = mulberry32(SEED + 50);
  const porosity = Array.from({ length: 48 }, () => {
    const ai = 5.9e6 + 1.5e6 * calRng();
    return [r(ai, 1), r(0.405 - 3.05e-8 * ai + 0.008 * gauss(calRng), 5)];
  });
  const facies = [];
  for (const [name, mu, sd, n] of [['shale', 7.35e6, 2.8e5, 40], ['brine sand', 6.85e6, 2.4e5, 30], ['oil sand', 6.2e6, 2.6e5, 26]]) {
    for (let i = 0; i < n; i++) facies.push([name, r(mu + sd * gauss(calRng), 1)]);
  }
  // the depth grid, feet: a trap with a saddle to a lower culmination
  const nx = 31; const ny = 26; const dx = 330; const dy = 330;
  const z = [];
  for (let rr = 0; rr < ny; rr++) {
    for (let c = 0; c < nx; c++) {
      const x = c * dx; const y = rr * dy;
      const d1 = ((x - 4300) ** 2 + (y - 4100) ** 2) / (2 * 1500 ** 2);
      const d2 = ((x - 7400) ** 2 + (y - 4300) ** 2) / (2 * 1100 ** 2);
      const v = -8480 + 165 * Math.exp(-d1) + 120 * Math.exp(-d2) - 0.006 * y + 2.5 * gauss(calRng);
      z.push(r(v, 3));
    }
  }
  return {
    case: 'DELSHOLM',
    tier: 'advanced',
    synthetic: true,
    description: 'A held-out synthetic case written for the Expert capstone: three wells, Delsholm-1 to Delsholm-3, with their low-passed impedance logs in time; a target trace with its full and angle stacks; calibration samples; and a depth grid over a trap. None of it is the Ekene field.',
    clock: { t0_ms: t0, dt_ms: dt, samples: ns },
    wells,
    positionB: { x: B.x, y: B.y, horizonsMs: Bm.horizons.map((v) => r(v, 3)) },
    traceA,
    calibration: {
      porosity: { columns: ['ai', 'phit'], rows: porosity },
      facies: { columns: ['facies', 'ai'], rows: facies },
    },
    grid: { units: 'ft; z is elevation, negative below the datum', spec: { nx, ny, x0: 0, y0: 0, dx, dy }, z },
    stated: {
      lfm: { power: 2, sampleB: 42 },
      modelBased: { eps: 0.3, iters: 400, sampleA: 32 },
      simultaneous: { eps: [0.3, 0.3, 0.3], iters: 400, sampleA: 30 },
      porosity: { level: 0.8, atAi: 6.55e6 },
      facies: { kind: 'gaussian', priors: 'the calibration proportions', atAi: 6.38e6, class: 'oil sand' },
      closure: { crest: 'the highest mapped node', contact: 'the spill' },
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const c = delsholm();
  if (process.argv.includes('--print')) process.stdout.write(`${JSON.stringify(c)}\n`);
  else {
    const dir = path.join(REPO, 'src/content/capstone-cases/qi');
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, 'delsholm_case.json');
    fs.writeFileSync(p, `${JSON.stringify(c)}\n`);
    console.log(`wrote ${p} (${fs.statSync(p).size} bytes)`);
  }
}
