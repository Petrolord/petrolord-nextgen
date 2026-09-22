// THE TYPED POOL ROUTE (B5 follow-on W4, route b, owner decision D2).
//
// The heat view of the fire explorer takes the pool a learner types and runs the
// whole solid flame chain unrounded. So the Professional capstone is reachable
// by TYPING the pool the capstone prompt states, which is the work the capstone
// asks for. What must never happen is that the view's DEFAULT state lands on a
// graded answer. This suite proves both halves, and that it can fail.
//
// The graded values are read from the committed fields.json (the answer file
// make_fields.mjs wrote from h4_capstone.mjs), re-derived here through the
// engine exactly the way h4_capstone.mjs derives them, and cross-checked
// against the literal values in the live answer key.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as E from '@petrolord/engines/engines/hse/consequence.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';
import { gradedTolerance, PRINTED_DECIMALS, gradedClassOf } from './gradedTolerance.js';
import { typedPoolFire, TYPED_POOL_DEFAULT } from './consequenceLab.js';
import FireExplorer from './FireExplorer.jsx';
import * as D2 from '../typedCaseGuard.js';

const FIELDS = JSON.parse(fs.readFileSync(waveInput('consequence', 'fields.json'), 'utf8'));

// The pool exactly as the capstone prompt states it, as a learner types it.
const TYPED = {
  fuel: 'kerosene',
  poolDiameterM: '31.5',
  windSpeed10mMS: '6',
  airDensityKgM3: '1.2',
  airKinematicViscosityM2S: '1.48e-5',
  heatOfCombustionJKg: '43000000',
  radiativeFraction: '0.235',
  sootFraction: '0.8',
  distanceFromCentreM: '72',
  transmissivity: '0.765',
};

// key -> [what the heat view reads it from, the decimals the heat view prints it at, the live answer key literal]
const KEYS = {
  yokri_flame_length_with_wind_m: ['flameLengthM', 9, 20.618159361645755],
  yokri_flame_tilt_deg: ['tiltDeg', 9, 53.02368839919855],
  yokri_surface_emissive_power_mudan_w_m2: ['surfaceEmissivePowerMudanWM2', 9, 22738.722971011157],
  yokri_surface_emissive_power_actual_w_m2: ['surfaceEmissivePowerWM2', 9, 37784.162897552],
  yokri_view_factor_max: ['viewFactorMax', 12, 0.04602429827467467],
  yokri_solid_flame_heat_flux_w_m2: ['heatFluxWM2', 9, 1330.3270311907092],
};

/** The graded values, re-derived through the engine the way h4_capstone.mjs does. */
const derived = () => {
  const n = {
    d: 31.5, fuel: 'kerosene', dhc: 43.0e6, u: 6.0, rho: 1.2, nu: 1.48e-5, fs: 0.235, soot: 0.8, x: 72, tau: 0.765,
  };
  const b = E.poolBurningRate({ method: 'babrauskas', fuel: n.fuel, poolDiameterM: n.d });
  const l = E.poolFireFlameLength({ method: 'thomas-wind', poolDiameterM: n.d, burningFluxKgM2S: b.burningFluxKgM2S, airDensityKgM3: n.rho, windSpeed10mMS: n.u });
  const t = E.poolFireTilt({ poolDiameterM: n.d, windSpeed10mMS: n.u, airKinematicViscosityM2S: n.nu });
  const sd = E.surfaceEmissivePower({ method: 'mudan-diameter', poolDiameterM: n.d });
  const sa = E.surfaceEmissivePower({
    method: 'radiative-fraction-soot', poolDiameterM: n.d, radiativeFraction: n.fs, burningFluxKgM2S: b.burningFluxKgM2S,
    heatOfCombustionJKg: n.dhc, flameLengthM: l.flameLengthM, sootFraction: n.soot,
  });
  const vf = E.cylinderViewFactor({ flameRadiusM: n.d / 2, flameLengthM: l.flameLengthM, distanceFromAxisM: n.x, tiltDeg: t.tiltDeg });
  const q = E.poolFireSolidFlame({
    poolDiameterM: n.d, burningFluxKgM2S: b.burningFluxKgM2S, heatOfCombustionJKg: n.dhc, flameLengthMethod: 'thomas-wind',
    airDensityKgM3: n.rho, windSpeed10mMS: n.u, airKinematicViscosityM2S: n.nu,
    sep: { method: 'radiative-fraction-soot', radiativeFraction: n.fs, sootFraction: n.soot }, distanceFromCentreM: n.x, transmissivity: n.tau,
  });
  return {
    yokri_flame_length_with_wind_m: l.flameLengthM,
    yokri_flame_tilt_deg: t.tiltDeg,
    yokri_surface_emissive_power_mudan_w_m2: sd.surfaceEmissivePowerWM2,
    yokri_surface_emissive_power_actual_w_m2: sa.surfaceEmissivePowerWM2,
    yokri_view_factor_max: vf.viewFactorMax,
    yokri_solid_flame_heat_flux_w_m2: q.heatFluxWM2,
  };
};

const graded = (key) => {
  const row = FIELDS.find(([, k]) => k === key);
  expect(row, key).toBeTruthy();
  return { value: row[2], tol: row[3] };
};

/** Is the typed result within tol of every graded key, read at the decimals the view prints? */
const misses = (r) => Object.entries(KEYS).filter(([key, [prop, dp]]) => {
  const { value, tol } = graded(key);
  return !(Math.abs(Number(r[prop].toFixed(dp)) - value) <= tol);
}).map(([k]) => k);

describe('the heat view takes a typed pool: reachable by typing, silent by default', () => {
  it('the answer file, the engine derivation and the live answer key agree on all six graded values', () => {
    const d = derived();
    Object.entries(KEYS).forEach(([key, [, , literal]]) => {
      const { value, tol } = graded(key);
      expect(tol, key).toBe(gradedTolerance(key));
      expect(value, key).toBe(literal);
      expect(d[key], key).toBe(value);
    });
  });

  it('every graded value is printed at no fewer decimals than its tolerance needs, or than the course prints its class', () => {
    Object.entries(KEYS).forEach(([key, [, dp]]) => {
      expect(dp, key).toBeGreaterThanOrEqual(PRINTED_DECIMALS[gradedClassOf(key).cls]);
      expect(0.5 * 10 ** -dp, key).toBeLessThanOrEqual(graded(key).tol * (1 + 1e-9));
    });
  });

  it('typing the pool the prompt states reads all six graded values within tolerance at the printed decimals', () => {
    const r = typedPoolFire(TYPED);
    expect(r.ok, r.errors.join(' ')).toBe(true);
    const rows = Object.entries(KEYS).map(([key, [prop, dp]]) => {
      const { value, tol } = graded(key);
      const shown = Number(r[prop].toFixed(dp));
      const diff = Math.abs(shown - value);
      expect(diff, `${key}: printed ${r[prop].toFixed(dp)} against ${value}`).toBeLessThanOrEqual(tol);
      return `${key} printed ${r[prop].toFixed(dp)} diff ${diff.toExponential(3)} tol ${tol}`;
    });
    expect(misses(r)).toEqual([]);
    console.log(`[consequence typed pool]\n  ${rows.join('\n  ')}`);
  });

  it('the default state (ERHA, the teaching fire) lands on no graded answer, within ten tolerances at five scalings', () => {
    const r = typedPoolFire(TYPED_POOL_DEFAULT);
    expect(r.ok, r.errors.join(' ')).toBe(true);
    const values = Object.entries(r).filter(([, v]) => typeof v === 'number');
    expect(values.length).toBeGreaterThanOrEqual(10);
    const hits = [];
    FIELDS.forEach(([, key, v, tol]) => [1, 1e3, 1e-3, 1e2, 1e-2].forEach((sc) => values.forEach(([at, x]) => {
      if (Math.abs(x - v * sc) <= 10 * tol * sc) hits.push(`${at} = ${x} near ${key} x${sc}`);
    })));
    expect(hits).toEqual([]);
    expect(misses(r)).toHaveLength(6);
  });

  it('NEGATIVE CONTROL: one typed number changed and the graded values are no longer reproduced', () => {
    const r = typedPoolFire({ ...TYPED, distanceFromCentreM: '73' });
    expect(r.ok).toBe(true);
    const m = misses(r);
    expect(m).toContain('yokri_view_factor_max');
    expect(m).toContain('yokri_solid_flame_heat_flux_w_m2');
    const w = typedPoolFire({ ...TYPED, windSpeed10mMS: '6.1' });
    expect(misses(w)).toContain('yokri_flame_length_with_wind_m');
  });

  it('bad input is refused in plain words and never throws', () => {
    expect(typedPoolFire({ ...TYPED, transmissivity: '' }).errors.join(' ')).toMatch(/Type the transmissivity/);
    expect(typedPoolFire({ ...TYPED, poolDiameterM: 'abc' }).ok).toBe(false);
    expect(typedPoolFire({ ...TYPED, fuel: 'water' }).ok).toBe(false);
    const under = typedPoolFire({ ...TYPED, distanceFromCentreM: '10' });
    expect(under.ok).toBe(false);
    expect(under.errors.length).toBeGreaterThan(0);
  });

  it('the heat view renders on its default with content and no NaN, and prints its default values', () => {
    const html = renderToStaticMarkup(React.createElement(FireExplorer, { initialMode: 'heat' }));
    expect(html).toMatch(/<table/);
    expect(html).not.toMatch(/NaN/);
    const r = typedPoolFire(TYPED_POOL_DEFAULT);
    expect(html).toContain(r.viewFactorMax.toFixed(12));
    expect(html).toContain(r.heatFluxWM2.toFixed(9));
    expect(html).toContain(r.flameLengthM.toFixed(9));
    const flame = renderToStaticMarkup(React.createElement(FireExplorer, { initialMode: 'flame' }));
    expect(flame).not.toMatch(/NaN/);
    expect(flame).toContain('Air density, kg/m3');
  });
});

// ---- D2 SHARED RULES (typedCaseGuard.js, owner decision D2) ----------------
// Rule 1: each typed mode's default state, run through the function the panel
// calls, lands on no graded answer at ten grading bands in five shiftings.
// Rule 2: no default carries a capstone-distinguishing input. The keys are
// FROZEN here (every typed input where the capstone case differs from the
// default when the mode was built), so a default later moved onto a capstone
// input fails even when its outputs do not collide yet.
const D2_MODES = [
  { name: 'heat', typed: TYPED, defaults: TYPED_POOL_DEFAULT, run: typedPoolFire },
];
const D2_KEYS = {"heat": ["fuel", "poolDiameterM", "windSpeed10mMS", "airKinematicViscosityM2S", "heatOfCombustionJKg", "radiativeFraction", "distanceFromCentreM", "transmissivity"]};
const d2Leaves = (v, p = '', out = {}) => {
  if (v !== null && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => d2Leaves(x, p ? `${p}.${k}` : k, out));
  } else if (v !== undefined && v !== '') {
    const n = Number(v);
    out[p] = typeof v === 'boolean' || v === null || !Number.isFinite(n) ? v : n;
  }
  return out;
};
// typedCaseGuard reads dotted paths, so a flattened key (wells.0.qmax) is renamed flat
const flat = (k) => k.replace(/\./g, '__');
const d2Bundle = (v) => {
  const o = {};
  Object.entries(d2Leaves(v)).forEach(([p, x]) => { o[p] = x; });
  return o;
};

describe('D2 shared rules (typedCaseGuard.js)', () => {
  const targets = D2.leakTargets(FIELDS);
  it('rule 1: no typed default state lands on a graded answer', () => {
    expect(targets.length).toBeGreaterThan(0);
    expect(D2.defaultStateHits({ targets, modes: D2_MODES })).toEqual([]);
  }, 600000);
  D2_MODES.forEach(({ name, typed, defaults }) => {
    it(`rule 2: the ${name} default preloads no capstone-distinguishing input`, () => {
      const capstone = d2Bundle(typed);
      const bundle = d2Bundle(defaults);
      const keys = D2_KEYS[name];
      expect(keys.length, 'the frozen key list guards nothing').toBeGreaterThan(0);
      const lookup = (o) => Object.fromEntries(keys.map((k) => [flat(k), o[k]]));
      expect(D2.distinguishingKeyProblems({ capstone: lookup(capstone), teachingCases: [{ name: 'default', inputs: lookup(bundle) }], keys: keys.map(flat) })).toEqual([]);
      expect(D2.preloadHits({ capstone: lookup(capstone), bundles: [{ name: `${name} default`, inputs: lookup(bundle) }], keys: keys.map(flat) })).toEqual([]);
    });
    it(`rule 2 is live on the ${name} mode: the capstone typed as a default is caught`, () => {
      const capstone = d2Bundle(typed);
      const keys = D2_KEYS[name];
      const lookup = (o) => Object.fromEntries(keys.map((k) => [flat(k), o[k]]));
      expect(D2.preloadHits({ capstone: lookup(capstone), bundles: [{ name: 'planted', inputs: lookup(capstone) }], keys: keys.map(flat) }).length).toBe(keys.length);
    });
  });
});
