# From the date that was due

When a recurring obligation is filed, the register has to move its due date on to the next one. The engine's rollForward does that, and the question that matters is which date it rolls from. The Regulatory Compliance app rolls from the date that was due. This lesson shows why the other choice would let a late filer drag the whole schedule with them.

## A late monthly return

REG-2026-002 is the IKORO monthly produced water quality return. It was due 2026-10-10. At the as-of date of 2026-10-15 it reads Overdue, and its reason says "The due date passed 5 days ago."

The digest then records a filing on 2026-10-14, late. The app passes the due date to rollForward when a filing is recorded:

rollForward(2026-10-10, Monthly) = 2026-11-10

The same call made on the filing date would give 2026-11-14. That is the date the schedule would walk to if it rolled from the filing, and it is the one the app does not use.

{{panel:compliance-register-explorer}}

After the filing is recorded and the due date rolled, the return reads Due soon, with a next action date of 2026-11-10 and 26 days to go. The return has no lead time set, so the window it is read against is the default of 30 days.

## Why the due date and never the filing date

A regulator's monthly return is due on the same day each month. Filing late in October does not move November's deadline. If the schedule rolled from the filing, the next due date would be 2026-11-14, and the register would show a deadline that the regulator does not recognise. The operator would believe it had until the fourteenth when the return is due on the tenth.

Each late filing would push every later deadline further out, so an operator that is habitually late would end up with a schedule that says it is on time. Rolling from the date that was due keeps the schedule anchored to the regulator's calendar, however late any one filing is.

## What the panel shows

The panel draws both dates when you record a filing: the next due date rolled from the date that was due, and beside it the date rolling from the filing would give, labelled as the one the app does not use. Record the filing at different dates and watch the first stay fixed at 2026-11-10 while the second moves.

## The filing counts, and the row is still Due soon

The rolled row's periodStart is 2026-10-10. The filing on 2026-10-14 is on or after it, so the filing counts for the current period. The status is still Due soon, because deriveStatus asks whether the next action date is inside the lead time before it asks about the filing.

The same rolled row with lead_time_days 0, so no window is open, reads Compliant: "Last filed 2026-10-14, next due in 26 days." The open window is what keeps the row at Due soon.

## Exercise

Read the date REG-2026-002 was due, the date it was filed, and the two next due dates the digest prints for it: the one the app uses and the one it would give by rolling from the filing. Say which date the regulator's calendar agrees with and why. Then read the status, next action date and days until the return carries once the filing is recorded, and the status the same row reads with lead_time_days 0. Say what the two statuses show about the order in which deriveStatus asks its questions.
