# Working the capstone

Six numbers from the standard clearance set and the magnetic model.

{{panel:wd-clearance-explorer}}

## What is asked

1. The minimum separation factor against offset 01, at the published assumptions.
2. The minimum separation factor against offset 09, the one that is very nearly zero.
3. The minimum separation factor against offset 10, the kicked-off case, which is negative.
4. The same case's minimum separation factor with the confidence factor raised to 5.0.
5. The worst declination error of the geomagnetic model against the NOAA test values, over all twelve points.
6. The declination the model gives at 80 degrees north, 0 degrees east, at sea level, at the start of 2025.

## The settings

**The clearance parameters** are the standard set: pedal-curve method, k 3.5, surface position sigma 0.5 m, tool projection allowance 0.3 m, reference radius 0.4572 m, offset radius 0.3048 m, and for offset 10 the kickoff depth the fixture states.

Field 4 changes ONLY the confidence factor. Everything else stays.

**The error model** for both wells is ISCWSA MWD Rev4 with each well's own header from the fixture.

**The magnetic model** is evaluated at the exact date and height the question states.

## The order

Do fields 5 and 6 first. They need only the magnetic model and no clearance machinery, and getting them right confirms the model is being evaluated at the right epoch before anything else depends on it.

Then fields 1, 2 and 3, which are the same call three times with a different offset.

Then field 4, which is field 3 with one parameter changed.

## The traps

**The minimum, not the value at the deepest station.** The separation factor is a curve and the answer is its minimum over the reference well's stations.

**Offset 10 has a kickoff.** Without it, the reference well's full covariance is used and the answer is different. The fixture supplies the depth.

**Field 3 is negative.** A sign dropped here gives a plausible positive number.

**Field 4 is not field 3 scaled by 3.5 over 5.** It is, arithmetically, because the numerator does not depend on k, but computing it that way rather than by rerunning is exactly the shortcut this module warns about. Run it.

**Field 5 is a maximum over twelve points, in degrees.** Not an average, and not in minutes of arc.

**Field 6 is at the epoch 2025.0**, not at today's date. The model drifts and the answer moves.

## What to notice while you work

Field 2 is very nearly zero, which means the two wells' envelopes are all but touching. Field 3 is below zero, which means they overlap.

Field 4 is closer to zero than field 3, which reads as an improvement and is not. That is the sharpest lesson in the tier and the capstone grades both numbers so that the comparison has to be made.

Field 5 is a few thousandths of a degree, which is the printing precision of the published table.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives: the grader is checking the calculation was run rather than estimated. Field 6's tolerance is tighter than the gap between the model's answer and the published two-decimal value, so quoting 1.28 will not pass.

## Exercise

Before opening the panel, write down for each field the function that produces it and the units of its answer.

Then produce the six. If fields 3 and 4 do not have the relationship the module predicted, one of them was run with the wrong parameters.
