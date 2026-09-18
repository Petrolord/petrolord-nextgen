# Margin, and what it is worth

{{panel:fc-sizing-explorer}}

Every selection returns a margin beside the letter: the purchased orifice area over the required area, so nobody forms that quotient by hand.

## The three streams of this tier, each to its own letter

| stream | fluid | required area in2 | orifice | orifice area in2 | margin |
| --- | --- | --- | --- | --- | --- |
| ORUBIRI | gas | 2.223779 | L | 2.853000 | 1.282951 |
| AKASO | liquid | 1.867758 | L | 2.853000 | 1.527500 |
| TEBIDABA | steam | 0.949984 | J | 1.287000 | 1.354759 |

Two of the three land on the same letter with quite different margins, which is the clearest thing this table teaches. The gas case needed most of an L orifice. The liquid case needed rather less and got the same valve, because there is nothing between K and L to buy.

## What a margin is and what it is not

A margin is an artefact of the ladder. It is no safety factor, no design allowance, and no measure of how conservative the sizing was. Two cases with identical engineering behind them can end up with very different margins purely because of where they fell between two rungs.

That is why nothing graded here is a margin or an orifice letter. Both are downstream of a published table this package cannot derive, so grading them would be grading a lookup.

Do not divide one margin by another, and do not read the spread of the margin column as saying anything about the three cases. The digest prints the margin returned on each row and no relation between the rows, and a quotient of two margins is a number about the ladder wearing the clothes of a number about the plant.

## What it takes to move a letter

The obvious follow on question is how much the load must change before the letter does, and the digest answers it with a measurement rather than an interpolation off the ladder.

At its stated 68000.0000 lb/hr the ORUBIRI selection is L. The search grows its bracket rather than assuming one: the load is multiplied by 1.050000 until the letter changes, which takes 6 steps and ends at 91126.5036 lb/hr at M. Bisected inside that bracket, the letter changes at 87240.6737 lb/hr, where the required area is 2.853000 in2, the L orifice area itself. The ratio of that load to the stated one is 1.282951083345.

Read that ratio against the margin column above. In critical flow the required area is proportional to the load, so the ratio that moves the letter IS the margin of the selection, printed as 1.282951 in the table. One statement about one case, read as a margin and read as a load.

An invented figure, or one interpolated off the ladder, would sit on the page looking exactly like this measured one. That is the trade this course refuses.

The shape generalises. The letter changes when the required area crosses a rung, and the rungs are unevenly spaced. A case sitting just below a rung takes it with a margin near 1.000000 and steps up on a small rise in load. A case that has just passed a rung carries a large margin and a lot of room before it steps again.

## Exercise

Write down the three streams with their required areas, letters and margins, and say why two share a letter. Explain in one sentence why a margin is no safety factor. Finish with the load at which the ORUBIRI letter changes and its ratio to the stated load, and say which figure in the table above that ratio matches and why.
