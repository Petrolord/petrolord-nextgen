// @vitest-environment jsdom
//
// Batch 1C (docs/scope/DesignSystem-Rollout.md): the course handbook at
// /dashboard/admin/handbook. Its screen frame (title, toolbar, course tabs,
// loader, error and locked states) is on theme roles inside the signed-in
// scope; its document body is a printable document, a data-canvas="document"
// region pinned to the light roles, so it reads as the printed page in both
// themes. Its print stylesheet and the download are unchanged.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { describeScreenTheme, expectNoLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { renderRoute, USER_ID } from './readerHarness';

vi.mock('@/lib/customSupabaseClient', async () => ({ supabase: (await import('./offlineSupabase')).offlineSupabase() }));

vi.mock('@/services/academyService', async (importOriginal) => ({
  ...(await importOriginal()),
  listAcademyApps: async () => [],
  listMyEnrollments: async () => [],
  listMyCertifications: async () => [],
  getActivationStatus: async () => ({ activated: true, orientation_completed: true }),
  mySponsorPools: async () => [],
  adminQuizSyllabus: async () => ({
    module_banks: [],
    final_bank: [{ prompt: 'Which log measures porosity?', options: ['Density', 'Caliper', 'Gamma ray', 'SP'] }],
  }),
}));

// Two courses (so the tabs show) and one short lesson body with every
// element the renderer styles keep the run short: the page renders every
// lesson of the selected course.
const LESSON_MD = [
  '## A heading', '', 'Body text with **bold**, *emphasis*, `code` and a [link](https://example.com).', '',
  '> A callout.', '', '| a | b |', '|---|---|', '| 1 | 2 |', '', '```', 'block', '```', '',
  '{{panel:bs-burial-heat-explorer}}', '', '- one', '- two', '', '---',
].join('\n');
vi.mock('@/lib/courseContent', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    listDeepCourses: () => [real.getManifest('basin', 'beginner'), real.getManifest('dca', 'beginner')]
      .map((m) => ({ ...m, modules: m.modules.slice(0, 2) })),
    loadLesson: async () => LESSON_MD,
  };
});

vi.mock('@/contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }) => children,
  useNotifications: () => ({ notifications: [], unreadCount: 0, markAllAsRead: () => {}, markAsRead: () => {} }),
}));

const ROUTE = '/dashboard/admin/handbook';
const docReady = async () => { await screen.findByText(/Final exam bank/, {}, { timeout: 8000 }); };

describeScreenTheme({
  name: 'Course handbook (frame)',
  route: ROUTE,
  renderScreen: () => renderRoute(ROUTE, { role: 'admin' }),
  ready: docReady,
  userId: USER_ID,
});

describe('Course handbook, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('the document body is a light paper document in the dark theme too', async () => {
    window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, 'dark');
    renderRoute(ROUTE, { role: 'admin' });
    await docReady();
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
    const doc = document.getElementById('handbook-doc');
    expect(doc.getAttribute('data-canvas')).toBe('document');
    expect(doc.getAttribute('data-pl-theme')).toBe('light');
    expect(doc.className).toContain('bg-pl-chart-surface');
    expectNoLegacyChrome();
    // the question bank and the lessons are inside the document
    expect(doc.textContent).toContain('Which log measures porosity?');
    expect(doc.querySelector('.markdown-lesson')).toBeTruthy();
    // print mode: the panel degrades to a callout
    expect(doc.textContent).toContain('bs-burial-heat-explorer');
    expect(doc.querySelector('svg[role="img"]')).toBeNull();
  });

  it('keeps its print stylesheet', async () => {
    renderRoute(ROUTE, { role: 'admin' });
    await docReady();
    const css = [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n');
    expect(css).toContain('#handbook-doc, #handbook-doc * { visibility: visible; }');
    expect(css).toContain('color: #0F172A !important;');
    expect(css).toContain('@page { size: A4 portrait; margin: 14mm; }');
  });

  it('shows the locked state on roles to a learner', async () => {
    renderRoute(ROUTE, { role: 'learner' });
    await screen.findByText('The handbook is available to lecturers and administrators.');
    expectNoLegacyChrome();
  });
});
