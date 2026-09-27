# Heads up and a full carry

{{panel:farmout-earning-calculator}}

A promote lives between two edges. At one edge the farminee pays only its own share of the well, and the promote is nothing. At the other it pays the farmor's whole pre-deal share, and the farmor pays nothing at all. The engine reads both edges with the same rule, and this lesson reads the three worked cases that sit on them.

## The three edge cases

All three state EKO at 70.000000 percent, PA at 30.000000, and a well of 40000000.000000 with no cap.

| worked case | share paid | held after | promote points | promote ratio | farminee pays | farmor pays | carry |
| --- | --- | --- | --- | --- | --- | --- | --- |
| earn-heads-up | 30.000000 | 30.000000 | 0.000000 | 1.000000 | 12000000.000000 | 16000000.000000 | 0.000000 |
| earn-full-carry | 70.000000 | 30.000000 | 40.000000 | 2.333333 | 28000000.000000 | 0.000000 | 16000000.000000 |
| earn-all-of-farmor | 70.000000 | 70.000000 | 0.000000 | 1.000000 | 28000000.000000 | 0.000000 | 0.000000 |

## Heads up

In `earn-heads-up` FIN pays 30.000000 percent for 30.000000 percent. The promote is 0.000000 points, the ratio 1.000000 and the carry 0.000000: the farminee pays its own share and nothing of the farmor's. EKO, with 40.000000 percent after the deal, pays its own 16000000.000000. A heads-up deal still moves a participating interest, and it can still carry a cash bonus or a reimbursement; it simply has no promote.

## A full carry

In `earn-full-carry` FIN pays 70.000000 percent, the whole of EKO's pre-deal share, to earn 30.000000 percent. The promote is 40.000000 points and the ratio 2.333333. EKO pays 0.000000 and the carry is 16000000.000000, which is EKO's whole post-deal share of the well. In the engine's words:

> well: gross cost 40000000; FIN pays 70% to earn 30% (30% held after it): a promote of 40 points, ratio 70 / 30; no cap: the promote applies to the whole gross cost; FIN pays 28000000 (70% of the gross cost), EKO pays 0, a carry of 16000000

This is the most a farminee can pay, because it pays only the farmor's side of the well. A larger share is refused:

> events[0].farmineePaysPct must be at most 70, the farmor's interest before the deal (the farminee pays no other party's share); got 75

## All of the farmor's share

In `earn-all-of-farmor` FIN pays 70.000000 percent to earn all 70.000000 percent. Paying the whole share for the whole participating interest is heads up again: a promote of 0.000000 points, a ratio of 1.000000 and a carry of 0.000000. EKO leaves the well, and the farm-out is an outright transfer of its participating interest paid for with work.

## Reading between the edges

Every deal in this tier sits between these rows. As the share paid rises from the participating interest earned towards the farmor's pre-deal share, the promote, the ratio and the carry all rise, and the farmor's payment falls to 0.000000.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "A heads-up deal". Check its row against the table above. Then use the "event 1: share the farminee pays, percent (stated)" control to step the share paid through 40, 50 and 70, running each time, and write down the promote points, the ratio, the carry and what the farmor pays at each step. Finally start from "A full carry" and check your last step against it.
