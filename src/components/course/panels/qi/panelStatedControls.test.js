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

// THE PRESTACK EXPLORER (Professional): the same rule, on the QUARVIN case
// pasted and on the Ekene pack.
import QiPrestackExplorer, { MODES as PRO_MODES } from './QiPrestackExplorer.jsx';
import * as P from './qiLabPro.js';

const PRO_TEXT = readCaseText('quarvin');
const Q = JSON.parse(PRO_TEXT);
const renderPro = (mode, initialText = null) => renderToStaticMarkup(React.createElement(QiPrestackExplorer, { initialMode: mode, initialText }));
/** The option a labelled select shows as chosen, or null. */
const chosen = (html, label) => {
  const m = html.match(new RegExp(`>${esc(label)}</label><select[^>]*>([\\s\\S]*?)</select>`));
  if (!m) return null;
  const o = m[1].match(/<option value="([^"]*)" selected="">/);
  return o ? o[1] : null;
};
const missingPro = (html, want) => Object.entries(want).filter(([label, v]) => String(shown(html, label) ?? chosen(html, label)) !== String(v))
  .map(([l, v]) => `${l}: wanted ${v}, shows ${shown(html, l) ?? chosen(html, l)}`);
const listText = (a) => a.join(', ');

describe('THE STATED CONTROLS OF THE PRESTACK EXPLORER', () => {
  it('declares the eight views', () => {
    expect(PRO_MODES.map((m) => m[0])).toEqual(['wavelet', 'tie', 'compare', 'gathers', 'velocity', 'angles', 'avo', 'wells']);
  });

  it('with the prestack case pasted, every view shows each stated input at the value the case states', () => {
    const st = Q.stated;
    const want = {
      velocity: { 'Dix layer ending at, ms (stated)': st.dixLayer.toMs, 'Time, ms (stated)': st.timeMs, 'Offset, m (stated)': st.offsetM },
      angles: { 'Angle bin edges, degrees (stated)': listText(st.angleEdges), 'Sample time, ms (stated)': st.targetMs, 'Far stack from bin (stated)': st.farBins[0], 'Far stack to bin, excluded (stated)': st.farBins[1] },
      avo: { 'Angle bin edges, degrees (stated)': listText(st.angleEdges), 'Sample time, ms (stated)': st.targetMs, 'Mean angle of each bin, degrees (stated)': listText(st.stackAngles), 'Shuey terms (stated)': st.shueyTerms },
      gathers: { 'Event near, ms (stated)': st.targetMs, 'Offset bin width, m (stated)': P.EKENE_PRO.binWidthM },
    };
    for (const [mode, w] of Object.entries(want)) expect(missingPro(renderPro(mode, PRO_TEXT), w), mode).toEqual([]);
  });

  it('on the Ekene pack, every control shows the course setting', () => {
    const E = P.EKENE_PRO;
    const want = {
      wavelet: { 'Trace window start, ms (stated)': E.waveletWindowMs[0], 'Trace window end, ms (stated)': E.waveletWindowMs[1], 'Wavelet length, ms (stated)': E.waveletLengthMs, 'Spectral smoothing, Hz (stated)': E.waveletSmoothHz },
      tie: { 'Bulk shift search, ms (stated)': E.bulkMaxLagMs, 'Checkshot times moved by, ms (stated)': 0 },
      compare: { 'Alignment search, samples (stated)': E.compareMaxLag },
      gathers: { 'Stretch limit, fraction (stated)': E.maxStretch, 'Moveout half window, ms (stated)': E.rmoWindowMs, 'Moveout largest shift, ms (stated)': E.rmoMaxLagMs, 'Pilot traces, nearest (stated)': E.rmoNearCount, 'Pick half window, ms (stated)': E.pickHalfWindowMs },
      angles: { 'Angle bin edges, degrees (stated)': listText(E.angleEdges), 'Minimum fold (stated)': E.minFold },
      avo: { 'Mean angle of each bin, degrees (stated)': listText(E.stackAngles), 'Chi, degrees (stated)': E.chiDeg },
    };
    for (const [mode, w] of Object.entries(want)) expect(missingPro(renderPro(mode), w), mode).toEqual([]);
  });

  it('no view refuses on the pack or on the case, and AVO at the wells prints the one scale', () => {
    for (const [mode] of PRO_MODES) {
      expect(renderPro(mode), mode).not.toContain('THE ENGINE REFUSED');
      expect(renderPro(mode, PRO_TEXT), mode).not.toContain('THE ENGINE REFUSED');
    }
    expect(renderPro('wells', PRO_TEXT)).toContain('One scale over every well');
  });

  it('NEGATIVE CONTROL: a missing or wrong prestack control is reported, and a refusal prints verbatim', () => {
    const html = renderPro('velocity', PRO_TEXT);
    expect(missingPro(html, { 'Offset, m (stated)': Q.stated.offsetM + 1 })).toHaveLength(1);
    expect(missingPro(html, { 'Minimum fold (stated)': 2 })).toHaveLength(1);
    const bad = JSON.parse(PRO_TEXT);
    bad.velocity.rows = [[1000, 2500], [1100, 2000]];
    expect(renderPro('velocity', JSON.stringify(bad))).toContain('The RMS velocities give no real interval velocity at 1.1 s.');
  });
});

// THE INVERSION AND PROSPECT EXPLORERS (Expert): the same rule, on the
// DELSHOLM case pasted and on the Ekene pack.
import QiInversionExplorer, { MODES as INV_MODES } from './QiInversionExplorer.jsx';
import QiProspectExplorer, { MODES as PROS_MODES } from './QiProspectExplorer.jsx';
import * as X from './qiLabExp.js';

const EXP_TEXT = readCaseText('delsholm');
const D = JSON.parse(EXP_TEXT);
const renderInv = (mode, initialText = null) => renderToStaticMarkup(React.createElement(QiInversionExplorer, { initialMode: mode, initialText }));
const renderPros = (mode, initialText = null) => renderToStaticMarkup(React.createElement(QiProspectExplorer, { initialMode: mode, initialText }));

describe('THE STATED CONTROLS OF THE INVERSION AND PROSPECT EXPLORERS', () => {
  it('declares their views', () => {
    expect(INV_MODES.map((m) => m[0])).toEqual(['forward', 'lfm', 'scale', 'modelBased', 'coloured', 'blind', 'spread', 'simultaneous']);
    expect(PROS_MODES.map((m) => m[0])).toEqual(['transform', 'leftout', 'facies', 'closure', 'conformance']);
  });

  it('with the Expert case pasted, every view shows each stated input at the value the case states', () => {
    const st = D.stated;
    const inv = {
      lfm: { 'Inverse distance power (stated)': st.lfm.power, 'Sample of the second position, index from the first (stated)': st.lfm.sampleB },
      modelBased: { 'Regularisation weight eps (stated)': st.modelBased.eps, 'Iterations (stated)': st.modelBased.iters, 'Sample of the target trace, index from the first (stated)': st.modelBased.sampleA },
      simultaneous: { 'Weights for ln(AI), ln(SI), ln(density) (stated)': listText(st.simultaneous.eps), 'Iterations (stated)': st.simultaneous.iters, 'Sample of the target trace, index from the first (stated)': st.simultaneous.sampleA },
    };
    for (const [mode, w] of Object.entries(inv)) expect(missingPro(renderInv(mode, EXP_TEXT), w), mode).toEqual([]);
    const pros = {
      transform: { 'Interval level (stated)': st.porosity.level, 'AI to predict at, kg/(m2 s) (stated)': st.porosity.atAi },
      facies: { 'AI to classify at, kg/(m2 s) (stated)': st.facies.atAi, 'Density per facies (stated)': st.facies.kind },
    };
    for (const [mode, w] of Object.entries(pros)) expect(missingPro(renderPros(mode, EXP_TEXT), w), mode).toEqual([]);
  });

  it('on the Ekene pack, every control shows the course setting', () => {
    const E = X.EXPERT;
    const inv = {
      modelBased: {
        'Window start, ms (stated)': E.windowMs[0], 'Window end, ms (stated)': E.windowMs[1], 'Ricker wavelet, Hz (stated)': E.waveletHz,
        'Wavelet half length, ms (stated)': E.waveletHalfMs, 'LFM cut, Hz (stated)': E.lfmHz, 'Method (stated)': 'model_based',
        'Regularisation weight eps (stated)': E.eps, 'Iterations (stated)': E.iters, 'Inverse distance power (stated)': E.idwPower,
        'High cut of the log scored against, Hz (stated)': E.truthHz,
      },
      coloured: { 'Band low edge, Hz (stated)': E.band[0], 'Band high edge, Hz (stated)': E.band[1] },
      spread: { 'Signal to noise of the added noise (stated)': E.noiseSnr, 'First seed (stated)': E.seeds[0], 'Realisations (stated)': E.seeds.length },
      simultaneous: { 'Weights for ln(AI), ln(SI), ln(density) (stated)': listText(E.simEps), 'Stacks used (stated)': 'near,mid,far' },
      forward: { 'Seed of the two test vectors (stated)': 42 },
    };
    for (const [mode, w] of Object.entries(inv)) expect(missingPro(renderInv(mode), w), mode).toEqual([]);
    const pros = {
      transform: { 'Net sand Vsh cut-off (stated)': 0.35, 'Interval level (stated)': E.levelInterval },
      facies: { 'Attributes (stated)': 'ai', 'Priors (stated)': 'samples', 'Density per facies (stated)': 'gaussian' },
      conformance: { 'Anomaly: nodes shallower than the spill plus, ft (stated)': 0, 'Cut the anomaly at the middle column (stated)': 'no', 'Feasibility verdict (stated)': 'feasible', 'Competing explanation (stated)': 'none' },
    };
    for (const [mode, w] of Object.entries(pros)) expect(missingPro(renderPros(mode), w), mode).toEqual([]);
  });

  it('no view refuses on the pack or on the case, and the left-out band and the scale are computed through the engines', () => {
    for (const [mode] of INV_MODES) {
      expect(renderInv(mode), mode).not.toContain('THE ENGINE REFUSED');
      expect(renderInv(mode, EXP_TEXT), mode).not.toContain('THE ENGINE REFUSED');
    }
    for (const [mode] of PROS_MODES) {
      expect(renderPros(mode), mode).not.toContain('THE ENGINE REFUSED');
      expect(renderPros(mode, EXP_TEXT), mode).not.toContain('THE ENGINE REFUSED');
    }
    expect(renderPros('leftout')).toContain('s_extra, the widening');
    expect(renderPros('leftout')).toContain('engines/qi/propertyCalibration.js');
    expect(renderInv('scale')).toContain('engines/qi/inversionQc.js');
    for (const html of [renderPros('leftout'), renderInv('lfm'), renderInv('scale'), renderPros('conformance')]) {
      expect(html).not.toMatch(/AWAITING|APP ARITHMETIC|ARRIVES IN QI STUDIO|app code/i);
    }
  });

  it('NEGATIVE CONTROL: a missing or wrong Expert control is reported, and a refusal prints verbatim', () => {
    const html = renderInv('modelBased', EXP_TEXT);
    expect(missingPro(html, { 'Iterations (stated)': D.stated.modelBased.iters + 1 })).toHaveLength(1);
    expect(missingPro(html, { 'Band low edge, Hz (stated)': 8 })).toHaveLength(1);
    const bad = JSON.parse(EXP_TEXT);
    bad.stated.modelBased.eps = -1;
    expect(renderInv('modelBased', JSON.stringify(bad))).toContain('The regularisation weight must be zero or positive.');
  });
});
