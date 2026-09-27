# The ESP motor

{{panel:materials-spares-calculator}}

This lesson works the Ekene register's insurance case end to end: the item, its stated inputs, the full table the engine returns and what the answer does and does not say. Everything here is synthetic, written for this platform, and every figure is the engine's on the stated inputs.

## The item

The register lists the item as "ESP motor, 228 kW, for Ekene-2 and Ekene-4". The lower tiers have met it twice already. Its criticality under the Ekene policy is class V with a weighted score of 82.000000, and by annual usage value it ranks first, at 370000.000000, in class A. The register holds 1 on hand. Criticality and ABC say the motor matters and costs; neither says how many to keep. That is the question here.

## The stated inputs

2 failures a year across the pumped wells, a lead time of 150 days, 365 days a year, a unit cost of 185000, a holding rate of 0.2, a downtime cost of 18000 a day, and a search from 0 to 6 spares. Each is a stated input, and a figure quoted from this case is quoted with them.

## The whole table

| spares | probability of no shortage | fill rate | expected units down | holding cost a year | downtime cost a year | total cost a year |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 0.439588 | 0.000000 | 0.821918 | 0.000000 | 5400000.000000 | 5400000.000000 |
| 1 | 0.800893 | 0.439588 | 0.261506 | 37000.000000 | 1718091.849237 | 1755091.849237 |
| 2 | 0.949374 | 0.800893 | 0.062398 | 74000.000000 | 409957.821135 | 483957.821135 |
| 3 | 0.990054 | 0.949374 | 0.011773 | 111000.000000 | 77347.405085 | 188347.405085 |
| 4 | 0.998413 | 0.990054 | 0.001827 | 148000.000000 | 12003.732064 | 160003.732064 |
| 5 | 0.999787 | 0.998413 | 0.000240 | 185000.000000 | 1577.882952 | 186577.882952 |
| 6 | 0.999975 | 0.999787 | 0.000027 | 222000.000000 | 179.621332 | 222179.621332 |

The mean orders outstanding are 0.821918, and the cheapest stock is 4 spares at 160003.732064 a year. The search ran to 6 and the answer sits inside it, so no flag is raised. The engine's reason, verbatim:

> 4 spares: holding 148000 a year against expected downtime 12003.73, total 160003.73, the lowest for 0 to 6; one more spare adds 37000 of holding and saves 10425.85 of downtime

## Reading the answer

With four spares the chance that the shelf is never empty is 0.998413, and the chance that a failure finds a spare is 0.990054. Those probabilities are consequences of the cost comparison; the engine did not aim at them. A planner who wants a stated probability of no shortage reads the table for the first row that meets it and prices the difference.

The figure is the cheapest stock for the stated failure rate and costs. It is no forecast of which motors will fail, no audit of the register and no supplier's promise. The register's own 1 on hand is a separate fact the model does not read.

## What the model leaves out

It holds no repair loop, no condemnation, no multi-echelon stock and no partial production loss. Each is a different model and a different course, and the engine's one-for-one answer is quoted as that model's answer.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". Reproduce every row of the table above. Check that the total in each row is the holding plus the downtime. Set "Search limit, the most spares (stated)" to 3 and read the tile and reason: the cheapest stock found is 3, and the reason says a larger stock may cost less. Restore 6. Then write a three-line note to a production manager stating the cheapest stock, its cost a year, and the inputs it rests on.
