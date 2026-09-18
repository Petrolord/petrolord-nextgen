# The earlier of two dates

When an obligation carries both a due date and an expiry date, two dates are counting down on the same row at once. The engine does not make you choose between them. It takes the earlier of the two as the next action date, and every day count and every warning on the row is read from that date. This lesson is about the reader who counts to the other one.

## The discharge permit

REG-2026-001 is the IKORO produced water discharge permit. Its record reads:

| code | frequency | due | expiry | lead time | next action date | days until | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REG-2026-001 | Annual | 2027-03-31 | 2026-11-20 | 60 | 2026-11-20 | 36 | Due soon |

Its due date is 2027-03-31, the date the obligation is next due under its annual schedule. Its expiry is 2026-11-20, the date the permit itself lapses. The next action date is 2026-11-20, the expiry, because it is the earlier of the two. At the as-of date of 2026-10-15 that is 36 days away, and explainStatus gives the reason "Due in 36 days, inside the 60 day lead time set for this obligation."

{{panel:compliance-register-explorer}}

## The reader who counts to the due date

Now read the row the way a busy person reads it: find the due date and count to that. The digest carries the count to 2027-03-31 on another row. REG-2026-004, the annual environmental monitoring report, is due on 2027-03-31 as well, and its days until at 2026-10-15 reads 167, status On track.

So the same date, 2027-03-31, reads 167 days away. A reader who looked only at the permit's due date would see a date 167 days off, file it mentally as fine, and miss the permit lapsing on 2026-11-20. The engine's figure for the permit is 36, and its status is Due soon. That gap between what the reader counted and what the engine counted is the trap this tier is built on.

## The earlier date also sets the warning

The status comes from the same date as the count. The permit's lead time is 60 days and its next action date is 36 days out, which the reason itself states is inside the lead time, so the row is Due soon. The warning on this row is raised by the expiry.

## When the due date is the earlier one

The rule works the other way round as well. The digest moves the expiry of REG-2026-005, the radioactive source licence, out to 2027-09-30. Its due date is 2026-12-31, and with the expiry moved the row reads On track with a days until of 77. The next action date is now the due date, because the due date is now the earlier of the two. The same rule picks whichever date comes first.

## What to take from it

A register column labelled due date is not the whole story on a row that also carries an expiry. Read the next action date and its days until, because that is the date the status is computed from. In the panel, move the as-of date and watch which of the two dates drives the warning on each row.

## Exercise

For REG-2026-001, read the due date, the expiry, the next action date, the days until and the status. Then read the days until of REG-2026-004, whose due date is the same 2027-03-31. Say which count a reader who looked only at the permit's due date would have, which count the engine uses, and what that reader would miss.
