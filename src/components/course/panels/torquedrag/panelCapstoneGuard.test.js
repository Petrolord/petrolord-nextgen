// THE TORQUE AND DRAG PANEL GUARD, under the D2 policy (typedCaseGuard.js).
//
// Every torque and drag capstone reruns the course's wells in 1500 kg/m3 mud,
// and the Expert tier adds a two-entry rotating schedule. W4a gave all three
// explorers a mud box (blank means the lessons' 1440) and the wear view a
// three-row schedule, and prints hookloads and tensions in N to 2 dp and
// torques in N.m to 3 dp. Typing the capstone's mud and schedule is the work,
// so that reach is allowed. What this file forbids is the answer arriving
// without it: every view, at every well or operation it offers, with the mud
// box blank and the schedule at its default, lands on no graded answer; no
// default carries the capstone's mud or schedule; and no panel source names a
// capstone reader or prints a graded answer.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './torquedragLab.js';
import * as G from '../typedCaseGuard.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = path.resolve(HERE, '../../../../../docs/graded-field-audit/fields.json');

const live = JSON.parse(fs.readFileSync(FIELDS, 'utf8')).filter((f) => f.course === 'torquedrag');
const engine = L.capstoneValues();
const graded = live.map((f) => ({ tier: f.tier, key: f.key, value: engine[f.tier][f.key], tol: f.tol }));
const targets = G.leakTargets(graded);
// The charts plot continuous tension, utilization and wear curves, and a
// curve crosses every value in its range: under the dimension-blind sweep some
// point of some well always sits within ten bands of a friction factor (0.41
// read as 410 kN, or as a 0.41 percent utilization). What a learner can read
// off a chart is its TOOLTIP, at the precision the tooltip prints. So each
// curve is swept as its tooltip prints it, against the grader's own band, in
// the units it plots (as graded, and N answers read in kN).
const CHART_SHIFTS = G.DEFAULT_SHIFTS.filter((x) => x.tag === 'as graded' || x.tag === 'x0.001');
const chartTargets = G.leakTargets(graded, { shifts: CHART_SHIFTS, margin: 1 });
const tip = (v, dp) => Number(v.toFixed(dp));
const byKey = Object.fromEntries(live.map((f) => [f.key, f]));

const WELL_IDS = L.WELLS.map((w) => w.id);
const OPS = ['trip_out', 'trip_in', 'rotate_on_bottom', 'backream'];
const BLANK = L.mudOver('');
const WEAR_DEFAULT = { schedule: [{ rpm: 120, hours: 50 }], wearFactorMm3PerKNm: 2 };

// Every view of the three explorers, at the mud box's blank default, over
// every well and operation its selects offer. `run` returns what the view
// computes and renders.
const views = (over) => [
  ...WELL_IDS.map((w) => ({ name: `string.weights.${w}`, defaults: over, run: (o) => ({ s: L.wellSummary(w), w: L.stringWeights(w, o) }) })),
  ...WELL_IDS.map((w) => ({
    name: `string.broomstick.${w}`,
    defaults: over,
    run: (o) => ({ b: L.broomstick(w, o) }),
  })),
  ...WELL_IDS.map((w) => ({ name: `string.operations.${w}`, defaults: over, run: (o) => L.operationTable(w, o) })),
  ...WELL_IDS.flatMap((w) => OPS.map((op) => ({ name: `friction.sweep.${w}.${op}`, defaults: over, run: (o) => L.frictionSweep(w, op, undefined, o) }))),
  ...WELL_IDS.map((w) => ({
    name: `friction.calibrate.${w}`,
    defaults: over,
    run: (o) => {
      const mu = L.frictionFromHookload({ well: w, operation: 'trip_out', targetN: 1100000, ...o });
      return {
        mu,
        check: L.summaryOf(w, 'trip_out', { ...o, frictionOpen: mu }).hookloadN,
        torque: L.summaryOf(w, 'rotate_on_bottom', { ...o, frictionOpen: mu }).surfaceTorqueNm,
        base: L.summaryOf(w, 'rotate_on_bottom', o).surfaceTorqueNm,
      };
    },
  })),
  { name: 'buckling.limits', defaults: over, run: (o) => ({ ladder: L.bucklingLadder('horizontal', undefined, o), at: L.pipeLimits({ well: 'horizontal', incDeg: 90, ...o }) }) },
  ...WELL_IDS.map((w) => ({ name: `buckling.utilization.${w}`, defaults: over, run: (o) => L.utilization(w, 'rotate_on_bottom', o) })),
  { name: 'buckling.wear', defaults: over, run: (o) => { const r = L.wearRun({ ...WEAR_DEFAULT, over: o }); return { ...r, rows: r.rows.map((x) => ({ wallLossPct: x.wallLossPct })) }; } },
];

// The chart curves, in the units they plot.
const charts = (over, kNdp = 2) => [
  ...WELL_IDS.map((w) => ({
    name: `string.broomstick.chart.${w}`,
    defaults: over,
    run: (o) => ['trip_out', 'trip_in', 'rotate_off_bottom'].map((op) => L.runCase(w, op, o).profile.map((r) => tip(r.tensionN / 1000, kNdp))),
  })),
  ...WELL_IDS.map((w) => ({
    name: `buckling.utilization.chart.${w}`,
    defaults: over,
    run: (o) => L.runCase(w, 'rotate_on_bottom', o).profile.map((r) => [tip((r.utilization?.tension ?? 0) * 100, 3), tip((r.utilization?.torsion ?? 0) * 100, 3)]),
  })),
  { name: 'buckling.wear.chart', defaults: over, run: (o) => L.wearRun({ ...WEAR_DEFAULT, over: o }).rows.map((x) => [tip(x.wallLossPct, 4), tip(x.sideForceN / 1000, 4)]) },
];

const panelSources = fs.readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

describe('the guard is built from the live graded fields', () => {
  it('eighteen live fields, each computed by the engine within its own tolerance', () => {
    expect(live).toHaveLength(18);
    live.forEach((f) => {
      expect(Math.abs(engine[f.tier][f.key] - f.expected), `${f.tier}/${f.key}`).toBeLessThanOrEqual(f.tol);
    });
  });
});

describe('RULE 1: no view, at any well or operation it offers, opens on a graded answer', () => {
  it('the blank mud box means the lessons\' mud and nothing else', () => {
    expect(BLANK).toEqual({});
    expect(L.mudOver('abc')).toBeNull();
    expect(L.mudOver('9000')).toBeNull();
    expect(L.mudOver('1500')).toEqual({ mudDensityKgM3: 1500 });
  });

  it('every view is silent at its defaults', () => {
    expect(G.defaultStateHits({ targets, modes: views(BLANK) })).toEqual([]);
  }, 120000);

  it('and so is every chart curve, as its tooltip prints it', () => {
    expect(G.defaultStateHits({ targets: chartTargets, modes: charts(BLANK) })).toEqual([]);
  }, 120000);

  it('NEGATIVE CONTROL: a 6 dp tooltip on the capstone mud would show the slant pick-up in kN', () => {
    const hits = G.defaultStateHits({ targets: chartTargets, modes: charts({ mudDensityKgM3: L.CAPSTONE_MUD_KGM3 }, 6) });
    expect(hits.some((h) => h.includes('/slant_pickup_hookload_N (x0.001)'))).toBe(true);
  }, 120000);

  it('NEGATIVE CONTROL: the same views opened on the capstone mud print the answers', () => {
    const hits = G.defaultStateHits({ targets, modes: views({ mudDensityKgM3: L.CAPSTONE_MUD_KGM3 }) });
    ['slant_pickup_hookload_N', 'horizontal_slackoff_hookload_N', 'buildhold_rot_torque_Nm',
      'horizontal_slide_min_tension_N', 'buildhold_mu_for_1100kN_pickup', 'hz_max_torsion_utilization']
      .forEach((k) => expect(hits.some((h) => h.includes(`/${k} `)), k).toBe(true));
  }, 120000);
});

describe('RULE 2: no default preloads the capstone mud or schedule', () => {
  const capstone = { mudDensityKgM3: L.CAPSTONE_MUD_KGM3, schedule: L.CAPSTONE_SCHEDULE };
  const teaching = { mudDensityKgM3: L.TEACHING_MUD_KGM3, schedule: WEAR_DEFAULT.schedule };
  it('the mud and the schedule distinguish the capstone from the lessons', () => {
    expect(G.distinguishingKeyProblems({ capstone, teachingCases: [{ name: 'lessons', inputs: teaching }], keys: ['mudDensityKgM3', 'schedule'] })).toEqual([]);
  });
  it('and the explorers open on the lessons\' mud and schedule', () => {
    expect(G.preloadHits({ capstone, bundles: [{ name: 'explorer defaults', inputs: teaching }], keys: ['mudDensityKgM3', 'schedule'] })).toEqual([]);
    panelSources.forEach(({ file, text }) => {
      expect(text, file).toMatch(/useState\(''\)/);
      expect(text, file).toMatch(/mudOver\(mud\)/);
    });
    const wear = panelSources.find((p) => p.file === 'BucklingExplorer.jsx').text;
    expect(wear).toMatch(/useState\(\[\['120', '50'\], \['', ''\], \['', ''\]\]\)/);
  });
  it('NEGATIVE CONTROL: a mud box that opened on 1500 is a preload', () => {
    expect(G.preloadHits({ capstone, bundles: [{ name: 'bad', inputs: { ...teaching, mudDensityKgM3: 1500 } }], keys: ['mudDensityKgM3', 'schedule'] }))
      .toEqual(['bad preloads the capstone\'s mudDensityKgM3 = 1500']);
  });
});

describe('THE ROUTE: typing 1500 (and the Expert schedule) reads every unreachable field at the printed precision', () => {
  const o = L.mudOver('1500');
  const slant = L.broomstick('slant', o);
  const op = (w, name) => L.operationTable(w, o).find((r) => r.operation === name);
  const mu = L.frictionFromHookload({ well: 'buildhold', operation: 'trip_out', targetN: 1100000, ...o });
  const u = L.utilization('horizontal', 'rotate_on_bottom', o);
  const wear = L.wearRun({ schedule: [{ rpm: 150, hours: 30 }, { rpm: 90, hours: 20 }], wearFactorMm3PerKNm: 2, over: o });
  // [key, the number the view shows, the decimals it prints]
  const shown = [
    ['slant_pickup_hookload_N', slant.pickupN, 2],
    ['slant_slackoff_hookload_N', slant.slackoffN, 2],
    ['slant_drag_swing_N', slant.dragSwingN, 2],
    ['horizontal_slackoff_hookload_N', L.broomstick('horizontal', o).slackoffN, 2],
    ['buildhold_rot_torque_Nm', op('buildhold', 'rotate_on_bottom').surfaceTorqueNm, 3],
    ['horizontal_rot_torque_Nm', op('horizontal', 'rotate_on_bottom').surfaceTorqueNm, 3],
    ['buildhold_max_side_force_Npm', op('buildhold', 'rotate_on_bottom').maxSideForceNPerM, 4],
    ['swell3d_backream_torque_Nm', op('swell3d', 'backream').surfaceTorqueNm, 3],
    ['horizontal_slide_min_tension_N', op('horizontal', 'slide_drill').minTensionN, 2],
    ['buildhold_mu_for_1100kN_pickup', mu, 8],
    ['hz_max_torsion_utilization', u.maxTorsionUtilization, 6],
    ['casing_max_wear_depth_mm', wear.maxWearDepthM * 1000, 6],
    ['casing_worst_wall_loss_pct', wear.worstWallLossPct, 6],
  ];
  shown.forEach(([key, v, dp]) => {
    it(`${key} at ${dp} dp`, () => {
      const f = byKey[key];
      expect(G.typedRouteMiss({ run: () => v, typed: null, read: (x) => x, dp, expected: f.expected, tol: f.tol, key })).toBeNull();
    });
  });
});

describe('RULE 3: no panel names a capstone reader or prints a graded answer', () => {
  it('there are panels to check', () => {
    expect(panelSources.map((s) => s.file).sort()).toEqual(['BucklingExplorer.jsx', 'FrictionExplorer.jsx', 'StringExplorer.jsx']);
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
