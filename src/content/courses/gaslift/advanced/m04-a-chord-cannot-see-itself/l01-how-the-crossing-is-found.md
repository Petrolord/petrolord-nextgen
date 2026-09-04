# How the crossing is found

Gas wins at the top of the well and loses at the bottom. The depth where it stops winning is one interpolation on a table somebody else built.

{{panel:pd-unloading-explorer}}

## The margin is one subtraction per row

`deepestInjectionPoint` is handed the flowing production traverse as a depth and pressure table. At every tabulated depth it reads the injection pressure off the gas column, subtracts the production pressure and the transfer differential, and keeps the sign.

The published case: surface 1014.7 psia, gas gravity 0.65, transfer differential 100.0 psi, maximum depth 8000.0 ft, wellhead 100.0 degF, bottom 190.0 degF at 8000.0 ft. Its traverse is 9 rows at 1000.0 ft spacing.

| Depth, ft | Production pressure, psia |
| --- | --- |
| 0.0 | 164.7000 |
| 2000.0 | 372.7000 |
| 4000.0 | 606.7000 |
| 6000.0 | 864.7000 |
| 8000.0 | 1146.7000 |

## Where the sign changes, a straight line

Between the last row where the margin is positive and the first where it is negative the function draws a straight line through the margin and takes its zero. That is the whole search: no bracketing loop, no tolerance to tighten, one division.

The published answer is 7739.814701036 ft, injection 1209.238206006 psia, production 1109.233316949 psia, `limitedBy` = pressure. The engine returns 7739.815725361 ft, 1209.238141416 psia and 1109.233464452 psia.

## Three ways it returns, and only one is a crossing

A crossing is reported as `limitedBy` = pressure: 4703.296676249 ft at a surface pressure of 714.7 psia, 3679.836217123 ft at 614.7 psia, 538.553047921 ft at 314.7 psia.

Where gas still wins at the deepest tabulated row the function returns that row with `limitedBy` = depth. Surface pressures of 1214.7, 1414.7 and 1614.7 psia all give 8000.000000000 ft, the first of them with injection 1460.125387434 psia against production 1146.700000000 psia. The margin never changed sign.

The third return is a depth of 0 labelled `limitedBy` = pressure, the engine saying the gas loses at the first tabulated row and the well will not lift at all.

## What it refuses

The traverse is passed in. This module solves no inflow and no multiphase outflow, so the crossing is exactly as good as the table handed to it. The gas column on the injection side is static: no friction, no velocity, no injection rate in the annulus at all.

## The mistake

Reading `limitedBy` = depth as an answer. The number 8000.000000000 ft reads like a depth the engine chose. It is the end of the table, returned unchanged at three surface pressures that are not the same system.

## Exercise

Run the published traverse at surface pressures of 1014.7, 1064.7 and 1214.7 psia and write the depth and `limitedBy` for each.

Then say in one sentence which of the three answers is a crossing and how the other two would be misread by a report that printed depth alone.
