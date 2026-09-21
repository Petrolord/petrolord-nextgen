# The as-of date is an input

Every status in the register is a comparison between a date on the record and one other date: the as-of date. The engine does not decide for itself what that date is. It is given it, as an argument, and this lesson is about why that matters and what happens when the argument is bad.

## Given a date, never reading a clock

The engine runs behind this course pass one as-of date, 2026-10-15, into every call that reads a date against today. None of them read the machine clock, and the course quotes no line from a call that did not pass the as-of date. That is why every figure in the course can be quoted as true at 2026-10-15: the date is on the page, and the same inputs give the same answers on any machine on any day.

{{panel:compliance-register-explorer}}

The panel works the same way. It holds an as-of date you can move. When you move it, the statuses move with it, and when you put it back at 2026-10-15 every row matches the lessons again. Nothing on the record was edited in between.

## A bad as-of date

This lesson prints what the modules do when the date they are given as today cannot be read. These rows are the contract and no caller should ever pass such a date.

complianceStatus.deriveStatus with an unreadable Date as today throws RangeError: deriveStatus needs a valid date for today.

That is a refusal. The obligation register will not produce a status against a date it cannot read, and this is owner decision AS15 Q1.

Two other modules answer instead of refusing:

- documentControl.reviewState of a published document whose review date is 2020-01-06, with an unreadable Date as today, returns Review scheduled.
- qualityAssurance.isNcrOverdue of an open NCR due 2020-01-06, with an unreadable Date as today, returns false.

Both of those answers read as though nothing were due. The course records this as a held limit: an unreadable today is refused by complianceStatus alone. This course teaches it as a limit and never asks you to compute with it. The lesson to take from it is that a Review scheduled or a false beside an unreadable as-of date tells you nothing about the record.

## The wrong kind of date

One more row shows a different failure. documentControl.reviewState with today passed as the STRING 2026-10-15 throws TypeError: d.getFullYear is not a function. The as-of date has to be passed as a date. A string that looks like one is refused, even when it spells the right day.

## Exercise

Read the three rows above for an unreadable Date as today: what deriveStatus does, what reviewState returns and what isNcrOverdue returns. Say which of the three refuses, which owner decision that refusal is, and why the other two answers cannot be trusted as statements about the document and the NCR.
