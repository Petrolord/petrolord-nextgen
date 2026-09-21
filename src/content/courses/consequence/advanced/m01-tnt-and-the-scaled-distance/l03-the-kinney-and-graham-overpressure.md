# The Kinney and Graham overpressure

{{panel:cq-harm}}

With the scaled distance in hand the engine needs one more thing: a curve that turns Z into a peak overpressure. It uses a closed form fit published by Kinney and Graham for a free air burst of TNT.

## The fit, verbatim

The engine's model string: "Kinney and Graham free-air peak side-on overpressure, ps/pa = 808[1+(Z/4.5)^2] / (sqrt(1+(Z/0.048)^2) sqrt(1+(Z/0.32)^2) sqrt(1+(Z/1.35)^2))". Its source, as the engine exports it: "Kinney and Graham (1985) Explosive Shocks in Air, 2nd ed.; as printed by Guzas and Earls (2010) eq. 5".

Three words in that string carry meaning. FREE AIR means the charge bursts away from any surface, so no reflected shock adds to the incident one. PEAK is the highest pressure the shock front carries past a point. SIDE-ON means the pressure a gauge would read with the shock passing across its face, the incident overpressure a person standing in the open meets.

The fit returns a RATIO, ps over pa, the overpressure over the ambient pressure. The engine multiplies by the ambient, `ATM_PA`, 101325 Pa unless a call states otherwise, to give pascals.

## How steeply it falls

The ratio against Z (stated):

| Z m/kg^(1/3), stated | overpressure over ambient | overpressure Pa |
| --- | --- | --- |
| 0.1 | 332.983298 | 33739532.632458 |
| 0.5 | 39.512808 | 4003635.242148 |
| 1 | 9.955978 | 1008789.503793 |
| 2 | 2.052080 | 207926.999232 |
| 5 | 0.288558 | 29238.106780 |
| 10 | 0.098548 | 9985.363723 |
| 20 | 0.043360 | 4393.409670 |
| 40 | 0.020934 | 2121.136283 |

Close to the charge the ratio is 332.983298. By Z of 2 it has fallen to 2.052080, and by Z of 10 to 0.098548. The far field tail across the last three rows falls far more gently. A small error in Z matters most in the near field, where the curve is steepest.

## The evidence behind a graded overpressure

This course grades the Kinney and Graham overpressure, forward and inverse. What stands behind it is a published column: five values from a 2020 conference paper's table, at an ambient of 101.325 kPa, which the engine reproduces. One of them, a 1 kg charge at 5 m, has Z of 5, and the engine gives 29.238107 kPa against the printed 29.24. The table row above at Z of 5 reads 29238.106780 Pa, the same figure in pascals. A later lesson in the next module reads that column in full, including why its printed constants differ from its numbers.

Because the charge is a stated TNT mass and the fit is checked against a published column, a capstone can grade the overpressure at a distance with confidence even though the TNT equivalence before it is a single route quantity.

## What the fit is used for, and what it gives

The engine returns one number per Z: the peak side-on overpressure in free air. It does not return an impulse, a duration or a reflected pressure. When a later lesson turns overpressure into a fatality probit, it is this peak side-on figure that goes in.

## Exercise

On the harm panel's blast view, enter a TNT mass of 1 kg and walk the distance through the Z values in the table above, confirming each overpressure in pascals. Then enter 1 kg at 5 m and compare the engine's figure with the conference paper's printed 29.24 kPa. Write one sentence saying which of the three words FREE AIR, PEAK and SIDE-ON would change the answer most if your real charge sat on the ground.
