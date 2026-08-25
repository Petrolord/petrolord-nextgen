// Rock Physics teaching workflow — the Ekene SAND through the central
// rockphysics engines. Beginner builds the ingredients (Batzle-Wang
// reservoir fluids, the Voigt-Reuss-Hill mineral frame, Wood's mixed
// fluid); Intermediate runs Gassmann fluid substitution on the sand's
// log point and estimates shear where it is missing
// (Greenberg-Castagna); Advanced chains substitution into AVO
// screening (Shuey intercept/gradient, Rutherford-Williams class,
// exact Zoeppritz check) and wedge tuning. Every teaching fixture is
// anchored to the committed rockphysics goldens
// (packages/engines/test-data/rockphysics/goldens.json, dual-checked
// against bruges / open_petro_elastic / rockphypy); the capstone
// oracle was reproduced by running exactly these pipelines in Node
// before the migration was seeded.
import {
  brine, gas, liveOil, woodMix,
} from '@petrolord/engines/engines/rockphysics/fluids.js';
import { MINERALS, mixMinerals } from '@petrolord/engines/engines/rockphysics/minerals.js';
import { kdry, ksat as ksatFwd, substituteVels } from '@petrolord/engines/engines/rockphysics/gassmann.js';
import { gcLithVs, greenbergCastagnaVs, mudrockVs } from '@petrolord/engines/engines/rockphysics/vsEstimate.js';
import { shuey, avoClass, zoeppritzRpp } from '@petrolord/engines/engines/rockphysics/avo.js';
import { tuningCurve, tuningThicknessMs } from '@petrolord/engines/engines/rockphysics/wedge.js';

// Ekene SAND reservoir conditions (the golden Batzle-Wang fixture
// points: 60 degC, 25 MPa, 35,000 ppm brine, 0.6-gravity gas, 35 API
// oil with GOR 50 L/L).
export const CONDITIONS = { tC: 60, pMPa: 25, salinity: 0.035, gasGravity: 0.6, gorLL: 50 };
export const OIL_RHO0 = 0.85; // g/cc (about 35 API)

// The sand's mineral frame: 70% quartz, 30% clay (matches the golden
// gc_mix_70_30 lithology split).
export const FRAME = [{ frac: 0.7, name: 'quartz' }, { frac: 0.3, name: 'clay' }];

// In-situ (brine-saturated) log point of the Ekene SAND and the
// overlying shale. The sand point is the goldens' log-domain Gassmann
// fixture input; kmin is the fixture's 37 GPa mixed-mineral modulus.
export const SAND_IN_SITU = { vp: 3200, vs: 1800, rho: 2250 };
export const SHALE = { vp: 2743, vs: 1394, rho: 2450 };
export const PHI = 0.25;
export const KMIN = 37e9;

// Wedge/tuning fixture (the goldens' wedge panel): an equal-and-
// opposite reflection pair on a 1 ms grid.
export const WEDGE = { rcTop: 0.1, rcBase: -0.1, dtMs: 1, maxThicknessMs: 60 };
export const FREQ_OPTIONS = [25, 40];
export const CAPSTONE_FREQ_HZ = 25;

// Saturation the Beginner capstone mixes (80% brine, 20% gas).
export const CAPSTONE_SW = 0.8;

export const ROMAN_CLASS = { I: 1, II: 2, III: 3, IV: 4 };

/** Beginner: reservoir fluids + mineral frame at the given saturation. */
export function computeFluids(sw = CAPSTONE_SW) {
  const { tC, pMPa, salinity, gasGravity, gorLL } = CONDITIONS;
  const br = brine(tC, pMPa, salinity);
  const gs = gas(tC, pMPa, gasGravity);
  const oil = liveOil(tC, pMPa, OIL_RHO0, gorLL, gasGravity);
  const frame = mixMinerals(FRAME);
  const mixed = woodMix([
    { sat: sw, k: br.k, rho: br.rho },
    { sat: 1 - sw, k: gs.k, rho: gs.rho },
  ]);
  return { brine: br, gas: gs, oil, frame, mixed, sw };
}

/** Intermediate: Gassmann substitution of the in-situ brine sand to
 *  gas, plus shear estimation for the frame lithology. */
export function computeSubstitution() {
  const { vp, vs, rho } = SAND_IN_SITU;
  const { brine: br, gas: gs } = computeFluids();
  const mu = rho * vs * vs;
  const ksatInSitu = rho * vp * vp - (4 * mu) / 3;
  const kDry = kdry(ksatInSitu, KMIN, br.k, PHI);
  const gasCase = substituteVels(vp, vs, rho, KMIN, PHI,
    { k: br.k, rho: br.rho }, { k: gs.k, rho: gs.rho });
  const gcVs = greenbergCastagnaVs(3000, { sandstone: 0.7, shale: 0.3 });
  const mudVs = mudrockVs(3000);
  return { mu, ksatInSitu, kDry, gasCase, gcVs, mudVs };
}

/** Advanced: the substituted sand under the Ekene shale — AVO
 *  intercept/gradient/class for the brine and gas cases, the exact
 *  Zoeppritz check, and wedge tuning at the chosen frequency. */
export function computeAvoScreen(freqHz = CAPSTONE_FREQ_HZ) {
  const { gasCase } = computeSubstitution();
  const sh = SHALE;
  const brineShuey = shuey(sh.vp, sh.vs, sh.rho, SAND_IN_SITU.vp, SAND_IN_SITU.vs, SAND_IN_SITU.rho, 0);
  const gasShuey = shuey(sh.vp, sh.vs, sh.rho, gasCase.vp, gasCase.vs, gasCase.rho, 0);
  const brineClass = avoClass(brineShuey.a, brineShuey.b);
  const gasClass = avoClass(gasShuey.a, gasShuey.b);
  const zoep30 = zoeppritzRpp(sh.vp, sh.vs, sh.rho, gasCase.vp, gasCase.vs, gasCase.rho, 30);
  const curves = {};
  ['brine', 'gas'].forEach((c) => {
    const lower = c === 'brine' ? SAND_IN_SITU : gasCase;
    curves[c] = [];
    for (let th = 0; th <= 40; th += 2) {
      curves[c].push({ theta: th, r: shuey(sh.vp, sh.vs, sh.rho, lower.vp, lower.vs, lower.rho, th).r });
    }
  });
  const tc = tuningCurve(WEDGE.rcTop, WEDGE.rcBase, freqHz, WEDGE.dtMs, WEDGE.maxThicknessMs);
  const tuningMs = tuningThicknessMs(tc.amplitudes, WEDGE.dtMs);
  return { gasCase, brineShuey, gasShuey, brineClass, gasClass, zoep30, curves, tuning: { ...tc, tuningMs, freqHz } };
}

export { MINERALS };

// ---- DC24 (Professional): the substitution explorer.
// The same inverse-then-forward Gassmann pass the capstone runs, but with
// the pore fluid mixed at a saturation the learner chooses and with the two
// assumed inputs (porosity and mineral modulus) exposed, because the tier's
// argument is about what the answer is sensitive to. Oracle-reproduced in
// Node against the live NG6 answer key before the seed migration was written.

export const SW_OPTIONS = [1, 0.99, 0.95, 0.9, 0.8, 0.73, 0.5, 0.2, 0];
export const PHI_OPTIONS = [0.2, 0.25, 0.3];
export const KMIN_OPTIONS = [35e9, 36e9, 37e9, 38e9, 40e9];

/**
 * Gassmann substitution of the logged brine sand to a pore fluid mixed at
 * saturation sw, with the assumed porosity and mineral modulus exposed.
 * Returns the whole chain plus the round-trip check, which is the tier's
 * sharpest quality control: substituting back must return the log exactly.
 */
export function computeSubstitutionAt(sw = 0, phi = PHI, kmin = KMIN) {
  const { vp, vs, rho } = SAND_IN_SITU;
  const base = computeFluids();
  const mixed = computeFluids(sw).mixed;
  const mu = rho * vs * vs;
  const ksatInSitu = rho * vp * vp - (4 * mu) / 3;
  const kDry = kdry(ksatInSitu, kmin, base.brine.k, phi);
  const out = substituteVels(vp, vs, rho, kmin, phi,
    { k: base.brine.k, rho: base.brine.rho }, { k: mixed.k, rho: mixed.rho });
  // Round trip: put the brine back and the log must return.
  const back = substituteVels(out.vp, out.vs, out.rho, kmin, phi,
    { k: mixed.k, rho: mixed.rho }, { k: base.brine.k, rho: base.brine.rho });
  const curve = SW_OPTIONS.map((s) => {
    const m = computeFluids(s).mixed;
    const g = substituteVels(vp, vs, rho, kmin, phi,
      { k: base.brine.k, rho: base.brine.rho }, { k: m.k, rho: m.rho });
    return { sw: s, vp: g.vp, vs: g.vs, rho: g.rho, fluidK: m.k };
  }).sort((a, b) => b.sw - a.sw);
  return {
    sw,
    phi,
    kmin,
    mu,
    ksatInSitu,
    kDry,
    fluid: mixed,
    brine: base.brine,
    gas: base.gas,
    oil: base.oil,
    frame: base.frame,
    result: out,
    logged: { ...SAND_IN_SITU },
    impedanceLogged: rho * vp,
    impedance: out.rho * out.vp,
    vpvsLogged: vp / vs,
    vpvs: out.vp / out.vs,
    roundTrip: { vp: back.vp, vs: back.vs, rho: back.rho },
    curve,
    // The forward direction on its own, so the two halves stay separable.
    ksatCheck: ksatFwd(kDry, kmin, base.brine.k, phi),
  };
}

/** Shear estimation when the log has none, on the frame lithology split. */
export function computeShearEstimate(vpTarget = 3000) {
  const fracs = { sandstone: FRAME[0].frac, shale: FRAME[1].frac };
  const sand = gcLithVs(vpTarget, 'sandstone');
  const shale = gcLithVs(vpTarget, 'shale');
  const arith = fracs.sandstone * sand + fracs.shale * shale;
  const harm = 1 / (fracs.sandstone / sand + fracs.shale / shale);
  return {
    vpTarget,
    sand,
    shale,
    arith,
    harm,
    gc: greenbergCastagnaVs(vpTarget, fracs),
    mudrock: mudrockVs(vpTarget),
    // The same estimator run at the logged velocity, where a measured shear
    // exists to check it against.
    atLogged: greenbergCastagnaVs(SAND_IN_SITU.vp, fracs),
    loggedVs: SAND_IN_SITU.vs,
  };
}

// ---- DC25 (Expert): the AVO explorer.
// Both fluid cases screened under the Ekene shale across angle, with the
// Shuey approximation and the exact Zoeppritz solution side by side, plus
// the class call and its threshold. Oracle-reproduced against the live NG7
// answer key.
export const CLASS_THRESHOLDS = [0.01, 0.02, 0.04, 0.05];
export const ANGLE_MAX_DEG = 40;

export function computeAvoDetail(freqHz = CAPSTONE_FREQ_HZ, threshold = 0.02) {
  const { gasCase } = computeSubstitution();
  const sh = SHALE;
  const cases = {
    brine: { label: 'brine', lower: SAND_IN_SITU },
    gas: { label: 'gas', lower: gasCase },
  };
  const out = {};
  for (const [key, c] of Object.entries(cases)) {
    const s0 = shuey(sh.vp, sh.vs, sh.rho, c.lower.vp, c.lower.vs, c.lower.rho, 0);
    const curve = [];
    let crossing = null;
    let prev = null;
    for (let th = 0; th <= ANGLE_MAX_DEG; th += 1) {
      const sr = shuey(sh.vp, sh.vs, sh.rho, c.lower.vp, c.lower.vs, c.lower.rho, th).r;
      const zr = zoeppritzRpp(sh.vp, sh.vs, sh.rho, c.lower.vp, c.lower.vs, c.lower.rho, th).re;
      curve.push({ theta: th, shuey: sr, exact: zr, err: sr - zr });
      if (prev !== null && prev > 0 && sr <= 0 && crossing === null) crossing = th;
      prev = sr;
    }
    out[key] = {
      lower: c.lower,
      a: s0.a,
      b: s0.b,
      c: s0.c,
      klass: avoClass(s0.a, s0.b, threshold),
      klassNum: ROMAN_CLASS[avoClass(s0.a, s0.b, threshold)],
      curve,
      crossingDeg: crossing,
      maxErr: curve.reduce((m, p) => Math.max(m, Math.abs(p.err)), 0),
      zoep30: zoeppritzRpp(sh.vp, sh.vs, sh.rho, c.lower.vp, c.lower.vs, c.lower.rho, 30).re,
      shuey30: shuey(sh.vp, sh.vs, sh.rho, c.lower.vp, c.lower.vs, c.lower.rho, 30).r,
    };
  }
  // The gradient decomposed, because the tier's argument is that B is a
  // shear story rather than a density one.
  const g = cases.gas.lower;
  const vpm = 0.5 * (sh.vp + g.vp);
  const vsm = 0.5 * (sh.vs + g.vs);
  const rhom = 0.5 * (sh.rho + g.rho);
  const w = (vsm / vpm) ** 2;
  out.gradientTerms = {
    vpTerm: 0.5 * ((g.vp - sh.vp) / vpm),
    rhoTerm: -2 * w * ((g.rho - sh.rho) / rhom),
    vsTerm: -2 * w * ((2 * (g.vs - sh.vs)) / vsm),
  };
  const tc = tuningCurve(WEDGE.rcTop, WEDGE.rcBase, freqHz, WEDGE.dtMs, WEDGE.maxThicknessMs);
  out.tuning = {
    freqHz,
    tuningMs: tuningThicknessMs(tc.amplitudes, WEDGE.dtMs),
    amplitudes: tc.amplitudes,
    peak: tc.amplitudes.reduce((m, v) => Math.max(m, v), 0),
    theoryMs: (1000 * Math.sqrt(6)) / (2 * Math.PI * freqHz),
    isolated: tc.amplitudes[tc.amplitudes.length - 1],
  };
  out.threshold = threshold;
  return out;
}
