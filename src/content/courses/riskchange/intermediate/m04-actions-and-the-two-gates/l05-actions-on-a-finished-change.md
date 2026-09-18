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

Look at AC-06. Its status says "Open" and its due date, 2026-09-01, is before the as-of date, so a count that read the action alone would call it open and overdue. The engine reads its change as well, and ES-06 is locked. The same holds for AC-07 on ES-09, which is "Cancelled". A Rejected change is terminal in the same way. One probe puts an Open action due 2026-09-26 on ES-11, which is "Rejected": openActions 0, overdueActions 0.

So a reader of the counts needs both lists in hand: the action log and the change register.

## One kind of row the count keeps

AC-09 names change ES-99, which is not in this register. The engine counts it. An action whose change is not supplied still counts, because not knowing the parent is no reason to hide the work.

## The four and the two

The 4 open actions are AC-01, AC-03, AC-05 and AC-09.

"Overdue" here is the overdue flag on an action, a different question from a change's own overdue flag. An action is overdue when it is open work and its due date has PASSED: days until below zero. The 2 overdue actions on 2026-10-01 are AC-01, due 2026-09-28 at -3 days, and AC-09, due 2026-09-30 at -1 days. AC-03 and AC-05 are due after the as-of date.

The edge is the as-of date itself. Three probes, each one open action read on 2026-10-01:

| due | openActions | overdueActions |
| --- | --- | --- |
| 2026-09-30, the day before | 1 | 1 |
| 2026-10-01, the as-of date | 1 | 0 |
| 2026-10-02, the day after | 1 | 0 |

An action due on the as-of date is not overdue that day, the same rule as a risk review due today.

{{panel:rc-change-explorer}}

## Where late work shows

A change's own overdue flag is read against its target implementation date, and only before the change is on the facility. The ESANMI register holds 5 changes in "Implementation", 5 are past their target date, and none of them reads overdue. Late work on a change already on the facility shows here instead, as overdue actions.

## Exercise

For every action in the ESANMI log, record whether it is counted in openActions on 2026-10-01, and name the rule that included or skipped it: finished status, finished change, or unknown change counted. Then record openActions and overdueActions, and name the two overdue actions with their days until. Say why AC-06 is not in either count, and why an action due on 2026-10-01 is not overdue on that date.
