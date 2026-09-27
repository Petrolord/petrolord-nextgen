# A cap on the carry amount

{{panel:farmout-deal-calculator}}

A carry-amount cap draws its line on the carry itself: the money the farminee pays toward the farmor's post-deal share. Once the carry reaches the cap, the farminee pays its own held share and nothing more of the farmor's. There is no excess to split, so a carry-amount cap takes no overrun rule.

## One well under four carry caps

EKO holds 70.000000 percent and PA 30.000000; FIN pays 40.000000 percent of a 40000000.000000 well to earn 30.000000 percent. Without a cap the carry would be 4000000.000000. The course states the same well under four carry-amount caps:

| cap | cap state | farminee pays | farmor pays | carry | PA pays |
| --- | --- | --- | --- | --- | --- |
| 5000000.000000 | below | 16000000.000000 | 12000000.000000 | 4000000.000000 | 12000000.000000 |
| 4000000.000000 | exactly | 16000000.000000 | 12000000.000000 | 4000000.000000 | 12000000.000000 |
| 2500000.000000 | exceeded | 14500000.000000 | 13500000.000000 | 2500000.000000 | 12000000.000000 |
| 0.000000 | exceeded | 12000000.000000 | 16000000.000000 | 0.000000 | 12000000.000000 |

The reason for the cap of 2500000.000000:

> well: gross cost 40000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; the carry 4000000 is held at the cap 2500000; EKO pays the rest of its 40% share; FIN pays 14500000 (36.25% of the gross cost), EKO pays 13500000, a carry of 2500000

## Reading the table

Below the cap nothing changes: the carry the promote produces is paid in full. When the carry would pass the cap, it is held there. FIN pays its own 30.000000 percent of the well plus the capped carry, and EKO pays the rest of its 40 percent post-deal share. The cap of 0.000000 shows the limit: no carry at all, FIN pays 12000000.000000, its own held share, and EKO pays 16000000.000000. The promote in points still reads 10 in every row, because the promote describes the terms stated; the cap limits the money.

PA pays 12000000.000000 in every row. Like the overrun rule, a carry cap moves money between the farmor and the farminee only.

## Where the Ekene Deep terms use it

The Ekene Deep drill-to-earn states a carry-amount cap of 3000000.000000 on its second event, the appraisal well. The next module works that event, whose carry reaches its cap exactly.

## What the engine refuses

A carry-amount cap with an overrun rule is refused, and the message says why:

> events[0].cap.overrunRule must be left out when on is "carry-amount" (the farmor pays the rest of its own share); got "farmor-side"

The panel's cap control rewrites the whole cap when its type changes, so this refusal is reached by typing in the box, for example by switching a gross-cost cap to "carry-amount" and leaving its rule behind:

> events[0].cap.overrunRule must be left out when on is "carry-amount" (the farmor pays the rest of its own share); got "post-deal-interests"

## Exercise

Work in the course's own deal calculator.

1. Open the view "Caps, overrun rules and drill-to-earn" and start from "A carry-amount cap exceeded". Check each figure against its row above and read the reason.
2. With the control "event 1: cap amount (stated)", step the cap through 5000000, 4000000 and 0. Read the cap state and the carry each time.
3. Start from "A gross-cost cap exceeded, the excess by the post-deal interests". In the box, change the cap's `"on"` from gross-cost to carry-amount, leave `"overrunRule"` where it is, and read the refusal. Then remove the rule and read the carry.
