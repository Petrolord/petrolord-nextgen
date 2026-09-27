# The promote ratio

{{panel:farmout-earning-calculator}}

The promote in points says how much more of the well the farminee pays. The promote ratio says how many times its own share it pays. Deals are often quoted as a ratio, a third for a quarter or forty for thirty, and the ratio is the same figure written as one number.

## The rule

The engine's basis states both measures in one line:

> promote = the share of the gross cost the farminee pays minus the interest it holds after the event (points); promote ratio = share paid / interest held

So the ratio is the share paid divided by the participating interest held after the event. For the Ekene Deep well, 40.000000 over 30.000000 is a ratio of 1.333333.

## The same ratio, different points

Two cases in the course pay the same ratio for different participating interests:

| worked case | gross cost | share paid | held after | promote points | promote ratio |
| --- | --- | --- | --- | --- | --- |
| earn-cap-gross-below | 40000000.000000 | 40.000000 | 30.000000 | 10.000000 | 1.333333 |
| earn-third-for-a-quarter | 12000000.000000 | 33.333333 | 25.000000 | 8.333333 | 1.333333 |

Both pay a third more than the participating interest they hold, so the ratio is 1.333333 in each. The points differ, 10.000000 against 8.333333, because the participating interests differ. Neither measure replaces the other: the ratio compares deals of different sizes, and the points turn straight into money on a stated gross cost.

## A share stated as a fraction

A third is a fraction the computer cannot hold exactly. The case `earn-third-for-a-quarter` states the share paid as the nearest double to a third of a hundred. The engine prints a stated input inside a message exactly as it was given, with every digit, so its reason line reads:

> well: gross cost 12000000; FIN pays 33.333333333333336% to earn 25% (25% held after it): a promote of 8.333333 points, ratio 33.333333333333336 / 25; no cap: the promote applies to the whole gross cost; FIN pays 4000000 (33.333333% of the gross cost), EKO pays 8000000, a carry of 1000000

The fields print at six decimals: a share paid of 33.333333, a promote of 8.333333 points and a ratio of 1.333333. When you reason with a figure, take the field.

## A heads-up ratio

When the share paid equals the participating interest earned, the ratio is 1.000000 and the promote is 0.000000 points. That is a heads-up deal, and the last lesson of this module reads it beside a full carry.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "A heads-up deal". Read the promote ratio. Then use the "event 1: share the farminee pays, percent (stated)" control to set the share paid to 40 and run it: read the new ratio and promote points and compare them with the first row of the table above. Then start from "A third for a quarter" and find both the field and the reason line's version of the share paid.
