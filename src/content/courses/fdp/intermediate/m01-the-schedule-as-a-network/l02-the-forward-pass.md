# The forward pass

The forward pass walks the network from the start and asks one question of every activity: what is the earliest day it can begin, given everything that must finish before it. The answer for the last activity is the length of the project.

{{panel:ec-schedule-explorer}}

## Two rules

An activity with no predecessor has an early start of 0. Every other activity has an early start equal to the latest early finish among the activities it depends on. Early finish is early start plus duration, in both cases.

That is the whole pass. It reads durations and links and nothing else.

## EGINA, activity by activity

| activity | duration | early start | early finish |
| --- | --- | --- | --- |
| a1 Project sanction | 0 | 0 | 0 |
| a2 Detailed engineering | 210 | 0 | 210 |
| a3 Long lead procurement | 300 | 0 | 300 |
| a4 Hull conversion | 420 | 300 | 720 |
| a5 Topsides fabrication | 330 | 210 | 540 |
| a6 Subsea installation | 180 | 210 | 390 |
| a7 Integration and commissioning | 150 | 720 | 870 |
| a8 First oil | 0 | 870 | 870 |

a1 runs from 0 to 0. a2 and a3 both depend on a1 alone, so both start at 0 and run in parallel: a2 finishes at 210, a3 at 300. a4 depends on a3 and starts at 300, and 300 plus 420 is 720. a5 and a6 both depend on a2, so both start at 210; a5 finishes at 540 and a6 at 390.

a7 depends on a4 and a5 and takes the later of the two finishes, 720 rather than 540, so it runs from 720 to 870 because 720 plus 150 is 870. a8 depends on a6 and a7 and takes 870, the later of 390 and 870.

## Parallel work is the whole point of the pass

a2 and a3 both begin at 0 and neither knows about the other. a5 and a6 both begin at 210, and the pass places them side by side without comparing them.

The pass never asks whether a yard, a crew or a vessel could do two things at once. It reads the links it was given, and a plan that needs two activities kept apart says so by typing a link between them.

## The number at the end

The early finish of the last activity is the network duration, 870 days. That is a length of work measured from day 0 of the network. It carries no date in it, and a calendar is not consulted to produce it.

## The mistake

Adding the durations. The eight durations of 0, 210, 300, 420, 330, 180, 150 and 0 were never meant to sum to the answer, because a2 and a3 run at the same time and so do a5 and a6.

The subtler error is taking the first predecessor in the list rather than the latest finish among them. a7 lists a4 and a5. Topsides fabrication finishes at 540, and an early start of 540 for a7 would carry the whole network 180 days early on an activity that cannot begin until the hull is converted at 720. A successor waits for all of its predecessors, so the rule is the maximum every time.

## Exercise

Compute the early start and early finish of a4, a5, a6 and a7 from the durations and the links, showing which predecessor finish each early start came from. Then state the network duration, and say why a7 starts at 720 rather than 540.
