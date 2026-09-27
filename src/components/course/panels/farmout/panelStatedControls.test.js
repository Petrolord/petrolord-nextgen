// THE STATED CONTROLS OF THE EC10 PANELS.
//
// Every required stated input has a visible control that shows what the box
// states (or "not stated") and writes into the box; no control supplies a
// value the box does not show. This suite proves the writers the controls use
// (setStated on list entries, the uplift rewrite with the simple type, the cap
// rewrite) against the engine, and renders every view with a WHOLE capstone
// case file pasted into its box (the paste path), requiring the view to run its
// own block and to show its controls.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fileURLToPath } from 'node:url';
import * as L from './farmoutLab.js';
import EarningCalculator from './EarningCalculator.jsx';
import DealCalculator from './DealCalculator.jsx';
import ValuationCalculator from './ValuationCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const TEXT = Object.fromEntries(['ogbaku', 'umunze', 'akpugo'].map((n) => [n, fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/farmout/${n}_case.json`), 'utf8')]));
const render = (Panel, mode, initialText) => renderToStaticMarkup(React.createElement(Panel, { initialMode: mode, initialText }));
const labelled = (html, label) => html.includes(`>${label}</label>`) || html.includes(`>${label}<`);

describe('THE WRITERS BEHIND THE CONTROLS', () => {
  it('setStated reads and writes list entries by number, and removing one splices it out', () => {
    const t = L.pretty(L.STARTS.dteDone);
    const a = JSON.parse(L.setStated(t, 'earning', 'events.1.earnedPct', 10).text);
    expect(a.events[1].earnedPct).toBe(10);
    expect(L.getAt(a, 'events.1.earnedPct')).toBe(10);
    const b = JSON.parse(L.setStated(t, 'earning', 'events.1', undefined).text);
    expect(b.events).toHaveLength(1);
    expect(L.setStated(t, 'earning', 'events.x', 1).error).toBeTruthy();
    const c = JSON.parse(L.setStated(t, 'earning', 'events.0.cap.overrunRule', undefined).text);
    expect(L.earningOf(c).error).toBeUndefined();
  });
  it('the cap rewrite leaves no term of the old type, and a missing term is refused by name', () => {
    const old = L.STARTS.earning.events[0].cap;
    expect(old.on).toBe('gross-cost');
    expect(L.capFor('gross-cost', old)).toEqual(old);
    expect(L.capFor('none', old)).toEqual({ on: 'none' });
    expect(L.capFor('carry-amount', old)).toEqual({ on: 'carry-amount' });
    const t = JSON.parse(L.setStated(L.pretty(L.STARTS.earning), 'earning', 'events.0.cap', L.capFor('carry-amount', old)).text);
    expect(L.earningOf(t).field).toBe('events[0].cap.amount');
    const none = JSON.parse(L.setStated(L.pretty(L.STARTS.earning), 'earning', 'events.0.cap', L.capFor('none', old)).text);
    expect(L.earningOf(none).error).toBeUndefined();
    expect(L.capFor(undefined, old)).toBeUndefined();
  });
  it('the uplift rewrite for a simple uplift keeps its rate and day basis, and the engine runs', () => {
    const s = L.STARTS.devCarrySimple;
    expect(s.uplift.type).toBe('simple');
    const w = JSON.parse(L.setStated(L.pretty(s), 'devCarry', 'uplift', L.upliftFor('simple', s.uplift)).text);
    expect(L.devCarryOf(w).error).toBeUndefined();
    const toSimple = JSON.parse(L.setStated(L.pretty(L.STARTS.devCarry), 'devCarry', 'uplift', L.upliftFor('simple', L.STARTS.devCarry.uplift)).text);
    expect(L.devCarryOf(toSimple).field).toBe('uplift.ratePctPerYear');
    const withRate = JSON.parse(L.setStated(L.pretty(toSimple), 'devCarry', 'uplift.ratePctPerYear', 8).text);
    expect(L.devCarryOf(withRate).field).toBe('uplift.dayBasis');
    const whole = JSON.parse(L.setStated(withRate === null ? '' : L.pretty(withRate), 'devCarry', 'uplift.dayBasis', 'actual/365').text);
    expect(L.devCarryOf(whole).error).toBeUndefined();
  });
});

describe('THE PASTE PATH THROUGH EVERY VIEW', () => {
  const VIEWS = [
    [EarningCalculator, 'earning', 'ogbaku', ['Vesting (stated)', 'Events completed (stated)', 'Cash bonus (stated, 0 for none)', 'event 1: cap (stated)', 'event 1: share the farminee pays, percent (stated)']],
    [DealCalculator, 'earning', 'umunze', ['Start from', 'event 1: cap amount (stated)', 'event 1: the excess over the cap is (stated)', 'event 2: cap amount (stated)']],
    [DealCalculator, 'deal', 'umunze', ['Chance of success, percent (stated)', 'Assignor fees the farmor pays (stated, 0 for none)', 'Cap (stated)']],
    [DealCalculator, 'fee', 'umunze', ['Fee basis (stated)', 'Value of the transaction (stated)', 'Intra group transfer (stated)', 'Consent notified on, YYYY-MM-DD (optional)']],
    [ValuationCalculator, 'information', 'akpugo', ['Side valued (stated)', 'Cost of the information (stated)', 'signal 1: chance given success, percent (stated)']],
    [ValuationCalculator, 'price', 'akpugo', ['Working interest priced, percent (stated)', 'Value basis (stated)']],
    [ValuationCalculator, 'devCarry', 'akpugo', ['Uplift (stated)', 'Uplift, percent a year (stated)', 'Recovered from, percent of the farmor&#x27;s share (stated)']],
    [ValuationCalculator, 'backIn', 'akpugo', ['Back-in party (stated)', 'Basis (stated)', 'Refundable cost kinds (stated)', 'Refund form (stated)']],
  ];
  it('each view runs its block of the whole pasted case file and shows its controls', () => {
    VIEWS.forEach(([Panel, mode, c, labels]) => {
      const html = render(Panel, mode, TEXT[c]);
      expect(html, `${mode} refused the pasted ${c} case`).not.toContain('THE ENGINE REFUSED');
      labels.forEach((l) => expect(labelled(html, l), `${mode} shows "${l}"`).toBe(true));
    });
  });
  it('a simple uplift shows its rate and its day basis control, and the ledger its principal and interest columns', () => {
    const html = render(ValuationCalculator, 'devCarry', L.pretty(L.STARTS.devCarrySimple));
    expect(html).not.toContain('THE ENGINE REFUSED');
    ['Uplift, percent a year (stated)', 'Simple interest day basis (stated)'].forEach((l) => expect(labelled(html, l), l).toBe(true));
    ['opening principal', 'interest paid', 'principal paid'].forEach((h) => expect(html).toContain(`>${h}</th>`));
  });
  it('every view prints the source the engine names', () => {
    [[EarningCalculator, 'earning'], [DealCalculator, 'earning'], [DealCalculator, 'deal'], [DealCalculator, 'fee'],
      ...['information', 'risk', 'price', 'devCarry', 'backIn', 'deal', 'readings'].map((m) => [ValuationCalculator, m])]
      .forEach(([Panel, mode]) => expect(render(Panel, mode, null), `${mode} prints no source`).toContain('Source, as the engine names it'));
  });
  it('the readings view prints each reading from its golden case', () => {
    const html = render(ValuationCalculator, 'readings', null);
    ['(deal-ekene)', 'fee-day-90: days, status', 'fee-day-211: status', '(devcarry-ekene-simple-ot18360)', '(fee-ekene)']
      .forEach((l) => expect(html).toContain(l));
    expect(html).toContain(L.dealOf(L.READING_CASES.timing).basis.timing);
    expect(L.devCarryOf(L.READING_CASES.simple).basis.uplift).toContain('a recovery pays the accrued interest first, then the principal');
    expect(html).toContain('a recovery pays the accrued interest first, then the principal');
  });
  it('NEGATIVE CONTROL: a label no view prints is reported absent', () => {
    expect(labelled(render(EarningCalculator, 'earning', TEXT.ogbaku), 'a control nobody wrote')).toBe(false);
  });
});
