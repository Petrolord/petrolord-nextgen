# A pipe schedule is a table

A nominal size is a name, not a dimension. What a line actually holds and what it actually passes come out of twelve published rows, and anything that is not one of those rows is refused.

{{panel:pd-trunk-explorer}}

## Twelve rows, three numbers each

Every row of `PIPE_SCHEDULE` carries an outside diameter, a wall and a bore, all in inches. The outside diameter is fixed by the nominal size and the schedule number moves the wall inward, so a heavier schedule is a thicker wall and a smaller bore on the same outside diameter. That is the whole idea of a schedule.

| NPS | od, in | wall, 40 then 80, in | bore, 40 then 80, in | Bore lost, in | Flow area lost, percent |
| --- | --- | --- | --- | --- | --- |
| 2 | 2.375 | 0.154, 0.218 | 2.067, 1.939 | 0.128000 | 12.001622 |
| 4 | 4.5 | 0.237, 0.337 | 4.026, 3.826 | 0.200000 | 9.688638 |
| 6 | 6.625 | 0.28, 0.432 | 6.065, 5.761 | 0.304000 | 9.773494 |
| 8 | 8.625 | 0.322, 0.5 | 7.981, 7.625 | 0.356000 | 8.722219 |

Those are the four sizes the table ships in both schedules. The bore lost runs from 0.128000 in to 0.356000 in and the flow area lost from 8.722219 to 12.001622 percent.

## What a lookup returns when the size is not there

`scheduleRow(5, '40')` is null. `scheduleRow(6, '160')` is null. Neither returns the nearest size it does have, because a nearby row is a different pipe and a caller who wanted an approximation can ask for one on purpose.

## Nothing in this file iterates

`pipeSchedule.js` is this table and two closed forms, a wall rating and an equivalent length. It knows nothing about a network, it computes no pressure and it never calls a solver. A bore out of the table is an input to a branch relation that somebody else writes, and the module has no opinion about what that relation does with it.

## The mistake

Reading the nominal size as the bore. NPS 6 is 6.625 in on the outside and 6.065 in through at schedule 40, 5.761 in at schedule 80. Six inches is neither of those, and it is not the outside diameter either. A hydraulic calculation carried out on the nominal number is using a diameter that appears nowhere in the row it came from.

## Exercise

In the panel, read off the outside diameter, the wall and the bore for NPS 8 in both schedules, and confirm the outside diameter is the same number twice.

Then say what `scheduleRow(5, '40')` returns and why returning NPS 4 or NPS 6 instead would be worse than returning nothing.
