// NOTHING A PD4 PANEL OR LESSON CAN SHOW MAY LAND ON A GRADED CAPSTONE ANSWER.
//
// The PD2 and PD3 guards are source greps, because those labs carry their own
// capstone derivation beside their teaching surface and a panel could import a
// capstone reader by name. THIS LAB CARRIES NO CAPSTONE AT ALL: the PD4 capstone
// is derived in the wave's own pd4_fields.mjs, rodPumpLab.js never imports it,
// and there is no `obagi*` reader to grep for. So the grep half of this file is
// a naming rule with nothing to catch yet, kept live so it catches the first
// capstone reader anybody adds, and the weight of the gate is NUMERIC.
//
// THE NUMERIC GATE. Every graded field is a forbidden neighbourhood, and both
// teaching surfaces are swept against all of them:
//
//   the PANEL surface, every number a panel can render, reached by a deep walk
//   of every accessor's whole return value (`teachingQuantities()`);
//
//   the DIGEST surface, every number on every line of the file the 78 lessons
//   were written from, which is the same sweep the wave's own pd4_leakcheck.mjs
//   runs.
//
// THE TOLERANCE IS ABSOLUTE, NOT FRACTIONAL. `academy_submit_capstone` grades
// with `abs(v_got - v_exp) <= v_tol` and divides by nothing, so
// `balance_moment_in_lb` is accepted within 0.13 IN-LB of 724684.4494328515,
// not within 0.13 per cent of it. Every band below is therefore thousands of
// times tighter than a relative reading of the same number would be, which is
// what makes a ten times margin affordable: a guard whose threshold is inferred
// rather than read comes out thousands of times too wide, and a gate that wide
// withholds good teaching material for nothing.
//
// THE MARGIN IS TEN, so a lesson that rounds a number in prose still cannot land
// on a graded answer, and the sweep is run in FOUR shiftings: the three the wave
// standard requires (as graded, times 1000, times 0.001) and the psi identity a
// pressure can be restated under. Under a multiplicative shift the absolute band
// shifts with the value; the psi identity is ADDITIVE, so the band does not move
// with it.
//
// THE GATE IS DIMENSION BLIND on purpose. The grader compares numbers and never
// asks what they were a measurement of, so neither does this: a load in lb that
// happened to land on the graded moment in in-lb would be marked correct if a
// learner pasted it into that box.
//
// WHAT THE GATE FINDS, WHICH IS WORTH STATING POSITIVELY: NOTHING.

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './rodPumpLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const FIELDS_PATH = '/root/pd-wip-rodpump/fields.json';
const DIGEST_PATH = '/root/pd-wip-rodpump/digest.txt';

/**
 * THE EIGHTEEN GRADED FIELDS, as [tier, key, value, tolerance], carried here so
 * this gate can never silently empty itself on a machine that does not have the
 * wave directory. `fields.json` is the authority and the test below proves the
 * copy still matches it wherever the file is present.
 *
 * These are the capstone's ANSWERS. They exist in this file only to be avoided,
 * they are never rendered, and no panel and no lesson may reproduce one at any
 * rounding or unit scale.
 */
const CAPSTONE_FIELDS = Object.freeze([
  ['beginner', 'string_kr_lb_per_in', 237.9571451078754, 0.000048],
  ['beginner', 'string_buoyed_weight_lb', 11903.896611464968, 0.0024],
  ['beginner', 'string_natural_freq_spm', 46.52548077425118, 0.0000094],
  ['beginner', 'unit_stroke_in', 121.38337590532858, 0.000025],
  ['beginner', 'pump_fluid_load_lb', 4364.850293081319, 0.00088],
  ['beginner', 'pump_rated_displacement_bpd', 362.9423814326748, 0.000073],
  ['intermediate', 'design_static_stretch_in', 18.3430100033456, 0.0000037],
  ['intermediate', 'design_plunger_stroke_in', 113.87084766145045, 0.000023],
  ['intermediate', 'design_pprl_lb', 22844.62490875651, 0.0046],
  ['intermediate', 'design_mprl_lb', 3184.8310729370005, 0.00064],
  ['intermediate', 'design_prhp_hp', 22.54616735384647, 0.0000046],
  ['intermediate', 'design_produced_bpd', 249.76898478544632, 0.000051],
  ['advanced', 'balance_moment_in_lb', 724684.4494328515, 0.13],
  ['advanced', 'balance_peak_torque_in_lb', 572027.7632886502, 0.12],
  ['advanced', 'balance_cbe_lb', 14743.788548099372, 0.003],
  ['advanced', 'stress_worst_loading_pct', 104.60464569678913, 0.000021],
  ['advanced', 'diag_plunger_stroke_in', 113.95219388403339, 0.000023],
  ['advanced', 'diag_pump_load_max_lb', 4606.367684104658, 0.00098],
]);

/** How much wider than the grader's own acceptance band a teaching number has
 * to stand clear. Ten. */
const LEAK_GUARD_MARGIN = 10;

/** Atmospheric pressure, for the psia against psig identity. A pressure quoted
 * in one convention is the same answer restated in the other. */
const PSI_ATM = 14.696;

/**
 * The shiftings a number can be restated under and still be the same answer.
 * The first three are multiplicative and carry the absolute band with them: a
 * band of 0.0046 lb restated in thousands is 4.6. The psi identity is additive,
 * so the band is unchanged under it.
 */
const SHIFTS = Object.freeze([
  { tag: 'as graded', apply: (v) => v, bandFactor: 1 },
  { tag: 'x1000', apply: (v) => v * 1000, bandFactor: 1000 },
  { tag: 'x0.001', apply: (v) => v * 0.001, bandFactor: 0.001 },
  { tag: 'psia from psig', apply: (v) => v + PSI_ATM, bandFactor: 1 },
  { tag: 'psig from psia', apply: (v) => v - PSI_ATM, bandFactor: 1 },
]);

const fieldsOnDisk = fs.existsSync(FIELDS_PATH)
  ? JSON.parse(fs.readFileSync(FIELDS_PATH, 'utf8'))
  : null;

const digestAvailable = fs.existsSync(DIGEST_PATH);

/** Every forbidden neighbourhood: eighteen graded answers in five shiftings,
 * each with a band ten times the grader's own. */
const targets = CAPSTONE_FIELDS.flatMap(([tier, key, value, tol]) => SHIFTS.map((s) => ({
  key,
  tier,
  tag: s.tag,
  value: s.apply(value),
  gradingBand: tol * Math.abs(s.bandFactor),
  band: LEAK_GUARD_MARGIN * tol * Math.abs(s.bandFactor),
})));

/** Is this number inside a forbidden neighbourhood? Returns the target it
 * collides with, or null. */
const leakGuardHit = (value) => {
  if (!Number.isFinite(value)) return null;
  for (const t of targets) {
    if (Math.abs(value - t.value) <= t.band) return t;
  }
  return null;
};

const NUM = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

const digestNumbers = () => {
  const out = [];
  fs.readFileSync(DIGEST_PATH, 'utf8').split('\n').forEach((line, i) => {
    const m = line.match(NUM);
    if (!m) return;
    m.forEach((tok) => {
      const x = Number(tok);
      if (Number.isFinite(x)) out.push({ label: `digest line ${i + 1}`, value: x });
    });
  });
  return out;
};

// ---------------------------------------------------------------------------
// 1. THE GATE IS BUILT FROM THE FIELD LIST THE GRADER USES.
// ---------------------------------------------------------------------------

describe('the guard is built from the graded fields themselves', () => {
  it('carries all eighteen fields in all five shiftings, at ten times an ABSOLUTE band', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(targets).toHaveLength(18 * 5);
    CAPSTONE_FIELDS.forEach(([, key, , tol]) => {
      const t = targets.find((x) => x.key === key && x.tag === 'as graded');
      expect(t.gradingBand).toBe(tol);
      expect(t.band).toBe(10 * tol);
    });
    // and under a MULTIPLICATIVE shift the absolute band shifts with the value
    expect(targets.find((t) => t.key === 'design_pprl_lb' && t.tag === 'x1000').gradingBand)
      .toBeCloseTo(4.6, 12);
    expect(targets.find((t) => t.key === 'design_pprl_lb' && t.tag === 'x0.001').gradingBand)
      .toBeCloseTo(4.6e-6, 15);
    // while under the ADDITIVE psi identity it does not
    expect(targets.find((t) => t.key === 'design_pprl_lb' && t.tag === 'psig from psia').gradingBand)
      .toBe(0.0046);
  });

  it.skipIf(!fieldsOnDisk)('and the copy still matches fields.json, which is the authority', () => {
    expect(fieldsOnDisk).toHaveLength(CAPSTONE_FIELDS.length);
    fieldsOnDisk.forEach((row, i) => {
      expect(row).toEqual([...CAPSTONE_FIELDS[i]]);
    });
  });

  it('the tolerance is read and not inferred, so no band is a fraction of its value', () => {
    // A relative reading of the same tolerances would be thousands of times
    // wider and would fail the whole teaching surface for nothing. Every band
    // here is far smaller than one part in a thousand of its own field.
    CAPSTONE_FIELDS.forEach(([, key, value, tol]) => {
      expect(tol / Math.abs(value), key).toBeLessThan(1e-3);
    });
  });
});

// ---------------------------------------------------------------------------
// 2. THE TWO TEACHING SURFACES.
// ---------------------------------------------------------------------------

describe('no teaching number lands within ten grading bands of a graded answer', () => {
  it('NOT ONE on the PANEL facing surface', () => {
    const rows = L.teachingQuantities();
    expect(rows.length).toBeGreaterThan(2000);
    const hits = [];
    rows.forEach((r) => {
      const hit = leakGuardHit(r.value);
      if (hit) hits.push(`${r.label} = ${r.value} is within ${hit.band} of ${hit.key} ${hit.tag}`);
    });
    expect(hits).toEqual([]);
  }, 300000);

  it.skipIf(!digestAvailable)('NOR ONE anywhere in the digest the 78 lessons were written from', () => {
    const numbers = digestNumbers();
    expect(numbers.length).toBeGreaterThan(5000);
    const hits = [];
    numbers.forEach((r) => {
      const hit = leakGuardHit(r.value);
      if (hit) hits.push(`${r.label}: ${r.value} is within ${hit.band} of ${hit.key} ${hit.tag}`);
    });
    expect(hits).toEqual([]);
  }, 300000);

  it.skipIf(!digestAvailable)('and the closest either surface comes is many bands away', () => {
    const closest = (rows) => {
      let best = null;
      rows.forEach(({ label, value }) => {
        if (!Number.isFinite(value)) return;
        targets.forEach((t) => {
          const d = Math.abs(value - t.value) / t.gradingBand;
          if (best === null || d < best.d) best = { d, key: t.key, tag: t.tag, label, value };
        });
      });
      return best;
    };
    const panel = closest(L.teachingQuantities());
    const digest = closest(digestNumbers());
    expect(panel.d).toBeGreaterThan(LEAK_GUARD_MARGIN);
    expect(digest.d).toBeGreaterThan(LEAK_GUARD_MARGIN);
  }, 300000);
});

// ---------------------------------------------------------------------------
// 3. THE GATE IS LIVE. PROVED BY PLANTING LEAKS.
// ---------------------------------------------------------------------------

describe('THE GUARD IS LIVE', () => {
  it('every graded answer is caught, and so is a prose rounding of it', () => {
    // Deliberate failure. Every graded answer, and a drift of nine tenths of the
    // guard band either way, which is the prose rounding the ten times margin
    // exists to cover. Not one of them gets past the gate.
    CAPSTONE_FIELDS.forEach(([, key, value, tol]) => {
      const drift = 0.9 * LEAK_GUARD_MARGIN * tol;
      [value, value + drift, value - drift].forEach((planted) => {
        const hit = leakGuardHit(planted);
        expect(hit, `${key} planted as ${planted} was not caught`).not.toBeNull();
        expect(hit.key).toBe(key);
      });
    });
  });

  it('a UNIT SHIFTED leak is caught too, in every shifting the guard carries', () => {
    const moment = CAPSTONE_FIELDS.find(([, k]) => k === 'balance_moment_in_lb')[2];
    const stroke = CAPSTONE_FIELDS.find(([, k]) => k === 'design_plunger_stroke_in')[2];
    const load = CAPSTONE_FIELDS.find(([, k]) => k === 'design_pprl_lb')[2];
    expect(leakGuardHit(moment / 1000).key).toBe('balance_moment_in_lb');
    expect(leakGuardHit(stroke * 1000).key).toBe('design_plunger_stroke_in');
    expect(leakGuardHit(load - PSI_ATM).key).toBe('design_pprl_lb');
    expect(leakGuardHit(load + PSI_ATM).key).toBe('design_pprl_lb');
  });

  it('a leak planted INSIDE a teaching row is caught by the sweep, and its neighbours are not', () => {
    // The sweep itself, not just the predicate. This is the shape of the gate as
    // it is actually run above: a list of rows walked against the targets.
    const planted = [
      ...L.taperSplitRows().map((r) => ({ label: 'real', value: r.krLbPerIn })),
      { label: 'planted', value: CAPSTONE_FIELDS.find(([, k]) => k === 'string_kr_lb_per_in')[2] },
    ];
    const hits = planted
      .map((r) => ({ r, hit: leakGuardHit(r.value) }))
      .filter((x) => x.hit);
    expect(hits).toHaveLength(1);
    expect(hits[0].r.label).toBe('planted');
    expect(hits[0].hit.key).toBe('string_kr_lb_per_in');
  });

  it('IS NOT TRIGGER HAPPY: ordinary teaching numbers of the same KIND pass', () => {
    // Spring rates, buoyed weights, strokes, fluid loads, plunger strokes, peak
    // loads, horsepowers, produced rates, moments, torques and loadings: the
    // same eighteen kinds of number the capstone grades, none of them near one.
    [
      L.publishedStringRow('taper').krLbPerIn,
      L.teachingStringRow().krLbPerIn,
      L.publishedStringRow('uniform').weightFluidLb,
      L.teachingStringRow().weightFluidLb,
      L.noteRoutes('taper').engineScanSpm,
      L.unitSummary().strokeIn,
      L.teachingPump().fluidLoadLb,
      L.teachingPump().ratedBpd,
      L.teachingSpringRule().staticStretchIn,
      L.teachingDesignSummary().plungerStrokeIn,
      L.teachingDesignSummary().pprlLb,
      L.teachingDesignSummary().mprlLb,
      L.teachingDesignSummary().prhp,
      L.teachingDesignSummary().producedBpd,
      L.balanceSummary().momentInLb,
      L.balanceSummary().peakTorqueInLb,
      L.balanceSummary().counterbalanceEffectLb,
      L.teachingDesignSummary().worstSectionLoadingPct,
      L.roundTrip().diagnosticPlungerStrokeIn,
      L.roundTrip().diagnosticPumpLoadMaxLb,
      0,
      NaN,
      Infinity,
    ].forEach((v) => expect(leakGuardHit(v), String(v)).toBeNull());
  }, 300000);
});

// ---------------------------------------------------------------------------
// 4. THE NAMING RULE, KEPT LIVE FOR THE FIRST CAPSTONE READER ANYBODY ADDS.
// ---------------------------------------------------------------------------

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

/** Anything a capstone reader would be called if one were ever added to this
 * lab, plus the capstone well's own name, which no lesson and no panel may
 * mention at all. */
const CAPSTONE_NAME_PATTERN = /\b(CAP|CAPSTONE_\w+|capstone\w*|obagi\w*|OBAGI\w*|leakGuard\w*|LEAK_GUARD_\w+)\b/g;

const capstoneNamesIn = (text) => [...new Set(
  [...text.matchAll(CAPSTONE_NAME_PATTERN)].map((m) => m[0]),
)];

describe('THE NAMING RULE: no panel and no lab export may reach for the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.length).toBeGreaterThanOrEqual(3);
  });

  it('THE GREP IS LIVE: it catches a source that reaches into a capstone', () => {
    const bad = "import { obagiCase, CAP } from './rodPumpLab.js';";
    expect(capstoneNamesIn(bad).sort()).toEqual(['CAP', 'obagiCase']);
    const good = "import { teachingDesignSummary, publishedStringRow } from './rodPumpLab.js';";
    expect(capstoneNamesIn(good)).toEqual([]);
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone reader and never mentions the capstone well`, () => {
      const hits = capstoneNamesIn(text);
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, () => {
      // Six significant figures of a graded answer is a leak at any rounding a
      // panel would plausibly print.
      const printed = CAPSTONE_FIELDS
        .map(([, , v]) => v.toPrecision(6).replace(/0+$/, ''))
        .filter((s) => !s.includes('e'))
        .filter((s) => text.includes(s));
      expect(printed, `${file} prints a graded capstone answer`).toEqual([]);
    });
  });

  it('the lab itself exports no capstone reader, because it holds no capstone', () => {
    const names = Object.keys(L);
    expect(names.filter((n) => /^(CAP$|CAPSTONE_|capstone|obagi)/i.test(n))).toEqual([]);
    const labSource = fs.readFileSync(path.join(HERE, 'rodPumpLab.js'), 'utf8');
    expect(labSource).not.toMatch(/obagi/i);
    // and it imports nothing from the wave directory, which is where the
    // capstone derivation and the graded field list live
    expect(labSource).not.toMatch(/from\s+['"][^'"]*pd-wip/);
    expect(labSource).not.toMatch(/readFileSync/);
  });
});
