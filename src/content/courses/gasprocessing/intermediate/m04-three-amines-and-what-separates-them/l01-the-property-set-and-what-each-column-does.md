# The property set, and what each column does

The module carries a published property set for three amines. Every column of it is a design consequence rather than a piece of chemistry trivia, and the quickest way to understand the sweetening half is to work out what each column is for.

## The table

| amine | molecular weight | typical strength, wt % | customary rich limit | customary duty, Btu/gal | solution gravity |
| --- | --- | --- | --- | --- | --- |
| MEA | 61.080000 | 18.000000 | 0.350000 | 1100.000000 | 1.010000 |
| DEA | 105.140000 | 28.000000 | 0.400000 | 950.000000 | 1.020000 |
| MDEA | 119.160000 | 45.000000 | 0.500000 | 800.000000 | 1.040000 |

{{panel:fc-absorber-explorer}}

## Where each column lands

The molecular weight turns moles of amine into pounds of amine. It is the one column that is chemistry and nothing else.

The typical strength turns pounds of amine into pounds of solution. It is the default the engine uses when a caller names an amine and no strength, and a caller may type their own.

The rich limit is the customary top of the loading swing. It is offered as the default rich loading, and it is also the value the corrosion warning is measured against.

The duty per gallon prices the regenerator, one multiplication after the circulation is known.

The solution gravity gives the density of the solution. That density is what turns pounds of solution into gallons in the circulation chain, and it is also what a sweetening contactor is sized against.

## What kind of numbers these are

Only the molecular weights are derivable from anything. The strengths, the rich limits, the duties and the gravities are customary practice, and this module is straightforward about that. They are declared constants, exported in one place under their own names, and a gate pins each of them to the value written down. Pinning is all a check can do to a number with no publication behind it in this repository. What pinning buys is that changing one becomes a reviewed act rather than a silent one.

That distinction is worth carrying. A derived number cannot be wrong unless the thing it came from is wrong. A measured one can be checked from outside the engine. A declared one can only be recorded, and a reader who wants to know whether it is right has to go to the literature rather than to this package.

## Reading the table as one object

The three rows are not three interchangeable options with different labels. Each row is a coherent set: an amine at its own strength, loaded to its own limit, regenerated at its own duty, in a solution of its own density. Mixing a column from one row with a column from another describes nothing real, and the rest of this module puts all three rows through the same duty precisely so that the rows stay whole.

## Exercise

Record all five properties for MDEA. Then say which of the five is chemistry and which four are customary, and name the two separate places in an answer where the solution gravity shows up.
