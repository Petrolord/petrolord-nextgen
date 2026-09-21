# Cube root scaling

{{panel:cq-harm}}

A blast curve for one kilogram of TNT would be useless if every charge needed its own curve. Cube root scaling is what lets one curve serve every charge. It folds the distance and the charge mass into a single number, the scaled distance Z, and says that two charges produce the same peak overpressure wherever they share the same Z.

## The scaled distance

The engine's model string, verbatim: "Hopkinson-Cranz cube-root scaling, Z = R / W^(1/3)". R is the distance from the charge in metres and W the TNT mass in kilograms, so Z carries the unit m/kg^(1/3). The engine's argument name says so: `scaledDistanceMKg13`, metres per kilogram to the one third.

The consequence is a rule of thumb worth memorising as a relation rather than a number. A charge eight times heavier gives the same overpressure at twice the distance, because the cube root of eight is two. Blast reach grows slowly with charge size.

## BONGA's charge at distance

BONGA's charge of 500 kg of TNT (stated), at five distances (stated):

| distance m, stated | Z m/kg^(1/3) | overpressure Pa |
| --- | --- | --- |
| 20 | 2.519842 | 121853.141070 |
| 50 | 6.299605 | 19626.657230 |
| 100 | 12.599210 | 7457.699887 |
| 200 | 25.198421 | 3427.919093 |
| 300 | 37.797631 | 2247.931733 |

Z is linear in the distance for a fixed charge: each step in the distance column scales the Z column by the same factor. The overpressure column does not scale that way, and the next lesson explains why. For now, notice that the engine computes Z first and hands only Z to the overpressure fit. The fit never sees the charge or the distance separately.

## The scaling test

The engine's own check of the relation: eight times the charge at twice 100 m gives 7457.699887 Pa, against 7457.699887 Pa for the original charge at 100 m. Same Z, same overpressure, to every printed decimal. That identity is the whole content of cube root scaling. If a calculation of yours breaks it, the error is in how you formed Z.

Two slips are common. The first is taking the square root or the plain ratio R / W instead of the cube root. The second is typing the fuel mass where the TNT mass is due. BONGA's cloud is 3000 kg of butane, and at a yield factor of 0.1 its TNT equivalent is 2980.434783 kg; the charge in this lesson, 500 kg, is a stated TNT mass. The engine takes whatever mass you type as TNT, so the name of the quantity you type matters more than its size.

## Why this matters for harm

A consequence note usually wants the distance to a stated overpressure, because that distance is what a layout or an emergency plan acts on. Cube root scaling tells you how that distance moves when the charge estimate moves. An uncertain yield factor feeds through the cube root, so a charge doubtful by a factor of eight leaves the distance doubtful by a factor of two.

## Exercise

On the harm panel's blast view, enter 500 kg of TNT at 100 m and confirm Z of 12.599210 and 7457.699887 Pa. Then type eight times that charge and twice that distance, and confirm the overpressure is unchanged. Finally, write one sentence explaining why the fit could return that result without ever seeing the charge.
