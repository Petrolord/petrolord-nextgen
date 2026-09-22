// THE GEOMECHANICS PANEL GUARD, under the D2 policy (typedCaseGuard.js).
//
// The Professional and Expert capstones run the Associate capstone's own
// parameter set (Poisson 0.24, friction 26 degrees, E 18 GPa, strains 0.0002
// and 0.0005, Biot 0.9, SHmax 105 degrees, tensile 2.5 MPa), and the
// Professional one a UCS from a core plug reading. No explorer took them all,
// so twelve fields had no route. W4a gives the stability explorer's "At one
// depth" view and the window explorer's "Along the well" view a box for every
// parameter (blank is the published value) and the first a UCS box, and adds
// collapse and fracture initiation tiles at the tightest point. Typing the case
// is the work, so that reach is allowed. What this file forbids is the answer
// arriving without it: every view of both explorers, at every option its
// selects offer with its boxes blank, lands on no graded answer; no default
// carries a capstone input; no panel source names a capstone reader or prints
// a graded answer.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './geomechLab.js';
import * as G from '../typedCaseGuard.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = path.resolve(HERE, '../../../../../docs/graded-field-audit/fields.json');

const live = JSON.parse(fs.readFileSync(FIELDS, 'utf8')).filter((f) => f.course === 'geomech');
const engine = L.capstoneValues();
const graded = live.map((f) => ({ tier: f.tier, key: f.key, value: engine[f.key], tol: f.tol }));
// Every geomechanics answer is SI (Pa, kg/m3, degrees, ratios), so the psia and
// psig identities restate nothing here: the shiftings are the unit scalings.
const SI_SHIFTS = G.DEFAULT_SHIFTS.filter((x) => !x.tag.startsWith('psi'));
const targets = G.leakTargets(graded, { shifts: SI_SHIFTS });
// Chart curves are read through their tooltips, at the grader's own band
// (a continuous curve crosses every value in its range; see torquedrag's guard).
const chartTargets = G.leakTargets(graded, { margin: 1, shifts: SI_SHIFTS });
const byKey = Object.fromEntries(live.map((f) => [f.key, f]));
const tip = (v, dp) => Number(v.toFixed(dp));

const SRC = {
  stability: fs.readFileSync(path.join(HERE, 'StabilityExplorer.jsx'), 'utf8'),
  window: fs.readFileSync(path.join(HERE, 'WindowExplorer.jsx'), 'utf8'),
};
const DEPTHS = L.PROFILE.tvdM.filter((t) => t >= 1000);
const BLANK = L.paramsOver(L.BLANK_PARAMS);

const MODES = [
  ...DEPTHS.map((tvd) => ({
    name: `stability.point.${tvd}`,
    defaults: { tvd, incDeg: 0, aziDeg: 0, over: BLANK },
    run: (d) => ({ s: L.stability(d.tvd, { incDeg: d.incDeg, aziDeg: d.aziDeg, over: d.over }), a: L.atDepth(d.tvd, d.over) }),
  })),
  ...DEPTHS.map((tvd) => ({
    name: `stability.attitude.${tvd}`,
    defaults: tvd,
    run: (t) => L.attitudeSweep(t, { incs: [0, 15, 30, 45, 60, 75, 90], azis: [0, 60, 150] }),
  })),
  { name: 'stability.closed', defaults: {}, run: () => ({ v: L.verticalCheck(), i: L.VERTICAL.inputs }) },
  ...L.WELLS.map((w) => ({
    name: `window.along.${w.id}`,
    defaults: BLANK,
    run: (o) => { const r = L.window_(w.id, o); return { tightest: r.tightest, tightRow: r.tightRow, rows: r.rows.length, inversionMd: r.inversionMd }; },
  })),
  { name: 'window.compare', defaults: {}, run: () => ({ s: L.window_('slant').tightest, h: L.window_('horizontal').tightest }) },
];
const CHARTS = L.WELLS.map((w) => ({
  name: `window.along.chart.${w.id}`,
  defaults: BLANK,
  run: (o) => L.window_(w.id, o).rows.map((r) => [r.ppEmwKgM3, r.collapseEmwKgM3, r.fracInitEmwKgM3].map((v) => tip(v, 3))),
}));

describe('the guard is built from the live graded fields', () => {
  it('eighteen live fields, each computed by the engine within its own tolerance', () => {
    expect(live).toHaveLength(18);
    live.forEach((f) => expect(Math.abs(engine[f.key] - f.expected), f.key).toBeLessThanOrEqual(f.tol));
  });
  it('blank boxes are the published parameters and nothing else', () => {
    expect(BLANK).toEqual({});
    expect(L.paramsOver({ ...L.BLANK_PARAMS, nu: '0.7' })).toBeNull();
    expect(L.paramsOver({ ...L.BLANK_PARAMS, ePa: 'x' })).toBeNull();
    expect(L.paramsOver({ ...L.BLANK_PARAMS, nu: '0.24' })).toEqual({ nu: 0.24 });
  });
});

describe('RULE 1: no view of either explorer opens on a graded answer', () => {
  it('every view, at every depth and well its selects offer, is silent with its boxes blank', () => {
    expect(G.defaultStateHits({ targets, modes: MODES })).toEqual([]);
  }, 120000);
  it('and so is every window chart, as its tooltip prints it', () => {
    expect(G.defaultStateHits({ targets: chartTargets, modes: CHARTS })).toEqual([]);
  }, 120000);
  it('NEGATIVE CONTROL: the window view on the capstone parameters prints the Expert answers', () => {
    const hits = G.defaultStateHits({ targets, modes: L.WELLS.map((w) => ({ name: `window.${w.id}`, defaults: L.CAPSTONE_PARAMS, run: (o) => L.window_(w.id, o).tightRow })) });
    ['slant_collapse_emw_at_tightest_kgm3', 'horizontal_frac_init_emw_at_tightest_kgm3']
      .forEach((k) => expect(hits.some((h) => h.includes(`/${k} `)), k).toBe(true));
  }, 120000);
});

describe('RULE 2: no default carries a capstone input', () => {
  const KEYS = L.PARAM_FIELDS.map((f) => f.key);
  const capstone = { ...L.CAPSTONE_PARAMS, tvd: L.CAPSTONE_TVD_M, incDeg: L.CAPSTONE_INC_DEG, aziDeg: L.CAPSTONE_AZI_DEG };
  const pointDefault = { ...L.PARAMS, tvd: 2500, incDeg: 0, aziDeg: 0 };
  it('every parameter, the inclination and the azimuth distinguish the capstone from the published case', () => {
    expect(G.distinguishingKeyProblems({ capstone, teachingCases: [{ name: 'published', inputs: pointDefault }], keys: [...KEYS, 'tvd', 'incDeg', 'aziDeg'] })).toEqual([]);
  });
  it('the views open on the published case with every box blank', () => {
    expect(G.preloadHits({ capstone, bundles: [{ name: 'point default', inputs: pointDefault }], keys: [...KEYS, 'tvd', 'incDeg', 'aziDeg'] })).toEqual([]);
    expect(SRC.stability).toMatch(/const \[typed, setTyped\] = useState\(BLANK_PARAMS\);/);
    expect(SRC.stability).toMatch(/const \[ucs, setUcs\] = useState\(''\);/);
    expect(SRC.stability).toMatch(/const \[tvd, setTvd\] = useState\('2500'\);\n {2}const \[inc, setInc\] = useState\('0'\);\n {2}const \[azi, setAzi\] = useState\('0'\);\n {2}const \[typed/);
    expect(SRC.window).toMatch(/const \[typed, setTyped\] = useState\(BLANK_PARAMS\);/);
    Object.values(L.BLANK_PARAMS).forEach((v) => expect(v).toBe(''));
  });
  it('NEGATIVE CONTROL: a Poisson box that opened on 0.24 is a preload', () => {
    expect(G.preloadHits({ capstone, bundles: [{ name: 'bad', inputs: { ...pointDefault, nu: 0.24 } }], keys: KEYS }))
      .toEqual(['bad preloads the capstone\'s nu = 0.24']);
  });
});

describe('THE ROUTE: typing the stated case reads all twelve fields at the printed precision', () => {
  const typed = L.paramsOver(Object.fromEntries(Object.entries(L.CAPSTONE_PARAMS).filter(([k]) => k !== 'regime').map(([k, v]) => [k, String(v)])));
  // the Professional UCS is the Associate capstone's Horsrud value, which the learner has
  const ucsPa = L.ucsFromDt({ dtUsPerM: [L.CAPSTONE_DT_US_PER_M] }).ucsPa[0];
  const s = L.stability(L.CAPSTONE_TVD_M, { incDeg: L.CAPSTONE_INC_DEG, aziDeg: L.CAPSTONE_AZI_DEG, ucsPa, over: typed });
  const ws = L.window_('slant', typed);
  const wh = L.window_('horizontal', typed);
  // [key, the number shown, decimals printed, units per graded unit]
  const shown = [
    ['collapse_Pa', s.collapsePa / 1e6, 5, 1e6],
    ['frac_init_Pa', s.fracInitPa / 1e6, 5, 1e6],
    ['breakout_theta_deg', s.breakoutThetaDeg, 0, 1],
    ['collapse_emw_kgm3', s.collapseEmw, 4, 1],
    ['frac_init_emw_kgm3', s.fracInitEmw, 4, 1],
    ['window_width_emw_kgm3', s.widthEmw, 4, 1],
    ['slant_tightest_width_kgm3', ws.tightest.widthKgM3, 4, 1],
    ['slant_collapse_emw_at_tightest_kgm3', ws.tightRow.collapseEmwKgM3, 4, 1],
    ['slant_frac_init_emw_at_tightest_kgm3', ws.tightRow.fracInitEmwKgM3, 4, 1],
    ['horizontal_tightest_width_kgm3', wh.tightest.widthKgM3, 4, 1],
    ['horizontal_collapse_emw_at_tightest_kgm3', wh.tightRow.collapseEmwKgM3, 4, 1],
    ['horizontal_frac_init_emw_at_tightest_kgm3', wh.tightRow.fracInitEmwKgM3, 4, 1],
  ];
  shown.forEach(([key, v, dp, scale]) => {
    it(`${key} at ${dp} dp`, () => {
      const f = byKey[key];
      expect(G.typedRouteMiss({ run: () => v, typed: null, read: (x) => x, dp, expected: f.expected / scale, tol: f.tol / scale, key })).toBeNull();
    });
  });
  it('the stated depth is one the view offers, and the window view prints collapse at the tightest point', () => {
    expect(DEPTHS).toContain(L.CAPSTONE_TVD_M);
    expect(SRC.window).toMatch(/label="Collapse at tightest" value=\{fmt\(w\.tightRow\.collapseEmwKgM3, 4\)\}/);
  });
});

describe('RULE 3: neither explorer names a capstone reader or prints a graded answer', () => {
  Object.entries(SRC).forEach(([name, text]) => {
    it(`${name} names nothing`, () => expect(G.capstoneNamesIn(text)).toEqual([]));
    it(`${name} prints no graded answer as a literal`, () => expect(G.gradedLiteralsIn(text, graded)).toEqual([]));
    it(`${name} carries no em dash and no en dash`, () => expect(text).not.toMatch(/[–—]/));
  });
});
