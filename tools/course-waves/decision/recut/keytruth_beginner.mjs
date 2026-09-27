// Associate (beginner) checks. Every value is an engine return through lib.mjs.
const deepThirds = (L) => {
  const t = L.clone(L.GC.rollback.deepAlternation.tree);
  const deepest = t.branches[0].node.branches[0].node.branches[0].node;
  deepest.branches = [50, -20, 10].map((v, i) => ({ label: `t${i}`, probability: 0.333333, node: L.T(`t${i}`, v) }));
  return t;
};
export default [
  // final 7: thirds at six places accepted at any depth
  { q: 'beginner final 7', where: 'key', printed: 'The root EMV', value: (L) => L.refusal(() => L.D.rollback(deepThirds(L))) === null },
  { q: 'beginner final 7', where: 'explanation', printed: '0.200000 two levels down still refuses a whole tree', value: (L) => /sum to 0\.200000/.test(L.refusal(() => L.D.rollback(L.clone(L.GC.rollbackRefusals.nestedRefusal.tree))) || '') },
  // final 19: C, A, B -> A and B tied, A marked; all three at card precision
  { q: 'beginner final 19', where: 'key', printed: 'A and B tie, and the engine marks the first listed', value: (L) => { const a = L.published('equalEmvTie', [2, 0, 1]); return L.same(a.tiedIndices, [1, 2]) && a.branches[a.bestBranchIndex].label === 'A'; } },
  { q: 'beginner final 19', where: 'explanation', printed: 'all three round to the same 30.00 card', value: (L) => L.same(L.published('equalEmvTie', [2, 0, 1]).tiedIndicesAtCardPrecision, [0, 1, 2]) },
  { q: 'beginner final 19', where: 'explanation', printed: '30.0000', value: (L) => L.published('equalEmvTie', [2, 0, 1]).emv },
  // final 20: the switch reordered
  { q: 'beginner final 20', where: 'key', printed: 'The same two actions tied', value: (L) => { const r = L.lottery(L.SWITCH, [L.EKPAN_ACTIONS[1], L.EKPAN_ACTIONS[0], L.EKPAN_ACTIONS[2]]); return r.indifferent === true && L.same(r.tiedIndices, [0, 1]); } },
  { q: 'beginner final 20', where: 'key', printed: 'Farm out now carrying the action index', value: (L) => { const acts = [L.EKPAN_ACTIONS[1], L.EKPAN_ACTIONS[0], L.EKPAN_ACTIONS[2]]; return acts[L.lottery(L.SWITCH, acts).actionIndex].label === 'Farm out'; } },
  { q: 'beginner final 20', where: 'prompt', printed: '21.7143', value: (L) => L.lottery(L.SWITCH).emv },
  // final 34, 38
  { q: 'beginner final 34', where: 'explanation', printed: 'marks Drill because it is listed first', value: (L) => { const a = L.drillFarmOutAt(0.2); return a.indifferent === true && a.branches[a.bestBranchIndex].label === 'Drill'; } },
  { q: 'beginner final 34', where: 'explanation', printed: '27.5000', value: (L) => L.drillFarmOutAt(0.25).branches[0].branchValue },
  { q: 'beginner final 38', where: 'key', printed: 'the engine reports the two branches tied and marks acquiring', value: (L) => { const t = L.infoTree(24.825); return t.indifferent === true && t.branches[t.bestBranchIndex].label === L.INFO_LABEL; } },
  { q: 'beginner final 38', where: 'explanation', printed: '24.8250', value: (L) => L.grossEvii() },
  // final 4: the checks now include money
  { q: 'beginner final 4', where: 'prompt', printed: 'every cost and payoff a finite number', value: (L) => L.refusal(() => L.D.rollback(L.dec('abc'))) !== null && L.refusal(() => L.D.rollback(L.dec(5, ''))) !== null },
  // final 9, m02 7: the chance-root label (Suite restated) on an engine chance root
  { q: 'beginner final 9', where: 'key', printed: '-3.0000', value: (L) => L.D.rollback(L.clone(L.GC.rollback.chanceRootWithBranchCosts.tree)).emv },
  { q: 'beginner m02 7', where: 'key', printed: '-3.0000', value: (L) => L.D.rollback(L.clone(L.GC.rollback.chanceRootWithBranchCosts.tree)).emv },
  // m01 10: B first -> B marked, A and B tied
  { q: 'beginner m01 10', where: 'key', printed: 'the engine reports A and B tied and marks the first listed', value: (L) => { const a = L.published('equalEmvTie', [1, 0, 2]); return L.same(a.tiedIndices, [0, 1]) && a.branches[a.bestBranchIndex].label === 'B'; } },
  { q: 'beginner m01 10', where: 'key', printed: '30.0000', value: (L) => L.published('equalEmvTie', [1, 0, 2]).emv },
  // m01 8, m01 9, m02 10: the no-mean refusal
  { q: 'beginner m02 10', where: 'key', printed: 'distribution payoff has no finite mean', value: (L) => /^Distribution payoff has no finite mean \(at node "/.test(L.refusal(() => L.D.rollback({ type: 'chance', label: 'c', branches: [{ label: 'x', probability: 1, node: L.T('Success', { p90: 185, p50: 390, p10: 710 }) }] })) || '') },
  // m02 2: six places accepted at 59.9999
  { q: 'beginner m02 2', where: 'key', printed: 'EMV 59.9999', value: (L) => L.refusal(() => L.D.rollback(L.thirds(0.333333))) === null },
  { q: 'beginner m02 2', where: 'key', printed: '59.9999', value: (L) => L.D.rollback(L.thirds(0.333333)).emv },
  { q: 'beginner m02 2', where: 'explanation', printed: 'Five decimals, 0.33333 each, are refused', value: (L) => /sum to 0\.999990/.test(L.refusal(() => L.D.rollback(L.thirds(0.33333))) || '') },
  { q: 'beginner m02 2', where: 'explanation', printed: '35.0000', value: (L) => L.D.rollback(L.clone(L.GC.rollback.thirdsProbabilities.tree)).emv },
  // m03 5: tie both ways
  { q: 'beginner m03 5', where: 'key', printed: 'A tie both ways at EMV 30.0000', value: (L) => L.tiePair(false).indifferent === true && L.tiePair(true).indifferent === true },
  { q: 'beginner m03 5', where: 'key', printed: 'with Drill marked when Drill is listed first and Farm out marked when Farm out is', value: (L) => { const a = L.tiePair(false); const b = L.tiePair(true); return a.branches[a.bestBranchIndex].label === 'Drill' && b.branches[b.bestBranchIndex].label === 'Farm out'; } },
  { q: 'beginner m03 5', where: 'key', printed: '30.0000', value: (L) => L.tiePair(false).branches[0].branchValue },
  // m03 6: the switch is a reported tie, Drill carries the index
  { q: 'beginner m03 6', where: 'key', printed: 'A tie', value: (L) => { const r = L.lottery(L.SWITCH); return r.indifferent === true && L.same(r.tiedIndices, [0, 1]); } },
  { q: 'beginner m03 6', where: 'key', printed: 'Drill, listed first, carries the action index', value: (L) => L.EKPAN_ACTIONS[L.lottery(L.SWITCH).actionIndex].label === 'Drill' },
  { q: 'beginner m03 6', where: 'prompt', printed: '-7.11e-15', value: (L) => { const d = L.D.bestActionEmv(L.outcomesAt(L.SWITCH), [L.EKPAN_ACTIONS[0]]).emv - L.D.bestActionEmv(L.outcomesAt(L.SWITCH), [L.EKPAN_ACTIONS[1]]).emv; return d.toExponential(2); } },
  // m03 7: drillFarmOut at 0.2
  { q: 'beginner m03 7', where: 'key', printed: 'Drill is marked at 0.200000 only because it is listed first', value: (L) => { const a = L.drillFarmOutAt(0.2); return a.indifferent === true && a.bestBranchIndex === 0 && a.branches[0].label === 'Drill'; } },
  { q: 'beginner m03 7', where: 'key', printed: '-3.5000', value: (L) => L.drillFarmOutAt(0.15).branches[0].branchValue },
  { q: 'beginner m03 7', where: 'key', printed: '27.5000', value: (L) => L.drillFarmOutAt(0.25).branches[0].branchValue },
  // m05 2: what the engine returns at the switch
  { q: 'beginner m05 2', where: 'key', printed: 'A tie with indifferent true', value: (L) => L.lottery(L.SWITCH).indifferent === true },
  { q: 'beginner m05 2', where: 'key', printed: 'Drill carries the action index only because it is listed first', value: (L) => { const r = L.lottery(L.SWITCH); return r.actionIndex === 0 && L.same(r.tiedIndices, [0, 1]); } },
  { q: 'beginner m05 2', where: 'prompt', printed: '21.7143', value: (L) => L.lottery(L.SWITCH).emv },
  // m05 3
  { q: 'beginner m05 3', where: 'key', printed: 'the engine reports the tie and marks Drill', value: (L) => { const a = L.drillFarmOutAt(0.2); return a.indifferent === true && a.branches[a.bestBranchIndex].label === 'Drill'; } },
  // m05 5: what a decision node returns
  { q: 'beginner m05 5', where: 'key', printed: 'The tied branches and an indifferent flag beside the best branch index, plus the set tied at card precision', value: (L) => { const a = L.drillFarmOutAt(0.2); return L.same(a.tiedIndices, [0, 1]) && a.indifferent === true && L.same(a.tiedIndicesAtCardPrecision, [0, 1]) && a.bestBranchIndex === 0; } },
  { q: 'beginner m05 5', where: 'key', printed: 'the optimal path marks only the first listed', value: (L) => { const a = L.D.rollback(L.clone(L.GC.rollback.drillFarmOut.tree)); const t = L.clone(L.GC.rollback.drillFarmOut.tree); t.branches.forEach((b) => { if (b.node.type === 'chance') { b.node.branches[0].probability = 0.2; b.node.branches[1].probability = 0.8; } }); const r = L.D.rollback(t); return a && r.branches[0].onOptimalPath === true && r.branches[1].onOptimalPath === false; } },
  // m06 6, 10
  { q: 'beginner m06 6', where: 'explanation', printed: '170.0000', value: (L) => L.D.rollback({ type: 'decision', label: 'Marginal find', branches: [{ label: 'Develop', cost: 90, node: L.T('Developed', 260) }, { label: 'Sell', cost: 0, node: L.T('Sold', 140) }] }).emv },
  { q: 'beginner m06 10', where: 'key', printed: 'A tie, with Acquire CSEM survey marked', value: (L) => { const t = L.infoTree(L.grossEvii()); return t.indifferent === true && t.branches[t.bestBranchIndex].label === L.INFO_LABEL; } },
  { q: 'beginner m06 10', where: 'explanation', printed: '75.7500', value: (L) => L.infoTree(L.grossEvii()).emv },
  // final 39, m06 12: IRRI withheld; the unguarded -15.00 is an engine-call reconstruction
  { q: 'beginner final 39', where: 'explanation', printed: '15.00', value: (L) => { const x = L.V.generateVoiData(L.clone(L.GC.voi.identicalPosteriorsWithheld.inputs)); return x.withheld === true ? x.kpis.emvWithoutInfo : 'not withheld'; } },
  { q: 'beginner m06 12', where: 'key', printed: 'EVPI 63.00', value: (L) => { const x = L.V.generateVoiData(L.clone(L.GC.voi.identicalPosteriorsWithheld.inputs)); return x.withheld === true && x.kpis.voi === null && x.kpis.evpi === '63.00'; } },
];
