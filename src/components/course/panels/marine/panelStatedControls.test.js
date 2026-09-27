// THE STATED CONTROLS OF THE SC4 PANELS.
//
// Every required stated input has a visible control that shows what the box
// states (or "not stated") and writes into the box; no control supplies a
// value the box does not show. This suite proves the writers the controls use
// (setStated on list entries, the route and factor rewrites) against the
// engine, and renders every view with a WHOLE capstone case file pasted into
// its box (the paste path), requiring the view to run the block it chose and
// to show a control for every required input the block carries.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fileURLToPath } from 'node:url';
import * as L from './marineLab.js';
import VoyageCalculator from './VoyageCalculator.jsx';
import DeckCalculator from './DeckCalculator.jsx';
import BaseCalculator from './BaseCalculator.jsx';
import VariabilityCalculator from './VariabilityCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const TEXT = Object.fromEntries(['nkerefi', 'akokwa', 'mgbidi'].map((n) => [n, fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/marine/${n}_case.json`), 'utf8')]));
const CASE = Object.fromEntries(Object.entries(TEXT).map(([k, t]) => [k, JSON.parse(t)]));
const render = (Panel, mode, initialText, initialBlock = null) => renderToStaticMarkup(React.createElement(Panel, { initialMode: mode, initialText, initialBlock }));
const labelled = (html, label) => html.includes(`>${label}</label>`) || html.includes(`>${label}<`);

// The labels every voyage, fleet and variability block must show, derived from the block itself.
const voyageLabels = (b, load) => {
  const out = ['Speed, knots (stated)', 'Deck area, m2 (stated)', 'Usable deck fraction (stated)', 'Deck load, t (stated)', 'Cargo deadweight, t (stated)',
    'Fuel sailing, t an hour (stated)', 'Fuel in port, t an hour (stated)', 'Fuel at the field, t an hour (stated)', 'Route (stated)', 'Port hours a voyage (stated)',
    'Weather applies to (stated)', 'Fuel price a tonne (stated)'];
  b.products.forEach((p) => out.push(`Tank ${p.id}, m3 (stated, 0 for none)`, `product ${p.id}: kind (stated)`, `product ${p.id}: density, t a m3 (stated)`));
  if (b.route.mode === 'milk-run') {
    out.push('Stops in the order sailed (stated)');
    b.route.legsNm.forEach((_, k) => out.push(`leg ${k + 1}, NM (stated)`));
  }
  b.installations.forEach((x) => {
    const who = `installation ${x.id}`;
    out.push(`${who}: field hours (stated)`, `${who}: ${load === 'cargo' ? 'deck cargo' : 'deck demand'}, m2 (stated)`, `${who}: ${load === 'cargo' ? 'deck cargo' : 'deck demand'}, t (stated)`);
    if (b.route.mode === 'dedicated') out.push(`${who}: distance from the base, NM (stated)`);
    if (load === 'demand') out.push(`${who}: minimum visits (stated)`);
    b.products.forEach((p) => out.push(`${who}: ${p.id}, m3 (stated; not stated carries none)`));
  });
  return out;
};
const FLEET = ['Period, days (stated)', 'Days a vessel is available (stated)', 'Voyage rounding (stated)', 'Vessel rounding (stated)'];

describe('THE WRITERS BEHIND THE CONTROLS', () => {
  it('setStated reads and writes list entries by number, and removing one splices it out', () => {
    const t = L.pretty(L.STARTS.voyEkenePsv);
    const a = JSON.parse(L.setStated(t, 'voyagePlan', 'route.legsNm.1', 9.5).text);
    expect(a.route.legsNm[1]).toBe(9.5);
    expect(L.getAt(a, 'route.legsNm.1')).toBe(9.5);
    const b = JSON.parse(L.setStated(t, 'voyagePlan', 'route.legsNm.4', undefined).text);
    expect(b.route.legsNm).toHaveLength(4);
    expect(L.voyagePlanOf(b).field).toBe('route.legsNm');
    expect(L.setStated(t, 'voyagePlan', 'route.legsNm.x', 1).error).toBeTruthy();
  });
  it('clearing a tank, a burn or a rounding rule makes the engine refuse it by name', () => {
    const t = L.pretty(L.STARTS.fleetEkenePsv);
    expect(L.fleetSizeOf(JSON.parse(L.setStated(t, 'fleetSize', 'vessel.tanks.mud', undefined).text)).field).toBe('vessel.tanks.mud');
    expect(L.fleetSizeOf(JSON.parse(L.setStated(t, 'fleetSize', 'vessel.fuelTPerHour.port', undefined).text)).field).toBe('vessel.fuelTPerHour.port');
    expect(L.fleetSizeOf(JSON.parse(L.setStated(t, 'fleetSize', 'voyageRounding', undefined).text)).field).toBe('voyageRounding');
    expect(L.fleetSizeOf(JSON.parse(L.setStated(t, 'fleetSize', 'installations.2.minVisits', undefined).text)).field).toBe('installations[2].minVisits');
  });
  it('the weather activities are written as a list, and a list the engine does not know is refused', () => {
    const t = L.pretty(L.STARTS.voyEkenePsv);
    const a = JSON.parse(L.setStated(t, 'voyagePlan', 'weather.appliesTo', ['sailing', 'port', 'field']).text);
    expect(L.voyagePlanOf(a).voyages[0].hours.port).toBe(L.voyagePlanOf(L.STARTS.voyWeatherAll).voyages[0].hours.port);
    const b = JSON.parse(L.setStated(t, 'voyagePlan', 'weather.appliesTo', undefined).text);
    expect(L.voyagePlanOf(b).field).toBe('weather.appliesTo');
  });
  it('a factor rewritten to a triangular asks for its terms, and the engine refuses the empty form by name', () => {
    const t = L.pretty(L.STARTS.varFixed);
    const a = JSON.parse(L.setStated(t, 'fleetVariability', 'demandFactor', L.factorFor('triangular', L.STARTS.varFixed.demandFactor)).text);
    expect(a.demandFactor).toEqual({});
    expect(L.fleetVariabilityOf(a).field).toBe('demandFactor');
  });
});

describe('THE PASTE PATH THROUGH EVERY VIEW', () => {
  const VIEWS = [
    [VoyageCalculator, 'voyagePlan', 'nkerefi', 'voyagePlan:milk-run', ['Block of the case file', ...voyageLabels(CASE.nkerefi['voyagePlan:milk-run'], 'cargo'), 'Weather factor (stated)']],
    [VoyageCalculator, 'voyagePlan', 'nkerefi', 'voyagePlan:dedicated', ['Block of the case file', ...voyageLabels(CASE.nkerefi['voyagePlan:dedicated'], 'cargo')]],
    [VoyageCalculator, 'fleetSize', 'akokwa', null, [...FLEET, ...voyageLabels(CASE.akokwa.fleetSize, 'demand'), 'Weather factor (stated)']],
    [DeckCalculator, 'deckPlan', 'akokwa', null, ['Deck area, m2 (stated)', 'Usable deck fraction (stated)', 'Deck load, t (stated)', 'Voyages (stated)', 'Packing rule (stated)',
      ...CASE.akokwa.deckPlan.items.flatMap((x) => ['length, m', 'width, m', 'weight, t', 'quantity'].map((w) => `item ${x.id}: ${w} (stated)`))]],
    [BaseCalculator, 'shoreBase', 'mgbidi', 'shoreBase:mmc', ['Block of the case file', 'Berths (stated)', 'Arrivals a day (stated)', 'Working hours a day (stated)', 'Fixed hours a call (stated)',
      'Crane lifts a call (stated)', 'Lifts an hour (stated)', 'Bulk a call, m3 (stated)', 'Bulk pumped an hour, m3 (stated)', 'Lifts and bulk at the same time (stated)',
      'Queue model (stated)', 'Target mean wait, hours (optional)']],
    [BaseCalculator, 'shoreBase', 'mgbidi', 'shoreBase:mdc', ['Queue model (stated)']],
    [VariabilityCalculator, 'fleetVariability', 'mgbidi', null, ['Weather factor: form (stated)', 'Weather factor: min (stated)', 'Weather factor: mode (stated)', 'Weather factor: max (stated)',
      'Demand factor: form (stated)', 'Demand factor: min (stated)', 'Planned vessels (stated)', 'Draws (stated)', 'Seed (stated)', ...FLEET,
      ...voyageLabels(CASE.mgbidi.fleetVariability, 'demand')]],
  ];
  it('each view runs the block it chose of the whole pasted case file and shows a control for every input the block carries', () => {
    let n = 0;
    VIEWS.forEach(([Panel, mode, c, block, labels]) => {
      const html = render(Panel, mode, TEXT[c], block);
      expect(html, `${mode} refused the pasted ${c} case`).not.toContain('THE ENGINE REFUSED');
      labels.forEach((l) => { expect(labelled(html, l), `${mode} ${block} shows "${l}"`).toBe(true); n += 1; });
    });
    expect(n).toBeGreaterThan(150);
    console.log(`[marine controls] ${n} labelled controls found over ${VIEWS.length} views with the whole case file pasted`);
  });
  it('every view prints the source the engine names, and starts on a case it accepts unless the start is refused by design', () => {
    [[VoyageCalculator, 'voyagePlan'], [VoyageCalculator, 'fleetSize'], [DeckCalculator, 'deckPlan'], [BaseCalculator, 'shoreBase'], [VariabilityCalculator, 'fleetVariability']]
      .forEach(([Panel, mode]) => {
        const html = render(Panel, mode, null);
        expect(html, `${mode} prints no source`).toContain('Source, as the engine names it');
        expect(html, `${mode} refused its own start`).not.toContain('THE ENGINE REFUSED');
      });
  });
  it('a Monte Carlo figure is always printed with its seed and its draws, and said not to be graded', () => {
    const html = render(VariabilityCalculator, 'fleetVariability', null);
    const a = L.STARTS.varEkenePsv;
    expect(html).toContain(`a seeded Monte Carlo estimate on seed ${a.seed} and ${a.iterations} draws; it is not graded`);
  });
  it('the shore base prints the same call at more berths, labelled a stated probe', () => {
    const html = render(BaseCalculator, 'shoreBase', null);
    expect(html).toContain('berths (stated probe: the same call at more berths)');
  });
  it('NEGATIVE CONTROL: a label no view prints is reported absent', () => {
    expect(labelled(render(DeckCalculator, 'deckPlan', TEXT.akokwa), 'a control nobody wrote')).toBe(false);
  });
});
