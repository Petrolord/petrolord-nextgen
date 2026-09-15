# A project with no costs

A project with no costed task at all reports no schedule index, no cost index and no percent complete, and states the basis: "no costed task, so there is no planned value".

{{panel:ec-value-explorer}}

## Nothing to divide by

Every earned value figure is a ratio of money to money. Strip the costs out of a task list and there is no money on either side. The earned value of a task is its budget taken at its progress, so with no budget it is nothing at all, and the budget at completion is a sum of no numbers.

A published empty task list, read at 2026-07-02, reports no planned value, earned value 0, actual cost 0, no schedule index and no cost index. The engine reports the absence in words rather than leaving a blank cell, so the reason travels with the report.

## What used to appear instead

An index with no denominator used to be reported as a clean one and printed under a heading saying the project was under budget. That is the most dangerous possible default, because a ratio of one is what a perfectly run project earns. A project that had not been costed and a project delivering exactly to plan printed the same card, and the one with no numbers in it printed the more reassuring label.

## Zero is a measurement

| case | planned value | earned value | actual cost | SPI | CPI |
| --- | --- | --- | --- | --- | --- |
| tasks without costs | none | 0 | 20 | none | 0.000000 |
| no actuals but progress | 50 | 40 | 0 | 0.800000 | none |
| no actuals and no progress | 50 | 0 | 0 | 0.000000 | none |
| empty task list | none | 0 | 0 | none | none |

The first row has spending of 20 against tasks nobody budgeted. Its cost index is 0.000000, which is a real number: earned value of 0 divided by an actual cost of 20. Money went out and no budgeted work came back. Its schedule index is none, because there is no planned value to divide by.

The third row is the mirror image. Its schedule index is 0.000000, a real measurement of a project that has earned nothing against a plan that asked for 50, and its cost index is none because nothing has been spent.

## Reading the pair

A number and an absence are different findings and they call for different actions. A cost index of 0.000000 is a result to investigate. A cost index of none is a gap in the input to fill.

## The mistake

The mistake is treating a blank index as a pass. A status pack whose schedule and cost columns are empty has not reported a healthy project, it has reported that the project cannot be measured, and on a project with no costed task that is exactly what the engine says in the basis line.

The second mistake is entering a nominal cost so the report will fill. A made-up budget produces an earned value, a planned value and two indexes, all arithmetically correct and all measuring the made-up budget.

## Exercise

Write the basis the engine states for a project with no costed task, and say which three outputs it withholds. Then take the published rows for tasks without costs and for no actuals and no progress, and explain why one reports a cost index of 0.000000 and the other reports none.
