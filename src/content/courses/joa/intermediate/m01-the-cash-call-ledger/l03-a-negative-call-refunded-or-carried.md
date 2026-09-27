# A negative call, refunded or carried

{{panel:joa-recovery-calculator}}

A credit that reaches a call can be larger than the forecast share it is set against, and the arithmetic then asks the party for a negative amount. An agreement says what happens to that excess: the operator pays it back, or it waits for the next call.

## What the texts say

The Norwegian Accounting Agreement (Attachment B, unofficial English translation, PDF dated 27 February 2007, cited from its Wayback Machine capture of 26 May 2024, read on 2026-09-26) refunds the excess unless the parties agree otherwise:

> "the Operator shall refund the excess amounts as soon as possible, unless the Parties agree to transfer the amount to the following period." (Norway Accounting Agreement Art. 1.2.1)

The Kenya Model PSC 2015, Participation Agreement (2015 model, read on 2026-09-26) reduces the next advance, and lets a non-operator ask for the money back:

> "non-operator(s) may request that excess advances be refunded. The operator shall make such refund within fifteen (15) days after date of such notice." (Kenya Model PSC 2015, Participation Agreement Art. 6.4)

Both texts allow both outcomes, so the engine holds neither. The negative call rule is a stated input, "refund" or "carry", and any other word is refused:

> negativeCall must be one of "refund", "carry"; got "net"

## September 2027 under "carry"

July 2027 was forecast at 15000000.000000 and spent 13800000.000000, an over-call of 1200000.000000. With a lag of 2 months it reaches September, whose forecast is only 1000000.000000. The Ekene terms state "carry", and the engine's basis reads:

> an adjustment above the forecast share makes the call 0 and the rest is carried to the next call

| party | September forecast share | adjustment | call | carried |
| --- | --- | --- | --- | --- |
| EKO | 500000.000000 | 600000.000000 | 0.000000 | 100000.000000 |
| PA | 312500.000000 | 375000.000000 | 0.000000 | 62500.000000 |
| PB | 187500.000000 | 225000.000000 | 0.000000 | 37500.000000 |

> 2027-09: the adjustment exceeds the forecast share of EKO, PA, PB: the call is 0 and the rest of the credit is carried to the next cash call

In October the carried 200000.000000 meets the next call together with August's under-call:

> 2027-10: a credit of 200000 held from 2027-09 is applied to this cash call

EKO's October adjustment is 48000.000000: its August under-call share of -52000.000000 plus the 100000.000000 it carried. Its October call is 3952000.000000 on a forecast share of 4000000.000000.

## The same month under "refund"

With the rule stated as "refund", September's calls total -200000.000000: the operator pays the excess back in that month.

> 2027-09: the adjustment exceeds the forecast share of EKO, PA, PB: the excess is refunded (a negative call)

Over the year the two rules give the same calls in total, 68604000.000000, and the same EKO closing balance, -48000.000000. On this ledger the rule changes the month in which the cash moves, and leaves the yearly totals as they were.

## Exercise

Work in the course's own recovery calculator, view "The cash call ledger".

1. Start from "The Ekene 2027 ledger, a credit carried". Check the September rows and EKO's October adjustment against the figures above.
2. Start from "The same ledger, a negative call refunded". Read September's calls and the tile "Calls over the ledger", and check that the yearly total matches the carried ledger.
3. In the carried ledger, use the control "A negative call is (stated)" to switch the rule to refund. Confirm that you reach the same September figures as step 2.
4. In the box, change `negativeCall` to `"net"` and read the refusal.
