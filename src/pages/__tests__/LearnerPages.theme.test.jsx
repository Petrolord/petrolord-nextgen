// @vitest-environment jsdom
//
// Batch 2A (docs/scope/DesignSystem-Rollout.md): the learner pages, mounted
// as their routes mount them (Layout, header, the signed-in scope): enroll,
// get started, devices, the prerequisite waiver exam and my certificates.
// Each opens light, the header toggle goes to dark and back, and no legacy
// console colour is left outside canvases (with a negative control), in
// every state the page can show. The certificate itself keeps its artwork:
// it mounts outside the scope in a data-canvas="document" region and
// renders its legacy markup unchanged. No request leaves the test.
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import AcademyCertificatesPage from '@/pages/AcademyCertificatesPage';
import { installDomShims } from '@/design/testing/domShims';
import {
  describeScreenTheme, expectNoLegacyChrome, getScopeRoot, legacyChromeClasses,
} from '@/design/testing/themeAssertions';
import { renderRoute, installNetworkGuard, openTab, USER_ID } from './learnerAccountHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('./offlineSupabase.js')).offlineSupabaseModule());

// What the mocked services serve; each test may change it before it renders.
const data = {};
const FAR = '2099-01-01T00:00:00Z';
function resetData() {
  Object.assign(data, {
    apps: [
      { slug: 'welldata', name: 'Well Data Management', module: 'geoscience', status: 'available', school: 'subsurface' },
      { slug: 'petrophysics', name: 'Petrophysics', module: 'geoscience', status: 'available', school: 'subsurface', prereq_slug: 'welldata' },
      { slug: 'dca', name: 'Decline Curve Analysis', module: 'reservoir', status: 'available', school: 'subsurface' },
      { slug: 'basin', name: 'Basin Modelling', module: 'geoscience', status: 'coming_soon', school: 'subsurface' },
    ],
    fees: [
      { kind: 'course', active: true, app_slug: null, school: null, course_tier: '*', amount_minor: 2500000, currency: 'NGN' },
      { kind: 'registration', active: true, app_slug: null, school: null, course_tier: '*', amount_minor: 500000, currency: 'NGN' },
    ],
    enrollments: [
      { id: 'e1', app_slug: 'dca', course_tier: 'intermediate', door: 'self', status: 'active', created_at: '2026-09-20T10:00:00Z' },
      { id: 'e2', app_slug: 'welldata', course_tier: 'beginner', door: 'campus', status: 'pending', created_at: '2026-09-21T10:00:00Z' },
      { id: 'e3', app_slug: 'petrophysics', course_tier: 'advanced', door: 'sponsored', status: 'cancelled', created_at: '2026-09-22T10:00:00Z' },
      { id: 'e4', app_slug: 'welldata', course_tier: 'advanced', door: 'residency', status: 'completed', created_at: '2026-09-23T10:00:00Z' },
    ],
    residencyApps: [
      { id: 'r1', app_slug: 'dca', status: 'submitted' },
      { id: 'r2', app_slug: 'welldata', status: 'accepted' },
      { id: 'r3', app_slug: 'petrophysics', status: 'rejected' },
    ],
    doors: { residency_open: false, residency_notice: '' },
    prereq: { required: true, prereq_slug: 'welldata', prereq_name: 'Well Data Management', satisfied: false, exam_available: true },
    activation: { activated: true, orientation_completed: true, assessment_taken: true },
    questions: [
      { id: 'q1', prompt: 'What does porosity measure?', options: ['Pore volume fraction', 'Permeability', 'Saturation'] },
      { id: 'q2', prompt: 'Which log reads shale?', options: ['Gamma ray', 'Caliper'] },
    ],
    devices: [
      { id: 'd1', device_id: 'this-device', label: 'Chrome on Windows', user_agent: 'Mozilla/5.0', last_seen: '2026-09-27T10:00:00Z' },
      { id: 'd2', device_id: 'other', label: null, user_agent: null, last_seen: '2026-09-20T10:00:00Z' },
    ],
    sessions: [
      { id: 's1', event: 'register', created_at: '2026-09-20T10:00:00Z' },
      { id: 's2', event: 'denied', created_at: '2026-09-21T10:00:00Z' },
      { id: 's3', event: 'resume', created_at: '2026-09-22T10:00:00Z' },
    ],
    waiverExam: { attempt_id: 'a1', questions: [{ id: 'w1', prompt: 'What is a LAS file?', options: ['A log file format', 'A seismic volume'] }] },
    certs: [
      { id: 'c1', app_slug: 'petrophysics', course_name: 'Petrophysics', tier: 'associate', certificate_number: 'PLA-2026-000123', verify_code: 'V1', issued_at: '2026-09-10T10:00:00Z', valid_until: FAR, revoked_at: null },
      { id: 'c2', app_slug: 'dca', course_name: 'Decline Curve Analysis', tier: 'professional', certificate_number: 'PLA-2026-000124', verify_code: 'V2', issued_at: '2024-09-10T10:00:00Z', valid_until: '2025-09-10T10:00:00Z', revoked_at: null },
      { id: 'c3', app_slug: 'welldata', course_name: 'Well Data Management', tier: 'expert', certificate_number: 'PLA-2026-000125', verify_code: 'V3', issued_at: '2026-09-10T10:00:00Z', valid_until: FAR, revoked_at: '2026-09-12T10:00:00Z' },
    ],
    bridgeCodes: [
      { certification_id: 'c1', code: 'SUITE-ABCD-1234', discount_pct: 50, suite_module: 'geoscience', valid_until: FAR },
      { certification_id: 'c3', code: 'SUITE-EFGH-5678', discount_pct: 50, suite_module: 'subsurface', valid_until: FAR, redeemed_at: '2026-09-15T10:00:00Z' },
    ],
  });
}
resetData();

vi.mock('@/services/academyService', async (importOriginal) => ({
  ...(await importOriginal()),
  listAcademyApps: async () => data.apps,
  listFees: async () => data.fees,
  listMyEnrollments: async () => data.enrollments,
  listMyResidencyApplications: async () => data.residencyApps,
  getPrereqWaiverStatus: async () => data.prereq,
  doorsStatus: async () => data.doors,
  getActivationStatus: async () => data.activation,
  completeOrientation: async () => ({ ...data.activation, orientation_completed: true }),
  getEntryAssessment: async () => data.questions,
  listMyDevices: async () => data.devices,
  listMySessions: async () => data.sessions,
  getDeviceId: () => 'this-device',
  getPrereqWaiverExam: async () => data.waiverExam,
  listMyCertifications: async () => data.certs,
  listMyBridgeCodes: async () => data.bridgeCodes,
  mySponsorPools: async () => [],
}));

vi.mock('@/contexts/NotificationContext', () => ({
  NotificationProvider: ({ children }) => children,
  useNotifications: () => ({
    notifications: [], unreadCount: 0, markAllAsRead: () => {}, markAsRead: () => {},
  }),
}));

let network;
beforeAll(() => { network = installNetworkGuard(); });
beforeEach(resetData);
afterAll(() => {
  // nothing reached the network in any test of this file
  expect(network).toEqual([]);
});

// ---- the four standard checks per screen --------------------------------

describeScreenTheme({
  name: 'Enroll',
  route: '/dashboard/enroll',
  renderScreen: () => renderRoute('/dashboard/enroll'),
  ready: async () => { await screen.findByText('Enroll in a course'); await screen.findByText('My enrollments'); },
  userId: USER_ID,
});

describeScreenTheme({
  name: 'Get started',
  route: '/dashboard/get-started',
  renderScreen: () => {
    data.activation = { activated: false, orientation_completed: false, assessment_taken: false };
    return renderRoute('/dashboard/get-started');
  },
  ready: () => screen.findByText('One account, four doors'),
  userId: USER_ID,
});

describeScreenTheme({
  name: 'Devices',
  route: '/dashboard/devices',
  renderScreen: () => renderRoute('/dashboard/devices'),
  ready: () => screen.findByText('Chrome on Windows'),
  userId: USER_ID,
});

describeScreenTheme({
  name: 'Prerequisite waiver exam',
  route: '/dashboard/waiver/welldata',
  renderScreen: () => renderRoute('/dashboard/waiver/welldata'),
  ready: () => screen.findByText(/What is a LAS file\?/),
  userId: USER_ID,
});

describeScreenTheme({
  name: 'My certificates',
  route: '/dashboard/certificates',
  renderScreen: () => renderRoute('/dashboard/certificates', { page: <AcademyCertificatesPage /> }),
  ready: () => screen.findByText('PLA-2026-000123'),
  userId: USER_ID,
});

// ---- further states ------------------------------------------------------

const cleanInBothThemes = async (mount, ready) => {
  for (const theme of ['light', 'dark']) {
    window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, theme);
    mount();
    await ready();
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe(theme);
    expectNoLegacyChrome();
    cleanup();
  }
};

describe('Enroll, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('every door tab is clean in light and dark, with the fee, the prerequisite note and every status', async () => {
    for (const theme of ['light', 'dark']) {
      window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, theme);
      renderRoute('/dashboard/enroll');
      await screen.findByText('Self-enrollment');
      expect(screen.getByText(/pending payment/)).toBeTruthy();
      expect(screen.getByText('cancelled')).toBeTruthy();
      for (const tab of ['Campus', 'Sponsored', 'Residency', 'Self-enroll']) {
        openTab(fireEvent, screen.getByRole('tab', { name: new RegExp(tab) }));
        expectNoLegacyChrome();
      }
      cleanup();
    }
  });

  it('the prerequisite note and waiver link use the status and link roles', async () => {
    renderRoute('/dashboard/enroll');
    await screen.findByText('Self-enrollment');
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'petrophysics' } });
    const note = await screen.findByTestId('enroll-prereq-note');
    expect(note.className).toContain('text-pl-warning-text');
    expect(screen.getByTestId('enroll-waiver-link').className).toContain('text-pl-primary-text');
    expectNoLegacyChrome();
  });

  it('the tier picker marks the chosen tier with the primary role and aria-pressed', async () => {
    renderRoute('/dashboard/enroll');
    await screen.findByText('Self-enrollment');
    const tier = screen.getAllByRole('button', { name: 'Advanced' })[0];
    fireEvent.click(tier);
    expect(tier.getAttribute('aria-pressed')).toBe('true');
    expect(tier.className).toContain('bg-pl-primary');
    expect(screen.getAllByRole('button', { name: 'Beginner' })[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('an open residency door with applications is clean in light and dark', async () => {
    await cleanInBothThemes(
      () => { data.doors = { residency_open: true }; renderRoute('/dashboard/enroll'); },
      async () => {
        await screen.findByText('Self-enrollment');
        openTab(fireEvent, screen.getByRole('tab', { name: /Residency/ }));
        await screen.findByText('Your applications');
      },
    );
  });
});

describe('Get started, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('the entry assessment with a chosen answer is clean in light and dark', async () => {
    await cleanInBothThemes(
      () => {
        data.activation = { activated: false, orientation_completed: true, assessment_taken: false, recommended_tier: 'intermediate' };
        renderRoute('/dashboard/get-started');
      },
      async () => {
        const opt = await screen.findByRole('button', { name: 'Gamma ray' });
        fireEvent.click(opt);
        expect(opt.getAttribute('aria-pressed')).toBe('true');
      },
    );
  });

  it('the activated state is clean and marks every step done', async () => {
    renderRoute('/dashboard/get-started');
    await screen.findByText('Your account is active.');
    expectNoLegacyChrome();
  });
});

describe('Devices and the waiver exam, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('devices: this device, the missing user agent (n/a) and a blocked session, in light and dark', async () => {
    await cleanInBothThemes(
      () => renderRoute('/dashboard/devices'),
      async () => {
        await screen.findByText('this device');
        expect(screen.getByText('n/a')).toBeTruthy();
        expect(screen.getByText('Blocked (device limit)').className).toContain('text-pl-danger-text');
      },
    );
  });

  it('devices: the empty lists are clean', async () => {
    data.devices = [];
    data.sessions = [];
    renderRoute('/dashboard/devices');
    await screen.findByText('No registered devices.');
    expectNoLegacyChrome();
  });

  it('waiver: a course with no waiver exam shows the themed locked card', async () => {
    renderRoute('/dashboard/waiver/dca');
    await screen.findByText('No waiver exam for this course');
    expectNoLegacyChrome();
  });

  it('waiver: the exam is clean in dark', async () => {
    window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, 'dark');
    renderRoute('/dashboard/waiver/welldata');
    await screen.findByText(/What is a LAS file\?/);
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
    expectNoLegacyChrome();
  });
});

describe('My certificates, further states', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  const mount = (opts = {}) => renderRoute('/dashboard/certificates', { page: <AcademyCertificatesPage />, ...opts });

  it('valid, expired and revoked certificates, bridge codes and the display-name notice are clean in light and dark', async () => {
    await cleanInBothThemes(
      () => mount({ displayName: null }),
      async () => {
        await screen.findByText('PLA-2026-000123');
        expect(screen.getByText('Valid')).toBeTruthy();
        expect(screen.getByText('Expired')).toBeTruthy();
        expect(screen.getByText('Revoked')).toBeTruthy();
        expect(screen.getByText('SUITE-ABCD-1234')).toBeTruthy();
        expect(screen.getByText('Set your display name in Settings')).toBeTruthy();
      },
    );
  });

  it('no certificates yet is clean', async () => {
    data.certs = [];
    data.bridgeCodes = [];
    mount();
    await screen.findByText(/You haven’t earned any certificates yet/);
    expectNoLegacyChrome();
  });

  it('the certificate opens outside the scope as a document and keeps its legacy artwork', async () => {
    window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, 'dark');
    mount();
    await screen.findByText('PLA-2026-000123');
    fireEvent.click(screen.getAllByRole('button', { name: /View certificate/ })[0]);
    const doc = await screen.findByTestId('certificate-document');
    // a document region in document.body, with no theme scope around it
    expect(doc.getAttribute('data-canvas')).toBe('document');
    expect(doc.closest('[data-pl-theme]')).toBeNull();
    expect(getScopeRoot().contains(doc)).toBe(false);
    // the viewer renders its pre-rollout markup: the legacy print button and sheet
    const print = within(doc).getByRole('button', { name: /Print/ });
    expect(print.className).toContain('bg-[#BFFF00]');
    expect(print.className).not.toMatch(/pl-/);
    expect(doc.querySelector('#certificate-sheet')).toBeTruthy();
    // and the themed page around it is still clean
    expectNoLegacyChrome();
    // negative control: the same legacy markup inside the scope would be caught
    const planted = document.createElement('div');
    planted.className = print.className;
    getScopeRoot().appendChild(planted);
    expect(legacyChromeClasses()).toContain(print.className);
    planted.remove();
    fireEvent.click(within(doc).getByRole('button', { name: /Close/ }));
    expect(screen.queryByTestId('certificate-document')).toBeNull();
  });
});
