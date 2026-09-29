// @vitest-environment jsdom
//
// Batch 1C (docs/scope/DesignSystem-Rollout.md): the course reader. Each
// reader page, mounted as its route mounts it (Layout, header,
// DashboardPage), renders inside the one signed-in scope: grey panel light
// by default, the header toggle switches to dark and back and stores the
// choice, and no legacy console colour is left outside canvases. The lesson
// page is checked with a teaching panel embedded (its plots sit on white
// chart plates) and in dark. The capstone redirect is covered by the
// pattern registration. A route outside the rollout keeps the legacy frame.
//
// The course kit (QuizRunner, LockedCard, panelKit ...) is batch 1B's and is
// rendered for real: inside the scope it is on roles too.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import {
  describeScreenTheme, expectNoLegacyChrome, getScopeRoot, hasLegacyChrome,
} from '@/design/testing/themeAssertions';
import { isThemedPath } from '@/design/scopePaths';
import { renderRoute, USER_ID } from './readerHarness';

vi.mock('@/lib/customSupabaseClient', async () => ({ supabase: (await import('./offlineSupabase')).offlineSupabase() }));

const APP = 'seismolord';
const TIER = 'advanced';
const MOD = 'm06-using-the-wedge';
const LESSON = 'l02-quality-control'; // embeds {{panel:sl-wedge-explorer}}
const BASE = `/dashboard/apps/${APP}/course/${TIER}`;

const progress = {
  modules: [
    { key: 'm01-the-wedge-experiment', unlocked: true, complete: true, quiz_passed: true, lessons_read: 5, lesson_keys_read: [] },
    { key: MOD, unlocked: true, complete: false, quiz_passed: false, lessons_read: 1, lesson_keys_read: ['l01-the-workflow-end-to-end'] },
  ],
  final_exam: { unlocked: true, passed: false },
  capstone: { unlocked: false, passed: false },
};

vi.mock('@/services/academyService', async (importOriginal) => ({
  ...(await importOriginal()),
  listAcademyApps: async () => [{ slug: 'seismolord', name: 'Seismolord', module: 'geoscience', status: 'available' }],
  listMyEnrollments: async () => [
    { id: 'e1', app_slug: 'seismolord', course_tier: 'advanced', door: 'self', status: 'active', created_at: '2026-09-20T10:00:00Z' },
  ],
  listMyCertifications: async () => [],
  getActivationStatus: async () => ({ activated: true, orientation_completed: true }),
  mySponsorPools: async () => [],
  getCourseProgress: async () => progress,
  markLessonRead: async () => ({ lessons_read: 2, lessons_total: 5 }),
  getModuleQuiz: async () => ({ attempt_id: 'a1', questions: [{ id: 'q1', prompt: 'Question 1: where does tuning sit?', options: ['Below a quarter wavelength', 'Above it'] }] }),
  getFinalExam: async () => ({ attempt_id: 'a2', questions: [{ id: 'q1', prompt: 'Question 1: what rises below tuning?', options: ['Amplitude', 'Frequency'] }] }),
}));

vi.mock('@/contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }) => children,
  useNotifications: () => ({ notifications: [], unreadCount: 0, markAllAsRead: () => {}, markAsRead: () => {} }),
}));


const SCREENS = [
  {
    name: 'Course home',
    route: BASE,
    ready: async () => { await screen.findByText(/Module 2:/); await screen.findByText('Continue'); },
  },
  {
    name: 'Course module',
    route: `${BASE}/${MOD}`,
    ready: async () => { await screen.findByText('Module quiz'); },
  },
  {
    name: 'Lesson reader (with an embedded teaching panel)',
    route: `${BASE}/${MOD}/${LESSON}`,
    ready: async () => { await screen.findByText('Wedge explorer', {}, { timeout: 4000 }); },
  },
  {
    name: 'Module quiz',
    route: `${BASE}/quiz/${MOD}`,
    ready: async () => { await screen.findByText(/Module 6 quiz/); await screen.findByText(/Question 1/); },
  },
  {
    name: 'Final exam',
    route: `${BASE}/exam`,
    ready: async () => { await screen.findByText(/Final exam:/); await screen.findByText(/Question 1/); },
  },
];

for (const s of SCREENS) {
  describeScreenTheme({
    name: s.name,
    route: s.route,
    renderScreen: () => renderRoute(s.route),
    ready: s.ready,
    userId: USER_ID,
  });
}

describe('Course reader, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('every reader route, the capstone redirect included, is registered', () => {
    for (const r of [BASE, `${BASE}/exam`, `${BASE}/capstone`, `${BASE}/quiz/${MOD}`, `${BASE}/${MOD}`, `${BASE}/${MOD}/${LESSON}`]) {
      expect({ r, themed: isThemedPath(r) }).toEqual({ r, themed: true });
    }
    // a signed-in route no batch registers stays out
    expect(isThemedPath('/legacy-probe')).toBe(false);
  });

  it('the lesson stays clean in dark, and the panel plots sit on white chart plates', async () => {
    window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, 'dark');
    renderRoute(`${BASE}/${MOD}/${LESSON}`);
    await screen.findByText('Wedge explorer', {}, { timeout: 4000 });
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
    expectNoLegacyChrome();
    const svgs = [...document.querySelectorAll('svg[role="img"]')];
    expect(svgs.length).toBe(2);
    for (const svg of svgs) {
      const frame = svg.closest('[data-canvas="chart"]');
      expect(frame).toBeTruthy();
      expect(frame.querySelector('img[alt]')).toBeTruthy(); // the Petrolord chart mark
    }
    // the retired console lime is gone from the plots
    for (const svg of svgs) expect(svg.outerHTML).not.toMatch(/#BFFF00/i);
  });

  it('the lesson prose renders on roles (headings, body, tables)', async () => {
    renderRoute(`${BASE}/${MOD}/${LESSON}`);
    await screen.findByText('Wedge explorer', {}, { timeout: 4000 });
    const prose = document.querySelector('.markdown-lesson');
    expect(prose.querySelector('p').className).toContain('text-pl-text');
    const legacy = [...prose.querySelectorAll('[class]')]
      .filter((el) => !el.closest('[data-canvas]'))
      .map((el) => el.getAttribute('class'))
      .filter((c) => hasLegacyChrome(c));
    expect(legacy).toEqual([]);
  });

  it('a locked module shows the locked card on roles', async () => {
    renderRoute(`${BASE}/m02-two-reflections-meeting`);
    await screen.findByText('This module is locked');
    expectNoLegacyChrome();
  });

  it('a route the rollout has not reached keeps the legacy frame (negative control)', async () => {
    // a test-only route no batch registers (3A has since migrated the
    // course's learning page, which this control used to render)
    renderRoute('/legacy-probe');
    await waitFor(() => expect(document.querySelector('header')).toBeTruthy());
    expect(screen.queryByTestId('signed-in-theme-scope')).toBeNull();
    expect(screen.queryByTestId('theme-toggle')).toBeNull();
    expect(document.querySelector('header').className).toContain('bg-[#1E293B]');
  });
});
