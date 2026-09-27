# Weekly demand per installation

{{panel:marine-voyage-calculator}}

The Associate tier planned one voyage. This tier asks the planning question above it: over a stated period, how many voyages does the installations' demand need, how many vessel-days do they take, and how many vessels does that make? Then, for a voyage's deck cargo, which unit goes on which voyage? It starts with demand.

## Demand is stated for a period

A voyage plan reads each installation's `cargo`, what one voyage delivers. Fleet sizing reads each installation's `demand`, what it draws over the stated period, in the same measures: deck cargo in square metres and tonnes, bulk in cubic metres by product. The period is an input, `periodDays`, and so is every figure inside the demand; the engine holds no consumption rate of its own.

The Ekene cluster is synthetic. Its week, as the fixture states it:

| installation | minimum visits | deck, m2 | deck, t | bulk, m3 |
| --- | --- | --- | --- | --- |
| EKA | 2 | 520.000000 | 610.000000 | diesel 450, water 900 |
| EKJ | 3 | 900.000000 | 1100.000000 | diesel 500, water 700, mud 600, brine 250, cement 180, barite 200 |
| EKB | 1 | 180.000000 | 150.000000 | diesel 120, water 200 |
| EKF | 2 | 260.000000 | 240.000000 | diesel 300, water 400 |

The jack-up, EKJ, is the heavy customer: it alone asks for mud, brine, cement and barite. The period is 7 days, and a vessel is available for 6.5 of them.

## Adding the stops

On a milk run one voyage serves every stop, so fleet sizing sees one voyage set whose demand is the sum over its stops: 1860.000000 m2 of deck cargo and 2100.000000 t of deck weight for the Ekene week (engine). A dedicated route makes each installation its own voyage set; the next module works that case.

## Two inputs that look alike

Cargo and demand have the same inner shape, so a box written for the voyage plan can look right in the fleet view. The engine refuses any key a call does not read. An installation carrying `cargo` in a fleet call:

> installations[0].cargo is not an accepted key; the accepted keys of installations[0] are id, name, distanceFromBaseNm, fieldHours, minVisits, demand

An installation with no demand at all:

> installations[0].demand must be an object { deckAreaM2, deckWeightT, bulk }; got nothing

A fleet sized on a list meant for one voyage would be quietly wrong, so no figure comes back until the box states what the call reads.

## What the course leaves to others

How much stock an installation should hold, and when to reorder a spare, belong to the materials course. This course takes the stated demand and moves it.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "Ekene week, PSV milk run".

1. Find the controls "installation EKA: deck demand, m2 (stated)" and the three like it. Add the four and confirm the constraint table's deck area demand, 1860.000000.
2. Do the same for the deck weight controls and confirm 2100.000000.
3. In the box, rename EKA's key `demand` to `cargo`. Before you look, say which refusal the panel will show, then compare it with the one quoted above. Put the key back.
