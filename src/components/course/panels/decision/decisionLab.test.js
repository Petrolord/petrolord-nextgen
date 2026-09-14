// Every value the EC4 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (/root/ec-wip-decision/digest.txt), which is
// itself nothing but the decision tree engine's and the VOI Analyzer's return
// values on the published goldens and on the teaching fields EKPAN, OKRIKA and
// IRRI. The digest prints money to four decimals in million USD, probabilities
// to six, and the Analyzer's KPI cards as the two-decimal strings the engine
// returns (withheld cards as the word withheld, for a null).
//
// HOW THE PIN WORKS. This file REGENERATES THE WHOLE DIGEST from the lab's
// return values alone, with the digest's own formatting (ported from
// ec4_dump.mjs), and compares it to the file on disk section by section, line
// by line, character for character: every number, every engine message and
// every insight sentence. This file imports no engine; the only numbers it
// prints are the lab's. A lab value that drifts, a reader that goes missing or
// a digest that is rebuilt with a changed number all fail here.
//
// THE EIGHTEEN GRADED FIELDS of the ABALAMA capstone are pinned separately and
// EXACTLY against /root/ec-wip-decision/fields.json, READ FROM THE FILE.
//
// Then the leak gate: no teaching export may return a number within ten times
// a graded field's ABSOLUTE tolerance of a graded answer, in any of three unit
// shiftings, with the band scaled by the shifting. The gate refuses to run over
// an implausibly small surface (dc-wavekit README section 13).

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './decisionLab.js';

const LAB = Object.fromEntries(Object.entries(L));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIGEST = '/root/ec-wip-decision/digest.txt';
const FIELDS_JSON = '/root/ec-wip-decision/fields.json';
const DUMP_MJS = '/root/ec-wip-decision/ec4_dump.mjs';
const FIELDS_MJS = '/root/ec-wip-decision/ec4_fields.mjs';

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from ec4_dump.mjs.
// ---------------------------------------------------------------------------

const f = (x, n) => ((x === null || x === undefined || Number.isNaN(Number(x))) ? 'null' : Number(x).toFixed(n));
const m = (x) => f(x, 4); // money, million USD
const r = (x) => f(x, 6); // probabilities, likelihoods, posteriors
const said = (res) => (res.ok ? `accepted, emv ${m(res.emv)}` : `refused: "${res.error}"`);
const card = (v) => (v === null ? 'withheld' : v);
const kpiLine = (s) => `emvWithoutInfo ${card(s.kpis.emvWithoutInfo)}, emvWithInfo ${card(s.kpis.emvWithInfo)}, voi ${card(s.kpis.voi)}, netVoi ${card(s.kpis.netVoi)}, evpi ${card(s.kpis.evpi)}; consistent ${s.consistent}; withheld ${s.withheld}; tree ${s.tree ? `drawn, root emv ${m(s.tree.emv)}, root bestBranchIndex ${s.tree.bestBranchIndex}` : 'not drawn'}`;
const voiLine = (s) => (s.ok ? kpiLine(s) : `refused: "${s.error}"`);
const values = (branches, sep = ', ') => branches.map((b) => `"${b.label}" ${m(b.branchValue)}`).join(sep);

const treeTable = (w, tv) => {
  const { root } = tv;
  w(`Root "${root.label}" (${root.type}): emv ${m(root.emv)}${root.type === 'decision' ? `, bestBranchIndex ${root.bestBranchIndex} ("${root.bestLabel}")` : ''}.`);
  w('| path | branch | probability and cost | child | branchValue | onOptimalPath |');
  w('| --- | --- | --- | --- | --- | --- |');
  tv.rows.forEach((x) => {
    const extra = [];
    if (x.probability !== null) extra.push(`probability ${r(x.probability)}`);
    if (x.cost !== null) extra.push(`cost ${m(x.cost)}`);
    const kid = x.childType === 'terminal'
      ? `terminal payoff ${typeof x.payoff === 'object' ? JSON.stringify(x.payoff) : m(x.payoff)}`
      : `${x.childType} "${x.childLabel}" emv ${m(x.childEmv)}`;
    w(`| ${x.path} | ${'. '.repeat(x.depth)}${x.label} | ${extra.join(', ') || 'none'} | ${kid} | ${m(x.branchValue)} | ${x.onOptimalPath} |`);
  });
};

// ---------------------------------------------------------------------------
// THE DIGEST, REGENERATED FROM THE LAB. One function per section. Prose lines
// that carry no number are the digest's own sentences; every number is a lab
// return value.
// ---------------------------------------------------------------------------

const SECTIONS = {
  head: (w) => {
    w('# EC4 Decision Analysis & Value of Information. Teaching digest.');
    w('# Money is million USD. Probabilities, likelihoods and posteriors print to six decimals; money to four. The VOI Analyzer returns its five KPI cards as two-decimal STRINGS, printed as returned.');
    w();
  },

  1: (w) => {
    w('# SECTION 1: The engine, what it assumes and what it refuses (owned by Associate m01)');
    w();
    const rules = L.engineRules();
    rules.lines.forEach((l) => w(l));
    w();
    w('Refusals, each the engine message verbatim (published rollbackRefusals cases):');
    L.refusals().forEach((x) => w(`- ${x.what}: ${said(x)}`));
    w();
    w(`Two numbers already discounted, EKPAN's drill success payoff ${m(rules.successPayoff)} and its dry hole ${m(rules.dryHolePayoff)}, enter unchanged: the rollback has no rate to apply. EKPAN tree emv ${m(rules.treeEmv)}.`);
    w();
  },

  2: (w) => {
    w('# SECTION 2: Chance nodes on the EKPAN tree (owned by Associate m02)');
    w();
    const ek = L.ekpanTree();
    treeTable(w, ek);
    w();
    const dc = ek.chanceNodes.find((x) => x.path === '0');
    const fc = ek.chanceNodes.find((x) => x.path === '1');
    const terms = (c) => c.terms.map((t) => `${r(t.probability)} x ${m(t.branchValue)}`).join(' + ');
    w(`Drill chance node by hand: ${terms(dc)} = ${m(dc.emv)} (engine), less the drill cost ${m(dc.incomingCost)} = branch value ${m(dc.incomingBranchValue)} (engine).`);
    w(`Farm-out chance node: ${terms(fc)} = ${m(fc.emv)} (engine).`);
    w(`# App surface: the Decision Tree Builder's drawing labels every decision and chance node "EMV" followed by the node's own value, which is the value BEFORE the cost on the branch leading into it. On EKPAN it labels the drill chance node EMV ${Number(dc.emv).toFixed(0)} while the drill branch is worth ${m(dc.incomingBranchValue)} and the root ${m(ek.root.emv)}. The drawing prints a value of 100 or more with no decimals, from 10 to 100 with one, and below 10 with two; the engine values are unrounded.`);
    w();
    const th = L.thirds();
    w(`Probabilities typed as thirds on a chance node paying ${th.payoffs.join(' / ')}:`);
    th.rows.forEach((x) => w(`- each ${x.typed}, sum ${r(x.sumDerived)}: ${said(x)}`));
    w(`# Commentary: the tolerance test is |sum - 1| > 1e-6 with no allowance for binary rounding. Each ${th.binary.typed} three times sums in binary to ${th.binary.sumDerived.toPrecision(17)}, and |sum - 1| evaluates to ${th.binary.gapDerived.toPrecision(17)} (derived), just above 1e-6, so a sum that is exactly 1e-6 short in decimal is refused while the message prints 0.999999. The same comparison guards each likelihood column (finding EC4-8, an owner decision; the half-percent check was given an allowance in EC4-0 for the same reason).`);
    w(`- published thirdsProbabilities: engine emv ${m(th.published.engineEmv)}, golden ${m(th.published.goldenEmv)}.`);
    w();
    const cc = L.costOnChanceBranch();
    w(`A cost on a chance branch (published chanceRootWithBranchCosts): root emv ${m(cc.rootEmv)}; branches ${cc.branches.map((b) => `"${b.label}" probability ${r(b.probability)} cost ${m(b.cost)} child ${m(b.childEmv)} value ${m(b.branchValue)}`).join('; ')}.`);
    w(`The same branches with every cost subtracted once AFTER weighting instead: ${m(cc.costAfterWeightingDerived)} (derived: sum of probability x child less the sum of costs; wrong, a cost on a branch is only paid on that branch).`);
    w();
    const dp = L.distributionPayoff();
    w(`A payoff that is a distribution summary. EKPAN's success terminal replaced by a linked Monte Carlo summary ${JSON.stringify(dp.summary)} (P90 is the low case): tree emv ${m(dp.treeEmv)}, identical to the plain ${m(dp.plainPayoff)} payoff, because only the mean enters the rollback.`);
    dp.readings.forEach((a) => w(`- the same tree with the success payoff read at the summary's ${a.key.toUpperCase()} instead of its mean: emv ${m(a.emv)}, best "${a.bestLabel}", Drill branch value ${m(a.drillBranchValue)} (engine, payoff ${m(a.payoff)}).`));
    w(`- a summary with no mean, { p90: 185, p50: 390, p10: 710 }: ${said(dp.noMean)}`);
    w(`- published distributionPayoff: engine emv ${m(dp.published.engineEmv)}, golden ${m(dp.published.goldenEmv)}.`);
    w('# App surface: in the Decision Tree Builder, linking a saved Monte Carlo run to a terminal stores a COPY of the run\'s NPV mean, P90 and P10 in million USD at the moment of linking. Nothing re-reads the run afterwards, so a run that is revalued must be linked again for the tree to see it. Unlinking keeps the mean as a fixed payoff.');
    w();
    const dro = L.drillOutcomes();
    w(`An EMV nobody receives. The drill branch as the money each outcome actually leaves after the drill cost (derived: outcome branch value less ${m(dro.cost)}):`);
    dro.rows.forEach((o) => w(`- ${o.label}: probability ${r(o.probability)}, money ${m(o.moneyDerived)}`));
    w(`- chance of losing money on the drill branch: ${r(dro.lossChanceDerived)} (derived); the branch value ${m(dro.branchValue)} is not among the three outcomes.`);
    w();
  },

  3: (w) => {
    w('# SECTION 3: Decision nodes (owned by Associate m03)');
    w();
    const dn = L.decisionNodes();
    w(`EKPAN root: branch values ${values(dn.root.branches)}; bestBranchIndex ${dn.root.bestBranchIndex}; emv ${m(dn.root.emv)}.`);
    w(`EKPAN marginal-find decision: ${dn.marginal.map((b) => `"${b.label}" child ${m(b.childEmv)} cost ${m(b.cost)} value ${m(b.branchValue)} onOptimalPath ${b.onOptimalPath}`).join('; ')}.`);
    w(`A branch below a branch that is NOT taken is never on the optimal path: the farm-out's three outcomes all read onOptimalPath ${dn.farmOutOnPath.join(' / ')}.`);
    w('# App surface: the Decision Tree Builder shows four cards: Optimal EMV (the root emv), Recommended first move (the root best branch label), Next best alternative (the largest other root branch value) and Decision advantage (the difference). A root that is a chance node reads "Chance root" on the first-move card and N/A on the other two; a root with one branch reads N/A on the other two.');
    w();
    dn.published.forEach((a) => w(`- published ${a.id}: engine emv ${m(a.emv)}, bestBranchIndex ${a.bestBranchIndex ?? 'none'}, branch values ${values(a.branches)}; golden emv ${m(a.goldenEmv)}.`));
    const ti = L.TIE_INPUTS;
    w(`A tie decided by listing order: Drill (${m(ti.drillPayoff)} less cost ${m(ti.drillCost)}) against Farm out (${m(ti.farmPayoff)}). Listed Drill first: best "${dn.tie.firstListed.bestLabel}". Listed Farm out first: best "${dn.tie.swapped.bestLabel}". Both emv ${m(dn.tie.firstListed.emv)}.`);
    w(`Walking away is a branch. EKPAN at a dry hole of ${m(dn.dryHolePayoff)} still drills; the root without its walk-away branch reads emv ${m(dn.withoutWalkAway.emv)}, the same, because walking away is not the best branch here.`);
    dn.poorPriors.forEach((x) => w(`- EKPAN with success at ${r(x.pSuccess)} (dry hole ${r(x.pDry)}): branch values ${values(x.branches)}; best "${x.bestLabel}"; without the walk-away branch best "${x.withoutWalkAway.bestLabel}" at ${m(x.withoutWalkAway.emv)}.`));
    w();
  },

  4: (w) => {
    w('# SECTION 4: Rolling back a sequence (owned by Associate m04)');
    w();
    const ok = L.okrika();
    treeTable(w, ok);
    w();
    w(`Right to left. Development chance at 0.75 large: ${m(ok.developChance.good)}; at 0.20 large: ${m(ok.developChance.poor)}; at 0.42 large (develop now): ${m(ok.developChance.now)}.`);
    w(`After a good appraisal: develop ${m(ok.afterGood.develop)} against sell ${m(ok.afterGood.sell)}; after a poor one: develop ${m(ok.afterPoor.develop)} against sell ${m(ok.afterPoor.sell)}.`);
    w(`Appraisal chance node ${m(ok.appraisal.chanceEmv)}, less the appraisal cost ${m(ok.appraisal.cost)} = ${m(ok.appraisal.branchValue)}.`);
    w(`The value of a later choice. Appraise with no option to sell afterwards (always develop): branch value ${m(ok.noSell.appraiseBranchValue)}; best root branch then "${ok.noSell.bestLabel}" at ${m(ok.noSell.emv)}. With the later choice the appraisal branch is ${m(ok.appraisal.branchValue)}; the difference ${m(ok.noSell.optionValueDerived)} (derived) is what the option to sell after a poor result is worth inside that branch.`);
    w(`OKRIKA appraise against its best alternative, sell now: ${m(ok.againstSellNow.appraise)} less ${m(ok.againstSellNow.sellNow)} = ${m(ok.againstSellNow.differenceDerived)} (derived).`);
    w();
    L.publishedSequences().forEach((s) => {
      w(`Published ${s.id}: engine emv ${m(s.root.emv)}, golden ${m(s.goldenEmv)}.`);
      treeTable(w, s);
      w();
    });
  },

  5: (w) => {
    w('# SECTION 5: When the decision changes (owned by Associate m05)');
    w();
    const ps = L.priorSweep();
    const [dr, fo, wa] = ps.actions;
    w(`The EKPAN lottery: Success / Dry hole; ${dr.label} cost ${m(dr.cost)} paying ${dr.payoffs.map(m).join(' / ')}; ${fo.label} ${fo.payoffs.map(m).join(' / ')}; ${wa.label} ${wa.payoffs.map(m).join(' / ')}.`);
    const dro = L.drillOutcomes();
    const h = ps.hides;
    w(`# Commentary: the EKPAN LOTTERY is a different model from the EKPAN TREE of Sections 2 and 3. The tree has three outcomes and a later decision inside its Marginal find; the lottery has two outcomes and no later decision, and at its stated success probability ${r(h.prior)} its dry hole is ${r(h.drillChances[1])} (the tree Marginal find folded into the dry hole). Name the model beside every EKPAN number: the tree drill branch is ${m(dro.branchValue)} and loses money with probability ${r(dro.lossChanceDerived)}; the lottery drill action is ${m(h.drillEmv)} and loses money with probability ${r(h.drillChances[1])}. Everything from here to Section 10 that says EKPAN means the lottery.`);
    w('| success probability | Drill | Farm out | Walk away | best action | emv |');
    w('| --- | --- | --- | --- | --- | --- |');
    ps.rows.forEach((x) => w(`| ${r(x.p)} | ${x.values.map(m).join(' | ')} | ${x.bestLabel} | ${m(x.emv)} |`));
    const sp = L.switchPoint();
    w(`Drill against farm out, a straight line each: Drill = ${sp.drillSlopeDerived} p - ${-sp.drillInterceptDerived}, Farm out = ${sp.farmSlopeDerived} p (derived from the payoffs and cost above), equal at p = ${sp.drillFarmNumeratorDerived} / ${sp.drillFarmDenominatorDerived} = ${r(sp.drillFarmSwitchDerived)} (derived). At that probability the engine reads Drill ${m(sp.drillAtSwitch)}, Farm out ${m(sp.farmAtSwitch)}, best "${sp.bestAtSwitch}".`);
    w(`# Commentary: ${sp.drillFarmNumeratorDerived} / ${sp.drillFarmDenominatorDerived} has no exact binary image, so the two values differ in the last binary digits (Drill less Farm out = ${sp.gapAtSwitchDerived.toExponential(2)}, derived). The engine's choice AT the switch probability is that rounding residue, not the tie rule; the tie rule is shown on an exact tie below.`);
    w(`On the lottery, Drill against walking away, equal at p = ${sp.drillWalkNumeratorDerived} / ${sp.drillWalkDenominatorDerived} = ${r(sp.drillWalkSwitchDerived)} (derived), below the farm-out switch, so walking away is never the best EKPAN action at any success probability above 0: Farm out pays ${sp.farmSlopeDerived} p, which is positive.`);
    w();
    const pw = L.publishedSweep();
    w('Published drillFarmOut tree with its success probability swept (both chance nodes moved together):');
    pw.rows.forEach((x) => w(`- success ${r(x.p)}: ${values(x.branches)}; best "${x.bestLabel}"`));
    w(`At success ${r(pw.tie.p)} the published tree ties Drill and Farm out exactly, and the engine reports the first branch listed.`);
    w();
    w(`What the EKPAN EMV hides, at the stated ${h.prior} prior (derived from the rows above):`);
    w(`- Drill emv ${m(h.drillEmv)}; the two outcomes it can actually produce, after the cost, are ${m(h.drillMoneyDerived[0])} with probability ${r(h.drillChances[0])} and ${m(h.drillMoneyDerived[1])} with probability ${r(h.drillChances[1])}.`);
    w(`- Farm out emv ${m(h.farmEmv)}; it can produce ${m(h.farmMoney[0])} or ${m(h.farmMoney[1])} and never loses money.`);
    w();
  },

  6: (w) => {
    w('# SECTION 6: Perfect information (owned by Professional m01)');
    w();
    const pi = L.perfectInformation();
    w(`EKPAN lottery at prior ${r(pi.prior)}: emvPrior ${m(pi.emvPrior)} (best action "${pi.bestPriorLabel}"), evWithPerfect ${m(pi.evWithPerfect)}, evpi ${m(pi.evpi)}.`);
    w('| outcome | prior | Drill net | Farm out net | Walk away net | best action if known | best value |');
    w('| --- | --- | --- | --- | --- | --- | --- |');
    pi.table.forEach((x) => w(`| ${x.label} | ${r(x.prior)} | ${x.netsDerived.map(m).join(' | ')} | ${x.bestLabel} | ${m(x.bestValueDerived)} |`));
    w(`evWithPerfect = ${pi.table.map((x) => `${r(x.prior)} x ${m(x.bestValueDerived)}`).join(' + ')} (derived from the table) = ${m(pi.evWithPerfect)} (engine).`);
    const dry = pi.table[1];
    w(`# Commentary: in the ${dry.label} row Farm out and Walk away both pay ${m(dry.netsDerived[1])}, a tie; the table names ${dry.bestLabel} only because it is listed first. EVPI takes the best VALUE per outcome, so the tie does not change it.`);
    w();
    const es = L.evpiSweep();
    w('EVPI across the prior on the EKPAN lottery:');
    w('| success probability | emvPrior | evWithPerfect | evpi |');
    w('| --- | --- | --- | --- |');
    es.rows.forEach((x) => w(`| ${r(x.p)} | ${m(x.emvPrior)} | ${m(x.evWithPerfect)} | ${m(x.evpi)} |`));
    w(`EVPI is largest at the drill against farm-out switch, ${r(es.peakAt)}, where the prior decision is least settled.`);
    w();
    pi.published.forEach((c) => {
      w(`- published ${c.id} inputs: outcomes ${c.outcomes.map((o) => `${o.label} ${r(o.probability)}`).join(', ')}; actions ${c.actions.map((a) => `${a.label} cost ${m(a.cost || 0)} paying ${a.payoffs.map((x) => (typeof x === 'object' ? `mean ${m(x.mean)}` : m(x))).join(' / ')}`).join('; ')}.`);
      w(`- published ${c.id}: engine emvPrior ${m(c.emvPrior)}, evWithPerfect ${m(c.evWithPerfect)}, evpi ${m(c.evpi)}; golden evpi ${m(c.goldenEvpi)}.`);
    });
    w();
  },

  7: (w) => {
    w('# SECTION 7: Imperfect information by Bayes (owned by Professional m02)');
    w();
    const by = L.bayes();
    w(`EKPAN survey likelihoods, P(signal | outcome): ${by.signals[0].label} ${by.signals[0].likelihoods.map(r).join(' / ')} (Success / Dry hole); ${by.signals[1].label} ${by.signals[1].likelihoods.map(r).join(' / ')}. Each outcome's column sums to 1.`);
    w('| signal | joint with Success | joint with Dry hole | pSignal | posterior Success | posterior Dry hole | best action | emv |');
    w('| --- | --- | --- | --- | --- | --- | --- | --- |');
    by.rows.forEach((s) => w(`| ${s.label} | ${r(s.jointDerived[0])} | ${r(s.jointDerived[1])} | ${r(s.pSignal)} | ${r(s.posterior[0])} | ${r(s.posterior[1])} | ${s.bestLabel} | ${m(s.emv)} |`));
    w('(The joint columns are derived: prior x likelihood. pSignal is their sum; each posterior is its joint over pSignal. The last four columns are engine returns.)');
    w(`evWithInfo ${m(by.evWithInfo)} = ${by.rows.map((s) => `${r(s.pSignal)} x ${m(s.emv)}`).join(' + ')} (engine); emvPrior ${m(by.emvPrior)}; evii ${m(by.evii)}; evpi ${m(by.evpi)}; netEvii at a survey cost of ${m(by.surveyCost)}: ${m(by.netEvii)}.`);
    w(`Bounds: 0 <= evii ${m(by.evii)} <= evpi ${m(by.evpi)}. The engine derives posteriors from likelihoods, so its inputs cannot be probabilistically inconsistent.`);
    const lm = by.likelihoodMistake;
    w(`Confusing a likelihood with a posterior: reading P(Success | Bright spot) as ${r(lm.likelihoodRead)} would give a Drill value of ${m(lm.drillAtLikelihood)} after a bright spot (engine at probability ${lm.likelihoodRead}), against the posterior's ${m(lm.drillAtPosterior)}.`);
    w();
    by.published.forEach((c) => w(`- published ${c.id}: engine evWithInfo ${m(c.evWithInfo)}, evii ${m(c.evii)}, netEvii ${m(c.netEvii)}; per signal ${c.perSignal.map((s) => `"${s.label}" pSignal ${r(s.pSignal)} posterior ${s.posterior.map(r).join(' / ')} best ${s.bestActionIndex} emv ${m(s.emv)}`).join('; ')}; golden evii ${m(c.goldenEvii)}.`));
    w();
  },

  8: (w) => {
    w('# SECTION 8: Buying the information (owned by Professional m03)');
    w();
    const it = L.informationTree();
    w(`Gross and net: evii ${m(it.evii)} is what the survey is worth before it is paid for; netEvii ${m(it.netEvii)} after its cost ${m(it.surveyCost)}.`);
    w('The EKPAN information tree, built by buildInformationTree and rolled back:');
    treeTable(w, it);
    w();
    w(`Root branch values: acquire ${m(it.acquire)} = evWithInfo ${m(it.evWithInfo)} less ${m(it.surveyCost)}; no further information ${m(it.noInformation)} = emvPrior. Their difference ${m(it.differenceDerived)} (derived) equals netEvii ${m(it.netEvii)}.`);
    w(`The price that makes the survey value neutral is the gross evii, ${m(it.neutralCost)}.`);
    w('| survey cost | acquire branch value | no-information branch value | netEvii | root choice |');
    w('| --- | --- | --- | --- | --- |');
    const cs = L.costSweep();
    cs.rows.forEach((x) => w(`| ${m(x.cost)} | ${m(x.acquire)} | ${m(x.noInformation)} | ${m(x.netEvii)} | ${x.rootChoice} |`));
    w('At a cost exactly equal to evii the two root branches tie and the engine keeps the first branch listed, the acquisition.');
    w();
    it.published.forEach((c) => {
      w(`- published ${c.id} inputs: outcomes ${c.outcomes.map((o) => `${o.label} ${r(o.probability)}`).join(', ')}; actions ${c.actions.map((a) => `${a.label} cost ${m(a.cost || 0)} paying ${a.payoffs.map(m).join(' / ')}`).join('; ')}; signals ${c.signals.map((g) => `${g.label} ${g.likelihoods.map(r).join(' / ')}`).join('; ') || 'none'}; survey cost ${m(c.infoCost)}.`);
      w(`- published ${c.id}: engine root ${c.rootLabel ? `"${c.rootLabel}"` : ''} emv ${m(c.emv)}, bestBranchIndex ${c.bestBranchIndex}, root branch values ${c.branchValues.map(m).join(' / ')}; golden emv ${m(c.goldenEmv)}.`);
    });
    w();
  },

  9: (w) => {
    w('# SECTION 9: Accuracy and value (owned by Professional m04)');
    w();
    const ac = L.accuracySweep();
    w('A symmetric survey of accuracy a on the EKPAN lottery: P(reads success | Success) = a and P(reads dry | Dry hole) = a.');
    w('| accuracy | pSignal reads success | posterior Success after reads success | posterior Success after reads dry | best action after reads success | best action after reads dry | evii | evpi |');
    w('| --- | --- | --- | --- | --- | --- | --- | --- |');
    ac.rows.forEach((x) => {
      const shown = Math.abs(x.evii) < L.RESIDUE ? 0 : x.evii;
      w(`| ${r(x.accuracy)} | ${r(x.pReadsSuccess)} | ${r(x.successAfterReadsSuccess)} | ${r(x.successAfterReadsDry)} | ${x.bestAfterReadsSuccess} | ${x.bestAfterReadsDry} | ${m(shown)} | ${m(x.evpi)} |`);
    });
    w(`# Commentary: at accuracy 0.55 the engine returns an evii of ${ac.residueAt055.toExponential(2)}, floating-point residue of a difference of two equal sums; the table prints residue below 1e-9 as 0.0000.`);
    w(`The survey is worth exactly 0 until a "reads dry" result can move the success probability below the drill against farm-out switch ${r(ac.switchPrior)}; below that accuracy both readings still lead to Drill.`);
    w(`The accuracy at which a "reads dry" result first changes the action, by bisection on the engine's own choice: ${r(ac.bisectedAccuracy)}.`);
    w();
    ac.published.forEach((c) => w(`- published ${c.id} (the drillFarmOut prospect at prior 0.3): engine evii ${m(c.evii)}; golden ${m(c.goldenEvii)}.`));
    w();
  },

  10: (w) => {
    w('# SECTION 10: The VOI Analyzer (owned by Professional m05)');
    w();
    const an = L.analyzer();
    const d0 = an.defaults.inputs;
    w(`The Analyzer's default study (published suiteDefaults): decision "${d0.decisionName}" cost ${m(d0.decisionCost)}; outcomes ${d0.outcomes.map((o) => `${o.name} ${o.probability} percent paying ${m(o.payoff)}`).join(', ')}; ${d0.infoScenario.name} cost ${m(d0.infoScenario.cost)}; indicators ${d0.infoScenario.indicators.map((i) => `${i.name} ${i.probability} percent with P(outcome | indicator) ${i.conditionalProbabilities.map((c) => c.probability).join(' / ')} percent`).join('; ')}.`);
    w(`- the five numbers the engine returns: ${kpiLine(an.defaults)}.`);
    const titles = an.cards.map((c) => c.title);
    w(`# App surface: the Analyzer's results panel shows FOUR cards, titled ${titles.slice(0, -1).join(', ')} and ${titles[titles.length - 1]}. The gross voi, the fifth number the engine returns, appears only in the Decision Guidance sentence and the CSV export. Each card is the engine's two-decimal string. The card titled ${titles[1]} is AFTER the survey cost (${an.costTable[0].emvWithInfo} at cost ${an.costTable[0].cost}, ${an.defaults.kpis.emvWithInfo} at cost ${d0.infoScenario.cost} on the defaults), while the tree engine's evWithInfo is BEFORE it.`);
    w('# Commentary: "gross voi" below means the engine\'s voi string, which the Analyzer shows only in its guidance sentence and CSV export, never on a card.');
    w(`- insight, verbatim: ${an.defaults.insights}`);
    w('- The Analyzer offers exactly two actions: the named decision at its cost, and "Do Not" with every payoff 0.');
    w();
    const tp = an.ekpanTyped;
    const ef = an.ekpanForm;
    w(`EKPAN lottery typed into the Analyzer form: decision "${ef.decisionName}" cost ${m(ef.decisionCost)}; outcomes ${ef.outcomes.map((o) => `${o.name} ${o.probability} percent paying ${m(o.payoff)}`).join(' and ')} (payoffs gross of the decision cost); ${ef.infoScenario.name} cost ${m(ef.infoScenario.cost)}; indicators ${ef.infoScenario.indicators.map((i) => i.name).join(' and ')}. Every EKPAN Analyzer row in Sections 10 and 11 uses these.`);
    w(`EKPAN typed into the Analyzer with the Bayes posteriors at full precision (Bright spot ${f(tp.percents.pPos, 6)} percent, P(Success | Bright spot) ${f(tp.percents.postPos, 6)} percent, P(Success | No bright spot) ${f(tp.percents.postNeg, 6)} percent): ${kpiLine(tp)}.`);
    const sig = L.bayes().signals[0].likelihoods;
    w(`Inverting the typed entries back to likelihoods, P(indicator | outcome) = P(outcome | indicator) x P(indicator) / P(outcome): Bright spot given Success ${r(an.invertedDerived.brightGivenSuccess)}, Bright spot given Dry hole ${r(an.invertedDerived.brightGivenDry)} (derived; they reproduce the survey's ${r(sig[0])} and ${r(sig[1])}).`);
    w(`A missing third action. The same survey on the lottery with Farm out removed (Drill or Walk away): emvPrior ${m(an.twoAction.emvPrior)}, evWithInfo ${m(an.twoAction.evWithInfo)}, evii ${m(an.twoAction.evii)}, evpi ${m(an.twoAction.evpi)}. With Farm out: evii ${m(an.threeAction.evii)}, evpi ${m(an.threeAction.evpi)}. The Analyzer's gross voi ${tp.kpis.voi} (guidance sentence and CSV, not a card) is the two-action number.`);
    w();
    w('The verdict sentence, by net VOI sign (verbatim tails of the insight):');
    an.verdicts.forEach((v) => w(`- published ${v.id} (cost ${m(v.cost)}): netVoi card ${v.netVoi}; "${v.verdict}"`));
    w();
    w('| survey cost | emvWithInfo card | netVoi card | tree root choice |');
    w('| --- | --- | --- | --- |');
    an.costTable.forEach((x) => w(`| ${m(x.cost)} | ${x.emvWithInfo} | ${x.netVoi} | ${x.rootChoice ?? 'no tree'} |`));
    w();
  },

  11: (w) => {
    w('# SECTION 11: Inputs that contradict each other (owned by Expert m01)');
    w();
    const ct = L.contradictions();
    w(`impliedPriors: implied P(outcome) = sum over indicators of P(indicator) x P(outcome | indicator); consistent when every delta against the stated prior is within ${L.HALF_PERCENT}.`);
    ct.impliedPriors.forEach((e) => w(`- published ${e.id}: stated ${e.stated.map(r).join(' / ')}, implied ${e.implied.map(r).join(' / ')}, deltas ${e.deltas.map((d) => d.toExponential(6)).join(' / ')}, consistent ${e.consistent}; golden consistent ${e.goldenConsistent}.`));
    const bd = ct.boundary;
    w(`The boundary case: 0.305 - 0.3 evaluates in binary floating point to ${bd.deltaDerived.toPrecision(17)}, which is above ${L.HALF_PERCENT} by ${bd.excessDerived.toExponential(1)} (derived). The engine compares against ${L.HALF_PERCENT} plus a 1e-12 representation allowance and reports consistent ${bd.consistent}; compared against ${L.HALF_PERCENT} alone the same deltas would read consistent ${bd.consistentWithoutAllowanceDerived} (derived). Before the EC4-0 repair the engine had no allowance and called this case inconsistent (finding D1, now resolved).`);
    w();
    w('Rounded posteriors. EKPAN typed with its posteriors rounded instead of at full precision:');
    w('| Bright spot percent | P(Success given Bright spot) percent | P(Success given No bright spot) percent | implied Success | delta | consistent | gross voi | netVoi card |');
    w('| --- | --- | --- | --- | --- | --- | --- | --- |');
    ct.rounded.forEach((x) => w(`| ${f(x.brightSpotPercent, 6)} | ${f(x.successGivenBrightPercent, 6)} | ${f(x.successGivenNoBrightPercent, 6)} | ${r(x.impliedSuccess)} | ${x.delta.toExponential(6)} | ${x.consistent} | ${card(x.voi)} | ${card(x.netVoi)} |`));
    w();
    const ir = ct.irri;
    w(`IRRI: the Analyzer defaults with BOTH indicators typed as 20 / 80 percent. ${kpiLine(ir)}; implied ${ir.implied.map(r).join(' / ')} against stated ${ir.stated.map(r).join(' / ')}; deltas ${ir.deltas.map(r).join(' / ')}.`);
    w(`- Before the EC4-0 repair the same inputs printed a gross voi of ${ir.beforeRepair.voi.toFixed(2)} and a netVoi card of ${ir.beforeRepair.net.toFixed(2)} (reconstructed from engine calls, derived). Information derived by Bayes can never be worth less than 0 (evii >= 0); a negative value is only reachable from typed inputs that contradict the stated prior, which is why the repaired Analyzer withholds it.`);
    w(`- IRRI insight, verbatim: ${ir.insights}`);
    ct.publishedWithheld.forEach((x) => w(`- published ${x.id}: ${kpiLine(x)}; implied ${x.implied.map(r).join(' / ')}. Before the repair: gross voi ${x.beforeRepair.voi.toFixed(2)}, netVoi card ${x.beforeRepair.net.toFixed(2)}, against evpi card ${x.beforeRepair.evpi.toFixed(2)} (reconstructed, derived).`));
    w(`- EKPAN with Bright spot typed at 56 percent and No bright spot at 44 percent (the chances still sum to 100), the posteriors unchanged: ${voiLine(ct.ekpan56)}; implied Success ${r(ct.ekpan56.implied[0])} against stated ${r(ct.ekpan56.stated[0])}; before the repair gross voi ${ct.ekpan56.beforeRepair.voi.toFixed(2)} (reconstructed, derived).`);
    w();
    w('What the repaired Analyzer refuses outright, before computing anything (published voiRefusals, each engine message verbatim). Each typed chance must lie between 0 and 100 percent, and each sum (the outcome chances, the indicator chances, and the outcome chances under each indicator) must lie within 1e-4 percentage points of 100:');
    ct.voiRefusals.forEach((c) => w(`- ${c.id}: ${voiLine(c)}${c.beforeRepair ? ` Before the repair: gross voi ${c.beforeRepair.voi.toFixed(2)} against evpi card ${c.beforeRepair.evpi.toFixed(2)} (reconstructed, derived).` : ''}`));
    w(`- EKPAN with No bright spot typed at 64 percent, so the indicator chances sum to ${f(ct.indicatorSum110.sumDerived, 6)} percent: ${voiLine(ct.indicatorSum110)}`);
    w('A refusal and a withholding are different answers: a refusal says the typed numbers are not chances at all; a withholding says they are chances that cannot all be true together, and still reports the two cards that depend only on the stated outcome chances.');
    w();
  },

  12: (w) => {
    w('# SECTION 12: Bigger lotteries (owned by Expert m02)');
    w();
    const bl = L.biggerLotteries();
    const e34 = bl.threeOutcomesFourActions;
    w(`Published threeOutcomesFourActions: outcomes ${e34.outcomes.map((o) => `${o.label} ${r(o.probability)}`).join(', ')}; actions ${e34.actions.map((a) => `${a.label} cost ${m(a.cost || 0)} paying ${a.payoffs.map(m).join(' / ')}`).join('; ')}.`);
    w('| action | value at the prior |');
    w('| --- | --- |');
    e34.actionValues.forEach((a) => w(`| ${a.label} | ${m(a.emv)} |`));
    w(`emvPrior ${m(e34.emvPrior)}, evWithPerfect ${m(e34.evWithPerfect)}, evpi ${m(e34.evpi)}; golden perfectBestActionIndex ${JSON.stringify(e34.goldenPerfectBestActionIndex)}.`);
    const t3 = bl.threeByThree;
    w(`Published threeByThree: signals ${t3.signals.map((s) => `${s.label} ${s.likelihoods.map(r).join(' / ')}`).join('; ')}; cost ${m(t3.infoCost)}.`);
    w('| signal | pSignal | posterior Large | posterior Medium | posterior Dry | best action | emv |');
    w('| --- | --- | --- | --- | --- | --- | --- |');
    t3.rows.forEach((s) => w(`| ${s.label} | ${r(s.pSignal)} | ${s.posterior.map(r).join(' | ')} | ${s.bestLabel} | ${m(s.emv)} |`));
    w(`evWithInfo ${m(t3.evWithInfo)}, evii ${m(t3.evii)}, netEvii ${m(t3.netEvii)}, against evpi ${m(e34.evpi)}.`);
    w(`Published threeByThreeCost12 information tree: root choice "${bl.threeByThreeCost12.rootChoice}", root branch values ${bl.threeByThreeCost12.branchValues.map(m).join(' / ')}.`);
    w();
    w(`A reading that never happens (published impossibleSignal): ${bl.impossibleSignal.rows.map((s) => `"${s.label}" likelihoods ${s.likelihoods.map(r).join(' / ')}, pSignal ${r(s.pSignal)}, posterior ${s.posterior.map(r).join(' / ')}, best ${s.bestActionIndex} ("${bl.impossibleSignal.actions[s.bestActionIndex].label}"), emv ${m(s.emv)}`).join('; ')}; evii ${m(bl.impossibleSignal.evii)}. Actions: ${bl.impossibleSignal.actions.map((a, i) => `${i} "${a.label}" cost ${m(a.cost || 0)} paying ${a.payoffs.map(m).join(' / ')}`).join('; ')}; priors ${bl.impossibleSignal.priors.map((o) => `${o.label} ${r(o.probability)}`).join(', ')}.`);
    w('A signal with pSignal 0 keeps the PRIORS as its posterior and reports the prior best action and emv; weighted by 0, it adds nothing to evWithInfo.');
    w();
    w(`The published threeOutcomesFourActions lottery with the Large probability swept and Medium held at its stated ${bl.largeSweep.medium} (Dry takes the rest):`);
    w('| Large | Dry | Drill alone | Drill with partner | Farm out | Relinquish | best action |');
    w('| --- | --- | --- | --- | --- | --- | --- |');
    bl.largeSweep.rows.forEach((x) => w(`| ${r(x.pLarge)} | ${r(x.pDry)} | ${x.values.map(m).join(' | ')} | ${x.bestLabel} |`));
    w('Drill with partner pays exactly half of Drill alone in every outcome at exactly half the cost, so its value is exactly half of Drill alone at every probability (the two columns above). Half of a positive number is smaller, and half of a negative number is still negative while Farm out never goes below 0, so Drill with partner is never the best action on this lottery, and Relinquish never beats Farm out. The sweep has ONE switch, between Farm out and Drill alone.');
    w();
  },

  13: (w) => {
    w('# SECTION 13: The decision brief (owned by Expert m03)');
    w();
    w('Decision Studio assembles up to three sections, each with a provenance line: probabilistic economics from a saved EPE Monte Carlo run, decision analysis from a saved tree re-rolled by this engine at brief time, and capital allocation from a saved portfolio. Its decision rows are: Optimal EMV (root emv), Recommended first move (the root best branch label), Next best alternative (the largest OTHER root branch value) and Decision advantage (optimal emv less next best). The last two are arithmetic on engine returns, printed here as derived.');
    const bf = L.brief();
    bf.rows.forEach((b) => w(`- ${b.name}: Optimal EMV ${m(b.optimal)} (engine); Recommended first move "${b.move}"; Next best alternative ${b.nextDerived == null ? 'row absent' : m(b.nextDerived)} (derived); Decision advantage ${b.advantageDerived == null ? 'row absent' : m(b.advantageDerived)} (derived).`));
    w('An exact tie prints a Decision advantage of 0 beside a recommended first move that is simply the branch listed first.');
    w('# App surface: the brief writes "Single path" as the first move for a tree whose root is a chance node, where the Decision Tree Builder writes "Chance root" for the same tree.');
    w();
    const mc = bf.monteCarlo;
    const low = mc.readings.find((x) => x.key === 'p90');
    const high = mc.readings.find((x) => x.key === 'p10');
    w(`A Monte Carlo payoff enters at its mean. EKPAN's tree with the success payoff linked to the summary ${JSON.stringify(mc.summary)}: Optimal EMV ${m(mc.optimal)}, the same as the plain mean. Reading the summary's ${low.pLabel} (the low case, ${m(low.payoff)}) would give ${m(low.emv)}; its ${high.pLabel} (the high case, ${m(high.payoff)}) ${m(high.emv)}. The rollback is linear, so the mean is the only statistic it needs; the spread is carried in the object and does not move the EMV.`);
    const [e0, e1, e2] = bf.economicsRowLabels;
    w(`The economics section of the brief labels its rows "${e0}", "${e1}" and "${e2}" and its provenance says "Petroleum convention: ${low.pLabel} is the low case."`);
    w();
  },

  14: (w) => {
    w('# SECTION 14: Refusals and silent defaults (owned by Expert m04)');
    w();
    const sd = L.silentDefaults();
    w(`Branch A pays ${sd.branchA.payoff} at the cost shown; branch B pays ${sd.branchB.payoff} at no cost.`);
    sd.rows.forEach((x) => w(`- ${x.what}: ${x.ok ? `accepted, emv ${m(x.emv)}, best "${x.bestLabel}"${x.branchAValue !== null ? `, branch A value ${m(x.branchAValue)}` : ''}` : `refused: "${x.error}"`}`));
    w();
    w('# App surface: in the Decision Tree Builder, clearing a payoff, probability or cost box stores 0, the same value the engine gives a blank or non-numeric cost. A cleared probability therefore surfaces as a sum that is not 1; a cleared cost or payoff is silent.');
    const coarse = sd.thirds.find((x) => x.typed === '0.333');
    const fine = sd.thirds.find((x) => x.typed === '0.3333333');
    w(`Thirds (from Section 2): each ${coarse.typed}, sum ${r(coarse.sumDerived)}, ${coarse.ok ? 'accepted' : 'refused'}; each ${fine.typed}, ${fine.ok ? 'accepted' : 'refused'}.`);
    w(`A branch probability typed as text "0.5" on a two-branch chance node paying 10 and 30: ${said(sd.probabilityAsText)}.`);
    w(`A probability left empty "" on one branch and 1 on the other: ${said(sd.probabilityEmpty)}.`);
    w();
    sd.eviiRefusals.forEach((c) => w(`- published eviiRefusals ${c.id}: ${c.ok ? `accepted (evii ${m(c.evii)})` : `refused: "${c.error}"`}`));
    w('The VOI Analyzer refuses its percent inputs the same way: see Section 11, voiRefusals. A boundary kept despite binary arithmetic: see Section 11, justInsideTolerance (finding D1, resolved).');
    w();
  },

  15: (w) => {
    w('# SECTION 15: Numbers to distrust (owned by Expert m05)');
    w();
    const ds = L.distrust();
    const rn = ds.riskNeutral;
    w(`A risk neutral choice. EKPAN Drill emv ${m(rn.drillEmv)} beats Farm out ${m(rn.farmEmv)}; Drill loses ${m(rn.drillLossDerived)} with probability ${r(rn.drillLossChance)} (Section 5), Farm out never loses. The engine has no way to prefer the farm-out: it maximises the mean.`);
    w();
    const ti = ds.tie;
    const tin = ti.inputs;
    w(`An exact tie reported as a recommendation. Analyzer inputs: Success ${tin.success} percent paying ${tin.payS}, Dry hole ${tin.dry} percent paying ${tin.payD}, decision cost ${tin.decisionCost}, so acting is worth ${tin.success / 100} x ${tin.payS} + ${tin.dry / 100} x (${tin.payD}) - ${tin.decisionCost} = ${ti.actingValueDerived} (derived), exactly the "Do Not" value. Survey cost ${m(ti.surveyCost)}. Cards: ${kpiLine(ti)}.`);
    w(`- insight opening, verbatim: ${ti.insightOpening}`);
    w();
    w('A KPI rounded before it is shown. The five cards are toFixed(2) strings; the verdict reads the unrounded net VOI. The Analyzer defaults at survey costs either side of the gross VOI 33:');
    w('| survey cost | netVoi card | verdict sentence |');
    w('| --- | --- | --- |');
    ds.rounding.forEach((x) => w(`| ${f(x.cost, 3)} | ${x.netVoi} | ${x.verdict} |`));
    w();
    const cc = ds.cannotChange;
    const shown = Math.abs(cc.evii) < L.RESIDUE ? 0 : cc.evii;
    w(`Information that cannot change anything. The EKPAN symmetric survey at accuracy ${r(cc.accuracy)}: evii ${m(shown)} (Section 9), although its readings move the posterior. The published dominantAction lottery: evpi ${m(cc.dominantActionEvpi)} (Section 6).`);
    w(`The published certainOutcome lottery: evpi ${m(cc.certainOutcomeEvpi)}.`);
    w();
    w('What a tree cannot tell you, as properties of these two modules: no discounting (payoffs arrive discounted), no risk attitude, no correlation between chance nodes beyond what the tree is drawn with, no sequential information in the VOI Analyzer (one survey, one decision), two actions only in the Analyzer, and a Bayes consistency check that refuses numbers that are not chances, withholds a value built on chances that contradict each other, and never repairs either.');
    w();
  },

  16: (w) => {
    w('# SECTION 16: The teaching fields end to end, for the reading modules (owned by Associate m06, Professional m06 and Expert m06)');
    w();
    const ee = L.endToEnd();
    w(`- EKPAN tree: emv ${m(ee.ekpan.emv)}, best "${ee.ekpan.bestLabel}", branch values ${ee.ekpan.branchValues.map(m).join(' / ')}.`);
    w(`- OKRIKA: emv ${m(ee.okrika.emv)}, best "${ee.okrika.bestLabel}", branch values ${ee.okrika.branchValues.map(m).join(' / ')}.`);
    w(`- EKPAN lottery at 0.35: emvPrior ${m(ee.lottery.emvPrior)}, evpi ${m(ee.lottery.evpi)}, evii ${m(ee.lottery.evii)}, netEvii ${m(ee.lottery.netEvii)}, drill against farm-out switch ${r(ee.lottery.switchDerived)}.`);
    w(`- EKPAN in the Analyzer: gross voi ${ee.analyzer.voi}, netVoi card ${ee.analyzer.netVoi}, evpi card ${ee.analyzer.evpi}.`);
    w(`- IRRI: gross voi ${card(ee.irri.voi)}, consistent ${ee.irri.consistent}, withheld ${ee.irri.withheld}.`);
    w();
  },
};

/** The digest's own order: the header, then Sections 1 to 16. */
const SECTION_ORDER = ['head', ...Array.from({ length: 16 }, (_, i) => String(i + 1))];

const regenerate = (key) => {
  const out = [];
  SECTIONS[key]((s = '') => out.push(s));
  return out;
};

/** The digest on disk, split at its section headers. */
const digestSections = () => {
  const lines = fs.readFileSync(DIGEST, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  const out = { head: [] };
  let key = 'head';
  lines.forEach((line) => {
    const hit = line.match(/^# SECTION (\d+):/);
    if (hit) { key = hit[1]; out[key] = []; }
    out[key].push(line);
  });
  return out;
};

// ---------------------------------------------------------------------------
// 0. The digest is a real digest, and the lab copied the fields verbatim.
// ---------------------------------------------------------------------------

/** A top-level statement from a source file, `const NAME = ...` to its end. */
const statement = (src, name, exported) => {
  const lines = src.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`${exported ? 'export ' : ''}const ${name} = `));
  if (start === -1) return null;
  const first = lines[start].replace(/^export /, '');
  if (first.endsWith(';')) return first;
  const end = lines.findIndex((l, i) => i > start && /^[\]})].*;$/.test(l));
  return [first, ...lines.slice(start + 1, end + 1)].join('\n');
};

describe('the digest on disk and the teaching fields', () => {
  it('the digest carries a plausible number of literals and all sixteen sections, so it is not empty or mid-rebuild', () => {
    const text = fs.readFileSync(DIGEST, 'utf8');
    expect((text.match(/-?\d+(?:\.\d+)?/g) || []).length, 'digest.txt is empty or mid-rebuild').toBeGreaterThan(1000);
    expect(Object.keys(digestSections()).sort()).toEqual(['head', ...Array.from({ length: 16 }, (_, i) => String(i + 1))].sort());
  });

  it('the teaching fields are copied verbatim from ec4_dump.mjs', () => {
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = fs.readFileSync(path.join(HERE, 'decisionLab.js'), 'utf8');
    ['EKPAN_TREE', 'EKPAN_PRIOR', 'EKPAN_ACTIONS', 'EKPAN_SIGNALS', 'EKPAN_SURVEY_COST', 'symmetric', 'OKRIKA_DEVELOP',
      'OKRIKA_TREE', 'voiForm', 'IRRI_FORM', 'SUMMARY', 'legacyCards'].forEach((name) => {
      const theirs = statement(dump, name, false);
      const ours = statement(lab, name, true);
      expect(theirs, `${name} in ec4_dump.mjs`).not.toBeNull();
      expect(ours, `${name} in the lab`).not.toBeNull();
      expect(ours, name).toBe(theirs);
    });
    ['T', 'outcomesAt', 'distTree', 'poorEkpan'].forEach((name) => {
      expect(statement(lab, name, false), name).toBe(statement(dump, name, false));
    });
  });

  it('the published goldens are the ones the brief names: 107 decision cases in nine blocks', () => {
    expect(L.goldenCounts()).toEqual({
      rollback: 12, rollbackRefusals: 7, evpi: 11, evii: 18, eviiRefusals: 5, impliedPriors: 6, informationTree: 10, voi: 24, voiRefusals: 7,
    });
  });
});

// ---------------------------------------------------------------------------
// 1-16. Every section of the digest, regenerated from the lab alone.
// ---------------------------------------------------------------------------

describe('the digest, regenerated from the lab alone, section by section', () => {
  const onDisk = digestSections();
  SECTION_ORDER.forEach((key) => {
    it(key === 'head' ? 'the header' : `Section ${key}, every line character for character`, () => {
      const got = regenerate(key);
      const want = onDisk[key];
      const diff = want.map((line, i) => (got[i] === line ? null : `line ${i}:\n  digest ${line}\n  lab    ${got[i]}`)).filter(Boolean);
      expect(diff, `Section ${key}`).toEqual([]);
      expect(got.length, `Section ${key} line count`).toBe(want.length);
    });
  });

  it('the whole regenerated digest is the file on disk, byte for byte', () => {
    expect(Object.keys(SECTIONS).sort()).toEqual([...SECTION_ORDER].sort());
    const all = SECTION_ORDER.flatMap((k) => regenerate(k));
    expect(`${all.join('\n')}\n`).toBe(fs.readFileSync(DIGEST, 'utf8'));
  });
});

// ---------------------------------------------------------------------------
// What the regeneration cannot see: the claims the prose makes.
// ---------------------------------------------------------------------------

describe('the claims the digest prose makes hold on the lab values', () => {
  it('ties go to the branch listed first, and the exact published tie is a tie', () => {
    const dn = L.decisionNodes();
    expect(dn.tie.firstListed.emv).toBe(dn.tie.swapped.emv);
    const pw = L.publishedSweep();
    expect(pw.tie.p).toBe(0.2);
    expect(pw.tie.bestBranchIndex).toBe(0);
    const tieRow = L.costSweep().rows.find((x) => x.isTie);
    expect(tieRow.rootChoice).toBe(L.INFO_LABEL);
    expect(L.costSweep().rows.every((x) => [L.INFO_LABEL, 'No further information'].includes(x.rootChoice))).toBe(true);
  });

  it('EVPI peaks at the switch, and 0 <= evii <= evpi', () => {
    const es = L.evpiSweep();
    expect(es.peakAt).toBe(es.switchAt);
    const by = L.bayes();
    expect(by.evii).toBeGreaterThanOrEqual(0);
    expect(by.evii).toBeLessThanOrEqual(by.evpi);
  });

  it('withheld results carry null value cards and no tree; refusals carry the engine message', () => {
    const ct = L.contradictions();
    [ct.irri, ...ct.publishedWithheld.filter((x) => x.id !== 'consistentAtHalfPercent'), ct.ekpan56].forEach((x) => {
      expect(x.withheld, x.id).toBe(true);
      expect([x.kpis.emvWithInfo, x.kpis.voi, x.kpis.netVoi]).toEqual([null, null, null]);
      expect(x.tree).toBeNull();
      expect(x.kpis.emvWithoutInfo).toMatch(/^-?\d+\.\d{2}$/);
      expect(x.kpis.evpi).toMatch(/^-?\d+\.\d{2}$/);
    });
    expect(ct.voiRefusals.every((x) => x.ok === false && typeof x.error === 'string')).toBe(true);
    expect(ct.rounded.filter((x) => x.withheld).map((x) => [x.voi, x.netVoi])).toEqual([[null, null], [null, null], [null, null]]);
  });

  it('only the mean of a distribution payoff enters, and the readings are in exceedance order', () => {
    const dp = L.distributionPayoff();
    expect(dp.treeEmv).toBe(L.ekpanTree().root.emv);
    expect(dp.readings.map((x) => x.key)).toEqual(['p90', 'p50', 'p10']);
    expect(dp.readings[0].payoff).toBeLessThan(dp.readings[1].payoff);
    expect(dp.readings[1].payoff).toBeLessThan(dp.readings[2].payoff);
  });

  it('Drill with partner is never best on the larger lottery', () => {
    expect(L.biggerLotteries().largeSweep.rows.every((x) => x.bestLabel !== 'Drill with partner')).toBe(true);
  });
});

describe('every reader is pure and deterministic', () => {
  it('two calls agree, and mutating a result changes neither the next call nor the fields', () => {
    const a = L.ekpanTree();
    a.rows[0].branchValue = 999;
    a.root.emv = 999;
    expect(L.ekpanTree()).toEqual(L.ekpanTree());
    expect(L.ekpanTree().root.emv).not.toBe(999);
    const an = L.analyzer();
    an.defaults.inputs.decisionCost = 1;
    expect(L.analyzer()).toEqual(L.analyzer());
    const ps = L.priorSweep();
    ps.actions[0].cost = 1;
    expect(L.EKPAN_ACTIONS[0].cost).toBe(55);
    expect(L.contradictions()).toEqual(L.contradictions());
    expect(L.SUMMARY).toEqual({ mean: 420, p90: 185, p50: 390, p10: 710 });
  });
});

// ---------------------------------------------------------------------------
// THE CAPSTONE: the eighteen graded fields reproduce fields.json exactly.
// ---------------------------------------------------------------------------

const CAPSTONE_FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

describe('the ABALAMA capstone: the eighteen graded fields reproduce fields.json exactly', () => {
  it('fields.json is the eighteen published fields, six per tier, in the published order', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(CAPSTONE_FIELDS.map((x) => x[0])).toEqual([
      ...Array(6).fill('beginner'), ...Array(6).fill('intermediate'), ...Array(6).fill('advanced'),
    ]);
    expect(CAPSTONE_FIELDS.every((x) => x[3] === 0.001)).toBe(true);
  });

  it('every one of the eighteen graded answers and tolerances is EXACTLY the published value', () => {
    const got = L.abalamaCapstoneFields();
    expect(got.map((x) => x[1])).toEqual(CAPSTONE_FIELDS.map((x) => x[1]));
    const vals = L.abalamaCapstoneValues(got);
    const tols = L.abalamaCapstoneTolerances(got);
    const wrong = [];
    CAPSTONE_FIELDS.forEach(([tier, key, v, tol], i) => {
      if (got[i][0] !== tier) wrong.push(`${key}: tier ${got[i][0]} against ${tier}`);
      if (vals[key] !== v) wrong.push(`${tier} ${key}: lab ${vals[key]} against published ${v}`);
      if (tols[key] !== tol) wrong.push(`${tier} ${key}: tolerance ${tols[key]} against published ${tol}`);
    });
    expect(wrong).toEqual([]);
    expect(L.abalamaCapstoneValues()).toEqual(vals);
  });

  it('the capstone conditions are copied verbatim from ec4_fields.mjs, names prefixed', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const lab = fs.readFileSync(path.join(HERE, 'decisionLab.js'), 'utf8');
    const renamed = (text) => text
      .replace(/\bTREE\b/g, 'ABALAMA_TREE_INPUTS')
      .replace(/\bdevelop\(/g, 'abalamaDevelop(')
      .replace(/^const develop = /, 'const abalamaDevelop = ');
    [
      ['TREE', 'ABALAMA_TREE_INPUTS', true], ['LOTTERY', 'ABALAMA_LOTTERY', true], ['THREE_READINGS', 'ABALAMA_THREE_READINGS', true],
      ['MC_SUMMARY', 'ABALAMA_MC_SUMMARY', true], ['TYPED', 'ABALAMA_TYPED', true], ['abalamaTree', 'abalamaTree', true],
      ['develop', 'abalamaDevelop', false],
    ].forEach(([theirs, ours, exported]) => {
      const a = statement(src, theirs, exported);
      const b = statement(lab, ours, exported);
      expect(a, theirs).not.toBeNull();
      expect(b, ours).not.toBeNull();
      expect(b.replace(new RegExp(`^const ${ours} = `), 'const X = '), ours)
        .toBe(renamed(a).replace(new RegExp(`^const ${exported ? renamed(theirs) : 'abalamaDevelop'} = `), 'const X = '));
    });
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/**
 * Exports that TAKE AN ARGUMENT. Each is walked below at every argument a
 * panel or the lab hands it. The list is asserted, so a new reader cannot hide
 * in it.
 */
const ARG_REQUIRED = ['symmetric', 'OKRIKA_DEVELOP', 'voiForm', 'legacyCards', 'leakGuardTargets', 'leakGuardHit', 'collectNumbers'];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS'];

/** A surface smaller than this is not the lab: refuse to call it clean. */
const MIN_SURFACE_ENTRIES = 60;
const MIN_SURFACE_NUMBERS = 1500;

const teachingSurface = () => {
  const out = [];
  const push = (name, v) => out.push({ name, value: v });
  Object.entries(L).forEach(([name, v]) => {
    if (L.CAPSTONE_ONLY_EXPORTS.includes(name) || ARG_REQUIRED.includes(name) || GATE_MACHINERY.includes(name)) return;
    push(`${name}()`, typeof v === 'function' ? v() : v);
  });
  L.ACCURACIES.forEach((a) => push(`symmetric(${a})`, L.symmetric(a)));
  [0.75, 0.2, 0.42].forEach((p) => push(`OKRIKA_DEVELOP(${p})`, L.OKRIKA_DEVELOP(p)));
  L.contradictions().rounded.forEach((x) => {
    const form = L.voiForm({ pPos: x.brightSpotPercent, postPos: x.successGivenBrightPercent, postNeg: x.successGivenNoBrightPercent });
    push(`voiForm(${x.brightSpotPercent})`, form);
    push(`legacyCards(voiForm(${x.brightSpotPercent}))`, L.legacyCards(form));
  });
  push('legacyCards(IRRI_FORM())', L.legacyCards(L.IRRI_FORM()));
  push('legacyCards(TIE_FORM())', L.legacyCards(L.TIE_FORM()));
  return out;
};

const surfaceNumbers = (surface) => surface.flatMap((s) => L.collectNumbers(s.value, s.name));

/** Refuse to report a clean gate over a surface that cannot be the lab (README section 13). */
const assertPlausible = (surface, numbers) => {
  if (surface.length < MIN_SURFACE_ENTRIES || numbers.length < MIN_SURFACE_NUMBERS) {
    throw new Error(`the teaching surface has only ${surface.length} entries and ${numbers.length} numbers: refusing to call it clean`);
  }
};

describe('THE LEAK GATE: the guard itself', () => {
  const targets = L.leakGuardTargets(CAPSTONE_FIELDS);

  it('the guard is built from all eighteen fields in all three unit shiftings, with the band scaled', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    expect(L.LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001]);
    const t = (key, tag) => targets.find((x) => x.key === key && x.tag === tag);
    const [, , v] = CAPSTONE_FIELDS.find((x) => x[1] === 'ab_root_emv_musd');
    expect(t('ab_root_emv_musd', 'as graded').band).toBeCloseTo(0.01, 12);
    expect(t('ab_root_emv_musd', 'x1000').band).toBeCloseTo(10, 9);
    expect(t('ab_root_emv_musd', 'x0.001').band).toBeCloseTo(0.00001, 15);
    expect(t('ab_root_emv_musd', 'x1000').value).toBeCloseTo(v * 1000, 6);
  });

  it('every reader answers a bare call, and the surface is large enough to mean something', () => {
    const surface = teachingSurface();
    surface.forEach((s) => expect(s.value, `${s.name} returned nothing`).not.toBeUndefined());
    const numbers = surfaceNumbers(surface);
    // eslint-disable-next-line no-console
    console.log(`teaching surface: ${surface.length} entries, ${numbers.length} numbers`);
    expect(() => assertPlausible(surface, numbers)).not.toThrow();
  });

  it('THE GUARD REFUSES AN EMPTY OR TINY SURFACE rather than calling it clean', () => {
    const surface = teachingSurface();
    expect(() => assertPlausible([], [])).toThrow(/refusing/);
    expect(() => assertPlausible(surface.slice(0, 5), surfaceNumbers(surface.slice(0, 5)))).toThrow(/refusing/);
  });

  it('every export is accounted for: walked bare, walked with arguments, capstone or machinery', () => {
    const exported = Object.keys(L);
    ARG_REQUIRED.forEach((k) => expect(exported, k).toContain(k));
    exported.filter((k) => typeof LAB[k] === 'function' && !ARG_REQUIRED.includes(k) && !L.CAPSTONE_ONLY_EXPORTS.includes(k))
      .forEach((k) => expect(LAB[k].length, `${k} has a required argument and is not in ARG_REQUIRED`).toBe(0));
  });

  it('the teaching surface names no capstone export, and carries no em dash or en dash', () => {
    const text = JSON.stringify(teachingSurface());
    L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
      if (name === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(text, `${name} appears in the teaching surface`).not.toContain(name);
    });
    expect(text.toLowerCase()).not.toContain('abalama');
    expect(text).not.toMatch(/[–—]/);
  });

  it('THE GUARD IS LIVE: every graded answer, planted, is caught in every shifting, however deep', () => {
    CAPSTONE_FIELDS.forEach(([, key, v, tol]) => {
      const drift = 0.9 * L.LEAK_GUARD_MARGIN * tol;
      [v, v + drift, v - drift].forEach((planted) => {
        expect(L.leakGuardHit(planted, targets), `${key} ${planted}`).not.toBeNull();
        expect(L.leakGuardHit(planted * 1000, targets), `${key} x1000`).not.toBeNull();
        expect(L.leakGuardHit(planted / 1000, targets), `${key} x0.001`).not.toBeNull();
      });
      const buried = L.collectNumbers({ a: [{ b: v }] })[0].value;
      expect(targets.filter((t) => Math.abs(buried - t.value) < t.band).map((t) => t.key), key).toContain(key);
    });
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the teaching headlines pass', () => {
    expect(L.leakGuardHit(L.ekpanTree().root.emv, targets)).toBeNull();
    expect(L.leakGuardHit(L.okrika().root.emv, targets)).toBeNull();
    expect(L.leakGuardHit(L.bayes().evii, targets)).toBeNull();
    [NaN, Infinity, -Infinity].forEach((x) => expect(L.leakGuardHit(x, targets)).toBeNull());
    expect(L.collectNumbers({ a: NaN, b: null, c: 'text', d: undefined })).toEqual([]);
  });
});

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  const targets = L.leakGuardTargets(CAPSTONE_FIELDS);

  it('NO number returned by any teaching export is within ten grading bands of a graded answer, in any shifting', () => {
    const surface = teachingSurface();
    const numbers = surfaceNumbers(surface);
    assertPlausible(surface, numbers);
    const hits = numbers
      .map((n) => ({ n, t: L.leakGuardHit(n.value, targets) }))
      .filter((x) => x.t)
      .map(({ n, t }) => `${n.path} = ${n.value} is within ${t.band} of ${t.key} ${t.tag} (${Math.abs(n.value - t.value) / t.gradingBand} grading bands)`);
    expect(hits).toEqual([]);
  });
});
