// THE COMPLIANCE CAPSTONE CONDITIONS. Three records, one a tier, none of them a
// teaching case:
//
//   EKPE      the Ekpe gas plant of an invented operator, Obolo Midstream Ltd:
//             six regulatory obligations and two controlled documents
//             (Associate).
//   UTAPATE   the Utapate manifold replacement: its quality plan with a
//             twenty-one-point inspection and test plan, six NCRs, a contractor
//             HSE audit checklist and the 2026 audit programme (Professional).
//   OBEAKPU   the Obeakpu terminal's ISO 45001:2018 occupational health and
//             safety management system: forty clauses, six audits, findings and
//             the certificate, ahead of a surveillance audit (Expert).
//
// Nothing here is imported by compliance_dump.mjs, and nothing in
// compliance_fields.mjs is imported here. gate_capstone_leak.py sweeps both
// directions on every rebuild.
//
// EVERY GRADED FIELD IS AN INTEGER THE ENGINE RETURNS, graded at 0.5, which
// admits exactly one integer. The academy grader (public.academy_submit_capstone)
// compares a numeric answer to a numeric expected value within a numeric
// tolerance and nothing else, so a status word or a date cannot be a graded
// field in this programme. A date the engine returns is graded as the whole
// number of days daysUntil puts between it and the as-of date, which is an
// engine return too. And no graded value may be within its tolerance of any
// number the teaching digest prints, dates included, which is why the
// conditions below were moved until none was (gate_collisions.py).
//
// The five recon findings R1 to R5 were repaired upstream in ASC-0 (engines PR
// #212, 9d5d3b4). None of them was on a graded path before the repair, and no
// graded value moved when the engine was re-vendored: every UTAPATE NCR carries
// a raised_date, so the created_at local-date fallback in ncrAgeDays is never
// read, and no graded percent sat on an exact half. programmeProgress.outstanding
// and summarise().auditsOutstanding now agree and the oracle checks both, but
// they are not graded: UTAPATE's count is 3, which the digest prints, and a
// count that small cannot clear the collision rule.
// Every call gets AS_OF.

export const AS_OF_YMD = '2026-10-15';
export const AS_OF = new Date(2026, 9, 15);

/* ------------------------------------------------------------------ *
 * EKPE (Associate)
 * ------------------------------------------------------------------ */
export const EKPE_OBLIGATIONS = [
  { id: 'e1', code: 'REG-2026-041', title: 'Gas plant air emissions permit', frequency: 'Annual', obligation_type: 'Permit',
    regime: 'Environmental', due_date: '2027-02-28', expiry_date: '2026-12-19', lead_time_days: 60, lifecycle: 'Active' },
  { id: 'e2', code: 'REG-2026-042', title: 'Semi-annual host community report', frequency: 'Semi-annual', obligation_type: 'Periodic report',
    regime: 'Reporting', due_date: '2026-10-31', lifecycle: 'Active' },
  { id: 'e3', code: 'REG-2026-043', title: 'Semi-annual waste consignment return', frequency: 'Semi-annual', obligation_type: 'Periodic report',
    regime: 'Environmental', due_date: '2026-12-31', last_submitted_date: '2026-06-24', lifecycle: 'Active' },
  { id: 'e4', code: 'REG-2026-044', title: 'Quarterly water abstraction return', frequency: 'Quarterly', obligation_type: 'Periodic report',
    regime: 'Environmental', due_date: '2026-09-20', expiry_date: '2026-12-28', lifecycle: 'Active' },
];
/** Filings the capstone asks the learner to record. */
export const EKPE_FILINGS = {
  e2: '2026-10-06',
  e4: '2026-10-09',
};
export const EKPE_DOCUMENTS = [
  { id: 'ed1', document_number: 'OPS-PRO-0031', title: 'Slug catcher operating procedure', status: 'Published',
    issue_date: '2025-01-31', review_period_months: 30, corrected_on: '2026-06-12', revision: '04' },
  { id: 'ed2', document_number: 'HSE-PLA-0009', title: 'Plant emergency response plan', status: 'Published',
    issue_date: '2024-05-31', review_period_months: 16, revision: '11' },
];

/* ------------------------------------------------------------------ *
 * UTAPATE (Professional)
 * ------------------------------------------------------------------ */
export const UTAPATE_PLAN = { id: 'p-uta', plan_code: 'QAP-2026-022', title: 'Utapate manifold replacement', status: 'Active' };
const ok = { result_date: '2026-09-18', verified_by: 'u-amaka' };
const pt = (n, type, status, extra = {}) => ({ id: `u${String(n).padStart(2, '0')}`, plan_id: 'p-uta',
  item_no: `${type[0]}-${String(n).padStart(2, '0')}`, point_type: type, status, ...extra });
export const UTAPATE_CHECKPOINTS = [
  pt(1, 'Hold point', 'Passed', ok), pt(2, 'Witness point', 'Passed', ok), pt(3, 'Hold point', 'Passed', ok),
  pt(4, 'Review point', 'Passed', ok), pt(5, 'Witness point', 'Passed', ok), pt(6, 'Hold point', 'Passed', ok),
  pt(7, 'Monitor point', 'Passed', ok), pt(8, 'Witness point', 'Passed', ok), pt(9, 'Review point', 'Passed', ok),
  pt(10, 'Witness point', 'Waived', { ...ok, remarks: 'Client inspector stood down; vendor record accepted.' }),
  pt(11, 'Monitor point', 'Not applicable'),
  pt(12, 'Hold point', 'Not applicable', { ...ok, remarks: 'Spool supplied pre-tested by the manufacturer.' }),
  pt(13, 'Hold point', 'Failed', ok),
  pt(14, 'Hold point', 'Pending'), pt(15, 'Hold point', 'Pending'),
  pt(16, 'Witness point', 'Pending'), pt(17, 'Witness point', 'Pending'),
  pt(18, 'Surveillance point', 'Notified'), pt(19, 'Monitor point', 'In progress'),
  pt(20, 'Witness point', 'Passed', ok), pt(21, 'Review point', 'Passed', ok),
];
/** The six requests put to the engine in the order the site sends them. */
export const UTAPATE_REQUESTS = [
  { kind: 'remove', item: 'u15' },
  { kind: 'remove', item: 'u16' },
  { kind: 'decide', item: 'u17', status: 'Waived', patch: { result_date: '2026-10-14', verified_by: 'u-amaka' } },
  { kind: 'decide', item: 'u14', status: 'Not applicable', patch: { result_date: '2026-10-14', verifier_name: 'Certifying authority surveyor', remarks: 'Line isolated and blinded; test moved to the next campaign.' } },
  { kind: 'decide', item: 'u19', status: 'Not applicable', patch: {} },
  { kind: 'decide', item: 'u18', status: 'Passed', patch: { result_date: '2026-10-14' } },
];
export const UTAPATE_NCRS = [
  { id: 'un1', ncr_code: 'NCR-2026-044', plan_id: 'p-uta', severity: 'Major', status: 'Actions in progress', raised_date: '2026-05-06', due_date: '2026-07-06' },
  { id: 'un2', ncr_code: 'NCR-2026-051', plan_id: 'p-uta', severity: 'Minor', status: 'Open', raised_date: '2026-07-19', due_date: '2026-10-27' },
  { id: 'un3', ncr_code: 'NCR-2026-063', plan_id: 'p-uta', severity: 'Critical', status: 'Under investigation', raised_date: '2026-09-22', due_date: '2026-10-22' },
  { id: 'un4', ncr_code: 'NCR-2026-060', plan_id: 'p-uta', severity: 'Minor', status: 'Disposition agreed', raised_date: '2026-09-04', due_date: '2026-11-04' },
  { id: 'un5', ncr_code: 'NCR-2026-035', plan_id: 'p-uta', severity: 'Observation', status: 'Closed', raised_date: '2026-02-11', closed_date: '2026-03-30' },
  { id: 'un6', ncr_code: 'NCR-2026-029', plan_id: 'p-uta', severity: 'Major', status: 'Voided', raised_date: '2026-01-05', closed_date: '2026-01-09' },
];
const q = (n, crit) => ({ id: `q${String(n).padStart(2, '0')}`, item_no: `${n}`, criticality: crit });
export const UTAPATE_ITEMS = Array.from({ length: 27 }, (_, i) => q(i + 1, ['Critical', 'Major', 'Minor'][i % 3]));
const ans = (n, result, note) => ({ id: `qa${String(n).padStart(2, '0')}`, item_id: `q${String(n).padStart(2, '0')}`, result, ...(note === undefined ? {} : { note }) });
export const UTAPATE_RESPONSES = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => ans(n, 'Conformant')),
  ans(14, 'Nonconformant', 'Lifting register out of date.'), ans(15, 'Nonconformant', 'No fire watch at the tie-in.'),
  ans(16, 'Nonconformant', 'Two expired gas detector calibrations.'),
  ans(17, 'Observation', 'Toolbox talk signed after the task started.'), ans(18, 'Observation', 'Waste bins unlabelled.'),
  ans(19, 'Not applicable', 'No diving on this scope.'), ans(20, 'Not applicable', 'No radiography this week.'),
  ans(21, 'Not applicable', ''), ans(22, 'Not applicable', '  '),
];
export const UTAPATE_AUDITS = [
  { id: 'ua1', audit_code: 'AUD-2026-101', status: 'Closed' }, { id: 'ua2', audit_code: 'AUD-2026-102', status: 'Reported' },
  { id: 'ua3', audit_code: 'AUD-2026-103', status: 'Reported' }, { id: 'ua4', audit_code: 'AUD-2026-104', status: 'Cancelled', cancellation_reason: 'Contractor demobilised before the audit window.' },
  { id: 'ua5', audit_code: 'AUD-2026-105', status: 'Closed' }, { id: 'ua6', audit_code: 'AUD-2026-106', status: 'Reported' },
  { id: 'ua7', audit_code: 'AUD-2026-107', status: 'Cancelled', cancellation_reason: 'Scope merged into AUD-2026-108.' },
  { id: 'ua8', audit_code: 'AUD-2026-108', status: 'Reported' }, { id: 'ua9', audit_code: 'AUD-2026-109', status: 'Fieldwork complete' },
  { id: 'ua10', audit_code: 'AUD-2026-110', status: 'In progress' }, { id: 'ua11', audit_code: 'AUD-2026-111', status: 'Planned' },
];

/* ------------------------------------------------------------------ *
 * OBEAKPU (Expert): ISO 45001:2018
 * ------------------------------------------------------------------ */
export const OBEAKPU_STANDARD = { id: 's-45001', code: 'ISO 45001:2018', certification_status: 'Certified', cycle_years: 3, certificate_expires: '2026-08-27' };
export const OBEAKPU_REFS = ['4.1', '4.2', '4.3', '4.4', '5.1', '5.2', '5.3', '5.4', '6.1.1', '6.1.2.1', '6.1.2.2', '6.1.2.3', '6.1.3', '6.1.4',
  '6.2.1', '6.2.2', '7.1', '7.2', '7.3', '7.4.1', '7.4.2', '7.4.3', '7.5.1', '7.5.2', '7.5.3', '8.1.1', '8.1.2', '8.1.3',
  '8.1.4.1', '8.1.4.2', '8.1.4.3', '8.2', '9.1.1', '9.1.2', '9.2.1', '9.2.2', '9.3', '10.1', '10.2', '10.3'];
const cid = (ref) => `ob-${ref.replace(/\./g, '-')}`;
const EVIDENCED = { status: 'Conformant', evidence_reference: 'OHS-REC', assessed_date: '2026-04-20', assessed_by: 'u-zainab' };
/** Clause-level exceptions to "conformant with evidence, a date and an assessor". */
const CLAUSE_EXCEPTIONS = {
  '8.1.4.3': { applicability: 'Not applicable', status: 'Not applicable', applicability_justification: 'No outsourced processes within the certified scope.', evidence_reference: '', assessed_date: null, assessed_by: null },
  '6.1.3': { status: 'Nonconformant', evidence_reference: '' },
  '7.2': { status: 'Conformant', evidence_reference: '' },
  '7.4.3': { status: 'Partially conformant', assessed_by: null, assessor_name: '' },
  '5.4': { status: 'Not assessed', evidence_reference: '', assessed_date: null, assessed_by: null },
  '9.1.2': { status: 'Partially conformant' },
};
export const OBEAKPU_CLAUSES = OBEAKPU_REFS.map((ref) => ({
  id: cid(ref), standard_id: 's-45001', clause_ref: ref, applicability: 'Applicable', owner_id: 'u-owner', ...EVIDENCED,
  ...(CLAUSE_EXCEPTIONS[ref] || {}),
}));
export const OBEAKPU_AUDITS = [
  { id: 'ob-2023', audit_code: 'OSA-2023-002', audit_type: 'Internal', status: 'Closed', actual_end: '2023-06-16' },
  { id: 'ob-2025', audit_code: 'OSA-2025-001', audit_type: 'Internal', status: 'Closed', actual_end: '2025-03-21' },
  { id: 'ob-2026', audit_code: 'OSA-2026-001', audit_type: 'Internal', status: 'Reported', actual_end: '2026-03-27' },
  { id: 'ob-2026b', audit_code: 'OSA-2026-002', audit_type: 'Internal', status: 'In progress' },
  { id: 'ob-2025x', audit_code: 'OSA-2025-004', audit_type: 'Internal', status: 'Cancelled', cancellation_reason: 'Turnaround moved the audit window.' },
  { id: 'ob-cb', audit_code: 'OSA-2026-S02', audit_type: 'Surveillance', status: 'Closed', actual_end: '2026-07-17' },
];
/** Which audits examined which clauses. Default: the 2025 internal audit. */
// The clauses the 2025 internal audit did NOT examine. 7.1 and 7.3 were added
// after ASC-1: the re-vendored isoCompliance exports 34 functions, so the digest
// prints 34, and the covered count was moved off 34 (to 32) rather than
// hiding an engine count (gate_collisions.py).
export const OBEAKPU_NOT_EXAMINED_2025 = ['8.1.4.3', '4.4', '6.1.4', '7.5.2', '10.3', '5.3', '7.1', '7.3'];
const EXAMINED_2025 = OBEAKPU_REFS.filter((r) => !OBEAKPU_NOT_EXAMINED_2025.includes(r));
export const OBEAKPU_AUDIT_CLAUSES = [
  ...EXAMINED_2025.map((r) => ({ audit_id: 'ob-2025', clause_id: cid(r), result: 'Conformant', examined_on: '2025-03-19' })),
  // The Reported 2026 audit re-examined the operational clauses.
  ...['8.1.1', '8.1.2', '8.1.3', '8.2', '9.1.1', '10.2'].map((r) => ({ audit_id: 'ob-2026', clause_id: cid(r), result: 'Conformant', examined_on: '2026-03-25' })),
  { audit_id: 'ob-2026', clause_id: cid('9.3'), result: 'Not examined', examined_on: '2026-03-27' },
  { audit_id: 'ob-2026', clause_id: cid('6.1.3'), result: 'Nonconformant', examined_on: '2026-03-26' },
  // Later examinations that do not count: the in-progress audit, the certification body.
  { audit_id: 'ob-2026b', clause_id: cid('8.1.2'), result: 'Conformant', examined_on: '2026-09-30' },
  { audit_id: 'ob-2026b', clause_id: cid('6.1.4'), result: 'Conformant', examined_on: '2026-09-29' },
  { audit_id: 'ob-cb', clause_id: cid('8.1.2'), result: 'Conformant', examined_on: '2026-07-15' },
  { audit_id: 'ob-cb', clause_id: cid('7.5.2'), result: 'Conformant', examined_on: '2026-07-16' },
  // An audit later cancelled, and the last cycle's audit.
  { audit_id: 'ob-2025x', clause_id: cid('10.3'), result: 'Conformant', examined_on: '2025-08-20' },
  { audit_id: 'ob-2023', clause_id: cid('4.4'), result: 'Conformant', examined_on: '2023-06-14' },
  { audit_id: 'ob-2023', clause_id: cid('5.3'), result: 'Conformant', examined_on: '2023-06-14' },
];
export const OBEAKPU_FINDINGS = [
  { id: 'of1', finding_code: 'OSF-2026-002', audit_id: 'ob-2026', standard_id: 's-45001', finding_type: 'Major nonconformity', status: 'Closed',
    raised_date: '2026-01-19', due_date: '2026-04-19', closed_date: '2026-05-04', correction: 'Permit board restored.', root_cause: 'No custodian for the permit board.' },
  { id: 'of2', finding_code: 'OSF-2026-007', audit_id: 'ob-2026', standard_id: 's-45001', finding_type: 'Major nonconformity', status: 'Action in progress',
    raised_date: '2026-03-26', due_date: '2026-06-26' },
  { id: 'of3', finding_code: 'OSF-2026-009', audit_id: 'ob-2026', standard_id: 's-45001', finding_type: 'Minor nonconformity', status: 'Open',
    raised_date: '2026-06-03', due_date: '2026-08-31' },
];
export const OBEAKPU_ACTIONS = [
  { id: 'oa1', finding_id: 'of2', action_type: 'Corrective', status: 'In progress', due_date: '2026-09-11' },
];

/** Which capstone record and engine return each graded field is. */
export const FIELD_SOURCES = {
  ekpe_emissions_permit_next_action_days: 'EKPE e1: complianceStatus.explainStatus(e1).daysUntil',
  ekpe_community_report_next_due_days: 'EKPE e2 filed on its filing date: calendar.daysUntil(complianceStatus.rollForward(e2.due_date, e2.frequency))',
  ekpe_waste_return_period_start_days: 'EKPE e3: calendar.daysUntil(complianceStatus.periodStart(e3.due_date, e3.frequency))',
  ekpe_abstraction_next_action_after_filing_days: 'EKPE e4 filed and rolled: complianceStatus.explainStatus({...e4, due_date: rollForward(...)}).daysUntil',
  ekpe_slug_catcher_procedure_review_days: 'EKPE ed1: calendar.daysUntil(documentControl.nextReviewDate(ed1.issue_date, ed1.review_period_months))',
  ekpe_emergency_plan_review_days: 'EKPE ed2: calendar.daysUntil(documentControl.nextReviewDate(ed2.issue_date, ed2.review_period_months))',
  utapate_itp_progress_pct: 'UTAPATE plan: qualityAssurance.planProgress(checkpoints).percent',
  utapate_itp_progress_after_requests_pct: 'UTAPATE plan after the six requests, each through canRemoveCheckpoint or canDecideCheckpoint: planProgress.percent',
  utapate_oldest_open_ncr_days: 'UTAPATE NCRs: qualityAssurance.summarise(...).oldestOpenNcrDays',
  utapate_mean_open_ncr_age_days: 'UTAPATE NCRs: qualityAssurance.summarise(...).meanOpenNcrAgeDays',
  utapate_checklist_progress_pct: 'UTAPATE checklist: auditManagement.checklistProgress(items, responses).percent',
  utapate_programme_delivered_pct: 'UTAPATE programme: auditManagement.programmeProgress(audits).percent',
  obeakpu_clause_812_last_examined_days: 'OBEAKPU 8.1.2: calendar.daysUntil(isoCompliance.clauseCoverage(...) row lastExaminedOn)',
  obeakpu_clause_93_last_examined_days: 'OBEAKPU 9.3: calendar.daysUntil(isoCompliance.clauseCoverage(...) row lastExaminedOn)',
  obeakpu_closed_major_finding_age_days: 'OBEAKPU OSF-2026-002: isoCompliance.findingAgeDays',
  obeakpu_evidenced_claims: 'OBEAKPU: isoCompliance.certificationReadiness(...).counts.evidenced',
  obeakpu_certificate_days: 'OBEAKPU: isoCompliance.certificationReadiness(...).counts.certificateDays',
  obeakpu_clauses_covered: 'OBEAKPU: isoCompliance.certificationReadiness(...).counts.covered',
};
