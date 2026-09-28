// @vitest-environment jsdom
//
// Batch 3C: the reservoir course panels OUTSIDE a design-system scope, where
// the unmigrated course reader and handbook still render them. Two things
// hold:
//
// 1. Every class the panel renders outside its charts is the pre-migration
//    class, byte for byte. The fixture was captured from main 1fbbedf34
//    before any 3C file changed (UPDATE_RC3C_LEGACY=1 writes it; do not
//    regenerate it while the reader is unmigrated).
// 2. Every chart is on the white chart kit everywhere (family rule 4): the
//    kit renders the same inside and outside a scope, so the reader shows the
//    same white charts as the learning pages. No lime or dark plate is left
//    inside a chart.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { RC3C_SCENES, chromeClasses } from './rc3cScenes';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(HERE, 'fixtures', 'rc3cLegacyClasses.json');
const UPDATE = process.env.UPDATE_RC3C_LEGACY === '1';
const captured = {};
const fixture = UPDATE ? null : JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
// The old dark plate and its colours. #0F172A is matched in capitals only:
// the chart theme's own label colour is the lower-case #0f172a.
const OLD_PLATE = /#BFFF00|#A8E600|#1E293B|#38bdf8|#f472b6|\[#0F172A\]/i;
const OLD_FILL = /#0F172A/;

describe('reservoir panels outside a scope (the unmigrated reader)', () => {
  beforeAll(installDomShims);
  afterEach(cleanup);

  for (const scene of RC3C_SCENES) {
    it(`${scene.name}: legacy classes unchanged outside the charts`, async () => {
      const { container } = render(scene.element);
      if (scene.act) await scene.act({ screen, fireEvent, waitFor });
      const classes = chromeClasses(container);
      if (UPDATE) {
        captured[scene.name] = classes;
        fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
        fs.writeFileSync(FIXTURE, `${JSON.stringify(captured, null, 1)}\n`);
        return;
      }
      expect(classes.length).toBeGreaterThan(0);
      expect(classes).toEqual(fixture[scene.name]);
      expect(container.querySelector('[data-pl-theme]')).toBeNull();
    });
  }

  it('the fixture covers every scene', () => {
    if (UPDATE) return;
    expect(Object.keys(fixture).sort()).toEqual(RC3C_SCENES.map((s) => s.name).sort());
  });

  for (const scene of RC3C_SCENES) {
    it(`${scene.name}: charts on the white kit, no lime or dark plate`, async () => {
      if (UPDATE) return;
      const { container } = render(scene.element);
      if (scene.act) await scene.act({ screen, fireEvent, waitFor });
      for (const svg of container.querySelectorAll('svg:not(.lucide)')) {
        expect(svg.closest('[data-canvas="chart"]')).not.toBeNull();
      }
      for (const rc of container.querySelectorAll('.recharts-responsive-container')) {
        expect(rc.closest('[data-canvas="chart"]')).not.toBeNull();
      }
      for (const canvas of container.querySelectorAll('[data-canvas="chart"]')) {
        expect(canvas.innerHTML).not.toMatch(OLD_PLATE);
        expect(canvas.innerHTML).not.toMatch(OLD_FILL);
      }
    });
  }
});
