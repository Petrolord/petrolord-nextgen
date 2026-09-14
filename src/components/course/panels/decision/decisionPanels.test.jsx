// TWO GATES ON WHAT THE DECISION PANELS RENDER.
//
// THE WITHHELD GATE. Since EC4-0 the VOI Analyzer returns null for the value
// cards it withholds (emvWithInfo, voi, netVoi) when the typed inputs
// contradict each other. A panel that pushes that null through a naive
// formatter prints "null", "NaN" or "$null" where the learner should read that
// the value is withheld. Every card value a panel renders carries
// data-card="<engine key>" (the gross voi data-gross, the raw engine strings
// data-kpi), and this file reads every one back out of the markup of every mode
// of the information and judgement explorers, with real withheld results, and
// requires each to be a two-decimal string or the word withheld. The negative
// control renders a withheld result through a naive formatter and watches the
// same check fail.
//
// THE P-LABEL GATE. Under the Suite percentile convention a P-label belongs to
// an outcome only. On these panels the only P-labels allowed are on the Monte
// Carlo NPV summary (the linked payoff's P90 low, P50 and P10 high, and the
// brief's economics rows), in exceedance order. Probabilities, likelihoods and
// posteriors carry none. Those outcome labels carry data-plabel="outcome"; this
// file strips them from every rendered mode, runs the convention module's
// findPLabels over every text node that remains and requires nothing, then
// checks the outcome labels themselves read P90, P50, P10 in order. Two negative
// controls: a posterior label planted with a P-label is caught, and the summary
// readings rendered in reverse order fail the order check.
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { findPLabels, P_LABEL_RE, OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import * as L from './decisionLab.js';
import TreeExplorer, {
  MODES as TREE_MODES, TreeMode, ChanceMode, SequenceMode, SweepMode,
} from './TreeExplorer';
import InformationExplorer, {
  MODES as INFO_MODES, PerfectMode, BayesMode, BuyMode, AccuracyMode, AnalyzerMode,
} from './InformationExplorer';
import JudgementExplorer, {
  MODES as JUDGE_MODES, ContradictionsMode, LotteriesMode, BriefMode, DefaultsMode, DistrustMode,
} from './JudgementExplorer';
import { KpiCards } from './decisionKit';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.resolve(HERE, '../../../../pages/apps/DecisionLearningPage.jsx');

const render = (el) => renderToStaticMarkup(el);
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const D = {
  t: L.ekpanTree(), rules: L.engineRules(), refs: L.refusals(), dn: L.decisionNodes(),
  th: L.thirds(), cc: L.costOnChanceBranch(), dp: L.distributionPayoff(), dro: L.drillOutcomes(),
  ok: L.okrika(), seqs: L.publishedSequences(), ps: L.priorSweep(), sp: L.switchPoint(), pw: L.publishedSweep(),
  pi: L.perfectInformation(), es: L.evpiSweep(), by: L.bayes(), it: L.informationTree(), cs: L.costSweep(),
  ac: L.accuracySweep(), an: L.analyzer(),
  ct: L.contradictions(), bl: L.biggerLotteries(), bf: L.brief(), sd: L.silentDefaults(), ds: L.distrust(),
};

/** Every mode of every panel, rendered with everything it can show. */
const renders = () => ({
  'tree/tree': render(<TreeMode t={D.t} rules={D.rules} refs={D.refs} dn={D.dn} />),
  'tree/chance': render(<ChanceMode th={D.th} cc={D.cc} dp={D.dp} dro={D.dro} />),
  'tree/sequence': render(<SequenceMode ok={D.ok} seqs={D.seqs} />),
  'tree/sweep': render(<SweepMode ps={D.ps} sp={D.sp} pw={D.pw} />),
  'information/perfect': render(<PerfectMode pi={D.pi} es={D.es} />),
  'information/bayes': render(<BayesMode by={D.by} />),
  'information/buy': render(<BuyMode it={D.it} cs={D.cs} />),
  'information/accuracy': render(<AccuracyMode ac={D.ac} />),
  'information/analyzer': render(<AnalyzerMode an={D.an} />),
  'judgement/contradictions': render(<ContradictionsMode ct={D.ct} />),
  'judgement/lotteries': render(<LotteriesMode bl={D.bl} />),
  'judgement/brief': render(<BriefMode bf={D.bf} />),
  'judgement/defaults': render(<DefaultsMode sd={D.sd} />),
  'judgement/distrust': render(<DistrustMode ds={D.ds} />),
});

it('every mode of every panel is rendered, so a new mode cannot hide from either gate', () => {
  const keys = Object.keys(renders());
  TREE_MODES.forEach(([m]) => expect(keys, m).toContain(`tree/${m}`));
  INFO_MODES.forEach(([m]) => expect(keys, m).toContain(`information/${m}`));
  JUDGE_MODES.forEach(([m]) => expect(keys, m).toContain(`judgement/${m}`));
  expect(keys).toHaveLength(TREE_MODES.length + INFO_MODES.length + JUDGE_MODES.length);
});

// ---------------------------------------------------------------------------
// THE WITHHELD GATE
// ---------------------------------------------------------------------------

const CARD_SPAN = /<span data-(card|gross|kpi)="[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
const cardsIn = (html) => [...html.matchAll(CARD_SPAN)].map((x) => unescape(x[2].replace(/<[^>]+>/g, '')));
const CARD_TEXT = /^(-?\d+\.\d{2}|withheld)$/;
/** Every way a card can be wrong, or an empty list. */
const withheldProblems = (html) => {
  const bad = cardsIn(html).filter((t) => !CARD_TEXT.test(t)).map((t) => `card reads "${t}"`);
  if (/NaN/.test(html)) bad.push('NaN in the markup');
  if (/\$null/.test(html)) bad.push('$null in the markup');
  if (/>null</.test(html)) bad.push('a bare null in the markup');
  return bad;
};

describe('THE WITHHELD GATE: a withheld card reads withheld, never null, NaN or $null', () => {
  const irriAsTyped = { ...D.an, ekpanTyped: { ...D.ct.irri, percents: D.an.ekpanTyped.percents } };

  it('the lab really hands the panels withheld results, so the gate has something to see', () => {
    expect(D.ct.irri.withheld).toBe(true);
    expect([D.ct.irri.kpis.emvWithInfo, D.ct.irri.kpis.voi, D.ct.irri.kpis.netVoi]).toEqual([null, null, null]);
  });

  it('the judgement explorer renders every withheld card in contradictions mode as withheld', () => {
    const html = renders()['judgement/contradictions'];
    expect(withheldProblems(html)).toEqual([]);
    const cards = cardsIn(html);
    // IRRI (3), four published withheld cases (3 each), three rounded rows (2 each), EKPAN 56 / 44 (3).
    expect(cards.filter((t) => t === 'withheld').length).toBeGreaterThanOrEqual(3 + 12 + 6 + 3);
    expect(cards.length).toBeGreaterThan(40);
  });

  it('the information explorer renders a withheld result in analyzer mode as withheld', () => {
    const html = render(<AnalyzerMode an={irriAsTyped} />);
    expect(withheldProblems(html)).toEqual([]);
    expect(cardsIn(html).filter((t) => t === 'withheld')).toHaveLength(3);
  });

  it('no mode of either explorer, nor the tree explorer, renders a card any other way', () => {
    Object.entries(renders()).forEach(([k, html]) => expect(withheldProblems(html), k).toEqual([]));
    expect(cardsIn(renders()['information/analyzer']).length).toBeGreaterThan(20);
  });

  it('NEGATIVE CONTROL: a withheld result through a naive formatter is caught', () => {
    const naive = render(<KpiCards result={D.ct.irri} format={(v) => `$${v}`} />);
    const problems = withheldProblems(naive);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems).toContain('card reads "$null"');
    expect(problems).toContain('$null in the markup');
    const plain = render(<KpiCards result={D.ct.irri} format={(v) => String(v)} />);
    expect(withheldProblems(plain)).toContain('card reads "null"');
    // And the real formatter on the same result is clean.
    expect(withheldProblems(render(<KpiCards result={D.ct.irri} />))).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// THE P-LABEL GATE
// ---------------------------------------------------------------------------

const OUTCOME_SPAN = /<span data-plabel="outcome"[^>]*>([\s\S]*?)<\/span>/g;
const outcomeLabelsIn = (html) => [...html.matchAll(OUTCOME_SPAN)].map((x) => unescape(x[1].replace(/<[^>]+>/g, '')).trim());
const textOutsideOutcomes = (html) => html.replace(OUTCOME_SPAN, ' ').split(/<[^>]+>/).map((s) => unescape(s).trim()).filter(Boolean);
const EXCEEDANCE = [OUTCOME_LABELS.p90, OUTCOME_LABELS.p50, OUTCOME_LABELS.p10];
/** The outcome labels read P90, P50, P10, repeated, and nothing else. */
const inExceedanceOrder = (labels) => labels.length % 3 === 0
  && labels.every((l, i) => (l.match(P_LABEL_RE) || [])[0] === EXCEEDANCE[i % 3]);

describe('THE P-LABEL GATE: only the Monte Carlo NPV summary carries P-labels, in exceedance order', () => {
  it('findPLabels over every text node outside the outcome labels, in every mode, finds nothing', () => {
    const offending = Object.entries(renders()).flatMap(([k, html]) => findPLabels(textOutsideOutcomes(html)).map((s) => `${k}: ${s}`));
    expect(offending).toEqual([]);
  });

  it('the outcome labels are exactly where the summary is, and read P90, P50, P10', () => {
    const counts = Object.fromEntries(Object.entries(renders()).map(([k, html]) => [k, outcomeLabelsIn(html)]));
    expect(counts['tree/chance']).toEqual([`${OUTCOME_LABELS.p90} (low)`, OUTCOME_LABELS.p50, `${OUTCOME_LABELS.p10} (high)`]);
    expect(counts['judgement/brief']).toEqual([
      `${OUTCOME_LABELS.p90} (low)`, OUTCOME_LABELS.p50, `${OUTCOME_LABELS.p10} (high)`, ...L.ECONOMICS_ROW_LABELS,
    ]);
    Object.entries(counts).forEach(([k, labels]) => {
      if (k === 'tree/chance' || k === 'judgement/brief') expect(inExceedanceOrder(labels), k).toBe(true);
      else expect(labels, `${k} carries an outcome label with no summary`).toEqual([]);
    });
  });

  it('the gate has text to read in every mode, so it cannot pass on nothing', () => {
    Object.entries(renders()).forEach(([k, html]) => expect(textOutsideOutcomes(html).length, k).toBeGreaterThan(20));
  });

  it('NEGATIVE CONTROL: a posterior row labelled with a P-label, rendered through the real Bayes mode, is caught', () => {
    const planted = { ...D.by, rows: D.by.rows.map((s, i) => (i === 0 ? { ...s, label: `${OUTCOME_LABELS.p90} bright spot` } : s)) };
    const caught = findPLabels(textOutsideOutcomes(render(<BayesMode by={planted} />)));
    expect(caught).toContain(`${OUTCOME_LABELS.p90} bright spot`);
    expect(findPLabels(textOutsideOutcomes(render(<BayesMode by={D.by} />)))).toEqual([]);
  });

  it('NEGATIVE CONTROL: the summary readings rendered in reverse order fail the order check', () => {
    const reversed = { ...D.dp, readings: [...D.dp.readings].reverse() };
    const labels = outcomeLabelsIn(render(<ChanceMode th={D.th} cc={D.cc} dp={reversed} dro={D.dro} />));
    expect(labels).toHaveLength(3);
    expect(inExceedanceOrder(labels)).toBe(false);
  });

  it('no panel source, the kit or the course page types a P-label; every one it prints is imported', () => {
    const files = ['TreeExplorer.jsx', 'InformationExplorer.jsx', 'JudgementExplorer.jsx', 'decisionKit.jsx']
      .map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')])
      .concat([['DecisionLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]]);
    files.forEach(([f, text]) => {
      const hits = text.split('\n').filter((line) => P_LABEL_RE.test(line) && !/^\s*(\/\/|\*|\/\*)/.test(line));
      expect(hits, f).toEqual([]);
    });
    expect(P_LABEL_RE.test('<td>P90 posterior</td>')).toBe(true);
  });

  it('every panel renders in every mode with no data yet, without throwing', () => {
    TREE_MODES.forEach(([m]) => expect(() => render(<TreeExplorer initialMode={m} />), m).not.toThrow());
    INFO_MODES.forEach(([m]) => expect(() => render(<InformationExplorer initialMode={m} />), m).not.toThrow());
    JUDGE_MODES.forEach(([m]) => expect(() => render(<JudgementExplorer initialMode={m} />), m).not.toThrow());
    [TreeMode, ChanceMode, SequenceMode, SweepMode, PerfectMode, BayesMode, BuyMode, AccuracyMode, AnalyzerMode,
      ContradictionsMode, LotteriesMode, BriefMode, DefaultsMode, DistrustMode].forEach((Mode) => expect(() => render(<Mode />)).not.toThrow());
  });
});
