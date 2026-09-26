# Simple default interest on a day basis

{{panel:joa-recovery-calculator}}

The parties that covered a default have lent the defaulter money, and default interest pays them for it. Four stated terms fix the figure: the annual rate, the day basis, the method, and the grace. This lesson works the simple method; the next takes monthly compounding and the grace.

## What the texts say

The Norwegian Accounting Agreement (Attachment B, unofficial English translation, PDF dated 27 February 2007, cited from its Wayback Machine capture of 26 May 2024, read on 2026-09-26) fixes the period and names the rate:

> "Interest is due for the period starting on and including the due date of payment and ending on, but excluding, the value date for payment." (Norway Accounting Agreement Art. 1.2.2)

> "as per the due date of payment, plus three percentage points." (Norway Accounting Agreement Art. 1.2.2)

The Kenya Model PSC 2015, Participation Agreement (2015 model, read on 2026-09-26) leaves its margin blank for each contract to fill:

> "A late payment shall attract interest at LIBOR plus" (Kenya Model PSC 2015, Participation Agreement Art. 6.7)

Neither text gives a rate the engine could hold, so the rate is a stated input. A default with no rate is refused:

> interest.annualRatePct must be a finite number at or above 0; got nothing

## The simple method

The engine's basis on the Ekene default, verbatim:

> simple interest at the stated 8.25% a year on a 360-day year, from and including the due date to, but excluding, the cure date (or asOf); distributed to the parties financing the default in proportion to their cover

PB's unpaid 2000000.000000 runs from 2027-03-01 to the cure on 2027-04-15. Counting the first day and leaving out the last gives 45 days, and 2000000 x 8.25% x 45 / 360 gives 20625.000000. The days follow the Norwegian period rule: a payment on the due date itself carries no default interest.

| golden case | terms | from | to | days | default interest |
| --- | --- | --- | --- | --- | --- |
| default-ekene-march | 8.25 percent, simple, 360 days | 2027-03-01 | cured 2027-04-15 | 45 | 20625.000000 |
| default-ekene-uncured | 8.25 percent, simple, 360 days | 2027-03-01 | open at 2027-07-01 | 122 | 55916.666667 |
| default-cured-on-due-date | 8.25 percent, simple, 360 days | 2027-03-01 | cured 2027-03-01 | 0 | 0.000000 |
| default-no-carry-365 | 7.3 percent, simple, 365 days | 2027-01-15 | open at 2027-03-01 | 45 | 1800.000000 |

An open default runs to the stated `asOf`, and the reason says so:

> PB: share of the call 2250000, paid 250000, unpaid 2000000; interest 2000000 x 8.25% x 122 days / 360 = 55916.67 (from 2027-03-01 to asOf 2027-07-01, the default still open, the last date excluded)

The reason rounds to the cent; the field is 55916.666667.

## The day basis

A year of 360 days charges a little more per day than one of 365, so the basis is part of the contract. The engine accepts either and refuses anything else:

> interest.dayBasis must be 365 or 360; got 366

The method, too, must be stated. A call that names none is refused:

> interest.interestMethod must be one of "simple", "monthly-compound"; got nothing

## Exercise

Work in the course's own recovery calculator, view "A default: cover, interest and consequences".

1. Start from "The Ekene March default, simple interest". Check PB's days and default interest, and the tile "Total default interest".
2. With the control "Day basis (stated)", choose 365 days. Check the new default interest, 20342.465753, and say why it fell. Choose 360 again.
3. Start from "The same default left open" and check the second row of the table above.
4. With the control "Interest method (stated)", choose "not stated" and read the refusal. Then clear "Default interest, percent a year (stated)" and read what the panel says is missing.
