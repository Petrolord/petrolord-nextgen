// @vitest-environment jsdom
//
// Batch 2C: live monitoring (/dashboard/admin/monitoring) inside the
// signed-in scope, with its stat cards, event stream and status words.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import RealTimeMonitoringPage from '@/pages/RealTimeMonitoringPage';
import { renderAdminRoute, toggleTheme, USER_ID } from './admin2cHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2cStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());

const ROUTE = '/dashboard/admin/monitoring';
const mount = () => renderAdminRoute(ROUTE, <RealTimeMonitoringPage />);

describeScreenTheme({
  name: 'Live monitoring',
  route: ROUTE,
  renderScreen: mount,
  ready: () => screen.findByText('certificate-pdf'),
  userId: USER_ID,
});

describe('Live monitoring, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('each event outcome reads as a word on its status role, in light and dark', async () => {
    mount();
    await screen.findByText('certificate-pdf');
    const ok = screen.getAllByText('Success')[0];
    const bad = screen.getByText('Failure');
    expect(ok.className).toContain('text-pl-success-text');
    expect(bad.className).toContain('text-pl-danger-text');
    expect(screen.getByText('SYSTEM_ERROR').className).toContain('text-pl-danger-text');
    expect(screen.getAllByText('n/a').length).toBeGreaterThan(0);
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
