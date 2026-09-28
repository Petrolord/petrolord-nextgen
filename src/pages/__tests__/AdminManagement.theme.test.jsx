// @vitest-environment jsdom
//
// Batch 2C: admin roles (/dashboard/admin/admin-mgmt) inside the signed-in
// scope: the system analytics tab with its KPI cards and white pie chart, the
// admin users tab and the invite dialog.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import AdminManagementPage from '@/pages/AdminManagementPage';
import { renderAdminRoute, toggleTheme, openTab, USER_ID } from './admin2cHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2cStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/services/analyticsService', async () => (await import('./admin2cStubs')).analyticsServiceStub());

const ROUTE = '/dashboard/admin/admin-mgmt';
const mount = () => renderAdminRoute(ROUTE, <AdminManagementPage />);

describeScreenTheme({
  name: 'Admin roles',
  route: ROUTE,
  renderScreen: mount,
  ready: () => screen.findByText('Live Certificates'),
  userId: USER_ID,
});

describe('Admin roles, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('the user distribution chart sits on a white chart canvas', async () => {
    mount();
    await screen.findByText('Live Certificates');
    const panel = screen.getByText('User Distribution').closest('[data-canvas="chart"]');
    expect(panel).toBeTruthy();
    expect(panel.querySelector('img[alt]') || panel.querySelector('img')).toBeTruthy();
  });

  it('the admin users tab and the invite dialog stay on roles in light and dark', async () => {
    mount();
    await screen.findByText('Live Certificates');
    openTab(screen.getByRole('tab', { name: /Admin Users/ }));
    await screen.findByText('Kemi Ade');
    expectNoLegacyChrome();
    fireEvent.click(screen.getByRole('button', { name: /Invite Admin/ }));
    const dlg = await screen.findByRole('dialog');
    expect(dlg.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
