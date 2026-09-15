# Planned value is time-phased

On ODUDU-2 the earned value is 8360000 and the actual cost is 8140000 on every as-of date, while the planned value moves from 0 to 3429703 to 10178668 to 19026406 to 32000000.

{{panel:ec-value-explorer}}

## One project, five planned values

| as of | planned value | earned value | actual cost | SPI |
| --- | --- | --- | --- | --- |
| 2028-01-01 | 0 | 8360000 | 8140000 | none |
| 2028-06-30 | 3429703 | 8360000 | 8140000 | 2.437529 |
| 2028-12-31 | 10178668 | 8360000 | 8140000 | 0.821326 |
| 2029-06-30 | 19026406 | 8360000 | 8140000 | 0.439389 |
| 2031-01-01 | 32000000 | 8360000 | 8140000 | 0.261250 |

Nothing about the work changed across those rows. The task list, the spending and the progress are identical. Only the date the question was asked moved, and the schedule index went from nothing at all to 2.437529 and down to 0.261250.

## How the phasing is done

Each costed task carries a planned window, and its budget is spread across that window and then cut off at the as-of date. Front end engineering runs 2028-01-10 to 2028-06-30, Detailed design 2028-05-01 to 2029-02-28, Procurement 2028-08-01 to 2029-07-31, Fabrication 2029-03-01 to 2030-04-30 and Commissioning 2030-05-01 to 2030-10-31. The engine states the basis it used in words: "planned value time-phased to the as-of date".

At 2028-01-01 no window has opened, so nothing was scheduled to be earned and the planned value is 0. At 2031-01-01 every window has closed, so the whole budget of 32000000 was scheduled and the planned value equals the budget at completion.

## Why that makes the index mean early or late

A denominator that grows with the calendar is what turns a ratio into a measure of schedule. At 2028-06-30 the plan had only asked for 3429703 and 8360000 had been earned, which is 2.437529 and reads early. Six months later the plan had asked for 10178668, more than had been earned, and the same 8360000 reads 0.821326 and late. The project did not slow down between those two rows. The plan's own demand rose past the work.

Three published cases show the phasing on a single window. Half way through a window with half the work done gives planned value 500, earned value 500 and an index of 1.000000. Half way through with a quarter done gives planned value 500, earned value 250 and 0.500000. Two windows that do not overlap, read at 2026-07-01, give planned value 600 against earned value 600 and 1.000000.

## The two edges

Before anything is scheduled there is no denominator. A published case read at 2025-12-31, before the first window opens, reports planned value 0, earned value 0, no schedule index and no cost index. After the last window closes the denominator stops moving: a case read at 2027-06-30 reports the whole planned value of 1000 against an earned value of 600 and an index of 0.600000.

## The mistake

The mistake is treating the planned value as a property of the project rather than of the date. A status pack that quotes 10178668 without quoting 2028-12-31 has published a number nobody can reproduce, because 3429703 and 19026406 are just as true of the same plan. Planned value, and the schedule index built on it, are always a pair of a project and a date.

## Exercise

Write the planned value and the schedule index for all five as-of dates, and state what changed in the work between 2028-06-30 and 2028-12-31. Then say why the planned value at 2031-01-01 is 32000000, and what that makes the schedule index equal to on that row.
