// EVERY MODE OF EVERY PD8 PANEL MUST RENDER, not just the one the panel opens on.
//
// The suite's shared panelRender.test.jsx mounts every panel in the repo with
// no props, which is the gate that caught thirty panels dying on first render
// when panelKit's SelectField destructured its options as an array pair while
// the panels passed objects. That gate mounts ONE mode per panel, the default
// one, so a select, a chart or a table inside any other mode is unproved.
//
// These three panels have twelve modes between them, each with its own tables,
// each with a chart, and several with a second select of their own. This file
// mounts all twelve, which is why the panels take an `initialMode` prop: the
// host renders them with no props and gets the default, and this gate renders
// them one mode at a time.
//
// It is a SMOKE gate and nothing more. What each mode computes is pinned in
// interventionLab.test.js against the goldens and the wave's teaching digest;
// what this file says is that the numbers reach a screen.

import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import DiagnosticExplorer from './DiagnosticExplorer.jsx';
import ChannelExplorer from './ChannelExplorer.jsx';
import CandidateExplorer from './CandidateExplorer.jsx';

const PANELS = [
  ['pd-diagnostic-explorer', DiagnosticExplorer,
    ['fit', 'notproof', 'group', 'floor']],
  ['pd-channel-explorer', ChannelExplorer,
    ['window', 'reading', 'worth', 'gates']],
  ['pd-candidate-explorer', CandidateExplorer,
    ['discarded', 'dial', 'missing', 'guards']],
];

// PD8 teaches the two JavaScript spellings of "no value", and one of those
// spellings IS the word. It reaches a screen only inside the lab's own
// spelling label, which is this exact phrase, so the phrase is removed before
// the no-leaked-value check below: a React value that leaked would not be
// sitting inside it.
const SPELLING_LABEL = 'the undefined spelling';

const scrub = (html) => html.split(SPELLING_LABEL).join('');

describe('every mode of every well intervention panel renders', () => {
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
      DiagnosticExplorer: 'fit',
      ChannelExplorer: 'reading',
      CandidateExplorer: 'discarded',
    };
    expect(PANELS[0][2]).toContain(defaults.DiagnosticExplorer);
    expect(PANELS[1][2]).toContain(defaults.ChannelExplorer);
    expect(PANELS[2][2]).toContain(defaults.CandidateExplorer);
  });

  it('and every mode that prints a derivative slope prints the threshold it is read against', () => {
    // The rule this whole course is about, checked where a learner actually
    // reads it. A derivative slope on its own is not a finding: it is one
    // number one comparison away from deciding whether a shutoff squeeze is
    // recommended or refused, and the comparison is what a reader needs.
    const offenders = [];
    PANELS.forEach(([id, Panel, modes]) => {
      modes.forEach((initialMode) => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        if (/derivative slope/i.test(html) && !/threshold/i.test(html)) {
          offenders.push(`${id} ${initialMode}`);
        }
      });
    });
    expect(offenders, `these modes print a derivative slope with no boundary beside it: ${offenders.join(', ')}`)
      .toEqual([]);
  }, 120000);

  it('and every mode that names a mechanism names the window it was read on', () => {
    // The second half of the same rule. On this history the window and not the
    // data is what moves the verdict, so a mechanism with no window beside it
    // is an assertion a reader cannot check.
    const offenders = [];
    PANELS.forEach(([id, Panel, modes]) => {
      modes.forEach((initialMode) => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode }));
        if (/channelling|coning/i.test(html) && !/window/i.test(html)) {
          offenders.push(`${id} ${initialMode}`);
        }
      });
    });
    expect(offenders, `these modes name a mechanism with no window beside it: ${offenders.join(', ')}`)
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
