# From the date that was due

When a recurring obligation is filed, the register has to move its due date on to the next one. The engine's rollForward does that, and the question that matters is which date it rolls from. The Regulatory Compliance app rolls from the date that was due. This lesson shows why the other choice would let a late filer drag the whole schedule with them.

## A late monthly return

REG-2026-002 is the IKORO monthly produced water quality return. It was due 2026-10-10. At the as-of date of 2026-10-15 it reads Overdue, and its reason says "The due date passed 5 days ago."

The digest then records a filing on 2026-10-14, late. The app passes the due date to rollForward when a filing is recorded:

rollForward(2026-10-10, Monthly) = 2026-11-10

The same call made on the filing date would give 2026-11-14. That is the date the schedule would walk to if it rolled from the filing, and it is the one the app does not use.

{{panel:compliance-register-explorer}}

After the filing is recorded and the due date rolled, the return reads Due soon, with a next action date of 2026-11-10 and 26 days to go. The return has no lead time set, so the window it is read against is the default of 30 days. Its next deadline is already approaching.

## Why the due date and never the filing date

A regulator's monthly return is due on the same day each month. Filing late in October does not move November's deadline. If the schedule rolled from the filing, the next due date would be 2026-11-14, and the register would show a deadline that the regulator does not recognise. The operator would believe it had until the fourteenth when the return is due on the tenth.

File November's return late as well, roll from that filing, and December's due date drifts again. Each late filing pushes every later deadline further out, so an operator that is habitually late ends up with a schedule that says it is on time. Rolling from the date that was due keeps the schedule anchored to the regulator's calendar, however late any one filing is.

## What the panel shows

The panel draws both dates when you record a filing: the next due date rolled from the date that was due, and beside it the date rolling from the filing would give, labelled as the one the app does not use. Record the filing at different dates and watch the first stay fixed at 2026-11-10 while the second moves.

## The whole schedule from one date

The digest also rolls one due date, 2026-08-31, forward by every frequency. Three of those rows are worth reading now:

| frequency | next due date | days until it |
| --- | --- | --- |
| Monthly | 2026-09-30 | -15 |
| Quarterly | 2026-11-30 | 46 |
| Annual | 2027-08-31 | 320 |

Notice the monthly row. One roll forward from 2026-08-31 gives 2026-09-30, and at the as-of date that is -15, a date already behind. Rolling forward moves the due date one period on from the date that was due. It does not jump to the first due date after the as-of date. The next lesson reads the rest of the table and the month end rule behind the monthly row.

## Exercise

Read the date REG-2026-002 was due, the date it was filed, and the two next due dates the digest prints for it: the one the app uses and the one it would give by rolling from the filing. Say which date the regulator's calendar agrees with and why. Then read the status, next action date and days until the return carries once the filing is recorded.
