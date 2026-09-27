# Ninety days and thirty more

{{panel:farmout-deal-calculator}}

The fee is due after the consent is granted, and the 2024 Regulations set the days. The assignor has 90 days from the notification of the consent, then 30 more, before any surcharge runs. This module counts those days. The dates are optional inputs: a fee call without them computes the fee and says nothing about timing.

## The texts

> "(7) Every Assignor shall be required to pay an applicable fee to an account provided by the Commission within 90 days of notification of the grant of the relevant consent" (AOI Regulations 2024 reg. 19(7))

> "the Assignor shall have an additional 30 days within which to pay or complete payment." (AOI Regulations 2024 reg. 19(8))

## How the engine counts

The engine states its count in its basis:

> days from the notification of the consent to the payment: within 90 on time, 30 more of grace, then 0.01% of the fee a day straight line for up to 90 days, after which the consent is deemed withdrawn (reg. 19(7) to (9))

Days run from the notification date to the payment date, the notification day not counted. That count is one of the readings the engine names: the regulation says "within 90 days of notification" and leaves the count open, and counting the notification day as well would move a payment on day 90 into the grace days. The Expert tier returns to the readings.

## The days on the course's cases

| case | notified | paid | days | status |
| --- | --- | --- | --- | --- |
| the Ekene fee | 2027-05-03 | 2027-07-30 | 88 | on-time |
| day 90 | 2027-01-01 | 2027-04-01 | 90 | on-time |
| day 91 | 2027-01-01 | 2027-04-02 | 91 | within-grace |
| day 120 | 2027-01-01 | 2027-05-01 | 120 | within-grace |

The engine's reasons at the two edges of the grace days:

> paid 90 days after the notification: within the 90 days of reg. 19(7)

> paid 91 days after the notification: inside the further 30 days of reg. 19(8); no surcharge

Within the grace days the total paid is still the fee, 392000.000000, with no surcharge.

## Dates the engine refuses

A payment cannot come before its notification:

> payment.paidOn must be on or after the notification 2027-01-10; got "2027-01-09"

And a date must be a real one:

> payment.notifiedOn must be a real date 'YYYY-MM-DD'; got "2027-02-30"

## Exercise

Work in the course's own deal calculator.

1. Open the view "The consent fee and its day rules" and start from "The Ekene consent fee, paid on time". Read the days, the status and the payment reason.
2. Start from "Paid on day 91". With the control "Fee paid on, YYYY-MM-DD (optional)", change the date to 2027-04-01 and read the new status.
3. With "Consent notified on, YYYY-MM-DD (optional)", change the notification to 2027-05-01, after the payment, and read the refusal.
