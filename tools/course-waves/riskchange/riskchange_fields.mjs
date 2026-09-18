// THE RISKCHANGE TEACHING FIELDS. Every record the digest is built on, in one
// place, so the dump, the claim gates and a lesson all read the same case.
//
// ONE AS-OF DATE FOR THE WHOLE WAVE: 1 October 2026, a Thursday. Every rule in
// these engines that falls due does so on a calendar date, and every one of
// them defaults its `today` to the machine clock. The dump never lets it: every
// call that takes a date is handed AS_OF(), a Date built at LOCAL midnight from
// its three parts, which is the calendar date the engines' own calendar.js
// reads in every time zone. AS_OF_ISO is the same date in the one text form the
// digest prints.
//
// FOUR TEACHING RECORD SETS, AND THEY SHARE NOTHING WITH THE CAPSTONE. The
// capstone runs different records, written in riskchange_fields_capstone.mjs,
// and nothing in this file or in riskchange_dump.mjs imports, reads or
// reproduces any of it. gate_capstone_leak.py sweeps both directions.
//
//   OBODO    the risk register of an invented crude export terminal on the
//            Niger Delta coast: twelve risks across every status the register
//            carries, a blank residual axis, a fractional level, an off-scale
//            impact and a review due on the as-of date itself.
//   ESANMI   the Management of Change register of an invented gas plant in
//            Delta State: twelve changes across every stage and all three
//            change types, their approval rows and their action rows.
//   IKANG    a peer review register at an invented water injection project in
//            Akwa Ibom: five reviews and the comment log of the one in
//            Verification.
//   ONNE     the lessons register of an invented offshore supply base in
//            Rivers State: ten lessons across all seven statuses and the
//            applications that prove or fail to prove each one was used.
//
// The names are places and plain words. None is an operator, a licence, a
// field or a facility that exists.

export const AS_OF_PARTS = Object.freeze([2026, 10, 1]);
export const AS_OF = () => new Date(AS_OF_PARTS[0], AS_OF_PARTS[1] - 1, AS_OF_PARTS[2]);
export const AS_OF_ISO = '2026-10-01';

/* ------------------------------------------------------------------ *
 * OBODO: a terminal risk register.
 * ------------------------------------------------------------------ */
export const OBODO_RISKS = Object.freeze([
  { id: 'OB-01', title: 'Floating roof seal failure on crude tank T-104', status: 'Open',
    likelihood: 3, impact: 5, residual_likelihood: 2, residual_impact: 5, target_score: 10,
    next_review_date: '2026-10-01' },
  { id: 'OB-02', title: 'Fatigue crack in a jetty loading arm', status: 'Open',
    likelihood: 4, impact: 4, residual_likelihood: 2, residual_impact: '', target_score: 6,
    next_review_date: '2026-09-30' },
  { id: 'OB-03', title: 'Intrusion at the single point mooring manifold', status: 'Under Review',
    likelihood: 5, impact: 4, residual_likelihood: null, residual_impact: null, target_score: 12,
    next_review_date: '2026-11-15' },
  { id: 'OB-04', title: 'Crude theft by hot tap on the export line', status: 'Mitigated',
    likelihood: 4, impact: 3, residual_likelihood: 3, residual_impact: 3, target_score: 9,
    next_review_date: '2026-12-01' },
  { id: 'OB-05', title: 'Diesel fire pump fails to start on demand', status: 'Open',
    likelihood: 2, impact: 5, residual_likelihood: 1, residual_impact: 5, target_score: 4,
    next_review_date: '2026-09-15' },
  { id: 'OB-06', title: 'Carry-over from the oily water separator', status: 'Open',
    likelihood: 3, impact: 3, residual_likelihood: 2, residual_impact: 2, target_score: null,
    next_review_date: '2026-10-31' },
  { id: 'OB-07', title: 'Pump house flooded in the rainy season', status: 'Realized',
    likelihood: 3, impact: 4, residual_likelihood: 2, residual_impact: 4, target_score: 8,
    next_review_date: '2026-10-02' },
  { id: 'OB-08', title: 'Fall from height during tank inspection', status: 'Open',
    likelihood: 3, impact: 5, residual_likelihood: 2.5, residual_impact: 5, target_score: 5,
    next_review_date: '2026-11-30' },
  { id: 'OB-09', title: 'Laboratory sample mislabelling', status: 'Draft',
    likelihood: 2, impact: 2, residual_likelihood: null, residual_impact: null, target_score: null,
    next_review_date: null },
  { id: 'OB-10', title: 'Decommissioned tank T-101 left with sludge', status: 'Closed',
    likelihood: 4, impact: 5, residual_likelihood: 1, residual_impact: 5, target_score: 5,
    next_review_date: '2027-03-31' },
  { id: 'OB-11', title: 'Legacy import carrying an impact of 6', status: 'Open',
    likelihood: 3, impact: 6, residual_likelihood: null, residual_impact: null, target_score: 6,
    next_review_date: '2026-12-15' },
  { id: 'OB-12', title: 'Hydrogen sulphide release at the sour crude tank', status: 'Open',
    likelihood: 1, impact: 5, residual_likelihood: 1, residual_impact: 3, target_score: 3,
    next_review_date: '2027-01-15' },
]);

/** Level probes for the scale: each is [likelihood, impact, what it is]. */
export const LEVEL_PROBES = Object.freeze([
  [3, 4, 'two whole levels'],
  ['3', '4', 'two whole levels written as text'],
  [' 3 ', 4, 'a level with spaces around it'],
  ['3.0', 4, 'a whole level written as text with a decimal point'],
  [true, 5, 'the value true'],
  [0, 4, 'a zero likelihood'],
  [6, 4, 'a likelihood of 6'],
  [2.5, 4, 'a likelihood of 2.5'],
  ['3.5', 4, 'a likelihood of 3.5 written as text'],
  ['', 4, 'a blank likelihood'],
  [null, 4, 'no likelihood at all'],
  [-2, 4, 'a negative likelihood'],
]);

/** Scores probed against the bands, including the edges either side of each. */
export const BAND_PROBES = Object.freeze([0, 1, 4, 5, 9, 10, 14, 15, 25, 26, 4.5, 14.5, -3]);

/** Residual probes for the per-axis fallback: [label, risk]. */
export const RESIDUAL_PROBES = Object.freeze([
  ['both residual axes assessed', { likelihood: 4, impact: 5, residual_likelihood: 2, residual_impact: 3 }],
  ['neither residual axis assessed', { likelihood: 4, impact: 5, residual_likelihood: null, residual_impact: null }],
  ['residual likelihood only, impact left blank', { likelihood: 4, impact: 5, residual_likelihood: 2, residual_impact: '' }],
  ['residual impact only, likelihood left blank', { likelihood: 4, impact: 5, residual_likelihood: '', residual_impact: 3 }],
  ['both residual axes left blank', { likelihood: 4, impact: 5, residual_likelihood: '', residual_impact: '' }],
  ['a residual likelihood of 2.5', { likelihood: 4, impact: 5, residual_likelihood: 2.5, residual_impact: 3 }],
  ['a residual likelihood of 7', { likelihood: 4, impact: 5, residual_likelihood: 7, residual_impact: 3 }],
]);

/** Appetite probes: [label, risk]. */
export const APPETITE_PROBES = Object.freeze([
  ['residual below the target', { likelihood: 4, impact: 4, residual_likelihood: 2, residual_impact: 3, target_score: 8 }],
  ['residual equal to the target', { likelihood: 4, impact: 4, residual_likelihood: 2, residual_impact: 4, target_score: 8 }],
  ['residual above the target', { likelihood: 4, impact: 4, residual_likelihood: 3, residual_impact: 3, target_score: 8 }],
  ['no target set', { likelihood: 4, impact: 4, residual_likelihood: 2, residual_impact: 3, target_score: null }],
  ['a target of zero', { likelihood: 4, impact: 4, residual_likelihood: 2, residual_impact: 3, target_score: 0 }],
  ['a residual that cannot be scored', { likelihood: 4, impact: 4, residual_likelihood: 2.5, residual_impact: 3, target_score: 8 }],
]);

/** Calendar probes: [label, date]. daysUntil against AS_OF. */
export const CALENDAR_PROBES = Object.freeze([
  ['the as-of date itself', '2026-10-01'],
  ['the day before', '2026-09-30'],
  ['the day after', '2026-10-02'],
  ['the last day of October', '2026-10-31'],
  ['the first day of November', '2026-11-01'],
  ['the first day of the next year', '2027-01-01'],
  ['a date one year earlier', '2025-10-01'],
  ['a timestamp late in the evening, UTC', '2026-09-30T23:30:00Z'],
  ['30 February, a date that does not exist', '2026-02-30'],
  ['a month of 13', '2026-13-01'],
  ['words where a date should be', 'after the turnaround'],
  ['nothing at all', null],
]);

/* ------------------------------------------------------------------ *
 * ESANMI: a gas plant Management of Change register.
 * ------------------------------------------------------------------ */
export const ESANMI_MOCS = Object.freeze([
  { id: 'ES-01', moc_number: 'MOC-ES-01', title: 'Replace the dry gas seals on compressor K-201',
    type: 'Permanent', stage: 'Approval', risk_level: 'High', originator_id: 'u-chika',
    target_implementation_date: '2026-10-20' },
  { id: 'ES-02', moc_number: 'MOC-ES-02', title: 'Temporary bypass of level transmitter LT-3302',
    type: 'Temporary', stage: 'Implementation', risk_level: 'High', originator_id: 'u-bayo',
    target_implementation_date: '2026-09-20', expiry_date: '2026-10-14' },
  { id: 'ES-03', moc_number: 'MOC-ES-03', title: 'Temporary jumper hose on the produced water line',
    type: 'Temporary', stage: 'Implementation', risk_level: 'Medium', originator_id: 'u-bayo',
    target_implementation_date: '2026-09-10', expiry_date: '2026-09-28' },
  { id: 'ES-04', moc_number: 'MOC-ES-04', title: 'Clamp on a leaking fuel gas header',
    type: 'Emergency', stage: 'Implementation', risk_level: 'Critical', originator_id: 'u-ifeoma',
    target_implementation_date: '2026-09-26', actual_implementation_date: '2026-09-26',
    expiry_date: '2026-11-29' },
  { id: 'ES-05', moc_number: 'MOC-ES-05', title: 'Isolation of a flare knock-out drum level switch',
    type: 'Emergency', stage: 'Implementation', risk_level: 'High', originator_id: 'u-ifeoma',
    target_implementation_date: '2026-09-20', actual_implementation_date: '2026-09-20',
    expiry_date: '2026-10-10' },
  { id: 'ES-06', moc_number: 'MOC-ES-06', title: 'Revised operating procedure for glycol regeneration',
    type: 'Permanent', stage: 'Closed', risk_level: 'Low', originator_id: 'u-chika',
    target_implementation_date: '2026-08-15' },
  { id: 'ES-07', moc_number: 'MOC-ES-07', title: 'Relief valve gagged for a hydrotest',
    type: 'Temporary', stage: 'Closed', risk_level: 'High', originator_id: 'u-bayo',
    target_implementation_date: '2026-07-20', expiry_date: '2026-08-01' },
  { id: 'ES-08', moc_number: 'MOC-ES-08', title: 'New control room shift pattern',
    type: 'Permanent', stage: 'Review', risk_level: 'Medium', originator_id: 'u-tunde',
    target_implementation_date: '2026-09-25' },
  { id: 'ES-09', moc_number: 'MOC-ES-09', title: 'Control system firmware upgrade',
    type: 'Permanent', stage: 'Cancelled', risk_level: 'Medium', originator_id: 'u-tunde',
    target_implementation_date: '2026-08-01' },
  { id: 'ES-10', moc_number: 'MOC-ES-10', title: 'Temporary scaffold across the pipe rack',
    type: 'Temporary', stage: 'Screening', risk_level: 'Low', originator_id: 'u-chika',
    target_implementation_date: '2026-10-06', expiry_date: '2026-09-01' },
  { id: 'ES-11', moc_number: 'MOC-ES-11', title: 'Change of corrosion inhibitor supplier',
    type: 'Permanent', stage: 'Rejected', risk_level: 'Medium', originator_id: 'u-tunde',
    target_implementation_date: '2026-09-01' },
  { id: 'ES-12', moc_number: 'MOC-ES-12', title: 'Emergency repair to a firewater ring main',
    type: 'Emergency', stage: 'Implementation', risk_level: 'Critical', originator_id: 'u-ifeoma',
    target_implementation_date: '2026-09-28', expiry_date: '2026-12-31' },
]);

export const ESANMI_APPROVALS = Object.freeze([
  { id: 'AP-01', moc_id: 'ES-01', level: 1, status: 'Approved', approver_id: 'u-ngozi' },
  { id: 'AP-02', moc_id: 'ES-01', level: 2, status: 'Pending', approver_id: 'u-emeka' },
  { id: 'AP-03', moc_id: 'ES-01', level: 3, status: 'Pending', approver_id: 'u-halima' },
  { id: 'AP-04', moc_id: 'ES-02', level: 1, status: 'Approved', approver_id: 'u-ngozi' },
  { id: 'AP-05', moc_id: 'ES-02', level: 2, status: 'Approved', approver_id: 'u-emeka' },
  { id: 'AP-06', moc_id: 'ES-03', level: 1, status: 'Approved', approver_id: 'u-ngozi' },
  { id: 'AP-07', moc_id: 'ES-04', level: 1, status: 'Approved', approver_id: 'u-ngozi' },
  { id: 'AP-08', moc_id: 'ES-04', level: 2, status: 'Pending', approver_id: 'u-emeka' },
  { id: 'AP-09', moc_id: 'ES-05', level: 1, status: 'Approved', approver_id: 'u-ngozi' },
  { id: 'AP-10', moc_id: 'ES-05', level: 2, status: 'Pending', approver_id: 'u-emeka' },
  { id: 'AP-11', moc_id: 'ES-05', level: 3, status: 'Pending', approver_id: 'u-halima' },
  { id: 'AP-12', moc_id: 'ES-12', level: 1, status: 'Approved', approver_id: 'u-ngozi' },
  { id: 'AP-13', moc_id: 'ES-12', level: 2, status: 'Pending', approver_id: 'u-emeka' },
]);

export const ESANMI_ACTIONS = Object.freeze([
  { id: 'AC-01', moc_id: 'ES-01', action_type: 'Pre-implementation', status: 'Open', due_date: '2026-09-28' },
  { id: 'AC-02', moc_id: 'ES-01', action_type: 'Pre-implementation', status: 'Complete', due_date: '2026-09-15' },
  { id: 'AC-03', moc_id: 'ES-02', action_type: 'Post-implementation', status: 'In progress', due_date: '2026-10-10' },
  { id: 'AC-04', moc_id: 'ES-04', action_type: 'Implementation', status: 'Complete', due_date: '2026-09-26' },
  { id: 'AC-05', moc_id: 'ES-04', action_type: 'Post-implementation', status: 'Open', due_date: '2026-10-20' },
  { id: 'AC-06', moc_id: 'ES-06', action_type: 'Post-implementation', status: 'Open', due_date: '2026-09-01' },
  { id: 'AC-07', moc_id: 'ES-09', action_type: 'Pre-implementation', status: 'In progress', due_date: '2026-08-10' },
  { id: 'AC-08', moc_id: 'ES-03', action_type: 'Post-implementation', status: 'Cancelled', due_date: '2026-09-20' },
  { id: 'AC-09', moc_id: 'ES-99', action_type: 'Implementation', status: 'Open', due_date: '2026-09-30' },
]);

/** The approval sets the gate lessons read, each a list of approval rows. */
export const APPROVAL_SETS = Object.freeze([
  ['three levels, the first signed', [
    { level: 1, status: 'Approved' }, { level: 2, status: 'Pending' }, { level: 3, status: 'Pending' }]],
  ['three levels, all signed', [
    { level: 1, status: 'Approved' }, { level: 2, status: 'Approved' }, { level: 3, status: 'Approved' }]],
  ['two signers at level 2, one of them signed', [
    { level: 1, status: 'Approved' }, { level: 2, status: 'Pending' }, { level: 2, status: 'Approved' }]],
  ['every level signed and one rejection', [
    { level: 1, status: 'Approved' }, { level: 2, status: 'Approved' }, { level: 2, status: 'Rejected' }]],
  ['a row with no level at all', [{ status: 'Approved' }]],
  ['levels 1 and 3, no level 2', [{ level: 1, status: 'Approved' }, { level: 3, status: 'Pending' }]],
  ['a delegated row', [{ level: 1, status: 'Delegated' }]],
  ['no approval rows', []],
]);

/** Expiry sweep on one temporary change in Implementation: days from AS_OF to its expiry. */
export const EXPIRY_DAY_SWEEP = Object.freeze([-30, -1, 0, 1, 13, 14, 15, 60]);
/** Ratification sweep on one emergency change: days since its implementation. */
export const RATIFY_DAY_SWEEP = Object.freeze([0, 1, 6, 7, 8, 30]);

/* ------------------------------------------------------------------ *
 * IKANG: a peer review register.
 * ------------------------------------------------------------------ */
export const IKANG_REVIEWS = Object.freeze([
  { id: 'IK-01', review_code: 'PR-IK-01', title: 'Water injection pump selection', stage: 'Verification',
    priority: 'High', author_id: 'u-efe', due_date: '2026-09-29' },
  { id: 'IK-02', review_code: 'PR-IK-02', title: 'Injection manifold hydraulic model', stage: 'In Review',
    priority: 'Medium', author_id: 'u-efe', due_date: '2026-10-01' },
  { id: 'IK-03', review_code: 'PR-IK-03', title: 'Produced water treatment basis of design', stage: 'Closed',
    priority: 'High', author_id: 'u-kemi', due_date: '2026-08-15' },
  { id: 'IK-04', review_code: 'PR-IK-04', title: 'Filtration package datasheet', stage: 'Cancelled',
    priority: 'Low', author_id: 'u-kemi', due_date: '2026-08-01' },
  { id: 'IK-05', review_code: 'PR-IK-05', title: 'Injection well completion design', stage: 'Draft',
    priority: 'Medium', author_id: 'u-efe', due_date: '2026-10-20' },
]);

/** The comment log of IK-01, the review in Verification. */
export const IKANG_COMMENTS = Object.freeze([
  { id: 'C-01', review_id: 'IK-01', severity: 'Critical', status: 'Open', created_at: '2026-09-02T09:00:00Z' },
  { id: 'C-02', review_id: 'IK-01', severity: 'Critical', status: 'Verified', response_text: 'NPSH margin recalculated at the low suction level.', created_at: '2026-09-02T09:30:00Z' },
  { id: 'C-03', review_id: 'IK-01', severity: 'Major', status: 'Responded', response_text: 'Seal plan changed to 53B.', created_at: '2026-09-03T10:00:00Z' },
  { id: 'C-04', review_id: 'IK-01', severity: 'Major', status: 'Rejected', response_text: 'Vendor curve attached.', created_at: '2026-09-03T11:00:00Z' },
  { id: 'C-05', review_id: 'IK-01', severity: 'Major', status: 'Withdrawn', created_at: '2026-09-04T08:00:00Z' },
  { id: 'C-06', review_id: 'IK-01', severity: 'Minor', status: 'Open', created_at: '2026-09-04T09:00:00Z' },
  { id: 'C-07', review_id: 'IK-01', severity: 'Editorial', status: 'Open', created_at: '2026-09-05T09:00:00Z' },
  { id: 'C-08', review_id: 'IK-01', severity: 'Critical', status: 'Closed', response_text: 'Driver resized.', created_at: '2026-09-01T09:00:00Z' },
  { id: 'C-09', review_id: 'IK-01', severity: null, status: 'Open', created_at: '2026-09-06T09:00:00Z' },
]);

/** Comments on the OTHER IKANG reviews, for the register-wide summary: two on
 *  IK-04, which is Cancelled and locked, and one on IK-02, which is live. */
export const IKANG_OTHER_COMMENTS = Object.freeze([
  { id: 'C-10', review_id: 'IK-04', severity: 'Critical', status: 'Open', created_at: '2026-07-20T09:00:00Z' },
  { id: 'C-11', review_id: 'IK-04', severity: 'Major', status: 'Responded', response_text: 'Datasheet reissued.', created_at: '2026-07-21T09:00:00Z' },
  { id: 'C-12', review_id: 'IK-02', severity: 'Major', status: 'Open', created_at: '2026-09-22T09:00:00Z' },
]);

/** The reviewer panel of IK-01: who may be put on it, and in what role. */
export const IKANG_PARTICIPANTS = Object.freeze([
  ['the author of the work, as a Reviewer', { user_id: 'u-efe', role: 'Reviewer' }],
  ['the author of the work, as the Lead Reviewer', { user_id: 'u-efe', role: 'Lead Reviewer' }],
  ['the author of the work, with no role given', { user_id: 'u-efe' }],
  ['the author of the work, as an Observer', { user_id: 'u-efe', role: 'Observer' }],
  ['u-kemi, independent of the work, as the Lead Reviewer', { user_id: 'u-kemi', role: 'Lead Reviewer' }],
  ['an external reviewer named only by display name', { display_name: 'A. Okafor (external)', role: 'Reviewer' }],
  ['nobody named at all', { role: 'Reviewer' }],
]);

/* ------------------------------------------------------------------ *
 * ONNE: a supply base lessons register.
 * ------------------------------------------------------------------ */
const FULL = Object.freeze({
  description: 'What happened is recorded.',
  root_cause: 'Why it happened is recorded.',
  recommendation: 'What to do about it is recorded.',
});

export const ONNE_LESSONS = Object.freeze([
  { id: 'ON-01', lesson_code: 'LL-ON-01', title: 'Dropped object during a crane lift', status: 'Published',
    ...FULL, author_id: 'u-musa', event_date: '2026-03-12', review_due: '2026-10-20',
    validated_at: '2026-04-02', validated_by: 'u-grace', source_type: 'Incident' },
  { id: 'ON-02', lesson_code: 'LL-ON-02', title: 'Hose failure during bunkering', status: 'Embedded',
    ...FULL, author_id: 'u-musa', event_date: '2026-01-20', review_due: '2026-09-20',
    validated_at: '2026-02-10', validated_by: 'u-grace', source_type: 'Incident' },
  { id: 'ON-03', lesson_code: 'LL-ON-03', title: 'Forklift reversing near miss', status: 'Published',
    ...FULL, author_id: 'u-amaka', event_date: '2026-06-05', review_due: '2026-10-31',
    validated_at: '2026-06-20', validated_by: 'u-musa', source_type: 'Near miss' },
  { id: 'ON-04', lesson_code: 'LL-ON-04', title: 'A turnaround with no lost time injury', status: 'Published',
    ...FULL, author_id: 'u-amaka', event_date: '2026-05-30', review_due: null,
    validated_at: '2026-06-15', validated_by: 'u-grace', source_type: 'Success' },
  { id: 'ON-05', lesson_code: 'LL-ON-05', title: 'Mooring line parted at the quay', status: 'Validated',
    ...FULL, author_id: 'u-musa', event_date: '2026-08-14', review_due: '2026-10-06',
    validated_at: '2026-09-01', validated_by: 'u-grace', source_type: 'Incident' },
  { id: 'ON-06', lesson_code: 'LL-ON-06', title: 'Permit to work signed off remotely', status: 'Submitted',
    description: 'What happened is recorded.', root_cause: 'Why it happened is recorded.', recommendation: '',
    author_id: 'u-ngozi', event_date: '2026-09-10', source_type: 'Audit finding' },
  { id: 'ON-07', lesson_code: 'LL-ON-07', title: 'Tank cleaning waste manifest', status: 'Draft',
    description: 'What happened is recorded.', root_cause: '', recommendation: '',
    author_id: 'u-amaka', event_date: '2026-09-25', source_type: 'Non-conformance' },
  { id: 'ON-08', lesson_code: 'LL-ON-08', title: 'Old gangway inspection routine', status: 'Archived',
    ...FULL, author_id: 'u-musa', event_date: '2025-02-01', archive_reason: 'Gangway replaced; the routine no longer applies.',
    source_type: 'Operational experience' },
  { id: 'ON-09', lesson_code: 'LL-ON-09', title: 'Lifting plan template, first issue', status: 'Superseded',
    ...FULL, author_id: 'u-grace', event_date: '2025-06-01', superseded_by: 'ON-01', source_type: 'Project close-out' },
  { id: 'ON-10', lesson_code: 'LL-ON-10', title: 'Night-time vessel transfer lighting', status: 'Published',
    ...FULL, author_id: 'u-grace', event_date: '2026-07-01', review_due: '2026-11-01',
    validated_at: '2026-07-20', validated_by: 'u-amaka', source_type: 'Operational experience' },
]);

export const ONNE_APPLICATIONS = Object.freeze([
  { id: 'AA-01', lesson_id: 'ON-01', target_type: 'Risk register', target_risk_id: 'OB-07', outcome: 'Adopted', applied_on: '2026-05-02' },
  { id: 'AA-02', lesson_id: 'ON-01', target_type: 'Procedure', reference: 'Lifting procedure rev 4', outcome: 'Adapted', applied_on: '2026-07-14' },
  { id: 'AA-03', lesson_id: 'ON-01', target_type: 'Training', reference: 'Banksman course', outcome: 'Rejected', notes: 'Already covered by the current course.', applied_on: '2026-08-01' },
  { id: 'AA-04', lesson_id: 'ON-02', target_type: 'Management of change', target_moc_id: 'ES-06', outcome: 'Adopted', applied_on: '2026-06-10' },
  { id: 'AA-05', lesson_id: 'ON-03', target_type: 'Procedure', reference: 'Yard traffic plan', outcome: 'Rejected', notes: 'The yard layout is being redesigned.', applied_on: '2026-07-01' },
  { id: 'AA-06', lesson_id: 'ON-10', target_type: 'Maintenance plan', reference: 'Quay lighting PM', outcome: 'Adopted', applied_on: '2026-08-20' },
]);

/** Application probes for canRecordApplication: [label, application]. */
export const APPLICATION_PROBES = Object.freeze([
  ['a risk register target with the risk named', { target_type: 'Risk register', target_risk_id: 'OB-07', outcome: 'Adopted' }],
  ['a risk register target with no risk named', { target_type: 'Risk register', outcome: 'Adopted' }],
  ['a change register target with no change named', { target_type: 'Management of change', outcome: 'Adapted' }],
  ['a procedure with no reference', { target_type: 'Procedure', outcome: 'Adopted' }],
  ['a rejection with no reason', { target_type: 'Training', reference: 'Banksman course', outcome: 'Rejected' }],
  ['a rejection with its reason', { target_type: 'Training', reference: 'Banksman course', outcome: 'Rejected', notes: 'Already covered.' }],
  ['no target type', { outcome: 'Adopted' }],
  ['an outcome the register does not know', { target_type: 'Procedure', reference: 'Yard traffic plan', outcome: 'Noted' }],
]);

/** Review-date sweep for a Published lesson: days from AS_OF to review_due. */
export const LESSON_REVIEW_SWEEP = Object.freeze([-1, 0, 1, 29, 30, 31]);
