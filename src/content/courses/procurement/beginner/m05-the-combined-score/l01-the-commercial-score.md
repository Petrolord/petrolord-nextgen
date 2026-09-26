# The commercial score of the lowest ratio

{{panel:pr-envelope-calculator}}

A combined award weighs quality against cost, and to add the two they must be on the same scale. The technical percentage is already out of 100. The evaluated cost is money. The commercial score turns each responsive bid's evaluated cost into points out of 100, and this lesson reads the method the well services tender uses.

## The lowest-ratio method

The engine's basis for the well services tender reads:

> Sc = 100 x Cmin / C with Cmin = 862141

Cmin is the lowest evaluated cost among the bids being scored, here WS5's 862141.000000 with omissions at the average and the fixture's schedule. C is the bid's own evaluated cost. The bid with the lowest evaluated cost scores exactly 100, and every other bid scores 100 times the ratio of the lowest to its own. This is the form of the commercial term in the combined evaluation formula of the World Bank Standard Procurement Document, Request for Bids, Works, two-envelope (September 2025), Section III.

## The four responsive bids

| bid | evaluated cost C | Sc = 100 x Cmin / C |
| --- | --- | --- |
| WS5 | 862141.000000 | 100.000000 |
| WS2 | 885574.000000 | 97.353920 |
| WS1 | 928200.000000 | 92.883107 |
| WS3 | 957990.000000 | 89.994781 |

Take WS2: 862141.000000 divided by 885574.000000, times 100, is 97.353920. WS3 is the dearest of the four by evaluated cost, and it still scores close to 90. The ratio compresses differences in cost: a bid must be far dearer than the lowest before its commercial score falls a long way. That is worth remembering when you meet the technical weight in the next lessons.

## What the score is built from

The commercial score uses the evaluated cost from module 4, never the quoted price. Everything that moved an evaluated cost, a correction, a discount, a deviation, an omission, a late completion, moves the commercial score with it. An evaluated cost of zero is refused, since the ratio has no meaning when a cost is zero:

> bids[0].evaluatedCost must be a finite number above 0

## Other price methods

The engine accepts two price methods, and neither has a default:

> priceMethod must be 'lowest-ratio' or 'linear'; there is no default

The panel offers the second, linear, as well. The Professional tier teaches it and shows that the choice of price method can move the award, which is why every combined score in this course is quoted with its method. A method based on the deviation from the mean is refused by name. This tier works with the lowest ratio only, the method the well services tender states.

## Exercise

In the envelope calculator choose "The combined score". The bids box starts with the four responsive well services bids, each with its technical percentage, its evaluated cost and its receipt time. Compute WS1's commercial score by hand from the table above and check it against the panel. Then lower WS3's evaluated cost to 850000 and watch Cmin: which bid now scores 100, and what happens to WS5's commercial score? Restore it, and finally set WS2's evaluated cost to 0 and read the refusal.
