import React, { useMemo, useState } from 'react';
import {
  HALF_PERCENT, RESIDUE, contradictions, biggerLotteries, brief, silentDefaults, distrust,
} from './decisionLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import {
  mm, pr, sci, Tbl, Sub, Line as Text, KpiCards, cardText, Outcome, outcomeLabel, Unguarded, answerText,
} from './decisionKit';

// Judgement explorer, the Expert tier. WHEN TO DISTRUST THE NUMBER: typed
// inputs that contradict each other and what the Analyzer withholds or
// refuses, bigger lotteries, Decision Studio's brief, the silent defaults, and
// the numbers a risk neutral engine reports without blinking.
//
// Every figure on this page is a return value from decisionLab, which is a
// return value from the vendored decision tree engine or the VOI Analyzer. A
// card the Analyzer withholds reads withheld. What the typed numbers would give
// with nothing checking them is marked as unguarded arithmetic and is shown on no card.
// The only outcome labels are on
// the linked Monte Carlo NPV summary and the brief's economics rows, built from
// the convention module.

const safe = (fn) => { try { return fn(); } catch { return null; } };

export const MODES = [
  ['contradictions', 'Contradictions: implied priors, rounded posteriors, withheld and refused'],
  ['lotteries', 'Lotteries: three outcomes, four actions, three readings'],
  ['brief', 'Brief: Decision Studio\'s rows and a Monte Carlo payoff'],
  ['defaults', 'Defaults: what is refused and what is read as zero'],
  ['distrust', 'Distrust: risk neutral, an exact tie, a rounded card'],
];

const Card = ({ k, v }) => <span data-card={k}>{cardText(v)}</span>;
const Gross = ({ v }) => <span data-gross="voi">{cardText(v)}</span>;

export const ContradictionsMode = ({ ct }) => {
  if (!ct) return <Note>The VOI Analyzer returned nothing.</Note>;
  const bd = ct.boundary;
  return (
    <>
      <Tbl
        head={['published case', 'stated', 'implied', 'deltas', 'consistent', 'golden']}
        rows={ct.impliedPriors.map((e) => [e.id, e.stated.map(pr).join(' / '), e.implied.map(pr).join(' / '), e.deltas.map(sci).join(' / '), String(e.consistent), String(e.goldenConsistent)])}
      />
      <Note>
        The implied chance of an outcome is the sum over indicators of the indicator chance times the outcome chance typed under it.
        The inputs are consistent when every delta against the stated chance is within {HALF_PERCENT}.
      </Note>
      <Sub>The half percent boundary</Sub>
      <TileGrid>
        <Tile label="0.305 less 0.3 in binary (derived)" value={bd.deltaDerived.toPrecision(17)} />
        <Tile label="Above the half percent by (derived)" value={bd.excessDerived.toExponential(1)} />
        <Tile label="The engine: consistent" value={String(bd.consistent)} />
        <Tile label="Against the half percent alone (derived)" value={String(bd.consistentWithoutAllowanceDerived)} />
      </TileGrid>
      <Note>The engine allows 1e-12 for binary representation, so a delta of exactly half a percent in the typed decimals is consistent.</Note>
      <Sub>EKPAN typed with rounded posteriors</Sub>
      <Tbl
        head={['Bright spot, percent', 'success given Bright spot, percent', 'success given No bright spot, percent', 'implied success', 'delta', 'consistent', 'gross voi', 'Net VOI card']}
        strong={(i) => ct.rounded[i].withheld}
        rows={ct.rounded.map((x) => [Number(x.brightSpotPercent).toFixed(6), Number(x.successGivenBrightPercent).toFixed(6), Number(x.successGivenNoBrightPercent).toFixed(6), pr(x.impliedSuccess), sci(x.delta), String(x.consistent), <Gross key="gross" v={x.voi} />, <Card key="netVoi" k="netVoi" v={x.netVoi} />])}
      />
      <Sub>IRRI: both indicators typed as 20 and 80 percent</Sub>
      <KpiCards result={ct.irri} />
      <Text>
        Implied {ct.irri.implied.map(pr).join(' / ')} against stated {ct.irri.stated.map(pr).join(' / ')}; deltas {ct.irri.deltas.map(pr).join(' / ')}.
      </Text>
      <Text><span className="text-pl-muted">The engine&apos;s insight:</span> {ct.irri.insights}</Text>
      <Note>
        <Unguarded>Weighted by the typed chances with nothing checking them, the same inputs would give a gross voi of {ct.irri.unguarded.voi.toFixed(2)} and a net voi of {ct.irri.unguarded.net.toFixed(2)} (unguarded arithmetic, derived).</Unguarded>
        {' '}Information derived by Bayes is never worth less than 0; a negative value only comes from typed inputs that contradict the stated chances.
      </Note>
      <Sub>Published cases the Analyzer withholds</Sub>
      <Tbl
        head={['case', 'EMV without Information', 'EMV with Information', 'Net VOI', 'EVPI', 'gross voi', 'implied', 'unguarded arithmetic: gross voi, net voi and EVPI (derived)']}
        rows={ct.publishedWithheld.map((x) => [
          x.id, <Card key="emvWithoutInfo" k="emvWithoutInfo" v={x.kpis.emvWithoutInfo} />, <Card key="emvWithInfo" k="emvWithInfo" v={x.kpis.emvWithInfo} />, <Card key="netVoi" k="netVoi" v={x.kpis.netVoi} />,
          <Card key="evpi" k="evpi" v={x.kpis.evpi} />, <Gross key="gross" v={x.kpis.voi} />, x.implied.map(pr).join(' / '),
          <Unguarded key="unguarded">{x.unguarded.voi.toFixed(2)}, {x.unguarded.net.toFixed(2)}, {x.unguarded.evpi.toFixed(2)}</Unguarded>,
        ])}
      />
      {ct.ekpan56.ok && (
        <>
          <Sub>EKPAN with Bright spot typed at 56 percent and No bright spot at 44</Sub>
          <Text>The posteriors are unchanged, so the implied success is {pr(ct.ekpan56.implied[0])} against a stated {pr(ct.ekpan56.stated[0])}.</Text>
          <KpiCards result={ct.ekpan56} />
          <Note><Unguarded>Unguarded arithmetic: gross voi {ct.ekpan56.unguarded.voi.toFixed(2)} (derived).</Unguarded></Note>
        </>
      )}
      <Sub>What the Analyzer refuses outright</Sub>
      <Tbl
        head={['published case', 'engine message', 'unguarded arithmetic: gross voi and EVPI (derived)']}
        rows={ct.voiRefusals.map((c) => [c.id, c.ok ? 'accepted' : c.error, c.unguarded ? <Unguarded key="unguarded">{c.unguarded.voi.toFixed(2)}, {c.unguarded.evpi.toFixed(2)}</Unguarded> : ''])}
      />
      <Text>
        EKPAN with No bright spot typed at 64 percent, so the indicator chances sum to {Number(ct.indicatorSum110.sumDerived).toFixed(6)} percent (derived):
        {' '}{ct.indicatorSum110.ok ? 'accepted' : ct.indicatorSum110.error}.
      </Text>
      <Note>
        Each typed chance must lie between 0 and 100 percent, and each sum must lie within 1e-4 percentage points of 100 (inclusive, with
        a 1e-12 allowance for binary representation). The survey cost and the decision cost must be numbers of 0 or more. A refusal says
        the typed numbers are not chances at all. A withholding says they are chances that cannot all be true together, and still reports
        the two cards that depend only on the stated outcome chances.
      </Note>
    </>
  );
};

export const LotteriesMode = ({ bl }) => {
  if (!bl) return <Note>The engine returned no lottery.</Note>;
  const e = bl.threeOutcomesFourActions;
  const t3 = bl.threeByThree;
  const imp = bl.impossibleSignal;
  return (
    <>
      <Text>Outcomes {e.outcomes.map((o) => `${o.label} ${pr(o.probability)}`).join(', ')}.</Text>
      <Tbl
        head={['action', 'cost, million USD', ...e.outcomes.map((o) => `pays on ${o.label}`), 'value at the prior']}
        rows={e.actions.map((a, i) => [a.label, mm(a.cost || 0), ...a.payoffs.map(mm), mm(e.actionValues[i].emv)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="EMV at the prior" value={mm(e.emvPrior)} unit="million USD" />
          <Tile label="EV with perfect information" value={mm(e.evWithPerfect)} unit="million USD" />
          <Tile label="EVPI" value={mm(e.evpi)} unit="million USD" />
        </TileGrid>
      </div>
      <Sub>Three readings</Sub>
      <Tbl
        head={['reading', 'likelihoods', 'chance of the reading', ...e.outcomes.map((o) => `posterior ${o.label}`), 'best action', 'EMV, million USD']}
        rows={t3.rows.map((s, i) => [s.label, t3.signals[i].likelihoods.map(pr).join(' / '), pr(s.pSignal), ...s.posterior.map(pr), s.bestLabel, mm(s.emv)])}
      />
      <Note>
        EV with the survey {mm(t3.evWithInfo)}, EVII {mm(t3.evii)}, and at a survey cost of {mm(t3.infoCost)} a net EVII of {mm(t3.netEvii)},
        against EVPI {mm(e.evpi)}. The information tree at that cost chooses {bl.threeByThreeCost12.rootChoice}, with root branch values
        {' '}{bl.threeByThreeCost12.branchValues.map(mm).join(' and ')}.
      </Note>
      <Sub>A reading that never happens</Sub>
      <Tbl
        head={['reading', 'likelihoods', 'chance of the reading', 'posterior', 'best action', 'EMV, million USD']}
        rows={imp.rows.map((s) => [s.label, s.likelihoods.map(pr).join(' / '), pr(s.pSignal), s.posterior.map(pr).join(' / '), imp.actions[s.bestActionIndex].label, mm(s.emv)])}
      />
      <Note>
        A reading with chance 0 keeps the prior ({imp.priors.map((o) => `${o.label} ${pr(o.probability)}`).join(', ')}) as its posterior
        and adds nothing to the EV with information. EVII {mm(imp.evii)}.
      </Note>
      <Sub>The half-scale action that is never best</Sub>
      <Tbl
        head={['Large', 'Dry', ...e.actions.map((a) => a.label), 'best action']}
        rows={bl.largeSweep.rows.map((x) => [pr(x.pLarge), pr(x.pDry), ...x.values.map(mm), x.bestLabel])}
      />
      <Note>
        Medium is held at {bl.largeSweep.medium}. Drill with partner pays half of Drill alone at half the cost, so it is worth exactly half
        at every probability, and it is never the best action. The sweep has one switch, between Farm out and Drill alone.
      </Note>
    </>
  );
};

export const BriefMode = ({ bf }) => {
  if (!bf) return <Note>The engine returned no brief.</Note>;
  const mc = bf.monteCarlo;
  return (
    <>
      <Tbl
        head={['tree', 'Optimal EMV, the engine', 'Recommended first move', 'Next best alternative (derived)', 'Decision advantage (derived)']}
        strong={(i) => Boolean(bf.rows[i].advantageText)}
        rows={bf.rows.map((b) => [b.name, mm(b.optimal), b.move, b.nextDerived == null ? 'row absent' : mm(b.nextDerived), b.advantageText ?? (b.advantageDerived == null ? 'row absent' : mm(b.advantageDerived))])}
      />
      <Note>
        Money is million USD. When the root branches tie at card precision, the brief names every tied branch as the first move and
        writes Indifferent at the precision shown as the advantage. A chance root has no first decision to make, and the brief says so.
      </Note>
      <Sub>A Monte Carlo payoff enters at its mean</Sub>
      <Text>
        EKPAN&apos;s success payoff linked to an NPV summary with a mean of {mm(mc.summary.mean)} million USD gives an Optimal EMV
        of {mm(mc.optimal)}, the same as the plain mean.
      </Text>
      <Tbl
        head={['NPV summary read at', 'payoff, million USD', 'Optimal EMV if read there']}
        rows={mc.readings.map((a) => [<Outcome key={a.key}>{outcomeLabel(a.key)}</Outcome>, mm(a.payoff), mm(a.emv)])}
      />
      <Note>
        The rollback is linear, so the mean is the only statistic it needs, and the spread rides along without moving the EMV. The
        brief&apos;s economics rows are labelled
        {' '}{bf.economicsRowLabels.map((l, i) => <React.Fragment key={l}>{i ? ', ' : ''}<Outcome>{l}</Outcome></React.Fragment>)},
        low to high.
      </Note>
    </>
  );
};

export const DefaultsMode = ({ sd }) => {
  if (!sd) return <Note>The engine returned no defaults.</Note>;
  return (
    <>
      <Text>Branch A pays {sd.branchA.payoff} million USD at the cost shown; branch B pays {sd.branchB.payoff} at no cost.</Text>
      <Tbl
        head={['what was typed', 'engine answer', 'best branch', 'branch A value, million USD']}
        rows={sd.rows.map((x) => [x.what, x.ok ? `accepted, EMV ${mm(x.emv)}` : `refused: ${x.error}`, x.ok ? x.bestLabel : '', x.ok && x.branchAValue !== null ? mm(x.branchAValue) : ''])}
      />
      <Note>
        A cost or payoff that is left out is read as 0. One that is present must be a number: a blank, a null or text that is not a
        number is refused by node label, and so is a negative cost, since a receipt is entered as a payoff.
      </Note>
      <Tbl
        head={['thirds typed as', 'sum (derived)', 'engine answer']}
        rows={sd.thirds.map((x) => [x.typed, pr(x.sumDerived), answerText(x)])}
      />
      <Text>
        A probability typed as the text 0.5 on both branches: {answerText(sd.probabilityAsText)}. A probability left empty on one branch
        and 1 on the other: {answerText(sd.probabilityEmpty)}.
      </Text>
      <Sub>Published EVII refusals</Sub>
      <Tbl
        head={['case', 'engine answer']}
        rows={sd.eviiRefusals.map((c) => [c.id, c.ok ? `accepted, EVII ${mm(c.evii)}` : `refused: ${c.error}`])}
      />
      <Sub>Published lottery refusals: money read by action label</Sub>
      <Tbl
        head={['case', 'engine call', 'engine answer']}
        rows={sd.lotteryRefusals.filter((c) => !/NaN|Infinity/.test(c.error || '')).map((c) => [c.id, c.call, c.ok ? 'accepted' : `refused: ${c.error}`])}
      />
      <Note>A cost or payoff that is not a finite number, an infinity included, is refused the same way.</Note>
    </>
  );
};

export const DistrustMode = ({ ds }) => {
  if (!ds) return <Note>The engine returned nothing to distrust.</Note>;
  const rn = ds.riskNeutral;
  const ti = ds.tie;
  const cc = ds.cannotChange;
  return (
    <>
      <TileGrid>
        <Tile label="EKPAN lottery, Drill EMV" value={mm(rn.drillEmv)} unit="million USD" />
        <Tile label="EKPAN lottery, Farm out EMV" value={mm(rn.farmEmv)} unit="million USD" />
        <Tile label={`Drill loses, with probability ${pr(rn.drillLossChance)} (derived)`} value={mm(rn.drillLossDerived)} unit="million USD" />
        <Tile label="Farm out at its worst (derived)" value={mm(rn.farmLowest)} unit="million USD" />
      </TileGrid>
      <Note>The engine is risk neutral. It maximises the mean and has no way to prefer the farm-out.</Note>
      <Sub>An exact tie</Sub>
      <Text>
        Success {ti.inputs.success} percent paying {ti.inputs.payS}, Dry hole {ti.inputs.dry} percent paying {ti.inputs.payD}, decision
        cost {ti.inputs.decisionCost} and survey cost {mm(ti.surveyCost)} million USD: acting is worth {ti.actingValueDerived} (derived),
        exactly the Do Not value.
      </Text>
      <KpiCards result={ti} />
      <Text><span className="text-pl-muted">The insight opens:</span> {ti.insightOpening}</Text>
      <Sub>A card rounded before it is shown</Sub>
      <Tbl
        head={['survey cost, million USD', 'Net VOI card', 'verdict sentence']}
        rows={ds.rounding.map((x) => [Number(x.cost).toFixed(3), <Card key="netVoi" k="netVoi" v={x.netVoi} />, x.verdict])}
      />
      <Note>The cards are two-decimal strings, and the verdict reads the same rounded net VOI as its card, so a card of 0.00 always carries the rounds to zero sentence.</Note>
      <Sub>Information that cannot change anything</Sub>
      <TileGrid>
        <Tile label={`EKPAN symmetric survey at accuracy ${pr(cc.accuracy)}, EVII`} value={mm(Math.abs(cc.evii) < RESIDUE ? 0 : cc.evii)} unit="million USD" />
        <Tile label="Published dominant action, EVPI" value={mm(cc.dominantActionEvpi)} unit="million USD" />
        <Tile label="Published certain outcome, EVPI" value={mm(cc.certainOutcomeEvpi)} unit="million USD" />
      </TileGrid>
      <Note>
        What these two modules cannot tell you: there is no discounting (payoffs arrive discounted), no risk attitude, no correlation
        between chance nodes beyond what the tree draws, no sequential information in the Analyzer (one survey, one decision), and only
        two actions there. The consistency check refuses numbers that are not chances, withholds a value built on chances that contradict
        each other, and never repairs either.
      </Note>
    </>
  );
};

const JudgementExplorer = ({ initialMode = 'contradictions' }) => {
  const [mode, setMode] = useState(initialMode);
  const ct = useMemo(() => (mode === 'contradictions' ? safe(() => contradictions()) : null), [mode]);
  const bl = useMemo(() => (mode === 'lotteries' ? safe(() => biggerLotteries()) : null), [mode]);
  const bf = useMemo(() => (mode === 'brief' ? safe(() => brief()) : null), [mode]);
  const sd = useMemo(() => (mode === 'defaults' ? safe(() => silentDefaults()) : null), [mode]);
  const ds = useMemo(() => (mode === 'distrust' ? safe(() => distrust()) : null), [mode]);
  return (
    <PanelShell
      title="Judgement explorer"
      subtitle="Typed inputs that contradict each other and what the Analyzer withholds or refuses, bigger lotteries, Decision Studio's brief, the silent defaults, and the numbers to distrust."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'contradictions' && <ContradictionsMode ct={ct} />}
        {mode === 'lotteries' && <LotteriesMode bl={bl} />}
        {mode === 'brief' && <BriefMode bf={bf} />}
        {mode === 'defaults' && <DefaultsMode sd={sd} />}
        {mode === 'distrust' && <DistrustMode ds={ds} />}
      </div>
    </PanelShell>
  );
};

export default JudgementExplorer;
