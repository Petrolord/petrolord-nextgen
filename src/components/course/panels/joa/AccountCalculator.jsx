import React, { useState } from 'react';
import {
  STARTS, pick, pretty, viewInterests, viewCashCalls, viewBudget, viewOverhead,
} from './joaLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, Tbl, TextField, Refusal, EngineNote, Reasons, Source, useJsonBox, StatedControl, MissingStated,
  statedIn, writeStated, ActionButton, CarriersControl,
} from './panelBits';

// The account calculator (Associate): participating, paying and beneficial
// interests with carries, monthly cash calls, budget control and operator
// overhead. Every figure is a return value of the vendored engine
// (engines/economics/jointVenture.js) through joaLab. This is the course's own
// calculator: there is no Suite app for this course.

export const MODES = [
  ['interests', 'Participating, paying and beneficial interests'],
  ['cashCalls', 'Cash calls'],
  ['budget', 'Budget control'],
  ['overhead', 'Operator overhead'],
];

export const Box = ({ box, label, rows = 10 }) => (
  <FieldGrid>
    <TextField label={label} value={box.text} onChange={box.setText} rows={rows} />
  </FieldGrid>
);

/** A start selector that loads a teaching case into the box. */
export const Starts = ({ box, starts }) => {
  const [start, setStart] = useState(starts[0][0]);
  const choose = (k) => { setStart(k); box.setText(pretty(STARTS[k])); };
  return (
    <FieldGrid>
      <SelectField label="Start from" value={start} onChange={choose} options={starts} />
    </FieldGrid>
  );
};

/** The terms of every carry in the box: carriedPct, the carriers rule and, for stated shares, each carrier's share. */
export const CarryTermControls = ({ box, viewKey }) => {
  const carries = statedIn(box, viewKey, 'carries');
  if (!Array.isArray(carries) || !carries.length) return null;
  return carries.map((c, i) => {
    const who = c && typeof c.carried === 'string' ? c.carried : `carry ${i + 1}`;
    const shares = c && c.carriers && typeof c.carriers === 'object' ? Object.keys(c.carriers) : [];
    return (
      <div key={i}>
        <FieldGrid>
          <StatedControl box={box} viewKey={viewKey} path={`carries.${i}.carriedPct`} label={`${who}: carried, percent of its cost share (stated)`} />
          <CarriersControl box={box} viewKey={viewKey} index={i} label={`${who}: carriers (stated)`} />
          {shares.map((id) => <StatedControl key={id} box={box} viewKey={viewKey} path={`carries.${i}.carriers.${id}`} label={`${who}: share carried by ${id}, percent (stated)`} />)}
        </FieldGrid>
        <MissingStated box={box} viewKey={viewKey} required={[[`carries.${i}.carriedPct`, `carriedPct for ${who}`], [`carries.${i}.carriers`, `the carriers of ${who}`]]} />
      </div>
    );
  });
};

export const InterestsMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'interests') : STARTS.interests, initialText);
  const r = box.parsed.error ? null : viewInterests(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['interests', 'The Ekene joint venture, NOC carried pro rata'], ['interestsStated', 'A half carry in stated shares'], ['interestsTwo', 'Two carries']]} />
      <CarryTermControls box={box} viewKey="interests" />
      <Box box={box} label="participatingInterests inputs (JSON: parties, carries), or a whole case file" rows={10} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['party', 'beneficial interest', 'paying interest', 'carried percent', 'carry points it pays']}
            rows={r.parties.map((p) => [p.id, six(p.beneficialPct), six(p.payingPct), six(p.carriedPct), p.carryShares.length ? p.carryShares.map((c) => `${c.carried} ${six(c.pct)}`).join('; ') : 'none'])} />
          <TileGrid>
            <Tile label="Beneficial interests, total" value={six(r.totals.beneficialPct)} />
            <Tile label="Paying interests, total" value={six(r.totals.payingPct)} />
          </TileGrid>
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.carriers} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const NEGATIVE_CALL = [['refund', 'refunded as a negative call (refund)'], ['carry', 'carried to the next call (carry)']];

/** The per-party month table: its first column is "<month> <party>". */
export const CashCallTable = ({ r }) => (
  <Tbl head={['month party', 'called', 'forecast share', 'adjustment', 'call', 'arrears billing', 'paid', 'actual share', 'difference', 'carried', 'balance']}
    rows={r.months.flatMap((m) => m.parties.map((p) => [`${m.month} ${p.id}`, String(m.called), six(p.forecastShare), six(p.adjustment), six(p.call), six(p.arrearsBilling), six(p.paid), six(p.actualShare), six(p.difference), six(p.carried), six(p.balance)]))} />
);

/** The cash call starts: the Ekene ledgers and the small digest cases, golden inputs only. */
export const CASH_CALL_STARTS = [
  ['cashCalls', 'The Ekene 2027 ledger, a credit carried'], ['cashCallsRefund', 'The same ledger, a negative call refunded'],
  ['cashCallsLag1', 'The same ledger, a lag of one month'], ['ccZeroCall', 'A month with a zero forecast, credit carried'],
  ['ccZeroCallRefund', 'A month with a zero forecast, refunded'], ['ccThreshold', 'A forecast at the threshold, then one below'],
  ['ccLastUncalled', 'The last month below the threshold'], ['ccYearBoundary', 'A ledger across the year end'],
];

/** The cash call terms, each a visible control that writes the stated input into the box. */
export const CashCallControls = ({ box }) => (
  <>
    <FieldGrid>
      <StatedControl box={box} viewKey="cashCalls" path="reconciliationLagMonths" label="Reconciliation lag, months (stated)" />
      <StatedControl box={box} viewKey="cashCalls" path="negativeCall" label="A negative call is (stated)" options={NEGATIVE_CALL} />
      <StatedControl box={box} viewKey="cashCalls" path="noCallBelow" label="No cash call below (optional)" />
    </FieldGrid>
    <MissingStated box={box} viewKey="cashCalls" required={[['reconciliationLagMonths', 'reconciliationLagMonths'], ['negativeCall', 'negativeCall']]} />
  </>
);

export const CashCallsMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'cashCalls') : STARTS.cashCalls, initialText);
  const r = box.parsed.error ? null : viewCashCalls(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={CASH_CALL_STARTS} />
      <CashCallControls box={box} />
      <Box box={box} label="cashCalls inputs (JSON: parties, carries, months, reconciliationLagMonths, negativeCall, noCallBelow), or a whole case file" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['month', 'forecast', 'actual', 'called', 'calls', 'arrears billed', 'total paid', 'difference']}
            rows={r.months.map((m) => [m.month, six(m.forecast), six(m.actual), String(m.called), six(m.totals.call), six(m.totals.arrearsBilling), six(m.totals.paid), six(m.totals.difference)])} />
          <CashCallTable r={r} />
          <Reasons items={r.months.flatMap((m) => m.reasons)} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.threshold} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

export const BudgetMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'budget') : STARTS.budget, initialText);
  const r = box.parsed.error ? null : viewBudget(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['budget', 'The Ekene 2027 budget'], ['budgetNorway', 'The Norwegian figures, in NOK million']]} />
      <FieldGrid>
        <StatedControl box={box} viewKey="budget" path="itemTolerancePct" label="Item tolerance, percent (stated)" />
        <StatedControl box={box} viewKey="budget" path="budgetTolerance.pct" label="Budget tolerance, percent (stated)" />
        <StatedControl box={box} viewKey="budget" path="budgetTolerance.amount" label="Budget tolerance amount (optional)" />
        <StatedControl box={box} viewKey="budget" path="unbudgetedAllowance" label="Unbudgeted allowance (optional)" />
      </FieldGrid>
      <MissingStated box={box} viewKey="budget" required={[['itemTolerancePct', 'itemTolerancePct'], ['budgetTolerance.pct', 'budgetTolerance.pct']]} />
      <Box box={box} label="budgetControl inputs (JSON: items, itemTolerancePct, budgetTolerance, unbudgetedAllowance), or a whole case file" rows={10} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['item', 'approved', 'actual', 'overrun', 'overrun percent', 'limit', 'inside its tolerance']}
            rows={r.items.map((i) => [i.item, six(i.approved), six(i.actual), six(i.overrun), six(i.overrunPct), six(i.limit), String(i.withinItemTolerance)])} />
          <TileGrid>
            <Tile label="Approved" value={six(r.total.approved)} />
            <Tile label="Actual" value={six(r.total.actual)} />
            <Tile label="Overrun" value={six(r.total.overrun)} />
            <Tile label="Allowed overrun" value={six(r.total.allowedOverrun)} />
            <Tile label="Held by" value={r.total.heldBy} />
            <Tile label="Inside the budget tolerance" value={String(r.total.withinBudgetTolerance)} />
            <Tile label="Unbudgeted total" value={six(r.unbudgeted.total)} />
            <Tile label="Inside the unbudgeted allowance" value={orNone(r.unbudgeted.withinAllowance)} />
          </TileGrid>
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.boundary} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

/**
 * THE OVERHEAD TERMS OF EVERY CATEGORY THE BOX CARRIES: the exclusion, each
 * band's upper limit and per cent, the per cent above the last band, and a
 * button to add or remove a band (a new band is empty, so the engine refuses
 * until its upper limit and per cent are stated).
 */
export const OverheadControls = ({ box }) => {
  const costs = statedIn(box, 'overhead', 'costs');
  const cats = costs && typeof costs === 'object' && !Array.isArray(costs) ? Object.keys(costs) : [];
  return cats.map((cat) => {
    const scale = statedIn(box, 'overhead', `scale.${cat}`);
    const bands = scale && Array.isArray(scale.bands) ? scale.bands : [];
    return (
      <div key={cat} className="mt-2">
        <FieldGrid>
          <StatedControl box={box} viewKey="overhead" path={`excluded.${cat}`} label={`${cat}: excluded from the base (optional)`} />
          {bands.map((_, j) => (
            <React.Fragment key={j}>
              <StatedControl box={box} viewKey="overhead" path={`scale.${cat}.bands.${j}.upTo`} label={`${cat}: band ${j + 1} up to (stated)`} />
              <StatedControl box={box} viewKey="overhead" path={`scale.${cat}.bands.${j}.pct`} label={`${cat}: band ${j + 1} per cent (stated)`} />
            </React.Fragment>
          ))}
          {scale && <StatedControl box={box} viewKey="overhead" path={`scale.${cat}.abovePct`} label={`${cat}: per cent above the last band (stated)`} />}
          {scale
            ? <ActionButton label={`Add a band to ${cat}`} onClick={() => writeStated(box, 'overhead', `scale.${cat}.bands`, [...bands, {}])} />
            : <ActionButton label={`State a scale for ${cat}`} onClick={() => writeStated(box, 'overhead', `scale.${cat}`, { bands: [] })} />}
          {bands.length > 0 && <ActionButton label={`Remove the last band of ${cat}`} onClick={() => writeStated(box, 'overhead', `scale.${cat}.bands.${bands.length - 1}`, undefined)} />}
        </FieldGrid>
        <MissingStated box={box} viewKey="overhead" required={[[`scale.${cat}`, `a scale for ${cat}`], ...(scale ? [[`scale.${cat}.abovePct`, `the per cent above the last band for ${cat}`]] : [])]} />
      </div>
    );
  });
};

export const OverheadMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'overhead') : STARTS.overhead, initialText);
  const r = box.parsed.error ? null : viewOverhead(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['overhead', 'The Ekene 2031 overhead'], ['overheadNorway', 'The Norwegian development scale, NOK million']]} />
      <OverheadControls box={box} />
      <Box box={box} label="overhead inputs (JSON: costs, excluded, scale with bands and abovePct per category, every rate stated), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && (
        <>
          <Tbl head={['category', 'cost', 'excluded', 'base', 'charge']}
            rows={r.categories.map((c) => [c.category, six(c.cost), six(c.excluded), six(c.base), six(c.charge)])} />
          <Tbl head={['category band', 'from', 'up to', 'per cent', 'part of the base in it', 'band charge']}
            rows={r.categories.flatMap((c) => [
              ...c.bands.map((b, i) => [`${c.category} band ${i + 1}`, six(b.from), six(b.upTo), six(b.pct), six(b.amount), six(b.charge)]),
              [`${c.category} above the last band`, six(c.above.from), 'none', six(c.above.pct), six(c.above.amount), six(c.above.charge)],
            ])} />
          <TileGrid>
            <Tile label="Total overhead" value={six(r.total)} />
          </TileGrid>
          <Reasons items={r.reasons} />
          <EngineNote text={r.basis.rule} />
          <EngineNote text={r.basis.base} />
          <Source text={r.basis.source} />
        </>
      )}
    </>
  );
};

const AccountCalculator = ({ initialMode = 'interests', initialCase = null, initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Account calculator"
      subtitle="Participating, paying and beneficial interests under a carry, monthly cash calls, budget control and operator overhead."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'interests' && <InterestsMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'cashCalls' && <CashCallsMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'budget' && <BudgetMode initialCase={initialCase} initialText={initialText} />}
        {mode === 'overhead' && <OverheadMode initialCase={initialCase} initialText={initialText} />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene joint venture is synthetic; paste your own terms, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default AccountCalculator;
