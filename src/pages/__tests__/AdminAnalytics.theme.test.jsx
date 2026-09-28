// @vitest-environment jsdom
//
// Batch 2C: /dashboard/analytics (Analytics & Reporting) inside the
// signed-in scope: the dashboard tab's KPI cards and four white charts, and
// the reports tab with a generated table.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import AdminAnalyticsPage from '@/pages/AdminAnalyticsPage';
import { renderAdminRoute, toggleTheme, openTab, USER_ID } from './admin2cHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2cStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/services/analyticsService', async () => (await import('./admin2cStubs')).analyticsServiceStub());
vi.mock('@/lib/reportExportUtils', async () => (await import('./admin2cStubs')).reportExportStub());

const ROUTE = '/dashboard/analytics';
const mount = () => renderAdminRoute(ROUTE, <AdminAnalyticsPage />);

describeScreenTheme({
  name: 'Analytics and reporting',
  route: ROUTE,
  renderScreen: mount,
  ready: () => screen.findByText('Enrollments by Door'),
  userId: USER_ID,
});

describe('Analytics and reporting, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('every dashboard chart sits on a white chart canvas', async () => {
    mount();
    await screen.findByText('Enrollments by Door');
    for (const title of ['User Growth Trend', 'Enrollment Status', 'Daily Activity (Session Events, 14 Days)', 'Enrollments by Door']) {
      expect(screen.getByText(title).closest('[data-canvas="chart"]')).toBeTruthy();
    }
  });

  it('the reports tab and a generated report stay on roles in light and dark', async () => {
    mount();
    await screen.findByText('Enrollments by Door');
    openTab(screen.getByRole('tab', { name: /Reports/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Generate Report/ }));
    await screen.findByText('Report Results');
    expect(screen.getByText('n/a').tagName).toBe('TD');
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
