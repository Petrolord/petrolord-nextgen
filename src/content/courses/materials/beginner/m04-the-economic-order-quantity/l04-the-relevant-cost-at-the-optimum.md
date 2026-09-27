# The relevant cost at the optimum

{{panel:materials-register-calculator}}

An order quantity is chosen to make a cost small, so it helps to know exactly which cost. The engine calls it the relevant cost: the ordering cost plus the holding cost, the two costs that move when the lot size moves. This lesson reads it at the EOQ and at the quantity actually ordered, and shows how the engine measures the gap.

## Relevant, meaning it moves with the lot

A cost belongs in the comparison only if the choice of lot size changes it. The ordering cost does, because larger lots mean fewer orders. The holding cost does, because larger lots mean more stock on the shelf. The purchase cost, demand times unit cost, does not: baryte costs 78000.000000 a year to buy whatever the lot size. The engine reports it on its own line and leaves it out of the relevant cost.

## At the EOQ

At the EOQ the ordering and holding costs are equal, and their sum has a neat closed form, the square root of 2 A D h. For baryte the relevant cost at the EOQ is 7859.770989 a year. No other lot size, rounded or not, costs less on these stated figures.

## At the quantity ordered

Baryte is ordered as 140.000000 tonnes, rounded up to a multiple of 10 from the EOQ of 137.408584. At 140 the ordering cost is 3857.142857 and the holding cost 4004.000000, a relevant cost of 7861.142857 a year.

| figure | baryte |
| --- | --- |
| EOQ | 137.408584 |
| quantity ordered | 140.000000 |
| ordering cost a year | 3857.142857 |
| holding cost a year | 4004.000000 |
| relevant cost a year | 7861.142857 |
| relevant cost at the EOQ | 7859.770989 |
| rounding penalty, percent | 0.017454 |

## The rounding penalty

The engine reports the gap as a percentage of the relevant cost at the EOQ: the rounding penalty. For baryte it is 0.017454 percent. Ordering in round tens of tonnes costs less than two hundredths of a percent a year over the theoretical best. That tiny figure is the first sign of a property module 5 explores: the relevant cost is very flat near its minimum.

## Exactly one holding cost

The relevant cost needs a holding cost, and the engine accepts it in exactly one of two forms. State both a holding rate and a holding cost of a unit for a year, or leave both out, and the engine refuses with the same message:

> holdingCostPerUnitYear or holdingRate: state exactly one (holdingRate goes with unitCost)

Two stated holding costs could disagree, and the engine would have to pick one without telling you. Refusing keeps the choice yours.

## Exercise

Open the register calculator in "The economic order quantity" on "Baryte on the Ekene register". Work the relevant cost at the EOQ by hand as the square root of 2 times 1800 times 300 times 57.2, and check it against the panel. Then work the rounding penalty from the two relevant costs, as a percentage, and check it. Now type 57.2 into the holding cost of a unit for a year control, leaving the Holding rate control as it is, and copy the refusal. Clear the Holding rate control and read the result again: what changed, and what did not?
