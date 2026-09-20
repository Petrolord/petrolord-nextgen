# H3 Process Safety: LOPA & SIL Determination: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course; the engine's FINDINGS record, the oracle and the
engine's source comments are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/lopa/` in the NextGen repository:

* `lopaLab.js`, the ONE teaching lab. It carries the teaching streams
  (deep-equal to `h3_fields.mjs`, both ways, asserted by the lab test), thin
  routes to the engine for whatever a learner types, and seventeen teaching
  readers. It reads the published worked SIF from the vendored golden. It holds
  no graded answer, no tolerance and no capstone facility or input.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are both written out of it.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as.
* `WorksheetExplorer.jsx` (`lp-worksheet`), `SifExplorer.jsx`
  (`lp-sif-builder`), `ProofTestExplorer.jsx` (`lp-proof-test`) and
  `panelBits.jsx`.

The learning page is `src/pages/apps/LopaLearningPage.jsx`, routed at
`/dashboard/apps/lopa`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders
every view of every panel.

## THE THREE PANELS

Every panel takes the learner's own inputs, because that is how a capstone is
worked, and shows the engine's own refusal, verbatim and naming its field, when
an input is refused. A blank box is a question and a zero is a statement, so a
blank reaches the engine as missing and never as zero.

### `lp-worksheet`, the LOPA worksheet (Associate)

Three views: a LOPA row typed in full (IEF, TMEL, enabling conditions, modifiers
and IPLs one per line, an optional proposed SIF), with the credited and
uncredited IPLs and the engine's reasons; closing the loop on ORONI at a typed
TMEL and SIF; and the outcome states, the bands and the decade snap. Teaching
tables: ORONI's TMEL ladder (13.500000 at 1e-6), the forgotten-factor table, the
four proposed SIFs (0.009 in SIL 2 and missing), the RRF and PFDavg ladders and
the snap products.

### `lp-sif-builder`, the SIF PFDavg builder (Professional)

Three views: one subsystem in any architecture with every Annex B input, its
terms, equivalent down times, warnings and formula; a SIF of three subsystems
with the loop back to ORONI's TMEL (defaults are the IDU teaching SIF,
0.001792971954); and the published worked SIF from the golden, reproducing
1.29E-03 and an RRF of 777.

### `lp-proof-test`, the proof-test explorer (Expert)

Three views: PFDavg over typed intervals with the ratio row by row; the longest
interval for a typed target and its state; and the coverage floor with the
stretched SIF. Defaults are the IDU valves and the OBAGI valve at a coverage of
0.8.

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone facility
   name and no distinctive capstone input. `panelCapstoneGuard.test.js` sweeps
   the lab, the panels, the bits and the learning page, and plants each shape to
   prove the sweep catches it.
2. **No refusal message is written in a panel or the lab.** Show `r.error`.
3. **No clock, no random number, no path under `/root`.**
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive.
   `gate_copy_rule.py` sweeps the panels and the page as well as the digest.
5. **The vocabulary.** "beta factor", "PFDavg" or "IPL PFD", never "severity".
   `gate_vocabulary.py` sweeps the learner-facing strings of every panel.
6. **Failure rates are illustrative.** Every default is a teaching stream or a
   golden value, and the panel says so.
