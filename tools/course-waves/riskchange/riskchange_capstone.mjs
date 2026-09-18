// THE RISKCHANGE CAPSTONE GENERATOR. Runs the three capstone record sets of
// riskchange_fields_capstone.mjs through the vendored engines and writes the
// eighteen graded fields, six a tier, with their tolerances, plus the call
// ledger oracle_bridge.py replays through the Python oracles.
//
// Nothing here is read by riskchange_dump.mjs and nothing here is quoted into
// a lesson: the digest and the capstone are two separate roads, and
// gate_capstone_leak.py sweeps both directions.
//
// Usage: node riskchange_capstone.mjs
//
// EVERY GRADED FIELD IS A RETURN VALUE OF AN ENGINE, taken off the object the
// engine returned, with one stated transformation: a date the engine returns
// as YYYY-MM-DD is graded as the integer YYYYMMDD, because the NextGen grader
// compares numbers only. It runs under the same two clock gates as the dump:
// every date-taking export is found by reading the engine source and must be
// handed the as-of date, and `new Date()` with no argument throws.
import fs from 'fs';
import {
  AS_OF, AS_OF_ISO, IGBARA_LIVE, IGBARA_RISKS,
  OKOMU_MOCS, OKOMU_APPROVALS, OKOMU_ACTIONS,
  ETIM_REVIEW, ETIM_COMMENTS, ETIM_LESSON, ETIM_APPLICATIONS, ETIM_LESSONS,
} from '/root/as-wip-riskchange/riskchange_fields_capstone.mjs';

const ROOT = process.env.RC_ENGINES || '/root/wt-as-riskchange-nextgen/packages/engines';
const WAVE = '/root/as-wip-riskchange';
const OUT = process.env.RC_FIELDS_OUT || `${WAVE}/fields.json`;
const PRECISION_OUT = process.env.RC_PRECISION_OUT || `${WAVE}/precision.json`;
const CALLS_OUT = process.env.RC_CAP_CALLS_OUT || `${WAVE}/capstone_calls.json`;

const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...a) {
    if (a.length === 0) throw new Error('CLOCK READ: new Date() with no argument in the capstone');
    super(...a);
  }

  static now() { throw new Error('CLOCK READ: Date.now() in the capstone'); }
};

const { normalise } = await import(`${ROOT}/__tests__/helpers/assuranceGoldens.js`);
const MODS = ['calendar', 'riskScoring', 'managementOfChange', 'peerReview', 'lessonsLearned'];
const RAW = {};
const dateArgOf = {};
const SIG = /export const (\w+) = (?:\(([\s\S]*?)\)|(\w+)) =>/g;
for (const m of MODS) {
  RAW[m] = await import(`${ROOT}/engines/assurance/${m}.js`);
  dateArgOf[m] = {};
  const src = fs.readFileSync(`${ROOT}/engines/assurance/${m}.js`, 'utf8');
  for (const hit of src.matchAll(SIG)) {
    const params = (hit[2] ?? hit[3] ?? '').replace(/\{[^{}]*\}/g, 'OBJ').split(',').map((p) => p.trim()).filter(Boolean);
    const at = params.findIndex((p) => /^(today|asOf)\s*=\s*new Date\(\)$/.test(p));
    if (at !== -1) dateArgOf[m][hit[1]] = at;
  }
}
const midnight = (d) => d instanceof RealDate && d.getHours() === 0 && d.getMinutes() === 0
  && d.getSeconds() === 0 && d.getMilliseconds() === 0;
const ledger = [];
const called = new Set();
const enc = (v) => (v === undefined ? { $undefined: true } : normalise(v, { keepProse: true }));
const call = (m, fn, ...args) => {
  const at = dateArgOf[m][fn];
  if (at !== undefined && (args.length <= at || !midnight(args[at]))) {
    throw new Error(`AS-OF GATE: ${m}.${fn} was called without the as-of date`);
  }
  const result = RAW[m][fn](...args);
  ledger.push({ m, fn, args: args.map(enc), result: enc(result) });
  called.add(`${m}.${fn}`);
  return result;
};
const T = AS_OF;
const ymd = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(`CAPSTONE REFUSES: ${s} is not a date the engine returned`);
  return Number(s.replace(/-/g, ''));
};

/* ------------------------------------------------------------------ *
 * ASSOCIATE: IGBARA.
 * ------------------------------------------------------------------ */
const ig = (id) => IGBARA_RISKS.find((r) => r.id === id);
const igLive = IGBARA_RISKS.filter((r) => IGBARA_LIVE.includes(r.status));
const igbara_i03_inherent_score = call('riskScoring', 'deriveRiskFields', ig('IG-03')).inherentScore;
const igbara_i03_residual_score = call('riskScoring', 'deriveRiskFields', ig('IG-03')).residualScore;
const igbara_live_residual_critical = call('riskScoring', 'countByBand', igLive, { residual: true }).Critical;
const igbara_live_inherent_high = call('riskScoring', 'countByBand', igLive).High;
const igbara_i06_days_to_review = call('calendar', 'daysUntil', ig('IG-06').next_review_date, T());
const igbara_i12_days_to_review = call('calendar', 'daysUntil', ig('IG-12').next_review_date, T());

/* ------------------------------------------------------------------ *
 * PROFESSIONAL: OKOMU.
 * ------------------------------------------------------------------ */
const ok01 = OKOMU_MOCS.find((m) => m.id === 'OK-01');
const rat = call('managementOfChange', 'ratificationState', ok01, OKOMU_APPROVALS.filter((a) => a.moc_id === 'OK-01'), T());
const okomu_ok01_ratify_due_yyyymmdd = ymd(rat.dueDate);
const okSum = call('managementOfChange', 'summarise', OKOMU_MOCS, { actions: OKOMU_ACTIONS, approvals: OKOMU_APPROVALS }, T());
const okomu_register_expiring_soon = okSum.expiringSoon;
const okomu_register_expired = okSum.expired;
const okomu_register_open_actions = okSum.openActions;
const okomu_register_overdue_actions = okSum.overdueActions;
const okomu_register_ratification_overdue = okSum.ratificationOverdue;

/* ------------------------------------------------------------------ *
 * EXPERT: ETIM.
 * ------------------------------------------------------------------ */
const etim_review_blocking = call('peerReview', 'canClose', ETIM_COMMENTS).blocking.length;
const etim_review_open_comments = call('peerReview', 'summarise', [ETIM_REVIEW], ETIM_COMMENTS, T()).openComments;
const reuse = call('lessonsLearned', 'reuseRecord', ETIM_APPLICATIONS);
const etim_lesson_applied = reuse.applied;
const etim_lesson_last_applied_yyyymmdd = ymd(reuse.lastAppliedOn);
const etim_lesson_age_days = call('lessonsLearned', 'lessonAgeDays', ETIM_LESSON, T());
const etim_register_reviews_due_soon = call('lessonsLearned', 'summarise',
  { lessons: ETIM_LESSONS, applications: ETIM_APPLICATIONS }, T()).reviewsDueSoon;

/* ------------------------------------------------------------------ *
 * THE HELD-ITEM NEUTRALISATIONS, ASSERTED.
 * ------------------------------------------------------------------ */
const HELD_CALLS = ['managementOfChange.isOverdue', 'riskScoring.isReviewOverdue', 'managementOfChange.byUrgency'];
for (const h of HELD_CALLS) {
  if (called.has(h)) throw new Error(`CAPSTONE REFUSES: ${h} is held (RECON.md) and a graded path called it`);
}
if (ETIM_COMMENTS.some((c) => c.review_id !== ETIM_REVIEW.id)) {
  throw new Error('CAPSTONE REFUSES: the ETIM comment log must be one review\'s own log (RC-4 is held)');
}

const FIELDS = [
  ['beginner', 'igbara_i03_inherent_score', igbara_i03_inherent_score],
  ['beginner', 'igbara_i03_residual_score', igbara_i03_residual_score],
  ['beginner', 'igbara_live_residual_critical', igbara_live_residual_critical],
  ['beginner', 'igbara_live_inherent_high', igbara_live_inherent_high],
  ['beginner', 'igbara_i06_days_to_review', igbara_i06_days_to_review],
  ['beginner', 'igbara_i12_days_to_review', igbara_i12_days_to_review],
  ['intermediate', 'okomu_ok01_ratify_due_yyyymmdd', okomu_ok01_ratify_due_yyyymmdd],
  ['intermediate', 'okomu_register_expiring_soon', okomu_register_expiring_soon],
  ['intermediate', 'okomu_register_expired', okomu_register_expired],
  ['intermediate', 'okomu_register_open_actions', okomu_register_open_actions],
  ['intermediate', 'okomu_register_overdue_actions', okomu_register_overdue_actions],
  ['intermediate', 'okomu_register_ratification_overdue', okomu_register_ratification_overdue],
  ['advanced', 'etim_review_blocking', etim_review_blocking],
  ['advanced', 'etim_review_open_comments', etim_review_open_comments],
  ['advanced', 'etim_lesson_applied', etim_lesson_applied],
  ['advanced', 'etim_lesson_last_applied_yyyymmdd', etim_lesson_last_applied_yyyymmdd],
  ['advanced', 'etim_lesson_age_days', etim_lesson_age_days],
  ['advanced', 'etim_register_reviews_due_soon', etim_register_reviews_due_soon],
];

/* THE ONE TOLERANCE, and why. Every field is a whole number, the grader
 * compares |answer - expected| <= tol over numerics, and a figure printed with
 * no decimals is exact to half a unit (gradeprecision.py's floor). 0.5 accepts
 * exactly the one integer a learner can type for it and no other. */
const TOL = 0.5;
for (const [, key, v] of FIELDS) {
  if (!Number.isInteger(v)) throw new Error(`CAPSTONE REFUSES: ${key} = ${v} is not a whole number`);
}
const values = FIELDS.map((f) => f[2]);
if (new Set(values).size !== values.length) {
  throw new Error(`CAPSTONE REFUSES: two graded fields share a value: ${values.join(', ')}`);
}
fs.writeFileSync(OUT, `${JSON.stringify(FIELDS.map(([t, k, v]) => [t, k, v, TOL]), null, 1)}\n`);
fs.writeFileSync(PRECISION_OUT, `${JSON.stringify({
  whole: { decimals: 0, match: `^(?:${FIELDS.map((f) => f[1]).sort().join('|')})$` },
}, null, 1)}\n`);
fs.writeFileSync(CALLS_OUT, `${JSON.stringify({ asOf: AS_OF_ISO, calls: ledger })}\n`);
for (const [t, k, v] of FIELDS) console.log(`${t.padEnd(13)} ${k.padEnd(38)} ${v}`);
console.log(`\n18 graded fields, tolerance ${TOL} each, ${ledger.length} engine calls ledgered for the oracle bridge`);
