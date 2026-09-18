import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  ABAM_DECISIONS, ABAM_REMOVALS, asOfAt, initialPoints, planAt, requestDecision, requestRemoval, planClosureOf,
  planClosureWalk, ncrClosureWalk, ncrsAt, ageBandEdges, checklistAt, auditWalk, programmeAt, vocabulary,
} from './complianceLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, Status, txt, Tbl, Verdict, Note, Lead, Empty, safe, AsOfSlider, Stepper, Button,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Plan explorer, the Professional tier throughout.
//
// A REQUEST IS AN ACTION, AND THE ENGINE'S GATE IS ASKED FIRST. Every decision,
// waiver, setting aside and removal on the ABAM inspection and test plan goes
// through the lab's requestDecision or requestRemoval, which ask the vendored
// qualityAssurance gate before anything changes. A refused request hands back
// the same points it was given, so the cards and the progress do not move, and
// the engine's own reason is shown. That is the mechanism of this tier.
//
// PROGRESS IS COUNTED FROM THE CARDS. The percent is planProgress over the cards
// on screen, recounted by the engine after every allowed request.
//
// Every value here is a return of the vendored qualityAssurance and
// auditManagement modules through the teaching lab, at the as-of date shown.
// Nothing here constructs a date or reads the time.

export const MODES = [
  ['plan', 'The ABAM plan as cards, and every request through the engine gate'],
  ['closure', 'The closure walks: the plan and a Major NCR, one requirement at a time'],
  ['ageing', 'NCR ageing by band and severity at the as-of date'],
  ['checklist', 'The ABAM checklist, the audit report walk and independence'],
  ['programme', 'The audit programme: delivered against outstanding'],
];

// ---------------------------------------------------------------------------

export const PlanMode = ({ plan, onRequest, onRemove, onReset, last, closure, ncrsClosed, onNcrsClosed }) => {
  if (!plan || !Array.isArray(plan.cards)) return <Empty>The plan reader has returned nothing, so there are no cards to show.</Empty>;
  return (
    <>
      <TileGrid>
        <Tile label="Points" value={txt(plan.progress.total)} />
        <Tile label="Resolved" value={txt(plan.progress.resolved)} />
        <Tile label="Progress, counted by the engine" value={`${txt(plan.progress.percent)} percent`} />
        <Tile label="Hold points outstanding" value={txt(plan.progress.holdPointsOutstanding)} />
      </TileGrid>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mt-3">
        {plan.cards.map((c) => (
          <div key={c.id} className={`rounded-md border p-2 ${c.stopsWork ? 'border-amber-700/60' : 'border-slate-700'} bg-[#0F172A]`}>
            <p className="text-xs text-slate-500 mb-0">{c.item}, {c.type}{c.stopsWork ? ', stops work' : ''}</p>
            <p className="text-sm text-white mb-0">{c.title}</p>
            <p className="text-xs mb-0">
              <Status word={c.status} />
              {c.resolved ? <span className="text-slate-400">, resolved</span> : null}
              {c.overdue ? <span className="text-red-300">, overdue</span> : null}
            </p>
            <p className="text-[11px] text-slate-500 mb-0">planned {c.planned}</p>
          </div>
        ))}
      </div>
      <Lead>Requests. Each one is asked of the engine first; a refused request changes nothing on the cards.</Lead>
      <div className="flex flex-wrap gap-2 mt-2">
        {ABAM_DECISIONS.map((d, i) => (
          <Button key={d.label} onClick={() => onRequest(i)}>{d.label}</Button>
        ))}
        {ABAM_REMOVALS.filter((r) => r.plan === 'Active').map((r) => (
          <Button key={r.label} onClick={() => onRemove(r)}>{`Remove ${r.label}`}</Button>
        ))}
        <Button onClick={onReset}>Put the plan back as recorded</Button>
      </div>
      <Verdict v={last} />
      <Lead>Whether the plan may close over the cards as they stand now:</Lead>
      <div className="flex gap-2 mt-2">
        <Button active={!ncrsClosed} onClick={() => onNcrsClosed(false)}>NCRs as recorded</Button>
        <Button active={ncrsClosed} onClick={() => onNcrsClosed(true)}>Every NCR closed or voided</Button>
      </div>
      <Verdict v={closure} />
      <Note>
        Overdue at the as-of date: {txt(plan.overdueItems)}. Hold points: {plan.holds.map((h) => `${h.item} ${h.status}`).join(', ')}.
      </Note>
    </>
  );
};

export const ClosureMode = ({ walk, ncrWalk, planAt: planStep, onPlanStep, ncrStep, onNcrStep }) => {
  if (!walk || !ncrWalk || !Array.isArray(walk.steps) || !Array.isArray(ncrWalk.major)) return <Empty>The closure readers have returned nothing, so there is no walk to show.</Empty>;
  return (
    <>
      <Stepper title="canClosePlan on QAP-2026-014" steps={walk.steps} at={planStep} onAt={onPlanStep} />
      {planStep >= walk.steps.length - 1 && (
        <Note>
          At that point the engine counts {walk.atTheEnd.resolved} of {walk.atTheEnd.total} resolved,
          {' '}{walk.atTheEnd.percent} percent, with {txt(walk.atTheEnd.stillOpen)} still open.
        </Note>
      )}
      <Stepper title="canCloseNcr on a Major NCR" steps={ncrWalk.major} at={ncrStep} onAt={onNcrStep} />
      <Lead>The same last steps on a Minor NCR:</Lead>
      {ncrWalk.minor.map((v) => <Verdict key={v.label} v={v} />)}
      <Lead>Raising an NCR against the plan, and the plan workflow:</Lead>
      {walk.raise.map((v) => <Verdict key={v.label} v={v} />)}
      <Tbl head={['from', 'may move to']} rows={walk.workflow.map((w) => [w.status, w.next.length ? w.next.join(', ') : 'final'])} />
      <Verdict v={walk.draftToClosed} />
    </>
  );
};

export const AgeingMode = ({ ncr, edges }) => {
  if (!ncr || !Array.isArray(ncr.rows)) return <Empty>The NCR reader has returned nothing, so there is no ageing to draw.</Empty>;
  const sev = safe(vocabulary);
  const severities = sev ? sev.ncrSeverities : [];
  return (
    <>
      <TileGrid>
        <Tile label="Open NCRs" value={txt(ncr.summary.open)} />
        <Tile label="Overdue" value={txt(ncr.summary.overdue)} />
        <Tile label="Oldest open, days" value={txt(ncr.summary.oldestOpen)} />
        <Tile label="Mean open age, days" value={txt(ncr.summary.meanOpen)} />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ncr.ageing} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="band" tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {severities.map((s, i) => <Bar key={s} dataKey={s} stackId="a" fill={SERIES[i % SERIES.length]} isAnimationActive={false} />)}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>Open NCRs only, counted by ncrAgeing at the as-of date. A closed or voided NCR stops ageing at its closed date.</Note>
      <Tbl
        head={['code', 'severity', 'status', 'raised', 'closed', 'age, days', 'band', 'open', 'overdue']}
        rows={ncr.rows.map((r) => [r.code, r.severity, r.status, r.raised, txt(r.closed), txt(r.age), txt(r.band), txt(r.open), txt(r.overdue)])}
      />
      <Note>The open ages the mean is taken over: {txt(ncr.openAges)}.</Note>
      <Tbl
        head={['action', 'NCR', 'type', 'status', 'due', 'open', 'overdue', 'verified effective', 'found ineffective']}
        rows={ncr.capas.map((k) => [k.id, k.ncr, k.type, k.status, k.due, txt(k.open), txt(k.overdue), txt(k.verified), txt(k.ineffective)])}
      />
      <Lead>Whether each NCR may close on its own record:</Lead>
      {ncr.rows.map((r) => <Verdict key={r.code} v={r.closure} />)}
      {Array.isArray(edges) && (
        <Tbl head={['age in days', 'band']} rows={edges.map((e) => [e.days, e.band === null ? 'null' : e.band])} />
      )}
    </>
  );
};

export const ChecklistMode = ({ chk, walk }) => {
  if (!chk || !Array.isArray(chk.rows)) return <Empty>The checklist reader has returned nothing, so there are no answers to show.</Empty>;
  return (
    <>
      <TileGrid>
        <Tile label="Questions" value={txt(chk.progress.total)} />
        <Tile label="Answered" value={txt(chk.progress.answered)} />
        <Tile label="Checklist progress" value={`${txt(chk.progress.percent)} percent`} />
        <Tile label="Critical items with no finding" value={txt(chk.criticalWithoutFinding)} />
      </TileGrid>
      <Tbl
        head={['item', 'question', 'criticality', 'result', 'note', 'answered']}
        rows={chk.rows.map((r) => [r.item, r.question, r.criticality, r.result, r.note, txt(r.answered)])}
      />
      <Note>
        Unanswered items: {txt(chk.unanswered)}. A Not applicable answer with no reason is not an answer. With finding
        {' '}{chk.findingCode} voided, the critical items with no finding are {txt(chk.criticalWithoutFindingIfVoided)}.
      </Note>
      <Lead>Raising a finding:</Lead>
      {chk.raise.map((v) => <Verdict key={v.label} v={v} />)}
      {walk && Array.isArray(walk.report) && (
        <>
          <Lead>Reporting the audit, one requirement met at a time:</Lead>
          {walk.report.map((v) => <Verdict key={v.label} v={v} />)}
          <Lead>Closing it, cancelling it, and who may lead it:</Lead>
          {walk.close.map((v) => <Verdict key={v.label} v={v} />)}
          {walk.cancel.map((v) => <Verdict key={v.label} v={v} />)}
          {walk.independence.map((v) => <Verdict key={v.label} v={v} />)}
          <Tbl head={['audit status', 'overdue once its planned end has passed']} rows={walk.overdueByStatus.map((o) => [o.status, txt(o.overdue)])} />
        </>
      )}
    </>
  );
};

export const ProgrammeMode = ({ prog }) => {
  if (!prog || !Array.isArray(prog.rows)) return <Empty>The programme reader has returned nothing, so there is nothing delivered to show.</Empty>;
  return (
    <>
      <TileGrid>
        <Tile label="Audits in the programme" value={txt(prog.progress.total)} />
        <Tile label="Reported" value={txt(prog.progress.reported)} />
        <Tile label="Delivered" value={`${txt(prog.progress.percent)} percent`} />
        <Tile label="Outstanding" value={txt(prog.progress.outstanding)} />
      </TileGrid>
      <Note>
        Delivered counts reported audits only. Cancelled {txt(prog.progress.cancelled)}, overdue {txt(prog.progress.overdue)} at
        {' '}{prog.asOf}.
      </Note>
      <Tbl head={['code', 'status', 'planned end', 'overdue']} rows={prog.rows.map((r) => [r.code, r.status, r.plannedEnd, txt(r.overdue)])} />
      <Lead>Completing the programme:</Lead>
      {prog.complete.map((v) => <Verdict key={v.label} v={v} />)}
      <Lead>Approving it:</Lead>
      {prog.approve.map((v) => <Verdict key={v.label} v={v} />)}
      <Tbl head={['from', 'may move to']} rows={prog.workflow.map((w) => [w.status, w.next.length ? w.next.join(', ') : 'final'])} />
    </>
  );
};

// ---------------------------------------------------------------------------

const PlanExplorer = ({ initialMode = 'plan' }) => {
  const [mode, setMode] = useState(initialMode);
  const [offset, setOffset] = useState(0);
  const [points, setPoints] = useState(() => safe(initialPoints) || []);
  const [last, setLast] = useState(null);
  const [ncrsClosed, setNcrsClosed] = useState(false);
  const [planStep, setPlanStep] = useState(0);
  const [ncrStep, setNcrStep] = useState(0);
  const asOf = useMemo(() => safe(() => asOfAt(offset)), [offset]);

  const plan = useMemo(() => (mode === 'plan' ? safe(() => planAt(points, asOf)) : null), [mode, points, asOf]);
  const closure = useMemo(() => (mode === 'plan' ? safe(() => planClosureOf(points, ncrsClosed)) : null), [mode, points, ncrsClosed]);
  const walk = useMemo(() => (mode === 'closure' ? safe(planClosureWalk) : null), [mode]);
  const ncrWalk = useMemo(() => (mode === 'closure' ? safe(ncrClosureWalk) : null), [mode]);
  const ncr = useMemo(() => (mode === 'ageing' ? safe(() => ncrsAt(asOf)) : null), [mode, asOf]);
  const edges = useMemo(() => (mode === 'ageing' ? safe(ageBandEdges) : null), [mode]);
  const chk = useMemo(() => (mode === 'checklist' ? safe(checklistAt) : null), [mode]);
  const aw = useMemo(() => (mode === 'checklist' ? safe(() => auditWalk(asOf)) : null), [mode, asOf]);
  const prog = useMemo(() => (mode === 'programme' ? safe(() => programmeAt(asOf)) : null), [mode, asOf]);

  const onRequest = (i) => {
    const d = ABAM_DECISIONS[i];
    const res = safe(() => requestDecision(points, d.item, d.status, d.patch));
    if (!res) return;
    setLast({ label: d.label, ok: res.ok, reason: res.reason });
    setPoints(res.points);
  };
  const onRemove = (r) => {
    const res = safe(() => requestRemoval(points, r.item, r.plan));
    if (!res) return;
    setLast({ label: `remove ${r.label}`, ok: res.ok, reason: res.reason });
    setPoints(res.points);
  };
  const onReset = () => {
    setPoints(safe(initialPoints) || []);
    setLast(null);
  };

  return (
    <PanelShell
      title="Plan explorer"
      subtitle="The ABAM flowline tie-in: its inspection and test plan as cards, its non-conformances, its contractor HSE audit and the audit programme. Every request is asked of the engine before anything moves."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <AsOfSlider offset={offset} onChange={setOffset} />
      <div className="mt-3">
        {mode === 'plan' && (
          <PlanMode
            plan={plan}
            onRequest={onRequest}
            onRemove={onRemove}
            onReset={onReset}
            last={last}
            closure={closure}
            ncrsClosed={ncrsClosed}
            onNcrsClosed={setNcrsClosed}
          />
        )}
        {mode === 'closure' && <ClosureMode walk={walk} ncrWalk={ncrWalk} planAt={planStep} onPlanStep={setPlanStep} ncrStep={ncrStep} onNcrStep={setNcrStep} />}
        {mode === 'ageing' && <AgeingMode ncr={ncr} edges={edges} />}
        {mode === 'checklist' && <ChecklistMode chk={chk} walk={aw} />}
        {mode === 'programme' && <ProgrammeMode prog={prog} />}
      </div>
      <Note>
        Every status, age, percent and verdict on this page is a return value of the vendored qualityAssurance and
        auditManagement modules through the teaching lab. Every refusal is the engine&apos;s own sentence.
      </Note>
    </PanelShell>
  );
};

export default PlanExplorer;
