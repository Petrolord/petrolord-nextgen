// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// PD8's capstone is a different well, a different geometry, a different water
// cut and a different window from anything in this lab, and interventionLab.js
// carries no capstone material at all: there is no CAP, no graded field, no
// `capstoneValues`, nothing for a panel author to reach for by mistake. That is
// the first half of the guarantee and it is a design decision rather than a
// check.
//
// The second half is this file, and it is the half that can actually fail. Two
// wells can be different in every input and still land on the same number, and
// the grader does not care which well produced a figure. So this gate is
// arithmetic and not provenance: it takes the wave's graded field list, builds
// a forbidden neighbourhood around every graded answer, and checks EVERY number
// this lab exposes and EVERY number the shipped teaching digest prints against
// all of them.
//
// THE THRESHOLD IS THE GRADER'S OWN, AND IT IS ABSOLUTE.
//
// `public.academy_submit_capstone` grades each field with
//
//     if v_got is not null and abs(v_got - v_exp) <= v_tol then
//
// so `tol` is an absolute band in the field's own units and is NOT a fraction
// of the value. A log-log slope is accepted within 0.000002 OF ITSELF, not
// within 0.000002 per cent of itself. Read that function before touching the
// numbers below: a guard whose threshold is inferred rather than read comes out
// thousands of times too wide and passes everything.
//
// THE BAND IS TEN TIMES THAT, so a lesson or a tile that rounds a number in
// prose still cannot land on a graded answer. Ten times an absolute tolerance
// is still a very small target: ten times 0.000002 is 0.00002 on a slope, and
// ten times 0.0005 is 0.005 on a day count.
//
// AND IT IS CHECKED UNDER FIVE RESTATEMENTS, because a number restated in
// different units is the same answer:
//
//   as graded    the figure as the grader holds it
//   x1000        days read as thousands of days, a bare ratio read as a
//                thousandth of itself
//   x0.001       the same shift the other way
//   x100         a FRACTION read as a PERCENTAGE. This is the live confusion in
//                this domain and the wave's own leak check carries it for that
//                reason: fit quality is a fraction in this engine and a
//                percentage inside its own error strings, and four of the
//                eighteen graded fields are fit qualities or slopes near one.
//   x0.01        the same shift the other way
//
// The band travels with the value under every restatement, because the
// tolerance is absolute: a band of 0.00002 restated in thousands is 0.02.
//
// THE GUARD IS DIMENSION BLIND, deliberately. The grader compares numbers and
// never asks what they were a measurement of, so neither does this. A slope, a
// day, a skin and a multiplier are all just numbers to it.

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './interventionLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const WAVE_DIR = '/root/pd-wip-intervention';
const FIELDS_PATH = path.join(WAVE_DIR, 'fields.json');
const DIGEST_PATH = path.join(WAVE_DIR, 'digest.txt');

const fieldsAvailable = fs.existsSync(FIELDS_PATH);
const digestAvailable = fs.existsSync(DIGEST_PATH);

/**
 * The graded field list, as [tier, key, value, tolerance]. Eighteen fields,
 * three tiers, and every tolerance ABSOLUTE in the field's own units.
 */
const FIELDS = fieldsAvailable
  ? JSON.parse(fs.readFileSync(FIELDS_PATH, 'utf8'))
  : [];

/**
 * The graded WELL's name, assembled rather than written, so that the literal
 * does not appear in this file either. A lesson or a panel that prints the name
 * has leaked the capstone even if it prints none of its numbers.
 */
const GRADED_WELL_NAME = ['BOMU', '-17'].join('');

/** How much wider than the grader's own acceptance band a teaching number stands clear. */
export const LEAK_GUARD_MARGIN = 10;

/**
 * The restatements a number can be given and still be the same answer. The
 * percentage pair is a pair because a figure can be carried either way across
 * it, and it is in this domain's list because a fit quality is graded as a
 * fraction and printed as a percentage by the engine's own error strings.
 */
const LEAK_GUARD_SCALINGS = Object.freeze([
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
  { factor: 100, tag: 'a fraction restated as a percentage' },
  { factor: 0.01, tag: 'a percentage restated as a fraction' },
]);

/** Every forbidden neighbourhood: eighteen graded answers under five restatements. */
const leakGuardTargets = () => {
  const out = [];
  FIELDS.forEach(([tier, key, value, tol]) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const gradingBand = tol * Math.abs(factor);
      out.push({
        tier,
        key,
        tag,
        value: value * factor,
        gradingBand,
        band: LEAK_GUARD_MARGIN * gradingBand,
      });
    });
  });
  return out;
};

/** Is this number inside a forbidden neighbourhood? Returns the target it collides with, or null. */
const leakGuardHit = (value, targets) => {
  if (!Number.isFinite(value)) return null;
  for (const t of targets) {
    if (Math.abs(value - t.value) <= t.band) return t;
  }
  return null;
};

/** The number token the wave's own leak guard, pd8_leakcheck.mjs, scans with. */
const DIGEST_NUMBER = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

const digestNumbers = () => {
  if (!digestAvailable) return [];
  const out = [];
  fs.readFileSync(DIGEST_PATH, 'utf8').split('\n').forEach((line, i) => {
    const m = line.match(DIGEST_NUMBER);
    if (!m) return;
    m.forEach((tok) => {
      const x = Number(tok);
      if (Number.isFinite(x)) out.push({ value: x, line: i + 1, text: line });
    });
  });
  return out;
};

describe.skipIf(!fieldsAvailable)('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  const targets = leakGuardTargets();

  it('reads eighteen graded fields across three tiers, with absolute tolerances', () => {
    expect(FIELDS).toHaveLength(18);
    expect(new Set(FIELDS.map((f) => f[0])))
      .toEqual(new Set(['beginner', 'intermediate', 'advanced']));
    FIELDS.forEach(([tier, key, value, tol]) => {
      expect(typeof key).toBe('string');
      expect(Number.isFinite(value), key).toBe(true);
      expect(tol, key).toBeGreaterThan(0);
      // an absolute tolerance is a tiny fraction of the value it guards, which
      // is the whole reason it cannot be read as a percentage
      expect(tol / Math.abs(value), key).toBeLessThan(1e-4);
    });
  });

  it('the band is ten grader tolerances, under five restatements', () => {
    expect(LEAK_GUARD_MARGIN).toBe(10);
    expect(LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001, 100, 0.01]);
    expect(targets).toHaveLength(18 * 5);
    targets.forEach((t) => {
      expect(t.band).toBeCloseTo(LEAK_GUARD_MARGIN * t.gradingBand, 12);
      // the band travels WITH the value, because the tolerance is absolute
      expect(t.band).toBeGreaterThan(0);
    });
  });

  it('THE GUARD IS LIVE: a planted number just inside the band is caught, in every restatement', () => {
    // This is the assertion that proves the gate is not vacuous. A guard that
    // has never been shown to fire is a guard nobody has tested.
    FIELDS.forEach(([tier, key, value, tol]) => {
      const drift = 0.9 * LEAK_GUARD_MARGIN * tol;
      [value + drift, value - drift, value].forEach((planted) => {
        const hit = leakGuardHit(planted, targets);
        expect(hit, `${key} at ${planted} was not caught`).not.toBeNull();
      });
      // and in each of the unit restatements
      expect(leakGuardHit(value * 1000, targets), `${key} x1000`).not.toBeNull();
      expect(leakGuardHit(value * 0.001, targets), `${key} x0.001`).not.toBeNull();
      expect(leakGuardHit(value * 100, targets), `${key} as a percentage`).not.toBeNull();
      expect(leakGuardHit(value * 0.01, targets), `${key} as a fraction`).not.toBeNull();
    });
  });

  it('and it does NOT fire on a number a comfortable distance outside the band', () => {
    FIELDS.forEach(([tier, key, value, tol]) => {
      const clear = 1000 * LEAK_GUARD_MARGIN * tol;
      // one graded value can sit inside another's band under a restatement, so
      // this only asserts that the field's own neighbourhood is left behind
      const hit = leakGuardHit(value + clear, targets);
      if (hit) expect(hit.key, `${key} moved clear and still hit its own band`).not.toBe(key);
    });
    expect(leakGuardHit(NaN, targets)).toBeNull();
    expect(leakGuardHit(Infinity, targets)).toBeNull();
  });

  it('NO NUMBER THE LAB EXPOSES lands in any forbidden neighbourhood', () => {
    const quantities = L.teachingQuantities()
      .filter((r) => typeof r.value === 'number' && Number.isFinite(r.value));
    expect(quantities.length).toBeGreaterThan(1000);
    const hits = quantities
      .map((r) => ({ r, hit: leakGuardHit(r.value, targets) }))
      .filter((x) => x.hit)
      .map((x) => `${x.r.label} = ${x.r.value} is inside ${x.hit.tier}/${x.hit.key} (${x.hit.tag})`);
    expect(hits).toEqual([]);
  });

  it('and the CLOSEST approach the lab makes is many bands clear', () => {
    const numbers = L.teachingNumbers();
    let closest = Infinity;
    let where = null;
    numbers.forEach((v) => {
      targets.forEach((t) => {
        const d = Math.abs(v - t.value) / t.gradingBand;
        if (d < closest) { closest = d; where = `${t.tier}/${t.key} (${t.tag})`; }
      });
    });
    expect(closest, `closest approach is to ${where}`).toBeGreaterThan(LEAK_GUARD_MARGIN);
  });

  it('every panel source is scanned too, so a hardcoded figure cannot slip past the accessors', () => {
    const sources = fs.readdirSync(HERE).filter((f) => f.endsWith('.jsx'));
    expect(sources.length).toBeGreaterThanOrEqual(3);
    const hits = [];
    sources.forEach((file) => {
      const text = fs.readFileSync(path.join(HERE, file), 'utf8');
      const m = text.match(DIGEST_NUMBER) || [];
      m.forEach((tok) => {
        const hit = leakGuardHit(Number(tok), targets);
        if (hit) hits.push(`${file} prints ${tok}, inside ${hit.tier}/${hit.key} (${hit.tag})`);
      });
    });
    expect(hits).toEqual([]);
  });

  it('and so is the learning page, which reads the same lab', () => {
    const page = path.join(HERE, '..', '..', '..', '..', 'pages', 'apps', 'InterventionLearningPage.jsx');
    if (!fs.existsSync(page)) return;
    const text = fs.readFileSync(page, 'utf8');
    const hits = [];
    (text.match(DIGEST_NUMBER) || []).forEach((tok) => {
      const hit = leakGuardHit(Number(tok), targets);
      if (hit) hits.push(`InterventionLearningPage.jsx prints ${tok}, inside ${hit.tier}/${hit.key} (${hit.tag})`);
    });
    expect(hits).toEqual([]);
  });
});

describe.skipIf(!fieldsAvailable || !digestAvailable)('and neither does the shipped teaching digest', () => {
  const targets = leakGuardTargets();

  it('NO NUMBER THE DIGEST PRINTS lands in any forbidden neighbourhood', () => {
    // The shipped lessons are written from this file, so a leak here is a leak
    // in prose. The wave's own pd8_leakcheck.mjs makes the same statement in
    // the same five unit shiftings; this repeats it inside the suite, so it
    // travels with the panels rather than with the working directory.
    const numbers = digestNumbers();
    expect(numbers.length).toBeGreaterThan(1500);
    const hits = numbers
      .map((n) => ({ n, hit: leakGuardHit(n.value, targets) }))
      .filter((x) => x.hit)
      .slice(0, 20)
      .map((x) => `line ${x.n.line}: ${x.n.value} is inside ${x.hit.tier}/${x.hit.key} (${x.hit.tag})\n    ${x.n.text.slice(0, 140)}`);
    expect(hits).toEqual([]);
  });

  it('and every number the lab exposes is a number the digest also prints, or is derived from ones that are', () => {
    // Not an equality: the lab carries booleans, key lists and a good many
    // ratios a panel needs that the digest does not print. What this pins is
    // that the lab has not grown a NEW numeric source the wave's own leak check
    // never saw, which is the way a leak would arrive after the digest was cut.
    const digest = new Set(digestNumbers().map((n) => n.value));
    const printed = L.teachingNumbers().filter((v) => digest.has(v));
    expect(printed.length).toBeGreaterThan(50);
  });
});

describe('the guard itself is honest about when it cannot run', () => {
  it('says so rather than passing silently when the wave directory is absent', () => {
    // A skipped gate is a reported gate. If this ever runs on a machine without
    // /root/pd-wip-intervention the two blocks above skip, and this one records
    // why.
    if (!fieldsAvailable) {
      expect(FIELDS).toHaveLength(0);
    } else {
      expect(FIELDS.length).toBe(18);
    }
    expect(typeof fieldsAvailable).toBe('boolean');
  });

  it('the lab carries no capstone surface at all, which is the other half of the guarantee', () => {
    // PD2 and PD3 needed a grep guard because their labs reproduce the graded
    // well beside the teaching one. This lab does not, so the check is that it
    // still does not: no export here is capstone material, so there is nothing
    // for a panel to reach into.
    const forbidden = new RegExp(`^(CAP$|CAP_|CAPSTONE_|capstone|leakGuard|${GRADED_WELL_NAME})`, 'i');
    const named = Object.keys(L).filter((n) => forbidden.test(n));
    expect(named, `interventionLab.js has grown a capstone surface: ${named.join(', ')}`).toEqual([]);
  });

  it('and the capstone well is not named anywhere in the package', () => {
    // The graded well has a name, and a lesson or a panel that prints it has
    // leaked the capstone even if it prints no number of it at all. This file
    // is the one exception, because it has to carry the name to look for it,
    // and it carries it in pieces so the literal never appears in a source grep
    // either.
    const pattern = new RegExp(GRADED_WELL_NAME, 'i');
    const files = fs.readdirSync(HERE)
      .filter((f) => f.endsWith('.js') || f.endsWith('.jsx'))
      .filter((f) => f !== 'panelCapstoneGuard.test.js');
    expect(files.length).toBeGreaterThanOrEqual(4);
    files.forEach((f) => {
      const text = fs.readFileSync(path.join(HERE, f), 'utf8');
      expect(text, `${f} names the graded well`).not.toMatch(pattern);
    });
  });

  it('and the teaching well is named instead, which is the case a lesson may quote', () => {
    expect(L.TEACHING_WELL_NAME).toBe('ELELENWO-4');
    expect(L.teachingHeadline().name).toBe('ELELENWO-4');
  });
});
