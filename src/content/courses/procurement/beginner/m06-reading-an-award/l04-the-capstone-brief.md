# The capstone brief

{{panel:pr-envelope-calculator}}

The Associate capstone asks you to evaluate a two-envelope tender from end to end, by the rules of this tier, in the envelope calculator. The tender is synthetic and is its own: its bids, scope, prices and settings appear in no lesson and in none of the Ekene files. This lesson tells you what the capstone gives you, what it states, what it grades and how to work it.

## What you are given

One case file comes with the capstone and is offered on the capstone card. It carries the criteria, each with an id, a weight and a maxScore, and for each bid its receipt time, mandatory requirements, scores, priced bill lines (quantity, unit rate, quoted amount, and a decimalMisplaced flag where the evaluator recorded one), discount, priced deviations, omitted items and completion weeks. It is written in the same shape the envelope calculator reads.

## What the capstone states

Every setting a figure depends on is stated: the pass mark; the arithmetic tolerance at the engine default; an omitted item priced at the average of the corrected amounts the other responsive bids quote; a completion schedule with minWeeks, maxWeeks and ratePerWeek, no credit for earlier completion and rejection beyond maxWeeks; and a combined award at a stated technical weight, with the lowest-ratio commercial score and the relative technical score. Ties go to the lower evaluated cost, then the earlier receipt, then the bidder id.

## What is graded

Six quantities, each a value the engine returns on the case file:

| graded quantity | where you meet it | view |
| --- | --- | --- |
| a technical percentage | module 2 | The technical envelope |
| a corrected price | module 3 | Arithmetic correction of a bill |
| an omission priced at the average | module 4 | Evaluated cost of the passing bids |
| an evaluated cost | module 4 | Evaluated cost of the passing bids |
| a commercial score | module 5 | The combined score |
| the top combined score | modules 5 and 6 | The combined score |

Enter each to six decimals, as the panel prints it. The grading tolerance is set by the course in one place; you never need to guess it.

## How to work it

Work in stage order, as the engine does. First, the mandatory requirements and the pass mark: note who is excluded and whether any bid sits exactly on the mark. Second, correct each passing bid's bill, checking every line for a recorded decimalMisplaced flag. Third, build the evaluated costs, pricing any omission from the other responsive bids only and applying the schedule to the corrected price less the discount. Fourth, score and weight. Then run the whole tender in one call as a check: its award and exclusions must agree with your stage-by-stage work.

## The traps this tier has shown you

A bid on the pass mark passes. A failed bid's prices never reach another bid's omission. A recorded misplaced decimal point leaves the amount standing. A discount lowers the base of the completion adjustment. The commercial score is built from the evaluated cost. Each of these moved a figure on the Ekene tenders, and each can move one here.

## Exercise

Before opening the case file, rehearse on the Ekene well services tender. In the envelope calculator, work through the views in the order of the table above and write down, for WS3, its technical percentage, its corrected price, its omission, its evaluated cost, its commercial score and the top combined score. Check each against the lessons of modules 2 to 5. Then run "The whole tender in one call" and confirm that the award and the exclusions agree with your work.
