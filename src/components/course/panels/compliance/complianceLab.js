// Teaching lab for the compliance course, "Compliance, Audit & Quality" (academy
// module assurance). The three explorer panels, the course learning page and the
// vitest files all read this one module, so a number shown to a learner and a
// number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINE'S OWN OUTPUT. Every status, reason,
// day count, age, band, percent, verdict and refusal below is a return value of
// engines/assurance (calendar, complianceStatus, documentControl,
// qualityAssurance, auditManagement, isoCompliance) as vendored at petrolord
// engines 9d5d3b4. This is the ONLY file in the course that imports those
// modules. Where a reader carries a value that is not an engine return, it is a
// comparison of two engine returns and its key says Derived: whether a filing
// falls inside a period, which of two dates is the next action, where a status
// changes along a sweep.
//
// THE CLOCK. Every engine export that reads a date against today takes that
// date as a parameter that falls back to the machine clock when it is left out.
// This lab never leaves it out. Every reader takes an as-of Date, defaulting to
// the wave's own AS_OF (built at local midnight from three numbers, exactly as
// compliance_fields.mjs builds it), and passes it explicitly to every engine
// call. A learner moves the as-of date with asOfAt(), which builds another
// local-midnight date from three numbers. Nothing here constructs a Date with no
// arguments or reads Date.now. A date STRING handed over as the as-of date is
// refused by requireAsOf() with a TypeError before it reaches the engine,
// because the engine would throw on it anyway (digest SECTION 2) and a panel
// should show why. complianceLab.test.js builds the whole snapshot under two
// faked system dates and in child processes under two time zones west of
// Greenwich, and demands the same bytes.
//
// NO DATE OBJECT LEAVES THIS FILE. Every date a reader returns is printed by the
// engine's own toDateOnlyString, because a Date serialises as a UTC instant and
// a local midnight is a different instant in every zone.
//
// EVERY REFUSAL IS THE ENGINE'S OWN RETURNED REASON. A verdict reader hands back
// { label, ok, reason }, and the reason is the string on the engine's return. No
// refusal sentence is written as a literal anywhere in this directory, and the
// lab test asserts that over the lab and every panel source.
//
// THE TEACHING CASES are the wave's own records, copied VERBATIM below from
// tools/course-waves/compliance/compliance_fields.mjs, which compliance_dump.mjs
// imports to build the teaching digest. complianceLab.test.js compares the block
// with the wave file byte for byte and imports the wave file to compare every
// value, so the copy cannot be edited here alone. The few walk inputs that live
// in the dump rather than the fields file (the closure ladders, the report
// ladder) are copied below the block, and every verdict they produce is pinned
// against the digest line the dump printed from the same inputs.
//
// THREE TEACHING CASES AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs three other records, and nothing in this lab imports, reads, names or
// reproduces any of them. panelCapstoneGuard.test.js sweeps this directory and
// the learning page for every graded answer as a whole token, signed and bare,
// and for the dates the engine derives on the way to one.
//
// NO PERCENTILE AND NO READINESS SCORE. Nothing in this course is a
// distribution, and certification readiness is a list of blockers. The three
// percents printed here (plan progress, checklist progress, programme delivered)
// are the engine's own, already rounded by it.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

/* eslint-disable import/namespace */
// A namespace rather than named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED engines checkout, which may predate the
// assurance family. Vite and vitest alias @petrolord/engines to this worktree's
// packages/engines, and complianceLab.test.js proves every member resolves.
import * as CAL from '@petrolord/engines/engines/assurance/calendar.js';
import * as C from '@petrolord/engines/engines/assurance/complianceStatus.js';
import * as D from '@petrolord/engines/engines/assurance/documentControl.js';
import * as Q from '@petrolord/engines/engines/assurance/qualityAssurance.js';
import * as A from '@petrolord/engines/engines/assurance/auditManagement.js';
import * as I from '@petrolord/engines/engines/assurance/isoCompliance.js';

/** The engine namespaces, for the lab test's resolution and clock checks. */
export const ENGINE = Object.freeze({ CAL, C, D, Q, A, I });

// ---- BEGIN VERBATIM compliance_fields.mjs ----
export const AS_OF_YMD = '2026-10-15';
export const AS_OF = new Date(2026, 9, 15);

/* ------------------------------------------------------------------ *
 * IKORO: the regulatory obligation register.
 * ------------------------------------------------------------------ */
export const IKORO_OBLIGATIONS = [
  { id: 'o01', code: 'REG-2026-001', title: 'Produced water discharge permit', regime: 'Environmental',
    obligation_type: 'Permit', regulator: 'Federal environmental regulator', frequency: 'Annual',
    due_date: '2027-03-31', expiry_date: '2026-11-20', lead_time_days: 60, lifecycle: 'Active' },
  { id: 'o02', code: 'REG-2026-002', title: 'Monthly produced water quality return', regime: 'Reporting',
    obligation_type: 'Periodic report', regulator: 'Federal environmental regulator', frequency: 'Monthly',
    due_date: '2026-10-10', last_submitted_date: '2026-09-09', lifecycle: 'Active' },
  { id: 'o03', code: 'REG-2026-003', title: 'Quarterly flare and venting return', regime: 'Reporting',
    obligation_type: 'Periodic report', regulator: 'Upstream regulator', frequency: 'Quarterly',
    due_date: '2026-10-31', last_submitted_date: '2026-07-28', lead_time_days: 14, lifecycle: 'Active' },
  { id: 'o04', code: 'REG-2026-004', title: 'Annual environmental monitoring report', regime: 'Environmental',
    obligation_type: 'Periodic report', regulator: 'Federal environmental regulator', frequency: 'Annual',
    due_date: '2027-03-31', last_submitted_date: '2026-03-30', lifecycle: 'Active' },
  { id: 'o05', code: 'REG-2026-005', title: 'Radioactive source licence', regime: 'Licensing',
    obligation_type: 'Licence', regulator: 'Nuclear safety regulator', frequency: 'Biennial',
    due_date: '2026-12-31', expiry_date: '2026-09-30', lifecycle: 'Active' },
  { id: 'o06', code: 'REG-2026-006', title: 'Pipeline right of way consent', regime: 'Operational',
    obligation_type: 'Consent', regulator: 'State ministry of lands', frequency: 'One-off',
    due_date: '2026-08-14', last_submitted_date: '2026-08-10', lifecycle: 'Active' },
  { id: 'o07', code: 'REG-2026-007', title: 'Oil spill contingency plan notification', regime: 'Health & Safety',
    obligation_type: 'Notification', regulator: 'Oil spill response agency', frequency: 'One-off',
    due_date: '2026-09-01', lifecycle: 'Active' },
  { id: 'o08', code: 'REG-2026-008', title: 'Host community development report', regime: 'Reporting',
    obligation_type: 'Periodic report', regulator: 'Host community trust', frequency: 'Semi-annual',
    due_date: '2027-01-31', last_submitted_date: '2026-08-05', lifecycle: 'Active' },
  { id: 'o09', code: 'REG-2026-009', title: 'Original environmental impact approval', regime: 'Environmental',
    obligation_type: 'Permit', regulator: 'Federal environmental regulator', frequency: 'One-off',
    due_date: '2025-01-06', lifecycle: 'Superseded' },
  { id: 'o10', code: 'REG-2026-010', title: 'Safety case resubmission', regime: 'Health & Safety',
    obligation_type: 'Periodic report', regulator: 'Upstream regulator', frequency: 'Other',
    due_date: '2027-06-30', lifecycle: 'Draft' },
  { id: 'o11', code: 'REG-2026-011', title: 'Night noise permit', regime: 'Environmental',
    obligation_type: 'Permit', regulator: 'State ministry of environment', frequency: 'Annual',
    due_date: '2026-05-01', lifecycle: 'Not applicable' },
  { id: 'o12', code: 'REG-2026-012', title: 'Annual concession rental', regime: 'Financial',
    obligation_type: 'Fee or levy', regulator: 'Upstream regulator', frequency: 'Annual',
    due_date: '2026-11-09', last_submitted_date: '2025-11-03', lead_time_days: null, lifecycle: 'Active' },
  { id: 'o13', code: 'REG-2026-013', title: 'Waste consignment register', regime: 'Environmental',
    obligation_type: 'Other', regulator: 'State ministry of environment', frequency: 'Other',
    lifecycle: 'Active' },
];

/** The lead-time sweep runs on the flare return (o03) and nothing else. */
export const IKORO_LEAD_SWEEP = [0, 7, 14, 16, 17, 30, 90, null, '', -5, 'ten'];

/** One due date rolled by every frequency, and the three month-end cases. */
export const ROLL_FROM = '2026-08-31';
export const ROLL_EXTRA = [['2026-01-31', 'Monthly'], ['2028-02-29', 'Annual'], ['2026-03-31', 'Semi-annual']];
export const PERIOD_DUE = '2026-10-31';
/** The monthly return, filed late: the date that WAS due, and the date it was filed. */
export const IKORO_LATE_FILING = { due: '2026-10-10', filed: '2026-10-14', frequency: 'Monthly' };

/* ------------------------------------------------------------------ *
 * IKORO: the controlled document library.
 * ------------------------------------------------------------------ */
export const IKORO_DOCUMENTS = [
  { id: 'd1', document_number: 'HSE-PRO-0007', title: 'Produced water sampling procedure', status: 'Published',
    department: 'HSE', category: 'Procedure', confidentiality: 'Internal', issue_date: '2024-09-30',
    review_period_months: 24, next_review_date: '2026-09-30', revision: '03' },
  { id: 'd2', document_number: 'OPS-PLA-0002', title: 'Terminal emergency response plan', status: 'Published',
    department: 'Operations', category: 'Plan', confidentiality: 'Confidential', issue_date: '2025-11-02',
    review_period_months: 12, next_review_date: '2026-11-02', revision: '06' },
  { id: 'd3', document_number: 'ENG-STD-0011', title: 'Tank inspection standard', status: 'Approved',
    department: 'Engineering', category: 'Standard', confidentiality: 'Internal', issue_date: '2025-06-30',
    review_period_months: 24, next_review_date: '2027-06-30', revision: '01' },
  { id: 'd4', document_number: 'OPS-PHI-0001', title: 'Flare management philosophy', status: 'Published',
    department: 'Operations', category: 'Philosophy', confidentiality: 'Internal', revision: '02' },
  { id: 'd5', document_number: 'OPS-PRO-0004', title: 'Custody metering procedure (old issue)', status: 'Superseded',
    department: 'Operations', category: 'Procedure', confidentiality: 'Restricted', next_review_date: '2020-01-06',
    revision: '04' },
  { id: 'd6', document_number: 'HSE-PRO-0012', title: 'Oily waste handling procedure', status: 'Draft',
    department: 'HSE', category: 'Procedure', confidentiality: 'Internal', revision: '01' },
  { id: 'd7', document_number: 'ENG-PRO-0019', title: 'Hydrotest procedure', status: 'In Review',
    department: 'Engineering', category: 'Procedure', confidentiality: 'Internal', revision: '09' },
];

/** Review dates earned at issue: [issue date, review period in months]. */
export const IKORO_REVIEW_PERIODS = [
  ['2025-11-02', 12], ['2025-06-30', 24], ['2024-08-31', 18], ['2025-12-31', 2], ['2024-02-29', 12],
  ['2025-03-14', 'DEFAULT'], ['2025-03-14', 0], ['2025-03-14', null],
];
/** A correction re-published after issue: the review counts from the issue date. */
export const IKORO_CORRECTION = { issue: '2025-03-14', republished: '2026-10-01', months: 24 };
export const IKORO_REVISIONS = ['01', '09', '099', '7', '10', 'A', '', null, ' 04 '];
export const IKORO_PREFIXES = [['Health, Safety & Environment', 'Procedure'], ['Operations', 'Plan'], ['', ''], ['QA', 'ITP']];
export const IKORO_REVISION_UNDER_REVIEW = { id: 'rev-0019-10', document_id: 'd7', created_by: 'u-adaeze' };
export const IKORO_REVIEW_TASKS = [
  { label: 'the author assigns herself', kind: 'assign', reviewer: 'u-adaeze' },
  { label: 'no reviewer chosen', kind: 'assign', reviewer: null },
  { label: 'an independent reviewer is assigned', kind: 'assign', reviewer: 'u-tamuno' },
  { label: 'the assigned reviewer decides a pending task', kind: 'decide', task: { status: 'Pending', reviewer_id: 'u-tamuno' }, user: 'u-tamuno' },
  { label: 'somebody else decides it for the reviewer', kind: 'decide', task: { status: 'Pending', reviewer_id: 'u-tamuno' }, user: 'u-ebi' },
  { label: 'the author was assigned by mistake and tries to decide', kind: 'decide', task: { status: 'Pending', reviewer_id: 'u-adaeze' }, user: 'u-adaeze' },
  { label: 'a task already approved is decided again', kind: 'decide', task: { status: 'Approved', reviewer_id: 'u-tamuno' }, user: 'u-tamuno' },
];

/* ------------------------------------------------------------------ *
 * ABAM: the flowline tie-in quality plan and its inspection and test plan.
 * ------------------------------------------------------------------ */
export const ABAM_PLAN = { id: 'p-abam', plan_code: 'QAP-2026-014', title: 'Abam flowline tie-in', status: 'Active' };
const V = { result_date: '2026-09-12', verified_by: 'u-ifeoma' };
export const ABAM_CHECKPOINTS = [
  { id: 'c01', plan_id: 'p-abam', item_no: 'H-01', title: 'Material certificates review', point_type: 'Hold point', status: 'Passed', planned_date: '2026-08-20', ...V },
  { id: 'c02', plan_id: 'p-abam', item_no: 'W-02', title: 'Weld procedure qualification test', point_type: 'Witness point', status: 'Passed', planned_date: '2026-08-24', ...V },
  { id: 'c03', plan_id: 'p-abam', item_no: 'H-03', title: 'Welder qualification', point_type: 'Hold point', status: 'Passed', planned_date: '2026-08-26', ...V },
  { id: 'c04', plan_id: 'p-abam', item_no: 'R-04', title: 'NDT procedure review', point_type: 'Review point', status: 'Passed', planned_date: '2026-08-28', ...V },
  { id: 'c05', plan_id: 'p-abam', item_no: 'H-05', title: 'Radiography of tie-in welds', point_type: 'Hold point', status: 'Failed', planned_date: '2026-09-10', ...V },
  { id: 'c06', plan_id: 'p-abam', item_no: 'W-06', title: 'Coating holiday test', point_type: 'Witness point', status: 'Waived', planned_date: '2026-09-15', ...V, remarks: 'Vendor inspector unavailable; third party report accepted.' },
  { id: 'c07', plan_id: 'p-abam', item_no: 'M-07', title: 'Daily fit-up monitoring', point_type: 'Monitor point', status: 'Not applicable', planned_date: '2026-09-01' },
  { id: 'c08', plan_id: 'p-abam', item_no: 'H-08', title: 'Hydrostatic test', point_type: 'Hold point', status: 'Pending', planned_date: '2026-10-20' },
  { id: 'c09', plan_id: 'p-abam', item_no: 'W-09', title: 'Hydrotest chart review', point_type: 'Witness point', status: 'Pending', planned_date: '2026-10-21' },
  { id: 'c10', plan_id: 'p-abam', item_no: 'S-10', title: 'Site surveillance', point_type: 'Surveillance point', status: 'In progress', planned_date: '2026-10-01' },
  { id: 'c11', plan_id: 'p-abam', item_no: 'H-11', title: 'Pre-commissioning release', point_type: 'Hold point', status: 'Pending', planned_date: '2026-11-05' },
  { id: 'c12', plan_id: 'p-abam', item_no: 'R-12', title: 'As-built dossier review', point_type: 'Review point', status: 'Notified', planned_date: '2026-10-09' },
];

/** Decisions asked of the engine, each on a point of the ABAM plan. */
export const ABAM_DECISIONS = [
  { label: 'H-08 passed with nobody named', item: 'c08', status: 'Passed', patch: { result_date: '2026-10-15' } },
  { label: 'W-09 passed with nobody named', item: 'c09', status: 'Passed', patch: {} },
  { label: 'W-09 waived with no reason', item: 'c09', status: 'Waived', patch: { result_date: '2026-10-15', verified_by: 'u-ifeoma' } },
  { label: 'H-11 set Not applicable with nothing recorded', item: 'c11', status: 'Not applicable', patch: {} },
  { label: 'H-11 set Not applicable with a date and a name but no reason', item: 'c11', status: 'Not applicable', patch: { result_date: '2026-10-15', verifier_name: 'Certifying authority surveyor' } },
  { label: 'H-11 set Not applicable with a date, a name and a reason', item: 'c11', status: 'Not applicable', patch: { result_date: '2026-10-15', verifier_name: 'Certifying authority surveyor', remarks: 'Tie-in commissioned under the host facility permit.' } },
  { label: 'S-10 set Not applicable with nothing recorded', item: 'c10', status: 'Not applicable', patch: {} },
  { label: 'H-08 passed with a date and a verifier', item: 'c08', status: 'Passed', patch: { result_date: '2026-10-15', verified_by: 'u-ifeoma' } },
  { label: 'a status the vocabulary does not have', item: 'c08', status: 'Accepted', patch: {} },
];

export const ABAM_REMOVALS = [
  { label: 'H-08, a pending hold point, from the Active plan', item: 'c08', plan: 'Active' },
  { label: 'W-09, a pending witness point, from the Active plan', item: 'c09', plan: 'Active' },
  { label: 'R-04, a passed review point, from the Active plan', item: 'c04', plan: 'Active' },
  { label: 'H-08 from the same plan while it was still a Draft', item: 'c08', plan: 'Draft' },
  { label: 'W-09 from the plan once it is Closed', item: 'c09', plan: 'Closed' },
];

/* ABAM non-conformance reports and their corrective and preventive actions. */
export const ABAM_NCRS = [
  { id: 'n1', ncr_code: 'NCR-2026-031', plan_id: 'p-abam', title: 'Radiography reject on tie-in weld TW-07', severity: 'Major',
    status: 'Actions in progress', raised_date: '2026-09-02', due_date: '2026-10-02', disposition: 'Repair',
    disposition_date: '2026-09-05', root_cause_category: 'Human factors or competence',
    root_cause: 'Root pass run outside the qualified heat input range.' },
  { id: 'n2', ncr_code: 'NCR-2026-027', plan_id: 'p-abam', title: 'Coating thickness below specification on spool S-14', severity: 'Minor',
    status: 'Open', raised_date: '2026-08-12', due_date: '2026-11-12' },
  { id: 'n3', ncr_code: 'NCR-2026-019', plan_id: 'p-abam', title: 'Wrong flange rating delivered', severity: 'Critical',
    status: 'Disposition agreed', raised_date: '2026-06-20', due_date: '2026-09-30', disposition: 'Return to supplier',
    disposition_date: '2026-06-24', root_cause_category: 'Supplier or subcontractor',
    root_cause: 'Purchase order rating transcribed from a superseded datasheet.' },
  { id: 'n4', ncr_code: 'NCR-2026-022', plan_id: 'p-abam', title: 'Bolt torque record missing', severity: 'Observation',
    status: 'Closed', raised_date: '2026-07-01', closed_date: '2026-07-09', disposition: 'Use as is', disposition_date: '2026-07-03' },
  { id: 'n5', ncr_code: 'NCR-2026-011', plan_id: 'p-abam', title: 'Pipe ovality out of tolerance', severity: 'Major',
    status: 'Voided', raised_date: '2026-05-11', closed_date: '2026-05-13' },
  { id: 'n6', ncr_code: 'NCR-2026-006', plan_id: 'p-abam', title: 'Gate valve body casting porosity', severity: 'Minor',
    status: 'Closed', raised_date: '2026-03-03', closed_date: '2026-04-20', disposition: 'Regrade', disposition_date: '2026-03-10' },
];
export const ABAM_CAPAS = [
  { id: 'k1', ncr_id: 'n1', action_type: 'Corrective', status: 'Complete', due_date: '2026-09-25', completed_date: '2026-09-24' },
  { id: 'k2', ncr_id: 'n1', action_type: 'Preventive', status: 'In progress', due_date: '2026-10-05' },
  { id: 'k3', ncr_id: 'n3', action_type: 'Corrective', status: 'Complete', due_date: '2026-07-31', completed_date: '2026-07-30',
    effectiveness_verified: false, effectiveness_checked_at: '2026-09-01', effectiveness_verified_by: 'u-ifeoma' },
  { id: 'k4', ncr_id: 'n3', action_type: 'Corrective', status: 'Complete', due_date: '2026-09-15', completed_date: '2026-09-14',
    effectiveness_verified: true, effectiveness_checked_at: '2026-10-08', effectiveness_verified_by: 'u-ifeoma' },
  { id: 'k5', ncr_id: 'n5', action_type: 'Corrective', status: 'Open', due_date: '2026-06-01' },
  { id: 'k6', ncr_id: 'n2', action_type: 'Corrective', status: 'Open', due_date: '2026-11-01' },
];

/** The closure ladder, one Major NCR walked from nothing to closable. */
export const NCR_LADDER_BASE = { severity: 'Major', status: 'Actions in progress' };

/* ------------------------------------------------------------------ *
 * ABAM: the contractor HSE audit and the 2026 audit programme.
 * ------------------------------------------------------------------ */
export const ABAM_AUDIT = {
  id: 'a-abam-07', audit_code: 'AUD-2026-007', title: 'Pipeline contractor HSE audit, Abam tie-in', audit_type: 'Contractor',
  template_id: 't-contractor', status: 'Fieldwork complete', lead_auditor_id: 'u-kelechi', auditee_id: 'u-boma',
  planned_start: '2026-10-05', planned_end: '2026-10-09',
};
const item = (n, crit, title) => ({ id: `i${String(n).padStart(2, '0')}`, item_no: `${n}`, criticality: crit, question: title });
export const ABAM_ITEMS = [
  item(1, 'Critical', 'Permit to work displayed at the work site'),
  item(2, 'Critical', 'Gas test recorded before hot work'),
  item(3, 'Major', 'Toolbox talk held and signed'),
  item(4, 'Major', 'Lifting plan approved for the tie-in lift'),
  item(5, 'Minor', 'Housekeeping at the laydown area'),
  item(6, 'Critical', 'Isolation certificate matches the tie-in point'),
  item(7, 'Major', 'Fire watch posted for hot work'),
  item(8, 'Minor', 'Welfare facilities adequate'),
  item(9, 'Major', 'Excavation shoring inspected'),
  item(10, 'Minor', 'Waste segregated at source'),
  item(11, 'Critical', 'Confined space entry attendant present'),
  item(12, 'Major', 'Radiography exclusion zone barricaded'),
  item(13, 'Minor', 'Signage current'),
  item(14, 'Major', 'Emergency drill held this month'),
];
const r = (n, result, note) => ({ id: `r${String(n).padStart(2, '0')}`, item_id: `i${String(n).padStart(2, '0')}`, result, ...(note === undefined ? {} : { note }) });
export const ABAM_RESPONSES = [
  r(1, 'Conformant'), r(2, 'Nonconformant', 'No gas test entry for the 07:30 hot work.'), r(3, 'Conformant'),
  r(4, 'Observation', 'Plan approved; rigging sketch not attached.'), r(5, 'Conformant'),
  r(6, 'Nonconformant', 'Isolation certificate names valve XV-102, tie-in is at XV-103.'), r(7, 'Conformant'),
  r(8, 'Conformant'), r(9, 'Not applicable', 'No excavation open during the audit.'), r(10, 'Not applicable', '   '),
  r(11, 'Not applicable'), r(12, 'Conformant'),
];
/** The finding raised from item 2; item 6 has none yet. */
export const ABAM_FINDINGS = [
  { id: 'f1', finding_code: 'AF-2026-018', audit_id: 'a-abam-07', response_id: 'r02', finding_type: 'Major nonconformity',
    title: 'Hot work started without a recorded gas test', objective_evidence: 'Hot work permit HW-4410, 07:30, gas test field blank.',
    status: 'Open', raised_date: '2026-10-08', due_date: '2026-10-22', stop_work: true,
    correction: 'Work stopped at 07:50, area gas tested, permit re-issued.' },
];
export const RAISE_ATTEMPTS = [
  { label: 'no finding type', finding: { title: 'x', objective_evidence: 'y' } },
  { label: 'no one-line statement', finding: { finding_type: 'Minor nonconformity', objective_evidence: 'y' } },
  { label: 'no objective evidence', finding: { finding_type: 'Minor nonconformity', title: 'Signage out of date' } },
  { label: 'a stop-work observation', finding: { finding_type: 'Observation', title: 'Unsafe lift', objective_evidence: 'Seen 10:15.', stop_work: true } },
  { label: 'a stop-work nonconformity with no correction recorded', finding: { finding_type: 'Major nonconformity', title: 'Unsafe lift', objective_evidence: 'Seen 10:15.', stop_work: true } },
  { label: 'a stop-work nonconformity with its correction', finding: { finding_type: 'Major nonconformity', title: 'Unsafe lift', objective_evidence: 'Seen 10:15.', stop_work: true, correction: 'Lift stopped, load lowered, rigging replaced.' } },
];

export const ABAM_PROGRAMME = { id: 'pg-2026', title: 'Abam asset HSE audit programme 2026', status: 'In progress',
  approved_at: '2026-01-20', approver_name: 'Asset manager' };
export const ABAM_PROGRAMME_AUDITS = [
  { id: 'g1', audit_code: 'AUD-2026-001', status: 'Closed', planned_end: '2026-02-13' },
  { id: 'g2', audit_code: 'AUD-2026-002', status: 'Reported', planned_end: '2026-04-17' },
  { id: 'g3', audit_code: 'AUD-2026-003', status: 'Closed', planned_end: '2026-05-22' },
  { id: 'g4', audit_code: 'AUD-2026-004', status: 'Cancelled', planned_end: '2026-06-19', cancellation_reason: 'Facility shut in for turnaround.' },
  { id: 'g5', audit_code: 'AUD-2026-005', status: 'In progress', planned_end: '2026-09-25' },
  { id: 'g6', audit_code: 'AUD-2026-006', status: 'Planned', planned_end: '2026-10-02' },
  { id: 'g7', audit_code: 'AUD-2026-007', status: 'Fieldwork complete', planned_end: '2026-10-09' },
  { id: 'g8', audit_code: 'AUD-2026-008', status: 'Planned', planned_end: '2026-11-27' },
];

/* ------------------------------------------------------------------ *
 * ORASHI: the ISO 14001:2015 environmental management system.
 * ------------------------------------------------------------------ */
export const ORASHI_STANDARD = { id: 's-14001', code: 'ISO 14001:2015', title: 'Environmental management systems',
  certification_status: 'Certified', cycle_years: 3, certificate_expires: '2027-01-08' };
const ev = (by = 'u-nneka') => ({ evidence_reference: 'EMS-REC', assessed_date: '2026-05-04', assessed_by: by });
export const ORASHI_CLAUSES = [
  { id: 'k41', standard_id: 's-14001', clause_ref: '4.1', title: 'Understanding the organization and its context', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-nneka', ...ev(), evidence_reference: 'EMS-REC-004', next_review_due: '2027-05-04' },
  { id: 'k43', standard_id: 's-14001', clause_ref: '4.3', title: 'Scope of the environmental management system', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-nneka', ...ev(), evidence_reference: 'EMS-MAN-001', next_review_due: '2026-10-01' },
  { id: 'k52', standard_id: 's-14001', clause_ref: '5.2', title: 'Environmental policy', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-obinna', evidence_reference: '', assessed_date: '2026-05-04', assessed_by: 'u-nneka', next_review_due: '2027-05-04' },
  { id: 'k612', standard_id: 's-14001', clause_ref: '6.1.2', title: 'Environmental aspects', applicability: 'Applicable', status: 'Partially conformant', owner_id: 'u-tari', ...ev(), evidence_reference: 'EMS-REG-002', next_review_due: '2026-11-02' },
  { id: 'k613', standard_id: 's-14001', clause_ref: '6.1.3', title: 'Compliance obligations', applicability: 'Applicable', status: 'Nonconformant', owner_id: 'u-tari', assessed_date: '2026-06-12', assessed_by: 'u-nneka', next_review_due: '2027-06-12' },
  { id: 'k72', standard_id: 's-14001', clause_ref: '7.2', title: 'Competence', applicability: 'Applicable', status: 'Not assessed', owner_id: 'u-obinna', next_review_due: '2027-01-31' },
  { id: 'k753', standard_id: 's-14001', clause_ref: '7.5.3', title: 'Control of documented information', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-obinna', ...ev(), evidence_reference: 'EMS-PRO-010', next_review_due: '2027-05-04' },
  { id: 'k81', standard_id: 's-14001', clause_ref: '8.1', title: 'Operational planning and control', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-kalu', ...ev(), evidence_reference: 'EMS-PRO-021', next_review_due: '2027-05-04' },
  { id: 'k82', standard_id: 's-14001', clause_ref: '8.2', title: 'Emergency preparedness and response', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-kalu', ...ev(), evidence_reference: 'EMS-ERP-003', next_review_due: '2027-05-04' },
  { id: 'k911', standard_id: 's-14001', clause_ref: '9.1.1', title: 'Monitoring, measurement, analysis and evaluation', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-tari', ...ev(), evidence_reference: 'EMS-MON-006', next_review_due: '2027-05-04' },
  { id: 'k92', standard_id: 's-14001', clause_ref: '9.2', title: 'Internal audit', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-nneka', ...ev(), evidence_reference: 'EMS-AUD-PRG-2026', next_review_due: '2027-05-04' },
  { id: 'k102', standard_id: 's-14001', clause_ref: '10.2', title: 'Nonconformity and corrective action', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-nneka', ...ev(), evidence_reference: 'EMS-CAR-LOG', next_review_due: '2027-05-04' },
  { id: 'k44', standard_id: 's-14001', clause_ref: '4.4', title: 'Environmental management system (sites outside scope)', applicability: 'Not applicable', status: 'Not applicable', applicability_justification: 'Offsite marketing office excluded from the certified scope.', owner_id: 'u-nneka' },
];
export const ORASHI_AUDITS = [
  { id: 'ia-2023', audit_code: 'ISA-2023-002', audit_type: 'Internal', status: 'Closed', lead_auditor_id: 'u-chidi', actual_end: '2023-09-22', planned_end: '2023-09-22' },
  { id: 'ia-2024', audit_code: 'ISA-2024-001', audit_type: 'Internal', status: 'Closed', lead_auditor_id: 'u-chidi', actual_end: '2024-05-17', planned_end: '2024-05-17' },
  { id: 'ia-2026a', audit_code: 'ISA-2026-001', audit_type: 'Internal', status: 'Reported', lead_auditor_id: 'u-chidi', actual_end: '2026-06-12', planned_end: '2026-06-12', conclusion: 'System effective with one major nonconformity on compliance obligations.' },
  { id: 'ia-2026b', audit_code: 'ISA-2026-002', audit_type: 'Internal', status: 'In progress', lead_auditor_id: 'u-chidi', planned_end: '2026-10-09' },
  { id: 'ia-2025x', audit_code: 'ISA-2025-003', audit_type: 'Internal', status: 'Cancelled', lead_auditor_id: 'u-chidi', planned_end: '2025-11-14' },
  { id: 'cb-2026', audit_code: 'ISA-2026-S01', audit_type: 'Surveillance', status: 'Closed', lead_auditor_name: 'Certification body lead auditor', actual_end: '2026-07-24', planned_end: '2026-07-24' },
];
export const ORASHI_AUDIT_CLAUSES = [
  // 4.1: examined in 2024 (Closed) and in the Reported 2026 audit.
  { audit_id: 'ia-2024', clause_id: 'k41', result: 'Conformant', examined_on: '2024-05-15' },
  { audit_id: 'ia-2026a', clause_id: 'k41', result: 'Conformant', examined_on: '2026-06-10' },
  // 4.3: only in 2023, before the cycle began.
  { audit_id: 'ia-2023', clause_id: 'k43', result: 'Conformant', examined_on: '2023-09-20' },
  // 5.2: the Reported audit, then the In-progress one (which does not count yet).
  { audit_id: 'ia-2026a', clause_id: 'k52', result: 'Observation', examined_on: '2026-06-09' },
  { audit_id: 'ia-2026b', clause_id: 'k52', result: 'Conformant', examined_on: '2026-10-06' },
  // 6.1.2: only the certification body's surveillance audit, which is not internal.
  { audit_id: 'cb-2026', clause_id: 'k612', result: 'Conformant', examined_on: '2026-07-22' },
  // 6.1.3: the Reported audit found it nonconformant.
  { audit_id: 'ia-2026a', clause_id: 'k613', result: 'Nonconformant', examined_on: '2026-06-11' },
  // 7.2: in scope of the 2026 audit but never examined.
  { audit_id: 'ia-2026a', clause_id: 'k72', result: 'Not examined', examined_on: '2026-06-12' },
  // 7.5.3: examined only by an audit later Cancelled.
  { audit_id: 'ia-2025x', clause_id: 'k753', result: 'Conformant', examined_on: '2025-11-12' },
  // 8.1, 8.2, 9.1.1, 9.2, 10.2: the 2024 audit, the latter three again in 2026.
  { audit_id: 'ia-2024', clause_id: 'k81', result: 'Conformant', examined_on: '2024-05-16' },
  { audit_id: 'ia-2024', clause_id: 'k82', result: 'Conformant', examined_on: '2024-05-16' },
  { audit_id: 'ia-2024', clause_id: 'k911', result: 'Conformant', examined_on: '2024-05-14' },
  { audit_id: 'ia-2026a', clause_id: 'k911', result: 'Conformant', examined_on: '2026-06-11' },
  { audit_id: 'ia-2026a', clause_id: 'k92', result: 'Conformant', examined_on: '2026-06-08' },
  { audit_id: 'ia-2026a', clause_id: 'k102', result: 'Conformant', examined_on: '2026-06-12' },
];
export const ORASHI_FINDINGS = [
  { id: 'if1', finding_code: 'ISF-2026-004', audit_id: 'ia-2026a', standard_id: 's-14001', clause_id: 'k613', finding_type: 'Major nonconformity',
    title: 'Compliance obligations register not updated for the new discharge limits', status: 'Action in progress',
    raised_date: '2026-06-12', due_date: '2026-09-30', correction: 'Register updated for the two new limits.',
    root_cause_category: 'Management system', root_cause: 'No owner for regulatory change monitoring.' },
  { id: 'if2', finding_code: 'ISF-2026-005', audit_id: 'ia-2026a', standard_id: 's-14001', clause_id: 'k52', finding_type: 'Minor nonconformity',
    title: 'Policy not communicated to two contractors', status: 'Open', raised_date: '2026-06-12', due_date: '2026-12-11' },
  { id: 'if3', finding_code: 'ISF-2026-001', audit_id: 'cb-2026', standard_id: 's-14001', clause_id: 'k82', finding_type: 'Major nonconformity',
    title: 'Spill drill not held at the jetty', status: 'Closed', raised_date: '2026-02-03', closed_date: '2026-04-21',
    due_date: '2026-04-30', correction: 'Drill held.', root_cause: 'Drill schedule omitted the jetty.', root_cause_category: 'Planning or scheduling' },
  { id: 'if4', finding_code: 'ISF-2026-002', audit_id: 'ia-2026a', standard_id: 's-14001', clause_id: 'k911', finding_type: 'Observation',
    title: 'Calibration labels faded', status: 'Voided', raised_date: '2026-06-10', closed_date: '2026-06-13' },
  { id: 'if5', finding_code: 'ISF-2026-003', audit_id: 'ia-2026a', standard_id: 's-14001', clause_id: 'k102', finding_type: 'Opportunity for improvement',
    title: 'Trend corrective action closure times', status: 'Open', raised_date: '2026-06-12' },
];
export const ORASHI_ACTIONS = [
  { id: 'ac1', finding_id: 'if1', action_type: 'Corrective', status: 'In progress', due_date: '2026-10-02' },
  { id: 'ac2', finding_id: 'if3', action_type: 'Corrective', status: 'Complete', due_date: '2026-04-15',
    effectiveness_verified: true, effectiveness_checked_at: '2026-07-24', effectiveness_verified_by: 'u-nneka' },
  { id: 'ac3', finding_id: 'if2', action_type: 'Corrective', status: 'Open', due_date: '2026-11-30' },
  { id: 'ac4', finding_id: 'if1', action_type: 'Preventive', status: 'Complete', due_date: '2026-09-01' },
];
/** A second standard, so each clause is judged against its OWN cycle. */
export const ORASHI_SECOND_STANDARD = { id: 's-45001', code: 'ISO 45001:2018', certification_status: 'Seeking certification', cycle_years: 1 };
export const ORASHI_SECOND_CLAUSES = [
  { id: 'q61', standard_id: 's-45001', clause_ref: '6.1.2', title: 'Hazard identification', applicability: 'Applicable', status: 'Conformant', owner_id: 'u-kalu', ...ev(), evidence_reference: 'OHS-HAZ-001' },
];
export const ORASHI_SECOND_AUDITS = [
  { id: 'ia-2025', audit_code: 'ISA-2025-001', audit_type: 'Internal', status: 'Closed', lead_auditor_id: 'u-chidi', actual_end: '2025-10-14', planned_end: '2025-10-14' },
];
export const ORASHI_SECOND_AUDIT_CLAUSES = [
  { audit_id: 'ia-2025', clause_id: 'q61', result: 'Conformant', examined_on: '2025-10-14' },
  { audit_id: 'ia-2025', clause_id: 'k81', result: 'Conformant', examined_on: '2025-10-14' },
];
/** Certificate expiry dates for the readiness sweep, as offsets the ENGINE measures. */
export const ORASHI_CERT_SWEEP = ['2026-10-14', '2026-10-15', '2027-01-13', '2027-01-14', 'tbc', null];
// ---- END VERBATIM compliance_fields.mjs ----

// ---------------------------------------------------------------------------
// WALK INPUTS THE DUMP HOLDS. Copied from compliance_dump.mjs, which builds the
// digest from them. Each verdict they produce is pinned by complianceLab.test.js
// against the digest line printed from the same inputs, so an edit here that
// changes a verdict fails there.
// ---------------------------------------------------------------------------

/** SECTION 2: the strings parseDateOnly is shown. */
export const CALENDAR_PROBES = ['2026-10-15', '2026-11-30', '2026-09-30', '2027-02-28', '2026-02-30', '2026-13-01', '2026-10-15T23:59:00+14:00', '15/10/2026', '', 'tbc'];

/** SECTION 14: ageBand at its edges. */
export const AGE_BAND_EDGES = [0, 30, 31, 60, 61, 90, 91, -1];

/** SECTIONS 16 and 21: an audit whose planned end is read against the as-of date. */
export const PLANNED_END_PROBE = '2026-10-09';

const LADDER_ROOT = 'Heat input outside the procedure.';
const LADDER_DISPOSED = { disposition: 'Repair', disposition_date: '2026-09-05' };
/** SECTION 13: one Major NCR, one requirement met at a time. */
export const NCR_LADDER = [
  { label: 'nothing recorded', patch: {}, capas: [] },
  { label: 'a disposition, Repair', patch: { disposition: 'Repair' }, capas: [] },
  { label: 'and the date it was agreed', patch: LADDER_DISPOSED, capas: [] },
  { label: 'and a root cause, with a preventive action still in progress', patch: { ...LADDER_DISPOSED, root_cause: LADDER_ROOT }, capas: [{ action_type: 'Preventive', status: 'In progress' }] },
  { label: 'with the preventive action finished and no corrective action', patch: { ...LADDER_DISPOSED, root_cause: LADDER_ROOT }, capas: [{ action_type: 'Preventive', status: 'Complete' }] },
  { label: 'with one corrective action checked and found not to work', patch: { ...LADDER_DISPOSED, root_cause: LADDER_ROOT }, capas: [{ action_type: 'Corrective', status: 'Complete', effectiveness_verified: false, effectiveness_checked_at: '2026-10-01', effectiveness_verified_by: 'u-ifeoma' }] },
  { label: 'with one corrective action complete and not yet checked', patch: { ...LADDER_DISPOSED, root_cause: LADDER_ROOT }, capas: [{ action_type: 'Corrective', status: 'Complete' }] },
  { label: 'with a corrective action verified effective', patch: { ...LADDER_DISPOSED, root_cause: LADDER_ROOT }, capas: [{ action_type: 'Corrective', status: 'Complete', effectiveness_verified: true, effectiveness_checked_at: '2026-10-12', effectiveness_verified_by: 'u-ifeoma' }] },
];
const MINOR_NCR = { severity: 'Minor', status: 'Open', disposition: 'Rework', disposition_date: '2026-09-05' };
/** SECTION 13: the same last steps on a Minor NCR. */
export const MINOR_NCR_LADDER = [
  { label: 'no root cause, no actions', capas: [] },
  { label: 'one corrective action complete and never checked', capas: [{ action_type: 'Corrective', status: 'Complete' }] },
  { label: 'one corrective action still open', capas: [{ action_type: 'Corrective', status: 'Open' }] },
];

/** SECTION 16: the report ladder on AUD-2026-007. */
const REPORT_NOTES = { i10: 'No waste generated on the tie-in spread.', i11: 'No confined space entry on this scope.' };
const REPORT_EXTRA_ANSWERS = [{ id: 'r13', item_id: 'i13', result: 'Conformant' }, { id: 'r14', item_id: 'i14', result: 'Conformant' }];
const REPORT_SECOND_FINDING = { id: 'f2', finding_code: 'AF-2026-019', audit_id: 'a-abam-07', response_id: 'r06', finding_type: 'Major nonconformity', title: 'Isolation certificate names the wrong valve', objective_evidence: 'Certificate IC-221 names XV-102.', status: 'Open', raised_date: '2026-10-09' };
const REPORT_CONCLUSION = 'Two major nonconformities on permit control; work stopped once.';

/** SECTION 18: canSetClauseStatus on clause 7.2, every try with the register's standard. */
export const CLAUSE_STATUS_TRIES = [
  { label: 'Conformant, nothing else', status: 'Conformant', patch: {} },
  { label: 'Conformant with an evidence reference only', status: 'Conformant', patch: { evidence_reference: 'EMS-TRN-MATRIX' } },
  { label: 'Conformant with evidence, a date and an assessor', status: 'Conformant', patch: { evidence_reference: 'EMS-TRN-MATRIX', assessed_date: '2026-10-12', assessed_by: 'u-nneka' } },
  { label: 'Nonconformant with no date', status: 'Nonconformant', patch: { assessed_by: 'u-nneka' } },
  { label: 'Nonconformant with a date and an assessor', status: 'Nonconformant', patch: { assessed_date: '2026-10-12', assessor_name: 'External assessor' } },
  { label: 'Not applicable while still marked Applicable', status: 'Not applicable', patch: {} },
  { label: 'Not applicable and applicability Not applicable, no justification', status: 'Not applicable', patch: { applicability: 'Not applicable' } },
  { label: 'Not applicable with its justification', status: 'Not applicable', patch: { applicability: 'Not applicable', applicability_justification: 'Competence is managed under the group HR system outside this scope.' } },
  { label: 'Compliant, a word the vocabulary does not have', status: 'Compliant', patch: {} },
];
/** SECTION 18: the standards the Not applicable refusal is asked under, and none. */
export const REFUSAL_STANDARDS = [
  { label: 'ISO 14001:2015', standard: 'register' },
  { label: 'ISO 9001:2015', standard: { code: 'ISO 9001:2015' } },
  { label: 'ISO 45001:2018', standard: 'second' },
  { label: 'no standard passed', standard: null },
];

/** SECTION 19: the in-scope clauses of the planned internal audit, and the picker. */
export const SCOPE_CLAUSE_IDS = ['k81', 'k82', 'k911', 'k92'];
export const LEAD_AUDITOR_CHOICES = ['u-chidi', 'u-kalu', 'u-nneka', 'u-tari', 'external'];

/** SECTION 21: one Major nonconformity, one requirement met at a time. */
const FINDING_BASE = { finding_type: 'Major nonconformity', status: 'Verification' };
const FINDING_ROOT = 'No owner for regulatory change.';
const FINDING_OK_ACTION = { action_type: 'Corrective', status: 'Complete', effectiveness_verified: true, effectiveness_checked_at: '2026-10-12', effectiveness_verified_by: 'u-nneka' };
export const FINDING_LADDER = [
  { label: 'no correction recorded', patch: {}, actions: [] },
  { label: 'a correction, and an action still open', patch: { correction: 'Register updated.' }, actions: [{ action_type: 'Corrective', status: 'Open' }] },
  { label: 'the action complete, no root cause', patch: { correction: 'Register updated.' }, actions: [{ action_type: 'Corrective', status: 'Complete' }] },
  { label: 'a root cause, only a preventive action', patch: { correction: 'Register updated.', root_cause: FINDING_ROOT }, actions: [{ action_type: 'Preventive', status: 'Complete' }] },
  { label: 'a corrective action found not to work', patch: { correction: 'Register updated.', root_cause: FINDING_ROOT }, actions: [{ ...FINDING_OK_ACTION, effectiveness_verified: false }] },
  { label: 'a corrective action complete and unchecked', patch: { correction: 'Register updated.', root_cause: FINDING_ROOT }, actions: [{ action_type: 'Corrective', status: 'Complete' }] },
  { label: 'a corrective action verified effective', patch: { correction: 'Register updated.', root_cause: FINDING_ROOT }, actions: [FINDING_OK_ACTION] },
];

// ---------------------------------------------------------------------------
// THE AS-OF DATE. Built from three numbers at local midnight, never read.
// ---------------------------------------------------------------------------

const isDateObject = (x) => Object.prototype.toString.call(x) === '[object Date]'
  && typeof x.getTime === 'function' && !Number.isNaN(x.getTime());

/**
 * The as-of date a reader hands the engine, or a TypeError. A date string is
 * refused here: the engine's clock-reading exports call getFullYear on today,
 * and a string has none (digest SECTION 2). Refusing in the lab means a panel
 * shows its empty state rather than a half-computed register.
 */
export const requireAsOf = (asOf) => {
  if (!isDateObject(asOf)) {
    throw new TypeError('The as-of date must be a Date built at local midnight. A string or an unreadable date reaches no engine call from this lab.');
  }
  return asOf;
};

/** A local-midnight date from three numbers, the way compliance_fields.mjs builds AS_OF. */
export const localMidnight = (year, month, day) => new Date(year, month - 1, day);

/** A YYYY-MM-DD string at local midnight, or null when it is not a real day. */
export const dateOf = (text) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text || ''));
  if (!m) return null;
  const d = localMidnight(Number(m[1]), Number(m[2]), Number(m[3]));
  return CAL.toDateOnlyString(d) === m[0] ? d : null;
};

/** The as-of date moved by a whole number of days from the wave's own. */
export const asOfAt = (offsetDays = 0) => {
  const n = Number.isFinite(Number(offsetDays)) ? Math.trunc(Number(offsetDays)) : 0;
  return new Date(AS_OF.getFullYear(), AS_OF.getMonth(), AS_OF.getDate() + n);
};

/** A date printed by the engine, or null. */
export const ymd = (d) => (d === null || d === undefined ? null : CAL.toDateOnlyString(d));
/** A value for display: the digest prints a missing value as none. */
export const show = (v) => (v === null || v === undefined || v === '' ? 'none' : String(v));

/** How far a date sits from the wave's own as-of date, measured by the engine. */
export const offsetOf = (asOf) => CAL.daysUntil(requireAsOf(asOf), AS_OF);

const verdictOf = (label, v) => ({ label, ok: Boolean(v && v.ok), reason: v && v.ok === false ? String(v.reason || '') : null });
const byIdMap = (rows) => new Map(rows.map((x) => [x.id, x]));
const OBL = byIdMap(IKORO_OBLIGATIONS);

/** The engine's own vocabularies, read rather than retyped. */
export const vocabulary = () => ({
  statusSeverity: [...C.STATUS_SEVERITY],
  attention: [...C.ATTENTION_STATUSES],
  frequencies: [...C.FREQUENCIES],
  lifecycles: [...C.LIFECYCLES],
  defaultLeadTimeDays: C.DEFAULT_LEAD_TIME_DAYS,
  docStatuses: [...D.DOC_STATUSES],
  inForce: [...D.EFFECTIVE_STATUSES],
  reviewStates: Object.values(D.REVIEW),
  reviewLeadDays: D.REVIEW_LEAD_DAYS,
  defaultReviewPeriodMonths: D.DEFAULT_REVIEW_PERIOD_MONTHS,
  pointTypes: [...Q.POINT_TYPES],
  blockingPointTypes: [...Q.BLOCKING_POINT_TYPES],
  resolvedStatuses: [...Q.CHECKPOINT_RESOLVED_STATUSES],
  checkpointStatuses: [...Q.CHECKPOINT_STATUSES],
  ncrSeverities: [...Q.NCR_SEVERITIES],
  auditStatuses: [...I.AUDIT_STATUSES],
  isoAuditTypes: [...I.AUDIT_TYPES],
  coveringAuditTypes: [...I.COVERING_AUDIT_TYPES],
  coverageCountingStatuses: [...I.COVERAGE_COUNTING_STATUSES],
  certificateLeadDays: I.CERTIFICATE_LEAD_DAYS,
  clauseStatuses: [...I.CLAUSE_STATUSES],
});

// ---------------------------------------------------------------------------
// ASSOCIATE: the calendar (SECTION 2).
// ---------------------------------------------------------------------------

export const calendarAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  return {
    asOf: ymd(today),
    rows: CALENDAR_PROBES.map((s) => ({
      input: s,
      parsed: ymd(CAL.parseDateOnly(s)),
      daysUntil: CAL.daysUntil(s, today),
    })),
    asOfItself: CAL.daysUntil(ymd(today), today),
  };
};

/**
 * What three modules do with an unreadable TODAY. Each call here passes a bad
 * today on purpose, as the digest's contract rows do; none of them is a clock
 * read. Fixed inputs, so this reader takes no as-of date.
 */
export const unreadableTodayContract = () => {
  const bad = new Date(Number.NaN);
  const threw = (fn) => {
    try { fn(); return 'no error'; } catch (e) { return `${e.constructor.name}: ${e.message}`; }
  };
  return {
    deriveStatus: threw(() => C.deriveStatus(IKORO_OBLIGATIONS[1], bad)),
    reviewState: D.reviewState({ status: 'Published', next_review_date: '2020-01-06' }, bad),
    isNcrOverdue: Q.isNcrOverdue({ status: 'Open', due_date: '2020-01-06' }, bad),
    reviewStateWithAString: threw(() => D.reviewState({ status: 'Published', next_review_date: '2026-11-02' }, AS_OF_YMD)),
  };
};

// ---------------------------------------------------------------------------
// ASSOCIATE: the obligation register (SECTIONS 3 and 7).
// ---------------------------------------------------------------------------

const leadShown = (o) => {
  if (o.lead_time_days === undefined) return 'not set';
  if (o.lead_time_days === null) return 'null';
  return o.lead_time_days;
};

const obligationRow = (o, today) => {
  const e = C.explainStatus(o, today);
  const next = ymd(e.nextActionDate);
  return {
    id: o.id,
    code: o.code,
    title: o.title,
    regime: o.regime,
    lifecycle: o.lifecycle,
    frequency: o.frequency,
    due: o.due_date || null,
    expiry: o.expiry_date || null,
    lastFiled: o.last_submitted_date || null,
    leadTime: leadShown(o),
    nextAction: next,
    nextActionIsExpiryDerived: Boolean(next && o.expiry_date && next === ymd(o.expiry_date)),
    daysUntil: e.daysUntil,
    status: e.status,
    reason: e.reason,
    rank: C.STATUS_SEVERITY.indexOf(e.status),
  };
};

export const registerAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const s = C.summarise(IKORO_OBLIGATIONS, today);
  const sorted = [...IKORO_OBLIGATIONS].sort(C.byUrgency(today));
  return {
    asOf: ymd(today),
    rows: IKORO_OBLIGATIONS.map((o) => obligationRow(o, today)),
    total: s.total,
    byStatus: C.STATUS_SEVERITY.map((st) => ({ status: st, count: s.byStatus[st] })),
    attention: s.attention,
    byUrgency: sorted.map((o, i) => ({
      order: i + 1, code: o.code, status: C.deriveStatus(o, today), nextAction: ymd(C.nextActionDate(o)),
    })),
    byRegime: C.countBy(IKORO_OBLIGATIONS, 'regime').map((x) => ({ name: x.name, count: x.count })),
  };
};

/** SECTION 3: REG-2026-005 varied one field at a time. */
export const precedenceAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const base = OBL.get('o05');
  const variants = [
    ['as recorded (expiry passed, due date ahead)', base],
    ['the same with lifecycle Superseded', { ...base, lifecycle: 'Superseded' }],
    ['the same with the expiry removed', { ...base, expiry_date: undefined }],
    ['the same with the expiry moved to 2027-09-30', { ...base, expiry_date: '2027-09-30' }],
    ['the same with the due date moved to 2026-10-01 and no expiry', { ...base, expiry_date: undefined, due_date: '2026-10-01' }],
    ['the same with an unknown lifecycle word, Archived', { ...base, lifecycle: 'Archived' }],
  ];
  return variants.map(([label, o]) => {
    const e = C.explainStatus(o, today);
    return { label, status: e.status, daysUntil: e.daysUntil };
  });
};

/**
 * One obligation read at every as-of date across a window, so a panel can draw
 * where its status changes. Every point is a separate engine call with its own
 * explicit as-of date. The edges are Derived: consecutive days whose statuses
 * the engine returned differently.
 */
export const statusTimeline = (id = 'o01', fromOffset = -30, toOffset = 150) => {
  const o = OBL.get(id);
  if (!o) return null;
  const lo = Math.trunc(Math.min(fromOffset, toOffset));
  const hi = Math.trunc(Math.max(fromOffset, toOffset));
  const points = [];
  for (let n = lo; n <= hi; n += 1) {
    const d = asOfAt(n);
    const e = C.explainStatus(o, d);
    points.push({
      offset: n, date: ymd(d), status: e.status, rank: C.STATUS_SEVERITY.indexOf(e.status),
      daysUntil: e.daysUntil, nextAction: ymd(e.nextActionDate),
    });
  }
  const edgesDerived = points.slice(1)
    .filter((p, i) => p.status !== points[i].status)
    .map((p) => {
      const before = points.find((q) => q.offset === p.offset - 1);
      return { offset: p.offset, date: p.date, from: before.status, to: p.status };
    });
  return { id, code: o.code, title: o.title, points, edgesDerived };
};

// ---------------------------------------------------------------------------
// ASSOCIATE: the lead time (SECTION 4).
// ---------------------------------------------------------------------------

const leadLabel = (lt) => {
  if (lt === null) return 'null';
  if (lt === '') return "'' (empty)";
  if (typeof lt === 'string') return `'${lt}'`;
  return String(lt);
};

export const leadTimeAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const o3 = OBL.get('o03');
  const e = C.explainStatus(o3, today);
  return {
    code: o3.code,
    due: o3.due_date,
    recorded: o3.lead_time_days,
    daysUntil: e.daysUntil,
    rows: IKORO_LEAD_SWEEP.map((lt) => ({ given: leadLabel(lt), status: C.deriveStatus({ ...o3, lead_time_days: lt }, today) }))
      .concat([{ given: 'not set at all', status: C.deriveStatus({ ...o3, lead_time_days: undefined }, today) }]),
    defaultLeadTimeDays: C.DEFAULT_LEAD_TIME_DAYS,
  };
};

/**
 * The flare return with one lead time, and the whole curve of lead times up to
 * a ceiling, so the panel can draw the edge. The edge is Derived: the smallest
 * lead time at which the engine's status differs from its status at lead time
 * zero, or null when no lead time moves it.
 */
export const leadTimeCurve = (lead = 14, asOf = AS_OF, ceiling = 45) => {
  const today = requireAsOf(asOf);
  const o3 = OBL.get('o03');
  const one = C.explainStatus({ ...o3, lead_time_days: lead }, today);
  const curve = [];
  for (let lt = 0; lt <= ceiling; lt += 1) {
    const st = C.deriveStatus({ ...o3, lead_time_days: lt }, today);
    curve.push({ lead: lt, status: st, rank: C.STATUS_SEVERITY.indexOf(st) });
  }
  const first = curve.find((p) => p.status !== curve[0].status);
  return {
    lead, status: one.status, reason: one.reason, daysUntil: one.daysUntil,
    curve, edgeDerived: first ? first.lead : null,
  };
};

// ---------------------------------------------------------------------------
// ASSOCIATE: the current period (SECTION 5).
// ---------------------------------------------------------------------------

export const periodAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const frequencies = C.FREQUENCIES.map((fr) => {
    const p = C.periodStart(PERIOD_DUE, fr);
    return { frequency: fr, periodStart: ymd(p), daysUntil: p ? CAL.daysUntil(p, today) : null };
  });
  const filings = ['o03', 'o04', 'o08', 'o12', 'o02'].map((id) => {
    const o = OBL.get(id);
    const p = C.periodStart(o.due_date, o.frequency);
    const intoPeriod = p && o.last_submitted_date ? CAL.daysUntil(o.last_submitted_date, p) : null;
    return {
      code: o.code,
      frequency: o.frequency,
      due: o.due_date,
      periodStart: ymd(p),
      lastFiled: o.last_submitted_date || null,
      status: C.deriveStatus(o, today),
      reason: C.explainStatus(o, today).reason,
      startDays: p ? CAL.daysUntil(p, today) : null,
      dueDays: CAL.daysUntil(o.due_date, today),
      filedDays: o.last_submitted_date ? CAL.daysUntil(o.last_submitted_date, today) : null,
      filedInsideDerived: intoPeriod === null ? null : intoPeriod >= 0,
    };
  });
  const o4 = { ...OBL.get('o04'), last_submitted_date: '2026-03-31' };
  return {
    periodDue: PERIOD_DUE,
    frequencies,
    filings,
    oneDayLater: { code: o4.code, filed: o4.last_submitted_date, status: C.deriveStatus(o4, today), reason: C.explainStatus(o4, today).reason },
  };
};

// ---------------------------------------------------------------------------
// ASSOCIATE: rolling forward (SECTION 6).
// ---------------------------------------------------------------------------

export const rollAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const byFrequency = C.FREQUENCIES.map((fr) => {
    const n = C.rollForward(ROLL_FROM, fr);
    return { frequency: fr, next: ymd(n), daysUntil: n ? CAL.daysUntil(n, today) : null };
  });
  const monthEnds = ROLL_EXTRA.map(([d, fr]) => ({ due: d, frequency: fr, next: ymd(C.rollForward(d, fr)) }));
  const lf = IKORO_LATE_FILING;
  const fromDue = C.rollForward(lf.due, lf.frequency);
  const fromFiling = C.rollForward(lf.filed, lf.frequency);
  const after = { ...OBL.get('o02'), due_date: ymd(fromDue), last_submitted_date: lf.filed };
  const e = C.explainStatus(after, today);
  return {
    rollFrom: ROLL_FROM,
    byFrequency,
    monthEnds,
    lateFiling: {
      code: OBL.get('o02').code,
      due: lf.due,
      filed: lf.filed,
      frequency: lf.frequency,
      fromDue: ymd(fromDue),
      fromFilingNotUsed: ymd(fromFiling),
      dueDays: CAL.daysUntil(lf.due, today),
      filedDays: CAL.daysUntil(lf.filed, today),
      fromDueDays: CAL.daysUntil(fromDue, today),
      fromFilingDays: CAL.daysUntil(fromFiling, today),
      after: { status: e.status, nextAction: ymd(e.nextActionDate), daysUntil: e.daysUntil, reason: e.reason },
    },
  };
};

// ---------------------------------------------------------------------------
// ASSOCIATE: the document library (SECTIONS 8 and 9).
// ---------------------------------------------------------------------------

export const libraryAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const s = D.summarise(IKORO_DOCUMENTS, today);
  return {
    asOf: ymd(today),
    rows: IKORO_DOCUMENTS.map((d) => ({
      number: d.document_number, title: d.title, status: d.status, nextReview: d.next_review_date || null,
      daysUntil: d.next_review_date ? CAL.daysUntil(d.next_review_date, today) : null,
      reviewState: D.reviewState(d, today),
    })),
    tbc: D.reviewState({ status: 'Published', next_review_date: 'tbc' }, today),
    total: s.total,
    inReview: s.inReview,
    published: s.published,
    overdue: s.overdue,
    dueSoon: s.dueSoon,
    byStatus: D.DOC_STATUSES.map((st) => ({ status: st, count: s.byStatus[st] })),
    byReviewUrgency: [...IKORO_DOCUMENTS].sort(D.byReviewUrgency(today)).map((d, i) => ({
      order: i + 1, number: d.document_number, reviewState: D.reviewState(d, today), nextReview: d.next_review_date || null,
    })),
  };
};

export const reviewDatesAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const rows = IKORO_REVIEW_PERIODS.map(([iss, mo]) => {
    const months = mo === 'DEFAULT' ? D.DEFAULT_REVIEW_PERIOD_MONTHS : mo;
    const n = D.nextReviewDate(iss, months);
    return {
      issue: iss,
      months: mo === 'DEFAULT' ? `${months} (DEFAULT_REVIEW_PERIOD_MONTHS, passed by the caller)` : (mo === null ? 'null' : String(mo)),
      next: ymd(n),
      daysUntil: n ? CAL.daysUntil(n, today) : null,
    };
  });
  const c = IKORO_CORRECTION;
  const fromIssue = D.nextReviewDate(c.issue, c.months);
  const fromCorrection = D.nextReviewDate(c.republished, c.months);
  return {
    rows,
    correction: {
      issue: c.issue, republished: c.republished, months: c.months,
      fromIssue: ymd(fromIssue), fromCorrectionNotUsed: ymd(fromCorrection),
      issueDays: CAL.daysUntil(c.issue, today), republishedDays: CAL.daysUntil(c.republished, today),
      fromIssueDays: CAL.daysUntil(fromIssue, today), fromCorrectionDays: CAL.daysUntil(fromCorrection, today),
    },
  };
};

/** SECTION 8: revisions, prefixes, the confidentiality floor and who may review. */
export const documentRules = () => ({
  revisions: IKORO_REVISIONS.map((rv) => ({ current: rv, next: D.nextRevisionNumber(rv) })),
  prefixes: IKORO_PREFIXES.map(([dep, cat]) => ({ department: dep, category: cat, prefix: D.documentPrefix(dep, cat) })),
  confidentiality: D.CONFIDENTIALITY_LEVELS.map((lv) => ({ level: lv, atLeastConfidential: D.atLeastConfidential(lv) })),
  revision: { ...IKORO_REVISION_UNDER_REVIEW },
  segregation: IKORO_REVIEW_TASKS.map((t) => verdictOf(t.label, t.kind === 'assign'
    ? D.canAssignReviewer(IKORO_REVISION_UNDER_REVIEW, t.reviewer)
    : D.canDecideReviewTask(t.task, IKORO_REVISION_UNDER_REVIEW, t.user))),
});

// ---------------------------------------------------------------------------
// PROFESSIONAL: the inspection and test plan (SECTIONS 10 to 12).
// ---------------------------------------------------------------------------

/** The plan's twelve points as recorded, the state a panel starts from. */
export const initialPoints = () => ABAM_CHECKPOINTS.map((c) => ({ ...c }));

/** Every point as a card, and progress counted from the cards by the engine. */
export const planAt = (points = ABAM_CHECKPOINTS, asOf = AS_OF, planStatus = ABAM_PLAN.status) => {
  const today = requireAsOf(asOf);
  const cps = Array.isArray(points) ? points : [];
  const plan = { ...ABAM_PLAN, status: planStatus };
  const p = Q.planProgress(cps);
  const s = Q.summarise({ plans: [plan], checkpoints: cps, ncrs: ABAM_NCRS, capas: ABAM_CAPAS }, today);
  return {
    plan: { code: plan.plan_code, title: plan.title, status: plan.status },
    cards: cps.map((c) => ({
      id: c.id, item: c.item_no, title: c.title, type: c.point_type, status: c.status,
      stopsWork: Q.isBlockingPoint(c), resolved: Q.isResolved(c), planned: c.planned_date,
      overdue: Q.isCheckpointOverdue(c, today),
    })),
    progress: {
      total: p.total, resolved: p.resolved, failed: p.failed, outstanding: p.outstanding,
      holdPoints: p.holdPoints, holdPointsOutstanding: p.holdPointsOutstanding, percent: p.percent,
    },
    emptyPlanPercent: Q.planProgress([]).percent,
    holds: cps.filter((c) => Q.isBlockingPoint(c)).map((c) => ({ item: c.item_no, status: c.status })),
    overdueItems: cps.filter((c) => Q.isCheckpointOverdue(c, today)).map((c) => c.item_no),
    summary: {
      checkpoints: s.checkpoints, outstanding: s.checkpointsOutstanding, overdue: s.checkpointsOverdue,
      holdPointsOutstanding: s.holdPointsOutstanding, failed: s.checkpointsFailed,
    },
  };
};

/**
 * A decision REQUEST on one point. The engine's gate is asked first, and a
 * refused request hands back the SAME array it was given, so nothing changes.
 */
export const requestDecision = (points, itemId, status, patch = {}) => {
  const cps = Array.isArray(points) ? points : [];
  const cp = cps.find((c) => c.id === itemId);
  if (!cp) return { ok: false, reason: null, points: cps };
  const v = Q.canDecideCheckpoint(cp, status, patch);
  if (!v || !v.ok) return { ok: false, reason: v ? String(v.reason || '') : null, points: cps };
  return { ok: true, reason: null, points: cps.map((c) => (c.id === itemId ? { ...c, ...patch, status } : c)) };
};

/** A removal REQUEST, gated the same way. */
export const requestRemoval = (points, itemId, planStatus = ABAM_PLAN.status) => {
  const cps = Array.isArray(points) ? points : [];
  const cp = cps.find((c) => c.id === itemId);
  if (!cp) return { ok: false, reason: null, points: cps };
  const v = Q.canRemoveCheckpoint(cp, { ...ABAM_PLAN, status: planStatus });
  if (!v || !v.ok) return { ok: false, reason: v ? String(v.reason || '') : null, points: cps };
  return { ok: true, reason: null, points: cps.filter((c) => c.id !== itemId) };
};

/** Whether the plan may close over these points, asked of the engine. */
export const planClosureOf = (points, ncrsClosed = false) => {
  const cps = Array.isArray(points) ? points : [];
  const ncrs = ncrsClosed ? ABAM_NCRS.map((n) => ({ ...n, status: n.status === 'Voided' ? n.status : 'Closed' })) : ABAM_NCRS;
  return verdictOf('close the plan', Q.canClosePlan(ABAM_PLAN, { checkpoints: cps, ncrs }));
};

/** SECTIONS 10 and 11: every canned request asked of the plan as recorded. */
export const planRequestsAsRecorded = () => {
  const cps = byIdMap(ABAM_CHECKPOINTS);
  return {
    decisions: ABAM_DECISIONS.map((d) => verdictOf(d.label, Q.canDecideCheckpoint(cps.get(d.item), d.status, d.patch))),
    removals: ABAM_REMOVALS.map((r0) => verdictOf(r0.label, Q.canRemoveCheckpoint(cps.get(r0.item), { ...ABAM_PLAN, status: r0.plan }))),
  };
};

/** SECTION 11: the closure walk, NCR raising and the plan workflow. */
export const planClosureWalk = () => {
  const fix = (cps, id, patch) => cps.map((c) => (c.id === id ? { ...c, ...patch } : c));
  const steps = [];
  let cps = ABAM_CHECKPOINTS;
  steps.push(verdictOf('as recorded', Q.canClosePlan(ABAM_PLAN, { checkpoints: cps, ncrs: ABAM_NCRS })));
  cps = fix(cps, 'c05', { status: 'Passed' });
  steps.push(verdictOf('H-05 re-inspected and Passed', Q.canClosePlan(ABAM_PLAN, { checkpoints: cps, ncrs: ABAM_NCRS })));
  cps = fix(fix(cps, 'c08', { status: 'Passed' }), 'c11', { status: 'Passed' });
  steps.push(verdictOf('H-08 and H-11 Passed as well', Q.canClosePlan(ABAM_PLAN, { checkpoints: cps, ncrs: ABAM_NCRS })));
  const closedNcrs = ABAM_NCRS.map((n) => ({ ...n, status: n.status === 'Voided' ? n.status : 'Closed' }));
  steps.push(verdictOf('and every NCR against it closed or voided', Q.canClosePlan(ABAM_PLAN, { checkpoints: cps, ncrs: closedNcrs })));
  const pp = Q.planProgress(cps);
  return {
    steps,
    atTheEnd: {
      resolved: pp.resolved, total: pp.total, percent: pp.percent,
      stillOpen: cps.filter((c) => !Q.isResolved(c)).map((c) => c.item_no),
    },
    raise: [
      verdictOf('against the Active plan', Q.canRaiseNcr(ABAM_PLAN)),
      verdictOf('against no plan at all', Q.canRaiseNcr(null)),
      verdictOf('against the plan once Closed', Q.canRaiseNcr({ ...ABAM_PLAN, status: 'Closed' })),
    ],
    workflow: Q.PLAN_STATUSES.map((st) => ({ status: st, next: [...Q.nextPlanStatuses(st)] })),
    draftToClosed: verdictOf('canAdvancePlan from Draft straight to Closed', Q.canAdvancePlan({ ...ABAM_PLAN, status: 'Draft' }, 'Closed', {})),
  };
};

// ---------------------------------------------------------------------------
// PROFESSIONAL: non-conformances (SECTIONS 13 and 14).
// ---------------------------------------------------------------------------

export const ncrsAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const nm = byIdMap(ABAM_NCRS);
  const s = Q.summarise({ plans: [ABAM_PLAN], checkpoints: ABAM_CHECKPOINTS, ncrs: ABAM_NCRS, capas: ABAM_CAPAS }, today);
  const openAges = ABAM_NCRS.filter((n) => Q.isNcrOpen(n)).map((n) => Q.ncrAgeDays(n, today));
  const voided = ABAM_NCRS.find((n) => n.status === 'Voided');
  const onVoided = ABAM_CAPAS.filter((k) => k.ncr_id === voided.id);
  const sNo = Q.summarise({ checkpoints: ABAM_CHECKPOINTS, ncrs: [], capas: ABAM_CAPAS }, today);
  const sClosedPlan = Q.summarise({ plans: [{ ...ABAM_PLAN, status: 'Closed' }], checkpoints: ABAM_CHECKPOINTS, ncrs: [], capas: [] }, today);
  return {
    asOf: ymd(today),
    rows: ABAM_NCRS.map((n) => {
      const age = Q.ncrAgeDays(n, today);
      return {
        code: n.ncr_code, title: n.title, severity: n.severity, status: n.status, raised: n.raised_date,
        due: n.due_date || null, closed: n.closed_date || null, disposition: n.disposition || null,
        open: Q.isNcrOpen(n), overdue: Q.isNcrOverdue(n, today), age, band: Q.ageBand(age),
        closure: verdictOf(n.ncr_code, Q.canCloseNcr(n, ABAM_CAPAS.filter((k) => k.ncr_id === n.id))),
      };
    }),
    capas: ABAM_CAPAS.map((k) => ({
      id: k.id, ncr: nm.get(k.ncr_id).ncr_code, type: k.action_type, status: k.status, due: k.due_date,
      open: Q.isCapaOpen(k), overdue: Q.isCapaOverdue(k, today),
      verified: Q.isEffectivenessVerified(k), ineffective: Q.isEffectivenessFailed(k),
    })),
    ageing: Q.ncrAgeing(ABAM_NCRS, today).map((row) => ({ band: row.name, ...Object.fromEntries(Q.NCR_SEVERITIES.map((sv) => [sv, row[sv]])) })),
    summary: {
      ncrs: s.ncrs, open: s.openNcrs, overdue: s.ncrsOverdue, seriousOpen: s.seriousOpen, concessions: s.concessions,
      oldestOpen: s.oldestOpenNcrDays, meanOpen: s.meanOpenNcrAgeDays,
      capas: s.capas, openCapas: s.openCapas, overdueCapas: s.overdueCapas,
      awaitingEffectiveness: s.capasAwaitingEffectiveness, verifiedEffective: s.capasVerifiedEffective, foundIneffective: s.capasFoundIneffective,
    },
    openAges,
    onVoided: {
      ids: onVoided.map((k) => k.id), ncr: voided.ncr_code,
      open: onVoided.map((k) => Q.isCapaOpen(k)), overdue: onVoided.map((k) => Q.isCapaOverdue(k, today)),
    },
    withNoNcrs: { openCapas: sNo.openCapas, overdueCapas: sNo.overdueCapas },
    underAClosedPlan: { outstanding: sClosedPlan.checkpointsOutstanding, overdue: sClosedPlan.checkpointsOverdue, failed: sClosedPlan.checkpointsFailed },
    byUrgency: [...ABAM_NCRS].sort(Q.ncrByUrgency(today)).map((n, i) => ({
      order: i + 1, code: n.ncr_code, severity: n.severity, status: n.status, overdue: Q.isNcrOverdue(n, today),
    })),
  };
};

export const ageBandEdges = () => AGE_BAND_EDGES.map((d) => ({ days: d, band: Q.ageBand(d) }));

/** SECTION 13: canCloseNcr walked one requirement at a time. */
export const ncrClosureWalk = () => ({
  major: NCR_LADDER.map((step) => verdictOf(step.label, Q.canCloseNcr({ ...NCR_LADDER_BASE, ...step.patch }, step.capas))),
  minor: MINOR_NCR_LADDER.map((step) => verdictOf(step.label, Q.canCloseNcr(MINOR_NCR, step.capas))),
});

// ---------------------------------------------------------------------------
// PROFESSIONAL: the checklist, the audit and the programme (SECTIONS 15 to 17).
// ---------------------------------------------------------------------------

export const checklistAt = () => {
  const rs = new Map(ABAM_RESPONSES.map((x) => [x.item_id, x]));
  const p = A.checklistProgress(ABAM_ITEMS, ABAM_RESPONSES);
  return {
    audit: { code: ABAM_AUDIT.audit_code, title: ABAM_AUDIT.title, status: ABAM_AUDIT.status, questions: ABAM_ITEMS.length },
    rows: ABAM_ITEMS.map((it) => {
      const x = rs.get(it.id) || {};
      let note = 'none';
      if (x.note !== undefined) note = x.note.trim() === '' ? 'blank' : x.note;
      return { item: it.item_no, question: it.question, criticality: it.criticality, result: x.result || 'no answer', note, answered: A.isAnswered(x) };
    }),
    progress: {
      total: p.total, answered: p.answered, outstanding: p.outstanding, conformant: p.conformant,
      nonconformant: p.nonconformant, observations: p.observations, notApplicable: p.notApplicable, percent: p.percent,
    },
    emptyPercent: A.checklistProgress([], []).percent,
    unanswered: A.unansweredItems(ABAM_ITEMS, ABAM_RESPONSES).map((i) => i.item_no),
    criticalWithoutFinding: A.criticalAnswersWithoutFindings(ABAM_ITEMS, ABAM_RESPONSES, ABAM_FINDINGS).map((i) => i.item_no),
    criticalWithoutFindingIfVoided: A.criticalAnswersWithoutFindings(ABAM_ITEMS, ABAM_RESPONSES, [{ ...ABAM_FINDINGS[0], status: 'Voided' }]).map((i) => i.item_no),
    findingCode: ABAM_FINDINGS[0].finding_code,
    raise: RAISE_ATTEMPTS.map((a) => verdictOf(a.label, A.canRaiseFinding(a.finding))),
  };
};

export const auditWalk = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const au = ABAM_AUDIT;
  const items = ABAM_ITEMS;
  const answered = [
    ...ABAM_RESPONSES.map((x) => (REPORT_NOTES[x.item_id] ? { ...x, note: REPORT_NOTES[x.item_id] } : x)),
    ...REPORT_EXTRA_ANSWERS,
  ];
  const findings = [...ABAM_FINDINGS, REPORT_SECOND_FINDING];
  const withConclusion = { ...au, conclusion: REPORT_CONCLUSION };
  const reported = { ...withConclusion, status: 'Reported' };
  return {
    workflow: A.AUDIT_STATUSES.map((st) => ({ status: st, next: [...A.nextAuditStatuses(st)] })),
    report: [
      verdictOf('as recorded', A.canReportAudit(au, { items, responses: ABAM_RESPONSES, findings: ABAM_FINDINGS })),
      verdictOf('every item answered, and the two blank Not applicable answers given reasons', A.canReportAudit(au, { items, responses: answered, findings: ABAM_FINDINGS })),
      verdictOf('a finding raised from item 6 as well', A.canReportAudit(au, { items, responses: answered, findings })),
      verdictOf('and the conclusion written', A.canReportAudit(withConclusion, { items, responses: answered, findings })),
      verdictOf('the same audit with no lead auditor named at all', A.canReportAudit({ ...withConclusion, lead_auditor_id: null }, { items, responses: answered, findings })),
    ],
    close: [
      verdictOf('before it is reported', A.canCloseAudit(withConclusion, findings)),
      verdictOf('reported, with both major findings open', A.canCloseAudit(reported, findings)),
      verdictOf('reported, with both closed', A.canCloseAudit(reported, findings.map((f) => ({ ...f, status: 'Closed' })))),
      verdictOf('reported, with a stop-work minor finding still open', A.canCloseAudit(reported, [{ ...ABAM_FINDINGS[0], finding_type: 'Minor nonconformity', status: 'Open' }])),
    ],
    cancel: [
      verdictOf('no reason given', A.canCancelAudit(au, {})),
      verdictOf('a reason of spaces', A.canCancelAudit(au, { cancellation_reason: '   ' })),
      verdictOf('a reason given', A.canCancelAudit(au, { cancellation_reason: 'Contractor demobilised.' })),
    ],
    independence: [
      verdictOf(`${au.lead_auditor_id} leads, ${au.auditee_id} is audited`, A.auditIndependence(au)),
      verdictOf(`${au.auditee_id} named as both`, A.auditIndependence({ ...au, lead_auditor_id: au.auditee_id })),
      verdictOf('an external lead auditor named in text, with no account', A.auditIndependence({ ...au, lead_auditor_id: null, lead_auditor_name: 'Third party auditor' })),
    ],
    overdueByStatus: A.AUDIT_STATUSES.map((st) => ({ status: st, overdue: A.isAuditOverdue({ status: st, planned_end: PLANNED_END_PROBE }, today) })),
  };
};

export const programmeAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const aud = ABAM_PROGRAMME_AUDITS;
  const p = A.programmeProgress(aud, today);
  const done = aud.map((a) => (['Closed', 'Reported', 'Cancelled'].includes(a.status) ? a : { ...a, status: 'Reported' }));
  const noReason = done.map((a) => (a.id === 'g8' ? { ...a, status: 'Cancelled', cancellation_reason: undefined } : a));
  const s = A.summarise({ programmes: [ABAM_PROGRAMME], audits: aud, responses: ABAM_RESPONSES, findings: ABAM_FINDINGS, actions: [] }, today);
  return {
    asOf: ymd(today),
    rows: aud.map((a) => ({ code: a.audit_code, status: a.status, plannedEnd: a.planned_end, overdue: A.isAuditOverdue(a, today) })),
    progress: { total: p.total, reported: p.reported, cancelled: p.cancelled, outstanding: p.outstanding, overdue: p.overdue, percent: p.percent },
    emptyPercent: A.programmeProgress([], today).percent,
    complete: [
      verdictOf('as recorded', A.canCompleteProgramme(ABAM_PROGRAMME, aud)),
      verdictOf('every outstanding audit reported', A.canCompleteProgramme(ABAM_PROGRAMME, done)),
      verdictOf('the last one cancelled instead, with no reason written', A.canCompleteProgramme(ABAM_PROGRAMME, noReason)),
    ],
    workflow: A.PROGRAMME_STATUSES.map((st) => ({ status: st, next: [...A.nextProgrammeStatuses(st)] })),
    approve: [
      verdictOf('approving with no date recorded', A.canApproveProgramme({ status: 'Draft' }, {})),
      verdictOf('approving with a date and no approver', A.canApproveProgramme({ status: 'Draft' }, { approved_at: '2026-01-20' })),
      verdictOf('approving with both', A.canApproveProgramme({ status: 'Draft' }, { approved_at: '2026-01-20', approver_name: 'Asset manager' })),
    ],
    summary: {
      audits: aud.length, responses: ABAM_RESPONSES.length,
      auditsOutstanding: s.auditsOutstanding, auditsOverdue: s.auditsOverdue, auditsReported: s.auditsReported,
      auditsCancelled: s.auditsCancelled, answers: s.answers, answersOutstanding: s.answersOutstanding,
      nonconformances: s.nonconformances, notApplicable: s.notApplicable, openFindings: s.openFindings,
      openMajor: s.openMajor, stopWorkOpen: s.stopWorkOpen,
    },
  };
};

// ---------------------------------------------------------------------------
// EXPERT: the clause register, independence, coverage, findings, readiness
// (SECTIONS 18 to 22).
// ---------------------------------------------------------------------------

const CLAUSE = byIdMap(ORASHI_CLAUSES);
const standardFor = (which) => {
  if (which === 'register') return ORASHI_STANDARD;
  if (which === 'second') return ORASHI_SECOND_STANDARD;
  return which;
};

export const clauseRegisterAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const std = ORASHI_STANDARD;
  return {
    standard: { code: std.code, certification: std.certification_status, cycleYears: std.cycle_years, expires: std.certificate_expires },
    rows: ORASHI_CLAUSES.map((c) => ({
      clause: c.clause_ref, title: c.title, applicability: c.applicability, status: c.status, owner: c.owner_id,
      claims: I.claimsConformity(c), evidence: I.hasEvidenceRecord(c), assessed: I.isAssessed(c),
      nextReview: c.next_review_due || null, reviewOverdue: I.isReviewOverdue(c, today), reviewDueSoon: I.isReviewDueSoon(c, today),
    })),
  };
};

/**
 * SECTION 18. Every try passes the register's own standard record as the
 * fourth argument to canSetClauseStatus, so a refusal names ISO 14001:2015.
 */
export const clauseStatusTries = () => {
  const k72 = CLAUSE.get('k72');
  return {
    tries: CLAUSE_STATUS_TRIES.map((t) => verdictOf(t.label, I.canSetClauseStatus(k72, t.status, t.patch, ORASHI_STANDARD))),
    byStandard: REFUSAL_STANDARDS.map((s0) => verdictOf(s0.label, I.canSetClauseStatus(k72, 'Not applicable', { applicability: 'Not applicable' }, standardFor(s0.standard)))),
  };
};

/** One try on clause 7.2 with a status the learner picks, the standard passed as the fourth argument. */
export const setClauseStatus = (status, patch = {}) => verdictOf(
  status, I.canSetClauseStatus(CLAUSE.get('k72'), status, patch, ORASHI_STANDARD),
);

/** SECTION 19: the lead auditor picker over the scope, and the examiner check. */
export const independenceOf = (lead = 'u-chidi') => {
  const inScope = ORASHI_CLAUSES.filter((c) => SCOPE_CLAUSE_IDS.includes(c.id));
  const audit = { id: 'ia-2027', audit_type: 'Internal', status: 'Planned' };
  const who = lead === 'external' ? { lead_auditor_name: 'Certification body auditor' } : { lead_auditor_id: lead };
  const v = I.auditIndependence({ ...audit, ...who }, inScope);
  return {
    lead,
    scope: inScope.map((c) => ({ clause: c.clause_ref, owner: c.owner_id })),
    ok: Boolean(v && v.ok),
    reason: v && v.ok === false ? String(v.reason || '') : null,
    clausesNamed: v && Array.isArray(v.clauses) ? [...v.clauses] : [],
  };
};

export const examineChecks = () => {
  const k81 = CLAUSE.get('k81');
  return [
    verdictOf(`${k81.owner_id} recording 8.1, which ${k81.owner_id} owns`, I.canExamineClause(k81, k81.owner_id)),
    verdictOf('u-chidi recording 8.1', I.canExamineClause(k81, 'u-chidi')),
  ];
};

const auditsWith = (overrides = {}) => ORASHI_AUDITS.map((a) => ({ ...a, ...(overrides[a.id] || {}) }));

/**
 * SECTION 20. Coverage over the certification cycle, with any audit's type or
 * status overridden by the learner. Whether an audit counts is read off the
 * engine's own two lists; which clauses are covered is clauseCoverage's.
 */
export const coverageAt = ({ cycleYears = ORASHI_STANDARD.cycle_years, overrides = {} } = {}, asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const audits = auditsWith(overrides);
  const cov = I.clauseCoverage({ clauses: ORASHI_CLAUSES, auditClauses: ORASHI_AUDIT_CLAUSES, audits, cycleYears }, today);
  const byCycle = [1, 2, 3, 4].map((cy) => {
    const c2 = I.clauseCoverage({ clauses: ORASHI_CLAUSES, auditClauses: ORASHI_AUDIT_CLAUSES, audits, cycleYears: cy }, today);
    return { cycleYears: cy, covered: c2.filter((x) => x.covered).length, stale: c2.filter((x) => x.stale).length, never: c2.filter((x) => !x.lastExaminedOn).length };
  });
  const both = I.clauseCoverageByStandard({
    standards: [ORASHI_STANDARD, ORASHI_SECOND_STANDARD],
    clauses: [CLAUSE.get('k81'), ...ORASHI_SECOND_CLAUSES],
    auditClauses: [...ORASHI_AUDIT_CLAUSES, ...ORASHI_SECOND_AUDIT_CLAUSES],
    audits: [...ORASHI_AUDITS, ...ORASHI_SECOND_AUDITS],
  }, today);
  return {
    cycleYears,
    audits: audits.map((a) => ({
      id: a.id, code: a.audit_code, type: a.audit_type, status: a.status, ended: a.actual_end || null,
      counts: I.COVERING_AUDIT_TYPES.includes(a.audit_type) && I.COVERAGE_COUNTING_STATUSES.includes(a.status),
    })),
    applicable: ORASHI_CLAUSES.filter((c) => I.isApplicable(c)).length,
    rows: cov.map((x) => ({
      clause: x.clause_ref, lastExamined: x.lastExaminedOn || null,
      daysUntil: x.lastExaminedOn ? CAL.daysUntil(x.lastExaminedOn, today) : null,
      byAudit: x.lastAudit ? x.lastAudit.audit_code : null, result: x.lastResult || null,
      covered: x.covered, stale: x.stale,
    })),
    byCycle,
    byStandard: both.map((x) => ({
      standard: x.clause.standard_id === ORASHI_STANDARD.id ? ORASHI_STANDARD.code : ORASHI_SECOND_STANDARD.code,
      clause: x.clause_ref, lastExamined: x.lastExaminedOn || null, covered: x.covered, stale: x.stale,
    })),
  };
};

/** SECTION 21: the findings, their actions, the closure walk, the ISO audit gates. */
export const findingsAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const fm = byIdMap(ORASHI_FINDINGS);
  const a26 = ORASHI_AUDITS.find((a) => a.id === 'ia-2026b');
  const scope = [{ clause_ref: '5.2', result: 'Conformant' }, { clause_ref: '7.2', result: 'Not examined' }, { clause_ref: '8.1', result: 'Not examined' }];
  const same = I.AUDIT_STATUSES.every((st) => JSON.stringify(I.AUDIT_TRANSITIONS[st]) === JSON.stringify(A.AUDIT_TRANSITIONS[st]));
  return {
    asOf: ymd(today),
    rows: ORASHI_FINDINGS.map((f) => ({
      code: f.finding_code, type: f.finding_type, status: f.status, raised: f.raised_date, due: f.due_date || null,
      closed: f.closed_date || null, open: I.isFindingOpen(f), overdue: I.isFindingOverdue(f, today), age: I.findingAgeDays(f, today),
      closure: verdictOf(`${f.finding_code} (${f.finding_type}, ${f.status})`, I.canCloseFinding(f, ORASHI_ACTIONS.filter((x) => x.finding_id === f.id))),
    })),
    actions: ORASHI_ACTIONS.map((x) => ({
      id: x.id, finding: fm.get(x.finding_id).finding_code, type: x.action_type, status: x.status, due: x.due_date,
      open: I.isActionOpen(x), overdue: I.isActionOverdue(x, today), verified: I.isEffectivenessVerified(x),
    })),
    ladder: FINDING_LADDER.map((s0) => verdictOf(s0.label, I.canCloseFinding({ ...FINDING_BASE, ...s0.patch }, s0.actions))),
    minorAndObservation: [
      verdictOf('a Minor nonconformity with its correction and no actions', I.canCloseFinding({ finding_type: 'Minor nonconformity', status: 'Open', correction: 'Briefing held.' }, [])),
      verdictOf('an Observation with nothing recorded', I.canCloseFinding({ finding_type: 'Observation', status: 'Open' }, [])),
    ],
    byUrgency: [...ORASHI_FINDINGS].sort(I.findingByUrgency(today)).map((f, i) => ({
      order: i + 1, code: f.finding_code, type: f.finding_type, status: f.status, overdue: I.isFindingOverdue(f, today),
    })),
    transitionsAgree: same,
    overdueByStatus: I.AUDIT_STATUSES.map((st) => ({ status: st, overdue: I.isAuditOverdue({ status: st, planned_end: PLANNED_END_PROBE }, today) })),
    report: [
      verdictOf(`canReportAudit on ${a26.audit_code} with three clauses in scope, two not yet examined`, I.canReportAudit({ ...a26, status: 'Fieldwork complete' }, scope)),
      verdictOf('with no clauses in scope', I.canReportAudit({ ...a26, status: 'Fieldwork complete' }, [])),
    ],
  };
};

/**
 * One finding's age at the as-of date, which stops at its closed date. For the
 * closure walk the panel moves the as-of date and reads this.
 */
export const findingAgeOf = (code, asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const f = ORASHI_FINDINGS.find((x) => x.finding_code === code);
  if (!f) return null;
  return { code, status: f.status, raised: f.raised_date, closed: f.closed_date || null, age: I.findingAgeDays(f, today), open: I.isFindingOpen(f) };
};

const readinessData = (overrides = {}) => ({
  clauses: ORASHI_CLAUSES, findings: ORASHI_FINDINGS, actions: ORASHI_ACTIONS, audits: auditsWith(overrides), auditClauses: ORASHI_AUDIT_CLAUSES,
});

/**
 * SECTION 22. Readiness as the engine returns it: a list of blockers with a
 * severity and a count each, never a score. The certificate expiry is a control.
 */
export const readinessAt = ({ certificateExpires = ORASHI_STANDARD.certificate_expires, overrides = {} } = {}, asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const r0 = I.certificationReadiness({ ...ORASHI_STANDARD, certificate_expires: certificateExpires }, readinessData(overrides), today);
  const certItem = r0.blockers.find((b) => /certificate/.test(b.text));
  return {
    standard: ORASHI_STANDARD.code,
    certificateExpires,
    ready: r0.ready,
    blockers: r0.blockers.map((b) => ({ severity: b.severity, count: b.count, text: b.text })),
    counts: Object.entries(r0.counts).map(([k, v]) => ({ key: k, value: v })),
    certificateDays: r0.counts.certificateDays,
    certificateExpiring: r0.counts.certificateExpiring,
    certificateExpired: r0.counts.certificateExpired,
    certificateItem: certItem ? { severity: certItem.severity, text: certItem.text } : null,
  };
};

export const certificateSweep = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  return ORASHI_CERT_SWEEP.map((ce) => {
    const rr = readinessAt({ certificateExpires: ce }, today);
    return {
      expires: ce, days: rr.certificateDays, expiring: rr.certificateExpiring, expired: rr.certificateExpired, item: rr.certificateItem,
    };
  });
};

export const emptyStandardReadiness = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const e = I.certificationReadiness({ id: 's-empty' }, { clauses: [] }, today);
  return { ready: e.ready, blockers: e.blockers.map((b) => ({ severity: b.severity, count: b.count, text: b.text })) };
};

export const isoSummaryAt = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const s = I.summarise({ standards: [ORASHI_STANDARD], clauses: ORASHI_CLAUSES, audits: ORASHI_AUDITS, findings: ORASHI_FINDINGS, actions: ORASHI_ACTIONS, auditClauses: ORASHI_AUDIT_CLAUSES }, today);
  return {
    clauses: s.clauses, applicable: s.applicable, excluded: s.excluded, evidencedClaims: s.evidencedClaims,
    unevidencedClaims: s.unevidencedClaims, notAssessed: s.notAssessed, reviewsOverdue: s.reviewsOverdue,
    reviewsDueSoon: s.reviewsDueSoon, audits: s.audits, auditsOpen: s.auditsOpen, auditsOverdue: s.auditsOverdue,
    clausesCovered: s.clausesCovered, neverAudited: s.clausesNeverAudited, stale: s.clausesStale,
    openFindings: s.openFindings, openMajor: s.openMajor, findingsOverdue: s.findingsOverdue,
    openActions: s.openActions, overdueActions: s.overdueActions, awaitingEffectiveness: s.actionsAwaitingEffectiveness,
  };
};

// ---------------------------------------------------------------------------
// The whole teaching surface, for the clock gate and the time zone gate. Every
// reader that takes an as-of date is named with it; the others take none.
// ---------------------------------------------------------------------------

export const DATED_READERS = [
  'calendarAt', 'registerAt', 'precedenceAt', 'leadTimeAt', 'periodAt', 'rollAt', 'libraryAt', 'reviewDatesAt',
  'ncrsAt', 'auditWalk', 'programmeAt', 'clauseRegisterAt', 'findingsAt', 'certificateSweep',
  'emptyStandardReadiness', 'isoSummaryAt',
];
export const UNDATED_READERS = [
  'vocabulary', 'unreadableTodayContract', 'documentRules', 'planRequestsAsRecorded', 'planClosureWalk',
  'ageBandEdges', 'ncrClosureWalk', 'checklistAt', 'clauseStatusTries', 'examineChecks',
];

/** Every reader's return at one as-of date, plus the controls panels move. */
export const teachingSurface = (asOf = AS_OF) => {
  const today = requireAsOf(asOf);
  const surface = {};
  DATED_READERS.forEach((name) => { surface[name] = READER_FNS[name](today); });
  UNDATED_READERS.forEach((name) => { surface[name] = READER_FNS[name](); });
  surface.planAt = planAt(ABAM_CHECKPOINTS, today);
  surface.leadTimeCurve = leadTimeCurve(14, today);
  surface.coverageAt = coverageAt({}, today);
  surface.readinessAt = readinessAt({}, today);
  surface.independence = LEAD_AUDITOR_CHOICES.map((x) => independenceOf(x));
  surface.statusTimeline = ['o01', 'o02', 'o03'].map((id) => statusTimeline(id));
  return surface;
};

const READER_FNS = {
  calendarAt, registerAt, precedenceAt, leadTimeAt, periodAt, rollAt, libraryAt, reviewDatesAt,
  ncrsAt, auditWalk, programmeAt, clauseRegisterAt, findingsAt, certificateSweep, emptyStandardReadiness, isoSummaryAt,
  vocabulary, unreadableTodayContract, documentRules, planRequestsAsRecorded, planClosureWalk,
  ageBandEdges, ncrClosureWalk, checklistAt, clauseStatusTries, examineChecks,
};
