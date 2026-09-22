// A PANEL, A LESSON OR THE LEARNING PAGE MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5a re-cased this course (FOLLOW-ON-PROGRAMME.md section 3, pick A). The
// four Ekene wells are the teaching case: the panels open on them and the
// lessons work them. Each capstone tier grades the UMUDI section instead
// (four wells with picks to 0.1 m, the last stopping above TOP_B, and datums
// of its own), which the brief states and the learner types into the panels'
// "Type a section" mode. correlationTeaching.js carries no capstone case; it
// lives only in tools/course-waves/w5/wellcorrelation/fields.mjs, which
// nothing under src/ imports except the tests.
//
// This file is the half of the guarantee that can fail: the shared W5 leak
// gate (../w5LeakGuard.js, ten grader tolerances, absolute) over every lesson,
// the panel sources, the learning page, the explorers' rendered opening text
// and the teaching functions' opening scalars. The Ekene picks are whole
// metres and the UMUDI picks carry a tenth, so no Ekene reading can land
// within the band of a UMUDI answer; the gate proves it rather than assumes it.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from '@/lib/correlationTeaching';
import {
  makeLeakGuard, leaves, lessonFiles, panelSources, LEAK_GUARD_MARGIN,
} from '../w5LeakGuard';
import SectionExplorer from './SectionExplorer';
import FlattenExplorer from './FlattenExplorer';
import PredictionExplorer from './PredictionExplorer';
import {
  capstoneFields, SECTION_TABLE, DATUMS,
} from '../../../../../tools/course-waves/w5/wellcorrelation/fields.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..', '..', '..');
const FIELDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/w5/wellcorrelation/fields.json'), 'utf8'));
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/graded-field-audit/w5/wellcorrelation.json'), 'utf8'));
const LESSONS = path.join(ROOT, 'src/content/courses/wellcorrelation');
const PAGE = path.join(ROOT, 'src/pages/apps/WellCorrelationLearningPage.jsx');
const CASE_NAME = ['UMU', 'DI'].join('');

const G = makeLeakGuard(FIELDS);

function openingStates() {
  const out = [];
  const tops = L.TOP_ORDER;
  const datums = [{ mode: 'structural' }, ...tops.flatMap((t) => [1450, 1480, 1500, 1560].map((d) => ({ mode: 'flatten', topName: t, datumM: d })))];
  datums.forEach((d) => {
    const s = L.computeSection(d);
    s.rows.forEach((r, i) => {
      leaves({ shift: r.shift, thickness: r.thickness, span: r.span }, {}, out, `computeSection(${JSON.stringify(d)}).rows[${i}]`);
      r.tops.forEach((t) => leaves({ displayed: t.displayed, md: t.md_m }, {}, out, `computeSection(${JSON.stringify(d)}) ${r.name} ${t.name}`));
    });
    leaves({ lo: s.range[0], hi: s.range[1], span: s.range[1] - s.range[0] }, {}, out, `computeSection(${JSON.stringify(d)}).range`);
  });
  tops.forEach((t) => leaves({ relief: L.structuralRelief(t) }, {}, out, `structuralRelief(${t})`));
  const i = L.computeIntermediate();
  leaves({ growth: i.growthRange, span: i.displayedSpan }, {}, out, 'computeIntermediate()');
  i.rows.forEach((r, k) => leaves(r, {}, out, `computeIntermediate().rows[${k}]`));
  const a = L.computeAdvanced();
  leaves({ aToB: a.aToBMean, sToB: a.sandToBMean, lc: a.w4TopBLayercake, fs: a.w4TopBFromSand, spread: a.predictionSpread, relief: a.topBRelief },
    {}, out, 'computeAdvanced()');
  a.rows.forEach((r, k) => leaves(r, {}, out, `computeAdvanced().rows[${k}]`));
  return out;
}

describe('the graded keys are the engine\'s', () => {
  it('fields.json is exactly what the vendored engine returns for the UMUDI section', () => {
    expect(capstoneFields()).toEqual(FIELDS);
  });

  it('carries eighteen fields over three tiers, W1\'s two re-keyed readings kept on the new case', () => {
    expect(FIELDS).toHaveLength(18);
    const keys = FIELDS.map((f) => f.key);
    expect(keys).toContain('umudi3_top_b_displayed_base_1575_m');
    expect(keys).toContain('umudi_shallowest_displayed_sand_1495_m');
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
  const wells = SECTION_TABLE.split('\n');

  it('every tier lists the four UMUDI wells exactly as the panels take them', () => {
    ['beginner', 'intermediate', 'advanced'].forEach((tier) => wells.forEach((w) => has(tier, w)));
  });

  it('the datums', () => {
    has('beginner', `${DATUMS.beginner.topName} at a ${DATUMS.beginner.datumM} m datum`,
      `${DATUMS.beginnerSecond.topName} at a ${DATUMS.beginnerSecond.datumM} m datum`);
    has('intermediate', `${DATUMS.intermediate.topName} at a ${DATUMS.intermediate.datumM} m datum`,
      `${DATUMS.intermediateSecond.topName} at a ${DATUMS.intermediateSecond.datumM} m datum`);
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
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w5a-wc-'));
    const planted = path.join(dir, 'planted.md');
    fs.writeFileSync(planted, `The figure is ${FIELDS[0].expected.toFixed(1)} here.\n`);
    expect(G.scanFiles([planted], ROOT)).toHaveLength(1);
    fs.rmSync(dir, { recursive: true });
  });

  it('NO NUMBER the teaching functions give at the panels\' opening states and datums lands in a band', () => {
    const vals = openingStates();
    expect(vals.length).toBeGreaterThan(300);
    expect(G.scanValues(vals)).toEqual([]);
  });

  it('NO NUMBER the three explorers print as they open lands in a band (the D2 default-state rule)', () => {
    let count = 0;
    const hits = [];
    [['SectionExplorer', SectionExplorer], ['FlattenExplorer', FlattenExplorer], ['PredictionExplorer', PredictionExplorer]]
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

  it('NO NUMBER in the panel sources or the learning page lands in a band', () => {
    const files = [...panelSources(HERE), PAGE];
    expect(files.length).toBeGreaterThanOrEqual(4);
    expect(G.scanFiles(files, ROOT, { integers: false })).toEqual([]);
  });

  it('the UMUDI picks appear nowhere a learner reads first', () => {
    const picks = SECTION_TABLE.split('\n').flatMap((l) => l.split(',').slice(1).map((c) => c.trim()).filter((c) => c !== '-'));
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE].forEach((file) => {
      const text = fs.readFileSync(file, 'utf8');
      picks.forEach((p) => expect(new RegExp(`(^|[^0-9.])${p.replace('.', '\\.')}([^0-9]|$)`).test(text), `${path.relative(ROOT, file)} carries ${p}`).toBe(false));
    });
  });
});

describe('the teaching surface carries no capstone', () => {
  it('correlationTeaching.js exports nothing named for the capstone', () => {
    const named = Object.keys(L).filter((n) => /^(CAP$|CAP_|CAPSTONE|capstone)/i.test(n));
    expect(named).toEqual([]);
  });

  it('the capstone case is named nowhere a learner reads before working', () => {
    const re = new RegExp(CASE_NAME, 'i');
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE, path.join(ROOT, 'src/lib/correlationTeaching.js')]
      .forEach((file) => expect(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file)).not.toMatch(re));
  });
});
