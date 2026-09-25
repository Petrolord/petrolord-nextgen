# The parameter box and the grid tie

{{panel:pf-uncertainty-explorer}}

{{panel:pf-smoothing-explorer}}

A fitted parameter is found by a search, and a search needs a box to search in and a rule for every tie it meets. The Associate tier fitted parameters; this lesson reads the box, the three tie rules and the stop rule as rules, because every fitted figure in this course depends on them.

## The box

A fitted alpha and beta stay in [0, 1], and a fitted phi in [0.8, 0.98]. The coarse grid scores alpha and beta at 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9 and 1, and phi at 0.8, 0.85, 0.9, 0.95 and 0.98. The compass search then moves from the best grid point, and a trial past an edge is clipped to it; a trial the clip leaves where it was is skipped.

A given phi follows a wider rule: any value above 0 and at most 1. A phi outside it is refused, naming the field `phi`:

> phi must be a number above 0 and at most 1 when given (when fitted it is searched from 0.8 to 0.98)

## Parameters on their bounds

`atBounds` lists every fitted parameter that ended exactly on an edge of its box. Across the course's fits:

| well | method | atBounds |
| --- | --- | --- |
| EKENE-P1 | ses | alpha = 1 |
| EKENE-P2 | damped | alpha = 1, beta = 0 |
| EKENE-P4 | damped | phi = 0.8 |

A parameter on its bound is a fitted value like any other; it says the SSE was still falling at the edge of the box. For alpha at 1 that is the naive forecast. For phi at 0.8 it is the strongest damping the fit may choose. The box is a stated choice: FPP3 restricts an estimated phi to 0.8 to 0.98, and a learner who wants a phi outside it must give it.

## Three tie rules

Decimal rates are not exact in binary, so two SSEs equal on paper can differ in their last bits. The engine decides each kind of tie by a stated rule:

| where | the band | what a tie keeps |
| --- | --- | --- |
| the coarse grid of the fit | a later point must be below best x (1 - 1.00e-12) | the earlier grid point (alpha outermost, then beta, then phi) |
| the ranking of a comparison | within 1.00e-12 relative | the listed order, methods as given and arps last |
| the compass search | a trial must be strictly below the current SSE | the earlier trial (+step before -step, alpha before beta before phi) |

The grid tie at work: the golden `holt-linear-exact` is the exact line 10, 12, 14, 16, 18, 20, 22, 24. Every alpha and beta give SSE 0, so the grid keeps its first point, alpha 0 and beta 0, and the search makes 0 moves. The parameters are not identified; any pair would fit as well, and the tie rule is what makes the answer the same every time.

## The stop rule

The compass step starts at 0.05 of each range, half the grid spacing, and halves after a sweep that improves nothing. The search stops when a sweep at a step of at most 2^-30 of the range, 9.31e-10, improves nothing. Holt on EKENE-P1 ends at 7.45e-10 after 26 halvings. The stop is a rule on the step: two fits that stop at SSEs printing alike are the same minimum only as far as the search could tell.

## Exercise

In the smoothing explorer, open "Fit a method" with EKENE-P4 and damped, every parameter free, and read the grid start, moves, halvings, evaluations and `atBounds`. Then type the line 10, 12, 14, 16, 18, 20, 22, 24, fit holt, and read the grid start and the moves. Finally give phi 0.5 on EKENE-P4 and read which parameters the tiles mark as given and which as fitted.
