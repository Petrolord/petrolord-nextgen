import React, { useState } from 'react';
import {
  STARTS, pick, pretty, viewEarning, feeOf,
} from './farmoutLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, Refusal, EngineNote, Reasons, Source, useJsonBox, StatedControl, MissingStated,
  statedIn, CapControl, CapTermControls, safe,
} from './panelBits';

// The earning calculator (Associate): the earning obligation of a farm-in, the
// promote and its ratio, the carry inside it, the cash bonus and the past-cost
// reimbursement, the consideration, the equivalent working interest and the
// participating interests after the deal. Every figure is a return value of the
// vendored engine (engines/economics/farmout.js) through farmoutLab. This is
// the course's own calculator: there is no Suite app for this course.

export const MODES = [
  ['earning', 'The earning obligation, the promote and the consideration'],
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

const VESTING = [['per-event', 'each completed event vests (per-event)'], ['all-events', 'nothing vests until every event is completed (all-events)']];

/** Every required term of an earning obligation, each a visible control that writes the stated input into the box. */
export const EarningControls = ({ box }) => {
  const events = statedIn(box, 'earning', 'events');
  const list = Array.isArray(events) ? events : [];
  return (
    <>
      <FieldGrid>
        <StatedControl box={box} viewKey="earning" path="vesting" label="Vesting (stated)" options={VESTING} />
        <StatedControl box={box} viewKey="earning" path="eventsCompleted" label="Events completed (stated)" />
        <StatedControl box={box} viewKey="earning" path="cashBonus" label="Cash bonus (stated, 0 for none)" />
        <StatedControl box={box} viewKey="earning" path="pastCosts.amount" label="Past costs (stated, 0 for none)" />
        <StatedControl box={box} viewKey="earning" path="pastCosts.reimbursedPct" label="Past costs reimbursed, percent (stated)" />
      </FieldGrid>
      {list.map((ev, i) => {
        const who = `event ${i + 1}`;
        return (
          <div key={i} className="mt-2">
            <FieldGrid>
              <StatedControl box={box} viewKey="earning" path={`events.${i}.grossCost`} label={`${who}: gross cost (stated)`} />
              <StatedControl box={box} viewKey="earning" path={`events.${i}.farmineePaysPct`} label={`${who}: share the farminee pays, percent (stated)`} />
              <StatedControl box={box} viewKey="earning" path={`events.${i}.earnedPct`} label={`${who}: participating interest earned, percent (stated)`} />
              <CapControl box={box} viewKey="earning" path={`events.${i}.cap`} label={`${who}: cap (stated)`} />
              <CapTermControls box={box} viewKey="earning" path={`events.${i}.cap`} who={who} />
            </FieldGrid>
            <MissingStated box={box} viewKey="earning" required={[[`events.${i}.grossCost`, `the gross cost of ${who}`], [`events.${i}.farmineePaysPct`, `the share paid in ${who}`], [`events.${i}.earnedPct`, `the interest earned in ${who}`], [`events.${i}.cap`, `the cap of ${who}`]]} />
          </div>
        );
      })}
      <MissingStated box={box} viewKey="earning" required={[['vesting', 'vesting'], ['eventsCompleted', 'eventsCompleted'], ['cashBonus', 'cashBonus'], ['pastCosts.amount', 'pastCosts.amount'], ['pastCosts.reimbursedPct', 'pastCosts.reimbursedPct']]} />
    </>
  );
};

/** What the engine returns for an earning obligation: the events, the other parties, the totals and the interests after. */
export const EarningResult = ({ r }) => (
  <>
    <Tbl head={['event', 'name', 'completed', 'gross cost', 'share paid', 'interest earned', 'held after', 'promote points', 'promote ratio', 'cap state', 'farminee pays', 'farmor pays', 'carry', 'share of the gross cost the farminee pays']}
      rows={r.events.map((ev, i) => [`event ${i + 1}`, ev.name, String(ev.completed), six(ev.grossCost), six(ev.farmineePaysPct), six(ev.earnedPct), six(ev.heldAfterPct), six(ev.promotePoints), six(ev.promoteRatio), ev.capState, six(ev.farmineePays), six(ev.farmorPays), six(ev.carry), six(ev.effectivePayingPct)])} />
    <Tbl head={['event other party', 'pays its own participating interest of the gross cost']}
      rows={r.events.flatMap((ev, i) => ev.others.map((o) => [`event ${i + 1} ${o.id}`, six(o.pays)]))} />
    <TileGrid>
      <Tile label="Vested participating interest" value={six(r.vestedPct)} />
      <Tile label="Gross cost of completed events" value={six(r.totals.grossCost)} />
      <Tile label="Farminee pays" value={six(r.totals.farmineePays)} />
      <Tile label="Farmor pays" value={six(r.totals.farmorPays)} />
      <Tile label="Carry" value={six(r.totals.carry)} />
      <Tile label="Cash bonus" value={six(r.totals.cashBonus)} />
      <Tile label="Past-cost reimbursement" value={six(r.totals.pastCostReimbursement)} />
      <Tile label="Consideration to the farmor" value={six(r.totals.consideration)} />
      <Tile label="Farminee outlay" value={six(r.totals.farmineeOutlay)} />
      <Tile label="Effective paying percent" value={six(r.totals.effectivePayingPct)} />
      <Tile label="Equivalent working interest" value={six(r.totals.equivalentWorkingInterestPct)} />
      <Tile label="Promote-adjusted ratio" value={six(r.totals.promoteAdjustedRatio)} />
    </TileGrid>
    <Tbl head={['party', 'participating interest after the deal']} rows={r.interestsAfter.map((p) => [p.id, six(p.participatingPct)])} />
    <Reasons items={r.reasons} />
    <EngineNote text={r.basis.promote} />
    <EngineNote text={r.basis.carry} />
    <EngineNote text={r.basis.cap} />
    <EngineNote text={r.basis.vesting} />
    <EngineNote text={r.basis.equivalent} />
    <EngineNote text={r.basis.split} />
    <Source text={r.basis.source} />
  </>
);

export const EARNING_STARTS = [
  ['earning', 'The Ekene Deep well, a gross-cost cap'], ['earnHeadsUp', 'A heads-up deal'], ['earnFullCarry', 'A full carry'],
  ['earnThird', 'A third for a quarter'], ['earnBonus', 'A cash bonus and a reimbursement'], ['earnNoneCompleted', 'An event not yet completed'],
  ['earnAllOfFarmor', "The farmor's whole interest earned"], ['capGrossBelow', 'A well below its gross-cost cap'],
];

/**
 * THE CONSENT IN WORDS, read only: the engine's own consent line from the
 * basis of a consent fee call on the Ekene assignment (golden input fee-ekene).
 * The fee itself is computed in the deal calculator; nothing here is a figure.
 */
export const ConsentLine = () => {
  const r = safe(() => feeOf(STARTS.earnConsent));
  if (!r || r.error) return null;
  return (
    <div className="mt-3 rounded-md border border-pl-info/40 bg-pl-info-bg p-3">
      <p className="text-pl-info-text text-xs font-medium mb-1">THE CONSENT IN WORDS, AS THE ENGINE STATES IT</p>
      <p className="text-xs text-pl-text mb-0 font-mono">{r.basis.consent}</p>
      <p className="text-xs text-pl-muted mt-1 mb-0">The fee on an assignment is computed in the deal calculator.</p>
    </div>
  );
};

export const EarningMode = ({ initialCase = null, initialText = null, starts = EARNING_STARTS }) => {
  const box = useJsonBox(initialCase ? pick(initialCase, 'earning') : STARTS[starts[0][0]], initialText);
  const r = box.parsed.error ? null : viewEarning(box.parsed.value);
  return (
    <>
      <Starts box={box} starts={starts} />
      <EarningControls box={box} />
      <Box box={box} label="earningObligation inputs (JSON: parties, farmor, farminee, events, vesting, eventsCompleted, cashBonus, pastCosts), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <EarningResult r={r} />}
      <ConsentLine />
    </>
  );
};

const EarningCalculator = ({ initialMode = 'earning', initialCase = null, initialText = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Earning calculator"
      subtitle="The earning obligation of a farm-in: the share paid, the participating interest earned, the promote and its ratio, the carry, the cash bonus and reimbursement, and the interests after the deal."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'earning' && <EarningMode initialCase={initialCase} initialText={initialText} />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene Deep farm-out is synthetic; paste your own terms, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default EarningCalculator;
