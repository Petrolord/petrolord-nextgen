# Both sides of every boundary

A band that misclassifies its own edge is a defect, and the only way to know it does not is to ask it on both sides of every boundary it has. Here is the whole range, walked.

{{panel:fc-pump-explorer}}

| flow gpm | percent of BEP | region | preferred | note present |
| --- | --- | --- | --- | --- |
| 345.000000 | 30.000000 | outside | false | true |
| 573.850000 | 49.900000 | outside | false | true |
| 575.000000 | 50.000000 | allowable, low | false | true |
| 690.000000 | 60.000000 | allowable, low | false | true |
| 803.850000 | 69.900000 | allowable, low | false | true |
| 805.000000 | 70.000000 | preferred | true | false |
| 977.500000 | 85.000000 | preferred | true | false |
| 1150.000000 | 100.000000 | preferred | true | false |
| 1322.500000 | 115.000000 | preferred | true | false |
| 1380.000000 | 120.000000 | preferred | true | false |
| 1381.150000 | 120.100000 | allowable, high | false | true |
| 1495.000000 | 130.000000 | allowable, high | false | true |
| 1610.000000 | 140.000000 | allowable, high | false | true |
| 1611.150000 | 140.100000 | outside | false | true |
| 1840.000000 | 160.000000 | outside | false | true |

## The four pairs

Read them in pairs. 49.900000 percent is outside and 50.000000 percent is allowable, low. 69.900000 percent is allowable, low and 70.000000 percent is preferred. 120.000000 percent is preferred and 120.100000 percent is allowable, high. 140.000000 percent is allowable, high and 140.100000 percent is outside.

Every boundary is crossed exactly where the band definition says it should be, and in every case the boundary value itself is given to the better of the two bands. A duty at exactly 70.000000 percent is preferred. A duty at exactly 140.000000 percent is still allowable.

## Why walking the edges is the test that counts

A band table that is asked only at 30, 60, 85 and 130 percent will look correct however its comparisons are written. A comparison written with the wrong kind of inequality misclassifies one value, the boundary value itself, and behaves perfectly at every other flow. That is a defect which hides everywhere except at the edge.

So the table pairs each boundary with a point one tenth of a percent outside it. 50.000000 percent is asked beside 49.900000, and 120.000000 percent is asked beside 120.100000. Four boundaries, four pairs, and each pair pins down which side of the comparison the boundary value falls on.

Notice also that a row sitting exactly on a boundary is not a hypothetical. A station designed to run at its best efficiency flow, then derated, lands on round percentages more often than chance would suggest, and a boundary that is ambiguous produces two different verdicts on two runs of the same case.

## What the table is worth as evidence

It is worth saying plainly what this proves and what it does not. It proves that the classifier assigns these fifteen flows to these fifteen labels, and that the four boundaries behave consistently. It says nothing at all about whether 50, 70, 120 and 140 are the right places for the boundaries to be, which is the question held for literature in the previous lesson. A correct implementation of a convention is still an implementation of a convention.

## Where the rule is consistent

The same pattern holds at both ends: the value on the boundary is treated as belonging to the band that is nearer to best efficiency flow. One rule, applied four times, and no exceptions in the table.

## The mistake

Testing a classifier only in the middle of its bands. The middle is where every implementation agrees. The edges are where they differ, and the edges are where a real duty quite often sits.

## Exercise

Give the region either side of each of the four boundaries, using the percentages in the table. Then say which band a value sitting exactly on a boundary is given to, and explain why a test at 60 and 130 percent alone would not have found an error at 70 percent.
