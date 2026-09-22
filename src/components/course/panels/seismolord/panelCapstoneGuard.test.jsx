// A PANEL, A LESSON OR THE LEARNING PAGE MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5a (FOLLOW-ON-PROGRAMME.md section 3): seismolord is pick A for the
// beginner tier and pick B (strip) for the intermediate and advanced tiers.
//
// BEGINNER, RE-CASED. The whole basic_20 log at 2000 m/s and 25 Hz is the
// teaching case; the capstone grades the UBIMA case (a depth window of the
// log, an overburden velocity and a wavelet of its own), stated in the brief
// and typed into the synthetic explorer. The shared W5 leak gate
// (../w5LeakGuard.js, ten grader tolerances) sweeps every lesson, the panel
// sources, the learning page, the rendered opening text and the teaching
// functions' opening scalars for the six new keys.
//
// INTERMEDIATE, STRIPPED. The keys stay. The lessons work a teaching trace
// arriving 6 ms late; the brief's trace withholds its lag and the shift
// explorer runs it only when selected. The gate proves no lesson states the
// withheld lag, and no lesson, panel or page prints the brief trace's zero-lag
// correlation, and that the panel opens on the teaching trace.
//
// ADVANCED, STRIPPED. The keys stay. The wedge explorer opens at 15 Hz, off
// the brief's 25 and 40 Hz, and the walkthrough works the method there. The
// tuning amplitude and its ratio to the isolated level are near-invariant
// across frequency on this grid (every f with f x T = 400 reproduces them
// exactly), so no teaching run can avoid them within ten tolerances; the gate
// checks the opening panel against the grader's own band (the tuning
// amplitude is left out: its 0.002 tolerance is wider than its spread over
// every frequency, a field defect reported for a re-key decision), and
// requires the walkthrough to print none of the six values.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from '@/lib/seismolordTeaching';
import {
  makeLeakGuard, leaves, lessonFiles, panelSources, LEAK_GUARD_MARGIN, NUMBER,
} from '../w5LeakGuard';
import SyntheticExplorer from './SyntheticExplorer';
import ShiftExplorer from './ShiftExplorer';
import WedgeExplorer from './WedgeExplorer';
import { capstoneFields, BEGINNER } from '../../../../../tools/course-waves/w5/seismolord/fields.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..', '..', '..');
const FIELDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/w5/seismolord/fields.json'), 'utf8'));
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/graded-field-audit/w5/seismolord.json'), 'utf8'));
const LESSONS = path.join(ROOT, 'src/content/courses/seismolord');
const PAGE = path.join(ROOT, 'src/pages/apps/SeismolordLearningPage.jsx');
const CASE_NAME = ['UBI', 'MA'].join('');
const tierOf = (t) => FIELDS.filter((f) => f.tier === t);
const field = (k) => FIELDS.find((f) => f.key === k);

const GB = makeLeakGuard(tierOf('beginner'));
const GZ = makeLeakGuard([field('corr_zero_lag')]);
const render = (C) => renderToStaticMarkup(React.createElement(C));

function beginnerOpeningStates() {
  const out = [];
  [L.TEACHING_FREQ_HZ, 15, 40].forEach((f) => leaves(L.computeSynthetic(f).summary, {}, out, `computeSynthetic(${f})`));
  leaves(L.computeIntermediate(L.TEACHING_LAG_MS), {}, out, 'computeIntermediate(teaching)');
  L.WEDGE_FREQS.forEach((f) => {
    const w = L.computeWedge(f);
    leaves({ t: w.tuneMs, a: w.tuneAmp, i: w.isoAmp, th: w.theoryMs }, {}, out, `computeWedge(${f})`);
  });
  return out;
}

describe('the graded keys are the engine\'s', () => {
  it('fields.json is exactly what the vendored engines return (beginner re-cased, the rest kept)', () => {
    expect(capstoneFields()).toEqual(FIELDS);
  });

  it('the beginner tier is re-keyed onto the UBIMA case; the stripped tiers keep their keys', () => {
    expect(SPEC.tiers.beginner.pick).toBe('A');
    expect(SPEC.tiers.beginner.rekey).toHaveLength(tierOf('beginner').length);
    expect(tierOf('beginner').every((f) => f.key.startsWith('ubima_'))).toBe(true);
    expect(SPEC.tiers.intermediate.pick).toBe('B');
    expect(tierOf('intermediate').map((f) => f.key)).toContain('corr_zero_lag');
    const mig = fs.readFileSync(path.join(ROOT, 'migrations', SPEC.migration), 'utf8');
    tierOf('beginner').forEach((f) => expect(mig, f.key).toContain(`"key": "${f.key}"`));
  });

  it('the beginner brief states every input of its case and drops the open-book label', () => {
    const p = SPEC.tiers.beginner.prompt;
    [`${BEGINNER.topMd} to ${BEGINNER.baseMd} m MD`, `${BEGINNER.vOverburden} m/s`, `${BEGINNER.freqHz} Hz`].forEach((t) => expect(p).toContain(t));
    expect(p).not.toMatch(/open book/i);
  });

  it('the intermediate brief names the panel setting that runs its trace', () => {
    expect(SPEC.tiers.intermediate.prompt_edits[0][1]).toContain("The brief's trace");
  });
});

describe('BEGINNER: nothing the learner sees before working lands on a graded answer', () => {
  it('the band is live: a planted number inside is caught, outside is not', () => {
    expect(LEAK_GUARD_MARGIN).toBe(10);
    tierOf('beginner').forEach((f) => {
      const drift = 0.9 * LEAK_GUARD_MARGIN * f.tol;
      [f.expected, f.expected + drift, f.expected - drift].forEach((x) => expect(GB.hit(x), `${f.key} at ${x}`).not.toBeNull());
    });
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w5a-sl-'));
    const planted = path.join(dir, 'planted.md');
    fs.writeFileSync(planted, `The figure is ${field('ubima_imp_max').expected.toFixed(2)} here.\n`);
    expect(GB.scanFiles([planted], ROOT)).toHaveLength(1);
    fs.rmSync(dir, { recursive: true });
  });

  it('no opening-state scalar, rendered panel text, lesson, panel source or page number lands in a band', () => {
    expect(GB.scanValues(beginnerOpeningStates())).toEqual([]);
    const rendered = [['SyntheticExplorer', SyntheticExplorer], ['ShiftExplorer', ShiftExplorer], ['WedgeExplorer', WedgeExplorer]]
      .flatMap(([n, C]) => GB.scanRendered(n, render(C)).hits);
    expect(rendered).toEqual([]);
    expect(GB.scanFiles(lessonFiles(LESSONS), ROOT)).toEqual([]);
    expect(GB.scanFiles([...panelSources(HERE), PAGE], ROOT, { integers: false })).toEqual([]);
  });

  it('the synthetic explorer does not open on the capstone window, velocity or frequency', () => {
    expect(L.TEACHING_FREQ_HZ).not.toBe(BEGINNER.freqHz);
    expect(L.V_OVERBURDEN_MS).not.toBe(BEGINNER.vOverburden);
    expect(L.WELL.md[0]).not.toBe(BEGINNER.topMd);
  });
});

describe('INTERMEDIATE (strip): the withheld lag and its zero-lag score are printed nowhere', () => {
  const lessons = lessonFiles(LESSONS);
  const WITHHELD = new RegExp(`(arriv\\w* ${L.WITHHELD_LAG_MS} ms|${L.WITHHELD_LAG_MS} ms late|(shift|lag) of ${L.WITHHELD_LAG_MS} ms|${L.WITHHELD_LAG_MS} ms of TWT|planted lag (is|of) ${L.WITHHELD_LAG_MS}\\b)`);

  it('the gate is live on a planted statement of the lag', () => {
    expect(WITHHELD.test(`the synthetic arriving ${L.WITHHELD_LAG_MS} ms late`)).toBe(true);
    expect(GZ.hit(field('corr_zero_lag').expected)).not.toBeNull();
  });

  it('no lesson states the withheld lag', () => {
    const hits = lessons.filter((f) => WITHHELD.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(ROOT, f));
    expect(hits).toEqual([]);
  });

  it('no lesson, panel source, page or opening panel prints the brief trace\'s zero-lag correlation', () => {
    expect(GZ.scanFiles([...lessons, ...panelSources(HERE), PAGE], ROOT)).toEqual([]);
    expect(GZ.scanRendered('ShiftExplorer', render(ShiftExplorer)).hits).toEqual([]);
  });

  it('the shift explorer opens on the teaching trace, whose scan answers a different lag', () => {
    expect(L.TEACHING_LAG_MS).not.toBe(L.WITHHELD_LAG_MS);
    const text = render(ShiftExplorer).replace(/<[^>]*>/g, ' ');
    expect(text).toMatch(new RegExp(`Suggested bulk shift\\s*${L.TEACHING_LAG_MS}\\s*ms`));
    expect(L.shiftScan(L.TEACHING_LAG_MS).lagMs).toBe(L.TEACHING_LAG_MS);
  });
});

describe('ADVANCED (strip): the wedge explorer opens off the brief\'s frequencies and the walkthrough prints none of its values', () => {
  const adv = tierOf('advanced');
  it('the panel opens at a frequency the brief does not read', () => {
    const text = render(WedgeExplorer).replace(/<[^>]*>/g, ' ');
    expect(text).not.toMatch(/Wedge tuning at 25 Hz|at 40 Hz/);
    // tune25_amp is left out on purpose: its tolerance (0.002) is wider than the
    // spread of the tuning amplitude over EVERY frequency on this grid (0.11469
    // to 0.11570), so any wedge run prints a passing value. That is a defect of
    // the field, reported for a re-key decision; no strip can remove it.
    const checked = adv.filter((f) => f.tol > 0 && f.key !== 'tune25_amp');
    const G1 = {
      hit: (x) => checked.find((f) => Math.abs(x - f.expected) <= f.tol) || null,
    };
    const hits = (text.match(NUMBER) || []).map(Number).filter((x) => G1.hit(x));
    expect(hits).toEqual([]);
  });

  it('the advanced walkthrough prints none of the six values', () => {
    const G = makeLeakGuard(adv.filter((f) => !['tune25_amp', 'tune25_iso_ratio'].includes(f.key)));
    const walk = path.join(LESSONS, 'advanced/m06-using-the-wedge/l03-the-capstone-walkthrough.md');
    expect(G.scanFiles([walk], ROOT)).toEqual([]);
    const text = fs.readFileSync(walk, 'utf8');
    ['0.1155', '1.4449', '15.59', '0.0953'].forEach((t) => expect(text.includes(t), t).toBe(false));
    expect(text).not.toMatch(/\b16 ms\b|\b10 ms\b/);
  });
});

describe('the teaching surface carries no capstone name', () => {
  it('the beginner case is named nowhere a learner reads before working', () => {
    const re = new RegExp(CASE_NAME, 'i');
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE, path.join(ROOT, 'src/lib/seismolordTeaching.js')]
      .forEach((file) => expect(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file)).not.toMatch(re));
  });
});
