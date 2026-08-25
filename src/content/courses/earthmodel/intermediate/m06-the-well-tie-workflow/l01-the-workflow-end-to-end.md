# The workflow end to end

Every piece is on the table; this lesson assembles them into the sequence you would actually run, with the order constraints made explicit, because the order is not decorative.

## The sequence

One. Gather the well fixtures: surface location, kelly bushing, survey stations, top picks in MD, zone intervals. QC them on their own terms first: MDs increasing, picks in stratigraphic order, KB plausible, surveys starting shallow enough to constrain the hole.

Two. Build each well's trajectory by minimum curvature: implied vertical start, per-segment dogleg and ratio factor, stations accumulated in order.

Three. Land every pick: locate its MD within the trajectory, interpolate linearly in MD, obtain x, y, TVDSS.

Four. Sample the CLAMPED framework surface for each pick's top at its landing, bilinear in the frame, null if any corner is dead.

Five. Difference into residuals, pick TVDSS minus surface, and assemble the tie table with its per-well and per-top structure intact. Report null residuals as rows, never as omissions.

Six. Read the table by columns and rows, decompose the large entries (trajectory channel against zone ledger), and hand the findings to the owners of the surfaces, the picks, or the surveys, with the evidence attached.

Seven. Derive the zone control points, MD midpoints landed on the trajectory with MD-length weights, because the property tier consumes them next.

## The order constraints that matter

Trajectories before landings, obviously; but two subtler ones deserve emphasis. Clamp BEFORE sampling: the tie must be taken against the model as built, so the framework work of the Associate tier is upstream of every tie, and re-running the clamp after editing a surface invalidates the whole table, not just the edited surface's column, because the clamp couples the stack.

QC the wells before trusting the table: the tie table diagnoses model-versus-well disagreement, and it does so honestly only if the wells' own internal defects were caught first. A survey with a misordered station or a pick out of stratigraphic order produces tie rows that look like model problems and are not.

## What re-runs when something changes

The workflow is cheap enough to re-run whole, and the dependency structure says what a change touches. Edit a SURFACE: resample, re-clamp, re-sample ties for all tops (the clamp couples them), residuals change, control points do not. Edit a PICK: one landing, one row, and the affected zone's control point and weight. Edit a SURVEY: that well's trajectory, all its landings, all its rows, its control points. Nothing in the workflow justifies patching a single number in place; the engine family's doctrine, recompute rather than patch, holds because every step is a pure function of its inputs.

## Worked example

Trace one change through the graph: suppose W2's TopA pick moves from 1580 to 1590 m MD after a log review. Steps affected: landing (new MD, new position further into the hold, about 7.07 m east and 7.07 m deeper), sampling (new location, new blend weights), residual (new TVDSS against new surface value), and zone A's interval becomes 1590 to 1700, shortening the weight to 110 and moving the zone midpoint to MD 1645, which nudges the control point east. Steps NOT affected: the trajectory itself, every other well's rows, the other tops' surfaces. The blast radius of a pick edit is one row plus one control point, and knowing that is what makes iterative reconciliation tractable.

## Exercise

Write the corresponding blast radius for a change to W2's KB from 30 to 31 m: list every quantity in the workflow that changes and every one that does not, and note the one table-wide signature that would let you detect an accidental KB change from the residuals alone.
