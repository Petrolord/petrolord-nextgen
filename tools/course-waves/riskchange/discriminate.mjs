// THE DISCRIMINATE SWEEP: for each of the eighteen graded fields, does a
// plausible WRONG ROUTE actually move it past its tolerance? A field no error
// moves grades nothing, whatever its prompt claims it tests.
//
// Every wrong route is computed by THE ENGINE ITSELF on a mistaken reading of
// the records (the population a learner forgets to filter, the status a
// learner reads as resolved, the axis a learner zeroes, the lead a learner
// counts exclusively), or is the day-count slip the calendar most invites. No
// route restates a rule: where the mistake is a different rule, the route
// feeds the engine the records that rule would see.
//
// It prints, for every field, how many wrong routes move it, which do not, and
// THE CLOSEST MISS IN TOLERANCES, and refuses with fewer than three routes a
// field.
import fs from 'fs';

// The clock trap, as in the dump and the capstone: every route below hands
// the engines the as-of date or a stated one, and a call that fell back to
// the machine clock stops the sweep.
const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...a) {
    if (a.length === 0) throw new Error('CLOCK READ: new Date() with no argument in discriminate');
    super(...a);
  }

  static now() { throw new Error('CLOCK READ: Date.now() in discriminate'); }
};
const {
  AS_OF, IGBARA_LIVE, IGBARA_RISKS, OKOMU_MOCS, OKOMU_APPROVALS, OKOMU_ACTIONS,
  ETIM_REVIEW, ETIM_COMMENTS, ETIM_LESSON, ETIM_APPLICATIONS, ETIM_LESSONS,
} = await import('/root/as-wip-riskchange/riskchange_fields_capstone.mjs');

const ROOT = process.env.RC_ENGINES || '/root/wt-as-riskchange-nextgen/packages/engines';
const E = (m) => import(`${ROOT}/engines/assurance/${m}.js`);
const CAL = await E('calendar');
const R = await E('riskScoring');
const M = await E('managementOfChange');
const P = await E('peerReview');
const L = await E('lessonsLearned');
const FIELDS = process.env.RC_FIELDS || '/root/as-wip-riskchange/fields.json';
const fields = Object.fromEntries(JSON.parse(fs.readFileSync(FIELDS, 'utf8')).map((f) => [f[1], f]));
const T = AS_OF;
const shiftDate = (s, k) => {
  const [y, m, d] = s.split('-').map(Number);
  return CAL.toDateOnlyString(new Date(y, m - 1, d + k));
};
const ymd = (s) => Number(String(s).replace(/-/g, ''));

/* ---- the right answers, recomputed here exactly as the generator does ---- */
const ig = (id) => IGBARA_RISKS.find((r) => r.id === id);
const live = IGBARA_RISKS.filter((r) => IGBARA_LIVE.includes(r.status));
const notAssessedAsZero = (r) => ({ ...r,
  residual_likelihood: r.residual_likelihood === null || r.residual_likelihood === '' ? 0 : r.residual_likelihood,
  residual_impact: r.residual_impact === null || r.residual_impact === '' ? 0 : r.residual_impact });
const okApprovals = (id) => OKOMU_APPROVALS.filter((a) => a.moc_id === id);
const ok01 = OKOMU_MOCS.find((m) => m.id === 'OK-01');
const okSum = (mocs, actions = OKOMU_ACTIONS, today = T()) => M.summarise(mocs, { actions, approvals: OKOMU_APPROVALS }, today);
const inEffect = (m) => M.IN_EFFECT_STAGES.includes(m.stage);
const finished = new Set(OKOMU_MOCS.filter((m) => M.TERMINAL_STAGES.includes(m.stage)).map((m) => m.id));
const etSum = (comments) => P.summarise([ETIM_REVIEW], comments, T());
const asStatus = (from, to) => ETIM_COMMENTS.map((c) => (c.status === from ? { ...c, status: to } : c));
const soon = (lessons, today = T()) => L.summarise({ lessons, applications: ETIM_APPLICATIONS }, today).reviewsDueSoon;

const TRUTH = {
  igbara_i03_inherent_score: R.deriveRiskFields(ig('IG-03')).inherentScore,
  igbara_i03_residual_score: R.deriveRiskFields(ig('IG-03')).residualScore,
  igbara_live_residual_critical: R.countByBand(live, { residual: true }).Critical,
  igbara_live_inherent_high: R.countByBand(live).High,
  igbara_i06_days_to_review: CAL.daysUntil(ig('IG-06').next_review_date, T()),
  igbara_i12_days_to_review: CAL.daysUntil(ig('IG-12').next_review_date, T()),
  okomu_ok01_ratify_due_yyyymmdd: ymd(M.ratificationState(ok01, okApprovals('OK-01'), T()).dueDate),
  okomu_register_expiring_soon: okSum(OKOMU_MOCS).expiringSoon,
  okomu_register_expired: okSum(OKOMU_MOCS).expired,
  okomu_register_open_actions: okSum(OKOMU_MOCS).openActions,
  okomu_register_overdue_actions: okSum(OKOMU_MOCS).overdueActions,
  okomu_register_ratification_overdue: okSum(OKOMU_MOCS).ratificationOverdue,
  etim_review_blocking: P.canClose(ETIM_COMMENTS).blocking.length,
  etim_review_open_comments: etSum(ETIM_COMMENTS).openComments,
  etim_lesson_applied: L.reuseRecord(ETIM_APPLICATIONS).applied,
  etim_lesson_last_applied_yyyymmdd: ymd(L.reuseRecord(ETIM_APPLICATIONS).lastAppliedOn),
  etim_lesson_age_days: L.lessonAgeDays(ETIM_LESSON, T()),
  etim_register_reviews_due_soon: soon(ETIM_LESSONS),
};

/* ---- the wrong routes ---- */
const r3 = ig('IG-03');
const dueFrom = (dateStr, days) => ymd(shiftDate(dateStr, days));
const WRONG = {
  igbara_i03_inherent_score: {
    residual_reported_as_inherent: R.calculateResidualScore(r3),
    levels_added_not_multiplied: r3.likelihood + r3.impact,
    larger_level_alone: Math.max(r3.likelihood, r3.impact),
  },
  igbara_i03_residual_score: {
    blank_axis_read_as_zero: R.calculateRiskScore(r3.residual_likelihood, 0),
    inherent_used_for_residual: R.calculateRiskScore(r3.likelihood, r3.impact),
    blank_axis_read_as_level_one: R.calculateRiskScore(r3.residual_likelihood, 1),
    both_axes_fall_back_together: R.calculateRiskScore(r3.likelihood, r3.impact),
  },
  igbara_live_residual_critical: {
    whole_register_counted: R.countByBand(IGBARA_RISKS, { residual: true }).Critical,
    inherent_counted_instead: R.countByBand(live).Critical,
    unassessed_residual_read_as_zero: R.countByBand(live.map(notAssessedAsZero), { residual: true }).Critical,
    fifteen_read_as_high: live.filter((r) => R.calculateResidualScore(r) > 15).length,
  },
  igbara_live_inherent_high: {
    whole_register_counted: R.countByBand(IGBARA_RISKS).High,
    residual_counted_instead: R.countByBand(live, { residual: true }).High,
    ten_read_as_medium: live.filter((r) => { const s = R.calculateRiskScore(r.likelihood, r.impact); return s > 10 && s < 15; }).length,
  },
  igbara_i06_days_to_review: {
    both_ends_counted: CAL.daysUntil(ig('IG-06').next_review_date, T()) + 1,
    a_thirty_day_october: CAL.daysUntil(ig('IG-06').next_review_date, T()) - 1,
    sign_reversed: -CAL.daysUntil(ig('IG-06').next_review_date, T()),
  },
  igbara_i12_days_to_review: {
    sign_dropped: Math.abs(CAL.daysUntil(ig('IG-12').next_review_date, T())),
    both_ends_counted: CAL.daysUntil(ig('IG-12').next_review_date, T()) - 1,
    a_thirty_one_day_september: CAL.daysUntil(ig('IG-12').next_review_date, T()) - 1,
    one_end_dropped: CAL.daysUntil(ig('IG-12').next_review_date, T()) + 1,
  },
  okomu_ok01_ratify_due_yyyymmdd: {
    counted_from_the_first_approval: dueFrom(okApprovals('OK-01')[0].decided_on, M.EMERGENCY_RATIFY_DAYS),
    implementation_day_counted_as_day_one: dueFrom(ok01.actual_implementation_date, M.EMERGENCY_RATIFY_DAYS - 1),
    counted_from_the_as_of_date: dueFrom('2026-10-01', M.EMERGENCY_RATIFY_DAYS),
    fourteen_day_expiry_lead_used: dueFrom(ok01.actual_implementation_date, M.EXPIRY_LEAD_DAYS),
  },
  okomu_register_expiring_soon: {
    lead_counted_exclusively: OKOMU_MOCS.filter((m) => M.expiryState(m, T()) === M.EXPIRY.EXPIRING
      && CAL.daysUntil(m.expiry_date, T()) < M.EXPIRY_LEAD_DAYS).length,
    changes_not_in_effect_counted: OKOMU_MOCS.filter((m) => M.EXPIRING_TYPES.includes(m.type)
      && m.stage !== 'Closed' && M.expiryState({ ...m, stage: 'Implementation' }, T()) === M.EXPIRY.EXPIRING).length,
    expiry_today_read_as_expired: OKOMU_MOCS.filter((m) => M.expiryState(m, T()) === M.EXPIRY.EXPIRING
      && CAL.daysUntil(m.expiry_date, T()) > 0).length,
    emergency_changes_left_out: okSum(OKOMU_MOCS.filter((m) => m.type !== 'Emergency')).expiringSoon,
  },
  okomu_register_expired: {
    every_past_expiry_date_counted: OKOMU_MOCS.filter((m) => m.expiry_date && CAL.daysUntil(m.expiry_date, T()) < 0).length,
    emergency_changes_left_out: okSum(OKOMU_MOCS.filter((m) => m.type !== 'Emergency')).expired,
    expiry_today_read_as_expired: OKOMU_MOCS.filter((m) => inEffect(m) && m.stage !== 'Closed'
      && M.EXPIRING_TYPES.includes(m.type) && CAL.daysUntil(m.expiry_date, T()) <= 0).length,
    closed_out_changes_counted: okSum(OKOMU_MOCS.map((m) => (m.stage === 'Closed' ? { ...m, stage: 'Implementation' } : m))).expired,
  },
  okomu_register_open_actions: {
    actions_on_finished_changes_counted: okSum(OKOMU_MOCS.map((m) => ({ ...m, id: `${m.id}-x` }))).openActions,
    in_progress_read_as_done: okSum(OKOMU_MOCS, OKOMU_ACTIONS.filter((a) => a.status !== 'In progress')).openActions,
    unknown_change_left_out: okSum(OKOMU_MOCS, OKOMU_ACTIONS.filter((a) => OKOMU_MOCS.some((m) => m.id === a.moc_id))).openActions,
    every_action_counted: OKOMU_ACTIONS.length,
  },
  okomu_register_overdue_actions: {
    actions_on_finished_changes_counted: okSum(OKOMU_MOCS.map((m) => ({ ...m, id: `${m.id}-x` }))).overdueActions,
    due_today_counted: okSum(OKOMU_MOCS, OKOMU_ACTIONS, new Date(2026, 9, 2)).overdueActions,
    finished_actions_counted: OKOMU_ACTIONS.filter((a) => !finished.has(a.moc_id)
      && CAL.daysUntil(a.due_date, T()) < 0).length,
    unknown_change_left_out: okSum(OKOMU_MOCS, OKOMU_ACTIONS.filter((a) => OKOMU_MOCS.some((m) => m.id === a.moc_id))).overdueActions,
  },
  okomu_register_ratification_overdue: {
    no_implementation_date_read_as_pending: OKOMU_MOCS.filter((m) => {
      const s = M.ratificationState(m, okApprovals(m.id), T());
      return s.state === M.RATIFICATION.OVERDUE && s.dueDate !== null;
    }).length,
    the_seventh_day_counted_late: OKOMU_MOCS.filter((m) => {
      const s = M.ratificationState(m, okApprovals(m.id), T());
      return s.state === M.RATIFICATION.OVERDUE
        || (s.state === M.RATIFICATION.PENDING && CAL.daysUntil(s.dueDate, T()) <= 0);
    }).length,
    level_one_taken_as_enough: OKOMU_MOCS.filter((m) => {
      const s = M.ratificationState(m, okApprovals(m.id).filter((a) => a.level === 1), T());
      return s.state === M.RATIFICATION.OVERDUE;
    }).length,
  },
  etim_review_blocking: {
    responded_read_as_resolved: P.canClose(asStatus('Responded', 'Verified')).blocking.length,
    rejected_read_as_resolved: P.canClose(asStatus('Rejected', 'Closed')).blocking.length,
    every_unresolved_comment_blocks: etSum(ETIM_COMMENTS).openComments,
    verified_read_as_unresolved: P.canClose(asStatus('Verified', 'Responded')).blocking.length,
  },
  etim_review_open_comments: {
    rejected_read_as_resolved: etSum(asStatus('Rejected', 'Closed')).openComments,
    responded_read_as_resolved: etSum(asStatus('Responded', 'Verified')).openComments,
    only_blocking_counted: etSum(ETIM_COMMENTS).blockingComments,
    unrated_comment_left_out: etSum(ETIM_COMMENTS.filter((c) => c.severity)).openComments,
    verified_read_as_open: etSum(asStatus('Verified', 'Responded')).openComments,
  },
  etim_lesson_applied: {
    rejections_counted: L.reuseRecord(ETIM_APPLICATIONS).total,
    adopted_only: L.reuseRecord(ETIM_APPLICATIONS).adopted,
    adapted_only: L.reuseRecord(ETIM_APPLICATIONS).adapted,
  },
  etim_lesson_last_applied_yyyymmdd: {
    rejections_counted: ymd([...ETIM_APPLICATIONS].map((a) => a.applied_on).sort().pop()),
    adopted_only: ymd(L.reuseRecord(ETIM_APPLICATIONS.filter((a) => a.outcome !== 'Adapted')).lastAppliedOn),
    earliest_taken: ymd(ETIM_APPLICATIONS.filter((a) => L.didChangeSomething(a)).map((a) => a.applied_on).sort()[0]),
  },
  etim_lesson_age_days: {
    both_ends_counted: L.lessonAgeDays(ETIM_LESSON, T()) + 1,
    from_the_record_creation: L.lessonAgeDays({ ...ETIM_LESSON, event_date: null }, T()),
    from_the_validation: L.lessonAgeDays({ ...ETIM_LESSON, event_date: ETIM_LESSON.validated_at }, T()),
    sign_reversed: -L.lessonAgeDays(ETIM_LESSON, T()),
  },
  etim_register_reviews_due_soon: {
    lead_counted_exclusively: ETIM_LESSONS.filter((l) => L.isReviewDueSoon(l, T())
      && CAL.daysUntil(l.review_due, T()) < L.REVIEW_LEAD_DAYS).length,
    due_today_left_out: ETIM_LESSONS.filter((l) => L.isReviewDueSoon(l, T())
      && CAL.daysUntil(l.review_due, T()) > 0).length,
    lessons_not_visible_counted: soon(ETIM_LESSONS.map((l) => ({ ...l, status: 'Published' }))),
    overdue_reviews_counted: ETIM_LESSONS.filter((l) => L.isReviewDueSoon(l, T()) || L.isReviewOverdue(l, T())).length,
  },
};

if (process.env.RC_NEGATIVE === 'blind') {
  // Negative control: a planted route that gives the right answer must be BLIND.
  WRONG.igbara_i03_inherent_score.planted_right_answer = TRUTH.igbara_i03_inherent_score;
}
let weak = 0; let routes = 0; let closest = { ratio: Infinity, key: null };
console.log('field                                  routes  moved  blind    closest miss, in tolerances');
for (const [key, truth] of Object.entries(TRUTH)) {
  if (!fields[key]) { console.log(`  REFUSES: ${key} is not in fields.json`); process.exit(2); }
  const tol = fields[key][3];
  if (fields[key][2] !== truth) {
    console.log(`  REFUSES: ${key} in fields.json is ${fields[key][2]} and this sweep computes ${truth}`);
    process.exit(2);
  }
  const wrong = WRONG[key] || {};
  const blind = []; let nearest = Infinity;
  for (const [name, got] of Object.entries(wrong)) {
    routes += 1;
    if (!Number.isFinite(got)) { blind.push(`${name} (not a number: ${got})`); continue; }
    const d = Math.abs(got - truth);
    if (d <= tol) blind.push(`${name} (gives ${got})`);
    else nearest = Math.min(nearest, d / tol);
  }
  const n = Object.keys(wrong).length;
  if (blind.length || n < 3) weak += 1;
  if (nearest < closest.ratio) closest = { ratio: nearest, key };
  console.log(`${key.padEnd(38)} ${String(n).padStart(6)} ${String(n - blind.length).padStart(6)} ${String(blind.length).padStart(6)}    ${nearest.toPrecision(3)} x tol`);
  blind.forEach((b) => console.log(`    BLIND ${b}`));
}
console.log(`\ndiscriminate: ${Object.keys(TRUTH).length} graded fields, ${routes} wrong routes swept, ${weak} WEAK field(s)`);
console.log(`the closest miss anywhere in the eighteen: ${closest.key} at ${closest.ratio.toPrecision(3)} tolerances`);
if (Object.keys(TRUTH).length !== 18) { console.log('  REFUSES: the sweep must cover all eighteen fields'); process.exit(2); }
if (routes < 18 * 3) { console.log('  GATE REFUSES: fewer than three wrong routes a field is not a sweep'); process.exit(2); }
process.exit(weak ? 1 : 0);
