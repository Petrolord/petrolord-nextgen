# The grace reading

{{panel:joa-recovery-calculator}}

{{panel:joa-agreement-calculator}}

The second reading concerns a grace period on a late cash call payment. A grace can be read as a window inside which a late payment carries no charge, after which default interest runs from the due date, or as a delay to the start of default interest. The engine takes the first.

## The text

The Kenya Model Production Sharing Contract 2015, Participation Agreement (the 2015 model, file name dated 21 January 2015, read on 2026-09-26) prints the clause the engine follows:

> "A payment not received within seventy-two (72) hours of the due date shall accrue interest from the due date" (Kenya Model PSC 2015, Participation Agreement Art. 6.7)

and the way the interest runs:

> "compounded monthly and calculated from the due date of payment." (Kenya Model PSC 2015, Participation Agreement Art. 6.7)

## The reading, in the engine's words

With a stated grace of 72 hours the engine's basis reads:

> a stated grace of 72 hours (days x 24 from the due date): a default cured within it carries no interest; one cured later carries interest from the due date, as the Kenya Model PSC 2015 Participation Agreement Art. 6.7 prints (72 hours)

The grace is counted in hours, days times 24 from the due date. Cured inside it, a default carries no default interest; cured after it, default interest runs for every day from the due date.

## Where the reading acts

PB owes 2000000.000000 on the call due 2027-03-01, at a stated 8.25 percent a year, simple, on a 360-day basis:

| case | grace (hours) | cured on | days | within the grace | default interest |
| --- | --- | --- | --- | --- | --- |
| last hour | 72 | 2027-03-04 | 3 | true | 0.000000 |
| exceeded | 72 | 2027-03-05 | 4 | false | 1833.333333 |
| fractional grace | 71.5 | 2027-03-04 | 3 | false | 1375.000000 |

Cured after exactly 72 hours, PB is inside the grace. Cured a day later, it owes default interest on all 4 days. Under a grace of 71.5 hours, 3 days are already beyond it. The engine writes the exceeded case:

> PB: share of the call 2250000, paid 250000, unpaid 2000000; interest 2000000 x 8.25% x 4 days / 360 = 1833.33 (from 2027-03-01 to the cure on 2027-03-05, the last date excluded); the stated grace of 72 hours is exceeded, so interest runs from the due date

A contract whose grace also delays the start of default interest would give a smaller figure in the exceeded case. The engine follows the printed clause, and the course grades no figure that depends on which reading applies.

## The grace is stated, even when it is zero

The engine holds no grace of its own. A contract with none states 0, and a call that says nothing is refused:

> interest.graceHours must be a finite number of hours at or above 0, stated (0 when the contract gives no grace; the engine holds no default); got nothing

## Exercise

Open the agreement calculator on the view "The three stated readings" and read reading two with its two tiles. Then switch the view to "A default and forfeiture", which starts on the Ekene March default. Set the control "Grace, hours (stated, 0 for none)" to 72 and change PB's `curedOn` in the box to 2027-03-05; read the default interest and the reason. Change `curedOn` to 2027-03-04 and read them again. Last, state a grace of 71.5 hours and read the row once more. Write a sentence on each run naming the grace, the days and whether the reading acted.
