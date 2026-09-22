// THE TYPED GAS COLUMN VIEW (held decision HD, route b, owner decision D2).
//
// The Outflow explorer gains "Your gas column, typed": a static dry gas column
// the learner TYPES, marched by the engine's cullenderSmithBhp on the typed
// step count, printing the bottom and midpoint pressures to six decimals.
// Typing the column the Professional brief states is the work the capstone
// asks for, so this file proves both halves of D2 for the two lift gas fields,
// liftgas_valve_pwf_psia and liftgas_mid_pmf_psia:
//   a. the column typed exactly as the brief states it, run through the same
//      lab function the panel calls and read at the precision the panel
//      prints, reproduces both graded values inside their tolerance; the
//      grader's value comes from the lab's own reader and is cross checked
//      against the literal carried in the database;
//   b. the view's DEFAULT state (the BONNY-7 teaching column) lands on no
//      graded answer, by the lab's own leak guard and by the shared D2 rules,
//      and the panel as the page renders it (no props, the opening view) and
//      the typed view as it opens print none of the graded answers;
//   c. negative controls: one typed number changed and a field is no longer
//      reproduced; the capstone column planted as the default is caught by
//      rules 1 and 2; a graded answer planted in the rendered page is caught;
//   d. the typed view renders from `initialMode`, with content and no NaN.
//
// The typed inputs below are transcribed from the brief, not read from the
// lab's capstone object, because that is what a learner types.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from './nodalLab.js';
import VlpExplorer from './VlpExplorer.jsx';
import * as D2 from '../typedCaseGuard.js';

// The literal graded values carried in the database, [value, tol, printed dp].
const DB = {
  liftgas_valve_pwf_psia: [1516.5314295864096, 0.00076, 6],
  liftgas_mid_pmf_psia: [1373.724371881081, 0.00069, 6],
};

// Every graded field on the course, for the default-state sweeps.
const graded = L.capstoneValues();
const ALL_FIELDS = Object.keys(L.CAPSTONE_TOLERANCES)
  .map((key) => ({ tier: L.CAPSTONE_TIERS[key], key, value: graded[key], tol: L.CAPSTONE_TOLERANCES[key] }));

// Professional brief: "a dry gas column of specific gravity 0.72 at 1,225 psia
// at the tubing head, 8,900 ft measured and 8,300 ft true vertical, from 96
// degF to 214 degF, marched in 20 steps". Typed as the brief prints it,
// thousands separators included.
const TYPED = { ptf: '1,225', gasSg: '0.72', mdFt: '8,900', tvdFt: '8,300', whtF: '96', bhtF: '214', steps: '20' };

const read = {
  liftgas_valve_pwf_psia: (r) => r.pwfPsia,
  liftgas_mid_pmf_psia: (r) => r.pmfPsia,
};

/** Read a value the way the panel prints it, then grade it the way the grader does. */
const reproduces = (key, value) => {
  const [, tol, dp] = DB[key];
  return Math.abs(Number(value.toFixed(dp)) - graded[key]) <= tol;
};

describe('a. typing the column the brief states reads both graded values', () => {
  it('the grader values from the lab reader match the literals in the database', () => {
    Object.entries(DB).forEach(([key, [value, tol]]) => {
      expect(L.CAPSTONE_TIERS[key], key).toBe('intermediate');
      expect(graded[key], key).toBe(value);
      expect(L.CAPSTONE_TOLERANCES[key], key).toBe(tol);
    });
  });

  it('the typed column succeeds with no refusal and no warning', () => {
    const r = L.typedGasColumn(TYPED);
    expect(r.ok, r.errors.join(' ')).toBe(true);
    expect(r.warnings).toEqual([]);
    expect(r.stepsUsed).toBe(20);
  });

  Object.keys(DB).forEach((key) => {
    it(`${key}: the typed route reads it at six decimals (D2 typedRouteMiss)`, () => {
      const [value, tol, dp] = DB[key];
      expect(D2.typedRouteMiss({ run: L.typedGasColumn, typed: TYPED, read: read[key], dp, expected: value, tol, key })).toBeNull();
      expect(reproduces(key, read[key](L.typedGasColumn(TYPED)))).toBe(true);
    });
  });

  it('the panel prints both at six decimals, with no separators, in the typed view', () => {
    // the printed strings are derived from the typed run, never written here
    const r = L.typedGasColumn(TYPED);
    const html = renderToStaticMarkup(React.createElement(VlpExplorer, { initialMode: 'typedcolumn' }));
    // the view opens on its default, so the typed case's print is absent there ...
    expect(html).not.toContain(r.pwfPsia.toFixed(6));
    // ... and the default's own print is present, at six decimals
    const d = L.typedGasColumn(L.TYPED_COLUMN_DEFAULT);
    expect(html).toContain(d.pwfPsia.toFixed(6));
    expect(html).toContain(d.pmfPsia.toFixed(6));
  });
});

describe('b. the typed view DEFAULT lands on no graded answer', () => {
  const targets = L.leakGuardTargets();

  it('the default is the BONNY-7 teaching column, not the graded one', () => {
    expect(L.TYPED_COLUMN_DEFAULT).toEqual({ ...L.BONNY_7.column, steps: L.BONNY_7.columnSteps });
    expect(L.BONNY_7.column.qMmscfd || 0).toBe(0);
  });

  it('every number the default returns is clear of every graded neighbourhood (the lab guard)', () => {
    const d = L.typedGasColumn(L.TYPED_COLUMN_DEFAULT);
    expect(d.ok, (d.errors || []).join(' ')).toBe(true);
    const nums = D2.numbersIn(d, 'default');
    expect(nums.length).toBeGreaterThanOrEqual(6);
    const hits = nums.flatMap(({ label, value }) => ['pressure', 'rate', 'index']
      .map((dim) => L.leakGuardHit(value, dim, targets)).filter(Boolean).map((t) => `${label} ${t.key}`));
    expect(hits).toEqual([]);
    Object.keys(DB).forEach((key) => expect(reproduces(key, read[key](d)), key).toBe(false));
  });

  it('the page as the learner first sees it (no props) prints no graded answer', () => {
    const html = renderToStaticMarkup(React.createElement(VlpExplorer));
    const printed = ALL_FIELDS.map(({ key, value }) => [key, value.toFixed(6)]).filter(([, s]) => html.includes(s));
    expect(printed).toEqual([]);
    expect(html).not.toContain('Pressure at the midpoint station');
  });

  it('the typed view as it opens prints no graded answer at any precision from 2 to 10 dp', () => {
    const html = renderToStaticMarkup(React.createElement(VlpExplorer, { initialMode: 'typedcolumn' }));
    const nums = (html.match(/-?\d[\d,]*\.\d+/g) || []).map((s) => Number(s.replace(/,/g, '')));
    expect(nums.length).toBeGreaterThan(5);
    const t = D2.leakTargets(ALL_FIELDS);
    expect(nums.map((v) => D2.leakGuardHit(t, v)).filter(Boolean).map((x) => x.key)).toEqual([]);
  });
});

describe('c. negative controls', () => {
  it('the column marched at the two station default misses both fields (the brief trap)', () => {
    const r = L.typedGasColumn({ ...TYPED, steps: '2' });
    expect(r.ok).toBe(true);
    Object.keys(DB).forEach((key) => expect(reproduces(key, read[key](r)), key).toBe(false));
  });

  it('measured and vertical depth swapped into a vertical well misses both fields', () => {
    const r = L.typedGasColumn({ ...TYPED, tvdFt: '8,900' });
    Object.keys(DB).forEach((key) => expect(reproduces(key, read[key](r)), key).toBe(false));
  });

  it('a column printed at two decimals would not carry the tolerance', () => {
    const [value, tol] = DB.liftgas_valve_pwf_psia;
    const miss = D2.typedRouteMiss({ run: L.typedGasColumn, typed: TYPED, read: read.liftgas_valve_pwf_psia, dp: 2, expected: value, tol, key: 'liftgas_valve_pwf_psia' });
    expect(miss).toMatch(/at 2 dp/);
  });

  it('the typed function refuses bad input with plain messages and never throws', () => {
    expect(L.typedGasColumn({ ...TYPED, gasSg: '' }).errors.join(' ')).toMatch(/Gas specific gravity needs a number/);
    expect(L.typedGasColumn({ ...TYPED, tvdFt: '9000' }).errors.join(' ')).toMatch(/no deeper than the measured depth/);
    expect(L.typedGasColumn({ ...TYPED, steps: '2.5' }).ok).toBe(false);
    expect(L.typedGasColumn({ ...TYPED, steps: String(L.TYPED_COLUMN_MAX_STEPS + 1) }).ok).toBe(false);
    expect(L.typedGasColumn(undefined).ok).toBe(false);
    const odd = L.typedGasColumn({ ...TYPED, steps: '21' });
    expect(odd.ok).toBe(true);
    expect(odd.stepsUsed).toBe(22);
    expect(odd.warnings.join(' ')).toMatch(/marched as 22/);
  });

  it('a graded answer planted in the rendered typed view is caught by the page sweep', () => {
    const html = renderToStaticMarkup(React.createElement(VlpExplorer, { initialMode: 'typedcolumn' }))
      + `<span>${graded.liftgas_mid_pmf_psia.toFixed(6)}</span>`;
    const nums = (html.match(/-?\d[\d,]*\.\d+/g) || []).map((s) => Number(s.replace(/,/g, '')));
    const t = D2.leakTargets(ALL_FIELDS);
    expect(nums.map((v) => D2.leakGuardHit(t, v)).filter(Boolean).map((x) => x.key)).toContain('liftgas_mid_pmf_psia');
  });
});

describe('d. the typed view renders from initialMode', () => {
  it('VlpExplorer renders its typedcolumn view', () => {
    const html = renderToStaticMarkup(React.createElement(VlpExplorer, { initialMode: 'typedcolumn' }));
    expect(html.length).toBeGreaterThan(2000);
    expect(html).toContain('Your gas column, typed');
    expect(html).toContain('Pressure at the midpoint station');
    expect(html).not.toMatch(/NaN/);
    expect(html).toMatch(/teaching column/);
  });
});

// ---- D2 SHARED RULES (typedCaseGuard.js, owner decision D2) ----------------
// Rule 1: the typed mode's default state, run through the function the panel
// calls, lands on no graded answer at ten grading bands in five shiftings.
// Rule 2: the default carries no capstone-distinguishing input. The keys are
// FROZEN here: every typed input, each of which differs between the brief's
// column and every teaching column (distinguishingKeyProblems proves it).
const D2_MODE = { name: 'typedcolumn', defaults: L.TYPED_COLUMN_DEFAULT, run: L.typedGasColumn };
const D2_KEYS = ['ptf', 'gasSg', 'mdFt', 'tvdFt', 'whtF', 'bhtF', 'steps'];
const asNumbers = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Number(String(v).replace(/,/g, ''))]));
const TEACHING_COLUMNS = L.TEACHING_WELLS.map((W) => ({ name: W.label, inputs: { ...W.column, steps: W.columnSteps } }));

describe('D2 shared rules (typedCaseGuard.js)', () => {
  const targets = D2.leakTargets(ALL_FIELDS);

  it('rule 1: the typed default state lands on no graded answer', () => {
    expect(targets.length).toBe(ALL_FIELDS.length * D2.DEFAULT_SHIFTS.length);
    expect(D2.defaultStateHits({ targets, modes: [D2_MODE] })).toEqual([]);
  });

  it('rule 1 is live: the brief column planted as the default is caught on both fields', () => {
    const hits = D2.defaultStateHits({ targets, modes: [{ ...D2_MODE, defaults: TYPED }] });
    expect(hits.some((h) => h.includes('liftgas_valve_pwf_psia'))).toBe(true);
    expect(hits.some((h) => h.includes('liftgas_mid_pmf_psia'))).toBe(true);
  });

  it('rule 2: every frozen key distinguishes the brief column from every teaching column', () => {
    expect(D2.distinguishingKeyProblems({ capstone: asNumbers(TYPED), teachingCases: TEACHING_COLUMNS, keys: D2_KEYS })).toEqual([]);
  });

  it('rule 2: the default preloads no input of the brief column', () => {
    expect(D2.preloadHits({ capstone: asNumbers(TYPED), bundles: [{ name: 'typedcolumn default', inputs: L.TYPED_COLUMN_DEFAULT }], keys: D2_KEYS })).toEqual([]);
  });

  it('rule 2 is live: the brief column typed as a default is caught on every key', () => {
    expect(D2.preloadHits({ capstone: asNumbers(TYPED), bundles: [{ name: 'planted', inputs: asNumbers(TYPED) }], keys: D2_KEYS })).toHaveLength(D2_KEYS.length);
  });

  it('rule 3: the panel source names no capstone reader and prints no graded literal', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const src = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'VlpExplorer.jsx'), 'utf8');
    expect(D2.capstoneNamesIn(src)).toEqual([]);
    expect(D2.gradedLiteralsIn(src, ALL_FIELDS)).toEqual([]);
    // and the rule is live on a planted source
    expect(D2.gradedLiteralsIn(`const x = ${graded.liftgas_valve_pwf_psia.toFixed(6)};`, ALL_FIELDS).length).toBe(1);
  });
});
