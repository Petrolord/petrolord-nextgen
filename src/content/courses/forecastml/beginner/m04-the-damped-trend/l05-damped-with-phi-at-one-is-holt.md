# Damped with phi at one is Holt

{{panel:pf-smoothing-explorer}}

Set phi to 1 in the damped recursion and every place phi appears multiplies by 1. What is left is Holt's linear trend, term for term. The engine is built so that this holds exactly, and it is a useful check that the two methods are implemented as one family.

## The same recursion

The damped fitted value is f_t = l_{t-1} + phi b_{t-1}; with phi 1 it is Holt's l_{t-1} + b_{t-1}. The damped trend update carries (1 - beta) phi b_{t-1}; with phi 1 it is Holt's (1 - beta) b_{t-1}. The h-step bracket phi + phi^2 + ... + phi^h becomes 1 + 1 + ... + 1, which is h, and the forecast becomes Holt's l_n + h b_n.

## The same numbers, bit for bit

On EKENE-P1 with alpha 0.5 and beta 0.2, the damped fit with phi 1 given returns the same SSE as Holt, 29230.297102, and the same 12 h-step forecasts, bit for bit.

| fit on EKENE-P1, alpha 0.5, beta 0.2 | SSE | forecast at step 12 |
| --- | --- | --- |
| holt | 29230.297102 | 137.618258 |
| damped, phi 1 given | 29230.297102 | 137.618258 |

## Phi 1 can be given and never fitted

A given phi may be any number above 0 and at most 1, so phi 1 is accepted. A fitted phi is searched from 0.8 to 0.98, so the fit never reaches 1. That is deliberate: a fitted damped trend is meant to damp. If you want Holt, ask for Holt.

## Holt takes no phi

Because Holt is the damped method with phi fixed at 1, giving Holt a phi makes no sense, and the engine refuses it with the reason in the message:

> phi applies to 'damped' only: 'holt' is the damped method with phi = 1

Simple smoothing refuses a phi too, for a different reason stated in its own message: it has no trend to damp. The damped method is the only one of the three that takes phi.

## Why the identity is worth checking

Two methods that should agree at a limit are a free test of an implementation. If damped with phi 1 and Holt ever disagreed, one of them would be wrong. The course checked this identity through the engine, and you can run it yourself in the panel. It also tells you how to read a fitted phi near the top of its range: at 0.98 the damped trend is close to Holt for many steps, and only the far steps show the difference.

The identity holds for the same start as well. Both begin at l_1 = y_1 and b_1 = y_2 - y_1, both spend month 1, and both score from index 2.

## Exercise

In the smoothing explorer choose "Fit a method", load EKENE-P1, pick holt with alpha 0.5 and beta 0.2 and h 12, and note the SSE and step 12. Then pick damped with the same alpha and beta and phi 1, and compare both figures digit for digit. Repeat with phi 0.98 and see how far step 12 moves.
