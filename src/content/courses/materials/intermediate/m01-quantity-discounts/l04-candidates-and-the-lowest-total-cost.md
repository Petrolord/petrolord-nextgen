# Candidates and the lowest total cost

{{panel:materials-stock-calculator}}

Both discount types end the same way: each band offers at most one candidate, each candidate is costed at its quantity, and the cheapest is the order. The engine prints every candidate with a reason, so the choice can be checked line by line.

## The same schedule, two answers

The casing schedule gives two different orders under the two types:

| discount type | quantity ordered | band | total cost a year | saving against the baseline |
| --- | --- | --- | --- | --- |
| all-units | 120.000000 | 2 | 349720.000000 | 20352.607458 |
| incremental | 141.000000 | 2 | 365590.042553 | 4482.564905 |

All-units gives the band 2 price to all 120 joints of a lot, so its best order sits on the break. Incremental gives the band 2 price only to the joints above 120, so a lot needs to be larger before the discount is worth its fixed cost, and the saving is smaller. The type is part of the supplier's offer and a stated input.

The lecture 8 schedule shows the same effect: incremental orders 1789.000000 at 98826.043879 a year; the same prices read as all-units order 1000.000000 at 86000.000000.

## How many candidates

The engine counts the candidates in its reason. One band gives one candidate, the ordinary EOQ; so does a schedule whose band 0 EOQ lies beyond the only break. Two reasons, verbatim:

> order 400 at a total cost of 105000 a year (band 0), the lowest of 1 candidate

> order 4600 at a total cost of 483717.83 a year (band 1), the lowest of 1 candidate

## A tie on cost

Two candidates can cost the same. On a demand of 100 a year, an order cost of 50, a holding rate of 1 and a price of 1, band 0's EOQ of 100 costs 200 a year; a second band from 200, priced at seven eighths of band 0, also costs 200 a year at its break. The engine compares the two totals at twelve significant digits, finds them equal, and states the choice it makes:

> order 100 at a total cost of 200 a year (band 0), the lowest of 2 candidates; tied on cost, the smaller quantity is taken

This is a reading the engine states, and the alternative it names is to take the larger quantity. The texts read for this course do not settle it. The smaller lot holds less stock for the same money, which is the case for the engine's choice. Drop the second band's price to three quarters of band 0 and the tie breaks:

> order 200 at a total cost of 175 a year (band 1), the lowest of 2 candidates

## Exercise

Open the stock calculator, choose the view "Quantity discounts" and start from "The casing on the Ekene register, all-units". Note the order and total. Set the control "Discount type" to incremental and note them again; your two rows should match the first table. Then start from "Lecture 8 slides 13 to 15, incremental", switch the discount type to all-units, and confirm 1000.000000 at 86000.000000.

Now start from "Two candidates tied on cost". Read the two candidate rows and the reason naming the tie. Set "price band 2: unit price" to three quarters of the band 0 price and confirm the order moves to the break. Say which reading produced the first answer, and what its alternative would have ordered.
