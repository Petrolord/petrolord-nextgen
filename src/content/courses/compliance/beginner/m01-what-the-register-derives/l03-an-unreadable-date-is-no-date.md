# An unreadable date is no date

A register is only as good as the dates typed into it, and some of what gets typed is not a date at all. The calendar module has one answer for all of it: a string that does not name a real day is no date, and the engine says so with null.

## Five inputs that are no date

These rows come from the same table as the last lesson, read against the as-of date of 2026-10-15:

| input | parseDateOnly, printed by toDateOnlyString | daysUntil against the as-of date |
| --- | --- | --- |
| 2026-02-30 | null | none |
| 2026-13-01 | null | none |
| 15/10/2026 | null | none |
| (empty) | null | none |
| tbc | null | none |

{{panel:compliance-register-explorer}}

Each one fails for its own reason. 2026-02-30 has the right shape and names a day that does not exist: February has no thirtieth. 2026-13-01 names a thirteenth month. 15/10/2026 is a real day written in the order a person in Lagos might write it, and the calendar reads only YYYY-MM-DD, so it is refused as well. An empty field is empty. tbc is somebody's note that the date is still to be confirmed.

## Refusing is safer than guessing

A parser that tried to be helpful could roll 2026-02-30 over into March, or read 15/10/2026 by guessing which number is the month. Either guess would put a real date on the record that nobody chose, and every status derived from it would carry that guess. parseDateOnly refuses a day that does not exist, and the daysUntil column beside it prints none because there is nothing to count to.

## What none does to a status

An unreadable date does not quietly become an old date or a future date. It becomes no date, and the modules that read it treat it as missing. You can see this across the IKORO records:

- REG-2026-013, the waste consignment register, has no due date and no expiry. Its status is No date set, and explainStatus gives the reason "No due date or expiry date has been set, so nothing can fall due."
- In the document library, a published document whose review date is the text tbc reads No review scheduled.

The obligation with no dates sits in the register with its own status word, and in the register sorted worst first it sits in tenth place, after the Compliant rows and ahead of Draft, Superseded and Not applicable. The document with tbc as its review date is still in force, and the library says plainly that nothing is scheduled for it. In both cases the gap is shown to the reader instead of being hidden behind a date nobody entered.

## Why this matters to the person reading the register

The dangerous register is one where a missing date looks like a safe date. If tbc were read as some date far ahead, the row would carry a status that looked settled and nobody would ask about it. Because the engine reads it as no date, the row reads No date set, which is a status someone has to act on: go and find out when the thing is due.

Note what this lesson covers. These are dates on a record. The next lesson is about a different date, the as-of date the engine is given, and what happens when that one is unreadable.

## Exercise

From the table above, name the input whose shape is correct and whose day does not exist, and the input that names a real day in the wrong order. Then read the status of REG-2026-013 and the review state of the published document whose review date is tbc, and say what each of those two words tells the person reading the register to do.
