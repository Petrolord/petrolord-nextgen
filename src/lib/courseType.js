// Course types (Suite docs/scope/NextGen-Catalog-Regroup-PLAN.md section 3,
// owner decision 2026-09-26; lead decisions 1 and 2, 2026-09-27).
//
//   app       a Suite app over a petrolord-engines engine; the default.
//   engine    a validated engine reached through course calculator panels,
//             with no Suite app. The capstone is graded from the engine.
//   practice  no engine: a dated, cited source pack, scenario banks audited
//             against it, no numeric capstone, a visible "Practice course"
//             badge and a review date. Each tier's certificate is issued from
//             its final exam (academy_claim_practice_certificate); the Expert
//             exam is a written-case bank.
//
// academy_apps.course_type, review_date and sources_checked_on are the source
// of truth once migration 20261116_sc5_contracts_platform_course_types.sql is
// applied. The static maps below are the fallback while the live catalogue
// cannot be read (or before that migration), in the way homeCatalog.js falls
// back to its static status. courseType.test.js pins them to the migration's
// backfill and to each practice wave's wave.json, so the two cannot drift.

import { formalDate } from '@/lib/appNames';

export const COURSE_TYPES = ['app', 'engine', 'practice'];

// The engine courses the platform migration backfills as 'engine'.
export const ENGINE_COURSES = ['procurement', 'pia', 'gsa', 'joa', 'farmout', 'prms'];

// Practice courses with their source-check and review dates (ISO dates).
export const PRACTICE_COURSES = {
  contracts: { sourcesCheckedOn: '2026-09-27', reviewDate: '2027-09-27' },
};

export const PRACTICE_BADGE_LABEL = 'Practice course';

const liveRow = (slug, apps) => (Array.isArray(apps) ? apps.find((a) => a?.slug === slug) : null);

/**
 * The type of a course. A live academy_apps row with a known course_type
 * wins; otherwise the static maps; otherwise 'app', the default every course
 * had before course types existed.
 */
export function courseTypeOf(slug, apps) {
  const row = liveRow(slug, apps);
  if (row && COURSE_TYPES.includes(row.course_type)) return row.course_type;
  if (PRACTICE_COURSES[slug]) return 'practice';
  if (ENGINE_COURSES.includes(slug)) return 'engine';
  return 'app';
}

export function isPracticeCourse(slug, apps) {
  return courseTypeOf(slug, apps) === 'practice';
}

/**
 * The two dates a practice course prints: when its sources were checked and
 * when it is due to be re-read against them. Live values win, each on its
 * own; null for a course that is not a practice course.
 */
export function practiceDates(slug, apps) {
  if (!isPracticeCourse(slug, apps)) return null;
  const row = liveRow(slug, apps);
  const fallback = PRACTICE_COURSES[slug] || {};
  const sourcesCheckedOn = row?.sources_checked_on || fallback.sourcesCheckedOn || null;
  const reviewDate = row?.review_date || fallback.reviewDate || null;
  return { sourcesCheckedOn, reviewDate };
}

/** True when the review date has passed (compared by calendar day, UTC). */
export function isReviewOverdue(reviewDate, now = new Date()) {
  if (!reviewDate) return false;
  const due = new Date(`${String(reviewDate).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(due.getTime())) return false;
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return today > due;
}

/**
 * The sentence the course page prints under the badge. Both dates are
 * printed in the certificate's formal form ("27 September 2026").
 */
export function reviewLine({ sourcesCheckedOn, reviewDate } = {}, now = new Date()) {
  const parts = [];
  if (sourcesCheckedOn) parts.push(`Sources checked on ${formalDate(`${sourcesCheckedOn}T00:00:00Z`)}.`);
  if (reviewDate) {
    parts.push(isReviewOverdue(reviewDate, now)
      ? `The review due on ${formalDate(`${reviewDate}T00:00:00Z`)} is under way.`
      : `Next review due by ${formalDate(`${reviewDate}T00:00:00Z`)}.`);
  }
  return parts.join(' ');
}

/** How a tier's certificate is earned: the capstone, or the final exam. */
export function certificateBasis(courseType) {
  return courseType === 'practice' ? 'final_exam' : 'capstone';
}

/** The course line a certificate prints: a practice course says it is one. */
export function certificateCourseLine(name, courseType) {
  return courseType === 'practice' ? `${name} (${PRACTICE_BADGE_LABEL.toLowerCase()})` : name;
}

/**
 * Whether the learner may ask for a practice certificate now: the course is a
 * practice course and the tier's final exam is passed. The server decides
 * again (academy_claim_practice_certificate); this only drives the button.
 */
export function canClaimPracticeCertificate(courseType, progress) {
  return courseType === 'practice' && progress?.final_exam?.passed === true;
}

/**
 * What the final exam page says and where it sends a learner who passes. An
 * app or engine course sends them to the capstone; a practice course sends
 * them to the course home, where the certificate is issued. The Expert exam of
 * a practice course is the written-case bank.
 */
export function finalExamCopy(courseType, tier, appSlug) {
  const home = `/dashboard/apps/${appSlug}/course/${tier}`;
  if (courseType !== 'practice') {
    return {
      description: 'A randomized exam across the whole course. Passing it unlocks the capstone practical.',
      continueTo: `/dashboard/apps/${appSlug}`,
      continueLabel: 'Open the capstone',
    };
  }
  return {
    description: tier === 'advanced'
      ? 'The Expert written case: scenario questions drawn at random from the whole course, each keyed to its cited source. Passing it issues your Expert certificate on the course home.'
      : 'A randomized exam across the whole course, with scenario questions keyed to their cited sources. Passing it issues your certificate on the course home.',
    continueTo: home,
    continueLabel: 'Issue my certificate',
  };
}
