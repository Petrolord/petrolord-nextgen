import { describe, it, expect } from 'vitest';
import {
  seatsRemaining, poolState, canAssign, daysLeft, formatPrice, perSeatMinor, poolCovers,
  summarizeAssignments, BLOCK_OFFERS,
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
