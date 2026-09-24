// THE EKENE TEACHING DATASET OF THE D1 DIGEST: a deterministic generator.
//
// THESE ARE NOT THE CAPSTONE DATASETS. The capstones run three other fields on
// other seeds, other names and other values; nothing here imports
// d1_capstone.mjs and nothing there imports this. gate_capstone_leak.mjs proves
// both directions.
//
// DETERMINISM IS DESIGNED IN. Every random draw goes through the canonical
// mulberry32 and randomNormal of lib/stats (the vendored engines), one
// generator per stream with a STATED seed, drawn in a fixed order, and every
// value is rounded to the decimals a real file would carry before any defect is
// planted. Nothing reads a clock, Math.random, a locale or the network.
//
// EVERY PLANTED DEFECT IS DOCUMENTED in PLANTED below: the stream, the channel,
// the entries, what was done to them and which engine check is meant to find
// it. d1_dump.mjs asserts that each planted defect IS found by the check named,
// so a generator edit that moves a defect out of reach fails the build.
//
// The NextGen teaching lab carries the SAME dataset as a committed JSON copy
// (src/components/course/panels/dataqc/ekeneDataset.json), and its vitest suite
// asserts that copy is deep-equal to what this file generates.
//
//   node d1_fields.mjs --json     the dataset as JSON, for the lab copy
import process from 'node:process';

const ROOT = process.env.D1_ENGINES || '/root/wt-dai-d1-nextgen/packages/engines';
const { mulberry32, randomNormal } = await import(`${ROOT}/lib/stats/stats.js`);

const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const r3 = (x) => Math.round(x * 1000) / 1000;
const r4 = (x) => Math.round(x * 10000) / 10000;
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/** The stated seeds, one stream each. */
export const SEEDS = Object.freeze({
  log: 20260901, production: 20260902, core: 20260903, gauge: 20260904, pressure: 20260905,
});

/* ======================================================= EKENE-7, a well log

   240 samples at a half-foot step from 8400 ft, five channels. Lithology by
   sample: shale 0 to 39, oil sand 40 to 99, shale 100 to 129, water sand 130
   to 199, shale 200 to 239. In the sands porosity is drawn first and density,
   neutron and sonic follow it, so density and neutron are negatively
   correlated inside a sand, as they are in rock. */

/** The lithology by entry, stated: [name, first entry, last entry]. */
export const LITH_RANGES = Object.freeze([['shale', 0, 39], ['oil sand', 40, 99], ['shale', 100, 129], ['water sand', 130, 199], ['shale', 200, 239]]);
const LITH = (i) => LITH_RANGES.find(([, a, b]) => i >= a && i <= b)[0];

const buildLog = () => {
  const g = mulberry32(SEEDS.log);
  const nz = () => randomNormal(g);
  const n = 240;
  const depth = [];
  const GR = []; const RHOB = []; const NPHI = []; const RT = []; const DT = [];
  for (let i = 0; i < n; i += 1) {
    // One sample is missing from the depth index after entry 149: the index
    // jumps a whole foot there.
    depth.push(8400 + 0.5 * i + (i >= 150 ? 0.5 : 0));
    const lith = LITH(i);
    if (lith === 'shale') {
      const a = nz(); const b = nz(); const c = nz(); const d = nz(); const e = nz();
      GR.push(r2(95 + 6 * a));
      RHOB.push(r3(2.52 + 0.02 * b));
      NPHI.push(r3(0.36 + 0.02 * c));
      RT.push(r2(2 + 0.3 * d));
      DT.push(r1(108 + 2 * e));
    } else {
      const phi = 0.22 + 0.03 * nz();
      const a = nz(); const b = nz(); const c = nz(); const d = nz(); const e = nz();
      GR.push(r2(35 + 5 * a));
      RHOB.push(r3(2.65 - 1.65 * phi + 0.01 * b));
      NPHI.push(r3(phi + 0.02 + 0.01 * c));
      RT.push(r2(lith === 'oil sand' ? 25 + 4 * d : 1.2 + 0.2 * d));
      DT.push(r1(55.5 * (1 - phi) + 189 * phi + 1.5 * e));
    }
  }
  // ---- the planted defects ----
  for (let i = 80; i <= 91; i += 1) RHOB[i] = null; // a pad lift: twelve density samples lost in a row
  [25, 118, 205].forEach((i) => { NPHI[i] = null; }); // three single neutron dropouts
  for (let i = 236; i <= 239; i += 1) GR[i] = -999.25; // the LAS null value, never converted
  for (let i = 150; i <= 159; i += 1) NPHI[i] = r2(NPHI[i] * 100); // ten neutron samples written in percent
  RT[120] = 0; // a resistivity of zero
  GR[70] = r2(GR[70] + 60); // two gamma ray spikes inside the sands
  GR[170] = r2(GR[170] + 60);
  for (let i = 176; i <= 183; i += 1) DT[i] = DT[175]; // a sonic tool stuck for nine samples
  RHOB[60] = 2.221; // one bad-hole sample: each value sits inside its sand's
  NPHI[60] = 0.188; // range, the pair sits far off the density-neutron trend
  return {
    well: 'EKENE-7', indexUnit: 'ft', step: 0.5, n, depth,
    lithology: Array.from({ length: n }, (_, i) => LITH(i)),
    channels: {
      GR: { unit: 'gAPI', values: GR },
      RHOB: { unit: 'g/cm3', values: RHOB },
      NPHI: { unit: 'v/v', values: NPHI },
      RT: { unit: 'ohm.m', values: RT },
      DT: { unit: 'us/ft', values: DT },
    },
  };
};

/* =============================== EKENE-7, the depth index at a run splice

   Stated, fifteen entries: where two logging runs were spliced, the delivered
   index repeats, reverses, skips and loses an entry. */

const SPLICE = {
  well: 'EKENE-7',
  index: [8520.0, 8520.5, 8521.0, 8521.5, 8522.0, 8521.5, 8522.5, 8523.0, 8523.0, 8523.5, 8524.5, 8525.0, null, 8526.0, 8526.5],
};

/* ================================== EKENE-3, ninety days of daily production

   Oil declines from about 1480 bbl/d, water cut rises from 0.18, the gas-oil
   ratio holds near 0.62 Mscf/bbl. The reported columns are what the field
   sheet carries: oil, water, gas, the gross liquid total, a water cut to four
   decimals, hours on, a status and the cumulative oil. */

const buildProduction = () => {
  const g = mulberry32(SEEDS.production);
  const nz = () => randomNormal(g);
  const n = 90;
  const day = []; const oil = []; const water = []; const gas = []; const gross = [];
  const waterCut = []; const hoursOn = []; const status = []; const cumOil = [];
  const trueOil = [];
  let cum = 1250000;
  for (let d = 1; d <= n; d += 1) {
    const a = nz(); const b = nz(); const c = nz();
    const o = r1(1480 * Math.exp(-0.0025 * d) + 15 * a);
    const wc = 0.18 + 0.0013 * d + 0.005 * b;
    const w = r1((o * wc) / (1 - wc));
    const gg = r1(o * (0.62 + 0.01 * c));
    day.push(d);
    oil.push(o); water.push(w); gas.push(gg);
    gross.push(r1(o + w));
    waterCut.push(r4(w / (o + w)));
    hoursOn.push(24);
    status.push('producing');
    trueOil.push(o);
  }
  const at = (d) => d - 1;
  // ---- the planted defects ----
  // A partial day before the shut in, and two shut-in days. On the second the
  // allocation carried the previous rate forward.
  hoursOn[at(59)] = 18.5;
  [60, 61].forEach((d) => { hoursOn[at(d)] = 0; status[at(d)] = 'shut-in'; trueOil[at(d)] = 0; });
  oil[at(60)] = 0; water[at(60)] = 0; gas[at(60)] = 0; gross[at(60)] = 0; waterCut[at(60)] = null;
  oil[at(61)] = oil[at(59)]; water[at(61)] = water[at(59)]; gas[at(61)] = gas[at(59)];
  gross[at(61)] = gross[at(59)]; waterCut[at(61)] = waterCut[at(59)];
  // A three-day SCADA outage on the oil meter.
  [31, 32, 33].forEach((d) => { oil[at(d)] = null; waterCut[at(d)] = null; gross[at(d)] = null; });
  // An allocation back-out booked as a negative oil rate.
  oil[at(47)] = -18.5; trueOil[at(47)] = 0;
  gross[at(47)] = r1(oil[at(47)] + water[at(47)]); waterCut[at(47)] = null;
  // Five days of water cut written in percent.
  for (let d = 20; d <= 24; d += 1) waterCut[at(d)] = r2(waterCut[at(d)] * 100);
  // A water cut typed from the day before.
  waterCut[at(55)] = waterCut[at(54)];
  // A truck load booked into the gross total, and a small difference inside tolerance.
  gross[at(40)] = r1((oil[at(40)] + water[at(40)]) * 1.021);
  gross[at(41)] = r1((oil[at(41)] + water[at(41)]) * 1.003);
  // The gas meter held its last value for seven days.
  for (let d = 75; d <= 81; d += 1) gas[at(d)] = gas[at(74)];
  // The cumulative: the true oil summed, with the reading on day 69 lost and a
  // keying error of one thousand barrels on day 70.
  for (let i = 0; i < n; i += 1) { cum = r1(cum + trueOil[i]); cumOil.push(cum); }
  cumOil[at(69)] = null;
  cumOil[at(70)] = r1(cumOil[at(70)] - 10000);
  return {
    well: 'EKENE-3', units: { oil: 'bbl/d', water: 'bbl/d', gas: 'Mscf/d', gross: 'bbl/d', cumOil: 'bbl', hoursOn: 'h' },
    n, day, oil, water, gas, gross, waterCut, hoursOn, status, cumOil,
  };
};

/* ================================================ well names from three sources */

const IDS = {
  source: 'the well header lists of the drilling database, the production database and a consultant spreadsheet, concatenated',
  ids: ['EKENE-1', 'EKENE-2', 'EKENE-3', 'EKENE-3', 'Ekene 3', 'EKENE-03', 'EKENE-4', 'EKNE-4', 'EKENE-7', 'EKENE 7',
    'ÉKENE-7', 'EKENE-10', 'EKENE-12'],
};

/* =============================== EKENE-7 core plugs, and ten gauge readings */

const buildCore = () => {
  const g = mulberry32(SEEDS.core);
  const phi = Array.from({ length: 14 }, () => r3(0.214 + 0.012 * randomNormal(g)));
  phi[8] = 0.281; // a fractured plug
  const twoSpikes = phi.slice();
  twoSpikes[2] = 0.279; // a second high plug from the same fracture
  return { well: 'EKENE-7', unit: 'v/v', porosity: phi, twoSpikes };
};

const buildGauge = () => {
  const g = mulberry32(SEEDS.gauge);
  const t = Array.from({ length: 10 }, () => r1(212.5 + 0.15 * randomNormal(g)));
  t[7] = 240.1; // a gauge glitch
  return { well: 'EKENE-3', unit: 'degF', readings: t };
};

/* ========================= EKENE-3 flowing wellhead pressure, two phases

   Phase one is fifty in-control days. Phase two is forty monitored days: a
   gauge glitch on day 8 and, from day 16, liquid loading lowers the pressure
   by 1.2 of the process standard deviation. */

const buildPressure = () => {
  const g = mulberry32(SEEDS.pressure);
  const history = Array.from({ length: 50 }, () => r1(612 + 4 * randomNormal(g)));
  const monitored = Array.from({ length: 40 }, (_, i) => r1(612 - (i >= 15 ? 4.8 : 0) + 4 * randomNormal(g)));
  monitored[7] = r1(monitored[7] + 22);
  return { well: 'EKENE-3', unit: 'psig', history, monitored, shiftStartsDay: 16, glitchDay: 8 };
};

export const EKENE_LOG = freeze(buildLog());
export const EKENE_SPLICE = freeze(SPLICE);
export const EKENE_PROD = freeze(buildProduction());
export const EKENE_IDS = freeze(IDS);
export const EKENE_CORE = freeze(buildCore());
export const EKENE_GAUGE = freeze(buildGauge());
export const EKENE_WHP = freeze(buildPressure());

/** A slow drift, stated: seven readings each 0.1 above the last. */
export const SLOW_DRIFT = Object.freeze([410.0, 410.1, 410.2, 410.3, 410.4, 410.5, 410.6]);

/** Every planted defect, and the engine check meant to find it. */
export const PLANTED = Object.freeze([
  ['EKENE-7 log', 'RHOB', 'entries 80 to 91', 'twelve samples set missing (a pad lift)', 'completeness: one gap run of twelve'],
  ['EKENE-7 log', 'NPHI', 'entries 25, 118 and 205', 'single samples set missing', 'completeness: three gap runs of one'],
  ['EKENE-7 log', 'GR', 'entries 236 to 239', 'the LAS missing-value sentinel -999.25 left in place', 'rangeCheck gammaRay: below the minimum; completeness counts them present'],
  ['EKENE-7 log', 'NPHI', 'entries 150 to 159', 'written in percent', 'rangeCheck fraction v/v: above the maximum'],
  ['EKENE-7 log', 'RT', 'entry 120', 'a resistivity of zero', 'rangeCheck resistivity ohm.m: the minimum itself is not allowed'],
  ['EKENE-7 log', 'GR', 'entries 70 and 170', 'sixty gAPI added inside a sand', 'hampel: a local spike the global z-score cannot see'],
  ['EKENE-7 log', 'DT', 'entries 175 to 183', 'the sonic held one value', 'frozenRuns: one run of nine'],
  ['EKENE-7 log', 'RHOB and NPHI', 'entry 60', 'a density and a neutron each inside their sand range, off the trend together', 'mahalanobis on the oil sand'],
  ['EKENE-7 log', 'depth', 'after entry 149', 'one sample missing from the index', 'indexCheck: an irregular step; coverage with a half-foot maxStep: a hole'],
  ['EKENE-7 splice', 'depth', 'entries 5, 8, 10, 12 and 13', 'a reversal onto an earlier depth, a repeat, a skipped step, a lost entry', 'indexCheck: duplicates, a reversal, irregular steps, a missing entry'],
  ['EKENE-3 production', 'oil', 'days 31 to 33', 'a meter outage', 'completeness: one gap run of three'],
  ['EKENE-3 production', 'oil', 'day 47', 'an allocation back-out booked as -18.5 bbl/d', 'rateCheck: a negative rate'],
  ['EKENE-3 production', 'oil', 'day 61', 'the rate carried forward on a shut-in day', 'rateCheck: a rate while shut in'],
  ['EKENE-3 production', 'waterCut', 'days 20 to 24', 'written in percent', 'waterCutCheck: out of range'],
  ['EKENE-3 production', 'waterCut', 'day 55', 'typed from day 54', 'waterCutCheck: a mismatch against water / (oil + water)'],
  ['EKENE-3 production', 'gross', 'day 40', 'a truck load booked into the gross total', 'phaseSumCheck: a mismatch; day 41 carries a small difference inside tolerance'],
  ['EKENE-3 production', 'gas', 'days 75 to 81', 'the meter held its last value', 'frozenRuns: one run of eight'],
  ['EKENE-3 production', 'cumOil', 'days 69 and 70', 'a lost reading, then a keying error of ten thousand barrels', 'cumulativeCheck: a decrease against the last present value'],
  ['well names', 'ids', 'thirteen entries', 'repeats, spellings, a leading zero, an accent and a typing slip', 'duplicateIdentifiers: exact, normalised and near pairs'],
  ['EKENE-7 core', 'porosity', 'plug 9 (entry 8)', 'a fractured plug', 'grubbsTest: one outlier; the two-spike copy adds entry 2 and masks it'],
  ['EKENE-3 gauge', 'readings', 'entry 7', 'a gauge glitch in ten readings', 'zScores: the ceiling at ten values; modifiedZScores flags it'],
  ['EKENE-3 pressure', 'monitored', 'day 8, and days 16 to 40', 'a glitch, then a shift of 1.2 process standard deviations down', 'individualsChart sees the glitch; ewmaChart and cusumChart see the shift'],
]);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify({
    SEEDS, EKENE_LOG, EKENE_SPLICE, EKENE_PROD, EKENE_IDS, EKENE_CORE, EKENE_GAUGE, EKENE_WHP, SLOW_DRIFT,
  }, null, 1)}\n`);
}
