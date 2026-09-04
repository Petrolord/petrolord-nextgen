# Against a rule of thumb

The flat 0.02 psi/ft rule has no pressure in it, so it cannot be right on more than one column at a time. The engine header names it as the thing the module does not do.

{{panel:pd-column-explorer}}

## Three columns, three verdicts

| Column | Surface, psia | Local gradient over 0.02 at surface | At the packer | Rule error at the packer, psi |
| --- | --- | --- | --- | --- |
| 1 | 1014.7 | 1.270257 | 1.244654 | -41.016705 |
| 2 | 1414.7 | 1.993598 | 1.895866 | -206.539805 |
| 3 | 614.7 | 0.680826 | 0.667073 | 26.102397 |

Column 2 runs at close to twice the rule and the flat line misses its packer pressure by -206.539805 psi, which is 48.4222 percent of the whole lift. Column 3 runs about a third below the rule and the sign flips: the flat line reads high there by 26.102397 psi, 48.4296 percent of that column's lift. Anyone who learned only that the rule of thumb reads low has learned half of it.

## Why the pressure and not the depth

The real gas gradient is rho over 144, and rho goes as p over z times T. Pressure pushes it up, temperature pushes it down. On column 1 the local gradient runs 0.025405143 psi/ft at surface to 0.024893071 psi/ft at 8000 ft, a change of -2.0156 percent, while z rises from 0.869373540 to 0.915763920 and the temperature from 100.0000 to 190.0000 degF.

So the gradient falls with depth on all three published columns, because the geotherm outruns the compression.

## The isothermal control

Hold the same column at its wellhead temperature and only the compression is left. Column 1 then runs 0.025405143 to 0.032012925 psi/ft, a change of 26.0096 percent, and stands at 1243.177680881 psia at depth, 27.460976 psi above the column with its geotherm in place. Column 2 changes by 43.3641 percent and column 3 by 10.1002 percent, in the opposite direction to what the real columns do.

## The mistake

Telling a physical story that names one of two competing effects and stopping there. Gas compresses as it goes down, therefore the gradient grows with depth: plausible, tidy and wrong on every column here. The first draft of this course asserted exactly that direction and the measured columns caught it.

The cure is not a better story. It is the controlled comparison: run the column, then run it again with one effect held still, and read the difference of 27.460976 psi rather than arguing about it.

## What the comparison refuses

To rank the rule of thumb. It is not simply pessimistic or optimistic, and there is no correction factor that repairs it, because 1.993598 and 0.680826 are the same rule on two ordinary wells.

## Exercise

Read the engine column and the flat 0.02 psi/ft line at the packer for the 1414.7 psia case and for the 614.7 psia case.

Write both errors with their signs, then say what single property of the column decides which sign you get.
