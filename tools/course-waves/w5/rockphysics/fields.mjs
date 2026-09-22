// W5a RE-CASE, rockphysics: the capstone's own case and its graded keys.
//
// The Ekene SAND is the teaching case. The panels open on it and the lessons
// work it, so since W5a no capstone grades it. Each tier's capstone is the
// UQUO case below: every input is stated in the brief, the learner types it
// into the tier's panel (or works it by hand where the lessons teach the
// closed form), and the graded keys are whatever the vendored engine returns
// for it through the same teaching functions the panels call. Nothing here is
// hand-typed: the keys are regenerated with
//
//   npx vite-node -c vitest.config.js tools/course-waves/w5/rockphysics/fields.mjs --write
//
// and src/components/course/panels/rockphysics/capstoneKeys.test.js recomputes
// them in CI and fails if fields.json drifts from the engine.
//
// No panel, lesson or learning page may import this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  computeFluids, quartzClayFrame, computeSubstitutionAt, computeShearEstimate, computeAvoDetail,
} from '@/lib/rockphysicsTeaching';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Beginner: the UQUO sand's fluids and frame. */
export const BEGINNER = {
  cond: { tC: 78, pMPa: 31, salinity: 0.05, gasGravity: 0.68, gorLL: 72 },
  oilRho0: 0.87,
  quartz: 0.82,
  sw: 0.7,
};

/** Intermediate: the logged UQUO sand, substituted to gas; shear estimated where there is none. */
export const INTERMEDIATE = {
  cond: { tC: 70, pMPa: 28, salinity: 0.045, gasGravity: 0.64, gorLL: 60 },
  logged: { vp: 3380, vs: 1930, rho: 2290 },
  phi: 0.22,
  kmin: 36e9,
  sw: 0,
  gcVp: 2860,
  gcSand: 0.6,
};

/** Advanced: the UQUO shale over a second sand, and that sand's gas twin. */
export const ADVANCED = {
  cond: { tC: 66, pMPa: 27, salinity: 0.04, gasGravity: 0.62, gorLL: 60 },
  shale: { vp: 2750, vs: 1400, rho: 2455 },
  brineSand: { vp: 3250, vs: 1850, rho: 2280 },
  phi: 0.25,
  kmin: 38e9,
  freqHz: 32,
};

const r1 = (v) => Math.round(v * 10) / 10;

/** The gas twin the advanced brief states, as the substitution panel prints it to 0.1. */
export function advancedGasTwin() {
  const s = computeSubstitutionAt(0, ADVANCED.phi, ADVANCED.kmin, ADVANCED.brineSand, ADVANCED.cond);
  return { vp: r1(s.result.vp), vs: r1(s.result.vs), rho: r1(s.result.rho) };
}

/** Every graded field, in capstone order, from the engine. */
export function capstoneFields() {
  const b = computeFluids(BEGINNER.sw, BEGINNER.cond, BEGINNER.oilRho0, quartzClayFrame(BEGINNER.quartz));
  const i = computeSubstitutionAt(INTERMEDIATE.sw, INTERMEDIATE.phi, INTERMEDIATE.kmin, INTERMEDIATE.logged, INTERMEDIATE.cond);
  const gc = computeShearEstimate(INTERMEDIATE.gcVp, INTERMEDIATE.gcSand, INTERMEDIATE.logged);
  const a = computeAvoDetail(ADVANCED.freqHz, 0.02,
    { shale: ADVANCED.shale, brineSand: ADVANCED.brineSand, gasSand: advancedGasTwin() });
  const f = (tier, key, label, unit, expected, tol) => ({ tier, key, label, unit, expected, tol });
  return [
    f('beginner', 'uquo_brine_rho', 'Brine density', 'kg/m3', b.brine.rho, 0.05),
    f('beginner', 'uquo_brine_k_gpa', 'Brine bulk modulus', 'GPa', b.brine.k / 1e9, 0.0005),
    f('beginner', 'uquo_gas_k_mpa', 'Gas bulk modulus', 'MPa', b.gas.k / 1e6, 0.01),
    f('beginner', 'uquo_oil_rho', 'Live-oil density', 'kg/m3', b.oil.rho, 0.05),
    f('beginner', 'uquo_vrh_k_gpa', 'Frame K, VRH 82/18 quartz/clay', 'GPa', b.frame.k / 1e9, 0.005),
    f('beginner', 'uquo_wood_k_mpa', 'Wood mixed-fluid K at Sw 0.7', 'MPa', b.mixed.k / 1e6, 0.05),
    f('intermediate', 'uquo_mu_gpa', 'Shear modulus (fluid-blind)', 'GPa', i.mu / 1e9, 0.001),
    f('intermediate', 'uquo_ksat_insitu', 'In-situ saturated K', 'GPa', i.ksatInSitu / 1e9, 0.001),
    f('intermediate', 'uquo_kdry_gpa', 'Dry-frame K (inverse Gassmann)', 'GPa', i.kDry / 1e9, 0.001),
    f('intermediate', 'uquo_gas_vp', 'Gas-case vp', 'm/s', i.result.vp, 0.1),
    f('intermediate', 'uquo_gas_rho', 'Gas-case density', 'kg/m3', i.result.rho, 0.05),
    f('intermediate', 'uquo_gc_vs', 'Greenberg-Castagna vs at vp 2860, 60/40', 'm/s', gc.gc, 0.1),
    f('advanced', 'uquo_brine_intercept', 'Brine-case Shuey intercept A', 'ratio', a.brine.a, 0.0002),
    f('advanced', 'uquo_brine_gradient', 'Brine-case Shuey gradient B', 'ratio', a.brine.b, 0.0002),
    f('advanced', 'uquo_gas_intercept', 'Gas-case Shuey intercept A', 'ratio', a.gas.a, 0.0002),
    f('advanced', 'uquo_gas_gradient', 'Gas-case Shuey gradient B', 'ratio', a.gas.b, 0.0002),
    f('advanced', 'uquo_brine_max_shuey_err', 'Largest Shuey error, brine case, 0 to 40 deg', 'ratio', a.brine.maxErr, 0.00002),
    f('advanced', 'uquo_zoep30', 'Exact Zoeppritz Rpp at 30 deg, gas', 'ratio', a.gas.zoep30, 0.0002),
    f('advanced', 'uquo_tuning_ms', 'Wedge tuning thickness at 32 Hz', 'ms', a.tuning.tuningMs, 0),
  ];
}

export const FIELDS_PATH = path.join(HERE, 'fields.json');

if (process.argv.includes('--write')) {
  fs.writeFileSync(FIELDS_PATH, `${JSON.stringify(capstoneFields(), null, 1)}\n`);
  console.log(`wrote ${FIELDS_PATH}`);
}
