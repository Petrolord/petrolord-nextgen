// A PANEL, A LESSON OR THE LEARNING PAGE MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5a re-cased this course (FOLLOW-ON-PROGRAMME.md section 3, pick A). The
// golden basin fixtures are the teaching case: the panels open on them and the
// lessons work them. Each capstone tier grades the NKPOR case instead (a
// sandstone and a heat column of its own; heating rates, read temperatures
// and a kerogen clock of its own; an erosion event of its own on the
// reference basin), which the brief states and the learner types into the
// tier's panel. basinTeaching.js carries no capstone case; it lives only in
// tools/course-waves/w5/basin/fields.mjs, which nothing under src/ imports
// except the tests.
//
// This file is the half of the guarantee that can fail: the shared W5 leak
// gate (../w5LeakGuard.js, ten grader tolerances, absolute) over every lesson,
// the panel sources, the learning page, the explorers' rendered opening text
// and the teaching functions' opening scalars, including every forward run
// the charge explorer's buttons start. Porosity is also checked as a percent.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from '@/lib/basinTeaching';
import {
  makeLeakGuard, leaves, lessonFiles, panelSources, LEAK_GUARD_MARGIN,
} from '../w5LeakGuard';
import BurialHeatExplorer from './BurialHeatExplorer';
import KineticsExplorer from './KineticsExplorer';
import ChargeExplorer from './ChargeExplorer';
import {
  capstoneFields, BEGINNER, INTERMEDIATE, ADVANCED,
} from '../../../../../tools/course-waves/w5/basin/fields.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..', '..', '..');
const FIELDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/w5/basin/fields.json'), 'utf8'));
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/graded-field-audit/w5/basin.json'), 'utf8'));
const LESSONS = path.join(ROOT, 'src/content/courses/basin');
const PAGE = path.join(ROOT, 'src/pages/apps/BasinLearningPage.jsx');
const CASE_NAME = ['NKP', 'OR'].join('');

const G = makeLeakGuard(FIELDS, { 'v/v': [1, 100] });

async function openingStates() {
  const out = [];
  const bh = L.computeBurialHeat();
  leaves({ s100: bh.solid100, sb: bh.solidBuried, r: bh.restoredThickness, phi: bh.phi2000, t1: bh.tFirstNode, t2: bh.tLayer1Bottom, t3: bh.tDeepest },
    {}, out, 'computeBurialHeat()');
  ['shale', 'sandstone', 'limestone', 'dolomite'].forEach((lith) => leaves(L.compactionReadings(lith, 2000, 1000), {}, out, `compactionReadings(${lith})`));
  const hc = L.heatColumn();
  hc.temps.forEach((t, i) => out.push({ where: `heatColumn().temps[${i}]`, value: t }));
  const k = L.computeKinetics();
  leaves({ f0: k.roF0, full: k.roFull, tr10: k.tr10, tr50: k.tr50 }, {}, out, 'computeKinetics()');
  L.RAMP_RATES.forEach((r) => [150, 100, 120, 140, 160, 180].forEach((t) => out.push({ where: `ramp ${r} at ${t}`, value: k.roAt(r, t) })));
  L.KEROGEN_TYPES.forEach((ty) => {
    const e = L.computeKineticsExplorer(100, ty);
    [10, 50, 100].forEach((ma) => out.push({ where: `computeKineticsExplorer(100, ${ty}) TR ${ma}`, value: e.trAt(ma) }));
  });
  const rb = await L.computeReferenceBasin();
  leaves({ ro: rb.finalRo, t: rb.finalTempC, tr: rb.finalTr, g: rb.generated, e: rb.expelled, ro0: rb.finalRoNoErosion }, {}, out, 'computeReferenceBasin()');
  for (const a of [0, 300, 600, 900]) {
    // eslint-disable-next-line no-await-in-loop
    const s = await L.computeErosionScenario(a);
    leaves({ ro: s.finalRo, t: s.finalTempC, peak: Math.max(...s.temperature.map((x) => x.value)), tr: s.finalTr, g: s.generated,
      e: s.expelled, d: s.roDelta, b: s.baselineRo, be: s.baselineExpelled, p: s.potentialMass }, {}, out, `computeErosionScenario(${a})`);
  }
  return out;
}

describe('the graded keys are the engine\'s', () => {
  it('fields.json is exactly what the vendored engines return for the NKPOR case', async () => {
    expect(await capstoneFields()).toEqual(FIELDS);
  }, 60000);

  it('carries eighteen fields over three tiers', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach((f) => expect(f.tol, f.key).toBeGreaterThan(0));
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
    has('beginner', b.lithology, `${b.depthM} m`, `${b.burialM} m`, `${b.heat.surfaceC} C surface`,
      `${b.heat.basalMwM2} mW/m2`, `k ${b.heat.kUpper.toFixed(1)} over k ${b.heat.kLower.toFixed(1)}`);
  });

  it('intermediate', () => {
    const i = INTERMEDIATE;
    has('intermediate', `${i.rateA} C/Ma`, `${i.rateB} C/Ma`, `${i.readA} C`, `${i.readB} C`, `${i.isoC} C`, `${i.isoMa} Ma`);
  });

  it('advanced', () => {
    has('advanced', `${ADVANCED.erosionM} m of erosion at ${ADVANCED.erosionAgeMa} Ma`);
  });

  it('no re-cased brief keeps the W1 open-book label', () => {
    Object.values(SPEC.tiers).forEach((t) => expect(t.prompt).not.toMatch(/open book/i));
  });
});

describe('THE LEAK GATE: nothing the learner sees before working lands on a graded answer', () => {
  it('the band is ten grader tolerances, and it is live: a planted number inside is caught, outside is not', () => {
    expect(LEAK_GUARD_MARGIN).toBe(10);
    FIELDS.forEach((f) => {
      const drift = 0.9 * LEAK_GUARD_MARGIN * f.tol;
      [f.expected, f.expected + drift, f.expected - drift].forEach((x) => expect(G.hit(x), `${f.key} at ${x}`).not.toBeNull());
      const far = G.hit(f.expected + 1000 * LEAK_GUARD_MARGIN * f.tol);
      if (far) expect(far.key).not.toBe(f.key);
    });
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w5a-bs-'));
    const planted = path.join(dir, 'planted.md');
    fs.writeFileSync(planted, `The figure is ${FIELDS[0].expected.toFixed(4)} here.\n`);
    expect(G.scanFiles([planted], ROOT)).toHaveLength(1);
    fs.rmSync(dir, { recursive: true });
  });

  it('NO NUMBER the teaching functions give at the panels\' opening states lands in a band', async () => {
    const vals = await openingStates();
    expect(vals.length).toBeGreaterThan(100);
    expect(G.scanValues(vals)).toEqual([]);
  }, 120000);

  it('NO NUMBER the three explorers print as they open lands in a band (the D2 default-state rule)', () => {
    let count = 0;
    const hits = [];
    [['BurialHeatExplorer', BurialHeatExplorer], ['KineticsExplorer', KineticsExplorer], ['ChargeExplorer', ChargeExplorer]]
      .forEach(([name, C]) => {
        const r = G.scanRendered(name, renderToStaticMarkup(React.createElement(C)));
        count += r.count;
        hits.push(...r.hits);
      });
    expect(count).toBeGreaterThan(40);
    expect(hits).toEqual([]);
  }, 60000);

  it('NO NUMBER in any lesson of the course lands in a band', () => {
    const files = lessonFiles(LESSONS);
    expect(files.length).toBeGreaterThanOrEqual(70);
    expect(G.scanFiles(files, ROOT)).toEqual([]);
  });

  it('NO NUMBER in the panel sources or the learning page lands in a band', () => {
    const files = [...panelSources(HERE), PAGE];
    expect(files.length).toBeGreaterThanOrEqual(4);
    expect(G.scanFiles(files, ROOT, { integers: false })).toEqual([]);
  });
});

describe('the teaching surface carries no capstone', () => {
  it('basinTeaching.js exports nothing named for the capstone', () => {
    const named = Object.keys(L).filter((n) => /^(CAP$|CAP_|CAPSTONE|capstone)/i.test(n));
    expect(named).toEqual([]);
  });

  it('the capstone case is named nowhere a learner reads before working', () => {
    const re = new RegExp(CASE_NAME, 'i');
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE, path.join(ROOT, 'src/lib/basinTeaching.js')]
      .forEach((file) => expect(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file)).not.toMatch(re));
  });
});
