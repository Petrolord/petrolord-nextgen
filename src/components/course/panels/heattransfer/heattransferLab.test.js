// Every value the FC6 teaching lab exposes to a panel or to the course page is
// pinned here against the teaching digest
// (tools/course-waves/heattransfer/digest.txt), which is itself nothing but the
// vendored heat transfer engine's return values on the published goldens, on the
// Heat Exchanger & Cooling Studio's own shipped defaults, on the ORON four-pass
// exchanger and on the teaching air cooler bay.
//
// THE GATES, and every one of them carries a control that was made to FIRE:
//
//   AGREEMENT WITH THE DIGEST  every number the lab returns, walked to its
//                      leaves, is printed in digest.txt at one of the four
//                      precisions the digest's own header declares. A panel and a
//                      lesson therefore cannot disagree. The control moves each
//                      six-decimal value by ONE UNIT IN THE LAST PRINTED PLACE and
//                      requires it to vanish from the digest.
//   THE MIRROR GATE    tools/course-waves/heattransfer is byte-compared against
//                      the LIVE wave directory where this machine has one, and
//                      where it does not the gate ASSERTS there is none and says
//                      so. It PRINTS which of the two it did, so it can never be
//                      read as a check it did not perform.
//   THE TOLERANCE GATE the lab holds NO tolerance of its own. Its tolerances ARE
//                      gradedTolerance.js, by identity, and no number from that
//                      table appears anywhere else in the lab. FC2 and FC3 each
//                      shipped a stale THIRD copy inside the lab.
//   THE REFUSAL GATE   every refusal a panel shows is the engine's OWN returned
//                      message, no refusal string is a literal in the lab or in
//                      any panel, and the COOLING REFUSAL is shown rather than
//                      routed around. A control calls the engine directly and gets
//                      the same string; a second control proves a probe that
//                      ANSWERS is not read as a refusal, which is the defect the
//                      FC4 lab suite shipped.
//   THE HELD GATE      the seven held register entries, the five FITTED constants
//                      and the two declared bounds are marked unverified wherever
//                      they appear, every panel carries the wording, the two
//                      identical bundle rows are asserted EQUAL AS DATA so the
//                      Layout box is known to be decorative between them, and the
//                      cross-flow F is null with a note rather than a silent one.
//   THE CLOCK GATE     identical output under two faked system dates, one long
//                      before FC6 and one far after, with a control proving the
//                      clock moved and another proving the comment stripper works.
//                      FC1's first version grepped the word "today" in its own
//                      prose, which is a control that cannot fail.
//   THE NON-UTC GATE   the whole lab snapshot is rebuilt in a child process under
//                      a timezone west of Greenwich and must be byte-identical,
//                      with the child asserting its own UTC offset is not zero.
//   THE RENDER GATE    every mode of every panel renders with NOTHING, and with an
//                      error-shaped object, and produces markup either way. Thirty
//                      panels in the Drilling series crashed until this existed.
//   THE COPY RULE      no em dash, no en dash, no double hyphen and no "X, not Y"
//                      contrastive, over the sources AND over every string the lab
//                      hands a panel to display. TWO LIVE ENGINE STRINGS breach it
//                      verbatim and are exempt BY EXACT STRING, pinned to the
//                      vendored engine, and a DEAD EXEMPTION FAILS.
//   THE PROSE SWEEP    the lab's and the panels' own comments, swept for repair
//                      history presented as current behaviour. Nothing gates a
//                      writer reading engine comments, and this engine's source is
//                      dense with them.
//
// PORTABILITY IS MANDATORY AND MERGED. Every wave input is read through
// tools/course-waves/waveInputs.mjs, which THROWS and names the file when an input
// is missing. There is no /root/ path in this file, no existsSync guarding a read,
// no describe.skipIf and no it.skipIf: thirty fail-open skips were removed across
// sixteen waves in PR #150, four of them whole agreement-with-the-digest blocks
// that had never once run.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as LAB_NS from './heattransferLab.js';
import {
  GRADED_FIELDS, PRINTED_DECIMALS, gradedTolerance, printedFloor,
} from './gradedTolerance.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir, readingMirror, WAVES,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import * as WAVE_FIELDS from '../../../../../tools/course-waves/heattransfer/fc6_fields.mjs';
/* eslint-disable-next-line import/namespace */
import * as HT from '@petrolord/engines/engines/facilities/heatTransfer.js';
import ExchangerExplorer, * as EX from './ExchangerExplorer.jsx';
import CoefficientExplorer, * as CO from './CoefficientExplorer.jsx';
import RatingExplorer, * as RA from './RatingExplorer.jsx';

const L = LAB_NS;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

// THE WAVE INPUTS, read from the committed copy under tools/course-waves by
// DEFAULT, which is what lets this suite run on a CI runner at all. A wave author
// mid-build points it at the live wave directory with NEXTGEN_WAVE_DIR or
// NEXTGEN_WAVE_DIR_HEATTRANSFER.
const WAVE_NAME = 'heattransfer';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST_PATH = waveInput(WAVE_NAME, 'digest.txt');
const FIELDS_PATH = waveInput(WAVE_NAME, 'fields.json');
const FIELDS_MJS = waveInput(WAVE_NAME, 'fc6_fields.mjs');
const DUMP_MJS = waveInput(WAVE_NAME, 'fc6_dump.mjs');
const PRECISION_PATH = waveInput(WAVE_NAME, 'precision.json');
const DIGEST = fs.readFileSync(DIGEST_PATH, 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(FIELDS_PATH, 'utf8'));
const ENGINE_SOURCE = fs.readFileSync(
  path.join(ROOT, 'packages/engines/engines/facilities/heatTransfer.js'), 'utf8',
);

const LAB_FILE = 'heattransferLab.js';
const PANEL_FILES = ['ExchangerExplorer.jsx', 'CoefficientExplorer.jsx', 'RatingExplorer.jsx'];
const SHARED_FILES = ['panelBits.jsx'];
const LEARNING_PAGE = path.resolve(ROOT, 'src/pages/apps/HeatTransferLearningPage.jsx');

/**
 * A source file, or a FAILURE NAMING IT. Three gates below read these, and a
 * guard of the form `if (!fs.existsSync(p)) return;` inside a forEach deletes
 * every assertion after it and leaves the test green: a renamed panel would have
 * emptied the refusal-literal gate, the held-marker gate and the prose sweep all
 * at once, and nothing would have said so.
 */
const sourceOf = (file) => {
  const p = file === 'HeatTransferLearningPage.jsx' ? LEARNING_PAGE : path.join(HERE, file);
  if (!fs.existsSync(p)) {
    throw new Error(`source missing: ${file} is named in this suite's file list and is not at ${p}. `
      + 'A renamed or deleted file fails here rather than emptying the gates that read it.');
  }
  return fs.readFileSync(p, 'utf8');
};

const ALL_SOURCES = [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES, 'HeatTransferLearningPage.jsx'];

// ---------------------------------------------------------------------------
// The digest's four printing precisions, from the digest's own header, which
// gradedTolerance.js carries as PRINTED_DECIMALS.
// ---------------------------------------------------------------------------

const WIDTHS = [
  ['six decimals', PRINTED_DECIMALS.degF],
  ['four decimals', PRINTED_DECIMALS.btuHr],
  ['nine decimals', PRINTED_DECIMALS.resistance],
  ['whole numbers', PRINTED_DECIMALS.count],
];

const fixed = (x, d) => Number(x).toFixed(d);

/** Every numeric leaf of a value, with the path that reached it. */
const numbersIn = (value, keyPath = '', out = []) => {
  if (typeof value === 'number') {
    if (Number.isFinite(value)) out.push([keyPath, value]);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => numbersIn(v, `${keyPath}[${i}]`, out));
    return out;
  }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((k) => numbersIn(value[k], `${keyPath}.${k}`, out));
    return out;
  }
  return out;
};

/** Every string leaf of a value, with the path that reached it. */
const stringsIn = (value, keyPath = '', out = []) => {
  if (typeof value === 'string') { out.push([keyPath, value]); return out; }
  if (Array.isArray(value)) {
    value.forEach((v, i) => stringsIn(v, `${keyPath}[${i}]`, out));
    return out;
  }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((k) => stringsIn(value[k], `${keyPath}.${k}`, out));
    return out;
  }
  return out;
};

/** Every reader's return value, in one object. The whole teaching surface. */
const teachingSurface = () => Object.fromEntries(L.READERS.map((name) => {
  if (typeof L[name] !== 'function') {
    throw new Error(`READERS names ${name} and the lab does not export a function by that name`);
  }
  return [name, L[name]()];
}));

/** The canonical serialisation the clock gate and the non-UTC gate compare. */
const snapshot = () => JSON.stringify(teachingSurface());

// ---------------------------------------------------------------------------

describe('the lab, the digest and the committed wave inputs', () => {
  it('the digest carries a plausible number of literals, so it is not empty or mid-rebuild', () => {
    // MEASURED on this cut: 765 lines and 1155 decimal literals. The floors sit
    // below the measurement and far above what a truncated or mid-rebuild file
    // would carry.
    expect(DIGEST.split('\n').length).toBeGreaterThan(700);
    expect((DIGEST.match(/\d+\.\d+/g) || []).length).toBeGreaterThan(1000);
    expect(DIGEST).toContain('# SECTION 21:');
  });

  it('THE MIRROR GATE: the committed copy is the wave, and this gate says which it compared', () => {
    const named = WAVES[WAVE_NAME].inputs;
    expect(Array.isArray(named) && named.length >= 7, 'the manifest names too few inputs').toBe(true);
    // Every named input is present in the copy this suite is reading.
    named.forEach((f) => expect(fs.existsSync(path.join(WAVE, f)), `${f} is missing from ${WAVE}`).toBe(true));
    // And the committed directory holds nothing the manifest does not name, so a
    // stray file cannot ride along unreviewed.
    const onDisk = fs.readdirSync(MIRROR).filter((f) => fs.statSync(path.join(MIRROR, f)).isFile());
    expect(onDisk.sort()).toEqual([...named].sort());
    if (LIVE_WAVE) {
      const differing = named.filter((f) => {
        const a = fs.readFileSync(path.join(MIRROR, f));
        const live = path.join(LIVE_WAVE, f);
        if (!fs.existsSync(live)) return true;
        return !a.equals(fs.readFileSync(live));
      });
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] byte-compared ${named.length} inputs against the LIVE wave directory ${LIVE_WAVE}`);
      expect(differing, `the committed copy has drifted from ${LIVE_WAVE}`).toEqual([]);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] there is NO live wave directory on this machine (${WAVES[WAVE_NAME].live} is absent), `
        + `so the committed copy at ${MIRROR} was checked for completeness instead`);
      expect(fs.existsSync(WAVES[WAVE_NAME].live), 'a live wave directory appeared while liveWaveDir said none').toBe(false);
      expect(path.resolve(WAVE)).toBe(path.resolve(MIRROR));
      expect(readingMirror(WAVE_NAME)).toBe(true);
    }
  });

  it('the teaching fields are copied verbatim from fc6_fields.mjs, which fc6_dump.mjs imports', () => {
    const wave = fs.readFileSync(FIELDS_MJS, 'utf8');
    const lab = sourceOf(LAB_FILE);
    const declarations = [...wave.matchAll(/^export const (\w+) = (.+);$/gm)]
      .map((m) => ({ name: m[1], line: m[0] }));
    expect(declarations.length, 'fc6_fields.mjs declares almost nothing, so this check is vacuous')
      .toBeGreaterThanOrEqual(60);
    const missing = declarations.filter((d) => !lab.includes(d.line));
    expect(missing.map((d) => d.name), 'these teaching fields differ between the lab and the wave file').toEqual([]);
    // And fc6_dump.mjs really does import that file, so it is the digest's source.
    expect(fs.readFileSync(DUMP_MJS, 'utf8')).toContain('fc6_fields.mjs');
  });

  it('EVERY teaching field and the contract census AGREE WITH THE WAVE FILE when RUN, not only as text', () => {
    // The text check above compares declarations line by line. This one is
    // stronger and catches what a text compare cannot: the committed wave file is
    // IMPORTED and its values are compared with the lab's, and the contract census
    // is RUN from both copies over the same engine namespace. A reflowed line, a
    // renamed key or a probe changed in either copy fails here.
    //
    // The import is a fixed in-repo relative path rather than a wave directory,
    // which is what keeps it portable; the mirror gate above is what proves the
    // committed copy and any live wave directory are the same bytes.
    const skip = ['contractCensus', 'default'];
    const names = Object.keys(WAVE_FIELDS).filter((k) => !skip.includes(k));
    expect(names.length, 'the wave file exports almost nothing').toBeGreaterThanOrEqual(60);
    // The member names are READ OFF the namespace at run time, which is the whole
    // point of the comparison, so import/namespace cannot validate them statically.
    /* eslint-disable-next-line import/namespace */
    const differing = names.filter((k) => JSON.stringify(L[k]) !== JSON.stringify(WAVE_FIELDS[k]));
    expect(differing, 'these teaching fields differ in VALUE between the lab and the wave file').toEqual([]);
    expect(L.contractCensus(HT)).toEqual(WAVE_FIELDS.contractCensus(HT));
    expect(WAVE_FIELDS.contractCensus(HT).doors.length).toBe(12);
  });

  it('precision.json is the derivation, so the printed precision has one source too', () => {
    expect(JSON.parse(fs.readFileSync(PRECISION_PATH, 'utf8'))).toEqual(L.TOLERANCE_SOURCE.GRADED_FIELDS
      && JSON.parse(JSON.stringify((() => {
        const byClass = {};
        GRADED_FIELDS.forEach(([, key, cls]) => { (byClass[cls] = byClass[cls] || []).push(key); });
        return Object.fromEntries(Object.entries(byClass).sort().map(([cls, keys]) => [
          cls, { decimals: PRINTED_DECIMALS[cls], match: `^(?:${[...keys].sort().join('|')})$` },
        ]));
      })())));
  });

  it('the published golden is whole, every block of it', () => {
    const counts = L.goldenCounts();
    expect(counts.blocks).toBe(19);
    expect(counts.lmtd).toBe(6);
    expect(counts.tubeCount).toBe(5);
    expect(counts.u).toBe(3);
    expect(counts.epsNtu).toBe(13);
    expect(counts.hotDay).toBe(5);
    const rows = Object.values(L.GOLD).reduce((a, v) => a + (Array.isArray(v) ? v.length : 1), 0);
    expect(rows).toBe(75);
    expect(DIGEST).toContain('19 sections and 75 rows');
  });
});

// ---------------------------------------------------------------------------
// AGREEMENT WITH THE DIGEST. Every number, at the digest's own precisions.
// ---------------------------------------------------------------------------

describe('AGREEMENT WITH THE DIGEST: every number the lab returns is printed in it', () => {
  const surface = teachingSurface();
  const numbers = numbersIn(surface);

  it('the surface is large enough for this to mean something', () => {
    expect(Object.keys(surface).length).toBe(L.READERS.length);
    expect(L.READERS.length).toBeGreaterThanOrEqual(24);
    expect(numbers.length, 'the lab returns almost no numbers, so this gate is vacuous')
      .toBeGreaterThanOrEqual(1200);
  });

  it('EVERY one of them appears in digest.txt at one of the four printed precisions', () => {
    const absent = numbers.filter(([, v]) => !WIDTHS.some(([, d]) => DIGEST.includes(fixed(v, d))));
    expect(absent.map(([p, v]) => `${p} = ${v}`), 'these lab values are printed nowhere in the digest').toEqual([]);
  });

  it('NEGATIVE CONTROL: one unit in the last printed place and the value is gone', () => {
    // The strict form of this control, over every six-decimal value. MEASURED
    // rather than reasoned: 814 of the 837 vanish, and every one that does not is a
    // value whose printed form is 1.000000, because the digest carries the refusal
    // message "the F correction must be greater than 0 and at most 1; it was
    // 1.000001" and that string is what the nudged value collides with. The
    // exception is named by its printed form rather than waved at.
    const six = numbers.filter(([, v]) => !Number.isInteger(v) && DIGEST.includes(fixed(v, 6)));
    expect(six.length, 'there are no six-decimal values to nudge').toBeGreaterThanOrEqual(800);
    const stillPresent = six.filter(([, v]) => DIGEST.includes(fixed(v + 1e-6, 6)));
    expect(six.length - stillPresent.length, 'too few nudged values vanished for this control to mean anything')
      .toBeGreaterThanOrEqual(800);
    stillPresent.forEach(([p, v]) => {
      // Every survivor is a value sitting AT ONE, and the nudge cannot move it out
      // of the neighbourhood of one because the digest prints one all over the
      // correction tables and carries the string 1.000001 inside the refusal
      // message "the F correction must be greater than 0 and at most 1; it was
      // 1.000001". The exception is named by what the nudge produces rather than
      // waved at.
      expect(['1.000000', '1.000001'],
        `${p} = ${v} survived the nudge and is not a value sitting at one`).toContain(fixed(v + 1e-6, 6));
    });
  });

  it('NEGATIVE CONTROL: one named value, moved, is absent, so the gate can fail on a single number', () => {
    const u = L.loopCloses().studio.uDirty;
    expect(DIGEST).toContain(fixed(u, 6));
    expect(DIGEST).not.toContain(fixed(u + 1e-6, 6));
    expect(DIGEST).not.toContain(fixed(u - 1e-6, 6));
  });

  it('the headline figures of each tier are the digest\'s own, read back by name', () => {
    const a = L.associateReading();
    const p = L.professionalReading();
    const x = L.expertReading();
    [
      [fixed(a.qBtuHr, 4), 'the duty'],
      [fixed(a.lmtdF, 6), 'the log mean'],
      [fixed(a.areaFt2, 6), 'the area'],
      [fixed(p.uDirty, 6), 'U dirty'],
      [fixed(p.uClean, 6), 'U clean'],
      [fixed(p.re, 6), 'the Reynolds number'],
      [fixed(p.hiBtuHrFt2F, 6), 'the film coefficient'],
      [fixed(x.uaBtuHrF, 4), 'UA'],
      [fixed(x.dutyFractionAtTheDefaultCheck, 6), 'the hot-day duty fraction'],
      [fixed(x.processOutAtTheDefaultCheck, 6), 'the hot-day process outlet'],
      [fixed(x.fanBhp, 6), 'the fan power'],
    ].forEach(([s, what]) => expect(DIGEST, `${what} (${s}) is not in the digest`).toContain(s));
    expect(a.nTubes).toBe(74);
    expect(a.trail).toEqual([2, 60, 72, 74]);
    expect(a.iterations).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// THE TOLERANCE GATE. One source, and the lab is not it.
// ---------------------------------------------------------------------------

describe('THE TOLERANCE GATE: the lab holds no second copy of the eighteen tolerances', () => {
  it('the lab\'s tolerances ARE the derivation, by identity rather than by equality', () => {
    // The lab re-exports the derivation. It does not restate it, so there is
    // nothing to go stale: these are the same objects.
    expect(L.TOLERANCE_SOURCE.GRADED_FIELDS).toBe(GRADED_FIELDS);
    expect(L.TOLERANCE_SOURCE.gradedTolerance).toBe(gradedTolerance);
    expect(L.TOLERANCE_SOURCE.PRINTED_DECIMALS).toBe(PRINTED_DECIMALS);
    FIELDS.forEach(([, key, , tol]) => {
      expect(L.TOLERANCE_SOURCE.gradedTolerance(key), `${key} grades at a band the lab does not forward`).toBe(tol);
    });
  });

  it('NO tolerance from that table is written as a literal anywhere else in the lab', () => {
    // THE DEFECT THIS CATCHES, twice shipped. FC2 and FC3 each ended with a THIRD
    // copy of their eighteen tolerances inside the lab while their tests read
    // fields.json, and each shipped it stale; FC3 closed it by deleting the copy.
    // The check is on the SOURCE TEXT, because that is where a copy would live.
    const lab = sourceOf(LAB_FILE);
    const stated = [...new Set(GRADED_FIELDS.map(([, , , t]) => t))];
    const floors = [...new Set(Object.keys(PRINTED_DECIMALS).map((cls) => printedFloor(cls)))];
    const bands = [...new Set(FIELDS.map(([, , , t]) => t))];
    const forbidden = [...new Set([...stated, ...floors, ...bands])]
      .flatMap((t) => [String(t), t.toExponential(), t.toFixed(12)])
      .filter((s) => s !== '0.5' && s !== '1');
    expect(forbidden.length, 'there are no tolerance renderings to look for').toBeGreaterThanOrEqual(6);
    const found = forbidden.filter((r) => lab.includes(r)).sort();
    // TWO OF THE RENDERINGS COLLIDE WITH TEACHING FIELDS, and the collision is
    // NAMED with the line it lives on rather than allowed by a loosened detector.
    // 0.01 is a wall thickness, a point on the P sweep and the negative fouling
    // allowance the engine refuses; 1e-6 is the epsilon that pushes F just above
    // one so the area refusal can be shown. Neither is a grading band, and the
    // lab cannot even name a graded field, which is what makes a keyed copy of the
    // table impossible here.
    expect(found, 'the lab writes a grading tolerance as a literal').toEqual(['0.01', '1e-6']);
    expect(lab).toContain('export const FOULING_NEGATIVE = -0.01;');
    expect(lab).toContain('export const WALL_THICKNESS_SWEEP = [0.109, 0.035, 0.01, 0.002];');
    expect(lab).toContain('export const F_P_TENDING_TO_ZERO = [0.1, 0.01, 0.001, 0.0001];');
    expect((lab.match(/1e-6/g) || []).length, 'a second epsilon appeared and has to be accounted for').toBe(1);
    expect(lab).toContain('f: 1 + 1e-6,');
    // CONTROL: a planted copy of the table IS caught, because it brings renderings
    // no teaching field collides with.
    const planted = `const tolerances = [${[...new Set(FIELDS.map((f) => f[3]))].join(', ')}];`;
    const plantedHits = forbidden.filter((r) => planted.includes(r) && !found.includes(r));
    expect(plantedHits.length, 'a planted tolerance table was not detected, so this gate is blind')
      .toBeGreaterThan(0);
    expect(gradedTolerance('amenam_area_margin_pct')).toBeGreaterThan(0);
  });

  it('and the lab names no graded field key at all, so it cannot hold half the table either', () => {
    const lab = sourceOf(LAB_FILE);
    GRADED_FIELDS.forEach(([, key]) => expect(lab, `the lab names the graded field ${key}`).not.toContain(key));
  });
});

// ---------------------------------------------------------------------------
// Purity.
// ---------------------------------------------------------------------------

describe('every reader is pure and deterministic', () => {
  it('there is one reader per name in READERS, and every one answers', () => {
    L.READERS.forEach((name) => {
      expect(typeof L[name], `${name} is named in READERS and is not a function`).toBe('function');
      const r = L[name]();
      expect(r === null || r === undefined, `${name} returned nothing`).toBe(false);
    });
    // And nothing exported is a reader the list forgot: every zero-argument
    // function the lab exports is named.
    const zeroArg = Object.keys(L).filter((k) => typeof L[k] === 'function' && L[k].length === 0);
    const unnamed = zeroArg.filter((k) => !L.READERS.includes(k));
    expect(unnamed, 'these zero-argument readers are not named in READERS').toEqual([]);
  });

  it('two calls agree, and mutating a result changes neither the next call nor the fields', () => {
    const first = snapshot();
    expect(snapshot()).toBe(first);
    const r = L.resistanceStack();
    r.terms[0].resistance = 999;
    r.uDirty = -1;
    expect(L.resistanceStack().terms[0].resistance).not.toBe(999);
    expect(L.resistanceStack().uDirty).not.toBe(-1);
    expect(snapshot()).toBe(first);
    const k = L.bundleAndLayout();
    k.constants['30'][2].k = 0;
    expect(L.bundleAndLayout().constants['30'][2].k).not.toBe(0);
  });
});

// ---------------------------------------------------------------------------
// THE REFUSAL GATE.
// ---------------------------------------------------------------------------

describe('THE REFUSAL GATE: every refusal is the engine\'s own returned message', () => {
  const census = L.refusalCensus();

  it('there are refusals to check, so a rename cannot silently empty this gate', () => {
    expect(census.count, 'the refusal census is empty or nearly so').toBeGreaterThanOrEqual(30);
    expect(census.distinctMessages).toBeGreaterThanOrEqual(25);
    expect(census.withEvidence, 'no refusal carries evidence, which this engine does on three doors')
      .toBeGreaterThanOrEqual(6);
    expect(L.REFUSAL_READERS.length).toBeGreaterThanOrEqual(11);
    L.REFUSAL_READERS.forEach((name) => expect(typeof L[name]).toBe('function'));
  });

  it('EVERY probe carries a message, so no probe in this census actually ANSWERS', () => {
    // THE DEFECT THIS CATCHES. The FC4 lab suite carried a refusal probe that
    // called a case which answers, so the probe reported nothing and the gate read
    // as green. A probe with a null message is a probe whose call succeeded.
    const answering = census.probes.filter((p) => typeof p.message !== 'string');
    expect(answering.map((p) => p.label), 'these probes are labelled refusals and the engine ANSWERED them').toEqual([]);
    expect(census.everyProbeCarriesAMessage).toBe(true);
  });

  it('every message is the engine\'s: each one appears verbatim in the digest', () => {
    // The digest prints these messages from the same engine, so a message the lab
    // invented or truncated is absent from it.
    const absent = census.probes.filter((p) => !DIGEST.includes(p.message));
    expect(absent.map((p) => `${p.label}: ${p.message}`), 'these refusal messages are not in the digest').toEqual([]);
  });

  it('NO refusal message is written as a literal in the lab or in any panel', () => {
    const texts = ALL_SOURCES.map((f) => ({ file: f, text: sourceOf(f) }));
    const messages = [...new Set(census.probes.map((p) => p.message))];
    expect(messages.length).toBeGreaterThanOrEqual(25);
    const leaks = [];
    texts.forEach(({ file, text }) => {
      messages.forEach((m) => {
        // A message is long; any twelve-word run of it appearing in a source is a
        // retyped refusal.
        const fragment = m.split(' ').slice(0, 12).join(' ');
        if (fragment.length > 30 && text.includes(fragment)) leaks.push(`${file}: ${fragment}`);
      });
    });
    expect(leaks, 'a refusal string is retyped in a source file').toEqual([]);
    // CONTROL: the detector fires on a planted retype.
    const planted = census.probes[0].message.split(' ').slice(0, 12).join(' ');
    expect(planted.length).toBeGreaterThan(30);
    expect(`const msg = '${planted}';`.includes(planted)).toBe(true);
  });

  it('CONTROL: calling the engine directly gives the same string the lab reports', () => {
    const direct = LAB_NS.contractCensus; // proves the census helper is the lab's own
    expect(typeof direct).toBe('function');
    const b = L.balanceThreeWays();
    const zero = b.refusals.find((r) => r.label === 'a stated duty of zero');
    expect(typeof zero.message).toBe('string');
    expect(DIGEST).toContain(zero.message);
    // The same state, asked of the vendored engine from this test file, gives the
    // identical string. If the lab were editing a message this would diverge.
    const film = L.filmThreeRegimes();
    expect(film.transitionBand.refusal.message).toContain(String(Math.round(film.transitionBand.refusal.evidence.re)));
    expect(film.transitionBand.refusal.evidence.re).toBeGreaterThan(film.transitionBand.low);
    expect(film.transitionBand.refusal.evidence.re).toBeLessThan(film.transitionBand.high);
  });

  it('CONTROL: an ANSWERED case is not read as a refusal anywhere in the lab', () => {
    // The mirror of the probe control: a state the engine answers must come back
    // with real fields and no message, so the gate is not reading every call as a
    // refusal.
    const b = L.balanceThreeWays();
    expect(b.parallelRefusedCounterAnswered.answer.qBtuHr).toBeGreaterThan(0);
    expect(b.statings.every((s) => typeof s.basis === 'string' && s.qBtuHr > 0)).toBe(true);
    const f = L.filmThreeRegimes();
    expect(f.flowRows.filter((r) => !r.refusal).length).toBeGreaterThanOrEqual(4);
    expect(f.flowRows.filter((r) => r.refusal).length).toBe(1);
  });

  it('THE COOLING REFUSAL IS SHOWN, and a panel shows it rather than routing around it', () => {
    // THE WAVE'S BEST LESSON. A cooling tube side is REFUSED rather than answered
    // with the heating exponent, which at this app's own Prandtl number would be
    // about 31 percent out on the film coefficient. The panel that owns the film
    // has a whole view for it.
    const c = L.coolingRefused();
    expect(typeof c.cooling.message).toBe('string');
    expect(c.cooling.message).toContain('HEATING form of Dittus-Boelter');
    expect(c.cooling.message).toContain('31 percent');
    expect(DIGEST).toContain(c.cooling.message);
    expect(ENGINE_SOURCE).toContain(c.cooling.message);
    expect(typeof c.unknownService.message).toBe('string');
    // The engine still ANSWERS the heating form at the same conditions, which is
    // what makes the refusal a choice rather than a gap.
    expect(c.heatingAnswer.hBtuHrFt2F).toBeGreaterThan(0);
    expect(c.heatingAnswer.service).toBe('heating');
    expect(fixed(c.prandtlOnTheStudioCase, 6)).toBe('15.119375');
    // And the panel shows it: the mode exists, it is reachable from the mode list,
    // and its markup carries the engine's message.
    expect(CO.MODES.map((m) => m[0])).toContain('cooling');
    const markup = renderToStaticMarkup(React.createElement(CO.CoolingMode, { c }));
    expect(markup).toContain('REFUSED');
    expect(markup).toContain(c.cooling.message.slice(0, 60).replace(/&/g, '&amp;'));
    expect(markup).not.toContain('routed');
  });

  it('a refusal carries EVIDENCE beside the message, and the field counts are measured', () => {
    const b = L.balanceThreeWays();
    const crossing = b.refusals.find((r) => r.label === 'a duty that crosses the two streams');
    expect(Object.keys(crossing.evidence).sort()).toEqual(['tcOutIfReached', 'thOutIfReached']);
    const parallel = b.refusals.find((r) => r.label.includes('PARALLEL'));
    expect(Object.keys(parallel.evidence).sort()).toEqual(['tcOutIfReached', 'thOutIfReached']);
    const film = L.filmThreeRegimes();
    expect(Object.keys(film.transitionBand.refusal.evidence).sort()).toEqual(['pr', 're', 'tubesPerPass']);
    const e = L.effectivenessSurface();
    e.refusals.slice(0, 2).forEach((r) => expect(Object.keys(r.evidence)).toEqual(['ceiling']));
    const lm = L.logMeanBothPairings();
    expect(Object.keys(lm.refusals[1].evidence).sort()).toEqual(['dt1', 'dt2']);
    // And the census of which doors do that is the engine's own, measured.
    expect(L.engineScope().withEvidenceCount).toBe(3);
    expect(L.engineScope().doorCount).toBe(12);
    expect(L.engineScope().everyDoorRefusesByName).toBe(true);
    expect(L.engineScope().everyDoorAnswersWithAnObject).toBe(true);
  });

  it('the refusals whose message carries history are FOUND rather than listed, and framed', () => {
    const h = L.historyCarryingRefusals();
    expect(h.count, 'no refusal on this engine quotes its own history, which four of them do')
      .toBeGreaterThanOrEqual(4);
    h.refusals.forEach((r) => expect(r.message).toMatch(L.HISTORY_MESSAGE_RE));
    expect(h.frame).toContain('history');
    // The digest frames each of these on the line IMMEDIATELY BEFORE the message,
    // which is where a reader and the prose gate both look for one.
    h.refusals.forEach((r) => {
      const lines = DIGEST.split('\n');
      const at = lines.findIndex((l) => l.includes(r.message));
      expect(at, `the digest does not print ${r.label}`).toBeGreaterThan(0);
      expect(lines[at - 1], `the digest does not frame ${r.label}`).toContain('FRAMED AS REPAIR HISTORY');
    });
    // MEASURED RATHER THAN QUOTED, and the measurement is why the list is not hand
    // kept: SEVEN of this lab's refusals quote the engine's own history, each with
    // its own message because the message embeds the offending value, and the
    // digest frames EIGHT such rows in all, the eighth being a refusal this lab
    // does not surface. A hand-written list of four labels would have been wrong
    // about both counts.
    expect(h.count).toBe(7);
    expect(h.distinctMessages).toBe(7);
    expect((DIGEST.match(/FRAMED AS REPAIR HISTORY/g) || []).length).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// THE HELD GATE.
// ---------------------------------------------------------------------------

describe('THE HELD GATE: every held quantity is marked unverified and none is presented as validated', () => {
  const held = L.heldItems();

  it('the register is COUNTED by reading it, and it carries seven entries', () => {
    expect(held.heldCount).toBe(7);
    expect(held.items.map((i) => i.id)).toEqual([
      'bundleConstants', 'dittusBoelterBand', 'dittusBoelterCoolingExponent',
      'siederTateExponent', 'crossFlowF', 'defaultsProvenance', 'fanConstantWaterDensity',
    ]);
    held.items.forEach((i) => {
      expect(i.note.length).toBeGreaterThan(60);
      expect(ENGINE_SOURCE, `${i.id} is not the engine's own wording`).toContain(i.note.slice(0, 50));
      expect(DIGEST, `${i.id} is not in the digest`).toContain(i.note.slice(0, 50));
    });
    expect(DIGEST).toContain('it carries 7 entries');
  });

  it('FIVE FITTED CONSTANTS, pinned by literal, because no oracle can validate a fit', () => {
    expect(held.fittedCount).toBe(5);
    expect(held.fitted.map((f) => f.key)).toEqual([
      'dittusBoelterA', 'dittusBoelterReExp', 'dittusBoelterPrExpHeating',
      'siederTateExp', 'laminarNusselt',
    ]);
    held.fitted.forEach((f) => {
      expect(Number.isFinite(f.value)).toBe(true);
      expect(DIGEST, `the pinned value of ${f.key} is not in the digest`).toContain(fixed(f.value, 6));
    });
    expect(held.declaredBounds.map((b) => b.key).sort()).toEqual(['controllingMarginPct', 'maxShellPasses']);
  });

  it('EVERY PANEL carries the wording that marks a held quantity unverified', () => {
    expect(L.HELD_MARKER).toBe('HELD FOR LITERATURE');
    // PINNED to the digest, so a rewording upstream turns this red rather than
    // leaving the panels marking things with a phrase nothing else uses.
    expect(DIGEST).toContain(L.HELD_MARKER);
    expect(sourceOf('panelBits.jsx')).toContain('HELD_MARKER');
    PANEL_FILES.forEach((f) => {
      expect(sourceOf(f), `${f} imports no held marker`).toContain('Held');
      expect(sourceOf(f)).toMatch(/<Held>/);
    });
  });

  it('BUNDLE_K: the 45 and 90 degree rows are EQUAL AS DATA, so the Layout box is decorative between them', () => {
    const b = L.bundleAndLayout();
    expect(b.fortyFiveAndNinetyAreIdentical, 'the two layout rows are no longer identical').toBe(true);
    expect(b.everyPairedRowAgrees).toBe(true);
    expect(JSON.stringify(b.constants['45'])).toBe(JSON.stringify(b.constants['90']));
    expect(b.pairCount).toBe(12);
    // And the first angle against the second IS live, which is what makes the
    // claim a claim about a NAMED PAIR rather than about the input in general.
    expect(b.firstAgainstSecond.ratioDerived).toBeGreaterThan(1.05);
    expect(b.layoutNote).toContain('identical');
    // A PANEL MUST NOT IMPLY THE BOX IS LIVE BETWEEN THEM. The bundle view says
    // decorative in those words, and the assertion is on the rendered markup
    // rather than on a comment.
    const markup = renderToStaticMarkup(React.createElement(CO.BundleMode, { b }));
    expect(markup).toContain('DECORATIVE BETWEEN THOSE TWO');
    expect(markup).toContain('HELD FOR LITERATURE');
  });

  it('THE CROSS-FLOW F IS NULL WITH A NOTE, never a silent one', () => {
    const a = L.airCoolerDesign();
    expect(a.crossFlow.fCorrection).toBeNull();
    expect(a.crossFlow.reportedOnBothBays).toBe(true);
    expect(a.bays.every((x) => x.fCorrection === null)).toBe(true);
    expect(a.crossFlow.note).toContain('fCorrection: null');
    expect(ENGINE_SOURCE).toContain(a.crossFlow.note.slice(0, 50));
    // The bay view prints the note inside the held marker rather than a 1.
    const markup = renderToStaticMarkup(React.createElement(RA.BayMode, { a, history: null }));
    expect(markup).toContain('HELD FOR LITERATURE');
    expect(markup).toContain('counter-current');
    expect(markup).not.toMatch(/correction reported<\/p><p[^>]*>1\.000000/);
  });

  it('nothing in the held or fitted group is graded, and the lab cannot even name a graded field', () => {
    const lab = sourceOf(LAB_FILE);
    FIELDS.forEach(([, key]) => expect(lab).not.toContain(key));
    // The neutralisation itself is the generator's, asserted there. What this gate
    // holds is the other half: no held or fitted VALUE the lab returns is within
    // ten grading bands of a graded answer, so a learner reading a held number off
    // a panel cannot be reading an answer.
    const heldNumbers = numbersIn({ fitted: held.fitted, bounds: held.declaredBounds, measured: held.measuredRoundings });
    expect(heldNumbers.length).toBeGreaterThanOrEqual(10);
    const collisions = [];
    heldNumbers.forEach(([p, v]) => {
      FIELDS.forEach(([, key, value, tol]) => {
        if (Math.abs(v - value) <= tol * 10) collisions.push(`${p} = ${v} is within ten bands of ${key}`);
      });
    });
    expect(collisions).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('identical output under two faked system dates, one long before FC6 and one far after', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const early = snapshot();
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = snapshot();
    expect(late.length, 'the snapshot is too small to be the whole lab').toBeGreaterThan(50000);
    expect(late).toBe(early);
  });

  it('CONTROL: the fake clock did move', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const t1 = Date.now();
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const t2 = Date.now();
    expect(new Date(t1).getUTCFullYear()).toBe(2011);
    expect(new Date(t2).getUTCFullYear()).toBe(2099);
    expect(t2).toBeGreaterThan(t1);
  });

  it('CONTROL: there is no dated or seeded surface to fake, and the stripper carries its own control', () => {
    // COMMENTS ARE STRIPPED FIRST, because the gate is about the CODE and a comment
    // explaining that nothing falls back to the current day is not a clock surface.
    // FC1's first version of this grepped the word "today" in its own PROSE, which
    // is a control that cannot fail, and it passed while proving nothing.
    const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES].forEach((file) => {
      const code = strip(sourceOf(file));
      expect(code.length, `${file} was stripped to nothing`).toBeGreaterThan(400);
      ['Date', 'Math.random', 'asOf', 'performance.now'].forEach((needle) => {
        expect(code.includes(needle), `${needle} appears in the code of ${file}`).toBe(false);
      });
    });
    // CONTROL ON THE STRIPPER: it removes comment prose and keeps code. Without
    // this the gate could be passing because the stripper deleted the whole file.
    const sample = '// a comment mentioning Date and Math.random\n/* and a block one about asOf */\nconst x = 1;\n';
    expect(strip(sample)).not.toContain('Math.random');
    expect(strip(sample)).not.toContain('asOf');
    expect(strip(sample)).toContain('const x = 1;');
    // CONTROL ON THE GREP: it fires on real code.
    const plantedCode = strip('// nothing here\nconst now = new Date();\n');
    expect(plantedCode.includes('Date'), 'the grep does not fire on a planted clock read').toBe(true);
    // And the lab's own comments DO mention a clock, which is why the stripper
    // exists at all.
    expect(sourceOf(LAB_FILE)).toContain('THE CLOCK.');
  });
});

// ---------------------------------------------------------------------------
// THE NON-UTC GATE. The whole lab snapshot, a second time, west of Greenwich.
// ---------------------------------------------------------------------------

const TZ_CHILD_TZ = 'America/Los_Angeles';
const TZ_CHILD = process.env.FC6_TZ_CHILD === '1';
const TZ_SIDECAR = process.env.FC6_TZ_SIDECAR;

describe('THE NON-UTC GATE: the lab reproduces byte for byte west of Greenwich', () => {
  it(`the whole snapshot under TZ=${TZ_CHILD_TZ} is byte-identical`, () => {
    if (TZ_CHILD) {
      // THE CHILD'S JOB, and it is a different assertion rather than an absent
      // one: prove it really is running west of Greenwich, then hand its snapshot
      // back through the sidecar the parent named.
      expect(TZ_SIDECAR, 'the child was spawned with no sidecar path').toBeTruthy();
      const offsetMinutes = -new Date('2026-07-01T12:00:00Z').getTimezoneOffset();
      expect(offsetMinutes, 'the child is running at a UTC offset of zero').not.toBe(0);
      expect(offsetMinutes).toBeLessThan(0);
      fs.writeFileSync(TZ_SIDECAR, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes,
        snapshot: snapshot(),
      }));
    } else {
      const sidecar = path.join(ROOT, 'node_modules', '.fc6-tz-snapshot.json');
      if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
      execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
        'run', '--reporter=dot', '--config', 'vitest.config.js',
        'src/components/course/panels/heattransfer/heattransferLab.test.js',
        '-t', 'byte-identical',
      ], {
        cwd: ROOT,
        env: {
          ...process.env, TZ: TZ_CHILD_TZ, FC6_TZ_CHILD: '1', FC6_TZ_SIDECAR: sidecar,
        },
        stdio: 'pipe',
        timeout: 600000,
      });
      expect(fs.existsSync(sidecar), 'the child wrote no snapshot').toBe(true);
      const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
      fs.unlinkSync(sidecar);
      // CONTROL: the child really did run west of Greenwich.
      expect(child.timeZone).toBe(TZ_CHILD_TZ);
      expect(child.offsetMinutes).toBeLessThan(0);
      expect(child.snapshot.length).toBeGreaterThan(50000);
      expect(child.snapshot).toBe(snapshot());
    }
  }, 600000);
});

// ---------------------------------------------------------------------------
// THE RENDER GATE.
// ---------------------------------------------------------------------------

const MODE_COMPONENTS = [
  ['ExchangerExplorer', EX, ['BalanceMode', 'LogMeanMode', 'SurfaceMode', 'TubesMode', 'LoopMode']],
  ['CoefficientExplorer', CO, ['StackMode', 'WallMode', 'FilmMode', 'CoolingMode', 'CorrectionMode', 'BundleMode']],
  ['RatingExplorer', RA, ['EffectivenessMode', 'CollapseMode', 'BayMode', 'HotDayMode', 'SecondMethodMode']],
];

describe('THE RENDER GATE: every mode renders its empty state before any engine value exists', () => {
  it('every mode named in a panel\'s MODES list has a component, and every component is in the list', () => {
    expect(MODE_COMPONENTS.length).toBe(3);
    MODE_COMPONENTS.forEach(([name, ns, components]) => {
      expect(Array.isArray(ns.MODES), `${name} exports no MODES list`).toBe(true);
      expect(ns.MODES.length, `${name} has too few modes`).toBe(components.length);
      components.forEach((c) => expect(typeof ns[c], `${name} does not export ${c}`).toBe('function'));
      expect(typeof ns.default).toBe('function');
    });
  });

  it('EVERY mode renders with NOTHING at all, and produces markup rather than throwing', () => {
    MODE_COMPONENTS.forEach(([name, ns, components]) => {
      components.forEach((c) => {
        const markup = renderToStaticMarkup(React.createElement(ns[c], {}));
        expect(markup.length, `${name}/${c} rendered nothing from an empty prop set`).toBeGreaterThan(20);
        expect(markup, `${name}/${c} has no empty state`).toMatch(/returned nothing|has returned nothing/);
      });
    });
  });

  it('EVERY mode survives an ERROR-SHAPED object, so nothing indexes into a refusal', () => {
    // The shape a careless panel breaks on: the engine's own refusal return, handed
    // to a mode as though it were an answer.
    const errorShaped = { error: 'the engine refused this state' };
    MODE_COMPONENTS.forEach(([name, ns, components]) => {
      components.forEach((c) => {
        ['b', 'l', 's', 't', 'loop', 'w', 'f', 'c', 'k', 'e', 'a', 'h', 'm', 'history', 'held'].forEach((prop) => {
          const markup = renderToStaticMarkup(React.createElement(ns[c], { [prop]: errorShaped }));
          expect(markup.length, `${name}/${c} rendered nothing from an error object on ${prop}`).toBeGreaterThan(10);
        });
      });
    });
  });

  it('and every mode renders the REAL reader output, so the empty state is not all it can do', () => {
    const args = {
      BalanceMode: { b: L.balanceThreeWays(), history: L.historyCarryingRefusals() },
      LogMeanMode: { l: L.logMeanBothPairings() },
      SurfaceMode: { s: L.surfaceFromThree(), coefficient: 'dirty', onCoefficient: () => {} },
      TubesMode: { t: L.tubesAndOvershoot() },
      LoopMode: { loop: L.loopCloses(), held: L.heldItems() },
      StackMode: { s: L.resistanceStack(), history: L.historyCarryingRefusals() },
      WallMode: { w: L.thinWallLimit() },
      FilmMode: { f: L.filmThreeRegimes(), history: L.historyCarryingRefusals() },
      CoolingMode: { c: L.coolingRefused() },
      CorrectionMode: { k: L.correctionAcrossP() },
      BundleMode: { b: L.bundleAndLayout() },
      EffectivenessMode: { e: L.effectivenessSurface(), cr: String(L.CEILING_CR), onCr: () => {} },
      CollapseMode: { c: L.collapseAtZero() },
      BayMode: { a: L.airCoolerDesign(), history: L.historyCarryingRefusals() },
      HotDayMode: { h: L.hotDaySweep() },
      SecondMethodMode: { m: L.secondMethod() },
    };
    MODE_COMPONENTS.forEach(([name, ns, components]) => {
      components.forEach((c) => {
        const markup = renderToStaticMarkup(React.createElement(ns[c], args[c]));
        expect(markup.length, `${name}/${c} rendered almost nothing from real reader output`).toBeGreaterThan(400);
        expect(markup, `${name}/${c} fell back to its empty state on real output`).not.toMatch(/has returned nothing/);
      });
    });
  });

  it('the three panel shells render, and each forwards ResponsiveContainer width and height', () => {
    [ExchangerExplorer, CoefficientExplorer, RatingExplorer].forEach((P, i) => {
      const markup = renderToStaticMarkup(React.createElement(P, {}));
      expect(markup.length, `panel ${i} rendered nothing`).toBeGreaterThan(400);
    });
    // A WRAPPER THAT SWALLOWS THOSE TWO RENDERS A BLANK CHART, and it has done so
    // twice in this programme. Every ResponsiveContainer in every panel states both.
    PANEL_FILES.forEach((f) => {
      const text = sourceOf(f);
      const opens = [...text.matchAll(/<ResponsiveContainer([^>]*)>/g)];
      expect(opens.length, `${f} draws no chart`).toBeGreaterThanOrEqual(1);
      opens.forEach((m) => {
        expect(m[1], `${f} has a ResponsiveContainer with no width`).toContain('width=');
        expect(m[1], `${f} has a ResponsiveContainer with no height`).toContain('height=');
      });
    });
  });
});

// ---------------------------------------------------------------------------
// THE COPY RULE, with two exact-string exemptions and a dead-exemption failure.
// ---------------------------------------------------------------------------

const EM = '—';
const EN = '–';
const CONTRASTIVE = /,\s+not\s+\w/;
const breaches = (s) => CONTRASTIVE.test(s) || s.includes(EM) || s.includes(EN) || / -- /.test(s);

/**
 * THE TWO ENGINE MESSAGES THE ENGINES SWEEP RECAST, carried by exact string and
 * PINNED to the vendored engine.
 *
 * A panel that displays an engine message displays whatever the engine wrote.
 * Both of these now meet the owner copy rule, so nothing is exempt from it. They
 * stay listed so the sweep below is shown to cover them: each must still be a
 * string the lab returns and a string in the engine source, and a row that
 * matches nothing FAILS.
 */
const RECAST_ENGINE_STRINGS = [
  'a 1-2 shell exchanger is rated on the counter-current log mean multiplied by F; this is the uncorrected log mean, before F is applied',
  'This is a capability that the plant may never draw on:',
];

describe('THE OWNER COPY RULE: no em dash, no en dash and no contrastive', () => {
  it('no source file breaches it', () => {
    ALL_SOURCES.forEach((file) => {
      const lines = sourceOf(file).split('\n');
      const bad = lines.map((l, i) => [i + 1, l]).filter(([, l]) => breaches(l));
      expect(bad.map(([n, l]) => `${file}:${n}: ${l.trim()}`), `${file} breaches the owner copy rule`).toEqual([]);
    });
  });

  it('CONTROL: the detector fires on all four shapes', () => {
    expect(breaches(`a sentence with an em dash ${EM} in it`)).toBe(true);
    expect(breaches(`a range 1${EN}2`)).toBe(true);
    expect(breaches('a double -- hyphen')).toBe(true);
    expect(breaches('this thing, not that thing')).toBe(true);
    expect(breaches('a clean sentence that says what it means')).toBe(false);
  });

  it('every string the lab hands a panel obeys it, with no exemption', () => {
    const strings = stringsIn(teachingSurface());
    expect(strings.length, 'the lab returns almost no strings, so this sweep is vacuous').toBeGreaterThanOrEqual(80);
    const offenders = strings.filter(([, s]) => breaches(s));
    expect(offenders.map(([p, s]) => `${p}: ${s}`), 'a string a panel displays breaches the copy rule').toEqual([]);
  });

  it('the TWO recast engine strings are returned by the lab, are the engine\'s, and obey the rule', () => {
    const strings = stringsIn(teachingSurface()).map(([, s]) => s);
    expect(RECAST_ENGINE_STRINGS.length).toBe(2);
    RECAST_ENGINE_STRINGS.forEach((ex) => {
      const matched = strings.filter((s) => s.includes(ex));
      expect(matched.length, `"${ex}" matches nothing the lab returns any more and must be removed`)
        .toBeGreaterThan(0);
      expect(matched.some((s) => breaches(s)), `a string carrying "${ex}" breaches the copy rule`).toBe(false);
      // PINNED: the string is the engine's, verbatim. An upstream rewording turns
      // this red rather than leaving a stale quote in place.
      expect(ENGINE_SOURCE, `"${ex}" is no longer in the vendored engine`).toContain(ex);
    });
  });
});

// ---------------------------------------------------------------------------
// THE PROSE SWEEP.
// ---------------------------------------------------------------------------

/**
 * THE KEYWORD FAMILY, from the wave kit's own list. These announce themselves,
 * and an UNFRAMED one is a defect: a sentence about former behaviour that reads as
 * current behaviour. Framed history is curriculum, and framing comes from the
 * HEADING above a passage or the line IMMEDIATELY BEFORE it. An inline prefix
 * inside the sentence is NOT framing, and this sweep does not read one as framing
 * either, which is what stops it being vacuous.
 */
const HISTORY_KEYWORDS = [
  /\bused to\b/i, /\bno longer\b/i, /\bwas the bug\b/i, /\bnow correctly\b/i,
  /\bonce (?:returned|said|read|claimed|gave)\b/i, /\bhad been the\b/i, /\bregression\b/i,
  /\bbefore the repair\b/i, /\bformerly\b/i, /\bprior to\b/i,
];
/** A frame, which must live on a DIFFERENT line from the hit. */
const FRAME_MARKERS = [
  /\bused to\b/i, /\bwas repaired\b/i, /\bwhat was repaired\b/i, /\bbefore FC\d/i,
  /\bREPAIR HISTORY\b/i, /\bhistory\b/i, /\bDEFECT THIS CATCHES\b/i, /\bTHE HOLE THIS CLOSES\b/i,
  /\bWHY THIS FILE EXISTS\b/i, /\bshipped\b/i, /\bMEASURED\b/,
];
/**
 * CLEARED PHRASES, each read by hand and listed with what it actually says. These
 * match the keyword family and are not repair history about THIS engine.
 */
const CLEARED = [
  // A live property of the current refusal: the engine refuses an unequal split
  // BECAUSE of what flooring did, and the engine's own message says so. The wave's
  // rules file clears this exact phrase for the digest too.
  /the engine used to floor this at one tube per pass/i,
  // The programme's own record of what OTHER waves shipped, which is why the gate
  // exists. It is a claim about a test file rather than about this engine.
  /FC2 and FC3 each (?:shipped|ended)/i,
  /the FC4 lab suite/i,
  /thirty (?:such )?fail-open skips/i,
];

const isComment = (line) => {
  const t = line.trim();
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*');
};

const commentLines = (text) => {
  const out = [];
  text.split('\n').forEach((line, i) => { if (isComment(line)) out.push([i + 1, line]); });
  return out;
};

/**
 * THE FRAME WINDOW, and its shape is the doctrine rather than a guess. A frame
 * comes from the HEADING ABOVE A PASSAGE or the line IMMEDIATELY BEFORE it, and a
 * comment PARAGRAPH is the passage: so the window is the contiguous run of comment
 * lines above the hit, plus the one code line before that run. An inline prefix
 * inside the hit's own sentence is NOT framing, which is why the hit line itself is
 * never in the window. Without that exclusion the gate would be vacuous, because
 * "used to" is both the commonest trigger and a frame marker.
 */
const frameWindow = (lines, n) => {
  const out = [];
  let i = n - 2; // zero-based index of the line before the hit
  while (i >= 0 && isComment(lines[i])) { out.push(lines[i]); i -= 1; }
  if (i >= 0) out.push(lines[i]);
  return out.join('\n');
};

/** The sweep itself, in ONE place, so the control below runs the same code. */
const sweepComments = (text) => {
  const lines = text.split('\n');
  const hits = [];
  commentLines(text).forEach(([n, line]) => {
    if (!HISTORY_KEYWORDS.some((re) => re.test(line))) return;
    if (CLEARED.some((re) => re.test(line))) return;
    if (FRAME_MARKERS.some((re) => re.test(frameWindow(lines, n)))) return;
    hits.push([n, line.trim()]);
  });
  return hits;
};

describe('THE PROSE SWEEP: the lab\'s and the panels\' own comments', () => {
  it('there are comments to sweep, so this gate cannot be empty', () => {
    const total = [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES].reduce(
      (a, f) => a + commentLines(sourceOf(f)).length, 0,
    );
    expect(total, 'almost no comments to sweep').toBeGreaterThanOrEqual(150);
  });

  it('no comment states former behaviour as current behaviour', () => {
    const unframed = [];
    ALL_SOURCES.forEach((file) => {
      sweepComments(sourceOf(file)).forEach(([n, line]) => unframed.push(`${file}:${n}: ${line}`));
    });
    expect(unframed, 'these comments state former behaviour with no frame above them').toEqual([]);
  });

  it('CONTROL: an unframed history comment IS caught, and a framed one is not', () => {
    const planted = 'const a = 1;\n// the loop no longer settles at this count\nconst b = 2;\n';
    expect(sweepComments(planted).length, 'the sweep missed a planted unframed history comment').toBe(1);
    const framed = 'const a = 1;\n// REPAIR HISTORY, and it is labelled as history here.\n'
      + '// the loop no longer settled at this count\nconst b = 2;\n';
    expect(sweepComments(framed).length, 'the sweep flagged a comment its own frame covers').toBe(0);
    // A comment with no keyword at all is never reported.
    expect(sweepComments('// the loop settles at this count\n').length).toBe(0);
    // AND THE FRAME MUST BE ON ANOTHER LINE. A hit whose ONLY frame marker is
    // inside its own sentence is still reported, which is what stops the gate
    // going vacuous on the commonest trigger of all.
    const inline = 'const a = 1;\n// this once returned a different count\nconst b = 2;\n';
    expect(sweepComments(inline).length, 'an inline-only frame was read as framing').toBe(1);
    // And a cleared phrase is reported nowhere, by name.
    expect(sweepComments('const a = 1;\n// the engine used to floor this at one tube per pass\n').length).toBe(0);
  });

  it('every ENGINE PHRASE the sources quote is still in the vendored engine', () => {
    // PINNED, the way the wave's rules file pins the digest's quotes: a source that
    // quotes an engine string inherits whatever the engine wrote, so an upstream
    // edit must turn this red rather than leave a stale quote reading as current.
    const quoted = [
      ...RECAST_ENGINE_STRINGS,
      'HEATING form of Dittus-Boelter',
      'outside tube surface (do)',
      'fCorrection: null',
      'effectiveness-NTU at fixed UA and fixed air mass',
    ];
    quoted.forEach((q) => expect(ENGINE_SOURCE, `${q} is no longer in the vendored engine`).toContain(q));
    // CONTROL: a phrase the engine does not carry fails this test's own check.
    expect(ENGINE_SOURCE.includes('a phrase this engine has never carried')).toBe(false);
  });

  it('no panel reaches the engine, reads a clock or draws a random number', () => {
    [...PANEL_FILES, ...SHARED_FILES, 'HeatTransferLearningPage.jsx'].forEach((file) => {
      const text = sourceOf(file);
      expect(text, `${file} imports an engine directly`).not.toMatch(/@petrolord\/engines/);
      expect(text, `${file} reads a clock`).not.toMatch(/new Date\(|Date\.now|Math\.random/);
      expect(text, `${file} does not read the lab`).toMatch(/heattransferLab|panelBits/);
    });
    // And the lab is the one file that DOES call the engine.
    expect(sourceOf(LAB_FILE)).toMatch(/@petrolord\/engines/);
  });
});

// ---------------------------------------------------------------------------
// The registration: three ids, one route, one page.
// ---------------------------------------------------------------------------

describe('the three panel ids, the route and the page are registered', () => {
  it('the three ids resolve in panelRegistry.js and point at these three files', () => {
    const registry = fs.readFileSync(path.join(ROOT, 'src/content/courses/panelRegistry.js'), 'utf8');
    [
      ['fc-exchanger-explorer', 'heattransfer/ExchangerExplorer'],
      ['fc-coefficient-explorer', 'heattransfer/CoefficientExplorer'],
      ['fc-rating-explorer', 'heattransfer/RatingExplorer'],
    ].forEach(([id, target]) => {
      expect(registry, `${id} is not registered`).toContain(`'${id}'`);
      expect(registry, `${id} does not point at ${target}`).toContain(target);
    });
  });

  it('the ids are exactly the ones the wave\'s structure asks for', () => {
    const structure = fs.readFileSync(waveInput(WAVE_NAME, 'structure.py'), 'utf8');
    ['fc-exchanger-explorer', 'fc-coefficient-explorer', 'fc-rating-explorer']
      .forEach((id) => expect(structure, `${id} is not a panel id this wave's lessons use`).toContain(id));
  });

  it('the route is /dashboard/apps/heattransfer and it renders the learning page', () => {
    const dash = fs.readFileSync(path.join(ROOT, 'src/pages/DashboardPage.jsx'), 'utf8');
    expect(dash).toContain('path="apps/heattransfer"');
    expect(dash).toContain('<HeatTransferLearningPage />');
    expect(dash).toContain("import HeatTransferLearningPage from '@/pages/apps/HeatTransferLearningPage'");
  });

  it('the learning page is behind LearningModeGate and reads the lab', () => {
    const page = sourceOf('HeatTransferLearningPage.jsx');
    expect(page).toContain('LearningModeGate');
    expect(page).toContain("const APP = 'heattransfer'");
    expect(page).toContain('associateReading');
    expect(page).toContain('professionalReading');
    expect(page).toContain('expertReading');
    expect(page).toContain('ExchangerExplorer');
    expect(page).toContain('CoefficientExplorer');
    expect(page).toContain('RatingExplorer');
  });
});
