// @vitest-environment jsdom
//
// Batch 3E (docs/scope/DesignSystem-Rollout.md): the six drilling II course
// apps (cementing, completion, perforation and sand control, stimulation,
// integrity, well cost), mounted as their routes mount them
// (Layout, header, the signed-in scope, DashboardPage). Each opens light,
// the header toggle goes to dark and back, and no legacy console colour is
// left outside canvases (with a negative control), in every state the page
// can show: each tier with its panels, the locked capstone, the open
// capstone with a pass and a fail, and the Learning Mode gate. Every plot
// sits on the white chart plate with the chart mark. No request leaves the
// test.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { screen, cleanup, fireEvent, waitFor, within } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import {
  describeScreenTheme, expectNoLegacyChrome, getScopeRoot,
} from '@/design/testing/themeAssertions';
import { isThemedPath } from '@/design/scopePaths';
import { renderRoute, installNetworkGuard, USER_ID } from './learnerAccountHarness';

// The 1A frame stub: a Supabase client that throws on any use.
vi.mock('@/lib/customSupabaseClient', async () => (await import('./frameStubs')).supabaseStub());

const data = {};
function resetData() {
  Object.assign(data, {
    allowed: true,
    quota: { export_watermark: true, own_data_upload: false },
    capstone: {
      title: 'Capstone: the test case',
      prompt: 'Work the panels at the capstone settings.',
      fields: [{ key: 'a', label: 'First answer', unit: 'm' }, { key: 'b', label: 'Second answer', unit: 'kN' }],
    },
    progress: { capstone: { unlocked: true, passed: false } },
    result: { passed: true, score: 2, max_score: 2, tier: 'associate', certificate_number: 'PLA-2026-000900', verify_code: 'V9' },
  });
}
resetData();

vi.mock('@/services/academyService', async (importOriginal) => ({
  ...(await importOriginal()),
  hasScope: async () => data.allowed,
  getQuota: async () => data.quota,
  getCapstone: async () => data.capstone,
  getCourseProgress: async () => data.progress,
  submitCapstone: async () => data.result,
  listMyEnrollments: async () => [],
  getActivationStatus: async () => ({ activated: true, orientation_completed: true, assessment_taken: true }),
}));

vi.mock('@/contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }) => children,
  useNotifications: () => ({
    notifications: [], unreadCount: 0, markAllAsRead: () => {}, markAsRead: () => {},
  }),
}));

const APPS = [
  { slug: 'cementing', title: /Cementing/ },
  { slug: 'completion', title: /Completion Design/ },
  { slug: 'perfsand', title: /Perforation and Sand Control/ },
  { slug: 'stimulation', title: /Stimulation Design/ },
  { slug: 'integrity', title: /Well Integrity and P&A/ },
  { slug: 'wellcost', title: /Well Cost and Time/ },
];

const heading = (title) => screen.findByRole('heading', { level: 1, name: title }, { timeout: 15000 });

let network;
beforeAll(() => { network = installNetworkGuard(); });
beforeEach(resetData);
afterAll(() => {
  // nothing reached the network in any test of this file
  expect(network).toEqual([]);
});

// ---- the four standard checks per screen --------------------------------

for (const app of APPS) {
  describeScreenTheme({
    name: `${app.slug} learning page`,
    route: `/dashboard/apps/${app.slug}`,
    renderScreen: () => renderRoute(`/dashboard/apps/${app.slug}`),
    ready: () => heading(app.title),
    userId: USER_ID,
  });
}

// ---- further states ------------------------------------------------------

const plotsOnWhitePlates = () => {
  const plots = [...document.querySelectorAll('.recharts-responsive-container')];
  for (const plot of plots) {
    const plate = plot.closest('[data-canvas="chart"]');
    expect(plate).toBeTruthy();
    expect(plate.className).toContain('bg-white');
    expect(plate.querySelector('img[alt]')).toBeTruthy();
  }
  return plots.length;
};

describe('the drilling II course apps, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('registers the six learning pages; every other host of their panels is already themed', () => {
    for (const app of APPS) {
      expect(isThemedPath(`/dashboard/apps/${app.slug}`)).toBe(true);
      // the lesson reader (1C) and the handbook (1C) also render these panels
      expect(isThemedPath(`/dashboard/apps/${app.slug}/course/beginner/m01/l01`)).toBe(true);
    }
    expect(isThemedPath('/dashboard/admin/handbook')).toBe(true);
    // wave 7: every signed-in route is scoped, registered or not
    expect(isThemedPath('/dashboard/legacy-probe')).toBe(true);
  });

  for (const app of APPS) {
    it(`${app.slug}: every tier is clean in light and dark, plots on white plates`, async () => {
      for (const theme of ['light', 'dark']) {
        window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, theme);
        renderRoute(`/dashboard/apps/${app.slug}`);
        await heading(app.title);
        expect(getScopeRoot().getAttribute('data-pl-theme')).toBe(theme);
        for (const tier of ['beginner', 'intermediate', 'advanced']) {
          const button = screen.getByRole('button', { name: `${tier} tier` });
          fireEvent.click(button);
          expect(button.getAttribute('aria-pressed')).toBe('true');
          expect(button.className).toContain('bg-pl-primary');
          await screen.findByText(/First answer/);
          expectNoLegacyChrome();
          plotsOnWhitePlates();
        }
        // the training watermark and the Learning Mode pill are on roles
        expect(screen.getByText('TRAINING').className).toContain('text-pl-text/5');
        expect(screen.getByText('Learning Mode').className).toContain('text-pl-accent-text');
        cleanup();
      }
    }, 60000);
  }

  it('the capstone pass and fail results use the status roles with their words', async () => {
    for (const theme of ['light', 'dark']) {
      window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, theme);
      renderRoute('/dashboard/apps/stimulation');
      await heading(/Stimulation Design/);
      fireEvent.click(await screen.findByRole('button', { name: /Submit for grading/ }));
      const passed = await screen.findByText(/Passed \(2\/2\)/);
      expect(passed.className).toContain('text-pl-success-text');
      expect(screen.getByText('PLA-2026-000900').className).toContain('text-pl-accent-text');
      expectNoLegacyChrome();
      cleanup();

      data.result = { passed: false, score: 1, max_score: 2 };
      renderRoute('/dashboard/apps/integrity');
      await heading(/Well Integrity/);
      fireEvent.click(await screen.findByRole('button', { name: /Submit for grading/ }));
      const failed = await screen.findByText(/1\/2 within tolerance/);
      expect(failed.className).toContain('text-pl-danger-text');
      expectNoLegacyChrome();
      cleanup();
      resetData();
    }
  }, 60000);

  it('the locked capstone points to the course on the link role', async () => {
    data.progress = { capstone: { unlocked: false, passed: false } };
    renderRoute('/dashboard/apps/wellcost');
    await heading(/Well Cost and Time/);
    const note = await screen.findByText(/The capstone unlocks after the course/);
    const link = within(note).getByRole('link', { name: 'Open the course' });
    expect(link.className).toContain('text-pl-primary-text');
    expect(screen.queryByRole('button', { name: /Submit for grading/ })).toBeNull();
    expectNoLegacyChrome();
  });

  it('the Learning Mode gate is clean when the app is locked', async () => {
    data.allowed = false;
    renderRoute('/dashboard/apps/cementing');
    await screen.findByText(/Learning Mode locked/, {}, { timeout: 15000 });
    await waitFor(() => expectNoLegacyChrome());
  });
});
