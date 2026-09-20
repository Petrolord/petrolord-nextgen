# H1 Safety Performance Statistics & KPIs: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course; the engine's FINDINGS record, the oracle and the
engine's source comments are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/safetystats/` in the NextGen repository:

* `safetystatsLab.js`, the ONE teaching lab. It carries the teaching streams
  (deep-equal to `h1_fields.mjs`, asserted by the lab test), thin routes to the
  engine for whatever a learner types, and seven teaching readers. It holds no
  graded answer, no tolerance and no capstone workplace.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are both written out of it.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as: the full double, twelve and nine significant digits, and the six
  decimals the course prints.
* `RatesExplorer.jsx` (`ss-rates-explorer`), `IntervalsExplorer.jsx`
  (`ss-intervals-explorer`), `UChartExplorer.jsx` (`ss-uchart-explorer`) and
  `panelBits.jsx`.

The learning page is `src/pages/apps/SafetyStatsLearningPage.jsx`, routed at
`/dashboard/apps/safetystats`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders
every view of every panel.

## THE THREE PANELS

Every panel takes the learner's own counts and hours, because that is how a
capstone is worked, and shows the engine's own refusal, verbatim and naming its
field, when an input is refused. A blank box is a question and a zero is a
statement, so a blank reaches the engine as missing and never as zero.

### `ss-rates-explorer` (Associate)

Four views: a count over hours on a NAMED base (the base selector includes "no
base", which shows the engine's refusal); FAR, the severity rate and the PSE
rate with the tier as an input; sum then divide over a typed series with the
mean of the period rates beside it; and the rolling rate over a typed series and
window. Teaching tables under each view: UGHELLI on every base (0.776317,
3.881586 and 388.158576), the two rosters (2.500000 and 1.717033), KWALE
(0.968312 pooled against 1.754760), AKASO's windows.

### `ss-intervals-explorer` (Professional)

Four views: the Garwood interval on a typed count, hours, base and confidence
(defaults are the BLS worked example, 3.500000 with limits 1.407182 and
7.211338); zero events at four confidence levels with the rule of three
labelled DERIVED; comparing two rates, with the minlike p-value labelled
DERIVED beside the engine's central one (defaults are UTOROGU: 0.051759 against
0.025879); and the IMO ladder.

### `ss-uchart-explorer` (Expert)

Three views: the chart on typed monthly counts and hours, with the centre, the
limits of every month, the signals and a chart; the chart redrawn with months
set aside; and before and after a typed intervention month with months set
aside. Defaults are EGBEMA: centre 2.893273, month 8 flagged, revised centre
2.389523.

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone workplace
   name and no capstone hours figure. `panelCapstoneGuard.test.js` sweeps the
   lab, the panels, the bits and the learning page, and plants each shape to
   prove the sweep catches it.
2. **No refusal message is written in a panel or the lab.** Show `r.error`.
3. **No clock, no random number, no path under `/root`.**
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive.
   `gate_copy_rule.py` sweeps the panels and the page as well as the digest.
5. **The vocabulary.** "Poisson count model", "severity rate", no P label on a
   confidence interval, "observed FAR".
6. **Every derived figure is labelled DERIVED** and routed through the lab (the
   rule of three and the minlike p-value are the only two).
