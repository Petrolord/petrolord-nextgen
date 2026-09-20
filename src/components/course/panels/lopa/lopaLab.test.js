// Every value the H3 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/lopa/digest.txt),
// which is nothing but the LOPA engine's return values on the teaching streams
// and the vendored golden.
//
// THE GATES IN THIS FILE:
//   THE STREAM GATE    the lab's teaching streams are deep-equal to the wave's
//                      h3_fields.mjs, read from the committed copy, so the lab
//                      and the digest generator run the same inputs.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest at a precision the digest declares
//                      (twelve decimals for frequencies, probabilities and
//                      PFDavg; six for RRFs, hours and years; failure rates and
//                      TMELs in exponent form as stated; whole numbers as
//                      written), and a set of named figures is pinned to the
//                      exact digest row that prints it.
//   THE REBUILD GATE   the committed h3_dump.mjs, run in a child process
//                      against THIS repository's vendored engine and the
//                      committed wave inputs, reproduces the committed digest
//                      byte for byte, under two time zones.
//   THE ENGINE GATE    every interactive route returns exactly what the engine
//                      returns, refusals included, and no refusal message is
//                      written as a literal in the lab.
//   THE LEAK GATE      no number the lab exports sits within TEN ABSOLUTE
//                      tolerances of a graded answer in any of five unit
//                      shiftings. A leak is planted and caught.
//   THE CLOCK GATE     no clock and no random number in the lab.
// The capstone guard over the panels and the page is panelCapstoneGuard.test.js.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as E from '@petrolord/engines/engines/hse/lopa.js';
import * as L from './lopaLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'lopa';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'lopaLab.js'), 'utf8');

/** Every numeric leaf of a value, with its path. Booleans and strings are not numbers. */
const leaves = (v, at = '') => {
  if (typeof v === 'number') return [[at, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${at}[${i}]`));
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => leaves(x, `${at}.${k}`));
  return [];
};
const ex = (x) => Number(x).toExponential().replace(/\.?0+e/, 'e');
/** Is this number printed in the digest, at a precision the digest declares? */
const printed = (x) => {
  const cands = Number.isInteger(x) ? [String(x)] : [x.toFixed(6), x.toFixed(12), String(x), ex(x)];
  return cands.some((c) => new RegExp(`(?<![\\d.])${c.replace(/[.+]/g, (m) => `\\${m}`)}(?![\\d])`).test(DIGEST));
};

const READERS = {
  worksheet: L.worksheet,
  forgotten: L.forgotten,
  loop: L.loop,
  bands: L.bands,
  snap: L.snap,
  simplified: L.simplified,
  annexB: L.annexB,
  mrtSweep: L.mrtSweep,
  coverageSweep: L.coverageSweep,
  betaSweep: L.betaSweep,
  twoOfTwo: L.twoOfTwo,
  iduSif: L.iduSif,
  publishedSif: L.publishedSif,
  sensitivityTable: L.sensitivityTable,
  longestIntervals: L.longestIntervals,
  coverageFloor: L.coverageFloor,
  judgement: L.judgement,
};

describe('THE STREAM GATE: the lab runs the digest generator\'s own teaching streams', () => {
  it('every stream the lab carries is deep-equal to h3_fields.mjs in the committed wave inputs, and the other way round', async () => {
    const T = await import(pathToFileURL(waveInput(WAVE, 'h3_fields.mjs')).href);
    const names = Object.keys(L.STREAMS);
    expect(names.length).toBeGreaterThanOrEqual(20);
    names.forEach((n) => {
      expect(T[n], `${n} is in the lab and not in h3_fields.mjs`).toBeDefined();
      expect(JSON.parse(JSON.stringify(L.STREAMS[n])), n).toEqual(JSON.parse(JSON.stringify(T[n])));
    });
    expect(Object.keys(T).sort(), 'h3_fields.mjs carries a stream the lab does not').toEqual([...names].sort());
    console.log(`[lopa lab] ${names.length} teaching streams deep-equal to the committed h3_fields.mjs, both ways`);
  });
});

describe('THE DIGEST GATE: every number a teaching reader returns is printed in the digest', () => {
  it('walks every reader and finds every numeric leaf in the digest', () => {
    let total = 0;
    const missing = [];
    Object.entries(READERS).forEach(([name, fn]) => {
      const ls = leaves(fn()).filter(([, x]) => x !== 0);
      expect(ls.length, `${name} returned no numbers`).toBeGreaterThan(0);
      ls.forEach(([at, x]) => {
        total += 1;
        if (!printed(x)) missing.push(`${name}${at} = ${x}`);
      });
    });
    expect(missing, 'lab numbers the digest does not print').toEqual([]);
    expect(total).toBeGreaterThan(300);
    console.log(`[lopa lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('named figures sit on the exact digest rows that print them', () => {
    const w = L.worksheet();
    expect(DIGEST).toContain(`| unmitigated frequency, per year | \`unmitigatedFrequencyPerYr\` | ${w.unmitigatedFrequencyPerYr.toFixed(12)} |`);
    expect(DIGEST).toContain(`| required RRF, the first over the second | \`requiredRrf\` | ${w.requiredRrf.toFixed(6)} |`);
    expect(DIGEST).toContain(`| required SIF PFDavg, one over the RRF | \`requiredSifPfdAvg\` | ${w.requiredSifPfdAvg.toFixed(12)} |`);
    expect(w.outcome).toBe('SIL1');
    expect(new Set(w.ladder.map((x) => x.outcome)).size).toBe(6);
    w.ladder.forEach((x) => expect(DIGEST).toContain(`| ${ex(x.tmelPerYr)} | ${x.requiredRrf.toFixed(6)} | ${x.outcome} |`));
    const lp = L.loop();
    expect(lp.rows[1].sifSil).toBe(2);
    expect(lp.rows[1].meetsTmel).toBe(false);
    lp.rows.forEach((x) => expect(DIGEST).toContain(`| ${x.sifPfdAvg} | ${x.sifSil} | ${x.mitigatedFrequencyPerYr.toFixed(12)} | ${x.meetsTmel} |`));
    const s = L.snap();
    expect(s.products.filter((x) => x.double === '100.00000000000001').length).toBeGreaterThanOrEqual(2);
    s.products.forEach((x) => expect(DIGEST).toContain(`| ${x.factors} |`));
    L.annexB().forEach((x) => expect(DIGEST).toContain(`| ${x.architecture} | ${x.tCE.toFixed(6)} |`));
    const idu = L.iduSif();
    expect(DIGEST).toContain(`| PFDavg | ${idu.pfdAvg.toFixed(12)} |`);
    expect(DIGEST).toContain(`| RRF | ${idu.rrf.toFixed(6)} |`);
    expect(idu.meetsTmel).toBe(true);
    const p = L.publishedSif();
    expect(p.rows.every((x) => x.threeFigures === x.printed)).toBe(true);
    expect(Math.round(p.rrf)).toBe(777);
    expect(DIGEST).toContain(`| PFDavg | ${p.pfdAvg.toFixed(12)} | ${p.printed.pfdAvg} |`);
    const j = L.judgement();
    j.stretched.forEach((x) => expect(DIGEST).toContain(`| ${x.years} | ${x.pfdAvg.toFixed(12)} | ${x.rrf.toFixed(6)} | ${x.sil} | ${x.meetsTmel} |`));
    const firstMiss = j.stretched.find((x) => !x.meetsTmel);
    expect(firstMiss.sil).toBe(j.stretched[0].sil);
    L.longestIntervals().states.forEach((x) => expect(x.state).toBe(x.name));
  });

  it('every refusal the lab samples is the engine\'s own message and the digest quotes it verbatim', () => {
    const rs = L.refusalSamples();
    expect(rs.length).toBe(6);
    rs.forEach((r) => {
      expect(typeof r.error).toBe('string');
      expect(DIGEST, `${r.fn} ${r.what}`).toContain(`| \`${r.field}\` | ${r.error} |`);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the ${r.fn} message as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'h3_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      H3_WAVE_DIR: mirrorDir(WAVE),
      H3_ENGINES: path.join(ROOT, 'packages/engines'),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  it('byte for byte under UTC and under America/Los_Angeles, against this repository\'s vendored engine', () => {
    const committed = fs.readFileSync(path.join(mirrorDir(WAVE), 'digest.txt'), 'utf8');
    const a = rebuild('UTC');
    const b = rebuild('America/Los_Angeles');
    expect(a.length).toBeGreaterThan(40000);
    expect(a).toBe(committed);
    expect(b).toBe(committed);
    console.log(`[lopa lab] the committed h3_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 60000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const sub = { architecture: '1oo2', lambdaDuPerHour: 3.3e-6, proofTestIntervalHours: 4380, mrtHours: 12, beta: 0.08 };
    const row = { initiatingEventFrequencyPerYr: 0.6, tmelPerYr: 1e-5, ipls: [{ name: 'alarm', pfd: 0.1, independent: true }] };
    const cases = [
      [L.scenario, E.lopaScenario, [row]],
      [L.scenario, E.lopaScenario, [{ ...row, tmelPerYr: undefined }]],
      [L.outcomeOf, E.outcomeFromRequiredRrf, [1000]],
      [L.bandOf, E.silFromPfdAvg, [0.001]],
      [L.subsystem, E.pfdAvgSubsystem, [sub]],
      [L.subsystem, E.pfdAvgSubsystem, [{ ...sub, beta: undefined }]],
      [L.sifOf, E.pfdAvgSif, [[sub, { ...sub, architecture: '1oo1' }]]],
      [L.sensitivity, E.proofTestSensitivity, [sub, [2190, 8760]]],
      [L.longest, E.maxProofTestInterval, [sub, 0.002]],
      [L.longest, E.maxProofTestInterval, [sub, 1]],
      [L.decadeOf, E.decadeOf, [0.001]],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(...args)).toEqual(eng(...args)));
  });
  it('a blank is a question and a zero is a statement, and independence reaches the engine as typed', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseSeries('1, 2 3;4').values).toEqual([1, 2, 3, 4]);
    expect(L.parseSeries('').error).toBeTruthy();
    expect(L.parseProbabilityRows('ignition, 0.5\nperson present, 0.2').rows).toEqual([
      { name: 'ignition', probability: 0.5 }, { name: 'person present', probability: 0.2 }]);
    const ipl = L.parseIplRows('alarm, 0.1, true\ntrip, 0.1, yes\nprocedure, 0.1, true, false').rows;
    expect(ipl).toEqual([
      { name: 'alarm', pfd: 0.1, independent: true },
      { name: 'trip', pfd: 0.1, independent: 'yes' },
      { name: 'procedure', pfd: 0.1, independent: true, auditable: false },
    ]);
    const r = L.scenario({ initiatingEventFrequencyPerYr: 0.6, tmelPerYr: 1e-5, ipls: ipl });
    expect(r.credited.map((c) => c.name)).toEqual(['alarm']);
    expect(r.notCredited.map((c) => c.name)).toEqual(['trip', 'procedure']);
    expect(L.parseIplRows(L.iplText(L.STREAMS.ORONI.ipls)).rows).toEqual(JSON.parse(JSON.stringify(L.STREAMS.ORONI.ipls)));
    expect(L.parseProbabilityRows(L.rowsText(L.STREAMS.ORONI.conditionalModifiers)).rows)
      .toEqual(JSON.parse(JSON.stringify(L.STREAMS.ORONI.conditionalModifiers)));
  });
});

describe('THE LEAK GATE: no lab number is a graded answer', () => {
  const SCALES = [1, 1e3, 1e-3, 1e2, 1e-2];
  const sweep = (values) => {
    const hits = [];
    FIELDS.forEach(([, key, v, tol]) => SCALES.forEach((sc) => values.forEach(([at, x]) => {
      if (Math.abs(x - v * sc) <= 10 * tol * sc) hits.push(`${at} = ${x} is within ten tolerances of ${key} x${sc}`);
    })));
    return hits;
  };
  const all = () => Object.entries(READERS).flatMap(([n, fn]) => leaves(fn()).map(([at, x]) => [`${n}${at}`, x]));
  it('the answer key is eighteen fields with absolute tolerances', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([, , , tol]) => expect(tol).toBeGreaterThan(0));
  });
  it('sweeps every number the lab exports and finds none, over a surface large enough to mean something', () => {
    const values = all();
    expect(values.length).toBeGreaterThan(300);
    expect(sweep(values)).toEqual([]);
    console.log(`[lopa lab] ${values.length} lab numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  });
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  });
  it('the lab holds no tolerance and names no capstone facility', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(akpo|usan|yoho)\b/i);
  });
});

describe('THE CLOCK GATE', () => {
  it('no clock, no random number and no path under /root in the lab', () => {
    const code = LAB_SOURCE.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/Date\.now|new Date|Math\.random|performance\.now/);
    expect(LAB_SOURCE).not.toMatch(/\/root\//);
  });
  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
