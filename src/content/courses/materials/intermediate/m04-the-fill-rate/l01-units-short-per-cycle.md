# Units short per cycle

{{panel:materials-stock-calculator}}

The cycle service level counts the cycles that ran short. A stores supervisor often cares about something else: of all the units the field asked for, what share came off the shelf? That is the second measure this course names, the fill rate, the fraction of demand met from stock.

## Units short, measured against the order

Each replenishment cycle brings one order of Q units onto the shelf. In some cycles demand over the protection period runs past the reorder point, and some units are short until the order lands. The engine computes the expected units short a cycle, and the fill rate is one less that figure divided by Q. A fill rate of 0.98 allows, on average, two units short for every hundred units a cycle brings.

The order quantity sits in that sum, so a fill rate cannot be computed without it. The engine refuses by name:

> orderQuantity is required for a fill rate (units short are measured against the quantity each cycle brings)

## The choke bean set at a fill rate

The choke bean set with its stated inputs, an order quantity of 12 sets, and a fill rate of 0.98 in place of the cycle service target:

| figure | engine |
| --- | --- |
| safety factor k | 1.026327 |
| safety stock | 3.109233 |
| reorder point | 11.442483 |
| held as | 12.000000 |
| expected units short a cycle at the held level | 0.166382 |
| achieved fill rate | 0.986135 |
| achieved cycle service | 0.886929 |

At the held level of 12 sets, about 0.166382 sets a cycle are short on average, out of 12 the cycle brings, which is how the fill rate reaches 0.986135.

## Two measures, two answers

The same held level meets the fill rate target comfortably and gives a cycle service of only 0.886929. There is no contradiction. Most short cycles are short by a fraction of a set: they count fully against the cycle service level and hardly at all against the fill rate. Which measure a policy uses is a stated choice, and the reorder point it gives depends on it. That is why this course never writes a service level without its measure.

## The order quantity does work here

Under a cycle service level, the order quantity changed nothing. Under a fill rate it matters: a larger order means fewer cycles a year, so each cycle can afford more units short for the same share of demand. The reorder point falls as Q rises.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, fill rate". Confirm every row of the table. Clear the control "Order quantity (stated; needed for a fill rate)" to not stated and read the refusal.

Restore it to 12. Now set it to 24 and predict, before you read, whether k and the held level rise or fall. Read the new figures and the new reason, and write one sentence on why the direction matches the paragraph above. Then set it to 6 and check the other direction.
