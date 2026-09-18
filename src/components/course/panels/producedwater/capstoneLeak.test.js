// THE FC7 CAPSTONE GUARD. Nothing on the teaching side may carry a graded answer.
//
// WHERE ITS INPUTS COME FROM. The committed copies under tools/course-waves,
// through waveInputs.mjs, so this suite runs anywhere, CI included. NO /root
// PATH APPEARS IN THIS FILE. Point it at a live wave directory mid-build with
// NEXTGEN_WAVE_DIR_PRODUCEDWATER. A MISSING INPUT THROWS AND NAMES ITSELF: there
// is no existsSync guard here, no early return inside a forEach and no skipIf,
// because a gate that empties itself when its subject is missing reports success
// without examining anything, which is this programme's most repeated defect.
//
// WHY IT SEARCHES MORE THAN ONE RENDERING. FC1's guard string-matched graded
// answers at NINE SIGNIFICANT DIGITS only. Planting 2.88817656 was caught;
// planting the same value at full float precision, 2.8881765597102644, walked
// straight past it and was caught only by a numeric sweep. This engine returns
// Reynolds numbers, cut sizes and droplet medians at full precision through
// several coupled devices, so the full float shape is the likely one here. BOTH
// shapes are planted below and both must be caught.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import {
  GRADED_FIELDS, PRINTED_DECIMALS, gradedTolerance, gradedClassOf, printedFloor, renderings,
} from './gradedTolerance.js';

const WAVE = 'producedwater';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');

/**
 * THE FILES THIS GUARD SWEEPS, DECLARED. The set is asserted, so a panel added
 * without being listed fails, a panel renamed fails, and the guard can never
 * quietly sweep nothing. When the explorers land, add them here.
 */
const SWEPT = ['DeviceExplorer.jsx', 'TrainExplorer.jsx', 'WaterExplorer.jsx',
  'gradedTolerance.js', 'producedWaterLab.js'];

/**
 * THE THREE EXPLORERS. The engine import rule below is scoped to these, because
 * the LAB is the one file in this directory that is allowed to import an engine
 * and is the reason the panels never have to: everything a panel shows comes
 * through the lab, so every number a learner sees has been through a gate.
 */
const PANEL_FILES = ['DeviceExplorer.jsx', 'TrainExplorer.jsx', 'WaterExplorer.jsx'];

const sources = fs.readdirSync(HERE)
  .filter((f) => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('.test.'))
  .sort();

/** Every numeric literal in a text, as numbers. */
const numbers = (text) => [...text.matchAll(/(?<![\w.])\d+\.\d+(?:e[-+]?\d+)?/g)].map((m) => Number(m[0]));

describe('FC7 graded tolerances live in one place', () => {
  it('declares eighteen fields, six a tier, and fields.json agrees with all of them', () => {
    expect(GRADED_FIELDS).toHaveLength(18);
    expect(FIELDS).toHaveLength(18);
    ['beginner', 'intermediate', 'advanced'].forEach((tier) => {
      expect(GRADED_FIELDS.filter(([t]) => t === tier)).toHaveLength(6);
    });
    FIELDS.forEach(([tier, key, value, tol]) => {
      const declared = gradedClassOf(key);
      expect(declared.tier, `${key} tier`).toBe(tier);
      expect(tol, `${key} tolerance`).toBe(gradedTolerance(key));
      expect(Number.isFinite(value), `${key} value`).toBe(true);
    });
  });

  it('every tolerance is the MAX of the stated figure and the printed floor, never the min', () => {
    GRADED_FIELDS.forEach(([, key, cls, stated]) => {
      const tol = gradedTolerance(key);
      expect(tol).toBe(Math.max(stated, printedFloor(cls)));
      expect(tol).toBeGreaterThanOrEqual(stated);
      expect(tol).toBeGreaterThanOrEqual(printedFloor(cls));
    });
  });

  it('every graded answer survives being quoted at the precision the digest prints its class to', () => {
    FIELDS.forEach(([tier, key, value, tol]) => {
      const dp = PRINTED_DECIMALS[gradedClassOf(key).cls];
      const asQuoted = Number(value.toFixed(dp));
      expect(Math.abs(asQuoted - value), `${tier}/${key} cannot be answered at ${dp} decimals`).toBeLessThanOrEqual(tol);
    });
  });
});

describe('FC7 capstone answers do not reach the teaching digest', () => {
  it('reads a real digest, so this suite cannot pass on an empty file', () => {
    expect(DIGEST.split('\n').length).toBeGreaterThan(500);
    expect(DIGEST).toContain('# SECTION 1:');
    expect(DIGEST).toContain('# SECTION 22:');
  });

  it('the committed mirror is the default read, and it is the directory named here', () => {
    expect(mirrorDir(WAVE).endsWith(path.join('tools', 'course-waves', WAVE))).toBe(true);
    expect(waveInput(WAVE, 'digest.txt')).toContain(WAVE);
  });

  it('names no capstone stream', () => {
    ['OGULAGHA', 'IZOMBE', 'TUNU'].forEach((stream) => {
      expect(DIGEST.toUpperCase(), `the digest names ${stream}`).not.toContain(stream);
    });
  });

  it('prints no graded answer, at any of the five renderings', () => {
    const hits = [];
    FIELDS.forEach(([tier, key, value]) => {
      renderings(value, gradedClassOf(key).cls).forEach((shape) => {
        if (DIGEST.includes(shape)) hits.push(`${tier}/${key} as ${shape}`);
      });
    });
    expect(hits).toEqual([]);
  });

  it('carries no number within tolerance of a graded answer, which is the sweep a rendering cannot fool', () => {
    const digestNumbers = numbers(DIGEST);
    expect(digestNumbers.length).toBeGreaterThan(500);
    const hits = [];
    FIELDS.forEach(([tier, key, value, tol]) => {
      digestNumbers.forEach((x) => {
        if (Math.abs(x - value) <= tol) hits.push(`${tier}/${key} is within ${tol} of ${x}`);
      });
    });
    expect(hits).toEqual([]);
  });

  it('NEGATIVE CONTROL: a graded answer at NINE SIGNIFICANT DIGITS is caught', () => {
    const [tier, key, value] = FIELDS[8];
    const planted = `a line of prose carrying ${value.toPrecision(9)} micron`;
    const shapes = renderings(value, gradedClassOf(key).cls).filter((s) => planted.includes(s));
    expect(shapes.length, `${tier}/${key} at nine significant digits was not caught`).toBeGreaterThan(0);
  });

  it('NEGATIVE CONTROL: the SAME answer at FULL FLOAT PRECISION is caught, which is the shape FC1 missed', () => {
    const [tier, key, value] = FIELDS[8];
    const planted = `a line of prose carrying ${String(value)} micron`;
    const nineOnly = planted.includes(value.toPrecision(9));
    const shapes = renderings(value, gradedClassOf(key).cls).filter((s) => planted.includes(s));
    expect(shapes, `${tier}/${key} at full float precision was not caught`).toContain(String(value));
    // and the numeric sweep sees it too, whatever the rendering
    expect(numbers(planted).some((x) => Math.abs(x - value) <= gradedTolerance(key))).toBe(true);
    expect(typeof nineOnly).toBe('boolean');
  });

  it('NEGATIVE CONTROL: a value inside tolerance but at no recognisable rendering is caught by the numeric sweep alone', () => {
    const [, key, value] = FIELDS[8];
    const tol = gradedTolerance(key);
    // DOWNWARD, by nine tenths of the tolerance. Nudging UP leaves the six
    // decimal rendering as a PREFIX of the planted digits, so the string sweep
    // catches it and the control proves the wrong thing. Down, the sixth decimal
    // rounds the other way and no rendering matches, which is exactly the case
    // only the numeric sweep can see.
    const nudged = value - tol * 0.9;
    // Written in scientific notation on purpose. Printed as a decimal, the
    // nudged value CONTAINS the six decimal rendering as a prefix, so the string
    // sweep would catch it and the control would be proving the wrong thing.
    const planted = `a line of prose carrying ${nudged.toExponential(9)} micron`;
    expect(renderings(value, gradedClassOf(key).cls).filter((s) => planted.includes(s))).toEqual([]);
    expect(numbers(planted).some((x) => Math.abs(x - value) <= tol)).toBe(true);
  });
});

describe('FC7 panel sources do not reach the capstone', () => {
  it('sweeps exactly the files it declares, so a rename cannot empty this gate', () => {
    expect(sources).toEqual(SWEPT);
    sources.forEach((f) => {
      expect(fs.readFileSync(path.join(HERE, f), 'utf8').length, f).toBeGreaterThan(500);
    });
  });

  sourcesOrFail().forEach((file) => {
    const text = fs.readFileSync(path.join(HERE, file), 'utf8');
    it(`${file} prints no graded answer and names no capstone stream`, () => {
      const hits = [];
      FIELDS.forEach(([tier, key, value]) => {
        renderings(value, gradedClassOf(key).cls).forEach((shape) => {
          if (text.includes(shape)) hits.push(`${tier}/${key} as ${shape}`);
        });
      });
      numbers(text).forEach((x) => {
        FIELDS.forEach(([tier, key, value, tol]) => {
          if (Math.abs(x - value) <= tol) hits.push(`${tier}/${key} numerically as ${x}`);
        });
      });
      expect(hits).toEqual([]);
      // THE STREAM NAMES ARE CHECKED OUTSIDE THE GRADED FIELD KEYS. Every graded
      // key begins with its own stream name, and gradedTolerance.js has to spell
      // all eighteen of them: it is the grader. What this forbids is naming a
      // capstone stream anywhere ELSE, in a label, a comment or a condition.
      const withoutKeys = FIELDS.reduce((t, [, key]) => t.split(key).join('KEY'), text).toUpperCase();
      ['OGULAGHA', 'IZOMBE', 'TUNU'].forEach((stream) => {
        expect(withoutKeys, `${file} names the capstone stream ${stream} outside a graded field key`).not.toContain(stream);
      });
    });

    it(`${file} carries no em dash, no en dash and reads no clock`, () => {
      expect(text).not.toMatch(/[\u2013\u2014]/);
      expect(text).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });

    it(`${file} imports an engine only if it is the lab`, () => {
      // A PANEL NEVER IMPORTS AN ENGINE. The lab does, once, and it is the only
      // route by which a number reaches a panel at all.
      const isPanel = PANEL_FILES.includes(file);
      const importsEngine = /@petrolord\/engines/.test(text);
      if (isPanel) {
        expect(importsEngine, `${file} imports an engine directly`).toBe(false);
        expect(text, `${file} does not read the lab`).toMatch(/producedWaterLab/);
      } else if (file === 'producedWaterLab.js') {
        expect(importsEngine, 'the lab no longer reads the vendored engine').toBe(true);
      } else {
        expect(importsEngine, `${file} imports an engine and is not the lab`).toBe(false);
      }
    });
  });
});

/**
 * The file list, or a failure. A `forEach` over an empty array registers no
 * tests at all and the suite then reports success having examined nothing, so
 * this throws instead of returning an empty list.
 */
function sourcesOrFail() {
  if (!sources.length) {
    throw new Error('[fc7] no panel source files found beside this suite, so there is nothing to sweep and this is a failure rather than a pass');
  }
  return sources;
}
