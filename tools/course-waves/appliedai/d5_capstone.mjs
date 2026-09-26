// THE EIGHTEEN GRADED D5 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three capstones, six graded values each, every one a RETURN VALUE of the
// vendored engines/dataai/evaluate.js. A gate that restates the formula
// validates nothing, so nothing here computes an idf, a score, a metric, an F1,
// a kappa or a Brier term by its own arithmetic: every number is read off an
// engine result object, and discriminate.mjs is where the wrong methods live.
//
//   ORLU    Associate     retrieval and cited answers: a BM25 idf, a BM25 top
//                         score, a TF-IDF top cosine, mean recall and MRR at 4,
//                         and the pooled supported fraction of four answers
//   NNEWI   Professional  scoring retrieval and answers honestly: a MAP at
//                         grade 2, an exponential-gain nDCG, the mean token F1
//                         of eight short answers, an extraction macro F1, a
//                         paired-bootstrap upper bound, and a grounded fraction
//   AWKA    Expert        agreement and calibration: unweighted and linear
//                         kappa, the Brier score, and the reliability,
//                         resolution and WBC terms at eight bins (WBC as the
//                         paper labels it: twice the pooled within-bin
//                         covariance)
//
// THE DATASETS ARE SEEDED VARIANTS OF THE EKENE DOCUMENT FIXTURE, generated
// here deterministically through the canonical mulberry32 of lib/stats on
// stated seeds that differ from every seed the digest uses. Each capstone draws
// its own passages (with new ids), words its own queries (each a rewording of a
// fixture query, whose assessor grades it carries), writes its own answers and
// draws its own rating pairs and calibration rows. No language model wrote any
// of it. Every scenario claim the brief will make is asserted.
//
// THE CARE RULES FROM THE PROGRAMME, all asserted below:
//   * NO TIE AT A GRADED CUTOFF. No capstone ranking a graded value reads has a
//     tie at its cutoff, and no graded top score is tied.
//   * NO QUERY EXCLUDED. Every capstone query has a relevant passage at the
//     stated threshold, so a mean never silently drops one.
//   * SEED. A value read from the bootstrap carries its seed and replicate
//     count as stated inputs, and on the next seed it moves by more than ten
//     tolerances, so a learner who changes the seed cannot land on it.
//   * ONE ANSWER. Every graded value is non-zero and not a whole number.
//
// Usage:
//   node d5_capstone.mjs            the human table
//   node d5_capstone.mjs --json     the rows make_fields.mjs writes
//   node d5_capstone.mjs --inputs   the three datasets and their stated
//                                   settings, for oracle_check.py,
//                                   discriminate.mjs and gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST, and the digest generator reads nothing here.
import fs from 'node:fs';
import process from 'node:process';

const ROOT = process.env.D5_ENGINES || '/root/wt-dai-d5-nextgen/packages/engines';
const EV = await import(`${ROOT}/engines/dataai/evaluate.js`);
const { mulberry32 } = await import(`${ROOT}/lib/stats/stats.js`);
const TOLPATH = process.env.D5_TOLERANCE
  || '/root/wt-dai-d5-nextgen/src/components/course/panels/appliedai/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);
const FIX = (f) => JSON.parse(fs.readFileSync(`${ROOT}/test-data/dataai/ekene-docs/${f}`, 'utf8'));

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const NOTES = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
/** A call this file LABELS a success: no error key, every top-level number finite. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/** A seeded Fisher-Yates shuffle through one mulberry32 stream. */
const shuffle = (arr, g) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(g() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const CORPUS = FIX('corpus.json').passages;
const TEXT = Object.fromEntries(CORPUS.map((p) => [p.id, p.text]));
const QUERIES = Object.fromEntries(FIX('queries.json').queries.map((q) => [q.id, q]));
const SYS = Object.fromEntries(FIX('systems.json').systems.map((s) => [s.id, Object.fromEntries(s.answers.map((a) => [a.query, a]))]));
const EXTRACT = FIX('extraction.json');
const CALIB = FIX('calibration.json').rows;

const mapJudgments = (q, idOf) => Object.fromEntries(Object.entries(QUERIES[q].judgments).filter(([d]) => idOf[d]).map(([d, g]) => [idOf[d], g]).sort((a, b) => (a[0] < b[0] ? -1 : 1)));

/* ========================================================== ORLU, Associate

   Twenty-two passages, five reworded queries. The brief states: BM25 at k1
   1.2 and b 0.75, TF-IDF with raw counts, stop list off, cutoff 4, relevant at
   grade 1 or more; the four answers with their citations and the passages
   each system retrieved. */

const OR_SRC = { O1: 'Q13', O2: 'Q01', O3: 'Q02', O4: 'Q20', O5: 'Q18' };
const OR_TEXT = {
  O1: 'water cut reported for Ekene-6 at the close of 2025',
  O2: 'pressure in the reservoir when water injection started',
  O3: 'first day oil rate of Ekene-3',
  O4: 'discharge limit for oil in produced water',
  O5: 'voidage replacement target during injection',
};
// ORLU keeps each source query's passages judged grade 1 or more and the
// passages the answers cite, then seeded fillers (two at least, twenty-two
// passages at least).
const ORLU = (() => {
  const g = mulberry32(70311);
  const need = new Set(['EKD-030', 'EKD-018', 'EKD-003', 'EKD-053']);
  Object.values(OR_SRC).forEach((q) => Object.entries(QUERIES[q].judgments).forEach(([d, gr]) => { if (gr >= 1) need.add(d); }));
  need.delete('EKD-058');
  const rest = shuffle(CORPUS.map((p) => p.id).filter((id) => !need.has(id) && id !== 'EKD-058'), g);
  const size = Math.max(22, need.size + 2);
  const chosen = [...need, ...rest.slice(0, Math.max(0, size - need.size))];
  const order = shuffle(chosen.sort(), g);
  const idOf = Object.fromEntries(order.map((src, i) => [src, `ORL-${String(i + 1).padStart(2, '0')}`]));
  const documents = order.map((src) => ({ id: idOf[src], text: TEXT[src] }));
  const queries = Object.keys(OR_SRC).map((id) => ({ id, text: OR_TEXT[id] }));
  const judgments = Object.fromEntries(Object.entries(OR_SRC).map(([id, q]) => [id, mapJudgments(q, idOf)]));
  return { seed: 70311, idOf, documents, queries, judgments, need: [...need] };
})();
const orS = { method: 'bm25', k: 4, k1: 1.2, b: 0.75, stopWords: false, tfidf: 'raw counts', relevantGrade: 1, numericRelTol: 0, idfTerm: 'pressure', topQuery: 'O1', cosQuery: 'O4' };
const orRun = success('ORLU bm25 k 4', EV.retrieve({ documents: ORLU.documents, queries: ORLU.queries, method: 'bm25', k: orS.k }));
must('ORLU: no BM25 tie at the cutoff 4 on any query', orRun.perQuery.every((p) => !p.tieAtCutoff), orRun.perQuery.filter((p) => p.tieAtCutoff).map((p) => p.id));
const orIdf = success('ORLU bm25 idf', EV.rankBm25({ documents: ORLU.documents, query: orS.idfTerm, k: 1 }));
const orTop = success('ORLU bm25 O1', EV.rankBm25({ documents: ORLU.documents, query: OR_TEXT[orS.topQuery], k: orS.k }));
must('ORLU: the O1 top score is not tied', orTop.ranking.length > 1 && orTop.ranking[0].score !== orTop.ranking[1].score && orTop.ties.every((t) => !t.includes(orTop.ranking[0].id)), JSON.stringify(orTop.ties));
const orCos = success('ORLU tfidf O4', EV.rankTfidf({ documents: ORLU.documents, query: OR_TEXT[orS.cosQuery], k: orS.k }));
must('ORLU: the O4 top cosine is not tied', orCos.ranking.length > 1 && orCos.ranking[0].score !== orCos.ranking[1].score, JSON.stringify(orCos.ties));
const orEval = success('ORLU evaluate k 4', EV.evaluateRetrieval({ runs: orRun.runs, judgments: ORLU.judgments, k: orS.k }));
must('ORLU: every query has a relevant passage and none is excluded', orEval.nIncluded === ORLU.queries.length && orEval.excluded.length === 0, orEval.excluded);
// The four answers: fixture-style hand-written text citing source passages,
// renamed to ORLU ids; each answer's retrieved list is the BM25 top 3 above.
const OR_ANS_SRC = [
  ['O1', 'Ekene-6 water cut was 45.0 percent on 2025-12-01 with oil at 24.0 bopd, up from 23.0 percent at mid-year.', ['EKD-030']],
  ['O2', 'Average reservoir pressure was 2,096 psia on 2023-01-01, just above the 2000 psia bubble point, after 261,475 stb of field oil.', ['EKD-018']],
  ['O3', 'Ekene-3 came on stream on 2020-03-01 at 150 bopd with a GOR of 400 scf/stb, from 29 m of gross sand below a 1541 m TVD top.', ['EKD-003']],
  ['O4', 'The discharge limit is 40 mg/l; the 2025-04-08 sample read 25 mg/l, under the 30 mg/l action level.', ['EKD-053']],
  ['O5', 'The VRR target was 0.85 in the first month of injection and 1.05 from the sixth, with the injection split 60 to 40 between Ekene-2 and Ekene-4.', ['EKD-037', 'EKD-034']],
];
ORLU.answers = OR_ANS_SRC.map(([q, text, cites]) => ({ query: q, text, citations: cites.map((c) => ORLU.idOf[c]), retrieved: orRun.runs[q] }));
must('ORLU: every cited passage is in the corpus', ORLU.answers.every((a) => a.citations.every(Boolean)), 'cites');
const orG = success('ORLU checkAnswers', EV.checkAnswers({ answers: ORLU.answers.map(({ query, text, citations }) => ({ query, text, citations })), documents: ORLU.documents, runs: Object.fromEntries(ORLU.answers.map((a) => [a.query, a.retrieved])) }));
must('ORLU: some claims unsupported, some supported', orG.nSupported > 0 && orG.nSupported < orG.nClaims, `${orG.nSupported}/${orG.nClaims}`);
ORLU.stated = orS;

/* ======================================================= NNEWI, Professional

   Forty-five passages (every passage the eight source queries were judged on
   and every passage system B cited), eight reworded queries, two fixed
   systems whose runs are
   given: P, BM25 at k1 1.5 and b 0.5, and Q, TF-IDF with sublinear tf, each
   top 5. The brief states: MAP at 5 with relevant at grade 2 or more for P;
   mean nDCG at 5 with exponential gain for Q; the mean token F1 of the eight
   short answers; an extraction macro F1 on fourteen records; the paired
   bootstrap of per-query nDCG at 5 (linear gain, grade 1), P minus Q, seed
   44, 2000 replicates, level 0.95; and Q's grounded fraction. */

const NN_SRC = { N1: 'Q02', N2: 'Q03', N3: 'Q05', N4: 'Q08', N5: 'Q11', N6: 'Q15', N7: 'Q18', N8: 'Q20' };
const NN_TEXT = {
  N1: 'first oil rate at Ekene-3',
  N2: 'wells turned into water injectors',
  N3: 'date of water breakthrough at Ekene-6',
  N4: 'injectivity index fall at Ekene-4',
  N5: 'drilling fluid density in the Ekene Sand',
  N6: 'decline model and Di fitted for Ekene-1',
  N7: 'target voidage replacement ratio during the flood',
  N8: 'permitted oil in water for overboard discharge',
};
const NNEWI = (() => {
  const seed = 70422;
  const g = mulberry32(seed);
  const need = new Set();
  Object.values(NN_SRC).forEach((q) => Object.keys(QUERIES[q].judgments).forEach((d) => need.add(d)));
  Object.values(NN_SRC).forEach((q) => SYS.B[q].citations.forEach((c) => { if (TEXT[c]) need.add(c); }));
  need.delete('EKD-058');
  const size = need.size;
  const rest = shuffle(CORPUS.map((p) => p.id).filter((id) => !need.has(id) && id !== 'EKD-058'), g);
  const chosen = [...need, ...rest.slice(0, size - need.size)];
  const order = shuffle(chosen.sort(), g);
  const idOf = Object.fromEntries(order.map((src, i) => [src, `NNW-${String(i + 1).padStart(2, '0')}`]));
  const documents = order.map((src) => ({ id: idOf[src], text: TEXT[src] }));
  const queries = Object.keys(NN_SRC).map((id) => ({ id, text: NN_TEXT[id] }));
  const judgments = Object.fromEntries(Object.entries(NN_SRC).map(([id, q]) => [id, mapJudgments(q, idOf)]));
  // Short answers: per query, a seeded pick of system A's or system B's
  // fixture short answer to the source query; the reference is the fixture's.
  const shorts = Object.entries(NN_SRC).map(([id, q]) => ({ query: id, answer: g() < 0.5 ? SYS.A[q].short : SYS.B[q].short, reference: QUERIES[q].reference }));
  return { seed, idOf, documents, queries, judgments, shorts, size };
})();
const nnS = { k: 5, P: { method: 'bm25', k1: 1.5, b: 0.5, stopWords: false }, Q: { method: 'tfidf', sublinearTf: true, stopWords: false }, mapGrade: 2, ndcgGain: 'exponential', ndcgGrade: 1, noRelevant: 'exclude', bootMetric: 'nDCG at 5, linear gain, grade 1', bootSeed: 44, nBoot: 2000, level: 0.95, paired: true, numericRelTol: 0 };
const nnP = success('NNEWI P run', EV.retrieve({ documents: NNEWI.documents, queries: NNEWI.queries, method: 'bm25', k: nnS.k, k1: nnS.P.k1, b: nnS.P.b }));
const nnQ = success('NNEWI Q run', EV.retrieve({ documents: NNEWI.documents, queries: NNEWI.queries, method: 'tfidf', k: nnS.k, sublinearTf: true }));
must('NNEWI: forty-five passages', NNEWI.documents.length === 45, NNEWI.documents.length);
must('NNEWI: no tie at the cutoff in either run', nnP.perQuery.every((p) => !p.tieAtCutoff) && nnQ.perQuery.every((p) => !p.tieAtCutoff), [...nnP.perQuery, ...nnQ.perQuery].filter((p) => p.tieAtCutoff).map((p) => p.id));
NNEWI.runs = { P: nnP.runs, Q: nnQ.runs };
const nnMapP = success('NNEWI P grade 2', EV.evaluateRetrieval({ runs: NNEWI.runs.P, judgments: NNEWI.judgments, k: nnS.k, relevantGrade: nnS.mapGrade }));
const nnExpQ = success('NNEWI Q exponential', EV.evaluateRetrieval({ runs: NNEWI.runs.Q, judgments: NNEWI.judgments, k: nnS.k, gain: 'exponential' }));
const nnLinP = success('NNEWI P linear', EV.evaluateRetrieval({ runs: NNEWI.runs.P, judgments: NNEWI.judgments, k: nnS.k }));
const nnLinQ = success('NNEWI Q linear', EV.evaluateRetrieval({ runs: NNEWI.runs.Q, judgments: NNEWI.judgments, k: nnS.k }));
must('NNEWI: no query excluded at grade 1 or grade 2', nnMapP.excluded.length === 0 && nnLinP.excluded.length === 0 && nnLinQ.excluded.length === 0, 'excluded');
// Short answers: the mean token F1 is read off the engine's extraction scorer
// (a single text field, labels the references, predictions the answers), whose
// meanF1 is SQuAD token F1 averaged; it is asserted equal to the mean of the
// eight answerMatch F1 values, both engine returns.
const nnShortX = success('NNEWI shorts as one text field', EV.scoreExtraction({
  fields: [{ name: 'answer', type: 'text' }],
  labels: NNEWI.shorts.map((s) => ({ id: s.query, fields: { answer: s.reference } })),
  predictions: NNEWI.shorts.map((s) => ({ id: s.query, fields: { answer: s.answer } })),
}));
const nnShortF1 = nnShortX.perField[0].meanF1;
const nnMatch = NNEWI.shorts.map((s) => success(`NNEWI answerMatch ${s.query}`, EV.answerMatch({ prediction: s.answer, truth: s.reference })));
must('NNEWI: the mean F1 equals the mean of the eight answerMatch F1', Math.abs(nnShortF1 - nnMatch.reduce((a, r) => a + r.f1, 0) / 8) < 1e-15, nnShortF1);
must('NNEWI: some short answers match exactly and some do not', nnMatch.some((r) => r.exactMatch) && nnMatch.some((r) => !r.exactMatch), 'mix');
// Extraction: fourteen labelled records drawn by the stream, renamed NX-01 on;
// per record a seeded pick of system A's or B's prediction (B's missing records
// stay missing).
(() => {
  const g = mulberry32(70437);
  const picks = shuffle(EXTRACT.labels.map((l) => l.id), g).slice(0, 14).sort();
  const nid = Object.fromEntries(picks.map((id, i) => [id, `NX-${String(i + 1).padStart(2, '0')}`]));
  const byId = (arr) => Object.fromEntries(arr.map((r) => [r.id, r]));
  const A = byId(EXTRACT.predictions.A); const B = byId(EXTRACT.predictions.B); const L = byId(EXTRACT.labels);
  NNEWI.extraction = {
    fields: EXTRACT.fields,
    labels: picks.map((id) => ({ id: nid[id], fields: L[id].fields })),
    predictions: picks.map((id) => { const src = g() < 0.5 ? A[id] : B[id]; return src ? { id: nid[id], fields: src.fields } : null; }).filter(Boolean),
  };
})();
const nnX = success('NNEWI extraction', EV.scoreExtraction(NNEWI.extraction));
must('NNEWI: extraction has every outcome class but one at least', ['wrong', 'missed', 'unsupported'].filter((o) => nnX.overall[o] > 0).length >= 2, JSON.stringify(nnX.overall));
must('NNEWI: macro F1 differs from micro F1', Math.abs(nnX.overall.macroF1 - nnX.overall.microF1) > 1e-3, `${nnX.overall.macroF1} ${nnX.overall.microF1}`);
// Paired bootstrap on per-query nDCG at 5 (linear, grade 1), P minus Q.
const ndP = nnLinP.perQuery.map((r) => r.ndcg); const ndQ = nnLinQ.perQuery.map((r) => r.ndcg);
const nnBoot = success('NNEWI paired bootstrap', EV.pairedBootstrap({ a: ndP, b: ndQ, seed: nnS.bootSeed, nBoot: nnS.nBoot, level: nnS.level }));
// Q's answers: the fixture's system B answer text to each source query, its
// citations renamed; Q's retrieved lists are its run.
NNEWI.answers = Object.entries(NN_SRC).map(([id, q]) => ({ query: id, text: SYS.B[q].text, citations: SYS.B[q].citations.map((c) => NNEWI.idOf[c] || c) }));
const nnG = success('NNEWI Q groundedness', EV.checkAnswers({ answers: NNEWI.answers, documents: NNEWI.documents, runs: NNEWI.runs.Q }));
must('NNEWI: Q has supported and unsupported claims', nnG.nSupported > 0 && nnG.nSupported < nnG.nClaims, `${nnG.nSupported}/${nnG.nClaims}`);
NNEWI.stated = nnS;

/* ========================================================== AWKA, Expert

   Ninety-six rating pairs and one hundred and twenty-two calibration rows. The
   brief states: kappa unweighted and linear on the grades 0 to 3 (labels 0,
   1, 2, 3); the Brier score, and the Murphy reliability, resolution and
   WBC terms at eight equal-width bins. WBC is the fifth term of Stephenson,
   Coelho and Jolliffe (2008) eq. 7 as the paper labels it, so it carries the
   factor 2: twice the pooled within-bin covariance. */

const AWKA = (() => {
  const seed = 70533;
  const g = mulberry32(seed);
  const pairs = [];
  Object.values(QUERIES).forEach((q) => Object.keys(q.judgments).sort().forEach((d) => pairs.push({ query: q.id, passage: d, grade: q.judgments[d] })));
  const drawn = shuffle(pairs, g).slice(0, 96);
  // The second rater: the first rater's grade moved by one with probability
  // 0.3 and by two with probability 0.08 (the direction by a further draw),
  // clamped to 0 to 3.
  const a = drawn.map((p) => p.grade);
  const b = drawn.map((p) => {
    const u = g(); const dir = g() < 0.5 ? -1 : 1;
    const step = u < 0.08 ? 2 : u < 0.38 ? 1 : 0;
    return Math.min(3, Math.max(0, p.grade + dir * step));
  });
  const rows = shuffle(CALIB.map((r, i) => i), g).slice(0, 122).sort((x, y) => x - y).map((i) => CALIB[i]);
  return { seed, ratings: { a, b }, calibration: { yTrue: rows.map((r) => r.relevant), probabilities: rows.map((r) => r.probability) } };
})();
const awS = { labels: [0, 1, 2, 3], weights: ['none', 'linear'], bins: 8, edgeRule: 'an interior edge opens the upper bin' };
const awKN = success('AWKA kappa none', EV.cohenKappa({ a: AWKA.ratings.a, b: AWKA.ratings.b, labels: awS.labels }));
const awKL = success('AWKA kappa linear', EV.cohenKappa({ a: AWKA.ratings.a, b: AWKA.ratings.b, labels: awS.labels, weights: 'linear' }));
const awC = success('AWKA calibration 8 bins', EV.calibration({ yTrue: AWKA.calibration.yTrue, probabilities: AWKA.calibration.probabilities, bins: awS.bins }));
const edge8 = AWKA.calibration.probabilities.filter((p) => [1, 2, 3, 4, 5, 6, 7].some((i) => p === i / 8)).length;
must('AWKA: some probabilities sit on an interior edge at eight bins', edge8 > 0, edge8);
must('AWKA: the Murphy identity closes', Math.abs(awC.murphy.closure) < 1e-15, awC.murphy.closure);
must('AWKA: no empty bin', awC.table.every((t) => t.n > 0), awC.table.map((t) => t.n).join());
AWKA.stated = awS;

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'orlu_bm25_idf_pressure', 'score', orIdf.queryTerms[0].idf],
  ['beginner', 'orlu_o1_bm25_top_score', 'score', orTop.ranking[0].score],
  ['beginner', 'orlu_o4_tfidf_top_cosine', 'score', orCos.ranking[0].score],
  ['beginner', 'orlu_bm25_mean_recall_at4', 'metric', orEval.mean.recall],
  ['beginner', 'orlu_bm25_mrr_at4', 'metric', orEval.mean.mrr],
  ['beginner', 'orlu_answers_supported_fraction', 'fraction', orG.supportedFraction],
  ['intermediate', 'nnewi_p_map_at5_grade2', 'metric', nnMapP.mean.map],
  ['intermediate', 'nnewi_q_ndcg_at5_exponential', 'metric', nnExpQ.mean.ndcg],
  ['intermediate', 'nnewi_short_mean_token_f1', 'fraction', nnShortF1],
  ['intermediate', 'nnewi_extraction_macro_f1', 'fraction', nnX.overall.macroF1],
  ['intermediate', 'nnewi_paired_ndcg_upper', 'bound', nnBoot.upper],
  ['intermediate', 'nnewi_q_supported_fraction', 'fraction', nnG.supportedFraction],
  ['advanced', 'awka_kappa_unweighted', 'kappa', awKN.kappa],
  ['advanced', 'awka_kappa_linear', 'kappa', awKL.kappa],
  ['advanced', 'awka_brier', 'brier', awC.brier],
  ['advanced', 'awka_reliability_bins8', 'brier', awC.murphy.reliability],
  ['advanced', 'awka_resolution_bins8', 'brier', awC.murphy.resolution],
  ['advanced', 'awka_wbc_bins8', 'brier', awC.murphy.withinBinCovariance],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite number away from zero`, Number.isFinite(r.value) && Math.abs(r.value) > 1e-3, r.value));
// NEVER GRADE A SMALL INTEGER: a whole number sits inside every guard band.
ROWS.forEach((r) => must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3, r.value));
const byKey = Object.fromEntries(ROWS.map((r) => [r.key, r.value]));

/* ----------------------------------------------------------- the seed check */

// A value read from the bootstrap, on the next seed: it must move by more than
// ten tolerances, so the seed is part of the answer.
const nextSeed = [
  ['nnewi_paired_ndcg_upper', () => EV.pairedBootstrap({ a: ndP, b: ndQ, seed: nnS.bootSeed + 1, nBoot: nnS.nBoot, level: nnS.level }).upper],
];
nextSeed.forEach(([key, f]) => {
  const v = f();
  const d = Math.abs(v - byKey[key]);
  must(`SEED: ${key} on the next seed moves by more than ten tolerances`, d > 10 * gradedTolerance(key), `${v} vs ${byKey[key]}`);
  NOTES.push(`SEED ${key}: the next seed moves it by ${(d / gradedTolerance(key)).toExponential(2)} tolerances`);
});

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d5_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
if (!process.argv.includes('--json') && !process.argv.includes('--inputs')) NOTES.forEach((n) => process.stderr.write(`  ${n}\n`));
process.stderr.write(`d5_capstone: ${ASSERTS.length} label-and-call, scenario, tie, exclusion and seed assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  const strip = (o) => { const c = JSON.parse(JSON.stringify(o)); delete c.idOf; delete c.need; return c; };
  process.stdout.write(`${JSON.stringify({ ORLU: strip(ORLU), NNEWI: strip(NNEWI), AWKA: strip(AWKA) })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 38)}${pad('CLASS', 10)}${pad('VALUE', 20)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 38)}${pad(r.cls, 10)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 20)}${gradedTolerance(r.key)}\n`));
}
