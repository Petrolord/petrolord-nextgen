// EVERY GRADED EC7 FIELD CAN BE READ OFF A CALCULATOR PANEL, AT THE GRADING
// TOLERANCE. This is an engine course: the panels are a learner's only tool.
// A field the panels do not print to six decimals asks the learner to rebuild an
// engine line by hand, and a sum of printed six-decimal lines can miss a 5e-7
// tolerance. So each of the eighteen fields is READ FROM A RENDERED PANEL, with
// the tier's own capstone case loaded the way a learner pastes it, and compared
// with fields.json at the field's own tolerance.
//
// The capstone cases come from the committed pia_capstone.mjs --inputs (run in a
// child process against this repository's vendored engine); nothing here types
// a capstone value. Rendering uses the panels' initialCase prop, which is the
// case-file text a learner pastes into the case box.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import RoyaltyCalculator from './RoyaltyCalculator.jsx';
import HctCalculator from './HctCalculator.jsx';
import LedgerCalculator from './LedgerCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const FIELDS = JSON.parse(fs.readFileSync(waveInput('pia', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('pia'), 'pia_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    EC7_WAVE_DIR: mirrorDir('pia'),
    EC7_ENGINES: path.join(ROOT, 'packages/engines'),
    EC7_REPO: ROOT,
    EC7_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));
const caseOf = (c) => ({ cfg: c.cfg, prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows });

const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
/** Every table in the markup as { head, rows } of cell text. */
const tables = (html) => [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map(([t]) => {
  const head = [...t.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]));
  const body = t.split('<tbody>')[1] || '';
  const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => text(m[1])));
  return { head, rows };
});
const cell = (html, column, year) => {
  const t = tables(html).find((x) => x.head.includes(column));
  if (!t) throw new Error(`no table prints the column "${column}"`);
  const row = t.rows.find((r) => r[0] === String(year));
  if (!row) throw new Error(`the "${column}" table has no row for ${year}`);
  return row[t.head.indexOf(column)];
};
const tile = (html, label) => {
  const m = html.match(new RegExp(`<p[^>]*>${label}</p><p[^>]*>([^<]*)`));
  if (!m) throw new Error(`no tile labelled "${label}"`);
  return m[1];
};

// key -> [capstone, panel, view, how to read it]
const WHERE = {
  odozi_2028_liquids_royalty_rate: ['ODOZI', RoyaltyCalculator, 'stack', (h) => cell(h, 'liquids royalty rate', 2028)],
  odozi_2029_production_royalty_usd: ['ODOZI', RoyaltyCalculator, 'stack', (h) => cell(h, 'production royalty', 2029)],
  odozi_2030_hct_usd: ['ODOZI', RoyaltyCalculator, 'stack', (h) => cell(h, 'HCT', 2030)],
  odozi_2031_dev_levy_usd: ['ODOZI', RoyaltyCalculator, 'stack', (h) => cell(h, 'development levy', 2031)],
  odozi_total_cit_usd: ['ODOZI', RoyaltyCalculator, 'stack', (h) => tile(h, 'Total companies income tax')],
  odozi_government_take_pct: ['ODOZI', RoyaltyCalculator, 'stack', (h) => tile(h, 'Government take, percent')],
  nkemdi_2028_liquids_royalty_usd: ['NKEMDI', HctCalculator, 'base', (h) => cell(h, 'liquids production royalty', 2028)],
  nkemdi_2029_production_allowance_usd: ['NKEMDI', HctCalculator, 'base', (h) => cell(h, 'production allowance', 2029)],
  nkemdi_2029_hct_chargeable_profit_usd: ['NKEMDI', HctCalculator, 'base', (h) => cell(h, 'HCT chargeable profit', 2029)],
  nkemdi_2031_cpr_deferred_usd: ['NKEMDI', HctCalculator, 'base', (h) => cell(h, 'CPR carried out', 2031)],
  nkemdi_cpr_forfeited_usd: ['NKEMDI', HctCalculator, 'base', (h) => tile(h, 'Forfeited at cessation')],
  nkemdi_total_cit_usd: ['NKEMDI', HctCalculator, 'cit', (h) => tile(h, 'Total companies income tax')],
  alaku_2026_total_royalty_usd: ['ALAKU', LedgerCalculator, 'ledger', (h) => cell(h, 'total royalty', 2026)],
  alaku_2026_hct_chargeable_profit_usd: ['ALAKU', LedgerCalculator, 'ledger', (h) => cell(h, 'HCT chargeable profit', 2026)],
  alaku_2025_tet_usd: ['ALAKU', LedgerCalculator, 'ledger', (h) => cell(h, 'TET', 2025)],
  alaku_2027_dev_levy_usd: ['ALAKU', LedgerCalculator, 'ledger', (h) => cell(h, 'levy', 2027)],
  alaku_2028_cit_usd: ['ALAKU', LedgerCalculator, 'ledger', (h) => cell(h, 'CIT', 2028)],
  alaku_total_cit_usd: ['ALAKU', LedgerCalculator, 'ledger', (h) => tile(h, 'Total companies income tax')],
};
const PANEL_OF_TIER = { beginner: RoyaltyCalculator, intermediate: HctCalculator, advanced: LedgerCalculator };

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
    console.log('[pia panels] all 18 graded fields read off a rendered panel within their tolerance');
  }, 120000);
  it('NEGATIVE CONTROL: a field read one row off is caught', () => {
    const [, key, value, tol] = FIELDS.find((f) => f[1] === 'nkemdi_2031_cpr_deferred_usd');
    const html = renderToStaticMarkup(React.createElement(HctCalculator, { initialMode: 'base', initialCase: caseOf(INPUTS.NKEMDI) }));
    expect(Math.abs(Number(cell(html, 'CPR carried out', 2030)) - value)).toBeGreaterThan(tol);
    expect(key).toBeTruthy();
  });
});
