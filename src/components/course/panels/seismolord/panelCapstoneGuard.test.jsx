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
//
// ADVANCED, HD RE-KEY (2026-09-22, migration 20261030b_hd_seismolord.sql).
// The two fields that did not discriminate are re-keyed: tune25_amp becomes
// the 25 Hz amplitude of a stated 24 ms bed and tune25_iso_ratio the 25 Hz
// ratio to the isolated level of a stated 28 ms bed, both on the falling
// side of the curve. The gate below measures, on the engine, that the old
// fields passed on every panel frequency and that no other panel reading and
// no guess passes the new ones, and that neither new answer (as graded, or
// restated through the isolated level) is printed anywhere a learner reads
// before working. The planted controls prove the sweep is live.
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
import { capstoneFields, BEGINNER, HD_ADVANCED } from '../../../../../tools/course-waves/w5/seismolord/fields.mjs';

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
    // Every advanced field with a tolerance is checked. W5a had to leave
    // tune25_amp out (its 0.002 was wider than the tuning amplitude's spread
    // over every frequency); the HD re-key replaced it.
    const checked = adv.filter((f) => f.tol > 0);
    expect(checked.map((f) => f.key)).toEqual(['amp25_at_24ms', 'amp40_at_6ms', 'ratio25_at_28ms', 'theory25_ms']);
    const G1 = {
      hit: (x) => checked.find((f) => Math.abs(x - f.expected) <= f.tol) || null,
    };
    const hits = (text.match(NUMBER) || []).map(Number).filter((x) => G1.hit(x));
    expect(hits).toEqual([]);
  });

  it('the advanced walkthrough prints none of the six values', () => {
    const G = makeLeakGuard(adv);
    const walk = path.join(LESSONS, 'advanced/m06-using-the-wedge/l03-the-capstone-walkthrough.md');
    expect(G.scanFiles([walk], ROOT)).toEqual([]);
    const text = fs.readFileSync(walk, 'utf8');
    ['0.0942', '1.0688', '15.59', '0.0953'].forEach((t) => expect(text.includes(t), t).toBe(false));
    expect(text).not.toMatch(/\b16 ms\b|\b10 ms\b/);
  });
});

describe('ADVANCED (HD re-key): the new fields discriminate and are printed nowhere', () => {
  const W = Object.fromEntries(L.WEDGE_FREQS.map((f) => [f, L.computeWedge(f)]));
  const amp = field('amp25_at_24ms');
  const ratio = field('ratio25_at_28ms');
  const hd = W[HD_ADVANCED.freqHz];
  const iso = hd.isoAmp;
  // Every reading the panel can print on its two tiles: 5 frequencies x 31 beds.
  const readings = L.WEDGE_FREQS.flatMap((f) => W[f].rows.map((r) => ({
    f, t: r.thicknessMs, amp: r.amp, ratio: r.amp / W[f].isoAmp,
  })));
  const passes = (fld, x) => Math.abs(x - fld.expected) <= fld.tol;

  it('the replaced fields passed on every panel frequency (the defect, measured)', () => {
    // tune25_amp 0.1155947595834732 tol 0.002 and tune25_iso_ratio 1.4449345270902185
    // tol 0.001 were the W5a keys; any frequency's tuning reading passed the amplitude.
    L.WEDGE_FREQS.forEach((f) => expect(Math.abs(W[f].tuneAmp - 0.1155947595834732), `${f} Hz`).toBeLessThanOrEqual(0.002));
    expect(L.WEDGE_FREQS.filter((f) => Math.abs(W[f].tuneAmp / W[f].isoAmp - 1.4449345270902185) <= 0.001))
      .toEqual([20, 25, 40, 50]);
    expect(FIELDS.map((f) => f.key)).not.toContain('tune25_amp');
    expect(FIELDS.map((f) => f.key)).not.toContain('tune25_iso_ratio');
  });

  it('the new keys are the stated beds on the 25 Hz run, read the way the tiles read them', () => {
    const r24 = hd.rows.find((r) => r.thicknessMs === HD_ADVANCED.ampBedMs);
    const r28 = hd.rows.find((r) => r.thicknessMs === HD_ADVANCED.ratioBedMs);
    expect(amp.expected).toBe(r24.amp);
    expect(ratio.expected).toBe(r28.amp / iso);
    // both beds are thicker than tuning, on the falling side
    expect(HD_ADVANCED.ampBedMs).toBeGreaterThan(hd.tuneMs);
    expect(HD_ADVANCED.ratioBedMs).toBeGreaterThan(HD_ADVANCED.ampBedMs);
    // the tiles print 10 and 4 decimals; the printed value passes, as it should
    expect(passes(amp, Number(r24.amp.toFixed(10)))).toBe(true);
    expect(passes(ratio, Number((r28.amp / iso).toFixed(4)))).toBe(true);
    // against the exact 0.08 the ratio still passes
    expect(passes(ratio, r28.amp / L.WEDGE.rcTop)).toBe(true);
  });

  it('no other panel reading and no guess passes a new field', () => {
    // A reading at the same frequency times thickness (module 4's law) is the
    // same bed in wavelet units, a correct route by another frequency: 50 Hz at
    // 14 ms prints the 28 ms ratio exactly, 50 Hz at 12 ms misses the 24 ms
    // amplitude by the grid fit. Every other reading is a different bed.
    const law = (t0) => (x) => x.f * x.t !== HD_ADVANCED.freqHz * t0;
    const others = readings.filter(law(HD_ADVANCED.ampBedMs));
    expect(others.filter((x) => passes(amp, x.amp)).map((x) => `${x.f}Hz ${x.t}ms`)).toEqual([]);
    const othersR = readings.filter(law(HD_ADVANCED.ratioBedMs));
    expect(othersR.filter((x) => passes(ratio, x.ratio)).map((x) => `${x.f}Hz ${x.t}ms`)).toEqual([]);
    expect(passes(ratio, W[50].rows[7].amp / W[50].isoAmp)).toBe(true);
    expect(passes(amp, W[50].rows[6].amp)).toBe(false);
    // wrong methods and guesses: the tuning reading, the isolated level, a thin-bed
    // linear scaling, the other tile, the continuous ideal, and 1
    const ideal = 1 + 2 * Math.exp(-1.5);
    [hd.tuneAmp, iso, 0.08, hd.tuneAmp * (HD_ADVANCED.ampBedMs / hd.tuneMs), amp.expected / iso, 0.08 * ideal]
      .forEach((g) => expect(passes(amp, g), `amp guess ${g}`).toBe(false));
    [hd.tuneAmp / iso, ideal, 1, ratio.expected * iso, amp.expected / iso]
      .forEach((g) => expect(passes(ratio, g), `ratio guess ${g}`).toBe(false));
    // the nearest wrong reading is several tolerances out, not a hair
    const gap = (fld, k, list) => Math.min(...list.map((x) => Math.abs(x[k] - fld.expected))) / fld.tol;
    expect(gap(amp, 'amp', others)).toBeGreaterThan(5);
    expect(gap(ratio, 'ratio', othersR)).toBeGreaterThan(10);
  });

  // The new answers, as graded and restated through the isolated level (an
  // amplitude printed in a lesson divides to the ratio, and back).
  const HD = makeLeakGuard([
    amp, ratio,
    { tier: 'advanced', key: 'amp25_at_24ms as a ratio', tol: amp.tol / iso, expected: amp.expected / iso },
    { tier: 'advanced', key: 'ratio25_at_28ms as an amplitude', tol: ratio.tol * iso, expected: ratio.expected * iso },
  ]);

  it('the gate is live: planted prints of each answer and each restatement are caught', () => {
    expect(LEAK_GUARD_MARGIN).toBe(10);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hd-sl-'));
    const planted = [
      amp.expected.toFixed(8), (amp.expected / iso).toFixed(4), ratio.expected.toFixed(4), (ratio.expected * iso).toFixed(8),
    ].map((v, i) => {
      const p = path.join(dir, `planted${i}.md`);
      fs.writeFileSync(p, `| 24 ms | ${v} |\n`);
      return p;
    });
    planted.forEach((p) => expect(HD.scanFiles([p], ROOT), p).toHaveLength(1));
    // and the old lesson rows this re-key stripped would have been caught
    const old = path.join(dir, 'old.md');
    fs.writeFileSync(old, '| 28 ms | 0.08550713 | 0.07449286 |\nthe 25 Hz value at 24 ms, 0.09428645, does indeed lie\n');
    expect(HD.scanFiles([old], ROOT)).toHaveLength(2);
    fs.rmSync(dir, { recursive: true });
  });

  it('no lesson, panel source, page, rendered panel or opening scalar prints a new answer', () => {
    expect(HD.scanFiles([...lessonFiles(LESSONS), ...panelSources(HERE), PAGE], ROOT)).toEqual([]);
    const rendered = [['SyntheticExplorer', SyntheticExplorer], ['ShiftExplorer', ShiftExplorer], ['WedgeExplorer', WedgeExplorer]]
      .flatMap(([n, C]) => HD.scanRendered(n, render(C)).hits);
    expect(rendered).toEqual([]);
    expect(HD.scanValues(beginnerOpeningStates())).toEqual([]);
  });

  it('the migration writes the new keys and the brief names both beds', () => {
    const mig = fs.readFileSync(path.join(ROOT, 'migrations', '20261030b_hd_seismolord.sql'), 'utf8');
    [amp, ratio].forEach((f) => expect(mig, f.key).toContain(`"key": "${f.key}"`));
    const spec = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/graded-field-audit/hd/seismolord.json'), 'utf8'));
    const brief = spec.tiers.advanced.prompt_edits.map((e) => e[1]).join(' ');
    expect(brief).toContain(`${HD_ADVANCED.ampBedMs} ms bed at ${HD_ADVANCED.freqHz} Hz`);
    expect(brief).toContain(`${HD_ADVANCED.ratioBedMs} ms bed at ${HD_ADVANCED.freqHz} Hz`);
  });
});

describe('the teaching surface carries no capstone name', () => {
  it('the beginner case is named nowhere a learner reads before working', () => {
    const re = new RegExp(CASE_NAME, 'i');
    [...lessonFiles(LESSONS), ...panelSources(HERE), PAGE, path.join(ROOT, 'src/lib/seismolordTeaching.js')]
      .forEach((file) => expect(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file)).not.toMatch(re));
  });
});
