// THE STATED CONTROLS OF THE SC3 PANELS.
//
// Every input a call needs has a visible control that shows what the box
// states (or "not stated") and writes into the box; no control supplies a
// value the box does not show. The REQUIRED inputs are found here
// independently of the panels: every leaf of every block of every capstone case
// file (and of every fixture case) is removed in turn, and each removal the
// engine refuses is an input the panel must show a control for. Then every
// view is rendered with the WHOLE case file pasted into its box, and each such
// control's label must be on the page; and setting each declared control to
// "not stated" must make the engine refuse, naming that field in its own words.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fileURLToPath } from 'node:url';
import * as L from './materialsLab.js';
import { CONTROLS } from './materialsViews.jsx';
import RegisterCalculator, { MODES as REGISTER_MODES } from './RegisterCalculator.jsx';
import StockCalculator, { MODES as STOCK_MODES } from './StockCalculator.jsx';
import SparesCalculator, { MODES as SPARES_MODES } from './SparesCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const CASES = Object.fromEntries(['igbariam', 'ogidi', 'umuchu'].map((n) => [n, fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/materials/${n}_case.json`), 'utf8')]));
const PANEL_OF = { igbariam: [RegisterCalculator, REGISTER_MODES], ogidi: [StockCalculator, STOCK_MODES], umuchu: [SparesCalculator, SPARES_MODES] };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const labelled = (html, label) => html.includes(`>${esc(label)}</label>`);

/** Every leaf path of a block; the items of a register and the free-text names and labels of criteria are stated in the box, and skipped. */
const leafPaths = (o, at = '') => {
  if (Array.isArray(o)) return o.flatMap((x, i) => leafPaths(x, at ? `${at}.${i}` : String(i)));
  if (o && typeof o === 'object') return Object.entries(o).flatMap(([k, x]) => leafPaths(x, at ? `${at}.${k}` : k));
  return [at];
};
const inBox = (p) => /^items\./.test(p) || /^criteria\.\d+\.label$/.test(p);
const removed = (block, p) => JSON.parse(L.setStated(L.pretty(block), 'x', p, undefined).text);

/** Every block of every case file and the view it belongs to. */
const BLOCKS = Object.entries(CASES).flatMap(([n, t]) => {
  const c = JSON.parse(t);
  return L.VIEWS.flatMap((v) => L.blockKeysOf(c, v).map((k) => ({ n, text: t, view: v, key: k, block: c[k] })));
});
/** The fixture's own starts too, each as one call's inputs. */
const FIXTURE_STARTS = [['criticality', 'critEkene'], ['abcClassification', 'abcEkene'], ['eoq', 'eoqBaryte'], ['slowMoving', 'smEkene'], ['quantityDiscount', 'qdCasing'],
  ['safetyStock', 'ssChokeBeans'], ['poissonStock', 'psPsvKits'], ['insuranceSpares', 'insEspMotor'], ['leadTimeRisk', 'ltrMechSeal']];

describe('EVERY INPUT THE ENGINE REFUSES WITHOUT HAS A VISIBLE CONTROL', () => {
  it('the case files hold twelve blocks across the three tiers, and every one runs', () => {
    expect(BLOCKS.map((b) => b.key)).toEqual(['criticality', 'abcClassification', 'eoq', 'slowMoving', 'quantityDiscount', 'safetyStock:cycle-service', 'safetyStock:fill-rate',
      'safetyStock:periodic', 'poissonStock', 'poissonStock', 'insuranceSpares', 'leadTimeRisk']);
    BLOCKS.forEach((b) => expect(L.viewRun(b.view, b.block, b.key).error, `${b.n} ${b.key}`).toBeUndefined());
  });
  it('each required input of each block (found by removing it) is declared as a control of its view', () => {
    let required = 0;
    const missing = [];
    [...BLOCKS.map((b) => [b.view, b.block, `${b.n} ${b.key}`]), ...FIXTURE_STARTS.map(([v, s]) => [v, L.STARTS[s], `fixture ${s}`])].forEach(([view, block, what]) => {
      const declared = CONTROLS[view](block).map((c) => c.path);
      leafPaths(block).filter((p) => !inBox(p)).forEach((p) => {
        const r = L.ROUTES[view](removed(block, p));
        if (!r.error) return;
        required += 1;
        if (!declared.includes(p)) missing.push(`${what}: ${p} (refused as ${r.field})`);
      });
    });
    expect(missing).toEqual([]);
    expect(required).toBeGreaterThan(120);
    console.log(`[materials controls] ${required} required inputs found by removal across the case files and the fixture starts, every one a declared control`);
  });
  it('every declared control, set to not stated, makes the engine refuse, naming that field in its own words', () => {
    let n = 0;
    BLOCKS.forEach((b) => CONTROLS[b.view](b.block).forEach((c) => {
      if (L.getAt(b.block, c.path) === undefined) return;
      const r = L.ROUTES[b.view](removed(b.block, c.path));
      if (c.path === 'serviceLevel' && b.view === 'leadTimeRisk') { expect(r.error).toBeUndefined(); return; }
      if (c.path === 'orderQuantity' && b.block.serviceMeasure === 'cycle-service') { expect(r.error).toBeUndefined(); return; }
      if (c.path === 'unitCost' && b.view === 'eoq' && b.block.holdingCostPerUnitYear !== undefined) return;
      expect(r.error, `${b.n} ${b.key}: removing ${c.path}`).toBeTruthy();
      expect(r.field, `${b.n} ${b.key}: removing ${c.path}`).toBe(c.refusedAs || L.fieldName(c.path));
      expect(r.error.startsWith(`${r.field} `)).toBe(true);
      n += 1;
    }));
    expect(n).toBeGreaterThan(60);
  });
});

describe('THE PASTE PATH THROUGH EVERY VIEW', () => {
  it('each view runs the block it chose of the whole pasted case file and shows the label of every control', () => {
    let shown = 0;
    BLOCKS.forEach((b) => {
      const [Panel, modes] = PANEL_OF[b.n];
      expect(modes.map((m) => m[0]), `${b.n} offers the ${b.view} view`).toContain(b.view);
      const html = renderToStaticMarkup(React.createElement(Panel, { initialMode: b.view, initialText: b.text, initialBlock: b.key }));
      expect(html, `${b.view} refused the pasted ${b.n} case at ${b.key}`).not.toContain('THE ENGINE REFUSED');
      CONTROLS[b.view](b.block).forEach((c) => { expect(labelled(html, c.label), `${b.n} ${b.key} shows "${c.label}"`).toBe(true); shown += 1; });
    });
    expect(shown).toBeGreaterThan(80);
  });
  it('every view offers the blank case, and on it the engine refuses in its own words', () => {
    [[RegisterCalculator, REGISTER_MODES], [StockCalculator, STOCK_MODES], [SparesCalculator, SPARES_MODES]].forEach(([Panel, modes]) => modes.forEach(([m]) => {
      const html = renderToStaticMarkup(React.createElement(Panel, { initialMode: m }));
      expect(html).toContain('A blank case: every input not stated');
      const blank = renderToStaticMarkup(React.createElement(Panel, { initialMode: m, initialText: '{}' }));
      expect(blank).toContain(esc(L.ROUTES[m]({}).error));
    }));
  });
  it('a stated control writes into the right block of a whole case file, and the other blocks stay as they were', () => {
    const t = CASES.ogidi;
    const c = JSON.parse(t);
    const next = JSON.parse(L.setStated(t, 'safetyStock:fill-rate', 'orderQuantity', undefined).text);
    expect(next['safetyStock:cycle-service']).toEqual(c['safetyStock:cycle-service']);
    expect(L.viewRun('safetyStock', next, 'safetyStock:fill-rate').field).toBe('orderQuantity');
    const band = JSON.parse(L.setStated(t, 'quantityDiscount', 'breaks.1', undefined).text);
    expect(band.quantityDiscount.breaks).toHaveLength(c.quantityDiscount.breaks.length - 1);
  });
  it('the rewrites keep the terms of their own form only', () => {
    expect(L.roundingFor('none', { rule: 'up', multiple: 5 })).toEqual({ rule: 'none' });
    expect(L.roundingFor('nearest', { rule: 'up', multiple: 5 })).toEqual({ rule: 'nearest', multiple: 5 });
    expect(L.roundingFor(undefined, {})).toBeUndefined();
    expect(L.factorRoundingFor('none', { rule: 'nearest', decimals: 2 })).toEqual({ rule: 'none' });
    expect(L.shapeFor('constant', { min: 1, mode: 2, max: 3 })).toBe(2);
    expect(L.shapeFor('triangular', 4)).toEqual({ min: 4, mode: 4, max: 4 });
    expect(L.fieldName('breaks.1.unitPrice')).toBe('breaks[1].unitPrice');
  });
  it('NEGATIVE CONTROL: a label no view prints is reported absent', () => {
    const html = renderToStaticMarkup(React.createElement(RegisterCalculator, { initialMode: 'eoq', initialText: CASES.igbariam }));
    expect(labelled(html, 'a control nobody wrote')).toBe(false);
    expect(labelled(html, 'Annual demand (stated)')).toBe(true);
  });
});
