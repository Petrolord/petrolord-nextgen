// Professional (intermediate) checks. Every value is an engine return through lib.mjs.
const withheld = (L, id) => { const x = L.V.generateVoiData(L.clone(L.GC.voi[id].inputs)); return x.withheld === true && x.kpis.voi === null && x.kpis.netVoi === null; };
const ekpan56 = (L) => {
  const ei = L.D.evii(L.outcomesAt(L.EKPAN_PRIOR), L.clone(L.EKPAN_ACTIONS), L.clone(L.EKPAN_SIGNALS), 8);
  const postPos = ei.perSignal[0].posterior[0] * 100; const postNeg = ei.perSignal[1].posterior[0] * 100;
  return L.V.generateVoiData({ projectName: 'EKPAN', decisionName: 'Drill EKPAN', decisionCost: 55,
    outcomes: [{ id: 1, name: 'Success', probability: 35, payoff: 420 }, { id: 2, name: 'Dry hole', probability: 65, payoff: -25 }],
    infoScenario: { name: 'CSEM survey', cost: 8, indicators: [
      { id: 1, name: 'Bright spot', probability: 56, conditionalProbabilities: [{ outcomeId: 1, probability: postPos }, { outcomeId: 2, probability: 100 - postPos }] },
      { id: 2, name: 'No bright spot', probability: 44, conditionalProbabilities: [{ outcomeId: 1, probability: postNeg }, { outcomeId: 2, probability: 100 - postNeg }] }] } });
};
export default [
  // final 11: both marks are the tie rule
  { q: 'intermediate final 11', where: 'key', printed: 'The tie rule decides both', value: (L) => { const r = L.lottery(L.SWITCH); const t = L.infoTree(24.825); return r.indifferent === true && r.actionIndex === 0 && t.indifferent === true && t.bestBranchIndex === 0; } },
  { q: 'intermediate final 11', where: 'explanation', printed: '-7.11e-15', value: (L) => (L.D.bestActionEmv(L.outcomesAt(L.SWITCH), [L.EKPAN_ACTIONS[0]]).emv - L.D.bestActionEmv(L.outcomesAt(L.SWITCH), [L.EKPAN_ACTIONS[1]]).emv).toExponential(2) },
  { q: 'intermediate final 11', where: 'explanation', printed: '75.7500', value: (L) => L.infoTree(24.825).emv },
  // final 9, 23, 24, 28, 29, 30: the Analyzer withholds or refuses
  { q: 'intermediate final 9', where: 'explanation', printed: 'the Analyzer withholds the value', value: (L) => withheld(L, 'identicalPosteriorsWithheld') },
  { q: 'intermediate final 23', where: 'key', printed: '75.75 and 52.00 only', value: (L) => { const x = ekpan56(L); return x.withheld === true && x.kpis.emvWithoutInfo === '75.75' && x.kpis.evpi === '52.00' && x.tree === null; } },
  { q: 'intermediate final 23', where: 'explanation', printed: '0.404952', value: (L) => ekpan56(L).consistency.implied[0] },
  { q: 'intermediate final 24', where: 'explanation', printed: 'The Analyzer withholds on those 56 percent inputs', value: (L) => ekpan56(L).withheld === true },
  { q: 'intermediate final 25', where: 'explanation', printed: 'the verdict says the information costs what it is worth', value: (L) => /Since this rounds to zero, the information costs what it is worth/.test(L.analyzerAt(33).insights) },
  { q: 'intermediate final 25', where: 'explanation', printed: '24.8250', value: (L) => L.grossEvii() },
  { q: 'intermediate final 29', where: 'key', printed: '15.00 and 63.00', value: (L) => { const x = L.V.generateVoiData(L.clone(L.GC.voi.identicalPosteriorsWithheld.inputs)); return x.withheld === true && `${x.kpis.emvWithoutInfo} and ${x.kpis.evpi}` === '15.00 and 63.00'; } },
  { q: 'intermediate final 30', where: 'key', printed: 'the row is refused with a message naming 130 percent', value: (L) => /sum to 130 percent/.test(L.refusal(() => L.V.generateVoiData(L.clone(L.G.voiRefusals.find((c) => c.id === 'posteriorsAboveHundred').inputs))) || '') },
  // final 32, m01 4: EVPI unchanged by the label on a tied outcome row
  { q: 'intermediate final 32', where: 'key', printed: '52.0000', value: (L) => L.D.evpi(L.outcomesAt(L.EKPAN_PRIOR), [L.EKPAN_ACTIONS[0], L.EKPAN_ACTIONS[2], L.EKPAN_ACTIONS[1]]).evpi },
  { q: 'intermediate m01 4', where: 'key', printed: '127.7500', value: (L) => L.D.evpi(L.outcomesAt(L.EKPAN_PRIOR), [L.EKPAN_ACTIONS[0], L.EKPAN_ACTIONS[2], L.EKPAN_ACTIONS[1]]).evWithPerfect },
  // m01 9: the prior best action at the switch
  { q: 'intermediate m01 9', where: 'key', printed: 'A tie with indifferent true, and Drill, listed first, carries the action index', value: (L) => { const r = L.lottery(L.SWITCH); return r.indifferent === true && L.EKPAN_ACTIONS[r.actionIndex].label === 'Drill'; } },
  { q: 'intermediate m01 9', where: 'key', printed: '61.7143', value: (L) => L.D.evpi(L.outcomesAt(L.SWITCH), L.clone(L.EKPAN_ACTIONS)).evpi },
  // m02 12: the Analyzer withholds
  { q: 'intermediate m02 12', where: 'key', printed: 'the Analyzer withholds that value', value: (L) => withheld(L, 'identicalPosteriorsWithheld') },
  // m03 8, 9: ties on the information tree
  { q: 'intermediate m03 8', where: 'key', printed: 'the engine reports the tie and marks the first listed', value: (L) => { const t = L.infoTree(24.825); return t.indifferent === true && t.bestBranchIndex === 0; } },
  { q: 'intermediate m03 8', where: 'key', printed: '75.7500', value: (L) => L.infoTree(24.825).emv },
  { q: 'intermediate m03 9', where: 'key', printed: 'the tie is reported either way', value: (L) => { const c = L.GC.informationTree.costExactlyNetZero; const t = L.D.buildInformationTree({ outcomes: c.outcomes, actions: c.actions, signals: c.signals, infoCost: c.infoCost }); const a = L.D.rollback(L.clone(t)); t.branches.reverse(); const b = L.D.rollback(t); return a.indifferent === true && b.indifferent === true && b.branches[b.bestBranchIndex].label !== a.branches[a.bestBranchIndex].label; } },
  { q: 'intermediate m03 9', where: 'key', printed: '43.0000', value: (L) => { const c = L.GC.informationTree.costExactlyNetZero; const t = L.D.buildInformationTree({ outcomes: c.outcomes, actions: c.actions, signals: c.signals, infoCost: c.infoCost }); t.branches.reverse(); return L.D.rollback(t).emv; } },
  // m05 3, 4, 5, 6
  { q: 'intermediate m05 3', where: 'key', printed: 'Indicator chances sum to 110 percent, expected 100', value: (L) => { const f = L.clone(L.GC.voi.suiteDefaults.inputs); f.infoScenario.indicators[1].probability = 70; return L.refusal(() => L.V.generateVoiData(f)) === 'Indicator chances sum to 110 percent, expected 100'; } },
  { q: 'intermediate m05 4', where: 'key', printed: 'EMV without information 75.75 and EVPI 52.00', value: (L) => { const x = ekpan56(L); return x.withheld === true && x.kpis.emvWithoutInfo === '75.75' && x.kpis.evpi === '52.00'; } },
  { q: 'intermediate m05 5', where: 'key', printed: 'Outcome chances given "Positive Seismic" sum to 130 percent, expected 100', value: (L) => L.refusal(() => L.V.generateVoiData(L.clone(L.G.voiRefusals.find((c) => c.id === 'posteriorsAboveHundred').inputs))) },
  { q: 'intermediate m05 6', where: 'explanation', printed: 'the Analyzer withholds when an implied chance sits more than 0.005 from it', value: (L) => withheld(L, 'withheldPastHalfPercent') },
  // m05 13: the verdict at 33 and the tied root
  { q: 'intermediate m05 13', where: 'key', printed: 'The verdict says it rounds to zero', value: (L) => { const x = L.V.generateVoiData(L.clone(L.GC.voi.costExactlyValue.inputs)); return x.kpis.netVoi === '0.00' && /Since this rounds to zero/.test(x.insights); } },
  { q: 'intermediate m05 13', where: 'key', printed: 'the root marks "Acquire 3D Seismic Survey", the first listed of two tied branches', value: (L) => { const t = L.V.generateVoiData(L.clone(L.GC.voi.costExactlyValue.inputs)).tree; return t.indifferent === true && t.bestBranchIndex === 0 && t.branches[0].label === 'Acquire 3D Seismic Survey'; } },
  { q: 'intermediate m05 13', where: 'explanation', printed: '-7.00', value: (L) => L.analyzerAt(40).kpis.netVoi },
  // m06 4, 9
  { q: 'intermediate m06 4', where: 'key', printed: 'the two root branches tie at 75.7500 and the engine marks the branch listed first', value: (L) => { const t = L.infoTree(24.825); return t.indifferent === true && t.bestBranchIndex === 0 && t.emv.toFixed(4) === '75.7500'; } },
  { q: 'intermediate m06 9', where: 'key', printed: 'EMV without information 15.00 and EVPI 63.00, withholding the rest', value: (L) => withheld(L, 'identicalPosteriorsWithheld') },
];
