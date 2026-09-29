// @vitest-environment jsdom
//
// Batch 2C: /dashboard/compliance (Compliance Center) inside the signed-in
// scope: the dashboard with its alert, the audit log with its severity and
// status words and detail dialog, and the retention policies.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import AdminCompliancePage from '@/pages/AdminCompliancePage';
import { renderAdminRoute, toggleTheme, openTab, USER_ID } from './admin2cHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2cStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/services/auditService', async () => (await import('./admin2cStubs')).auditServiceStub());
vi.mock('@/lib/reportExportUtils', async () => (await import('./admin2cStubs')).reportExportStub());
vi.mock('@/lib/complianceReportsUtils', async () => (await import('./admin2cStubs')).complianceReportsStub());
vi.mock('@/lib/reportAnalyticsUtils', async () => (await import('./admin2cStubs')).reportAnalyticsStub());

const ROUTE = '/dashboard/compliance';
const mount = () => renderAdminRoute(ROUTE, <AdminCompliancePage />);

describeScreenTheme({
  name: 'Compliance center',
  route: ROUTE,
  renderScreen: mount,
  ready: () => screen.findByText('Repeated failed sign in'),
  userId: USER_ID,
});

describe('Compliance center, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('the alert is on the danger roles with its words', async () => {
    mount();
    const title = await screen.findByText('Repeated failed sign in');
    expect(title.className).toContain('text-pl-danger-text');
  });

  it('the audit log shows severity and status as words and its dialog stays on roles', async () => {
    mount();
    await screen.findByText('Repeated failed sign in');
    openTab(screen.getByRole('tab', { name: /Audit Logs/ }));
    await screen.findByText('ROLE_CHANGE');
    expect(screen.getByText('CRITICAL').className).toContain('bg-pl-danger');
    expect(screen.getByText('MEDIUM').className).toContain('text-pl-warning-text');
    expect(screen.getByText('Failure').className).toContain('text-pl-danger-text');
    expectNoLegacyChrome();
    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0]);
    const dlg = await screen.findByRole('dialog');
    expect(within(dlg).getByText('Old Value')).toBeTruthy();
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });

  it('the retention policies stay on roles', async () => {
    mount();
    await screen.findByText('Repeated failed sign in');
    openTab(screen.getByRole('tab', { name: /Policies/ }));
    await screen.findByText('Compliance events');
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
