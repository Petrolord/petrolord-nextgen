# Rounding against the breaks

{{panel:materials-stock-calculator}}

A discount schedule and a rounding rule meet at the breaks. Casing comes in whole joints, a chemical in drums. The rounding rule is a stated input, as it was for the plain EOQ at Associate, with the nearest taking halves upward. The engine applies it to every candidate and costs the rounded quantity in the band it lands in.

## A break has to survive the rounding

If a band starts at 500 and every lot must be a multiple of 300, no lot can sit on the break: a rounded lot lands on a multiple of 300 either side of it. The engine refuses such a policy before it computes anything:

> breaks[1].minQuantity must be a multiple of rounding.multiple 300, so that ordering at the break keeps its price; got 500

Under the rule none the breaks may sit anywhere.

## A rounding that orders nothing

A rule that rounds down can take a small EOQ to zero. On a two-band schedule with prices of 1 and 0.5, the break at 100, and a demand, order cost and holding rate of 1 each, the band 0 EOQ is small, and rounding it down to a multiple of 100 orders nothing:

> rounding gives an order quantity of 0 from the band 0 EOQ 1.414214; state a smaller multiple or another rule

A missing rule is refused as at Associate:

> rounding must be a stated rounding rule { rule: 'none' } or { rule: 'up' | 'down' | 'nearest', multiple }

## A candidate that moves band

Rounding can carry a candidate across a break. On the casing, band 1's EOQ of 77.459667 lies inside band 1. Rounded up to a multiple of 60, it becomes 120, which is the start of band 2; the engine costs it there, at 1360 a joint. Band 2's own candidate is also 120, so two candidates meet at the same quantity and the same cost, and the reading from the last lesson takes the smaller quantity, which here is the same lot. The order stays at 120.000000 and 349720.000000 a year.

The rounding rule is one input for the whole schedule, and a figure quoted under it is quoted with it: the casing's all-units order is 120.000000 to the nearest whole joint.

## Exercise

Open the stock calculator, choose the view "Quantity discounts" and start from "The casing on the Ekene register, all-units". Set the rounding rule control to up to a multiple and the rounding multiple to 7. Read the refusal and note which break it names. Change the multiple to 60 and predict the order before you read it; then confirm 120.000000 at 349720.000000 and read the band 1 candidate row to see where its quantity was costed.

Next set the rounding rule to not stated and read the refusal. Finally set it to none, and confirm that the order and total do not move.
