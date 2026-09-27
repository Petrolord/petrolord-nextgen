# Building the cumulative from increments

{{panel:prms-reserves-calculator}}

The other direction is addition. An estimate stated as increments, first, second and third, builds the cumulative categories by running sums: 1P is P1, 2P is P1 plus P2, and 3P is P1 plus P2 plus P3. The engine takes the incremental form under the method "incremental" and returns both forms, exactly as it does for the cumulative method.

## A worked set

The golden input cat-faq33-incremental states a set of Reserves as increments of 5, 2 and 3 MMbbl. The figures follow the example in answer 3.3 of the PRMS Frequently Asked Questions (November 2022, answers dated October 2022; copyright SPE), which the course cites for its numbers only. The engine returns:

| method | stated | cumulative (engine) | incremental (engine) |
| --- | --- | --- | --- |
| incremental | first 5.000000, second 2.000000, third 3.000000 | 1P 5.000000, 2P 7.000000, 3P 10.000000 | Proved (P1) 5.000000, Probable (P2) 2.000000, Possible (P3) 3.000000 |
| cumulative | low 8.890000, best 16.650000, high 24.990000 | 1P 8.890000, 2P 16.650000, 3P 24.990000 | Proved (P1) 8.890000, Probable (P2) 7.760000, Possible (P3) 8.340000 |

The two rows show the two methods side by side. Whichever form goes in, both come out, and they rebuild each other exactly.

## Contingent Resources both ways

The Ekene North estimates are stated both ways in the golden file, and the engine returns the same categories from each:

| golden input | 1C | 2C | 3C | C1 | C2 | C3 |
| --- | --- | --- | --- | --- | --- | --- |
| cat-contingent-incremental | 3.000000 | 4.500000 | 6.500000 | 3.000000 | 1.500000 | 2.000000 |
| cat-contingent-cumulative | 3.000000 | 4.500000 | 6.500000 | 3.000000 | 1.500000 | 2.000000 |

## The forms do not mix

A set of estimates is one form or the other. Each method names its own three keys, and a key from the other form is refused, verbatim:

> estimates.second must be left out for the cumulative method (state low, best and high); got 1

> estimates.low must be left out for the incremental method (state first, second and third); got 1

The method itself has no default. Left unstated, it is refused:

> method must be one of "cumulative", "incremental"; got nothing

Why so strict? A box holding both a best estimate and a second increment has two answers for the 2P, and they may disagree. The engine will not pick one. The refusal sends the question back to whoever stated the set.

## Order comes for free

A cumulative set must be ordered low, best, high, and an out-of-order set is refused. An incremental set cannot be out of order, because each running sum adds a slice that is zero or more. That is one reason to state increments when a set is being built up from separate pieces of work, such as a proved area and a probable extension mapped by different teams.

## Exercise

Work in the reserves calculator, in the view "Incremental and cumulative categories".

1. The view opens on the start "Incremental example (FAQ 3.3)", the first in its selector. Read both tables and check each cumulative figure as a running sum.
2. Set "Method (stated)" to cumulative. The control rewrites the estimates for the new method; fill "low estimate (stated)", "best estimate (stated)" and "high estimate (stated)" with the three cumulative figures from step 1 and confirm the increments come back.
3. In the box, add a `"second": 1` beside the three cumulative estimates and read the refusal.
4. Set "Method (stated)" to not stated and read the refusal.
