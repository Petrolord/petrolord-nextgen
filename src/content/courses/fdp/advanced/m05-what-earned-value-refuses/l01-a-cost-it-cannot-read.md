# A cost it cannot read

A planned cost pasted with its currency symbol is refused by name: ProjectControlsInputError: "Rig move: planned cost is not a number: $1,200".

{{panel:ec-value-explorer}}

## The refusals on a cost

| what was typed | the engine's message |
| --- | --- |
| a cost pasted with its currency symbol | "Rig move: planned cost is not a number: $1,200" |
| a negative planned cost | "Credit: planned cost may not be negative: -100" |
| a negative actual cost | "Refund: actual cost may not be negative: -20" |
| an unreadable cost on an unnamed task | "task 1: planned cost is not a number: abc" |

Each message names the task, names the field and quotes back the text it could not read. The last has no task name, so it refuses by position instead, which is enough to find the row.

## Why a refusal beats a zero

Before this course's repair a figure the parser could not read counted as zero, with nothing on the screen to say so. The task kept its name and its dates and contributed nothing to the planned value, the earned value or the budget at completion.

That is worse than a blank, because every number downstream still prints. The budget at completion is the sum of the planned costs, so on ODUDU-2, where they run 2400000, 5200000, 8600000, 12500000 and 3300000 to make 32000000, a Procurement figure of 8600000 read as zero leaves the denominator of the completion ratio short by 8600000. It takes something out of the numerator too, which is the half most readers forget: Procurement is 30.0000 percent complete, so it had already earned 2580000 of the 8360000. The ratio moves to 0.247009, down from 0.261250, and nothing says a task lost its money.

Which way it moves depends on the task, so direction is no help in finding the fault. The ratio rises only when the dropped task's progress is below the project's own. Fabrication is at 0.0000 percent, so zeroing its 12500000 leaves the numerator alone and the ratio rises to 0.428718. Procurement, above 0.261250, falls instead.

## What it does to the schedule index

Planned value is time-phased from each task's budget across its own window. Procurement runs 2028-08-01 to 2029-07-31, so at 2028-12-31 part of its 8600000 sits inside the planned value of 10178668. A cost read as zero takes that contribution out, shrinks the denominator and raises the schedule index from 0.821326 to 0.877425, for no reason visible on the report. Fabrication's window opens 2029-03-01, after the as-of date, so the same fault leaves the index untouched.

## The shape of the guard

The guard is on readability and on sign, and nothing else. A cost of 0 is a number somebody typed and it is accepted: Fabrication and Commissioning carry actual costs of 0 and the engine is content. A negative cost is refused, because a negative budget has no meaning.

## The mistake

The mistake is pasting a column out of a spreadsheet with its formatting attached. Thousands separators, currency symbols and trailing spaces all arrive as text. The engine now names the task and the figure, so the fix takes a minute. When it quietly read zero, the same paste produced a report whose indexes were arithmetically correct on a task list missing money, and correct arithmetic on wrong inputs is the hardest error to find.

## Exercise

Write the four refusal messages and say, for each, what the engine would have reported before it refused. Then explain why a Procurement cost read as zero lowers the completion ratio to 0.247009 while the same fault on Fabrication raises it to 0.428718, and what that means for anyone hoping to spot the fault by the direction the number moved.
