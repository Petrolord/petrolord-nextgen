# Falling back

The R factor is a ratio of cumulatives, and it is not monotone. Late in life revenue declines while opex keeps accruing, the ratio can fall back below a threshold it had already passed, and the contractor's split steps back UP.

{{panel:ec-instrument-explorer}}

## The published case

`rfactor_falls_back` is the tiered teaching regime's tranches, 60 percent at R 1, 40 percent at R 1.6 and 30 percent at R 2.5, on the same 10000 bopd project as the crossing case but with capex 320 and opex 25:

| year | rFactor | profitOil | implied split |
| --- | --- | --- | --- |
| 5 | 2.501684 | 130.4111 | 0.300000 |
| 11 | 2.972625 | 47.1735 | 0.300000 |
| 12 | 2.964221 | 38.5127 | 0.300000 |
| 20 | 2.646751 | 4.6326 | 0.300000 |
| 21 | 2.596061 | 4.0767 | 0.300000 |
| 22 | 2.545295 | 3.5875 | 0.300000 |
| 23 | 2.494796 | 3.1570 | 0.400000 |
| 24 | 2.444831 | 2.7782 | 0.400000 |
| 25 | 2.395606 | 2.4448 | 0.400000 |

The ratio peaks at 2.972625 in year 11 and falls in every year afterwards. In year 22 it is 2.545295 and the split is 0.300000. In year 23 it is 2.494796, which has not reached 2.5, so the walk stops at the 1.6 tier and the split becomes 0.400000. It stays there for years 24 and 25. The contractor's share of profit oil was given up in year 5 and handed back in year 23.

## Why the ratio turns

Nothing is broken. Cumulative revenue grows by a smaller amount every year as production declines, while cumulative cost grows by a fixed component plus a shrinking variable one and never stops growing. Eventually the denominator gains faster than the numerator and the ratio falls. Profit oil in year 23 is 3.1570 million USD, so the step back up moves very little money on this case. That is an accident of when the reversal happened and says nothing about the reversal itself.

The same tier list on the crossing case never falls back. There the ratio peaks at 3.109087 in year 12 and declines to 2.654466 by year 25, which is still above 2.5, so the split holds at 0.300000 for the whole run. Two cases, the same tranches, and the only differences are capex 350 against 320 and opex 20 against 25.

## The mistake

Real R factor contracts usually ratchet: a split once given up is never returned. This engine does not ratchet, and nothing in it says so. Two errors follow. The first is checking the split at first oil and at the peak and assuming everything between and after is monotone. On this case that check reads 0.600000 and 0.300000 and misses years 23 to 25 entirely. The second is seeing the split rise and concluding the model has a bug. It has not. The formula is faithfully implemented and the contract shape it produces is simply not the usual one.

Lifetime totals for the case are contractor net cash flow 225.7346, government cash flow 1133.8250, total revenue 2333.7313, total tax 128.6822, NPV 159.5115 at 10 percent and closing unrecovered pool 74.5238.

## What it refuses

There is no ratchet flag, no memory of the highest tranche reached, and no option to make the split one way. The four instruments cannot express one. There is no warning either: the ledger prints the same columns in year 23 as in year 22, and the only evidence is the ratio of the contractor's profit share to profit oil.

## Exercise

Name the year the R factor peaks, its value there, and the year the split steps back up. Then explain why the ratio falls after year 11 in terms of the two running totals, and say what a ratcheted contract would have paid in years 23 to 25.
