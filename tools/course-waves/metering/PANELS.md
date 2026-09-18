# FC8 `metering`: the panels

**No panel is built by the foundation.** This file says what the four registered
panel ids must show, what each must never show, and the rules any panel in this
wave obeys. The panel author reads `BRIEF.md` first.

## VERIFY THIS FILE YOURSELF RATHER THAN TRUSTING IT

Read `structure.py` for where each panel id is carried, and read the section of
`digest.txt` named beside each panel before building it. `digest.txt` is the only
source of numbers in this wave; `RECON.md`, `FINDINGS.md`, the vendored
`FINDINGS-metering.md` and the engine source comments are provenance and a panel
may not carry a figure from any of them. Build the panel against the
vendored engine through a lab module, and check what it renders against the
digest by eye, once, before you hand it over.

## THE FOUR IDS

**`fc-meterrun-explorer`** (Associate m01, m02, m05, m06). A meter run: the two
bores, the differential, the static pressure, the fluid, and the returned
coefficient, expansibility, Reynolds number and mass flow, with the uncertainty
budget beside them as a table of six terms. It must show the beta and it must
show whether the beta is inside the published range. Digest SECTIONS 2, 4, 13
and 14.

**`fc-choking-explorer`** (Professional m01, m02, m03). A valve, with the outlet
pressure as the thing the learner moves. It must show the stated drop, the
allowable drop, the drop the valve uses, the coefficient, the cavitation index
and the regime word, and it must make the crossing of the boundary visible.
Digest SECTIONS 17, 18 and 20.

**`fc-venting-explorer`** (Expert m01, m03). A tank: capacity, thermal venting
in each direction, movement venting in each direction, the totals, and which
direction governs. It must show the governing word the engine returns rather
than a word the panel decides. Digest SECTIONS 25 and 27.

**`fc-withheld-explorer`** (Associate m04, Expert m04, m06). The two refusals.
It shows the fire heat input being computed and the vent capacity coming back
empty with the engine's own reason beside it, and the straight-run table with
the withheld column shown as withheld. It exists so a learner sees a refusal as
a thing the software does rather than as a gap in a lesson. Digest SECTIONS 16,
28 and 31.

## RULES EVERY PANEL IN THIS WAVE OBEYS

* **Every number a panel shows comes through the lab, which comes through the
  vendored engine.** A panel may not compute a metering, valve or tank quantity
  of its own. A panel that imported an engine directly could print a number no
  gate in this course has ever seen.
* **A panel never reads the capstone.** Not a plant name, not a condition, not a
  graded answer, at any precision. The repository's capstone guard compares
  numerically and rendering-agnostically: it reads every decimal literal in the
  source and flags one that is a graded answer correctly rounded to that
  literal's own precision, which catches nine significant digits, full float
  precision and everything in between. A sibling wave's guard held one canonical
  rendering and the same answer at full float precision walked straight through
  it.
* **A panel never shows a withheld answer.** Where the engine returns null and a
  reason, the panel shows the reason. It does not show a blank, a zero, a dash
  or a placeholder, because all four read as a number the tool failed to
  compute rather than as an answer that is being refused.
* **No clock and no randomness.** No `new Date`, no `Date.now`, no
  `Math.random`. A panel that changes between two renders cannot be gated.
* **No em dashes and no en dashes**, anywhere in the source.
* **A panel states the provenance of a table value it shows.** If it shows an FL
  or an xT off the engine's style table, it says on the screen that the figure is
  the engine's own and that a certified vendor figure replaces it.

## WHAT A PANEL IS FOR

A learner should be able to move one input and watch a boundary get crossed.
That is the whole of this course: the coefficient that is not a constant, the
transmitter contribution that climbs as the reading falls, the drop the valve
stops being able to use, the direction that starts to govern. A panel that only
displays a result the lesson already printed is not worth building.
