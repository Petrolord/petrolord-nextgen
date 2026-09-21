# A date is a day

A due date on a permit has no hour in it. It names a day. The calendar module under all five apps is built on that idea, and every day count in this course rests on it.

## Reading a date

The calendar's parseDateOnly reads the leading YYYY-MM-DD of a string and builds the day it names at local midnight. Its partner toDateOnlyString prints that day back in the same YYYY-MM-DD shape. Every date in this course is printed through toDateOnlyString, so the date you read in a table is the day the engine holds.

The third function you need is daysUntil. It counts whole days from the as-of date to a date. The course's as-of date is 2026-10-15, and these rows are read against it:

| input | parseDateOnly, printed by toDateOnlyString | daysUntil against the as-of date |
| --- | --- | --- |
| 2026-10-15 | 2026-10-15 | 0 |
| 2026-11-30 | 2026-11-30 | 46 |
| 2026-09-30 | 2026-09-30 | -15 |
| 2027-02-28 | 2027-02-28 | 136 |
| 2026-10-15T23:59:00+14:00 | 2026-10-15 | 0 |

{{panel:compliance-register-explorer}}

## What the sign tells you

A positive count is a day still ahead. 2026-11-30 is 46 days after the as-of date. A negative count is a day already behind: 2026-09-30 reads -15, fifteen days gone at 2026-10-15. The as-of date itself reads 0. This lesson prints that last one on its own line as well, daysUntil of the as-of date itself: 0. A due date that reads 0 falls on the as-of date itself.

Every "days until" column in the register is this count, and every status that talks about a passed date is reading its sign. When you meet "The due date passed 5 days ago." in the next module, the 5 is a daysUntil of -5 said in words.

## A time is not part of the day

Look again at the fifth row. The input carries a time late in the evening and an offset of fourteen hours. The engine reads the leading YYYY-MM-DD and nothing after it, so the input becomes 2026-10-15 and its count is 0, the same count as the plain date on the first row.

This matters for two reasons. The first is that a regulator's due date is a day, and a record that stores it with a time attached should still fall due on that day. The second is that a date read as an instant can land on a different day depending on the time zone of the machine reading it. A register that shows one status in Lagos and another in Houston for the same record has stopped being a register. Reading the day at local midnight keeps the answer the same wherever it is read.

## The count is the engine's

In the lessons the day counts come from the engine and are quoted from the engine's output. The capstone is different: it hands you dates the lessons never count, and you count the whole calendar days from the as-of date to each one yourself, the way the engine does. Count from the as-of date forward, so a date ahead is positive, the as-of date itself is 0, and a date that has passed is negative. Check your method against the table above before you trust it on a new date. The course's precision rule states the form every figure takes: whole numbers, with day counts, counts and percents the engine has already rounded, and dates printed as YYYY-MM-DD.

## Exercise

From the table above, read the daysUntil of 2026-11-30, of 2026-09-30 and of the as-of date itself. Say which of those days is still ahead at 2026-10-15, which has passed, and which is the as-of date. Then read the fifth row and explain why an input with a time and an offset reads the same count as the first row.
