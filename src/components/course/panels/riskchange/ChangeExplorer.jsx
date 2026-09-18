import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ReferenceLine,
} from 'recharts';
import {
  stageTable, stageMovesFrom, approvalSets, approvalPeople, approvalStart, approvalView, decideApproval,
  addApprovalLevel, segregationProbes, gateProbes, gateBlockers, expiryRules, expiryAt, expiryTimeline, expiryLead,
  expiryAcrossTypes, ratificationAt, ratificationTimeline, ratificationWindow, ratificationCases, esanmiRegister,
  esanmiActions, esanmiSummary, EXPIRY_OFFSETS, RATIFY_OFFSETS, DECISIONS, AS_OF_ISO, q, yn, lst, orNull,
} from './riskchangeLab';
import {
  Tbl, Verdict, Note, Lead, Empty, DaySlider, MoveButton, safe, AXIS, TOOLTIP, GRID, DASH, MARGIN, LIME, SKY, AMBER,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Change explorer, the Professional tier throughout.
//
// A CHANGE IS A STATE MACHINE WITH TWO GATES AND A CLOCK. The stage view offers
// every move from the current stage and shows the engine's own sentence for each
// one it refuses. The approval view lets a reader sign, reject, delegate and add
// levels as a named person, so the segregation-of-duties refusals are one click
// away. The timeline view moves a temporary change's expiry and an emergency
// change's implementation across the as-of date.
//
// A DATE ON THIS PAGE IS AN OFFSET IN WHOLE DAYS. The sliders move a number of
// days from the as-of date; the lab turns that number into a calendar date with
// the engine's own calendar and asks the engine what state it reads. Nothing on
// this page holds a date or reads a clock.
//
// Every stage, verdict, state, date and count on this page is a return value of
// the vendored management of change engine through riskchangeLab.

export const MODES = [
  ['stages', 'The stage machine: legal moves and the refusal for every other one'],
  ['approvals', 'Approval rows: sign, reject, delegate and add a level as a named person'],
  ['gates', 'The two gates and the actions that block each'],
  ['timeline', 'Across the as-of date: expiry and the lead, ratification and its window'],
  ['register', 'The ESANMI register summarised and sorted by urgency'],
];

// ---------------------------------------------------------------------------

export const StagesMode = ({
  table, moves, stage, onStage,
}) => {
  if (!table || !Array.isArray(table.stages) || !Array.isArray(moves)) {
    return <Empty>The stage reader has returned nothing, so there is no machine to walk.</Empty>;
  }
  const legal = moves.filter((m) => m.legal);
  const refused = moves.filter((m) => !m.ok);
  return (
    <>
      <FieldGrid>
        <SelectField label="The change is in" value={stage} onChange={onStage} options={table.stages.map((s) => [s, s])} />
      </FieldGrid>
      <TileGrid>
        <Tile label="Legal next stages" value={lst(legal.map((m) => m.to))} />
        <Tile label="Active" value={yn(table.active.includes(stage))} />
        <Tile label="In effect" value={yn(table.inEffect.includes(stage))} />
        <Tile label="Terminal" value={yn(table.terminal.includes(stage))} />
      </TileGrid>
      <Lead>
        Each move is asked of the engine on a Permanent change with every approval level signed and no action open, so
        a legal move is allowed and every other move is refused in the engine&apos;s own words.
      </Lead>
      {moves.map((m) => <Verdict key={m.to} v={m} />)}
      <Note>
        {refused.length} of the {moves.length} other stages are refused from here. Only {lst(table.intoImplementation)}
        {' '}leads to Implementation, and {lst(table.leadNowhere)} lead nowhere.
      </Note>
      <Tbl head={['from', 'legal next stages']} rows={table.transitions.map((t) => [q(t.from), lst(t.next.map(q))])} />
    </>
  );
};

export const ApprovalsMode = ({
  view, people, actingAs, onActingAs, onDecide, onAdd, onReset, last, sets, segregation, addAs, onAddAs,
}) => {
  if (!view || !Array.isArray(view.rows) || !Array.isArray(people)) {
    return <Empty>The approval reader has returned nothing, so there are no rows to sign.</Empty>;
  }
  const personOptions = people.map((p) => [p.id, p.label]);
  return (
    <>
      <Lead>
        {view.moc.id}, {view.moc.title}, raised by {view.moc.originator}. Act as a named person and decide a row: the
        engine asks whether that person may, and a refusal changes nothing.
      </Lead>
      <FieldGrid>
        <SelectField label="Acting as" value={actingAs} onChange={onActingAs} options={personOptions} />
        <SelectField label="New level assigned to" value={addAs} onChange={onAddAs} options={personOptions} />
      </FieldGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">row</th>
              <th className="text-left pr-3">level</th>
              <th className="text-left pr-3">assigned to</th>
              <th className="text-left pr-3">status</th>
              <th className="text-left">decide</th>
            </tr>
          </thead>
          <tbody>
            {view.rows.map((r, idx) => (
              <tr key={r.id}>
                <td className="pr-3">{r.id}</td>
                <td className="pr-3">{orNull(r.level)}</td>
                <td className="pr-3">{r.approver}</td>
                <td className="pr-3">{q(r.status)}</td>
                <td>
                  {(Array.isArray(DECISIONS) ? DECISIONS : []).map(([d, label]) => (
                    <MoveButton key={d} onClick={() => onDecide && onDecide(idx, d)}>{label}</MoveButton>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <MoveButton tone="legal" onClick={() => onAdd && onAdd()}>add a level</MoveButton>
        <MoveButton onClick={() => onReset && onReset()}>back to the register</MoveButton>
      </div>
      <Verdict v={last} />
      <TileGrid>
        <Tile label="Levels" value={lst(view.levels)} />
        <Tile label="Outstanding" value={lst(view.outstanding)} />
        <Tile label="Rejected rows" value={view.rejectedRows} />
        <Tile label="Complete" value={yn(view.complete)} />
      </TileGrid>
      <Lead>And the gate into Implementation with these rows and every action finished:</Lead>
      <Verdict v={view.gate} />
      {Array.isArray(sets) && (
        <Tbl
          head={['approval set', 'levels', 'outstanding', 'rejected rows', 'complete']}
          rows={sets.map((s) => [s.label, lst(s.levels), lst(s.outstanding), s.rejectedRows, yn(s.complete)])}
        />
      )}
      {Array.isArray(segregation) && (
        <>
          <Lead>The segregation-of-duties verdicts on ES-01, each the engine&apos;s:</Lead>
          {segregation.map((v) => <Verdict key={v.label} v={v} />)}
        </>
      )}
    </>
  );
};

export const GatesMode = ({ probes, blockers }) => {
  if (!Array.isArray(probes) || !Array.isArray(blockers)) {
    return <Empty>The gate reader has returned nothing, so there are no gates to test.</Empty>;
  }
  return (
    <>
      {blockers.map((g) => (
        <div key={g.gate}>
          <Lead>
            The gate into {g.gate}, from {g.from}, asked with one open action of each type:
          </Lead>
          <Tbl
            head={['one open action of type', 'blocks the gate', 'the engine says']}
            rows={g.rows.map((r) => [q(r.actionType), yn(r.blocks), r.reason || 'allowed'])}
          />
        </div>
      ))}
      <Lead>The two gates on the ESANMI changes, each verdict the engine&apos;s:</Lead>
      {probes.map((v) => <Verdict key={v.label} v={v} />)}
    </>
  );
};

export const TimelineMode = ({
  rules, exp, expRows, lead, expOffset, onExpOffset, rat, ratRows, win, ratDays, onRatDays, cases, types,
}) => {
  if (!rules || !Array.isArray(rules.states) || !exp || !rat || !Array.isArray(expRows) || !Array.isArray(ratRows) || !lead || typeof lead.first !== 'number' || !win || typeof win.lastInside !== 'number') {
    return <Empty>The timeline reader has returned nothing, so there is no date to move.</Empty>;
  }
  const lo = Math.min(...EXPIRY_OFFSETS);
  const hi = Math.max(...EXPIRY_OFFSETS);
  const rlo = Math.min(...RATIFY_OFFSETS);
  const rhi = Math.max(...RATIFY_OFFSETS);
  return (
    <>
      <Lead>
        One Temporary change in Implementation. Drag its expiry across the as-of date, {AS_OF_ISO}. The lead is
        {' '}{rules.leadDays} days counted inclusively, drawn as the band from day {lead.first} to day {lead.last}: every
        one of those {lead.days} days reads {q(lead.state)}.
      </Lead>
      <DaySlider label={`Expiry, days from the as-of date: ${exp.offset}`} value={exp.offset} min={lo} max={hi} onChange={onExpOffset} />
      <TileGrid>
        <Tile label="Expiry date" value={exp.expiryDate} />
        <Tile label="Days until" value={exp.days} />
        <Tile label="Expiry state" value={q(exp.state)} />
        <Tile label="Counted expired" value={yn(exp.countedExpired)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={expRows} margin={MARGIN}>
            <CartesianGrid stroke={GRID} strokeDasharray={DASH} />
            <XAxis dataKey="offset" type="number" domain={[lo, hi]} tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v, n, p) => [`${v} days, ${p.payload.state}`, 'days until expiry']} />
            <ReferenceArea x1={lead.first} x2={lead.last} fill={AMBER} fillOpacity={0.2} />
            <ReferenceLine x={exp.offset} stroke={LIME} />
            <Line dataKey="days" name="days until expiry" stroke={SKY} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl head={['expiry states the engine carries']} rows={rules.states.map((s) => [q(s)])} />
      {types && Array.isArray(types.rows) && (
        <>
          <Lead>The same expiry, {types.expiryDate}, one day past, across types and stages:</Lead>
          <Tbl
            head={['type', 'stage', 'expiry state', 'counted expired']}
            rows={types.rows.map((r) => [q(r.type), q(r.stage), q(r.state), yn(r.countedExpired)])}
          />
          <Note>An expiry that cannot be read is no expiry: {q(types.unreadable)}.</Note>
        </>
      )}
      <Lead>
        One Emergency change in Implementation with level {lst(rat.outstanding)} unsigned. Drag its implementation date back from the as-of
        date. Every other level must sign within {win.ratifyDays} days: day {win.lastInside} is inside the window and
        day {win.firstOutside} is outside it.
      </Lead>
      <DaySlider label={`Implemented this many days before the as-of date: ${rat.daysSince}`} value={rat.daysSince} min={rlo} max={rhi} onChange={onRatDays} />
      <TileGrid>
        <Tile label="Implemented on" value={rat.implementedOn} />
        <Tile label="Ratification due" value={orNull(rat.dueDate)} />
        <Tile label="Days to due" value={orNull(rat.daysToDue)} />
        <Tile label="Ratification state" value={q(rat.state)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ratRows} margin={MARGIN}>
            <CartesianGrid stroke={GRID} strokeDasharray={DASH} />
            <XAxis dataKey="daysSince" type="number" domain={[rlo, rhi]} tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v, n, p) => [`${v} days, ${p.payload.state}`, 'days to ratification due']} />
            <ReferenceArea x1={rlo} x2={win.lastInside} fill={AMBER} fillOpacity={0.2} />
            <ReferenceLine x={rat.daysSince} stroke={LIME} />
            <Line dataKey="daysToDue" name="days to ratification due" stroke={SKY} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {cases && Array.isArray(cases.probes) && (
        <>
          {cases.probes.map((v) => <Verdict key={v.label} v={v} />)}
          <Note>
            With no implementation date recorded the due date is {orNull(cases.noDate.dueDate)} and the state is
            {' '}{q(cases.noDate.state)}: the window cannot be shown to be open. Every level signed reads
            {' '}{q(cases.allSigned)}, and a Temporary change reads {q(cases.temporary)}.
          </Note>
        </>
      )}
    </>
  );
};

export const RegisterMode = ({ reg, sum, actions }) => {
  if (!Array.isArray(reg) || !sum || !Array.isArray(sum.counts)) {
    return <Empty>The register reader has returned nothing, so there is nothing to summarise.</Empty>;
  }
  return (
    <>
      <Tbl
        head={['change', 'type', 'stage', 'target', 'expiry', 'expiry state', 'overdue', 'ratification', 'due']}
        rows={reg.map((r) => [r.id, q(r.type), q(r.stage), r.target, orNull(r.expiry), q(r.expiryState), yn(r.overdue), q(r.ratification), orNull(r.due)])}
      />
      {Array.isArray(actions) && (
        <Tbl head={['action', 'change', 'type', 'status', 'due']} rows={actions.map((a) => [a.id, a.change, q(a.type), q(a.status), a.due])} />
      )}
      <Tbl head={['count', 'value']} rows={sum.counts.map((c) => [c.key, c.value])} />
      <Note>
        By stage: {sum.byStage.map((s) => `${q(s.stage)} ${s.count}`).join(', ')}. Most urgent first on {AS_OF_ISO}:
        {' '}{lst(sum.urgency)}.
      </Note>
    </>
  );
};

// ---------------------------------------------------------------------------

const ChangeExplorer = ({ initialMode = 'stages' }) => {
  const [mode, setMode] = useState(initialMode);
  const table = useMemo(() => safe(stageTable), []);
  const [stage, setStage] = useState(() => (table && table.stages ? table.stages[0] : ''));
  const people = useMemo(() => safe(approvalPeople), []);
  const [rows, setRows] = useState(() => safe(approvalStart) || []);
  const [actingAs, setActingAs] = useState(() => (people && people[0] ? people[0].id : ''));
  const [addAs, setAddAs] = useState(() => (people && people[0] ? people[0].id : ''));
  const [last, setLast] = useState(null);
  const [expOffset, setExpOffset] = useState(() => (EXPIRY_OFFSETS.includes(0) ? 0 : EXPIRY_OFFSETS[0]));
  const [ratDays, setRatDays] = useState(() => (RATIFY_OFFSETS.includes(0) ? 0 : RATIFY_OFFSETS[0]));

  const moves = useMemo(() => (mode === 'stages' ? safe(() => stageMovesFrom(stage)) : null), [mode, stage]);
  const view = useMemo(() => (mode === 'approvals' ? safe(() => approvalView(rows)) : null), [mode, rows]);
  const sets = useMemo(() => (mode === 'approvals' ? safe(approvalSets) : null), [mode]);
  const segregation = useMemo(() => (mode === 'approvals' ? safe(segregationProbes) : null), [mode]);
  const probes = useMemo(() => (mode === 'gates' ? safe(gateProbes) : null), [mode]);
  const blockers = useMemo(() => (mode === 'gates' ? safe(gateBlockers) : null), [mode]);
  const rules = useMemo(() => (mode === 'timeline' ? safe(expiryRules) : null), [mode]);
  const exp = useMemo(() => (mode === 'timeline' ? safe(() => expiryAt(expOffset)) : null), [mode, expOffset]);
  const expRows = useMemo(() => (mode === 'timeline' ? safe(expiryTimeline) : null), [mode]);
  const lead = useMemo(() => (mode === 'timeline' ? safe(expiryLead) : null), [mode]);
  const types = useMemo(() => (mode === 'timeline' ? safe(expiryAcrossTypes) : null), [mode]);
  const rat = useMemo(() => (mode === 'timeline' ? safe(() => ratificationAt(ratDays)) : null), [mode, ratDays]);
  const ratRows = useMemo(() => (mode === 'timeline' ? safe(ratificationTimeline) : null), [mode]);
  const win = useMemo(() => (mode === 'timeline' ? safe(ratificationWindow) : null), [mode]);
  const cases = useMemo(() => (mode === 'timeline' ? safe(ratificationCases) : null), [mode]);
  const reg = useMemo(() => (mode === 'register' ? safe(esanmiRegister) : null), [mode]);
  const sum = useMemo(() => (mode === 'register' ? safe(esanmiSummary) : null), [mode]);
  const actions = useMemo(() => (mode === 'register' ? safe(esanmiActions) : null), [mode]);

  const onDecide = (idx, decision) => {
    const r = safe(() => decideApproval(rows, idx, decision, actingAs));
    if (!r) return;
    setLast(r);
    setRows(r.rows);
  };
  const onAdd = () => {
    const r = safe(() => addApprovalLevel(rows, addAs));
    if (!r) return;
    setLast(r);
    setRows(r.rows);
  };
  const onReset = () => {
    setRows(safe(approvalStart) || []);
    setLast(null);
  };

  return (
    <PanelShell
      title="Change explorer"
      subtitle={`The ESANMI change register: the stage machine and its refusals, approval rows decided by named people, the two gates, and temporary and emergency changes moved across the as-of date ${AS_OF_ISO}.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'stages' && <StagesMode table={table} moves={moves} stage={stage} onStage={setStage} />}
        {mode === 'approvals' && (
          <ApprovalsMode
            view={view}
            people={people}
            actingAs={actingAs}
            onActingAs={setActingAs}
            addAs={addAs}
            onAddAs={setAddAs}
            onDecide={onDecide}
            onAdd={onAdd}
            onReset={onReset}
            last={last}
            sets={sets}
            segregation={segregation}
          />
        )}
        {mode === 'gates' && <GatesMode probes={probes} blockers={blockers} />}
        {mode === 'timeline' && (
          <TimelineMode
            rules={rules}
            exp={exp}
            expRows={expRows}
            lead={lead}
            expOffset={expOffset}
            onExpOffset={setExpOffset}
            rat={rat}
            ratRows={ratRows}
            win={win}
            ratDays={ratDays}
            onRatDays={setRatDays}
            cases={cases}
            types={types}
          />
        )}
        {mode === 'register' && <RegisterMode reg={reg} sum={sum} actions={actions} />}
      </div>
      <Note>
        Every stage, verdict, state, date and count on this page is a return value of the vendored management of change
        engine through the teaching lab. Every refusal shown is the engine&apos;s own sentence, and every date is a
        whole number of days from the as-of date turned into a calendar date by the engine&apos;s own calendar.
      </Note>
    </PanelShell>
  );
};

export default ChangeExplorer;
