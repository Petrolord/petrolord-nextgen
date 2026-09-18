// THE COMPLIANCE TEACHING CASES. Every record the digest is built on, in one
// place, so a sweep, a claim gate and a lesson all read the same case.
//
// THREE TEACHING CASES, AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs three other records, written in compliance_fields_capstone.mjs, and
// nothing in this file or in compliance_dump.mjs imports, reads, names or
// reproduces any of it. gate_capstone_leak.py sweeps both directions on every
// rebuild.
//
//   IKORO     a coastal crude terminal run by an invented operator, Kalabari
//             Coastal Petroleum Ltd: its regulatory obligation register
//             (Regulatory Compliance) and its controlled document library
//             (Document Control). The Associate tier's case.
//   ABAM      the Abam flowline tie-in project of the same kind of operator:
//             its quality plan with an inspection and test plan, its
//             non-conformance reports and corrective actions (Quality
//             Assurance Plan & NCR), and a contractor HSE audit with its 2026
//             audit programme (Audit & Findings Manager). The Professional
//             tier's case.
//   ORASHI    the Orashi gas plant's ISO 14001:2015 environmental management
//             system: its clause register, internal audits and a certification
//             body's surveillance audit, findings and actions (ISO Compliance).
//             The Expert tier's case.
//
// Every record is INVENTED. Regulators are named by kind (federal environmental
// regulator, upstream regulator, state ministry) rather than by agency, because
// the course teaches what the engine does with a date, and no real agency's
// rule is being asserted.
//
// ONE AS-OF DATE FOR THE WHOLE WAVE. Every engine call the digest makes passes
// AS_OF explicitly, and the dump's clock gate refuses any call that does not.
// It is built at LOCAL midnight, which is what calendar.js means by today, so
// every whole-day count is the same in every time zone.

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
