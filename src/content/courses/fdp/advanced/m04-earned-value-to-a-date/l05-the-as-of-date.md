# The as-of date

Every earned value figure the engine reports is a measurement taken at a date somebody supplied, and on ODUDU-2 five supplied dates produce schedule indexes of none, 2.437529, 0.821326, 0.439389 and 0.261250.

{{panel:ec-value-explorer}}

## A parameter, not a clock

The as-of date is an input to the calculation in the same way the planned costs are. It is not read from the machine the report is running on. That is what makes the figure on a screen and the figure in a report saved last month the same measurement when they carry the same date, and a different measurement when they do not.

| as of | planned value | earned value | actual cost | SPI | CPI |
| --- | --- | --- | --- | --- | --- |
| 2028-01-01 | 0 | 8360000 | 8140000 | none | 1.027027 |
| 2028-06-30 | 3429703 | 8360000 | 8140000 | 2.437529 | 1.027027 |
| 2028-12-31 | 10178668 | 8360000 | 8140000 | 0.821326 | 1.027027 |
| 2029-06-30 | 19026406 | 8360000 | 8140000 | 0.439389 | 1.027027 |
| 2031-01-01 | 32000000 | 8360000 | 8140000 | 0.261250 | 1.027027 |

## What the date does and does not touch

Earned value and actual cost are unmoved across all five rows, because they come from the progress and spending typed against each task. Planned value is the only figure the date reaches, and through it the schedule index. The cost index of 1.027027 is the same on every row.

So on this project the entire movement of the schedule index from 2.437529 down to 0.261250 is the calendar moving, with no work done and no money spent in between. Read that way, the column is a statement about the plan, not about the team.

## What the engine refuses

An as-of date it cannot parse is refused by name: ProjectControlsInputError: "asOf is not a valid date: last Friday". No substitution is made and no default date is invented, because a quietly substituted date would make every index on the report unreproducible.

The studio treats dates the same way elsewhere. A date-only string is parsed as local midnight, since reading it as UTC midnight puts it on the day before anywhere west of Greenwich. A span is counted in whole calendar days rather than by subtracting two timestamps: 30 October to 3 November is 4 days, and it is 4 days in every zone even though a daylight saving change sits inside it.

## Reproducibility

Two reports on the same task list are comparable only when they state their as-of date. ODUDU-2 at 2028-12-31 reports planned value 10178668 and a schedule index of 0.821326, and it will report those figures whenever it is run, this year or in five years, because nothing in the calculation asks what today is.

## The mistake

The mistake is comparing a saved report with a live screen and calling the difference progress. Between 2028-06-30 and 2029-06-30 the schedule index on ODUDU-2 falls from 2.437529 to 0.439389 while earned value stays at 8360000. A reader who assumed both readings were taken today would conclude the project collapsed. The only thing that changed is the date in the parameter.

## Exercise

State the as-of date, the planned value and the schedule index for the row where the index is 2.437529, and for the row where it is 0.439389. Then say which of earned value, actual cost and planned value the as-of date changes, and why a report that omits its as-of date cannot be checked.
