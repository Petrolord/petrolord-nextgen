// Pure helpers for sponsor pools (Breeze Energy onboarding, 2026-09-07):
// seat arithmetic and the labels the console shows. The database owns the
// truth (seats_used is maintained by the assign and cancel functions); these
// only read a pool row.

import { courseName } from './appNames';

export const TIER_LABELS = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };
export const TIERS = ['beginner', 'intermediate', 'advanced'];

export const seatsRemaining = (pool) => Math.max(0, Number(pool?.seats || 0) - Number(pool?.seats_used || 0));

/** active | closed | expired | full, in that order of precedence. */
export function poolState(pool, nowMs = Date.now()) {
  if (!pool) return 'closed';
  if (pool.status === 'closed') return 'closed';
  if (pool.valid_until && Date.parse(pool.valid_until) <= nowMs) return 'expired';
  if (pool.valid_from && Date.parse(pool.valid_from) > nowMs) return 'not_started';
  if (seatsRemaining(pool) === 0) return 'full';
  return 'active';
}

export const canAssign = (pool, nowMs = Date.now()) => poolState(pool, nowMs) === 'active';

/** Whole days until the pool expires (negative once past). */
export function daysLeft(pool, nowMs = Date.now()) {
  if (!pool?.valid_until) return null;
  return Math.floor((Date.parse(pool.valid_until) - nowMs) / 86400000);
}

/** "NGN 2,400,000" from minor units; null when no price was recorded. */
export function formatPrice(pool) {
  if (pool == null || pool.price_minor == null) return null;
  const major = Number(pool.price_minor) / 100;
  return `${pool.currency || 'NGN'} ${major.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

/** Per-seat price in minor units, or null. */
export function perSeatMinor(pool) {
  if (pool == null || pool.price_minor == null || !(Number(pool.seats) > 0)) return null;
  return Math.round(Number(pool.price_minor) / Number(pool.seats));
}

/** Does this pool allow the course and tier (empty lists mean any). */
export function poolCovers(pool, appSlug, tier) {
  if (!pool) return false;
  const apps = Array.isArray(pool.app_slugs) ? pool.app_slugs : [];
  const tiers = Array.isArray(pool.tiers) ? pool.tiers : [];
  if (apps.length && !apps.includes(appSlug)) return false;
  if (tiers.length && !tiers.includes(tier)) return false;
  return true;
}

/** Report totals for a pool's assignments. */
export function summarizeAssignments(rows) {
  const list = Array.isArray(rows) ? rows : [];
  return {
    total: list.length,
    active: list.filter((r) => r.status === 'active').length,
    cancelled: list.filter((r) => r.status === 'cancelled').length,
    returned: list.filter((r) => r.status === 'cancelled' && r.seat_returned).length,
    certified: list.filter((r) => r.certified).length,
  };
}

/** Seat scope wording (owner decision 2026-09-08). */
export const SEAT_SCOPES = Object.freeze({
  tier: 'One seat = one course tier',
  course: 'One seat = one course, all three tiers',
});
export const seatScopeLabel = (pool) => SEAT_SCOPES[pool?.seat_scope] || SEAT_SCOPES.tier;

/** Seats a course-scope pool needs for n learners taking k courses each. */
export const courseSeatsNeeded = (learners, coursesEach) => Math.max(0, Number(learners) || 0) * Math.max(0, Number(coursesEach) || 0);

/** The published block offers (NGN, minor units) for the admin form's presets. */
export const BLOCK_OFFERS = Object.freeze([
  { key: 'starter', name: 'Starter', seats: 20, price_minor: 240000000 },
  { key: 'standard', name: 'Standard', seats: 50, price_minor: 540000000 },
  { key: 'programme', name: 'Programme', seats: 100, price_minor: 960000000 },
]);

// ---------------------------------------------------------------------------
// Learner progress (owner decision 2026-09-23): what a training lead sees
// about each learner they sponsor, from academy_sponsor_learner_progress.
// Scores and attempt counts only, never answers; the server returns only
// the assigned course and tier, and nothing for a cancelled seat.

/** Days without activity after which a learner is flagged. */
export const INACTIVE_DAYS = 14;

/** Whole percent of the course's lessons read (0 when there is no structure). */
export function progressPct(row) {
  const total = Number(row?.lessons_total) || 0;
  if (!total) return 0;
  return Math.min(100, Math.round((100 * (Number(row.lessons_read) || 0)) / total));
}

/** "4/6", or "no attempt". */
export function scoreText(best, max) {
  if (best == null || max == null) return 'no attempt';
  return `${best}/${max}`;
}

/** Module quizzes: how many passed, and the mean of the best scores (percent) over the quizzes attempted. */
export function quizSummary(row) {
  const mods = Array.isArray(row?.modules) ? row.modules : [];
  const tried = mods.filter((m) => Number(m.quiz_attempts) > 0 && Number(m.quiz_max_score) > 0);
  const avg = tried.length
    ? Math.round(tried.reduce((s, m) => s + (100 * Number(m.quiz_best_score)) / Number(m.quiz_max_score), 0) / tried.length)
    : null;
  return { passed: mods.filter((m) => m.quiz_passed).length, total: mods.length, attempted: tried.length, avgPct: avg };
}

/** Whole days since the last activity in the sponsored course, or null when there is none. */
export function daysSinceActive(row, nowMs = Date.now()) {
  if (!row?.last_active_at) return null;
  return Math.max(0, Math.floor((nowMs - Date.parse(row.last_active_at)) / 86400000));
}

/**
 * Flag a learner who has gone quiet: an active, uncertified seat with no
 * activity for INACTIVE_DAYS, counting from the assignment when there has
 * been no activity at all.
 */
export function isInactive(row, nowMs = Date.now(), days = INACTIVE_DAYS) {
  if (!row || row.status !== 'active' || row.certificate) return false;
  const since = row.last_active_at || row.assigned_at;
  if (!since) return false;
  return nowMs - Date.parse(since) >= days * 86400000;
}

/** Headline figures for the progress card (active seats only). */
export function summarizeProgress(rows, nowMs = Date.now()) {
  const active = (Array.isArray(rows) ? rows : []).filter((r) => r.status === 'active');
  const avg = active.length ? Math.round(active.reduce((s, r) => s + progressPct(r), 0) / active.length) : 0;
  return {
    learners: active.length,
    avgProgressPct: avg,
    finalPassed: active.filter((r) => r.final_exam?.passed).length,
    capstonePassed: active.filter((r) => r.capstone?.passed).length,
    certified: active.filter((r) => r.certificate).length,
    inactive: active.filter((r) => isInactive(r, nowMs)).length,
    ended: (Array.isArray(rows) ? rows : []).length - active.length,
  };
}

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const isoDay = (iso) => (iso ? String(iso).slice(0, 10) : '');

/** The progress CSV: one line per active seat. */
export function progressCsv(rows, nowMs = Date.now()) {
  const head = ['learner', 'email', 'course', 'tier', 'progress_pct', 'lessons_read', 'lessons_total', 'modules_complete', 'modules_total',
    'module_quizzes_passed', 'module_quiz_avg_best_pct', 'final_exam_best', 'final_exam_attempts', 'final_exam_passed',
    'capstone_best', 'capstone_attempts', 'capstone_passed', 'certificate', 'certificate_valid_until', 'last_active', 'inactive'];
  const lines = (Array.isArray(rows) ? rows : []).filter((r) => r.status === 'active').map((r) => {
    const q = quizSummary(r);
    return [r.display_name, r.email, courseName(r.app_slug, r.course_name), TIER_LABELS[r.course_tier] || r.course_tier,
      progressPct(r), r.lessons_read, r.lessons_total, r.modules_complete, r.modules_total,
      `${q.passed}/${q.total}`, q.avgPct ?? '',
      scoreText(r.final_exam?.best_score, r.final_exam?.max_score), r.final_exam?.attempts ?? 0, r.final_exam?.passed ? 'yes' : 'no',
      scoreText(r.capstone?.best_score, r.capstone?.max_score), r.capstone?.attempts ?? 0, r.capstone?.passed ? 'yes' : 'no',
      r.certificate?.certificate_number || '', isoDay(r.certificate?.valid_until), isoDay(r.last_active_at),
      isInactive(r, nowMs) ? 'yes' : 'no'].map(csvCell).join(',');
  });
  return [head.join(','), ...lines].join('\n');
}
