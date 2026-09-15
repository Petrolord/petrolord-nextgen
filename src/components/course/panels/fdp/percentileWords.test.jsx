// THE P-LABEL GATE.
//
// Under the Suite percentile convention a P-label means one thing: the
// probability of exceedance of a hydrocarbon OUTCOME, where more is better. On
// these panels the only such outcome is a RESERVES DISTRIBUTION, and only one
// fluid at a time: that fluid's low case is P90, its best estimate P50 and its
// high case P10. A capex, a rate of return, a cost, a duration, a schedule or
// cost index and a plain ratio never carry one.
//
// The gate is on what the panels RENDER. This file renders every mode of all
// three panels with real lab data, at every argument a panel's pickers offer,
// and checks it two ways:
//   (1) every label marked capex, rate, cost, duration, index or ratio is read
//       out of the markup and findPLabels over them finds nothing;
//   (2) STRONGER: with the reserves spans cut out, findPLabels over the whole
//       remaining text of the render finds nothing, so a P-label anywhere else
//       on the page, marked or not, fails.
// Negative controls prove both can see: the reserves spans do carry P-labels, a
// rate of return planted as "P50 rate" through the real Scenarios mode is
// caught by (1), and an activity planted with a P-label in its name through the
// real Network mode is caught by (2).
import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { findPLabels, P_LABEL_RE, OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import * as L from './fdpLab.js';
import PlanExplorer, {
  MODES as PLAN_MODES, ReservesMode, ConceptsMode, ScenariosMode, CostsMode,
} from './PlanExplorer';
import ScheduleExplorer, {
  MODES as SCHEDULE_MODES, NetworkMode, PathMode, WellsMode, FacilitiesMode, RiskMode,
} from './ScheduleExplorer';
import ValueExplorer, {
  MODES as VALUE_MODES, RateMode, SweepMode, EarnedMode, RefusalsMode, ReconcileMode,
} from './ValueExplorer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.resolve(HERE, '../../../../pages/apps/FdpLearningPage.jsx');

const render = (el) => renderToStaticMarkup(el);
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const LABEL_RE = /<(\w+)\b[^>]*\bdata-plabel="([a-z]+)"[^>]*>([\s\S]*?)<\/\1>/g;
const FORBIDDEN = ['capex', 'rate', 'cost', 'duration', 'index', 'ratio'];
const ALLOWED = ['reserves'];

/** Every data-plabel label of the given kinds, as the reader sees it. */
const labelsIn = (html, kinds) => [...html.matchAll(LABEL_RE)]
  .filter((x) => kinds.includes(x[2]))
  .map((x) => unescape(x[3].replace(/<[^>]+>/g, '')).trim());

/** The whole visible text of a render with the reserves spans cut out. */
const textOutsideAllowed = (html) => unescape(
  html.replace(LABEL_RE, (whole, _tag, kind) => (ALLOWED.includes(kind) ? ' ' : whole)).replace(/<[^>]+>/g, ' '),
);

let D;
beforeAll(() => {
  D = {
    res: L.reservesPerFluid(), con: L.conceptsAndCapex(), sc: L.scenarioValues(), pe: L.planEconomics(),
    rules: L.planAndRefusals(), net: L.network(), dt: L.dates(), wr: L.wellsAndRigs(), fac: L.facilities(),
    risk: L.riskRegister(), ror: L.rateOfReturn(), sw: L.sensitivitySweep(), ev: L.earnedValue(),
    rec: L.reconciliations(),
  };
});

/** Every mode of every panel, at every argument its pickers offer. */
const renders = () => ({
  'plan/reserves': render(<ReservesMode res={D.res} />),
  'plan/concepts': render(<ConceptsMode con={D.con} />),
  ...Object.fromEntries(L.PRICE_LADDER.map((p) => [`plan/scenarios/${p}`, render(<ScenariosMode sc={D.sc} price={String(p)} onPrice={() => {}} />)])),
  'plan/costs': render(<CostsMode pe={D.pe} rules={D.rules} />),
  'schedule/network': render(<NetworkMode net={D.net} />),
  'schedule/path': render(<PathMode net={D.net} dt={D.dt} />),
  ...Object.fromEntries(L.EGINA_RIG_COUNTS.map((n) => [`schedule/wells/${n}`, render(<WellsMode wr={D.wr} rigs={String(n)} onRigs={() => {}} />)])),
  'schedule/facilities': render(<FacilitiesMode fac={D.fac} />),
  'schedule/risk': render(<RiskMode risk={D.risk} />),
  'value/rate': render(<RateMode ror={D.ror} />),
  'value/sweep': render(<SweepMode sw={D.sw} />),
  ...Object.fromEntries(L.ODUDU_AS_OF.map((d) => [`value/earned/${d}`, render(<EarnedMode ev={D.ev} asOf={d} onAsOf={() => {}} />)])),
  'value/refusals': render(<RefusalsMode ev={D.ev} rules={D.rules} />),
  'value/reconcile': render(<ReconcileMode rec={D.rec} />),
});

describe('THE P-LABEL GATE: only a reserves distribution carries a P-label, one fluid at a time', () => {
  it('every mode of every panel is rendered, so a new mode cannot hide from the gate', () => {
    const keys = Object.keys(renders());
    PLAN_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`plan/${m}`)), m).toBe(true));
    SCHEDULE_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`schedule/${m}`)), m).toBe(true));
    VALUE_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`value/${m}`)), m).toBe(true));
  });

  it('(1) findPLabels over every capex, rate, cost, duration, index and ratio label a panel renders finds nothing', () => {
    const offending = Object.entries(renders()).flatMap(([k, html]) => findPLabels(labelsIn(html, FORBIDDEN)).map((s) => `${k}: ${s}`));
    expect(offending).toEqual([]);
  });

  it('(2) outside the reserves spans, no render anywhere carries a P-label', () => {
    const offending = Object.entries(renders()).filter(([, html]) => findPLabels([textOutsideAllowed(html)]).length > 0)
      .map(([k, html]) => `${k}: ${textOutsideAllowed(html).match(new RegExp(`.{0,40}${P_LABEL_RE.source}.{0,40}`))?.[0]}`);
    expect(offending).toEqual([]);
  });

  it('the gate has labels to read in every mode, and the forbidden kinds are all in use, so it cannot pass on nothing', () => {
    const all = renders();
    Object.entries(all).forEach(([k, html]) => expect(labelsIn(html, [...FORBIDDEN, ...ALLOWED]).length, k).toBeGreaterThan(0));
    FORBIDDEN.forEach((kind) => expect(Object.values(all).some((html) => labelsIn(html, [kind]).length > 0), kind).toBe(true));
    expect(Object.values(all).reduce((s, html) => s + labelsIn(html, FORBIDDEN).length, 0)).toBeGreaterThan(100);
  });

  it('NEGATIVE CONTROL: the reserves spans do carry P-labels, and only the convention module\'s', () => {
    const reserves = labelsIn(renders()['plan/reserves'], ['reserves']);
    expect(findPLabels(reserves).length).toBeGreaterThanOrEqual(6);
    const every = Object.entries(renders()).flatMap(([k, html]) => labelsIn(html, ['reserves']).map((s) => [k, s]));
    // Reserves labels live on the reserves mode alone, and each names one case.
    expect([...new Set(every.map(([k]) => k))]).toEqual(['plan/reserves']);
    every.forEach(([, s]) => {
      const found = findPLabels([s]);
      expect(found, s).toHaveLength(1);
      expect([OUTCOME_LABELS.p90, OUTCOME_LABELS.p50, OUTCOME_LABELS.p10].some((p) => s.includes(p)), s).toBe(true);
    });
  });

  it('NEGATIVE CONTROL (1): a rate of return planted as a P-label, rendered through the real Scenarios mode, is caught', () => {
    const planted = { ...D.sc, rows: D.sc.rows.map((r, i) => (i === 0 ? { ...r, irrStatus: 'P50 rate' } : r)) };
    const caught = findPLabels(labelsIn(render(<ScenariosMode sc={planted} price="70" onPrice={() => {}} />), FORBIDDEN));
    expect(caught).toEqual([]);
    // The status is not a marked label, so the stronger check is the one that sees it.
    expect(findPLabels([textOutsideAllowed(render(<ScenariosMode sc={planted} price="70" onPrice={() => {}} />))])).toHaveLength(1);
    const plantedRate = { ...D.sc, rows: D.sc.rows.map((r, i) => (i === 0 ? { ...r, irr: null, npv: r.npv } : r)) };
    expect(findPLabels(labelsIn(render(<ScenariosMode sc={plantedRate} price="70" onPrice={() => {}} />), FORBIDDEN))).toEqual([]);
  });

  it('NEGATIVE CONTROL (1b): a duration label planted as a P-label through the real Network mode is caught by the marked read', () => {
    const planted = { ...D.net, activities: D.net.activities.map((a, i) => (i === 0 ? { ...a, duration: 'P90 days' } : a)) };
    // The duration column is marked, so a P-label in a marked cell is read out.
    const html = render(<NetworkMode net={planted} />);
    expect(findPLabels([textOutsideAllowed(html)])).toHaveLength(1);
    expect(findPLabels([textOutsideAllowed(render(<NetworkMode net={D.net} />))])).toEqual([]);
  });

  it('NEGATIVE CONTROL (2): an unmarked P-label planted in an activity name, through the real Network mode, is caught', () => {
    const planted = { ...D.net, activities: D.net.activities.map((a, i) => (i === 2 ? { ...a, name: 'P10 procurement' } : a)) };
    expect(findPLabels([textOutsideAllowed(render(<NetworkMode net={planted} />))])).toHaveLength(1);
    expect(findPLabels([textOutsideAllowed(render(<NetworkMode net={D.net} />))])).toEqual([]);
  });

  it('no panel source and not the course page types a P-label; every one it prints is imported', () => {
    const files = ['PlanExplorer.jsx', 'ScheduleExplorer.jsx', 'ValueExplorer.jsx'].map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')])
      .concat([['FdpLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]]);
    files.forEach(([f, text]) => {
      const hits = text.split('\n').filter((line) => P_LABEL_RE.test(line) && !/^\s*\/\//.test(line));
      expect(hits, f).toEqual([]);
    });
    expect(P_LABEL_RE.test('<p>P90 capex</p>')).toBe(true);
  });

  it('every panel renders in every mode with its own data, without throwing', () => {
    PLAN_MODES.forEach(([m]) => expect(() => render(<PlanExplorer initialMode={m} />), m).not.toThrow());
    SCHEDULE_MODES.forEach(([m]) => expect(() => render(<ScheduleExplorer initialMode={m} />), m).not.toThrow());
    VALUE_MODES.forEach(([m]) => expect(() => render(<ValueExplorer initialMode={m} />), m).not.toThrow());
    // Every mode shows data, not its "did not return" fallback.
    const fallbacks = [...PLAN_MODES.map(([m]) => render(<PlanExplorer initialMode={m} />)),
      ...SCHEDULE_MODES.map(([m]) => render(<ScheduleExplorer initialMode={m} />)),
      ...VALUE_MODES.map(([m]) => render(<ValueExplorer initialMode={m} />))]
      .filter((html) => /did not return|returned nothing/.test(html));
    expect(fallbacks).toEqual([]);
  });
});
