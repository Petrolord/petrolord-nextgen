# A date that does not exist

A date field on a form is only as good as what is typed into it. Somebody writes 30 February, or a thirteenth month, or a phrase like "after the turnaround" where a date should be. The calendar module has one answer for every one of these, and it is the same kind of answer the scoring rules give a level off the scale.

{{panel:rc-risk-explorer}}

## The probes

Each of these is handed to daysUntil with the as-of date 2026-10-01.

| date given | as | parsed | days until |
| --- | --- | --- | --- |
| 30 February, a date that does not exist | "2026-02-30" | null | null |
| a month of 13 | "2026-13-01" | null | null |
| words where a date should be | "after the turnaround" | null | null |
| nothing at all | null | null | null |

Every one parses to null, and its days until is null.

## No rollover

A date that does not exist is no date at all: 30 February and a thirteenth month both parse to null, and so does text. The engine never rolls an impossible date over into a real one.

Rolling over means answering 30 February with a real day in March. A rolled-over result looks like a valid date, carries a sensible day count and sails through every check downstream. The person who typed 30 February meant something, perhaps the end of February, perhaps a slip of the keyboard, and a rolled-over date is a guess about which. The calendar module refuses to make that guess, so the mistake stays visible on the record where it was made.

## The same principle as the scale

This is the rule you met with levels. A likelihood of 2.5 is off the scale, and the engine returns a score of 0 and the band "None" rather than guessing a level. A date that does not exist is off the calendar, and the engine returns null rather than guessing a day. In both places the engine prefers a named empty answer to a plausible wrong one.

## What a null date means for a risk

On the OBODO register, OB-09 is "Draft" with no review date. Its next review is null and its days until is null. Its review overdue answer is no, and the reason printed for it is its status: OB-09 is not live, so the test never reaches the date.

A live risk takes the same question further, because its status lets the test reach the date. Three probes, each an "Open" risk read on 2026-10-01:

| review date on the record | days until | review overdue |
| --- | --- | --- |
| none at all | null | no |
| 30 February | null | no |
| "after the audit" | null | no |

So a live risk with no readable review date is never review-overdue: the engine has no date to be late against, and nothing in it flags the missing date. The overdue column stays quiet on exactly the record that most needs a person. If you meet one, the record is the thing to fix: a live risk needs a review date that exists.

## The mistake

The mistake is to trust any date that displays. A date field that shows a value may be showing a value the engine could not read. Where days until is null, the date on the record is missing or impossible, and a person has to correct it.

## Exercise

Record the parsed value and the days until for "2026-02-30", "2026-13-01" and "after the turnaround", counted from 2026-10-01. Record OB-09's status, next review and days until, and state the rule that decides its review overdue answer. Then record the review overdue answer for an "Open" risk whose review date is 30 February, and say why the engine gives it.
