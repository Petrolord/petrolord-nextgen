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
import { kdry, substituteVels } from '@petrolord/engines/engines/rockphysics/gassmann.js';
import { greenbergCastagnaVs, mudrockVs } from '@petrolord/engines/engines/rockphysics/vsEstimate.js';
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
