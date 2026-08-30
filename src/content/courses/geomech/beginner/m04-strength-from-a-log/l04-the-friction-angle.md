# The friction angle

The slope of the failure line, and the second place it appears.

{{panel:gm-stress-explorer}}

## What it is

The angle whose tangent describes how much extra load a rock carries per unit of confinement. It comes out of a set of triaxial tests: squeeze several plugs at several confining pressures and the failure points fall on a line.

## The ratio it produces

    q = (1 + sin(phi)) / (1 - sin(phi))

which is the slope of that line in principal stress space. The values for the seeds this course carries:

| lithology | friction angle | q |
|---|---|---|
| salt | 0 deg | 1 |
| shale | 20 deg | 2.0396067291614743 |
| sandstone | 35 deg | 3.6901723321426636 |
| limestone | 40 deg | 4.598909932113389 |
| dolomite | 45 deg | 5.828427124746189 |

## Reading the extremes

**Salt at zero.** q equals 1, which means confinement buys nothing: the rock can carry no stress difference at all. That is what makes salt flow, and it is why a salt section has to be drilled with mud at the overburden gradient rather than anywhere in a window.

**Dolomite at 45 degrees.** q of 5.83, so every megapascal of confinement buys nearly six megapascals of extra capacity. A strong rock at depth is very hard to collapse.

## The steepness

q is not linear in the angle, and it accelerates. Going from 20 to 25 degrees adds about 0.42 to q. Going from 40 to 45 adds about 1.23.

So a friction angle uncertainty matters much more in a strong rock than in a weak one.

## Where else it appears

**In the frictional bounds on the horizontal stresses**, from module 3. The same formula, with the friction angle of a FAULT rather than of the intact rock.

That is a genuine subtlety: the engine takes one friction angle and uses it in both places. A fault surface and an intact rock are not the same material, and a real study would use different values.

## What this course's runs use

32 degrees in the published set, giving 3.254588303299863. The capstone runs a different one.

## What lowering it does

Two things at once, in opposite directions.

**At the wall**, a lower friction angle means less confinement benefit, so the rock collapses more easily and the collapse pressure RISES.

**In the stress model**, a lower friction angle narrows the frictional bounds, which can clamp the horizontal stresses closer together and change the wall loading.

The Expert tier's sensitivity module walks both effects, because the net result is not obvious in advance.

## Exercise

Compute q for friction angles of 25 and 30 degrees and confirm the acceleration described above.

Then say what a friction angle of 60 degrees would give, and whether you would trust a model that used it.
