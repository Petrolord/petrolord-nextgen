# H4 Consequence Modelling: the panels

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course; the engine's FINDINGS record, the oracle and the
engine's source comments are PROVENANCE.

## WHAT IS SHIPPED

Under `src/components/course/panels/consequence/` in the NextGen repository:

* `consequenceLab.js`, the ONE teaching lab. It carries the teaching streams
  (deep-equal to `h4_fields.mjs`, both ways, asserted by the lab test), thin
  routes to the engine for whatever a learner types, and seventeen teaching
  readers. It reads the Yellow Book pool fire from the vendored golden. It holds
  no graded answer, no tolerance and no capstone facility or input.
* `gradedTolerance.js`, **the only place a grading tolerance is made**:
  `max(stated, half a unit in the last place the course prints that class)`.
* `gradedAnswerGuard.js`, every string shape a graded answer can reach a
  learner as.
* `ReleaseExplorer.jsx` (`cq-release`), `FireExplorer.jsx` (`cq-fire`),
  `HarmExplorer.jsx` (`cq-harm`) and `panelBits.jsx`.

The learning page is `src/pages/apps/ConsequenceLearningPage.jsx`, routed at
`/dashboard/apps/consequence`. The panels are registered in
`src/content/courses/panelRegistry.js`, and `panelRender.test.jsx` renders every
view of every panel.

## THE THREE PANELS

Every panel takes the learner's own inputs, because that is how a capstone is
worked, and shows the engine's own refusal, verbatim and naming its field, when
an input is refused. A blank box reaches the engine as missing, so the engine
applies its own default.

### `cq-release`, the release explorer (Associate)

Three views: liquid and gas through a hole (the AMENAM lines, 19.354651 kg/s and
the critical pressure ratio 0.543927); a spill, its pool and its evaporation;
and the Gaussian plume with the distance to a concentration (UBIT, 239.712839
mg/m3 at 500 m in class D, and the stack's two roots).

### `cq-fire`, the fire explorer (Professional)

Three views: burning flux, flame length, tilt and surface emissive power (ERHA,
32.511563 m at 4 m/s); the view factor and Bagster; and the heat flux, the
distance to a heat flux and the Yellow Book pool fire (4582.518673 W/m2 against
the printed 4581).

### `cq-harm`, the harm explorer (Expert)

Three views: TNT equivalence and the blast field forward and inverse (7457.699887
Pa at 100 m from 500 kg); the probit ladder, the thermal presets and the
overpressure probit; and toxic probits with a changing concentration.

## THE RULES FOR EVERY PANEL

1. **No graded capstone answer, in any of four shapes**, no capstone facility
   name and no distinctive capstone input. `panelCapstoneGuard.test.js` sweeps
   the lab, the panels, the bits and the learning page.
2. **No refusal message is written in a panel or the lab.** Show `r.error`.
3. **No clock, no random number, no path under `/root`.**
4. **The copy rule**, swept by `gate_copy_rule.py`.
5. **The vocabulary and the seams**, swept by `gate_vocabulary.py` over the
   learner-facing strings of every panel.
6. **Properties are illustrative.** Every default is a teaching stream or a
   golden value.
