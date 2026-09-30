// @vitest-environment jsdom
//
// Batch 1A (docs/scope/DesignSystem-Rollout.md): the frame and the app root
// pieces.
//
// - The sidebar rail and its course navigation are the family's dark ink
//   rail in both themes, on every signed-in route: a
//   FixedTheme dark scope with no toggle, pl-* roles only, and no lime.
// - The global search modal and the device guard are mounted at the app
//   root, outside every scope. Like the toaster they follow the theme of
//   the screen on show; with no themed screen mounted they open light, on
//   roles (wave 7: there is no legacy markup left).
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent, act } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import {
  expectNoLegacyChrome, getScopeRoot, legacyChromeClasses, hasLegacyChrome,
} from '@/design/testing/themeAssertions';
import { renderApp, USER_ID } from '@/pages/__tests__/frameHarness';

const flags = vi.hoisted(() => ({ limitReached: false }));
vi.mock('@/lib/customSupabaseClient', async () => (await import('@/pages/__tests__/frameStubs')).supabaseStub());
vi.mock('@/contexts/NotificationContext', async () => (await import('@/pages/__tests__/frameStubs')).notificationStub());
vi.mock('@/services/academyService', async () => {
  const { academyServiceStub } = await import('@/pages/__tests__/frameStubs');
  const on = academyServiceStub({ limitReached: true });
  const off = academyServiceStub({ limitReached: false });
  return { ...off, registerDevice: (...a) => (flags.limitReached ? on : off).registerDevice(...a) };
});

const rail = () => screen.getByTestId('sidebar-rail');
const LIME = /BFFF00|191,\s*255,\s*0/i;

const openSearch = () => act(() => {
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
});

beforeAll(installDomShims);
beforeEach(() => {
  window.localStorage.clear();
  flags.limitReached = false;
});
afterEach(cleanup);

describe('the ink rail (Sidebar and CourseModuleNav)', () => {
  const checkRail = async () => {
    // the course catalog has loaded into the rail
    await screen.findByTitle('2 courses built, 1 live');
    const r = rail();
    expect(r.getAttribute('data-pl-theme')).toBe('dark');
    expect(r.hasAttribute('data-pl-root')).toBe(false);
    // no toggle in the rail; it is a fixed theme
    expect(r.querySelector('[data-testid="theme-toggle"]')).toBeNull();
    // roles only, no lime, no legacy console colour
    const bad = [r, ...r.querySelectorAll('[class]')].map((e) => e.getAttribute('class')).filter((c) => c && hasLegacyChrome(c));
    expect(bad).toEqual([]);
    expect(LIME.test(r.outerHTML)).toBe(false);
  };

  it('is dark ink on a themed page in light', async () => {
    renderApp('/dashboard');
    await checkRail();
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('light');
    // the rail sits outside the page scope
    expect(getScopeRoot().contains(rail())).toBe(false);
  });

  it('stays dark ink when the page toggles to dark and back', async () => {
    renderApp('/dashboard');
    await checkRail();
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('dark');
    expect(rail().getAttribute('data-pl-theme')).toBe('dark');
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(rail().getAttribute('data-pl-theme')).toBe('dark');
  });

  it('is the same ink rail on any signed-in route, beside the one page scope', async () => {
    renderApp('/legacy-probe');
    await screen.findByText('Legacy probe');
    await checkRail();
    expect(getScopeRoot().getAttribute('data-pl-theme')).toBe('light');
    expect(getScopeRoot().contains(rail())).toBe(false);
  });

  it('marks the active item with the gold edge and the course module open', async () => {
    renderApp('/dashboard/apps/petrophysics');
    const link = await screen.findByRole('link', { name: 'Petrophysics' });
    expect(link.className).toContain('bg-pl-raised');
    expect(link.className).toContain('shadow-[inset_3px_0_0_rgb(var(--pl-accent))]');
    const enroll = screen.getByRole('link', { name: 'Enroll' });
    expect(enroll.className).toContain('text-pl-muted');
    expect(enroll.className).not.toContain('bg-pl-raised ');
    // a built but unreleased course is listed, muted, not a link
    expect(screen.getByText('Well Data').closest('a')).toBeNull();
    // an empty module shows the family missing-value glyph
    expect(screen.getAllByTitle('No courses built yet')[0].textContent).toBe('n/a');
    await checkRail();
  });
});

describe('the search modal and the device guard follow the page', () => {
  it('the search modal opens on theme roles over a themed page, in light and in dark', async () => {
    renderApp('/dashboard');
    await screen.findByText('Decline Curve Analysis');
    openSearch();
    const input = await screen.findByPlaceholderText(/Search anything/);
    let dlg = input.closest('[role="dialog"]');
    expect(dlg.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    fireEvent.change(input, { target: { value: 'zzzz-no-match' } });
    await screen.findByText('No quick matches found.');
    expectNoLegacyChrome();
    fireEvent.change(input, { target: { value: 'a' } });
    expectNoLegacyChrome();
    openSearch(); // close
    fireEvent.click(screen.getByTestId('theme-toggle'));
    openSearch();
    dlg = (await screen.findByPlaceholderText(/Search anything/)).closest('[role="dialog"]');
    expect(dlg.getAttribute('data-pl-theme')).toBe('dark');
    expectNoLegacyChrome();
  });

  it('the device dialog opens on theme roles over a themed page', async () => {
    flags.limitReached = true;
    renderApp('/dashboard');
    await screen.findByText('Device limit reached');
    const dlg = screen.getByRole('alertdialog');
    expect(dlg.getAttribute('data-pl-theme')).toBe('light');
    expectNoLegacyChrome();
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(screen.getByRole('alertdialog').getAttribute('data-pl-theme')).toBe('dark');
    expectNoLegacyChrome();
  });

  it('negative control: the detector finds a legacy class planted in the themed dialog', async () => {
    renderApp('/dashboard');
    await screen.findByText('Decline Curve Analysis');
    openSearch();
    const dlg = (await screen.findByPlaceholderText(/Search anything/)).closest('[role="dialog"]');
    const bad = document.createElement('span');
    bad.className = 'text-[#BFFF00]';
    dlg.appendChild(bad);
    expect(legacyChromeClasses()).toContain('text-[#BFFF00]');
    bad.remove();
  });

  describe('with no themed screen mounted, the root dialogs open light on roles', () => {
    const noPageScope = () => expect(document.querySelector('[data-pl-root]')).toBeNull();

    it('search modal: empty, quick results and no match', async () => {
      renderApp('/outside');
      await screen.findByText('No layout here');
      noPageScope();
      openSearch();
      const input = await screen.findByPlaceholderText(/Search anything/);
      expect(input.closest('[role="dialog"]').getAttribute('data-pl-theme')).toBe('light');
      expectNoLegacyChrome();
      fireEvent.change(input, { target: { value: 'a' } });
      expectNoLegacyChrome();
      fireEvent.change(input, { target: { value: 'zzzz-no-match' } });
      await screen.findByText('No quick matches found.');
      expectNoLegacyChrome();
      expect(LIME.test(document.body.innerHTML)).toBe(false);
    });

    it('search modal stays light for a user who chose dark', async () => {
      window.localStorage.setItem(`petrolord.theme.v1:${USER_ID}`, 'dark');
      renderApp('/outside');
      openSearch();
      const input = await screen.findByPlaceholderText(/Search anything/);
      expect(input.closest('[role="dialog"]').getAttribute('data-pl-theme')).toBe('light');
    });

    it('device limit dialog', async () => {
      flags.limitReached = true;
      renderApp('/outside');
      await screen.findByText('Device limit reached');
      noPageScope();
      expect(screen.getByRole('alertdialog').getAttribute('data-pl-theme')).toBe('light');
      expectNoLegacyChrome();
      expect(LIME.test(document.body.innerHTML)).toBe(false);
    });

    it('negative control: a legacy class planted in the light dialog is found', async () => {
      renderApp('/outside');
      openSearch();
      const dlg = (await screen.findByPlaceholderText(/Search anything/)).closest('[role="dialog"]');
      const bad = document.createElement('span');
      bad.className = 'bg-[#1E293B]';
      dlg.appendChild(bad);
      expect(legacyChromeClasses()).toContain('bg-[#1E293B]');
      bad.remove();
    });
  });
});

// USER_ID is the harness user; the stored choice lands under its key.
it('the rail never stores a theme', async () => {
  renderApp('/dashboard');
  await screen.findByText('Decline Curve Analysis');
  expect(window.localStorage.getItem(`petrolord.theme.v1:${USER_ID}`)).toBeNull();
});
