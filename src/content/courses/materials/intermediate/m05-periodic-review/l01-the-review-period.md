# The review period

{{panel:materials-stock-calculator}}

Continuous review assumes the stock is watched all the time. Many stores count stock on a timetable instead, once a week or once a month, and order after each count. This module takes that policy, periodic review.

## Counting on a timetable

Under periodic review the stock is counted every R periods, and each count places an order that brings the stock up to a stated level, the order-up-to level S. The order size changes from review to review: it is whatever S less the stock on hand comes to at the count. There is no fixed order quantity, and there is no reorder point.

The review period is a stated input in the same period as every other input. A review period of 0 is continuous review; any value above 0 makes the policy periodic.

## Why the protection period grows

Under continuous review, the stock at the reorder point must last one lead time. Under periodic review, the next order cannot be placed until the next count, R periods on, and it then takes L periods to land. So the stock raised to S at one count must cover demand for R plus L periods.

The protection period becomes R plus L, and every other part of the rule is unchanged. The engine's basis says it in one line, verbatim, citing lecture 12 of Caplice, MIT ESD.260J (Fall 2006, MIT OpenCourseWare, CC BY-NC-SA 4.0):

    Caplice, MIT ESD.260J (2006) lecture 11 (s = xL + k sigmaL; P1 = Phi(k); P2 = 1 - sigmaL G(k) / Q) and lecture 12 ((R, S): L becomes R + L)

## The choke bean set, counted monthly

The choke bean set with its stated inputs and a review period of 1 month:

| figure | continuous review | reviewed every month |
| --- | --- | --- |
| protection period, months | 2.5 | 3.500000 |
| demand over it | 8.333250 | 11.666550 |
| sigma | 3.029476 | 3.426036 |

A longer protection period raises both the mean demand to cover and its spread. Recall from the sigma lesson that the lead-time spread enters on the lead time only, so the extra month adds demand spread and no lead-time spread.

## Why choose periodic review

A monthly count costs less effort than watching every bin, and items reviewed on the same day can share one purchase order. The price is a longer protection period and more stock for the same stated service. Which policy a store runs is its stated choice.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, cycle service level". Read the Policy tile and the protection period. Set the control "Review period, periods (stated, 0 for continuous review)" to 1. Read the Policy tile again, and confirm the right-hand column of the table.

Work the new sigma by hand: the square root of the sum of 3.500000 times 1.6 squared and the square of 3.3333 times 0.5. Then set the review period to 3 and predict, before you read, whether the level the engine returns rises or falls.
