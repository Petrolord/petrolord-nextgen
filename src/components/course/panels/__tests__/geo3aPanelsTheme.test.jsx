// @vitest-environment jsdom
//
// Batch 3A: the geoscience I panels INSIDE a design-system scope (their
// learning pages, and the course reader once batch 1C registers it). Every
// scene renders with no legacy console colour outside its charts in light and
// in dark, no lime anywhere, and every chart on the white chart kit. The
// detector is proven live with a negative control.
import React from 'react';
import { describe, it, expect, afterEach, beforeAll, beforeEach } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import {
  expectNoLegacyChrome, expectNegativeControl, expectLightByDefault, expectToggleRoundTrip, getScopeRoot,
} from '@/design/testing/themeAssertions';
import { ThemedApp } from '@/design/ThemeProvider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GEO3A_SCENES } from './geo3aScenes';

const USER = 'geo3a-user';
const scoped = (el) => (
  <ThemedApp userId={USER} data-testid="geo3a-scope">
    <ThemeToggle data-testid="theme-toggle" />
    {el}
  </ThemedApp>
);

describe('geoscience I panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('opens light, toggles to dark and back, and the detector is live', () => {
    render(scoped(GEO3A_SCENES[0].element));
    const scope = getScopeRoot('geo3a-scope');
    expectLightByDefault(scope);
    expectToggleRoundTrip(scope, { userId: USER });
    expectNegativeControl(scope);
  });

  for (const scene of GEO3A_SCENES) {
    it(`${scene.name}: no legacy chrome in light and in dark, charts white`, async () => {
      render(scoped(scene.element));
      if (scene.act) await scene.act({ screen, fireEvent, waitFor });
      const scope = getScopeRoot('geo3a-scope');
      expect(scope.getAttribute('data-pl-theme')).toBe('light');
      expectNoLegacyChrome();
      expect(document.body.innerHTML).not.toMatch(/BFFF00|A8E600|f472b6|38bdf8/i);
      for (const svg of scope.querySelectorAll('svg[role="img"]')) {
        expect(svg.closest('[data-canvas="chart"]')).not.toBeNull();
      }
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(scope.getAttribute('data-pl-theme')).toBe('dark');
      expectNoLegacyChrome();
    });
  }

  it('status words keep their status roles (a dead curve reads danger, with its word)', async () => {
    render(scoped(GEO3A_SCENES.find((s) => s.name === 'CampaignExplorer').element));
    const dead = screen.getByText('DEAD, no finite samples');
    expect(dead.className).toMatch(/\btext-pl-danger-text\b/);
  });

  it('the panel actions are the themed primary button (lime retired)', async () => {
    render(scoped(GEO3A_SCENES.find((s) => s.name === 'PickettExplorer').element));
    const button = screen.getByRole('button', { name: /Fit water line/ });
    expect(button.className).toMatch(/\bbg-pl-primary\b/);
  });
});
