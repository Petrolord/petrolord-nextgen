# The obligation and the payments made

{{panel:farmout-deal-calculator}}

An earning call reports two things that are easy to confuse. Every event's split is reported as the obligation: what the farminee and the farmor would pay if that event were done. The totals count completed events only: what has actually been paid, carried and received. This lesson reads both on the Ekene Deep drill-to-earn and closes the module with the one refusal a count of completed events can meet.

## The obligation of every event

Each event's split is computed whether or not it is completed. On the Ekene Deep drill-to-earn with one of two events completed, the appraisal well's split is still in the event table: FIN would pay 13500000.000000 and EKO 7500000.000000, a carry of 3000000.000000. None of it is in the totals yet.

On the single-well case with no event completed, the engine marks the split as the obligation only:

> well: gross cost 40000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; no cap: the promote applies to the whole gross cost; FIN pays 16000000 (40% of the gross cost), EKO pays 12000000, a carry of 4000000 (not completed: the obligation only)

Its totals are 0.000000 paid and 0.000000 percent vested, although the event row shows 16000000.000000 for FIN.

## The totals count completed events

| events completed | gross cost of completed events | farminee paid | carry | consideration |
| --- | --- | --- | --- | --- |
| 0 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| 1 | 40000000.000000 | 16000000.000000 | 8000000.000000 | 8000000.000000 |
| 2 | 70000000.000000 | 29500000.000000 | 11000000.000000 | 11000000.000000 |

These are the Ekene Deep drill-to-earn totals under "all-events". The same totals come back under "per-event": the vesting rule moves the interest and leaves the money alone.

With nothing completed, the consideration line reads 0 and the vesting line says nothing vests:

> vesting "all-events": 0 of 2 events completed; nothing vests

The equivalent working interest has no gross cost to divide by, so the engine reports "none" for it.

## Why the split matters

A report on a drill-to-earn deal quotes both. The obligation tells the farminee what the remaining programme will cost it, event by event; the totals tell both sides where the deal stands today. A farmor reading only the totals would miss the appraisal well still owed; a farminee reading only the event table would count a payment it has not made.

## A count the engine refuses

Events completed is a stated whole number from 0 to the number of events. On a deal with one event, a count of 2 is refused, and the message names the limit:

> eventsCompleted must be at most 1, the number of events; got 2

In the panel, the event table's completed column shows which events the count covers: on the Ekene Deep drill-to-earn a count of 1 completes the exploration well and leaves the appraisal well as an obligation.

## Exercise

Work in the course's own deal calculator.

1. Open the view "Caps, overrun rules and drill-to-earn" and start from "Ekene drill-to-earn, one of two events, all-events". Find the appraisal well's split in the event table, and confirm that none of it is in the totals.
2. With the control "Events completed (stated)", set the count to 2 and read how much each total moves.
3. Start from "Ekene drill-to-earn, no event completed" and read the equivalent working interest tile.
4. In the box, delete the second event, keep the count at 2 and read the refusal.
