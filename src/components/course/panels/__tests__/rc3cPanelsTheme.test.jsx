// @vitest-environment jsdom
//
// Batch 3C: the reservoir panels INSIDE a design-system scope (their
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
import { RC3C_SCENES } from './rc3cScenes';

const USER = 'rc3c-user';
const scoped = (el) => (
  <ThemedApp userId={USER} data-testid="rc3c-scope">
    <ThemeToggle data-testid="theme-toggle" />
    {el}
  </ThemedApp>
);

describe('reservoir panels inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it('opens light, toggles to dark and back, and the detector is live', () => {
    render(scoped(RC3C_SCENES[0].element));
    const scope = getScopeRoot('rc3c-scope');
    expectLightByDefault(scope);
    expectToggleRoundTrip(scope, { userId: USER });
    expectNegativeControl(scope);
  });

  for (const scene of RC3C_SCENES) {
    it(`${scene.name}: no legacy chrome in light and in dark, charts white`, async () => {
      render(scoped(scene.element));
      if (scene.act) await scene.act({ screen, fireEvent, waitFor });
      const scope = getScopeRoot('rc3c-scope');
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

  it('status words keep their status roles (a regressed target reads danger, beside its WORSE note)', async () => {
    render(scoped(RC3C_SCENES.find((s) => s.name === 'TuningExplorer').element));
    const scope = getScopeRoot('rc3c-scope');
    expect(scope.querySelector('.text-pl-danger-text')).not.toBeNull();
    expect(scope.textContent).toMatch(/got WORSE/);
  });

  it('a warning box is on the warning roles with its words', async () => {
    const scene = RC3C_SCENES.find((s) => s.name === 'BuildupExplorer every point');
    render(scoped(scene.element));
    await scene.act({ screen, fireEvent, waitFor });
    const title = screen.getByText('This window says the well is stimulated');
    expect(title.className).toMatch(/\btext-pl-warning-text\b/);
    expect(title.parentElement.className).toMatch(/\bbg-pl-warning-bg\b/);
  });

  it('the panel toggles are the themed primary (lime retired)', async () => {
    render(scoped(RC3C_SCENES.find((s) => s.name === 'AquiferExplorer').element));
    const on = screen.getByRole('button', { name: /pseudo steady state/ });
    expect(on.className).toMatch(/\bbg-pl-primary\b/);
    const off = screen.getByRole('button', { name: /the trap/ });
    expect(off.className).toMatch(/\bbg-pl-surface\b/);
  });
});
