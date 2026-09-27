# The overrun paid by the farmor side

{{panel:farmout-deal-calculator}}

The second overrun rule is "farmor-side": the excess over a gross-cost cap is paid by the farmor alone, at its whole pre-deal participating interest, and the farminee pays nothing of it. This lesson runs the last lesson's well under this rule.

## The same well, the other rule

EKO holds 70.000000 percent and PA 30.000000; FIN pays 40.000000 percent to earn 30.000000 percent. The well costs 48000000.000000 against a gross-cost cap of 40000000.000000, an excess of 8000000.000000.

| figure | post-deal-interests | farmor-side |
| --- | --- | --- |
| farminee pays | 18400000.000000 | 16000000.000000 |
| farmor pays | 15200000.000000 | 17600000.000000 |
| carry | 4000000.000000 | 1600000.000000 |
| PA pays | 14400000.000000 | 14400000.000000 |

The engine's reason under the farmor-side rule:

> well: gross cost 48000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; the gross cost exceeds the cap 40000000 by 8000000: the promote applies to 40000000; the excess is paid by the farmor side alone (EKO pays its whole 70% share of it); FIN pays 16000000 (33.333333% of the gross cost), EKO pays 17600000, a carry of 1600000

## Reading the two columns

Under "farmor-side" FIN pays 16000000.000000, which is its promoted 40.000000 percent of the capped 40000000.000000 and nothing more. EKO pays its own share of the capped cost and its whole 70 percent share of the excess, the share it held before the deal.

The carry falls from 4000000.000000 to 1600000.000000. The engine measures the carry against the whole gross cost: what the farminee pays less its own held interest of that cost. The excess raises FIN's held share of the cost while FIN pays nothing more, so the part of EKO's share that FIN covers shrinks.

PA pays 14400000.000000 in both columns. The overrun rule moves money between the farmor and the farminee only. PA's payment is its own interest of the gross cost, through the canonical partner split, whatever the two sides agree between themselves.

## Which rule a deal states

The engine picks neither. Both are stated deal terms, and a gross-cost cap without one is refused by name. A farmor that wants the farminee to share an overrun states "post-deal-interests". A farminee that wants a hard ceiling on its own cost states "farmor-side". On this well the gap between the two farminee payments is exactly FIN's post-deal share of the excess, and the farmor's payment moves by the same amount the other way.

## On the Ekene Deep deal

The Ekene Deep deal states "post-deal-interests". The module on deal value returns to a variant with the excess by the farmor side: only the success well exceeds the cap, so the rule moves each side's success payoff.

## Exercise

Work in the course's own deal calculator.

1. Open the view "Caps, overrun rules and drill-to-earn" and start from "The same, the excess by the farmor side". Check the three payments and the carry against the farmor-side column.
2. With the control "event 1: the excess over the cap is (stated)", choose "paid by the post-deal interests". Confirm that PA's payment in the other parties' table stays where it was while FIN's and EKO's move.
3. Return to "paid by the farmor side alone" and raise "event 1: gross cost (stated)" to 46000000. Read FIN's payment and explain from the reason why it did not move.
