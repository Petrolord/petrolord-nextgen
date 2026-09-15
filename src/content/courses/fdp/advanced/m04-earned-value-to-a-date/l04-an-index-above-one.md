# An index above one

A single task 90.0000 percent done half way through its own window reports a schedule index of 1.795082 against a completion ratio of 0.900000.

{{panel:ec-value-explorer}}

## Where the two numbers part company

The completion ratio divides earned value by the budget at completion. Earned value can never exceed the budget at completion, because a task cannot be more than 100.0000 percent done and the engine refuses anything higher. So the ratio has a ceiling of one built into its arithmetic.

The schedule index divides earned value by planned value, and planned value at any date before the last window closes is smaller than the budget at completion. Get ahead of that smaller number and the index goes above one. On the single task case that is 1.795082, and the ratio on the same task at the same moment is 0.900000.

## The same effect on a whole project

| as of | planned value | earned value | SPI | completion ratio |
| --- | --- | --- | --- | --- |
| 2028-06-30 | 3429703 | 8360000 | 2.437529 | 0.261250 |
| 2028-12-31 | 10178668 | 8360000 | 0.821326 | 0.261250 |

At 2028-06-30 ODUDU-2 had earned 8360000 against a plan that had only asked for 3429703, and the index is 2.437529. Six months later the plan has asked for 10178668 and the same earned value reads 0.821326. The completion ratio is 0.261250 on both rows and could not have reported the first situation at all.

## What an index above one does not say

It does not say the project will finish early, and it does not say anything about money: the cost index on ODUDU-2 is 1.027027 on both of those dates. It says the work earned to this date is worth more than the plan had scheduled to this date. A published single fully spent task, read at 2026-07-02, reports planned value 50 against earned value 100 and a schedule index of 2.000000, which is work finished before its window closed.

## The mistake

The mistake is capping the number. Clipping anything above one throws away the only reading that distinguishes early work from work exactly on plan, and the old ratio could never exceed one, so a team that had genuinely run ahead had no number that could say so.

The opposite mistake is treating an index above one as slack in hand. An index of 1.795082 half way through a window says the money has been earned early, and the task still has to survive the rest of its window.

## Exercise

Explain, from the two denominators, why a completion ratio can never exceed one and a schedule index can. Then take ODUDU-2 at 2028-06-30 and at 2028-12-31, state the schedule index on each date, and say what happened between them given that the earned value is 8360000 on both.
