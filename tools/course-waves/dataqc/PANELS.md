# D1 Oilfield Data Quality: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle,
the library pins and the engine's source comments are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/dataqc/` in the NextGen repository:

* `dataqcLab.js`, the ONE teaching lab. It reads `ekeneDataset.json` (the
  committed output of `d1_fields.mjs`, deep-equal by test), carries thin routes
  to the engine for whatever a learner types, and nine teaching readers. It
  holds no graded answer, no tolerance and no capstone dataset.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are both written out of it.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as: the full double, twelve and nine significant digits, and the six
  decimals the course prints.
* `ChecksExplorer.jsx` (`dq-checks-explorer`), `OutliersExplorer.jsx`
  (`dq-outliers-explorer`), `MonitorExplorer.jsx` (`dq-monitor-explorer`) and
  `panelBits.jsx`.

The learning page is `src/pages/apps/DataQcLearningPage.jsx`, routed at
`/dashboard/apps/dataqc`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders
every view of every panel.

## THE THREE PANELS

Every panel takes the learner's own series, because that is how a capstone is
worked, and shows the engine's own refusal, verbatim and naming its field. In
a typed series the word null or a dash is a missing value.

### `dq-checks-explorer` (Associate)

Five views: completeness and coverage; range limits and rate rules; the index;
the consistency checks; well names. Defaults are the Ekene data: the density
across its gap, NPHI across its percent stretch, the splice index, the
cumulative around day 70, the gas meter around its frozen run, the 13 names.

### `dq-outliers-explorer` (Professional)

Six views: z and its ceiling (the gauge, ceiling 2.846050), the modified
z-score (186.162000 on the glitch), fences with R6 R7 R8 quartiles (the water
sand, fences 21.905000 and 48.685000), the Hampel window with a chart, Grubbs
(the core plugs, G 2.985356 against 2.507321), and Mahalanobis on two typed
variables (the oil sand, cutoff 7.377759).

### `dq-monitor-explorer` (Expert)

Four views: the individuals chart with phase one as the standard (centre
611.380000), EWMA with target and sigma from phase one, the CUSUM with k and h
in a stated unit, and the scorecard with editable counts and weights (0.927390
at the stated weights).

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone field
   name, no run of capstone values and no distinctive capstone input.
   `panelCapstoneGuard.test.js` sweeps the lab, the dataset copy, the panels,
   the bits and the learning page, and plants each shape to prove the sweep
   catches it.
2. **No refusal message is written in a panel or the lab.** Show `r.error`.
3. **No clock, no random number, no path under `/root`.**
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive.
   `gate_copy_rule.py` sweeps the panels and the page as well as the digest.
5. **The vocabulary**, digest section 32.
