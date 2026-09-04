# The load range

Peak minus minimum. It is the number the rods actually feel, because steel fails on the swing and not on the average.

{{panel:pd-card-explorer}}

## Three cases, three ranges

The published taper returns a load range of 8038.598759155 lb at 5 spm and 10667.390282828 lb at 9 spm. ODUMA-4 at 10 spm returns 16920.405077660 lb.

Going from 5 to 9 spm on the published taper widened the range, and both ends of the card contributed: the peak climbed and the minimum fell. The range is the only one of the three headline numbers that collects both movements.

## What it is read against

`Skr` is the load scale of the RP 11L reading, the spring rate of the string times the surface stroke. On ODUMA-4 it is 32209.861648 lb, and the design's dimensionless groups come back as `Fo over Skr` 0.145616883, `F1 over Skr` 0.312933201 and `F2 over Skr` 0.212384333. Those groups are definitions, so they are computed whatever route produced the loads.

The other thing the range is read against is a stress allowable, and that is a different quantity in different units. On ODUMA-4 the top section runs from 25210.199822 psi down to 2969.187943 psi against a modified Goodman allowable of 30420.168218 psi, which is 82.873308396 percent. The middle section reaches 79.475629731 percent and the bottom 76.289598262 percent.

## The two readings are not taken the same way

The reported peak and minimum are read off the surface card the function returns. The section maxima and minima that feed the Goodman check are read off the tension envelope the march accumulated. They come out of one call and describe the same cycle, but they are two different samplings of it, so a range built from one pair is not interchangeable with a range built from the other.

Quoting a reported load range and a Goodman percentage in the same sentence, as though the second were the consequence of the first, is the mistake this distinction exists to prevent.

## What widens it

The range widens with speed and it widens with damping. On ODUMA-4 it runs 16157.838473 lb at a damping ratio of 0.0800, 16391.417339 at 0.1000, 16920.405078 at 0.1200, 17445.334032 at 0.1400, 17928.258368 at 0.1600, 18366.921471 at 0.1800 and 18689.749941 at 0.2000. Seven contiguous rows and a steady widening, on an input nobody measures.

## What it refuses

It carries no count of cycles, so it is not a life. The engine models no fatigue history at all, and a fatigue history is exactly what would turn a Goodman percentage into a number of years. It also says nothing about where on the string the swing is worst, since it is a surface number and the swing narrows with depth.

## Exercise

Write the load range for the published taper at 5 and at 9 spm and for ODUMA-4, and say which end of the card moved in each direction as the speed rose.

Then state the ODUMA-4 damping range at 0.0800 and at 0.2000 and name what that input is measured with.
