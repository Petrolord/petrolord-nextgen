// THE TYPED "YOUR CASE" VIEWS (B5 follow-on W4, route b, owner decision D2).
//
// The Column, Valve and Unloading explorers each gain a view that takes a case
// the learner TYPES. Typing the case a capstone prompt states is the work the
// capstone asks for, so this file proves both halves of D2 for all eighteen
// graded fields:
//   a. the case typed exactly as each prompt states it, run through the same
//      lab function the panel calls and read at the precision the panel prints,
//      reproduces every graded value inside its tolerance, and the grader's
//      value here comes from the lab's own capstone reader AND is cross checked
//      against the literal carried in the database;
//   b. the view's DEFAULT state (the AKASO-3 teaching well) lands on no graded
//      answer, measured by the lab's own leak guard;
//   c. a negative control: one typed number changed, and a graded field is no
//      longer reproduced, so this file can fail;
//   d. each new view renders from `initialMode`, with content and no NaN.
//
// The typed inputs below are transcribed from the prompt text, not read from
// the lab's capstone object, because that is what a learner types.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from './gasLiftLab.js';
import ColumnExplorer from './ColumnExplorer.jsx';
import ValveExplorer from './ValveExplorer.jsx';
import UnloadingExplorer from './UnloadingExplorer.jsx';
import * as D2 from '../typedCaseGuard.js';

// The literal graded values carried in the database, [key, value, tol, printed dp].
// The printed dp is what each typed view prints the field at.
const DB = {
  gas_z_at_kickoff: [0.8321323612578156, 4.2e-7, 8],
  gas_gradient_at_kickoff_psi_per_ft: [0.03459262518232471, 1.7e-8, 10],
  inj_column_at_packer_psia: [1589.4628665427595, 0.00079, 6],
  inj_surface_for_1585psia_psia: [1264.8156205292921, 0.00063, 6],
  top_valve_depth_ft: [2494.025220656208, 0.0012, 6],
  inj_curve_at_5375ft_psia: [1450.0362742923005, 0.00073, 6],
  valve2_depth_ft: [4379.112457100502, 0.0022, 6],
  valve4_depth_ft: [6997.151937824368, 0.0035, 6],
  valve2_dome_at_temp_psia: [1313.645346439994, 0.00066, 6],
  valve2_test_rack_opening_psia: [1143.8633940736581, 0.00057, 6],
  valve4_spread_psi: [45.22330508618348, 0.000023, 6],
  valve4_throughput_mscfd: [2892.4892215328155, 0.0014, 6],
  valve1_closing_surface_psia: [1213.9289535870623, 0.00061, 6],
  valve3_closing_surface_psia: [1121.4580042974942, 0.00056, 6],
  injection_point_depth_ft: [9139.524034378974, 0.0046, 6],
  injection_point_pinj_psia: [1573.281485043544, 0.00079, 6],
  injection_point_depth_coarse_ft: [9113.00140054971, 0.0046, 6],
  operating_inj_at_injection_pt_psia: [1459.3240954891764, 0.00073, 6],
};

const graded = L.capstoneValues();

/** Read a value the way the panel prints it, then grade it the way the grader does. */
const reproduces = (key, value) => {
  const [, tol, dp] = DB[key];
  return Math.abs(Number(value.toFixed(dp)) - graded[key]) <= tol;
};

// ----------------------------------------------------------------- the typed cases

// Associate prompt: sg 0.682; 9,640 ft to the packer; 103.5 degF at the wellhead
// to 236.5 degF at a 10,250 ft reference depth; kicked off at 1,268.3 psia; 96
// steps; 0.468 psi/ft kill fluid against 186.4 psia; 1,585 psia at the packer;
// the curve cut at 64 samples and read at 5,375 ft.
const TYPED_COLUMN = {
  gasSg: '0.682', whtF: '103.5', bhtF: '236.5', refDepthFt: '10250', packerFt: '9640',
  pKickoffPsia: '1268.3', steps: '96', killGradPsiPerFt: '0.468', pWhUnloadPsia: '186.4',
  packerTargetPsia: '1585', curveSteps: '64', readDepthFt: '5375',
};

// Professional prompt: IPO, surface close; 1,268.3 kickoff; 1,178.3 operating;
// 48.9 psi decrement; 58.5 psi transfer; 0.468 kill; 0.094 unloading; 186.4
// wellhead; 335 ft minimum spacing; 11 valves; 0.99 in2 bellows; the five port
// catalogue; 2,062 Mscf/d; 0.34375 in bottom orifice; the Associate geotherm and
// gravity. The target depth is left blank: the prompt says it never binds.
const TYPED_DESIGN = {
  gasSg: '0.682', whtF: '103.5', bhtF: '236.5', refDepthFt: '10250', packerFt: '9640',
  pKickoffPsia: '1268.3', pOperatingPsia: '1178.3', dpPerValvePsi: '48.9', dpTransferPsi: '58.5',
  killGradPsiPerFt: '0.468', unloadGradPsiPerFt: '0.094', pWhUnloadPsia: '186.4',
  minSpacingFt: '335', maxValves: '11', bellowsAreaIn2: '0.99',
  ports: '0.28125, 0.34375, 0.40625, 0.46875, 0.5625',
  qgiTargetMscfd: '2062', orificeIdIn: '0.34375', valveType: 'IPO', method: 'surfaceClose',
  bottomOrifice: true, targetDepthFt: '',
};

// Expert prompt: the same installation, and the traverse 224.6 psia + 0.062
// psi/ft rising linearly to 0.229 psi/ft at the packer, tabulated at 401 and at
// 7 rows, with the injection curve at 64 samples.
const TYPED_TRAVERSE = {
  ...TYPED_DESIGN,
  pwhFlowPsia: '224.6', gTopPsiPerFt: '0.062', gBotPsiPerFt: '0.229',
  fineRows: '401', coarseRows: '7', curveSteps: '64',
};

const columnValues = (r) => ({
  gas_z_at_kickoff: r.zKickoff,
  gas_gradient_at_kickoff_psi_per_ft: r.gradKickoffPsiPerFt,
  inj_column_at_packer_psia: r.colAtPackerPsia,
  inj_surface_for_1585psia_psia: r.surfForTargetPsia,
  top_valve_depth_ft: r.topValveFt,
  inj_curve_at_5375ft_psia: r.curveAtReadPsia,
});

const designValues = (r) => ({
  valve2_depth_ft: r.valves[1].depthFt,
  valve4_depth_ft: r.valves[3].depthFt,
  valve2_dome_at_temp_psia: r.valves[1].domeAtTempPsia,
  valve2_test_rack_opening_psia: r.valves[1].testRackOpeningPsia,
  valve4_spread_psi: r.valves[3].spreadPsi,
  valve4_throughput_mscfd: r.valves[3].throughputMscfd,
});

const traverseValues = (r) => ({
  valve1_closing_surface_psia: r.valves[0].closingSurfacePressurePsia,
  valve3_closing_surface_psia: r.valves[2].closingSurfacePressurePsia,
  injection_point_depth_ft: r.fine.depthFt,
  injection_point_pinj_psia: r.fine.pInjPsia,
  injection_point_depth_coarse_ft: r.coarse.depthFt,
  operating_inj_at_injection_pt_psia: r.operatingAtFinePsia,
});

const TIERS = [
  ['beginner', 'the column view', () => columnValues(L.typedGasColumn(TYPED_COLUMN))],
  ['intermediate', 'the design view', () => designValues(L.typedGasLiftDesign(TYPED_DESIGN))],
  ['advanced', 'the traverse view', () => traverseValues(L.typedInjectionPoint(TYPED_TRAVERSE))],
];

describe('a. typing the case each prompt states reads every graded value', () => {
  it('the grader values from the lab reader match the literals in the database', () => {
    expect(Object.keys(DB).sort()).toEqual(Object.keys(L.CAPSTONE_TOLERANCES).sort());
    Object.entries(DB).forEach(([key, [value, tol]]) => {
      expect(graded[key], key).toBe(value);
      expect(L.CAPSTONE_TOLERANCES[key], key).toBe(tol);
    });
  });

  TIERS.forEach(([tier, view, read]) => {
    it(`${tier}: ${view} reproduces all six fields at its printed precision`, () => {
      const got = read();
      const keys = Object.keys(got);
      expect(keys).toHaveLength(6);
      keys.forEach((key) => {
        expect(L.CAPSTONE_TIERS[key], key).toBe(tier);
        const [, tol, dp] = DB[key];
        const printed = Number(got[key].toFixed(dp));
        expect(Math.abs(printed - graded[key]), `${key} printed ${printed}`).toBeLessThanOrEqual(tol);
        expect(Math.abs(printed - DB[key][0]), `${key} against the DB literal`).toBeLessThanOrEqual(tol);
      });
    });
  });

  it('every typed call succeeds with no refusal', () => {
    [L.typedGasColumn(TYPED_COLUMN), L.typedGasLiftDesign(TYPED_DESIGN), L.typedInjectionPoint(TYPED_TRAVERSE)]
      .forEach((r) => { expect(r.ok, r.errors.join(' ')).toBe(true); });
  });
});

describe('b. no typed view DEFAULT lands on a graded answer', () => {
  const targets = L.leakGuardTargets();

  it('the three defaults are on the swept teaching surface', () => {
    const labels = new Set(L.teachingQuantities().map((r) => r.label.split(/[.[]/).slice(0, 2).join('.')));
    ['typedGasColumn.default', 'typedGasLiftDesign.default', 'typedInjectionPoint.default']
      .forEach((l) => expect(labels.has(l), l).toBe(true));
  });

  it('every number the defaults print is clear of every graded neighbourhood', () => {
    const numbers = [];
    const walk = (v) => {
      if (typeof v === 'number') { numbers.push(v); return; }
      if (Array.isArray(v)) { v.forEach(walk); return; }
      if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => { if (k !== 'design') walk(x); });
    };
    const defaults = [
      L.typedGasColumn(L.TYPED_COLUMN_DEFAULT),
      L.typedGasLiftDesign(L.TYPED_DESIGN_DEFAULT),
      L.typedInjectionPoint(L.TYPED_TRAVERSE_DEFAULT),
    ];
    defaults.forEach((d) => expect(d.ok, (d.errors || []).join(' ')).toBe(true));
    defaults.forEach(walk);
    expect(numbers.length).toBeGreaterThan(50);
    const hits = numbers.map((v) => L.leakGuardHit(v, targets)).filter(Boolean);
    expect(hits.map((h) => h.key)).toEqual([]);
    // and the stricter reading: none of the eighteen fields is reproduced by a default
    const col = columnValues(defaults[0]);
    const des = designValues(defaults[1]);
    const trv = traverseValues(defaults[2]);
    Object.entries({ ...col, ...des, ...trv }).forEach(([key, v]) => {
      expect(reproduces(key, v), `${key} default ${v}`).toBe(false);
    });
  });
});

describe('c. negative control: one typed number changed and the fields no longer match', () => {
  it('the column marched at 20 steps misses the packer pressure (the prompt trap)', () => {
    const r = L.typedGasColumn({ ...TYPED_COLUMN, steps: '20' });
    expect(r.ok).toBe(true);
    expect(reproduces('inj_column_at_packer_psia', r.colAtPackerPsia)).toBe(false);
  });

  it('the geotherm anchored at the packer misses the packer pressure', () => {
    const r = L.typedGasColumn({ ...TYPED_COLUMN, refDepthFt: '9640' });
    expect(reproduces('inj_column_at_packer_psia', r.colAtPackerPsia)).toBe(false);
  });

  it('a decrement of 49 psi moves valve 2 and valve 4 out of tolerance', () => {
    const r = L.typedGasLiftDesign({ ...TYPED_DESIGN, dpPerValvePsi: '49' });
    expect(reproduces('valve2_depth_ft', r.valves[1].depthFt)).toBe(false);
    expect(reproduces('valve4_depth_ft', r.valves[3].depthFt)).toBe(false);
  });

  it('the injection point on 201 rows is not the graded 401 row crossing', () => {
    // The chord error falls as the square of the row spacing, so 400 rows sits
    // inside the band of 401; halving the rows does not.
    const r = L.typedInjectionPoint({ ...TYPED_TRAVERSE, fineRows: '201' });
    expect(reproduces('injection_point_depth_ft', r.fine.depthFt)).toBe(false);
    const c = L.typedInjectionPoint({ ...TYPED_TRAVERSE, coarseRows: '6' });
    expect(reproduces('injection_point_depth_coarse_ft', c.coarse.depthFt)).toBe(false);
  });

  it('the typed functions refuse bad input with plain messages and never throw', () => {
    const r1 = L.typedGasColumn({ ...TYPED_COLUMN, gasSg: '' });
    expect(r1.ok).toBe(false);
    expect(r1.errors.join(' ')).toMatch(/Gas specific gravity/);
    const r2 = L.typedGasLiftDesign({ ...TYPED_DESIGN, ports: '0.25, x' });
    expect(r2.ok).toBe(false);
    const r3 = L.typedInjectionPoint({ ...TYPED_TRAVERSE, coarseRows: '1' });
    expect(r3.ok).toBe(false);
    expect(L.typedGasColumn(undefined).ok).toBe(false);
  });
});

describe('d. each typed view renders from initialMode', () => {
  [
    ['ColumnExplorer', ColumnExplorer, 'typed', 'Your well, typed'],
    ['ValveExplorer', ValveExplorer, 'typed', 'Your installation, typed'],
    ['UnloadingExplorer', UnloadingExplorer, 'typed', 'Your well and traverse, typed'],
  ].forEach(([name, Panel, mode, label]) => {
    it(`${name} renders its ${mode} view`, () => {
      const html = renderToStaticMarkup(React.createElement(Panel, { initialMode: mode }));
      expect(html.length).toBeGreaterThan(2000);
      expect(html).toContain(label);
      expect(html).not.toMatch(/NaN/);
      expect(html).toMatch(/teaching/);
    });
  });
});

// ---- D2 SHARED RULES (typedCaseGuard.js, owner decision D2) ----------------
// Rule 1: each typed mode's default state, run through the function the panel
// calls, lands on no graded answer at ten grading bands in five shiftings.
// Rule 2: no default carries a capstone-distinguishing input. The keys are
// FROZEN here (every typed input where the capstone case differs from the
// default when the mode was built), so a default later moved onto a capstone
// input fails even when its outputs do not collide yet.
const D2_MODES = [
  { name: 'column', typed: TYPED_COLUMN, defaults: L.TYPED_COLUMN_DEFAULT, run: L.typedGasColumn },
  { name: 'design', typed: TYPED_DESIGN, defaults: L.TYPED_DESIGN_DEFAULT, run: L.typedGasLiftDesign },
  { name: 'traverse', typed: TYPED_TRAVERSE, defaults: L.TYPED_TRAVERSE_DEFAULT, run: L.typedInjectionPoint },
];
const D2_KEYS = {"column": ["gasSg", "whtF", "bhtF", "refDepthFt", "packerFt", "pKickoffPsia", "steps", "killGradPsiPerFt", "pWhUnloadPsia", "packerTargetPsia", "curveSteps", "readDepthFt"], "design": ["gasSg", "whtF", "bhtF", "refDepthFt", "packerFt", "pKickoffPsia", "pOperatingPsia", "dpPerValvePsi", "dpTransferPsi", "killGradPsiPerFt", "unloadGradPsiPerFt", "pWhUnloadPsia", "minSpacingFt", "maxValves", "bellowsAreaIn2", "ports", "qgiTargetMscfd", "orificeIdIn"], "traverse": ["gasSg", "whtF", "bhtF", "refDepthFt", "packerFt", "pKickoffPsia", "pOperatingPsia", "dpPerValvePsi", "dpTransferPsi", "killGradPsiPerFt", "unloadGradPsiPerFt", "pWhUnloadPsia", "minSpacingFt", "maxValves", "bellowsAreaIn2", "ports", "qgiTargetMscfd", "orificeIdIn", "pwhFlowPsia", "gTopPsiPerFt", "gBotPsiPerFt", "fineRows", "coarseRows", "curveSteps"]};
const d2Leaves = (v, p = '', out = {}) => {
  if (v !== null && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => d2Leaves(x, p ? `${p}.${k}` : k, out));
  } else if (v !== undefined && v !== '') {
    const n = Number(v);
    out[p] = typeof v === 'boolean' || v === null || !Number.isFinite(n) ? v : n;
  }
  return out;
};
// typedCaseGuard reads dotted paths, so a flattened key (wells.0.qmax) is renamed flat
const flat = (k) => k.replace(/\./g, '__');
const d2Bundle = (v) => {
  const o = {};
  Object.entries(d2Leaves(v)).forEach(([p, x]) => { o[p] = x; });
  return o;
};

describe('D2 shared rules (typedCaseGuard.js)', () => {
  const targets = D2.leakTargets(Object.entries(DB).map(([key, [value, tol]]) => ({ tier: 'graded', key, value, tol })));
  it('rule 1: no typed default state lands on a graded answer', () => {
    expect(targets.length).toBeGreaterThan(0);
    expect(D2.defaultStateHits({ targets, modes: D2_MODES })).toEqual([]);
  }, 600000);
  D2_MODES.forEach(({ name, typed, defaults }) => {
    it(`rule 2: the ${name} default preloads no capstone-distinguishing input`, () => {
      const capstone = d2Bundle(typed);
      const bundle = d2Bundle(defaults);
      const keys = D2_KEYS[name];
      expect(keys.length, 'the frozen key list guards nothing').toBeGreaterThan(0);
      const lookup = (o) => Object.fromEntries(keys.map((k) => [flat(k), o[k]]));
      expect(D2.distinguishingKeyProblems({ capstone: lookup(capstone), teachingCases: [{ name: 'default', inputs: lookup(bundle) }], keys: keys.map(flat) })).toEqual([]);
      expect(D2.preloadHits({ capstone: lookup(capstone), bundles: [{ name: `${name} default`, inputs: lookup(bundle) }], keys: keys.map(flat) })).toEqual([]);
    });
    it(`rule 2 is live on the ${name} mode: the capstone typed as a default is caught`, () => {
      const capstone = d2Bundle(typed);
      const keys = D2_KEYS[name];
      const lookup = (o) => Object.fromEntries(keys.map((k) => [flat(k), o[k]]));
      expect(D2.preloadHits({ capstone: lookup(capstone), bundles: [{ name: 'planted', inputs: lookup(capstone) }], keys: keys.map(flat) }).length).toBe(keys.length);
    });
  });
});
