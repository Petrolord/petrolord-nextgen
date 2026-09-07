// Pure helpers for sponsor pools (Breeze Energy onboarding, 2026-09-07):
// seat arithmetic and the labels the console shows. The database owns the
// truth (seats_used is maintained by the assign and cancel functions); these
// only read a pool row.

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

/** The published block offers (NGN, minor units) for the admin form's presets. */
export const BLOCK_OFFERS = Object.freeze([
  { key: 'starter', name: 'Starter', seats: 20, price_minor: 240000000 },
  { key: 'standard', name: 'Standard', seats: 50, price_minor: 540000000 },
  { key: 'programme', name: 'Programme', seats: 100, price_minor: 960000000 },
]);
