# The safety factor from the inverse normal

{{panel:materials-stock-calculator}}

The safety factor k turns a cycle service level into a number of standard deviations. It is the inverse of the standard normal cumulative distribution at the stated level: the point on a standard normal curve with that probability below it. Multiply it by sigma and the result is the safety stock; add the mean demand over the protection period and the result is the reorder point.

## How the engine computes k

The engine states its numerics in its basis, verbatim:

> Phi^-1 by Wichura AS241; Phi through the regularised incomplete gamma (engines/hse/safetyStats.js); the fill-rate k by bisection to the last binary digit

Phi is the standard normal cumulative probability, and Phi^-1 its inverse. The engine takes the inverse from a published algorithm and the forward direction through a function it imports from the platform's shared statistics code. It keeps no table of its own. Distributions as a subject belong to the uncertainty course; this course uses the normal curve and names where its numbers come from.

## Five levels on one item

The choke bean set at five cycle service levels, with only the level changed and the reorder point held rounded up to a whole set:

| cycle service level | safety factor k | safety stock | reorder point | held as |
| --- | --- | --- | --- | --- |
| 0.8 | 0.841621 | 2.549671 | 10.882921 | 11.000000 |
| 0.9 | 1.281552 | 3.882429 | 12.215679 | 13.000000 |
| 0.95 | 1.644854 | 4.983044 | 13.316294 | 14.000000 |
| 0.975 | 1.959964 | 5.937663 | 14.270913 | 15.000000 |
| 0.99 | 2.326348 | 7.047614 | 15.380864 | 16.000000 |

Sigma is 3.029476 in every row, so the safety stock is k times that one figure. The mean demand of 8.333250 stays where it is.

## The cost of the last few points

The steps in the table are not even. Moving from 0.95 to 0.99, less than half the step in probability of moving from 0.8 to 0.9, adds more safety stock. Each extra point of cycle service near the top buys less protection per set of stock, because the tail of the normal curve thins out. That is the practical reason a stock policy writes a level per class of item and does not ask 0.99 of everything.

The engine does not choose the level, and it does not warn that a level is high. It computes what the stated level needs, prints k exactly, and leaves the policy to the person who stated it.

## The reason names the rule

Each result carries a reason that shows the step from level to k. At 0.95 on the choke bean set, verbatim:

> a cycle service level of 0.95 gives k = Phi^-1(0.95) = 1.644854; safety stock 4.983044 over a demand of 8.33325 with sigma 3.029476 gives the reorder point s 13.316294, held as 14 (up to a multiple of 1)

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, cycle service level". Step the control "Service level (stated)" through 0.8, 0.9, 0.95, 0.975 and 0.99, and for each level copy k, the safety stock and the reorder point into your own table. Check each safety stock by multiplying k by sigma.

Then plot, by hand or in a spreadsheet, the safety stock against the level, and mark where each further step starts to cost more stock than the step before.
