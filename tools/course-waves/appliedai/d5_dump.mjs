// THE D5 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-evaluate.md, the
// oracle, the library pins, the fixture README and the engine's own source
// comments are PROVENANCE. Where FINDINGS quotes a figure (the headline
// retrieval, answer, extraction, kappa and calibration figures) this file
// recomputes it through the engine on the vendored fixtures and prints it, and
// a writer quotes the digest line.
//
// Usage:  sh /root/dai-wip-appliedai/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/dai-wip-appliedai/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF AN ENGINE (evaluate.js, or
// the ml.js logLoss and lib/conventions/percentile.js it calls), except where a
// line says "stated" (an input typed in this file and printed beside the call
// it went into), "fixture" (read from the vendored ekene-docs files) or
// "derived" (arithmetic on engine values or stated inputs printed in the same
// block, with the arithmetic stated). Nothing here reads a clock, a random
// number, a locale or a network; the only random draws are the engine's own
// seeded mulberry32 bootstrap, and TZ and LC_ALL are pinned by build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page, and asserted.
// Two figures that print alike at six decimals are never called equal unless
// the engine says so: the digest prints their difference in exponent form.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names; `success()` asserts no error
// key and every top-level number finite; every claim a sentence makes about a
// table goes through `must()`. If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads d5_capstone.mjs,
// fields.json or the capstone datasets, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.D5_WAVE_DIR || '/root/dai-wip-appliedai';
const ROOT = process.env.D5_ENGINES || '/root/wt-dai-d5-nextgen/packages/engines';
const ENGINE_REL = 'engines/dataai/evaluate.js';
const EV = await import(`${ROOT}/${ENGINE_REL}`);
const ML = await import(`${ROOT}/engines/dataai/ml.js`);
const PCT = await import(`${ROOT}/lib/conventions/percentile.js`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const FIX = (f) => JSON.parse(fs.readFileSync(`${ROOT}/test-data/dataai/ekene-docs/${f}`, 'utf8'));
const MODULES = JSON.parse(execFileSync('python3', [`${HERE}/structure.py`, '--modules'], { encoding: 'utf8' }));

/* ---------------------------------------------------------- the machinery */

const OUT = [];
const w = (s = '') => OUT.push(s);
const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.map(([k, v]) => `${k}=${v}`).join(', ') || 'all finite');
  }
  return r;
};
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned ${JSON.stringify(r).slice(0, 80)}`);
  must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, r && r.field);
  const nums = r ? Object.values(r).filter((v) => typeof v === 'number') : [];
  must(`A REFUSAL CARRIES NO NUMBER: ${label}`, nums.length === 0, nums.join(','));
  must(`THE MESSAGE STARTS WITH THE FIELD'S NAME: ${label}`, r && typeof r.error === 'string' && r.error.startsWith(String(field).replace(/[.[].*$/, '')), r && r.error);
  return r;
};
const f6 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(6));
const eX = (x) => (x === 0 ? '0' : Number(x).toExponential(2));
const list = (a) => a.join(', ');
const S = (x) => String(x);
const sum = (a) => a.reduce((s, v) => s + v, 0);
const nearly = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const key12 = (x) => Number(x.toPrecision(12));

/** Owner clause, rendered from structure.py so a section cannot name a module
 *  that does not teach it. Each owner is "Tier mNN" or "Tier mNN lNN". */
const ownerClause = (owners) => owners.map((o) => {
  const m = o.match(/^(Associate|Professional|Expert) (m\d{2})(?: (l\d{2}))?$/);
  if (!must(`owner "${o}" is well formed`, !!m, o)) return o;
  const mod = MODULES[m[1]] && MODULES[m[1]][m[2]];
  must(`owner "${o}" names a module structure.py has`, !!mod, o);
  if (m[3]) must(`owner "${o}" names a lesson structure.py has`, mod && mod.lessons.includes(m[3]), o);
  return o;
}).join(' and ');
// THE SECTION ORDER, declared once, so a sentence can name a later section by
// key and never by a typed number that goes stale when a section is inserted.
const ORDER = ['computes', 'dataset', 'refusals', 'graded', 'tokens', 'tfidf', 'bm25', 'ranking', 'atk', 'claims',
  'ap', 'ndcg', 'answers', 'extraction', 'grounded', 'compare',
  'kappa', 'calibration', 'murphy', 'judged', 'boundaries', 'caps', 'choices',
  'vocabulary'];
const refCap = (k) => { const r = ref(k); return r[0].toUpperCase() + r.slice(1); };
const ref = (k) => {
  const i = ORDER.indexOf(k);
  must(`a sentence refers to a declared section ${k}`, i >= 0, k);
  return `section ${i + 1}`;
};
let SECTION = 0;
const OWNED = new Set();
const section = (k, title, owners) => {
  SECTION += 1;
  must(`section ${k} is declared at position ${SECTION}`, ORDER[SECTION - 1] === k, `${ORDER[SECTION - 1]} at ${SECTION}`);
  owners.forEach((o) => OWNED.add(o.split(' ').slice(0, 2).join(' ')));
  w();
  w(`# SECTION ${SECTION}: ${title} (owned by ${ownerClause(owners)})`);
  w();
};
const table = (head, rows) => {
  w(`| ${head.join(' | ')} |`);
  w(`| ${head.map(() => '---').join(' | ')} |`);
  rows.forEach((r) => w(`| ${r.join(' | ')} |`));
};
const PLANT_FOUND = new Map();

/* ---------------------------------------------------------- the fixtures */

const CORPUS = FIX('corpus.json');
const QUERIES = FIX('queries.json');
const SYSTEMS = FIX('systems.json');
const EXTRACT = FIX('extraction.json');
const CALIB = FIX('calibration.json');
const PASS = CORPUS.passages;
const DOCS = PASS.map((p) => ({ id: p.id, text: p.text }));
const TEXT = Object.fromEntries(PASS.map((p) => [p.id, p.text]));
const QS = QUERIES.queries;
const QTEXT = Object.fromEntries(QS.map((q) => [q.id, q.text]));
const QLIST = QS.map((q) => ({ id: q.id, text: q.text }));
const J = Object.fromEntries(QS.map((q) => [q.id, q.judgments]));
const J2 = Object.fromEntries(QS.map((q) => [q.id, q.secondAnnotator]));
const REF = Object.fromEntries(QS.map((q) => [q.id, q.reference]));
const SYS = Object.fromEntries(SYSTEMS.systems.map((s) => [s.id, s]));
const ANS = (s) => Object.fromEntries(SYS[s].answers.map((a) => [a.query, a]));
const RUNS = (s) => Object.fromEntries(SYS[s].answers.map((a) => [a.query, a.retrieved]));
const ANSWERS = (s) => SYS[s].answers.map((a) => ({ query: a.query, text: a.text, citations: a.citations }));
const FIELDS = EXTRACT.fields;
const LABELS = EXTRACT.labels;
const PRED = EXTRACT.predictions;
const Y = CALIB.rows.map((r) => r.relevant);
const P = CALIB.rows.map((r) => r.probability);

// Stated teaching inputs, each passed to the engine AND printed from here, so
// the prose cannot drift from the call.
const K = 5; // the teaching cutoff: both fixed systems retrieve their top 5
const SEED = 7; // the teaching bootstrap seed
const NBOOT = 2000; // the teaching replicate count (the engine default, asserted)
const TOL = 0.002; // the teaching numericRelTol that lets a rounded figure stand
// THE HAND SET, stated: five short passages small enough to score on paper.
const HAND = [
  { id: 'd1', text: 'Oil rate 120 bopd at Ekene-1. Oil rate fell.' },
  { id: 'd2', text: 'Water injection at Ekene-2 started on 2023-01-01.' },
  { id: 'd3', text: 'Oil and water rates were tested; the oil rate was 150 bopd.' },
  { id: 'd4', text: 'Pressure survey: 2,096 psia.' },
  { id: 'd5', text: '' },
];
const HAND_Q = 'oil rate';
const KD = EV.DEFAULTS; // the engine defaults a sentence names are substituted from here
const K1_ALT = 2; // the stated second k1 of the k1 comparison
const NT_B = 1e-7; // the stated b of the near-tie passages
const K_WIDE = 10; // the stated cutoff of the run outside the pool
const B_THIRD = 0.4; // the stated b of the third run
const XT_TOL = { qRel: 0.01, pAbs: 2, pRel: 0.001 }; // the stated tolerances of the tolerance records
const CW = { p: [0.61, 0.62, 0.64, 0.66, 0.68, 0.69], y: [1, 0, 1, 0, 1, 1] }; // the stated within-bin rows
const SEED_MAX = 2 ** 32 - 1; // the largest 32-bit seed
const GRADE_BAD = [-1, 2.5, KD.MAX_GRADE + 1]; // stated grades the engine refuses
// STATED TEXT PROBES: strings handed to the engine by the sections below, typed once here.
const PROBE = {
  stated: 'Ekene-1 made 120 bopd; the survey read 2,096 psia on 2023-01-01, a "water injection" start, and 45% water, -2 skin.',
  coin: 'The spill was 5 bbl.',
  tol: 'about 2,100 psia',
  comma: '12,1234 and 12,123',
  minus: 'skin -2 at Ekene-2',
  date: 'on 2023-01-01 and 2023-01-01x',
  noFigure: 'No passage says so.',
  repeated: 'oil oil rate',
  multiset: ['oil oil water', 'oil water water'],
};
// The engine rounds each bootstrap tail to this many decimals, read from its source.
const TAIL_DECIMALS = Math.log10(Number((ENGINE_SRC.match(/\(1 - level\) \/ 2\) \* (1e\d+)\)/) || [])[1]));

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# D5 TEACHING DIGEST: Applied AI and Language Models');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle, the library pins, the fixture README and the engine source comments are PROVENANCE and not teaching truth.');
w();
w(`# PRECISION. Every score, idf, weight, cosine, term contribution, average length, metric (precision, recall, hit rate, reciprocal rank, average precision, DCG, nDCG and their means), F1, accuracy, fraction, agreement, kappa, probability, Brier score and each of its terms, calibration error, log loss, bootstrap mean, bound, difference, share and standard error prints to SIX decimals; counts, ranks, grades, lengths, seeds, replicates and bins are whole numbers; the ${KD.TIE_DIGITS}-digit tie key prints at twelve significant digits where the tie rule is shown; very small magnitudes print in exponent form; an engine message is printed verbatim, figures and all.`);
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines f50251d, ${engineLines} lines. It imports lib/stats (mulberry32 and quantile), lib/conventions/percentile.js (parameterPercentileLabel) and, from engines/dataai/ml.js, logLoss. It runs no language model and makes no network call.`);
w();
w('# THE DATA. Every Ekene document, query, judgment, answer, label and probability is SYNTHETIC, written for this platform by a stated script, and no language model wrote or scores any of it. No real company, person or incident appears.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone dataset and no graded answer. The capstones run their own datasets and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming its convention, so the working can be printed.');
w();
const EXPORTS = [
  ['tokenize', 'tokens', 'text, stopWords', 'the tokens of one text, their count and how many the stop list removed'],
  ['tfidfVectors', 'TF-IDF', 'documents, stopWords, sublinearTf', 'the vocabulary, each term\'s document frequency and idf, and every document\'s unit-length weight vector'],
  ['rankTfidf', 'TF-IDF', 'documents, query, k, stopWords, sublinearTf', 'the query vector, the terms dropped as outside the vocabulary, and the top k by cosine with each term\'s two weights'],
  ['rankBm25', 'BM25', 'documents, query, k, k1, b, stopWords', 'N, avgdl, each query term\'s df and idf, and the top k with each matched term\'s tf and contribution'],
  ['retrieve', 'ranking', 'documents, queries, method, k, k1, b, stopWords, sublinearTf', 'one ranked list per query, with its ties and whether the cutoff falls inside a tie'],
  ['retrievalMetrics', 'retrieval scoring', 'ranking, judgments, k, relevantGrade, gain', 'precision, recall, hit, reciprocal rank, average precision, DCG, ideal DCG and nDCG at k for one ranked list'],
  ['evaluateRetrieval', 'retrieval scoring', 'runs, judgments, k, relevantGrade, gain, noRelevant', 'the per-query metrics, their means over queries, and the queries excluded or zeroed with the reason'],
  ['normalizeAnswer', 'short answers', 'text', 'the SQuAD normalisation of one string and its tokens'],
  ['answerMatch', 'short answers', 'prediction, truth', 'exact match and token F1 of one answer against the truth'],
  ['scoreExtraction', 'extraction', 'labels, predictions, fields', 'every cell\'s outcome with its reason, per-field and overall tallies, accuracy, precision, recall and F1, micro and macro'],
  ['checkGroundedness', 'groundedness', 'answer, citations, documents, retrieved, numericRelTol', 'one answer\'s claims, each supported or unsupported with its reason, and the citation flags'],
  ['checkAnswers', 'groundedness', 'answers, documents, runs, numericRelTol', 'the same for a set of answers, with the pooled supported fraction'],
  ['cohenKappa', 'agreement', 'a, b, labels, weights', 'the confusion counts, observed and expected agreement and Cohen\'s kappa, unweighted or weighted'],
  ['calibration', 'calibration', 'yTrue, probabilities, bins, eps', 'the Brier score, the reliability table, ECE, MCE, the Murphy decomposition with its closure, and log loss'],
  ['bootstrapMean', 'uncertainty', 'values, nBoot, seed, level', 'a seeded percentile bootstrap interval of a mean, its labels and its standard error'],
  ['pairedBootstrap', 'comparison', 'a, b, nBoot, seed, level, paired', 'the difference of two means with a seeded percentile interval and the share of replicates at or below 0'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof EV[name] === 'function', typeof EV[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(EV).filter((k) => typeof EV[k] === 'function').length === EXPORTS.length,
  Object.keys(EV).filter((k) => typeof EV[k] === 'function').join(','));
w();
w('The stated defaults, read from the exported `DEFAULTS`:');
w();
const DSRC = {
  K1: 'BM25 term saturation when k1 is left out',
  B: 'BM25 length normalisation when b is left out',
  K: 'the cutoff when k is left out',
  RELEVANT_GRADE: 'the lowest grade that counts as relevant when relevantGrade is left out',
  MAX_GRADE: 'the highest judged grade accepted',
  TIE_DIGITS: 'the significant digits at which two scores tie',
  BINS: 'the calibration bins when bins is left out',
  MAX_BINS: 'the most calibration bins accepted',
  N_BOOT: 'the bootstrap replicates when nBoot is left out',
  MAX_BOOT: 'the most bootstrap replicates accepted',
  LEVEL: 'the interval level when level is left out',
  LEVELS: 'the interval levels accepted',
  MAX_DOCS: 'the most documents one call accepts',
  MAX_CHARS: 'the most characters in one text',
  MAX_QUERIES: 'the most queries one call accepts',
  MAX_K: 'the largest cutoff accepted',
  MAX_RECORDS: 'the most extraction records accepted',
  MAX_FIELDS: 'the most extraction fields accepted',
  MAX_ANSWERS: 'the most answers one groundedness call accepts',
  MAX_ROWS: 'the most calibration rows or rating pairs accepted',
  MAX_LABELS: 'the most kappa labels accepted',
  MAX_VALUES: 'the most values one bootstrap accepts',
};
const dval = (v) => (Array.isArray(v) ? list(v.map(S)) : S(v));
table(['default', 'value', 'what it sets'], Object.entries(EV.DEFAULTS).map(([k, v]) => [`\`${k}\``, dval(v), DSRC[k]]));
must('DEFAULTS carries twenty-two values, each described here', Object.keys(EV.DEFAULTS).length === 22 && Object.keys(EV.DEFAULTS).every((k) => DSRC[k]), Object.keys(EV.DEFAULTS));
must('DEFAULTS is frozen', Object.isFrozen(EV.DEFAULTS), 'frozen');
must('the stop list is exported and frozen with 318 words', Object.isFrozen(EV.ENGLISH_STOP_WORDS) && EV.ENGLISH_STOP_WORDS.length === 318, EV.ENGLISH_STOP_WORDS.length);
w();
w(`\`ENGLISH_STOP_WORDS\` is also exported: ${EV.ENGLISH_STOP_WORDS.length} words, scikit-learn's list (BSD-3-Clause), sorted.`);
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports and its source:');
const IMPORTS = [...ENGINE_SRC.matchAll(/^import .* from \x27([^\x27]+)\x27;$/gm)].map((m) => m[1]);
must('the engine imports exactly lib/stats, the percentile convention and ml.js', IMPORTS.join() === '../../lib/stats/stats.js,../../lib/conventions/percentile.js,./ml.js', IMPORTS.join());
must('the engine source makes no network call and loads no module at run time', !/\bfetch\x28|XMLHttpRequest|\bimport\x28|require\x28/.test(ENGINE_SRC), 'none');
must('no export generates text, embeds or calls a model', !Object.keys(EV).some((k) => /generat|embed|model|llm|chat|complet|prompt|rerank|dense|vector(?!s)/i.test(k)), Object.keys(EV).join(','));
must('no export stems a word', !Object.keys(EV).some((k) => /stem|lemma/i.test(k)), 'none');
w('- It runs no language model. It writes no answer, embeds no text, reranks nothing and asks no model to judge an answer. Its imports are, in full: lib/stats/stats.js, lib/conventions/percentile.js and engines/dataai/ml.js; its source makes no network call.');
w('- It retrieves by words alone. TF-IDF and BM25 match tokens; there is no dense (embedding) retrieval, no synonym list and no stemming, so "producing" and "produced" are different tokens.');
w('- It checks a claim by finding it in a passage. It does not decide whether an answer is true, only whether the answer\'s numbers, dates and quotes appear in the passages it cites.');
w('- It reads no probability of its own. The calibration set\'s probabilities are given inputs; fitting the classifier that made them is the machine learning course\'s subject.');
w(`- Its exported names are, in full: ${Object.keys(EV).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('dataset', 'The Ekene document set, its queries, its two systems and what is planted in them', ['Associate m01', 'Professional m06', 'Expert m04']);
w('Every document, query, judgment, answer, label and probability in this course comes from five fixture files under test-data/dataai/ekene-docs, written by a stated script that reproduces them byte for byte. The Ekene field is synthetic, and every figure a passage shares with the platform\'s other Ekene data (rates, pressures, fluid properties, well tops) is read from that data at a stated rounding.');
w();
const TYPES = {};
PASS.forEach((p) => { TYPES[p.type] = (TYPES[p.type] || 0) + 1; });
w(`THE CORPUS. ${PASS.length} passages, ${PASS[0].id} to ${PASS[PASS.length - 1].id}, each with an id, a type, a well where one applies, a date where one applies, a title and a text. The engine indexes the text alone.`);
w();
table(['passage type (fixture)', 'passages'], Object.entries(TYPES).map(([t, n]) => [t, S(n)]));
must('the corpus has 60 passages', PASS.length === 60, PASS.length);
must('EKD-058 is an exact copy of EKD-046', TEXT['EKD-058'] === TEXT['EKD-046'], 'text');
w();
w('EKD-058 is an exact copy of EKD-046 (a spill note filed twice), so every method scores the two alike and the tie rule decides their order.');
w();
const lensB = success('bm25 on the corpus for the corpus statistics', EV.rankBm25({ documents: DOCS, query: 'oil' }));
const vec = success('tfidfVectors on the corpus', EV.tfidfVectors({ documents: DOCS }));
w(`Across the corpus the passages carry ${sum(vec.vectors.map((v) => v.length))} tokens, a mean of ${f6(lensB.avgdl)} (the BM25 avgdl), from ${Math.min(...vec.vectors.map((v) => v.length))} to ${Math.max(...vec.vectors.map((v) => v.length))} tokens a passage, and a vocabulary of ${vec.vocabulary.length} distinct tokens.`);
must('avgdl is the token total over N', nearly(lensB.avgdl, sum(vec.vectors.map((v) => v.length)) / 60), lensB.avgdl);
w();
w(`THE QUERIES. ${QS.length} queries, ${QS[0].id} to ${QS[QS.length - 1].id}, each with a short reference answer and judgments on a four-grade scale (fixture): ${Object.entries(QUERIES.grades).sort((a, b) => b[0] - a[0]).map(([g, d]) => `${g} ${d}`).join(', ')}. Pooling (fixture): ${QUERIES.pooling}.`);
w();
const gradeCount = (j, g) => Object.values(j).filter((x) => x === g).length;
table(['query', 'text', 'judged', 'grade 3', 'grade 2', 'grade 1', 'grade 0', 'reference answer (fixture)'],
  QS.map((q) => [q.id, q.text, S(Object.keys(q.judgments).length), ...[3, 2, 1, 0].map((g) => S(gradeCount(q.judgments, g))), q.reference === '' ? '(empty)' : q.reference]));
const nPairs = sum(QS.map((q) => Object.keys(q.judgments).length));
w();
w(`${nPairs} (query, passage) pairs are judged. Q24 has no passage judged above 0 and an empty reference: nothing in the corpus answers it.`);
must('183 judged pairs', nPairs === 183, nPairs);
must('Q24 has no judged grade above 0', Object.values(J.Q24).every((g) => g === 0), JSON.stringify(J.Q24));
w();
w(`A SECOND ANNOTATOR graded every judged pair again (fixture: ${QUERIES.secondAnnotator}). The agreement between the two is measured in ${ref('kappa')}.`);
w();
w(`THE TWO SYSTEMS. Two fixed systems answered every query. Each retrieved its top ${SYSTEMS.systems[0].retriever.k} passages, wrote an answer text citing passage ids, and gave a short answer. The answer texts are hand-written fixture text: no model produced them, at build time or at run time.`);
w();
table(['system', 'retriever (fixture)', 'answers'], SYSTEMS.systems.map((s) => [s.id, `${s.retriever.method} k ${s.retriever.k}${s.retriever.method === 'bm25' ? ` k1 ${s.retriever.k1} b ${s.retriever.b}` : ''}, stop list ${s.retriever.stopWords ? 'on' : 'off'}`, S(s.answers.length)]));
const rA = success('retrieve bm25 k 5 on every query', EV.retrieve({ documents: DOCS, queries: QLIST, method: 'bm25', k: K }));
const rB = success('retrieve tfidf k 5 on every query', EV.retrieve({ documents: DOCS, queries: QLIST, method: 'tfidf', k: K }));
must('system A\'s retrieved lists are exactly the engine\'s BM25 top 5', SYS.A.answers.every((a) => JSON.stringify(a.retrieved) === JSON.stringify(rA.runs[a.query])), 'A');
must('system B\'s retrieved lists are exactly the engine\'s TF-IDF top 5', SYS.B.answers.every((a) => JSON.stringify(a.retrieved) === JSON.stringify(rB.runs[a.query])), 'B');
w();
w(`Each system's retrieved lists are exactly what \`retrieve\` returns on the corpus with that method, k ${K} and the other settings at their defaults (checked on all ${QS.length} queries for both systems).`);
w();
w(`THE EXTRACTION SET. ${FIELDS.length} fields, ${LABELS.length} labelled records (one per source passage, the record id is the passage id), and both systems' predictions. Fixture: ${EXTRACT.description}`);
w();
table(['field', 'type', 'absTol (fixture)'], FIELDS.map((f) => [f.name, f.type, f.absTol === undefined ? 'none' : S(f.absTol)]));
w();
w(`THE CALIBRATION SET. ${CALIB.rows.length} (query, passage) rows (fixture: ${CALIB.description}), each with a probability given to 2 decimals and an outcome, 1 when the judged grade is 2 or 3.`);
must('200 calibration rows', CALIB.rows.length === 200, CALIB.rows.length);
w();
w('THE PLANTED DEFECTS, every item stated by the fixture record. Each is found by the named engine behaviour, the section that finds it asserts so, and the build fails if any is not found.');
w();
const PLANTED = [
  ['EKD-058 duplicates EKD-046', 'corpus', 'the same text filed twice', `the tie rule (${ref('ranking')})`],
  ['a query nothing answers', 'Q24', 'no passage judged above 0', `the no-relevant rule (${ref('ap')})`],
  ['a lexical trap', 'Q14', 'the answers say "no water" and "water free", the query says "producing water"', `hit 0 at 5 for BM25 (${ref('atk')})`],
  ['an oil column from an unretrieved passage', 'A Q06', '20.3 m is in EKD-007, neither cited nor retrieved', `an unsupported claim (${ref('claims')})`],
  ['"the end of 2025" read as a number', 'A Q13', 'the year becomes the claim 2025', `an unsupported claim (${ref('grounded')})`],
  ['a correct abstention', 'A Q24', 'an empty short answer to a query nothing answers', `exact match on two empty answers (${ref('answers')})`],
  ['no answer where retrieval failed', 'A Q14', 'an empty short answer', `token F1 0 (${ref('answers')})`],
  ['a rounded figure', 'B Q01', '2,100 psia for 2,096', `unsupported at numericRelTol 0, supported at ${S(TOL)} (${ref('grounded')})`],
  ['a unit change', 'B Q07', '12.1 million stb for 12,139,208 stb', `an unsupported claim in no passage (${ref('grounded')})`],
  ['figures from an uncited passage', 'B Q03 and B Q12', 'rates from EKD-034 and depths from EKD-038', `the reason names where the figure is (${ref('grounded')})`],
  ['a wrong date that is still supported', 'B Q05', '2024-09-01 is in the cited EKD-027, about another well', `supported, yet exact match false (${ref('grounded')})`],
  ['a citation that was not retrieved', 'B Q15', 'EKD-059 cited, outside the top 5', `a notRetrieved flag (${ref('grounded')})`],
  ['an unknown citation', 'B Q21', 'EKD-061 is not a passage', `an unknown flag (${ref('grounded')})`],
  ['a fabricated event', 'B Q24', 'a subsea tree replaced on 2024-03-01', `an unsupported date (${ref('grounded')})`],
  ['a missed 0 water cut', 'A EKD-020', 'water cut left empty', `the outcome missed (${ref('extraction')})`],
  ['another well\'s water cut', 'A EKD-027', 'Ekene-6\'s 3.7 percent on an Ekene-3 record', `the outcome unsupported (${ref('extraction')})`],
  ['a wellhead pressure as reservoir pressure', 'A EKD-036', '2,289 psi wellhead', `the outcome unsupported (${ref('extraction')})`],
  ['"near-miss" for "near miss"', 'A EKD-044', 'the hyphen joins the words', `the outcome wrong (${ref('extraction')})`],
  ['"Ekene 3" for "Ekene-3"', 'B EKD-003', 'a space for the hyphen', `the outcome wrong (${ref('extraction')})`],
  ['"150 bopd" in a number field', 'B EKD-003', 'a unit inside a number', `the outcome wrong, the reason quoting the plain-number rule (${ref('extraction')})`],
  ['two records not returned', 'B EKD-053 and EKD-056', 'no prediction for either', `scored as all empty (${ref('extraction')})`],
  ['values from the wrong well', 'B EKD-013 and EKD-029', 'a well on a field survey, Ekene-6\'s water cut on Ekene-1', `the outcome unsupported (${ref('extraction')})`],
];
table(['what', 'where', 'how it was planted (fixture)', 'the engine behaviour that finds it'], PLANTED);
w();
w(`${PLANTED.length} items are planted.`);
const planted = (i, cond, detail) => {
  must(`PLANTED DEFECT FOUND: ${PLANTED[i][0]} (${PLANTED[i][1]})`, cond, detail);
  PLANT_FOUND.set(i, !!cond);
};

/* ============================================================ SECTION 3 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m03', 'Associate m04', 'Associate m05', 'Professional m01', 'Professional m02', 'Professional m03', 'Professional m04', 'Professional m05', 'Professional m06', 'Expert m01', 'Expert m02', 'Expert m03', 'Expert m05']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number of its own: any figure in it is part of the message.');
w();
const D2 = DOCS.slice(0, 2);
const LONG = 'x'.repeat(EV.DEFAULTS.MAX_CHARS + 1);
const MANY_DOCS = Array.from({ length: EV.DEFAULTS.MAX_DOCS + 1 }, (_, i) => ({ id: `n${i}`, text: 'oil' }));
const MANY_Q = Array.from({ length: EV.DEFAULTS.MAX_QUERIES + 1 }, (_, i) => ({ id: `q${i}`, text: 'oil' }));
const XF = [{ name: 'well', type: 'text' }, { name: 'rate', type: 'number', absTol: 0.05 }];
const XL = [{ id: 'r1', fields: { well: 'Ekene-1', rate: 120 } }];
const REFUSALS = [
  ['tokenize', { text: 42 }, 'text', 'a number where the text belongs'],
  ['tokenize', { text: LONG }, 'text', `a text of ${EV.DEFAULTS.MAX_CHARS + 1} characters`],
  ['tokenize', { text: 'oil rate', stopWords: 'yes' }, 'stopWords', 'a word where true or false belongs'],
  ['rankBm25', { documents: [], query: 'oil' }, 'documents', 'no documents'],
  ['rankBm25', { documents: 'EKD-001', query: 'oil' }, 'documents', 'a passage id where the documents belong'],
  ['rankBm25', { documents: [{ id: 'EKD-001', text: TEXT['EKD-001'] }, { id: 'EKD-001', text: TEXT['EKD-002'] }], query: 'oil' }, 'documents[1].id', 'the same id twice'],
  ['rankBm25', { documents: [{ id: '', text: 'oil' }], query: 'oil' }, 'documents[0].id', 'an empty id'],
  ['rankBm25', { documents: [{ id: 'EKD-001', text: 120 }], query: 'oil' }, 'documents[0].text', 'a number where the text belongs'],
  ['rankBm25', { documents: [{ id: 'd1', text: LONG }], query: 'oil' }, 'documents[0].text', `a passage of ${EV.DEFAULTS.MAX_CHARS + 1} characters`],
  ['rankBm25', { documents: MANY_DOCS, query: 'oil' }, 'documents', `${EV.DEFAULTS.MAX_DOCS + 1} documents`],
  ['rankBm25', { documents: D2, query: 7 }, 'query', 'a number where the query belongs'],
  ['rankBm25', { documents: D2, query: 'oil', k: 0 }, 'k', 'k of 0'],
  ['rankBm25', { documents: D2, query: 'oil', k: 2.5 }, 'k', 'k of 2.5'],
  ['rankBm25', { documents: D2, query: 'oil', k: EV.DEFAULTS.MAX_K + 1 }, 'k', `k of ${EV.DEFAULTS.MAX_K + 1}`],
  ['rankBm25', { documents: D2, query: 'oil', k1: -0.5 }, 'k1', 'k1 of -0.5'],
  ['rankBm25', { documents: D2, query: 'oil', b: 1.5 }, 'b', 'b of 1.5'],
  ['rankBm25', { documents: [{ id: 'd1', text: '-- , .' }], query: 'oil' }, 'documents', 'a corpus of punctuation only'],
  ['rankBm25', { documents: [{ id: 'd1', text: 'the well top' }], query: 'oil', stopWords: true }, 'documents', 'a corpus of stop words, stop list on'],
  ['tfidfVectors', { documents: [{ id: 'd1', text: '' }] }, 'documents', 'one empty passage'],
  ['rankTfidf', { documents: D2, query: 'oil', sublinearTf: 'yes' }, 'sublinearTf', 'a word where true or false belongs'],
  ['retrieve', { documents: DOCS, queries: QLIST, method: 'dense' }, 'method', 'a method it does not offer'],
  ['retrieve', { documents: DOCS, queries: QLIST, method: 'tfidf', k1: 1.2 }, 'k1', 'k1 on tfidf'],
  ['retrieve', { documents: DOCS, queries: QLIST, method: 'tfidf', b: 0.75 }, 'b', 'b on tfidf'],
  ['retrieve', { documents: DOCS, queries: QLIST, method: 'bm25', sublinearTf: true }, 'sublinearTf', 'sublinearTf on bm25'],
  ['retrieve', { documents: DOCS, queries: [], method: 'bm25' }, 'queries', 'no queries'],
  ['retrieve', { documents: DOCS, queries: [QLIST[0], { id: 'Q01', text: 'oil' }], method: 'bm25' }, 'queries[1].id', 'Q01 twice'],
  ['retrieve', { documents: DOCS, queries: [{ id: 'Q01', text: null }], method: 'bm25' }, 'queries[0].text', 'a null query text'],
  ['retrieve', { documents: DOCS, queries: MANY_Q, method: 'bm25' }, 'queries', `${EV.DEFAULTS.MAX_QUERIES + 1} queries`],
  ['retrievalMetrics', { ranking: 'EKD-018', judgments: J.Q01 }, 'ranking', 'one id where a list belongs'],
  ['retrievalMetrics', { ranking: ['EKD-018', 'EKD-002', 'EKD-018'], judgments: J.Q01 }, 'ranking[2]', 'a passage ranked twice'],
  ['retrievalMetrics', { ranking: ['EKD-018'], judgments: { 'EKD-018': 2.5 } }, 'judgments.EKD-018', 'a grade of 2.5'],
  ['retrievalMetrics', { ranking: ['EKD-018'], judgments: { 'EKD-018': EV.DEFAULTS.MAX_GRADE + 1 } }, `judgments.EKD-018`, `a grade of ${EV.DEFAULTS.MAX_GRADE + 1}`],
  ['retrievalMetrics', { ranking: ['EKD-018'], judgments: J.Q01, relevantGrade: 0 }, 'relevantGrade', 'relevantGrade of 0'],
  ['retrievalMetrics', { ranking: ['EKD-018'], judgments: J.Q01, gain: 'log' }, 'gain', 'a gain it does not offer'],
  ['evaluateRetrieval', { runs: RUNS('A'), judgments: {} }, 'judgments', 'no judged query'],
  ['evaluateRetrieval', { runs: { Q02: RUNS('A').Q02 }, judgments: { Q01: J.Q01, Q02: J.Q02 } }, 'runs', 'a judged query with no ranking'],
  ['evaluateRetrieval', { runs: { Q01: RUNS('A').Q01, Q99: [] }, judgments: { Q01: J.Q01 } }, 'runs.Q99', 'a ranked query with no judgments'],
  ['evaluateRetrieval', { runs: RUNS('A'), judgments: J, noRelevant: 'drop' }, 'noRelevant', 'a rule it does not offer'],
  ['normalizeAnswer', { text: null }, 'text', 'no text'],
  ['answerMatch', { prediction: 2096, truth: '2,096 psia' }, 'prediction', 'a number where the answer text belongs'],
  ['scoreExtraction', { labels: XL, predictions: [], fields: [] }, 'fields', 'no fields'],
  ['scoreExtraction', { labels: XL, predictions: [], fields: [{ name: 'date', type: 'date' }] }, 'fields[0].type', 'a type it does not offer'],
  ['scoreExtraction', { labels: XL, predictions: [], fields: [{ name: 'well', type: 'text', absTol: 1 }] }, 'fields[0].absTol', 'a tolerance on a text field'],
  ['scoreExtraction', { labels: XL, predictions: [], fields: [{ name: 'rate', type: 'number', relTol: -0.1 }] }, 'fields[0].relTol', 'a negative relTol'],
  ['scoreExtraction', { labels: [], predictions: [], fields: XF }, 'labels', 'no labelled record'],
  ['scoreExtraction', { labels: [{ id: 'r1', fields: { rate: '120' } }], predictions: [], fields: XF }, 'labels[0].fields.rate', 'a label number given as text'],
  ['scoreExtraction', { labels: XL, predictions: [{ id: 'r9', fields: {} }], fields: XF }, 'predictions[0].id', 'a prediction for an unlabelled record'],
  ['scoreExtraction', { labels: XL, predictions: [{ id: 'r1', fields: { choke: '32/64' } }], fields: XF }, 'predictions[0].fields.choke', 'a field that is not declared'],
  ['checkGroundedness', { answer: 'Rate was 120 bopd.', citations: 'EKD-001', documents: DOCS }, 'citations', 'one id where a list belongs'],
  ['checkGroundedness', { answer: 'Rate was 120 bopd.', citations: [''], documents: DOCS }, 'citations[0]', 'an empty citation'],
  ['checkGroundedness', { answer: 'Rate was 120 bopd.', citations: ['EKD-001'], documents: DOCS, numericRelTol: 1 }, 'numericRelTol', 'numericRelTol of 1'],
  ['checkAnswers', { answers: [], documents: DOCS }, 'answers', 'no answers'],
  ['checkAnswers', { answers: [ANSWERS('A')[0], ANSWERS('A')[0]], documents: DOCS }, 'answers[1].query', 'two answers to Q01'],
  ['checkAnswers', { answers: ANSWERS('A'), documents: DOCS, runs: { Q01: RUNS('A').Q01 } }, 'runs', 'runs for Q01 alone'],
  ['cohenKappa', { a: [], b: [] }, 'a', 'no ratings'],
  ['cohenKappa', { a: [3, 2, 1], b: [3, 2] }, 'b', 'three ratings against two'],
  ['cohenKappa', { a: [3, 2], b: [3, 2], weights: 'cubic' }, 'weights', 'a weighting it does not offer'],
  ['cohenKappa', { a: [3, 'high'], b: [3, 2] }, 'a[1]', 'a word among number ratings'],
  ['cohenKappa', { a: ['high', 'low'], b: ['low', 'low'], weights: 'linear' }, 'labels', 'linear weights on words with no label order'],
  ['cohenKappa', { a: [0, 1], b: [1, 1], labels: [0, 1, 1] }, 'labels[2]', 'a label listed twice'],
  ['cohenKappa', { a: [0, 3], b: [1, 1], labels: [0, 1, 2] }, 'a[1]', 'a rating outside the labels'],
  ['calibration', { yTrue: [], probabilities: [] }, 'yTrue', 'no outcomes'],
  ['calibration', { yTrue: [1, 2], probabilities: [0.9, 0.8] }, 'yTrue[1]', 'an outcome of 2 (a grade where an outcome belongs)'],
  ['calibration', { yTrue: [1, 0], probabilities: [0.9] }, 'probabilities', 'two outcomes and one probability'],
  ['calibration', { yTrue: [1, 0], probabilities: [0.9, 1.2] }, 'probabilities[1]', 'a probability of 1.2'],
  ['calibration', { yTrue: [1, 0], probabilities: [0.9, 0.2], bins: 0 }, 'bins', 'no bins'],
  ['calibration', { yTrue: [1, 0], probabilities: [0.9, 0.2], bins: EV.DEFAULTS.MAX_BINS + 1 }, 'bins', `${EV.DEFAULTS.MAX_BINS + 1} bins`],
  ['calibration', { yTrue: [1, 0], probabilities: [0.9, 0.2], eps: 0.5 }, 'eps', 'eps of 0.5, passed to ml.js logLoss'],
  ['bootstrapMean', { values: [0.8], seed: SEED }, 'values', 'one value'],
  ['bootstrapMean', { values: [0.8, null], seed: SEED }, 'values[1]', 'a null value'],
  ['bootstrapMean', { values: [0.8, 0.6] }, 'seed', 'no seed'],
  ['bootstrapMean', { values: [0.8, 0.6], seed: -1 }, 'seed', 'a seed of -1'],
  ['bootstrapMean', { values: [0.8, 0.6], seed: SEED, nBoot: 0 }, 'nBoot', 'no replicates'],
  ['bootstrapMean', { values: [0.8, 0.6], seed: SEED, level: 0.5 }, 'level', 'a level of 0.5'],
  ['pairedBootstrap', { a: [0.8, 0.6, 0.7], b: [0.5, 0.9], seed: SEED }, 'b', 'three values against two'],
  ['pairedBootstrap', { a: [0.8, 0.6], b: [0.5, 0.9], seed: SEED, paired: 'yes' }, 'paired', 'a word where true or false belongs'],
];
const REFROWS = REFUSALS.map(([fn, args, field, what]) => {
  const r = refusal(`${fn} ${what}`, EV[fn](args), field);
  return [`\`${fn}\``, what, `\`${field}\``, r && r.error ? r.error.replace(/\|/g, '\\|') : '(no refusal)'];
});
table(['function', 'the input', 'field named', 'message (verbatim)'], REFROWS);
const FNS = new Set(REFUSALS.map((r) => r[0]));
w();
w(`${REFUSALS.length} refusals across ${FNS.size} functions.`);
must('every exported function has at least one refusal row', EXPORTS.every(([n]) => FNS.has(n) || ['rankTfidf', 'tfidfVectors'].includes(n)) && FNS.size >= 14, [...FNS].join(','));
w();
w('A RESULT WITH A NOTE IS NOT A REFUSAL. These calls succeed; the engine returns the result with the reason beside the value it could not give:');
w();
const NOTES = [];
const noteRow = (fn, what, r, where, text) => { success(`${fn} ${what}`, r); must(`the note is present: ${fn} ${what}`, typeof text === 'string' && text.length > 0, text); NOTES.push([`\`${fn}\``, what, where, text]); };
const nt1 = EV.rankBm25({ documents: DOCS, query: '?!' }); noteRow('rankBm25', 'a query of punctuation only', nt1, '`note`', nt1.note);
const nt2 = EV.rankBm25({ documents: DOCS, query: 'helicopter' }); noteRow('rankBm25', 'the query helicopter', nt2, '`note`', nt2.note);
const nt3 = EV.rankTfidf({ documents: DOCS, query: 'helicopter' }); noteRow('rankTfidf', 'the query helicopter', nt3, '`note`', nt3.note);
const nt4 = EV.retrievalMetrics({ ranking: RUNS('A').Q24, judgments: J.Q24, k: K }); noteRow('retrievalMetrics', 'system A on Q24', nt4, '`notes.recall`', nt4.notes.recall);
noteRow('retrievalMetrics', 'system A on Q24', nt4, '`notes.averagePrecision`', nt4.notes.averagePrecision);
noteRow('retrievalMetrics', 'system A on Q24', nt4, '`notes.ndcg`', nt4.notes.ndcg);
const nt4z = EV.retrievalMetrics({ ranking: RUNS('A').Q24, judgments: {}, k: K }); noteRow('retrievalMetrics', 'system A on Q24 with no judgments', nt4z, '`notes.ndcg`', nt4z.notes.ndcg);
const nt4o = EV.retrievalMetrics({ ranking: RUNS('A').Q24, judgments: { [RUNS('A').Q24[0]]: 0 }, k: K }); noteRow('retrievalMetrics', `system A on Q24 with one judgment, ${RUNS('A').Q24[0]} at grade 0`, nt4o, '`notes.ndcg`', nt4o.notes.ndcg);
must('the nDCG note names each of its cases', nt4.ndcg === null && nt4z.ndcg === null && nt4o.ndcg === null && new Set([nt4.notes.ndcg, nt4z.notes.ndcg, nt4o.notes.ndcg]).size === 3, [nt4.notes.ndcg, nt4z.notes.ndcg, nt4o.notes.ndcg].join(' / '));
const nt5 = EV.evaluateRetrieval({ runs: RUNS('A'), judgments: J, k: K }); noteRow('evaluateRetrieval', `system A, k ${K}`, nt5, '`excluded[0].reason`', nt5.excluded[0].reason);
const nt6 = EV.evaluateRetrieval({ runs: { Q24: RUNS('A').Q24 }, judgments: { Q24: J.Q24 }, k: K }); noteRow('evaluateRetrieval', 'Q24 alone', nt6, '`note`', nt6.note);
const nt7 = EV.checkGroundedness({ answer: 'No passage says so.', citations: [], documents: DOCS }); noteRow('checkGroundedness', 'an answer with no figure', nt7, '`note`', nt7.note);
const nt8 = EV.cohenKappa({ a: [2, 2, 2], b: [2, 2, 2] }); noteRow('cohenKappa', 'both raters grade 2 on every item', nt8, '`note`', nt8.note);
const nt9 = EV.bootstrapMean({ values: [0.8, 0.6], seed: SEED, nBoot: 1 }); noteRow('bootstrapMean', 'one replicate', nt9, '`note`', nt9.note);
table(['function', 'call', 'where the reason is', 'the reason (verbatim)'], NOTES);
must('kappa is null with the note', nt8.kappa === null, nt8.kappa);
must('the one-replicate standard error is null', nt9.standardError === null, nt9.standardError);

/* ============================================================ SECTION 4 */

section('graded', 'What is graded, and what is never graded', ['Associate m01 l04', 'Expert m06']);
w('EVERY GRADED NUMBER IN THIS COURSE IS A RETURN VALUE OF THIS ENGINE ON FIXED INPUTS. A capstone field, a question key and a panel figure are each computed by a function in the table of ' + ref('computes') + ' on documents, queries, judgments, answers, labels, ratings or probabilities that are written down in advance. The same inputs give the same number on any machine, so there is exactly one right answer.');
w();
w('NO FIELD, KEY OR ENGINE OUTPUT DEPENDS ON LANGUAGE-MODEL OUTPUT. Three things make that so, and each is checked:');
w();
w('- The engine calls no model (' + ref('computes') + ': its imports and its source are checked).');
w('- The two systems\' answers are fixture text, written once and committed; the course scores that text as a stand-in for what a copilot returns. The fixture record says no model wrote or scores any of it.');
w('- The bootstrap is the only random draw, and it is seeded: a seed and a replicate count name its result exactly.');
must('every fixture file carries its SYNTHETIC statement', [CORPUS, QUERIES, SYSTEMS, EXTRACT, CALIB].every((f) => typeof f.synthetic === 'string' && f.synthetic.startsWith('SYNTHETIC')), 'synthetic');
w();
const again = EV.pairedBootstrap({ a: [0.8, 0.6, 0.7], b: [0.5, 0.9, 0.4], seed: SEED });
const again2 = EV.pairedBootstrap({ a: [0.8, 0.6, 0.7], b: [0.5, 0.9, 0.4], seed: SEED });
must('the same seed gives the same interval, bit for bit', again.lower === again2.lower && again.upper === again2.upper, `${again.lower} ${again2.lower}`);
w('WHAT A MODEL HELPER MAY DO, AND WHY IT IS NEVER GRADED. A tool around this engine may use a language model to draft an answer, suggest a label or summarise a report. Such output changes from run to run and from model version to model version, so a grade resting on it would have no fixed right answer. The rule this course follows is that a model\'s output is an INPUT to be scored, never a key: it is scored exactly as the fixture answers are scored, by the deterministic checks of ' + ref('claims') + ', ' + ref('answers') + ', ' + ref('extraction') + ' and ' + ref('grounded') + ', and those scores are what a person reads.');
w();
w('WHAT A DETERMINISTIC SCORE DOES NOT SAY. A supported claim is found in a cited passage; it is not thereby true (' + ref('grounded') + '). An exact match compares normalised strings; it does not know that "45.0 percent" and "45 percent" are the same quantity (' + ref('answers') + '). A high nDCG says the judged passages were ranked well; it says nothing about passages nobody judged (' + ref('judged') + '). Each score is quoted with its settings for that reason.');

/* ============================================================ SECTION 5 */

section('tokens', 'Tokens: lowercase, split, no stemming, and the stop list left off', ['Associate m02', 'Associate m03 l01']);
const tk = (text, stopWords = false) => success(`tokenize ${text}`, EV.tokenize({ text, stopWords }));
w(`THE RULE (the engine's basis, verbatim): ${EV.tokenize({ text: 'x' }).basis.tokens}.`);
w();
const TOKX = [
  'Ekene-3 flowed 1.25 MMscf/d; Top WELL at 1548 m TVD.',
  'Average reservoir pressure 2,096 psia on 2023-01-01.',
  'Core plug EK1-P: permeability 420 md.',
  'Monthly H2S drill: 0 ppm H2S.',
  'Bit graded 2-3-WT at 1760 m MD.',
  'Café Überprüfung naïve',
  'oil_rate and water/cut',
];
table(['text (stated)', 'tokens', 'count', 'with the stop list on', 'removed'], TOKX.map((t) => {
  const a = tk(t); const b = tk(t, true);
  return [`\`${t}\``, a.tokens.join(' '), S(a.count), b.tokens.join(' '), S(b.removed)];
}));
const t0 = tk(TOKX[0]);
must('1.25 splits into 1 and 25, Ekene-3 into ekene and 3', t0.tokens.includes('1') && t0.tokens.includes('25') && t0.tokens.slice(0, 2).join() === 'ekene,3', t0.tokens.join());
const tAcc = tk(TOKX[5]);
must('an accented letter is a separator and only A-Z is lowercased', tAcc.tokens.join() === 'caf,berpr,fung,na,ve', tAcc.tokens.join());
w();
w('Read the rows: a decimal point, a comma, a hyphen, a slash, an underscore and a colon all separate, so "1.25" becomes the two tokens "1" and "25", "2,096" becomes "2" and "096", and "Ekene-3" becomes "ekene" and "3". Single-character tokens are kept. An accented letter is outside [a-z0-9] and separates, so "Café" gives caf. Nothing is stemmed: "producing" and "produced" stay different tokens.');
w();
const oily = ['well', 'top', 'bottom', 'fire', 'system', 'first', 'third', 'one', 'two', 'three', 'twelve', 'fifteen', 'fifty', 'hundred', 'thick', 'thin', 'per', 'full', 'empty', 'found', 'back', 'part', 'side', 'move', 'amount', 'mill', 'bill', 'interest', 'no', 'not'];
must('every oilfield word listed is in the stop list', oily.every((x) => EV.ENGLISH_STOP_WORDS.includes(x)), oily.filter((x) => !EV.ENGLISH_STOP_WORDS.includes(x)).join());
w(`THE STOP LIST IS OFF BY DEFAULT. scikit-learn's ENGLISH_STOP_WORDS (${EV.ENGLISH_STOP_WORDS.length} words) removes words that carry meaning in oilfield text, every one of these checked to be in it: ${list(oily)}. The query "the well top" loses every token with the list on:`);
w();
const wt = success('rankBm25 the well top, stop list on', EV.rankBm25({ documents: DOCS, query: 'the well top', stopWords: true }));
w(`> ${wt.note}`);
must('the well top ranks nothing with the stop list on', wt.ranking.length === 0 && /no token after the stop list/.test(wt.note), wt.note);
w();
const q14on = success('bm25 Q14 stop list on', EV.rankBm25({ documents: DOCS, query: QTEXT.Q14, k: K, stopWords: true }));
const q14off = success('bm25 Q14 stop list off', EV.rankBm25({ documents: DOCS, query: QTEXT.Q14, k: K }));
w(`Q14 "${QTEXT.Q14}" keeps the query terms ${list(q14off.queryTerms.map((t) => t.term))} with the list off and ${list(q14on.queryTerms.map((t) => t.term))} with it on; "no", the word that answers it in the passages, is itself a stop word.`);
must('no is a stop word', EV.ENGLISH_STOP_WORDS.includes('no'), 'no');
w();
w('COUNTING TERMS. A passage\'s length for BM25 is its token count after the stop list (with the list off, every token). Three passages, counted by the engine:');
w();
const LEN_IDS = ['EKD-001', 'EKD-018', 'EKD-030'];
table(['passage', 'tokens', 'with the stop list on', 'the three most frequent tokens (count)'], LEN_IDS.map((id) => {
  const a = tk(TEXT[id]); const b = tk(TEXT[id], true);
  const c = {}; a.tokens.forEach((t) => { c[t] = (c[t] || 0) + 1; });
  const top = Object.entries(c).sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1)).slice(0, 3);
  return [id, S(a.count), S(b.count), top.map(([t, n]) => `${t} (${n})`).join(', ')];
}));
const vStop = success('tfidfVectors stop list on', EV.tfidfVectors({ documents: DOCS, stopWords: true }));
const bStop = success('bm25 stop list on for avgdl', EV.rankBm25({ documents: DOCS, query: 'oil', stopWords: true }));
w();
w(`With the stop list on, the corpus vocabulary is ${vStop.vocabulary.length} tokens (against ${vec.vocabulary.length}) and the mean passage length ${f6(bStop.avgdl)} (against ${f6(lensB.avgdl)}).`);

/* ============================================================ SECTION 6 */

section('tfidf', 'TF-IDF: counts, the smoothed idf, unit vectors and the cosine', ['Associate m03']);
const tv = success('tfidfVectors on the hand set', EV.tfidfVectors({ documents: HAND }));
w('THE CONVENTION (the engine\'s basis, verbatim):');
w();
Object.entries(tv.basis).forEach(([k2, v]) => w(`- ${k2}: ${v}`));
w();
w(`THE HAND SET (stated), five short passages, the fifth empty: ${HAND.map((d) => `${d.id} "${d.text}"`).join('; ')}.`);
w();
table(['term', 'df', 'idf'], tv.vocabulary.map((t, i) => [t, S(tv.df[i]), f6(tv.idf[i])]));
must('idf is ln((1+N)/(1+df))+1 on every term', tv.vocabulary.every((t, i) => nearly(tv.idf[i], Math.log((1 + 5) / (1 + tv.df[i])) + 1)), 'idf');
w();
const ti = tv.vocabulary.indexOf('oil');
w(`Derived check on one row: oil is in ${tv.df[ti]} of the ${HAND.length} passages, so idf = ln((1 + ${HAND.length}) / (1 + ${tv.df[ti]})) + 1 = ${f6(tv.idf[ti])}. A term in every passage would still have idf 1, never 0: the + 1 keeps it.`);
w();
w('THE DOCUMENT VECTORS. Each passage\'s raw weight is its count times the idf, and the vector is then divided by its length, so every non-empty vector has length 1:');
w();
table(['passage', 'tokens', 'norm before scaling', 'weights after scaling'], tv.vectors.map((v) => [v.id, S(v.length), f6(v.norm), Object.entries(v.weights).map(([t, x]) => `${t} ${f6(x)}`).join(', ') || '(none)']));
const d5v = tv.vectors.find((v) => v.id === 'd5');
must('the empty passage has norm 0 and no weight', d5v.norm === 0 && Object.keys(d5v.weights).length === 0, d5v.norm);
must('every non-empty vector has unit length', tv.vectors.filter((v) => v.norm > 0).every((v) => nearly(Math.sqrt(sum(Object.values(v.weights).map((x) => x * x))), 1, 1e-12)), 'unit');
w();
w('The empty passage d5 is a zero vector with norm 0; it can never rank.');
w();
const th = success('rankTfidf oil rate on the hand set', EV.rankTfidf({ documents: HAND, query: HAND_Q, k: K }));
w(`RANKING "${HAND_Q}" BY COSINE. The query is weighted the same way on the corpus vocabulary: query vector ${Object.entries(th.queryVector).map(([t, x]) => `${t} ${f6(x)}`).join(', ')}. The score is the dot product of the two unit vectors:`);
w();
table(['rank', 'passage', 'cosine', 'term: query weight x passage weight'], th.ranking.map((r) => [S(r.rank), r.id, f6(r.score), r.terms.map((t) => `${t.term}: ${f6(t.query)} x ${f6(t.document)}`).join('; ')]));
must('each cosine is the sum of its products', th.ranking.every((r) => nearly(r.score, sum(r.terms.map((t) => t.query * t.document)))), 'dot');
w();
w(`${th.ranking.length} of the ${HAND.length} passages rank: d2 and d4 share no term with the query, and d5 is empty.`);
w();
const t4 = success('rankTfidf Q04', EV.rankTfidf({ documents: DOCS, query: QTEXT.Q04, k: K }));
w(`ON THE CORPUS. Q04 "${QTEXT.Q04}": query vector ${Object.entries(t4.queryVector).map(([t, x]) => `${t} ${f6(x)}`).join(', ')}.`);
w();
table(['rank', 'passage', 'cosine', 'judged grade (fixture)'], t4.ranking.map((r) => [S(r.rank), r.id, f6(r.score), S(J.Q04[r.id] ?? 'unjudged')]));
w();
const t24 = success('rankTfidf Q24', EV.rankTfidf({ documents: DOCS, query: QTEXT.Q24, k: K }));
w(`TERMS OUTSIDE THE VOCABULARY ARE DROPPED. Q24 "${QTEXT.Q24}" drops ${list(t24.droppedTerms)}, which appear in no passage; the cosine is computed on ${list(Object.keys(t24.queryVector))}.`);
must('Q24 drops subsea and tree', t24.droppedTerms.join() === 'subsea,tree', t24.droppedTerms.join());
w();
const t13 = success('rankTfidf Q13', EV.rankTfidf({ documents: DOCS, query: QTEXT.Q13, k: K }));
const t13s = success('rankTfidf Q13 sublinear', EV.rankTfidf({ documents: DOCS, query: QTEXT.Q13, k: K, sublinearTf: true }));
w(`SUBLINEAR TF replaces a count c by 1 + ln c before the idf, so a word repeated in a passage counts for less. Q13 "${QTEXT.Q13}", raw counts and sublinear:`);
w();
table(['rank', 'raw counts: passage', 'cosine', 'sublinear: passage', 'cosine'], t13.ranking.map((r, i) => [S(r.rank), r.id, f6(r.score), t13s.ranking[i].id, f6(t13s.ranking[i].score)]));

/* ============================================================ SECTION 7 */

section('bm25', 'BM25: the Lucene idf, k1 saturation, b length normalisation, and a score read term by term', ['Associate m04']);
const bh = success('rankBm25 oil rate on the hand set', EV.rankBm25({ documents: HAND, query: HAND_Q, k: K }));
w('THE CONVENTION (the engine\'s basis, verbatim):');
w();
Object.entries(bh.basis).forEach(([k2, v]) => w(`- ${k2}: ${v}`));
w();
w(`ON THE HAND SET, "${HAND_Q}": N = ${bh.N}, avgdl = ${f6(bh.avgdl)} (the empty passage counts in the mean with length 0).`);
w();
table(['query term', 'df', 'BM25 idf'], bh.queryTerms.map((t) => [t.term, S(t.df), f6(t.idf)]));
must('the BM25 idf is ln(1 + (N - df + 0.5)/(df + 0.5)) on every term', bh.queryTerms.every((t) => nearly(t.idf, Math.log(1 + (bh.N - t.df + 0.5) / (t.df + 0.5)))), 'idf');
w();
table(['rank', 'passage', 'length', 'score', 'term: tf, contribution'], bh.ranking.map((r) => [S(r.rank), r.id, S(r.length), f6(r.score), r.terms.map((t) => `${t.term}: ${t.tf}, ${f6(t.contribution)}`).join('; ')]));
must('each BM25 score is the sum of its term contributions', bh.ranking.every((r) => nearly(r.score, sum(r.terms.map((t) => t.contribution)))), 'sum');
const h1 = bh.ranking[0];
const h1o = h1.terms.find((t) => t.term === 'oil');
w();
w(`Derived check on d1's oil term: idf ${f6(h1o.idf)} x ${h1o.tf} x (${KD.K1} + 1) / (${h1o.tf} + ${KD.K1} x (1 - ${KD.B} + ${KD.B} x ${h1.length} / ${f6(bh.avgdl)})) = ${f6(h1o.contribution)}.`);
must('the derived oil contribution matches', nearly(h1o.contribution, (h1o.idf * h1o.tf * (KD.K1 + 1)) / (h1o.tf + KD.K1 * (1 - KD.B + (KD.B * h1.length) / bh.avgdl))), h1o.contribution);
w();
w('THE BM25 IDF IS NEVER NEGATIVE. The Lucene form adds 1 inside the logarithm, so a term in every passage still scores a small positive idf. A term in no passage has no posting and contributes nothing.');
w();
// k1 = 0 and b = 0, the property calls
const bk0 = success('rankBm25 k1 0', EV.rankBm25({ documents: HAND, query: HAND_Q, k: K, k1: 0 }));
must('k1 = 0: every score is the sum of the matched terms\' idf', bk0.ranking.every((r) => nearly(r.score, sum(r.terms.map((t) => t.idf)))), 'k1 0');
w(`K1 = 0 scores each matched term at its idf alone, whatever its count: ${bk0.ranking.map((r) => `${r.id} ${f6(r.score)}`).join(', ')}, each the sum of its matched terms' idf (checked).`);
w();
const SAT = [
  { id: 's1', text: 'oil' }, { id: 's2', text: 'oil oil' }, { id: 's3', text: 'oil oil oil' },
  { id: 's5', text: 'oil oil oil oil oil' }, { id: 's9', text: 'oil oil oil oil oil oil oil oil oil' }, { id: 'sg', text: 'gas' },
];
const sat = success('rankBm25 saturation b 0', EV.rankBm25({ documents: SAT, query: 'oil', k: 6, b: 0 }));
const satIdf = sat.queryTerms[0].idf;
const satTf = SAT.filter((d) => d.text.startsWith('oil')).map((d) => d.text.split(' ').length);
w(`SATURATION AND K1. Six stated passages, "oil" repeated ${satTf.slice(0, -1).join(', ')} and ${satTf[satTf.length - 1]} times and one passage "gas", scored for "oil" with b = 0 so that length plays no part (k1 = ${KD.K1}, idf ${f6(satIdf)}):`);
w();
const satRows = [...sat.ranking].sort((a, b) => a.terms[0].tf - b.terms[0].tf);
table(['passage', 'tf', 'contribution', 'contribution / idf (derived)'], satRows.map((r) => [r.id, S(r.terms[0].tf), f6(r.score), f6(r.score / satIdf)]));
w();
w(`The ratio climbs toward k1 + 1 = ${KD.K1 + 1} and never reaches it: each extra repeat adds less (derived from the rows above). k1 sets how fast the count saturates.`);
must('the saturation ratio rises and stays below k1 + 1', satRows.every((r, i) => i === 0 || r.score > satRows[i - 1].score) && satRows.every((r) => r.score / satIdf < KD.K1 + 1), 'sat');
w();
const b06d = success('bm25 Q06 b default', EV.rankBm25({ documents: DOCS, query: QTEXT.Q06, k: K }));
const bq0 = success('bm25 Q13 b 0', EV.rankBm25({ documents: DOCS, query: QTEXT.Q13, k: K, b: 0 }));
const bqd = success('bm25 Q13 b default', EV.rankBm25({ documents: DOCS, query: QTEXT.Q13, k: K }));
const bq1 = success('bm25 Q13 b 1', EV.rankBm25({ documents: DOCS, query: QTEXT.Q13, k: K, b: 1 }));
w(`LENGTH NORMALISATION AND B. b scales how much a long passage is marked down. Q13 "${QTEXT.Q13}" at b = 0, the default ${KD.B} and 1:`);
w();
table(['rank', 'b 0: passage (length)', 'score', `b ${KD.B}: passage (length)`, 'score', 'b 1: passage (length)', 'score'], [0, 1, 2, 3, 4].map((i) => [S(i + 1),
  `${bq0.ranking[i].id} (${bq0.ranking[i].length})`, f6(bq0.ranking[i].score),
  `${bqd.ranking[i].id} (${bqd.ranking[i].length})`, f6(bqd.ranking[i].score),
  `${bq1.ranking[i].id} (${bq1.ranking[i].length})`, f6(bq1.ranking[i].score)]));
must('b changes the Q13 top passage, the longer first at b 0', bq0.ranking[0].id === 'EKD-030' && bq1.ranking[0].id === 'EKD-029' && bq0.ranking[0].length > bq1.ranking[0].length, `${bq0.ranking[0].id} ${bq1.ranking[0].id}`);
w();
w(`At b = 0 length plays no part and the longer ${bq0.ranking[0].id} (${bq0.ranking[0].length} tokens) is first; at b = 1 the shorter ${bq1.ranking[0].id} (${bq1.ranking[0].length} tokens) is. At b = 0 the fifth place is also a tie at the cutoff (tieAtCutoff ${bq0.tieAtCutoff}).`);
must('Q13 b 0 has a tie at the cutoff', bq0.tieAtCutoff === true, bq0.tieAtCutoff);
w();
const rep = success('bm25 oil oil rate', EV.rankBm25({ documents: HAND, query: PROBE.repeated, k: K }));
must('a repeated query word counts once', JSON.stringify(rep.ranking.map((r) => [r.id, r.score])) === JSON.stringify(bh.ranking.map((r) => [r.id, r.score])), 'repeat');
w(`A REPEATED QUERY WORD COUNTS ONCE. "oil oil rate" on the hand set returns exactly the scores of "oil rate" (checked to the last bit): ${rep.ranking.map((r) => `${r.id} ${f6(r.score)}`).join(', ')}. The engine keeps the distinct query terms (Okapi's query-frequency factor with k3 = 0, stated in its basis).`);
w();
const b02 = success('bm25 Q02', EV.rankBm25({ documents: DOCS, query: QTEXT.Q02, k: K }));
w(`A SCORE READ TERM BY TERM, on the corpus. Q02 "${QTEXT.Q02}", query terms ${b02.queryTerms.map((t) => `${t.term} (df ${t.df}, idf ${f6(t.idf)})`).join(', ')}:`);
w();
table(['rank', 'passage', 'length', 'score', 'judged grade (fixture)', 'term: tf, contribution'], b02.ranking.map((r) => [S(r.rank), r.id, S(r.length), f6(r.score), S(J.Q02[r.id] ?? 'unjudged'), r.terms.map((t) => `${t.term}: ${t.tf}, ${f6(t.contribution)}`).join('; ')]));
must('Q02: EKD-043 ranks first and the answer EKD-003 fourth', b02.ranking[0].id === 'EKD-043' && b02.ranking[3].id === 'EKD-003' && J.Q02['EKD-003'] === 3, b02.ranking.map((r) => r.id).join());
w();
w(`EKD-043 is a drilling report ("rate of penetration") and ranks first on the words rate and of; the passage that answers the query, EKD-003, ranks fourth. BM25 matches words and knows nothing of meaning.`);
w();
const b13k = success('bm25 Q13 k1 alt', EV.rankBm25({ documents: DOCS, query: QTEXT.Q13, k: K, k1: K1_ALT }));
const b13 = success('bm25 Q13', EV.rankBm25({ documents: DOCS, query: QTEXT.Q13, k: K }));
w(`K1 ON THE CORPUS. Q13 "${QTEXT.Q13}" at k1 ${KD.K1} and k1 ${K1_ALT}:`);
w();
table(['rank', `k1 ${KD.K1}: passage`, 'score', `k1 ${K1_ALT}: passage`, 'score'], b13.ranking.map((r, i) => [S(r.rank), r.id, f6(r.score), b13k.ranking[i].id, f6(b13k.ranking[i].score)]));

/* ============================================================ SECTION 8 */

section('ranking', 'The ranking: score order, the twelve-digit tie rule and a tie at the cutoff', ['Associate m05', 'Expert m05 l02']);
w(`THE RULE (the engine's basis, verbatim): ${b02.basis.ranking}.`);
w();
const q10 = success('bm25 Q10', EV.rankBm25({ documents: DOCS, query: QTEXT.Q10, k: K }));
const q10t = success('tfidf Q10', EV.rankTfidf({ documents: DOCS, query: QTEXT.Q10, k: K }));
w(`A TIE. Q10 "${QTEXT.Q10}": only ${q10.matched} passages contain a query word, so the BM25 list holds ${q10.ranking.length} passages although k is ${K}. EKD-046 and EKD-058 carry the same text, so they score the same, and the id ascending puts EKD-046 first:`);
w();
table(['method', 'rank 1', 'score', 'rank 2', 'score', 'ties reported', 'tieAtCutoff'], [
  ['bm25', q10.ranking[0].id, f6(q10.ranking[0].score), q10.ranking[1].id, f6(q10.ranking[1].score), JSON.stringify(q10.ties), S(q10.tieAtCutoff)],
  ['tfidf', q10t.ranking[0].id, f6(q10t.ranking[0].score), q10t.ranking[1].id, f6(q10t.ranking[1].score), JSON.stringify(q10t.ties), S(q10t.tieAtCutoff)],
]);
must('Q10 ties EKD-046 and EKD-058 on both methods, EKD-046 first', q10.ranking[0].score === q10.ranking[1].score && q10.ranking[0].id === 'EKD-046' && q10t.ranking[0].id === 'EKD-046' && q10.ties.length === 1, JSON.stringify(q10.ties));
planted(0, q10.ties[0].join() === 'EKD-046,EKD-058' && q10t.ties[0].join() === 'EKD-046,EKD-058', JSON.stringify(q10.ties));
w();
const q10k1 = success('bm25 Q10 k 1', EV.rankBm25({ documents: DOCS, query: QTEXT.Q10, k: 1 }));
w(`A TIE AT THE CUTOFF. The same query at k = 1 keeps ${q10k1.ranking[0].id} and drops its twin: tieAtCutoff is ${q10k1.tieAtCutoff}, because the first and second passages tie and the cut falls between them. The id alone decided which one is kept.`);
must('Q10 at k 1 reports the tie at the cutoff', q10k1.tieAtCutoff === true && q10k1.ranking.length === 1, q10k1.tieAtCutoff);
w();
const q06 = b06d;
w(`A WIDER TIE. Q06 by BM25 at k ${K} ties ${JSON.stringify(q06.ties)}, and tieAtCutoff is ${q06.tieAtCutoff}. Across the ${QS.length} queries at k ${K}, BM25 reports a tie at the cutoff on ${rA.perQuery.filter((p) => p.tieAtCutoff).map((p) => p.id).join(', ')} and TF-IDF on ${rB.perQuery.filter((p) => p.tieAtCutoff).map((p) => p.id).join(', ') || 'none'}.`);
must('Q06 has a four-way tie and a tie at the cutoff', q06.ties.some((t) => t.length === 4) && q06.tieAtCutoff, JSON.stringify(q06.ties));
w();
const NT = [{ id: 'n2', text: 'oil water' }, { id: 'n1', text: 'oil water gas' }, { id: 'n3', text: 'gas' }];
const nt = success('bm25 near tie', EV.rankBm25({ documents: NT, query: 'oil', b: NT_B }));
w(`WHAT COUNTS AS A TIE. Two scores tie when they agree to ${EV.DEFAULTS.TIE_DIGITS} significant digits, compared as Number(score.toPrecision(${KD.TIE_DIGITS})). Three stated passages n2 "oil water", n1 "oil water gas" and n3 "gas", scored for "oil" with b = ${S(NT_B)}, so that length barely matters:`);
w();
table(['rank', 'passage', 'length', 'score (full double)', `tie key, ${KD.TIE_DIGITS} significant digits`], nt.ranking.map((r) => [S(r.rank), r.id, S(r.length), S(r.score), S(key12(r.score))]));
must('the near tie differs at 12 digits and the shorter n2 ranks first', nt.ranking[0].id === 'n2' && key12(nt.ranking[0].score) !== key12(nt.ranking[1].score) && nt.ties.length === 0, nt.ranking.map((r) => r.id).join());
w();
w(`The two scores differ by ${eX(nt.ranking[0].score - nt.ranking[1].score)} (derived), which the ${KD.TIE_DIGITS}-digit key sees, so there is no tie and n2 ranks above n1 on its score. With ids alone n1 would come first.`);
must('the near-tie scores print alike at six decimals', f6(nt.ranking[0].score) === f6(nt.ranking[1].score), `${f6(nt.ranking[0].score)} ${f6(nt.ranking[1].score)}`);
w(`At six decimals the two scores print alike (${f6(nt.ranking[0].score)}); they are not equal, and the engine does not tie them.`);
w();
w('WHY A KEY AND NOT A TOLERANCE. A key is transitive: two scores with the same key tie, full stop. A relative tolerance is not: a can be near b and b near c while a is not near c, which breaks a sort. Only a score above 0 is ranked, so a list can be shorter than k.');

/* ============================================================ SECTION 9 */

section('atk', 'Metrics at a cutoff: precision, recall, hit and reciprocal rank, and their means', ['Associate m05']);
const mb = success('retrievalMetrics stated', EV.retrievalMetrics({ ranking: ['c', 'a', 'x', 'b', 'd'], judgments: { a: 3, b: 2, c: 0, d: 1, e: 2 }, k: K }));
w('THE DEFINITIONS (the engine\'s basis, verbatim):');
w();
['relevant', 'precision', 'recall', 'hit', 'reciprocalRank'].forEach((k2) => w(`- ${k2}: ${mb.basis[k2]}`));
w();
w(`A STATED RANKING, by hand: the list c, a, x, b, d against the judgments a 3, b 2, c 0, d 1, e 2 (x is unjudged, e is judged but not retrieved), k ${K}, relevant at grade 1 or more:`);
w();
table(['rank', 'passage', 'grade', 'relevant'], ['c', 'a', 'x', 'b', 'd'].map((id, i) => {
  const g = { a: 3, b: 2, c: 0, d: 1, e: 2 }[id];
  return [S(i + 1), id, g === undefined ? 'unjudged, counts as 0' : S(g), g >= 1 ? 'yes' : 'no'];
}));
w();
table(['metric', 'value'], [
  ['relevant judged', S(mb.nRelevant)], [`relevant in the top ${K}`, S(mb.relevantRetrieved)], ['unjudged retrieved', S(mb.unjudgedRetrieved)],
  [`precision at ${K}`, f6(mb.precision)], [`recall at ${K}`, f6(mb.recall)], [`hit at ${K}`, S(mb.hit)], ['first relevant rank', S(mb.firstRelevantRank)], ['reciprocal rank', f6(mb.reciprocalRank)],
]);
must('stated ranking: 3 of 5 relevant, 4 judged relevant, RR 0.5', mb.relevantRetrieved === 3 && mb.nRelevant === 4 && mb.reciprocalRank === 0.5, JSON.stringify(mb));
w();
w(`Precision is ${mb.relevantRetrieved} / ${K} and recall ${mb.relevantRetrieved} / ${mb.nRelevant}: e is relevant and was not retrieved. The first relevant passage is a at rank 2, so the reciprocal rank is 1 / 2.`);
w();
const eA = success('evaluateRetrieval A k 5', EV.evaluateRetrieval({ runs: RUNS('A'), judgments: J, k: K }));
const eB = success('evaluateRetrieval B k 5', EV.evaluateRetrieval({ runs: RUNS('B'), judgments: J, k: K }));
w(`SYSTEM A (BM25) ON EVERY QUERY, k ${K}, relevant at grade 1 or more:`);
w();
table(['query', 'relevant judged', `relevant in top ${K}`, 'precision', 'recall', 'hit', 'first relevant rank', 'reciprocal rank'], eA.perQuery.map((r) => [r.query, S(r.nRelevant), S(r.relevantRetrieved), f6(r.precision), f6(r.recall), S(r.hit), S(r.firstRelevantRank), f6(r.reciprocalRank)]));
const pA14 = eA.perQuery.find((r) => r.query === 'Q14');
planted(2, pA14.hit === 0 && pA14.nRelevant > 0, JSON.stringify(pA14));
w();
w(`Q14 has ${pA14.nRelevant} relevant passages and BM25 retrieves none of them in the top ${K}: hit 0. Q24 has recall null, because no passage is relevant to it. Q10 has precision ${f6(eA.perQuery.find((r) => r.query === 'Q10').precision)} with only ${eA.perQuery.find((r) => r.query === 'Q10').retrieved} passages ranked: precision at ${K} divides by ${K} even when fewer are ranked.`);
must('Q10 precision divides by 5', eA.perQuery.find((r) => r.query === 'Q10').precision === eA.perQuery.find((r) => r.query === 'Q10').relevantRetrieved / 5, 'p10');
w();
w(`THE MEANS OVER QUERIES (the engine's basis: ${eA.basis.mean}). ${eA.nIncluded} of the ${eA.nQueries} queries are included; ${eA.excluded.map((x) => x.query).join(', ')} is excluded (${ref('ap')} gives the rule):`);
w();
table(['mean over the included queries', 'system A (BM25)', 'system B (TF-IDF)'], [
  [`precision at ${K}`, f6(eA.mean.precision), f6(eB.mean.precision)],
  [`recall at ${K}`, f6(eA.mean.recall), f6(eB.mean.recall)],
  [`hit rate at ${K}`, f6(eA.mean.hitRate), f6(eB.mean.hitRate)],
  [`MRR at ${K}`, f6(eA.mean.mrr), f6(eB.mean.mrr)],
]);
w();
w(`MRR is the mean reciprocal rank: system B's ${f6(eB.mean.mrr)} puts its first relevant passage higher on average than system A's ${f6(eA.mean.mrr)}; system A's recall at ${K} is the higher of the two.`);
must('B has the higher MRR and A the higher recall', eB.mean.mrr > eA.mean.mrr && eA.mean.recall > eB.mean.recall, `${eB.mean.mrr} ${eA.mean.recall}`);

/* ============================================================ SECTION 10 */

section('claims', 'Answers that cite their sources: claims, and unsupported claims', ['Associate m06', 'Associate m01 l01']);
w('AN ANSWER IN THIS COURSE is a text and the list of passage ids it cites. A copilot that retrieves passages and then writes an answer can be asked, in its instructions, to cite the passage every figure came from; the citations are what make an answer checkable. The engine then checks the answer\'s claims against the passages it cites.');
w();
const gs = success('checkGroundedness stated', EV.checkGroundedness({ answer: PROBE.stated, citations: ['d1', 'd4'], documents: HAND, retrieved: ['d1', 'd2', 'd4'] }));
w('WHAT A CLAIM IS (the engine\'s basis, verbatim):');
w();
w(`- claims: ${gs.basis.claims}`);
w(`- support: ${gs.basis.support}`);
w(`- citations: ${gs.basis.citations}`);
w(`- fraction: ${gs.basis.fraction}`);
w();
w(`A STATED ANSWER on the hand set, citing d1 and d4, with d1, d2 and d4 retrieved: ${PROBE.stated}`);
w();
table(['claim', 'kind', 'value', 'supported', 'reason (verbatim)'], gs.claims.map((c) => [c.text, c.kind, S(c.value), S(c.supported), c.reason || `found in ${list(c.foundIn)}`]));
must('the stated answer: 120 and 2,096 supported, 4 unsupported', gs.nSupported === 2 && gs.nClaims === 6, `${gs.nSupported}/${gs.nClaims}`);
w();
w(`${gs.nSupported} of ${gs.nClaims} claims are supported, a supported fraction of ${f6(gs.supportedFraction)}. "Ekene-1" is an identifier and makes no claim. The quote is checked first and the date before the numbers, and "45%" is the number "45". The date and the quote are in d2, which was retrieved and not cited; the reason says so.`);
w();
const cA = success('checkAnswers A', EV.checkAnswers({ answers: ANSWERS('A'), documents: DOCS, runs: RUNS('A') }));
w(`SYSTEM A'S ${QS.length} ANSWERS, checked against the passages each cites, with its retrieved lists:`);
w();
table(['query', 'claims', 'supported', 'supported fraction', 'citations', 'flags'], cA.perAnswer.map((r) => [r.query, S(r.nClaims), S(r.nSupported), r.supportedFraction === null ? 'null' : f6(r.supportedFraction), r.citations.map((c) => c.id).join(', ') || '(none)', r.flags.join('; ') || '(none)']));
w();
w(`System A makes ${cA.nClaims} claims and ${cA.nSupported} are supported, a pooled supported fraction of ${f6(cA.supportedFraction)}; ${cA.fullySupportedAnswers} of the ${cA.answersWithClaims} answers with a claim are fully supported.`);
must('system A: 47 of 49 claims supported', cA.nClaims === 49 && cA.nSupported === 47, `${cA.nSupported}/${cA.nClaims}`);
w();
w('AN UNSUPPORTED CLAIM is what this course calls a hallucination: a figure the answer states that the check could not find in a passage it cites and retrieved. System A\'s two, with the engine\'s reasons:');
w();
const unsA = cA.perAnswer.flatMap((r) => r.claims.filter((c) => !c.supported).map((c) => [r.query, c.text, c.reason]));
table(['query', 'claim', 'reason (verbatim)'], unsA);
planted(3, unsA.some(([q, t, r]) => q === 'Q06' && t === '20.3' && /EKD-007, neither cited nor retrieved/.test(r)), JSON.stringify(unsA));
w();
w(`The Q06 answer states the maximum oil column, ${unsA[0][1]} m, which is in EKD-007: that passage was neither retrieved nor cited, so the figure came from somewhere the answer cannot show. The Q13 claim is taken up in ${ref('grounded')}.`);
w();
w(`THE ANSWERS WITH NO CLAIM. ${cA.perAnswer.filter((r) => r.nClaims === 0).map((r) => r.query).join(' and ')} state no number, date or quote: "${ANS('A').Q14.text}" and "${ANS('A').Q24.text}". Their supported fraction is null, and the pooled fraction counts only claims.`);

/* ============================================================ SECTION 11 */

section('ap', 'Average precision, MAP, the no-relevant rule and the relevance threshold', ['Professional m01']);
w(`THE DEFINITION (the engine's basis, verbatim): ${mb.basis.averagePrecision}.`);
w();
w(`THE STATED RANKING of ${ref('atk')}, c, a, x, b, d, judgments a 3, b 2, c 0, d 1, e 2, k ${K}:`);
w();
const apRows = [];
let hits = 0;
['c', 'a', 'x', 'b', 'd'].forEach((id, i) => {
  const g = { a: 3, b: 2, c: 0, d: 1, e: 2 }[id] || 0;
  if (g >= 1) { hits += 1; apRows.push([S(i + 1), id, S(hits), f6(hits / (i + 1))]); }
});
table(['rank of a relevant passage', 'passage', 'relevant so far', 'precision at that rank (derived)'], apRows);
w();
w(`Average precision = (${apRows.map((r) => r[3]).join(' + ')}) / ${mb.nRelevant} = ${f6(mb.averagePrecision)}. The divisor is every relevant judged passage, ${mb.nRelevant}, so e, relevant and never retrieved, lowers the average; dividing by the ${apRows.length} retrieved would give ${f6(sum(apRows.map((r) => Number(r[3]))) / apRows.length)} (derived), which is not what the engine computes.`);
must('AP of the stated ranking', nearly(mb.averagePrecision, (1 / 2 + 2 / 4 + 3 / 5) / 4), mb.averagePrecision);
w();
w(`MAP is the mean of the per-query average precision over the included queries. At k ${K} and grade 1:`);
w();
table(['query', 'relevant judged', 'system A AP', 'system B AP'], eA.perQuery.map((r, i) => [r.query, S(r.nRelevant), r.averagePrecision === null ? 'null' : f6(r.averagePrecision), eB.perQuery[i].averagePrecision === null ? 'null' : f6(eB.perQuery[i].averagePrecision)]));
w();
w(`MAP at ${K}: system A ${f6(eA.mean.map)}, system B ${f6(eB.mean.map)}, each over ${eA.nIncluded} queries.`);
must('MAP A 0.600278 and B 0.593007', f6(eA.mean.map) === '0.600278' && f6(eB.mean.map) === '0.593007', `${eA.mean.map} ${eB.mean.map}`);
w();
w(`THE NO-RELEVANT RULE (the engine's basis, verbatim): ${eA.basis.noRelevant}.`);
w();
const eAz = success('evaluateRetrieval A zero', EV.evaluateRetrieval({ runs: RUNS('A'), judgments: J, k: K, noRelevant: 'zero' }));
const eBz = success('evaluateRetrieval B zero', EV.evaluateRetrieval({ runs: RUNS('B'), judgments: J, k: K, noRelevant: 'zero' }));
table(['noRelevant', 'queries in the means', 'A MAP', 'B MAP', 'A MRR', 'B MRR', 'listed in'], [
  ['exclude (default)', S(eA.nIncluded), f6(eA.mean.map), f6(eB.mean.map), f6(eA.mean.mrr), f6(eB.mean.mrr), `excluded: ${eA.excluded.map((x) => x.query).join()}`],
  ['zero', S(eAz.nIncluded), f6(eAz.mean.map), f6(eBz.mean.map), f6(eAz.mean.mrr), f6(eBz.mean.mrr), `zeroed: ${eAz.zeroed.map((x) => x.query).join()}`],
]);
planted(1, eA.excluded.length === 1 && eA.excluded[0].query === 'Q24' && eAz.zeroed[0].query === 'Q24', JSON.stringify(eA.excluded));
w();
w(`Keeping Q24 with every metric it cannot give scored 0 lowers every mean, because a query nothing answers can only score 0. Its reason is quoted in ${ref('refusals')}. The default follows trec_eval.`);
w();
const eA2 = success('evaluateRetrieval A grade 2', EV.evaluateRetrieval({ runs: RUNS('A'), judgments: J, k: K, relevantGrade: 2 }));
const eB2 = success('evaluateRetrieval B grade 2', EV.evaluateRetrieval({ runs: RUNS('B'), judgments: J, k: K, relevantGrade: 2 }));
w('THE RELEVANCE THRESHOLD. relevantGrade is 1 by default, the trec_eval default, so a passage graded 1 ("related") counts as relevant. At grade 2 only "relevant" and "answers the query" count:');
w();
table([`mean at ${K}`, 'A, grade 1', 'A, grade 2', 'B, grade 1', 'B, grade 2'], [
  ['queries in the means', S(eA.nIncluded), S(eA2.nIncluded), S(eB.nIncluded), S(eB2.nIncluded)],
  ['precision', f6(eA.mean.precision), f6(eA2.mean.precision), f6(eB.mean.precision), f6(eB2.mean.precision)],
  ['recall', f6(eA.mean.recall), f6(eA2.mean.recall), f6(eB.mean.recall), f6(eB2.mean.recall)],
  ['MRR', f6(eA.mean.mrr), f6(eA2.mean.mrr), f6(eB.mean.mrr), f6(eB2.mean.mrr)],
  ['MAP', f6(eA.mean.map), f6(eA2.mean.map), f6(eB.mean.map), f6(eB2.mean.map)],
  ['nDCG', f6(eA.mean.ndcg), f6(eA2.mean.ndcg), f6(eB.mean.ndcg), f6(eB2.mean.ndcg)],
]);
must('the threshold reverses the MAP order', eA.mean.map > eB.mean.map && eB2.mean.map > eA2.mean.map, `${eA2.mean.map} ${eB2.mean.map}`);
must('nDCG does not move with the threshold', eA.mean.ndcg === eA2.mean.ndcg && eB.mean.ndcg === eB2.mean.ndcg, 'ndcg');
w();
must('grade 1 gives the higher precision and the lower recall for both systems', eA.mean.precision > eA2.mean.precision && eB.mean.precision > eB2.mean.precision && eA.mean.recall < eA2.mean.recall && eB.mean.recall < eB2.mean.recall, 'direction');
w(`At grade 1 system A has the higher MAP; at grade 2 system B does. Counting grade 1 as relevant gives each system a higher precision at ${K} (more of its top ${K} counts) and a lower recall (more relevant passages to find), for both systems (checked). nDCG is identical in both columns (checked): the gain uses every grade and the threshold does not apply to it. A comparison states its threshold.`);

/* ============================================================ SECTION 12 */

section('ndcg', 'Graded relevance: DCG, the ideal ranking, linear and exponential gain, and unjudged passages', ['Professional m02']);
w(`THE DEFINITION (the engine's basis, verbatim): ${mb.basis.ndcg}.`);
w();
const mbe = success('retrievalMetrics stated exponential', EV.retrievalMetrics({ ranking: ['c', 'a', 'x', 'b', 'd'], judgments: { a: 3, b: 2, c: 0, d: 1, e: 2 }, k: K, gain: 'exponential' }));
w(`THE STATED RANKING again, c, a, x, b, d, judgments a 3, b 2, c 0, d 1, e 2, k ${K}. Each rank's gain and discount (derived):`);
w();
const JG = { a: 3, b: 2, c: 0, d: 1, e: 2 };
table(['rank', 'passage', 'grade', 'discount log2(rank + 1)', 'linear gain / discount', 'exponential gain 2^g - 1', 'exponential gain / discount'], ['c', 'a', 'x', 'b', 'd'].map((id, i) => {
  const g = JG[id] || 0; const dsc = Math.log2(i + 2);
  return [S(i + 1), id, S(g), f6(dsc), f6(g / dsc), S(2 ** g - 1), f6((2 ** g - 1) / dsc)];
}));
w();
w(`THE IDEAL RANKING sorts every judged grade for the query descending, retrieved or not: 3, 2, 2, 1, 0. Its DCG at ${K} is the ideal DCG.`);
w();
table(['gain', 'DCG', 'ideal DCG', 'nDCG'], [['linear', f6(mb.dcg), f6(mb.idcg), f6(mb.ndcg)], ['exponential', f6(mbe.dcg), f6(mbe.idcg), f6(mbe.ndcg)]]);
must('the ideal DCG uses e, which was never retrieved', nearly(mb.idcg, 3 + 2 / Math.log2(3) + 2 / 2 + 1 / Math.log2(5)), mb.idcg);
w();
w('The ideal counts e\'s grade 2 although no system retrieved e: building the ideal from the retrieved passages alone would reward a system for missing a good passage.');
w();
const eAe = success('evaluateRetrieval A exponential', EV.evaluateRetrieval({ runs: RUNS('A'), judgments: J, k: K, gain: 'exponential' }));
const eBe = success('evaluateRetrieval B exponential', EV.evaluateRetrieval({ runs: RUNS('B'), judgments: J, k: K, gain: 'exponential' }));
w(`ON THE EKENE QUERIES, k ${K}, per query:`);
w();
table(['query', 'A nDCG linear', 'A nDCG exponential', 'B nDCG linear', 'B nDCG exponential'], eA.perQuery.map((r, i) => [r.query, f6(r.ndcg), f6(eAe.perQuery[i].ndcg), f6(eB.perQuery[i].ndcg), f6(eBe.perQuery[i].ndcg)]));
w();
w(`Mean nDCG at ${K} over the ${eA.nIncluded} included queries: linear gain, A ${f6(eA.mean.ndcg)} and B ${f6(eB.mean.ndcg)}; exponential gain, A ${f6(eAe.mean.ndcg)} and B ${f6(eBe.mean.ndcg)}. Exponential gain makes a grade 3 passage worth ${2 ** 3 - 1} against a grade 2's ${2 ** 2 - 1}, so it rewards putting the answering passage first.`);
must('B has the higher mean nDCG on both gains', eB.mean.ndcg > eA.mean.ndcg && eBe.mean.ndcg > eAe.mean.ndcg, 'ndcg');
w(`System B has the higher mean nDCG on both gains; the difference is ${eX(eB.mean.ndcg - eA.mean.ndcg)} linear and ${eX(eBe.mean.ndcg - eAe.mean.ndcg)} exponential (derived). Whether a difference that small means anything is the question of ${ref('compare')}.`);
w();
const g1only = success('retrievalMetrics grade 1 only at threshold 2', EV.retrievalMetrics({ ranking: ['EKD-013', 'EKD-014'], judgments: { 'EKD-013': 1, 'EKD-014': 1, 'EKD-018': 0 }, k: K, relevantGrade: 2 }));
w(`nDCG AND THE THRESHOLD. A stated query whose judged passages are graded 1, 1 and 0, ranked EKD-013, EKD-014, at relevantGrade 2: recall and AP are returned as null (${g1only.notes.recall}), and nDCG is ${f6(g1only.ndcg)}, because grade 1 still carries gain.`);
must('grade-1-only: nDCG defined at threshold 2', g1only.ndcg === 1 && g1only.recall === null, JSON.stringify(g1only.notes));
w();
w(`UNJUDGED PASSAGES. A passage nobody judged counts as grade 0, and the engine counts how many were retrieved (unjudgedRetrieved). The judged set was pooled from both systems' top ${K}, so at k ${K} system A retrieves ${sum(eA.perQuery.map((r) => r.unjudgedRetrieved))} unjudged passages and system B ${sum(eB.perQuery.map((r) => r.unjudgedRetrieved))}. What happens outside the pool is shown in ${ref('judged')}.`);
must('no unjudged passage in either system\'s top 5', sum(eA.perQuery.map((r) => r.unjudgedRetrieved)) === 0 && sum(eB.perQuery.map((r) => r.unjudgedRetrieved)) === 0, 'pool');

/* ============================================================ SECTION 13 */

section('answers', 'Short answers: SQuAD normalisation, exact match and token F1', ['Professional m03']);
const am0 = EV.answerMatch({ prediction: 'x', truth: 'x' });
w('THE CONVENTION (the engine\'s basis, verbatim):');
w();
Object.entries(am0.basis).forEach(([k2, v]) => w(`- ${k2}: ${v}`));
w();
const NORMX = ['2,096 psia', '45.0 percent', '45 percent', 'Ekene-3', 'Ekene 3', 'The Ekene Sand', 'a 2 kg wrench', 'near-miss', 'near miss', '0.5 bbl', 'the', ''];
table(['text (stated)', 'normalised', 'tokens'], NORMX.map((t) => { const r = success(`normalizeAnswer ${t}`, EV.normalizeAnswer({ text: t })); return [t === '' ? '(empty)' : `\`${t}\``, r.normalized === '' ? '(empty)' : `\`${r.normalized}\``, S(r.tokens.length)]; }));
w();
w('"45.0 percent" normalises to "450 percent": dropping the decimal point joins the digits. So it does not match "45 percent". "Ekene-3" becomes "ekene3" and does not match "Ekene 3", which becomes "ekene 3". "the" normalises to nothing.');
must('45.0 percent normalises to 450 percent', EV.normalizeAnswer({ text: '45.0 percent' }).normalized === '450 percent', '450');
w();
const MX = (s) => SYS[s].answers.map((a) => [a.query, success(`answerMatch ${s} ${a.query}`, EV.answerMatch({ prediction: a.short, truth: REF[a.query] }))]);
const mA = MX('A'); const mB = MX('B');
w('BOTH SYSTEMS\' SHORT ANSWERS against the reference:');
w();
table(['query', 'reference', 'A short answer', 'A exact', 'A F1', 'B short answer', 'B exact', 'B F1'], QS.map((q, i) => [q.id, REF[q.id] || '(empty)', ANS('A')[q.id].short || '(empty)', mA[i][1].exactMatch ? '1' : '0', f6(mA[i][1].f1), ANS('B')[q.id].short || '(empty)', mB[i][1].exactMatch ? '1' : '0', f6(mB[i][1].f1)]));
const emA = mA.filter(([, r]) => r.exactMatch).length; const emB = mB.filter(([, r]) => r.exactMatch).length;
const f1A = sum(mA.map(([, r]) => r.f1)) / QS.length; const f1B = sum(mB.map(([, r]) => r.f1)) / QS.length;
w();
w(`Exact matches: system A ${emA} of ${QS.length}, system B ${emB} of ${QS.length}. Mean token F1 over the ${QS.length} (derived, the mean of the column): A ${f6(f1A)}, B ${f6(f1B)}.`);
must('exact match 20 and 13', emA === 20 && emB === 13, `${emA} ${emB}`);
const a13 = mA[12][1]; const a24 = mA[23][1]; const a14 = mA[13][1];
planted(5, a24.exactMatch === true && a24.f1 === 1, JSON.stringify(a24));
planted(6, a14.f1 === 0 && a14.exactMatch === false, JSON.stringify(a14));
w();
w(`Read four rows. A's Q13 "45 percent" against "45.0 percent" scores exact 0 and F1 ${f6(a13.f1)}: the same quantity, different normalised tokens. A's Q24 is empty and so is the reference, which scores exact 1 and F1 1, a correct abstention. A's Q14 is empty against "water free": F1 0. B's Q16 lists two of the four wells: F1 ${f6(mB[15][1].f1)}, partial credit.`);
w();
const mr = success('answerMatch repeated tokens', EV.answerMatch({ prediction: PROBE.multiset[0], truth: PROBE.multiset[1] }));
w(`TOKEN F1 BY MULTISET. "${PROBE.multiset[0]}" against "${PROBE.multiset[1]}" (stated) has ${mr.commonTokens} common tokens (each token counted as often as it appears in both), precision ${f6(mr.precision)}, recall ${f6(mr.recall)}, F1 ${f6(mr.f1)}.`);
must('multiset common tokens 2', mr.commonTokens === 2, mr.commonTokens);

/* ============================================================ SECTION 14 */

section('extraction', 'Field extraction: cells, the four outcomes, tolerances, micro and macro', ['Professional m04']);
const xA = success('scoreExtraction A', EV.scoreExtraction({ labels: LABELS, predictions: PRED.A, fields: FIELDS }));
const xB = success('scoreExtraction B', EV.scoreExtraction({ labels: LABELS, predictions: PRED.B, fields: FIELDS }));
w('THE CONVENTION (the engine\'s basis, verbatim):');
w();
Object.entries(xA.basis).forEach(([k2, v]) => w(`- ${k2}: ${v}`));
w();
w(`A CELL is one field of one record: ${xA.nRecords} records x ${FIELDS.length} fields = ${xA.overall.n} cells. System A returned ${xA.nPredicted} records and system B ${xB.nPredicted}.`);
w();
table(['overall', 'system A', 'system B'], [
  ['correct', S(xA.overall.correct), S(xB.overall.correct)], ['of which both empty', S(xA.overall.correctEmpty), S(xB.overall.correctEmpty)],
  ['wrong', S(xA.overall.wrong), S(xB.overall.wrong)], ['missed', S(xA.overall.missed), S(xB.overall.missed)], ['unsupported', S(xA.overall.unsupported), S(xB.overall.unsupported)],
  ['micro accuracy', f6(xA.overall.microAccuracy), f6(xB.overall.microAccuracy)], ['macro accuracy', f6(xA.overall.macroAccuracy), f6(xB.overall.macroAccuracy)],
  ['precision on filled cells', f6(xA.overall.precision), f6(xB.overall.precision)], ['recall on filled cells', f6(xA.overall.recall), f6(xB.overall.recall)],
  ['micro F1', f6(xA.overall.microF1), f6(xB.overall.microF1)], ['macro F1', f6(xA.overall.macroF1), f6(xB.overall.macroF1)],
]);
must('A micro accuracy 0.972222 and B 0.916667', f6(xA.overall.microAccuracy) === '0.972222' && f6(xB.overall.microAccuracy) === '0.916667', `${xA.overall.microAccuracy}`);
must('macro accuracy equals micro for both systems', nearly(xA.overall.macroAccuracy, xA.overall.microAccuracy) && nearly(xB.overall.macroAccuracy, xB.overall.microAccuracy), 'macro');
must('macro F1 differs from micro F1', Math.abs(xA.overall.macroF1 - xA.overall.microF1) > 1e-3, `${xA.overall.macroF1} ${xA.overall.microF1}`);
w();
w(`ACCURACY IS INFLATED BY EMPTY CELLS. ${xA.overall.correctEmpty} of system A's ${xA.overall.correct} correct cells are correct because both sides are empty. Precision and recall count filled cells only, which is why they sit beside accuracy.`);
w();
w(`MICRO AND MACRO. Micro pools every cell; macro averages the per-field figures. Every labelled record is scored on every field, so each field has the same ${xA.nRecords} cells and macro accuracy equals micro accuracy by construction (checked for both systems, differences ${eX(xA.overall.macroAccuracy - xA.overall.microAccuracy)} and ${eX(xB.overall.macroAccuracy - xB.overall.microAccuracy)}). F1 counts filled cells, which differ by field, so micro and macro F1 differ: system A ${f6(xA.overall.microF1)} against ${f6(xA.overall.macroF1)}.`);
w();
table(['field', 'type', 'A correct', 'A wrong', 'A missed', 'A unsupported', 'A F1', 'B correct', 'B wrong', 'B missed', 'B unsupported', 'B F1'], xA.perField.map((f, i) => { const g = xB.perField[i]; return [f.field, f.type, S(f.correct), S(f.wrong), S(f.missed), S(f.unsupported), f6(f.f1), S(g.correct), S(g.wrong), S(g.missed), S(g.unsupported), f6(g.f1)]; }));
w();
const cellsOf = (x) => x.perRecord.flatMap((r) => Object.entries(r.fields).filter(([, c]) => c.outcome !== 'correct').map(([f, c]) => [r.id, f, c]));
const bad = (x, s) => cellsOf(x).map(([id, f, c]) => [s, id, f, c.label === null ? '(empty)' : S(c.label), c.prediction === null ? '(empty)' : `\`${S(c.prediction)}\``, c.outcome, c.reason.replace(/\|/g, '\\|')]);
w('EVERY CELL THAT IS NOT CORRECT, with the engine\'s reason:');
w();
const BADROWS = [...bad(xA, 'A'), ...bad(xB, 'B')];
table(['system', 'record', 'field', 'label', 'prediction', 'outcome', 'reason (verbatim)'], BADROWS);
const find = (s, id, f, o) => BADROWS.some((r) => r[0] === s && r[1] === id && r[2] === f && r[5] === o);
planted(14, find('A', 'EKD-020', 'water_cut_pct', 'missed'), 'EKD-020');
planted(15, find('A', 'EKD-027', 'water_cut_pct', 'unsupported'), 'EKD-027');
planted(16, find('A', 'EKD-036', 'reservoir_pressure_psia', 'unsupported'), 'EKD-036');
planted(17, find('A', 'EKD-044', 'event', 'wrong'), 'EKD-044');
planted(18, find('B', 'EKD-003', 'well', 'wrong'), 'EKD-003 well');
planted(19, find('B', 'EKD-003', 'oil_rate_bopd', 'wrong') && BADROWS.some((r) => r[1] === 'EKD-003' && /not a plain number/.test(r[6])), 'EKD-003 rate');
planted(20, xB.perRecord.filter((r) => !r.predicted).map((r) => r.id).join() === 'EKD-053,EKD-056', xB.perRecord.filter((r) => !r.predicted).map((r) => r.id).join());
planted(21, find('B', 'EKD-013', 'well', 'unsupported') && find('B', 'EKD-029', 'water_cut_pct', 'unsupported'), 'wrong well');
w();
must('B EKD-032 is correct on the tolerance and EKD-033 wrong', xB.perRecord.find((r) => r.id === 'EKD-032').fields.oil_rate_bopd.outcome === 'correct' && xB.perRecord.find((r) => r.id === 'EKD-033').fields.oil_rate_bopd.outcome === 'wrong', 'tol');
const cellOf = (x, id, f) => x.perRecord.find((r) => r.id === id).fields[f];
w(`System A's "${cellOf(xA, 'EKD-013', 'reservoir_pressure_psia').prediction}" for the label ${cellOf(xA, 'EKD-013', 'reservoir_pressure_psia').label} is correct: a number field reads digits with comma thousands groups. System B's ${cellOf(xB, 'EKD-032', 'oil_rate_bopd').prediction} against ${cellOf(xB, 'EKD-032', 'oil_rate_bopd').label} on EKD-032 is correct: the difference sits on the absTol ${FIELDS.find((f) => f.name === 'oil_rate_bopd').absTol}, the tolerance is inclusive, and the double computes it as ${S(xB.perRecord.find((r) => r.id === 'EKD-032').fields.oil_rate_bopd.difference)}. System B's ${cellOf(xB, 'EKD-033', 'oil_rate_bopd').prediction} against ${cellOf(xB, 'EKD-033', 'oil_rate_bopd').label} on EKD-033 is wrong: the double difference is ${S(cellOf(xB, 'EKD-033', 'oil_rate_bopd').difference)}, above ${FIELDS.find((f) => f.name === 'oil_rate_bopd').absTol}. System B did not return EKD-053 or EKD-056; a labelled record with no prediction is scored as all empty, so its filled labels are missed.`);
w();
const XT = { labels: [{ id: 'r1', fields: { q: 100, p: 3000 } }, { id: 'r2', fields: { q: 50, p: 1000 } }], predictions: [{ id: 'r1', fields: { q: '101', p: '3,003' } }, { id: 'r2', fields: { q: 50.6, p: 1002.5 } }] }; // stated records
const xt = success('scoreExtraction tolerances', EV.scoreExtraction({ ...XT, fields: [{ name: 'q', type: 'number', relTol: XT_TOL.qRel }, { name: 'p', type: 'number', absTol: XT_TOL.pAbs, relTol: XT_TOL.pRel }] }));
w(`A TOLERANCE IS INCLUSIVE, |prediction - label| <= max(absTol, relTol x |label|). Two stated records, q with relTol ${XT_TOL.qRel} and p with absTol ${XT_TOL.pAbs} and relTol ${XT_TOL.pRel}:`);
w();
table(['record', 'field', 'label', 'prediction', 'tolerance (derived)', 'outcome', 'difference'], xt.perRecord.flatMap((r) => Object.entries(r.fields).map(([f, c]) => [r.id, f, S(c.label), `\`${S(c.prediction)}\``, S(f === 'q' ? XT_TOL.qRel * c.label : Math.max(XT_TOL.pAbs, XT_TOL.pRel * c.label)), c.outcome, S(c.difference)])));
must('101 against 100 at relTol 0.01 is correct (on the boundary)', xt.perRecord[0].fields.q.outcome === 'correct', 'q');

/* ============================================================ SECTION 15 */

section('grounded', 'Groundedness and its limits: cited and retrieved, the reasons, grounded and correct', ['Professional m05']);
const cB = success('checkAnswers B', EV.checkAnswers({ answers: ANSWERS('B'), documents: DOCS, runs: RUNS('B') }));
const cBt = success('checkAnswers B reltol', EV.checkAnswers({ answers: ANSWERS('B'), documents: DOCS, runs: RUNS('B'), numericRelTol: TOL }));
const cBn = success('checkAnswers B no runs', EV.checkAnswers({ answers: ANSWERS('B'), documents: DOCS }));
w('A CLAIM IS SUPPORTED only by a passage that is both cited and retrieved. A citation to a passage that was not retrieved is flagged and supports nothing; a citation to an id that is not a passage is flagged unknown.');
w();
table([`figure (both systems, k ${K})`, 'system A', 'system B'], [
  ['claims', S(cA.nClaims), S(cB.nClaims)], ['supported', S(cA.nSupported), S(cB.nSupported)],
  ['pooled supported fraction', f6(cA.supportedFraction), f6(cB.supportedFraction)],
  ['mean of the per-answer fractions', f6(cA.meanAnswerSupportedFraction), f6(cB.meanAnswerSupportedFraction)],
  ['answers with a claim', S(cA.answersWithClaims), S(cB.answersWithClaims)], ['fully supported answers', S(cA.fullySupportedAnswers), S(cB.fullySupportedAnswers)],
  ['citations not retrieved', S(cA.notRetrievedCitations), S(cB.notRetrievedCitations)], ['unknown citations', S(cA.unknownCitations), S(cB.unknownCitations)],
  ['number claims supported / claims', `${cA.byKind.number.supported} / ${cA.byKind.number.claims}`, `${cB.byKind.number.supported} / ${cB.byKind.number.claims}`],
  ['date claims supported / claims', `${cA.byKind.date.supported} / ${cA.byKind.date.claims}`, `${cB.byKind.date.supported} / ${cB.byKind.date.claims}`],
  ['quote claims supported / claims', `${cA.byKind.quote.supported} / ${cA.byKind.quote.claims}`, `${cB.byKind.quote.supported} / ${cB.byKind.quote.claims}`],
]);
must('system B: 30 of 41 supported', cB.nClaims === 41 && cB.nSupported === 30, `${cB.nSupported}/${cB.nClaims}`);
w();
w(`Pooled and per-answer fractions answer different questions (the engine's basis: ${cA.basis.pooled}).`);
w();
w('SYSTEM B\'S UNSUPPORTED CLAIMS AND FLAGS, with the engine\'s reasons. Each reason says where the figure is: in a retrieved passage the answer does not cite (a citation error), in a cited passage that was not retrieved, only in other passages, or in no passage (a fabrication):');
w();
const unsB = cB.perAnswer.flatMap((r) => r.claims.filter((c) => !c.supported).map((c) => [r.query, c.text, c.reason]));
table(['query', 'claim', 'reason (verbatim)'], unsB);
w();
table(['query', 'flag (verbatim)'], cB.perAnswer.flatMap((r) => r.flags.map((f) => [r.query, f])));
const reasonOf = (rows, q, t) => (rows.find((r) => r[0] === q && r[1] === t) || [])[2] || '';
planted(7, /in no passage of the corpus/.test(reasonOf(unsB, 'Q01', '2,100')), reasonOf(unsB, 'Q01', '2,100'));
planted(8, /in no passage of the corpus/.test(reasonOf(unsB, 'Q07', '12.1')), reasonOf(unsB, 'Q07', '12.1'));
planted(9, /EKD-034, neither cited nor retrieved/.test(reasonOf(unsB, 'Q03', '92.7')) && /retrieved passage EKD-038, which the answer does not cite/.test(reasonOf(unsB, 'Q12', '9.625')), 'B Q03 Q12');
planted(11, cB.perAnswer.find((r) => r.query === 'Q15').flags.join().includes('EKD-059 was not retrieved'), 'Q15');
planted(12, cB.perAnswer.find((r) => r.query === 'Q21').flags.join().includes('EKD-061 is not a passage'), 'Q21');
planted(13, /date 2024-03-01 is not in the cited passage EKD-031/.test(reasonOf(unsB, 'Q24', '2024-03-01')), reasonOf(unsB, 'Q24', '2024-03-01'));
w();
const b05 = cB.perAnswer.find((r) => r.query === 'Q05');
planted(10, b05.nSupported === b05.nClaims && b05.claims[0].text === '2024-09-01' && mB[4][1].exactMatch === false, JSON.stringify(b05.claims));
w(`GROUNDED IS NOT CORRECT. System B's Q05 answer "${ANS('B').Q05.text}" is fully supported: the date is in EKD-027, which it cites and retrieved. EKD-027 is about Ekene-3's breakthrough; Ekene-6 broke through on the reference date ${REF.Q05}, and the short answer scores exact match 0. The check found the figure in the passage; it cannot know the passage is about another well.`);
w();
const a13c = cA.perAnswer.find((r) => r.query === 'Q13');
planted(4, a13c.claims.some((c) => c.text === '2025' && !c.supported), JSON.stringify(a13c.claims));
w(`HOW THE CHECK READS TEXT. System A's Q13 answer "${ANS('A').Q13.text}" says "the end of 2025". The claim grammar reads a bare year as the number "${a13c.claims.find((c) => c.kind === 'number' && Number.isInteger(c.value) && c.value > 1900).text}", which is not in EKD-030 (that passage writes the date "2025-12-01"), so the claim is unsupported although the answer is right: ${a13c.claims.find((c) => c.text === '2025').reason}. A deterministic check reads exactly the forms it states and no others.`);
w();
const coin = success('groundedness coincidence', EV.checkGroundedness({ answer: PROBE.coin, citations: ['EKD-025'], documents: DOCS }));
w(`A NUMBER CAN MATCH BY COINCIDENCE. The stated answer "${PROBE.coin}" citing EKD-025 (no retrieved list given) is supported: EKD-025 says "5 months". The check matches the value and ignores the unit: supported ${coin.nSupported} of ${coin.nClaims}.`);
must('5 bbl supported by 5 months', coin.nSupported === 1, coin.nSupported);
w();
const q01t = cBt.perAnswer.find((r) => r.query === 'Q01');
const q01c = q01t.claims.find((c) => c.kind === 'number'); const q01v = cellOf(xA, 'EKD-018', 'reservoir_pressure_psia').label;
w(`A STATED TOLERANCE. numericRelTol is 0 by default, so a number must equal a passage number. At ${S(TOL)}, |${q01c.value} - ${q01v}| = ${Math.abs(q01c.value - q01v)} is within ${S(TOL)} x ${q01v} (derived: ${S(TOL * q01v)}), so B's "${ANS('B').Q01.short}" is supported: system B then has ${cBt.nSupported} of ${cBt.nClaims} claims supported, ${f6(cBt.supportedFraction)}.`);
must('2,100 supported at 0.002', q01t.claims.find((c) => c.text === '2,100').supported === true, 'reltol');
w();
w(`WITHOUT THE RETRIEVED LISTS every cited passage of the corpus can support a claim: system B then has ${cBn.nSupported} of ${cBn.nClaims} supported (${f6(cBn.supportedFraction)}), because Q15's citation of EKD-059 now counts. The basis says which rule ran: "${cBn.basis.citations}".`);
must('without runs B gains the Q15 claim', cBn.nSupported === cB.nSupported + 1, `${cBn.nSupported} ${cB.nSupported}`);

/* ============================================================ SECTION 16 */

section('compare', 'Comparing two systems: per-query scores and the paired bootstrap', ['Professional m06', 'Expert m05 l03']);
const incA = eA.perQuery.filter((r) => r.nRelevant > 0); const incB = eB.perQuery.filter((r) => r.nRelevant > 0);
must('the two systems include the same queries in the same order', incA.map((r) => r.query).join() === incB.map((r) => r.query).join(), 'order');
const nA = incA.map((r) => r.ndcg); const nB = incB.map((r) => r.ndcg);
const apA = incA.map((r) => r.averagePrecision); const apB = incB.map((r) => r.averagePrecision);
w(`TWO SYSTEMS ON THE SAME QUERIES. Both systems answered the same ${incA.length} included queries, so each query gives a pair of scores and a difference. Per-query nDCG at ${K} (linear gain), A minus B (derived):`);
w();
table(['query', 'A nDCG', 'B nDCG', 'A minus B'], incA.map((r, i) => [r.query, f6(nA[i]), f6(nB[i]), f6(nA[i] - nB[i])]));
const wins = nA.filter((x, i) => x > nB[i]).length; const losses = nA.filter((x, i) => x < nB[i]).length;
w();
w(`A is higher on ${wins} queries, B on ${losses}, and they are equal on ${incA.length - wins - losses} (counted).`);
w();
const bA = success('bootstrapMean A nDCG', EV.bootstrapMean({ values: nA, seed: SEED, nBoot: NBOOT }));
const bB = success('bootstrapMean B nDCG', EV.bootstrapMean({ values: nB, seed: SEED, nBoot: NBOOT }));
must('the teaching replicate count is the engine default', NBOOT === EV.DEFAULTS.N_BOOT, NBOOT);
w(`THE BOOTSTRAP OF A MEAN (the engine's basis, verbatim): ${bA.basis.resampling}. Interval: ${bA.basis.interval}.`);
w();
table(['system', `mean nDCG at ${K}`, 'seed', 'replicates', 'level', `${bA.labels.lower}`, `${bA.labels.upper}`, 'standard error'], [
  ['A', f6(bA.mean), S(bA.seed), S(bA.nBoot), S(bA.level), f6(bA.lower), f6(bA.upper), f6(bA.standardError)],
  ['B', f6(bB.mean), S(bB.seed), S(bB.nBoot), S(bB.level), f6(bB.lower), f6(bB.upper), f6(bB.standardError)],
]);
w();
const pN = success('pairedBootstrap nDCG', EV.pairedBootstrap({ a: nA, b: nB, seed: SEED, nBoot: NBOOT }));
const uN = success('unpaired nDCG', EV.pairedBootstrap({ a: nA, b: nB, seed: SEED, nBoot: NBOOT, paired: false }));
const pAP = success('pairedBootstrap AP', EV.pairedBootstrap({ a: apA, b: apB, seed: SEED, nBoot: NBOOT }));
w(`THE PAIRED BOOTSTRAP (the engine's basis, verbatim): ${pN.basis.resampling}. The share (the engine's basis, verbatim): ${pN.basis.share}.`);
w();
table([`comparison, seed ${SEED}, ${NBOOT} replicates, level ${KD.LEVEL}`, 'difference A minus B', pN.labels.lower, pN.labels.upper, 'standard error', 'share at or below 0'], [
  [`nDCG at ${K}, paired`, f6(pN.difference), f6(pN.lower), f6(pN.upper), f6(pN.standardError), f6(pN.shareAtOrBelowZero)],
  [`nDCG at ${K}, unpaired`, f6(uN.difference), f6(uN.lower), f6(uN.upper), f6(uN.standardError), f6(uN.shareAtOrBelowZero)],
  [`AP at ${K}, paired`, f6(pAP.difference), f6(pAP.lower), f6(pAP.upper), f6(pAP.standardError), f6(pAP.shareAtOrBelowZero)],
]);
must('the unpaired interval is wider', (uN.upper - uN.lower) > (pN.upper - pN.lower), `${uN.upper - uN.lower} ${pN.upper - pN.lower}`);
must('both nDCG intervals straddle 0', pN.lower < 0 && pN.upper > 0 && pAP.lower < 0 && pAP.upper > 0, 'straddle');
const pD = success('bootstrap of differences', EV.bootstrapMean({ values: nA.map((x, i) => x - nB[i]), seed: SEED, nBoot: NBOOT }));
must('the paired bootstrap equals the bootstrap of the differences with the same seed', pD.lower === pN.lower && pD.upper === pN.upper, `${pD.lower} ${pN.lower}`);
w();
w(`Read the rows. The nDCG difference is ${f6(pN.difference)}, and its paired interval runs from ${f6(pN.lower)} to ${f6(pN.upper)}, across 0, as does the AP interval: on these ${incA.length} queries the data do not separate the two systems. The unpaired interval, ${f6(uN.lower)} to ${f6(uN.upper)}, is wider (width ${f6(uN.upper - uN.lower)} against ${f6(pN.upper - pN.lower)}, derived) because it ignores that both systems answered the same queries. The paired result is exactly the bootstrap of the per-query differences on the same seed (checked bit for bit).`);
w();
w(`THE SHARE AT OR BELOW 0 is ${f6(pN.shareAtOrBelowZero)} for nDCG: the share of replicates in which A did not beat B. It is a count of replicates, and the engine does not call it a p-value.`);
w();
const pN2 = success('paired seed + 1', EV.pairedBootstrap({ a: nA, b: nB, seed: SEED + 1, nBoot: NBOOT }));
w(`A SEED NAMES THE RESULT. On seed ${SEED + 1} the same paired nDCG interval is ${f6(pN2.lower)} to ${f6(pN2.upper)}. Quote a bootstrap figure with its seed, its replicate count and its level.`);

/* ============================================================ SECTION 17 */

section('kappa', 'Annotator agreement: observed, expected and Cohen\'s kappa, unweighted and weighted', ['Expert m01']);
const RA = []; const RB = [];
QS.forEach((q) => Object.keys(q.judgments).sort().forEach((d) => { RA.push(q.judgments[d]); RB.push(q.secondAnnotator[d]); }));
const kN = success('kappa none', EV.cohenKappa({ a: RA, b: RB }));
const kL = success('kappa linear', EV.cohenKappa({ a: RA, b: RB, weights: 'linear' }));
const kQ = success('kappa quadratic', EV.cohenKappa({ a: RA, b: RB, weights: 'quadratic' }));
w('THE CONVENTION (the engine\'s basis, verbatim):');
w();
Object.entries(kN.basis).forEach(([k2, v]) => w(`- ${k2}: ${v}`));
w(`- weights, linear: ${kL.basis.weights}`);
w(`- weights, quadratic: ${kQ.basis.weights}`);
w();
w(`THE TWO ANNOTATORS on all ${kN.n} judged pairs (rater a the primary grades, rater b the second annotator; pairs in query order, passages by id within a query). The confusion counts, rows a and columns b:`);
w();
table(['a \\ b', ...kN.labels.map(S), 'row total'], kN.confusion.map((r, i) => [S(kN.labels[i]), ...r.map(S), S(kN.rowTotals[i])]).concat([['column total', ...kN.columnTotals.map(S), S(kN.n)]]));
w();
table(['weights', 'observed agreement', 'expected agreement', 'observed disagreement', 'expected disagreement', 'kappa'], [kN, kL, kQ].map((k2) => [k2.weights, f6(k2.observedAgreement), f6(k2.expectedAgreement), f6(k2.observedDisagreement), f6(k2.expectedDisagreement), f6(k2.kappa)]));
must('kappa 0.579841, 0.675940, 0.771549', f6(kN.kappa) === '0.579841' && f6(kL.kappa) === '0.675940' && f6(kQ.kappa) === '0.771549', `${kN.kappa} ${kL.kappa} ${kQ.kappa}`);
w();
const offDiag = kN.n - sum(kN.confusion.map((r, i) => r[i]));
const oneApart = sum(kN.confusion.map((r, i) => sum(r.filter((_, j) => Math.abs(i - j) === 1))));
must('most disagreements are one grade apart', oneApart > offDiag / 2 && offDiag === 51 && oneApart === 40, `${oneApart}/${offDiag}`);
w(`The annotators agree on ${f6(kN.observedAgreement)} of the pairs; two raters labelling at random with these same row and column totals would agree on ${f6(kN.expectedAgreement)}. Kappa rescales the first against the second: unweighted ${f6(kN.kappa)}. Weighted kappa counts a disagreement of one grade as less serious than one of three: linear ${f6(kL.kappa)}, quadratic ${f6(kQ.kappa)}. ${oneApart} of the ${offDiag} disagreements are one grade apart (counted from the table), so the weighted figures are higher.`);
must('unweighted: 1 - (1-po)/(1-pe)', nearly(kN.kappa, 1 - (1 - kN.observedAgreement) / (1 - kN.expectedAgreement)), kN.kappa);
w();
const ks = success('kappa strings', EV.cohenKappa({ a: ['related', 'answers', 'none', 'relevant', 'answers', 'none'], b: ['relevant', 'answers', 'none', 'relevant', 'relevant', 'related'], labels: ['none', 'related', 'relevant', 'answers'], weights: 'linear' }));
w(`WORDS AS RATINGS. Weighted kappa uses the label positions, so words need their order given: six stated pairs on the labels none, related, relevant, answers, linear weights, kappa ${f6(ks.kappa)}. Without labels the engine refuses (${ref('refusals')}), because sorting the words alphabetically would put "answers" before "none".`);
w();
const b2a = RA.map((g) => (g >= 2 ? 1 : 0)); const b2b = RB.map((g) => (g >= 2 ? 1 : 0));
const b1a = RA.map((g) => (g >= 1 ? 1 : 0)); const b1b = RB.map((g) => (g >= 1 ? 1 : 0));
const kb2 = success('kappa binary 2', EV.cohenKappa({ a: b2a, b: b2b }));
const kb1 = success('kappa binary 1', EV.cohenKappa({ a: b1a, b: b1b }));
w(`AGREEMENT ON THE RELEVANT/NOT DECISION. Reduce each grade to relevant (1) or not (0) at a threshold (derived ratings): at grade 1 or more, kappa ${f6(kb1.kappa)} (observed agreement ${f6(kb1.observedAgreement)}); at grade 2 or more, kappa ${f6(kb2.kappa)} (observed agreement ${f6(kb2.observedAgreement)}). The threshold a metric uses is also a threshold the annotators have to agree on.`);
w();
w(`WHEN KAPPA HAS NO VALUE. If both raters give every item one and the same label, the expected disagreement is 0 and kappa is null with the reason quoted in ${ref('refusals')}.`);

/* ============================================================ SECTION 18 */

section('calibration', 'Calibration: the Brier score, the reliability table, ECE and MCE', ['Expert m02']);
const cal = success('calibration 10 bins', EV.calibration({ yTrue: Y, probabilities: P }));
w('THE CONVENTION (the engine\'s basis, verbatim):');
w();
['bins', 'brier', 'ece', 'mce'].forEach((k2) => w(`- ${k2}: \`${cal.basis[k2]}\``));
w();
w(`THE CALIBRATION SET. ${cal.n} rows, each a relevance classifier's probability that a passage is relevant to a query (given to 2 decimals) and the outcome, 1 when the judged grade is 2 or 3. The base rate, the share of outcomes that are 1, is ${f6(cal.baseRate)}.`);
w();
table(['bin', 'lower', 'upper', 'rows', 'mean probability', 'observed frequency', 'gap'], cal.table.map((t) => [S(t.bin), f6(t.lower), `${f6(t.upper)}${t.closedRight ? ' (closed)' : ''}`, S(t.n), f6(t.meanPredicted), f6(t.observedFrequency), f6(t.gap)]));
w();
w(`Brier score ${f6(cal.brier)}; ECE ${f6(cal.ece)}; MCE ${f6(cal.mce)}.`);
must('Brier 0.168382 ECE 0.2093 MCE 0.723333', f6(cal.brier) === '0.168382' && f6(cal.ece) === '0.209300' && f6(cal.mce) === '0.723333', `${cal.brier} ${cal.ece} ${cal.mce}`);
const over = cal.table.filter((t) => t.n > 0 && t.meanPredicted > t.observedFrequency).length;
w();
w(`In ${over} of the ${cal.bins} bins the mean probability is above the observed frequency: the classifier is over-confident there. The largest gap, the MCE, is in bin ${cal.table.findIndex((t) => t.gap === cal.mce)}, where ${cal.table.find((t) => t.gap === cal.mce).n} rows carry a mean probability of ${f6(cal.table.find((t) => t.gap === cal.mce).meanPredicted)} and none is relevant. ECE weights each gap by its bin's share of the rows, so a small bin moves ECE little and MCE a lot.`);
must('every non-empty bin over-confident', over === cal.table.filter((t) => t.n > 0).length, over);
w();
const c5 = success('calibration 5 bins', EV.calibration({ yTrue: Y, probabilities: P, bins: 5 }));
const c15 = success('calibration 15 bins', EV.calibration({ yTrue: Y, probabilities: P, bins: 15 }));
w(`THE BIN COUNT IS A CHOICE. The same rows at ${c5.bins}, ${cal.bins} and ${c15.bins} bins:`);
w();
table(['bins', 'Brier', 'ECE', 'MCE', 'empty bins'], [c5, cal, c15].map((c) => [S(c.bins), f6(c.brier), f6(c.ece), f6(c.mce), S(c.table.filter((t) => t.n === 0).length)]));
must('Brier does not depend on the bins', c5.brier === cal.brier && c15.brier === cal.brier, 'brier');
w();
const meanP = P.reduce((a, b) => a + b, 0) / P.length;
must('ECE is the same at 5, 10 and 15 bins and equals mean p minus the base rate', Math.abs(c5.ece - cal.ece) < 1e-12 && Math.abs(c15.ece - cal.ece) < 1e-12 && Math.abs(cal.ece - (meanP - cal.baseRate)) < 1e-12 && c5.mce !== cal.mce, `${c5.ece} ${c15.ece} ${meanP - cal.baseRate}`);
must('every non-empty bin is over-confident at 5 and 15 bins too', [c5, c15].every((c) => c.table.every((t) => t.n === 0 || t.meanPredicted > t.observedFrequency)), 'over');
w(`The Brier score is the same at every bin count (checked): it is a mean over rows and uses no bins. MCE changes with the bins. ECE does not, ON THIS SET: every non-empty bin is over-confident at ${c5.bins}, ${cal.bins} and ${c15.bins} bins alike (checked), so each gap is mean probability minus observed frequency, the weights n_k / N add the bins back together, and ECE comes to the mean probability minus the base rate, ${f6(meanP)} - ${f6(cal.baseRate)} = ${f6(meanP - cal.baseRate)} (derived), whatever the bins. On a set with bins on both sides of the diagonal the gaps no longer add up this way; quote each figure with its bin count.`);

/* ============================================================ SECTION 19 */

section('murphy', 'Decomposing the Brier score: reliability, resolution, uncertainty and the within-bin terms; the bin-edge rule; log loss', ['Expert m03']);
w(`THE DECOMPOSITION (the engine's basis, verbatim): ${cal.basis.murphy}.`);
w();
const M = cal.murphy;
table(['term', `value (${cal.bins} bins)`], [['reliability REL', f6(M.reliability)], ['resolution RES', f6(M.resolution)], ['uncertainty UNC', f6(M.uncertainty)], ['within-bin variance WBV', f6(M.withinBinVariance)], ['within-bin covariance term WBC (twice the pooled within-bin covariance)', f6(M.withinBinCovariance)], ['REL - RES + UNC + WBV - WBC', f6(M.sum)], ['Brier', f6(cal.brier)], ['closure, Brier minus the sum', eX(M.closure)]]);
must('the identity closes to rounding', Math.abs(M.closure) < 1e-15, M.closure);
w();
w(`The identity closes: the closure is ${eX(M.closure)}, rounding in the last bits. Without WBV and WBC, REL - RES + UNC would be ${f6(M.reliability - M.resolution + M.uncertainty)} (derived), which is not the Brier score. Uncertainty is base rate x (1 - base rate) = ${f6(cal.baseRate)} x ${f6(1 - cal.baseRate)} (derived); it depends on the outcomes alone. Reliability is small when each bin's mean probability matches its observed frequency; resolution is large when the bins' frequencies differ from the base rate.`);
must('UNC is the base rate term', nearly(M.uncertainty, cal.baseRate * (1 - cal.baseRate)), M.uncertainty);
w();
const c1 = success('calibration 1 bin', EV.calibration({ yTrue: Y, probabilities: P, bins: 1 }));
w(`ONE BIN. With every row in one bin, REL is (mean probability - base rate)^2 = ${f6(c1.murphy.reliability)} and RES is ${f6(c1.murphy.resolution)}: one bin cannot resolve anything.`);
must('one bin RES 0', c1.murphy.resolution === 0, c1.murphy.resolution);
w();
const cw = success('calibration within bin', EV.calibration({ yTrue: CW.y, probabilities: CW.p }));
const cwBin = cw.table.findIndex((t) => t.n > 0);
must('the within-bin rows share one bin', cw.table[cwBin].n === CW.p.length, cwBin);
w(`THE WITHIN-BIN TERMS. Six stated rows with probabilities ${CW.p.slice(0, -1).join(', ')} and ${CW.p[CW.p.length - 1]} and outcomes ${CW.y.join(', ')} all fall in bin ${cwBin}. WBV ${f6(cw.murphy.withinBinVariance)}, WBC ${f6(cw.murphy.withinBinCovariance)}, closure ${eX(cw.murphy.closure)}. The spread of the probabilities inside the bin is what WBV measures.`);
w();
const cwN = CW.p.length;
const cwO = CW.y.reduce((a, b) => a + b, 0) / cwN; const cwF = CW.p.reduce((a, b) => a + b, 0) / cwN;
const cwCov = CW.y.reduce((a, y, i) => a + (y - cwO) * (CW.p[i] - cwF), 0) / cwN;
must('WBC is twice the pooled within-bin covariance (one bin)', nearly(cw.murphy.withinBinCovariance, 2 * cwCov), `${cw.murphy.withinBinCovariance} vs ${2 * cwCov}`);
must('WBC is twice the pooled within-bin covariance (the Ekene rows)', (() => { let c = 0; const bi = (p) => { let k = 0; for (let i = 1; i < cal.bins; i += 1) if (i / cal.bins <= p) k = i; return k; }; const byB = {}; P.forEach((p, i) => { (byB[bi(p)] ||= []).push(i); }); Object.values(byB).forEach((ix) => { const o = ix.reduce((a, i) => a + Y[i], 0) / ix.length; const f = ix.reduce((a, i) => a + P[i], 0) / ix.length; ix.forEach((i) => { c += (Y[i] - o) * (P[i] - f); }); }); c /= P.length; return nearly(M.withinBinCovariance, 2 * c); })(), M.withinBinCovariance);
must('without the 2 the identity does not close', Math.abs(cw.brier - (cw.murphy.reliability - cw.murphy.resolution + cw.murphy.uncertainty + cw.murphy.withinBinVariance - cw.murphy.withinBinCovariance / 2)) > 1e-6, cw.murphy.withinBinCovariance);
const SCJ = /Stephenson, Coelho and Jolliffe (\d{4}), eq\. (\d+)\)/.exec(cal.basis.murphy);
must('the basis cites the paper and its equation', SCJ !== null, cal.basis.murphy);
w(`WBC AS THE PAPER LABELS IT. Stephenson, Coelho and Jolliffe (${SCJ[1]}) write the Brier score out in their eq. ${SCJ[2]} with five components; the fifth is -(2/N) sum over bins k and rows j in bin k of (y_kj - observed_k)(p_kj - mean p_k), and the line after eq. ${SCJ[2]} names the five BS = REL - RES + UNC + WBV - WBC. So WBC is (2/N) sum (y_kj - observed_k)(p_kj - mean p_k), the fifth term without its minus sign, and it carries the factor 2: WBC as the paper labels it is twice the pooled within-bin covariance, and the engine's WBC is the paper's. On the six rows above the pooled within-bin covariance, sum (y - observed)(p - mean p) / N with observed ${f6(cwO)} and mean p ${f6(cwF)}, is ${f6(cwCov)} (derived), and WBC is 2 x ${f6(cwCov)} = ${f6(2 * cwCov)} (derived), the engine's ${f6(cw.murphy.withinBinCovariance)}. Drop the 2 and the identity no longer closes.`);
w();
const edgeIdx = P.map((p, i) => [p, i]).filter(([p]) => { const i = Math.round(p * 10); return i >= 1 && i <= 9 && p === i / 10; });
w(`THE BIN-EDGE RULE. p is in bin i when i/M <= p < (i+1)/M, with the edges as computed in double precision, so a probability exactly on an interior edge OPENS the upper bin; 1 closes the last bin. Counted over the whole calibration set, ${edgeIdx.length} probabilities sit exactly on an interior edge at ${cal.bins} bins, with the values ${[...new Set(edgeIdx.map(([p]) => p))].sort().join(', ')}.`);
must('17 rows on interior edges', edgeIdx.length === 17, edgeIdx.length);
w();
// The library rule, DERIVED here (the engine does not implement it): an edge value goes to the LOWER bin.
const libBin = (p) => { let i = Math.min(9, Math.floor(p * 10)); const e = Math.round(p * 10); if (e >= 1 && e <= 9 && p === e / 10) i = e - 1; return i; };
const libT = Array.from({ length: 10 }, () => []);
P.forEach((p, j) => libT[libBin(p)].push(j));
const libRows = libT.map((js, k2) => { if (!js.length) return [k2, 0, null, null, null]; const pk = sum(js.map((j) => P[j])) / js.length; const ok = sum(js.map((j) => Y[j])) / js.length; return [k2, js.length, pk, ok, Math.abs(ok - pk)]; });
const libEce = sum(libRows.filter((r) => r[1]).map((r) => (r[1] / 200) * r[4]));
const libMce = Math.max(...libRows.filter((r) => r[1]).map((r) => r[4]));
const libRel = sum(libRows.filter((r) => r[1]).map((r) => r[1] * (r[2] - r[3]) ** 2)) / 200;
w('scikit-learn\'s calibration_curve puts an interior-edge value in the LOWER bin. Its table on these rows is DERIVED here by that rule (the engine does not implement it):');
w();
table(['bin', 'engine rows', 'library-rule rows (derived)', 'library-rule gap (derived)'], cal.table.map((t, i) => [S(i), S(t.n), S(libRows[i][1]), libRows[i][1] ? f6(libRows[i][4]) : 'null']));
w();
const diffBins = cal.table.filter((t, i) => t.n !== libRows[i][1]).length;
w(`By the library rule (derived): ECE ${f6(libEce)}, MCE ${f6(libMce)}, REL ${f6(libRel)}; by the engine: ECE ${f6(cal.ece)}, MCE ${f6(cal.mce)}, REL ${f6(M.reliability)}. ${diffBins} of the ${cal.bins} bins hold a different number of rows. The ECE difference is ${eX(libEce - cal.ece)} (derived): every bin here is over-confident, so moving an edge row between two over-confident bins leaves the pooled gap unchanged on this set. REL differs by ${eX(libRel - M.reliability)} (derived); MCE is the same here because the largest gap is in bin ${cal.table.findIndex((t) => t.gap === cal.mce)}, which holds no edge value. Name the rule when a table from this engine is compared with the library's.`);
must('library ECE equal to engine ECE within rounding, REL different, MCE equal', Math.abs(libEce - cal.ece) < 1e-12 && Math.abs(libRel - M.reliability) > 1e-4 && libMce === cal.mce && diffBins > 0, `${libEce} ${libRel} ${libMce}`);
w();
w(`LOG LOSS is imported from the machine learning engine, never re-implemented here: ${cal.basis.logLoss}. On this set it is ${f6(cal.logLoss)}, with eps ${S(cal.logLossEps)} and ${cal.logLossClipped} probabilities clipped (a probability of 0 or 1 would make the logarithm infinite).`);
const llDirect = ML.logLoss({ yTrue: Y, probabilities: P });
must('the calibration log loss is ml.js logLoss exactly', llDirect.logLoss === cal.logLoss && llDirect.clipped === cal.logLossClipped, `${llDirect.logLoss}`);
w('The figure is exactly what engines/dataai/ml.js logLoss returns on the same rows (checked). The machine learning course teaches log loss as a training loss.');

/* ============================================================ SECTION 20 */

section('judged', 'Judged sets, pooling, unjudged passages, a second annotator, and test questions in a prompt', ['Expert m04', 'Professional m02 l04']);
w(`HOW THE JUDGED SET WAS BUILT (fixture): ${QUERIES.pooling}. A judged set built this way is a POOL: the passages the pooled systems retrieved are judged, and every other passage is unjudged and counts as grade 0.`);
w();
const r10a = success('retrieve bm25 wide', EV.retrieve({ documents: DOCS, queries: QLIST, method: 'bm25', k: K_WIDE }));
const e10a = success('evaluate bm25 wide', EV.evaluateRetrieval({ runs: r10a.runs, judgments: J, k: K_WIDE }));
const r3 = success('retrieve third run', EV.retrieve({ documents: DOCS, queries: QLIST, method: 'bm25', k: K, b: B_THIRD, stopWords: true }));
const e3 = success('evaluate third run', EV.evaluateRetrieval({ runs: r3.runs, judgments: J, k: K }));
const uj10 = sum(e10a.perQuery.map((r) => r.unjudgedRetrieved)); const uj3 = sum(e3.perQuery.map((r) => r.unjudgedRetrieved));
w('OUTSIDE THE POOL. Two runs the pool did not come from (stated settings):');
w();
table(['run', 'unjudged passages retrieved, all queries', 'queries with an unjudged passage', 'mean precision', 'MAP', 'mean nDCG'], [
  [`system A's retriever at k ${K} (in the pool)`, S(sum(eA.perQuery.map((r) => r.unjudgedRetrieved))), S(eA.perQuery.filter((r) => r.unjudgedRetrieved).length), f6(eA.mean.precision), f6(eA.mean.map), f6(eA.mean.ndcg)],
  [`BM25 at k ${K_WIDE}`, S(uj10), S(e10a.perQuery.filter((r) => r.unjudgedRetrieved).length), f6(e10a.mean.precision), f6(e10a.mean.map), f6(e10a.mean.ndcg)],
  [`BM25 b ${B_THIRD}, stop list on, k ${K}`, S(uj3), S(e3.perQuery.filter((r) => r.unjudgedRetrieved).length), f6(e3.mean.precision), f6(e3.mean.map), f6(e3.mean.ndcg)],
]);
must('the runs outside the pool retrieve unjudged passages', uj10 > 0 && uj3 > 0, `${uj10} ${uj3}`);
w();
w('UNJUDGED AND IRRELEVANT ARE DIFFERENT. Each unjudged passage above was scored as grade 0 because nobody judged it, and some may answer the query. A run that finds good passages the pool never saw is marked down for it: that is POOLING BIAS, and it favours the systems the pool was built from. Report unjudgedRetrieved beside every score of a new system, and judge its unjudged passages before comparing it with the pooled ones.');
w();
const eAJ2 = success('evaluate A second annotator', EV.evaluateRetrieval({ runs: RUNS('A'), judgments: J2, k: K }));
const eBJ2 = success('evaluate B second annotator', EV.evaluateRetrieval({ runs: RUNS('B'), judgments: J2, k: K }));
w(`A SECOND ANNOTATOR AS A CHECK. The same runs scored against the second annotator's grades (k ${K}, grade 1):`);
w();
table(['judgments', 'queries in the means', 'A MAP', 'B MAP', 'A mean nDCG', 'B mean nDCG'], [
  ['primary', S(eA.nIncluded), f6(eA.mean.map), f6(eB.mean.map), f6(eA.mean.ndcg), f6(eB.mean.ndcg)],
  ['second annotator', S(eAJ2.nIncluded), f6(eAJ2.mean.map), f6(eBJ2.mean.map), f6(eAJ2.mean.ndcg), f6(eBJ2.mean.ndcg)],
]);
must('under the second annotator A leads on nDCG', eAJ2.mean.ndcg > eBJ2.mean.ndcg && eB.mean.ndcg > eA.mean.ndcg, 'flip');
w();
w(`On the primary grades B has the higher mean nDCG; on the second annotator's, A does. A difference between two systems smaller than the difference between two annotators is not a finding. ${eAJ2.excluded.length ? `Under the second annotator ${eAJ2.excluded.map((x) => x.query).join(', ')} is excluded.` : 'Under the second annotator no query is excluded.'}`);
w();
const leak = QS.map((q) => success(`leak ${q.id}`, EV.answerMatch({ prediction: q.reference, truth: q.reference })));
w(`TEST QUESTIONS IN A PROMPT. The reference answers are the key. A system whose instructions or examples contained them would return the key itself, and the engine scores that as ${leak.filter((r) => r.exactMatch).length} exact matches of ${QS.length} (computed: each reference against itself). No score can tell a leaked key from skill, so the judged queries and their references are kept out of every prompt, every example and every fine-tuning set, and a leak is prevented by process: the score cannot detect it.`);
must('a leaked key scores every exact match', leak.every((r) => r.exactMatch), 'leak');

/* ============================================================ SECTION 21 */

section('boundaries', 'Boundaries, rule by rule', ['Expert m05']);
w('Every rule has its own boundary; none is global. Each row below is probed by two engine calls, one at the boundary and one across it.');
w();
const B = [];
const brow = (fn, rule, at, across, cond, label) => { must(`BOUNDARY ${fn} ${rule}: ${label}`, cond, label); B.push([`\`${fn}\``, rule, at, across]); };
const ok = (r) => r && !r.error; const no = (r) => r && !!r.error;
brow('rankBm25, rankTfidf', 'ranked', 'a score above 0 is ranked', 'a score of 0 (no query term) is never ranked', q10.ranking.length === 2 && q10.matched === 2, 'ranked');
brow('ranking', 'tie', `equal ${KD.TIE_DIGITS}-digit keys tie and the id decides`, `keys that differ within ${KD.TIE_DIGITS} significant digits do not tie`, q10.ties.length === 1 && nt.ties.length === 0, 'tie');
const rgEq = EV.retrievalMetrics({ ranking: ['a'], judgments: { a: 2 }, k: 1, relevantGrade: 2 });
const rgBelow = EV.retrievalMetrics({ ranking: ['a'], judgments: { a: 1, b: 2 }, k: 1, relevantGrade: 2 });
brow('retrievalMetrics', 'relevant', 'a grade equal to relevantGrade is relevant', 'a grade one below is not', rgEq.hit === 1 && rgBelow.hit === 0, 'relevant');
brow('retrievalMetrics', 'precision at k', 'k ranked: relevant / k', 'fewer than k ranked: still divides by k', mb.precision === mb.relevantRetrieved / K && eA.perQuery.find((r) => r.query === 'Q10').retrieved < K && eA.perQuery.find((r) => r.query === 'Q10').precision === eA.perQuery.find((r) => r.query === 'Q10').relevantRetrieved / K, 'p@k');
const rrK = EV.retrievalMetrics({ ranking: ['x', 'y', 'a'], judgments: { a: 3 }, k: 3 });
const rrK1 = EV.retrievalMetrics({ ranking: ['x', 'y', 'a'], judgments: { a: 3 }, k: 2 });
brow('retrievalMetrics', 'reciprocal rank and AP', 'a relevant passage at rank k counts', 'at rank k + 1 it does not', rrK.reciprocalRank > 0 && rrK1.reciprocalRank === 0 && rrK1.averagePrecision === 0, 'rr');
brow('evaluateRetrieval', 'no relevant', 'one judged passage at the threshold: the query is included', 'none: excluded (default) or zeroed', eA.excluded.length === 1 && eA2.excluded.length === 1, 'norel');
brow('retrievalMetrics', 'nDCG', 'an ideal DCG above 0: a value', 'an ideal DCG of 0: null with the reason', nt4.ndcg === null && mb.ndcg !== null, 'ndcg');
const tolB = EV.scoreExtraction({ labels: [{ id: 'r', fields: { q: 100 } }], predictions: [{ id: 'r', fields: { q: 101 } }], fields: [{ name: 'q', type: 'number', absTol: 1 }] });
const tolB2 = EV.scoreExtraction({ labels: [{ id: 'r', fields: { q: 100 } }], predictions: [{ id: 'r', fields: { q: 101.5 } }], fields: [{ name: 'q', type: 'number', absTol: 1 }] });
brow('scoreExtraction', 'number match', '|p - l| equal to the tolerance: correct (inclusive)', 'above it: wrong', tolB.perRecord[0].fields.q.outcome === 'correct' && tolB2.perRecord[0].fields.q.outcome === 'wrong', 'tol');
const gTol = EV.checkGroundedness({ answer: PROBE.tol, citations: ['EKD-018'], documents: DOCS, numericRelTol: 4 / 2096 });
const gTol2 = EV.checkGroundedness({ answer: PROBE.tol, citations: ['EKD-018'], documents: DOCS, numericRelTol: 3.9 / 2096 });
brow('checkGroundedness', 'number match', '|c - v| equal to numericRelTol x |v|: supported', 'above it: unsupported; numericRelTol 0 means equal values', gTol.nSupported === 1 && gTol2.nSupported === 0, 'reltol');
brow('checkGroundedness', 'numericRelTol', 'from 0 up to just below 1 accepted', '1 refused', ok(EV.checkGroundedness({ answer: 'x', citations: [], documents: DOCS, numericRelTol: 0.999 })) && no(EV.checkGroundedness({ answer: 'x', citations: [], documents: DOCS, numericRelTol: 1 })), 'reltol range');
const emp = EV.scoreExtraction({ labels: [{ id: 'r', fields: { w: '' } }, { id: 's', fields: { w: '' } }], predictions: [{ id: 'r', fields: { w: '   ' } }, { id: 's', fields: { w: 'the' } }], fields: [{ name: 'w', type: 'text' }] });
brow('scoreExtraction', 'empty', 'null, absent or a blank string is empty', '"the" is a value (it normalises to nothing)', emp.perRecord[0].fields.w.outcome === 'correct' && emp.perRecord[1].fields.w.outcome === 'unsupported', 'empty');
const cg = EV.checkGroundedness({ answer: PROBE.comma, citations: [], documents: DOCS });
brow('checkGroundedness', 'comma groups', 'exactly three digits after a comma join the number', 'four digits: "12,1234" reads as "12" and "1234"', cg.claims.map((c) => c.value).join() === [12, 1234, 12123].join(), 'comma');
const mn = EV.checkGroundedness({ answer: PROBE.minus, citations: [], documents: DOCS });
brow('checkGroundedness', 'minus sign', 'after a space: "-2" is a negative number', 'after a letter or digit: "Ekene-2" is an identifier', mn.claims.length === 1 && mn.claims[0].value === -2, 'minus');
const dt = EV.checkGroundedness({ answer: PROBE.date, citations: [], documents: DOCS });
brow('checkGroundedness', 'date', 'YYYY-MM-DD touching no letter or digit is a date', '"2023-01-01x" is read as numbers', dt.claims[0].kind === 'date' && dt.claims.slice(1).every((c) => c.kind === 'number'), 'date');
const ce = EV.calibration({ yTrue: [0, 1, 0, 1, 1, 0, 1], probabilities: [0.0, 0.1, 0.2, 0.3, 0.7, 0.9, 1.0] });
brow('calibration', 'bin edge', 'p = i / M opens bin i', 'scikit-learn closes bin i - 1 at that value', ce.table[3].n === 1 && ce.table[2].n === 1, 'edge');
brow('calibration', 'last bin', 'p = 1 is in bin M - 1 (closed)', 'no bin above it', ce.table[9].n === 2, 'last');
brow('cohenKappa', 'expected disagreement', 'above 0: a kappa', '0: null with the reason', nt8.kappa === null && kN.kappa !== null, 'kappa');
const sh = EV.pairedBootstrap({ a: [1, 1], b: [1, 1], seed: 1, nBoot: 10 });
brow('pairedBootstrap', 'share at or below 0', 'a replicate exactly 0 is counted', 'only replicates above 0 are not', sh.shareAtOrBelowZero === 1, 'share');
brow('bootstrapMean, pairedBootstrap', 'level', `${list(EV.DEFAULTS.LEVELS.map(S))} accepted`, 'any other level refused', EV.DEFAULTS.LEVELS.every((l) => ok(EV.bootstrapMean({ values: [1, 2], seed: 1, nBoot: 2, level: l }))) && no(EV.bootstrapMean({ values: [1, 2], seed: 1, level: 0.975 })), 'level');
brow('bootstrapMean, pairedBootstrap', 'seed', `0 and ${SEED_MAX} accepted`, `-1 and ${SEED_MAX + 1} refused`, ok(EV.bootstrapMean({ values: [1, 2], seed: 0, nBoot: 2 })) && ok(EV.bootstrapMean({ values: [1, 2], seed: SEED_MAX, nBoot: 2 })) && no(EV.bootstrapMean({ values: [1, 2], seed: -1 })) && no(EV.bootstrapMean({ values: [1, 2], seed: SEED_MAX + 1 })), 'seed');
brow('bootstrapMean', 'values', '2 values accepted', '1 refused', ok(EV.bootstrapMean({ values: [1, 2], seed: 1, nBoot: 2 })) && no(EV.bootstrapMean({ values: [1], seed: 1 })), 'values');
brow('retrievalMetrics', 'grade', `0 and ${EV.DEFAULTS.MAX_GRADE} accepted`, `${list(GRADE_BAD.map(S))} refused`, ok(EV.retrievalMetrics({ ranking: [], judgments: { a: 0, b: EV.DEFAULTS.MAX_GRADE } })) && GRADE_BAD.every((g) => no(EV.retrievalMetrics({ ranking: [], judgments: { a: g } }))), 'grade');
brow('rankBm25', 'k1 and b', 'k1 0 and b 0 and 1 accepted', 'k1 below 0 and b outside 0 to 1 refused', ok(EV.rankBm25({ documents: HAND, query: 'oil', k1: 0, b: 0 })) && ok(EV.rankBm25({ documents: HAND, query: 'oil', b: 1 })) && no(EV.rankBm25({ documents: HAND, query: 'oil', k1: -0.001 })) && no(EV.rankBm25({ documents: HAND, query: 'oil', b: 1.001 })), 'k1 b');
table(['function', 'rule', 'at the boundary', 'across it'], B);
w();
w(`${B.length} rules, each probed by a call either side.`);

/* ============================================================ SECTION 22 */

section('caps', 'Size caps, the tie key and the bootstrap levels and labels', ['Expert m05']);
w('THE CAPS trade time for size. Each is probed at the cap (accepted) and one above (refused):');
w();
const CAPS = [];
const cap = (name, v, okCall, noCall) => { const a = okCall(); const b2 = noCall(); must(`CAP ${name} accepted at the cap`, ok(a), a && a.error); must(`CAP ${name} refused above`, no(b2), b2 && b2.error); CAPS.push([`\`${name}\``, S(v), b2.error]); };
const md = EV.DEFAULTS;
cap('MAX_DOCS', md.MAX_DOCS, () => EV.rankBm25({ documents: MANY_DOCS.slice(0, md.MAX_DOCS), query: 'oil', k: 1 }), () => EV.rankBm25({ documents: MANY_DOCS, query: 'oil', k: 1 }));
cap('MAX_CHARS', md.MAX_CHARS, () => EV.tokenize({ text: 'x'.repeat(md.MAX_CHARS) }), () => EV.tokenize({ text: LONG }));
cap('MAX_QUERIES', md.MAX_QUERIES, () => EV.retrieve({ documents: HAND, queries: MANY_Q.slice(0, md.MAX_QUERIES), method: 'bm25', k: 1 }), () => EV.retrieve({ documents: HAND, queries: MANY_Q, method: 'bm25', k: 1 }));
cap('MAX_K', md.MAX_K, () => EV.rankBm25({ documents: HAND, query: 'oil', k: md.MAX_K }), () => EV.rankBm25({ documents: HAND, query: 'oil', k: md.MAX_K + 1 }));
const recs = (n) => Array.from({ length: n }, (_, i) => ({ id: `r${i}`, fields: { w: 'x' } }));
cap('MAX_RECORDS', md.MAX_RECORDS, () => EV.scoreExtraction({ labels: recs(md.MAX_RECORDS), predictions: [], fields: [{ name: 'w', type: 'text' }] }), () => EV.scoreExtraction({ labels: recs(md.MAX_RECORDS + 1), predictions: [], fields: [{ name: 'w', type: 'text' }] }));
const flds = (n) => Array.from({ length: n }, (_, i) => ({ name: `f${i}`, type: 'text' }));
cap('MAX_FIELDS', md.MAX_FIELDS, () => EV.scoreExtraction({ labels: XL.map((r) => ({ id: r.id, fields: {} })), predictions: [], fields: flds(md.MAX_FIELDS) }), () => EV.scoreExtraction({ labels: XL, predictions: [], fields: flds(md.MAX_FIELDS + 1) }));
const ansN = (n) => Array.from({ length: n }, (_, i) => ({ query: `q${i}`, text: 'x', citations: [] }));
cap('MAX_ANSWERS', md.MAX_ANSWERS, () => EV.checkAnswers({ answers: ansN(md.MAX_ANSWERS), documents: HAND }), () => EV.checkAnswers({ answers: ansN(md.MAX_ANSWERS + 1), documents: HAND }));
const rows = (n) => Array.from({ length: n }, (_, i) => i % 2);
cap('MAX_ROWS', md.MAX_ROWS, () => EV.calibration({ yTrue: rows(md.MAX_ROWS), probabilities: rows(md.MAX_ROWS).map(() => 0.5) }), () => EV.calibration({ yTrue: rows(md.MAX_ROWS + 1), probabilities: rows(md.MAX_ROWS + 1).map(() => 0.5) }));
const labs = (n) => Array.from({ length: n }, (_, i) => i);
cap('MAX_LABELS', md.MAX_LABELS, () => EV.cohenKappa({ a: [0, 1], b: [1, 0], labels: labs(md.MAX_LABELS) }), () => EV.cohenKappa({ a: [0, 1], b: [1, 0], labels: labs(md.MAX_LABELS + 1) }));
cap('MAX_BINS', md.MAX_BINS, () => EV.calibration({ yTrue: [0, 1], probabilities: [0.2, 0.8], bins: md.MAX_BINS }), () => EV.calibration({ yTrue: [0, 1], probabilities: [0.2, 0.8], bins: md.MAX_BINS + 1 }));
const vals = (n) => Array.from({ length: n }, (_, i) => (i % 7) / 7);
cap('MAX_VALUES', md.MAX_VALUES, () => EV.bootstrapMean({ values: vals(md.MAX_VALUES), seed: 1, nBoot: 2 }), () => EV.bootstrapMean({ values: vals(md.MAX_VALUES + 1), seed: 1, nBoot: 2 }));
cap('MAX_BOOT', md.MAX_BOOT, () => EV.bootstrapMean({ values: [1, 2], seed: 1, nBoot: md.MAX_BOOT }), () => EV.bootstrapMean({ values: [1, 2], seed: 1, nBoot: md.MAX_BOOT + 1 }));
table(['cap', 'value', 'the refusal one above (verbatim)'], CAPS);
w();
w(`THE TIE KEY. ${md.TIE_DIGITS} significant digits (${ref('ranking')}). A score is a sum of floating-point terms, and two passages with the same text can land a few bits apart when their terms are added in a different order; the key absorbs that, and a difference the key sees is a real difference in the inputs.`);
w();
w('THE BOOTSTRAP LEVELS AND THEIR LABELS. level is one of the four accepted values. Each interval is a percentile of a statistic, so it is labelled as a parameter percentile (lib/conventions/percentile.js), and never with a P label, which the platform keeps for outcomes:');
w();
const LV = md.LEVELS.map((l) => { const r = success(`bootstrap level ${l}`, EV.bootstrapMean({ values: nA, seed: SEED, nBoot: NBOOT, level: l })); return [S(l), r.labels.lower, r.labels.upper, f6(r.lower), f6(r.upper)]; });
table(['level', 'lower label (verbatim)', 'upper label (verbatim)', 'lower, A nDCG, seed ' + SEED, 'upper'], LV);
must('the 0.95 labels are 2.5th and 97.5th', LV[2][1] === '2.5th percentile of the bootstrap mean' && LV[2][2] === '97.5th percentile of the bootstrap mean', LV[2][1]);
w();
const tailF = (1 - KD.LEVEL) / 2; const tailR = Math.round(tailF * 10 ** TAIL_DECIMALS) / 10 ** TAIL_DECIMALS;
must('the float tail is off its rounded value and the rounding reads twelve decimals', tailF !== tailR && TAIL_DECIMALS === 12, `${tailF} ${TAIL_DECIMALS}`);
w(`The tails at level ${KD.LEVEL} are ${S(tailR)} and ${S(1 - tailR)}. In floating point (1 - ${KD.LEVEL}) / 2 is ${S(tailF)}, which would move the quantile index off a whole number, so the engine rounds each tail to ${TAIL_DECIMALS} decimals first (read from its source). A fixed list of levels keeps every label a well-formed ordinal.`);

/* ============================================================ SECTION 23 */

section('choices', 'Conventions that are choices, what is not built, and the evaluation report', ['Expert m06']);
w('Every convention below is a choice the engine states in its basis. Each has a real alternative in common use; name the choice when a number from this engine is compared with one from another tool.');
w();
table(['convention', 'this engine', 'a common alternative', 'why the engine chose it'], [
  ['tokens', 'ASCII lowercase, split outside [a-z0-9], single characters kept, no stemming', 'a word pattern of two characters or more (scikit-learn\'s default), stemming', 'a learner can tokenise by hand, and single-character tokens such as well numbers matter'],
  ['stop list', 'off', 'on', 'the list removes well, top, bottom, fire and system'],
  ['TF-IDF', 'raw counts, smooth idf ln((1 + N) / (1 + df)) + 1, unit vectors', 'unsmoothed idf, other norms', 'scikit-learn\'s defaults, so a figure compares directly'],
  ['BM25 idf', 'Lucene ln(1 + (N - df + 0.5) / (df + 0.5))', 'the Robertson form, negative for common terms', 'never negative'],
  ['BM25 numerator', 'keeps (k1 + 1)', 'Lucene 8 and later drop it', 'Robertson and Zaragoza\'s form; dropping it scales every score and leaves the order'],
  ['repeated query words', 'counted once (k3 = 0)', 'weighted by query frequency', 'a query is a set of words'],
  ['ties', `${KD.TIE_DIGITS} significant digits, then the id ascending`, 'a relative tolerance, or input order', 'a key is transitive'],
  ['relevance threshold', 'grade 1 or more', 'grade 2 or more', 'trec_eval\'s default; state it with every figure'],
  ['precision at k', 'divides by k', 'divides by the passages ranked', 'trec_eval'],
  ['average precision', 'divides by every relevant judged passage', 'divides by min(k, relevant)', 'trec_eval; a missed passage lowers AP'],
  ['ideal DCG', 'every judged grade', 'the retrieved grades only', 'missing a good passage is penalised'],
  ['no relevant passage', 'excluded from the means and listed', 'scored 0', 'trec_eval'],
  ['short answers', 'SQuAD normalisation', 'numeric-aware matching', 'the published script\'s rule, stated'],
  ['groundedness', 'cited and retrieved; numericRelTol 0', 'any passage; a tolerance by default', 'a claim must be traceable to what the system saw'],
  ['calibration bins', 'an edge value opens the upper bin', 'scikit-learn closes the lower bin', 'numpy histogram\'s rule, the lead\'s choice'],
  ['ECE', 'non-empty bins, weighted by rows', 'unweighted mean over bins', 'Guo et al. (2017)'],
  ['bootstrap interval', 'lib/stats quantile on the replicates, parameter-percentile labels', 'linear interpolation', 'the platform\'s one quantile'],
]);
w();
w('WHAT IS NOT BUILT. No language model; no embedding or dense retrieval; no reranker; no stemming or synonyms; no query expansion; no model judging an answer; no truth check of a claim beyond finding it in a cited passage; no p-value; no fitting of the classifier behind the calibration set (the machine learning course fits classifiers).');
must('the not-built list matches the exports', !Object.keys(EV).some((k) => /embed|rerank|stem|expand|judge|pvalue|pValue/i.test(k)), Object.keys(EV).join(','));
w();
w('WHEN A MODEL HELPER IS NEVER GRADED. A model may draft text for a person to review. Its output is scored by the checks above and never used as a key, a label or a judgment in a graded set, because a key must have one right answer that does not change when the model does (' + ref('graded') + ').');
w();
w('WRITING THE EVALUATION REPORT names: the corpus and its size; the queries and how their judgments were pooled, the threshold and the gain; each system\'s retriever and its settings (method, k, k1, b, stop list); every metric with its cutoff and the queries excluded and why; the unjudged passages each system retrieved; the answer scores (exact match, token F1) and the groundedness figures with numericRelTol and whether the retrieved lists were used; the comparison with its seed, replicate count, level and whether it was paired; annotator agreement; and, for a probability, the Brier score, ECE and MCE with the bin count and the edge rule.');

/* ============================================================ SECTION 24 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Six words in this course carry a narrower meaning than they have in conversation or elsewhere in the academy. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it can mean elsewhere', 'the rule here'], [
  ['relevant', 'useful in any way', 'a judged grade at or above the stated threshold, grade 1 by default; "related" is grade 1 itself, and a threshold is stated with every figure that depends on it'],
  ['hallucination', 'anything a model gets wrong', 'an unsupported claim: a number, date or quote the check could not find in a cited, retrieved passage, named with the engine\'s reason'],
  ['grounded', 'true, or well sourced', 'supported by a cited and retrieved passage; a statement about the passage, never about the truth of the answer'],
  ['accuracy', 'any agreement', 'correct cells over cells (extraction), named with its denominator; precision and recall name their cutoff or their filled cells'],
  ['score', 'any number', 'a BM25 score or a TF-IDF cosine, named with its method; a score is never a probability, and a probability is the calibration set\'s given input'],
  ['AI', 'the system, the method, or anything automated', 'the system being evaluated; the engine runs no model, and every method is named by what it is: TF-IDF, BM25, SQuAD matching, a claim check, kappa, a Brier decomposition, a seeded bootstrap'],
]);
w();
w('A SEEDED NUMBER is quoted with its seed, replicate count and level; a retrieval metric with its cutoff, threshold and gain; a calibration figure with its bin count.');

/* ============================================================ CLOSING CHECKS */

PLANTED.forEach((p, i) => must(`planted defect ${i} (${p[0]}) is checked by some section`, PLANT_FOUND.get(i) === true, PLANT_FOUND.get(i)));
const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);
must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
// The engine's own reasons say "recall is undefined", "nDCG is undefined" and so on; those are quoted verbatim and exempt.
const bare = (l) => l.replace(/(?:recall|average precision|nDCG|kappa|the standard error|the supported fraction) is undefined|fractions are undefined|fraction is undefined|claims; undefined for an answer with no claim/g, '');
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(bare(l))), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(bare(l))));

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d5_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.D5_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`d5_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
