// Every value the H4 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/consequence/digest.txt),
// which is nothing but the consequence engine's return values on the teaching streams
// and the vendored golden.
//
// THE GATES IN THIS FILE:
//   THE STREAM GATE    the lab's teaching streams are deep-equal to the wave's
//                      h4_fields.mjs, read from the committed copy, so the lab
//                      and the digest generator run the same inputs.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest at a precision the digest declares
//                      (six decimals for most quantities, twelve for view
//                      factors, hole areas, mass transfer coefficients and
//                      evaporation fluxes; stated inputs as typed), and a set
//                      of named figures is pinned to the exact digest row that
//                      prints it.
//   THE REBUILD GATE   the committed h4_dump.mjs, run in a child process
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
import * as E from '@petrolord/engines/engines/hse/consequence.js';
import * as L from './consequenceLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'consequence';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'consequenceLab.js'), 'utf8');

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
  liquidTeaching: L.liquidTeaching,
  gasTeaching: L.gasTeaching,
  poolTeaching: L.poolTeaching,
  evaporationTeaching: L.evaporationTeaching,
  sigmaTeaching: L.sigmaTeaching,
  plumeTeaching: L.plumeTeaching,
  reachTeaching: L.reachTeaching,
  burningTeaching: L.burningTeaching,
  flameTeaching: L.flameTeaching,
  sepTeaching: L.sepTeaching,
  viewFactorTeaching: L.viewFactorTeaching,
  bagsterTeaching: L.bagsterTeaching,
  solidFlameTeaching: L.solidFlameTeaching,
  yellowBookPoolFire: L.yellowBookPoolFire,
  blastTeaching: L.blastTeaching,
  probitTeaching: L.probitTeaching,
  toxicTeaching: L.toxicTeaching,
};

describe('THE STREAM GATE: the lab runs the digest generator\'s own teaching streams', () => {
  it('every stream the lab carries is deep-equal to h4_fields.mjs in the committed wave inputs, and the other way round', async () => {
    const T = await import(pathToFileURL(waveInput(WAVE, 'h4_fields.mjs')).href);
    const names = Object.keys(L.STREAMS);
    expect(names.length).toBeGreaterThanOrEqual(20);
    names.forEach((n) => {
      expect(T[n], `${n} is in the lab and not in h4_fields.mjs`).toBeDefined();
      expect(JSON.parse(JSON.stringify(L.STREAMS[n])), n).toEqual(JSON.parse(JSON.stringify(T[n])));
    });
    expect(Object.keys(T).sort(), 'h4_fields.mjs carries a stream the lab does not').toEqual([...names].sort());
    console.log(`[consequence lab] ${names.length} teaching streams deep-equal to the committed h4_fields.mjs, both ways`);
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
    expect(total).toBeGreaterThan(400);
    console.log(`[consequence lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('named figures sit on the exact digest rows that print them', () => {
    const l = L.liquidTeaching();
    expect(DIGEST).toContain(`| mass rate, kg/s | \`massRateKgS\` | ${l.massRateKgS.toFixed(6)} |`);
    l.heads.forEach((x) => expect(DIGEST).toContain(`| ${x.liquidHeadM} | ${x.drivingPressurePa.toFixed(6)} | ${x.massRateKgS.toFixed(6)} |`));
    const g = L.gasTeaching();
    expect(g.rows[0].regime).toBe('SUBSONIC');
    expect(g.rows.at(-1).regime).toBe('CHOKED');
    g.rows.forEach((x) => expect(DIGEST).toContain(`| ${x.upstreamPressurePa} | ${x.pressureRatio.toFixed(6)} | ${x.regime} | ${x.psi.toFixed(6)} |`));
    const r = L.reachTeaching();
    r.stack.forEach((x) => expect(DIGEST).toContain(`| ${x.target} | ${x.state} | ${x.peakConcentrationMgM3.toFixed(6)} |`));
    expect(r.stack.some((x) => x.state === 'REACHED' && x.nearDistanceM !== null)).toBe(true);
    const vf = L.viewFactorTeaching();
    expect(vf.filter((x) => x.field === 'tiltDeg').length).toBeGreaterThan(0);
    vf.filter((x) => !x.field).forEach((x) => expect(DIGEST).toContain(`| ${x.distanceFromAxisM} | ${x.viewFactorVertical.toFixed(12)} | ${x.viewFactorHorizontal.toFixed(12)} | ${x.viewFactorMax.toFixed(12)} |`));
    const y = L.yellowBookPoolFire();
    expect(DIGEST).toContain(`| heat flux at 100 m from the centre W/m2 | ${y.heatFluxWM2.toFixed(6)} | ${y.printed.heatFluxWM2} |`);
    const b = L.blastTeaching();
    b.forward.forEach((x) => expect(DIGEST).toContain(`| ${x.distanceM} | ${x.scaledDistanceMKg13.toFixed(6)} | ${x.overpressurePa.toFixed(6)} |`));
    const t = L.toxicTeaching();
    t.chlorine.forEach((x) => expect(DIGEST).toContain(`${x.leesProbability.toFixed(6)}`));
    expect(DIGEST).toContain(`gives a toxic load of ${t.history.toFixed(6)}`);
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
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'h4_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      H4_WAVE_DIR: mirrorDir(WAVE),
      H4_ENGINES: path.join(ROOT, 'packages/engines'),
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
    console.log(`[consequence lab] the committed h4_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 60000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const hole = { dischargeCoefficient: 0.61, holeDiameterM: 0.03, liquidDensityKgM3: 900, liquidHeadM: 2 };
    const g = { dischargeCoefficient: 0.61, holeDiameterM: 0.03, upstreamPressurePa: 3e5, upstreamTemperatureK: 290, molarMassKgMol: 0.028, heatCapacityRatio: 1.4 };
    const cases = [
      [L.liquid, E.liquidOrificeDischarge, hole],
      [L.liquid, E.liquidOrificeDischarge, { ...hole, liquidHeadM: -1 }],
      [L.gas, E.gasOrificeDischarge, g],
      [L.pool, E.poolFromSpill, { spillVolumeM3: 12, poolThicknessM: 0.03 }],
      [L.evaporation, E.poolEvaporationMackayMatsugu, { poolDiameterM: 4, windSpeed10mMS: 2, vapourPressurePa: 9000, molarMassKgMol: 0.1, liquidTemperatureK: 290 }],
      [L.sigmas, E.briggsRuralSigmas, { stabilityClass: 'C', downwindDistanceM: 700 }],
      [L.plume, E.gaussianPlume, { massRateKgS: 1, windSpeedMS: 2, stabilityClass: 'E', downwindDistanceM: 900 }],
      [L.plume, E.gaussianPlume, { massRateKgS: 1, windSpeedMS: 0, stabilityClass: 'E', downwindDistanceM: 900 }],
      [L.reachOf, E.plumeDistanceToConcentration, { massRateKgS: 1, windSpeedMS: 2, stabilityClass: 'E', targetConcentrationMgM3: 40 }],
      [L.burning, E.poolBurningRate, { method: 'babrauskas', fuel: 'benzene', poolDiameterM: 3 }],
      [L.flameLength, E.poolFireFlameLength, { method: 'thomas-wind', poolDiameterM: 9, burningFluxKgM2S: 0.07, windSpeed10mMS: 6 }],
      [L.tilt, E.poolFireTilt, { poolDiameterM: 9, windSpeed10mMS: 6, airKinematicViscosityM2S: 1.5e-5 }],
      [L.sep, E.surfaceEmissivePower, { method: 'mudan-diameter', poolDiameterM: 9 }],
      [L.viewFactor, E.cylinderViewFactor, { flameRadiusM: 4, flameLengthM: 11, distanceFromAxisM: 30, tiltDeg: 25 }],
      [L.bagster, E.atmosphericTransmissivityBagster, { waterVapourPartialPressurePa: 1200, pathLengthM: 40 }],
      [L.tnt, E.tntEquivalentMass, { fuelMassKg: 900, heatOfCombustionJKg: 46e6, yieldFactor: 0.05, tntBlastEnergyJKg: 4.5e6 }],
      [L.blast, E.kinneyGrahamOverpressure, { distanceM: 70, tntMassKg: 90 }],
      [L.blastDistance, E.distanceForOverpressure, { tntMassKg: 90, overpressurePa: 15000 }],
      [L.thermal, E.thermalProbit, { coefficients: 'lees', heatFluxWM2: 15000, exposureTimeS: 25 }],
      [L.toxic, E.toxicProbit, { coefficients: 'lees-phosgene', concentrationPpm: 20, exposureMinutes: 10 }],
      [L.overpressureHarm, E.overpressureProbit, { overpressurePa: 40000 }],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(args)).toEqual(eng(args)));
    expect(L.toProbability(4.2)).toEqual(E.probitToProbability(4.2));
    expect(L.toProbit(0.3)).toEqual(E.probabilityToProbit(0.3));
    expect(L.toxicLoad({ n: 1.5, history: [{ concentration: 10, minutes: 3 }] })).toEqual(E.toxicDose({ n: 1.5, history: [{ concentration: 10, minutes: 3 }] }));
  });
  it('a blank is left to the engine\'s default, a zero is a statement, and a history round trips', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseSeries('1, 2 3;4').values).toEqual([1, 2, 3, 4]);
    expect(L.parseSeries('').error).toBeTruthy();
    expect(L.typed({ a: 1, b: undefined })).toEqual({ a: 1 });
    expect(L.liquid({ ...L.STREAMS.AMENAM_LIQUID, pressureAboveLiquidPa: undefined }))
      .toEqual(E.liquidOrificeDischarge({ ...L.STREAMS.AMENAM_LIQUID, pressureAboveLiquidPa: E.ATM_PA }));
    expect(L.parseHistory(L.historyText(L.STREAMS.TOXIC_HISTORY))).toEqual(JSON.parse(JSON.stringify(L.STREAMS.TOXIC_HISTORY)));
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
    expect(values.length).toBeGreaterThan(400);
    expect(sweep(values)).toEqual([]);
    console.log(`[consequence lab] ${values.length} lab numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  });
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  });
  it('the lab holds no tolerance and names no capstone facility', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(okan|yokri|pennington)\b/i);
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
