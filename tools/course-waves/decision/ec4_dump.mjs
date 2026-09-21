// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of decision_cases.json (plus
// sweeps around those published inputs) and the TEACHING FIELDS this wave
// designed for itself: the EKPAN prospect tree, the EKPAN lottery and its
// survey, the OKRIKA appraisal sequence and the IRRI typed inputs. THE EC4
// CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY: nothing here imports, reads or
// reproduces ec4_fields.mjs, fields.json, or any capstone field name, payoff,
// probability, cost or likelihood. The teaching digest and the capstone are two
// files with opposite audiences and never share a number.
//
// Usage:  sh /root/ec-wip-decision/build_digest.sh > /root/ec-wip-decision/digest.tmp \
//           && mv /root/ec-wip-decision/digest.tmp /root/ec-wip-decision/digest.txt
//
// Engines: packages/engines/engines/economics/decisionTree.js (the Decision
//          Tree Builder, and the rollback behind Decision Studio's decision
//          section) and voi.js (the Value of Information Analyzer).
// Goldens: packages/engines/test-data/economics/goldens/decision_cases.json
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case's expected block and printed
// beside the engine's own value), "oracle" (a golden's recorded disagreement)
// or "derived" (arithmetic on engine values printed on the SAME row or the
// same block, with the arithmetic stated). Nothing else is computed here.

import fs from 'fs';

const ROOT = process.env.EC4_ENGINES || '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen-ec4/packages/engines';
const D = await import(`${ROOT}/engines/economics/decisionTree.js`);
const V = await import(`${ROOT}/engines/economics/voi.js`);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/decision_cases.json`, 'utf8'));
const byId = (list) => Object.fromEntries(list.map((c) => [c.id, c]));
const GC = Object.fromEntries(Object.entries(G).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, byId(v)]));

const out = [];
const w = (s = '') => out.push(s);
const f = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x))) ? 'null' : Number(x).toFixed(n);
const m = (x) => f(x, 4);   // money, million USD
const r = (x) => f(x, 6);   // probabilities, likelihoods, posteriors
const attempt = (fn) => { try { return { ok: true, value: fn() }; } catch (e) { return { ok: false, error: e.message }; } };
const said = (fn) => { const a = attempt(fn); return a.ok ? `accepted, emv ${m(a.value.emv ?? a.value)}` : `refused: "${a.error}"`; };

// ---------------------------------------------------------------- the fields
const T = (label, payoff) => ({ type: 'terminal', label, payoff });
// THE TEACHING TREE. A prospect with three outcomes, a later decision inside
// the marginal outcome, a farm-out and a walk-away.
const EKPAN_TREE = () => ({
  type: 'decision', label: 'EKPAN prospect', branches: [
    { label: 'Drill', cost: 55, node: { type: 'chance', label: 'Drill outcome', branches: [
      { label: 'Success', probability: 0.35, node: T('Success', 420) },
      { label: 'Marginal', probability: 0.15, node: { type: 'decision', label: 'Marginal find', branches: [
        { label: 'Develop', cost: 90, node: T('Developed', 260) },
        { label: 'Sell', cost: 0, node: T('Sold', 140) },
      ] } },
      { label: 'Dry hole', probability: 0.5, node: T('Dry hole', -25) },
    ] } },
    { label: 'Farm out', cost: 0, node: { type: 'chance', label: 'Farm-out outcome', branches: [
      { label: 'Success', probability: 0.35, node: T('Carried success', 95) },
      { label: 'Marginal', probability: 0.15, node: T('Carried marginal', 30) },
      { label: 'Dry hole', probability: 0.5, node: T('Carried dry hole', 0) },
    ] } },
    { label: 'Walk away', cost: 0, node: T('Walk away', 0) },
  ],
});
// THE TEACHING LOTTERY. EKPAN reduced to two outcomes for the information
// tier, with a controlled-source survey read as a bright spot or not.
const EKPAN_PRIOR = 0.35;
const outcomesAt = (p) => [{ label: 'Success', probability: p }, { label: 'Dry hole', probability: 1 - p }];
const EKPAN_ACTIONS = [
  { label: 'Drill', cost: 55, payoffs: [420, -25] },
  { label: 'Farm out', cost: 0, payoffs: [95, 0] },
  { label: 'Walk away', cost: 0, payoffs: [0, 0] },
];
const EKPAN_SIGNALS = [
  { label: 'Bright spot', likelihoods: [0.85, 0.25] },
  { label: 'No bright spot', likelihoods: [0.15, 0.75] },
];
const EKPAN_SURVEY_COST = 8;
const symmetric = (acc) => [
  { label: 'Reads success', likelihoods: [acc, 1 - acc] },
  { label: 'Reads dry', likelihoods: [1 - acc, acc] },
];
// THE APPRAISAL SEQUENCE. Appraise first, develop now or sell now.
const OKRIKA_DEVELOP = (pLarge) => ({ type: 'chance', label: 'Development outcome', branches: [
  { label: 'Large', probability: pLarge, node: T('Large', 520) },
  { label: 'Small', probability: 1 - pLarge, node: T('Small', -60) },
] });
const OKRIKA_TREE = () => ({
  type: 'decision', label: 'OKRIKA discovery', branches: [
    { label: 'Appraise', cost: 18, node: { type: 'chance', label: 'Appraisal result', branches: [
      { label: 'Good', probability: 0.4, node: { type: 'decision', label: 'After a good appraisal', branches: [
        { label: 'Develop', cost: 150, node: OKRIKA_DEVELOP(0.75) },
        { label: 'Sell', cost: 0, node: T('Sell', 95) },
      ] } },
      { label: 'Poor', probability: 0.6, node: { type: 'decision', label: 'After a poor appraisal', branches: [
        { label: 'Develop', cost: 150, node: OKRIKA_DEVELOP(0.2) },
        { label: 'Sell', cost: 0, node: T('Sell', 25) },
      ] } },
    ] } },
    { label: 'Develop now', cost: 150, node: OKRIKA_DEVELOP(0.42) },
    { label: 'Sell now', cost: 0, node: T('Sell now', 48) },
  ],
});
// THE VOI ANALYZER FORM. EKPAN typed into the Analyzer's percent inputs.
const voiForm = ({ pPos, postPos, postNeg, cost = EKPAN_SURVEY_COST, decisionCost = 55, success = 35, payS = 420, payD = -25 }) => ({
  projectName: 'EKPAN', decisionName: 'Drill EKPAN', decisionCost,
  outcomes: [{ id: 1, name: 'Success', probability: success, payoff: payS }, { id: 2, name: 'Dry hole', probability: 100 - success, payoff: payD }],
  infoScenario: { name: 'CSEM survey', cost, indicators: [
    { id: 1, name: 'Bright spot', probability: pPos, conditionalProbabilities: [{ outcomeId: 1, probability: postPos }, { outcomeId: 2, probability: 100 - postPos }] },
    { id: 2, name: 'No bright spot', probability: 100 - pPos, conditionalProbabilities: [{ outcomeId: 1, probability: postNeg }, { outcomeId: 2, probability: 100 - postNeg }] },
  ] },
});
// THE TYPED INPUTS THAT DISAGREE. IRRI: the Analyzer defaults with both
// indicators given the same posteriors, which the stated prior cannot support.
const IRRI_FORM = () => {
  const x = JSON.parse(JSON.stringify(GC.voi.suiteDefaults.inputs));
  x.projectName = 'IRRI';
  x.infoScenario.indicators.forEach((ind) => { ind.conditionalProbabilities = [{ outcomeId: 1, probability: 20 }, { outcomeId: 2, probability: 80 }]; });
  return x;
};

const walk = (node, depth = 0, lines = [], path = []) => {
  if (node.type === 'terminal') return lines;
  node.branches.forEach((b, i) => {
    const extra = [];
    if (node.type === 'chance') extra.push(`probability ${r(b.probability)}`);
    if (Number(b.cost)) extra.push(`cost ${m(b.cost)}`);
    const kid = b.node.type === 'terminal' ? `terminal payoff ${typeof b.node.payoff === 'object' ? JSON.stringify(b.node.payoff) : m(b.node.payoff)}` : `${b.node.type} "${b.node.label}" emv ${m(b.node.emv)}`;
    lines.push(`| ${[...path, i].join('.')} | ${'. '.repeat(depth)}${b.label} | ${extra.join(', ') || 'none'} | ${kid} | ${m(b.branchValue)} | ${b.onOptimalPath} |`);
    walk(b.node, depth + 1, lines, [...path, i]);
  });
  return lines;
};
const treeTable = (annotated) => {
  w(`Root "${annotated.label}" (${annotated.type}): emv ${m(annotated.emv)}${annotated.type === 'decision' ? `, bestBranchIndex ${annotated.bestBranchIndex} ("${annotated.branches[annotated.bestBranchIndex].label}")` : ''}.`);
  w('| path | branch | probability and cost | child | branchValue | onOptimalPath |');
  w('| --- | --- | --- | --- | --- | --- |');
  walk(annotated).forEach((l) => w(l));
};
const card = (v) => (v === null ? 'withheld' : v);
const kpiLine = (res) => `emvWithoutInfo ${card(res.kpis.emvWithoutInfo)}, emvWithInfo ${card(res.kpis.emvWithInfo)}, voi ${card(res.kpis.voi)}, netVoi ${card(res.kpis.netVoi)}, evpi ${card(res.kpis.evpi)}; consistent ${res.consistency.consistent}; withheld ${res.withheld}; tree ${res.tree ? `drawn, root emv ${m(res.tree.emv)}, root bestBranchIndex ${res.tree.bestBranchIndex}` : 'not drawn'}`;
const voiLine = (form) => { const a = attempt(() => V.generateVoiData(form)); return a.ok ? kpiLine(a.value) : `refused: "${a.error}"`; };
// What the Analyzer printed BEFORE the EC4-0 repair, reconstructed from engine
// calls: per indicator the best action value under the TYPED posteriors
// (bestActionEmv, an engine return), weighted by the typed indicator chances
// (derived arithmetic), less the EMV without information.
const legacyCards = (form) => {
  const oc = form.outcomes.map((o) => ({ label: o.name, probability: o.probability / 100 }));
  const acts = [
    { label: form.decisionName, cost: form.decisionCost, payoffs: form.outcomes.map((o) => o.payoff) },
    { label: `Do Not ${form.decisionName}`, cost: 0, payoffs: form.outcomes.map(() => 0) },
  ];
  const without = D.bestActionEmv(oc, acts).emv;
  const pre = form.infoScenario.indicators.reduce((sum, ind) => sum + (ind.probability / 100) * D.bestActionEmv(oc, acts, form.outcomes.map((o) => (ind.conditionalProbabilities.find((c) => c.outcomeId === o.id)?.probability ?? 0) / 100)).emv, 0);
  return { voi: pre - without, net: pre - without - form.infoScenario.cost, withInfo: pre - form.infoScenario.cost, evpi: D.evpi(oc, acts).evpi };
};

// -------------------------------------------------------------- Section 1
w('# EC4 Decision Analysis & Value of Information. Teaching digest.');
w('# Money is million USD. Probabilities, likelihoods and posteriors print to six decimals; money to four. The VOI Analyzer returns its five KPI cards as two-decimal STRINGS, printed as returned.');
w();
w('# SECTION 1: The engine, what it assumes and what it refuses (owned by Associate m01)');
w();
w('- Node types: decision (takes the MAX over branch values), chance (takes the probability-weighted SUM of branch values), terminal (its payoff).');
w('- A branch value is the child EMV minus the branch cost. A cost is charged when the branch is taken, before a chance node weights it.');
w(`- Probability tolerance at a chance node: sums within 1e-6 of 1 are accepted.`);
w('- Risk attitude: risk neutral. The rollback maximises expected money; no utility function, no risk aversion parameter exists in either module.');
w('- Discounting: none. A payoff is a number already discounted by whichever engine valued it.');
w('- Ties: a decision node keeps the FIRST branch listed when a later branch is only equal (the comparison is strictly greater).');
const refuse = [
  ['a chance node whose probabilities sum to 0.9', GC.rollbackRefusals.probabilitiesSumBelowOne.tree],
  ['a chance node whose probabilities sum to 1.2', GC.rollbackRefusals.probabilitiesSumAboveOne.tree],
  ['one branch at probability 1.5', GC.rollbackRefusals.probabilityAboveOne.tree],
  ['a decision node with no branches', GC.rollbackRefusals.emptyBranches.tree],
  ['an unknown node type "lottery"', GC.rollbackRefusals.unknownType.tree],
  ['a branch with no child node', GC.rollbackRefusals.missingChildNode.tree],
  ['a bad distribution two levels down', GC.rollbackRefusals.nestedRefusal.tree],
];
w();
w('Refusals, each the engine message verbatim (published rollbackRefusals cases):');
refuse.forEach(([what, tree]) => w(`- ${what}: ${said(() => D.rollback(tree))}`));
w();
const ekpanTree = D.rollback(EKPAN_TREE());
w(`Two numbers already discounted, EKPAN's drill success payoff 420.0000 and its dry hole -25.0000, enter unchanged: the rollback has no rate to apply. EKPAN tree emv ${m(ekpanTree.emv)}.`);
w();

// -------------------------------------------------------------- Section 2
w('# SECTION 2: Chance nodes on the EKPAN tree (owned by Associate m02)');
w();
treeTable(ekpanTree);
w();
const drill = ekpanTree.branches[0];
const dc = drill.node;
w(`Drill chance node by hand: ${dc.branches.map((b) => `${r(b.probability)} x ${m(b.branchValue)}`).join(' + ')} = ${m(dc.emv)} (engine), less the drill cost ${m(drill.cost)} = branch value ${m(drill.branchValue)} (engine).`);
w(`Farm-out chance node: ${ekpanTree.branches[1].node.branches.map((b) => `${r(b.probability)} x ${m(b.branchValue)}`).join(' + ')} = ${m(ekpanTree.branches[1].node.emv)} (engine).`);
w('# App surface: the Decision Tree Builder\'s drawing labels every decision and chance node "EMV" followed by the node\'s own value, which is the value BEFORE the cost on the branch leading into it. On EKPAN it labels the drill chance node EMV 160 while the drill branch is worth 105.0000 and the root 105.0000. The drawing prints a value of 100 or more with no decimals, from 10 to 100 with one, and below 10 with two; the engine values are unrounded.');
w();
const thirds = (p) => ({ type: 'chance', label: 'Three equal outcomes', branches: [30, 60, 90].map((v, i) => ({ label: `o${i + 1}`, probability: p, node: T(`o${i + 1}`, v) })) });
w('Probabilities typed as thirds on a chance node paying 30 / 60 / 90:');
for (const p of [1 / 3, 0.3333333, 0.333333, 0.33333, 0.3333, 0.333]) w(`- each ${String(p).slice(0, 12)}, sum ${r(3 * p)}: ${said(() => D.rollback(thirds(p)))}`);
w(`# Commentary: the tolerance test is |sum - 1| > 1e-6 with no allowance for binary rounding. Each 0.333333 three times sums in binary to ${(0.333333 + 0.333333 + 0.333333).toPrecision(17)}, and |sum - 1| evaluates to ${Math.abs(0.333333 + 0.333333 + 0.333333 - 1).toPrecision(17)} (derived), just above 1e-6, so a sum that is exactly 1e-6 short in decimal is refused while the message prints 0.999999. The same comparison guards each likelihood column (finding EC4-8, an owner decision; the half-percent check was given an allowance in EC4-0 for the same reason).`);
w(`- published thirdsProbabilities: engine emv ${m(D.rollback(GC.rollback.thirdsProbabilities.tree).emv)}, golden ${m(GC.rollback.thirdsProbabilities.expected.emv)}.`);
w();
const costOnChance = GC.rollback.chanceRootWithBranchCosts;
const cr = D.rollback(costOnChance.tree);
w(`A cost on a chance branch (published chanceRootWithBranchCosts): root emv ${m(cr.emv)}; branches ${cr.branches.map((b) => `"${b.label}" probability ${r(b.probability)} cost ${m(b.cost || 0)} child ${m(b.node.emv)} value ${m(b.branchValue)}`).join('; ')}.`);
const costAfter = cr.branches.reduce((s, b) => s + b.probability * b.node.emv, 0) - cr.branches.reduce((s, b) => s + (Number(b.cost) || 0), 0);
w(`The same branches with every cost subtracted once AFTER weighting instead: ${m(costAfter)} (derived: sum of probability x child less the sum of costs; wrong, a cost on a branch is only paid on that branch).`);
w();
const distTree = (payoff) => ({ ...EKPAN_TREE(), branches: EKPAN_TREE().branches.map((b, i) => i !== 0 ? b : { ...b, node: { ...b.node, branches: b.node.branches.map((c, j) => j !== 0 ? c : { ...c, node: T('Success', payoff) }) } }) });
const SUMMARY = { mean: 420, p90: 185, p50: 390, p10: 710 };
const dt = D.rollback(distTree(SUMMARY));
w(`A payoff that is a distribution summary. EKPAN's success terminal replaced by a linked Monte Carlo summary ${JSON.stringify(SUMMARY)} (P90 is the low case): tree emv ${m(dt.emv)}, identical to the plain 420.0000 payoff, because only the mean enters the rollback.`);
for (const k of ['p90', 'p50', 'p10']) { const a = D.rollback(distTree(SUMMARY[k])); w(`- the same tree with the success payoff read at the summary's ${k.toUpperCase()} instead of its mean: emv ${m(a.emv)}, best "${a.branches[a.bestBranchIndex].label}", Drill branch value ${m(a.branches[0].branchValue)} (engine, payoff ${m(SUMMARY[k])}).`); }
w(`- a summary with no mean, { p90: 185, p50: 390, p10: 710 }: ${said(() => D.rollback(distTree({ p90: 185, p50: 390, p10: 710 })))}`);
w(`- published distributionPayoff: engine emv ${m(D.rollback(GC.rollback.distributionPayoff.tree).emv)}, golden ${m(GC.rollback.distributionPayoff.expected.emv)}.`);
w('# App surface: in the Decision Tree Builder, linking a saved Monte Carlo run to a terminal stores a COPY of the run\'s NPV mean, P90 and P10 in million USD at the moment of linking. Nothing re-reads the run afterwards, so a run that is revalued must be linked again for the tree to see it. Unlinking keeps the mean as a fixed payoff.');
w();
const drillOutcomes = dc.branches.map((b) => ({ label: b.label, p: b.probability, net: b.branchValue - drill.cost }));
w('An EMV nobody receives. The drill branch as the money each outcome actually leaves after the drill cost (derived: outcome branch value less 55.0000):');
drillOutcomes.forEach((o) => w(`- ${o.label}: probability ${r(o.p)}, money ${m(o.net)}`));
w(`- chance of losing money on the drill branch: ${r(drillOutcomes.filter((o) => o.net < 0).reduce((s, o) => s + o.p, 0))} (derived); the branch value ${m(drill.branchValue)} is not among the three outcomes.`);
w();

// -------------------------------------------------------------- Section 3
w('# SECTION 3: Decision nodes (owned by Associate m03)');
w();
w(`EKPAN root: branch values ${ekpanTree.branches.map((b) => `"${b.label}" ${m(b.branchValue)}`).join(', ')}; bestBranchIndex ${ekpanTree.bestBranchIndex}; emv ${m(ekpanTree.emv)}.`);
const mf = dc.branches[1].node;
w(`EKPAN marginal-find decision: ${mf.branches.map((b) => `"${b.label}" child ${m(b.node.emv)} cost ${m(b.cost)} value ${m(b.branchValue)} onOptimalPath ${b.onOptimalPath}`).join('; ')}.`);
w(`A branch below a branch that is NOT taken is never on the optimal path: the farm-out's three outcomes all read onOptimalPath ${ekpanTree.branches[1].node.branches.map((b) => b.onOptimalPath).join(' / ')}.`);
w('# App surface: the Decision Tree Builder shows four cards: Optimal EMV (the root emv), Recommended first move (the root best branch label), Next best alternative (the largest other root branch value) and Decision advantage (the difference). A root that is a chance node reads "Chance root" on the first-move card and N/A on the other two; a root with one branch reads N/A on the other two.');
w();
for (const id of ['drillFarmOut', 'equalEmvTie', 'allNegative', 'singleBranchDecision', 'missingCostAndNullPayoff']) {
  const c = GC.rollback[id]; const a = D.rollback(c.tree);
  w(`- published ${id}: engine emv ${m(a.emv)}, bestBranchIndex ${a.bestBranchIndex ?? 'none'}, branch values ${a.branches.map((b) => `"${b.label}" ${m(b.branchValue)}`).join(', ')}; golden emv ${m(c.expected.emv)}.`);
}
const tieFirst = D.rollback({ type: 'decision', label: 'tie', branches: [{ label: 'Drill', cost: 10, node: T('Drill', 40) }, { label: 'Farm out', cost: 0, node: T('Farm out', 30) }] });
const tieSwapped = D.rollback({ type: 'decision', label: 'tie', branches: [{ label: 'Farm out', cost: 0, node: T('Farm out', 30) }, { label: 'Drill', cost: 10, node: T('Drill', 40) }] });
w(`A tie decided by listing order: Drill (40.0000 less cost 10.0000) against Farm out (30.0000). Listed Drill first: best "${tieFirst.branches[tieFirst.bestBranchIndex].label}". Listed Farm out first: best "${tieSwapped.branches[tieSwapped.bestBranchIndex].label}". Both emv ${m(tieFirst.emv)}.`);
const noWalk = D.rollback({ ...EKPAN_TREE(), branches: EKPAN_TREE().branches.slice(0, 2) });
w(`Walking away is a branch. EKPAN at a dry hole of -25.0000 still drills; the root without its walk-away branch reads emv ${m(noWalk.emv)}, the same, because walking away is not the best branch here.`);
const poorEkpan = (pS) => {
  const t = EKPAN_TREE(); const ch = t.branches[0].node.branches; ch[0].probability = pS; ch[2].probability = 1 - pS - ch[1].probability;
  const fo = t.branches[1].node.branches; fo[0].probability = pS; fo[2].probability = 1 - pS - fo[1].probability; return t;
};
for (const pS of [0.1, 0.05]) {
  const a = D.rollback(poorEkpan(pS)); const b = D.rollback({ ...poorEkpan(pS), branches: poorEkpan(pS).branches.slice(0, 2) });
  w(`- EKPAN with success at ${r(pS)} (dry hole ${r(0.85 - pS)}): branch values ${a.branches.map((x) => `"${x.label}" ${m(x.branchValue)}`).join(', ')}; best "${a.branches[a.bestBranchIndex].label}"; without the walk-away branch best "${b.branches[b.bestBranchIndex].label}" at ${m(b.emv)}.`);
}
w();

// -------------------------------------------------------------- Section 4
w('# SECTION 4: Rolling back a sequence (owned by Associate m04)');
w();
const okrika = D.rollback(OKRIKA_TREE());
treeTable(okrika);
w();
const good = okrika.branches[0].node.branches[0].node; const poor = okrika.branches[0].node.branches[1].node;
w(`Right to left. Development chance at 0.75 large: ${m(good.branches[0].node.emv)}; at 0.20 large: ${m(poor.branches[0].node.emv)}; at 0.42 large (develop now): ${m(okrika.branches[1].node.emv)}.`);
w(`After a good appraisal: develop ${m(good.branches[0].branchValue)} against sell ${m(good.branches[1].branchValue)}; after a poor one: develop ${m(poor.branches[0].branchValue)} against sell ${m(poor.branches[1].branchValue)}.`);
w(`Appraisal chance node ${m(okrika.branches[0].node.emv)}, less the appraisal cost 18.0000 = ${m(okrika.branches[0].branchValue)}.`);
const noLater = D.rollback({ ...OKRIKA_TREE(), branches: [
  { label: 'Appraise, then always develop', cost: 18, node: { type: 'chance', label: 'Appraisal result', branches: [
    { label: 'Good', probability: 0.4, node: { type: 'decision', label: 'forced', branches: [{ label: 'Develop', cost: 150, node: OKRIKA_DEVELOP(0.75) }] } },
    { label: 'Poor', probability: 0.6, node: { type: 'decision', label: 'forced', branches: [{ label: 'Develop', cost: 150, node: OKRIKA_DEVELOP(0.2) }] } },
  ] } },
  ...OKRIKA_TREE().branches.slice(1),
] });
w(`The value of a later choice. Appraise with no option to sell afterwards (always develop): branch value ${m(noLater.branches[0].branchValue)}; best root branch then "${noLater.branches[noLater.bestBranchIndex].label}" at ${m(noLater.emv)}. With the later choice the appraisal branch is ${m(okrika.branches[0].branchValue)}; the difference ${m(okrika.branches[0].branchValue - noLater.branches[0].branchValue)} (derived) is what the option to sell after a poor result is worth inside that branch.`);
w(`OKRIKA appraise against its best alternative, sell now: ${m(okrika.branches[0].branchValue)} less ${m(okrika.branches[2].branchValue)} = ${m(okrika.branches[0].branchValue - okrika.branches[2].branchValue)} (derived).`);
w();
for (const id of ['twoStageSequential', 'deepAlternation']) {
  const c = GC.rollback[id]; const a = D.rollback(c.tree);
  w(`Published ${id}: engine emv ${m(a.emv)}, golden ${m(c.expected.emv)}.`);
  treeTable(a);
  w();
}

// -------------------------------------------------------------- Section 5
w('# SECTION 5: When the decision changes (owned by Associate m05)');
w();
w('The EKPAN lottery: Success / Dry hole; Drill cost 55.0000 paying 420.0000 / -25.0000; Farm out 95.0000 / 0.0000; Walk away 0.0000 / 0.0000.');
w('# Commentary: the EKPAN LOTTERY is a different model from the EKPAN TREE of Sections 2 and 3. The tree has three outcomes and a later decision inside its Marginal find; the lottery has two outcomes and no later decision, and at its stated success probability 0.350000 its dry hole is 0.650000 (the tree Marginal find folded into the dry hole). Name the model beside every EKPAN number: the tree drill branch is 105.0000 and loses money with probability 0.500000; the lottery drill action is 75.7500 and loses money with probability 0.650000. Everything from here to Section 10 that says EKPAN means the lottery.');
w('| success probability | Drill | Farm out | Walk away | best action | emv |');
w('| --- | --- | --- | --- | --- | --- |');
const actionValues = (p) => EKPAN_ACTIONS.map((a) => D.bestActionEmv(outcomesAt(p), [a]).emv);
const PRIORS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5];
for (const p of PRIORS) {
  const b = D.bestActionEmv(outcomesAt(p), EKPAN_ACTIONS); const v = actionValues(p);
  w(`| ${r(p)} | ${m(v[0])} | ${m(v[1])} | ${m(v[2])} | ${EKPAN_ACTIONS[b.actionIndex].label} | ${m(b.emv)} |`);
}
const pDF = 80 / 350; const pDW = 80 / 445;
const dfGap = actionValues(pDF)[0] - actionValues(pDF)[1];
w(`Drill against farm out, a straight line each: Drill = 445 p - 80, Farm out = 95 p (derived from the payoffs and cost above), equal at p = 80 / 350 = ${r(pDF)} (derived). At that probability the engine reads Drill ${m(actionValues(pDF)[0])}, Farm out ${m(actionValues(pDF)[1])}, best "${EKPAN_ACTIONS[D.bestActionEmv(outcomesAt(pDF), EKPAN_ACTIONS).actionIndex].label}".`);
w(`# Commentary: 80 / 350 has no exact binary image, so the two values differ in the last binary digits (Drill less Farm out = ${dfGap.toExponential(2)}, derived). The engine's choice AT the switch probability is that rounding residue, not the tie rule; the tie rule is shown on an exact tie below.`);
w(`On the lottery, Drill against walking away, equal at p = 80 / 445 = ${r(pDW)} (derived), below the farm-out switch, so walking away is never the best EKPAN action at any success probability above 0: Farm out pays 95 p, which is positive.`);
w();
const pf = GC.rollback.drillFarmOut;
w('Published drillFarmOut tree with its success probability swept (both chance nodes moved together):');
for (const p of [0.1, 0.15, 0.2, 0.25, 0.3]) {
  const t = JSON.parse(JSON.stringify(pf.tree)); t.branches.forEach((b) => { if (b.node.type === 'chance') { b.node.branches[0].probability = p; b.node.branches[1].probability = 1 - p; } });
  const a = D.rollback(t);
  w(`- success ${r(p)}: ${a.branches.map((b) => `"${b.label}" ${m(b.branchValue)}`).join(', ')}; best "${a.branches[a.bestBranchIndex].label}"`);
}
w('At success 0.200000 the published tree ties Drill and Farm out exactly, and the engine reports the first branch listed.');
w();
w('What the EKPAN EMV hides, at the stated 0.35 prior (derived from the rows above):');
const e35 = D.bestActionEmv(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS);
w(`- Drill emv ${m(e35.emv)}; the two outcomes it can actually produce, after the cost, are ${m(420 - 55)} with probability ${r(EKPAN_PRIOR)} and ${m(-25 - 55)} with probability ${r(1 - EKPAN_PRIOR)}.`);
w(`- Farm out emv ${m(actionValues(EKPAN_PRIOR)[1])}; it can produce ${m(95)} or ${m(0)} and never loses money.`);
w();

// -------------------------------------------------------------- Section 6
w('# SECTION 6: Perfect information (owned by Professional m01)');
w();
const ep = D.evpi(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS);
w(`EKPAN lottery at prior ${r(EKPAN_PRIOR)}: emvPrior ${m(ep.emvPrior)} (best action "${EKPAN_ACTIONS[D.bestActionEmv(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS).actionIndex].label}"), evWithPerfect ${m(ep.evWithPerfect)}, evpi ${m(ep.evpi)}.`);
w('| outcome | prior | Drill net | Farm out net | Walk away net | best action if known | best value |');
w('| --- | --- | --- | --- | --- | --- | --- |');
outcomesAt(EKPAN_PRIOR).forEach((o, i) => {
  const nets = EKPAN_ACTIONS.map((a) => a.payoffs[i] - (a.cost || 0));
  const bi = nets.indexOf(Math.max(...nets));
  w(`| ${o.label} | ${r(o.probability)} | ${m(nets[0])} | ${m(nets[1])} | ${m(nets[2])} | ${EKPAN_ACTIONS[bi].label} | ${m(nets[bi])} |`);
});
w(`evWithPerfect = ${r(EKPAN_PRIOR)} x ${m(365)} + ${r(1 - EKPAN_PRIOR)} x ${m(0)} (derived from the table) = ${m(ep.evWithPerfect)} (engine).`);
w('# Commentary: in the Dry hole row Farm out and Walk away both pay 0.0000, a tie; the table names Farm out only because it is listed first. EVPI takes the best VALUE per outcome, so the tie does not change it.');
w();
w('EVPI across the prior on the EKPAN lottery:');
w('| success probability | emvPrior | evWithPerfect | evpi |');
w('| --- | --- | --- | --- |');
for (const p of [0.05, 0.1, 0.15, 0.2, pDF, 0.25, 0.3, 0.35, 0.4, 0.5, 0.7, 0.9]) { const e = D.evpi(outcomesAt(p), EKPAN_ACTIONS); w(`| ${r(p)} | ${m(e.emvPrior)} | ${m(e.evWithPerfect)} | ${m(e.evpi)} |`); }
w(`EVPI is largest at the drill against farm-out switch, ${r(pDF)}, where the prior decision is least settled.`);
w();
for (const id of ['prospect', 'voiDefaultLottery', 'dominantAction', 'certainOutcome', 'distributionPayoffs']) {
  const c = GC.evpi[id]; const e = D.evpi(c.outcomes, c.actions);
  w(`- published ${id} inputs: outcomes ${c.outcomes.map((o) => `${o.label} ${r(o.probability)}`).join(', ')}; actions ${c.actions.map((a) => `${a.label} cost ${m(a.cost || 0)} paying ${a.payoffs.map((x) => (typeof x === 'object' ? `mean ${m(x.mean)}` : m(x))).join(' / ')}`).join('; ')}.`);
  w(`- published ${id}: engine emvPrior ${m(e.emvPrior)}, evWithPerfect ${m(e.evWithPerfect)}, evpi ${m(e.evpi)}; golden evpi ${m(c.expected.evpi)}.`);
}
w();

// -------------------------------------------------------------- Section 7
w('# SECTION 7: Imperfect information by Bayes (owned by Professional m02)');
w();
const ei = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, EKPAN_SURVEY_COST);
w(`EKPAN survey likelihoods, P(signal | outcome): Bright spot ${EKPAN_SIGNALS[0].likelihoods.map(r).join(' / ')} (Success / Dry hole); No bright spot ${EKPAN_SIGNALS[1].likelihoods.map(r).join(' / ')}. Each outcome's column sums to 1.`);
w('| signal | joint with Success | joint with Dry hole | pSignal | posterior Success | posterior Dry hole | best action | emv |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
ei.perSignal.forEach((s, k) => {
  const joint = [EKPAN_PRIOR * EKPAN_SIGNALS[k].likelihoods[0], (1 - EKPAN_PRIOR) * EKPAN_SIGNALS[k].likelihoods[1]];
  w(`| ${s.label} | ${r(joint[0])} | ${r(joint[1])} | ${r(s.pSignal)} | ${r(s.posterior[0])} | ${r(s.posterior[1])} | ${EKPAN_ACTIONS[s.bestActionIndex].label} | ${m(s.emv)} |`);
});
w('(The joint columns are derived: prior x likelihood. pSignal is their sum; each posterior is its joint over pSignal. The last four columns are engine returns.)');
w(`evWithInfo ${m(ei.evWithInfo)} = ${ei.perSignal.map((s) => `${r(s.pSignal)} x ${m(s.emv)}`).join(' + ')} (engine); emvPrior ${m(ei.emvPrior)}; evii ${m(ei.evii)}; evpi ${m(ep.evpi)}; netEvii at a survey cost of ${m(EKPAN_SURVEY_COST)}: ${m(ei.netEvii)}.`);
w(`Bounds: 0 <= evii ${m(ei.evii)} <= evpi ${m(ep.evpi)}. The engine derives posteriors from likelihoods, so its inputs cannot be probabilistically inconsistent.`);
w(`Confusing a likelihood with a posterior: reading P(Success | Bright spot) as 0.850000 would give a Drill value of ${m(D.bestActionEmv(outcomesAt(0.85), [EKPAN_ACTIONS[0]]).emv)} after a bright spot (engine at probability 0.85), against the posterior's ${m(D.bestActionEmv(outcomesAt(ei.perSignal[0].posterior[0]), [EKPAN_ACTIONS[0]]).emv)}.`);
w();
for (const id of ['seismicBayes', 'uselessSignal', 'perfectSignal', 'costAboveValue', 'costEqualsValue']) {
  const c = GC.evii[id]; const e = D.evii(c.outcomes, c.actions, c.signals, c.infoCost || 0);
  w(`- published ${id}: engine evWithInfo ${m(e.evWithInfo)}, evii ${m(e.evii)}, netEvii ${m(e.netEvii)}; per signal ${e.perSignal.map((s) => `"${s.label}" pSignal ${r(s.pSignal)} posterior ${s.posterior.map(r).join(' / ')} best ${s.bestActionIndex} emv ${m(s.emv)}`).join('; ')}; golden evii ${m(c.expected.evii)}.`);
}
w();

// -------------------------------------------------------------- Section 8
w('# SECTION 8: Buying the information (owned by Professional m03)');
w();
const iTree = D.rollback(D.buildInformationTree({ outcomes: outcomesAt(EKPAN_PRIOR), actions: EKPAN_ACTIONS, signals: EKPAN_SIGNALS, infoCost: EKPAN_SURVEY_COST, infoLabel: 'Acquire CSEM survey' }));
w(`Gross and net: evii ${m(ei.evii)} is what the survey is worth before it is paid for; netEvii ${m(ei.netEvii)} after its cost ${m(EKPAN_SURVEY_COST)}.`);
w('The EKPAN information tree, built by buildInformationTree and rolled back:');
treeTable(iTree);
w();
w(`Root branch values: acquire ${m(iTree.branches[0].branchValue)} = evWithInfo ${m(ei.evWithInfo)} less ${m(EKPAN_SURVEY_COST)}; no further information ${m(iTree.branches[1].branchValue)} = emvPrior. Their difference ${m(iTree.branches[0].branchValue - iTree.branches[1].branchValue)} (derived) equals netEvii ${m(ei.netEvii)}.`);
w(`The price that makes the survey value neutral is the gross evii, ${m(ei.evii)}.`);
w('| survey cost | acquire branch value | no-information branch value | netEvii | root choice |');
w('| --- | --- | --- | --- | --- |');
for (const c of [0, 4, 8, 12, 16, 20, 24, ei.evii, 28, 32]) {
  const t = D.rollback(D.buildInformationTree({ outcomes: outcomesAt(EKPAN_PRIOR), actions: EKPAN_ACTIONS, signals: EKPAN_SIGNALS, infoCost: c, infoLabel: 'Acquire CSEM survey' }));
  const e = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, c);
  w(`| ${m(c)} | ${m(t.branches[0].branchValue)} | ${m(t.branches[1].branchValue)} | ${m(e.netEvii)} | ${t.branches[t.bestBranchIndex].label} |`);
}
w('At a cost exactly equal to evii the two root branches tie and the engine keeps the first branch listed, the acquisition.');
w();
for (const id of ['seismicCost5', 'seismicCost20', 'costExactlyNetZero', 'noSignals']) {
  const c = GC.informationTree[id];
  const t = D.rollback(D.buildInformationTree({ outcomes: c.outcomes, actions: c.actions, signals: c.signals, infoCost: c.infoCost || 0 }));
  w(`- published ${id} inputs: outcomes ${c.outcomes.map((o) => `${o.label} ${r(o.probability)}`).join(', ')}; actions ${c.actions.map((a) => `${a.label} cost ${m(a.cost || 0)} paying ${a.payoffs.map(m).join(' / ')}`).join('; ')}; signals ${(c.signals || []).map((g) => `${g.label} ${g.likelihoods.map(r).join(' / ')}`).join('; ') || 'none'}; survey cost ${m(c.infoCost || 0)}.`);
  w(`- published ${id}: engine root ${t.label ? `"${t.label}"` : ''} emv ${m(t.emv)}, bestBranchIndex ${t.bestBranchIndex}, root branch values ${t.branches.map((b) => m(b.branchValue)).join(' / ')}; golden emv ${m(c.expected.emv ?? c.expected.branches?.[0]?.branchValue)}.`);
}
w();

// -------------------------------------------------------------- Section 9
w('# SECTION 9: Accuracy and value (owned by Professional m04)');
w();
w('A symmetric survey of accuracy a on the EKPAN lottery: P(reads success | Success) = a and P(reads dry | Dry hole) = a.');
w('| accuracy | pSignal reads success | posterior Success after reads success | posterior Success after reads dry | best action after reads success | best action after reads dry | evii | evpi |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]) {
  const e = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, symmetric(a), 0);
  const eviiShown = Math.abs(e.evii) < 1e-9 ? 0 : e.evii;
  w(`| ${r(a)} | ${r(e.perSignal[0].pSignal)} | ${r(e.perSignal[0].posterior[0])} | ${r(e.perSignal[1].posterior[0])} | ${EKPAN_ACTIONS[e.perSignal[0].bestActionIndex].label} | ${EKPAN_ACTIONS[e.perSignal[1].bestActionIndex].label} | ${m(eviiShown)} | ${m(ep.evpi)} |`);
}
w(`# Commentary: at accuracy 0.55 the engine returns an evii of ${D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, symmetric(0.55), 0).evii.toExponential(2)}, floating-point residue of a difference of two equal sums; the table prints residue below 1e-9 as 0.0000.`);
w(`The survey is worth exactly 0 until a "reads dry" result can move the success probability below the drill against farm-out switch ${r(pDF)}; below that accuracy both readings still lead to Drill.`);
const accSwitch = (() => { let lo = 0.5, hi = 1; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; const e = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, symmetric(mid), 0); if (e.perSignal[1].bestActionIndex === 0) lo = mid; else hi = mid; } return hi; })();
w(`The accuracy at which a "reads dry" result first changes the action, by bisection on the engine's own choice: ${r(accSwitch)}.`);
w();
for (const id of ['accuracySweep_0p5', 'accuracySweep_0p7', 'accuracySweep_0p9', 'accuracySweep_1p0']) {
  const c = GC.evii[id]; const e = D.evii(c.outcomes, c.actions, c.signals, 0);
  w(`- published ${id} (the drillFarmOut prospect at prior 0.3): engine evii ${m(e.evii)}; golden ${m(c.expected.evii)}.`);
}
w();

// ------------------------------------------------------------- Section 10
w('# SECTION 10: The VOI Analyzer (owned by Professional m05)');
w();
const defaults = GC.voi.suiteDefaults.inputs;
const dres = V.generateVoiData(defaults);
w(`The Analyzer's default study (published suiteDefaults): decision "${defaults.decisionName}" cost ${m(defaults.decisionCost)}; outcomes ${defaults.outcomes.map((o) => `${o.name} ${o.probability} percent paying ${m(o.payoff)}`).join(', ')}; ${defaults.infoScenario.name} cost ${m(defaults.infoScenario.cost)}; indicators ${defaults.infoScenario.indicators.map((i) => `${i.name} ${i.probability} percent with P(outcome | indicator) ${i.conditionalProbabilities.map((c) => c.probability).join(' / ')} percent`).join('; ')}.`);
w(`- the five numbers the engine returns: ${kpiLine(dres)}.`);
w('# App surface: the Analyzer\'s results panel shows FOUR cards, titled EMV without Information, EMV with Information, Net Value of Info (Net VOI) and Value of Perfect Info (EVPI). The gross voi, the fifth number the engine returns, appears only in the Decision Guidance sentence and the CSV export. Each card is the engine\'s two-decimal string. The card titled EMV with Information is AFTER the survey cost (48.00 at cost 0, 38.00 at cost 10 on the defaults), while the tree engine\'s evWithInfo is BEFORE it.');
w('# Commentary: "gross voi" below means the engine\'s voi string, which the Analyzer shows only in its guidance sentence and CSV export, never on a card.');
w(`- insight, verbatim: ${dres.insights}`);
w('- The Analyzer offers exactly two actions: the named decision at its cost, and "Do Not" with every payoff 0.');
w();
const exPos = ei.perSignal[0].pSignal * 100; const exPostPos = ei.perSignal[0].posterior[0] * 100; const exPostNeg = ei.perSignal[1].posterior[0] * 100;
const ekForm = V.generateVoiData(voiForm({ pPos: exPos, postPos: exPostPos, postNeg: exPostNeg }));
w(`EKPAN lottery typed into the Analyzer form: decision "Drill EKPAN" cost 55.0000; outcomes Success 35 percent paying 420.0000 and Dry hole 65 percent paying -25.0000 (payoffs gross of the decision cost); CSEM survey cost 8.0000; indicators Bright spot and No bright spot. Every EKPAN Analyzer row in Sections 10 and 11 uses these.`);
w(`EKPAN typed into the Analyzer with the Bayes posteriors at full precision (Bright spot ${f(exPos, 6)} percent, P(Success | Bright spot) ${f(exPostPos, 6)} percent, P(Success | No bright spot) ${f(exPostNeg, 6)} percent): ${kpiLine(ekForm)}.`);
const lik = (prior, pInd, post) => prior > 0 ? post * pInd / prior : 0;
w(`Inverting the typed entries back to likelihoods, P(indicator | outcome) = P(outcome | indicator) x P(indicator) / P(outcome): Bright spot given Success ${r(lik(0.35, exPos / 100, exPostPos / 100))}, Bright spot given Dry hole ${r(lik(0.65, exPos / 100, 1 - exPostPos / 100))} (derived; they reproduce the survey's 0.850000 and 0.250000).`);
const twoAction = D.evii(outcomesAt(EKPAN_PRIOR), [EKPAN_ACTIONS[0], EKPAN_ACTIONS[2]], EKPAN_SIGNALS, EKPAN_SURVEY_COST);
w(`A missing third action. The same survey on the lottery with Farm out removed (Drill or Walk away): emvPrior ${m(twoAction.emvPrior)}, evWithInfo ${m(twoAction.evWithInfo)}, evii ${m(twoAction.evii)}, evpi ${m(D.evpi(outcomesAt(EKPAN_PRIOR), [EKPAN_ACTIONS[0], EKPAN_ACTIONS[2]]).evpi)}. With Farm out: evii ${m(ei.evii)}, evpi ${m(ep.evpi)}. The Analyzer's gross voi ${ekForm.kpis.voi} (guidance sentence and CSV, not a card) is the two-action number.`);
w();
w('The verdict sentence, by net VOI sign (verbatim tails of the insight):');
for (const id of ['suiteDefaults', 'pricey', 'costExactlyValue']) { const x = V.generateVoiData(GC.voi[id].inputs); w(`- published ${id} (cost ${m(GC.voi[id].inputs.infoScenario.cost)}): netVoi card ${x.kpis.netVoi}; "${x.insights.match(/Since this is[^.]*\.|The information exactly[^.]*\./)[0]}"`); }
w();
w('| survey cost | emvWithInfo card | netVoi card | tree root choice |');
w('| --- | --- | --- | --- |');
for (const id of ['freeInformation', 'costSweep_5', 'suiteDefaults', 'costSweep_20', 'costExactlyValue', 'costSweep_40', 'pricey']) { const c = GC.voi[id]; const x = V.generateVoiData(c.inputs); w(`| ${m(c.inputs.infoScenario.cost)} | ${x.kpis.emvWithInfo} | ${x.kpis.netVoi} | ${x.tree ? x.tree.branches[x.tree.bestBranchIndex].label : 'no tree'} |`); }
w();
{
  // B5 signhits (2026-09-21): the Professional lessons (m02 l05, m05 l04) cite
  // the pre-repair IRRI cards as history, so the figures are printed in their
  // own tier's section as well as in Section 11.
  const old = legacyCards(IRRI_FORM());
  w(`Before the EC4-0 repair, the IRRI inputs (both indicators typed 20 / 80 percent) printed a gross voi of ${old.voi.toFixed(2)} and a netVoi card of ${old.net.toFixed(2)} (reconstructed from engine calls, derived). The repaired Analyzer withholds both; Section 11 reads the case in full.`);
  w();
}

// ------------------------------------------------------------- Section 11
w('# SECTION 11: Inputs that contradict each other (owned by Expert m01)');
w();
const ip = GC.impliedPriors;
w('impliedPriors: implied P(outcome) = sum over indicators of P(indicator) x P(outcome | indicator); consistent when every delta against the stated prior is within 0.005.');
for (const id of ['consistentFromBayes', 'inconsistent', 'justInsideTolerance', 'justOutsideTolerance', 'missingPosteriorsCountAsZero', 'threeOutcomes']) {
  const c = ip[id]; const e = D.impliedPriors(c.outcomes, c.indicators);
  w(`- published ${id}: stated ${e.stated.map(r).join(' / ')}, implied ${e.implied.map(r).join(' / ')}, deltas ${e.deltas.map((d) => d.toExponential(6)).join(' / ')}, consistent ${e.consistent}; golden consistent ${c.expected.consistent}.`);
}
const d1 = D.impliedPriors(ip.justInsideTolerance.outcomes, ip.justInsideTolerance.indicators);
w(`The boundary case: 0.305 - 0.3 evaluates in binary floating point to ${(0.305 - 0.3).toPrecision(17)}, which is above 0.005 by ${((0.305 - 0.3) - 0.005).toExponential(1)} (derived). The engine compares against 0.005 plus a 1e-12 representation allowance and reports consistent ${d1.consistent}; compared against 0.005 alone the same deltas would read consistent ${d1.deltas.every((d) => Math.abs(d) <= 0.005)} (derived). Before the EC4-0 repair the engine had no allowance and called this case inconsistent (finding D1, now resolved).`);
w();
w('Rounded posteriors. EKPAN typed with its posteriors rounded instead of at full precision:');
w('| Bright spot percent | P(Success given Bright spot) percent | P(Success given No bright spot) percent | implied Success | delta | consistent | gross voi | netVoi card |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const [a, b, c] of [[exPos, exPostPos, exPostNeg], [46, 64.7, 9.7], [46, 65, 10], [46, 65, 9], [46, 64, 10], [45, 65, 10], [46, 65, 8], [46, 66, 10], [47, 65, 10]]) {
  const x = V.generateVoiData(voiForm({ pPos: a, postPos: b, postNeg: c }));
  w(`| ${f(a, 6)} | ${f(b, 6)} | ${f(c, 6)} | ${r(x.consistency.implied[0])} | ${x.consistency.deltas[0].toExponential(6)} | ${x.consistency.consistent} | ${card(x.kpis.voi)} | ${card(x.kpis.netVoi)} |`);
}
w();
const irri = V.generateVoiData(IRRI_FORM());
const irriOld = legacyCards(IRRI_FORM());
w(`IRRI: the Analyzer defaults with BOTH indicators typed as 20 / 80 percent. ${kpiLine(irri)}; implied ${irri.consistency.implied.map(r).join(' / ')} against stated ${irri.consistency.stated.map(r).join(' / ')}; deltas ${irri.consistency.deltas.map(r).join(' / ')}.`);
w(`- Before the EC4-0 repair the same inputs printed a gross voi of ${irriOld.voi.toFixed(2)} and a netVoi card of ${irriOld.net.toFixed(2)} (reconstructed from engine calls, derived). Information derived by Bayes can never be worth less than 0 (evii >= 0); a negative value is only reachable from typed inputs that contradict the stated prior, which is why the repaired Analyzer withholds it.`);
w(`- IRRI insight, verbatim: ${irri.insights}`);
for (const id of ['contradictingPosterior', 'identicalPosteriorsWithheld', 'certainPosteriorsWithheld', 'withheldPastHalfPercent', 'consistentAtHalfPercent']) {
  const c = GC.voi[id]; const x = V.generateVoiData(c.inputs); const old = legacyCards(c.inputs);
  w(`- published ${id}: ${kpiLine(x)}; implied ${x.consistency.implied.map(r).join(' / ')}. Before the repair: gross voi ${old.voi.toFixed(2)}, netVoi card ${old.net.toFixed(2)}, against evpi card ${old.evpi.toFixed(2)} (reconstructed, derived).`);
}
w(`- EKPAN with Bright spot typed at 56 percent and No bright spot at 44 percent (the chances still sum to 100), the posteriors unchanged: ${voiLine(voiForm({ pPos: 56, postPos: exPostPos, postNeg: exPostNeg }))}; implied Success ${r(V.generateVoiData(voiForm({ pPos: 56, postPos: exPostPos, postNeg: exPostNeg })).consistency.implied[0])} against stated 0.350000; before the repair gross voi ${legacyCards(voiForm({ pPos: 56, postPos: exPostPos, postNeg: exPostNeg })).voi.toFixed(2)} (reconstructed, derived).`);
w();
w('What the repaired Analyzer refuses outright, before computing anything (published voiRefusals, each engine message verbatim). Each typed chance must lie between 0 and 100 percent, and each sum (the outcome chances, the indicator chances, and the outcome chances under each indicator) must lie within 1e-4 percentage points of 100:');
for (const c of G.voiRefusals) {
  const old = attempt(() => legacyCards(c.inputs));
  w(`- ${c.id}: ${voiLine(c.inputs)}${old.ok && c.inputs.outcomes?.length ? ` Before the repair: gross voi ${old.value.voi.toFixed(2)} against evpi card ${old.value.evpi.toFixed(2)} (reconstructed, derived).` : ''}`);
}
const sum110 = (() => { const x = voiForm({ pPos: exPos, postPos: exPostPos, postNeg: exPostNeg }); x.infoScenario.indicators[1].probability = 64; return x; })();
w(`- EKPAN with No bright spot typed at 64 percent, so the indicator chances sum to ${f(exPos + 64, 6)} percent: ${voiLine(sum110)}`);
w('A refusal and a withholding are different answers: a refusal says the typed numbers are not chances at all; a withholding says they are chances that cannot all be true together, and still reports the two cards that depend only on the stated outcome chances.');
w();

// ------------------------------------------------------------- Section 12
w('# SECTION 12: Bigger lotteries (owned by Expert m02)');
w();
const e34 = GC.evpi.threeOutcomesFourActions;
const e34r = D.evpi(e34.outcomes, e34.actions);
w(`Published threeOutcomesFourActions: outcomes ${e34.outcomes.map((o) => `${o.label} ${r(o.probability)}`).join(', ')}; actions ${e34.actions.map((a) => `${a.label} cost ${m(a.cost || 0)} paying ${a.payoffs.map(m).join(' / ')}`).join('; ')}.`);
w('| action | value at the prior |');
w('| --- | --- |');
e34.actions.forEach((a) => w(`| ${a.label} | ${m(D.bestActionEmv(e34.outcomes, [a]).emv)} |`));
w(`emvPrior ${m(e34r.emvPrior)}, evWithPerfect ${m(e34r.evWithPerfect)}, evpi ${m(e34r.evpi)}; golden perfectBestActionIndex ${JSON.stringify(e34.expected.perfectBestActionIndex)}.`);
const t3 = GC.evii.threeByThree; const t3r = D.evii(t3.outcomes, t3.actions, t3.signals, t3.infoCost || 0);
w(`Published threeByThree: signals ${t3.signals.map((s) => `${s.label} ${s.likelihoods.map(r).join(' / ')}`).join('; ')}; cost ${m(t3.infoCost || 0)}.`);
w('| signal | pSignal | posterior Large | posterior Medium | posterior Dry | best action | emv |');
w('| --- | --- | --- | --- | --- | --- | --- |');
t3r.perSignal.forEach((s) => w(`| ${s.label} | ${r(s.pSignal)} | ${s.posterior.map(r).join(' | ')} | ${e34.actions[s.bestActionIndex].label} | ${m(s.emv)} |`));
w(`evWithInfo ${m(t3r.evWithInfo)}, evii ${m(t3r.evii)}, netEvii ${m(t3r.netEvii)}, against evpi ${m(e34r.evpi)}.`);
const t3tree = GC.informationTree.threeByThreeCost12;
const t3t = D.rollback(D.buildInformationTree({ outcomes: t3tree.outcomes, actions: t3tree.actions, signals: t3tree.signals, infoCost: t3tree.infoCost }));
w(`Published threeByThreeCost12 information tree: root choice "${t3t.branches[t3t.bestBranchIndex].label}", root branch values ${t3t.branches.map((b) => m(b.branchValue)).join(' / ')}.`);
w();
const imp = GC.evii.impossibleSignal; const impr = D.evii(imp.outcomes, imp.actions, imp.signals, imp.infoCost || 0);
w(`A reading that never happens (published impossibleSignal): ${impr.perSignal.map((s) => `"${s.label}" likelihoods ${imp.signals.find((x) => x.label === s.label).likelihoods.map(r).join(' / ')}, pSignal ${r(s.pSignal)}, posterior ${s.posterior.map(r).join(' / ')}, best ${s.bestActionIndex} ("${imp.actions[s.bestActionIndex].label}"), emv ${m(s.emv)}`).join('; ')}; evii ${m(impr.evii)}. Actions: ${imp.actions.map((a, i) => `${i} "${a.label}" cost ${m(a.cost || 0)} paying ${a.payoffs.map(m).join(' / ')}`).join('; ')}; priors ${imp.outcomes.map((o) => `${o.label} ${r(o.probability)}`).join(', ')}.`);
w('A signal with pSignal 0 keeps the PRIORS as its posterior and reports the prior best action and emv; weighted by 0, it adds nothing to evWithInfo.');
w();
w('The published threeOutcomesFourActions lottery with the Large probability swept and Medium held at its stated 0.5 (Dry takes the rest):');
w('| Large | Dry | Drill alone | Drill with partner | Farm out | Relinquish | best action |');
w('| --- | --- | --- | --- | --- | --- | --- |');
for (const pL of [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5]) {
  const oc = [{ label: 'Large', probability: pL }, { label: 'Medium', probability: 0.5 }, { label: 'Dry', probability: 0.5 - pL }];
  const vals = e34.actions.map((a) => D.bestActionEmv(oc, [a]).emv);
  w(`| ${r(pL)} | ${r(0.5 - pL)} | ${vals.map(m).join(' | ')} | ${e34.actions[D.bestActionEmv(oc, e34.actions).actionIndex].label} |`);
}
w('Drill with partner pays exactly half of Drill alone in every outcome at exactly half the cost, so its value is exactly half of Drill alone at every probability (the two columns above). Half of a positive number is smaller, and half of a negative number is still negative while Farm out never goes below 0, so Drill with partner is never the best action on this lottery, and Relinquish never beats Farm out. The sweep has ONE switch, between Farm out and Drill alone.');
w();

// ------------------------------------------------------------- Section 13
w('# SECTION 13: The decision brief (owned by Expert m03)');
w();
w('Decision Studio assembles up to three sections, each with a provenance line: probabilistic economics from a saved EPE Monte Carlo run, decision analysis from a saved tree re-rolled by this engine at brief time, and capital allocation from a saved portfolio. Its decision rows are: Optimal EMV (root emv), Recommended first move (the root best branch label), Next best alternative (the largest OTHER root branch value) and Decision advantage (optimal emv less next best). The last two are arithmetic on engine returns, printed here as derived.');
const brief = (a) => {
  if (a.type !== 'decision') return { optimal: a.emv, move: 'Single path', next: null, adv: null };
  const others = a.branches.filter((_, i) => i !== a.bestBranchIndex).map((b) => b.branchValue);
  const next = others.length ? Math.max(...others) : null;
  return { optimal: a.emv, move: a.branches[a.bestBranchIndex].label, next, adv: next == null ? null : a.emv - next };
};
for (const [name, a] of [['OKRIKA', okrika], ['EKPAN tree', ekpanTree], ['EKPAN information tree', iTree], ['published chanceRootWithBranchCosts', cr], ['published singleBranchDecision', D.rollback(GC.rollback.singleBranchDecision.tree)], ['published equalEmvTie', D.rollback(GC.rollback.equalEmvTie.tree)], ['published allNegative', D.rollback(GC.rollback.allNegative.tree)]]) {
  const b = brief(a);
  w(`- ${name}: Optimal EMV ${m(b.optimal)} (engine); Recommended first move "${b.move}"; Next best alternative ${b.next == null ? 'row absent' : m(b.next)} (derived); Decision advantage ${b.adv == null ? 'row absent' : m(b.adv)} (derived).`);
}
w('An exact tie prints a Decision advantage of 0 beside a recommended first move that is simply the branch listed first.');
w('# App surface: the brief writes "Single path" as the first move for a tree whose root is a chance node, where the Decision Tree Builder writes "Chance root" for the same tree.');
w();
w(`A Monte Carlo payoff enters at its mean. EKPAN's tree with the success payoff linked to the summary ${JSON.stringify(SUMMARY)}: Optimal EMV ${m(dt.emv)}, the same as the plain mean. Reading the summary's P90 (the low case, ${m(SUMMARY.p90)}) would give ${m(D.rollback(distTree(SUMMARY.p90)).emv)}; its P10 (the high case, ${m(SUMMARY.p10)}) ${m(D.rollback(distTree(SUMMARY.p10)).emv)}. The rollback is linear, so the mean is the only statistic it needs; the spread is carried in the object and does not move the EMV.`);
w('The economics section of the brief labels its rows "NPV P90 (low)", "NPV P50" and "NPV P10 (high)" and its provenance says "Petroleum convention: P90 is the low case."');
w();

// ------------------------------------------------------------- Section 14
w('# SECTION 14: Refusals and silent defaults (owned by Expert m04)');
w();
const dec = (cost, payoff) => ({ type: 'decision', label: 'd', branches: [{ label: 'A', cost, node: T('A', payoff) }, { label: 'B', cost: 0, node: T('B', 12) }] });
const row = (what, fn) => { const a = attempt(fn); w(`- ${what}: ${a.ok ? `accepted, emv ${m(a.value.emv)}, best "${a.value.branches ? a.value.branches[a.value.bestBranchIndex].label : 'terminal'}"${a.value.branches ? `, branch A value ${m(a.value.branches[0].branchValue)}` : ''}` : `refused: "${a.error}"`}`); };
w('Branch A pays 20 at the cost shown; branch B pays 12 at no cost.');
row('cost 5', () => D.rollback(dec(5, 20)));
row('cost "5" typed as text', () => D.rollback(dec('5', 20)));
row('cost "abc"', () => D.rollback(dec('abc', 20)));
row('cost left empty ""', () => D.rollback(dec('', 20)));
row('cost absent', () => D.rollback({ type: 'decision', label: 'd', branches: [{ label: 'A', node: T('A', 20) }, { label: 'B', cost: 0, node: T('B', 12) }] }));
row('cost -5 (a receipt)', () => D.rollback(dec(-5, 20)));
row('payoff "20" typed as text', () => D.rollback(dec(5, '20')));
row('payoff ""', () => D.rollback(dec(5, '')));
row('payoff null', () => D.rollback(dec(5, null)));
row('payoff "20abc"', () => D.rollback(dec(5, '20abc')));
row('payoff { p50: 20 } with no mean', () => D.rollback(dec(5, { p50: 20 })));
w();
w('# App surface: in the Decision Tree Builder, clearing a payoff, probability or cost box stores 0, the same value the engine gives a blank or non-numeric cost. A cleared probability therefore surfaces as a sum that is not 1; a cleared cost or payoff is silent.');
w('Thirds (from Section 2): each 0.333, sum 0.999000, refused; each 0.3333333, accepted.');
w(`A branch probability typed as text "0.5" on a two-branch chance node paying 10 and 30: ${said(() => D.rollback({ type: 'chance', label: 'c', branches: [{ label: 'a', probability: '0.5', node: T('a', 10) }, { label: 'b', probability: '0.5', node: T('b', 30) }] }))}.`);
w(`A probability left empty "" on one branch and 1 on the other: ${said(() => D.rollback({ type: 'chance', label: 'c', branches: [{ label: 'a', probability: '', node: T('a', 10) }, { label: 'b', probability: 1, node: T('b', 30) }] }))}.`);
w();
for (const id of ['likelihoodColumnBelowOne', 'likelihoodColumnAboveOne', 'priorsNotDistribution', 'noSignals', 'payoffCountMismatch']) {
  const c = GC.eviiRefusals[id]; const a = attempt(() => D.evii(c.outcomes, c.actions, c.signals, c.infoCost || 0));
  w(`- published eviiRefusals ${id}: ${a.ok ? `accepted (evii ${m(a.value.evii)})` : `refused: "${a.error}"`}`);
}
w('The VOI Analyzer refuses its percent inputs the same way: see Section 11, voiRefusals. A boundary kept despite binary arithmetic: see Section 11, justInsideTolerance (finding D1, resolved).');
w();

// ------------------------------------------------------------- Section 15
w('# SECTION 15: Numbers to distrust (owned by Expert m05)');
w();
w(`A risk neutral choice. EKPAN Drill emv ${m(e35.emv)} beats Farm out ${m(actionValues(EKPAN_PRIOR)[1])}; Drill loses ${m(80)} with probability ${r(0.65)} (Section 5), Farm out never loses. The engine has no way to prefer the farm-out: it maximises the mean.`);
w();
const tieForm = { ...voiForm({ success: 25, payS: 200, payD: -50, decisionCost: 12.5, pPos: 40, postPos: 50, postNeg: 25 / 3, cost: 5 }), projectName: 'Tie case', decisionName: 'Drill Exploration Well' };
const tieRes = V.generateVoiData(tieForm);
w(`An exact tie reported as a recommendation. Analyzer inputs: Success 25 percent paying 200, Dry hole 75 percent paying -50, decision cost 12.5, so acting is worth 0.25 x 200 + 0.75 x (-50) - 12.5 = 0 (derived), exactly the "Do Not" value. Survey cost ${m(tieForm.infoScenario.cost)}. Cards: ${kpiLine(tieRes)}.`);
w(`- insight opening, verbatim: ${tieRes.insights.split('. ')[0]}.`);
w();
w('A KPI rounded before it is shown. The five cards are toFixed(2) strings; the verdict reads the unrounded net VOI. The Analyzer defaults at survey costs either side of the gross VOI 33:');
w('| survey cost | netVoi card | verdict sentence |');
w('| --- | --- | --- |');
for (const cost of [32.99, 32.996, 33, 33.004, 33.01]) {
  const x = JSON.parse(JSON.stringify(defaults)); x.infoScenario.cost = cost; const res = V.generateVoiData(x);
  w(`| ${f(cost, 3)} | ${res.kpis.netVoi} | ${res.insights.match(/Since this is[^.]*\.|The information exactly[^.]*\./)[0]} |`);
}
w();
w('Information that cannot change anything. The EKPAN symmetric survey at accuracy 0.600000: evii 0.0000 (Section 9), although its readings move the posterior. The published dominantAction lottery: evpi 0.0000 (Section 6).');
const certain = GC.evpi.certainOutcome; w(`The published certainOutcome lottery: evpi ${m(D.evpi(certain.outcomes, certain.actions).evpi)}.`);
w();
w('What a tree cannot tell you, as properties of these two modules: no discounting (payoffs arrive discounted), no risk attitude, no correlation between chance nodes beyond what the tree is drawn with, no sequential information in the VOI Analyzer (one survey, one decision), two actions only in the Analyzer, and a Bayes consistency check that refuses numbers that are not chances, withholds a value built on chances that contradict each other, and never repairs either.');
w();

// ------------------------------------------------------------- Section 16
w('# SECTION 16: The teaching fields end to end, for the reading modules (owned by Associate m06, Professional m06 and Expert m06)');
w();
w(`- EKPAN tree: emv ${m(ekpanTree.emv)}, best "${ekpanTree.branches[ekpanTree.bestBranchIndex].label}", branch values ${ekpanTree.branches.map((b) => m(b.branchValue)).join(' / ')}.`);
w(`- OKRIKA: emv ${m(okrika.emv)}, best "${okrika.branches[okrika.bestBranchIndex].label}", branch values ${okrika.branches.map((b) => m(b.branchValue)).join(' / ')}.`);
w(`- EKPAN lottery at 0.35: emvPrior ${m(ep.emvPrior)}, evpi ${m(ep.evpi)}, evii ${m(ei.evii)}, netEvii ${m(ei.netEvii)}, drill against farm-out switch ${r(pDF)}.`);
w(`- EKPAN in the Analyzer: gross voi ${ekForm.kpis.voi}, netVoi card ${ekForm.kpis.netVoi}, evpi card ${ekForm.kpis.evpi}.`);
w(`- IRRI: gross voi ${card(irri.kpis.voi)}, consistent ${irri.consistency.consistent}, withheld ${irri.withheld}.`);
w();

process.stdout.write(`${out.join('\n')}\n`);
