# The materials tender ranked

{{panel:pr-envelope-calculator}}

{{panel:pr-award-calculator}}

This lesson puts the module together on the whole materials tender: every term of each responsive bid's evaluated cost, and the same four bids ranked with and without the life cycle. The tender is synthetic and its situations were planted by the script that wrote it; MS4's omitted inspection line is one of them.

## Every term

The four bids that passed the pass mark of 60, with the omission rule at the average, a delivery schedule of minWeeks 8, maxWeeks 14 and ratePerWeek 0.0025, and a life cycle of 5 years at 0.1:

| rank | bid | corrected price | omissions | schedule adjustment | life-cycle cost | evaluated cost |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MS4 | 503930.000000 | 12000.000000 | 3779.475000 | 26535.507386 | 546244.982386 |
| 2 | MS2 | 525700.000000 | 0.000000 | 1314.250000 | 20849.327232 | 547863.577232 |
| 3 | MS1 | 540300.000000 | 0.000000 | 2701.500000 | 22744.720616 | 565746.220616 |
| 4 | MS3 | 562500.000000 | 0.000000 | 0.000000 | 18953.933847 | 581453.933847 |

Each row is the sum of its terms, and each term is an Associate method you already know except the life-cycle cost.

**The omission.** MS4 prices no inspection line. The other responsive bids price it at 9500.000000 (MS2), 12000.000000 (MS1) and 14500.000000 (MS3), and the engine adds their average, 12000.000000, to MS4. MS5 failed the pass mark, so its price for inspection is never opened and never enters the average. The rule is ITB 34.1 of the World Bank Standard Procurement Documents, Request for Bids, two-envelope (Works, September 2025; Goods, February 2025; both read on 2026-09-26).

**The schedule.** MS4 delivers in 11 weeks, 3 beyond the minimum of 8, so 0.0025 x 3 x its corrected price is added. MS3 delivers in 8 weeks and pays nothing; no bid earns a credit for delivering early.

## With and without the life cycle

The same four bids, the same call with the life cycle left out:

| rank | bid | without the life cycle | with it |
| --- | --- | --- | --- |
| 1 | MS4 | 519709.475000 | 546244.982386 |
| 2 | MS2 | 527014.250000 | 547863.577232 |
| 3 | MS1 | 543001.500000 | 565746.220616 |
| 4 | MS3 | 562500.000000 | 581453.933847 |

On this tender the order is the same both ways. The life cycle adds between 18953.933847 and 26535.507386 to a bid, and the gap between MS4 and MS2 narrows from 7304.775000 to 1618.594846.

That narrowing is the lesson of the module. MS4 wins on a lower price loaded with the dearest maintenance, and once the maintenance is counted the lead is small. It is smaller than MS4's omission, which is priced by a stated rule. A committee reading this ranking should see how much of the winning margin rests on settings: the discount rate, the life-cycle years and the omission rule each move a figure, and the report states all three.

## The award

With no rated criteria, the award goes to the lowest evaluated cost, MS4 at 546244.982386. That is the award before the Nigerian content Act is applied. MS2 sits 0.296313 percent above MS4, close enough that the Act's s.14 comes into play, and modules 4 to 6 of this tier show how the reading of that section decides between them.

## Exercise

Start in the award calculator on the view "Evaluated cost with a life-cycle cost" and copy the four bids from its input box. Open the envelope calculator on the view "Evaluated cost of the passing bids", paste the four bids over the well services bids, keep the omission rule at the average, and set minWeeks 8, maxWeeks 14 and ratePerWeek 0.0025. Its table has no life cycle, so check it against the "without" column above and read MS4's omission reason. Back in the award calculator, confirm the "with" column. Then, in the award calculator, give MS4 a completionWeeks of 8 and record whether its lead over MS2 grows, and by how much, from the two evaluated costs the table prints.
