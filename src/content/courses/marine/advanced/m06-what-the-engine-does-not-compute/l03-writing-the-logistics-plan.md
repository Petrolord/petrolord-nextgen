# Writing the logistics plan

{{panel:marine-base-calculator}}

{{panel:marine-variability-calculator}}

A logistics plan is the document a planner hands over: the voyages, the fleet, the deck and the base, each figure with the inputs it rests on. Every figure in it moves when an input moves, so the plan's first job is to state those inputs, and its second is to name the choices and readings the figures depend on.

## What the plan names

The cluster and each installation (synthetic here) with its distances, field hours, cargo or demand and minimum visits. Every source with its edition, licence and read date. The vessel, products, route, port hours, weather factor with its activities, and fuel price. Each voyage's hours, days, fuel and binding constraint. The period, available days, rounding rules, voyages, vessel-days, vessels and spare or short vessel-days. The deck plan with its rule, voyages, lower bound and overflow. The base with its berths, arrivals, working day, service terms, concurrent choice, model and any target. Each Monte Carlo figure with its seed and draws.

## Choices the call states

Some conventions are inputs the call must state: the activities the weather slows, the voyage and vessel rounding rules, the packing rule, the queue model and the concurrent choice. A plan names each one it used, because a different choice gives a different figure. The Ekene base waits 3.180124 hours as M/M/c and 1.665786 as M/D/c; the same week needs 10.345455 vessel-days with voyages rounded up and 8.017727 with none.

## Readings the engine states

Others are the engine's own readings, where no source fixes a convention: among them, a load at capacity is feasible, counts round up on the twelve-digit figure, a berth target is met at or below it, short means strictly above, and the P90 of a requirement is the low figure. Each has an alternative the course named where it was taught. A plan that rests a figure on one of them says so.

## The Expert section of the Ekene plan

For the base and the variability, a plan quotes the Ekene supply base with its 2 berths, 3.2 arrivals a day over 24 working hours, a service of 2 fixed hours with 60 lifts at 12 an hour alongside 900 m3 at 150 m3 an hour, and its model; the berth utilisation of 0.533333; the mean wait under each model; the berths that meet a stated target. Then the Monte Carlo: its factors, its planned vessels, the P90 of 7.977705 and the P10 of 11.908677 vessel-days on seed 20260927 and 20000 draws, and the probability short of 0.001400, each called an estimate.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene base, a one-hour target, M/M/c", then "Ekene base, a one-hour target, M/D/c". Open the variability calculator on the view "The fleet under weather and demand variability" and start from "Ekene week, PSV milk run, weather and demand". From the three runs, write the Expert section of the Ekene plan in no more than ten lines, naming every input, the model, the seed and the draws, and one reading each figure rests on.
