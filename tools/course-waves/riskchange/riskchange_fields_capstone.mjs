// THE RISKCHANGE CAPSTONE CONDITIONS. The IGBARA flow station risk register
// (Associate), the OKOMU compression station change register (Professional),
// and the ETIM floating production unit topsides review with its ESD valve
// lesson and lessons register (Expert).
//
// Nothing here is imported by riskchange_dump.mjs, and no record, id, title,
// person or date in this file is a teaching record. Only riskchange_capstone.mjs,
// the leak and collision gates and (later) the migration headers read it.
//
// THE AS-OF DATE IS THE WAVE'S ONE AS-OF DATE, 1 October 2026, and every
// capstone prompt states it, because every date-dependent answer below is an
// answer ON that date. The capstone generator hands it to every engine call
// explicitly, under the same as-of gate and clock trap the digest runs under.
//
// EVERY GRADED FIELD IS AN INTEGER THE ENGINE RETURNS AND AN ORACLE CHECKS.
// The NextGen grader (academy_submit_capstone) compares NUMBERS only: it casts
// the expected value, the tolerance and the answer to numeric. So:
//   * no enum is graded (a band, an appetite verdict or an expiry state would
//     have to be typed as a code, which tests the code); enums are taught and
//     go to the banks;
//   * a DATE is graded as the integer YYYYMMDD of the date the engine returns
//     (toDateOnlyString with its two hyphens removed, which loses nothing);
//   * every tolerance is 0.5, the half unit the grader needs to accept exactly
//     the one whole number, and the floor gradeprecision.py sets for a figure
//     printed with no decimals.
//
// THE VALUES ARE DESIGNED APART. No graded value equals another tier's graded
// value (collisions.py), and none equals the value the digest prints for the
// same quantity on a teaching record (gate_collision.py). The first cut of
// these records put the IGBARA live inherent High count on the same value as
// the OBODO one; the teaching record OB-08 was moved rather than the capstone.
//
// HELD ITEMS ARE NEUTRALISED BY CONSTRUCTION. The MOC overdue test (RC-3) is
// on no graded path: OKOMU grades overdueActions, which reads an action's due
// date and never a change's target date. The peer review summary's
// cross-review count (RC-4) is on no graded path: ETIM grades one review's own
// log. isReviewOverdue is graded nowhere; the two IGBARA day counts are
// daysUntil on a live risk's review date.

export const AS_OF_PARTS = Object.freeze([2026, 10, 1]);
export const AS_OF = () => new Date(AS_OF_PARTS[0], AS_OF_PARTS[1] - 1, AS_OF_PARTS[2]);
export const AS_OF_ISO = '2026-10-01';

/** The register's live statuses, STATED in the prompt as a condition. */
export const IGBARA_LIVE = Object.freeze(['Open', 'Under Review', 'Mitigated', 'Realized']);

export const IGBARA_RISKS = Object.freeze([
  { id: 'IG-01', title: 'Gas blow-by from the inlet separator to the tank farm', status: 'Open',
    likelihood: 5, impact: 4, residual_likelihood: null, residual_impact: null, target_score: 12, next_review_date: '2026-12-01' },
  { id: 'IG-02', title: 'Corrosion under insulation on the crude header', status: 'Open',
    likelihood: 4, impact: 4, residual_likelihood: 3, residual_impact: 4, target_score: 9, next_review_date: '2026-11-20' },
  { id: 'IG-03', title: 'Overpressure of production separator V-100', status: 'Open',
    likelihood: 4, impact: 5, residual_likelihood: 2, residual_impact: '', target_score: 8, next_review_date: '2026-10-20' },
  { id: 'IG-04', title: 'Community access road blocked during flooding', status: 'Under Review',
    likelihood: 3, impact: 5, residual_likelihood: 3, residual_impact: 5, target_score: 10, next_review_date: '2027-01-10' },
  { id: 'IG-05', title: 'Loss of containment at the test manifold', status: 'Mitigated',
    likelihood: 5, impact: 5, residual_likelihood: 2, residual_impact: 5, target_score: 10, next_review_date: '2026-12-15' },
  { id: 'IG-06', title: 'Generator exhaust fire in the power house', status: 'Realized',
    likelihood: 3, impact: 4, residual_likelihood: 2, residual_impact: 3, target_score: 6, next_review_date: '2026-11-03' },
  { id: 'IG-07', title: 'Chemical injection pump seal leak', status: 'Draft',
    likelihood: 3, impact: 4, residual_likelihood: null, residual_impact: null, target_score: null, next_review_date: null },
  { id: 'IG-08', title: 'Dropped load on the flowline bridge', status: 'Open',
    likelihood: 3, impact: 4, residual_likelihood: 2.5, residual_impact: 4, target_score: 6, next_review_date: '2026-12-20' },
  { id: 'IG-09', title: 'Old saver pit overflow', status: 'Closed',
    likelihood: 4, impact: 5, residual_likelihood: 4, residual_impact: 5, target_score: 10, next_review_date: '2026-06-30' },
  { id: 'IG-10', title: 'Lightning strike on the flare stack', status: 'Open',
    likelihood: 2, impact: 5, residual_likelihood: 1, residual_impact: 5, target_score: 5, next_review_date: '2027-02-01' },
  { id: 'IG-11', title: 'Sand erosion of the choke valves', status: 'Open',
    likelihood: 2, impact: 3, residual_likelihood: null, residual_impact: null, target_score: 6, next_review_date: '2026-12-31' },
  { id: 'IG-12', title: 'Night driving between the flow station and the jetty', status: 'Open',
    likelihood: 3, impact: 4, residual_likelihood: 1, residual_impact: 4, target_score: 4, next_review_date: '2026-09-13' },
]);

/* ------------------------------------------------------------------ *
 * OKOMU: a compression station change register.
 * ------------------------------------------------------------------ */
const mo = (id, title, type, stage, extra = {}) => ({ id, moc_number: `MOC-${id}`, title, type, stage, ...extra });
export const OKOMU_MOCS = Object.freeze([
  mo('OK-01', 'Replace the anti-surge valve positioner on compressor K-301', 'Emergency', 'Implementation',
    { actual_implementation_date: '2026-09-28', expiry_date: '2026-12-15', originator_id: 'u-dayo' }),
  mo('OK-02', 'Temporary bypass of the suction scrubber level trip', 'Temporary', 'Implementation', { expiry_date: '2026-10-15' }),
  mo('OK-03', 'Temporary strainer in the lube oil return', 'Temporary', 'Implementation', { expiry_date: '2026-10-16' }),
  mo('OK-04', 'Temporary hose to the fuel gas skid', 'Temporary', 'Implementation', { expiry_date: '2026-10-01' }),
  mo('OK-05', 'Temporary relaxation of the discharge temperature alarm', 'Temporary', 'Review', { expiry_date: '2026-10-04' }),
  mo('OK-06', 'Clamp on the cooler header', 'Emergency', 'Implementation',
    { actual_implementation_date: '2026-09-23', expiry_date: '2026-10-08' }),
  mo('OK-07', 'Temporary generator for the control room', 'Temporary', 'Implementation', { expiry_date: '2026-09-30' }),
  mo('OK-08', 'Temporary blind on the recycle line', 'Temporary', 'Closed', { expiry_date: '2026-09-01' }),
  mo('OK-09', 'Temporary scaffold at the aftercooler', 'Temporary', 'Screening', { expiry_date: '2026-09-15' }),
  mo('OK-10', 'Emergency isolation of a vibration probe', 'Emergency', 'Implementation',
    { actual_implementation_date: '2026-09-24', expiry_date: '2026-09-29' }),
  mo('OK-11', 'New compressor wash procedure', 'Permanent', 'Implementation', { expiry_date: '2026-09-01' }),
  mo('OK-12', 'Emergency repair to the gas detector loop', 'Emergency', 'Implementation', { expiry_date: '2026-11-30' }),
  mo('OK-13', 'Emergency jumper on the instrument air header', 'Emergency', 'Implementation',
    { actual_implementation_date: '2026-09-10', expiry_date: '2026-09-20' }),
  mo('OK-14', 'Emergency override of a seal gas alarm', 'Emergency', 'Approval', { expiry_date: '2026-10-03' }),
  mo('OK-15', 'Temporary pressure gauge on the interstage line', 'Temporary', 'Implementation', { expiry_date: '2026-09-25' }),
  mo('OK-16', 'Temporary crane on the compressor deck', 'Temporary', 'Cancelled', { expiry_date: '2026-09-10' }),
  mo('OK-17', 'Temporary pipe support at the knockout drum', 'Temporary', 'Implementation', { expiry_date: '2026-09-12' }),
  mo('OK-19', 'Emergency replacement of a relief valve spring', 'Emergency', 'Implementation',
    { actual_implementation_date: '2026-09-18', expiry_date: '2026-12-31' }),
  mo('OK-20', 'Temporary spool at the fuel gas filter', 'Temporary', 'Implementation', { expiry_date: '2026-10-09' }),
  mo('OK-21', 'Temporary lighting tower at the laydown yard', 'Temporary', 'Implementation', { expiry_date: '2026-10-12' }),
  mo('OK-22', 'Temporary drain line to the closed drain drum', 'Temporary', 'Closed', { expiry_date: '2026-10-10' }),
  mo('OK-23', 'Permanent change to the start-up sequence', 'Permanent', 'Implementation', { expiry_date: '2026-10-06' }),
  mo('OK-24', 'Temporary hand valve on the purge line', 'Temporary', 'Implementation', { expiry_date: '2026-08-31' }),
]);

export const OKOMU_APPROVALS = Object.freeze([
  { id: 'OA-01', moc_id: 'OK-01', level: 1, status: 'Approved', approver_id: 'u-sade', decided_on: '2026-09-27' },
  { id: 'OA-02', moc_id: 'OK-01', level: 2, status: 'Pending', approver_id: 'u-obi' },
  { id: 'OA-03', moc_id: 'OK-06', level: 1, status: 'Approved', approver_id: 'u-sade' },
  { id: 'OA-04', moc_id: 'OK-06', level: 2, status: 'Pending', approver_id: 'u-obi' },
  { id: 'OA-05', moc_id: 'OK-10', level: 1, status: 'Approved', approver_id: 'u-sade' },
  { id: 'OA-06', moc_id: 'OK-10', level: 2, status: 'Pending', approver_id: 'u-obi' },
  { id: 'OA-07', moc_id: 'OK-12', level: 1, status: 'Approved', approver_id: 'u-sade' },
  { id: 'OA-08', moc_id: 'OK-12', level: 2, status: 'Pending', approver_id: 'u-obi' },
  { id: 'OA-09', moc_id: 'OK-13', level: 1, status: 'Approved', approver_id: 'u-sade' },
  { id: 'OA-10', moc_id: 'OK-13', level: 2, status: 'Approved', approver_id: 'u-obi' },
  { id: 'OA-11', moc_id: 'OK-14', level: 1, status: 'Pending', approver_id: 'u-sade' },
  { id: 'OA-12', moc_id: 'OK-19', level: 1, status: 'Approved', approver_id: 'u-sade' },
  { id: 'OA-13', moc_id: 'OK-19', level: 2, status: 'Approved', approver_id: 'u-obi' },
  { id: 'OA-14', moc_id: 'OK-19', level: 3, status: 'Pending', approver_id: 'u-lara' },
]);

export const OKOMU_ACTIONS = Object.freeze([
  { id: 'OX-01', moc_id: 'OK-01', action_type: 'Post-implementation', status: 'Open', due_date: '2026-10-10' },
  { id: 'OX-02', moc_id: 'OK-02', action_type: 'Post-implementation', status: 'In progress', due_date: '2026-10-02' },
  { id: 'OX-03', moc_id: 'OK-03', action_type: 'Implementation', status: 'Complete', due_date: '2026-09-20' },
  { id: 'OX-04', moc_id: 'OK-05', action_type: 'Pre-implementation', status: 'Open', due_date: '2026-10-01' },
  { id: 'OX-05', moc_id: 'OK-07', action_type: 'Post-implementation', status: 'Cancelled', due_date: '2026-09-15' },
  { id: 'OX-06', moc_id: 'OK-08', action_type: 'Post-implementation', status: 'Open', due_date: '2026-09-05' },
  { id: 'OX-07', moc_id: 'OK-16', action_type: 'Pre-implementation', status: 'In progress', due_date: '2026-09-01' },
  { id: 'OX-08', moc_id: 'OK-99', action_type: 'Implementation', status: 'Open', due_date: '2026-09-29' },
  { id: 'OX-09', moc_id: 'OK-12', action_type: 'Implementation', status: 'Open', due_date: '2026-10-20' },
  { id: 'OX-10', moc_id: 'OK-13', action_type: 'Post-implementation', status: 'In progress', due_date: '2026-10-02' },
  { id: 'OX-11', moc_id: 'OK-09', action_type: 'Pre-implementation', status: 'Open', due_date: '2026-10-03' },
  { id: 'OX-12', moc_id: 'OK-19', action_type: 'Post-implementation', status: 'Open', due_date: '2026-10-15' },
  { id: 'OX-13', moc_id: 'OK-06', action_type: 'Post-implementation', status: 'In progress', due_date: '2026-10-08' },
  { id: 'OX-14', moc_id: 'OK-21', action_type: 'Post-implementation', status: 'Open', due_date: '2026-10-12' },
  { id: 'OX-15', moc_id: 'OK-14', action_type: 'Pre-implementation', status: 'Open', due_date: '2026-10-02' },
]);

/* ------------------------------------------------------------------ *
 * ETIM: one topsides review, one lesson, one lessons register.
 * ------------------------------------------------------------------ */
export const ETIM_REVIEW = Object.freeze({ id: 'ET-R1', review_code: 'PR-ET-R1',
  title: 'Topsides emergency shutdown system cause and effect', stage: 'Verification',
  author_id: 'u-bassey', due_date: '2026-10-09' });

const cm = (id, severity, status, day, response = true) => ({ id, review_id: 'ET-R1', severity, status,
  ...(response && status !== 'Open' ? { response_text: 'Response recorded.' } : {}),
  created_at: `2026-09-${String(day).padStart(2, '0')}T08:00:00Z` });
export const ETIM_COMMENTS = Object.freeze([
  cm('EC-01', 'Critical', 'Open', 2),
  cm('EC-02', 'Critical', 'Open', 3),
  cm('EC-03', 'Critical', 'Responded', 3),
  cm('EC-04', 'Major', 'Open', 4),
  cm('EC-05', 'Major', 'Responded', 4),
  cm('EC-06', 'Major', 'Rejected', 5),
  cm('EC-07', 'Major', 'Rejected', 5),
  cm('EC-08', 'Major', 'Verified', 6),
  cm('EC-09', 'Critical', 'Closed', 6),
  cm('EC-10', 'Major', 'Withdrawn', 7),
  cm('EC-11', 'Minor', 'Open', 7),
  cm('EC-12', 'Minor', 'Open', 8),
  cm('EC-13', 'Editorial', 'Open', 8),
  cm('EC-14', null, 'Open', 9),
  cm('EC-15', 'Minor', 'Rejected', 9),
]);

export const ETIM_LESSON = Object.freeze({ id: 'EL-01', lesson_code: 'LL-EL-01',
  title: 'ESD valve failed to close on demand during a trip test', status: 'Published',
  description: 'Recorded.', root_cause: 'Recorded.', recommendation: 'Recorded.',
  author_id: 'u-bassey', event_date: '2026-04-11', created_at: '2026-04-14T09:00:00Z',
  validated_at: '2026-04-28', validated_by: 'u-edet', review_due: '2026-10-01' });

const ap = (id, target_type, outcome, applied_on, extra = {}) => ({ id, lesson_id: 'EL-01', target_type, outcome, applied_on, ...extra });
export const ETIM_APPLICATIONS = Object.freeze([
  ap('EA-01', 'Risk register', 'Adopted', '2026-04-30', { target_risk_id: 'ETR-14' }),
  ap('EA-02', 'Procedure', 'Adapted', '2026-05-05', { reference: 'Trip test procedure rev 7' }),
  ap('EA-03', 'Maintenance plan', 'Adopted', '2026-05-20', { reference: 'Valve stroke test routine' }),
  ap('EA-04', 'Management of change', 'Adopted', '2026-06-02', { target_moc_id: 'ETM-03' }),
  ap('EA-05', 'Design standard', 'Adapted', '2026-06-25', { reference: 'Actuator sizing standard' }),
  ap('EA-06', 'Training', 'Rejected', '2026-07-01', { reference: 'Control room course', notes: 'Covered by the new simulator module.' }),
  ap('EA-07', 'Contract or tender', 'Adopted', '2026-07-15', { reference: 'Valve supply tender' }),
  ap('EA-08', 'Procedure', 'Adopted', '2026-08-03', { reference: 'Isolation procedure rev 3' }),
  ap('EA-09', 'Maintenance plan', 'Adapted', '2026-08-19', { reference: 'Partial stroke test interval' }),
  ap('EA-10', 'Other', 'Rejected', '2026-09-12', { reference: 'Sister vessel', notes: 'Different valve make.' }),
]);

const le = (id, status, review_due) => ({ id, lesson_code: `LL-${id}`, title: `Lesson ${id}`, status,
  description: 'Recorded.', root_cause: 'Recorded.', recommendation: 'Recorded.', author_id: 'u-edet',
  event_date: '2026-03-01', ...(review_due ? { review_due } : {}) });
export const ETIM_LESSONS = Object.freeze([
  ETIM_LESSON,
  le('EL-02', 'Published', '2026-10-31'),
  le('EL-03', 'Embedded', '2026-10-15'),
  le('EL-04', 'Published', '2026-10-02'),
  le('EL-05', 'Published', '2026-10-10'),
  le('EL-06', 'Embedded', '2026-10-20'),
  le('EL-07', 'Published', '2026-10-25'),
  le('EL-08', 'Published', '2026-10-04'),
  le('EL-09', 'Embedded', '2026-10-30'),
  le('EL-10', 'Published', '2026-11-01'),
  le('EL-11', 'Published', '2026-09-30'),
  le('EL-12', 'Validated', '2026-10-12'),
  le('EL-13', 'Archived', '2026-10-08'),
  le('EL-14', 'Published', null),
]);

/* ------------------------------------------------------------------ *
 * THE PROMPTS a learner reads while graded. Prose only: the records go
 * beside them as tables of INPUT columns, and gate_promptleak.py proves
 * that no graded value is in the prose, that no table column is an
 * engine output, and that neither graded date appears in any form.
 * ------------------------------------------------------------------ */
export const PROMPTS = Object.freeze({
  beginner: 'IGBARA flow station, risk register, read on 2026-10-01. The table lists every risk with its status, '
    + 'likelihood, impact, residual likelihood, residual impact (a blank cell was left blank on the form, null was never '
    + 'assessed), target score and next review date. The register still carries the risks whose status is Open, Under '
    + 'Review, Mitigated or Realized. Give: the inherent score of IG-03; the residual score of IG-03; how many of the '
    + 'risks the register still carries are Critical on their residual score; how many of them are High on their '
    + 'inherent score; the whole days from the as-of date to the next review of IG-06; and the whole days from the '
    + 'as-of date to the next review of IG-12, negative if it has passed.',
  intermediate: 'OKOMU compression station, change register, read on 2026-10-01. The tables list every change with its '
    + 'type, stage, expiry date and actual implementation date, every approval row with its change, level and status, '
    + 'and every action with its change, type, status and due date. A change listed with no actual implementation date '
    + 'has none recorded. Give: the date by which every remaining approval '
    + 'level of OK-01 must have signed, written as eight digits year month day; how many changes read Expiring soon; how '
    + 'many read Expired; how many actions are open work; how many open actions are past their due date; and how many '
    + 'changes read Ratification overdue.',
  advanced: 'ETIM floating production unit, read on 2026-10-01. Review ET-R1 is in Verification, an active stage. '
    + 'The first table is the comment log of review ET-R1 with '
    + 'each comment severity and disposition. The second is every application recorded for lesson EL-01 with its '
    + 'target, outcome and date; EL-01 records its event date. The third is the lessons register with each lesson status '
    + 'and review date. Give: how many comments block the closure of ET-R1; how many comments on ET-R1 are open; how many '
    + 'applications of EL-01 changed something; the date EL-01 was last applied, written as eight digits year month day; '
    + 'the age of EL-01 in whole days; and how many lessons on the register read review due soon.',
});

/** The input columns each prompt table may carry. Anything else is an output. */
export const PROMPT_TABLES = Object.freeze({
  beginner: [['IGBARA_RISKS', ['id', 'title', 'status', 'likelihood', 'impact', 'residual_likelihood', 'residual_impact', 'target_score', 'next_review_date']]],
  intermediate: [
    ['OKOMU_MOCS', ['id', 'moc_number', 'title', 'type', 'stage', 'expiry_date', 'actual_implementation_date', 'originator_id']],
    ['OKOMU_APPROVALS', ['id', 'moc_id', 'level', 'status', 'approver_id', 'decided_on']],
    ['OKOMU_ACTIONS', ['id', 'moc_id', 'action_type', 'status', 'due_date']],
  ],
  advanced: [
    ['ETIM_COMMENTS', ['id', 'review_id', 'severity', 'status', 'response_text', 'created_at']],
    ['ETIM_APPLICATIONS', ['id', 'lesson_id', 'target_type', 'outcome', 'applied_on', 'target_risk_id', 'target_moc_id', 'reference', 'notes']],
    ['ETIM_LESSONS', ['id', 'lesson_code', 'title', 'status', 'description', 'root_cause', 'recommendation', 'author_id', 'event_date', 'created_at', 'validated_at', 'validated_by', 'review_due']],
  ],
});
