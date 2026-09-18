# The lead before an expiry

"Expiring soon" gives people time to act before a temporary change runs out. How much time is set by one constant, and how it is counted decides the answer on the days at each edge.

## The constant

The lead is EXPIRY_LEAD_DAYS, 14 days, counted inclusively. A change in effect whose expiry is between 0 and 14 days away on the as-of date reads "Expiring soon". Beyond that it reads "Within expiry". Before that, once the date has passed, it reads "Expired".

## One change, its expiry moved across the as-of date

The engine prints one Temporary change in "Implementation", its expiry moved across 2026-10-01:

| expiry date | days until | expiry state |
| --- | --- | --- |
| 2026-09-01 | -30 | "Expired" |
| 2026-09-30 | -1 | "Expired" |
| 2026-10-01 | 0 | "Expiring soon" |
| 2026-10-02 | 1 | "Expiring soon" |
| 2026-10-14 | 13 | "Expiring soon" |
| 2026-10-15 | 14 | "Expiring soon" |
| 2026-10-16 | 15 | "Within expiry" |
| 2026-11-30 | 60 | "Within expiry" |

Every row was also replayed through the module's independent Python oracle.

## The far edge: 14 is inside

"Counted inclusively" means the fourteenth day is part of the lead. An expiry of 2026-10-15, 14 days from the as-of date, reads "Expiring soon". An expiry of 2026-10-16, 15 days away, reads "Within expiry". A reader who assumes "within 14 days" means "fewer than 14 days" will get 2026-10-15 wrong.

## The near edge: due today has not expired

An expiry of 2026-10-01, on the as-of date itself, is 0 days away and reads "Expiring soon". It has not expired. The engine reads the expiry day itself as inside the lead, and only a negative count of days reads "Expired", as the row for 2026-09-30 at -1 shows.

This is the same calendar rule the Associate tier read for a risk review due today: whole days between calendar dates, and a date equal to the as-of date has not passed.

## Days are counted on calendar dates

The days-until column is a count of whole calendar days between two dates, the expiry and the as-of date, each read at local midnight. A whole number of days separates any two of them in every time zone, which is why stating the as-of date is enough to make every answer checkable. The engine's date functions default to the machine clock when no date is handed in; every answer in this course was handed 2026-10-01 explicitly.

{{panel:rc-change-explorer}}

## The register on the as-of date

In the ESANMI register, ES-02 carries an expiry of 2026-10-14, the same date as the row above that is 13 days away, and it reads "Expiring soon" on 2026-10-01. ES-05, an Emergency change, carries 2026-10-10 and also reads "Expiring soon", so the lead applies to both types that carry an expiry. ES-04 carries 2026-11-29 and reads "Within expiry". ES-03 carries 2026-09-28, already past, and reads "Expired". Each of those states is true on 2026-10-01, and a report that quotes them should say so.

## Exercise

Using the timeline table, record the days until and the expiry state for expiries of 2026-10-01, 2026-10-15 and 2026-10-16, read on 2026-10-01. Say which word in the rule, "inclusively", decided the answer for 2026-10-15. Then record ES-02's expiry state and the date it is true on.
