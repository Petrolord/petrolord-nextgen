// THE WELL DESIGN LEAKAGE GATE (follow-on programme W5, section 3 pick B).
//
// The Associate and Expert capstones keep their keys. What moved is where the
// answers used to be printed before the learner worked: the survey listing
// opened on the feet golden well (TVD and vertical section graded), the
// clearance ladder opened on offset 10 (its minimum separation factor
// graded), and the Learning Mode page intro printed that same factor to three
// decimals, inside the grader's band. The listing now opens on the 131-station
// teaching well, the ladder on offset 05, and the intro prints the factor to
// two decimals. The W1 open-book note comes off the three capstone lessons and
// the three briefs (migration 20261028d_w5_welldesign.sql).
//
// The Professional tier is stripped too: its panel (UncertaintyExplorer) used
// to open on station 267, the capstone station, and printed every Professional
// answer. W4a (#204) moved its default to station 180 in the tangent, a
// station no capstone grades from, so this gate sweeps all three tiers.
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
import { capstoneValues, pageIntroFigures } from './welldesignLab.js';
import SurveyExplorer from './SurveyExplorer.jsx';
import UncertaintyExplorer from './UncertaintyExplorer.jsx';
import ClearanceExplorer from './ClearanceExplorer.jsx';
import { gradedTargets, leakHits, htmlText, publishedFields, OPEN_BOOK } from '../leakStripGate.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const COURSE = 'welldesign';
const STRIPPED = ['beginner', 'intermediate', 'advanced'];
const HELD = [];
const CAPSTONE_LESSON = {
  beginner: 'beginner/m06-the-associate-reading/l02-working-the-capstone.md',
  intermediate: 'intermediate/m06-the-professional-reading/l02-working-the-capstone.md',
  advanced: 'advanced/m06-the-expert-reading/l02-working-the-capstone.md',
};

const AUDIT = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/fields.json'), 'utf8'));
const TIERS = ['beginner', 'intermediate', 'advanced'];
const fieldsOf = (tier) => publishedFields(AUDIT, COURSE, tier);
const engine = capstoneValues();
const targetsFor = (tiers) => tiers.flatMap((tier) => gradedTargets({ tier, values: engine[tier], fields: fieldsOf(tier) }));

const lessonRoot = path.join(REPO, 'src/content/courses', COURSE);
const lessons = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p);
  else if (e.name.endsWith('.md')) lessons.push({ file: path.relative(lessonRoot, p), text: fs.readFileSync(p, 'utf8') });
});
walk(lessonRoot);

const PANELS = [
  ['wd-survey-explorer', SurveyExplorer],
  ['wd-uncertainty-explorer', UncertaintyExplorer],
  ['wd-clearance-explorer', ClearanceExplorer],
];
const render = (Panel, props = {}) => htmlText(renderToStaticMarkup(React.createElement(Panel, props)));

describe('the targets are the graded answers', () => {
  it('the engine reproduces every published expected value of the three tiers', () => {
    TIERS.forEach((tier) => {
      expect(fieldsOf(tier)).toHaveLength(6);
      fieldsOf(tier).forEach((f) => {
        expect(Math.abs(engine[tier][f.key] - f.expected), `${tier}/${f.key}`).toBeLessThanOrEqual(f.tol / 10);
      });
    });
  });

  it('there are lessons and panels to sweep, so a rename cannot empty this gate', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(70);
    expect(targetsFor(STRIPPED).length).toBeGreaterThanOrEqual(12);
  });
});

describe(`the stripped tiers (${STRIPPED.join(', ')}) print no graded answer before the learner works`, () => {
  const targets = targetsFor(STRIPPED);

  it('no lesson of the course prints one', () => {
    expect(lessons.flatMap((l) => leakHits(l.text, targets, l.file))).toEqual([]);
  });

  PANELS.forEach(([id, Panel]) => {
    it(`${id} prints none on first render, the way the host renders it`, () => {
      expect(leakHits(render(Panel), targets, id)).toEqual([]);
    }, 60000);
  });

  it('the Learning Mode page intro prints none', () => {
    expect(leakHits(Object.values(pageIntroFigures()).join(' '), targets, 'page intro')).toEqual([]);
  });

  STRIPPED.forEach((tier) => {
    it(`${tier}: the capstone lesson no longer carries the open-book note`, () => {
      const text = fs.readFileSync(path.join(lessonRoot, CAPSTONE_LESSON[tier]), 'utf8');
      expect(OPEN_BOOK.test(text)).toBe(false);
    });
  });

  it('the migration removes the brief label on exactly these tiers', () => {
    const sql = fs.readFileSync(path.join(REPO, 'migrations/20261028d_w5_welldesign.sql'), 'utf8');
    STRIPPED.forEach((tier) => expect(sql).toContain(`-- ${COURSE} / ${tier}`));
    HELD.forEach((tier) => expect(sql).not.toContain(`-- ${COURSE} / ${tier}`));
  });
});

describe('NEGATIVE CONTROLS: the gate sees a leak when there is one', () => {
  const targets = targetsFor(STRIPPED);

  it('the survey listing opened on the feet well, as it shipped, is caught', () => {
    const hits = leakHits(render(SurveyExplorer, { initialWell: 'feet' }), targets, 'feet listing');
    expect(hits.some((h) => h.includes('beginner/golden_ft_tvd'))).toBe(true);
    expect(hits.some((h) => h.includes('beginner/golden_ft_vertical_section'))).toBe(true);
  }, 60000);

  it('the clearance ladder opened on offset 10, as it shipped, is caught', () => {
    const hits = leakHits(render(ClearanceExplorer, { initialWell: '10 - well' }), targets, 'offset 10');
    expect(hits.some((h) => h.includes('advanced/well10_min_sf'))).toBe(true);
  }, 60000);

  it('the page intro at three decimals, as it shipped, is caught', () => {
    const shipped = engine.advanced.well10_min_sf.toFixed(3);
    expect(leakHits(shipped, targets, 'intro').some((h) => h.includes('advanced/well10_min_sf'))).toBe(true);
  });

  it('a Professional answer printed as station 267 printed it is caught', () => {
    const planted = `Lateral sigma at this station ${engine.intermediate.well1_sigma_lateral.toFixed(4)} m`;
    expect(leakHits(planted, targets, 'station 267').some((h) => h.includes('intermediate/well1_sigma_lateral'))).toBe(true);
  });

  it('a graded answer planted in a lesson, printed with a thousands comma as the panels print it, is caught', () => {
    const planted = `${lessons[0].text}\nThe TVD at TD is ${engine.beginner.golden_ft_tvd.toLocaleString('en-US', { maximumFractionDigits: 4 })} ft.`;
    expect(leakHits(planted, targets, 'planted').some((h) => h.includes('beginner/golden_ft_tvd'))).toBe(true);
  });
});
