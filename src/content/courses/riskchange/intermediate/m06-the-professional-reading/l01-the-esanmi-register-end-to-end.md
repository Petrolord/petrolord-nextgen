# The ESANMI register end to end

Every rule in this tier meets in one register. This lesson reads the ESANMI change register whole, on the as-of date 2026-10-01, and checks the summary counts against the rows that produce them. Every engine answer here was also replayed through the module's independent Python oracle.

## The register

| change | type | stage | target | expiry | expiry state | overdue | ratification | due |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ES-01 | "Permanent" | "Approval" | 2026-10-20 | null | "Permanent change" | no | "Not required" | null |
| ES-02 | "Temporary" | "Implementation" | 2026-09-20 | 2026-10-14 | "Expiring soon" | no | "Not required" | null |
| ES-03 | "Temporary" | "Implementation" | 2026-09-10 | 2026-09-28 | "Expired" | no | "Not required" | null |
| ES-04 | "Emergency" | "Implementation" | 2026-09-26 | 2026-11-29 | "Within expiry" | no | "Awaiting ratification" | 2026-10-03 |
| ES-05 | "Emergency" | "Implementation" | 2026-09-20 | 2026-10-10 | "Expiring soon" | no | "Ratification overdue" | 2026-09-27 |
| ES-06 | "Permanent" | "Closed" | 2026-08-15 | null | "Permanent change" | no | "Not required" | null |
| ES-07 | "Temporary" | "Closed" | 2026-07-20 | 2026-08-01 | "Closed out" | no | "Not required" | null |
| ES-08 | "Permanent" | "Review" | 2026-09-25 | null | "Permanent change" | yes | "Not required" | null |
| ES-09 | "Permanent" | "Cancelled" | 2026-08-01 | null | "Permanent change" | no | "Not required" | null |
| ES-10 | "Temporary" | "Screening" | 2026-10-06 | 2026-09-01 | "No expiry" | no | "Not required" | null |
| ES-11 | "Permanent" | "Rejected" | 2026-09-01 | null | "Permanent change" | no | "Not required" | null |
| ES-12 | "Emergency" | "Implementation" | 2026-09-28 | 2026-12-31 | "Within expiry" | no | "Ratification overdue" | null |

## The summary, checked against the rows

| count | value |
| --- | --- |
| total | 12 |
| active | 8 |
| awaitingApproval | 1 |
| expired | 1 |
| expiringSoon | 2 |
| overdue | 1 |
| openActions | 4 |
| overdueActions | 2 |
| ratificationPending | 1 |
| ratificationOverdue | 2 |

Read each count back to its rule:

- **active 8.** The stage counts are "Draft" 0, "Screening" 1, "Review" 1, "Approval" 1 and "Implementation" 5, and those are the active stages: 0 + 1 + 1 + 1 + 5 = 8.
- **expired 1 and expiringSoon 2.** ES-03 reads "Expired"; ES-02 and ES-05 read "Expiring soon". ES-10 has an expiry date behind the as-of date and reads "No expiry", because it is in "Screening" and not in effect.
- **overdue 1.** This is the overdue flag on a change, read against its target date. ES-08, in "Review" with a target of 2026-09-25, is the one change that reads yes. The 5 changes in "Implementation" are all past their target dates, and none reads overdue, because being in effect means the target was met or passed by the fact of it.
- **openActions 4 and overdueActions 2.** Module four read these from the action log: actions on finished changes (AC-06 on ES-06, AC-07 on ES-09) are skipped, and AC-09, whose change ES-99 is not in the register, is counted.
- **ratificationPending 1 and ratificationOverdue 2.** ES-04 is awaiting ratification. ES-05 is past its due date of 2026-09-27, and ES-12 has no implementation date, so its window fails closed.

- **total 12.** Every row counts, whatever its stage, including the four finished changes ES-06, ES-07, ES-09 and ES-11.

Two kinds of count need care. The engine prints awaitingApproval 1, and the by-stage count shows 1 change in "Approval", ES-01; the digest prints both figures and does not print the definition of awaitingApproval, so read them side by side and say no more. It also prints counts by risk level: "Low" 2, "Medium" 4, "High" 4, "Critical" 2. The register above does not carry each change's risk level, so quote those four counts as the engine's figures.

## Rows the counts leave alone

Some rows are easy to misread. ES-11 is "Rejected", terminal, never in effect: it cannot expire, cannot be overdue and carries no open actions. ES-06 is in the Closed stage, so its "Open" action AC-06 is left out of openActions. ES-10 carries an expiry already behind the as-of date, and still counts as neither expired nor expiring soon.

{{panel:rc-change-explorer}}

## Sorted by urgency

The engine's byUrgency order on 2026-10-01 puts expired changes first, then expiring soon, then overdue, then other live work, then everything finished; within a rank the earlier expiry or target date comes first:

ES-03, ES-05, ES-02, ES-08, ES-10, ES-01, ES-04, ES-12, ES-07, ES-09, ES-06, ES-11

ES-03 leads as the one expired change. ES-05 comes before ES-02 because its expiry, 2026-10-10, is earlier than 2026-10-14. ES-08 follows as the one overdue change. The four finished changes come last.

## Exercise

For every change in the ESANMI register, record on 2026-10-01 its expiry state, its overdue flag and its ratification state. Then reproduce active, expired, expiringSoon, overdue and ratificationOverdue from your rows, and name the rule behind each count.
