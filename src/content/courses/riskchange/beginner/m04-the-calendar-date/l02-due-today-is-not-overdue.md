# Due today is not overdue

"Overdue" means different things in different registers. In this lesson it means one thing: a risk's review date has passed. The rule that decides it is short, and each half of it is there for a reason.

{{panel:rc-risk-explorer}}

## The rule

A risk review is overdue when the risk is LIVE and its review date has PASSED: days until below zero. A review due on the as-of date is not overdue, and a risk that is not live carries no review obligation at all. The test asks the status first.

## The OBODO register, read on 2026-10-01

| risk | status | next review | days until | review overdue |
| --- | --- | --- | --- | --- |
| OB-01 | "Open" | 2026-10-01 | 0 | no |
| OB-02 | "Open" | 2026-09-30 | -1 | yes |
| OB-05 | "Open" | 2026-09-15 | -16 | yes |
| OB-07 | "Realized" | 2026-10-02 | 1 | no |
| OB-09 | "Draft" | null | null | no |
| OB-10 | "Closed" | 2027-03-31 | 181 | no |

## Due on the day

OB-01 is "Open" and due on 2026-10-01, the as-of date. Its days until is 0, and 0 is not below zero, so its review is not overdue on 2026-10-01. The review is due today, and the day is not over. OB-02 is due the day before, at -1, and is overdue. OB-05 is due on 2026-09-15, at -16, and is overdue. Live risks whose review is overdue on 2026-10-01: 2, OB-02 and OB-05. OB-01 is due on the as-of date itself and is not among them.

## Status first

The second half of the rule is the status. Here "Closed" is a status of a risk. OB-10 is "Closed" and OB-09 is "Draft", and neither is live. Neither can read overdue whatever its date, because the test asks the status first. A risk that is not live is either not yet in the register properly or one the organisation has stopped carrying, and a review date on it is not an obligation.

The same question asked of a Closed risk whose review date passed the day before the as-of date answers overdue no. Asked of the same risk marked "Open", it answers overdue yes. Only the status differs between the two. The date half has an edge of its own: an "Open" risk with no review date at all has days until null and reads overdue no, because there is no date to be late against.

## Why the rule has both halves

Without the status check, a register would fill up with closed risks reading overdue, and a reviewer would learn to ignore the overdue column. Without the rule that 0 is on time, every review would read late on the day it was due. Both halves keep the overdue list to risks that are carried and late.

## The mistake

The mistake is to write "OB-01 is overdue" because its review date is today. On 2026-10-01 OB-01 is due and not overdue. And the date matters: every answer in the table is true on 2026-10-01, and quoting any of them without that date quotes half of it.

## Exercise

Record, on 2026-10-01, the days until and the review overdue answer for OB-01, OB-02, OB-05 and OB-10. Record how many live OBODO risks are review-overdue on that date and name them. State the two conditions the rule checks, and which it checks first.
