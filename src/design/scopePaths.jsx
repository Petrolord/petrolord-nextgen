// Which theme the cold-load loader paints on a path (NextGen port of the
// Suite's src/design/coldLoad.jsx), as of the wave 7 end state.
//
// Signed-in routes: Layout opens the one scope (SignedInScope) on every
// route it renders; there is no gate and no registry. Before the auth
// session restores, App.jsx shows a loader from outside any scope; on a
// signed-in path that loader paints in the theme this device last resolved
// (petrolord.theme.v1.last, light when unknown), so a light user does not
// see a dark spinner before a light page and a dark user sees no light
// flash.
//
// Public and auth pages (login, register, verify, the password pages, legal)
// always render light with no toggle (batch 6B, as the Suite's 7C): they
// open their own scope through src/components/public/PublicPage.jsx, and
// their loader paints light whatever this device last resolved. So does the
// loader on any other path (the 404 page is on the same light frame). The
// regal homepage keeps its own look and is not lazy, so it shows no loader.
import React from 'react';
import { readLastTheme } from './ThemeProvider.jsx';
import { DEFAULT_THEME } from './tokens.js';

// Every route App.jsx renders inside Layout.
export const SIGNED_IN_ROUTES = Object.freeze(['/dashboard/*', '/search']);

export const PUBLIC_LIGHT_ROUTES = Object.freeze([
  '/login',
  '/register',
  '/verify',
  '/verify/:code',
  '/forgot-password',
  '/reset-password',
  '/privacy-policy',
  '/terms-of-service',
  '/academic-integrity',
]);

const trimSlash = (p) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

/**
 * True when `pathname` matches a route entry: '/x' that path exactly,
 * '/x/*' that path and everything under it, and a ':name' segment matches
 * any one segment ('/verify/:code').
 */
export function matchesRoute(pathname, entry) {
  const p = trimSlash(pathname).split('/');
  const prefix = entry.endsWith('/*');
  const e = trimSlash(prefix ? entry.slice(0, -2) : entry).split('/');
  if (prefix ? p.length < e.length : p.length !== e.length) return false;
  return e.every((seg, i) => (seg.startsWith(':') ? p[i] !== '' : seg === p[i]));
}

/** True when `pathname` is a public or auth page that always renders light. */
export function isPublicLightPath(pathname, routes = PUBLIC_LIGHT_ROUTES) {
  if (typeof pathname !== 'string') return false;
  return routes.some((r) => matchesRoute(pathname, r));
}

/** True when `pathname` is a signed-in route (Layout opens the one scope there). */
export function isSignedInPath(pathname, routes = SIGNED_IN_ROUTES) {
  if (typeof pathname !== 'string') return false;
  return routes.some((r) => matchesRoute(pathname, r));
}

/** True when `pathname` renders inside a design-system scope (signed-in or public). */
export function isThemedPath(pathname) {
  return isSignedInPath(pathname) || isPublicLightPath(pathname);
}

/**
 * The theme a cold-load loader paints on `pathname`: the device's last theme
 * on a signed-in path, light everywhere else.
 */
export function coldLoadTheme(pathname) {
  if (isSignedInPath(pathname)) return readLastTheme() || DEFAULT_THEME;
  return 'light';
}

/** Full-screen themed spinner (its own scope; it is not a ThemedApp). */
export function ThemedLoadingScreen({ theme, className = 'h-screen' }) {
  return (
    <div
      data-pl-theme={theme}
      data-pl-root=""
      data-testid="themed-loading"
      role="status"
      aria-live="polite"
      className={`flex w-full items-center justify-center ${className}`}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-pl-border border-t-pl-primary" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
