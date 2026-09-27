// THE STATED CONTROLS AND THE TOUCH-UP VIEWS OF THE EC9 PANELS.
//
// Every required stated input has a visible control that shows what the box
// states (or "not stated") and writes into the box; no control supplies a
// value the box does not show. This suite proves the writers the controls use
// (setStated on list entries, the uplift rewrite, the placeholder carrier
// shares) against the engine, and renders every new or changed view with a
// WHOLE capstone case file pasted into its box (the paste path), requiring the
// view to run its own block and to show its new controls.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fileURLToPath } from 'node:url';
import * as L from './joaLab.js';
import AccountCalculator from './AccountCalculator.jsx';
import RecoveryCalculator from './RecoveryCalculator.jsx';
import AgreementCalculator from './AgreementCalculator.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const TEXT = Object.fromEntries(['idumu', 'okwelle', 'abiama'].map((n) => [n, fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/joa/${n}_case.json`), 'utf8')]));
const render = (Panel, mode, initialText) => renderToStaticMarkup(React.createElement(Panel, { initialMode: mode, initialText }));
const labelled = (html, label) => html.includes(`>${label}</label>`) || html.includes(`>${label}<`);

describe('THE WRITERS BEHIND THE CONTROLS', () => {
  it('setStated reads and writes list entries by number, and removing one splices it out', () => {
    const t = L.pretty(L.STARTS.overhead);
    const a = JSON.parse(L.setStated(t, 'overhead', 'scale.operating.bands.1.pct', 1.5).text);
    expect(a.scale.operating.bands[1].pct).toBe(1.5);
    expect(L.getAt(a, 'scale.operating.bands.1.pct')).toBe(1.5);
    const n = L.STARTS.overhead.scale.operating.bands.length;
    const b = JSON.parse(L.setStated(t, 'overhead', `scale.operating.bands.${n - 1}`, undefined).text);
    expect(b.scale.operating.bands).toHaveLength(n - 1);
    expect(L.setStated(t, 'overhead', 'scale.operating.bands.x', 1).error).toBeTruthy();
    const c = JSON.parse(L.setStated(t, 'overhead', 'scale.operating.bands', [...L.STARTS.overhead.scale.operating.bands, {}]).text);
    expect(L.overheadOf(c).field).toBe(`scale.operating.bands[${n}].upTo`);
  });
  it('a band and an exclusion written into a whole case file land in the overhead block alone', () => {
    const whole = JSON.parse(TEXT.idumu);
    const cat = Object.keys(whole.overhead.scale)[0];
    const w = JSON.parse(L.setStated(TEXT.idumu, 'overhead', `scale.${cat}.bands.0.pct`, 2).text);
    expect(w.overhead.scale[cat].bands[0].pct).toBe(2);
    expect(w.cashCalls).toEqual(whole.cashCalls);
    const noAbove = JSON.parse(L.setStated(TEXT.idumu, 'overhead', `scale.${cat}.abovePct`, undefined).text);
    expect(L.viewOverhead(noAbove).field).toBe(`scale.${cat}.abovePct`);
  });
  it('the uplift rewrite leaves no term of the old type, and the engine then runs', () => {
    const m = L.STARTS.carryMultiple;
    expect(m.uplift.type).toBe('multiple');
    const none = JSON.parse(L.setStated(L.pretty(m), 'carry', 'uplift', L.upliftFor('none', m.uplift)).text);
    expect(none.uplift).toEqual({ type: 'none' });
    expect(L.carryOf(none).error).toBeUndefined();
    expect(L.upliftFor('compound', m.uplift)).toEqual({ type: 'compound' });
    expect(L.carryOf({ ...m, uplift: L.upliftFor('compound', m.uplift) }).field).toBe('uplift.ratePctPerYear');
    expect(L.upliftFor('compound', L.STARTS.carry.uplift)).toEqual(L.STARTS.carry.uplift);
    expect(L.upliftFor('multiple', m.uplift)).toEqual(m.uplift);
    expect(L.upliftFor(undefined, m.uplift)).toBeUndefined();
    const whole = JSON.parse(L.setStated(TEXT.okwelle, 'carry', 'uplift', L.upliftFor('none', JSON.parse(TEXT.okwelle).carry.uplift)).text);
    expect(whole.carry.uplift).toEqual({ type: 'none' });
    expect(L.viewCarry(whole).error).toBeUndefined();
  });
  it('stated carrier shares are the parties no carry names as carried, summing to 100, and the engine runs on them', () => {
    const s = L.STARTS.interests;
    const shares = L.equalCarrierShares(s.parties, s.carries);
    const ids = s.parties.map((p) => p.id).filter((id) => !s.carries.some((c) => c.carried === id));
    expect(Object.keys(shares)).toEqual(ids);
    expect(Math.abs(Object.values(shares).reduce((a, b) => a + b, 0) - 100)).toBeLessThan(1e-9);
    const t = JSON.parse(L.setStated(L.pretty(s), 'interests', 'carries.0.carriers', shares).text);
    expect(L.interestsOf(t).error).toBeUndefined();
    const gone = JSON.parse(L.setStated(L.pretty(s), 'interests', 'carries.0.carriers', undefined).text);
    expect(L.interestsOf(gone).field).toBe('carries[0].carriers');
  });
  it('every new start is a golden input that runs', () => {
    ['ccZeroCall', 'ccZeroCallRefund', 'ccThreshold', 'ccLastUncalled', 'ccYearBoundary'].forEach((k) => expect(L.cashCallsOf(L.STARTS[k]).error, k).toBeUndefined());
    expect(L.pscOf(L.STARTS.pscFariFigure5).error).toBeUndefined();
    expect(L.STARTS.pscFariFigure5).toBe(L.GOLDEN_ARGS['psc-fari-figure-5'].args);
  });
});

describe('THE PASTE PATH THROUGH EVERY NEW OR CHANGED VIEW', () => {
  const VIEWS = [
    [AccountCalculator, 'interests', 'idumu', ['carried, percent of its cost share (stated)', 'carriers (stated)']],
    [AccountCalculator, 'cashCalls', 'idumu', ['Start from', 'Reconciliation lag, months (stated)']],
    [AccountCalculator, 'overhead', 'idumu', ['per cent above the last band (stated)', 'band 1 up to (stated)', 'excluded from the base (optional)']],
    [RecoveryCalculator, 'ledger', 'okwelle', ['Start from']],
    [RecoveryCalculator, 'carry', 'okwelle', ['Uplift (stated)', 'Uplift, percent a year (stated)']],
    [RecoveryCalculator, 'psc', 'okwelle', ['Start from']],
    [RecoveryCalculator, 'backIn', 'okwelle', ['Basis (stated)']],
    [AgreementCalculator, 'backIn', 'okwelle', ['Basis (stated)']],
    [AgreementCalculator, 'carry', 'abiama', ['Uplift (stated)', 'Uplift multiple, percent (stated)']],
    [AgreementCalculator, 'psc', 'abiama', ['Start from']],
  ];
  it('each view runs its block of the whole pasted case file and shows its controls', () => {
    VIEWS.forEach(([Panel, mode, c, labels]) => {
      const html = render(Panel, mode, TEXT[c]);
      expect(html, `${mode} refused the pasted ${c} case`).not.toContain('THE ENGINE REFUSED');
      labels.forEach((l) => expect(html.includes(l), `${mode} shows "${l}"`).toBe(true));
    });
  });
  it('the PSC table prints revenue after royalty, capex and opex', () => {
    const html = render(RecoveryCalculator, 'psc', TEXT.okwelle);
    ['revenue after royalty', 'capex', 'opex'].forEach((h) => expect(html).toContain(`>${h}</th>`));
  });
  it('the back-in view prints the engine\'s not-computed line in both calculators', () => {
    const line = L.backInOf(L.STARTS.backIn).basis.notComputed;
    expect(render(RecoveryCalculator, 'backIn', null)).toContain(line);
    expect(render(AgreementCalculator, 'backIn', null)).toContain(line);
  });
  it('the readings view names the golden case and year of every tile, and shows the tax reading in 2030 and 2031', () => {
    const html = render(AgreementCalculator, 'readings', null);
    ['psc-ekene 2030: tax', 'psc-ekene 2031: tax', 'default-grace-exceeded, cured after', 'default-grace-last-hour, cured after', '(default-ekene-march)', '(psc-wb-bn8-2007)']
      .forEach((l) => expect(html).toContain(l));
  });
  it('NEGATIVE CONTROL: a label no view prints is reported absent', () => {
    expect(labelled(render(AccountCalculator, 'overhead', TEXT.idumu), 'a control nobody wrote')).toBe(false);
  });
});
