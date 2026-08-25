# The workflow end to end

Five modules have produced a set of results. This lesson puts them in the order you would run them on a project.

## The seven steps

**1. Build the map and freeze it.** Method, frame, cell size and extrapolation limit fixed, and written down. Everything after this regrids the same field many times, and every run must differ from the others in exactly one thing, the control set.

**2. Identify which wells are interior to the control hull.** That count is the number of wells you can cross validate, and it is usually much smaller than the well count. On Ekene it is one of six. Doing this first tells you how much validation is available before any is attempted.

**3. Run leave-one-out at every interior well.** Same frame, same settings, remove one well, regrid, sample at its own site. Record the residual with its sign. Record the blanks too, because a blank is a result.

**4. Run the jackknife at every location a decision depends on.** Remove each well in turn and sample at the prospect rather than at the removed well. This works for every well and it produces a spread rather than a residual.

**5. Record the current map's prediction at any planned well location.** Before it is drilled. This is the entire cost of a future blind test and it is one line in a notebook.

**6. When a new well arrives, compute the blind residual before adding it to the control.** Then add it, regrid, and difference the two maps: largest change, mean absolute change, movement at each prospect.

**7. Report the residuals individually and the jackknife per location.** Never average residuals of opposite sign into a single error figure, and never quote one jackknife range for a whole map.

## What each step protects against

Step 1 protects against residuals that measure the frame rather than the interpolation.

Step 2 protects against a validation table in which most rows are extrapolations.

Step 4 protects against having no uncertainty statement at all, which is the usual outcome when step 3 turns out to be available at one well.

Step 5 protects against the most avoidable loss in the whole workflow: a blind test destroyed by regridding before the prediction was written down.

Step 7 protects the reader.

## The order that is tempting and wrong

Running the validation after the map has been presented.

By then the map has been contoured, discussed and often decided upon, and validation becomes an audit that nobody wants to fail rather than a measurement that informs. If a jackknife spread of 7.77 m arrives after a prospect has been ranked on a 2.9 m difference from the crest, the arithmetic is the same and the conversation is much harder.

Validation belongs with the map, in the same document, produced at the same time.

## The special case worth planning for

Step 5 costs nothing and is forgotten more often than any other step, because it has to be done at a moment when nothing seems to be happening.

Build it into the well proposal. Every proposed location gets a predicted depth at the target horizon, recorded in the proposal document, which is written well before the well is spudded and is preserved regardless of what happens afterwards. When the pick arrives, the blind test is already set up.

On this field the payoff was a residual of $-5.67$ m, which is a third of the evidence the tier produced.

## Worked example

A field has twelve wells, three of them interior. A prospect is being ranked and a well is proposed. What does the workflow produce?

Three leave-one-out residuals, which is a small sample but enough to look for a common sign. A jackknife at the prospect with twelve values and a spread that will be considerably tighter than Ekene's, because removing one of twelve wells is a smaller perturbation than removing one of six. And a recorded prediction at the proposed well, which becomes a fourth residual in a few months.

Note which of those is available immediately and which is not. The jackknife is available today and is the number that will actually inform the ranking.

## Exercise

List the seven steps in order and state which one costs nothing and is most often skipped. Then explain in two sentences why every run must use the same frame.

As a self-check: freeze the map, identify the interior wells, run leave-one-out at those, run the jackknife at the decision locations, record the prediction at any planned well, compute the blind residual and the map difference when the well arrives, and report residuals individually with a per-location jackknife. Recording the prediction before drilling costs nothing and is the step most often skipped, because it has to be done when nothing appears to be happening. Every run must use the same frame because the residuals compare values sampled at fixed coordinates, and a frame that moves between runs changes where the nodes sit, so part of the difference between two runs would be the lattice rather than the control set.
