import React, { useState } from 'react';
import {
  STARTS, pick, pretty, viewInterests, viewCashCalls, viewBudget, viewOverhead,
} from './joaLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, orNone, Tbl, TextField, Refusal, EngineNote, Reasons, Source, useJsonBox, StatedControl, MissingStated,
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

export const InterestsMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'interests') : STARTS.interests, initialText);
  const r = box.parsed.error ? null : viewInterests(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['interests', 'The Ekene joint venture, NOC carried pro rata'], ['interestsStated', 'A half carry in stated shares'], ['interestsTwo', 'Two carries']]} />
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

export const OverheadMode = ({ initialCase = null, initialText = null }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'overhead') : STARTS.overhead, initialText);
  const r = box.parsed.error ? null : viewOverhead(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={[['overhead', 'The Ekene 2031 overhead'], ['overheadNorway', 'The Norwegian development scale, NOK million']]} />
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
