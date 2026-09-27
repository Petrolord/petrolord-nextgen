// THE STATED CONTROLS OF THE EC11 PANELS.
//
// Every required stated input has a visible control that shows what the box
// states (or "not stated") and writes into the box; no control supplies a
// value the box does not show. This suite proves the writers the controls use
// (setStated on list entries, the method, distribution, correlation and
// movement rewrites) against the engine, and renders every view with a WHOLE
// capstone case file pasted into its box (the paste path), requiring the view
// to run the block it chose and to show its controls.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fileURLToPath } from 'node:url';
import * as L from './prmsLab.js';
import ClassificationCalculator from './ClassificationCalculator.jsx';
import ReservesCalculator from './ReservesCalculator.jsx';
import AggregationCalculator from './AggregationCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const TEXT = Object.fromEntries(['abagana', 'awkuzu', 'isuofia'].map((n) => [n, fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/prms/${n}_case.json`), 'utf8')]));
const render = (Panel, mode, initialText, initialBlock = null) => renderToStaticMarkup(React.createElement(Panel, { initialMode: mode, initialText, initialBlock }));
const labelled = (html, label) => html.includes(`>${label}</label>`) || html.includes(`>${label}<`);

describe('THE WRITERS BEHIND THE CONTROLS', () => {
  it('setStated reads and writes list entries by number, and removing one splices it out', () => {
    const t = L.pretty(L.STARTS.aggReserves);
    const a = JSON.parse(L.setStated(t, 'aggregate', 'projects.1.distribution.mean', 6.5).text);
    expect(a.projects[1].distribution.mean).toBe(6.5);
    expect(L.getAt(a, 'projects.1.distribution.mean')).toBe(6.5);
    const b = JSON.parse(L.setStated(t, 'aggregate', 'projects.2', undefined).text);
    expect(b.projects).toHaveLength(2);
    expect(L.setStated(t, 'aggregate', 'projects.x', 1).error).toBeTruthy();
  });
  it('the method rewrite leaves no estimate of the old form, and a missing estimate is refused by name', () => {
    const t = L.pretty(L.STARTS.catReservesCumulative);
    const a = L.setStated(t, 'categorize', 'method', 'incremental');
    const b = JSON.parse(L.setStated(a.text, 'categorize', 'estimates', L.estimatesFor('incremental', L.STARTS.catReservesCumulative.estimates)).text);
    expect(b.estimates).toEqual({});
    expect(L.categorizeOf(b).field).toBe('estimates.first');
    const c = JSON.parse(L.setStated(L.pretty(b), 'categorize', 'estimates.first', 1).text);
    expect(L.categorizeOf(c).field).toBe('estimates.second');
  });
  it('the distribution rewrite asks for the new terms, and drops a fit\'s estimates for a stated distribution', () => {
    const t = L.pretty(L.STARTS.aggReserves);
    const toNormal = JSON.parse(L.setStated(L.setStated(t, 'aggregate', 'projects.0.distribution', L.distributionFor('normal', L.STARTS.aggReserves.projects[0].distribution)).text, 'aggregate', 'projects.0.estimates', undefined).text);
    expect(toNormal.projects[0]).toEqual({ id: 'EKN-1', name: 'Ekene Main waterflood (synthetic)', distribution: { type: 'normal' } });
    expect(L.aggregateOf(toNormal).field).toBe('projects[0].distribution.mean');
  });
  it('the movement rewrite keeps the terms of the new type only, and production is refused by category', () => {
    const t = L.pretty(L.STARTS.recEkene);
    const m = L.STARTS.recEkene.movements[1];
    const a = JSON.parse(L.setStated(t, 'reconcile', 'movements.1', L.movementFor('production', m)).text);
    expect(a.movements[1]).toEqual({ type: 'production', note: m.note });
    expect(L.reconcileOf(a).field).toBe('movements[1].quantity');
    const b = JSON.parse(L.setStated(t, 'reconcile', 'movements.1', { ...L.movementFor('production', m), low: 1 }).text);
    expect(L.reconcileOf(b).field).toBe('movements[1].low');
  });
});

describe('THE PASTE PATH THROUGH EVERY VIEW', () => {
  const VIEWS = [
    [ClassificationCalculator, 'classify', 'abagana', 'classify:prospect', ['Block of the case file', 'Discovery (stated)', 'Recovery project (stated)', 'Sub-class (stated)', 'Chance of geologic discovery, percent (stated)', 'Chance of development, percent (stated)']],
    [ClassificationCalculator, 'classify', 'abagana', 'classify:lead', ['Block of the case file', 'Chance of development, percent (stated)']],
    [ClassificationCalculator, 'categorize', 'abagana', 'categorize:reserves', ['Class (stated)', 'Method (stated)', 'Unit (stated)', 'low estimate (stated)', 'best estimate (stated)', 'high estimate (stated)']],
    [ClassificationCalculator, 'categorize', 'abagana', 'categorize:contingent', ['Method (stated)', 'first increment (stated)', 'second increment (stated)', 'third increment (stated)']],
    [ReservesCalculator, 'economicLimit', 'awkuzu', null, ['Effective year (stated)', 'Royalty, percent (stated)', 'Royalty form (stated)', 'Tax rate, percent (stated)', 'Straight-line allowance life, years (stated)', 'Loss carry forward (stated)', 'Working interest, percent (stated)', 'Licence expiry year (stated)', 'Renewal expected (stated)', 'Reporting basis (stated)', 'Discount rate, percent (stated)', 'Mscf per BOE (stated)', 'Abandonment cost (stated, 0 for none)']],
    [AggregationCalculator, 'aggregate', 'isuofia', 'aggregate:reserves', ['Class (stated)', 'Level (stated)', 'Unit (stated)', 'Correlation (stated)', 'Correlation for every pair (stated)', 'Seed (stated)', 'Draws (stated)', 'project 1: distribution (stated)', 'project 1: mean (stated)', 'project 3: min (stated)']],
    [AggregationCalculator, 'aggregate', 'isuofia', 'aggregate:contingent', ['project 1: chance of commerciality, percent (stated)', 'project 1: mode (stated)']],
    [AggregationCalculator, 'reconcile', 'isuofia', null, ['Class (stated)', 'Unit (stated)', 'Period, years (stated)', 'Tolerance (stated)', 'Opening low (stated)', 'Stated closing high (stated)', 'movement 1: type (stated)', 'movement 1: quantity (stated)', 'movement 2: low (stated)']],
  ];
  it('each view runs the block it chose of the whole pasted case file and shows its controls', () => {
    VIEWS.forEach(([Panel, mode, c, block, labels]) => {
      const html = render(Panel, mode, TEXT[c], block);
      expect(html, `${mode} refused the pasted ${c} case`).not.toContain('THE ENGINE REFUSED');
      labels.forEach((l) => expect(labelled(html, l), `${mode} ${block} shows "${l}"`).toBe(true));
    });
  });
  it('every view prints the source the engine names', () => {
    [[ClassificationCalculator, 'classify'], [ClassificationCalculator, 'categorize'], [ReservesCalculator, 'classify'], [ReservesCalculator, 'categorize'],
      [ReservesCalculator, 'economicLimit'], ...['aggregate', 'reconcile', 'readings'].map((m) => [AggregationCalculator, m])]
      .forEach(([Panel, mode]) => expect(render(Panel, mode, null), `${mode} prints no source`).toContain('Source, as the engine names it'));
  });
  it('the two-rules view starts on the profile the engine refuses, and prints the refusal in the engine\'s words', () => {
    const html = render(AggregationCalculator, 'economicLimit', null);
    expect(html).toContain('THE ENGINE REFUSED');
    expect(html).toContain(L.economicLimitOf(L.STARTS.econLimitsDisagree).error.replace(/"/g, '&quot;'));
  });
  it('the readings view prints each reading from its case, in the engine\'s words', () => {
    const html = render(AggregationCalculator, 'readings', null);
    ['(class-time-frame-5-met)', '(econ-exactly-zero-not-economic)', '(rec-difference-exactly-tolerance)'].forEach((l) => expect(html).toContain(l));
    expect(html).toContain(L.economicLimitOf(L.READING_CASES.economicLimit).basis.economicLimit);
    expect(html).toContain(L.aggregateOf(L.READING_CASES.monteCarlo).basis.labels);
  });
  it('a Monte Carlo figure is always printed with its seed and its draws, and said never to be graded', () => {
    const html = render(AggregationCalculator, 'aggregate', null);
    const r = L.aggregateOf(L.STARTS.aggReserves);
    expect(html).toContain(`a seeded Monte Carlo estimate on seed ${r.seed} and ${r.iterations} draws; it is not graded`);
  });
  it('NEGATIVE CONTROL: a label no view prints is reported absent', () => {
    expect(labelled(render(ClassificationCalculator, 'classify', TEXT.abagana), 'a control nobody wrote')).toBe(false);
  });
});
