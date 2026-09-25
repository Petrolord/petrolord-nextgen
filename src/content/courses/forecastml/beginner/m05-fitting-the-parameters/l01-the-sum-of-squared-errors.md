# The sum of squared one-step errors

{{panel:pf-smoothing-explorer}}

Every parameter you leave blank is fitted, and fitting needs a target. This engine's target is the sum of squared one-step errors over the scored months, the SSE. This lesson reads what that target rewards, and what happens when it cannot tell two parameter choices apart.

## Given or fitted

A parameter left out is fitted; a parameter given is held fixed. You can give some and leave others: fix phi and fit alpha and beta, or fix alpha and fit the rest. The result lists every parameter given in `fixed`, and the fit record says what happened to the others.

The basis of every fit states the target first: free parameters minimise the one-step SSE over the scored errors. How the engine searches for that minimum is the next lesson.

## What the SSE rewards

Each scored residual is a one-step error: the rate less the fitted value made the month before. Squaring makes every error count as positive and makes large errors count much more than small ones. A fit that minimises the SSE will accept many small misses to avoid one large one.

On EKENE-P1 under simple smoothing, the SSE falls as alpha rises:

| alpha | SSE |
| --- | --- |
| 0.1 | 1954345.253138 |
| 0.5 | 130321.602967 |
| 1 | 49562.030000 |

The fit follows that fall to alpha 1, the naive forecast. It does what the target asks: it makes next month's one-step forecast as close as possible to next month's rate, over the months it has seen. It knows nothing about step 12.

## Handing the fit back

Giving the fitted parameters back as fixed values returns the same SSE and forecasts, bit for bit. The optimiser record is then null, and the basis reads "all parameters given: no estimation". That is a quick way to freeze a fit you want to reuse, and to show a reader that the numbers come from stated parameters.

## When the SSE cannot choose

The golden case `holt-linear-exact` is the exact line 10, 12, 14, 16, 18, 20, 22, 24. Holt follows a straight line perfectly for any alpha and beta, so every pair scores SSE 0. The grid keeps its first point, alpha 0 and beta 0, and the search makes 0 moves. The parameters are not identified: any pair would fit as well. The forecasts 26.000000, 28.000000, 30.000000 continue the line.

A real well is never that clean, but a flat SSE surface is a warning worth knowing. When many parameter values give nearly the same SSE, the fitted values say little about the well, and a small change in the data can move them a long way.

## Exercise

In the smoothing explorer choose "Fit a method", load EKENE-P1, pick holt and leave alpha and beta blank. Note the fitted parameters and the SSE. Give those two values back, as printed, and compare the SSE: the values you typed are rounded to six decimals, so read how close it comes and whether the fit record now reads no estimation. Then type the series 10, 12, 14, 16, 18, 20, 22, 24, fit holt, and read the parameters and the number of moves.
