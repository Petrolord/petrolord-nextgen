# H5 Quantitative Risk Assessment: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course; the engine's FINDINGS record, the oracle and the
engine's source comments are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/qra/` in the NextGen repository:

* `qraLab.js`, the ONE teaching lab. It carries the teaching streams
  (deep-equal to `h5_fields.mjs`, both ways, asserted by the lab test), thin
  routes to the engine for whatever a learner types, and sixteen teaching
  readers. It reads the published cases from the vendored golden. It holds no
  graded answer, no tolerance and no capstone facility or input.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
  `fields.json` and `precision.json` are both written out of it.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as.
* `EventTreeExplorer.jsx` (`qr-event-tree`), `SocietalExplorer.jsx`
  (`qr-societal`), `AlarpExplorer.jsx` (`qr-alarp`) and `panelBits.jsx`.

The learning page is `src/pages/apps/QraLearningPage.jsx`, routed at
`/dashboard/apps/qra`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders
every view of every panel.

## THE THREE PANELS

Every panel takes the learner's own inputs, because that is how a capstone is
worked, and shows the engine's own refusal, verbatim and naming its field, when
an input is refused. A blank box is a question and a zero is a statement, so a
blank reaches the engine as missing and never as zero.

### `qr-event-tree`, the event tree and individual risk builder (Associate)

Three views: a flammable release through its tree (frequency, both ignition
probabilities, an optional split); the LSIR at one place from scenarios typed
one per line; and the IRPA of one person over places typed with hours or a
fraction. Teaching tables: the EREMOR release (explosion 0.000054000000), the
three wrong builds, the pooled overfill, the three places and the transect
contours, and the operator built wrongly.

### `qr-societal`, the societal risk explorer (Professional)

Three views: PLL and FAR from typed scenarios and a typed crew; the F-N curve
against the Dutch line, the R2P2 point or a line of the learner's own; and the
fractions of deaths indoors and outdoors, taught and never graded. Defaults are
the JISIKE crew (PLL 0.002420000000, FAR 2.016667) and the JISIKE off-site set.

### `qr-alarp`, the ALARP and cost-benefit explorer (Expert)

Three views: the region of a typed individual risk against a preset or the
learner's own thresholds, with the snap products; a measure through the gross
disproportion test with every rate typed; and the EDIKAN firewall under the
three conventions and the DF sweep. The published checklist example is read
from the golden.

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone facility
   name and no distinctive capstone input. `panelCapstoneGuard.test.js` sweeps
   the lab, the panels, the bits and the learning page, and plants each shape to
   prove the sweep catches it.
2. **No refusal message is written in a panel or the lab.** Show `r.error`.
3. **No clock, no random number, no path under `/root`.**
4. **The copy rule.** No em dashes, no en dashes, no "X, not Y" contrastive.
   `gate_copy_rule.py` sweeps the panels and the page as well as the digest.
5. **The vocabulary and the seams.** `gate_vocabulary.py` sweeps the
   learner-facing strings of every panel, sentence by sentence.
6. **A probability of death is a stated input**, and the panel says so.
