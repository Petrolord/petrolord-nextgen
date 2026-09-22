// A PANEL, A LESSON OR THE LEARNING PAGE MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5a re-cased this course (FOLLOW-ON-PROGRAMME.md section 3, pick A). The
// Ekene wells are the teaching case: the panels open on them and the lessons
// work them. Each capstone tier grades the ADIM well set instead (seven wells,
// a prospect, a cell size and an appraisal well), which the brief states and
// the learner types into the panel's "Type a well set" mode.
// mappingTeaching.js carries no capstone case; it lives only in
// tools/course-waves/w5/mapping/fields.mjs, which nothing under src/ imports
// except the tests.
//
// This file is the half of the guarantee that can fail: the shared W5 leak
// gate (../w5LeakGuard.js, ten grader tolerances, absolute) over every lesson,
// the panel sources, the learning page, the explorers' rendered opening text
// and the teaching functions' opening scalars. Counts of 100 or more are swept
// too; the small counts (grid width and height, the cross-validatable count)
// are checked through the inputs that produce them: the ADIM well table and
// the capstone cell size appear nowhere a learner reads first.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from '@/lib/mappingTeaching';
import {
  makeLeakGuard, leaves, lessonFiles, panelSources, LEAK_GUARD_MARGIN,
} from '../w5LeakGuard';
import MapExplorer from './MapExplorer';
import IsochoreExplorer from './IsochoreExplorer';
import ValidationExplorer from './ValidationExplorer';
import {
  capstoneFields, WELL_TABLE, PROSPECT, APPRAISAL, CELL_M, LOO_WELL,
} from '../../../../../tools/course-waves/w5/mapping/fields.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..', '..', '..');
const FIELDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/w5/mapping/fields.json'), 'utf8'));
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/graded-field-audit/w5/mapping.json'), 'utf8'));
const LESSONS = path.join(ROOT, 'src/content/courses/mapping');
const PAGE = path.join(ROOT, 'src/pages/apps/MappingLearningPage.jsx');
const CASE_NAME = ['AD', 'IM'].join('');

const G = makeLeakGuard(FIELDS);

function openingStates() {
  const out = [];
  [50, L.TEACHING_CELL_M, 200].forEach((cell) => leaves(L.computeMap(cell).summary, {}, out, `computeMap(${cell})`));
  leaves(L.computeIntermediate(), {}, out, 'computeIntermediate()');
  L.computeIntermediate().wellThk.forEach((w, i) => leaves(w, {}, out, `computeIntermediate().wellThk[${i}]`));
  leaves(L.computeAdvanced(), {}, out, 'computeAdvanced()');
  L.computeAdvanced().loo.forEach((r, i) => leaves(r, {}, out, `computeAdvanced().loo[${i}]`));
  [50, L.TEACHING_CELL_M, 200].forEach((cell) => L.SURFACE_KEYS.forEach((k) => {
    leaves(L.computeIsochoreMap(cell, k).summary, {}, out, `computeIsochoreMap(${cell}, ${k})`);
  }));
  L.CONTROL_SETS.forEach((c) => leaves(L.computeValidationMap(c.key).summary, {}, out, `computeValidationMap(${c.key})`));
  return out;
}

describe('the graded keys are the engine\'s', () => {
  it('fields.json is exactly what the vendored engine returns for the ADIM case', () => {
    expect(capstoneFields()).toEqual(FIELDS);
  });

  it('carries eighteen fields over three tiers, W1\'s two new keys kept on the new case', () => {
    expect(FIELDS).toHaveLength(18);
    const keys = FIELDS.map((f) => f.key);
    expect(keys).toContain('adim_iso_nodes_above_well_mean');
    expect(keys).toContain('adim_depth_at_prospect_with_adim8_m');
    FIELDS.forEach((f) => expect(f.tol === 0 ? Number.isInteger(f.expected) : f.tol > 0, f.key).toBe(true));
  });

  it('the spec re-keys each tier onto exactly these fields, and the migration is generated from it', () => {
    ['beginner', 'intermediate', 'advanced'].forEach((tier) => {
      expect(SPEC.tiers[tier].pick).toBe('A');
      expect(SPEC.tiers[tier].rekey).toHaveLength(FIELDS.filter((f) => f.tier === tier).length);
      Object.keys(SPEC.tiers[tier].annot).forEach((k) => expect(FIELDS.find((f) => f.key === k && f.tier === tier), k).toBeTruthy());
    });
    const mig = fs.readFileSync(path.join(ROOT, 'migrations', SPEC.migration), 'utf8');
    FIELDS.forEach((f) => expect(mig, f.key).toContain(`"key": "${f.key}"`));
  });
});

describe('each brief states every input of its case', () => {
  const has = (tier, ...tokens) => tokens.forEach((t) => expect(SPEC.tiers[tier].prompt, `${tier}: ${t}`).toContain(String(t)));
  const wells = WELL_TABLE.split('\n');

  it('every tier lists the seven ADIM wells exactly as the panel takes them', () => {
    ['beginner', 'intermediate', 'advanced'].forEach((tier) => wells.forEach((w) => has(tier, w)));
  });

  it('beginner and intermediate: the prospect and the cell', () => {
    ['beginner', 'intermediate'].forEach((tier) => has(tier, `(${PROSPECT.x}, ${PROSPECT.y})`, `${CELL_M[tier]} m cell`));
  });

  it('advanced: the prospect, the named well, the appraisal well and its pick', () => {
    has('advanced', `(${PROSPECT.x}, ${PROSPECT.y})`, LOO_WELL, `${APPRAISAL.name} at (${APPRAISAL.x}, ${APPRAISAL.y})`,
      `actual pick ${APPRAISAL.actual} m`, `${CELL_M.advanced} m cell`);
  });

  it('no re-cased brief keeps the W1 open-book label', () => {
    Object.values(SPEC.tiers).forEach((t) => expect(t.prompt).not.toMatch(/open book/i));
  });
});

describe('THE LEAK GATE: nothing the learner sees before working lands on a graded answer', () => {
  it('the band is ten grader tolerances, and it is live: a planted number inside is caught, outside is not', () => {
    expect(LEAK_GUARD_MARGIN).toBe(10);
    FIELDS.filter((f) => f.tol > 0).forEach((f) => {
      const drift = 0.9 * LEAK_GUARD_MARGIN * f.tol;
      [f.expected, f.expected + drift, f.expected - drift].forEach((x) => expect(G.hit(x), `${f.key} at ${x}`).not.toBeNull());
      const far = G.hit(f.expected + 1000 * LEAK_GUARD_MARGIN * f.tol);
      if (far) expect(far.key).not.toBe(f.key);
    });
    FIELDS.filter((f) => f.tol === 0 && f.expected >= 100).forEach((f) => expect(G.hit(f.expected)).not.toBeNull());
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w5a-mp-'));
    const planted = path.join(dir, 'planted.md');
    fs.writeFileSync(planted, `The figure is ${FIELDS.find((f) => f.tol > 0).expected.toFixed(4)} here.\n`);
    expect(G.scanFiles([planted], ROOT)).toHaveLength(1);
    fs.rmSync(dir, { recursive: true });
  });

  it('NO NUMBER the teaching functions give at the panels\' opening states lands in a band', () => {
    const vals = openingStates();
    expect(vals.length).toBeGreaterThan(200);
    expect(G.scanValues(vals, { integers: true })).toEqual([]);
  });

  it('NO NUMBER the three explorers print as they open lands in a band (the D2 default-state rule)', () => {
    let count = 0;
    const hits = [];
    [['MapExplorer', MapExplorer], ['IsochoreExplorer', IsochoreExplorer], ['ValidationExplorer', ValidationExplorer]]
      .forEach(([name, C]) => {
        const r = G.scanRendered(name, renderToStaticMarkup(React.createElement(C)));
        count += r.count;
        hits.push(...r.hits);
      });
    expect(count).toBeGreaterThan(60);
    expect(hits).toEqual([]);
  });

  it('NO NUMBER in any lesson of the course lands in a band', () => {
    const files = lessonFiles(LESSONS);
    expect(files.length).toBeGreaterThanOrEqual(70);
    expect(G.scanFiles(files, ROOT)).toEqual([]);
  });

  it('NO NUMBER in the panel sources or the learning page lands in a band (counts excepted: layout integers)', () => {
    const files = [...panelSources(HERE), PAGE];
    expect(files.length).toBeGreaterThanOrEqual(4);
    expect(G.scanFiles(files, ROOT, { integers: false })).toEqual([]);
  });

  it('the inputs that produce the counts appear nowhere a learner reads first', () => {
    const cell = new RegExp(`\\b${CELL_M.beginner}\\s*m\\s*cell`);
    const picks = WELL_TABLE.split('\n').map((l) => l.split(',').slice(1).map((c) => c.trim()).join(', '));
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE].forEach((file) => {
      const text = fs.readFileSync(file, 'utf8');
      expect(text, path.relative(ROOT, file)).not.toMatch(cell);
      picks.forEach((p) => expect(text.includes(p), `${path.relative(ROOT, file)} carries ${p}`).toBe(false));
    });
    expect(L.TEACHING_CELL_M).not.toBe(CELL_M.beginner);
  });
});

describe('the teaching surface carries no capstone', () => {
  it('mappingTeaching.js exports nothing named for the capstone', () => {
    const named = Object.keys(L).filter((n) => /^(CAP$|CAP_|CAPSTONE|capstone)/i.test(n));
    expect(named).toEqual([]);
  });

  it('the capstone case is named nowhere a learner reads before working', () => {
    const re = new RegExp(CASE_NAME, 'i');
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE, path.join(ROOT, 'src/lib/mappingTeaching.js')]
      .forEach((file) => expect(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file)).not.toMatch(re));
  });
});
