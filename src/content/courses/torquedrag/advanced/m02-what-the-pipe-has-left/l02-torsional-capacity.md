# Torsional capacity

The other rating, and why it is the one that binds.

{{panel:td-buckling-explorer}}

## The expression

    torsional capacity = (shear yield) x (polar section modulus)

with the shear yield taken as a fraction of the tensile yield and the polar section modulus built from the two diameters.

For this drill pipe it comes to 100465.75263363292 N.m.

## The comparison that matters

| well | worst tension utilization | worst torsion utilization |
|---|---|---|
| vertical | 0.20310094303602616 | 0.026874829772549985 |
| slant | 0.2307349472932466 | 0.2210459893471787 |
| build and hold | 0.18186796279416603 | 0.26809334335788837 |
| three-dimensional turn | 0.11230771953702762 | 0.1558482191718046 |

Read the vertical row and the build-and-hold row against each other.

On the vertical well tension is nearly eight times torsion. On the build-and-hold well torsion has overtaken tension. Same string, same rating, different hole.

## Why the crossover happens

Tension accumulates from the string's weight, which grows with the LENGTH of the string but is reduced by cos(theta) as the hole deviates.

Torque accumulates from friction, which grows with the side force, which grows as the hole deviates.

So going from vertical to horizontal, tension falls and torque rises, and they cross somewhere in between.

## Where the load sits

Both maxima are at surface, for the same reason: both accumulate upward.

So the top joint of drill pipe carries the worst tension AND the worst torque simultaneously, which is exactly the situation combined loading is about.

## Why the ratings were written for the wrong case

Drill pipe ratings and the design practices around them come from an era of vertical and lightly deviated wells, where tension was always the binding constraint.

The torsional rating existed and was rarely the one that mattered. On a modern extended reach well it usually is, and the design conversation has moved with it.

## The practical consequence

A top drive with more torque capacity than the drill pipe is a hazard, because it can twist the string off. Torque limiters on the drive exist for that reason, and they are set from the pipe's rating rather than the drive's.

That is a different failure mode from anything in the tension direction: a string that parts in tension usually does so at a known load with warning, and a string that twists off does so at a connection, suddenly.

## Exercise

For each of the four wells in the table, compute the ratio of torsion utilization to tension utilization.

Then predict where the horizontal well would sit in that ranking before checking it in the next lesson.
