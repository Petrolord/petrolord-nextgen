# Solving it the other way round

The same relation answers the design question as well as the rating question. Instead of asking what a column of a given size removes, hand it the removal a contract demands and ask how many theoretical stages reach it.

## The inverse, and what comes back

| A | removal wanted | stages | check: removal at those stages |
| --- | --- | --- | --- |
| 1.200000 | 0.900000 | 5.025685103 | 0.900000000 |
| 1.600000 | 0.900000 | 3.140202390 | 0.900000000 |
| 1.600000 | 0.990000 | 7.746472598 | 0.990000000 |
| 2.000000 | 0.990000 | 5.658211483 | 0.990000000 |
| 1.000000 | 0.900000 | 9.000000000 | 0.900000000 |

The stage counts come back fractional, and that is correct rather than untidy. A theoretical stage is a unit of separation difficulty, so a spec can perfectly well ask for a fraction of one. Rounding is a decision about steel and the engine leaves it to you.

{{panel:fc-absorber-explorer}}

## Reading the check column

The last column is the answer put straight back into the forward relation. It returns the removal that was asked for, on every row, which says the two directions are inverses of each other and not two separate pieces of arithmetic that happen to sit near one another. That is worth doing by hand once, because it is the cheapest possible test of a two-way relation and most published correlations cannot pass it.

The row at an absorption factor of 1.000000 is in the set on purpose. The forward relation takes its own branch there, and the inverse has to match that branch rather than the general form, so putting the boundary case through both directions checks the join.

## What the two directions are for

The rating direction belongs to an existing column. You know the stages, you know what the solvent side is doing, and you want to know whether next quarter's gas still meets the spec. The design direction belongs to a column that does not exist yet. You know the spec, you pick what the solvent side will do, and the stage count is the size of the problem you are about to hand a vendor.

Notice how differently the two rows at a removal of 0.900000 read. At an absorption factor of 1.200000 the spec takes 5.025685103 stages and at 1.600000 it takes 3.140202390. Both are answers to the same contractual requirement, and the difference between them is a decision about the solvent side that was made before the relation was ever called.

The third and fourth rows make the same point at a tighter spec. A removal of 0.990000 is asked of a column at 1.600000 and again at 2.000000, and the stage counts that come back are 7.746472598 and 5.658211483.

## Exercise

Record the stage counts for a removal of 0.900000 at absorption factors of 1.200000, 1.600000 and 1.000000. Then say what the check column is doing, and explain why a fractional stage count is the right kind of answer for the question that was asked.
