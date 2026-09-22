// THE CEMENTING PLACEMENT PANEL GUARD, under the D2 policy (typedCaseGuard.js).
//
// The Professional capstone places the Associate capstone's 9-5/8 inch job
// with its own fluids and four new Fann sets, and asks for the rate window
// against a 1600 kg/m3 limit. The placement explorer ran only the two
// published jobs, so six fields had no route. W4a adds a "Your job" view:
// every input of a lead-and-tail placement as a box, opening on the lessons'
// own slant job, run through jobVolumes and simulatePlacement with both rate
// edges bisected. Typing the capstone's job is the work, so that reach is
// allowed. What this file forbids is the answer arriving without it: every
// view of the placement explorer, at every option its selects offer, lands on
// no graded answer at its defaults; the Your job view opens on no capstone
// input; and no panel source names a capstone reader or prints a graded answer.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './cementingLab.js';
import * as G from '../typedCaseGuard.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = path.resolve(HERE, '../../../../../docs/graded-field-audit/fields.json');

const live = JSON.parse(fs.readFileSync(FIELDS, 'utf8')).filter((f) => f.course === 'cementing');
const engine = L.capstoneValues();
const graded = live.map((f) => ({ tier: f.tier, key: f.key, value: engine[f.key], tol: f.tol }));
// SI course: the psia and psig identities restate nothing.
const SI_SHIFTS = G.DEFAULT_SHIFTS.filter((x) => !x.tag.startsWith('psi'));
const targets = G.leakTargets(graded, { shifts: SI_SHIFTS });
const byKey = Object.fromEntries(live.map((f) => [f.key, f]));
const SRC = fs.readFileSync(path.join(HERE, 'PlacementExplorer.jsx'), 'utf8');

const DEFAULT_JOB = L.jobFromTyped(L.YOUR_JOB_DEFAULT);
// The capstone's job as a learner types it, from the two capstone briefs.
const C = L.CAPSTONE;
const CAPSTONE_JOB = {
  casingOdM: C.casing.odM, casingIdM: C.casing.idM, shoeMd: C.casing.shoeMd, floatCollarMd: C.casing.floatCollarMd,
  casedToMd: C.holeSections[0].to_md_m, prevCasingIdM: C.holeSections[0].casing_id_m, prevHoleIdM: C.holeSections[0].hole_id_m,
  openHoleIdM: C.holeSections[1].hole_id_m, tocMd: C.tocMd, excessOpenHolePct: C.excessOpenHolePct,
  leadTailSplitMd: C.leadTailSplitMd, spacerVolM3: C.spacerVolM3,
  mudKgM3: C.mudKgM3, spacerKgM3: C.spacerKgM3, leadKgM3: C.leadKgM3, tailKgM3: C.tailKgM3,
  ...Object.fromEntries(['mud', 'spacer', 'lead', 'tail'].flatMap((f) => Object.entries(C.fann[f]).map(([t, v]) => [`${f}_${t}`, v]))),
  pumpRateM3s: C.pumpRateM3s, ecdLimitKgM3: C.ecdLimitKgM3,
};

const MODES = [
  ...L.WELLS.flatMap((w) => L.PROGRAMS.map((p) => ({ name: `job.${w}.${p}`, defaults: { w, p }, run: ({ w: ww, p: pp }) => L.placementFor(ww, pp) }))),
  ...L.WELLS.flatMap((w) => L.PROGRAMS.map((p) => ({
    name: `window.${w}.${p}`,
    defaults: { w, p },
    run: ({ w: ww, p: pp }) => ({ w: L.rateWindow(ww, pp, 1700), sweep: L.rateSweep(ww, pp) }),
  }))),
  ...L.WELLS.map((w) => ({
    name: `yours.${w}`,
    defaults: DEFAULT_JOB,
    run: (j) => { const r = L.yourJob(w, j); return { p: { ...r.placement, series: undefined }, w: r.window, slurry: r.volumes.slurryM3 }; },
  })),
];

describe('the guard is built from the live graded fields', () => {
  it('eighteen live fields, each computed by the engine within its own tolerance', () => {
    expect(live).toHaveLength(18);
    live.forEach((f) => expect(Math.abs(engine[f.key] - f.expected), f.key).toBeLessThanOrEqual(f.tol));
  });
  it('the Your job view on its defaults IS the lessons\' slant lead-and-tail job', () => {
    const mine = L.yourJob('slant', DEFAULT_JOB);
    const theirs = L.placementFor('slant', 'lead_tail');
    expect(mine.placement.endPumpPressurePa).toBe(theirs.endPumpPressurePa);
    expect(mine.placement.maxEcdPrevShoeKgM3).toBe(theirs.maxEcdPrevShoeKgM3);
    const w = L.rateWindow('slant', 'lead_tail', 1700);
    expect(mine.window.minRateNoFreeFallM3s).toBe(w.minRateNoFreeFallM3s);
    expect(mine.window.maxRateUnderEcdM3s).toBe(w.maxRateUnderEcdM3s);
  }, 120000);
  it('a box that is not a positive number gives no job', () => {
    expect(L.jobFromTyped({ ...L.YOUR_JOB_DEFAULT, tocMd: '' })).toBeNull();
    expect(L.jobFromTyped({ ...L.YOUR_JOB_DEFAULT, mudKgM3: '-1' })).toBeNull();
    expect(L.jobFromTyped({ ...L.YOUR_JOB_DEFAULT, excessOpenHolePct: '0' })).not.toBeNull();
  });
});

describe('RULE 1: no view of the placement explorer opens on a graded answer', () => {
  it('every view, at every well and programme its selects offer, is silent at its defaults', () => {
    expect(G.defaultStateHits({ targets, modes: MODES })).toEqual([]);
  }, 300000);
  it('NEGATIVE CONTROL: the Your job view opened on the capstone job prints the six Professional answers', () => {
    const hits = G.defaultStateHits({ targets, modes: [{ name: 'yours', defaults: CAPSTONE_JOB, run: (j) => { const r = L.yourJob('slant', j); return { p: { ...r.placement, series: undefined }, w: r.window }; } }] });
    ['end_pump_pressure_pa', 'float_diff_pa', 'max_ecd_prev_shoe_kgm3', 'min_rate_no_free_fall_m3s', 'max_rate_under_ecd_limit_m3s', 'rate_window_width_m3s']
      .forEach((k) => expect(hits.some((h) => h.includes(`/${k} `)), k).toBe(true));
  }, 120000);
});

describe('RULE 2: the Your job view opens on no capstone input', () => {
  const KEYS = ['casingOdM', 'shoeMd', 'floatCollarMd', 'casedToMd', 'prevCasingIdM', 'prevHoleIdM', 'openHoleIdM', 'tocMd',
    'excessOpenHolePct', 'leadTailSplitMd', 'spacerVolM3', 'mudKgM3', 'spacerKgM3', 'leadKgM3', 'tailKgM3',
    'mud_theta600', 'spacer_theta600', 'lead_theta600', 'tail_theta600', 'pumpRateM3s', 'ecdLimitKgM3'];
  it('those inputs distinguish the capstone job from the lessons\' job', () => {
    expect(G.distinguishingKeyProblems({ capstone: CAPSTONE_JOB, teachingCases: [{ name: 'lessons', inputs: DEFAULT_JOB }], keys: KEYS })).toEqual([]);
  });
  it('and the view opens on the lessons\' job', () => {
    expect(G.preloadHits({ capstone: CAPSTONE_JOB, bundles: [{ name: 'your job default', inputs: DEFAULT_JOB }], keys: KEYS })).toEqual([]);
    expect(SRC).toMatch(/const \[typed, setTyped\] = useState\(YOUR_JOB_DEFAULT\);/);
  });
  it('NEGATIVE CONTROL: a default carrying the capstone casing is a preload', () => {
    expect(G.preloadHits({ capstone: CAPSTONE_JOB, bundles: [{ name: 'bad', inputs: { ...DEFAULT_JOB, casingOdM: 0.244475 } }], keys: KEYS }))
      .toEqual(['bad preloads the capstone\'s casingOdM = 0.244475']);
  });
});

describe('THE ROUTE: typing the capstone job reads all six Professional fields at the printed precision', () => {
  const typed = L.jobFromTyped(Object.fromEntries(Object.entries(CAPSTONE_JOB).map(([k, v]) => [k, String(v)])));
  const r = L.yourJob('slant', typed);
  it('the typed job is the capstone placement exactly', () => {
    const p = L.capstonePlacement();
    expect(r.placement.endPumpPressurePa).toBe(p.endPumpPressurePa);
    expect(r.placement.floatDiffPa).toBe(p.floatDiffPa);
  }, 120000);
  // [key, the number shown, decimals printed, graded units per unit shown]
  const shown = [
    ['end_pump_pressure_pa', r.placement.endPumpPressurePa / 1e6, 6, 1e6],
    ['float_diff_pa', r.placement.floatDiffPa / 1e6, 6, 1e6],
    ['max_ecd_prev_shoe_kgm3', r.placement.maxEcdPrevShoeKgM3, 4, 1],
    ['min_rate_no_free_fall_m3s', r.window.minRateNoFreeFallM3s, 8, 1],
    ['max_rate_under_ecd_limit_m3s', r.window.maxRateUnderEcdM3s, 8, 1],
    ['rate_window_width_m3s', r.window.widthM3s, 8, 1],
  ];
  shown.forEach(([key, v, dp, scale]) => {
    it(`${key} at ${dp} dp`, () => {
      const f = byKey[key];
      expect(G.typedRouteMiss({ run: () => v, typed: null, read: (x) => x, dp, expected: f.expected / scale, tol: f.tol / scale, key })).toBeNull();
    });
  });
});

describe('RULE 3: the placement explorer names no capstone reader and prints no graded answer', () => {
  it('names nothing', () => expect(G.capstoneNamesIn(SRC)).toEqual([]));
  it('prints no graded answer as a literal', () => expect(G.gradedLiteralsIn(SRC, graded)).toEqual([]));
  it('carries no em dash and no en dash', () => expect(SRC).not.toMatch(/[–—]/));
});
