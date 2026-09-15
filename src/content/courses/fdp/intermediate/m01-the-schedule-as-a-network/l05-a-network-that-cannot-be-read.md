# A network that cannot be read

Some schedules have no critical path because they are not networks. The engine names what it could not read and stops, rather than returning a duration built on a guess.

{{panel:ec-schedule-explorer}}

## Six refusals

| what was typed | the message |
| --- | --- |
| a dependency on an activity that is not there | activity b depends on zz, which is not in the schedule |
| a dependency cycle | the schedule has a dependency cycle through: a, b, c |
| two activities with one id | duplicate activity id: a |
| an activity with no id | every activity needs an id |
| a negative duration | activity a: duration may not be negative: -4 |
| an unreadable duration | activity a: duration is not a number: two weeks |

Each message names the row, and the last two name the value as well.

## Why a cycle has no answer

The forward pass computes an early start from the finishes of an activity's predecessors, so it needs somewhere to begin. In a cycle where a waits on c, c waits on b and b waits on a, no activity in the loop can ever be reached, because each of the three is waiting on one whose finish is not known yet. There is no ordering that puts every predecessor before its successor, so there is no pass to run.

The engine names the three ids in the loop, which is the only useful thing to say: the fix is to decide which of those three links was typed by mistake.

## Why the others are refusals rather than defaults

Each of the six has an obvious repair available, and the engine takes none of them. A dependency on zz could be dropped. A duplicate id could be renamed. A duration of two weeks could be converted. A negative duration could be read as positive.

Every one of those repairs would return a duration the reader would then trust. A plan that types a duration in prose in one row has probably typed one in prose in others, and a schedule with a silently dropped link computes cleanly and is wrong. The refusal is the engine declining to be the author of the plan.

## What it does not refuse

A schedule with no dependencies at all is read rather than refused: four unlinked activities return 7 days with all four critical. A duration of 0 is read: EGINA's two milestones are exactly that, and they take their place in the logic. A zero is a number somebody typed. A blank, a cycle and a dangling id are not.

## The mistake

Editing until the error goes away. Delete the dependency on zz and the engine computes a duration happily, and it is the duration of a plan whose logic is missing a link somebody meant to type. The message names the id it could not find precisely so the question can be asked the other way round: which activity was zz supposed to be.

## Exercise

Write the engine's message for a dependency cycle and say which ids it names. Then explain why an unreadable duration is refused rather than converted, and say why four activities with no dependencies at all are accepted while one dependency on a missing activity is not.
