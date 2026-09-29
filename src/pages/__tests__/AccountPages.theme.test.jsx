// @vitest-environment jsdom
//
// Batch 2A (docs/scope/DesignSystem-Rollout.md): the account pages and the
// sponsor console, mounted as their routes mount them (Layout, header, the
// signed-in scope): settings, the notification center and the sponsor
// console. Each opens light, the header toggle goes to dark and back, and no
// legacy console colour is left outside canvases (with a negative control),
// in every tab, dialog and state the page can show. No request leaves the
// test.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import {
  describeScreenTheme, expectNoLegacyChrome, getScopeRoot,
} from '@/design/testing/themeAssertions';
import { renderRoute, installNetworkGuard, openTab, USER_ID } from './learnerAccountHarness';

// The 1A frame stub: a Supabase client that throws on any use.
vi.mock('@/lib/customSupabaseClient', async () => (await import('./frameStubs')).supabaseStub());

const FAR = '2099-01-01T00:00:00Z';
const data = {};
function resetData() {
  Object.assign(data, {
    preferences: { theme: 'dark', language: 'en', timezone: 'UTC', email_notifications: true, in_app_notifications: false, profile_visibility: 'private' },
    notifications: [
      { id: 'n1', title: 'Certificate issued', message: 'Your Associate certificate is ready.', notification_type: 'success', is_read: false, created_at: '2026-09-27T10:00:00Z', data: { category: 'academy', action_url: '/dashboard/certificates' } },
      { id: 'n2', title: 'Seat expiring', message: 'Your sponsored seat ends in 7 days.', notification_type: 'warning', is_read: false, created_at: '2026-09-26T10:00:00Z', data: {} },
      { id: 'n3', title: 'Payment failed', message: 'Paystack declined the charge.', notification_type: 'error', is_read: true, created_at: '2026-09-25T10:00:00Z', data: { category: 'system' } },
      { id: 'n4', title: 'Maintenance', message: 'Planned downtime on Sunday.', notification_type: 'info', is_read: true, created_at: '2026-09-24T10:00:00Z' },
    ],
    notificationPrefs: { email_notifications: true, in_app_notifications: false, report_sent_notifications: true, report_failed_notifications: false },
    apps: [
      { slug: 'welldata', name: 'Well Data Management', status: 'available' },
      { slug: 'petrophysics', name: 'Petrophysics', status: 'available', prereq_slug: 'welldata' },
      { slug: 'dca', name: 'Decline Curve Analysis', status: 'available', bonus_tiers: ['beginner'] },
    ],
    pools: [{
      sponsor: { name: 'Breeze Energy' },
      pools: [
        { id: 'p1', name: 'Graduate intake', seats: 10, seats_used: 3, status: 'active', valid_from: '2026-01-01T00:00:00Z', valid_until: FAR, tiers: [], app_slugs: [] },
        { id: 'p2', name: 'Old block', seats: 5, seats_used: 5, status: 'active', valid_from: '2024-01-01T00:00:00Z', valid_until: '2025-01-01T00:00:00Z', tiers: [], app_slugs: [] },
        { id: 'p3', name: 'Closed block', seats: 5, seats_used: 1, status: 'closed', valid_from: '2026-01-01T00:00:00Z', valid_until: FAR, tiers: [], app_slugs: [] },
      ],
    }],
    report: [
      { assignment_id: 'a1', display_name: 'Ada Obi', email: 'ada@example.com', app_slug: 'dca', course_name: 'Decline Curve Analysis', course_tier: 'beginner', status: 'active', enrollment_status: 'active', certified: true, assigned_at: '2026-09-01T00:00:00Z', note: 'graduate plan' },
      { assignment_id: 'a2', display_name: null, email: 'ben@example.com', app_slug: 'welldata', course_name: 'Well Data Management', course_tier: 'beginner', status: 'cancelled', seat_returned: true, cancel_reason: 'role change', assigned_at: '2026-09-02T00:00:00Z', cancelled_at: '2026-09-05T00:00:00Z' },
    ],
    progress: [
      {
        assignment_id: 'a1', status: 'active', display_name: 'Ada Obi', email: 'ada@example.com', app_slug: 'dca', course_name: 'Decline Curve Analysis', course_tier: 'beginner',
        deep: true, lessons_read: 13, lessons_total: 26, modules_complete: 1, modules_total: 2,
        final_exam: { best_score: 31, max_score: 40, passed: true, attempts: 2 },
        capstone: { best_score: null, max_score: null, passed: false, attempts: 0 },
        certificate: { certificate_number: 'PLA-2026-000123', valid_until: FAR },
        last_active_at: '2026-01-01T00:00:00Z', assigned_at: '2026-09-01T00:00:00Z',
        modules: [
          { key: 'm1', title: 'Arps decline', lessons_read: 13, lessons_total: 13, quiz_best_score: 8, quiz_max_score: 10, quiz_passed: true, quiz_attempts: 1, complete: true },
          { key: 'm2', title: 'Type curves', lessons_read: 0, lessons_total: 13, quiz_best_score: null, quiz_max_score: null, quiz_passed: false, quiz_attempts: 0, complete: false },
        ],
      },
      {
        assignment_id: 'a3', status: 'active', display_name: 'Chi Eze', email: 'chi@example.com', app_slug: 'welldata', course_name: 'Well Data Management', course_tier: 'beginner',
        deep: false, final_exam: null, capstone: null, certificate: null, last_active_at: '2026-01-01T00:00:00Z', assigned_at: '2026-01-01T00:00:00Z', modules: [],
      },
      { assignment_id: 'a2', status: 'cancelled' },
    ],
  });
}
resetData();

vi.mock('@/services/settingsService', () => ({
  settingsService: {
    getUserPreferences: async () => data.preferences,
    updateUserPreferences: async (_id, updates) => ({ ...data.preferences, ...updates }),
    updateUserProfile: async () => ({}),
    updateAuthUser: async () => ({}),
    deleteUserAccount: async () => ({}),
  },
}));

vi.mock('@/services/academyService', async (importOriginal) => ({
  ...(await importOriginal()),
  listAcademyApps: async () => data.apps,
  getActivationStatus: async () => ({ activated: true, orientation_completed: true, assessment_taken: true }),
  mySponsorPools: async () => data.pools,
  sponsorPoolReport: async () => data.report,
  sponsorLearnerProgress: async () => { if (data.progress === 'fail') throw new Error('offline'); return data.progress; },
}));

vi.mock('@/contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }) => children,
  useNotifications: () => ({
    notifications: data.notifications,
    unreadCount: data.notifications.filter((n) => !n.is_read).length,
    preferences: data.notificationPrefs,
    markAllAsRead: () => {},
    markAsRead: () => {},
    deleteNotification: () => {},
    updatePreferences: async () => {},
  }),
}));

let network;
beforeAll(() => { network = installNetworkGuard(); });
beforeEach(resetData);
afterAll(() => {
  expect(network).toEqual([]);
});

describeScreenTheme({
  name: 'Settings',
  route: '/dashboard/settings',
  renderScreen: () => renderRoute('/dashboard/settings'),
  ready: () => screen.findByText('Profile Information'),
  userId: USER_ID,
});

describeScreenTheme({
  name: 'Notification center',
  route: '/dashboard/notifications',
  renderScreen: () => renderRoute('/dashboard/notifications'),
  ready: () => screen.findByText('Seat expiring'),
  userId: USER_ID,
});

describeScreenTheme({
  name: 'Sponsor console',
  route: '/dashboard/sponsor',
  renderScreen: () => renderRoute('/dashboard/sponsor', { role: 'admin' }),
  ready: async () => { await screen.findByTestId('sponsor-row-a1'); await screen.findByTestId('sponsor-progress-row-a1'); },
  userId: USER_ID,
});

const setTheme = (theme) => window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, theme);

describe('Settings, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('every tab is clean in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      setTheme(theme);
      renderRoute('/dashboard/settings');
      await screen.findByText('Profile Information');
      expect(getScopeRoot().getAttribute('data-pl-theme')).toBe(theme);
      for (const tab of ['Preferences', 'Notifications', 'Privacy', 'Account']) {
        openTab(fireEvent, screen.getByRole('tab', { name: new RegExp(tab) }));
        expectNoLegacyChrome();
      }
      cleanup();
    }
  });

  // Owner decision 2026-09-29: the header toggle is the only theme control.
  // The Preferences tab no longer shows the idle Light/Dark/System buttons
  // (they saved user_preferences.theme, which nothing applied). The other
  // preferences on the tab are still there.
  it('the Preferences tab has no theme buttons and keeps language and timezone', async () => {
    renderRoute('/dashboard/settings');
    await screen.findByText('Profile Information');
    openTab(fireEvent, screen.getByRole('tab', { name: /Preferences/ }));
    const panel = await screen.findByRole('tabpanel');
    const { getByText, queryByText, queryByRole } = within(panel);
    expect(getByText('Language')).toBeTruthy();
    expect(getByText('Timezone')).toBeTruthy();
    expect(queryByText('Theme Preference')).toBeNull();
    for (const name of ['Light', 'Dark', 'System']) {
      expect(queryByRole('button', { name })).toBeNull();
    }
    expect(panel.querySelector('[aria-pressed]')).toBeNull();
  });

  it('the deactivate dialog opens in a themed portal and is clean in dark', async () => {
    setTheme('dark');
    renderRoute('/dashboard/settings');
    await screen.findByText('Profile Information');
    fireEvent.click(screen.getByRole('button', { name: 'Deactivate Account' }));
    const title = await screen.findByText('Are you absolutely sure?');
    expect(title.closest('[data-pl-theme]').getAttribute('data-pl-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Continue Deactivation' }).className).toContain('bg-pl-danger');
    expectNoLegacyChrome();
  });
});

describe('Notification center, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('the inbox (all four types, read and unread) and the preferences tab are clean in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      setTheme(theme);
      renderRoute('/dashboard/notifications');
      await screen.findByText('Seat expiring');
      for (const label of ['Success', 'Warning', 'Error', 'Information']) {
        expect(screen.getByRole('img', { name: label })).toBeTruthy();
      }
      expectNoLegacyChrome();
      openTab(fireEvent, screen.getByRole('tab', { name: 'Preferences' }));
      await screen.findByText('Delivery Channels');
      expectNoLegacyChrome();
      cleanup();
    }
  });

  it('a search with no match shows the themed empty state', async () => {
    renderRoute('/dashboard/notifications');
    await screen.findByText('Seat expiring');
    fireEvent.change(screen.getByPlaceholderText('Search notifications...'), { target: { value: 'zzz' } });
    await screen.findByText('No notifications found');
    expectNoLegacyChrome();
  });
});

describe('Sponsor console, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('pool states, the report, an open progress row and the cancel box are clean in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      setTheme(theme);
      renderRoute('/dashboard/sponsor', { role: 'admin' });
      await screen.findByTestId('sponsor-row-a1');
      expect(screen.getByTestId('sponsor-pool-p1').getAttribute('aria-pressed')).toBe('true');
      expect(screen.getByText(/^Expired/).className).toContain('text-pl-danger-text');
      fireEvent.click(await screen.findByTestId('sponsor-progress-row-a1'));
      await screen.findByTestId('sponsor-progress-detail-a1');
      expect(screen.getByLabelText('inactive')).toBeTruthy();
      fireEvent.click(screen.getByTestId('sponsor-cancel-a1'));
      await screen.findByTestId('sponsor-cancel-box');
      expectNoLegacyChrome();
      cleanup();
    }
  });

  it('a user who leads no sponsor sees the themed notice', async () => {
    data.pools = [];
    renderRoute('/dashboard/sponsor');
    await screen.findByTestId('sponsor-none');
    expectNoLegacyChrome();
  });

  it('learner progress that fails to load is clean', async () => {
    data.progress = 'fail';
    renderRoute('/dashboard/sponsor', { role: 'admin' });
    await screen.findByTestId('sponsor-progress-error');
    expectNoLegacyChrome();
  });
});
