# The walk

What the engine does, step by step.

{{panel:gm-window-explorer}}

## The loop

Start at the first survey station or at one step, whichever is deeper. Step 30 m of measured depth at a time to total depth. At each step:

1. Get the hole's inclination and azimuth there, from the survey.
2. Get the true vertical depth there, from the survey.
3. Interpolate the five profile quantities onto that true vertical depth.
4. Run the full stability calculation at that attitude with those stresses.
5. Record a row.

## Why the step is in MEASURED depth

Because the trajectory is defined in measured depth, and because a horizontal section covers a great deal of measured depth at no true vertical depth at all.

Stepping in true vertical depth would put one point on a 1500 m lateral, and the lateral is where a horizontal well spends most of its length.

## Why 30 m

A compromise. Small enough that the tightest point is located to within half a stand, large enough that a 3000 m well is 99 evaluations rather than a thousand.

Each evaluation is two bisections over a 180 point theta sweep, so the cost is real but not large.

## What the resolution costs

The tightest point is reported at a grid depth. The true minimum could be up to 15 m either side.

For a mud programme that is irrelevant: nobody changes mud weight over 15 m. For interpreting WHY a point is tightest it matters, because a grid point can land just before or just after a change in the trajectory.

## What is skipped

Any depth where the survey gives no attitude, where the true vertical depth is not positive, or where the true vertical depth is above the top of the profile.

That last one is why the walk starts at 60 m on both wells rather than at the first station: the profile begins at 50 m of true vertical depth and the first usable grid step is the one below it.

## The row count

The slant well runs to 3000 m and gives 99 rows. The horizontal well runs to 2800 m and gives 92 rows, ending at 2790 m because 2820 would be past total depth.

Both counts come out of the arithmetic and both are checked against the goldens.

## What the walk returns besides rows

The tightest point, with its measured depth, true vertical depth, window width, lower bound and upper bound.

The shallowest depth at which the window CLOSES, if any. And a warning naming that depth if it exists.

## Exercise

Work out how many rows a 4500 m well would give at a 30 m step, and how many stability evaluations that is in total.

Then say what would change about the answer if the step were 10 m rather than 30.
