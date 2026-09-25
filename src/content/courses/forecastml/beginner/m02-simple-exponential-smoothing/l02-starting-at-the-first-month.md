# Starting at the first month

{{panel:pf-smoothing-explorer}}

A recursion needs somewhere to start. Before month 1 can be forecast, simple smoothing needs a level, and there is no earlier month to build one from. Every tool that runs exponential smoothing makes a choice here, and the choice moves the numbers. This engine states its choice and holds to it.

## The level starts at the first rate

The engine anchors the level at the first observation: l_1 = y_1. The formulas in the basis count from 1, so y_1 is the rate at index 0, month 0. The first fitted value is therefore month 0's rate itself. On EKENE-P1, month 1's fitted value is 1176.100000, which is month 0's rate 1176.100000.

The start is stated in the basis of every simple smoothing result on EKENE-P1:

    l_1 = y_1; errors scored from index 1 (0-based), 47 of them

## Where the scoring starts

Month 0 has no fitted value, so it has no residual. The first residual is month 1's, and the engine records where scoring begins as `scoredFrom`, which is 1 for simple smoothing. The sum of squared errors, SSE, adds the residuals from index 1 on. EKENE-P1 has 48 months, so 47 residuals are scored.

The mean squared error, MSE, divides the SSE by the number of scored errors only. At alpha 0.3 on EKENE-P1 the SSE is 312538.074209 and the MSE 6649.746260.

## A different start, a different fit

The engine accepts an `initialLevel` that replaces y_1 as the start. With 1150.000000 given, the first fitted value is 1150.000000 and the rule reads "l_1 = initialLevel". At alpha 0.3 the SSE moves from 312538.074209 to 297403.122315.

| start | first fitted value | SSE at alpha 0.3 |
| --- | --- | --- |
| l_1 = y_1 | 1176.100000 | 312538.074209 |
| l_1 = initialLevel, 1150.000000 | 1150.000000 | 297403.122315 |

The start matters most for the first months. At alpha 0.3 the starting level still carries 0.7 of its weight after one month and fades by that factor each month after, so a start that is off shifts the early fitted values and their residuals, and the SSE with them. Later months barely notice.

An `initialLevel` must be a number. Anything else is refused:

> initialLevel must be a finite number when given

## Why this start

Other tools estimate the starting state as a parameter, or average several early months. Anchoring at the first observation has one strong merit: you can start the recursion by hand from the series alone and reproduce every fitted value the engine returns. The cost is that month 0 is taken at face value, noise and all. When you compare a fit from this engine with one from another tool, check the start before you compare the parameters.

## Exercise

In the smoothing explorer choose "The recursion, month by month", load EKENE-P1, pick ses and give alpha 0.3. Confirm month 1's fitted value equals month 0's rate. Read the start in the engine's words and the index scoring starts from. Then switch to "Fit a method" with the same settings and read the SSE and MSE; divide one by the other and count the scored errors.
