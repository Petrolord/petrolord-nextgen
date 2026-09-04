// EVERY MODE OF EVERY PD4 PANEL MUST RENDER, not just the one the panel opens on.
//
// The suite's shared panelRender.test.jsx mounts every panel in the repo with no
// props, which is the gate that caught thirty panels dying on first render when
// panelKit's SelectField destructured its options as an array pair while the
// panels passed `{ value, label }` objects. That gate mounts ONE mode per panel,
// the default one, so a select or a chart inside any other mode is unproved.
//
// These three panels have fifteen modes between them, each with its own tables,
// its own charts and in two cases its own second select. This file mounts all
// fifteen, which is why the panels take an `initialMode` prop: the host renders
// them with no props and gets the default, and this gate renders them one mode
// at a time.
//
// It is a SMOKE gate and nothing more. What each mode computes is pinned in
// rodPumpLab.test.js against the wave's teaching digest; what this file says is
// that the numbers reach a screen.
//
// COST. Every mode but the five on the string panel marches the damped wave
// equation, so this file is slow by construction and carries its own timeout.

import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import StringExplorer from './StringExplorer.jsx';
import CardExplorer from './CardExplorer.jsx';
import BalanceExplorer from './BalanceExplorer.jsx';

const PANELS = [
  ['pd-string-explorer', StringExplorer, ['objects', 'taper', 'note', 'linkage', 'pump']],
  ['pd-card-explorer', CardExplorer, ['march', 'stretch', 'loads', 'power', 'fillage']],
  ['pd-balance-explorer', BalanceExplorer, ['envelope', 'convergence', 'balance', 'ignored', 'stress']],
];

describe('every mode of every rod pump panel renders', () => {
  it('there are three panels and fifteen modes to check', () => {
    expect(PANELS).toHaveLength(3);
    expect(PANELS.flatMap(([, , modes]) => modes)).toHaveLength(15);
  });

  PANELS.forEach(([id, Panel, modes]) => {
    it(`${id} renders with no props at all, the way the host renders it`, () => {
      expect(() => renderToStaticMarkup(React.createElement(Panel))).not.toThrow();
    }, 120000);

    modes.forEach((initialMode) => {
      it(`${id} renders its ${initialMode} mode`, () => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        // it rendered, and it rendered CONTENT: a mode that threw its way into
        // the empty-state note would still be a mode that did not work
        expect(html.length).toBeGreaterThan(2000);
        expect(html).not.toMatch(/NaN/);
      }, 120000);
    });
  });
});
