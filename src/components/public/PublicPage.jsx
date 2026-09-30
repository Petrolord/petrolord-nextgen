import React from 'react';
import { Link } from 'react-router-dom';
import { ThemedApp } from '@/design/ThemeProvider';
import { cn } from '@/lib/utils';

// Design family rollout batch 6B: the frame for the NextGen public and auth
// pages (docs/scope/DesignSystem-Rollout.md section 5.3). Ported from the
// Suite's src/components/public/PublicPage.jsx (Petrolord/petrolord-suite
// #801, W7C) by way of the HSE port; the NextGen differences are the brand
// mark (NextGen has no wordmark image, so the bar carries the crest and the
// name as the regal homepage does) and the `footer` slot.
//
// These pages sit between the regal homepage (LandingPage.jsx, its own look
// in LandingPage.css under .ng-home) and the academy, so they take the light
// theme (grey panel) under an ink brand bar. They always render light: the
// scope is keyed to the anonymous user and has no toggle, so a signed-in
// learner who works in dark still sees these pages light, and their loader
// paints light too (PUBLIC_LIGHT_ROUTES in src/design/scopePaths.jsx).

export const BRAND_MARK = '/favicon.png';

/** The ink header strip: a fixed dark scope, like the signed-in rail. */
export function PublicBrandBar({ children, className }) {
  return (
    <header
      data-pl-theme="dark"
      data-testid="public-brand-bar"
      className={cn('sticky top-0 z-40 border-b border-pl-accent/20 bg-pl-surface text-pl-text print:hidden', className)}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="Petrolord NextGen home" className="flex min-w-0 items-center gap-3 rounded-sm">
          <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-pl-accent bg-pl-bg">
            <img src={BRAND_MARK} alt="" aria-hidden="true" width="36" height="36" className="h-full w-full object-cover" />
          </span>
          <span className="truncate font-pl-display text-xl font-semibold leading-none sm:text-[22px]">
            Petrolord <span className="text-pl-accent-text">NextGen</span>
          </span>
        </Link>
        {children ? <div className="flex shrink-0 items-center gap-2 sm:gap-4">{children}</div> : null}
      </div>
    </header>
  );
}

/**
 * The themed page frame. `header` replaces the plain brand bar (a page with
 * its own navigation passes it); `header={null}` drops it. `footer` renders
 * after the main region; without it there is none.
 */
export function PublicPage({ testId, header, footer, className, mainClassName, children }) {
  return (
    <ThemedApp
      userId={null}
      data-testid={testId}
      className={cn('flex min-h-screen flex-col bg-pl-bg font-pl-sans text-pl-text', className)}
    >
      {header === undefined ? <PublicBrandBar /> : header}
      <main className={cn('flex flex-1 flex-col', mainClassName)}>{children}</main>
      {footer ?? null}
    </ThemedApp>
  );
}

/**
 * The always-light public scope without the page frame, for a piece of a
 * page that has none of its own. `className="contents"` keeps it out of the
 * layout.
 */
export function PublicScope({ className, children, ...rest }) {
  return (
    <ThemedApp userId={null} className={className} {...rest}>
      {children}
    </ThemedApp>
  );
}

// Shared class strings for the auth cards and the public documents, written
// out literally so Tailwind generates them.
export const AUTH_CARD = 'rounded-2xl border border-pl-border bg-pl-raised p-6 shadow-pl-lg sm:p-8';
export const AUTH_TITLE = 'font-pl-display text-3xl font-semibold leading-tight text-pl-text sm:text-4xl';
export const TEXT_LINK = 'font-medium text-pl-primary-text hover:text-pl-primary-text-hover hover:underline';
/** A centred column for one auth card, with the 16px phone gutter. */
export const AUTH_COLUMN = 'flex flex-1 items-center justify-center px-4 py-10 sm:py-16';
/** A round icon tile above an auth card title. */
export const AUTH_ICON_TILE = 'mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full';
/** The small error line under a form field. */
export const FIELD_ERROR = 'mt-1 text-sm text-pl-danger-text';
/** A form field label. */
export const FIELD_LABEL = 'mb-1 block text-sm font-medium text-pl-text';

export default PublicPage;
