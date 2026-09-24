# D3 Electrofacies: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle, the
library pins and the engine's source comments are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/facies/` in the NextGen repository:

* `faciesLab.js`, the ONE teaching lab. It reads `ekeneFacies.json` (the
  committed output of `d3_fields.mjs`, byte-identical by test), carries thin
  routes to the engine for whatever a learner types, a table parser, and the
  teaching readers. It holds no graded answer, no tolerance and no capstone
  dataset.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are both written out of it.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as: the full double, twelve and nine significant digits, and the six
  decimals the course prints.
* `ClusterExplorer.jsx` (`ef-cluster-explorer`), `JudgeExplorer.jsx`
  (`ef-judge-explorer`), `ClassifyExplorer.jsx` (`ef-classify-explorer`) and
  `panelBits.jsx`.

The learning page is `src/pages/apps/FaciesLearningPage.jsx`, routed at
`/dashboard/apps/facies`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders
every view of every panel.

## THE THREE PANELS

Every panel takes the learner's own table, because that is how a capstone is
worked: the first line names the columns, a column named `well` holds the well
names, a column named `facies` holds core facies names, and null or a dash is a
missing value, which the engine then refuses by name. Every panel shows the
engine's own refusal and warning, verbatim.

### `ef-cluster-explorer` (Associate)

Scaling and distance (standard and min-max, the population SD, the nearest
other row raw and scaled: 161 and 173 of 180); the correlation PCA with its
eigenvalues, ratios, loadings and scores, and new rows projected (the first
component carries 0.682351); k-means with its seed, its starts and its pass
trace (the teaching clustering, k 4 and seed 3, reaches 58.289042); new rows
assigned to the nearest centre.

### `ef-judge-explorer` (Professional)

The elbow with drops and drop fractions; the silhouette of any labelling, each
cluster's and the mean (0.545063 for the teaching clusters); agglomerative Ward,
complete and average linkage with the linkage matrix, the cut heights and a
re-cut; matching to core facies one to one and by majority with the contingency
table; the adjusted Rand index (0.872413 for the teaching clusters).

### `ef-classify-explorer` (Expert)

k nearest neighbours with a held-out cored well (EKENE-6 at k 5: 0.833333), the
neighbours, distances and votes of any row; the CART tree with its printed form,
its nodes and importances, and a depth sweep; the uncored wells predicted with
a min-max range check (EKENE-8: 10 rows above the GR range); the tie goldens
and the boundary rows.

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone field
   name, no run of capstone values and no distinctive capstone input.
   `panelCapstoneGuard.test.js` sweeps the lab, the dataset copy, the panels,
   the bits and the learning page, and plants each shape to prove the sweep
   catches it.
2. **No refusal message is written in a panel or the lab.** Show `r.error`,
   and a warning as `r.warning`.
3. **No clock, no random number, no path under `/root`.** The only random
   draws are the engine's seeded k-means++ draws and silhouette samples.
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive.
   `gate_copy_rule.py` sweeps the panels and the page as well as the digest.
5. **The vocabulary**, digest section 28.
