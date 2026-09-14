// THE P-LABEL GATE.
//
// Under the Suite percentile convention a P-label means one thing: the
// exceedance case of an OUTCOME where more is better. On these panels the only
// such outcome is a portfolio NPV. So the only P-labels any EC5 panel may
// render are the low case (P90) and high case (P10) of a simulated portfolio
// NPV (data-plabel="outcome") and the NPV percentiles a project was entered
// with (data-plabel="npvinput"). A capex, a budget, a forecast, a cost and a
// probability never carry one.
//
// The gate is on what the panels RENDER. This file renders every mode of all
// three panels with real lab data, at every argument a panel's pickers offer,
// and checks it two ways:
//   (1) every label marked capex, budget, forecast, cost or probability is read
//       out of the markup and findPLabels over them finds nothing;
//   (2) STRONGER: with the outcome and npvinput spans cut out, findPLabels over
//       the whole remaining text of the render finds nothing, so a P-label
//       anywhere else on the page, marked or not, fails.
// Negative controls prove both can see: the allowed spans do carry P-labels, a
// forecast rule planted as "P50 forecast" through the real Forecast mode is
// caught by (1), and a project planted with a P-label in its name through the
// real Inventory mode is caught by (2).
import './utcTimezone.js';
import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { findPLabels, P_LABEL_RE, OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import * as L from './portfolioLab.js';
import CapitalExplorer, {
  MODES as CAPITAL_MODES, InventoryMode, BudgetMode, FrontierMode, GridMode,
} from './CapitalExplorer';
import CostExplorer, {
  MODES as COST_MODES, LinesMode, ForecastMode, EarnedMode, AsOfMode, SCurveMode,
} from './CostExplorer';
import GovernanceExplorer, {
  MODES as GOVERNANCE_MODES, SimulationMode, CorrelationMode, SharesMode, RefusalsMode, DistrustMode,
} from './GovernanceExplorer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.resolve(HERE, '../../../../pages/apps/PortfolioLearningPage.jsx');

const render = (el) => renderToStaticMarkup(el);
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const LABEL_RE = /<(\w+)\b[^>]*\bdata-plabel="([a-z]+)"[^>]*>([\s\S]*?)<\/\1>/g;
const FORBIDDEN = ['capex', 'budget', 'forecast', 'cost', 'probability'];
const ALLOWED = ['outcome', 'npvinput'];

/** Every data-plabel label of the given kinds, as the reader sees it. */
const labelsIn = (html, kinds) => [...html.matchAll(LABEL_RE)]
  .filter((x) => kinds.includes(x[2]))
  .map((x) => unescape(x[3].replace(/<[^>]+>/g, '')).trim());

/** The whole visible text of a render with the allowed P-label spans cut out. */
const textOutsideAllowed = (html) => unescape(
  html.replace(LABEL_RE, (whole, _tag, kind) => (ALLOWED.includes(kind) ? ' ' : whole)).replace(/<[^>]+>/g, ' '),
);

let D;
beforeAll(() => {
  D = {
    rules: L.engineRules(), inv: L.okonoInventory(), b: L.okonoBudgets(), fr: L.okonoFrontiers(), grid: L.gridCases(),
    lines: L.ofonLines(), fc: L.forecastRule(), ev: L.earnedValue(), table: L.asOfTable(), sc: L.sCurve(),
    rm: L.riskMethods(), c: L.correlation(), s: L.partnerShares(), rf: L.refusalsAndFlags(), d: L.distrust(),
  };
});

/** Every mode of every panel, at every argument its pickers offer. */
const renders = () => ({
  'capital/inventory': render(<InventoryMode inv={D.inv} rules={D.rules} />),
  ...Object.fromEntries(L.OKONO_LIMITS.map((lim) => [`capital/budget/${lim}`, render(<BudgetMode b={D.b} limit={lim} onLimit={() => {}} />)])),
  ...Object.fromEntries(L.FRONTIER_LIMITS.map((lim) => [`capital/frontier/${lim}`, render(<FrontierMode fr={D.fr} limit={lim} onLimit={() => {}} />)])),
  ...Object.fromEntries(L.GRID_CASE_IDS.map((id) => [`capital/grid/${id}`, render(<GridMode grid={D.grid} caseId={id} onCase={() => {}} />)])),
  'cost/lines': render(<LinesMode lines={D.lines} />),
  'cost/forecast': render(<ForecastMode fr={D.fc} />),
  'cost/earned': render(<EarnedMode ev={D.ev} />),
  ...Object.fromEntries(L.OFON_AS_OF.map((d) => [`cost/asof/${d}`, render(<AsOfMode table={D.table} asOf={d} onAsOf={() => {}} />)])),
  'cost/scurve': render(<SCurveMode sc={D.sc} />),
  'governance/simulation': render(<SimulationMode rm={D.rm} />),
  ...Object.fromEntries(L.RHO_SWEEP.map((rho) => [`governance/correlation/${rho}`, render(<CorrelationMode c={D.c} rho={rho} onRho={() => {}} />)])),
  'governance/shares': render(<SharesMode s={D.s} />),
  'governance/refusals': render(<RefusalsMode rf={D.rf} />),
  'governance/distrust': render(<DistrustMode d={D.d} />),
});

describe('THE P-LABEL GATE: only a portfolio NPV outcome or an entered NPV percentile carries a P-label', () => {
  it('every mode of every panel is rendered, so a new mode cannot hide from the gate', () => {
    const keys = Object.keys(renders());
    CAPITAL_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`capital/${m}`)), m).toBe(true));
    COST_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`cost/${m}`)), m).toBe(true));
    GOVERNANCE_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`governance/${m}`)), m).toBe(true));
  });

  it('(1) findPLabels over every capex, budget, forecast, cost and probability label a panel renders finds nothing', () => {
    const offending = Object.entries(renders()).flatMap(([k, html]) => findPLabels(labelsIn(html, FORBIDDEN)).map((s) => `${k}: ${s}`));
    expect(offending).toEqual([]);
  });

  it('(2) outside the allowed spans, no render anywhere carries a P-label', () => {
    const offending = Object.entries(renders()).filter(([, html]) => findPLabels([textOutsideAllowed(html)]).length > 0)
      .map(([k, html]) => `${k}: ${textOutsideAllowed(html).match(new RegExp(`.{0,40}${P_LABEL_RE.source}.{0,40}`))?.[0]}`);
    expect(offending).toEqual([]);
  });

  it('the gate has labels to read in every mode, and the forbidden kinds are all in use, so it cannot pass on nothing', () => {
    const all = renders();
    Object.entries(all).forEach(([k, html]) => expect(labelsIn(html, [...FORBIDDEN, ...ALLOWED]).length, k).toBeGreaterThan(0));
    FORBIDDEN.forEach((kind) => expect(Object.values(all).some((html) => labelsIn(html, [kind]).length > 0), kind).toBe(true));
    expect(Object.values(all).reduce((s, html) => s + labelsIn(html, FORBIDDEN).length, 0)).toBeGreaterThan(150);
  });

  it('NEGATIVE CONTROL: the allowed spans do carry P-labels, and only the convention module\'s', () => {
    const inventory = labelsIn(renders()['capital/inventory'], ['npvinput']);
    expect(findPLabels(inventory)).toHaveLength(3);
    const outcomes = labelsIn(renders()['governance/simulation'], ['outcome']);
    expect(outcomes.length).toBeGreaterThanOrEqual(5);
    expect([...new Set(outcomes)].sort()).toEqual([OUTCOME_LABELS.p10, OUTCOME_LABELS.p90].sort());
    // Nothing but the two exceedance cases of an outcome is marked outcome anywhere.
    const everyOutcome = Object.values(renders()).flatMap((html) => labelsIn(html, ['outcome']));
    expect([...new Set(everyOutcome)].every((s) => [OUTCOME_LABELS.p90, OUTCOME_LABELS.p10].includes(s))).toBe(true);
  });

  it('NEGATIVE CONTROL (1): a forecast rule planted as a P-label, rendered through the real Forecast mode, is caught', () => {
    const planted = { ...D.fc, rows: D.fc.rows.map((r, i) => (i === 0 ? { ...r, rule: 'P50 forecast' } : r)) };
    const caught = findPLabels(labelsIn(render(<ForecastMode fr={planted} />), FORBIDDEN));
    expect(caught).toEqual(['P50 forecast']);
    expect(findPLabels(labelsIn(render(<ForecastMode fr={D.fc} />), FORBIDDEN))).toEqual([]);
  });

  it('NEGATIVE CONTROL (2): an unmarked P-label planted in a project name, through the real Inventory mode, is caught', () => {
    const planted = { ...D.inv, rows: D.inv.rows.map((r, i) => (i === 2 ? { ...r, name: 'P90 wildcat' } : r)) };
    expect(findPLabels([textOutsideAllowed(render(<InventoryMode inv={planted} rules={D.rules} />))])).toHaveLength(1);
    expect(findPLabels([textOutsideAllowed(render(<InventoryMode inv={D.inv} rules={D.rules} />))])).toEqual([]);
  });

  it('no panel source and not the course page types a P-label; every one it prints is imported', () => {
    const files = ['CapitalExplorer.jsx', 'CostExplorer.jsx', 'GovernanceExplorer.jsx'].map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')])
      .concat([['PortfolioLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]]);
    files.forEach(([f, text]) => {
      const hits = text.split('\n').filter((line) => P_LABEL_RE.test(line) && !/^\s*\/\//.test(line));
      expect(hits, f).toEqual([]);
    });
    expect(P_LABEL_RE.test('<p>P90 capex</p>')).toBe(true);
  });

  it('every panel renders in every mode with its own data, without throwing', () => {
    CAPITAL_MODES.forEach(([m]) => expect(() => render(<CapitalExplorer initialMode={m} />), m).not.toThrow());
    COST_MODES.forEach(([m]) => expect(() => render(<CostExplorer initialMode={m} />), m).not.toThrow());
    GOVERNANCE_MODES.forEach(([m]) => expect(() => render(<GovernanceExplorer initialMode={m} />), m).not.toThrow());
    expect(render(<CostExplorer initialMode="scurve" />)).toContain('Feb 27');
    // Every mode shows data, not its "did not return" fallback.
    const fallbacks = [...CAPITAL_MODES.map(([m]) => render(<CapitalExplorer initialMode={m} />)),
      ...COST_MODES.map(([m]) => render(<CostExplorer initialMode={m} />)),
      ...GOVERNANCE_MODES.map(([m]) => render(<GovernanceExplorer initialMode={m} />))]
      .filter((html) => /did not return|returned nothing/.test(html));
    expect(fallbacks).toEqual([]);
  });
});
