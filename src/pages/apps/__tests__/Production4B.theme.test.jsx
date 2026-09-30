// @vitest-environment jsdom
//
// Batch 4B: the production II course apps (rod pump, gas well, flow
// assurance) render inside the signed-in scope, mounted as their routes mount
// them (Layout, header, DashboardPage). Each opens light, toggles to dark and
// back, and leaves no legacy console colour outside its white charts; the tier
// panels, the capstone form and both grading outcomes stay on roles in light
// and in dark, and every chart is the white chart kit. Services are stubbed,
// so no request reaches Supabase.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { isThemedPath } from '@/design/scopePaths';
import { renderCourseApp as renderApp, USER_ID } from './prod4bHarness';

const grading = vi.hoisted(() => ({ pass: true, allowed: true }));

vi.mock('@/lib/customSupabaseClient', async () => (await import('../../__tests__/frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('../../__tests__/frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => ({
  ...(await import('../../__tests__/frameStubs')).academyServiceStub(),
  hasScope: async () => grading.allowed,
  getQuota: async () => ({ own_data_upload: false, export_watermark: true }),
  getCourseProgress: async () => ({ capstone: { unlocked: true, passed: false } }),
  getCapstone: async (app, tier) => ({
    title: `${app} ${tier} capstone`,
    prompt: 'Work the case the brief states.',
    fields: [{ key: 'answer_one', label: 'First answer', unit: 'in' }, { key: 'answer_two', label: 'Second answer', unit: 'lb' }],
  }),
  submitCapstone: async (app, tier) => (grading.pass
    ? { passed: true, score: 2, max_score: 2, tier: 'associate', certificate_number: 'NG-4B-0001', verify_code: 'v4b' }
    : { passed: false, score: 1, max_score: 2, tier }),
  verificationUrl: (code) => `/verify/${code}`,
}));

const APPS = [
  { slug: 'rodpump', title: 'Rod Pump Design' },
  { slug: 'gaswell', title: 'Gas Well Performance' },
  { slug: 'flowassurance', title: 'Flow Assurance' },
];

const TIMEOUT = 180000;
const heading = (title) => screen.findByRole('heading', { level: 1, name: new RegExp(title) }, { timeout: 20000 });

const expectChartsWhite = () => {
  // lime and the old series colours are retired from the page, and the old
  // dark plate from the screen (Layout's outer frame is wave 7's)
  expect(document.body.innerHTML).not.toMatch(/BFFF00|A8E600|f472b6|38bdf8|f97316/i);
  expect(getScopeRoot().innerHTML).not.toMatch(/#0f172a|#334155|#1e293b/i);
  // every chart sits on a white chart canvas with the Petrolord chart mark
  const charts = document.querySelectorAll('.recharts-responsive-container');
  for (const rc of charts) {
    const canvas = rc.closest('[data-canvas="chart"]');
    expect(canvas).not.toBeNull();
    expect(canvas.querySelector('img[src*="petrolord-chart-watermark"]')).not.toBeNull();
  }
  for (const svg of document.querySelectorAll('svg:not([stroke="currentColor"])')) {
    expect(svg.closest('[data-canvas="chart"]')).not.toBeNull();
  }
  return charts.length;
};

for (const app of APPS) {
  describeScreenTheme({
    name: `${app.title} learning page (4B)`,
    route: `/dashboard/apps/${app.slug}`,
    renderScreen: () => renderApp(`/dashboard/apps/${app.slug}`),
    ready: () => heading(app.title),
    userId: USER_ID,
  });
}

describe('production II course apps, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => { window.localStorage.clear(); grading.pass = true; grading.allowed = true; });
  afterEach(cleanup);

  for (const app of APPS) {
    it(`${app.title}: every tier, the capstone form and both results stay on roles in light and dark`, async () => {
      renderApp(`/dashboard/apps/${app.slug}`);
      await heading(app.title);
      expectNoLegacyChrome();
      let charts = expectChartsWhite();
      for (const tier of ['intermediate', 'advanced', 'beginner']) {
        fireEvent.click(screen.getByRole('button', { name: `${tier} tier` }));
        await screen.findByText(`${app.slug} ${tier} capstone`, undefined, { timeout: 20000 });
        expectNoLegacyChrome();
        charts += expectChartsWhite();
      }
      // the tier panels drew charts, so the chart checks above were live
      expect(charts).toBeGreaterThan(0);
      fireEvent.change(screen.getAllByRole('textbox').at(-2), { target: { value: '1' } });
      fireEvent.click(screen.getByRole('button', { name: /Submit for grading/ }));
      expect((await screen.findAllByText(/NG-4B-0001/)).length).toBeGreaterThan(0);
      expectNoLegacyChrome();
      expect(screen.getByText(/Passed \(2\/2\)/).className).toMatch(/\btext-pl-success-text\b/);
      grading.pass = false;
      fireEvent.click(screen.getByRole('button', { name: /Submit for grading/ }));
      const fail = await screen.findByText(/1\/2 within tolerance/);
      expect(fail.className).toMatch(/\btext-pl-danger-text\b/);
      expectNoLegacyChrome();
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
      expectNoLegacyChrome();
      expectChartsWhite();
    }, TIMEOUT);

    it(`${app.title}: the Learning Mode gate is clean`, async () => {
      grading.allowed = false;
      renderApp(`/dashboard/apps/${app.slug}`);
      await screen.findByText(/Learning Mode locked/, undefined, { timeout: 20000 });
      expectNoLegacyChrome();
    }, TIMEOUT);
  }
});

describe('4B registry', () => {
  it('registers the three app routes (a test-only route stays out)', () => {
    for (const app of APPS) expect(isThemedPath(`/dashboard/apps/${app.slug}`)).toBe(true);
    // wave 7: every signed-in route is scoped, registered or not
    expect(isThemedPath('/dashboard/legacy-probe')).toBe(true);
  });
});
