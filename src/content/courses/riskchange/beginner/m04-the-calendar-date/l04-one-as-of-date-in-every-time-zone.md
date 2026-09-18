# One as-of date in every time zone

An organisation that runs a register across several offices has several clocks. The same instant is still the evening of one day in one place and already the next morning in another. A date rule that depends on where it is run gives different answers to different readers, and this lesson shows how the calendar module avoids that.

{{panel:rc-risk-explorer}}

## Both sides read the same way

A calendar date is read at LOCAL midnight from its leading YYYY-MM-DD, and so is the as-of date. Both dates in every comparison are read by the same rule on the same machine. So a whole number of days separates any two of them in every time zone.

Think about what that removes. If the as-of date were read one way and the record's date another, the gap between them could come out a few hours short or long depending on the reader's zone, and a rounding step would have to decide which day it fell on. Reading both at local midnight means the hours never enter the calculation. From 2026-10-01 to 2026-10-02 is 1 day wherever you stand.

## A timestamp is read by its date

A record may hold a full timestamp, with a time of day and a zone.

| date given | as | parsed | days until |
| --- | --- | --- | --- |
| a timestamp late in the evening, UTC | "2026-09-30T23:30:00Z" | 2026-09-30 | -1 |

A timestamp is read by its leading date only. The late-evening UTC timestamp above is the calendar date its first ten characters name, 2026-09-30, whatever the zone the reader is in. Counted from 2026-10-01 it is -1.

That can look wrong at first. Somewhere in the world 23:30 UTC on 30 September is already 1 October by the local clock. But the register asked for a calendar date, and the calendar date written on the record is 2026-09-30. Reading the leading date keeps the answer tied to what the record says, the same for every reader.

## Why it matters for a review due today

The rule in the previous lessons says a review due on the as-of date is not overdue. That rule is only useful if every reader agrees which day is the as-of date and which day the review is due. OB-01 is due on 2026-10-01. Because both dates are calendar dates read at local midnight, its days until on 2026-10-01 is 0 for every reader, and it is not overdue for any of them.

## Hand the date in as a date

This is also why the as-of date is handed to every engine call explicitly. Every function that takes a date defaults to the machine clock, and a clock is a moment in one zone. A calendar date written as YYYY-MM-DD is the same day everywhere. Handing in 2026-10-01 means the answer depends only on the record and that date.

## The mistake

The mistake is to reason about a review deadline in hours. A risk review in this register is due on a calendar day. It is not overdue on that day in any office, and on 2026-10-01 a live risk whose review was due 2026-09-30 is overdue in every office.

## Exercise

Record the parsed date and the days until, counted from 2026-10-01, for "2026-09-30T23:30:00Z" and for "2026-10-02". Record OB-01's days until and review overdue answer on 2026-10-01. State the rule that makes each answer the same in every time zone.
