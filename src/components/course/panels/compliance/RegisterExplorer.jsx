import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea,
} from 'recharts';
import {
  AS_OF_YMD, IKORO_OBLIGATIONS, asOfAt, vocabulary, calendarAt, unreadableTodayContract, registerAt, precedenceAt,
  statusTimeline, leadTimeAt, leadTimeCurve, periodAt, rollAt, libraryAt, reviewDatesAt, documentRules,
} from './complianceLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, Status, txt, Tbl, Verdict, Note, Lead, Empty, safe, Slider, AsOfSlider,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Register explorer, the Associate tier throughout.
//
// NOTHING ON THIS PAGE IS TYPED AS A STATUS. Every status, reason, day count,
// next action date and review state is a return value of the vendored
// complianceStatus and documentControl modules through the teaching lab, read
// against the as-of date the learner moves. At the digest's own date every row
// matches the teaching digest, and the lab test pins that.
//
// THE REASON COMES WITH THE STATUS. explainStatus hands back a sentence beside
// every status, the filed One-off included, and this page prints it beside the
// status every time rather than leaving the word to speak for itself.
//
// NO CLOCK. The as-of control hands the lab a whole number of days and the lab
// builds the date. Nothing here constructs a date or reads the time.

export const MODES = [
  ['calendar', 'The calendar: a date is a day, and an unreadable date is no date'],
  ['register', 'The IKORO register read at the as-of date, with the reason beside every status'],
  ['lead', 'The lead time on the flare return, and the edge where Due soon starts'],
  ['period', 'The current period, and whether the last filing falls inside it'],
  ['roll', 'Recording a filing: the next due date rolled from the date that was due'],
  ['library', 'The document library: review states, and the review date earned at issue'],
];

const OFFSET_LABEL = 'days from the as-of date';

// ---------------------------------------------------------------------------

export const CalendarMode = ({ cal, contract, vocab }) => {
  if (!cal || !Array.isArray(cal.rows)) return <Empty>The calendar reader has returned nothing, so there is no date to show.</Empty>;
  return (
    <>
      <Lead>
        parseDateOnly reads the leading YYYY-MM-DD of a string at local midnight and refuses a day that does not exist.
        daysUntil counts whole days from the as-of date, {txt(cal.asOf)}, to it.
      </Lead>
      <Tbl
        head={['input', 'parsed', 'days until']}
        rows={cal.rows.map((r) => [r.input === '' ? '(empty)' : r.input, r.parsed === null ? 'null' : r.parsed, txt(r.daysUntil)])}
      />
      <Note>The as-of date read against itself: {txt(cal.asOfItself)} days.</Note>
      {contract && typeof contract.deriveStatus === 'string' && (
        <>
          <Lead>
            What the modules do with an unreadable today. No caller should pass one, and this lab never does except to
            show these rows.
          </Lead>
          <Tbl
            head={['call', 'what the engine does']}
            rows={[
              ['complianceStatus.deriveStatus with an unreadable today', txt(contract.deriveStatus)],
              ['documentControl.reviewState of a review due 2020-01-06, unreadable today', txt(contract.reviewState)],
              ['qualityAssurance.isNcrOverdue of an NCR due 2020-01-06, unreadable today', txt(contract.isNcrOverdue)],
              [`documentControl.reviewState with today passed as the string ${AS_OF_YMD}`, txt(contract.reviewStateWithAString)],
            ]}
          />
          <Note>
            Only deriveStatus refuses an unreadable today. The other two answer as though nothing were due, which is a
            held limit this course teaches and does not grade.
          </Note>
        </>
      )}
      {vocab && Array.isArray(vocab.statusSeverity) && (
        <>
          <Lead>The nine statuses, worst first, as the engine orders them:</Lead>
          <Note>{vocab.statusSeverity.join(', ')}</Note>
        </>
      )}
    </>
  );
};

export const RegisterMode = ({ reg, prec, timeline, pick, onPick }) => {
  if (!reg || !Array.isArray(reg.rows)) return <Empty>The register reader has returned nothing, so there is no status to show.</Empty>;
  const chart = timeline && Array.isArray(timeline.points)
    ? timeline.points.map((p) => ({ offset: p.offset, rank: p.rank, status: p.status, date: p.date }))
    : [];
  const vocab = safe(vocabulary);
  const ranks = vocab ? vocab.statusSeverity : [];
  const current = chart.find((p) => p.date === reg.asOf);
  return (
    <>
      <TileGrid>
        <Tile label="As-of date" value={txt(reg.asOf)} />
        <Tile label="Obligations" value={txt(reg.total)} />
        <Tile label="Needing attention" value={txt(reg.attention)} />
        <Tile label="Worst first" value={txt(reg.byUrgency[0] && reg.byUrgency[0].code)} />
      </TileGrid>
      <Tbl
        head={['code', 'obligation', 'lifecycle', 'due', 'expiry', 'next action', 'days until', 'status', 'reason']}
        rows={reg.rows.map((r) => [
          r.code, r.title, r.lifecycle, txt(r.due), txt(r.expiry),
          `${txt(r.nextAction)}${r.nextActionIsExpiryDerived ? ' (the expiry)' : ''}`,
          txt(r.daysUntil), <Status key="s" word={r.status} />, r.reason,
        ])}
      />
      <Note>The next action date is the earlier of the due date and the expiry date, and it is marked when the expiry is the earlier one.</Note>
      <Lead>Counted by status, and sorted worst first:</Lead>
      <Tbl head={['status', 'count']} rows={reg.byStatus.map((s) => [<Status key="s" word={s.status} />, txt(s.count)])} />
      <Tbl head={['order', 'code', 'status', 'next action']} rows={reg.byUrgency.map((u) => [u.order, u.code, <Status key="s" word={u.status} />, txt(u.nextAction)])} />
      <Lead>
        One obligation read across the window. Each point is a separate engine call at its own as-of date, and each
        vertical line is a day where the status the engine returns changes.
      </Lead>
      <FieldGrid>
        <SelectField
          label="Obligation"
          value={pick}
          onChange={onPick}
          options={IKORO_OBLIGATIONS.map((o) => [o.id, `${o.code} ${o.title}`])}
        />
      </FieldGrid>
      {chart.length > 0 ? (
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="offset" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: OFFSET_LABEL, fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
              <YAxis dataKey="rank" reversed tick={AXIS} allowDecimals={false} tickFormatter={(v) => ranks[v] || ''} width={90} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v, n, p) => [p && p.payload ? `${p.payload.status} on ${p.payload.date}` : v, 'status']} />
              <Line type="stepAfter" dataKey="rank" stroke={SERIES[0]} dot={false} isAnimationActive={false} />
              {timeline.edgesDerived.map((e) => (
                <ReferenceLine key={e.offset} x={e.offset} stroke={SERIES[3]} strokeDasharray="4 2" label={{ value: e.to, fill: '#fbbf24', fontSize: 10, position: 'top' }} />
              ))}
              {current && <ReferenceLine x={current.offset} stroke={SERIES[2]} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : <Empty>The timeline reader has returned nothing for this obligation.</Empty>}
      {timeline && Array.isArray(timeline.edgesDerived) && (
        <Tbl head={['day', 'date', 'from', 'to']} rows={timeline.edgesDerived.map((e) => [e.offset, e.date, <Status key="a" word={e.from} />, <Status key="b" word={e.to} />])} />
      )}
      {Array.isArray(prec) && (
        <>
          <Lead>The precedence, REG-2026-005 varied one field at a time:</Lead>
          <Tbl head={['variant', 'status', 'days until']} rows={prec.map((p) => [p.label, <Status key="s" word={p.status} />, txt(p.daysUntil)])} />
        </>
      )}
    </>
  );
};

export const LeadMode = ({ sweep, curve, lead, onLead }) => {
  if (!sweep || !Array.isArray(sweep.rows) || !curve || !Array.isArray(curve.curve)) return <Empty>The lead time reader has returned nothing, so there is no edge to draw.</Empty>;
  return (
    <>
      <Lead>
        {sweep.code}, the quarterly flare and venting return, is due {sweep.due}, which is {txt(sweep.daysUntil)} days
        after the as-of date. Its recorded lead time is {txt(sweep.recorded)}. Move the lead time and read the status.
      </Lead>
      <FieldGrid>
        <Slider label="lead_time_days" value={lead} min={0} max={curve.curve.length - 1} onChange={onLead} />
      </FieldGrid>
      <TileGrid>
        <Tile label="Lead time given" value={txt(curve.lead)} />
        <Tile label="Status" value={<Status word={curve.status} />} />
        <Tile label="Days until due" value={txt(curve.daysUntil)} />
        <Tile label="Due soon from a lead time of" value={txt(curve.edgeDerived)} />
      </TileGrid>
      <Note>{curve.reason}</Note>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve.curve} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="lead" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: 'lead time in days', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis dataKey="rank" reversed tick={AXIS} allowDecimals={false} width={40} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v, n, p) => [p && p.payload ? p.payload.status : v, 'status']} />
            <Line type="stepAfter" dataKey="rank" stroke={SERIES[0]} dot={false} isAnimationActive={false} />
            {curve.edgeDerived !== null && <ReferenceLine x={curve.edgeDerived} stroke={SERIES[3]} strokeDasharray="4 2" label={{ value: 'Due soon starts', fill: '#fbbf24', fontSize: 10, position: 'top' }} />}
            <ReferenceLine x={curve.lead} stroke={SERIES[2]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Note>The edge is where the status the engine returns first differs from its status at a lead time of zero.</Note>
      <Lead>The sweep the lessons quote, including the lead times the engine cannot use:</Lead>
      <Tbl head={['lead_time_days given', 'status']} rows={sweep.rows.map((r) => [r.given, <Status key="s" word={r.status} />])} />
      <Note>With no usable lead time the engine uses DEFAULT_LEAD_TIME_DAYS, {txt(sweep.defaultLeadTimeDays)}.</Note>
    </>
  );
};

export const PeriodMode = ({ per, pick, onPick }) => {
  if (!per || !Array.isArray(per.filings)) return <Empty>The period reader has returned nothing, so there is no period to draw.</Empty>;
  const f = per.filings.find((x) => x.code === pick) || per.filings[0];
  const marks = f ? [f.startDays, f.dueDays, f.filedDays, 0].filter((x) => x !== null && x !== undefined) : [];
  const lo = marks.length ? Math.min(...marks) : 0;
  const hi = marks.length ? Math.max(...marks) : 0;
  const pad = Math.max(10, Math.round((hi - lo) / 10));
  const axis = [{ x: lo - pad, y: 0 }, { x: hi + pad, y: 0 }];
  return (
    <>
      <FieldGrid>
        <SelectField label="Filing" value={f ? f.code : ''} onChange={onPick} options={per.filings.map((x) => [x.code, `${x.code} ${x.frequency}`])} />
      </FieldGrid>
      {f && (
        <>
          <TileGrid>
            <Tile label="Current period starts" value={txt(f.periodStart)} />
            <Tile label="and ends at the next due date" value={txt(f.due)} />
            <Tile label="Last filed" value={txt(f.lastFiled)} />
            <Tile label="Status" value={<Status word={f.status} />} />
          </TileGrid>
          <Note>{f.reason}</Note>
          <div className="h-32 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={axis} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: OFFSET_LABEL, fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
                <YAxis hide domain={[0, 1]} />
                <Line dataKey="y" stroke="transparent" dot={false} isAnimationActive={false} />
                {f.startDays !== null && <ReferenceArea x1={f.startDays} x2={f.dueDays} fill={SERIES[0]} fillOpacity={0.15} label={{ value: 'the current period', fill: '#94a3b8', fontSize: 10 }} />}
                {f.filedDays !== null && (
                  <ReferenceLine x={f.filedDays} stroke={f.filedInsideDerived ? SERIES[2] : SERIES[5]} label={{ value: f.filedInsideDerived ? 'filed inside' : 'filed outside', fill: '#e2e8f0', fontSize: 10, position: 'top' }} />
                )}
                <ReferenceLine x={0} stroke={SERIES[3]} strokeDasharray="4 2" label={{ value: 'as-of', fill: '#fbbf24', fontSize: 10, position: 'insideTopRight' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Note>
            The band runs from periodStart to the next due date. A filing inside it counts for this period, and a filing
            before it was for an earlier one.
          </Note>
        </>
      )}
      <Lead>periodStart for a due date of {per.periodDue}, by frequency:</Lead>
      <Tbl head={['frequency', 'periodStart', 'days until it']} rows={per.frequencies.map((r) => [r.frequency, txt(r.periodStart), txt(r.daysUntil)])} />
      <Tbl
        head={['code', 'frequency', 'due', 'periodStart', 'last filed', 'inside', 'status']}
        rows={per.filings.map((r) => [r.code, r.frequency, r.due, txt(r.periodStart), txt(r.lastFiled), txt(r.filedInsideDerived), <Status key="s" word={r.status} />])}
      />
      <Note>
        {per.oneDayLater.code} filed on {per.oneDayLater.filed}, the first day of its period, reads
        {' '}{per.oneDayLater.status}: {per.oneDayLater.reason}
      </Note>
    </>
  );
};

export const RollMode = ({ roll }) => {
  if (!roll || !roll.lateFiling) return <Empty>The roll-forward reader has returned nothing, so there is no schedule to draw.</Empty>;
  const lf = roll.lateFiling;
  const marks = [lf.dueDays, lf.filedDays, lf.fromDueDays, lf.fromFilingDays, 0];
  const axis = [{ x: Math.min(...marks) - 5, y: 0 }, { x: Math.max(...marks) + 5, y: 0 }];
  return (
    <>
      <Lead>
        {lf.code} was due {lf.due} and is filed on {lf.filed}. Recording the filing rolls the schedule forward from
        the date that was due.
      </Lead>
      <TileGrid>
        <Tile label="Next due date, rolled from the due date" value={txt(lf.fromDue)} />
        <Tile label="Rolled from the filing date instead" value={`${txt(lf.fromFilingNotUsed)} (the app does not use it)`} />
        <Tile label="Status after the filing" value={<Status word={lf.after.status} />} />
        <Tile label="Days to the next action" value={txt(lf.after.daysUntil)} />
      </TileGrid>
      <Note>{lf.after.reason}</Note>
      <div className="h-32 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={axis} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: OFFSET_LABEL, fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis hide domain={[0, 1]} />
            <Line dataKey="y" stroke="transparent" dot={false} isAnimationActive={false} />
            <ReferenceLine x={lf.dueDays} stroke={SERIES[5]} label={{ value: 'was due', fill: '#e2e8f0', fontSize: 10, position: 'top' }} />
            <ReferenceLine x={lf.filedDays} stroke={SERIES[1]} label={{ value: 'filed', fill: '#e2e8f0', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine x={lf.fromDueDays} stroke={SERIES[2]} label={{ value: 'next due, used', fill: '#BFFF00', fontSize: 10, position: 'top' }} />
            <ReferenceLine x={lf.fromFilingDays} stroke="#64748b" strokeDasharray="4 2" label={{ value: 'from the filing, unused', fill: '#94a3b8', fontSize: 10, position: 'insideTopRight' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Lead>rollForward from a due date of {roll.rollFrom}, by every frequency:</Lead>
      <Tbl head={['frequency', 'next due date', 'days until it']} rows={roll.byFrequency.map((r) => [r.frequency, txt(r.next), txt(r.daysUntil)])} />
      <Lead>Three month ends, pulled back to the last day of a shorter month:</Lead>
      <Tbl head={['due date', 'frequency', 'next due date']} rows={roll.monthEnds.map((r) => [r.due, r.frequency, txt(r.next)])} />
    </>
  );
};

export const LibraryMode = ({ lib, rev, rules }) => {
  if (!lib || !Array.isArray(lib.rows)) return <Empty>The library reader has returned nothing, so there is no review state to show.</Empty>;
  const c = rev && Array.isArray(rev.rows) ? rev.correction : null;
  const marks = c ? [c.issueDays, c.republishedDays, c.fromIssueDays, c.fromCorrectionDays, 0] : [];
  const axis = marks.length ? [{ x: Math.min(...marks) - 20, y: 0 }, { x: Math.max(...marks) + 20, y: 0 }] : [];
  return (
    <>
      <TileGrid>
        <Tile label="Documents" value={txt(lib.total)} />
        <Tile label="Published" value={txt(lib.published)} />
        <Tile label="Review overdue" value={txt(lib.overdue)} />
        <Tile label="Review due soon" value={txt(lib.dueSoon)} />
      </TileGrid>
      <Tbl
        head={['number', 'title', 'status', 'next review', 'days until', 'review state']}
        rows={lib.rows.map((r) => [r.number, r.title, r.status, txt(r.nextReview), txt(r.daysUntil), <Status key="s" word={r.reviewState} />])}
      />
      <Note>reviewState reads only documents in force. A published document whose review date is the text tbc reads {lib.tbc}.</Note>
      <Tbl head={['order', 'number', 'review state', 'next review']} rows={lib.byReviewUrgency.map((u) => [u.order, u.number, <Status key="s" word={u.reviewState} />, txt(u.nextReview)])} />
      {rev && Array.isArray(rev.rows) && rev.correction && (
        <>
          <Lead>nextReviewDate counts from the ISSUE date by the review period in months:</Lead>
          <Tbl head={['issue date', 'period in months', 'next review date', 'days until it']} rows={rev.rows.map((r) => [r.issue, r.months, txt(r.next), txt(r.daysUntil)])} />
          <Lead>
            A correction re-published on {c.republished} to a document issued {c.issue}, on a {c.months} month period.
            The review date is earned at issue: {c.fromIssue}. Counting from the correction would give
            {' '}{c.fromCorrectionNotUsed}, which the engine does not use.
          </Lead>
          <div className="h-32 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={axis} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: OFFSET_LABEL, fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
                <YAxis hide domain={[0, 1]} />
                <Line dataKey="y" stroke="transparent" dot={false} isAnimationActive={false} />
                <ReferenceLine x={c.issueDays} stroke={SERIES[0]} label={{ value: 'issued', fill: '#e2e8f0', fontSize: 10, position: 'top' }} />
                <ReferenceLine x={c.republishedDays} stroke={SERIES[1]} label={{ value: 'correction', fill: '#e2e8f0', fontSize: 10, position: 'insideTopLeft' }} />
                <ReferenceLine x={c.fromIssueDays} stroke={SERIES[2]} label={{ value: 'review, earned at issue', fill: '#BFFF00', fontSize: 10, position: 'top' }} />
                <ReferenceLine x={c.fromCorrectionDays} stroke="#64748b" strokeDasharray="4 2" label={{ value: 'from the correction, unused', fill: '#94a3b8', fontSize: 10, position: 'insideTopRight' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      {rules && Array.isArray(rules.revisions) && (
        <>
          <Lead>nextRevisionNumber keeps the width a revision is cited at:</Lead>
          <Tbl head={['current revision', 'next revision']} rows={rules.revisions.map((r) => [r.current === null ? 'null' : `'${r.current}'`, `'${r.next}'`])} />
          <Tbl head={['department', 'category', 'prefix']} rows={rules.prefixes.map((p) => [`'${p.department}'`, `'${p.category}'`, p.prefix])} />
          <Lead>Who may review revision {rules.revision.id}, authored by {rules.revision.created_by}:</Lead>
          {rules.segregation.map((v) => <Verdict key={v.label} v={v} />)}
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const RegisterExplorer = ({ initialMode = 'register' }) => {
  const [mode, setMode] = useState(initialMode);
  const [offset, setOffset] = useState(0);
  const [pick, setPick] = useState('o01');
  const [lead, setLead] = useState(14);
  const [filing, setFiling] = useState('REG-2026-003');
  const asOf = useMemo(() => safe(() => asOfAt(offset)), [offset]);

  const cal = useMemo(() => (mode === 'calendar' ? safe(() => calendarAt(asOf)) : null), [mode, asOf]);
  const contract = useMemo(() => (mode === 'calendar' ? safe(unreadableTodayContract) : null), [mode]);
  const vocab = useMemo(() => (mode === 'calendar' ? safe(vocabulary) : null), [mode]);
  const reg = useMemo(() => (mode === 'register' ? safe(() => registerAt(asOf)) : null), [mode, asOf]);
  const prec = useMemo(() => (mode === 'register' ? safe(() => precedenceAt(asOf)) : null), [mode, asOf]);
  const timeline = useMemo(() => (mode === 'register' ? safe(() => statusTimeline(pick, -60, 240)) : null), [mode, pick]);
  const sweep = useMemo(() => (mode === 'lead' ? safe(() => leadTimeAt(asOf)) : null), [mode, asOf]);
  const curve = useMemo(() => (mode === 'lead' ? safe(() => leadTimeCurve(lead, asOf)) : null), [mode, lead, asOf]);
  const per = useMemo(() => (mode === 'period' ? safe(() => periodAt(asOf)) : null), [mode, asOf]);
  const roll = useMemo(() => (mode === 'roll' ? safe(() => rollAt(asOf)) : null), [mode, asOf]);
  const lib = useMemo(() => (mode === 'library' ? safe(() => libraryAt(asOf)) : null), [mode, asOf]);
  const rev = useMemo(() => (mode === 'library' ? safe(() => reviewDatesAt(asOf)) : null), [mode, asOf]);
  const rules = useMemo(() => (mode === 'library' ? safe(documentRules) : null), [mode]);

  return (
    <PanelShell
      title="Register explorer"
      subtitle={`The IKORO obligation register and document library, read by the engine against an as-of date you move. At ${AS_OF_YMD}, the as-of date every lesson reads at, every row is the one the lessons quote.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <AsOfSlider offset={offset} onChange={setOffset} />
      <div className="mt-3">
        {mode === 'calendar' && <CalendarMode cal={cal} contract={contract} vocab={vocab} />}
        {mode === 'register' && <RegisterMode reg={reg} prec={prec} timeline={timeline} pick={pick} onPick={setPick} />}
        {mode === 'lead' && <LeadMode sweep={sweep} curve={curve} lead={lead} onLead={setLead} />}
        {mode === 'period' && <PeriodMode per={per} pick={filing} onPick={setFiling} />}
        {mode === 'roll' && <RollMode roll={roll} />}
        {mode === 'library' && <LibraryMode lib={lib} rev={rev} rules={rules} />}
      </div>
      <Note>
        Every status, reason, date and day count on this page is a return value of the vendored complianceStatus and
        documentControl modules through the teaching lab, at the as-of date shown. Every refusal is the engine&apos;s own
        sentence.
      </Note>
    </PanelShell>
  );
};

export default RegisterExplorer;
