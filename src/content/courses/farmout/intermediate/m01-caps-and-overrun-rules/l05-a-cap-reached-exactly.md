# A cap reached exactly

{{panel:farmout-deal-calculator}}

A cap has a boundary at the line itself. When the gross cost equals a gross-cost cap, or the carry equals a carry-amount cap, the engine reports a third state beside "below" and "exceeded": "exactly".

## A gross cost equal to its cap

EKO holds 70.000000 percent and PA 30.000000; FIN pays 40.000000 percent of a 40000000.000000 well to earn 30.000000 percent, with a gross-cost cap of 40000000.000000 and the overrun rule "post-deal-interests".

| cap state | excess | farminee pays | farmor pays | carry | PA pays |
| --- | --- | --- | --- | --- | --- |
| exactly | 0.000000 | 16000000.000000 | 12000000.000000 | 4000000.000000 | 12000000.000000 |

The engine's reason:

> well: gross cost 40000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; the gross cost reaches the cap 40000000 exactly: the promote applies to all of it, with no excess; FIN pays 16000000 (40% of the gross cost), EKO pays 12000000, a carry of 4000000

The split is that of the same well under a cap of 50000000.000000, which it never reaches; the overrun rule has nothing to act on.

## A carry equal to its cap

The same well with a carry-amount cap of 4000000.000000 gives a carry of 4000000.000000, and the engine says so:

> well: gross cost 40000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; the carry reaches the cap 4000000 exactly; FIN pays 16000000 (40% of the gross cost), EKO pays 12000000, a carry of 4000000

Again the money matches the row with a cap of 5000000.000000. A cap reached exactly splits the cost as a cap not reached would.

## Why the state is worth reading

Where a deal sits on its cap, the next dollar of cost or carry is paid under a different rule, and the state says so. The Ekene Deep appraisal well of the next module sits in exactly this place.

## A cap of "none" with an amount

A cap of "none" has no line, so an amount beside it is refused:

> events[0].cap.amount must be left out when on is "none"; got 1

The panel's cap control writes a cap of "none" without an amount, so this refusal is reached by typing in the box.

## Exercise

Work in the course's own deal calculator.

1. Open the view "Caps, overrun rules and drill-to-earn" and start from "A gross-cost cap reached exactly". Read the cap state, the excess and the reason.
2. Still on "A gross-cost cap reached exactly", raise "event 1: gross cost (stated)" to 48000000. Read the new state and FIN's payment, and match them to the post-deal-interests column of this module.
3. Choose "no cap (none)" in "event 1: cap (stated)". Then add `"amount": 1` to the cap in the box and read the refusal.
