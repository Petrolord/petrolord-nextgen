# Progress weighted by budget

Earned value is the budget of the work done: each line's budget times its progress, added across the AFE. It turns a set of typed percentages into one amount of money that can be set beside what was spent.

{{panel:ec-cost-explorer}}

## OFON-1 line by line

| code | budget | progress percent | earned value (budget x progress) | actual |
| --- | --- | --- | --- | --- |
| DRL-01 | 14200000 | 72.0000 | 10224000 (derived) | 9800000 |
| CSG-02 | 3900000 | 100.0000 | 3900000 (derived) | 4300000 |
| CMT-03 | 1250000 | 55.0000 | 687500 (derived) | 640000 |
| LOG-04 | 2100000 | 20.0000 | 420000 (derived) | 350000 |
| CMP-05 | 5600000 | 0.0000 | 0 (derived) | 0 |

DRL-01 at 72.0000 percent of 14200000 earns 10224000. Adding the lines, 10224000 + 3900000 + 687500 + 420000 + 0 = 15231500, which is the engine's earned value. Divided by the budget of 27050000 it gives the engine's percent complete, 56.3087 percent.

## Why the budget does the weighting

A percent on its own says nothing about size. CMT-03 at 55.0000 percent and DRL-01 at 72.0000 percent look like similar lines on a progress report, yet CMT-03 earns 687500 and DRL-01 earns 10224000. Weighting by budget lets the big lines count for what they cost. The drilling line alone supplies 10224000 of the 15231500, so the AFE's percent complete is mostly a statement about drilling.

The budget is the weight, never the actual. CSG-02 is 100.0000 percent complete and earns its budget of 3900000, though it spent 4300000. Earned value pays each line what the work was authorised to cost, which is exactly what makes it useful against spend.

## Two published cases

"suite test: weighted earned value" returns an earned value of 110.0000 from its lines, the budget-weighted sum. "progress beyond 100 percent earns beyond the budget" returns an earned value of 150.0000 against actuals of 90.0000: a progress figure past 100 percent is accepted, and the line earns more than the budget it was given.

## What it refuses

Earned value is only as good as the progress typed in. The engine does not measure metres drilled, joints run or stages completed; it reads a percentage someone entered and multiplies. It refuses a negative progress figure outright, naming the line, as the message of one published case shows: "Cost item "CMP-02" has negative progress (-20 percent). Progress runs from 0 to 100 percent." It does not refuse progress past 100 percent, although its own message states that range, and a line entered that way earns past its budget. It also does not check progress against spend: CMP-05 could be typed at 100.0000 percent with an actual of 0, and it would earn 5600000.

## The mistake

The first mistake is averaging the five progress figures without weights. That gives CMT-03's 55.0000 percent the same vote as DRL-01's 72.0000 percent and treats a 1250000 cementing line as the equal of a 14200000 drilling line. The engine's 56.3087 percent is weighted; an unweighted average of the same five figures is a different number, and it describes nothing the AFE contains. The second mistake is believing the progress because the arithmetic is exact. 10224000 is exact to the dollar and no more certain than the 72.0000 percent it came from.

## Exercise

Compute earned value for each OFON-1 line, add them to the AFE's earned value, and divide by the budget to reach percent complete. Then say what CSG-02 earns and what it spent, and explain why a line typed at 100.0000 percent with nothing spent would still earn its whole budget.
