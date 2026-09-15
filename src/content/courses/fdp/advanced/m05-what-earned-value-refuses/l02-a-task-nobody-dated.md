# A task nobody dated

Add one costed task with no planned dates to a project and the schedule index becomes none, with the reason stated: "1 costed task carries no planned dates, so planned value cannot be time-phased".

{{panel:ec-value-explorer}}

## One task takes the whole index

Planned value is a sum across tasks, and each term in the sum is that task's budget spread across that task's window and cut at the as-of date. A task with a cost and no window has no term. There is no defensible value to give it, because it could be scheduled anywhere and the budget could belong to any date.

So the engine does not put a zero in the sum. It reports no planned value at all, no schedule index, and a sentence saying how many costed tasks are missing dates. A published case makes the same point on its own: a costed task with no dates, read at 2026-07-02, reports no planned value, an earned value of 500, no actual cost, no schedule index and no cost index.

## What survives

| figure | does it need dates |
| --- | --- |
| earned value | no |
| actual cost | no |
| budget at completion | no |
| completion ratio | no |
| cost index | no |
| planned value | yes |
| schedule index | yes |

The completion ratio still stands at 0.256839 on the project with the undated task added, because earned value and the budget at completion are both sums of money with no calendar in them. The ratio moved at all only because the new task put its cost into the budget at completion while putting nothing into the earned value.

## Why a zero would be a lie

Putting zero in for the undated task would say the plan scheduled none of its money by the as-of date, a claim about the schedule that nobody made. It inflates the schedule index, because the earned value stays where it is and the denominator shrinks, so a team reads a healthier index because a date was missing.

## The neighbouring refusals

A window that runs backwards is refused outright: ProjectControlsInputError: "Backwards: the planned end date is before the planned start date". A window of zero length is accepted and handled: a published zero-length window read at 2026-06-01 reports planned value 0, earned value 100 and no schedule index.

## The mistake

The mistake is fixing the symptom. A schedule index that reads none is not a broken engine, and the fix is not to type a plausible date so the report will fill in. The message says how many costed tasks carry no dates, which is a work instruction: find them and date them from the plan, or take their cost out if they are not in the plan yet.

The second mistake is dating only the tasks that are running. Fabrication runs 2029-03-01 to 2030-04-30 and Commissioning 2030-05-01 to 2030-10-31, both at 0.0000 percent complete, and both still need their windows. A future task with a budget and no dates removes the schedule index from every report the project will ever produce.

## Exercise

State the engine's message for a costed task with no planned dates, and say which of earned value, actual cost, budget at completion, completion ratio, cost index, planned value and schedule index survive it. Then explain why the completion ratio still reports 0.256839 on a project whose schedule index has gone.
