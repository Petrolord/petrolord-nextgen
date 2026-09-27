# Demand over capacity per constraint

{{panel:marine-voyage-calculator}}

A vessel has several capacities, each of a named constraint: deck area times the usable fraction, deck load, deadweight, and one tank for each product. The Associate tier read them against one voyage's cargo. Fleet sizing reads them against a period's demand and asks a simple question of each: how many full voyages would this constraint alone need?

## One ratio a constraint

For each constraint the engine divides the period's demand by the capacity of one voyage. The ratio is a count of voyages as if that constraint were the only one. Deck area on the Ekene PSV is 800 m2 at a usable fraction of 0.75, a capacity of 600.000000 m2 a voyage. The week asks for 1860.000000 m2, so deck area alone needs 3.100000 voyages.

The Ekene week on the PSV milk run, constraint by constraint:

| constraint | demand in the week | capacity a voyage | demand over capacity |
| --- | --- | --- | --- |
| deck area | 1860.000000 | 600.000000 | 3.100000 |
| deck load | 2100.000000 | 2000.000000 | 1.050000 |
| deadweight | 7294.500000 | 3500.000000 | 2.084143 |
| tank diesel | 1370.000000 | 800.000000 | 1.712500 |
| tank water | 2200.000000 | 1200.000000 | 1.833333 |
| tank mud | 600.000000 | 600.000000 | 1.000000 |
| tank brine | 250.000000 | 400.000000 | 0.625000 |
| tank cement | 180.000000 | 250.000000 | 0.720000 |
| tank barite | 200.000000 | 250.000000 | 0.800000 |

## Deadweight is built from densities

The deadweight demand is the deck weight plus every bulk volume times its stated density, exactly as the Associate tier built the deadweight load of one voyage. The week's 2100.000000 t of deck weight, with diesel at 0.85, water at 1, mud at 1.4, brine at 1.2, cement at 1.5 and barite at 2.1 t a m3, gives 7294.500000 t. A wrong density moves the deadweight ratio and nothing else, which is why every product states one.

## The largest ratio wins

The voyages of demand are the largest ratio over all the constraints. A vessel that sails often enough for its tightest constraint has room left on every other. Here deck area's 3.100000 is the largest, so the Ekene week needs 3.100000 voyages of demand, driven by deck area. The next largest, deadweight at 2.084143, would need barely more than two.

This is the binding constraint of one voyage carried over a period: the highest utilisation binds a voyage, and the highest demand ratio drives a fleet. Both are read off stated numbers.

## Why the ratio is a planning figure

A ratio of 3.100000 is an average, and no vessel sails a tenth of a voyage. Minimum visits can lift the count above every ratio, which the next lessons take up, and the stated rounding rule decides the fraction in module two.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "Ekene week, PSV milk run".

1. In the constraint table, read the demand in the period and the capacity a voyage for every row. Divide each pair yourself and confirm the ratios above.
2. Find the row with the largest ratio and confirm that the voyage set table names it under "driven by".
3. Change the control "Usable deck fraction (stated)" from 0.75 to 1. Before you read the result, work out the new deck area capacity and ratio by hand, compare the ratio with the minimum visits of the four stops, and predict what the panel will name as the driver. Then read it.
4. Put the fraction back to 0.75 and change "product barite: density, t a m3 (stated)" to 1. Predict which one ratio moves, and whether the driver changes.
