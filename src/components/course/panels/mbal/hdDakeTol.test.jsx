// HELD DECISION (HD), mbal advanced: the Dake 9.2 oil in place tolerance.
//
// W5c left a residual: at tol 3 MMSTB the field `dake_ooip_mmstb` passed
// Dake's own published least squares fit (310.2 MMSTB) and the course's
// one-parameter history match, so a learner who copied the textbook number
// passed without running the engine. The owner approved tightening it
// (migration 20261030a_hd_mbal.sql, tol 3 -> 0.5; spec
// docs/graded-field-audit/hd/mbal.json).
//
// Everything here comes from the vendored engine or its fixture: the key from
// runDakeTank, the printed reading from the tank explorer itself rendered in
// its Dake mode, and the wrong answers from the fixture (Dake's fit and
// truth) and from runHistoryMatch. CONTROLS: at the old tol the textbook fit
// and the history match pass, which is the defect this closes.
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { REPO, migrationFields } from '@/lib/w5cGuardKit';
import { runHistoryMatch } from '@petrolord/engines/engines/mbal/mbalEngine.ts';
import { DAKE_CT_RESERVOIR } from '@petrolord/engines/test-data/mbal/dake-9-2.ts';
import * as L from './tankLab';

// The tank explorer opens on the Ekene history. To render the learner's route
// (Dataset: Dake Exercise 9.2, aquifer Carter-Tracy finite) without a DOM,
// the panel's own opening choices are overridden by call order: its first
// useState is the dataset, its third the Dake aquifer.
const OPEN = { on: false, n: 0, set: { 1: 'dake', 3: 'finite' } };
vi.mock('react', async (orig) => {
  const R = await orig();
  const useState = (init) => {
    if (!OPEN.on) return R.useState(init);
    OPEN.n += 1;
    return R.useState(OPEN.n in OPEN.set ? OPEN.set[OPEN.n] : init);
  };
  return { ...R, default: { ...R, useState }, useState };
});
const { default: TankExplorer } = await import('./TankExplorer.jsx');

const FILE = '20261030a_hd_mbal.sql';
const KEY = 'dake_ooip_mmstb';
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/hd/mbal.json'), 'utf8'));
const TT = SPEC.tiers.advanced.tighten.find((t) => t.key === KEY);

function hdFields() {
  const sql = fs.readFileSync(path.join(REPO, 'migrations', FILE), 'utf8');
  const m = sql.match(/update public\.academy_capstones\s+set fields = '((?:[^']|'')*)'::jsonb\s+where app_slug = 'mbal' and tier = 'advanced' and active/);
  if (!m) throw new Error(`${FILE} writes no mbal/advanced row`);
  return JSON.parse(m[1].replace(/''/g, "'"));
}
const HD = hdFields();
const W5 = migrationFields('20261028c_w5_mbal.sql', 'mbal', 'advanced').fields;
const F = HD.find((f) => f.key === KEY);
const passes = (x, tol = F.tol) => Math.abs(x - F.expected) <= tol;

function tileReading() {
  OPEN.on = true; OPEN.n = 0;
  try {
    const html = renderToStaticMarkup(React.createElement(TankExplorer));
    const m = html.match(/OOIP from the regression<\/p><p[^>]*>([^<]+)</);
    if (!m) throw new Error('the Dake mode tile did not render');
    return m[1];
  } finally { OPEN.on = false; }
}

const dake = L.runDakeTank({ aquifer: 'finite' });
const hm = runHistoryMatch(dake.inputs, { fit_parameters: ['stoiip_stb'] });
const hmN = hm.matched_parameters.find((p) => p.key === 'stoiip_stb');

describe('HD mbal: the tightened tolerance', () => {
  it('moves only the tol of dake_ooip_mmstb, to the spec value; the key is the engine', () => {
    expect(F.tol).toBe(Number(TT.tol_new));
    expect(W5.find((f) => f.key === KEY).tol).toBe(Number(TT.tol_old));
    expect(HD.map((f) => ({ ...f, tol: f.key === KEY ? null : f.tol })))
      .toEqual(W5.map((f) => ({ ...f, tol: f.key === KEY ? null : f.tol })));
    expect(Math.abs(dake.ooip_mmstb - F.expected)).toBeLessThan(1e-9 * F.expected);
  });

  it('passes the reading the tank explorer prints on the route, and the honest roundings of it', () => {
    const shown = tileReading();
    const v = Number(shown.replace(/,/g, ''));
    expect(shown).toMatch(/^\d{3}\.\d{5,6}$/);
    expect(passes(v)).toBe(true);
    // a whole MMSTB is the coarsest report the course itself uses ("312 MMSTB")
    for (const d of [0, 1, 2, 3]) expect(passes(Number(dake.ooip_mmstb.toFixed(d))), `${d} dp`).toBe(true);
  });

  it('fails the textbook numbers and the other methods', () => {
    const wrong = {
      'Dake least squares fit': DAKE_CT_RESERVOIR.dake_N_lsq_hve_mmstb,
      'Dake truth': DAKE_CT_RESERVOIR.dake_N_truth_mmstb,
      'history match, N only': hm.matched_ooip_stb / 1e6,
      'history match 95 percent low': hmN.ci95_low / 1e6,
      'history match 95 percent high': hmN.ci95_high / 1e6,
      'no aquifer': L.runDakeTank({ aquifer: 'none' }).ooip_mmstb,
      'infinite acting': L.runDakeTank({ aquifer: 'infinite' }).ooip_mmstb,
    };
    for (const [what, x] of Object.entries(wrong)) expect(passes(x), what).toBe(false);
    // the textbook fit misses by several tolerances, not by a hair
    expect(Math.abs(DAKE_CT_RESERVOIR.dake_N_lsq_hve_mmstb - F.expected)).toBeGreaterThan(4 * F.tol);
    // the whole interval of the history match lies above the band
    expect(hmN.ci95_low / 1e6).toBeGreaterThan(F.expected + F.tol);
  });

  it('CONTROL: at the old tol the textbook fit and the history match pass (the defect)', () => {
    const old = Number(TT.tol_old);
    expect(passes(DAKE_CT_RESERVOIR.dake_N_lsq_hve_mmstb, old)).toBe(true);
    expect(passes(hm.matched_ooip_stb / 1e6, old)).toBe(true);
  });

  it('CONTROL: the render override reaches the Dake mode (the opening render is the Ekene tank)', () => {
    const html = renderToStaticMarkup(React.createElement(TankExplorer));
    expect(html).not.toMatch(/OOIP from the regression/);
  });
});
