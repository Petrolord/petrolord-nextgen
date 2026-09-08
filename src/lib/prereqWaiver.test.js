import { describe, it, expect } from 'vitest';
import {
  isBonusTier, prereqRootOf, waiverPresentation, selfEnrolOutcome, assignToast,
} from './prereqWaiver';

const APPS = [
  { slug: 'welldata', name: 'Well Data Manager', prereq_slug: null, bonus_tiers: ['beginner'] },
  { slug: 'petrophysics', name: 'Petrophysics', prereq_slug: 'welldata', bonus_tiers: [] },
  { slug: 'nodal', name: 'Nodal Analysis', prereq_slug: null },
];
const NOW = Date.parse('2026-09-08T12:00:00Z');

describe('bonus tiers and the prerequisite root', () => {
  it('reads bonus tiers off the catalogue row and tolerates its absence', () => {
    expect(isBonusTier(APPS[0], 'beginner')).toBe(true);
    expect(isBonusTier(APPS[0], 'intermediate')).toBe(false);
    expect(isBonusTier(APPS[2], 'beginner')).toBe(false);
    expect(isBonusTier(null, 'beginner')).toBe(false);
  });
  it('resolves the root course of a gated course', () => {
    expect(prereqRootOf(APPS, 'petrophysics')?.name).toBe('Well Data Manager');
    expect(prereqRootOf(APPS, 'welldata')).toBeNull();
    expect(prereqRootOf(APPS, 'missing')).toBeNull();
  });
});

describe('waiver status presentation', () => {
  const base = { required: true, prereq_slug: 'welldata', prereq_name: 'Well Data Manager', exam_available: true, locked_until: null };
  it('says nothing for courses without a prerequisite', () => {
    expect(waiverPresentation({ required: false }).kind).toBe('none');
    expect(waiverPresentation(null).kind).toBe('none');
  });
  it('names how the prerequisite was met', () => {
    expect(waiverPresentation({ ...base, satisfied: true, via: 'certification' }).text).toMatch(/certification/);
    expect(waiverPresentation({ ...base, satisfied: true, via: 'waiver' }).text).toMatch(/waiver exam pass/);
    expect(waiverPresentation({ ...base, satisfied: true, via: 'enrolled' }).text).toMatch(/existing enrollment/);
  });
  it('offers the free exam, or the cooldown, or falls back to the certification wording', () => {
    const open = waiverPresentation({ ...base, satisfied: false }, NOW);
    expect(open.kind).toBe('open');
    expect(open.text).toMatch(/free Well Data Manager waiver exam/);
    expect(open.text).toMatch(/takes no seat/);
    const locked = waiverPresentation({ ...base, satisfied: false, locked_until: '2026-09-08T20:30:00Z' }, NOW);
    expect(locked.kind).toBe('locked');
    expect(locked.text).toMatch(/about 9 hours/);
    const gone = waiverPresentation({ ...base, satisfied: false, locked_until: '2026-09-08T11:00:00Z' }, NOW);
    expect(gone.kind).toBe('open');
    expect(waiverPresentation({ ...base, satisfied: false, exam_available: false }, NOW).kind).toBe('unavailable');
  });
});

describe('self-enrolment outcome and sponsor wording', () => {
  it('routes a zero-fee activation, a payment, and anything else', () => {
    expect(selfEnrolOutcome({ status: 'active', amount_minor: 0 }).next).toBe('enrolled');
    expect(selfEnrolOutcome({ status: 'pending_payment', reference: 'ACAD-1' })).toEqual({ next: 'checkout', reference: 'ACAD-1' });
    expect(selfEnrolOutcome({ status: 'pending_payment' }).next).toBe('error');
    expect(selfEnrolOutcome(null).next).toBe('error');
  });
  it('tells the lead when a bonus course took no seat', () => {
    expect(assignToast({ display_name: 'Ada', seat_consumed: false, seats_used: 3, seats: 20 }, 'Well Data Manager', 'Associate'))
      .toBe('Ada is enrolled in Well Data Manager (Associate). Bonus course: no seat used, 3 of 20 seats remain in use.');
    expect(assignToast({ display_name: 'Ada', seat_consumed: true, seats_used: 4, seats: 20 }, 'Petrophysics', 'Associate'))
      .toBe('Ada is enrolled in Petrophysics (Associate). 4 of 20 seats used.');
    expect(assignToast({ display_name: 'Ada', seat_consumed: false, seat_reason: 'course_seat', seats_used: 4, seats: 15 }, 'Petrophysics', 'Professional'))
      .toMatch(/^Ada is enrolled in Petrophysics \(Professional\)\. Rides on the seat already held for this course: no seat used/);
  });
});
