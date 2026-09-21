# The printed probit table

{{panel:cq-harm}}

For a long time analysts turned a probit into a probability by looking it up in a table. The Purple Book prints that lookup as its Table 5.1. This lesson checks the engine's probit relation against the printed table and reads the two cells where the printed figures sit on a rounding edge.

## What the table prints

Table 5.1 of the Purple Book prints the probit for a probability, to two decimals. The engine's golden holds ninety-seven of its cells, and the engine's inverse reproduces all ninety-seven to the printed two decimals. A selection:

| probability | printed probit | engine probit |
| --- | --- | --- |
| 0.01 | 2.67 | 2.673653 |
| 0.05 | 3.36 | 3.355147 |
| 0.1 | 3.72 | 3.718448 |
| 0.25 | 4.33 | 4.325510 |
| 0.5 | 5.00 | 5.000000 |
| 0.75 | 5.67 | 5.674490 |
| 0.9 | 6.28 | 6.281552 |
| 0.99 | 7.33 | 7.326347 |

Read the symmetry. The probit for 0.25 sits below five by the same amount that the probit for 0.75 sits above it, and 0.1 and 0.9 mirror each other the same way. The table is the normal distribution written in probit units.

## The two cells on a rounding edge

Two more cells sit on a rounding edge (golden). At probability 0.12 the table prints 3.82 where the value is 3.825013. At probability 0.88 it prints 6.18 where the value is 6.174987. Each value lies almost exactly halfway between two printed digits, so a rounding rule could send it either way, and the printed figures went the other way from ordinary rounding of the six decimal value. They are within 0.006 of the printed digits, and the golden keeps them apart from the ninety-seven that reproduce outright.

This is a fact about the published table and its rounding at those edges. It is not a fault the engine carries, and nothing in the engine is adjusted to match those two cells.

## Why a table still matters

A printed table is a second route that anyone can check by hand. When the Purple Book works its own carbon monoxide example it reads the probability off Table 5.1, and the lookup costs precision: the book prints a probability of 0.835 where the engine gives 0.833393, which is why the golden allows 0.002 absolute on that probability. A lookup carries the precision of the page it is read from.

Six decimals from the engine and two from the page are both honest statements of the same curve. A consequence note should quote the engine's figure and say it came from the engine's standard normal CDF, the Abramowitz and Stegun approximation the probability basis names, rather than from a lookup. A later module shows how close that approximation runs to the exact curve.

## Exercise

On the harm panel's probit view, use the inverse to find the probit for each probability in the selection above and confirm every engine column entry. Then enter 0.12 and 0.88 and record the engine's probits beside the printed 3.82 and 6.18. Write one sentence for each cell saying how far the printed figure sits from the engine's value and why the golden sets the cell apart.
