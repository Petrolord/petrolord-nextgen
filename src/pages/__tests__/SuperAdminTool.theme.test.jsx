// @vitest-environment jsdom
//
// Batch 2B: the super admin tool (invite form, active list, deactivate
// confirmation) renders inside the signed-in scope, mounted as its route
// mounts it.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome } from '@/design/testing/themeAssertions';
import { renderAdmin, toggleTheme, USER_ID } from './admin2bHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2bStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());

const ROUTE = '/dashboard/admin/super-admins';

describeScreenTheme({
  name: 'Super admins',
  route: ROUTE,
  renderScreen: () => renderAdmin(ROUTE),
  ready: () => screen.findByText('kemi@example.com'),
  userId: USER_ID,
});

describe('Super admins, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('the list marks the current user and shows n/a for a missing name', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('kemi@example.com');
    expect(screen.getByText('YOU').className).toContain('text-pl-accent-text');
    expect(screen.getByText('n/a')).toBeTruthy();
    expect(screen.getByText('2 Active')).toBeTruthy();
  });

  it('the deactivate confirmation opens in a scoped portal, light and dark', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('kemi@example.com');
    fireEvent.click(screen.getByRole('button', { name: /Deactivate/ }));
    const alert = await screen.findByRole('alertdialog');
    expect(alert.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });
});
