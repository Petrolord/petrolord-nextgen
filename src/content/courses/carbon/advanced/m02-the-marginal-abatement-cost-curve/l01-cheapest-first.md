# Cheapest first

A marginal abatement cost curve puts a programme of measures in one picture. `carbonAbatement.abatementCurve` takes the costed measures and ranks them cheapest first (SECTION 20). This module reads the curve the engine builds from the six invented AGBOR measures, costed at the invented discount rate of 0.1, with every figure in US dollars.

{{panel:carbon-abatement-explorer}}

## The ranking

| order | measure | cost per tonne USD | tonnes a year | pays for itself |
| --- | --- | --- | --- | --- |
| 1 | Tune the fired heaters | -167.4364 | 760.000 | true |
| 2 | Repair failed steam traps | -156.4390 | 1150.000 | true |
| 3 | Heat integration project | -14.2492 | 3400.000 | true |
| 4 | Vapour recovery on the storage tanks | 35.4193 | 1850.000 | false |
| 5 | Solar for purchased power | 45.8573 | 2100.000 | false |
| 6 | Flare gas recovery | 78.1002 | 6200.000 | false |

The ranking key is the cost per tonne, and cheapest means the lowest figure, so the most negative cost ranks first. Tune the fired heaters at -167.4364 USD a tonne is order 1. Flare gas recovery at 78.1002 USD a tonne is order 6.

## The ranking is by cost alone

The order does not follow the tonnes. Flare gas recovery abates 6200.000 t a year, and it ranks sixth. Tune the fired heaters abates 760.000 t a year, and it ranks first. The curve answers one question about each measure: what a tonne from it costs. How many tonnes it gives is the width of its step, which is the next lesson.

The order also does not follow the capital. The Heat integration project carries 2750000 USD of capital and ranks third, among the three that pay for themselves.

## The ranking is not the order of entry

SECTION 18 lists the measures in the order they were entered: Flare gas recovery fourth, Solar for purchased power fifth, Vapour recovery on the storage tanks sixth. The curve reorders them by cost: Vapour recovery on the storage tanks fourth, Solar for purchased power fifth and Flare gas recovery sixth. The entry order carries no meaning on the curve. Only the cost per tonne sets the order.

## What sets each cost

Every cost in the ranking is the levelised cost from module one: the capital annualised by its capital recovery factor at 0.1, plus the annual cost, less the annual savings, over the tonnes. A measure's place on the curve rests on every one of those inputs. The blank-rate refusal names that effect in its own words: a blank read as 0 "would annualise straight-line and move the measure down the curve."

## How the rank is checked

SECTION 26 names what recomputes the curve. The oracle for carbonAbatement builds the curve "by explicit rank", and its goldens are asserted by the engine test suites. The same oracle computes the cost per tonne levelised from a year-by-year present value ledger, where the engine uses a capital recovery factor. Of the curve's totals, SECTION 26 prints that it returns totalAbatementTonnes and weightedAverageCostPerTonne, and that it sums the net annual costs only inside the weighted average and returns no netAnnualCostOfAll. Two outputs of the curve are listed in SECTION 26 as recomputed by neither oracle: the residual to target and paysForItselfTonnes. Lesson four reads the second of those.

## Exercise

Read the order, the cost per tonne and the tonnes a year of Tune the fired heaters and of Flare gas recovery. Say what the two rows, read together, show about which figure sets a measure's place on the curve and which figure the curve does not rank by.
