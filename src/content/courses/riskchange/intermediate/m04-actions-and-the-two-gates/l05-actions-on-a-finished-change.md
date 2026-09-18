# Actions on a finished change

An action is work owed on a change. When the change itself is finished, is the work still owed? The engine answers no, and the dashboard counts follow that answer. This lesson reads the ESANMI action log on the as-of date, 2026-10-01.

## The action log

| action | change | type | status | due |
| --- | --- | --- | --- | --- |
| AC-01 | ES-01 | "Pre-implementation" | "Open" | 2026-09-28 |
| AC-02 | ES-01 | "Pre-implementation" | "Complete" | 2026-09-15 |
| AC-03 | ES-02 | "Post-implementation" | "In progress" | 2026-10-10 |
| AC-04 | ES-04 | "Implementation" | "Complete" | 2026-09-26 |
| AC-05 | ES-04 | "Post-implementation" | "Open" | 2026-10-20 |
| AC-06 | ES-06 | "Post-implementation" | "Open" | 2026-09-01 |
| AC-07 | ES-09 | "Pre-implementation" | "In progress" | 2026-08-10 |
| AC-08 | ES-03 | "Post-implementation" | "Cancelled" | 2026-09-20 |
| AC-09 | ES-99 | "Implementation" | "Open" | 2026-09-30 |

The engine's summary reads openActions 4 and overdueActions 2. Both counts were also replayed through the module's independent oracle.

## Three kinds of row the count leaves out

- **Finished actions.** AC-02 and AC-04 are "Complete" and AC-08 is "Cancelled". A Cancelled action is finished.
- **Actions on a finished change.** AC-06 is "Open" and AC-07 is "In progress", and both are skipped, because their changes are finished and locked: ES-06 is in the Closed stage and ES-09 is "Cancelled".

Look at AC-06. Its status says "Open" and its due date, 2026-09-01, is before the as-of date, so a count that read the action alone would call it open and overdue. The engine reads its change as well. ES-06 is in the Closed stage, finished and locked, and an action on a locked change is left out of the open work. The same holds for AC-07 on ES-09, which is "Cancelled".

This is why a reader of the counts needs both lists in hand: the action log and the change register. An action's own status tells you half of the answer; the stage of its change tells you the rest.

## One kind of row the count keeps

AC-09 names change ES-99, which is not in this register. The engine counts it. An action whose change is not supplied still counts, because not knowing the parent is no reason to hide the work.

## The four and the two

Reading the log with those rules, the open actions are AC-01, AC-03, AC-05 and AC-09, which agrees with openActions 4.

"Overdue" here means an action's due date has passed, which is a different question from a change's own overdue flag. The digest prints the count, overdueActions 2, and does not list which two. Of the four open actions, AC-01 is due 2026-09-28 and AC-09 is due 2026-09-30, both before 2026-10-01; AC-03 and AC-05 are due after it. That reading agrees with the count.

{{panel:rc-change-explorer}}

## Where late work shows

A change's own overdue flag is read against its target implementation date, and only before the change is on the facility. The ESANMI register holds 5 changes in "Implementation", 5 are past their target date, and none of them reads overdue. Late work on a change that is already on the facility shows here instead, as overdue actions, with the due date of each action carrying the lateness. A reader looking for late work on a live change looks at overdueActions and the action log.

## Exercise

For every action in the ESANMI log, record whether it is counted in openActions on 2026-10-01, and name the rule that included or skipped it: finished status, finished change, or unknown change counted. Then record openActions and overdueActions, and say why AC-06 is not in either count.
