# The exact test before any iteration

{{panel:ml-diagnose-explorer}}

The two previous lessons showed separated labels refused. This lesson shows how the engine decides it: before the first Newton step, with two linear programmes whose answers two theorems of the alternative settle, so the decision is exact up to the programme's own feasibility tolerance.

| programme | theorem | infeasible means | feasible means |
| --- | --- | --- | --- |
| S'w = 0, sum w = 1, w >= 0 | Gordan | complete separation | go on to the second programme |
| S'w = 0, w >= 1 | Stiemke | quasi-complete separation | no separation |

## The matrix S

Start from the design. Multiply each row by +1 when its label is 1 and by -1 when its label is 0. Then divide each column by its largest absolute value. Call the result S. A coefficient vector beta separates the classes when every entry of S beta is positive: after the sign flip, a pay row scored positive and a non-pay row scored negative both read positive.

## Gordan's theorem

Gordan's theorem says that exactly one of two things is true. Either some beta has S beta > 0, every entry strictly positive, which is complete separation. Or some weights w >= 0 that sum to 1 have S'w = 0. The engine solves the second as a linear programme. If that programme is infeasible, the first alternative must hold, and the labels are completely separated. The theorem turns a question about every possible beta into one feasibility question.

## Stiemke's theorem

If Gordan's programme is feasible, complete separation is ruled out. Stiemke's theorem says that either some weights w >= 1 have S'w = 0, which means no separation of any kind, or the separation is quasi-complete.

## What exact means here

Each pair of alternatives is a theorem, so once feasibility is known the kind of separation follows with no judgement left over. The one tolerance is the programme's own, in the engine's basis:

> dual linear programmes on the column-scaled, sign-flipped design S (lib/lp): COMPLETE when S'w = 0, sum w = 1, w >= 0 is infeasible (Gordan); otherwise QUASI-COMPLETE when S'w = 0, w >= 1 is infeasible (Stiemke), else none; infeasible means an artificial sum above 1e-7 after phase one

## A certificate for none

When the answer is none, the engine says why. The Professional tier's pay model on the training wells, RHOB, NPHI and RT with an intercept, reported `separation.type` none, and its certificate reads, in the engine's words: "weights w >= 1 with S'w = 0 (Stiemke)". Such weights exist, so no hyperplane separates the pay rows from the rest, and the fit went on to a finite answer.

## Why before any iteration

The common alternative is to iterate and call the data separated if the coefficients grow large, which leaves someone choosing how large is large. Deciding first, exactly, means a separated fit with no penalty is refused before it can print a number, and a fit with a penalty reports what kind of separation it is fitting through.

## Exercise

Open the panel on the convergence view, copy its table of the 210 training rows of the pay model, and paste it into the separation view. Set the features to RHOB, NPHI and RT, the target to PAY and l2 to 0. Run it and copy the separation type and the certificate the engine prints. Then run the default high-RT table with l2 at 1 and copy its separation type. Say in one sentence why the second fit reports a separation and still returns coefficients.
