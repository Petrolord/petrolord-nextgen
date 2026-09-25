# Parameters on their bounds

{{panel:pf-smoothing-explorer}}

The fit searches inside a box: alpha and beta from 0 to 1, phi from 0.8 to 0.98. Sometimes the least SSE the fit can reach sits on an edge of that box. The engine reports every such case by name, and reading those reports is part of reading a fit.

## `atBounds`

The optimiser record carries `atBounds`, a list of every fitted parameter that ended exactly on a bound of its box: alpha or beta at 0 or 1, phi at 0.8 or 0.98. A parameter you gave is never listed, because it was not fitted. Across the fits the course reads on the Ekene wells:

| well | method | atBounds |
| --- | --- | --- |
| EKENE-P1 | ses | alpha = 1 |
| EKENE-P2 | ses | alpha = 1 |
| EKENE-P3 | ses | alpha = 1 |
| EKENE-P5 | ses | alpha = 1 |
| EKENE-P2 | damped | alpha = 1, beta = 0 |
| EKENE-P4 | damped | phi = 0.8 |

## What a bound means

A parameter on its bound is a fitted value like any other. It says that the SSE was still falling at the edge of the box: had the box been wider, the fit would have gone further. The engine does not treat it as a failure and neither should you. It is information about the series and the method together.

Each bound has a plain reading:

| bound | what the method becomes there |
| --- | --- |
| alpha = 1 | the level is always the newest rate; for ses, the naive forecast |
| alpha = 0 | the level never moves from its start |
| beta = 0 | the trend takes nothing from the newest change in level |
| beta = 1 | the trend is always the newest change in level |
| phi = 0.8 | the strongest damping the fit may choose |
| phi = 0.98 | the weakest damping the fit may choose |

## Reading the Ekene bounds

Simple smoothing on four of the five long wells ends on alpha 1, the naive forecast. The method has no trend, and on a decline the least lag comes from the newest month alone. On a steady decline the bound says the method needs a trend.

The damped trend on EKENE-P4 ends on phi 0.8. On a noisy allocation the fit wanted the trend to fade as fast as the box allows, and faster if it could. A forecaster reading that might give a lower phi and compare, or accept that the damped trend here is close to a level with a short-lived slope.

The damped trend on EKENE-P2 ends on two bounds, alpha 1 and beta 0: a level that jumps to every new rate and a trend that learns nothing from the months after its start, fading only by phi.

## Why the box has edges

Alpha and beta outside 0 to 1 would not be weighted averages any more; the recursion would put a negative weight on the new rate or on the old forecast. Phi's narrower box is a choice the engine states, following FPP3: below 0.8 the damping has a very strong effect, and near 1 the damped trend cannot be told apart from Holt's. A given phi may go outside the fitted box, down to just above 0 and up to 1; a given alpha or beta may not leave 0 to 1, and is refused if it tries:

> alpha must be a number from 0 to 1 (inclusive)

## Reporting a bound

When a fitted parameter sits on its bound, say so in the report beside its value: "phi 0.800000, on its lower bound". A reader who sees only 0.800000 may take it for a choice. A reader who sees the bound knows the fit ran out of room.

## Exercise

In the smoothing explorer choose "Fit a method" and fit damped, every parameter blank, on each 48-month Ekene well. Record `atBounds` for each and check it against the table. Then load EKENE-P4, give phi 0.7 with alpha and beta blank, and compare the SSE with the fit on phi 0.8.
