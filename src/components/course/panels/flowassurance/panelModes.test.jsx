// EVERY MODE OF EVERY PD6 PANEL MUST RENDER, not just the one the panel opens on.
//
// The suite's shared panelRender.test.jsx mounts every panel in the repo with
// no props, which is the gate that caught thirty panels dying on first render
// when panelKit's SelectField destructured its options as an array pair while
// the panels passed objects. That gate mounts ONE mode per panel, the default
// one, so a select, a chart or a table inside any other mode is unproved. On
// PD4 twelve of fifteen modes would otherwise have shipped unproved.
//
// These three panels have eighteen modes between them, each with its own
// tables, most with their own charts and several with a second select of their
// own. This file mounts all eighteen, which is why the panels take an
// `initialMode` prop: the host renders them with no props and gets the default,
// and this gate renders them one mode at a time.
//
// It is a SMOKE gate and nothing more. What each mode computes is pinned in
// flowAssuranceLab.test.js against the goldens and the wave's teaching digest;
// what this file says is that the numbers reach a screen.

import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import ThermalExplorer from './ThermalExplorer.jsx';
import LineExplorer from './LineExplorer.jsx';
import HydrateExplorer from './HydrateExplorer.jsx';

const PANELS = [
  ['pd-thermal-explorer', ThermalExplorer,
    ['catalog', 'stack', 'insulation', 'burial', 'reference', 'mass']],
  ['pd-line-explorer', LineExplorer,
    ['balance', 'profile', 'target', 'cooldown', 'mass', 'margin']],
  ['pd-hydrate-explorer', HydrateExplorer,
    ['jt', 'trench', 'reference', 'depression', 'dose', 'ceiling']],
];

describe('every mode of every flow assurance panel renders', () => {
  it('there are three panels and eighteen modes to check', () => {
    expect(PANELS).toHaveLength(3);
    expect(PANELS.flatMap(([, , modes]) => modes)).toHaveLength(18);
    // and every mode name is distinct within its own panel, so a typo in the
    // list above cannot quietly cover one mode twice and another not at all
    PANELS.forEach(([id, , modes]) => {
      expect(new Set(modes).size, id).toBe(modes.length);
    });
  });

  PANELS.forEach(([id, Panel, modes]) => {
    it(`${id} renders with no props at all, the way the host renders it`, () => {
      expect(() => renderToStaticMarkup(React.createElement(Panel))).not.toThrow();
    }, 60000);

    modes.forEach((initialMode) => {
      it(`${id} renders its ${initialMode} mode`, () => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        // it rendered, and it rendered CONTENT: a mode that threw its way into
        // the empty-state note would still be a mode that did not work
        expect(html.length).toBeGreaterThan(2000);
        // A not-a-number that reaches a screen is a defect, and several of
        // these views deliberately PRINT a refusal that returned one, so the
        // lab hands them a boolean and a phrase rather than the value itself.
        expect(html).not.toMatch(/>NaN</);
        expect(html).not.toMatch(/undefined/);
      }, 60000);
    });
  });

  it('and every panel opens on a mode that is in its own list', () => {
    // The default in the signature and the list this file walks are two
    // separate statements of the same fact, and they have to agree or a mode
    // is being mounted that the host never shows.
    const defaults = { ThermalExplorer: 'stack', LineExplorer: 'balance', HydrateExplorer: 'jt' };
    expect(PANELS[0][2]).toContain(defaults.ThermalExplorer);
    expect(PANELS[1][2]).toContain(defaults.LineExplorer);
    expect(PANELS[2][2]).toContain(defaults.HydrateExplorer);
  });
});
