# D4 Data-Driven Production Forecasting: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle, the
library pins and the engine's source comments are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/forecastml/` in the NextGen repository:

* `forecastLab.js`, the ONE teaching lab. It reads `ekeneProduction.json` (the
  committed output of `d4_fields.mjs`, byte-identical by test), carries thin
  routes to the engine for whatever a learner types, a series parser, a
  hold-out helper (fit on the first months, score the next with `accuracy`),
  and the teaching readers. It holds no graded answer, no tolerance and no
  capstone dataset.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are both written out of it.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as: the full double, twelve and nine significant digits, and the six
  decimals the course prints.
* `SmoothingExplorer.jsx` (`pf-smoothing-explorer`), `BacktestExplorer.jsx`
  (`pf-backtest-explorer`), `UncertaintyExplorer.jsx`
  (`pf-uncertainty-explorer`) and `panelBits.jsx`.

The learning page is `src/pages/apps/ForecastmlLearningPage.jsx`, routed at
`/dashboard/apps/forecastml`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders
every view of every panel.

## THE THREE PANELS

Every panel takes the learner's own series, because that is how a capstone is
worked: numbers separated by commas, spaces or new lines, oldest first; null or
a dash is a missing month, which the engine then refuses by name. Every panel
starts from an Ekene well and shows the engine's own refusal and reason,
verbatim.

### `pf-smoothing-explorer` (Associate)

Fit ses, holt or damped with any parameter given or left to the fit, and read
the fit record (grid start, compass search, moves, halvings, evaluations,
`atBounds`, `converged`); the recursion month by month (ses at alpha 0.3 on
EKENE-P1 forecasts 221.171043 at every step); the h-step forecasts and each
step's change (damped at phi 0.9: 184.933594 at step 12); ses across alpha; and
the three methods on one series with their MSE.

### `pf-backtest-explorer` (Professional)

Score any forecast against actuals (ME, MAE, RMSE, MAPE, sMAPE, MASE with its
scale and lag, and the reason for any metric returned as null); hold out the
last months (holt on EKENE-P1's teaching hold-out: MASE 0.241874); MASE across
the lag m; a rolling-origin backtest refitted or held (the teaching backtest:
origins 24, 30, 36, 42, MASE 0.374515 refitted); and errors by step ahead.

### `pf-uncertainty-explorer` (Expert)

Residual-bootstrap intervals with a stated method, seed and number of paths
(damped on EKENE-P1, seed 11: P90 174.139087 and P10 225.708211 at step 1);
seeds, paths and clipping side by side; the Arps baseline through the decline
curve engine with its time base (EKENE-P1: Di 0.060069 per month); the
smoothing methods ranked against Arps on the same origins; and a boundary rule
probed either side.

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone field
   name, no run of capstone values and no distinctive capstone input.
   `panelCapstoneGuard.test.js` sweeps the lab, the dataset copy, the panels,
   the bits and the learning page, and plants each shape to prove the sweep
   catches it.
2. **No refusal message is written in a panel or the lab.** Show `r.error`, a
   reason as `r.notes`, and a warning as `r.warnings`.
3. **No clock, no random number, no path under `/root`.** The only random
   draws are the engine's seeded bootstrap paths.
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive.
   `gate_copy_rule.py` sweeps the panels and the page as well as the digest.
5. **The vocabulary**, digest section 25: P90 is labelled the low case and P10
   the high case wherever a percentile is shown.
