// THE EKENE PRODUCTION TEACHING DATASET OF THE D4 DIGEST: a deterministic generator.
//
// THESE ARE NOT THE CAPSTONE DATASETS. The capstones run three other fields on
// other seeds, other names and other values; nothing here imports
// d4_capstone.mjs and nothing there imports this. gate_capstone_leak.mjs proves
// both directions.
//
// NOR IS THIS THE ENGINE'S OWN SCALE SET. The vendored engine carries
// syntheticProduction (tools/validation/dataai/synthetic_wells.js) for its
// timing and scale checks, and its oracle carries ekene_production() for the
// goldens. This course draws its own wells so that every planted structure
// below is stated and found; the digest never quotes a golden's Ekene figure.
//
// DETERMINISM IS DESIGNED IN. Every random draw goes through the canonical
// mulberry32 and randomNormal of lib/stats (the vendored engines), ONE stream
// on a STATED seed, drawn in a fixed order, and every rate is rounded to 0.1
// bbl/d, the precision a monthly allocation report carries. The decline shape
// is engines/dca/arps.js calculateArpsHyperbolic (imported, never
// re-implemented). Nothing reads a clock, Math.random, a locale or the
// network.
//
// THE FIELD. Six producing wells, EKENE-P1 to EKENE-P6, each with a monthly
// average oil rate in bbl/d, oldest month first, index 0 the first month on
// production. Every planted structure is documented in PLANTED below with the
// named engine behaviour that finds it; d4_dump.mjs asserts each one IS found,
// so a generator edit that moves a structure out of reach fails the build.
//
// The NextGen teaching lab carries the SAME dataset as a committed JSON copy
// (src/components/course/panels/forecastml/ekeneProduction.json), and its
// vitest suite asserts that copy is byte-identical to what this file generates.
//
//   node d4_fields.mjs --json     the dataset as JSON, for the lab copy
import process from 'node:process';

const ROOT = process.env.D4_ENGINES || '/root/wt-dai-d4-nextgen/packages/engines';
const { mulberry32, randomNormal } = await import(`${ROOT}/lib/stats/stats.js`);
const { calculateArpsHyperbolic } = await import(`${ROOT}/engines/dca/arps.js`);

const r1 = (x) => Math.round(x * 10) / 10;
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/** The one stated seed. */
export const SEED = 20260925;

/** Months on production per well, stated. */
export const N_MONTHS = 48;

/**
 * The six wells, every input stated: Arps qi (bbl/d at month 0), Di (per
 * month), b; the multiplicative noise SD; and each well's planted event.
 *   shutIn     [first, last] months at rate 0 (inclusive), then a workover
 *              that lifts the rate by `uplift` from the restart on
 *   plateau    months 0..plateau-1 held at exactly `plateauRate` by a
 *              facility limit (no noise), decline starting after
 */
export const WELLS = Object.freeze([
  { id: 'EKENE-P1', qi: 1200, Di: 0.06, b: 0.5, noise: 0.03, note: 'a clean hyperbolic decline' },
  { id: 'EKENE-P2', qi: 950, Di: 0.05, b: 0.3, noise: 0.05, shutIn: [22, 24], uplift: 0.45, note: 'a three month shut-in and a workover' },
  { id: 'EKENE-P3', qi: 1650, Di: 0.07, b: 0.4, noise: 0.04, plateau: 9, plateauRate: 1500, note: 'a facility-limited plateau' },
  { id: 'EKENE-P4', qi: 800, Di: 0.04, b: 0.7, noise: 0.12, note: 'a noisy allocation' },
  { id: 'EKENE-P5', qi: 700, Di: 0.11, b: 0.1, noise: 0.05, note: 'a steep decline to a low tail' },
  { id: 'EKENE-P6', qi: 1000, Di: 0.05, b: 0.5, noise: 0.04, months: 3, note: 'a new well, three months on production' },
]);

const build = () => {
  const g = mulberry32(SEED);
  return WELLS.map((W) => {
    const n = W.months || N_MONTHS;
    const rate = [];
    for (let t = 0; t < n; t += 1) {
      const e = randomNormal(g); // drawn for every month, used or not, so one well's event cannot shift another's draws
      if (W.shutIn && t >= W.shutIn[0] && t <= W.shutIn[1]) { rate.push(0); continue; }
      if (W.plateau && t < W.plateau) { rate.push(W.plateauRate); continue; }
      const tt = W.plateau ? t - W.plateau : t;
      const q0 = W.plateau ? W.plateauRate : W.qi;
      const lift = W.shutIn && t > W.shutIn[1] ? 1 + W.uplift : 1;
      rate.push(r1(Math.max(0, calculateArpsHyperbolic(q0, W.Di, W.b, tt) * lift * (1 + W.noise * e))));
    }
    return { well: W.id, rate };
  });
};

const BUILT = build();

/** The dataset as the lab and the digest read it. */
export const EKENE = freeze({ seed: SEED, unit: 'bbl/d, monthly average', wells: BUILT });

export const rateOf = (id) => EKENE.wells.find((w) => w.well === id).rate;

/** Every planted structure: [what, where, how it was planted, the named engine behaviour that finds it]. */
export const PLANTED = Object.freeze([
  ['a clean hyperbolic decline', 'EKENE-P1', 'Arps qi 1200, Di 0.06 per month, b 0.5, noise 3 percent', 'compareWithArps ranks arps first by MASE'],
  ['a shut-in with zero rates', 'EKENE-P2', 'months 22 to 24 at rate 0', 'MAPE is null with its reason on a backtest whose actuals include the shut-in, and fitArpsModel drops the three zeros'],
  ['a workover uplift after the shut-in', 'EKENE-P2', 'the rate lifted by 45 percent from month 25 on', 'compareWithArps over origins after the restart ranks a smoothing method above arps'],
  ['a facility-limited plateau', 'EKENE-P3', 'months 0 to 8 held at exactly 1500.0', 'MASE is null with its reason at a backtest origin inside the plateau, where every training difference is 0'],
  ['a noisy allocation', 'EKENE-P4', 'multiplicative noise of 12 percent', 'the fitted ses alpha is lower than on EKENE-P1'],
  ['a steep decline to a low tail', 'EKENE-P5', 'Arps Di 0.11 per month, b 0.1', "a holt forecast runs below zero, forecastIntervals reports clippedToZero above 0, and the damped forecast stays above zero"],
  ['a new well', 'EKENE-P6', 'three months on production', "fitSmoothing fits holt on its three months, while forecastIntervals refuses holt (one scored residual) and backtest refuses it by the exact length rule"],
]);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(EKENE)}\n`);
}
