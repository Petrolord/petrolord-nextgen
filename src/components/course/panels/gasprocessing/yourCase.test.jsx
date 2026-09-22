// THE TYPED SKID: reachable by typing, silent by default (B5 follow-on W4,
// owner decision D2).
//
// The cold end explorer's "typed" view takes a let-down the learner types. A
// learner who types the advanced capstone's let-down, exactly as its prompt
// states it, must be able to read every graded value inside its tolerance at
// the precision the view prints. The view's DEFAULT state is the teaching
// stream and must land on no graded answer. Both halves are proved here by
// calling the engine through the lab, never by restating a formula.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from './gasprocessingLab.js';
import ColdEndExplorer, { MODES } from './ColdEndExplorer.jsx';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';
import * as D2 from '../typedCaseGuard.js';

const FIELDS = JSON.parse(fs.readFileSync(waveInput('gasprocessing', 'fields.json'), 'utf8'));
const ADVANCED = FIELDS.filter(([tier]) => tier === 'advanced');

// The let-down as the prompt states it, transcribed from the prompt text: "Gas
// at 935 psia and 87 degF lets down across a choke to 405 psia ... The gas
// gravity is 0.67 and its molar heat capacity is 10.2 Btu per lbmol degF."
// Typed as strings, the way the fields hold them.
const TYPED = {
  p1Psia: '935', tF: '87', p2Psia: '405', gasSg: '0.67', cpBtuLbmolF: '10.2',
};

// The graded values as the database holds them (the case file's literals).
const DB = {
  dzdT: [0.0009683744638956019, 5e-07],
  muFPerPsi: [0.06026080453221084, 5e-07],
  dropF: [33.72690128392314, 0.0001],
  t2F: [53.27309871607686, 0.0001],
  waterInLbMMscf: [32.20884788270555, 0.0001],
  waterOutLbMMscf: [23.519449233233914, 0.0001],
};

// The decimals the typed view prints each value at (ColdEndExplorer TypedMode).
const PRINTED_DP = {
  dzdT: 12, muFPerPsi: 12, dropF: 9, t2F: 9, waterInLbMMscf: 9, waterOutLbMMscf: 9,
};

const reads = (r, key, dp) => Number(r[key].toFixed(dp));

describe('the typed skid reproduces the six advanced graded values', () => {
  it('the six graded keys are the ones this view prints', () => {
    expect(ADVANCED.map(([, k]) => k)).toEqual(Object.keys(DB));
  });

  it('the grader, the lab capstone reader and the database literal agree', () => {
    const lab = L.capstoneValues();
    ADVANCED.forEach(([, key, graded, tol]) => {
      expect(graded, key).toBe(DB[key][0]);
      expect(tol, key).toBe(DB[key][1]);
      expect(lab[key], key).toBe(graded);
    });
  });

  it('typing the let-down the prompt states reads every graded value within its tolerance', () => {
    const r = L.typedColdEnd(TYPED);
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
    const lab = L.capstoneValues();
    ADVANCED.forEach(([, key, graded, tol]) => {
      const shown = reads(r, key, PRINTED_DP[key]);
      expect(Math.abs(shown - graded), key).toBeLessThanOrEqual(tol);
      expect(Math.abs(shown - lab[key]), key).toBeLessThanOrEqual(tol);
      // eslint-disable-next-line no-console
      console.log(`${key}: prints ${r[key].toFixed(PRINTED_DP[key])} at ${PRINTED_DP[key]} dp, diff ${Math.abs(shown - graded)}`);
    });
    // The prompt's let-down sits below the water chart warning, and the view says so.
    expect(r.warnings).toEqual([]);
  });

  it('numbers typed as numbers read the same as numbers typed as strings', () => {
    const asNumbers = Object.fromEntries(Object.entries(TYPED).map(([k, v]) => [k, Number(v)]));
    const a = L.typedColdEnd(asNumbers);
    const b = L.typedColdEnd(TYPED);
    Object.keys(DB).forEach((k) => expect(a[k], k).toBe(b[k]));
  });
});

describe('the default state lands on no graded answer', () => {
  const targets = L.leakGuardTargets(FIELDS);

  it('the default is the teaching stream AGBADA and it is on the swept teaching surface', () => {
    ['p1Psia', 'tF', 'p2Psia', 'gasSg', 'cpBtuLbmolF'].forEach((k) => expect(L.TYPED_COLD_END_DEFAULT[k], k).toBe(L.AGBADA[k]));
    // Called bare, as the lab's leak gate calls every teaching reader.
    expect(L.typedColdEnd.length).toBe(0);
    expect(L.typedColdEnd()).toEqual(L.typedColdEnd(L.TYPED_COLD_END_DEFAULT));
  });

  it('no number the default state returns is within the leak guard of a graded answer', () => {
    const d = L.typedColdEnd();
    expect(d.ok).toBe(true);
    const numbers = L.collectNumbers(d);
    expect(numbers.length).toBeGreaterThan(10);
    const hits = numbers.map((x) => ({ x, t: L.leakGuardHit(x.value, targets) })).filter((h) => h.t)
      .map(({ x, t }) => `${x.path} = ${x.value} hits ${t.key} ${t.tag}`);
    expect(hits).toEqual([]);
    // And at ten grading bands, the spec's own fallback test, on the six keys.
    ADVANCED.forEach(([, key, graded, tol]) => {
      expect(Math.abs(d[key] - graded), key).toBeGreaterThan(10 * tol);
    });
  });

  it('the default is AGBADA above the water chart band, so the engine warning shows', () => {
    const d = L.typedColdEnd();
    expect(d.warnings.map((w) => w.source)).toContain('the water at the inlet');
  });
});

describe('NEGATIVE CONTROL: the test can fail', () => {
  it('one typed number changed and the graded values are no longer read', () => {
    const r = L.typedColdEnd({ ...TYPED, p2Psia: '415' });
    expect(r.ok).toBe(true);
    const missed = ADVANCED.filter(([, key, graded, tol]) => Math.abs(reads(r, key, PRINTED_DP[key]) - graded) > tol)
      .map(([, k]) => k);
    expect(missed).toEqual(expect.arrayContaining(['dropF', 't2F', 'waterOutLbMMscf']));
  });

  it('a heat capacity one tenth off moves the coefficient out of its band', () => {
    const r = L.typedColdEnd({ ...TYPED, cpBtuLbmolF: '10.3' });
    const [, , graded, tol] = ADVANCED.find(([, k]) => k === 'muFPerPsi');
    expect(Math.abs(reads(r, 'muFPerPsi', 12) - graded)).toBeGreaterThan(tol);
  });

  it('bad input is refused in plain words and never throws', () => {
    const blank = L.typedColdEnd({ ...TYPED, tF: '' });
    expect(blank.ok).toBe(false);
    expect(blank.errors.join(' ')).toMatch(/inlet temperature/);
    const backwards = L.typedColdEnd({ ...TYPED, p2Psia: '1200' });
    expect(backwards.ok).toBe(false);
    expect(backwards.errors[0]).toMatch(/march refuses/);
    expect(L.typedColdEnd(null).ok).toBe(false);
  });
});

describe('the typed view renders', () => {
  it('is listed in MODES', () => {
    expect(MODES.map(([m]) => m)).toContain('typed');
  });

  it('renders on its default with content and no NaN', () => {
    const html = renderToStaticMarkup(React.createElement(ColdEndExplorer, { initialMode: 'typed' }));
    expect(html).toContain('Compressibility at inlet');
    expect(html).toContain('Water the cold gas can hold');
    expect(html).toContain('Engine warning on');
    expect(html).toContain(L.typedColdEnd().dzdT.toFixed(12));
    expect(html).not.toContain('NaN');
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
  { name: 'skid', typed: TYPED, defaults: L.TYPED_COLD_END_DEFAULT, run: L.typedColdEnd },
];
const D2_KEYS = {"skid": ["p1Psia", "tF", "p2Psia", "gasSg", "cpBtuLbmolF"]};
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
