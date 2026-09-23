import { describe, it, expect } from 'vitest';
import {
  seatsRemaining, poolState, canAssign, daysLeft, formatPrice, perSeatMinor, poolCovers,
  summarizeAssignments, BLOCK_OFFERS, seatScopeLabel, courseSeatsNeeded,
  progressPct, scoreText, quizSummary, daysSinceActive, isInactive, summarizeProgress, progressCsv, INACTIVE_DAYS,
} from './sponsorPools';

const NOW = Date.parse('2026-09-07T12:00:00Z');
const pool = (o = {}) => ({
  seats: 20, seats_used: 5, status: 'active', currency: 'NGN', price_minor: 240000000,
  valid_from: '2026-09-01T00:00:00Z', valid_until: '2027-09-01T00:00:00Z', app_slugs: [], tiers: [], ...o,
});

describe('seat arithmetic and state', () => {
  it('counts remaining seats and never goes negative', () => {
    expect(seatsRemaining(pool())).toBe(15);
    expect(seatsRemaining(pool({ seats_used: 25 }))).toBe(0);
    expect(seatsRemaining(null)).toBe(0);
  });
  it('orders the states: closed, expired, not started, full, active', () => {
    expect(poolState(pool(), NOW)).toBe('active');
    expect(poolState(pool({ status: 'closed' }), NOW)).toBe('closed');
    expect(poolState(pool({ valid_until: '2026-09-01T00:00:00Z' }), NOW)).toBe('expired');
    expect(poolState(pool({ valid_from: '2026-10-01T00:00:00Z' }), NOW)).toBe('not_started');
    expect(poolState(pool({ seats_used: 20 }), NOW)).toBe('full');
    expect(canAssign(pool(), NOW)).toBe(true);
    expect(canAssign(pool({ seats_used: 20 }), NOW)).toBe(false);
  });
  it('days left counts whole days and goes negative after expiry', () => {
    expect(daysLeft(pool({ valid_until: '2026-09-17T12:00:00Z' }), NOW)).toBe(10);
    expect(daysLeft(pool({ valid_until: '2026-09-06T12:00:00Z' }), NOW)).toBe(-1);
    expect(daysLeft({}, NOW)).toBeNull();
  });
});

describe('money and coverage', () => {
  it('formats the published offers from minor units', () => {
    expect(formatPrice(pool())).toBe('NGN 2,400,000');
    expect(formatPrice(pool({ price_minor: null }))).toBeNull();
    expect(perSeatMinor(pool())).toBe(12000000);
    expect(perSeatMinor(BLOCK_OFFERS[1])).toBe(10800000);
    expect(perSeatMinor(BLOCK_OFFERS[2])).toBe(9600000);
  });
  it('the three offers match the quoted block prices', () => {
    expect(BLOCK_OFFERS.map((o) => [o.seats, o.price_minor / 100])).toEqual([[20, 2400000], [50, 5400000], [100, 9600000]]);
  });
  it('empty allow-lists cover everything; filled ones restrict', () => {
    expect(poolCovers(pool(), 'petrophysics', 'beginner')).toBe(true);
    expect(poolCovers(pool({ app_slugs: ['petrophysics'] }), 'welltest', 'beginner')).toBe(false);
    expect(poolCovers(pool({ tiers: ['beginner', 'intermediate'] }), 'welltest', 'advanced')).toBe(false);
    expect(poolCovers(pool({ app_slugs: ['welltest'], tiers: ['advanced'] }), 'welltest', 'advanced')).toBe(true);
  });
});

describe('summarizeAssignments', () => {
  it('totals by status, seat return and certification', () => {
    const s = summarizeAssignments([
      { status: 'active', certified: false },
      { status: 'active', certified: true },
      { status: 'cancelled', seat_returned: true, certified: false },
      { status: 'cancelled', seat_returned: false, certified: true },
    ]);
    expect(s).toEqual({ total: 4, active: 2, cancelled: 2, returned: 1, certified: 2 });
    expect(summarizeAssignments(null).total).toBe(0);
  });
});

describe('seat scope (2026-09-08)', () => {
  it('labels the two scopes and defaults old pools to tier', () => {
    expect(seatScopeLabel(pool())).toBe('One seat = one course tier');
    expect(seatScopeLabel(pool({ seat_scope: 'course' }))).toBe('One seat = one course, all three tiers');
    expect(seatScopeLabel(null)).toBe('One seat = one course tier');
  });
  it('sizes a pioneer pool: learners times courses each', () => {
    expect(courseSeatsNeeded(5, 3)).toBe(15);
    expect(courseSeatsNeeded('4', '3')).toBe(12);
    expect(courseSeatsNeeded(null, 3)).toBe(0);
  });
});

// Learner progress (2026-09-23): rows shaped like academy_sponsor_learner_progress.
describe('learner progress for training leads', () => {
  const DAY = 86400000;
  const iso = (daysAgo) => new Date(NOW - daysAgo * DAY).toISOString();
  const mod = (o = {}) => ({ key: 'm', title: 'M', lessons_total: 4, lessons_read: 0, complete: false, quiz_attempts: 0, quiz_best_score: null, quiz_max_score: null, quiz_passed: false, ...o });
  const row = (o = {}) => ({
    assignment_id: 'a1', display_name: 'Ada Obi', email: 'ada@x.com', app_slug: 'petrophysics', course_name: 'Petrophysics', course_tier: 'intermediate',
    status: 'active', assigned_at: iso(20), deep: true, lessons_total: 26, lessons_read: 13, modules_total: 2, modules_complete: 1,
    modules: [mod({ key: 'm1', lessons_read: 4, complete: true, quiz_attempts: 2, quiz_best_score: 4, quiz_max_score: 5, quiz_passed: true }), mod({ key: 'm2', lessons_read: 1 })],
    final_exam: { attempts: 0, best_score: null, max_score: null, passed: false }, capstone: { attempts: 0, best_score: null, max_score: null, passed: false },
    certificate: null, last_active_at: iso(2), ...o,
  });

  it('progress is the share of lessons read, capped and safe without a structure', () => {
    expect(progressPct(row())).toBe(50);
    expect(progressPct(row({ lessons_read: 30 }))).toBe(100);
    expect(progressPct(row({ lessons_total: 0 }))).toBe(0);
    expect(progressPct(null)).toBe(0);
  });
  it('scores read as best/max, or "no attempt"', () => {
    expect(scoreText(4, 6)).toBe('4/6');
    expect(scoreText(0, 6)).toBe('0/6');
    expect(scoreText(null, null)).toBe('no attempt');
  });
  it('module quizzes: passed count, and the mean best percent over quizzes taken only', () => {
    expect(quizSummary(row())).toEqual({ passed: 1, total: 2, attempted: 1, avgPct: 80 });
    const two = row({ modules: [mod({ quiz_attempts: 1, quiz_best_score: 4, quiz_max_score: 5, quiz_passed: true }), mod({ quiz_attempts: 3, quiz_best_score: 2, quiz_max_score: 5 })] });
    expect(quizSummary(two).avgPct).toBe(60);
    expect(quizSummary(row({ modules: [mod()] })).avgPct).toBe(null);
  });
  it('days since active, and the inactivity flag after 14 quiet days', () => {
    expect(INACTIVE_DAYS).toBe(14);
    expect(daysSinceActive(row(), NOW)).toBe(2);
    expect(daysSinceActive(row({ last_active_at: null }), NOW)).toBe(null);
    expect(isInactive(row(), NOW)).toBe(false);
    expect(isInactive(row({ last_active_at: iso(14) }), NOW)).toBe(true);
    // never started: counts from the assignment
    expect(isInactive(row({ last_active_at: null, assigned_at: iso(15) }), NOW)).toBe(true);
    expect(isInactive(row({ last_active_at: null, assigned_at: iso(3) }), NOW)).toBe(false);
    // certified, or not an active seat: never flagged
    expect(isInactive(row({ last_active_at: iso(40), certificate: { certificate_number: 'PLA-1' } }), NOW)).toBe(false);
    expect(isInactive(row({ status: 'cancelled', last_active_at: iso(40) }), NOW)).toBe(false);
  });
  it('the headline counts active seats only and reports ended ones separately', () => {
    const rows = [
      row(),
      row({ assignment_id: 'a2', lessons_read: 26, final_exam: { attempts: 1, best_score: 32, max_score: 40, passed: true }, capstone: { attempts: 2, best_score: 6, max_score: 6, passed: true }, certificate: { certificate_number: 'PLA-2' } }),
      row({ assignment_id: 'a3', lessons_read: 0, last_active_at: null, assigned_at: iso(30) }),
      { assignment_id: 'a4', status: 'cancelled', course_tier: 'beginner' },
    ];
    expect(summarizeProgress(rows, NOW)).toEqual({ learners: 3, avgProgressPct: 50, finalPassed: 1, capstonePassed: 1, certified: 1, inactive: 1, ended: 1 });
    expect(summarizeProgress([], NOW).avgProgressPct).toBe(0);
  });
  it('the CSV has one line per active seat, with scores and flags, and quotes every cell', () => {
    const csv = progressCsv([row({ display_name: 'O"Brien, T' }), { assignment_id: 'x', status: 'cancelled' }], NOW).split('\n');
    expect(csv).toHaveLength(2);
    expect(csv[0]).toMatch(/^learner,email,course,tier,progress_pct/);
    expect(csv[1]).toContain('"O""Brien, T"');
    expect(csv[1]).toContain('"Professional","50","13","26","1","2","1/2","80","no attempt","0","no"');
    expect(csv[1].endsWith('"no"')).toBe(true);
  });
});
