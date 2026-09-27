// The engines, loaded the way the digest generator loads them (ec4_dump.mjs:
// the vendored engines/economics/decisionTree.js and voi.js under
// packages/engines), plus the published goldens and the teaching fields the
// course teaches on. Key-truth checks import this and CALL the engine; nothing
// here restates a formula. The teaching fields are copied from ec4_dump.mjs.
// EC4_ENGINES points the whole lib at a planted copy (keytruth --plant-engine).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = process.env.EC4_ENGINES || path.resolve(HERE, '../../../../packages/engines');
export const D = await import(`${ROOT}/engines/economics/decisionTree.js`);
export const V = await import(`${ROOT}/engines/economics/voi.js`);
export const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/decision_cases.json`, 'utf8'));
const byId = (list) => Object.fromEntries(list.map((c) => [c.id, c]));
/** Published cases by block then id: GC.rollback.equalEmvTie. */
export const GC = Object.fromEntries(Object.entries(G).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, byId(v)]));
export const clone = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));
/** The engine's refusal message for fn, or null when it does not refuse. */
export const refusal = (fn) => { try { fn(); return null; } catch (e) { return e.message; } };
export const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ------------------------------------------------ teaching fields (ec4_dump.mjs)
export const T = (label, payoff) => ({ type: 'terminal', label, payoff });
export const EKPAN_PRIOR = 0.35;
export const outcomesAt = (p) => [{ label: 'Success', probability: p }, { label: 'Dry hole', probability: 1 - p }];
export const EKPAN_ACTIONS = [
  { label: 'Drill', cost: 55, payoffs: [420, -25] },
  { label: 'Farm out', cost: 0, payoffs: [95, 0] },
  { label: 'Walk away', cost: 0, payoffs: [0, 0] },
];
export const EKPAN_SIGNALS = [
  { label: 'Bright spot', likelihoods: [0.85, 0.25] },
  { label: 'No bright spot', likelihoods: [0.15, 0.75] },
];
export const INFO_LABEL = 'Acquire CSEM survey';
/** The EKPAN lottery's switch between Drill and Farm out, read off the stated payoffs (80 / 350). */
export const SWITCH = 80 / 350;
/** The EKPAN lottery's best action at a probability, with the actions in the order given. */
export const lottery = (p, actions = EKPAN_ACTIONS) => D.bestActionEmv(outcomesAt(p), clone(actions));
/** The EKPAN information tree at a survey cost, rolled back. */
export const infoTree = (cost) => D.rollback(D.buildInformationTree({ outcomes: outcomesAt(EKPAN_PRIOR), actions: clone(EKPAN_ACTIONS), signals: clone(EKPAN_SIGNALS), infoCost: cost, infoLabel: INFO_LABEL }));
/** EKPAN's gross EVII, the price that makes the survey neutral. */
export const grossEvii = () => D.evii(outcomesAt(EKPAN_PRIOR), clone(EKPAN_ACTIONS), clone(EKPAN_SIGNALS), 0).evii;
/** A chance node paying 30 / 60 / 90 with each probability typed as p (or a list). */
export const thirds = (p) => ({ type: 'chance', label: 'Three equal outcomes', branches: [30, 60, 90].map((v, i) => ({ label: `o${i + 1}`, probability: Array.isArray(p) ? p[i] : p, node: T(`o${i + 1}`, v) })) });
/** Branch A pays `payoff` at `cost` (undefined = left out), branch B pays 12 at no cost. */
export const dec = (cost, payoff = 20) => ({ type: 'decision', label: 'd', branches: [
  cost === undefined ? { label: 'A', node: T('A', payoff) } : { label: 'A', cost, node: T('A', payoff) },
  { label: 'B', cost: 0, node: T('B', 12) }] });
/** A published rollback case, rolled back, with its root branches reordered by index. */
export const published = (id, order = null) => {
  const t = clone(GC.rollback[id].tree);
  if (order) t.branches = order.map((i) => t.branches[i]);
  return D.rollback(t);
};
/** drillFarmOut with both chance nodes' success moved to p. */
export const drillFarmOutAt = (p) => {
  const t = clone(GC.rollback.drillFarmOut.tree);
  t.branches.forEach((b) => { if (b.node.type === 'chance') { b.node.branches[0].probability = p; b.node.branches[1].probability = 1 - p; } });
  return D.rollback(t);
};
/** The two-branch Drill (40 less 10) against Farm out (30) decision, Drill first unless swapped. */
export const tiePair = (swapped = false) => {
  const drill = { label: 'Drill', cost: 10, node: T('Drill', 40) };
  const farm = { label: 'Farm out', cost: 0, node: T('Farm out', 30) };
  return D.rollback({ type: 'decision', label: 'tie', branches: swapped ? [farm, drill] : [drill, farm] });
};
/** The Analyzer defaults (published suiteDefaults) at a survey cost. */
export const analyzerAt = (cost) => { const x = clone(GC.voi.suiteDefaults.inputs); x.infoScenario.cost = cost; return V.generateVoiData(x); };
/** The Analyzer tie case (ec4_dump.mjs tieForm): acting worth exactly 0. */
export const TIE_FORM = () => ({
  projectName: 'Tie case', decisionName: 'Drill Exploration Well', decisionCost: 12.5,
  outcomes: [{ id: 1, name: 'Success', probability: 25, payoff: 200 }, { id: 2, name: 'Dry hole', probability: 75, payoff: -50 }],
  infoScenario: { name: 'CSEM survey', cost: 5, indicators: [
    { id: 1, name: 'Bright spot', probability: 40, conditionalProbabilities: [{ outcomeId: 1, probability: 50 }, { outcomeId: 2, probability: 50 }] },
    { id: 2, name: 'No bright spot', probability: 60, conditionalProbabilities: [{ outcomeId: 1, probability: 25 / 3 }, { outcomeId: 2, probability: 100 - 25 / 3 }] },
  ] },
});
/**
 * Decision Studio's first-move and advantage rows, restated from the Suite's
 * briefModel.js and firstMoveLabel.js (ec4_dump.mjs brief): the first move
 * reads the engine's card-precision tie set.
 */
export const briefRows = (a) => {
  if (a.type === 'chance') return { move: 'Chance root: no first decision to make', adv: null };
  const tied = a.tiedIndicesAtCardPrecision;
  const ls = tied.map((i) => `"${a.branches[i].label}"`);
  const q = ls.length <= 1 ? ls.join('') : `${ls.slice(0, -1).join(', ')} and ${ls[ls.length - 1]}`;
  const move = tied.length > 1 ? `Indifferent: ${q} come to the same figure` : `"${a.branches[a.bestBranchIndex].label}"`;
  const others = a.branches.filter((_, i) => i !== a.bestBranchIndex).map((b) => b.branchValue);
  const next = others.length ? Math.max(...others) : null;
  return { move, next, adv: next == null ? null : (a.indifferentAtCardPrecision ? 'Indifferent at the precision shown' : a.emv - next) };
};
export default [];
