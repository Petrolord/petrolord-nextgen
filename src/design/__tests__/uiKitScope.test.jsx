// @vitest-environment jsdom
//
// Inside a design-system scope every adapted ui piece renders on theme
// roles only (no legacy console colour, portals included), in both themes,
// and each portal carries the scope attribute so its roles resolve.
import React from 'react';
import { describe, it, expect, afterEach, beforeAll, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { UI_SCENES } from './uiScenes';
import { ThemedApp } from '@/design/ThemeProvider';
import { themeStorageKey } from '@/design/ThemeProvider';
import { installDomShims } from '@/design/testing/domShims';
import { legacyChromeClasses, hasLegacyChrome } from '@/design/testing/themeAssertions';

const PORTAL_SCENES = { select: 'Alpha', dialog: 'Dialog title', 'alert-dialog': 'Sure?', 'dropdown-menu': 'Item', popover: 'Popover body' };

describe('the ui kit inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  for (const theme of ['light', 'dark']) {
    for (const [name, Scene] of UI_SCENES) {
      it(`${name} (${theme}) renders theme roles only`, () => {
        window.localStorage.setItem(themeStorageKey('u-kit'), theme);
        render(<ThemedApp userId="u-kit"><Scene /></ThemedApp>);
        const scope = document.querySelector('[data-pl-root]');
        expect(scope.getAttribute('data-pl-theme')).toBe(theme);
        expect(legacyChromeClasses()).toEqual([]);
        // the scene really rendered classes (not an empty pass)
        expect(document.body.querySelectorAll('[class]').length).toBeGreaterThan(1);
      });
    }
  }

  for (const [name, text] of Object.entries(PORTAL_SCENES)) {
    it(`${name} content renders in a portal that carries the scope attribute`, () => {
      const Scene = Object.fromEntries(UI_SCENES)[name];
      render(<ThemedApp userId="u-kit"><Scene /></ThemedApp>);
      const node = [...document.body.querySelectorAll('*')].find((el) => el.textContent === text && !el.children.length);
      expect(node).toBeTruthy();
      const scope = node.closest('[data-pl-theme]');
      expect(scope).toBeTruthy();
      expect(scope.getAttribute('data-pl-theme')).toBe('light');
      expect(scope.hasAttribute('data-pl-root')).toBe(false);
    });
  }

  it('toasts at the app root follow the themed screen on show, and are light without one', () => {
    const Toasts = Object.fromEntries(UI_SCENES).toast;
    render(<Toasts />);
    const bare = document.querySelector('ol');
    expect(bare.getAttribute('data-pl-theme')).toBe('light');
    expect(bare.querySelector('li').className).toMatch(/bg-pl-raised/);
    expect([...bare.querySelectorAll('[class]')].filter((el) => hasLegacyChrome(el.getAttribute('class')))).toEqual([]);
    cleanup();

    window.localStorage.setItem(themeStorageKey('u-kit'), 'dark');
    render(<><ThemedApp userId="u-kit"><p>screen</p></ThemedApp><Toasts /></>);
    const viewport = document.querySelector('ol');
    expect(viewport.getAttribute('data-pl-theme')).toBe('dark');
    const toast = viewport.querySelector('li');
    expect(toast.className).toMatch(/bg-pl-raised/);
    expect(hasLegacyChrome(toast.className)).toBe(false);
  });

  it('the detector is not blind (negative control)', () => {
    render(<ThemedApp userId="u-kit"><div className="bg-[#1E293B] text-slate-200">x</div></ThemedApp>);
    expect(legacyChromeClasses()).toEqual(['bg-[#1E293B] text-slate-200']);
  });
});
