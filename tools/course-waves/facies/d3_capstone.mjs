// THE EIGHTEEN GRADED D3 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three fields, six graded values each, every one a RETURN VALUE of the
// vendored engines/dataai/cluster.js (or of ml.js where a scaler or a
// classification report is read). A gate that restates the formula validates
// nothing, so nothing here computes a scale, an eigenvalue, an inertia or a
// score by its own arithmetic: every number is read off an engine result
// object, and discriminate.mjs is where the wrong methods live.
//
//   IHIALA    Associate     grouping logs into electrofacies: a scaler scale,
//                           the first component's share, a loading and a
//                           score, the k-means inertia and a centre in log
//                           units
//   NKWELLE   Professional  judging groups against core: an elbow drop
//                           fraction, the Ward cut's silhouette, a Ward merge height,
//                           an adjusted Rand index, a one-to-one macro F1 and
//                           a majority accuracy
//   OGBUNIKE  Expert        predicting facies and the engine's rules: a
//                           held-out kNN accuracy, a nearest distance, the
//                           Gini of the node the tied root sends right, an
//                           importance, a held-out
//                           tree accuracy and a range check on an uncored well
//
// The datasets are generated here, deterministically, through the canonical
// mulberry32 and randomNormal of lib/stats on stated seeds that differ from the
// teaching dataset's, with their own well names, sample counts and facies
// physics, and every scenario claim the brief will make is asserted.
//
// TWO CARE RULES FROM THE PROGRAMME, both asserted below:
//   * CONVERGENCE. Every k-means a graded value reads has converged, and every
//     one of its starts too; no graded value is a stop by maxIter.
//   * SEED. A value read from a seeded k-means carries its seed as a stated
//     input. On the next seed it either moves by more than ten tolerances (so
//     a learner who changes the seed cannot land on it) or it is the same
//     partition to 1e-12 (ten starts reach the same optimum, which the brief
//     states as a property of the data); the check prints which.
//
// Usage:
//   node d3_capstone.mjs            the human table
//   node d3_capstone.mjs --json     the rows make_fields.mjs writes
//   node d3_capstone.mjs --inputs   the three datasets and their stated
//                                   inputs, for oracle_check.py,
//                                   discriminate.mjs and gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST OR THE TEACHING DATASET, and the digest
// generator reads nothing here.
import process from 'node:process';

const ROOT = process.env.D3_ENGINES || '/root/wt-dai-d3-nextgen/packages/engines';
const CL = await import(`${ROOT}/engines/dataai/cluster.js`);
const ML = await import(`${ROOT}/engines/dataai/ml.js`);
const { mulberry32, randomNormal } = await import(`${ROOT}/lib/stats/stats.js`);
const TOLPATH = process.env.D3_TOLERANCE
  || '/root/wt-dai-d3-nextgen/src/components/course/panels/facies/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const NOTES = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
/** A call this file LABELS a success: no error key, and every top-level number finite. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const r3 = (x) => Math.round(x * 1000) / 1000;
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));
const pick = (a, idx) => idx.map((i) => a[i]);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** The capstone facies physics, one table for all three fields; every value differs from the teaching generator's. */
const FACIES = [
  ['sandstone', [42, 8], [2.31, 0.045], [0.21, 0.03], [1.85, 0.22]],
  ['shaly-sand', [63, 13], [2.38, 0.05], [0.24, 0.035], [2.35, 0.33]],
  ['shale', [112, 13], [2.53, 0.045], [0.32, 0.03], [3.25, 0.27]],
  ['limestone', [25, 6], [2.66, 0.03], [0.065, 0.02], [5.0, 0.3]],
];
const LIME = { nphiMax: 0.115, otherNphiMin: 0.125, pefMin: 4.25, otherPefMax: 3.85 };

/**
 * One capstone field: nWells wells of nPer samples, blocky facies (stay with
 * probability `stay`), logs from the per-facies normals, drawn on ONE stream.
 */
const buildField = ({ prefix, seed, nWells, nPer, topBase, stay, uncored = [], hot = null, hotAdd = 0 }) => {
  const g = mulberry32(seed);
  const nz = () => randomNormal(g);
  const wells = Array.from({ length: nWells }, (_, w) => ({ id: `${prefix}-${w + 1}`, top: topBase + 53 * w + Math.round(27 * g()) }));
  const rows = [];
  const withheld = {};
  wells.forEach((W) => {
    let f = Math.floor(g() * FACIES.length);
    const drawn = [];
    for (let i = 0; i < nPer; i += 1) {
      if (i > 0 && g() > stay) f = Math.floor(g() * FACIES.length);
      const [name, gr, rhob, nphi, pef] = FACIES[f];
      const lime = name === 'limestone';
      const GR = r1(gr[0] + gr[1] * nz() + (W.id === hot ? hotAdd : 0));
      const RHOB = r3(rhob[0] + rhob[1] * nz());
      const NPHI = r3(lime ? clamp(nphi[0] + nphi[1] * nz(), 0.01, LIME.nphiMax) : Math.max(LIME.otherNphiMin, nphi[0] + nphi[1] * nz()));
      const PEF = r2(lime ? Math.max(LIME.pefMin, pef[0] + pef[1] * nz()) : clamp(pef[0] + pef[1] * nz(), 1.2, LIME.otherPefMax));
      const CALI = r2(8.6 + Math.abs(0.3 * nz()));
      drawn.push(name);
      rows.push({ well: W.id, depth: W.top + i, GR, RHOB, NPHI, PEF, CALI, FACIES: uncored.includes(W.id) ? null : name });
    }
    if (uncored.includes(W.id)) withheld[W.id] = drawn;
  });
  return { wells, rows, withheld };
};

const LOGS = ['GR', 'RHOB', 'NPHI', 'PEF'];
const LOGS_C = [...LOGS, 'CALI'];
const Xof = (rows, feats = LOGS) => rows.map((r) => feats.map((f) => r[f]));
const coredOf = (F) => F.rows.filter((r) => r.FACIES !== null);

/* ========================================================= IHIALA, Associate

   Six cored wells, twenty-five samples each. The brief states: the four logs
   GR, RHOB, NPHI, PEF; the correlation PCA; k-means k 4, seed 7, the default
   ten starts, standard scaling; row 0 is IHIALA-1's first sample and row 24
   its last (rows counted from 0). */

const IHIALA = freeze({
  field: buildField({ prefix: 'IHIALA', seed: 70411, nWells: 6, nPer: 25, topBase: 5410, stay: 0.78 }),
  stated: { logs: LOGS, k: 4, seed: 7, centreRow: 24 },
});
const ihR = coredOf(IHIALA.field);
must('Ihiala: every row is cored', ihR.length === IHIALA.field.rows.length, ihR.length);
const ihX = Xof(ihR);
const ihY = ihR.map((r) => r.FACIES);
const ihPC = success('Ihiala pca', CL.pca({ X: ihX, names: LOGS }));
const ihKM = success('Ihiala kmeans', CL.kmeans({ X: ihX, k: IHIALA.stated.k, seed: IHIALA.stated.seed, names: LOGS }));
must('Ihiala: every k-means start converged', ihKM.converged && ihKM.runs.every((r) => r.converged), 'converged');
const ihK1 = success('Ihiala kmeans one start', CL.kmeans({ X: ihX, k: IHIALA.stated.k, seed: IHIALA.stated.seed, nInit: 1, names: LOGS }));
must('Ihiala: one start stops above the ten-start inertia', ihK1.inertia > ihKM.inertia * (1 + 1e-6), `${ihK1.inertia} ${ihKM.inertia}`);
must('Ihiala: the correlation PCA converged with no repeated eigenvalue', ihPC.converged && ihPC.repeatedEigenvalues.length === 0, 'pca');

/* ======================================================= NKWELLE, Professional

   Seven cored wells, twenty-four samples each. The brief states: the four
   logs; elbow k 1 to 8, seed 5, ten starts; k-means k 4 and k 6, seed 5;
   agglomerative Ward and complete, cut at k 4, and the silhouette of the
   Ward cut; one-to-one matching at k 4
   and majority matching at k 6. */

const NKWELLE = freeze({
  field: buildField({ prefix: 'NKWELLE', seed: 70522, nWells: 7, nPer: 24, topBase: 7730, stay: 0.78 }),
  stated: { logs: LOGS, kMax: 8, seed: 5, k: 4, kOver: 6 },
});
const nkS = NKWELLE.stated;
const nkR = coredOf(NKWELLE.field);
const nkX = Xof(nkR);
const nkY = nkR.map((r) => r.FACIES);
const nkEL = success('Nkwelle elbow', CL.elbow({ X: nkX, kMin: 1, kMax: nkS.kMax, seed: nkS.seed, names: LOGS }));
must('Nkwelle: the elbow shows no rise', nkEL.inertiaRises.length === 0, nkEL.inertiaRises);
const nkKM = success('Nkwelle kmeans k 4', CL.kmeans({ X: nkX, k: nkS.k, seed: nkS.seed, names: LOGS }));
const nkK5 = success('Nkwelle kmeans k 6', CL.kmeans({ X: nkX, k: nkS.kOver, seed: nkS.seed, names: LOGS }));
must('Nkwelle: both k-means converged on every start', [nkKM, nkK5].every((k) => k.converged && k.runs.every((r) => r.converged)), 'converged');
const nkW = success('Nkwelle Ward k 4', CL.agglomerative({ X: nkX, linkage: 'ward', k: nkS.k, names: LOGS }));
const nkC = success('Nkwelle complete k 4', CL.agglomerative({ X: nkX, linkage: 'complete', k: nkS.k, names: LOGS }));
const nkSil = success('Nkwelle silhouette of the Ward cut', CL.silhouette({ X: nkX, labels: nkW.labels, names: LOGS }));
must('Nkwelle: no tied merge in either tree', nkW.tiedSteps === 0 && nkC.tiedSteps === 0, `${nkW.tiedSteps} ${nkC.tiedSteps}`);
const nkCA = success('Nkwelle ARI complete', CL.adjustedRandIndex({ a: nkY, b: nkC.labels }));
const nkM4 = success('Nkwelle one-to-one k 4', CL.matchClusters({ yTrue: nkY, clusters: nkKM.labels }));
const nkM5 = success('Nkwelle majority k 6', CL.matchClusters({ yTrue: nkY, clusters: nkK5.labels, mode: 'majority' }));
must('Nkwelle: one-to-one at k 6 is refused', !!CL.matchClusters({ yTrue: nkY, clusters: nkK5.labels }).error, 'refused');
must('Nkwelle: majority at k 6 leaves no facies without a cluster', new Set(nkM5.mapping.map((m) => m.facies)).size === 4, nkM5.mapping.map((m) => m.facies).join(','));

/* ========================================================== OGBUNIKE, Expert

   Seven wells, twenty-five samples each. OGBUNIKE-1 to OGBUNIKE-6 are cored;
   OGBUNIKE-7 is not, and was logged with a gamma ray tool reading 26 gAPI
   high. The brief states: the four logs for kNN, k 5, trained on the other
   five cored wells and scored on OGBUNIKE-4; the five channels (the four
   logs and CALI) for the tree, default depth on all cored rows, and depth 3
   on the other five cored wells scored on OGBUNIKE-4; min-max scaling fitted on
   the cored rows for the range check of OGBUNIKE-7. */

const OGBUNIKE = freeze({
  field: buildField({ prefix: 'OGBUNIKE', seed: 70635, nWells: 7, nPer: 25, topBase: 5000, stay: 0.78, uncored: ['OGBUNIKE-7'], hot: 'OGBUNIKE-7', hotAdd: 26 }),
  stated: { logs: LOGS, channels: LOGS_C, k: 5, heldOut: 'OGBUNIKE-4', uncored: 'OGBUNIKE-7', hotAdd: 26, depth: 3 },
});
const ogS = OGBUNIKE.stated;
const ogR = coredOf(OGBUNIKE.field);
const ogG = ogR.map((r) => r.well);
const ogX = Xof(ogR); const ogX5 = Xof(ogR, LOGS_C);
const ogY = ogR.map((r) => r.FACIES);
const ogTR = ogG.map((g, i) => (g !== ogS.heldOut ? i : -1)).filter((i) => i >= 0);
const ogTE = ogG.map((g, i) => (g === ogS.heldOut ? i : -1)).filter((i) => i >= 0);
must('Ogbunike: the held-out well has 25 rows and the training wells 125', ogTE.length === 25 && ogTR.length === 125, `${ogTE.length} ${ogTR.length}`);
const ogKN = success('Ogbunike knn', CL.knnClassify({ X: pick(ogX, ogTR), y: pick(ogY, ogTR), Xnew: pick(ogX, ogTE), k: ogS.k, names: LOGS }));
const ogKNrep = success('Ogbunike knn accuracy', ML.classificationReport({ yTrue: pick(ogY, ogTE), yPred: ogKN.predictions }));
must('Ogbunike: no tied vote on the held-out well', ogKN.tiedVotes === 0, ogKN.tiedVotes);
const ogT = success('Ogbunike cartFit', CL.cartFit({ X: ogX5, y: ogY, names: LOGS_C }));
const ogRoot = ogT.nodes[0];
must('Ogbunike: the root splits on NPHI', ogRoot.feature === 'NPHI', ogRoot.feature);
must('Ogbunike: node 2 is the right child of the root', ogRoot.right === 2 && !ogT.nodes[2].leaf, ogRoot.right);
const ogSw = success('Ogbunike cartFit, PEF before NPHI', CL.cartFit({ X: ogX5.map((r) => [r[0], r[1], r[3], r[2], r[4]]), y: ogY, names: ['GR', 'RHOB', 'PEF', 'NPHI', 'CALI'], maxDepth: 1 }));
must('Ogbunike: the root is a tie that PEF takes when it comes first', ogSw.nodes[0].feature === 'PEF' && ogSw.nodes[0].impurityDecrease === success('Ogbunike depth 1', CL.cartFit({ X: ogX5, y: ogY, names: LOGS_C, maxDepth: 1 })).nodes[0].impurityDecrease, ogSw.nodes[0].feature);
const ogT3 = success('Ogbunike cartFit depth 3 on the training wells', CL.cartFit({ X: pick(ogX5, ogTR), y: pick(ogY, ogTR), names: LOGS_C, maxDepth: ogS.depth }));
const ogT3p = success('Ogbunike cartPredict held out', CL.cartPredict({ model: ogT3, X: pick(ogX5, ogTE) }));
const ogT3rep = success('Ogbunike tree accuracy', ML.classificationReport({ yTrue: pick(ogY, ogTE), yPred: ogT3p.predictions }));
const ogMM = success('Ogbunike min-max on the cored rows', ML.fitMinMaxScaler({ X: ogX, names: LOGS }));
const ogU = OGBUNIKE.field.rows.filter((r) => r.well === ogS.uncored);
must('Ogbunike: the uncored well has 25 rows and no facies', ogU.length === 25 && ogU.every((r) => r.FACIES === null), ogU.length);
const ogUs = success('Ogbunike applyScaler to the uncored well', ML.applyScaler({ scaler: ogMM, X: Xof(ogU) }));
const ogUmax = Math.max(...ogUs.X.map((r) => r[0]));
must('Ogbunike: the uncored well reads above the cored GR range', ogUmax > 1, ogUmax);

/* ---------------------------------------------------------------- the rows */

const centreRowCluster = ihKM.labels[IHIALA.stated.centreRow];
must('Ihiala: row 24 is the last sample of IHIALA-1', ihR[IHIALA.stated.centreRow].well === 'IHIALA-1' && ihR[IHIALA.stated.centreRow + 1].well === 'IHIALA-2', ihR[IHIALA.stated.centreRow].well);
const ROWS = [
  ['beginner', 'ihiala_gr_scale_gapi', 'scale', ihKM.scaler.scale[0]],
  ['beginner', 'ihiala_pc1_ratio', 'ratio', ihPC.explainedVarianceRatio[0]],
  ['beginner', 'ihiala_pc1_nphi_loading', 'loading', ihPC.loadings[0][2]],
  ['beginner', 'ihiala_pc1_score_first_row', 'score', ihPC.scores[0][0]],
  ['beginner', 'ihiala_kmeans_inertia', 'inertia', ihKM.inertia],
  ['beginner', 'ihiala_row24_cluster_gr_centre_gapi', 'centre', ihKM.centresOriginal[centreRowCluster][0]],
  ['intermediate', 'nkwelle_elbow_drop_fraction_k4', 'ratio', nkEL.table[nkS.k - 1].dropFraction],
  ['intermediate', 'nkwelle_ward_silhouette', 'silhouette', nkSil.mean],
  ['intermediate', 'nkwelle_ward_height_above_cut', 'height', nkW.cutHeights.above],
  ['intermediate', 'nkwelle_complete_ari', 'index', nkCA.ari],
  ['intermediate', 'nkwelle_one_to_one_macro_f1', 'accuracy', nkM4.report.macro.f1],
  ['intermediate', 'nkwelle_majority_accuracy_k6', 'accuracy', nkM5.report.accuracy],
  ['advanced', 'ogbunike_knn_heldout_accuracy', 'accuracy', ogKNrep.accuracy],
  ['advanced', 'ogbunike_knn_nearest_distance', 'distance', ogKN.distances[0][0]],
  ['advanced', 'ogbunike_cart_node2_gini', 'impurity', ogT.nodes[2].gini],
  ['advanced', 'ogbunike_cart_nphi_importance', 'importance', ogT.featureImportances[2]],
  ['advanced', 'ogbunike_cart_depth3_heldout_accuracy', 'accuracy', ogT3rep.accuracy],
  ['advanced', 'ogbunike_uncored_gr_minmax_max', 'scale', ogUmax],
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

// A value read from a seeded k-means, on the next seed: it moves by more than
// ten tolerances, or it is the same to 1e-12 relative. Anything between is a
// value a seed can nudge inside the band, which grades luck.
const nextSeed = [
  ['ihiala_kmeans_inertia', () => CL.kmeans({ X: ihX, k: IHIALA.stated.k, seed: IHIALA.stated.seed + 1 }).inertia],
  ['ihiala_row24_cluster_gr_centre_gapi', () => { const k = CL.kmeans({ X: ihX, k: IHIALA.stated.k, seed: IHIALA.stated.seed + 1 }); return k.centresOriginal[k.labels[IHIALA.stated.centreRow]][0]; }],
  ['nkwelle_elbow_drop_fraction_k4', () => CL.elbow({ X: nkX, kMin: 1, kMax: nkS.kMax, seed: nkS.seed + 1 }).table[nkS.k - 1].dropFraction],
  ['nkwelle_one_to_one_macro_f1', () => CL.matchClusters({ yTrue: nkY, clusters: CL.kmeans({ X: nkX, k: nkS.k, seed: nkS.seed + 1 }).labels }).report.macro.f1],
  ['nkwelle_majority_accuracy_k6', () => CL.matchClusters({ yTrue: nkY, clusters: CL.kmeans({ X: nkX, k: nkS.kOver, seed: nkS.seed + 1 }).labels, mode: 'majority' }).report.accuracy],
];
nextSeed.forEach(([key, f]) => {
  const v = f();
  const d = Math.abs(v - byKey[key]);
  const same = d <= 1e-12 * Math.abs(byKey[key]);
  must(`SEED: ${key} on the next seed moves by more than ten tolerances or is the same`, same || d > 10 * gradedTolerance(key), `${v} vs ${byKey[key]}`);
  NOTES.push(`SEED ${key}: next seed ${same ? 'reaches the same value (a stable optimum)' : `moves by ${(d / gradedTolerance(key)).toFixed(1)} tolerances`}`);
});

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d3_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
if (!process.argv.includes('--json') && !process.argv.includes('--inputs')) NOTES.forEach((n) => process.stderr.write(`  ${n}\n`));
process.stderr.write(`d3_capstone: ${ASSERTS.length} label-and-call, scenario, convergence and seed assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ IHIALA, NKWELLE, OGBUNIKE })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 44)}${pad('CLASS', 12)}${pad('VALUE', 20)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 44)}${pad(r.cls, 12)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 20)}${gradedTolerance(r.key)}\n`));
}
