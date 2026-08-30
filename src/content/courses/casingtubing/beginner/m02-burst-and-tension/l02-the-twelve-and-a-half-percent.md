# The twelve and a half percent

The rating is computed on a wall the mill is allowed to miss by.

{{panel:ct-rating-explorer}}

## The rule

API permits the wall of a seamless casing joint to run up to 12.5 percent under the nominal wall at any point. The pipe is still in specification.

So a rating computed on the nominal wall would be a rating no individual joint is guaranteed to meet. The published internal yield pressure is computed on the MINIMUM permitted wall instead:

    P = 0.875 x 2 x Yp x t / D

with t still the nominal wall and 0.875 doing the work of the tolerance.

## What that costs

Exactly 12.5 percent of the Barlow value, on every row, at every grade. It is a single multiplicative constant and it never varies.

The 9-5/8 inch 47 lb/ft joint at L-80 from the last lesson: Barlow gave 54097875.183376625 Pa, and the rating is 47335640.78545454 Pa.

## The same joint across the grades

| grade | burst (Pa) |
|---|---|
| K-55 | 32543253.04 |
| L-80 | 47335640.78545454 |
| P-110 | 65086506.08 |

Divide any of those by the yield strength of its grade and the answer is the same every time: 0.875 times twice the wall over the diameter, which for this row is 0.08581818181818182.

## What it is NOT

It is not a safety factor. It is a manufacturing tolerance, and the design factor applied on top of it in the next tier is a separate thing entirely.

Confusing the two is how a string ends up with 12.5 percent of margin counted twice, and the pipe does not know it was counted at all.

## The one place it does not apply

Collapse. The API collapse formulas are fitted to test data on real pipe that already carried whatever wall variation the test population had, so the tolerance is inside the fit rather than applied on top of it. There is no 0.875 anywhere in the collapse calculation.

## Exercise

The panel shows a burst of 75152851.30000001 Pa for the 9-5/8 inch 53.5 lb/ft joint at P-110.

Work backwards to the nominal-wall Barlow value, and then to the wall thickness. Check your wall against the catalog row.
