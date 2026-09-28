// @vitest-environment jsdom
//
// Batch 2B: the user directory, its row menu, the detail and edit dialogs
// and the delete confirmation render inside the signed-in scope, mounted as
// the route mounts them.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import { renderAdmin, toggleTheme, USER_ID } from './admin2bHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2bStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/lib/userUtils', async () => (await import('./admin2bStubs')).userUtilsStub());

const ROUTE = '/dashboard/admin/users';

describeScreenTheme({
  name: 'User directory',
  route: ROUTE,
  renderScreen: () => renderAdmin(ROUTE),
  ready: () => screen.findByText('ngozi@example.com'),
  userId: USER_ID,
});

describe('User directory, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  const rowMenu = (email) => {
    const row = screen.getByText(email).closest('tr');
    fireEvent.keyDown(within(row).getByRole('button', { name: 'User actions' }), { key: 'Enter' });
  };

  it('role and status badges carry their words on roles', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('ngozi@example.com');
    expect(screen.getByText('super admin').className).toContain('text-pl-accent-text');
    expect(screen.getByText('Inactive').className).toContain('text-pl-muted');
    expect(screen.getAllByText('Active')[0].className).toContain('text-pl-success-text');
  });

  it('the row menu and the detail dialog open in scoped portals, light and dark', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('ngozi@example.com');
    rowMenu('ngozi@example.com');
    const view = await screen.findByText('View Details');
    expect(view.closest('[data-pl-theme]').getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    fireEvent.click(view);
    const dlg = await screen.findByRole('dialog');
    await within(dlg).findByText('Geoscience');
    expect(dlg.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    fireEvent.click(within(dlg).getByRole('button', { name: 'Edit User' }));
    await screen.findByText(/Update the role and status/);
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });

  it('the delete confirmation shows its warnings on the status roles', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('musa@example.com');
    rowMenu('musa@example.com');
    fireEvent.click(await screen.findByText('Delete Permanently'));
    const alert = await screen.findByRole('alertdialog');
    expect(within(alert).getByText('University Admin Detected')).toBeTruthy();
    expect(alert.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
