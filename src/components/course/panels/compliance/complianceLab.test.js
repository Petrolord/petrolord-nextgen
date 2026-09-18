// Every value the compliance teaching lab exposes to a panel or to the course
// page is pinned here against the teaching digest
// (tools/course-waves/compliance/digest.txt), which is itself nothing but the
// vendored assurance engines' return values on the IKORO, ABAM and ORASHI
// records at one as-of date.
//
// THE GATES, and each one carries a control that is made to fire:
//
//   AGREEMENT WITH THE DIGEST  every reader's return at the digest's own as-of
//                      date is rebuilt into the digest's own lines, row by row
//                      and sentence by sentence, and each line must appear in the
//                      section that printed it. The control moves one day count
//                      by one and requires the rebuilt line to vanish.
//   THE WAVE INPUTS    read through tools/course-waves/waveInputs.mjs, which
//                      throws and names the file when one is missing. The teaching
//                      records in the lab are compared with compliance_fields.mjs
//                      byte for byte and value for value, the committed copy is
//                      compared with the live wave directory when this machine has
//                      one, and the digest and graded answers are checked against
//                      the sha256 pins in waves.json.
//   THE CLOCK GATE     three ways. Statically, every call the lab makes to an
//                      engine export that reads today passes an argument at that
//                      parameter, with the clock-reading parameters read out of
//                      the engine source by the wave's own clockguard.mjs. At run
//                      time, the whole snapshot is identical under two faked
//                      system dates, with a control proving a bare engine call
//                      does move under them. And no source constructs an empty
//                      Date, reads Date.now, performance.now or Math.random.
//   THE ZONE GATE      the whole snapshot is rebuilt in child processes under
//                      Pacific/Pago_Pago and America/Los_Angeles and must be byte
//                      identical. NEGATIVE CONTROL: each child also builds the
//                      snapshot from a UTC-parsed as-of date, the defect the
//                      calendar module exists to prevent, and that one must differ.
//   THE AS-OF GUARD    a date string handed to a reader as the as-of date is
//                      refused with a TypeError before it reaches the engine.
//   THE GATE RULE      a refused request changes nothing: requestDecision and
//                      requestRemoval hand back the very array they were given.
//   THE RENDER GATE    every mode of every panel renders with nothing and with an
//                      error-shaped object, and every panel renders in every mode
//                      on real data.
//   THE COPY RULE      no em dash, no en dash, no double hyphen and no "X, not Y"
//                      over the sources and over every string the lab hands a
//                      panel, with ONE engine sentence exempt by exact string and
//                      pinned to the vendored engine, and a dead exemption fails.
//   READINESS IS A LIST  nothing on the readiness panel or in its reader is a
//                      percent, a score or a gauge, and certificateExpiring and
//                      certificateExpired never read true together.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
// Members of L and WAVE_FIELDS are read off the namespaces by name at run time,
// which is the point of the value comparison, so import/namespace cannot check
// them statically. The resolution test below proves every engine member resolves.
/* eslint-disable import/namespace */
import * as L from './complianceLab.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir, WAVES,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import * as WAVE_FIELDS from '../../../../../tools/course-waves/compliance/compliance_fields.mjs';
import { clockParamsOf, MODS } from '../../../../../tools/course-waves/compliance/clockguard.mjs';
import RegisterExplorer, * as RE from './RegisterExplorer.jsx';
import PlanExplorer, * as PE from './PlanExplorer.jsx';
import ReadinessExplorer, * as XE from './ReadinessExplorer.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const WAVE_NAME = 'compliance';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
const FIELDS_JSON = fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8');
const FIELDS_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'compliance_fields.mjs'), 'utf8');
const DUMP_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'compliance_dump.mjs'), 'utf8');
const ENGINE_DIR = path.join(ROOT, 'packages/engines/engines/assurance');
const ENGINE_SRC = Object.fromEntries(MODS.map((m) => [m, fs.readFileSync(path.join(ENGINE_DIR, `${m}.js`), 'utf8')]));

const LAB_FILE = 'complianceLab.js';
const PANEL_FILES = ['RegisterExplorer.jsx', 'PlanExplorer.jsx', 'ReadinessExplorer.jsx'];
const SHARED_FILES = ['panelBits.jsx'];
const LEARNING_PAGE = path.resolve(ROOT, 'src/pages/apps/ComplianceLearningPage.jsx');

const sourceOf = (file) => {
  const p = file === 'ComplianceLearningPage.jsx' ? LEARNING_PAGE : path.join(HERE, file);
  if (!fs.existsSync(p)) {
    throw new Error(`source missing: ${file} is named in this suite's file list and is not at ${p}. `
      + 'A renamed or deleted file fails here rather than emptying the gates that read it.');
  }
  return fs.readFileSync(p, 'utf8');
};
const ALL_SOURCES = [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES, 'ComplianceLearningPage.jsx'];
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// ---------------------------------------------------------------------------
// The digest, cut into its sections, and the digest's own ways of printing.
// ---------------------------------------------------------------------------

const SECTIONS = (() => {
  const out = {};
  let n = 0;
  DIGEST.split('\n').forEach((line) => {
    const m = /^# SECTION (\d+):/.exec(line);
    if (m) n = Number(m[1]);
    if (n) (out[n] = out[n] || []).push(line);
  });
  return out;
})();
/** A cell as the digest prints it. */
const c = (v) => {
  if (v === null || v === undefined) return 'none';
  return String(v);
};
const row = (...cells) => `| ${cells.join(' | ')} |`;
const said = (v) => (v.ok ? 'ALLOWED' : `REFUSED: ${v.reason}`);
const verdictLine = (v) => `${v.label}: ${said(v)}`;
const nullWord = (v) => (v === null ? 'null' : v);

/** Every line a section must carry, collected so a failure names them all. */
const pin = (n, lines) => {
  const have = new Set(SECTIONS[n] || []);
  const missing = lines.filter((l) => !have.has(l));
  expect(SECTIONS[n], `the digest has no SECTION ${n}`).toBeTruthy();
  expect(lines.length, `SECTION ${n} was pinned with nothing`).toBeGreaterThan(0);
  expect(missing, `SECTION ${n}: these lines the lab rebuilds are not in the digest`).toEqual([]);
};

const S = L.teachingSurface();

// ---------------------------------------------------------------------------

describe('the wave inputs and the teaching records', () => {
  it('the digest is whole: all twenty-four sections, at the as-of date the lab uses', () => {
    expect(Object.keys(SECTIONS).length).toBe(24);
    expect(DIGEST.split('\n').length).toBeGreaterThan(800);
    expect(DIGEST).toContain(`# AS-OF DATE: ${L.AS_OF_YMD}.`);
    expect(L.ymd(L.AS_OF)).toBe(L.AS_OF_YMD);
  });

  it('the digest and the graded answers are the bytes waves.json pins', () => {
    const pins = WAVES[WAVE_NAME].pins;
    const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
    expect(sha(DIGEST)).toBe(pins['digest.txt']);
    expect(sha(FIELDS_JSON)).toBe(pins['fields.json']);
  });

  it('THE MIRROR GATE: the committed copy is the wave, and this gate says which it compared', () => {
    const named = WAVES[WAVE_NAME].inputs;
    expect(named.length).toBeGreaterThanOrEqual(30);
    named.forEach((f) => expect(fs.existsSync(path.join(WAVE, f)), `${f} is missing from ${WAVE}`).toBe(true));
    if (LIVE_WAVE) {
      const differing = named.filter((f) => {
        const live = path.join(LIVE_WAVE, f);
        return !fs.existsSync(live) || !fs.readFileSync(path.join(MIRROR, f)).equals(fs.readFileSync(live));
      });
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] byte-compared ${named.length} inputs against the LIVE wave directory ${LIVE_WAVE}`);
      expect(differing, `the committed copy has drifted from ${LIVE_WAVE}`).toEqual([]);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] no live wave directory on this machine, so the committed copy at ${MIRROR} was checked for completeness`);
      expect(path.resolve(WAVE)).toBe(path.resolve(MIRROR));
    }
  });

  it('the teaching records are copied VERBATIM from compliance_fields.mjs, byte for byte', () => {
    const lab = sourceOf(LAB_FILE);
    const begin = '// ---- BEGIN VERBATIM compliance_fields.mjs ----\n';
    const end = '// ---- END VERBATIM compliance_fields.mjs ----';
    expect(lab).toContain(begin);
    expect(lab).toContain(end);
    const block = lab.slice(lab.indexOf(begin) + begin.length, lab.indexOf(end));
    const wave = FIELDS_MJS.slice(FIELDS_MJS.indexOf('export const AS_OF_YMD'));
    expect(wave.length, 'the wave file carries almost nothing').toBeGreaterThan(20000);
    expect(block).toBe(wave);
    expect(DUMP_MJS).toContain("import * as F from './compliance_fields.mjs';");
  });

  it('and they AGREE IN VALUE with the wave file when run, not only as text', () => {
    const names = Object.keys(WAVE_FIELDS);
    expect(names.length).toBeGreaterThanOrEqual(40);
    const differing = names.filter((k) => JSON.stringify(L[k]) !== JSON.stringify(WAVE_FIELDS[k]));
    expect(differing).toEqual([]);
    expect(L.AS_OF.getTime()).toBe(WAVE_FIELDS.AS_OF.getTime());
  });

  it('every engine member the lab names resolves in the vendored modules', () => {
    const code = strip(sourceOf(LAB_FILE));
    const used = [...code.matchAll(/\b(CAL|C|D|Q|A|I)\.([A-Za-z_]\w*)/g)].map((m) => [m[1], m[2]]);
    expect(used.length).toBeGreaterThan(150);
    const missing = used.filter(([ns, name]) => L.ENGINE[ns][name] === undefined).map(([ns, n]) => `${ns}.${n}`);
    expect([...new Set(missing)]).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// AGREEMENT WITH THE DIGEST, section by section.
// ---------------------------------------------------------------------------

describe('AGREEMENT WITH THE DIGEST: every reader, rebuilt into the digest\'s own lines', () => {
  it('SECTION 1, the vocabularies', () => {
    const v = S.vocabulary;
    pin(1, [
      `complianceStatus.LIFECYCLES: ${v.lifecycles.join(', ')}`,
      `complianceStatus.STATUS_SEVERITY, worst first: ${v.statusSeverity.join(', ')}`,
      `complianceStatus.ATTENTION_STATUSES: ${v.attention.join(', ')}`,
      `complianceStatus.FREQUENCIES: ${v.frequencies.join(', ')}`,
      `complianceStatus.DEFAULT_LEAD_TIME_DAYS: ${v.defaultLeadTimeDays}`,
      `documentControl.DOC_STATUSES: ${v.docStatuses.join(', ')}`,
      `documentControl.EFFECTIVE_STATUSES (in force): ${v.inForce.join(', ')}`,
      `documentControl review states: ${v.reviewStates.join(', ')}`,
      `documentControl.REVIEW_LEAD_DAYS: ${v.reviewLeadDays}`,
      `documentControl.DEFAULT_REVIEW_PERIOD_MONTHS: ${v.defaultReviewPeriodMonths}`,
      `qualityAssurance.POINT_TYPES: ${v.pointTypes.join(', ')}`,
      `qualityAssurance.BLOCKING_POINT_TYPES (stop work): ${v.blockingPointTypes.join(', ')}`,
      `qualityAssurance.CHECKPOINT_RESOLVED_STATUSES: ${v.resolvedStatuses.join(', ')}`,
      `qualityAssurance.NCR_SEVERITIES: ${v.ncrSeverities.join(', ')}`,
      `isoCompliance.CLAUSE_STATUSES: ${v.clauseStatuses.join(', ')}`,
      `isoCompliance.COVERING_AUDIT_TYPES: ${v.coveringAuditTypes.join(', ')}`,
      `isoCompliance.COVERAGE_COUNTING_STATUSES: ${v.coverageCountingStatuses.join(', ')}`,
      `isoCompliance.CERTIFICATE_LEAD_DAYS: ${v.certificateLeadDays}`,
    ]);
    // Two lists the panels offer as controls are not printed whole by the digest.
    // Every member the digest does print is in them, and nothing else is claimed.
    ['Internal', 'Surveillance'].forEach((t) => expect(v.isoAuditTypes).toContain(t));
    ['Passed', 'Failed', 'Waived', 'Not applicable', 'Pending', 'In progress', 'Notified'].forEach((t) => expect(v.checkpointStatuses).toContain(t));
    expect(S.auditWalk.workflow.map((w) => w.status)).toEqual(v.auditStatuses);
  });

  it('SECTION 2, the calendar and the unreadable today', () => {
    const k = S.calendarAt;
    const u = S.unreadableTodayContract;
    pin(2, [
      ...k.rows.map((r) => row(r.input === '' ? '(empty)' : r.input, nullWord(r.parsed), c(r.daysUntil))),
      `daysUntil of the as-of date itself: ${k.asOfItself}`,
      `complianceStatus.deriveStatus with an unreadable Date as today throws ${u.deriveStatus}`,
      `documentControl.reviewState of a published document whose review date is 2020-01-06, with an unreadable Date as today, returns: ${u.reviewState}`,
      `qualityAssurance.isNcrOverdue of an open NCR due 2020-01-06, with an unreadable Date as today, returns: ${u.isNcrOverdue}`,
      `documentControl.reviewState with today passed as the STRING ${L.AS_OF_YMD} throws ${u.reviewStateWithAString}`,
    ]);
    expect(k.rows).toHaveLength(10);
  });

  it('SECTION 3, the register, every reason verbatim, the precedence and the One-off rows', () => {
    const g = S.registerAt;
    expect(g.rows).toHaveLength(13);
    pin(3, [
      ...g.rows.map((r) => row(r.code, r.title, r.lifecycle, r.frequency, c(r.due), c(r.expiry), c(r.lastFiled), r.leadTime, c(r.nextAction), c(r.daysUntil), r.status)),
      ...g.rows.map((r) => `${r.code}: ${r.reason}`),
      ...S.precedenceAt.map((p) => row(p.label, p.status, c(p.daysUntil))),
      ...g.rows.filter((r) => r.frequency === 'One-off' && r.lifecycle === 'Active').map((r) => row(r.code, c(r.lastFiled), r.status, c(r.daysUntil))),
    ]);
    // The filed One-off's reason, the rule this course teaches as current.
    expect(g.rows.find((r) => r.code === 'REG-2026-006').reason).toBe('Filed 2026-08-10. A one-off obligation, nothing further is due.');
    // Derived: the expiry is marked as the next action exactly where it is the earlier date.
    expect(g.rows.filter((r) => r.nextActionIsExpiryDerived).map((r) => r.code)).toEqual(['REG-2026-001', 'REG-2026-005']);
  });

  it('SECTION 4, the lead time, and the edge the panel draws', () => {
    const t = S.leadTimeAt;
    pin(4, [
      `${t.code}, the quarterly flare and venting return, is due ${t.due}: ${t.daysUntil} days after the as-of date. Its recorded lead time is ${t.recorded}. Only the lead time is varied below.`,
      ...t.rows.map((r) => row(r.given, r.status)),
      `With no usable lead time the engine uses DEFAULT_LEAD_TIME_DAYS, ${t.defaultLeadTimeDays}.`,
    ]);
    const cv = S.leadTimeCurve;
    expect(cv.status).toBe(t.rows.find((r) => r.given === '14').status);
    // The edge the panel draws sits exactly at the day count the digest prints.
    expect(cv.edgeDerived).toBe(t.daysUntil);
    expect(cv.curve.find((p) => p.lead === t.daysUntil).status).toBe(t.rows.find((r) => r.given === String(t.daysUntil)).status);
  });

  it('SECTION 5, the current period, and the filing marked inside or outside it', () => {
    const p = S.periodAt;
    pin(5, [
      `periodStart is one frequency before the next due date, pulled back to the last day of the month when that month is shorter. For a due date of ${p.periodDue}:`,
      ...p.frequencies.map((r) => row(r.frequency, c(r.periodStart), c(r.daysUntil))),
      ...p.filings.map((r) => row(r.code, r.frequency, r.due, c(r.periodStart), c(r.lastFiled), r.status)),
      `${p.oneDayLater.code} filed one day later, on ${p.oneDayLater.filed}, the first day of its period:`,
      `status ${p.oneDayLater.status}; ${p.oneDayLater.reason}`,
    ]);
    // Derived inside or outside agrees with what the engine concluded from it.
    p.filings.forEach((f) => expect(f.filedInsideDerived, f.code).toBe(f.status === 'Compliant'));
  });

  it('SECTION 6, rolling forward from the date that was due', () => {
    const r0 = S.rollAt;
    const lf = r0.lateFiling;
    pin(6, [
      `rollForward from a due date of ${r0.rollFrom}, by every frequency:`,
      ...r0.byFrequency.map((r) => row(r.frequency, c(r.next), c(r.daysUntil))),
      ...r0.monthEnds.map((r) => row(r.due, r.frequency, r.next)),
      `${lf.code} was due ${lf.due} and is filed on ${lf.filed}. The app rolls from the date that was due: rollForward(${lf.due}, ${lf.frequency}) = ${lf.fromDue}.`,
      `The same call on the filing date would give ${lf.fromFilingNotUsed}. The Regulatory Compliance app passes the due date to rollForward when a filing is recorded, so this second date is the one the schedule would walk to if it rolled from the filing.`,
      `After the filing is recorded and the due date rolled: status ${lf.after.status}, next action ${lf.after.nextAction}, ${lf.after.daysUntil} days.`,
    ]);
    expect(lf.fromDueDays).toBe(lf.after.daysUntil);
  });

  it('SECTION 7, the register summarised and sorted worst first', () => {
    const g = S.registerAt;
    pin(7, [
      `summarise over the ${g.total} IKORO obligations:`,
      ...g.byStatus.map((s) => row(s.status, s.count)),
      `attention (Expired + Overdue + Due soon): ${g.attention}`,
      ...g.byUrgency.map((u) => row(u.order, u.code, u.status, c(u.nextAction))),
      ...g.byRegime.map((x) => `${x.name}: ${x.count}`),
    ]);
  });

  it('SECTION 8, the library, the review dates, revisions and who may review', () => {
    const b = S.libraryAt;
    const rv = S.reviewDatesAt;
    const dr = S.documentRules;
    const q = (x) => {
      if (x === null) return 'null';
      if (x === '') return "'' (empty)";
      return `'${x}'`;
    };
    pin(8, [
      ...b.rows.map((r) => row(r.number, r.title, r.status, c(r.nextReview), c(r.daysUntil), r.reviewState)),
      `A published document whose review date is the text tbc: ${b.tbc}`,
      ...rv.rows.map((r) => row(r.issue, r.months, c(r.next), c(r.daysUntil))),
      `A correction re-published on ${rv.correction.republished} to a document issued ${rv.correction.issue}, on a ${rv.correction.months} month period: counted from the issue date the review falls on ${rv.correction.fromIssue}; counted from the correction it would fall on ${rv.correction.fromCorrectionNotUsed}.`,
      ...dr.revisions.map((x) => row(q(x.current), `'${x.next}'`)),
      ...dr.prefixes.map((x) => `'${x.department}', '${x.category}' gives ${x.prefix}`),
      ...dr.confidentiality.map((x) => `${x.level}: ${x.atLeastConfidential}`),
      `Segregation of duties on revision ${dr.revision.id}, authored by ${dr.revision.created_by}:`,
      ...dr.segregation.map(verdictLine),
    ]);
  });

  it('SECTION 9, the library summarised and the review queue', () => {
    const b = S.libraryAt;
    pin(9, [
      `summarise over the ${b.total} IKORO documents: in review ${b.inReview}, published ${b.published}, review overdue ${b.overdue}, review due soon ${b.dueSoon}.`,
      ...b.byStatus.map((s) => row(s.status, s.count)),
      ...b.byReviewUrgency.map((u) => row(u.order, u.number, u.reviewState, c(u.nextReview))),
    ]);
  });

  it('SECTION 10, the plan as cards, and every canned request as recorded', () => {
    const p = S.planAt;
    pin(10, [
      `${p.plan.code}, ${L.ABAM_PLAN.title}, status ${p.plan.status}. Its twelve points at the as-of date:`,
      ...p.cards.map((k) => row(k.item, k.title, k.type, k.status, k.stopsWork, k.resolved, k.planned, k.overdue)),
      ...S.planRequestsAsRecorded.decisions.map(verdictLine),
    ]);
  });

  it('SECTION 11, progress, the closure walk, removals, raising and the workflow', () => {
    const p = S.planAt.progress;
    const w = S.planClosureWalk;
    const [a, b, c3] = w.atTheEnd.stillOpen;
    pin(11, [
      `planProgress over ${S.planAt.plan.code}: total ${p.total}, resolved ${p.resolved}, failed ${p.failed}, outstanding ${p.outstanding}, hold points ${p.holdPoints}, hold points outstanding ${p.holdPointsOutstanding}, percent ${p.percent}.`,
      `planProgress over a plan with no points: percent ${nullWord(S.planAt.emptyPlanPercent)}.`,
      ...w.steps.map(verdictLine),
      `At that point planProgress reads resolved ${w.atTheEnd.resolved} of ${w.atTheEnd.total}, percent ${w.atTheEnd.percent}, and ${a}, ${b} and ${c3} are still open.`,
      ...S.planRequestsAsRecorded.removals.map(verdictLine),
      ...w.raise.map(verdictLine),
      ...w.workflow.map((x) => `${x.status}: ${x.next.join(', ') || 'final'}`),
      verdictLine(w.draftToClosed),
    ]);
    expect(w.atTheEnd.stillOpen).toHaveLength(3);
  });

  it('SECTION 12, the plan end to end', () => {
    const p = S.planAt;
    pin(12, [
      `${p.progress.resolved} of ${p.progress.total} points resolved, ${p.progress.percent} percent. Hold points: ${p.holds.map((h) => `${h.item} ${h.status}`).join(', ')}.`,
      `Overdue points at the as-of date: ${p.overdueItems.join(', ')}.`,
      `summarise: checkpoints ${p.summary.checkpoints}, outstanding ${p.summary.outstanding}, overdue ${p.summary.overdue}, hold points outstanding ${p.summary.holdPointsOutstanding}, failed ${p.summary.failed}.`,
    ]);
  });

  it('SECTION 13, the NCRs, their actions and both closure walks', () => {
    const n = S.ncrsAt;
    const w = S.ncrClosureWalk;
    pin(13, [
      ...n.rows.map((r) => row(r.code, r.title, r.severity, r.status, r.raised, c(r.due), c(r.disposition), r.open, r.overdue)),
      ...n.capas.map((k) => row(k.id, k.ncr, k.type, k.status, k.due, k.open, k.overdue, k.verified, k.ineffective)),
      ...w.major.map(verdictLine),
      ...w.minor.map(verdictLine),
      ...n.rows.map((r) => verdictLine(r.closure)),
    ]);
  });

  it('SECTION 14, ages, bands, ageing and what the dashboard counts', () => {
    const n = S.ncrsAt;
    const s = n.summary;
    pin(14, [
      ...n.rows.map((r) => row(r.code, r.status, r.raised, c(r.closed), c(r.age), c(r.band))),
      ...S.ageBandEdges.map((e) => `${e.days} days: ${nullWord(e.band)}`),
      ...n.ageing.map((r) => row(r.band, r.Critical, r.Major, r.Minor, r.Observation)),
      `summarise: NCRs ${s.ncrs}, open ${s.open}, overdue ${s.overdue}, serious and open ${s.seriousOpen}, concessions ${s.concessions}, oldest open ${s.oldestOpen} days, mean open age ${s.meanOpen} days.`,
      `the open ages it averages: ${n.openAges.join(', ')}; their sum ${n.openAges.reduce((x, y) => x + y, 0)} over ${n.openAges.length}.`,
      `actions: ${s.capas} in total, open ${s.openCapas}, overdue ${s.overdueCapas}, awaiting an effectiveness check ${s.awaitingEffectiveness}, verified effective ${s.verifiedEffective}, found ineffective ${s.foundIneffective}.`,
      `${n.onVoided.ids.join(', ')} sits on ${n.onVoided.ncr}, which is Voided: isCapaOpen reads ${n.onVoided.open.join(', ')} and isCapaOverdue reads ${n.onVoided.overdue.join(', ')}, and summarise leaves it out of the open and overdue counts.`,
      `The same actions summarised with no NCRs supplied: open ${n.withNoNcrs.openCapas}, overdue ${n.withNoNcrs.overdueCapas}. A child whose parent is not supplied counts.`,
      `The same points summarised under the plan marked Closed: outstanding ${n.underAClosedPlan.outstanding}, overdue ${n.underAClosedPlan.overdue}, failed ${n.underAClosedPlan.failed}.`,
      ...n.byUrgency.map((u) => row(u.order, u.code, u.severity, u.status, u.overdue)),
    ]);
  });

  it('SECTION 15, the checklist and raising a finding', () => {
    const k = S.checklistAt;
    const p = k.progress;
    pin(15, [
      `${k.audit.code}, ${k.audit.title}, status ${k.audit.status}, ${k.audit.questions} checklist questions.`,
      ...k.rows.map((r) => row(r.item, r.question, r.criticality, r.result, r.note, r.answered)),
      `checklistProgress: total ${p.total}, answered ${p.answered}, outstanding ${p.outstanding}, conformant ${p.conformant}, nonconformant ${p.nonconformant}, observations ${p.observations}, notApplicable ${p.notApplicable}, percent ${p.percent}.`,
      `checklistProgress with no checklist at all: percent ${nullWord(k.emptyPercent)}.`,
      `unansweredItems: ${k.unanswered.join(', ')}`,
      `criticalAnswersWithoutFindings, with finding ${k.findingCode} raised from item 2: ${k.criticalWithoutFinding.join(', ')}`,
      `the same with that finding Voided: ${k.criticalWithoutFindingIfVoided.join(', ')}`,
      ...k.raise.map(verdictLine),
    ]);
  });

  it('SECTION 16, the audit lifecycle, the report walk and independence', () => {
    const w = S.auditWalk;
    pin(16, [
      ...w.workflow.map((x) => `${x.status}: ${x.next.join(', ') || 'final'}`),
      ...w.report.map(verdictLine),
      ...w.close.map(verdictLine),
      ...w.cancel.map(verdictLine),
      ...w.independence.map(verdictLine),
      ...w.overdueByStatus.map((o) => `${o.status}: ${o.overdue}`),
    ]);
  });

  it('SECTION 17, the programme', () => {
    const g = S.programmeAt;
    const p = g.progress;
    const s = g.summary;
    pin(17, [
      ...g.rows.map((r) => row(r.code, r.status, r.plannedEnd, r.overdue)),
      `programmeProgress: total ${p.total}, reported ${p.reported}, cancelled ${p.cancelled}, outstanding ${p.outstanding}, overdue ${p.overdue}, percent ${p.percent}.`,
      `programmeProgress over no audits: percent ${nullWord(g.emptyPercent)}.`,
      ...g.complete.map(verdictLine),
      ...g.workflow.map((x) => `${x.status}: ${x.next.join(', ') || 'final'}`),
      ...g.approve.map(verdictLine),
      `summarise over the programme, the ${s.audits} audits, the ${s.responses} recorded answers and the finding: audits outstanding ${s.auditsOutstanding}, overdue ${s.auditsOverdue}, reported ${s.auditsReported}, cancelled ${s.auditsCancelled}, answers ${s.answers}, answers outstanding ${s.answersOutstanding}, nonconformances ${s.nonconformances}, notApplicable ${s.notApplicable}, open findings ${s.openFindings}, open major ${s.openMajor}, stop-work open ${s.stopWorkOpen}.`,
    ]);
  });

  it('SECTION 18, the clause register, and every try with the register\'s standard passed', () => {
    const g = S.clauseRegisterAt;
    const t = S.clauseStatusTries;
    pin(18, [
      `${g.standard.code} at ORASHI, ${g.standard.certification}, certification cycle ${g.standard.cycleYears} years, certificate expires ${g.standard.expires}.`,
      ...g.rows.map((r) => row(r.clause, r.title, r.applicability, r.status, r.owner, r.claims, r.evidence, r.assessed, c(r.nextReview), r.reviewOverdue, r.reviewDueSoon)),
      ...t.tries.map(verdictLine),
      ...t.byStandard.map(verdictLine),
    ]);
    // The refusal names the register's own standard, because the lab passed it.
    expect(t.tries.find((x) => x.label.includes('no justification')).reason).toContain('ISO 14001:2015');
  });

  it('SECTION 19, the lead auditor picker and the examiner check', () => {
    const inds = S.independence;
    const scope = inds[0].scope;
    pin(19, [
      `A planned internal audit with clauses ${scope.map((x) => x.clause).join(', ')} in scope. Owners: ${scope.map((x) => `${x.clause} ${x.owner}`).join(', ')}.`,
      ...inds.filter((x) => x.lead !== 'external').map((x) => `lead auditor ${x.lead}: ${x.ok ? 'ALLOWED' : `REFUSED: ${x.reason} Clauses named: ${x.clausesNamed.join(', ')}.`}`),
      `an external lead auditor named in text: ${inds.find((x) => x.lead === 'external').ok ? 'ALLOWED' : 'REFUSED'}`,
      ...S.examineChecks.map(verdictLine),
    ]);
  });

  it('SECTION 20, coverage over the cycle', () => {
    const v = S.coverageAt;
    pin(20, [
      ...v.audits.map((a) => row(a.code, a.type, a.status, c(a.ended), a.counts)),
      `clauseCoverage over the ${v.applicable} applicable clauses, cycle ${v.cycleYears} years:`,
      ...v.rows.map((r) => row(r.clause, r.lastExamined || 'never', c(r.daysUntil), c(r.byAudit), c(r.result), r.covered, r.stale)),
      ...v.byCycle.map((x) => row(x.cycleYears, x.covered, x.stale, x.never)),
      ...v.byStandard.map((x) => row(x.standard, x.clause, x.lastExamined, x.covered, x.stale)),
    ]);
  });

  it('SECTION 21, findings, actions, the closure walk and the ISO audit gates', () => {
    const f = S.findingsAt;
    pin(21, [
      ...f.rows.map((r) => row(r.code, r.type, r.status, r.raised, c(r.due), c(r.closed), r.open, r.overdue, c(r.age))),
      ...f.actions.map((a) => row(a.id, a.finding, a.type, a.status, a.due, a.open, a.overdue, a.verified)),
      ...f.rows.map((r) => verdictLine(r.closure)),
      ...f.ladder.map(verdictLine),
      ...f.minorAndObservation.map(verdictLine),
      ...f.byUrgency.map((u) => row(u.order, u.code, u.type, u.status, u.overdue)),
      `the two AUDIT_TRANSITIONS tables agree on every status: ${f.transitionsAgree}`,
      ...f.overdueByStatus.map((o) => `${o.status}: ${o.overdue}`),
      ...f.report.map(verdictLine),
    ]);
  });

  it('SECTION 22, readiness as a list, the certificate edges, the summary', () => {
    const r0 = S.readinessAt;
    const e = S.emptyStandardReadiness;
    const s = S.isoSummaryAt;
    pin(22, [
      `certificationReadiness for ${r0.standard} at ORASHI: ready ${r0.ready}.`,
      ...r0.blockers.map((b) => row(b.severity, b.count, b.text)),
      ...r0.counts.map((x) => row(x.key, nullWord(x.value))),
      ...S.certificateSweep.map((x) => row(nullWord(x.expires), nullWord(x.days), x.expiring, x.expired, x.item ? `${x.item.severity}: ${x.item.text}` : 'none')),
      `A standard with no clauses in the register: ready ${e.ready}; ${e.blockers.map((b) => `${b.severity} (count ${b.count}): ${b.text}`).join(' ')}`,
      `summarise over the same register: clauses ${s.clauses}, applicable ${s.applicable}, excluded ${s.excluded}, evidenced claims ${s.evidencedClaims}, unevidenced claims ${s.unevidencedClaims}, notAssessed ${s.notAssessed}, reviews overdue ${s.reviewsOverdue}, reviews due soon ${s.reviewsDueSoon}, audits ${s.audits}, audits open ${s.auditsOpen}, audits overdue ${s.auditsOverdue}, clauses covered ${s.clausesCovered}, never audited ${s.neverAudited}, stale ${s.stale}, open findings ${s.openFindings}, open major ${s.openMajor}, findings overdue ${s.findingsOverdue}, open actions ${s.openActions}, overdue actions ${s.overdueActions}, awaiting an effectiveness check ${s.awaitingEffectiveness}.`,
    ]);
  });

  it('NEGATIVE CONTROL: one day count moved by one no longer matches the digest', () => {
    const r = S.registerAt.rows[0];
    const good = row(r.code, r.title, r.lifecycle, r.frequency, c(r.due), c(r.expiry), c(r.lastFiled), r.leadTime, c(r.nextAction), c(r.daysUntil), r.status);
    const bad = row(r.code, r.title, r.lifecycle, r.frequency, c(r.due), c(r.expiry), c(r.lastFiled), r.leadTime, c(r.nextAction), c(r.daysUntil + 1), r.status);
    expect(SECTIONS[3]).toContain(good);
    expect(SECTIONS[3]).not.toContain(bad);
    // And a line placed in the wrong section is not found there.
    expect(SECTIONS[7] || []).not.toContain(good);
  });
});

// ---------------------------------------------------------------------------
// The readers the panels move, beyond the digest's own date.
// ---------------------------------------------------------------------------

describe('the controls the panels move', () => {
  it('a status timeline agrees with the register at the digest\'s date, and its edges are where the engine changes its word', () => {
    const t = L.statusTimeline('o01', -60, 240);
    const at0 = t.points.find((p) => p.offset === 0);
    const r = S.registerAt.rows.find((x) => x.id === 'o01');
    expect(at0.status).toBe(r.status);
    expect(at0.daysUntil).toBe(r.daysUntil);
    // The permit's expiry overtakes its due date: Due soon until the expiry day,
    // Expired the day after, as the engine reads it.
    const toExpired = t.edgesDerived.find((e) => e.to === 'Expired');
    expect(toExpired.from).toBe('Due soon');
    expect(toExpired.offset).toBe(r.daysUntil + 1);
    // And the monthly return, Overdue at the digest's date, was Due soon before its due date.
    const t2 = L.statusTimeline('o02', -60, 10);
    expect(t2.edgesDerived.some((e) => e.from === 'Due soon' && e.to === 'Overdue')).toBe(true);
    expect(L.statusTimeline('no-such-id')).toBeNull();
  });

  it('the as-of control builds local midnights from three numbers', () => {
    expect(L.ymd(L.asOfAt(0))).toBe(L.AS_OF_YMD);
    expect(L.ymd(L.asOfAt(17))).toBe('2026-11-01');
    expect(L.ymd(L.asOfAt(-15))).toBe('2026-09-30');
    expect(L.asOfAt(1).getHours()).toBe(0);
    expect(L.offsetOf(L.asOfAt(-42))).toBe(-42);
    expect(L.dateOf('2026-02-30')).toBeNull();
    expect(L.ymd(L.dateOf('2028-02-29'))).toBe('2028-02-29');
    expect(L.localMidnight(2026, 10, 15).getTime()).toBe(L.AS_OF.getTime());
  });

  it('THE AS-OF GUARD: a date string never reaches the engine', () => {
    ['2026-10-15', '', null, 20261015, new Date(Number.NaN)].forEach((bad) => {
      expect(() => L.registerAt(bad)).toThrow(TypeError);
      expect(() => L.readinessAt({}, bad)).toThrow(TypeError);
    });
    // CONTROL: the engine itself throws on a string today, which is why the lab refuses first.
    expect(() => L.ENGINE.D.reviewState({ status: 'Published', next_review_date: '2026-11-02' }, L.AS_OF_YMD)).toThrow(TypeError);
    // And every dated reader refuses it, so none of them can be the one that forgets.
    L.DATED_READERS.forEach((name) => expect(() => L[name]('2026-10-15'), name).toThrow(TypeError));
  });

  it('THE GATE RULE: a refused request changes nothing, an allowed one changes only its point', () => {
    const start = L.initialPoints();
    let refusedSeen = 0;
    let allowedSeen = 0;
    L.ABAM_DECISIONS.forEach((d, i) => {
      const res = L.requestDecision(start, d.item, d.status, d.patch);
      const expected = S.planRequestsAsRecorded.decisions[i];
      expect(res.ok, d.label).toBe(expected.ok);
      if (res.ok) {
        allowedSeen += 1;
        expect(res.points).not.toBe(start);
        expect(res.points.find((x) => x.id === d.item).status).toBe(d.status);
        expect(res.points.filter((x) => x.id !== d.item)).toEqual(start.filter((x) => x.id !== d.item));
      } else {
        refusedSeen += 1;
        expect(res.points, `${d.label} changed the plan although it was refused`).toBe(start);
        expect(res.reason).toBe(expected.reason);
      }
    });
    expect(refusedSeen).toBeGreaterThan(0);
    expect(allowedSeen).toBeGreaterThan(0);
    L.ABAM_REMOVALS.forEach((r, i) => {
      const res = L.requestRemoval(start, r.item, r.plan);
      const expected = S.planRequestsAsRecorded.removals[i];
      expect(res.ok, r.label).toBe(expected.ok);
      if (res.ok) expect(res.points).toHaveLength(start.length - 1);
      else expect(res.points).toBe(start);
    });
    // Progress is recounted by the engine from the cards: passing H-08 properly moves it.
    const ok = L.requestDecision(start, 'c08', 'Passed', { result_date: '2026-10-15', verified_by: 'u-ifeoma' });
    expect(L.planAt(ok.points).progress.resolved).toBe(L.planAt(start).progress.resolved + 1);
  });

  it('the live closure check agrees with the digest walk at both ends', () => {
    expect(L.planClosureOf(L.initialPoints()).reason).toBe(S.planClosureWalk.steps[0].reason);
    let pts = L.initialPoints().map((p) => (['c05', 'c08', 'c11'].includes(p.id) ? { ...p, status: 'Passed' } : p));
    expect(L.planClosureOf(pts, false).ok).toBe(false);
    expect(L.planClosureOf(pts, true).ok).toBe(true);
    pts = null;
    expect(L.planClosureOf(pts).ok).toBe(false);
  });

  it('COVERAGE MOVES AS THE ENGINE MOVES IT: a certification body, an audit in progress and a cancelled audit never count', () => {
    const base = L.coverageAt();
    const rowOf = (cov, ref) => cov.rows.find((r) => r.clause === ref);
    expect(rowOf(base, '6.1.2').covered).toBe(false);
    // The surveillance audit made Internal starts to count, and 6.1.2 is covered.
    const asInternal = L.coverageAt({ overrides: { 'cb-2026': { audit_type: 'Internal' } } });
    expect(asInternal.audits.find((a) => a.id === 'cb-2026').counts).toBe(true);
    expect(rowOf(asInternal, '6.1.2').covered).toBe(true);
    // The Reported audit set back to In progress stops counting, and 10.2 loses its examination.
    const inProgress = L.coverageAt({ overrides: { 'ia-2026a': { status: 'In progress' } } });
    expect(inProgress.audits.find((a) => a.id === 'ia-2026a').counts).toBe(false);
    expect(rowOf(inProgress, '10.2').lastExamined).toBeNull();
    // A Closed internal audit cancelled stops counting too.
    const cancelled = L.coverageAt({ overrides: { 'ia-2024': { status: 'Cancelled' } } });
    expect(rowOf(cancelled, '8.1').covered).toBe(false);
    // And readiness reads the same changed audits.
    const neverBase = L.readinessAt().counts.find((x) => x.key === 'neverAudited').value;
    const neverInternal = L.readinessAt({ overrides: { 'cb-2026': { audit_type: 'Internal' } } }).counts.find((x) => x.key === 'neverAudited').value;
    expect(neverInternal).toBe(neverBase - 1);
  });

  it('the lead auditor picker names the owned clauses when the engine refuses', () => {
    const k = L.independenceOf('u-kalu');
    expect(k.ok).toBe(false);
    expect(k.clausesNamed).toEqual(['8.1', '8.2']);
    expect(L.independenceOf('u-chidi').ok).toBe(true);
    expect(L.independenceOf('external').ok).toBe(true);
  });

  it('every call to canSetClauseStatus in the lab passes FOUR arguments, the standard last', () => {
    const code = strip(sourceOf(LAB_FILE));
    const calls = callsIn(code, 'I', 'canSetClauseStatus');
    expect(calls.length).toBeGreaterThanOrEqual(3);
    calls.forEach((args) => expect(args.length, args.join(', ')).toBe(4));
    expect(L.setClauseStatus('Not applicable', { applicability: 'Not applicable' }).reason).toContain('ISO 14001:2015');
  });

  it('a finding\'s age stops at its closed date, and an open one keeps ageing', () => {
    const closed = L.findingAgeOf('ISF-2026-001');
    expect(L.findingAgeOf('ISF-2026-001', L.asOfAt(100)).age).toBe(closed.age);
    const open = L.findingAgeOf('ISF-2026-004');
    expect(L.findingAgeOf('ISF-2026-004', L.asOfAt(10)).age).toBe(open.age + 10);
    expect(open.age).toBe(S.findingsAt.rows.find((r) => r.code === 'ISF-2026-004').age);
    expect(L.findingAgeOf('nothing')).toBeNull();
  });

  it('READINESS IS A LIST: expiring and expired never read true together, and the edges fall where the digest prints them', () => {
    let both = 0;
    const seen = new Set();
    for (let n = -120; n <= 200; n += 1) {
      const r = L.readinessAt({ certificateExpires: L.ymd(L.asOfAt(n)) });
      if (r.certificateExpiring && r.certificateExpired) both += 1;
      seen.add(`${r.certificateExpiring}/${r.certificateExpired}/${r.certificateItem ? r.certificateItem.severity : 'none'}`);
      expect(r.certificateDays).toBe(n);
    }
    expect(both).toBe(0);
    expect([...seen].sort()).toEqual(['false/false/none', 'false/true/serious', 'true/false/watch']);
    const lead = S.vocabulary.certificateLeadDays;
    expect(L.readinessAt({ certificateExpires: L.ymd(L.asOfAt(lead)) }).certificateExpiring).toBe(true);
    expect(L.readinessAt({ certificateExpires: L.ymd(L.asOfAt(lead + 1)) }).certificateExpiring).toBe(false);
    expect(L.readinessAt({ certificateExpires: L.ymd(L.asOfAt(-1)) }).certificateExpired).toBe(true);
    // Nothing the readiness reader returns is a percent or a score.
    const keys = JSON.stringify(S.readinessAt).match(/"(\w+)":/g) || [];
    expect(keys.filter((k) => /percent|score|gauge|ratio/i.test(k))).toEqual([]);
  });

  it('the readiness panel draws no percent, score or gauge', () => {
    const code = strip(sourceOf('ReadinessExplorer.jsx')).replace(/"100%"/g, '');
    expect(code).not.toMatch(/percent|score|gauge|%|RadialBar|PieChart|Progress/i);
    // CONTROL: the same test fires on a planted percent.
    expect('<Tile value={`${x} percent`} />').toMatch(/percent/i);
  });
});

// ---------------------------------------------------------------------------
// THE SURFACE: plain data, no Date object, nothing undefined.
// ---------------------------------------------------------------------------

const walk = (v, p, visit) => {
  visit(v, p);
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, visit));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${p}.${k}`, visit));
};

describe('the surface a panel reads is plain data', () => {
  it('no Date object, no NaN and no undefined anywhere in it', () => {
    const bad = [];
    let leaves = 0;
    walk(S, 'S', (v, p) => {
      if (Object.prototype.toString.call(v) === '[object Date]') bad.push(`${p} is a Date`);
      if (typeof v === 'number' && !Number.isFinite(v)) bad.push(`${p} is ${v}`);
      if (v === undefined) bad.push(`${p} is undefined`);
      if (v === null || typeof v !== 'object') leaves += 1;
    });
    expect(bad).toEqual([]);
    expect(leaves).toBeGreaterThan(2000);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

const NS_MODULE = { CAL: 'calendar', C: 'complianceStatus', D: 'documentControl', Q: 'qualityAssurance', A: 'auditManagement', I: 'isoCompliance' };

const splitTop = (s) => {
  const out = [];
  let depth = 0;
  let cur = '';
  let quote = null;
  for (const ch of s) {
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
    } else if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      cur += ch;
    } else {
      if ('([{'.includes(ch)) depth += 1;
      if (')]}'.includes(ch)) depth -= 1;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

/** The argument lists of every call ns.name( in a source. */
function callsIn(code, ns, name) {
  const out = [];
  const re = new RegExp(`\\b${ns}\\.${name}\\(`, 'g');
  let m;
  while ((m = re.exec(code))) {
    let i = m.index + m[0].length;
    let depth = 1;
    const start = i;
    while (depth > 0 && i < code.length) {
      if (code[i] === '(') depth += 1;
      if (code[i] === ')') depth -= 1;
      i += 1;
    }
    out.push(splitTop(code.slice(start, i - 1)));
  }
  return out;
}

/** The clock-reading exports, by function identity so an alias is caught too. */
const CLOCK = (() => {
  const byFn = new Map();
  MODS.forEach((mod) => {
    const ns = Object.keys(NS_MODULE).find((k) => NS_MODULE[k] === mod);
    for (const [name, idx] of clockParamsOf(ENGINE_SRC[mod])) byFn.set(L.ENGINE[ns][name], idx);
  });
  return byFn;
})();

/** Every call in a source to a clock-reading export that leaves today out. */
const bareClockCalls = (code) => {
  const found = [];
  const bad = [];
  Object.keys(NS_MODULE).forEach((ns) => {
    Object.keys(L.ENGINE[ns]).forEach((name) => {
      const idx = CLOCK.get(L.ENGINE[ns][name]);
      if (idx === undefined) return;
      callsIn(code, ns, name).forEach((args) => {
        found.push(`${ns}.${name}`);
        if (args.length <= idx || !args[idx]) bad.push(`${ns}.${name}(${args.join(', ')})`);
      });
    });
  });
  return { found, bad };
};

describe('THE CLOCK GATE: nothing reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('the engines carry the clock-reading exports the wave\'s own scan finds', () => {
    expect(CLOCK.size, 'the source scan found too few clock-reading exports').toBeGreaterThanOrEqual(20);
  });

  it('STATICALLY: every lab call to a clock-reading export passes today explicitly', () => {
    const { found, bad } = bareClockCalls(strip(sourceOf(LAB_FILE)));
    expect(found.length, 'the lab makes almost no clock-reading calls, so this gate is vacuous').toBeGreaterThanOrEqual(50);
    expect(bad).toEqual([]);
  });

  it('NEGATIVE CONTROL: a planted bare call is caught, in each shape', () => {
    expect(bareClockCalls('const s = D.reviewState(doc);').bad).toHaveLength(1);
    expect(bareClockCalls('rows.sort(C.byUrgency());').bad).toHaveLength(1);
    expect(bareClockCalls('const d = CAL.daysUntil(x);').bad).toHaveLength(1);
    expect(bareClockCalls('const s = D.reviewState(doc, today);').bad).toHaveLength(0);
  });

  it('AT RUN TIME: the whole snapshot is identical under two faked system dates', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const early = JSON.stringify(L.teachingSurface());
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = JSON.stringify(L.teachingSurface());
    expect(late.length).toBeGreaterThan(50000);
    expect(late).toBe(early);
  });

  it('CONTROL: under the same two faked dates a bare engine call DOES move, so the gate can see one', () => {
    const doc = { status: 'Published', next_review_date: '2026-11-02' };
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const early = L.ENGINE.D.reviewState(doc);
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = L.ENGINE.D.reviewState(doc);
    expect(early).not.toBe(late);
  });

  it('no source constructs an empty Date, and no panel or page constructs one at all', () => {
    ALL_SOURCES.forEach((file) => {
      const code = strip(sourceOf(file));
      expect(code.length, `${file} was stripped to nothing`).toBeGreaterThan(400);
      expect(code, `${file} reads a clock`).not.toMatch(/new Date\(\s*\)|Date\.now|performance\.now|Math\.random/);
      if (file !== LAB_FILE) expect(code, `${file} constructs a date`).not.toMatch(/new Date\(/);
    });
    // CONTROL on the stripper and the pattern.
    const sample = '// new Date() in a comment\nconst x = 1;\n';
    expect(strip(sample)).not.toContain('new Date');
    expect(strip('const now = new Date();\n')).toMatch(/new Date\(\s*\)/);
  });
});

// ---------------------------------------------------------------------------
// THE ZONE GATE, and its negative control.
// ---------------------------------------------------------------------------

const ZONES = ['Pacific/Pago_Pago', 'America/Los_Angeles'];
const CHILD_ZONE = process.env.CQ_TZ_CHILD;
const SIDECAR = process.env.CQ_TZ_SIDECAR;

describe('THE ZONE GATE: the lab reproduces byte for byte west of Greenwich', () => {
  ZONES.forEach((zone) => {
    it(`the whole snapshot under TZ=${zone} is byte-identical`, () => {
      if (CHILD_ZONE) {
        // THE CHILD'S JOB: prove it is west of Greenwich, then hand back its
        // snapshot and the planted one built from a UTC-parsed as-of date.
        expect(CHILD_ZONE).toBe(zone);
        const offsetMinutes = -new Date('2026-10-15T12:00:00Z').getTimezoneOffset();
        expect(offsetMinutes).toBeLessThan(0);
        fs.writeFileSync(SIDECAR, JSON.stringify({
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          offsetMinutes,
          snapshot: JSON.stringify(L.teachingSurface()),
          planted: JSON.stringify(L.teachingSurface(new Date(L.AS_OF_YMD))),
        }));
        return;
      }
      const sidecar = path.join(ROOT, 'node_modules', `.cq-tz-${zone.replace(/\W/g, '_')}.json`);
      if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
      execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
        'run', '--reporter=dot', '--config', 'vitest.config.js',
        'src/components/course/panels/compliance/complianceLab.test.js',
        '-t', `under TZ=${zone} is byte-identical`,
      ], {
        cwd: ROOT,
        env: { ...process.env, TZ: zone, CQ_TZ_CHILD: zone, CQ_TZ_SIDECAR: sidecar },
        stdio: 'pipe',
        timeout: 600000,
      });
      expect(fs.existsSync(sidecar), 'the child wrote no snapshot').toBe(true);
      const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
      fs.unlinkSync(sidecar);
      expect(child.timeZone).toBe(zone);
      expect(child.offsetMinutes).toBeLessThan(0);
      expect(child.snapshot.length).toBeGreaterThan(50000);
      expect(child.snapshot).toBe(JSON.stringify(L.teachingSurface()));
      // NEGATIVE CONTROL: the UTC parse of the as-of date, which is the defect
      // the calendar module exists to prevent, moves the snapshot in that zone.
      expect(child.planted, 'a UTC-parsed as-of date did not move the snapshot, so this gate cannot see the defect').not.toBe(child.snapshot);
    }, 600000);
  });
});

// ---------------------------------------------------------------------------
// THE RENDER GATE.
// ---------------------------------------------------------------------------

const MODE_COMPONENTS = [
  ['RegisterExplorer', RE, RegisterExplorer, ['CalendarMode', 'RegisterMode', 'LeadMode', 'PeriodMode', 'RollMode', 'LibraryMode']],
  ['PlanExplorer', PE, PlanExplorer, ['PlanMode', 'ClosureMode', 'AgeingMode', 'ChecklistMode', 'ProgrammeMode']],
  ['ReadinessExplorer', XE, ReadinessExplorer, ['ClauseMode', 'IndependenceMode', 'CoverageMode', 'FindingsMode', 'ReadinessMode']],
];

describe('THE RENDER GATE', () => {
  it('every mode in a MODES list has a component, and every component is in the list', () => {
    MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
      expect(ns.MODES.length, name).toBe(comps.length);
      comps.forEach((k) => expect(typeof ns[k], `${name}.${k}`).toBe('function'));
    });
  });

  MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
    comps.forEach((k) => {
      it(`${name}.${k} renders its empty state with nothing, and with an error-shaped object`, () => {
        const Comp = ns[k];
        const err = { error: 'nothing' };
        const html1 = renderToStaticMarkup(React.createElement(Comp, { flags: {}, overrides: {} }));
        const props = Object.fromEntries(['cal', 'contract', 'vocab', 'reg', 'prec', 'timeline', 'sweep', 'curve', 'per', 'roll', 'lib', 'rev', 'rules',
          'plan', 'closure', 'walk', 'ncrWalk', 'ncr', 'edges', 'chk', 'prog', 'tries', 'ind', 'examine', 'cov', 'fnd', 'age', 'rd', 'empty', 'summary'].map((p) => [p, err]));
        const html2 = renderToStaticMarkup(React.createElement(Comp, { ...props, flags: {}, overrides: {} }));
        expect(html1.length).toBeGreaterThan(20);
        expect(html2.length).toBeGreaterThan(20);
      });
    });
  });

  // THE MIXED CASE: real data for every prop but one, and that one error-shaped.
  // A mode that guards only its first prop crashes here the moment a secondary
  // reader fails, which is the shape of crash the empty-state test cannot reach.
  const noop = () => {};
  const REAL_PROPS = {
    CalendarMode: () => ({ cal: L.calendarAt(), contract: L.unreadableTodayContract(), vocab: L.vocabulary() }),
    RegisterMode: () => ({ reg: L.registerAt(), prec: L.precedenceAt(), timeline: L.statusTimeline('o01'), pick: 'o01', onPick: noop }),
    LeadMode: () => ({ sweep: L.leadTimeAt(), curve: L.leadTimeCurve(14), lead: 14, onLead: noop }),
    PeriodMode: () => ({ per: L.periodAt(), pick: 'REG-2026-003', onPick: noop }),
    RollMode: () => ({ roll: L.rollAt() }),
    LibraryMode: () => ({ lib: L.libraryAt(), rev: L.reviewDatesAt(), rules: L.documentRules() }),
    PlanMode: () => ({
      plan: L.planAt(), last: null, closure: L.planClosureOf(L.initialPoints()), ncrsClosed: false,
      onRequest: noop, onRemove: noop, onReset: noop, onNcrsClosed: noop,
    }),
    ClosureMode: () => ({ walk: L.planClosureWalk(), ncrWalk: L.ncrClosureWalk(), planAt: 9, onPlanStep: noop, ncrStep: 9, onNcrStep: noop }),
    AgeingMode: () => ({ ncr: L.ncrsAt(), edges: L.ageBandEdges() }),
    ChecklistMode: () => ({ chk: L.checklistAt(), walk: L.auditWalk() }),
    ProgrammeMode: () => ({ prog: L.programmeAt() }),
    ClauseMode: () => ({ reg: L.clauseRegisterAt(), tries: L.clauseStatusTries(), choice: 'Conformant', onChoice: noop, flags: {}, onFlag: noop }),
    IndependenceMode: () => ({ ind: L.independenceOf('u-kalu'), lead: 'u-kalu', onLead: noop, examine: L.examineChecks() }),
    CoverageMode: () => ({ cov: L.coverageAt(), cycle: 3, onCycle: noop, overrides: {}, onOverride: noop }),
    FindingsMode: () => ({ fnd: L.findingsAt(), pick: 'ISF-2026-001', onPick: noop, age: L.findingAgeOf('ISF-2026-001'), step: 9, onStep: noop }),
    ReadinessMode: () => ({ rd: L.readinessAt(), certOffset: 0, onCertOffset: noop, sweep: L.certificateSweep(), empty: L.emptyStandardReadiness(), summary: L.isoSummaryAt() }),
  };

  it('every mode has a real-props builder', () => {
    const all = MODE_COMPONENTS.flatMap(([, , , comps]) => comps);
    expect(Object.keys(REAL_PROPS).sort()).toEqual([...all].sort());
  });

  MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
    comps.forEach((k) => {
      it(`${name}.${k} renders on real data, and with each secondary reader error-shaped in turn`, () => {
        const real = REAL_PROPS[k]();
        const full = renderToStaticMarkup(React.createElement(ns[k], real));
        expect(full.length).toBeGreaterThan(400);
        expect(full).not.toContain('has returned nothing');
        const dataProps = Object.keys(real).filter((p) => real[p] && typeof real[p] === 'object' && !['flags', 'overrides'].includes(p));
        expect(dataProps.length).toBeGreaterThan(0);
        dataProps.forEach((p) => {
          const html = renderToStaticMarkup(React.createElement(ns[k], { ...real, [p]: { error: 'nothing' } }));
          expect(html.length, `${k} with ${p} error-shaped`).toBeGreaterThan(20);
        });
      });
    });
  });

  MODE_COMPONENTS.forEach(([name, ns, Panel]) => {
    ns.MODES.forEach(([mode]) => {
      it(`${name} renders on real data in its ${mode} view`, () => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode: mode }));
        expect(html.length).toBeGreaterThan(1500);
        expect(html).not.toContain('has returned nothing');
      });
    });
  });

  it('every ResponsiveContainer is given a width and a height', () => {
    PANEL_FILES.forEach((f) => {
      const tags = sourceOf(f).match(/<ResponsiveContainer[^>]*>/g) || [];
      tags.forEach((t) => {
        expect(t, f).toContain('width=');
        expect(t, f).toContain('height=');
      });
    });
  });
});

// ---------------------------------------------------------------------------
// THE REFUSAL LITERAL GATE, and THE COPY RULE.
// ---------------------------------------------------------------------------

const reasonsIn = (surface) => {
  const out = [];
  walk(surface, 'S', (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v) && v.ok === false && typeof v.reason === 'string' && v.reason) out.push(v.reason);
  });
  return [...new Set(out)];
};

const stringsIn = (surface) => {
  const out = [];
  walk(surface, 'S', (v, p) => { if (typeof v === 'string') out.push([p, v]); });
  return out;
};

describe('THE REFUSAL LITERAL GATE: every refusal a panel shows is the engine\'s own', () => {
  it('no engine refusal sentence is typed into the lab, a panel or the page', () => {
    const reasons = reasonsIn(S);
    expect(reasons.length, 'the lab returns almost no refusals, so this sweep is vacuous').toBeGreaterThanOrEqual(60);
    ALL_SOURCES.forEach((file) => {
      const text = sourceOf(file);
      const typed = reasons.filter((r) => r.length > 30 && text.includes(r.slice(0, 40)));
      expect(typed, `${file} types an engine refusal`).toEqual([]);
    });
  });
});

const EM = '—';
const EN = '–';
const CONTRASTIVE = /,\s+not\s+\w/;
const breaches = (s) => CONTRASTIVE.test(s) || s.includes(EM) || s.includes(EN) || / -- /.test(s);

/**
 * THE ONE LIVE ENGINE SENTENCE THAT BREACHES THE OWNER COPY RULE, exempt by exact
 * string and pinned to the vendored engine. The lesson task names it: it is a
 * verbatim refusal and is quoted as the engine's words. A dead exemption fails.
 */
const COPY_RULE_EXEMPTIONS = ['A finding that stopped work is a nonconformity, not an observation.'];

describe('THE OWNER COPY RULE: no em dash, no en dash and no contrastive', () => {
  it('no source line breaches it', () => {
    ALL_SOURCES.forEach((file) => {
      const bad = sourceOf(file).split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => breaches(l));
      expect(bad.map(([n, l]) => `${file}:${n}: ${l.trim()}`)).toEqual([]);
    });
  });

  it('CONTROL: the detector fires on all four shapes', () => {
    expect(breaches(`an em dash ${EM} here`)).toBe(true);
    expect(breaches(`a range 1${EN}2`)).toBe(true);
    expect(breaches('a double -- hyphen')).toBe(true);
    expect(breaches('this thing, not that thing')).toBe(true);
    expect(breaches('a clean sentence')).toBe(false);
  });

  it('every string the lab hands a panel obeys it, except the one exempt engine sentence', () => {
    const strings = stringsIn(S);
    expect(strings.length).toBeGreaterThanOrEqual(500);
    const offenders = strings.filter(([, s]) => breaches(s));
    const unexcused = offenders.filter(([, s]) => !COPY_RULE_EXEMPTIONS.some((ex) => s.includes(ex)));
    expect(unexcused.map(([p, s]) => `${p}: ${s}`)).toEqual([]);
  });

  it('A DEAD EXEMPTION FAILS: the exempt sentence is still returned and still in the engine', () => {
    const strings = stringsIn(S).map(([, s]) => s);
    COPY_RULE_EXEMPTIONS.forEach((ex) => {
      expect(strings.some((s) => s.includes(ex)), `"${ex}" matches nothing the lab returns`).toBe(true);
      expect(breaches(ex)).toBe(true);
      expect(ENGINE_SRC.auditManagement + ENGINE_SRC.isoCompliance, `"${ex}" is no longer in the vendored engine`).toContain(ex);
    });
  });
});
