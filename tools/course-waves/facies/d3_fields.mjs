// THE EKENE FACIES TEACHING DATASET OF THE D3 DIGEST: a deterministic generator.
//
// THESE ARE NOT THE CAPSTONE DATASETS. The capstones run three other fields on
// other seeds, other names and other values; nothing here imports
// d3_capstone.mjs and nothing there imports this. gate_capstone_leak.mjs proves
// both directions.
//
// DETERMINISM IS DESIGNED IN. Every random draw goes through the canonical
// mulberry32 and randomNormal of lib/stats (the vendored engines), ONE stream
// on a STATED seed, drawn in a fixed order, and every value is rounded to the
// decimals a real file would carry. Nothing reads a clock, Math.random, a
// locale or the network.
//
// THE FIELD. Eight wells, EKENE-1 to EKENE-8, thirty samples each at a one
// foot step, every well at its own depth. Each sample carries five log
// channels (GR, RHOB, NPHI, PEF and CALI) and the facies the generator drew
// for it. Six wells are CORED: their core facies is on every row. Two wells,
// EKENE-7 and EKENE-8, are NOT cored: their facies is null on every row, and
// the generator keeps the facies it drew apart from the rows, as `withheld`,
// which no real field has.
//
// EVERY PLANTED STRUCTURE IS DOCUMENTED in PLANTED below, with the named
// method that finds it. d3_dump.mjs asserts that each one IS found by that
// method, so a generator edit that moves a structure out of reach fails the
// build.
//
// The NextGen teaching lab carries the SAME dataset as a committed JSON copy
// (src/components/course/panels/facies/ekeneFacies.json), and its vitest suite
// asserts that copy is byte-identical to what this file generates.
//
//   node d3_fields.mjs --json     the dataset as JSON, for the lab copy
import process from 'node:process';

const ROOT = process.env.D3_ENGINES || '/root/wt-dai-d3-nextgen/packages/engines';
const { mulberry32, randomNormal } = await import(`${ROOT}/lib/stats/stats.js`);

const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const r3 = (x) => Math.round(x * 1000) / 1000;
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/** The one stated seed. */
export const SEED = 20260924;

/** Wells and samples, stated. */
export const N_WELLS = 8;
export const N_PER_WELL = 30;
export const WELL_IDS = Object.freeze(Array.from({ length: N_WELLS }, (_, i) => `EKENE-${i + 1}`));
/** The wells whose core was never cut, stated. */
export const UNCORED = Object.freeze(['EKENE-7', 'EKENE-8']);
export const CORED = Object.freeze(WELL_IDS.filter((w) => !UNCORED.includes(w)));

/** The well logged with a gamma ray tool reading a stated amount high on every sample (an uncalibrated tool). */
export const HOT_WELL = 'EKENE-8';
export const HOT_GR_ADD = 30;

/** The log channels, their units and what each is. */
export const CHANNELS = Object.freeze([
  ['GR', 'gAPI', 'gamma ray'],
  ['RHOB', 'g/cm3', 'bulk density'],
  ['NPHI', 'v/v', 'neutron porosity (limestone units)'],
  ['PEF', 'b/e', 'photoelectric factor'],
  ['CALI', 'in', 'caliper, the hole diameter'],
]);
/** The four logs the course clusters on; CALI is the fifth channel, carried for the tree. */
export const LOGS = Object.freeze(['GR', 'RHOB', 'NPHI', 'PEF']);

/**
 * The four facies and the normal each log is drawn from, [mean, SD], stated.
 * Names sort by character: limestone, sandstone, shale, shaly-sand.
 */
export const FACIES = Object.freeze([
  ['sandstone', [45, 9], [2.33, 0.04], [0.2, 0.025], [1.9, 0.2]],
  ['shaly-sand', [66, 14], [2.39, 0.05], [0.235, 0.035], [2.3, 0.35]],
  ['shale', [118, 12], [2.52, 0.04], [0.33, 0.03], [3.2, 0.25]],
  ['limestone', [28, 7], [2.64, 0.035], [0.07, 0.02], [4.9, 0.3]],
]);
/** The facies a well stays in from one sample to the next, with this probability, stated. */
export const STAY = 0.8;
/**
 * THE LIMESTONE BOUNDS, stated: limestone NPHI is held at or below LIME_NPHI_MAX
 * and every other facies' NPHI at or above OTHER_NPHI_MIN; limestone PEF at or
 * above LIME_PEF_MIN and every other facies' PEF at or below OTHER_PEF_MAX. So
 * NPHI and PEF each isolate limestone exactly, and a tree meets a tie.
 */
export const LIME_NPHI_MAX = 0.12;
export const OTHER_NPHI_MIN = 0.13;
export const LIME_PEF_MIN = 4.2;
export const OTHER_PEF_MAX = 3.9;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const build = () => {
  const g = mulberry32(SEED);
  const nz = () => randomNormal(g);
  const wells = WELL_IDS.map((id, w) => ({ id, top: 6200 + 60 * w + Math.round(30 * g()) }));
  const rows = [];
  const withheld = {};
  wells.forEach((W) => {
    let f = Math.floor(g() * FACIES.length);
    const drawn = [];
    for (let i = 0; i < N_PER_WELL; i += 1) {
      if (i > 0 && g() > STAY) f = Math.floor(g() * FACIES.length);
      const [name, gr, rhob, nphi, pef] = FACIES[f];
      const lime = name === 'limestone';
      const GR = r1(gr[0] + gr[1] * nz() + (W.id === HOT_WELL ? HOT_GR_ADD : 0));
      const RHOB = r3(rhob[0] + rhob[1] * nz());
      const NPHI = r3(lime ? clamp(nphi[0] + nphi[1] * nz(), 0.01, LIME_NPHI_MAX) : Math.max(OTHER_NPHI_MIN, nphi[0] + nphi[1] * nz()));
      const PEF = r2(lime ? Math.max(LIME_PEF_MIN, pef[0] + pef[1] * nz()) : clamp(pef[0] + pef[1] * nz(), 1.2, OTHER_PEF_MAX));
      const CALI = r2(8.5 + Math.abs(0.35 * nz()));
      drawn.push(name);
      rows.push({ well: W.id, depth: W.top + i, GR, RHOB, NPHI, PEF, CALI, FACIES: UNCORED.includes(W.id) ? null : name });
    }
    if (UNCORED.includes(W.id)) withheld[W.id] = drawn;
  });
  return { wells, rows, withheld };
};

const BUILT = build();

/** The dataset as the lab and the digest read it. */
export const EKENE = freeze({ seed: SEED, wells: BUILT.wells, rows: BUILT.rows, withheld: BUILT.withheld });

/** Every planted structure: [what, where, how it was planted, the named method that finds it]. */
export const PLANTED = Object.freeze([
  ['four facies in blocky runs', 'the cored wells', `each sample keeps the facies above it with probability ${STAY}, and each facies draws its four logs from its own normals`, 'kmeans k 4 on the standardised logs, matched one-to-one: every cluster takes a different facies and the adjusted Rand index is above 0.8'],
  ['a log in larger units than the others', 'every sample', 'GR is in gAPI with a spread of tens of units; RHOB, NPHI and PEF spread by tenths or hundredths', 'pca on the covariance matrix: GR loads the first component and it carries more than 0.99 of the variance'],
  ['limestone isolated exactly by two logs', 'every limestone sample', `limestone NPHI at or below ${LIME_NPHI_MAX} and PEF at or above ${LIME_PEF_MIN}; every other facies NPHI at or above ${OTHER_NPHI_MIN} and PEF at or below ${OTHER_PEF_MAX}`, 'cartFit at depth 1: NPHI and PEF give the same root decrease and the lower feature index, NPHI, takes it'],
  ['a caliper that carries no facies signal', 'every sample', 'CALI is drawn independently of the facies and of every other log', 'cartFit on the five channels: CALI is never split on and its importance is 0'],
  ['two uncored wells', list2(UNCORED), 'FACIES is null on every row; the drawn facies is kept apart as withheld', 'knnClassify and cartFit trained on the cored wells predict them; the withheld facies scores the prediction once'],
  ['an uncalibrated gamma ray tool', HOT_WELL, `GR raised by ${HOT_GR_ADD} gAPI on every sample`, 'knnClassify from the cored wells scores it below the other uncored well, and min-max scaling fitted on the cored wells maps its highest GR above 1'],
]);
function list2(a) { return a.join(' and '); }

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(EKENE)}\n`);
}
