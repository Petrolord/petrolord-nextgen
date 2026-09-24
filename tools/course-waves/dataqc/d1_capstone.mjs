// THE EIGHTEEN GRADED D1 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three fields, six graded values each, every one a RETURN VALUE of the
// vendored engines/dataai/quality.js. A gate that restates the formula
// validates nothing, so nothing here computes a statistic, a limit or a score
// by its own arithmetic: every number is read off an engine result object, and
// discriminate.mjs is where the wrong methods live.
//
//   ODUDU     Associate     is the data fit to use: completeness, coverage,
//                           the index step, water cut, a falling cumulative,
//                           a phase-sum tolerance
//   IKORO     Professional  which values stand apart: z and its ceiling, the
//                           modified z, a Tukey fence, a Hampel threshold,
//                           a Grubbs critical value, a Mahalanobis distance
//   AMASIRI   Expert        has the process changed: phase-one limits, EWMA,
//                           exact EWMA limits, CUSUM, and a weighted scorecard
//
// The datasets are generated here, deterministically, through the canonical
// mulberry32 and randomNormal of lib/stats on stated seeds that differ from the
// teaching dataset's, and every planted defect is asserted to be where the
// question says it is.
//
// Usage:
//   node d1_capstone.mjs            the human table
//   node d1_capstone.mjs --json     the rows make_fields.mjs writes
//   node d1_capstone.mjs --inputs   the three datasets, for oracle_check.py,
//                                   discriminate.mjs and gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST OR THE TEACHING DATASET, and the digest
// generator reads nothing here.
import process from 'node:process';

const ROOT = process.env.D1_ENGINES || '/root/wt-dai-d1-nextgen/packages/engines';
const Q = await import(`${ROOT}/engines/dataai/quality.js`);
const { mulberry32, randomNormal } = await import(`${ROOT}/lib/stats/stats.js`);
const TOLPATH = process.env.D1_TOLERANCE
  || '/root/wt-dai-d1-nextgen/src/components/course/panels/dataqc/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
/** A call this file LABELS a success: no error key, and every top-level number finite. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v)
      && v !== Infinity);
    must(`SUCCESS CARRIES NO NaN: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
const r1 = (x) => Math.round(x * 10) / 10;
const r3 = (x) => Math.round(x * 1000) / 1000;
const r4 = (x) => Math.round(x * 10000) / 10000;
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/* ========================================================= ODUDU, Associate

   ODUDU-2: a 180-sample log at a half-foot step from 6200 ft (density and
   neutron), a 48-entry SCADA time index in minutes at a nominal fifteen
   with timestamp jitter, and a 60-day production sheet. */

const buildOdudu = () => {
  const g = mulberry32(70011);
  const nz = () => randomNormal(g);
  const n = 180;
  const depth = []; const rhob = []; const nphi = [];
  for (let i = 0; i < n; i += 1) {
    depth.push(6200 + 0.5 * i + (i >= 121 ? 0.5 : 0));
    rhob.push(r3(2.41 + 0.06 * nz()));
    nphi.push(r3(0.27 + 0.04 * nz()));
  }
  for (let i = 40; i <= 48; i += 1) rhob[i] = null;
  [100, 131].forEach((i) => { rhob[i] = null; });
  [175, 176, 177].forEach((i) => { rhob[i] = -999.25; });
  for (let i = 60; i <= 63; i += 1) nphi[i] = null;
  nphi[150] = null;
  // The SCADA index, minutes to four places: quarter-hour steps with jitter; entry 17 is lost (a half
  // hour step), two timestamps are written twice, one entry steps back.
  const t = [0];
  for (let i = 1; i < 48; i += 1) t.push(r4(t[i - 1] + 15 + 0.12 * nz()));
  const scada = t.slice();
  scada.splice(17, 1);
  scada.splice(29, 0, scada[29]);
  scada.splice(10, 0, scada[10]);
  const tmp = scada[38]; scada[38] = scada[37]; scada[37] = tmp;
  // Production.
  const days = 60;
  const oil = []; const water = []; const gross = []; const waterCut = []; const cumOil = [];
  let cum = 842000;
  for (let d = 1; d <= days; d += 1) {
    const o = r1(960 * Math.exp(-0.003 * d) + 12 * nz());
    const wc = 0.31 + 0.0011 * d + 0.006 * nz();
    const w = r1((o * wc) / (1 - wc));
    oil.push(o); water.push(w); gross.push(r1(o + w)); waterCut.push(r4(w / (o + w)));
    cum = r1(cum + o); cumOil.push(cum);
  }
  waterCut[22] = waterCut[20]; // day 23 typed from day 21
  cumOil[37] = null; // day 38 lost
  cumOil[38] = r1(cumOil[38] - 9000); // day 39 keyed short by nine thousand
  gross[43] = r1((oil[43] + water[43]) * 1.024); // day 44 carries a truck load
  return {
    well: 'ODUDU-2',
    log: { depth, rhob, nphi, coverageStart: 6210, coverageEnd: 6280, maxStep: 0.5 },
    scada: { minutes: scada },
    production: { oil, water, gross, waterCut, cumOil },
  };
};
const ODUDU = freeze(buildOdudu());

const odComp = success('Odudu completeness of RHOB', Q.completeness({ values: ODUDU.log.rhob }));
must('Odudu: RHOB carries one run of nine and two singles', JSON.stringify(odComp.gapRuns.map((r) => r.length)) === '[9,1,1]', JSON.stringify(odComp.gapRuns));
must('Odudu: the three sentinels are present values', ODUDU.log.rhob.filter((v) => v === -999.25).length === 3, 'three');
const odCov = success('Odudu coverage of NPHI', Q.coverage({
  index: ODUDU.log.depth, values: ODUDU.log.nphi, start: ODUDU.log.coverageStart, end: ODUDU.log.coverageEnd, maxStep: ODUDU.log.maxStep,
}));
must('Odudu: the coverage interval holds three holes (the neutron run, the index skip, the single dropout)', odCov.uncovered.length === 3, JSON.stringify(odCov.uncovered));
const odIdx = success('Odudu indexCheck of the SCADA index', Q.indexCheck({ index: ODUDU.scada.minutes }));
must('Odudu: the SCADA index carries two duplicates and a reversal', odIdx.duplicates === 2 && odIdx.reversals === 1, `${odIdx.duplicates} ${odIdx.reversals}`);
const odWc = success('Odudu waterCutCheck', Q.waterCutCheck({
  waterCut: ODUDU.production.waterCut, oil: ODUDU.production.oil, water: ODUDU.production.water, tolerance: 1e-4,
}));
must('Odudu: exactly day 23 is a water cut mismatch at the reporting tolerance',
  JSON.stringify(odWc.flags.map((f) => [f.index, f.rule])) === '[[22,"water-cut-mismatch"]]', JSON.stringify(odWc.flags));
const odCum = success('Odudu cumulativeCheck', Q.cumulativeCheck({ cumulative: ODUDU.production.cumOil }));
must('Odudu: exactly day 39 falls, measured against day 37', odCum.flags.length === 1 && odCum.flags[0].index === 38
  && odCum.flags[0].previousIndex === 36, JSON.stringify(odCum.flags));
const odPh = success('Odudu phaseSumCheck', Q.phaseSumCheck({
  parts: { oil: ODUDU.production.oil, water: ODUDU.production.water }, total: ODUDU.production.gross,
}));
must('Odudu: exactly day 44 fails the phase sum', odPh.flags.length === 1 && odPh.flags[0].index === 43, JSON.stringify(odPh.flags.map((f) => f.index)));

/* ======================================================= IKORO, Professional

   IKORO-5: seventeen core plugs with one fractured plug; an 80-sample density
   interval to four decimals with a missing sample beside a spike; a 36-row density-neutron
   cloud from one sand with one off-trend row. */

const buildIkoro = () => {
  const g = mulberry32(70022);
  const nz = () => randomNormal(g);
  const core = Array.from({ length: 17 }, () => r3(0.187 + 0.011 * nz()));
  core[11] = 0.246;
  const rhob = Array.from({ length: 80 }, () => r4(2.36 + 0.035 * nz()));
  rhob[57] = 2.6118;
  rhob[56] = null;
  const cloud = Array.from({ length: 36 }, () => {
    const phi = 0.19 + 0.025 * nz();
    return [r3(2.65 - 1.65 * phi + 0.012 * nz()), r3(phi + 0.03 + 0.012 * nz())];
  });
  cloud[23] = [2.29, 0.162];
  return { well: 'IKORO-5', core, rhob, halfWindow: 3, nSigma: 3, cloud, alpha: 0.05 };
};
const IKORO = freeze(buildIkoro());

const ikZ = success('Ikoro zScores on the core', Q.zScores({ values: IKORO.core }));
must('Ikoro: the fractured plug is the largest |z|', ikZ.z.indexOf(ikZ.maxAbsZ) === 11 || ikZ.z.map(Math.abs).indexOf(ikZ.maxAbsZ) === 11, ikZ.maxAbsZ);
const ikM = success('Ikoro modifiedZScores on the core', Q.modifiedZScores({ values: IKORO.core }));
const ikMmax = Math.max(...ikM.scores.map(Math.abs));
must('Ikoro: the modified z flags the fractured plug', ikM.flags.some((f) => f.index === 11), JSON.stringify(ikM.flags.map((f) => f.index)));
const ikF = success('Ikoro iqrFences on RHOB', Q.iqrFences({ values: IKORO.rhob }));
must('Ikoro: the upper fence flags the spike', ikF.flags.some((f) => f.index === 57 && f.rule === 'above-upper-fence'), JSON.stringify(ikF.flags.map((f) => f.index)));
const ikH = success('Ikoro hampel on RHOB', Q.hampel({ values: IKORO.rhob, halfWindow: IKORO.halfWindow, nSigma: IKORO.nSigma }));
must('Ikoro: Hampel flags entry 57', ikH.flags.some((f) => f.index === 57), JSON.stringify(ikH.flags.map((f) => f.index)));
must('Ikoro: the window of entry 57 holds six present samples (one missing)', ikH.points[57].windowCount === 6, ikH.points[57].windowCount);
const ikG = success('Ikoro grubbsTest on the core', Q.grubbsTest({ values: IKORO.core, alpha: IKORO.alpha }));
must('Ikoro: Grubbs rejects the fractured plug', ikG.reject === true && ikG.suspectIndex === 11, `${ikG.reject} ${ikG.suspectIndex}`);
const ikMa = success('Ikoro mahalanobis on the cloud', Q.mahalanobis({ rows: IKORO.cloud }));
const ikMaMax = Math.max(...ikMa.d2);
must('Ikoro: the off-trend row carries the largest squared distance and is flagged',
  ikMa.d2.indexOf(ikMaMax) === 23 && ikMa.flags.some((f) => f.index === 23), `${ikMa.d2.indexOf(ikMaMax)}`);

/* ========================================================== AMASIRI, Expert

   AMASIRI-1: a casing pressure, thirty-six in-control days (phase one) and
   thirty monitored days (phase two) that rise by one process standard
   deviation from day 12. A scorecard stated for the well's data sheet. */

const buildAmasiri = () => {
  const g = mulberry32(70033);
  const nz = () => randomNormal(g);
  const phase1 = Array.from({ length: 36 }, () => r1(845 + 6 * nz()));
  const phase2 = Array.from({ length: 30 }, (_, i) => r1(845 + (i >= 11 ? 6 : 0) + 6 * nz()));
  return {
    well: 'AMASIRI-1', unit: 'psig', phase1, phase2, lambda: 0.2, L: 3, k: 0.5, h: 4,
    scorecard: {
      dimensions: [
        { name: 'completeness', checked: 720, failed: 18 },
        { name: 'validity', checked: 702, failed: 9 },
        { name: 'consistency', checked: 690, failed: 23 },
        { name: 'uniqueness', checked: 14, failed: 2 },
        { name: 'plausibility', checked: 702, failed: 11 },
      ],
      weights: { completeness: 3, validity: 2, consistency: 2, uniqueness: 1, plausibility: 1 },
    },
  };
};
const AMASIRI = freeze(buildAmasiri());

const amI = success('Amasiri phase one individualsChart', Q.individualsChart({ values: AMASIRI.phase1 }));
must('Amasiri: phase one is in control', amI.flags.length === 0, JSON.stringify(amI.flags.map((f) => f.index)));
const amE = success('Amasiri phase two ewmaChart', Q.ewmaChart({
  values: AMASIRI.phase2, lambda: AMASIRI.lambda, target: amI.centre, sigma: amI.sigma, L: AMASIRI.L,
}));
const amEx = success('Amasiri phase two ewmaChart, exact limits', Q.ewmaChart({
  values: AMASIRI.phase2, lambda: AMASIRI.lambda, target: amI.centre, sigma: amI.sigma, L: AMASIRI.L, limits: 'exact',
}));
const amC = success('Amasiri phase two cusumChart', Q.cusumChart({
  values: AMASIRI.phase2, target: amI.centre, k: AMASIRI.k, h: AMASIRI.h, units: 'sigma', sigma: amI.sigma,
}));
must('Amasiri: the upper CUSUM signals after the shift begins', amC.firstSignalHigh !== null && amC.firstSignalHigh >= 11, amC.firstSignalHigh);
must('Amasiri: the upper CUSUM on day 18 is above zero', amC.points[17].sHigh > 0, amC.points[17].sHigh);
const amS = success('Amasiri scorecard', Q.scorecard(AMASIRI.scorecard));

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'odudu_rhob_completeness', 'fraction', odComp.completeness],
  ['beginner', 'odudu_nphi_coverage', 'fraction', odCov.coverage],
  ['beginner', 'odudu_scada_expected_step_min', 'measure', odIdx.expectedStep],
  ['beginner', 'odudu_water_cut_day23', 'fraction', odWc.computed[22]],
  ['beginner', 'odudu_cumulative_drop_bbl', 'measure', odCum.flags[0].drop],
  ['beginner', 'odudu_phase_sum_allowed_day44_bbl_d', 'measure', odPh.flags[0].allowed],
  ['intermediate', 'ikoro_core_max_abs_z', 'statistic', ikZ.maxAbsZ],
  ['intermediate', 'ikoro_core_max_abs_modified_z', 'statistic', ikMmax],
  ['intermediate', 'ikoro_rhob_upper_fence_g_cm3', 'limit', ikF.upper],
  ['intermediate', 'ikoro_rhob_hampel_threshold_entry57_g_cm3', 'limit', ikH.points[57].threshold],
  ['intermediate', 'ikoro_core_grubbs_critical', 'statistic', ikG.critical],
  ['intermediate', 'ikoro_max_mahalanobis_d2', 'statistic', ikMaMax],
  ['advanced', 'amasiri_phase1_individuals_ucl_psig', 'limit', amI.ucl],
  ['advanced', 'amasiri_phase1_mr_ucl_psig', 'limit', amI.mrUcl],
  ['advanced', 'amasiri_ewma_day14_psig', 'statistic', amE.ewma[13]],
  ['advanced', 'amasiri_ewma_exact_ucl_day2_psig', 'limit', amEx.points[1].ucl],
  ['advanced', 'amasiri_cusum_upper_day18_psi', 'statistic', amC.points[17].sHigh],
  ['advanced', 'amasiri_scorecard_total', 'score', amS.total],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite positive number`, Number.isFinite(r.value) && r.value > 0, r.value));
// NEVER GRADE A SMALL INTEGER (kit README section 11): a whole number sits
// inside every guard band. Every graded value must carry a fractional part a
// learner reads off the engine.
ROWS.forEach((r) => must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3, r.value));

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d1_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`d1_capstone: ${ASSERTS.length} label-and-call and scenario assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ ODUDU, IKORO, AMASIRI })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 46)}${pad('CLASS', 10)}${pad('VALUE', 18)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 46)}${pad(r.cls, 10)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 18)}${gradedTolerance(r.key)}\n`));
}
