// EVERY GRADED EC9 FIELD CAN BE READ OFF A CALCULATOR PANEL, AT THE GRADING
// TOLERANCE. This is an engine course: the panels are a learner's only tool.
// A field the panels do not print to six decimals asks the learner to rebuild an
// engine line by hand, and a sum of printed six-decimal lines can miss a 5e-7
// tolerance. So each of the eighteen fields is READ FROM A RENDERED PANEL, with
// the tier's own capstone case loaded the way a learner pastes it (the whole
// case file; each view reads the key it needs), and compared with fields.json at
// the field's own tolerance.
//
// The capstone cases come from the committed joa_capstone.mjs --inputs (run in a
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
import AccountCalculator from './AccountCalculator.jsx';
import RecoveryCalculator from './RecoveryCalculator.jsx';
import AgreementCalculator from './AgreementCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const FIELDS = JSON.parse(fs.readFileSync(waveInput('joa', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('joa'), 'joa_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    EC9_WAVE_DIR: mirrorDir('joa'),
    EC9_ENGINES: path.join(ROOT, 'packages/engines'),
    EC9_REPO: ROOT,
    EC9_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));
const caseOf = (c) => c;
// THE PASTE PATH: the case file exactly as the capstone card offers it for copying.
const CASE_TEXT = {
  IDUMU: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/joa/idumu_case.json'), 'utf8'),
  OKWELLE: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/joa/okwelle_case.json'), 'utf8'),
  ABIAMA: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/joa/abiama_case.json'), 'utf8'),
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
  idumu_zed_paying_pct: ['IDUMU', AccountCalculator, 'interests', (h) => cell(h, 'paying interest', 'ZED')],
  idumu_zed_june_call: ['IDUMU', AccountCalculator, 'cashCalls', (h) => cell(h, 'call', '2029-06 ZED')],
  idumu_zed_august_paid: ['IDUMU', AccountCalculator, 'cashCalls', (h) => cell(h, 'paid', '2029-08 ZED')],
  idumu_budget_allowed_overrun: ['IDUMU', AccountCalculator, 'budget', (h) => tile(h, 'Allowed overrun')],
  idumu_operating_overhead: ['IDUMU', AccountCalculator, 'overhead', (h) => cell(h, 'charge', 'operating')],
  idumu_development_overhead: ['IDUMU', AccountCalculator, 'overhead', (h) => cell(h, 'charge', 'development')],
  okwelle_2031_carry_balance: ['OKWELLE', RecoveryCalculator, 'carry', (h) => cell(h, 'closing', 2031)],
  okwelle_backin_refund_to_pra: ['OKWELLE', RecoveryCalculator, 'backIn', (h) => cell(h, 'refund received', 'PRA')],
  okwelle_default_interest: ['OKWELLE', RecoveryCalculator, 'default', (h) => tile(h, 'Total default interest')],
  okwelle_default_cover_oko: ['OKWELLE', RecoveryCalculator, 'default', (h) => cell(h, 'cover', 'OKO')],
  okwelle_prb_june_call: ['OKWELLE', RecoveryCalculator, 'ledger', (h) => cell(h, 'call', '2030-06 PRB')],
  okwelle_2032_cost_recovered: ['OKWELLE', RecoveryCalculator, 'psc', (h) => cell(h, 'cost recovered', 2032)],
  abiama_spb_premium: ['ABIAMA', AgreementCalculator, 'soleRisk', (h) => cell(h, 'premium', 'SPB')],
  abiama_spb_2036_receipt: ['ABIAMA', AgreementCalculator, 'soleRisk', (h) => cell(h, 'non-consenting party receives', 'SPB 2036')],
  abiama_buy_in_to_spa: ['ABIAMA', AgreementCalculator, 'buyIn', (h) => cell(h, 'amount received', 'SNC to SPA')],
  abiama_spa_carry_npv: ['ABIAMA', AgreementCalculator, 'carry', (h) => cell(h, 'NPV', 'SPA')],
  abiama_2035_government_profit_oil: ['ABIAMA', AgreementCalculator, 'psc', (h) => cell(h, 'government profit oil', 2035)],
  abiama_abo_after_forfeiture_pct: ['ABIAMA', AgreementCalculator, 'default', (h) => cell(h, 'interest after forfeiture', 'ABO')],
};
const PANEL_OF_TIER = { beginner: AccountCalculator, intermediate: RecoveryCalculator, advanced: AgreementCalculator };

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
    console.log('[joa panels] all 18 graded fields read off a rendered panel within their tolerance');
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
    console.log('[joa panels] all 18 graded fields read off a rendered panel with the whole case file pasted');
  }, 120000);
  it('NEGATIVE CONTROL: a field read one row off is caught', () => {
    const [, , value, tol] = FIELDS.find((f) => f[1] === 'okwelle_2031_carry_balance');
    const html = renderToStaticMarkup(React.createElement(RecoveryCalculator, { initialMode: 'carry', initialCase: caseOf(INPUTS.OKWELLE) }));
    expect(Math.abs(Number(cell(html, 'closing', 2030)) - value)).toBeGreaterThan(tol);
  });
});
