# Reviewing the register

A register is read against a date twice in this tier. Module 3 reads when each clause was last examined by an internal audit. This lesson reads something simpler: the next review date each clause carries in the register itself, and the two flags the engine derives from it at the as-of date 2026-10-15.

{{panel:compliance-readiness-explorer}}

## The next review column

Every applicable ORASHI clause carries a next review date. The engine reads it against the as-of date and prints two flags beside it: review overdue and review due soon. isoCompliance.REVIEW_LEAD_DAYS is 30, and it is the window the due soon flag reads.

Three rows show the three outcomes:

| clause | status | next review | review overdue | review due soon |
| --- | --- | --- | --- | --- |
| 4.3 | Conformant | 2026-10-01 | true | false |
| 6.1.2 | Partially conformant | 2026-11-02 | false | true |
| 7.2 | Not assessed | 2027-01-31 | false | false |

Clause 4.3's review date is behind the as-of date, so it reads review overdue true. Clause 6.1.2's review date is ahead of the as-of date and inside the lead window, so it reads review due soon true. Clause 7.2's review date is further ahead, and both flags read false. No row in this table reads true for both flags.

Clause 4.4, the excluded clause, has no next review date at all, and both of its flags read false. An excluded clause is not reviewed against a date.

## A review date and a status are separate readings

Clause 4.3 reads Conformant and review overdue true on the same row. The status is the last verdict recorded. The review flag says that verdict is due to be looked at again and has not been. Neither reading changes the other, and a reader who sees Conformant and stops has missed the second one. Read both columns on every row.

## Where the flags are counted

The register summary prints reviews overdue 1 and reviews due soon 1. The readiness list in module 5 carries one of them as a watch item, "1 clause review is past due." The list carries no item for the review that is due soon. The due soon flag is a warning for the register's owner, and the overdue flag is the one the list reads.

## A day count the digest does not print

The digest prints the next review dates and the two flags. It does not print a day count for any clause's review. Do not count the days from 2026-10-15 to 2026-11-02 yourself and quote the result as the engine's: the flag is what the engine derived, and it is what this course teaches.

## Exercise

At 2026-10-15, read the next review, review overdue and review due soon columns for clauses 4.3, 6.1.2, 7.2 and 4.4. Say which flag each row raises. Then read the summary's reviews overdue 1 and reviews due soon 1 beside the one watch item the readiness list carries for reviews, and say why only one of the two counts appears on the list.
