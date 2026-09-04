// EVERY MODE OF EVERY PD9 PANEL MUST RENDER, not just the one the panel opens on.
//
// The suite's shared panelRender.test.jsx mounts every panel in the repo with
// no props, which is the gate that caught thirty panels dying on first render
// when panelKit's SelectField destructured its options as an array pair while
// the panels passed objects. That gate mounts ONE mode per panel, the default
// one, so a select, a chart or a table inside any other mode is unproved.
//
// These three panels have twelve modes between them, each with its own tables,
// each with a chart, and two with a second select of their own. This file
// mounts all twelve, which is why the panels take an `initialMode` prop: the
// host renders them with no props and gets the default, and this gate renders
// them one mode at a time.
//
// It is a SMOKE gate and nothing more. What each mode computes is pinned in
// surveillanceLab.test.js against the goldens and the wave's teaching digest;
// what this file says is that the numbers reach a screen.

import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import LedgerExplorer from './LedgerExplorer.jsx';
import ExceptionExplorer from './ExceptionExplorer.jsx';
import ReadingExplorer from './ReadingExplorer.jsx';

const PANELS = [
  ['pd-ledger-explorer', LedgerExplorer,
    ['ledger', 'ratios', 'field', 'kpis']],
  ['pd-exception-explorer', ExceptionExplorer,
    ['windows', 'exceptions', 'tests', 'allocation']],
  ['pd-reading-explorer', ReadingExplorer,
    ['seam', 'decline', 'guards', 'lift']],
];

// PD9 teaches that a missing value has four spellings and four meanings across
// the four modules, and one of those spellings IS the word. It reaches a screen
// only inside the lab's own spelling label, which is this exact phrase, so the
// phrase is removed before the no-leaked-value check below: a React value that
// leaked would not be sitting inside it.
const SPELLING_LABEL = 'the undefined spelling';

const scrub = (html) => html.split(SPELLING_LABEL).join('');

describe('every mode of every production surveillance panel renders', () => {
  it('there are three panels and twelve modes to check', () => {
    expect(PANELS).toHaveLength(3);
    expect(PANELS.flatMap(([, , modes]) => modes)).toHaveLength(12);
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
        expect(html).not.toMatch(/NaN/);
        expect(scrub(html)).not.toMatch(/undefined/);
        expect(html).not.toMatch(/\[object Object\]/);
      }, 60000);
    });
  });

  it('and every panel opens on a mode that is in its own list', () => {
    // The default in the signature and the list this file walks are two
    // separate statements of the same fact, and they have to agree or a mode
    // is being mounted that the host never shows.
    const defaults = {
      LedgerExplorer: 'ledger',
      ExceptionExplorer: 'exceptions',
      ReadingExplorer: 'seam',
    };
    expect(PANELS[0][2]).toContain(defaults.LedgerExplorer);
    expect(PANELS[1][2]).toContain(defaults.ExceptionExplorer);
    expect(PANELS[2][2]).toContain(defaults.ReadingExplorer);
  });

  it('and every mode that prints a calendar volume prints the producing-day rate beside it', () => {
    // The rule this whole course is about, checked where a learner actually
    // reads it. The exception engine reads the CALENDAR volume and never the
    // producing-day rate, so a calendar column on its own is one comparison
    // away from reporting a well as a rate problem when its performance never
    // moved, and the second column is what a reader needs.
    const offenders = [];
    PANELS.forEach(([id, Panel, modes]) => {
      modes.forEach((initialMode) => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        if (/calendar volume|CALENDAR volume/i.test(html) && !/producing-day/i.test(html)) {
          offenders.push(`${id} ${initialMode}`);
        }
      });
    });
    expect(offenders, `these modes print a calendar volume with no producing-day rate beside it: ${offenders.join(', ')}`)
      .toEqual([]);
  }, 120000);

  it('and every mode that prints a severity prints the setting it was measured against', () => {
    // The second half of the same rule. A severity is not a measurement: it is
    // the name of a threshold crossing, and the threshold is a number a caller
    // chose, so a severity with no setting beside it is an assertion a reader
    // cannot check.
    const offenders = [];
    PANELS.forEach(([id, Panel, modes]) => {
      modes.forEach((initialMode) => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        if (/severity/i.test(html) && !/threshold|trigger|setting/i.test(html)) {
          offenders.push(`${id} ${initialMode}`);
        }
      });
    });
    expect(offenders, `these modes print a severity with no setting beside it: ${offenders.join(', ')}`)
      .toEqual([]);
  }, 120000);

  it('and every mode that prints a ratio reading says which of the two readings it is', () => {
    // The Expert seam, checked on the rendered markup. The two functions form
    // the same two ratios two different ways, so a watercut or a gas-oil ratio
    // with no reading named beside it is exactly the object this course exists
    // to distrust.
    const offenders = [];
    PANELS.forEach(([id, Panel, modes]) => {
      modes.forEach((initialMode) => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        if (/mean of daily ratios|MEAN OF THE DAILY RATIOS/i.test(html)
          && !/volumetric/i.test(html)) {
          offenders.push(`${id} ${initialMode}`);
        }
      });
    });
    expect(offenders, `these modes name one reading without the other: ${offenders.join(', ')}`)
      .toEqual([]);
  }, 120000);

  it('and no mode anywhere uses an em dash or an en dash', () => {
    // Owner rule, checked on the rendered markup rather than on the source, so
    // a dash arriving from an engine string is caught too.
    const offenders = [];
    PANELS.forEach(([id, Panel, modes]) => {
      modes.forEach((initialMode) => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        if (/—|–/.test(html)) offenders.push(`${id} ${initialMode}`);
      });
    });
    expect(offenders, `these modes render a long dash: ${offenders.join(', ')}`).toEqual([]);
  }, 120000);
});
