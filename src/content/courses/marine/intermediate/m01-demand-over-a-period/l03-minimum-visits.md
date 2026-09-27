# Minimum visits

{{panel:marine-voyage-calculator}}

Cargo is one reason to send a vessel. Another has nothing to do with capacity: an installation may need a vessel alongside a stated number of times in the period, for crew supplies, for backloads of waste and empty containers, or because the operator will not let a manned platform go long without a call. Fleet sizing carries that need as `minVisits`, a whole number for each installation over the period.

## How the engine uses it

The voyages a set needs are the larger of two figures: the voyages of demand (the largest demand ratio of the last lesson) and the minimum visits. On a dedicated route each installation brings its own minimum visits. On a milk run one voyage calls at every stop, so the set takes the largest minimum visits of its stops. For the Ekene milk run that is EKJ's 3, and the voyages of demand, 3.100000, are larger, so the demand still sets the count.

The small golden cases show both sides. Each is one dedicated installation with a deck area capacity of 100 m2:

| case | deck demand | minimum visits | voyages before rounding | voyages | driven by |
| --- | --- | --- | --- | --- | --- |
| minimum visits drive | 250.000000 m2 | 3 | 3.000000 | 3 | minimum visits |
| demand equal to the visits | 300.000000 m2 | 3 | 3.000000 | 3 | deck area |
| no demand and no visits | 0.000000 m2 | 0 | 0.000000 | 0 | no demand |

In the first row deck area alone would need two and a half voyages; the three visits lift the count to 3, and the engine says so.

## A tie between demand and visits

In the second row the deck area ratio and the visits are both exactly 3. The count is the same whichever the engine names, but a planner reads the driver to decide what to change, so the tie needs a stated convention. The engine names the demand when its ratio is at or above the minimum visits. That is a reading the engine states: the alternative would name the tie as minimum visits, and no count moves between them. A plan that quotes a driver at a tie should say which reading it rests on.

## Whole numbers, always stated

A visit is a call alongside, so the engine takes whole numbers from 0 to 1000 and refuses a fraction:

> installations[0].minVisits must be a whole number from 0 to 1000; got 1.5

There is no assumed figure either. An installation with no minimum visits stated is refused by name:

> installations[0].minVisits must be a whole number from 0 to 1000; got nothing

A planner who means "no minimum" writes 0, and the call then carries that decision in plain sight.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "Minimum visits drive".

1. Read the voyage set table and confirm 3 voyages driven by minimum visits.
2. Change the control "installation X: minimum visits (stated)" from 3 to 2. Before you read the result, predict the voyages before rounding, the voyages after rounding up, and what the panel names as the driver. Then read all three.
3. Start from "Ekene week, PSV milk run". Change "installation EKJ: minimum visits (stated)" to 4. Predict the driver and the voyages, and say whether the vessel-days move. Read them, and explain the answer from the voyage count.
4. Type 1.5 into "installation EKA: minimum visits (stated)" and compare the refusal with the one quoted above.
