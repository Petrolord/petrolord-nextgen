import React, { useState } from 'react';
import {
  parseNumber, parseJson, pretty, WS_CONTRACTING, WS_SHOULD_COST, WS_TENDER, MS_TENDER, MS_CONTENT, MS_BIDS,
  contractsOf, shouldCostOf, tenderOf, contentOf, arithmeticOf, technicalOf, albOf, preferenceOf, refusalSamples, DEFAULTS,
} from './tenderLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, Refusal, Declared,
} from './panelBits';

// The contract calculator (Expert): contracts, should-cost and the whole
// tender. Compare a lump sum, a day rate and a reimbursable contract on one
// job under a seeded duration and daily cost and read who carries the
// overrun; build the company's should-cost from the activity programme and
// screen bids against it; run a whole tender with any award basis and the
// content rule; probe a boundary; and read the engine's refusals. Every figure
// is a return value of the vendored tender engine through tenderLab. This is
// the course's own calculator: there is no Suite app for this course.

export const MODES = [
  ['contracts', 'Contract types on one job'],
  ['shouldcost', 'Should-cost and the screening band'],
  ['tender', 'The whole tender, any award basis'],
  ['bounds', 'Boundary probes'],
  ['refusals', 'The engine refusing, in its own words'],
];

const TYPES = [['lumpSum', 'lump sum'], ['dayRate', 'day rate'], ['reimbursable', 'reimbursable']];

export const ContractsMode = () => {
  const [text, setText] = useState(pretty({ ...WS_CONTRACTING, iterations: 2000 }));
  const t = parseJson(text);
  const r = t.error ? null : contractsOf(t.value);
  return (
    <>
      <FieldGrid>
        <TextField label="The job (JSON: duration, dailyCost, fixedCost, lumpSum, dayRate, reimbursable, plan, iterations, seed)" value={text} onChange={setText} rows={10} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Plan days" value={six(r.plan.days)} />
            <Tile label="Planned contractor cost" value={six(r.plan.contractorCost)} />
            <Tile label="Probability of an overrun" value={six(r.overrun.probability)} />
            <Tile label="Expected overrun" value={six(r.overrun.expectedOverrun)} />
          </TileGrid>
          <Tbl head={['type', 'planned payment', 'mean cost', 'P90 (low)', 'P50', 'P10 (high)', 'company pays', 'contractor absorbs', 'probability of a loss']} rows={TYPES.map(([k, n]) => {
            const x = r.types[k];
            return [n, six(x.plannedPayment), six(x.companyCost.mean), six(x.companyCost.p90), six(x.companyCost.p50), six(x.companyCost.p10), six(x.overrun.companyPays), six(x.overrun.contractorAbsorbs), six(x.contractorMargin.probabilityOfLoss)];
          })} />
          <Declared title="THE PERCENTILE DEFINITION">{r.percentileDefinition}</Declared>
          <Declared title="THE PERCENTILES, in the engine's words">{r.basis.percentiles}</Declared>
          <Declared title="THE SAMPLING, in the engine's words">{r.basis.sampling}</Declared>
          <Declared title="THE OVERRUN, in the engine's words">{r.basis.overrun}</Declared>
        </>
      )}
      <Note>{`The calculator starts at 2000 iterations so it answers quickly; the engine accepts up to ${DEFAULTS.MAX_ITERATIONS}. A seed and an iteration count name a result exactly.`}</Note>
    </>
  );
};

export const ShouldCostMode = () => {
  const bids = tenderOf(JSON.parse(JSON.stringify(WS_TENDER))).commercial.bids.map((x) => ({ id: x.id, evaluatedCost: x.evaluatedCost }));
  const [text, setText] = useState(pretty({ ...WS_SHOULD_COST, bids }));
  const t = parseJson(text);
  const r = t.error ? null : shouldCostOf(t.value);
  return (
    <>
      <FieldGrid>
        <TextField label="The estimate (JSON: program, nptFrac, items, contingencyFrac, partners, band, bids)" value={text} onChange={setText} rows={10} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Total days" value={six(r.totalDays)} />
            <Tile label="Base" value={six(r.baseUsd)} />
            <Tile label="Contingency" value={six(r.contingencyUsd)} />
            <Tile label="Estimate" value={six(r.estimate)} />
            {r.split && <Tile label="Operator share" value={six(r.split.operatorAmount)} />}
          </TileGrid>
          <Tbl head={['bid', 'evaluated cost', 'ratio', 'flag', 'reason']} rows={r.bids.map((x) => [x.id, six(x.evaluatedCost), six(x.ratio), String(x.flag), x.reason || ''])} />
          <Declared title="THE ESTIMATE, in the engine's words">{r.basis.estimate}</Declared>
          {r.basis.split && <Declared title="THE SPLIT, in the engine's words">{r.basis.split}</Declared>}
          <Declared title="THE BAND, in the engine's words">{r.basis.band}</Declared>
        </>
      )}
    </>
  );
};

export const TenderMode = () => {
  const nc = contentOf(JSON.parse(JSON.stringify(MS_CONTENT)));
  const pct = nc.error ? {} : Object.fromEntries(nc.bids.map((x) => [x.id, x.ncPct]));
  const [text, setText] = useState(pretty({ ...MS_TENDER, bids: MS_BIDS.map((b) => ({ ...b, ncPct: pct[b.id] })), nigerianContent: { ncLeadBasis: 'points' } }));
  const t = parseJson(text);
  const r = t.error ? null : tenderOf(t.value);
  return (
    <>
      <FieldGrid>
        <TextField label="The tender (JSON: criteria, passMark, bids, omissionRule, schedule, lifeCycle, award, and technicalWeight, priceMethod, technicalMethod or nigerianContent)" value={text} onChange={setText} rows={10} />
      </FieldGrid>
      {t.error && <Note>{t.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Award" value={String(r.award)} />
            <Tile label="Lowest evaluated cost" value={String(r.commercial ? r.commercial.lowestEvaluatedCost : 'none')} />
            <Tile label="Passed the technical envelope" value={list(r.technical.passed)} />
          </TileGrid>
          <Note>{r.reason}</Note>
          <Tbl head={['excluded', 'stage', 'reason']} rows={r.excluded.map((x) => [x.id, x.stage, x.reason])} />
        </>
      )}
    </>
  );
};

const PROBES = [
  ['arithmetic', 'A bill line with a gap you choose, against a tolerance you choose'],
  ['passmark', 'One bid scored exactly at a pass mark you choose'],
  ['alb', 'Two bids against a cost estimate: at a percent below it you choose, and one unit above that'],
  ['s14', 'Two bids within the s.14 group, contents you choose'],
];

export const BoundsMode = () => {
  const [probe, setProbe] = useState('arithmetic');
  const [a, setA] = useState('0.5');
  const [b, setB] = useState('0.5');
  let r = null;
  let show = null;
  if (probe === 'arithmetic') {
    r = arithmeticOf({ lines: [{ id: 'x', quantity: 1, unitRate: 100 + parseNumber(a), quotedAmount: 100 }], tolerance: parseNumber(b) });
    if (!r.error) show = [['rule', String(r.lines[0].rule)], ['corrected amount', six(r.lines[0].correctedAmount)]];
  } else if (probe === 'passmark') {
    r = technicalOf({ criteria: [{ id: 'c', weight: 100, maxScore: 100 }], bids: [{ id: 'X', scores: { c: parseNumber(a) } }], passMark: parseNumber(b) });
    if (!r.error) show = [['technicalPercent', six(r.bids[0].technicalPercent)], ['status', r.bids[0].status]];
  } else if (probe === 'alb') {
    const est = 1000000;
    const c = est * (1 - parseNumber(a) / 100);
    r = albOf({ estimate: est, bids: [{ id: 'AT', evaluatedCost: c }, { id: 'ABOVE', evaluatedCost: c + 1 }] });
    if (!r.error) show = [['flagged', list(r.flagged)], ['AT below the estimate, percent', six(r.bids[0].belowEstimatePct)]];
  } else {
    r = preferenceOf({ ncLeadBasis: 'points', bids: [{ id: 'LO', evaluatedCost: 1000000, ncPct: parseNumber(a), receivedAt: '2027-01-01T00:00:00Z' }, { id: 'HI', evaluatedCost: 1005000, ncPct: parseNumber(b), receivedAt: '2027-01-01T00:00:00Z' }] });
    if (!r.error) show = [['lead, points', six(r.section14.lead)], ['applied', String(r.section14.applied)], ['selected', r.selected]];
  }
  const labels = { arithmetic: ['Gap above the quoted amount', 'Tolerance'], passmark: ['Score (percent)', 'Pass mark'], alb: ['Percent below the estimate', '(unused)'], s14: ['Content of the lowest bid', 'Content of the other bid'] }[probe];
  return (
    <>
      <FieldGrid>
        <SelectField label="Probe" value={probe} onChange={setProbe} options={PROBES} />
        <NumField label={labels[0]} value={a} onChange={setA} />
        <NumField label={labels[1]} value={b} onChange={setB} />
      </FieldGrid>
      {r && r.error && <Refusal r={r} />}
      {show && <Tbl head={['figure', 'engine']} rows={show} />}
      <Note>Every boundary is the engine&apos;s own rule for that check. A gap equal to the tolerance is not corrected; a score equal to the pass mark passes; a bid exactly twenty percent below the estimate is flagged.</Note>
    </>
  );
};

export const RefusalsMode = () => (
  <>
    <Tbl head={['function', 'what was wrong', 'field', 'the engine says']} rows={refusalSamples().map((x) => [x.fn, x.what, String(x.field), x.error])} />
    <Note>A refusal names the field it refuses and states the exact condition that failed. A field with no default is refused when it is missing.</Note>
  </>
);

const ContractCalculator = ({ initialMode = 'contracts' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Contract calculator"
      subtitle="Contract types under uncertainty, should-cost, the whole tender, boundary probes and refusals."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'contracts' && <ContractsMode />}
        {mode === 'shouldcost' && <ShouldCostMode />}
        {mode === 'tender' && <TenderMode />}
        {mode === 'bounds' && <BoundsMode />}
        {mode === 'refusals' && <RefusalsMode />}
      </div>
      <Note>
        This is the course&apos;s own calculator: every number on it is a return value of the vendored tender engine, whose only random draws come from the seed you state. The Ekene tenders are synthetic.
      </Note>
    </PanelShell>
  );
};

export default ContractCalculator;
