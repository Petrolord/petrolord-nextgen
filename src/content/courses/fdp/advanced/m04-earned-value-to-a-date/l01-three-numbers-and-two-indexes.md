# Three numbers and two indexes

Earned value carries three figures and two ratios built out of them, and on ODUDU-2 at 2028-12-31 those five read 10178668, 8360000, 8140000, 0.821326 and 1.027027.

{{panel:ec-value-explorer}}

## The three numbers

Planned value is the money the plan had scheduled to be earned by the as-of date. Earned value is the budget of the work that has actually been done. Actual cost is what has been spent. All three are money, all three are measured to the same date, and none of them is a percentage.

| task | planned cost | actual cost | percent complete |
| --- | --- | --- | --- |
| Front end engineering | 2400000 | 2510000 | 100.0000 |
| Detailed design | 5200000 | 3180000 | 65.0000 |
| Procurement | 8600000 | 2450000 | 30.0000 |
| Fabrication | 12500000 | 0 | 0.0000 |
| Commissioning | 3300000 | 0 | 0.0000 |

## Earned value by hand

Earned value is each task's own budget taken at that task's own progress, then summed. Front end engineering at 100.0000 percent earns the whole of 2400000. Detailed design at 65.0000 percent of 5200000 earns 3380000. Procurement at 30.0000 percent of 8600000 earns 2580000. Fabrication and Commissioning stand at 0.0000 percent and earn nothing. Those add to 8360000.

Actual cost is the spending column added: 2510000 and 3180000 and 2450000 come to 8140000. Every planned cost added gives the budget at completion, 32000000.

## The cost index

The cost index is earned value over actual cost. Here that is 8360000 over 8140000, which is 1.027027. It reads above one, so the work that has been done was bought for slightly less than the budget attached to it. Nothing in that number is about time. Detailed design has spent 3180000 against a budget of 5200000, and the index says nothing about whether it should have spent more by now.

## The schedule index

The schedule index is earned value over planned value. Here that is 8360000 over 10178668, which is 0.821326. It reads below one, so less has been earned than the plan had scheduled for this date. The two indexes share a numerator and disagree, because ODUDU-2 at that date is cheap and late at once.

## The mistake

The mistake is reading one denominator as the other. A published three task case reports planned value 1750, earned value 1500, actual cost 1450, a schedule index of 0.857143 and a cost index of 1.034483. One earned value of 1500 divided by two different denominators gives two different answers, one about money and one about time, and a report that quotes a single index has answered only one of the two questions.

The other mistake is expecting an index to exist. The engine reports a cost index only when there is an actual cost to divide by: a published case with progress but no spending at all reports planned value 50, earned value 40, a schedule index of 0.800000 and no cost index.

## Exercise

Build the earned value of 8360000 from the task table, one task at a time, and then build the actual cost of 8140000 and the budget at completion of 32000000. State which of those three numbers is the denominator of the cost index and which is the denominator of the completion ratio, and say why 1.027027 and 0.821326 can stand on the same date without contradicting each other.
