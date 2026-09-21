// Every value the H5 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/qra/digest.txt),
// which is nothing but the QRA engine's return values on the teaching streams
// and the vendored golden.
//
// THE GATES IN THIS FILE:
//   THE STREAM GATE    the lab's teaching streams are deep-equal to the wave's
//                      h5_fields.mjs, read from the committed copy, so the lab
//                      and the digest generator run the same inputs.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest at a precision the digest declares
//                      (twelve decimals for frequencies, individual risks, PLL
//                      and probabilities; six for FAR, ratios and fatality
//                      counts; two for money; stated inputs as typed), and a set
//                      of named figures is pinned to the exact digest row that
//                      prints it.
//   THE REBUILD GATE   the committed h5_dump.mjs, run in a child process
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
import * as E from '@petrolord/engines/engines/hse/qra.js';
import * as L from './qraLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'qra';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'qraLab.js'), 'utf8');

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
  const cands = Number.isInteger(x) ? [String(x)] : [x.toFixed(2), x.toFixed(6), x.toFixed(12), String(x), ex(x)];
  return cands.some((c) => new RegExp(`(?<![\\d.])${c.replace(/[.+]/g, (m) => `\\${m}`)}(?![\\d])`).test(DIGEST));
};

const READERS = {
  overfill: L.overfill,
  branchSums: L.branchSums,
  release: L.release,
  forgotten: L.forgotten,
  ignitionTable: L.ignitionTable,
  places: L.places,
  people: L.people,
  transectTable: L.transectTable,
  appendix6b: L.appendix6b,
  crew: L.crew,
  offsite: L.offsite,
  criteria: L.criteria,
  fractionTable: L.fractionTable,
  alarpLadder: L.alarpLadder,
  firewall: L.firewall,
  checklist: L.checklist,
};

describe('THE STREAM GATE: the lab runs the digest generator\'s own teaching streams', () => {
  it('every stream the lab carries is deep-equal to h5_fields.mjs in the committed wave inputs, and the other way round', async () => {
    const T = await import(pathToFileURL(waveInput(WAVE, 'h5_fields.mjs')).href);
    const names = Object.keys(L.STREAMS);
    expect(names.length).toBeGreaterThanOrEqual(20);
    names.forEach((n) => {
      expect(T[n], `${n} is in the lab and not in h5_fields.mjs`).toBeDefined();
      expect(JSON.parse(JSON.stringify(L.STREAMS[n])), n).toEqual(JSON.parse(JSON.stringify(T[n])));
    });
    expect(Object.keys(T).sort(), 'h5_fields.mjs carries a stream the lab does not').toEqual([...names].sort());
    console.log(`[qra lab] ${names.length} teaching streams deep-equal to the committed h5_fields.mjs, both ways`);
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
    expect(total).toBeGreaterThan(250);
    console.log(`[qra lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('named figures sit on the exact digest rows that print them', () => {
    const o = L.overfill();
    expect(DIGEST).toContain(`| pool fire | ${o.totals['pool fire'].toFixed(12)} |`);
    L.places().lsir.forEach((x) => expect(DIGEST).toContain(`| ${x.place} | ${x.lsirPerYr.toFixed(12)} |`));
    const pp = L.people();
    expect(DIGEST).toContain(`IRPA ${pp.operator.irpaPerYr.toFixed(12)} per year`);
    expect(DIGEST).toContain(`IRPA ${pp.supervisor.irpaPerYr.toFixed(12)} per year`);
    L.forgotten().forEach((x) => expect(DIGEST).toContain(`| ${x.what} | ${x.explosion.toFixed(12)} | ${x.overRight.toFixed(6)} |`));
    const c = L.crew();
    expect(DIGEST).toContain(`PLL ${c.pllPerYr.toFixed(12)} fatalities per year`);
    expect(DIGEST).toContain(`FAR ${c.far.toFixed(6)}.`);
    expect(c.wholeCount).toBe(5);
    const k = L.criteria();
    expect(DIGEST).toContain(`State ${k.dutch.state}, worst ratio ${k.dutch.maxRatio.toFixed(6)}`);
    expect(k.touching.state).toBe('TOUCHES');
    expect(k.point.state).toBe('BELOW');
    L.offsite().points.forEach((p) => expect(DIGEST).toContain(`| ${p.fatalities.toFixed(6)} | ${p.cumulativeFrequencyPerYr.toFixed(12)} | ${p.moreThanN.toFixed(12)} | ${p.exactlyN.toFixed(12)} |`));
    L.snap().forEach((x) => expect(DIGEST).toContain(`| ${x.factors} | ${x.double} |`));
    const f = L.firewall();
    f.conventions.forEach((x) => expect(DIGEST).toContain(`| ${x.label} | ${x.fatalitiesPrevented.toFixed(6)} | ${x.presentValueCost.toFixed(2)} | ${x.icaf.toFixed(2)} |`));
    f.sweep.forEach((x) => expect(DIGEST).toContain(`| ${x.disproportionFactor} | ${x.costToBenefitRatio.toFixed(6)} | ${x.maximumReasonablyPracticableCost.toFixed(2)} |`));
    const ck = L.checklist();
    expect(ck.verdict).toBe('GROSSLY_DISPROPORTIONATE');
    expect(DIGEST).toContain(`| total benefit | ${ck.printed.total} | ${ck.presentValueBenefit.toFixed(2)} |`);
    const a = L.appendix6b();
    expect(DIGEST).toContain(`| probability of death Pd = Pcl Pci | ${a.printed.probabilityOfDeath} | ${a.chain.probabilityOfDeath.toFixed(12)} |`);
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
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'h5_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      H5_WAVE_DIR: mirrorDir(WAVE),
      H5_ENGINES: path.join(ROOT, 'packages/engines'),
      H5_REPO: ROOT,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  it('byte for byte under UTC and under America/Los_Angeles, against this repository\'s vendored engine', () => {
    const committed = fs.readFileSync(path.join(mirrorDir(WAVE), 'digest.txt'), 'utf8');
    const a = rebuild('UTC');
    const b = rebuild('America/Los_Angeles');
    expect(a.length).toBeGreaterThan(30000);
    expect(a).toBe(committed);
    expect(b).toBe(committed);
    console.log(`[qra lab] the committed h5_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 60000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const scen = [{ name: 'fire', frequencyPerYr: 3e-5, fatalityProbability: 0.4 }, { name: 'blast', frequencyPerYr: 1e-5, fatalityProbability: 0.9 }];
    const soc = [{ name: 'a', frequencyPerYr: 4e-6, fatalities: 25 }, { name: 'b', frequencyPerYr: 2e-5, fatalities: 4 }];
    const measure = { deltaPllPerYr: 5e-4, vpf: 1500000, lifetimeYears: 12, capitalCost: 40000, annualCost: 900, disproportionFactor: 4 };
    const cases = [
      [L.eventTree, E.eventTree, [{ initiatingFrequencyPerYr: 2e-3, tree: { branches: [{ name: 'x', probability: 0.25 }, { name: 'y', probability: 0.75 }] } }]],
      [L.eventTree, E.eventTree, [{ initiatingFrequencyPerYr: 2e-3, tree: { branches: [{ name: 'x', probability: 0.25 }] } }]],
      [L.flammableTree, E.flammableReleaseEventTree, [{ initiatingFrequencyPerYr: 7e-4, immediateIgnitionProbability: 0.05, delayedIgnitionProbability: 0.2 }]],
      [L.directIgnition, E.pbDirectIgnitionProbability, [{ releaseType: 'continuous', massRateKgS: 30, substance: 'k1-liquid' }]],
      [L.lsir, E.locationIndividualRisk, [{ scenarios: scen }]],
      [L.irpa, E.individualRiskPerAnnum, [{ locations: [{ name: 'deck', lsirPerYr: 2e-4, hoursPerYr: 900 }] }]],
      [L.pll, E.potentialLossOfLife, [{ scenarios: soc }]],
      [L.farOf, E.fatalAccidentRateFromPll, [{ pllPerYr: 1e-3, exposedHoursPerYr: 5e5 }]],
      [L.fnCurve, E.fnCurve, [{ scenarios: soc }]],
      [L.fnCompare, E.fnCriterionComparison, [{ scenarios: soc, criterion: 'vrom-establishments' }]],
      [L.fnCompare, E.fnCriterionComparison, [{ scenarios: soc, criterion: 'no-such-line' }]],
      [L.alarp, E.alarpBand, [{ individualRiskPerYr: 3e-4, thresholds: 'r2p2-public' }]],
      [L.costBenefit, E.costBenefit, [measure]],
      [L.costBenefit, E.costBenefit, [{ ...measure, disproportionFactor: 0.9 }]],
      [L.fractions, E.pbFatalityFractions, [{ effect: 'toxic', probabilityOfDeath: 0.3, period: 'night' }]],
      [L.transect, E.lsirTransect, [{ distancesM: [0, 50], scenarios: [{ name: 'f', frequencyPerYr: 1e-5, fatalityProbabilities: [1, 0.1] }] }]],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(...args)).toEqual(eng(...args)));
  });
  it('a blank is a question and a zero is a statement', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseSeries('1, 2 3;4').values).toEqual([1, 2, 3, 4]);
    expect(L.parseSeries('').error).toBeTruthy();
    expect(L.parseRows('fire, 0.0001, 0.3\nblast, 0.00002, ', ['frequencyPerYr', 'fatalityProbability']).rows).toEqual([
      { name: 'fire', frequencyPerYr: 0.0001, fatalityProbability: 0.3 }, { name: 'blast', frequencyPerYr: 0.00002 }]);
    const keys = ['frequencyPerYr', 'fatalities'];
    expect(L.parseRows(L.rowsText(L.STREAMS.JISIKE_OFFSITE, keys), keys).rows).toEqual(JSON.parse(JSON.stringify(L.STREAMS.JISIKE_OFFSITE)));
    const blank = L.lsir({ scenarios: L.parseRows('fire, 0.0001, ', ['frequencyPerYr', 'fatalityProbability']).rows });
    expect(blank.field).toBe('scenarios[0].fatalityProbability');
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
    expect(values.length).toBeGreaterThan(250);
    expect(sweep(values)).toEqual([]);
    console.log(`[qra lab] ${values.length} lab numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  });
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  });
  it('the lab holds no tolerance and names no capstone facility', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(ukpokiti|ogini|ebughu)\b/i);
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
