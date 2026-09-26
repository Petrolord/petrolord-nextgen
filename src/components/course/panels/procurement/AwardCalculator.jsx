import React, { useState } from 'react';
import {
  parseNumber, parseJson, pretty, MS_BIDS, MS_CONTENT, MATERIALS_SETTINGS, WELL_SERVICES_SETTINGS, NC_SCHEDULE,
  technicalOf, MS_CRITERIA, evaluatedOf, bandOf, albOf, contentOf, preferenceOf,
} from './tenderLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, list, Tbl, TextField, Refusal, Declared,
} from './panelBits';

// The award calculator (Professional): the lowest evaluated cost and the
// content Act. Discount a life-cycle cost into the evaluated cost, place a
// technical weight in its para 5.50 cell, test bids for an abnormally low
// price, measure Nigerian content item by item in the Schedule's units, and
// apply sections 14 and 16 with the s.14 reading stated. Every figure is a
// return value of the vendored tender engine through tenderLab, on the Ekene
// materials tender as it starts or on what you paste. This is the course's own
// calculator: there is no Suite app for this course.

export const MODES = [
  ['lifecycle', 'Evaluated cost with a life-cycle cost'],
  ['band', 'The Rated Criteria weighting band'],
  ['alb', 'Abnormally low bids'],
  ['content', 'Nigerian content by item'],
  ['preference', 'Sections 14 and 16, both readings'],
];

const passedMs = () => technicalOf({ criteria: MS_CRITERIA, bids: MS_BIDS, passMark: MATERIALS_SETTINGS.passMark }).passed;
const commercialOnly = (bids) => bids.map(({ scores, mandatory, indigenous, capacity, ...rest }) => rest);
const msEvaluated = () => evaluatedOf({ bids: commercialOnly(MS_BIDS.filter((b) => passedMs().includes(b.id))), schedule: MATERIALS_SETTINGS.schedule, lifeCycle: MATERIALS_SETTINGS.lifeCycle });

export const LifeCycleMode = () => {
  const [bids, setBids] = useState(pretty(commercialOnly(MS_BIDS.filter((b) => passedMs().includes(b.id)))));
  const [years, setYears] = useState(String(MATERIALS_SETTINGS.lifeCycle.years));
  const [rate, setRate] = useState(String(MATERIALS_SETTINGS.lifeCycle.discountRate));
  const [minW, setMinW] = useState(String(MATERIALS_SETTINGS.schedule.minWeeks));
  const [maxW, setMaxW] = useState(String(MATERIALS_SETTINGS.schedule.maxWeeks));
  const [perW, setPerW] = useState(String(MATERIALS_SETTINGS.schedule.ratePerWeek));
  const b = parseJson(bids);
  const r = b.error ? null : evaluatedOf({
    bids: b.value,
    lifeCycle: { years: parseNumber(years), discountRate: parseNumber(rate) },
    schedule: { minWeeks: parseNumber(minW), maxWeeks: parseNumber(maxW), ratePerWeek: parseNumber(perW) },
  });
  return (
    <>
      <FieldGrid>
        <TextField label="Passing bids (JSON array of { id, receivedAt, lines, omitted, completionWeeks, annualCosts, residualValue })" value={bids} onChange={setBids} rows={8} />
        <NumField label="Life-cycle years" value={years} onChange={setYears} />
        <NumField label="Discount rate (a fraction a year)" value={rate} onChange={setRate} />
        <NumField label="minWeeks" value={minW} onChange={setMinW} />
        <NumField label="maxWeeks" value={maxW} onChange={setMaxW} />
        <NumField label="ratePerWeek" value={perW} onChange={setPerW} />
      </FieldGrid>
      {b.error && <Note>{b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['rank', 'bid', 'corrected price', 'omissions', 'schedule', 'life-cycle cost', 'evaluated cost']} rows={r.bids.map((x) => [String(x.rank), x.id, six(x.correctedPrice), six(x.omissionTotal), six(x.scheduleAdjustment), six(x.lifeCycleCost), six(x.evaluatedCost)])} />
          <TileGrid>
            <Tile label="Lowest evaluated cost" value={String(r.lowestEvaluatedCost)} />
          </TileGrid>
          <Declared title="THE LIFE-CYCLE COST, in the engine's words">{r.basis.lifeCycle}</Declared>
          <Declared title="THE EVALUATED COST, in the engine's words">{r.basis.evaluatedCost}</Declared>
        </>
      )}
    </>
  );
};

export const BandMode = () => {
  const [risk, setRisk] = useState(WELL_SERVICES_SETTINGS.risk);
  const [cost, setCost] = useState(String(WELL_SERVICES_SETTINGS.estimatedCostUsd));
  const [tw, setTw] = useState(String(WELL_SERVICES_SETTINGS.technicalWeight));
  const t = parseNumber(tw);
  const r = bandOf({ risk, estimatedCostUsd: parseNumber(cost), ...(t === undefined ? {} : { technicalWeight: t }) });
  return (
    <>
      <FieldGrid>
        <SelectField label="Procurement risk" value={risk} onChange={setRisk} options={[['high', 'High or Substantial'], ['low', 'Moderate or Low']]} />
        <NumField label="Estimated cost (US$)" value={cost} onChange={setCost} />
        <NumField label="Technical weight (blank: none)" value={tw} onChange={setTw} />
      </FieldGrid>
      {r.error && <Refusal r={r} />}
      {!r.error && (
        <>
          <TileGrid>
            <Tile label="Cell" value={r.cell} />
            <Tile label="High value" value={String(r.highValue)} />
            <Tile label="Range" value={`${six(r.min)} to ${six(r.max)}`} />
            {r.withinBand !== undefined && <Tile label="Inside the range" value={String(r.withinBand)} />}
          </TileGrid>
          {r.reason && <Note>{r.reason}</Note>}
          <Declared title="THE RULE, in the engine's words">{r.basis.rule}</Declared>
        </>
      )}
    </>
  );
};

export const AlbMode = () => {
  const start = msEvaluated();
  const rows = start.error ? [] : start.bids.map((x) => ({ id: x.id, evaluatedCost: x.evaluatedCost }));
  const [bids, setBids] = useState(pretty(rows));
  const [est, setEst] = useState('');
  const b = parseJson(bids);
  const e = parseNumber(est);
  const r = b.error ? null : albOf({ bids: b.value, ...(e === undefined ? {} : { estimate: e }) });
  return (
    <>
      <FieldGrid>
        <TextField label="Substantially responsive bids (JSON array of { id, evaluatedCost })" value={bids} onChange={setBids} rows={6} />
        <NumField label="Cost estimate (needed below five bids)" value={est} onChange={setEst} />
      </FieldGrid>
      {b.error && <Note>{b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <TileGrid>
            <Tile label="Approach" value={r.approach} />
            <Tile label="Bids" value={String(r.count)} />
            {r.approach === 'relative' && <Tile label="Mean" value={six(r.mean)} />}
            {r.approach === 'relative' && <Tile label="Standard deviation (population)" value={six(r.standardDeviation)} />}
            {r.approach === 'relative' && <Tile label="Limit" value={six(r.limit)} />}
            <Tile label="To clarify" value={list(r.flagged)} />
          </TileGrid>
          <Tbl head={['bid', 'evaluated cost', 'percent below the estimate', 'flag']} rows={r.bids.map((x) => [x.id, six(x.evaluatedCost), six(x.belowEstimatePct), String(x.flag)])} />
          {r.bids.filter((x) => x.reason).map((x) => <Note key={x.id}>{x.reason}</Note>)}
          <Declared title="THE RULE, in the engine's words">{r.basis.rule}</Declared>
        </>
      )}
    </>
  );
};

export const ContentMode = () => {
  const [items, setItems] = useState(pretty(MS_CONTENT.items));
  const [bids, setBids] = useState(pretty(MS_CONTENT.bids));
  const i = parseJson(items); const b = parseJson(bids);
  const r = i.error || b.error ? null : contentOf({ items: i.value, bids: b.value });
  return (
    <>
      <FieldGrid>
        <TextField label="Items (JSON array of { id, scheduleLine } or { id, targetPct, measure, source })" value={items} onChange={setItems} rows={6} />
        <TextField label="Bids (JSON array of { id, items: { item: { measure, nigerian, total } }, weights })" value={bids} onChange={setBids} rows={8} />
      </FieldGrid>
      {i.error && <Note>{i.error}</Note>}
      {b.error && <Note>{b.error}</Note>}
      {r && r.error && <Refusal r={r} />}
      {r && !r.error && (
        <>
          <Tbl head={['bid', 'overall content', 'items met', 'all met']} rows={r.bids.map((x) => [x.id, six(x.ncPct), `${x.itemsMet} of ${x.items.length}`, String(x.allMet)])} />
          <Tbl head={['item', 'minimum', 'measured in', 'source']} rows={r.targets.map((x) => [x.id, `${x.targetPct}%`, x.measures.join(' or '), x.source])} />
          {r.bids.flatMap((x) => x.reasons.map((t) => <Note key={`${x.id}${t}`}>{`${x.id}: ${t}`}</Note>))}
          <Declared title="BY ITEM, in the engine's words">{r.basis.item}</Declared>
          <Declared title="OVERALL, in the engine's words">{r.basis.overall}</Declared>
        </>
      )}
      <Note>{`The engine carries ${Object.keys(NC_SCHEDULE).length} lines of the 2010 Schedule. A target the Schedule does not list enters with its source stated.`}</Note>
    </>
  );
};

export const PreferenceMode = () => {
  const start = msEvaluated();
  const nc = contentOf(JSON.parse(JSON.stringify(MS_CONTENT)));
  const pct = nc.error ? {} : Object.fromEntries(nc.bids.map((x) => [x.id, x.ncPct]));
  const rows = start.error ? [] : start.bids.map((x) => ({ id: x.id, evaluatedCost: x.evaluatedCost, receivedAt: x.receivedAt, ncPct: pct[x.id], indigenous: MS_BIDS.find((y) => y.id === x.id).indigenous, capacity: MS_BIDS.find((y) => y.id === x.id).capacity }));
  const [bids, setBids] = useState(pretty(rows));
  const b = parseJson(bids);
  const pts = b.error ? null : preferenceOf({ bids: b.value, ncLeadBasis: 'points' });
  const rel = b.error ? null : preferenceOf({ bids: b.value, ncLeadBasis: 'relative' });
  return (
    <>
      <FieldGrid>
        <TextField label="Bids at the commercial stage (JSON array of { id, evaluatedCost, receivedAt, ncPct, indigenous, capacity })" value={bids} onChange={setBids} rows={8} />
      </FieldGrid>
      {b.error && <Note>{b.error}</Note>}
      {pts && pts.error && <Refusal r={pts} />}
      {pts && !pts.error && rel && !rel.error && (
        <>
          <Tbl head={['', 'read as points', 'read as relative']} rows={[
            ['group', list(pts.section14.group), list(rel.section14.group)],
            ['leader', String(pts.section14.leader), String(rel.section14.leader)],
            ['runner-up', String(pts.section14.runnerUp), String(rel.section14.runnerUp)],
            ['lead', six(pts.section14.lead), six(rel.section14.lead)],
            ['s.14 applied', String(pts.section14.applied), String(rel.section14.applied)],
            ['selected', pts.selected, rel.selected],
          ]} />
          <Note>{`Points: ${pts.section14.reason}`}</Note>
          <Note>{`Relative: ${rel.section14.reason}`}</Note>
          <Tbl head={['s.16 bid', 'above the lowest, percent', 'within the margin']} rows={pts.section16.map((x) => [x.id, six(x.abovePct), String(x.withinMargin)])} />
          <Declared title="SECTION 14, in the engine's words (points)">{pts.basis.section14}</Declared>
          <Declared title="SECTION 16, in the engine's words">{pts.basis.section16}</Declared>
        </>
      )}
      <Note>The Act does not say whether at least five percent higher means points or a percentage of the runner-up&apos;s content, so the calculator shows both readings side by side.</Note>
    </>
  );
};

const AwardCalculator = ({ initialMode = 'lifecycle' }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Award calculator"
      subtitle="Life-cycle cost, the weighting band, abnormally low bids, Nigerian content and sections 14 and 16."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'lifecycle' && <LifeCycleMode />}
        {mode === 'band' && <BandMode />}
        {mode === 'alb' && <AlbMode />}
        {mode === 'content' && <ContentMode />}
        {mode === 'preference' && <PreferenceMode />}
      </div>
      <Note>
        {`This is the course's own calculator: every number on it is a return value of the vendored tender engine. The Ekene materials tender (${MS_BIDS.length} bids) is synthetic; paste your own bids to replace it.`}
      </Note>
    </PanelShell>
  );
};

export default AwardCalculator;
