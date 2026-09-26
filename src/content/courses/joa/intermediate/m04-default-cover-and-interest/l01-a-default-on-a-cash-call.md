# A default on a cash call

{{panel:joa-recovery-calculator}}

A cash call is only a request. When a paying party does not pay its share by the due date, the joint account is short, the operation still has to be funded, and the agreement's default clauses take over. This module works out what is unpaid, who covers it, what default interest runs on it, and which consequences are triggered.

## Every party funds its share

The Norwegian Joint Operating Agreement (Attachment A to the Agreement concerning petroleum activities, an unofficial English translation whose PDF is dated 27 February 2007, cited from its Wayback Machine capture of 26 May 2024, read on 2026-09-26) puts the duty plainly:

> "The Parties are obliged to provide sufficient funds to cover all expenses relating to the activities of the joint venture." (Norway JOA Art. 8.1)

The Kenya Model PSC 2015, Participation Agreement (2015 model, read on 2026-09-26) ties that duty to a due date:

> "request a non-operator to advance a share of the estimated expenditure for the following month, stipulating the due date of payment" (Kenya Model PSC 2015, Participation Agreement Art. 6.2)

## PB's March default

The Ekene default is a synthetic stated case. A cash call of 12000000.000000 falls due on 2027-03-01. With NOC carried, PB's paying interest of 18.750000 gives it a share of the call of 2250000.000000. PB pays 250000.000000 and cures the rest on 2027-04-15:

| defaulter | share of the call | paid | unpaid | due | cured | days |
| --- | --- | --- | --- | --- | --- | --- |
| PB | 2250000.000000 | 250000.000000 | 2000000.000000 | 2027-03-01 | 2027-04-15 | 45 |

The engine opens its reason with the same arithmetic:

> PB: share of the call 2250000, paid 250000, unpaid 2000000; interest 2000000 x 8.25% x 45 days / 360 = 20625 (from 2027-03-01 to the cure on 2027-04-15, the last date excluded)

The default interest in that reason comes in the third lesson.

## What makes a default

A party is in default only for the part of its share it did not pay. A party that paid its whole share is not a defaulter, and naming it as one is refused:

> defaulters[0].paid must be below the party's share of the call 2250000 (a party that paid its share is not in default); got 2250000

The dates must also make sense. A cure cannot come before the payment was due:

> defaulters[0].curedOn must be a date from the due date 2027-03-01 to asOf 2027-05-31; got "2027-02-28"

An open default is measured to a stated date, `asOf`; the Ekene case states 2027-05-31, after the cure, so the cure ends the default.

## The terms a default needs

The Ekene contract states a default interest rate of 8.250000 percent a year, simple, on a 360-day basis, a grace of 0 hours, a suspension of rights after 5 working-days, and a forfeiture right after 3 months from 2027-03-10. The engine holds no figure for any of them: each is a stated input, and the next four lessons take them in turn.

## Exercise

Work in the course's own recovery calculator, view "A default: cover, interest and consequences", starting from "The Ekene March default, simple interest".

1. Read the defaulter table and check PB's share of the call, paid, unpaid and days against the table above, and read the tile "Unpaid".
2. In the box, set PB's `paid` to 2250000 and read the refusal. Restore 250000.
3. Set PB's `curedOn` to `"2027-02-28"` and read the refusal. Then set it to `"2027-05-31"` and read how the days change.
