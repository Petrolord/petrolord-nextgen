// @vitest-environment jsdom
//
// Batch 2C: system analytics (/dashboard/admin/analytics) inside the
// signed-in scope, with the two charts on white chart canvases.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import AdminReportAnalyticsPage from '@/pages/AdminReportAnalyticsPage';
import { renderAdminRoute, toggleTheme, USER_ID } from './admin2cHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2cStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/lib/reportAnalyticsUtils', async () => (await import('./admin2cStubs')).reportAnalyticsStub());

const ROUTE = '/dashboard/admin/analytics';
const mount = () => renderAdminRoute(ROUTE, <AdminReportAnalyticsPage />);

describeScreenTheme({
  name: 'System analytics',
  route: ROUTE,
  renderScreen: mount,
  ready: () => screen.findByText('Recent Reports'),
  userId: USER_ID,
});

describe('System analytics, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('both charts are white chart canvases and the empty author cell reads n/a', async () => {
    mount();
    await screen.findByText('Recent Reports');
    expect(screen.getByText('Actions Over Time').closest('[data-canvas="chart"]')).toBeTruthy();
    expect(screen.getByText('Anonymization Rule Distribution').closest('[data-canvas="chart"]')).toBeTruthy();
    expect(screen.getByText('n/a').tagName).toBe('TD');
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
