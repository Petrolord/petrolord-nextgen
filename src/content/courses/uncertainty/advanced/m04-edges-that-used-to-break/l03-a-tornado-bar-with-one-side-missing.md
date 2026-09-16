# A tornado bar with one side missing

The breakeven engine's tornado moves one variable at a time to its 10th and 90th percentile and solves the breakeven price at each end. When one end has no price inside the bracket, that side is null, the bar is marked unreachable, and it sorts first (finding B1, fixed 2026-09-15).

{{panel:ec-risk-explorer}}

## A tornado with both sides

ISIALA's tornado has room on both sides of its base breakeven of 71.6277 USD per bbl, and it sorts by swing:

| rank | variable | low side | high side | swing | unreachable |
| --- | --- | --- | --- | --- | --- |
| 1 | Total CAPEX | -7.0202 | 9.4067 | 16.4269 | false |
| 2 | Annual OPEX | -5.8578 | 8.8730 | 14.7308 | false |
| 3 | Prod. Efficiency | -3.7306 | 5.0561 | 8.7867 | false |

Both sides are measured from the base, so capex at its 90th percentile raises the breakeven price by 9.4067.

## Every bar open at one end

`mc_with_unreachable` sets capex so large that its base breakeven is 498.0372 USD per bbl, just under the 500 bracket top. At seed 5 over 120 iterations, 55 are excluded because they cannot break even below 500. Its tornado reports three open bars:

| variable | low side | high side | unreachable |
| --- | --- | --- | --- |
| Total CAPEX | -80.7218 | null | true |
| Annual OPEX | -6.7689 | null | true |
| Prod. Efficiency | -26.2125 | null | true |

A null high side is a finding in its own right. Raise capex or opex to its 90th percentile, or drop efficiency to its 10th, and no price below 500 USD per bbl breaks even.

## One bar open, two closed

`mc_one_bar_unreachable` opens the capex bar alone, at a base of 391.9076 with 14 of 120 iterations excluded:

| order | variable | low side | high side | unreachable |
| --- | --- | --- | --- | --- |
| 1 | Total CAPEX | -82.2213 | null | true |
| 2 | Prod. Efficiency | -20.6267 | 23.0534 | false |
| 3 | Annual OPEX | -6.7689 | 10.1534 | false |

The open bar comes first although no swing can be measured for it. A variable that pushes the price out of the bracket is the most important thing on the chart, so it ranks ahead of every bar that closes.

## What it used to do

History, before the repair: an end with no breakeven was drawn at 0 with a swing of zero, and a bar with a zero swing sorted last. The same case then read Prod. Efficiency -19.1316 and 21.3824, Annual OPEX -6.7689 and 10.1534, and Total CAPEX -53.8145 and 0.0000, in that order. The dangerous variable sat at the bottom of the chart behind a short bar, and the chart arrays never said that its high side was a failure to solve rather than a price.

## The insight says it in words

The engine writes the open bar into its insight: "Total CAPEX has no breakeven below 500 dollars a barrel at one end of its range, so that side of its bar is left open."

## What the tornado refuses

It moves one variable with the others at the beliefs' medians, so it says nothing about capex and opex both landing high. It cannot widen the 500 USD per bbl bracket, and it never says how far past the bracket an unreachable end would sit. The percentiles beside it describe only the iterations that broke even: on the one-bar case, 306.3526, 371.7418 and 446.0434.

## Exercise

For `mc_one_bar_unreachable`, state the base breakeven, the order of the three bars, which of them is unreachable and the two sides of each. Then say what the retired engine drew for an unreachable end and where it ranked that bar.
