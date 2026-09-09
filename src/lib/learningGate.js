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

/** The action for a row in "My enrollments" or "Your courses". */
export function enrollmentAction(enrollment, { isLearner = true, activation = null } = {}) {
  if (!enrollment) return null;
  const activated = !isLearner || !!(activation && activation.activated);
  if (enrollment.status === 'active') {
    return activated
      ? { kind: 'start', to: coursePath(enrollment.app_slug), label: 'Start course' }
      : { kind: 'activate', to: getStartedPath(coursePath(enrollment.app_slug)), label: 'Activate account' };
  }
  if (enrollment.status === 'pending') return { kind: 'pay', to: null, label: 'Complete payment' };
  return null;
}
