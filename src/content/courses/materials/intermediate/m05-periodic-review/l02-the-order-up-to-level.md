# The order-up-to level

{{panel:materials-stock-calculator}}

Under periodic review the engine returns an order-up-to level S, the level each count tops the stock up to. It is built exactly like a reorder point, over a longer protection period: the mean demand over R plus L, plus k times sigma over R plus L. The safety stock is still k times sigma. This course names the order-up-to level and the reorder point apart, because they answer different policies.

## The choke bean set, reviewed monthly

With a review period of 1 month and every other stated input unchanged, the engine's reason, verbatim:

> a cycle service level of 0.95 gives k = Phi^-1(0.95) = 1.644854; safety stock 5.635328 over a demand of 11.66655 with sigma 3.426036 gives the order-up-to level S 17.301878, held as 18 (up to a multiple of 1)

| figure | continuous review | reviewed every month |
| --- | --- | --- |
| safety factor k | 1.644854 | 1.644854 |
| safety stock | 4.983044 | 5.635328 |
| reorder point or order-up-to level | 13.316294 | 17.301878 |
| held as | 14.000000 | 18.000000 |

The safety factor is the same, because the stated cycle service level is the same. Sigma is larger over the longer period, so the safety stock grows. The order-up-to level is higher again, because it also covers a month more of mean demand.

## The published check

Caplice, MIT ESD.260J Logistics Systems, Fall 2006, lecture 12 slides 5 and 6 (MIT OpenCourseWare, CC BY-NC-SA 4.0, read 2026-09-27) work a periodic review on the weekly data of the lecture 11 check: a review period of 8 weeks, an item fill rate of 0.95, and an order quantity of 2000, the demand over one review period. The inputs read k from a table to two decimals and hold the level to the nearest unit, as the slides do.

| figure | engine | printed |
| --- | --- | --- |
| protection period, weeks | 10 | none |
| demand over it | 2500.000000 | none |
| sigma | 577.104177 | 577 |
| safety factor, exact | 0.583373 | none |
| safety factor as read | 0.58 | 0.58 |
| order-up-to level | 2834.720422 | none |
| held as | 2835.000000 | 2835 |

The engine's reason, verbatim; it prints the loss target that the slide rounds:

> a fill rate of 0.95 needs G(k) at or below 2000 x (1 - 0.95) / 577.104177 = 0.173279, so k = 0.583373, read as 0.58; safety stock 334.720422 over a demand of 2500 with sigma 577.104177 gives the order-up-to level S 2834.720422, held as 2835 (the nearest multiple of 1 (halves upward))

## The order quantity under periodic review

A fill rate measures units short against the quantity each cycle brings. Under periodic review a cycle is one review period, and on average each count orders the demand over it: 2000 units in the check. That is why the stated order quantity equals the demand over one review period. The engine does not work it out; it is a stated input.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "Lecture 12 slide 6, periodic review". Confirm the Policy tile, the protection period, sigma 577.104177, k exact and as read, and the held level 2835.000000.

Then set the control "Safety factor reading (stated)" to none and read how far the order-up-to level moves. Finally start from "The choke bean set, cycle service level", set the review period to 1, and confirm the right-hand column of the first table.
