# Whole days between two dates

Every date rule in this course starts with one question: how many days separate a date on a record from the as-of date? The answer comes from daysUntil in calendar.js, the module all four engines read dates through, and it is always a whole number.

{{panel:rc-risk-explorer}}

## A calendar date

A register records calendar dates: a review due on 2026-10-01, a target on some other day. A calendar date is read at LOCAL midnight from its leading YYYY-MM-DD, and so is the as-of date. Because both sides are read the same way, a whole number of days separates any two of them in every time zone. There are no half days and no hours to round.

## Days until, from 2026-10-01

daysUntil counts from the as-of date to the date given. A date after the as-of date is positive, a date before it is negative, and the as-of date itself is 0.

| date given | as | parsed | days until |
| --- | --- | --- | --- |
| the as-of date itself | "2026-10-01" | 2026-10-01 | 0 |
| the day before | "2026-09-30" | 2026-09-30 | -1 |
| the day after | "2026-10-02" | 2026-10-02 | 1 |
| the last day of October | "2026-10-31" | 2026-10-31 | 30 |
| the first day of November | "2026-11-01" | 2026-11-01 | 31 |
| the first day of the next year | "2027-01-01" | 2027-01-01 | 92 |
| a date one year earlier | "2025-10-01" | 2025-10-01 | -365 |

## Reading the table

The sign is the first thing to read. Days until is positive for a date still to come and negative for a date already gone. The day before the as-of date is -1, and a date one year earlier is -365.

The size is a plain count of calendar days. From 2026-10-01 to the last day of October, 2026-10-31, is 30 days: the thirty days of October that follow the first. The first of November is one day further, 31. The first day of 2027 is 92 days away.

A count of 0 is its own case. It means the date given is the as-of date. Nothing about a 0 says early or late; the date is today, on the day the question is asked. The next lesson shows why that matters for a review.

## Why whole days

A status that depends on a fraction of a day would change during the working day. A review due on 2026-10-01 would be fine at breakfast and late by lunch, and two people in different offices would read it differently at the same moment. Reading every date at local midnight removes the hours entirely. The question becomes which calendar day it is, and every reader agrees.

## On the OBODO register

The OBODO register's next review dates, read against 2026-10-01, give days until of 0 for OB-01 (due 2026-10-01), -1 for OB-02 (due 2026-09-30), 45 for OB-03 (due 2026-11-15) and -16 for OB-05 (due 2026-09-15). Each is a whole number counted the way the table counts.

## The mistake

The mistake is to quote a days-until figure without the date it was counted from. OB-03 is 45 days away on 2026-10-01. On any other day it is a different number, and a figure with no as-of date cannot be checked.

## Exercise

Record the days until, counted from 2026-10-01, for 2026-09-30, 2026-10-31, 2026-11-01 and 2027-01-01. Record OB-03's and OB-05's next review dates and days until. State the rule that makes every one of these a whole number, and the date each is counted from.
