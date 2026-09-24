# D2 Machine Learning on Well Data: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle, the
library pins and the engine's source comments are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/mlcore/` in the NextGen repository:

* `mlcoreLab.js`, the ONE teaching lab. It reads `ekeneWells.json` (the
  committed output of `d2_fields.mjs`, deep-equal by test), carries thin routes
  to the engine for whatever a learner types, three composite helpers (fit and
  score on a group split, cross-validate by wells, predict a new well with its
  range check), a table parser, and nine teaching readers. It holds no graded
  answer, no tolerance and no capstone dataset.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are both written out of it.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as: the full double, twelve and nine significant digits, and the six
  decimals the course prints.
* `FitExplorer.jsx` (`ml-fit-explorer`), `ValidateExplorer.jsx`
  (`ml-validate-explorer`), `DiagnoseExplorer.jsx` (`ml-diagnose-explorer`) and
  `panelBits.jsx`.

The learning page is `src/pages/apps/MlCoreLearningPage.jsx`, routed at
`/dashboard/apps/mlcore`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders
every view of every panel.

## THE THREE PANELS

Every panel takes the learner's own table, because that is how a capstone is
worked: the first line names the columns, a column named `well` holds the well
names, and null or a dash is a missing value, which the engine then refuses by
name. Every panel shows the engine's own refusal, verbatim and naming its field.

### `ml-fit-explorer` (Associate)

Four views: split by rows or by whole wells (the teaching split holds out
EKENE-4, EKENE-5, EKENE-8); scaling fitted on the training rows, standard and
min-max; least squares scored on held-out wells (test RMSE 4.282693 on the
teaching split); RMSE, MAE and R-squared on the learner's own predictions.

### `ml-validate-explorer` (Professional)

Six views: ridge and its penalty (the Ekene lambda path, test RMSE 16.999672 at
lambda 0); cross-validation by wells with the mean of the fold scores; a
random-row split against a well split; logistic regression on a stated label
(the Ekene pay test wells, AUC 0.997475); the confusion matrix with precision,
recall and F1; ROC, AUC and log loss with tied scores.

### `ml-diagnose-explorer` (Expert)

Six views: the condition number and the refusal limit; separation and a
penalty that fits (PHIC at l2 1, 0.817700); Newton steps and the stopping rule
with the engine's warning; permutation importance with its seeds and repeats;
the learning curve counted in wells; a missing log predicted for a new well,
with the rows outside the training range flagged (EKENE-6, 4 rows above the GR
range).

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone field
   name, no run of capstone values and no distinctive capstone input.
   `panelCapstoneGuard.test.js` sweeps the lab, the dataset copy, the panels,
   the bits and the learning page, and plants each shape to prove the sweep
   catches it.
2. **No refusal message is written in a panel or the lab.** Show `r.error`,
   and a warning as `r.warning`.
3. **No clock, no random number, no path under `/root`.** The only random
   draws are the engine's seeded shuffles.
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive.
   `gate_copy_rule.py` sweeps the panels and the page as well as the digest.
5. **The vocabulary**, digest section 26.
