// @vitest-environment jsdom
//
// Batch 4A: the production I course apps (Nodal Analysis and Well
// Performance, Gas Lift Design, ESP Design) mounted as their routes mount
// them, in Layout with the header toggle, a signed-in user and mocked
// services. No request reaches Supabase (the client is the frame harness's
// throwing stub). Each screen: light by default, toggle round trip, no legacy
// chrome with a negative control, route registered; then every tier (each
// shows its own panel), both capstone results, the Learning Mode gate and
// dark, all clean, with every chart in a white chart frame carrying the chart
// mark and none of the old dark-plate colours left.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { isThemedPath } from '@/design/scopePaths';
import { renderCourseApp as renderApp, USER_ID } from './prod4aHarness';
import { PROD4A_APPS } from './prod4aStubs';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('./frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => ({
  ...(await import('./frameStubs')).academyServiceStub(),
  ...(await import('./prod4aStubs')).prod4aServiceExtras(),
}));

const TIMEOUT = 60000;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const heading = (title) => screen.findByRole('heading', { level: 1, name: new RegExp(escape(title)) }, { timeout: 10000 });

// The old dark-plate chart colours these panels drew with: lime and its
// hover, sky, orange, pink, the reds and rose, emerald and the near-white
// reference grey.
const OLD_CHART_HEX = /BFFF00|A8E600|38bdf8|f97316|f472b6|ef4444|f43f5e|fb7185|34d399|e2e8f0/i;

const expectChartsWhite = () => {
  const scope = getScopeRoot();
  const frames = scope.querySelectorAll('[data-canvas="chart"]');
  for (const frame of frames) {
    expect(frame.className).toMatch(/\bbg-white\b/);
    expect(frame.querySelector('img')).not.toBeNull(); // the Petrolord chart mark
  }
  expect(scope.innerHTML).not.toMatch(OLD_CHART_HEX);
  return frames.length;
};

for (const app of PROD4A_APPS) {
  const route = `/dashboard/apps/${app.slug}`;

  describeScreenTheme({
    name: `${app.title} (4A)`,
    route,
    renderScreen: () => renderApp(route),
    ready: () => heading(app.title),
    userId: USER_ID,
  });

  describe(`${app.title}: tiers, capstone, gate and dark`, () => {
    beforeAll(installDomShims);
    beforeEach(() => { window.localStorage.clear(); globalThis.__prod4a = {}; });
    afterEach(() => { cleanup(); globalThis.__prod4a = undefined; });

    it('every tier and both capstone outcomes are clean in light and dark', async () => {
      renderApp(route);
      await heading(app.title);
      let frames = 0;
      for (const tier of ['beginner', 'intermediate', 'advanced']) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${tier} tier$`, 'i') }));
        const submit = await screen.findByRole('button', { name: /Submit for grading/ });
        expectNoLegacyChrome();
        frames += expectChartsWhite();
        globalThis.__prod4a = { pass: tier !== 'intermediate' };
        await waitFor(() => expect(submit.disabled).toBe(false));
        fireEvent.click(submit);
        await screen.findAllByText(/within tolerance|Passed/, undefined, { timeout: 5000 });
        expectNoLegacyChrome();
        expectChartsWhite();
      }
      expect(frames).toBeGreaterThan(0);
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
      expectNoLegacyChrome();
      expectChartsWhite();
    }, TIMEOUT);

    it('the capstone result carries its words on the status roles, the certificate number in gold', async () => {
      globalThis.__prod4a = { pass: true };
      renderApp(route);
      await heading(app.title);
      const submit = await screen.findByRole('button', { name: /Submit for grading/ });
      await waitFor(() => expect(submit.disabled).toBe(false));
      fireEvent.click(submit);
      const passed = await screen.findByText(/Passed \(2\/2\)/, undefined, { timeout: 5000 });
      expect(passed.className).toMatch(/\btext-pl-success-text\b/);
      expect(screen.getByText('NG-4A-0001', { selector: 'span' }).className).toMatch(/\btext-pl-accent-text\b/);
    }, TIMEOUT);

    it('the Learning Mode gate is clean', async () => {
      globalThis.__prod4a = { allowed: false };
      renderApp(route);
      await screen.findByText(/Learning Mode locked/, undefined, { timeout: 5000 });
      expectNoLegacyChrome();
    }, TIMEOUT);
  });
}

describe('4A registry', () => {
  it('registers exactly the three app routes, not their course reader pages', () => {
    for (const app of PROD4A_APPS) {
      expect(isThemedPath(`/dashboard/apps/${app.slug}`)).toBe(true);
    }
    expect(isThemedPath('/dashboard/apps/nodal/course/beginner/m01')).toBe(true); // 1C's pattern
    expect(isThemedPath('/dashboard/apps/gaslift/extra')).toBe(false);
    expect(isThemedPath('/legacy-probe')).toBe(false);
  });
});
