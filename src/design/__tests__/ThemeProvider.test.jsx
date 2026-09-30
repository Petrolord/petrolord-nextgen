// @vitest-environment jsdom
//
// The theme provider, ThemedApp, FixedTheme and ThemeToggle (NextGen port):
// light by default, a per-user choice under the Suite's key, safe when
// storage is blocked, and the cold-load helpers.
import React from 'react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, act } from '@testing-library/react';
import {
  ThemedApp, FixedTheme, themeStorageKey, readStoredTheme, writeStoredTheme, LAST_THEME_KEY,
} from '@/design/ThemeProvider';
import { AuthContext } from '@/contexts/SupabaseAuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  isThemedPath, isSignedInPath, coldLoadTheme, matchesRoute, ThemedLoadingScreen,
  isPublicLightPath,
} from '@/design/scopePaths';

const root = () => document.querySelector('[data-pl-root]');

describe('ThemedApp', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('uses the Suite storage key, petrolord.theme.v1:<user id>', () => {
    expect(themeStorageKey('abc')).toBe('petrolord.theme.v1:abc');
    expect(themeStorageKey(null)).toBe('petrolord.theme.v1:anon');
  });

  it('opens light by default and ignores the OS dark preference', () => {
    window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
    render(<ThemedApp userId="u1"><ThemeToggle /></ThemedApp>);
    expect(root().getAttribute('data-pl-theme')).toBe('light');
  });

  it('the toggle switches to dark and back and stores it for that user only', () => {
    render(<ThemedApp userId="u1"><ThemeToggle /></ThemedApp>);
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(root().getAttribute('data-pl-theme')).toBe('dark');
    expect(window.localStorage.getItem('petrolord.theme.v1:u1')).toBe('dark');
    expect(window.localStorage.getItem('petrolord.theme.v1:u2')).toBeNull();
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(root().getAttribute('data-pl-theme')).toBe('light');
    expect(window.localStorage.getItem('petrolord.theme.v1:u1')).toBe('light');
  });

  it('restores a stored choice, and another user on the same browser gets light', () => {
    writeStoredTheme('u1', 'dark');
    const { unmount } = render(<ThemedApp userId="u1"><span /></ThemedApp>);
    expect(root().getAttribute('data-pl-theme')).toBe('dark');
    unmount();
    render(<ThemedApp userId="u2"><span /></ThemedApp>);
    expect(root().getAttribute('data-pl-theme')).toBe('light');
  });

  it('reads the signed-in user from the auth context', () => {
    writeStoredTheme('from-auth', 'dark');
    render(
      <AuthContext.Provider value={{ user: { id: 'from-auth' }, loading: false }}>
        <ThemedApp><span /></ThemedApp>
      </AuthContext.Provider>,
    );
    expect(root().getAttribute('data-pl-theme')).toBe('dark');
  });

  it('while the session restores, paints the last theme this device resolved', () => {
    window.localStorage.setItem(LAST_THEME_KEY, 'dark');
    render(
      <AuthContext.Provider value={{ user: null, loading: true }}>
        <ThemedApp><span /></ThemedApp>
      </AuthContext.Provider>,
    );
    expect(root().getAttribute('data-pl-theme')).toBe('dark');
  });

  it('follows a change made in another tab', () => {
    render(<ThemedApp userId="u1"><span /></ThemedApp>);
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'petrolord.theme.v1:u1', newValue: 'dark' }));
    });
    expect(root().getAttribute('data-pl-theme')).toBe('dark');
  });

  it('works when storage is blocked (light, and the toggle still switches)', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const spy2 = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    try {
      expect(readStoredTheme('u1')).toBeNull();
      render(<ThemedApp userId="u1"><ThemeToggle /></ThemedApp>);
      expect(root().getAttribute('data-pl-theme')).toBe('light');
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(root().getAttribute('data-pl-theme')).toBe('dark');
    } finally {
      spy.mockRestore();
      spy2.mockRestore();
    }
  });

  it('a nested ThemedApp reuses the outer theme and opens no second provider', () => {
    writeStoredTheme('u1', 'dark');
    render(<ThemedApp userId="u1"><ThemedApp data-testid="inner"><ThemeToggle /></ThemedApp></ThemedApp>);
    expect(screen.getByTestId('inner').getAttribute('data-pl-theme')).toBe('dark');
    expect(document.querySelectorAll('[data-pl-root]').length).toBe(1);
  });
});

describe('ThemeToggle and FixedTheme', () => {
  afterEach(cleanup);

  it('the toggle renders nothing outside a scope', () => {
    render(<ThemeToggle />);
    expect(screen.queryByTestId('theme-toggle')).toBeNull();
  });

  it('a fixed scope renders no toggle and never stores anything', () => {
    window.localStorage.clear();
    render(<FixedTheme theme="dark"><ThemeToggle /></FixedTheme>);
    expect(screen.queryByTestId('theme-toggle')).toBeNull();
    expect(window.localStorage.length).toBe(0);
  });
});

describe('route registry and cold load', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('matches exact entries and /* prefixes', () => {
    expect(matchesRoute('/dashboard', '/dashboard')).toBe(true);
    expect(matchesRoute('/dashboard/', '/dashboard')).toBe(true);
    expect(matchesRoute('/dashboard/enroll', '/dashboard')).toBe(false);
    expect(matchesRoute('/dashboard/apps/dca', '/dashboard/apps/dca/*')).toBe(true);
    expect(matchesRoute('/dashboard/apps/dca/course/beginner', '/dashboard/apps/dca/*')).toBe(true);
    expect(matchesRoute('/dashboard/apps/dcax', '/dashboard/apps/dca/*')).toBe(false);
    expect(matchesRoute('/dashboard/apps/dca/course/beginner/m1', '/dashboard/apps/:slug/course/*')).toBe(true);
    expect(matchesRoute('/dashboard/apps/dca/course', '/dashboard/apps/:slug/course/*')).toBe(true);
    expect(matchesRoute('/dashboard/apps/dca', '/dashboard/apps/:slug/course/*')).toBe(false);
    expect(matchesRoute('/dashboard/apps/dca', '/dashboard/apps/:slug')).toBe(true);
    expect(matchesRoute('/dashboard/apps/dca/x', '/dashboard/apps/:slug')).toBe(false);
  });

  it('every signed-in route is scoped: any /dashboard path and /search (wave 7, no registry)', () => {
    for (const p of ['/dashboard', '/dashboard/', '/search', '/dashboard/modules', '/dashboard/modules/x',
      '/dashboard/enroll', '/dashboard/waiver/welldata', '/dashboard/apps/dca', '/dashboard/apps/dca/x',
      '/dashboard/legacy-probe', '/dashboard/no/such/page']) {
      expect({ p, signedIn: isSignedInPath(p), themed: isThemedPath(p) }).toEqual({ p, signedIn: true, themed: true });
    }
    // the homepage keeps its own look; a path outside the app is not a signed-in route
    for (const p of ['/', '/searchx', '/dashboardx', '/legacy-probe']) {
      expect({ p, signedIn: isSignedInPath(p) }).toEqual({ p, signedIn: false });
    }
    expect(isSignedInPath(undefined)).toBe(false);
  });

  it('the cold-load loader paints the last resolved theme on a signed-in route and light elsewhere', () => {
    expect(coldLoadTheme('/dashboard')).toBe('light');
    window.localStorage.setItem(LAST_THEME_KEY, 'dark');
    expect(coldLoadTheme('/dashboard')).toBe('dark');
    expect(coldLoadTheme('/dashboard/enroll')).toBe('dark');
    expect(coldLoadTheme('/dashboard/legacy-probe')).toBe('dark');
    expect(coldLoadTheme('/search')).toBe('dark');
    // no legacy loader is left: every other path paints light
    expect(coldLoadTheme('/legacy-probe')).toBe('light');
    expect(coldLoadTheme('/')).toBe('light');
    render(<ThemedLoadingScreen theme="dark" />);
    expect(screen.getByTestId('themed-loading').getAttribute('data-pl-theme')).toBe('dark');
  });

  it('6B: the public and auth pages always cold-load light, as do the homepage and unknown paths', () => {
    const pages = ['/login', '/register', '/verify', '/verify/abc123', '/forgot-password', '/reset-password',
      '/privacy-policy', '/terms-of-service', '/academic-integrity'];
    window.localStorage.setItem(LAST_THEME_KEY, 'dark');
    for (const p of pages) {
      expect({ p, light: isPublicLightPath(p), themed: isThemedPath(p), cold: coldLoadTheme(p) })
        .toEqual({ p, light: true, themed: true, cold: 'light' });
    }
    for (const p of ['/', '/verify/a/b', '/loginx', '/no-such-page', '/dashboard']) {
      expect({ p, light: isPublicLightPath(p) }).toEqual({ p, light: false });
    }
    expect(coldLoadTheme('/')).toBe('light');
    expect(coldLoadTheme('/no-such-page')).toBe('light');
    expect(coldLoadTheme('/dashboard')).toBe('dark');
  });
});
