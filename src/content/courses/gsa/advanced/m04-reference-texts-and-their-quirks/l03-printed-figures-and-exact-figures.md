# Printed figures and exact figures

{{panel:gsa-quantity-calculator}}

{{panel:gsa-contract-calculator}}

A published text prints its figures to the precision its authors chose. The engine computes the same arithmetic in full. When the two differ, the difference is almost never a mistake in either: it is a printed figure cut or rounded for the page. Reading a source critically means knowing which figure is which, quoting each as its own, and never passing a printed figure off as the engine's or the engine's as the text's.

## HMRC's effective swing

The HMRC Oil Taxation Manual, OT05402 (updated 19 December 2019, read on 2026-09-26), defines effective swing by a division:

> "is derived from the result of dividing the swing factor by the take or pay level, or maximum daily capacity by the minimum take."

Its example divides a swing of 150 by a take-or-pay level of 90 and prints 1.66. The engine on the same figures returns 1.666667. The course's golden file records the rule behind the difference, verbatim: "printed truncated: 150/90 = 1.666...; the manual prints 1.66 and a factor of 6.6". The manual's figure is the exact quotient cut after two decimals, 1.660000 when written to the course's precision. The course quotes 1.666667 as the engine's and 1.66 as the manual's.

## The Energy Charter Secretariat's parity slope

The Energy Charter Secretariat (2007), section 4.5.3.3, prints the heat-equivalence slope as 0.172. On 5.8 MMBtu per barrel the engine returns 0.172414. Run backwards, the printed slope implies 5.813953 MMBtu per barrel, so the printed slope is a rounded figure.

| source | printed | the engine, on the source's own inputs |
| --- | --- | --- |
| HMRC OT05402, effective swing | 1.66 | 1.666667 |
| Energy Charter Secretariat, parity slope | 0.172 | 0.172414 |

## The engine's own printed figures

The engine prints figures too, inside its reasons and messages, and it prints each as the shortest round-trip decimal of the double it holds. Most read cleanly. Some carry the last bits of binary arithmetic. The Ekene export feed's refund reason reads, verbatim:

> 2036: the delivery period ends with make-up of 457950 unrecovered; the seller refunds 457950 x 8.0813 = 3700831.3350000004

The refund FIELD, the number a report or a capstone reads, is 3700831.335000 at the course's six decimals. A reason is a record of the working. The course quotes it whole and reasons with the field.

## Printed alike is not equal

The same care runs the other way. Two figures that print alike at six decimals are not thereby equal, and the course never keys them as equal unless the engine says so. A boundary rule, such as a deficiency only when the counted quantity is below the take-or-pay quantity, is decided on the numbers the engine holds.

## Exercise

Open the quantity calculator on "Contract quantities and swing". Enter a DCQ of 100, 365 days, a maxDcqPct of 150 and a topPct of 90, and read the swing factor and the effective swing. Cut the effective swing after two decimals and compare with the manual's printed figure. Then open the contract calculator on "Energy parity", enter 5.813953 and read the slope, and explain in one sentence what that says about the printed 0.172. Finally write the refund of the Ekene export feed as a report would quote it, with the reason beside it.
