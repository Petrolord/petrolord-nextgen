// @vitest-environment jsdom
//
// Outside a design-system scope every adapted ui piece renders byte for
// byte what it rendered before wave 0 (docs/scope/DesignSystem-Rollout.md
// section 4). The fixture was captured from main cb5251926, before any ui
// file changed, by running this file with UPDATE_LEGACY_UI=1; it must not be
// regenerated while an unmigrated screen still uses the legacy branch.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { UI_SCENES, normaliseMarkup } from './uiScenes';
import { installDomShims } from '@/design/testing/domShims';

const FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/legacyUiMarkup.json');
const UPDATE = globalThis.process?.env?.UPDATE_LEGACY_UI === '1';
const captured = {};

describe('the ui kit outside a scope', () => {
  beforeAll(installDomShims);
  afterEach(cleanup);
  const want = UPDATE ? {} : JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));

  for (const [name, Scene] of UI_SCENES) {
    it(`${name} renders the legacy markup unchanged`, () => {
      render(<Scene />);
      const html = normaliseMarkup(document.body.innerHTML);
      if (UPDATE) captured[name] = html;
      else expect(html).toBe(want[name]);
    });
  }

  it('the fixture covers every scene', () => {
    if (UPDATE) {
      fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
      fs.writeFileSync(FIXTURE, `${JSON.stringify(captured, null, 1)}\n`);
      return;
    }
    expect(Object.keys(want).sort()).toEqual(UI_SCENES.map(([n]) => n).sort());
  });
});
