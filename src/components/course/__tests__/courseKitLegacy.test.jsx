// @vitest-environment jsdom
//
// Outside a design-system scope every course kit piece renders byte for byte
// what it rendered before batch 1B (docs/scope/DesignSystem-Rollout.md
// section 4). The fixture was captured from main af5c91747, before any kit
// file changed, by running this file with UPDATE_COURSE_KIT_LEGACY=1; it must
// not be regenerated while an unmigrated screen still renders the legacy
// branch. Wave 7 deletes it with the legacy branches.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { COURSE_KIT_SCENES, normaliseMarkup } from './courseKitScenes';

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

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/courseKitLegacyMarkup.json');
const UPDATE = globalThis.process?.env?.UPDATE_COURSE_KIT_LEGACY === '1';
const captured = {};

// Radix settles two attributes after the first paint, so whether they are
// there when the markup is read is a race: the inline pointer-events style,
// and the roving tabindex of a radio group and its radios (0 or -1 by which
// item holds focus). QuizRunner active compares with those two ignored;
// every other attribute, and every other scene, stays pinned.
const IGNORE_RADIX_ASYNC = new Set(['QuizRunner active']);
const ignoreRadixAsync = (html) => html
  .replace(/ style="pointer-events: [a-z]+;"/g, '')
  .replace(/(<[a-z]+\b[^>]*\brole="(?:radio|radiogroup)"[^>]*?) tabindex="-?\d+"/g, '$1');
const realToLocaleString = Date.prototype.toLocaleString;

describe('the course kit outside a scope', () => {
  beforeAll(() => {
    installDomShims();
    // The cooldown time is printed with the machine's locale and zone.
    Date.prototype.toLocaleString = function toLocaleString() { return `LOCAL(${this.toISOString()})`; };
  });
  afterAll(() => { Date.prototype.toLocaleString = realToLocaleString; });
  afterEach(() => { cleanup(); globalThis.__courseKitGate = undefined; });
  const want = UPDATE ? {} : JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));

  for (const scene of COURSE_KIT_SCENES) {
    it(`${scene.name} renders the legacy markup unchanged`, async () => {
      scene.before?.();
      render(scene.element);
      if (scene.act) await scene.act({ screen, fireEvent, waitFor });
      const html = normaliseMarkup(document.body.innerHTML);
      if (UPDATE) captured[scene.name] = html;
      else if (IGNORE_RADIX_ASYNC.has(scene.name)) expect(ignoreRadixAsync(html)).toBe(ignoreRadixAsync(want[scene.name]));
      else expect(html).toBe(want[scene.name]);
    });
  }

  it('the fixture covers every scene', () => {
    if (UPDATE) {
      fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
      fs.writeFileSync(FIXTURE, `${JSON.stringify(captured, null, 1)}\n`);
      return;
    }
    expect(Object.keys(want).sort()).toEqual(COURSE_KIT_SCENES.map((s) => s.name).sort());
  });
});
