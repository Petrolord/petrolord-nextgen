// THE EIGHTEEN GRADED H3 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three facilities, six graded fields each, every one a RETURN VALUE of the
// vendored engines/hse/lopa.js. A gate that restates the formula validates
// nothing, so nothing here computes a frequency, a PFDavg, an RRF or an
// interval by its own arithmetic: every number is read off an engine result
// object, and discriminate.mjs is where the wrong methods live.
//
//   AKPO   Associate     a LOPA worksheet of four scenarios: frequencies, the
//                        credit rules, the required risk reduction, the loop
//                        back to the TMEL, and the exact decade
//   USAN   Professional  one SIF verified subsystem by subsystem by the
//                        IEC 61508-6 Annex B forms, the series sum, a proposed
//                        2oo2 alternative, and the loop back to the TMEL
//   YOHO   Expert        the proof test: longest intervals, imperfect proof
//                        test coverage, a floor no interval reaches below, and
//                        a SIF re-verified at a stretched interval
//
// Usage:
//   node h3_capstone.mjs            the human table
//   node h3_capstone.mjs --json     the rows make_fields.mjs writes
//   node h3_capstone.mjs --inputs   the three scenarios, for oracle_check.py
//
// NOTHING HERE READS THE DIGEST OR THE TEACHING STREAMS, and the digest
// generator reads nothing here. The two run different facilities on different
// numbers, and gate_capstone_leak.mjs proves it in both directions.
//
// FAILURE RATES ARE ILLUSTRATIVE. Every lambda below is a stated capstone
// input chosen for the exercise, never data; the capstone prompts say so.
import process from 'node:process';

const ROOT = process.env.H3_ENGINES || '/root/wt-h3-nextgen/packages/engines';
const L = await import(`${ROOT}/engines/hse/lopa.js`);
const TOLPATH = process.env.H3_TOLERANCE
  || '/root/wt-h3-nextgen/src/components/course/panels/lopa/gradedTolerance.js';
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
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};

/* ========================================================= AKPO, Associate

   A gas plant's LOPA worksheet, four scenarios, one TMEL per scenario.
   SEPARATOR  overpressure; one enabling condition, two conditional
              modifiers, one credited IPL and one that shares the initiating
              controller and is NOT independent.
   TANK       condensate overfill; two enabling conditions, one modifier, one
              credited IPL and one level transmitter shared with the control
              loop, NOT independent. Lands in SIL 2.
   COMPRESSOR seal failure with a proposed SIF of stated PFDavg; the loop is
              closed against the TMEL.
   EXPORT     pump overpressure whose required RRF is an EXACT DECADE, 100,
              which the double lands just above; the site SIF catalogue holds
              one standard design per SIL band.
   ==================================================================== */

const AKPO = Object.freeze({
  separator: Object.freeze({
    initiatingEventFrequencyPerYr: 0.37,
    enablingConditions: [{ name: 'high pressure well lined up to the separator', probability: 0.23 }],
    conditionalModifiers: [{ name: 'ignition', probability: 0.42 }, { name: 'operator in the area', probability: 0.18 }],
    ipls: [
      { name: 'high pressure alarm with operator response', pfd: 0.1, independent: true },
      { name: 'BPCS high pressure trip on the initiating controller', pfd: 0.1, independent: false },
    ],
    tmelPerYr: 1e-5,
  }),
  tank: Object.freeze({
    initiatingEventFrequencyPerYr: 0.83,
    enablingConditions: [
      { name: 'tank receiving from the separator', probability: 0.64 },
      { name: 'rundown at the high rate', probability: 0.35 },
    ],
    conditionalModifiers: [{ name: 'vapour cloud ignites', probability: 0.27 }],
    ipls: [
      { name: 'independent high level alarm with operator response', pfd: 0.1, independent: true },
      { name: 'level transmitter shared with the control loop', pfd: 0.1, independent: false },
    ],
    tmelPerYr: 1e-5,
  }),
  compressor: Object.freeze({
    initiatingEventFrequencyPerYr: 0.19,
    enablingConditions: [],
    conditionalModifiers: [
      { name: 'ignition', probability: 0.33 },
      { name: 'person present', probability: 0.52 },
      { name: 'fatal injury', probability: 0.4 },
    ],
    ipls: [{ name: 'gas detection with operator shutdown', pfd: 0.1, independent: true }],
    tmelPerYr: 1e-5,
    sifPfdAvg: 0.0037,
  }),
  export: Object.freeze({
    initiatingEventFrequencyPerYr: 0.64,
    enablingConditions: [{ name: 'export pump on the high speed curve', probability: 0.625 }],
    conditionalModifiers: [{ name: 'release reaches the jetty', probability: 0.25 }],
    ipls: [
      { name: 'pressure relief to the closed drain', pfd: 0.1, independent: true },
      { name: 'BPCS pump trip on the same controller', pfd: 0.1, independent: false },
    ],
    tmelPerYr: 1e-4,
    catalogue: Object.freeze({ sil1: 0.0273, sil2: 0.00318, sil3: 0.000461 }),
  }),
});

const lopa = (label, s, extra = {}) => success(label, L.lopaScenario({
  initiatingEventFrequencyPerYr: s.initiatingEventFrequencyPerYr,
  enablingConditions: s.enablingConditions,
  conditionalModifiers: s.conditionalModifiers,
  ipls: s.ipls,
  tmelPerYr: s.tmelPerYr,
  ...extra,
}));

const akSep = lopa('Akpo separator', AKPO.separator);
must('Akpo separator: exactly one IPL is credited and one is not', akSep.credited.length === 1 && akSep.notCredited.length === 1,
  `${akSep.credited.length} credited, ${akSep.notCredited.length} not`);
must('Akpo separator: the required outcome is SIL 1', akSep.outcome === L.LOPA_OUTCOME.SIL1, akSep.outcome);

const akTank = lopa('Akpo tank', AKPO.tank);
must('Akpo tank: the level transmitter is not credited', akTank.notCredited.length === 1
  && /level transmitter/.test(akTank.notCredited[0].name), JSON.stringify(akTank.notCredited));
must('Akpo tank: the required outcome is SIL 2', akTank.outcome === L.LOPA_OUTCOME.SIL2, akTank.outcome);
must('Akpo tank: crediting the shared transmitter would drop the answer to SIL 1',
  L.outcomeFromRequiredRrf(akTank.requiredRrf * 0.1).outcome === L.LOPA_OUTCOME.SIL1, 'SIL1');

const akComp = lopa('Akpo compressor with its proposed SIF', AKPO.compressor, { sifPfdAvg: AKPO.compressor.sifPfdAvg });
must('Akpo compressor: the required outcome is SIL 2', akComp.outcome === L.LOPA_OUTCOME.SIL2, akComp.outcome);
must('Akpo compressor: the proposed SIF meets the TMEL', akComp.meetsTmel === true, akComp.meetsTmel);
must('Akpo compressor: a SIF at the SIL 2 band ceiling would not meet it',
  akComp.mitigatedFrequencyWithoutSifPerYr * 0.01 > AKPO.compressor.tmelPerYr, 'ceiling misses');

const akExp = lopa('Akpo export pump', AKPO.export);
must('Akpo export: the required RRF is within the decade snap of 100', L.decadeOf(akExp.requiredRrf) === 2, akExp.requiredRrf);
must('Akpo export: the double lands strictly ABOVE 100, so an unsnapped comparison bands it SIL 2',
  akExp.requiredRrf > 100, akExp.requiredRrf.toPrecision(20));
must('Akpo export: the engine bands the exact decade SIL 1', akExp.outcome === L.LOPA_OUTCOME.SIL1 && akExp.requiredSil === 1, akExp.outcome);
must('Akpo export: each catalogue design sits inside its own band', ['sil1', 'sil2', 'sil3'].every((k, i) => {
  const b = L.silFromPfdAvg(AKPO.export.catalogue[k]);
  return b.sil === i + 1 && b.state === L.PFD_STATE.SIL;
}), JSON.stringify(AKPO.export.catalogue));
const akExpSif = lopa('Akpo export pump with the SIL 1 catalogue SIF', AKPO.export, { sifPfdAvg: AKPO.export.catalogue.sil1 });
must('Akpo export: the SIL 1 catalogue design is in the required band and still misses the TMEL',
  akExpSif.meetsTmel === false && akExpSif.sifBand.sil === 1, `${akExpSif.meetsTmel} ${akExpSif.sifBand.sil}`);
must('Akpo export: crediting the non-independent trip takes the RRF to exactly 10, below SIL 1',
  L.outcomeFromRequiredRrf(akExp.requiredRrf * 0.1).outcome === L.LOPA_OUTCOME.BELOW_SIL1, 'below SIL1');

/* ====================================================== USAN, Professional

   A high pressure trip SIF on a gas export line: 2oo3 pressure transmitters,
   a 1oo1 safety PLC, and two shutdown valves 1oo2. Proof test interval one
   year throughout; MRT equals MTTR, the convention the published worked SIF
   reproduces only under. A 2oo2 transmitter vote is proposed to cut spurious
   trips, with the beta factor of the 2oo3 set carried on the data sheet. The
   LOPA row the SIF answers is stated, and the loop is closed against its TMEL.
   ==================================================================== */

const USAN = Object.freeze({
  transmitters: Object.freeze({
    architecture: '2oo3', lambdaDuPerHour: 6.3e-7, lambdaDdPerHour: 1.9e-6, proofTestIntervalHours: 8760,
    mttrHours: 16, mrtHours: 16, beta: 0.06, betaD: 0.03,
  }),
  logicSolver: Object.freeze({
    architecture: '1oo1', lambdaDuPerHour: 4.6e-8, lambdaDdPerHour: 7.6e-7, proofTestIntervalHours: 8760,
    mttrHours: 16, mrtHours: 16,
  }),
  valves: Object.freeze({
    architecture: '1oo2', lambdaDuPerHour: 2.4e-6, lambdaDdPerHour: 3.0e-7, proofTestIntervalHours: 8760,
    mttrHours: 16, mrtHours: 16, beta: 0.1, betaD: 0.05,
  }),
  proposed2oo2: Object.freeze({
    architecture: '2oo2', lambdaDuPerHour: 6.3e-7, lambdaDdPerHour: 1.9e-6, proofTestIntervalHours: 8760,
    mttrHours: 16, mrtHours: 16, beta: 0.06, betaD: 0.03,
  }),
  lopaRow: Object.freeze({
    initiatingEventFrequencyPerYr: 0.21,
    enablingConditions: [{ name: 'export compressor at full throughput', probability: 0.44 }],
    conditionalModifiers: [{ name: 'ignition', probability: 0.3 }],
    ipls: [{ name: 'pressure relief valve', pfd: 0.01, independent: true }],
    tmelPerYr: 1e-6,
  }),
});

const usTx = success('Usan 2oo3 transmitters', L.pfdAvgSubsystem(USAN.transmitters));
const usLs = success('Usan 1oo1 logic solver', L.pfdAvgSubsystem(USAN.logicSolver));
const usVv = success('Usan 1oo2 valves', L.pfdAvgSubsystem(USAN.valves));
const usSif = success('Usan SIF', L.pfdAvgSif([
  { name: 'transmitters', ...USAN.transmitters },
  { name: 'logic solver', ...USAN.logicSolver },
  { name: 'valves', ...USAN.valves },
]));
const us22 = success('Usan proposed 2oo2 transmitters', L.pfdAvgSubsystem(USAN.proposed2oo2));
must('Usan: the 2oo2 carries the engine warning that beta was ignored',
  us22.warnings.some((x) => /beta does not apply to 2oo2/.test(x)), JSON.stringify(us22.warnings));
must('Usan: the 2oo2 PFDavg is more than ten times the 2oo3 one', us22.pfdAvg > 10 * usTx.pfdAvg, `${us22.pfdAvg} ${usTx.pfdAvg}`);
must('Usan: common cause dominates the 2oo3 transmitters and the 1oo2 valves',
  usTx.dominant === 'common cause' && usVv.dominant === 'common cause', `${usTx.dominant} ${usVv.dominant}`);
must('Usan: no subsystem carries a warning apart from the 2oo2',
  [usTx, usLs, usVv].every((r) => r.warnings.length === 0), 'no warnings');
must('Usan: the SIF sum is the sum of the three subsystem results',
  usSif.pfdAvg === usTx.pfdAvg + usLs.pfdAvg + usVv.pfdAvg, `${usSif.pfdAvg}`);
const usLopa = success('Usan LOPA row closed with the SIF', L.lopaScenario({ ...USAN.lopaRow, sifPfdAvg: usSif.pfdAvg }));
must('Usan: the LOPA row requires SIL 2', usLopa.outcome === L.LOPA_OUTCOME.SIL2, usLopa.outcome);
must('Usan: the verified SIF is SIL 2 and meets the TMEL', usSif.sil === 2 && usLopa.meetsTmel === true, `${usSif.sil} ${usLopa.meetsTmel}`);

/* ========================================================= YOHO, Expert

   Proof testing on a crude oil stabiliser. The valve set and the transmitter
   set are allocated PFDavg budgets; the question is how long each proof test
   interval may run. One single valve's proof test covers only part of its
   dangerous undetected failures, the rest found only at overhaul; one
   transmitter's partial test leaves a floor no interval can reach below.
   ==================================================================== */

const YOHO = Object.freeze({
  valves: Object.freeze({
    architecture: '1oo2', lambdaDuPerHour: 2.3e-6, proofTestIntervalHours: 8760, mrtHours: 48, beta: 0.07,
  }),
  valveBudgetPfdAvg: 2.2e-3,
  singleValve: Object.freeze({
    architecture: '1oo1', lambdaDuPerHour: 7.8e-7, proofTestIntervalHours: 8760, mrtHours: 48,
    proofTestCoverage: 0.75, lifetimeHours: 105120,
  }),
  singleValveTargetPfdAvg: 0.0118,
  transmitter: Object.freeze({
    architecture: '1oo1', lambdaDuPerHour: 6.1e-7, lambdaDdPerHour: 2.4e-6, proofTestIntervalHours: 8760,
    mttrHours: 72, mrtHours: 72, proofTestCoverage: 0.6, lifetimeHours: 131400,
  }),
  transmitterTargetPfdAvg: 3e-3,
  transmitters2oo3: Object.freeze({
    architecture: '2oo3', lambdaDuPerHour: 7.4e-7, lambdaDdPerHour: 1.3e-6, proofTestIntervalHours: 8760,
    mttrHours: 24, mrtHours: 24, beta: 0.1, betaD: 0.05,
  }),
  transmitterBudgetPfdAvg: 1.5e-4,
  logicSolver: Object.freeze({
    architecture: '1oo1', lambdaDuPerHour: 5.2e-8, lambdaDdPerHour: 9.1e-7, proofTestIntervalHours: 8760,
    mttrHours: 24, mrtHours: 24,
  }),
  stretchedIntervalHours: 26280,
});

const yoV = success('Yoho valves longest interval', L.maxProofTestInterval(YOHO.valves, YOHO.valveBudgetPfdAvg));
must('Yoho valves: the interval is FOUND', yoV.state === 'FOUND', yoV.state);
must('Yoho valves: the interval is longer than a year', yoV.proofTestIntervalHours > 8760, yoV.proofTestIntervalHours);
const yoS = success('Yoho single valve PFDavg with partial proof test coverage', L.pfdAvgSubsystem(YOHO.singleValve));
must('Yoho single valve: no rare-event warning at these inputs', yoS.warnings.length === 0, JSON.stringify(yoS.warnings));
must('Yoho single valve: the one-year PFDavg is above its target', yoS.pfdAvg > YOHO.singleValveTargetPfdAvg, yoS.pfdAvg);
const yoSI = success('Yoho single valve longest interval', L.maxProofTestInterval(YOHO.singleValve, YOHO.singleValveTargetPfdAvg));
must('Yoho single valve: the interval is FOUND and shorter than a year', yoSI.state === 'FOUND'
  && yoSI.proofTestIntervalHours < 8760, `${yoSI.state} ${yoSI.proofTestIntervalHours}`);
must('Yoho single valve: with perfect coverage the same target allows more than a year',
  L.maxProofTestInterval({ ...YOHO.singleValve, proofTestCoverage: 1 }, YOHO.singleValveTargetPfdAvg).proofTestIntervalHours > 8760, 'longer');
const yoT = success('Yoho transmitter against its target', L.maxProofTestInterval(YOHO.transmitter, YOHO.transmitterTargetPfdAvg));
must('Yoho transmitter: the target is UNACHIEVABLE at any interval', yoT.state === 'UNACHIEVABLE', yoT.state);
must('Yoho transmitter: with perfect coverage the same target is achievable',
  L.maxProofTestInterval({ ...YOHO.transmitter, proofTestCoverage: 1 }, YOHO.transmitterTargetPfdAvg).state === 'FOUND', 'FOUND');
const yoLong = success('Yoho transmitter rare-event product at the lifetime', L.pfdAvgSubsystem(YOHO.transmitter));
must('Yoho transmitter: no rare-event warning at these inputs', yoLong.warnings.length === 0, JSON.stringify(yoLong.warnings));
const stretch = (p) => ({ ...p, proofTestIntervalHours: YOHO.stretchedIntervalHours });
const yoSif = success('Yoho SIF at the stretched interval', L.pfdAvgSif([
  { name: 'transmitters', ...stretch(YOHO.transmitters2oo3) },
  { name: 'logic solver', ...stretch(YOHO.logicSolver) },
  { name: 'valves', ...stretch(YOHO.valves) },
]));
const yoSif1 = success('Yoho SIF at one year', L.pfdAvgSif([
  { name: 'transmitters', ...YOHO.transmitters2oo3 },
  { name: 'logic solver', ...YOHO.logicSolver },
  { name: 'valves', ...YOHO.valves },
]));
must('Yoho SIF: stretching to three years drops it from SIL 3 or 2 into SIL 2 or lower', yoSif.rrf < yoSif1.rrf / 2, `${yoSif.rrf} ${yoSif1.rrf}`);
const yoTx = success('Yoho 2oo3 transmitters longest interval', L.maxProofTestInterval(YOHO.transmitters2oo3, YOHO.transmitterBudgetPfdAvg));
must('Yoho transmitters: the interval is FOUND', yoTx.state === 'FOUND', yoTx.state);

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'akpo_separator_unmitigated_frequency_per_yr', 'freq', akSep.unmitigatedFrequencyPerYr],
  ['beginner', 'akpo_separator_required_rrf', 'rrf', akSep.requiredRrf],
  ['beginner', 'akpo_tank_mitigated_frequency_without_sif_per_yr', 'freq', akTank.mitigatedFrequencyWithoutSifPerYr],
  ['beginner', 'akpo_tank_required_sif_pfdavg', 'pfd', akTank.requiredSifPfdAvg],
  ['beginner', 'akpo_compressor_mitigated_frequency_with_sif_per_yr', 'freq', akComp.mitigatedFrequencyPerYr],
  ['beginner', 'akpo_export_catalogue_sif_mitigated_frequency_per_yr', 'freq', akExpSif.mitigatedFrequencyPerYr],
  ['intermediate', 'usan_transmitters_2oo3_pfdavg', 'pfd', usTx.pfdAvg],
  ['intermediate', 'usan_logic_solver_1oo1_pfdavg', 'pfd', usLs.pfdAvg],
  ['intermediate', 'usan_valves_1oo2_pfdavg', 'pfd', usVv.pfdAvg],
  ['intermediate', 'usan_sif_rrf', 'rrf', usSif.rrf],
  ['intermediate', 'usan_proposed_2oo2_transmitters_pfdavg', 'pfd', us22.pfdAvg],
  ['intermediate', 'usan_mitigated_frequency_with_sif_per_yr', 'freq', usLopa.mitigatedFrequencyPerYr],
  ['advanced', 'yoho_valves_1oo2_max_interval_hours', 'hours', yoV.proofTestIntervalHours],
  ['advanced', 'yoho_valve_1oo1_ptc_pfdavg', 'pfd', yoS.pfdAvg],
  ['advanced', 'yoho_valve_1oo1_ptc_max_interval_hours', 'hours', yoSI.proofTestIntervalHours],
  ['advanced', 'yoho_transmitter_ptc_floor_pfdavg', 'pfd', yoT.floorPfdAvg],
  ['advanced', 'yoho_sif_rrf_at_three_year_interval', 'rrf', yoSif.rrf],
  ['advanced', 'yoho_transmitters_2oo3_max_interval_hours', 'hours', yoTx.proofTestIntervalHours],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite positive number`, Number.isFinite(r.value) && r.value > 0, r.value));
// NEVER GRADE A SMALL INTEGER (kit README section 11), and never grade a value
// that PRINTS as one: every graded value must carry digits a learner reads off
// the engine, at the precision the course prints its class to.
ROWS.forEach((r) => {
  const dp = PRINTED_DECIMALS[r.cls];
  const scaled = r.value * 10 ** Math.min(dp, 6);
  must(`${r.key} does not print as a whole number of its class's last six printed places`,
    Math.abs(scaled - Math.round(scaled)) > 1e-3 || r.value.toFixed(dp).replace(/0+$/, '').split('.')[1]?.length > 3,
    r.value.toFixed(dp));
  must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3 || r.value < 1, r.value);
});
// An interval found by bisection must not sit on a round number of hours either.
ROWS.filter((r) => r.cls === 'hours').forEach((r) => must(`${r.key} is not within a thousandth of an hour of a whole hour`,
  Math.abs(r.value - Math.round(r.value)) > 1e-3, r.value));

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h3_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h3_capstone: ${ASSERTS.length} label-and-call and scenario assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ AKPO, USAN, YOHO })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 56)}${pad('CLASS', 7)}${pad('VALUE', 20)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 56)}${pad(r.cls, 7)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 20)}${gradedTolerance(r.key)}\n`));
}
