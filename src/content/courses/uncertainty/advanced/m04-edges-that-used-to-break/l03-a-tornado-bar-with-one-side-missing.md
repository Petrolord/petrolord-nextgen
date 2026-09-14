# A tornado bar with one side missing

The breakeven engine's tornado moves one variable at a time to its 10th and 90th percentile and solves the breakeven price at each end. When one end has no price inside the bracket, the engine as published draws that side at zero and gives the bar a swing of zero (finding B1), and it still does.

{{panel:ec-risk-explorer}}

## A tornado with both sides

ISIALA's tornado has room on both sides of its base breakeven of 71.6277 USD per bbl, and it sorts by swing:

| rank | variable | low side | high side | swing |
| --- | --- | --- | --- | --- |
| 1 | Total CAPEX | -7.0202 | 9.4067 | 16.4269 |
| 2 | Annual OPEX | -5.8578 | 8.8730 | 14.7308 |
| 3 | Prod. Efficiency | -3.7306 | 5.0561 | 8.7867 |

Both sides are measured from the base, so capex at its 90th percentile raises the breakeven price by 9.4067.

## The published case with a side missing

`mc_with_unreachable` sets capex so large that its base breakeven is 498.0372 USD per bbl, just under the 500 bracket top. At seed 5 over 120 iterations, 55 are excluded because they cannot break even below 500. Its tornado:

| variable | low side | high side |
| --- | --- | --- |
| Total CAPEX | -80.7218 | 0.0000 |
| Annual OPEX | -6.7689 | 0.0000 |
| Prod. Efficiency | -26.2125 | 0.0000 |

Every high side is 0.0000, and none of these variables is harmless on its high side. Raise capex or opex to its 90th percentile, or drop efficiency to its 10th, and the breakeven price leaves the bracket. The solver returns null, and the chart data writes that null as zero.

## Why the order means nothing

A bar with a null side gets a swing of zero. All three bars here have one, so all three swings are zero and the sort has nothing to sort on: the bars come back in input order, capex, opex, efficiency. Efficiency's low side of -26.2125 is far larger than opex's -6.7689 and it still ranks below it. In a tornado where the other bars had two sides, the variable that pushed the price out of the bracket would rank last.

## Where the answer is kept

The engine does keep the information. Each entry in its sensitivity data holds the raw `low` and `high` prices, and a side that could not break even is null there. Only the tornado's chart arrays turn null into 0. Read the raw pair before reading the bar.

## What the tornado refuses

It moves one variable with the others held at their medians, so it says nothing about capex and opex both landing high. It cannot widen the 500 USD per bbl bracket, and it does not say how far past the bracket a price would sit.

## The mistake

The careful mistake is reading a high side of 0.0000 as a variable that cannot raise the breakeven. On this case a zero high side marks the most dangerous direction there is, a price no solve inside the bracket reaches. The exclusions shape the percentiles beside it too: the 10th percentile of breakeven price 397.3404, the median 449.5729 and the 90th percentile of breakeven price 486.6757 describe only the iterations that broke even.

## Exercise

For `mc_with_unreachable`, state the base breakeven, the three low sides, the three high sides and the order the bars come back in. Explain what a high side of 0.0000 means there and where in the engine's output the real answer is recorded.
