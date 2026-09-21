# A stated vendor figure replaces a table

The last lesson ended on an instruction: a certified vendor figure for the specific trim always replaces the engine's table value. This lesson is about what happens when you follow it, because the engine takes the stated figure and the answer moves.

## The same service, sized twice

The course runs one service at an outlet pressure of 60.000000 psia, first on the table figure and then on a stated one. On the table FL of 0.900000 the coefficient is 19.148480. On a stated FL of 0.970000 the coefficient is 18.750935. The difference, the first less the second, is 0.397545, and the ratio, the first over the second, is 1.021201.

Sit with those four numbers for a moment. They are the whole argument for stating a certified figure. The change is real and it is reportable, and it came from one input that a project either has on a datasheet or does not.

## Why the answer moves at all

The outlet pressure of 60.000000 psia sits below the crossing at 67.679968 psia on the table figure, which means the service is choked and the sizing is being done on the allowable drop. The allowable drop is built from FL. Change FL and the allowable drop changes, so the drop the sizing equation is given changes, so the coefficient changes.

That is the general shape of it. On an unchoked service the recovery factor does not enter the coefficient at all, because the sizing is being done on the stated drop and the stated drop does not know what trim is fitted. On a choked service the recovery factor is in the answer, because the answer is computed from a drop the recovery factor built.

## What to do about it on a real project

Ask for FL and xT for the specific trim, in writing, from the vendor, and state them. A figure written on a quotation for the exact plug, cage and seat combination being supplied is a different class of information from a style average, and it is the only version of these two numbers anybody should be grading a design against.

Where a certified figure is genuinely unavailable, say so explicitly in the calculation, quote the table value as the engine's own, and treat the boundary position as provisional until the vendor confirms it. The failure to avoid is the silent one, where a style average gets copied into a document that later reads as though it had been confirmed.

This is also why the boundary itself has to be restated whenever FL is. The crossing at 67.679968 psia belongs to the table figure. A valve supplied with a certified recovery factor has its own crossing, and that is the number a turndown study should be run against.

## Exercise

Write down the coefficient at an outlet of 60.000000 psia on the table FL of 0.900000 and on a stated FL of 0.970000, with the difference and the ratio the lesson prints between them. Then say why the same substitution would leave the coefficient unmoved on a service operating above the crossing at 67.679968 psia.
