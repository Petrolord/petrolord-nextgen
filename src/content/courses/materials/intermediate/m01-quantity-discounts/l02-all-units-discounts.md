# All-units discounts

{{panel:materials-stock-calculator}}

Under an all-units discount, the price of the band a lot falls in applies to every unit of that lot. Order 120 casing joints and all 120 cost 1360; order one joint fewer and every joint costs 1400. The engine states the total cost it minimises in its basis, verbatim:

    All-units: TC(Q) = D v + A D / Q + r v Q / 2 with v the price of the band holding Q.

Here D is the annual demand, A the cost of an order, r the holding rate and v the price. The purchase cost D v is now part of the sum, because v depends on Q.

## One candidate a band

The engine works band by band. For each price it computes the EOQ at that price, then asks where that EOQ lies:

* inside the band: the EOQ itself, rounded by the stated rule, is the band's candidate;
* below the band's break: the break quantity is the candidate, since ordering less would lose the price;
* at or above the next break: the band offers no candidate, because a cheaper band already covers that quantity.

Each candidate is costed at its quantity, in the band that quantity lands in, and the cheapest is ordered.

## The casing, all-units

On CSG-958 (demand 240 a year, order cost 3500, holding rate 0.2, nearest whole joint):

| band | price | EOQ | candidate | total cost a year |
| --- | --- | --- | --- | --- |
| 0 | 1450 | 76.112440 | none | none |
| 1 | 1400 | 77.459667 | 77.000000 | 357689.090909 |
| 2 | 1360 | 78.590525 | 120.000000 | 349720.000000 |

The band 2 EOQ falls below its break of 120, so the break is its candidate. The engine's reason for that band, verbatim:

> band 2 at 1360: EOQ 78.590525 lies below the break 120, so the break quantity is the candidate, total cost 349720 a year

The engine orders 120.000000 joints in band 2 at 349720.000000 a year, a saving of 20352.607458 against the no-discount baseline. The lot is larger than any band's EOQ, so holding costs more; the lower price on all 240 joints a year pays for it.

## A published check

Caplice, MIT ESD.260J Logistics Systems, Fall 2006, lecture 8 slide 12 (MIT OpenCourseWare, CC BY-NC-SA 4.0, read 2026-09-27) states a two per cent all-units discount from 500 units on a demand of 2000 a year, an order cost of 500, a holding rate of 0.25 and a price of 50, and prints no answer. The course cites its figures and reproduces none of its text. The engine orders 500.000000 at 103062.500000 a year, against 105000.000000 at the band 0 EOQ of 400.000000. Its reason, verbatim:

> order 500 at a total cost of 103062.5 a year (band 1), the lowest of 2 candidates

## Exercise

Open the stock calculator, choose the view "Quantity discounts" and start from "The casing on the Ekene register, all-units". Confirm the three rows of the table above and the saving against the baseline. Read the band 0 reason and say in your own words why that band gives no candidate.

Then start from "Lecture 8 slide 12, all-units" and confirm 500.000000 at 103062.500000. Go back to the casing and raise the control "price band 3: from quantity" from 120 to 180. Before you read the result, predict whether the break is still worth taking. Write the new quantity ordered and total cost beside the ones above.
