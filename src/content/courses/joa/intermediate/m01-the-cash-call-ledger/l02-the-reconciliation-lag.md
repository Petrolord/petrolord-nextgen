# The reconciliation lag

{{panel:joa-recovery-calculator}}

A month's difference can only be stated once its actual payments are known, and the operator's next request may already be out by then. The reconciliation lag is the number of months between a called month and the call its difference adjusts. The texts this course reads say that a later request is adjusted; each agreement states when, and the engine takes the lag as a stated input with no default.

## The lag in the engine's words

On the Ekene 2027 ledger the lag is 2 months, and the engine's basis says so verbatim:

> the difference of a month adjusts the cash call 2 months later (a stated input, no default)

The lag counts months on the calendar, whether or not a call is made in them. On the Ekene ledger April has a forecast of 0.000000 and makes no call, so February's under-call waits for the next call that is made:

> 2027-04: the under-call of 500000 in 2027-02 (forecast 6000000, actual 6500000) is added to the next cash call (none is made this month), 2 months later

A lag must be a whole number of months, at least one, because a month cannot adjust its own call. Stating 0 is refused:

> reconciliationLagMonths must be an integer at or above 1; got 0

## Two lags on the same year

The golden inputs run the same twelve Ekene months twice, once with each lag, both with the negative call rule "carry" and no cash call below 500000.000000:

| terms | calls over the year | arrears billed | actual | EKO closing balance |
| --- | --- | --- | --- | --- |
| lag 2 | 68604000.000000 | 448000.000000 | 69148000.000000 | -48000.000000 |
| lag 1 | 68500000.000000 | 448000.000000 | 69148000.000000 | -100000.000000 |

The actual spend and the arrears billed are the same under both lags, because the lag moves no cost: it moves the month in which a difference is settled. What changes is what is still open at the year end.

Under a lag of 1, November's over-call is credited in December, and the engine says so:

> 2027-12: the over-call of 104000 in 2027-11 (forecast 7000000, actual 6896000) is credited against this cash call, 1 month later

Under a lag of 2, the same November difference would reach a call in January 2028, which is outside the ledger, so it is still open at the close. That is the 104000.000000 between the two yearly call totals, and it is why every call is quoted with its lag, its negative call rule and its threshold. EKO's closing balance shows it for one party: with a lag of 2 its November difference of 52000.000000 and its December difference of -100000.000000 are both unadjusted, giving -48000.000000; with a lag of 1 only December's -100000.000000 is left.

## Exercise

Work in the course's own recovery calculator, view "The cash call ledger".

1. Start from "The Ekene 2027 ledger, a credit carried" and read the tile "Calls over the ledger" and EKO's closing balance.
2. Start from "The same ledger, a lag of one month" and read the same two figures. Check both rows of the table above.
3. In the second ledger, find the month that receives November's over-call and read its reason.
4. With the control "Reconciliation lag, months (stated)", set the lag to 3. Before you read the closing table, write down which months' differences you expect to be still unadjusted at the close. Then check.
5. Type 0 into the same control and read the refusal.
