import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import {
  ORASHI_AUDITS, ORASHI_FINDINGS, LEAD_AUDITOR_CHOICES, asOfAt, ymd, vocabulary, clauseRegisterAt, clauseStatusTries,
  setClauseStatus, independenceOf, examineChecks, coverageAt, findingsAt, findingAgeOf, readinessAt,
  certificateSweep, emptyStandardReadiness, isoSummaryAt,
} from './complianceLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, Status, txt, Tbl, Verdict, Note, Lead, Empty, safe, Slider, AsOfSlider, Stepper, Button,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Readiness explorer, the Expert tier throughout.
//
// READINESS IS A LIST. certificationReadiness returns blockers, each with a
// severity, a count and a sentence, and this page prints that list and nothing
// that summarises it into a single figure. There is no score, no gauge and no
// fraction of anything on this page, because the engine returns none.
//
// COVERAGE MOVES EXACTLY AS THE ENGINE MOVES IT. An audit's type or status can be
// changed here, and the lab hands the changed audits to clauseCoverage and to
// certificationReadiness. Whether an audit counts is read off the engine's own
// two lists: a certification body's audit, an audit in progress and a cancelled
// audit never count.
//
// THE REGISTER'S STANDARD IS PASSED. Every canSetClauseStatus the lab makes
// passes the ISO 14001:2015 record as its fourth argument, so a refusal names
// that standard.
//
// Every value here is a return of the vendored isoCompliance module through the
// teaching lab, at the as-of date shown. Nothing here constructs a date.

export const MODES = [
  ['register', 'The ORASHI clause register, and what a conformity claim needs'],
  ['independence', 'The lead auditor over a scope, and the owned clauses named'],
  ['coverage', 'Coverage over the certification cycle, with each audit\'s type and status as controls'],
  ['findings', 'A finding\'s closure walk, and its age stopping at its closed date'],
  ['readiness', 'Certification readiness as a list of blockers, with the certificate expiry as a control'],
];

// ---------------------------------------------------------------------------

export const ClauseMode = ({ reg, tries, choice, onChoice, flags, onFlag }) => {
  if (!reg || !Array.isArray(reg.rows)) return <Empty>The clause register reader has returned nothing, so there is no clause to show.</Empty>;
  const vocab = safe(vocabulary);
  const statuses = vocab ? vocab.clauseStatuses.concat(['Compliant']) : [];
  const patch = {};
  if (flags.evidence) patch.evidence_reference = 'EMS-TRN-MATRIX';
  if (flags.date) patch.assessed_date = '2026-10-12';
  if (flags.assessor) patch.assessed_by = 'u-nneka';
  if (flags.notApplicable) patch.applicability = 'Not applicable';
  if (flags.justification) patch.applicability_justification = 'Competence is managed under the group HR system outside this scope.';
  const live = safe(() => setClauseStatus(choice, patch));
  return (
    <>
      <Lead>
        {reg.standard.code} at ORASHI, {reg.standard.certification}, certification cycle {reg.standard.cycleYears} years,
        certificate expires {reg.standard.expires}.
      </Lead>
      <Tbl
        head={['clause', 'title', 'status', 'owner', 'claims conformity', 'evidence record', 'assessed', 'next review', 'review overdue', 'review due soon']}
        rows={reg.rows.map((r) => [r.clause, r.title, r.status, r.owner, txt(r.claims), txt(r.evidence), txt(r.assessed), txt(r.nextReview), txt(r.reviewOverdue), txt(r.reviewDueSoon)])}
      />
      <Lead>Set a status on clause 7.2, which has nothing recorded. The register&apos;s standard record is passed with every try.</Lead>
      <FieldGrid>
        <SelectField label="Status" value={choice} onChange={onChoice} options={statuses.map((s) => [s, s])} />
      </FieldGrid>
      <div className="flex flex-wrap gap-2 mt-2">
        {[['evidence', 'an evidence reference'], ['date', 'the date assessed'], ['assessor', 'who assessed it'], ['notApplicable', 'applicability Not applicable'], ['justification', 'a justification']].map(([k, label]) => (
          <Button key={k} active={Boolean(flags[k])} onClick={() => onFlag(k)}>{label}</Button>
        ))}
      </div>
      <Verdict v={live} />
      {tries && Array.isArray(tries.tries) && (
        <>
          <Lead>The tries the lessons quote, and the Not applicable refusal under three standards and none:</Lead>
          {tries.tries.map((v) => <Verdict key={v.label} v={v} />)}
          {tries.byStandard.map((v) => <Verdict key={`std ${v.label}`} v={v} />)}
        </>
      )}
    </>
  );
};

export const IndependenceMode = ({ ind, lead, onLead, examine }) => {
  if (!ind || !Array.isArray(ind.scope)) return <Empty>The independence reader has returned nothing, so there is no scope to show.</Empty>;
  return (
    <>
      <Lead>A planned internal audit with these clauses in scope, and the person who owns each one:</Lead>
      <Tbl head={['clause', 'owner']} rows={ind.scope.map((s) => [s.clause, s.owner])} />
      <FieldGrid>
        <SelectField label="Lead auditor" value={lead} onChange={onLead} options={LEAD_AUDITOR_CHOICES.map((x) => [x, x === 'external' ? 'an external lead auditor named in text' : x])} />
      </FieldGrid>
      <Verdict v={{ label: `lead auditor ${ind.lead}`, ok: ind.ok, reason: ind.reason }} />
      {!ind.ok && <Note>Owned clauses the engine names: {txt(ind.clausesNamed)}.</Note>}
      {Array.isArray(examine) && (
        <>
          <Lead>The same check for whoever records a clause result:</Lead>
          {examine.map((v) => <Verdict key={v.label} v={v} />)}
        </>
      )}
    </>
  );
};

export const CoverageMode = ({ cov, cycle, onCycle, overrides, onOverride }) => {
  if (!cov || !Array.isArray(cov.rows)) return <Empty>The coverage reader has returned nothing, so there is no clause to place.</Empty>;
  const vocab = safe(vocabulary);
  const types = vocab ? vocab.isoAuditTypes : [];
  const statuses = vocab ? vocab.auditStatuses : [];
  const points = cov.rows.filter((r) => r.daysUntil !== null).map((r, i) => ({ x: r.daysUntil, y: i + 1, clause: r.clause, covered: r.covered }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Certification cycle, years" value={String(cycle)} onChange={(v) => onCycle(Number(v))} options={['1', '2', '3', '4'].map((x) => [x, x])} />
      </FieldGrid>
      <Lead>The audits ORASHI holds. Change a type or a status and read what counts.</Lead>
      <Tbl
        head={['audit', 'type', 'status', 'ended', 'counts towards coverage']}
        rows={cov.audits.map((a) => [
          a.code,
          <select key="t" value={a.type} onChange={(e) => onOverride(a.id, { audit_type: e.target.value })} className="bg-gray-700 text-white border border-gray-600 rounded text-xs">
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>,
          <select key="s" value={a.status} onChange={(e) => onOverride(a.id, { status: e.target.value })} className="bg-gray-700 text-white border border-gray-600 rounded text-xs">
            {statuses.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>,
          txt(a.ended),
          txt(a.counts),
        ])}
      />
      {Object.keys(overrides).length > 0 && <Note>Audit records changed from the ones ORASHI holds: {Object.keys(overrides).length}.</Note>}
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" tick={AXIS} label={{ value: 'days from the as-of date to the last counting examination', fill: '#94a3b8', fontSize: 11, position: 'insideBottom', offset: -3 }} />
            <YAxis dataKey="y" type="number" tick={AXIS} allowDecimals={false} width={30} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v, n, p) => [p && p.payload ? `${p.payload.clause}${p.payload.covered ? ', covered' : ', stale'}` : v, 'clause']} />
            <Scatter data={points.filter((p) => p.covered)} fill={SERIES[2]} isAnimationActive={false} />
            <Scatter data={points.filter((p) => !p.covered)} fill={SERIES[5]} isAnimationActive={false} />
            <ReferenceLine x={0} stroke={SERIES[3]} strokeDasharray="4 2" label={{ value: 'as-of', fill: '#fbbf24', fontSize: 10, position: 'top' }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Green is a clause the engine counts as covered, red one it counts as stale. The cycle begins on the same calendar
        day the cycle length back from the as-of date, and the engine decides which side of it an examination falls.
      </Note>
      <Tbl
        head={['clause', 'last examined', 'days until it', 'by audit', 'result', 'covered', 'stale']}
        rows={cov.rows.map((r) => [r.clause, r.lastExamined || 'never', txt(r.daysUntil), txt(r.byAudit), txt(r.result), txt(r.covered), txt(r.stale)])}
      />
      <Tbl head={['cycleYears', 'covered', 'stale', 'never examined']} rows={cov.byCycle.map((c) => [c.cycleYears, c.covered, c.stale, c.never])} />
      <Lead>Each clause against its own standard&apos;s cycle, both last examined on the same day:</Lead>
      <Tbl head={['standard', 'clause', 'last examined', 'covered', 'stale']} rows={cov.byStandard.map((b) => [b.standard, b.clause, txt(b.lastExamined), txt(b.covered), txt(b.stale)])} />
    </>
  );
};

export const FindingsMode = ({ fnd, pick, onPick, age, step, onStep }) => {
  if (!fnd || !Array.isArray(fnd.rows)) return <Empty>The findings reader has returned nothing, so there is no finding to walk.</Empty>;
  return (
    <>
      <FieldGrid>
        <SelectField label="Finding" value={pick} onChange={onPick} options={ORASHI_FINDINGS.map((f) => [f.finding_code, `${f.finding_code} ${f.finding_type}`])} />
      </FieldGrid>
      {age && age.status && (
        <TileGrid>
          <Tile label="Status" value={age.status} />
          <Tile label="Raised" value={age.raised} />
          <Tile label="Closed" value={txt(age.closed)} />
          <Tile label="Age at the as-of date, days" value={txt(age.age)} />
        </TileGrid>
      )}
      <Note>A finding ages to the as-of date while it is open, and stops at its closed date once it is closed or voided. Move the as-of date and watch which ages move.</Note>
      <Tbl
        head={['code', 'type', 'status', 'raised', 'due', 'closed', 'open', 'overdue', 'age, days']}
        rows={fnd.rows.map((r) => [r.code, r.type, r.status, r.raised, txt(r.due), txt(r.closed), txt(r.open), txt(r.overdue), txt(r.age)])}
      />
      <Stepper title="canCloseFinding on a Major nonconformity" steps={fnd.ladder} at={step} onAt={onStep} />
      {fnd.minorAndObservation.map((v) => <Verdict key={v.label} v={v} />)}
      <Lead>Each ORASHI finding with its own actions:</Lead>
      {fnd.rows.map((r) => <Verdict key={r.code} v={r.closure} />)}
      <Tbl
        head={['action', 'finding', 'type', 'status', 'due', 'open', 'overdue', 'verified effective']}
        rows={fnd.actions.map((a) => [a.id, a.finding, a.type, a.status, a.due, txt(a.open), txt(a.overdue), txt(a.verified)])}
      />
      <Lead>Reporting an ISO audit:</Lead>
      {fnd.report.map((v) => <Verdict key={v.label} v={v} />)}
    </>
  );
};

export const ReadinessMode = ({ rd, certOffset, onCertOffset, sweep, empty, summary }) => {
  if (!rd || !Array.isArray(rd.blockers)) return <Empty>The readiness reader has returned nothing, so there is no list to show.</Empty>;
  return (
    <>
      <FieldGrid>
        <Slider
          label="Certificate expires, days from the as-of date"
          value={certOffset}
          min={-30}
          max={150}
          onChange={onCertOffset}
          shown={`${txt(rd.certificateExpires)} (the engine counts ${txt(rd.certificateDays)} days)`}
        />
      </FieldGrid>
      <TileGrid>
        <Tile label="Ready" value={txt(rd.ready)} />
        <Tile label="certificateExpiring" value={txt(rd.certificateExpiring)} />
        <Tile label="certificateExpired" value={txt(rd.certificateExpired)} />
        <Tile label="Certificate item" value={rd.certificateItem ? <Status word={rd.certificateItem.severity} /> : 'none'} />
      </TileGrid>
      <Lead>certificationReadiness for {rd.standard}, as the list the engine returns:</Lead>
      <ul className="mt-2 space-y-1">
        {rd.blockers.map((b) => (
          <li key={b.text} className="text-xs text-slate-300">
            <Status word={b.severity} />
            {' '}
            (count {b.count}) {b.text}
          </li>
        ))}
      </ul>
      <Note>
        certificateExpiring is the lead window, zero to the engine&apos;s lead days inclusive. certificateExpired is past the
        expiry. The engine never sets both.
      </Note>
      {Array.isArray(sweep) && (
        <Tbl
          head={['certificate expires', 'certificateDays', 'certificateExpiring', 'certificateExpired', 'certificate item listed']}
          rows={sweep.map((s) => [s.expires === null ? 'null' : s.expires, s.days === null ? 'null' : s.days, txt(s.expiring), txt(s.expired), s.item ? `${s.item.severity}: ${s.item.text}` : 'none'])}
        />
      )}
      <Tbl head={['count', 'value']} rows={rd.counts.map((c) => [c.key, c.value === null ? 'null' : String(c.value)])} />
      {empty && Array.isArray(empty.blockers) && (
        <Note>
          A standard with no clauses in the register reads ready {txt(empty.ready)}: {empty.blockers.map((b) => b.text).join(' ')}
        </Note>
      )}
      {summary && summary.openFindings !== undefined && (
        <Note>
          The dashboard summary over the same register: open findings {summary.openFindings}, open major {summary.openMajor},
          never audited {summary.neverAudited}, stale {summary.stale}, overdue actions {summary.overdueActions}.
        </Note>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------

const ReadinessExplorer = ({ initialMode = 'readiness' }) => {
  const [mode, setMode] = useState(initialMode);
  const [offset, setOffset] = useState(0);
  const [choice, setChoice] = useState('Conformant');
  const [flags, setFlags] = useState({});
  const [lead, setLead] = useState('u-kalu');
  const [cycle, setCycle] = useState(3);
  const [overrides, setOverrides] = useState({});
  const [pick, setPick] = useState('ISF-2026-001');
  const [step, setStep] = useState(0);
  const [certOffset, setCertOffset] = useState(null);
  const asOf = useMemo(() => safe(() => asOfAt(offset)), [offset]);

  const reg = useMemo(() => (mode === 'register' ? safe(() => clauseRegisterAt(asOf)) : null), [mode, asOf]);
  const tries = useMemo(() => (mode === 'register' ? safe(clauseStatusTries) : null), [mode]);
  const ind = useMemo(() => (mode === 'independence' ? safe(() => independenceOf(lead)) : null), [mode, lead]);
  const examine = useMemo(() => (mode === 'independence' ? safe(examineChecks) : null), [mode]);
  const cov = useMemo(() => (mode === 'coverage' ? safe(() => coverageAt({ cycleYears: cycle, overrides }, asOf)) : null), [mode, cycle, overrides, asOf]);
  const fnd = useMemo(() => (mode === 'findings' ? safe(() => findingsAt(asOf)) : null), [mode, asOf]);
  const age = useMemo(() => (mode === 'findings' ? safe(() => findingAgeOf(pick, asOf)) : null), [mode, pick, asOf]);
  const expires = useMemo(() => (certOffset === null ? undefined : safe(() => ymd(asOfAt(offset + certOffset)))), [certOffset, offset]);
  const rd = useMemo(() => (mode === 'readiness'
    ? safe(() => readinessAt({ ...(expires ? { certificateExpires: expires } : {}), overrides }, asOf))
    : null), [mode, expires, overrides, asOf]);
  const sweep = useMemo(() => (mode === 'readiness' ? safe(() => certificateSweep(asOf)) : null), [mode, asOf]);
  const empty = useMemo(() => (mode === 'readiness' ? safe(() => emptyStandardReadiness(asOf)) : null), [mode, asOf]);
  const summary = useMemo(() => (mode === 'readiness' ? safe(() => isoSummaryAt(asOf)) : null), [mode, asOf]);

  const onFlag = (k) => setFlags((f) => ({ ...f, [k]: !f[k] }));
  const onOverride = (id, patch) => setOverrides((o) => {
    const base = ORASHI_AUDITS.find((a) => a.id === id) || {};
    const next = { ...(o[id] || {}), ...patch };
    const same = Object.keys(next).every((k) => next[k] === base[k]);
    const out = { ...o };
    if (same) delete out[id]; else out[id] = next;
    return out;
  });
  const certShown = certOffset === null ? (rd && typeof rd.certificateDays === 'number' ? rd.certificateDays : 0) : certOffset;

  return (
    <PanelShell
      title="Readiness explorer"
      subtitle="The ORASHI ISO 14001:2015 system: its clause register, internal audits, a certification body's surveillance audit, findings and actions. Readiness is the list of blockers the engine returns."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <AsOfSlider offset={offset} onChange={setOffset} />
      <div className="mt-3">
        {mode === 'register' && <ClauseMode reg={reg} tries={tries} choice={choice} onChoice={setChoice} flags={flags} onFlag={onFlag} />}
        {mode === 'independence' && <IndependenceMode ind={ind} lead={lead} onLead={setLead} examine={examine} />}
        {mode === 'coverage' && <CoverageMode cov={cov} cycle={cycle} onCycle={setCycle} overrides={overrides} onOverride={onOverride} />}
        {mode === 'findings' && <FindingsMode fnd={fnd} pick={pick} onPick={setPick} age={age} step={step} onStep={setStep} />}
        {mode === 'readiness' && <ReadinessMode rd={rd} certOffset={certShown} onCertOffset={setCertOffset} sweep={sweep} empty={empty} summary={summary} />}
      </div>
      <Note>
        Every status, count, age and verdict on this page is a return value of the vendored isoCompliance module through
        the teaching lab, at the as-of date shown. Every refusal and every blocker is the engine&apos;s own sentence.
      </Note>
    </PanelShell>
  );
};

export default ReadinessExplorer;
