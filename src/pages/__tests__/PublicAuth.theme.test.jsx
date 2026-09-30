// @vitest-environment jsdom
// Batch 6B theme test: the public and auth pages on the public frame
// (src/components/public/PublicPage.jsx, a port of the Suite's W7C frame;
// docs/scope/DesignSystem-Rollout.md section 5.3). Every page opens light in
// its own scope under the ink brand bar, has no theme toggle, stays light
// for a learner whose own choice is dark, paints a light loader, and leaves
// no legacy console colour outside canvases (with a negative control).
// Further states: the sign-in and sign-up errors, the confirmation notice,
// every verify result, both password pages in each of their states, the
// legal contents drawer and the footer. The behaviour pins are in
// PublicAuth.flows.test.jsx. The Supabase client is a stand-in, so nothing
// reaches auth or a database, and fetch is counted and asserted unused.
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, cleanup, configure, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import {
  getScopeRoot, expectLightByDefault, expectNoLegacyChrome, expectNegativeControl, hasLegacyChrome,
} from '@/design/testing/themeAssertions';
import { installDomShims } from '@/design/testing/domShims';
import { themeStorageKey, LAST_THEME_KEY } from '@/design/ThemeProvider';
import { coldLoadTheme, isPublicLightPath, PUBLIC_LIGHT_ROUTES } from '@/design/scopePaths';

const h = vi.hoisted(() => ({}));

vi.mock('@/lib/customSupabaseClient', async () => {
  const { publicAuthSupabase } = await import('./publicAuthStubs');
  return publicAuthSupabase(h);
});

const { freshHandlers } = await import('./publicAuthStubs');
const { mountPublic } = await import('./publicAuthHarness');
const { default: LoginPage } = await import('@/pages/LoginPage');
const { default: RegisterPage } = await import('@/pages/RegisterPage');
const { default: PasswordResetPage } = await import('@/pages/PasswordResetPage');
const { default: ResetPasswordPage } = await import('@/pages/ResetPasswordPage');
const { default: VerifyCertificatePage } = await import('@/pages/VerifyCertificatePage');
const { default: PrivacyPolicyPage } = await import('@/pages/PrivacyPolicyPage');
const { default: TermsOfServicePage } = await import('@/pages/TermsOfServicePage');
const { default: AcademicIntegrityPage } = await import('@/pages/AcademicIntegrityPage');
const { default: NotFoundPage } = await import('@/pages/NotFoundPage');

configure({ asyncUtilTimeout: 8000 });
vi.setConfig({ testTimeout: 30000 });

// The legal documents keep their print variants (a printed policy is black
// on white whatever the screen shows); they paint nothing on screen.
const PRINT = [/^print:/];

const tokenOk = async (_name, { body }) => (body.action === 'check'
  ? { data: { success: true, email: 'admin@uni.example' }, error: null }
  : { data: { success: true }, error: null });

// name, page, route, route pattern, scope test id, first text, registered
const PAGES = [
  ['Login', LoginPage, '/login', '/login', 'login-theme-scope', 'Sign in to your account', true],
  ['Register', RegisterPage, '/register', '/register', 'register-theme-scope', 'Create your account', true],
  ['Verify certificate', VerifyCertificatePage, '/verify', '/verify', 'verify-theme-scope', 'Certificate verification', true],
  ['Forgot password', PasswordResetPage, '/forgot-password', '/forgot-password', 'forgot-password-theme-scope', 'Step 1: Identify Account', true],
  ['Reset password', ResetPasswordPage, '/reset-password?token=tok-1', '/reset-password', 'reset-password-theme-scope', 'Set Your Password', true],
  ['Privacy policy', PrivacyPolicyPage, '/privacy-policy', '/privacy-policy', 'legal-theme-scope', '1. Introduction', true],
  ['Terms of service', TermsOfServicePage, '/terms-of-service', '/terms-of-service', 'legal-theme-scope', '1. Acceptance of Terms', true],
  ['Academic integrity', AcademicIntegrityPage, '/academic-integrity', '/academic-integrity', 'legal-theme-scope', '1. Academic Integrity Statement', true],
  ['Not found', NotFoundPage, '/no-such-page', '/no-such-page', 'not-found-theme-scope', 'Page Not Found', false],
];

const type = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

let fetchSpy;
beforeAll(installDomShims);
beforeEach(() => {
  try { window.localStorage.clear(); } catch { /* storage unavailable */ }
  Object.assign(h, freshHandlers());
  h.invoke = tokenOk;
  window.scrollTo = () => {};
  fetchSpy = vi.fn(async () => { throw new Error('network is off in the 6B tests'); });
  vi.stubGlobal('fetch', fetchSpy);
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  expect(fetchSpy).not.toHaveBeenCalled();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe.each(PAGES)('%s on the public frame', (name, Page, route, pattern, scopeTestId, first, registered) => {
  const ready = async () => (await screen.findAllByText(first))[0];
  const pathname = route.split('?')[0];

  it('opens light in its own scope, under the ink brand bar, and has no toggle', async () => {
    mountPublic(Page, route, pattern);
    await ready();
    const scope = getScopeRoot(scopeTestId);
    expect(scope.getAttribute('data-testid')).toBe(scopeTestId);
    expectLightByDefault(scope);
    const bar = screen.getByTestId('public-brand-bar');
    expect(scope.contains(bar)).toBe(true);
    expect(bar).toHaveAttribute('data-pl-theme', 'dark');
    expect(within(bar).getByRole('link', { name: 'Petrolord NextGen home' })).toHaveAttribute('href', '/');
    expect(document.querySelector('[data-testid="theme-toggle"]')).toBeNull();
    expect(document.querySelectorAll('[data-pl-root]').length).toBe(1);
  });

  it('stays light when the learner\'s own choice on this device is dark', async () => {
    window.localStorage.setItem(themeStorageKey('u1'), 'dark');
    window.localStorage.setItem(LAST_THEME_KEY, 'dark');
    mountPublic(Page, route, pattern);
    await ready();
    expect(getScopeRoot(scopeTestId)).toHaveAttribute('data-pl-theme', 'light');
    // nothing on these pages writes a theme choice
    expect(window.localStorage.getItem(themeStorageKey(null))).toBeNull();
    expect(window.localStorage.getItem(LAST_THEME_KEY)).toBe('dark');
  });

  it('leaves no legacy console colour outside canvases (with a negative control)', async () => {
    mountPublic(Page, route, pattern);
    await ready();
    expectNoLegacyChrome({ allow: PRINT });
    expectNegativeControl(getScopeRoot(scopeTestId), { allow: PRINT });
  });

  it(registered ? 'is a public light route, so its loader paints light' : 'is an unknown path, so its loader stays legacy', () => {
    window.localStorage.setItem(LAST_THEME_KEY, 'dark');
    expect(isPublicLightPath(pathname)).toBe(registered);
    expect(coldLoadTheme(pathname)).toBe(registered ? 'light' : null);
  });
});

describe('signed in with a dark choice, the public pages still open light', () => {
  beforeEach(() => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    h.profile = { id: 'u1', role: 'learner' };
    window.localStorage.setItem(themeStorageKey('u1'), 'dark');
    window.localStorage.setItem(LAST_THEME_KEY, 'dark');
  });

  it.each([
    ['verify', VerifyCertificatePage, '/verify', 'verify-theme-scope', 'Certificate verification'],
    ['forgot password (recovery session)', PasswordResetPage, '/forgot-password', 'forgot-password-theme-scope', 'Step 2: Create New Password'],
    ['privacy policy', PrivacyPolicyPage, '/privacy-policy', 'legal-theme-scope', '1. Introduction'],
    ['not found', NotFoundPage, '/no-such-page', 'not-found-theme-scope', 'Page Not Found'],
  ])('%s', async (_n, Page, route, scopeTestId, first) => {
    mountPublic(Page, route);
    await screen.findAllByText(first);
    // let the auth provider finish restoring the session
    await new Promise((r) => setTimeout(r, 0));
    expect(getScopeRoot(scopeTestId)).toHaveAttribute('data-pl-theme', 'light');
    expect(window.localStorage.getItem(themeStorageKey('u1'))).toBe('dark');
    expectNoLegacyChrome({ allow: PRINT });
  });
});

describe('further states', () => {
  it('login: the error alert and the field errors are on the danger role', async () => {
    h.signInWithPassword = async () => ({ data: null, error: { message: 'Invalid login credentials' } });
    mountPublic(LoginPage, '/login');
    await screen.findByText('Sign in to your account');
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form'));
    expect((await screen.findByText('Email is required')).className).toContain('text-pl-danger-text');
    type('Email address', 'ada@example.com');
    type('Password', 'wrong');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    const alert = await screen.findByRole('alert');
    expect(alert.className).toContain('bg-pl-danger-bg');
    expect(alert).toHaveTextContent('Error');
    expectNoLegacyChrome();
  });

  it('login: the submit button is the primary action and no lime is left', async () => {
    mountPublic(LoginPage, '/login');
    await screen.findByText('Sign in to your account');
    expect(screen.getByRole('button', { name: 'Sign in' }).className).toContain('bg-pl-primary');
    expect(getScopeRoot('login-theme-scope').innerHTML).not.toMatch(/BFFF00|A8E600/i);
  });

  it('register: the errors, then the confirmation notice with its words', async () => {
    h.signUp = vi.fn()
      .mockResolvedValueOnce({ data: null, error: { message: 'User already registered' } })
      .mockResolvedValueOnce({ data: { user: { id: 'new' }, session: null }, error: null });
    mountPublic(RegisterPage, '/register');
    await screen.findByText('Create your account');
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect((await screen.findByText('Your name is required')).className).toContain('text-pl-danger-text');
    expectNoLegacyChrome();
    type('Full name', 'Ada Obi');
    type('Personal email address', 'ada@example.com');
    type('Password', 'Str0ng!pass');
    type('Confirm password', 'Str0ng!pass');
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect((await screen.findByRole('alert')).className).toContain('bg-pl-danger-bg');
    expectNoLegacyChrome();
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    await screen.findByText('Confirm your email');
    expect(screen.getByRole('alert').className).toContain('bg-pl-success-bg');
    expectNoLegacyChrome();
    expect(getScopeRoot('register-theme-scope').innerHTML).not.toMatch(/BFFF00|A8E600/i);
  });

  it.each([
    ['valid', 'Valid certificate', 'text-pl-success-text'],
    ['expired', 'Certificate expired', 'text-pl-warning-text'],
    ['revoked', 'Certificate revoked', 'text-pl-danger-text'],
  ])('verify: a %s certificate carries its word on its status role', async (status, label, role) => {
    h.rpc = async () => ({
      data: {
        status,
        certificate_number: 'PLA-2026-000123',
        holder: 'Ada Obi',
        app_slug: 'petrophysics',
        course_name: 'Petrophysics',
        course_type: 'practice',
        tier: 'associate',
        issued_at: '2026-03-01T00:00:00Z',
        valid_until: '2027-03-01T00:00:00Z',
      },
      error: null,
    });
    mountPublic(VerifyCertificatePage, '/verify/abc123', '/verify/:code');
    const word = await screen.findByText(label);
    expect(word.className).toContain(role);
    const card = screen.getByTestId('verify-result');
    expect(card).toHaveAttribute('data-status', status);
    expect(card.closest('[data-pl-theme]')).toHaveAttribute('data-pl-theme', 'light');
    // the practice badge takes its themed look inside the scope
    expect(document.querySelector('[data-course-type="practice"]').className).toContain('bg-pl-info-bg');
    expectNoLegacyChrome();
    expect(getScopeRoot('verify-theme-scope').innerHTML).not.toMatch(/BFFF00/i);
  });

  it('verify: an unknown code says so on the danger role', async () => {
    mountPublic(VerifyCertificatePage, '/verify/unknown', '/verify/:code');
    const word = await screen.findByText('No certificate found');
    expect(word.closest('[role="status"]').className).toContain('bg-pl-danger-bg');
    expectNoLegacyChrome();
  });

  it('forgot password: the checking state is already inside the light scope', async () => {
    mountPublic(PasswordResetPage, '/forgot-password');
    const loading = screen.getByRole('status', { name: 'Checking your session' });
    expect(loading.closest('[data-pl-theme]')).toHaveAttribute('data-pl-theme', 'light');
    expectNoLegacyChrome();
    await screen.findByText('Step 1: Identify Account');
  });

  it('forgot password: the error and the sent state', async () => {
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 1: Identify Account');
    type('Email Address', 'not-an-email');
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));
    expect((await screen.findByRole('alert')).className).toContain('bg-pl-danger-bg');
    expectNoLegacyChrome();
    type('Email Address', 'ada@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));
    await screen.findByText('Reset Link Sent');
    expect(screen.getByText('Success').className).toContain('text-pl-success-text');
    expectNoLegacyChrome();
  });

  it('forgot password with a recovery session: the strength meter, the mismatch and the done state', async () => {
    h.session = { user: { id: 'u1', email: 'ada@example.com' } };
    mountPublic(PasswordResetPage, '/forgot-password');
    await screen.findByText('Step 2: Create New Password');
    const meter = () => screen.getByRole('progressbar', { name: 'Password strength' });
    type('New Password', 'weak');
    await screen.findByText('20%');
    expect(meter().className).toContain('[&>div]:bg-pl-danger');
    expectNoLegacyChrome();
    type('New Password', 'Weakpass1');
    await screen.findByText('80%');
    expect(meter().className).toContain('[&>div]:bg-pl-success');
    type('New Password', 'weakpass1');
    await screen.findByText('60%');
    expect(meter().className).toContain('[&>div]:bg-pl-warning');
    // each requirement says whether it is met, so colour is not the only signal
    expect(screen.getByText('Uppercase').parentElement).toHaveTextContent('not met');
    expect(screen.getByText('Lowercase').parentElement).toHaveTextContent(/Lowercase\s*met/);
    type('Confirm Password', 'other');
    expect((await screen.findByText('Passwords do not match')).className).toContain('text-pl-danger-text');
    expect(screen.getByLabelText('Confirm Password')).toHaveAttribute('aria-invalid', 'true');
    fireEvent.click(screen.getAllByRole('button', { name: 'Show password' })[0]);
    expect(screen.getByLabelText('New Password')).toHaveAttribute('type', 'text');
    expectNoLegacyChrome();
    type('New Password', 'N3w!password');
    type('Confirm Password', 'N3w!password');
    await screen.findByText('100%');
    fireEvent.click(screen.getByRole('button', { name: 'Update Password' }));
    await screen.findByText('Password Reset Complete');
    expectNoLegacyChrome();
  });

  it('reset password: the checking state, the form with its strength words, then the done state', async () => {
    mountPublic(ResetPasswordPage, '/reset-password?token=tok-1');
    const loading = screen.getByRole('status', { name: 'Checking your reset link' });
    expect(loading.closest('[data-pl-theme]')).toHaveAttribute('data-pl-theme', 'light');
    expectNoLegacyChrome();
    await screen.findByText('admin@uni.example');
    type('New Password', 'abc');
    await screen.findByText('Weak');
    type('New Password', 'Abcdef1');
    await screen.findByText('Medium');
    expectNoLegacyChrome();
    type('New Password', 'N3w!password');
    expect((await screen.findByText('Strong')).className).toContain('text-pl-success-text');
    type('Confirm Password', 'nope');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    expect((await screen.findByText('Passwords do not match')).className).toContain('text-pl-danger-text');
    expectNoLegacyChrome();
    type('Confirm Password', 'N3w!password');
    fireEvent.click(screen.getByRole('button', { name: 'Set Password & Login' }));
    await screen.findByText('Password Set Successfully!');
    expectNoLegacyChrome();
  });

  it('reset password: a missing token shows the themed error and the way back', async () => {
    mountPublic(ResetPasswordPage, '/reset-password');
    expect((await screen.findByRole('alert')).className).toContain('bg-pl-danger-bg');
    expect(screen.getByRole('link', { name: 'Return to Login' }).className).toContain('border-pl-border-strong');
    expectNoLegacyChrome();
    expectNegativeControl(getScopeRoot('reset-password-theme-scope'));
  });

  it('legal: the contents drawer opens from the brand bar, inside the light scope', async () => {
    mountPublic(PrivacyPolicyPage, '/privacy-policy');
    await screen.findAllByText('1. Introduction');
    const open = screen.getByRole('button', { name: 'Open table of contents' });
    expect(screen.getByTestId('public-brand-bar').contains(open)).toBe(true);
    fireEvent.click(open);
    const drawer = await screen.findByRole('navigation', { name: 'Jump to section' });
    expect(drawer.closest('[data-pl-theme]')).toHaveAttribute('data-pl-theme', 'light');
    expect(screen.getByRole('button', { name: 'Close table of contents' })).toHaveAttribute('aria-expanded', 'true');
    expectNoLegacyChrome({ allow: PRINT });
    fireEvent.click(within(drawer).getAllByRole('button')[0]);
    expect(screen.queryByRole('navigation', { name: 'Jump to section' })).toBeNull();
  });

  it('legal: the footer is an ink strip with the three legal links and the two contact emails', async () => {
    mountPublic(TermsOfServicePage, '/terms-of-service');
    await screen.findAllByText('1. Acceptance of Terms');
    const footer = screen.getByTestId('public-footer');
    expect(footer).toHaveAttribute('data-pl-theme', 'dark');
    expect(getScopeRoot('legal-theme-scope').contains(footer)).toBe(true);
    const f = within(footer);
    expect(f.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy-policy');
    expect(f.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms-of-service');
    expect(f.getByRole('link', { name: 'Academic Integrity' })).toHaveAttribute('href', '/academic-integrity');
    expect(f.getByRole('link', { name: 'Verify a Certificate' })).toHaveAttribute('href', '/verify');
    expect(f.getByRole('link', { name: 'info@petrolord.com' })).toHaveAttribute('href', 'mailto:info@petrolord.com');
    expect(f.getByRole('link', { name: 'info@lordswayenergy.com' })).toHaveAttribute('href', 'mailto:info@lordswayenergy.com');
    expect(footer.innerHTML).not.toMatch(/BFFF00/i);
  });

  it('legal: every section of the three documents still renders', async () => {
    const counts = {};
    for (const [key, Page, route] of [
      ['privacy', PrivacyPolicyPage, '/privacy-policy'],
      ['terms', TermsOfServicePage, '/terms-of-service'],
      ['integrity', AcademicIntegrityPage, '/academic-integrity'],
    ]) {
      mountPublic(Page, route);
      await screen.findByRole('navigation', { name: 'Table of contents' });
      const toc = within(screen.getByRole('navigation', { name: 'Table of contents' })).getAllByRole('button');
      const sections = document.querySelectorAll('main section[id]');
      expect(sections.length).toBe(toc.length);
      counts[key] = sections.length;
      cleanup();
    }
    expect(counts.integrity).toBe(7);
  });
});

describe('the 6B sources', () => {
  const root = path.resolve(__dirname, '../../..');
  const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
  const FILES = [
    'src/components/public/PublicPage.jsx',
    'src/components/legal/LegalPageLayout.jsx',
    'src/components/legal/PolicySection.jsx',
    'src/components/Footer.jsx',
    'src/pages/LoginPage.jsx',
    'src/pages/RegisterPage.jsx',
    'src/pages/VerifyCertificatePage.jsx',
    'src/pages/PasswordResetPage.jsx',
    'src/pages/ResetPasswordPage.jsx',
    'src/pages/PrivacyPolicyPage.jsx',
    'src/pages/TermsOfServicePage.jsx',
    'src/pages/AcademicIntegrityPage.jsx',
    'src/pages/NotFoundPage.jsx',
  ];
  const legacyTokens = (src) => src.split(/[\s"'`{}()]+/).filter((t) => t && hasLegacyChrome(t, { allow: PRINT }));

  it('carry no legacy colour class and no lime (with a negative control)', () => {
    for (const f of FILES) {
      const src = read(f);
      expect({ f, tokens: legacyTokens(src) }).toEqual({ f, tokens: [] });
      expect({ f, lime: /BFFF00|A8E600|a3d900/i.test(src) }).toEqual({ f, lime: false });
    }
    expect(legacyTokens('<div className="bg-[#0F172A] text-slate-300 print:text-gray-800">')).toEqual(['bg-[#0F172A]', 'text-slate-300']);
  });

  it('leave the regal homepage alone: it is unlisted and shares nothing with the frame', () => {
    const home = read('src/pages/LandingPage.jsx');
    expect(home).not.toMatch(/components\/public\/PublicPage|components\/Footer|design\/ThemeProvider/);
    expect(home).toContain("import './LandingPage.css'");
    expect(PUBLIC_LIGHT_ROUTES).not.toContain('/');
    expect(isPublicLightPath('/')).toBe(false);
    expect(coldLoadTheme('/')).toBeNull();
  });

  it('keep every Supabase import on the stand-in', async () => {
    const viaRelative = await import('../../lib/customSupabaseClient');
    const viaAlias = await import('@/lib/customSupabaseClient');
    expect(viaRelative.supabase).toBe(viaAlias.supabase);
    expect(viaRelative.supabase.supabaseUrl).toBeUndefined();
  });
});
