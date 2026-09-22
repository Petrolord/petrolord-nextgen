// THE SAND CONTROL PANEL GUARD, under the D2 policy (typedCaseGuard.js).
//
// The Expert capstone screens an interval of 2200 to 2320 m MD, as an open
// hole, at a 25 m step and a 1.15 strength boost. The Sanding onset view took
// the cavity, the boost and the step, but not the interval, so fields 3 to 6
// had no route. W4a adds Top and Bottom boxes (blank is the published
// interval) and prints the zero-margin boost to 8 dp. Typing the stated
// interval is the work, so that reach is allowed. What this file forbids is
// the answer arriving without it: every view of the sand control explorer, at
// every option its selects offer with its boxes blank, lands on no graded
// answer; no default carries a capstone input; and no panel source names a
// capstone reader or prints a graded answer.
//
// Scope: the sand control explorer (SandExplorer.jsx), the file W4a changed.
// The lesson half of this tier's section 3 leak is W5's (strip B).
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './perfsandLab.js';
import * as G from '../typedCaseGuard.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = path.resolve(HERE, '../../../../../docs/graded-field-audit/fields.json');

const live = JSON.parse(fs.readFileSync(FIELDS, 'utf8')).filter((f) => f.course === 'perfsand');
const engine = L.capstoneValues();
const graded = live.map((f) => ({ tier: f.tier, key: f.key, value: engine[f.key], tol: f.tol }));
const targets = G.leakTargets(graded);
const byKey = Object.fromEntries(live.map((f) => [f.key, f]));
const SRC = fs.readFileSync(path.join(HERE, 'SandExplorer.jsx'), 'utf8');

// The Sanding view's inputs as it opens (every box blank).
const SANDING_DEFAULT = {
  topMdM: L.PARAMS.interval.topMdM,
  bottomMdM: L.PARAMS.interval.bottomMdM,
  stepMdM: L.PARAMS.stepMdM,
  boostFactor: L.PARAMS.boostFactor,
  geometry: 'perf-tunnel',
};
const sanding = (d) => {
  const { topMdM, bottomMdM, geometry, boostFactor, stepMdM, curves } = d;
  const c = curves ? { curves } : {};
  return {
    r: L.cdpFor({ topMdM, bottomMdM, geometry, boostFactor, stepMdM, ...c }),
    steps: L.stepIndependence(undefined, { topMdM, bottomMdM, geometry, boostFactor, ...c }),
    bs: L.boostSweep(undefined, { topMdM, bottomMdM, geometry, stepMdM, ...c }),
    zero: L.boostAtZeroMargin({ topMdM, bottomMdM, geometry, stepMdM, ...c }),
  };
};
const MODES = [
  { name: 'ladder', defaults: {}, run: () => ({ rows: L.rungTable(), stats: L.publishedStats() }) },
  ...Object.keys(L.RUNG_SANDS).map((n) => ({
    name: `gravel.${n}`,
    defaults: n,
    run: (name) => {
      const stats = L.sieveStats(L.ptsOf(L.RUNG_SANDS[name]));
      return { stats, pack: L.packFor(stats.d50M), sa: L.screenSelection({ mode: 'standalone', stats }), sw: L.saucierSweep(), gt: L.gaugeTable() };
    },
  })),
  ...['perf-tunnel', 'openhole'].flatMap((geometry) => ['published', 'weak'].map((profile) => ({
    name: `sanding.${geometry}.${profile}`,
    defaults: { ...SANDING_DEFAULT, geometry, ...(profile === 'weak' ? { curves: L.weakenedCurves() } : {}) },
    run: sanding,
  }))),
];

describe('the guard is built from the live graded fields', () => {
  it('eighteen live fields, each computed by the engine within its own tolerance', () => {
    expect(live).toHaveLength(18);
    live.forEach((f) => expect(Math.abs(engine[f.key] - f.expected), f.key).toBeLessThanOrEqual(f.tol));
  });
});

describe('RULE 1: no view of the sand control explorer opens on a graded answer', () => {
  // KNOWN, and not a W4a change: the Expert gauge margin is a leftover of the
  // DISCRETE gauge series (the prompt says so), and the Gravel view's gauge
  // table prints every entry of that series, one of which is the answer
  // (87 um). It was there before W4a and removing it removes the series the
  // field teaches. Reported to the lead as a finding for the section 3 strip
  // (W5). The exception is pinned to that one key in that one view, so any
  // other hit, or this one anywhere else, still fails.
  const KNOWN = (h) => h.startsWith('gravel.') && h.includes('/gauge_margin_m (as graded)');
  it('every view, at every option its selects offer, is silent with its boxes blank', () => {
    const hits = G.defaultStateHits({ targets, modes: MODES });
    expect(hits.filter((h) => !KNOWN(h))).toEqual([]);
  }, 120000);

  it('the one known exception is still exactly the gauge series (so it cannot quietly grow)', () => {
    const hits = G.defaultStateHits({ targets, modes: MODES.filter((m) => m.name.startsWith('gravel.')) });
    expect(hits.length).toBeGreaterThan(0);
    hits.forEach((h) => expect(KNOWN(h), h).toBe(true));
  }, 120000);

  it('NEGATIVE CONTROL: the Sanding view opened on the stated interval prints fields 3 to 6', () => {
    const hits = G.defaultStateHits({ targets, modes: [{ name: 'sanding', defaults: { ...L.CAPSTONE }, run: sanding }] });
    ['pwf_crit_pa', 'cdp_governing_pa', 'cdp_bottom_pa', 'boost_at_zero_margin']
      .forEach((k) => expect(hits.some((h) => h.includes(`/${k} `)), k).toBe(true));
  }, 120000);
});

describe('RULE 2: no default carries a capstone input', () => {
  const KEYS = ['topMdM', 'bottomMdM', 'stepMdM', 'boostFactor'];
  it('the interval, step and boost distinguish the capstone from the published case', () => {
    expect(G.distinguishingKeyProblems({ capstone: L.CAPSTONE, teachingCases: [{ name: 'published', inputs: SANDING_DEFAULT }], keys: KEYS })).toEqual([]);
  });
  it('the Sanding view opens with every box blank, which is the published case', () => {
    expect(G.preloadHits({ capstone: L.CAPSTONE, bundles: [{ name: 'sanding default', inputs: SANDING_DEFAULT }], keys: KEYS })).toEqual([]);
    expect(SRC).toMatch(/const \[top, setTop\] = useState\(''\);/);
    expect(SRC).toMatch(/const \[bottom, setBottom\] = useState\(''\);/);
    expect(SRC).toMatch(/const \[boost, setBoost\] = useState\(''\);/);
    expect(SRC).toMatch(/const \[step, setStep\] = useState\(''\);/);
    expect(SRC).toMatch(/const \[geometry, setGeometry\] = useState\('perf-tunnel'\);/);
  });
  it('NEGATIVE CONTROL: a box that opened on 2200 is a preload', () => {
    expect(G.preloadHits({ capstone: L.CAPSTONE, bundles: [{ name: 'bad', inputs: { ...SANDING_DEFAULT, topMdM: 2200 } }], keys: KEYS }))
      .toEqual(['bad preloads the capstone\'s topMdM = 2200']);
  });
});

describe('THE ROUTE: typing the stated interval reads fields 3 to 6 at the printed precision', () => {
  const typed = { topMdM: 2200, bottomMdM: 2320, stepMdM: 25, boostFactor: 1.15, geometry: 'openhole' };
  const s = sanding(typed);
  const shown = [
    // [key, the number the view shows, the decimals it prints, pascals per unit shown]
    ['pwf_crit_pa', s.r.governing.pwfCritPa / 1e6, 5, 1e6],
    ['cdp_governing_pa', s.r.governing.cdpPa / 1e6, 5, 1e6],
    ['cdp_bottom_pa', s.r.rows[s.r.rows.length - 1].cdpPa / 1e6, 5, 1e6],
    ['boost_at_zero_margin', s.zero, 8, 1],
  ];
  shown.forEach(([key, v, dp, scale]) => {
    it(`${key} at ${dp} dp`, () => {
      const f = byKey[key];
      expect(G.typedRouteMiss({ run: () => v, typed: null, read: (x) => x, dp, expected: f.expected / scale, tol: f.tol / scale, key })).toBeNull();
    });
  });
  it('the typed interval is passed to all four sanding calls', () => {
    expect((SRC.match(/\{ topMdM, bottomMdM, geometry/g) || []).length).toBe(4);
  });
});

describe('RULE 3: the sand control explorer names no capstone reader and prints no graded answer', () => {
  it('names nothing', () => {
    expect(G.capstoneNamesIn(SRC)).toEqual([]);
  });
  it('prints no graded answer as a literal', () => {
    expect(G.gradedLiteralsIn(SRC, graded)).toEqual([]);
  });
  it('carries no em dash and no en dash', () => {
    expect(SRC).not.toMatch(/[–—]/);
  });
});
