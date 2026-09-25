# Convergence and the stop rule

{{panel:pf-smoothing-explorer}}

A search that halves its step each time it fails could go on halving for ever. The engine stops it by a stated rule, and records whether the rule was met or the search ran out of effort first. This lesson reads that record: `finalStep`, the evaluation count and `converged`.

## The stop rule

The compass step starts at 0.05 of each parameter's range. After every sweep that improves nothing it is halved. The search stops when a sweep at a step of at most 2^-30 of the range improves nothing. That fraction is the stated default `PS_MIN_STEP`, which prints as 9.31e-10. When the rule is met, `converged` is true, and `finalStep` records the fraction the step had reached.

Holt on EKENE-P1 ends at a `finalStep` of 7.45e-10 after 26 halvings from 0.05. Each of the three fits on EKENE-P1 made 26 halvings, whatever its number of moves: the halvings count the step down from 0.05 to below 2^-30, and moves happen at whatever step finds an improvement.

| method on EKENE-P1 | moves | halvings | SSE evaluations | converged |
| --- | --- | --- | --- | --- |
| ses | 0 | 26 | 38 | true |
| holt | 25 | 26 | 329 | true |
| damped | 50 | 26 | 1067 | true |

## The cap on effort

A search also stops at 200000 SSE evaluations, the stated default `PS_MAX_EVALS`. A fit that hits that cap before its step reaches 2^-30 of the range stops with `converged` false, and the result carries `warnings`. It still returns parameters and forecasts. The warning says the search did not finish its own rule, so the parameters may not be the least SSE the box holds.

No fit in this course reaches that cap. Every optimiser record the course reads reports `converged` true, and the largest evaluation count on EKENE-P1, 1067 for the damped trend, is far below it.

## What converged means, and what it does not

`converged` true means the stop rule was met: at the finest step the search allows, no trial in any direction lowered the SSE. It is a statement about the search. It does not say the parameters are the best possible anywhere in the box, and it says nothing about how well the forecast will do past the last month.

Two fits that stop at SSEs printing alike are the same minimum only as far as the search could tell. A parameter printed to six decimals is the search's answer to that precision, and on a flat SSE surface a search from another starting point could stop somewhere else.

## A fit with nothing to search

When every parameter is given, there is nothing to fit. The optimiser record is null, and the basis reads "all parameters given: no estimation". There is no `converged` to read, because there was no search.

## Reading the record

Before you quote a fitted parameter, read four things from the fit record: `converged`, `atBounds`, the moves and the evaluations. `converged` true with an empty `atBounds` is the plain case. A bound is information about the series. A `converged` false is a warning to read before any figure from that fit is used.

## Exercise

In the smoothing explorer choose "Fit a method", load EKENE-P1 and fit each method with every parameter blank. Read the moves, halvings, SSE evaluations and converged for each and check them against the table. Then fit damped on each other long Ekene well and confirm every fit reports converged true.
