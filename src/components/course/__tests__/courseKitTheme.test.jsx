// @vitest-environment jsdom
//
// Batch 1B: the course kit inside a design-system scope
// (docs/scope/DesignSystem-Rollout.md section 4). Every scene of
// courseKitScenes.jsx renders with no legacy console colour (lime, slate,
// gray, the #0F172A / #1E293B plates, sky and the raw status hues) in light
// and in dark, the scope opens light and the toggle goes to dark and back,
// and the detector is proven live with a negative control. The legacy
// branch outside a scope is courseKitLegacy.test.jsx.
import React from 'react';
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import {
  expectNoLegacyChrome, expectNegativeControl, expectLightByDefault, expectToggleRoundTrip, getScopeRoot,
} from '@/design/testing/themeAssertions';
import { ThemedApp } from '@/design/ThemeProvider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { COURSE_KIT_SCENES } from './courseKitScenes';

vi.mock('@/hooks/useActivation', () => ({
  useActivation: () => ({ status: globalThis.__courseKitGate?.activation ?? null, loading: false }),
}));
vi.mock('@/contexts/RoleContext', () => ({ useRole: () => ({ isViewAsStudent: true }) }));
vi.mock('@/services/academyService', () => ({
  listMyEnrollments: () => {
    const rows = globalThis.__courseKitGate?.enrollments;
    return rows === null || rows === undefined ? new Promise(() => {}) : Promise.resolve(rows);
  },
  claimPracticeCertificate: async () => ({}),
  verificationUrl: (code) => `https://example.test/verify/${code}`,
}));

const USER = 'kit-user';
const scoped = (el) => (
  <ThemedApp userId={USER} data-testid="kit-scope">
    <ThemeToggle data-testid="theme-toggle" />
    {el}
  </ThemedApp>
);
const toDark = () => fireEvent.click(screen.getByTestId('theme-toggle'));

describe('the course kit inside a scope', () => {
  beforeAll(installDomShims);
  beforeEach(() => window.localStorage.clear());
  afterEach(() => { cleanup(); globalThis.__courseKitGate = undefined; });

  it('opens light, toggles to dark and back, and the detector is live', async () => {
    const scene = COURSE_KIT_SCENES.find((s) => s.name === 'panelKit');
    render(scoped(scene.element));
    const scope = getScopeRoot('kit-scope');
    expectLightByDefault(scope);
    expectToggleRoundTrip(scope, { userId: USER });
    expectNegativeControl(scope);
  });

  for (const scene of COURSE_KIT_SCENES) {
    it(`${scene.name}: no legacy chrome in light and in dark`, async () => {
      scene.before?.();
      render(scoped(scene.element));
      if (scene.act) await scene.act({ screen, fireEvent, waitFor });
      const scope = getScopeRoot('kit-scope');
      expect(scope.getAttribute('data-pl-theme')).toBe('light');
      expectNoLegacyChrome();
      expect(document.body.innerHTML).not.toMatch(/BFFF00/i);
      toDark();
      expect(scope.getAttribute('data-pl-theme')).toBe('dark');
      expectNoLegacyChrome();
    });
  }

  it('the actions use the themed button variants (lime retired)', async () => {
    const scene = COURSE_KIT_SCENES.find((s) => s.name === 'PracticeCertificateCard ready');
    render(scoped(scene.element));
    const button = screen.getByRole('button', { name: /Issue my Associate certificate/ });
    expect(button.className).toMatch(/\bbg-pl-primary\b/);
    expect(button.className).not.toMatch(/#BFFF00/i);
  });

  it('status lines carry the status roles with their words', async () => {
    const failed = COURSE_KIT_SCENES.find((s) => s.name === 'QuizRunner failed');
    render(scoped(failed.element));
    await failed.act({ screen, fireEvent, waitFor });
    expect(screen.getByText(/Pass mark is 70%/).className).toMatch(/\btext-pl-danger-text\b/);
    cleanup();
    const passed = COURSE_KIT_SCENES.find((s) => s.name === 'QuizRunner passed');
    render(scoped(passed.element));
    await passed.act({ screen, fireEvent, waitFor });
    expect(screen.getByText(/Passed with 2\/2/).className).toMatch(/\btext-pl-success-text\b/);
  });

  it('the panel kit fields use the Suite input styling', () => {
    const scene = COURSE_KIT_SCENES.find((s) => s.name === 'panelKit');
    render(scoped(scene.element));
    const select = screen.getByDisplayValue('Sandstone');
    expect(select.className).toMatch(/\bborder-pl-border-strong\b/);
    expect(select.className).toMatch(/\bfocus-visible:ring-pl-focus\b/);
    const input = screen.getByDisplayValue('0.2');
    expect(input.className).not.toMatch(/gray/);
  });
});
