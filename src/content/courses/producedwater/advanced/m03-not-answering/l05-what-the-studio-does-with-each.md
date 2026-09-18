# What the studio does with each of the three

A screen is where these three acts either survive or get flattened. The Produced Water Treatment Studio builds a train of up to three stages over one water stream and reports what each stage removes, what the droplets left look like, and what comes out. Every one of those reports can arrive as an answer, as a refusal, or as an answer with a note.

{{panel:pw-train-explorer}}

## A refusal is shown as a refusal

When the engine returns an object carrying a named `error`, there is nothing to plot. The honest screen shows the refusal and its named cause, in the module's own words, against the input that caused it.

What a screen must never do is fall back to an earlier answer, blank the field, or show a dash. All three read as a value the reader failed to notice. A refusal is a sentence, and a sentence belongs where the number would have been.

## A withheld verdict is shown as a reason

This is the one that gets painted wrongly. The verdict fields come back null with a reason string beside them, and a blank is the most misleading thing a screen can put there: a reader seeing an empty verdict box beside real concentrations will read it as a fail.

A withheld verdict is not a fail. The screen has to show the REASON, and the three reasons say different things. A stage that did not run is a data entry problem. A missing specification is a question the user answers from their own permit. A specification of zero is an input error, and the module already says which of those it is.

The concentrations stay on the screen throughout, because they are real.

## A warning is shown beside an answer

A warning changes nothing about the answer, so a screen that hides the figure when a warning fires has invented a refusal the engine did not make. The figure stays, the warning sits beside it, and it names a quantity and a threshold so the user can disagree with it.

One note belongs beside a figure whether or not a warning fires. Every hydrocyclone cut size here is an IDEAL capture, and the engine says so on every return: re-entrainment, the reject split and the shear the liner itself applies are not in it, and field de-oilers are customarily credited with a coarser cut than this.

## The test to apply to any screen

Take a run of each of the three kinds and ask whether a user could tell them apart from the screen alone, with no access to the return object. If two of them look the same, the screen has lost information the engine took care to provide.

## Exercise

Produce one run of each of the three kinds in the panel. Sketch how each should appear to a user who has never read this course.

Then write the single sentence you would put on a screen for a withheld verdict, and check that a reader could not mistake it for a failing train.
