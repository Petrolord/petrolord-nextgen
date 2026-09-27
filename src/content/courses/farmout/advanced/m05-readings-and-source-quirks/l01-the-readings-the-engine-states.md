# The readings the engine states

{{panel:farmout-deal-calculator}}

{{panel:farmout-valuation-calculator}}

Where a text leaves a choice open, the engine takes one and states it in its basis. The course calls each a reading, quotes it verbatim, and grades no figure that depends on it. There are four.

## Reading one: the valuation timing

> the success-case value is at the valuation date; well costs, bonus, reimbursement and fees fall at the valuation date, undiscounted

It acts on every EMV of the deal. A deal whose well costs, bonus, reimbursement and fees fell a year after the valuation date would discount them at the success-case rate and give different EMVs.

## Reading two: the day count of reg. 19(7)

> days from the notification of the consent to the payment: within 90 on time, 30 more of grace, then 0.01% of the fee a day straight line for up to 90 days, after which the consent is deemed withdrawn (reg. 19(7) to (9))

The Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024 (S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 9 April 2024, read on 2026-09-27) say "within 90 days of notification" (AOI Regulations 2024 reg. 19(7)). The engine counts from the notification date to the payment date without the notification day. Counting that day as well would move a payment on day 90 into the grace days.

## Reading three: the ninetieth surcharge day

The regulation imposes the surcharge "for 90 days failing which the consent is deemed withdrawn" (AOI Regulations 2024 reg. 19(9)). The engine charges the ninetieth surcharge day, day 210 after the notification, and deems the consent withdrawn from the ninety-first, day 211. The other reading would withdraw it on the ninetieth.

## Reading four: how a simple-interest uplift is paid

> a recovery pays the accrued interest first, then the principal

HMRC's manual says only that a carry's recovery usually includes "an addition representing simple interest" (HMRC Oil Taxation Manual OT18360). It does not say which is paid first. The engine pays the accrued simple interest first and charges simple interest on the outstanding principal only.

## A stated input, and no reading

The value of the transaction looks like a fifth choice and is not one:

> the value of the transaction is a stated input: the sum payable to the Assignor stated in the application or contract, or an amount the Commission determines (reg. 19(3)); the engine does not decide which consideration of a farm-out counts

## Naming a reading beside a figure

A reading is the engine's stated choice beside the text it reads, and the course never keys it as the law. A report names the reading its figure rests on.

## Exercise

In the valuation calculator, open the view "The readings the engine states" and read each block with its tiles. Then open the deal calculator on the view "The consent fee and its day rules" and start from "Paid on day 90". Move "Fee paid on, YYYY-MM-DD (optional)" one day later and read the payment status. Start from "Paid on day 210", move the payment one day later, and read the status and the total paid.
