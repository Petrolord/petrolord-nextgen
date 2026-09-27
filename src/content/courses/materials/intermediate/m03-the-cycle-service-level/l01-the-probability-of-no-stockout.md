# The probability of no stockout

{{panel:materials-stock-calculator}}

A reorder point needs a target, and the target needs a measure: in this course every service level names what it measures. This module takes the first measure, the cycle service level.

## One chance a cycle

A replenishment cycle runs from one order to the next. Stock can only run out in one window of it: after the reorder point is reached and before the new order lands. The cycle service level is the probability that no stockout happens in a cycle. At a cycle service level of 0.95 the shelf runs dry in about five cycles out of a hundred, on average, and meets every demand in the rest.

The measure counts cycles that ran short, so a cycle short by one unit and one short by twenty count the same. The next module counts the units.

## The target is met on the normal curve

For normal demand over the protection period, the reorder point meets a cycle service level p when it sits k standard deviations above the mean, with k chosen so that the normal curve puts a probability p below that point. On the choke bean set:

| stated cycle service level | reorder point | held as | achieved cycle service at the held level |
| --- | --- | --- | --- |
| 0.8 | 10.882921 | 11.000000 | 0.810643 |
| 0.95 | 13.316294 | 14.000000 | 0.969295 |
| 0.99 | 15.380864 | 16.000000 | 0.994309 |

Each held level is rounded up to a whole set, so each achieved service sits a little above its target. The engine prints the achieved figure beside the target every time.

## Levels the engine refuses

A cycle service level is a probability, strictly between 0 and 1. A level of 1 would promise no stockout ever, and normal demand has no ceiling to cover, so no finite reorder point meets it. A level of 0 promises nothing. Both are refused by name:

> serviceLevel must be a number strictly between 0 and 1; got 1

> serviceLevel must be a number strictly between 0 and 1; got 0

The measure is a stated input too. Leave it out and the engine names the two it knows:

> serviceMeasure must be 'cycle-service' (probability of no stockout in a replenishment cycle) or 'fill-rate' (fraction of demand met from stock)

## Choosing the target

The target is policy. A class V spare and a class D consumable can carry different cycle service levels, and the criticality class from Associate is one way to write that choice down. The engine holds no level of its own, and a figure is quoted with the level and measure it answers.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, cycle service level". Confirm the middle row of the table. Set the control "Service level (stated)" to 0.8, then to 0.99, and confirm the other two rows, reading the achieved cycle service each time.

Then set the cycle service level to 1 and read the refusal, and to 0 and read it again. Restore 0.95, set the control "Service measure (stated)" to not stated, and read the third refusal.
