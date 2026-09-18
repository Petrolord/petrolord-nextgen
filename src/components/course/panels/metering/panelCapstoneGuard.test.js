// A PANEL MAY NOT REACH INTO THE CAPSTONE, AT ANY PRECISION.
//
// The lab's own gates check what the lab RETURNS. They say nothing about what a
// panel or the course page PRINTS, and those three files import the lab
// directly. So the guard is on the SOURCES: the four panel files, the teaching
// lab and the course page, all six of them swept for the eighteen graded
// answers and for anything that names the capstone.
//
// THE MATCHER IS NUMERIC AND RENDERING AGNOSTIC. A sibling wave's guard held
// ONE canonical rendering per answer, `toPrecision(9)`, and the same value
// written by `String()` or interpolated into JSX walked straight past it: nine
// of that wave's eighteen graded fields were reachable that way. The more
// precise leak is the more damaging one, because a reader then has the answer
// to MORE digits than the course asks for.
//
// SO EVERY ANSWER IS PLANTED IN FOUR SHAPES and the guard is required to catch
// all four:
//
//   1. nine significant digits, which is the rendering the broken guard held
//   2. FULL FLOAT PRECISION, which is what String() and JSX interpolation give
//   3. seventeen significant digits, the widest a double round-trips through
//   4. the class's own printed precision, which is what the course tells a
//      learner to quote and therefore the shape a well meaning panel would use
//
// The literal's own precision is what decides a hit: a literal counts when it
// is a graded answer correctly rounded to that literal's own number of
// significant digits. That catches every truncation between four and
// twenty one without anybody keeping a list of renderings complete.
//
// SIX SIGNIFICANT DIGITS IS A FLOOR rather than a threshold: below it an honest
// constant collides by arithmetic coincidence rather than by leaking anything.
// Shape 4 is therefore checked against the FIELDS THAT PRINT TO SIX DECIMALS
// and above, where the rendering carries at least six significant digits, and
// the fields where it does not are named rather than skipped in silence.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';
import { GRADED_FIELDS, PRINTED_DECIMALS, gradedClassOf } from './gradedTolerance.js';
import * as LAB from './meteringLab.js';

const WAVE_NAME = 'metering';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const COURSE_PAGE = path.resolve(HERE, '../../../../pages/apps/MeteringLearningPage.jsx');

const PANEL_FILES = [
  'MeterRunExplorer.jsx', 'ChokingExplorer.jsx', 'VentingExplorer.jsx', 'WithheldExplorer.jsx',
];

const sources = [
  ...PANEL_FILES.map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') })),
  { file: 'meteringLab.js', text: fs.readFileSync(path.join(HERE, 'meteringLab.js'), 'utf8') },
  { file: 'MeteringLearningPage.jsx', text: fs.readFileSync(COURSE_PAGE, 'utf8') },
];

const DECIMAL_LITERAL = /\d+\.\d+(?:[eE][-+]?\d+)?/g;
const SIG_FLOOR = 6;
const significantDigits = (lit) => {
  const mantissa = lit.split(/[eE]/)[0].replace('.', '').replace(/^0+/, '');
  return mantissa.replace(/0+$/, '').length || 1;
};

/** Every graded answer a text prints, at any precision, with the evidence. */
const gradedAnswersPrintedIn = (text) => {
  const hits = [];
  const literals = text.match(DECIMAL_LITERAL) || [];
  FIELDS.forEach(([tier, key, value]) => {
    literals.forEach((lit) => {
      const sig = significantDigits(lit);
      if (sig < SIG_FLOOR || sig > 21) return;
      if (Number(lit) === Number(Math.abs(value).toPrecision(sig))) {
        hits.push(`${lit} is ${tier}/${key} to ${sig} significant digits`);
      }
    });
  });
  return [...new Set(hits)];
};

/** The four shapes a graded answer can reach a source in. */
const SHAPES = [
  ['nine significant digits', (v) => v.toPrecision(9)],
  ['full float precision', (v) => String(v)],
  ['seventeen significant digits', (v) => v.toPrecision(17)],
  ['the precision the course prints this class to', (v, cls) => v.toFixed(PRINTED_DECIMALS[cls])],
];

describe('FC8 metering: the panel guard has subjects', () => {
  it('every gated source is on disk and is a real file, so a rename cannot empty this gate', () => {
    expect(sources.map((s) => s.file).sort()).toEqual([
      'ChokingExplorer.jsx', 'MeterRunExplorer.jsx', 'MeteringLearningPage.jsx',
      'VentingExplorer.jsx', 'WithheldExplorer.jsx', 'meteringLab.js',
    ]);
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
    expect(FIELDS).toHaveLength(18);
  });

  it('the four panel ids the course declares all resolve to a file in this directory', () => {
    const registry = fs.readFileSync(
      path.resolve(HERE, '../../../../content/courses/panelRegistry.js'), 'utf8',
    );
    const declared = [
      ['fc-meterrun-explorer', 'MeterRunExplorer'],
      ['fc-choking-explorer', 'ChokingExplorer'],
      ['fc-venting-explorer', 'VentingExplorer'],
      ['fc-withheld-explorer', 'WithheldExplorer'],
    ];
    declared.forEach(([id, component]) => {
      expect(registry, `${id} is not in the panel registry`).toContain(`'${id}'`);
      expect(registry, `${id} does not point at ${component}`).toContain(`metering/${component}'`);
      expect(fs.existsSync(path.join(HERE, `${component}.jsx`)), `${component}.jsx is missing`).toBe(true);
    });
  });

  it('every panel id the course content references is one of those four', () => {
    const contentDir = path.resolve(HERE, '../../../../content/courses/metering');
    const found = new Set();
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      const text = fs.readFileSync(p, 'utf8');
      [...text.matchAll(/fc-[a-z]+-explorer/g)].forEach((m) => found.add(m[0]));
      return undefined;
    });
    walk(contentDir);
    expect([...found].sort()).toEqual([
      'fc-choking-explorer', 'fc-meterrun-explorer', 'fc-venting-explorer', 'fc-withheld-explorer',
    ]);
  });
});

describe('FC8 metering: the graded answer matcher, proved in FOUR shapes', () => {
  it('NEGATIVE CONTROL: every one of the eighteen answers is caught in every shape it can carry', () => {
    const skipped = [];
    let planted = 0;
    FIELDS.forEach(([tier, key, value]) => {
      const { cls } = gradedClassOf(key);
      SHAPES.forEach(([shapeName, render]) => {
        const rendered = render(value, cls);
        if (significantDigits(rendered) < SIG_FLOOR) {
          // Named rather than silently skipped. A rendering that carries fewer
          // than six significant digits is below the collision floor, so the
          // matcher deliberately does not chase it, and saying so here is what
          // stops that being mistaken for a caught plant.
          skipped.push(`${tier}/${key} in ${shapeName} renders ${rendered}, below the floor`);
          return;
        }
        const line = `const x = ${rendered};`;
        expect(
          gradedAnswersPrintedIn(line),
          `${tier}/${key} planted in ${shapeName} as ${rendered} walked through the guard`,
        ).not.toEqual([]);
        planted += 1;
      });
    });
    // eslint-disable-next-line no-console
    if (skipped.length) console.log('  FC8 renderings below the collision floor:', skipped.join(' | '));
    expect(planted, 'the guard was proved on too few plants to mean anything').toBeGreaterThanOrEqual(18 * 3);
  });

  it('NEGATIVE CONTROL: a plant inside real JSX, not only on a bare line, is caught', () => {
    // How a leak would actually look: interpolated into a tile, into a table
    // cell and into a chart reference line, rather than assigned to a constant.
    FIELDS.forEach(([tier, key, value]) => {
      const shapes = [
        `<Tile label="Answer" value={${String(value)}} />`,
        `rows={[['the answer', '${value.toPrecision(9)}']]}`,
        `<ReferenceLine x={${value.toPrecision(17)}} stroke="#f472b6" />`,
        `  the capstone answer is ${String(value)} at this condition`,
      ];
      shapes.forEach((line) => {
        expect(gradedAnswersPrintedIn(line), `${tier}/${key} leaked through JSX: ${line}`).not.toEqual([]);
      });
    });
  });

  it('CONTROL: an honest constant of fewer than six significant digits is not a hit', () => {
    [
      'const w = 1.5;', 'const p = 0.25;', 'strokeWidth={1.5}', 'const sg = 1.02;',
      'padding: 0.75rem', 'const beta = 0.75;', 'fontSize: 10.5', 'const third = 0.6666;',
    ].forEach((line) => expect(gradedAnswersPrintedIn(line), line).toEqual([]));
  });

  it('CONTROL: the teaching facilities are not graded answers, so the guard is not simply red everywhere', () => {
    const teaching = [LAB.ABOH, LAB.BELEMA, LAB.BELEMA_GAS, LAB.OGBOGENE, LAB.INCH_PROBE_B]
      .flatMap((o) => Object.values(o))
      .filter((v) => typeof v === 'number');
    expect(teaching.length).toBeGreaterThan(25);
    teaching.forEach((v) => {
      expect(gradedAnswersPrintedIn(`const x = ${String(v)};`), `${v} collided with a graded answer`).toEqual([]);
    });
  });
});

describe('FC8 metering: no source reaches into the capstone', () => {
  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers, at ANY precision`, () => {
      expect(gradedAnswersPrintedIn(text), `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} names no capstone facility and no graded field key`, () => {
      const plants = [...text.matchAll(/(?:krakama|utonana|saghara)\w*/gi)].map((m) => m[0]);
      expect([...new Set(plants)], `${file} names a capstone facility`).toEqual([]);
      GRADED_FIELDS.forEach(([, key]) => {
        expect(text.includes(key), `${file} names the graded field ${key}`).toBe(false);
      });
    });

    it(`${file} holds no second copy of a tolerance`, () => {
      // The tolerances are derived once, in gradedTolerance.js. Nothing that a
      // learner can see may import that derivation or restate one of its
      // numbers, because a mirror is a copy that goes stale without failing.
      // Comments are stripped first: the lab's header POINTS AT the single
      // derivation on purpose, so a reader knows where the tolerances live,
      // and a gate that failed on that sentence would push the pointer out of
      // the file it belongs in. What may not be here is the import.
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code, `${file} imports the tolerance derivation`).not.toMatch(/gradedTolerance/);
      FIELDS.forEach(([, key, , tol]) => {
        expect(text.includes(String(tol)) && text.includes(key), `${file} restates ${key}'s tolerance`).toBe(false);
      });
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });
  });

  it('NEGATIVE CONTROL: the capstone-name grep finds a plant when one is put in front of it', () => {
    const planted = 'const answer = saghara_inbreathing_scfh;';
    expect([...planted.matchAll(/(?:krakama|utonana|saghara)\w*/gi)].map((m) => m[0]))
      .toEqual(['saghara_inbreathing_scfh']);
    expect(GRADED_FIELDS.some(([, key]) => planted.includes(key))).toBe(true);
  });
});
