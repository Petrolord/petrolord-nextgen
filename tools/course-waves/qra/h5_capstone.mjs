// THE EIGHTEEN GRADED H5 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three facilities, six graded fields each, every one a RETURN VALUE of the
// vendored engines/hse/qra.js. A gate that restates the formula validates
// nothing, so nothing here computes a frequency, an individual risk, a PLL, a
// FAR, a ratio or a present value by its own arithmetic: every number is read
// off an engine result object, and discriminate.mjs is where the wrong methods
// live.
//
//   UKPOKITI  Associate     a gas compression station and its camp: two event
//                           trees, the location-specific individual risk at
//                           two places, and the individual risk per annum of
//                           two people who move between three places
//   OGINI     Professional  a gas terminal beside a village: the crew's PLL and
//                           FAR, the village's F-N curve, the published line
//                           it is compared with and the one published point
//   EBUGHU    Expert        three proposed risk reduction measures, each put
//                           through the gross disproportion test under a
//                           different discounting convention
//
// Usage:
//   node h5_capstone.mjs            the human table
//   node h5_capstone.mjs --json     the rows make_fields.mjs writes
//   node h5_capstone.mjs --inputs   the three facilities, for oracle_check.py
//
// NOTHING HERE READS THE DIGEST OR THE TEACHING STREAMS, and the digest
// generator reads nothing here. The two run different facilities on different
// numbers, and gate_capstone_leak.mjs proves it in both directions.
//
// EVERY PROBABILITY OF DEATH IS A STATED INPUT. This course takes Pd and every
// frequency as given; the consequence models that produce a Pd belong to the H4
// course and are never run here. Every ignition probability and the flash fire
// and explosion split are STATED in the prompts as well, because the engine's
// Table 4.5 cells and its 0.6 / 0.4 preset rest on one reader's transcription
// (FINDINGS-qra.md sections 3 and 8), and a graded answer must not.
//
// THE VALUES OF PREVENTING A FATALITY ARE ILLUSTRATIVE: the two HSE figures the
// engine exports as illustration only, stated in each prompt with their year.
import process from 'node:process';
import { Q } from './qra_engine.mjs';

const TOLPATH = process.env.H5_TOLERANCE
  || '/root/wt-h5-nextgen/src/components/course/panels/qra/gradedTolerance.js';
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

/* ====================================================== UKPOKITI, Associate

   An onshore gas compression station with a workers' camp.
   COMPRESSOR  a continuous gas release in the compressor module: immediate
               ignition (a jet fire), else delayed ignition split into a flash
               fire and an explosion, else no ignition. Every probability is
               stated, the split among them.
   SOUR GAS    a sour gas release at the inlet manifold: isolated in time, late
               or not at all; a late or failed isolation reaches the camp only
               with the wind toward it, at two different probabilities. Two
               leaves pool into one outcome, "camp exposure".
   LOCATIONS   the control room, the compressor deck and the camp, each with a
               stated probability of death per outcome for a person present
               outdoors and unprotected there.
   PEOPLE      an operator given hours at each place, and a technician given a
               fraction of the year on the deck and hours elsewhere.
   ==================================================================== */

const UKPOKITI = Object.freeze({
  compressor: Object.freeze({
    initiatingFrequencyPerYr: 3.8e-4,
    immediateIgnitionProbability: 0.15,
    delayedIgnitionProbability: 0.37,
    vapourCloudSplit: Object.freeze({ flashFire: 0.6, explosion: 0.4 }),
  }),
  sourGas: Object.freeze({
    initiatingFrequencyPerYr: 1.7e-3,
    tree: Object.freeze({
      branches: Object.freeze([
        Object.freeze({ name: 'isolated in time', probability: 0.88, outcome: 'no camp exposure' }),
        Object.freeze({
          name: 'isolated late',
          probability: 0.08,
          next: Object.freeze({
            branches: Object.freeze([
              Object.freeze({ name: 'wind toward the camp', probability: 0.18, outcome: 'camp exposure' }),
              Object.freeze({ name: 'wind away from the camp', probability: 0.82, outcome: 'no camp exposure' }),
            ]),
          }),
        }),
        Object.freeze({
          name: 'not isolated',
          probability: 0.04,
          next: Object.freeze({
            branches: Object.freeze([
              Object.freeze({ name: 'wind toward the camp', probability: 0.31, outcome: 'camp exposure' }),
              Object.freeze({ name: 'wind away from the camp', probability: 0.69, outcome: 'no camp exposure' }),
            ]),
          }),
        }),
      ]),
    }),
  }),
  // probability of death of a person present outdoors and unprotected, per outcome
  deathProbability: Object.freeze({
    controlRoom: Object.freeze({ 'jet or pool fire': 0.04, 'flash fire': 0, explosion: 0.12 }),
    compressorDeck: Object.freeze({ 'jet or pool fire': 0.65, 'flash fire': 1, explosion: 0.85 }),
    camp: Object.freeze({ 'camp exposure': 0.26, explosion: 0.004 }),
  }),
  operator: Object.freeze({ compressorDeckHoursPerYr: 730, controlRoomHoursPerYr: 1095, campHoursPerYr: 2555 }),
  technician: Object.freeze({ compressorDeckFraction: 0.12, controlRoomHoursPerYr: 400, campHoursPerYr: 3980 }),
});

const ukC = success('Ukpokiti compressor event tree', Q.flammableReleaseEventTree(UKPOKITI.compressor));
const ukS = success('Ukpokiti sour gas event tree', Q.eventTree(UKPOKITI.sourGas));
const O = ukC.outcomeTotalsPerYr;
must('Ukpokiti compressor: four outcomes, the four the tree names',
  Object.keys(O).sort().join() === ['explosion', 'flash fire', 'jet or pool fire', 'no ignition'].join(), Object.keys(O).join());
must('Ukpokiti compressor: the outcome totals sum to the release frequency', Math.abs(ukC.totalFrequencyPerYr / 3.8e-4 - 1) < 1e-12, ukC.totalFrequencyPerYr);
must('Ukpokiti sour gas: two leaves pool into camp exposure',
  ukS.outcomes.filter((o) => o.outcome === 'camp exposure').length === 2, ukS.outcomes.length);
const lsir = (label, place, freqs) => success(label, Q.locationIndividualRisk({
  scenarios: Object.entries(UKPOKITI.deathProbability[place]).map(([name, pd]) => ({
    name, frequencyPerYr: freqs[name], fatalityProbability: pd,
  })),
}));
const ukCR = lsir('Ukpokiti control room LSIR', 'controlRoom', O);
const ukDeck = lsir('Ukpokiti compressor deck LSIR', 'compressorDeck', O);
const ukCamp = lsir('Ukpokiti camp LSIR', 'camp', { ...O, 'camp exposure': ukS.outcomeTotalsPerYr['camp exposure'] });
must('Ukpokiti: the flash fire contributes nothing in the control room', ukCR.contributions.find((c) => c.name === 'flash fire').contributionPerYr === 0, 'zero');
must('Ukpokiti: the deck carries more than ten times the control room', ukDeck.lsirPerYr > 10 * ukCR.lsirPerYr, `${ukDeck.lsirPerYr} ${ukCR.lsirPerYr}`);
const U = UKPOKITI;
const ukOp = success('Ukpokiti operator IRPA', Q.individualRiskPerAnnum({
  locations: [
    { name: 'compressor deck', lsirPerYr: ukDeck.lsirPerYr, hoursPerYr: U.operator.compressorDeckHoursPerYr },
    { name: 'control room', lsirPerYr: ukCR.lsirPerYr, hoursPerYr: U.operator.controlRoomHoursPerYr },
    { name: 'camp', lsirPerYr: ukCamp.lsirPerYr, hoursPerYr: U.operator.campHoursPerYr },
  ],
}));
const ukTech = success('Ukpokiti technician IRPA', Q.individualRiskPerAnnum({
  locations: [
    { name: 'compressor deck', lsirPerYr: ukDeck.lsirPerYr, occupancyFraction: U.technician.compressorDeckFraction },
    { name: 'control room', lsirPerYr: ukCR.lsirPerYr, hoursPerYr: U.technician.controlRoomHoursPerYr },
    { name: 'camp', lsirPerYr: ukCamp.lsirPerYr, hoursPerYr: U.technician.campHoursPerYr },
  ],
}));
must('Ukpokiti: both people spend less than the whole year across the three places',
  ukOp.totalOccupancyFraction < 1 && ukTech.totalOccupancyFraction < 1, `${ukOp.totalOccupancyFraction} ${ukTech.totalOccupancyFraction}`);
must('Ukpokiti: the deck carries most of the operator IRPA',
  ukOp.contributions[0].contributionPerYr > ukOp.irpaPerYr / 2, JSON.stringify(ukOp.contributions));

/* ==================================================== OGINI, Professional

   A gas terminal beside a village.
   CREW     five scenarios with the expected number of crew deaths each (not
            whole), one with none; 85 people on the crew roster, each exposed
            for 2184 hours a year.
   VILLAGE  five scenarios with the expected number of deaths in the village;
            one with exactly ten, one with none. Compared with the line the
            Purple Book Figure 6.8 caption prints and Bevi's three points lie
            on, and with the single R2P2 para 136 point.
   ==================================================================== */

const OGINI = Object.freeze({
  crew: Object.freeze([
    Object.freeze({ name: 'separator fire', frequencyPerYr: 4.3e-3, fatalities: 1.7 }),
    Object.freeze({ name: 'compressor house explosion', frequencyPerYr: 6.1e-4, fatalities: 7.3 }),
    Object.freeze({ name: 'dropped object during a lift', frequencyPerYr: 2.2e-2, fatalities: 0.45 }),
    Object.freeze({ name: 'riser rupture with escalation', frequencyPerYr: 9.5e-5, fatalities: 21 }),
    Object.freeze({ name: 'small fire, put out', frequencyPerYr: 3.4e-2, fatalities: 0 }),
  ]),
  crewPersons: 70,
  crewHoursPerPersonPerYr: 2184,
  village: Object.freeze([
    Object.freeze({ name: 'LPG sphere BLEVE', frequencyPerYr: 3.74e-7, fatalities: 140 }),
    Object.freeze({ name: 'propane cloud flash fire reaching the village', frequencyPerYr: 4.53e-6, fatalities: 55 }),
    Object.freeze({ name: 'H2S cloud reaching the village', frequencyPerYr: 1.31e-5, fatalities: 10 }),
    Object.freeze({ name: 'jet fire at the fence', frequencyPerYr: 4.4e-5, fatalities: 2.5 }),
    Object.freeze({ name: 'small release, no one reached', frequencyPerYr: 9.1e-5, fatalities: 0 }),
  ]),
  criterionPreset: 'vrom-establishments',
  pointPreset: 'r2p2-para-136',
  exceedanceStepEndsAtFatalities: 55,
});

const ogPll = success('Ogini crew PLL', Q.potentialLossOfLife({ scenarios: OGINI.crew }));
const ogFar = success('Ogini crew FAR', Q.fatalAccidentRateFromPll({
  pllPerYr: ogPll.pllPerYr, exposedHoursPerYr: OGINI.crewPersons * OGINI.crewHoursPerPersonPerYr,
}));
must('Ogini crew: the no-fatality fire adds nothing to the PLL', ogPll.contributions[4].pllPerYr === 0, ogPll.contributions[4].pllPerYr);
const ogCurve = success('Ogini village F-N curve', Q.fnCurve({ scenarios: OGINI.village }));
const tenOrMore = ogCurve.points.find((p) => p.fatalities === 10);
must('Ogini village: the curve has a corner at exactly ten', !!tenOrMore, JSON.stringify(ogCurve.points));
must('Ogini village: the no-fatality release is kept out of the curve and reported', ogCurve.zeroFatalityFrequencyPerYr === 9.1e-5, ogCurve.zeroFatalityFrequencyPerYr);
must('Ogini village: the area under the curve is sum f N', Math.abs(ogCurve.points.reduce((a, p, i) => a + p.cumulativeFrequencyPerYr * (p.fatalities - (i ? ogCurve.points[i - 1].fatalities : 0)), 0) / ogCurve.expectedFatalitiesPerYr - 1) < 1e-12, 'area');
const ogVrom = success('Ogini village against the VROM establishments line', Q.fnCriterionComparison({ scenarios: OGINI.village, criterion: OGINI.criterionPreset }));
must('Ogini village: the curve EXCEEDS the line', ogVrom.state === 'EXCEEDS', ogVrom.state);
const step = ogVrom.exceedances.find((e) => e.fatalities === OGINI.exceedanceStepEndsAtFatalities);
must('Ogini village: the step ending at 55 exceeds, and its range starts at the crossing inside the step',
  step && step.exceedsOverFatalities.from > 10 && step.exceedsOverFatalities.from < 55, JSON.stringify(step));
must('Ogini village: the worst ratio is on the step ending at 55', ogVrom.worstAtFatalities === 55, ogVrom.worstAtFatalities);
const ogR2 = success('Ogini village against the R2P2 point', Q.fnCriterionComparison({ scenarios: OGINI.village, criterion: OGINI.pointPreset }));
must('Ogini village: the curve is below the R2P2 point', ogR2.state === 'BELOW' && ogR2.checks.length === 1, ogR2.state);

/* ======================================================== EBUGHU, Expert

   Three proposed measures at a gas processing plant, each weighed by the HSE
   gross disproportion test.
   DELUGE       benefits at 1.5 percent and costs at 3.5 percent (the 2003 CBA
                checklist's limits), injuries counted beside fatalities.
   BLAST WALL   everything at 6 percent with the benefit uprated 4 percent a
                year (R2P2 Appendix 3), capital only.
   GAS DETECTION undiscounted, capital plus a yearly cost, weighed at a DF of 10.
   ==================================================================== */

const EBUGHU = Object.freeze({
  deluge: Object.freeze({
    deltaPllPerYr: 3.1e-3,
    vpf: 1336800,
    otherHarms: Object.freeze([
      Object.freeze({ name: 'serious injury', expectedCasesPerYr: 0.012, valuePerCase: 20500 }),
      Object.freeze({ name: 'slight injury', expectedCasesPerYr: 0.05, valuePerCase: 300 }),
    ]),
    lifetimeYears: 20,
    capitalCost: 21000,
    annualCost: 600,
    disproportionFactor: 6,
    benefitDiscountRate: 0.015,
    costDiscountRate: 0.035,
  }),
  blastWall: Object.freeze({
    deltaPllPerYr: 8.4e-4,
    vpf: 1000000,
    lifetimeYears: 25,
    capitalCost: 2900000,
    disproportionFactor: 3,
    benefitDiscountRate: 0.06,
    costDiscountRate: 0.06,
    benefitGrowthRate: 0.04,
  }),
  gasDetection: Object.freeze({
    deltaPllPerYr: 4.7e-4,
    vpf: 1336800,
    lifetimeYears: 15,
    capitalCost: 72300,
    annualCost: 4100,
    disproportionFactor: 10,
  }),
});

const cb = (label, m) => success(label, Q.costBenefit({ ...m, otherHarms: m.otherHarms ? m.otherHarms.map((h) => ({ ...h })) : [] }));
const ebD = cb('Ebughu deluge', EBUGHU.deluge);
const ebB = cb('Ebughu blast wall', EBUGHU.blastWall);
const ebG = cb('Ebughu gas detection', EBUGHU.gasDetection);
must('Ebughu deluge: NOT grossly disproportionate, and clear of the boundary',
  ebD.verdict === 'NOT_GROSSLY_DISPROPORTIONATE' && !ebD.atBoundary && ebD.costToBenefitRatio < 0.9 * EBUGHU.deluge.disproportionFactor, `${ebD.verdict} ${ebD.costToBenefitRatio}`);
must('Ebughu blast wall: grossly disproportionate', ebB.verdict === 'GROSSLY_DISPROPORTIONATE' && !ebB.atBoundary, ebB.verdict);
must('Ebughu gas detection: grossly disproportionate even at a DF of 10, the checklist\'s "unlikely" ceiling',
  ebG.verdict === 'GROSSLY_DISPROPORTIONATE' && EBUGHU.gasDetection.disproportionFactor === 10 && !ebG.atBoundary, `${ebG.verdict} ${ebG.costToBenefitRatio}`);
must('Ebughu deluge: the injuries carry part of the benefit', ebD.benefitPerYr > ebD.fatalityBenefitPerYr, `${ebD.benefitPerYr} ${ebD.fatalityBenefitPerYr}`);
must('Ebughu: the discounting basis says discounted for the deluge and the wall and undiscounted for the detection',
  /discounted$/.test(ebD.basis.discounting) && /discounted$/.test(ebB.basis.discounting) && /undiscounted$/.test(ebG.basis.discounting), 'basis');

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'ukpokiti_compressor_explosion_frequency_per_yr', 'peryr', O.explosion],
  ['beginner', 'ukpokiti_camp_exposure_frequency_per_yr', 'peryr', ukS.outcomeTotalsPerYr['camp exposure']],
  ['beginner', 'ukpokiti_control_room_lsir_per_yr', 'peryr', ukCR.lsirPerYr],
  ['beginner', 'ukpokiti_compressor_deck_lsir_per_yr', 'peryr', ukDeck.lsirPerYr],
  ['beginner', 'ukpokiti_operator_irpa_per_yr', 'peryr', ukOp.irpaPerYr],
  ['beginner', 'ukpokiti_technician_irpa_per_yr', 'peryr', ukTech.irpaPerYr],
  ['intermediate', 'ogini_crew_pll_per_yr', 'peryr', ogPll.pllPerYr],
  ['intermediate', 'ogini_crew_far', 'far', ogFar.far],
  ['intermediate', 'ogini_village_frequency_ten_or_more_per_yr', 'peryr', tenOrMore.cumulativeFrequencyPerYr],
  ['intermediate', 'ogini_village_vrom_max_ratio', 'ratio', ogVrom.maxRatio],
  ['intermediate', 'ogini_village_exceedance_from_fatalities', 'fatalities', step.exceedsOverFatalities.from],
  ['intermediate', 'ogini_village_r2p2_point_ratio', 'ratio', ogR2.maxRatio],
  ['advanced', 'ebughu_deluge_cost_to_benefit_ratio', 'ratio', ebD.costToBenefitRatio],
  ['advanced', 'ebughu_deluge_icaf_gbp', 'gbp', ebD.costPerFatalityPrevented],
  ['advanced', 'ebughu_deluge_maximum_reasonably_practicable_cost_gbp', 'gbp', ebD.maximumReasonablyPracticableCost],
  ['advanced', 'ebughu_blast_wall_cost_to_benefit_ratio', 'ratio', ebB.costToBenefitRatio],
  ['advanced', 'ebughu_blast_wall_icaf_gbp', 'gbp', ebB.costPerFatalityPrevented],
  ['advanced', 'ebughu_gas_detection_cost_to_benefit_ratio', 'ratio', ebG.costToBenefitRatio],
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
  const printed = r.value.toFixed(dp);
  const sig = printed.replace('.', '').replace(/^0+/, '').replace(/0+$/, '');
  must(`${r.key} prints with at least four significant figures at its class's precision`, sig.length >= 4, printed);
  must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3 || r.value < 1, r.value);
});

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h5_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h5_capstone: ${ASSERTS.length} label-and-call and scenario assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ UKPOKITI, OGINI, EBUGHU })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 58)}${pad('CLASS', 11)}${pad('VALUE', 22)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 58)}${pad(r.cls, 11)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 22)}${gradedTolerance(r.key)}\n`));
}
