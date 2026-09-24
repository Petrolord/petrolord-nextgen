// THE DISCRIMINATE SWEEP over every D3 capstone route.
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
// CALLED WRONGLY: the sample SD for the population SD, the covariance matrix
// for the correlation matrix, the unit weight quoted as a loading, one start
// for ten, the drop quoted for the drop fraction, the height below the cut for
// the one above, Ward for complete linkage, the new rows scaled on their own
// statistics, the other log taken on a tie, the scaler refitted on the
// new well. A few are hand arithmetic a learner might do instead of calling
// the engine (the unadjusted Rand index, a silhouette on squared distances);
// they live here, among the wrong methods, and nowhere else.
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

const HERE = process.env.D3_WAVE_DIR || '/root/dai-wip-facies';
const ROOT = process.env.D3_ENGINES || '/root/wt-dai-d3-nextgen/packages/engines';
const CL = await import(`${ROOT}/engines/dataai/cluster.js`);
const ML = await import(`${ROOT}/engines/dataai/ml.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e12 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The datasets come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/d3_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8, env: { ...process.env, D3_ENGINES: ROOT } }));

/* ---- helpers for the WRONG methods only ---- */
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => sum(a) / a.length;
const pick = (a, idx) => idx.map((i) => a[i]);
const LOGS = ['GR', 'RHOB', 'NPHI', 'PEF'];
const LOGS_C = [...LOGS, 'CALI'];
const Xof = (rows, feats = LOGS) => rows.map((r) => feats.map((f) => r[f]));
const acc = (t, p) => ML.classificationReport({ yTrue: t, yPred: p }).accuracy;
const scaleWith = (X, sc) => X.map((r) => r.map((v, j) => (v - sc.centre[j]) / sc.scale[j]));
const dist = (a, b) => Math.sqrt(sum(a.map((v, j) => (v - b[j]) ** 2)));
/** The silhouette a learner might compute by hand on SQUARED distances, or dividing a by the cluster size. */
const handSil = (Z, lab, { squared = false, aBySize = false } = {}) => {
  const n = Z.length; const cls = [...new Set(lab)];
  const d = (i, j) => { const s = sum(Z[i].map((v, t) => (v - Z[j][t]) ** 2)); return squared ? s : Math.sqrt(s); };
  const vals = Z.map((_, i) => {
    const own = lab.map((l, j) => (l === lab[i] && j !== i ? j : -1)).filter((j) => j >= 0);
    if (!own.length) return 0;
    const a = sum(own.map((j) => d(i, j))) / (aBySize ? own.length + 1 : own.length);
    const b = Math.min(...cls.filter((c) => c !== lab[i]).map((c) => { const m = lab.map((l, j) => (l === c ? j : -1)).filter((j) => j >= 0); return sum(m.map((j) => d(i, j))) / m.length; }));
    const mx = Math.max(a, b);
    return mx === 0 ? 0 : (b - a) / mx;
  });
  return mean(vals);
};
/** The unadjusted Rand index, pairs agreeing over all pairs. */
const randIndex = (a, b) => { let agree = 0; let all = 0; for (let i = 0; i < a.length; i += 1) for (let j = i + 1; j < a.length; j += 1) { all += 1; if ((a[i] === a[j]) === (b[i] === b[j])) agree += 1; } return agree / all; };

/* ---- IHIALA ---- */
const IH = inp.IHIALA; const ihS = IH.stated;
const ihR = IH.field.rows; const ihX = Xof(ihR); const ihX5 = Xof(ihR, LOGS_C); const ihY = ihR.map((r) => r.FACIES);
const ihPC = CL.pca({ X: ihX, names: LOGS });
const ihKM = CL.kmeans({ X: ihX, k: ihS.k, seed: ihS.seed, names: LOGS });
const ihSampleSc = ML.fitStandardScaler({ X: ihX, sd: 'sample' });
const popScore = (row) => { const sc = ML.fitStandardScaler({ X: ihX }); const z = row.map((v, j) => (v - sc.centre[j]) / sc.scale[j]); return sum(z.map((v, j) => v * ihPC.components[0][j])); };

/* ---- NKWELLE ---- */
const NK = inp.NKWELLE; const nkS = NK.stated;
const nkR = NK.field.rows; const nkX = Xof(nkR); const nkY = nkR.map((r) => r.FACIES);
const nkEL = (o = {}) => CL.elbow({ X: nkX, kMin: 1, kMax: nkS.kMax, seed: nkS.seed, ...o });
const nkKM = CL.kmeans({ X: nkX, k: nkS.k, seed: nkS.seed });
const nkZ = scaleWith(nkX, nkKM.scaler);
const nkAgg = (linkage, k = nkS.k, scale = 'standard') => CL.agglomerative({ X: nkX, linkage, k, scale });
const nkK5 = CL.kmeans({ X: nkX, k: nkS.kOver, seed: nkS.seed });

/* ---- OGBUNIKE ---- */
const OG = inp.OGBUNIKE; const ogS = OG.stated;
const ogC = OG.field.rows.filter((r) => r.FACIES !== null);
const ogG = ogC.map((r) => r.well); const ogX = Xof(ogC); const ogX5 = Xof(ogC, LOGS_C); const ogY = ogC.map((r) => r.FACIES);
const TR = ogG.map((g, i) => (g !== ogS.heldOut ? i : -1)).filter((i) => i >= 0);
const TE = ogG.map((g, i) => (g === ogS.heldOut ? i : -1)).filter((i) => i >= 0);
const ogU = Xof(OG.field.rows.filter((r) => r.well === ogS.uncored));
const knnAcc = (o) => acc(pick(ogY, TE), CL.knnClassify({ X: pick(ogX, TR), y: pick(ogY, TR), Xnew: pick(ogX, TE), k: ogS.k, ...o }).predictions);
const trSc = ML.fitStandardScaler({ X: pick(ogX, TR) });
const teOwn = ML.fitStandardScaler({ X: pick(ogX, TE) });
const allSc = ML.fitStandardScaler({ X: ogX });
const tree = (X, y, o = {}) => CL.cartFit({ X, y, names: o.names || LOGS_C, ...o });
const ogT = tree(ogX5, ogY);
const t3acc = (o = {}, trIdx = TR) => { const t = tree(pick(ogX5, trIdx), pick(ogY, trIdx), { maxDepth: ogS.depth, ...o }); return acc(pick(ogY, TE), CL.cartPredict({ model: t, X: pick(ogX5, TE) }).predictions); };
const mmU = (X) => { const mm = ML.fitMinMaxScaler({ X }); return Math.max(...ML.applyScaler({ scaler: mm, X: ogU }).X.map((r) => r[0])); };
const ALL = ogC.map((_, i) => i);

const ROUTES = {
  ihiala_gr_scale_gapi: {
    truth: () => ihKM.scaler.scale[0],
    wrong: {
      sample_sd: () => ihSampleSc.scale[0],
      min_max_range: () => ML.fitMinMaxScaler({ X: ihX }).scale[0],
      first_well_only: () => ML.fitStandardScaler({ X: Xof(ihR.filter((r) => r.well === `IHIALA-1`)) }).scale[0],
      centre_quoted: () => ihKM.scaler.centre[0],
      variance_not_rooted: () => ihKM.scaler.scale[0] ** 2,
    },
  },
  ihiala_pc1_ratio: {
    truth: () => ihPC.explainedVarianceRatio[0],
    wrong: {
      covariance_matrix: () => CL.pca({ X: ihX, matrix: 'covariance' }).explainedVarianceRatio[0],
      second_component: () => ihPC.explainedVarianceRatio[1],
      cumulative_of_two: () => ihPC.cumulativeRatio[1],
      eigenvalue_quoted: () => ihPC.eigenvalues[0],
      caliper_included: () => CL.pca({ X: ihX5 }).explainedVarianceRatio[0],
    },
  },
  ihiala_pc1_nphi_loading: {
    truth: () => ihPC.loadings[0][2],
    wrong: {
      unit_weight_quoted: () => ihPC.components[0][2],
      sign_flipped: () => -ihPC.loadings[0][2],
      covariance_matrix: () => CL.pca({ X: ihX, matrix: 'covariance' }).loadings[0][2],
      weight_times_eigenvalue: () => ihPC.components[0][2] * ihPC.eigenvalues[0],
      second_component: () => ihPC.loadings[1][2],
    },
  },
  ihiala_pc1_score_first_row: {
    truth: () => ihPC.scores[0][0],
    wrong: {
      population_sd: () => popScore(ihX[0]),
      covariance_matrix: () => CL.pca({ X: ihX, matrix: 'covariance' }).scores[0][0],
      sign_flipped: () => -ihPC.scores[0][0],
      loadings_as_weights: () => { const z = ihX[0].map((v, j) => (v - ihPC.centre[j]) / ihPC.scale[j]); return sum(z.map((v, j) => v * ihPC.loadings[0][j])); },
      last_row: () => ihPC.scores[ihPC.scores.length - 1][0],
    },
  },
  ihiala_kmeans_inertia: {
    truth: () => ihKM.inertia,
    wrong: {
      one_start: () => CL.kmeans({ X: ihX, k: ihS.k, seed: ihS.seed, nInit: 1 }).inertia,
      raw_logs: () => CL.kmeans({ X: ihX, k: ihS.k, seed: ihS.seed, scale: 'none' }).inertia,
      min_max: () => CL.kmeans({ X: ihX, k: ihS.k, seed: ihS.seed, scale: 'minmax' }).inertia,
      k_three: () => CL.kmeans({ X: ihX, k: ihS.k - 1, seed: ihS.seed }).inertia,
      k_five: () => CL.kmeans({ X: ihX, k: ihS.k + 1, seed: ihS.seed }).inertia,
      sample_sd_scaling: () => CL.kmeans({ X: scaleWith(ihX, ihSampleSc), k: ihS.k, seed: ihS.seed, scale: 'none' }).inertia,
    },
  },
  ihiala_row24_cluster_gr_centre_gapi: {
    truth: () => ihKM.centresOriginal[ihKM.labels[ihS.centreRow]][0],
    wrong: {
      standard_units_quoted: () => ihKM.centres[ihKM.labels[ihS.centreRow]][0],
      first_row_cluster_read: () => ihKM.centresOriginal[ihKM.labels[0]][0],
      raw_logs: () => { const k = CL.kmeans({ X: ihX, k: ihS.k, seed: ihS.seed, scale: 'none' }); return k.centresOriginal[k.labels[ihS.centreRow]][0]; },
      one_start: () => { const k = CL.kmeans({ X: ihX, k: ihS.k, seed: ihS.seed, nInit: 1 }); return k.centresOriginal[k.labels[ihS.centreRow]][0]; },
      k_three: () => { const k = CL.kmeans({ X: ihX, k: ihS.k - 1, seed: ihS.seed }); return k.centresOriginal[k.labels[ihS.centreRow]][0]; },
      min_max: () => { const k = CL.kmeans({ X: ihX, k: ihS.k, seed: ihS.seed, scale: 'minmax' }); return k.centresOriginal[k.labels[ihS.centreRow]][0]; },
      the_row_gr_quoted: () => ihX[ihS.centreRow][0],
    },
  },
  nkwelle_elbow_drop_fraction_k4: {
    truth: () => nkEL().table[nkS.k - 1].dropFraction,
    wrong: {
      drop_not_fraction: () => nkEL().table[nkS.k - 1].drop,
      divided_by_inertia_k: () => { const t = nkEL().table; return t[nkS.k - 1].drop / t[nkS.k - 1].inertia; },
      k_three_row: () => nkEL().table[nkS.k - 2].dropFraction,
      k_five_row: () => nkEL().table[nkS.k].dropFraction,
      raw_logs: () => nkEL({ scale: 'none' }).table[nkS.k - 1].dropFraction,
      one_start: () => nkEL({ nInit: 1 }).table[nkS.k - 1].dropFraction,
    },
  },
  nkwelle_ward_silhouette: {
    truth: () => CL.silhouette({ X: nkX, labels: nkAgg('ward').labels }).mean,
    wrong: {
      k_means_labels: () => CL.silhouette({ X: nkX, labels: nkKM.labels }).mean,
      complete_linkage: () => CL.silhouette({ X: nkX, labels: nkAgg('complete').labels }).mean,
      raw_logs: () => CL.silhouette({ X: nkX, labels: nkAgg('ward').labels, scale: 'none' }).mean,
      core_facies_labels: () => CL.silhouette({ X: nkX, labels: nkY }).mean,
      squared_distances: () => handSil(nkZ, nkAgg('ward').labels, { squared: true }),
      a_over_cluster_size: () => handSil(nkZ, nkAgg('ward').labels, { aBySize: true }),
    },
  },
  nkwelle_ward_height_above_cut: {
    truth: () => nkAgg('ward').cutHeights.above,
    wrong: {
      height_below_the_cut: () => nkAgg('ward').cutHeights.below,
      complete_linkage: () => nkAgg('complete').cutHeights.above,
      average_linkage: () => nkAgg('average').cutHeights.above,
      without_the_factor_two: () => nkAgg('ward').cutHeights.above / Math.SQRT2,
      raw_logs: () => nkAgg('ward', nkS.k, 'none').cutHeights.above,
      cut_at_three: () => nkAgg('ward', nkS.k - 1).cutHeights.above,
    },
  },
  nkwelle_complete_ari: {
    truth: () => CL.adjustedRandIndex({ a: nkY, b: nkAgg('complete').labels }).ari,
    wrong: {
      ward_linkage: () => CL.adjustedRandIndex({ a: nkY, b: nkAgg('ward').labels }).ari,
      k_means: () => CL.adjustedRandIndex({ a: nkY, b: nkKM.labels }).ari,
      average_linkage: () => CL.adjustedRandIndex({ a: nkY, b: nkAgg('average').labels }).ari,
      unadjusted_rand_index: () => randIndex(nkY, nkAgg('complete').labels),
      cut_at_three: () => CL.adjustedRandIndex({ a: nkY, b: nkAgg('complete', nkS.k - 1).labels }).ari,
    },
  },
  nkwelle_one_to_one_macro_f1: {
    truth: () => CL.matchClusters({ yTrue: nkY, clusters: nkKM.labels }).report.macro.f1,
    wrong: {
      accuracy_quoted: () => CL.matchClusters({ yTrue: nkY, clusters: nkKM.labels }).report.accuracy,
      weighted_f1: () => CL.matchClusters({ yTrue: nkY, clusters: nkKM.labels }).report.weighted.f1,
      k_three: () => CL.matchClusters({ yTrue: nkY, clusters: CL.kmeans({ X: nkX, k: nkS.k - 1, seed: nkS.seed }).labels }).report.macro.f1,
      ward_clusters: () => CL.matchClusters({ yTrue: nkY, clusters: nkAgg('ward').labels }).report.macro.f1,
      raw_logs: () => CL.matchClusters({ yTrue: nkY, clusters: CL.kmeans({ X: nkX, k: nkS.k, seed: nkS.seed, scale: 'none' }).labels }).report.macro.f1,
    },
  },
  nkwelle_majority_accuracy_k6: {
    truth: () => CL.matchClusters({ yTrue: nkY, clusters: nkK5.labels, mode: 'majority' }).report.accuracy,
    wrong: {
      one_to_one_at_k_four: () => CL.matchClusters({ yTrue: nkY, clusters: nkKM.labels }).report.accuracy,
      macro_f1_quoted: () => CL.matchClusters({ yTrue: nkY, clusters: nkK5.labels, mode: 'majority' }).report.macro.f1,
      k_five: () => CL.matchClusters({ yTrue: nkY, clusters: CL.kmeans({ X: nkX, k: nkS.kOver - 1, seed: nkS.seed }).labels, mode: 'majority' }).report.accuracy,
      ward_at_the_same_k: () => CL.matchClusters({ yTrue: nkY, clusters: nkAgg('ward', nkS.kOver).labels, mode: 'majority' }).report.accuracy,
      raw_logs: () => CL.matchClusters({ yTrue: nkY, clusters: CL.kmeans({ X: nkX, k: nkS.kOver, seed: nkS.seed, scale: 'none' }).labels, mode: 'majority' }).report.accuracy,
    },
  },
  ogbunike_knn_heldout_accuracy: {
    truth: () => knnAcc(),
    wrong: {
      k_one: () => knnAcc({ k: 1 }),
      new_rows_on_their_own_scaler: () => acc(pick(ogY, TE), CL.knnClassify({ X: scaleWith(pick(ogX, TR), trSc), y: pick(ogY, TR), Xnew: scaleWith(pick(ogX, TE), teOwn), k: ogS.k, scale: 'none' }).predictions),
      no_scaling: () => knnAcc({ scale: 'none' }),
      held_out_well_in_training: () => acc(pick(ogY, TE), CL.knnClassify({ X: ogX, y: ogY, Xnew: pick(ogX, TE), k: ogS.k }).predictions),
      min_max: () => knnAcc({ scale: 'minmax' }),
    },
  },
  ogbunike_knn_nearest_distance: {
    truth: () => CL.knnClassify({ X: pick(ogX, TR), y: pick(ogY, TR), Xnew: pick(ogX, TE), k: ogS.k }).distances[0][0],
    wrong: {
      squared_distance: () => CL.knnClassify({ X: pick(ogX, TR), y: pick(ogY, TR), Xnew: pick(ogX, TE), k: ogS.k }).distances[0][0] ** 2,
      raw_logs: () => CL.knnClassify({ X: pick(ogX, TR), y: pick(ogY, TR), Xnew: pick(ogX, TE), k: ogS.k, scale: 'none' }).distances[0][0],
      scaler_on_every_cored_row: () => Math.min(...scaleWith(pick(ogX, TR), allSc).map((r) => dist(r, scaleWith([ogX[TE[0]]], allSc)[0]))),
      new_rows_on_their_own_scaler: () => Math.min(...scaleWith(pick(ogX, TR), trSc).map((r) => dist(r, scaleWith([ogX[TE[0]]], teOwn)[0]))),
      second_neighbour: () => CL.knnClassify({ X: pick(ogX, TR), y: pick(ogY, TR), Xnew: pick(ogX, TE), k: ogS.k }).distances[0][1],
    },
  },
  ogbunike_cart_node2_gini: {
    truth: () => ogT.nodes[2].gini,
    wrong: {
      pef_taken_on_the_tie: () => tree(ogX5.map((r) => [r[0], r[1], r[3], r[2], r[4]]), ogY, { names: ['GR', 'RHOB', 'PEF', 'NPHI', 'CALI'] }).nodes[2].gini,
      root_gini_quoted: () => ogT.nodes[0].gini,
      node_one_read: () => ogT.nodes[1].gini,
      training_wells_only: () => tree(pick(ogX5, TR), pick(ogY, TR)).nodes[2].gini,
      entropy_instead: () => { const c = ogT.nodes[2].counts.filter((v) => v > 0); const n = sum(c); return -sum(c.map((v) => (v / n) * Math.log2(v / n))); },
    },
  },
  ogbunike_cart_nphi_importance: {
    truth: () => ogT.featureImportances[2],
    wrong: {
      pef_first_column_order: () => tree(ogX5.map((r) => [r[0], r[1], r[3], r[2], r[4]]), ogY, { names: ['GR', 'RHOB', 'PEF', 'NPHI', 'CALI'] }).featureImportances[3],
      depth_three: () => tree(ogX5, ogY, { maxDepth: 3 }).featureImportances[2],
      root_decrease_quoted: () => ogT.nodes[0].impurityDecrease,
      min_leaf_five: () => tree(ogX5, ogY, { minSamplesLeaf: 5 }).featureImportances[2],
      training_wells_only: () => tree(pick(ogX5, TR), pick(ogY, TR)).featureImportances[2],
    },
  },
  ogbunike_cart_depth3_heldout_accuracy: {
    truth: () => t3acc(),
    wrong: {
      depth_four: () => t3acc({ maxDepth: ogS.depth + 1 }),
      depth_two: () => t3acc({ maxDepth: 2 }),
      held_out_well_in_training: () => t3acc({}, ALL),
      training_accuracy_quoted: () => tree(pick(ogX5, TR), pick(ogY, TR), { maxDepth: ogS.depth }).trainingAccuracy,
      k_nearest_instead: () => knnAcc(),
    },
  },
  ogbunike_uncored_gr_minmax_max: {
    truth: () => mmU(ogX),
    wrong: {
      uncored_well_in_the_fit: () => mmU([...ogX, ...ogU]),
      standard_score_instead: () => Math.max(...ML.applyScaler({ scaler: ML.fitStandardScaler({ X: ogX }), X: ogU }).X.map((r) => r[0])),
      mean_not_highest: () => mean(ML.applyScaler({ scaler: ML.fitMinMaxScaler({ X: ogX }), X: ogU }).X.map((r) => r[0])),
      stated_offset_removed: () => Math.max(...ML.applyScaler({ scaler: ML.fitMinMaxScaler({ X: ogX }), X: ogU.map((r) => [r[0] - ogS.hotAdd, r[1], r[2], r[3]]) }).X.map((r) => r[0])),
      raw_gr_over_cored_max: () => Math.max(...ogU.map((r) => r[0])) / Math.max(...ogX.map((r) => r[0])),
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
    const d = Math.abs(got - t);
    if (!Number.isFinite(got) || d > tol) {
      moved.push(name);
      const ratio = Number.isFinite(got) ? d / tol : Infinity;
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
