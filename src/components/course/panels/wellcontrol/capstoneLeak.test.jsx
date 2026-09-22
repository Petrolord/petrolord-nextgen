// THE WELL CONTROL LEAKAGE GATE (follow-on programme W5, section 3 pick B).
//
// The Associate capstone keeps its keys: six numbers on the SLANT well, read
// from a volumes run and the survey. The volume explorer opens on the
// horizontal well, so its first render prints none of them. What did print
// two of them, to twelve decimals, were three Expert lessons in module 1
// (the slant shoe and bit true vertical depths), and module 1 of every tier is
// open to every learner. Those lessons now round the slant depths to one
// decimal and say why. The W1 open-book note comes off the capstone lesson and
// the brief (migration 20261028d_w5_wellcontrol.sql).
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
import { capstoneValues } from './wellcontrolLab.js';
import VolumeExplorer from './VolumeExplorer.jsx';
import KillSheetExplorer from './KillSheetExplorer.jsx';
import ToleranceExplorer from './ToleranceExplorer.jsx';
import { gradedTargets, leakHits, htmlText, publishedFields, OPEN_BOOK } from '../leakStripGate.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const COURSE = 'wellcontrol';
const STRIPPED = ['beginner'];
const CAPSTONE_LESSON = { beginner: 'beginner/m06-the-associate-reading/l02-working-the-capstone.md' };

const AUDIT = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/fields.json'), 'utf8'));
const engine = capstoneValues();
const targetsFor = (tiers) => tiers.flatMap((tier) => gradedTargets({
  tier, values: engine[tier], fields: publishedFields(AUDIT, COURSE, tier),
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
  ['wc-volume-explorer', VolumeExplorer],
  ['wc-killsheet-explorer', KillSheetExplorer],
  ['wc-tolerance-explorer', ToleranceExplorer],
];
const render = (Panel, props = {}) => htmlText(renderToStaticMarkup(React.createElement(Panel, props)));

describe('the targets are the graded answers', () => {
  it('the engine reproduces every published expected value of the stripped tier', () => {
    STRIPPED.forEach((tier) => {
      const fields = publishedFields(AUDIT, COURSE, tier);
      expect(fields).toHaveLength(6);
      fields.forEach((f) => {
        expect(Math.abs(engine[tier][f.key] - f.expected), `${tier}/${f.key}`).toBeLessThanOrEqual(f.tol / 10);
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
    const sql = fs.readFileSync(path.join(REPO, 'migrations/20261028d_w5_wellcontrol.sql'), 'utf8');
    STRIPPED.forEach((tier) => expect(sql).toContain(`-- ${COURSE} / ${tier}`));
  });
});

describe('NEGATIVE CONTROLS: the gate sees a leak when there is one', () => {
  const targets = targetsFor(STRIPPED);

  it('the Expert module 1 table as it shipped (twelve decimals) is caught', () => {
    const shipped = '| slant | 1282.248590311 m | 2507.919699301 m | 1225.671108990 m |';
    const hits = leakHits(shipped, targets, 'shipped l01');
    expect(hits.some((h) => h.includes('beginner/slant_tvd_at_shoe_m'))).toBe(true);
    expect(hits.some((h) => h.includes('beginner/slant_tvd_at_bit_m'))).toBe(true);
  });

  it('the volume explorer set to the slant well is caught (the panel is still the tool; it is not its first render)', () => {
    const hits = leakHits(render(VolumeExplorer, { initialWell: 'slant' }), targets, 'slant selected');
    expect(hits.some((h) => h.includes('beginner/slant_string_volume_m3'))).toBe(true);
  }, 60000);
});
