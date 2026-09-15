# Progress outside the range

Progress is refused outside 0 to 100 and refused when it cannot be read: "Overdone: percent complete must be between 0 and 100, not 150", "Back: percent complete must be between 0 and 100, not -10", "Half: percent complete is not a number: half".

{{panel:ec-value-explorer}}

## Why the range is the range

Earned value is a task's budget taken at that task's progress, so progress is the only figure in the calculation that is not money. Both ends of the range are real positions and both are used.

| task | planned cost | percent complete |
| --- | --- | --- |
| Front end engineering | 2400000 | 100.0000 |
| Detailed design | 5200000 | 65.0000 |
| Procurement | 8600000 | 30.0000 |
| Fabrication | 12500000 | 0.0000 |
| Commissioning | 3300000 | 0.0000 |

## What 150 would have done

A task at 150 would earn half again its own budget. The earned value of the project would rise above its budget at completion, the completion ratio would go above one, and a ratio whose whole meaning is the share of the job that is done would be reporting more job than exists. The cost index would rise with it and the report would show a project both ahead and cheap.

Negative progress is refused for the same reason from the other side. A task that has gone backwards has not un-earned money, and the honest record of rework is a revised cost and a revised window, not a progress figure below zero.

## An unreadable figure is not a zero

"Half: percent complete is not a number: half" names the task and quotes the text. Read as zero instead, it would put a task that may be almost finished into the earned value at nothing and drag the schedule index down without saying why.

## What the guard cannot catch

The guard is a range check. It is not a truth check. Procurement at 30.0000 percent of 8600000 earns 2580000, and that arithmetic is correct whether or not 30.0000 is a true statement about Procurement. A figure of 30.0000 typed against a task where nothing has actually started sits comfortably inside 0 to 100, passes every check the engine has, and puts 2580000 of earned value into a report that has no work behind it.

That is the limit of the whole method. Earned value is only as good as the progress typed into it, and the refusals guard the arithmetic rather than the judgement.

## The mistake

The mistake is trusting an index because the engine accepted the inputs. Acceptance means the numbers were readable and in range. The second mistake is arguing with a refusal: a task finished ahead of its window is recorded at 100.0000 percent, and the schedule index is where being ahead shows up. Pushing progress past 100 corrupts the earned value instead.

## Exercise

Write the three refusal messages and say what each would have done to the earned value had it been accepted. Then explain why a Procurement figure of 30.0000 that should have read 0.0000 passes every check, and name the number in the report it moves.
