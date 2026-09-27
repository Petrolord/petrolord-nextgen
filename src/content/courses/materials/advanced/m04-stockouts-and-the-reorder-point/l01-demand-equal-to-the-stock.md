# Demand equal to the stock

{{panel:materials-spares-calculator}}

A stockout needs a definition before it can be counted. The engine states one: a stockout is a lead-time demand above the reorder point. Demand exactly equal to the stock on hand is met. This lesson tests that edge with two constant cases, where no draw varies and the answer is certain.

## A case with nothing uncertain

A demand of 2 a day, held constant, over a lead time of 10 days, held constant, is a lead-time demand of 20 in every draw. The case runs 50 draws on seed 1; with both inputs constant the seed changes nothing, and every draw is the same.

With a reorder point of 20, the stock on hand when the order is placed exactly covers the demand before the order lands. The engine counts no stockout, verbatim:

> 0 of 50 draws have a lead-time demand above the reorder point 20: a stockout probability of 0 a cycle

Lower the reorder point to 19.5 and every draw runs short by 0.500000, verbatim:

> 50 of 50 draws have a lead-time demand above the reorder point 19.5: a stockout probability of 1 a cycle

| reorder point | draws with a stockout | stockout probability a cycle | expected units short a cycle |
| --- | --- | --- | --- |
| 20 | 0 of 50 | 0.000000 | 0.000000 |
| 19.5 | 50 of 50 | 1.000000 | 0.500000 |

## A stated reading, with its alternative

Counting equality as met is the engine's stated reading: a lead-time demand equal to the reorder point is met. The alternative counts equality as a stockout. With constant inputs the difference is the whole answer, 0 against 1. With sampled inputs it matters much less, because a drawn lead-time demand almost never lands exactly on a stated reorder point. No graded figure in this course moves under either reading; the course teaches the reading so a learner knows which edge a count uses.

## The same edge elsewhere

The Associate tier met a slow-moving band reached at or above its minimum and a cover limit exceeded only strictly above it. The Professional tier met a Poisson target met at or above it. Each rule in the engine has its own edge, some inclusive and some strict, and the Readings module of this tier gathers them in one table.

## A reorder point below zero

A reorder point is stock on hand, and stock cannot be negative. The engine refuses one, verbatim:

> reorderPoint must be a finite number at or above 0; got -1

A reorder point of 0 is accepted: every draw with any demand at all is then a stockout.

## Exercise

Open the spares calculator on the view "Lead-time risk by Monte Carlo (ungraded)" and start from "Demand equal to the stock". Read the reason and check it against the first quotation above. Read the sampling line: both inputs are constants, and it says so. Set "Reorder point (stated)" to 19.5, predict the stockout probability and the expected units short, and compare the reason with the second quotation. Set it to -1 and read the refusal. Restore 20.
