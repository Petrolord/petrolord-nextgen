// EVERY GRADED EC11 FIELD CAN BE READ OFF A CALCULATOR PANEL, AT THE GRADING
// TOLERANCE. This is an engine course: the panels are a learner's only tool.
// A field the panels do not print to six decimals asks the learner to rebuild an
// engine line by hand. So each of the eighteen fields is READ FROM A RENDERED
// PANEL, with the tier's own capstone case loaded the way a learner pastes it
// (the whole case file; the view reads the block chosen in its block selector),
// and compared with fields.json at the field's own tolerance.
//
// The capstone cases come from the committed prms_capstone.mjs --inputs (run
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
import ClassificationCalculator from './ClassificationCalculator.jsx';
import ReservesCalculator from './ReservesCalculator.jsx';
import AggregationCalculator from './AggregationCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const FIELDS = JSON.parse(fs.readFileSync(waveInput('prms', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('prms'), 'prms_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    EC11_WAVE_DIR: mirrorDir('prms'),
    EC11_ENGINES: path.join(ROOT, 'packages/engines'),
    EC11_REPO: ROOT,
    EC11_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));
// THE PASTE PATH: the case file exactly as the capstone card offers it for copying.
const CASE_TEXT = {
  ABAGANA: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/prms/abagana_case.json'), 'utf8'),
  AWKUZU: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/prms/awkuzu_case.json'), 'utf8'),
  ISUOFIA: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/prms/isuofia_case.json'), 'utf8'),
};

const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
/** Every table in the markup as { head, rows } of cell text. */
const tables = (html) => [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map(([t]) => {
  const head = [...t.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]));
  const body = t.split('<tbody>')[1] || '';
  const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => text(m[1])));
  return { head, rows };
});
const cell = (html, column, rowKey, first = null) => {
  const t = tables(html).find((x) => x.head.includes(column) && (first === null || x.head[0] === first));
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

// key -> [capstone, panel, view, block, how to read it]
const WHERE = {
  abagana_prospect_pc_pct: ['ABAGANA', ClassificationCalculator, 'classify', 'classify:prospect', (h) => tile(h, 'Chance of commerciality, percent')],
  abagana_lead_pc_pct: ['ABAGANA', ClassificationCalculator, 'classify', 'classify:lead', (h) => tile(h, 'Chance of commerciality, percent')],
  abagana_reserves_p2: ['ABAGANA', ClassificationCalculator, 'categorize', 'categorize:reserves', (h) => cell(h, 'value', 'Probable (P2)', 'increment')],
  abagana_reserves_p3: ['ABAGANA', ClassificationCalculator, 'categorize', 'categorize:reserves', (h) => cell(h, 'value', 'Possible (P3)', 'increment')],
  abagana_contingent_2c: ['ABAGANA', ClassificationCalculator, 'categorize', 'categorize:contingent', (h) => cell(h, 'value', '2C', 'label')],
  abagana_contingent_3c: ['ABAGANA', ClassificationCalculator, 'categorize', 'categorize:contingent', (h) => cell(h, 'value', '3C', 'label')],
  awkuzu_best_ncf_share: ['AWKUZU', ReservesCalculator, 'economicLimit', 'economicLimit', (h) => cell(h, 'undiscounted net cash flow at the working interest', 'best')],
  awkuzu_best_npv_share: ['AWKUZU', ReservesCalculator, 'economicLimit', 'economicLimit', (h) => cell(h, 'NPV at the working interest', 'best')],
  awkuzu_2p_net_oil: ['AWKUZU', ReservesCalculator, 'economicLimit', 'economicLimit', (h) => cell(h, 'oil', '2P', 'category')],
  awkuzu_p2_boe: ['AWKUZU', ReservesCalculator, 'economicLimit', 'economicLimit', (h) => cell(h, 'BOE', 'P2', 'category')],
  awkuzu_p3_boe: ['AWKUZU', ReservesCalculator, 'economicLimit', 'economicLimit', (h) => cell(h, 'BOE', 'P3', 'category')],
  awkuzu_high_beyond_licence_oil: ['AWKUZU', ReservesCalculator, 'economicLimit', 'economicLimit', (h) => cell(h, 'oil beyond the licence', 'high')],
  isuofia_reserves_arith_1p: ['ISUOFIA', AggregationCalculator, 'aggregate', 'aggregate:reserves', (h) => cell(h, 'arithmetic sum', '1P')],
  isuofia_reserves_arith_3p: ['ISUOFIA', AggregationCalculator, 'aggregate', 'aggregate:reserves', (h) => cell(h, 'arithmetic sum', '3P')],
  isuofia_contingent_risked_mean: ['ISUOFIA', AggregationCalculator, 'aggregate', 'aggregate:contingent', (h) => tile(h, 'Risked mean')],
  isuofia_closing_1p: ['ISUOFIA', AggregationCalculator, 'reconcile', 'reconcile', (h) => cell(h, 'computed closing', '1P')],
  isuofia_closing_3p: ['ISUOFIA', AggregationCalculator, 'reconcile', 'reconcile', (h) => cell(h, 'computed closing', '3P')],
  isuofia_difference_2p: ['ISUOFIA', AggregationCalculator, 'reconcile', 'reconcile', (h) => cell(h, 'difference', '2P')],
};
const PANEL_OF_TIER = { beginner: ClassificationCalculator, intermediate: ReservesCalculator, advanced: AggregationCalculator };

const reader = (props) => {
  const cache = new Map();
  return (cap, Panel, mode, block) => {
    const k = `${cap}|${mode}|${block}|${Panel.name}`;
    if (!cache.has(k)) cache.set(k, renderToStaticMarkup(React.createElement(Panel, { initialMode: mode, initialBlock: block, ...props(cap) })));
    return cache.get(k);
  };
};

describe('EVERY GRADED FIELD IS READABLE FROM A PANEL AT ITS TOLERANCE', () => {
  it('maps all eighteen fields, each to its own tier\'s panel', () => {
    expect(Object.keys(WHERE).sort()).toEqual(FIELDS.map((f) => f[1]).sort());
    FIELDS.forEach(([tier, key]) => expect(WHERE[key][1], key).toBe(PANEL_OF_TIER[tier]));
  });
  it('renders each field from its panel with the capstone case loaded, within the grading tolerance', () => {
    const render = reader((cap) => ({ initialCase: INPUTS[cap] }));
    const read = [];
    FIELDS.forEach(([, key, value, tol]) => {
      const [cap, Panel, mode, block, get] = WHERE[key];
      const html = render(cap, Panel, mode, block);
      expect(html, `${key}: the ${mode} view refused the case`).not.toContain('THE ENGINE REFUSED');
      const shown = get(html);
      expect(shown, `${key} is printed with six decimals`).toMatch(/^-?\d+\.\d{6}$/);
      expect(Math.abs(Number(shown) - value), `${key}: the panel prints ${shown}, graded ${value} at ${tol}`).toBeLessThanOrEqual(tol);
      read.push(key);
    });
    expect(read).toHaveLength(18);
    console.log('[prms panels] all 18 graded fields read off a rendered panel within their tolerance');
  }, 120000);
  it('THE PASTE PATH: each field read the same way with the WHOLE case file pasted into the view box', () => {
    const render = reader((cap) => ({ initialText: CASE_TEXT[cap] }));
    let read = 0;
    FIELDS.forEach(([, key, value, tol]) => {
      const [cap, Panel, mode, block, get] = WHERE[key];
      const html = render(cap, Panel, mode, block);
      expect(html, `${key}: the ${mode} view refused the pasted case file`).not.toContain('THE ENGINE REFUSED');
      if (block.includes(':')) expect(html, `${key}: the block selector offers ${block}`).toContain(`>${block}</option>`);
      const shown = get(html);
      expect(shown, `${key} is printed with six decimals`).toMatch(/^-?\d+\.\d{6}$/);
      expect(Math.abs(Number(shown) - value), `${key}: pasted, the panel prints ${shown}, graded ${value} at ${tol}`).toBeLessThanOrEqual(tol);
      read += 1;
    });
    expect(read).toBe(18);
    console.log('[prms panels] all 18 graded fields read off a rendered panel with the whole case file pasted');
  }, 120000);
  it('the block selector is what picks the block: the lead read from the prospect block is a different figure', () => {
    const render = reader((cap) => ({ initialText: CASE_TEXT[cap] }));
    const [, , lead, tol] = FIELDS.find((f) => f[1] === 'abagana_lead_pc_pct');
    const onProspect = tile(render('ABAGANA', ClassificationCalculator, 'classify', 'classify:prospect'), 'Chance of commerciality, percent');
    expect(Math.abs(Number(onProspect) - lead)).toBeGreaterThan(tol);
  });
  it('NEGATIVE CONTROL: a field read one row off is caught', () => {
    const [, , value, tol] = FIELDS.find((f) => f[1] === 'isuofia_closing_1p');
    const html = renderToStaticMarkup(React.createElement(AggregationCalculator, { initialMode: 'reconcile', initialCase: INPUTS.ISUOFIA }));
    expect(Math.abs(Number(cell(html, 'computed closing', '2P')) - value)).toBeGreaterThan(tol);
  });
});
