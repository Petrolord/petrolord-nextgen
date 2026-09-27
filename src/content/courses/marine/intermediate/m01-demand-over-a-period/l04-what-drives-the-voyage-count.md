# What drives the voyage count

{{panel:marine-voyage-calculator}}

Every voyage set in a fleet result carries a field the planner should read before any count: `drivenBy`, what set the number of voyages. It names one of three things. A constraint, when the largest demand ratio sets the count; "minimum visits", when the stated visits are larger; and "no demand", when there is neither demand nor a visit.

## Three answers, three different plans

The driver tells a planner which lever moves the count. When deck area drives, a larger deck, a higher usable fraction or less deck cargo lowers the voyages, and a bigger tank does nothing. When a tank drives, the tank is the lever. When minimum visits drive, no change of vessel helps at all: the count comes from the service the installations want, and only a change to that stated need moves it.

The small golden cases, each one dedicated installation with a deck area capacity of 100 m2 and a tank of 100 m3:

| case | demand | minimum visits | voyages before rounding | voyages | driven by |
| --- | --- | --- | --- | --- | --- |
| exactly three voyages of demand | 300.000000 m2 | 0 | 3.000000 | 3 | deck area |
| a tank drives | 10.000000 m2, d 410 m3 | 0 | 4.100000 | 5 | tank d |
| minimum visits drive | 250.000000 m2 | 3 | 3.000000 | 3 | minimum visits |
| no demand and no visits | 0.000000 m2 | 0 | 0.000000 | 0 | no demand |

In the tank case the deck is almost empty: 10 m2 of a 100 m2 deck. The bulk sets the count, 410 m3 through a 100 m3 tank, and rounds up to 5 voyages. A planner who looked only at the deck would think one voyage was plenty.

## The Ekene week, two ways

On the PSV milk run the Ekene week is driven by deck area, with 3.100000 voyages of demand. Size the same week as dedicated voyages and every set is driven by minimum visits instead: EKA 2, EKJ 3, EKB 1 and EKF 2 (engine). Split one installation at a time, the demand is small against a whole PSV, so the stated visits decide. The same cluster, the same vessel and the same demand give two different drivers because the route changed what a voyage set is.

## What the driver does not tell you

The driver names the largest ratio; it says nothing about how close the next one is. On the Ekene milk run deck area drives at 3.100000 while deadweight sits at 2.084143, so a small change in deck demand moves the count and a large change in bulk does not. Read the whole constraint table before promising a saving. And the driver reads the count before rounding: two sets can share a driver and round to different voyages.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "A tank drives".

1. Confirm 4.100000 voyages before rounding, 5 voyages and the driver tank d.
2. Change "Tank d, m3 (stated, 0 for none)" from 100 to 500. Predict the voyages before rounding, the voyages and the driver, then read them.
3. Put the tank back to 100 and set "installation X: d, m3 (stated; not stated carries none)" to 0. Predict the driver now, then read it.
4. Start from "No demand and no visits" and set "installation X: minimum visits (stated)" to 1. Predict the voyages and the driver.
5. Start from "Ekene week, PSV dedicated" and confirm that each set names minimum visits. In the constraint table, find EKJ's largest demand ratio and say how far below its visits it sits.
