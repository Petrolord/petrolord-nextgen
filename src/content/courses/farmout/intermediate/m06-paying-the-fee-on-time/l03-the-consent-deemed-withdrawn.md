# The consent deemed withdrawn

{{panel:farmout-deal-calculator}}

The surcharge runs for 90 days, and then the regulation stops charging and withdraws. An assignor that has not paid by the end of the surcharge days loses the consent: the regulation deems it withdrawn. The engine reports that as a result with its own status. This lesson reads the last surcharge day, the day after it, and the choice the engine states at that line.

## The last day and the day after

| case | notified | paid | days | status | surcharge days | surcharge | total paid |
| --- | --- | --- | --- | --- | --- | --- | --- |
| day 210 | 2027-01-01 | 2027-07-30 | 210 | surcharge | 90 | 3528.000000 | 395528.000000 |
| day 211 | 2027-01-01 | 2027-07-31 | 211 | consent-deemed-withdrawn | 0 | 0.000000 | none |

The engine's reason on day 211:

> paid 211 days after the notification: more than 90 surcharge days after the 90 + 30 days; the consent is deemed withdrawn (reg. 19(9))

On day 211 the engine returns no total paid. The fee itself is still computed, 392000.000000; the engine reports the total paid as "none" and names the status.

## A result with a reason

A consent deemed withdrawn is no refusal. The call succeeds, every input is valid, and the engine says what the stated dates mean under the regulation. The same holds for an event not completed and a break-even that does not exist: the engine returns a result with its reason. A refusal is different in kind. It names a field the call could not use, and returns no result at all.

## The ninetieth surcharge day

The regulation imposes the surcharge "for 90 days failing which the consent is deemed withdrawn" (AOI Regulations 2024 reg. 19(9)). It does not say whether the ninetieth surcharge day is still a day of surcharge or the first day of withdrawal. The engine takes one reading and states it in its basis:

> days from the notification of the consent to the payment: within 90 on time, 30 more of grace, then 0.01% of the fee a day straight line for up to 90 days, after which the consent is deemed withdrawn (reg. 19(7) to (9))

It charges the ninetieth surcharge day, day 210, and deems the consent withdrawn from day 211. This is the engine's stated choice beside the text it reads, and the course teaches it as that. The other reading would withdraw the consent a day earlier. The Expert tier returns to the readings and names what each would move.

Like the day count of the first lesson, this reading acts only at a day boundary. A payment well inside the grace days or the surcharge days gives the same status under either.

## What a report says about timing

A report that quotes a fee quotes its value of the transaction and its dates: the notification, the payment, the days between them and the status. A fee paid on day 90 is on time under the engine's count; a report states the count so a reader can see which day it is.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The consent fee and its day rules" and start from "Paid on day 211". Read the payment tiles and the reason, and confirm the fee tiles still show 392000.000000.
2. Start from "Paid on day 210". With the control "Fee paid on, YYYY-MM-DD (optional)", change the date to 2027-07-31 and read the new status.
3. Delete the whole `"payment"` entry from the box, with its braces, and read what the fee view shows about timing.
