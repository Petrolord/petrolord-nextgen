// EVERY GRADED QI FIELD CAN BE READ OFF THE FEASIBILITY EXPLORER, AT ITS
// GRADING TOLERANCE. The Suite's QI Studio runs the same engines, and a learner
// without a Suite seat has only the course's panels. Each of the six Associate
// fields is READ FROM THE RENDERED PANEL with the TAMBERLO case pasted the way
// a learner pastes it (the whole case file), and compared with the value the
// lab computes from the same case at the field's own tolerance. When the wave's
// fields.json is reachable the lab value is checked against it too. Nothing
// here types a capstone value.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import QiFeasibilityExplorer from './QiFeasibilityExplorer.jsx';
import { GRADED_FIELDS, gradedTolerance } from './gradedTolerance.js';
import { associateFigures, readCaseText, qiWaveInput } from './qiCaseFigures.testkit.js';

const CASE_TEXT = readCaseText('tamberlo');
const FIG = associateFigures(JSON.parse(CASE_TEXT));

const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
const tables = (html) => [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map(([t]) => {
  const head = [...t.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]));
  const body = t.split('<tbody>')[1] || '';
  const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => text(m[1])));
  return { head, rows };
});
const cell = (html, column, rowKey) => {
  const t = tables(html).find((x) => x.head.includes(column));
  if (!t) throw new Error(`no table prints the column "${column}"`);
  const row = t.rows.find((r) => r[0] === rowKey);
  if (!row) throw new Error(`the "${column}" table has no row "${rowKey}"`);
  return row[t.head.indexOf(column)];
};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const tile = (html, label) => {
  const m = html.match(new RegExp(`<p[^>]*>${esc(label)}</p><p[^>]*>([^<]*)`));
  if (!m) throw new Error(`no tile labelled "${label}"`);
  return m[1];
};

// key -> [view, how to read it]
const WHERE = {
  tamberlo_low6_hz: ['qc', (h) => tile(h, '-6 dB low edge')],
  tamberlo_centroid_hz: ['qc', (h) => tile(h, 'Centroid')],
  tamberlo_shear_slope: ['shear', (h) => tile(h, 'c1, the slope')],
  tamberlo_ai_brine: ['substitution', (h) => tile(h, 'AI after substitution to brine')],
  tamberlo_vpvs_brine: ['substitution', (h) => tile(h, 'Vp/Vs after substitution to brine')],
  tamberlo_wet_distance: ['wet', (h) => cell(h, 'distance from the fitted line', 'cap rock over the oil leg, in situ')],
};
const render = (mode, initialText) => renderToStaticMarkup(React.createElement(QiFeasibilityExplorer, { initialMode: mode, initialText }));

describe('EVERY GRADED QI FIELD IS READABLE OFF A PANEL', () => {
  it('names a reader for every graded field and nothing else', () => {
    expect(Object.keys(WHERE).sort()).toEqual(GRADED_FIELDS.map((f) => f[1]).sort());
  });

  it('each field read from the panel with the case pasted lands within its tolerance', () => {
    const read = [];
    for (const [key, [mode, how]] of Object.entries(WHERE)) {
      const shown = how(render(mode, CASE_TEXT));
      expect(shown, key).toMatch(/^-?\d+\.\d{6}$/);
      expect(Math.abs(Number(shown) - FIG[key]), `${key}: panel ${shown}, lab ${FIG[key]}`).toBeLessThanOrEqual(gradedTolerance(key));
      read.push(key);
    }
    expect(read).toHaveLength(6);
  });

  it('the lab figures agree with the wave fields.json when it is reachable', async () => {
    const src = await qiWaveInput('fields.json');
    if (src.missing) {
      console.log(`[qi readable] fields.json not cross-checked: ${src.missing}`);
      return;
    }
    const fields = JSON.parse(fs.readFileSync(src.path, 'utf8')).filter((f) => f[0] === 'beginner');
    console.log(`[qi readable] fields.json read from ${src.from}`);
    expect(fields.length).toBe(6);
    fields.forEach(([, key, value, tol]) => {
      expect(tol).toBe(gradedTolerance(key));
      expect(Math.abs(value - FIG[key]), key).toBeLessThanOrEqual(1e-9);
    });
  });

  it('NEGATIVE CONTROL: the same readers on the Ekene pack (no case) miss every case figure', () => {
    let missed = 0;
    for (const [key, [mode, how]] of Object.entries(WHERE)) {
      const shown = how(render(mode, null));
      if (Math.abs(Number(shown) - FIG[key]) > gradedTolerance(key)) missed += 1;
    }
    expect(missed).toBe(6);
  });
});
