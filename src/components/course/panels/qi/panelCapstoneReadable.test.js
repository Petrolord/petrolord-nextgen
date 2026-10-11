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
import { associateFigures, professionalFigures, expertFigures, readCaseText, qiWaveInput } from './qiCaseFigures.testkit.js';
import QiPrestackExplorer from './QiPrestackExplorer.jsx';
import QiInversionExplorer from './QiInversionExplorer.jsx';
import QiProspectExplorer from './QiProspectExplorer.jsx';

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
    expect([...Object.keys(WHERE), ...Object.keys(WHERE_PRO), ...Object.keys(WHERE_EXP)].sort()).toEqual(GRADED_FIELDS.map((f) => f[1]).sort());
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
    const fields = JSON.parse(fs.readFileSync(src.path, 'utf8'));
    console.log(`[qi readable] fields.json read from ${src.from}`);
    expect(fields.length).toBe(18);
    fields.forEach(([, key, value, tol]) => {
      expect(tol).toBe(gradedTolerance(key));
      expect(Math.abs(value - (FIG[key] ?? FIG_PRO[key] ?? FIG_EXP[key])), key).toBeLessThanOrEqual(1e-9);
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

// THE PROFESSIONAL FIELDS, read off the prestack explorer with the QUARVIN case
// pasted the way a learner pastes it.
const PRO_TEXT = readCaseText('quarvin');
const FIG_PRO = professionalFigures(JSON.parse(PRO_TEXT));
const PQ = JSON.parse(PRO_TEXT).stated;
const WHERE_PRO = {
  quarvin_dix_vint: ['velocity', (h) => tile(h, `Dix interval velocity, ${PQ.dixLayer.fromMs} to ${PQ.dixLayer.toMs} ms`)],
  quarvin_walden_deg: ['velocity', (h) => tile(h, 'Walden angle at the offset and time')],
  quarvin_nmo_stretch: ['velocity', (h) => tile(h, 'NMO stretch at the offset and time')],
  quarvin_far_stack_amp: ['angles', (h) => tile(h, `Partial stack, bins ${PQ.farBins[0]} up to ${PQ.farBins[1]}`)],
  quarvin_shuey_a: ['avo', (h) => tile(h, 'Intercept A at the sample')],
  quarvin_one_scale: ['wells', (h) => tile(h, 'One scale over every well')],
};
const renderPro = (mode, initialText) => renderToStaticMarkup(React.createElement(QiPrestackExplorer, { initialMode: mode, initialText }));

describe('EVERY GRADED PROFESSIONAL FIELD IS READABLE OFF THE PRESTACK EXPLORER', () => {
  it('each field read from the panel with the case pasted lands within its tolerance', () => {
    for (const [key, [mode, how]] of Object.entries(WHERE_PRO)) {
      const shown = how(renderPro(mode, PRO_TEXT));
      expect(shown, key).toMatch(/^-?\d+\.\d{6}$/);
      expect(Math.abs(Number(shown) - FIG_PRO[key]), `${key}: panel ${shown}, lab ${FIG_PRO[key]}`).toBeLessThanOrEqual(gradedTolerance(key));
    }
  });

  it('NEGATIVE CONTROL: the same readers on the Ekene pack miss every case figure', () => {
    let missed = 0;
    for (const [key, [mode, how]] of Object.entries(WHERE_PRO)) {
      let shown = 'none';
      try { shown = how(renderPro(mode, null)); } catch { shown = 'none'; }
      if (!(Math.abs(Number(shown) - FIG_PRO[key]) <= gradedTolerance(key))) missed += 1;
    }
    expect(missed).toBe(6);
  });
});

// THE EXPERT FIELDS, read off the inversion and prospect explorers with the
// DELSHOLM case pasted the way a learner pastes it.
const EXP_TEXT = readCaseText('delsholm');
const FIG_EXP = expertFigures(JSON.parse(EXP_TEXT));
const DS = JSON.parse(EXP_TEXT).stated;
const six6 = (v) => v.toFixed(6);
const WHERE_EXP = {
  delsholm_lfm_lnai_b: ['inv', 'lfm', (h) => tile(h, 'LFM ln(AI) at the stated sample')],
  delsholm_mb_ai: ['inv', 'modelBased', (h) => tile(h, 'Inverted AI at the stated sample')],
  delsholm_sim_vpvs: ['inv', 'simultaneous', (h) => tile(h, 'Vp/Vs at the stated sample')],
  delsholm_phi_q90: ['pros', 'transform', (h) => cell(h, 'high end of the interval', six6(DS.porosity.atAi))],
  delsholm_p_oil: ['pros', 'facies', (h) => cell(h, `P(${DS.facies.class})`, six6(DS.facies.atAi))],
  delsholm_column_ft: ['pros', 'closure', (h) => tile(h, 'Column from crest to spill')],
};
const renderExp = (panel, mode, initialText) => renderToStaticMarkup(React.createElement(panel === 'inv' ? QiInversionExplorer : QiProspectExplorer, { initialMode: mode, initialText }));

describe('EVERY GRADED EXPERT FIELD IS READABLE OFF THE INVERSION AND PROSPECT EXPLORERS', () => {
  it('each field read from the panel with the case pasted lands within its tolerance', () => {
    for (const [key, [panel, mode, how]] of Object.entries(WHERE_EXP)) {
      const shown = how(renderExp(panel, mode, EXP_TEXT));
      expect(shown, key).toMatch(/^-?\d+\.\d{6}$/);
      expect(Math.abs(Number(shown) - FIG_EXP[key]), `${key}: panel ${shown}, lab ${FIG_EXP[key]}`).toBeLessThanOrEqual(gradedTolerance(key));
    }
  });

  it('NEGATIVE CONTROL: the same readers on the Ekene pack miss every case figure', () => {
    let missed = 0;
    for (const [key, [panel, mode, how]] of Object.entries(WHERE_EXP)) {
      let shown = 'none';
      try { shown = how(renderExp(panel, mode, null)); } catch { shown = 'none'; }
      if (!(Math.abs(Number(shown) - FIG_EXP[key]) <= gradedTolerance(key))) missed += 1;
    }
    expect(missed).toBe(6);
  });
});
