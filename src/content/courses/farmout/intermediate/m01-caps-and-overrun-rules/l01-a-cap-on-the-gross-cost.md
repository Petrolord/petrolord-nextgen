# A cap on the gross cost

{{panel:farmout-earning-calculator}}

{{panel:farmout-deal-calculator}}

At Associate you worked one event's split on the Ekene Deep well. A cap already sat in those terms, and this module opens it. A cap limits how much of a well's cost the promote applies to, and an overrun rule says who pays the rest. Both are stated deal terms with no default in the engine. The Ekene Deep prospect and its parties are synthetic.

## The rule the engine states

The engine's cap rule, from its basis:

> gross-cost: the promote applies to the gross cost up to the cap, the excess by the stated overrun rule; carry-amount: the carry is held at the cap and the farmor pays the rest of its own share; none: no cap. Every cap, share and interest is a stated input with no default

A gross-cost cap is a line drawn on the well's cost. Up to the line the farminee pays its promoted share. Above it the promote stops, and the excess is split by the overrun rule the deal states: "post-deal-interests" or "farmor-side".

## The Ekene Deep well against its cap

FIN pays 40.000000 percent of the well to earn 30.000000 percent from EKO. The success well costs 46000000.000000 and the cap is 44000000.000000, so the promote applies to the first 44000000.000000 and the excess of 2000000.000000 is paid by the post-deal interests.

| figure | engine |
| --- | --- |
| cap state | exceeded |
| farminee pays | 18200000.000000 |
| farmor pays | 14000000.000000 |
| carry | 4400000.000000 |
| share of the gross cost the farminee pays | 39.565217 |

The engine's reason says each step:

> Ekene Deep-1 exploration well: gross cost 46000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; the gross cost exceeds the cap 44000000 by 2000000: the promote applies to 44000000; the excess is paid by the post-deal interests (FIN 30%, EKO 40%); FIN pays 18200000 (39.565217% of the gross cost), EKO pays 14000000, a carry of 4400000

FIN's share of the whole cost, 39.565217 percent, sits below the 40.000000 percent it agreed to pay: its promote stops at the line.

## A cap the well never reaches

A well of 40000000.000000 under a cap of 50000000.000000 is "below" it: FIN pays 16000000.000000, 40.000000 percent of the gross cost, as if no cap were stated.

## What the engine refuses

A gross-cost cap needs its overrun rule:

> events[0].cap.overrunRule must be one of "post-deal-interests", "farmor-side"; got nothing

## Exercise

1. In the course's own earning calculator, start from "The Ekene Deep well, a gross-cost cap". Find the cap state and the share of the gross cost the farminee pays, and read the reason line that names the excess.
2. In the deal calculator, open the view "Caps, overrun rules and drill-to-earn" and start from "A gross-cost cap not reached". Check that the farminee pays 16000000.000000 with the cap state "below".
3. Set the control "event 1: the excess over the cap is (stated)" to "not stated" and read the refusal. Then choose "paid by the post-deal interests" again.
