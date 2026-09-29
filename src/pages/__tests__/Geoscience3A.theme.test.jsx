// @vitest-environment jsdom
//
// Batch 3A: the geoscience I course apps (Petrophysics, Well Data, Well
// Correlation, Seismolord, Mapping) mounted as their routes mount them, in
// Layout with the header toggle, a signed-in user and mocked services. No
// request reaches Supabase (the client is the frame harness's throwing stub).
// Each screen: light by default, toggle round trip, no legacy chrome with a
// negative control, route registered; then every tier, the capstone results,
// the Learning Mode gate and dark, all clean, with every chart on the white
// chart kit and no lime left.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { isThemedPath } from '@/design/scopePaths';
import { renderCourseApp as renderApp, USER_ID } from './geo3aHarness';
import { GEO3A_APPS } from './geo3aStubs';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => ({
  ...(await import('./frameStubs')).academyServiceStub(),
  ...(await import('./geo3aStubs')).geo3aServiceExtras(),
}));

const TIMEOUT = 30000;
const heading = (title) => screen.findByRole('heading', { level: 1, name: new RegExp(title) }, { timeout: 5000 });

const expectChartsWhite = () => {
  const scope = getScopeRoot();
  for (const svg of scope.querySelectorAll('svg[role="img"]')) {
    expect(svg.closest('[data-canvas="chart"]')).not.toBeNull();
  }
  for (const rc of scope.querySelectorAll('.recharts-responsive-container')) {
    expect(rc.closest('[data-canvas="chart"]')).not.toBeNull();
  }
  expect(document.body.innerHTML).not.toMatch(/BFFF00|A8E600|f472b6|38bdf8/i);
};

for (const app of GEO3A_APPS) {
  const route = `/dashboard/apps/${app.slug}`;

  describeScreenTheme({
    name: `${app.title} (3A)`,
    route,
    renderScreen: () => renderApp(route),
    ready: () => heading(app.title),
    userId: USER_ID,
  });

  describe(`${app.title}: tiers, capstone, gate and dark`, () => {
    beforeAll(installDomShims);
    beforeEach(() => { window.localStorage.clear(); globalThis.__geo3a = {}; });
    afterEach(() => { cleanup(); globalThis.__geo3a = undefined; });

    it('every tier and both capstone outcomes are clean in light and dark', async () => {
      renderApp(route);
      await heading(app.title);
      for (const tier of ['beginner', 'intermediate', 'advanced']) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${tier} tier$`, 'i') }));
        const submit = await screen.findByRole('button', { name: /Submit for grading/ });
        expectNoLegacyChrome();
        expectChartsWhite();
        globalThis.__geo3a = { pass: tier !== 'intermediate' };
        await waitFor(() => expect(submit.disabled).toBe(false));
        fireEvent.click(submit);
        await screen.findAllByText(/within tolerance|Passed/, undefined, { timeout: 5000 });
        expectNoLegacyChrome();
        expectChartsWhite();
      }
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
      expectNoLegacyChrome();
      expectChartsWhite();
    }, TIMEOUT);

    it('the Learning Mode gate is clean', async () => {
      globalThis.__geo3a = { allowed: false };
      renderApp(route);
      await screen.findByText(/Learning Mode locked/, undefined, { timeout: 5000 });
      expectNoLegacyChrome();
    }, TIMEOUT);
  });
}

describe('3A registry', () => {
  it('registers the five app routes (a test-only route stays out)', () => {
    for (const app of GEO3A_APPS) {
      expect(isThemedPath(`/dashboard/apps/${app.slug}`)).toBe(true);
    }
    expect(isThemedPath('/legacy-probe')).toBe(false);
  });
});
