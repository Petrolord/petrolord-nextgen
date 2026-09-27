// EVERY GRADED EC10 FIELD CAN BE READ OFF A CALCULATOR PANEL, AT THE GRADING
// TOLERANCE. This is an engine course: the panels are a learner's only tool.
// A field the panels do not print to six decimals asks the learner to rebuild an
// engine line by hand. So each of the eighteen fields is READ FROM A RENDERED
// PANEL, with the tier's own capstone case loaded the way a learner pastes it
// (the whole case file; each view reads the key it needs), and compared with
// fields.json at the field's own tolerance.
//
// The capstone cases come from the committed farmout_capstone.mjs --inputs (run
// in a child process against this repository's vendored engine); nothing here
// types a capstone value.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import EarningCalculator from './EarningCalculator.jsx';
import DealCalculator from './DealCalculator.jsx';
import ValuationCalculator from './ValuationCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const FIELDS = JSON.parse(fs.readFileSync(waveInput('farmout', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('farmout'), 'farmout_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    EC10_WAVE_DIR: mirrorDir('farmout'),
    EC10_ENGINES: path.join(ROOT, 'packages/engines/ec10-farmout'),
    EC10_REPO: ROOT,
    EC10_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));
const caseOf = (c) => c;
// THE PASTE PATH: the case file exactly as the capstone card offers it for copying.
const CASE_TEXT = {
  OGBAKU: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/farmout/ogbaku_case.json'), 'utf8'),
  UMUNZE: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/farmout/umunze_case.json'), 'utf8'),
  AKPUGO: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/farmout/akpugo_case.json'), 'utf8'),
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
  ogbaku_ihe_well_payment: ['OGBAKU', EarningCalculator, 'earning', (h) => cell(h, 'farminee pays', 'event 1')],
  ogbaku_ogb_well_payment: ['OGBAKU', EarningCalculator, 'earning', (h) => cell(h, 'farmor pays', 'event 1')],
  ogbaku_promote_ratio: ['OGBAKU', EarningCalculator, 'earning', (h) => cell(h, 'promote ratio', 'event 1')],
  ogbaku_carry: ['OGBAKU', EarningCalculator, 'earning', (h) => cell(h, 'carry', 'event 1')],
  ogbaku_consideration: ['OGBAKU', EarningCalculator, 'earning', (h) => tile(h, 'Consideration to the farmor')],
  ogbaku_equivalent_wi_pct: ['OGBAKU', EarningCalculator, 'earning', (h) => tile(h, 'Equivalent working interest')],
  umunze_well1_amg_payment: ['UMUNZE', DealCalculator, 'earning', (h) => cell(h, 'farminee pays', 'event 1')],
  umunze_well2_umz_payment: ['UMUNZE', DealCalculator, 'earning', (h) => cell(h, 'farmor pays', 'event 2')],
  umunze_amg_emv: ['UMUNZE', DealCalculator, 'deal', (h) => cell(h, 'EMV', 'farminee farms in')],
  umunze_breakeven_share_pct: ['UMUNZE', DealCalculator, 'deal', (h) => tile(h, 'Break-even share paid')],
  umunze_amg_breakeven_chance_pct: ['UMUNZE', DealCalculator, 'deal', (h) => cell(h, 'break-even chance of success', 'farminee')],
  umunze_consent_fee: ['UMUNZE', DealCalculator, 'fee', (h) => tile(h, 'Consent fee')],
  akpugo_ezi_evii: ['AKPUGO', ValuationCalculator, 'information', (h) => tile(h, 'EVII')],
  akpugo_strong_posterior_pct: ['AKPUGO', ValuationCalculator, 'information', (h) => cell(h, 'chance of success after it', 'signal 1')],
  akpugo_risked_value_per_pct: ['AKPUGO', ValuationCalculator, 'price', (h) => tile(h, 'Risked value per percent')],
  akpugo_price_to_value: ['AKPUGO', ValuationCalculator, 'price', (h) => tile(h, 'Price over value per percent')],
  akpugo_2035_carry_balance: ['AKPUGO', ValuationCalculator, 'devCarry', (h) => cell(h, 'closing', 2035)],
  akpugo_backin_refund_to_obr: ['AKPUGO', ValuationCalculator, 'backIn', (h) => cell(h, 'refund received', 'OBR')],
};
const PANEL_OF_TIER = { beginner: EarningCalculator, intermediate: DealCalculator, advanced: ValuationCalculator };

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
    console.log('[farmout panels] all 18 graded fields read off a rendered panel within their tolerance');
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
    console.log('[farmout panels] all 18 graded fields read off a rendered panel with the whole case file pasted');
  }, 120000);
  it('NEGATIVE CONTROL: a field read one row off is caught', () => {
    const [, , value, tol] = FIELDS.find((f) => f[1] === 'akpugo_2035_carry_balance');
    const html = renderToStaticMarkup(React.createElement(ValuationCalculator, { initialMode: 'devCarry', initialCase: caseOf(INPUTS.AKPUGO) }));
    expect(Math.abs(Number(cell(html, 'closing', 2034)) - value)).toBeGreaterThan(tol);
  });
});
