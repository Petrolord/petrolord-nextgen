// Pure helpers behind the Learning Mode gate (2026-09-09, sponsored
// learners stuck at "Learning Mode locked"). The server decides access
// (academy_has_scope: an activated account AND a live entitlement); when it
// says no, this module names WHY for this course and what the one next
// step is, instead of a bare Enrol button that led nowhere for a learner
// whose seat a sponsor had already assigned.

export const DOOR_LABELS = Object.freeze({
  self: 'self-enrolment',
  campus: 'campus cohort enrolment',
  residency: 'residency enrolment',
  sponsored: 'employer-sponsored enrolment',
});

export const doorLabel = (door) => DOOR_LABELS[door] || 'enrolment';

/** The course page a learner starts in. */
export const coursePath = (appSlug) => `/dashboard/apps/${appSlug}`;

/** The deep course home for one tier of a course. */
export const courseTierPath = (appSlug, tier) => `/dashboard/apps/${appSlug}/course/${tier}`;

// Course tiers in ladder order (lowest first).
const TIER_ORDER = ['beginner', 'intermediate', 'advanced'];

/**
 * Every tier of `app` the viewer holds an ACTIVE enrolment for. A learner
 * who moves up keeps the lower tier's row active (certifying does not
 * close it), so one course can carry several active tiers at once
 * (2026-09-23: sponsored Intermediate learners were shown "not enrolled"
 * because the course page kept only one tier per course).
 */
export function activeTiers(enrollments, app) {
  const set = new Set();
  (Array.isArray(enrollments) ? enrollments : []).forEach((e) => {
    if (e && e.app_slug === app && e.status === 'active' && e.course_tier) set.add(e.course_tier);
  });
  return set;
}

/**
 * Which tier the course home shows. An explicit choice wins (the ?tier=
 * tab, then the /course/:tier link); otherwise the HIGHEST tier the
 * learner is enrolled in, since that is the one in progress; otherwise
 * the first tier with content. Only tiers in `tiers` (authored) count.
 */
export function pickCourseTier({ tiers = [], queryTier = null, pathTier = null, enrollments = [], app } = {}) {
  if (queryTier && tiers.includes(queryTier)) return queryTier;
  if (pathTier && tiers.includes(pathTier)) return pathTier;
  const enrolled = activeTiers(enrollments, app);
  const highest = [...TIER_ORDER].reverse().find((t) => enrolled.has(t) && tiers.includes(t));
  return highest || tiers[0] || null;
}

/** Get Started, returning to `next` (a dashboard path) once activated. */
export function getStartedPath(next) {
  return next && isDashboardPath(next)
    ? `/dashboard/get-started?next=${encodeURIComponent(next)}`
    : '/dashboard/get-started';
}

/** Only in-app dashboard paths may be used as a return target. */
export const isDashboardPath = (p) => typeof p === 'string' && /^\/dashboard(\/|$)/.test(p) && !p.startsWith('//');

/**
 * What the gate should say for one course.
 *   isLearner  - the viewer is gated by activation (admins and lecturers are not)
 *   activation - academy_activation_status() result, or null while unknown
 *   enrollments- the viewer's own academy_enrollments rows
 *   app        - the course slug
 * Returns { kind, door } with kind one of:
 *   activate            an active enrolment exists but the account is not activated
 *   stalled             enrolment active and account activated, yet no scope resolved
 *   pending             an enrolment is waiting for payment
 *   enrol_and_activate  no enrolment and the account is not activated
 *   enrol               no enrolment
 */
export function gateState({ isLearner = true, activation = null, enrollments = [], app } = {}) {
  const own = (Array.isArray(enrollments) ? enrollments : []).filter((e) => e && e.app_slug === app);
  const active = own.find((e) => e.status === 'active');
  const pending = own.find((e) => e.status === 'pending');
  const activated = !isLearner || !!(activation && activation.activated);
  if (active && !activated) return { kind: 'activate', door: active.door };
  if (active) return { kind: 'stalled', door: active.door };
  if (pending) return { kind: 'pending', door: pending.door };
  if (!activated) return { kind: 'enrol_and_activate', door: null };
  return { kind: 'enrol', door: null };
}

/**
 * The action for a row in "My enrollments" or "Your courses". `hasCourse`
 * (app, tier) says whether that tier has a deep course; when it does,
 * Start course opens that tier's course home rather than the app page
 * (which opens on its Beginner tab whatever tier was assigned).
 */
export function enrollmentAction(enrollment, { isLearner = true, activation = null, hasCourse = null } = {}) {
  if (!enrollment) return null;
  const activated = !isLearner || !!(activation && activation.activated);
  if (enrollment.status === 'active') {
    const { app_slug: app, course_tier: tier } = enrollment;
    const to = tier && typeof hasCourse === 'function' && hasCourse(app, tier)
      ? courseTierPath(app, tier)
      : coursePath(app);
    return activated
      ? { kind: 'start', to, label: 'Start course' }
      : { kind: 'activate', to: getStartedPath(to), label: 'Activate account' };
  }
  if (enrollment.status === 'pending') return { kind: 'pay', to: null, label: 'Complete payment' };
  return null;
}
