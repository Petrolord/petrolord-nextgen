// @vitest-environment jsdom
//
// Compliance Reports date range. "Last 30 Days" (the default) used to start
// on day 30 of the current month: `to.getDate() - {...}[key] || 30` parsed as
// `(to.getDate() - undefined) || 30`, so setDate(30). The range must start
// 30 days before today, and 7 and 90 days keep working.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import AdminComplianceReportsPage from '@/pages/AdminComplianceReportsPage';
import { renderAdminRoute } from './admin2cHarness';

const ranges = [];
vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2cStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/lib/complianceReportsUtils', async () => {
  const stub = (await import('./admin2cStubs')).complianceReportsStub();
  const inner = stub.generateSystemActivityReport;
  return { ...stub, generateSystemActivityReport: async (range) => { ranges.push(range); return inner(range); } };
});
vi.mock('@/lib/reportAnalyticsUtils', async () => (await import('./admin2cStubs')).reportAnalyticsStub());
vi.mock('@/lib/reportExportUtils', async () => (await import('./admin2cStubs')).reportExportStub());

const ROUTE = '/dashboard/reports';
const DAY = 24 * 60 * 60 * 1000;

describe('Compliance reports date range', () => {
  beforeAll(installDomShims);
  beforeEach(() => { window.localStorage.clear(); ranges.length = 0; });
  afterEach(cleanup);

  it('the default Last 30 Days range starts 30 days before today', async () => {
    renderAdminRoute(ROUTE, <AdminComplianceReportsPage />);
    await screen.findByText('Select criteria and generate a report.');
    fireEvent.click(screen.getByRole('button', { name: 'Generate Report' }));
    await waitFor(() => expect(ranges.length).toBe(1));
    const { from, to } = ranges[0];
    const expected = new Date(to);
    expected.setDate(expected.getDate() - 30);
    expect(from.toDateString()).toBe(expected.toDateString());
    expect(from.getTime()).toBeLessThan(to.getTime());
    const days = Math.round((to.getTime() - from.getTime()) / DAY);
    expect(days).toBeGreaterThanOrEqual(29);
    expect(days).toBeLessThanOrEqual(31);
  });
});
