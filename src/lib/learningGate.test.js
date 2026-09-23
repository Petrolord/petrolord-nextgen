import { describe, it, expect } from 'vitest';
import {
  gateState, enrollmentAction, getStartedPath, isDashboardPath, doorLabel,
  activeTiers, pickCourseTier, courseTierPath,
} from './learningGate';

const enr = (o = {}) => ({ id: 'e1', app_slug: 'petrophysics', course_tier: 'beginner', door: 'sponsored', status: 'active', ...o });
const ACTIVATED = { activated: true };
const NOT = { activated: false };

describe('gateState names the one next step', () => {
  it('a sponsored seat on an unactivated account asks for activation, not enrolment', () => {
    expect(gateState({ activation: NOT, enrollments: [enr()], app: 'petrophysics' })).toEqual({ kind: 'activate', door: 'sponsored' });
  });
  it('an active seat on an activated account that still has no scope is stalled', () => {
    expect(gateState({ activation: ACTIVATED, enrollments: [enr()], app: 'petrophysics' })).toEqual({ kind: 'stalled', door: 'sponsored' });
  });
  it('a pending self-enrolment points at payment', () => {
    expect(gateState({ activation: ACTIVATED, enrollments: [enr({ door: 'self', status: 'pending' })], app: 'petrophysics' })).toEqual({ kind: 'pending', door: 'self' });
  });
  it('no enrolment: enrol, and activate too when the account is not activated', () => {
    expect(gateState({ activation: ACTIVATED, enrollments: [], app: 'petrophysics' })).toEqual({ kind: 'enrol', door: null });
    expect(gateState({ activation: NOT, enrollments: [], app: 'petrophysics' })).toEqual({ kind: 'enrol_and_activate', door: null });
    expect(gateState({ activation: null, enrollments: [], app: 'petrophysics' })).toEqual({ kind: 'enrol_and_activate', door: null });
  });
  it('only this course counts, and cancelled rows are ignored', () => {
    expect(gateState({ activation: ACTIVATED, enrollments: [enr({ app_slug: 'welldata' })], app: 'petrophysics' }).kind).toBe('enrol');
    expect(gateState({ activation: ACTIVATED, enrollments: [enr({ status: 'cancelled' })], app: 'petrophysics' }).kind).toBe('enrol');
  });
  it('admins and lecturers are never asked to activate', () => {
    expect(gateState({ isLearner: false, activation: null, enrollments: [enr()], app: 'petrophysics' }).kind).toBe('stalled');
    expect(gateState({ isLearner: false, activation: null, enrollments: [], app: 'petrophysics' }).kind).toBe('enrol');
  });
});

describe('enrollmentAction gives every row a button', () => {
  it('active + activated starts the course', () => {
    expect(enrollmentAction(enr(), { activation: ACTIVATED })).toEqual({ kind: 'start', to: '/dashboard/apps/petrophysics', label: 'Start course' });
  });
  it('active + not activated goes to Get Started and comes back to the course', () => {
    expect(enrollmentAction(enr(), { activation: NOT })).toEqual({
      kind: 'activate', to: '/dashboard/get-started?next=%2Fdashboard%2Fapps%2Fpetrophysics', label: 'Activate account',
    });
  });
  it('pending pays, cancelled has nothing', () => {
    expect(enrollmentAction(enr({ status: 'pending' }), { activation: ACTIVATED }).kind).toBe('pay');
    expect(enrollmentAction(enr({ status: 'cancelled' }), { activation: ACTIVATED })).toBeNull();
    expect(enrollmentAction(null)).toBeNull();
  });
});

describe('return targets', () => {
  it('only dashboard paths ride on ?next', () => {
    expect(isDashboardPath('/dashboard/apps/dca')).toBe(true);
    expect(isDashboardPath('/dashboard')).toBe(true);
    expect(isDashboardPath('//evil.example')).toBe(false);
    expect(isDashboardPath('https://evil.example/dashboard')).toBe(false);
    expect(isDashboardPath('/dashboardx')).toBe(false);
    expect(getStartedPath('https://evil.example')).toBe('/dashboard/get-started');
    expect(getStartedPath(null)).toBe('/dashboard/get-started');
  });
  it('door labels read as prose', () => {
    expect(doorLabel('sponsored')).toBe('employer-sponsored enrolment');
    expect(doorLabel('unknown')).toBe('enrolment');
  });
});

// 2026-09-23: pioneers who certified Beginner and were then assigned
// Intermediate by their sponsor saw "You are not enrolled" on the
// Intermediate course, because the page kept one tier per course (the
// OLDEST active row, since the list is newest first) and ignored the
// tier in the /course/:tier link.
describe('a course can hold several active tiers', () => {
  const TIERS3 = ['beginner', 'intermediate', 'advanced'];
  // listMyEnrollments order: newest first.
  const pioneer = [
    enr({ id: 'e2', course_tier: 'intermediate' }),
    enr({ id: 'e1', course_tier: 'beginner' }),
  ];

  it('both the finished Beginner and the assigned Intermediate count as enrolled', () => {
    const t = activeTiers(pioneer, 'petrophysics');
    expect(t.has('beginner')).toBe(true);
    expect(t.has('intermediate')).toBe(true);
    expect(t.has('advanced')).toBe(false);
  });
  it('other courses and non-active rows do not count', () => {
    const rows = [enr({ app_slug: 'welldata', course_tier: 'advanced' }), enr({ course_tier: 'advanced', status: 'cancelled' }), enr({ course_tier: 'intermediate', status: 'pending' })];
    expect([...activeTiers(rows, 'petrophysics')]).toEqual([]);
    expect([...activeTiers(null, 'petrophysics')]).toEqual([]);
  });
  it('with no explicit choice the course opens on the highest enrolled tier', () => {
    expect(pickCourseTier({ tiers: TIERS3, enrollments: pioneer, app: 'petrophysics' })).toBe('intermediate');
    expect(pickCourseTier({ tiers: TIERS3, enrollments: [...pioneer].reverse(), app: 'petrophysics' })).toBe('intermediate');
  });
  it('the tier in the link is honoured, and the tab choice wins over it', () => {
    expect(pickCourseTier({ tiers: TIERS3, pathTier: 'beginner', enrollments: pioneer, app: 'petrophysics' })).toBe('beginner');
    expect(pickCourseTier({ tiers: TIERS3, pathTier: 'beginner', queryTier: 'advanced', enrollments: pioneer, app: 'petrophysics' })).toBe('advanced');
  });
  it('unauthored or unknown tiers fall through; nothing enrolled opens the first tier', () => {
    expect(pickCourseTier({ tiers: ['beginner'], pathTier: 'intermediate', enrollments: pioneer, app: 'petrophysics' })).toBe('beginner');
    expect(pickCourseTier({ tiers: TIERS3, queryTier: 'bogus', enrollments: [], app: 'petrophysics' })).toBe('beginner');
    expect(pickCourseTier({ tiers: [], enrollments: pioneer, app: 'petrophysics' })).toBe(null);
  });
  it('Start course opens the assigned tier when it has a deep course', () => {
    const hasCourse = (app, tier) => app === 'petrophysics' && tier !== 'advanced';
    const act = enrollmentAction(pioneer[0], { activation: ACTIVATED, hasCourse });
    expect(act).toEqual({ kind: 'start', to: courseTierPath('petrophysics', 'intermediate'), label: 'Start course' });
    expect(act.to).toBe('/dashboard/apps/petrophysics/course/intermediate');
  });
  it('without a deep course, or without the helper, Start course keeps the app page', () => {
    expect(enrollmentAction(enr({ course_tier: 'advanced' }), { activation: ACTIVATED, hasCourse: () => false }).to).toBe('/dashboard/apps/petrophysics');
    expect(enrollmentAction(pioneer[0], { activation: ACTIVATED }).to).toBe('/dashboard/apps/petrophysics');
  });
  it('an unactivated learner is sent to activate, then back to the assigned tier', () => {
    const act = enrollmentAction(pioneer[0], { activation: NOT, hasCourse: () => true });
    expect(act.kind).toBe('activate');
    expect(act.to).toBe(getStartedPath('/dashboard/apps/petrophysics/course/intermediate'));
  });
});
