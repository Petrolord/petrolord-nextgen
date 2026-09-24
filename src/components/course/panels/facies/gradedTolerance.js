// THE GRADING TOLERANCE OF EVERY D3 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from D2, which carried it from D1, H1, FC3, FC5 and FC9: a
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
 * What the D3 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Every log value, centre, scale, distance, eigenvalue, ratio, loading,
 *    score, inertia, silhouette, merge height, index, accuracy, impurity,
 *    importance and threshold prints to SIX decimals; counts, row numbers,
 *    cluster numbers, passes, depths, seeds and well numbers are whole
 *    numbers; ..."
 */
export const PRINTED_DECIMALS = {
  scale: 6, ratio: 6, loading: 6, score: 6, inertia: 6, centre: 6,
  silhouette: 6, height: 6, index: 6, accuracy: 6, distance: 6, impurity: 6, importance: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED. A key names what it measures and
 * carries its unit as a suffix where it has one.
 */
export const GRADED_FIELDS = [
  // Associate: six cored wells. GROUPING LOGS INTO ELECTROFACIES: a scaler
  // scale, the first component's share and a loading and a score, the k-means
  // inertia and a centre back in log units. No choice of k, no tree of merges,
  // no score against core.
  ['beginner', 'ihiala_gr_scale_gapi', 'scale', 1e-9],
  ['beginner', 'ihiala_pc1_ratio', 'ratio', 1e-9],
  ['beginner', 'ihiala_pc1_nphi_loading', 'loading', 1e-9],
  ['beginner', 'ihiala_pc1_score_first_row', 'score', 1e-9],
  ['beginner', 'ihiala_kmeans_inertia', 'inertia', 1e-9],
  ['beginner', 'ihiala_row24_cluster_gr_centre_gapi', 'centre', 1e-9],
  // Professional: seven cored wells. JUDGING GROUPS AGAINST CORE: an elbow
  // drop fraction, the mean silhouette of the Ward cut, a Ward merge height at the cut, the
  // adjusted Rand index of complete linkage, a one-to-one macro F1 and a
  // majority accuracy.
  ['intermediate', 'nkwelle_elbow_drop_fraction_k4', 'ratio', 1e-9],
  ['intermediate', 'nkwelle_ward_silhouette', 'silhouette', 1e-9],
  ['intermediate', 'nkwelle_ward_height_above_cut', 'height', 1e-9],
  ['intermediate', 'nkwelle_complete_ari', 'index', 1e-9],
  ['intermediate', 'nkwelle_one_to_one_macro_f1', 'accuracy', 1e-9],
  ['intermediate', 'nkwelle_majority_accuracy_k6', 'accuracy', 1e-9],
  // Expert: six cored wells, one held out, and one uncored well logged with an
  // uncalibrated gamma ray tool. PREDICTING FACIES, AND THE ENGINE'S OWN
  // RULES: a held-out kNN accuracy, a nearest distance, the Gini impurity of
  // the node the root tie sends right, an importance, a held-out tree accuracy
  // and a range check.
  ['advanced', 'ogbunike_knn_heldout_accuracy', 'accuracy', 1e-9],
  ['advanced', 'ogbunike_knn_nearest_distance', 'distance', 1e-9],
  ['advanced', 'ogbunike_cart_node2_gini', 'impurity', 1e-9],
  ['advanced', 'ogbunike_cart_nphi_importance', 'importance', 1e-9],
  ['advanced', 'ogbunike_cart_depth3_heldout_accuracy', 'accuracy', 1e-9],
  ['advanced', 'ogbunike_uncored_gr_minmax_max', 'scale', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded D3 fields`);
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
