// Every value the H2 lab exposes to a panel or the course page is pinned here
// against the teaching digest (tools/course-waves/hygiene/digest.txt), which is
// itself nothing but the exposure engine's return values on the teaching
// records and the published golden.
//
// THE PIN. Every reader in hygieneLab.READERS is walked, and EVERY FINITE NUMBER
// it returns must appear, printed to six decimals as the digest prints it,
// inside the digest SECTIONS that reader is declared to teach from. A reader
// that returns a number the lessons were not written from fails by name.
//
// THE EIGHTEEN GRADED FIELDS are recomputed here, in CI, by running the
// committed capstone generator against THIS worktree's vendored engine, and
// compared EXACTLY with the committed fields.json. The lab holds no capstone
// value and no tolerance of its own.
//
// Then the gates:
//   THE RECORDS GATE     the lab's teaching records are the wave's h2_fields.mjs,
//                        exactly.
//   THE LEAK GATE        no lab number within ten graded tolerances of a graded
//                        answer, in seven unit shiftings; a planted leak is shown
//                        red and removed.
//   THE EVIDENCE GATE    every reader that returns a heat limit or a WBGT built
//                        from weights carries the transcription-only label, and
//                        every heat panel prints it.
//   THE VOCABULARY GATE  never bare "dose" and never a bare "exchange rate" in the
//                        lab, the panels or the page.
//   THE REFUSAL GATE     every refusal a panel prints is the engine's own message;
//                        no message is typed into a panel.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as LAB from './hygieneLab.js';
import { GRADED_FIELDS, gradedTolerance } from './gradedTolerance.js';
import { waveInput, waveDir, readingMirror } from '../../../../../tools/course-waves/waveInputs.mjs';

const L = { ...LAB };
const WAVE_NAME = 'hygiene';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const PANEL_FILES = ['NoiseDosimeterExplorer.jsx', 'ProtectionChemicalsExplorer.jsx', 'HeatStressExplorer.jsx'];
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/HygieneLearningPage.jsx');
const read = (p) => {
  if (!fs.existsSync(p)) throw new Error(`missing source ${p}: a rename must move this gate with it`);
  return fs.readFileSync(p, 'utf8');
};
const SOURCES = [
  ['hygieneLab.js', read(path.join(HERE, 'hygieneLab.js'))],
  ['hygieneKit.jsx', read(path.join(HERE, 'hygieneKit.jsx'))],
  ...PANEL_FILES.map((f) => [f, read(path.join(HERE, f))]),
  ['HygieneLearningPage.jsx', read(LEARNING_PAGE)],
];

const e6 = (x) => Number(x).toFixed(6);
const e12 = (x) => Number(x).toFixed(12);

/** The digest split into its numbered sections. */
const SECTIONS = (() => {
  const out = {};
  let cur = 0;
  DIGEST.split('\n').forEach((line) => {
    const m = /^# SECTION (\d+):/.exec(line);
    if (m) cur = Number(m[1]);
    out[cur] = (out[cur] || '') + line + '\n';
  });
  return out;
})();

/** Which digest sections each reader teaches from. */
const READER_SECTIONS = {
  threeCriteria: [6, 7, 9],
  warnings: [8],
  publishedTables: [3, 4, 5],
  inverses: [5, 9],
  extendedShift: [20],
  lex: [11, 12],
  protectors: [2, 13],
  chemicals: [1, 14, 15],
  briefScala: [21],
  heat: [16, 17],
  disagreement: [18],
  evidence: [2],
  errata: [19],
};

/** Every finite number a reader returns, with its path. */
const numbersOf = (obj, at = '') => {
  if (typeof obj === 'number') return Number.isFinite(obj) ? [[at, obj]] : [];
  if (Array.isArray(obj)) return obj.flatMap((x, i) => numbersOf(x, `${at}[${i}]`));
  if (obj && typeof obj === 'object') return Object.entries(obj).flatMap(([k, v]) => numbersOf(v, at ? `${at}.${k}` : k));
  return [];
};

describe('THE H2 LAB against the teaching digest', () => {
  it('reads its inputs through the course-wave resolver and says which copy it read', () => {
    expect(DIGEST.length).toBeGreaterThan(50000);
    console.log(`[hygiene lab] read the digest from ${readingMirror(WAVE_NAME) ? 'the committed copy' : 'a live wave directory'}: ${waveDir(WAVE_NAME)}`);
  });

  it('declares a section list for every reader and every reader returns', () => {
    expect(Object.keys(L.READERS).sort()).toEqual(Object.keys(READER_SECTIONS).sort());
    Object.entries(L.READERS).forEach(([name, fn]) => expect(() => fn(), name).not.toThrow());
  });

  Object.entries(READER_SECTIONS).forEach(([name, secs]) => {
    it(`${name}: every finite number it returns is printed in digest section ${secs.join(', ')}`, () => {
      const text = secs.map((s) => SECTIONS[s] || '').join('\n');
      expect(text.length, `sections ${secs.join(', ')} are empty`).toBeGreaterThan(500);
      const nums = numbersOf(L.READERS[name]());
      expect(nums.length, `${name} returns too few numbers to be a reader`).toBeGreaterThan(3);
      const missing = nums.filter(([, v]) => !text.includes(e6(v)) && !text.includes(e12(v))
        && !(Number.isInteger(v) && new RegExp(`(^|[^\\d.])${v}([^\\d.]|$)`).test(text)));
      expect(missing.map(([p, v]) => `${p}=${v}`), `${name} returns numbers its digest sections do not print`).toEqual([]);
    });
  });

  it('THE PIN HAS TEETH: a number off by one in the sixth decimal is not found', () => {
    const v = L.threeCriteria().oben[0].dosePct;
    expect(SECTIONS[7]).toContain(e6(v));
    expect(SECTIONS[7]).not.toContain(e6(v + 1e-6));
  });
});

describe('THE RECORDS GATE: the lab carries the wave teaching records exactly', () => {
  it('every teaching record in the lab equals the one in h2_fields.mjs', async () => {
    const W = await import(pathToFileURL(waveInput(WAVE_NAME, 'h2_fields.mjs')).href);
    const names = Object.keys(W).sort();
    expect(names.length).toBeGreaterThan(20);
    names.forEach((k) => expect(L[k], `${k} is in h2_fields.mjs and not in the lab`).toBeDefined());
    names.forEach((k) => expect(JSON.parse(JSON.stringify(L[k])), k).toEqual(JSON.parse(JSON.stringify(W[k]))));
  });
});

describe('THE EIGHTEEN GRADED FIELDS, recomputed through this worktree\'s vendored engine', () => {
  it('the committed capstone generator reproduces fields.json exactly', () => {
    const rows = JSON.parse(execFileSync(process.execPath, [waveInput(WAVE_NAME, 'h2_capstone.mjs'), '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        H2_ENGINES: path.join(ROOT, 'packages', 'engines'),
        H2_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
      },
    }));
    expect(rows).toHaveLength(18);
    expect(rows.map((r) => [r.tier, r.key, r.value, gradedTolerance(r.key)])).toEqual(FIELDS);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
  });
});

describe('THE LEAK GATE: no lab number is a graded answer', () => {
  const SHIFTS = [1, 1e3, 1e-3, 1e2, 1e-2, 60, 1 / 60];
  const labNumbers = () => Object.entries(L.READERS).flatMap(([name, fn]) => numbersOf(fn(), name));
  const leaks = (nums, fields) => {
    const out = [];
    fields.forEach(([, key, value, tol]) => SHIFTS.forEach((s) => nums.forEach(([p, v]) => {
      if (Math.abs(v - value * s) <= 10 * tol * Math.abs(s)) out.push(`${p}=${v} is ${key} x${s}`);
    })));
    return out;
  };

  it('sweeps a real surface', () => {
    expect(labNumbers().length).toBeGreaterThan(1000);
  });

  it('no lab number sits within ten graded tolerances of a graded answer in any unit shifting', () => {
    expect(leaks(labNumbers(), FIELDS)).toEqual([]);
  });

  it('THE CONTROL: a planted leak is caught and names the field', () => {
    const [, key, value] = FIELDS[3];
    const hits = leaks([...labNumbers(), ['PLANTED', value]], FIELDS);
    expect(hits.some((h) => h.startsWith('PLANTED') && h.includes(key))).toBe(true);
  });
});

describe('THE EVIDENCE GATE: the heat equations carry their status everywhere', () => {
  it('every reader that returns a heat limit or a weighted WBGT carries the transcription-only label', () => {
    expect(L.heat().evidence).toBe(L.TRANSCRIPTION_ONLY);
    expect(L.heat().wbgt.evidence).toBe(L.WBGT_TRANSCRIPTION_ONLY);
    expect(L.disagreement().evidence).toBe(L.TRANSCRIPTION_ONLY);
    expect(L.TRANSCRIPTION_ONLY).toMatch(/transcription only/);
  });

  it('the heat panel prints the evidence banner in every view that shows a limit or a weighted WBGT', () => {
    const src = SOURCES.find(([f]) => f === 'HeatStressExplorer.jsx')[1];
    ['WbgtMode', 'LimitsMode', 'EvidenceMode'].forEach((m) => {
      const body = src.slice(src.indexOf(`export const ${m}`), src.indexOf('export const', src.indexOf(`export const ${m}`) + 10));
      expect(body, `${m} prints no evidence banner`).toMatch(/<Evidence>/);
    });
  });

  it('the evidence table classes the heat equations and the WBGT weights as transcription only', () => {
    const ev = Object.fromEntries(L.evidence().map((r) => [r.fn, r.cls]));
    ['nioshRecommendedAlertLimitC', 'nioshRecommendedExposureLimitC', 'wbgtIndoorC', 'wbgtOutdoorC', 'nioshHeatAssessment']
      .forEach((fn) => expect(ev[fn], fn).toBe('TRANSCRIPTION ONLY'));
    expect(ev.noiseDose).toBe('PUBLISHED, REPRODUCED');
  });
});

describe('THE VOCABULARY AND REFUSAL GATES', () => {
  SOURCES.forEach(([file, text]) => {
    it(`${file}: never a bare "dose" and never a bare "exchange rate"`, () => {
      const bareDose = [...text.matchAll(/(?<!noise |a daily )\bdose\b/gi)].map((m) => text.slice(Math.max(0, m.index - 30), m.index + 10));
      expect(bareDose, `${file} writes a bare "dose"`).toEqual([]);
      const bareRate = [...text.matchAll(/(?<!decibel )\bexchange rate\b/gi)];
      expect(bareRate.length, `${file} writes a bare "exchange rate"`).toBe(0);
    });
  });

  it('THE VOCABULARY CONTROL: a planted bare "dose" is caught', () => {
    expect([...'the dose was high'.matchAll(/(?<!noise |a daily )\bdose\b/gi)].length).toBe(1);
    expect([...'the noise dose was high'.matchAll(/(?<!noise |a daily )\bdose\b/gi)].length).toBe(0);
  });

  it('no panel types an engine refusal message: every quoted message arrives from the lab', () => {
    const messages = [
      L.inverses().zeroDoseTwa.message, L.inverses().overADay.message, L.protectors().fieldOnC.message,
      L.chemicals().stelTooLong.message, ...L.heat().refusals.map((r) => r.message),
    ];
    expect(messages.length).toBe(7);
    SOURCES.forEach(([file, text]) => messages.forEach((m) => expect(text.includes(m), `${file} types "${m}"`).toBe(false)));
  });

  it('this test file names no path under /root', () => {
    expect(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8')).not.toMatch(/\/root\//);
  });
});
