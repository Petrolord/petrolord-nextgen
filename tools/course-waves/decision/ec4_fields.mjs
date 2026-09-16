// THE EC4 CAPSTONE. This file computes the eighteen GRADED values and the aux
// block for the migration headers. It runs ABALAMA, a field whose conditions
// appear NOWHERE in ec4_dump.mjs or digest.txt: its own tree, its own
// three-outcome lottery, its own survey and its own typed Analyzer inputs.
// The teaching digest and the capstone are two files with opposite audiences
// and they never share a number (dc-wavekit README, "The teaching digest is
// NOT the capstone").
//
// Usage:  node /root/ec-wip-decision/ec4_fields.mjs            prints the aux block
//         node /root/ec-wip-decision/ec4_fields.mjs --report   nearest digest literal per field, in tolerances
//         node /root/ec-wip-decision/ec4_fields.mjs --json     writes fields.json
//
// Tolerances are ABSOLUTE in each field's own units: the grader is
// abs(v_got - v_exp) <= v_tol (public.academy_submit_capstone).

import fs from 'fs';

const ROOT = process.env.EC4_ENGINES || '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen-ec4/packages/engines';
const D = await import(`${ROOT}/engines/economics/decisionTree.js`);
const V = await import(`${ROOT}/engines/economics/voi.js`);

const T = (label, payoff) => ({ type: 'terminal', label, payoff });

// ---------------------------------------------------------------- Associate
export const TREE = {
  drillCost: 47.3,
  pSuccess: 0.37, pMarginal: 0.21, pDry: 0.42,
  developCost: 212.6, pLarge: 0.62, large: 684.2, small: 118.9, sell: 268.4,
  marginal: 96.4, dry: -31.8,
  farm: [118.5, 22.7, 0],
  movedSuccess: 0.30,
};
const develop = (t) => ({ type: 'chance', label: 'Development outcome', branches: [
  { label: 'Large', probability: t.pLarge, node: T('Large', t.large) },
  { label: 'Small', probability: 1 - t.pLarge, node: T('Small', t.small) },
] });
export const abalamaTree = (t = TREE, { noSell = false, pSuccess = t.pSuccess, largePayoff = t.large } = {}) => {
  const pDry = 1 - pSuccess - t.pMarginal;
  const tt = { ...t, large: largePayoff };
  return {
    type: 'decision', label: 'ABALAMA prospect', branches: [
      { label: 'Drill', cost: t.drillCost, node: { type: 'chance', label: 'Drill outcome', branches: [
        { label: 'Success', probability: pSuccess, node: { type: 'decision', label: 'After a success', branches: [
          { label: 'Develop', cost: t.developCost, node: develop(tt) },
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
export const LOTTERY = {
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
export const THREE_READINGS = [
  { label: 'Strong', likelihoods: [0.66, 0.31, 0.09] },
  { label: 'Mixed', likelihoods: [0.23, 0.44, 0.27] },
  { label: 'Weak', likelihoods: [0.11, 0.25, 0.64] },
];
// The success payoff of the tree's Large development outcome linked to a
// Monte Carlo summary (P90 is the low case). Only the mean enters.
export const MC_SUMMARY = { mean: 760.5, p90: 455.0, p50: 721.3, p10: 1098.4 };
// Typed Analyzer inputs: the survey's Bayes posteriors rounded to one
// decimal of a percent (each reading's three still sum to 100).
export const TYPED = { strong: [37.1, 41.3, 21.6], weak: [6.4, 29.5, 64.1] };

// ---------------------------------------------------------------- computing
const tree = D.rollback(abalamaTree());
const drill = tree.branches[0];
const afterSuccess = drill.node.branches[0].node;
const noSellTree = D.rollback(abalamaTree(TREE, { noSell: true }));
const movedTree = D.rollback(abalamaTree(TREE, { pSuccess: TREE.movedSuccess }));

const { outcomes, actions, signals, surveyCost } = LOTTERY;
const ep = D.evpi(outcomes, actions);
const ei = D.evii(outcomes, actions, signals, surveyCost);
const twoActions = [actions[0], actions[2]];
const ei2 = D.evii(outcomes, twoActions, signals, surveyCost);
const ep2 = D.evpi(outcomes, twoActions);

const ei3 = D.evii(outcomes, actions, THREE_READINGS, 0);
const infoTree = D.rollback(D.buildInformationTree({ outcomes, actions, signals, infoCost: surveyCost, infoLabel: 'Acquire the survey' }));
const mcTree = D.rollback(abalamaTree(TREE, { largePayoff: MC_SUMMARY }));
const others = mcTree.branches.filter((_, i) => i !== mcTree.bestBranchIndex).map((b) => b.branchValue);
const advantage = mcTree.emv - Math.max(...others);

// Largest Strong indicator chance, in percent, that passes the consistency
// check with the typed posteriors: implied_o = p s_o + (1 - p) w_o must sit
// within 0.005 of each stated prior. Each outcome bounds p; intersect.
const typedFrac = { s: TYPED.strong.map((x) => x / 100), w: TYPED.weak.map((x) => x / 100) };
let lo = 0; let hi = 1;
outcomes.forEach((o, i) => {
  const a = typedFrac.s[i] - typedFrac.w[i]; const b = typedFrac.w[i];
  const bounds = [(o.probability - 0.005 - b) / a, (o.probability + 0.005 - b) / a].sort((x, y) => x - y);
  lo = Math.max(lo, bounds[0]); hi = Math.min(hi, bounds[1]);
});
const consistentAt = (p) => D.impliedPriors(outcomes, [
  { label: 'Strong', probability: p, posteriors: typedFrac.s },
  { label: 'Weak', probability: 1 - p, posteriors: typedFrac.w },
]).consistent;

const MONEY = 0.001;
const PCT = 0.001;

export const FIELDS = [
  // Associate: one tree rolled back.
  ['beginner', 'ab_develop_chance_emv_musd', afterSuccess.branches[0].node.emv, MONEY],
  ['beginner', 'ab_drill_chance_emv_musd', drill.node.emv, MONEY],
  ['beginner', 'ab_root_emv_musd', tree.emv, MONEY],
  ['beginner', 'ab_farm_out_value_musd', tree.branches[1].branchValue, MONEY],
  ['beginner', 'ab_drill_value_no_sell_option_musd', noSellTree.branches[0].branchValue, MONEY],
  ['beginner', 'ab_drill_value_success_moved_musd', movedTree.branches[0].branchValue, MONEY],
  // Professional: what the survey is worth.
  ['intermediate', 'ab_emv_prior_musd', ep.emvPrior, MONEY],
  ['intermediate', 'ab_evpi_musd', ep.evpi, MONEY],
  ['intermediate', 'ab_emv_after_weak_musd', ei.perSignal[1].emv, MONEY],
  ['intermediate', 'ab_evii_musd', ei.evii, MONEY],
  ['intermediate', 'ab_net_evii_musd', ei.netEvii, MONEY],
  ['intermediate', 'ab_two_action_voi_musd', ei2.evii, MONEY],
  // Expert: bigger lotteries, the brief, the check.
  ['advanced', 'ab_three_reading_evii_musd', ei3.evii, MONEY],
  ['advanced', 'ab_three_reading_mixed_emv_musd', ei3.perSignal[1].emv, MONEY],
  ['advanced', 'ab_mc_linked_root_emv_musd', mcTree.emv, MONEY],
  ['advanced', 'ab_mc_linked_decision_advantage_musd', advantage, MONEY],
  ['advanced', 'ab_analyzer_evpi_two_action_musd', ep2.evpi, MONEY],
  ['advanced', 'ab_max_strong_chance_consistent_pct', hi * 100, PCT],
];

const RUN_DIRECTLY = import.meta.url === `file://${process.argv[1]}`;
if (!RUN_DIRECTLY) {
  // Imported by a probe or a control script: compute, print nothing.
} else if (process.argv.includes('--json')) {
  fs.writeFileSync('/root/ec-wip-decision/fields.json', `${JSON.stringify(FIELDS, null, 1)}\n`);
  console.error(`wrote fields.json, ${FIELDS.length} fields`);
} else if (process.argv.includes('--report')) {
  const digest = fs.readFileSync('/root/ec-wip-decision/digest.txt', 'utf8');
  const lits = (digest.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  if (lits.length < 1000) {
    throw new Error(`digest.txt has only ${lits.length} numeric literals: it is empty or mid-rebuild, refusing to report clearances`);
  }
  console.log('field, value, tol, nearest digest literal in tolerances under three shiftings (x1, x1000, x0.001)');
  for (const [t, k, v, tol] of FIELDS) {
    const d = (scale) => Math.min(...lits.map((x) => Math.abs(x * scale - v))) / tol;
    const worst = Math.min(d(1), d(1000), d(0.001));
    console.log(`${t.padEnd(13)} ${k.padEnd(40)} ${Number(v).toFixed(6).padStart(14)} tol ${tol} nearest ${worst.toFixed(1)}${worst < 10 ? '  LEAK RISK' : ''}`);
  }
  console.log(`checks: tree best "${tree.branches[tree.bestBranchIndex].label}" values ${tree.branches.map((b) => b.branchValue.toFixed(4)).join(' / ')}; after success best "${afterSuccess.branches[afterSuccess.bestBranchIndex].label}" (${afterSuccess.branches.map((b) => b.branchValue.toFixed(4)).join(' / ')}); no-sell best "${noSellTree.branches[noSellTree.bestBranchIndex].label}"; moved best "${movedTree.branches[movedTree.bestBranchIndex].label}"`);
  console.log(`lottery: prior best ${D.bestActionEmv(outcomes, actions).actionIndex}; per signal ${ei.perSignal.map((s) => `${s.label} p ${s.pSignal.toFixed(6)} best ${s.bestActionIndex} emv ${s.emv.toFixed(4)}`).join('; ')}; two-action per signal best ${ei2.perSignal.map((s) => s.bestActionIndex).join('')}; three readings best ${ei3.perSignal.map((s) => s.bestActionIndex).join('')}; info tree best ${infoTree.bestBranchIndex} values ${infoTree.branches.map((b) => b.branchValue.toFixed(4)).join(' / ')}; mc tree best "${mcTree.branches[mcTree.bestBranchIndex].label}" values ${mcTree.branches.map((b) => b.branchValue.toFixed(4)).join(' / ')}, after success ${mcTree.branches[0].node.branches[0].node.branches.map((b) => b.branchValue.toFixed(4)).join(' / ')}; two-action evpi ${ep2.evpi.toFixed(4)} vs three-action ${ep.evpi.toFixed(4)}; two-action per signal emv ${ei2.perSignal.map((x) => x.emv.toFixed(4)).join(' / ')}; typed sums ${TYPED.strong.reduce((a, b) => a + b, 0).toFixed(6)} / ${TYPED.weak.reduce((a, b) => a + b, 0).toFixed(6)}`);
  console.log(`consistency window for the Strong chance: ${ (lo * 100).toFixed(6)} .. ${(hi * 100).toFixed(6)} percent; engine consistent at hi ${consistentAt(hi)}, at hi + 1e-7 ${consistentAt(hi + 1e-7)}, at the Bayes chance ${(ei.perSignal[0].pSignal * 100).toFixed(6)}: ${consistentAt(ei.perSignal[0].pSignal)}; Bayes posteriors Strong ${ei.perSignal[0].posterior.map((x) => (x * 100).toFixed(4)).join(' / ')}, Weak ${ei.perSignal[1].posterior.map((x) => (x * 100).toFixed(4)).join(' / ')}`);
} else {
  console.log('EC4 CAPSTONE, ABALAMA. Aux block for the migration headers.');
  console.log(`Tree: ${JSON.stringify(TREE)}`);
  console.log(`Lottery: ${JSON.stringify(LOTTERY)}`);
  console.log(`Three readings: ${JSON.stringify(THREE_READINGS)}; MC summary ${JSON.stringify(MC_SUMMARY)}; typed ${JSON.stringify(TYPED)}`);
  console.log('');
  console.log('The eighteen graded fields:');
  for (const [t, k, v, tol] of FIELDS) console.log(`  ${t.padEnd(13)} ${k.padEnd(40)} ${String(v).padEnd(24)} tol ${tol}`);
}
