// THE EKENE TEACHING DATASET OF THE D2 DIGEST: a deterministic generator.
//
// THESE ARE NOT THE CAPSTONE DATASETS. The capstones run three other fields on
// other seeds, other names and other values; nothing here imports
// d2_capstone.mjs and nothing there imports this. gate_capstone_leak.mjs proves
// both directions.
//
// DETERMINISM IS DESIGNED IN. Every random draw goes through the canonical
// mulberry32 and randomNormal of lib/stats (the vendored engines), ONE stream
// on a STATED seed, drawn in a fixed order, and every value is rounded to the
// decimals a real file would carry. Nothing reads a clock, Math.random, a
// locale or the network.
//
// THE FIELD. Ten wells, EKENE-1 to EKENE-10, thirty samples each at a one foot
// step through the same reservoir interval, every well at its own depth. Each
// sample carries six log channels (GR, RHOB, NPHI, RT, CALI and DT), a core
// calibrated porosity PHIC, and a binary PAY label from a STATED RULE. Each
// well carries four well-level attributes that are constant down the well:
// easting, northing, kelly bushing elevation and mud weight.
//
// EVERY PLANTED STRUCTURE IS DOCUMENTED in PLANTED below, with the named
// method that finds it. d2_dump.mjs asserts that each one IS found by that
// method, so a generator edit that moves a structure out of reach fails the
// build.
//
// The NextGen teaching lab carries the SAME dataset as a committed JSON copy
// (src/components/course/panels/mlcore/ekeneWells.json), and its vitest suite
// asserts that copy is deep-equal to what this file generates.
//
//   node d2_fields.mjs --json     the dataset as JSON, for the lab copy
import process from 'node:process';

const ROOT = process.env.D2_ENGINES || '/root/wt-dai-d2-nextgen/packages/engines';
const { mulberry32, randomNormal } = await import(`${ROOT}/lib/stats/stats.js`);

const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const r3 = (x) => Math.round(x * 1000) / 1000;
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/** The one stated seed. */
export const SEED = 20260913;

/** Wells and samples, stated. */
export const N_WELLS = 10;
export const N_PER_WELL = 30;
export const WELL_IDS = Object.freeze(Array.from({ length: N_WELLS }, (_, i) => `EKENE-${i + 1}`));

/** The well whose sonic was never run (every DT null), stated. It was also
 *  drilled through a hot shale: its GR reads a stated amount above what the
 *  rock alone gives, so its GR sits beyond the range of the wells that train. */
export const NO_SONIC_WELL = 'EKENE-6';
export const HOT_WELL = NO_SONIC_WELL;
export const HOT_GR_ADD = 30;

/** The pay rule, stated: a sample is pay when PHIC >= PAY_PHIC and RT >= PAY_RT. */
export const PAY_PHIC = 0.16;
export const PAY_RT = 10;

/** The log channels, their units and what each is. */
export const CHANNELS = Object.freeze([
  ['GR', 'gAPI', 'gamma ray'],
  ['RHOB', 'g/cm3', 'bulk density'],
  ['NPHI', 'v/v', 'neutron porosity'],
  ['RT', 'ohm.m', 'deep resistivity'],
  ['CALI', 'in', 'caliper, the hole diameter'],
  ['DT', 'us/ft', 'compressional sonic slowness'],
]);
/** The well-level attributes, their units and what each is. */
export const ATTRIBUTES = Object.freeze([
  ['easting', 'km', 'surface easting'],
  ['northing', 'km', 'surface northing'],
  ['kb', 'm', 'kelly bushing elevation'],
  ['mudWeight', 'ppg', 'mud weight while logging'],
]);

const build = () => {
  const g = mulberry32(SEED);
  const nz = () => randomNormal(g);
  // Well-level draws first, in well order, so the samples cannot move them.
  const wells = WELL_IDS.map((id, w) => ({
    id,
    easting: r2(412 + 6 * g()),
    northing: r2(208 + 5 * g()),
    kb: r1(18 + 14 * g()),
    mudWeight: r1(9.2 + 1.4 * g()),
    top: 7800 + 55 * w + Math.round(30 * g()),
    // The well-level sonic offset, us/ft: compaction and tool calibration a
    // well carries on every sample. Never written to the file.
    dtOffset: 4.5 * nz(),
  }));
  const rows = [];
  const withheld = [];
  wells.forEach((W) => {
    for (let i = 0; i < N_PER_WELL; i += 1) {
      const vsh = Math.min(0.95, Math.max(0.02, 0.35 + 0.25 * nz()));
      const phi = Math.max(0.03, 0.27 * (1 - vsh) + 0.03 * nz());
      const gr = r2(28 + 92 * vsh + 5 * nz() + (W.id === HOT_WELL ? HOT_GR_ADD : 0));
      const rhob = r3(2.65 - 1.65 * phi + 0.12 * vsh + 0.015 * nz());
      const nphi = r3(phi + 0.22 * vsh + 0.012 * nz());
      const hc = phi > 0.15 && g() < 0.6;
      const rt = r2(hc ? 12 + 100 * phi * Math.exp(0.3 * nz()) : 1.2 + 2.5 * vsh * Math.exp(0.25 * nz()));
      const cali = r2(8.5 + Math.abs(0.35 * nz()));
      const dt = r1(55.5 * (1 - phi) + 189 * phi + 70 * vsh + W.dtOffset + 2.5 * nz());
      const phic = r3(phi + 0.02 * nz());
      const pay = phic >= PAY_PHIC && rt >= PAY_RT ? 1 : 0;
      const depth = W.top + i;
      if (W.id === NO_SONIC_WELL) withheld.push(dt);
      rows.push({
        well: W.id, depth, GR: gr, RHOB: rhob, NPHI: nphi, RT: rt, CALI: cali,
        DT: W.id === NO_SONIC_WELL ? null : dt, PHIC: phic, PAY: pay,
      });
    }
  });
  return {
    wells: wells.map(({ id, easting, northing, kb, mudWeight, top }) => ({ id, easting, northing, kb, mudWeight, top })),
    rows,
    // The sonic of the no-sonic well as the generator drew it. No real field
    // has this; the synthetic one does, so the course can check a prediction
    // against it once, and says so.
    withheld: { well: NO_SONIC_WELL, DT: withheld },
    // The well-level offsets, for the dump's planted-structure check only.
    offsets: Object.fromEntries(wells.map((W) => [W.id, W.dtOffset])),
  };
};

const BUILT = build();

/** The dataset as the lab and the digest read it. */
export const EKENE = freeze({
  seed: SEED,
  wells: BUILT.wells,
  rows: BUILT.rows,
  withheld: BUILT.withheld,
});
/** The planted well-level sonic offsets, us/ft. The digest checks them; no lesson quotes them. */
export const DT_OFFSETS = freeze(BUILT.offsets);

/** Every planted structure: [what, where, how it was planted, the named method that finds it]. */
export const PLANTED = Object.freeze([
  ['a well-level sonic offset', 'every well', 'each well adds its own drawn offset to every DT sample', 'the mean OLS residual per well, logs only'],
  ['well-identifying attributes', 'every well', 'easting, northing, KB and mud weight are constant down each well and unrelated to the offset', 'leakageDemo with the attributes: positive optimism on each stated seed'],
  ['a split that flatters nothing', 'logs only', 'no feature identifies a well', 'leakageDemo on the logs alone: a stated seed where the optimism is negative'],
  ['a well with no sonic', NO_SONIC_WELL, 'every DT sample is null', 'ols refuses the first null target by name'],
  ['a hot shale in the no-sonic well', HOT_WELL, `GR raised by ${HOT_GR_ADD} gAPI on every sample`, 'min-max scaling fitted on the nine sonic wells maps its highest GR above 1'],
  ['a pay label from a stated rule', 'every sample', `PAY is 1 when PHIC >= ${PAY_PHIC} and RT >= ${PAY_RT} ohm.m`, 'logistic on PHIC alone, rows with RT at or above the cutoff: completely separated'],
  ['a caliper that carries no sonic signal', 'every sample', 'CALI is drawn independently of every other channel', 'permutationImportance: CALI ranks last'],
]);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(EKENE)}\n`);
}
