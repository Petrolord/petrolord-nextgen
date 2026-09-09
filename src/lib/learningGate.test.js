import { describe, it, expect } from 'vitest';
import { gateState, enrollmentAction, getStartedPath, isDashboardPath, doorLabel } from './learningGate';

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
