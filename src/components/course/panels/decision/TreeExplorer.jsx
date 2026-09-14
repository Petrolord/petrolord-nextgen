import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  TIE_INPUTS, engineRules, refusals, ekpanTree, decisionNodes, thirds, costOnChanceBranch, distributionPayoff,
  drillOutcomes, okrika, publishedSequences, priorSweep, switchPoint, publishedSweep,
} from './decisionLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import {
  mm, pr, Tbl, Sub, Line as Text, TreeRows, HandLines, Outcome, outcomeLabel, answerText,
} from './decisionKit';

// Tree explorer, the Associate tier. ONE PROSPECT ROLLED BACK: the EKPAN tree
// with its node EMVs beside its branch values, chance nodes and what they
// refuse, decision nodes and their ties, the OKRIKA appraisal sequence with and
// without a later choice, and the EKPAN lottery swept across its prior.
//
// Every figure on this page is a return value from decisionLab, which is a
// return value from the vendored decision tree engine. Nothing here computes a
// branch value or an EMV. The only outcome labels are on the linked Monte Carlo
// NPV summary, built from the convention module.

const safe = (fn) => { try { return fn(); } catch { return null; } };

export const MODES = [
  ['tree', 'Tree: EKPAN rolled back, node EMV beside branch value'],
  ['chance', 'Chance: thirds, a cost on a chance branch, a distribution payoff'],
  ['sequence', 'Sequence: OKRIKA with and without the option to sell'],
  ['sweep', 'Sweep: the prior, the switch point and an exact tie'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

export const TreeMode = ({ t, rules, refs, dn }) => {
  if (!t) return <Note>The engine returned no tree.</Note>;
  const drill = t.chanceNodes.find((c) => c.path === '0');
  return (
    <>
      <TileGrid>
        <Tile label="Root EMV" value={mm(t.root.emv)} unit="million USD" />
        <Tile label="First move" value={t.root.bestLabel} />
        {drill && <Tile label={`${drill.label} node EMV`} value={mm(drill.emv)} unit="million USD, before the cost" />}
        {drill && <Tile label={`${drill.incomingLabel} branch value`} value={mm(drill.incomingBranchValue)} unit="million USD, after the cost" />}
      </TileGrid>
      <TreeRows tv={t} />
      <Sub>Each chance node rolled back by hand</Sub>
      <HandLines tv={t} />
      {dn && (
        <>
          <Sub>Decision nodes</Sub>
          <Tbl
            head={['branch of the Marginal find', 'node EMV, million USD', 'cost', 'branch value', 'optimal path']}
            strong={(i) => dn.marginal[i].onOptimalPath}
            rows={dn.marginal.map((b) => [b.label, mm(b.childEmv), mm(b.cost), mm(b.branchValue), b.onOptimalPath ? 'yes' : 'no'])}
          />
          <Text>
            The farm-out branch is not taken, so none of its outcomes is on the optimal path
            ({dn.farmOutOnPath.map((v) => (v ? 'on' : 'off')).join(', ')}).
          </Text>
          <Tbl
            head={['published decision case', 'engine EMV, million USD', 'best branch', 'branch values, million USD', 'golden EMV']}
            rows={dn.published.map((a) => [a.id, mm(a.emv), a.bestBranchIndex === null ? 'none' : a.branches[a.bestBranchIndex].label, a.branches.map((b) => `${b.label} ${mm(b.branchValue)}`).join(', '), mm(a.goldenEmv)])}
          />
          <Text>
            A tie decided by listing order. Drill pays {mm(TIE_INPUTS.drillPayoff)} less a cost of {mm(TIE_INPUTS.drillCost)} and
            Farm out pays {mm(TIE_INPUTS.farmPayoff)}. Listed Drill first, the engine picks {dn.tie.firstListed.bestLabel}; listed
            Farm out first, it picks {dn.tie.swapped.bestLabel}. Both read {mm(dn.tie.firstListed.emv)} million USD.
          </Text>
          <Tbl
            head={['EKPAN tree', ...dn.root.branches.map((b) => b.label), 'best', 'best without the walk-away branch', 'EMV without it']}
            rows={[
              ['as stated', ...dn.root.branches.map((b) => mm(b.branchValue)), dn.root.bestLabel, dn.withoutWalkAway.bestLabel, mm(dn.withoutWalkAway.emv)],
              ...dn.poorPriors.map((x) => [`success ${pr(x.pSuccess)}, dry hole ${pr(x.pDry)}`, ...x.branches.map((b) => mm(b.branchValue)), x.bestLabel, x.withoutWalkAway.bestLabel, mm(x.withoutWalkAway.emv)]),
            ]}
          />
          <Note>Walking away is a branch like any other. It only matters where it is the best branch, and on EKPAN the farm-out stays above it.</Note>
        </>
      )}
      {rules && (
        <>
          <Sub>What the engine assumes</Sub>
          <ul className="mt-2 text-xs text-slate-300 list-none pl-0 space-y-1">
            {rules.lines.map((l) => <li key={l}>{l.replace(/^- /, '')}</li>)}
          </ul>
          <Text>
            Payoffs enter the rollback as numbers already discounted: the success payoff {mm(rules.successPayoff)} and the dry
            hole {mm(rules.dryHolePayoff)} million USD are used as typed, and the tree reads {mm(rules.treeEmv)}.
          </Text>
        </>
      )}
      {refs && (
        <Tbl head={['published refusal', 'engine answer']} rows={refs.map((x) => [x.what, answerText(x)])} />
      )}
    </>
  );
};

export const ChanceMode = ({ th, cc, dp, dro }) => {
  if (!th || !cc || !dp || !dro) return <Note>The engine returned no chance nodes.</Note>;
  return (
    <>
      <Sub>Probabilities that must sum to one</Sub>
      <Tbl
        head={['each of three branches typed as', 'sum (derived)', 'engine answer']}
        rows={th.rows.map((x) => [x.typed, pr(x.sumDerived), answerText(x)])}
      />
      <Note>
        The three branches pay {th.payoffs.join(', ')} million USD. Typed three times, {th.binary.typed} sums in binary
        to {th.binary.sumDerived.toPrecision(17)}, and its distance from 1 is {th.binary.gapDerived.toPrecision(17)} (derived),
        just past the engine&apos;s 1e-6 tolerance, so it is refused while its message prints six decimals. The published
        thirds case reads {mm(th.published.engineEmv)} against a golden {mm(th.published.goldenEmv)}.
      </Note>
      <Sub>A cost on a chance branch</Sub>
      <Tbl
        head={['branch', 'probability', 'cost, million USD', 'node EMV', 'branch value']}
        rows={cc.branches.map((b) => [b.label, pr(b.probability), mm(b.cost), mm(b.childEmv), mm(b.branchValue)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Root EMV, the engine" value={mm(cc.rootEmv)} unit="million USD" />
          <Tile label="Every cost taken off after weighting (derived, wrong)" value={mm(cc.costAfterWeightingDerived)} unit="million USD" />
        </TileGrid>
      </div>
      <Note>A cost on a branch is paid only when that branch happens, so the engine takes it off before the chance node weights it.</Note>
      <Sub>A payoff that is a distribution summary</Sub>
      <Text>
        EKPAN&apos;s success payoff linked to a Monte Carlo NPV summary with a mean of {mm(dp.summary.mean)} million USD rolls back
        to {mm(dp.treeEmv)}, the same as the plain payoff of {mm(dp.plainPayoff)}: only the mean enters.
      </Text>
      <Tbl
        head={['NPV summary read at', 'payoff, million USD', 'tree EMV', 'first move', 'Drill branch value']}
        rows={dp.readings.map((a) => [<Outcome key={a.key}>{outcomeLabel(a.key)}</Outcome>, mm(a.payoff), mm(a.emv), a.bestLabel, mm(a.drillBranchValue)])}
      />
      <Note>
        Reading one percentile of the summary in place of its mean is a different tree with a different first move. A
        summary with no mean: {answerText(dp.noMean)}. The published distribution payoff case reads {mm(dp.published.engineEmv)} against
        a golden {mm(dp.published.goldenEmv)}.
      </Note>
      <Sub>An EMV nobody receives</Sub>
      <Tbl
        head={['Drill outcome', 'probability', 'money after the drill cost, million USD (derived)']}
        rows={dro.rows.map((o) => [o.label, pr(o.probability), mm(o.moneyDerived)])}
      />
      <Note>
        The Drill branch is worth {mm(dro.branchValue)} million USD, which is none of its outcomes. The chance of losing money on
        it is {pr(dro.lossChanceDerived)} (derived).
      </Note>
    </>
  );
};

export const SequenceMode = ({ ok, seqs }) => {
  if (!ok) return <Note>The engine returned no sequence.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="Root EMV" value={mm(ok.root.emv)} unit="million USD" />
        <Tile label="First move" value={ok.root.bestLabel} />
        <Tile label="Appraisal chance node EMV" value={mm(ok.appraisal.chanceEmv)} unit="million USD" />
        <Tile label="Appraise branch value" value={mm(ok.appraisal.branchValue)} unit={`million USD, after the ${mm(ok.appraisal.cost)} cost`} />
      </TileGrid>
      <TreeRows tv={ok} />
      <Sub>Right to left</Sub>
      <HandLines tv={ok} />
      <Tbl
        head={['after the appraisal', 'develop, million USD', 'sell, million USD']}
        rows={[['good', mm(ok.afterGood.develop), mm(ok.afterGood.sell)], ['poor', mm(ok.afterPoor.develop), mm(ok.afterPoor.sell)]]}
      />
      <Sub>With and without the option to sell after appraising</Sub>
      <Tbl
        head={['OKRIKA', 'appraise branch value, million USD', 'first move', 'root EMV']}
        rows={[
          ['with the option to sell', mm(ok.appraisal.branchValue), ok.root.bestLabel, mm(ok.root.emv)],
          ['always develop after appraising', mm(ok.noSell.appraiseBranchValue), ok.noSell.bestLabel, mm(ok.noSell.emv)],
        ]}
      />
      <Note>
        The option to sell after a poor result is worth {mm(ok.noSell.optionValueDerived)} million USD inside the appraisal branch
        (derived). Appraising beats selling now at {mm(ok.againstSellNow.sellNow)} by {mm(ok.againstSellNow.differenceDerived)} (derived).
      </Note>
      {(seqs || []).map((s) => (
        <div key={s.id}>
          <Sub>Published {s.id}: engine EMV {mm(s.root.emv)}, golden {mm(s.goldenEmv)} million USD</Sub>
          <TreeRows tv={s} />
        </div>
      ))}
    </>
  );
};

export const SweepMode = ({ ps, sp, pw }) => {
  if (!ps || !sp || !pw) return <Note>The engine returned no sweep.</Note>;
  const chart = ps.rows.map((x) => ({ p: x.p, drill: x.values[0], farm: x.values[1], walk: x.values[2] }));
  const h = ps.hides;
  return (
    <>
      <Note>This is the EKPAN lottery: two outcomes and no later decision, a separate model from the EKPAN tree. Money is million USD.</Note>
      <Tbl
        head={['success probability', ...ps.actions.map((a) => a.label), 'best action', 'EMV']}
        rows={ps.rows.map((x) => [pr(x.p), ...x.values.map(mm), x.bestLabel, mm(x.emv)])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="p" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} />
            <YAxis tick={AXIS} label={{ value: 'million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={sp.drillFarmSwitchDerived} stroke="#BFFF00" strokeDasharray="4 4" />
            <Line dataKey="drill" name={ps.actions[0].label} stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line dataKey="farm" name={ps.actions[1].label} stroke="#f472b6" dot={false} isAnimationActive={false} />
            <Line dataKey="walk" name={ps.actions[2].label} stroke="#94a3b8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Drill meets Farm out at (derived)" value={pr(sp.drillFarmSwitchDerived)} />
          <Tile label="Drill there, the engine" value={mm(sp.drillAtSwitch)} unit="million USD" />
          <Tile label="Farm out there, the engine" value={mm(sp.farmAtSwitch)} unit="million USD" />
          <Tile label="The engine picks" value={sp.bestAtSwitch} />
        </TileGrid>
      </div>
      <Note>
        Drill is {sp.drillSlopeDerived} p less {-sp.drillInterceptDerived} and Farm out is {sp.farmSlopeDerived} p (derived from the
        payoffs and the cost), equal at {sp.drillFarmNumeratorDerived} / {sp.drillFarmDenominatorDerived}. That fraction has no exact
        binary image, so at the switch the two differ by {sp.gapAtSwitchDerived.toExponential(2)} (derived) and the engine&apos;s pick is
        that residue. Drill meets Walk away lower, at {pr(sp.drillWalkSwitchDerived)}, where Farm out already pays more, so walking away
        is never best.
      </Note>
      <Sub>The published drill and farm-out tree, success swept</Sub>
      <Tbl
        head={['success probability', ...pw.rows[0].branches.map((b) => b.label), 'best']}
        strong={(i) => Boolean(pw.tie) && pw.rows[i].p === pw.tie.p}
        rows={pw.rows.map((x) => [pr(x.p), ...x.branches.map((b) => mm(b.branchValue)), x.bestLabel])}
      />
      {pw.tie && <Note>At success {pr(pw.tie.p)} Drill and Farm out tie exactly, and the engine reports {pw.tie.bestLabel}, the branch listed first.</Note>}
      <Sub>What the lottery EMV hides</Sub>
      <Tbl
        head={['action at the stated prior', 'EMV, million USD', 'money on a success (derived)', 'money on a dry hole (derived)', 'chance of a dry hole']}
        rows={[
          [ps.actions[0].label, mm(h.drillEmv), mm(h.drillMoneyDerived[0]), mm(h.drillMoneyDerived[1]), pr(h.drillChances[1])],
          [ps.actions[1].label, mm(h.farmEmv), mm(h.farmMoney[0]), mm(h.farmMoney[1]), pr(h.drillChances[1])],
        ]}
      />
    </>
  );
};

const TreeExplorer = ({ initialMode = 'tree' }) => {
  const [mode, setMode] = useState(initialMode);
  const tree = useMemo(() => (mode === 'tree'
    ? safe(() => ({ t: ekpanTree(), rules: engineRules(), refs: refusals(), dn: decisionNodes() })) : null), [mode]);
  const chance = useMemo(() => (mode === 'chance'
    ? safe(() => ({ th: thirds(), cc: costOnChanceBranch(), dp: distributionPayoff(), dro: drillOutcomes() })) : null), [mode]);
  const sequence = useMemo(() => (mode === 'sequence' ? safe(() => ({ ok: okrika(), seqs: publishedSequences() })) : null), [mode]);
  const sweep = useMemo(() => (mode === 'sweep' ? safe(() => ({ ps: priorSweep(), sp: switchPoint(), pw: publishedSweep() })) : null), [mode]);
  return (
    <PanelShell
      title="Tree explorer"
      subtitle="The EKPAN prospect rolled back branch by branch, its chance and decision nodes, the OKRIKA appraisal sequence with and without a later choice, and the EKPAN lottery swept across its prior."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'tree' && <TreeMode t={tree?.t} rules={tree?.rules} refs={tree?.refs} dn={tree?.dn} />}
        {mode === 'chance' && <ChanceMode th={chance?.th} cc={chance?.cc} dp={chance?.dp} dro={chance?.dro} />}
        {mode === 'sequence' && <SequenceMode ok={sequence?.ok} seqs={sequence?.seqs} />}
        {mode === 'sweep' && <SweepMode ps={sweep?.ps} sp={sweep?.sp} pw={sweep?.pw} />}
      </div>
    </PanelShell>
  );
};

export default TreeExplorer;
