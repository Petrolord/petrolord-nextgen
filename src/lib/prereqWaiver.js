// Pure helpers for the prerequisite waiver and bonus-tier rules (owner
// decision 2026-09-08). The server (academy_prereq_waiver_status,
// academy_enforce_prereq, academy_sponsor_assign) owns the truth; these
// only shape what the RPCs return for the Enroll page and the sponsor
// console, so they are unit-testable without a browser.

/** True when `tier` of an academy_apps row is a bonus tier (no seat, zero fee). */
export function isBonusTier(app, tier) {
  const tiers = Array.isArray(app?.bonus_tiers) ? app.bonus_tiers : [];
  return tiers.includes(tier);
}

/** The prerequisite root app row for a course, or null. */
export function prereqRootOf(apps, appSlug) {
  const list = Array.isArray(apps) ? apps : [];
  const app = list.find((a) => a.slug === appSlug);
  if (!app?.prereq_slug) return null;
  return list.find((a) => a.slug === app.prereq_slug) || { slug: app.prereq_slug, name: app.prereq_slug };
}

/**
 * Shape an academy_prereq_waiver_status payload for display.
 * kind: 'none' | 'satisfied' | 'locked' | 'open' | 'unavailable'
 */
export function waiverPresentation(status, nowMs = Date.now()) {
  if (!status || status.required === false) return { kind: 'none', text: '' };
  const name = status.prereq_name || status.prereq_slug;
  if (status.satisfied) {
    const via = status.via === 'certification' ? `your ${name} certification`
      : status.via === 'waiver' ? `your ${name} waiver exam pass`
        : 'your existing enrollment in this course';
    return { kind: 'satisfied', text: `Prerequisite met by ${via}.` };
  }
  const lockedUntil = status.locked_until ? Date.parse(status.locked_until) : NaN;
  if (Number.isFinite(lockedUntil) && lockedUntil > nowMs) {
    const hours = Math.max(1, Math.ceil((lockedUntil - nowMs) / 3600000));
    return {
      kind: 'locked',
      text: `Prerequisite: ${name} (Associate). The free waiver exam reopens in about ${hours} hour${hours === 1 ? '' : 's'} after the recent attempts.`,
    };
  }
  if (status.exam_available === false) {
    return { kind: 'unavailable', text: `Prerequisite: an active ${name} certification is required before enrolling in this course.` };
  }
  return {
    kind: 'open',
    text: `Prerequisite: ${name} (Associate). Already know it? Pass the free ${name} waiver exam, no enrollment and no sponsor seat needed. Otherwise the ${name} Beginner course is free and takes no seat.`,
  };
}

/** What the Enroll page does with a self-enrolment response. */
export function selfEnrolOutcome(res) {
  if (!res) return { next: 'error', message: 'No response from the enrollment service.' };
  if (res.status === 'active') {
    return { next: 'enrolled', message: 'Your enrollment is active. This tier is free, so there is nothing to pay.' };
  }
  if (res.status === 'pending_payment' && res.reference) {
    return { next: 'checkout', reference: res.reference };
  }
  return { next: 'error', message: `Unexpected enrollment status: ${res.status || 'unknown'}` };
}

/** Sponsor console wording for an assignment result. */
export function assignToast(res, courseName, tierLabel) {
  const who = res?.display_name || res?.email || 'The learner';
  if (res && res.seat_consumed === false) {
    return `${who} is enrolled in ${courseName} (${tierLabel}). Bonus course: no seat used, ${res.seats_used} of ${res.seats} seats remain in use.`;
  }
  return `${who} is enrolled in ${courseName} (${tierLabel}). ${res?.seats_used ?? '?'} of ${res?.seats ?? '?'} seats used.`;
}
