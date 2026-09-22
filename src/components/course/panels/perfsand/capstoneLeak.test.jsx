// THE PERFORATING AND SAND CONTROL LEAKAGE GATE (follow-on programme W5,
// section 3 pick B).
//
// The Expert capstone keeps its keys. The B5 audit recorded five of its fields
// as printed before the learner works, and W1 labelled the brief open book.
// Re-measured here, none is: no lesson in any tier prints a graded Expert
// value, and every panel's first render prints none. Four of the five flags
// came from an evidence sentence that says the lessons print NO stress or
// strength numbers. The fifth, the gauge margin, is a row of the gauge table
// the Gravel view always shows (seven margins, one per commercial gravel):
// choosing the row needs the Saucier band on the capstone sand, which is the
// work. So the label is untrue, and it comes off the capstone lesson and the
// brief (migration 20261028d_w5_perfsand.sql). The Sanding view's interval
// inputs are W4a's typed-mode work and change nothing here: its default
// interval is the published one.
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
import { capstoneValues } from './perfsandLab.js';
import SandExplorer from './SandExplorer.jsx';
import ShotExplorer from './ShotExplorer.jsx';
import SkinExplorer from './SkinExplorer.jsx';
import { gradedTargets, leakHits, htmlText, publishedFields, OPEN_BOOK } from '../leakStripGate.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const COURSE = 'perfsand';
const STRIPPED = ['advanced'];
const CAPSTONE_LESSON = { advanced: 'advanced/m06-the-expert-reading/l02-working-the-capstone.md' };

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
  ['ps-sand-explorer', SandExplorer],
  ['ps-shot-explorer', ShotExplorer],
  ['ps-skin-explorer', SkinExplorer],
];
const render = (Panel) => htmlText(renderToStaticMarkup(React.createElement(Panel)));

describe('the targets are the graded answers', () => {
  it('the engine reproduces every published expected value of the stripped tier', () => {
    STRIPPED.forEach((tier) => {
      const fields = publishedFields(AUDIT, COURSE, tier);
      expect(fields).toHaveLength(6);
      fields.forEach((f) => {
        expect(Math.abs(engine[f.key] - f.expected), `${tier}/${f.key}`).toBeLessThanOrEqual(f.tol / 10);
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

  it('no lesson of the course prints one, in any tier', () => {
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
    const sql = fs.readFileSync(path.join(REPO, 'migrations/20261028d_w5_perfsand.sql'), 'utf8');
    STRIPPED.forEach((tier) => expect(sql).toContain(`-- ${COURSE} / ${tier}`));
  });
});

describe('NEGATIVE CONTROLS: the gate sees a leak when there is one', () => {
  const targets = targetsFor(STRIPPED);

  it('the gauge margin as the Gravel view prints it (um, three decimals) is caught', () => {
    const tile = `Gauge margin ${(engine.gauge_margin_m / 1e-6).toFixed(3)} um`;
    expect(leakHits(tile, targets, 'gravel tile').some((h) => h.includes('advanced/gauge_margin_m'))).toBe(true);
  });

  it('a critical pressure planted in a lesson in MPa at five decimals is caught', () => {
    const planted = `${lessons[0].text}\nThe governing row sits at ${(engine.pwf_crit_pa / 1e6).toFixed(5)} MPa.`;
    expect(leakHits(planted, targets, 'planted').some((h) => h.includes('advanced/pwf_crit_pa'))).toBe(true);
  });
});
