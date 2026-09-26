# The ranking paradox of relative price scores

{{panel:pr-envelope-calculator}}

{{panel:pr-award-calculator}}

Both price methods in this course are relative. The lowest ratio divides by Cmin, and the linear method measures from Cmin to Cmax. Each bid's commercial score therefore depends on the other bids in the field. Chen (2008) shows what that dependence can do, and the engine reproduces his figures.

## Chen's example

The source is Chen, T. H., "An economic approach to public procurement", Journal of Public Procurement 8(3), 2008, p. 409, read on 2026-09-26. Chen scores price as "50 x L / P", where L is the lowest price and P the bid's own. Three prices, 40, 50 and 80.

The example is entered through the combined score: technical weight 0.5, every technical score 0, the lowest ratio. Then B = 0.5 x 100 x Cmin / C, which is Chen's formula. The technical method must be 'absolute', because under 'relative' a field where every bid scores 0 has no Thigh, and the engine refuses it:

> bids all score 0 technically, so Thigh is 0 and the 'relative' technical score is undefined

With A in the field, and then with A declared invalid after opening:

| bid | price | B with A in the field | B with A declared invalid |
| --- | --- | --- | --- |
| A | 40 | 50.000000 | excluded |
| B | 50 | 40.000000 | 50.000000 |
| C | 80 | 25.000000 | 31.250000 |

B beats C in both columns, but the distance changes: B leads by 15.000000 points with A in the field and by 18.750000 points without it. Removing a bid that is neither B nor C moved them apart.

## Why that is a paradox

On price alone the order of B and C does not move. Add a technical score and it bites. Suppose C's technical score adds more to its combined score than B's does, by a margin between the two price gaps. With A in the field, that margin outweighs a 15.000000 point price gap and C ranks above B; with A removed, it no longer outweighs an 18.750000 point gap and B ranks above C. The choice between B and C is decided by a third bid.

The linear method is sharper still, since bids in the field set both ends of its scale: remove the dearest bid and every commercial score except the lowest bid's falls.

## What an evaluator does with this

The paradox is a property of scoring price relative to the field, and no engine removes it. What the engine does is make it visible: a bid excluded after opening carries its stated reason, and a ranking recomputed without it shows which scores moved.

A combined score belongs to a field, a technical weight and two methods, and a report names all four.

## Exercise

Open the envelope calculator on the view "The combined score". Replace the bids with three of your own, A, B and C, with evaluated costs 40, 50 and 80, a technicalPercent of 0 each and any receipt time in the UTC form the well services bids use. Set the technical weight to 0.5 and the price method to lowest-ratio. With the technical method at relative, read the refusal; switch to absolute and check the first column of the table. Delete A and check the second column. Then give C a technicalPercent of your choosing and find a value at which C ranks above B with A present and below B without it. Finally, in the award calculator's weighting band view, check a weight of 0.5 at high risk and US$900000.
