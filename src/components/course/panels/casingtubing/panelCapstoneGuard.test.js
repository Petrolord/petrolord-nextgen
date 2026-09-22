// THE CASING AND TUBING PANEL GUARD, under the D2 policy (typedCaseGuard.js).
//
// The rating explorer's "One pipe" view is how the Associate capstone is
// worked: the learner picks the 13-3/8 inch 68 lb/ft row, grade C-90, the
// short thread connection and a 0.55 axial fraction, and reads the six
// ratings. W4 added the 0.55 fraction and prints the ratings in whole pascals
// and the D over t boundaries to 10 decimals, which is what the grader needs.
// Picking the capstone's pipe is the work, so that reach is allowed. What this
// file forbids is the answer arriving before that work: no view's DEFAULT state
// lands on a graded answer, no default preloads a capstone input, and no panel
// source names a capstone reader or prints a graded answer.
//
// The graded answers come from the lab's capstoneValues(), which calls the
// vendored engine, and the tolerances from the live capstone rows
// (docs/graded-field-audit/fields.json, the scratch dump of what the grader
// holds). A copy that disagrees with the engine fails below.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './casingTubingLab.js';
import * as G from '../typedCaseGuard.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = path.resolve(HERE, '../../../../../docs/graded-field-audit/fields.json');
const COURSE = 'casingtubing';

const live = JSON.parse(fs.readFileSync(FIELDS, 'utf8')).filter((f) => f.course === COURSE);
const engine = L.capstoneValues();
const graded = live.map((f) => ({ tier: f.tier, key: f.key, value: engine[f.key], tol: f.tol }));
const targets = G.leakTargets(graded);

// What each view shows at its default settings, at the precision it prints.
// The defaults are the ones RatingExplorer.jsx opens on.
const ONE_DEFAULT = { odIn: 9.625, weightLbFt: 47, grade: 'P-110', connection: 'BTC', axialFraction: 0.4 };
const GRADES_DEFAULT = { odIn: 20, weightLbFt: 94, axialFraction: 0.4 };
const oneView = (d) => L.rating(d.odIn, d.weightLbFt, d.grade, { connection: d.connection, axialFraction: d.axialFraction });
// The grade sweep charts four series per grade (RatingExplorer.jsx Grades), and
// nothing else of each rating reaches the screen.
const gradesView = (d) => L.gradeSweep(d.odIn, d.weightLbFt, { axialFraction: d.axialFraction }).map((r) => ({
  ksi: r.yieldPa / 6.894757e6, burstMPa: r.burstPa / 1e6, collapseMPa: r.collapsePa / 1e6, deratedMPa: r.collapseDeratedPa / 1e6,
}));
// The census table prints each grade's three boundaries to 4 decimals.
const censusView = () => L.CASING_GRADES.map((g) => {
  const b = L.boundariesOf(g.name);
  return { dtYp: Number(b.dtYp.toFixed(4)), dtPt: Number(b.dtPt.toFixed(4)), dtTe: Number(b.dtTe.toFixed(4)) };
});
const MODES = [
  { name: 'one', defaults: ONE_DEFAULT, run: oneView },
  { name: 'grades', defaults: GRADES_DEFAULT, run: gradesView },
  { name: 'census', defaults: {}, run: censusView },
];

const PRELOAD_KEYS = ['grade', 'connection', 'axialFraction', 'weightLbFt'];

const panelSources = fs.readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

describe('the guard is built from the live graded fields', () => {
  it('eighteen live fields, every one computed by the engine within its own tolerance', () => {
    expect(live).toHaveLength(18);
    live.forEach((f) => {
      expect(typeof engine[f.key], f.key).toBe('number');
      expect(Math.abs(engine[f.key] - f.expected), f.key).toBeLessThanOrEqual(f.tol);
    });
  });
});

describe('RULE 1: no view opens on a graded answer', () => {
  it('the one pipe, grade sweep and census views are silent at their defaults', () => {
    expect(G.defaultStateHits({ targets, modes: MODES })).toEqual([]);
  });

  it('NEGATIVE CONTROL: the one pipe view opened on the capstone pipe is caught', () => {
    const hits = G.defaultStateHits({ targets, modes: [{ name: 'one', defaults: L.CAPSTONE_RATING, run: oneView }] });
    ['burst_rating_Pa', 'collapse_Pa', 'collapse_at_55pct_tension_Pa', 'dt_plastic_transition_boundary']
      .forEach((k) => expect(hits.some((h) => h.includes(`/${k} `)), k).toBe(true));
  });

  it('NEGATIVE CONTROL: the census at 10 decimals would print the C-90 boundary, so it stays at 4', () => {
    const tenDp = () => L.CASING_GRADES.map((g) => Number(L.boundariesOf(g.name).dtPt.toFixed(10)));
    expect(G.defaultStateHits({ targets, modes: [{ name: 'census10', defaults: {}, run: tenDp }] }))
      .toEqual(expect.arrayContaining([expect.stringContaining('dt_plastic_transition_boundary')]));
  });
});

describe('RULE 2: no default preloads the capstone pipe', () => {
  it('the capstone inputs really are distinct from every view default', () => {
    expect(G.distinguishingKeyProblems({
      capstone: L.CAPSTONE_RATING,
      teachingCases: [{ name: 'one', inputs: ONE_DEFAULT }, { name: 'grades', inputs: GRADES_DEFAULT }],
      keys: PRELOAD_KEYS,
    })).toEqual([]);
  });

  it('and no default carries one of them', () => {
    expect(G.preloadHits({
      capstone: L.CAPSTONE_RATING,
      bundles: [{ name: 'one', inputs: ONE_DEFAULT }, { name: 'grades', inputs: GRADES_DEFAULT }],
      keys: PRELOAD_KEYS,
    })).toEqual([]);
  });

  it('the view source opens on the defaults this guard sweeps', () => {
    const src = panelSources.find((p) => p.file === 'RatingExplorer.jsx').text;
    expect(src).toMatch(/useState\('9\.625\|47'\)/);
    expect(src).toMatch(/useState\('P-110'\)/);
    expect(src).toMatch(/useState\('BTC'\)/);
    expect(src).toMatch(/useState\('20\|94'\)/);
    expect((src.match(/useState\('0\.4'\)/g) || []).length).toBe(3);
  });
});

describe('THE ROUTE: picking the stated pipe reads every beginner answer at the printed precision', () => {
  const r = oneView(L.CAPSTONE_RATING);
  const byKey = Object.fromEntries(live.map((f) => [f.key, f]));
  // [key, the number the view shows, the decimals it prints]
  const shown = [
    ['burst_rating_Pa', r.burstPa, 0],
    ['collapse_Pa', r.collapsePa, 0],
    ['collapse_at_55pct_tension_Pa', r.collapseDeratedPa, 0],
    ['dt_plastic_transition_boundary', r.boundaries.dtPt, 10],
  ];
  shown.forEach(([key, v, dp]) => {
    it(`${key} at ${dp} dp`, () => {
      const f = byKey[key];
      expect(G.typedRouteMiss({ run: () => v, typed: null, read: (x) => x, dp, expected: f.expected, tol: f.tol, key })).toBeNull();
    });
  });

  it('0.55 is one of the fractions the view offers', () => {
    const src = panelSources.find((p) => p.file === 'RatingExplorer.jsx').text;
    expect(src).toMatch(/'0\.55'/);
  });
});

describe('RULE 3: no panel names a capstone reader or prints a graded answer', () => {
  it('there are panels to check', () => {
    expect(panelSources.map((s) => s.file).sort()).toEqual(['LoadCaseExplorer.jsx', 'RatingExplorer.jsx', 'TubingExplorer.jsx']);
  });
  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone reader`, () => {
      expect(G.capstoneNamesIn(text)).toEqual([]);
    });
    it(`${file} prints no graded answer as a literal`, () => {
      expect(G.gradedLiteralsIn(text, graded)).toEqual([]);
    });
    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });
  });
});
