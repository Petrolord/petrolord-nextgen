// @vitest-environment jsdom
//
// Batch 2C: /dashboard/reports (Compliance Reports) inside the signed-in
// scope: the criteria panel, the side panels, a generated report with its
// summary, detail table and status words, and the schedule dialog.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import AdminComplianceReportsPage from '@/pages/AdminComplianceReportsPage';
import { renderAdminRoute, toggleTheme, USER_ID } from './admin2cHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2cStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/lib/complianceReportsUtils', async () => (await import('./admin2cStubs')).complianceReportsStub());
vi.mock('@/lib/reportAnalyticsUtils', async () => (await import('./admin2cStubs')).reportAnalyticsStub());
vi.mock('@/lib/reportExportUtils', async () => (await import('./admin2cStubs')).reportExportStub());

const ROUTE = '/dashboard/reports';
const mount = () => renderAdminRoute(ROUTE, <AdminComplianceReportsPage />);

describeScreenTheme({
  name: 'Compliance reports',
  route: ROUTE,
  renderScreen: mount,
  ready: () => screen.findByText('Select criteria and generate a report.'),
  userId: USER_ID,
});

describe('Compliance reports, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('a generated report keeps its status words on the status roles, in light and dark', async () => {
    mount();
    await screen.findByText('Select criteria and generate a report.');
    fireEvent.click(screen.getByRole('button', { name: 'Generate Report' }));
    await screen.findByText('System Activity Report');
    const inTable = (word) => screen.getAllByText(word).find((el) => el.closest('td'));
    expect(inTable('Success').className).toContain('text-pl-success-text');
    expect(inTable('Failure').className).toContain('text-pl-danger-text');
    expect(inTable('Completed').className).toContain('text-pl-info-text');
    expect(screen.getAllByText('n/a').length).toBeGreaterThan(0);
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });

  it('the schedule dialog and the anonymization panel stay on roles', async () => {
    mount();
    await screen.findByText('Select criteria and generate a report.');
    fireEvent.click(screen.getByRole('switch'));
    await screen.findByText('Student Name');
    fireEvent.click(screen.getByRole('button', { name: /Schedule/ }));
    const dlg = await screen.findByRole('dialog');
    expect(dlg.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
