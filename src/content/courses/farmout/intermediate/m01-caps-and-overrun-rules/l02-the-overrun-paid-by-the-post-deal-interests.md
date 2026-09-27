# The overrun paid by the post-deal interests

{{panel:farmout-deal-calculator}}

When a well costs more than its gross-cost cap, someone pays the excess. The overrun rule "post-deal-interests" splits it by the participating interests the parties hold after the event, as if the farm-out had already happened for that part of the cost.

## The case

The course states one well to show both overrun rules on the same excess. EKO holds 70.000000 percent and PA 30.000000; FIN pays 40.000000 percent to earn 30.000000 percent. The well costs 48000000.000000 against a gross-cost cap of 40000000.000000, an excess of 8000000.000000. No bonus and no reimbursement are stated.

| figure | engine |
| --- | --- |
| cap state | exceeded |
| promoted cost | 40000000.000000 |
| excess | 8000000.000000 |
| farminee pays | 18400000.000000 |
| farmor pays | 15200000.000000 |
| carry | 4000000.000000 |
| PA pays | 14400000.000000 |

## Reading the split

The cost splits in two parts. On the promoted 40000000.000000 FIN pays its agreed 40.000000 percent and EKO pays what is left of its own share. On the excess the promote stops: each party pays its participating interest after the event, FIN 30.000000, EKO 40.000000 and PA 30.000000. The engine's reason names both parts:

> well: gross cost 48000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; the gross cost exceeds the cap 40000000 by 8000000: the promote applies to 40000000; the excess is paid by the post-deal interests (FIN 30%, EKO 40%); FIN pays 18400000 (38.333333% of the gross cost), EKO pays 15200000, a carry of 4000000

The carry stays at 4000000.000000, the carry the promote produces on the capped cost. The excess adds nothing to it, because on the excess FIN pays only its own held share.

FIN's share of the whole cost falls below its promoted share: the reason prints 38.333333 percent of the gross cost. The larger the excess, the closer that share moves toward the 30.000000 percent FIN holds.

PA pays 14400000.000000, its own 30.000000 percent of the whole well. PA is outside the deal: its payment comes from the canonical partner split, and the overrun rule leaves it alone.

## What a report quotes

A payment is quoted with its share paid, interest earned, cap and overrun rule. The Ekene Deep success well uses this rule on a smaller excess, and FIN pays 18200000.000000 of it; on the well above, 18400000.000000 is FIN's payment under "post-deal-interests" only. The next lesson runs the same well under the other rule.

## Exercise

Work in the course's own deal calculator, which calls the same vendored engine.

1. Open the view "Caps, overrun rules and drill-to-earn" and start from "A gross-cost cap exceeded, the excess by the post-deal interests". Check the farminee, farmor and carry figures against the table above, and find PA's payment in the other parties' table.
2. With the control "event 1: gross cost (stated)", set the gross cost to 40000000. Read the new cap state and FIN's share of the gross cost.
3. Set it back to 48000000 and change "event 1: share the farminee pays, percent (stated)" to 30. Read the promote, the carry and FIN's payment, and write one sentence on why this rule leaves a heads-up deal with no carry on either part of the cost.
