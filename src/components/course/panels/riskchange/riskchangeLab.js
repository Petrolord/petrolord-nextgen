// Teaching lab for AS-RC, Risk, Change & Learning. The three explorer panels,
// the course learning page and the vitest files all read this one module, so a
// status shown to a learner and a status a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every score, band,
// appetite verdict, day count, stage move, approval state, expiry state,
// ratification state, closure verdict, reuse record, review status and summary
// count below is a return value of engines/assurance: riskScoring,
// managementOfChange, peerReview, lessonsLearned and the calendar.js they share,
// vendored sha-identical with engines 9d5d3b4 (ASC-0).
//
// NOTHING IN THIS FILE DECIDES A STATE. Where a reader carries a value the
// teaching digest calls "derived", it is the digest's own arithmetic on numbers
// the engine returned (inherent minus residual), and the key name says Derived.
// The lab and tools/course-waves/riskchange/digest.txt agree because both call
// the engines on the same records, and neither copied the other.
//
// EVERY REFUSAL IS THE ENGINE'S OWN RETURNED SENTENCE. A probe hands back
// { label, ok, reason }, where the reason is the string on the engine's `reason`
// key (or, for a comment move, the sentence explainRefusal returns). No refusal
// sentence is written as a literal anywhere in this directory, and
// riskchangeLab.test.js asserts that over the lab and over every panel source.
//
// THE CLOCK. Every one of these engines defaults its date argument to the
// machine clock. This lab NEVER lets one: every call that takes a date is handed
// AS_OF(), the wave's as-of date of 1 October 2026 built at LOCAL midnight from
// its three parts, and every date a panel moves is an offset in whole days from
// that as-of date, turned into a calendar date here by the engine's own
// toDateOnlyString. A panel holds no date at all. The clock gate in
// riskchangeLab.test.js renders the whole lab and all three panels under two
// faked system dates and requires byte-identical output, and a second gate
// rebuilds the lab in a child process at UTC minus eleven.
//
// TOLERANCES HAVE ONE SOURCE AND IT IS NOT THIS FILE. Every graded field of this
// wave is a whole number graded at 0.5, fields.json carries that, and this lab
// neither reads nor restates it. The lab names no graded field and no capstone
// record, and panelCapstoneGuard.test.js sweeps this directory and the learning
// page for every graded answer in every rendering.
//
// REPAIR HISTORY. The digest's last section is its one framed history section, and this
// lab carries no history reader at all: every value here is what the engines do
// NOW, on the ASC-0 repair. The engine source is dense with repair notes, and
// none of them is quoted here.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised, and
// every reader returns fresh objects, so a panel that mutates a result cannot
// change the next call.

// Namespaces rather than named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which may predate the
// assurance family this lab reads. Vite and vitest alias @petrolord/engines to
// this worktree's packages/engines. import/namespace is off for this file only,
// and riskchangeLab.test.js proves every member it uses resolves.
/* eslint-disable import/namespace */
import * as CAL from '@petrolord/engines/engines/assurance/calendar.js';
import * as RS from '@petrolord/engines/engines/assurance/riskScoring.js';
import * as MOC from '@petrolord/engines/engines/assurance/managementOfChange.js';
import * as PR from '@petrolord/engines/engines/assurance/peerReview.js';
import * as LL from '@petrolord/engines/engines/assurance/lessonsLearned.js';

/** The five engine modules, for the census and for the test's own controls. */
export const ENGINES = {
  calendar: CAL, riskScoring: RS, managementOfChange: MOC, peerReview: PR, lessonsLearned: LL,
};

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from
// tools/course-waves/riskchange/riskchange_fields.mjs, which riskchange_dump.mjs
// imports. riskchangeLab.test.js requires this whole block to appear in this file
// byte for byte AND compares every export's value with the wave file's, so
// these cannot be edited here alone.
//
// FOUR TEACHING RECORD SETS AND THEY SHARE NOTHING WITH THE CAPSTONE. The
// capstone runs its own records, written in the wave's capstone generator, and
// nothing in this lab imports, reads or reproduces any of it.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Printing, in the digest's own conventions, so a panel prints what a lesson
// prints. The digest header is the authority: statuses, bands and verdicts in
// double quotes exactly as the engine spells them, dates as YYYY-MM-DD, and a
// missing value as null.
// ---------------------------------------------------------------------------

/** A status, band or verdict, quoted the way the digest quotes it. */
export const q = (s) => (s === null || s === undefined ? 'null' : `"${s}"`);
/** A tri-state the digest prints as a word. */
export const yn = (b) => (b === true ? 'yes' : (b === false ? 'no' : 'none'));
/** A list, or the word the digest prints for an empty one. */
export const lst = (a) => (Array.isArray(a) && a.length ? a.join(', ') : 'none');
/** A date or a count that may be missing. */
export const orNull = (v) => (v === null || v === undefined ? 'null' : String(v));
/** An input value exactly as the digest prints the value it was given. */
export const given = (v) => (v === undefined ? 'absent' : JSON.stringify(v));

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them decides a state.
// ---------------------------------------------------------------------------

/** The as-of date, every time an engine asks for one. Never the clock. */
const T = () => AS_OF();

/**
 * A calendar date a whole number of days from the as-of date, as the engine's
 * own calendar prints it. The Date is built from the as-of date's three parts
 * with the offset added to the day, which the platform rolls into the right
 * month, and the engine turns it into YYYY-MM-DD at local midnight.
 */
const shift = (days) => CAL.toDateOnlyString(
  new Date(AS_OF_PARTS[0], AS_OF_PARTS[1] - 1, AS_OF_PARTS[2] + days),
);

const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, k) => lo + k);
const clone = (x) => JSON.parse(JSON.stringify(x));

/**
 * A verdict as the digest reports one: the label of the state, whether the
 * engine allowed it, and the ENGINE'S OWN reason when it did not. A verdict the
 * engine allowed carries a reason of null.
 */
const verdictOf = (label, r) => ({
  label,
  ok: Boolean(r && r.ok === true),
  reason: r && r.ok === false && typeof r.reason === 'string' ? r.reason : null,
});

/** A comment move, asked of explainRefusal, which returns the sentence or null. */
const explained = (label, sentence) => ({
  label, ok: sentence === null, reason: typeof sentence === 'string' ? sentence : null,
});

const byId = (rows, id) => rows.find((r) => r.id === id);

// ---------------------------------------------------------------------------
// The census: what each module exports, measured by loading it.
// ---------------------------------------------------------------------------

export const engineCensus = () => Object.entries(ENGINES).map(([module, ns]) => {
  const keys = Object.keys(ns);
  const functions = keys.filter((k) => typeof ns[k] === 'function').length;
  return {
    module, exports: keys.length, functions, constants: keys.length - functions,
  };
});

// ===========================================================================
// ASSOCIATE: the risk register. rc-risk-explorer.
// ===========================================================================

/** The scale, the four bands with their LOWER edges, and the live statuses. */
export const riskScale = () => ({
  scaleMin: RS.SCALE_MIN,
  scaleMax: RS.SCALE_MAX,
  bands: RS.RISK_BANDS.map((b) => ({ band: b.band, lowerEdge: b.min, upperAsWritten: b.max })),
  bandNames: [...RS.RISK_BAND_NAMES],
  noBand: RS.NO_BAND,
  liveStatuses: [...RS.RISK_LIVE_STATUSES],
  notLiveStatuses: [...RS.RISK_NOT_LIVE_STATUSES],
  appetiteAnswers: Object.values(RS.APPETITE),
});

/**
 * All twenty five cells, likelihood down the side from the top level and impact
 * across, each the engine's score and band. The scores no cell can reach are
 * counted from the grid itself rather than listed.
 */
export const riskMatrix = () => {
  const levels = range(RS.SCALE_MIN, RS.SCALE_MAX);
  const rows = [...levels].reverse().map((l) => ({
    likelihood: l,
    cells: levels.map((i) => {
      const score = RS.calculateRiskScore(l, i);
      return { impact: i, score, band: RS.getRiskBand(score) };
    }),
  }));
  const cells = rows.flatMap((r) => r.cells);
  const bandCellCounts = Object.fromEntries(RS.RISK_BAND_NAMES
    .map((b) => [b, cells.filter((c) => c.band === b).length]));
  const distinctScores = [...new Set(cells.map((c) => c.score))].sort((a, b) => a - b);
  const top = RS.SCALE_MAX * RS.SCALE_MAX;
  const unreachable = range(RS.SCALE_MIN, top).filter((s) => !distinctScores.includes(s));
  // Every whole score from the lowest cell to the top one, each banded by the
  // engine, with the band's lower edge and the scores no cell holds marked.
  const edges = RS.RISK_BANDS.map((b) => b.min);
  const strip = range(RS.SCALE_MIN, top).map((score) => ({
    score, band: RS.getRiskBand(score), lowerEdge: edges.includes(score), unreachable: unreachable.includes(score),
  }));
  return {
    impacts: levels, rows, bandCellCounts, distinctScores, unreachable, top, strip,
  };
};

/** Scores read against the bands, including the edge either side of each band. */
export const bandProbes = () => BAND_PROBES.map((score) => ({ score, band: RS.getRiskBand(score) }));

/** What the scale accepts as a level. */
export const levelProbes = () => LEVEL_PROBES.map(([likelihood, impact, what]) => {
  const score = RS.calculateRiskScore(likelihood, impact);
  return {
    what, likelihood, impact, score, band: RS.getRiskBand(score),
  };
});

/** The residual probes of the per-axis fallback, on one inherent 4 by 5 risk. */
export const residualProbes = () => RESIDUAL_PROBES.map(([label, r]) => {
  const score = RS.calculateResidualScore(r);
  return {
    label,
    residualLikelihood: r.residual_likelihood,
    residualImpact: r.residual_impact,
    score,
    band: RS.getRiskBand(score),
  };
});

export const appetiteProbes = () => APPETITE_PROBES.map(([label, r]) => ({
  label,
  residual: RS.calculateResidualScore(r),
  target: r.target_score,
  appetite: RS.getAppetiteStatus(r),
}));

/** The inherent risk the residual explorer works on: the residual probes' own. */
const RESIDUAL_BASE = RESIDUAL_PROBES[0][1];

/**
 * What an axis input IS, asked of the engine rather than decided here: a blank
 * is "not assessed", and anything else is a level exactly when the engine will
 * score it against the lowest level of the other axis.
 */
const axisKind = (v) => {
  if (v === '' || v === null || v === undefined) return 'blank';
  return RS.calculateRiskScore(v, RS.SCALE_MIN) > 0 ? 'level' : 'off the scale';
};

/**
 * The choices a residual axis offers: blank, every level on the scale, and the
 * two off-scale values the residual probes carry (a fraction and a level above
 * the top), each labelled by what the engine makes of it.
 */
export const residualInputChoices = () => {
  const offScale = [...new Set(RESIDUAL_PROBES
    .flatMap(([, r]) => [r.residual_likelihood, r.residual_impact])
    .filter((v) => typeof v === 'number' && axisKind(v) === 'off the scale'))];
  return [
    { value: '', label: 'blank: not assessed' },
    ...range(RS.SCALE_MIN, RS.SCALE_MAX).map((l) => ({ value: String(l), label: `level ${l}` })),
    ...offScale.map((v) => ({ value: String(v), label: `${v}, off the scale` })),
  ];
};

/** The targets the appetite switch offers: none, zero and every score a cell holds. */
export const targetChoices = () => [
  { value: '', label: 'no target' },
  { value: '0', label: 'a target of 0' },
  ...riskMatrix().distinctScores.map((s) => ({ value: String(s), label: `target ${s}` })),
];

const choiceToInput = (c) => (c === '' || c === null || c === undefined ? '' : Number(c));

/**
 * The residual explorer: two residual inputs and a target on the base risk. The
 * blank falls back to the inherent level on its own axis; the off-scale value
 * leaves the whole residual unscored. Both answers are the engine's.
 */
export const residualAt = (likelihoodChoice, impactChoice, targetChoice) => {
  const risk = {
    ...RESIDUAL_BASE,
    residual_likelihood: choiceToInput(likelihoodChoice),
    residual_impact: choiceToInput(impactChoice),
    target_score: targetChoice === '' || targetChoice === null || targetChoice === undefined
      ? null : Number(targetChoice),
  };
  const d = RS.deriveRiskFields(risk);
  const axis = (name, inherent, value) => {
    const kind = axisKind(value);
    return {
      axis: name, given: value, kind, inherentLevel: inherent, fallsBack: kind === 'blank',
    };
  };
  return {
    inherentLikelihood: RESIDUAL_BASE.likelihood,
    inherentImpact: RESIDUAL_BASE.impact,
    inherentScore: d.inherentScore,
    inherentBand: d.inherentBand,
    residualScore: d.residualScore,
    residualBand: d.residualBand,
    unscored: d.residualScore === 0,
    target: risk.target_score,
    appetite: d.appetite_status,
    appetiteNotSet: d.appetite_status === RS.APPETITE.NOT_SET,
    axes: [
      axis('likelihood', RESIDUAL_BASE.likelihood, risk.residual_likelihood),
      axis('impact', RESIDUAL_BASE.impact, risk.residual_impact),
    ],
  };
};

/** Whole days from the as-of date, for the calendar probes. */
export const calendarProbes = () => CALENDAR_PROBES.map(([label, d]) => ({
  label, given: d, parsed: CAL.toDateOnlyString(d), days: CAL.daysUntil(d, T()),
}));

const isLiveRisk = (r) => RS.RISK_LIVE_STATUSES.includes(r.status);

/** The OBODO register, every risk derived once, with its review read on the as-of date. */
export const obodoRegister = () => OBODO_RISKS.map((r) => {
  const d = RS.deriveRiskFields(r);
  const live = isLiveRisk(r);
  return {
    id: r.id,
    title: r.title,
    status: r.status,
    live,
    likelihood: r.likelihood,
    impact: r.impact,
    inherentScore: d.inherentScore,
    inherentBand: d.inherentBand,
    residualLikelihood: r.residual_likelihood,
    residualImpact: r.residual_impact,
    residualScore: d.residualScore,
    residualBand: d.residualBand,
    rating: d.rating,
    target: r.target_score,
    appetite: d.appetite_status,
    nextReview: r.next_review_date,
    daysUntil: CAL.daysUntil(r.next_review_date, T()),
    reviewOverdue: RS.isReviewOverdue(r, T()),
    // Derived: the two engine scores subtracted, printed for live risks only.
    reductionDerived: live ? d.inherentScore - d.residualScore : null,
  };
});

export const POPULATION_CHOICES = [['all', 'every risk'], ['live', 'live risks']];
export const SCORE_CHOICES = [['inherent', 'inherent'], ['residual', 'residual']];

/**
 * countByBand over one population and one score. The engine counts whatever list
 * it is handed, so the two switches are the caller's choices and nothing else.
 */
export const registerCount = (population, score) => {
  const rows = population === 'live' ? OBODO_RISKS.filter(isLiveRisk) : OBODO_RISKS;
  const counts = score === 'residual' ? RS.countByBand(rows, { residual: true }) : RS.countByBand(rows);
  const bands = [...RS.RISK_BAND_NAMES, RS.NO_BAND];
  const popLabel = (POPULATION_CHOICES.find(([k]) => k === population) || POPULATION_CHOICES[0])[1];
  const scoreLabel = score === 'residual' ? 'residual' : 'inherent';
  return {
    label: `${popLabel}, ${scoreLabel}`,
    population: population === 'live' ? 'live' : 'all',
    score: scoreLabel,
    handed: rows.length,
    counts: bands.map((band) => ({ band, count: counts[band] })),
    critical: counts.Critical,
  };
};

/** The four populations of the same register, and the Critical count of each. */
export const registerPopulations = () => {
  const rows = [
    registerCount('all', 'inherent'), registerCount('all', 'residual'),
    registerCount('live', 'inherent'), registerCount('live', 'residual'),
  ];
  return {
    risks: OBODO_RISKS.length,
    live: OBODO_RISKS.filter(isLiveRisk).length,
    rows,
    criticalCounts: rows.map((r) => r.critical),
    distinctCritical: new Set(rows.map((r) => r.critical)).size,
  };
};

/** The Associate reading: the OBODO register on the as-of date in one object. */
export const associateReading = () => {
  const reg = obodoRegister();
  const live = reg.filter((r) => r.live);
  const ids = (pred) => live.filter(pred).map((r) => r.id);
  const m = riskMatrix();
  return {
    asOfIso: AS_OF_ISO,
    risks: reg.length,
    live: live.length,
    above: ids((r) => r.appetite === RS.APPETITE.ABOVE),
    within: ids((r) => r.appetite === RS.APPETITE.WITHIN),
    notSet: ids((r) => r.appetite === RS.APPETITE.NOT_SET),
    reviewOverdue: ids((r) => r.reviewOverdue),
    criticalCounts: registerPopulations().criticalCounts,
    bandCellCounts: m.bandCellCounts,
    distinctScores: m.distinctScores.length,
    unreachable: m.unreachable.length,
  };
};

// ===========================================================================
// PROFESSIONAL: management of change. rc-change-explorer.
// ===========================================================================

const ES01 = byId(ESANMI_MOCS, 'ES-01');
const ES02 = byId(ESANMI_MOCS, 'ES-02');
const approvalsOf = (id) => ESANMI_APPROVALS.filter((a) => a.moc_id === id);
const actionsOf = (id) => ESANMI_ACTIONS.filter((a) => a.moc_id === id);
/** ES-01's own approval levels, every one signed. */
const signedAll = () => approvalsOf('ES-01').map((a) => ({ level: a.level, status: 'Approved' }));
/** An emergency change's first level signed and the next one pending. */
const signedFirst = () => {
  const levels = approvalsOf('ES-04').map((a) => a.level);
  return levels.map((level, k) => ({ level, status: k === 0 ? 'Approved' : 'Pending' }));
};

export const stageTable = () => ({
  stages: [...MOC.STAGES],
  active: [...MOC.ACTIVE_STAGES],
  inEffect: [...MOC.IN_EFFECT_STAGES],
  terminal: [...MOC.TERMINAL_STAGES],
  types: [...MOC.CHANGE_TYPES],
  expiringTypes: [...MOC.EXPIRING_TYPES],
  transitions: MOC.STAGES.map((from) => ({ from, next: [...MOC.nextStages(from)] })),
  intoImplementation: MOC.STAGES.filter((s) => MOC.nextStages(s).includes('Implementation')),
  leadNowhere: MOC.STAGES.filter((s) => MOC.nextStages(s).length === 0),
});

/**
 * Every move from one stage, asked of the engine. The change is a Permanent one
 * with every approval level signed and no action open, so a legal move is
 * allowed and every other move shows the engine's refusal sentence. The legal
 * moves come first, in the engine's own order.
 */
export const stageMovesFrom = (stage) => [
  ...MOC.nextStages(stage),
  ...MOC.STAGES.filter((to) => to !== stage && !MOC.nextStages(stage).includes(to)),
].map((to) => ({
  to,
  legal: MOC.nextStages(stage).includes(to),
  ...verdictOf(`${stage} to ${to}`,
    MOC.canAdvance({ stage, type: 'Permanent' }, to, { approvals: signedAll(), actions: [] })),
}));

/** The digest's own stage probes, asked with no approvals and no actions. */
export const stageProbes = () => [
  ['Review straight to Closed', { stage: 'Review' }, 'Closed'],
  ['Draft straight to Approval', { stage: 'Draft' }, 'Approval'],
  ['Implementation back to Approval', { stage: 'Implementation' }, 'Approval'],
  ['a Closed change moved anywhere', { stage: 'Closed' }, 'Implementation'],
  ['a Rejected change moved anywhere', { stage: 'Rejected' }, 'Review'],
  ['Draft to Screening', { stage: 'Draft' }, 'Screening'],
].map(([label, moc, to]) => verdictOf(label, MOC.canAdvance(moc, to, { approvals: [], actions: [] })));

export const approvalSets = () => APPROVAL_SETS.map(([label, rows]) => {
  const s = MOC.approvalState(rows);
  return {
    label,
    levels: s.levels,
    outstanding: s.outstanding,
    rejectedRows: s.rejected.length,
    complete: s.complete,
  };
});

/** The people on ES-01: its originator and the three people its approvals name. */
export const approvalPeople = () => {
  const approvers = [...new Set(approvalsOf('ES-01').map((a) => a.approver_id))];
  return [
    { id: ES01.originator_id, label: `${ES01.originator_id}, the originator` },
    ...approvers.map((id) => ({ id, label: id })),
    { id: '', label: 'nobody signed in' },
  ];
};

/** The workbench's starting rows: ES-01's own approvals, as the register holds them. */
export const approvalStart = () => clone(approvalsOf('ES-01'));

/**
 * Levels, outstanding and complete for a set of approval rows, and what the gate
 * into Implementation says of ES-01 with those rows and its actions finished.
 */
export const approvalView = (rows) => {
  const list = Array.isArray(rows) ? rows : [];
  const s = MOC.approvalState(list);
  const finished = actionsOf('ES-01').map((a) => ({ ...a, status: 'Complete' }));
  return {
    moc: { id: ES01.id, title: ES01.title, originator: ES01.originator_id },
    rows: list.map((a) => ({
      id: a.id, level: a.level ?? null, status: a.status, approver: a.approver_id,
    })),
    levels: s.levels,
    outstanding: s.outstanding,
    rejectedRows: s.rejected.length,
    complete: s.complete,
    gate: verdictOf('ES-01 into Implementation with these approvals and its actions finished',
      MOC.canAdvance(ES01, 'Implementation', { approvals: list, actions: finished })),
  };
};

const DECISION_STATUS = { sign: 'Approved', reject: 'Rejected', delegate: 'Delegated' };
export const DECISIONS = [['sign', 'sign'], ['reject', 'reject'], ['delegate', 'delegate']];

/**
 * One person deciding one approval row. canDecideApproval is asked first, with
 * the person acting, and a refusal changes nothing. Delegating is a decision the
 * assignee makes like the other two, and the engine reads a Delegated row as
 * unsigned.
 */
export const decideApproval = (rows, index, decision, actingAs) => {
  const list = clone(Array.isArray(rows) ? rows : []);
  const row = list[index];
  if (!row || !DECISION_STATUS[decision]) {
    return { ...verdictOf('no such approval', { ok: false }), rows: list };
  }
  const who = actingAs || null;
  const v = MOC.canDecideApproval(row, ES01, who);
  const label = `${who || 'nobody signed in'} deciding the level ${row.level ?? 1} approval assigned to ${row.approver_id}`;
  if (!v.ok) return { ...verdictOf(label, v), rows: list };
  list[index] = { ...row, status: DECISION_STATUS[decision] };
  return { ...verdictOf(label, v), rows: list };
};

/**
 * Add a level above the highest one present, assigned to one person. The engine
 * decides whether that person may approve this change at all.
 */
export const addApprovalLevel = (rows, approverId) => {
  const list = clone(Array.isArray(rows) ? rows : []);
  const v = MOC.canAssignApprover(ES01, approverId || null);
  const label = `assigning ${approverId || 'nobody'} as a new approval level`;
  if (!v.ok) return { ...verdictOf(label, v), rows: list };
  const top = list.reduce((m, a) => Math.max(m, a.level ?? 1), 0);
  list.push({
    id: `AP-new-${list.length}`, moc_id: ES01.id, level: top + 1, status: 'Pending', approver_id: approverId,
  });
  return { ...verdictOf(label, v), rows: list };
};

/** Section 9, segregation of duties, each verdict the engine's. */
export const segregationProbes = () => {
  const pending = { ...byId(approvalsOf('ES-01'), 'AP-02') };
  return [
    verdictOf('assigning the originator as an approver', MOC.canAssignApprover(ES01, ES01.originator_id)),
    verdictOf('assigning nobody', MOC.canAssignApprover(ES01, null)),
    verdictOf('assigning u-halima, who is independent of the change', MOC.canAssignApprover(ES01, 'u-halima')),
    verdictOf('u-emeka deciding the approval assigned to u-emeka', MOC.canDecideApproval(pending, ES01, 'u-emeka')),
    verdictOf('u-halima deciding an approval assigned to u-emeka', MOC.canDecideApproval(pending, ES01, 'u-halima')),
    verdictOf('nobody signed in', MOC.canDecideApproval(pending, ES01, null)),
    verdictOf('the originator deciding an approval somebody assigned to them',
      MOC.canDecideApproval({ ...pending, approver_id: ES01.originator_id }, ES01, ES01.originator_id)),
    verdictOf('deciding an approval that is already Approved',
      MOC.canDecideApproval({ ...pending, status: 'Approved' }, ES01, 'u-emeka')),
    verdictOf('deciding an approval that is already Rejected',
      MOC.canDecideApproval({ ...pending, status: 'Rejected' }, ES01, 'u-emeka')),
  ];
};

/** Section 10, the two gates, each verdict the engine's. */
export const gateProbes = () => {
  const signed = signedAll();
  const finished = actionsOf('ES-01').map((a) => ({ ...a, status: 'Complete' }));
  const readable = shift(91);
  return [
    verdictOf('ES-01 into Implementation as it stands, levels 2 and 3 unsigned',
      MOC.canAdvance(ES01, 'Implementation', { approvals: approvalsOf('ES-01'), actions: actionsOf('ES-01') })),
    verdictOf('ES-01 into Implementation with every level signed and one Pre-implementation action still Open',
      MOC.canAdvance(ES01, 'Implementation', { approvals: signed, actions: actionsOf('ES-01') })),
    verdictOf('ES-01 into Implementation with every level signed and its actions finished',
      MOC.canAdvance(ES01, 'Implementation', { approvals: signed, actions: finished })),
    verdictOf('a change with no approval rows at all',
      MOC.canAdvance(ES01, 'Implementation', { approvals: [], actions: [] })),
    verdictOf('a change with every level signed and one rejection',
      MOC.canAdvance(ES01, 'Implementation', { approvals: [...signed, { level: signed[1].level, status: 'Rejected' }], actions: [] })),
    verdictOf('a Temporary change whose expiry reads "after the turnaround"',
      MOC.canAdvance({ stage: 'Approval', type: 'Temporary', expiry_date: CALENDAR_PROBES[10][1] }, 'Implementation', { approvals: signed, actions: [] })),
    verdictOf('a Temporary change with no expiry date',
      MOC.canAdvance({ stage: 'Approval', type: 'Temporary' }, 'Implementation', { approvals: signed, actions: [] })),
    verdictOf('a Temporary change with a readable expiry and every level signed',
      MOC.canAdvance({ stage: 'Approval', type: 'Temporary', expiry_date: readable }, 'Implementation', { approvals: signed, actions: [] })),
    verdictOf('ES-02 into Closed with its Post-implementation action In progress',
      MOC.canAdvance(ES02, 'Closed', { approvals: approvalsOf('ES-02'), actions: actionsOf('ES-02') })),
    verdictOf('ES-02 into Closed once that action is Complete',
      MOC.canAdvance(ES02, 'Closed', { approvals: approvalsOf('ES-02'), actions: actionsOf('ES-02').map((a) => ({ ...a, status: 'Complete' })) })),
    verdictOf('ES-02 into Cancelled, which no action blocks',
      MOC.canAdvance(ES02, 'Cancelled', { approvals: approvalsOf('ES-02'), actions: actionsOf('ES-02') })),
  ];
};

/**
 * Which action types block each gate, asked of the engine one open action at a
 * time on a Permanent change with every level signed.
 */
export const gateBlockers = () => [['Implementation', 'Approval'], ['Closed', 'Implementation']]
  .map(([gate, from]) => ({
    gate,
    from,
    rows: MOC.ACTION_TYPES.map((actionType) => {
      const v = MOC.canAdvance({ stage: from, type: 'Permanent' }, gate, {
        approvals: signedAll(), actions: [{ action_type: actionType, status: MOC.ACTION_STATUSES[0] }],
      });
      return { actionType, blocks: v.ok !== true, ...verdictOf(`one ${actionType} action open at the gate into ${gate}`, v) };
    }),
  }));

/** The expiry states and the lead, as the engine carries them. */
export const expiryRules = () => ({
  states: Object.values(MOC.EXPIRY),
  leadDays: MOC.EXPIRY_LEAD_DAYS,
  ratifyDays: MOC.EMERGENCY_RATIFY_DAYS,
  ratificationStates: Object.values(MOC.RATIFICATION),
});

/** The expiry timeline's reach, from the first to the last day of the digest's sweep. */
export const EXPIRY_OFFSETS = range(Math.min(...EXPIRY_DAY_SWEEP), Math.max(...EXPIRY_DAY_SWEEP));

/** One Temporary change in Implementation whose expiry sits `offset` days from the as-of date. */
export const expiryAt = (offset) => {
  const moc = { type: 'Temporary', stage: 'Implementation', expiry_date: shift(offset) };
  const state = MOC.expiryState(moc, T());
  return {
    offset,
    expiryDate: moc.expiry_date,
    days: CAL.daysUntil(moc.expiry_date, T()),
    state,
    countedExpired: MOC.isExpired(moc, T()),
  };
};

export const expirySweep = () => EXPIRY_DAY_SWEEP.map(expiryAt);
export const expiryTimeline = () => EXPIRY_OFFSETS.map(expiryAt);

/** The lead band, MEASURED off the timeline: the first and last day reading "Expiring soon". */
export const expiryLead = () => {
  const soon = expiryTimeline().filter((r) => r.state === MOC.EXPIRY.EXPIRING).map((r) => r.offset);
  return {
    leadDays: MOC.EXPIRY_LEAD_DAYS, first: Math.min(...soon), last: Math.max(...soon), days: soon.length, state: MOC.EXPIRY.EXPIRING,
  };
};

/** The same expiry one day past, across types and stages. */
export const expiryAcrossTypes = () => {
  const past = shift(-1);
  const rows = [['Temporary', 'Implementation'], ['Emergency', 'Implementation'], ['Temporary', 'Closed'],
    ['Temporary', 'Review'], ['Temporary', 'Screening'], ['Temporary', 'Cancelled'], ['Permanent', 'Implementation']]
    .map(([type, stage]) => {
      const m = { type, stage, expiry_date: past };
      return {
        type, stage, state: MOC.expiryState(m, T()), countedExpired: MOC.isExpired(m, T()),
      };
    });
  return {
    expiryDate: past,
    rows,
    unreadable: MOC.expiryState({ type: 'Temporary', stage: 'Implementation', expiry_date: CALENDAR_PROBES[10][1] }, T()),
  };
};

/** The ratification timeline's reach, from the first to the last day of the digest's sweep. */
export const RATIFY_OFFSETS = range(Math.min(...RATIFY_DAY_SWEEP), Math.max(...RATIFY_DAY_SWEEP));

/** One Emergency change in Implementation, level 2 unsigned, implemented `daysSince` days before the as-of date. */
export const ratificationAt = (daysSince) => {
  const went = shift(-daysSince);
  const r = MOC.ratificationState({ type: 'Emergency', stage: 'Implementation', actual_implementation_date: went }, signedFirst(), T());
  return {
    daysSince,
    implementedOn: went,
    dueDate: r.dueDate,
    daysToDue: r.dueDate === null ? null : CAL.daysUntil(r.dueDate, T()),
    state: r.state,
    outstanding: r.outstanding,
  };
};

export const ratificationSweep = () => RATIFY_DAY_SWEEP.map(ratificationAt);
export const ratificationTimeline = () => RATIFY_OFFSETS.map(ratificationAt);

/** The window MEASURED off the timeline: the last day inside it and the first day outside it. */
export const ratificationWindow = () => {
  const rows = ratificationTimeline();
  const inside = rows.filter((r) => r.state === MOC.RATIFICATION.PENDING).map((r) => r.daysSince);
  const outside = rows.filter((r) => r.state === MOC.RATIFICATION.OVERDUE).map((r) => r.daysSince);
  return { ratifyDays: MOC.EMERGENCY_RATIFY_DAYS, lastInside: Math.max(...inside), firstOutside: Math.min(...outside) };
};

/** The emergency route's gate probes and its three other ratification answers. */
export const ratificationCases = () => {
  const s1 = signedFirst();
  const readable = shift(91);
  const allSigned = s1.map((a) => ({ ...a, status: 'Approved' }));
  const none = MOC.ratificationState({ type: 'Emergency', stage: 'Implementation' }, s1, T());
  return {
    probes: [
      verdictOf('an Emergency change in Approval into Implementation with level 1 signed and level 2 pending',
        MOC.canAdvance({ stage: 'Approval', type: 'Emergency', expiry_date: readable }, 'Implementation', { approvals: s1, actions: [] })),
      verdictOf('the same change with level 1 unsigned',
        MOC.canAdvance({ stage: 'Approval', type: 'Emergency', expiry_date: readable }, 'Implementation', { approvals: s1.map((a) => ({ ...a, status: 'Pending' })), actions: [] })),
      verdictOf('a Permanent change with level 1 signed and level 2 pending',
        MOC.canAdvance({ stage: 'Approval', type: 'Permanent' }, 'Implementation', { approvals: s1, actions: [] })),
      verdictOf('an Emergency change in Implementation into Closed with level 2 still unsigned',
        MOC.canAdvance({ stage: 'Implementation', type: 'Emergency' }, 'Closed', { approvals: s1, actions: [] })),
    ],
    noDate: { dueDate: none.dueDate, state: none.state },
    allSigned: MOC.ratificationState({ type: 'Emergency', stage: 'Implementation', actual_implementation_date: shift(-30) }, allSigned, T()).state,
    temporary: MOC.ratificationState({ type: 'Temporary', stage: 'Implementation', actual_implementation_date: shift(-30) }, s1, T()).state,
  };
};

/** The ESANMI register on the as-of date. */
export const esanmiRegister = () => ESANMI_MOCS.map((m) => {
  const r = MOC.ratificationState(m, approvalsOf(m.id), T());
  return {
    id: m.id,
    title: m.title,
    type: m.type,
    stage: m.stage,
    target: m.target_implementation_date,
    expiry: m.expiry_date ?? null,
    expiryState: MOC.expiryState(m, T()),
    overdue: MOC.isOverdue(m, T()),
    ratification: r.state,
    due: r.dueDate,
  };
});

export const esanmiActions = () => ESANMI_ACTIONS.map((a) => ({
  id: a.id, change: a.moc_id, type: a.action_type, status: a.status, due: a.due_date,
}));

export const SUMMARY_KEYS = ['total', 'active', 'awaitingApproval', 'expired', 'expiringSoon', 'overdue',
  'openActions', 'overdueActions', 'ratificationPending', 'ratificationOverdue'];

export const esanmiSummary = () => {
  const s = MOC.summarise(ESANMI_MOCS, { actions: ESANMI_ACTIONS, approvals: ESANMI_APPROVALS }, T());
  return {
    counts: SUMMARY_KEYS.map((key) => ({ key, value: s[key] })),
    byStage: MOC.STAGES.map((stage) => ({ stage, count: s.byStage[stage] })),
    byRisk: MOC.RISK_LEVELS.map((level) => ({ level, count: s.byRisk[level] })),
    urgency: [...ESANMI_MOCS].sort(MOC.byUrgency(T())).map((m) => m.id),
  };
};

export const professionalReading = () => {
  const s = esanmiSummary();
  const reg = esanmiRegister();
  const count = (key) => s.counts.find((c) => c.key === key).value;
  return {
    asOfIso: AS_OF_ISO,
    changes: count('total'),
    active: count('active'),
    expired: reg.filter((r) => r.expiryState === MOC.EXPIRY.EXPIRED).map((r) => r.id),
    expiringSoon: reg.filter((r) => r.expiryState === MOC.EXPIRY.EXPIRING).map((r) => r.id),
    overdue: reg.filter((r) => r.overdue).map((r) => r.id),
    ratificationOverdue: reg.filter((r) => r.ratification === MOC.RATIFICATION.OVERDUE).map((r) => r.id),
    openActions: count('openActions'),
    leadDays: MOC.EXPIRY_LEAD_DAYS,
    ratifyDays: MOC.EMERGENCY_RATIFY_DAYS,
    urgencyFirst: s.urgency[0],
  };
};

// ===========================================================================
// EXPERT: peer review and lessons learned. rc-review-explorer.
// ===========================================================================

const IK01 = byId(IKANG_REVIEWS, 'IK-01');
/** The independent reviewer: the Lead Reviewer the participant probes name who is not the author. */
const INDEPENDENT = IKANG_PARTICIPANTS
  .map(([, p]) => p).find((p) => p.user_id && p.user_id !== IK01.author_id && p.role === 'Lead Reviewer').user_id;
const EXTERNAL = IKANG_PARTICIPANTS.map(([, p]) => p).find((p) => !p.user_id && p.display_name).display_name;
const A_RESPONSE = 'A response.';

export const commentRules = () => {
  const statuses = PR.COMMENT_STATUSES;
  let legal = 0;
  statuses.forEach((f) => statuses.forEach((t) => { if (PR.canTransition(f, t)) legal += 1; }));
  return {
    stages: [...PR.STAGES],
    activeStages: [...PR.ACTIVE_STAGES],
    severities: [...PR.SEVERITIES],
    blockingSeverities: [...PR.BLOCKING_SEVERITIES],
    statuses: [...statuses],
    resolved: [...PR.RESOLVED_STATUSES],
    transitions: statuses.map((from) => ({
      from, moves: PR.nextStatuses(from).map((to) => ({ to, actor: PR.TRANSITION_ACTOR[to] })),
    })),
    pairs: statuses.length * statuses.length,
    legalPairs: legal,
  };
};

/** Every disposition asked for every move, each refusal the engine's sentence. */
export const commentMoveGrid = () => {
  const statuses = PR.COMMENT_STATUSES;
  const grid = statuses.flatMap((from) => statuses.map((to) => explained(`${from} to ${to}`,
    PR.explainRefusal({ status: from, response_text: A_RESPONSE }, to))));
  return [
    ...grid,
    explained('Responded to Verified with no response text on the comment',
      PR.explainRefusal({ status: 'Responded', response_text: '  ' }, 'Verified')),
    explained('a comment with no status, which reads as Open, moved to Closed', PR.explainRefusal({}, 'Closed')),
  ];
};

/** Who the comment panel can act as: the author, an independent reviewer, nobody. */
export const reviewActors = () => [
  { id: IK01.author_id, label: `${IK01.author_id}, the author of the work` },
  { id: INDEPENDENT, label: `${INDEPENDENT}, a reviewer independent of the work` },
  { id: '', label: 'nobody signed in' },
];

/** IK-01's comment log as the register holds it. */
export const commentLogStart = () => clone(IKANG_COMMENTS);

/**
 * The log's state: each comment resolved or blocking, the closure verdict with
 * its blocking list, the counts, and the comments worst first.
 */
export const commentLogView = (comments) => {
  const list = Array.isArray(comments) ? comments : [];
  const cc = PR.canClose(list);
  const s = PR.summarise([IK01], list, T());
  return {
    review: {
      id: IK01.id, title: IK01.title, stage: IK01.stage, author: IK01.author_id,
    },
    rows: list.map((c) => ({
      id: c.id,
      severity: c.severity ?? null,
      status: c.status,
      resolved: PR.isResolved(c),
      blocking: PR.isBlocking(c),
      next: [...PR.nextStatuses(c.status || 'Open')],
    })),
    closure: verdictOf('closing IK-01 as it stands', cc),
    blocking: (cc.blocking || []).map((c) => c.id),
    totalComments: s.totalComments,
    openComments: s.openComments,
    blockingComments: s.blockingComments,
    byStatus: PR.COMMENT_STATUSES.map((status) => ({ status, count: s.byStatus[status] })),
    bySeverity: PR.SEVERITIES.map((severity) => ({ severity, count: s.bySeverity[severity] })),
    order: [...list].sort(PR.bySeverityThenAge).map((c) => c.id),
  };
};

/**
 * One person moving one comment. canActOnComment is asked, with the signed-in
 * person and the review, and a refusal changes nothing. A comment the author
 * responds to carries a response from then on, which is what makes it
 * verifiable.
 */
export const moveComment = (comments, id, to, actingAs) => {
  const list = clone(Array.isArray(comments) ? comments : []);
  const at = list.findIndex((c) => c.id === id);
  const who = actingAs || null;
  const label = `${who || 'nobody signed in'} moving ${id} to ${to}`;
  if (at === -1) return { ...verdictOf(label, { ok: false }), comments: list };
  const v = PR.canActOnComment(list[at], to, IK01, who);
  if (!v.ok) return { ...verdictOf(label, v), comments: list };
  const next = { ...list[at], status: to };
  if (to === 'Responded' && !String(next.response_text || '').trim()) next.response_text = A_RESPONSE;
  list[at] = next;
  return { ...verdictOf(label, v), comments: list };
};

/** Section 14's closure probe after the blocking comments are withdrawn. */
export const closureProbes = () => {
  const cc = PR.canClose(IKANG_COMMENTS);
  const after = IKANG_COMMENTS.map((c) => (cc.blocking.some((b) => b.id === c.id) ? { ...c, status: 'Withdrawn' } : c));
  return [
    verdictOf('closing IK-01 as it stands', cc),
    verdictOf('closing IK-01 once its blocking comments are withdrawn, with a Minor, an Editorial and an unrated comment still Open',
      PR.canClose(after)),
  ];
};

/** Section 14's acting-on-a-comment probes, each the verdict of canActOnComment. */
export const actOnCommentProbes = () => {
  const c = (id) => byId(IKANG_COMMENTS, id);
  const author = IK01.author_id;
  return [
    ['the author verifying C-03, a Responded comment on their own work', 'C-03', 'Verified', author],
    ['the author rejecting C-03', 'C-03', 'Rejected', author],
    ['the author withdrawing C-01, an Open comment', 'C-01', 'Withdrawn', author],
    [`${INDEPENDENT}, independent of the work, verifying C-03`, 'C-03', 'Verified', INDEPENDENT],
    ['the author responding to C-01', 'C-01', 'Responded', author],
    ['the author closing out C-02, a Verified comment', 'C-02', 'Closed', author],
    [`${INDEPENDENT} responding to C-02, which is already Verified`, 'C-02', 'Responded', INDEPENDENT],
    ['nobody signed in, verifying C-03', 'C-03', 'Verified', null],
  ].map(([label, id, to, who]) => verdictOf(label, PR.canActOnComment(c(id), to, IK01, who)));
};

/** Section 14's reviewer panel probes, each the verdict of canAssignPeerReviewer. */
export const participantProbes = () => IKANG_PARTICIPANTS
  .map(([label, p]) => verdictOf(label, PR.canAssignPeerReviewer(IK01, p)));

/** The people and roles the reviewer panel offers. */
export const reviewerPeople = () => [
  { key: 'author', label: `${IK01.author_id}, the author of the work` },
  { key: 'independent', label: `${INDEPENDENT}, independent of the work` },
  { key: 'external', label: `${EXTERNAL}, named only by display name` },
  { key: 'nobody', label: 'nobody named' },
];
export const reviewerRoles = () => [
  ...PR.REVIEWER_ROLES.map((r) => ({ value: r, label: r })),
  ...[...new Set(IKANG_PARTICIPANTS.map(([, p]) => p.role).filter((r) => r && !PR.REVIEWER_ROLES.includes(r)))]
    .map((r) => ({ value: r, label: r })),
  { value: '', label: 'no role given' },
];

/** Put one person on IK-01 in one role, and ask the engine. */
export const assignReviewer = (personKey, role) => {
  const p = {
    author: { user_id: IK01.author_id },
    independent: { user_id: INDEPENDENT },
    external: { display_name: EXTERNAL },
    nobody: {},
  }[personKey] || {};
  const participant = role ? { ...p, role } : { ...p };
  const who = reviewerPeople().find((x) => x.key === personKey);
  return {
    participant,
    ...verdictOf(`${who ? who.label : 'nobody named'}, as ${role || 'no role given'}`,
      PR.canAssignPeerReviewer(IK01, participant)),
  };
};

/** The IKANG review register on the as-of date. */
export const ikangReviews = () => {
  const s = PR.summarise(IKANG_REVIEWS, [], T());
  return {
    rows: IKANG_REVIEWS.map((r) => ({
      id: r.id, title: r.title, stage: r.stage, due: r.due_date, overdue: PR.isOverdue(r, T()),
    })),
    total: s.total,
    active: s.active,
    overdue: s.overdue,
    urgency: [...IKANG_REVIEWS].sort(PR.byUrgency(T())).map((r) => r.id),
  };
};

/**
 * The whole register summarised with IK-04 at a stage the reader chooses. As the
 * register holds it IK-04 is Cancelled, and its two comments stay in the total
 * and leave the open and blocking counts; move it back to a live stage and they
 * count again.
 */
export const registerSummaryAt = (ik04Stage) => {
  const stage = PR.STAGES.includes(ik04Stage) ? ik04Stage : byId(IKANG_REVIEWS, 'IK-04').stage;
  const reviews = IKANG_REVIEWS.map((r) => (r.id === 'IK-04' ? { ...r, stage } : r));
  const all = [...IKANG_COMMENTS, ...IKANG_OTHER_COMMENTS];
  const s = PR.summarise(reviews, all, T());
  return {
    ik04Stage: stage,
    comments: all.length,
    totalComments: s.totalComments,
    openComments: s.openComments,
    blockingComments: s.blockingComments,
    bySeverity: PR.SEVERITIES.map((severity) => ({ severity, count: s.bySeverity[severity] })),
    others: IKANG_OTHER_COMMENTS.map((c) => ({
      id: c.id,
      review: c.review_id,
      reviewStage: byId(reviews, c.review_id).stage,
      severity: c.severity,
      status: c.status,
      blockingOnItsOwn: PR.isBlocking(c),
    })),
  };
};

export const registerSummary = () => registerSummaryAt(byId(IKANG_REVIEWS, 'IK-04').stage);

// --- Lessons ---------------------------------------------------------------

const lessonApps = (id) => ONNE_APPLICATIONS.filter((a) => a.lesson_id === id);

export const lessonRules = () => ({
  statuses: [...LL.LESSON_STATUSES],
  live: [...LL.LESSON_LIVE_STATUSES],
  accepted: [...LL.LESSON_ACCEPTED_STATUSES],
  visible: [...LL.LESSON_VISIBLE_STATUSES],
  targets: [...LL.TARGET_TYPES],
  suiteTargets: [...LL.SUITE_TARGET_TYPES],
  outcomes: [...LL.APPLICATION_OUTCOMES],
  embeddingOutcomes: [...LL.EMBEDDING_OUTCOMES],
  reviewLeadDays: LL.REVIEW_LEAD_DAYS,
  transitions: LL.LESSON_STATUSES.map((from) => ({ from, next: [...LL.nextLessonStatuses(from)] })),
});

export const lessonTable = () => ONNE_LESSONS.map((l) => ({
  id: l.id,
  title: l.title,
  status: l.status,
  substance: LL.hasSubstance(l),
  missing: LL.missingSubstance(l),
  accepted: LL.isAccepted(l),
  visible: LL.isVisible(l),
}));

/** Section 15, validation, each verdict the engine's. */
export const validationProbes = () => {
  const on01 = { ...byId(ONNE_LESSONS, 'ON-01'), status: 'Submitted' };
  const on05 = byId(ONNE_LESSONS, 'ON-05');
  const validator = on05.validated_by;
  return [
    verdictOf('its author validating it', LL.canValidate(on01, on01.author_id)),
    verdictOf('its author validating it while typing a colleague name as the validator',
      LL.canValidate(on01, on01.author_id, { validator_name: 'G. Okon' })),
    verdictOf(`${validator}, who did not write it, validating it`, LL.canValidate(on01, validator)),
    verdictOf(`${validator} recording an external reviewer by name`,
      LL.canValidate(on01, validator, { validator_name: 'An external reviewer' })),
    verdictOf(`ON-06, which has no recommendation, validated by ${validator}`,
      LL.canValidate(byId(ONNE_LESSONS, 'ON-06'), validator)),
    verdictOf('ON-05 moved to Published after its validation record is removed',
      LL.canAdvanceLesson({ ...on05, validated_at: null, validated_by: null }, 'Published', {})),
    verdictOf(`ON-05, validated by ${validator}, moved to Published`, LL.canAdvanceLesson(on05, 'Published', {})),
  ];
};

export const applicationLog = () => ONNE_APPLICATIONS.map((a) => ({
  id: a.id, lesson: a.lesson_id, target: a.target_type, outcome: a.outcome, appliedOn: a.applied_on,
}));

const reuseOf = (apps) => {
  const rr = LL.reuseRecord(apps);
  return {
    total: rr.total,
    applied: rr.applied,
    adopted: rr.adopted,
    adapted: rr.adapted,
    rejected: rr.rejected,
    lastAppliedOn: rr.lastAppliedOn,
    targets: rr.targets,
  };
};

/** The reuse record of each visible lesson. */
export const reuseRecords = () => ONNE_LESSONS.filter((l) => LL.isVisible(l))
  .map((l) => ({ id: l.id, title: l.title, ...reuseOf(lessonApps(l.id)) }));

/** Section 16, embedding, archiving and superseding, each verdict the engine's. */
export const embeddingProbes = () => {
  const on = (id) => byId(ONNE_LESSONS, id);
  return [
    verdictOf('ON-01 marked Embedded', LL.canAdvanceLesson(on('ON-01'), 'Embedded', { applications: lessonApps('ON-01') })),
    verdictOf('ON-03 marked Embedded, its one application a rejection',
      LL.canAdvanceLesson(on('ON-03'), 'Embedded', { applications: lessonApps('ON-03') })),
    verdictOf('ON-04 marked Embedded, with no application at all',
      LL.canAdvanceLesson(on('ON-04'), 'Embedded', { applications: lessonApps('ON-04') })),
    verdictOf('ON-10 archived with no reason', LL.canAdvanceLesson(on('ON-10'), 'Archived', { patch: {} })),
    verdictOf('ON-10 archived with a reason',
      LL.canAdvanceLesson(on('ON-10'), 'Archived', { patch: { archive_reason: 'The quay lighting was replaced.' } })),
    verdictOf('ON-10 superseded with no successor named', LL.canAdvanceLesson(on('ON-10'), 'Superseded', { patch: {} })),
    verdictOf('ON-10 superseded by itself',
      LL.canAdvanceLesson(on('ON-10'), 'Superseded', { patch: { superseded_by: 'ON-10' } })),
    verdictOf('a Draft lesson moved straight to Published', LL.canAdvanceLesson(on('ON-07'), 'Published', {})),
    verdictOf('an Archived lesson moved anywhere', LL.canAdvanceLesson(on('ON-08'), 'Published', {})),
  ];
};

/** What an application must carry, each verdict the engine's. */
export const applicationProbes = () => APPLICATION_PROBES
  .map(([label, a]) => verdictOf(label, LL.canRecordApplication(a)));

/** The visible lessons the application explorer can work on. */
export const visibleLessons = () => ONNE_LESSONS.filter((l) => LL.isVisible(l))
  .map((l) => ({ id: l.id, title: l.title, status: l.status }));

/**
 * An application as the explorer records it: the target and outcome the reader
 * picks, dated on the as-of date, carrying the key or reference and the reason
 * the engine asks for. The keys are the ones the ONNE log itself uses.
 */
const draftApplication = (lessonId, target, outcome) => {
  const risk = ONNE_APPLICATIONS.find((a) => a.target_risk_id);
  const moc = ONNE_APPLICATIONS.find((a) => a.target_moc_id);
  const a = {
    lesson_id: lessonId, target_type: target, outcome, applied_on: AS_OF_ISO,
  };
  if (target === risk.target_type) a.target_risk_id = risk.target_risk_id;
  else if (target === moc.target_type) a.target_moc_id = moc.target_moc_id;
  else a.reference = 'Recorded in the explorer';
  if (outcome === 'Rejected') a.notes = 'Recorded in the explorer with its reason.';
  return a;
};

/**
 * A lesson and its applications, the ONNE log's own plus any the reader added:
 * the reuse record, whether it may be marked Embedded, and whether it reads as
 * applied nowhere, all asked of the engine.
 */
export const lessonUse = (lessonId, added) => {
  const lesson = byId(ONNE_LESSONS, lessonId) || byId(ONNE_LESSONS, visibleLessons()[0].id);
  const extra = (Array.isArray(added) ? added : []).filter((a) => a && a.lesson_id === lesson.id);
  const apps = [...lessonApps(lesson.id), ...extra];
  return {
    lesson: { id: lesson.id, title: lesson.title, status: lesson.status },
    applications: apps.map((a, k) => ({
      id: a.id || `new ${k + 1 - lessonApps(lesson.id).length}`,
      target: a.target_type,
      outcome: a.outcome,
      appliedOn: a.applied_on,
      changedSomething: LL.didChangeSomething(a),
    })),
    reuse: reuseOf(apps),
    embed: verdictOf(`${lesson.id} marked Embedded`, LL.canEmbed(lesson, apps)),
    unapplied: LL.isUnapplied(lesson, apps),
  };
};

/** Record one more application on a lesson, if the engine accepts it. */
export const recordApplication = (lessonId, added, target, outcome) => {
  const list = clone(Array.isArray(added) ? added : []);
  const draft = draftApplication(lessonId, target, outcome);
  const v = LL.canRecordApplication(draft);
  const label = `an application of ${lessonId} into ${target || 'nothing'}, ${outcome || 'no outcome'}`;
  if (!v.ok) return { ...verdictOf(label, v), added: list };
  list.push(draft);
  return { ...verdictOf(label, v), added: list };
};

/** The lesson review timeline's reach: one lead before the as-of date to two after. */
export const LESSON_REVIEW_OFFSETS = range(-LL.REVIEW_LEAD_DAYS, LL.REVIEW_LEAD_DAYS * 2);

/** A lesson at a status whose review falls `offset` days from the as-of date. */
export const lessonReviewAt = (offset, status) => {
  const l = { status, review_due: shift(offset) };
  return {
    offset,
    status,
    reviewDue: l.review_due,
    days: CAL.daysUntil(l.review_due, T()),
    visible: LL.isVisible(l),
    overdue: LL.isReviewOverdue(l, T()),
    dueSoon: LL.isReviewDueSoon(l, T()),
  };
};

export const lessonReviewSweep = () => LESSON_REVIEW_SWEEP.map((k) => lessonReviewAt(k, 'Published'));
export const lessonReviewTimeline = () => LESSON_REVIEW_OFFSETS.map((k) => lessonReviewAt(k, 'Published'));

/** The lead MEASURED off the timeline: the first and last day reading due soon. */
export const lessonReviewLead = () => {
  const soon = lessonReviewTimeline().filter((r) => r.dueSoon).map((r) => r.offset);
  return { leadDays: LL.REVIEW_LEAD_DAYS, first: Math.min(...soon), last: Math.max(...soon), days: soon.length };
};

export const onneRegister = () => ONNE_LESSONS.map((l) => ({
  id: l.id,
  title: l.title,
  status: l.status,
  eventDate: l.event_date,
  ageDays: LL.lessonAgeDays(l, T()),
  reviewDue: l.review_due ?? null,
  overdue: LL.isReviewOverdue(l, T()),
  dueSoon: LL.isReviewDueSoon(l, T()),
  appliedNowhere: LL.isUnapplied(l, lessonApps(l.id)),
}));

export const LESSON_SUMMARY_KEYS = ['lessons', 'live', 'visible', 'awaitingValidation', 'drafts', 'applications',
  'applied', 'rejected', 'lessonsApplied', 'lessonsUnapplied', 'intoRiskRegister', 'intoMoc', 'reviewsOverdue',
  'reviewsDueSoon'];

export const onneSummary = () => {
  const s = LL.summarise({ lessons: ONNE_LESSONS, applications: ONNE_APPLICATIONS }, T());
  const byLesson = new Map();
  ONNE_APPLICATIONS.forEach((a) => {
    if (!byLesson.has(a.lesson_id)) byLesson.set(a.lesson_id, []);
    byLesson.get(a.lesson_id).push(a);
  });
  return {
    counts: LESSON_SUMMARY_KEYS.map((key) => ({ key, value: s[key] })),
    attention: [...ONNE_LESSONS].sort(LL.lessonByAttention(byLesson, T())).map((l) => l.id),
  };
};

export const expertReading = () => {
  const log = commentLogView(IKANG_COMMENTS);
  const reg = registerSummary();
  const lessons = onneSummary();
  const count = (key) => lessons.counts.find((c) => c.key === key).value;
  return {
    asOfIso: AS_OF_ISO,
    review: log.review.id,
    blocking: log.blocking,
    openComments: log.openComments,
    registerTotal: reg.totalComments,
    registerOpen: reg.openComments,
    registerBlocking: reg.blockingComments,
    legalPairs: commentRules().legalPairs,
    pairs: commentRules().pairs,
    lessons: count('lessons'),
    visible: count('visible'),
    lessonsApplied: count('lessonsApplied'),
    lessonsUnapplied: count('lessonsUnapplied'),
    reviewsOverdue: count('reviewsOverdue'),
    reviewsDueSoon: count('reviewsDueSoon'),
    attentionFirst: lessons.attention[0],
  };
};

// ---------------------------------------------------------------------------
// The census of every verdict this lab shows, for the refusal gate.
// ---------------------------------------------------------------------------

export const PROBE_READERS = [
  'stageProbes', 'segregationProbes', 'gateProbes', 'closureProbes', 'actOnCommentProbes',
  'participantProbes', 'validationProbes', 'embeddingProbes', 'applicationProbes',
];

export const verdictCensus = () => {
  const probes = [
    ...stageProbes(), ...segregationProbes(), ...gateProbes(), ...ratificationCases().probes,
    ...closureProbes(), ...actOnCommentProbes(), ...participantProbes(), ...validationProbes(),
    ...embeddingProbes(), ...applicationProbes(),
  ];
  return {
    probes,
    refused: probes.filter((p) => !p.ok).length,
    allowed: probes.filter((p) => p.ok).length,
    everyRefusalCarriesAReason: probes.every((p) => p.ok || typeof p.reason === 'string'),
  };
};

/** Every zero-argument reader, in one list, for the clock gate and the digest sweep. */
export const READERS = [
  'engineCensus', 'riskScale', 'riskMatrix', 'bandProbes', 'levelProbes', 'residualProbes', 'appetiteProbes',
  'residualInputChoices', 'targetChoices', 'calendarProbes', 'obodoRegister', 'registerPopulations',
  'associateReading', 'stageTable', 'stageProbes', 'approvalSets', 'approvalPeople', 'approvalStart',
  'segregationProbes', 'gateProbes', 'gateBlockers', 'expiryRules', 'expirySweep', 'expiryTimeline',
  'expiryLead', 'expiryAcrossTypes', 'ratificationSweep', 'ratificationTimeline', 'ratificationWindow',
  'ratificationCases', 'esanmiRegister', 'esanmiActions', 'esanmiSummary', 'professionalReading',
  'commentRules', 'commentMoveGrid', 'reviewActors', 'commentLogStart', 'closureProbes', 'actOnCommentProbes',
  'participantProbes', 'reviewerPeople', 'reviewerRoles', 'ikangReviews', 'registerSummary', 'lessonRules',
  'lessonTable', 'validationProbes', 'applicationLog', 'reuseRecords', 'embeddingProbes', 'applicationProbes',
  'visibleLessons', 'lessonReviewSweep', 'lessonReviewTimeline', 'lessonReviewLead', 'onneRegister',
  'onneSummary', 'expertReading', 'verdictCensus',
];
