import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import {
  RESIDUE, perfectInformation, evpiSweep, bayes, informationTree, costSweep, accuracySweep, analyzer,
} from './decisionLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import {
  mm, pr, Tbl, Sub, Line as Text, TreeRows, KpiCards, cardText,
} from './decisionKit';

// Information explorer, the Professional tier. WHAT A SURVEY IS WORTH: perfect
// information and its ceiling, imperfect information by Bayes, buying the
// survey at its net value, accuracy that is worth nothing until it can change
// the action, and the VOI Analyzer with its two actions and four cards.
//
// Every figure on this page is a return value from decisionLab, which is a
// return value from the vendored decision tree engine or the VOI Analyzer.
// Nothing here computes a posterior or a value. A KPI card is the engine's
// two-decimal string, rendered through cardText, so a withheld card reads
// withheld. The gross voi is never shown as a card. Probabilities and
// posteriors carry no P-label.

const safe = (fn) => { try { return fn(); } catch { return null; } };
const shown = (v) => (Math.abs(v) < RESIDUE ? 0 : v);

export const MODES = [
  ['perfect', 'Perfect: the best action for each outcome, EVPI and its sweep'],
  ['bayes', 'Bayes: joints, posteriors and EVII for each reading'],
  ['buy', 'Buy: the information tree and the survey cost swept'],
  ['accuracy', 'Accuracy: a symmetric survey and the accuracy that first matters'],
  ['analyzer', 'Analyzer: the VOI Analyzer on its defaults and on EKPAN'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const SmallChart = ({ data, x, y, name, refX }) => (
  <div className="h-48 mt-3">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis dataKey={x} type="number" domain={['dataMin', 'dataMax']} tick={AXIS} />
        <YAxis tick={AXIS} label={{ value: 'million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
        <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
        {refX !== undefined && <ReferenceLine x={refX} stroke="#BFFF00" strokeDasharray="4 4" />}
        <Line dataKey={y} name={name} stroke="#38bdf8" dot isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const PerfectMode = ({ pi, es }) => {
  if (!pi || !es) return <Note>The engine returned no EVPI.</Note>;
  const dry = pi.table[1];
  return (
    <>
      <TileGrid>
        <Tile label={`EMV at the prior ${pr(pi.prior)}, best action ${pi.bestPriorLabel}`} value={mm(pi.emvPrior)} unit="million USD" />
        <Tile label="EV with perfect information" value={mm(pi.evWithPerfect)} unit="million USD" />
        <Tile label="EVPI" value={mm(pi.evpi)} unit="million USD" />
      </TileGrid>
      <Tbl
        head={['outcome known first', 'prior probability', 'Drill net', 'Farm out net', 'Walk away net', 'best action', 'best value, million USD']}
        rows={pi.table.map((x) => [x.label, pr(x.prior), ...x.netsDerived.map(mm), x.bestLabel, mm(x.bestValueDerived)])}
      />
      <Note>
        Nets are each action&apos;s payoff less its cost (derived). In the {dry.label} row Farm out and Walk away both
        pay {mm(dry.netsDerived[1])}; the table names {dry.bestLabel} because it is listed first, and EVPI takes the value,
        which the tie leaves unchanged.
      </Note>
      <Sub>EVPI across the prior</Sub>
      <Tbl
        head={['success probability', 'EMV at the prior', 'EV with perfect information', 'EVPI']}
        strong={(i) => es.rows[i].p === es.peakAt}
        rows={es.rows.map((x) => [pr(x.p), mm(x.emvPrior), mm(x.evWithPerfect), mm(x.evpi)])}
      />
      <SmallChart data={es.rows} x="p" y="evpi" name="EVPI" refX={es.peakAt} />
      <Note>EVPI is largest at {pr(es.peakAt)}, the drill against farm-out switch, where the prior decision is least settled.</Note>
      <Sub>Published EVPI cases</Sub>
      <Tbl
        head={['case', 'EMV at the prior', 'EV with perfect information', 'EVPI', 'golden EVPI']}
        rows={pi.published.map((c) => [c.id, mm(c.emvPrior), mm(c.evWithPerfect), mm(c.evpi), mm(c.goldenEvpi)])}
      />
    </>
  );
};

export const BayesMode = ({ by }) => {
  if (!by) return <Note>The engine returned no Bayes table.</Note>;
  const lm = by.likelihoodMistake;
  return (
    <>
      <Tbl
        head={['signal', 'likelihood given Success', 'likelihood given Dry hole']}
        rows={by.signals.map((s) => [s.label, ...s.likelihoods.map(pr)])}
      />
      <Tbl
        head={['signal', 'joint with Success (derived)', 'joint with Dry hole (derived)', 'chance of the signal', 'posterior Success', 'posterior Dry hole', 'best action', 'EMV, million USD']}
        rows={by.rows.map((s) => [s.label, pr(s.jointDerived[0]), pr(s.jointDerived[1]), pr(s.pSignal), pr(s.posterior[0]), pr(s.posterior[1]), s.bestLabel, mm(s.emv)])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">The joints are prior times likelihood; the chance of a signal is their sum; each posterior is its joint over that chance.</p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="EV with the survey, before its cost" value={mm(by.evWithInfo)} unit="million USD" />
          <Tile label="EMV at the prior" value={mm(by.emvPrior)} unit="million USD" />
          <Tile label="EVII" value={mm(by.evii)} unit="million USD" />
          <Tile label="EVPI" value={mm(by.evpi)} unit="million USD" />
          <Tile label={`Net EVII at a survey cost of ${mm(by.surveyCost)}`} value={mm(by.netEvii)} unit="million USD" />
        </TileGrid>
      </div>
      <Note>EVII sits between 0 and EVPI. The engine derives posteriors from likelihoods, so they cannot contradict the prior.</Note>
      <Sub>A likelihood read as a posterior</Sub>
      <Text>
        Read {pr(lm.likelihoodRead)} as the chance of success after a bright spot and Drill is worth {mm(lm.drillAtLikelihood)} million
        USD; at the posterior it is worth {mm(lm.drillAtPosterior)}.
      </Text>
      <Sub>Published Bayes cases</Sub>
      <Tbl
        head={['case', 'EV with information', 'EVII', 'net EVII', 'each signal: chance, posteriors, best action index, EMV', 'golden EVII']}
        rows={by.published.map((c) => [c.id, mm(c.evWithInfo), mm(c.evii), mm(c.netEvii), c.perSignal.map((s) => `${s.label} ${pr(s.pSignal)}, ${s.posterior.map(pr).join(' / ')}, ${s.bestActionIndex}, ${mm(s.emv)}`).join('; '), mm(c.goldenEvii)])}
      />
    </>
  );
};

export const BuyMode = ({ it, cs }) => {
  if (!it || !cs) return <Note>The engine returned no information tree.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="EVII, before the survey is paid for" value={mm(it.evii)} unit="million USD" />
        <Tile label={`Net EVII, after its ${mm(it.surveyCost)} cost`} value={mm(it.netEvii)} unit="million USD" />
        <Tile label="Acquire branch value" value={mm(it.acquire)} unit="million USD" />
        <Tile label="No further information" value={mm(it.noInformation)} unit="million USD" />
      </TileGrid>
      <TreeRows tv={it} />
      <Note>
        Acquire is worth the EV with information, {mm(it.evWithInfo)}, less the survey cost; no further information is worth the EMV at
        the prior, {mm(it.emvPrior)}. Their difference, {mm(it.differenceDerived)} (derived), is the net EVII. The price that makes the
        survey value neutral is the gross EVII, {mm(it.neutralCost)}.
      </Note>
      <Sub>The survey cost swept</Sub>
      <Tbl
        head={['survey cost, million USD', 'acquire branch value', 'no-information branch value', 'net EVII', 'root choice']}
        strong={(i) => cs.rows[i].isTie}
        rows={cs.rows.map((x) => [mm(x.cost), mm(x.acquire), mm(x.noInformation), mm(x.netEvii), x.rootChoice])}
      />
      <Note>At a cost equal to the gross EVII, {mm(cs.tieCost)}, the two root branches tie and the engine keeps the acquisition, listed first.</Note>
      <Sub>Published information trees</Sub>
      <Tbl
        head={['case', 'survey cost', 'root', 'root EMV', 'best branch index', 'root branch values', 'golden EMV']}
        rows={it.published.map((c) => [c.id, mm(c.infoCost), c.rootLabel, mm(c.emv), c.bestBranchIndex, c.branchValues.map(mm).join(' / '), mm(c.goldenEmv)])}
      />
    </>
  );
};

export const AccuracyMode = ({ ac }) => {
  if (!ac) return <Note>The engine returned no accuracy sweep.</Note>;
  const chart = ac.rows.map((x) => ({ accuracy: x.accuracy, evii: shown(x.evii) }));
  return (
    <>
      <Tbl
        head={['accuracy', 'chance it reads success', 'success after reads success', 'success after reads dry', 'best after reads success', 'best after reads dry', 'EVII', 'EVPI']}
        rows={ac.rows.map((x) => [pr(x.accuracy), pr(x.pReadsSuccess), pr(x.successAfterReadsSuccess), pr(x.successAfterReadsDry), x.bestAfterReadsSuccess, x.bestAfterReadsDry, mm(shown(x.evii)), mm(x.evpi)])}
      />
      <SmallChart data={chart} x="accuracy" y="evii" name="EVII" refX={ac.bisectedAccuracy} />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Accuracy where reads dry first changes the action, by bisection on the engine's choice" value={pr(ac.bisectedAccuracy)} />
          <Tile label="The drill against farm-out switch" value={pr(ac.switchPrior)} />
        </TileGrid>
      </div>
      <Note>
        An EVII below 1e-9 prints as 0: at accuracy 0.55 the engine returns {ac.residueAt055.toExponential(2)}, the residue of two equal
        sums. Until a reads dry result can pull the success probability below the switch, both readings lead to Drill and the survey is
        worth nothing.
      </Note>
      <Tbl
        head={['published case, prior 0.3', 'engine EVII, million USD', 'golden']}
        rows={ac.published.map((c) => [c.id, mm(c.evii), mm(c.goldenEvii)])}
      />
    </>
  );
};

export const AnalyzerMode = ({ an }) => {
  if (!an) return <Note>The VOI Analyzer returned nothing.</Note>;
  const d = an.defaults;
  const i = d.inputs;
  const ef = an.ekpanForm;
  const tp = an.ekpanTyped;
  return (
    <>
      <Text>
        The default study: {i.decisionName} at a cost of {mm(i.decisionCost)} million USD;
        {' '}{i.outcomes.map((o) => `${o.name} ${o.probability} percent paying ${mm(o.payoff)}`).join(', ')}; the {i.infoScenario.name} at
        {' '}{mm(i.infoScenario.cost)}; {i.infoScenario.indicators.map((x) => `${x.name} ${x.probability} percent`).join(', ')}.
      </Text>
      <Sub>The five numbers the engine returns</Sub>
      <Tbl
        head={['engine key', 'returned string']}
        rows={['emvWithoutInfo', 'emvWithInfo', 'voi', 'netVoi', 'evpi'].map((k) => [k, <span key={k} data-kpi={k}>{cardText(d.kpis[k])}</span>])}
      />
      <Sub>The four cards the Analyzer shows</Sub>
      <KpiCards result={d} />
      <Note>The EMV with Information card is after the survey cost; the tree engine&apos;s EV with information is before it.</Note>
      <Text><span className="text-slate-500">The engine&apos;s insight:</span> {d.insights}</Text>
      <Sub>EKPAN typed into the form</Sub>
      <Text>
        {ef.decisionName} at {mm(ef.decisionCost)} million USD; {ef.outcomes.map((o) => `${o.name} ${o.probability} percent paying ${mm(o.payoff)}`).join(' and ')} (payoffs
        before the decision cost); the {ef.infoScenario.name} at {mm(ef.infoScenario.cost)}; Bright spot typed at {Number(tp.percents.pPos).toFixed(6)} percent,
        success given a bright spot {Number(tp.percents.postPos).toFixed(6)} percent and given none {Number(tp.percents.postNeg).toFixed(6)} percent.
      </Text>
      <KpiCards result={tp} />
      <Note>
        Inverted back to likelihoods (derived), those entries give {pr(an.invertedDerived.brightGivenSuccess)} for a bright spot given
        success and {pr(an.invertedDerived.brightGivenDry)} given a dry hole: the survey&apos;s own.
      </Note>
      <Sub>The missing third action</Sub>
      <Tbl
        head={['EKPAN lottery', 'EMV at the prior', 'EV with information', 'EVII', 'EVPI']}
        rows={[
          ['Drill or Walk away, the Analyzer\'s two actions', mm(an.twoAction.emvPrior), mm(an.twoAction.evWithInfo), mm(an.twoAction.evii), mm(an.twoAction.evpi)],
          ['with Farm out as well', '', '', mm(an.threeAction.evii), mm(an.threeAction.evpi)],
        ]}
      />
      <Note>The Analyzer offers the named decision and Do Not, nothing else, so its gross voi of {cardText(tp.kpis.voi)} is the two-action number.</Note>
      <Sub>The verdict, by the sign of net VOI</Sub>
      <Tbl
        head={['published case', 'survey cost, million USD', 'Net VOI card', 'verdict sentence']}
        rows={an.verdicts.map((v) => [v.id, mm(v.cost), <span key="netVoi" data-card="netVoi">{cardText(v.netVoi)}</span>, v.verdict])}
      />
      <Tbl
        head={['survey cost, million USD', 'EMV with Information card', 'Net VOI card', 'tree root choice']}
        rows={an.costTable.map((x) => [mm(x.cost), <span key="emvWithInfo" data-card="emvWithInfo">{cardText(x.emvWithInfo)}</span>, <span key="netVoi" data-card="netVoi">{cardText(x.netVoi)}</span>, x.rootChoice ?? 'no tree'])}
      />
    </>
  );
};

const InformationExplorer = ({ initialMode = 'perfect' }) => {
  const [mode, setMode] = useState(initialMode);
  const perfect = useMemo(() => (mode === 'perfect' ? safe(() => ({ pi: perfectInformation(), es: evpiSweep() })) : null), [mode]);
  const by = useMemo(() => (mode === 'bayes' ? safe(() => bayes()) : null), [mode]);
  const buy = useMemo(() => (mode === 'buy' ? safe(() => ({ it: informationTree(), cs: costSweep() })) : null), [mode]);
  const ac = useMemo(() => (mode === 'accuracy' ? safe(() => accuracySweep()) : null), [mode]);
  const an = useMemo(() => (mode === 'analyzer' ? safe(() => analyzer()) : null), [mode]);
  return (
    <PanelShell
      title="Information explorer"
      subtitle="What a survey on the EKPAN lottery is worth: perfect information, Bayes on its likelihoods, buying it at its net value, how accurate it must be before it matters, and the VOI Analyzer."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'perfect' && <PerfectMode pi={perfect?.pi} es={perfect?.es} />}
        {mode === 'bayes' && <BayesMode by={by} />}
        {mode === 'buy' && <BuyMode it={buy?.it} cs={buy?.cs} />}
        {mode === 'accuracy' && <AccuracyMode ac={ac} />}
        {mode === 'analyzer' && <AnalyzerMode an={an} />}
      </div>
    </PanelShell>
  );
};

export default InformationExplorer;
