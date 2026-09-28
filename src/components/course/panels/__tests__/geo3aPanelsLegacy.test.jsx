// @vitest-environment jsdom
//
// Batch 3A: the geoscience I panels OUTSIDE a design-system scope, where the
// unmigrated course reader and handbook still render them. Two things hold:
//
// 1. Every class the panel renders outside its charts is the pre-migration
//    class, byte for byte. The fixture was captured from main 1fbbedf34
//    before any 3A file changed (UPDATE_GEO3A_LEGACY=1 writes it; do not
//    regenerate it while the reader is unmigrated).
// 2. Every chart is on the white chart kit everywhere (family rule 4): the
//    kit renders the same inside and outside a scope, so the reader shows the
//    same white charts as the learning pages. No lime or dark plate is left
//    inside a chart.
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { installDomShims } from '@/design/testing/domShims';
import { GEO3A_SCENES, chromeClasses } from './geo3aScenes';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(HERE, 'fixtures', 'geo3aLegacyClasses.json');
const UPDATE = process.env.UPDATE_GEO3A_LEGACY === '1';
const captured = {};
const fixture = UPDATE ? null : JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));

describe('geoscience I panels outside a scope (the unmigrated reader)', () => {
  beforeAll(installDomShims);
  afterEach(cleanup);

  for (const scene of GEO3A_SCENES) {
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
    expect(Object.keys(fixture).sort()).toEqual(GEO3A_SCENES.map((s) => s.name).sort());
  });

  for (const scene of GEO3A_SCENES) {
    it(`${scene.name}: charts on the white kit, no lime or dark plate`, async () => {
      if (UPDATE) return;
      const { container } = render(scene.element);
      if (scene.act) await scene.act({ screen, fireEvent, waitFor });
      for (const svg of container.querySelectorAll('svg[role="img"]')) {
        expect(svg.closest('[data-canvas="chart"]')).not.toBeNull();
        // the white plate SvgChartFrame draws, where the dark #0F172A plate was
        expect(svg.querySelector('rect').getAttribute('fill')).toBe('#ffffff');
      }
      for (const rc of container.querySelectorAll('.recharts-responsive-container')) {
        expect(rc.closest('[data-canvas="chart"]')).not.toBeNull();
      }
      for (const canvas of container.querySelectorAll('[data-canvas="chart"]')) {
        expect(canvas.innerHTML).not.toMatch(/#BFFF00|#A8E600|#1E293B|#38bdf8|#f472b6/i);
      }
    });
  }
});
