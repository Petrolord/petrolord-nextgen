# A printed figure that is a slip

{{panel:materials-stock-calculator}}

A printed table is a reading of a rule at some precision, and it can carry a slip. When an engine and a print disagree, ask which one follows the rule. This lesson works one case, on lecture 11 slide 24 of Caplice, MIT ESD.260J Logistics Systems (Fall 2006, MIT OpenCourseWare, CC BY-NC-SA 4.0, read 2026-09-27), cited by slide with none of its text reproduced.

## The row that does not agree

The slide's fill-rate column prints four safety stocks. Three of them agree with the engine to within 2 units. The fourth, at an item fill rate of 0.95, is printed as 348. On the same inputs, a weekly demand of 250 with sigma over the two-week lead time of 258.088834 and an order quantity of 228, the engine returns a safety stock of 339.179604. The print sits 8.820396 above it.

## Following the rule by hand

The fill-rate rule can be followed without the engine. A fill rate of 0.95 allows expected units short of at most the order quantity times one less the fill rate. Divided by sigma, that gives the target on G. The engine's reason prints every step, verbatim:

> a fill rate of 0.95 needs G(k) at or below 228 x (1 - 0.95) / 258.088834 = 0.044171, so k = 1.314197; safety stock 339.179604 over a demand of 500 with sigma 258.088834 gives the reorder point s 839.179604, held as 839.179604 (no rounding)

A safety factor of 1.314197 times sigma gives 339.179604. At that safety stock the achieved fill rate is 0.950000 and the expected units short a cycle are 11.400000, exactly the order quantity times one less the fill rate. The rule meets its own target exactly; 348 would overshoot it.

## Why this is taught as a slip

The other three rows agree to within 2 units, the noise of a table read to two decimals. The 0.95 row misses far outside that noise, so the course reads 348 as a slip in the print.

That reading comes with two rules the course keeps:

* the printed figure is quoted as printed, beside the rule's figure, with no silent correction;
* the rule is never changed to match a print. An engine tuned to reproduce 348 would stop meeting the target it states.

Printed alike is not equal, and printed is not always right. A figure copied from a slide into a stock policy is checked against its rule before it is used.

This tier meets one more printed slip, in a Poisson table later on, and the method is the same.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "Lecture 11 slide 24, fill rate 0.95". Confirm sigma 258.088834, k 1.314197 and the safety stock 339.179604. Read the achieved fill rate, 0.950000, and the expected units short a cycle, 11.400000, and check the second against 228 times one less the fill rate.

Then set the control "Safety factor reading (stated)" to a table with 2 decimals and read how the safety stock moves. Does any reading of k reach the printed 348?
