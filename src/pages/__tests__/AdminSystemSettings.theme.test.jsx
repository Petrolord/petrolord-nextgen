// @vitest-environment jsdom
//
// Batch 2B: system configuration (general, license, email, security,
// feature flags, maintenance) renders inside the signed-in scope, mounted
// as its route mounts it.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { renderAdmin, openTab, toggleTheme, USER_ID } from './admin2bHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./admin2bStubs')).supabaseFake());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./admin2bStubs')).academyServiceStub());
vi.mock('@/services/systemSettingsService', async () => (await import('./admin2bStubs')).systemSettingsServiceStub());
vi.mock('@/hooks/useSystemSettings', async () => (await import('./admin2bStubs')).useSystemSettingsStub());

const ROUTE = '/dashboard/admin/settings';

describeScreenTheme({
  name: 'System settings',
  route: ROUTE,
  renderScreen: () => renderAdmin(ROUTE),
  ready: () => screen.findByText('General Configuration'),
  userId: USER_ID,
});

describe('System settings, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  const tabs = ['License', 'Email', 'Security', 'Features', 'Maintenance'];

  it('every tab stays on roles in light and dark', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('General Configuration');
    for (const theme of ['light', 'dark']) {
      if (theme === 'dark') toggleTheme(screen);
      expect(getScopeRoot().getAttribute('data-pl-theme')).toBe(theme);
      for (const name of tabs) {
        openTab(screen.getByRole('tab', { name: new RegExp(name) }));
        expectNoLegacyChrome();
      }
      openTab(screen.getByRole('tab', { name: /General/ }));
    }
  });

  it('feature states and health checks read as words on the status roles', async () => {
    renderAdmin(ROUTE);
    await screen.findByText('General Configuration');
    openTab(screen.getByRole('tab', { name: /Features/ }));
    expect(screen.getByText('Enabled').className).toContain('text-pl-success-text');
    expect(screen.getByText('Disabled').className).toContain('text-pl-muted');
    openTab(screen.getByRole('tab', { name: /Email/ }));
    expect(screen.getByRole('alert').className).toContain('bg-pl-info-bg');
    openTab(screen.getByRole('tab', { name: /Maintenance/ }));
    expect(screen.getByText('Healthy').className).toContain('text-pl-success-text');
  });
});
