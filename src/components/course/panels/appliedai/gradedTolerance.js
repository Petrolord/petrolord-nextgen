// THE GRADING TOLERANCE OF EVERY D5 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from D4, which carried it from D3, D2, D1, H1, FC3, FC5 and FC9: a
// field's tolerance lived in three places (the capstone generator, fields.json
// and a hand-kept mirror in the teaching lab) and the copies went stale. Here
// it is made once:
//
//     a field's tolerance is  max(stated, half a unit in the last place the
//                                  course PRINTS that class)
//
// MAX AND NEVER MIN, so the rule only ever loosens. A tolerance no printed
// precision can satisfy grades a learner on luck at unprinted digits.
//
// THE GRADER'S TOLERANCE IS ABSOLUTE. public.academy_submit_capstone grades
// abs(v_got - v_exp) <= v_tol, in the field's own units.
//
// Nothing here imports anything, so a node script, a vitest run and a browser
// build all read the same numbers.

/**
 * What the D5 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Every score, idf, weight, cosine, term contribution, average length,
 *    metric (precision, recall, hit rate, reciprocal rank, average precision,
 *    DCG, nDCG and their means), F1, accuracy, fraction, agreement, kappa,
 *    probability, Brier score and each of its terms, calibration error, log
 *    loss, bootstrap mean, bound, difference, share and standard error prints
 *    to SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  score: 6, metric: 6, fraction: 6, bound: 6, kappa: 6, brier: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No D5 field rests on a search or a fit:
 * every one is closed-form arithmetic on stated inputs (an idf, a score, a
 * mean of metrics, an F1, a kappa, a Brier term) or a seeded bootstrap
 * quantile, which the stdlib oracle replays exactly (oracle_check.py measures
 * the engine-oracle disagreement on each and requires it within a tenth of the
 * tolerance). The printed floor, half a unit in the sixth decimal, therefore
 * sets every tolerance, and discriminate.mjs requires every wrong method to
 * land outside it. A key names what it measures: the capstone, the system or
 * query, the metric, and the cutoff, grade, gain or bin count it is read at.
 */
export const GRADED_FIELDS = [
  // Associate: ORLU, eighteen passages and four queries. RETRIEVAL AND CITED
  // ANSWERS: a BM25 idf, a BM25 top score, a TF-IDF top cosine, mean recall and
  // MRR at 4, and the pooled supported fraction of four answers.
  ['beginner', 'orlu_bm25_idf_pressure', 'score', 1e-9],
  ['beginner', 'orlu_o1_bm25_top_score', 'score', 1e-9],
  ['beginner', 'orlu_o4_tfidf_top_cosine', 'score', 1e-9],
  ['beginner', 'orlu_bm25_mean_recall_at4', 'metric', 1e-9],
  ['beginner', 'orlu_bm25_mrr_at4', 'metric', 1e-9],
  ['beginner', 'orlu_answers_supported_fraction', 'fraction', 1e-9],
  // Professional: NNEWI, forty-five passages, eight queries and two fixed systems.
  // SCORING RETRIEVAL AND ANSWERS HONESTLY: a MAP at grade 2, an exponential
  // nDCG, a mean token F1, an extraction macro F1, a paired-bootstrap upper
  // bound and a grounded fraction.
  ['intermediate', 'nnewi_p_map_at5_grade2', 'metric', 1e-9],
  ['intermediate', 'nnewi_q_ndcg_at5_exponential', 'metric', 1e-9],
  ['intermediate', 'nnewi_short_mean_token_f1', 'fraction', 1e-9],
  ['intermediate', 'nnewi_extraction_macro_f1', 'fraction', 1e-9],
  ['intermediate', 'nnewi_paired_ndcg_upper', 'bound', 1e-9],
  ['intermediate', 'nnewi_q_supported_fraction', 'fraction', 1e-9],
  // Expert: AWKA, ninety-six rating pairs and one hundred and twenty-two
  // calibration rows. AGREEMENT AND CALIBRATION: unweighted and linear kappa,
  // the Brier score, and the Murphy reliability, resolution and WBC terms at
  // eight bins (WBC as Stephenson, Coelho and Jolliffe 2008 eq. 7 label it:
  // twice the pooled within-bin covariance).
  ['advanced', 'awka_kappa_unweighted', 'kappa', 1e-9],
  ['advanced', 'awka_kappa_linear', 'kappa', 1e-9],
  ['advanced', 'awka_brier', 'brier', 1e-9],
  ['advanced', 'awka_reliability_bins8', 'brier', 1e-9],
  ['advanced', 'awka_resolution_bins8', 'brier', 1e-9],
  ['advanced', 'awka_wbc_bins8', 'brier', 1e-9],
];

/**
 * Half a unit in the last place the course prints this class, PARSED FROM A
 * LITERAL rather than multiplied: 0.5 * 10 ** -4 is not 0.00005 in binary.
 */
export const printedFloor = (cls) => {
  const dp = PRINTED_DECIMALS[cls];
  if (!Number.isInteger(dp)) {
    throw new Error(`no printed precision is declared for the quantity class ${cls}`);
  }
  return Number(`5e-${dp + 1}`);
};

/** The tier, class and stated tolerance of one field, by key. */
export const gradedClassOf = (key) => {
  const row = GRADED_FIELDS.find(([, k]) => k === key);
  if (!row) throw new Error(`${key} is not one of the eighteen graded D5 fields`);
  return { tier: row[0], cls: row[2], stated: row[3] };
};

/** The tolerance a field is graded at. The only place this number is made. */
export const gradedTolerance = (key) => {
  const { cls, stated } = gradedClassOf(key);
  return Math.max(stated, printedFloor(cls));
};

/** The per-field precision declaration, in the shape gradeprecision.py reads. */
export const precisionDeclaration = () => {
  const byClass = {};
  GRADED_FIELDS.forEach(([, key, cls]) => {
    (byClass[cls] = byClass[cls] || []).push(key);
  });
  return Object.fromEntries(Object.entries(byClass).sort().map(([cls, keys]) => [
    cls, { decimals: PRINTED_DECIMALS[cls], match: `^(?:${[...keys].sort().join('|')})$` },
  ]));
};
