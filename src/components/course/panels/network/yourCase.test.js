// THE TYPED NETWORK VIEWS REACH THE GRADED ANSWERS, AND ONLY WHEN TYPED.
//
// B5 follow-on W4, route (b), owner decision D2: the capstone guard's rule is
// that no panel DEFAULT state lands on a graded answer. Typing the network the
// capstone prompt states is the work the capstone asks for, so a learner who
// types it into the Network explorer's typed view (intermediate) or the Fight
// explorer's typed view (advanced) must be able to read every graded value, at
// the decimals the view prints, inside the grader's own absolute tolerance.
//
// This file proves four things, all by calling the lab, which calls the
// vendored engine:
//   a. the prompt's network, typed exactly as the prompt states it, prints
//      every graded key inside its tolerance at the printed decimals, against
//      the wave's fields.json (the file the grader was generated from) AND
//      against the literal values the grader holds;
//   b. the default state (the teaching network) lands on no graded answer;
//   c. a negative control: one typed number changed and a graded key is lost;
//   d. both typed views render content with no NaN.
//
// The graded field's name is not written here: the guard forbids it in every
// source in this folder but its own, so the wells are typed by number.

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { typedNetwork, TYPED_NETWORK_DEFAULT, teachingQuantities } from './networkLab.js';
import NetworkExplorer from './NetworkExplorer.jsx';
import FightExplorer from './FightExplorer.jsx';
import { TYPED_PRINT_DP } from './TypedNetworkFields.jsx';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const FIELDS = JSON.parse(fs.readFileSync(waveInput('network', 'fields.json'), 'utf8'));

/** The graded values as the database holds them, transcribed from the live tiers. */
const DB = {
  net_header_h1_psia: [879.9476730307991, 0.00044],
  net_satellite_m_psia: [884.148272605056, 0.00045],
  net_tee_h2_psia: [704.6819057375309, 0.00036],
  net_trunk_mass_lbd: [17662.798867634527, 0.0089],
  net_bypass_mass_lbd: [12974.021847848679, 0.0065],
  net_crosslink_mass_lbd: [-942.7867573914898, 0.00048],
  fight_w1_rate_lbd: [6161.276989112374, 0.0031],
  fight_w4_rate_lbd: [729.3706808145245, 0.00037],
  stream_bypass_water_stbd: [1470.97340763847, 0.00074],
  exact_linear_h1_psia: [626.3272410560802, 0.00032],
  hidden_produced_lbd: [17962.798867634523, 0.009],
  hidden_gap_fraction: [0.01670118349655065, 8.4e-9],
};

/** The network the two capstone prompts state, as a learner types it. */
const typedPrompt = () => ({
  separatorPsia: '235',
  tolerance: '1e-12',
  maxIter: '',
  nodes: [{ name: 'West manifold' }, { name: 'Satellite tee' }, { name: 'Trunk tee' }, { name: '' }],
  wells: [
    { name: 'Well 3', qmax: '7300', prPsia: '3250', allocationLbD: '', k: '430', capLbD: '', to: 'n1', kLinear: '31', qoStbd: '1420', qwStbd: '176', qgMscfd: '1135' },
    { name: 'Well 7', qmax: '5400', prPsia: '2050', allocationLbD: '', k: '505', capLbD: '', to: 'n1', kLinear: '44', qoStbd: '862', qwStbd: '645', qgMscfd: '708' },
    { name: 'Well 11', qmax: '6900', prPsia: '2950', allocationLbD: '', k: '390', capLbD: '', to: 'n2', kLinear: '27', qoStbd: '1238', qwStbd: '412', qgMscfd: '1476' },
    { name: 'Well 14', qmax: '1850', prPsia: '1180', allocationLbD: '', k: '232', capLbD: '', to: 'n1', kLinear: '19', qoStbd: '174', qwStbd: '523', qgMscfd: '97' },
    { name: 'Well 19', qmax: '2640', prPsia: '1900', allocationLbD: '1450', k: '210', capLbD: '1150', to: 'n1', kLinear: '23', qoStbd: '306', qwStbd: '58', qgMscfd: '241' },
    { name: '', qmax: '', prPsia: '', allocationLbD: '', k: '', capLbD: '', to: '', kLinear: '', qoStbd: '', qwStbd: '', qgMscfd: '' },
  ],
  branches: [
    { name: 'West bypass', from: 'n1', to: 'n3', k: '980', kLinear: '88' },
    { name: 'Crosslink', from: 'n1', to: 'n2', k: '460', kLinear: '36' },
    { name: 'Satellite loop leg', from: 'n2', to: 'n3', k: '350', kLinear: '41' },
    { name: 'Trunk', from: 'n3', to: 'sep', k: '815', kLinear: '63' },
    { name: '', from: '', to: '', k: '', kLinear: '' },
  ],
});

const node = (r, id) => r.nodes.find((n) => n.id === id).pressurePsia;
const branch = (r, label) => r.branches.find((b) => b.label === label);

/** Every graded key read off the typed result, with the decimals the view prints it at. */
const readings = (r) => ({
  net_header_h1_psia: [node(r, 'n1'), TYPED_PRINT_DP.pressure],
  net_satellite_m_psia: [node(r, 'n2'), TYPED_PRINT_DP.pressure],
  net_tee_h2_psia: [node(r, 'n3'), TYPED_PRINT_DP.pressure],
  net_trunk_mass_lbd: [branch(r, 'Trunk').signedMassDrawnSenseLbD, TYPED_PRINT_DP.mass],
  net_bypass_mass_lbd: [branch(r, 'West bypass').signedMassDrawnSenseLbD, TYPED_PRINT_DP.mass],
  net_crosslink_mass_lbd: [branch(r, 'Crosslink').signedMassDrawnSenseLbD, TYPED_PRINT_DP.mass],
  fight_w1_rate_lbd: [r.wells[0].rateOnSystemLbD, TYPED_PRINT_DP.mass],
  fight_w4_rate_lbd: [r.wells[3].rateOnSystemLbD, TYPED_PRINT_DP.mass],
  stream_bypass_water_stbd: [branch(r, 'West bypass').waterStbd, TYPED_PRINT_DP.stream],
  exact_linear_h1_psia: [r.linear.nodes.find((n) => n.id === 'n1').pressurePsia, TYPED_PRINT_DP.pressure],
  hidden_produced_lbd: [r.producedLbD, TYPED_PRINT_DP.mass],
  hidden_gap_fraction: [r.conservationRelative, TYPED_PRINT_DP.fraction],
});

const graded = (key) => {
  const f = FIELDS.find(([, k]) => k === key);
  if (!f) throw new Error(`${key} is not in the wave's fields.json`);
  return { tier: f[0], value: f[2], tol: f[3] };
};

const printed = (v, dp) => Number(v.toFixed(dp));

describe('the typed network views reach every graded answer when the prompt is typed', () => {
  const r = typedNetwork(typedPrompt(), { streams: true, linear: true });

  it('the typed network solves, converges, and carries its audit and its twin', () => {
    expect(r.ok, (r.errors || []).join(' ')).toBe(true);
    expect(r.converged).toBe(true);
    expect(r.streams.ok).toBe(true);
    expect(r.linear.ok).toBe(true);
    expect(r.nodes).toHaveLength(9);
    expect(r.branches).toHaveLength(9);
  });

  it('the twelve keys are the wave\'s intermediate and advanced network fields, and the DB literals agree with fields.json', () => {
    const keys = Object.keys(DB);
    expect(keys).toHaveLength(12);
    keys.forEach((k) => {
      const g = graded(k);
      expect(['intermediate', 'advanced']).toContain(g.tier);
      expect(g.value, k).toBe(DB[k][0]);
      expect(g.tol, k).toBe(DB[k][1]);
    });
  });

  Object.keys(DB).forEach((key) => {
    it(`${key} prints inside its tolerance`, () => {
      const [value, dp] = readings(r)[key];
      const { value: expected, tol } = graded(key);
      expect(Number.isFinite(value), key).toBe(true);
      expect(Math.abs(printed(value, dp) - expected), `${key} printed ${value.toFixed(dp)}`).toBeLessThanOrEqual(tol);
      expect(Math.abs(printed(value, dp) - DB[key][0]), key).toBeLessThanOrEqual(DB[key][1]);
    });
  });

  it('prints every graded key at or above the minimum decimals the audit set', () => {
    const minDp = {
      net_header_h1_psia: 4, net_satellite_m_psia: 4, net_tee_h2_psia: 4,
      net_trunk_mass_lbd: 2, net_bypass_mass_lbd: 2, net_crosslink_mass_lbd: 4,
      fight_w1_rate_lbd: 3, fight_w4_rate_lbd: 4, stream_bypass_water_stbd: 3,
      exact_linear_h1_psia: 4, hidden_produced_lbd: 2, hidden_gap_fraction: 10,
    };
    const rd = readings(r);
    Object.entries(minDp).forEach(([k, d]) => expect(rd[k][1], k).toBeGreaterThanOrEqual(d));
  });
});

describe('the default state is the teaching network and lands on no graded answer', () => {
  it('is on the swept teaching surface', () => {
    const labels = new Set(teachingQuantities().map((q) => q.label.split('.').slice(0, 2).join('.')));
    expect(labels.has('typedNetwork.default')).toBe(true);
  });

  it('no number the default state carries is within ten tolerances of any graded field, under five restatements', () => {
    const d = typedNetwork(TYPED_NETWORK_DEFAULT, { streams: true, linear: true });
    expect(d.ok, (d.errors || []).join(' ')).toBe(true);
    expect(d.streams.ok).toBe(true);
    expect(d.linear.ok).toBe(true);
    const nums = [];
    const walk = (v) => {
      if (typeof v === 'number') { if (Number.isFinite(v)) nums.push(v); return; }
      if (Array.isArray(v)) { v.forEach(walk); return; }
      if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(d);
    expect(nums.length).toBeGreaterThan(60);
    const hits = [];
    nums.forEach((x) => FIELDS.forEach(([, k, value, tol]) => {
      [1, 1000, 0.001, 100, 0.01].forEach((f) => {
        if (Math.abs(x - value * f) <= 10 * tol * f) hits.push(`${x} near ${k} x${f}`);
      });
    }));
    expect(hits).toEqual([]);
  });
});

describe('negative control: the test can fail', () => {
  it('a crosslink typed at a different conductance loses the graded crosslink mass', () => {
    const input = typedPrompt();
    input.branches[1].k = '470';
    const r = typedNetwork(input, { streams: true, linear: true });
    expect(r.ok).toBe(true);
    const [value, dp] = readings(r).net_crosslink_mass_lbd;
    const { value: expected, tol } = graded('net_crosslink_mass_lbd');
    expect(Math.abs(printed(value, dp) - expected)).toBeGreaterThan(tol);
  });

  it('the capacity limit left blank loses the conservation gap', () => {
    const input = typedPrompt();
    input.wells[4].capLbD = '';
    const r = typedNetwork(input, { streams: true, linear: true });
    expect(r.ok).toBe(true);
    const { value: expected, tol } = graded('hidden_gap_fraction');
    expect(Math.abs(printed(r.conservationRelative, TYPED_PRINT_DP.fraction) - expected)).toBeGreaterThan(tol);
  });

  it('bad input is refused with a sentence and never thrown', () => {
    const input = typedPrompt();
    input.wells[0].qmax = 'abc';
    input.branches[3].to = 'n4';
    const r = typedNetwork(input);
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBeGreaterThanOrEqual(2);
    expect(typedNetwork(null).ok).toBe(false);
  });
});

describe('both typed views render', () => {
  [['network explorer', NetworkExplorer], ['fight explorer', FightExplorer]].forEach(([name, Panel]) => {
    it(`the ${name} typed view renders content and no NaN`, () => {
      const html = renderToStaticMarkup(React.createElement(Panel, { initialMode: 'typed' }));
      expect(html.length).toBeGreaterThan(2000);
      expect(html).not.toMatch(/NaN/);
      expect(html).not.toMatch(/undefined/);
      expect(html).toMatch(/conservation gap/i);
    }, 60000);
  });
});
