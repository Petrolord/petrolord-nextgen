# Boundaries, rule by rule

{{panel:materials-spares-calculator}}

Every rule in the engine has an edge, and the edges are not all alike. Some are inclusive: a figure exactly on the line is in. Some are strict: a figure must pass the line to count. None is global. This lesson lays out every edge the course teaches in one table, with the answer the engine gives at it and one step past it.

## The table

| rule | at the boundary | one past it |
| --- | --- | --- |
| criticality class minimum | score equal to the minimum: in the class | 69.95 below 70: the next class |
| the 12-digit key | a sum a hair below 70 reads as 70: V | none |
| the override | the maximum forces the top class | one below does not |
| ABC at-or-below | cumulative exactly 80: A; exactly 95: B | above: the next class |
| ABC include-crossing | share before exactly 80: B; exactly 95: C | below: the higher class |
| rounding to the nearest | the quotient exactly half: up | none |
| rounding to nothing | refused | none |
| a discount tie | equal totals: the smaller quantity | none |
| the safety factor floor | k below the floor: held at the floor | no floor: k negative |
| Poisson cycle service | the cumulative equal to the target: met | 0.7358 just above: the next level |
| the Poisson mean cap | 500 accepted | 502.5 refused; the printed 166.666666 accepted |
| an insurance tie | equal totals: fewer spares | none |
| the insurance search | the optimum at the search limit: flagged | none |
| a stockout | demand equal to the stock: met | 0.5 short: every draw |
| a slow-moving band | 12 months: slow | 11.99: active |
| excess cover | 24 months: inside | 25: one unit excess |

## Reading the table

The Associate rules come first. A class minimum and a band minimum are met at or above; excess cover is counted only strictly above its limit, so 24 months of cover is inside and 25 is one unit over. Rounding to the nearest takes a half upward, and a rounding that orders nothing is refused before any figure is computed.

The Professional rules follow. A Poisson cycle-service target is met when the cumulative probability equals it, and a safety factor that falls below a stated floor is held at the floor.

The Expert rules close the table. A lead-time demand equal to the reorder point is met, and a demand half a unit above it is a stockout in every draw. An insurance tie keeps fewer spares, and the search flags an optimum on its own limit.

## Why the edges differ

No single principle sorts the edges. A class minimum, a band's starting month and a cycle service target are met at or above. An ABC share exactly on its cut-off under at-or-below stays in the higher class, and a Poisson fill-rate level is met when its expected units short are at or below what the target allows. Excess cover and a stockout count only above the line. The engine prints those words, at or above, at or below, or above, in its reasons.

## The caps are boundaries too

A cap is a boundary between accepted and refused. The Poisson mean may reach 500 and no more. At a demand rate of 5 a period, a lead time of 100 gives a mean of exactly 500, and the engine returns a level of 500. A lead time of 100.5 is refused, verbatim:

> leadTime must be at most 100 so that the mean demand demandRate x leadTime is at most 500; above that the normal safetyStock serves; got 100.5

Above that mean, the normal safety stock of the Professional tier serves.

## How to use the table

When a figure sits on an edge, find its rule here and read its side. Each edge is the engine's stated choice, recorded where it acts, and none moves a graded figure. A policy that wants another edge states it and checks the result by hand.

## Exercise

Open the spares calculator on the view "A slow-moving spare on Poisson demand" and start from "The PSV kits on the Ekene register". Set "Demand rate a period (stated)" to 5, "Lead time, periods (stated)" to 100 and "Service level (stated)" to 0.5, keeping the cycle service measure. Predict the Poisson mean and the level, then read them. Set the lead time to 100.5 and compare the refusal with the quotation above. Then choose two rows of the table from the other tiers and name the view and start case that would show each.
