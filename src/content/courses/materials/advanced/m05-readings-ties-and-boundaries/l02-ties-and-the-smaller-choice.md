# Ties and the smaller choice

{{panel:materials-stock-calculator}}

{{panel:materials-spares-calculator}}

A search that picks the lowest cost needs a rule for two candidates that cost the same. The engine states one for each search it runs, and each rule takes the smaller choice. This lesson reads the three ties, the rule for each and the alternative the engine names beside it.

## A discount tie

Under an all-units schedule, two candidates can reach the same total cost a year. On a stated case, ordering 100 at the band 0 price and ordering 200 at the band 1 price both cost 200.000000 a year. The engine takes the smaller quantity, verbatim:

> order 100 at a total cost of 200 a year (band 0), the lowest of 2 candidates; tied on cost, the smaller quantity is taken

The alternative takes the larger quantity. The engine's choice orders less at once for the same annual cost.

## A spares tie

The insurance search can meet the same thing. On a stated case whose unit cost was chosen so that the first spare saves exactly what it costs, 0 spares and 1 spare both cost 365000.000000 a year. The engine keeps fewer spares, verbatim:

> 0 spares: holding 0 a year against expected downtime 365000, total 365000, the lowest for 0 to 2; one more spare adds 230724 of holding and saves 230724 of downtime

The alternative keeps more spares. The reason shows the tie in its own terms: one more spare adds and saves the same amount.

## An ABC tie

Ranking by annual usage value meets ties too. Two items of equal value are ranked by id, ascending. On a stated case, items a and b each carry a value of 10.000000; a ranks 1 and b ranks 2. The alternative ranks by id descending. Where the tied items straddle a cut-off, the rank decides the class.

## What a tie is

A tie is two figures that agree to 12 significant digits, the reading of the previous lesson. Two costs that print alike at six decimals may still differ further out, and then the engine takes the smaller cost, whatever the quantity. Printed alike is not equal, and the rule decides on the figures the engine holds.

| search | the tie | the engine takes | the alternative |
| --- | --- | --- | --- |
| quantity discount | equal total cost | the smaller quantity | the larger |
| insurance spares | equal total cost | fewer spares | more spares |
| ABC ranking | equal annual usage value | id ascending | id descending |

## Why the tier learns them

No capstone field depends on a tie rule. A planner still needs them, because a real schedule or a real register can tie, and the answer the engine returns is then the stated choice. A policy that prefers the other choice says so and checks the table.

## Exercise

Open the stock calculator on the view "Quantity discounts" and start from "Two candidates tied on cost". Read both candidates, their quantities and their totals, and compare the reason with the first quotation above. Then open the spares calculator on the view "Insurance spares" and start from "Two stocks tied on cost". Read the rows for 0, 1 and 2 spares and compare the reason with the second quotation. For each tie, write one sentence naming the alternative and what it would have returned.
