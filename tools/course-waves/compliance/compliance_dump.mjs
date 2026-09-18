// THE COMPLIANCE TEACHING DIGEST GENERATOR. Every figure, date, status word and
// refusal in digest.txt is printed by this file straight out of the vendored
// engines/assurance modules, called on the teaching cases in
// compliance_fields.mjs at ONE fixed as-of date. Nothing is typed: a date is
// formatted by the engine's own toDateOnlyString, a status is the engine's
// word, and a refusal is the engine's own sentence.
//
// THREE GUARDS BUILT INTO THE GENERATOR, so a digest that breaks one of them
// cannot be written at all:
//
//   THE CLOCK GATE. Every export of the six modules that reads a date against
//   "today" takes that date as a parameter defaulting to `new Date()`. Which
//   parameter it is, and at which position, is READ OUT OF THE ENGINE SOURCE,
//   not typed here. Every engine function this file can reach is wrapped, and
//   a call to a clock-reading export that does not pass AS_OF itself, by
//   identity, at that position throws. A digest line that silently fell back
//   to the machine clock is therefore impossible to print. `--plant-clock`
//   makes one deliberate bare call so the gate can be shown to fire.
//
//   THE VERDICT LABELS. refused() asserts the engine said no and prints its
//   own reason; allowed() asserts it said yes. A row cannot be labelled a
//   refusal when the engine allowed it, which is how FC4's dump once printed
//   success fields under a refusal heading.
//
//   THE SECTION OWNERS. Each section's owning tier and module comes from ONE
//   table, SECTION_OWNERS, checked against structure.py's module keys at build
//   time, never typed into a heading.
//
// Usage: node compliance_dump.mjs [--plant-clock]   (build_digest.sh pins TZ)
import fs from 'fs';
import * as F from './compliance_fields.mjs';
import { loadGuarded, MODS } from './clockguard.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.AS_ENGINES || '/root/wt-as-compliance-nextgen/packages/engines';
// CQ_PLANT_UTC is the reproducibility gate's negative control: it builds the
// as-of date by the UTC parse AS3 found (new Date('YYYY-MM-DD') is UTC midnight),
// which moves every day count by one west of Greenwich. Never set in a build.
const AS_OF = process.env.CQ_PLANT_UTC ? new Date(F.AS_OF_YMD) : F.AS_OF;

const { RAW, G, CLOCK, CALLS } = await loadGuarded(ROOT, AS_OF);
const CAL = G.calendar;
const C = G.complianceStatus;
const D = G.documentControl;
const Q = G.qualityAssurance;
const I = G.isoCompliance;
const A = G.auditManagement;

if (process.argv.includes('--plant-clock')) {
  // The negative control: one bare call, which the gate must refuse.
  D.reviewState(F.IKORO_DOCUMENTS[0]);
}

/* ------------------------------------------------------------------ *
 * Output, verdicts and formatting (all formatting of dates is the engine's).
 * ------------------------------------------------------------------ */
const L = [];
const out = (s = '') => L.push(s);
const ymd = (d) => (d === null || d === undefined ? 'none' : CAL.toDateOnlyString(d));
const days = (d) => (d === null || d === undefined ? 'none' : String(d));
let refusedCount = 0; let allowedCount = 0;
const refused = (v, where) => {
  if (!v || v.ok !== false || !String(v.reason || '').trim()) {
    throw new Error(`VERDICT LABEL: ${where} was expected to be REFUSED with a reason, and the engine said ${JSON.stringify(v)}`);
  }
  refusedCount += 1;
  return `REFUSED: ${v.reason}`;
};
const allowed = (v, where) => {
  if (!v || v.ok !== true) throw new Error(`VERDICT LABEL: ${where} was expected to be ALLOWED, and the engine said ${JSON.stringify(v)}`);
  allowedCount += 1;
  return 'ALLOWED';
};
const verdict = (v, expect, where) => (expect ? allowed(v, where) : refused(v, where));
const row = (...cells) => out(`| ${cells.join(' | ')} |`);
const head = (...cells) => { row(...cells); row(...cells.map(() => '---')); };

/* ------------------------------------------------------------------ *
 * THE SECTION OWNERS, one table, checked against structure.py.
 * ------------------------------------------------------------------ */
const SECTION_OWNERS = {
  1: [['beginner', 'm01']], 2: [['beginner', 'm01']], 3: [['beginner', 'm02']], 4: [['beginner', 'm03']],
  5: [['beginner', 'm03']], 6: [['beginner', 'm04']], 7: [['beginner', 'm02'], ['beginner', 'm06']],
  8: [['beginner', 'm05']], 9: [['beginner', 'm05'], ['beginner', 'm06']],
  10: [['intermediate', 'm01']], 11: [['intermediate', 'm01'], ['intermediate', 'm02']],
  12: [['intermediate', 'm02'], ['intermediate', 'm06']], 13: [['intermediate', 'm03']],
  14: [['intermediate', 'm03']], 15: [['intermediate', 'm04']], 16: [['intermediate', 'm05']],
  17: [['intermediate', 'm05'], ['intermediate', 'm06']],
  18: [['advanced', 'm01']], 19: [['advanced', 'm02']], 20: [['advanced', 'm03']], 21: [['advanced', 'm04']],
  22: [['advanced', 'm05'], ['advanced', 'm06']], 23: [['advanced', 'm06']], 24: [['advanced', 'm06']],
};
const TIER_WORD = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };
const structureKeys = (() => {
  const src = fs.readFileSync(`${HERE}structure.py`, 'utf8');
  const keys = new Set(); let tier = null;
  for (const line of src.split('\n')) {
    const t = /^ '(beginner|intermediate|advanced)': \[/.exec(line);
    if (t) tier = t[1];
    const m = /^  \('(m\d\d)-/.exec(line);
    if (m && tier) keys.add(`${tier}:${m[1]}`);
  }
  return keys;
})();
if (structureKeys.size !== 18) throw new Error(`SECTION OWNERS: structure.py yielded ${structureKeys.size} module keys, expected 18`);
let sectionNo = 0;
const section = (title) => {
  sectionNo += 1;
  const own = SECTION_OWNERS[sectionNo];
  if (!own) throw new Error(`SECTION OWNERS: section ${sectionNo} has no owner row`);
  for (const [t, m] of own) {
    if (!structureKeys.has(`${t}:${m}`)) throw new Error(`SECTION OWNERS: section ${sectionNo} names ${t} ${m}, which structure.py does not declare`);
  }
  const tiers = [...new Set(own.map(([t]) => t))];
  const owners = tiers.map((t) => `${TIER_WORD[t]} ${own.filter(([x]) => x === t).map(([, m]) => m).join(' and ')}`).join(' and ');
  out('');
  out(`# SECTION ${sectionNo}: ${title} (owned by ${owners})`);
  out('');
};

const byId = (rows) => new Map(rows.map((r) => [r.id, r]));

/* ================================================================== */
out('# compliance: Compliance, Audit & Quality. Teaching digest.');
out('# Every figure is a whole number: days (daysUntil, ages), counts, and percents the engine has already rounded. Dates print as YYYY-MM-DD through the engine\'s own toDateOnlyString.');
out(`# AS-OF DATE: ${ymd(AS_OF)}. Every engine call in this digest that reads a date against today passes this one date, except the rows in SECTION 2 that show what an unreadable today does, which say so. Nothing below read the machine clock, and the generator refuses to print a line from a call that did not pass the as-of date.`);
out('# ENGINES: engines/assurance at petrolord-engines 9d5d3b4 (ASC-0), vendored in NextGen under packages/engines.');
out('# MODULES TAUGHT: calendar, complianceStatus, documentControl, qualityAssurance, auditManagement, isoCompliance.');
out('# CASES: IKORO (a terminal obligation register and document library), ABAM (a flowline tie-in quality plan, its NCRs, a contractor HSE audit and an audit programme), ORASHI (an ISO 14001:2015 management system). All three are invented records.');
out('# Built by build_digest.sh from compliance_dump.mjs and compliance_fields.mjs. Never edited by hand.');

/* ------------------------------------------------------------------ */
section('WHAT THE FIVE APPS COMPUTE, AND THE VOCABULARY EACH ONE OWNS');
out('Each module exports rules as functions and vocabularies as frozen lists. The counts below are measured from the modules themselves.');
out('');
head('module', 'exported functions', 'exported lists and constants', 'exports that read a date against today');
for (const mod of MODS) {
  const fns = Object.values(RAW[mod]).filter((v) => typeof v === 'function').length;
  const other = Object.values(RAW[mod]).filter((v) => typeof v !== 'function').length;
  const clocks = [...CLOCK.values()].filter((c) => c.name.startsWith(`${mod}.`)).length;
  row(mod, fns, other, clocks);
}
out('');
out(`complianceStatus.LIFECYCLES: ${RAW.complianceStatus.LIFECYCLES.join(', ')}`);
out(`complianceStatus.STATUS_SEVERITY, worst first: ${RAW.complianceStatus.STATUS_SEVERITY.join(', ')}`);
out(`complianceStatus.ATTENTION_STATUSES: ${RAW.complianceStatus.ATTENTION_STATUSES.join(', ')}`);
out(`complianceStatus.FREQUENCIES: ${RAW.complianceStatus.FREQUENCIES.join(', ')}`);
out(`complianceStatus.DEFAULT_LEAD_TIME_DAYS: ${RAW.complianceStatus.DEFAULT_LEAD_TIME_DAYS}`);
out(`documentControl.DOC_STATUSES: ${RAW.documentControl.DOC_STATUSES.join(', ')}`);
out(`documentControl.EFFECTIVE_STATUSES (in force): ${RAW.documentControl.EFFECTIVE_STATUSES.join(', ')}`);
out(`documentControl review states: ${Object.values(RAW.documentControl.REVIEW).join(', ')}`);
out(`documentControl.REVIEW_LEAD_DAYS: ${RAW.documentControl.REVIEW_LEAD_DAYS}`);
out(`documentControl.DEFAULT_REVIEW_PERIOD_MONTHS: ${RAW.documentControl.DEFAULT_REVIEW_PERIOD_MONTHS}`);
out(`qualityAssurance.POINT_TYPES: ${RAW.qualityAssurance.POINT_TYPES.join(', ')}`);
out(`qualityAssurance.BLOCKING_POINT_TYPES (stop work): ${RAW.qualityAssurance.BLOCKING_POINT_TYPES.join(', ')}`);
out(`qualityAssurance.CHECKPOINT_RESOLVED_STATUSES: ${RAW.qualityAssurance.CHECKPOINT_RESOLVED_STATUSES.join(', ')}`);
out(`qualityAssurance.NCR_SEVERITIES: ${RAW.qualityAssurance.NCR_SEVERITIES.join(', ')}`);
out(`qualityAssurance.NCR_EFFECTIVENESS_REQUIRED: ${RAW.qualityAssurance.NCR_EFFECTIVENESS_REQUIRED.join(', ')}`);
out(`qualityAssurance.DISPOSITIONS: ${RAW.qualityAssurance.DISPOSITIONS.join(', ')}`);
out(`qualityAssurance.CONCESSION_DISPOSITIONS: ${RAW.qualityAssurance.CONCESSION_DISPOSITIONS.join(', ')}`);
out(`auditManagement.CRITICALITIES: ${RAW.auditManagement.CRITICALITIES.join(', ')}`);
out(`auditManagement.ANSWERED_RESULTS: ${RAW.auditManagement.ANSWERED_RESULTS.join(', ')}`);
out(`isoCompliance.CLAUSE_STATUSES: ${RAW.isoCompliance.CLAUSE_STATUSES.join(', ')}`);
out(`isoCompliance.FINDING_TYPES: ${RAW.isoCompliance.FINDING_TYPES.join(', ')}`);
out(`isoCompliance.EFFECTIVENESS_REQUIRED_TYPES: ${RAW.isoCompliance.EFFECTIVENESS_REQUIRED_TYPES.join(', ')}`);
out(`isoCompliance.COVERING_AUDIT_TYPES: ${RAW.isoCompliance.COVERING_AUDIT_TYPES.join(', ')}`);
out(`isoCompliance.COVERAGE_COUNTING_STATUSES: ${RAW.isoCompliance.COVERAGE_COUNTING_STATUSES.join(', ')}`);
out(`isoCompliance.REVIEW_LEAD_DAYS: ${RAW.isoCompliance.REVIEW_LEAD_DAYS}`);
out(`isoCompliance.CERTIFICATE_LEAD_DAYS: ${RAW.isoCompliance.CERTIFICATE_LEAD_DAYS}`);
out('');
out('Two root cause vocabularies, and they are different lists:');
const rcIso = RAW.isoCompliance.ROOT_CAUSE_CATEGORIES; const rcQa = RAW.qualityAssurance.ROOT_CAUSE_CATEGORIES;
out(`isoCompliance.ROOT_CAUSE_CATEGORIES (${rcIso.length}), shared with auditManagement: ${rcIso.join(', ')}`);
out(`qualityAssurance.ROOT_CAUSE_CATEGORIES (${rcQa.length}): ${rcQa.join(', ')}`);
out(`only in the ISO list: ${rcIso.filter((x) => !rcQa.includes(x)).join(', ')}`);
out(`only in the quality list: ${rcQa.filter((x) => !rcIso.includes(x)).join(', ')}`);
out(`auditManagement.ROOT_CAUSE_CATEGORIES is the same list object as isoCompliance's: ${RAW.auditManagement.ROOT_CAUSE_CATEGORIES === rcIso}`);
out(`auditManagement.canCloseFinding is the same function as isoCompliance's: ${RAW.auditManagement.canCloseFinding === RAW.isoCompliance.canCloseFinding}`);
out(`isoCompliance.isActionOverdue is the same function as qualityAssurance.isCapaOverdue: ${RAW.isoCompliance.isActionOverdue === RAW.qualityAssurance.isCapaOverdue}`);

/* ------------------------------------------------------------------ */
section('THE CALENDAR: A DATE IS A DAY, AND AN UNREADABLE DATE IS NO DATE');
out('parseDateOnly reads the leading YYYY-MM-DD of a string at local midnight and refuses a day that does not exist. toDateOnlyString prints it back.');
out('');
head('input', 'parseDateOnly, printed by toDateOnlyString', 'daysUntil against the as-of date');
for (const s of ['2026-10-15', '2026-11-30', '2026-09-30', '2027-02-28', '2026-02-30', '2026-13-01', '2026-10-15T23:59:00+14:00', '15/10/2026', '', 'tbc']) {
  const p = CAL.parseDateOnly(s);
  row(s === '' ? '(empty)' : s, p ? ymd(p) : 'null', days(CAL.daysUntil(s, AS_OF)));
}
out('');
out(`daysUntil of the as-of date itself: ${CAL.daysUntil(F.AS_OF_YMD, AS_OF)}`);
out('');
out('What the modules do with an unreadable TODAY, which no caller should pass. The digest itself always passes a real date, so these rows are the contract rather than a case:');
{
  const bad = new Date(NaN);
  let msg;
  try { RAW.complianceStatus.deriveStatus(F.IKORO_OBLIGATIONS[1], bad); msg = 'no error'; } catch (e) { msg = `${e.constructor.name}: ${e.message}`; }
  out(`complianceStatus.deriveStatus with an unreadable Date as today throws ${msg}`);
  out(`documentControl.reviewState of a published document whose review date is 2020-01-06, with an unreadable Date as today, returns: ${RAW.documentControl.reviewState({ status: 'Published', next_review_date: '2020-01-06' }, bad)}`);
  out(`qualityAssurance.isNcrOverdue of an open NCR due 2020-01-06, with an unreadable Date as today, returns: ${RAW.qualityAssurance.isNcrOverdue({ status: 'Open', due_date: '2020-01-06' }, bad)}`);
  let smsg;
  try { RAW.documentControl.reviewState({ status: 'Published', next_review_date: '2026-11-02' }, F.AS_OF_YMD); smsg = 'no error'; } catch (e) { smsg = `${e.constructor.name}: ${e.message}`; }
  out(`documentControl.reviewState with today passed as the STRING ${F.AS_OF_YMD} throws ${smsg}`);
}
out('Only deriveStatus refuses an unreadable today (owner decision AS15 Q1). The two rows above show two other modules answering as though nothing were due. This is recorded as a held limit in SECTION 23.');

/* ------------------------------------------------------------------ */
section('AN OBLIGATION\'S STATUS IS DERIVED, AND THE REASON COMES WITH IT');
out('The IKORO register at the as-of date. Status and reason are explainStatus; the next action date is the earlier of the due date and the expiry date.');
out('');
head('code', 'obligation', 'lifecycle', 'frequency', 'due', 'expiry', 'last filed', 'lead time', 'next action date', 'days until', 'status');
for (const o of F.IKORO_OBLIGATIONS) {
  const e = C.explainStatus(o, AS_OF);
  row(o.code, o.title, o.lifecycle, o.frequency, o.due_date || 'none', o.expiry_date || 'none', o.last_submitted_date || 'none',
    o.lead_time_days === undefined ? 'not set' : (o.lead_time_days === null ? 'null' : o.lead_time_days),
    ymd(e.nextActionDate), days(e.daysUntil), e.status);
}
out('');
out('The reason explainStatus gives for each, verbatim:');
const negativeReasons = [];
for (const o of F.IKORO_OBLIGATIONS) {
  const e = C.explainStatus(o, AS_OF);
  out(`${o.code}: ${e.reason}`);
  if (/in -\d+ days/.test(e.reason)) negativeReasons.push(o.code);
}
if (negativeReasons.length) {
  throw new Error(`R4 REGRESSED: explainStatus prints a negative day count for ${negativeReasons.join(', ')}`);
}
out('');
out('The precedence, one obligation varied one field at a time from REG-2026-005 (the radioactive source licence):');
{
  const base = F.IKORO_OBLIGATIONS.find((o) => o.id === 'o05');
  const variants = [
    ['as recorded (expiry passed, due date ahead)', base],
    ['the same with lifecycle Superseded', { ...base, lifecycle: 'Superseded' }],
    ['the same with the expiry removed', { ...base, expiry_date: undefined }],
    ['the same with the expiry moved to 2027-09-30', { ...base, expiry_date: '2027-09-30' }],
    ['the same with the due date moved to 2026-10-01 and no expiry', { ...base, expiry_date: undefined, due_date: '2026-10-01' }],
    ['the same with an unknown lifecycle word, Archived', { ...base, lifecycle: 'Archived' }],
  ];
  head('variant', 'status', 'days until');
  for (const [label, o] of variants) { const e = C.explainStatus(o, AS_OF); row(label, e.status, days(e.daysUntil)); }
}
out('');
out('A One-off obligation, filed and unfiled, once its due date has passed:');
head('obligation', 'last filed', 'status', 'days until');
for (const o of [F.IKORO_OBLIGATIONS.find((x) => x.id === 'o06'), F.IKORO_OBLIGATIONS.find((x) => x.id === 'o07')]) {
  const e = C.explainStatus(o, AS_OF); row(o.code, o.last_submitted_date || 'none', e.status, days(e.daysUntil));
}

/* ------------------------------------------------------------------ */
section('THE LEAD TIME DECIDES WHEN "DUE SOON" STARTS');
{
  const o3 = F.IKORO_OBLIGATIONS.find((o) => o.id === 'o03');
  const e = C.explainStatus(o3, AS_OF);
  out(`REG-2026-003, the quarterly flare and venting return, is due ${o3.due_date}: ${days(e.daysUntil)} days after the as-of date. Its recorded lead time is ${o3.lead_time_days}. Only the lead time is varied below.`);
  out('');
  head('lead_time_days given', 'status');
  for (const lt of F.IKORO_LEAD_SWEEP) {
    const shown = lt === null ? 'null' : (lt === '' ? "'' (empty)" : (typeof lt === 'string' ? `'${lt}'` : lt));
    row(shown, C.deriveStatus({ ...o3, lead_time_days: lt }, AS_OF));
  }
  row('not set at all', C.deriveStatus({ ...o3, lead_time_days: undefined }, AS_OF));
  out('');
  out(`With no usable lead time the engine uses DEFAULT_LEAD_TIME_DAYS, ${RAW.complianceStatus.DEFAULT_LEAD_TIME_DAYS}.`);
}

/* ------------------------------------------------------------------ */
section('THE CURRENT PERIOD: WHEN A FILING STILL COUNTS');
out(`periodStart is one frequency before the next due date, pulled back to the last day of the month when that month is shorter. For a due date of ${F.PERIOD_DUE}:`);
out('');
head('frequency', 'periodStart', 'days until the period start');
for (const fr of RAW.complianceStatus.FREQUENCIES) {
  const p = C.periodStart(F.PERIOD_DUE, fr);
  row(fr, ymd(p), p ? days(CAL.daysUntil(p, AS_OF)) : 'none');
}
out('');
out('The same filing, read against the period it falls in. Each row is an IKORO obligation as recorded:');
head('code', 'frequency', 'due', 'periodStart', 'last filed', 'status');
for (const id of ['o03', 'o04', 'o08', 'o12', 'o02']) {
  const o = F.IKORO_OBLIGATIONS.find((x) => x.id === id);
  row(o.code, o.frequency, o.due_date, ymd(C.periodStart(o.due_date, o.frequency)), o.last_submitted_date || 'none', C.deriveStatus(o, AS_OF));
}
out('');
{
  const o4 = F.IKORO_OBLIGATIONS.find((x) => x.id === 'o04');
  out('REG-2026-004 filed one day later, on 2026-03-31, the first day of its period:');
  out(`status ${C.deriveStatus({ ...o4, last_submitted_date: '2026-03-31' }, AS_OF)}; ${C.explainStatus({ ...o4, last_submitted_date: '2026-03-31' }, AS_OF).reason}`);
}

/* ------------------------------------------------------------------ */
section('ROLLING THE SCHEDULE FORWARD FROM THE DATE THAT WAS DUE');
out(`rollForward from a due date of ${F.ROLL_FROM}, by every frequency:`);
out('');
head('frequency', 'next due date', 'days until it');
for (const fr of RAW.complianceStatus.FREQUENCIES) {
  const n = C.rollForward(F.ROLL_FROM, fr);
  row(fr, ymd(n), n ? days(CAL.daysUntil(n, AS_OF)) : 'none');
}
out('');
out('Three month ends:');
head('due date', 'frequency', 'next due date');
for (const [d, fr] of F.ROLL_EXTRA) row(d, fr, ymd(C.rollForward(d, fr)));
out('');
{
  const lf = F.IKORO_LATE_FILING;
  const right = C.rollForward(lf.due, lf.frequency);
  const fromFiling = C.rollForward(lf.filed, lf.frequency);
  out(`REG-2026-002 was due ${lf.due} and is filed on ${lf.filed}. The app rolls from the date that was due: rollForward(${lf.due}, ${lf.frequency}) = ${ymd(right)}.`);
  out(`The same call on the filing date would give ${ymd(fromFiling)}. The Regulatory Compliance app passes the due date to rollForward when a filing is recorded, so this second date is the one the schedule would walk to if it rolled from the filing.`);
  const after = { ...F.IKORO_OBLIGATIONS.find((x) => x.id === 'o02'), due_date: ymd(right), last_submitted_date: lf.filed };
  const e = C.explainStatus(after, AS_OF);
  out(`After the filing is recorded and the due date rolled: status ${e.status}, next action ${ymd(e.nextActionDate)}, ${days(e.daysUntil)} days.`);
}

/* ------------------------------------------------------------------ */
section('THE REGISTER SUMMARISED, AND SORTED WORST FIRST');
{
  const s = C.summarise(F.IKORO_OBLIGATIONS, AS_OF);
  out(`summarise over the ${s.total} IKORO obligations:`);
  out('');
  head('status', 'count');
  for (const st of RAW.complianceStatus.STATUS_SEVERITY) row(st, s.byStatus[st]);
  out('');
  out(`attention (Expired + Overdue + Due soon): ${s.attention}`);
  out('');
  out('byUrgency: worst status first, then the nearest next action date, undated last:');
  const sorted = [...F.IKORO_OBLIGATIONS].sort(C.byUrgency(AS_OF));
  head('order', 'code', 'status', 'next action date');
  sorted.forEach((o, i) => row(i + 1, o.code, C.deriveStatus(o, AS_OF), ymd(C.nextActionDate(o))));
  out('');
  out('countBy regime:');
  for (const r of C.countBy(F.IKORO_OBLIGATIONS, 'regime')) out(`${r.name}: ${r.count}`);
}

/* ------------------------------------------------------------------ */
section('DOCUMENT CONTROL: THE REVIEW DATE, THE REVISION AND WHO MAY REVIEW');
out('The IKORO document library at the as-of date. reviewState reads only documents in force.');
out('');
head('number', 'title', 'status', 'next review', 'days until', 'review state');
for (const d of F.IKORO_DOCUMENTS) {
  row(d.document_number, d.title, d.status, d.next_review_date || 'none',
    d.next_review_date ? days(CAL.daysUntil(d.next_review_date, AS_OF)) : 'none', D.reviewState(d, AS_OF));
}
out('');
out(`A published document whose review date is the text tbc: ${D.reviewState({ status: 'Published', next_review_date: 'tbc' }, AS_OF)}`);
out('');
out('nextReviewDate counts from the ISSUE date by the review period in months:');
head('issue date', 'period in months', 'next review date', 'days until it');
for (const [iss, mo] of F.IKORO_REVIEW_PERIODS) {
  const months = mo === 'DEFAULT' ? RAW.documentControl.DEFAULT_REVIEW_PERIOD_MONTHS : mo;
  const n = D.nextReviewDate(iss, months);
  row(iss, mo === 'DEFAULT' ? `${months} (DEFAULT_REVIEW_PERIOD_MONTHS, passed by the caller)` : (mo === null ? 'null' : mo), ymd(n), n ? days(CAL.daysUntil(n, AS_OF)) : 'none');
}
{
  const c = F.IKORO_CORRECTION;
  out('');
  out(`A correction re-published on ${c.republished} to a document issued ${c.issue}, on a ${c.months} month period: counted from the issue date the review falls on ${ymd(D.nextReviewDate(c.issue, c.months))}; counted from the correction it would fall on ${ymd(D.nextReviewDate(c.republished, c.months))}.`);
}
out('');
out('nextRevisionNumber keeps the width a revision is cited at:');
head('current revision', 'next revision');
for (const r of F.IKORO_REVISIONS) row(r === null ? 'null' : (r === '' ? "'' (empty)" : `'${r}'`), `'${D.nextRevisionNumber(r)}'`);
out('');
out('documentPrefix, from department and category:');
for (const [dep, cat] of F.IKORO_PREFIXES) out(`'${dep}', '${cat}' gives ${D.documentPrefix(dep, cat)}`);
out('');
out('atLeastConfidential, against the default floor Confidential:');
for (const lv of RAW.documentControl.CONFIDENTIALITY_LEVELS) out(`${lv}: ${D.atLeastConfidential(lv)}`);
out('');
out(`Segregation of duties on revision ${F.IKORO_REVISION_UNDER_REVIEW.id}, authored by ${F.IKORO_REVISION_UNDER_REVIEW.created_by}:`);
for (const t of F.IKORO_REVIEW_TASKS) {
  const v = t.kind === 'assign'
    ? D.canAssignReviewer(F.IKORO_REVISION_UNDER_REVIEW, t.reviewer)
    : D.canDecideReviewTask(t.task, F.IKORO_REVISION_UNDER_REVIEW, t.user);
  const expect = ['an independent reviewer is assigned', 'the assigned reviewer decides a pending task'].includes(t.label);
  out(`${t.label}: ${verdict(v, expect, t.label)}`);
}

/* ------------------------------------------------------------------ */
section('THE DOCUMENT LIBRARY SUMMARISED, AND THE REVIEW QUEUE');
{
  const s = D.summarise(F.IKORO_DOCUMENTS, AS_OF);
  out(`summarise over the ${s.total} IKORO documents: in review ${s.inReview}, published ${s.published}, review overdue ${s.overdue}, review due soon ${s.dueSoon}.`);
  head('status', 'count');
  for (const st of RAW.documentControl.DOC_STATUSES) row(st, s.byStatus[st]);
  out('');
  out('byReviewUrgency:');
  head('order', 'number', 'review state', 'next review');
  [...F.IKORO_DOCUMENTS].sort(D.byReviewUrgency(AS_OF)).forEach((d, i) => row(i + 1, d.document_number, D.reviewState(d, AS_OF), d.next_review_date || 'none'));
}

/* ------------------------------------------------------------------ */
section('THE INSPECTION AND TEST PLAN: A HOLD POINT STOPS WORK');
{
  const cps = byId(F.ABAM_CHECKPOINTS);
  out(`${F.ABAM_PLAN.plan_code}, ${F.ABAM_PLAN.title}, status ${F.ABAM_PLAN.status}. Its twelve points at the as-of date:`);
  out('');
  head('item', 'point', 'type', 'status', 'stops work', 'resolved', 'planned', 'overdue');
  for (const c of F.ABAM_CHECKPOINTS) {
    row(c.item_no, c.title, c.point_type, c.status, Q.isBlockingPoint(c), Q.isResolved(c), c.planned_date, Q.isCheckpointOverdue(c, AS_OF));
  }
  out('');
  out('Decisions asked of the engine, one point at a time (canDecideCheckpoint):');
  const OK = new Set(['H-11 set Not applicable with a date, a name and a reason', 'S-10 set Not applicable with nothing recorded', 'H-08 passed with a date and a verifier']);
  for (const d of F.ABAM_DECISIONS) {
    out(`${d.label}: ${verdict(Q.canDecideCheckpoint(cps.get(d.item), d.status, d.patch), OK.has(d.label), d.label)}`);
  }
}

/* ------------------------------------------------------------------ */
section('PROGRESS IS COUNTED FROM THE POINTS, AND A PLAN CLOSES ONLY WHEN ITS HOLD POINTS ARE RESOLVED');
{
  const p = Q.planProgress(F.ABAM_CHECKPOINTS);
  out(`planProgress over ${F.ABAM_PLAN.plan_code}: total ${p.total}, resolved ${p.resolved}, failed ${p.failed}, outstanding ${p.outstanding}, hold points ${p.holdPoints}, hold points outstanding ${p.holdPointsOutstanding}, percent ${p.percent}.`);
  out(`planProgress over a plan with no points: percent ${Q.planProgress([]).percent === null ? 'null' : Q.planProgress([]).percent}.`);
  out('');
  out('canClosePlan, walked from the plan as recorded to a plan that may close:');
  const ncrs = F.ABAM_NCRS;
  const fix = (cps, id, patch) => cps.map((c) => (c.id === id ? { ...c, ...patch } : c));
  let cps = F.ABAM_CHECKPOINTS;
  out(`as recorded: ${refused(Q.canClosePlan(F.ABAM_PLAN, { checkpoints: cps, ncrs }), 'close as recorded')}`);
  cps = fix(cps, 'c05', { status: 'Passed' });
  out(`H-05 re-inspected and Passed: ${refused(Q.canClosePlan(F.ABAM_PLAN, { checkpoints: cps, ncrs }), 'close after H-05')}`);
  cps = fix(fix(cps, 'c08', { status: 'Passed' }), 'c11', { status: 'Passed' });
  out(`H-08 and H-11 Passed as well: ${refused(Q.canClosePlan(F.ABAM_PLAN, { checkpoints: cps, ncrs }), 'close after holds')}`);
  const closedNcrs = ncrs.map((n) => ({ ...n, status: ['Voided'].includes(n.status) ? n.status : 'Closed' }));
  out(`and every NCR against it closed or voided: ${allowed(Q.canClosePlan(F.ABAM_PLAN, { checkpoints: cps, ncrs: closedNcrs }), 'close final')}`);
  const pp = Q.planProgress(cps);
  out(`At that point planProgress reads resolved ${pp.resolved} of ${pp.total}, percent ${pp.percent}, and W-09, S-10 and R-12 are still open.`);
  out('');
  out('Removing a point from the plan (canRemoveCheckpoint):');
  const cpm = byId(F.ABAM_CHECKPOINTS);
  const OKR = new Set(['W-09, a pending witness point, from the Active plan', 'H-08 from the same plan while it was still a Draft']);
  for (const r of F.ABAM_REMOVALS) {
    out(`${r.label}: ${verdict(Q.canRemoveCheckpoint(cpm.get(r.item), { ...F.ABAM_PLAN, status: r.plan }), OKR.has(r.label), r.label)}`);
  }
  out('');
  out('Raising an NCR against a plan (canRaiseNcr):');
  out(`against the Active plan: ${allowed(Q.canRaiseNcr(F.ABAM_PLAN), 'raise active')}`);
  out(`against no plan at all: ${allowed(Q.canRaiseNcr(null), 'raise none')}`);
  out(`against the plan once Closed: ${refused(Q.canRaiseNcr({ ...F.ABAM_PLAN, status: 'Closed' }), 'raise closed')}`);
  out('');
  out('The plan workflow (nextPlanStatuses):');
  for (const st of RAW.qualityAssurance.PLAN_STATUSES) out(`${st}: ${Q.nextPlanStatuses(st).join(', ') || 'final'}`);
  out(`canAdvancePlan from Draft straight to Closed: ${refused(Q.canAdvancePlan({ ...F.ABAM_PLAN, status: 'Draft' }, 'Closed', {}), 'advance draft closed')}`);
}

/* ------------------------------------------------------------------ */
section('THE ABAM PLAN READ END TO END');
{
  const p = Q.planProgress(F.ABAM_CHECKPOINTS);
  const holds = F.ABAM_CHECKPOINTS.filter((c) => Q.isBlockingPoint(c));
  out(`${p.resolved} of ${p.total} points resolved, ${p.percent} percent. Hold points: ${holds.map((c) => `${c.item_no} ${c.status}`).join(', ')}.`);
  out(`Overdue points at the as-of date: ${F.ABAM_CHECKPOINTS.filter((c) => Q.isCheckpointOverdue(c, AS_OF)).map((c) => c.item_no).join(', ')}.`);
  const s = Q.summarise({ plans: [F.ABAM_PLAN], checkpoints: F.ABAM_CHECKPOINTS, ncrs: F.ABAM_NCRS, capas: F.ABAM_CAPAS }, AS_OF);
  out(`summarise: checkpoints ${s.checkpoints}, outstanding ${s.checkpointsOutstanding}, overdue ${s.checkpointsOverdue}, hold points outstanding ${s.holdPointsOutstanding}, failed ${s.checkpointsFailed}.`);
}

/* ------------------------------------------------------------------ */
section('A NON-CONFORMANCE CLOSES ON ITS DISPOSITION, ITS CAUSE AND AN ACTION SHOWN TO WORK');
{
  out('The ABAM NCRs at the as-of date:');
  out('');
  head('code', 'title', 'severity', 'status', 'raised', 'due', 'disposition', 'open', 'overdue');
  for (const n of F.ABAM_NCRS) {
    row(n.ncr_code, n.title, n.severity, n.status, n.raised_date, n.due_date || 'none', n.disposition || 'none', Q.isNcrOpen(n), Q.isNcrOverdue(n, AS_OF));
  }
  out('');
  out('The corrective and preventive actions:');
  head('action', 'NCR', 'type', 'status', 'due', 'open', 'overdue', 'verified effective', 'found ineffective');
  const nm = byId(F.ABAM_NCRS);
  for (const k of F.ABAM_CAPAS) {
    row(k.id, nm.get(k.ncr_id).ncr_code, k.action_type, k.status, k.due_date, Q.isCapaOpen(k), Q.isCapaOverdue(k, AS_OF), Q.isEffectivenessVerified(k), Q.isEffectivenessFailed(k));
  }
  out('');
  out('canCloseNcr on a Major NCR, one requirement met at a time:');
  const b = F.NCR_LADDER_BASE;
  const verifiedCa = { action_type: 'Corrective', status: 'Complete', effectiveness_verified: true, effectiveness_checked_at: '2026-10-12', effectiveness_verified_by: 'u-ifeoma' };
  const ladder = [
    ['nothing recorded', b, [], false],
    ['a disposition, Repair', { ...b, disposition: 'Repair' }, [], false],
    ['and the date it was agreed', { ...b, disposition: 'Repair', disposition_date: '2026-09-05' }, [], false],
    ['and a root cause, with a preventive action still in progress', { ...b, disposition: 'Repair', disposition_date: '2026-09-05', root_cause: 'Heat input outside the procedure.' }, [{ action_type: 'Preventive', status: 'In progress' }], false],
    ['with the preventive action finished and no corrective action', { ...b, disposition: 'Repair', disposition_date: '2026-09-05', root_cause: 'Heat input outside the procedure.' }, [{ action_type: 'Preventive', status: 'Complete' }], false],
    ['with one corrective action checked and found not to work', { ...b, disposition: 'Repair', disposition_date: '2026-09-05', root_cause: 'Heat input outside the procedure.' }, [{ action_type: 'Corrective', status: 'Complete', effectiveness_verified: false, effectiveness_checked_at: '2026-10-01', effectiveness_verified_by: 'u-ifeoma' }], false],
    ['with one corrective action complete and not yet checked', { ...b, disposition: 'Repair', disposition_date: '2026-09-05', root_cause: 'Heat input outside the procedure.' }, [{ action_type: 'Corrective', status: 'Complete' }], false],
    ['with a corrective action verified effective', { ...b, disposition: 'Repair', disposition_date: '2026-09-05', root_cause: 'Heat input outside the procedure.' }, [verifiedCa], true],
  ];
  for (const [label, n, capas, ok] of ladder) out(`${label}: ${verdict(Q.canCloseNcr(n, capas), ok, label)}`);
  out('');
  out('The same last three steps on a Minor NCR:');
  const minor = { severity: 'Minor', status: 'Open', disposition: 'Rework', disposition_date: '2026-09-05' };
  out(`no root cause, no actions: ${allowed(Q.canCloseNcr(minor, []), 'minor none')}`);
  out(`one corrective action complete and never checked: ${allowed(Q.canCloseNcr(minor, [{ action_type: 'Corrective', status: 'Complete' }]), 'minor unchecked')}`);
  out(`one corrective action still open: ${refused(Q.canCloseNcr(minor, [{ action_type: 'Corrective', status: 'Open' }]), 'minor open')}`);
  out('');
  out('The ABAM NCRs themselves:');
  for (const n of F.ABAM_NCRS) {
    const capas = F.ABAM_CAPAS.filter((k) => k.ncr_id === n.id);
    const v = Q.canCloseNcr(n, capas);
    out(`${n.ncr_code}: ${v.ok ? allowed(v, n.ncr_code) : refused(v, n.ncr_code)}`);
  }
}

/* ------------------------------------------------------------------ */
section('HOW LONG A NON-CONFORMANCE HAS BEEN OPEN, AND WHAT THE DASHBOARD COUNTS');
{
  out('ncrAgeDays: to the as-of date while open, to the closed date once closed or voided.');
  out('');
  head('code', 'status', 'raised', 'closed', 'age in days', 'ageBand');
  for (const n of F.ABAM_NCRS) {
    const a = Q.ncrAgeDays(n, AS_OF);
    row(n.ncr_code, n.status, n.raised_date, n.closed_date || 'none', days(a), Q.ageBand(a) || 'none');
  }
  out('');
  out('ageBand at its edges:');
  for (const d of [0, 30, 31, 60, 61, 90, 91, -1]) out(`${d} days: ${Q.ageBand(d) || 'null'}`);
  out('');
  out('ncrAgeing, open NCRs only, by band and severity:');
  const ag = Q.ncrAgeing(F.ABAM_NCRS, AS_OF);
  head('band', ...RAW.qualityAssurance.NCR_SEVERITIES);
  for (const r of ag) row(r.name, ...RAW.qualityAssurance.NCR_SEVERITIES.map((s) => r[s]));
  out('');
  const s = Q.summarise({ plans: [F.ABAM_PLAN], checkpoints: F.ABAM_CHECKPOINTS, ncrs: F.ABAM_NCRS, capas: F.ABAM_CAPAS }, AS_OF);
  out(`summarise: NCRs ${s.ncrs}, open ${s.openNcrs}, overdue ${s.ncrsOverdue}, serious and open ${s.seriousOpen}, concessions ${s.concessions}, oldest open ${days(s.oldestOpenNcrDays)} days, mean open age ${days(s.meanOpenNcrAgeDays)} days.`);
  const openAges = F.ABAM_NCRS.filter((n) => Q.isNcrOpen(n)).map((n) => Q.ncrAgeDays(n, AS_OF));
  out(`the open ages it averages: ${openAges.join(', ')}; their sum ${openAges.reduce((a, b) => a + b, 0)} over ${openAges.length}.`);
  out(`actions: ${s.capas} in total, open ${s.openCapas}, overdue ${s.overdueCapas}, awaiting an effectiveness check ${s.capasAwaitingEffectiveness}, verified effective ${s.capasVerifiedEffective}, found ineffective ${s.capasFoundIneffective}.`);
  const voided = F.ABAM_NCRS.find((n) => n.status === 'Voided');
  const onVoided = F.ABAM_CAPAS.filter((k) => k.ncr_id === voided.id);
  out(`${onVoided.map((k) => k.id).join(', ')} sits on ${voided.ncr_code}, which is Voided: isCapaOpen reads ${onVoided.map((k) => Q.isCapaOpen(k)).join(', ')} and isCapaOverdue reads ${onVoided.map((k) => Q.isCapaOverdue(k, AS_OF)).join(', ')}, and summarise leaves it out of the open and overdue counts.`);
  const sNo = Q.summarise({ checkpoints: F.ABAM_CHECKPOINTS, ncrs: [], capas: F.ABAM_CAPAS }, AS_OF);
  out(`The same actions summarised with no NCRs supplied: open ${sNo.openCapas}, overdue ${sNo.overdueCapas}. A child whose parent is not supplied counts.`);
  const sClosedPlan = Q.summarise({ plans: [{ ...F.ABAM_PLAN, status: 'Closed' }], checkpoints: F.ABAM_CHECKPOINTS, ncrs: [], capas: [] }, AS_OF);
  out(`The same points summarised under the plan marked Closed: outstanding ${sClosedPlan.checkpointsOutstanding}, overdue ${sClosedPlan.checkpointsOverdue}, failed ${sClosedPlan.checkpointsFailed}.`);
  out('');
  out('ncrByUrgency:');
  head('order', 'code', 'severity', 'status', 'overdue');
  [...F.ABAM_NCRS].sort(Q.ncrByUrgency(AS_OF)).forEach((n, i) => row(i + 1, n.ncr_code, n.severity, n.status, Q.isNcrOverdue(n, AS_OF)));
}

/* ------------------------------------------------------------------ */
section('THE CHECKLIST: AN ANSWER, A REASON, AND A FINDING FOR A FAILED CRITICAL ITEM');
{
  const au = F.ABAM_AUDIT;
  out(`${au.audit_code}, ${au.title}, status ${au.status}, ${F.ABAM_ITEMS.length} checklist questions.`);
  out('');
  const rs = new Map(F.ABAM_RESPONSES.map((x) => [x.item_id, x]));
  head('item', 'question', 'criticality', 'result', 'note', 'answered');
  for (const it of F.ABAM_ITEMS) {
    const x = rs.get(it.id) || {};
    const note = x.note === undefined ? 'none' : (x.note.trim() === '' ? 'blank' : x.note);
    row(it.item_no, it.question, it.criticality, x.result || 'no answer', note, A.isAnswered(x));
  }
  out('');
  const p = A.checklistProgress(F.ABAM_ITEMS, F.ABAM_RESPONSES);
  out(`checklistProgress: total ${p.total}, answered ${p.answered}, outstanding ${p.outstanding}, conformant ${p.conformant}, nonconformant ${p.nonconformant}, observations ${p.observations}, notApplicable ${p.notApplicable}, percent ${p.percent}.`);
  out(`checklistProgress with no checklist at all: percent ${A.checklistProgress([], []).percent === null ? 'null' : A.checklistProgress([], []).percent}.`);
  out(`unansweredItems: ${A.unansweredItems(F.ABAM_ITEMS, F.ABAM_RESPONSES).map((i) => i.item_no).join(', ')}`);
  out(`criticalAnswersWithoutFindings, with finding ${F.ABAM_FINDINGS[0].finding_code} raised from item 2: ${A.criticalAnswersWithoutFindings(F.ABAM_ITEMS, F.ABAM_RESPONSES, F.ABAM_FINDINGS).map((i) => i.item_no).join(', ')}`);
  out(`the same with that finding Voided: ${A.criticalAnswersWithoutFindings(F.ABAM_ITEMS, F.ABAM_RESPONSES, [{ ...F.ABAM_FINDINGS[0], status: 'Voided' }]).map((i) => i.item_no).join(', ')}`);
  out('');
  out('Raising a finding (canRaiseFinding):');
  for (const a of F.RAISE_ATTEMPTS) out(`${a.label}: ${verdict(A.canRaiseFinding(a.finding), a.label.endsWith('with its correction'), a.label)}`);
}

/* ------------------------------------------------------------------ */
section('THE AUDIT LIFECYCLE, AND AN AUDITOR WHO MAY NOT AUDIT THEIR OWN AREA');
{
  const au = F.ABAM_AUDIT;
  out('The audit workflow (nextAuditStatuses):');
  for (const st of RAW.auditManagement.AUDIT_STATUSES) out(`${st}: ${A.nextAuditStatuses(st).join(', ') || 'final'}`);
  out('');
  out(`canReportAudit on ${au.audit_code}, one requirement met at a time:`);
  const items = F.ABAM_ITEMS;
  let resp = F.ABAM_RESPONSES;
  out(`as recorded: ${refused(A.canReportAudit(au, { items, responses: resp, findings: F.ABAM_FINDINGS }), 'report as recorded')}`);
  const answeredAll = [...resp.map((x) => (x.item_id === 'i10' ? { ...x, note: 'No waste generated on the tie-in spread.' } : x.item_id === 'i11' ? { ...x, note: 'No confined space entry on this scope.' } : x)),
    { id: 'r13', item_id: 'i13', result: 'Conformant' }, { id: 'r14', item_id: 'i14', result: 'Conformant' }];
  resp = answeredAll;
  out(`every item answered, and the two blank Not applicable answers given reasons: ${refused(A.canReportAudit(au, { items, responses: resp, findings: F.ABAM_FINDINGS }), 'report answered')}`);
  const f2 = { id: 'f2', finding_code: 'AF-2026-019', audit_id: au.id, response_id: 'r06', finding_type: 'Major nonconformity', title: 'Isolation certificate names the wrong valve', objective_evidence: 'Certificate IC-221 names XV-102.', status: 'Open', raised_date: '2026-10-09' };
  const findings = [...F.ABAM_FINDINGS, f2];
  out(`a finding raised from item 6 as well: ${refused(A.canReportAudit(au, { items, responses: resp, findings }), 'report findings')}`);
  const withConclusion = { ...au, conclusion: 'Two major nonconformities on permit control; work stopped once.' };
  out(`and the conclusion written: ${allowed(A.canReportAudit(withConclusion, { items, responses: resp, findings }), 'report ok')}`);
  out(`the same audit with no lead auditor named at all: ${refused(A.canReportAudit({ ...withConclusion, lead_auditor_id: null }, { items, responses: resp, findings }), 'report no lead')}`);
  out('');
  const reported = { ...withConclusion, status: 'Reported' };
  out('canCloseAudit:');
  out(`before it is reported: ${refused(A.canCloseAudit(withConclusion, findings), 'close unreported')}`);
  out(`reported, with both major findings open: ${refused(A.canCloseAudit(reported, findings), 'close majors')}`);
  const closedMajors = findings.map((f) => ({ ...f, status: 'Closed' }));
  out(`reported, with both closed: ${allowed(A.canCloseAudit(reported, closedMajors), 'close ok')}`);
  const minorStop = [{ ...F.ABAM_FINDINGS[0], finding_type: 'Minor nonconformity', status: 'Open' }];
  out(`reported, with a stop-work minor finding still open: ${refused(A.canCloseAudit(reported, minorStop), 'close stopwork')}`);
  out('');
  out('canCancelAudit:');
  out(`no reason given: ${refused(A.canCancelAudit(au, {}), 'cancel none')}`);
  out(`a reason of spaces: ${refused(A.canCancelAudit(au, { cancellation_reason: '   ' }), 'cancel blank')}`);
  out(`a reason given: ${allowed(A.canCancelAudit(au, { cancellation_reason: 'Contractor demobilised.' }), 'cancel ok')}`);
  out('');
  out('auditIndependence (the lead auditor against the auditee):');
  out(`${au.lead_auditor_id} leads, ${au.auditee_id} is audited: ${allowed(A.auditIndependence(au), 'indep ok')}`);
  out(`${au.auditee_id} named as both: ${refused(A.auditIndependence({ ...au, lead_auditor_id: au.auditee_id }), 'indep same')}`);
  out(`an external lead auditor named in text, with no account: ${allowed(A.auditIndependence({ ...au, lead_auditor_id: null, lead_auditor_name: 'Third party auditor' }), 'indep external')}`);
  out('');
  out('isAuditOverdue in this module, for an audit whose planned end has passed:');
  for (const st of RAW.auditManagement.AUDIT_STATUSES) out(`${st}: ${A.isAuditOverdue({ status: st, planned_end: '2026-10-09' }, AS_OF)}`);
}

/* ------------------------------------------------------------------ */
section('THE AUDIT PROGRAMME IS DELIVERED WHEN ITS AUDITS ARE REPORTED');
{
  const pg = F.ABAM_PROGRAMME;
  const aud = F.ABAM_PROGRAMME_AUDITS;
  head('code', 'status', 'planned end', 'overdue');
  for (const a of aud) row(a.audit_code, a.status, a.planned_end, A.isAuditOverdue(a, AS_OF));
  out('');
  const p = A.programmeProgress(aud, AS_OF);
  out(`programmeProgress: total ${p.total}, reported ${p.reported}, cancelled ${p.cancelled}, outstanding ${p.outstanding}, overdue ${p.overdue}, percent ${p.percent}.`);
  out(`programmeProgress over no audits: percent ${A.programmeProgress([], AS_OF).percent === null ? 'null' : A.programmeProgress([], AS_OF).percent}.`);
  out('');
  out('canCompleteProgramme:');
  out(`as recorded: ${refused(A.canCompleteProgramme(pg, aud), 'complete as recorded')}`);
  const done = aud.map((a) => (['Closed', 'Reported', 'Cancelled'].includes(a.status) ? a : { ...a, status: 'Reported' }));
  out(`every outstanding audit reported: ${allowed(A.canCompleteProgramme(pg, done), 'complete done')}`);
  const noReason = done.map((a) => (a.id === 'g8' ? { ...a, status: 'Cancelled', cancellation_reason: undefined } : a));
  out(`the last one cancelled instead, with no reason written: ${refused(A.canCompleteProgramme(pg, noReason), 'complete no reason')}`);
  out('');
  out('The programme workflow (nextProgrammeStatuses) and approval:');
  for (const st of RAW.auditManagement.PROGRAMME_STATUSES) out(`${st}: ${A.nextProgrammeStatuses(st).join(', ') || 'final'}`);
  out(`approving with no date recorded: ${refused(A.canApproveProgramme({ status: 'Draft' }, {}), 'approve none')}`);
  out(`approving with a date and no approver: ${refused(A.canApproveProgramme({ status: 'Draft' }, { approved_at: '2026-01-20' }), 'approve nobody')}`);
  out(`approving with both: ${allowed(A.canApproveProgramme({ status: 'Draft' }, { approved_at: '2026-01-20', approver_name: 'Asset manager' }), 'approve ok')}`);
  out('');
  const s = A.summarise({ programmes: [pg], audits: aud, responses: F.ABAM_RESPONSES, findings: F.ABAM_FINDINGS, actions: [] }, AS_OF);
  out(`summarise over the programme, the ${au(aud)} audits, the ${F.ABAM_RESPONSES.length} recorded answers and the finding: audits outstanding ${s.auditsOutstanding}, overdue ${s.auditsOverdue}, reported ${s.auditsReported}, cancelled ${s.auditsCancelled}, answers ${s.answers}, answers outstanding ${s.answersOutstanding}, nonconformances ${s.nonconformances}, notApplicable ${s.notApplicable}, open findings ${s.openFindings}, open major ${s.openMajor}, stop-work open ${s.stopWorkOpen}.`);
  function au(x) { return x.length; }
}

/* ------------------------------------------------------------------ */
section('A CONFORMITY CLAIM IS EVIDENCE, A DATE AND A NAME');
{
  const std = F.ORASHI_STANDARD;
  out(`${std.code} at ORASHI, ${std.certification_status}, certification cycle ${std.cycle_years} years, certificate expires ${std.certificate_expires}.`);
  out('');
  head('clause', 'title', 'applicability', 'status', 'owner', 'claims conformity', 'evidence record', 'assessed', 'next review', 'review overdue', 'review due soon');
  for (const c of F.ORASHI_CLAUSES) {
    row(c.clause_ref, c.title, c.applicability, c.status, c.owner_id, I.claimsConformity(c), I.hasEvidenceRecord(c), I.isAssessed(c),
      c.next_review_due || 'none', I.isReviewOverdue(c, AS_OF), I.isReviewDueSoon(c, AS_OF));
  }
  out('');
  out(`canSetClauseStatus on clause 7.2, which has nothing recorded, with the ${F.ORASHI_STANDARD.code} record passed:`);
  const k72 = F.ORASHI_CLAUSES.find((c) => c.id === 'k72');
  const tries = [
    ['Conformant, nothing else', 'Conformant', {}, false],
    ['Conformant with an evidence reference only', 'Conformant', { evidence_reference: 'EMS-TRN-MATRIX' }, false],
    ['Conformant with evidence, a date and an assessor', 'Conformant', { evidence_reference: 'EMS-TRN-MATRIX', assessed_date: '2026-10-12', assessed_by: 'u-nneka' }, true],
    ['Nonconformant with no date', 'Nonconformant', { assessed_by: 'u-nneka' }, false],
    ['Nonconformant with a date and an assessor', 'Nonconformant', { assessed_date: '2026-10-12', assessor_name: 'External assessor' }, true],
    ['Not applicable while still marked Applicable', 'Not applicable', {}, false],
    ['Not applicable and applicability Not applicable, no justification', 'Not applicable', { applicability: 'Not applicable' }, false],
    ['Not applicable with its justification', 'Not applicable', { applicability: 'Not applicable', applicability_justification: 'Competence is managed under the group HR system outside this scope.' }, true],
    ['Compliant, a word the vocabulary does not have', 'Compliant', {}, false],
  ];
  for (const [label, st, patch, ok] of tries) out(`${label}: ${verdict(I.canSetClauseStatus(k72, st, patch, F.ORASHI_STANDARD), ok, label)}`);
  out('');
  out(`The same Not applicable refusal, the register's standard passed as the fourth argument, for three standards and for none:`);
  for (const std of [F.ORASHI_STANDARD, { code: 'ISO 9001:2015' }, F.ORASHI_SECOND_STANDARD, null]) {
    out(`${std ? std.code : 'no standard passed'}: ${refused(I.canSetClauseStatus(k72, 'Not applicable', { applicability: 'Not applicable' }, std), 'na std')}`);
  }
}

/* ------------------------------------------------------------------ */
section('INDEPENDENCE: AN AUDITOR MAY NOT AUDIT THEIR OWN WORK');
{
  const inScope = F.ORASHI_CLAUSES.filter((c) => ['k81', 'k82', 'k911', 'k92'].includes(c.id));
  const audit = { id: 'ia-2027', audit_type: 'Internal', status: 'Planned' };
  out(`A planned internal audit with clauses ${inScope.map((c) => c.clause_ref).join(', ')} in scope. Owners: ${inScope.map((c) => `${c.clause_ref} ${c.owner_id}`).join(', ')}.`);
  out('');
  for (const lead of ['u-chidi', 'u-kalu', 'u-nneka', 'u-tari']) {
    const v = I.auditIndependence({ ...audit, lead_auditor_id: lead }, inScope);
    out(`lead auditor ${lead}: ${v.ok ? allowed(v, lead) : refused(v, lead)}${v.ok ? '' : ` Clauses named: ${v.clauses.join(', ')}.`}`);
  }
  out(`an external lead auditor named in text: ${allowed(I.auditIndependence({ ...audit, lead_auditor_name: 'Certification body auditor' }, inScope), 'external')}`);
  out('');
  out('canExamineClause, for the person recording a clause result:');
  const k81 = F.ORASHI_CLAUSES.find((c) => c.id === 'k81');
  out(`${k81.owner_id} recording 8.1, which ${k81.owner_id} owns: ${refused(I.canExamineClause(k81, k81.owner_id), 'examine own')}`);
  out(`u-chidi recording 8.1: ${allowed(I.canExamineClause(k81, 'u-chidi'), 'examine other')}`);
  out('');
  out('The same principle in the other two apps this course teaches, for comparison: the Audit & Findings Manager checks the lead auditor against the auditee (SECTION 16), and Document Control checks a reviewer against the author (SECTION 8).');
}

/* ------------------------------------------------------------------ */
section('COVERAGE IS COUNTED OVER THE CERTIFICATION CYCLE, FROM REPORTED INTERNAL AUDITS');
{
  const cov = I.clauseCoverage({ clauses: F.ORASHI_CLAUSES, auditClauses: F.ORASHI_AUDIT_CLAUSES, audits: F.ORASHI_AUDITS, cycleYears: F.ORASHI_STANDARD.cycle_years }, AS_OF);
  out('The audits ORASHI holds:');
  head('audit', 'type', 'status', 'ended', 'counts towards coverage');
  for (const a of F.ORASHI_AUDITS) {
    const counts = RAW.isoCompliance.COVERING_AUDIT_TYPES.includes(a.audit_type) && RAW.isoCompliance.COVERAGE_COUNTING_STATUSES.includes(a.status);
    row(a.audit_code, a.audit_type, a.status, a.actual_end || 'none', counts);
  }
  out('');
  out(`clauseCoverage over the ${F.ORASHI_CLAUSES.filter((c) => I.isApplicable(c)).length} applicable clauses, cycle ${F.ORASHI_STANDARD.cycle_years} years:`);
  head('clause', 'last examined', 'days until it (negative is past)', 'by audit', 'result', 'covered', 'stale');
  for (const r of cov) {
    row(r.clause_ref, r.lastExaminedOn || 'never', r.lastExaminedOn ? days(CAL.daysUntil(r.lastExaminedOn, AS_OF)) : 'none',
      r.lastAudit ? r.lastAudit.audit_code : 'none', r.lastResult || 'none', r.covered, r.stale);
  }
  out('');
  out('The same register over cycles of other lengths:');
  head('cycleYears', 'covered', 'stale', 'never examined');
  for (const cy of [1, 2, 3, 4]) {
    const c2 = I.clauseCoverage({ clauses: F.ORASHI_CLAUSES, auditClauses: F.ORASHI_AUDIT_CLAUSES, audits: F.ORASHI_AUDITS, cycleYears: cy }, AS_OF);
    row(cy, c2.filter((x) => x.covered).length, c2.filter((x) => x.stale).length, c2.filter((x) => !x.lastExaminedOn).length);
  }
  out('');
  const both = I.clauseCoverageByStandard({
    standards: [F.ORASHI_STANDARD, F.ORASHI_SECOND_STANDARD],
    clauses: [...F.ORASHI_CLAUSES.filter((c) => c.id === 'k81'), ...F.ORASHI_SECOND_CLAUSES],
    auditClauses: [...F.ORASHI_AUDIT_CLAUSES, ...F.ORASHI_SECOND_AUDIT_CLAUSES],
    audits: [...F.ORASHI_AUDITS, ...F.ORASHI_SECOND_AUDITS],
  }, AS_OF);
  out(`clauseCoverageByStandard, each clause against its own standard's cycle (${F.ORASHI_STANDARD.code} ${F.ORASHI_STANDARD.cycle_years} years, ${F.ORASHI_SECOND_STANDARD.code} ${F.ORASHI_SECOND_STANDARD.cycle_years} year), both last examined on the same day:`);
  head('standard', 'clause', 'last examined', 'covered', 'stale');
  for (const r2 of both) row(r2.clause.standard_id === 's-14001' ? F.ORASHI_STANDARD.code : F.ORASHI_SECOND_STANDARD.code, r2.clause_ref, r2.lastExaminedOn, r2.covered, r2.stale);
}

/* ------------------------------------------------------------------ */
section('A FINDING: THE CORRECTION, THE CORRECTIVE ACTION, AND THE CHECK THAT IT WORKED');
{
  out('The ORASHI findings at the as-of date:');
  head('code', 'type', 'status', 'raised', 'due', 'closed', 'open', 'overdue', 'age in days');
  for (const f of F.ORASHI_FINDINGS) {
    row(f.finding_code, f.finding_type, f.status, f.raised_date, f.due_date || 'none', f.closed_date || 'none', I.isFindingOpen(f), I.isFindingOverdue(f, AS_OF), days(I.findingAgeDays(f, AS_OF)));
  }
  out('');
  out('The actions:');
  head('action', 'finding', 'type', 'status', 'due', 'open', 'overdue', 'verified effective');
  const fm = byId(F.ORASHI_FINDINGS);
  for (const a of F.ORASHI_ACTIONS) row(a.id, fm.get(a.finding_id).finding_code, a.action_type, a.status, a.due_date, I.isActionOpen(a), I.isActionOverdue(a, AS_OF), I.isEffectivenessVerified(a));
  out('');
  out('canCloseFinding for each ORASHI finding with its own actions:');
  for (const f of F.ORASHI_FINDINGS) {
    const acts = F.ORASHI_ACTIONS.filter((a) => a.finding_id === f.id);
    const v = I.canCloseFinding(f, acts);
    out(`${f.finding_code} (${f.finding_type}, ${f.status}): ${v.ok ? allowed(v, f.finding_code) : refused(v, f.finding_code)}`);
  }
  out('');
  out('canCloseFinding on a Major nonconformity, one requirement met at a time:');
  const base = { finding_type: 'Major nonconformity', status: 'Verification' };
  const okAct = { action_type: 'Corrective', status: 'Complete', effectiveness_verified: true, effectiveness_checked_at: '2026-10-12', effectiveness_verified_by: 'u-nneka' };
  const steps = [
    ['no correction recorded', base, [], false],
    ['a correction, and an action still open', { ...base, correction: 'Register updated.' }, [{ action_type: 'Corrective', status: 'Open' }], false],
    ['the action complete, no root cause', { ...base, correction: 'Register updated.' }, [{ action_type: 'Corrective', status: 'Complete' }], false],
    ['a root cause, only a preventive action', { ...base, correction: 'Register updated.', root_cause: 'No owner for regulatory change.' }, [{ action_type: 'Preventive', status: 'Complete' }], false],
    ['a corrective action found not to work', { ...base, correction: 'Register updated.', root_cause: 'No owner for regulatory change.' }, [{ ...okAct, effectiveness_verified: false }], false],
    ['a corrective action complete and unchecked', { ...base, correction: 'Register updated.', root_cause: 'No owner for regulatory change.' }, [{ action_type: 'Corrective', status: 'Complete' }], false],
    ['a corrective action verified effective', { ...base, correction: 'Register updated.', root_cause: 'No owner for regulatory change.' }, [okAct], true],
  ];
  for (const [label, f, acts, ok] of steps) out(`${label}: ${verdict(I.canCloseFinding(f, acts), ok, label)}`);
  out(`a Minor nonconformity with its correction and no actions: ${allowed(I.canCloseFinding({ finding_type: 'Minor nonconformity', status: 'Open', correction: 'Briefing held.' }, []), 'minor')}`);
  out(`an Observation with nothing recorded: ${allowed(I.canCloseFinding({ finding_type: 'Observation', status: 'Open' }, []), 'obs')}`);
  out('');
  out('findingByUrgency:');
  head('order', 'code', 'type', 'status', 'overdue');
  [...F.ORASHI_FINDINGS].sort(I.findingByUrgency(AS_OF)).forEach((f, i) => row(i + 1, f.finding_code, f.finding_type, f.status, I.isFindingOverdue(f, AS_OF)));
  out('');
  out('The ISO audit lifecycle uses the same workflow as the Audit & Findings Manager:');
  const same = RAW.isoCompliance.AUDIT_STATUSES.every((s) => JSON.stringify(RAW.isoCompliance.AUDIT_TRANSITIONS[s]) === JSON.stringify(RAW.auditManagement.AUDIT_TRANSITIONS[s]));
  out(`the two AUDIT_TRANSITIONS tables agree on every status: ${same}`);
  out('isAuditOverdue in the ISO module, for an audit whose planned end has passed:');
  for (const st of RAW.isoCompliance.AUDIT_STATUSES) out(`${st}: ${I.isAuditOverdue({ status: st, planned_end: '2026-10-09' }, AS_OF)}`);
  out('');
  const a26 = F.ORASHI_AUDITS.find((a) => a.id === 'ia-2026b');
  const scope = [{ clause_ref: '5.2', result: 'Conformant' }, { clause_ref: '7.2', result: 'Not examined' }, { clause_ref: '8.1', result: 'Not examined' }];
  out(`canReportAudit on ${a26.audit_code} with three clauses in scope, two not yet examined: ${refused(I.canReportAudit({ ...a26, status: 'Fieldwork complete' }, scope), 'iso report')}`);
  out(`with no clauses in scope: ${refused(I.canReportAudit({ ...a26, status: 'Fieldwork complete' }, []), 'iso report empty')}`);
}

/* ------------------------------------------------------------------ */
section('CERTIFICATION READINESS IS A LIST OF BLOCKERS');
{
  const data = { clauses: F.ORASHI_CLAUSES, findings: F.ORASHI_FINDINGS, actions: F.ORASHI_ACTIONS, audits: F.ORASHI_AUDITS, auditClauses: F.ORASHI_AUDIT_CLAUSES };
  const r = I.certificationReadiness(F.ORASHI_STANDARD, data, AS_OF);
  out(`certificationReadiness for ${F.ORASHI_STANDARD.code} at ORASHI: ready ${r.ready}.`);
  out('');
  head('severity', 'count', 'text');
  for (const b of r.blockers) row(b.severity, b.count, b.text);
  out('');
  head('count', 'value');
  for (const [k, v] of Object.entries(r.counts)) row(k, v === null ? 'null' : v);
  out('');
  out('The same register with the certificate expiry moved, and nothing else:');
  head('certificate expires', 'certificateDays', 'certificateExpiring', 'certificateExpired', 'certificate item listed');
  for (const ce of F.ORASHI_CERT_SWEEP) {
    const rr = I.certificationReadiness({ ...F.ORASHI_STANDARD, certificate_expires: ce }, data, AS_OF);
    const item = rr.blockers.find((b) => /certificate/.test(b.text));
    row(ce === null ? 'null' : ce, rr.counts.certificateDays === null ? 'null' : rr.counts.certificateDays, rr.counts.certificateExpiring, rr.counts.certificateExpired, item ? `${item.severity}: ${item.text}` : 'none');
  }
  out('');
  const empty = I.certificationReadiness({ id: 's-empty' }, { clauses: [] }, AS_OF);
  out(`A standard with no clauses in the register: ready ${empty.ready}; ${empty.blockers.map((b) => `${b.severity} (count ${b.count}): ${b.text}`).join(' ')}`);
  out('');
  const s = I.summarise({ standards: [F.ORASHI_STANDARD], clauses: F.ORASHI_CLAUSES, audits: F.ORASHI_AUDITS, findings: F.ORASHI_FINDINGS, actions: F.ORASHI_ACTIONS, auditClauses: F.ORASHI_AUDIT_CLAUSES }, AS_OF);
  out(`summarise over the same register: clauses ${s.clauses}, applicable ${s.applicable}, excluded ${s.excluded}, evidenced claims ${s.evidencedClaims}, unevidenced claims ${s.unevidencedClaims}, notAssessed ${s.notAssessed}, reviews overdue ${s.reviewsOverdue}, reviews due soon ${s.reviewsDueSoon}, audits ${s.audits}, audits open ${s.auditsOpen}, audits overdue ${s.auditsOverdue}, clauses covered ${s.clausesCovered}, never audited ${s.clausesNeverAudited}, stale ${s.clausesStale}, open findings ${s.openFindings}, open major ${s.openMajor}, findings overdue ${s.findingsOverdue}, open actions ${s.openActions}, overdue actions ${s.overdueActions}, awaiting an effectiveness check ${s.actionsAwaitingEffectiveness}.`);
}

/* ------------------------------------------------------------------ */
section('OWNER DECISIONS, HELD LIMITS AND FIVE RULES THIS COURSE TEACHES WITHOUT GRADING');
out('Everything in this section is taught as a stated policy or a limit. None of it is a graded field.');
out('');
out('Owner decisions in force (AssuranceApps-STATUS.md section 3n, AS15), as they touch these five apps:');
out('Q1: an unreadable today makes deriveStatus throw (SECTION 2 prints the error).');
out('Q2: evidence counts towards Compliant only for the current period (SECTION 5).');
out('Q4: ISO coverage counts only Reported or Closed audits (SECTION 20).');
out('Q5: every examiner is checked for independence, through canExamineClause (SECTION 19).');
out('Q6: an expired certificate is a serious readiness item, one inside the lead window a watch item (SECTION 22).');
out('Q11: a Not applicable answer without a reason is not an answer, and a cancellation without a reason does not complete a programme (SECTIONS 15 and 17).');
out('D1: a document review task is decided only by its assigned reviewer, never by the author (SECTION 8).');
out('');
out('Owner ambiguities recorded in the FINDINGS files and not changed:');
out('a document review period missing from a call to nextReviewDate returns no date; the default of DEFAULT_REVIEW_PERIOD_MONTHS is the caller\'s to apply (SECTION 8 prints the null).');
out('a complete audit programme that contains a cancelled audit reads below one hundred percent, by design (SECTION 17 counts reported audits only).');
out('a templated audit passed with no checklist items passes the unanswered-items rule vacuously; the database counts the template itself.');
out('an unreadable today is refused by complianceStatus alone; SECTION 2 shows two other modules answering as though nothing were due.');
out('');
out('Five rules the engine keeps at 9d5d3b4 (ASC-0, engines PR #212), each one asked for by this course\'s recon. Each is current behaviour, measured here:');
{
  const aud = [{ status: 'Reported' }, { status: 'Cancelled' }, { status: 'Cancelled', cancellation_reason: 'Plant shutdown' }, { status: 'Planned', planned_end: '2026-09-01' }];
  const p = A.programmeProgress(aud, AS_OF);
  const s = A.summarise({ audits: aud }, AS_OF);
  out(`R1, one rule for outstanding: on four audits, one of them cancelled with no reason, programmeProgress counts ${p.outstanding} outstanding and summarise counts ${s.auditsOutstanding}. A cancellation without a written reason is outstanding in both, and canCompleteProgramme asks the same rule.`);
  const items = Array.from({ length: 200 }, (_, i) => ({ id: `x${i}` }));
  const resp = items.slice(0, 57).map((it) => ({ item_id: it.id, result: 'Conformant' }));
  const cps = Array.from({ length: 40 }, (_, i) => ({ status: i < 23 ? 'Passed' : 'Pending' }));
  out(`R2, a percent rounds half up on the exact fraction: checklistProgress on 57 answered of 200 prints ${A.checklistProgress(items, resp).percent}, and planProgress on 23 resolved of 40 prints ${Q.planProgress(cps).percent}. checklistProgress, programmeProgress and planProgress are the three exports that print a percent.`);
  const rr = I.certificationReadiness({ id: 's', certificate_expires: '2026-09-30' }, { clauses: [{ id: 'c', standard_id: 's', status: 'Not assessed' }] }, AS_OF);
  out(`R3, expired and expiring are two separate flags: a certificate with certificateDays ${rr.counts.certificateDays} reads certificateExpiring ${rr.counts.certificateExpiring} and certificateExpired ${rr.counts.certificateExpired}. SECTION 22 prints both flags at the edges.`);
  const one = F.IKORO_OBLIGATIONS.find((o) => o.frequency === 'One-off' && o.last_submitted_date);
  const e1 = C.explainStatus(one, AS_OF);
  out(`R4, a filed One-off says it is discharged: ${one.code} reads ${e1.status}, and explainStatus gives the reason "${e1.reason}"`);
  const rr5 = I.certificationReadiness(F.ORASHI_STANDARD, { clauses: F.ORASHI_CLAUSES, findings: [], actions: [], audits: F.ORASHI_AUDITS, auditClauses: F.ORASHI_AUDIT_CLAUSES }, AS_OF);
  const cites = rr5.blockers.filter((b) => b.text.includes(F.ORASHI_STANDARD.code)).length;
  const cites9001 = rr5.blockers.filter((b) => /ISO 9001/.test(b.text)).length;
  out(`R5, a sentence names the register's own standard: the readiness list for ${F.ORASHI_STANDARD.code} carries ${cites} item naming ${F.ORASHI_STANDARD.code} and ${cites9001} naming ISO 9001. SECTION 18 prints the Not applicable refusal for both standards.`);
}

/* ------------------------------------------------------------------ */
section('WHAT THE ORACLES CHECK');
{
  const G = `${ROOT}/test-data/assurance/goldens`;
  head('module', 'golden cases', 'distinct exports with a case', 'sort cases', 'oracle');
  for (const mod of MODS) {
    const g = JSON.parse(fs.readFileSync(`${G}/${mod}_cases.json`, 'utf8'));
    const fns = new Set(g.cases.filter((c) => c.fn).map((c) => c.fn));
    row(mod, g.cases.length, fns.size, g.cases.filter((c) => c.sort).length, g.generatedBy);
  }
  out('');
  out('Each golden file is written by an independent stdlib Python oracle, from the rules as the modules and the status document state them. A golden figure beside an engine figure is two methods agreeing. The oracles check the verdict of a gate (allowed or refused) and never the wording of its reason, so every refusal sentence in this digest is the engine\'s own and is quoted rather than checked.');
}

/* ------------------------------------------------------------------ */
if (sectionNo !== Object.keys(SECTION_OWNERS).length) {
  throw new Error(`SECTION OWNERS: ${Object.keys(SECTION_OWNERS).length} owner rows for ${sectionNo} sections`);
}
const text = `${L.join('\n')}\n`;
if (/NaN|undefined|Invalid Date|\[object Object\]/.test(text)) {
  const bad = L.filter((l) => /NaN|undefined|Invalid Date|\[object Object\]/.test(l)).slice(0, 5);
  throw new Error(`NON-VALUE PRINTED: ${bad.join(' || ')}`);
}
process.stdout.write(text);
const exercised = [...CALLS.keys()].length;
process.stderr.write(`clock gate: ${[...CALLS.values()].reduce((a, b) => a + b, 0)} gated calls to ${exercised} of ${CLOCK.size} clock-reading exports, every one passed the as-of date\n`);
process.stderr.write(`verdicts: ${refusedCount} refusal-labelled, ${allowedCount} allowed-labelled, every label asserted against the engine\n`);
process.stderr.write(`sections: ${sectionNo}, lines: ${L.length}\n`);
