// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of surveillance_cases.json,
// allocation_cases.json, lift_screening_cases.json and lift_advisor_cases.json
// (plus sweeps around those published inputs, and TEACHING CASES this wave
// designed for itself). THE PD9 CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY:
// nothing here imports, reads or reproduces pd9_fields.mjs, fields.json, or any
// capstone field name, well name, ledger date, rate cycle, hours table, decline
// rate, meter bias, test date, depth, API, bottomhole temperature or wellhead
// pressure. The teaching digest and the capstone are two files with opposite
// audiences and they never share a number.
//
// Usage:  node /root/pd-wip-surveillance/pd9_dump.mjs > /root/pd-wip-surveillance/digest.txt
//
// Engines:  packages/engines/engines/production/surveillance.js
//           packages/engines/engines/production/allocation.js
//           packages/engines/engines/production/liftScreening.js
//           packages/engines/engines/production/liftAdvisor.js
// Goldens:  packages/engines/test-data/production/goldens/surveillance_cases.json
//           packages/engines/test-data/production/goldens/allocation_cases.json
//           packages/engines/test-data/production/goldens/lift_screening_cases.json
//           packages/engines/test-data/production/goldens/lift_advisor_cases.json
//
// EVERY LINE IN THIS FILE IS DETERMINISTIC. summarizeDeferments reads the WALL
// CLOCK when its asOf is omitted, which is Section 28's finding; that case is
// therefore printed as a BOOLEAN and as an anchored recomputation, never as the
// wall-clock number, so two runs a week apart are byte identical.

import fs from 'fs';

const ROOT = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const S = await import(`${ROOT}/engines/production/surveillance.js`);
const A = await import(`${ROOT}/engines/production/allocation.js`);
const LS = await import(`${ROOT}/engines/production/liftScreening.js`);
const LA = await import(`${ROOT}/engines/production/liftAdvisor.js`);
const CAT = await import(`${ROOT}/engines/production/data/espCatalog.js`);
const gold = (n) => JSON.parse(fs.readFileSync(`${ROOT}/test-data/production/goldens/${n}`, 'utf8'));
const GS = gold('surveillance_cases.json');
const GA = gold('allocation_cases.json');
const GL = gold('lift_screening_cases.json');
const GD = gold('lift_advisor_cases.json');

const out = [];
const w = (s) => out.push(s);
const f = (x, n = 6) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toFixed(n);
const yn = (b) => (b === true ? 'true' : b === false ? 'false' : 'n/a');
const j = (o) => JSON.stringify(o);

const MS_DAY = 86400000;
const iso = (d) => new Date(d * MS_DAY).toISOString().slice(0, 10);
const dayOf = (s) => Math.round(new Date(`${s}T00:00:00Z`).getTime() / MS_DAY);

// ============================================================ fixtures
//
// THE TEACHING FIELD. OGUTA is a field this wave invented so that every Expert
// result has a case a lesson may quote. It is not a real field, none of its
// wells is a real well, and not one of its rows is a published case. It runs a
// DAILY ledger from 2024-09-12 to 2024-11-20 inclusive, seventy calendar days,
// with one well on a MONTHLY ledger so that the widening rule has something to
// widen against.
const TF = {
  field: 'OGUTA',
  firstDate: '2024-09-12',
  lastDate: '2024-11-20',
  // OGUTA-2, the seam well. A perfectly constant watercut and a perfectly
  // constant gas-oil ratio through the baseline, so that where the daily ratio
  // does not move a mean of ratios and a ratio of sums are the same number.
  // The whole disagreement is then created inside the recent window, by three
  // days on which the oil collapses and the gas does not follow it down.
  o2BaselineOilCycle: [1042, 1019, 1063, 1031],
  o2WaterPerOil: 0.31,   // watercut = 0.31/1.31 exactly, every baseline day
  o2GasPerOil: 0.58,     // Mscf per stb, so GOR = 580 scf/stb exactly
  // the seven recent days, oldest first: [oil stb, water stb, gas Mscf], 24 h
  o2Recent: [
    [1008, 312, 585],
    [1021, 316, 592],
    [88, 246, 149],
    [82, 231, 141],
    [1035, 321, 600],
    [79, 224, 137],
    [1014, 314, 588],
  ],
  // OGUTA-6, the uptime well. The producing-day oil rate is held EXACTLY
  // constant across the recent window and the calendar volume swings by a
  // factor of nearly three, because only the hours move.
  o6BaselineOilCycle: [503, 488, 517],
  o6WaterPerOil: 0.22,
  o6GasPerOil: 0.47,
  o6PdRate: 512,         // stb/d of oil on a producing-day basis, every recent day
  o6RecentHours: [16.5, 7.8, 19.2, 14.1, 9.4, 21.6, 12.3],
  // OGUTA-9, the clean decliner. Raises no exception at any default setting.
  o9Qi: 1180,
  o9Di: 0.0034,          // nominal per DAY
  o9WaterPerOil: 0.36,
  o9GasPerOil: 0.72,     // GOR = 720 scf/stb
  // OGUTA-14, the monthly well. Six period rows, the last of them covering
  // FOURTEEN DAYS rather than a month, which is the whole of Section 10: the
  // period volume halves while the daily rate goes UP.
  o14Rows: [
    ['2024-05-31', 26400], ['2024-06-30', 25600], ['2024-07-31', 24800],
    ['2024-08-31', 24000], ['2024-09-30', 23200], ['2024-10-14', 11600],
  ],
  o14WaterPerOil: 0.44,
  o14GasPerOil: 0.63,
  // OGUTA-17, the well that stops sending rows. It does not stop producing.
  o17Qi: 690,
  o17Di: 0.0092,
  o17WaterPerOil: 0.29,
  o17GasPerOil: 0.51,
  o17LastReportDate: '2024-10-28',
  // OGUTA-5, the small well. Its oil baseline sits UNDER minOilRate.
  o5BaselineOil: 3.6,
  o5BaselineWater: 1.4,
  o5RecentOil: 1.1,
  o5RecentWater: 7.2,
  o5GasPerOil: 0.4,
  // OGUTA-3W, the injector.
  o3wBaselineCycle: [2860, 2790, 2910],
  o3wRecent: [1980, 2020, 1940, 2060, 1900, 2100, 1960],
  // OGUTA-21, the observation well. Zero volumes, a full 24 hours every day.
  o21HoursOn: 24,
  meterBias: 1.028,      // the facility meter runs 2.8 per cent above the wells
  allocFromDate: '2024-10-31',
};

const WELLS = {
  o2: { id: 'w-oguta-2', name: 'OGUTA-2', well_type: 'producer' },
  o5: { id: 'w-oguta-5', name: 'OGUTA-5', well_type: 'producer' },
  o6: { id: 'w-oguta-6', name: 'OGUTA-6', well_type: 'producer' },
  o9: { id: 'w-oguta-9', name: 'OGUTA-9', well_type: 'producer' },
  o14: { id: 'w-oguta-14', name: 'OGUTA-14', well_type: 'producer' },
  o17: { id: 'w-oguta-17', name: 'OGUTA-17', well_type: 'producer' },
  o3w: { id: 'w-oguta-3w', name: 'OGUTA-3W', well_type: 'injector' },
  o21: { id: 'w-oguta-21', name: 'OGUTA-21', well_type: 'observation' },
};

const D0 = dayOf(TF.firstDate);
const DN = dayOf(TF.lastDate);
const NDAYS = DN - D0 + 1;
const DATES = [];
for (let d = D0; d <= DN; d += 1) DATES.push(iso(d));

const row = (well, date, o) => ({
  well, well_id: well.id, prod_date: date,
  oil_stb: 0, water_stb: 0, gas_mscf: 0, winj_stb: 0, ginj_mscf: 0, hours_on: 24, ...o,
});

const o9Oil = (i) => TF.o9Qi * Math.exp(-TF.o9Di * i);
const o17Oil = (i) => TF.o17Qi * Math.exp(-TF.o17Di * i);

const LEDGER = [];
const O17_LAST = dayOf(TF.o17LastReportDate) - D0;
DATES.forEach((date, i) => {
  const back = NDAYS - 1 - i;
  const recent = back < 7;
  const r = 6 - back;

  if (recent) {
    const [o, wa, g] = TF.o2Recent[r];
    LEDGER.push(row(WELLS.o2, date, { oil_stb: o, water_stb: wa, gas_mscf: g }));
  } else {
    const o = TF.o2BaselineOilCycle[i % TF.o2BaselineOilCycle.length];
    LEDGER.push(row(WELLS.o2, date, {
      oil_stb: o, water_stb: o * TF.o2WaterPerOil, gas_mscf: o * TF.o2GasPerOil,
    }));
  }

  if (recent) {
    const h = TF.o6RecentHours[r];
    const o = (TF.o6PdRate * h) / 24;
    LEDGER.push(row(WELLS.o6, date, {
      hours_on: h, oil_stb: o, water_stb: o * TF.o6WaterPerOil, gas_mscf: o * TF.o6GasPerOil,
    }));
  } else {
    const o = TF.o6BaselineOilCycle[i % TF.o6BaselineOilCycle.length];
    LEDGER.push(row(WELLS.o6, date, {
      oil_stb: o, water_stb: o * TF.o6WaterPerOil, gas_mscf: o * TF.o6GasPerOil,
    }));
  }

  const q9 = o9Oil(i);
  LEDGER.push(row(WELLS.o9, date, {
    oil_stb: q9, water_stb: q9 * TF.o9WaterPerOil, gas_mscf: q9 * TF.o9GasPerOil,
  }));

  if (i <= O17_LAST) {
    const q17 = o17Oil(i);
    LEDGER.push(row(WELLS.o17, date, {
      oil_stb: q17, water_stb: q17 * TF.o17WaterPerOil, gas_mscf: q17 * TF.o17GasPerOil,
      hours_on: null,
    }));
  }

  const o5o = recent ? TF.o5RecentOil : TF.o5BaselineOil;
  const o5w = recent ? TF.o5RecentWater : TF.o5BaselineWater;
  LEDGER.push(row(WELLS.o5, date, {
    oil_stb: o5o, water_stb: o5w, gas_mscf: o5o * TF.o5GasPerOil,
  }));

  const winj = recent
    ? TF.o3wRecent[r]
    : TF.o3wBaselineCycle[i % TF.o3wBaselineCycle.length];
  LEDGER.push(row(WELLS.o3w, date, { winj_stb: winj }));

  LEDGER.push(row(WELLS.o21, date, { hours_on: TF.o21HoursOn }));
});

TF.o14Rows.forEach(([date, oil]) => {
  LEDGER.push(row(WELLS.o14, date, {
    oil_stb: oil, water_stb: oil * TF.o14WaterPerOil, gas_mscf: oil * TF.o14GasPerOil,
    hours_on: null,
  }));
});

const TWS = S.buildWellSeries(LEDGER);
const TFS = S.buildFieldSeries(LEDGER);
const TEX = S.detectExceptions(TWS);

// The teaching well tests, and the metered facility totals for the last
// twenty-one days of the ledger.
const TTESTS = [
  { id: 'g-o2-1', well_id: WELLS.o2.id, well: WELLS.o2, test_date: '2024-06-18', oil_rate_stbd: 1074, water_rate_stbd: 333, gas_rate_mscfd: 623, duration_hours: 24, thp_psia: 305, is_valid: true },
  { id: 'g-o2-2', well_id: WELLS.o2.id, well: WELLS.o2, test_date: '2024-11-02', oil_rate_stbd: 1036, water_rate_stbd: 321, gas_rate_mscfd: 601, duration_hours: 18, thp_psia: 298, is_valid: true },
  { id: 'g-o6-1', well_id: WELLS.o6.id, well: WELLS.o6, test_date: '2024-08-25', oil_rate_stbd: 509, water_rate_stbd: 112, gas_rate_mscfd: 239, duration_hours: 12, thp_psia: 271, is_valid: true },
  // is_valid TRUE, and its watercut is nine points off the ledger on its own
  // test date. validateWellTests says so; groupTests reads is_valid and
  // nothing else, so this test carries the well regardless.
  { id: 'g-o9-1', well_id: WELLS.o9.id, well: WELLS.o9, test_date: '2024-10-09', oil_rate_stbd: 928, water_rate_stbd: 604, gas_rate_mscfd: 668, duration_hours: 24, thp_psia: 288, is_valid: true },
  // OGUTA-17: an old test that ages out inside the allocated window, and a
  // recent one QC threw away for duration.
  { id: 'g-o17-1', well_id: WELLS.o17.id, well: WELLS.o17, test_date: '2024-05-09', oil_rate_stbd: 688, water_rate_stbd: 199, gas_rate_mscfd: 351, duration_hours: 20, thp_psia: 244, is_valid: true },
  { id: 'g-o17-2', well_id: WELLS.o17.id, well: WELLS.o17, test_date: '2024-11-06', oil_rate_stbd: 421, water_rate_stbd: 122, gas_rate_mscfd: 215, duration_hours: 2.5, thp_psia: 236, is_valid: false },
];

const ALLOC_FROM = dayOf(TF.allocFromDate);
const TTOTALS = [];
DATES.filter((d) => dayOf(d) >= ALLOC_FROM).forEach((date) => {
  const i = dayOf(date) - D0;
  const rows = LEDGER.filter((r) => r.prod_date === date && r.well_id !== WELLS.o3w.id
    && r.well_id !== WELLS.o21.id);
  let oil = 0; let wat = 0; let gas = 0;
  rows.forEach((r) => { oil += r.oil_stb; wat += r.water_stb; gas += r.gas_mscf; });
  // OGUTA-17 keeps producing after it stops sending rows, and only the meter
  // ever sees it.
  if (i > O17_LAST) {
    const q = o17Oil(i);
    oil += q; wat += q * TF.o17WaterPerOil; gas += q * TF.o17GasPerOil;
  }
  TTOTALS.push({
    total_date: date,
    oil_stb: oil * TF.meterBias,
    water_stb: wat * TF.meterBias,
    gas_mscf: gas * TF.meterBias,
  });
});

const TWELLS = Object.values(WELLS);
const TALLOC = A.computeAllocation({
  wells: TWELLS, tests: TTESTS, ledger: LEDGER, totals: TTOTALS, settings: {},
});

// ------------------------------------------------------- the golden field
const GLEDGER = GS.ledger.map((r) => ({ ...r, well: GS.wells[r.well_id] }));
const GWS = S.buildWellSeries(GLEDGER);
const GFS = S.buildFieldSeries(GS.ledger);

// ------------------------------------------------------- stubs
//
// The lift advisor takes its ESP, rod pump and gas lift chains as FUNCTIONS,
// so every policy branch is arithmetic when the chain's answers are known.
// These stubs are the wave's own, written to the same shape the engine's gates
// use, and their numbers are teaching numbers, not published ones.
const rodChain = (outs) => ({
  runRodDesign: ({ form }) => {
    const i = LA.ROD_TRIALS.findIndex((t) => String(t.plungerDIn) === form.plungerDIn);
    const o = outs[i];
    if (o.refused) return { ok: false, errors: [o.refused] };
    const d = {
      producedBpd: o.producedBpd, plungerStrokeIn: Number(form.strokeIn) * 0.9,
      pprlLb: 14200, balance: { peakTorqueInLb: 286000 }, gas: { fillage: 0.83 },
      warnings: [],
    };
    if (o.loadingPct !== null) d.worstSection = { loadingPct: o.loadingPct, label: '7/8 in' };
    return { ok: true, errors: [], design: d };
  },
});
const TDEPTH = 9200;   // ft true vertical, the teaching lift well
const teachModel = (over = {}) => ({
  phase: 'oil', tvdMax: TDEPTH, tAt: (t) => 96 + (232 - 96) * (t / TDEPTH),
  trajectory: { points: [{ md: 0, tvd: 0 }, { md: 3400, tvd: 3400 }, { md: 6900, tvd: 6600 }, { md: 10600, tvd: TDEPTH }], mdMax: 10600 },
  vlp: { idIn: 2.441, nodeMd: 10600, whp: 190 },
  fluidModel: { api: 24.6, gor: 640, gasSg: 0.68 },
  ipr: { qmax: 2480 },
  ...over,
});
const gasChain = (over = {}) => ({
  liftedTraverse: () => ({ points: [{ md: 0, p: 190 }, { md: 7400, p: 2210 }] }),
  injectionPointFromTraverse: () => ({ depthFt: 4180, limitedBy: 'pressure' }),
  solveLiftedOperatingPoint: () => ({ q: 726, pwf: 1290, status: 'flowing' }),
  ...over,
});

// ============================================================ header
w('PD9 Production Surveillance: TEACHING DIGEST');
w('');
w('THE ONLY NUMBERS A LESSON MAY QUOTE. Every line names its source: a PUBLISHED');
w('value out of one of the four goldens named below, a DERIVED re-run or sweep on');
w('published inputs, or a TEACHING case this wave designed for itself. NOTHING in');
w('this file comes from the graded capstone. The capstone conditions and its');
w('eighteen graded answers live in separate files that the generator of this');
w('digest never opens: it imports the four engines and the four goldens and');
w('nothing else.');
w('');
w('academy_submit_capstone grades every field with abs(got - expected) <= tol, so');
w('tol is an ABSOLUTE tolerance in the field own units and is not a fraction of');
w('anything. digestleak.py reads the graded field list and every number on every');
w('generated line of this file and rejects the digest if any number lands within');
w('TEN TIMES a graded tolerance of a graded value, in three unit shiftings, with');
w('the tolerance scaled by the shifting.');
w('');
w('Generator: /root/pd-wip-surveillance/pd9_dump.mjs');
w('Engines:   packages/engines/engines/production/surveillance.js');
w('           packages/engines/engines/production/allocation.js');
w('           packages/engines/engines/production/liftScreening.js');
w('           packages/engines/engines/production/liftAdvisor.js');
w('Goldens:   packages/engines/test-data/production/goldens/surveillance_cases.json');
w('           packages/engines/test-data/production/goldens/allocation_cases.json');
w('           packages/engines/test-data/production/goldens/lift_screening_cases.json');
w('           packages/engines/test-data/production/goldens/lift_advisor_cases.json');
w('Oracles:   tools/validation/production/oracle_surveillance.py');
w('           tools/validation/production/oracle_allocation.py');
w('           tools/validation/production/oracle_liftscreening.py');
w('           tools/validation/production/oracle_liftadvisor.py');
w('');
w('UNITS, and they are field units throughout and never SI:');
w('  oil and water volume  stb over ONE LEDGER ROW, which the modules read as a');
w('                        calendar day whatever the row actually covers');
w('  gas volume            Mscf over one ledger row');
w('  water injection       stb, gas injection Mscf');
w('  producing-day rate    stb/d and Mscf/d, the volume scaled to 24 hours');
w('  hours on stream       h, nominally 0 to 24');
w('  watercut              a 0 to 1 FRACTION everywhere in surveillance and');
w('                        allocation, and a PER CENT in liftScreening and');
w('                        liftAdvisor. Say which you mean every time.');
w('  gas-oil ratio         scf/stb');
w('  allocation factor     dimensionless, metered total over theoretical total');
w('  nominal decline Di    per DAY, the canonical Arps convention, which is why');
w('                        annualEffectiveDecline evaluates the rate law at 365');
w('  effective decline     PER CENT over the first year');
w('  screening score       0 to 100, a RANKING DEVICE and not a probability');
w('  dates                 ISO yyyy-mm-dd, read as UTC midnight');
w('');
w('WHAT PROVENANCE LABEL MEANS WHAT');
w('  golden ...    a value committed in one of the four goldens by an independent');
w('                stdlib oracle. Genuinely independent routes: the surveillance');
w('                oracle does every date arithmetic on the CALENDAR where the');
w('                module counts epoch-millisecond day numbers, forms each window');
w('                mean by explicit calendar membership from the STATED window');
w('                definition rather than the implemented inequality, and measures');
w('                effective decline as 1 - q(365)/q(0) through the Arps rate law');
w('                where the module evaluates a closed form; the allocation oracle');
w('                splits the metered total as a SHARE where the module multiplies');
w('                by a precomputed factor, and bisects into explicit validity');
w('                intervals where the module scans and breaks; the screening');
w('                oracle re-expresses every rule as a DECLARATIVE PENALTY LEDGER');
w('                walked by one generic scorer with no branch on a method');
w('                anywhere; the advisor oracle takes the reference stage as a');
w('                covering SET plus a separate best-efficiency ranking, the motor');
w('                by MINIMISING over the satisfying set, and the reconciliation as');
w('                a full four-way TRUTH TABLE.');
w('  derived ...   the shipped engine re-run on PUBLISHED inputs, or a sweep this');
w('                generator ran around them. A sweep point is not a published');
w('                case. Say so if you print one.');
w('  teaching ...  the teaching field OGUTA, its eight wells, its well tests, its');
w('                metered totals, and the constructed demonstration rows. Invented');
w('                by this wave to carry the Expert results. Not a published case,');
w('                not a real field, and never to be shown as either.');
w('');
w('THE PUBLISHED CASES AT A GLANCE');
w(`  surveillance     a ${GS.wellSeries.length}-well field, ${GS.ledger.length} ledger rows, ${GFS.length} field days, `
  + `asOf ${GS.exceptions.asOf}`);
w(`  allocation       ${GA.allocation.grand.days} allocated days, ${GA.testInForce.length} test-in-force probes, `
  + `${GA.testQc.tests.length} tests through QC, ${GA.nodalCrossCheck.results.length} nodal cross-checks`);
w(`  lift screening   ${GL.archetypes.length} archetype wells, ${GL.sweep.length} sweep points, ${GL.monotonicity.cases.length} monotonicity cases`);
w(`  lift advisor     ${GD.referenceStage.sweep.length} reference-stage probes, ${GD.motorFrame.sweep.length} motor probes, `
  + `${GD.rodLadder.length} rod-ladder scenarios, ${GD.truthTable.length} truth-table rows`);
w('');
w('THE TEACHING CASES');
w(`  ${TF.field}            a field this wave invented, ${TWELLS.length} wells, ${LEDGER.length} ledger rows, running`);
w(`               ${TF.firstDate} to ${TF.lastDate}. Seven wells on a DAILY ledger and one on a`);
w('               MONTHLY one, so that the cadence rule has something to widen');
w('               against. Every well in it exists to carry one result.');
w('  demonstration rows     four constructed ledger rows and two constructed');
w('               series, each one the smallest case that makes a branch fire.');
w('');
w('# ============================================================================');

// ============================================================ SECTION 0
w('# SECTION 0: THE FOUR MODULES, THEIR THRESHOLDS, AND WHAT EACH ONE REFUSES');
w('# Associate m01. This course is four modules and their exported calculations, and');
w('# every number in this digest belongs to exactly one of them.');
w('# Naming which function owns a number is most of what the Associate tier is for.');
w('#   surveillance.js   READS A LEDGER AND SAYS WHICH WELLS TO GO AND LOOK AT.');
w('#                     derivePoint turns one row into rates and ratios;');
w('#                     buildWellSeries and buildFieldSeries group them;');
w('#                     seriesCadenceDays, movingAverage and decimate shape them;');
w('#                     detectExceptions compares a recent window against a');
w('#                     baseline window on the SAME well; summarizeDeferments');
w('#                     rolls up lost production; computeKpis rolls up the field;');
w('#                     rateSeriesForFit, fitWellDecline and');
w('#                     annualEffectiveDecline are the decline overlay, and the');
w('#                     fit itself is the CANONICAL Arps engine, not a second one.');
w('#   allocation.js     SPLITS ONE METERED STREAM ACROSS THE WELLS. groupTests and');
w('#                     testInForce choose what carries a well; computeAllocation');
w('#                     splits; monthlyFactors and allocatedLedgerRows reshape;');
w('#                     imbalanceSeries measures the meter against the wells own');
w('#                     books; validateWellTests QCs a test against data the');
w('#                     ledger already holds; crossCheckTestsAgainstNodal QCs it');
w('#                     against the well own model.');
w('#   liftScreening.js  A RULES MATRIX. Six methods, each starting at 100 and');
w('#                     deducting with a stated reason. NOTHING HERE IS DERIVED');
w('#                     FROM ANYTHING. A course must teach it as a checklist with');
w('#                     a number attached, never as a calculation.');
w('#   liftAdvisor.js    THE DESIGN PASS. It runs each method real design chain on');
w('#                     ONE shared well record and reconciles the answer against');
w('#                     the matrix. When the two disagree THE DESIGN WINS.');
w('# THE IDEA THE WHOLE COURSE TURNS ON: surveillance is always a COMPARISON OF ONE');
w('# WELL AGAINST ITSELF over two windows, so the output is always "this well');
w('# changed" and never "this well is bad", and every quantity in it is a reading');
w('# of a period rather than a measurement of a thing.');
w('#');
w('# THE THRESHOLDS. All named, all overridable, all round on purpose.');
Object.entries(S.DEFAULT_SURVEILLANCE_SETTINGS).forEach(([k, v]) => {
  w(`derived DEFAULT_SURVEILLANCE_SETTINGS, ${k} = ${v}`);
});
Object.entries(A.DEFAULT_ALLOCATION_SETTINGS).forEach(([k, v]) => {
  w(`derived DEFAULT_ALLOCATION_SETTINGS, ${k} = ${v}`);
});
Object.entries(A.DEFAULT_TEST_QC_SETTINGS).forEach(([k, v]) => {
  w(`derived DEFAULT_TEST_QC_SETTINGS, ${k} = ${v}`);
});
Object.entries(A.DEFAULT_NODAL_CHECK_SETTINGS).forEach(([k, v]) => {
  w(`derived DEFAULT_NODAL_CHECK_SETTINGS, ${k} = ${v}`);
});
w(`derived liftAdvisor, RATE_TOLERANCE = ${LA.RATE_TOLERANCE}, which is the fraction of the target a design must reach to count as ok`);
w(`derived liftAdvisor, ATM_PSIA = ${LA.ATM_PSIA}, the one place gauge meets absolute in the domain`);
w('# THE SEVERITY LADDER. Three ranks, and FIVE of the seven exception types can');
w('# reach the top one: shut_in unconditionally, and rate_drop, injection_drop,');
w('# watercut_rise and gor_rise by doubling their trigger. Only downtime and');
w('# stale_data cannot. Count the TYPES that can, not the high rows a particular');
w('# field happens to show: on the published field that count is four, and those');
w('# are two different numbers.');
Object.entries(S.EXCEPTION_TYPES).forEach(([k, v]) => {
  w(`derived EXCEPTION_TYPES, ${k}: label ${v.label}, description: ${v.description}`);
});
Object.entries(A.TEST_ISSUES).forEach(([k, v]) => {
  w(`derived TEST_ISSUES, ${k}: label ${v.label}, description: ${v.description}`);
});
A.PHASES.forEach((p) => {
  w(`derived PHASES, ${p.key}: label ${p.label}, unit ${p.unit}, test rate key ${p.rateKey}, ledger key ${p.ledgerKey}`);
});
LS.LIFT_METHODS.forEach((m) => {
  w(`derived LIFT_METHODS, ${m.id}: label ${m.label}, hasEngine = ${yn(m.hasEngine)}, studio = ${m.studio || 'none'}`);
});
Object.entries(S.FIT_STREAMS).forEach(([k, v]) => {
  w(`derived FIT_STREAMS, ${k}: producing-day key ${v.key}, calendar key ${v.calendarKey}, unit ${v.unit}`);
});
LA.ROD_TRIALS.forEach((t, i) => {
  const disp = (Math.PI / 4) * t.plungerDIn ** 2 * t.strokeIn * t.spm;
  w(`derived ROD_TRIALS rung ${i + 1}: plunger ${t.plungerDIn} in, stroke ${t.strokeIn} in, ${t.spm} spm, displacement index = ${f(disp, 9)}`);
});
CAT.REFERENCE_STAGES.forEach((s) => {
  w(`derived REFERENCE_STAGES, ${s.id}: qMin = ${s.qMin}, qMax = ${s.qMax}, bepBpd = ${s.bepBpd}, housing = ${s.housingOdIn} in`);
});
CAT.MOTOR_FRAMES.forEach((m) => {
  w(`derived MOTOR_FRAMES, ${m.id}: hp = ${m.hp}, volts = ${m.volts}, amps = ${m.amps}`);
});
w('');

// ============================================================ SECTION 1
w('# SECTION 1: THE ROW. derivePoint ON THE FIVE PUBLISHED ROWS');
w('# Associate m01 and Associate m02. PUBLISHED. The golden commits five ledger');
w('# rows and the five derived points they must produce. Everything downstream in');
w('# this course, every exception, every allocation share, every KPI, is built out');
w('# of this one function, so it is worth reading the return object member by');
w('# member before anything is compared to anything.');
GS.derivePoint.rows.forEach((r, i) => {
  const g = GS.derivePoint.points[i];
  const d = S.derivePoint(r);
  w(`golden derivePoint row ${i + 1}: date ${r.prod_date}, oil_stb = ${f(r.oil_stb, 6)}, water_stb = ${f(r.water_stb, 6)}, `
    + `gas_mscf = ${f(r.gas_mscf, 6)}, winj_stb = ${f(r.winj_stb, 6)}, hours_on = ${r.hours_on === null ? 'null' : f(r.hours_on, 6)}`);
  w(`golden derivePoint point ${i + 1}: liquid = ${g.liquid === null ? 'null' : f(g.liquid, 9)}, `
    + `watercut = ${g.watercut === null ? 'null' : f(g.watercut, 12)}, gor = ${g.gor === null ? 'null' : f(g.gor, 9)}`);
  w(`golden derivePoint point ${i + 1}: oilPd = ${g.oilPd === null ? 'null' : f(g.oilPd, 9)}, `
    + `waterPd = ${g.waterPd === null ? 'null' : f(g.waterPd, 9)}, gasPd = ${g.gasPd === null ? 'null' : f(g.gasPd, 9)}, `
    + `liquidPd = ${g.liquidPd === null ? 'null' : f(g.liquidPd, 9)}`);
  w(`derived derivePoint point ${i + 1}, engine re-run: liquid = ${d.liquid === null ? 'null' : f(d.liquid, 9)}, `
    + `watercut = ${d.watercut === null ? 'null' : f(d.watercut, 12)}, gor = ${d.gor === null ? 'null' : f(d.gor, 9)}, `
    + `oilPd = ${d.oilPd === null ? 'null' : f(d.oilPd, 9)}, liquidPd = ${d.liquidPd === null ? 'null' : f(d.liquidPd, 9)}`);
});
w('# THE MEMBERS AND WHAT EACH ONE IS. Nine of the fourteen keys are copied');
w('# through unchanged; five are computed, and all five can be null.');
w('#   liquid     oil + water, in stb over the row. A VOLUME.');
w('#   watercut   water / liquid, a FRACTION, null when the row made no liquid.');
w('#   gor        gas * 1000 / oil in scf/stb, null when the row made no oil. The');
w('#              1000 is scf per Mscf and is the only unit conversion in the file.');
w('#   oilPd etc  the volume scaled to 24 hours. NULL when hours_on is zero, which');
w('#              is the single most important refusal in the module: an Infinity');
w('#              here would propagate into every mean downstream and turn a');
w('#              shut-in day into a fabricated record rate.');
w('# WHAT IT NEVER DOES: it never says how long the row actually covers. Section 10');
w('# is a month of production read as a daily rate by exactly this function.');
w('');

// ============================================================ SECTION 2
w('# SECTION 2: THE PRODUCING-DAY RATE, AND WHAT AN HOURS COLUMN DOES TO IT');
w('# Associate m02. DERIVED sweep on one constructed row of 600 stb of oil. The');
w('# producing-day rate says how the well PERFORMS; the calendar volume says how');
w('# much it MADE. They are the same number only at a full 24 hours.');
const HR_ROW = { prod_date: '2024-01-01', oil_stb: 600, water_stb: 150, gas_mscf: 300 };
[24, 23.5, 20, 18, 16, 12, 8, 6, 4, 2, 1, 0.5].forEach((h) => {
  const d = S.derivePoint({ ...HR_ROW, hours_on: h });
  w(`derived hours sweep, hours_on = ${f(h, 1)}: oilPd = ${f(d.oilPd, 9)} stb/d, gasPd = ${f(d.gasPd, 9)} Mscf/d, `
    + `uplift over the calendar volume = ${f(d.oilPd / 600, 9)}`);
});
w('# AND THE SPELLINGS THAT ARE NOT A NUMBER OF HOURS. The test is');
w('# Number.isFinite(row.hours_on), so anything that is not a finite number is read');
w('# as UPTIME UNKNOWN and the producing-day rate falls back to the calendar volume.');
[['null', null], ['undefined', undefined], ['NaN', NaN], ['the string "12"', '12'], ['the string ""', '']].forEach(([lab, h]) => {
  const d = S.derivePoint({ ...HR_ROW, hours_on: h });
  w(`derived hours spelling, hours_on = ${lab}: hoursOn = ${d.hoursOn === null ? 'null' : d.hoursOn}, oilPd = ${f(d.oilPd, 9)} stb/d`);
});
w('# AND THE VALUES THAT ARE OUT OF RANGE AND ARE NOT REFUSED. Nothing clamps');
w('# hours_on to 24 in surveillance.js, so a meter that reported cumulative hours');
w('# rather than hours in the day scales the rate DOWNWARDS, below the calendar');
w('# volume, which is a thing a producing-day rate cannot be.');
[26, 30, 36, 48, 168, -3, -24].forEach((h) => {
  const d = S.derivePoint({ ...HR_ROW, hours_on: h });
  w(`derived hours out of range, hours_on = ${f(h, 1)}: hoursOn = ${d.hoursOn}, oilPd = ${d.oilPd === null ? 'null' : f(d.oilPd, 9)} stb/d, `
    + `ratio to the calendar volume = ${d.oilPd === null ? 'n/a' : f(d.oilPd / 600, 9)}`);
});
w('# A NEGATIVE hours_on IS RETURNED AS ITSELF in hoursOn while the rate is nulled,');
w('# so the downtime check in Section 11 can average a negative number of hours.');
w('');

// ============================================================ SECTION 3
w('# SECTION 3: THE RATIOS A ROW CARRIES, AND WHERE THEY REFUSE');
w('# Associate m03. DERIVED sweep on constructed rows. A watercut is a fraction of');
w('# LIQUID and a gas-oil ratio is per barrel of OIL, so the two refuse on');
w('# different conditions: a row with no liquid has no watercut, and a row with no');
w('# OIL has no gas-oil ratio however much gas it made.');
[[900, 100, 450], [500, 500, 250], [100, 900, 300], [0, 400, 200], [400, 0, 200],
  [0, 0, 500], [0, 0, 0], [-500, 200, 400], [800, -900, 400]].forEach(([o, wa, g]) => {
  const d = S.derivePoint({ prod_date: '2024-01-01', oil_stb: o, water_stb: wa, gas_mscf: g, hours_on: 24 });
  w(`derived ratio row, oil ${f(o, 1)} stb, water ${f(wa, 1)} stb, gas ${f(g, 1)} Mscf: liquid = ${f(d.liquid, 6)} stb, `
    + `watercut = ${d.watercut === null ? 'null' : f(d.watercut, 12)}, gor = ${d.gor === null ? 'null' : f(d.gor, 9)} scf/stb`);
});
w('# A CORRECTION ROW IS NOT REFUSED, IT IS ARITHMETIC. A negative oil volume, which');
w('# is how a ledger books a back-out, gives a negative liquid and a null watercut');
w('# because the liquid is not above zero; a negative WATER volume against positive');
w('# oil gives a negative liquid, a null watercut, and a perfectly ordinary');
w('# gas-oil ratio, because the ratio never looks at the water at all.');
w('');

// ============================================================ SECTION 4
w('# SECTION 4: THE FIELD SERIES, AND WHAT COUNTS AS A WELL ON STREAM');
w('# Associate m04. PUBLISHED. buildFieldSeries adds every row on a date together');
w('# and forms the field watercut and gas-oil ratio VOLUMETRICALLY, which is what a');
w('# period ratio means. Section 20 is what happens when a different function forms');
w('# the same two ratios a different way.');
[0, 1, 2, 24, 25, 48, 49, 50].forEach((i) => {
  const d = GS.fieldSeries[i];
  if (!d) return;
  w(`golden fieldSeries day ${i + 1}: date ${d.date}, oil = ${f(d.oil, 6)} stb, water = ${f(d.water, 6)} stb, `
    + `gas = ${f(d.gas, 6)} Mscf, winj = ${f(d.winj, 6)} stb, wellsOn = ${d.wellsOn}, `
    + `liquid = ${f(d.liquid, 6)} stb, watercut = ${d.watercut === null ? 'null' : f(d.watercut, 12)}, `
    + `gor = ${d.gor === null ? 'null' : f(d.gor, 9)}`);
});
const gfsCheck = GFS.every((d, i) => Math.abs(d.oil - GS.fieldSeries[i].oil) < 1e-9);
w(`derived fieldSeries, the engine reproduces all ${GS.fieldSeries.length} published days = ${yn(gfsCheck)}`);
w('# THE ON-COUNT IS A THREE-PHASE SUM AND IT ADDS Mscf TO stb. The test a row has');
w('# to pass to count as producing is (oil_stb + water_stb + gas_mscf) > 0 and');
w('# (hours_on is null or above zero). Two units are added together to make one');
w('# boolean, which is harmless as a boolean and is worth naming because it is the');
w('# only place in the domain where a barrel and a thousand cubic feet are summed.');
const ON_ROWS = [
  ['a well making only gas', { prod_date: '2024-01-01', oil_stb: 0, water_stb: 0, gas_mscf: 500, hours_on: 24 }],
  ['a well making only water', { prod_date: '2024-01-01', oil_stb: 0, water_stb: 400, gas_mscf: 0, hours_on: 24 }],
  ['an injector taking 3000 stb', { prod_date: '2024-01-01', oil_stb: 0, water_stb: 0, gas_mscf: 0, winj_stb: 3000, hours_on: 24 }],
  ['a producer with volumes and zero hours', { prod_date: '2024-01-01', oil_stb: 900, water_stb: 100, gas_mscf: 400, hours_on: 0 }],
  ['a well that filed a row of zeroes', { prod_date: '2024-01-01', oil_stb: 0, water_stb: 0, gas_mscf: 0, hours_on: 24 }],
];
ON_ROWS.forEach(([lab, r]) => {
  const d = S.buildFieldSeries([r])[0];
  w(`derived on-count, ${lab}: wellsOn = ${d.wellsOn}, field oil = ${f(d.oil, 6)} stb, field winj = ${f(d.winj, 6)} stb`);
});
w('# buildFieldSeries FILTERS ON NOTHING. It has no idea what a well type is, so an');
w('# injector row and an observation row both land in the field totals; they');
w('# contribute nothing to oil, water or gas because those columns are zero on');
w('# them, and they DO contribute to winj and to the on-count. buildWellSeries, by');
w('# contrast, keys on r.well.id and silently DROPS every row that carries no well.');
const orphan = S.buildWellSeries([{ prod_date: '2024-01-01', oil_stb: 900 }, { well: WELLS.o2, prod_date: '2024-01-01', oil_stb: 900 }]);
w(`derived buildWellSeries, two rows in of which one carries no well: series returned = ${orphan.length}, points on it = ${orphan[0].points.length}`);
w(`derived buildFieldSeries, the same two rows: field days = ${S.buildFieldSeries([{ prod_date: '2024-01-01', oil_stb: 900 }, { well: WELLS.o2, prod_date: '2024-01-01', oil_stb: 900 }]).length}, `
  + `field oil = ${f(S.buildFieldSeries([{ prod_date: '2024-01-01', oil_stb: 900 }, { well: WELLS.o2, prod_date: '2024-01-01', oil_stb: 900 }])[0].oil, 6)} stb`);
w('# So the field total and the sum of the wells can differ by exactly the rows');
w('# nobody attached a well to, and NOTHING in either return says so.');
w('');

// ============================================================ SECTION 5
w('# SECTION 5: CADENCE, THE MOVING AVERAGE, AND THE DECIMATOR');
w('# Associate m04. PUBLISHED then DERIVED. seriesCadenceDays is the MEDIAN gap');
w('# between consecutive points, and it is the number every widening rule in');
w('# detectExceptions is built on.');
GS.wellSeries.forEach((ws) => {
  w(`golden wellSeries, ${ws.name}: points = ${ws.n}, cadenceDays = ${ws.cadenceDays === null ? 'null' : f(ws.cadenceDays, 6)}`);
});
w('# A MEDIAN OVER AN EVEN COUNT AVERAGES THE TWO MIDDLE GAPS, so a cadence can be');
w('# a half day even though no gap in the series ever was.');
[[[1, 1, 1, 1]], [[1, 1, 30, 30]], [[30, 31, 30, 31, 30]], [[30, 31, 31, 30, 31, 20]], [[7, 7, 7]], [[1]]].forEach(([gaps]) => {
  const pts = [{ date: '2024-01-01' }];
  let d = dayOf('2024-01-01');
  gaps.forEach((g) => { d += g; pts.push({ date: iso(d) }); });
  w(`derived cadence, gaps ${j(gaps)}: seriesCadenceDays = ${f(S.seriesCadenceDays(pts), 6)}`);
});
w(`derived cadence, one point only: seriesCadenceDays = ${S.seriesCadenceDays([{ date: '2024-01-01' }]) === null ? 'null' : 'not null'}`);
w('# THE MOVING AVERAGE IS OVER A DATE WINDOW, NOT A POINT COUNT, which is what');
w('# lets a daily and a monthly ledger both average real time. PUBLISHED values on');
w('# the golden well.');
const gp1 = GWS.find((x) => x.well.id === GS.movingAverage.wellId);
const ma = S.movingAverage(gp1.points, GS.movingAverage.key, GS.movingAverage.windowDays);
[0, 1, 2, 3, 6, 7, 20, 40, 46].forEach((i) => {
  if (GS.movingAverage.values[i] === undefined) return;
  w(`golden movingAverage ${GS.movingAverage.key} over ${GS.movingAverage.windowDays} days, index ${i}: date ${gp1.points[i].date}, `
    + `published = ${GS.movingAverage.values[i] === null ? 'null' : f(GS.movingAverage.values[i], 9)}, `
    + `engine = ${ma[i] === null ? 'null' : f(ma[i], 9)}`);
});
[0, 1, 13, 14, 30, 46].forEach((i) => {
  const v = GS.movingAverageWatercut.values[i];
  if (v === undefined) return;
  w(`golden movingAverage watercut over ${GS.movingAverageWatercut.windowDays} days, index ${i}: `
    + `published = ${v === null ? 'null' : f(v, 12)}`);
});
w('# A WINDOW SHORTER THAN THE CADENCE AVERAGES ONE POINT AND SAYS NOTHING ABOUT IT.');
const monthlyPts = TF.o14Rows.map(([d, oil]) => ({ date: d, oil }));
[7, 30, 45, 90, 200].forEach((wd) => {
  w(`teaching movingAverage on the OGUTA-14 monthly rows, windowDays = ${wd}: ${j(S.movingAverage(monthlyPts, 'oil', wd).map((x) => Number(f(x, 6))))}`);
});
w('# THE DECIMATOR IS NEITHER A CEILING NOR A FLOOR. decimate takes a maxPoints and');
w('# strides by Math.ceil(n / maxPoints), and the stride is an integer, so the');
w('# returned count lands wherever the rounding puts it. PUBLISHED case first.');
w(`golden decimate: n = ${GS.decimate.n}, maxPoints = ${GS.decimate.maxPoints}, stride = ${GS.decimate.stride}, `
  + `outLength = ${GS.decimate.outLength}, lastIndex kept = ${GS.decimate.lastIndex}`);
w(`golden decimate, the first indices kept = ${j(GS.decimate.firstIndices)}`);
[1500, 1501, 1600, 2000, 2999, 3000, 3001, 3200, 4500, 4501, 6000, 10000, 45000].forEach((n) => {
  const pts = Array.from({ length: n }, (_, i) => ({ i }));
  const o = S.decimate(pts, 1500);
  w(`derived decimate sweep, n = ${n} at maxPoints 1500: stride = ${Math.ceil(n / 1500)}, out = ${o.length}, `
    + `out over maxPoints = ${f(o.length / 1500, 9)}`);
});
w('# READ THAT COLUMN BEFORE QUOTING IT. Asking for at most 1500 points off a');
w('# 1501-point series returns 751, half the budget; off a 3000-point series it');
w('# returns 1501, which is ONE MORE than the maximum the argument names. The');
w('# always-keep-the-last rule is what puts it over.');
w('');

// ============================================================ SECTION 6
w('# SECTION 6: THE FIELD KPIs ON THE PUBLISHED FIELD');
w('# Associate m05. PUBLISHED. computeKpis is the field roll-up: mean daily rates');
w('# over a trailing window, the watercut and gas-oil ratio of those means, the');
w('# uptime, and two counts. It is the only surveillance function with no baseline');
w('# and no comparison in it at all, which is why it belongs to the Associate tier.');
[['kpis', GS.kpis], ['kpis30', GS.kpis30]].forEach(([lab, g]) => {
  w(`golden ${lab}: asOf ${g.asOf}, windowDays = ${g.windowDays}, oil = ${f(g.oil, 9)} stb/d, `
    + `water = ${f(g.water, 9)} stb/d, gas = ${f(g.gas, 9)} Mscf/d, winj = ${f(g.winj, 9)} stb/d`);
  w(`golden ${lab}: liquid = ${f(g.liquid, 9)} stb/d, watercut = ${f(g.watercut, 12)}, `
    + `gor = ${f(g.gor, 9)} scf/stb, uptimePct = ${f(g.uptimePct, 9)}, wellCount = ${g.wellCount}, producerCount = ${g.producerCount}`);
  const e = S.computeKpis(GWS, GFS, { windowDays: g.windowDays });
  w(`derived ${lab}, engine re-run: oil = ${f(e.oil, 9)}, watercut = ${f(e.watercut, 12)}, gor = ${f(e.gor, 9)}, uptimePct = ${f(e.uptimePct, 9)}`);
});
w('# THE FOUR THINGS THIS RETURN DOES NOT SAY.');
w('#  1. HOW MANY DAYS IT ACTUALLY AVERAGED. windowDays comes back unchanged, and');
w('#     the window is a DATE window over the field series, so a ledger with holes');
w('#     in it averages fewer days than the number the object reports.');
const gAsOfDay = dayOf(GS.kpis.asOf);
[1, 7, 14, 30, 60, 90, 180, 365].forEach((wd) => {
  const inWin = GFS.filter((d) => dayOf(d.date) >= gAsOfDay - wd + 1).length;
  const k = S.computeKpis(GWS, GFS, { windowDays: wd });
  w(`derived KPI window sweep, windowDays = ${wd}: field days actually in the window = ${inWin}, `
    + `oil = ${f(k.oil, 9)} stb/d, watercut = ${f(k.watercut, 12)}, gor = ${f(k.gor, 9)}, uptimePct = ${f(k.uptimePct, 9)}`);
});
w('#  2. WHICH WELLS THE UPTIME CAME FROM. hoursSlots counts every point on every');
w('#     non-injector well that recorded an hours_on, so a well typed observation');
w('#     is in the uptime and a producer that never records hours is not.');
w('#  3. WHAT wellCount COUNTS. It is (wellSeries || []).length, every series handed');
w('#     in, injectors and observation wells included. producerCount excludes only');
w('#     injectors, so an observation well is counted as a PRODUCER by that name.');
w(`derived KPI counts on the published field: wellCount = ${GS.kpis.wellCount}, producerCount = ${GS.kpis.producerCount}, `
  + `series handed in = ${GWS.length}, of which typed injector = ${GWS.filter((x) => x.well.well_type === 'injector').length}, `
  + `typed observation = ${GWS.filter((x) => x.well.well_type === 'observation').length}, `
  + `typed producer = ${GWS.filter((x) => x.well.well_type === 'producer').length}`);
w('#  4. WHETHER ANY OF ITS NUMBERS IS null. liquid is guarded with an explicit');
w('#     null check on both means; watercut on the very next line is not, and reads');
w('#     the same two means with a bare oil + water > 0. On a field series whose');
w('#     oil mean comes back null and whose water mean does not, the object');
w('#     therefore reports NO liquid and a watercut of exactly one.');
const halfNull = [{ date: '2024-01-01', oil: null, water: 5, gas: 10, winj: 0 }];
const hn = S.computeKpis([], halfNull, { windowDays: 7 });
w(`derived KPI null guard, a field day with a null oil and 5 stb of water: liquid = ${hn.liquid === null ? 'null' : f(hn.liquid, 6)}, `
  + `watercut = ${hn.watercut === null ? 'null' : f(hn.watercut, 12)}, gor = ${hn.gor === null ? 'null' : f(hn.gor, 6)}`);
const zeroDay = S.computeKpis([], [{ date: '2024-01-01', oil: 0, water: 0, gas: 0, winj: 0 }], { windowDays: 7 });
w(`derived KPI null guard, a field day of all zeroes: liquid = ${f(zeroDay.liquid, 6)}, `
  + `watercut = ${zeroDay.watercut === null ? 'null' : f(zeroDay.watercut, 6)}, gor = ${zeroDay.gor === null ? 'null' : f(zeroDay.gor, 6)}, `
  + `uptimePct = ${zeroDay.uptimePct === null ? 'null' : f(zeroDay.uptimePct, 6)}`);
w(`derived KPI refusal, an empty field series: return = ${S.computeKpis([], [], {}) === null ? 'null' : 'an object'}`);
w('');

// ============================================================ SECTION 7
w('# SECTION 7: THE TEACHING FIELD, OGUTA, WELL BY WELL');
w('# Associate m05 and Associate m06. TEACHING. Eight wells, each one built to');
w('# carry exactly one result, on a ledger this wave invented. Nothing here is a');
w('# published case and nothing here is a real well.');
w(`teaching ${TF.field}: ledger rows = ${LEDGER.length}, first date ${TF.firstDate}, last date ${TF.lastDate}, `
  + `calendar days spanned = ${NDAYS}, wells = ${TWELLS.length}`);
w(`teaching ${TF.field}: the metered facility total is built at a bias of ${TF.meterBias} on the wells own true oil, `
  + `water and gas, and the allocated window runs from ${TF.allocFromDate}, which is ${TTOTALS.length} metered days`);
TWS.forEach((ws) => {
  const pts = ws.points;
  const cad = S.seriesCadenceDays(pts);
  const oil = pts.reduce((a, p) => a + p.oil, 0);
  const wat = pts.reduce((a, p) => a + p.water, 0);
  const gas = pts.reduce((a, p) => a + p.gas, 0);
  const inj = pts.reduce((a, p) => a + p.winj, 0);
  w(`teaching ${ws.well.name}: type ${ws.well.well_type}, points = ${pts.length}, `
    + `first ${pts[0].date}, last ${pts[pts.length - 1].date}, cadenceDays = ${cad === null ? 'null' : f(cad, 6)}`);
  w(`teaching ${ws.well.name}: total oil = ${f(oil, 6)} stb, total water = ${f(wat, 6)} stb, total gas = ${f(gas, 6)} Mscf, `
    + `total injection = ${f(inj, 6)} stb, rows carrying an hours_on = ${pts.filter((p) => p.hoursOn !== null).length}`);
});
w('# THE CONSTANTS THE TEACHING LEDGER WAS BUILT FROM, so that every teaching number');
w('# can be checked back to its construction. These are DESIGN CONDITIONS of an');
w('# invented field, not results, and a lesson that quotes one must say so.');
w(`teaching OGUTA-2 construction: baseline oil cycle ${j(TF.o2BaselineOilCycle)} stb, water = ${TF.o2WaterPerOil} of the oil, `
  + `gas = ${TF.o2GasPerOil} Mscf per stb, so the baseline watercut is ${f(TF.o2WaterPerOil / (1 + TF.o2WaterPerOil), 12)} `
  + `and the baseline gas-oil ratio is ${f(TF.o2GasPerOil * 1000, 6)} scf/stb, both exactly constant`);
w(`teaching OGUTA-2 construction: the seven recent rows, oil stb, water stb, gas Mscf = ${j(TF.o2Recent)}`);
w(`teaching OGUTA-5 construction: baseline oil ${TF.o5BaselineOil} stb and water ${TF.o5BaselineWater} stb, `
  + `recent oil ${TF.o5RecentOil} stb and water ${TF.o5RecentWater} stb, gas = ${TF.o5GasPerOil} Mscf per stb`);
w(`teaching OGUTA-6 construction: baseline oil cycle ${j(TF.o6BaselineOilCycle)} stb, water = ${TF.o6WaterPerOil} of the oil, `
  + `gas = ${TF.o6GasPerOil} Mscf per stb; the recent window holds the producing-day oil rate at ${TF.o6PdRate} stb/d `
  + `and varies only the hours, ${j(TF.o6RecentHours)}`);
w(`teaching OGUTA-9 construction: first-day oil ${TF.o9Qi} stb/d declining exponentially at a nominal ${TF.o9Di} per day, `
  + `water = ${TF.o9WaterPerOil} of the oil, gas = ${TF.o9GasPerOil} Mscf per stb`);
w(`teaching OGUTA-14 construction: period rows ${j(TF.o14Rows)} as date and oil stb, water = ${TF.o14WaterPerOil} of the oil, `
  + `gas = ${TF.o14GasPerOil} Mscf per stb, hours_on never recorded`);
w(`teaching OGUTA-17 construction: first-day oil ${TF.o17Qi} stb/d declining exponentially at a nominal ${TF.o17Di} per day, `
  + `water = ${TF.o17WaterPerOil} of the oil, gas = ${TF.o17GasPerOil} Mscf per stb, last row filed ${TF.o17LastReportDate}, `
  + `and it keeps producing after that date where only the meter sees it`);
w(`teaching OGUTA-3W construction: baseline injection cycle ${j(TF.o3wBaselineCycle)} stb, recent series ${j(TF.o3wRecent)} stb`);
w(`teaching OGUTA-21 construction: every volume zero and hours_on ${TF.o21HoursOn} on every one of the ${NDAYS} days`);
w('# WHAT EACH WELL IS FOR, in one line each. The lesson writer needs this to say');
w('# which case a number came off.');
w('#   OGUTA-2   THE SEAM WELL. Its baseline watercut and gas-oil ratio are');
w('#             EXACTLY CONSTANT day by day, so over the baseline a mean of daily');
w('#             ratios and a ratio of the sums are the same number and there is no');
w('#             disagreement to see. Three days inside the recent window then drop');
w('#             the oil by more than a factor of TWELVE while the gas falls by only');
w('#             a factor of about FOUR, and the whole disagreement of Sections 20');
w('#             and 21 is created there and nowhere else.');
w('#   OGUTA-5   THE SMALL WELL, whose oil baseline sits UNDER minOilRate.');
w('#   OGUTA-6   THE UPTIME WELL. Its producing-day oil rate is held EXACTLY');
w('#             constant across the recent window while the calendar volume swings');
w('#             by a factor of nearly three, because only the hours move.');
w('#   OGUTA-9   THE CLEAN DECLINER, and the only well on the field that raises no');
w('#             exception at any default setting.');
w('#   OGUTA-14  THE MONTHLY WELL, whose last row covers fourteen days rather');
w('#             than a month, so its period volume halves while its daily rate rises.');
w('#   OGUTA-17  THE WELL THAT STOPS SENDING ROWS. It does not stop producing: the');
w('#             facility meter keeps seeing it, and Sections 17 and 23 are what');
w('#             that does to an allocation.');
w('#   OGUTA-3W  THE INJECTOR, whose injection falls in the recent window.');
w('#   OGUTA-21  THE OBSERVATION WELL. Zero volumes and a full 24 hours recorded');
w('#             every single day.');
w('# THE PRODUCING-DAY RATE ON OGUTA-6, RECENT WINDOW, WHICH IS THE POINT OF THAT');
w('# WELL: seven different calendar volumes, seven different hours, ONE rate.');
const o6pts = TWS.find((x) => x.well.id === WELLS.o6.id).points.slice(-7);
o6pts.forEach((p) => {
  w(`teaching OGUTA-6 recent day ${p.date}: hours_on = ${f(p.hoursOn, 1)}, oil = ${f(p.oil, 9)} stb, `
    + `oilPd = ${f(p.oilPd, 9)} stb/d, watercut = ${f(p.watercut, 12)}, gor = ${f(p.gor, 9)} scf/stb`);
});
w('# THE OGUTA-2 RECENT WINDOW, WHICH IS THE OTHER HALF OF THE COURSE.');
const o2pts = TWS.find((x) => x.well.id === WELLS.o2.id).points;
o2pts.slice(-7).forEach((p) => {
  w(`teaching OGUTA-2 recent day ${p.date}: oil = ${f(p.oil, 6)} stb, water = ${f(p.water, 6)} stb, gas = ${f(p.gas, 6)} Mscf, `
    + `watercut = ${f(p.watercut, 12)}, gor = ${f(p.gor, 9)} scf/stb`);
});
w('# AND THE BASELINE, WHERE THE TWO READINGS CANNOT DISAGREE. Four rows are enough');
w('# to show why: the oil moves, the ratios do not.');
o2pts.slice(0, 4).forEach((p) => {
  w(`teaching OGUTA-2 baseline day ${p.date}: oil = ${f(p.oil, 6)} stb, watercut = ${f(p.watercut, 12)}, gor = ${f(p.gor, 9)} scf/stb`);
});
w('');

// ============================================================ SECTION 8
w('# SECTION 8: THE FIELD KPIs ON THE TEACHING FIELD');
w('# Associate m05. TEACHING. The same function as Section 6, on a field whose');
w('# composition is known well by well, so that every KPI can be taken apart.');
[7, 14, 30, 70].forEach((wd) => {
  const k = S.computeKpis(TWS, TFS, { windowDays: wd });
  w(`teaching OGUTA KPIs, windowDays = ${wd}: asOf ${k.asOf}, oil = ${f(k.oil, 9)} stb/d, water = ${f(k.water, 9)} stb/d, `
    + `gas = ${f(k.gas, 9)} Mscf/d, winj = ${f(k.winj, 9)} stb/d`);
  w(`teaching OGUTA KPIs, windowDays = ${wd}: liquid = ${f(k.liquid, 9)} stb/d, watercut = ${f(k.watercut, 12)}, `
    + `gor = ${f(k.gor, 9)} scf/stb, uptimePct = ${k.uptimePct === null ? 'null' : f(k.uptimePct, 9)}, `
    + `wellCount = ${k.wellCount}, producerCount = ${k.producerCount}`);
});
w('# THE OBSERVATION WELL IS IN THE UPTIME. OGUTA-21 produces nothing and records a');
w('# full 24 hours every day; computeKpis skips INJECTORS from the uptime and reads');
w('# every other series, so its perfect hours are averaged in with the real ones.');
const noObs = TWS.filter((x) => x.well.well_type !== 'observation');
[7, 30].forEach((wd) => {
  const a = S.computeKpis(TWS, TFS, { windowDays: wd });
  const b = S.computeKpis(noObs, TFS, { windowDays: wd });
  w(`teaching OGUTA uptime, windowDays = ${wd}: with the observation well = ${f(a.uptimePct, 9)} per cent, `
    + `with it dropped = ${f(b.uptimePct, 9)} per cent, difference = ${f(a.uptimePct - b.uptimePct, 9)} points, `
    + `wellCount ${a.wellCount} against ${b.wellCount}`);
});
w('# AND THE WELL THAT RECORDS NO HOURS AT ALL IS NOT IN IT EITHER WAY. OGUTA-17');
w('# and OGUTA-14 carry a null hours_on on every row, so they contribute no slots,');
w('# and the uptime is the mean of the wells that happened to fill the column in.');
w(`teaching OGUTA uptime membership: series read for uptime = ${TWS.filter((x) => x.well.well_type !== 'injector').length}, `
  + `of which at least one row carries an hours_on = ${TWS.filter((x) => x.well.well_type !== 'injector' && x.points.some((p) => p.hoursOn !== null)).length}`);
w('');

// ============================================================ SECTION 9
w('# SECTION 9: THE TWO WINDOWS, AND WHERE THEY START');
w('# Professional m01. DERIVED. Every window in detectExceptions is measured back');
w('# from the FIELD latest ledger date, never from the wall clock, so a three-year-');
w('# old dataset surveils honestly instead of declaring every well stale. asOf is');
w('# returned so the reader knows what "recent" meant.');
w(`golden exceptions, asOf = ${GS.exceptions.asOf}, exceptions raised = ${GS.exceptions.exceptions.length}`);
w(`derived exceptions, the engine re-run raises = ${S.detectExceptions(GWS).exceptions.length} on the same field`);
w('# THE TWO WINDOWS ARE HALF-OPEN AND THEY DO NOT OVERLAP. The recent window is');
w('# (asOf - recentDays, asOf] and the baseline is');
w('# (asOf - recentDays - baselineDays, asOf - recentDays], both by day number, so');
w('# the boundary day belongs to the EARLIER window and to exactly one of them.');
const gAsOf = dayOf(GS.exceptions.asOf);
w(`derived window arithmetic at the defaults, asOf ${GS.exceptions.asOf} (day number ${gAsOf}): `
  + `recent window runs ${iso(gAsOf - 7 + 1)} to ${iso(gAsOf)} inclusive, which is 7 days`);
w(`derived window arithmetic at the defaults: baseline window runs ${iso(gAsOf - 7 - 30 + 1)} to ${iso(gAsOf - 7)} inclusive, which is 30 days`);
w(`golden ratioSeam window, published for the same well: recent ${GS.ratioSeam.window.recentFrom} to ${GS.ratioSeam.window.recentTo}, `
  + `baseline ${GS.ratioSeam.window.baselineFrom} to ${GS.ratioSeam.window.baselineTo}`);
w('# AND THE SAME ARITHMETIC ON THE TEACHING FIELD.');
const tAsOf = dayOf(TEX.asOf);
w(`teaching OGUTA windows, asOf = ${TEX.asOf}: recent window ${iso(tAsOf - 7 + 1)} to ${iso(tAsOf)}, `
  + `baseline window ${iso(tAsOf - 37 + 1)} to ${iso(tAsOf - 7)}, exceptions raised = ${TEX.exceptions.length}`);
w('# WHAT MOVES THE WINDOWS. The two lengths are settings, and each well widens');
w('# them on its OWN cadence, so two wells on one field can be compared over');
w('# different windows and nothing in the return says which window a row used.');
w('');

// ============================================================ SECTION 10
w('# SECTION 10: THE WINDOWS WIDEN FOR A COARSE LEDGER, AND THE UNITS DO NOT');
w('# Professional m01, and Expert m02 prices it. PUBLISHED then TEACHING. A monthly');
w('# ledger compared over a');
w('# seven-day window is one point against nothing, so the cadence is measured and');
w('# the windows are stretched: recentDays becomes max(recentDays, ceil(cadence x');
w('# 1.5)), baselineDays becomes max(baselineDays, ceil(cadence x 4)), staleDays');
w('# becomes max(staleDays, ceil(cadence x 1.5)).');
// 15.5 is here because it is what a MIXED cadence produces, and a mixed ledger
// is the common real case: the gap set [1, 1, 30, 30] measures at 15.5 days, so
// a well whose windows are derived from that cadence has windows no gap in it
// ever had. Without this row the sweep cannot price the commonest well there is.
[1, 2, 7, 14, 15.5, 28, 30, 30.5, 31, 60, 90].forEach((c) => {
  w(`derived widening, cadence = ${f(c, 1)} days: recentDays = ${Math.max(7, Math.ceil(c * 1.5))}, `
    + `baselineDays = ${Math.max(30, Math.ceil(c * 4))}, staleDays = ${Math.max(7, Math.ceil(c * 1.5))}`);
});
w('# THE PUBLISHED MONTHLY WELL. Its rows are MONTHS of production and derivePoint');
w('# has no idea, so each row is read as a calendar day and the exception message');
w('# prints a month of oil with stb/d after it.');
const gP3 = GWS.find((x) => x.well.name === 'P-3');
gP3.points.forEach((p) => {
  w(`golden P-3 monthly row: date ${p.date}, oil = ${f(p.oil, 6)} stb over the PERIOD, oilPd = ${f(p.oilPd, 6)}, `
    + `hoursOn = ${p.hoursOn === null ? 'null' : f(p.hoursOn, 1)}`);
});
const gP3ex = S.detectExceptions(GWS).exceptions.find((e) => e.wellName === 'P-3');
w(`derived P-3 exception: type ${gP3ex.type}, severity ${gP3ex.severity}, value = ${f(gP3ex.value, 9)}, `
  + `baseline = ${f(gP3ex.baseline, 9)}, message: ${gP3ex.message}`);
w('# THE TEACHING MONTHLY WELL, AND THE SHORT LAST PERIOD. OGUTA-14 files six');
w('# period rows and the last of them covers FOURTEEN days rather than a month, so');
w('# the period volume falls by more than half while the oil per elapsed day goes');
w('# UP. Nothing in the module can tell a short period from a fallen rate, because');
w('# nothing in the ledger says how long a row covers.');
const o14 = TWS.find((x) => x.well.id === WELLS.o14.id);
o14.points.forEach((p, i) => {
  const prev = i > 0 ? o14.points[i - 1] : null;
  const gap = prev ? dayOf(p.date) - dayOf(prev.date) : null;
  w(`teaching OGUTA-14 period row: date ${p.date}, oil = ${f(p.oil, 6)} stb over the period, `
    + `days since the previous row = ${gap === null ? 'n/a' : gap}, `
    + `oil per elapsed day = ${gap === null ? 'n/a' : f(p.oil / gap, 9)} stb/d`);
});
w(`teaching OGUTA-14: seriesCadenceDays = ${f(S.seriesCadenceDays(o14.points), 6)}, `
  + `so recentDays = ${Math.max(7, Math.ceil(S.seriesCadenceDays(o14.points) * 1.5))}, `
  + `baselineDays = ${Math.max(30, Math.ceil(S.seriesCadenceDays(o14.points) * 4))}, `
  + `staleDays = ${Math.max(7, Math.ceil(S.seriesCadenceDays(o14.points) * 1.5))}`);
const o14ex = TEX.exceptions.filter((e) => e.wellName === 'OGUTA-14');
o14ex.forEach((e) => {
  w(`teaching OGUTA-14 exception: type ${e.type}, severity ${e.severity}, value = ${f(e.value, 9)}, `
    + `baseline = ${f(e.baseline, 9)}, message: ${e.message}`);
});
if (!o14ex.length) w('teaching OGUTA-14 exceptions raised = 0');
w('# READ THE PER-ELAPSED-DAY COLUMN AGAINST THE PERIOD COLUMN. They tell opposite');
w('# stories, the module only ever reads the second, and the well is reported at');
w('# HIGH severity, the top of the ladder, for producing MORE oil per day than it');
w('# did in the period before.');
w('');

// ============================================================ SECTION 11
w('# SECTION 11: THE SEVEN EXCEPTION TYPES ON THE PUBLISHED FIELD');
w('# Professional m02. PUBLISHED. Nine exceptions on seven wells, and the golden');
w('# commits every one of them: the type, the severity, the value and the baseline.');
w('# Read the severity column first: every severity in this module is a THRESHOLD');
w('# CROSSED TWICE, high when the trigger is exceeded by a factor of two and medium');
w('# otherwise. Three types do not work that way at all: shut_in is ALWAYS high,');
w('# downtime is ALWAYS medium whatever the hours, and stale_data doubling takes it');
w('# only from info to medium, so a well silent for a year cannot outrank a');
w('# forty per cent rate drop.');
GS.exceptions.exceptions.forEach((e, i) => {
  w(`golden exception ${i + 1}: ${e.wellName}, type ${e.type}, severity ${e.severity}, `
    + `value = ${e.value === null ? 'null' : f(e.value, 12)}, baseline = ${e.baseline === null ? 'null' : f(e.baseline, 12)}`);
});
const gEx = S.detectExceptions(GWS).exceptions;
gEx.forEach((e, i) => {
  w(`derived exception ${i + 1}, engine re-run: ${e.wellName}, ${e.type}, ${e.severity}, message: ${e.message}`);
});
w('# THE STRICTER SETTING, PUBLISHED. The same field with rateDropPct raised.');
w(`golden exceptionsStrictDrop: exceptions = ${GS.exceptionsStrictDrop.exceptions.length} against ${GS.exceptions.exceptions.length} at the defaults`);
GS.exceptionsStrictDrop.exceptions.forEach((e, i) => {
  w(`golden strictDrop exception ${i + 1}: ${e.wellName}, type ${e.type}, severity ${e.severity}, `
    + `value = ${e.value === null ? 'null' : f(e.value, 12)}, baseline = ${e.baseline === null ? 'null' : f(e.baseline, 12)}`);
});
w('# THE SORT IS SEVERITY THEN WELL NAME, and nothing else. Two exceptions of the');
w('# same severity are ordered alphabetically, so the reading order of a');
w('# surveillance list carries no information about size at all.');
w(`derived sort key: severity ranks are high 0, medium 1, info 2; ties break on String(wellName).localeCompare`);
w('');

// ============================================================ SECTION 12
w('# SECTION 12: THE EXCEPTIONS ON THE TEACHING FIELD');
w('# Professional m02. TEACHING. Eight wells, of which one is dropped before any');
w('# comparison runs and one raises nothing at all.');
w(`teaching OGUTA exceptions, asOf = ${TEX.asOf}, raised = ${TEX.exceptions.length}, `
  + `wells surveilled = ${TWS.filter((x) => x.well.well_type !== 'observation' && x.points.length).length} of ${TWS.length}`);
TEX.exceptions.forEach((e, i) => {
  w(`teaching OGUTA exception ${i + 1}: ${e.wellName}, type ${e.type}, severity ${e.severity}, `
    + `value = ${e.value === null ? 'null' : f(e.value, 12)}, baseline = ${e.baseline === null ? 'null' : f(e.baseline, 12)}`);
  w(`teaching OGUTA exception ${i + 1}: message: ${e.message}`);
});
const raised = new Set(TEX.exceptions.map((e) => e.wellName));
TWS.forEach((ws) => {
  if (!raised.has(ws.well.name)) {
    const surveilled = ws.well.well_type !== 'observation';
    w(`teaching OGUTA, ${ws.well.name} appears in no exception: type ${ws.well.well_type}, points = ${ws.points.length}, `
      + `and it was SURVEILLED AND SILENT = ${yn(surveilled)}, so where that is no it was never compared at all rather than compared and found quiet`);
  }
});
w('# THE EXCEPTION ENGINE NEVER READS THE PRODUCING-DAY RATE. Expert m02 is built on');
w('# this block. It is the largest finding on the surveillance side and it is one');
w('# identifier. detectExceptions');
w('# sets `const rateKey = isInjector ? "winj" : "oil"`, and "oil" is the CALENDAR');
w('# VOLUME off the row. The producing-day rate the module header calls "the number');
w('# that says how the well is performing as opposed to how much it made" is');
w('# computed on every point as oilPd, waterPd, gasPd and liquidPd, and is read by');
w('# exactly one function in the file, the decline overlay in Section 27. The');
w('# function whose whole job is to say which wells have CHANGED reads the one of');
w('# the two that says how much they MADE.');
w('# OGUTA-6 IS THAT WELL. Its producing-day oil rate is identical on all seven');
w('# recent days and identical to nothing else on the field, and it is reported as a');
w('# rate drop of nearly forty per cent.');
(() => {
  const ws6 = TWS.find((x) => x.well.id === WELLS.o6.id);
  const rec = ws6.points.filter((p) => dayOf(p.date) > tAsOf - 7);
  const bas = ws6.points.filter((p) => dayOf(p.date) > tAsOf - 37 && dayOf(p.date) <= tAsOf - 7);
  const mn = (a, k) => a.reduce((x, p) => x + p[k], 0) / a.length;
  w(`teaching OGUTA-6 read two ways, recent window: mean CALENDAR oil = ${f(mn(rec, 'oil'), 12)} stb, `
    + `mean PRODUCING-DAY oil = ${f(mn(rec, 'oilPd'), 12)} stb/d, mean hours_on = ${f(mn(rec, 'hoursOn'), 12)} h`);
  w(`teaching OGUTA-6 read two ways, baseline window: mean CALENDAR oil = ${f(mn(bas, 'oil'), 12)} stb, `
    + `mean PRODUCING-DAY oil = ${f(mn(bas, 'oilPd'), 12)} stb/d, mean hours_on = ${f(mn(bas, 'hoursOn'), 12)} h`);
  const dropCal = ((mn(bas, 'oil') - mn(rec, 'oil')) / mn(bas, 'oil')) * 100;
  const dropPd = ((mn(bas, 'oilPd') - mn(rec, 'oilPd')) / mn(bas, 'oilPd')) * 100;
  w(`teaching OGUTA-6 read two ways: CHANGE on the CALENDAR volume = ${f(dropCal, 12)} per cent as a DROP, which is what the engine reports; `
    + `CHANGE on the PRODUCING-DAY rate = ${f(dropPd, 12)} per cent as a drop, which is NEGATIVE and therefore a RISE of ${f(-dropPd, 12)} per cent, which is what the well actually did`);
  w(`teaching OGUTA-6 read two ways: the rateDropPct trigger is ${S.DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct} per cent and the doubling to high is at `
    + `${S.DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct * 2} per cent, so the calendar reading raises a flag and the producing-day reading raises none`);
  const hrsRec = mn(rec, 'hoursOn');
  w(`teaching OGUTA-6 read two ways: mean recent hours = ${f(hrsRec, 12)} h against a downtimeHours threshold of `
    + `${S.DEFAULT_SURVEILLANCE_SETTINGS.downtimeHours} h, so the ONE exception that would have named the real cause does not fire either`);
})();
w('# SO THE WELL IS REPORTED AS A RATE PROBLEM, THE UPTIME EXCEPTION THAT WOULD');
w('# HAVE EXPLAINED IT IS BELOW ITS THRESHOLD, AND THE COLUMN THAT SETTLES IT IS ON');
w('# EVERY POINT AND IS NEVER READ.');
w('# THE WINDOW MEANS BEHIND THOSE ROWS, so a lesson can show the comparison rather');
w('# than only the verdict. Each figure is the mean of the finite values in the');
w('# window, and the count beside it is how many rows that was.');
const winMean = (pts, key, fromDay, toDay) => {
  const vals = [];
  pts.forEach((p) => { const d = dayOf(p.date); if (d > fromDay && d <= toDay) vals.push(p[key]); });
  const fin = vals.filter((v) => Number.isFinite(v));
  return { mean: fin.length ? fin.reduce((a, b) => a + b, 0) / fin.length : null, count: fin.length, rows: vals.length };
};
[['OGUTA-2', 'oil'], ['OGUTA-2', 'watercut'], ['OGUTA-2', 'gor'], ['OGUTA-5', 'oil'], ['OGUTA-5', 'watercut'],
  ['OGUTA-6', 'oil'], ['OGUTA-6', 'hoursOn'], ['OGUTA-9', 'oil'], ['OGUTA-3W', 'winj']].forEach(([name, key]) => {
  const ws = TWS.find((x) => x.well.name === name);
  const cad = S.seriesCadenceDays(ws.points) || 1;
  const rd = Math.max(7, Math.ceil(cad * 1.5));
  const bd = Math.max(30, Math.ceil(cad * 4));
  const rec = winMean(ws.points, key, tAsOf - rd, tAsOf);
  const bas = winMean(ws.points, key, tAsOf - rd - bd, tAsOf - rd);
  const change = key === 'watercut' ? (rec.mean - bas.mean) * 100 : ((rec.mean - bas.mean) / bas.mean) * 100;
  w(`teaching OGUTA window means, ${name} ${key}: recent = ${f(rec.mean, 12)} over ${rec.count} rows, `
    + `baseline = ${f(bas.mean, 12)} over ${bas.count} rows, `
    + `${key === 'watercut' ? 'rise in points' : 'change per cent'} = ${f(change, 9)}`);
});
w('');

// ============================================================ SECTION 13
w('# SECTION 13: THE SETTINGS SWEEP. WHICH DIAL RAISES WHICH FLAG');
w('# Professional m02. DERIVED sweeps on the PUBLISHED field, one setting at a time,');
w('# everything else left at the default. A surveillance list is a function of the');
w('# settings as much as of the data, and no row in the return names the setting');
w('# that put it there.');
const sweepSetting = (key, values, label) => {
  values.forEach((v) => {
    const ex = S.detectExceptions(GWS, { [key]: v }).exceptions;
    const byType = {};
    ex.forEach((e) => { byType[e.type] = (byType[e.type] || 0) + 1; });
    const bySev = {};
    ex.forEach((e) => { bySev[e.severity] = (bySev[e.severity] || 0) + 1; });
    w(`derived settings sweep, ${key} = ${v}${label ? ' ' + label : ''}: exceptions = ${ex.length}, by severity ${j(bySev)}, by type ${j(byType)}`);
  });
};
sweepSetting('rateDropPct', [5, 10, 15, 20, 25, 30, 40, 50, 70, 90]);
sweepSetting('watercutRisePts', [2, 5, 10, 15, 20, 25, 40]);
sweepSetting('gorRisePct', [10, 20, 30, 50, 70, 100, 200]);
sweepSetting('downtimeHours', [0, 1, 4, 8, 12, 16, 20, 24]);
sweepSetting('staleDays', [1, 3, 7, 10, 20, 21, 40, 60]);
sweepSetting('minOilRate', [0, 1, 5, 50, 200, 400, 1000, 20000]);
sweepSetting('recentDays', [1, 3, 7, 14, 21, 30]);
sweepSetting('baselineDays', [7, 14, 30, 60, 90, 180]);
w('# READ THE minOilRate ROW AGAINST THE OTHERS. Raising it does NOT monotonically');
w('# reduce the list, because it gates the rate and gas-oil ratio checks and does');
w('# not gate the watercut check at all. Section 24 is that asymmetry on its own.');
w('# AND THE SAME SWEEP ON THE TEACHING FIELD, where the well composition is known.');
[['rateDropPct', [10, 20, 40, 60]], ['watercutRisePts', [5, 10, 20]], ['gorRisePct', [15, 30, 60]],
  ['minOilRate', [0, 5, 100, 600]], ['staleDays', [7, 21, 30, 60]]].forEach(([key, vals]) => {
  vals.forEach((v) => {
    const ex = S.detectExceptions(TWS, { [key]: v }).exceptions;
    w(`teaching OGUTA settings sweep, ${key} = ${v}: exceptions = ${ex.length}, `
      + `${ex.map((e) => `${e.wellName}/${e.type}/${e.severity}`).join(' ') || '(none)'}`);
  });
});
w('');

// ============================================================ SECTION 14
w('# SECTION 14: THE TEST IN FORCE');
w('# Professional m03. PUBLISHED. A well is carried on an allocated day by the most');
w('# recent test on or before that day, within maxTestAgeDays. A well with no test');
w('# in force takes NO share rather than a guessed rate, and says so as a');
w('# diagnostic. This one function decides which wells are in the split at all.');
GA.testInForce.forEach((c, i) => {
  w(`golden testInForce probe ${i + 1}: well ${c.wellId}, date ${c.date}, maxTestAgeDays = ${c.maxTestAgeDays}, `
    + `test in force = ${c.testId === null ? 'null' : c.testId}`);
});
w('# THE AGE CHECK IS GUARDED, AND THE GUARD DECIDES MORE THAN THE LIMIT DOES.');
w('# The clause is Number.isFinite(maxTestAgeDays) && maxTestAgeDays > 0, so any');
w('# setting that is not a finite positive number turns the age check OFF');
w('# ENTIRELY and the oldest test on file carries the well for ever.');
const oldTests = [{ id: 'demo-old', well_id: 'w-demo', test_date: '2019-03-04', oil_rate_stbd: 500 }];
const probeDate = '2024-11-20';
const ageDays = dayOf(probeDate) - dayOf('2019-03-04');
[[180, '180'], [365, '365'], [ageDays, 'exactly the age of the test'], [ageDays - 1, 'one day short of the age'],
  [1, '1'], [0, '0'], [-1, '-1'], [NaN, 'NaN'], [null, 'null'], [Infinity, 'Infinity']].forEach(([v, lab]) => {
  const t = A.testInForce(oldTests, probeDate, v);
  w(`derived testInForce guard, maxTestAgeDays = ${lab}: test in force = ${t ? t.id : 'null'}, `
    + `the test is ${ageDays} days old on ${probeDate}`);
});
w(`derived testInForce guard, maxTestAgeDays omitted entirely: test in force = ${A.testInForce(oldTests, probeDate) ? 'demo-old' : 'null'}, `
  + `because the default parameter substitutes ${A.DEFAULT_ALLOCATION_SETTINGS.maxTestAgeDays}`);
w('# SO undefined AND null MEAN OPPOSITE THINGS. undefined takes the default and');
w('# refuses the old test; null skips the guard and accepts it. Both are how a form');
w('# field spells "the user did not fill this in".');
w('# WHICH TESTS ARE EVEN CANDIDATES. groupTests drops a test only when its is_valid');
w('# is STRICTLY false, so a test that was never QCd, a null, a zero and the STRING');
w('# "false" are all kept.');
const mixTests = [
  { id: 'v-true', well_id: 'w-demo', test_date: '2024-01-01', is_valid: true },
  { id: 'v-false', well_id: 'w-demo', test_date: '2024-01-02', is_valid: false },
  { id: 'v-absent', well_id: 'w-demo', test_date: '2024-01-03' },
  { id: 'v-null', well_id: 'w-demo', test_date: '2024-01-04', is_valid: null },
  { id: 'v-string-false', well_id: 'w-demo', test_date: '2024-01-05', is_valid: 'false' },
  { id: 'v-zero', well_id: 'w-demo', test_date: '2024-01-06', is_valid: 0 },
];
w(`derived groupTests, ${mixTests.length} tests in, default settings: kept = ${A.groupTests(mixTests).get('w-demo').map((t) => t.id).join(' ')}`);
w(`derived groupTests, the same with includeInvalid: kept = ${A.groupTests(mixTests, { includeInvalid: true }).get('w-demo').map((t) => t.id).join(' ')}`);
w(`derived groupTests, tests dropped by default = ${mixTests.length - A.groupTests(mixTests).get('w-demo').length} of ${mixTests.length}`);
w('# AND THE TEACHING FIELD TESTS, which Section 17 allocates on.');
TTESTS.forEach((t) => {
  w(`teaching test ${t.id}: well ${t.well.name}, date ${t.test_date}, oil = ${f(t.oil_rate_stbd, 6)} stb/d, `
    + `water = ${f(t.water_rate_stbd, 6)} stb/d, gas = ${f(t.gas_rate_mscfd, 6)} Mscf/d, `
    + `duration = ${f(t.duration_hours, 1)} h, thp = ${f(t.thp_psia, 1)} psia, is_valid = ${yn(t.is_valid)}`);
});
[TF.allocFromDate, '2024-11-05', '2024-11-06', '2024-11-20'].forEach((d) => {
  TWELLS.filter((x) => x.well_type === 'producer').forEach((wl) => {
    const t = A.testInForce(A.groupTests(TTESTS).get(wl.id), d, 180);
    w(`teaching testInForce on ${d}, ${wl.name}: ${t ? `${t.id} dated ${t.test_date}, ${f(t.oil_rate_stbd, 6)} stb/d oil, ${dayOf(d) - dayOf(t.test_date)} days old` : 'no test in force'}`);
  });
});
w('');

// ============================================================ SECTION 15
w('# SECTION 15: WELL TEST QC, AND WHAT IT IS NEVER ASKED');
w('# Professional m03. PUBLISHED. Every check in validateWellTests is against data');
w('# the ledger already holds, the well own test history and the daily ledger on the');
w('# test date, so the verdict never depends on a well model that may not exist.');
GA.testQc.tests.forEach((t) => {
  w(`golden QC test ${t.id}: date ${t.test_date}, oil = ${f(t.oil_rate_stbd, 6)} stb/d, water = ${f(t.water_rate_stbd, 6)} stb/d, `
    + `gas = ${f(t.gas_rate_mscfd, 6)} Mscf/d, duration = ${f(t.duration_hours, 1)} h, is_valid = ${yn(t.is_valid)}`);
});
GA.testQc.results.forEach((r, i) => {
  w(`golden QC result ${i + 1}: test ${r.testId}, date ${r.testDate}, severity ${r.severity}, codes ${r.codes.join(' ')}`);
});
const qcWs = S.buildWellSeries(GA.testQc.ledger.map((r) => ({ ...r, well: GA.testQc.well })));
const qcRes = A.validateWellTests(GA.testQc.tests, qcWs);
qcRes.forEach((r, i) => {
  r.issues.forEach((is) => {
    w(`derived QC result ${i + 1}, engine re-run: test ${r.testId}, ${is.code}, ${is.severity}, message: ${is.message}`);
  });
});
w(`derived QC coverage: tests handed in = ${GA.testQc.tests.length}, rows returned = ${qcRes.length}, `
  + `tests with no issue at all and therefore absent from the return = ${GA.testQc.tests.length - qcRes.length}`);
w('# THE RETURN CARRIES ONLY THE TESTS WITH ISSUES. There is no count of tests');
w('# checked anywhere in it, so an empty array means either "every test is clean"');
w('# or "no tests were handed in", and a caller cannot tell which.');
w(`derived QC on an empty test list: rows returned = ${A.validateWellTests([], qcWs).length}`);
w('# THE OUTLIER CHECK NEEDS THREE PRIOR TESTS ON THE SAME WELL, so the first three');
w('# tests of a well can never be outliers whatever they say, and the very first bad');
w('# test instead becomes part of the median that judges the later ones.');
const seqTests = (n) => Array.from({ length: n }, (_, i) => ({
  id: `demo-${i + 1}`, well_id: 'w-demo', test_date: `2024-02-${String(i + 1).padStart(2, '0')}`,
  oil_rate_stbd: i === n - 1 ? 1500 : 500, water_rate_stbd: 100, gas_rate_mscfd: 250, duration_hours: 12,
}));
[2, 3, 4, 5, 6].forEach((n) => {
  const r = A.validateWellTests(seqTests(n), []);
  const last = r.find((x) => x.testId === `demo-${n}`);
  w(`derived outlier reach, ${n} tests on one well with the last at 1500 stb/d against 500s: `
    + `prior tests available = ${n - 1}, codes on the last test = ${last ? last.issues.map((i) => i.code).join(' ') : 'none'}`);
});
w('# THE DEVIATION IS MEASURED AGAINST THE MEDIAN OF THE EARLIER TESTS ONLY, never');
w('# against the later ones, so the same three-test history read backwards gives a');
w('# different answer.');
w('# AND THE TEACHING FIELD TESTS THROUGH THE SAME QC.');
const tQc = A.validateWellTests(TTESTS, TWS);
tQc.forEach((r) => {
  w(`teaching QC: test ${r.testId} on ${r.wellName}, date ${r.testDate}, severity ${r.severity}, `
    + `codes ${r.issues.map((i) => i.code).join(' ')}`);
  r.issues.forEach((is) => w(`teaching QC: test ${r.testId}, ${is.code}: ${is.message}`));
});
w(`teaching QC coverage: tests handed in = ${TTESTS.length}, rows returned = ${tQc.length}`);
w('# READ g-o9-1 AGAINST SECTION 17. QC calls that test a watercut mismatch and');
w('# groupTests carries the well on it anyway, because groupTests reads is_valid and');
w('# nothing else. The two functions live in the same file and neither one asks the');
w('# other anything.');
w('');

// ============================================================ SECTION 16
w('# SECTION 16: BACK ALLOCATION ON THE PUBLISHED FIELD');
w('# Professional m04. PUBLISHED. theoretical = test rate x uptime fraction,');
w('# factor = metered total / sum of theoretical, allocated = theoretical x factor.');
w('# The FACTOR IS THE OUTPUT, not an internal: a factor of 1.0 means the wells');
w('# tests add up to exactly what the facility measured, and nothing here');
w('# normalises it or clamps it into the warning band.');
[['allocation', GA.allocation], ['allocationNoUptime', GA.allocationNoUptime],
  ['allocationAged120', GA.allocationAged120], ['allocationWithInvalidTests', GA.allocationWithInvalidTests],
  ['allocationLedgerBasis', GA.allocationLedgerBasis]].forEach(([lab, g]) => {
  w(`golden ${lab}: days = ${g.grand.days}, basis ${g.settings.basis}, useUptime = ${yn(g.settings.useUptime)}, `
    + `maxTestAgeDays = ${g.settings.maxTestAgeDays}, includeInvalidTests = ${yn(g.settings.includeInvalidTests)}`);
  w(`golden ${lab}: measured oil = ${f(g.grand.measured_oil, 9)} stb, theoretical oil = ${f(g.grand.theoretical_oil, 9)} stb, `
    + `allocated oil = ${f(g.grand.allocated_oil, 9)} stb, grand factor = ${f(g.grand.measured_oil / g.grand.theoretical_oil, 12)}`);
  w(`golden ${lab}: measured water = ${f(g.grand.measured_water, 9)} stb, allocated water = ${f(g.grand.allocated_water, 9)} stb, `
    + `measured gas = ${f(g.grand.measured_gas, 9)} Mscf, allocated gas = ${f(g.grand.allocated_gas, 9)} Mscf`);
  w(`golden ${lab}: diagnostics ${j(g.diagnosticCounts)}, wells taking a share = ${g.wells.length}`);
});
w('# THE CLOSURE IDENTITY IS THE PROPERTY THAT MAKES AN ALLOCATION DEFENSIBLE, and');
w('# it holds EXACTLY on every day a factor exists, because every share is the same');
w('# factor times a theoretical.');
[0, 1, 11, 23].forEach((i) => {
  const d = GA.allocation.days[i];
  if (!d) return;
  w(`golden allocation day ${i + 1}: date ${d.date}, factors ${j(d.factors)}, `
    + `measured oil = ${f(d.measured.oil, 9)}, theoretical oil = ${f(d.theoretical.oil, 9)}, allocated oil = ${f(d.allocated.oil, 9)}, `
    + `closure residual = ${f(d.allocated.oil - d.measured.oil, 12)}`);
});
w('# AND IT DOES NOT HOLD AT THE GRAND TOTAL. A date whose theoretical is zero has');
w('# NO factor, is not allocated at all, and its metered volume simply is not in the');
w('# grand allocated. The published noBasis case is exactly that.');
w(`golden noBasis: days = ${GA.noBasis.allocation.grand.days}, measured oil = ${f(GA.noBasis.allocation.grand.measured_oil, 9)} stb, `
  + `allocated oil = ${f(GA.noBasis.allocation.grand.allocated_oil, 9)} stb, `
  + `metered oil in no well and in no total = ${f(GA.noBasis.allocation.grand.measured_oil - GA.noBasis.allocation.grand.allocated_oil, 9)} stb`);
w(`golden noBasis: diagnostics ${j(GA.noBasis.allocation.diagnosticCounts)}, and the return object keys are ${Object.keys(GA.noBasis.allocation).join(' ')}`);
GA.noBasis.allocation.days.forEach((d, i) => {
  w(`golden noBasis day ${i + 1}: date ${d.date}, factors ${j(d.factors)}, measured oil = ${f(d.measured.oil, 9)}, `
    + `theoretical oil = ${f(d.theoretical.oil, 9)}, allocated oil = ${f(d.allocated.oil, 9)}`);
});
w('# THERE IS NO CLOSURE FIGURE IN THE RETURN. A consumer that wants to know');
w('# whether the field closed has to subtract grand.allocated from grand.measured');
w('# itself, and nothing prompts it to.');
w('');

// ============================================================ SECTION 17
w('# SECTION 17: BACK ALLOCATION ON THE TEACHING FIELD');
w('# Professional m04. TEACHING. Twenty-one metered days over a field whose true');
w('# per-well production is known, so the difference between what a well MADE and');
w('# what it is CREDITED with can be read straight off.');
w(`teaching OGUTA allocation: allocated days = ${TALLOC.days.length}, first ${TALLOC.days[0].date}, `
  + `last ${TALLOC.days[TALLOC.days.length - 1].date}, wells taking a share = ${TALLOC.wells.length}, `
  + `diagnostics = ${TALLOC.diagnostics.length}`);
const diagCounts = {};
TALLOC.diagnostics.forEach((d) => { diagCounts[d.code] = (diagCounts[d.code] || 0) + 1; });
w(`teaching OGUTA allocation diagnostics by code = ${j(diagCounts)}`);
w(`teaching OGUTA allocation grand: measured oil = ${f(TALLOC.totals.measured.oil, 9)} stb, `
  + `theoretical oil = ${f(TALLOC.totals.theoretical.oil, 9)} stb, allocated oil = ${f(TALLOC.totals.allocated.oil, 9)} stb, `
  + `closure residual = ${f(TALLOC.totals.allocated.oil - TALLOC.totals.measured.oil, 9)} stb`);
w(`teaching OGUTA allocation grand: measured water = ${f(TALLOC.totals.measured.water, 9)} stb, allocated water = ${f(TALLOC.totals.allocated.water, 9)} stb, `
  + `measured gas = ${f(TALLOC.totals.measured.gas, 9)} Mscf, allocated gas = ${f(TALLOC.totals.allocated.gas, 9)} Mscf`);
TALLOC.wells.forEach((wl) => {
  w(`teaching OGUTA allocated well ${wl.wellName}: days = ${wl.days}, theoretical oil = ${f(wl.theoretical.oil, 9)} stb, `
    + `allocated oil = ${f(wl.allocated.oil, 9)} stb, allocated water = ${f(wl.allocated.water, 9)} stb, `
    + `allocated gas = ${f(wl.allocated.gas, 9)} Mscf`);
});
w('# THE DAILY FACTORS, WHICH ARE THE OUTPUT AN ALLOCATION ENGINEER ACTUALLY WORKS');
w('# FROM. A factor drifting away from one is the signal; the number is reported as');
w('# it fell out and is never normalised.');
TALLOC.days.forEach((d, i) => {
  w(`teaching OGUTA allocation day ${i + 1}: date ${d.date}, entries = ${d.entries.length}, `
    + `oil factor = ${d.factors.oil === null ? 'null' : f(d.factors.oil, 12)}, `
    + `water factor = ${d.factors.water === null ? 'null' : f(d.factors.water, 12)}, `
    + `gas factor = ${d.factors.gas === null ? 'null' : f(d.factors.gas, 12)}`);
});
w('# WHAT A WELL MADE AGAINST WHAT IT IS CREDITED WITH, on the last allocated day.');
const lastDay = TALLOC.days[TALLOC.days.length - 1];
lastDay.entries.forEach((e) => {
  const ledgerRow = LEDGER.find((r) => r.well_id === e.wellId && r.prod_date === lastDay.date);
  w(`teaching OGUTA last day ${lastDay.date}, ${e.wellName}: uptime = ${f(e.uptime, 9)}, `
    + `test ${e.testId} dated ${e.testDate}, theoretical oil = ${f(e.theoretical.oil, 9)} stb, `
    + `allocated oil = ${f(e.allocated.oil, 9)} stb, the well own ledger row = ${ledgerRow ? f(ledgerRow.oil_stb, 9) + ' stb' : 'NO ROW FILED'}`);
});
w(`teaching OGUTA last day ${lastDay.date}: metered oil = ${f(lastDay.measured.oil, 9)} stb, `
  + `theoretical oil = ${f(lastDay.theoretical.oil, 9)} stb, allocated oil = ${f(lastDay.allocated.oil, 9)} stb`);
w('# THE SETTINGS THAT MOVE THE ANSWER, on the same twenty-one days.');
[['default', {}], ['useUptime false', { useUptime: false }], ['includeInvalidTests true', { includeInvalidTests: true }],
  ['maxTestAgeDays 120', { maxTestAgeDays: 120 }], ['maxTestAgeDays 60', { maxTestAgeDays: 60 }],
  ['maxTestAgeDays 0', { maxTestAgeDays: 0 }], ['basis ledger', { basis: 'ledger' }]].forEach(([lab, st]) => {
  const al = A.computeAllocation({ wells: TWELLS, tests: TTESTS, ledger: LEDGER, totals: TTOTALS, settings: st });
  const dc = {};
  al.diagnostics.forEach((d) => { dc[d.code] = (dc[d.code] || 0) + 1; });
  const ld = al.days[al.days.length - 1];
  w(`teaching OGUTA allocation setting, ${lab}: wells taking a share = ${al.wells.length}, `
    + `theoretical oil = ${f(al.totals.theoretical.oil, 9)} stb, allocated oil = ${f(al.totals.allocated.oil, 9)} stb, `
    + `last day oil factor = ${ld.factors.oil === null ? 'null' : f(ld.factors.oil, 12)}, diagnostics ${j(dc)}`);
});
w('');

// ============================================================ SECTION 18
w('# SECTION 18: THE MONTHLY FACTORS, AND THE ONE THAT MEANS NOTHING TO SCALE');
w('# Professional m04. PUBLISHED then TEACHING. A well monthly factor is its');
w('# allocated volume over its theoretical volume for that month, so it carries the');
w('# mix of days the well was actually on.');
GA.monthlyFactors.forEach((r) => {
  w(`golden monthlyFactor: ${r.wellName}, month ${r.periodMonth}, theoretical oil = ${f(r.theoretical.oil, 9)} stb, `
    + `allocated oil = ${f(r.allocated.oil, 9)} stb, factors oil = ${f(r.factors.oil, 12)}, `
    + `water = ${f(r.factors.water, 12)}, gas = ${f(r.factors.gas, 12)}`);
});
w('# A MONTH WITH NO THEORETICAL VOLUME FOR A PHASE CARRIES A FACTOR OF 1 FOR THAT');
w('# PHASE, which is documented as "nothing to scale" and is indistinguishable in');
w('# the return from a month in which the tests agreed with the meter exactly.');
const demoWells = [{ id: 'd-1', name: 'DEMO-1', well_type: 'producer' }];
const demoTests = [{ id: 'dt-1', well_id: 'd-1', test_date: '2024-03-01', oil_rate_stbd: 1000, water_rate_stbd: 100, gas_rate_mscfd: 0, is_valid: true }];
const demoTotals = [{ total_date: '2024-03-05', oil_stb: 900, water_stb: 100, gas_mscf: 500 }];
const demoAl = A.computeAllocation({
  wells: demoWells, tests: demoTests, ledger: [{ well_id: 'd-1', prod_date: '2024-03-05', oil_stb: 900, hours_on: 24 }],
  totals: demoTotals,
});
const demoMf = A.monthlyFactors(demoAl)[0];
w(`derived monthlyFactor demonstration, one well whose test recorded no gas: oil factor = ${f(demoMf.factors.oil, 12)}, `
  + `water factor = ${f(demoMf.factors.water, 12)}, gas factor = ${f(demoMf.factors.gas, 12)}`);
w(`derived monthlyFactor demonstration: metered gas = ${f(demoTotals[0].gas_mscf, 6)} Mscf, `
  + `theoretical gas = ${f(demoMf.theoretical.gas, 6)} Mscf, allocated gas = ${f(demoMf.allocated.gas, 6)} Mscf, `
  + `diagnostics raised = ${j(demoAl.diagnostics.map((d) => d.code))}`);
w('# One number, two meanings, and the diagnostic that distinguishes them is on a');
w('# different array. THE TEACHING FIELD MONTHLY FACTORS.');
A.monthlyFactors(TALLOC).forEach((r) => {
  w(`teaching OGUTA monthlyFactor: ${r.wellName}, month ${r.periodMonth}, theoretical oil = ${f(r.theoretical.oil, 9)} stb, `
    + `allocated oil = ${f(r.allocated.oil, 9)} stb, factors oil = ${f(r.factors.oil, 12)}, `
    + `water = ${f(r.factors.water, 12)}, gas = ${f(r.factors.gas, 12)}`);
});
w('# AND THE WRITE-BACK SHAPE. allocatedLedgerRows carries the uptime through as an');
w('# hours_on, so a ledger written back from an allocation stays self-consistent');
w('# with the split that produced it, and a well that never filed a row gets one.');
const alRows = A.allocatedLedgerRows(TALLOC);
w(`teaching OGUTA allocatedLedgerRows: rows = ${alRows.length}, distinct wells = ${new Set(alRows.map((r) => r.wellId)).size}, `
  + `rows carrying an hours_on = ${alRows.filter((r) => r.hours_on !== null).length}`);
alRows.filter((r) => r.date === lastDay.date).forEach((r) => {
  w(`teaching OGUTA allocatedLedgerRow on ${r.date}: well ${r.wellId}, oil_stb = ${f(r.oil_stb, 9)}, `
    + `water_stb = ${f(r.water_stb, 9)}, gas_mscf = ${f(r.gas_mscf, 9)}, hours_on = ${r.hours_on === null ? 'null' : f(r.hours_on, 9)}`);
});
w('');

// ============================================================ SECTION 19
w('# SECTION 19: THE IMBALANCE, AND THE CROSS-CHECK THAT NEEDS A WELL MODEL');
w('# Professional m05. PUBLISHED. imbalanceSeries is the unaccounted volume an');
w('# allocation engineer chases: the metered total against what the wells own');
w('# meters booked. Positive means the facility meter saw MORE than the wells did.');
GA.imbalance.slice(0, 6).forEach((d, i) => {
  w(`golden imbalance day ${i + 1}: date ${d.date}, oil measured = ${f(d.oil.measured, 9)} stb, booked = ${f(d.oil.booked, 9)} stb, `
    + `imbalance = ${f(d.oil.imbalance, 9)} stb, imbalancePct = ${d.oil.imbalancePct === null ? 'null' : f(d.oil.imbalancePct, 12)}`);
  w(`golden imbalance day ${i + 1}: water imbalance = ${f(d.water.imbalance, 9)} stb, water imbalancePct = ${d.water.imbalancePct === null ? 'null' : f(d.water.imbalancePct, 12)}, `
    + `gas imbalance = ${f(d.gas.imbalance, 9)} Mscf, gas imbalancePct = ${d.gas.imbalancePct === null ? 'null' : f(d.gas.imbalancePct, 12)}`);
});
w('# THE PERCENTAGE IS AGAINST WHAT THE WELLS BOOKED, not against the meter, and it');
w('# is null when the wells booked nothing at all, so a date on which the meter saw');
w('# volume and the wells booked none has a real imbalance and NO percentage.');
w('# AND THE SAME ON THE TEACHING FIELD, where OGUTA-17 stops filing rows partway');
w('# through the allocated window and keeps producing.');
const tImb = A.imbalanceSeries(TALLOC, LEDGER);
tImb.forEach((d, i) => {
  w(`teaching OGUTA imbalance day ${i + 1}: date ${d.date}, oil measured = ${f(d.oil.measured, 9)} stb, `
    + `booked = ${f(d.oil.booked, 9)} stb, imbalance = ${f(d.oil.imbalance, 9)} stb, `
    + `imbalancePct = ${d.oil.imbalancePct === null ? 'null' : f(d.oil.imbalancePct, 12)}`);
});
w('# READ THE IMBALANCE COLUMN ACROSS THE DAY OGUTA-17 GOES QUIET. Nothing about');
w('# the field changed except which rows exist, and the unaccounted volume steps.');
w('# THE NODAL CROSS-CHECK is the strongest test QC there is and the one that needs');
w('# a well model. PUBLISHED, with the solver injected as a stub whose answer the');
w('# oracle wrote down as a quadratic root.');
w(`golden nodalCrossCheck instrument: pr = ${f(GA.nodalCrossCheck.instrument.pr, 6)} psia, J = ${GA.nodalCrossCheck.instrument.J}, `
  + `A = ${GA.nodalCrossCheck.instrument.A}, B = ${GA.nodalCrossCheck.instrument.B}, `
  + `tolerancePct = ${GA.nodalCrossCheck.settings.tolerancePct}, minRateStbd = ${GA.nodalCrossCheck.settings.minRateStbd}`);
GA.nodalCrossCheck.results.forEach((r, i) => {
  w(`golden nodalCrossCheck ${i + 1}: test ${r.testId}, status ${r.status}, measured = ${f(r.measuredStbd, 9)} stb/d, `
    + `nodal = ${r.nodalStbd === null ? 'null' : f(r.nodalStbd, 9)} stb/d, `
    + `deviationPct = ${r.deviationPct === null ? 'null' : f(r.deviationPct, 12)}`);
});
w('# THE DEVIATION DIVIDES BY THE NODAL RATE, so it is a statement about how far the');
w('# TEST sits from the MODEL, and the same absolute gap reads differently depending');
w('# on which way round the two are.');
const gN = GA.nodalCrossCheck.results.find((r) => r.testId === 'n-low');
const gH = GA.nodalCrossCheck.results.find((r) => r.testId === 'n-high');
w(`derived nodal deviation symmetry: n-low is ${f(gN.measuredStbd - gN.nodalStbd, 9)} stb/d from the model and reads ${f(gN.deviationPct, 12)} per cent; `
  + `n-high is ${f(gH.measuredStbd - gH.nodalStbd, 9)} stb/d from it and reads ${f(gH.deviationPct, 12)} per cent`);
w('# THE FIVE STATUSES ARE dead, off, no-thp, no-model and ok, and they are ranked');
w('# in that order, so a well the model says should not flow at all is read first.');
w('# TWO ADJACENT LINES INSIDE IT DISAGREE ABOUT WHAT TO DO WITH A MISSING COLUMN.');
w('# The water cut the check hands the solver falls back to the WELL MODEL own');
w('# water cut when the test recorded no liquid; the gas-oil ratio on the very next');
w('# line falls back to ZERO, a dead-oil column, rather than to the model gas-oil');
w('# ratio. A test that recorded a rate and no gas is therefore solved against a');
w('# well the module has just decided makes no gas.');
w('');

// ============================================================ SECTION 20
w('# SECTION 20: THE RATIO SEAM. A MEAN OF DAILY RATIOS AGAINST A RATIO OF SUMS');
w('# Expert m01. PUBLISHED. This is the headline of the course and the engine own');
w('# header states it rather than hiding it: computeKpis forms a period watercut and');
w('# gas-oil ratio VOLUMETRICALLY, sum of water over sum of liquid, which is what a');
w('# period ratio means; detectExceptions forms the same two quantities as the MEAN');
w('# OF THE DAILY RATIOS, which is a different quantity and is biased by low-rate');
w('# days. Both are in the shipped studio. The gate measures the disagreement on a');
w('# golden series and the disagreement is recorded for an owner decision rather');
w('# than resolved, because changing it would move numbers a shipped studio shows.');
w(`golden ratioSeam well = ${GS.ratioSeam.well}`);
w(`golden ratioSeam window: recent ${GS.ratioSeam.window.recentFrom} to ${GS.ratioSeam.window.recentTo}, `
  + `baseline ${GS.ratioSeam.window.baselineFrom} to ${GS.ratioSeam.window.baselineTo}`);
w(`golden ratioSeam gor: baseline mean of ratios = ${f(GS.ratioSeam.gor.baselineMeanOfRatios, 12)} scf/stb, `
  + `baseline volumetric = ${f(GS.ratioSeam.gor.baselineVolumetric, 12)} scf/stb`);
w(`golden ratioSeam gor: recent mean of ratios = ${f(GS.ratioSeam.gor.recentMeanOfRatios, 12)} scf/stb, `
  + `recent volumetric = ${f(GS.ratioSeam.gor.recentVolumetric, 12)} scf/stb`);
w(`golden ratioSeam gor: rise by mean of ratios = ${f(GS.ratioSeam.gor.riseByMeanOfRatiosPct, 12)} per cent, `
  + `rise by volumetric = ${f(GS.ratioSeam.gor.riseByVolumetricPct, 12)} per cent`);
w(`golden ratioSeam gor: overstatement = ${f(GS.ratioSeam.gor.overstatementPct, 12)} per cent, `
  + `severity by mean of ratios = ${GS.ratioSeam.gor.severityByMeanOfRatios}, `
  + `severity by volumetric = ${GS.ratioSeam.gor.severityByVolumetric}`);
w(`golden ratioSeam watercut: baseline mean of ratios = ${f(GS.ratioSeam.watercut.baselineMeanOfRatios, 12)}, `
  + `baseline volumetric = ${f(GS.ratioSeam.watercut.baselineVolumetric, 12)}`);
w(`golden ratioSeam watercut: recent mean of ratios = ${f(GS.ratioSeam.watercut.recentMeanOfRatios, 12)}, `
  + `recent volumetric = ${f(GS.ratioSeam.watercut.recentVolumetric, 12)}`);
w(`golden ratioSeam watercut: rise by mean of ratios = ${f(GS.ratioSeam.watercut.riseByMeanOfRatiosPts, 12)} points, `
  + `rise by volumetric = ${f(GS.ratioSeam.watercut.riseByVolumetricPts, 12)} points`);
w(`golden ratioSeam watercut: severity by mean of ratios = ${GS.ratioSeam.watercut.severityByMeanOfRatios}, `
  + `severity by volumetric = ${GS.ratioSeam.watercut.severityByVolumetric}`);
w('# THE SEVERITY COLUMN IS THE WHOLE FINDING. Both quantities are defensible');
w('# readings of the same rows, they disagree, and on this published series the');
w('# disagreement is large enough to move the printed severity from medium to high');
w('# on BOTH ratios at once. The engine prints the higher one.');
const gorRiseRatio = GS.ratioSeam.gor.riseByMeanOfRatiosPct / GS.ratioSeam.gor.riseByVolumetricPct;
w(`derived ratioSeam: the gas-oil ratio rise read one way is ${f(gorRiseRatio, 12)} times the rise read the other way, `
  + `and the trigger it is measured against is ${S.DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct} per cent with a doubling to high at `
  + `${S.DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct * 2} per cent`);
const wcRiseDiff = GS.ratioSeam.watercut.riseByMeanOfRatiosPts - GS.ratioSeam.watercut.riseByVolumetricPts;
w(`derived ratioSeam: the watercut rise read one way is ${f(wcRiseDiff, 12)} points above the rise read the other way, `
  + `and the trigger is ${S.DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts} points with a doubling to high at `
  + `${S.DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts * 2} points`);
w('# WHICH FUNCTION READS WHICH WAY, so a lesson can name it rather than gesture:');
w('#   detectExceptions   windowMean(points, "gor", ...) and windowMean(points,');
w('#                      "watercut", ...). Each point ratio was formed in');
w('#                      derivePoint from that row alone, and the window mean is');
w('#                      an unweighted arithmetic mean of those ratios.');
w('#   computeKpis        mean of the field oil, mean of the field water, mean of');
w('#                      the field gas, and THEN water / (oil + water) and');
w('#                      gas x 1000 / oil off the means. Volume weighted by');
w('#                      construction.');
w('#   buildFieldSeries   volumetric, per day, on the whole field at once.');
w('');

// ============================================================ SECTION 21
w('# SECTION 21: THE SEAM SWEPT. WHAT MAKES THE TWO READINGS DIVERGE');
w('# Expert m01. TEACHING. The two readings agree exactly whenever the daily ratio');
w('# does not move, and they diverge exactly in proportion to how much of the');
w('# window a low-rate day is allowed to speak for. OGUTA-2 is built to show that:');
w('# a baseline of constant ratios, and three collapsed days inside the recent');
w('# window on which the oil falls by a factor of more than TWELVE and the gas by a');
w('# factor of only about FOUR, which is what drives the daily ratio up.');
const seamOn = (pts, fromDay, toDay) => {
  const rows = pts.filter((p) => { const d = dayOf(p.date); return d > fromDay && d <= toDay; });
  const gors = rows.map((p) => p.gor).filter((x) => Number.isFinite(x));
  const wcs = rows.map((p) => p.watercut).filter((x) => Number.isFinite(x));
  const oil = rows.reduce((a, p) => a + p.oil, 0);
  const wat = rows.reduce((a, p) => a + p.water, 0);
  const gas = rows.reduce((a, p) => a + p.gas, 0);
  return {
    n: rows.length,
    gorMean: gors.reduce((a, b) => a + b, 0) / gors.length,
    gorVol: (gas * 1000) / oil,
    wcMean: wcs.reduce((a, b) => a + b, 0) / wcs.length,
    wcVol: wat / (oil + wat),
    oil, wat, gas,
  };
};
const o2 = TWS.find((x) => x.well.id === WELLS.o2.id).points;
const o2Base = seamOn(o2, tAsOf - 37, tAsOf - 7);
const o2Rec = seamOn(o2, tAsOf - 7, tAsOf);
w(`teaching OGUTA-2 baseline window: rows = ${o2Base.n}, oil = ${f(o2Base.oil, 9)} stb, water = ${f(o2Base.wat, 9)} stb, gas = ${f(o2Base.gas, 9)} Mscf`);
w(`teaching OGUTA-2 baseline gas-oil ratio: mean of daily ratios = ${f(o2Base.gorMean, 12)} scf/stb, `
  + `volumetric = ${f(o2Base.gorVol, 12)} scf/stb, difference = ${f(o2Base.gorMean - o2Base.gorVol, 12)}`);
w(`teaching OGUTA-2 baseline watercut: mean of daily ratios = ${f(o2Base.wcMean, 12)}, `
  + `volumetric = ${f(o2Base.wcVol, 12)}, difference = ${f(o2Base.wcMean - o2Base.wcVol, 12)}`);
w(`teaching OGUTA-2 recent window: rows = ${o2Rec.n}, oil = ${f(o2Rec.oil, 9)} stb, water = ${f(o2Rec.wat, 9)} stb, gas = ${f(o2Rec.gas, 9)} Mscf`);
w(`teaching OGUTA-2 recent gas-oil ratio: mean of daily ratios = ${f(o2Rec.gorMean, 12)} scf/stb, `
  + `volumetric = ${f(o2Rec.gorVol, 12)} scf/stb, the first is ${f(o2Rec.gorMean / o2Rec.gorVol, 12)} times the second`);
w(`teaching OGUTA-2 recent watercut, ALL THREE AS FRACTIONS and not as points: mean of daily ratios = ${f(o2Rec.wcMean, 12)}, `
  + `volumetric = ${f(o2Rec.wcVol, 12)}, difference = ${f(o2Rec.wcMean - o2Rec.wcVol, 12)} as a fraction, which is ${f((o2Rec.wcMean - o2Rec.wcVol) * 100, 12)} POINTS`);
const riseMean = ((o2Rec.gorMean - o2Base.gorMean) / o2Base.gorMean) * 100;
const riseVol = ((o2Rec.gorVol - o2Base.gorVol) / o2Base.gorVol) * 100;
w(`teaching OGUTA-2 gas-oil ratio rise: by mean of daily ratios = ${f(riseMean, 12)} per cent, `
  + `by volumetric = ${f(riseVol, 12)} per cent, `
  + `severity by the first = ${riseMean >= 60 ? 'high' : riseMean >= 30 ? 'medium' : 'none'}, `
  + `severity by the second = ${riseVol >= 60 ? 'high' : riseVol >= 30 ? 'medium' : 'none'}`);
const wcRiseMean = (o2Rec.wcMean - o2Base.wcMean) * 100;
const wcRiseVol = (o2Rec.wcVol - o2Base.wcVol) * 100;
w(`teaching OGUTA-2 watercut rise: by mean of daily ratios = ${f(wcRiseMean, 12)} points, `
  + `by volumetric = ${f(wcRiseVol, 12)} points, `
  + `severity by the first = ${wcRiseMean >= 20 ? 'high' : wcRiseMean >= 10 ? 'medium' : 'none'}, `
  + `severity by the second = ${wcRiseVol >= 20 ? 'high' : wcRiseVol >= 10 ? 'medium' : 'none'}`);
const NORMAL = [1008, 312, 585];
const COLLAPSED = [82, 231, 141];
w('# THE TWO DAY SHAPES, SO THE FACTORS ABOVE CAN BE CHECKED BY HAND.');
w(`teaching OGUTA-2 ordinary recent day: oil = ${f(NORMAL[0], 6)} stb, water = ${f(NORMAL[1], 6)} stb, gas = ${f(NORMAL[2], 6)} Mscf, `
  + `watercut = ${f(NORMAL[1] / (NORMAL[0] + NORMAL[1]), 12)}, gor = ${f((NORMAL[2] * 1000) / NORMAL[0], 12)} scf/stb`);
w(`teaching OGUTA-2 collapsed recent day: oil = ${f(COLLAPSED[0], 6)} stb, water = ${f(COLLAPSED[1], 6)} stb, gas = ${f(COLLAPSED[2], 6)} Mscf, `
  + `watercut = ${f(COLLAPSED[1] / (COLLAPSED[0] + COLLAPSED[1]), 12)}, gor = ${f((COLLAPSED[2] * 1000) / COLLAPSED[0], 12)} scf/stb`);
w(`teaching OGUTA-2 collapse ratios: the oil falls by a factor of ${f(NORMAL[0] / COLLAPSED[0], 12)}, `
  + `the water by ${f(NORMAL[1] / COLLAPSED[1], 12)}, the gas by ${f(NORMAL[2] / COLLAPSED[2], 12)}, `
  + `so the gas-oil ratio rises by ${f(((COLLAPSED[2] * 1000) / COLLAPSED[0]) / ((NORMAL[2] * 1000) / NORMAL[0]), 12)}`);
w('# HOW MANY COLLAPSED DAYS IT TAKES. A window of SEVEN days built out of those');
w('# two shapes only, with k of them collapsed. It is a DEMONSTRATION and not the');
w('# OGUTA-2 recent window itself: the real window mixes four ordinary days that');
w('# differ slightly from each other, so its three-collapsed row sits a little below');
w('# the three-collapsed row of this sweep. Do not quote one for the other.');
for (let k = 0; k <= 7; k += 1) {
  const rows = [];
  for (let i = 0; i < 7; i += 1) {
    const [o, wa, g] = i < k ? COLLAPSED : NORMAL;
    rows.push(S.derivePoint({ prod_date: iso(tAsOf - 6 + i), oil_stb: o, water_stb: wa, gas_mscf: g, hours_on: 24 }));
  }
  const gors = rows.map((p) => p.gor);
  const oil = rows.reduce((a, p) => a + p.oil, 0);
  const gas = rows.reduce((a, p) => a + p.gas, 0);
  const wat = rows.reduce((a, p) => a + p.water, 0);
  const mn = gors.reduce((a, b) => a + b, 0) / gors.length;
  const vl = (gas * 1000) / oil;
  const wcMn = rows.map((p) => p.watercut).reduce((a, b) => a + b, 0) / rows.length;
  const wcVl = wat / (oil + wat);
  w(`teaching seam sweep, ${k} of 7 recent days collapsed: gor mean of ratios = ${f(mn, 12)} scf/stb, `
    + `gor volumetric = ${f(vl, 12)} scf/stb, ratio = ${f(mn / vl, 12)}, `
    + `watercut mean of ratios = ${f(wcMn, 12)}, watercut volumetric = ${f(wcVl, 12)}, `
    + `watercut difference = ${f(wcMn - wcVl, 12)}`);
}
w('# THE TWO READINGS ARE IDENTICAL AT BOTH ENDS OF THAT SWEEP AND DISAGREE MOST IN');
w('# THE MIDDLE, which is the shape of the whole finding: a window of uniform days');
w('# cannot show it, and a window with a mixture of rates shows it at its worst.');
w('# NEITHER READING IS WRONG. A mean of daily ratios answers "what did a typical');
w('# day of this well look like"; a ratio of sums answers "what did this period');
w('# produce". A surveillance tool needs the first to spot a well that has changed');
w('# and the second to book a barrel, and the defect is that it uses both and says');
w('# so only in a source comment.');
w('');

// ============================================================ SECTION 22
w('# SECTION 22: THE SPELLINGS OF NOTHING');
w('# Expert m03. DERIVED on constructed rows. Four modules, four coercion');
w('# conventions, and the same missing value read four different ways. This is the');
w('# tier centre and every row is one line of source.');
w('#   surveillance.derivePoint    row.oil_stb || 0     an absent volume is ZERO,');
w('#                               and so is a numeric STRING, which is not a');
w('#                               number and is not zero either.');
w('#   surveillance.derivePoint    Number.isFinite(row.hours_on) ? ... : null');
w('#                               an absent hours column is UPTIME UNKNOWN.');
w('#   allocation.computeAllocation Number.isFinite(row.hours_on) ? ... : 24');
w('#                               the same absent column is A FULL DAY ON.');
w('#   liftScreening.screenLift    Number(x) || 0       an absent number is ZERO,');
w('#                               and an absent BOOLEAN is TRUE.');
w('#   liftAdvisor.num             a fallback per call site, 32 for an API.');
w('# THE ONE THAT MOVES A REAL NUMBER: A NUMERIC STRING IN A VOLUME COLUMN.');
w('# `row.oil_stb || 0` returns the STRING when the string is non-empty, and every');
w('# derived quantity that MULTIPLIES or DIVIDES it coerces back to a number and is');
w('# right. The one that ADDS is liquid, and + on two strings CONCATENATES.');
const CSV = { prod_date: '2024-01-01', oil_stb: '800', water_stb: '200', gas_mscf: '400', hours_on: 24 };
const NUMROW = { prod_date: '2024-01-01', oil_stb: 800, water_stb: 200, gas_mscf: 400, hours_on: 24 };
const dCsv = S.derivePoint(CSV);
const dNum = S.derivePoint(NUMROW);
w(`derived string row, volumes as NUMBERS: liquid = ${f(dNum.liquid, 9)} stb, watercut = ${f(dNum.watercut, 12)}, `
  + `gor = ${f(dNum.gor, 9)} scf/stb, oilPd = ${f(dNum.oilPd, 9)} stb/d, liquidPd = ${f(dNum.liquidPd, 9)} stb/d`);
w(`derived string row, the SAME volumes as STRINGS: liquid = ${dCsv.liquid} stb, watercut = ${f(dCsv.watercut, 12)}, `
  + `gor = ${f(dCsv.gor, 9)} scf/stb, oilPd = ${f(dCsv.oilPd, 9)} stb/d, liquidPd = ${f(dCsv.liquidPd, 9)} stb/d`);
w(`derived string row: the watercut is understated by a factor of ${f(dNum.watercut / dCsv.watercut, 9)}, `
  + `and the liquid producing-day rate is overstated by a factor of ${f(dCsv.liquidPd / dNum.liquidPd, 9)}`);
w('# The gas-oil ratio and the oil producing-day rate come back EXACTLY RIGHT on');
w('# the same row, because both are formed by multiplication and division only, and');
w('# only the two that pass through liquid are wrong. Read the factor on the line');
w('# above: it is the whole of the damage on THIS ROW, and it is the same factor');
w('# in both DIRECTIONS, understated on the watercut and overstated on the rate.');
w('# It is NOT the factor the field roll-up carries, which is larger: the field');
w('# roll-up lines of this same section carry that one.');
w('# WHAT THE FIELD ROLL-UP DOES WITH THE SAME ROWS, and it is worse, because an');
w('# accumulator carries the damage forward. `d.oil += r.oil_stb || 0` starts at a');
w('# numeric zero and the first string turns the accumulator itself into a string,');
w('# so every later row is CONCATENATED onto it rather than added.');
const fsCsv = S.buildFieldSeries([CSV])[0];
const fsNum = S.buildFieldSeries([NUMROW])[0];
w(`derived string row through buildFieldSeries, ONE row as numbers: oil = ${f(fsNum.oil, 9)}, water = ${f(fsNum.water, 9)}, `
  + `liquid = ${f(fsNum.liquid, 9)}, watercut = ${f(fsNum.watercut, 12)}, wellsOn = ${fsNum.wellsOn}`);
w(`derived string row through buildFieldSeries, ONE row as strings: oil = ${f(fsCsv.oil, 9)}, water = ${f(fsCsv.water, 9)}, `
  + `liquid = ${f(fsCsv.liquid, 9)}, watercut = ${f(fsCsv.watercut, 12)}, wellsOn = ${fsCsv.wellsOn}`);
[1, 2, 3, 4].forEach((n) => {
  const numRows = Array.from({ length: n }, () => ({ ...NUMROW }));
  const strRows = Array.from({ length: n }, () => ({ ...CSV }));
  const a = S.buildFieldSeries(numRows)[0];
  const b = S.buildFieldSeries(strRows)[0];
  w(`derived string accumulator, ${n} identical rows of 800 stb of oil on one date: as numbers field oil = ${f(a.oil, 9)} stb, `
    + `as strings field oil = ${f(b.oil, 9)} stb, overstatement factor = ${f(b.oil / a.oil, 12)}`);
});
w('# ONE ROW OF TEXT IS ALREADY WRONG IN THE LIQUID AND THE WATERCUT, and by the');
w('# fourth row the field oil total is out by a factor a reader cannot mistake for');
w('# a rounding. The producing-day rates on the same rows are still exactly right,');
w('# because they are formed by multiplication. Nothing anywhere reports that a');
w('# column arrived as text.');
w('# THE OTHER SPELLINGS, side by side, on one quantity: an hours column.');
[['24 as a number', 24], ['0', 0], ['null', null], ['undefined', undefined], ['NaN', NaN],
  ['the string "20"', '20'], ['the string ""', '']].forEach(([lab, h]) => {
  const d = S.derivePoint({ ...NUMROW, hours_on: h });
  const al = A.computeAllocation({
    wells: [{ id: 'd-1', name: 'DEMO-1', well_type: 'producer' }],
    tests: [{ id: 'dt', well_id: 'd-1', test_date: '2024-01-01', oil_rate_stbd: 1000, is_valid: true }],
    ledger: [{ well_id: 'd-1', prod_date: '2024-01-01', oil_stb: 800, hours_on: h }],
    totals: [{ total_date: '2024-01-01', oil_stb: 800 }],
  });
  w(`derived hours spelling across the two modules, hours_on = ${lab}: surveillance oilPd = ${d.oilPd === null ? 'null' : f(d.oilPd, 9)} stb/d, `
    + `allocation uptime = ${f(al.days[0].entries[0].uptime, 9)}, allocation theoretical oil = ${f(al.days[0].entries[0].theoretical.oil, 9)} stb`);
});
w('# surveillance reads a missing hours column as UPTIME UNKNOWN and leaves the');
w('# volume unscaled; allocation reads the identical column as TWENTY-FOUR HOURS ON');
w('# and gives the well a full share. The unscaled volume and a full day happen to');
w('# be the same NUMBER, and they are not the same CLAIM, and only one of the two');
w('# modules is entitled to the one it makes. They are called on the same ledger by');
w('# the same studio. Note also that a numeric STRING in the hours column reaches');
w('# neither reading: both call Number.isFinite, so the string "20" is not twenty');
w('# hours in either module.');
w('');

// ============================================================ SECTION 23
w('# SECTION 23: THE MISSING ROW THAT TAKES A FULL SHARE');
w('# Expert m03. DERIVED demonstration then TEACHING. computeAllocation looks up a');
w('# ledger row per well per date to find the hours. When there is NO ROW AT ALL the');
w('# lookup returns null, `Number.isFinite(null?.hours_on)` is false, and the');
w('# defaultHours of 24 is substituted, so a well that filed nothing is credited');
w('# with a full day on stream and takes a full share of the metered total.');
const shareWells = [{ id: 's-a', name: 'SHARE-A', well_type: 'producer' }, { id: 's-b', name: 'SHARE-B', well_type: 'producer' }];
const shareTests = [
  { id: 'st-a', well_id: 's-a', test_date: '2024-03-01', oil_rate_stbd: 1000, water_rate_stbd: 100, gas_rate_mscfd: 400, is_valid: true },
  { id: 'st-b', well_id: 's-b', test_date: '2024-03-01', oil_rate_stbd: 1000, water_rate_stbd: 100, gas_rate_mscfd: 400, is_valid: true },
];
const shareTotals = [{ total_date: '2024-03-05', oil_stb: 1000, water_stb: 100, gas_mscf: 400 }];
[['SHARE-B shut in and SAID so, hours_on 0',
  [{ well_id: 's-a', prod_date: '2024-03-05', oil_stb: 1000, hours_on: 24 }, { well_id: 's-b', prod_date: '2024-03-05', oil_stb: 0, hours_on: 0 }]],
['SHARE-B shut in and filed NO ROW',
  [{ well_id: 's-a', prod_date: '2024-03-05', oil_stb: 1000, hours_on: 24 }]],
['SHARE-B filed a row of zeroes with hours_on 24',
  [{ well_id: 's-a', prod_date: '2024-03-05', oil_stb: 1000, hours_on: 24 }, { well_id: 's-b', prod_date: '2024-03-05', oil_stb: 0, hours_on: 24 }]],
['SHARE-B filed a row with a null hours_on',
  [{ well_id: 's-a', prod_date: '2024-03-05', oil_stb: 1000, hours_on: 24 }, { well_id: 's-b', prod_date: '2024-03-05', oil_stb: 0, hours_on: null }]],
].forEach(([lab, led]) => {
  const al = A.computeAllocation({ wells: shareWells, tests: shareTests, ledger: led, totals: shareTotals });
  const d = al.days[0];
  w(`derived missing-row demonstration, ${lab}: oil factor = ${f(d.factors.oil, 12)}, `
    + `${d.entries.map((e) => `${e.wellName} uptime ${f(e.uptime, 6)} theoretical ${f(e.theoretical.oil, 6)} allocated ${f(e.allocated.oil, 6)} stb`).join('; ')}, `
    + `diagnostics ${j(al.diagnostics.map((x) => x.code))}`);
});
w('# SHARE-A actually made every barrel the meter saw. Told the truth about');
w('# SHARE-B, the engine credits it with all of them. Told nothing about SHARE-B,');
w('# the engine credits it with half, and the only thing that changed is which rows');
w('# exist. The factor moves to exactly one half and a factor_out_of_band');
w('# diagnostic fires, which is the module noticing the symptom and not the cause.');
w('# THE SAME THING ON THE TEACHING FIELD, WHERE IT IS NOT A DEMONSTRATION. OGUTA-17');
w('# stops sending rows partway through the allocated window and does not stop');
w('# producing, so for the rest of the window it has no ledger row, is credited with');
w('# a full twenty-four hours, and takes a share on a test that is also ageing out.');
const o17Days = TALLOC.days.map((d) => {
  const e = d.entries.find((x) => x.wellId === WELLS.o17.id);
  const row = LEDGER.find((r) => r.well_id === WELLS.o17.id && r.prod_date === d.date);
  return { date: d.date, e, row };
});
o17Days.forEach((x, i) => {
  w(`teaching OGUTA-17 allocation day ${i + 1}: date ${x.date}, ledger row filed = ${x.row ? 'yes, ' + f(x.row.oil_stb, 9) + ' stb' : 'NO'}, `
    + `${x.e ? `uptime = ${f(x.e.uptime, 9)}, test ${x.e.testId}, theoretical oil = ${f(x.e.theoretical.oil, 9)} stb, allocated oil = ${f(x.e.allocated.oil, 9)} stb`
      : 'took no share at all'}`);
});
w('# AND WHAT THE SURVEILLANCE HALF SAID ABOUT THE SAME WELL OVER THE SAME DAYS.');
const o17ex = TEX.exceptions.filter((e) => e.wellName === 'OGUTA-17');
o17ex.forEach((e) => {
  w(`teaching OGUTA-17 exception: type ${e.type}, severity ${e.severity}, value = ${f(e.value, 9)} days, `
    + `baseline = ${f(e.baseline, 9)} days, message: ${e.message}`);
});
w('# ONE WELL, TWO MODULES, TWO OPPOSITE READINGS OF THE SAME SILENCE. Surveillance');
w('# raises a stale_data flag and ranks it below every rate drop on the field;');
w('# allocation reads the identical absence as a full day on stream.');
w('');

// ============================================================ SECTION 24
w('# SECTION 24: GUARDS IN THE WRONG PLACE');
w('# Expert m04. DERIVED demonstrations, one per guard. Five of them, and each one');
w('# is a single clause.');
w('# (a) minOilRate GATES THE RATE CHECK AND THE GAS-OIL RATIO CHECK AND DOES NOT');
w('#     GATE THE WATERCUT CHECK. So a well too small to have its rate collapse');
w('#     reported can still raise a HIGH watercut exception on the same rows.');
const tinyRows = [];
[...Array(40).keys()].forEach((k) => {
  const back = 39 - k;
  const recent = back < 7;
  tinyRows.push({
    well: { id: 'w-tiny', name: 'TINY-1', well_type: 'producer' }, well_id: 'w-tiny',
    prod_date: iso(dayOf('2024-11-20') - back),
    oil_stb: recent ? 1.2 : 3.0, water_stb: recent ? 9.0 : 1.8, gas_mscf: recent ? 9.0 : 2.4,
    hours_on: 24, winj_stb: 0, ginj_mscf: 0,
  });
});
const tinyWs = S.buildWellSeries(tinyRows);
const tinyEx = S.detectExceptions(tinyWs).exceptions;
w(`derived minOilRate asymmetry, a well at 3.0 stb/d of oil in the baseline and 1.2 stb/d recently: `
  + `exceptions raised = ${tinyEx.length}, ${tinyEx.map((e) => `${e.severity} ${e.type}`).join('; ') || '(none)'}`);
tinyEx.forEach((e) => w(`derived minOilRate asymmetry: message: ${e.message}`));
w(`derived minOilRate asymmetry, the oil actually fell by ${f(((3.0 - 1.2) / 3.0) * 100, 9)} per cent, `
  + `well past the rateDropPct trigger of ${S.DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct} per cent, and no rate_drop is raised`);
[0, 1, 2, 3, 5, 10].forEach((m) => {
  const ex = S.detectExceptions(tinyWs, { minOilRate: m }).exceptions;
  w(`derived minOilRate sweep on that well, minOilRate = ${m}: ${ex.map((e) => `${e.severity} ${e.type}`).join('; ') || '(none)'}`);
});
w('# (b) A WELL BELOW minOilRate THAT STOPS ALTOGETHER RAISES NOTHING. The shut_in');
w('#     branch sits inside the same baseline >= minOilRate gate, and the downtime');
w('#     branch requires the mean hours to be ABOVE ZERO, so a small well that goes');
w('#     to zero hours and zero volume produces no exception of any kind.');
const stopRows = [];
[...Array(40).keys()].forEach((k) => {
  const back = 39 - k;
  const recent = back < 7;
  stopRows.push({
    well: { id: 'w-stop', name: 'STOP-1', well_type: 'producer' }, well_id: 'w-stop',
    prod_date: iso(dayOf('2024-11-20') - back),
    oil_stb: recent ? 0 : 3.4, water_stb: recent ? 0 : 1.0, gas_mscf: recent ? 0 : 1.5,
    hours_on: recent ? 0 : 24, winj_stb: 0, ginj_mscf: 0,
  });
});
const stopEx = S.detectExceptions(S.buildWellSeries(stopRows)).exceptions;
w(`derived stopped small well, baseline 3.4 stb/d of oil and a fully shut recent week: `
  + `exceptions raised = ${stopEx.length}, ${stopEx.map((e) => `${e.severity} ${e.type}`).join('; ') || '(NOTHING)'}`);
const stopBig = stopRows.map((r) => ({ ...r, oil_stb: r.oil_stb === 0 ? 0 : 840, water_stb: r.water_stb === 0 ? 0 : 250 }));
const stopBigEx = S.detectExceptions(S.buildWellSeries(stopBig)).exceptions;
w(`derived stopped LARGE well, the same rows scaled to a baseline of 840 stb/d: `
  + `exceptions raised = ${stopBigEx.length}, ${stopBigEx.map((e) => `${e.severity} ${e.type}`).join('; ')}`);
w('# (c) THE DOWNTIME TEST IS `mean < downtimeHours && mean > 0`, so a mean of');
w('#     EXACTLY ZERO hours, which is a well that recorded itself shut for the whole');
w('#     window, is the one value the downtime check refuses to report.');
[24, 16, 12, 11.99, 6, 1, 0.1, 0].forEach((h) => {
  const rr = stopRows.map((r) => ({ ...r, oil_stb: r.oil_stb === 0 ? 90 : 840, water_stb: 40, hours_on: r.hours_on === 0 ? h : 24 }));
  const ex = S.detectExceptions(S.buildWellSeries(rr)).exceptions;
  w(`derived downtime boundary, recent hours = ${f(h, 2)}: ${ex.map((e) => `${e.severity} ${e.type}`).join('; ') || '(none)'}`);
});
w('# (d) stale_data RETURNS EARLY AND CANNOT EXCEED MEDIUM. A well that has not');
w('#     reported for months raises exactly one exception, at medium, and every');
w('#     other comparison on that well is skipped because the windows would be');
w('#     empty. It therefore ranks below every high-severity rate drop on the field,');
w('#     alphabetically among the mediums.');
[7, 8, 14, 15, 16, 30, 60, 120, 400].forEach((gap) => {
  const rr = [];
  for (let k = gap + 30; k >= gap; k -= 1) {
    rr.push({ well: { id: 'w-gone', name: 'GONE-1', well_type: 'producer' }, well_id: 'w-gone',
      prod_date: iso(dayOf('2024-11-20') - k), oil_stb: 900, water_stb: 100, gas_mscf: 500, hours_on: 24, winj_stb: 0, ginj_mscf: 0 });
  }
  rr.push({ well: { id: 'w-live', name: 'LIVE-1', well_type: 'producer' }, well_id: 'w-live',
    prod_date: iso(dayOf('2024-11-20')), oil_stb: 1, water_stb: 1, gas_mscf: 1, hours_on: 24, winj_stb: 0, ginj_mscf: 0 });
  const ex = S.detectExceptions(S.buildWellSeries(rr)).exceptions.filter((e) => e.wellName === 'GONE-1');
  w(`derived stale severity sweep, gap = ${gap} days against a staleDays of ${S.DEFAULT_SURVEILLANCE_SETTINGS.staleDays}: `
    + `${ex.map((e) => `${e.severity} ${e.type} value ${e.value} baseline ${e.baseline}`).join('; ') || '(none)'}, exceptions on that well = ${ex.length}`);
});
w('# (e) A CLAUSE THAT CAN NEVER BE TRUE. The gas-oil ratio gate reads');
w('#     `gorRecent.count && gorBase.count && gorBase.mean > 0 && (base.mean == null');
w('#     || base.mean >= minOilRate)`. derivePoint sets gor only where oil is above');
w('#     zero and sets oil with `row.oil_stb || 0`, so oil is ALWAYS a finite');
w('#     number on every point. `base` is the mean of oil over the SAME window, so');
w('#     base.mean is null only when the window holds no points at all, and in that');
w('#     case gorBase.count is zero and the gate has already shut two clauses');
w('#     earlier. The escape hatch is unreachable.');
const gateProbe = [];
[[0, 0], [0, 100], [3, 0], [3, 100], [900, 500]].forEach(([o, g]) => {
  const rr = [];
  for (let k = 39; k >= 0; k -= 1) {
    rr.push({ well: { id: 'w-gate', name: 'GATE-1', well_type: 'producer' }, well_id: 'w-gate',
      prod_date: iso(dayOf('2024-11-20') - k), oil_stb: o, water_stb: 10, gas_mscf: g, hours_on: 24, winj_stb: 0, ginj_mscf: 0 });
  }
  const pts = S.buildWellSeries(rr)[0].points;
  const finiteGor = pts.filter((p) => Number.isFinite(p.gor)).length;
  const finiteOil = pts.filter((p) => Number.isFinite(p.oil)).length;
  gateProbe.push(finiteGor > 0 && finiteOil === 0);
  w(`derived unreachable clause probe, oil ${o} stb and gas ${g} Mscf every day: points with a finite gor = ${finiteGor}, `
    + `points with a finite oil = ${finiteOil}, a window with a gor and no oil = ${yn(finiteGor > 0 && finiteOil === 0)}`);
});
w(`derived unreachable clause probe: constructions in which the escape hatch could fire = ${gateProbe.filter(Boolean).length} of ${gateProbe.length}`);
w('');

// ============================================================ SECTION 25
w('# SECTION 25: A REFUSAL THAT NAMES THE WRONG LIMIT, AND A PRINT THAT GIVES TWO');
w('# OPPOSITE VERDICTS THE SAME NUMBER');
w('# Expert m04. DERIVED demonstrations on the lift advisor, whose refusals are the');
w('# most quotable in the domain because each one is a sentence a planner pastes.');
w('# (a) THE GAS LIFT REFUSAL NAMES A SURFACE PRESSURE THE CALLER NEVER SET.');
w('#     designGasLift reads `num(facility?.injectionPsig, 900)` and then prints');
w('#     that value in the refusal, so a caller who supplied no facility at all is');
w('#     told the answer at a pressure it never chose, in a sentence whose advice is');
w('#     "more surface pressure".');
[['no facility object at all', undefined], ['an empty facility', {}], ['injectionPsig 250', { injectionPsig: 250 }],
  ['injectionPsig the string "1200"', { injectionPsig: '1200' }], ['injectionPsig the string "900 psig"', { injectionPsig: '900 psig' }],
  ['injectionPsig the string "high"', { injectionPsig: 'high' }], ['injectionPsig null', { injectionPsig: null }]].forEach(([lab, fac]) => {
  const r = LA.designGasLift({
    model: teachModel(), targetRate: 700, wctPct: 55, gorScfStb: 640, whp: 190,
    facility: fac, chain: gasChain({ injectionPointFromTraverse: () => ({ depthFt: 0 }) }),
  });
  w(`derived gas lift refusal, ${lab}: ok = ${yn(r.ok)}, reason: ${r.reason}`);
});
w('# AND THE SAME CALL WITH A PLACEMENT THAT DOES SUCCEED, so the two can be read');
w('# side by side. The stub chain is this wave own and its answers are teaching');
w('# numbers, not published ones.');
[['no facility object at all', undefined], ['injectionPsig 1400 and injectionMscfd 850', { injectionPsig: 1400, injectionMscfd: 850 }]].forEach(([lab, fac]) => {
  const r = LA.designGasLift({
    model: teachModel(), targetRate: 700, wctPct: 55, gorScfStb: 640, whp: 190,
    facility: fac, chain: gasChain(),
  });
  w(`derived gas lift success, ${lab}: ok = ${yn(r.ok)}, rate = ${f(r.rateStbd, 6)} stb/d, equipment = ${r.equipment}`);
  (r.figures || []).forEach((fg) => w(`derived gas lift success, ${lab}: figure ${fg.label} = ${fg.value}`));
});
w(`derived num coercion, num("900 psig", 0) = ${LA.num('900 psig', 0)}, num("1.2e3", 0) = ${LA.num('1.2e3', 0)}, `
  + `num("high", 900) = ${LA.num('high', 900)}, num(true, 900) = ${LA.num(true, 900)}, num(null, 900) = ${LA.num(null, 900)}`);
w(`derived psigToPsia: psigToPsia(900) = ${f(LA.psigToPsia(900), 6)} psia, `
  + `psigToPsia(0) = ${f(LA.psigToPsia(0), 6)} psia, psigToPsia(undefined) = ${Number.isNaN(LA.psigToPsia(undefined)) ? 'NaN' : f(LA.psigToPsia(undefined), 6)}`);
w('# parseFloat eats a unit suffix, so "900 psig" is silently accepted as a number');
w('# and "high" is silently replaced by the default. Both reach the same refusal');
w('# sentence and neither substitution is reported. The equipment string on a');
w('# SUCCESSFUL run carries the same defaulted pressure, so a design a caller never');
w('# specified a facility for still reads as though it had.');
w('# (b) THE ROD LOADING GUARD PRINTS THE SAME NUMBER FOR AN ACCEPTED TRIAL AND FOR');
w('#     A REJECTED ONE. The guard fires STRICTLY above 100 per cent of the Goodman');
w('#     allowable. An accepted trial prints its loading rounded to a WHOLE number;');
w('#     a rejected one prints it to ONE DECIMAL, so the two sides of the guard');
w('#     print at different precisions and both can print a hundred. Read the');
w('#     sweep: 99.5 accepted, 100 accepted, 100.0000001 rejected, and all three');
w('#     print a hundred.');
[99.4, 99.5, 99.9, 100, 100.0000001, 100.04, 100.05, 100.3, 101].forEach((L) => {
  const outs = LA.ROD_TRIALS.map(() => ({ producedBpd: 900, loadingPct: L }));
  const r = LA.designRodPump({ model: teachModel(), targetRate: 800, wctPct: 40, gorScfStb: 640, whp: 190, chain: rodChain(outs) });
  w(`derived rod loading boundary, worst section at ${f(L, 7)} per cent: ok = ${yn(r.ok)}, `
    + `${r.ok ? `reported as "${r.figures.find((x) => x.label === 'Rod loading').value}"` : `rejected, reason: ${r.attempts[0].reason}`}`);
});
(() => {
  const acc = [99.44, 99.45, 99.5, 99.9, 100].filter((x) => Number(x.toFixed(0)) === 100);
  const rej = [100.0000001, 100.02, 100.04, 100.05, 100.06, 100.09, 100.1].filter((x) => Number(x.toFixed(1)) === 100.0);
  w(`derived rod loading print collision: accepted loadings that print as a whole 100 = ${j(acc)}, `
    + `rejected loadings that print as 100.0 = ${j(rej)}, so the widest accepted loading printing a hundred is `
    + `${f(Math.max(...acc), 6)} and the widest rejected one is ${f(Math.max(...rej), 6)}`);
})();
w('# (c) THE SAME GUARD FAILS OPEN. `const loading = d.worstSection ?');
w('#     d.worstSection.loadingPct : NaN` and then `if (loading > 100)`. NaN > 100');
w('#     is false, so a design with NO worst section is accepted as workable, and');
w('#     its loading is then printed by `loading.toFixed(0)`.');
const failOpen = [
  { producedBpd: 200, loadingPct: 40 }, { producedBpd: 340, loadingPct: 60 },
  { producedBpd: 520, loadingPct: 80 }, { producedBpd: 900, loadingPct: null },
  { producedBpd: 1400, loadingPct: 120 }, { producedBpd: 2200, loadingPct: 140 },
];
const foRes = LA.designRodPump({ model: teachModel(), targetRate: 800, wctPct: 40, gorScfStb: 640, whp: 190, chain: rodChain(failOpen) });
w(`derived rod loading fails open: ok = ${yn(foRes.ok)}, rate reported = ${f(foRes.rateStbd, 9)} bbl/d, `
  + `equipment = ${foRes.equipment}, rod loading printed as "${foRes.figures.find((x) => x.label === 'Rod loading').value}"`);
w(`derived rod loading fails open: rungs tried = ${foRes.triedCount}, rungs thrown out = ${foRes.attempts.length}, `
  + `their reasons: ${foRes.attempts.map((a) => a.reason).join(' | ') || 'none'}`);
const failClosed = failOpen.map((o) => (o.loadingPct === null ? { ...o, loadingPct: 101 } : o));
const fcRes = LA.designRodPump({ model: teachModel(), targetRate: 800, wctPct: 40, gorScfStb: 640, whp: 190, chain: rodChain(failClosed) });
w(`derived rod loading, the SAME ladder with the unknown loading read as a failure instead: ok = ${yn(fcRes.ok)}, `
  + `${fcRes.ok ? `rate = ${f(fcRes.rateStbd, 9)} bbl/d` : `refusal: ${fcRes.reason}`}`);
w('# The rung the engine chose is the one rung whose loading nobody knows, and the');
w('# two rungs above it were thrown out for being overloaded. Read as a failure');
w('# instead, the whole ladder refuses. A guard that lets an unknown through as a');
w('# pass is the trusting half of a disagreeing function.');
w('# (d) AND ONE STEP FURTHER, THE ADVISOR BLAMES THE CHAIN FOR ITS OWN CRASH. A');
w('#     worstSection object with no loadingPct on it is TRUTHY, so `loading` is');
w('#     undefined, `undefined > 100` is false, the rung is accepted, and');
w('#     `undefined.toFixed(0)` throws inside the advisor. runDesignPass catches it');
w('#     and reports it as a failure of the design chain.');
const crashChain = {
  runRodDesign: () => ({
    ok: true, errors: [],
    design: {
      producedBpd: 900, plungerStrokeIn: 50, pprlLb: 14200,
      balance: { peakTorqueInLb: 286000 }, gas: { fillage: 0.83 }, warnings: [],
      worstSection: { label: '7/8 in' },
    },
  }),
};
const crashPass = LA.runDesignPass({
  model: teachModel(), targetRate: 800, wctPct: 40, gorScfStb: 640, whp: 190, facility: {}, chain: crashChain,
});
const crashRod = crashPass.results.find((r) => r.id === 'rodPump');
w(`derived rod loading crash: pass ok = ${yn(crashPass.ok)}, rod pump ok = ${yn(crashRod.ok)}, reason: ${crashRod.reason}`);
w('# (e) A REFUSAL THAT REPORTS NaN AS AN ACHIEVED RATE. When no rung meets the');
w('#     target the shortfall reports the rung that got closest, chosen by a');
w('#     comparison that is false for NaN on both sides, so a ladder whose produced');
w('#     rates are all unknown reports the FIRST rung and prints its rate as NaN.');
const nanLadder = LA.ROD_TRIALS.map(() => ({ producedBpd: NaN, loadingPct: 50 }));
const nanRes = LA.designRodPump({ model: teachModel(), targetRate: 800, wctPct: 40, gorScfStb: 640, whp: 190, chain: rodChain(nanLadder) });
w(`derived rod ladder with unknown rates: ok = ${yn(nanRes.ok)}, shortfall achievedBpd = ${Number.isNaN(nanRes.shortfall?.achievedBpd) ? 'NaN' : f(nanRes.shortfall?.achievedBpd, 6)}, `
  + `shortfall targetBpd = ${f(nanRes.shortfall?.targetBpd, 6)}`);
w(`derived rod ladder with unknown rates: reason: ${nanRes.reason}`);
w('');

// ============================================================ SECTION 26
w('# SECTION 26: THE DIALS THAT DECIDE THE ANSWER');
w('# Expert m04. PUBLISHED then DERIVED. Every module in this course has settings');
w('# that move a printed number more than the data does, and none of the returns');
w('# names the setting that decided it.');
w('# (a) includeInvalidTests. The QC verdict is honoured only because groupTests');
w('#     reads it; turn the dial and every failed test carries its well again.');
w(`golden allocation at the default: diagnostics ${j(GA.allocation.diagnosticCounts)}, theoretical oil = ${f(GA.allocation.grand.theoretical_oil, 9)} stb`);
w(`golden allocationWithInvalidTests: diagnostics ${j(GA.allocationWithInvalidTests.diagnosticCounts)}, `
  + `theoretical oil = ${f(GA.allocationWithInvalidTests.grand.theoretical_oil, 9)} stb, `
  + `change in theoretical oil = ${f(GA.allocationWithInvalidTests.grand.theoretical_oil - GA.allocation.grand.theoretical_oil, 9)} stb`);
w('# (b) maxTestAgeDays, AND THE TWO CASES BELOW DISAGREE, WHICH IS THE POINT.');
w('#     On the TEACHING sweep, ageing a test out does not reduce the allocated');
w('#     total: the metered volume is unchanged and the same barrels are spread');
w('#     over fewer wells, so every surviving well is credited with more, and the');
w('#     allocated oil holds at one figure all the way down the sweep.');
w('#     ON THE PUBLISHED CASE IT DOES REDUCE IT, and the line below says so:');
w('#     allocated oil falls against the 180 day run. The difference is no_basis.');
w('#     A date on which NOTHING can carry a share has no basis to divide by, so');
w('#     its metered volume is not redistributed, it is LEFT OUT, and the metered');
w('#     barrels for that date leave the allocation altogether. allocationAged120');
w('#     is the only published case that raises no_basis, and that is exactly why');
w('#     it is the only one whose allocated total moves. An earlier version of');
w('#     this comment stated the teaching behaviour as though it were general and');
w('#     was contradicted by the generated line directly beneath it.');
w(`golden allocationAged120: theoretical oil = ${f(GA.allocationAged120.grand.theoretical_oil, 9)} stb against `
  + `${f(GA.allocation.grand.theoretical_oil, 9)} stb at 180 days, wells taking a share = ${GA.allocationAged120.wells.length} against ${GA.allocation.wells.length}, `
  + `allocated oil = ${f(GA.allocationAged120.grand.allocated_oil, 9)} stb against ${f(GA.allocation.grand.allocated_oil, 9)} stb`);
w(`golden allocationAged120: diagnostics ${j(GA.allocationAged120.diagnosticCounts)}, and it is the only published case that raises no_basis`);
[365, 240, 180, 150, 120, 90, 60, 45, 30, 14, 7, 1, 0].forEach((m) => {
  const al = A.computeAllocation({ wells: TWELLS, tests: TTESTS, ledger: LEDGER, totals: TTOTALS, settings: { maxTestAgeDays: m } });
  const dc = {};
  al.diagnostics.forEach((d) => { dc[d.code] = (dc[d.code] || 0) + 1; });
  w(`teaching OGUTA maxTestAgeDays sweep, ${m} days: wells taking a share = ${al.wells.length}, `
    + `theoretical oil = ${f(al.totals.theoretical.oil, 9)} stb, allocated oil = ${f(al.totals.allocated.oil, 9)} stb, `
    + `unallocated metered oil = ${f(al.totals.measured.oil - al.totals.allocated.oil, 9)} stb, diagnostics ${j(dc)}`);
});
w('# READ THE ZERO ROW AGAINST THE ONE-DAY ROW. Tightening the limit from one day');
w('# to zero days does not tighten it further, it turns the check off, so the');
w('# strictest-looking setting on the dial is the loosest behaviour in the module.');
w('# (c) useUptime. Turning the uptime off removes the only thing that distinguishes');
w('#     a well that ran all day from a well that ran an hour.');
w(`golden allocationNoUptime: theoretical oil = ${f(GA.allocationNoUptime.grand.theoretical_oil, 9)} stb against `
  + `${f(GA.allocation.grand.theoretical_oil, 9)} stb with uptime, diagnostics ${j(GA.allocationNoUptime.diagnosticCounts)}`);
w('# (d) basis. On the ledger basis the wells own meters ARE the split and the');
w('#     tests are not read at all, so a field with no tests can still be');
w('#     reconciled and a field whose tests are wrong is reconciled to a different');
w('#     answer.');
w(`golden allocationLedgerBasis: theoretical oil = ${f(GA.allocationLedgerBasis.grand.theoretical_oil, 9)} stb, `
  + `wells taking a share = ${GA.allocationLedgerBasis.wells.length}, diagnostics ${j(GA.allocationLedgerBasis.diagnosticCounts)}`);
w('# (e) THE FACTOR WARNING BAND. Nothing clamps a factor into it; the band raises a');
w('#     diagnostic and the number is reported as it fell out, which is the design');
w('#     decision that makes an allocation defensible.');
[0.4, 0.6, 0.69, 0.7, 0.71, 1.0, 1.29, 1.3, 1.31, 2.5].forEach((factor) => {
  const al = A.computeAllocation({
    wells: [{ id: 'b-1', name: 'BAND-1', well_type: 'producer' }],
    tests: [{ id: 'bt', well_id: 'b-1', test_date: '2024-03-01', oil_rate_stbd: 1000, is_valid: true }],
    ledger: [{ well_id: 'b-1', prod_date: '2024-03-05', oil_stb: 1000, hours_on: 24 }],
    totals: [{ total_date: '2024-03-05', oil_stb: 1000 * factor }],
  });
  w(`derived factor band, metered over theoretical = ${f(factor, 6)}: reported factor = ${f(al.days[0].factors.oil, 12)}, `
    + `allocated oil = ${f(al.days[0].allocated.oil, 9)} stb, diagnostics ${j(al.diagnostics.map((d) => d.code))}`);
});
w('# (f) THE DECIMATOR CAP, Section 5, is the same shape of dial: a number that');
w('#     names a maximum and does not enforce one.');
w('');

// ============================================================ SECTION 27
w('# SECTION 27: THE DECLINE OVERLAY, AND A b TREATED AS FALSY');
w('# Expert m03 owns the falsy exponent and Expert m04 owns the dial. PUBLISHED then');
w('# DERIVED. Decline is NOT re-derived in surveillance:');
w('# the overlay calls the CANONICAL Arps engine, and a second decline');
w('# implementation would be a second thing to be wrong. What surveillance owns is');
w('# the SERIES it hands the fitter and the effective decline it reads off the fit.');
w(`golden syntheticDecline: qi = ${f(GS.syntheticDecline.truth.qi, 6)} stb/d, Di = ${GS.syntheticDecline.truth.Di} per day, `
  + `b = ${GS.syntheticDecline.truth.b}, days = ${GS.syntheticDecline.truth.nDays}, start ${GS.syntheticDecline.truth.start}`);
w(`golden syntheticDecline: firstRate = ${f(GS.syntheticDecline.firstRate, 9)} stb/d, lastRate = ${f(GS.syntheticDecline.lastRate, 12)} stb/d, `
  + `effectivePct = ${f(GS.syntheticDecline.effectivePct, 12)}`);
w('# The decline gate is against a series SYNTHESISED from known parameters, so the');
w('# truth is known by construction and no reimplementation of the fitter is');
w('# involved at all.');
GS.effectiveDecline.forEach((c, i) => {
  w(`golden effectiveDecline case ${i + 1}: Di = ${c.Di} per day, b = ${c.b}, modelType ${c.modelType}, `
    + `effectivePct = ${f(c.effectivePct, 12)}, engine re-run = ${f(S.annualEffectiveDecline(c.Di, c.b, c.modelType), 12)}`);
});
w('# THE THREE BRANCHES AND THE ONE CLAUSE THAT DECIDES THEM.');
w('#   `if (modelType === "Exponential" || !b)` takes the exponential form');
w('#   `if (modelType === "Harmonic" || b === 1)` takes the harmonic form');
w('#   everything else takes the hyperbolic form');
w('# `!b` IS TRUE FOR NaN. So a hyperbolic fit whose exponent came back as NaN, or');
w('# as null, or as undefined, silently returns the EXPONENTIAL answer rather than a');
w('# refusal or a NaN, and the exponential answer at the same Di is a real number a');
w('# reader has no way to distrust.');
[['0.5, an ordinary hyperbolic', 0.5], ['1, the harmonic limit', 1], ['0, the exponential limit', 0],
  ['NaN', NaN], ['null', null], ['undefined', undefined], ['the string "0.5"', '0.5'],
  ['-0.5, physically impossible', -0.5], ['5, far past any real b', 5], ['1e-9', 1e-9]].forEach(([lab, b]) => {
  const v = S.annualEffectiveDecline(0.0015, b, 'Hyperbolic');
  w(`derived annualEffectiveDecline, Di 0.0015 per day and b = ${lab}, modelType Hyperbolic: `
    + `${v === null ? 'null' : Number.isNaN(v) ? 'NaN' : f(v, 12) + ' per cent'}`);
});
w(`derived annualEffectiveDecline, the exponential answer at the same Di for comparison: `
  + `${f(S.annualEffectiveDecline(0.0015, 0, 'Exponential'), 12)} per cent`);
w('# A NEGATIVE b IS NOT REFUSED EITHER. `(1 + b Di t) ** (-1/b)` with b = -0.5 is a');
w('# NEGATIVE base raised to the power 2, which is a perfectly ordinary positive');
w('# number, so an impossible exponent returns a plausible percentage.');
[[0.01, -0.5], [0.005, -0.5], [0.0015, -0.5], [0.01, -0.25], [0.001, -2]].forEach(([Di, b]) => {
  const inner = 1 + b * Di * 365;
  const v = S.annualEffectiveDecline(Di, b, 'Hyperbolic');
  w(`derived negative b, Di = ${Di} per day and b = ${b}: the bracket (1 + b Di t) = ${f(inner, 12)}, `
    + `the exponent -1/b = ${f(-1 / b, 6)}, result = ${v === null ? 'null' : Number.isNaN(v) ? 'NaN' : f(v, 12) + ' per cent'}`);
});
w('# WHAT IS GUARDED, and it is guarded properly: Di.');
[[0, 0.5], [-0.001, 0.5], [NaN, 0.5], [null, 0.5], [1e-9, 0.5]].forEach(([Di, b]) => {
  const v = S.annualEffectiveDecline(Di, b, 'Hyperbolic');
  w(`derived Di guard, Di = ${String(Di)} and b = ${b}: ${v === null ? 'null, refused' : f(v, 12) + ' per cent'}`);
});
w('# THE SERIES THE FITTER IS HANDED. rateSeriesForFit drops every point whose rate');
w('# is not finite and above zero, which on the producing-day basis means it drops');
w('# every shut-in day, INCLUDING a day that produced volume with its hours');
w('# recorded as zero. That day is a contradiction in the ledger and the function');
w('# resolves it by deleting the day.');
const fitPts = [
  { date: '2024-01-01', oil: 900, oilPd: 900 }, { date: '2024-01-02', oil: 0, oilPd: null },
  { date: '2024-01-03', oil: 880, oilPd: 880 }, { date: '2024-01-04', oil: 100, oilPd: null },
  { date: '2024-01-05', oil: 860, oilPd: 860 },
];
w(`derived rateSeriesForFit, producing basis: ${j(S.rateSeriesForFit(fitPts, 'oil', 'producing'))}`);
w(`derived rateSeriesForFit, calendar basis: ${j(S.rateSeriesForFit(fitPts, 'oil', 'calendar'))}`);
w('# THE TEACHING DECLINER, fitted end to end through the canonical engine.');
const o9pts = TWS.find((x) => x.well.id === WELLS.o9.id).points;
[['producing', 'oil'], ['calendar', 'oil'], ['producing', 'gas'], ['producing', 'liquid']].forEach(([basis, stream]) => {
  const fit = S.fitWellDecline(o9pts, { stream, basis, forecastDays: 365 });
  if (fit.insufficient) {
    w(`teaching OGUTA-9 decline, ${stream} on the ${basis} basis: insufficient, points usable = ${fit.fitSeries.length}`);
    return;
  }
  const p = fit.fit.parameters;
  w(`teaching OGUTA-9 decline, ${stream} on the ${basis} basis: points fitted = ${fit.fitSeries.length}, `
    + `modelType ${p.modelType}, qi = ${f(p.qi, 9)}, Di = ${f(p.Di, 12)} per day, b = ${f(p.b, 9)}, `
    + `annualEffectiveDecline = ${f(S.annualEffectiveDecline(p.Di, p.b, p.modelType), 12)} per cent`);
});
w(`teaching OGUTA-9: the ledger was built at a nominal Di of ${TF.o9Di} per day and a first-day rate of ${TF.o9Qi} stb/d, `
  + `so the fit recovering those is the gate on the assembly and not an independent result`);
const o17fitPts = TWS.find((x) => x.well.id === WELLS.o17.id).points;
const o17fit = S.fitWellDecline(o17fitPts, { stream: 'oil', basis: 'producing', forecastDays: 365 });
w(`teaching OGUTA-17 decline on the rows it DID file: points fitted = ${o17fit.fitSeries.length}, `
  + `modelType ${o17fit.fit.parameters.modelType}, Di = ${f(o17fit.fit.parameters.Di, 12)} per day, `
  + `annualEffectiveDecline = ${f(S.annualEffectiveDecline(o17fit.fit.parameters.Di, o17fit.fit.parameters.b, o17fit.fit.parameters.modelType), 12)} per cent`);
w('# AND THE REFUSALS, which are honest. A series with fewer than three usable');
w('# points, a flat series and a RISING series all come back insufficient rather');
w('# than as a fitted decline of zero or of a negative number.');
[['two points', [{ date: '2024-01-01', oil: 900, oilPd: 900 }, { date: '2024-01-02', oil: 880, oilPd: 880 }]],
  ['thirty flat points', Array.from({ length: 30 }, (_, i) => ({ date: iso(dayOf('2024-01-01') + i), oil: 900, oilPd: 900 }))],
  ['thirty rising points', Array.from({ length: 30 }, (_, i) => ({ date: iso(dayOf('2024-01-01') + i), oil: 900 + i * 8, oilPd: 900 + i * 8 }))]].forEach(([lab, pts]) => {
  const r = S.fitWellDecline(pts);
  w(`derived fitWellDecline refusal, ${lab}: insufficient = ${yn(!!r.insufficient)}, usable points = ${r.fitSeries.length}`);
});
w('');

// ============================================================ SECTION 28
w('# SECTION 28: DEFERMENTS, AND THE ONE FUNCTION THAT READS THE WALL CLOCK');
w('# Professional m05. PUBLISHED then DERIVED. summarizeDeferments rolls up lost');
w('# production by category, worst first by oil, with open events accruing days to');
w('# asOf. It is the only function in surveillance.js that can give a different');
w('# answer tomorrow on the same data.');
w(`golden deferments: asOf ${GS.deferments.asOf}, events = ${GS.deferments.summary.totals.events}, `
  + `open events = ${GS.deferments.summary.openCount}, total days = ${GS.deferments.summary.totals.days}, `
  + `total oil = ${f(GS.deferments.summary.totals.oil, 6)} stb, total water = ${f(GS.deferments.summary.totals.water, 6)} stb, `
  + `total gas = ${f(GS.deferments.summary.totals.gas, 6)} Mscf`);
GS.deferments.events.forEach((e, i) => {
  w(`golden deferment event ${i + 1}: category ${e.category}, start ${e.start_date}, end ${e.end_date === null ? 'OPEN' : e.end_date}, `
    + `oil = ${f(e.oil_deferred_stb, 6)} stb, water = ${f(e.water_deferred_stb, 6)} stb, gas = ${f(e.gas_deferred_mscf, 6)} Mscf`);
});
GS.deferments.summary.byCategory.forEach((c, i) => {
  w(`golden deferment category ${i + 1}: ${c.category}, events = ${c.events}, days = ${c.days}, `
    + `oil = ${f(c.oil, 6)} stb, water = ${f(c.water, 6)} stb, gas = ${f(c.gas, 6)} Mscf`);
});
const gDef = S.summarizeDeferments(GS.deferments.events, GS.deferments.asOf);
w(`derived deferments, engine re-run at the published asOf: events = ${gDef.totals.events}, days = ${gDef.totals.days}, `
  + `oil = ${f(gDef.totals.oil, 6)} stb, openCount = ${gDef.openCount}, categories = ${gDef.byCategory.map((c) => c.category).join(' ')}`);
w('# THE SORT IS BY OIL DESCENDING AND THEN BY DAYS, so the category that cost the');
w('# most oil is first whatever the event count, which is the right order for a');
w('# loss review and the wrong one for a maintenance backlog.');
w('# THE DAY COUNT IS INCLUSIVE AND IS CLAMPED AT ONE. `Math.max(1, endDay -');
w('# startDay + 1)`, so an event that starts and ends on the same day is one day,');
w('# and an event whose end date is BEFORE its start date is ALSO one day and');
w('# nothing says the dates were the wrong way round.');
[['same day', '2024-06-10', '2024-06-10'], ['three days', '2024-06-10', '2024-06-12'],
  ['end one day before the start', '2024-06-10', '2024-06-09'], ['end a month before the start', '2024-06-10', '2024-05-10'],
  ['a full month', '2024-06-01', '2024-06-30']].forEach(([lab, s0, s1]) => {
  const r = S.summarizeDeferments([{ category: 'Demo', start_date: s0, end_date: s1, oil_deferred_stb: 100 }], '2024-11-20');
  w(`derived deferment day count, ${lab} (${s0} to ${s1}): days = ${r.totals.days}, events = ${r.totals.events}`);
});
w('# AND THE WALL CLOCK. An OPEN event accrues days to asOf, and when asOf is');
w('# omitted the function substitutes new Date().toISOString().slice(0, 10), which');
w('# is TODAY. Every other window in this module anchors on the FIELD latest ledger');
w('# date precisely so that an old dataset surveils honestly; this one does not,');
w('# and it is the same file that says so in its header.');
const openEvent = [{ category: 'Demo', start_date: '2024-06-01', end_date: null, oil_deferred_stb: 3200 }];
['2024-06-30', '2024-08-31', '2024-11-20', '2025-06-30'].forEach((d) => {
  const r = S.summarizeDeferments(openEvent, d);
  w(`derived open deferment anchored at asOf ${d}: days = ${r.totals.days}, openCount = ${r.openCount}, oil = ${f(r.totals.oil, 6)} stb`);
});
const anchored = S.summarizeDeferments(openEvent, '2024-11-20').totals.days;
const unanchored = S.summarizeDeferments(openEvent).totals.days;
w(`derived open deferment with asOf OMITTED: the day count differs from the anchored one = ${yn(anchored !== unanchored)}, `
  + `and it grows by exactly one for every day that passes = ${yn(unanchored - anchored === (dayOf(new Date().toISOString().slice(0, 10)) - dayOf('2024-11-20')))}`);
w('# READ THE SECOND BOOLEAN CAREFULLY, BECAUSE THE FIRST VERSION OF THIS PROBE');
w('# GOT IT WRONG AND THE WAY IT WAS WRONG IS THE SECTION\'S OWN SUBJECT. It');
w('# compared the drift against Date.now() divided by the milliseconds in a day');
w('# and ROUNDED, which rounds');
w('# the current INSTANT to the nearest day boundary, while the engine floors a');
w('# UTC DATE STRING. The two agree before 12:00 UTC and differ by one after it,');
w('# so the probe reported this property as FALSE for any digest built in the');
w('# afternoon and TRUE for the same digest built in the morning. A check on a');
w('# function that reads the clock was itself reading the clock.');
w('# The unanchored number itself is deliberately NOT printed in this digest,');
w('# because a digest that changes every time it is rebuilt cannot be gated. That');
w('# is the finding stated as a property of the file rather than as a value.');
w('# THE TEACHING FIELD DEFERMENTS, anchored on the field own latest ledger date.');
const TDEF = [
  { category: 'Facility', start_date: '2024-10-14', end_date: '2024-10-18', oil_deferred_stb: 4180, water_deferred_stb: 1290, gas_deferred_mscf: 2420 },
  { category: 'Facility', start_date: '2024-11-02', end_date: '2024-11-03', oil_deferred_stb: 1640, water_deferred_stb: 508, gas_deferred_mscf: 951 },
  { category: 'Well work', start_date: '2024-10-29', end_date: '2024-11-06', oil_deferred_stb: 2960, water_deferred_stb: 651, gas_deferred_mscf: 1391 },
  { category: 'Artificial lift', start_date: '2024-11-11', end_date: null, oil_deferred_stb: 3140, water_deferred_stb: 973, gas_deferred_mscf: 1821 },
  { category: 'Pipeline', start_date: '2024-09-20', end_date: '2024-09-22', oil_deferred_stb: 880, water_deferred_stb: 272, gas_deferred_mscf: 510 },
];
const tDef = S.summarizeDeferments(TDEF, TEX.asOf);
w(`teaching OGUTA deferments, asOf ${TEX.asOf}: events = ${tDef.totals.events}, open events = ${tDef.openCount}, `
  + `days = ${tDef.totals.days}, oil = ${f(tDef.totals.oil, 6)} stb, water = ${f(tDef.totals.water, 6)} stb, gas = ${f(tDef.totals.gas, 6)} Mscf`);
tDef.byCategory.forEach((c, i) => {
  w(`teaching OGUTA deferment category ${i + 1}: ${c.category}, events = ${c.events}, days = ${c.days}, `
    + `oil = ${f(c.oil, 6)} stb, water = ${f(c.water, 6)} stb, gas = ${f(c.gas, 6)} Mscf`);
});
const kpi7 = S.computeKpis(TWS, TFS, { windowDays: 7 });
w(`teaching OGUTA deferments against production: deferred oil = ${f(tDef.totals.oil, 6)} stb over the whole ledger, `
  + `field oil at a 7 day window = ${f(kpi7.oil, 9)} stb/d, so the deferment book is worth `
  + `${f(tDef.totals.oil / kpi7.oil, 9)} days of current field production`);
w('');

// ============================================================ SECTION 29
w('# SECTION 29: ONE RATE, TWO PHASES. THE SCREENING AND THE DESIGN PASS');
w('# Expert m05. PUBLISHED then TEACHING. The surveillance and allocation half of');
w('# this course ends at a rate. The lift half begins at one, and the two modules');
w('# that receive it disagree about WHICH PHASE it is. liftScreening documents');
w('# targetRate as bbl/d of LIQUID; liftAdvisor compares the same input against the');
w('# inflow OIL absolute open flow and hands it to each chain as the oil design');
w('# rate with the water cut supplied separately. The shipped studio passes ONE');
w('# number to both.');
w(`golden screening seam, note: ${GL.seams.targetRateOilVersusLiquid.note}`);
w(`golden screening seam: oil rate = ${f(GL.seams.targetRateOilVersusLiquid.oilRate, 9)} bbl/d at a water cut of `
  + `${f(GL.seams.targetRateOilVersusLiquid.wctPct, 6)} per cent, so the liquid rate is `
  + `${f(GL.seams.targetRateOilVersusLiquid.liquidRate, 12)} bbl/d`);
w(`golden screening seam, read as OIL: scores ${j(GL.seams.targetRateOilVersusLiquid.asOilScores)}, `
  + `order ${GL.seams.targetRateOilVersusLiquid.asOilOrder.join(' ')}, recommended ${GL.seams.targetRateOilVersusLiquid.asOilRecommended.join(' ')}`);
w(`golden screening seam, read as LIQUID: scores ${j(GL.seams.targetRateOilVersusLiquid.asLiquidScores)}, `
  + `order ${GL.seams.targetRateOilVersusLiquid.asLiquidOrder.join(' ')}, recommended ${GL.seams.targetRateOilVersusLiquid.asLiquidRecommended.join(' ')}`);
w('# THE RECOMMENDATION SET IS THE SAME AND THE ORDER IS NOT. On that published');
w('# well the rod pump moves by forty points and changes places with the jet pump,');
w('# on one number read two ways.');
w(`golden screening seam, the missing API case, note: ${GL.seams.missingApiIsHeavy.note}`);
w(`golden screening seam, api known: ${j(GL.seams.missingApiIsHeavy.knownScores)}`);
w(`golden screening seam, api missing: ${j(GL.seams.missingApiIsHeavy.missingScores)}, deltas ${j(GL.seams.missingApiIsHeavy.deltas)}`);
w('# THE TWO COERCION CONVENTIONS FOR ONE QUANTITY, TWO FILES APART. screenLift');
w('# coerces with `Number(x) || 0`, so an absent API is ZERO and zero is heavier');
w('# than any real crude. liftAdvisor.liquidGravity coerces with `num(api, 32)`, so');
w('# an absent API is a 32 degree oil and a stated ZERO is taken literally.');
[[undefined, 'undefined'], [null, 'null'], [0, '0'], [10, '10'], [24.6, '24.6'], [32, '32'], [45, '45']].forEach(([api, lab]) => {
  const sg = LA.liquidGravity({ api, wct: 0 });
  const sc = LS.screenLift({ targetRate: 700, depthFt: 6500, gor: 400, wctPct: 60, bhtF: 210, api });
  w(`derived API coercion, api = ${lab}: liquidGravity at zero water cut = ${f(sg, 12)}, `
    + `screenLift esp = ${sc.find((r) => r.id === 'esp').score}, pcp = ${sc.find((r) => r.id === 'pcp').score}, `
    + `rodPump = ${sc.find((r) => r.id === 'rodPump').score}`);
});
GD.liquidGravity.forEach((c, i) => {
  w(`golden liquidGravity case ${i + 1}: api = ${f(c.api, 6)}, wct = ${f(c.wct, 6)}, sg = ${f(c.sg, 12)}`);
});
w('# SCREENING ON NO INFORMATION AT ALL. An empty input object gives every numeric');
w('# field a zero and every boolean field a TRUE, so the missing numbers read as the');
w('# WORST possible well and the missing booleans read as the BEST possible');
w('# facility, and the matrix returns a confident recommendation either way.');
const emptyScreen = LS.screenLift({});
w(`golden emptyInput: ${j(Object.fromEntries(GL.emptyInput.map((r) => [r.id, r.score])))}, `
  + `recommended ${GL.emptyInput.filter((r) => r.recommended).map((r) => r.id).join(' ')}`);
w(`derived screenLift({}), engine re-run: ${j(Object.fromEntries(emptyScreen.map((r) => [r.id, r.score])))}, `
  + `recommended ${emptyScreen.filter((r) => r.recommended).map((r) => r.id).join(' ')}`);
emptyScreen.find((r) => r.id === 'rodPump').reasons.forEach((rs, i) => {
  w(`derived screenLift({}) rod pump reason ${i + 1}: ${rs.type}: ${rs.text}`);
});
w('# THE FACILITY IS THE OTHER WAY ROUND FROM THE WELL. powerAvailable and');
w('# gasAvailable are read as `inputs?.x !== false`, so an unstated facility is');
w('# fully equipped, and the two dominant deductions in the matrix, sixty points');
w('# each, are the two that silence can never trigger.');
const noFac = LS.screenLift({ powerAvailable: false, gasAvailable: false });
w(`derived screenLift with power and gas stated ABSENT and nothing else: `
  + `${j(Object.fromEntries(noFac.map((r) => [r.id, r.score])))}, recommended ${noFac.filter((r) => r.recommended).map((r) => r.id).join(' ') || '(none)'}`);
w('# THE RECOMMENDATION BAND CAN BE EMPTY, AND NOTHING IN THE RETURN SAYS SO. The');
w('# band is score >= top - 15 AND score > 50, so on a well where the leader itself');
w('# fails to clear fifty every method comes back not recommended and the caller');
w('# gets a ranked list with no answer in it.');
const hardWell = { targetRate: 300, depthFt: 14000, api: 15, gor: 1200, bhtF: 330, wctPct: 50, hasSand: true, isHorizontal: true, isOffshore: true, reservoirPressureLow: true, powerAvailable: false, gasAvailable: false };
const hardScreen = LS.screenLift(hardWell);
w(`derived screenLift on a well that suits nothing: ${j(Object.fromEntries(hardScreen.map((r) => [r.id, r.score])))}, `
  + `recommended = ${hardScreen.filter((r) => r.recommended).length} of ${hardScreen.length}`);
w('# AND THE SCORE IS CLAMPED TO ZERO, so a printed zero means "at or below zero"');
w('# and several wells that are differently impossible print the same zero.');
w('# THE JET PUMP IS DOCKED TWENTY POINTS UNCONDITIONALLY, so eighty is its ceiling');
w('# and it can only be recommended when the leader is at ninety-five or below.');
let jetBest = 0; let jetRec = 0; let jetPts = 0; let jetTopMax = 0;
[30, 150, 400, 900, 3000].forEach((rate) => [1500, 6000, 12000].forEach((dep) => [14, 25, 38].forEach((api) => [0, 600, 2100, 6000].forEach((gor) => [130, 260, 320].forEach((bht) => {
  const r = LS.screenLift({ targetRate: rate, depthFt: dep, api, gor, bhtF: bht, wctPct: 50 });
  const jp = r.find((x) => x.id === 'jetPump');
  jetPts += 1;
  if (jp.score > jetBest) jetBest = jp.score;
  if (jp.recommended) { jetRec += 1; jetTopMax = Math.max(jetTopMax, r[0].score); }
})))));
w(`derived jet pump ceiling over a ${jetPts} point sweep: highest score reached = ${jetBest}, `
  + `points on which it is recommended = ${jetRec}, highest leader score on any of those = ${jetTopMax}`);
w('# WHAT A MODEL-DRIVEN SCREENING NEVER FILLS IN. screeningInputsFromModel returns');
w('# seven fields and leaves six conditions unstated, and every one of the six');
w('# defaults to the favourable reading.');
const fullModel = { tvdMax: 6350, tAt: (t) => 96 + (232 - 96) * (t / 6350), fluidModel: { api: 24.6, gor: 640 }, trajectory: { mdMax: 7400 } };
const bareModel = { tvdMax: 6350, tAt: (t) => 96 + (232 - 96) * (t / 6350), trajectory: { mdMax: 7400 } };
w(`derived screeningInputsFromModel with a fluid description: ${j(LS.screeningInputsFromModel(fullModel, { targetRate: 800, wctPct: 50 }))}`);
w(`derived screeningInputsFromModel with NO fluid description: ${j(LS.screeningInputsFromModel(bareModel, { targetRate: 800, wctPct: 50 }))}`);
const scFull = LS.screenLift(LS.screeningInputsFromModel(fullModel, { targetRate: 800, wctPct: 50 }));
const scBare = LS.screenLift(LS.screeningInputsFromModel(bareModel, { targetRate: 800, wctPct: 50 }));
w(`derived screening from a model with a fluid description: ${j(Object.fromEntries(scFull.map((r) => [r.id, r.score])))}, `
  + `recommended ${scFull.filter((r) => r.recommended).map((r) => r.id).join(' ')}`);
w(`derived screening from the SAME model with no fluid description: ${j(Object.fromEntries(scBare.map((r) => [r.id, r.score])))}, `
  + `recommended ${scBare.filter((r) => r.recommended).map((r) => r.id).join(' ')}`);
w('# THE PUBLISHED ARCHETYPES AND THE MONOTONICITY LEDGER, which is what the oracle');
w('# gates instead of gating a number: no adverse condition may ever RAISE a score.');
GL.archetypes.forEach((a) => {
  w(`golden archetype ${a.id}: inputs ${j(a.inputs)}`);
  w(`golden archetype ${a.id}: scores ${j(Object.fromEntries(a.result.map((r) => [r.id, r.score])))}, `
    + `expected top ${a.expectTop.join(' ')}, recommended ${a.result.filter((r) => r.recommended).map((r) => r.id).join(' ') || '(none)'}`);
});
w(`golden monotonicity base: inputs ${j(GL.monotonicity.base)}, scores ${j(GL.monotonicity.baseScores)}`);
GL.monotonicity.cases.forEach((c) => {
  w(`golden monotonicity, ${c.condition} turned ${yn(c.turnedOn)}: deltas ${j(c.deltas)}`);
});
w('# THE DESIGN PASS AND ITS TWO REFUSALS BEFORE ANY CHAIN RUNS.');
GD.passRefusals.forEach((c) => {
  w(`golden passRefusal ${c.id}: phase ${c.phase || 'none'}, qmax = ${c.qmax === undefined ? 'n/a' : f(c.qmax, 6)}, `
    + `targetRate = ${f(c.targetRate, 6)}, expect ${c.expect}, why: ${c.why}`);
});
w('# THE ABSOLUTE OPEN FLOW REFUSAL IS DISABLED BY A NON-NUMERIC qmax. The pass');
w('# reads `model.ipr.qmax ?? rateAtPwf(model.ipr, 0)` and `??` catches only null');
w('# and undefined, so a NaN open flow passes straight through and');
w('# `targetRate >= NaN` is false. Four design chains then run on a target the well');
w('# cannot deliver.');
[[2480, '2480'], [NaN, 'NaN'], [undefined, 'undefined'], [null, 'null'], [0, '0']].forEach(([q, lab]) => {
  const r = LA.runDesignPass({
    model: teachModel({ ipr: { qmax: q } }), targetRate: 5000, wctPct: 40, gorScfStb: 640,
    whp: 190, facility: {}, chain: {},
  });
  w(`derived AOF refusal, qmax = ${lab} against a target of 5000 stb/d: pass ok = ${yn(r.ok)}, `
    + `${r.ok ? `chains run = ${r.results.length}, methods ${r.results.map((x) => x.id).join(' ')}` : `refused: ${r.errors[0]}`}`);
});
w('# THE POLICY PICKS, PUBLISHED AND SWEPT. A reference stage is chosen by the');
w('# FIRST covering range and the ranges OVERLAP, so inside an overlap the smaller');
w('# housing always wins whether or not it is the nearest best-efficiency point.');
GD.referenceStage.overlapBands.forEach((b) => {
  w(`golden reference stage overlap band ${b.from} to ${b.to} bbl/d: covering stages ${b.stages.join(' ')}, `
    + `picked ${b.picked}, nearest best-efficiency point at the top of the band ${b.nearestBepAtTop}`);
});
[100, 500, 1250, 1450, 1451, 2200, 2500, 3250, 3499, 3500, 3501, 4000, 5600, 5601, 9800, 50000].forEach((q) => {
  const st = LA.pickReferenceStage(q);
  const near = CAT.REFERENCE_STAGES.reduce((a, x) => (Math.abs(x.bepBpd - q) < Math.abs(a.bepBpd - q) ? x : a));
  w(`derived reference stage sweep, duty = ${q} bbl/d: picked ${st.id} with a best-efficiency point at ${st.bepBpd} bbl/d, `
    + `distance = ${f(Math.abs(st.bepBpd - q), 6)} bbl/d; nearest best-efficiency point ${near.id}, `
    + `distance = ${f(Math.abs(near.bepBpd - q), 6)} bbl/d; they agree = ${yn(st.id === near.id)}`);
});
w('# THE MOTOR IS THE SMALLEST FRAME CARRYING THE SHAFT LOAD WITH TWENTY-FIVE PER');
w('# CENT HEADROOM, and when no frame does it falls back to the largest in the');
w('# catalog and says nothing. Above the largest frame the returned motor does not');
w('# meet the stated rule, and past the frame rating it is outright overloaded.');
w(`golden motorFrame: headroom rule = ${GD.catalog.headroom}, largest frame = ${GD.motorFrame.largestFrameHp} hp, `
  + `headroom lost above a shaft of ${f(GD.motorFrame.headroomLostAboveShaftHp, 6)} hp, `
  + `overloaded above ${f(GD.motorFrame.overloadedAboveShaftHp, 6)} hp`);
GD.motorFrame.sweep.forEach((c) => {
  w(`golden motorFrame probe: shaft = ${f(c.shaftHp, 6)} hp, frame = ${c.hp} hp, actual headroom = ${f(c.actualHeadroom, 12)}, `
    + `meets the rule = ${yn(c.meetsHeadroom)}, overloaded = ${yn(!!c.overloaded)}`);
});
[48, 48.1, 120, 200, 300, 319, 320, 321, 350, 400, 401, 500, 900].forEach((hp) => {
  const m = LA.pickMotorFrame(hp);
  w(`derived motor sweep, shaft = ${f(hp, 1)} hp: frame ${m.id} at ${m.hp} hp, headroom = ${f(m.hp / hp, 12)}, `
    + `meets the 1.25 rule = ${yn(m.hp >= hp * 1.25)}, overloaded = ${yn(m.hp < hp)}`);
});
w('# THE PLUNGER GAS-LIQUID RATIO, which is the one place in the domain where a');
w('# water cut is CLAMPED rather than refused. Every point of water cut is gas the');
w('# cycle no longer has per barrel it must lift, and at a water cut of one there is');
w('# no oil to carry the gas at all, so the fraction is held just under one.');
GD.plungerGlr.forEach((c, i) => {
  w(`golden plungerGlr case ${i + 1}: targetRate = ${f(c.targetRate, 6)} stb/d, gor = ${f(c.gorScfStb, 6)} scf/stb, `
    + `wctPct = ${f(c.wctPct, 6)}, wctFrac = ${f(c.wctFrac, 6)}, liquidBpd = ${f(c.liquidBpd, 9)}, glr = ${f(c.glrScfBbl, 12)} scf/bbl`);
});
[0, 25, 50, 75, 90, 95, 99, 99.9, 100, 120, -10].forEach((wct) => {
  const g = LA.plungerWellGlr({ targetRate: 260, gorScfStb: 1450, wctPct: wct });
  w(`derived plungerGlr sweep, targetRate 260 stb/d of oil at gor 1450 scf/stb, wctPct = ${f(wct, 1)}: `
    + `wctFrac = ${f(g.wctFrac, 9)}, liquidBpd = ${f(g.liquidBpd, 9)}, glr = ${f(g.glrScfBbl, 12)} scf/bbl`);
});
w('# A WATER CUT OF 100 AND A WATER CUT OF 120 RETURN THE SAME ANSWER, and so do a');
w('# water cut of 99.9 and a water cut of 100. The clamp is silent and there is no');
w('# flag in the return that says a stated condition was overwritten.');
w(`derived plungerGlr with a zero target rate: ${j(LA.plungerWellGlr({ targetRate: 0, gorScfStb: 1450, wctPct: 50 }))}`);
w('# A well making nothing comes back with the full gas-oil ratio as its');
w('# gas-liquid ratio, because the guarded branch returns gorScfStb unchanged.');
w('# THE RECONCILIATION, AS A FULL FOUR-WAY TRUTH TABLE.');
GD.truthTable.forEach((c, i) => {
  w(`golden truthTable row ${i + 1}: hasEngine = ${yn(c.hasEngine)}, hasDesign = ${yn(c.hasDesign)}, `
    + `designOk = ${yn(c.designOk)}, recommended = ${yn(c.recommended)}, verdict ${c.verdict}`);
});
const tt = new Set(GD.truthTable.map((c) => c.verdict));
w(`derived reconcile verdicts reachable over the published truth table = ${[...tt].join(' ')}, count = ${tt.size}`);
w('# reconcile INITIALISES its verdict to the string "screened" and then assigns in');
w('# every branch of an exhaustive if-else chain, so that initial value is dead and');
w('# no input can produce it. It is the sixth name in a five-verdict function.');
w(`golden reconcile scenario, why: ${GD.reconcile.why}`);
w(`golden reconcile scenario: screening ${j(Object.fromEntries(GD.reconcile.screening.map((s) => [s.id, s.score])))}, `
  + `design ok ${j(GD.reconcile.design)}`);
GD.reconcile.expected.rows.forEach((r, i) => {
  w(`golden reconcile row ${i + 1}: ${r.id}, score = ${r.score}, designOk = ${yn(r.designOk)}, verdict ${r.verdict}`);
});
w(`golden reconcile: disagreements ${GD.reconcile.expected.disagreements.join(' ')}, workable ${GD.reconcile.expected.workable.join(' ')}, `
  + `ranked ${GD.reconcile.expected.ranked.join(' ')}`);
const notRun = LA.reconcile({ screening: [{ id: 'esp', label: 'ESP', hasEngine: true, score: 90, recommended: true }], designPass: null });
w(`derived reconcile with no design pass at all: verdict ${notRun.rows[0].verdict}, note = ${notRun.rows[0].note === null ? 'null' : `"${notRun.rows[0].note}"`}, `
  + `workable = ${notRun.workable.length}, disagreements = ${notRun.disagreements.length}`);
w('# notRun is the one verdict of the six that carries NO note, and it is the one');
w('# that means "nobody ran the design", which is the verdict a reader most needs a');
w('# sentence for.');
w('# THE TEACHING LIFT WELL, fed by the surveillance and allocation layers above it.');
w(`teaching OGUTA lift well conditions: true vertical depth = ${TDEPTH} ft, tubing inside diameter = ${teachModel().vlp.idIn} in, `
  + `API = ${teachModel().fluidModel.api}, gas gravity = ${teachModel().fluidModel.gasSg}, `
  + `wellhead pressure = ${teachModel().vlp.whp} psia, bottomhole temperature = ${f(teachModel().tAt(TDEPTH), 6)} degF, `
  + `wellhead temperature = ${f(teachModel().tAt(0), 6)} degF, inflow absolute open flow = ${teachModel().ipr.qmax} stb/d`);
const liftTarget = lastDay.entries.find((e) => e.wellId === WELLS.o6.id).allocated.oil;
const liftWct = kpi7.watercut * 100;
const liftGor = kpi7.gor;
const tglr = LA.plungerWellGlr({ targetRate: liftTarget, gorScfStb: liftGor, wctPct: liftWct });
w(`teaching OGUTA lift handoff: target rate = ${f(liftTarget, 9)} bbl/d, taken from the last allocated day for OGUTA-6, `
  + `water cut = ${f(liftWct, 9)} per cent and gas-oil ratio = ${f(liftGor, 9)} scf/stb, both from the seven-day field KPIs`);
w(`teaching OGUTA lift handoff: read as OIL the liquid the method must move is ${f(tglr.liquidBpd, 9)} bbl/d, `
  + `which is ${f(tglr.liquidBpd / liftTarget, 12)} times the number handed over, `
  + `and the gas-liquid ratio a plunger cycle would see is ${f(tglr.glrScfBbl, 12)} scf/bbl`);
const tScreenOil = LS.screenLift({ targetRate: liftTarget, depthFt: TDEPTH, gor: liftGor, wctPct: liftWct, api: 24.6, bhtF: 232, isDeviated: true });
const tScreenLiq = LS.screenLift({ targetRate: tglr.liquidBpd, depthFt: TDEPTH, gor: liftGor, wctPct: liftWct, api: 24.6, bhtF: 232, isDeviated: true });
const tScreenNoApi = LS.screenLift({ targetRate: liftTarget, depthFt: TDEPTH, gor: liftGor, wctPct: liftWct, bhtF: 232, isDeviated: true });
w(`teaching OGUTA screening read as OIL: ${j(Object.fromEntries(tScreenOil.map((r) => [r.id, r.score])))}, `
  + `order ${tScreenOil.map((r) => r.id).join(' ')}, recommended ${tScreenOil.filter((r) => r.recommended).map((r) => r.id).join(' ') || '(none)'}`);
w(`teaching OGUTA screening read as LIQUID: ${j(Object.fromEntries(tScreenLiq.map((r) => [r.id, r.score])))}, `
  + `order ${tScreenLiq.map((r) => r.id).join(' ')}, recommended ${tScreenLiq.filter((r) => r.recommended).map((r) => r.id).join(' ') || '(none)'}`);
w(`teaching OGUTA screening with NO api stated: ${j(Object.fromEntries(tScreenNoApi.map((r) => [r.id, r.score])))}, `
  + `order ${tScreenNoApi.map((r) => r.id).join(' ')}, recommended ${tScreenNoApi.filter((r) => r.recommended).map((r) => r.id).join(' ') || '(none)'}`);
w(`teaching OGUTA rod pump duty index at ${TDEPTH} ft, rate x depth over a million: on the oil rate = ${f((liftTarget * TDEPTH) / 1e6, 12)}, `
  + `on the liquid rate = ${f((tglr.liquidBpd * TDEPTH) / 1e6, 12)}, and the two bands the rule uses are 3 and 6`);
w(`teaching OGUTA reference stage: at the oil rate ${LA.pickReferenceStage(liftTarget).id}, `
  + `at the liquid rate ${LA.pickReferenceStage(tglr.liquidBpd).id}`);
w(`teaching OGUTA liquid gravity at 24.6 API and a water cut of ${f(kpi7.watercut, 12)}: ${f(LA.liquidGravity({ api: 24.6, wct: kpi7.watercut }), 12)}`);
const tPass = LA.runDesignPass({
  model: teachModel(), targetRate: liftTarget, wctPct: liftWct, gorScfStb: liftGor,
  whp: 190, facility: {}, chain: {},
});
w(`teaching OGUTA design pass with NO chains injected: pass ok = ${yn(tPass.ok)}, methods = ${tPass.results.length}`);
tPass.results.forEach((r) => {
  w(`teaching OGUTA design pass, ${r.id}: ok = ${yn(r.ok)}, reason: ${r.reason}`);
});
const tRec = LA.reconcile({ screening: tScreenOil, designPass: tPass });
w(`teaching OGUTA reconciliation: verdicts ${j(Object.fromEntries(tRec.rows.map((r) => [r.id, r.verdict])))}, `
  + `workable = ${tRec.workable.length}, disagreements = ${tRec.disagreements.length}, ranked ${tRec.ranked.map((r) => r.id).join(' ')}`);
w('# READ THOSE FOUR REFUSALS AGAINST EACH OTHER. Three of them are the SAME');
w('# sentence and say nothing whatever about the well: they mean only that no chain');
w('# was injected. The fourth is the plunger, whose whole chain lives in this');
w('# package and is therefore never injected, so it runs for real and refuses for a');
w('# real reason with two real numbers in it. The reconciliation then reports two');
w('# disagreements and nothing workable, and every one of those verdicts is a');
w('# statement about the ADVISOR CALL and not about the well. A lesson that quotes');
w('# this block must say so.');
w('# THE RATE READ TWO WAYS, SWEPT ACROSS THE BANDS THE RULES USE. The screening');
w('# rules that touch a rate are the ESP bands at 150 and 500 bbl/d, the gas lift');
w('# and plunger ceilings at 200 bbl/d, the progressing cavity floor at 50 and');
w('# ceiling at 2000, the jet pump floor at 100, the rod pump reason threshold at');
w('# 400, and the rod duty index bands at 3 and 6, which are a rate only once a');
w('# depth is fixed.');
w(`derived rod duty index bands as RATES at the teaching depth of ${TDEPTH} ft: the index reaches 3 at `
  + `${f((3 * 1e6) / TDEPTH, 9)} bbl/d and 6 at ${f((6 * 1e6) / TDEPTH, 9)} bbl/d`);
[120, 200, 260, 310, 364, 400, 460, 500, 650, 900, 1240].forEach((oil) => {
  const g = LA.plungerWellGlr({ targetRate: oil, gorScfStb: liftGor, wctPct: liftWct });
  const base = { depthFt: TDEPTH, gor: liftGor, wctPct: liftWct, api: 24.6, bhtF: 232, isDeviated: true };
  const asOil = LS.screenLift({ ...base, targetRate: oil });
  const asLiq = LS.screenLift({ ...base, targetRate: g.liquidBpd });
  const so = Object.fromEntries(asOil.map((r) => [r.id, r.score]));
  const sl = Object.fromEntries(asLiq.map((r) => [r.id, r.score]));
  const delta = Object.fromEntries(Object.keys(so).map((k) => [k, sl[k] - so[k]]));
  w(`teaching OGUTA rate-phase sweep, oil = ${f(oil, 6)} bbl/d gives a liquid of ${f(g.liquidBpd, 9)} bbl/d: `
    + `read as oil ${j(so)}, read as liquid ${j(sl)}, deltas ${j(delta)}, `
    + `recommended as oil ${asOil.filter((r) => r.recommended).map((r) => r.id).join(' ') || '(none)'}, `
    + `as liquid ${asLiq.filter((r) => r.recommended).map((r) => r.id).join(' ') || '(none)'}`);
});
w('# THE DELTAS COLUMN IS THE FINDING. Wherever it is not all zeroes, one number');
w('# read two ways has moved a screening score without one datum about the well');
w('# changing. Four of the six methods move somewhere in that sweep. The largest');
w('# single move belongs to PLUNGER LIFT, which loses forty-five points at an oil');
w('# rate of 200 bbl/d because the liquid rate crosses the ceiling the plunger rule');
w('# is written against; the rod pump moves at three separate rates as the duty');
w('# index crosses its two bands; and at the lowest rate in the sweep the ESP');
w('# GAINS twenty points and joins the recommended set on the liquid reading.');
w('');

// ============================================================ SECTION 30
w('# SECTION 30: WHAT A LESSON MAY AND MAY NOT DO WITH THIS FILE');
w('# Associate m06, Professional m06 and Expert m06. No engine output here, only');
w('# the rules, which is why this section carries no generated row.');
w('#  1. EVERY NUMBER A LESSON WRITES MUST COME FROM THIS FILE. If it is not here,');
w('#     it may not be used. Recomputing it yourself is not a substitute.');
w('#  2. SAY WHICH PROVENANCE LABEL A NUMBER CARRIES. A golden value, a derived');
w('#     sweep point, a derived demonstration and a teaching case are four');
w('#     different kinds of claim and a reader is entitled to know which is in');
w('#     front of them. Never present the OGUTA field, its wells, its tests, its');
w('#     metered totals or any constructed demonstration row as real or as');
w('#     published.');
w('#  3. UNITS, EVERY TIME. A watercut is a FRACTION in surveillance and allocation');
w('#     and a PER CENT in the two lift modules; a ledger volume is a volume over a');
w('#     row and a producing-day rate is a rate; an allocation factor is');
w('#     dimensionless; a nominal decline is per DAY and an effective decline is a');
w('#     per cent over a year; a screening score has no unit and is a ranking');
w('#     device, not a probability.');
w('#  4. A SEVERITY IS NOT A MEASUREMENT. high, medium and info are the names of');
w('#     two threshold crossings, and Section 20 is a case where the same rows give');
w('#     two different severities depending on which of two defensible readings is');
w('#     taken.');
w('#  5. NAME THE FUNCTION. Almost every finding in this course is a disagreement');
w('#     between two functions, and a lesson that says "the engine" instead of');
w('#     naming which of the two has not made the point.');
w('#  6. SAY WHAT THE THING REFUSES TO DO. Every refusal in these four modules is');
w('#     printed in this digest with its exact words. In a course whose subject is');
w('#     a comparison, the refusals are half the teaching.');
w('#  7. NOTHING FROM THE CAPSTONE. The capstone field, its wells, its dates, its');
w('#     rate cycles, its hours table, its decline rates, its meter bias, its tests');
w('#     and its eighteen graded answers are in files this generator never opens,');
w('#     and the BRIEF LEAKAGE BAN lists what a lesson must never write.');
w('#  8. NO EM DASHES AND NO EN DASHES ANYWHERE. Owner rule.');
w('#  9. LENGTH: 420 to 560 words of body prose per lesson, ranked by the manifest');
w('#     est_minutes, which is NOT prose reading time. Measure it with wc -w.');
w('# 10. NO POSITIONAL REFERENCES. A lesson is read on its own.');

process.stdout.write(out.join('\n') + '\n');
