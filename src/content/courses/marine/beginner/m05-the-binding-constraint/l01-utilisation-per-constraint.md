# Utilisation per constraint

{{panel:marine-voyage-calculator}}

A voyage faces several limits at once: the usable deck area, the deck load, the deadweight and a tank for every product. Each is measured in its own unit, square metres, tonnes or cubic metres, so they cannot be compared directly. Utilisation puts them on one scale. This lesson computes it for every constraint of the Ekene milk run.

## Load over capacity

The utilisation of a constraint is its load over its capacity. A utilisation of 0.5 means half full; 1 means exactly full; above 1 means the load does not fit. Because it is a ratio, utilisation has no unit, and a deck area can be compared with a water tank. In this course a utilisation is always of a named thing: a constraint here, and at later tiers a deck, a fleet or a berth.

## The Ekene milk run, constraint by constraint

The engine checks the constraints in a stated order: deck area, deck load, deadweight, then one tank per product in the order the products are listed.

| constraint | unit | load | capacity | utilisation |
| --- | --- | --- | --- | --- |
| deck area | m2 | 540.000000 | 600.000000 | 0.900000 |
| deck load | t | 635.000000 | 2000.000000 | 0.317500 |
| deadweight | t | 2390.000000 | 3500.000000 | 0.682857 |
| tank diesel | m3 | 460.000000 | 800.000000 | 0.575000 |
| tank water | m3 | 745.000000 | 1200.000000 | 0.620833 |
| tank mud | m3 | 200.000000 | 600.000000 | 0.333333 |
| tank brine | m3 | 85.000000 | 400.000000 | 0.212500 |
| tank cement | m3 | 60.000000 | 250.000000 | 0.240000 |
| tank barite | m3 | 70.000000 | 250.000000 | 0.280000 |

Reading down the utilisation column, the deck area is the fullest and the brine tank the emptiest. The deadweight comes second, at 0.682857, because the bulk products add their weight to the deck cargo's. Every row is computed the same way, whatever its unit, so every row can be ranked against every other.

## What the column tells a planner

A utilisation well below 1 is room to spare. The PSV could carry more than three times its deck cargo by weight before the deck load bound, but only a little more by area. That points to where a planner has room: extra heavy cargo with a small footprint might fit, while one more bulky basket might not.

## A capacity is always of a named constraint

In this course "capacity" is never a vessel's size in general. It is the capacity of one named constraint: the deck area times the usable fraction, the deck load, the deadweight, or a named tank. A sentence such as "the PSV has plenty of capacity" says nothing until it names which.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Divide the load by the capacity on three rows of the constraints table, deck area, deadweight and tank water, and check your results against the utilisation column. Then change "installation EKB: deck cargo, m2 (stated)" from 60 to 120 and predict the deck area utilisation before you read it, and whether the voyage is still feasible. Restore 60.
