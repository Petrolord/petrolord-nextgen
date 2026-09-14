# Crossing a tranche

A tranche crossing is a discontinuity in the middle of a smooth ledger. The R factor never takes the threshold value, and the split changes in the year the ratio steps over it.

{{panel:ec-instrument-explorer}}

## The published crossing

`rfactor_tranche_crossing` runs the "Nigeria - PIA (2021)" tranches, 60 percent at R 1, 40 percent at R 1.6 and 30 percent at R 2.5, on a 10000 bopd project with capex 350 and opex 20 plus 1 USD per boe, at 80 USD per bbl:

| year | rFactor | profitOil | implied split |
| --- | --- | --- | --- |
| 1 | 0.781480 | 52.5600 | 0.600000 |
| 2 | 1.383252 | 46.2528 | 0.600000 |
| 3 | 1.846809 | 179.0750 | 0.400000 |
| 4 | 2.202912 | 156.6035 | 0.400000 |
| 5 | 2.474747 | 135.4111 | 0.400000 |
| 6 | 2.680048 | 116.7617 | 0.300000 |
| 7 | 2.832537 | 100.3503 | 0.300000 |

Two crossings, both invisible in the R factor column unless the thresholds are in hand. Between year 2 at 1.383252 and year 3 at 1.846809 the ratio steps over 1.6 without ever taking a value near it, and the split drops from 0.600000 to 0.400000. Between year 5 at 2.474747 and year 6 at 2.680048 it steps over 2.5, and the split drops to 0.300000. Over the life the case returns contractor net cash flow of 279.5803 million USD, government take of 1174.9793, tax of 136.4182 and an NPV of 168.2190 at 10 percent, with payback in year 2 and payout in year 2.

## A cut that is not a cut

Year 3 is the row to sit with. The contractor's share of profit oil falls from 0.600000 to 0.400000 and the contractor is better off, because profit oil in that year is 179.0750 against 46.2528 the year before. The cost recovery pool cleared, profit oil was released, and the tranche crossing landed in the same year. A split rate and a share of money are different quantities, and they can move in opposite directions in one row.

## The mistake

The common error is to expect the tranche to change when the R factor crosses 1.0, because 1.0 is where payout is declared and R 1 is the first tier's threshold. The R factor here crosses 1.0 between year 1 at 0.781480 and year 2 at 1.383252, and nothing changes: the first tier's split of 0.600000 was already in force before any threshold was reached, so reaching the first threshold changes nothing at all. The first real change is at year 3, and it is the 1.6 threshold that causes it.

The second error is to hunt for a row where the R factor equals a threshold. There is none. The ratio moves in jumps the size of the year's revenue and cost, and 1.6 and 2.5 both sit in gaps between printed values. A crossing is identified by the pair of rows that straddle it, never by a row that lands on it.

## What it refuses

Nothing is interpolated and nothing is smoothed. There is no blending across a crossing, no half-year proration, and no lag: the split is chosen from the same year's own R factor, which already includes that year's revenue and cost. There is no notification either. The ledger prints no marker on a crossing year, so a reader who does not know the thresholds cannot see one happen.

## Exercise

Name the two years the split changes and the thresholds that caused each. Then say why the contractor's profit share is larger in year 3 than in year 2 despite a lower split, using the profit oil figures.
