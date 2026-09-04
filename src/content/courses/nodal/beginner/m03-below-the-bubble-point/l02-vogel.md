# Vogel

One dimensionless curve with two published constants, no productivity index anywhere in it, and a specific claim about the well it describes.

{{panel:pd-ipr-explorer}}

## The relation

Divide the flowing pressure by the reservoir pressure to get a ratio. The rate as a fraction of the maximum is one, minus 0.2 times that ratio, minus 0.8 times its square. Those constants came from Vogel's 1968 computed solutions for solution gas drive reservoirs and are not adjustable.

At a ratio of one the terms cancel, so every Vogel curve starts on the axis exactly. At zero the expression is one, so the rate is the maximum, which is the absolute open flow and the family's only coefficient.

| Flowing pressure, psia | Rate, stb/d |
| --- | --- |
| 2400 | 0.000000 |
| 2160 | 258.000000 |
| 1800 | 600.000000 |
| 1200 | 1050.000000 |
| 600 | 1350.000000 |
| 240 | 1458.000000 |
| 0 | 1500.000000 |

At 1200 psia, half the reservoir pressure, the rate is 1050.000000 out of 1500.000000 stb/d. Half the open flow, 750.0000 stb/d, needs 1620.937271 psia, well above half the reservoir pressure. The slope never holds still: minus 0.91168461 psi per stb/d at 75.0000 stb/d, minus 1.24939025 at 750.0000 and minus 3.57770876 at 1425.0000 stb/d.

## Calibration and depletion

One test pins the maximum. Against 2400 psia, a test of 700 stb/d at 1500 psia returns an open flow of 1244.444444 stb/d, reading 700.000000 stb/d back. A test at or above the reservoir pressure returns a warning, because there is nothing to divide by.

Depletion follows Eickmeier's cube rule: from 2400 psia to 1800 psia the open flow falls from 1500.000000 to 632.812500 stb/d, with a future pressure at half the open flow of 1215.702953 psia. A published rule, not a measurement, and it says nothing about when 1800 psia arrives.

## No index

There is no number in stb/d/psi in this family, because the price of a barrel differs at every rate. A Vogel well cannot be compared with a straight line well by index, and any index quoted from one is a price at a rate with the rate stripped off.

## Where it does not belong

Vogel describes a saturated well, one whose reservoir pressure is at or below its bubble point. On an undersaturated well it discards the linear block and reads low throughout.

| Flowing pressure, psia | Vogel, stb/d | Composite, stb/d | Difference, stb/d |
| --- | --- | --- | --- |
| 2380 | 720.000000 | 720.000000 | 0.000000 |
| 1957 | 1451.888372 | 1566.000000 | -114.111628 |
| 1566 | 2018.754177 | 2348.000000 | -329.245823 |
| 1300 | 2344.186047 | 2880.000000 | -535.813953 |
| 783 | 2837.228596 | 3731.238291 | -894.009695 |
| 0 | 3233.247201 | 4324.444444 | -1091.197244 |

The row at 1300 psia is the argument. That is BONNY-7's bubble point, where the well is genuinely linear, and Vogel is already 535.813953 stb/d low: it has bent a part of the curve that does not bend.

Being wrong low is not being conservative on purpose. A margin of 1091.197244 stb/d at the bottom is one nobody chose, and it lands on top of whatever margin they thought they were adding.

## What it refuses

No index, because it has none. No bubble point input, so it cannot warn that a well is undersaturated. And no warning of any kind when misapplied: on BONNY-7 it returns a smooth curve reproducing the test exactly, at an open flow of 3233.247201 stb/d.

## Exercise

Read the rate at 1800 psia, 1200 psia and 600 psia and write each as a fraction of the reservoir pressure and of the open flow.

Then put BONNY-7's Vogel and composite readings at 1300 psia side by side and say why that row is the strongest argument against using Vogel there.
