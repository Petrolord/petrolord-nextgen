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
import { useThemeClass } from '@/design/themeClass';
import {
  isThemedPath, coldLoadTheme, matchesRoute, ThemedLoadingScreen,
} from '@/design/scopePaths';
import { THEMED_ROUTES } from '@/design/rollout';

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

describe('useThemeClass', () => {
  afterEach(cleanup);
  const Probe = () => {
    const tc = useThemeClass({ 'bg-slate-900': 'bg-pl-surface' });
    return <p data-testid="p" className={`${tc('bg-slate-900')} ${tc('text-slate-200', 'text-pl-text')}`} />;
  };

  it('returns the legacy classes outside a scope and the themed ones inside', () => {
    render(<Probe />);
    expect(screen.getByTestId('p').className).toBe('bg-slate-900 text-slate-200');
    cleanup();
    render(<ThemedApp userId="u1"><Probe /></ThemedApp>);
    expect(screen.getByTestId('p').className).toBe('bg-pl-surface text-pl-text');
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

  it('wave 0 themes the dashboard home, and 1A the search page and the modules placeholder', () => {
    expect(THEMED_ROUTES).toEqual(expect.arrayContaining(['/dashboard', '/search', '/dashboard/modules/*']));
    for (const p of ['/dashboard', '/search', '/dashboard/modules', '/dashboard/modules/x']) {
      expect({ p, themed: isThemedPath(p) }).toEqual({ p, themed: true });
    }
    // /legacy-probe is the test-only unregistered route (3C registered /dashboard/apps/dca)
    for (const p of ['/', '/login', '/dashboard/enroll', '/legacy-probe', '/searchx']) {
      expect({ p, themed: isThemedPath(p) }).toEqual({ p, themed: false });
    }
  });

  it('the cold-load loader paints the last resolved theme on a themed route and stays legacy elsewhere', () => {
    expect(coldLoadTheme('/dashboard')).toBe('light');
    window.localStorage.setItem(LAST_THEME_KEY, 'dark');
    expect(coldLoadTheme('/dashboard')).toBe('dark');
    expect(coldLoadTheme('/dashboard/enroll')).toBeNull();
    expect(coldLoadTheme('/')).toBeNull();
    render(<ThemedLoadingScreen theme="dark" />);
    expect(screen.getByTestId('themed-loading').getAttribute('data-pl-theme')).toBe('dark');
  });

  it('3C themes the reservoir course apps (their learning pages only)', () => {
    const w3c = ['dca', 'mbal', 'scal', 'waterflood', 'sim', 'fluid', 'welltest'].map((a) => `/dashboard/apps/${a}`);
    expect(THEMED_ROUTES).toEqual(expect.arrayContaining(w3c));
    for (const p of w3c) expect({ p, themed: isThemedPath(p) }).toEqual({ p, themed: true });
    for (const p of ['/dashboard/apps/dcax', '/dashboard/apps/dca/x', '/dashboard/apps/simulation']) {
      expect({ p, themed: isThemedPath(p) }).toEqual({ p, themed: false });
    }
  });
});
