// EVERY GRADED SC4 FIELD CAN BE READ OFF A CALCULATOR PANEL, AT THE GRADING
// TOLERANCE. The Suite's Marine Logistics Planner runs the same engine, and a
// learner without a Suite seat has only the course's panels.
// A field the panels do not print to six decimals asks the learner to rebuild an
// engine line by hand. So each of the eighteen fields is READ FROM A RENDERED
// PANEL, with the tier's own capstone case loaded the way a learner pastes it
// (the whole case file; the view reads the block chosen in its block selector),
// and compared with fields.json at the field's own tolerance.
//
// The capstone cases come from the committed marine_capstone.mjs --inputs (run
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
import VoyageCalculator from './VoyageCalculator.jsx';
import DeckCalculator from './DeckCalculator.jsx';
import BaseCalculator from './BaseCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const FIELDS = JSON.parse(fs.readFileSync(waveInput('marine', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('marine'), 'marine_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    SC4_WAVE_DIR: mirrorDir('marine'),
    SC4_ENGINES: path.join(ROOT, 'packages/engines'),
    SC4_REPO: ROOT,
    SC4_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));
// THE PASTE PATH: the case file exactly as the capstone card offers it for copying.
const CASE_TEXT = {
  NKEREFI: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/marine/nkerefi_case.json'), 'utf8'),
  AKOKWA: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/marine/akokwa_case.json'), 'utf8'),
  MGBIDI: fs.readFileSync(path.join(ROOT, 'src/content/capstone-cases/marine/mgbidi_case.json'), 'utf8'),
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
  nkerefi_milkrun_hours: ['NKEREFI', VoyageCalculator, 'voyagePlan', 'voyagePlan:milk-run', (h) => cell(h, 'total hours', 'milk-run', 'voyage')],
  nkerefi_milkrun_fuel_t: ['NKEREFI', VoyageCalculator, 'voyagePlan', 'voyagePlan:milk-run', (h) => cell(h, 'fuel t', 'milk-run', 'voyage')],
  nkerefi_milkrun_fuel_cost: ['NKEREFI', VoyageCalculator, 'voyagePlan', 'voyagePlan:milk-run', (h) => cell(h, 'fuel cost', 'milk-run', 'voyage')],
  nkerefi_milkrun_deadweight_t: ['NKEREFI', VoyageCalculator, 'voyagePlan', 'voyagePlan:milk-run', (h) => cell(h, 'deadweight load, t', 'milk-run', 'voyage')],
  nkerefi_binding_utilisation: ['NKEREFI', VoyageCalculator, 'voyagePlan', 'voyagePlan:milk-run', (h) => cell(h, 'binding utilisation', 'milk-run', 'voyage')],
  nkerefi_dedicated_days: ['NKEREFI', VoyageCalculator, 'voyagePlan', 'voyagePlan:dedicated', (h) => tile(h, 'Total days')],
  akokwa_voyages_exact: ['AKOKWA', VoyageCalculator, 'fleetSize', 'fleetSize', (h) => cell(h, 'voyages before rounding', 'milk-run', 'voyage set')],
  akokwa_vessel_days: ['AKOKWA', VoyageCalculator, 'fleetSize', 'fleetSize', (h) => tile(h, 'Vessel-days')],
  akokwa_vessels_exact: ['AKOKWA', VoyageCalculator, 'fleetSize', 'fleetSize', (h) => tile(h, 'Vessels before rounding')],
  akokwa_spare_vessel_days: ['AKOKWA', VoyageCalculator, 'fleetSize', 'fleetSize', (h) => tile(h, 'Spare vessel-days')],
  akokwa_ffd_v1_area_m2: ['AKOKWA', DeckCalculator, 'deckPlan', 'deckPlan', (h) => cell(h, 'area, m2', '1', 'voyage')],
  akokwa_ffd_v2_load_utilisation: ['AKOKWA', DeckCalculator, 'deckPlan', 'deckPlan', (h) => cell(h, 'load utilisation', '2', 'voyage')],
  mgbidi_mmc_wait_hours: ['MGBIDI', BaseCalculator, 'shoreBase', 'shoreBase:mmc', (h) => tile(h, 'Mean wait, hours')],
  mgbidi_mmc_probability_wait: ['MGBIDI', BaseCalculator, 'shoreBase', 'shoreBase:mmc', (h) => tile(h, 'Probability of waiting')],
  mgbidi_mmc_time_at_base_hours: ['MGBIDI', BaseCalculator, 'shoreBase', 'shoreBase:mmc', (h) => tile(h, 'Mean time at the base, hours')],
  mgbidi_mdc_wait_hours: ['MGBIDI', BaseCalculator, 'shoreBase', 'shoreBase:mdc', (h) => tile(h, 'Mean wait, hours')],
  mgbidi_mdc_mean_queue: ['MGBIDI', BaseCalculator, 'shoreBase', 'shoreBase:mdc', (h) => tile(h, 'Mean queue')],
  mgbidi_target_wait_hours: ['MGBIDI', BaseCalculator, 'shoreBase', 'shoreBase:mmc', (h) => tile(h, 'Mean wait at those berths, hours')],
};
const PANELS_OF_TIER = { beginner: [VoyageCalculator], intermediate: [VoyageCalculator, DeckCalculator], advanced: [BaseCalculator] };

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
    FIELDS.forEach(([tier, key]) => expect(PANELS_OF_TIER[tier], key).toContain(WHERE[key][1]));
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
    console.log('[marine panels] all 18 graded fields read off a rendered panel within their tolerance');
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
    console.log('[marine panels] all 18 graded fields read off a rendered panel with the whole case file pasted');
  }, 120000);
  it('the block selector is what picks the block: the M/M/c wait read from the M/D/c block is a different figure', () => {
    const render = reader((cap) => ({ initialText: CASE_TEXT[cap] }));
    const [, , mmc, tol] = FIELDS.find((f) => f[1] === 'mgbidi_mmc_wait_hours');
    const onMdc = tile(render('MGBIDI', BaseCalculator, 'shoreBase', 'shoreBase:mdc'), 'Mean wait, hours');
    expect(Math.abs(Number(onMdc) - mmc)).toBeGreaterThan(tol);
  });
  it('NEGATIVE CONTROL: a field read one row off is caught', () => {
    const [, , value, tol] = FIELDS.find((f) => f[1] === 'akokwa_ffd_v1_area_m2');
    const html = renderToStaticMarkup(React.createElement(DeckCalculator, { initialMode: 'deckPlan', initialCase: INPUTS.AKOKWA, initialBlock: 'deckPlan' }));
    expect(Math.abs(Number(cell(html, 'area, m2', '2', 'voyage')) - value)).toBeGreaterThan(tol);
  });
});
