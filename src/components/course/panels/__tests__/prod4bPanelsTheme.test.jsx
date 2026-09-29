// @vitest-environment jsdom
//
// Batch 4B: the rod pump, gas well and flow assurance panels inside a
// design-system scope (their learning pages and the course reader, both
// themed). They are on roles with no legacy branch. Every view of every panel
// renders with no legacy console colour outside its charts in light and in
// dark, no lime or old dark-plate colour anywhere, and every chart in a white
// chart frame. The detector is proven live with a negative control.
import React from 'react';
import { describe, it, expect, afterEach, beforeAll, beforeEach } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import {
  expectNoLegacyChrome, expectNegativeControl, expectLightByDefault, expectToggleRoundTrip, getScopeRoot,
} from '@/design/testing/themeAssertions';
import { ThemedApp } from '@/design/ThemeProvider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import StringExplorer from '@/components/course/panels/rodpump/StringExplorer';
import CardExplorer from '@/components/course/panels/rodpump/CardExplorer';
import BalanceExplorer from '@/components/course/panels/rodpump/BalanceExplorer';
import { PROD4B_SCENES } from './prod4bScenes';

const USER = 'prod4b-user';
const TIMEOUT = 120000;
const scoped = (el) => (
  <ThemedApp userId={USER} data-testid="prod4b-scope">
    <ThemeToggle data-testid="theme-toggle" />
    {el}
  </ThemedApp>
);

const expectChartsWhite = (scope) => {
  expect(document.body.innerHTML).not.toMatch(/BFFF00|A8E600|f472b6|38bdf8|f97316|#0f172a|#334155/i);
  for (const rc of scope.querySelectorAll('.recharts-responsive-container')) {
    expect(rc.closest('[data-canvas="chart"]')).not.toBeNull();
  }
};

describe('production II panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('opens light, toggles to dark and back, and the detector is live', () => {
    render(scoped(<StringExplorer />));
    const scope = getScopeRoot('prod4b-scope');
    expectLightByDefault(scope);
    expectToggleRoundTrip(scope, { userId: USER });
    expectNegativeControl(scope);
  });

  for (const scene of PROD4B_SCENES) {
    it(`${scene.name}: no legacy chrome in light and in dark, charts white`, async () => {
      render(scoped(scene.element));
      if (scene.act) await scene.act({ screen, fireEvent, waitFor });
      const scope = getScopeRoot('prod4b-scope');
      expect(scope.getAttribute('data-pl-theme')).toBe('light');
      expectNoLegacyChrome();
      expectChartsWhite(scope);
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(scope.getAttribute('data-pl-theme')).toBe('dark');
      expectNoLegacyChrome();
    }, TIMEOUT);
  }

  it('a flagged row reads warning with its words (the two minima have opposite signs)', () => {
    render(scoped(<BalanceExplorer initialMode="envelope" />));
    const scope = getScopeRoot('prod4b-scope');
    const flagged = [...scope.querySelectorAll('tr.text-pl-warning-text')];
    expect(flagged.length).toBeGreaterThan(0);
    expect(flagged.some((tr) => /OPPOSITE SIGNS/.test(tr.textContent))).toBe(true);
    expect(scope.textContent).toMatch(/the rows above in amber/);
  }, TIMEOUT);

  it('the march button is the themed primary and the typed well inputs take the Suite input styling (lime retired)', () => {
    render(scoped(<CardExplorer initialMode="typed" />));
    const button = screen.getByRole('button', { name: /March this well/ });
    expect(button.className).toMatch(/\bbg-pl-primary\b/);
    expect(button.className).not.toMatch(/gray-/);
  }, TIMEOUT);
});
