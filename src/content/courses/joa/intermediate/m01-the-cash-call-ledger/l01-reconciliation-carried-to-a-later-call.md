# Reconciliation carried to a later call

{{panel:joa-account-calculator}}

{{panel:joa-recovery-calculator}}

At Associate you worked one month of the Ekene 2027 cash calls and its difference. This module follows that difference into the later call it adjusts, and then through a whole year of calls: which call each difference meets, what happens when a credit is larger than the call, and what each party holds with the operator at a month end. The Ekene joint venture is synthetic, written for this course by a stated script.

## What the agreements say

The Norwegian Accounting Agreement (Attachment B to the Agreement concerning petroleum activities, an unofficial English translation whose PDF is dated 27 February 2007, cited from its Wayback Machine capture of 26 May 2024 and read on 2026-09-26) ties the difference to a later request:

> "The difference between the monthly cash advances and the actual payments in each currency shall be stated, and the next request for advances shall be adjusted accordingly." (Norway Accounting Agreement Art. 1.2.1)

The Kenya Model Production Sharing Contract 2015, Participation Agreement (the 2015 model, read on 2026-09-26) says the same of an excess advance:

> "If any non-operator's advances for a given month exceed its share of cash disbursements for the same month, the next succeeding cash advance, after such determination, shall be reduced accordingly." (Kenya Model PSC 2015, Participation Agreement Art. 6.4)

The engine does not decide how many months later the adjustment comes: the reconciliation lag is a stated input with no default. Its rule, verbatim from its basis:

> forecast share = forecast x paying interest; difference = forecast share - actual share for a month with a call; call = forecast share - (the difference of the month reconciliationLagMonths earlier + any amount carried)

## January's over-call reaches March

January 2027 has a forecast of 4000000.000000 and an actual of 3600000.000000. With NOC carried, the paying interests are EKO 50.000000, PA 31.250000, PB 18.750000 and NOC 0.000000, and the month's differences add up to an over-call of 400000.000000. The Ekene terms state a lag of 2 months, a negative call rule of "carry" and no cash call below 500000.000000, so the January differences adjust the March call:

| party | March forecast share | adjustment | March call |
| --- | --- | --- | --- |
| EKO | 6000000.000000 | 200000.000000 | 5800000.000000 |
| PA | 3750000.000000 | 125000.000000 | 3625000.000000 |
| PB | 2250000.000000 | 75000.000000 | 2175000.000000 |
| NOC | 0.000000 | 0.000000 | 0.000000 |

The engine's reason for the month reads:

> 2027-03: the over-call of 400000 in 2027-01 (forecast 4000000, actual 3600000) is credited against this cash call, 2 months later

The March calls total 11600000.000000 against a forecast of 12000000.000000, and each party's adjustment is its own January difference. Every figure in the ledger depends on the lag, the negative call rule and the threshold, so the course quotes each call with its terms.

## Exercise

Both calculators on this page are the course's own panels, calling the same vendored engine.

1. In the account calculator, open the view "Cash calls". Check each party's 2027-01 difference: EKO 200000.000000, PA 125000.000000, PB 75000.000000.
2. In the recovery calculator, open the view "The cash call ledger" and start from "The Ekene 2027 ledger, a credit carried". Check each party's 2027-03 adjustment and call against the table above.
3. With the control "Reconciliation lag, months (stated)", set the lag to 1. Find the month that now receives January's credit, and read its reason.
