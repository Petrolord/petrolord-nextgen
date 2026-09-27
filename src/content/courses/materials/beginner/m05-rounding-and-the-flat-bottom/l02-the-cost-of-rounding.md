# The cost of rounding

{{panel:materials-register-calculator}}

Any quantity other than the EOQ costs more a year, by definition. The useful question is how much more. The engine answers it every time: it reports the relevant cost at the quantity ordered, the relevant cost at the EOQ, and the rounding penalty in percent between them. This lesson reads that penalty for baryte under six rules and finds a surprisingly forgiving curve.

## Baryte under six rules

Only the rounding changes; the demand of 300 a year, the order cost of 1800 and the holding cost stay as the register states them.

| rule | quantity ordered | relevant cost a year | penalty, percent |
| --- | --- | --- | --- |
| none | 137.408584 | 7859.770989 | 0.000000 |
| up, multiple 10 | 140.000000 | 7861.142857 | 0.017454 |
| down, multiple 10 | 130.000000 | 7871.846154 | 0.153633 |
| nearest, multiple 10 | 140.000000 | 7861.142857 | 0.017454 |
| up, multiple 50 | 150.000000 | 7890.000000 | 0.384604 |
| nearest, multiple 1 | 137.000000 | 7859.805839 | 0.000443 |

## Reading the table

Rounding to the nearest whole tonne costs 0.000443 percent. Rounding up to a multiple of 10 costs 0.017454 percent. Rounding down to 130 costs more, 0.153633 percent, because it moves further from the EOQ. Rounding up to a multiple of 50 moves 12.591416 tonnes above the EOQ, and still costs only 0.384604 percent a year. The engine's reason for that last rule, verbatim:

> EOQ = sqrt(2 x 1800 x 300 / 57.2) = 137.408584; ordered as 150 (up to a multiple of 50), a relevant cost of 7890 a year against 7859.77 at the EOQ

## The flat bottom

Plot the relevant cost against the lot size and you get a shallow bowl. Near its lowest point the bowl is almost flat, so a lot some way from the EOQ costs very little extra. That flatness is the practical gift of the EOQ: a store can round to a pallet, a drum or a truckload, or to whatever the supplier sells, and give up a fraction of a percent a year for the convenience.

The flatness also means the penalty grows slowly at first and faster later. Doubling the distance from the EOQ roughly quadruples the penalty, so small roundings are nearly free and large ones start to show.

## What the penalty does not include

The penalty compares relevant costs only. It says nothing about the price, the space a bigger lot needs, or the shelf life of what is stored. A policy that rounds up to a truckload of baryte should check that the store has room for it. The engine computes the stated costs; the rest is judgement written into the policy, where the next person to review it can see it.

## Exercise

Open the register calculator in "The economic order quantity" on "Baryte on the Ekene register". Reproduce every row of the table above by changing only the Rounding rule and Rounding multiple controls, and check each relevant cost and penalty against the panel. Then find, by trying multiples, the largest multiple for which rounding up keeps the penalty below one percent. Write down the multiple, the quantity ordered and the penalty, and explain in one sentence why so large a lot costs so little extra.
