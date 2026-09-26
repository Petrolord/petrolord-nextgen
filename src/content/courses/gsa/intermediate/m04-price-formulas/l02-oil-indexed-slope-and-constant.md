# Oil-indexed slope and constant

{{panel:gsa-ledger-calculator}}

An oil-indexed contract prices gas on a straight line: a constant plus a slope times an oil index. The Energy Charter Secretariat's Putting a Price on Energy: International Pricing Mechanisms for Oil and Gas (2007, read 2026-09-26) writes it P = A x JCC + B in section 4.5.3.3, with JCC the Japan crude cocktail. This lesson reads the line and what its two numbers do.

## The formula in the engine

The engine takes `{ type: "oil-indexed", index, slope, constant }`, with an optional floor, ceiling and S-curve, and prices P = constant + slope x X, X being the index averaged as the contract states. The index is named, and the name must be one the series carries:

> formula.index must be the name of an index in months[].values (oil); got "brent"

A formula type outside the five the engine computes is refused:

> formula.type must be one of "fixed", "escalated", "oil-indexed", "hub-indexed", "basket"; got "jcc-linked"

## The published line

The golden case uses the Energy Charter Secretariat's Figure 51 parameters with no band: slope 0.1485, constant 0.8, one month of the index, no lag.

| month | JCC | price |
| --- | --- | --- |
| 2026-01 | 10.000000 | 2.285000 |
| 2026-02 | 15.000000 | 3.027500 |
| 2026-03 | 22.500000 | 4.141250 |
| 2026-04 | 30.000000 | 5.255000 |
| 2026-05 | 40.000000 | 6.740000 |

Equal steps in the index give equal steps in the price, each the slope times the step, and the constant sets the price at zero oil. A slope is US$ per MMBtu for each US$ per barrel, and how it compares with the heat content of a barrel is the Expert tier's question.

## The export feed formula

The export feed agreement (synthetic) prices 0.5 + 0.12 x the oil index, averaged over 6 months ending 1 month before the priced month. For January 2027 the window is July to December 2026 and the average is 76.925000, so the price is 9.731000. The fixture also states an S-curve at 55 and 90 US$ per barrel, which bends the line outside those points; the Expert tier works it. Every export month this tier prints sits between the two, on the straight line.

A formula can also give a price below zero if its constant is negative enough and the index low enough. The engine refuses the whole series, naming the month:

> formula must give a price at or above 0 in every month; got -13.3 for 2025-08

## What the slope carries

On an oil-indexed contract, the seller's gas revenue moves with oil at the slope. On the export ledger, 2029's take-or-pay price of 9.808450 and 2032's of 7.756900 come from the same formula on different oil.

## Exercise

Work in the course's own ledger calculator, on the view "Contract prices month by month", which starts with the export feed price.

1. Read the 2027-01 row: the window, the oil average and the price. Check 0.5 + 0.12 x 76.925000 by hand.
2. Replace the inputs with the golden line above: five months from 2026-01 with a `jcc` index of 10, 15, 22.5, 30 and 40, `formula` oil-indexed on `jcc` with `slope` 0.1485 and `constant` 0.8, `averagingMonths` 1, `lagMonths` 0, `resetMonths` 1, `rounding` "none". Check the table.
3. Change `index` to "brent" and read the refusal.
4. Make the constant negative enough that the first month prices below zero, and read the refusal.
