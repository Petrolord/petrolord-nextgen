// EVERY MODE OF EVERY PD7 PANEL MUST RENDER, not just the one the panel opens on.
//
// The suite's shared panelRender.test.jsx mounts every panel in the repo with
// no props, which is the gate that caught thirty panels dying on first render
// when panelKit's SelectField destructured its options as an array pair while
// the panels passed objects. That gate mounts ONE mode per panel, the default
// one, so a select, a chart or a table inside any other mode is unproved. On
// PD4 twelve of fifteen modes would otherwise have shipped unproved.
//
// These three panels have nineteen modes between them, each with its own
// tables, most with their own charts and several with a second select of their
// own. This file mounts all nineteen, which is why the panels take an
// `initialMode` prop: the host renders them with no props and gets the default,
// and this gate renders them one mode at a time.
//
// It is a SMOKE gate and nothing more. What each mode computes is pinned in
// networkLab.test.js against the goldens and the wave's teaching digest; what
// this file says is that the numbers reach a screen.

import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import TrunkExplorer from './TrunkExplorer.jsx';
import NetworkExplorer from './NetworkExplorer.jsx';
import FightExplorer from './FightExplorer.jsx';

const PANELS = [
  ['pd-trunk-explorer', TrunkExplorer,
    ['table', 'wall', 'fittings', 'topology', 'solo']],
  ['pd-network-explorer', NetworkExplorer,
    ['linear', 'tree', 'solve', 'loop', 'fight', 'streams', 'diagnosis']],
  ['pd-fight-explorer', FightExplorer,
    ['pinned', 'residual', 'guess', 'streammass', 'tolerance', 'failure', 'cusp']],
];

describe('every mode of every production network panel renders', () => {
  it('there are three panels and nineteen modes to check', () => {
    expect(PANELS).toHaveLength(3);
    expect(PANELS.flatMap(([, , modes]) => modes)).toHaveLength(19);
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
    const defaults = { TrunkExplorer: 'table', NetworkExplorer: 'solve', FightExplorer: 'residual' };
    expect(PANELS[0][2]).toContain(defaults.TrunkExplorer);
    expect(PANELS[1][2]).toContain(defaults.NetworkExplorer);
    expect(PANELS[2][2]).toContain(defaults.FightExplorer);
  });

  it('and every mode that shows a converged flag shows a conservation gap on the same screen', () => {
    // The rule this whole course is about, checked where a learner actually
    // reads it. Any mode whose markup carries the word converged has to carry
    // the words conservation gap too, because a converged flag with nothing
    // beside it that could contradict it is the defect being taught.
    const offenders = [];
    PANELS.forEach(([id, Panel, modes]) => {
      modes.forEach((initialMode) => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        if (/converged/i.test(html) && !/conservation gap/i.test(html)) {
          offenders.push(`${id} ${initialMode}`);
        }
      });
    });
    expect(offenders, `these modes show a converged flag with no audit beside it: ${offenders.join(', ')}`)
      .toEqual([]);
  }, 120000);
});
