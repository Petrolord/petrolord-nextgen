// @vitest-environment jsdom
//
// Batch 1A: the engineering modules placeholder (/dashboard/modules/*)
// renders inside the signed-in scope.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { renderApp, USER_ID } from './frameHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('./frameStubs')).academyServiceStub());

describeScreenTheme({
  name: 'Engineering modules placeholder',
  route: '/dashboard/modules/drilling',
  renderScreen: () => renderApp('/dashboard/modules/drilling'),
  ready: () => screen.findByText('Engineering Modules'),
  userId: USER_ID,
});

describe('Engineering modules placeholder, dark', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('stays clean in dark', async () => {
    renderApp('/dashboard/modules');
    await screen.findByText('Engineering Modules');
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
    expectNoLegacyChrome();
  });
});
