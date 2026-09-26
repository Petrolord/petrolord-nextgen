// THE D5 TEACHING LAB: Applied AI and Language Models.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/dataai/evaluate.js, sha-identical with
// petrolord-engines 1906182, which imports lib/stats for the seeded bootstrap,
// lib/conventions/percentile.js for the interval labels and engines/dataai/ml.js
// for log loss) on the Ekene document fixtures, or on the documents, queries,
// judgments, answers, labels, ratings and probabilities a learner types into a
// panel. The dataset is the vendored fixture set itself, imported from
// packages/engines/test-data/dataai/ekene-docs, so the lab, the digest
// generator, the engine's own gate and the Suite app read the same files, and
// evaluateLab.test.js asserts that every number a teaching reader returns is
// printed in the teaching digest.
//
// NO LANGUAGE MODEL RUNS HERE OR ANYWHERE THE LAB CALLS. The two systems'
// answers are fixture text.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone dataset, and panelCapstoneGuard.test.js greps this file, the
// three panels and the learning page for every rendering of all eighteen
// answers and every capstone name and input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// Nothing here reads a clock, a random number or a locale. The only random
// draws are the engine's own seeded bootstrap replicates.
import * as EV from '@petrolord/engines/engines/dataai/evaluate.js';
import CORPUS from '@petrolord/engines/test-data/dataai/ekene-docs/corpus.json';
import QUERIES from '@petrolord/engines/test-data/dataai/ekene-docs/queries.json';
import SYSTEMS from '@petrolord/engines/test-data/dataai/ekene-docs/systems.json';
import EXTRACTION from '@petrolord/engines/test-data/dataai/ekene-docs/extraction.json';
import CALIBRATION from '@petrolord/engines/test-data/dataai/ekene-docs/calibration.json';

export const DATASET = Object.freeze({ corpus: CORPUS, queries: QUERIES, systems: SYSTEMS, extraction: EXTRACTION, calibration: CALIBRATION });
export const DEFAULTS = EV.DEFAULTS;
export const STOP_WORDS = EV.ENGLISH_STOP_WORDS;

/* ------------------------------------------------ the Ekene fixture views */

export const DOCS = CORPUS.passages.map((p) => ({ id: p.id, text: p.text }));
export const QUERY_LIST = QUERIES.queries.map((q) => ({ id: q.id, text: q.text }));
export const JUDGMENTS = Object.fromEntries(QUERIES.queries.map((q) => [q.id, q.judgments]));
export const SECOND_ANNOTATOR = Object.fromEntries(QUERIES.queries.map((q) => [q.id, q.secondAnnotator]));
export const REFERENCES = Object.fromEntries(QUERIES.queries.map((q) => [q.id, q.reference]));
const SYS = Object.fromEntries(SYSTEMS.systems.map((s) => [s.id, s]));
export const SYSTEM_IDS = SYSTEMS.systems.map((s) => s.id);
export const runsOf = (system) => Object.fromEntries(SYS[system].answers.map((a) => [a.query, a.retrieved]));
export const answersOf = (system) => SYS[system].answers.map((a) => ({ query: a.query, text: a.text, citations: a.citations }));
export const shortsOf = (system) => SYS[system].answers.map((a) => ({ query: a.query, answer: a.short, reference: REFERENCES[a.query] }));

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/** JSON a learner pastes (a case file, a list of passages, a judgment map). Returns { value } or { error }. */
export const parseJson = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the box is empty' };
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: `the box does not hold valid JSON (${e.message})` };
  }
};

/**
 * Passages as a learner types or pastes them: a JSON array of { id, text }, or
 * one passage a line written "id: text" (or "id<TAB>text"). Returns
 * { documents } or { error }; the engine refuses anything malformed by name.
 */
export const parseDocuments = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'no passages' };
  const t = text.trim();
  if (t.startsWith('[') || t.startsWith('{')) {
    const j = parseJson(t);
    if (j.error) return j;
    const v = j.value;
    return { documents: Array.isArray(v) ? v : (v.documents || v.passages || v) };
  }
  const documents = [];
  const lines = t.split('\n').filter((l) => l.trim() !== '');
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(/^\s*([^:\t]+?)\s*[:\t]\s?(.*)$/);
    if (!m) return { error: `line ${i + 1} has no "id: text" form` };
    documents.push({ id: m[1], text: m[2] });
  }
  return { documents };
};

/** A list of numbers separated by commas, spaces, semicolons or new lines. */
export const parseNumbers = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the list is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const values = [];
  for (let i = 0; i < parts.length; i += 1) {
    const v = Number(parts[i]);
    if (!Number.isFinite(v)) return { error: `entry ${i + 1}, ${parts[i]}, is not a number` };
    values.push(v);
  }
  return { values };
};

/** A list of ids or words separated by commas or spaces. */
export const parseNames = (text) => (typeof text === 'string' ? text.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s !== '') : []);

/** The Ekene passages as the text a panel starts from, one "id: text" a line. */
export const documentsText = (ids) => DOCS.filter((d) => !ids || ids.includes(d.id)).map((d) => `${d.id}: ${d.text}`).join('\n');

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const tokenizeOf = (args) => EV.tokenize(args);
export const vectorsOf = (args) => EV.tfidfVectors(args);
export const tfidfOf = (args) => EV.rankTfidf(args);
export const bm25Of = (args) => EV.rankBm25(args);
export const retrieveOf = (args) => EV.retrieve(args);
export const metricsOf = (args) => EV.retrievalMetrics(args);
export const evaluateOf = (args) => EV.evaluateRetrieval(args);
export const normalizeOf = (args) => EV.normalizeAnswer(args);
export const matchOf = (args) => EV.answerMatch(args);
export const extractionOf = (args) => EV.scoreExtraction(args);
export const groundOf = (args) => EV.checkGroundedness(args);
export const answersCheckOf = (args) => EV.checkAnswers(args);
export const kappaOf = (args) => EV.cohenKappa(args);
export const calibrationOf = (args) => EV.calibration(args);
export const bootstrapOf = (args) => EV.bootstrapMean(args);
export const pairedOf = (args) => EV.pairedBootstrap(args);

/**
 * Short answers scored in a list: each answer against its reference by
 * answerMatch, and the mean token F1 and exact-match count over the list.
 * Every per-answer figure is an engine return; the mean is their arithmetic
 * mean, printed as derived.
 */
export const matchList = (pairs) => {
  const rows = pairs.map((p) => ({ ...p, r: EV.answerMatch({ prediction: p.answer, truth: p.reference }) }));
  const bad = rows.find((x) => x.r.error);
  if (bad) return { refusal: bad.r };
  const f1 = rows.reduce((s, x) => s + x.r.f1, 0) / rows.length;
  return { rows, exact: rows.filter((x) => x.r.exactMatch).length, meanF1: f1 };
};

/** Per-query values of one metric, for the included queries, in id order. */
export const perQueryValues = (evaluation, key) => evaluation.perQuery.filter((r) => r.nRelevant > 0).map((r) => r[key]);

/* ------------------------------------------------- the teaching readers */

/** The digest's stated teaching inputs, the same values the panels start from. */
export const TEACHING = Object.freeze({
  k: 5, seed: 7, nBoot: 2000, relTol: 0.002, hQuery: 'oil rate',
  hand: Object.freeze([
    { id: 'd1', text: 'Oil rate 120 bopd at Ekene-1. Oil rate fell.' },
    { id: 'd2', text: 'Water injection at Ekene-2 started on 2023-01-01.' },
    { id: 'd3', text: 'Oil and water rates were tested; the oil rate was 150 bopd.' },
    { id: 'd4', text: 'Pressure survey: 2,096 psia.' },
    { id: 'd5', text: '' },
  ]),
  ranking: Object.freeze(['c', 'a', 'x', 'b', 'd']),
  judgments: Object.freeze({ a: 3, b: 2, c: 0, d: 1, e: 2 }),
});
const T = TEACHING;
const HAND = T.hand.map((d) => ({ ...d }));

/** Associate: the hand set's TF-IDF vocabulary and the "oil rate" cosine ranking. */
export const tfidfReader = () => {
  const v = EV.tfidfVectors({ documents: HAND });
  const r = EV.rankTfidf({ documents: HAND, query: T.hQuery, k: T.k });
  const q4 = EV.rankTfidf({ documents: DOCS, query: QUERIES.queries.find((q) => q.id === 'Q04').text, k: T.k });
  return {
    idf: v.vocabulary.map((t, i) => ({ term: t, df: v.df[i], idf: v.idf[i] })),
    norms: v.vectors.map((x) => ({ id: x.id, length: x.length, norm: x.norm })),
    ranking: r.ranking.map((x) => ({ id: x.id, score: x.score })),
    q04: q4.ranking.map((x) => ({ id: x.id, score: x.score })),
  };
};

/** Associate: the hand set's BM25 for "oil rate", term by term, and Q02 on the corpus. */
export const bm25Reader = () => {
  const r = EV.rankBm25({ documents: HAND, query: T.hQuery, k: T.k });
  const q2 = EV.rankBm25({ documents: DOCS, query: QUERIES.queries.find((q) => q.id === 'Q02').text, k: T.k });
  return {
    avgdl: r.avgdl,
    terms: r.queryTerms.map((t) => ({ term: t.term, df: t.df, idf: t.idf })),
    ranking: r.ranking.map((x) => ({ id: x.id, length: x.length, score: x.score, terms: x.terms.map((t) => ({ term: t.term, tf: t.tf, contribution: t.contribution })) })),
    q02: q2.ranking.map((x) => ({ id: x.id, length: x.length, score: x.score })),
  };
};

/** Associate: system A's metrics at 5 on every query, and the means of both systems. */
export const atKReader = () => {
  const a = EV.evaluateRetrieval({ runs: runsOf('A'), judgments: JUDGMENTS, k: T.k });
  const b = EV.evaluateRetrieval({ runs: runsOf('B'), judgments: JUDGMENTS, k: T.k });
  const m = EV.retrievalMetrics({ ranking: [...T.ranking], judgments: { ...T.judgments }, k: T.k });
  return {
    stated: { precision: m.precision, recall: m.recall, reciprocalRank: m.reciprocalRank, averagePrecision: m.averagePrecision, ndcg: m.ndcg },
    perQuery: a.perQuery.map((r) => ({ query: r.query, precision: r.precision, recall: r.recall, reciprocalRank: r.reciprocalRank })),
    means: { A: { precision: a.mean.precision, recall: a.mean.recall, hitRate: a.mean.hitRate, mrr: a.mean.mrr }, B: { precision: b.mean.precision, recall: b.mean.recall, hitRate: b.mean.hitRate, mrr: b.mean.mrr } },
  };
};

/** Associate and Professional: both systems' claims, supported claims and fractions. */
export const claimsReader = () => {
  const row = (s, relTol = 0) => {
    const c = EV.checkAnswers({ answers: answersOf(s), documents: DOCS, runs: runsOf(s), numericRelTol: relTol });
    return { system: s, relTol: String(relTol), claims: c.nClaims, supported: c.nSupported, fraction: c.supportedFraction, ...(relTol === 0 ? { mean: c.meanAnswerSupportedFraction } : {}) };
  };
  return [row('A'), row('B'), row('B', T.relTol)];
};

/** Professional: MAP and nDCG at 5, at grade 1 and grade 2, linear and exponential gain. */
export const rankingScoreReader = () => ['A', 'B'].map((s) => {
  const e1 = EV.evaluateRetrieval({ runs: runsOf(s), judgments: JUDGMENTS, k: T.k });
  const e2 = EV.evaluateRetrieval({ runs: runsOf(s), judgments: JUDGMENTS, k: T.k, relevantGrade: 2 });
  const ex = EV.evaluateRetrieval({ runs: runsOf(s), judgments: JUDGMENTS, k: T.k, gain: 'exponential' });
  return { system: s, map1: e1.mean.map, map2: e2.mean.map, ndcg: e1.mean.ndcg, ndcgExp: ex.mean.ndcg, excluded: e1.excluded.length };
});

/** Professional: short answers, exact match and token F1 per query for both systems. */
export const answersReader = () => ['A', 'B'].map((s) => {
  const r = matchList(shortsOf(s));
  return { system: s, exact: r.exact, f1: r.rows.map((x) => x.r.f1) };
});

/** Professional: both systems' extraction tallies. */
export const extractionReader = () => ['A', 'B'].map((s) => {
  const x = EV.scoreExtraction({ labels: EXTRACTION.labels, predictions: EXTRACTION.predictions[s], fields: EXTRACTION.fields });
  const o = x.overall;
  return { system: s, correct: o.correct, wrong: o.wrong, missed: o.missed, unsupported: o.unsupported, microAccuracy: o.microAccuracy, precision: o.precision, recall: o.recall, microF1: o.microF1, macroF1: o.macroF1 };
});

/** Professional: the seeded bootstrap of A's nDCG and the paired comparison of A and B. */
export const compareReader = () => {
  const a = perQueryValues(EV.evaluateRetrieval({ runs: runsOf('A'), judgments: JUDGMENTS, k: T.k }), 'ndcg');
  const b = perQueryValues(EV.evaluateRetrieval({ runs: runsOf('B'), judgments: JUDGMENTS, k: T.k }), 'ndcg');
  const m = EV.bootstrapMean({ values: a, seed: T.seed, nBoot: T.nBoot });
  const p = EV.pairedBootstrap({ a, b, seed: T.seed, nBoot: T.nBoot });
  const u = EV.pairedBootstrap({ a, b, seed: T.seed, nBoot: T.nBoot, paired: false });
  return {
    meanA: { mean: m.mean, lower: m.lower, upper: m.upper, standardError: m.standardError },
    paired: { difference: p.difference, lower: p.lower, upper: p.upper, share: p.shareAtOrBelowZero },
    unpaired: { lower: u.lower, upper: u.upper },
  };
};

/** Expert: the two annotators on every judged pair, unweighted and weighted. */
export const kappaReader = () => {
  const a = []; const b = [];
  QUERIES.queries.forEach((q) => Object.keys(q.judgments).sort().forEach((d) => { a.push(q.judgments[d]); b.push(q.secondAnnotator[d]); }));
  const out = ['none', 'linear', 'quadratic'].map((w) => {
    const k = EV.cohenKappa({ a, b, weights: w });
    return { weights: w, observed: k.observedAgreement, expected: k.expectedAgreement, kappa: k.kappa };
  });
  return { n: a.length, rows: out, confusion: EV.cohenKappa({ a, b }).confusion };
};

/** Expert: the calibration set at 10 bins, its table and the Murphy terms. */
export const calibrationReader = () => {
  const c = EV.calibration({ yTrue: CALIBRATION.rows.map((r) => r.relevant), probabilities: CALIBRATION.rows.map((r) => r.probability) });
  return {
    brier: c.brier, ece: c.ece, mce: c.mce, logLoss: c.logLoss, baseRate: c.baseRate,
    table: c.table.map((t) => ({ bin: t.bin, n: t.n, meanPredicted: t.meanPredicted, observedFrequency: t.observedFrequency, gap: t.gap })),
    murphy: { reliability: c.murphy.reliability, resolution: c.murphy.resolution, uncertainty: c.murphy.uncertainty, withinBinVariance: c.murphy.withinBinVariance, withinBinCovariance: c.murphy.withinBinCovariance },
  };
};

/** A handful of the engine's refusals, for a panel that shows what a refusal looks like. */
export const refusalSamples = () => [
  ['rankBm25', 'k of 0', EV.rankBm25({ documents: HAND, query: T.hQuery, k: 0 })],
  ['retrieve', 'a method it does not offer', EV.retrieve({ documents: DOCS, queries: QUERY_LIST, method: 'dense' })],
  ['evaluateRetrieval', 'a rule it does not offer', EV.evaluateRetrieval({ runs: runsOf('A'), judgments: JUDGMENTS, noRelevant: 'drop' })],
  ['cohenKappa', 'a weighting it does not offer', EV.cohenKappa({ a: [3, 2], b: [3, 2], weights: 'cubic' })],
  ['bootstrapMean', 'no seed', EV.bootstrapMean({ values: [0.8, 0.6] })],
].map(([fn, what, r]) => ({ fn, what, field: r.field, error: r.error }));
