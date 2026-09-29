// @vitest-environment jsdom
//
// Batch 3C: the seven reservoir course apps (DCA, material balance, SCAL,
// waterflood, simulation, fluid, well test) render inside the signed-in
// scope, mounted as their routes mount them (Layout, header, DashboardPage).
// Each opens light, toggles to dark and back, and leaves no legacy console
// colour outside its white charts; the tier panels, the capstone form and
// both grading outcomes stay on roles in light and in dark. Services are
// stubbed, so no request reaches Supabase.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { renderCourseApp as renderApp, USER_ID } from './rc3cHarness';

const grading = vi.hoisted(() => ({ pass: true }));

vi.mock('@/lib/customSupabaseClient', async () => (await import('../../__tests__/frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('../../__tests__/frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => ({
  ...(await import('../../__tests__/frameStubs')).academyServiceStub(),
  hasScope: async () => true,
  getQuota: async () => ({ own_data_upload: false, export_watermark: true }),
  getCourseProgress: async () => ({ capstone: { unlocked: true, passed: false } }),
  getCapstone: async (app, tier) => ({
    title: `${app} ${tier} capstone`,
    prompt: 'Work the case the brief states.',
    fields: [{ key: 'answer_one', label: 'First answer', unit: 'stb' }, { key: 'answer_two', label: 'Second answer', unit: 'psi' }],
  }),
  submitCapstone: async (app, tier) => (grading.pass
    ? { passed: true, score: 2, max_score: 2, tier: 'associate', certificate_number: 'NG-TEST-0001', verify_code: 'abc' }
    : { passed: false, score: 1, max_score: 2, tier }),
  verificationUrl: (code) => `/verify/${code}`,
}));

const APPS = [
  { slug: 'dca', title: 'Decline Curve Analysis' },
  { slug: 'mbal', title: 'Material Balance' },
  { slug: 'scal', title: 'SCAL' },
  { slug: 'waterflood', title: 'Waterflood' },
  { slug: 'sim', title: 'Simulation' },
  { slug: 'fluid', title: 'Fluid' },
  { slug: 'welltest', title: 'Well Test' },
];

const heading = (title) => screen.findByRole('heading', { level: 1, name: new RegExp(title) }, { timeout: 5000 });

for (const app of APPS) {
  describeScreenTheme({
    name: `${app.title} learning page`,
    route: `/dashboard/apps/${app.slug}`,
    renderScreen: () => renderApp(`/dashboard/apps/${app.slug}`),
    ready: () => heading(app.title),
    userId: USER_ID,
  });
}

describe('reservoir course apps, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => { window.localStorage.clear(); grading.pass = true; });
  afterEach(cleanup);

  for (const app of APPS) {
    it(`${app.title}: every tier, the capstone form and both results stay on roles in light and dark`, async () => {
      renderApp(`/dashboard/apps/${app.slug}`);
      await heading(app.title);
      for (const tier of ['intermediate', 'advanced', 'beginner']) {
        fireEvent.click(screen.getByRole('button', { name: `${tier} tier` }));
        await screen.findByText(`${app.slug} ${tier} capstone`);
        expectNoLegacyChrome();
      }
      fireEvent.change(screen.getAllByRole('textbox').at(-2), { target: { value: '1' } });
      fireEvent.click(screen.getByRole('button', { name: /Submit for grading/ }));
      expect((await screen.findAllByText(/NG-TEST-0001/)).length).toBeGreaterThan(0);
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
      // lime is retired from the page (the charts are the white kit)
      expect(document.body.innerHTML).not.toMatch(/BFFF00|A8E600/i);
      // every drawing on the page that is not an icon sits on a white chart canvas
      for (const svg of document.querySelectorAll('svg:not([stroke="currentColor"])')) {
        expect(svg.closest('[data-canvas="chart"]')).not.toBeNull();
      }
    }, 30000);
  }
});
