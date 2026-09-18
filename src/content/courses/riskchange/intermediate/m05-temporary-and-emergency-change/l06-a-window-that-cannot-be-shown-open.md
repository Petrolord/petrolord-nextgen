# A window that cannot be shown open

The ratification window is counted from the actual implementation date. So what does the engine say about an Emergency change in "Implementation" that has no implementation date recorded? It cannot count a window from nothing. This lesson reads the answer it gives.

## The engine's answer

With no implementation date recorded, the ratification due date is null and the state is "Ratification overdue". The engine's own reason is short: the window cannot be shown to be open, so it fails closed. This answer, like every one in this module, was also replayed through the module's independent Python oracle.

## Failing closed

There were two possible answers. The engine could treat a missing date as "no window has started", which would read "Awaiting ratification" for ever. Or it could treat a missing date as a window it cannot confirm, and report the change as overdue until somebody records when it went in.

The first answer would give an unratified emergency change a permanent pass: on the facility, on one signature, with no flag that full review is due. The second puts the burden on recording the date.

The engine takes the second answer. A status that says "you are fine" has to be earned by the record, and a missing date earns nothing.

## ES-12 in the register

The ESANMI register carries a live example. Read on 2026-10-01:

| change | type | stage | ratification | due |
| --- | --- | --- | --- | --- |
| ES-04 | "Emergency" | "Implementation" | "Awaiting ratification" | 2026-10-03 |
| ES-05 | "Emergency" | "Implementation" | "Ratification overdue" | 2026-09-27 |
| ES-12 | "Emergency" | "Implementation" | "Ratification overdue" | null |

ES-12's actual implementation date is null: no date recorded. So it reads "Ratification overdue" with its due date null, the pair the engine gives when no implementation date is recorded. ES-05 reads the same state for a different reason: it has a due date, and 2026-09-27 is before 2026-10-01.

The summary reads ratificationOverdue 2, and those two are ES-05 and ES-12. A reader who drops the row with a null due date as "nothing to report" misses one of the two.

{{panel:rc-change-explorer}}

## Where else this tier fails closed

The same choice appears at every point in this tier where a record is missing something the rule needs:

- A change with no approval rows is refused at the gate: No approvers have been assigned, so there is nothing to approve. Add the approval levels this change needs.
- A Temporary change with no expiry date, or one that reads "after the turnaround", is refused at the gate into "Implementation".
- An approval assigned to nobody is refused: Choose the approver.

In each case an absence stops the work until somebody supplies what is missing. For a change already on the plant, the ratification rule raises a flag instead.

## Two nulls that mean different things

A null due date means two different things in the ESANMI register. On ES-01, a Permanent change, the ratification column reads "Not required" and its due date is null, because there is no window to count. On ES-12 the due date is null and the state is "Ratification overdue", because a window should exist and cannot be counted. Always read the null beside the state.

## Exercise

Record the ratification state and due date of ES-04, ES-05 and ES-12 from the ESANMI register on 2026-10-01. For each, say which rule produced the state. Record ES-12's actual implementation date. Then record ratificationOverdue from the summary, and name the two changes behind it.
