// A PANEL, A LESSON OR THE LEARNING PAGE MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5a re-cased this course (FOLLOW-ON-PROGRAMME.md section 3, pick A). The
// Ekene SAND is the teaching case: the panels open on it and the lessons work
// it. Each capstone tier grades the UQUO case instead, which the brief states
// and the learner types into the tier's panel. That is the first half of the
// guarantee, and it is a design decision: rockphysicsTeaching.js carries no
// capstone case and the case lives only in
// tools/course-waves/w5/rockphysics/fields.mjs, which nothing under src/
// imports except the tests.
//
// The second half is this file, and it is the half that can fail. Two cases
// can differ in every input and still land on the same number, and the grader
// does not care which case produced a figure. So the gate is arithmetic: it
// takes the graded field list, builds a forbidden neighbourhood around every
// answer, and checks every number the teaching functions give at the panels'
// opening states, every number in the panel sources and the learning page, and
// every number in every lesson of the course against all of them.
//
// THE THRESHOLD IS THE GRADER'S OWN AND IT IS ABSOLUTE. academy_submit_capstone
// passes a field when abs(answer - expected) <= tol, so tol is a band in the
// field's own units. The forbidden band is TEN times that.
//
// UNIT RESTATEMENTS. A number restated in another unit is the same answer, so
// each field is also checked where its unit is commonly restated: a GPa figure
// as MPa (x1000), an MPa figure as GPa (x0.001), a density as g/cc (x0.001),
// a velocity as km/s (x0.001). The band travels with the value. Dimensionless
// ratios are checked as graded only: shifting a 0.05 coefficient by a thousand
// would forbid every "40 degrees" in the course and prove nothing.
//
// THE INTEGER FIELD (tuning thickness, tol 0) is an exact sample count, and
// small integers are everywhere in prose and in SVG layout, so it is not swept
// numerically. What would leak it is the tuning at the capstone frequency, so
// the gate checks that no panel opens on that frequency, that the teaching
// defaults never give that tuning, and that no lesson names the frequency.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FluidExplorer from './FluidExplorer';
import SubstitutionExplorer from './SubstitutionExplorer';
import AvoExplorer from './AvoExplorer';
import * as L from '@/lib/rockphysicsTeaching';
import {
  capstoneFields, BEGINNER, INTERMEDIATE, ADVANCED, advancedGasTwin,
} from '../../../../../tools/course-waves/w5/rockphysics/fields.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..', '..', '..');
const FIELDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/w5/rockphysics/fields.json'), 'utf8'));
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/graded-field-audit/w5/rockphysics.json'), 'utf8'));
const LESSONS = path.join(ROOT, 'src/content/courses/rockphysics');
const PAGE = path.join(ROOT, 'src/pages/apps/RockPhysicsLearningPage.jsx');

/** The capstone case's name, assembled so the literal is in no source grep either. */
const CASE_NAME = ['UQ', 'UO'].join('');

export const LEAK_GUARD_MARGIN = 10;
const RESTATE = {
  GPa: [1, 1000],
  MPa: [1, 0.001],
  'kg/m3': [1, 0.001],
  'm/s': [1, 0.001],
  ratio: [1],
};
const NUMBER = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

const swept = FIELDS.filter((f) => f.tol > 0);
const targets = swept.flatMap((f) => (RESTATE[f.unit] || [1]).map((factor) => ({
  tier: f.tier, key: f.key, factor, value: f.expected * factor, band: LEAK_GUARD_MARGIN * f.tol * factor,
})));
const hit = (x) => (Number.isFinite(x) ? targets.find((t) => Math.abs(x - t.value) <= t.band) || null : null);

/**
 * Every scalar an engine result carries, as held (SI) and as the panels print
 * moduli (MPa, GPa). Arrays are the plotted curves (reflection per degree, the
 * wedge amplitudes, the thickness grid): they are drawn, not printed, so they
 * are left to the rendered-text sweep below.
 */
function leaves(obj, out = [], where = '') {
  if (typeof obj === 'number') {
    out.push({ where, value: obj }, { where: `${where} / 1e6`, value: obj / 1e6 }, { where: `${where} / 1e9`, value: obj / 1e9 });
  } else if (Array.isArray(obj)) {
    // plotted, not printed
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, v]) => leaves(v, out, where ? `${where}.${k}` : k));
  }
  return out;
}

/** What the panels and the learning page show before the learner types anything, plus every select and button. */
function openingStates() {
  const out = [];
  [L.TEACHING_SW, 1, 0.5, 0.2].forEach((sw) => leaves(L.computeFluids(sw), out, `computeFluids(${sw})`));
  leaves(L.computeSubstitution(), out, 'computeSubstitution()');
  leaves(L.computeSubstitutionAt(0), out, 'computeSubstitutionAt(0)');
  leaves(L.computeShearEstimate(3000), out, 'computeShearEstimate(3000)');
  L.FREQ_OPTIONS.forEach((f) => leaves(L.computeAvoScreen(f), out, `computeAvoScreen(${f})`));
  L.CLASS_THRESHOLDS.forEach((th) => leaves(L.computeAvoDetail(L.TEACHING_FREQ_HZ, th), out, `computeAvoDetail(${th})`));
  // the AVO explorer's typed mode starts from the Ekene interface to 0.1
  const r1 = (v) => Math.round(v * 10) / 10;
  const ek = L.ekeneInterface();
  const typed = Object.fromEntries(Object.entries(ek).map(([k, v]) => [k, { vp: r1(v.vp), vs: r1(v.vs), rho: r1(v.rho) }]));
  leaves(L.computeAvoDetail(L.TEACHING_FREQ_HZ, 0.02, typed), out, 'AvoExplorer typed mode, opening values');
  return out;
}

function lessonFiles(dir = LESSONS) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return lessonFiles(p);
    return e.name.endsWith('.md') ? [p] : [];
  });
}
const panelSources = () => fs.readdirSync(HERE).filter((f) => f.endsWith('.jsx') && !f.includes('.test.')).map((f) => path.join(HERE, f));

function scan(files) {
  const hits = [];
  files.forEach((file) => {
    fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      (line.match(NUMBER) || []).forEach((tok) => {
        const t = hit(Number(tok));
        if (t) hits.push(`${path.relative(ROOT, file)}:${i + 1} prints ${tok}, inside ${t.tier}/${t.key} (x${t.factor})`);
      });
    });
  });
  return hits;
}

describe('the graded keys are the engine\'s', () => {
  it('fields.json is exactly what the vendored engine returns for the UQUO case', () => {
    expect(capstoneFields()).toEqual(FIELDS);
  });

  it('carries nineteen fields over three tiers, the W1 Shuey error kept on the new case', () => {
    expect(FIELDS).toHaveLength(19);
    expect(FIELDS.filter((f) => f.tier === 'advanced').map((f) => f.key)).toContain('uquo_brine_max_shuey_err');
    FIELDS.forEach((f) => expect(f.tol === 0 ? Number.isInteger(f.expected) : f.tol > 0, f.key).toBe(true));
  });

  it('the spec re-keys each tier onto exactly these fields, and the migration is generated from it', () => {
    ['beginner', 'intermediate', 'advanced'].forEach((tier) => {
      expect(SPEC.tiers[tier].pick).toBe('A');
      expect(SPEC.tiers[tier].rekey).toHaveLength(FIELDS.filter((f) => f.tier === tier).length);
      Object.keys(SPEC.tiers[tier].annot).forEach((k) => expect(FIELDS.find((f) => f.key === k && f.tier === tier), k).toBeTruthy());
    });
    const mig = fs.readFileSync(path.join(ROOT, 'migrations', SPEC.migration), 'utf8');
    FIELDS.forEach((f) => expect(mig, f.key).toContain(`"key": "${f.key}"`));
  });
});

describe('each brief states every input of its case', () => {
  const has = (tier, ...tokens) => tokens.forEach((t) => expect(SPEC.tiers[tier].prompt, `${tier}: ${t}`).toContain(String(t)));

  it('beginner', () => {
    const b = BEGINNER;
    has('beginner', `${b.cond.tC} degC`, `${b.cond.pMPa} MPa`, '50,000 ppm', `${b.cond.gasGravity}-gravity`,
      `${b.oilRho0} g/cc`, `GOR ${b.cond.gorLL}`, `${Math.round(b.quartz * 100)} percent quartz`, `Sw ${b.sw}`);
    expect(b.cond.salinity).toBe(0.05);
  });

  it('intermediate', () => {
    const i = INTERMEDIATE;
    has('intermediate', `vp ${i.logged.vp}`, `vs ${i.logged.vs}`, `density ${i.logged.rho}`, `porosity ${i.phi}`,
      `${i.kmin / 1e9} GPa`, `${i.cond.tC} degC`, `${i.cond.pMPa} MPa`, '45,000 ppm', `${i.cond.gasGravity}-gravity`,
      `Sw ${i.sw}`, `vp ${i.gcVp}`, `${i.gcSand * 100}/${Math.round((1 - i.gcSand) * 100)}`);
    expect(i.cond.salinity).toBe(0.045);
  });

  it('advanced, including the gas twin exactly as the substitution explorer gives it to 0.1', () => {
    const a = ADVANCED;
    const g = advancedGasTwin();
    has('advanced', `vp ${a.shale.vp}`, `vs ${a.shale.vs}`, `density ${a.shale.rho}`,
      `vp ${a.brineSand.vp}`, `vs ${a.brineSand.vs}`, `density ${a.brineSand.rho}`,
      `vp ${g.vp.toFixed(1)}`, `vs ${g.vs.toFixed(1)}`, `density ${g.rho.toFixed(1)}`,
      `porosity ${a.phi}`, `${a.kmin / 1e9} GPa`, `${a.freqHz} Hz`);
  });

  it('no re-cased brief keeps the W1 open-book label', () => {
    Object.values(SPEC.tiers).forEach((t) => expect(t.prompt).not.toMatch(/open book/i));
  });
});

describe('THE LEAK GATE: nothing the learner sees before working lands on a graded answer', () => {
  it('the band is ten grader tolerances, and it is live: a planted number inside is caught, outside is not', () => {
    expect(LEAK_GUARD_MARGIN).toBe(10);
    swept.forEach((f) => {
      const drift = 0.9 * LEAK_GUARD_MARGIN * f.tol;
      [f.expected, f.expected + drift, f.expected - drift].forEach((x) => expect(hit(x), `${f.key} at ${x}`).not.toBeNull());
      (RESTATE[f.unit] || [1]).forEach((k) => expect(hit(f.expected * k), `${f.key} x${k}`).not.toBeNull());
      const far = hit(f.expected + 1000 * LEAK_GUARD_MARGIN * f.tol);
      if (far) expect(far.key, `${f.key} moved clear and still hit its own band`).not.toBe(f.key);
    });
    expect(hit(NaN)).toBeNull();
    // the sweep sees a planted leak in a lesson line
    const planted = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'w5a-')), 'planted.md');
    const f = swept[0];
    fs.writeFileSync(planted, `The figure is ${f.expected.toFixed(4)} here.\n`);
    expect(scan([planted])).toHaveLength(1);
    fs.rmSync(path.dirname(planted), { recursive: true });
  });

  it('NO NUMBER the teaching functions give at the panels\' opening states lands in a band', () => {
    const vals = openingStates();
    expect(vals.length).toBeGreaterThan(500);
    const hits = vals.map((v) => ({ v, t: hit(v.value) })).filter((x) => x.t)
      .map((x) => `${x.v.where} = ${x.v.value} is inside ${x.t.tier}/${x.t.key} (x${x.t.factor})`);
    expect(hits).toEqual([]);
  });

  it('NO NUMBER the three explorers print as they open lands in a band (the D2 default-state rule)', () => {
    const hits = [];
    let count = 0;
    [['FluidExplorer', FluidExplorer], ['SubstitutionExplorer', SubstitutionExplorer], ['AvoExplorer', AvoExplorer]]
      .forEach(([name, C]) => {
        // text only: SVG path data is drawing, not print
        const text = renderToStaticMarkup(React.createElement(C)).replace(/<[^>]*>/g, ' ');
        const nums = text.match(NUMBER) || [];
        count += nums.length;
        nums.forEach((tok) => {
          const t = hit(Number(tok));
          if (t) hits.push(`${name} prints ${tok} as it opens, inside ${t.tier}/${t.key} (x${t.factor})`);
        });
      });
    expect(count).toBeGreaterThan(60);
    expect(hits).toEqual([]);
  });

  it('NO NUMBER in any lesson of the course lands in a band', () => {
    const files = lessonFiles();
    expect(files.length).toBeGreaterThanOrEqual(80);
    expect(scan(files)).toEqual([]);
  });

  it('NO NUMBER in the panel sources or the learning page lands in a band', () => {
    const files = [...panelSources(), PAGE];
    expect(files.length).toBeGreaterThanOrEqual(4);
    expect(scan(files)).toEqual([]);
  });

  it('the integer tuning field: no panel opens on the capstone frequency and no lesson names it', () => {
    const tuning = FIELDS.find((f) => f.key === 'uquo_tuning_ms');
    expect(tuning.tol).toBe(0);
    expect(L.TEACHING_FREQ_HZ).not.toBe(ADVANCED.freqHz);
    expect(L.FREQ_OPTIONS).not.toContain(ADVANCED.freqHz);
    [L.TEACHING_FREQ_HZ, ...L.FREQ_OPTIONS].forEach((f) => expect(L.computeAvoDetail(f).tuning.tuningMs).not.toBe(tuning.expected));
    const hz = new RegExp(`\\b${ADVANCED.freqHz}\\s*Hz\\b`);
    [...lessonFiles(), ...panelSources(), PAGE].forEach((file) => {
      expect(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file)).not.toMatch(hz);
    });
  });
});

describe('the teaching surface carries no capstone', () => {
  it('rockphysicsTeaching.js exports nothing named for the capstone', () => {
    const named = Object.keys(L).filter((n) => /^(CAP$|CAP_|CAPSTONE|capstone)/i.test(n));
    expect(named).toEqual([]);
  });

  it('the capstone case is named nowhere a learner reads before working', () => {
    const re = new RegExp(CASE_NAME, 'i');
    const files = [...lessonFiles(), ...panelSources(), PAGE,
      path.join(ROOT, 'src/lib/rockphysicsTeaching.js')];
    files.forEach((file) => expect(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file)).not.toMatch(re));
  });
});
