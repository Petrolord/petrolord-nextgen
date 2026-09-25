# The grid, then the compass search

{{panel:pf-smoothing-explorer}}

The engine finds the parameters with the least SSE in two stages: a coarse grid that looks everywhere, then a compass search that closes in from the best grid point. Both stages are deterministic.

## The rule, in the engine's words

The basis of every fit with a free parameter reads:

    free parameters minimise the one-step SSE over the scored errors: grid (alpha, beta at 0 to 1 by 0.1; phi at 0.8, 0.85, 0.9, 0.95, 0.98; ties keep the earlier point), then compass search in the box alpha, beta in [0, 1] and phi in [0.8, 0.98] (step from 0.05 of the range, halved when no trial improves, stopping when a step of 2^-30 of the range improves nothing)

## Stage one: the grid

Alpha and beta are tried at 0, 0.1, 0.2 and so on up to 1, eleven values each, and phi at 0.8, 0.85, 0.9, 0.95 and 0.98. Every point of the grid is scored, alpha outermost, then beta, then phi, and the lowest SSE wins. That is 11 points for simple smoothing, 121 for Holt and 605 for the damped trend. When two points tie, the earlier one is kept, so the order of the loops is part of the rule.

The grid sees the whole box, but its best point can sit up to a grid spacing from the least SSE, so a second stage follows.

## Stage two: the compass search

From the best grid point, the search tries the step added, then the step taken away, on each free parameter in turn, alpha before beta before phi. It moves to the best trial that lowers the SSE. When a whole sweep improves nothing, it halves the step and tries again. The first step is 0.05 of each parameter's range, half the grid spacing, so the search starts by looking between grid points.

## EKENE-P1, the three methods

| method | grid start | grid SSE | final parameters | final SSE | moves | halvings | SSE evaluations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ses | alpha 1 | 49562.030000 | alpha 1.000000 | 49562.030000 | 0 | 26 | 38 |
| holt | alpha 0.7, beta 0.3 | 23147.088556 | alpha 0.661937, beta 0.381513 | 23041.767516 | 25 | 26 | 329 |
| damped | alpha 0.6, beta 0.4, phi 0.95 | 22413.710872 | alpha 0.657029, beta 0.353869, phi 0.960949 | 22288.217610 | 50 | 26 | 1067 |

In the ses row the grid's best point is already alpha 1, on the edge of the box. The search tries to go higher, which the box does not allow, and lower, which raises the SSE, so it makes 0 moves and halves its step until it stops. Of its 38 evaluations, 11 are the grid; the rest are the compass search's trials.

Holt starts at alpha 0.7 and beta 0.3 and makes 25 moves to reach alpha 0.661937 and beta 0.381513, taking the SSE from 23147.088556 to 23041.767516.

The final SSE is at most the grid SSE on every method, because the search only ever moves downhill.

## Why this optimiser

Other tools fit exponential smoothing by maximum likelihood with a gradient optimiser, and their parameters need not match this engine's. The grid and compass search chosen here uses no gradient and no random start. The same series gives the same parameters on any machine, which is what a course with one right answer needs.

## Exercise

In the smoothing explorer choose "Fit a method", load EKENE-P1 and fit ses, then holt, then damped, every parameter blank. For each, read the grid start, the moves, the halvings and the SSE evaluations. Subtract the grid's points from the evaluations to see how much work the compass search did. Then fit holt on EKENE-P4 and compare its number of moves.
