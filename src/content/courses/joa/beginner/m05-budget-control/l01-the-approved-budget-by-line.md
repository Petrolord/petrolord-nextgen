# The approved budget by line

{{panel:joa-account-calculator}}

The parties do not hand the operator a blank cheque. Each year the committee approves a work programme and a budget, line by line, and the operator spends inside it. At the end of the year, or at any point in it, the actual spending on each line can be set against the approved figure. This module computes that comparison and the tolerances the agreement allows.

## Lines, approved and actual

A budget line, an item in the engine's words, has a name, an approved amount and an actual amount. The engine computes the overrun of each item as actual less approved, and the overrun percent as that overrun over the approved amount. A negative overrun is an underrun: the line spent less than approved.

## The Ekene 2027 budget

The Ekene fixture states a budget of six items for 2027. The engine returns:

| item | approved | actual | overrun | overrun percent |
| --- | --- | --- | --- | --- |
| geology and geophysics | 6000000.000000 | 6600000.000000 | 600000.000000 | 10.000000 |
| exploration drilling | 48000000.000000 | 53500000.000000 | 5500000.000000 | 11.458333 |
| facilities engineering | 10000000.000000 | 9200000.000000 | -800000.000000 | -8.000000 |
| operations support | 8000000.000000 | 8300000.000000 | 300000.000000 | 3.750000 |
| general and administration | 4000000.000000 | 4100000.000000 | 100000.000000 | 2.500000 |
| environmental baseline survey | 0.000000 | 250000.000000 | 250000.000000 | none |

For the budget as a whole the engine returns an approved total of 76000000.000000, an actual total of 81950000.000000 and an overrun of 5950000.000000.

Three lines deserve a second look. Facilities engineering underran by 8.000000 percent. Exploration drilling, the largest line, overran by 11.458333 percent. And the environmental baseline survey had no approved budget at all, so its overrun percent is none: a percentage of zero approved is not a number. The last lesson of this module takes up such unbudgeted items.

## What the lines are for

Budget control answers two questions for the parties. Was each line spent within what the operator may overspend on its own authority? And was the budget as a whole? The next two lessons compute each against a stated tolerance. Neither question changes what a party pays: the actual spending is charged to the joint account either way, and the cash calls already split it on the paying interests. What a breach triggers is a matter for the agreement and the committee.

## What the engine asks of the items

Each item needs a name no other item has, because the reasons name items by their names:

> items[1].item must be a name no other item has; got "x"

And each block reads only the keys it knows. The budget tolerance reads `pct` and `amount`, so a shortened key is refused with the list of the right ones:

> budgetTolerance.amt is not an accepted key; the accepted keys of budgetTolerance are pct, amount

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Budget control". Start from "The Ekene 2027 budget" and run it. Check the overrun of each line in the table against actual less approved, and check the three tiles for the approved total, the actual total and the overrun. Then rename the second item to "geology and geophysics" and read the refusal. Finally, restore it and write down which lines underran.
