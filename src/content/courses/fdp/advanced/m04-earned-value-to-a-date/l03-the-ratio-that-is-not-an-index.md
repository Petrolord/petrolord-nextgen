# The ratio that is not an index

On ODUDU-2 the completion ratio is 0.261250 on every as-of date, while the schedule index reads none, 2.437529, 0.821326, 0.439389 and 0.261250 on the same five dates.

{{panel:ec-value-explorer}}

## Two ratios with the same numerator

| as of | planned value | earned value | SPI | completion ratio |
| --- | --- | --- | --- | --- |
| 2028-01-01 | 0 | 8360000 | none | 0.261250 |
| 2028-06-30 | 3429703 | 8360000 | 2.437529 | 0.261250 |
| 2028-12-31 | 10178668 | 8360000 | 0.821326 | 0.261250 |
| 2029-06-30 | 19026406 | 8360000 | 0.439389 | 0.261250 |
| 2031-01-01 | 32000000 | 8360000 | 0.261250 | 0.261250 |

The completion ratio is earned value over the budget at completion: 8360000 over 32000000, which is 0.261250. The schedule index is earned value over planned value. The numerator is the same figure in both. The denominators are not the same kind of thing.

## A denominator that never moves

The budget at completion is a property of the task list. Add up 2400000, 5200000, 8600000, 12500000 and 3300000 and you have 32000000, and no date changes it. So the completion ratio answers one question: how much of the whole job, measured in money, has been earned. It is a progress figure and it is honest as one.

The planned value is a property of the task list and a date together. That is the whole difference, and it is why one of these two numbers can say early or late and the other cannot.

## What the app used to report

Before this course's repair the app printed the completion ratio and called it SPI. The consequence is exact: a project half finished on time and a project half finished a year late both read 0.500000, because the denominator carried no information about when the work was supposed to happen. The label said schedule and the arithmetic never looked at a calendar.

## The one date where they agree

At 2031-01-01 the planned value is 32000000, which is the budget at completion, so the schedule index and the completion ratio both read 0.261250. That agreement is not a reassurance. It happens only because every planned window has closed by then, which means the plan has run out of time to schedule anything, and the index has stopped being able to say early. On every earlier row the two disagree, and on 2028-06-30 they disagree by a wide margin: 2.437529 against 0.261250.

## The mistake

The mistake is reading 0.261250 as a schedule verdict. It is a true statement that a quarter or so of the budget has been earned, and it is silent on whether that is ahead of plan or behind it. On 2028-06-30 the honest schedule reading of that same project is 2.437529, which is early, and on 2029-06-30 it is 0.439389, which is well behind. A single ratio that reads 0.261250 in both situations is measuring the size of the job, not the pace of it.

The second mistake is expecting stability. The cost index of 1.027027 stands on all five rows too, because earned value and actual cost are both to-date figures and neither is phased. A stable cost index is expected here. A stable schedule index is a symptom.

## Exercise

State the completion ratio and the schedule index at 2028-06-30 and at 2029-06-30, and name the denominator of each. Then explain why the two numbers meet at 0.261250 at 2031-01-01, and why that meeting is not evidence that the project finished.
