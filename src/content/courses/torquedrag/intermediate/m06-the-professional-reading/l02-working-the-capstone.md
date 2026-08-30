# Working the capstone

Six numbers from four wells, and the one that needs a solver.

{{panel:td-friction-explorer}}

## What is asked

1. The build-and-hold well's surface torque while rotating on bottom.
2. The horizontal well's surface torque while rotating on bottom.
3. The build-and-hold well's maximum side force per metre while rotating on bottom.
4. The three-dimensional turn well's surface torque while back reaming.
5. The horizontal well's minimum tension while slide drilling, which is negative.
6. The open-hole friction factor that makes the build-and-hold well's pick-up hookload exactly 1100000 N.

## The settings

**Fields 1 to 5** run at the book friction factors, 0.25 cased and 0.35 open hole, with 120 rpm, 0.3 m/s trip speed, 89000 N weight on bit, 2700 N.m bit torque and the default 10 m step.

**The mud is 1500 kg/m3, not the 1440 the lessons run on.** The same change applies at every tier of this capstone, and it is why none of the six answers is a number a lesson printed. Buoyancy changes the buoyed weight, which changes the tension, which changes the side force, which changes the torque, so all six move.

**Field 6** changes only the OPEN-HOLE factor. The cased-hole factor stays at 0.25, the mud stays at 1500 kg/m3, and the operation is `trip_out`.

## The order

Fields 1 and 2 first: one run each, read the surface torque.

Field 3 next, from the same run as field 1. The maximum side force is a summary of the whole profile, not the value at any particular depth.

Field 4 is a different well and a different operation. Back reaming is rotating AND moving up, so its torque is not the same as rotating off bottom.

Field 5 is the minimum tension, not the hookload. On the horizontal well sliding, the hookload is -156755.75915568782 N and the minimum tension is a different and larger negative number.

Field 6 last, because it needs the inverse solver. Bisect on the open-hole factor until the pick-up hookload hits 1100000 N, then verify by running forward at the answer.

## The traps

**Field 3 is per metre.** The engine reports side force as force per unit length of string, so the units are N/m and not N. A total force over an interval would be a much bigger number.

**Field 4 is back reaming, not rotating off bottom.** On this well the two differ by a few hundred newton-metres, which is close enough that the wrong one looks entirely plausible.

**Field 5 is a minimum, not a hookload.** Both are negative on this case, which removes the sign as a discriminator.

**Field 6 changes one factor, not both.** Fitting both is under-determined; the capstone fixes the cased one at its book value, and a fit that moved both would land somewhere else.

**Field 6's tolerance is 0.0005.** Bisect properly rather than trying a few values by hand.

## What to notice while you work

Field 2 is smaller than field 1 even though the horizontal well is more deviated, because it is a shorter well with less string in contact.

Field 6 comes out above the book value of 0.35. That is what a well with more drag than planned looks like, and the heavier mud pushes it further.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives: the grader is checking the calculation was run rather than estimated.

## Exercise

Before opening the panel, write down for each of the six fields which engine call produces it and what units its answer is in.

Three of the six are in newton-metres, one is in newtons, one is in newtons per metre and one is dimensionless.
