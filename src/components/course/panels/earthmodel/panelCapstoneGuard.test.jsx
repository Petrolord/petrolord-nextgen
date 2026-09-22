// A PANEL, A LESSON OR THE LEARNING PAGE MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5a re-cased this course (FOLLOW-ON-PROGRAMME.md section 3, pick A). The
// golden three-surface model is the teaching case: the panels open on it and
// the lessons work it. Each capstone tier grades the ORUMA case instead (a
// model frame, a well, and a fault polygon with its variogram, probe point and
// profile row), which the brief states and the learner types into the tier's
// panel. earthmodelTeaching.js carries no capstone case; the case lives only
// in tools/course-waves/w5/earthmodel/fields.mjs, which nothing under src/
// imports except the tests.
//
// This file is the half of the guarantee that can fail: the shared W5 leak gate
// (../w5LeakGuard.js, ten grader tolerances, absolute) over every lesson, the
// panel sources, the learning page, the explorers' rendered opening text and
// the teaching functions' opening scalars. Porosity is also checked restated
// as a percent. The two integer fields (the clamp count and the block-1 node
// count) are exact counts: they are swept in lessons and rendered text, and
// the inputs that produce them (the ORUMA frame and polygon) are checked to
// appear nowhere a learner reads first.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from '@/lib/earthmodelTeaching';
import {
  makeLeakGuard, leaves, lessonFiles, panelSources, LEAK_GUARD_MARGIN,
} from '../w5LeakGuard';
import FrameworkExplorer from './FrameworkExplorer';
import TieExplorer from './TieExplorer';
import PopulationExplorer from './PopulationExplorer';
import {
  capstoneFields, BEGINNER, INTERMEDIATE, ADVANCED,
} from '../../../../../tools/course-waves/w5/earthmodel/fields.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..', '..', '..');
const FIELDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/w5/earthmodel/fields.json'), 'utf8'));
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/graded-field-audit/w5/earthmodel.json'), 'utf8'));
const LESSONS = path.join(ROOT, 'src/content/courses/earthmodel');
const PAGE = path.join(ROOT, 'src/pages/apps/EarthModelLearningPage.jsx');
const CASE_NAME = ['ORU', 'MA'].join('');

const G = makeLeakGuard(FIELDS, { 'v/v': [1, 100] });

function openingStates() {
  const out = [];
  const fw = L.computeFramework();
  leaves({ s2: fw.s2Stats, clamp: fw.clampCounts, tkA: fw.tkA, tkB: fw.tkB, bulkA: fw.bulkA, bulkB: fw.bulkB },
    { divisors: [1e6] }, out, 'computeFramework()');
  const ties = L.computeTies(fw.fw);
  ties.rows.forEach((r, i) => leaves(r, {}, out, `computeTies.rows[${i}]`));
  ties.cpA.forEach((c, i) => leaves(c, {}, out, `computeTies.cpA[${i}]`));
  [...L.TIE_WELL_NAMES].forEach((w) => [false, true].forEach((vert) => {
    const d = L.computeTieDetail(w, vert);
    d.rows.forEach((r, i) => leaves(r, {}, out, `computeTieDetail(${w}, ${vert}).rows[${i}]`));
    leaves(d.cp, {}, out, `computeTieDetail(${w}, ${vert}).cp`);
  }));
  // the typed-well mode opens on W2's shape
  const typed = L.computeTieDetail(L.typedWell({
    x: 1400, y: 2200, kb: 30, kopMd: 1200, eobMd: 1500, tdMd: 1900, inc: 45, azi: 90, topA: 1580, topB: 1700, baseB: 1760,
  }));
  typed.rows.forEach((r, i) => leaves(r, {}, out, `typed-well opening rows[${i}]`));
  leaves(typed.cp, {}, out, 'typed-well opening cp');
  const ba = L.computeBlocksAndProperties(fw.fw);
  leaves({ census: ba.census, phi0: ba.phiBlock0, phi1: ba.phiBlock1, vols: ba.volsA }, { divisors: [1e6] }, out, 'computeBlocksAndProperties');
  L.POPULATION_METHODS.forEach((meth) => {
    const p = L.computePopulation(meth);
    leaves({ census: p.census, phi0: p.phiBlock0, phi1: p.phiBlock1, jump: p.jump, probes: p.probes,
      mean: p.arithmeticMean, wmean: p.weightedConstant, vols: p.volsA }, { divisors: [1e6] }, out, `computePopulation(${meth})`);
    // the row profile is plotted, not printed; its labelled points are in the rendered-text sweep
    leaves({ probe: p.krigeAt(L.PROBE_DEFAULT.x, L.PROBE_DEFAULT.y), trend: p.trend.at(L.PROBE_DEFAULT.x, L.PROBE_DEFAULT.y) },
      {}, out, `computePopulation(${meth}) at the default probe`);
  });
  return out;
}

describe('the graded keys are the engine\'s', () => {
  it('fields.json is exactly what the vendored engine returns for the ORUMA case', () => {
    expect(capstoneFields()).toEqual(FIELDS);
  });

  it('carries eighteen fields over three tiers, W1\'s fault jump kept on the new case', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f.key)).toContain(`oruma_fault_jump_y${ADVANCED.rowY}`);
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

  it('beginner: the frame', () => {
    const s = BEGINNER.spec;
    expect(s.dx).toBe(s.dy);
    has('beginner', `(${s.x0}, ${s.y0})`, `${s.dx} m`, `${s.nx} by ${s.ny}`);
  });

  it('intermediate: the well', () => {
    const w = INTERMEDIATE.well;
    has('intermediate', `(${w.x}, ${w.y})`, `KB ${w.kb} m`, `${w.kopMd} m MD`, `${w.inc} degrees`, `azimuth ${w.azi}`,
      `${w.eobMd} m MD`, `${w.tdMd} m MD`, `TopA at ${w.topA}`, `TopB at ${w.topB}`, `BaseB at ${w.baseB}`);
  });

  it('advanced: the polygon, variogram, probe and row', () => {
    const a = ADVANCED;
    has('advanced', L.polygonText(a.polygon), `nugget ${a.nugget}`, `range ${a.range} m`,
      `(${a.probe.x}, ${a.probe.y})`, `y = ${a.rowY}`);
  });

  it('no re-cased brief keeps the W1 open-book label', () => {
    Object.values(SPEC.tiers).forEach((t) => expect(t.prompt).not.toMatch(/open book/i));
  });
});

describe('THE LEAK GATE: nothing the learner sees before working lands on a graded answer', () => {
  it('the band is ten grader tolerances, and it is live: a planted number inside is caught, outside is not', () => {
    expect(LEAK_GUARD_MARGIN).toBe(10);
    FIELDS.filter((f) => f.tol > 0).forEach((f) => {
      const drift = 0.9 * LEAK_GUARD_MARGIN * f.tol;
      [f.expected, f.expected + drift, f.expected - drift].forEach((x) => expect(G.hit(x), `${f.key} at ${x}`).not.toBeNull());
      const far = G.hit(f.expected + 1000 * LEAK_GUARD_MARGIN * f.tol);
      if (far) expect(far.key).not.toBe(f.key);
    });
    FIELDS.filter((f) => f.tol === 0).forEach((f) => {
      expect(G.hit(f.expected)).not.toBeNull();
      expect(G.hit(f.expected + 1)?.key).not.toBe(f.key);
    });
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w5a-em-'));
    const planted = path.join(dir, 'planted.md');
    fs.writeFileSync(planted, `The figure is ${FIELDS[0].expected.toFixed(4)} here.\n`);
    expect(G.scanFiles([planted], ROOT)).toHaveLength(1);
    fs.rmSync(dir, { recursive: true });
  });

  it('NO NUMBER the teaching functions give at the panels\' opening states lands in a band', () => {
    const vals = openingStates();
    expect(vals.length).toBeGreaterThan(300);
    expect(G.scanValues(vals)).toEqual([]);
  });

  it('NO NUMBER the three explorers print as they open lands in a band (the D2 default-state rule)', () => {
    let count = 0;
    const hits = [];
    [['FrameworkExplorer', FrameworkExplorer], ['TieExplorer', TieExplorer], ['PopulationExplorer', PopulationExplorer]]
      .forEach(([name, C]) => {
        const r = G.scanRendered(name, renderToStaticMarkup(React.createElement(C)));
        count += r.count;
        hits.push(...r.hits);
      });
    expect(count).toBeGreaterThan(60);
    expect(hits).toEqual([]);
  });

  it('NO NUMBER in any lesson of the course lands in a band', () => {
    const files = lessonFiles(LESSONS);
    expect(files.length).toBeGreaterThanOrEqual(70);
    expect(G.scanFiles(files, ROOT)).toEqual([]);
  });

  it('NO NUMBER in the panel sources or the learning page lands in a band (counts excepted: layout integers)', () => {
    const files = [...panelSources(HERE), PAGE];
    expect(files.length).toBeGreaterThanOrEqual(4);
    expect(G.scanFiles(files, ROOT, { integers: false })).toEqual([]);
  });

  it('the inputs that produce the two counts appear nowhere a learner reads first', () => {
    const s = BEGINNER.spec;
    const frame = new RegExp(`\\b${s.nx}\\s*(by|x)\\s*${s.ny}\\b`);
    const poly = L.polygonText(ADVANCED.polygon);
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE].forEach((file) => {
      const text = fs.readFileSync(file, 'utf8');
      expect(text, path.relative(ROOT, file)).not.toMatch(frame);
      expect(text.includes(poly), path.relative(ROOT, file)).toBe(false);
    });
    expect(L.MODEL_SPEC.nx === s.nx && L.MODEL_SPEC.ny === s.ny).toBe(false);
  });
});

describe('the teaching surface carries no capstone', () => {
  it('earthmodelTeaching.js exports nothing named for the capstone', () => {
    const named = Object.keys(L).filter((n) => /^(CAP$|CAP_|CAPSTONE|capstone)/i.test(n));
    expect(named).toEqual([]);
  });

  it('the capstone case is named nowhere a learner reads before working', () => {
    const re = new RegExp(CASE_NAME, 'i');
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE, path.join(ROOT, 'src/lib/earthmodelTeaching.js')]
      .forEach((file) => expect(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file)).not.toMatch(re));
  });
});
