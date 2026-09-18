# Month ends pulled back

Many regulatory deadlines fall on the last day of a month, and months are not the same length. Roll the thirty-first of August forward by one month and there is no thirty-first of September to land on. The calendar module has one rule for this: when the target month is shorter, the date is pulled back to that month's last day.

## One due date, every frequency

The digest rolls a due date of 2026-08-31 forward by each frequency and counts the days to the result from the as-of date of 2026-10-15:

| frequency | next due date | days until it |
| --- | --- | --- |
| One-off | none | none |
| Monthly | 2026-09-30 | -15 |
| Quarterly | 2026-11-30 | 46 |
| Semi-annual | 2027-02-28 | 136 |
| Annual | 2027-08-31 | 320 |
| Biennial | 2028-08-31 | 686 |
| Other | none | none |

{{panel:compliance-register-explorer}}

Three of these rows are month ends pulled back. September and November have thirty days, so the monthly roll lands on 2026-09-30 and the quarterly roll on 2026-11-30. February 2027 has twenty-eight, so the semi-annual roll lands on 2027-02-28. The annual and biennial rolls land in August, which has a thirty-first, so they keep it: 2027-08-31 and 2028-08-31.

The rule never pushes a date into the next month. A deadline of the last day of August rolled one month on becomes the last day of September. It does not become the first of October.

That matters because a deadline set as the last day of the month is a promise about which month the work belongs to. A September return that rolled into October would be filed against the wrong month, and every period computed from it would be shifted by the same mistake.

## Three more month ends

The digest prints three further cases chosen to test the rule at its hardest:

| due date | frequency | next due date |
| --- | --- | --- |
| 2026-01-31 | Monthly | 2026-02-28 |
| 2028-02-29 | Annual | 2029-02-28 |
| 2026-03-31 | Semi-annual | 2026-09-30 |

The first is the shortest month there is. The second starts on a leap day, 2028-02-29, and rolls a year on to 2029, which has no twenty-ninth of February, so it lands on 2029-02-28. The third rolls the end of March six months on to the end of September, pulled back from a thirty-first that September does not have.

## The same rule in two other places

The current period uses it as well. periodStart steps one frequency back from the next due date and pulls back the same way: for a due date of 2026-10-31, the monthly period starts on 2026-09-30 and the semi-annual period on 2026-04-30.

Document Control uses it for review dates, which module five reads in full. A document issued 2024-02-29 on a 12 month review period has its next review on 2025-02-28.

One rule applied in all three places means a due date, the period it closes and a document's review date never disagree about what the end of a month is.

## What the digest does not print

Every case above is a single roll. The digest does not print what the rule gives when a pulled-back date, such as 2026-02-28, is itself rolled on again, so this course says nothing about it. That answer has to come from the engine, and it is not one this course quotes.

## Exercise

From the table for 2026-08-31, name the frequencies whose next due date was pulled back to a shorter month's last day, and the ones that kept the thirty-first, quoting each date. Then read the leap day row and say what the rule does to 2028-02-29 when it is rolled a year on.
