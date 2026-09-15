# Null is not zero

An index of 0.000000 is a measurement and an index of none is an absence, and the engine reports the two differently on purpose.

{{panel:ec-value-explorer}}

## The same column, two kinds of answer

| case | planned value | earned value | actual cost | SPI | CPI |
| --- | --- | --- | --- | --- | --- |
| no actuals and no progress | 50 | 0 | 0 | 0.000000 | none |
| tasks without costs | none | 0 | 20 | none | 0.000000 |
| empty task list | none | 0 | 0 | none | none |
| over budget and behind | 2000 | 1200 | 2500 | 0.600000 | 0.480000 |

A schedule index of 0.000000 says a plan asked for 50 and nothing was earned against it. A schedule index of none says there is no plan to ask anything. A reader who collapses the two has turned a project with no schedule into a project that is failing its schedule, or the other way round, and the action each calls for is different.

## Where nulls come from

Every null in earned value comes from a missing denominator or a missing basis. There is no planned value when no task is costed, and the engine says "no costed task, so there is no planned value". There is no planned value when a costed task carries no window, and the engine says "1 costed task carries no planned dates, so planned value cannot be time-phased". When the phasing did work, the engine still states what it did: "planned value time-phased to the as-of date".

The basis line is the point. A null with a stated reason is a finding somebody can act on. A blank cell is an invitation to guess.

## The default that used to fill them

An index with no denominator used to be reported as a clean one and labelled under budget. The ratio was invented, the label was a compliment, and both appeared on projects where the engine had nothing to work with. The repair replaced the invented ratio with a null and a sentence.

## The same rule elsewhere in the studio

The schedule engine returns a span of null for an activity whose dates it cannot read, while an empty schedule returns 0, because zero activities really do span zero days. The economics engine reports no rate of return when the cash flow has no root in the band it searches, and names which of no-sign-change, above-clamp, multiple-roots and no-root happened. A rate of -36.6747 percent is a different answer again: a real, measured, bad number.

## The mistake

The mistake is arithmetic on a null. A portfolio roll-up that averages schedule indexes across projects, treating every none as zero, drags the average down with projects that were never costed. Treating every none as one does the opposite and hides them. Neither average means anything, because the missing entries were never measurements.

The second mistake is reading a zero as a null. A cost index of 0.000000 against an actual cost of 20 is a real result: money was spent and no budgeted work came back. That is a finding to chase, and a reader who files it under "no data" has thrown away the report's most useful line.

## Exercise

For the four rows in the table, say for each of the schedule index and the cost index whether it is a measurement or an absence, and why. Then write the two basis sentences the engine states when there is no planned value, and explain what each one tells somebody to go and fix.
