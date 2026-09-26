# What cost recovery is not

Cost recovery looks like three familiar things and is none of them. Each mistaken identity puts a wrong number in a different column.

{{panel:ec-instrument-explorer}}

## It is not a tax deduction

The tax base in this model is the contractor's profit share, and nothing else. Cost recovered is added to the contractor's cash separately and never enters the base. No share of opex is subtracted from the base either.

The consequence is measurable. On the Suite test project, tightening the limit raises the tax bill:

| case | total cost recovered | total profit oil | total tax | closing pool |
| --- | --- | --- | --- | --- |
| capped_5pct_pool_never_clears | 306.3022 | 5819.7423 | 1745.9227 | 2543.7575 |
| flat_test_project | 2770.6665 | 3355.3781 | 1006.6134 | 79.3932 |

Recovering 306.3022 instead of 2770.6665 leaves 5819.7423 of profit oil rather than 3355.3781, and the tax follows the profit oil to 1745.9227. If cost recovery were a deduction, less recovery would mean a smaller base. It means a larger one.

## It is not depreciation

There is no capital allowance, no life, no method and no schedule. Capex enters the pool whole in the year it is spent and leaves when revenue after royalty makes room. On the Designer's default project at limits of 80, 90 and 100 percent the total cost recovered over the life is 941.4436 million USD, which is exactly the life's opex total of 441.4436 and capex total of 500.0000 taken together. Every dollar comes back, and the only question the limit answers is when.

## It is not a loss carryforward

An unrecovered balance is a claim on future revenue after royalty and nothing more. It is not a tax attribute, so it cannot shelter a later year's profit share. The tax stack has no loss carryforward of its own either: a year whose base is negative pays nothing and passes nothing to the next year.

## The mistake

The compound error is to net cost recovery against tax, which double counts the same cost. A reader who deducts recovered cost from the profit share before applying corporate income tax will produce a tax smaller than every published figure and a contractor position better than any of them. The tell is that the tax total falls when the cost recovery limit falls, which is the opposite of what the engine does.

## What it refuses

There is no ring fence and no consolidation, so nothing separates cost pools or lets one project's spend reach another's revenue. A regime whose real burden lives in an instrument the four fields cannot express, an education tax or a capital allowance, cannot be modelled here, and the answer is not to bend the cost recovery limit until the total looks right.

## Exercise

Say which of the two published cases pays more tax and why, given that the higher-tax case recovered less cost. Then say what the total cost recovered of 941.4436 on the default project is made of, and why the 80, 90 and 100 percent limits all reach it.
