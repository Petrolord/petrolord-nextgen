# Phi fitted and phi given

{{panel:pf-smoothing-explorer}}

Phi can reach the engine in two ways, and each has its own range. Left blank, phi is fitted inside a narrow box. Given, it may take almost any value from 0 to 1. The difference is deliberate, and reading a damped fit correctly means knowing which way its phi arrived.

## A fitted phi: 0.8 to 0.98

When phi is left out, the engine searches for it from 0.8 to 0.98 inclusive, alongside alpha and beta. Every 48-month well, damped with every parameter fitted:

| well | alpha | beta | phi | atBounds | SSE | forecast at step 12 |
| --- | --- | --- | --- | --- | --- | --- |
| EKENE-P1 | 0.657029 | 0.353869 | 0.960949 | none | 22288.217610 | 169.556510 |
| EKENE-P2 | 1.000000 | 0.000000 | 0.928195 | alpha = 1, beta = 0 | 378311.420472 | 219.894074 |
| EKENE-P3 | 0.594062 | 0.798138 | 0.913180 | none | 47100.236458 | 240.731542 |
| EKENE-P4 | 0.388341 | 0.109704 | 0.800000 | phi = 0.8 | 207120.428138 | 239.235397 |
| EKENE-P5 | 0.091167 | 0.434737 | 0.877145 | none | 14087.135207 | 7.425050 |

Four wells fit phi inside the box. EKENE-P4, the noisy allocation, fits phi on the lower bound 0.8, and the engine lists it in `atBounds` as "phi = 0.8". A phi on its bound is the strongest damping the fit may choose, and it says the SSE was still falling at that edge: on this noisy well the fit wanted the trend to fade even faster.

EKENE-P2 lists two bounds, alpha at 1 and beta at 0. With beta 0 the trend never updates from its start, and with alpha 1 the level is always the newest rate.

## Why the fitted range is narrow

The range follows the textbook Forecasting: Principles and Practice (FPP3), which restricts an estimated phi to 0.8 to 0.98. Far below 0.8 the trend fades so fast that the method behaves much like simple smoothing; close to 1 it fades so slowly that the method behaves much like Holt. Inside the box the damped trend stays distinct from both, and the fit cannot drift to either end by chasing a small drop in SSE.

## A given phi: above 0 and at most 1

A phi you give may be any number above 0 and at most 1, and it is held fixed. A phi below the fitted range can only be given. In the course's worked case, phi 0.5 is given: the engine accepts it, lists phi in `fixed`, and fits alpha and beta around it, reaching alpha 0.784159, beta 1.000000 and SSE 34690.033324.

Phi 0 and phi 1.05 are refused, with the rule for both kinds of phi in one sentence:

> phi must be a number above 0 and at most 1 when given (when fitted it is searched from 0.8 to 0.98)

## Which to use

Fit phi when you want the data to choose how much damping the history supports, inside the range FPP3 recommends. Give phi when you have a reason from outside the series, such as a view of how the decline will slow, and say so when you report the forecast. A given phi is a judgement; the report should show it as one. The fit record separates them: `fixed` lists every parameter given, and every other parameter was fitted.

## Exercise

In the smoothing explorer choose "Fit a method", pick damped and leave every parameter blank. Fit each 48-month well and record phi and `atBounds`. Then load EKENE-P4, give phi 0.9 with alpha and beta blank, and compare the SSE with the fitted one. Finally give phi 0.5 on EKENE-P1 and read which parameters are listed as given.
