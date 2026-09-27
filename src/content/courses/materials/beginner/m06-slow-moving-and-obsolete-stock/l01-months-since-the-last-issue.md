# Months since the last issue

{{panel:materials-register-calculator}}

Every register collects stock that has stopped moving: spares for equipment that was replaced, a batch of kits bought for a job that never happened, a controller model the vendor has stopped making. That stock still costs money to hold, and its value on the books may have stopped being real. The last module of this tier asks how to find it, how to band it and how much to write it down.

## One measure: time since the last issue

The engine's first measure is the number of months since the item was last issued from the store. It is a plain, stated figure in the register, and it says how long the stock has been sitting untouched. On the Ekene register, CHK-BEAN was issued a month ago, GASKET-RJ 24 months ago and HEAT-TRC 40 months ago.

## Bands with minimums

A policy sorts items into bands by that measure. Each band has a label, a minimum number of months since the last issue and a write-down percentage. An item takes the last band whose minimum it has reached. The Ekene policy states four bands:

| band | from months since the last issue | write-down, percent |
| --- | --- | --- |
| active | 0 | 0 |
| slow | 12 | 25 |
| very slow | 24 | 50 |
| obsolete | 36 | 100 |

So in the Ekene policy "slow" means 12 months or more since the last issue, and "obsolete" means 36 months or more. The words carry only the meaning the policy gives them: another operator's slow band could start at 6 months or at 18.

## Reached at or above

What of an item exactly on a minimum? The engine's stated choice is that a band minimum is reached at or above it. CEM-G has gone exactly 12 months without an issue, and it is band slow. On a stated case of boundary items with the same bands, an item at 12 months is slow and one at 11.99 months is active. The alternative a policy could state is a minimum reached only strictly above it, which would keep CEM-G active; the engine names its choice in its basis, and no graded figure in this course moves under the alternative.

## Where the idea comes from

The engine's basis for slow-moving stock says the bands, the write-down percentages and the cover limit are the caller's stated policy, and cites lecture 13 slide 13 of the MIT course, which uses days of supply to find dead stock. The next lessons take up the write-down and that second measure, cover.

## A figure that must be stated

Every item needs its months since the last issue. Leave it out and the engine refuses by name, with the value printed as undefined:

> items[0].monthsSinceLastIssue must be a finite number at or above 0; got undefined

## Exercise

Open the register calculator, set the View to "Slow-moving and obsolete stock" and start from "The Ekene register, its stated bands". List every item that is not in band active, with its months since the last issue and its band. Then start from "The band and cover boundaries" and copy the bands of AT12 and BELOW12. Last, return to the Ekene start and change the band 2 from-months control from 12 to 13, and say which item changes band.
