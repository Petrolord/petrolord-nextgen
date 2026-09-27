# Holding cost as a rate or a figure

{{panel:materials-register-calculator}}

Holding stock costs money in several ways: the capital tied up, the warehouse space, insurance, handling, the risk of damage or of the item going out of date. A policy can state that cost in one of two forms, and the engine accepts either, as long as exactly one is stated.

## As a rate on the unit cost

The Ekene policy states baryte's holding cost as a rate: 0.22 a year on a unit cost of 260. The engine multiplies the two and reports the holding cost of a unit for a year, 57.200000. A rate suits items whose holding cost is mostly the money tied up in them, because it scales with the price: a costlier item costs more to hold.

## As a figure a unit a year

A policy can also state the holding cost directly, as a figure per unit per year. That suits items whose holding cost is mostly space or handling, where a cheap bulky item may cost more to store than a dear small one. On a stated case with a holding cost of 4.5 a unit a year, the EOQ is 200.000000, and rounded down to a multiple of 25 it stays 200.000000.

## What the unit cost still does

With a directly stated holding cost the unit cost no longer enters the EOQ. It still matters for one line of the result, the purchase cost a year. On the case above the purchase cost is reported as none when no unit cost is stated, and as 36000.000000 when a unit cost of 30 is stated beside the holding cost. The EOQ is the same either way.

| stated case | holding cost stated as | unit cost | EOQ | purchase cost a year |
| --- | --- | --- | --- | --- |
| baryte (Ekene) | rate 0.22 | 260 | 137.408584 | 78000.000000 |
| a holding cost stated directly | 4.5 a unit a year | not stated | 200.000000 | none |
| the same, with a price | 4.5 a unit a year | 30 | 200.000000 | 36000.000000 |

## Exactly one

State both forms and the two could disagree; state neither and there is nothing to hold against. The engine refuses both cases with one message:

> holdingCostPerUnitYear or holdingRate: state exactly one (holdingRate goes with unitCost)

A rate with no unit cost is refused, because a rate needs a price to act on:

> unitCost is required with holdingRate (the holding cost is holdingRate x unitCost)

A rate of 0 is refused too, because stock that costs nothing to hold has no EOQ:

> holdingRate must be a finite number above 0; got 0

Whichever form a policy uses, the course quotes the EOQ with the holding cost it came from, in the form it was stated.

## Exercise

Open the register calculator in "The economic order quantity". Start from "A holding cost stated directly", read the EOQ and the purchase cost, then type 30 into the Unit cost control and read them again. Next start from "Baryte on the Ekene register", empty the Holding rate control, and type 57.2 into the holding cost of a unit for a year control: check that the EOQ and quantity ordered are unchanged. Last, set the Holding rate control back to 0.22 with both filled, and copy the refusal.
