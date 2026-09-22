// THE TYPED STREAM VIEWS (B5 follow-on W4, owner decision D2): reachable by
// typing, silent by default.
//
// Each explorer has a "Your stream, typed" view. A learner who types the stream
// a capstone prompt states must be able to read every graded value of that
// tier in the view, at a printed precision inside its grading band. What must
// never happen is that a view's DEFAULT state lands on a graded answer. This
// file proves both halves, calls the engine through the lab to do it, and
// proves it can fail.
//
// The typed inputs below are transcribed from the live prompts, which is what a
// learner types. The graded values are the lab's own capstone derivation
// (capstoneValues, the same chain fields.json was generated from), cross
// checked against the literal values the grader holds.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';
import * as L from './producedWaterLab.js';
import { gradedTolerance } from './gradedTolerance.js';
import WaterExplorer from './WaterExplorer.jsx';
import DeviceExplorer from './DeviceExplorer.jsx';
import TrainExplorer from './TrainExplorer.jsx';
import * as D2 from '../typedCaseGuard.js';

const FIELDS = JSON.parse(fs.readFileSync(waveInput('producedwater', 'fields.json'), 'utf8'));
const GRADED = L.capstoneValues();
const TARGETS = L.leakGuardTargets(FIELDS);

/** The graded values as the grader holds them (the live capstone fields). */
const DB = {
  ogulagha_water_viscosity_pas: 0.0005101915934473397,
  ogulagha_water_density_kgm3: 1013.7286105037547,
  ogulagha_oil_density_kgm3: 862.3241899811321,
  ogulagha_droplet_rise_ms: 7.82526023252317e-05,
  ogulagha_basin_cut_micron: 113.37669131197052,
  ogulagha_plate_cut_micron: 69.84080434958841,
  izombe_liner_turndown_ratio: 1.7787930373888892,
  izombe_cyclone_shear_penalty: 1.1697445603434073,
  izombe_cyclone_cut_micron: 5.319865594518567,
  izombe_bubble_rise_ms: 0.02505191646373671,
  izombe_gas_holdup_ratio: 0.06881952310620194,
  izombe_filter_cut_micron: 10.257441012720951,
  tunu_cyclone_stage_median_micron: 4.693996003747812,
  tunu_plate_stage_removal_pct: 11.801201005213063,
  tunu_cyclone_stage_removal_pct: 93.8488534141062,
  tunu_train_outlet_ppm: 45.682546314511974,
  tunu_train_outlet_median_micron: 4.08399589751163,
  tunu_coarse_droplet_reynolds: 6.997495185436383,
};

// What each view types, as strings, exactly as the prompts state them.
const BEGINNER = {
  bwpd: '36000', tC: '58.5', tdsPpm: '42500', apiGravity: '27.5',
  oiwPpm: '420', d50Micron: '22', sigma: '0.75',
  lengthM: '15', widthM: '3.4', depthM: '1.5', shortCircuitF: '1.6',
  nPlates: '48', plateAreaM2: '2.5', efficiencyFactor: '0.7',
};
const INTERMEDIATE = {
  bwpd: '58000', tC: '47', tdsPpm: '88000', apiGravity: '31',
  nLiners: '100', linerDiameterM: '0.035', linerLengthM: '0.7', designFlowPerLinerM3S: '0.0006',
  gFieldAtDesign: '1000', coreRadiusFraction: '0.5',
  nCells: '3', cellVolumeM3: '26', cellDepthM: '3.5', gasRatio: '0.12', bubbleMicron: '220', gasDensityKgM3: '1.2',
  filterAreaM2: '18', bedDepthM: '1.1', mediaMicron: '800', filterCoefficientPerM: '3.5', referenceDropletMicron: '20',
};
const ADVANCED = {
  bwpd: '44000', tC: '66', tdsPpm: '21000', apiGravity: '36',
  oiwPpm: '1150', d50Micron: '19', sigma: '0.85', nBins: '60', spanSigma: '4',
  nPlates: '56', plateAreaM2: '2.2', efficiencyFactor: '0.7',
  nLiners: '120', linerDiameterM: '0.035', linerLengthM: '0.7', designFlowPerLinerM3S: '0.0006',
  gFieldAtDesign: '1000', coreRadiusFraction: '0.5',
  filterAreaM2: '14', bedDepthM: '1.4', mediaMicron: '800', filterCoefficientPerM: '3.5', referenceDropletMicron: '20',
  dropletMicron: '240',
};

// [graded key, reader of the typed result, decimals the view prints it to]
const WATER_READS = [
  ['ogulagha_water_viscosity_pas', (r) => r.muPaS, 12],
  ['ogulagha_water_density_kgm3', (r) => r.rhoWaterKgM3, 6],
  ['ogulagha_oil_density_kgm3', (r) => r.rhoOilKgM3, 6],
  ['ogulagha_droplet_rise_ms', (r) => r.riseMS, 12],
  ['ogulagha_basin_cut_micron', (r) => r.basinCutMicron, 6],
  ['ogulagha_plate_cut_micron', (r) => r.plateCutMicron, 6],
];
const DEVICE_READS = [
  ['izombe_liner_turndown_ratio', (r) => r.turndownRatio, 9],
  ['izombe_cyclone_shear_penalty', (r) => r.shearPenalty, 9],
  ['izombe_cyclone_cut_micron', (r) => r.linerCutMicron, 6],
  ['izombe_bubble_rise_ms', (r) => r.bubbleRiseMS, 12],
  ['izombe_gas_holdup_ratio', (r) => r.gasHoldup, 12],
  ['izombe_filter_cut_micron', (r) => r.bedCutMicron, 6],
];
const TRAIN_READS = [
  ['tunu_cyclone_stage_median_micron', (r) => r.stages[1].outletMedianMicron, 6],
  ['tunu_plate_stage_removal_pct', (r) => r.stages[0].removalPct, 6],
  ['tunu_cyclone_stage_removal_pct', (r) => r.stages[1].removalPct, 6],
  ['tunu_train_outlet_ppm', (r) => r.outletOiwPpm, 6],
  ['tunu_train_outlet_median_micron', (r) => r.outletMedianMicron, 6],
  ['tunu_coarse_droplet_reynolds', (r) => r.dropletReynolds, 9],
];

const VIEWS = [
  ['water', L.typedWaterStream, BEGINNER, WATER_READS, L.TYPED_WATER_DEFAULT],
  ['device', L.typedDeviceStream, INTERMEDIATE, DEVICE_READS, L.TYPED_DEVICE_DEFAULT],
  ['train', L.typedTrainStream, ADVANCED, TRAIN_READS, L.TYPED_TRAIN_DEFAULT],
];

const printed = (v, dp) => Number(v.toFixed(dp));

describe('the graded values this file checks against are the grader\'s', () => {
  it('covers all eighteen graded keys, and the lab derivation, fields.json and the grader literals agree', () => {
    const keys = VIEWS.flatMap(([, , , reads]) => reads.map(([k]) => k));
    expect(new Set(keys).size).toBe(18);
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([, key, value, tol]) => {
      expect(keys, key).toContain(key);
      expect(tol, key).toBe(gradedTolerance(key));
      expect(Math.abs(GRADED[key] - value), `${key}: the lab derivation against fields.json`).toBeLessThanOrEqual(tol / 1000);
      expect(Math.abs(DB[key] - value), `${key}: the grader literal against fields.json`).toBeLessThanOrEqual(tol / 1000);
    });
  });
});

describe('typing the stream a prompt states reads every graded value, at the printed precision', () => {
  VIEWS.forEach(([name, fn, typed, reads]) => {
    it(`the ${name} view reproduces its six graded values from the typed prompt`, () => {
      const r = fn(typed);
      expect(r.ok, r.errors.join(' ')).toBe(true);
      reads.forEach(([key, read, dp]) => {
        const tol = gradedTolerance(key);
        const shown = printed(read(r), dp);
        expect(Math.abs(shown - GRADED[key]), `${key} printed at ${dp} dp is ${shown}`).toBeLessThanOrEqual(tol);
        expect(Math.abs(shown - DB[key]), `${key} against the grader literal`).toBeLessThanOrEqual(tol);
      });
    });
  });
});

describe('each view\'s default state lands on no graded answer', () => {
  VIEWS.forEach(([name, fn, , , defaults]) => {
    it(`the ${name} view opens on a teaching stream that answers, and no number it returns is near a graded answer`, () => {
      const r = fn(defaults);
      expect(r.ok, r.errors.join(' ')).toBe(true);
      const numbers = L.collectNumbers(r);
      expect(numbers.length).toBeGreaterThan(8);
      const hits = numbers.map(({ path, value }) => [path, value, L.leakGuardHit(value, TARGETS)])
        .filter(([, , hit]) => hit)
        .map(([path, value, hit]) => `${path} = ${value} is within ${hit.band} of ${hit.key} ${hit.tag}`);
      expect(hits).toEqual([]);
    });
  });

  it('the defaults are the teaching streams, never a capstone stream', () => {
    const capstoneWaters = [L.CAPSTONE_A.water, L.CAPSTONE_B.water, L.CAPSTONE_C.water];
    VIEWS.forEach(([name, , , , d]) => {
      capstoneWaters.forEach((c) => {
        expect(d.tC === c.tC && d.tdsPpm === c.tdsPpm, `${name} opens on a capstone water`).toBe(false);
      });
    });
  });
});

describe('NEGATIVE CONTROLS: the check can fail', () => {
  const MUTATIONS = [
    ['water', L.typedWaterStream, { ...BEGINNER, tC: '58.6' }, WATER_READS],
    ['device', L.typedDeviceStream, { ...INTERMEDIATE, nLiners: '101' }, DEVICE_READS],
    ['train', L.typedTrainStream, { ...ADVANCED, nPlates: '55' }, TRAIN_READS],
  ];
  MUTATIONS.forEach(([name, fn, typed, reads]) => {
    it(`one typed number changed on the ${name} view misses at least one graded value`, () => {
      const r = fn(typed);
      expect(r.ok).toBe(true);
      const missed = reads.filter(([key, read, dp]) => Math.abs(printed(read(r), dp) - GRADED[key]) > gradedTolerance(key));
      expect(missed.length).toBeGreaterThan(0);
    });
  });

  it('a value that is not a number is refused in plain words, and nothing throws', () => {
    const r = L.typedWaterStream({ ...BEGINNER, tC: 'warm' });
    expect(r.ok).toBe(false);
    expect(r.errors.join(' ')).toMatch(/Temperature, C is not a number/);
    const blank = L.typedTrainStream({ ...ADVANCED, nBins: '' });
    expect(blank.ok).toBe(false);
    expect(blank.errors.join(' ')).toMatch(/Type a value for Bins on the droplet grid/);
  });

  it('an engine refusal is carried through as the engine worded it', () => {
    const r = L.typedDeviceStream({ ...INTERMEDIATE, nLiners: '1' });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.startsWith('The engine refuses the liner bank: '))).toBe(true);
    // the other two devices still answer
    expect(Number.isFinite(r.bubbleRiseMS)).toBe(true);
    expect(Number.isFinite(r.bedCutMicron)).toBe(true);
  });
});

describe('the typed view renders in every explorer', () => {
  const PANELS = [
    ['WaterExplorer', WaterExplorer, L.typedWaterStream(L.TYPED_WATER_DEFAULT).muPaS.toFixed(12)],
    ['DeviceExplorer', DeviceExplorer, L.typedDeviceStream(L.TYPED_DEVICE_DEFAULT).bubbleRiseMS.toFixed(12)],
    ['TrainExplorer', TrainExplorer, L.typedTrainStream(L.TYPED_TRAIN_DEFAULT).outletOiwPpm.toFixed(6)],
  ];
  PANELS.forEach(([name, Panel, expected]) => {
    it(`${name} renders the typed mode on its teaching stream, with no NaN`, () => {
      const html = renderToStaticMarkup(React.createElement(Panel, { initialMode: 'typed' }));
      expect(html.length).toBeGreaterThan(2000);
      expect(html).toContain('Your stream, typed');
      expect(html).toContain('every input can be retyped');
      expect(html).toContain(expected);
      expect(html).not.toMatch(/NaN/);
      expect(html).not.toMatch(/Not answered/);
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
  { name: 'water', typed: BEGINNER, defaults: L.TYPED_WATER_DEFAULT, run: L.typedWaterStream },
  { name: 'device', typed: INTERMEDIATE, defaults: L.TYPED_DEVICE_DEFAULT, run: L.typedDeviceStream },
  { name: 'train', typed: ADVANCED, defaults: L.TYPED_TRAIN_DEFAULT, run: L.typedTrainStream },
];
const D2_KEYS = {"water": ["bwpd", "tC", "tdsPpm", "apiGravity", "oiwPpm", "d50Micron", "sigma", "lengthM", "widthM", "depthM", "shortCircuitF", "nPlates", "plateAreaM2"], "device": ["bwpd", "tC", "tdsPpm", "apiGravity", "nLiners", "nCells", "cellVolumeM3", "cellDepthM", "gasRatio", "bubbleMicron", "filterAreaM2", "bedDepthM", "mediaMicron"], "train": ["bwpd", "tC", "tdsPpm", "apiGravity", "oiwPpm", "d50Micron", "sigma", "nPlates", "plateAreaM2", "nLiners", "filterAreaM2", "bedDepthM", "mediaMicron", "dropletMicron"]};
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
  const targets = D2.leakTargets(FIELDS);
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
