# What spread is

Spread is the pressure interval a valve stays open across, and it is not a separate property of the valve. It is the same force balance that sets the dome, read as a distance.

{{panel:pd-valve-explorer}}

## The balance, read two ways

A valve opens when the pressure on the port area plus the pressure on the rest of the bellows reaches the dome charge at valve temperature. Rearranged, the gap between the opening pressure and that dome is R times the difference between the two sides, and that gap is the spread.

| Published case, valve 1 | Injection at depth, psia | Dome at valve temperature, psia | Spread, psi |
| --- | --- | --- | --- |
| westTexasOil | 1068.362497529 | 1021.076842603 | 47.285654927 |
| deepHighPressure | 1517.796497793 | 1478.591775361 | 39.204722432 |
| midDecrementKnifeEdge | 1237.549064732 | 1182.023754759 | 55.525309973 |

Subtract the middle column from the left one in any row and the right column appears. That is not a check on the engine. It is what spread is.

## Two things set it

R, and the differential across the port. westTexasOil and midDecrementKnifeEdge both carry a 0.25 in port in a 0.77 in2 bellows, so both run at R of 0.063749851, and their valve 1 spreads differ only because their pressures do. deepHighPressure carries a 0.125 in port in a 0.31 in2 bellows at R of 0.039586601, the smallest ratio of the three, and still reports 39.204722432 psi, because its valve 1 sees 1517.796497793 psia of injection against 527.443159448 psia of production. A small fraction of a wide gap beats a larger fraction of a narrow one.

## Same hardware, different spread

Every charged valve on midDecrementKnifeEdge is a 0.25 in port in a 0.77 in2 bellows at R of 0.063749851, and the spreads run 55.525309973, 46.733519484, 39.016557082, 32.272254090, 26.401432257 and 21.310451869 psi. No part changed anywhere down that string. The differential closed, because the production pressure climbs with depth faster than the injection column gains.

## The mistake

Reading a spread off a valve datasheet. Spread belongs to a valve at a depth in a string at a stage, not to a part number. The same valve set for the shallowest stage of that design reports 55.525309973 psi and set for the deepest charged stage reports 21.310451869 psi.

## What it refuses

Spread is a static differential at the design condition. There is no velocity and no injection rate in the annulus anywhere in this module, so it does not say how long the valve takes to travel, how much it passes while it travels, or whether the stem throttles on the way open. It is a pressure interval, and that is the whole of it.

## Exercise

Read valve 1 of the three published IPO cases in the panel and record the injection pressure at depth, the dome at valve temperature and the spread.

Then confirm the subtraction in each row, and say which of R or the differential is doing more of the work on deepHighPressure.
