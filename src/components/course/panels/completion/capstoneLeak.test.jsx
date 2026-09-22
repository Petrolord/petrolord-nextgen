// THE COMPLETION LEAKAGE GATE (follow-on programme W5, section 3 pick B).
//
// The Associate capstone keeps its keys. Two of its answers, the API drifts of
// the 7 in 32 lb/ft liner and the 13-3/8 in 68 lb/ft surface casing, were
// printed to seven decimals by the string explorer's drift table on first
// render, because it opened on every catalog row. Placing each casing in its
// deduction class is the skill the capstone tests, so the table now opens on
// the tubing class and the casing rows are one select away. The W1 open-book
// note comes off the capstone lesson and the brief (migration
// 20261028d_w5_completion.sql).
//
// Every graded answer comes from capstoneValues(), which runs the vendored
// engine; the tolerances are the live published ones (the audit's
// fields.json), and the engine is checked against those expected values first.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { capstoneValues } from './completionLab.js';
import StringExplorer from './StringExplorer.jsx';
import ClearanceExplorer from './ClearanceExplorer.jsx';
import SpaceoutExplorer from './SpaceoutExplorer.jsx';
import { gradedTargets, leakHits, htmlText, publishedFields, OPEN_BOOK } from '../leakStripGate.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const COURSE = 'completion';
const STRIPPED = ['beginner'];
const CAPSTONE_LESSON = { beginner: 'beginner/m06-the-associate-reading/l02-working-the-capstone.md' };

const AUDIT = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/fields.json'), 'utf8'));
const engine = capstoneValues();
const targetsFor = (tiers) => tiers.flatMap((tier) => gradedTargets({
  tier, values: engine, fields: publishedFields(AUDIT, COURSE, tier),
}));

const lessonRoot = path.join(REPO, 'src/content/courses', COURSE);
const lessons = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p);
  else if (e.name.endsWith('.md')) lessons.push({ file: path.relative(lessonRoot, p), text: fs.readFileSync(p, 'utf8') });
});
walk(lessonRoot);

const PANELS = [
  ['cd-string-explorer', StringExplorer],
  ['cd-clearance-explorer', ClearanceExplorer],
  ['cd-spaceout-explorer', SpaceoutExplorer],
];
const render = (Panel, props = {}) => htmlText(renderToStaticMarkup(React.createElement(Panel, props)));

describe('the targets are the graded answers', () => {
  it('the engine reproduces every published expected value of the stripped tier', () => {
    STRIPPED.forEach((tier) => {
      const fields = publishedFields(AUDIT, COURSE, tier);
      expect(fields).toHaveLength(6);
      fields.forEach((f) => {
        expect(Math.abs(engine[f.key] - f.expected), `${tier}/${f.key}`).toBeLessThanOrEqual(f.tol);
      });
    });
  });

  it('there are lessons and panels to sweep, so a rename cannot empty this gate', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(70);
    expect(targetsFor(STRIPPED).length).toBeGreaterThanOrEqual(6);
  });
});

describe(`the stripped tier (${STRIPPED.join(', ')}) prints no graded answer before the learner works`, () => {
  const targets = targetsFor(STRIPPED);

  it('no lesson of the course prints one', () => {
    expect(lessons.flatMap((l) => leakHits(l.text, targets, l.file))).toEqual([]);
  });

  PANELS.forEach(([id, Panel]) => {
    it(`${id} prints none on first render, the way the host renders it`, () => {
      expect(leakHits(render(Panel), targets, id)).toEqual([]);
    }, 60000);
  });

  STRIPPED.forEach((tier) => {
    it(`${tier}: the capstone lesson no longer carries the open-book note`, () => {
      const text = fs.readFileSync(path.join(lessonRoot, CAPSTONE_LESSON[tier]), 'utf8');
      expect(OPEN_BOOK.test(text)).toBe(false);
    });
  });

  it('the migration removes the brief label on exactly this tier', () => {
    const sql = fs.readFileSync(path.join(REPO, 'migrations/20261028d_w5_completion.sql'), 'utf8');
    STRIPPED.forEach((tier) => expect(sql).toContain(`-- ${COURSE} / ${tier}`));
  });
});

describe('NEGATIVE CONTROLS: the gate sees a leak when there is one', () => {
  const targets = targetsFor(STRIPPED);

  it('the drift table opened on every catalog row, as it shipped, is caught', () => {
    const hits = leakHits(render(StringExplorer, { initialKind: 'all' }), targets, 'every row');
    expect(hits.some((h) => h.includes('beginner/drift_liner_m'))).toBe(true);
    expect(hits.some((h) => h.includes('beginner/drift_surface_casing_m'))).toBe(true);
  }, 60000);

  it('a graded answer planted in a lesson is caught', () => {
    const planted = `${lessons[0].text}\nThe string holds ${engine.string_capacity_m3.toFixed(7)} m3.`;
    expect(leakHits(planted, targets, 'planted').some((h) => h.includes('beginner/string_capacity_m3'))).toBe(true);
  });
});
