# The modified Goodman line

The allowable stress a rod is judged against is not a property of the rod. Three things go into it and only one is the steel.

{{panel:pd-balance-explorer}}

## The line itself

Sa = ( T/4 + 0.5625 Smin ) SF, from API RP 11BR. T is the grade minimum tensile strength, Smin the minimum stress the section sees in a cycle, SF a service factor. At a service factor of 1 and a minimum stress of zero, the quarter tensile is the whole allowable.

| Grade | Minimum tensile, psi | T/4, psi |
| --- | --- | --- |
| API Grade K | 85000 | 21250.000000 |
| API Grade C | 90000 | 22500.000000 |
| API Grade D | 115000 | 28750.000000 |

## The allowable rises with the minimum stress

Grade D at a service factor of 1, as the minimum stress steps from 0.0 psi to 12500.0 psi in steps of 2500.0 psi: 28750.000000, 30156.250000, 31562.500000, 32968.750000, 34375.000000 and 35781.250000 psi.

A string that never unloads is allowed more than one that swings to nothing. That is the content of a fatigue line: what damages steel is the swing, and a high floor means a small swing for the same peak.

## What the design does with it

On ODUMA-4 at a service factor of 1.0000, as `runRodPumpDesign` returns it:

| Section | Max stress, psi | Min stress, psi | Allowable, psi | Loading |
| --- | --- | --- | --- | --- |
| 1 in, top at 0.0 ft | 25210.199822 | 2969.187943 | 30420.168218 | 82.873308 percent |
| 7/8 in, top at 1500.0 ft | 22899.200494 | 111.747902 | 28812.858195 | 79.475630 percent |
| 3/4 in, top at 3100.0 ft | 20864.065937 | -2491.543540 | 27348.506758 | 76.289598 percent |

The same grade D quarter tensile of 28750.000000 psi stands behind all three allowables. They differ only because the minimum stresses do, and the deepest section's is negative, -2491.543540 psi, which pushes its allowable below the quarter tensile. A section that goes into compression is judged more harshly, at exactly the depth where compression happens.

## What the spread says about the taper

A taper is designed so that every section works equally hard. This one spreads 6.583710 percentage points, so it is not stress balanced: the top section carries the design and the bottom holds margin nobody uses. At a service factor of 0.8500 the spread is 7.745541 percentage points, because the factor divides into every loading and stretches the gaps with it.

## What the line refuses to say

Whether the string will last. A loading percentage is a comparison against a line, not a life, and the package does not model the fatigue history that turns one into the other. T is a specified minimum for the grade, not a measured strength for these rods, and nothing in the arithmetic knows about corrosion.

## Exercise

Write the grade D allowable at minimum stresses of 0.0 and 10000.0 psi at a service factor of 1.

Then write the loading spread across the three sections and say what it tells you about the taper.
