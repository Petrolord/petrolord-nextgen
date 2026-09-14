// Teaching lab for EC4, Decision Analysis & Value of Information. The three
// panels, the course page and the vitest file all read this one module, so a
// number shown to a learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every rollback, every
// branch value, every EVPI, EVII, posterior, KPI card, refusal message and
// insight sentence below is a return value of
// engines/economics/decisionTree.js (the Decision Tree Builder, and the
// rollback behind Decision Studio's decision section) or
// engines/economics/voi.js (the VOI Analyzer), as repaired in EC4-0: percent
// refusals, and a `withheld` result whose value cards are null.
//
// NOTHING IN THIS FILE COMPUTES A DECISION QUANTITY. Where a reader carries a
// value the digest calls "derived" (Decision Studio's next best and advantage
// rows, the joint columns of a Bayes table, the reconstructed pre-repair cards,
// a switch probability read off the stated payoffs), it is arithmetic on
// numbers the engine returned or on the inputs it was handed, with the
// arithmetic stated, and the key name says Derived. The lab and
// /root/ec-wip-decision/digest.txt agree because both call the engines on the
// same inputs, not because either copied the other.
//
// UNITS. Money is million USD. Probabilities, likelihoods and posteriors are
// fractions 0 to 1, except the VOI Analyzer's inputs, which are percent 0 to
// 100 as its form types them. The Analyzer's KPI cards are two-decimal STRINGS,
// or null when withheld, exactly as the engine returns them.
//
// PURITY. Every function is pure and deterministic, and every tree is built
// fresh on each call. Nothing is memoised.

import G from '@petrolord/engines/test-data/economics/goldens/decision_cases.json';
import * as D from '@petrolord/engines/engines/economics/decisionTree.js';
import * as V from '@petrolord/engines/engines/economics/voi.js';
import { OUTCOME_LABELS, OUTCOME_ORDER } from '@petrolord/engines/lib/conventions/percentile.js';

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a decision quantity.
// ---------------------------------------------------------------------------

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (list) => Object.fromEntries(list.map((c) => [c.id, c]));
const GC = Object.fromEntries(Object.entries(G).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, byId(v)]));
const attempt = (fn) => { try { return { ok: true, value: fn() }; } catch (e) { return { ok: false, error: e.message }; } };

/** How many published cases each golden block carries. */
export const goldenCounts = () => Object.fromEntries(
  Object.entries(G).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.length]));

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from /root/ec-wip-decision/ec4_dump.mjs.
// None of them is a golden case and none of them is graded anywhere.
// ---------------------------------------------------------------------------

const T = (label, payoff) => ({ type: 'terminal', label, payoff });
// THE TEACHING TREE. A prospect with three outcomes, a later decision inside
// the marginal outcome, a farm-out and a walk-away.
export const EKPAN_TREE = () => ({
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
export const EKPAN_PRIOR = 0.35;
const outcomesAt = (p) => [{ label: 'Success', probability: p }, { label: 'Dry hole', probability: 1 - p }];
export const EKPAN_ACTIONS = [
  { label: 'Drill', cost: 55, payoffs: [420, -25] },
  { label: 'Farm out', cost: 0, payoffs: [95, 0] },
  { label: 'Walk away', cost: 0, payoffs: [0, 0] },
];
export const EKPAN_SIGNALS = [
  { label: 'Bright spot', likelihoods: [0.85, 0.25] },
  { label: 'No bright spot', likelihoods: [0.15, 0.75] },
];
export const EKPAN_SURVEY_COST = 8;
export const symmetric = (acc) => [
  { label: 'Reads success', likelihoods: [acc, 1 - acc] },
  { label: 'Reads dry', likelihoods: [1 - acc, acc] },
];
// THE APPRAISAL SEQUENCE. Appraise first, develop now or sell now.
export const OKRIKA_DEVELOP = (pLarge) => ({ type: 'chance', label: 'Development outcome', branches: [
  { label: 'Large', probability: pLarge, node: T('Large', 520) },
  { label: 'Small', probability: 1 - pLarge, node: T('Small', -60) },
] });
export const OKRIKA_TREE = () => ({
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
export const voiForm = ({ pPos, postPos, postNeg, cost = EKPAN_SURVEY_COST, decisionCost = 55, success = 35, payS = 420, payD = -25 }) => ({
  projectName: 'EKPAN', decisionName: 'Drill EKPAN', decisionCost,
  outcomes: [{ id: 1, name: 'Success', probability: success, payoff: payS }, { id: 2, name: 'Dry hole', probability: 100 - success, payoff: payD }],
  infoScenario: { name: 'CSEM survey', cost, indicators: [
    { id: 1, name: 'Bright spot', probability: pPos, conditionalProbabilities: [{ outcomeId: 1, probability: postPos }, { outcomeId: 2, probability: 100 - postPos }] },
    { id: 2, name: 'No bright spot', probability: 100 - pPos, conditionalProbabilities: [{ outcomeId: 1, probability: postNeg }, { outcomeId: 2, probability: 100 - postNeg }] },
  ] },
});
// THE TYPED INPUTS THAT DISAGREE. IRRI: the Analyzer defaults with both
// indicators given the same posteriors, which the stated prior cannot support.
export const IRRI_FORM = () => {
  const x = JSON.parse(JSON.stringify(GC.voi.suiteDefaults.inputs));
  x.projectName = 'IRRI';
  x.infoScenario.indicators.forEach((ind) => { ind.conditionalProbabilities = [{ outcomeId: 1, probability: 20 }, { outcomeId: 2, probability: 80 }]; });
  return x;
};
// A linked Monte Carlo summary for EKPAN's success payoff (P90 is the low case).
export const SUMMARY = { mean: 420, p90: 185, p50: 390, p10: 710 };
// What the Analyzer printed BEFORE the EC4-0 repair, reconstructed from engine
// calls: per indicator the best action value under the TYPED posteriors
// (bestActionEmv, an engine return), weighted by the typed indicator chances
// (derived arithmetic), less the EMV without information.
export const legacyCards = (form) => {
  const oc = form.outcomes.map((o) => ({ label: o.name, probability: o.probability / 100 }));
  const acts = [
    { label: form.decisionName, cost: form.decisionCost, payoffs: form.outcomes.map((o) => o.payoff) },
    { label: `Do Not ${form.decisionName}`, cost: 0, payoffs: form.outcomes.map(() => 0) },
  ];
  const without = D.bestActionEmv(oc, acts).emv;
  const pre = form.infoScenario.indicators.reduce((sum, ind) => sum + (ind.probability / 100) * D.bestActionEmv(oc, acts, form.outcomes.map((o) => (ind.conditionalProbabilities.find((c) => c.outcomeId === o.id)?.probability ?? 0) / 100)).emv, 0);
  return { voi: pre - without, net: pre - without - form.infoScenario.cost, withInfo: pre - form.infoScenario.cost, evpi: D.evpi(oc, acts).evpi };
};

// ---------------------------------------------------------------------------
// Readers shared by the sections. Each reads an engine return, nothing more.
// ---------------------------------------------------------------------------

/**
 * An annotated tree flattened to rows in the engine's own order (depth first,
 * branch order), with every chance node's rollback terms beside it.
 */
const treeView = (annotated) => {
  const rows = [];
  const chanceNodes = [];
  const walk = (node, depth, path, incoming) => {
    if (node.type === 'terminal') return;
    if (node.type === 'chance') {
      chanceNodes.push({
        path: path.join('.'),
        label: node.label,
        emv: node.emv,
        incomingLabel: incoming ? incoming.label : null,
        incomingCost: incoming ? Number(incoming.cost) || 0 : null,
        incomingBranchValue: incoming ? incoming.branchValue : null,
        terms: node.branches.map((b) => ({ label: b.label, probability: b.probability, branchValue: b.branchValue })),
      });
    }
    node.branches.forEach((b, i) => {
      const p = [...path, i];
      rows.push({
        path: p.join('.'),
        depth,
        label: b.label,
        parentType: node.type,
        probability: node.type === 'chance' ? b.probability : null,
        cost: Number(b.cost) ? b.cost : null,
        childType: b.node.type,
        childLabel: b.node.label,
        childEmv: b.node.emv,
        payoff: b.node.type === 'terminal' ? b.node.payoff : null,
        branchValue: b.branchValue,
        onOptimalPath: b.onOptimalPath,
      });
      walk(b.node, depth + 1, p, b);
    });
  };
  walk(annotated, 0, [], null);
  const isDecision = annotated.type === 'decision';
  return {
    root: {
      label: annotated.label,
      type: annotated.type,
      emv: annotated.emv,
      bestBranchIndex: isDecision ? annotated.bestBranchIndex : null,
      bestLabel: isDecision ? annotated.branches[annotated.bestBranchIndex].label : null,
      branches: annotated.branches.map((b) => ({ label: b.label, branchValue: b.branchValue })),
    },
    rows,
    chanceNodes,
  };
};

const branchValues = (a) => a.branches.map((b) => ({ label: b.label, branchValue: b.branchValue }));
const bestLabelOf = (a) => a.branches[a.bestBranchIndex].label;

/** The VOI Analyzer's return, as the panels and the digest read it. */
const voiSummary = (res) => ({
  kpis: { ...res.kpis },
  consistent: res.consistency.consistent,
  withheld: res.withheld,
  tree: res.tree ? { emv: res.tree.emv, bestBranchIndex: res.tree.bestBranchIndex, bestLabel: bestLabelOf(res.tree) } : null,
  insights: res.insights,
  stated: res.consistency.stated,
  implied: res.consistency.implied,
  deltas: res.consistency.deltas,
});
const voiAttempt = (form) => {
  const a = attempt(() => V.generateVoiData(form));
  return a.ok ? { ok: true, ...voiSummary(a.value) } : { ok: false, error: a.error };
};
/** The verdict sentence inside an engine insight, read off the engine string. */
const verdictOf = (insights) => (insights.match(/Since this is[^.]*\.|The information exactly[^.]*\./) || [null])[0];

const rollbackAttempt = (fn) => {
  const a = attempt(fn);
  return a.ok ? { ok: true, emv: a.value.emv ?? a.value } : { ok: false, error: a.error };
};

// ---------------------------------------------------------------------------
// SECTION 1. The engine, what it assumes and what it refuses.
// ---------------------------------------------------------------------------

export const ENGINE_RULE_LINES = [
  '- Node types: decision (takes the MAX over branch values), chance (takes the probability-weighted SUM of branch values), terminal (its payoff).',
  '- A branch value is the child EMV minus the branch cost. A cost is charged when the branch is taken, before a chance node weights it.',
  '- Probability tolerance at a chance node: sums within 1e-6 of 1 are accepted.',
  '- Risk attitude: risk neutral. The rollback maximises expected money; no utility function, no risk aversion parameter exists in either module.',
  '- Discounting: none. A payoff is a number already discounted by whichever engine valued it.',
  '- Ties: a decision node keeps the FIRST branch listed when a later branch is only equal (the comparison is strictly greater).',
];

export const engineRules = () => {
  const t = EKPAN_TREE();
  return {
    lines: [...ENGINE_RULE_LINES],
    successPayoff: t.branches[0].node.branches[0].node.payoff,
    dryHolePayoff: t.branches[0].node.branches[2].node.payoff,
    treeEmv: D.rollback(EKPAN_TREE()).emv,
  };
};

const REFUSAL_CASES = [
  ['a chance node whose probabilities sum to 0.9', 'probabilitiesSumBelowOne'],
  ['a chance node whose probabilities sum to 1.2', 'probabilitiesSumAboveOne'],
  ['one branch at probability 1.5', 'probabilityAboveOne'],
  ['a decision node with no branches', 'emptyBranches'],
  ['an unknown node type "lottery"', 'unknownType'],
  ['a branch with no child node', 'missingChildNode'],
  ['a bad distribution two levels down', 'nestedRefusal'],
];

export const refusals = () => REFUSAL_CASES.map(([what, id]) => ({
  what, id, ...rollbackAttempt(() => D.rollback(clone(GC.rollbackRefusals[id].tree))),
}));

// ---------------------------------------------------------------------------
// SECTION 2. Chance nodes on the EKPAN tree.
// ---------------------------------------------------------------------------

export const ekpanTree = () => treeView(D.rollback(EKPAN_TREE()));

const thirdsTree = (p) => ({ type: 'chance', label: 'Three equal outcomes', branches: [30, 60, 90].map((v, i) => ({ label: `o${i + 1}`, probability: p, node: T(`o${i + 1}`, v) })) });
export const THIRDS_TYPED = [1 / 3, 0.3333333, 0.333333, 0.33333, 0.3333, 0.333];

export const thirds = () => ({
  payoffs: thirdsTree(1).branches.map((b) => b.node.payoff),
  rows: THIRDS_TYPED.map((p) => ({
    typed: String(p).slice(0, 12),
    each: p,
    sumDerived: 3 * p,
    ...rollbackAttempt(() => D.rollback(thirdsTree(p))),
  })),
  // Derived: the binary sum of 0.333333 typed three times, and its distance from 1,
  // against the engine's 1e-6 tolerance (finding EC4-8).
  binary: {
    typed: 0.333333,
    sumDerived: 0.333333 + 0.333333 + 0.333333,
    gapDerived: Math.abs(0.333333 + 0.333333 + 0.333333 - 1),
  },
  published: {
    engineEmv: D.rollback(clone(GC.rollback.thirdsProbabilities.tree)).emv,
    goldenEmv: GC.rollback.thirdsProbabilities.expected.emv,
  },
});

export const costOnChanceBranch = () => {
  const cr = D.rollback(clone(GC.rollback.chanceRootWithBranchCosts.tree));
  return {
    rootEmv: cr.emv,
    branches: cr.branches.map((b) => ({ label: b.label, probability: b.probability, cost: b.cost || 0, childEmv: b.node.emv, branchValue: b.branchValue })),
    // Derived: sum of probability x child, less the sum of costs. Wrong on
    // purpose; a cost on a branch is only paid on that branch.
    costAfterWeightingDerived: cr.branches.reduce((s, b) => s + b.probability * b.node.emv, 0) - cr.branches.reduce((s, b) => s + (Number(b.cost) || 0), 0),
  };
};

const distTree = (payoff) => ({ ...EKPAN_TREE(), branches: EKPAN_TREE().branches.map((b, i) => i !== 0 ? b : { ...b, node: { ...b.node, branches: b.node.branches.map((c, j) => j !== 0 ? c : { ...c, node: T('Success', payoff) }) } }) });

export const distributionPayoff = () => {
  const dt = D.rollback(distTree({ ...SUMMARY }));
  return {
    summary: { ...SUMMARY },
    plainPayoff: EKPAN_TREE().branches[0].node.branches[0].node.payoff,
    treeEmv: dt.emv,
    // Exceedance order, low to high: P90, P50, P10.
    readings: OUTCOME_ORDER.map((k) => {
      const a = D.rollback(distTree(SUMMARY[k]));
      return { key: k, pLabel: OUTCOME_LABELS[k], payoff: SUMMARY[k], emv: a.emv, bestLabel: bestLabelOf(a), drillBranchValue: a.branches[0].branchValue };
    }),
    noMean: rollbackAttempt(() => D.rollback(distTree({ p90: 185, p50: 390, p10: 710 }))),
    published: {
      engineEmv: D.rollback(clone(GC.rollback.distributionPayoff.tree)).emv,
      goldenEmv: GC.rollback.distributionPayoff.expected.emv,
    },
  };
};

export const drillOutcomes = () => {
  const drill = D.rollback(EKPAN_TREE()).branches[0];
  const rows = drill.node.branches.map((b) => ({ label: b.label, probability: b.probability, moneyDerived: b.branchValue - drill.cost }));
  return {
    cost: drill.cost,
    branchValue: drill.branchValue,
    rows,
    lossChanceDerived: rows.filter((o) => o.moneyDerived < 0).reduce((s, o) => s + o.probability, 0),
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. Decision nodes.
// ---------------------------------------------------------------------------

export const PUBLISHED_DECISION_IDS = ['drillFarmOut', 'equalEmvTie', 'allNegative', 'singleBranchDecision', 'missingCostAndNullPayoff'];
export const TIE_INPUTS = { drillPayoff: 40, drillCost: 10, farmPayoff: 30 };

const poorEkpan = (pS) => {
  const t = EKPAN_TREE(); const ch = t.branches[0].node.branches; ch[0].probability = pS; ch[2].probability = 1 - pS - ch[1].probability;
  const fo = t.branches[1].node.branches; fo[0].probability = pS; fo[2].probability = 1 - pS - fo[1].probability; return t;
};

export const decisionNodes = () => {
  const ek = D.rollback(EKPAN_TREE());
  const mf = ek.branches[0].node.branches[1].node;
  const { drillPayoff, drillCost, farmPayoff } = TIE_INPUTS;
  const drillB = { label: 'Drill', cost: drillCost, node: T('Drill', drillPayoff) };
  const farmB = { label: 'Farm out', cost: 0, node: T('Farm out', farmPayoff) };
  const tieFirst = D.rollback({ type: 'decision', label: 'tie', branches: [clone(drillB), clone(farmB)] });
  const tieSwapped = D.rollback({ type: 'decision', label: 'tie', branches: [clone(farmB), clone(drillB)] });
  const noWalk = D.rollback({ ...EKPAN_TREE(), branches: EKPAN_TREE().branches.slice(0, 2) });
  return {
    root: { branches: branchValues(ek), bestBranchIndex: ek.bestBranchIndex, bestLabel: bestLabelOf(ek), emv: ek.emv },
    marginal: mf.branches.map((b) => ({ label: b.label, childEmv: b.node.emv, cost: b.cost, branchValue: b.branchValue, onOptimalPath: b.onOptimalPath })),
    farmOutOnPath: ek.branches[1].node.branches.map((b) => b.onOptimalPath),
    published: PUBLISHED_DECISION_IDS.map((id) => {
      const c = GC.rollback[id]; const a = D.rollback(clone(c.tree));
      return { id, emv: a.emv, bestBranchIndex: a.bestBranchIndex ?? null, branches: branchValues(a), goldenEmv: c.expected.emv };
    }),
    tie: {
      firstListed: { bestLabel: bestLabelOf(tieFirst), emv: tieFirst.emv },
      swapped: { bestLabel: bestLabelOf(tieSwapped), emv: tieSwapped.emv },
    },
    dryHolePayoff: EKPAN_TREE().branches[0].node.branches[2].node.payoff,
    withoutWalkAway: { emv: noWalk.emv, bestLabel: bestLabelOf(noWalk) },
    poorPriors: [0.1, 0.05].map((pS) => {
      const t = poorEkpan(pS);
      const a = D.rollback(poorEkpan(pS));
      const b = D.rollback({ ...poorEkpan(pS), branches: poorEkpan(pS).branches.slice(0, 2) });
      return {
        pSuccess: pS,
        pDry: t.branches[0].node.branches[2].probability,
        branches: branchValues(a),
        bestLabel: bestLabelOf(a),
        withoutWalkAway: { bestLabel: bestLabelOf(b), emv: b.emv },
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 4. Rolling back a sequence.
// ---------------------------------------------------------------------------

export const okrika = () => {
  const ok = D.rollback(OKRIKA_TREE());
  const good = ok.branches[0].node.branches[0].node; const poor = ok.branches[0].node.branches[1].node;
  const noLater = D.rollback({ ...OKRIKA_TREE(), branches: [
    { label: 'Appraise, then always develop', cost: 18, node: { type: 'chance', label: 'Appraisal result', branches: [
      { label: 'Good', probability: 0.4, node: { type: 'decision', label: 'forced', branches: [{ label: 'Develop', cost: 150, node: OKRIKA_DEVELOP(0.75) }] } },
      { label: 'Poor', probability: 0.6, node: { type: 'decision', label: 'forced', branches: [{ label: 'Develop', cost: 150, node: OKRIKA_DEVELOP(0.2) }] } },
    ] } },
    ...OKRIKA_TREE().branches.slice(1),
  ] });
  return {
    ...treeView(ok),
    developChance: { good: good.branches[0].node.emv, poor: poor.branches[0].node.emv, now: ok.branches[1].node.emv },
    afterGood: { develop: good.branches[0].branchValue, sell: good.branches[1].branchValue },
    afterPoor: { develop: poor.branches[0].branchValue, sell: poor.branches[1].branchValue },
    appraisal: { chanceEmv: ok.branches[0].node.emv, cost: ok.branches[0].cost, branchValue: ok.branches[0].branchValue },
    noSell: {
      appraiseBranchValue: noLater.branches[0].branchValue,
      bestLabel: bestLabelOf(noLater),
      emv: noLater.emv,
      optionValueDerived: ok.branches[0].branchValue - noLater.branches[0].branchValue,
    },
    againstSellNow: {
      appraise: ok.branches[0].branchValue,
      sellNow: ok.branches[2].branchValue,
      differenceDerived: ok.branches[0].branchValue - ok.branches[2].branchValue,
    },
  };
};

export const publishedSequences = () => ['twoStageSequential', 'deepAlternation'].map((id) => {
  const c = GC.rollback[id];
  return { id, goldenEmv: c.expected.emv, ...treeView(D.rollback(clone(c.tree))) };
});

// ---------------------------------------------------------------------------
// SECTION 5. When the decision changes.
// ---------------------------------------------------------------------------

export const PRIORS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5];
const actionValues = (p) => EKPAN_ACTIONS.map((a) => D.bestActionEmv(outcomesAt(p), [a]).emv);

/**
 * Where Drill meets another action, read off the stated payoffs and cost
 * (derived): each action is a straight line in p, payoff on success less
 * payoff on a dry hole times p, plus the dry-hole payoff, less the cost.
 */
const crossing = (a, b) => {
  const line = (x) => ({ slope: x.payoffs[0] - x.payoffs[1], intercept: x.payoffs[1] - (x.cost || 0) });
  const la = line(a); const lb = line(b);
  return { p: (lb.intercept - la.intercept) / (la.slope - lb.slope), a: la, b: lb };
};

export const priorSweep = () => {
  const e35 = D.bestActionEmv(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS);
  const drill = EKPAN_ACTIONS[0]; const farm = EKPAN_ACTIONS[1];
  return {
    actions: clone(EKPAN_ACTIONS),
    rows: PRIORS.map((p) => {
      const b = D.bestActionEmv(outcomesAt(p), EKPAN_ACTIONS);
      return { p, values: actionValues(p), bestLabel: EKPAN_ACTIONS[b.actionIndex].label, emv: b.emv };
    }),
    hides: {
      prior: EKPAN_PRIOR,
      drillEmv: e35.emv,
      drillMoneyDerived: [drill.payoffs[0] - drill.cost, drill.payoffs[1] - drill.cost],
      drillChances: [EKPAN_PRIOR, 1 - EKPAN_PRIOR],
      farmEmv: actionValues(EKPAN_PRIOR)[1],
      farmMoney: [farm.payoffs[0] - farm.cost, farm.payoffs[1] - farm.cost],
    },
  };
};

export const switchPoint = () => {
  const df = crossing(EKPAN_ACTIONS[0], EKPAN_ACTIONS[1]);
  const dw = crossing(EKPAN_ACTIONS[0], EKPAN_ACTIONS[2]);
  const at = actionValues(df.p);
  return {
    drillSlopeDerived: df.a.slope,
    drillInterceptDerived: df.a.intercept,
    farmSlopeDerived: df.b.slope,
    drillFarmSwitchDerived: df.p,
    drillFarmNumeratorDerived: df.b.intercept - df.a.intercept,
    drillFarmDenominatorDerived: df.a.slope - df.b.slope,
    drillAtSwitch: at[0],
    farmAtSwitch: at[1],
    bestAtSwitch: EKPAN_ACTIONS[D.bestActionEmv(outcomesAt(df.p), EKPAN_ACTIONS).actionIndex].label,
    gapAtSwitchDerived: at[0] - at[1],
    drillWalkSwitchDerived: dw.p,
    drillWalkNumeratorDerived: dw.b.intercept - dw.a.intercept,
    drillWalkDenominatorDerived: dw.a.slope - dw.b.slope,
  };
};

export const publishedSweep = () => {
  const pf = GC.rollback.drillFarmOut;
  const rows = [0.1, 0.15, 0.2, 0.25, 0.3].map((p) => {
    const t = clone(pf.tree); t.branches.forEach((b) => { if (b.node.type === 'chance') { b.node.branches[0].probability = p; b.node.branches[1].probability = 1 - p; } });
    const a = D.rollback(t);
    return { p, branches: branchValues(a), bestLabel: bestLabelOf(a), bestBranchIndex: a.bestBranchIndex };
  });
  const tie = rows.find((x) => x.branches[0].branchValue === x.branches[1].branchValue) || null;
  return { rows, tie };
};

// ---------------------------------------------------------------------------
// SECTION 6. Perfect information.
// ---------------------------------------------------------------------------

export const PUBLISHED_EVPI_IDS = ['prospect', 'voiDefaultLottery', 'dominantAction', 'certainOutcome', 'distributionPayoffs'];

export const perfectInformation = () => {
  const ep = D.evpi(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS);
  const table = outcomesAt(EKPAN_PRIOR).map((o, i) => {
    // Derived: each action's payoff in this outcome less its cost.
    const nets = EKPAN_ACTIONS.map((a) => a.payoffs[i] - (a.cost || 0));
    const bi = nets.indexOf(Math.max(...nets));
    return { label: o.label, prior: o.probability, netsDerived: nets, bestLabel: EKPAN_ACTIONS[bi].label, bestValueDerived: nets[bi] };
  });
  return {
    prior: EKPAN_PRIOR,
    emvPrior: ep.emvPrior,
    bestPriorLabel: EKPAN_ACTIONS[D.bestActionEmv(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS).actionIndex].label,
    evWithPerfect: ep.evWithPerfect,
    evpi: ep.evpi,
    table,
    published: PUBLISHED_EVPI_IDS.map((id) => {
      const c = GC.evpi[id]; const e = D.evpi(c.outcomes, c.actions);
      return { id, outcomes: clone(c.outcomes), actions: clone(c.actions), emvPrior: e.emvPrior, evWithPerfect: e.evWithPerfect, evpi: e.evpi, goldenEvpi: c.expected.evpi };
    }),
  };
};

export const evpiSweep = () => {
  const pDF = switchPoint().drillFarmSwitchDerived;
  const rows = [0.05, 0.1, 0.15, 0.2, pDF, 0.25, 0.3, 0.35, 0.4, 0.5, 0.7, 0.9].map((p) => {
    const e = D.evpi(outcomesAt(p), EKPAN_ACTIONS);
    return { p, emvPrior: e.emvPrior, evWithPerfect: e.evWithPerfect, evpi: e.evpi };
  });
  const peak = rows.reduce((best, x) => (x.evpi > best.evpi ? x : best), rows[0]);
  return { rows, peakAt: peak.p, switchAt: pDF };
};

// ---------------------------------------------------------------------------
// SECTION 7. Imperfect information by Bayes.
// ---------------------------------------------------------------------------

export const PUBLISHED_EVII_IDS = ['seismicBayes', 'uselessSignal', 'perfectSignal', 'costAboveValue', 'costEqualsValue'];

const perSignalRows = (e) => e.perSignal.map((s) => ({ label: s.label, pSignal: s.pSignal, posterior: [...s.posterior], bestActionIndex: s.bestActionIndex, emv: s.emv }));

export const bayes = () => {
  const ei = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, EKPAN_SURVEY_COST);
  const ep = D.evpi(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS);
  return {
    signals: clone(EKPAN_SIGNALS),
    rows: ei.perSignal.map((s, k) => ({
      label: s.label,
      // Derived: prior x likelihood.
      jointDerived: [EKPAN_PRIOR * EKPAN_SIGNALS[k].likelihoods[0], (1 - EKPAN_PRIOR) * EKPAN_SIGNALS[k].likelihoods[1]],
      pSignal: s.pSignal,
      posterior: [...s.posterior],
      bestLabel: EKPAN_ACTIONS[s.bestActionIndex].label,
      emv: s.emv,
    })),
    evWithInfo: ei.evWithInfo,
    emvPrior: ei.emvPrior,
    evii: ei.evii,
    netEvii: ei.netEvii,
    evpi: ep.evpi,
    surveyCost: EKPAN_SURVEY_COST,
    likelihoodMistake: {
      likelihoodRead: EKPAN_SIGNALS[0].likelihoods[0],
      drillAtLikelihood: D.bestActionEmv(outcomesAt(EKPAN_SIGNALS[0].likelihoods[0]), [EKPAN_ACTIONS[0]]).emv,
      drillAtPosterior: D.bestActionEmv(outcomesAt(ei.perSignal[0].posterior[0]), [EKPAN_ACTIONS[0]]).emv,
    },
    published: PUBLISHED_EVII_IDS.map((id) => {
      const c = GC.evii[id]; const e = D.evii(c.outcomes, c.actions, c.signals, c.infoCost || 0);
      return { id, evWithInfo: e.evWithInfo, evii: e.evii, netEvii: e.netEvii, perSignal: perSignalRows(e), goldenEvii: c.expected.evii };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 8. Buying the information.
// ---------------------------------------------------------------------------

export const INFO_LABEL = 'Acquire CSEM survey';
export const PUBLISHED_INFORMATION_TREE_IDS = ['seismicCost5', 'seismicCost20', 'costExactlyNetZero', 'noSignals'];

export const informationTree = () => {
  const ei = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, EKPAN_SURVEY_COST);
  const iTree = D.rollback(D.buildInformationTree({ outcomes: outcomesAt(EKPAN_PRIOR), actions: clone(EKPAN_ACTIONS), signals: clone(EKPAN_SIGNALS), infoCost: EKPAN_SURVEY_COST, infoLabel: INFO_LABEL }));
  return {
    evii: ei.evii,
    netEvii: ei.netEvii,
    evWithInfo: ei.evWithInfo,
    emvPrior: ei.emvPrior,
    surveyCost: EKPAN_SURVEY_COST,
    ...treeView(iTree),
    acquire: iTree.branches[0].branchValue,
    noInformation: iTree.branches[1].branchValue,
    differenceDerived: iTree.branches[0].branchValue - iTree.branches[1].branchValue,
    neutralCost: ei.evii,
    published: PUBLISHED_INFORMATION_TREE_IDS.map((id) => {
      const c = GC.informationTree[id];
      const t = D.rollback(D.buildInformationTree({ outcomes: c.outcomes, actions: c.actions, signals: c.signals, infoCost: c.infoCost || 0 }));
      return { id, outcomes: clone(c.outcomes), actions: clone(c.actions), signals: clone(c.signals || []), infoCost: c.infoCost || 0, rootLabel: t.label, emv: t.emv, bestBranchIndex: t.bestBranchIndex, branchValues: t.branches.map((b) => b.branchValue), goldenEmv: c.expected.emv ?? c.expected.branches?.[0]?.branchValue };
    }),
  };
};

export const costSweep = () => {
  const gross = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, 0).evii;
  const rows = [0, 4, 8, 12, 16, 20, 24, gross, 28, 32].map((c) => {
    const t = D.rollback(D.buildInformationTree({ outcomes: outcomesAt(EKPAN_PRIOR), actions: EKPAN_ACTIONS, signals: EKPAN_SIGNALS, infoCost: c, infoLabel: INFO_LABEL }));
    const e = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, c);
    return { cost: c, acquire: t.branches[0].branchValue, noInformation: t.branches[1].branchValue, netEvii: e.netEvii, rootChoice: bestLabelOf(t), isTie: t.branches[0].branchValue === t.branches[1].branchValue };
  });
  return { rows, tieCost: gross };
};

// ---------------------------------------------------------------------------
// SECTION 9. Accuracy and value.
// ---------------------------------------------------------------------------

export const ACCURACIES = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
/** Below this an evii is the residue of a difference of two equal sums, shown as 0. */
export const RESIDUE = 1e-9;
export const BISECTION_STEPS = 60;

export const accuracySweep = () => {
  const ep = D.evpi(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS);
  const rows = ACCURACIES.map((a) => {
    const e = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, symmetric(a), 0);
    return {
      accuracy: a,
      pReadsSuccess: e.perSignal[0].pSignal,
      successAfterReadsSuccess: e.perSignal[0].posterior[0],
      successAfterReadsDry: e.perSignal[1].posterior[0],
      bestAfterReadsSuccess: EKPAN_ACTIONS[e.perSignal[0].bestActionIndex].label,
      bestAfterReadsDry: EKPAN_ACTIONS[e.perSignal[1].bestActionIndex].label,
      evii: e.evii,
      evpi: ep.evpi,
    };
  });
  // Bisection on the engine's own choice after a "reads dry" result.
  let lo = 0.5; let hi = 1;
  for (let i = 0; i < BISECTION_STEPS; i++) {
    const mid = (lo + hi) / 2;
    const e = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, symmetric(mid), 0);
    if (e.perSignal[1].bestActionIndex === 0) lo = mid; else hi = mid;
  }
  return {
    rows,
    residueAt055: rows.find((x) => x.accuracy === 0.55).evii,
    switchPrior: switchPoint().drillFarmSwitchDerived,
    bisectedAccuracy: hi,
    published: ['accuracySweep_0p5', 'accuracySweep_0p7', 'accuracySweep_0p9', 'accuracySweep_1p0'].map((id) => {
      const c = GC.evii[id]; const e = D.evii(c.outcomes, c.actions, c.signals, 0);
      return { id, evii: e.evii, goldenEvii: c.expected.evii };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 10. The VOI Analyzer.
// ---------------------------------------------------------------------------

export const ANALYZER_CARDS = [
  ['emvWithoutInfo', 'EMV without Information'],
  ['emvWithInfo', 'EMV with Information'],
  ['netVoi', 'Net Value of Info (Net VOI)'],
  ['evpi', 'Value of Perfect Info (EVPI)'],
];
export const VERDICT_IDS = ['suiteDefaults', 'pricey', 'costExactlyValue'];
export const ANALYZER_COST_IDS = ['freeInformation', 'costSweep_5', 'suiteDefaults', 'costSweep_20', 'costExactlyValue', 'costSweep_40', 'pricey'];

/** EKPAN's Bayes posteriors in the Analyzer's percent (derived: fraction x 100). */
const ekpanPercents = () => {
  const ei = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, EKPAN_SURVEY_COST);
  return { pPos: ei.perSignal[0].pSignal * 100, postPos: ei.perSignal[0].posterior[0] * 100, postNeg: ei.perSignal[1].posterior[0] * 100 };
};

export const analyzer = () => {
  const defaults = clone(GC.voi.suiteDefaults.inputs);
  const pc = ekpanPercents();
  const typed = voiSummary(V.generateVoiData(voiForm(pc)));
  const lik = (prior, pInd, post) => prior > 0 ? post * pInd / prior : 0;
  const ei = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, EKPAN_SURVEY_COST);
  const ep = D.evpi(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS);
  const twoActs = [EKPAN_ACTIONS[0], EKPAN_ACTIONS[2]];
  const two = D.evii(outcomesAt(EKPAN_PRIOR), twoActs, EKPAN_SIGNALS, EKPAN_SURVEY_COST);
  return {
    defaults: { inputs: defaults, ...voiSummary(V.generateVoiData(clone(GC.voi.suiteDefaults.inputs))) },
    cards: ANALYZER_CARDS.map(([key, title]) => ({ key, title })),
    ekpanForm: voiForm(pc),
    ekpanTyped: { percents: pc, ...typed },
    // Derived: P(indicator | outcome) = P(outcome | indicator) x P(indicator) / P(outcome).
    invertedDerived: {
      brightGivenSuccess: lik(0.35, pc.pPos / 100, pc.postPos / 100),
      brightGivenDry: lik(0.65, pc.pPos / 100, 1 - pc.postPos / 100),
    },
    twoAction: { emvPrior: two.emvPrior, evWithInfo: two.evWithInfo, evii: two.evii, evpi: D.evpi(outcomesAt(EKPAN_PRIOR), twoActs).evpi },
    threeAction: { evii: ei.evii, evpi: ep.evpi },
    verdicts: VERDICT_IDS.map((id) => {
      const x = V.generateVoiData(clone(GC.voi[id].inputs));
      return { id, cost: GC.voi[id].inputs.infoScenario.cost, netVoi: x.kpis.netVoi, verdict: verdictOf(x.insights) };
    }),
    costTable: ANALYZER_COST_IDS.map((id) => {
      const x = voiSummary(V.generateVoiData(clone(GC.voi[id].inputs)));
      return { id, cost: GC.voi[id].inputs.infoScenario.cost, emvWithInfo: x.kpis.emvWithInfo, netVoi: x.kpis.netVoi, rootChoice: x.tree ? x.tree.bestLabel : null };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. Inputs that contradict each other.
// ---------------------------------------------------------------------------

export const IMPLIED_PRIOR_IDS = ['consistentFromBayes', 'inconsistent', 'justInsideTolerance', 'justOutsideTolerance', 'missingPosteriorsCountAsZero', 'threeOutcomes'];
export const PUBLISHED_WITHHELD_IDS = ['contradictingPosterior', 'identicalPosteriorsWithheld', 'certainPosteriorsWithheld', 'withheldPastHalfPercent', 'consistentAtHalfPercent'];
/** The half percent the consistency check allows, as the engine states it. */
export const HALF_PERCENT = 0.005;
/** Rounded-posterior rows after the full-precision one: Bright spot percent, then the two posteriors in percent. */
export const ROUNDED_ROWS = [[46, 64.7, 9.7], [46, 65, 10], [46, 65, 9], [46, 64, 10], [45, 65, 10], [46, 65, 8], [46, 66, 10], [47, 65, 10]];

const legacyOrNull = (form) => { const a = attempt(() => legacyCards(form)); return a.ok ? a.value : null; };

export const contradictions = () => {
  const ip = GC.impliedPriors;
  const d1 = D.impliedPriors(ip.justInsideTolerance.outcomes, ip.justInsideTolerance.indicators);
  const pc = ekpanPercents();
  const ekpan56 = voiForm({ pPos: 56, postPos: pc.postPos, postNeg: pc.postNeg });
  const sum110 = (() => { const x = voiForm({ pPos: pc.pPos, postPos: pc.postPos, postNeg: pc.postNeg }); x.infoScenario.indicators[1].probability = 64; return x; })();
  return {
    impliedPriors: IMPLIED_PRIOR_IDS.map((id) => {
      const c = ip[id]; const e = D.impliedPriors(c.outcomes, c.indicators);
      return { id, stated: e.stated, implied: e.implied, deltas: e.deltas, consistent: e.consistent, goldenConsistent: c.expected.consistent };
    }),
    boundary: {
      // Derived: the stated delta 0.305 - 0.3 in binary floating point, and its excess over the half percent.
      deltaDerived: 0.305 - 0.3,
      excessDerived: (0.305 - 0.3) - HALF_PERCENT,
      consistent: d1.consistent,
      consistentWithoutAllowanceDerived: d1.deltas.every((d) => Math.abs(d) <= HALF_PERCENT),
    },
    rounded: [[pc.pPos, pc.postPos, pc.postNeg], ...ROUNDED_ROWS].map(([a, b, c]) => {
      const x = voiSummary(V.generateVoiData(voiForm({ pPos: a, postPos: b, postNeg: c })));
      return { brightSpotPercent: a, successGivenBrightPercent: b, successGivenNoBrightPercent: c, impliedSuccess: x.implied[0], delta: x.deltas[0], consistent: x.consistent, voi: x.kpis.voi, netVoi: x.kpis.netVoi, withheld: x.withheld };
    }),
    irri: { ...voiSummary(V.generateVoiData(IRRI_FORM())), beforeRepair: legacyCards(IRRI_FORM()) },
    publishedWithheld: PUBLISHED_WITHHELD_IDS.map((id) => ({
      id, ...voiSummary(V.generateVoiData(clone(GC.voi[id].inputs))), beforeRepair: legacyCards(clone(GC.voi[id].inputs)),
    })),
    // The 56 / 44 row carries its implied Success and the stated one, and no
    // delta: nothing teaches from that delta, and read x0.001 it sits within
    // ten grading bands of a graded capstone field (the leak gate caught it).
    ekpan56: (() => { const { deltas, ...rest } = voiAttempt(ekpan56); return { ...rest, beforeRepair: legacyCards(ekpan56) }; })(),
    voiRefusals: G.voiRefusals.map((c) => ({
      id: c.id,
      ...voiAttempt(clone(c.inputs)),
      beforeRepair: c.inputs.outcomes?.length ? legacyOrNull(clone(c.inputs)) : null,
    })),
    indicatorSum110: { sumDerived: pc.pPos + 64, ...voiAttempt(sum110) },
  };
};

// ---------------------------------------------------------------------------
// SECTION 12. Bigger lotteries.
// ---------------------------------------------------------------------------

export const LARGE_SWEEP = [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5];

export const biggerLotteries = () => {
  const e34 = GC.evpi.threeOutcomesFourActions;
  const e34r = D.evpi(e34.outcomes, e34.actions);
  const t3 = GC.evii.threeByThree; const t3r = D.evii(t3.outcomes, t3.actions, t3.signals, t3.infoCost || 0);
  const t3tree = GC.informationTree.threeByThreeCost12;
  const t3t = D.rollback(D.buildInformationTree({ outcomes: t3tree.outcomes, actions: t3tree.actions, signals: t3tree.signals, infoCost: t3tree.infoCost }));
  const imp = GC.evii.impossibleSignal; const impr = D.evii(imp.outcomes, imp.actions, imp.signals, imp.infoCost || 0);
  const medium = e34.outcomes[1].probability;
  return {
    threeOutcomesFourActions: {
      outcomes: clone(e34.outcomes),
      actions: clone(e34.actions),
      actionValues: e34.actions.map((a) => ({ label: a.label, emv: D.bestActionEmv(e34.outcomes, [a]).emv })),
      emvPrior: e34r.emvPrior,
      evWithPerfect: e34r.evWithPerfect,
      evpi: e34r.evpi,
      goldenPerfectBestActionIndex: [...e34.expected.perfectBestActionIndex],
    },
    threeByThree: {
      signals: clone(t3.signals),
      infoCost: t3.infoCost || 0,
      rows: t3r.perSignal.map((s) => ({ label: s.label, pSignal: s.pSignal, posterior: [...s.posterior], bestLabel: e34.actions[s.bestActionIndex].label, emv: s.emv })),
      evWithInfo: t3r.evWithInfo,
      evii: t3r.evii,
      netEvii: t3r.netEvii,
    },
    threeByThreeCost12: { rootChoice: bestLabelOf(t3t), branchValues: t3t.branches.map((b) => b.branchValue) },
    impossibleSignal: {
      rows: impr.perSignal.map((s) => ({ label: s.label, likelihoods: [...imp.signals.find((x) => x.label === s.label).likelihoods], pSignal: s.pSignal, posterior: [...s.posterior], bestActionIndex: s.bestActionIndex, emv: s.emv })),
      evii: impr.evii,
      actions: clone(imp.actions),
      priors: clone(imp.outcomes),
    },
    largeSweep: {
      medium,
      rows: LARGE_SWEEP.map((pL) => {
        const oc = [{ label: 'Large', probability: pL }, { label: 'Medium', probability: medium }, { label: 'Dry', probability: 0.5 - pL }];
        return { pLarge: pL, pDry: oc[2].probability, values: e34.actions.map((a) => D.bestActionEmv(oc, [a]).emv), bestLabel: e34.actions[D.bestActionEmv(oc, e34.actions).actionIndex].label };
      }),
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. The decision brief.
// ---------------------------------------------------------------------------

/** Decision Studio's four decision rows, from a rolled-back tree. The last two are derived. */
const studioRows = (a) => {
  if (a.type !== 'decision') return { optimal: a.emv, move: 'Single path', nextDerived: null, advantageDerived: null };
  const others = a.branches.filter((_, i) => i !== a.bestBranchIndex).map((b) => b.branchValue);
  const next = others.length ? Math.max(...others) : null;
  return { optimal: a.emv, move: a.branches[a.bestBranchIndex].label, nextDerived: next, advantageDerived: next == null ? null : a.emv - next };
};

/** The economics section's row labels, built from the convention module. */
export const ECONOMICS_ROW_LABELS = [`NPV ${OUTCOME_LABELS.p90} (low)`, `NPV ${OUTCOME_LABELS.p50}`, `NPV ${OUTCOME_LABELS.p10} (high)`];

export const brief = () => {
  const trees = [
    ['OKRIKA', D.rollback(OKRIKA_TREE())],
    ['EKPAN tree', D.rollback(EKPAN_TREE())],
    ['EKPAN information tree', D.rollback(D.buildInformationTree({ outcomes: outcomesAt(EKPAN_PRIOR), actions: EKPAN_ACTIONS, signals: EKPAN_SIGNALS, infoCost: EKPAN_SURVEY_COST, infoLabel: INFO_LABEL }))],
    ['published chanceRootWithBranchCosts', D.rollback(clone(GC.rollback.chanceRootWithBranchCosts.tree))],
    ['published singleBranchDecision', D.rollback(clone(GC.rollback.singleBranchDecision.tree))],
    ['published equalEmvTie', D.rollback(clone(GC.rollback.equalEmvTie.tree))],
    ['published allNegative', D.rollback(clone(GC.rollback.allNegative.tree))],
  ];
  const dp = distributionPayoff();
  return {
    rows: trees.map(([name, a]) => ({ name, rootType: a.type, ...studioRows(a) })),
    monteCarlo: { summary: dp.summary, optimal: dp.treeEmv, readings: dp.readings },
    economicsRowLabels: [...ECONOMICS_ROW_LABELS],
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. Refusals and silent defaults.
// ---------------------------------------------------------------------------

const dec = (cost, payoff) => ({ type: 'decision', label: 'd', branches: [{ label: 'A', cost, node: T('A', payoff) }, { label: 'B', cost: 0, node: T('B', 12) }] });
const defaultRow = (what, fn) => {
  const a = attempt(fn);
  return a.ok
    ? { what, ok: true, emv: a.value.emv, bestLabel: a.value.branches ? a.value.branches[a.value.bestBranchIndex].label : 'terminal', branchAValue: a.value.branches ? a.value.branches[0].branchValue : null }
    : { what, ok: false, error: a.error };
};

export const silentDefaults = () => ({
  branchA: { payoff: 20, cost: 5 },
  branchB: { payoff: 12 },
  rows: [
    defaultRow('cost 5', () => D.rollback(dec(5, 20))),
    defaultRow('cost "5" typed as text', () => D.rollback(dec('5', 20))),
    defaultRow('cost "abc"', () => D.rollback(dec('abc', 20))),
    defaultRow('cost left empty ""', () => D.rollback(dec('', 20))),
    defaultRow('cost absent', () => D.rollback({ type: 'decision', label: 'd', branches: [{ label: 'A', node: T('A', 20) }, { label: 'B', cost: 0, node: T('B', 12) }] })),
    defaultRow('cost -5 (a receipt)', () => D.rollback(dec(-5, 20))),
    defaultRow('payoff "20" typed as text', () => D.rollback(dec(5, '20'))),
    defaultRow('payoff ""', () => D.rollback(dec(5, ''))),
    defaultRow('payoff null', () => D.rollback(dec(5, null))),
    defaultRow('payoff "20abc"', () => D.rollback(dec(5, '20abc'))),
    defaultRow('payoff { p50: 20 } with no mean', () => D.rollback(dec(5, { p50: 20 }))),
  ],
  thirds: thirds().rows.filter((x) => x.typed === '0.333' || x.typed === '0.3333333'),
  probabilityAsText: rollbackAttempt(() => D.rollback({ type: 'chance', label: 'c', branches: [{ label: 'a', probability: '0.5', node: T('a', 10) }, { label: 'b', probability: '0.5', node: T('b', 30) }] })),
  probabilityEmpty: rollbackAttempt(() => D.rollback({ type: 'chance', label: 'c', branches: [{ label: 'a', probability: '', node: T('a', 10) }, { label: 'b', probability: 1, node: T('b', 30) }] })),
  eviiRefusals: ['likelihoodColumnBelowOne', 'likelihoodColumnAboveOne', 'priorsNotDistribution', 'noSignals', 'payoffCountMismatch'].map((id) => {
    const c = GC.eviiRefusals[id]; const a = attempt(() => D.evii(c.outcomes, c.actions, c.signals, c.infoCost || 0));
    return a.ok ? { id, ok: true, evii: a.value.evii } : { id, ok: false, error: a.error };
  }),
});

// ---------------------------------------------------------------------------
// SECTION 15. Numbers to distrust.
// ---------------------------------------------------------------------------

export const ROUNDING_COSTS = [32.99, 32.996, 33, 33.004, 33.01];
export const TIE_FORM = () => ({ ...voiForm({ success: 25, payS: 200, payD: -50, decisionCost: 12.5, pPos: 40, postPos: 50, postNeg: 25 / 3, cost: 5 }), projectName: 'Tie case', decisionName: 'Drill Exploration Well' });

export const distrust = () => {
  const ps = priorSweep().hides;
  const tf = TIE_FORM();
  const tieRes = V.generateVoiData(TIE_FORM());
  const pS = tf.outcomes[0].probability / 100; const pD = tf.outcomes[1].probability / 100;
  return {
    riskNeutral: {
      drillEmv: ps.drillEmv,
      farmEmv: ps.farmEmv,
      drillLossDerived: -ps.drillMoneyDerived[1],
      drillLossChance: ps.drillChances[1],
      farmLowest: Math.min(...ps.farmMoney),
    },
    tie: {
      inputs: { success: tf.outcomes[0].probability, payS: tf.outcomes[0].payoff, dry: tf.outcomes[1].probability, payD: tf.outcomes[1].payoff, decisionCost: tf.decisionCost },
      // Derived: the stated chances times the payoffs, less the cost.
      actingValueDerived: pS * tf.outcomes[0].payoff + pD * tf.outcomes[1].payoff - tf.decisionCost,
      surveyCost: tf.infoScenario.cost,
      ...voiSummary(tieRes),
      insightOpening: `${tieRes.insights.split('. ')[0]}.`,
    },
    rounding: ROUNDING_COSTS.map((cost) => {
      const x = clone(GC.voi.suiteDefaults.inputs); x.infoScenario.cost = cost; const res = V.generateVoiData(x);
      return { cost, netVoi: res.kpis.netVoi, verdict: verdictOf(res.insights) };
    }),
    cannotChange: {
      accuracy: 0.6,
      evii: D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, symmetric(0.6), 0).evii,
      dominantActionEvpi: D.evpi(GC.evpi.dominantAction.outcomes, GC.evpi.dominantAction.actions).evpi,
      certainOutcomeEvpi: D.evpi(GC.evpi.certainOutcome.outcomes, GC.evpi.certainOutcome.actions).evpi,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 16. The teaching fields end to end.
// ---------------------------------------------------------------------------

export const endToEnd = () => {
  const ek = D.rollback(EKPAN_TREE());
  const ok = D.rollback(OKRIKA_TREE());
  const ei = D.evii(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS, EKPAN_SIGNALS, EKPAN_SURVEY_COST);
  const ep = D.evpi(outcomesAt(EKPAN_PRIOR), EKPAN_ACTIONS);
  const typed = V.generateVoiData(voiForm(ekpanPercents()));
  const irri = V.generateVoiData(IRRI_FORM());
  return {
    ekpan: { emv: ek.emv, bestLabel: bestLabelOf(ek), branchValues: ek.branches.map((b) => b.branchValue) },
    okrika: { emv: ok.emv, bestLabel: bestLabelOf(ok), branchValues: ok.branches.map((b) => b.branchValue) },
    lottery: { emvPrior: ep.emvPrior, evpi: ep.evpi, evii: ei.evii, netEvii: ei.netEvii, switchDerived: switchPoint().drillFarmSwitchDerived },
    analyzer: { voi: typed.kpis.voi, netVoi: typed.kpis.netVoi, evpi: typed.kpis.evpi },
    irri: { voi: irri.kpis.voi, consistent: irri.consistency.consistent, withheld: irri.withheld },
  };
};

// ===========================================================================
// THE CAPSTONE. ABALAMA ONLY. NOT FOR LESSONS, NOT FOR PANELS.
// ===========================================================================
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL: ABALAMA's tree, its
// three-outcome lottery and survey, its three readings, its Monte Carlo
// summary and its typed Analyzer inputs, copied VERBATIM from
// /root/ec-wip-decision/ec4_fields.mjs with the names prefixed, and the
// derivation of the eighteen graded fields. Every exported name carries ABALAMA
// or abalama, every one is listed in CAPSTONE_ONLY_EXPORTS, and
// panelCapstoneGuard.test.js fails if a panel or the course page names one.
// It exists for the grader's migration and the tests, nothing else.

// ---------------------------------------------------------------- Associate
export const ABALAMA_TREE_INPUTS = {
  drillCost: 47.3,
  pSuccess: 0.37, pMarginal: 0.21, pDry: 0.42,
  developCost: 212.6, pLarge: 0.62, large: 684.2, small: 118.9, sell: 268.4,
  marginal: 96.4, dry: -31.8,
  farm: [118.5, 22.7, 0],
  movedSuccess: 0.30,
};
const abalamaDevelop = (t) => ({ type: 'chance', label: 'Development outcome', branches: [
  { label: 'Large', probability: t.pLarge, node: T('Large', t.large) },
  { label: 'Small', probability: 1 - t.pLarge, node: T('Small', t.small) },
] });
export const abalamaTree = (t = ABALAMA_TREE_INPUTS, { noSell = false, pSuccess = t.pSuccess, largePayoff = t.large } = {}) => {
  const pDry = 1 - pSuccess - t.pMarginal;
  const tt = { ...t, large: largePayoff };
  return {
    type: 'decision', label: 'ABALAMA prospect', branches: [
      { label: 'Drill', cost: t.drillCost, node: { type: 'chance', label: 'Drill outcome', branches: [
        { label: 'Success', probability: pSuccess, node: { type: 'decision', label: 'After a success', branches: [
          { label: 'Develop', cost: t.developCost, node: abalamaDevelop(tt) },
          ...(noSell ? [] : [{ label: 'Sell', cost: 0, node: T('Sell', t.sell) }]),
        ] } },
        { label: 'Marginal', probability: t.pMarginal, node: T('Marginal', t.marginal) },
        { label: 'Dry hole', probability: pDry, node: T('Dry hole', t.dry) },
      ] } },
      { label: 'Farm out', cost: 0, node: { type: 'chance', label: 'Farm-out outcome', branches: [
        { label: 'Success', probability: pSuccess, node: T('Carried success', t.farm[0]) },
        { label: 'Marginal', probability: t.pMarginal, node: T('Carried marginal', t.farm[1]) },
        { label: 'Dry hole', probability: pDry, node: T('Carried dry hole', t.farm[2]) },
      ] } },
      { label: 'Walk away', cost: 0, node: T('Walk away', 0) },
    ],
  };
};

// ------------------------------------------------------------- Professional
export const ABALAMA_LOTTERY = {
  outcomes: [{ label: 'Large', probability: 0.18 }, { label: 'Modest', probability: 0.34 }, { label: 'Dry', probability: 0.48 }],
  actions: [
    { label: 'Drill', cost: 62.5, payoffs: [735.0, 88.0, -52.0] },
    { label: 'Farm out', cost: 0, payoffs: [142.0, 34.6, 0] },
    { label: 'Relinquish', cost: 0, payoffs: [0, 0, 0] },
  ],
  signals: [
    { label: 'Strong', likelihoods: [0.78, 0.46, 0.17] },
    { label: 'Weak', likelihoods: [0.22, 0.54, 0.83] },
  ],
  surveyCost: 11.4,
};

// ------------------------------------------------------------------- Expert
export const ABALAMA_THREE_READINGS = [
  { label: 'Strong', likelihoods: [0.66, 0.31, 0.09] },
  { label: 'Mixed', likelihoods: [0.23, 0.44, 0.27] },
  { label: 'Weak', likelihoods: [0.11, 0.25, 0.64] },
];
export const ABALAMA_MC_SUMMARY = { mean: 760.5, p90: 455.0, p50: 721.3, p10: 1098.4 };
export const ABALAMA_TYPED = { strong: [37.1, 41.3, 21.6], weak: [6.4, 29.5, 64.1] };

const ABALAMA_MONEY = 0.001;
const ABALAMA_PCT = 0.001;

/** The eighteen graded fields, [tier, key, value, tolerance], as ec4_fields.mjs computes them. */
export const abalamaCapstoneFields = () => {
  const TREE = ABALAMA_TREE_INPUTS;
  const tree = D.rollback(abalamaTree());
  const drill = tree.branches[0];
  const afterSuccess = drill.node.branches[0].node;
  const noSellTree = D.rollback(abalamaTree(TREE, { noSell: true }));
  const movedTree = D.rollback(abalamaTree(TREE, { pSuccess: TREE.movedSuccess }));

  const { outcomes, actions, signals, surveyCost } = ABALAMA_LOTTERY;
  const ep = D.evpi(outcomes, actions);
  const ei = D.evii(outcomes, actions, signals, surveyCost);
  const twoActions = [actions[0], actions[2]];
  const ei2 = D.evii(outcomes, twoActions, signals, surveyCost);
  const ep2 = D.evpi(outcomes, twoActions);

  const ei3 = D.evii(outcomes, actions, ABALAMA_THREE_READINGS, 0);
  const mcTree = D.rollback(abalamaTree(TREE, { largePayoff: ABALAMA_MC_SUMMARY }));
  const others = mcTree.branches.filter((_, i) => i !== mcTree.bestBranchIndex).map((b) => b.branchValue);
  const advantage = mcTree.emv - Math.max(...others);

  const typedFrac = { s: ABALAMA_TYPED.strong.map((x) => x / 100), w: ABALAMA_TYPED.weak.map((x) => x / 100) };
  let lo = 0; let hi = 1;
  outcomes.forEach((o, i) => {
    const a = typedFrac.s[i] - typedFrac.w[i]; const b = typedFrac.w[i];
    const bounds = [(o.probability - 0.005 - b) / a, (o.probability + 0.005 - b) / a].sort((x, y) => x - y);
    lo = Math.max(lo, bounds[0]); hi = Math.min(hi, bounds[1]);
  });

  const MONEY = ABALAMA_MONEY;
  const PCT = ABALAMA_PCT;
  return [
    ['beginner', 'ab_develop_chance_emv_musd', afterSuccess.branches[0].node.emv, MONEY],
    ['beginner', 'ab_drill_chance_emv_musd', drill.node.emv, MONEY],
    ['beginner', 'ab_root_emv_musd', tree.emv, MONEY],
    ['beginner', 'ab_farm_out_value_musd', tree.branches[1].branchValue, MONEY],
    ['beginner', 'ab_drill_value_no_sell_option_musd', noSellTree.branches[0].branchValue, MONEY],
    ['beginner', 'ab_drill_value_success_moved_musd', movedTree.branches[0].branchValue, MONEY],
    ['intermediate', 'ab_emv_prior_musd', ep.emvPrior, MONEY],
    ['intermediate', 'ab_evpi_musd', ep.evpi, MONEY],
    ['intermediate', 'ab_emv_after_weak_musd', ei.perSignal[1].emv, MONEY],
    ['intermediate', 'ab_evii_musd', ei.evii, MONEY],
    ['intermediate', 'ab_net_evii_musd', ei.netEvii, MONEY],
    ['intermediate', 'ab_two_action_voi_musd', ei2.evii, MONEY],
    ['advanced', 'ab_three_reading_evii_musd', ei3.evii, MONEY],
    ['advanced', 'ab_three_reading_mixed_emv_musd', ei3.perSignal[1].emv, MONEY],
    ['advanced', 'ab_mc_linked_root_emv_musd', mcTree.emv, MONEY],
    ['advanced', 'ab_mc_linked_decision_advantage_musd', advantage, MONEY],
    ['advanced', 'ab_analyzer_evpi_two_action_musd', ep2.evpi, MONEY],
    ['advanced', 'ab_max_strong_chance_consistent_pct', hi * 100, PCT],
  ];
};

export const abalamaCapstoneValues = (fieldList = abalamaCapstoneFields()) =>
  Object.fromEntries(fieldList.map(([, key, v]) => [key, v]));

export const abalamaCapstoneTolerances = (fieldList = abalamaCapstoneFields()) =>
  Object.fromEntries(fieldList.map(([, key, , tol]) => [key, tol]));

/** Every capstone export. A panel or the course page naming any of these fails panelCapstoneGuard.test.js. */
export const CAPSTONE_ONLY_EXPORTS = [
  'ABALAMA_TREE_INPUTS', 'ABALAMA_LOTTERY', 'ABALAMA_THREE_READINGS', 'ABALAMA_MC_SUMMARY', 'ABALAMA_TYPED',
  'abalamaTree', 'abalamaCapstoneFields', 'abalamaCapstoneValues', 'abalamaCapstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

// ---------------------------------------------------------------------------
// The leak guard machinery, the fiscal and uncertainty courses', unchanged.
// ---------------------------------------------------------------------------

/** How much wider than the grader's own band a teaching number has to stand clear. */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = [
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
];

/**
 * Every forbidden neighbourhood: eighteen answers, three shiftings, ten times
 * the grading band, the band SCALED with the shifting because the grader's
 * tolerance is absolute in the field's own units.
 */
export const leakGuardTargets = (fieldList) => {
  const out = [];
  fieldList.forEach(([tier, key, v, tol]) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const gradingBand = tol * Math.abs(factor);
      out.push({ tier, key, tag, value: v * factor, gradingBand, band: LEAK_GUARD_MARGIN * gradingBand });
    });
  });
  return out;
};

/** The target a number collides with, or null. Dimension blind: a box takes any number. */
export const leakGuardHit = (v, targets) => {
  if (!Number.isFinite(v)) return null;
  for (const t of targets) {
    if (Math.abs(v - t.value) < t.band) return t;
  }
  return null;
};

/** Every finite number reachable inside a value, with the path it sits at. */
export const collectNumbers = (v, path = '', out = [], depth = 0) => {
  if (depth > 12) return out;
  if (typeof v === 'number') {
    if (Number.isFinite(v)) out.push({ path, value: v });
    return out;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => collectNumbers(x, `${path}[${i}]`, out, depth + 1));
    return out;
  }
  if (v && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => collectNumbers(x, path ? `${path}.${k}` : k, out, depth + 1));
  }
  return out;
};
