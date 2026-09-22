// THE TYPED WELL REACHES THE GRADED ANSWERS, AND ITS DEFAULT REACHES NONE.
//
// B5 follow-on W4 route (b), owner decision D2. The card explorer and the
// balance explorer each gained a "your well, typed" mode. A learner who types
// the well the intermediate and advanced capstone prompts state must be able to
// read every graded value off those modes at the precision they print; nothing
// either mode shows before the learner types may land on a graded answer.
//
// The graded values come from fields.json, the wave's own output of the grader's
// derivation (read through waveInput, never from a path under /root), and each
// is cross-checked against the literal value the database holds. The inputs
// below are transcribed from the live prompt text, as strings, because that is
// what a learner types into the panel.

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from './rodPumpLab.js';
import CardExplorer from './CardExplorer.jsx';
import BalanceExplorer from './BalanceExplorer.jsx';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const fieldsOnDisk = JSON.parse(fs.readFileSync(waveInput('rodpump', 'fields.json'), 'utf8'));

// The panel prints every graded tile at nine decimals.
const PRINTED_DP = 9;

/** [key, value as the database holds it, tol, the lab's return key]. */
const INTERMEDIATE = [
  ['design_static_stretch_in', 18.3430100033456, 3.7e-06, 'staticStretchIn'],
  ['design_plunger_stroke_in', 113.87084766145045, 2.3e-05, 'plungerStrokeIn'],
  ['design_pprl_lb', 22844.62490875651, 0.0046, 'pprlLb'],
  ['design_mprl_lb', 3184.8310729370005, 0.00064, 'mprlLb'],
  ['design_prhp_hp', 22.54616735384647, 4.6e-06, 'prhp'],
  ['design_produced_bpd', 249.76898478544632, 5.1e-05, 'producedBpd'],
];
const ADVANCED = [
  ['balance_moment_in_lb', 724684.4494328515, 0.13, 'momentInLb'],
  ['balance_peak_torque_in_lb', 572027.7632886502, 0.12, 'peakTorqueInLb'],
  ['balance_cbe_lb', 14743.788548099372, 0.003, 'counterbalanceEffectLb'],
  ['stress_worst_loading_pct', 104.60464569678913, 2.1e-05, 'worstLoadingPct'],
  ['diag_plunger_stroke_in', 113.95219388403339, 2.3e-05, 'diagPlungerStrokeIn'],
  ['diag_pump_load_max_lb', 4606.367684104658, 0.00098, 'diagPumpLoadMaxLb'],
];
const ALL = [...INTERMEDIATE, ...ADVANCED];

const graded = (key) => {
  const row = fieldsOnDisk.find(([, k]) => k === key);
  if (!row) throw new Error(`fields.json has no ${key}`);
  return { value: row[2], tol: row[3] };
};

// The well, as the prompts state it, typed as strings.
const TYPED_WELL = Object.freeze({
  sections: [
    { size: '1', lengthFt: '1825' },
    { size: '7/8', lengthFt: '2140' },
    { size: '3/4', lengthFt: '2120' },
    { size: '', lengthFt: '' },
  ],
  gradeId: 'D',
  fluidSg: '0.94',
  aIn: '118.4',
  cIn: '71.6',
  pIn: '92.5',
  crankBehindIn: '104.3',
  crankBelowIn: '66.9',
  rIn: '33.7',
  kinSteps: '720',
  plungerDIn: '1.5',
  pIntakePsia: '210',
  pDischargePsia: '2680',
  spm: '11.4',
  dampingRatio: '0.085',
  fillage: '0.853',
  pumpEfficiency: '0.86',
});
const TYPED_BALANCE = Object.freeze({
  ...TYPED_WELL,
  structuralUnbalanceLb: '810',
  crankOffsetDeg: '14',
  unitDesignation: 'C-640D-305-144',
  serviceFactor: '0.94',
  harmonics: '36',
});

const readsWithin = (value, key) => {
  const { value: g, tol } = graded(key);
  return Math.abs(Number(value.toFixed(PRINTED_DP)) - g) <= tol;
};

/** Every finite number in a return value. */
const numbersIn = (v, out = []) => {
  if (typeof v === 'number') { if (Number.isFinite(v)) out.push(v); return out; }
  if (Array.isArray(v)) { v.forEach((x) => numbersIn(x, out)); return out; }
  if (v && typeof v === 'object') Object.values(v).forEach((x) => numbersIn(x, out));
  return out;
};

/** Any of the eighteen graded answers within ten of its own bands. */
const nearGraded = (x) => fieldsOnDisk.find(([, , g, tol]) => Math.abs(x - g) <= 10 * tol) || null;

describe('the graded values this file checks are the ones the grader holds', () => {
  it('fields.json and the database literals agree on every key and tolerance', () => {
    ALL.forEach(([key, literal, tol]) => {
      const g = graded(key);
      expect(g.value, key).toBe(literal);
      expect(g.tol, key).toBe(tol);
    });
  });
});

describe('typing the stated well reads every graded value', () => {
  it('the card, intermediate: six values at the printed nine decimals', () => {
    const r = L.typedWellCard(TYPED_WELL);
    expect(r.ok, (r.errors || []).join(' ')).toBe(true);
    INTERMEDIATE.forEach(([key, , , field]) => {
      expect(readsWithin(r[field], key), `${key}: ${r[field]}`).toBe(true);
    });
  }, 300000);

  it('the balance, advanced: six values at the printed nine decimals', () => {
    const r = L.typedWellBalance(TYPED_BALANCE);
    expect(r.ok, (r.errors || []).join(' ')).toBe(true);
    ADVANCED.forEach(([key, , , field]) => {
      expect(readsWithin(r[field], key), `${key}: ${r[field]}`).toBe(true);
    });
    // the worst section is found, and it is the largest of the three
    expect(r.worstLoadingPct).toBe(Math.max(...r.sections.map((s) => s.loadingPct)));
    expect(r.sections).toHaveLength(3);
  }, 300000);
});

describe('the default state lands on no graded answer', () => {
  it('both defaults are in the swept teaching surface', () => {
    const labels = new Set(L.teachingAccessors().map(([label]) => label));
    expect(labels.has('typedWellCard.default')).toBe(true);
    expect(labels.has('typedWellBalance.default')).toBe(true);
  });

  it('no number either default returns is within ten bands of any graded value', () => {
    const card = L.typedWellCard(L.TYPED_WELL_DEFAULT);
    const bal = L.typedWellBalance(L.TYPED_BALANCE_DEFAULT);
    expect(card.ok).toBe(true);
    expect(bal.ok).toBe(true);
    const nums = [...numbersIn(card), ...numbersIn(bal)];
    expect(nums.length).toBeGreaterThan(30);
    const hits = nums.map((x) => [x, nearGraded(x)]).filter(([, h]) => h).map(([x, h]) => `${x} near ${h[1]}`);
    expect(hits).toEqual([]);
  }, 300000);
});

describe('NEGATIVE CONTROL: the check can fail', () => {
  it('one typed number changed on the card and the graded values are lost', () => {
    const r = L.typedWellCard({ ...TYPED_WELL, dampingRatio: '0.09' });
    expect(r.ok).toBe(true);
    const lost = INTERMEDIATE.filter(([key, , , field]) => !readsWithin(r[field], key));
    expect(lost.length).toBeGreaterThan(0);
    expect(lost.map(([k]) => k)).toContain('design_plunger_stroke_in');
  }, 300000);

  it('the unbalance left at zero and the balance is lost (the balancing routine reads it)', () => {
    const r = L.typedWellBalance({ ...TYPED_BALANCE, structuralUnbalanceLb: '0' });
    expect(r.ok).toBe(true);
    expect(readsWithin(r.momentInLb, 'balance_moment_in_lb')).toBe(false);
    expect(readsWithin(r.peakTorqueInLb, 'balance_peak_torque_in_lb')).toBe(false);
  }, 300000);

  it('the service factor left at one and the worst loading is lost', () => {
    const r = L.typedWellBalance({ ...TYPED_BALANCE, serviceFactor: '1' });
    expect(readsWithin(r.worstLoadingPct, 'stress_worst_loading_pct')).toBe(false);
  }, 300000);
});

describe('refusals are plain messages, never throws', () => {
  it('a missing length, a bad grade, a zero damping and a bad designation are refused', () => {
    const a = L.typedWellCard({ ...TYPED_WELL, sections: [{ size: '1', lengthFt: '' }] });
    expect(a.ok).toBe(false);
    expect(a.errors.join(' ')).toMatch(/length/);
    expect(L.typedWellCard({ ...TYPED_WELL, gradeId: 'Z' }).ok).toBe(false);
    expect(L.typedWellCard({ ...TYPED_WELL, dampingRatio: '0' }).ok).toBe(false);
    expect(L.typedWellBalance({ ...TYPED_BALANCE, unitDesignation: 'not a unit' }).ok).toBe(false);
    expect(L.typedWellCard({ ...TYPED_WELL, pDischargePsia: '100' }).ok).toBe(false);
  });
});

describe('the typed modes render, and their sources carry no capstone input', () => {
  it('the card explorer typed mode renders content and no NaN', () => {
    const html = renderToStaticMarkup(React.createElement(CardExplorer, { initialMode: 'typed' }));
    expect(html.length).toBeGreaterThan(2000);
    expect(html).not.toMatch(/NaN/);
    expect(html).toContain('March this well');
    expect(html).toContain('Static stretch under the fluid load');
  }, 300000);

  it('the balance explorer typed mode renders content and no NaN', () => {
    const html = renderToStaticMarkup(React.createElement(BalanceExplorer, { initialMode: 'typed' }));
    expect(html.length).toBeGreaterThan(2000);
    expect(html).not.toMatch(/NaN/);
    expect(html).toContain('Counterbalance moment');
    expect(html).toContain('Diagnostic peak pump load');
  }, 300000);

  it('no panel source holds the stated well as a literal', () => {
    const literals = ['1825', '2140', '2120', '118.4', '71.6', '92.5', '104.3', '66.9', '33.7',
      '2680', '11.4', '0.085', '0.853', '0.86', '810', 'C-640D-305-144'];
    ['CardExplorer.jsx', 'BalanceExplorer.jsx', 'TypedWellFields.jsx'].forEach((f) => {
      const text = fs.readFileSync(path.join(HERE, f), 'utf8');
      const found = literals.filter((s) => new RegExp(`(^|[^0-9.])${s.replace(/\./g, '\\.')}([^0-9]|$)`).test(text));
      expect(found, f).toEqual([]);
    });
  });
});
