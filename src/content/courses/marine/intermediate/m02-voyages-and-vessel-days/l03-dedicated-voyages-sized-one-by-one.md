# Dedicated voyages sized one by one

{{panel:marine-voyage-calculator}}

A milk run gathers every stop into one voyage set. A dedicated route does the opposite: each installation is its own voyage set, sailed from the base to that installation and back, sized on its own demand, its own minimum visits and its own voyage days. Fleet sizing then adds the vessel-days of the sets.

## Four sets for the Ekene week

The Ekene PSV on dedicated voyages, with the same week of demand, the same rainy-season factor on sailing and field time, and voyages rounded up:

| voyage set | voyages before rounding | voyages | driven by | voyage days | vessel-days |
| --- | --- | --- | --- | --- | --- |
| EKA | 2.000000 | 2 | minimum visits | 1.363636 | 2.727273 |
| EKJ | 3.000000 | 3 | minimum visits | 1.518182 | 4.554545 |
| EKB | 1.000000 | 1 | minimum visits | 1.372727 | 1.372727 |
| EKF | 2.000000 | 2 | minimum visits | 1.613636 | 3.227273 |

The dedicated week needs 11.881818 vessel-days against the milk run's 10.345455 (engine). Eight voyages sail where the milk run sailed four.

## Why every set is driven by its visits

A whole PSV sent to one installation carries a large share of that installation's week in one trip. EKJ, the heaviest customer, asks for 900.000000 m2 of deck cargo in the week, which two voyages of 600.000000 m2 would carry, and its three minimum visits are larger. The same holds at every stop, so the visits the operator states fill the dedicated plan and the cargo rides along. On the milk run the four stops shared one deck, so the deck filled first and cargo set the count.

## Why the dedicated week costs more time

Each dedicated voyage pays its own port time and its own sailing out and back. The four dedicated voyages for one visit to each stop take 5.868182 days in all, where one milk run through all four takes 2.586364. The dedicated plan is not wasteful by nature: it serves each installation on its own timing, so the last stop on a route never waits for the first. The course computes both and leaves the choice to the planner, who must state the route in any case.

## Reading a dedicated result

Read the voyage set table row by row: each row is its own small fleet question, with its own driver and its own rounding. The fleet tiles below it add the rows. When the rows disagree on their driver, the plan has more than one lever, and each row says which. A change to one installation's demand moves its own row and the fleet total, and leaves the other rows exactly where they were, which makes a dedicated plan easy to audit.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "Ekene week, PSV dedicated".

1. Confirm the four rows of the table above and the fleet's 11.881818 vessel-days.
2. In the constraint table, find EKJ's deck area demand and capacity, divide them, and confirm that the ratio sits below its three visits.
3. Change "installation EKJ: minimum visits (stated)" from 3 to 1. Before you read the result, predict EKJ's voyages before rounding, its voyages after rounding up and its driver. Then predict whether the fleet's vessel-days rise or fall, and by about how much, from EKJ's voyage days.
4. Start from "Ekene week, PSV milk run" and set the two results side by side: voyages sailed, vessel-days and the drivers.
