# When the take-or-pay quantity is exactly met

{{panel:gsa-quantity-calculator}}

Every rule has an edge, and a contract has to say which side of it a figure falls on. For take-or-pay the edge is the take-or-pay quantity itself. The engine's rule leaves no doubt: the deficiency is the take-or-pay quantity less the quantity counted, when that is above zero. Taking exactly the take-or-pay quantity leaves a deficiency of zero.

## Exactly met and one unit short

Two golden cases sit on either side of the edge, each with a take-or-pay quantity of 800.000000:

| case | take-or-pay quantity | taken | deficiency (engine) | deficiency payment (engine) |
| --- | --- | --- | --- | --- |
| exactly met, 2027 | 800.000000 | 800.000000 | 0.000000 | 0.000000 |
| one unit short, 2027 | 800.000000 | 799.000000 | 1.000000 | 3.000000 |

For the exactly met case the engine prints no reason, because there is nothing to reconcile. For the case one unit short it prints the working, verbatim:

> 2027: 799 counted against the take-or-pay quantity 800 leaves a deficiency of 1; the deficiency payment is 1 x 3 = 3; the buyer may make up 1 in the 2 contract years after 2027, to the end of 2029

The last clause of that reason opens a make-up right, because 2027 in that case is followed by another contract year. What the buyer does with it belongs to the Professional tier.

## The power plant's 2032

The power plant fixture plants the same edge in a real-sized year. In the leap year 2032 the ACQ is 7686000.000000, nothing reduces it, and at 80 percent the take-or-pay quantity is 6148800.000000. The buyer took 6148800.000000. The engine finds a deficiency of zero at the boundary.

## Zero take and a whole year of force majeure

The far edges behave just as plainly. A year with nothing taken leaves the whole take-or-pay quantity as a deficiency: 800.000000, paid at 2400.000000. A year covered entirely by force majeure has an Adjusted ACQ of 0.000000, so its take-or-pay quantity is zero and there is no deficiency at all.

| case | Adjusted ACQ | taken | deficiency (engine) |
| --- | --- | --- | --- |
| a zero-take year | 1000.000000 | 0.000000 | 800.000000 |
| a whole year of force majeure | 0.000000 | 0.000000 | 0.000000 |

## Printed alike is not equal

The engine compares exact numbers. Two figures that happen to print the same at six decimals are not, for that reason alone, met or equal; only the engine's own deficiency says whether the take-or-pay quantity was met. When you read a year near the edge, read the deficiency the engine returns and do not compare printed figures by eye.

## Why the edge matters

A buyer that tracks its position through the year may aim to take just enough, and end the year exactly at the take-or-pay quantity. A rule that put a deficiency of one unit on such a year would create a payment nobody intended. The engine's rule matches the model agreement: the buyer must take at least the take-or-pay quantity, and at least includes equal.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "One take-or-pay year". Enter one year with an `acq` of 1000, `topPct` 80, a `topPrice` of your own and a `makeUp` object, and set `taken` to 800. Run it and read the deficiency. Change `taken` to 799 and run it again. Then set `taken` to 0. Finally start from "The power plant, 2032 alone" and read the take-or-pay quantity, the quantity counted and the deficiency.
