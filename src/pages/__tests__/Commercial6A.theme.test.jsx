// @vitest-environment jsdom
//
// Batch 6A (docs/scope/DesignSystem-Rollout.md): the nine commercial and
// trading course apps (procurement, marine, PIA, GSA, JOA, farmout, PRMS,
// materials and the contracts practice course), mounted as their routes
// mount them (Layout, header, the signed-in scope, DashboardPage). Each
// opens light, the header toggle goes to dark and back, and no legacy
// console colour is left outside canvases (with a negative control), in
// every state the page can show: each tier with its calculators, the locked
// capstone, the open capstone with a pass and a fail, and the Learning Mode
// gate. These courses draw no chart. No request leaves the test.
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
    result: { passed: true, score: 2, max_score: 2, tier: 'associate', certificate_number: 'PLA-2026-000950', verify_code: 'V9' },
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
  listAcademyApps: async () => [],
  getActivationStatus: async () => ({ activated: true, orientation_completed: true, assessment_taken: true }),
}));

vi.mock('@/contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }) => children,
  useNotifications: () => ({
    notifications: [], unreadCount: 0, markAllAsRead: () => {}, markAsRead: () => {},
  }),
}));

const APPS = [
  { slug: 'procurement', title: /Procurement, Tendering & Contracting/ },
  { slug: 'marine', title: /Offshore & Marine Logistics/ },
  { slug: 'pia', title: /Petroleum Industry Act 2021 & Nigerian Fiscal Terms/ },
  { slug: 'gsa', title: /Gas Commercialisation & Gas Sales Agreements/ },
  { slug: 'joa', title: /Joint Ventures, Operating Agreements & Cost Recovery/ },
  { slug: 'farmout', title: /Farm-ins, Farm-outs & Asset Valuation/ },
  { slug: 'prms', title: /Reserves & Resources under SPE-PRMS 2018/ },
  { slug: 'materials', title: /Materials, Spares & Inventory Management/ },
];
// The practice course: no engine, no calculator and no numeric capstone.
const CONTRACTS = { slug: 'contracts', title: /Contract & Supplier Management/ };

const heading = (title) => screen.findByRole('heading', { level: 1, name: title }, { timeout: 15000 });

let network;
beforeAll(() => { network = installNetworkGuard(); });
beforeEach(resetData);
afterAll(() => {
  // nothing reached the network in any test of this file
  expect(network).toEqual([]);
});

// ---- the four standard checks per screen --------------------------------

for (const app of [...APPS, CONTRACTS]) {
  describeScreenTheme({
    name: `${app.slug} learning page`,
    route: `/dashboard/apps/${app.slug}`,
    renderScreen: () => renderRoute(`/dashboard/apps/${app.slug}`),
    ready: () => heading(app.title),
    userId: USER_ID,
  });
}

// ---- further states ------------------------------------------------------

describe('the commercial and trading course apps, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('registers the nine learning pages (their reader pages are 1C)', () => {
    for (const app of [...APPS, CONTRACTS]) expect(isThemedPath(`/dashboard/apps/${app.slug}`)).toBe(true);
    expect(isThemedPath('/legacy-probe')).toBe(false);
  });

  for (const app of APPS) {
    it(`${app.slug}: every tier is clean in light and dark, and draws no plot`, async () => {
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
          expect(document.querySelector('.recharts-responsive-container, svg.recharts-surface')).toBeNull();
          // retired console lime is gone from the page
          expect(document.body.innerHTML).not.toMatch(/bfff00/i);
        }
        // the training watermark and the Learning Mode pill are on roles
        expect(screen.getByText('TRAINING').className).toContain('text-pl-text/5');
        expect(screen.getByText('Learning Mode').className).toContain('text-pl-accent-text');
        cleanup();
      }
    }, 120000);
  }

  for (const theme of ['light', 'dark']) {
    it(`the capstone pass and fail results use the status roles with their words (${theme})`, async () => {
      window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, theme);
      renderRoute('/dashboard/apps/procurement');
      await heading(/Procurement, Tendering & Contracting/);
      fireEvent.click(await screen.findByRole('button', { name: /Submit for grading/ }));
      const passed = await screen.findByText(/Passed \(2\/2\)/);
      expect(passed.className).toContain('text-pl-success-text');
      expect(screen.getByText('PLA-2026-000950').className).toContain('text-pl-accent-text');
      expectNoLegacyChrome();
      cleanup();

      data.result = { passed: false, score: 1, max_score: 2 };
      renderRoute('/dashboard/apps/prms');
      await heading(/Reserves & Resources under SPE-PRMS 2018/);
      fireEvent.click(await screen.findByRole('button', { name: /Submit for grading/ }));
      const failed = await screen.findByText(/1\/2 within tolerance/);
      expect(failed.className).toContain('text-pl-danger-text');
      expectNoLegacyChrome();
    }, 120000);
  }

  it('the locked capstone points to the course on the link role', async () => {
    data.progress = { capstone: { unlocked: false, passed: false } };
    renderRoute('/dashboard/apps/joa');
    await heading(/Joint Ventures, Operating Agreements & Cost Recovery/);
    const note = await screen.findByText(/The capstone unlocks after the course/);
    const link = within(note).getByRole('link', { name: 'Open the course' });
    expect(link.className).toContain('text-pl-primary-text');
    expect(screen.queryByRole('button', { name: /Submit for grading/ })).toBeNull();
    expectNoLegacyChrome();
  }, 120000);

  for (const slug of ['materials', 'contracts']) {
    it(`the Learning Mode gate is clean when the app is locked (${slug})`, async () => {
      data.allowed = false;
      renderRoute(`/dashboard/apps/${slug}`);
      await screen.findByText(/Learning Mode locked/, {}, { timeout: 15000 });
      await waitFor(() => expectNoLegacyChrome());
    }, 120000);
  }

  it('contracts: every tier of the practice course page is clean in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, theme);
      renderRoute('/dashboard/apps/contracts');
      await heading(CONTRACTS.title);
      expect(getScopeRoot().getAttribute('data-pl-theme')).toBe(theme);
      for (const tier of ['Associate', 'Professional', 'Expert']) {
        const button = screen.getByRole('button', { name: tier });
        fireEvent.click(button);
        expect(button.getAttribute('aria-pressed')).toBe('true');
        expect(button.className).toContain('bg-pl-primary');
        await screen.findByText(`${tier} syllabus`);
        expectNoLegacyChrome();
        expect(document.body.innerHTML).not.toMatch(/bfff00/i);
      }
      expect(screen.getByText('Learning Mode').className).toContain('text-pl-accent-text');
      expect(screen.getByText('Written scenario work').className).toContain('text-pl-text');
      cleanup();
    }
  }, 120000);
});
