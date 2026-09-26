// EVERY GRADED EC8 FIELD CAN BE READ OFF A CALCULATOR PANEL, AT THE GRADING
// TOLERANCE. This is an engine course: the panels are a learner's only tool.
// A field the panels do not print to six decimals asks the learner to rebuild an
// engine line by hand, and a sum of printed six-decimal lines can miss a 5e-7
// tolerance. So each of the eighteen fields is READ FROM A RENDERED PANEL, with
// the tier's own capstone case loaded the way a learner pastes it (the whole
// case file; each view reads the key it needs), and compared with fields.json at
// the field's own tolerance.
//
// The capstone cases come from the committed gsa_capstone.mjs --inputs (run in a
// child process against this repository's vendored engine); nothing here types
// a capstone value.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import QuantityCalculator from './QuantityCalculator.jsx';
import LedgerCalculator from './LedgerCalculator.jsx';
import ContractCalculator from './ContractCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const FIELDS = JSON.parse(fs.readFileSync(waveInput('gsa', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('gsa'), 'gsa_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    EC8_WAVE_DIR: mirrorDir('gsa'),
    EC8_ENGINES: path.join(ROOT, 'packages/engines'),
    EC8_REPO: ROOT,
    EC8_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));
const caseOf = (c) => c;
// THE PASTE PATH: the case file exactly as the capstone card offers it for copying.
const CASE_TEXT = {
  OZUBU: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/gsa/ozubu_case.json'), 'utf8'),
  IFEYI: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/gsa/ifeyi_case.json'), 'utf8'),
  NWAKA: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/gsa/nwaka_case.json'), 'utf8'),
};

const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
/** Every table in the markup as { head, rows } of cell text. */
const tables = (html) => [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map(([t]) => {
  const head = [...t.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]));
  const body = t.split('<tbody>')[1] || '';
  const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => text(m[1])));
  return { head, rows };
});
const cell = (html, column, rowKey) => {
  const t = tables(html).find((x) => x.head.includes(column));
  if (!t) throw new Error(`no table prints the column "${column}"`);
  const row = t.rows.find((r) => r[0] === String(rowKey));
  if (!row) throw new Error(`the "${column}" table has no row for ${rowKey}`);
  return row[t.head.indexOf(column)];
};
const tile = (html, label) => {
  const m = html.match(new RegExp(`<p[^>]*>${label}</p><p[^>]*>([^<]*)`));
  if (!m) throw new Error(`no tile labelled "${label}"`);
  return m[1];
};

// key -> [capstone, panel, view, how to read it]
const WHERE = {
  ozubu_march_2028_mmbtu: ['OZUBU', QuantityCalculator, 'energy', (h) => tile(h, 'Energy, MMBtu')],
  ozubu_2028_acq: ['OZUBU', QuantityCalculator, 'quantities', (h) => tile(h, 'ACQ')],
  ozubu_effective_swing: ['OZUBU', QuantityCalculator, 'quantities', (h) => tile(h, 'Effective swing')],
  ozubu_fortnight_buyer_shortfall: ['OZUBU', QuantityCalculator, 'daily', (h) => tile(h, 'Total buyer shortfall')],
  ozubu_fortnight_seller_shortfall: ['OZUBU', QuantityCalculator, 'daily', (h) => tile(h, 'Total seller shortfall')],
  ozubu_2029_deficiency_payment: ['OZUBU', QuantityCalculator, 'year', (h) => cell(h, 'deficiency payment', 2029)],
  ifeyi_2030_average_price: ['IFEYI', LedgerCalculator, 'price', (h) => cell(h, 'annual average price', 2030)],
  ifeyi_2028_deficiency_payment: ['IFEYI', LedgerCalculator, 'ledger', (h) => cell(h, 'deficiency payment', 2028)],
  ifeyi_2031_make_up_taken: ['IFEYI', LedgerCalculator, 'ledger', (h) => cell(h, 'make-up taken', 2031)],
  ifeyi_2031_make_up_expired: ['IFEYI', LedgerCalculator, 'ledger', (h) => cell(h, 'make-up expired', 2031)],
  ifeyi_total_net_to_seller: ['IFEYI', LedgerCalculator, 'ledger', (h) => tile(h, 'Total net to the seller')],
  ifeyi_2031_dgdo_penalty: ['IFEYI', LedgerCalculator, 'dgdo', (h) => tile(h, 'Penalty')],
  nwaka_july_2029_price: ['NWAKA', ContractCalculator, 'curve', (h) => cell(h, 'price', '2029-07')],
  nwaka_2034_average_price: ['NWAKA', ContractCalculator, 'curve', (h) => cell(h, 'annual average price', 2034)],
  nwaka_2030_carry_forward_credit: ['NWAKA', ContractCalculator, 'cash', (h) => cell(h, 'carry-forward applied', 2030)],
  nwaka_2035_refund: ['NWAKA', ContractCalculator, 'cash', (h) => cell(h, 'refund', 2035)],
  nwaka_npv_seller_revenue: ['NWAKA', ContractCalculator, 'cash', (h) => tile(h, 'NPV of the seller revenue')],
  nwaka_2032_royalty: ['NWAKA', ContractCalculator, 'cash', (h) => cell(h, 'royalty', 2032)],
};
const PANEL_OF_TIER = { beginner: QuantityCalculator, intermediate: LedgerCalculator, advanced: ContractCalculator };

describe('EVERY GRADED FIELD IS READABLE FROM A PANEL AT ITS TOLERANCE', () => {
  it('maps all eighteen fields, each to its own tier\'s panel', () => {
    expect(Object.keys(WHERE).sort()).toEqual(FIELDS.map((f) => f[1]).sort());
    FIELDS.forEach(([tier, key]) => expect(WHERE[key][1], key).toBe(PANEL_OF_TIER[tier]));
  });
  it('renders each field from its panel with the capstone case pasted, within the grading tolerance', () => {
    const cache = new Map();
    const render = (cap, Panel, mode) => {
      const k = `${cap}|${mode}|${Panel.name}`;
      if (!cache.has(k)) cache.set(k, renderToStaticMarkup(React.createElement(Panel, { initialMode: mode, initialCase: caseOf(INPUTS[cap]) })));
      return cache.get(k);
    };
    const read = [];
    FIELDS.forEach(([, key, value, tol]) => {
      const [cap, Panel, mode, get] = WHERE[key];
      const shown = get(render(cap, Panel, mode));
      expect(shown, `${key} is printed with six decimals`).toMatch(/^-?\d+\.\d{6}$/);
      expect(Math.abs(Number(shown) - value), `${key}: the panel prints ${shown}, graded ${value} at ${tol}`).toBeLessThanOrEqual(tol);
      read.push(key);
    });
    expect(read).toHaveLength(18);
    console.log('[gsa panels] all 18 graded fields read off a rendered panel within their tolerance');
  }, 120000);
  it('THE PASTE PATH: each field read the same way with the WHOLE case file pasted into the view box', () => {
    const cache = new Map();
    const render = (cap, Panel, mode) => {
      const k = `${cap}|${mode}|${Panel.name}`;
      if (!cache.has(k)) cache.set(k, renderToStaticMarkup(React.createElement(Panel, { initialMode: mode, initialText: CASE_TEXT[cap] })));
      return cache.get(k);
    };
    let read = 0;
    FIELDS.forEach(([, key, value, tol]) => {
      const [cap, Panel, mode, get] = WHERE[key];
      const html = render(cap, Panel, mode);
      expect(html, `${key}: the ${mode} view refused the pasted case file`).not.toContain('THE ENGINE REFUSED');
      const shown = get(html);
      expect(shown, `${key} is printed with six decimals`).toMatch(/^-?\d+\.\d{6}$/);
      expect(Math.abs(Number(shown) - value), `${key}: pasted, the panel prints ${shown}, graded ${value} at ${tol}`).toBeLessThanOrEqual(tol);
      read += 1;
    });
    expect(read).toBe(18);
    console.log('[gsa panels] all 18 graded fields read off a rendered panel with the whole case file pasted');
  }, 120000);
  it('NEGATIVE CONTROL: a field read one row off is caught', () => {
    const [, , value, tol] = FIELDS.find((f) => f[1] === 'ifeyi_2031_make_up_taken');
    const html = renderToStaticMarkup(React.createElement(LedgerCalculator, { initialMode: 'ledger', initialCase: caseOf(INPUTS.IFEYI) }));
    expect(Math.abs(Number(cell(html, 'make-up taken', 2030)) - value)).toBeGreaterThan(tol);
  });
});
