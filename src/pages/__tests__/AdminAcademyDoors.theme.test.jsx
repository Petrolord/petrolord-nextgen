// @vitest-environment jsdom
//
// Batch 2B: the academy doors console (entry codes, sponsor pools,
// residency queue, session monitoring, reviewer door) renders inside the
// signed-in scope, mounted as its route mounts it.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot, legacyChromeClasses } from '@/design/testing/themeAssertions';
import { renderAdmin, openTab, toggleTheme, USER_ID } from './admin2bHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2bStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());

const ROUTE = '/dashboard/admin/academy-doors';

describeScreenTheme({
  name: 'Academy doors',
  route: ROUTE,
  renderScreen: () => renderAdmin(ROUTE),
  ready: () => screen.findByText('COHORT-UNILAG-26'),
  userId: USER_ID,
});

describe('Academy doors, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  const tabs = ['Sponsor pools', 'Residency queue', 'Session monitoring', 'Review access'];

  it('every tab stays on roles in light and dark, with status words on the status roles', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('COHORT-UNILAG-26');
    expect(screen.getByText('n/a')).toBeTruthy(); // the empty organisation cell
    for (const theme of ['light', 'dark']) {
      if (theme === 'dark') toggleTheme(screen);
      expect(getScopeRoot().getAttribute('data-pl-theme')).toBe(theme);
      for (const name of tabs) {
        openTab(screen.getByRole('tab', { name: new RegExp(name) }));
        expectNoLegacyChrome();
      }
      openTab(screen.getByRole('tab', { name: /Entry codes/ }));
      expectNoLegacyChrome();
    }
  });

  it('residency and session status words carry the status roles', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('COHORT-UNILAG-26');
    openTab(screen.getByRole('tab', { name: /Residency queue/ }));
    expect(screen.getByText('pending').className).toBe('text-pl-warning-text');
    expect(screen.getByText('accepted').className).toBe('text-pl-success-text');
    expect(screen.getByText('rejected').className).toBe('text-pl-danger-text');
    openTab(screen.getByRole('tab', { name: /Session monitoring/ }));
    expect(screen.getByText('Blocked (limit)').className).toContain('text-pl-danger-text');
    expect(screen.getByText('Device registered').className).toContain('text-pl-success-text');
  });

  it('the sponsor pools form and the reviewer result stay on roles', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('COHORT-UNILAG-26');
    openTab(screen.getByRole('tab', { name: /Sponsor pools/ }));
    const pools = await screen.findByTestId('admin-sponsor-pools');
    fireEvent.click(within(pools).getByTestId('admin-offer-starter'));
    expect(within(pools).getByText(/Starter block: 16 of 20 left/)).toBeTruthy();
    expectNoLegacyChrome();
    openTab(screen.getByRole('tab', { name: /Review access/ }));
    fireEvent.click(screen.getByRole('button', { name: /Grant \/ refresh/ }));
    await screen.findByText(/Tiers awaiting ladder progression/);
    expectNoLegacyChrome();
    toggleTheme(screen);
    expectNoLegacyChrome();
  });

  it('a route the rollout has not reached keeps the legacy frame (negative control)', async () => {
    renderAdmin('/legacy-probe');
    await screen.findByText('Legacy probe');
    expect(document.querySelector('[data-pl-theme]:not([data-testid="sidebar-rail"])')).toBeNull();
    expect(screen.queryByTestId('theme-toggle')).toBeNull();
    expect(legacyChromeClasses()).toEqual([]);
  });
});
