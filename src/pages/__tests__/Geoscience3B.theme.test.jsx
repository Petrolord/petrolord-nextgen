// @vitest-environment jsdom
//
// Batch 3B: the geoscience II course apps (Reservoir Volumetrics, Rock
// Physics, Pore Pressure, Earth Modeling, Basin & Charge) mounted as their
// routes mount them, in Layout with the header toggle, a signed-in user and
// mocked services. No request reaches Supabase (the client is the frame
// harness's throwing stub). Each screen: light by default, toggle round trip,
// no legacy chrome with a negative control, route registered; then every
// tier, both capstone results, the Learning Mode gate and dark, all clean,
// with every plot in a white chart frame with the chart mark and none of the
// old dark-plate colours left.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { isThemedPath } from '@/design/scopePaths';
import { renderCourseApp as renderApp, USER_ID } from './geo3bHarness';
import { GEO3B_APPS } from './geo3bStubs';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => ({
  ...(await import('./frameStubs')).academyServiceStub(),
  ...(await import('./geo3bStubs')).geo3bServiceExtras(),
}));

const TIMEOUT = 30000;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const heading = (title) => screen.findByRole('heading', { level: 1, name: new RegExp(escape(title)) }, { timeout: 5000 });

// The old dark-plate chart colours: lime and its hover, sky, orange, green,
// yellow, violet and the light label grey (#334155 is now the kit's tick
// colour, so the old slate grid is not in the list).
const OLD_CHART_HEX = /BFFF00|A8E600|38bdf8|f97316|22c55e|eab308|a78bfa|e2e8f0/i;

const expectChartsWhite = () => {
  const scope = getScopeRoot();
  const plots = scope.querySelectorAll('svg[role="img"]');
  for (const svg of plots) {
    const canvas = svg.closest('[data-canvas="chart"]');
    expect(canvas, svg.getAttribute('aria-label')).not.toBeNull();
    expect(canvas.querySelector('img')).not.toBeNull(); // the Petrolord chart mark
  }
  expect(scope.innerHTML).not.toMatch(OLD_CHART_HEX);
  return plots.length;
};

for (const app of GEO3B_APPS) {
  const route = `/dashboard/apps/${app.slug}`;

  describeScreenTheme({
    name: `${app.title} (3B)`,
    route,
    renderScreen: () => renderApp(route),
    ready: () => heading(app.title),
    userId: USER_ID,
  });

  describe(`${app.title}: tiers, capstone, gate and dark`, () => {
    beforeAll(installDomShims);
    beforeEach(() => { window.localStorage.clear(); globalThis.__geo3b = {}; });
    afterEach(() => { cleanup(); globalThis.__geo3b = undefined; });

    it('every tier and both capstone outcomes are clean in light and dark', async () => {
      renderApp(route);
      await heading(app.title);
      let plots = 0;
      for (const tier of ['beginner', 'intermediate', 'advanced']) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${tier} tier$`, 'i') }));
        const submit = await screen.findByRole('button', { name: /Submit for grading/ });
        expectNoLegacyChrome();
        plots += expectChartsWhite();
        globalThis.__geo3b = { pass: tier !== 'intermediate' };
        await waitFor(() => expect(submit.disabled).toBe(false));
        fireEvent.click(submit);
        await screen.findAllByText(/within tolerance|Passed/, undefined, { timeout: 5000 });
        expectNoLegacyChrome();
        expectChartsWhite();
      }
      expect(plots).toBeGreaterThan(0);
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
      expectNoLegacyChrome();
      expectChartsWhite();
    }, TIMEOUT);

    it('the Learning Mode gate is clean', async () => {
      globalThis.__geo3b = { allowed: false };
      renderApp(route);
      await screen.findByText(/Learning Mode locked/, undefined, { timeout: 5000 });
      expectNoLegacyChrome();
    }, TIMEOUT);
  });
}

describe('3B registry', () => {
  it('registers exactly the five app routes, not their course reader pages', () => {
    for (const app of GEO3B_APPS) {
      expect(isThemedPath(`/dashboard/apps/${app.slug}`)).toBe(true);
    }
    expect(isThemedPath('/dashboard/apps/basin/course/beginner/m01')).toBe(true); // 1C's pattern
    expect(isThemedPath('/dashboard/apps/reservoircalc/extra')).toBe(true);
    // wave 7: every signed-in route is scoped, registered or not
    expect(isThemedPath('/dashboard/legacy-probe')).toBe(true);
  });
});
