// THE DISCRIMINATE SWEEP over every D5 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). The closest miss
// is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is an engine call, checked against fields.json. The
// wrong methods are the mistakes a learner makes, and most are the ENGINE
// CALLED WRONGLY on the capstone data: the TF-IDF idf for the BM25 one, b or k1
// at another value, the stop list on, the second-ranked score, the cutoff at 5
// for 3, relevance at grade 2 for grade 1 and back, precision for recall, the
// hit rate for MRR, the retrieved lists ignored in a groundedness check, a
// rounding tolerance switched on, the per-answer mean for the pooled fraction,
// linear gain for exponential, the micro F1 for the macro, the lower bound for
// the upper, an unpaired bootstrap, the next seed, the wrong system, kappa's
// observed agreement quoted, the wrong weights, ten bins for eight. A few are
// hand arithmetic a learner might do instead of calling the engine (the
// Robertson idf without the 1 +, log base 10, a library's bin-edge rule, the
// pooled within-bin covariance quoted as WBC, which is half of WBC as
// Stephenson, Coelho and Jolliffe 2008 eq. 7 label it); they live here, among the wrong
// methods, and nowhere else.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e12 and must report EIGHTEEN WEAK
// ROUTES, proving the sweep reads the tolerances rather than printing a
// constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.D5_WAVE_DIR || '/root/dai-wip-appliedai';
const ROOT = process.env.D5_ENGINES || '/root/wt-dai-d5-nextgen/packages/engines';
const EV = await import(`${ROOT}/engines/dataai/evaluate.js`);
const ML = await import(`${ROOT}/engines/dataai/ml.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e12 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The datasets come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/d5_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8, env: { ...process.env, D5_ENGINES: ROOT } }));
const FULL = JSON.parse(fs.readFileSync(`${ROOT}/test-data/dataai/ekene-docs/corpus.json`, 'utf8')).passages.map((p) => ({ id: p.id, text: p.text }));

/* ---- helpers for the WRONG methods only ---- */
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => sum(a) / a.length;

/* ---- ORLU ---- */
const OR = inp.ORLU; const orS = OR.stated;
const orQ = Object.fromEntries(OR.queries.map((q) => [q.id, q.text]));
const orRun = (o = {}) => EV.retrieve({ documents: OR.documents, queries: OR.queries, method: 'bm25', k: orS.k, ...o }).runs;
const orEval = (o = {}, runs = orRun()) => EV.evaluateRetrieval({ runs, judgments: OR.judgments, k: orS.k, ...o }).mean;
const orAns = OR.answers.map(({ query, text, citations }) => ({ query, text, citations }));
const orRetrieved = Object.fromEntries(OR.answers.map((a) => [a.query, a.retrieved]));
const orG = (o = {}) => EV.checkAnswers({ answers: orAns, documents: OR.documents, runs: orRetrieved, ...o });
const orDf = EV.rankBm25({ documents: OR.documents, query: orS.idfTerm, k: 1 }).queryTerms[0].df;
const orN = OR.documents.length;

/* ---- NNEWI ---- */
const NN = inp.NNEWI; const nnS = NN.stated;
const nnEval = (runs, o = {}) => EV.evaluateRetrieval({ runs, judgments: NN.judgments, k: nnS.k, ...o });
const nnMatch = NN.shorts.map((s) => EV.answerMatch({ prediction: s.answer, truth: s.reference }));
const nnX = EV.scoreExtraction(NN.extraction);
const ndOf = (runs, o = {}) => nnEval(runs, o).perQuery.map((r) => r.ndcg);
const nnBoot = (o = {}, a = ndOf(NN.runs.P), b = ndOf(NN.runs.Q)) => EV.pairedBootstrap({ a, b, seed: nnS.bootSeed, nBoot: nnS.nBoot, level: nnS.level, ...o });
const nnG = (o = {}) => EV.checkAnswers({ answers: NN.answers, documents: NN.documents, runs: NN.runs.Q, ...o });

/* ---- AWKA ---- */
const AW = inp.AWKA; const awS = AW.stated;
const ka = AW.ratings.a; const kb = AW.ratings.b;
const kap = (o = {}) => EV.cohenKappa({ a: ka, b: kb, labels: awS.labels, ...o });
const Y = AW.calibration.yTrue; const P = AW.calibration.probabilities;
const cal = (o = {}) => EV.calibration({ yTrue: Y, probabilities: P, bins: awS.bins, ...o });
/** The library's bin rule, by hand: an interior edge value goes to the LOWER bin. */
const libCal = (M) => {
  const bins = Array.from({ length: M }, () => []);
  P.forEach((p, j) => {
    let i = Math.min(M - 1, Math.floor(p * M));
    for (let e = 1; e < M; e += 1) if (p === e / M) i = e - 1;
    bins[i].push(j);
  });
  const N = P.length; const ob = mean(Y);
  let ece = 0; let res = 0; let wbc = 0; let rel = 0;
  bins.forEach((js) => {
    if (!js.length) return;
    const pk = mean(js.map((j) => P[j])); const ok = mean(js.map((j) => Y[j]));
    ece += (js.length / N) * Math.abs(ok - pk); res += (js.length * (ok - ob) ** 2) / N; rel += (js.length * (pk - ok) ** 2) / N;
    js.forEach((j) => { wbc += (2 * (Y[j] - ok) * (P[j] - pk)) / N; });
  });
  return { ece, res, wbc, rel };
};

const ROUTES = {
  orlu_bm25_idf_pressure: {
    truth: () => EV.rankBm25({ documents: OR.documents, query: orS.idfTerm, k: 1 }).queryTerms[0].idf,
    wrong: {
      the_tfidf_smooth_idf: () => { const v = EV.tfidfVectors({ documents: OR.documents }); return v.idf[v.vocabulary.indexOf(orS.idfTerm)]; },
      robertson_idf_without_the_one: () => Math.log((orN - orDf + 0.5) / (orDf + 0.5)),
      log_base_ten: () => Math.log10(1 + (orN - orDf + 0.5) / (orDf + 0.5)),
      the_whole_ekene_corpus: () => EV.rankBm25({ documents: FULL, query: orS.idfTerm, k: 1 }).queryTerms[0].idf,
      df_plus_one: () => Math.log(1 + (orN - (orDf + 1) + 0.5) / (orDf + 1 + 0.5)),
    },
  },
  orlu_o1_bm25_top_score: {
    truth: () => EV.rankBm25({ documents: OR.documents, query: orQ[orS.topQuery], k: orS.k }).ranking[0].score,
    wrong: {
      b_zero: () => EV.rankBm25({ documents: OR.documents, query: orQ[orS.topQuery], k: orS.k, b: 0 }).ranking[0].score,
      k1_two: () => EV.rankBm25({ documents: OR.documents, query: orQ[orS.topQuery], k: orS.k, k1: 2 }).ranking[0].score,
      stop_list_on: () => EV.rankBm25({ documents: OR.documents, query: orQ[orS.topQuery], k: orS.k, stopWords: true }).ranking[0].score,
      second_ranked: () => EV.rankBm25({ documents: OR.documents, query: orQ[orS.topQuery], k: orS.k }).ranking[1].score,
      the_whole_ekene_corpus: () => EV.rankBm25({ documents: FULL, query: orQ[orS.topQuery], k: orS.k }).ranking[0].score,
      tfidf_cosine_quoted: () => EV.rankTfidf({ documents: OR.documents, query: orQ[orS.topQuery], k: orS.k }).ranking[0].score,
    },
  },
  orlu_o4_tfidf_top_cosine: {
    truth: () => EV.rankTfidf({ documents: OR.documents, query: orQ[orS.cosQuery], k: orS.k }).ranking[0].score,
    wrong: {
      sublinear_tf: () => EV.rankTfidf({ documents: OR.documents, query: orQ[orS.cosQuery], k: orS.k, sublinearTf: true }).ranking[0].score,
      stop_list_on: () => EV.rankTfidf({ documents: OR.documents, query: orQ[orS.cosQuery], k: orS.k, stopWords: true }).ranking[0].score,
      second_ranked: () => EV.rankTfidf({ documents: OR.documents, query: orQ[orS.cosQuery], k: orS.k }).ranking[1].score,
      bm25_score_quoted: () => EV.rankBm25({ documents: OR.documents, query: orQ[orS.cosQuery], k: orS.k }).ranking[0].score,
      the_whole_ekene_corpus: () => EV.rankTfidf({ documents: FULL, query: orQ[orS.cosQuery], k: orS.k }).ranking[0].score,
    },
  },
  orlu_bm25_mean_recall_at4: {
    truth: () => orEval().recall,
    wrong: {
      cutoff_two: () => orEval({ k: 2 }, orRun({ k: 2 })).recall,
      cutoff_three: () => orEval({ k: 3 }, orRun({ k: 3 })).recall,
      relevant_at_grade_two: () => orEval({ relevantGrade: 2 }).recall,
      precision_quoted: () => orEval().precision,
      tfidf_runs: () => orEval({}, EV.retrieve({ documents: OR.documents, queries: OR.queries, method: 'tfidf', k: orS.k }).runs).recall,
      relevant_at_grade_three: () => orEval({ relevantGrade: 3 }).recall,
    },
  },
  orlu_bm25_mrr_at4: {
    truth: () => orEval().mrr,
    wrong: {
      hit_rate_quoted: () => orEval().hitRate,
      map_quoted: () => orEval().map,
      relevant_at_grade_two: () => orEval({ relevantGrade: 2 }).mrr,
      cutoff_one: () => orEval({ k: 1 }).mrr,
      b_zero_runs: () => orEval({}, orRun({ b: 0 })).mrr,
    },
  },
  orlu_answers_supported_fraction: {
    truth: () => orG().supportedFraction,
    wrong: {
      retrieved_lists_ignored: () => EV.checkAnswers({ answers: orAns, documents: OR.documents }).supportedFraction,
      per_answer_mean: () => orG().meanAnswerSupportedFraction,
      answer_with_an_unretrieved_citation_dropped: () => { const keep = orAns.filter((a) => orG().perAnswer.find((r) => r.query === a.query).citations.every((c) => c.status === 'ok')); return EV.checkAnswers({ answers: keep, documents: OR.documents, runs: orRetrieved }).supportedFraction; },
      numbers_only: () => { const g = orG(); return g.byKind.number.supported / g.byKind.number.claims; },
      fully_supported_answers_share: () => { const g = orG(); return g.fullySupportedAnswers / g.answersWithClaims; },
    },
  },
  nnewi_p_map_at5_grade2: {
    truth: () => nnEval(NN.runs.P, { relevantGrade: nnS.mapGrade }).mean.map,
    wrong: {
      relevant_at_grade_one: () => nnEval(NN.runs.P).mean.map,
      system_q: () => nnEval(NN.runs.Q, { relevantGrade: nnS.mapGrade }).mean.map,
      mrr_quoted: () => nnEval(NN.runs.P, { relevantGrade: nnS.mapGrade }).mean.mrr,
      cutoff_three: () => nnEval(NN.runs.P, { relevantGrade: nnS.mapGrade, k: 3 }).mean.map,
      grade_three: () => nnEval(NN.runs.P, { relevantGrade: 3 }).mean.map,
    },
  },
  nnewi_q_ndcg_at5_exponential: {
    truth: () => nnEval(NN.runs.Q, { gain: 'exponential' }).mean.ndcg,
    wrong: {
      linear_gain: () => nnEval(NN.runs.Q).mean.ndcg,
      system_p: () => nnEval(NN.runs.P, { gain: 'exponential' }).mean.ndcg,
      cutoff_three: () => nnEval(NN.runs.Q, { gain: 'exponential', k: 3 }).mean.ndcg,
      ideal_from_the_retrieved_only: () => mean(NN.queries.map((q) => EV.retrievalMetrics({ ranking: NN.runs.Q[q.id], judgments: Object.fromEntries(Object.entries(NN.judgments[q.id]).filter(([d]) => NN.runs.Q[q.id].includes(d))), k: nnS.k, gain: 'exponential' }).ndcg ?? 0)),
      map_quoted: () => nnEval(NN.runs.Q, { gain: 'exponential' }).mean.map,
    },
  },
  nnewi_short_mean_token_f1: {
    truth: () => EV.scoreExtraction({ fields: [{ name: 'answer', type: 'text' }], labels: NN.shorts.map((s) => ({ id: s.query, fields: { answer: s.reference } })), predictions: NN.shorts.map((s) => ({ id: s.query, fields: { answer: s.answer } })) }).perField[0].meanF1,
    wrong: {
      exact_match_rate: () => mean(nnMatch.map((r) => (r.exactMatch ? 1 : 0))),
      token_precision_mean: () => mean(nnMatch.map((r) => r.precision ?? 0)),
      token_recall_mean: () => mean(nnMatch.map((r) => r.recall ?? 0)),
      exact_matches_counted_out: () => mean(nnMatch.filter((r) => !r.exactMatch).map((r) => r.f1)),
      raw_strings_without_normalising: () => mean(NN.shorts.map((s) => { const p = s.answer.split(/\s+/).filter(Boolean); const t = s.reference.split(/\s+/).filter(Boolean); const c = new Map(); t.forEach((w) => c.set(w, (c.get(w) || 0) + 1)); let m = 0; p.forEach((w) => { if (c.get(w)) { m += 1; c.set(w, c.get(w) - 1); } }); if (!m) return 0; const pr = m / p.length; const rc = m / t.length; return (2 * pr * rc) / (pr + rc); })),
    },
  },
  nnewi_extraction_macro_f1: {
    truth: () => nnX.overall.macroF1,
    wrong: {
      micro_f1: () => nnX.overall.microF1,
      macro_accuracy: () => nnX.overall.macroAccuracy,
      overall_precision: () => nnX.overall.precision,
      text_fields_only: () => mean(nnX.perField.filter((f) => f.type === 'text').map((f) => f.f1)),
      overall_recall: () => nnX.overall.recall,
    },
  },
  nnewi_paired_ndcg_upper: {
    truth: () => nnBoot().upper,
    wrong: {
      lower_bound: () => nnBoot().lower,
      unpaired: () => nnBoot({ paired: false }).upper,
      next_seed: () => nnBoot({ seed: nnS.bootSeed + 1 }).upper,
      level_ninety: () => nnBoot({ level: 0.9 }).upper,
      q_minus_p: () => nnBoot({}, ndOf(NN.runs.Q), ndOf(NN.runs.P)).upper,
      average_precision: () => nnBoot({}, nnEval(NN.runs.P).perQuery.map((r) => r.averagePrecision), nnEval(NN.runs.Q).perQuery.map((r) => r.averagePrecision)).upper,
    },
  },
  nnewi_q_supported_fraction: {
    truth: () => nnG().supportedFraction,
    wrong: {
      retrieved_lists_ignored: () => EV.checkAnswers({ answers: NN.answers, documents: NN.documents }).supportedFraction,
      per_answer_mean: () => nnG().meanAnswerSupportedFraction,
      numbers_only: () => { const g = nnG(); return g.byKind.number.supported / g.byKind.number.claims; },
      fully_supported_answers_share: () => { const g = nnG(); return g.fullySupportedAnswers / g.answersWithClaims; },
    },
  },
  awka_kappa_unweighted: {
    truth: () => kap().kappa,
    wrong: {
      observed_agreement: () => kap().observedAgreement,
      linear_weights: () => kap({ weights: 'linear' }).kappa,
      quadratic_weights: () => kap({ weights: 'quadratic' }).kappa,
      relevant_or_not_at_two: () => EV.cohenKappa({ a: ka.map((g) => (g >= 2 ? 1 : 0)), b: kb.map((g) => (g >= 2 ? 1 : 0)) }).kappa,
    },
  },
  awka_kappa_linear: {
    truth: () => kap({ weights: 'linear' }).kappa,
    wrong: {
      unweighted: () => kap().kappa,
      quadratic_weights: () => kap({ weights: 'quadratic' }).kappa,
      one_minus_observed_disagreement: () => 1 - kap({ weights: 'linear' }).observedDisagreement,
      relevant_or_not_at_one: () => EV.cohenKappa({ a: ka.map((g) => (g >= 1 ? 1 : 0)), b: kb.map((g) => (g >= 1 ? 1 : 0)) }).kappa,
    },
  },
  awka_brier: {
    truth: () => cal().brier,
    wrong: {
      log_loss_quoted: () => ML.logLoss({ yTrue: Y, probabilities: P }).logLoss,
      ece_quoted: () => cal().ece,
      mean_absolute_difference: () => mean(P.map((p, i) => Math.abs(p - Y[i]))),
      without_the_within_bin_terms: () => { const m = cal().murphy; return m.reliability - m.resolution + m.uncertainty; },
    },
  },
  awka_reliability_bins8: {
    truth: () => cal().murphy.reliability,
    wrong: {
      ten_bins: () => cal({ bins: 10 }).murphy.reliability,
      the_library_edge_rule: () => libCal(awS.bins).rel,
      ece_quoted: () => cal().ece,
      resolution_quoted: () => cal().murphy.resolution,
    },
  },
  awka_resolution_bins8: {
    truth: () => cal().murphy.resolution,
    wrong: {
      ten_bins: () => cal({ bins: 10 }).murphy.resolution,
      reliability_quoted: () => cal().murphy.reliability,
      uncertainty_quoted: () => cal().murphy.uncertainty,
      the_library_edge_rule: () => libCal(awS.bins).res,
    },
  },
  awka_wbc_bins8: {
    truth: () => cal().murphy.withinBinCovariance,
    wrong: {
      within_bin_variance: () => cal().murphy.withinBinVariance,
      ten_bins: () => cal({ bins: 10 }).murphy.withinBinCovariance,
      without_the_factor_two: () => cal().murphy.withinBinCovariance / 2,
      the_library_edge_rule: () => libCal(awS.bins).wbc,
    },
  },
};

let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
const report = [];
const summary = {};
console.log('field                                            tol        errors  moved  blind  closest miss (tolerances)');
Object.entries(ROUTES).forEach(([key, { truth, wrong }]) => {
  if (!fields[key]) { console.log(`REFUSED: ${key} is not a graded field`); process.exit(2); }
  const tol = fields[key][3];
  const t = truth();
  if (!Number.isFinite(t)) { console.log(`REFUSED: the true value of ${key} did not evaluate`); process.exit(2); }
  if (SLACK === 1 && Math.abs(t - fields[key][2]) > 1e-12 * Math.abs(t)) {
    console.log(`REFUSED: the truth route for ${key} gives ${t}, and fields.json carries ${fields[key][2]}`); process.exit(2);
  }
  const moved = []; const blind = [];
  let nearest = Infinity; let nearestName = null;
  Object.entries(wrong).forEach(([name, f]) => {
    totalWrong += 1;
    let got;
    try { got = f(); } catch (e) { got = NaN; }
    // A wrong method that does not evaluate proves nothing: it is a defect of the
    // sweep, never a method that "moved" the answer.
    if (!Number.isFinite(got)) { console.log(`REFUSED: the wrong method ${key}/${name} did not evaluate to a finite number (${got})`); process.exit(2); }
    const d = Math.abs(got - t);
    if (d > tol) {
      moved.push(name);
      const ratio = d / tol;
      if (ratio < nearest) { nearest = ratio; nearestName = name; }
      report.push({ key, name, value: got });
    } else { blind.push(`${name} (off by ${d.toExponential(3)})`); }
  });
  summary[key] = Object.keys(wrong).map((n) => n.replace(/_/g, ' ')).join(', ');
  if (nearest < closest.ratio) closest = { key, name: nearestName, ratio: nearest };
  const isWeak = moved.length < 3 || blind.length > 0;
  if (isWeak) weak += 1;
  console.log(`${key.padEnd(48)} ${String(tol).padEnd(10)} ${String(moved.length + blind.length).padStart(6)} ${String(moved.length).padStart(6)} ${String(blind.length).padStart(6)}  ${nearest === Infinity ? 'all infinite' : nearest.toExponential(3)} (${nearestName})${isWeak ? '   WEAK' : ''}`);
  if (blind.length) console.log(`${' '.repeat(49)}BLIND TO: ${blind.join(', ')}`);
});
console.log();
console.log(`routes swept: ${Object.keys(ROUTES).length}  plausible wrong methods aimed at them: ${totalWrong}  WEAK routes: ${weak}`);
console.log(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.name}, ${closest.ratio.toExponential(3)} tolerances away`);
if (process.argv.includes('--values')) {
  report.forEach((r) => console.log(`  wrong ${r.key} ${r.name} = ${r.value}`));
}
if (process.argv.includes('--summary')) process.stdout.write(`${JSON.stringify(summary)}\n`);
if (Object.keys(ROUTES).length !== 18 || totalWrong < 54) {
  console.log('REFUSED: a sweep with fewer than three wrong methods a field is not a sweep');
  process.exit(2);
}
if (SLACK !== 1) {
  console.log(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
process.exit(weak ? 1 : 0);
