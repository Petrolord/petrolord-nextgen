// @vitest-environment jsdom
//
// Wave 7 (docs/scope/DesignSystem-Rollout.md): phone navigation. Below md
// the ink rail is hidden, so the header menu button opens the same rail in a
// drawer: a modal dialog in a fixed dark scope. It starts closed, closes on
// navigation and on Escape, and traps focus. Before wave 7 the button had no
// handler and there was no drawer, so every check below failed.
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, waitFor, within } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { hasLegacyChrome, getScopeRoot } from '@/design/testing/themeAssertions';
import { renderApp } from '@/pages/__tests__/frameHarness';

vi.mock('@/lib/customSupabaseClient', async () => (await import('@/pages/__tests__/frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('@/pages/__tests__/frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => (await import('@/pages/__tests__/frameStubs')).academyServiceStub({ limitReached: false }));

const drawer = () => screen.queryByTestId('sidebar-drawer');
const menuButton = () => screen.getByTestId('nav-menu-button');
const LIME = /BFFF00|191,\s*255,\s*0/i;

const open = async () => {
  fireEvent.click(menuButton());
  await waitFor(() => expect(drawer()).toBeTruthy());
  return drawer();
};

beforeAll(installDomShims);
beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe('phone navigation drawer', () => {
  it('starts closed, and the menu button says so', async () => {
    renderApp('/dashboard');
    await screen.findByText('Decline Curve Analysis');
    expect(drawer()).toBeNull();
    const btn = menuButton();
    expect(btn.getAttribute('aria-label')).toBe('Open navigation');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-controls')).toBe('sidebar-drawer');
    // a phone control: hidden at md and wider
    expect(btn.className).toContain('md:hidden');
  });

  it('the menu button opens the same rail, as dark ink, in a modal dialog', async () => {
    renderApp('/dashboard');
    await screen.findByText('Decline Curve Analysis');
    const d = await open();
    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
    expect(d.getAttribute('role')).toBe('dialog');
    expect(d.getAttribute('data-pl-theme')).toBe('dark');
    expect(d.hasAttribute('data-pl-root')).toBe(false);
    expect(d.className).toContain('md:hidden');
    expect(within(d).getByText('Main navigation')).toBeTruthy();
    // the same items as the rail, in the same order
    const names = (root) => [...root.querySelectorAll('a')].map((a) => a.textContent.trim());
    const rail = screen.getByTestId('sidebar-rail');
    await waitFor(() => expect(names(d)).toEqual(names(rail)));
    expect(names(d)).toEqual(expect.arrayContaining(['Dashboard', 'Enroll', 'Certificates', 'Settings']));
    // fixed ink: no toggle inside, roles only, no lime; the page keeps its theme
    expect(d.querySelector('[data-testid="theme-toggle"]')).toBeNull();
    const bad = [d, ...d.querySelectorAll('[class]')].map((e) => e.getAttribute('class')).filter((c) => c && hasLegacyChrome(c));
    expect(bad).toEqual([]);
    expect(LIME.test(d.outerHTML)).toBe(false);
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('light');
    // negative control for the class check
    expect(hasLegacyChrome('bg-[#1E293B] text-[#BFFF00]')).toBe(true);
  });

  it('stays dark ink when the page is dark', async () => {
    renderApp('/dashboard');
    await screen.findByText('Decline Curve Analysis');
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
    expect((await open()).getAttribute('data-pl-theme')).toBe('dark');
  });

  it('closes on Escape and returns focus to the menu button', async () => {
    renderApp('/dashboard');
    await screen.findByText('Decline Curve Analysis');
    const d = await open();
    fireEvent.keyDown(d, { key: 'Escape' });
    await waitFor(() => expect(drawer()).toBeNull());
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
    await waitFor(() => expect(document.activeElement).toBe(menuButton()));
  });

  it('closes with its close button and with the scrim', async () => {
    renderApp('/dashboard');
    await screen.findByText('Decline Curve Analysis');
    let d = await open();
    fireEvent.click(within(d).getByRole('button', { name: 'Close navigation' }));
    await waitFor(() => expect(drawer()).toBeNull());
    d = await open();
    const scrim = screen.getByTestId('sidebar-drawer-scrim');
    fireEvent.pointerDown(scrim, { button: 0, ctrlKey: false });
    fireEvent.mouseDown(scrim);
    fireEvent.click(scrim);
    await waitFor(() => expect(drawer()).toBeNull());
  });

  it('closes on navigation', async () => {
    renderApp('/legacy-probe');
    await screen.findByText('Legacy probe');
    const d = await open();
    fireEvent.click(within(d).getByRole('link', { name: 'Dashboard' }));
    await waitFor(() => expect(drawer()).toBeNull());
    // the route changed and the drawer stays closed on the new page
    await screen.findByText('Decline Curve Analysis');
    expect(drawer()).toBeNull();
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('traps focus: focus moves into the drawer, Tab stays inside, and the page behind is hidden from assistive tech', async () => {
    renderApp('/dashboard');
    await screen.findByText('Decline Curve Analysis');
    const d = await open();
    await waitFor(() => expect(d.contains(document.activeElement)).toBe(true));
    // Radix guards both ends of the tab order while the dialog is open
    expect(document.querySelectorAll('[data-radix-focus-guard]').length).toBe(2);
    // focus pushed outside comes back
    const outside = menuButton();
    outside.focus();
    await waitFor(() => expect(d.contains(document.activeElement)).toBe(true));
    // Tab from the last control wraps to the first, Shift+Tab from the first to the last
    const focusable = [...d.querySelectorAll('a[href], button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
    // the page column is inert to assistive tech while the drawer is open
    expect(getScopeRoot().closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it('closes itself when the viewport reaches md', async () => {
    const real = window.matchMedia;
    let matches = false;
    const listeners = new Set();
    window.matchMedia = () => ({
      get matches() { return matches; },
      addEventListener: (_, l) => listeners.add(l),
      removeEventListener: (_, l) => listeners.delete(l),
      addListener() {}, removeListener() {},
    });
    try {
      renderApp('/dashboard');
      await screen.findByText('Decline Curve Analysis');
      await open();
      matches = true;
      listeners.forEach((l) => l({ matches: true }));
      await waitFor(() => expect(drawer()).toBeNull());
    } finally {
      window.matchMedia = real;
    }
  });
});
