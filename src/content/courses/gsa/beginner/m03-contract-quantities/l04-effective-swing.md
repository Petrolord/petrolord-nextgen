# Effective swing against the take-or-pay level

{{panel:gsa-quantity-calculator}}

Swing measures how far above the DCQ a buyer may nominate on one day. The take-or-pay level measures how little of the year's gas the buyer may take before it pays for gas it did not take. Put the two together and you have a single figure for the seller's exposure: effective swing, the ratio of the most the buyer can ask for to the least it must pay for.

## The rule, as HMRC states it

HMRC's Oil Taxation Manual (OT05402, updated 19 December 2019) defines it in one sentence:

> "is derived from the result of dividing the swing factor by the take or pay level, or maximum daily capacity by the minimum take." (HMRC Oil Taxation Manual OT05402 (updated 19 December 2019))

The engine's rule: effective swing = swing factor / take-or-pay fraction. A seller facing an effective swing of 1.375000 must be able to deliver, on any day, 1.375000 times the daily quantity the buyer is bound to pay for on average.

| case | MaxDCQ percent | take-or-pay percent | swing factor (engine) | effective swing (engine) |
| --- | --- | --- | --- | --- |
| power plant | 110 | 80 | 1.100000 | 1.375000 |
| HMRC's own figures | 150 | 90 | 1.500000 | 1.666667 |

## A printed figure and the engine's figure

HMRC's manual works the same division, 150 over 90, and prints 1.66. The engine returns 1.666667. The manual's figure is the exact quotient cut after two decimals. This course quotes the engine's figure and names 1.66 as the figure the manual prints. When a text prints a figure the engine computes more exactly, the course says which is which and does not treat them as the same number.

## Reading it from both sides

A higher effective swing favours the buyer: it may take a lot on busy days and little on quiet ones and still meet its obligation. A lower one favours the seller, whose facilities then run closer to a steady load. The power plant's contract, at 1.375000, gives its buyer less room than the HMRC example's 1.666667, because its swing is much smaller. Its lower take-or-pay level pushes the other way, and the smaller swing wins.

## The take-or-pay level cannot be zero with swing stated

Effective swing divides by the take-or-pay fraction, so a zero percentage cannot sit beside a MaxDCQ:

> topPct must be above 0 when maxDcqPct is stated (the effective swing divides by it); got 0

Without a MaxDCQ, a take-or-pay percentage of 0 is accepted: the take-or-pay quantity is 0.000000 and no effective swing is printed.

## Effective swing is a measure

Nothing in the engine turns effective swing into a quantity or a payment. It is a figure for comparing contracts and for sizing facilities. The quantities that are reconciled at the year's end are the ACQ, the Adjusted ACQ and the take-or-pay quantity.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Contract quantities and swing". Run the starting case and read the swing factor and the effective swing. Then enter HMRC's figures: `dcq` 100, `days` 365 in place of `year`, `maxDcqPct` 150 and `topPct` 90. Read the effective swing and compare it with the figure the manual prints. Set `topPct` to 0 and read the refusal, then remove `maxDcqPct` and run it once more.
