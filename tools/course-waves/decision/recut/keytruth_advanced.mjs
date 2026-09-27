// Expert (advanced) checks. Every value is an engine return through lib.mjs.
const withheld = (L, id) => { const x = L.V.generateVoiData(L.clone(L.GC.voi[id].inputs)); return x.withheld === true && x.kpis.voi === null && x.kpis.netVoi === null; };
const voiRefusal = (L, id) => L.refusal(() => L.V.generateVoiData(L.clone(L.G.voiRefusals.find((c) => c.id === id).inputs)));
const tieCase = (L) => L.V.generateVoiData(L.TIE_FORM());
const BOTH = "'Drill Exploration Well' and 'Do Not Drill Exploration Well' both come to that figure";
const thirdsColumn = (L) => L.D.evii([{ label: 'Success', probability: 0.3 }, { label: 'Dry hole', probability: 0.7 }], L.clone(L.GC.evpi.prospect.actions),
  [{ label: 'r1', likelihoods: [0.333333, 0.2] }, { label: 'r2', likelihoods: [0.333333, 0.3] }, { label: 'r3', likelihoods: [0.333333, 0.5] }], 0);
export default [
  // final 3: both edges accepted
  { q: 'advanced final 3', where: 'key', printed: 'It accepts both', value: (L) => L.refusal(() => L.D.rollback(L.thirds(0.333333))) === null && L.D.impliedPriors(L.GC.impliedPriors.justInsideTolerance.outcomes, L.GC.impliedPriors.justInsideTolerance.indicators).consistent === true },
  { q: 'advanced final 3', where: 'key', printed: '59.9999', value: (L) => L.D.rollback(L.thirds(0.333333)).emv },
  { q: 'advanced final 3', where: 'explanation', printed: '59.9999', value: (L) => L.D.rollback(L.thirds(0.333333)).emv },
  // final 4: 20.0000 means the cost was left out; text and empty entries are refused
  { q: 'advanced final 4', where: 'key', printed: 'a cost left out of the saved tree', value: (L) => L.D.rollback(L.dec(undefined)).branches[0].branchValue === 20 },
  { q: 'advanced final 4', where: 'explanation', printed: '15.0000', value: (L) => L.D.rollback(L.dec(5)).branches[0].branchValue },
  { q: 'advanced final 4', where: 'explanation', printed: 'A cost typed as "abc" or left as an empty entry is refused by node label', value: (L) => /\(at node "d"\)$/.test(L.refusal(() => L.D.rollback(L.dec('abc'))) || '') && /\(at node "d"\)$/.test(L.refusal(() => L.D.rollback(L.dec(''))) || '') },
  // final 6: both screens show the tie
  { q: 'advanced final 6', where: 'key', printed: 'the brief names A, B and C together on the first-move row and writes Indifferent at the precision shown', value: (L) => { const b = L.briefRows(L.published('equalEmvTie')); return b.move === 'Indifferent: "A", "B" and "C" come to the same figure' && b.adv === 'Indifferent at the precision shown'; } },
  { q: 'advanced final 6', where: 'key', printed: "the Analyzer's insight says both actions come to the same figure", value: (L) => tieCase(L).insights.includes(BOTH) },
  // final 7: 32.996 and 33.004
  { q: 'advanced final 7', where: 'key', printed: 'both cards read 0.00 and both verdicts say the value rounds to zero', value: (L) => [32.996, 33.004].every((c) => { const x = L.analyzerAt(c); return x.kpis.netVoi === '0.00' && /Since this rounds to zero/.test(x.insights); }) },
  { q: 'advanced final 7', where: 'key', printed: '33.00', value: (L) => L.analyzerAt(10).kpis.voi },
  // final 15: a chance root on both screens
  { q: 'advanced final 15', where: 'key', printed: '-3.0000', value: (L) => L.D.rollback(L.clone(L.GC.rollback.chanceRootWithBranchCosts.tree)).emv },
  // final 18: the nudged thirds leave 60.0000
  { q: 'advanced final 18', where: 'explanation', printed: '59.9999', value: (L) => L.D.rollback(L.thirds(0.333333)).emv },
  { q: 'advanced final 18', where: 'key', printed: 'the EMV leaves 60.0000', value: (L) => L.refusal(() => L.D.rollback(L.thirds(0.333))) !== null && Math.abs(L.D.rollback(L.thirds([0.333, 0.333, 0.334])).emv - 60) > 1e-6 },
  // final 32: left out reads 0; text and negative are refused
  { q: 'advanced final 32', where: 'key', printed: 'At 20.0000 the cost was left out of the tree and read as 0', value: (L) => L.D.rollback(L.dec(undefined)).branches[0].branchValue === 20 },
  { q: 'advanced final 32', where: 'key', printed: 'the refusal comes from a cost typed as text or below zero', value: (L) => /Branch "A"/.test(L.refusal(() => L.D.rollback(L.dec('abc'))) || '') && /Branch "A" has a negative cost/.test(L.refusal(() => L.D.rollback(L.dec(-5))) || '') },
  { q: 'advanced final 32', where: 'explanation', printed: '15.0000', value: (L) => L.D.rollback(L.dec('5')).branches[0].branchValue },
  // final 33: a tie at both
  { q: 'advanced final 33', where: 'key', printed: 'A tie at both, each marking Drill as the first listed', value: (L) => { const r = L.lottery(L.SWITCH); const a = L.drillFarmOutAt(0.2); return r.indifferent === true && L.EKPAN_ACTIONS[r.actionIndex].label === 'Drill' && a.indifferent === true && a.branches[a.bestBranchIndex].label === 'Drill'; } },
  { q: 'advanced final 33', where: 'key', printed: '12.0000', value: (L) => L.drillFarmOutAt(0.2).emv },
  { q: 'advanced final 33', where: 'key', printed: '-7.11e-15', value: (L) => (L.D.bestActionEmv(L.outcomesAt(L.SWITCH), [L.EKPAN_ACTIONS[0]]).emv - L.D.bestActionEmv(L.outcomesAt(L.SWITCH), [L.EKPAN_ACTIONS[1]]).emv).toExponential(2) },
  // final 34: the tie case
  { q: 'advanced final 34', where: 'key', printed: 'acting and Do Not are both worth 0', value: (L) => { const x = tieCase(L); return x.kpis.emvWithoutInfo === '0.00' && x.insights.includes(BOTH); } },
  { q: 'advanced final 34', where: 'key', printed: '25.00', value: (L) => tieCase(L).kpis.voi },
  { q: 'advanced final 34', where: 'explanation', printed: '61.7143', value: (L) => L.D.evpi(L.outcomesAt(L.SWITCH), L.clone(L.EKPAN_ACTIONS)).evpi },
  // final 35: the brief at 24.8250
  { q: 'advanced final 35', where: 'key', printed: '75.7500', value: (L) => L.infoTree(24.825).emv },
  { q: 'advanced final 35', where: 'key', printed: 'a first move naming "Acquire CSEM survey" and "No further information" as coming to the same figure', value: (L) => L.briefRows(L.infoTree(24.825)).move === 'Indifferent: "Acquire CSEM survey" and "No further information" come to the same figure' },
  { q: 'advanced final 35', where: 'key', printed: 'an advantage of Indifferent at the precision shown', value: (L) => L.briefRows(L.infoTree(24.825)).adv === 'Indifferent at the precision shown' },
  // final 39: all four refused
  { q: 'advanced final 39', where: 'key', printed: 'All four', value: (L) => {
    const one = (payoff, cost = 5) => L.refusal(() => L.D.rollback(L.dec(cost, payoff)));
    return [one({ p90: 185, p50: 390, p10: 710 }), one('20abc'), one(''), one(20, 'abc')].every((m) => m && m.endsWith('")'));
  } },
  // final 41, 28, 19, 20: the Analyzer withholds or refuses
  { q: 'advanced final 41', where: 'explanation', printed: '43.0000', value: (L) => L.D.evii(L.clone(L.GC.evii.uselessSignal.outcomes), L.clone(L.GC.evii.uselessSignal.actions), L.clone(L.GC.evii.uselessSignal.signals), 0).perSignal[0].emv },
  { q: 'advanced final 28', where: 'explanation', printed: 'The Analyzer never clips and never repairs', value: (L) => withheld(L, 'contradictingPosterior') },
  { q: 'advanced final 19', where: 'explanation', printed: 'this case never reaches the implied-prior test', value: (L) => /sum to 110 percent/.test(voiRefusal(L, 'posteriorsOffsetButPriorsAgree') || '') },
  { q: 'advanced final 20', where: 'key', printed: 'which is why the Analyzer tests the inputs', value: (L) => withheld(L, 'certainPosteriorsWithheld') && /Indicator chances sum to 110/.test(voiRefusal(L, 'indicatorChancesAboveHundred') || '') },
  // final 42: a likelihood column at six places passes
  { q: 'advanced final 42', where: 'key', printed: 'A value', value: (L) => typeof thirdsColumn(L).evii === 'number' },
  { q: 'advanced final 42', where: 'explanation', printed: 'summing to 0.999998, is refused', value: (L) => { const c = L.GC.eviiRefusals.likelihoodColumnShortByTwoMillionths; return /sum to 0\.999998/.test(L.refusal(() => L.D.evii(c.outcomes, c.actions, c.signals, c.infoCost || 0)) || ''); } },
  // m01
  { q: 'advanced m01 2', where: 'key', printed: 'EMV without information 15.00 and EVPI 63.00', value: (L) => { const x = L.V.generateVoiData(L.clone(L.GC.voi.identicalPosteriorsWithheld.inputs)); return x.withheld === true && x.kpis.emvWithoutInfo === '15.00' && x.kpis.evpi === '63.00'; } },
  { q: 'advanced m01 4', where: 'key', printed: 'Consistent true', value: (L) => L.D.impliedPriors(L.GC.impliedPriors.justInsideTolerance.outcomes, L.GC.impliedPriors.justInsideTolerance.indicators).consistent === true },
  { q: 'advanced m01 10', where: 'key', printed: '0.420000', value: (L) => L.V.generateVoiData(L.clone(L.GC.voi.contradictingPosterior.inputs)).consistency.implied[0] },
  { q: 'advanced m01 13', where: 'key', printed: 'withholds the value on IRRI while still showing 15.00 and 63.00', value: (L) => withheld(L, 'identicalPosteriorsWithheld') && /130 percent/.test(voiRefusal(L, 'posteriorsAboveHundred') || '') },
  { q: 'advanced m01 15', where: 'key', printed: 'Indicator chances sum to 110 percent, expected 100', value: (L) => voiRefusal(L, 'indicatorChancesAboveHundred') },
  // m02 2
  { q: 'advanced m02 2', where: 'key', printed: 'Farm out and Relinquish both pay 0.0000 in Dry and tie', value: (L) => { const c = L.GC.evpi.threeOutcomesFourActions; return L.same(c.expected.perfectBestActionIndex, [0, 0, 2]) && L.D.evpi(c.outcomes, c.actions).evWithPerfect.toFixed(4) === '133.0000'; } },
  // m03 5, 6, 10
  { q: 'advanced m03 5', where: 'key', printed: 'Indifferent: "A", "B" and "C" come to the same figure', value: (L) => L.briefRows(L.published('equalEmvTie')).move },
  { q: 'advanced m03 5', where: 'key', printed: 'Indifferent at the precision shown', value: (L) => L.briefRows(L.published('equalEmvTie')).adv },
  { q: 'advanced m03 5', where: 'explanation', printed: 'The engine still marks A, the first listed', value: (L) => { const a = L.published('equalEmvTie'); return a.branches[a.bestBranchIndex].label === 'A' && L.same(a.tiedIndices, [0, 1]); } },
  { q: 'advanced m03 6', where: 'prompt', printed: '-3.0000', value: (L) => L.D.rollback(L.clone(L.GC.rollback.chanceRootWithBranchCosts.tree)).emv },
  { q: 'advanced m03 6', where: 'explanation', printed: '-55.0000', value: (L) => L.briefRows(L.published('allNegative')).next },
  { q: 'advanced m03 10', where: 'key', printed: 'Distribution payoff has no finite mean', value: (L) => /^Distribution payoff has no finite mean \(at node "/.test(L.refusal(() => L.D.rollback(L.dec(5, { p90: 185, p50: 390, p10: 710 }))) || '') },
  // m04
  { q: 'advanced m04 1', where: 'key', printed: 'An emv just under 60.0000', value: (L) => { const e = L.D.rollback(L.thirds(0.333333)).emv; return e < 60 && e > 59.99; } },
  { q: 'advanced m04 1', where: 'explanation', printed: '59.9999', value: (L) => L.D.rollback(L.thirds(0.333333)).emv },
  { q: 'advanced m04 1', where: 'explanation', printed: 'the sum is 0.999000 and the node is refused', value: (L) => /sum to 0\.999000/.test(L.refusal(() => L.D.rollback(L.thirds(0.333))) || '') },
  { q: 'advanced m04 2', where: 'explanation', printed: '4.3e-18', value: (L) => (Math.abs(L.D.impliedPriors(L.GC.impliedPriors.justInsideTolerance.outcomes, L.GC.impliedPriors.justInsideTolerance.indicators).deltas[0]) - 0.005).toExponential(1) },
  { q: 'advanced m04 3', where: 'key', printed: 'It withholds the value of information', value: (L) => withheld(L, 'withheldPastHalfPercent') },
  { q: 'advanced m04 4', where: 'key', printed: 'Both edges hold', value: (L) => L.refusal(() => L.D.rollback(L.thirds(0.333333))) === null && L.D.impliedPriors(L.GC.impliedPriors.justInsideTolerance.outcomes, L.GC.impliedPriors.justInsideTolerance.indicators).consistent === true },
  { q: 'advanced m04 5', where: 'key', printed: 'A refusal naming branch A', value: (L) => (L.refusal(() => L.D.rollback(L.dec('abc'))) || '').startsWith('Branch "A" has a cost that is not a finite number ("abc")') },
  { q: 'advanced m04 5', where: 'explanation', printed: '20.0000', value: (L) => L.D.rollback(L.dec(undefined)).emv },
  { q: 'advanced m04 6', where: 'key', printed: 'Each stops the rollback with its own message naming the node', value: (L) => [L.dec('abc'), L.dec(-5), L.dec(5, '')].every((t) => /\(at node "[^"]+"\)$/.test(L.refusal(() => L.D.rollback(t)) || '')) },
  { q: 'advanced m04 7', where: 'key', printed: 'enter a receipt as a payoff', value: (L) => (L.refusal(() => L.D.rollback(L.dec(-5))) || '').includes('has a negative cost (-5); a cost cannot be negative: enter a receipt as a payoff') },
  { q: 'advanced m04 7', where: 'explanation', printed: '15.0000', value: (L) => L.D.rollback(L.dec(5)).emv },
  { q: 'advanced m04 12', where: 'key', printed: 'IRRI is withheld and still reports EMV without information 15.00 and EVPI 63.00', value: (L) => withheld(L, 'identicalPosteriorsWithheld') },
  { q: 'advanced m04 13', where: 'key', printed: 'indicatorChancesAboveHundred', value: (L) => /Indicator chances sum to 110/.test(voiRefusal(L, 'indicatorChancesAboveHundred') || '') },
  { q: 'advanced m04 15', where: 'explanation', printed: '59.9999', value: (L) => L.D.rollback(L.thirds(0.333333)).emv },
  // m05
  { q: 'advanced m05 3', where: 'key', printed: 'the engine reports the two as tied in either order', value: (L) => L.tiePair(false).indifferent === true && L.tiePair(true).indifferent === true },
  { q: 'advanced m05 4', where: 'key', printed: 'both come to $0.00M', value: (L) => tieCase(L).insights.startsWith(`The Expected Monetary Value (EMV) without new information is $0.00M, and ${BOTH}`) },
  { q: 'advanced m05 4', where: 'explanation', printed: '25.00', value: (L) => tieCase(L).kpis.voi },
  { q: 'advanced m05 5', where: 'key', printed: 'Recommended first move, which names A, B and C as coming to the same figure', value: (L) => L.briefRows(L.published('equalEmvTie')).move === 'Indifferent: "A", "B" and "C" come to the same figure' },
  { q: 'advanced m05 5', where: 'key', printed: 'Decision advantage, which reads Indifferent at the precision shown', value: (L) => L.briefRows(L.published('equalEmvTie')).adv === 'Indifferent at the precision shown' },
  { q: 'advanced m05 6', where: 'key', printed: 'Since this rounds to zero, the information costs what it is worth, so acquiring it or not is indifferent on EMV grounds', value: (L) => L.analyzerAt(32.996).insights.match(/Since this[^.]*\./)[0].slice(0, -1) },
  { q: 'advanced m05 6', where: 'explanation', printed: '0.01', value: (L) => L.analyzerAt(32.99).kpis.netVoi },
  { q: 'advanced m05 6', where: 'explanation', printed: '-0.01', value: (L) => L.analyzerAt(33.01).kpis.netVoi },
  { q: 'advanced m05 7', where: 'key', printed: 'the card reads 0.00 and the verdict says the value rounds to zero', value: (L) => { const x = L.analyzerAt(33.004); return x.kpis.netVoi === '0.00' && /Since this rounds to zero/.test(x.insights); } },
  { q: 'advanced m05 8', where: 'explanation', printed: 'both round to a 0.00 card with the rounds-to-zero sentence', value: (L) => [32.996, 33.004].every((c) => { const x = L.analyzerAt(c); return x.kpis.netVoi === '0.00' && /Since this rounds to zero/.test(x.insights); }) },
  // m06
  { q: 'advanced m06 2', where: 'explanation', printed: 'The Analyzer reports 15.00 and 63.00 and withholds the rest', value: (L) => withheld(L, 'certainPosteriorsWithheld') },
  { q: 'advanced m06 8', where: 'explanation', printed: 'the engine reports the tie and marks the acquisition', value: (L) => { const t = L.infoTree(L.grossEvii()); return t.indifferent === true && t.branches[t.bestBranchIndex].label === L.INFO_LABEL; } },
  { q: 'advanced m06 13', where: 'key', printed: 'Accepted just below 60.0000', value: (L) => { const e = L.D.rollback(L.thirds(0.333333)).emv; return e < 60 && e > 59.99; } },
  { q: 'advanced m06 13', where: 'explanation', printed: '59.9999', value: (L) => L.D.rollback(L.thirds(0.333333)).emv },
  { q: 'advanced m06 14', where: 'explanation', printed: 'An implied 0.306000 is inconsistent with or without the allowance', value: (L) => L.D.impliedPriors(L.GC.impliedPriors.justOutsideTolerance.outcomes, L.GC.impliedPriors.justOutsideTolerance.indicators).consistent === false },
];
