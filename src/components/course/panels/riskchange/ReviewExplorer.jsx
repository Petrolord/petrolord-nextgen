import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea,
  ReferenceLine,
} from 'recharts';
import {
  commentRules, commentLogStart, commentLogView, moveComment, reviewActors, closureProbes, actOnCommentProbes,
  participantProbes, reviewerPeople, reviewerRoles, assignReviewer, ikangReviews, registerSummaryAt,
  visibleLessons, lessonUse, recordApplication, lessonRules, reuseRecords, embeddingProbes, lessonReviewAt,
  lessonReviewTimeline, lessonReviewLead, onneRegister, onneSummary, LESSON_REVIEW_OFFSETS, AS_OF_ISO,
  q, yn, lst, orNull,
} from './riskchangeLab';
import {
  Tbl, Verdict, Note, Lead, Empty, DaySlider, MoveButton, safe, AXIS, TOOLTIP, GRID, DASH, MARGIN, LIME, SKY, AMBER,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Review explorer, the Expert tier throughout.
//
// A REVIEW CLOSES ONLY WHEN ITS BLOCKING COMMENTS ARE RESOLVED, AND THE AUTHOR
// NEVER RESOLVES THEM. The comment view is IK-01's own log with every disposition
// a reader can ask for, and an ACTING-AS switch between the author of the work
// and a reviewer independent of it. Each move is asked of canActOnComment with
// the signed-in person and the review, so the segregation refusal is one click
// away, and a refused move changes nothing.
//
// A LESSON IS LEARNED WHEN IT CHANGES SOMETHING. The lessons view adds
// applications to a visible lesson and shows the reuse record, the last applied
// date and the embedding verdict following them. A rejection is a real record
// and applies nothing, and the view shows exactly that.
//
// Every verdict, status, count and date on this page is a return value of the
// vendored peer review and lessons learned engines through riskchangeLab, and
// every date is a whole number of days from the as-of date. Nothing here reads a
// clock.

export const MODES = [
  ['comments', 'The comment log: dispositions, closure and who is acting'],
  ['reviewers', 'The reviewer panel: who may review the work'],
  ['register', 'The IKANG register summarised, and a cancelled review'],
  ['lessons', 'A lesson and its applications: the reuse record and embedding'],
  ['dates', 'Lesson review dates across the as-of date'],
];

// ---------------------------------------------------------------------------

export const CommentsMode = ({
  view, rules, actors, actingAs, onActingAs, onMove, onReset, last, probes,
}) => {
  if (!view || !Array.isArray(view.rows) || !rules || !Array.isArray(rules.statuses) || !Array.isArray(actors)) {
    return <Empty>The comment reader has returned nothing, so there is no log to move.</Empty>;
  }
  return (
    <>
      <Lead>
        {view.review.id}, {view.review.title}, is in {q(view.review.stage)}. Its author is {view.review.author}. Act
        as the author or as an independent reviewer and move a comment: the engine asks canActOnComment, and a refused
        move shows its sentence and changes nothing.
      </Lead>
      <FieldGrid>
        <SelectField label="Acting as" value={actingAs} onChange={onActingAs} options={actors.map((a) => [a.id, a.label])} />
      </FieldGrid>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">comment</th>
              <th className="text-left pr-3">severity</th>
              <th className="text-left pr-3">status</th>
              <th className="text-left pr-3">blocking</th>
              <th className="text-left">move to</th>
            </tr>
          </thead>
          <tbody>
            {view.rows.map((c) => (
              <tr key={c.id}>
                <td className="pr-3">{c.id}</td>
                <td className="pr-3">{c.severity === null ? 'none' : q(c.severity)}</td>
                <td className="pr-3">{q(c.status)}</td>
                <td className="pr-3">{yn(c.blocking)}</td>
                <td>
                  {rules.statuses.filter((s) => s !== c.status).map((s) => (
                    <MoveButton key={s} tone={c.next.includes(s) ? 'legal' : null} onClick={() => onMove && onMove(c.id, s)}>{s}</MoveButton>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <MoveButton onClick={() => onReset && onReset()}>back to the log as the register holds it</MoveButton>
      </div>
      <Verdict v={last} />
      <Lead>Closing the review, asked of the engine on the log as it now stands:</Lead>
      <Verdict v={view.closure} />
      <TileGrid>
        <Tile label="Blocking comments" value={lst(view.blocking)} />
        <Tile label="Total comments" value={view.totalComments} />
        <Tile label="Open comments" value={view.openComments} />
        <Tile label="Blocking count" value={view.blockingComments} />
      </TileGrid>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={view.byStatus} margin={MARGIN}>
            <CartesianGrid stroke={GRID} strokeDasharray={DASH} />
            <XAxis dataKey="status" tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP} />
            <Bar dataKey="count" name="comments" fill={SKY} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Note>Worst first, unresolved before resolved: {lst(view.order)}.</Note>
      <Tbl
        head={['from', 'legal next statuses', 'who makes each move']}
        rows={rules.transitions.map((t) => [q(t.from), lst(t.moves.map((m) => q(m.to))), lst(t.moves.map((m) => `${m.to} by the ${m.actor}`))])}
      />
      <Note>Of the {rules.pairs} ordered pairs of statuses, {rules.legalPairs} are legal moves.</Note>
      {Array.isArray(probes) && probes.map((v) => <Verdict key={v.label} v={v} />)}
    </>
  );
};

export const ReviewersMode = ({
  people, roles, person, role, onPerson, onRole, v, probes,
}) => {
  if (!Array.isArray(people) || !Array.isArray(roles)) {
    return <Empty>The reviewer reader has returned nothing, so there is nobody to put on the review.</Empty>;
  }
  return (
    <>
      <Lead>Put somebody on the review in a role, and ask canAssignPeerReviewer whether they may be there.</Lead>
      <FieldGrid>
        <SelectField label="Person" value={person} onChange={onPerson} options={people.map((p) => [p.key, p.label])} />
        <SelectField label="Role" value={role} onChange={onRole} options={roles.map((r) => [r.value, r.label])} />
      </FieldGrid>
      <Verdict v={v} />
      {Array.isArray(probes) && (
        <>
          <Lead>The reviewer panel probes, each verdict the engine&apos;s:</Lead>
          {probes.map((p) => <Verdict key={p.label} v={p} />)}
        </>
      )}
    </>
  );
};

export const RegisterMode = ({
  s, reviews, stages, stage, onStage,
}) => {
  if (!s || !Array.isArray(s.others) || !reviews || !Array.isArray(reviews.rows) || !Array.isArray(stages)) {
    return <Empty>The register reader has returned nothing, so there is nothing to summarise.</Empty>;
  }
  return (
    <>
      <Tbl
        head={['review', 'stage', 'due', 'overdue']}
        rows={reviews.rows.map((r) => [r.id, q(r.stage), r.due, yn(r.overdue)])}
      />
      <Note>
        Reviews {reviews.total}, active {reviews.active}, overdue {reviews.overdue}, read on {AS_OF_ISO}. Most urgent
        first: {lst(reviews.urgency)}.
      </Note>
      <Lead>
        The whole register summarised with the comments on the other reviews. Move IK-04 between stages and watch its
        two comments leave the open and blocking counts while staying in the total.
      </Lead>
      <FieldGrid>
        <SelectField label="IK-04 is in" value={stage} onChange={onStage} options={stages.map((x) => [x, x])} />
      </FieldGrid>
      <TileGrid>
        <Tile label="Comments in the total" value={s.totalComments} />
        <Tile label="Open" value={s.openComments} />
        <Tile label="Blocking" value={s.blockingComments} />
        <Tile label="IK-04 stage" value={q(s.ik04Stage)} />
      </TileGrid>
      <Tbl
        head={['comment', 'review', 'review stage', 'severity', 'status', 'blocking on its own']}
        rows={s.others.map((c) => [c.id, c.review, q(c.reviewStage), q(c.severity), q(c.status), yn(c.blockingOnItsOwn)])}
      />
      <Note>By severity across the whole register: {s.bySeverity.map((x) => `${q(x.severity)} ${x.count}`).join(', ')}.</Note>
    </>
  );
};

export const LessonsMode = ({
  lessons, use, lessonId, onLesson, rules, target, outcome, onTarget, onOutcome, onRecord, onReset, last, reuse, probes,
}) => {
  if (!Array.isArray(lessons) || !use || !use.reuse || !Array.isArray(use.applications) || !rules || !Array.isArray(rules.targets)) {
    return <Empty>The lesson reader has returned nothing, so there is no lesson to apply.</Empty>;
  }
  return (
    <>
      <FieldGrid>
        <SelectField label="Lesson" value={lessonId} onChange={onLesson} options={lessons.map((l) => [l.id, `${l.id}, ${l.title}`])} />
        <SelectField label="Applied to" value={target} onChange={onTarget} options={rules.targets.map((t) => [t, t])} />
        <SelectField label="Outcome" value={outcome} onChange={onOutcome} options={rules.outcomes.map((o) => [o, o])} />
      </FieldGrid>
      <div className="mt-2">
        <MoveButton tone="legal" onClick={() => onRecord && onRecord()}>record the application on {AS_OF_ISO}</MoveButton>
        <MoveButton onClick={() => onReset && onReset()}>back to the log as the register holds it</MoveButton>
      </div>
      <Verdict v={last} />
      <TileGrid>
        <Tile label="Applications" value={use.reuse.total} />
        <Tile label="Applied (adopted or adapted)" value={use.reuse.applied} />
        <Tile label="Rejected" value={use.reuse.rejected} />
        <Tile label="Last applied on" value={orNull(use.reuse.lastAppliedOn)} />
      </TileGrid>
      <Tbl
        head={['application', 'target', 'outcome', 'applied on', 'changed something']}
        rows={use.applications.map((a) => [a.id, q(a.target), q(a.outcome), a.appliedOn, yn(a.changedSomething)])}
      />
      <Note>
        Targets it changed: {lst(use.reuse.targets.map(q))}. Applied nowhere: {yn(use.unapplied)}. A rejection is
        counted and applies nothing, so it never moves the applied count or the last applied date.
      </Note>
      <Lead>May {use.lesson.id} be marked Embedded, asked of the engine on these applications:</Lead>
      <Verdict v={use.embed} />
      {Array.isArray(reuse) && (
        <Tbl
          head={['lesson', 'total', 'applied', 'adopted', 'adapted', 'rejected', 'last applied on']}
          rows={reuse.map((r) => [r.id, r.total, r.applied, r.adopted, r.adapted, r.rejected, orNull(r.lastAppliedOn)])}
        />
      )}
      {Array.isArray(probes) && probes.map((v) => <Verdict key={v.label} v={v} />)}
    </>
  );
};

export const DatesMode = ({
  at, rows, lead, offset, onOffset, statuses, status, onStatus, reg, sum,
}) => {
  if (!at || !Array.isArray(rows) || !lead || !Array.isArray(statuses)) {
    return <Empty>The lesson date reader has returned nothing, so there is no date to move.</Empty>;
  }
  const lo = Math.min(...LESSON_REVIEW_OFFSETS);
  const hi = Math.max(...LESSON_REVIEW_OFFSETS);
  return (
    <>
      <Lead>
        A visible lesson reads due soon from {lead.leadDays} days before its review date, both ends counted, drawn as
        the band from day {lead.first} to day {lead.last}, and overdue once the date has passed. A lesson that is not
        visible has no review status at all.
      </Lead>
      <FieldGrid>
        <SelectField label="Lesson status" value={status} onChange={onStatus} options={statuses.map((x) => [x, x])} />
      </FieldGrid>
      <DaySlider label={`Review due, days from the as-of date: ${at.offset}`} value={at.offset} min={lo} max={hi} onChange={onOffset} />
      <TileGrid>
        <Tile label="Review due" value={at.reviewDue} />
        <Tile label="Days until" value={at.days} />
        <Tile label="Overdue" value={yn(at.overdue)} />
        <Tile label="Due soon" value={yn(at.dueSoon)} />
      </TileGrid>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={MARGIN}>
            <CartesianGrid stroke={GRID} strokeDasharray={DASH} />
            <XAxis dataKey="offset" type="number" domain={[lo, hi]} tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP} />
            <ReferenceArea x1={lead.first} x2={lead.last} fill={AMBER} fillOpacity={0.2} />
            <ReferenceLine x={offset} stroke={LIME} />
            <Line dataKey="days" name="days until the review" stroke={SKY} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {Array.isArray(reg) && (
        <Tbl
          head={['lesson', 'status', 'event date', 'age in days', 'review due', 'overdue', 'due soon', 'applied nowhere']}
          rows={reg.map((l) => [l.id, q(l.status), l.eventDate, orNull(l.ageDays), orNull(l.reviewDue), yn(l.overdue), yn(l.dueSoon), yn(l.appliedNowhere)])}
        />
      )}
      {sum && Array.isArray(sum.counts) && (
        <>
          <Tbl head={['count', 'value']} rows={sum.counts.map((c) => [c.key, c.value])} />
          <Note>Needs attention first: {lst(sum.attention)}.</Note>
        </>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const ReviewExplorer = ({ initialMode = 'comments' }) => {
  const [mode, setMode] = useState(initialMode);
  const rules = useMemo(() => safe(commentRules), []);
  const actors = useMemo(() => safe(reviewActors), []);
  const [comments, setComments] = useState(() => safe(commentLogStart) || []);
  const [actingAs, setActingAs] = useState(() => (actors && actors[0] ? actors[0].id : ''));
  const [last, setLast] = useState(null);
  const people = useMemo(() => safe(reviewerPeople), []);
  const roles = useMemo(() => safe(reviewerRoles), []);
  const [person, setPerson] = useState(() => (people && people[0] ? people[0].key : ''));
  const [role, setRole] = useState(() => (roles && roles[0] ? roles[0].value : ''));
  const reviews = useMemo(() => safe(ikangReviews), []);
  const [ik04Stage, setIk04Stage] = useState(() => {
    const r = reviews && Array.isArray(reviews.rows) ? reviews.rows.find((x) => x.id === 'IK-04') : null;
    return r ? r.stage : '';
  });
  const lessons = useMemo(() => safe(visibleLessons), []);
  const lRules = useMemo(() => safe(lessonRules), []);
  const [lessonId, setLessonId] = useState(() => (lessons && lessons[0] ? lessons[0].id : ''));
  const [added, setAdded] = useState([]);
  const [target, setTarget] = useState(() => (lRules && lRules.targets ? lRules.targets[0] : ''));
  const [outcome, setOutcome] = useState(() => (lRules && lRules.outcomes ? lRules.outcomes[0] : ''));
  const [lessonLast, setLessonLast] = useState(null);
  const [offset, setOffset] = useState(() => (LESSON_REVIEW_OFFSETS.includes(0) ? 0 : LESSON_REVIEW_OFFSETS[0]));
  const [status, setStatus] = useState(() => (lRules && lRules.visible ? lRules.visible[0] : ''));

  const view = useMemo(() => (mode === 'comments' ? safe(() => commentLogView(comments)) : null), [mode, comments]);
  const cProbes = useMemo(() => (mode === 'comments' ? safe(() => [...closureProbes(), ...actOnCommentProbes()]) : null), [mode]);
  const v = useMemo(() => (mode === 'reviewers' ? safe(() => assignReviewer(person, role)) : null), [mode, person, role]);
  const pProbes = useMemo(() => (mode === 'reviewers' ? safe(participantProbes) : null), [mode]);
  const s = useMemo(() => (mode === 'register' ? safe(() => registerSummaryAt(ik04Stage)) : null), [mode, ik04Stage]);
  const use = useMemo(() => (mode === 'lessons' ? safe(() => lessonUse(lessonId, added)) : null), [mode, lessonId, added]);
  const reuse = useMemo(() => (mode === 'lessons' ? safe(reuseRecords) : null), [mode]);
  const eProbes = useMemo(() => (mode === 'lessons' ? safe(embeddingProbes) : null), [mode]);
  const at = useMemo(() => (mode === 'dates' ? safe(() => lessonReviewAt(offset, status)) : null), [mode, offset, status]);
  const rows = useMemo(() => (mode === 'dates' ? safe(lessonReviewTimeline) : null), [mode]);
  const lead = useMemo(() => (mode === 'dates' ? safe(lessonReviewLead) : null), [mode]);
  const reg = useMemo(() => (mode === 'dates' ? safe(onneRegister) : null), [mode]);
  const sum = useMemo(() => (mode === 'dates' ? safe(onneSummary) : null), [mode]);

  const onMove = (id, to) => {
    const r = safe(() => moveComment(comments, id, to, actingAs));
    if (!r) return;
    setLast(r);
    setComments(r.comments);
  };
  const onReset = () => {
    setComments(safe(commentLogStart) || []);
    setLast(null);
  };
  const onRecord = () => {
    const r = safe(() => recordApplication(lessonId, added, target, outcome));
    if (!r) return;
    setLessonLast(r);
    setAdded(r.added);
  };

  return (
    <PanelShell
      title="Review explorer"
      subtitle={`The IKANG peer review register and the ONNE lessons register: a comment log whose dispositions you move as a named person, the reviewer panel, a cancelled review in the counts, a lesson's applications, and lesson review dates read on the as-of date ${AS_OF_ISO}.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'comments' && (
          <CommentsMode
            view={view}
            rules={rules}
            actors={actors}
            actingAs={actingAs}
            onActingAs={setActingAs}
            onMove={onMove}
            onReset={onReset}
            last={last}
            probes={cProbes}
          />
        )}
        {mode === 'reviewers' && (
          <ReviewersMode people={people} roles={roles} person={person} role={role} onPerson={setPerson} onRole={setRole} v={v} probes={pProbes} />
        )}
        {mode === 'register' && (
          <RegisterMode s={s} reviews={reviews} stages={rules ? rules.stages : null} stage={ik04Stage} onStage={setIk04Stage} />
        )}
        {mode === 'lessons' && (
          <LessonsMode
            lessons={lessons}
            use={use}
            lessonId={lessonId}
            onLesson={(id) => { setLessonId(id); setLessonLast(null); }}
            rules={lRules}
            target={target}
            outcome={outcome}
            onTarget={setTarget}
            onOutcome={setOutcome}
            onRecord={onRecord}
            onReset={() => { setAdded([]); setLessonLast(null); }}
            last={lessonLast}
            reuse={reuse}
            probes={eProbes}
          />
        )}
        {mode === 'dates' && (
          <DatesMode
            at={at}
            rows={rows}
            lead={lead}
            offset={offset}
            onOffset={setOffset}
            statuses={lRules ? lRules.statuses : null}
            status={status}
            onStatus={setStatus}
            reg={reg}
            sum={sum}
          />
        )}
      </div>
      <Note>
        Every verdict, status, count and date on this page is a return value of the vendored peer review and lessons
        learned engines through the teaching lab. Every refusal shown is the engine&apos;s own sentence, and every date
        is a whole number of days from the as-of date turned into a calendar date by the engine&apos;s own calendar.
      </Note>
    </PanelShell>
  );
};

export default ReviewExplorer;
