# Tension eats collapse

Two loads that look unrelated, and are not.

{{panel:ct-rating-explorer}}

## The observation

Hang a long casing string in a well and the top of it is in heavy tension, because everything below is hanging off it. Now evacuate the inside and the same joint is also in external pressure.

The joint collapses at a LOWER external pressure than its published rating, and the reason is that the published rating assumed no axial load.

## Why

Collapse of a thick pipe is a yielding problem, and yielding is governed by the combination of all the stresses acting at once, not by any of them separately.

The wall of a pipe under external pressure carries a compressive hoop stress. Add an axial tension and the wall now carries two stresses at right angles with opposite signs, which is the worst combination for a yield criterion: the difference between the principal stresses is what drives yielding, and pulling one up while pushing the other down widens that difference.

So less external pressure is needed to reach the criterion.

## How API handles it

Not by rewriting the four collapse formulas. By computing an AXIAL-ADJUSTED yield strength and feeding that to the same four formulas unchanged.

That is a pragmatic move rather than a derivation, and it has one consequence that this module and the next are built on: anything the formulas do not do with the yield strength, they will not do with the adjusted one either.

## The size of it

The 9-5/8 inch 47 lb/ft joint at P-110 rates 36517506.40324334 Pa in collapse with no axial load. At forty percent of its yield in tension it rates 32996668.340731632 Pa, a loss of about 9.6 percent.

The same joint at K-55 loses about 17.6 percent over the same span, which is nearly twice as much. The weaker grade is hurt more.

## Where it bites in a real string

At the top, where the tension is highest. And the top of the string is also where the collapse load is usually LOWEST, because there is less mud head outside.

So the two effects work against each other along the string, and finding out which wins is a calculation rather than an argument. The next tier does exactly that calculation.

## Exercise

Read the collapse of the 9-5/8 inch 53.5 lb/ft joint at L-80 with no tension, and again at forty percent of yield.

Express the loss as a percentage. Then do the same for the 20 inch 94 lb/ft joint at K-55 and note that the answer is not what you expect.
