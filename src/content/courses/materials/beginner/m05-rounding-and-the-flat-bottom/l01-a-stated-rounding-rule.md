# A stated rounding rule

{{panel:materials-register-calculator}}

The EOQ is almost never a quantity anyone can order. Baryte's is 137.408584 tonnes; suppliers sell by the tonne, by the pallet, by the drum or by the truckload. Somewhere between the square root and the purchase order, the figure is rounded, and a rounding done in someone's head is a policy nobody wrote down. The engine asks for the rounding rule as a stated input.

## Four rules

A rounding rule is either none, or one of up, down and nearest with a stated multiple.

- **none**: order the EOQ as it is. The quantity ordered equals the EOQ.
- **up**: take the next multiple at or above the EOQ.
- **down**: take the multiple at or below it.
- **nearest**: take the closer of the two, with an exact half going upward.

The engine divides the EOQ by the multiple, reads the quotient at 12 significant digits, takes it up, down or to the nearest whole number, and multiplies back. The Ekene policy states up to a multiple of 10 for baryte, so 137.408584 becomes 140.000000.

## Two figures, two names

The course keeps the words exact. The EOQ is the unrounded square-root figure. The quantity ordered is the figure the stated rounding rule gives. The engine prints both, and its reason names the rule beside the quantity:

> EOQ = sqrt(2 x 1800 x 300 / 57.2) = 137.408584; ordered as 140 (up to a multiple of 10), a relevant cost of 7861.14 a year against 7859.77 at the EOQ

Harris did the same thing in words in 1913 when he printed his stud's lot as 48.5 "or, say, 49": a rounding to the nearest whole unit, stated where the reader can see it.

## Rules that are refused

Leaving the rule out is refused, and the message spells out the shapes a rule can take:

> rounding must be a stated rounding rule { rule: 'none' } or { rule: 'up' | 'down' | 'nearest', multiple }

A multiple of 0 has no meaning:

> rounding.multiple must be a finite number above 0; got 0

And the rule none takes no multiple at all, so a multiple stated beside it is refused as a contradiction:

> rounding.multiple must be left out when the rule is 'none'

Each refusal stops a quantity ordered that nobody chose.

## Exercise

Open the register calculator in "The economic order quantity" on "Baryte on the Ekene register". Set the Rounding rule control to each of its four choices in turn, keeping the Rounding multiple control at 10 where it applies, and write down the quantity ordered and the reason for each. Then set the Rounding rule control to not stated and copy the refusal. Set it back to up and change the Rounding multiple control to 0, and copy that refusal too.
