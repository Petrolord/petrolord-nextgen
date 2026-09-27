# A zero increment

{{panel:prms-reserves-calculator}}

An increment can be zero. A set of Reserves may have nothing in Proved (P1) because the low case fails, or nothing in Possible (P3) because the high case adds nothing to the best. The engine accepts a zero increment and builds the cumulative categories from it. It refuses a negative one, because a negative slice would put a smaller figure above a larger one.

## The golden zero

The golden input cat-zero-increment states Reserves incrementally as first 0, second 7 and third 0 MMbbl. The engine returns:

| cumulative (engine) | incremental (engine) |
| --- | --- |
| 1P 0.000000, 2P 7.000000, 3P 7.000000 | Proved (P1) 0.000000, Probable (P2) 7.000000, Possible (P3) 0.000000 |

The engine's incremental line, verbatim:

> incremental: Proved (P1) 0, Probable (P2) 7, Possible (P3) 0 MMbbl; 1P = P1, 2P = P1 + P2, 3P = P1 + P2 + P3

A 1P of 0.000000 is a real answer. It says the estimator has no quantity they are confident enough to call proved. A 3P equal to the 2P says the high case adds nothing.

## Zero against negative

A negative increment is refused, verbatim:

> estimates.second must be a finite number at or above 0; got -1

The difference matters. Zero is a statement about the evidence: nothing at this level of confidence. A negative slice is arithmetic that cannot describe a range of outcomes, since it would make the 2P smaller than the 1P. The engine lets the first through and stops the second at the input.

## Where a zero 1P comes from

This set is not invented for the lesson. Module four meets the same shape in the economic limit: when the low forecast fails the economic test and the best passes, the engine sets 1P to 0 and keeps the 2P and 3P, following PRMS 3.1.2.8 and answer 3.3 of the PRMS FAQs. The FAQ figures give a 1P of 0.000000 and a 2P of 7000000.000000 barrels. The zero increment you meet here is the category form of that result.

## No increments at all

Prospective Resources carry no incremental terms (PRMS 2.2.2.4). Their categories are 1U, 2U and 3U, and the engine prints no increments for them. Stating the incremental method is refused, verbatim:

> method must be "cumulative" for Prospective Resources (PRMS 2.2.2.4 defines no incremental terms for them); got "incremental"

## Equal estimates

When the low, best and high estimates are all equal, one value may describe the result, and the engine says so in a line of its own. Every increment above the first is then zero.

## Exercise

Work in the reserves calculator, in the view "Incremental and cumulative categories".

1. Start from "A zero increment". Read both tables and the incremental line.
2. Set "second increment (stated)" to -1 and read the refusal. Set it back to 7.
3. Set "first increment (stated)" to 5 and read the cumulative categories again. Compare them with the FAQ 3.3 figures, the first start in the selector.
4. In the box, change the class to `"prospective"` with the incremental estimates in place, and read the refusal.
