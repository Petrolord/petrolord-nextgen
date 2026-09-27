# The square root formula

{{panel:materials-register-calculator}}

This lesson puts the two costs and Harris's square root together in the form the engine states, and works it for the Ekene baryte.

## The rule the engine states

The engine's basis for the EOQ, verbatim:

> Q* = sqrt(2 A D / h); ordering cost A D / Q; holding cost h Q / 2; relevant cost at Q* = sqrt(2 A D h)

A is the cost of an order, D the annual demand and h the cost of holding one unit for a year. The ordering cost falls as Q grows, and the holding cost rises. Their sum is lowest where the two are equal, and setting A D / Q equal to h Q / 2 and solving for Q gives the square root of 2 A D over h. That Q is the economic order quantity, written Q*.

## Baryte, worked

Baryte's figures are A 1800, D 300 and h 57.200000, the holding rate times the unit cost. The engine's reason, verbatim:

> EOQ = sqrt(2 x 1800 x 300 / 57.2) = 137.408584; ordered as 140 (up to a multiple of 10), a relevant cost of 7861.14 a year against 7859.77 at the EOQ

The reason prints the whole calculation in one line, with money rounded to the cent. When you reason with a figure, use the numeric field the panel prints: the EOQ is 137.408584 tonnes.

## At the EOQ the two costs are equal

On the same case with the rounding rule none, the quantity ordered is the EOQ itself, and the engine reports an ordering cost of 3929.885495 and a holding cost of 3929.885495. They match to every decimal the panel prints, which is the square root doing exactly what it promised. Their sum, 7859.770989, is the relevant cost at the EOQ.

## The EOQ and the quantity ordered are two figures

The course keeps the words exact. The EOQ is the unrounded square-root figure: 137.408584 for baryte. The quantity ordered is the figure the stated rounding rule gives from it: 140.000000 for baryte, rounded up to a multiple of 10. Nobody orders 137.408584 tonnes of anything, so a policy states how the EOQ becomes an order, and the engine reports both. Module 5 is about that step and what it costs.

## A rate needs a price

A holding rate is a fraction of the unit cost, so a rate with no unit cost gives no holding cost at all. The engine refuses the pair by name:

> unitCost is required with holdingRate (the holding cost is holdingRate x unitCost)

The same holds the other way: a unit cost of 0 with a rate would make holding free, and it is refused as well.

## Exercise

Open the register calculator in "The economic order quantity" on "Baryte on the Ekene register". Work the EOQ by hand from the reason's formula, to six decimals, and check it against the EOQ field. Set the Rounding rule control to none and confirm that the ordering cost and the holding cost are equal. Then raise the Holding rate control and say which way the EOQ moves and why. Last, set the Unit cost control to not stated and copy the refusal.
