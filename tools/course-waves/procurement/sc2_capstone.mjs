// THE EIGHTEEN GRADED SC2 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three capstones, six graded values each, every one a RETURN VALUE of the
// vendored engines/supplychain/tender.js. A gate that restates the formula
// validates nothing, so nothing here computes a technical percentage, a
// corrected price, an average, an evaluated cost, a score, a net present cost,
// a standard deviation, a content, a lead, an estimate, a share or a ratio by
// its own arithmetic: every number is read off an engine result object, and
// discriminate.mjs is where the wrong methods live.
//
//   ONITSHA  Associate     two envelopes by hand: the technical percentage of
//                          ON3, the corrected price of ON2, the amount added
//                          for ON3's omitted item, the evaluated cost of ON1,
//                          the commercial score of ON2 and the top combined
//                          score
//   UMUAHIA  Professional  the lowest evaluated cost and the content Act: the
//                          life-cycle cost of UM2, the evaluated cost of UM4,
//                          the relative ALB limit, the overall content of UM3,
//                          and the s.14 lead read as points and as relative
//   OKIGWE   Expert        contracts, should-cost and the whole tender: the
//                          day-rate mean cost, the reimbursable P90 cost (the
//                          LOW cost), what the company pays of the overrun on
//                          the day rate, the should-cost estimate, the
//                          operator's share of it and the award's ratio to it
//
// THE DATASETS ARE SYNTHETIC EKENE TENDERS OF THEIR OWN, typed here with their
// own bid codes, scopes, criteria, prices and settings, none of them the
// digest's. Every scenario claim a brief will make is asserted.
//
// THE CARE RULES FROM THE PROGRAMME, all asserted below:
//   * NO TIE decides a graded value: no ranking a graded value reads has a
//     tieBrokenBy, and the s.14 top content is unique.
//   * EVERY SETTING IS STATED: the pass mark, weights, omission rule, schedule,
//     life cycle, award basis, technical weight, methods, the s.14 reading,
//     the seed, the iterations and the band are inputs here and are printed
//     by --inputs for the capstone brief.
//   * SEED. A value read from the Monte Carlo run carries its seed and
//     iteration count as stated inputs, and on the next seed it moves by more
//     than ten tolerances, so a learner who changes the seed cannot land on it.
//   * ONE ANSWER. Every graded value is non-zero and not a whole number.
//
// Usage:
//   node sc2_capstone.mjs            the human table
//   node sc2_capstone.mjs --json     the rows make_fields.mjs writes
//   node sc2_capstone.mjs --inputs   the three datasets and their stated
//                                    settings, for oracle_check.py,
//                                    discriminate.mjs and gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST, and the digest generator reads nothing here.
import process from 'node:process';

const HERE = process.env.SC2_WAVE_DIR || '/root/cat-wip-procurement';
const { T, WELLCOST } = await import(`${HERE}/tender_engine.mjs`);
const TOLPATH = process.env.SC2_TOLERANCE
  || '/root/wt-sc2-nextgen/src/components/course/panels/procurement/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const NOTES = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
/** A call this file LABELS a success: no error key, every top-level number finite. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
const clone = (o) => JSON.parse(JSON.stringify(o));
const line = (id, quantity, unitRate, quotedAmount = Math.round(quantity * unitRate * 100) / 100, extra = {}) => ({ id, quantity, unitRate, quotedAmount, ...extra });
const noTie = (label, rows) => must(`NO TIE: ${label}`, rows.every((r) => !r.tieBrokenBy), rows.map((r) => `${r.id}:${r.tieBrokenBy}`).join(','));

/* ======================================================= ONITSHA, Associate

   A coiled tubing scale cleanout with nitrogen lift on Ekene-2 and Ekene-6,
   six bids. Two envelopes: mandatory requirements, then five weighted
   criteria scored 0 to 5 against a pass mark of 65; the passing bids' bills
   corrected, the omitted item priced at the average of the other responsive
   bids, a completion-time adjustment at 0.0035 a week beyond 6 weeks (10 at
   most), and a combined award at technical weight 0.65 with the lowest-ratio
   commercial score and the relative technical score. */

const ONITSHA = {
  tender: 'EK-11/WS/2027-19 (synthetic)',
  scope: 'Coiled tubing scale cleanout with nitrogen lift on Ekene-2 and Ekene-6',
  criteria: [
    { id: 'methodology', weight: 32, maxScore: 5 },
    { id: 'personnel', weight: 27, maxScore: 5 },
    { id: 'equipment', weight: 19, maxScore: 5 },
    { id: 'hse', weight: 13, maxScore: 5 },
    { id: 'schedule', weight: 9, maxScore: 5 },
  ],
  passMark: 65,
  omissionRule: 'average',
  schedule: { minWeeks: 6, maxWeeks: 10, ratePerWeek: 0.0035 },
  award: 'combined',
  technicalWeight: 0.65,
  priceMethod: 'lowest-ratio',
  technicalMethod: 'relative',
  bids: [
    { id: 'ON1', receivedAt: '2027-08-02T09:05:00Z', mandatory: [{ id: 'bid-security', met: true }, { id: 'signed-bid-form', met: true }],
      scores: { methodology: 4, personnel: 4, equipment: 3, hse: 4, schedule: 3 }, discount: 12500, completionWeeks: 5,
      lines: [line('mob', 1, 112000), line('ct-spread', 15, 27450.35), line('pump-spread', 5, 19875.5), line('dissolver', 40, 1612.4), line('nitrogen', 100, 305.75), line('demob', 1, 58000)] },
    { id: 'ON2', receivedAt: '2027-08-02T11:47:00Z', mandatory: [{ id: 'bid-security', met: true }, { id: 'signed-bid-form', met: true }],
      scores: { methodology: 3, personnel: 4, equipment: 4, hse: 4, schedule: 3 }, completionWeeks: 8,
      deviations: [{ id: 'payment-terms', amount: 7250, reason: 'asks for payment in 30 days where the conditions give 60; priced at the interest on the earlier payment' }],
      lines: [line('mob', 1, 98500), line('ct-spread', 15, 26980.4, 406980), line('pump-spread', 5, 19210.25), line('dissolver', 40, 1575.8), line('nitrogen', 100, 298.6), line('demob', 1, 52500)] },
    { id: 'ON3', receivedAt: '2027-08-03T08:20:00Z', mandatory: [{ id: 'bid-security', met: true }, { id: 'signed-bid-form', met: true }],
      scores: { methodology: 4, personnel: 4, equipment: 4, hse: 5, schedule: 3 }, completionWeeks: 7, omitted: ['nitrogen'],
      lines: [line('mob', 1, 104000), line('ct-spread', 15, 28120.6), line('pump-spread', 5, 20480.75), line('dissolver', 40, 1650.25), line('demob', 1, 55500)] },
    { id: 'ON4', receivedAt: '2027-08-03T10:02:00Z', mandatory: [{ id: 'bid-security', met: true }, { id: 'signed-bid-form', met: true }],
      scores: { methodology: 3, personnel: 2, equipment: 3, hse: 3, schedule: 2 }, completionWeeks: 6,
      lines: [line('mob', 1, 82000), line('ct-spread', 15, 23840.5), line('pump-spread', 5, 16950), line('dissolver', 40, 1380.6), line('nitrogen', 100, 262.4), line('demob', 1, 41000)] },
    { id: 'ON5', receivedAt: '2027-08-03T14:36:00Z', mandatory: [{ id: 'bid-security', met: true }, { id: 'signed-bid-form', met: true }],
      scores: { methodology: 4, personnel: 3, equipment: 3, hse: 3, schedule: 3 }, completionWeeks: 9,
      lines: [line('mob', 1, 99000), line('ct-spread', 15, 26250.8), line('pump-spread', 5, 18990.4), line('dissolver', 40, 15.482, 61928, { decimalMisplaced: true }), line('nitrogen', 100, 289.15), line('demob', 1, 49750)] },
    { id: 'ON6', receivedAt: '2027-08-04T16:41:00Z', mandatory: [{ id: 'bid-security', met: false }, { id: 'signed-bid-form', met: true }],
      scores: { methodology: 5, personnel: 4, equipment: 4, hse: 4, schedule: 4 }, completionWeeks: 6,
      lines: [line('mob', 1, 126000), line('ct-spread', 15, 29900), line('pump-spread', 5, 22400), line('dissolver', 40, 1720), line('nitrogen', 100, 318), line('demob', 1, 63000)] },
  ],
};
const onT = success('ONITSHA evaluateTender', T.evaluateTender(clone(ONITSHA)));
const onTech = onT.technical;
const onCom = onT.commercial;
const onRank = onT.ranking;
const onRow = (id) => onCom.bids.find((b) => b.id === id);
must('ONITSHA: ON6 fails a mandatory requirement', onTech.bids.find((b) => b.id === 'ON6').status === 'fail-mandatory', 'ON6');
must('ONITSHA: ON4 fails the pass mark and has the lowest quoted total', onTech.bids.find((b) => b.id === 'ON4').status === 'fail-pass-mark'
  && ONITSHA.bids.every((b) => b.id === 'ON4' || T.correctArithmetic({ lines: clone(b.lines) }).quotedTotal > T.correctArithmetic({ lines: clone(ONITSHA.bids[3].lines) }).quotedTotal), 'ON4');
must('ONITSHA: ON2 carries a unit-rate correction', T.correctArithmetic({ lines: clone(ONITSHA.bids[1].lines) }).lines.some((l) => l.rule === 'unit-rate-prevails'), 'ON2');
must('ONITSHA: ON5 carries a misplaced decimal point', T.correctArithmetic({ lines: clone(ONITSHA.bids[4].lines) }).lines.some((l) => l.rule === 'total-governs'), 'ON5');
must('ONITSHA: ON3 omission is priced at the average of three other responsive bids', onRow('ON3').omissions.length === 1 && onRow('ON3').omissions[0].rule === 'average' && /average of the 3 prices/.test(onRow('ON3').omissions[0].reason), onRow('ON3').omissions[0].reason);
must('ONITSHA: ON1 finishes before minWeeks, so no adjustment and no credit', onRow('ON1').scheduleAdjustment === 0 && ONITSHA.bids[0].completionWeeks < ONITSHA.schedule.minWeeks, onRow('ON1').scheduleAdjustment);
must('ONITSHA: the lowest evaluated cost is not the most advantageous bid', onCom.lowestEvaluatedCost !== onRank.mostAdvantageous, `${onCom.lowestEvaluatedCost} ${onRank.mostAdvantageous}`);
must('ONITSHA: ON2 is not the lowest evaluated cost, so its commercial score is below 100', onRow('ON2').evaluatedCost > onRank.cMin, onRow('ON2').evaluatedCost);
noTie('ONITSHA evaluated costs', onCom.bids);
noTie('ONITSHA ranking', onRank.bids);
must('ONITSHA: the technical weight sits in its para 5.50 cell (high risk, low value)', T.weightingBand({ risk: 'high', estimatedCostUsd: 800000, technicalWeight: ONITSHA.technicalWeight }).withinBand, 'band');

/* ===================================================== UMUAHIA, Professional

   Casing, valves, cement, baryte and inspection for the Ekene infill wells,
   six bids. The technical envelope at a pass mark of 62, then the lowest
   evaluated cost with a six-year valve maintenance life-cycle cost at 0.08, a
   delivery adjustment at 0.003 a week beyond 8 weeks (13 at most), the omitted
   item at the average; the ALB test on the responsive bids; Nigerian content
   per the 2010 Schedule, weighted by each bid's spend per item; and s.14 read
   both ways. */

const UM_CRIT = [{ id: 'specification', weight: 55, maxScore: 4 }, { id: 'delivery', weight: 30, maxScore: 4 }, { id: 'after-sales', weight: 15, maxScore: 4 }];
const umBid = (id, receivedAt, scores, weeks, annual, prices, nc, extra = {}) => {
  const lines = [line('casing', 200, prices[0]), line('valves', 30, prices[1]), line('cement', 160, prices[2]), line('baryte', 220, prices[3])];
  if (prices[4] !== null) lines.push(line('inspection', 1, prices[4]));
  return { id, receivedAt, mandatory: [{ id: 'bid-security', met: true }, { id: 'manufacturer-authorisation', met: true }], scores, completionWeeks: weeks, annualCosts: annual, lines,
    nc: { casing: { measure: 'tonnage', nigerian: nc[0], total: 200 }, valves: { measure: 'number', nigerian: nc[1], total: 30 }, cement: { measure: 'tonnage', nigerian: nc[2], total: 160 }, baryte: { measure: 'tonnage', nigerian: nc[3], total: 220 } },
    ...extra };
};
const UMUAHIA = {
  tender: 'EK-11/MS/2027-23 (synthetic)',
  scope: 'Casing, gate valves, cement, baryte and inspection for two Ekene infill wells',
  criteria: UM_CRIT,
  passMark: 62,
  omissionRule: 'average',
  schedule: { minWeeks: 8, maxWeeks: 13, ratePerWeek: 0.003 },
  lifeCycle: { years: 6, discountRate: 0.08 },
  award: 'lowest-cost',
  ncItems: [{ id: 'casing', scheduleLine: 'steel-pipes' }, { id: 'valves', scheduleLine: 'valves' }, { id: 'cement', scheduleLine: 'cement-portland' }, { id: 'baryte', scheduleLine: 'drilling-mud-baryte-bentonite' }],
  ncWeights: 'each bid weights its items by its own quoted amount for that item',
  bids: [
    umBid('UM1', '2027-09-06T09:30:00Z', { specification: 3, delivery: 3, 'after-sales': 3 }, 10, [5200, 5200, 5200, 5200, 5200, 5200], [1612.5, 3965, 302.4, 405.2, 11800], [118, 19, 131, 139], { indigenous: false, capacity: true }),
    umBid('UM2', '2027-09-06T13:10:00Z', { specification: 3, delivery: 3, 'after-sales': 3 }, 9, [4850, 4850, 4850, 4850, 4850, 4850], [1628.4, 4015.5, 298.75, 399.6, 10400], [124, 18, 128, 134], { indigenous: false, capacity: true, residualValue: 3000 }),
    umBid('UM3', '2027-09-07T08:55:00Z', { specification: 4, delivery: 3, 'after-sales': 3 }, 8, [4600, 4600, 4600, 4600, 4600, 4600], [1705.2, 4180, 316.5, 421.8, 14100], [196, 21, 144, 150], { indigenous: true, capacity: true }),
    umBid('UM4', '2027-09-07T11:25:00Z', { specification: 3, delivery: 2, 'after-sales': 4 }, 11, [6100, 6100, 6100, 6100, 6100, 6100], [1571.8, 3902.25, 294.6, 396.4, null], [112, 17, 129, 136], { indigenous: false, capacity: true, omitted: ['inspection'] }),
    umBid('UM5', '2027-09-07T15:40:00Z', { specification: 3, delivery: 3, 'after-sales': 2 }, 12, [5600, 5600, 5600, 5600, 5600, 5600], [1650.7, 4088, 309.9, 411.5, 12650], [140, 20, 134, 141], { indigenous: true, capacity: true }),
    umBid('UM6', '2027-09-08T10:15:00Z', { specification: 2, delivery: 2, 'after-sales': 2 }, 9, [6400, 6400, 6400, 6400, 6400, 6400], [1498.3, 3780, 281.2, 377.9, 8900], [100, 14, 110, 118], { indigenous: false, capacity: true }),
  ],
};
const umEngineBid = (b) => { const { nc, ...rest } = clone(b); return rest; };
const umWeights = (b) => Object.fromEntries(b.lines.filter((l) => l.id !== 'inspection').map((l) => [l.id, l.quotedAmount]));
const umNc = success('UMUAHIA nigerianContent', T.nigerianContent({ items: clone(UMUAHIA.ncItems), bids: UMUAHIA.bids.map((b) => ({ id: b.id, items: clone(b.nc), weights: umWeights(b) })) }));
const umNcPct = Object.fromEntries(umNc.bids.map((b) => [b.id, b.ncPct]));
const umTender = (basis) => T.evaluateTender({ criteria: clone(UM_CRIT), passMark: UMUAHIA.passMark, omissionRule: UMUAHIA.omissionRule, schedule: clone(UMUAHIA.schedule), lifeCycle: clone(UMUAHIA.lifeCycle), award: 'lowest-cost',
  bids: UMUAHIA.bids.map((b) => ({ ...umEngineBid(b), ncPct: umNcPct[b.id] })), nigerianContent: { ncLeadBasis: basis } });
const umPts = success('UMUAHIA evaluateTender points', umTender('points'));
const umRel = success('UMUAHIA evaluateTender relative', umTender('relative'));
const umCom = umPts.commercial;
const umRow = (id) => umCom.bids.find((b) => b.id === id);
const umAlb = success('UMUAHIA abnormallyLow on the responsive bids', T.abnormallyLow({ bids: umCom.bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost })) }));
must('UMUAHIA: UM6 fails the pass mark', umPts.technical.bids.find((b) => b.id === 'UM6').status === 'fail-pass-mark', 'UM6');
must('UMUAHIA: five responsive bids, so the relative ALB approach', umCom.bids.length === 5 && umAlb.approach === 'relative', umAlb.approach);
must('UMUAHIA: UM4 omits inspection, priced at the average of four other responsive bids', /average of the 4 prices/.test(umRow('UM4').omissions[0].reason), umRow('UM4').omissions[0].reason);
must('UMUAHIA: the items are in mixed units, so content is weighted', umNc.aggregate === 'weighted', umNc.aggregate);
const s14 = umPts.contentPreference.section14;
const s14r = umRel.contentPreference.section14;
must('UMUAHIA: s.14 is engaged with a unique leader', s14.engaged && s14.leader !== null && s14.runnerUp !== null, JSON.stringify(s14.group));
must('UMUAHIA: the reading decides the award', umPts.award !== umRel.award, `${umPts.award} ${umRel.award}`);
must('UMUAHIA: a bid with higher content outside the group exists (the group is not the whole field)', umCom.bids.some((b) => !s14.group.includes(b.id) && umNcPct[b.id] > umNcPct[s14.leader]), 'outside');
must('UMUAHIA: UM2 carries a residual value', UMUAHIA.bids[1].residualValue === 3000, 'residual');
must('UMUAHIA: the s.16 row exists for an indigenous company with capacity', umRel.contentPreference.section16.length >= 1, JSON.stringify(umRel.contentPreference.section16));
noTie('UMUAHIA evaluated costs', umCom.bids);

/* ======================================================== OKIGWE, Expert

   A fishing and recompletion workover on Ekene-4. The same scope under a lump
   sum, a day rate and cost plus 10 percent, with the NPT fraction and the
   daily cost triangular, 4000 iterations on seed 70611; the company's
   should-cost at the NPT mode with 12 percent contingency and two partners;
   and the tender for it, five bids, a combined award at technical weight 0.75. */

const OK_PROGRAM = [
  { id: 'rigup', kind: 'flat', label: 'Move in and rig up on Ekene-4', durationHr: 36 },
  { id: 'kill', kind: 'flat', label: 'Kill the well and set the barrier', durationHr: 14 },
  { id: 'pull', kind: 'trip', label: 'Pull the completion', mdM: 1580, tripSpeedMPerHr: 450 },
  { id: 'fish-trip', kind: 'trip', label: 'Run and pull the fishing string', mdM: 1560, tripSpeedMPerHr: 700 },
  { id: 'fish', kind: 'flat', label: 'Fish the parted tubing', durationHr: 30 },
  { id: 'clean', kind: 'flat', label: 'Clean out to the perforations', durationHr: 18 },
  { id: 'run', kind: 'casing', label: 'Run the new completion', mdM: 1580, runSpeedMPerHr: 400, flatHr: 10 },
  { id: 'test', kind: 'flat', label: 'Test and hand over', durationHr: 20 },
  { id: 'rigdown', kind: 'flat', label: 'Rig down and move off', durationHr: 30 },
];
const OKIGWE = {
  scope: 'Fishing and recompletion workover on Ekene-4 (synthetic)',
  contracting: {
    duration: { program: OK_PROGRAM, nptFrac: { min: 0.04, mode: 0.12, max: 0.5 } },
    dailyCost: { min: 31000, mode: 34500, max: 46000 },
    fixedCost: 95000,
    lumpSum: { price: 640000 },
    dayRate: { rate: 41500, mobilisationFee: 120000 },
    reimbursable: { feeFraction: 0.1 },
    iterations: 4000,
    seed: 70611,
  },
  shouldCost: {
    program: OK_PROGRAM,
    nptFrac: 0.12,
    items: [
      { id: 'rig', label: 'Workover rig spread', basis: 'per-day', rate: 21800, category: 'intangible' },
      { id: 'supervision', label: 'Company supervision', basis: 'per-day', rate: 2900, category: 'intangible' },
      { id: 'fishing', label: 'Fishing tools and operator', basis: 'lump', value: 64000, category: 'intangible' },
      { id: 'fluids', label: 'Completion fluids', basis: 'lump', value: 38500, category: 'tangible' },
      { id: 'completion', label: 'Completion string', basis: 'lump', value: 142000, category: 'tangible' },
      { id: 'mob-demob', label: 'Mobilisation and demobilisation', basis: 'lump', value: 118000, category: 'intangible' },
    ],
    contingencyFrac: 0.12,
    partners: [{ name: 'Partner EK-B (synthetic)', working_interest: 35 }, { name: 'Partner EK-D (synthetic)', working_interest: 22.5 }],
    band: { low: 0.8, high: 1.25 },
  },
  tender: {
    criteria: [{ id: 'method', weight: 40, maxScore: 4 }, { id: 'crew', weight: 30, maxScore: 4 }, { id: 'equipment', weight: 20, maxScore: 4 }, { id: 'hse', weight: 10, maxScore: 4 }],
    passMark: 60,
    omissionRule: 'average',
    schedule: { minWeeks: 3, maxWeeks: 6, ratePerWeek: 0.006 },
    award: 'combined',
    technicalWeight: 0.75,
    priceMethod: 'lowest-ratio',
    technicalMethod: 'relative',
    bids: [
      { id: 'OK1', receivedAt: '2027-10-11T09:00:00Z', mandatory: [{ id: 'bid-security', met: true }], scores: { method: 3, crew: 3, equipment: 3, hse: 4 }, completionWeeks: 4,
        lines: [line('mob', 1, 118500), line('rig', 16, 23150.5), line('fishing', 1, 61200), line('fluids', 1, 40150), line('completion', 1, 139800)] },
      { id: 'OK2', receivedAt: '2027-10-11T10:30:00Z', mandatory: [{ id: 'bid-security', met: true }], scores: { method: 4, crew: 3, equipment: 4, hse: 3 }, completionWeeks: 3,
        lines: [line('mob', 1, 126000), line('rig', 16, 24480.25), line('fishing', 1, 66800), line('fluids', 1, 41200), line('completion', 1, 146250)] },
      { id: 'OK3', receivedAt: '2027-10-12T08:45:00Z', mandatory: [{ id: 'bid-security', met: true }], scores: { method: 3, crew: 2, equipment: 3, hse: 3 }, completionWeeks: 5,
        lines: [line('mob', 1, 104000), line('rig', 16, 21870.4), line('fishing', 1, 58900), line('fluids', 1, 37600), line('completion', 1, 133400)] },
      { id: 'OK4', receivedAt: '2027-10-12T14:05:00Z', mandatory: [{ id: 'bid-security', met: true }], scores: { method: 2, crew: 2, equipment: 2, hse: 3 }, completionWeeks: 4,
        lines: [line('mob', 1, 96000), line('rig', 16, 20450), line('fishing', 1, 52000), line('fluids', 1, 33900), line('completion', 1, 128700)] },
      { id: 'OK5', receivedAt: '2027-10-13T11:20:00Z', mandatory: [{ id: 'bid-security', met: true }], scores: { method: 4, crew: 4, equipment: 3, hse: 4 }, completionWeeks: 5,
        lines: [line('mob', 1, 131000), line('rig', 16, 25320.8), line('fishing', 1, 69500), line('fluids', 1, 42800), line('completion', 1, 151300)] },
    ],
  },
};
const okCt = success('OKIGWE contractTypes', T.contractTypes(clone(OKIGWE.contracting)));
const okT = success('OKIGWE evaluateTender', T.evaluateTender(clone(OKIGWE.tender)));
const okSc = success('OKIGWE shouldCost', T.shouldCost({ ...clone(OKIGWE.shouldCost), bids: okT.commercial.bids.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost })) }));
const okAward = okSc.bids.find((b) => b.id === okT.award);
must('OKIGWE: the reimbursable P90 is the low cost and sits below its P10', okCt.types.reimbursable.companyCost.p90 < okCt.types.reimbursable.companyCost.p10, 'order');
must('OKIGWE: the day rate carries part of the overrun, strictly between none and all', okCt.types.dayRate.overrun.companyShare > 0 && okCt.types.dayRate.overrun.companyShare < 1, okCt.types.dayRate.overrun.companyShare);
must('OKIGWE: the should-cost runs at the plan NPT, the mode of the contract NPT', OKIGWE.shouldCost.nptFrac === OKIGWE.contracting.duration.nptFrac.mode, 'npt');
must('OKIGWE: one bid fails the pass mark', okT.excluded.length === 1 && okT.excluded[0].stage === 'technical', JSON.stringify(okT.excluded));
must('OKIGWE: the award is not the lowest evaluated cost', okT.award !== okT.commercial.lowestEvaluatedCost, `${okT.award} ${okT.commercial.lowestEvaluatedCost}`);
must('OKIGWE: the technical weight sits in its para 5.50 cell (high risk, low value)', T.weightingBand({ risk: 'high', estimatedCostUsd: okSc.estimate, technicalWeight: OKIGWE.tender.technicalWeight }).withinBand, 'band');
must('OKIGWE: the operator share is 100 less the partners', okSc.split.operatorShare === 42.5 && okSc.split.valid, okSc.split.operatorShare);
noTie('OKIGWE evaluated costs', okT.commercial.bids);
noTie('OKIGWE ranking', okT.ranking.bids);

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'onitsha_on3_technical_percent', 'percent', onTech.bids.find((b) => b.id === 'ON3').technicalPercent],
  ['beginner', 'onitsha_on2_corrected_price', 'money', onRow('ON2').correctedPrice],
  ['beginner', 'onitsha_on3_omission_amount', 'money', onRow('ON3').omissions[0].amount],
  ['beginner', 'onitsha_on1_evaluated_cost', 'money', onRow('ON1').evaluatedCost],
  ['beginner', 'onitsha_on2_commercial_score', 'score', onRank.bids.find((b) => b.id === 'ON2').commercialScore],
  ['beginner', 'onitsha_top_combined_score', 'score', onRank.bids[0].combinedScore],
  ['intermediate', 'umuahia_um2_life_cycle_cost', 'money', umRow('UM2').lifeCycleCost],
  ['intermediate', 'umuahia_um4_evaluated_cost', 'money', umRow('UM4').evaluatedCost],
  ['intermediate', 'umuahia_alb_limit', 'money', umAlb.limit],
  ['intermediate', 'umuahia_um3_overall_content', 'percent', umNcPct.UM3],
  ['intermediate', 'umuahia_s14_lead_points', 'percent', s14.lead],
  ['intermediate', 'umuahia_s14_lead_relative', 'percent', s14r.lead],
  ['advanced', 'okigwe_dayrate_mean_cost', 'money', okCt.types.dayRate.companyCost.mean],
  ['advanced', 'okigwe_reimbursable_p90_cost', 'money', okCt.types.reimbursable.companyCost.p90],
  ['advanced', 'okigwe_dayrate_company_pays', 'money', okCt.types.dayRate.overrun.companyPays],
  ['advanced', 'okigwe_should_cost_estimate', 'money', okSc.estimate],
  ['advanced', 'okigwe_operator_amount', 'money', okSc.split.operatorAmount],
  ['advanced', 'okigwe_award_ratio', 'ratio', okAward.ratio],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite number away from zero`, Number.isFinite(r.value) && Math.abs(r.value) > 1e-3, r.value));
// NEVER GRADE A WHOLE NUMBER: a whole number sits inside every guard band.
ROWS.forEach((r) => must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3, r.value));
const byKey = Object.fromEntries(ROWS.map((r) => [r.key, r.value]));

/* ----------------------------------------------------------- the seed check */

// A value read from the Monte Carlo run, on the next seed: it must move by
// more than ten tolerances, so the seed is part of the answer.
const nextCt = T.contractTypes({ ...clone(OKIGWE.contracting), seed: OKIGWE.contracting.seed + 1 });
const nextSeed = [
  ['okigwe_dayrate_mean_cost', nextCt.types.dayRate.companyCost.mean],
  ['okigwe_reimbursable_p90_cost', nextCt.types.reimbursable.companyCost.p90],
  ['okigwe_dayrate_company_pays', nextCt.types.dayRate.overrun.companyPays],
];
nextSeed.forEach(([key, v]) => {
  const d = Math.abs(v - byKey[key]);
  must(`SEED: ${key} on the next seed moves by more than ten tolerances`, d > 10 * gradedTolerance(key), `${v} vs ${byKey[key]}`);
  NOTES.push(`SEED ${key}: the next seed moves it by ${(d / gradedTolerance(key)).toExponential(2)} tolerances`);
});
must('the programme days come from wellCost', WELLCOST.evaluateProgram({ activities: clone(OK_PROGRAM), nptFrac: 0 }).totals.totalDays > 0, 'days');

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`sc2_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
if (!process.argv.includes('--json') && !process.argv.includes('--inputs')) NOTES.forEach((n) => process.stderr.write(`  ${n}\n`));
process.stderr.write(`sc2_capstone: ${ASSERTS.length} label-and-call, scenario, tie and seed assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ ONITSHA, UMUAHIA, OKIGWE })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 34)}${pad('CLASS', 10)}${pad('VALUE', 24)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 34)}${pad(r.cls, 10)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 24)}${gradedTolerance(r.key)}\n`));
}
