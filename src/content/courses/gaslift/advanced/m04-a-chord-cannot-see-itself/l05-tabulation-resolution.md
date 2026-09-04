# Tabulation resolution

The row spacing of the traverse handed in decides how wrong the injection depth is, and nothing in the engine will set it or check it.

{{panel:pd-unloading-explorer}}

## The published traverse, coarsened and refined

| Spacing, ft | Rows | Depth error, ft |
| --- | --- | --- |
| 4000.0000 | 3 | -22.800438454 |
| 2000.0000 | 5 | -8.103284162 |
| 1000.0000 | 9 | -1.318735072 |
| 500.0000 | 17 | 0.371645892 |
| 250.0000 | 33 | -0.000933670 |

The published case ships the 1000.0 ft row. Halve it twice and the error drops to thousandths of a foot.

## A curved traverse needs far finer rows

The teaching traverse on AKASO-3 is a teaching construct, not a published case, and it curves the way a real flowing traverse does. Its depth error is -60.420814470 ft at 2400.0 ft spacing, -10.817229242 ft at 1200.0 ft, -3.911670067 ft at 600.0 ft, -0.596884378 ft at 300.0 ft, -0.233172549 ft at 150.0 ft and -0.030202965 ft at 56.2500 ft.

Every one of those errors is negative. A chord under a convex traverse sits above the curve, so the crossing is found shallow at every spacing, and a design built on it puts the injection point higher than the gas could reach.

## Where refining stops helping

Past 250.0 ft on the published traverse the depth error stops falling and starts wandering: 0.002834866 ft at 125.0 ft spacing, 0.002067953 ft at 62.5 ft, 0.001021648 ft at 31.2500 ft. The traverse chord is no longer the biggest term, and the chord inside the injection curve sets the floor. Refining past that point buys nothing.

## The practice

Set the spacing from the curvature of the traverse rather than from whatever the model that produced it happened to print. Then halve it once and read the depth. If the depth moves, the first answer was not converged. Do not read the reported residual for this, because it falls on every refinement whether the depth improves or not.

## What it refuses

The engine does not resample. It walks the rows it is given and raises no warning when three arrive where thirty were needed. No field in the result carries the tabulation spacing, so a report that omits it cannot be audited later.

## Exercise

Run the published traverse at 4000.0, 1000.0 and 250.0 ft spacing and write the three depth errors.

Then say what spacing the teaching traverse needs to beat the published traverse at 1000.0 ft, and why the two answers differ so much for the same function.
