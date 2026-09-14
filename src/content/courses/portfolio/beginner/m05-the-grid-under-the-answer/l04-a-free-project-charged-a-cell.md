# A free project charged a cell

A project with a capex of 0.0000 costs nothing, but the grid weighs every project at max(1, round(capex / cell)), so a free project still takes one cell. Three published cases show a free project worth 10.0000 million USD of risked EMV lost at a limit of 0.0000, lost at 100.0000 and kept at 101.0000.

{{panel:ec-capital-explorer}}

## The three cases

| case | limit | resolution | projects | engine set | EMV | exact optimum (golden) | gap (golden) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| freeProjectZeroLimit | 0.0000 | 1.000000 | free | none | 0.0000 | 10.0000 | -10.0000 |
| freeProjectTightLimit | 100.0000 | 1.000000 | free, A | A | 60.0000 | 70.0000 | -10.0000 |
| freeProjectSlack | 101.0000 | 1.000000 | free, A | free + A | 70.0000 | 70.0000 | 0.0000 |

The free project has capex 0.0000 and EMV 10.0000. A has capex 100.0000 and EMV 60.0000. Every limit is whole and at most 5000, so the grid is exact at one million USD per cell, and still the free project weighs one cell.

## Reading each case

At a limit of 0.0000 there are no cells at all. The free project needs one, so the engine funds nothing and reports 0.0000, though funding it would spend nothing and add 10.0000.

At 100.0000 there are exactly enough cells for A. A free project that truly cost nothing would ride along for 60.0000 plus 10.0000, which is 70.0000, and that is the golden optimum. On the grid, A and the free project need one cell more than the limit holds, so the engine funds A alone at 60.0000.

At 101.0000 the spare cell pays for the free project. The engine funds both at capex 100.0000, EMV 70.0000, and the gap closes to 0.0000. The extra million is never spent; it only buys the cell the grid charges.
## A property of the engine

This is finding D2, and EC5-0 left it as it was. The overshoot flag does not catch it, because the engine's set is inside the limit in money, and overLimit reads false throughout. It is a property of the engine as published.

## The mistake

The natural mistake is to model something already paid for, or a no-cost option such as a study funded from another budget, as a project with capex 0.0000, and expect it to be funded automatically whenever its EMV is positive. It is funded only when a spare cell remains. On a budget spent exactly to the limit, such as OKONO at 450.0000 where OK-1, OK-3 and OK-4 use all 450.0000, no spare cell is left for a free project.

The second mistake reads A at 60.0000 as proof that the free project was not worth funding.

## What it refuses

The engine does not treat capex 0.0000 as weightless and does not report the cell it charged. The reader has to notice a positive-EMV project with zero capex left out, and add its value by hand.

## Exercise

For each of the three cases, say how many cells the limit holds, what the free project weighs, and why the engine's set differs from or matches the golden optimum. Then explain why overLimit is false in all three.
