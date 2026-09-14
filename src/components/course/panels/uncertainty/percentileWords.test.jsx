// THE PERCENTILE WORDS GATE.
//
// A breakeven price is a quantity where more is worse, and every input (capex,
// opex, efficiency, a price range) is a parameter. Under the Suite percentile
// convention neither may ever carry a P-label: they take "10th / 50th / 90th
// percentile". Only an NPV outcome takes P90 / P50 / P10, and the old swapped
// card text is quoted as history.
//
// The gate is on what the panels RENDER, not on what the lab returns. Every
// label a panel prints for a breakeven price carries data-plabel="price" and
// every label for an input data-plabel="input"; this file renders every mode of
// all three panels with real lab data (at small iteration counts, which change
// no label), reads those labels back out of the markup, and runs the convention
// module's own findPLabels over them. It must find nothing.
//
// Two negative controls prove the gate can see: the same extractor finds the
// P-labels on the NPV cases and in the quoted history, and a run whose price
// labels are replaced by a P-label, rendered through the real Distribution mode,
// is caught.
import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { findPLabels, P_LABEL_RE, OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import * as L from './uncertaintyLab.js';
import ScreeningExplorer, {
  MODES as SCREENING_MODES, CaseMode, LedgerMode, ValueMode, RangeMode,
} from './ScreeningExplorer';
import BreakevenExplorer, {
  MODES as BREAKEVEN_MODES, FitMode, SampleMode, SolveMode, DistributionMode,
} from './BreakevenExplorer';
import RiskExplorer, {
  MODES as RISK_MODES, LabelsMode, MonteCarloMode, RulesMode, EdgesMode, DistrustMode,
} from './RiskExplorer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.resolve(HERE, '../../../../pages/apps/UncertaintyLearningPage.jsx');

const render = (el) => renderToStaticMarkup(el);
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** Every data-plabel label of the given kinds, as the reader sees it. */
const labelsIn = (html, kinds) => [...html.matchAll(/<(\w+)\b[^>]*\bdata-plabel="([a-z]+)"[^>]*>([\s\S]*?)<\/\1>/g)]
  .filter((x) => kinds.includes(x[2]))
  .map((x) => unescape(x[3].replace(/<[^>]+>/g, '')).trim());

const PRICE_OR_INPUT = ['price', 'input'];

let D;
beforeAll(async () => {
  const run = L.breakevenRun({ iterations: 200 });
  D = {
    qc: L.quickCase('isiala'), conventions: L.screeningConventions(), limit: L.noEconomicLimit(),
    ledgers: L.FIELD_KEYS.map((k) => L.ledger(k)), value: L.value('isiala'), paybacks: L.paybackCases(), irrs: L.irrCases(),
    sens: L.sensitivity('isiala'), scen: L.scenarios('isiala'),
    fit: L.fits(), inexact: L.publishedInexactFit(), walk: L.samplingWalk(), comparison: L.seedComparison(7, 60),
    curve: L.breakevenCurve(), hurdle: L.hurdles(), kinks: L.taxKinks(), solves: L.solveCases(),
    run, torn: L.tornado(run), unreachable: L.publishedUnreachable(), published: L.publishedBreakevenRuns(),
    words: L.pLabelWords(), cases: await L.scenarioBuilderCases(), mc: await L.scenarioBuilderMonteCarlo(),
    seeds: await L.mcSeedComparison(), priceOnly: L.publishedPriceOnly(), rules: await L.twoRules(),
    wob: L.wobble({ seeds: [1, 2], seedIterations: 100, counts: [100, 200] }),
    edges: await L.edges(), narrow: L.narrowBeliefRun({ iterations: 200 }), distrust: L.distrust(),
  };
}, 300_000);

/** Every mode of every panel, rendered with everything it can show. */
const renders = () => ({
  'screening/case': render(<CaseMode qc={D.qc} conventions={D.conventions} limit={D.limit} />),
  ...Object.fromEntries(D.ledgers.map((led) => [`screening/ledger/${led.fieldKey}`, render(<LedgerMode led={led} fieldKey={led.fieldKey} onField={() => {}} />)])),
  'screening/value': render(<ValueMode v={D.value} paybacks={D.paybacks} irrs={D.irrs} />),
  'screening/range': render(<RangeMode sens={D.sens} scen={D.scen} />),
  'breakeven/fit': render(<FitMode fit={D.fit} inexact={D.inexact} onInexact={() => {}} />),
  'breakeven/sample': render(<SampleMode walk={D.walk} seed={20260829} onSeed={() => {}} comparison={D.comparison} onCompare={() => {}} />),
  'breakeven/solve': render(<SolveMode curve={D.curve} hurdle={D.hurdle} kinks={D.kinks} solves={D.solves} />),
  'breakeven/distribution': render(<DistributionMode run={D.run} torn={D.torn} unreachable={D.unreachable} published={D.published} />),
  'risk/labels': render(<LabelsMode words={D.words} cases={D.cases} run={D.run} onRun={() => {}} />),
  'risk/montecarlo': render(<MonteCarloMode mc={D.mc} seeds={D.seeds} priceOnly={D.priceOnly} />),
  'risk/rules': render(<RulesMode rules={D.rules} wob={D.wob} onWobble={() => {}} />),
  'risk/edges': render(<EdgesMode e={D.edges} narrow={D.narrow} onNarrow={() => {}} />),
  'risk/distrust': render(<DistrustMode d={D.distrust} />),
});

describe('THE PERCENTILE WORDS GATE: no price and no input label carries a P-label', () => {
  it('every mode of every panel is rendered, so a new mode cannot hide from the gate', () => {
    const keys = Object.keys(renders());
    SCREENING_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`screening/${m}`)), m).toBe(true));
    BREAKEVEN_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`breakeven/${m}`)), m).toBe(true));
    RISK_MODES.forEach(([m]) => expect(keys.some((k) => k.startsWith(`risk/${m}`)), m).toBe(true));
  });

  it('findPLabels over every price and input label a panel renders finds nothing', () => {
    const offending = Object.entries(renders()).flatMap(([k, html]) => findPLabels(labelsIn(html, PRICE_OR_INPUT)).map((s) => `${k}: ${s}`));
    expect(offending).toEqual([]);
  });

  it('the gate has labels to read in every mode that shows a price or an input, so it cannot pass on nothing', () => {
    const counts = Object.fromEntries(Object.entries(renders()).map(([k, html]) => [k, labelsIn(html, PRICE_OR_INPUT).length]));
    ['screening/case', 'screening/range', 'breakeven/fit', 'breakeven/sample', 'breakeven/solve', 'breakeven/distribution',
      'risk/labels', 'risk/montecarlo', 'risk/rules', 'risk/edges'].forEach((k) => expect(counts[k], k).toBeGreaterThan(0));
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBeGreaterThan(60);
  });

  it('the breakeven price is worded as three percentiles, exactly as the convention module words it', () => {
    const labels = labelsIn(renders()['breakeven/distribution'], ['price']);
    ['10th percentile of breakeven price', '50th percentile of breakeven price', '90th percentile of breakeven price']
      .forEach((w) => expect(labels).toContain(w));
    const tornadoSides = labelsIn(renders()['breakeven/distribution'], ['input']);
    expect(tornadoSides).toContain('90th percentile of efficiency');
    expect(tornadoSides).toContain('10th percentile of capex');
  });

  it('NEGATIVE CONTROL: the same extractor sees the P-labels that ARE allowed, on the NPV cases and in the quoted history', () => {
    const html = renders()['risk/labels'];
    const outcomes = labelsIn(html, ['outcome']);
    expect(outcomes).toEqual([OUTCOME_LABELS.p90, OUTCOME_LABELS.p50, OUTCOME_LABELS.p10]);
    expect(findPLabels(outcomes)).toHaveLength(3);
    const history = labelsIn(html, ['history']);
    expect(history).toEqual(['"P90 (Conservative)"', '"P10 (Optimistic)"']);
    expect(findPLabels(history)).toHaveLength(2);
    // And they are not counted as price or input labels.
    expect(findPLabels(labelsIn(html, PRICE_OR_INPUT))).toEqual([]);
  });

  it('NEGATIVE CONTROL: a run whose price labels say P90, rendered through the real Distribution mode, is caught', () => {
    const planted = { ...D.run, percentiles: D.run.percentiles.map((x, i) => ({ ...x, label: `${['P10', 'P50', 'P90'][i]} breakeven price` })) };
    const html = render(<DistributionMode run={planted} torn={D.torn} />);
    const caught = findPLabels(labelsIn(html, PRICE_OR_INPUT));
    expect(caught.length).toBeGreaterThanOrEqual(3);
    expect(caught).toContain('P90 breakeven price');
    // And the unplanted render of the same mode is clean.
    expect(findPLabels(labelsIn(render(<DistributionMode run={D.run} torn={D.torn} />), PRICE_OR_INPUT))).toEqual([]);
  });

  it('no panel source and not the course page types a P-label; every one it prints is imported', () => {
    const files = ['ScreeningExplorer.jsx', 'BreakevenExplorer.jsx', 'RiskExplorer.jsx'].map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')])
      .concat([['UncertaintyLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]]);
    files.forEach(([f, text]) => {
      const hits = text.split('\n').filter((line) => P_LABEL_RE.test(line) && !/^\s*\/\//.test(line));
      expect(hits, f).toEqual([]);
    });
    // Negative control for the grep: the pattern does match a typed P-label.
    expect(P_LABEL_RE.test('<p>P90 (Conservative)</p>')).toBe(true);
  });

  it('every panel renders in every mode with no data yet, before any run, without throwing', () => {
    SCREENING_MODES.forEach(([m]) => expect(() => render(<ScreeningExplorer initialMode={m} />), m).not.toThrow());
    BREAKEVEN_MODES.forEach(([m]) => expect(() => render(<BreakevenExplorer initialMode={m} />), m).not.toThrow());
    RISK_MODES.forEach(([m]) => expect(() => render(<RiskExplorer initialMode={m} />), m).not.toThrow());
  });
});
