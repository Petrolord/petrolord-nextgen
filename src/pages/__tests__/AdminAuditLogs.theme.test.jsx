// @vitest-environment jsdom
//
// Batch 2B: the audit log table and its detail dialog render inside the
// signed-in scope, mounted as the route mounts them.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import { renderAdmin, toggleTheme, USER_ID } from './admin2bHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2bStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/lib/userUtils', async () => (await import('./admin2bStubs')).userUtilsStub());
vi.mock('@/lib/auditLogger', async () => (await import('./admin2bStubs')).auditLoggerStub());

const ROUTE = '/dashboard/admin/audit-logs';

describeScreenTheme({
  name: 'Audit logs',
  route: ROUTE,
  renderScreen: () => renderAdmin(ROUTE),
  ready: () => screen.findByText('Role changed to lecturer'),
  userId: USER_ID,
});

describe('Audit logs, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('each outcome reads as a word next to its icon', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('Role changed to lecturer');
    const ok = screen.getAllByText('Success').find((el) => el.closest('td'));
    const bad = screen.getAllByText('Failure').find((el) => el.closest('td'));
    expect(ok.className).toContain('text-pl-success-text');
    expect(bad.className).toContain('text-pl-danger-text');
  });

  it('the detail dialog with its old and new values stays on roles in light and dark', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('Role changed to lecturer');
    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0]);
    const dlg = await screen.findByRole('dialog');
    expect(within(dlg).getByText('Old Value')).toBeTruthy();
    expect(dlg.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
