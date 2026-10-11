// THE STATED CONTROLS OF THE FEASIBILITY EXPLORER.
//
// Every stated input the lab takes has a visible control showing its value: no
// hidden default. Rendered with the TAMBERLO case pasted (the paste path),
// every control the view needs is present and shows what the case states (its
// conditions and its stated choices); rendered on the Ekene pack, each shows
// the course's stated Ekene setting (EKENE in qiLab.js).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import QiFeasibilityExplorer, { MODES } from './QiFeasibilityExplorer.jsx';
import * as L from './qiLab.js';
import { readCaseText } from './qiCaseFigures.testkit.js';

const CASE_TEXT = readCaseText('tamberlo');
const C = JSON.parse(CASE_TEXT);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const render = (mode, initialText = null) => renderToStaticMarkup(React.createElement(QiFeasibilityExplorer, { initialMode: mode, initialText }));
/** The value a labelled number control shows, or null when no such control renders. */
const shown = (html, label) => {
  const m = html.match(new RegExp(`>${esc(label)}</label><input[^>]*value="([^"]*)"`));
  return m ? m[1] : null;
};
const missing = (html, want) => Object.entries(want).filter(([label, v]) => shown(html, label) !== String(v)).map(([l, v]) => `${l}: wanted ${v}, shows ${shown(html, l)}`);

const COND = (c) => ({
  'Temperature, degF (stated)': c.tF, 'Pressure, psia (stated)': c.pPsia, 'Brine salinity, weight fraction (stated)': c.salinity,
  'Oil gravity, API (stated)': c.api, 'Gas-oil ratio, scf/stb (stated)': c.gorScfStb, 'Gas gravity (stated)': c.gasSg,
});
const WANT = (st, cond) => ({
  qc: { 'Taper fraction (stated)': st.taper },
  shear: { 'Net sand Vsh cut-off (stated)': st.netSandVshCut, 'Prediction interval level (stated)': st.shearLevel ?? L.EKENE.shearLevel },
  elastic: { 'Net sand Vsh cut-off (stated)': st.netSandVshCut, 'Cap rock thickness above the top, ft (stated)': st.shaleAboveFt },
  substitution: { ...COND(cond), 'Net sand Vsh cut-off (stated)': st.netSandVshCut, ...(st.substitutionSampleFt ? { 'Sample depth, ft (stated)': st.substitutionSampleFt } : {}) },
  wet: { ...COND(cond), 'Block length, ft (stated)': st.trendBlockFt, 'Cap rock thickness above the top, ft (stated)': st.shaleAboveFt },
  avo: { ...COND(cond), 'Cap rock thickness above the top, ft (stated)': st.shaleAboveFt },
});

describe('THE STATED CONTROLS', () => {
  it('declares the seven views', () => {
    expect(MODES.map((m) => m[0])).toEqual(['inventory', 'qc', 'shear', 'elastic', 'substitution', 'wet', 'avo']);
  });

  it('with the case pasted, every view shows a control for each stated input, at the value the case states', () => {
    const want = WANT(C.stated, C.conditions);
    for (const [mode, w] of Object.entries(want)) {
      expect(missing(render(mode, CASE_TEXT), w), mode).toEqual([]);
    }
  });

  it('on the Ekene pack, every control shows the course setting', () => {
    const st = {
      taper: L.EKENE.qcTaper, netSandVshCut: L.EKENE.netSandVshCut, shearLevel: L.EKENE.shearLevel,
      shaleAboveFt: L.EKENE.shaleAboveFt, trendBlockFt: L.EKENE.trendBlockFt,
    };
    const want = WANT(st, L.PACK.conditions.ekene);
    for (const [mode, w] of Object.entries(want)) {
      expect(missing(render(mode), w), mode).toEqual([]);
    }
  });

  it('the QC window runs the whole case by default, and the trend form shows as a choice', () => {
    const t1 = (C.traces.t0_ms || 0) + (C.traces.traces[0].length - 1) * C.traces.dt_ms;
    const html = render('qc', CASE_TEXT);
    expect(shown(html, 'Window start, ms (stated)')).toBe(String(C.traces.t0_ms || 0));
    expect(shown(html, 'Window end, ms (stated)')).toBe(String(t1));
    expect(render('shear', CASE_TEXT)).toContain('>Trend form (stated)</label>');
  });

  it('NEGATIVE CONTROL: a control that is not rendered, or shows another value, is reported', () => {
    const html = render('qc', CASE_TEXT);
    expect(missing(html, { 'Taper fraction (stated)': 0.37 })).toHaveLength(1);
    expect(missing(html, { 'Block length, ft (stated)': C.stated.trendBlockFt })).toHaveLength(1);
  });

  it('an engine refusal prints in the engine\'s own words', () => {
    const bad = JSON.parse(CASE_TEXT);
    bad.conditions.pPsia = 0;
    const html = render('substitution', JSON.stringify(bad));
    expect(html).toContain('THE ENGINE REFUSED');
    expect(html).toContain('Temperature (degC) and positive pressure (MPa) required.');
  });
});
