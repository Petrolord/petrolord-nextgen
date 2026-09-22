// THE D2 POLICY, PROVED RED AND GREEN.
//
// typedCaseGuard.js states the rule: a typed "your case" mode may reach the
// capstone when the learner types the case, but no DEFAULT state lands on a
// graded answer and no default or preset preloads the capstone case. Each rule
// is shown failing on a planted leak (the negative controls) and passing on an
// honest mode, so a green run of any course guard built on it means something.
//
// The toy engine below stands in for a lab function. Its capstone answer is
// computed by calling it, never restated, so the controls exercise the same
// path a course guard does.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as G from './typedCaseGuard.js';
import * as R from './rodpump/rodPumpLab.js';
import { waveInput } from '../../../../tools/course-waves/waveInputs.mjs';

// A toy lab: a mud and a depth give a pressure and a gradient.
const run = ({ mud, depthM }) => ({
  pressurePa: mud.densityKgM3 * 9.80665 * depthM,
  gradientPaPerM: mud.densityKgM3 * 9.80665,
  rows: [{ md: depthM, p: mud.densityKgM3 * 9.80665 * depthM }],
});
const CAPSTONE = Object.freeze({ mud: { densityKgM3: 1320 }, depthM: 2450 });
const TEACHING = [
  { name: 'published', inputs: { mud: { densityKgM3: 1200 }, depthM: 2000 } },
  { name: 'teaching', inputs: { mud: { densityKgM3: 1100 }, depthM: 3000 } },
];
const KEYS = ['mud.densityKgM3', 'depthM'];
const GRADED = [
  ['beginner', 'bhp_pa', run(CAPSTONE).pressurePa, 0.5],
  ['beginner', 'gradient_pa_per_m', run(CAPSTONE).gradientPaPerM, 1e-6],
];
const targets = G.leakTargets(GRADED);

describe('the guard is built from the graded fields and their ABSOLUTE tolerances', () => {
  it('one target per field per shifting, at ten grading bands', () => {
    expect(targets).toHaveLength(GRADED.length * G.DEFAULT_SHIFTS.length);
    const t = targets.find((x) => x.key === 'bhp_pa' && x.tag === 'as graded');
    expect(t.gradingBand).toBe(0.5);
    expect(t.band).toBe(5);
    expect(targets.find((x) => x.key === 'bhp_pa' && x.tag === 'x1000').band).toBe(5000);
    expect(targets.find((x) => x.key === 'bhp_pa' && x.tag === 'psig from psia').band).toBe(5);
  });

  it('accepts fields.json rows and objects alike, and drops string answers', () => {
    const mixed = [...GRADED, { tier: 'beginner', key: 'verdict', value: 'helical', tol: 0 }];
    expect(G.normaliseFields(mixed)).toHaveLength(2);
    expect(G.leakTargets(GRADED.map(([tier, key, value, tol]) => ({ tier, key, value, tol })))).toEqual(targets);
  });

  it('the distinguishing keys really distinguish the capstone from every teaching case', () => {
    expect(G.distinguishingKeyProblems({ capstone: CAPSTONE, teachingCases: TEACHING, keys: KEYS })).toEqual([]);
    // NEGATIVE CONTROL: a key a teaching case shares, and a key the capstone lacks
    const shared = [...TEACHING, { name: 'twin', inputs: { mud: { densityKgM3: 1320 }, depthM: 10 } }];
    expect(G.distinguishingKeyProblems({ capstone: CAPSTONE, teachingCases: shared, keys: KEYS }))
      .toEqual(['mud.densityKgM3 = 1320 is shared by the teaching case twin']);
    expect(G.distinguishingKeyProblems({ capstone: CAPSTONE, teachingCases: TEACHING, keys: ['nope'] }))
      .toEqual(['nope is not an input of the capstone case']);
  });
});

describe('RULE 1: no default state lands on a graded answer', () => {
  it('GREEN: a typed mode whose default is a teaching case', () => {
    expect(G.defaultStateHits({ targets, modes: [{ name: 'yourCase', defaults: TEACHING[0].inputs, run }] })).toEqual([]);
  });

  it('NEGATIVE CONTROL: a default that IS the capstone case is caught, in every output it reaches', () => {
    const hits = G.defaultStateHits({ targets, modes: [{ name: 'yourCase', defaults: CAPSTONE, run }] });
    expect(hits.some((h) => h.startsWith('yourCase.default.pressurePa ='))).toBe(true);
    expect(hits.some((h) => h.startsWith('yourCase.default.gradientPaPerM ='))).toBe(true);
    // the deep walk reaches a table row, not only the top-level cards
    expect(hits.some((h) => h.startsWith('yourCase.default.rows[0].p ='))).toBe(true);
  });

  it('NEGATIVE CONTROL: a default that lands on an answer by COINCIDENCE is caught too', () => {
    // a different mud and depth whose product is the graded pressure to within 9 bands
    const bhp = GRADED[0][2];
    const coincident = { mud: { densityKgM3: 1000 }, depthM: (bhp + 4) / (1000 * 9.80665) };
    const hits = G.defaultStateHits({ targets, modes: [{ name: 'yourCase', defaults: coincident, run }] });
    expect(hits.some((h) => h.includes('beginner/bhp_pa (as graded)'))).toBe(true);
    // and rule 2 alone would have missed it, which is why both rules exist
    expect(G.preloadHits({ capstone: CAPSTONE, bundles: [{ name: 'default', inputs: coincident }], keys: KEYS })).toEqual([]);
  });

  it('NEGATIVE CONTROL: a unit-shifted default is caught (kPa printed for Pa)', () => {
    const kpa = (inp) => ({ pressureKPa: run(inp).pressurePa / 1000 });
    expect(G.defaultStateHits({ targets, modes: [{ name: 'kpa', defaults: CAPSTONE, run: kpa }] })).not.toEqual([]);
  });

  it('IS NOT TRIGGER HAPPY: zero, NaN and Infinity never hit', () => {
    [0, NaN, Infinity, -Infinity, undefined, 'x'].forEach((v) => expect(G.leakGuardHit(targets, v)).toBeNull());
  });
});

describe('RULE 2: no default and no preset preloads the capstone case (preload detection kept)', () => {
  it('GREEN: defaults and presets built on teaching cases', () => {
    expect(G.preloadHits({ capstone: CAPSTONE, bundles: TEACHING, keys: KEYS })).toEqual([]);
  });

  it('NEGATIVE CONTROL: a preset carrying the capstone depth is caught though its outputs collide with nothing', () => {
    const preset = { name: 'preset:heavy', inputs: { mud: { densityKgM3: 1100 }, depthM: 2450 } };
    expect(G.defaultStateHits({ targets, modes: [{ name: 'heavy', defaults: preset.inputs, run }] })).toEqual([]);
    expect(G.preloadHits({ capstone: CAPSTONE, bundles: [...TEACHING, preset], keys: KEYS }))
      .toEqual(['preset:heavy preloads the capstone\'s depthM = 2450']);
  });

  it('NEGATIVE CONTROL: a renamed input is still compared through the key map', () => {
    const flat = { name: 'default', inputs: { mudKgM3: 1320, depthM: 900 } };
    expect(G.preloadHits({ capstone: CAPSTONE, bundles: [flat], keys: KEYS, map: { 'mud.densityKgM3': 'mudKgM3' } }))
      .toHaveLength(1);
  });

  it('a float that differs only in the last bit is the same input', () => {
    expect(G.preloadedInputs({ capstone: { x: 0.1 + 0.2 }, bundle: { x: 0.3 }, keys: ['x'] })).toEqual(['x']);
    expect(G.preloadedInputs({ capstone: { x: 0.3 }, bundle: { x: 0.30001 }, keys: ['x'] })).toEqual([]);
  });
});

describe('THE CHANGE: typing the capstone case is now allowed, and it is the route', () => {
  it('the typed capstone reads the graded answer at the print precision', () => {
    const [, key, expected, tol] = GRADED[0];
    expect(G.typedRouteMiss({ run, typed: CAPSTONE, read: (o) => o.pressurePa, dp: 3, expected, tol, key })).toBeNull();
  });

  it('under the OLD rule that same reach was a failure; under the new one it is not swept', () => {
    // The old rule swept every value a panel could reach. Typed input can reach
    // the capstone, so the old sweep, applied to the typed capstone, fails:
    expect(G.defaultStateHits({ targets, modes: [{ name: 'typed', defaults: CAPSTONE, run }] })).not.toEqual([]);
    // The new rule sweeps the DEFAULT only, which here is a teaching case:
    expect(G.defaultStateHits({ targets, modes: [{ name: 'typed', defaults: TEACHING[1].inputs, run }] })).toEqual([]);
  });

  it('NEGATIVE CONTROL: a mode that prints too coarsely has no route, and says so', () => {
    const [, key, expected] = GRADED[1];
    const miss = G.typedRouteMiss({ run, typed: CAPSTONE, read: (o) => o.gradientPaPerM, dp: 2, expected, tol: 1e-6, key });
    expect(miss).toMatch(/gradient_pa_per_m: typed case prints/);
  });
});

describe('RULE 3: the naming rule and the literal sweep are unchanged', () => {
  it('NEGATIVE CONTROL: a capstone reader named in a source is found', () => {
    expect(G.capstoneNamesIn("import { capstoneValues, CAPSTONE_FANN } from './hydraulicsLab.js';").sort())
      .toEqual(['CAPSTONE_FANN', 'capstoneValues']);
    expect(G.capstoneNamesIn("import { rheologyRows, caseOf } from './hydraulicsLab.js';")).toEqual([]);
  });

  it('NEGATIVE CONTROL: a graded answer written as a literal is found at nine digits and at full precision', () => {
    const v = GRADED[0][2];
    expect(G.gradedLiteralsIn(`const x = ${v.toPrecision(9)};`, GRADED)).toHaveLength(1);
    expect(G.gradedLiteralsIn(`const x = ${String(v)};`, GRADED)).toHaveLength(1);
    expect(G.gradedLiteralsIn('const w = 1.5; const sg = 1.02;', GRADED)).toEqual([]);
  });
});

describe('the policy on a live course: the rod pump typed string view (W1)', () => {
  // The first typed mode in the Academy, built in W1 under this same decision.
  // Running it through the shared rules reproduces what its own guard proves.
  const fields = JSON.parse(fs.readFileSync(waveInput('rodpump', 'fields.json'), 'utf8'));
  const live = G.leakTargets(fields);

  it('its default state is silent', () => {
    expect(G.defaultStateHits({
      targets: live,
      modes: [{ name: 'typedString', defaults: R.TYPED_STRING_DEFAULT, run: R.typedStringNote }],
    })).toEqual([]);
  });

  it('and typing the stated string reaches the graded natural frequency at its 12 dp print', () => {
    const [, key, expected, tol] = fields.find(([, k]) => k === 'string_natural_freq_spm');
    expect(G.typedRouteMiss({
      run: R.typedStringNote,
      typed: [{ size: '1', lengthFt: 1825 }, { size: '7/8', lengthFt: 2140 }, { size: '3/4', lengthFt: 2120 }],
      read: (o) => o.engineScanSpm,
      dp: 12,
      expected,
      tol,
      key,
    })).toBeNull();
  });
});
