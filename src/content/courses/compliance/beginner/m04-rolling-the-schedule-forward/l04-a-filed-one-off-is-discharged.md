# A filed one-off is discharged

A One-off obligation is due once. Once it has been filed, it is done, and there is no next period for it to be late in. The engine reads a filed One-off that way, and it says so in words. An unfiled One-off whose due date has passed is a different matter, and the register says that just as plainly.

## Two One-off rows

This lesson reads two IKORO One-off obligations side by side at the as-of date of 2026-10-15. Both due dates have passed.

| obligation | last filed | status | days until |
| --- | --- | --- | --- |
| REG-2026-006 | 2026-08-10 | Compliant | -62 |
| REG-2026-007 | none | Overdue | -44 |

{{panel:compliance-register-explorer}}

REG-2026-006 is the pipeline right of way consent. It was due 2026-08-14 and filed on 2026-08-10. Its days until reads -62 because the due date is behind the as-of date, and its status is Compliant. explainStatus gives the reason:

"Filed 2026-08-10. A one-off obligation, nothing further is due."

REG-2026-007 is the oil spill contingency plan notification. It was due 2026-09-01 and nothing has been filed. It reads Overdue, and its reason is "The due date passed 44 days ago."

The difference between the two rows is the filing. A passed due date with a filing on the record discharges a One-off. A passed due date with no filing is Overdue.

## Why Compliant and a negative count sit together

Everywhere else in the register, a negative days until on an Active obligation goes with Overdue or Expired. The right of way consent is the exception, and the reason sentence is there to explain it. Without the words "nothing further is due", a reader seeing Compliant beside -62 could reasonably wonder whether the status was stale. With them, the row explains itself: the obligation was met, it does not recur, and the passed date is the date it was met against.

This is one of the five rules the engine keeps under ASC-0, the one the course calls R4: a filed One-off says it is discharged. The Expert tier reads all five. The status is Compliant, and the reason carries the words that make the status readable.

## Where the two sit in the sorted register

In the register sorted worst first, REG-2026-007 is second, straight after the expired licence, and REG-2026-006 is eighth, among the Compliant rows. The same frequency and a passed due date on both, and one sits near the top of the register while the other sits among the rows in hand, because one has a filing and one does not.

## What a One-off does after it is filed

rollForward returns none for One-off, as the last lesson showed. So a filed One-off has no next due date to move on to. Its due date stays on the record, and at the as-of date of 2026-10-15 the row reads Compliant, with a reason that tells anyone who opens it that nothing further is due. For the notification that has not been filed, the only thing that changes the status is a filing.

## Exercise

Read the last filed date, the status, the days until and the reason of REG-2026-006 and of REG-2026-007. Both due dates have passed. Say what single field separates the two rows, and what the words "nothing further is due" tell a reader who sees Compliant beside a negative day count. Then read the positions the two hold in the sorted register.
