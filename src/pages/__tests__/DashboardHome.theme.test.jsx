// @vitest-environment jsdom
//
// Wave 0 pilot (docs/scope/DesignSystem-Rollout.md): the dashboard home at
// /dashboard, mounted as its route mounts it (Layout, header, DashboardPage),
// renders inside the one signed-in scope: grey panel light by default, the
// header toggle switches to dark and back and stores the choice under
// petrolord.theme.v1:<user id>, and no legacy console colour is left
// outside canvases, menus included. A route the rollout has not reached
// keeps the legacy frame (the gate's negative control).
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '@/contexts/SupabaseAuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { ApplicationLayoutProvider } from '@/contexts/ApplicationLayoutContext';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import { installDomShims } from '@/design/testing/domShims';
import {
  describeScreenTheme, expectNoLegacyChrome, getScopeRoot, legacyChromeClasses,
} from '@/design/testing/themeAssertions';

vi.mock('@/services/academyService', async (importOriginal) => ({
  ...(await importOriginal()),
  listAcademyApps: async () => [
    { slug: 'petrophysics', name: 'Petrophysics', module: 'geoscience', status: 'available' },
    { slug: 'dca', name: 'Decline Curve Analysis', module: 'reservoir', status: 'available' },
  ],
  listMyEnrollments: async () => [
    { id: 'e1', app_slug: 'dca', course_tier: 'intermediate', door: 'self', status: 'active', created_at: '2026-09-20T10:00:00Z' },
  ],
  listMyCertifications: async () => [
    { id: 'c1', app_slug: 'petrophysics', tier: 'beginner', issued_at: '2026-09-10T10:00:00Z', valid_until: '2099-01-01T00:00:00Z', revoked_at: null },
  ],
  getActivationStatus: async () => ({ activated: false, orientation_completed: false }),
  mySponsorPools: async () => [],
}));

vi.mock('@/contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }) => children,
  useNotifications: () => ({
    notifications: [{ id: 'n1', title: 'Certificate issued', message: 'Ready', created_at: '2026-09-27T10:00:00Z', is_read: false }],
    unreadCount: 1,
    markAllAsRead: () => {},
    markAsRead: () => {},
  }),
}));

const USER_ID = 'pilot-user';
const auth = {
  user: { id: USER_ID, email: 'ada@example.com', user_metadata: {} },
  session: {},
  loading: false,
  isAdmin: false,
  isSuperAdmin: false,
  profile: { display_name: 'Ada Obi', role: 'learner' },
  signOut: async () => {},
};

function renderAt(path) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[path]}>
        <RoleProvider>
          <Routes>
            <Route path="/dashboard/*" element={<ApplicationLayoutProvider><Layout><DashboardPage /></Layout></ApplicationLayoutProvider>} />
            {/* a signed-in route no batch registers (the gate's negative control) */}
            <Route path="/legacy-probe" element={<ApplicationLayoutProvider><Layout><h1>Legacy probe</h1></Layout></ApplicationLayoutProvider>} />
          </Routes>
        </RoleProvider>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describeScreenTheme({
  name: 'Dashboard home (wave 0 pilot)',
  route: '/dashboard',
  renderScreen: () => renderAt('/dashboard'),
  ready: async () => {
    await screen.findByText('Welcome, Ada Obi');
    await screen.findAllByText('Decline Curve Analysis');
  },
  userId: USER_ID,
});

describe('Dashboard home, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('stays clean in dark, and the header and page share the one scope', async () => {
    window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, 'dark');
    renderAt('/dashboard');
    await screen.findAllByText('Decline Curve Analysis');
    const scope = getScopeRoot();
    expect(scope.getAttribute('data-pl-theme')).toBe('dark');
    expect(scope.querySelector('header')).toBeTruthy();
    expect(document.querySelectorAll('[data-pl-root]').length).toBe(1);
    expectNoLegacyChrome();
  });

  it('the user menu opens in a portal on theme roles', async () => {
    renderAt('/dashboard');
    await screen.findByText('Welcome, Ada Obi');
    const trigger = screen.getByText('A').closest('button');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    const logout = await screen.findByText('Log out');
    expect(logout.closest('[data-pl-theme]').getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
  });

  it('a route the rollout has not reached keeps the legacy frame (negative control)', async () => {
    // 1A registered /dashboard/modules/*, so the control mounts Layout on a
    // route no batch registers. The ink rail (1A) is a fixed dark scope on
    // every route; nothing else carries a theme there.
    renderAt('/legacy-probe');
    await screen.findByText('Legacy probe');
    expect(document.querySelector('[data-pl-theme]:not([data-testid="sidebar-rail"])')).toBeNull();
    expect(screen.queryByTestId('theme-toggle')).toBeNull();
    expect(document.querySelector('header').className).toContain('bg-[#1E293B]');
    // the detector finds nothing only because there is no scope to scan
    expect(legacyChromeClasses()).toEqual([]);
  });
});
