# Printed figures and exact figures

{{panel:pr-envelope-calculator}}

{{panel:pr-contract-calculator}}

A source prints its figures to the precision its authors chose, and the printed figure is a rounding or a truncation of an exact one. The engine holds the exact figure. When the two are set side by side they rarely agree to the last printed digit, and an Expert has to know whether a difference is an error or just print. This lesson reads three sources that way.

## The Guidance's combined scores

The World Bank's evaluation Guidance (February 2025, read on 2026-09-26) works a combined evaluation in its Figures X to XII at a technical weight of 0.8 and prints every figure to two decimals. The engine's exact figures against the printed ones:

| company | B exact (engine) | B printed (source) | printed less exact | how it was printed |
| --- | --- | --- | --- | --- |
| D | 98.333333 | 98.34 | 0.006667 | rounded up |
| C | 88.333333 | 88.34 | 0.006667 | rounded up |
| B | 84.266670 | 84.26 | -0.006670 | truncated |
| A | 80.256410 | 80.25 | -0.006410 | truncated |

None of the printed combined scores is the exact figure. Some drop the third decimal and some round up, and Company C's technical figure is printed 68.33 in Figure X and 68.34 in Figure XII for the same quantity. The ranking, D, C, B, A, agrees with the engine's, and every printed figure is within 0.01 of the exact one. The conclusion stands; a printed figure is a label for an exact one. The same Guidance's Annex 3 prints Company A's combined score as 94.37, where the engine's figure is 94.375000: two decimals with the third dropped.

## A line the engine does not draw

Kiiver and Kodym (Journal of Public Procurement 15(3), Fall 2015, read on 2026-09-26) score three prices, 50, 75 and 100, in their Table 1. The engine's lowest-ratio scores are 100.000000, 66.666667 and 50.000000, and the source prints 100, 67 and 50. Their text also says that "under linear conditions" the middle bid would receive 75 points, which is a straight line drawn between the first bid's 100 and the last bid's 50. The engine's linear method gives the dearest bid 0.000000, the family their text describes, so the middle bid scores 50.000000 on it. The engine has no method that reproduces their 75, and the course does not claim one.

## Printed alike is not equal

Two figures that print alike at two decimals, or at six, need not be the same figure. The engine's own commercial weight shows it. Asked for a technical weight of 0.7, it computes the rest, one less 0.7, in binary floating point, and prints the shortest decimal of the double it holds, which is not the double 0.3. So this course quotes every capstone field at six decimals, as the panel prints it, and quotes a source figure exactly as the source prints it, labelled as the source's. Neither is ever keyed as equal to another figure merely because the two print alike.

## Exercise

Open the envelope calculator on the view "The combined score". Replace the bids with three of your own, each with the same technical percentage and a receipt time, and with evaluated costs of 50, 75 and 100, and set the technical weight to 0 so the price alone decides. Read the commercial scores under "lowest-ratio", then under "linear", and set them beside Kiiver and Kodym's printed figures. Then open the contract calculator on the view "Should-cost and the screening band", set the band's `high` to 1.069948, WS3's ratio as printed, and explain the flag WS3 now carries.
