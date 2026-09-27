# An event completed and vested

{{panel:farmout-earning-calculator}}

A participating interest is earned by doing the work. Until the well is drilled, the farminee has an obligation and the farmor keeps its participating interest. The engine reads two stated terms to decide what has vested: the vesting rule and the number of events completed. This lesson reads both on a single event.

## The vesting rule at this tier

The engine accepts two vesting rules, and a deal must state one. This tier uses the first, "per-event", whose basis reads:

> each completed event vests its stated interest (a farm in: assignment with the work, HMRC OT30021)

The second rule, "all-events", holds everything back until every event of a multi-event deal is completed. With one event the two orders meet, and the Professional tier works them apart on a drill-to-earn deal. A rule the engine does not know is refused:

> vesting must be one of "per-event", "all-events"; got "on-signing"

## Events completed

The events completed is a stated count, from 0 up to the number of events. A count above it is refused:

> eventsCompleted must be at most 1, the number of events; got 2

## One event still to be completed

The worked case `earn-none-completed` states a well of 40000000.000000, FIN paying 40.000000 percent to earn 30.000000 percent, "per-event" vesting and no event completed.

| party | participating interest after (engine) |
| --- | --- |
| EKO | 70.000000 |
| PA | 30.000000 |
| FIN | 0.000000 |

Nothing has moved. The engine's reason says why:

> vesting "per-event": 0 of 1 event completed; 0% vests

The event row still shows the obligation, 16000000.000000 for FIN, and the tiles show 0.000000 paid and 0.000000 percent vested. Its reason line ends with a note of its own:

> well: gross cost 40000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; no cap: the promote applies to the whole gross cost; FIN pays 16000000 (40% of the gross cost), EKO pays 12000000, a carry of 4000000 (not completed: the obligation only)

## The same event, completed

The Ekene Deep case states the one event completed, and FIN's 30.000000 percent vests: EKO 40.000000, PA 30.000000, FIN 30.000000. The vested participating interest tile reads 30.000000, and the totals count the event.

## A result with a reason

An event not completed is no refusal. The engine returns a full result, with the split of the obligation and a reason that says nothing has vested. Read the reason before you read the tiles: a tile of 0.000000 may mean the event is not done yet.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "An event not yet completed". Read the vesting reason, the "Vested participating interest" tile and the table of participating interests after the deal. Then set the "Events completed (stated)" control to 1 and run it: read the same three again. Finally set it to 2 and read the refusal and the limit it names.
