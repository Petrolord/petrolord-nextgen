// Which routes render inside the design-system scope, and the cold-load
// loader for them (NextGen port of the Suite's src/design/coldLoad.jsx).
//
// Signed-in routes: Layout opens the one scope (SignedInScope) on the routes
// listed in src/design/rollout/ while the rollout runs. Before the auth
// session restores, App.jsx shows a loader from outside any scope; on a
// themed route that loader paints in the theme this device last resolved
// (petrolord.theme.v1.last, light when unknown), so a light user does not
// see a dark spinner before a light page and a dark user sees no light
// flash. Every other route keeps its legacy loader byte for byte.
//
// Public and auth pages (login, register, verify, legal) will always render
// light with no toggle once batch 6B lands (as the Suite's 7C). The list is
// empty until then. The regal homepage keeps its own look and is never
// listed.
import React from 'react';
import { readLastTheme } from './ThemeProvider.jsx';
import { DEFAULT_THEME } from './tokens.js';
import { THEMED_ROUTES } from './rollout/index.js';

export const PUBLIC_LIGHT_ROUTES = Object.freeze([]);

const trimSlash = (p) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

/**
 * True when `pathname` matches a registry entry: '/x' that path exactly,
 * '/x/*' that path and everything under it, and a ':name' segment matches
 * any one segment ('/dashboard/apps/:slug/course/*' covers every course
 * reader page).
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

/** True when the signed-in `pathname` renders inside the one scope. */
export function isThemedPath(pathname, routes = THEMED_ROUTES) {
  if (typeof pathname !== 'string') return false;
  return routes.some((r) => matchesRoute(pathname, r)) || isPublicLightPath(pathname);
}

/** The theme a cold-load loader should paint on `pathname`, or null for legacy. */
export function coldLoadTheme(pathname) {
  if (!isThemedPath(pathname)) return null;
  if (isPublicLightPath(pathname)) return 'light';
  return readLastTheme() || DEFAULT_THEME;
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
