// EVERY GRADED SC3 FIELD CAN BE READ OFF A CALCULATOR PANEL, AT THE GRADING
// TOLERANCE. The panels are the practical for every learner without a Suite
// seat, so a field the panels do not print to six decimals asks the learner to
// rebuild an engine line by hand. Each of the eighteen fields is READ FROM A
// RENDERED PANEL, with the tier's own capstone case loaded the way a learner
// pastes it (the whole case file; the view reads the block chosen in its block
// selector), and compared with fields.json at the field's own tolerance.
//
// The capstone cases come from the committed materials_capstone.mjs --inputs
// (run in a child process against this repository's vendored engine) and from
// the committed case files; nothing here types a capstone value.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import * as L from './materialsLab.js';
import RegisterCalculator from './RegisterCalculator.jsx';
import StockCalculator from './StockCalculator.jsx';
import SparesCalculator from './SparesCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const FIELDS = JSON.parse(fs.readFileSync(waveInput('materials', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('materials'), 'materials_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    SC3_WAVE_DIR: mirrorDir('materials'),
    SC3_ENGINES: path.join(ROOT, 'packages/engines'),
    SC3_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));
// THE PASTE PATH: the case file exactly as the capstone card offers it for copying.
const CASE_TEXT = {
  IGBARIAM: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/materials/igbariam_case.json'), 'utf8'),
  OGIDI: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/materials/ogidi_case.json'), 'utf8'),
  UMUCHU: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/materials/umuchu_case.json'), 'utf8'),
};

const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
/** Every table in the markup as { head, rows } of cell text. */
const tables = (html) => [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map(([t]) => {
  const head = [...t.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]));
  const body = t.split('<tbody>')[1] || '';
  const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => text(m[1])));
  return { head, rows };
});
const cell = (html, column, rowKey, keyColumn = 0) => {
  const t = tables(html).find((x) => x.head.includes(column));
  if (!t) throw new Error(`no table prints the column "${column}"`);
  const row = t.rows.find((r) => r[keyColumn] === String(rowKey));
  if (!row) throw new Error(`the "${column}" table has no row for ${rowKey}`);
  return row[t.head.indexOf(column)];
};
const tile = (html, label) => {
  const m = html.match(new RegExp(`<p[^>]*>${label}</p><p[^>]*>([^<]*)`));
  if (!m) throw new Error(`no tile labelled "${label}"`);
  return m[1];
};
const cheapest = (h) => tile(h, 'Cheapest number of spares');

// key -> [capstone, panel, view, block, how to read it]
const WHERE = {
  igbariam_trim_weighted_score: ['IGBARIAM', RegisterCalculator, 'criticality', 'criticality', (h) => cell(h, 'weighted score', 'IGB-V204')],
  igbariam_inhibitor_cumulative_pct: ['IGBARIAM', RegisterCalculator, 'abcClassification', 'abcClassification', (h) => cell(h, 'cumulative share', 'IGB-C515', 1)],
  igbariam_inhibitor_eoq: ['IGBARIAM', RegisterCalculator, 'eoq', 'eoq', (h) => tile(h, 'EOQ')],
  igbariam_inhibitor_relevant_cost: ['IGBARIAM', RegisterCalculator, 'eoq', 'eoq', (h) => tile(h, 'Relevant cost a year')],
  igbariam_inhibitor_rounding_penalty_pct: ['IGBARIAM', RegisterCalculator, 'eoq', 'eoq', (h) => tile(h, 'Rounding penalty, percent')],
  igbariam_total_write_down: ['IGBARIAM', RegisterCalculator, 'slowMoving', 'slowMoving', (h) => tile(h, 'Total write-down')],
  ogidi_tubing_discount_quantity: ['OGIDI', StockCalculator, 'quantityDiscount', 'quantityDiscount', (h) => tile(h, 'Quantity ordered')],
  ogidi_tubing_discount_total_cost: ['OGIDI', StockCalculator, 'quantityDiscount', 'quantityDiscount', (h) => tile(h, 'Total cost a year')],
  ogidi_filter_csl_safety_stock: ['OGIDI', StockCalculator, 'safetyStock', 'safetyStock:cycle-service', (h) => tile(h, 'Safety stock')],
  ogidi_filter_fill_rate_k: ['OGIDI', StockCalculator, 'safetyStock', 'safetyStock:fill-rate', (h) => tile(h, 'Safety factor k, exact')],
  ogidi_filter_periodic_level: ['OGIDI', StockCalculator, 'safetyStock', 'safetyStock:periodic', (h) => tile(h, 'Reorder point or order-up-to level')],
  ogidi_kit_poisson_short: ['OGIDI', StockCalculator, 'poissonStock', 'poissonStock', (h) => tile(h, 'Expected units short a cycle')],
  umuchu_motor_total_cost: ['UMUCHU', SparesCalculator, 'insuranceSpares', 'insuranceSpares', (h) => tile(h, 'Total cost a year at the cheapest stock')],
  umuchu_motor_downtime_cost: ['UMUCHU', SparesCalculator, 'insuranceSpares', 'insuranceSpares', (h) => cell(h, 'downtime cost a year', cheapest(h))],
  umuchu_motor_no_shortage: ['UMUCHU', SparesCalculator, 'insuranceSpares', 'insuranceSpares', (h) => cell(h, 'probability of no shortage', cheapest(h))],
  umuchu_motor_fill_rate: ['UMUCHU', SparesCalculator, 'insuranceSpares', 'insuranceSpares', (h) => cell(h, 'fill rate', cheapest(h))],
  umuchu_seal_poisson_short: ['UMUCHU', SparesCalculator, 'poissonStock', 'poissonStock', (h) => tile(h, 'Expected units short a cycle')],
  umuchu_seal_poisson_fill_rate: ['UMUCHU', SparesCalculator, 'poissonStock', 'poissonStock', (h) => tile(h, 'Achieved fill rate')],
};
const PANEL_OF_TIER = { beginner: RegisterCalculator, intermediate: StockCalculator, advanced: SparesCalculator };

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
  it('the committed case files are the capstone generator\'s own inputs', () => {
    Object.entries(CASE_TEXT).forEach(([cap, t]) => {
      const c = JSON.parse(t);
      const { name, label, ...blocks } = INPUTS[cap];
      expect(c.label).toBe(label);
      expect(c.dataset).toBe(`${name} (synthetic)`);
      Object.entries(blocks).forEach(([k, v]) => expect(c[k], `${cap} ${k}`).toEqual(v));
    });
  });
  it('renders each field from its panel with the capstone case loaded, within the grading tolerance', () => {
    const render = reader((cap) => ({ initialCase: INPUTS[cap] }));
    let read = 0;
    FIELDS.forEach(([, key, value, tol]) => {
      const [cap, Panel, mode, block, get] = WHERE[key];
      const html = render(cap, Panel, mode, block);
      expect(html, `${key}: the ${mode} view refused the case`).not.toContain('THE ENGINE REFUSED');
      const shown = get(html);
      expect(shown, `${key} is printed with six decimals`).toMatch(/^-?\d+\.\d{6}$/);
      expect(Math.abs(Number(shown) - value), `${key}: the panel prints ${shown}, graded ${value} at ${tol}`).toBeLessThanOrEqual(tol);
      read += 1;
    });
    expect(read).toBe(18);
    console.log('[materials panels] all 18 graded fields read off a rendered panel within their tolerance');
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
    console.log('[materials panels] all 18 graded fields read off a rendered panel with the whole case file pasted');
  }, 120000);
  it('the Monte Carlo block of the Expert case runs in the spares calculator, labelled sampled and ungraded, and no field reads it', () => {
    const block = INPUTS.UMUCHU.leadTimeRisk;
    const html = renderToStaticMarkup(React.createElement(SparesCalculator, { initialMode: 'leadTimeRisk', initialText: CASE_TEXT.UMUCHU }));
    expect(html).not.toContain('THE ENGINE REFUSED');
    expect(html).toContain('SAMPLED AND UNGRADED');
    expect(html).toContain(`seed ${block.seed} and ${block.iterations} draws`);
    expect(html).toContain(L.leadTimeRiskOf(block).percentileDefinition);
    Object.values(WHERE).forEach(([, , mode]) => expect(mode).not.toBe('leadTimeRisk'));
  });
  it('the block selector is what picks the block: the periodic level read from the cycle-service block is a different figure', () => {
    const render = reader((cap) => ({ initialText: CASE_TEXT[cap] }));
    const [, , level, tol] = FIELDS.find((f) => f[1] === 'ogidi_filter_periodic_level');
    const onCsl = tile(render('OGIDI', StockCalculator, 'safetyStock', 'safetyStock:cycle-service'), 'Reorder point or order-up-to level');
    expect(Math.abs(Number(onCsl) - level)).toBeGreaterThan(tol);
  });
  it('NEGATIVE CONTROL: a field read one row off is caught', () => {
    const [, , value, tol] = FIELDS.find((f) => f[1] === 'umuchu_motor_downtime_cost');
    const html = renderToStaticMarkup(React.createElement(SparesCalculator, { initialMode: 'insuranceSpares', initialCase: INPUTS.UMUCHU }));
    expect(Math.abs(Number(cell(html, 'downtime cost a year', String(Number(cheapest(html)) + 1))) - value)).toBeGreaterThan(tol);
  });
});
