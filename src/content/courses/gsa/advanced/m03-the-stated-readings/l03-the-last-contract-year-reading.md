# The last contract year reading

{{panel:gsa-contract-calculator}}

A deficiency opens a right to take the gas in the years that follow, and the last contract year has none. The engine's third stated reading says what a deficiency in that year does, and what the end-of-term rule covers.

## The engine's reading

The reading sits in the same `takeOrPay` basis as the last lesson's:

> a last-contract-year deficiency creates no make-up right (forfeit/refund applies to earlier years' make-up only)

A deficiency in the last year is paid like any other and opens no make-up right. The end-of-term rule, forfeit or refund, applies to the make-up still outstanding from EARLIER years.

## The texts it reads

The Commonwealth model agreement (2025, CC BY 4.0) prints three alternatives for the end of the Delivery Period in Article 12.7: forfeit, refund and extending the term. Under the second, the seller refunds the aggregate at the last year's take-or-pay price:

> "Seller shall pay to Buyer an amount equal to the value of the Make-Up Aggregate multiplied by the Take or Pay Price in the Contract Year in which the Delivery Period expires."

The Make-Up Aggregate is defined over prior contract years, so a deficiency of the expiry year itself is outside it. The engine reads the refund, and the forfeit, as covering the earlier entries only. Extending the term is not modelled.

## Where it acts

The golden refund case has a deficiency in its last year, 2029, beside make-up still open from 2027. The engine's reasons for that year, verbatim:

> 2029: make-up aggregate 150 available and none taken, because taken 700 does not exceed the Adjusted ACQ 1000

> 2029: 700 counted against the take-or-pay quantity 800 leaves a deficiency of 100; the deficiency payment is 100 x 4 = 400; the delivery period ends with this year, so no make-up right arises

> 2029: the delivery period ends with make-up of 150 unrecovered; the seller refunds 150 x 4 = 600

The refund covers the 150.000000 from 2027 only. The year's own deficiency payment stays with the seller.

## The two Ekene agreements at their ends

The Ekene power plant (synthetic) forfeits at the end of its term. In 2034 the buyer takes above the Adjusted ACQ, draws 105000.000000 of make-up, and the rest of the 2033 entry is forfeited:

> 2034: the delivery period ends with make-up of 252000 unrecovered; the buyer forfeits it

The Ekene export feed (synthetic) refunds the rest of its 2035 entry at the 2036 take-or-pay price:

> 2036: the delivery period ends with make-up of 457950 unrecovered; the seller refunds 457950 x 8.0813 = 3700831.3350000004

The reason carries the double the engine holds. The course reasons with the refund field at six decimals, 3700831.335000.

## Exercise

Open the contract calculator on "The whole contract in money". It starts on the Ekene export feed. Set the 2036 taken to 18396000, the quantity the buyer took in 2035, and read the 2036 reasons: the deficiency, its payment, and what the engine says about a make-up right. Read the refund and state which year's entry it covers. Then restore the take and set makeUp.endOfTerm to forfeit, and read which line of 2036 changes.
